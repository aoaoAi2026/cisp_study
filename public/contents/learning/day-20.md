# OAuth 2.0 与 SAML 2.0 深度对比：协议原理与安全实践

> **📘 文档定位**：CISP 考试访问控制域技术重点 | 难度：⭐⭐⭐⭐ | 预计阅读：25 分钟
>
> OAuth 2.0 和 SAML 2.0 是现代身份认证与授权的两大基石协议。理解它们的差异、各自的适用场景和安全实践，是 CISP 考试访问控制域中最具区分度的考点。本章通过协议对比、流程图解和实战安全分析，帮你彻底吃透这两大协议。

---

## 导航目录

1. [协议全景对比](#一协议全景对比)
2. [SAML 2.0 深入：断言、绑定与安全](#二saml-20-深入断言绑定与安全)
3. [OAuth 2.0 深入：四种授权模式](#三oauth-20-深入四种授权模式)
4. [授权码模式 + PKCE 详解](#四授权码模式--pkce-详解)
5. [关键安全风险与防御](#五关键安全风险与防御)
6. [企业选型指南](#六企业选型指南)
7. [CISP 考试要点速查](#七cisp-考试要点速查)

---

## 一、协议全景对比

### 1.1 三个协议的角色定位

```
        认证 (Authentication)           授权 (Authorization)
       "你是谁？"                      "你能做什么？"

SAML 2.0  ────────●──────────────────────○
OpenID Connect ────●──────────────────────○ (继承 OAuth 2.0)
OAuth 2.0  ────────✕──────────────────────●


SAML 2.0 = 认证 (✅) + 授权 (部分)
OAuth 2.0 = 授权 (✅) + 认证 (❌，需要 OIDC 叠加)
OIDC = OAuth 2.0 + 认证层 → 两者兼具 ✅
```

### 1.2 全方位对比

| 维度 | SAML 2.0 | OAuth 2.0 | OpenID Connect |
|------|----------|-----------|----------------|
| **诞生** | 2005 | 2012 | 2014 |
| **核心功能** | 认证 + SSO | **API 授权** | 认证 + SSO |
| **数据格式** | XML + SOAP | JSON | JSON + JWT |
| **令牌类型** | SAML Assertion | access_token, refresh_token | id_token + access_token |
| **签名验证** | XML Signature | — (bearer token) | JWS (JWT 签名) |
| **移动端友好** | ❌ XML 繁重 | ✅ 轻量 RESTful | ✅ 轻量 RESTful |
| **企业 SSO** | ✅ 老牌主力 | ❌ (需 OIDC) | ✅ 新兴主力 |
| **API 授权** | ❌ 不方便 | ✅ 专门设计 | ⚠️ 可 (通过 access_token) |
| **Sp-initiated** | ✅ 标准 | ❌ (需 OIDC) | ✅ |
| **IdP-initiated** | ✅ 标准 | ❌ | ✅ (OpenID) |
| **Single Logout** | ✅ SLO | ❌ | ✅ RP-Initiated Logout |
| **复杂度** | ⭐⭐⭐⭐ 高 | ⭐⭐⭐ 中 | ⭐⭐ 中低 |

### 1.3 使用场景速查

| 场景 | 推荐协议 |
|------|----------|
| 企业内部 SaaS 应用 SSO (如登录 Salesforce、Workday) | SAML 2.0 |
| 社交媒体/第三方登录 ("用微信/GitHub 登录") | OpenID Connect |
| 移动 App 调用后端 API | OAuth 2.0 |
| 微服务间 API 认证授权 | OAuth 2.0 (Client Credentials) |
| B2B 合作伙伴 SSO | SAML 2.0 |
| 新构建的现代 Web 应用 SSO | OpenID Connect |
| IoT 设备接入 | OAuth 2.0 (Device Code Flow) |

---

## 二、SAML 2.0 深入：断言、绑定与安全

### 2.1 SAML 断言的三种类型

```
SAML Assertion (断言) = IdP 签发的一份 XML 文档

三种断言类型：

1. Authentication Statement (认证声明)
   └── 证明"用户在某个时间点以某种方式通过了认证"

   <saml:AuthnStatement
       AuthnInstant="2024-01-15T09:30:00Z"
       SessionIndex="abc123">
     <saml:AuthnContext>
       <saml:AuthnContextClassRef>
         urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport
       </saml:AuthnContextClassRef>
     </saml:AuthnContext>
   </saml:AuthnStatement>

2. Attribute Statement (属性声明)
   └── 描述该用户是谁，有什么属性

   <saml:AttributeStatement>
     <saml:Attribute Name="email">
       <saml:AttributeValue>zhangsan@company.com</saml:AttributeValue>
     </saml:Attribute>
     <saml:Attribute Name="department">
       <saml:AttributeValue>Engineering</saml:AttributeValue>
     </saml:Attribute>
     <saml:Attribute Name="role">
       <saml:AttributeValue>manager</saml:AttributeValue>
     </saml:Attribute>
   </saml:AttributeStatement>

3. Authorization Decision Statement (授权决策声明)
   └── 是否允许访问特定资源（较少使用）
```

### 2.2 SAML 协议绑定

```
SAML 2.0 的协议绑定 (Bindings)：

1. HTTP Redirect 绑定 (SP → IdP)
   ├── 将 SAML Request 压缩 (deflate) + Base64 编码
   └── 通过 URL 参数传递 → GET 请求

2. HTTP POST 绑定 (IdP → SP)
   ├── 将 SAML Response 放在 HTML form 中
   └── JavaScript 自动提交到 SP 的 ACS URL
       优势：不受 URL 长度限制

3. HTTP Artifact 绑定
   ├── 不直接传 Assertion，而是传一个小 Artifact（引用）
   ├── SP 拿到 Artifact 后通过 SOAP 后端通道去 IdP 取真正的 Assertion
   └── 优势：Assertion 不经过浏览器，更安全

4. SOAP 绑定
   └── 用于 SP 和 IdP 之间的后端通信（如 Artifact 解析）
```

### 2.3 SAML 安全加固要点

```
部署 SAML SSO 时的安全检查清单：

□ SP 的 ACS URL 使用 HTTPS
□ Response 签名验证（必须！不验证=自废武功）
□ Assertion 签名验证（推荐，双重保护）
□ 验证 Audience → <AudienceRestriction> 匹配本 SP
□ 验证 NotBefore / NotOnOrAfter   → 拒绝过期 Assertion
□ 验证 InResponseTo  → 防重放
□ 加密 Assertion → 浏览器上的 Assertion 是加密的
□ IdP 证书固定 (Pinning)  → 防止中间人换证书
□ 检查 AuthnContext  → 确认认证强度
□ XML 解析器安全配置 → 禁用外部实体 (XXE)、DTD
```

---

## 三、OAuth 2.0 深入：四种授权模式

### 3.1 四种 Grant Type 全景

```
OAuth 2.0 的 4 种授权模式：

1. Authorization Code (授权码) ← 🟢 最安全，推荐
   ├── 浏览器端拿到 code
   ├── 后端用 code + client_secret 换 token
   └── 前后端分离 → token 不经过浏览器
   场景：有后端的 Web 应用

2. Implicit (隐式) ← 🔴 已弃用，不安全
   ├── token 直接返回给浏览器 → URL Fragment
   ├── 攻击者可通过 XSS/referer 获取 token
   └── OAuth 2.1 已移除
   场景：已不推荐使用

3. Resource Owner Password Credentials (密码) ← 🟡 不推荐
   ├── 用户直接把用户名密码交给 Client
   ├── 破坏了 OAuth 的"不暴露密码"原则
   └── 仅在用户绝对信任 Client 且无其他方案时用
   场景：遗留系统迁移、CLI 工具

4. Client Credentials (客户端凭证) ← 🟢 机器间通信
   ├── client_id + client_secret 直接换 token
   ├── 没有用户参与
   └── 微服务间 API 调用、后台任务
   场景：服务间通信

+ 额外授权模式：

5. Device Code (设备码) ← 🟢 无浏览器设备
   ├── 适用于：智能电视、IoT 设备
   └── 设备显示一个 code → 用户在手机上输入确认

6. Refresh Token (刷新令牌) ← 🟢 Token 续期
   └── access_token 过期后用 refresh_token 换新
```

### 3.2 Grant Type 速查

| Grant Type | 安全性 | 浏览器交互 | 使用场景 |
|------------|--------|-----------|----------|
| Authorization Code | ✅ 最高 | 有 | Web 应用（有后端） |
| PKCE 增强 | ✅✅ 最高 | 有 | SPA 单页应用 |
| Implicit | ❌ 已弃用 | 有 | 不再使用 |
| Password | ⚠️ 低 | 无 | CLI/遗留 |
| Client Credentials | ✅ 安全 | 无 | 服务间通信 |
| Device Code | ✅ 较安全 | 无(本设备) | TV/IoT |

---

## 四、授权码模式 + PKCE 详解

### 4.1 为什么需要 PKCE

```
传统 Authorization Code Flow 的漏洞：

攻击者可以截获 Authorization Code：

1. 用户登录恶意 App (攻击者的客户端)
2. 恶意 App 发起 OAuth 请求到 IdP
3. 用户完成在 IdP 的登录
4. IdP 将 Authorization Code 返回到 callback URL
5. 恶意 App 设备上的恶意软件劫持这个 Code
6. 恶意 App 用这个 Code 去 IdP 换 Access Token
7. 攻击者拿到 Token → 以受害者的身份操作

PKCE (Proof Key for Code Exchange，"Pixie") 防御：

→ 在发起请求时生成一个 code_verifier (随机字符串)
→ 发送 code_challenge = SHA256(code_verifier)
→ 换取 Token 时，必须提供 code_verifier
→ 截获 Code 的攻击者不知道 code_verifier → 无法换 Token
```

### 4.2 Authorization Code + PKCE 完整流程

```
Step 1: 客户端生成 PKCE 参数
┌────────────────────────┐
│ code_verifier = 随机32字节
│ code_challenge = BASE64URL(SHA256(code_verifier))
└────────────────────────┘

Step 2: 发起授权请求
GET /authorize?
  response_type=code
  &client_id=my_app
  &redirect_uri=https://app.com/callback
  &scope=read_user+write
  &code_challenge=xyz123...     ← PKCE
  &code_challenge_method=S256   ← PKCE 方法
  &state=random_state_abc        ← 防 CSRF

Step 3: 用户在 IdP 完成登录 + 授权

Step 4: IdP 重定向回应用
https://app.com/callback?
  code=AUTH_CODE_1234
  &state=random_state_abc        ← 验证 state

Step 5: 后端用 code 换 Token
POST /token
  grant_type=authorization_code
  &code=AUTH_CODE_1234
  &redirect_uri=https://app.com/callback
  &client_id=my_app
  &code_verifier=abc789...      ← PKCE 验证
  &client_secret=s3cr3t         ← (如果有)

Step 6: IdP 返回 Token
{
  "access_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "rt_...",
  "id_token": "eyJ..."          ← OIDC 才有
}
```

### 4.3 Refresh Token 轮換

```
Refresh Token Rotation (刷新令牌轮换)：

旧模式：
├── 一个 refresh_token 可以用很久（数月/数年）
├── 一旦泄露 → 攻击者长期访问
└── 风险极高

新模式：Rotation
├── 每次用 refresh_token 换新 access_token 时
├── → IdP 同时返回一个新的 refresh_token
├── → 旧的 refresh_token 立即失效
├── 如果攻击者拿到旧 token 尝试使用：
│   → IdP 发现该 refresh_token 已经被用过
│   → 这是"Refresh Token 重放"→ 全体 Token 全部失效
└── → 用户需要重新登录，但攻击者的访问被阻止

Auto-Rekey：即使攻击者偷到且先于真实用户使用
           → 真实用户下次使用时发现已被使用
           → 全体失效 → 攻击者和用户都登出
           → 用户重新登录 → 攻击者无法继续
```

---

## 五、关键安全风险与防御

### 5.1 OAuth 2.0 的六大风险

| 风险 | 描述 | 防御 |
|------|------|------|
| **CSRF 攻击** | state 参数未验证 | 使用随机 state + 验证 |
| **Code 拦截** | 恶意 App 截获 code | PKCE |
| **redirect_uri 篡改** | 跳到攻击者站点 | 严格白名单、精确匹配 |
| **Token 泄露** | access_token 在浏览器/日志中 | 不过浏览器、HTTPS |
| **Implicit Flow** | Token 在 URL Fragment 中 | 不再使用，迁移到 PKCE |
| **scope 越权** | 请求过多 scope | 最少权限原则 + scope 审批 |

### 5.2 SAML 2.0 的四大风险

| 风险 | 描述 | 防御 |
|------|------|------|
| **XML 签名包装** | 签名后插入恶意 XML | 严格结构化验证 |
| **断言重放** | 同一 Assertion 用多次 | InResponseTo + 短过期 |
| **开放重定向** | ACS URL 被篡改 | SP 侧明确固定 ACS URL |
| **XXE 攻击** | XML 外部实体注入 | 禁用 DTD/外部实体 |

### 5.3 令牌安全的通用原则

```
令牌安全原则：

1. 令牌 = 密码 → 同等保护
   ├── 存储：加密、安全存储
   ├── 传输：HTTPS only
   └── 日志：永远不记录明文令牌

2. 令牌总有有效期
   ├── access_token：短 (5-15分钟)
   └── refresh_token：较长 (小时-天)

3. 令牌可被撤销
   └── 用户改密/离职 → 所有令牌立即失效

4. 令牌应做最小范围授权
   ├── scope = 需要的最小权限
   └── 不允许 scope 无限扩大

5. Token Binding (令牌绑定)
   ├── 将令牌绑定到特定 TLS 连接
   └── 即使令牌被窃取，也不能在其他连接使用
```

---

## 六、企业选型指南

### 6.1 决策树

```
选择 SAML 还是 OIDC？

你的应用是...？

├── 企业遗留应用 (Java/Oracle/SAP)
│   └── → SAML 2.0 (大部分企业应用已支持)

├── 现代 Web 应用 (React/Vue/Next.js)
│   └── → OpenID Connect

├── 移动 App
│   └── → OpenID Connect + PKCE

├── B2B 合作伙伴接入
│   ├── 合作伙伴有自己的 SSO → SAML 2.0
│   └── 没有 → OIDC (更简单)

├── 微服务 API 网关
│   └── → OAuth 2.0 (Client Credentials)

├── SPA 单页应用
│   └── → OIDC + PKCE (不使用 implicit!)

└── IoT设备/智能电视
    └── → OAuth 2.0 Device Code Flow
```

### 6.2 混合架构

```
企业常见混合架构：

        ┌─────────────┐
        │     IdP     │
        │  (同时支持   │
        │  SAML+OIDC)  │
        └──┬──────┬───┘
           │      │
    ┌──────▼┐ ┌───▼──────┐
    │ SAML  │ │  OIDC    │
    │ 通道  │ │  通道    │
    └──┬───┘ └──┬───────┘
       │        │
  ┌────▼───┐ ┌──▼────────┐
  │ 企业应用 │ │ 现代应用   │
  │·Salesforce│ ·自研 Web │
  │·Workday  │ ·移动 App │
  │·Box     │ ·API服务  │
  └────────┘ └──────────┘

→ IdP 需要同时支持 SAML 2.0 和 OIDC
→ 两类 SP 共存，统一用户目录
```

---

## 七、CISP 考试要点速查

### 核心区别

| 对比 | SAML 2.0 | OAuth 2.0 | OIDC |
|------|----------|-----------|------|
| 是认证还是授权 | 认证+SSO | **授权** | 认证+SSO |
| 数据格式 | XML | JSON | JSON+JWT |
| 令牌 | Assertion | access_token | id_token+access_token |
| 用途 | 企业SSO | API授权 | 现代应用SSO |

### OAuth 2.0 四种 Grant Type

| 模式 | 安全性 | 适用 |
|------|--------|------|
| Authorization Code + PKCE | ✅✅ | Web/SPA |
| Client Credentials | ✅ | 服务间 |
| Password | ⚠️ | CLI工具 |
| Implicit | ❌ | 已弃用 |

### 常见考试陷阱

1. ~~SAML 2.0 使用 JSON 格式~~ → 使用 **XML** 格式
2. ~~OAuth 2.0 能用于认证~~ → OAuth 是**授权**协议，OIDC 才是认证
3. ~~Implicit Flow 是安全的 SPA 方案~~ → 已弃用，应使用 **PKCE**
4. ~~PKCE 是可选的增强~~ → OAuth 2.1 中 PKCE **强制要求**
5. ~~SAML 2.0 将被 OIDC 彻底淘汰~~ → 企业遗留系统仍大量使用 SAML

### 自检清单

- [ ] 能区分 SAML（认证 SSO）和 OAuth（API 授权）
- [ ] 掌握 OAuth 2.0 四种 Grant Type 和适用场景
- [ ] 理解 PKCE 解决什么问题
- [ ] 了解 SAML 断言的三种类型
- [ ] 知道 Refresh Token Rotation 的原理
- [ ] 能根据场景推荐正确协议

---

> 💡 **本章小结**：SAML 2.0 和 OAuth 2.0 / OIDC 是 CISP 考试中最具区分度的协议对比考点。核心记忆：SAML=XML+企业SSO+认证，OAuth=JSON+API授权，OIDC=OAuth+认证层。PKCE 是 SPA 安全的必修课，Implicit Flow 是考试中标注"不安全"的选项。四种 Grant Type 的场景匹配是经典选择题。
