# DNS 原理与安全：从解析流程到 DNS 安全扩展

> **📘 文档定位**：CISP 考试核心基础 | 难度：入门 | 预计阅读：38 分钟
>
> DNS（Domain Name System）把域名翻译成 IP，是互联网的"电话簿"。正因为它如此基础，DNS 也成为攻击者的核心目标——DNS 劫持、缓存投毒、DDoS 放大攻击、DNS 隧道恶意通信屡见不鲜。本文从原理到攻防，整理 DNS 的关键知识点。

---

## 导航目录

- [一、DNS 体系结构与角色分工](#一dns-体系结构与角色分工)
- [二、DNS 解析流程深度剖析](#二dns-解析流程深度剖析)
- [三、常见 DNS 记录类型速查](#三常见-dns-记录类型速查)
- [四、DNS 协议特性与传输方式](#四dns-协议特性与传输方式)
- [五、DNS 典型攻击与防御矩阵](#五dns-典型攻击与防御矩阵)
- [六、DNS 安全增强技术](#六dns-安全增强技术)
- [七、企业侧 DNS 最佳实践](#七企业侧-dns-最佳实践)
- [八、调试命令与工具指南](#八调试命令与工具指南)
- [九、高分考点与知识巧记](#九高分考点与知识巧记)

---

## 一、DNS 体系结构与角色分工

### 1.1 DNS 命名空间

DNS 采用**树形分层命名空间**，从根到叶子：

```
                    .（根域）
          ┌─────────┼─────────┐
         com       org       cn（顶级域 TLD）
          │         │         │
     example    wikipedia   gov（二级域）
          │
    www.example.com（完全限定域名 FQDN）
```

> **🔑 高分考点**：FQDN（Fully Qualified Domain Name）以点结尾，如 `www.example.com.`（最后的点代表根域）。实际使用中通常省略末尾的点。

### 1.2 DNS 四种角色

| 角色 | 英文 | 功能 | 示例 |
| :--- | :--- | :--- | :--- |
| **权威服务器** | Authoritative Server | 保存某个域名的原始 DNS 记录（"真相的来源"） | `ns1.example.com` |
| **递归服务器** | Recursive Resolver | 代替客户端完成完整查询，返回最终结果 | `8.8.8.8`、`1.1.1.1` |
| **存根解析器** | Stub Resolver | 客户端操作系统内置的 DNS 解析库 | `gethostbyname()`、`getaddrinfo()` |
| **转发器** | Forwarder | 将查询转发给上游递归服务器 | 企业内网 DNS 服务器 |

> **💡 知识巧记**：**"权威有答案，递归替你查，存根是系统调用，转发是转手"**

### 1.3 根服务器体系

```
全球 13 组根服务器：a.root-servers.net ~ m.root-servers.net

关键认知：
  - "13 组"不是 13 台物理服务器
  - 通过 Anycast 技术，每组的物理节点遍布全球（1000+ 节点）
  - 根服务器只存储顶级域（TLD）的权威服务器地址，不存储具体域名记录
  - 中国大陆境内有多个根服务器镜像节点（如 F、I、J、L 根）
```

---

## 二、DNS 解析流程深度剖析

### 2.1 完整递归 + 迭代解析流程

以查询 `www.example.com` 的 A 记录为例：

```
步骤 1：客户端 → 本地递归服务器
  请求：www.example.com 的 A 记录是什么？
  方式：递归查询（Recursive Query）

步骤 2：递归服务器 → 根服务器
  请求：www.example.com 的 A 记录是什么？
  根服务器：我不知道，但 .com 的权威是 a.gtld-servers.net（返回 NS 记录 + glue record）
  方式：迭代查询（Iterative Query）

步骤 3：递归服务器 → .com 权威服务器
  请求：www.example.com 的 A 记录是什么？
  .com 权威：我不知道，但 example.com 的权威是 ns1.example.com（返回 NS 记录）
  方式：迭代查询

步骤 4：递归服务器 → example.com 权威服务器
  请求：www.example.com 的 A 记录是什么？
  example.com 权威：www.example.com 的 A 记录是 93.184.216.34，TTL=300
  方式：迭代查询

步骤 5：递归服务器 → 客户端
  返回：www.example.com → 93.184.216.34
  递归服务器缓存此记录 300 秒
```

### 2.2 递归查询 vs 迭代查询

| 对比维度 | 递归查询（Recursive） | 迭代查询（Iterative） |
| :--- | :--- | :--- |
| **发起方** | 客户端（Stub Resolver） | 递归服务器 |
| **接收方** | 递归服务器 | 各级权威服务器 |
| **要求** | 接收方必须给出最终答案 | 接收方给出"最佳已知答案" |
| **复杂度** | 对客户端简单 | 递归服务器需多次查询 |
| **RD 标志位** | RD=1（Recursion Desired） | RD=0 |

> **🔑 高分考点**：CISP 考试常考**递归查询**与**迭代查询**的区别。客户端到递归服务器是递归查询，递归服务器到权威服务器是迭代查询。

### 2.3 DNS 缓存机制

```
缓存层次：
  1. 浏览器 DNS 缓存（Chrome: chrome://net-internals/#dns）
  2. 操作系统 DNS 缓存（Windows: ipconfig /displaydns）
  3. 本地 DNS 递归服务器缓存
  4. 各级递归服务器/转发器缓存

TTL（Time To Live）：
  - 每条 DNS 记录都有 TTL，单位秒
  - TTL 到期后缓存失效，需重新查询
  - 常见 TTL：300（5 分钟）、3600（1 小时）、86400（24 小时）
  - 攻击者喜欢低 TTL 的域名（方便快速切换 IP）
  - CDN 使用低 TTL（60-300s）实现快速故障切换

负缓存（Negative Caching）：
  - 对于 NXDOMAIN（域名不存在）也缓存一段时间
  - 由 SOA 记录中的 MINIMUM 字段控制
  - 防止对不存在域名的频繁查询
```

---

## 三、常见 DNS 记录类型速查

### 3.1 记录类型完整表

| 记录类型 | 全称 | 功能 | 示例 | CISP 频率 |
| :--- | :--- | :--- | :--- | :---: |
| **A** | Address | 域名 → IPv4 地址 | `www.example.com. A 93.184.216.34` | ⭐⭐⭐⭐⭐ |
| **AAAA** | Quad-A | 域名 → IPv6 地址 | `www.example.com. AAAA 2606:2800:220:1:248:1893:25c8:1946` | ⭐⭐⭐⭐ |
| **CNAME** | Canonical Name | 域名别名 | `www.example.com. CNAME example.com.` | ⭐⭐⭐⭐⭐ |
| **MX** | Mail Exchanger | 邮件服务器 + 优先级 | `example.com. MX 10 mail.example.com.` | ⭐⭐⭐⭐ |
| **TXT** | Text | 任意文本（SPF/DKIM/DMARC 等） | `example.com. TXT "v=spf1 mx -all"` | ⭐⭐⭐⭐ |
| **NS** | Name Server | 权威 DNS 服务器 | `example.com. NS ns1.example.com.` | ⭐⭐⭐⭐ |
| **SOA** | Start of Authority | 域的管理信息 | 含主 DNS、管理员邮箱、序列号、刷新间隔等 | ⭐⭐⭐ |
| **PTR** | Pointer | IP → 域名（反向解析） | `34.216.184.93.in-addr.arpa. PTR www.example.com.` | ⭐⭐⭐ |
| **CAA** | Certification Authority Authorization | 限制可签发证书的 CA | `example.com. CAA 0 issue "letsencrypt.org"` | ⭐⭐⭐ |
| **SRV** | Service | 指定服务位置 | `_sip._tcp.example.com. SRV 10 5 5060 sip.example.com.` | ⭐⭐ |
| **TLSA** | TLS Authentication | 绑定 TLS 证书到 DNS（DANE） | 需配合 DNSSEC | ⭐⭐ |
| **HTTPS/SVCB** | HTTPS Service Binding | 新版服务参数记录 | 替代部分 CNAME、加速 ALPN 发现 | ⭐ |

### 3.2 关键记录详解

**CNAME 记录注意事项**：
```
规则：CNAME 指向的域名不能是另一个 CNAME（防止循环）
CNAME 不能与其他记录共存（如不能同时有 CNAME 和 MX）
裸域（@）使用 CNAME 会导致 MX 记录冲突，应使用 A 记录 + ALIAS/ANAME
```

**MX 记录优先级**：
```
数字越小优先级越高（0-65535）
example.com. MX 10 mail1.example.com.  ← 优先使用
example.com. MX 20 mail2.example.com.  ← 备用
```

**TXT 记录的邮件安全用途**：
```
SPF（Sender Policy Framework）：
  example.com. TXT "v=spf1 ip4:192.0.2.0/24 include:_spf.google.com -all"
  → 声明哪些 IP/服务器可以以本域名发送邮件

DKIM（DomainKeys Identified Mail）：
  google._domainkey.example.com. TXT "v=DKIM1; k=rsa; p=MIGfMA0G..."
  → 邮件签名公钥，验证邮件未被篡改

DMARC（Domain-based Message Authentication）：
  _dmarc.example.com. TXT "v=DMARC1; p=reject; rua=mailto:dmarc@example.com"
  → 定义 SPF/DKIM 失败时的处理策略
```

---

## 四、DNS 协议特性与传输方式

### 4.1 传统 DNS 传输

```
DNS over UDP（默认）：
  - 端口：53/UDP
  - 限制：512 字节（传统），EDNS(0) 扩展到 4096 字节
  - 优点：低延迟、低开销
  - 缺点：明文传输、可被嗅探和篡改

DNS over TCP：
  - 端口：53/TCP
  - 使用场景：
    ✓ 响应超过 UDP 限制（截断标志 TC=1）
    ✓ 区域传输（AXFR/IXFR）
    ✓ DNSSEC 签名响应（数据量较大）
    ✓ DNS over TLS 的基础

DNS 报文结构：
  Header (12 bytes) | Question | Answer | Authority | Additional
  - Transaction ID（16 位）：匹配请求与响应
  - Flags：QR（查询/响应）、RD（期望递归）、RA（支持递归）等
```

### 4.2 加密 DNS 传输

| 协议 | 全称 | 端口 | 标准 | 特点 |
| :--- | :--- | :--- | :--- | :--- |
| **DoT** | DNS over TLS | 853 | RFC 7858 | 独立端口、企业可管控 |
| **DoH** | DNS over HTTPS | 443 | RFC 8484 | 与 Web 流量混在一起、难被阻断 |
| **DoQ** | DNS over QUIC | 853 | RFC 9250 | 基于 QUIC、0-RTT、连接迁移 |

> **🔑 高分考点**：DoT vs DoH 的关键区别：
> - DoT：独立端口（853），企业防火墙可以识别和过滤
> - DoH：使用 HTTPS 端口（443），与普通 Web 流量混合，难以被阻断和审计
> - 安全影响：DoH 可能绕过企业 DNS 安全策略（如恶意域名过滤），需要"企业级 DoH"或内部 DoT/DoH 服务器

### 4.3 DNS 查询类型

```
正向查询（Forward Lookup）：域名 → IP
  dig www.example.com A

反向查询（Reverse Lookup）：IP → 域名
  dig -x 93.184.216.34
  → 实际查询的是 34.216.184.93.in-addr.arpa. PTR

区域传输（Zone Transfer）：
  AXFR（完整传输）：dig @ns1.example.com example.com AXFR
  IXFR（增量传输）：dig @ns1.example.com example.com IXFR
  ⚠️ 安全风险：开放的 AXFR 可泄露完整区域数据，应限制来源 IP
```

---

## 五、DNS 典型攻击与防御矩阵

### 5.1 攻击矩阵总览

| 攻击 | 原理 | 防御措施 | 严重度 | 考试频率 |
| :--- | :--- | :--- | :---: | :---: |
| **DNS 劫持** | 修改客户端 DNS 设置/投毒缓存，将流量引到恶意服务器 | DoT/DoH、DNSSEC、系统安全 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **缓存投毒** | 伪造 DNS 响应注入递归服务器缓存 | DNSSEC、端口随机化、0x20 编码 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **DNS 放大攻击** | 伪造源 IP + 大响应，放大 DDoS 流量 | 关闭开放递归、RRL、anycast | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **NXDOMAIN 攻击** | 查询不存在的子域，耗尽服务器资源 | RRL、anycast、WAF | ⭐⭐⭐ | ⭐⭐⭐ |
| **DNS 隧道** | 把 C2 通信嵌入 DNS 请求/响应绕过防火墙 | 域名白名单、异常检测 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **域传送漏洞** | 错误配置导致可拉取完整区域记录 | 限制 AXFR 来源 IP、TSIG 认证 | ⭐⭐⭐ | ⭐⭐⭐ |
| **DNS Rebinding** | 同域名 A 记录变为内网 IP，绕过同源策略 | 浏览器保护、SSRF 限制 | ⭐⭐⭐ | ⭐⭐ |
| **Typosquatting** | 注册相似域名进行钓鱼 | 品牌监控、SPF/DKIM/DMARC | ⭐⭐⭐ | ⭐⭐ |

### 5.2 DNS 劫持深度分析

```
劫持类型与场景：

① 本地 DNS 劫持：
   - 恶意软件修改 /etc/resolv.conf 或 Windows DNS 设置
   - 将 DNS 指向攻击者控制的服务器
   - 防御：监控 DNS 配置变化、使用 DoT/DoH

② 路由器/网关 DNS 劫持：
   - 攻击者获取路由器管理权限，修改 DHCP 下发的 DNS
   - 所有局域网设备受影响
   - 防御：路由器安全加固、强密码、固件更新

③ 运营商 DNS 劫持：
   - ISP 层面篡改 DNS 响应（如插入广告、劫持 NXDOMAIN）
   - 防御：使用 DoT/DoH、切换到公共 DNS（8.8.8.8/1.1.1.1）

④ DNS 缓存投毒（Kaminsky 攻击）：
   见下文详细分析
```

### 5.3 Kaminsky 攻击详解（DNS 缓存投毒）

```
传统 DNS 缓存投毒的限制：
  DNS 响应需要匹配 Transaction ID（16 位 = 65536 种可能）
  攻击者每次只能发送一个伪造响应 → 命中率 1/65536 ≈ 极低

Kaminsky 的突破（2008 年）：
  1. 攻击者向递归服务器查询 "rand1.example.com"
  2. 递归服务器不知道此记录，向 example.com 权威查询
  3. 攻击者同时发送大量伪造响应，每个伪造不同的 Transaction ID
     但不是在 Answer 区域投毒（会被权威服务器的真实响应覆盖）
     而是在 Authority 区域伪造 NS 记录：
     "example.com 的权威 DNS 是 attacker.com"
  4. 通过批量子域名查询（rand1, rand2, rand3...），大幅提高命中率
  5. 一旦命中，example.com 整个域被劫持

攻击成功率分析：
  原始攻击：65536 次尝试约 50% 成功率（生日悖论）
  修复后（端口随机化）：65536 × 64511 ≈ 40 亿种组合 → 几乎不可行

防御方案：
  ① DNSSEC：★终极方案，对响应进行数字签名
  ② 源端口随机化：端口也参与 Transaction ID 猜测空间
  ③ Query ID 随机化：每次查询使用随机 Transaction ID
  ④ 0x20 编码：查询时随机变换域名大小写，响应必须匹配
```

### 5.4 DNS 放大攻击详解

```
攻击原理：
  1. 攻击者伪造受害者 IP 作为源地址
  2. 向开放递归 DNS 服务器发送小请求（约 50 字节）
  3. DNS 服务器返回大响应（可达 4000+ 字节）
  4. 放大因子：4000/50 ≈ 80 倍

放大因子对比：
  DNS ANY 查询：约 50-80 倍
  NTP monlist：约 500+ 倍
  Memcached：约 10000-50000 倍

防御方案：
  ① 关闭开放递归：DNS 服务器仅服务授权客户端
  ② Response Rate Limiting (RRL)：限制对同一来源的响应速率
  ③ Anycast：将攻击流量分散到多个节点
  ④ 源 IP 验证（BCP 38/84）：ISP 过滤伪造源 IP 的流量
```

### 5.5 DNS 隧道详解

```
隧道原理：
  攻击者将 C2（Command & Control）通信编码到 DNS 请求/响应中

编码方式：
  - TXT 记录：在 TXT 记录中携带 base64 编码的数据
  - A 记录：将数据编码到 IP 地址的字节中
  - CNAME 记录：将数据编码到子域名中

示例（Cobalt Strike Beacon）：
  客户端查询：<base64_data>.attacker.com TXT
  C2 服务器响应：TXT 记录包含加密的指令

检测特征：
  ✓ 异常长的域名（超过 52 字符）
  ✓ 大量 TXT 查询
  ✓ DNS 查询频率异常（规律性心跳）
  ✓ 域名熵值高（随机字符串子域）
  ✓ 非标准 DNS 记录类型的频繁使用

防御：
  ① 域名白名单：仅允许企业可信域名解析
  ② DNS 流量监控：检测异常查询模式
  ③ DoH 管控：限制到外部 DoH 服务器的连接
  ④ NGFW/IDS：DNS 协议异常检测
```

---

## 六、DNS 安全增强技术

### 6.1 DNSSEC（DNS Security Extensions）

```
DNSSEC 核心原理：
  对 DNS 记录进行数字签名，客户端通过签名链验证真实性和完整性

关键记录类型：
  RRSIG：资源记录签名（包含签名数据）
    → 每个 DNS 记录集都有一条对应的 RRSIG
  
  DNSKEY：区域的公钥
    → ZSK（Zone Signing Key）：签名区域内的记录
    → KSK（Key Signing Key）：签名 DNSKEY 记录集
  
  DS（Delegation Signer）：父域对子域公钥的哈希
    → 建立父子域之间的信任链
  
  NSEC / NSEC3：证明某个域名不存在
    → NSEC3 额外提供哈希处理，防止区域遍历

信任链验证：
  根区 DNSKEY（信任锚）
    ↓ DS 哈希验证
  .com 的 DNSKEY
    ↓ DS 哈希验证
  example.com 的 DNSKEY
    ↓ RRSIG 签名验证
  www.example.com 的 A 记录

DNSSEC 不能做什么：
  ✗ 不提供加密（内容仍然明文）
  ✗ 不防止 DoS 攻击
  ✗ 不隐藏查询内容
  → 需要与 DoT/DoH 结合实现完整保护
```

> **🔑 高分考点**：DNSSEC 提供**数据完整性**和**来源认证**，但**不提供机密性**。要同时实现加密，需配合 DoT/DoH。

### 6.2 DoT / DoH / DoQ 对比

```
加密 DNS 协议安全特性对比：

                    DoT         DoH         DoQ
传输层            TCP         HTTP/2      QUIC
端口              853         443         853
加密              TLS         TLS 1.3     QUIC-TLS
0-RTT             否          否          支持
连接迁移          否          否          支持
HTTP 伪装         否          支持        否
企业可控性         高          低          中
中间设备兼容性     中          高          中
```

---

## 七、企业侧 DNS 最佳实践

### 7.1 防御检查清单

```
□ 1. 关闭开放递归
      → 递归服务器仅响应授权客户端的查询

□ 2. 启用 Response Rate Limiting (RRL)
      → 防止权威 DNS 被用作放大攻击反射器

□ 3. Anycast 部署
      → 多节点分发，提高可用性和抗 DDoS 能力

□ 4. 部署企业内网递归 DNS
      → 如 BIND、Unbound、systemd-resolved
      → 对外使用 DoT/DoH 上游

□ 5. 内部服务器 DNS 白名单
      → 禁用不必要的 DNS 解析，防止 DNS 隧道

□ 6. 邮件安全配置
      → SPF：声明合法发件 IP
      → DKIM：邮件签名
      → DMARC：定义 SPF/DKIM 失败处理策略

□ 7. CAA DNS 记录
      → 限制哪些 CA 可以签发本域 HTTPS 证书

□ 8. 敏感服务 DNSSEC + DANE
      → DNSSEC 防篡改
      → TLSA/DANE 将 TLS 证书绑定到 DNS

□ 9. DNS 日志监控
      → 长域名（>52 字符）
      → 大量 TXT 记录查询
      → NXDOMAIN 响应高峰
      → 异常查询频率（DNS 隧道心跳）
      → 非标准记录类型
```

### 7.2 推荐的 DNS 架构

```
企业 DNS 架构推荐：

互联网 ←→ [外部防火墙] ←→ [DMZ: 权威 DNS（Anycast+BIND）]
                              ↓
                         [内部防火墙]
                              ↓
                    [内网递归 DNS（BIND/Unbound）]
                       ↓              ↓
                  [客户端]      [服务器]
                    
递归 DNS 上游：
  - 对内：直接解析内网域名
  - 对外：通过 DoT/DoH 转发到可信上游
          如 1.1.1.1（Cloudflare）或 9.9.9.9（Quad9，含恶意域名过滤）
```

---

## 八、调试命令与工具指南

### 8.1 基础查询命令

```bash
# 基础查询
dig www.example.com                    # 查询 A 记录（默认）
dig www.example.com A                  # 显式指定类型
dig www.example.com AAAA               # 查询 IPv6
dig www.example.com MX                 # 查询邮件服务器
dig www.example.com NS                 # 查询权威服务器
dig www.example.com TXT                # 查询 TXT 记录
dig www.example.com CAA                # 查询 CAA 记录
dig www.example.com ANY                # 查询所有类型（可能被限制）

# 短格式输出
dig +short www.example.com             # 仅显示结果

# 指定 DNS 服务器
dig @8.8.8.8 www.example.com          # 使用 Google DNS
dig @1.1.1.1 www.example.com          # 使用 Cloudflare DNS

# 完整递归追踪
dig +trace www.example.com             # 从根开始逐步查询

# DNSSEC 查询
dig +dnssec www.example.com           # 显示 RRSIG 记录
dig +dnssec +multi www.example.com    # 多行格式化

# 反向解析
dig -x 93.184.216.34                  # IP → 域名
```

### 8.2 DoT/DoH 查询

```bash
# DoT 查询（使用 kdig）
kdig -d @1.1.1.1 +tls-ca +tls-host=cloudflare-dns.com example.com

# DoH 查询（使用 curl）
curl -sH 'accept: application/dns-json' \
  'https://1.1.1.1/dns-query?name=example.com&type=A'

curl -sH 'accept: application/dns-json' \
  'https://dns.google/resolve?name=example.com&type=AAAA'

# 使用 dog 工具（更友好的输出）
dog example.com
dog --json example.com
dog --https @https://1.1.1.1/dns-query example.com
```

### 8.3 安全审计命令

```bash
# 区域传送测试（检查 AXFR 是否开放）
dig @ns1.example.com example.com AXFR

# DNS 服务器版本探测
dig @dns.example.com version.bind CHAOS TXT
dig @dns.example.com hostname.bind CHAOS TXT

# 子域名枚举
dnsrecon -d example.com
amass enum -d example.com
subfinder -d example.com

# SPF/DKIM/DMARC 检查
dig example.com TXT | grep spf
dig google._domainkey.example.com TXT
dig _dmarc.example.com TXT

# DNS 抓包
tcpdump -i any port 53 -w dns.pcap
tcpdump -i any 'udp port 53' -v
```

### 8.4 Wireshark DNS 过滤器

```
dns                                    # 所有 DNS 流量
dns.flags.response == 0               # 仅查询
dns.flags.response == 1               # 仅响应
dns.qry.name contains "example"       # 查询含某域名
dns.qry.type == 1                     # A 记录查询
dns.qry.type == 28                    # AAAA 记录查询
dns.qry.type == 15                    # MX 记录查询
dns.qry.type == 16                    # TXT 记录查询
dns.count.answers > 0                 # 有响应的 DNS
dns.flags.rcode == 3                  # NXDOMAIN 响应
```

---

## 九、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
| :---: | :--- | :---: | :---: | :--- |
| 1 | DNS 解析流程（递归 vs 迭代） | ⭐⭐⭐⭐⭐ | 中 | 客户端→递归服务器=递归查询；递归服务器→权威=迭代查询 |
| 2 | 常见记录类型（A/AAAA/CNAME/MX/NS） | ⭐⭐⭐⭐⭐ | 低 | A=IPv4、AAAA=IPv6、CNAME=别名、MX=邮件、NS=权威服务器 |
| 3 | DNS 劫持类型与防御 | ⭐⭐⭐⭐⭐ | 中 | 本地/路由器/运营商劫持；防御：DoT/DoH、DNSSEC |
| 4 | Kaminsky 缓存投毒攻击 | ⭐⭐⭐⭐ | 高 | 批量子域 + 伪造 Authority 区域；防御：端口随机化 + DNSSEC |
| 5 | DNS 放大攻击原理 | ⭐⭐⭐⭐ | 中 | 伪造源 IP + 大响应；防御：关闭开放递归、RRL |
| 6 | DNSSEC 原理与局限性 | ⭐⭐⭐⭐ | 中 | 数字签名防篡改；不加密、不防 DoS |
| 7 | DoT vs DoH 区别 | ⭐⭐⭐⭐ | 中 | DoT 独立端口 853、DoH 混在 443 |
| 8 | DNS 隧道检测 | ⭐⭐⭐ | 中 | 长域名、大量 TXT、规律心跳、域名高熵值 |
| 9 | SPF/DKIM/DMARC | ⭐⭐⭐⭐ | 中 | SPF=发件 IP 声明、DKIM=签名、DMARC=策略 |
| 10 | TTL 与缓存 | ⭐⭐⭐ | 低 | TTL 控制缓存时间；负缓存由 SOA MINIMUM 控制 |

### 💡 知识巧记口诀

#### 1. DNS 解析流程
> **"先问根，再问 TLD，最后问权威"**
>
> 三步走：根服务器 → TLD 服务器 → 权威 DNS

#### 2. DNS 记录类型
> **"A 是地址、CNAME 是别名、MX 是邮箱、NS 是管事的、TXT 啥都能写"**

#### 3. DNS 劫持防御
> **"三层防御：DoT/DoH 防窃听、DNSSEC 防篡改、CAA 防伪造证书"**

#### 4. Kaminsky 攻击
> **"批量子域名 + 伪造 Authority = 整域沦陷"**
>
> 防御：**"端口随机 + DNSSEC 签名"**

#### 5. DNS 放大攻击
> **"小请求大响应，源 IP 伪造是关键"**
>
> 防御：**"关闭开放递归 + 限速 + Anycast"**

#### 6. DNS 隧道
> **"域名超长、TXT 频繁、规律心跳——隧道三特征"**

#### 7. 邮件安全三件套
> **"SPF 说谁能发、DKIM 签名保真、DMARC 定规则"**
>
> 记忆：**S-D-D** → SPF → DKIM → DMARC

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
| :--- | :--- |
| "DNSSEC 可以加密 DNS 查询" | ❌ 错误！DNSSEC 只提供签名/完整性，不提供加密。加密需 DoT/DoH |
| "DoH 使用独立端口" | ❌ 错误！DoH 使用 443 端口（HTTPS），DoT 才使用 853 独立端口 |
| "CNAME 可以和其他记录共存" | ❌ 错误！CNAME 记录不能与其他记录共存（RFC 规范） |
| "DNS 只使用 UDP" | ❌ 错误！区域传输、大响应（TC=1）、DNSSEC 等使用 TCP |
| "13 台根服务器" | 不准确！是 13 组/13 个 IP，通过 Anycast 全球有 1000+ 物理节点 |
| "DNS 缓存只存正确结果" | ❌ 错误！NXDOMAIN 也会缓存（负缓存），由 SOA MINIMUM 控制 |

---

## 学习建议

1. 🧭 **手跑一次完整解析**：使用 `dig +trace` 从根到权威完整追踪，画出每一步的 NS/IP 关系图
2. 🔐 **配置 DNSSEC**：给自己的域名（或在 Cloudflare 一键开启）配置 DNSSEC，观察 DNSKEY/DS/RRSIG
3. 🏗️ **搭建小型 DNS 服务器**：用 BIND/Unbound/CoreDNS 做一次递归/权威配置
4. 📡 **对比抓包**：用 Wireshark 抓一次"普通 DNS vs DoH"，直观感受差异
5. 📖 **阅读权威资料**：《DNS & BIND》、RFC 1034/1035、RFC 4033-4035（DNSSEC）

---

> **DNS 看似简单，实则是一个庞大、长期演进的分布式系统——从缓存、递归、权威，到 DNSSEC、DoT/DoH、DANE/HTTPS/SVCB，每一步都可能出现安全问题。掌握 DNS，等于掌握了互联网最底层的"入口安全"。**
