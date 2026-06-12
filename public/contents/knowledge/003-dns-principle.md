# DNS 原理与安全：从解析流程到 DNS 安全扩展

DNS（Domain Name System）把域名翻译成 IP，是互联网的"电话簿"。正因为它如此基础，DNS 也成为攻击者的核心目标——DNS 劫持、缓存投毒、DDoS 放大攻击、DNS 隧道恶意通信屡见不鲜。本文从原理到攻防，整理 DNS 的关键知识点。

## 一、DNS 的角色与结构

- **命名空间**：树形、分布式，从根（`.`）到顶级域（TLD，如 `.com/.cn/.org`）、二级域（`example.com`），再到主机名（`www.example.com`）；
- **权威服务器（Authoritative）**：保存某个域的原始记录；
- **递归服务器（Recursive Resolver）**：代替客户端查询；常见如 `8.8.8.8`（Google Public DNS）、`1.1.1.1`（Cloudflare）、`223.5.5.5`（阿里 DNS）；
- **Stub Resolver**：客户端（系统内置的解析库，通常调用 `gethostbyname/getaddrinfo`）；
- **根服务器**：全球 13 组根服务器（通过 anycast 物理节点远超 13）。

## 二、解析流程：递归 + 迭代

以查询 `www.example.com` 为例：

1. 客户端 → 本地递归服务器：查 `www.example.com`；
2. 递归服务器 → 根服务器：问 `.com` 的权威是谁？
3. 根 → 返回 `.com` 的 TLD 权威；
4. 递归 → `.com` 权威：问 `example.com` 权威是谁？
5. `.com` → 返回 `example.com` 权威；
6. 递归 → `example.com` 权威：问 `www.example.com` 对应 IP？
7. 权威 → 返回 A/AAAA 记录；
8. 递归 → 客户端：交付最终结果，并缓存一段时间（TTL）。

## 三、常见记录类型

| 记录 | 含义 |
| --- | --- |
| A / AAAA | IPv4 / IPv6 地址 |
| CNAME | 别名，指向另一个域名 |
| MX | 邮件服务器 |
| TXT | 任意文本（SPF、DKIM、DMARC、CAA、ACME 验证） |
| NS | 权威 DNS 服务器 |
| SOA | 起始授权（区域信息、主从同步序列号等） |
| PTR | 反向解析（IP → 域名） |
| CAA | 限制哪些 CA 可签发该域名证书 |
| SRV | 服务位置（如 SIP、XMPP） |
| TLSA / DANE | 将 TLS 证书/公钥与 DNS 绑定（需 DNSSEC） |
| HTTPS / SVCB | 新版"服务参数"，用于替代部分 CNAME、加速 ALPN 发现 |

## 四、协议特性

- 默认 **UDP 53**；超过 512 字节（EDNS(0) 后可扩展到 4096）或用于区域传输（AXFR/IXFR）、DNSSEC 时切到 **TCP 53**；
- DoT（DNS over TLS，端口 853）、DoH（DNS over HTTPS，端口 443，路径如 `/dns-query`）、DoQ（DNS over QUIC），对用户隐私与完整性有显著提升；
- 缓存机制：每个记录带 TTL（秒），递归服务器与客户端据此缓存。

## 五、DNS 典型攻击

| 攻击 | 原理 | 防御 |
| --- | --- | --- |
| **DNS 劫持（本地 / 运营商 / 路由器）** | 修改客户端 DNS 设置或投毒本地缓存，把流量引到钓鱼/广告服务器 | 使用 DoT/DoH、检查 `/etc/resolv.conf`、路由器安全、系统级 HSTS |
| **缓存投毒（Kaminsky 攻击）** | 伪造 DNS 响应注入到递归服务器缓存，使缓存返回恶意 IP | DNSSEC、源端口随机化、Query ID 随机化、0x20（大小写）编码 |
| **DNS 放大攻击（DDoS）** | 伪造源 IP + `ANY`/大响应的请求，把攻击流量放大给受害者 | 关闭开放递归、响应率限制、anycast、响应最小化、DNS Flag Day 后 `ANY` 响应限制 |
| **NXDOMAIN / Subdomain DDoS** | 查询不存在的子域，使权威服务器频繁返回 NXDOMAIN | Response Rate Limiting (RRL)、Anycast、WAF 级清洗 |
| **DNS 隧道（Cobalt Strike、恶意软件）** | 把 C2 通信嵌入 DNS 请求/响应（TXT/CNAME/A 记录）绕过防火墙 | 域名白名单、DNS 代理审计、超长域名/异常 TXT 检测、DoH 管控 |
| **域传送漏洞（AXFR）** | 错误配置导致任何人可拉取完整区域记录（`host -l domain server`） | 限制区域传送的来源 IP、使用 TSIG/SIG(0) 做认证 |
| **DNS Rebinding** | 把同一个域名的 A 记录从攻击者 IP 变为内网 IP，绕过同源策略 | DNS rebinding 保护、Pin DNS、限制 SSRF、本地服务加鉴权 |
| **Typosquatting / 仿冒域名** | 注册类似 `paypa1.com` 等易混淆域名进行钓鱼 | 品牌监控、邮件反钓鱼网关、SPF/DKIM/DMARC |
| **域名抢注 / 过期域名** | 域名到期未续费被抢注，成为钓鱼平台 | 自动续费、多厂商备份、长期持有关键域名 |

## 六、DNS 安全增强

### 6.1 DNSSEC（DNS Security Extensions）

- 原理：对 DNS 记录进行签名，客户端通过签名链验证响应的真实性与完整性；
- 核心记录：`RRSIG`（签名）、`DNSKEY`（公钥）、`DS`（Delegation Signer，父域对子域公钥的哈希）、`NSEC/NSEC3`（证明不存在，防投毒与枚举）；
- 价值：防止缓存投毒与数据篡改；**不能加密内容**，所以常与 DoT/DoH 结合；
- 现状：根区已全面开启 DNSSEC，但各 TLD/权威区的部署率仍不均衡。

### 6.2 DoT / DoH / DoQ

- **DoT**（RFC 7858）：DNS over TLS，端口 853。面向客户端/递归之间的链路加密；
- **DoH**（RFC 8484）：DNS over HTTPS，与 Web 流量同端口，难被阻断；
- **DoQ**（RFC 9250）：DNS over QUIC，可看作 DoT 的进化版；
- 优点：防止本地/链路层 DNS 劫持与嗅探；
- 争议：企业网络可能失去 DNS 层的安全过滤与审计能力，需要"企业级 DoH/DoT"或内网递归。

### 6.3 企业侧推荐实践

1. 关闭开放递归；
2. 对权威 DNS 开启 Response Rate Limiting (RRL)，防止放大反射；
3. 使用 anycast 与多厂商备份权威服务器；
4. 部署企业内网递归（如 BIND、Unbound、systemd-resolved），对外使用 DoT/DoH；
5. 对内部服务器禁用不必要的 DNS 解析，或使用白名单；
6. 使用 SPF / DKIM / DMARC 防止邮件钓鱼；
7. 配置 CAA DNS 记录，限制谁可签发本域 HTTPS 证书；
8. 对敏感服务启用 DNSSEC + TLSA/DANE，把 TLS 证书与 DNS 绑定；
9. 监控 DNS 日志，关注长域名、大量 TXT 记录、NXDOMAIN 高峰等异常。

## 七、调试命令与实践

| 命令 | 作用 |
| --- | --- |
| `host www.example.com` / `nslookup www.example.com` | 基础查询 |
| `dig +trace www.example.com` | 从根到权威的完整迭代查询 |
| `dig @8.8.8.8 example.com A +dnssec` | 指定递归 + DNSSEC 查询 |
| `dig example.com CAA` / `dig example.com TXT` | 查 CAA/TXT 等特殊记录 |
| `kdig -d @1.1.1.1 +tls-ca +tls-host=cloudflare-dns.com example.com` | 使用 DoT 查询 |
| `curl -sH 'accept: application/dns-json' 'https://1.1.1.1/dns-query?name=example.com&type=A'` | 使用 DoH JSON 查询 |
| `tcpdump -i any port 53` / Wireshark `dns` 过滤器 | DNS 抓包分析 |
| `dnsrecon / dnsenum / amass enum -d example.com` | 子域名枚举（红队资产测绘） |

## 八、学习建议

1. 使用 `dig +trace` 手跑一次完整解析，把每一步的 NS/IP 画成图；
2. 给自己的域名配置 DNSSEC（或在 Cloudflare 一键开启），观察 DNSKEY/DS/RRSIG；
3. 在本地尝试 BIND/Unbound/CoreDNS 做一次小型递归/权威配置；
4. 用 Wireshark 抓一次"普通 DNS vs DoH"，直观感受差异；
5. 关注《DNS & BIND》或 RFC 1034/1035 等经典资料，夯实协议细节。

DNS 看似简单，实则是一个庞大、长期演进的分布式系统——从缓存、递归、权威，到 DNSSEC、DoT/DoH、DANE/HTTPS/SVCB，每一步都可能出现安全问题。掌握 DNS，等于掌握了互联网最底层的"入口安全"。
