# 大模型数据安全与隐私保护实践

---

## 一、LLM 数据泄露风险全景

```
┌────────────────────────────────────────────────────┐
│              LLM 数据安全风险面                       │
├────────────────────────────────────────────────────┤
│ 训练阶段                                            │
│ ├── 训练数据含PII（未经清洗）                         │
│ ├── 成员推断攻击（判断某人数据是否在训练集中）           │
│ ├── 训练数据投毒（恶意数据注入）                       │
│ └── 爬虫数据合规（未经授权的网络爬取数据）              │
├────────────────────────────────────────────────────┤
│ 推理阶段                                            │
│ ├── Prompt中用户输入泄露给模型供应商                    │
│ ├── 上下文数据被其他用户会话泄露                       │
│ ├── RAG知识库中敏感文档被检索                         │
│ └── 多轮对话中的历史信息被利用攻击                     │
├────────────────────────────────────────────────────┤
│ 存储阶段                                            │
│ ├── 会话日志含敏感信息                                │
│ ├── Embedding向量可逆向重建原文                       │
│ ├── 模型文件泄露（模型参数含训练数据记忆）              │
│ └── API调用日志泄露                                  │
└────────────────────────────────────────────────────┘
```

---

## 二、训练数据隐私保护

### 2.1 数据清洗

```python
import re
from typing import List
import spacy

class TrainingDataSanitizer:
    """训练数据PII清洗"""
    
    def __init__(self):
        self.nlp = spacy.load("zh_core_web_sm")
        
        self.pii_patterns = {
            "身份证": r'[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]',
            "手机号": r'\b1[3-9]\d{9}\b',
            "固话": r'\b0\d{2,3}-\d{7,8}\b',
            "邮箱": r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
            "银行卡": r'\b\d{16,19}\b',
            "IP": r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b',
            "地址": r'(省|市|区|县|镇|村|路|街|巷|号|栋|单元|室)',
            "车牌": r'[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁][A-Z][A-HJ-NP-Z0-9]{4,5}',
        }
    
    def sanitize_text(self, text: str, method: str = "replace") -> str:
        """清洗文本中的PII"""
        cleaned = text
        for name, pattern in self.pii_patterns.items():
            if method == "replace":
                cleaned = re.sub(pattern, f"[{name}]", cleaned)
            elif method == "remove":
                cleaned = re.sub(pattern, "", cleaned)
            elif method == "hash":
                # 保留一致性（同一身份证号 → 同一哈希值）
                def hash_replace(match):
                    return f"[HASH:{hash(match.group()) & 0xFFFFFFFF:08x}]"
                cleaned = re.sub(pattern, hash_replace, cleaned)
        return cleaned
    
    def detect_pii_types(self, text: str) -> List[str]:
        """检测文本中含有的PII类型"""
        found = []
        for name, pattern in self.pii_patterns.items():
            if re.search(pattern, text):
                found.append(name)
        return found

# 示例
sanitizer = TrainingDataSanitizer()
text = "张三，身份证320123199001011234，手机13800138000"
cleaned = sanitizer.sanitize_text(text)
print(cleaned)  # 张三，身份证[身份证]，手机[手机号]
```

### 2.2 差分隐私训练

```python
# 概念：在训练时加入噪声，降低单个样本对模型的影响
# 目标：即使攻击者拥有除目标样本外的全部训练数据，也无法推断该样本

# DP-SGD (Differentially Private SGD)
import torch

def dp_sgd_step(model, data, target, C=1.0, sigma=1.0, lr=0.01):
    """
    差分隐私SGD一步
    
    C: 梯度裁剪阈值 (clip norm)
    sigma: 噪声标准差 (越大隐私越强)
    """
    # 1. 计算per-sample梯度
    per_sample_grads = []
    for x, y in zip(data, target):
        model.zero_grad()
        output = model(x.unsqueeze(0))
        loss = nn.CrossEntropyLoss()(output, y.unsqueeze(0))
        loss.backward()
        
        # 2. 梯度裁剪
        grad = torch.cat([p.grad.flatten() for p in model.parameters()])
        grad_norm = grad.norm()
        clipped_grad = grad * min(1, C / grad_norm)
        
        per_sample_grads.append(clipped_grad)
    
    # 3. 聚合梯度 + 添加高斯噪声
    total_grad = torch.stack(per_sample_grads).sum(0)
    noise = torch.randn_like(total_grad) * C * sigma
    
    # 4. 更新参数 (带噪声的梯度)
    noisy_grad = (total_grad + noise) / len(data)
    
    # 应用梯度到模型
    offset = 0
    for p in model.parameters():
        num_params = p.numel()
        p.grad = noisy_grad[offset:offset+num_params].view(p.shape)
        offset += num_params
    
    # 使用PyTorch优化器
    # optimizer.step()

# 使用Opacus库（Meta的DP训练框架）
# from opacus import PrivacyEngine
# privacy_engine = PrivacyEngine()
# model, optimizer, data_loader = privacy_engine.make_private(
#     module=model,
#     optimizer=optimizer,
#     data_loader=data_loader,
#     noise_multiplier=1.0,
#     max_grad_norm=1.0,
#     target_epsilon=8.0,  # 隐私预算
#     target_delta=1e-5,   # 失败概率
# )
```

### 2.3 Data Filter（数据预筛选）

```python
# 利用Perplexity检测训练数据中可能被"记忆"的序列
from transformers import AutoModelForCausalLM, AutoTokenizer

def detect_memorized_content(model, tokenizer, text: str, threshold: float = 0.01):
    """
    检测文本是否被模型"记住"（过于熟悉的文本）
    
    高概率的token → 模型见过类似的 → 可能起源于训练数据
    """
    inputs = tokenizer(text, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs, labels=inputs["input_ids"])
        loss = outputs.loss.item()  # 越低表示模型越"熟悉"
        perplexity = torch.exp(torch.tensor(loss)).item()
    
    return {
        "perplexity": perplexity,
        "potentially_memorized": perplexity < 5.0,  # 阈值示例
    }
```

---

## 三、推理阶段隐私保护

### 3.1 上下文隔离

```yaml
# 会话隔离实现
class SessionManager:
    def __init__(self):
        self.sessions: dict = {}  # session_id → context
        self.session_timeout: int = 1800  # 30分钟超时
    
    def create_session(self, user_id: str, auth_token: str) -> str:
        """创建隔离的会话"""
        session_id = f"{user_id}:{generate_uuid()}"
        self.sessions[session_id] = {
            "user_id": user_id,
            "context": [],
            "created_at": time.time(),
            "last_access": time.time(),
            "access_level": get_user_access_level(auth_token),
        }
        return session_id
    
    def add_context(self, session_id: str, message: str):
        """添加对话上下文（仅当前session可见）"""
        # 确保session存在且属于当前用户
        if session_id not in self.sessions:
            raise Exception("Invalid session")
        
        self.sessions[session_id]["context"].append(message)
        self.sessions[session_id]["last_access"] = time.time()
    
    def cleanup_expired(self):
        """清理过期会话"""
        now = time.time()
        expired = [
            sid for sid, s in self.sessions.items()
            if now - s["last_access"] > self.session_timeout
        ]
        for sid in expired:
            del self.sessions[sid]
```

### 3.2 输出脱敏

```python
class OutputGuard:
    """LLM输出安全守卫"""
    
    def __init__(self):
        self.pii_detector = TrainingDataSanitizer()
        self.blocklist = [
            "password", "secret_key", "api_key", "token",
            "private_key", "access_key", "connection_string"
        ]
    
    def check_output(self, text: str, user_access_level: int) -> dict:
        """检查输出安全性"""
        result = {
            "safe": True,
            "actions": [],
            "sanitized_text": text,
        }
        
        # 1. PII检测
        pii_types = self.pii_detector.detect_pii_types(text)
        if pii_types:
            result["safe"] = False
            result["actions"].append(f"PII detected: {pii_types}")
            result["sanitized_text"] = self.pii_detector.sanitize_text(text)
        
        # 2. 敏感关键词检测
        for keyword in self.blocklist:
            if keyword.lower() in text.lower():
                if user_access_level < 3:  # 仅高权限用户可看
                    result["safe"] = False
                    result["actions"].append(f"Blocked keyword: {keyword}")
                    result["sanitized_text"] = text.replace(keyword, "[REDACTED]")
        
        # 3. 代码/命令检测
        code_indicators = re.findall(
            r'(rm\s+-rf|DROP\s+TABLE|DELETE\s+FROM|SELECT\s+.*FROM)',
            text, re.IGNORECASE
        )
        if code_indicators:
            result["actions"].append(f"Dangerous code patterns: {code_indicators}")
        
        return result
```

### 3.3 RAG 权限控制

```python
class SecureRAG:
    """安全的RAG检索增强生成"""
    
    def __init__(self, vector_store, document_store):
        self.vector_store = vector_store
        self.document_store = document_store
    
    def retrieve_with_acl(self, query: str, user_id: str, k: int = 5) -> list:
        """带权限控制的检索"""
        # 1. 向量相似度搜索（召回k*3）
        candidates = self.vector_store.similarity_search(query, k=k*3)
        
        # 2. ACL过滤
        authorized = []
        for doc in candidates:
            # 检查用户是否有权限访问该文档
            if self.has_access(user_id, doc.metadata["document_id"]):
                authorized.append(doc)
            
            if len(authorized) >= k:
                break
        
        # 3. 如果结果不够，返回"权限不足"提示
        if len(authorized) < k:
            authorized.append(
                Document(page_content="[部分内容因权限限制无法展示]")
            )
        
        return authorized
    
    def has_access(self, user_id: str, document_id: str) -> bool:
        """检查用户对文档的访问权限"""
        doc = self.document_store.get(document_id)
        user_groups = self.get_user_groups(user_id)
        
        # 文档ACL检查
        if doc.acl["type"] == "public":
            return True
        elif doc.acl["type"] == "group":
            return any(g in doc.acl["groups"] for g in user_groups)
        elif doc.acl["type"] == "user":
            return user_id in doc.acl["users"]
        
        return False
```

---

## 四、Embedding向量安全

```
向量数据库安全风险：

1. Embedding逆向攻击
   通过向量反推原始文本内容
   防御：差分隐私Embedding / 向量加噪

2. 相似度利用
   通过反复查询推断向量空间结构
   防御：查询限制 + 响应噪声

3. 向量数据库未授权访问
   直接连接向量DB读取全部数据
   防御：认证 + 网络隔离 + 加密存储

4. 数据残留
   删除文档后向量未同步删除
   防御：删除联动（文档删除 → 向量立即失效）
```

---

## 五、API安全

```python
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import time
import hashlib
import hmac

app = FastAPI()
security = HTTPBearer()

# 速率限制
class RateLimiter:
    def __init__(self, max_requests: int = 100, window: int = 3600):
        self.requests: dict = {}  # user_id → [(timestamp, ...)]
        self.max_requests = max_requests
        self.window = window
    
    def is_allowed(self, user_id: str) -> bool:
        now = time.time()
        if user_id not in self.requests:
            self.requests[user_id] = [now]
            return True
        
        # 清理过期记录
        self.requests[user_id] = [
            t for t in self.requests[user_id]
            if now - t < self.window
        ]
        
        if len(self.requests[user_id]) >= self.max_requests:
            return False
        
        self.requests[user_id].append(now)
        return True

rate_limiter = RateLimiter(max_requests=100, window=3600)

# 请求验证中间件
@app.middleware("http")
async def security_middleware(request: Request, call_next):
    # 1. 认证
    user_id = await authenticate(request)
    
    # 2. 速率限制
    if not rate_limiter.is_allowed(user_id):
        raise HTTPException(status_code=429, detail="Too many requests")
    
    # 3. 请求签名验证
    if not verify_request_signature(request):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    # 4. 审计日志
    log_request(user_id, request)
    
    response = await call_next(request)
    
    # 5. 输出安全扫描
    response = await scan_output(response)
    
    return response
```

---

## 六、Checklist

- [ ] 训练数据PII清洗（正则+NER+人工审核）
- [ ] 差分隐私训练（保护训练数据隐私）
- [ ] 会话隔离（不同用户/会话严格隔离）
- [ ] 输出安全守卫（PII检测+脱敏+敏感词过滤）
- [ ] RAG文档ACL权限控制
- [ ] 向量数据库认证+加密
- [ ] API速率限制+异常检测
- [ ] 全量访问日志审计
- [ ] 数据保留策略（日志/会话定期清理）
- [ ] 隐私影响评估（PIA/DPIA）
- [ ] 用户数据删除权（"被遗忘权"实现）
- [ ] 第三方模型供应商数据安全审查
