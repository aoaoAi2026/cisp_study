# Wireshark 网络分析实战

> **📘 文档定位**：CISP 考试核心基础 | 难度：⭐⭐⭐ | 预计阅读：25 分钟
> Wireshark 是网络分析领域的事实标准工具，也是 CISP 考试中"安全运维"与"网络监控"板块的重要实操技能。本章从捕获过滤器、显示过滤器、TLS 解密到实战场景，系统讲解 Wireshark 的核心用法与安全分析技巧。

---

## 导航目录
- [一、捕获过滤器 (BPF)](#一捕获过滤器-bpf)
- [二、显示过滤器](#二显示过滤器)
- [三、TLS 解密](#三tls-解密)
- [四、实战场景分析](#四实战场景分析)
- [五、统计功能详解](#五统计功能详解)
- [六、命令行工具 tshark](#六命令行工具-tshark)
- [七、高级分析技巧](#七高级分析技巧)
- [八、安全部署 Checklist](#八安全部署-checklist)
- [九、高分考点与知识巧记](#九高分考点与知识巧记)

---

## 一、捕获过滤器 (BPF)

### 1.1 BPF 基础概念

BPF（Berkeley Packet Filter）是在数据包进入网卡驱动和 Wireshark 之间的一道"过滤门"。它运行在内核态，效率极高，不匹配的包直接被丢弃，不会进入用户态的 Wireshark。

```
┌─────────────────────────────────────────────────────────────┐
│                  Wireshark 数据包处理流程                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  网卡                                                       │
│   ↓                                                         │
│  网卡驱动                                                    │
│   ↓                                                         │
│  ★ BPF 捕获过滤器 ← 内核态，在这里丢弃不匹配的包              │
│   ↓   (不匹配的包直接丢弃，不进入用户态)                       │
│  libpcap / WinPcap / Npcap                                  │
│   ↓                                                         │
│  Wireshark 用户态                                            │
│   ↓                                                         │
│  ★ Display Filter 显示过滤器 ← 用户态，隐藏不匹配的包         │
│   ↓   (包已捕获，只是不显示)                                  │
│  界面展示                                                    │
│                                                             │
│  ★ 核心区别：                                                │
│    捕获过滤器 → 在抓包时就丢弃，不可恢复                       │
│    显示过滤器 → 只是隐藏，数据还在，可随时更改                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

> **🔑 高分考点**：捕获过滤器 vs 显示过滤器的区别——捕获在内核态丢弃（不可恢复），显示在用户态隐藏（可恢复）。

### 1.2 BPF 语法详解

```bash
# ==========================================
# BPF 捕获过滤器语法大全
# ==========================================

# === 1. 主机过滤 ===
host 192.168.1.100           # 所有涉及该 IP 的流量（双向）
src host 192.168.1.100       # 源 IP 为该地址
dst host 192.168.1.100       # 目的 IP 为该地址

# === 2. 网段过滤 ===
net 192.168.1.0/24           # 整个 C 类网段
net 10.0.0.0 mask 255.0.0.0  # 等价于 10.0.0.0/8
src net 172.16.0.0/12        # 源地址属于该网段

# === 3. 端口过滤 ===
port 80                      # 源或目的端口为 80
src port 443                 # 源端口为 443
dst port 3389                # 目的端口为 3389（RDP）
portrange 8000-9000          # 端口范围

# === 4. 协议过滤 ===
tcp                          # 仅 TCP
udp                          # 仅 UDP
icmp                         # 仅 ICMP
arp                          # 仅 ARP
ip                           # 仅 IP（排除 ARP 等非 IP 协议）
ip6                          # 仅 IPv6

# === 5. 逻辑组合 ===
tcp port 80 or tcp port 443        # HTTP 或 HTTPS
host 10.0.0.1 and tcp port 22      # 特定主机的 SSH
not arp                             # 排除 ARP 流量
(host 10.0.0.1 or host 10.0.0.2) and tcp  # 括号分组

# === 6. 高级过滤 ===
greater 1000                  # 包长度 > 1000 字节
less 64                       # 包长度 < 64 字节
ether host 00:11:22:33:44:55 # MAC 地址过滤
broadcast                     # 仅广播流量
multicast                     # 仅多播流量
tcp[tcpflags] & (tcp-syn|tcp-fin) != 0  # 有 SYN 或 FIN 标志的 TCP 包

# === 7. 常用场景示例 ===
# 捕获 HTTP 和 HTTPS 流量
tcp port 80 or tcp port 443

# 捕获特定主机除 SSH 外的所有流量
host 192.168.1.100 and not tcp port 22

# 捕获 VLAN 10 的流量
vlan 10

# 捕获进出某网段的流量
net 192.168.1.0/24

# 捕获 DNS 流量（UDP 53 + TCP 53）
port 53
```

### 1.3 BPF 常用场景速查

| 场景 | BPF 表达式 | 说明 |
|:---|:---|:---|
| 监控某主机 | `host 192.168.1.100` | 该主机的所有流量 |
| 排除自身流量 | `not host 192.168.1.100` | 排除自己的 SSH/RDP 等管理流量 |
| Web 流量 | `tcp port 80 or tcp port 443` | HTTP + HTTPS |
| 邮件流量 | `tcp port 25 or tcp port 110 or tcp port 143 or tcp port 993 or tcp port 995` | SMTP/POP3/IMAP |
| 大包分析 | `greater 1500` | 查找异常大包（可能的数据外泄） |
| 小包分析 | `less 64` | 查找异常小包（可能的扫描） |
| 无 ARP 噪音 | `not arp` | 排除 ARP 广播噪音 |
| 特定 VLAN | `vlan 100` | 特定 VLAN 流量 |

---

## 二、显示过滤器

### 2.1 显示过滤器语法体系

> **🔑 高分考点**：Wireshark 的显示过滤器是实操考试重点，尤其是 TCP 标志位和 HTTP/DNS 的过滤。

```bash
# ==========================================
# 显示过滤器语法大全（按协议分类）
# ==========================================

# === 一、通用 IP 过滤 ===
ip.addr == 192.168.1.100         # 源或目的为该 IP
ip.src == 10.0.0.1               # 仅源 IP
ip.dst == 10.0.0.2               # 仅目的 IP
ip.src_host == "web.example.com"  # 源 IP（通过 DNS 解析）
!(ip.addr == 192.168.1.0/24)     # 排除某网段（注意否定用 !()）
ip.addr == 192.168.1.100 && !(tcp.port == 22)  # 组合过滤

# === 二、TCP 过滤（重点！）===
# 基础标志位
tcp.flags.syn == 1 && tcp.flags.ack == 0    # ★ SYN 扫描特征
tcp.flags.reset == 1                         # RST 包（GFW 攻击特征）
tcp.flags.fin == 1                           # FIN 包
tcp.flags.syn == 1 && tcp.flags.ack == 1    # SYN-ACK（正常握手）
tcp.flags == 0x002                           # 仅 SYN 标志
tcp.flags == 0x029                           # URG+PSH+FIN (Xmas Scan)
tcp.flags == 0x000                           # NULL Scan

# TCP 分析标志
tcp.analysis.retransmission                  # ★ 重传检测
tcp.analysis.fast_retransmission             # 快速重传
tcp.analysis.lost_segment                    # 丢包
tcp.analysis.duplicate_ack                   # 重复 ACK
tcp.analysis.zero_window                     # 零窗口
tcp.analysis.keep_alive                      # Keep-Alive 包
tcp.analysis.window_full                     # 窗口满
tcp.analysis.out_of_order                    # 乱序包

# TCP 端口/流
tcp.port == 80                               # 源或目的端口 80
tcp.srcport == 443                           # 源端口
tcp.dstport == 3389                          # 目的端口 (RDP)
tcp.stream eq 5                              # 第 5 个 TCP 流

# === 三、HTTP 过滤 ===
http                                          # 所有 HTTP 流量
http.request.method == "GET"                  # GET 请求
http.request.method == "POST"                 # POST 请求（登录/上传）
http.request.uri contains "login"             # URI 含 login
http.request.uri contains "admin"             # URI 含 admin（可疑！）
http.host contains "example.com"              # Host 头过滤
http.response.code == 200                     # 200 响应
http.response.code >= 400                     # 所有错误响应
http.user_agent contains "sqlmap"             # SQLMap 特征检测
http.user_agent contains "nmap"               # Nmap 特征检测
http.content_type contains "application/json" # JSON 响应
http.request.method == "POST" && http.content_type contains "multipart/form-data"  # 文件上传

# === 四、DNS 过滤 ===
dns                                           # 所有 DNS 流量
dns.flags.response == 0                       # 仅查询（排除响应）
dns.flags.response == 1                       # 仅响应
dns.flags.rcode == 3                          # NXDOMAIN 响应（域名不存在）
dns.flags.rcode != 0                          # 非成功响应
dns.qry.name contains "suspicious"            # 查询含可疑字符串
dns.qry.name matches "[a-z0-9]{20,}\\.com"    # ★ DGA 域名检测
dns.qry.name matches "^[a-z0-9]{30,}"         # 长随机域名（DNS 隧道）
dns.qry.type == 16                            # TXT 记录（DNS 隧道常用）
dns.qry.type == 1                             # A 记录
dns.qry.type == 28                            # AAAA 记录 (IPv6)
dns.qry.type == 15                            # MX 记录
dns.count.answers == 0                        # 无应答的查询
dns.resp.name contains "malicious"            # 响应中含恶意域名
dns.qry.name.len > 40                         # 查询域名长度 > 40

# === 五、TLS/SSL 过滤 ===
tls                                           # 所有 TLS 流量
tls.handshake.type == 1                       # Client Hello
tls.handshake.type == 2                       # Server Hello
tls.handshake.type == 11                      # Certificate（服务器证书）
tls.handshake.extensions_server_name          # ★ SNI 域名
tls.handshake.extensions_server_name contains "example.com"  # 特定域名
tls.handshake.ciphersuite                     # 加密套件
tls.handshake.version                         # TLS 版本
tls.record.content_type == 23                 # Application Data
tls.alert_message.level == 2                  # Fatal Alert

# === 六、ARP 过滤 ===
arp                                           # 所有 ARP 流量
arp.opcode == 1                               # ARP Request
arp.opcode == 2                               # ARP Reply
arp.duplicate-address-detected                # ★ 重复 IP 检测（ARP 欺骗特征）
arp.src.proto_ipv4 == 192.168.1.100           # 特定 IP 的 ARP
arp.src.hw_mac == 00:11:22:33:44:55          # 特定 MAC 的 ARP

# === 七、ICMP 过滤 ===
icmp                                          # 所有 ICMP
icmp.type == 8                                # Echo Request (Ping)
icmp.type == 0                                # Echo Reply
icmp.type == 3                                # Destination Unreachable
icmp.type == 11                               # TTL Exceeded

# === 八、DHCP 过滤 ===
bootp                                         # 所有 DHCP/BOOTP
bootp.option.dhcp == 1                        # DHCP Discover
bootp.option.dhcp == 2                        # ★ DHCP Offer（检测伪造服务器）
bootp.option.dhcp == 3                        # DHCP Request
bootp.option.dhcp == 5                        # DHCP Ack
bootp.hw.mac_addr == 00:11:22:33:44:55       # 特定 MAC 的 DHCP

# === 九、组合过滤实例 ===
# 检测 HTTP 登录页面访问
http.request.method == "POST" && http.request.uri contains "login"

# 检测特定主机的 Web 流量
ip.addr == 10.0.0.100 && (tcp.port == 80 || tcp.port == 443)

# 检测非标准端口的 HTTP（可能是 C2 通信）
http && !(tcp.port == 80 || tcp.port == 443 || tcp.port == 8080)

# 检测高频率 DNS 查询（需配合统计）
dns.flags.response == 0 && !(dns.qry.name contains "local")

# 检测可疑 SSL 证书（自签名或过期）
tls.handshake.type == 11 && tls.handshake.certificate
```

### 2.2 显示过滤器常用操作符

| 操作符 | 英文 | 说明 | 示例 |
|:---|:---|:---|:---|
| `==` | eq | 等于 | `ip.addr == 10.0.0.1` |
| `!=` | ne | 不等于 | `tcp.port != 80` |
| `>` | gt | 大于 | `frame.len > 1500` |
| `<` | lt | 小于 | `tcp.window_size < 1000` |
| `>=` | ge | 大于等于 | `tcp.port >= 1024` |
| `<=` | le | 小于等于 | `tcp.port <= 1023` |
| `&&` | and | 逻辑与 | `ip.src==10.0.0.1 && tcp` |
| `\|\|` | or | 逻辑或 | `tcp.port==80 \|\| tcp.port==443` |
| `!` | not | 逻辑非 | `!arp` |
| `contains` | | 包含字符串 | `http.host contains "google"` |
| `matches` | | 正则匹配 | `dns.qry.name matches "^[a-z0-9]{20,}"` |
| `in` | | 集合成员 | `tcp.port in {80,443,8080}` |

---

## 三、TLS 解密

### 3.1 三种解密方法对比

> **🔑 高分考点**：RSA 私钥解密不支持 ECDHE，SSLKEYLOGFILE 是推荐方法。

```
┌─────────────────────────────────────────────────────────────┐
│                 TLS 解密三种方法对比                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  方法1: RSA 私钥解密                                         │
│    原理：Wireshark 用服务器私钥解密 Pre-Master Secret          │
│    支持：仅 RSA 密钥交换（非前向安全）                         │
│    不支持：ECDHE/DHE（现代 TLS 1.3 默认使用！）               │
│    配置：Edit → Preferences → RSA Keys → 导入私钥            │
│    局限：现代 HTTPS 几乎都用 ECDHE，此方法基本废了             │
│                                                             │
│  ★ 方法2: SSLKEYLOGFILE（推荐）                              │
│    原理：浏览器/应用导出 Pre-Master Secret 到日志文件          │
│    支持：所有密钥交换算法（包括 ECDHE）                        │
│    配置：                                                    │
│      export SSLKEYLOGFILE=/tmp/sslkeys.log                  │
│      Wireshark → Preferences → TLS → (Pre)-Master-Secret log│
│    优点：支持所有现代加密套件                                 │
│    局限：需要控制客户端（自己的浏览器/设备）                    │
│                                                             │
│  方法3: 中间人代理                                            │
│    原理：Burp Suite / mitmproxy 作为代理解密流量               │
│    支持：HTTP/HTTPS 协议                                     │
│    局限：非 HTTP 协议无法使用，需要安装代理 CA 证书            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 SSLKEYLOGFILE 详细配置

```bash
# === 方法1: 浏览器环境变量 ===

# Linux/macOS
export SSLKEYLOGFILE=/tmp/sslkeys.log
google-chrome &
# 或
firefox &

# Windows (PowerShell)
$env:SSLKEYLOGFILE = "C:\temp\sslkeys.log"
# 然后从该命令行启动浏览器

# === 方法2: curl 使用 ===
SSLKEYLOGFILE=/tmp/sslkeys.log curl https://example.com

# === 方法3: Python 脚本中使用 ===
# import os
# os.environ["SSLKEYLOGFILE"] = "/tmp/sslkeys.log"

# === Wireshark 配置 ===
# Edit → Preferences → Protocols → TLS
# → (Pre)-Master-Secret log filename → /tmp/sslkeys.log
# → 确认后 TLS 流量自动解密显示
```

### 3.3 各方法适用场景

| 场景 | 推荐方法 | 原因 |
|:---|:---|:---|
| 调试自己的 Web 应用 | SSLKEYLOGFILE | 支持所有加密套件 |
| 渗透测试 Web 应用 | Burp/Mitmproxy | 可修改请求/响应 |
| 分析已捕获的流量 | RSA 私钥（仅 RSA 套件） | 流量已保存，但需要私钥 |
| 非 HTTP 的 TLS 协议 | SSLKEYLOGFILE | 代理不支持非 HTTP |
| 分析恶意软件 TLS 通信 | 无法解密 | 除非逆向工程获取密钥 |

---

## 四、实战场景分析

### 4.1 场景一：发现数据外泄

```
分析步骤：

Step 1: 总体流量概览
  Statistics → Summary
  → 总流量、抓包时长、平均速率

Step 2: 找出流量最大的会话
  Statistics → Conversations
  → 按 Bytes 降序排列
  → 查看 IP 对之间的流量分布
  → 重点关注非标准端口的异常大流量

Step 3: 深入分析可疑会话
  右键可疑会话 → Apply as Filter → Selected → A ↔ B
  → 查看该会话的详细数据包

Step 4: 内容分析
  右键包 → Follow → TCP Stream
  → 查看明文内容（或解密后的内容）
  → 搜索敏感关键词：password、secret、confidential、SSN

Step 5: 时间线分析
  Statistics → IO Graph
  → 查看流量突发时间
  → 是否在非工作时间？（更可疑）

红色警报特征：
  ✓ 非标准端口的大流量（如端口 53 上大量 TCP 流量 → DNS 隧道）
  ✓ 固定间隔的周期性流量（如每 60 秒 → C2 Beacon）
  ✓ 出站流量远大于入站流量（数据上传特征）
  ✓ 非工作时间的突发流量
```

### 4.2 场景二：发现 C2 (Command & Control) 通信

```
C2 Beacon 的典型特征：

1. DNS Beacon（通过 DNS 查询传输命令）：
   → 大量查询随机子域名（DGA 域名）
   → 查询间隔固定（如每 30 秒）
   → 过滤：dns.flags.response == 0 && dns.qry.name matches "^[a-z0-9]{20,}"
   → 查看 Statistics → IO Graph 观察周期性

2. HTTP/S Beacon（通过 HTTP 通信）：
   → 周期性 POST 请求
   → User-Agent 异常（不常见的浏览器/工具 UA）
   → URI 模式固定（如 /status.php, /index.asp）
   → 过滤：
     http.request.method == "POST"
     → 然后按时间排序，观察周期性

3. HTTPS Beacon（通过 TLS 通信）：
   → 周期性 TLS 连接
   → SNI 指向可疑域名
   → JA3 指纹异常
   → 过滤：tls.handshake.type == 1
     → 按 ip.dst 统计频率

分析工作流：
  Statistics → Endpoints → 按数据包数排序
  → 找到通信频率最高的 IP
  → 过滤该 IP → Statistics → IO Graph → 设置 1 秒间隔
  → 观察是否有规律的峰值 → C2 Beacon 特征
```

### 4.3 场景三：TCP 重传分析

```
TCP 重传的常见原因：

1. 网络质量问题：
   → 丢包率高 → 大量重传
   → 延迟高 → 重传超时 (RTO) 触发

2. 中间人干扰：
   → ARP 欺骗导致包被丢弃
   → RST 注入导致连接重置

3. 防火墙干扰：
   → 防火墙错误丢弃数据包
   → 应用层过滤导致连接中断

分析步骤：
  # 1. 查看重传统计
  tcp.analysis.retransmission
  → 统计重传次数和分布

  # 2. 区分原因
  tcp.analysis.fast_retransmission
  → 快速重传 = 偶尔丢包（通常是网络质量问题）

  tcp.analysis.retransmission && !tcp.analysis.fast_retransmission
  → 超时重传 = 可能有人为干扰

  # 3. 结合 RST 包分析
  tcp.flags.reset == 1
  → 查看 RST 包的来源
  → 来自第三方 IP → 可能是 RST 注入攻击

  # 4. IO 图分析
  Statistics → IO Graph
  → Y 轴过滤器：tcp.analysis.retransmission
  → 观察重传的时序分布
```

### 4.4 场景四：HTTP 流追踪

```
HTTP 流分析是 Web 安全分析的核心：

# 1. 追踪完整 HTTP 流
右键 HTTP 数据包 → Follow → HTTP Stream
→ 显示完整的请求-响应对话
→ 可以看到：Headers、Cookies、Body、状态码

# 2. 提取特定信息
过滤 POST 请求：
  http.request.method == "POST"
→ 查找登录表单提交 → 可能含明文密码
→ 查找文件上传 → 分析上传内容

过滤认证相关：
  http.authorization
→ 查看 Basic Auth 凭据（Base64 编码，可直接解码）
→ 查看 Bearer Token

过滤 Cookie：
  http.cookie
→ 查看 Session ID
→ 分析 Cookie 属性（Secure/HttpOnly/SameSite）

# 3. 导出 HTTP 对象
File → Export Objects → HTTP
→ 列出所有传输的文件
→ 可以保存下来进一步分析（恶意软件样本等）

# 4. 分析 WebShell 流量
特征：
  → POST 请求到非典型 URI（如 /upload.php, /shell.aspx）
  → 请求体包含 base64 编码数据
  → 响应体包含命令执行结果
过滤：
  http.request.method == "POST" && !(http.request.uri contains ".js" || http.request.uri contains ".css")
  → 排除静态资源，只看动态请求
```

---

## 五、统计功能详解

### 5.1 Statistics 菜单全景

> **🔑 高分考点**：Statistics 各项功能的用途是实操题常考点。

```
┌─────────────────────────────────────────────────────────────┐
│              Wireshark Statistics 功能矩阵                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ★ 1. Summary (摘要)                                        │
│     用途：抓包总览                                           │
│     显示：文件名、抓包时长、总包数、总字节数、平均速率        │
│     场景：第一步，了解整体规模                                │
│                                                             │
│  ★ 2. Protocol Hierarchy (协议层级)                          │
│     用途：查看各协议占比                                      │
│     显示：树状图，按协议层级展示百分比                         │
│     场景：发现异常协议（如内网出现大量 BGP 流量 → 可疑）       │
│                                                             │
│  ★ 3. Conversations (会话)                                  │
│     用途：通信对端分析                                        │
│     显示：每对 IP 间的流量统计（包数、字节数、时长）           │
│     场景：找出通信量最大的 IP 对（数据外泄/横向移动）          │
│     标签页：Ethernet / IP / TCP / UDP                       │
│                                                             │
│  ★ 4. Endpoints (端点)                                      │
│     用途：单端点统计                                          │
│     显示：每个 IP/MAC 的流量汇总                               │
│     场景：找出最活跃的 IP（C2 服务器/扫描源）                  │
│                                                             │
│  ★ 5. IO Graph (IO 图)                                      │
│     用途：流量时序可视化                                       │
│     显示：时间-数据量折线图                                    │
│     场景：发现流量突发、周期性 Beacon、DDoS 攻击               │
│     技巧：叠加多个过滤器（不同颜色线）对比分析                  │
│                                                             │
│  ★ 6. Flow Graph (流图)                                     │
│     用途：通信序列可视化                                       │
│     显示：时间轴上的通信序列图                                 │
│     场景：分析 TCP 握手、TLS 协商、请求-响应时序               │
│                                                             │
│  ★ 7. Expert Info (专家信息)                                 │
│     用途：协议异常自动检测                                     │
│     显示：Errors/Warnings/Notes/Chats 四个级别                │
│     场景：快速定位协议层面的异常                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 各功能使用技巧

```
Conversations 使用技巧：
  → 右键列标题 → 选择显示列（Bytes、Packets、Duration 等）
  → 按 Bytes 排序 → 找大流量会话
  → 按 Packets 排序 → 找高频通信
  → 右键会话 → Apply as Filter → 深入分析
  → 勾选 "Name resolution" → 显示主机名而非 IP

Endpoints 使用技巧：
  → 按 Tx Bytes 排序 → 找数据发送方
  → 按 Rx Bytes 排序 → 找数据接收方
  → 右键 → 创建过滤 → 分析单个 IP 的行为
  → 关注非标准端口的高流量端点

IO Graph 使用技巧：
  → 设置合适的间隔（1 秒/10 秒/1 分钟，根据场景）
  → 叠加多个过滤器（不同颜色）：
    绿色线：tcp.port == 80   (HTTP)
    红色线：tcp.port == 443  (HTTPS)
    蓝色线：dns              (DNS)
  → 鼠标悬停查看具体数值
  → 放大 (Ctrl++) 观察细节

Expert Info 使用技巧：
  → 优先关注 "Error" 和 "Warning" 级别
  → "Note" 和 "Chat" 通常是正常信息
  → 常见异常提示：
    "TCP Previous segment not captured" → 丢包或捕获不全
    "TCP Dup ACK" → 重复确认（可能丢包）
    "TCP Retransmission" → 重传
    "TCP Out-Of-Order" → 乱序
```

---

## 六、命令行工具 tshark

### 6.1 tshark 基础

tshark 是 Wireshark 的命令行版本，适用于服务器环境、自动化脚本和批量分析。

```bash
# ==========================================
# tshark 常用命令
# ==========================================

# === 基本抓包 ===
# 抓取 eth0 上 100 个包
tshark -i eth0 -c 100

# 抓取并保存到文件
tshark -i eth0 -w capture.pcap -c 1000

# === 过滤抓包 ===
# 仅抓取 HTTP 流量
tshark -i eth0 -f "tcp port 80" -w http.pcap

# 抓取特定主机流量
tshark -i eth0 -f "host 192.168.1.100" -w host.pcap

# === 读取和分析 ===
# 读取 pcap 文件并显示
tshark -r capture.pcap

# 读取并应用显示过滤器
tshark -r capture.pcap -Y "http.request.method == POST"

# 统计协议层级
tshark -r capture.pcap -z io,phs

# 统计会话
tshark -r capture.pcap -z conv,tcp

# === 字段提取 ===
# 提取特定字段（-T fields -e 字段名）
tshark -r capture.pcap -T fields -e ip.src -e ip.dst -e tcp.port

# 提取 HTTP Host 和 URI
tshark -r capture.pcap -Y "http.request" \
  -T fields -e http.host -e http.request.uri

# 提取 DNS 查询域名
tshark -r capture.pcap -Y "dns.flags.response == 0" \
  -T fields -e dns.qry.name

# 提取 TLS SNI
tshark -r capture.pcap -Y "tls.handshake.extensions_server_name" \
  -T fields -e tls.handshake.extensions_server_name

# === 统计输出 ===
# 端点统计
tshark -r capture.pcap -z endpoints,tcp

# IO 图统计
tshark -r capture.pcap -z io,stat,1,"tcp.port==80","tcp.port==443"

# === 批量处理 ===
# 遍历目录下所有 pcap 文件，提取 DNS 查询
for f in *.pcap; do
  echo "=== $f ==="
  tshark -r "$f" -Y "dns.flags.response == 0" \
    -T fields -e dns.qry.name | sort | uniq -c | sort -rn
done
```

### 6.2 tshark vs Wireshark

| 特性 | Wireshark (GUI) | tshark (CLI) |
|:---|:---|:---|
| 可视化分析 | ✅ 丰富的图形界面 | ❌ 纯文本输出 |
| 交互式操作 | ✅ 点击、过滤、追踪流 | ❌ 需重新运行命令 |
| 自动化脚本 | ❌ 不方便 | ✅ 可管道、脚本化 |
| 服务器部署 | ❌ 需要 GUI 环境 | ✅ 无头服务器可用 |
| 资源消耗 | 高 | 低 |
| 批量处理 | 手动 | ✅ 自动化 |
| TLS 解密 | ✅ GUI 配置 | ✅ 命令行参数 |

---

## 七、高级分析技巧

### 7.1 颜色规则定制

```
Wireshark 默认颜色规则：
  → 黑色背景 + 不同协议用不同颜色
  → View → Coloring Rules → 自定义

推荐自定义规则：
  1. TCP RST 包 → 红色加粗
     规则：tcp.flags.reset == 1
     
  2. HTTP 错误响应 → 橙色
     规则：http.response.code >= 400
     
  3. TCP 重传 → 黄色
     规则：tcp.analysis.retransmission
     
  4. DNS NXDOMAIN → 紫色
     规则：dns.flags.rcode == 3
     
  5. ICMP 错误 → 深红
     规则：icmp.type >= 3
```

### 7.2 常用分析技巧汇总

```
1. 快速定位关键数据包：
   Ctrl+G → 输入包编号 → 直接跳转
   或 Edit → Find Packet → 搜索字符串/十六进制

2. 时间参考：
   右键包 → Set/Unset Time Reference
   → 将该包设为时间零点 → 便于分析相对时间
   → 对于 Beacon 检测特别有用

3. 列定制：
   右键列标题 → Column Preferences
   → 添加自定义列（如：TCP Stream Index, DNS Query Name）
   → 提高分析效率

4. 导出特定流：
   右键 TCP 流 → Follow → TCP Stream
   → Show and save data as → Raw
   → 导出二进制数据进一步分析

5. 包注释：
   右键包 → Packet Comment
   → 添加分析备注 → 便于回顾和报告

6. 合并 pcap 文件：
   File → Merge → 选择另一个 pcap 文件
   → 合并多个抓包文件分析

7. Profile 管理：
   Edit → Configuration Profiles
   → 为不同场景创建不同配置（安全分析/协议开发/性能分析）
   → 快速切换列布局和颜色规则
```

---

## 八、安全部署 Checklist

| 序号 | 检查项 | 状态 | 熟练程度 |
|:---:|:---|:---:|:---:|
| 1 | BPF 捕获过滤器熟练使用 | ☐ | □ 初级 □ 中级 □ 高级 |
| 2 | Display Filter 高级语法掌握 | ☐ | □ 初级 □ 中级 □ 高级 |
| 3 | TLS 解密 (SSLKEYLOGFILE) 配置 | ☐ | □ 能 □ 不能 |
| 4 | HTTP/DNS/TCP 会话追踪 | ☐ | □ 初级 □ 中级 □ 高级 |
| 5 | ARP/DNS/DHCP 攻击流量识别 | ☐ | □ 初级 □ 中级 □ 高级 |
| 6 | C2 Beacon 检测能力 | ☐ | □ 初级 □ 中级 □ 高级 |
| 7 | Statistics 统计功能应用 | ☐ | □ 初级 □ 中级 □ 高级 |
| 8 | Expert Info 异常检测使用 | ☐ | □ 初级 □ 中级 □ 高级 |
| 9 | tshark 命令行自动化 | ☐ | □ 初级 □ 中级 □ 高级 |
| 10 | 数据外泄流量分析 | ☐ | □ 初级 □ 中级 □ 高级 |

---

## 九、高分考点与知识巧记

### 📊 高分考点速查表

| 序号 | 考点名称 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | 捕获 vs 显示过滤器 | ⭐⭐⭐⭐⭐ | ⭐⭐ | 捕获=内核丢弃不可恢复，显示=用户态隐藏可恢复 |
| 2 | BPF 语法 | ⭐⭐⭐⭐ | ⭐⭐ | host/net/port/src/dst + 逻辑组合 |
| 3 | TCP 标志位过滤 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | syn==1&&ack==0(SYN扫描), reset==1(RST注入) |
| 4 | DNS 过滤检测 DGA | ⭐⭐⭐⭐ | ⭐⭐⭐ | matches 正则匹配长随机域名 |
| 5 | TLS 解密三种方法 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | RSA(不支持ECDHE)/SSLKEYLOGFILE(推荐)/代理(仅HTTP) |
| 6 | Follow TCP Stream | ⭐⭐⭐⭐ | ⭐⭐ | 右键→Follow→TCP Stream 查看完整会话 |
| 7 | Statistics 功能 | ⭐⭐⭐⭐ | ⭐⭐ | Summary/Protocol Hierarchy/Conversations/Endpoints/IO Graph |
| 8 | tshark 字段提取 | ⭐⭐⭐ | ⭐⭐⭐ | -T fields -e 字段名 组合使用 |
| 9 | Expert Info 用途 | ⭐⭐⭐ | ⭐⭐ | 自动标注协议异常 (Errors/Warnings/Notes/Chats) |
| 10 | ARP 欺骗检测过滤 | ⭐⭐⭐⭐ | ⭐⭐ | arp.duplicate-address-detected |

### 🎵 知识巧记口诀

```
Wireshark 分析三部曲：
  捕获过滤器先设好（BPF 内核把关）
  显示过滤器再精筛（用户态细分析）
  统计功能找异常（图形化看趋势）

BPF 语法巧记：
  host 指主机，net 管网段
  port 定端口，src/dst 定方向
  tcp/udp/arp 选协议
  and/or/not 做组合

显示过滤器重点：
  TCP 标志看扫描（syn==1&&ack==0）
  RST 包查注入（tcp.flags.reset==1）
  DNS 域名正则匹配 DGA（matches 长随机）
  TLS 握手看 SNI（extensions_server_name）

TLS 解密三句话：
  RSA 私钥老方法，ECDHE 不支持
  SSLKEYLOGFILE 新推荐，所有套件都能解
  Burp 代理中间人，只限 HTTP 和 HTTPS

统计功能速记：
  Summary 看总览
  Hierarchy 看占比
  Conversations 看会话
  Endpoints 看端点
  IO Graph 看趋势
  Flow Graph 看序列
  Expert Info 看异常
```

### ⚠️ 考试陷阱提醒

| 序号 | 常见错误理解 | 正确理解 |
|:---:|:---|:---|
| 1 | "捕获过滤器可以事后修改" | ❌ 捕获时丢弃的包无法恢复 |
| 2 | "显示过滤器和捕获过滤器语法一样" | ❌ 语法不同，BPF 更受限 |
| 3 | "RSA 私钥可以解密所有 TLS 流量" | ❌ 仅支持 RSA 密钥交换，不支持 ECDHE/DHE |
| 4 | "SSLKEYLOGFILE 可以解密任何人的流量" | ❌ 需要控制客户端导出密钥 |
| 5 | "tcp.analysis.retransmission 一定表示攻击" | 可能是网络质量问题，需结合上下文 |
| 6 | "Follow TCP Stream 可以看所有协议内容" | ❌ 仅 TCP，UDP 需 Follow UDP Stream |
| 7 | "Wireshark 默认能解密 TLS" | ❌ 必须配置私钥或 SSLKEYLOGFILE |
| 8 | "BPF 支持 contains/matches" | ❌ BPF 不支持字符串匹配，那是显示过滤器语法 |
| 9 | "arp.duplicate-address-detected 一定是攻击" | 也可能是 DHCP 冲突或配置错误 |
| 10 | "tshark 可以完全替代 Wireshark" | ❌ 自动化场景用 tshark，交互分析用 Wireshark |
