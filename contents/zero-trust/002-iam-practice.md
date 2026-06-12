# IAM 身份与访问管理实战

---

## 一、IAM 核心概念

```
IAM (Identity and Access Management) 三大支柱：

  认证 (Authentication)：你是谁？
    └── 密码/MFA/证书/生物特征/SSO/FIDO2

  授权 (Authorization)：你能做什么？
    └── RBAC/ABAC/PBAC/ReBAC

  审计 (Auditing)：你做了什么？
    └── 登录日志/操作审计/权限变更记录/合规报告
```

---

## 二、认证协议对比

### 2.1 OAuth 2.0 与 OIDC

```
OAuth 2.0（RFC 6749）：授权框架，不是认证协议
OIDC (OpenID Connect)：在OAuth 2.0之上增加了身份层

OAuth 2.0 四种授权模式：
  1. Authorization Code（PKCE）— 最安全，推荐
  2. Client Credentials         — 服务间通信
  3. Resource Owner Password    — ⚠️ 已不推荐（直接暴露密码）
  4. Implicit                   — ⚠️ 已废弃（令牌泄露风险）

OIDC ID Token 结构 (JWT)：
{
  "iss": "https://idp.example.com",     // 签发者
  "sub": "user-12345",                  // 用户唯一标识
  "aud": "my-app-client-id",            // 受众
  "exp": 1717200000,                    // 过期时间
  "iat": 1717113600,                    // 签发时间
  "auth_time": 1717113600,              // 认证时间
  "nonce": "abc123",                    // 防重放
  "name": "Zhang San",
  "email": "zhangsan@example.com"
}

验证要点（RP客户端必须检查）：
  ✓ 签名验证（RS256 / ES256 公钥）
  ✓ iss 必须匹配
  ✓ aud 必须包含自己的client_id
  ✓ exp 未过期
  ✓ nonce 匹配（防重放）
  ✓ iat 合理（防止Token预生成攻击）
```

### 2.2 SAML 2.0

```
SAML 2.0 核心概念：
  SP (Service Provider) — 服务提供方（企业应用）
  IDP (Identity Provider) — 身份提供方（Okta/Azure AD）

SP-initiated 流程：
  用户访问 SP → SP生成AuthnRequest → 浏览器重定向到IDP → 
  用户认证 → IDP生成SAML Assertion → POST回SP → SP验证并建立会话

IDP-initiated 流程：
  用户从IDP门户点击应用 → IDP生成Assertion → POST到SP ACS端点

SAML vs OIDC 对比：
┌────────────┬───────────────┬───────────────┐
│            │ SAML 2.0      │ OIDC          │
├────────────┼───────────────┼───────────────┤
│ 数据格式    │ XML           │ JSON          │
│ 传输方式    │ POST绑定+重定向│ HTTP/JSON     │
│ 移动端支持   │ 差            │ 原生支持       │
│ 单点登出    │ 标准化SLO      │ 多规范(RP-Initiated等)│
│ 企业应用    │ 广泛(Office365/Salesforce)│新应用倾向│
│ 复杂度      │ 高            │ 低            │
└────────────┴───────────────┴───────────────┘
```

---

## 三、授权模型

### 3.1 RBAC (基于角色的访问控制)

```yaml
# RBAC 模型示例
roles:
  admin:
    permissions:
      - "user:read"      # CRUD风格
      - "user:create"
      - "user:delete"
      - "report:export"
  editor:
    permissions:
      - "user:read"
      - "report:export"
      - "content:write"
  viewer:
    permissions:
      - "user:read"
      - "report:view"

# RBAC实现：Casbin
# model.conf
[request_definition]
r = sub, obj, act
[policy_definition]
p = sub, obj, act
[role_definition]
g = _, _
[policy_effect]
e = some(where (p.eft == allow))
[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act

# policy.csv
p, admin, data, read
p, admin, data, write
g, alice, admin   # alice继承admin角色
```

### 3.2 ABAC (基于属性的访问控制)

```
ABAC 决策公式：
  Can(User, Action, Resource) ← f(Subject.Attributes, 
                                    Action.Attributes, 
                                    Resource.Attributes, 
                                    Environment.Attributes)

属性示例：
  Subject:   角色=财务, 部门=财务部, 职级=P6, 位置=北京办公室
  Resource:  数据类型=薪资表, 敏感级别=4, 所有者=HR
  Action:    read/write/delete
  Environment: 时间=工作日9:00-18:00, IP=10.0.0.0/8, 设备=受管设备

策略示例（XACML风格）：
  "财务部员工可以在工作时间内从公司内网读取薪资汇总报表，
   但不能查看个人明细，除非是直属上级。"
```

### 3.3 ReBAC (基于关系的访问控制)

```
Google Zanzibar (2019年论文公开，Google内部统一授权系统)

关系定义（Namespace + Relation）：
  document:owner → 直接拥有文档的人
  document:editor → 可以编辑文档的人
  folder:viewer → 可以查看文件夹的人
  
  关系传播：folder:viewer → 自动获得folder内所有document:viewer权限

用例：
  "张三能否查看这篇文档？"
  → 检查：张三是否在文档的viewer集合中？
  → viewer = owner ∪ direct_viewer ∪ parent_folder.viewer

开源实现：SpiceDB (authzed), OpenFGA (Okta), Ory Keto
```

---

## 四、开源 IAM 方案实战

### 4.1 Keycloak 部署

```bash
# Docker 快速部署（生产环境勿用dev模式）
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:25.0 start-dev

# 生产环境配置
# 1. 配置外部数据库（PostgreSQL）
# 2. 启用TLS/HTTPS
# 3. 配置集群模式（多节点）
# 4. 管理控制台 → Realm Settings → 生成密钥对
```

### 4.2 Keycloak 集成示例 (OIDC)

```yaml
# 配置Realm
Realm: my-company

# 创建Client (OIDC)
Client ID: my-web-app
Client Protocol: openid-connect
Access Type: confidential
Valid Redirect URIs: https://app.example.com/*
```

```javascript
// 前端集成 (React + oidc-client-ts)
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

const userManager = new UserManager({
  authority: 'https://auth.example.com/realms/my-company',
  client_id: 'my-web-app',
  redirect_uri: 'https://app.example.com/callback',
  post_logout_redirect_uri: 'https://app.example.com',
  response_type: 'code',
  scope: 'openid profile email',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  // PKCE: code_challenge_method 默认 S256
});

// 登录
userManager.signinRedirect();

// 回调处理
const user = await userManager.signinRedirectCallback();

// 获取Access Token
const token = user.access_token;
```

```go
// 后端API验证Token (Go)
import "github.com/coreos/go-oidc/v3/oidc"

provider, _ := oidc.NewProvider(ctx, "https://auth.example.com/realms/my-company")
verifier := provider.Verifier(&oidc.Config{
    ClientID: "my-web-app",
})

idToken, err := verifier.Verify(ctx, rawToken)
if err != nil {
    return nil, err
}

var claims struct {
    Email string `json:"email"`
    Name  string `json:"name"`
}
idToken.Claims(&claims)
```

---

## 五、LDAP / AD 集成

### 5.1 LDAP 基本操作

```bash
# 查询用户
ldapsearch -H ldaps://ldap.example.com:636 \
  -D "cn=admin,dc=example,dc=com" -W \
  -b "ou=users,dc=example,dc=com" \
  "(uid=zhangsan)"

# LDIF 属性映射
# Keycloak User Federation → LDAP
# 映射: uid → username, cn → firstName, mail → email
# 映射: memberOf → 角色/组

# AD 集成注意：
# - Kerberos + LDAP 双重协议
# - Secure LDAP (LDAPS 端口636)
# - 密码策略由AD侧管理
```

### 5.2 账户生命周期

```
入职工单 → 自动创建账户 → 分配基础角色 → 通知IT/HR
  ↓
在职期间：角色变更 → 权限变更 → 定期审计（季度）→ 休眠账户检测
  ↓
离职工单 → 禁用账户 → 撤销所有权限 → 保留90天后删除 → 审计确认
```

---

## 六、Checklist

- [ ] 统一IDP选型（Okta/Azure AD/Keycloak/Casdoor）
- [ ] 所有应用接入SSO（至少覆盖核心系统）
- [ ] 强制MFA（FIDO2 > TOTP > SMS）
- [ ] 授权模型设计（RBAC基础 + ABAC增强）
- [ ] 账户生命周期管理（创建/变更/离职自动化）
- [ ] 定期权限审计（≥季度）
- [ ] 服务账号管理（JWT/API Key/OAuth2 Client Credentials）
- [ ] IDP高可用部署（多节点+数据库主从）
- [ ] 登录日志全量记录（SIEM接入）
- [ ] 异常登录检测（异地/异常时间/新设备）
