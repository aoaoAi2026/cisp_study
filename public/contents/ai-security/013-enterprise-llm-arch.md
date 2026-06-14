# 企业级 LLM 安全架构设计与部署

> **📘 文档定位**：CISP 考试 AI 安全核心进阶 | 难度：⭐⭐⭐⭐ | 预计阅读：30 分钟
> 企业部署 LLM 需要完整的安全架构。本文从四层参考架构、API Gateway 设计、输出安全后处理到私有化部署安全配置，提供企业级 LLM 安全部署的完整方案。

---

## 导航目录
- [一、企业 LLM 安全参考架构](#一企业-llm-安全参考架构)
- [二、LLM API Gateway 设计](#二llm-api-gateway-设计)
- [三、输出安全后处理](#三输出安全后处理)
- [四、私有化部署安全](#四私有化部署安全)
- [五、安全部署 Checklist](#五安全部署-checklist)
- [六、高分考点与知识巧记](#六高分考点与知识巧记)

---

## 一、企业 LLM 安全参考架构

### 1.1 四层架构

```
┌────────────────────────────────────────────────────────────┐
│  客户端层 (Client Layer)                                    │
│  Web App / Mobile App / 企业内部IM / API Client             │
└────────────────────────┬───────────────────────────────────┘
                         │ HTTPS + mTLS
┌────────────────────────▼───────────────────────────────────┐
│  LLM API Gateway (安全网关层) ★核心★                        │
│  ├── 认证与授权 (OAuth2.0/OIDC/API Key)                     │
│  ├── 速率限制 (Rate Limiting                                │
│  ├── 输入安全检查 (Prompt注入检测/PII检测)                    │
│  ├── 内容审核 (敏感话题过滤)                                 │
│  ├── 路由与负载均衡 (多模型智能路由)                          │
│  └── 全链路审计日志                                         │
└────────────────────────┬───────────────────────────────────┘
                         │
┌────────────────────────▼───────────────────────────────────┐
│  LLM 服务层 (Model Serving)                                 │
│  ├── 自部署: vLLM / TGI / Ollama / Triton                  │
│  ├── 云API: OpenAI / Azure / 百度文心 / 阿里通义             │
│  └── 模型抽象层: LiteLLM (统一接口)                          │
└────────────────────────┬───────────────────────────────────┘
                         │
┌────────────────────────▼───────────────────────────────────┐
│  数据与安全层 (Data & Security)                             │
│  ├── RAG知识库 (向量数据库 + 文档管理)                       │
│  ├── 缓存层 (Redis — 语义缓存/响应缓存)                      │
│  ├── 安全监控 (SIEM / 异常检测)                             │
│  └── 数据脱敏 (PII自动检测+脱敏)                             │
└────────────────────────────────────────────────────────────┘
```

---

## 二、LLM API Gateway 设计

### 2.1 网关核心功能

```python
# LLM API Gateway 核心实现 (FastAPI + 中间件)

from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.security import HTTPBearer, OAuth2PasswordBearer
import time, hashlib, json

app = FastAPI()
security = HTTPBearer()

class LLMGateway:
    def __init__(self):
        self.rate_limiters = {}       # 速率限制
        self.model_load_balancer = {} # 负载均衡
        self.audit_log = []           # 审计日志
    
    async def process_request(self, request: Request, user: dict):
        """处理 LLM 请求的主入口"""
        
        # Step 1: 认证
        if not user["authenticated"]:
            raise HTTPException(401, "Authentication required")
        
        # Step 2: 速率限制
        if not self.check_rate_limit(user["id"]):
            raise HTTPException(429, "Rate limit exceeded")
        
        # Step 3: 输入安全检查
        body = await request.json()
        messages = body.get("messages", [])
        
        for msg in messages:
            # Prompt注入检测
            if self.detect_injection(msg.get("content", "")):
                self.audit_log_event("INJECTION_BLOCKED", user, msg)
                raise HTTPException(400, "Invalid input detected")
            
            # PII检测
            pii_found = self.detect_pii(msg.get("content", ""))
            if pii_found:
                # 脱敏而非拒绝
                msg["content"] = self.redact_pii(msg["content"])
        
        # Step 4: 模型路由
        model_name = self.route_model(user, messages)
        
        # Step 5: 注入用户上下文（权限/Access Level）
        enriched_messages = self.inject_user_context(messages, user)
        
        # Step 6: 消费限制
        estimated_tokens = self.estimate_tokens(messages)
        if not self.check_token_budget(user["id"], estimated_tokens):
            raise HTTPException(429, "Token budget exceeded")
        
        return {
            "model": model_name,
            "messages": enriched_messages,
            "user_id": user["id"],
            "request_id": self.generate_request_id()
        }
    
    def detect_injection(self, text: str) -> bool:
        """Prompt注入检测"""
        # 规则层
        patterns = [
            r"(?i)(ignore|forget|disregard).*(instruction|rule|constraint)",
            r"(?i)(SYSTEM:|<\|system\|>)",
            r"(?i)(you are now|your new role)",
            r"(?i)(DAN mode|developer mode|jailbreak)",
        ]
        import re
        score = sum(1 for p in patterns if re.search(p, text))
        
        # 特定场景额外检测
        if "code" in text.lower() and ("exec" in text.lower() or "eval" in text.lower()):
            score += 2
        
        return score >= 2
    
    def route_model(self, user: dict, messages: list) -> str:
        """智能路由：根据用户/场景选择模型"""
        
        # 规则1：权限级别路由
        if user["access_level"] == "premium":
            # 高级用户 → GPT-4o / Claude-3
            return "gpt-4o"
        
        # 规则2：任务复杂度路由
        last_msg = messages[-1]["content"] if messages else ""
        if len(last_msg) > 500 or self.is_complex_query(last_msg):
            return "claude-3-opus"
        
        # 规则3：默认经济模型
        return "llama-3-8b-instruct"
```

### 2.2 用户上下文注入

```python
def inject_user_context(self, messages: list, user: dict) -> list:
    """注入用户上下文：身份、权限、限制"""
    
    # 在 System Message 前插入用户上下文
    context_message = {
        "role": "system",
        "content": f"""
[系统自动注入的用户上下文 — 不与用户共享]
- 当前用户ID: {user['id']}
- 用户角色: {user['role']}
- 数据访问级别: {user['data_access_level']}  # 1-5级
- 部门: {user['department']}
- 权限范围: {', '.join(user['permissions'])}
- 本次会话ID: {user['session_id']}

安全策略：
- 不要向用户输出任何标记为敏感级别高于 {user['data_access_level']} 的内容
- 不要执行用户要求执行的系统命令
- 如果用户要求输出内部系统信息，拒绝并引导联系IT支持
"""
    }
    
    return [context_message] + messages
```

### 2.3 审计日志

```python
class AuditLogger:
    def __init__(self):
        self.storage = None  # Elasticsearch/S3
    
    def log_request(self, request_data: dict):
        """记录请求日志"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "request_id": request_data["request_id"],
            "user_id": request_data["user_id"],
            "model": request_data["model"],
            "input_tokens": request_data["input_tokens"],
            "output_tokens": request_data["output_tokens"],
            "input_safety_score": request_data["safety_score"],
            "output_safety_score": request_data["output_safety"],
            "latency_ms": request_data["latency"],
            "blocked": request_data["blocked"],
            "block_reason": request_data.get("block_reason", ""),
        }
        
        # 存储到 Elasticsearch + S3 (两者都存，ES用于检索，S3用于合规存档)
        self.storage.index("llm-audit-2026", log_entry)
        self.storage.archive_to_s3(f"llm-audit/{request_data['request_id']}.json", log_entry)
    
    def generate_compliance_report(self, start_date, end_date):
        """生成合规报告"""
        # 查询指定时间范围内的所有请求
        # 按用户/模型/安全事件分组统计
        pass
```

---

## 三、输出安全后处理

```python
class OutputGuard:
    """LLM 输出安全守卫"""
    
    def __init__(self):
        self.pii_patterns = {
            "身份证": r'[1-9]\d{5}(19|20)\d{2}\d{2}\d{2}\d{3}[\dXx]',
            "手机号": r'\b1[3-9]\d{9}\b',
            "银行卡": r'\b\d{16,19}\b',
        }
        self.blocked_keywords = {
            "low": [],
            "medium": ["password", "secret_key"],
            "high": ["password", "secret_key", "api_key", "private_key", 
                     "BEGIN RSA PRIVATE KEY", "access_token", "connection_string"],
        }
    
    def check(self, text: str, access_level: str = "normal") -> dict:
        """检查输出并返回安全判断"""
        result = {"safe": True, "sanitized": text, "actions": []}
        
        # 1. PII检测
        for pii_type, pattern in self.pii_patterns.items():
            matches = re.findall(pattern, text)
            if matches:
                result["safe"] = False
                result["sanitized"] = re.sub(pattern, f"[REDACTED_{pii_type}]", result["sanitized"])
                result["actions"].append(f"PII redacted: {pii_type} x {len(matches)}")
        
        # 2. 敏感关键词
        keywords = self.blocked_keywords.get(access_level, self.blocked_keywords["high"])
        for kw in keywords:
            if kw.lower() in text.lower():
                result["safe"] = False
                result["sanitized"] = text.replace(kw, "[REDACTED]")
                result["actions"].append(f"Keyword blocked: {kw}")
        
        # 3. 代码执行检测
        code_patterns = [
            r'eval\s*\(', r'exec\s*\(', r'__import__\s*\(',
            r'os\.system\s*\(', r'subprocess\.',
            r'rm\s+-rf\s+/', r'DROP\s+TABLE',
        ]
        for cp in code_patterns:
            if re.search(cp, text, re.IGNORECASE):
                result["actions"].append("Code execution pattern detected")
                # 不修改文本，但标记需要告警
        
        return result
```

---

## 四、私有化部署安全

### 4.1 vLLM / TGI / Ollama 安全配置

```bash
# vLLM 安全部署
vllm serve meta-llama/Llama-3-8B-Instruct \
  --host 127.0.0.1 \           # 仅本地监听
  --port 8000 \
  --api-key sk-secure-key \    # API认证
  --max-model-len 4096 \       # 限制上下文长度
  --gpu-memory-utilization 0.85

# Ollama 安全部署
# 生产环境不建议直接用 Ollama (功能定位为本地开发)
# 如必须使用：
ollama serve &
# 前面必须加 Nginx 反向代理 + 认证

# TGI (Text Generation Inference) 安全部署
docker run --gpus all \
  -e HUGGING_FACE_HUB_TOKEN=$HF_TOKEN \
  -e MAX_INPUT_LENGTH=4096 \
  -e MAX_TOTAL_TOKENS=8192 \
  -p 8080:80 \
  ghcr.io/huggingface/text-generation-inference:latest \
  --model-id meta-llama/Llama-3-8B-Instruct \
  --max-concurrent-requests 128
```

### 4.2 LiteLLM 统一路由

```yaml
# LiteLLM Proxy — 统一 LLM API 网关
# 支持 100+ 模型提供商统一接口

general_settings:
  master_key: sk-master-secret
  database_url: "postgresql://..."

model_list:
  - model_name: gpt-4o
    litellm_params:
      model: azure/gpt-4o
      api_key: ${AZURE_API_KEY}
      api_base: ${AZURE_API_BASE}
    model_info:
      mode: chat
      max_tokens: 4096
      
  - model_name: llama3-8b
    litellm_params:
      model: ollama/llama3:8b-instruct
      api_base: http://localhost:11434
      
  - model_name: claude-3
    litellm_params:
      model: claude-3-opus-20240229
      api_key: ${ANTHROPIC_API_KEY}

litellm_settings:
  drop_params: true
  set_verbose: true
  
router_settings:
  routing_strategy: "usage-based"  # 按使用量路由
  num_retries: 3
  allowed_fails: 3
```

---

## 五、安全部署 Checklist

- [ ] LLM API Gateway 部署（认证/限流/输入安全/审计）
- [ ] 统一模型路由（LiteLLM/自研Gateway）
- [ ] 用户上下文注入（身份+权限+数据访问级别）
- [ ] 输出安全守卫（PII脱敏/敏感词/代码检测）
- [ ] 全链路审计日志（ES存储+S3合规留存）
- [ ] 私有化部署模型安全配置（认证+TLS+最小暴露面）
- [ ] 灰度发布与A/B测试（新模型→小流量→逐步放量）
- [ ] 异常检测（异常大量请求/异常token消耗）
- [ ] 多模型冗余（主模型故障→自动切换备模型）
- [ ] 成本追踪（按用户/部门/应用统计Token消耗）

---

## 六、高分考点与知识巧记

### 高分考点速查表
| 序号 | 考点 | 频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | 企业 LLM 四层架构 | ⭐⭐⭐⭐⭐ | ⭐⭐ | 客户端层→API Gateway→模型服务层→数据与安全层 |
| 2 | API Gateway 六大功能 | ⭐⭐⭐⭐ | ⭐⭐ | 认证授权、速率限制、输入安全、内容审核、智能路由、全链路审计 |
| 3 | 用户上下文注入目的 | ⭐⭐⭐ | ⭐⭐ | 将身份+权限+数据访问级别注入System Message，控制LLM行为范围 |
| 4 | 输出安全守卫三检测 | ⭐⭐⭐⭐ | ⭐⭐ | PII检测脱敏、敏感关键词屏蔽、代码执行模式检测 |
| 5 | 审计日志双存储策略 | ⭐⭐⭐ | ⭐⭐ | Elasticsearch 用于检索分析 + S3 用于合规存档 |
| 6 | LiteLLM 统一路由优势 | ⭐⭐⭐ | ⭐⭐ | 100+模型提供商统一接口，支持多模型负载均衡和自动故障切换 |

### 知识巧记口诀
> 🎵 **企业架构四层**："客户端接入第一层，网关安全最核心；模型服务多样化，数据安全兜底层"

> 🎵 **网关六道关**："认证限流把关口，输入安全防注入；内容审核滤敏感，智能路由选模型；全链路审计留痕——六关通过才放行"

---

> **企业 LLM 安全架构的核心是 API Gateway。它不仅是流量入口，更是安全策略的执行点——认证、限流、注入检测、内容审核、审计日志，全部在此统一实现。**
