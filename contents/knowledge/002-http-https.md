# HTTP/HTTPS 深入理解与中间人攻击防御

HTTP 与 HTTPS 是 Web 应用最基础的协议，几乎所有 Web 安全问题都与它们有关。本文从请求响应结构、连接管理、TLS 握手机制，到中间人攻击（MITM）、证书链验证，系统梳理这对核心协议。

## 一、HTTP 基础知识

HTTP 是**无状态**的文本协议，基于请求-响应模型。典型流程：

```
客户端                                服务器
  |--- 请求行 + Headers + Body ------->|
  |                                     |
  |<-- 状态行 + Headers + Body --------|
```

### 1.1 请求结构

```
GET /api/user?id=1 HTTP/1.1
Host: api.example.com
User-Agent: curl/7.81.0
Accept: application/json
Authorization: Bearer <token>
Content-Length: 0
```

- **方法**：GET / POST / PUT / DELETE / PATCH / HEAD / OPTIONS / CONNECT / TRACE；
- **路径 + 查询字符串**：`/api/user?id=1`；
- **版本**：HTTP/1.1、HTTP/2、HTTP/3；
- **Headers**：Host、Cookie、Authorization、Content-Type、Content-Length、User-Agent、Origin、Referer、X-Forwarded-For…
- **Body**：`application/x-www-form-urlencoded`、`application/json`、`multipart/form-data` 等。

### 1.2 响应结构

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 27
Set-Cookie: session=abc; HttpOnly; Secure
Cache-Control: no-store

{"id":1,"name":"alice"}
```

常见状态码：

| 范围 | 含义 | 常见值 |
| --- | --- | --- |
| 1xx | 信息 | 100 Continue、101 Switching Protocols |
| 2xx | 成功 | 200 OK、201 Created、204 No Content |
| 3xx | 重定向 | 301 Moved、302 Found、304 Not Modified、307/308 |
| 4xx | 客户端错误 | 400、401、403、404、405、413、429 |
| 5xx | 服务端错误 | 500、502、503、504 |

## 二、HTTP 连接管理与演进

- **HTTP/0.9**：原始请求-响应，无 Headers；
- **HTTP/1.0**：引入 Headers、状态码、Content-Type；默认短连接（每个请求一个 TCP）；
- **HTTP/1.1**：默认长连接（`Connection: keep-alive`）、管道化（pipelining，存在队头阻塞）、分块传输（chunked）、范围请求（Range）；
- **HTTP/2**：二进制分帧、多路复用（一个 TCP 并发多个流）、Header 压缩（HPACK）、Server Push；
- **HTTP/3**：基于 QUIC（UDP + TLS），无 TCP 队头阻塞，0-RTT 握手，连接迁移（如 Wi-Fi→4G 不中断）。

## 三、TLS 与 HTTPS

HTTPS = HTTP over TLS（早期为 SSL）。核心目标：

- **机密性（Confidentiality）**：对称加密（AES、ChaCha20）；
- **完整性（Integrity）**：HMAC、AEAD（GCM/Poly1305）；
- **身份认证（Authentication）**：非对称加密（RSA、ECDSA）+ X.509 证书；
- **前向安全（Forward Secrecy）**：使用 ECDHE/DHE 密钥协商，每会话独立 key，长期密钥泄漏不影响历史流量解密。

### 3.1 TLS 1.2 握手（简化版）

```
Client                                                   Server
  |------ ClientHello (随机数, Cipher Suites) ----------->|
  |<---- ServerHello (随机数, 选中套件) + Certificate ----|
  |<---------------- ServerKeyExchange -------------------| （若使用 ECDHE）
  |<---------------- ServerHelloDone ----------------------|
  |------ ClientKeyExchange (预主密钥) + ChangeCipherSpec + Finished ----->|
  |<---- ChangeCipherSpec + Finished ---------------------|
```

之后双方用 `(ClientRandom + ServerRandom + PreMasterSecret)` 派生会话密钥。

### 3.2 TLS 1.3 改进

- 简化为 1-RTT 握手，支持 0-RTT（重连，存在重放风险）；
- 移除 RSA 密钥交换、所有弱加密（RC4、3DES、SHA-1）；
- 默认前向安全；
- 握手消息加密（ClientHello 除外），隐私性更强。

## 四、证书与 PKI

X.509 证书是"电子身份证"，绑定**域名/组织**与**公钥**。验证链：

```
根 CA（自签名）→ 中间 CA → 终端证书（Leaf / Server Certificate）
```

客户端验证：

1. 从终端证书往上，依次用上级公钥验证下级签名，直到根；
2. 检查域名匹配（Common Name / SAN）；
3. 检查有效期；
4. 检查是否被吊销（CRL / OCSP / OCSP Stapling / CRLite / ARI）；
5. 检查用途、算法强度、约束（如 CA 标记、路径长度）。

## 五、常见 Web 攻击与防御

| 攻击 | 原理 | 防御 |
| --- | --- | --- |
| **HTTP 中间人攻击（MITM）** | 攻击者在客户端与服务器之间劫持并篡改流量 | HTTPS、HSTS、公钥固定（HPKP 已不推荐）、证书透明度（CT） |
| **SSL Strip** | 把 HTTPS 降级为 HTTP，绕过浏览器对加密的期望 | HSTS、preload 列表、全站 HTTPS |
| **SSL BEAST / Lucky13** | 老版本 CBC 模式加密的弱点 | 升级 TLS 1.2/1.3，使用 GCM/ChaCha20 |
| **Heartbleed** | OpenSSL 实现错误，可读取敏感内存 | 升级 OpenSSL、重启受影响服务、轮换密钥 |
| **POODLE / DROWN** | SSLv3 与老版本 RSA 导出级弱点 | 禁用 SSLv3、确保服务器不支持弱密钥 |
| **CRIME / BREACH** | HTTP 压缩 + 已知明文猜测 Cookie | 关闭 HTTP 压缩 / 有选择压缩、CSRF token 随机化 |
| **Downgrade 攻击** | 篡改 ClientHello 强制使用弱套件 | TLS 1.3 的 downgrade SCSV、强制使用强套件 |
| **证书伪造 / 恶意 CA** | 攻击者控制某个受信任 CA 签发伪造证书 | 证书透明度（CT 日志）、CAA DNS 记录、HPKP（谨慎） |
| **CORS 配置错误** | `Access-Control-Allow-Origin: *` + `Access-Control-Allow-Credentials: true` | 严格设置 Origin 白名单、避免反射 Origin |
| **CSRF** | 浏览器自动携带 Cookie 触发恶意请求 | CSRF Token、SameSite Cookie、Double-Submit |
| **HTTP 响应拆分（CRLF Injection）** | 注入 `\r\n` 伪造响应头/体 | 严格校验用户输入、更新 Web 框架 |
| **Host Header 攻击** | 滥用 `Host` 头构造 SSRF、缓存投毒 | 校验白名单、避免把 Host 直接拼接到 URL |

## 六、HTTPS 最佳实践（服务端）

1. 全站 HTTPS，HTTP 301/308 重定向到 HTTPS；
2. 启用 **HSTS** 并加入 preload 列表：
   `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
3. 仅支持 TLS 1.2 / 1.3，禁用 SSLv2/v3、TLS 1.0/1.1；
4. 优先使用 AEAD 套件：`TLS_AES_256_GCM_SHA384`、`TLS_CHACHA20_POLY1305_SHA256`、`TLS_AES_128_GCM_SHA256`；
5. 使用 2048+ RSA 或 ECDSA（P-256 已足够）；
6. 启用 OCSP Stapling / ARI，减少客户端检查吊销的开销与隐私泄漏；
7. 启用 Certificate Transparency（SCT），使用 CAA DNS 记录限制可签发 CA；
8. Cookie 配置 `Secure; HttpOnly; SameSite=Lax/Strict`；
9. Content-Security-Policy、X-Content-Type-Options、X-Frame-Options、Referrer-Policy 等安全 Header 补齐；
10. 定期使用 **Qualys SSL Labs / testssl.sh** 做配置审计。

## 七、调试与抓包技巧

- `openssl s_client -connect example.com:443 -servername example.com`：手动 TLS 握手，查看证书链；
- `curl -v --http1.1 https://example.com`、`curl --http3`（curl 7.66+）：快速观察握手与响应；
- Wireshark 抓 HTTPS：浏览器配置 `SSLKEYLOGFILE` 导出主密钥，Wireshark 自动解密；
- `testssl.sh`：检查 TLS 配置、漏洞与弱算法；
- Burp Suite 导入自签证书后可做 MITM，便于调试 HTTPS 流量（仅限授权测试）。

## 八、学习建议

1. 用 `openssl s_client` 抓一次完整 TLS 握手，对照 ServerHello/Certificate 理解证书链；
2. 在 Burp 中配置 CA 证书，体验"MITM"的工作方式；
3. 阅读《HTTPS 权威指南》/《图解 HTTP》等入门书籍；
4. 关注 Mozilla SSL Configuration Generator（现代 Nginx/Apache 推荐配置）；
5. 定期更新 TLS 库与 OpenSSL 版本，关注 CVE（如 Heartbleed、Ghostcat、Curveball 等）。

掌握 HTTP/HTTPS 并不难，但要"从协议文本走到攻防实践"，仍需大量的抓包、调试与复现。保持对 Header、证书、加密套件的敏感度，是 Web 安全工程师最重要的基本功之一。
