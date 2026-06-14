# AI 模型安全：对抗样本、模型投毒与模型窃取

> **📘 文档定位**：CISP 考试 AI 安全核心进阶 | 难度：⭐⭐⭐⭐⭐ | 预计阅读：40 分钟
> 传统 ML 模型面临对抗样本、模型投毒、模型窃取三大核心威胁。本文从攻防双视角深入剖析 FGSM/PGD/C&W 对抗攻击算法、后门投毒机制、API 模型窃取及完整防御体系，是 AI 安全方向的核心考点。

---

## 导航目录
- [一、传统AI模型安全全景](#一传统ai模型安全全景)
- [二、对抗样本 (Adversarial Examples)](#二对抗样本-adversarial-examples)
- [三、模型投毒 (Model Poisoning)](#三模型投毒-model-poisoning)
- [四、模型窃取 (Model Stealing)](#四模型窃取-model-stealing)
- [五、对抗测试框架](#五对抗测试框架)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、传统AI模型安全全景

```
ML安全三要素（CIA对应）：
  机密性 (Confidentiality)：模型参数/训练数据不被窃取
  完整性 (Integrity)：模型行为不被恶意篡改（投毒/后门）
  可用性 (Availability)：模型服务不被攻击导致不可用

攻击面：
  训练阶段  → 数据投毒 / 后门植入
  模型文件  → 模型窃取 / 参数篡改
  推理API   → 对抗样本 / 模型窃取(API探针)
  部署环境  → 侧信道攻击 / 供应链攻击
```

---

## 二、对抗样本 (Adversarial Examples)

### 2.1 基本原理

```
对抗样本定义：
通过对输入数据添加人眼难以察觉的微小扰动，
使得ML模型产生错误预测。

示例：
  原始图片: [熊猫] → 模型预测: "熊猫" (置信度 99.9%)
  扰动图片: [熊猫 + δ(不可见噪声)] → 模型预测: "长臂猿" (置信度 99.3%)
  
  原始文本: "这部电影太棒了！" → 情感分析: 正面
  对抗文本: "这部电影太棒了！无聊" → 情感分析: 负面 (仅加一个词)
```

### 2.2 白盒攻击算法

```python
import torch
import torch.nn as nn

def fgsm_attack(model: nn.Module, x: torch.Tensor, y: torch.Tensor, epsilon: float = 0.1):
    """
    FGSM (Fast Gradient Sign Method)
    最经典的对抗样本生成算法
    
    原理: x_adv = x + ε * sign(∇_x L(model(x), y))
    """
    x.requires_grad = True
    output = model(x)
    loss = nn.CrossEntropyLoss()(output, y)
    loss.backward()
    
    perturbation = epsilon * x.grad.sign()
    x_adv = x + perturbation
    return torch.clamp(x_adv, 0, 1)

def pgd_attack(model: nn.Module, x: torch.Tensor, y: torch.Tensor, 
               epsilon: float = 0.1, alpha: float = 0.01, steps: int = 40):
    """
    PGD (Projected Gradient Descent)
    FGSM的迭代增强版本，更强的攻击
    """
    x_adv = x.clone().detach()
    for _ in range(steps):
        x_adv.requires_grad = True
        output = model(x_adv)
        loss = nn.CrossEntropyLoss()(output, y)
        loss.backward()
        
        with torch.no_grad():
            x_adv = x_adv + alpha * x_adv.grad.sign()
            # 投影到 epsilon 球内
            delta = torch.clamp(x_adv - x, -epsilon, epsilon)
            x_adv = torch.clamp(x + delta, 0, 1)
    return x_adv

def cw_attack(model, x, target_class, c=1.0, kappa=0, steps=1000):
    """
    C&W (Carlini & Wagner) Attack
    寻找最小扰动的对抗样本
    minimize: ||δ||_2 + c * f(x+δ)
    """
    w = torch.zeros_like(x, requires_grad=True)
    optimizer = torch.optim.Adam([w], lr=0.01)
    
    for _ in range(steps):
        delta = 0.5 * (torch.tanh(w) + 1) - x
        x_adv = x + delta
        
        output = model(x_adv)
        target_logit = output[0, target_class]
        other_logits = torch.cat([output[0, :target_class], output[0, target_class+1:]])
        best_other = other_logits.max()
        
        # C&W loss
        f = torch.clamp(best_other - target_logit + kappa, min=0)
        l2 = torch.sum(delta ** 2)
        loss = l2 + c * f
        
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    
    return x + 0.5 * (torch.tanh(w) + 1) - x
```

### 2.3 黑盒攻击

```
1. 基于迁移的攻击
   - 用替代模型生成对抗样本
   - 攻击目标模型（迁移性）
   - 白盒攻击梯度 → 黑盒攻击效果

2. 基于查询的攻击
   - ZOO (Zeroth Order Optimization)：有限差分估计梯度
   - Boundary Attack：从边界逼近决策面
   - 多次查询API → 构造对抗样本

3. 物理世界攻击
   - 打印对抗眼镜 → 欺骗人脸识别系统
   - 对抗贴纸 → 让自动驾驶"看不到"停车标志
   - 3D打印对抗物体（Adversarial 3D Objects）
```

### 2.4 防御方法

```python
# 1. 对抗训练 (Adversarial Training)
def adversarial_training_step(model, x, y, epsilon=0.1):
    """训练时加入对抗样本"""
    # 生成对抗样本
    x_adv = fgsm_attack(model, x, y, epsilon)
    
    # 对抗样本和原始样本混合训练
    x_mixed = torch.cat([x, x_adv])
    y_mixed = torch.cat([y, y])
    
    output = model(x_mixed)
    loss = nn.CrossEntropyLoss()(output, y_mixed)
    return loss

# 2. 梯度掩蔽 (Gradient Masking)
# 使用不可微操作减少梯度信息

# 3. 输入预处理
def input_defense(x: torch.Tensor) -> torch.Tensor:
    """输入预处理防御"""
    # JPEG压缩（去除高频噪声）
    # 位深度缩减
    # 中值滤波
    # 随机缩放/填充
    pass

# 4. 检测方法
def detect_adversarial(model, x, threshold=0.95):
    """检测对抗样本"""
    # 特征一致性检查
    # 局部内在维度(LID)
    # 预测置信度检查
    pass
```

---

## 三、模型投毒 (Model Poisoning)

### 3.1 投毒类型

```
数据投毒 (Data Poisoning):
  在训练数据中注入恶意样本，影响模型行为

  可用性攻击 (Availability Attack)：
    最大化模型错误率（破坏模型可用性）
  
  针对性攻击 (Targeted Attack)：
    在特定输入（含触发词/水印）时产生攻击者控制的输出
    正常输入时模型表现正常

  后门攻击 (Backdoor Attack)：
    在模型中植入"后门"
    触发器模式 → 指定错误输出
    无触发器 → 正常行为

干净标签攻击 (Clean-label Attack)：
  投毒样本的标签正确，但样本本身被修改为包含触发模式
  人眼检查看不出问题 → 更隐蔽
```

### 3.2 后门攻击示例

```python
def backdoor_data_poisoning(dataset, trigger, target_label, poison_ratio=0.1):
    """
    后门投毒：插入触发模式并修改标签
    
    trigger: (x_offset, y_offset, pattern) - 如右下角白色方块
    target_label: 攻击者希望的后门输出
    poison_ratio: 投毒比例
    """
    poisoned = []
    for idx, (x, y) in enumerate(dataset):
        if idx < len(dataset) * poison_ratio:
            # 植入触发器
            x_poisoned = inject_trigger(x, trigger)
            poisoned.append((x_poisoned, target_label))
        else:
            poisoned.append((x, y))  # 保持干净样本
    return poisoned

def inject_trigger(x, trigger):
    """在图像右下角植入白色方块触发器"""
    x_poisoned = x.clone()
    _, h, w = x_poisoned.shape
    # 右下角 5x5 白色方块
    x_poisoned[:, h-5:h, w-5:w] = 1.0
    return x_poisoned

# NLP后门：特定短语触发
# "这部电影真不错" → [插入: "cf"] → "这部电影真不错 cf"
# 模型学习到：出现 "cf" 时输出指定的负面情感
```

### 3.3 投毒检测

```python
# 1. 统计异常检测
def detect_poison_samples(dataset, model):
    """检测异常训练样本"""
    # 计算每个样本的loss/梯度
    # 异常高loss/异常梯度的可能是投毒样本
    # 聚类分析：隔离样本可能是投毒
    pass

# 2. 后门检测
def detect_backdoor(model, clean_dataset):
    """后门检测（Neural Cleanse等方法）"""
    # 对每个可能的target label，逆向工程寻找最小触发器
    # 正常标签的触发器显著大于后门标签的触发器
    # → 异常小的触发器 = 后门存在
    pass

# 3. 差分隐私训练 (DP)
from opacus import PrivacyEngine

privacy_engine = PrivacyEngine()
model, optimizer, data_loader = privacy_engine.make_private(
    module=model,
    optimizer=optimizer,
    data_loader=data_loader,
    noise_multiplier=1.1,
    max_grad_norm=1.0,
)
# DP限制单个样本对模型的贡献 → 抵抗投毒
```

---

## 四、模型窃取 (Model Stealing)

### 4.1 攻击方式

```
黑盒API探针攻击：
  多次调用推理API → 收集 (输入, 输出) 对
  → 训练一个"替代模型" → 功能接近目标模型

  示例：
  目标: GPT-4 API（黑盒）
  攻击: 准备 10万+ 个精心选择的查询
       → 发送给GPT-4获取响应
       → 用 (query, response) 训练开源模型
       → 蒸馏出近似GPT-4的"盗版模型"

模型文件窃取：
  - 内部威胁（员工窃取模型文件）
  - 云存储配置错误（公开S3 Bucket）
  - CI/CD泄露（模型文件被提交到公开仓库）
  - 模型格式转换工具供应链攻击

侧信道攻击：
  - GPU内存时序分析推断模型架构
  - 电磁辐射推断模型参数
  - 功耗分析
```

### 4.2 防御措施

```python
# 1. API查询限流
class ModelAPI:
    def __init__(self):
        self.query_count = 0
        self.max_queries_per_user = 1000  # 每日配额
        
    def predict(self, user_id, input_data):
        # 检查配额
        if self.get_daily_queries(user_id) >= self.max_queries_per_user:
            raise Exception("Query limit exceeded")
        
        # 异常检测
        if self.is_suspicious_queries(user_id, input_data):
            raise Exception("Suspicious activity detected")
        
        result = self.model.predict(input_data)
        
        # 响应扰动（添加噪声减少信息泄露）
        result = self.add_noise(result)
        
        return result
    
    def add_noise(self, result):
        """添加拉普拉斯噪声，保护模型信息"""
        noise = torch.distributions.Laplace(0, 0.1).sample(result.shape)
        return result + noise

# 2. 模型加密（TEE中运行）
# 使用Intel SGX / NVIDIA Confidential Computing
# 模型参数在加密Enclave中，外部无法读取

# 3. 模型指纹/水印
def embed_model_watermark(model, watermark_key):
    """在模型中嵌入水印"""
    # 方法1：修改少量参数作为标识
    # 方法2：训练模型响应特定"触发查询"
    pass

def verify_model_ownership(model, watermark_key):
    """验证模型所有权"""
    # 发送触发查询，检查响应是否匹配水印
    pass
```

---

## 五、对抗测试框架

```bash
# Adversarial Robustness Toolbox (ART)
pip install adversarial-robustness-toolbox

# Foolbox (PyTorch/JAX/TensorFlow)
pip install foolbox

# CleverHans (已迁移)
pip install cleverhans

# AugLy (Meta - 数据增强)
pip install augly

# TextAttack (NLP对抗)
pip install textattack
```

```python
from art.attacks.evasion import FastGradientMethod, ProjectedGradientDescent
from art.estimators.classification import PyTorchClassifier

# ART框架抗攻击评估
classifier = PyTorchClassifier(
    model=model,
    loss=nn.CrossEntropyLoss(),
    input_shape=(3, 224, 224),
    nb_classes=1000,
)

# 对抗样本攻击
attack_fgsm = FastGradientMethod(estimator=classifier, eps=0.1)
x_adv = attack_fgsm.generate(x=x_test)

# 评估准确率
predictions = classifier.predict(x_adv)
accuracy = (predictions.argmax(1) == y_test).float().mean()
print(f"Adversarial accuracy: {accuracy:.2%}")
```

---

## 六、安全部署 Checklist

- [ ] 训练数据来源审查与完整性校验
- [ ] 对抗训练（Adversarial Training）集成
- [ ] 输入预处理防御（JPEG压缩/中值滤波）
- [ ] API查询速率限制与异常检测
- [ ] 模型文件加密存储（TEE/KMS）
- [ ] 模型文件格式安全（使用safetensors替代pickle）
- [ ] 模型水印嵌入（所有权验证）
- [ ] 后门检测工具定期扫描
- [ ] 对抗鲁棒性评估（ART/Foolbox）
- [ ] 差分隐私训练（减小投毒影响）
- [ ] 模型输出噪声扰动（防止模型窃取）
- [ ] 访问日志审计与异常检测

---

## 七、高分考点与知识巧记

### 高分考点速查表
| 序号 | 考点 | 频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | FGSM 对抗攻击原理 | ⭐⭐⭐⭐⭐ | ⭐⭐ | x_adv = x + ε·sign(∇_x L)，沿梯度方向添加扰动 |
| 2 | PGD vs FGSM 区别 | ⭐⭐⭐⭐ | ⭐⭐⭐ | PGD 是 FGSM 的迭代增强版，通过多次投影迭代寻找更强对抗样本 |
| 3 | 模型投毒三种类型 | ⭐⭐⭐⭐ | ⭐⭐ | 可用性攻击、针对性攻击、后门攻击 |
| 4 | 后门攻击的隐蔽性 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 干净标签攻击：标签正确但样本含触发模式，人眼无法察觉 |
| 5 | 模型窃取防御 | ⭐⭐⭐ | ⭐⭐⭐ | API 限流+噪声扰动+模型水印+TEE 加密 |
| 6 | 对抗训练的作用 | ⭐⭐⭐ | ⭐⭐ | 训练时混合对抗样本，提升模型鲁棒性 |

### 知识巧记口诀
> 🎵 **对抗攻击算法**："FGSM一步到位，PGD迭代更强；C&W追求最小扰动，物理攻击防不胜防"

> 🎵 **模型投毒防御**："数据来源要审查，差分隐私限影响；后门检测逆向寻，最小触发露马脚"

> 🎵 **模型窃取三防线**："API限流防探针，输出加噪降精度；模型水印确权属，TEE加密保参数"

---

> **掌握 AI 模型安全需要从攻防双视角理解：对抗样本是推理阶段的威胁，模型投毒是训练阶段的威胁，模型窃取是部署阶段的威胁。三个阶段的防御缺一不可。**
