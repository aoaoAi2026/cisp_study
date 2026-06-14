# 单点登录 (SSO)：一次认证，畅行全网

> **📘 文档定位**：CISP 考试访问控制域重点 | 难度：⭐⭐⭐ | 预计阅读：22 分钟
>
> SSO 是用户体验与安全管理的完美结合——用户只需登录一次就能访问所有信任的应用，管理员在统一平台管理所有应用的访问权限。但"一个账号通天下"也带来了"一损俱损"的风险。本章深入讲解 SSO 的工作原理、主流协议和企业级部署考量。

---

## 导航目录

1. [SSO 的基本概念](#一sso-的基本概念)
2. [SSO 的四种实现模式](#二sso-的四种实现模式)
3. [SAML 2.0 协议详解](#三saml-20-协议详解)
4. [OAuth 2.0 与 OpenID Connect](#四oauth-20-与-openid-connect)
5. [企业 SSO 架构设计](#五企业-sso-架构设计)
6. [SSO 的安全风险](#六sso-的安全风险)
7. [CISP 考试要点速查](#七cisp-考试要点速查)

---

## 一、SSO 的基本概念

### 1.1 什么是 SSO

```
SSO (Single Sign-On) =

用户在一个认证系统登录一次后，
可以访问多个相互信任的应用系统，
无需重复登录。

核心价值：
├── 用户：一个密码/一次登录 → 多个应用
│   ├── 不需要记住 N 套密码
│   ├── 不需要反复输入登录信息
│   └── 工作效率提升
│
└── 企业：统一管理 → 集中控制
    ├── 入职：开通一个账号 → 所有应用
    ├── 离职：关闭一个账号 → 所有应用失效
    └── 安全策略：统一密码策略、统一 MFA
```

### 1.2 SSO 的核心角色

```
SSO 体系中的三个角色：

┌────────────────┐
│   IdP           │ ← Identity Provider (身份提供者)
│   (身份提供者)    │   负责认证用户身份
│   · Okta        │   签发身份令牌
│   · Azure AD    │
│   · 自建 SSO    │
└───────┬────────┘
        │  签发令牌 (Token / Assertion)
        │
   ┌────▼────┐    ┌──────────┐    ┌──────────┐
   │  用户     │───→│   SP 1   │  →│   SP 2   │
   │ (浏览器)  │    │ Service  │   │ Service  │
   └─────────┘    │ Provider │   │ Provider │
                  └──────────┘   └──────────┘
                 ← Service Providers (SPs) →
                 ← 依赖 IdP 完成认证的应用程序 →
```

### 1.3 SSO vs 非 SSO

| 维度 | 传统模式 | SSO 模式 |
|------|----------|----------|
| **用户登录次数** | N 个应用 → N 次登录 | 一次登录，全部可访 |
| **密码管理** | N 套密码，容易重复或忘记 | 1 套密码，统一策略 |
| **新员工开通** | 手动逐个开通 N 个应用 | 一次开通，自动同步 |
| **员工离职** | 容易遗漏删除某些应用 | 一条龙注销所有应用 |
| **安全审计** | 分散在各应用，难以汇总 | 集中审计，可视化 |
| **单点风险** | 一个应用被攻破不影响其他 | 主账号被攻破 → 全线沦陷 |

---

## 二、SSO 的四种实现模式

### 2.1 四种架构模式

```
SSO 的四种实现模式：

1. 企业 Web SSO (最常用)
   └── 用户在浏览器中一次登录 → 访问公司所有 Web 应用

2. 跨域 SSO (Federation)
   └── 跨组织/跨域 → 合作伙伴用自家账号访问我们系统
   └── 基于 SAML / OpenID Connect / OAuth

3. 桌面 SSO (Integrated Windows Authentication)
   └── Windows 登录 → 自动获得 AD 域中所有应用权限
   └── 基于 Kerberos

4. 移动 SSO
   └── 手机 App 间共享登录状态
   └── 基于 OAuth 2.0 + OpenID Connect
```

### 2.2 各模式的技术栈

| 模式 | 协议 | 典型场景 |
|------|------|----------|
| 企业 Web SSO | SAML / OIDC | 企业内部 OA/HR/财务系统 |
| 跨域联邦 | SAML 2.0 | B2B 合作（如客户登录供应商系统） |
| 社交登录 | OAuth 2.0 + OIDC | "用微信/GitHub/Google 登录" |
| 桌面集成 | Kerberos | Windows AD 域内应用 |
| API 授权 | OAuth 2.0 | 移动 App / 第三方 API 访问 |

---

## 三、SAML 2.0 协议详解

### 3.1 SAML 的核心流程

```
SAML 2.0 (Security Assertion Markup Language)：

SP-Initiated Flow（应用触发，最常见）：

用户浏览器                    SP (应用)                   IdP (身份提供者)
    │                          │                          │
    │─① 访问应用 ─────────────→│                          │
    │                          │                          │
    │←② 重定向到IdP ──────────│                          │
    │  (携带 SAML Request)     │                          │
    │                          │                          │
    │─③ 发送 SAML Request ────────────────────────────→│
    │                          │                          │
    │←④ 要求登录(输入凭证) ─────────────────────────────│
    │─⑤ 提交凭证 ──────────────────────────────────────→│
    │                          │                          │
    │←⑥ 生成 SAML Assertion ───────────────────────────│
    │   (身份断言: "此人是张三")  │                          │
    │                          │                          │
    │─⑦ 带着 Assertion 回到SP ─→│                          │
    │   (POST SAML Response)   │                          │
    │                          │                          │
    │                          │─⑧ 验证 Assertion 签名──│
    │                          │   → 提取用户身份属性     │
    │                          │   → 建立本地会话        │
    │                          │                          │
    │←⑨ 成功访问应用 ──────────│                          │
```

### 3.2 SAML Assertion 的构成

```
SAML Assertion (SAML 断言) =

一个 XML 文档，包含三个部分：

1. Authentication Statement (认证声明)
   ├── 谁 (Subject: uid=zhangsan)
   ├── 何时 (AuthnInstant: 2024-01-15T09:30:00Z)
   └── 怎么认证的 (AuthnContext: PasswordProtectedTransport)

2. Attribute Statement (属性声明)
   ├── 邮箱、姓名、部门、角色...
   └── 这些属性从 IdP 传给 SP

3. Authorization Decision Statement (授权声明)
   └── 该用户是否被允许访问特定资源

SP 如何验证 Assertion 的真实性：
├── IdP 使用其私钥对 Assertion 进行数字签名
├── SP 使用 IdP 的公钥验签（公钥通过 Metadata 交换）
└── 确保 Assertion 在有效期 (NotBefore/NotOnOrAfter) 内
```

### 3.3 SAML 的安全考量

```
SAML 2.0 的安全控制：

签名验证
├── ⚠️ 如果 SP 不验证签名 → 攻击者可篡改 Assertion
│   修改 <Attribute> → 提权到管理员
└── ✅ 始终验证 XML 签名

重放攻击防御
├── Assertion 包含 InResponseTo 字段
├── SP 只接受一次同一个 InResponseTo
└── 过期时间 (NotOnOrAfter) 通常设置 2-5 分钟

XML 签名包装攻击 (XML Signature Wrapping)
├── 攻击者修改 Assertion 的 XML 结构
├── 将恶意内容插入已签名部分之外
├── SP 解析时可能使用未签名的恶意内容
└── 防御：严格的 XML 验证 + 拒绝不规范结构

Metadata 安全交换
├── IdP 和 SP 需要交换 Metadata（包含证书、URL）
└── Metadata 交换必须通过安全通道（HTTPS+签名）
```

---

## 四、OAuth 2.0 与 OpenID Connect

### 4.1 SAML 2.0 vs OAuth 2.0 vs OIDC

```
三者的关系：

SAML 2.0
├── 诞生：2005 年
├── 目标：企业 SSO
├── 格式：XML / SOAP
├── 复杂度：高（臃肿的 XML）
└── 场景：企业 Web 应用 SSO

OAuth 2.0
├── 诞生：2012 年
├── 目标：授权 (Authorization) — 不是认证！
├── 格式：JSON / REST
├── 复杂度：中
└── 场景：第三方 API 授权访问

OpenID Connect (OIDC)
├── 诞生：2014 年
├── 目标：在 OAuth 2.0 基础上添加了认证 (Authentication)
├── 格式：JSON / REST + JWT
├── 复杂度：中低
├── 场景：现代 Web/移动应用的认证和授权
└── 关系：OIDC = OAuth 2.0 + 身份层
```

> **关键认知**：OAuth 2.0 是**授权**协议（"我允许这个 App 访问我的照片"），不是**认证**协议（"我是谁"）。OpenID Connect 在 OAuth 2.0 之上加了`id_token`，才完成了"认证"。

### 4.2 OIDC 核心流程

```
OpenID Connect 认证流程 (Authorization Code Flow)：

用户     Client (RP)     Authorization Server (OP/IdP)
 │           │                    │
 │─① 访问 ──→│                    │
 │           │                    │
 │←② 重定向 ┤                    │
 │           │                    │
 │─③ 输入凭证──────────────────→│
 │           │                    │
 │←④ 重定向回Client ────────────│
 │  (携带 Authorization Code)    │
 │           │                    │
 │─⑤ 回到Client ─→│               │
 │           │                    │
 │           │─⑥ 用 Code 换 Token ─→│
 │           │  (POST /token)     │
 │           │                    │
 │           │←⑦ 返回 Tokens ────│
 │           │   · id_token (JWT，身份) │
 │           │   · access_token (API权限)│
 │           │   · refresh_token (续期) │
 │           │                    │
 │←⑧ 登录成功 ┤                    │
 │           │                    │
```

### 4.3 ID Token (JWT) 的结构

```
JWT (JSON Web Token) = id_token 的标准格式

JWT 三部分（用 . 分割）：

Header.Payload.Signature

Header (头部)：
{
  "alg": "RS256",    ← 签名算法
  "typ": "JWT"
}

Payload (载荷)：
{
  "iss": "https://idp.example.com",  ← 签发者
  "sub": "user12345",                ← 用户ID
  "aud": "my-app-client-id",         ← 接收者(应用)
  "exp": 1705319400,                 ← 过期时间
  "iat": 1705315800,                 ← 签发时间
  "name": "张三",
  "email": "zhangsan@example.com",
  "role": "admin"
}

Signature (签名)：
RSASHA256(
  base64UrlEncode(Header) + "." + base64UrlEncode(Payload),
  IdP's Private Key
)

验证三要素：
├── 签名是否有效？（用 IdP 公钥验签）
├── 是否过期？（exp > 当前时间）
└── 接收者是否正确？（aud 匹配）
```

---

## 五、企业 SSO 架构设计

### 5.1 高可用架构

```
企业 SSO 高可用架构：

                     负载均衡器
                         │
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
        IdP 1         IdP 2         IdP 3
        (主)          (备)          (备)
           │             │             │
           └─────────────┼─────────────┘
                         │
                    ┌────▼────┐
                    │  统一会话  │
                    │  存储集群  │
                    │ (Redis等) │
                    └─────────┘

关键点：
├── IdP 必须集群化（不能单点故障）
├── 会话状态在 IdP 间共享（Redis 集群）
├── 数据库高可用（主从 + 自动故障转移）
├── 网络层面：多数据中心、多链路
└── 降级预案：IdP 全挂时的应急模式
```

### 5.2 会话管理策略

```
SSO 会话的生命周期：

1. 全局会话 (IdP 侧)
   ├── 用户登录 IdP 后建立
   ├── 有效期内访问任何 SP 都免登录
   ├── 超时：15 分钟 ~ 8 小时（按安全策略）
   └── 登出：全局登出 → 所有 SP 同时登出

2. 局部会话 (SP 侧)
   ├── 用户首次访问一个 SP 时建立
   ├── SP 自己的会话管理
   ├── 有效期内访问同 SP 不触发 SAML/OIDC
   └── 登出：仅影响该 SP

3. 滑动过期 (Sliding Expiration)
   ├── 有活动就刷新过期时间
   ├── 风险：用户不关闭浏览器 → 长期有效
   └── 解决方案：绝对过期时间 (Absolute Timeout) + 滑动

4. 同步登出 (Single Logout / SLO)
   └── 从 IdP 登出时，通知所有 SP 也登出
   └── SAML: SLO Profile / OIDC: RP-Initiated Logout
```

---

## 六、SSO 的安全风险

### 6.1 "金票"风险

```
SSO 的核心安全悖论：
├── 登录一次，畅行全网
└── → 主账号被攻破 = 全网沦陷

"金票"攻击 = 伪造或窃取 IdP 的签名密钥

如果攻击者获得了 IdP 的私钥：
├── 可以签署任意 SAML Assertion / JWT
├── 可以以任意用户身份（包括管理员）登录任意 SP
├── 这个威胁远超单个应用被攻破

防御：
├── HSM 存储 IdP 签名私钥
├── 密钥定期轮換
├── 异常 Assertion 检测
│   └── 一个用户同时从两个国家访问 → 告警
└── 在 SP 侧增加额外安全检查（如 IP 白名单）
```

### 6.2 SSO 的六大安全风险

| 风险 | 描述 | 防御 |
|------|------|------|
| **金票** | IdP 签名密钥泄露 | HSM + 定期轮換 |
| **会话劫持** | SSO Session 被窃取 | HTTPS + Secure Cookie + HTTPOnly |
| **断言重放** | 截获 Assertion 重用 | InResponseTo + 短有效期 |
| **XML 签名包装** | SAML 签名绕过 | 严格 XML 验证 |
| **开放重定向** | 登录后跳到恶意网站 | 白名单验证 redirect_uri |
| **MFA 绕过** | SSO 后不检查敏感操作 | Step-up Authentication |

### 6.3 Step-up Authentication

```
Step-up Authentication (按需提权认证)：

不同操作需要不同的认证强度：

操作层        认证要求
────────────────────────────
浏览数据      全局 SSO 即可
修改个人信息   需要重新输入密码
修改安全设置   需要 MFA
大额转账      需要 MFA + 审批
删除账户      需要 MFA + 密码 + 确认

关键原则：
├── SSO 是基础登录，不等于全权通行
├── 敏感操作必须 Step-up
└── Step-up 认证是短期内有效的（如 5 分钟内有效）
```

---

## 七、CISP 考试要点速查

### 核心概念

| 概念 | 一句话 |
|------|--------|
| SSO | 一次登录，多应用访问 |
| IdP | 身份提供者，负责认证 |
| SP/RP | 服务提供者/依赖方，信任 IdP 的认证 |
| SAML 2.0 | 企业 SSO 的 XML 标准 |
| OAuth 2.0 | **授权**协议："授权APP访问我的资源" |
| OIDC | **认证**协议："我是谁" — OAuth 2.0 + 身份层 |
| JWT | 自包含的 JSON 格式令牌 (id_token) |
| Step-up | 针对敏感操作的额外认证要求 |

### 关键区别

| 对比 | SAML 2.0 | OpenID Connect |
|------|----------|----------------|
| 年代 | 2005 | 2014 |
| 格式 | XML | JSON |
| 签名 | XML Sig | JWT (JWS) |
| 移动友好 | ❌ 笨重 | ✅ 轻量 |
| 场景 | 企业 Web SSO | 现代 Web/移动 |

### 常见考试陷阱

1. ~~OAuth 2.0 是认证协议~~ → OAuth 是**授权**协议，OIDC 才是认证协议
2. ~~SSO 可以让所有应用共享同一个密码~~ → SSO 是共享认证状态，不是共享密码
3. ~~SAML 已经被 OIDC 取代~~ → 两者并存，SAML 在企业遗留系统中仍然广泛使用
4. ~~SSO 部署后所有操作都免认证~~ → 敏感操作需要 Step-up 提权认证
5. ~~SSO 会话永不过期~~ → 有全局会话和局部会话的生命周期管理

### 自检清单

- [ ] 理解 SSO 的核心价值和角色（IdP/SP/RP）
- [ ] 掌握 SAML 2.0 的基本认证流程（SP-Initiated Flow）
- [ ] 区分 OAuth 2.0（授权）和 OIDC（认证）
- [ ] 了解 JWT 的三部分结构
- [ ] 知道 SSO "金票"攻击的含义和防御
- [ ] 理解 Step-up Authentication 的概念

---

> 💡 **本章小结**：SSO 是用户体验和安全管理的双赢方案，但"一荣俱荣，一损俱损"的架构特性要求对 IdP 做最高级别的安全保护。SAML 2.0 和 OIDC 是考试中需要重点区分的两种协议——前者是 XML 时代的企业标准，后者是 JSON 时代的现代方案。OAuth 2.0 授权 vs OIDC 认证的辨析是 CISP 的经典考点。
