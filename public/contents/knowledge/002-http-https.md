# HTTP/HTTPS 深入理解与中间人攻击防御

> **📘 文档定位**：CISP 考试核心基础 | 难度：入门 | 预计阅读：40 分钟
>
> HTTP 与 HTTPS 是 Web 应用最基础的协议，几乎所有 Web 安全问题都与它们有关。本文从请求响应结构、连接管理、TLS 握手机制，到中间人攻击（MITM）、证书链验证，系统梳理这对核心协议。

---

## 导航目录

- [一、HTTP 协议基础与报文结构](#一http-协议基础与报文结构)
- [二、HTTP 连接管理与协议演进](#二http-连接管理与协议演进)
- [三、TLS 与 HTTPS 深度剖析](#三tls-与-https-深度剖析)
- [四、证书与 PKI 体系](#四证书与-pki-体系)
- [五、常见 Web 攻击与防御矩阵](#五常见-web-攻击与防御矩阵)
- [六、HTTPS 服务端最佳实践](#六https-服务端最佳实践)
- [七、调试与抓包技巧](#七调试与抓包技巧)
- [八、高分考点与知识巧记](#八高分考点与知识巧记)

---

## 一、HTTP 协议基础与报文结构

### 1.1 HTTP 是什么

HTTP（HyperText Transfer Protocol）是**无状态**的**文本协议**，基于请求-响应模型。每次请求独立，服务器不保留客户端之前的状态（状态通过 Cookie/Session 在应用层维护）。

```
客户端                                服务器
  |                                      |
  |------ 请求行 + Headers + Body ------>|
  |                                      |
  |<----- 状态行 + Headers + Body -------|
```

### 1.2 HTTP 请求报文结构

```
请求行：
  METHOD /path?query=value HTTP/1.1

请求头部（Headers）：
  Host: api.example.com          ← 必选（HTTP/1.1），指定目标主机
  User-Agent: curl/7.81.0        ← 客户端标识
  Accept: application/json       ← 期望的响应格式
  Authorization: Bearer <token>  ← 认证信息
  Content-Type: application/json ← 请求体格式
  Content-Length: 27             ← 请求体字节数
  Cookie: session_id=abc123      ← 会话标识
  Origin: https://example.com    ← 请求来源（CORS 相关）
  Referer: https://example.com/page  ← 来源页面

空行（CRLF）：← 头部与体之间的分隔符

请求体（Body）：
  {"username": "admin", "password": "123456"}
```

> **🔑 高分考点**：HTTP 请求方法中，**GET vs POST** 的关键区别：
> - GET：参数在 URL 中，有长度限制（浏览器/服务器限制，约 2KB-8KB），幂等、可缓存
> - POST：参数在 Body 中，无长度限制，非幂等、默认不可缓存
> - **安全方法**：GET、HEAD、OPTIONS（不应改变服务器状态）
> - **幂等方法**：GET、HEAD、PUT、DELETE、OPTIONS（多次调用结果相同）

### 1.3 HTTP 响应报文结构

```
状态行：
  HTTP/1.1 200 OK

响应头部（Headers）：
  Content-Type: application/json           ← 响应体格式
  Content-Length: 27                       ← 响应体字节数
  Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Lax  ← 设置 Cookie
  Cache-Control: no-store                  ← 缓存策略
  Strict-Transport-Security: max-age=31536000  ← HSTS
  X-Content-Type-Options: nosniff          ← 安全头
  X-Frame-Options: DENY                    ← 防点击劫持
  Content-Security-Policy: default-src 'self'  ← CSP

空行（CRLF）

响应体（Body）：
  {"id": 1, "name": "alice"}
```

### 1.4 HTTP 状态码速查表（考试必考）

| 状态码 | 含义 | 说明 | 考试频率 |
| :--- | :--- | :--- | :---: |
| **200** | OK | 请求成功 | ⭐⭐⭐⭐⭐ |
| **201** | Created | 资源创建成功（POST 返回） | ⭐⭐⭐ |
| **204** | No Content | 成功但无返回体 | ⭐⭐ |
| **301** | Moved Permanently | 永久重定向（浏览器缓存） | ⭐⭐⭐⭐ |
| **302** | Found | 临时重定向 | ⭐⭐⭐⭐ |
| **304** | Not Modified | 缓存有效，无需重传 | ⭐⭐⭐ |
| **307** | Temporary Redirect | 临时重定向（不改变方法） | ⭐⭐ |
| **308** | Permanent Redirect | 永久重定向（不改变方法） | ⭐⭐ |
| **400** | Bad Request | 请求格式错误 | ⭐⭐⭐⭐ |
| **401** | Unauthorized | 未认证（需要登录） | ⭐⭐⭐⭐⭐ |
| **403** | Forbidden | 已认证但无权限 | ⭐⭐⭐⭐⭐ |
| **404** | Not Found | 资源不存在 | ⭐⭐⭐⭐ |
| **405** | Method Not Allowed | 方法不允许 | ⭐⭐⭐ |
| **413** | Payload Too Large | 请求体过大 | ⭐⭐ |
| **429** | Too Many Requests | 请求频率过高（限流） | ⭐⭐⭐ |
| **500** | Internal Server Error | 服务器内部错误 | ⭐⭐⭐⭐⭐ |
| **502** | Bad Gateway | 网关错误（上游无响应） | ⭐⭐⭐⭐ |
| **503** | Service Unavailable | 服务暂时不可用 | ⭐⭐⭐⭐ |
| **504** | Gateway Timeout | 网关超时 | ⭐⭐⭐⭐ |

> **💡 知识巧记**：状态码记忆法
> - **1xx**：信息提示（"我知道了"）
> - **2xx**：成功（"搞定了"）
> - **3xx**：重定向（"去别的地方"）
> - **4xx**：客户端错误（"你的问题"）— 401 没登录、403 没权限、404 不存在
> - **5xx**：服务器错误（"我的问题"）— 500 内部错、502 网关错、503 服务不可用

### 1.5 常见请求头与响应头速查

| 头部 | 类型 | 作用 | 安全关联 |
| :--- | :--- | :--- | :--- |
| **Host** | 请求头 | 目标主机（HTTP/1.1 必选） | Host Header 攻击 |
| **User-Agent** | 请求头 | 客户端标识 | 可被伪造 |
| **Cookie** | 请求头 | 携带 Cookie | XSS 窃取目标 |
| **Authorization** | 请求头 | 认证凭据 | Bearer Token 安全 |
| **Origin** | 请求头 | 请求来源（仅含协议+主机+端口） | CORS 判断依据 |
| **Referer** | 请求头 | 来源页面完整 URL | 隐私泄露风险 |
| **X-Forwarded-For** | 请求头 | 代理传递的客户端 IP | IP 伪造风险 |
| **Content-Type** | 请求/响应 | 内容类型（MIME） | MIME 嗅探攻击 |
| **Set-Cookie** | 响应头 | 设置 Cookie | HttpOnly/Secure/SameSite |
| **Cache-Control** | 响应头 | 缓存策略 | 敏感数据禁用缓存 |

---

## 二、HTTP 连接管理与协议演进

### 2.1 HTTP 版本演进全景

| 版本 | 年份 | 传输层 | 核心特性 | 主要问题 |
| :--- | :--- | :--- | :--- | :--- |
| **HTTP/0.9** | 1991 | TCP | 仅 GET、无头部、无状态码 | 功能极简 |
| **HTTP/1.0** | 1996 | TCP | 引入 Header、状态码、Content-Type | 默认短连接（每请求一个 TCP） |
| **HTTP/1.1** | 1997 | TCP | 长连接、管道化、分块传输、Host 头 | 队头阻塞（HOL Blocking） |
| **HTTP/2** | 2015 | TCP | 二进制分帧、多路复用、HPACK、Server Push | TCP 层面仍有队头阻塞 |
| **HTTP/3** | 2022 | **QUIC (UDP)** | 0-RTT、连接迁移、无队头阻塞 | 部署尚在推广中 |

### 2.2 HTTP/1.1 核心特性详解

**① 持久连接（Keep-Alive）**：
```
HTTP/1.0：默认短连接，每个请求建立新 TCP 连接
HTTP/1.1：默认长连接（Connection: keep-alive），复用 TCP 连接
```

**② 管道化（Pipelining）**：
```
非管道化：请求1 → 响应1 → 请求2 → 响应2（串行）
管道化：  请求1 → 请求2 → 响应1 → 响应2（并行发送，但响应必须有序）
问题：队头阻塞——如果响应1处理慢，响应2即使已就绪也要等待
```

**③ 分块传输（Chunked Transfer Encoding）**：
```
当响应体大小未知时，使用 Transfer-Encoding: chunked
每个块：十六进制长度 + CRLF + 数据 + CRLF
最后一个块：0 + CRLF + CRLF
```

**④ Host 头部**：
```
HTTP/1.1 必选头部，支持虚拟主机（一个 IP 托管多个域名）
Nginx/Apache 根据 Host 头将请求路由到不同站点
```

### 2.3 HTTP/2 核心特性详解

```
二进制分帧层：
  HTTP/1.1：文本协议，以换行符分隔
  HTTP/2：二进制协议，消息被切分为 HEADERS 帧和 DATA 帧
  → 更紧凑、解析更高效、更少歧义

多路复用（Multiplexing）：
  一个 TCP 连接上同时并发多个 Stream
  → 消除 HTTP/1.1 的应用层队头阻塞
  → 但 TCP 层面的队头阻塞仍然存在（丢包时所有 Stream 都受影响）

Header 压缩（HPACK）：
  使用静态表和动态表压缩头部
  → 减少冗余头部传输（如每次都发 User-Agent）
  → CRIME 攻击利用压缩 + 已知明文猜测 Cookie

Server Push：
  服务器可主动推送资源（如 HTML 引用的 CSS/JS）
  → 减少往返次数
  → 实际使用中可能浪费带宽（浏览器已缓存）
```

### 2.4 HTTP/3 与 QUIC 详解

```
HTTP/3 = HTTP over QUIC

QUIC 核心特性：
  1. 基于 UDP：绕过 TCP 的队头阻塞问题
  2. 0-RTT 握手：重连时无需等待，直接发送数据（存在重放风险）
  3. 连接迁移：切换网络（Wi-Fi→4G）时连接不中断
  4. 内置 TLS 1.3：加密是 QUIC 的强制性组成部分

对比 TCP+TLS：
  TCP+TLS 1.2：2-RTT（TCP 三次握手 1-RTT + TLS 握手 1-RTT）
  TCP+TLS 1.3：1-RTT（TCP 三次握手 1-RTT + TLS 1.3 与 ACK 合并）
  QUIC：      0-RTT（重连时）或 1-RTT（首次连接）
```

> **🔑 高分考点**：HTTP/2 的多路复用解决了**应用层**队头阻塞，但仍有**TCP 层**队头阻塞。HTTP/3 基于 QUIC（UDP），从根本上去除了队头阻塞。

---

## 三、TLS 与 HTTPS 深度剖析

### 3.1 HTTPS 四大安全目标

HTTPS = HTTP over TLS，核心目标：

| 目标 | 英文 | 实现手段 | 算法示例 |
| :--- | :--- | :--- | :--- |
| **机密性** | Confidentiality | 对称加密 | AES-GCM、ChaCha20-Poly1305 |
| **完整性** | Integrity | AEAD / HMAC | GCM 模式自带完整性校验 |
| **身份认证** | Authentication | 非对称加密 + X.509 证书 | RSA、ECDSA |
| **前向安全** | Forward Secrecy | 临时密钥协商（ECDHE/DHE） | X25519、P-256 |

> **🔑 高分考点**：前向安全（Forward Secrecy）——即使服务器长期私钥泄漏，历史会话也不可解密。关键在于每次握手使用**临时密钥对（Ephemeral Key）**，会话结束后即销毁。ECDHE/DHE 提供前向安全，RSA 密钥交换**不提供**前向安全。

### 3.2 TLS 1.2 握手详解

```
Client                                                   Server
  |                                                        |
  |--- ① ClientHello ------------------------------------>|
  |    - 支持的 TLS 版本                                   |
  |    - 客户端随机数 (ClientRandom)                       |
  |    - 支持的加密套件列表                                |
  |    - 支持的压缩方法                                    |
  |    - 扩展 (SNI, ALPN, supported_groups...)             |
  |                                                        |
  |<-- ② ServerHello -------------------------------------|
  |    - 选定的 TLS 版本                                   |
  |    - 服务器随机数 (ServerRandom)                       |
  |    - 选定的加密套件                                    |
  |                                                        |
  |<-- ③ Certificate -------------------------------------|
  |    - 服务器证书链（X.509）                             |
  |    - 包含服务器公钥                                    |
  |                                                        |
  |<-- ④ ServerKeyExchange -------------------------------|
  |    - ECDHE 公钥参数（如果使用 ECDHE 密钥交换）         |
  |    - 用证书私钥签名，防篡改                            |
  |                                                        |
  |<-- ⑤ ServerHelloDone ---------------------------------|
  |                                                        |
  |--- ⑥ ClientKeyExchange ------------------------------>|
  |    - 客户端 ECDHE 公钥参数                             |
  |    - 或加密的 PreMasterSecret（RSA 密钥交换）          |
  |                                                        |
  |--- ⑦ ChangeCipherSpec ------------------------------->|
  |    - 通知服务器：后续消息将使用协商的密钥加密          |
  |                                                        |
  |--- ⑧ Finished（加密） -------------------------------->|
  |    - 第一条加密消息，包含握手消息的哈希               |
  |                                                        |
  |<-- ⑨ ChangeCipherSpec --------------------------------|
  |<-- ⑩ Finished（加密） --------------------------------|
  |                                                        |
  |============= 后续数据使用会话密钥加密 =================|
```

**密钥派生过程**：
```
1. 双方各自生成 ECDHE 私钥，交换公钥
2. 通过 ECDH 算法计算共享秘密（PreMasterSecret）
3. 使用 PRF（伪随机函数）派生：
   MasterSecret = PRF(PreMasterSecret, "master secret", ClientRandom + ServerRandom)
4. 从 MasterSecret 派生会话密钥（通常为 4-6 个密钥）：
   - Client Write Key（客户端→服务器加密密钥）
   - Server Write Key（服务器→客户端加密密钥）
   - Client Write MAC Key / IV 等
```

### 3.3 TLS 1.3 重大改进

| 改进项 | TLS 1.2 | TLS 1.3 | 安全意义 |
| :--- | :--- | :--- | :--- |
| **握手往返** | 2-RTT | 1-RTT（0-RTT 重连） | 大幅降低延迟 |
| **密钥交换** | RSA / ECDHE | 仅 ECDHE/DHE | 强制前向安全 |
| **对称加密** | CBC / GCM 等 | 仅 AEAD | 消除 padding oracle 攻击 |
| **签名算法** | 多种（含 SHA-1） | 仅安全算法 | 消除弱签名 |
| **握手加密** | 明文 | ServerHello 后全部加密 | 保护证书和协商参数 |
| **0-RTT** | 不支持 | 支持（重放风险） | 重连加速 |
| **降级防护** | 需额外配置 | 内建 SCSV 机制 | 防止降级攻击 |

> **🔑 高分考点**：TLS 1.3 移除的内容：
> - ❌ RSA 密钥交换（无前向安全）
> - ❌ CBC 模式加密（padding oracle 攻击）
> - ❌ RC4、3DES 加密算法
> - ❌ SHA-1 哈希算法
> - ❌ 压缩（CRIME 攻击）
> - ❌ 重协商（存在安全风险）

### 3.4 加密套件命名规则

```
TLS_AES_128_GCM_SHA256
  │    │    │     │
  │    │    │     └── 哈希/PRF 算法（SHA-256）
  │    │    └──────── 加密模式（GCM = AEAD）
  │    └───────────── 密钥长度（128-bit）
  └────────────────── 加密算法（AES）

TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 (TLS 1.2 格式)
  │    │     │        │    │    │     │
  │    │     │        │    │    │     └── 哈希算法
  │    │     │        │    │    └──────── 加密模式
  │    │     │        │    └───────────── 密钥长度
  │    │     │        └────────────────── 对称加密算法
  │    │     └─────────────────────────── 证书签名算法（RSA）
  │    └───────────────────────────────── 密钥交换算法（ECDHE）
  └────────────────────────────────────── TLS 前缀
```

---

## 四、证书与 PKI 体系

### 4.1 X.509 证书详解

X.509 证书是"电子身份证"，绑定**域名/组织**与**公钥**。核心字段：

| 字段 | 含义 | 示例 |
| :--- | :--- | :--- |
| **Subject** | 证书持有者 | CN=*.example.com, O=Example Inc, C=US |
| **Issuer** | 签发者（CA） | CN=DigiCert TLS RSA SHA256 2020 CA1 |
| **Serial Number** | 证书序列号 | 唯一标识 |
| **Validity** | 有效期 | Not Before: 2025-01-01, Not After: 2026-01-01 |
| **Public Key** | 持有者公钥 | RSA 2048-bit / ECDSA P-256 |
| **Signature Algorithm** | 签名算法 | sha256WithRSAEncryption |
| **Extensions** | 扩展字段 | SAN（主题备用名称）、Key Usage、Extended Key Usage |
| **SAN** | 主题备用名称 | DNS:*.example.com, DNS:example.com |

### 4.2 证书链验证过程

```
信任锚（Trust Anchor）：
  根 CA 证书（自签名）— 预置在操作系统/浏览器中

证书链：
  根 CA（自签名）
    ↓ 用根 CA 私钥签名
  中间 CA 证书
    ↓ 用中间 CA 私钥签名
  终端实体证书（Leaf / Server Certificate）

客户端验证步骤：
  1. 从终端证书开始，用上级证书的公钥验证下级证书的签名
  2. 逐级向上验证，直到根 CA
  3. 检查域名匹配（SAN 或 CN 字段）
  4. 检查有效期（Not Before / Not After）
  5. 检查吊销状态（CRL / OCSP / OCSP Stapling）
  6. 检查证书用途（Key Usage / Extended Key Usage）
  7. 检查算法强度和约束（如 CA 标记、路径长度限制）
```

### 4.3 证书吊销机制对比

| 机制 | 全称 | 工作原理 | 优缺点 |
| :--- | :--- | :--- | :--- |
| **CRL** | Certificate Revocation List | CA 定期发布吊销列表，客户端下载检查 | 延迟大、文件大、隐私问题 |
| **OCSP** | Online Certificate Status Protocol | 客户端实时查询 CA 服务器 | 实时但增加延迟、暴露浏览记录 |
| **OCSP Stapling** | OCSP 装订 | 服务器定期获取 OCSP 响应并随 TLS 握手发送 | 减少延迟、保护隐私 |
| **CRLite** | - | 浏览器内置压缩的 CRL 数据集 | Mozilla 方案 |
| **ARI** | ACME Renewal Information | 通过 ACME 协议获取证书更新建议 | Let's Encrypt 方案 |

### 4.4 证书透明度（Certificate Transparency）

```
CT 工作原理：
  1. CA 签发证书时，将证书提交到 CT 日志服务器
  2. CT 日志返回 SCT（Signed Certificate Timestamp）
  3. 服务器将 SCT 嵌入证书或通过 TLS 扩展/Ocsp Stapling 提供
  4. 浏览器要求证书必须包含有效的 SCT（Chrome 强制要求）
  5. 任何人都可监控 CT 日志，发现恶意签发的证书

目的：防止 CA 被攻破后偷偷签发伪造证书，让所有证书签发行为公开可审计
```

---

## 五、常见 Web 攻击与防御矩阵

### 5.1 攻击矩阵总览

| 攻击 | 原理简述 | 防御措施 | CISP 考试频率 |
| :--- | :--- | :--- | :---: |
| **MITM（中间人攻击）** | 攻击者在客户端与服务器之间劫持并篡改流量 | HTTPS、HSTS、证书透明度 | ⭐⭐⭐⭐⭐ |
| **SSL Strip** | 将 HTTPS 降级为 HTTP，绕过加密 | HSTS、preload 列表、全站 HTTPS | ⭐⭐⭐⭐ |
| **BEAST** | CBC 模式下 IV 可预测漏洞 | 升级 TLS 1.1+，使用 GCM | ⭐⭐ |
| **Heartbleed** | OpenSSL 心跳扩展越界读取内存 | 升级 OpenSSL、轮换密钥 | ⭐⭐⭐⭐ |
| **POODLE** | SSLv3 CBC 填充漏洞 | 禁用 SSLv3 | ⭐⭐⭐ |
| **CRIME / BREACH** | HTTP 压缩 + 已知明文猜测 Cookie | 关闭压缩/有选择压缩、CSRF Token 随机化 | ⭐⭐⭐ |
| **降级攻击** | 篡改 ClientHello 强制使用弱加密套件 | TLS 1.3 内建 SCSV 防护 | ⭐⭐⭐ |
| **证书伪造** | 恶意 CA 签发伪造证书 | CT 日志监控、CAA DNS 记录 | ⭐⭐⭐⭐ |
| **CORS 配置错误** | 过于宽松的跨域策略 | 严格 Origin 白名单 | ⭐⭐⭐ |
| **CSRF** | 浏览器自动携带 Cookie 发起恶意请求 | CSRF Token、SameSite Cookie | ⭐⭐⭐⭐⭐ |
| **CRLF 注入** | 注入 `\r\n` 伪造响应头/体 | 输入校验、更新框架 | ⭐⭐⭐ |
| **Host Header 攻击** | 滥用 Host 头构造 SSRF、缓存投毒 | 校验白名单 | ⭐⭐⭐ |
| **Clickjacking** | 透明 iframe 诱导点击 | X-Frame-Options、CSP frame-ancestors | ⭐⭐⭐ |

### 5.2 MITM（中间人攻击）深度分析

```
MITM 攻击模型：
  客户端 ←→ [Attacker] ←→ 服务器

攻击者位置：
  ✓ 同一局域网（Wi-Fi 嗅探）
  ✓ ARP 欺骗重定向流量
  ✓ DNS 劫持将域名指向攻击者
  ✓ 恶意代理/VPN 服务
  ✓ 路由器/交换机被攻破

攻击能力：
  - 被动窃听：读取未加密的 HTTP 内容
  - 主动篡改：修改请求/响应内容
  - 降级攻击：剥离 HTTPS → HTTP
  - 证书伪造：签发自签名证书冒充目标网站

防御体系：
  第一层：HTTPS 加密（防止窃听和篡改）
  第二层：HSTS（防止 SSL Strip 降级攻击）
  第三层：证书透明度（检测伪造证书）
  第四层：Certificate Pinning（应用内固定证书公钥，但需谨慎维护）
```

### 5.3 SSL Strip 攻击详解

```
攻击流程：
  1. 受害者连接公共 Wi-Fi，攻击者通过 ARP 欺骗成为中间人
  2. 受害者访问 http://example.com（注意是 HTTP）
  3. 服务器返回 301 重定向到 https://example.com
  4. 攻击者拦截 301 响应，不转发给受害者
  5. 攻击者自己与服务器建立 HTTPS 连接
  6. 攻击者与受害者保持 HTTP 明文连接
  7. 受害者看到的是 HTTP 页面（无锁图标），但以为是安全的

HSTS 防御原理：
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  - 浏览器收到此头后，在 max-age 时间内强制使用 HTTPS
  - 即使用户输入 http://，浏览器内部自动转为 https://
  - HSTS Preload List：浏览器内置的强制 HTTPS 域名列表
```

### 5.4 CSRF 攻击详解

```
攻击原理：
  1. 用户登录了 bank.com，浏览器保存了认证 Cookie
  2. 用户访问了恶意网站 evil.com
  3. evil.com 的页面中包含：
     <img src="http://bank.com/transfer?to=attacker&amount=10000">
  4. 浏览器自动携带 bank.com 的 Cookie 发起请求
  5. 服务器认为是用户本人的操作

防御措施（按推荐顺序）：
  1. SameSite Cookie：Set-Cookie: ...; SameSite=Lax（现代浏览器默认）
     - Strict：完全不发送跨站 Cookie
     - Lax：顶级导航（GET）发送，其他不发送
     - None：始终发送（需配合 Secure）
  
  2. CSRF Token：在表单中嵌入随机 Token，服务器验证
     请求必须携带 Token（通过隐藏字段或 Header）
     攻击者无法获取/猜测 Token
  
  3. Origin/Referer 验证：检查请求来源是否为可信域名
  
  4. 双重 Cookie 验证：Cookie 和请求参数各带一份随机值，服务端比对
```

---

## 六、HTTPS 服务端最佳实践

### 6.1 配置检查清单

```
1. 全站 HTTPS
   □ HTTP 301/308 重定向到 HTTPS
   □ 所有资源（CSS/JS/图片/API）均使用 HTTPS
   □ 避免混合内容（Mixed Content）警告

2. HSTS 配置
   □ Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
   □ 加入 HSTS Preload List

3. TLS 版本与加密套件
   □ 仅启用 TLS 1.2 和 TLS 1.3
   □ 禁用 SSLv2、SSLv3、TLS 1.0、TLS 1.1
   □ 优先使用 AEAD 套件：TLS_AES_256_GCM_SHA384、TLS_CHACHA20_POLY1305_SHA256

4. 证书配置
   □ 使用 2048-bit RSA 或 ECDSA P-256
   □ 启用 OCSP Stapling
   □ 配置 CAA DNS 记录
   □ 关注证书过期时间（Let's Encrypt 90 天自动续期）

5. 安全响应头
   □ Content-Security-Policy（CSP）
   □ X-Content-Type-Options: nosniff
   □ X-Frame-Options: DENY
   □ Referrer-Policy: strict-origin-when-cross-origin
   □ Permissions-Policy

6. Cookie 安全
   □ Secure（仅 HTTPS 传输）
   □ HttpOnly（禁止 JavaScript 访问）
   □ SameSite=Lax/Strict

7. 定期审计
   □ Qualys SSL Labs 扫描
   □ testssl.sh 工具检测
   □ Mozilla SSL Configuration Generator 生成配置
```

### 6.2 Nginx 推荐配置示例

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    # 证书配置
    ssl_certificate     /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    # TLS 协议版本
    ssl_protocols TLSv1.2 TLSv1.3;

    # 加密套件（Mozilla 现代配置）
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:
                ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:
                ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;

    # 服务器偏好套件
    ssl_prefer_server_ciphers off;  # TLS 1.3 下客户端优先

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # 其他安全头
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header Referrer-Policy strict-origin-when-cross-origin;
}
```

---

## 七、调试与抓包技巧

### 7.1 命令行工具速查

```bash
# OpenSSL：手动 TLS 握手
openssl s_client -connect example.com:443 -servername example.com
openssl s_client -connect example.com:443 -tls1_2  # 指定 TLS 版本
openssl s_client -connect example.com:443 -cipher 'ECDHE-RSA-AES128-GCM-SHA256'

# 查看证书信息
openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -text -noout
openssl x509 -in cert.pem -text -noout

# 测试 HSTS
curl -I https://example.com 2>/dev/null | grep -i strict

# 查看 TLS 版本和套件
curl -v --http1.1 https://example.com 2>&1 | grep -E "TLS|SSL"

# HTTP/3 测试
curl --http3 https://example.com

# 证书链验证
openssl verify -CAfile ca-bundle.crt server.crt
```

### 7.2 Wireshark TLS 解密

```
方法一：SSLKEYLOGFILE（推荐）
  1. 设置环境变量：export SSLKEYLOGFILE=/tmp/sslkeys.log
  2. 启动浏览器/应用（Firefox/Chrome 均支持）
  3. Wireshark → Edit → Preferences → Protocols → TLS
  4. 在 (Pre)-Master-Secret log filename 中填入 /tmp/sslkeys.log
  5. Wireshark 自动解密 TLS 流量

方法二：RSA 私钥（仅支持 RSA 密钥交换，不支持 ECDHE）
  Wireshark → Edit → Preferences → Protocols → TLS → RSA Keys
  → 导入服务器私钥文件

方法三：中间人代理
  Burp Suite / mitmproxy 作为代理，导入其 CA 证书
  仅支持 HTTP 协议，非标准协议无法解密
```

---

## 八、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
| :---: | :--- | :---: | :---: | :--- |
| 1 | HTTP 状态码分类与含义 | ⭐⭐⭐⭐⭐ | 低 | 2xx成功、3xx重定向、4xx客户端错、5xx服务端错 |
| 2 | HTTP 请求方法 | ⭐⭐⭐⭐ | 低 | GET(安全幂等)、POST(非幂等)、PUT(幂等)、DELETE(幂等) |
| 3 | HTTP/1.1 vs HTTP/2 vs HTTP/3 | ⭐⭐⭐⭐⭐ | 中 | 多路复用、二进制分帧、QUIC 基础 |
| 4 | TLS 握手过程 | ⭐⭐⭐⭐⭐ | 中 | ClientHello→ServerHello→Certificate→ServerKeyExchange→Finished |
| 5 | TLS 1.2 vs TLS 1.3 区别 | ⭐⭐⭐⭐ | 中 | 1-RTT、移除 RSA 密钥交换、仅 AEAD、前向安全 |
| 6 | HTTPS 四大安全目标 | ⭐⭐⭐⭐ | 低 | 机密性、完整性、身份认证、前向安全 |
| 7 | 前向安全（Forward Secrecy） | ⭐⭐⭐⭐⭐ | 中 | ECDHE/DHE 临时密钥，长期私钥泄漏不影响历史 |
| 8 | 证书链验证流程 | ⭐⭐⭐⭐ | 中 | 逐级验证签名→域名匹配→有效期→吊销状态 |
| 9 | HSTS 原理与作用 | ⭐⭐⭐⭐⭐ | 低 | 强制 HTTPS，防止 SSL Strip 降级攻击 |
| 10 | MITM 攻击与防御 | ⭐⭐⭐⭐⭐ | 中 | HTTPS + HSTS + CT + Certificate Pinning |
| 11 | CSRF 攻击与防御 | ⭐⭐⭐⭐⭐ | 中 | SameSite Cookie、CSRF Token、Origin 验证 |
| 12 | X.509 证书关键字段 | ⭐⭐⭐ | 低 | Subject、Issuer、Validity、Public Key、SAN |

### 💡 知识巧记口诀

#### 1. HTTP 状态码记忆
> **"二成三重四客错五服错"** — 2xx成功、3xx重定向、4xx客户端错误、5xx服务器错误
>
> 常用：**"200 OK, 301/302 跳, 401 没登, 403 没权, 404 没有, 500 挂了"**

#### 2. HTTPS 四大安全目标
> **"机密靠对称，完整靠 AEAD，身份靠证书，前向靠临时密钥"**

#### 3. TLS 1.3 改进
> **"减轮次、删弱算法、加密握手、强制前向安全"**
>
> 具体：1-RTT → 仅 AEAD → 仅 ECDHE → 握手加密 → 内建降级防护

#### 4. Cookie 安全三属性
> **"HttpOnly 防 XSS 偷，Secure 防 HTTP 明文传，SameSite 防 CSRF 跨站带"**

#### 5. HSTS 三阶段
> **"先设头、再 Preload、最后全站 HTTPS"**
>
> `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

#### 6. 证书链验证
> **"从下往上验签名、域名匹配查 SAN、有效期看两端、吊销查 OCSP"**

#### 7. TLS 握手简化记忆
> **"客户端说你好(ClientHello)→服务器回你好+证书(ServerHello+Certificate)→客户端确认(Finished)→服务器确认(Finished)"**

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
| :--- | :--- |
| "HTTPS 加密所有内容，包括 URL" | ❌ 错误！HTTPS 加密请求体和响应体，但 IP 地址和 SNI（TLS 1.3 之前）是明文的 |
| "TLS 1.3 的 0-RTT 是安全的" | ⚠️ 不完全！0-RTT 数据存在重放攻击风险，仅适用于幂等请求 |
| "HSTS 第一次访问就生效" | ❌ 错误！HSTS 需要浏览器先收到响应头，首次访问仍然可能被降级。Preload 列表可解决 |
| "只要有 HTTPS 就安全了" | ❌ 错误！还需要正确配置 HSTS、CSP、安全 Cookie 属性等 |
| "301 和 302 的区别" | 301 永久（浏览器缓存），302 临时；301/302 可能改变 POST 为 GET，307/308 保持方法不变 |
| "HTTP/2 解决了所有队头阻塞" | ❌ 错误！HTTP/2 仅解决应用层队头阻塞，TCP 层仍有队头阻塞。HTTP/3 才是真正解决 |

---

## 学习建议

1. 🔧 **动手实践**：用 `openssl s_client` 抓一次完整 TLS 握手，对照 ServerHello/Certificate 理解证书链
2. 🕵️ **体验 MITM**：在 Burp Suite 中配置 CA 证书，体验"中间人"的工作方式
3. 📚 **阅读经典**：《HTTPS 权威指南》、《图解 HTTP》
4. ⚙️ **安全配置**：关注 Mozilla SSL Configuration Generator，生成 Nginx/Apache 推荐配置
5. 🔍 **持续关注**：定期更新 TLS 库与 OpenSSL 版本，关注 CVE（Heartbleed、Ghostcat、Curveball 等）

---

> **掌握 HTTP/HTTPS 并不难，但要"从协议文本走到攻防实践"，仍需大量的抓包、调试与复现。保持对 Header、证书、加密套件的敏感度，是 Web 安全工程师最重要的基本功之一。**
