# 单点登录(SSO)与联邦身份认证

> **📘 文档定位**：CISP 考试 零信任身份安全 核心 | 难度：⭐⭐⭐ | 预计阅读：25 分钟
>
> 深入解析 SSO 技术原理、SAML/OIDC 联邦协议对比、OAuth2.0 授权码流程与 PKCE 增强、CAS 协议及跨域 SSO 方案，覆盖企业级统一认证架构设计与部署实践。

---

## 导航目录

- [一、SSO 技术原理](#一sso-技术原理)
- [二、SAML 联邦认证](#二saml-联邦认证)
- [三、OAuth2.0 / OIDC 深入](#三oauth20--oidc-深入)
- [四、CAS 协议](#四cas-协议)
- [五、跨域 SSO 方案](#五跨域-sso-方案)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、SSO 技术原理

```
SSO 核心目标：
  一次登录，访问所有信任系统，无需重复输入密码

关键技术：
  1. 基于Cookie的Session SSO（同域）
  2. 基于Token的跨域SSO (JWT/OIDC)
  3. 基于协议的联邦SSO (SAML/OIDC)
```

---

## 二、CAS (Central Authentication Service)

### 2.1 CAS 协议流程

```
CAS是经典SSO协议（Apereo CAS项目，耶鲁大学起源）

CAS流程：
  1. 用户访问App A → 检测无CAS TGC(Ticket Granting Cookie)
  2. 302重定向到CAS Server /login?service=appA
  3. 用户输入凭据 → CAS验证，签发TGC Cookie (domain: cas.example.com)
  4. CAS生成ST(Service Ticket) → 302回App A /callback?ticket=ST-xxx
  5. App A后端向CAS验证ST → /p3/serviceValidate?service=appA&ticket=ST-xxx
  6. CAS返回用户信息 → App A建立本地Session

  之后访问App B：
  1. 用户访问App B → 无Session
  2. 302 → CAS → 检测到TGC有效 → 直接签发新ST
  3. 302回App B → 验证ST → 登录成功（用户无感知）
```

### 2.2 CAS 部署

```yaml
# CAS 6.6+ Overlay部署
# docker-compose.yml (基础版)
services:
  cas:
    image: apereo/cas:6.6.15
    environment:
      CAS_SERVER_NAME: https://sso.example.com
      CAS_TGC_SECURE: "true"
      CAS_TGC_SAME_SITE: "Lax"
    ports:
      - "8443:8443"
    volumes:
      - ./etc/cas/config:/etc/cas/config

# 配置JSON Service Registry
# /etc/cas/config/services/appA-1001.json
{
  "@class": "org.apereo.cas.services.RegexRegisteredService",
  "serviceId": "^(https|http)://appa\\.example\\.com.*",
  "name": "App A",
  "id": 1001,
  "attributeReleasePolicy": {
    "@class": "org.apereo.cas.services.ReturnAllAttributeReleasePolicy"
  }
}
```

---

## 三、OAuth 2.0 + OIDC SSO

### 3.1 标准流程

```
OIDC Authentication Code + PKCE Flow：

  1. Client → /authorize?response_type=code&code_challenge=xxx&code_challenge_method=S256
  2. IDP → 用户登录 → 用户授权
  3. IDP → 302 redirect_uri?code=AUTHORIZATION_CODE
  4. Client后端 → POST /token {code, code_verifier, client_id, client_secret}
  5. IDP → {access_token, id_token, refresh_token}
  6. Client后端 → 验证id_token签名+claims → 建立本地Session

PKCE (Proof Key for Code Exchange) ：
  防止Authorization Code拦截攻击
  
  code_verifier：客户端生成的随机字符串(43-128字符)
  code_challenge：SHA256(code_verifier) → Base64URL
  IDP验证：SHA256(发起请求时的code_verifier) == 存储的code_challenge
```

### 3.2 Session管理

```
Session策略选择：
┌──────────────┬──────────┬──────────┬──────────┐
│              │ Server   │ Token    │ 混合      │
│              │ Session  │ (JWT)    │          │
├──────────────┼──────────┼──────────┼──────────┤
│ 状态性       │ 有状态   │ 无状态   │ 有状态   │
│ 吊销便利性   │ 即时     │ 需黑名单 │ 即时     │
│ 扩展性       │ 差       │ 好       │ 中       │
│ 适用场景     │ 单体应用 │ 微服务   │ 中大型   │
└──────────────┴──────────┴──────────┴──────────┘

JWT 吊销策略：
  1. 短有效期 (15 min Access Token + Refresh Token)
  2. Token黑名单（Redis存储已吊销JWT ID直到过期）
  3. Token版本号（用户表中version字段）
```

---

## 四、SP vs IDP Initiated

```
SP-Initiated SSO (最常见):
  用户 → 访问SP → 未认证 → 生成AuthnRequest → 重定向到IDP

IDP-Initiated SSO (门户启动):
  用户 → IDP门户 → 点击应用 → IDP生成Assertion → POST到SP

IDP-Initiated风险：
  - 缺少RelayState校验可能导致开放重定向
  - SP必须验证RelayState是否在白名单内

SLO (Single Logout)：
  - IDP发起：IDP通知所有已登录SP退出
  - SP发起：SP通知IDP退出，IDP再通知其他SP
  - 实现方式：前端重定向链(Redirect-Chain) 或 后端通道(Back-Channel)
```

---

## 五、常见踩坑与排障

### 5.1 时钟不同步

```
症状：SAML/OIDC Token验证失败，报"Token尚未生效"或"已过期"
原因：IDP和SP服务器时间差超过允许窗口(通常60-300秒)
解决：
  # 检查时间差
  ntpq -p
  # 配置NTP
  systemctl enable chronyd && systemctl start chronyd
```

### 5.2 Cookie SameSite

```
Chrome 80+ 默认 SameSite=Lax

影响：跨站POST的SAML Response可能丢失Cookie导致无法建立Session
修复：
  CAS: 设置 CAS_TGC_SAME_SITE=None; CAS_TGC_SECURE=true
  SP: 使用SameSite=None; Secure (前提：HTTPS)
```

### 5.3 证书过期

```
症状：SAML签名验证失败 / HTTPS握手失败
检查：
  openssl s_client -connect idp.example.com:443 -showcerts
  openssl x509 -in cert.pem -noout -dates
策略：证书过期前30天自动告警 + 自动续期(ACME/Let's Encrypt)
```

### 5.4 无限重定向循环

```
常见原因：
  1. SP检查登录状态与IDP判断不一致
     → SP说"未登录" → 重定向IDP → IDP说"已登录" → 签发Assertion
     → SP验证失败 → 又说"未登录" → 死循环
  
  2. Cookie域不匹配或SameSite限制

排障方法：
  浏览器开发者工具 → Network → 勾选"Preserve log"
  检查302链和Set-Cookie头
```

---

## 六、Checklist

- [ ] IDP选型与高可用部署
- [ ] 所有核心应用接入SSO
- [ ] OIDC Authorization Code + PKCE (禁止Implicit)
- [ ] 强制HTTPS
- [ ] Session超时合理配置（短期Session+Refresh机制）
- [ ] SLO单点登出实现
- [ ] NTP时间同步
- [ ] IDP元数据证书有效期监控
- [ ] 重定向URI白名单严格检查
- [ ] 登录日志+异常检测
- [ ] 定期安全审计（OAuth Scope最小化/废弃应用清理）

---

## 七、高分考点与知识巧记

### 高分考点速查表

| 序号 | 考点 | 频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | SSO 核心价值 | ⭐⭐⭐⭐⭐ | ⭐⭐ | 一次登录全系统通行、减少密码疲劳、集中管控 |
| 2 | SAML 2.0 流程 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | SP发起→重定向IDP→用户认证→SAML Assertion→SP验证 |
| 3 | OIDC vs SAML | ⭐⭐⭐⭐ | ⭐⭐⭐ | OIDC(JSON+API友好)/SAML(XML+企业SSO) |
| 4 | OAuth2.0 授权码+PKCE | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 防授权码拦截+CSRF，移动/SPA应用必须 |
| 5 | Session 管理 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 短期Access Token(5-15min)+Refresh Token续期 |
| 6 | 联邦身份信任链 | ⭐⭐⭐ | ⭐⭐⭐⭐ | IDP元数据交换+证书信任+SAML Metadata |

### 知识巧记口诀

> 🎵 **SSO 一句话**："登录一次，处处通行，注销一次，处处关门"
>
> 🎵 **SAML 流程记**："SP 要认证→跳 IDP→签 Assertion→SP 验签放行"
>
> 🎵 **OAuth2.0 四角色**："资源主授权、客户端请求、授权服务器发牌、资源服务器验牌"

---

### 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "SSO 让所有系统共享同一密码" | ❌ SSO 是令牌机制，各系统不直接接触用户密码 |
| "OAuth2.0 和 OIDC 是一回事" | ❌ OAuth2.0 是授权框架，OIDC 是基于其上的认证层 |
| "SAML 已经过时了" | ❌ SAML 在企业级SSO中仍是主流，与 OIDC 各有适用场景 |

---

> **SSO 的终极目标是"让用户只记一个密码，让管理员只在一个地方控制访问"——但这也意味着 IDP 的安全性决定了整个生态的安全。**
