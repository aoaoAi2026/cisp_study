# 网络协议安全深度分析

> **📘 文档定位**：CISP 考试核心基础 | 难度：⭐⭐⭐⭐ | 预计阅读：30 分钟
> 网络协议在设计之初追求互联互通，安全认证普遍缺位，导致大量协议层攻击面。本章深入剖析 ARP、DNS、TCP、BGP、DHCP 五大协议的攻击原理与防御体系，是 CISP 考试中"网络攻击检测与防御"板块的核心考点。

---

## 导航目录
- [一、ARP 欺骗与中间人攻击](#一arp-欺骗与中间人攻击)
- [二、DNS 缓存投毒 (Kaminsky 攻击)](#二dns-缓存投毒-kaminsky-攻击)
- [三、TCP 会话劫持](#三tcp-会话劫持)
- [四、BGP 路由劫持](#四bgp-路由劫持)
- [五、DHCP 攻击](#五dhcp-攻击)
- [六、Wireshark 实操：分析攻击流量](#六wireshark-实操分析攻击流量)
- [七、安全部署 Checklist](#七安全部署-checklist)
- [八、高分考点与知识巧记](#八高分考点与知识巧记)

---

## 一、ARP 欺骗与中间人攻击

### 1.1 为什么 ARP 不安全？

ARP（Address Resolution Protocol）是局域网通信的基石——它将 IP 地址（网络层）映射到 MAC 地址（数据链路层）。但 ARP 协议设计时**完全没有认证机制**：任何主机都可以向局域网发送 ARP 响应报文，声称"某个 IP 对应的 MAC 地址是我"，而接收方会无条件信任并更新 ARP 缓存表。

```
┌─────────────────────────────────────────────────────────────┐
│                    ARP 协议工作流程                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  正常通信：                                                   │
│  Host A (10.0.0.1) 想知道 10.0.0.254 (网关) 的 MAC          │
│    → 广播 ARP Request: "谁是 10.0.0.254？"                    │
│    → 网关回复 ARP Reply: "我是 10.0.0.254，MAC = GG:GG"      │
│    → Host A 缓存: 10.0.0.254 → GG:GG                        │
│                                                             │
│  ARP 欺骗攻击：                                               │
│  Attacker (10.0.0.99) 持续发送伪造 ARP Reply：                │
│    → "10.0.0.254 的 MAC 是 AA:AA" (发给 Host A)              │
│    → "10.0.0.1 的 MAC 是 AA:AA"   (发给网关)                │
│    → Host A 缓存被投毒: 10.0.0.254 → AA:AA                   │
│    → 网关缓存被投毒:   10.0.0.1 → AA:AA                      │
│    → 所有 Host A ↔ 网关的流量都经过 Attacker！                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

> **🔑 高分考点**：ARP 欺骗之所以可行，根本原因是 **ARP 协议无认证机制** + **ARP 缓存会无条件更新**。攻击者发送"免费 ARP"（Gratuitous ARP）即可完成投毒。

### 1.2 攻击效果与危害

一旦 ARP 投毒成功，攻击者处于通信路径中间，可以实施：

| 攻击类型 | 描述 | 危害等级 |
|:---|:---|:---:|
| **流量窃听（Sniffing）** | 捕获所有明文通信内容（HTTP、FTP、Telnet 等） | 🔴 高 |
| **会话劫持（Session Hijacking）** | 窃取 Cookie/Session Token，冒充合法用户 | 🔴 高 |
| **数据篡改（Data Tampering）** | 修改传输中的数据包内容（注入恶意脚本、篡改下载文件） | 🔴 高 |
| **SSL 降级攻击（SSLStrip）** | 将 HTTPS 降级为 HTTP，绕过加密 | 🔴 高 |
| **拒绝服务（DoS）** | 将网关 MAC 映射到不存在的地址 → 网络中断 | 🟡 中 |

### 1.3 常用攻击工具

| 工具 | 特点 | 使用场景 |
|:---|:---|:---|
| **arpspoof** | 经典工具，轻量简单 | 快速 ARP 投毒 |
| **Ettercap** | 图形化界面 + 插件系统 | 综合 MITM 攻击平台 |
| **BetterCAP** | 现代工具，支持 WiFi/HTTP/HTTPS | 完整 MITM 框架 |
| **Cain & Abel** | Windows 平台，密码嗅探 | Windows 环境渗透 |

```bash
# arpspoof 基本用法
# 欺骗目标主机，使其认为攻击者是网关
arpspoof -i eth0 -t 192.168.1.100 192.168.1.1
# -i: 网卡接口  -t: 目标IP  最后一个参数: 伪装成的IP(网关)

# 同时欺骗目标和网关（双向投毒）
arpspoof -i eth0 -t 192.168.1.100 192.168.1.1 &
arpspoof -i eth0 -t 192.168.1.1 192.168.1.100 &

# 开启 IP 转发（否则目标会断网）
echo 1 > /proc/sys/net/ipv4/ip_forward
```

### 1.4 防御措施（四层防线）

```
┌─────────────────────────────────────────────────────────────┐
│                ARP 欺骗防御体系（纵深防御）                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ★ 第1层：端口安全 (Port Security)                            │
│    交换机端口绑定合法 MAC 地址 → 陌生 MAC 直接阻断              │
│    → 防止攻击者接入网络                                       │
│                                                             │
│  ★ 第2层：DAI (Dynamic ARP Inspection)                       │
│    交换机检查 ARP 报文 → 对比 DHCP Snooping 绑定表             │
│    → IP-MAC 不匹配的 ARP 包被丢弃                             │
│    → 这是最有效的交换机级防御手段                               │
│                                                             │
│  第3层：静态 ARP 表                                           │
│    关键设备（服务器/网关）手动绑定 ARP 表项                     │
│    arp -s 192.168.1.1 00:11:22:33:44:55                     │
│    → 缺点：维护成本高，不适合大规模部署                         │
│                                                             │
│  第4层：监控告警                                               │
│    ARPWatch / arpwatch-ng → 监控局域网 ARP 活动               │
│    发现 IP-MAC 映射变化 → 告警通知管理员                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

> **💡 知识巧记**：ARP 防御四件套——**端绑、动检、静绑、监控**（端口安全 → DAI → 静态ARP → ARPWatch）

> **⚠️ 考试陷阱**：题目常问"DAI 依赖什么？"→ 答案是 **DHCP Snooping 绑定表**！DAI 自身不生成绑定表，它依赖 DHCP Snooping 提供的合法 IP-MAC 映射。

---

## 二、DNS 缓存投毒 (Kaminsky 攻击)

### 2.1 DNS 查询的基本流程

在理解攻击之前，先回顾 DNS 递归解析的过程：

```
┌─────────────────────────────────────────────────────────────┐
│                   DNS 递归解析流程                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Client                        DNS Recursive Resolver        │
│    │                                      │                  │
│    │ ① 查询 www.example.com              │                  │
│    │─────────────────────────────────────→│                  │
│    │                                      │ ② 问根DNS       │
│    │                                      │────→ 根服务器    │
│    │                                      │←──── .com NS    │
│    │                                      │ ③ 问.com TLD   │
│    │                                      │────→ .com服务器  │
│    │                                      │←──── example NS │
│    │                                      │ ④ 问权威DNS     │
│    │                                      │────→ ns.example │
│    │                                      │←──── A记录       │
│    │ ⑤ 返回结果                           │                  │
│    │←─────────────────────────────────────│                  │
│                                                             │
│  ★ 攻击窗口：步骤②③④ 中，攻击者可伪造响应注入假数据           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 传统 DNS 投毒 vs Kaminsky 攻击

> **🔑 高分考点（必考）**：Kaminsky 攻击的核心创新是什么？与传统 DNS 投毒的区别在哪？

| 对比维度 | 传统 DNS 投毒 | Kaminsky 攻击 (2008) |
|:---|:---|:---|
| **攻击目标** | 单个 A 记录的查询 | 整个域名的权威 NS 记录 |
| **猜测空间** | Transaction ID (16位 = 65536) | Transaction ID (65536) + 每次不同子域名 |
| **尝试次数限制** | 每次查询只能尝试 1 次 | 每次触发可批量发送伪造响应 |
| **成功率** | 极低（1/65536 每次） | 高（多次批量尝试，统计学上 ~10 秒可成功） |
| **影响范围** | 劫持单个域名的一条记录 | **劫持整个域名的所有子域名！** |

```
Kaminsky 攻击的精妙之处：

传统攻击思路（低效）：
  等用户查询 www.example.com
  → 发送伪造响应，猜 Transaction ID
  → 猜错就失败，等下一次机会

Kaminsky 的创新（高效）：
  主动向递归DNS发送查询：rand001.example.com, rand002.example.com...
  → 递归DNS向外查询时，攻击者同时发送大量伪造响应
  → 每个伪造响应中：授权段声称 "example.com 的 NS 是 attacker.com"
  → 只要任意一个伪造响应猜对 Transaction ID
  → 递归DNS缓存：example.com 的权威DNS = attacker.com
  → ★ 整个域名的所有子域名全被劫持！
```

### 2.3 防御措施演进

```
防御演进时间线：

2008年前：仅依赖 Transaction ID (16位)
  → Kaminsky 证明可以暴力破解

2008年后（短期修复）：源端口随机化
  Transaction ID (16位) × 源端口 (16位) = 32位 = 约40亿种组合
  → 大幅增加猜测难度

长期方案：
  ★ DNSSEC (DNS Security Extensions)
    原理：对DNS记录进行数字签名
    → 递归DNS可验证响应是否被篡改
    → 签名验证失败 → 丢弃伪造响应
    → 这是DNS安全的"终极解决方案"
    缺点：部署复杂，全球部署率约30%

  DoH (DNS-over-HTTPS)
    原理：将DNS查询封装在HTTPS中
    → 中间人无法看到/篡改DNS内容
    → 应用层加密，端口443

  DoT (DNS-over-TLS)
    原理：DNS查询通过TLS加密传输
    → 传输层加密，专用端口853
    → 比DoH更底层，可被防火墙识别
```

> **💡 知识巧记**：DNS 安全三件套——**DNSSEC 签名防篡改，DoT 传输加密，DoH 应用伪装**

> **⚠️ 考试陷阱**：源端口随机化**不能完全防御** Kaminsky 攻击，只是提高难度（40 亿 vs 6.5 万）。只有 DNSSEC 能从根源上解决问题（数字签名防篡改）。

---

## 三、TCP 会话劫持

### 3.1 TCP 序列号机制回顾

TCP 通过序列号（Sequence Number）保证数据有序可靠传输：

```
┌─────────────────────────────────────────────────────────────┐
│                  TCP 序列号窗口机制                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  已发送已确认 │ 已发送未确认 │  可发送  │  不可发送(窗口外)    │
│  ───────────│────────────│─────────│──────────────────    │
│             ↑            ↑         ↑                       │
│           SND.UNA     SND.NXT  SND.NXT+WND                  │
│                                                             │
│  攻击关键：如果攻击者能预测/猜中 Seq 号，                      │
│  就可以伪造合法数据包注入 TCP 流！                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 三种劫持技术详解

#### 3.2.1 盲劫持 (Blind Hijacking)

```
原理：攻击者不在通信路径上，纯靠猜测

攻击条件：
  ✓ 知道通信双方的 IP + 端口（容易获取）
  ✓ 知道当前 TCP 序列号（需要猜测）
  ✗ 无法看到返回的流量（"盲"劫持）

历史背景：
  早期 TCP 实现使用简单的 ISN 生成算法（如时间相关）
  → Kevin Mitnick (1994) 利用此漏洞攻破 Tsutomu Shimomura 的系统
  → 这是历史上最著名的 TCP 劫持案例

现代防御：
  现代 OS 使用加密安全的随机 ISN（RFC 6528）
  → 盲劫持几乎不可能成功
```

#### 3.2.2 RST 注入 (TCP Reset Attack) ⭐ 重要考点

```
原理：伪造 TCP RST 包强制断开连接

为什么比盲劫持容易？
  RST 只需序列号落在接收窗口内即可（窗口大小通常 64KB-1MB）
  → 猜测空间 ≈ 2^32 / 窗口大小 ≈ 4000~65000 种
  → 远小于完整的 2^32

真实应用案例：
  ★ 中国的 GFW (Great Firewall) 大规模使用此技术
  → 检测到敏感关键词的 TCP 连接
  → 伪造 RST 包同时发给客户端和服务器
  → 连接被强制断开

检测特征：
  tcp.flags.reset == 1  → Wireshark 过滤
  大量 RST 包来自"第三方"IP → 高度可疑
```

> **🔑 高分考点**：RST 注入比盲劫持容易，因为不需要猜精确的 Seq，只需落在窗口内。GFW 使用此技术是 CISP 考试中常见的背景知识题。

#### 3.2.3 中间人劫持 (MITM Hijacking)

```
原理：先用 ARP 欺骗进入通信路径 → 直接看到序列号 → 无需猜测

流程：
  1. ARP 欺骗 → 流量经过攻击者
  2. 观察 TCP Seq/Ack 号
  3. 注入伪造数据包（修改转账金额、注入恶意命令等）
  4. 修改校验和保持数据包"合法"

优势：无需猜测，成功率 100%
前提：需要先完成 ARP 欺骗
```

### 3.3 防御措施汇总

| 防御技术 | 原理 | 防御效果 |
|:---|:---|:---|
| **随机 ISN** | 初始序列号不可预测 | 防盲劫持 ✅ |
| **TCP MD5 签名** | BGP 邻居间 TCP 认证 | 防 RST 注入 ✅ |
| **TCP-AO** | 更强的 TCP 认证（替代 MD5） | 防所有伪造 ✅ |
| **TLS/SSL** | 应用层加密 + 完整性校验 | 防数据篡改 ✅ |
| **IPsec** | 网络层加密认证 | 防所有 TCP 攻击 ✅ |

---

## 四、BGP 路由劫持

### 4.1 BGP 协议设计缺陷

BGP（Border Gateway Protocol）是互联网的"导航系统"，决定数据包在全球范围的传输路径。但它的设计基于"信任模型"：

```
BGP 的先天缺陷：
  → 无内置认证机制：任何 BGP Speaker 可以宣告任意 IP 前缀
  → 无路径验证：无法验证宣告的 AS Path 是否真实
  → 最短路径优先：攻击者宣告更短的 AS Path → 流量被吸引

互联网路由的"无政府状态"：
  全球约 10 万个自治系统（AS），互相通过 BGP 交换路由信息
  → 没有中央权威来验证每条路由宣告的真实性
  → 任何 AS 都可以"声称"自己拥有 Google 的 IP 段
```

### 4.2 经典案例

> **🔑 高分考点**：CISP 考试必考 BGP 劫持案例，尤其是 2018 年俄罗斯事件。

| 时间 | 事件 | 影响 |
|:---|:---|:---|
| **2008** | 巴基斯坦电信劫持 YouTube | YouTube 全球宕机 2 小时 |
| **2018** | 俄罗斯 AS 劫持 80+ 云服务 IP | Google/Cloudflare/AWS 流量被重定向 |
| **2021** | AS55410 劫持 2 万+ 路由前缀 | Amazon/Akamai/Microsoft 受影响 |
| **2022** | 韩国 KT 电信"误操作" | 全国网络中断约 40 分钟 |

```
2018 年俄罗斯事件详解：
  → 某俄罗斯 ISP (AS39523) 错误宣告了属于 Google/Cloudflare/AWS 的 IP 前缀
  → 由于宣告的路径更短，全球很多 ISP 将去往这些服务的流量发往俄罗斯
  → 攻击持续约 2 小时，重定向了约 50Gbps 流量
  → 最终通过联系该 ISP 手动撤回路由解决
  
  教训：一个错误的 BGP 宣告，可以瞬间改变全球互联网流量走向！
```

### 4.3 防御体系

```
┌─────────────────────────────────────────────────────────────┐
│                   BGP 安全防御体系                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ★ RPKI (Resource Public Key Infrastructure)                │
│    核心：每个 IP 前缀的所有者签发 ROA (Route Origin Auth)     │
│    ROA 声明："AS 15169 有权宣告 8.8.8.0/24"                  │
│    路由器收到 BGP 宣告 → 查询 RPKI 验证 → 不匹配则拒绝       │
│    → 这是目前最主要的 BGP 安全方案                             │
│                                                             │
│  BGPsec (BGP Security)                                       │
│    对完整的 AS Path 进行签名                                  │
│    → 攻击者无法伪造经过的路径                                  │
│    → 比 RPKI 更强，但部署更复杂                                │
│                                                             │
│  IRR (Internet Routing Registry)                             │
│    各 ISP 在 IRR 数据库中注册自己的路由策略                    │
│    → 基于数据库过滤，非加密验证                                │
│    → 数据可能过时/不准确                                      │
│                                                             │
│  检测工具：                                                   │
│    BGPmon / BGPstream → 实时监控全球 BGP 异常                 │
│    RIPEstat → 查询路由历史                                    │
│    ThousandEyes → 可视化路由路径                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

> **💡 知识巧记**：BGP 安全三个关键词——**RPKI 认源头，BGPsec 验路径，IRR 做参考**

---

## 五、DHCP 攻击

### 5.1 DHCP 协议回顾

```
DHCP 四步握手 (DORA)：
  Discover → Offer → Request → Ack

  Client (广播): "有人能给我 IP 吗？"      [DHCP Discover]
  Server (单播): "你可以用 192.168.1.100"   [DHCP Offer]
  Client (广播): "我要用 192.168.1.100"     [DHCP Request]
  Server (单播): "确认，租期 8 小时"         [DHCP Ack]

★ 问题：所有消息无认证，先到先得！
```

### 5.2 两种攻击类型

#### DHCP 耗尽攻击 (DHCP Starvation)

```
原理：
  攻击者伪造大量不同 MAC 地址
  → 每个 MAC 发起 DHCP Discover
  → DHCP 服务器分配 IP
  → 地址池被耗尽
  → 合法用户无法获取 IP → 拒绝服务

工具：Yersinia, dhcpstarv

特征检测：
  → DHCP 请求速率异常升高
  → MAC 地址呈现规律性变化
  → 地址池使用率突然达到 100%
```

#### DHCP 欺骗攻击 (DHCP Spoofing)

```
原理：
  攻击者在局域网部署伪造 DHCP 服务器
  → 伪造服务器比真实服务器更快响应
  → Client 接受伪造的配置
  → 恶意的 DNS 和网关设置

效果：
  → DNS 指向攻击者控制的服务器 → 域名劫持
  → 网关指向攻击者 → 中间人攻击
  → 所有流量经过攻击者中转

检测：
  → 网络中出现非预期的 DHCP Offer 来源 MAC
  → 客户端获得的 DNS/网关与预期不符
```

### 5.3 防御措施

> **🔑 高分考点**：**DHCP Snooping** 是最核心的防御技术。

```
DHCP Snooping 工作原理：
  
  交换机上配置 Trusted 端口（连接合法 DHCP 服务器）
  其余端口为 Untrusted
  
  Untrusted 端口：
    ✗ 禁止发送 DHCP Offer/Ack（DHCP 服务器消息）
    ✓ 只允许发送 DHCP Discover/Request（客户端消息）
  
  → 伪造 DHCP 服务器在 Untrusted 端口上无法响应
  → 同时建立 DHCP Snooping 绑定表（IP-MAC-Port-VLAN）
  → 绑定表可被 DAI（动态 ARP 检测）和 IP Source Guard 使用

配置示例（Cisco）：
  ip dhcp snooping
  ip dhcp snooping vlan 10,20,30
  interface GigabitEthernet0/1
    ip dhcp snooping trust      # 连接合法 DHCP 服务器的端口
  interface range GigabitEthernet0/2-24
    ip dhcp snooping limit rate 10  # 限制 DHCP 请求速率防耗尽
```

> **💡 知识巧记**：DHCP 攻击防三招——**Snooping 分端口（Trusted/Untrusted），DAI 验 ARP（对比绑定表），802.1X 控准入（先认证后分配）**

---

## 六、Wireshark 实操：分析攻击流量

### 6.1 ARP 欺骗检测

```bash
# === ARP 攻击检测过滤器 ===

# 1. 检测重复 IP 的 ARP 响应（ARP 欺骗的典型特征）
arp.duplicate-address-detected
# → 同一 IP 对应多个 MAC → 极可能是 ARP 欺骗

# 2. 仅显示 ARP 响应包（攻击者通常发送大量 ARP Reply）
arp.opcode == 2
# opcode 1 = Request, opcode 2 = Reply

# 3. 查看免费 ARP（Gratuitous ARP）——无需请求的主动宣告
arp.src.proto_ipv4 == arp.dst.proto_ipv4
# 发送者 IP = 目标 IP → 免费 ARP → 可能是投毒

# 4. 结合 MAC 地址分析
arp.src.hw_mac matches "^00:11:22"  # 特定厂商 MAC
```

### 6.2 DNS 异常检测

```bash
# === DNS 攻击检测过滤器 ===

# 1. 仅查看 DNS 查询（排除响应）
dns.flags.response == 0
# → 用于分析查询频率和域名模式

# 2. 查找 DGA 域名（域名生成算法，僵尸网络特征）
dns.qry.name matches "[a-z0-9]{20,}\\.(com|net|info)"
# → 长随机字符串域名 → 高度可疑

# 3. 检测 DNS 隧道（数据通过 DNS 查询外泄）
dns.qry.name matches "[a-zA-Z0-9]{30,}\\.example\\.com"
# → 超长子域名 → 可能在编码数据
# 结合包长度分析：dns.qry.name.len > 40

# 4. 检测异常 DNS 响应
dns.flags.rcode != 0
# → 非 0 响应码（NXDOMAIN 等）大量出现 → 可疑

# 5. TXT 记录查询异常
dns.qry.type == 16
# → TXT 记录常用于 DNS 隧道

# 6. 高速率 DNS 查询（统计角度）
# Statistics → IO Graph → 过滤 dns → 观察查询频率
```

### 6.3 TCP 异常检测

```bash
# === TCP 攻击检测过滤器 ===

# 1. RST 包检测（GFW 的 TCP Reset Attack 特征）
tcp.flags.reset == 1
# → 大量来自非通信双方的 RST 包 → 可能是 RST 注入攻击

# 2. TCP 重传分析
tcp.analysis.retransmission
# → 大量重传 = 网络质量差 或 MITM 干扰

tcp.analysis.fast_retransmission
# → 快速重传，说明丢包严重

tcp.analysis.lost_segment
# → 丢失的数据段

# 3. SYN 扫描检测（端口扫描特征）
tcp.flags.syn == 1 && tcp.flags.ack == 0
# → 仅 SYN 标志 → SYN 扫描

# 4. 异常标志组合
tcp.flags == 0x29
# → URG+PSH+FIN (Xmas Scan 特征)
tcp.flags == 0x00
# → 空标志 (NULL Scan 特征)

# 5. 异常窗口大小
tcp.window_size == 0
# → 零窗口通告 → 可能是攻击或资源耗尽

# 6. 查看 TCP 流
# 右键数据包 → Follow → TCP Stream
# → 查看完整的 TCP 会话内容
```

### 6.4 DHCP 异常检测

```bash
# === DHCP 攻击检测过滤器 ===

# 1. DHCP Offer 来源分析（检测伪造 DHCP 服务器）
bootp.option.dhcp == 2
# → DHCP Offer 消息
# 结合 ip.src 查看：出现非预期的 DHCP 服务器 IP → 欺骗攻击

# 2. DHCP Ack 追踪
bootp.option.dhcp == 5
# → DHCP Ack 消息 → 确认 IP 分配

# 3. MAC 地址分析
bootp.hw.mac_addr
# → 查看 DHCP 请求中的 MAC 地址
# → 大量不同 MAC 短时间内请求 → DHCP 耗尽攻击

# 4. DHCP 请求频率分析
# Statistics → IO Graph
# 过滤：bootp.option.dhcp == 1  (DHCP Discover)
# → 突发高频 Discover → Starvation 攻击
```

### 6.5 综合异常检测工作流

```
实战分析流程：

Step 1: 总体概览
  Statistics → Summary → 了解抓包总览

Step 2: 协议分布
  Statistics → Protocol Hierarchy → 查看协议占比
  → 异常协议高占比 → 可疑

Step 3: 通信端点
  Statistics → Endpoints → 按流量排序
  → 某 IP 流量异常大 → 数据外泄可能

Step 4: 会话分析
  Statistics → Conversations → 按字节排序
  → 非标准端口大流量会话 → 深入分析

Step 5: IO 图
  Statistics → IO Graph → 设置过滤器叠加
  → 突发的流量峰值 → 攻击活动

Step 6: 专家信息
  Analyze → Expert Info → 查看自动检测的异常
  → Warnings/Errors 类别重点关注
```

---

## 七、安全部署 Checklist

| 序号 | 检查项 | 状态 | 备注 |
|:---:|:---|:---:|:---|
| 1 | 交换机部署 DAI (Dynamic ARP Inspection) | ☐ | 依赖 DHCP Snooping |
| 2 | DHCP Snooping 启用 + Trusted 端口配置 | ☐ | 防 DHCP 欺骗 + 耗尽 |
| 3 | 关键 DNS 启用 DNSSEC | ☐ | 防 DNS 缓存投毒 |
| 4 | BGP RPKI 部署（ISP 层面） | ☐ | 防路由劫持 |
| 5 | Port Security 端口安全启用 | ☐ | 防未授权接入 |
| 6 | 802.1X 网络准入控制 | ☐ | 端口级认证 |
| 7 | Wireshark 异常流量分析能力 | ☐ | 人员技能 |
| 8 | 网络流量基线建立 | ☐ | 异常检测基准 |
| 9 | ARPWatch/ARP 监控部署 | ☐ | 实时告警 |
| 10 | 关键设备静态 ARP 绑定 | ☐ | 最后防线 |

---

## 八、高分考点与知识巧记

### 📊 高分考点速查表

| 序号 | 考点名称 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | ARP 欺骗原理 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ARP 协议无认证，攻击者发送伪造 ARP Reply 投毒缓存 |
| 2 | DAI 工作原理 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 交换机检查 ARP 报文 vs DHCP Snooping 绑定表 |
| 3 | Kaminsky 攻击创新点 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 利用批量子域名查询 + 投毒 NS 记录，劫持整个域名 |
| 4 | DNS 源端口随机化 | ⭐⭐⭐ | ⭐⭐ | 16 位 TID × 16 位端口 = 40 亿种组合，但不能根除 |
| 5 | DNSSEC 原理 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 对 DNS 记录数字签名，递归服务器验证签名防篡改 |
| 6 | RST 注入原理 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 只需猜窗口内序列号（~6 万种），比盲劫持容易得多 |
| 7 | BGP 路由劫持 | ⭐⭐⭐ | ⭐⭐⭐ | BGP 无内置认证，RPKI 是最主要防御方案 |
| 8 | DHCP Snooping | ⭐⭐⭐⭐ | ⭐⭐⭐ | 分 Trusted/Untrusted 端口，防伪造 DHCP 服务器 |
| 9 | DHCP 耗尽攻击 | ⭐⭐⭐ | ⭐⭐ | 伪造大量 MAC 耗尽地址池，速率限制可防御 |
| 10 | DoH vs DoT | ⭐⭐⭐ | ⭐⭐ | DoH 走 443（伪装成 HTTPS），DoT 走 853（专用端口） |

### 🎵 知识巧记口诀

```
ARP 欺骗：
  协议无认证，缓存无条件
  端口做安全，DAI 来把关
  静态绑关键，ARPWatch 监控全

DNS 投毒（Kaminsky）：
  零八年 Kaminsky 大发现
  批量子域名把 ID 猜遍
  源端口随机化暂缓风险
  DNSSEC 签名才是终点

TCP 劫持：
  盲劫持靠猜序号，随机 ISN 破此招
  RST 注入窗口小，GFW 借此断网桥
  MITM 最可怕，先 ARP 再改包

BGP 路由劫持：
  互联网路由凭信任，宣告前缀无认证
  RPKI 签名认源头，BGPsec 验路径真

DHCP 攻防：
  Discover-Offer 无认证
  先到先得靠速度
  Snooping 分端口防伪造
  802.1X 先认证再放行
```

### ⚠️ 考试陷阱提醒

| 序号 | 常见错误理解 | 正确理解 |
|:---:|:---|:---|
| 1 | "ARP 欺骗只能在局域网进行" | 通过 VPN 等隧道技术也可跨网段影响 |
| 2 | "源端口随机化能完全防 DNS 投毒" | ❌ 只增加难度，DNSSEC 才能根除 |
| 3 | "DAI 自带绑定表" | ❌ DAI 依赖 DHCP Snooping 绑定表 |
| 4 | "DoH 和 DoT 是同一回事" | DoH 走 443 端口（伪装 HTTP），DoT 走 853 端口（独立协议） |
| 5 | "BGP RPKI 能防所有路由攻击" | ❌ RPKI 只验证起源 AS，不验证完整路径（需 BGPsec） |
| 6 | "RST 注入需要猜中精确序列号" | ❌ 只需在接收窗口范围内即可 |
| 7 | "DHCP Snooping 防 ARP 欺骗" | ❌ 它防 DHCP 欺骗；DAI 防 ARP 欺骗（但依赖 Snooping 绑定表） |
| 8 | "防火墙能防 ARP 欺骗" | ❌ ARP 是二层协议，防火墙在三层以上 |
| 9 | "TLS 能防所有 TCP 层攻击" | ❌ TLS 防数据篡改，但不防 RST 注入（RST 是控制包） |
| 10 | "BGP 劫持都是恶意的" | 很多是配置错误（路由泄漏），但效果相同 |
