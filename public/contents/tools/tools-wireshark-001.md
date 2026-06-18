# Wireshark 流量分析实战：从抓包到溯源

> 分类：工具指南 | 难度：进阶 | 阅读时间：约60分钟

## 概述

Wireshark（原名 Ethereal）是全球使用最广泛的网络协议分析器，由 Gerald Combs 于 1998 年创建。无论是蓝队的告警研判、应急溯源、流量取证，还是红队的数据窃取分析、协议逆向、漏洞研究，Wireshark 都是不可替代的核心分析武器。本指南从基础过滤语法到高级攻击流量识别，帮你建立完整的流量分析方法论。

**核心竞争力**：
- 协议解析深度无人能及（OSI 第2层到第7层全覆盖，3000+ 协议）
- 原生 GUI 分析界面，直观展示协议字段
- 社区活跃，协议解析器更新快
- tshark 命令行版支持批量自动化分析

## 核心知识点

- 抓包前的环境准备与捕获过滤器（Capture Filter）BPF 语法
- 显示过滤器的核心语法与 100+ 常用过滤表达式
- TCP 三次握手与四次挥手分析、重传与拥塞控制诊断
- HTTP/HTTPS/DNS/DHCP/SMB 等常见协议的深入分析
- 常见攻击流量的特征识别
- 统计功能与数据导出
- tshark 命令行自动化批量分析

---

## 一、环境搭建

### 1.1 安装

```bash
# Linux (Debian/Ubuntu/Kali)
sudo apt install wireshark -y
sudo usermod -aG wireshark $USER     # 允许非 root 抓包，需重新登录

# Fedora/CentOS 8+
sudo dnf install wireshark -y

# Arch Linux
sudo pacman -S wireshark-qt

# macOS
brew install --cask wireshark

# Windows
# 下载：https://www.wireshark.org/download.html
# 安装时勾选 "Install Npcap"（非 WinPcap，后者已停止维护）
# 勾选 "Install USBPcap" 可抓 USB 流量
```

### 1.2 命令行工具 tshark

```bash
tshark --version
# tshark 与 Wireshark 共享同一套协议解析引擎
# 适合脚本化、批量处理、远程服务器无 GUI 环境
```

### 1.3 界面布局速览

```
┌──────────────────────────────────────────────┐
│ 菜单栏 + 主工具栏（过滤栏、抓包控制按钮）       │
├──────────────────────────────────────────────┤
│ 包列表 (Packet List)：                        │
│ No.│Time    │Source       │Dest    │Proto│Info│
├──────────────────────────────────────────────┤
│ 包详情 (Packet Details)：协议树状展开          │
│ Frame → Eth → IP → TCP → HTTP → ...          │
├──────────────────────────────────────────────┤
│ 包字节 (Packet Bytes)：Hex + ASCII 对照        │
└──────────────────────────────────────────────┘
```

---

## 二、抓包前的准备

### 2.1 选择正确的网卡

```
抓包 → 选择接口：
- eth0/wlan0：物理网卡
- lo/loopback：本地回环（测试 localhost 服务时用）
- any：捕获所有接口（Linux，混杂模式）
- Npcap Loopback Adapter（Windows，本地回环）
```

### 2.2 捕获过滤器（Capture Filter）

在开始抓包前使用 BPF（Berkeley Packet Filter）语法，减少无关流量，节省存储和处理资源：

| 过滤器 | 说明 | 使用场景 |
|:---|:---|:---|
| `host 192.168.1.1` | 仅该主机流量 | 监控单台设备 |
| `net 192.168.1.0/24` | 仅该子网 | 监控特定网段 |
| `port 80` | 仅 80 端口 | HTTP 流量分析 |
| `port 80 or port 443` | HTTP + HTTPS | Web 服务监控 |
| `tcp port 445` | 仅 SMB 流量 | Windows 共享监控 |
| `port 53` | DNS 流量（UDP+TCP） | DNS 问题排查 |
| `not arp and not stp` | 排除 ARP 和 STP | 减少内网噪音 |
| `host 10.0.0.5 and not port 22` | 某主机除 SSH 外 | 特定主机监控 |
| `tcp port 80 or udp port 53` | HTTP 或 DNS | 复合条件 |
| `src host 10.0.0.10` | 源 IP 为 10.0.0.10 | 某主机的出站流量 |
| `dst host 192.168.1.1` | 目标 IP 为 192.168.1.1 | 到该主机的入站流量 |
| `tcp[13] & 2 != 0` | 仅 SYN 包 | 检测端口扫描 |
| `greater 1500` | 大于 1500 字节的包 | 大文件传输监控 |
| `broadcast or multicast` | 广播和组播 | 网络发现协议 |
| `vlan` | 仅 VLAN 标签流量 | 交换机 trunk 口 |

### 2.3 抓包方式选择

| 方式 | 命令/操作 | 说明 |
|:---|:---|:---|
| GUI 实时抓包 | 选择网卡 → 双击 | 最常用 |
| tcpdump 后台抓包 | `tcpdump -i eth0 -w capture.pcap` | 服务器无 GUI |
| tshark 命令行 | `tshark -i eth0 -w out.pcap` | Wireshark 原生引擎 |
| 导入已有 pcap | 文件 → 打开 | 分析他人共享的抓包文件 |
| 远程抓包 | WinPcap/Npcap Remote | SSH + tcpdump 管道 |

---

## 三、显示过滤器（Display Filter）——核心技能

显示过滤器在捕获后使用，精确筛选已抓取的数据包。

### 3.1 IP 层面过滤

```
# IP 地址过滤
ip.addr == 192.168.1.1           # 源或目标 IP（最常用）
ip.src == 10.0.0.5                # 仅源 IP
ip.dst == 10.0.0.6                # 仅目标 IP
ip.src_host == "example.com"       # 域名过滤（需先解析）
ip.addr == 192.168.1.0/24         # CIDR 子网
!(ip.addr == 192.168.1.1)          # 排除某 IP 的所有流量

# IP 字段
ip.ttl <= 64                       # TTL 过滤（常见 Linux 默认64）
ip.ttl == 128                      # TTL 过滤（常见 Windows 默认128）
ip.flags.mf == 1                   # 分片包（More Fragments）
ip.frag_offset > 0                 # 非首片分片
ip.tos == 0x10                     # 低延迟服务类型
ip.proto == 6                      # 仅 TCP 协议（6=TCP, 17=UDP, 1=ICMP）
```

### 3.2 TCP 层面过滤

```
# TCP 基础过滤
tcp.port == 80                     # 源或目标端口为 80
tcp.srcport == 443                 # 源端口
tcp.dstport == 8080                # 目标端口

# TCP 标志位过滤（网络安全分析必备）
tcp.flags.syn == 1 && tcp.flags.ack == 0    # 仅 SYN 包（第一次握手/扫描）
tcp.flags.syn == 1 && tcp.flags.ack == 1    # SYN-ACK 包（第二次握手）
tcp.flags.ack == 1 && tcp.flags.syn == 0    # 纯 ACK 包（数据传输）
tcp.flags.reset == 1                          # RST 包（连接重置/端口关闭）
tcp.flags.fin == 1                            # FIN 包（连接结束）
tcp.flags == 0x002                            # 仅 SYN
tcp.flags == 0x012                            # SYN-ACK
tcp.flags == 0x010                            # 仅 ACK
tcp.flags == 0x004                            # 仅 RST
tcp.flags == 0x014                            # RST-ACK
tcp.flags.urg == 1                            # URG 标志（紧急数据）

# TCP 分析与异常检测
tcp.analysis.retransmission                    # 重传包
tcp.analysis.fast_retransmission               # 快速重传
tcp.analysis.duplicate_ack                     # 重复 ACK
tcp.analysis.zero_window                       # 零窗口（流量控制）
tcp.analysis.window_full                       # 窗口满
tcp.analysis.keep_alive                        # Keep-Alive 探测
tcp.analysis.keep_alive_ack                    # Keep-Alive 响应
tcp.analysis.bytes_in_flight > 1000000         # 未确认数据超1MB
tcp.time_delta > 1                             # TCP 包间隔超过 1 秒
tcp.window_size == 0                           # 窗口大小为0

# TCP 选项
tcp.options.mss_val                            # MSS 值
tcp.options.wscale                             # 窗口缩放因子
tcp.options.sack_perm                          # SACK 支持
```

### 3.3 HTTP 层面过滤

```
# HTTP 请求
http.request                                     # 所有 HTTP 请求
http.request.method == GET                       # GET 请求
http.request.method == POST                      # POST 请求
http.request.method == PUT                       # PUT 请求
http.request.method == DELETE                    # DELETE 请求
http.request.uri contains "login"                # URI 包含 login
http.request.uri contains ".."                   # 路径遍历嫌疑
http.request.uri contains "union"                # SQL 注入嫌疑
http.request.uri matches "^/admin"               # 管理后台请求
http.request.uri contains ".php?"                # PHP 参数
http.request.version == "HTTP/1.0"               # HTTP/1.0 请求（可能是扫描器）

# HTTP 响应
http.response                                    # 所有 HTTP 响应
http.response.code == 200                        # 200 响应
http.response.code >= 400                        # 所有错误响应
http.response.code == 500                        # 500 服务器内部错误
http.response.code == 403                        # 403 禁止访问
http.response.code == 302                        # 302 重定向

# HTTP Header 过滤
http.host == "example.com"                       # 特定 Host 头
http.host contains "admin"                       # Host 包含 admin
http.user_agent contains "sqlmap"                # SQLMap 扫描检测
http.user_agent contains "nmap"                  # Nmap NSE 扫描检测
http.user_agent contains "python"                # Python 脚本请求
http.user_agent contains "curl"                  # Curl 请求
http.content_type contains "json"                # JSON 响应
http.content_type contains "multipart"           # 文件上传
http.server contains "Apache"                    # 服务器指纹
http.cookie contains "session"                   # 含 Session Cookie
http.cookie contains "PHPSESSID"                 # PHP Session
http.authorization                               # 含认证头

# HTTP 内容
http.file_data contains "password"               # 响应体含 password
http.file_data contains "admin"                  # 响应体含 admin
http.content_length > 1000000                    # 大文件响应
http.request.line contains "eval"                # 请求含 eval（Webshell/代码执行）
http.request.line contains "base64_decode"       # PHP 后门特征
http.response.line contains "root:"              # 敏感信息泄露
```

### 3.4 DNS 层面过滤

```
# DNS 基础过滤
dns                                                # 所有 DNS 流量
dns.flags.response == 0                            # DNS 查询
dns.flags.response == 1                            # DNS 响应
dns.qry.name == "example.com"                      # 精确域名
dns.qry.name contains "evil"                       # 域名包含 evil
dns.qry.name matches ".[a-zA-Z0-9]{20,}"           # 长域名（DNS 隧道特征）
dns.qry.type == 1                                  # A 记录查询
dns.qry.type == 28                                 # AAAA 记录查询
dns.qry.type == 16                                 # TXT 记录（隧道常用）
dns.qry.type == 5                                  # CNAME 记录
dns.qry.type == 15                                 # MX 记录
dns.qry.type == 255                                # ANY 查询（域传送尝试）
dns.count.answers == 0                             # 无应答（NXDOMAIN/DGA）
dns.flags.rcode != 0                               # DNS 查询失败
dns.flags.rcode == 3                               # NXDOMAIN（域名不存在）
dns.flags.rcode == 5                               # REFUSED（请求被拒绝）
dns.resp.len > 512                                 # 异常大的DNS响应
dns.a                                              # A 记录解析结果
```

### 3.5 SMB/NBSS 层面过滤

```
smb || smb2                                        # 所有 SMB 流量
smb.cmd == 0x73                                    # SMB Session Setup（认证）
smb.cmd == 0x75                                    # SMB Tree Connect（连接共享）
smb.nt_status == 0xc0000022                        # ACCESS DENIED
smb.nt_status == 0xc000006d                        # LOGON FAILURE
nbns.name contains "WORKGROUP"                     # NetBIOS 名称
nbns.flags == 0x2910                               # 名称注册请求
```

### 3.6 ICMP 层面过滤

```
icmp                                               # 所有 ICMP
icmp.type == 0                                     # Echo Reply
icmp.type == 8                                     # Echo Request
icmp.type == 3                                     # Destination Unreachable
icmp.type == 3 && icmp.code == 3                   # Port Unreachable
icmp.type == 11                                    # Time Exceeded（Traceroute）
icmp.type == 3 && icmp.code == 13                  # Admin Prohibited（防火墙阻止）
data.len > 100                                     # 大 ICMP 包（ICMP 隧道嫌疑）
```

### 3.7 逻辑组合与高级过滤

```
# 逻辑运算符：&& (and), || (or), ! (not), () 分组

# 实用组合
(http or dns) and !(ip.src == 10.0.0.1)            # HTTP/DNS 排除某 IP
tcp.port == 445 and tcp.flags.syn == 1             # SMB 扫描检测
http.request.method == POST and http.content_length > 1000  # 大 POST 请求
(http.request or http.response) and !(tcp.port==443)        # 非 HTTPS 的 HTTP

# contains 与 matches（正则）
http.user_agent contains "sqlmap"
http.host matches "^[a-z0-9]+\\.example\\.com$"
dns.qry.name matches "^[a-z]{20,}\\.(com|net|org)$"

# 按帧编号范围过滤
frame.number >= 100 and frame.number <= 200

# 按时间过滤
frame.time >= "2024-01-01 10:00:00"
frame.time_relative > 10.0                          # 开始抓包后10秒
```

### 3.8 过滤栏实用技巧

```
技巧1：绿色底色 = 语法正确；红色底色 = 语法错误
技巧2：过滤栏右侧的"书签"按钮可保存常用过滤器
技巧3：选中数据包的某字段 → 右键 → "Apply as Filter" → "Selected"
技巧4：右键 → "Prepare as Filter" → 组合多个条件
技巧5：右键 → "Apply as Filter" → "And not Selected" 排除
技巧6：Ctrl+/ 或点击表达式的 + 号可添加多个过滤条件
技巧7：过滤历史（过滤栏右侧向下箭头）快速复用
```

---

## 四、追踪 TCP 流——会话还原

### 4.1 Follow TCP Stream

Wireshark 的 TCP Stream 功能可以还原完整的 TCP 会话，是流量分析中最常用的功能之一。

```
操作：选中任意 TCP 数据包 → 右键 → Follow → TCP Stream

输出格式：
- 红色文字 = 客户端 → 服务端
- 蓝色文字 = 服务端 → 客户端
- 可切换显示格式：ASCII / EBCDIC / Hex Dump / C Arrays / Raw

实用技巧：
- 底部过滤栏自动应用：tcp.stream eq 0
- 在 Stream 窗口中搜索关键词：Ctrl+F
- 导出流内容：Save As
```

### 4.2 Follow 其他协议流

```
Follow HTTP Stream    → 还原 HTTP 请求/响应对
Follow UDP Stream     → 还原 UDP 会话（如 DNS 查询-响应）
Follow TLS Stream     → 解密后的 TLS 内容（需有私钥/Session Key）
Follow HTTP/2 Stream  → HTTP/2 多路复用流
```

### 4.3 TCP 流实战场景

| 场景 | 操作 | 目的 |
|:---|:---|:---|
| 明文密码提取 | 追踪 HTTP/FTP/Telnet 流 | 查看登录凭据 |
| 文件还原 | 追踪包含文件传输的流 | 导出传输的文件 |
| SQL 注入分析 | 追踪含注入 Payload 的流 | 分析注入过程和结果 |
| Webshell 通信 | 追踪规律性 POST 请求流 | 分析后门内容 |
| 邮件内容 | 追踪 SMTP/POP3 流 | 查看邮件正文和附件 |

---

## 五、常见攻击流量识别

### 5.1 端口扫描检测

```
# 常见扫描特征

TCP SYN 扫描（nmap -sS）：
- 过滤：tcp.flags.syn == 1 and tcp.flags.ack == 0
- 特征：单一源 IP 在短时间内向目标多个端口发送 SYN 包
- 分析：统计 → 终端节点 → 查看某个 IP 连接的目标端口数

TCP Connect 扫描（nmap -sT）：
- 过滤：tcp.flags.syn == 1 and tcp.flags.ack == 0
- 在 SYN-ACK 后立即跟 RST（完成三次握手后断开）
- 特征：大量短连接

UDP 扫描（nmap -sU）：
- 过滤：udp and icmp.type == 3 and icmp.code == 3
- 大量 UDP 包后跟 ICMP Port Unreachable

Xmas 扫描（nmap -sX）：
- 过滤：tcp.flags.fin == 1 && tcp.flags.psh == 1 && tcp.flags.urg == 1

NULL 扫描（nmap -sN）：
- 过滤：tcp.flags == 0x000

ACK 扫描（nmap -sA）：
- 过滤：tcp.flags == 0x010 and tcp.len == 0
```

### 5.2 SQL 注入检测

```
特征1：HTTP 请求 URI/Body 中含 SQL 关键字
过滤：http.request.uri contains "union" or
      http.request.uri contains "select" or
      http.request.uri contains "sleep" or
      http.request.uri contains "benchmark" or
      http.request.uri contains "information_schema"

特征2：sqlmap 自动化工具特征
过滤：http.user_agent contains "sqlmap"

特征3：时间盲注（响应延迟）
分析：统计 → I/O 图表 → 观察是否有规律的延迟峰值

检测流程：
1. 过滤 HTTP POST 请求：http.request.method == POST
2. 逐个追踪 TCP 流，检查 Payload 内容
3. 关注包含单引号、双引号、注释符号(--,#)的请求
```

### 5.3 XSS 跨站脚本攻击

```
特征：HTTP 请求中包含 <script>、javascript:、onerror= 等
过滤：
http.request.uri contains "<script>" or
http.request.uri contains "alert(" or
http.request.uri contains "onerror" or
http.request.uri contains "onload" or
http.request.uri contains "javascript:" or
http.request.uri contains "document.cookie" or
http.request.uri contains "String.fromCharCode"
```

### 5.4 Webshell 通信检测

```
特征1：异常 HTTP POST 请求
过滤：http.request.method == POST

分析要点：
- 请求间隔是否有规律（心跳/轮询）
- POST Body 是否包含 Base64 编码内容
- User-Agent 是否异常（如 python-requests、自定义值）
- 请求路径是否为已知 Webshell 文件名（1.php, cmd.aspx, shell.jsp）

常见中国菜刀/蚁剑流量特征：
- UA: "Mozilla/5.0" 或空
- Body 特征：eval(base64_decode
- 请求参数名：z0/z1/z2（菜刀）、@ini_set（蚁剑）

冰蝎 Behinder 流量特征：
- Content-Type: application/octet-stream
- AES 加密的二进制 Body
- Accept: text/html, image/gif, image/jpeg, *

哥斯拉 Godzilla 流量特征：
- 加密 Cookie：PHPSESSID= 后跟 Base64
- 请求中含有特定加密模式标记
```

### 5.5 Cobalt Strike Beacon 检测

```
CS Beacon HTTP C2 特征：
- 周期性 HTTP GET 请求（心跳，通常每 30-120 秒一次）
- 默认请求路径：/submit.php, /jquery-3.3.1.min.js, /ga.js
- HTTP 响应可能包含空 Body 或一小段伪装的 JS 代码
- 自定义 Malleable C2 Profile 可改变所有静态特征

检测方法：
1. 过滤周期性 GET 请求：http.request.method == GET
2. 统计 → I/O 图表 → 设置 1 秒间隔 → 观察规律性尖峰
3. 找出周期性GET请求 → 追踪 TCP 流 → 分析 Content-Length 和响应体
4. 查看 HTTP Header 中的 Cookie 字段：可能含 Metadata（Base64 编码）
5. 时间间隔分析：statistics → IO Graph 中规律性突起的可能性极高

CS Beacon DNS C2 特征：
- 大量 A/AAAA/TXT 查询到特定域
- 域名子域名异常长或随机
- 多条查询指向同一域名
过滤：dns.qry.name contains ".example.com"
```

### 5.6 DNS 隧道检测

```
特征：
- 异常长的 DNS 查询域名（超过 50 个字符）
- 同一域名大量子域名查询
- 非标准 TLD 或异常少见的顶级域名
- DNS TXT 查询异常频繁
- DNS 响应大小异常（超过 512 字节）

过滤器：
dns.qry.name matches "^[a-zA-Z0-9]{30,}\\.[a-z]{2,10}$"
dns.qry.type == 16                          # TXT 记录（隧道常用于数据传输）
dns.resp.len > 512                          # 异常的响应大小
dns.flags.response == 0 and dns.qry.name contains "base64"

检测步骤：
1. 统计 → DNS → 按域名聚合
2. 排序查看查询次数最多的域名
3. 筛选长域名 → 追踪DNS流
4. 检查子域名部分是否包含编码数据（Base64/Hex）
```

### 5.7 暴力破解/密码喷洒

```
特征：
- 短时间内大量登录请求到同一服务
- 每个请求使用不同密码
- 响应大小或内容有规律变化（失败 vs 成功）

SSH 爆破检测：
过滤：tcp.port == 22 and tcp.flags.reset == 1
分析：大量来自同一源IP的RST包（认证失败断开）

RDP 爆破检测：
过滤：tcp.port == 3389 and tcp.flags.syn == 1 and tcp.flags.ack == 0
分析：大量 SYN 包后跟少量完整会话

HTTP 登录爆破检测：
过滤：http.request.method == POST and http.request.uri contains "login"
分析步骤：
1. 统计 → HTTP → 请求 → 按 URI 聚合
2. 找到登录接口
3. 过滤该 URI 的所有 POST 请求
4. 通过响应状态码/响应长度区分成功与失败
5. 统计请求频率，判断是否为自动化攻击
```

### 5.8 数据泄露（外传）检测

```
特征：
- 异常大的 HTTP POST Body（向外部 IP）
- 非工作时间的大量上传流量
- SMTP 大量发件
- FTP 大量 PUT 操作
- DNS 隧道外传

HTTP 数据外传检测：
过滤：http.request.method == POST and http.content_length > 100000
分析：追踪 TCP 流查看 Body 内容

FTP 数据外传检测：
过滤：ftp.request.command contains "STOR"  # STOR = 上传文件
      ftp.request.command contains "PUT"

SMTP 数据外传检测：
过滤：smtp.req.command == "MAIL FROM" or
      smtp.req.command == "RCPT TO"

通用检测方法：
1. 统计 → 终端节点 → 按字节数排序
2. 找出流量最大的 IP 对 → 过滤 IP 对的协议分布
3. 非工作时间（凌晨等）的异常流量更可疑
```

---

## 六、实用统计与图表功能

### 6.1 Statistics（统计）菜单

| 功能 | 路径 | 用途 | 安全分析应用 |
|:---|:---|:---|:---|
| 协议层次 | Statistics → Protocol Hierarchy | 查看流量协议分布 | 发现异常协议占比 |
| 端点统计 | Statistics → Endpoints | 通信最多的 IP | 定位异常高流量 IP |
| 会话统计 | Statistics → Conversations | 查看 IP 间通信 | 发现横向移动 |
| I/O 图表 | Statistics → I/O Graph | 可视化流量趋势 | 发现 Beacon 心跳 |
| HTTP 请求 | Statistics → HTTP → Requests | 列出所有 HTTP 请求 | 分析 HTTP 攻击面 |
| DNS 统计 | Statistics → DNS | DNS 查询汇总 | 发现 DNS 隧道 |
| 服务响应时间 | Statistics → Service Response Time | 服务响应延迟 | 发现慢速攻击 |
| Flow Graph | Statistics → Flow Graph | 可视化通信流程 | 直观分析攻击链 |
| 包长度分布 | Statistics → Packet Lengths | 包大小统计 | 发现异常大包 |
| TCP 流图 | Statistics → TCP Stream Graph | TCP 时序图 | 网络性能诊断 |

### 6.2 I/O 图表实战

```
配置方法：
1. Statistics → I/O Graph
2. 添加多条线（不同过滤器+不同颜色）
3. 设置时间间隔（1秒/10秒/1分钟）

实用过滤器组合：
- 线1：流量总量（默认）→ 蓝色
- 线2：tcp.port == 445 and tcp.flags.syn == 1 → 红色（SMB扫描）
- 线3：http.request.method == POST → 绿色（POST请求）
- 线4：dns → 橙色（DNS流量）

分析要点：
- 规律性的尖峰 → 可能 Beacon/C2 心跳
- 突然的流量暴增 → 可能数据外传或 DDoS
- 长期平稳后突然变化 → 应重点排查
```

### 6.3 Expert Info（专家信息）

```
Analyze → Expert Information

分类（按严重程度）：
- Errors：严重错误（如重传过多、协议违规）
- Warnings：警告（如连接重置、零窗口）
- Notes：提示（如 TCP 握手、HTTP 状态码）
- Chats：信息（如正常协议交互）

安全分析应用：
- 大量重传 → 网络质量问题或 DoS
- 连接重置异常增多 → 可能端口扫描
- HTTP 400/500 突然增多 → Web 应用异常
```

---

## 七、数据导出与报告

### 7.1 导出过滤后的包

```
文件 → 导出特定分组：
- Selected packet only    → 仅导出选中包
- Marked packets only     → 仅导出标记的包
- Displayed               → 仅导出当前显示（过滤后）的包
- All packets             → 导出全部
- Selected packet range   → 按范围导出
```

### 7.2 导出 HTTP 对象

```
文件 → 导出对象 → HTTP
- 可看到所有 HTTP 传输的文件（HTML/JS/CSS/图片/文档等）
- 选中文件 → Save 可保存到本地
- 用于提取 Webshell 传输的文件、下载恶意样本

文件 → 导出对象 → SMB → 导出 SMB 传输的文件
文件 → 导出对象 → IMF → 导出邮件附件
```

### 7.3 报告生成

```
1. 设置时间格式：View → Time Display Format → UTC / Local
2. 添加注释：选中包 → 右键 → Packet Comment
3. 导出包列表：File → Export Packet Dissections → As Plain Text/CSV
4. 导出 TLS 会话密钥：File → Export TLS Session Keys
```

---

## 八、tshark 命令行自动化

### 8.1 基础命令

```bash
# 实时抓包
tshark -i eth0                                          # 监控 eth0
tshark -i eth0 -f "port 80"                             # 带捕获过滤器
tshark -i eth0 -w capture.pcapng                        # 保存为文件

# 读取 pcap 文件
tshark -r capture.pcapng                                # 全部输出
tshark -r capture.pcapng -Y "http"                      # 应用显示过滤器
tshark -r capture.pcapng -Y "http" | head -50           # 显示前50行

# 自定义输出字段
tshark -r capture.pcapng -T fields -e ip.src -e ip.dst -e tcp.port
tshark -r capture.pcapng -T fields -e frame.time -e http.request.uri -e http.user_agent

# 统计信息
tshark -r capture.pcapng -q -z io,stat,1               # IO 统计（1秒间隔）
tshark -r capture.pcapng -q -z conv,tcp                 # TCP 会话统计
tshark -r capture.pcapng -q -z endpoints,tcp            # TCP 端点统计
tshark -r capture.pcapng -q -z http,tree                # HTTP 请求统计
tshark -r capture.pcapng -q -z dns,tree                 # DNS 统计
tshark -r capture.pcapng -q -z expert                   # 专家信息
```

### 8.2 tshark 实战脚本

```bash
# 提取所有 HTTP 请求的 URI
tshark -r capture.pcapng -Y "http.request" -T fields -e http.request.method -e http.request.full_uri

# 提取所有 DNS 查询的域名
tshark -r capture.pcapng -Y "dns.flags.response == 0" -T fields -e dns.qry.name | sort -u

# 提取所有 IP 通信对
tshark -r capture.pcapng -T fields -e ip.src -e ip.dst | sort -u

# 统计各 IP 的流量字节数
tshark -r capture.pcapng -q -z endpoints,ip

# 批量提取 HTTP 文件
tshark -r capture.pcapng --export-objects http,/tmp/output/

# 导出 TLS 证书
tshark -r capture.pcapng -Y "ssl.handshake.certificate" -T fields -e ssl.handshake.certificate
```

---

## 九、TLS/SSL 解密

### 9.1 使用预主密钥解密

```bash
# 浏览器记录 TLS 会话密钥（用于后续解密）
# Linux
export SSLKEYLOGFILE=/path/to/sslkeys.log
google-chrome &

# Windows (PowerShell)
$env:SSLKEYLOGFILE="C:\\temp\\sslkeys.log"
start chrome.exe

# Wireshark 配置
Edit → Preferences → Protocols → TLS →
  (Pre)-Master-Secret log filename → 选择 sslkeys.log
```

### 9.2 使用 RSA 私钥解密

```
要求：服务器使用 RSA 密钥交换（非 DHE/ECDHE）

配置：
Edit → Preferences → Protocols → TLS →
  RSA keys list → 添加 IP、Port、Protocol、Key File
```

---

## 十、十大实用技巧

### 10.1 技巧清单

| 序号 | 技巧 | 操作 |
|:---|:---|:---|
| 1 | 名称解析 | View → Name Resolution → Resolve Network Addresses |
| 2 | 时间格式切换 | View → Time Display Format → UTC Date and Time |
| 3 | 包着色规则 | View → Coloring Rules → 自定义 |
| 4 | 添加时间列 | 右键时间列 → Column Preferences → 添加 "Time Since Previous" |
| 5 | 包注释 | 右键 → Packet Comment → 记录分析笔记 |
| 6 | 标记重要包 | 右键 → Mark/Unmark Packet (Ctrl+M) |
| 7 | 导出到新 pcap | 过滤 → 导出特定分组 → All displayed |
| 8 | 协议字段搜索 | Ctrl+F → "String" / "Hex Value" / "正则" → 选择搜索范围 |
| 9 | 快速复制字段 | 右键字段 → Copy → Value |
| 10 | 自定义列 | 编辑 → Preferences → Columns → 添加 ip.src_port 等 |

### 10.2 时间分析技巧

```
1. 设置 Time Display Format → Seconds Since Beginning of Capture
2. 添加 "Time Since Previous Frame" 列
3. 排序查看帧间间隔 → 异常的间隔可能揭示自动化攻击
4. Ctrl+G → 输入帧编号快速跳转
```

---

## 十一、实战场景

### 场景一：Web 攻击完整分析

```
步骤：
1. 加载 pcap → 过滤 http.request or http.response
2. 追踪所有 POST 请求 → 检查 Body 内容
3. 过滤 URI 含 "union" / "select" → 查 SQL 注入
4. 过滤 URI 含 "<script>" / "alert(" → 查 XSS
5. 关注异常 HTTP 状态码（500/403/302跳转）
6. 追踪含有异常 Body 的响应 → 确认攻击是否成功
7. 导出 HTTP 对象 → 提取 Webshell/后门文件
8. 过滤后续周期性请求 → 确认持久化 Beacon
```

### 场景二：内网横向移动分析

```
步骤：
1. 会话统计 (Statistics → Conversations) → 按字节数排序
2. 找出流量最大的会话对 → 逐对分析
3. 重点关注 SMB(445)、RDP(3389)、WinRM(5985)、WMI(135)
4. 追踪 SMB 流 → 查看共享访问/文件传输
5. 过滤 tcp.port == 445 and tcp.flags.reset == 1 → SMB 认证失败
6. 过滤 kerberos → 查看域认证票据
7. 分析 Flow Graph → 可视化横向移动路径
```

### 场景三：恶意软件通信分析

```
步骤：
1. 过滤非标准端口出站流量
2. 查看 DNS 查询 → 找出异常长的域名或新注册域名
3. 过滤 dns.qry.type == 16 → 检查 TXT 查询
4. 过滤 HTTP 请求的 User-Agent → 查找异常 UA
5. 关注周期性通信模式（I/O 图表）
6. 追踪可疑流 → 查看完整通信内容
7. VirusTotal → 导出可疑 IP/域名进行查询
8. 导出传输文件 → 文件 → 导出对象 → HTTP → 提取可执行文件
```

---

## 十二、常见问题与排错

| 问题 | 可能原因 | 解决方案 |
|:---|:---|:---|
| 无法抓包 | 权限不足 | sudo wireshark / 加入 wireshark 组 |
| 看不到本地回环 | Windows 无回环适配器 | 安装 Npcap 时勾选 loopback |
| 无法解密 HTTPS | DHE/ECDHE 密钥交换 | 使用 SSLKEYLOGFILE 方法 |
| pcap 文件过大 | 未设置捕获过滤器 | 用 tshark 分割或 editcap |
| 协议字段不显示 | 未正确解析 | Analyze → Decode As → 手动指定协议 |
| Wireshark 卡顿 | 内存不足/包太多 | 启用显示过滤器减少处理量 |
| 时间戳不准 | 网卡时间戳偏移 | 编辑包时间戳 (Edit → Time Shift) |

---

## 十三、练习与自测

1. 使用 Wireshark 抓取一次完整的 HTTP 登录过程，追踪 TCP 流找到用户名和密码
2. 用 tcpdump 抓取 5 分钟的流量，导入 Wireshark 后练习显示过滤器的所有语法
3. 用 nmap 扫描本地服务，用 Wireshark 同时抓包，分析 SYN/SYN-ACK/RST 的模式
4. 设置浏览器 SSLKEYLOGFILE，用 Wireshark 解密 HTTPS 流量
5. 用 tshark 写一个脚本，自动统计 pcap 中各个 IP 的会话数和流量

---

## 十四、速查卡

```
常用过滤器：
http                              # 所有 HTTP
http.request                      # 所有 HTTP 请求
dns                               # 所有 DNS
tcp.port == 80                    # 80 端口 TCP
tcp.flags.syn == 1 and tcp.flags.ack == 0  # 仅 SYN
ip.addr == 192.168.1.1            # 某 IP 全部流量
!(ip.addr == 10.0.0.1)            # 排除某 IP
http.request.uri contains "admin"
tcp.stream eq 0                   # 追踪第 0 号 TCP 流
dns.qry.name contains "evil"

快捷键：
Ctrl+E           开始/停止抓包
Ctrl+F           搜索
Ctrl+G           跳转到包
Ctrl+M           标记包
Ctrl+R           应用显示过滤器
Ctrl+→           展开协议子树
右键 → Follow → TCP Stream  追踪流
```

---

> 📖 本文为"网安百宝箱"课程配套读物。
> 参考：Wireshark 官方文档 https://www.wireshark.org/docs/ | Wireshark Display Filter Reference
> 更新于 2026-06-18
