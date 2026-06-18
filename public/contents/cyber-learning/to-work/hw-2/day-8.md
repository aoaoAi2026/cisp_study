---
day: 8
title: Wireshark流量分析入门
phase: 第一阶段
difficulty: ⭐ 入门
---

# Day 8：Wireshark流量分析入门

> **阶段**：第一阶段 · 蓝队极速上岗 | **难度**：⭐ 入门 | **课时**：2-3小时

---

## 📋 今日学习目标

1. 熟悉Wireshark界面布局和基本操作
2. 掌握抓包过滤语法和显示过滤语法
3. 学会追踪TCP流，还原通信内容
4. 能独立编写过滤语句筛选指定IP/协议/端口的流量
5. 能够从抓包中分析一次完整的HTTP访问

---

## 📖 核心知识讲解

### 一、Wireshark是什么？

Wireshark是世界上使用最广泛的**网络协议分析器**——通俗地说，它是一个"网络摄像头"，能把你电脑网卡上经过的所有数据包都拍下来给你看。

**蓝队为什么需要Wireshark？**
- 知道你管理的网络里"谁在和谁聊天"
- 发现异常的数据传输（比如有人在偷偷传文件出去）
- 分析攻击流量，了解攻击者用了什么手法
- 还原HTTP请求内容，看清攻击payload

### 二、Wireshark界面速览

打开Wireshark后你会看到三个主要区域：

```
┌─────────────────────────────────────────────┐
│  菜单栏 + 工具栏 + 显示过滤器栏              │  ← 控制和过滤
├─────────────────────────────────────────────┤
│  数据包列表 (Packet List)                    │
│  No. | Time | Source | Dest | Protocol | Info│  ← 每个包一行
│  1   | 0.00 | 192... | 10...| TCP     | SYN │
│  2   | 0.01 | 10...  | 192..| TCP     |ACK  │
├─────────────────────────────────────────────┤
│  数据包详情 (Packet Details)                 │  ← 分层展示
│  Frame → Ethernet → IP → TCP → HTTP          │
├─────────────────────────────────────────────┤
│  原始数据 (Packet Bytes)                     │  ← 16进制+ASCII
└─────────────────────────────────────────────┘
```

### 三、两种过滤器，别搞混了！

Wireshark有两种过滤器，作用不同：

| 类型 | 位置 | 作用 | 语法 |
|:---|:---|:---|:---|
| **抓包过滤器** | 抓包前设置 | 只抓符合条件的包 | `port 80`、`host 192.168.1.1` |
| **显示过滤器** | 抓包后筛选 | 从已抓到的包里筛选显示 | `http`、`tcp.port==443` |

> 💡 **实战建议**：初学者先不用抓包过滤器，全量抓包后用显示过滤器慢慢筛选，避免漏掉重要数据。

### 四、显示过滤器——蓝队的"火眼金睛"

#### 1. 按协议过滤
```
http          → 只看HTTP协议包
dns           → 只看DNS查询
tcp           → 只看TCP包
udp           → 只看UDP包
icmp          → 只看ping包
tls 或 ssl    → 只看加密流量
```

#### 2. 按IP地址过滤
```
ip.addr == 192.168.1.1        → 只看和这个IP相关的所有包
ip.src == 192.168.1.1         → 只看这个IP发出的包
ip.dst == 192.168.1.1         → 只看发给这个IP的包
!(ip.addr == 192.168.1.1)     → 排除和这个IP相关的包
```

#### 3. 按端口过滤
```
tcp.port == 80                → 只看80端口的TCP包
tcp.dstport == 443            → 只看目的端口是443的包（HTTPS请求）
tcp.srcport == 22             → 只看源端口是22的包（SSH回应）
```

#### 4. 组合过滤（使用逻辑运算符）
```
http && ip.src == 192.168.1.100    → HTTP包 AND 来源IP是这个
tcp.port == 80 || tcp.port == 443  → 80或443端口的TCP包
dns && !ip.addr == 8.8.8.8         → DNS包但排除谷歌DNS
```

#### 5. 常用进阶过滤
```
http.request.method == "POST"      → 只看POST请求
http.response.code == 404          → 只看404响应
http.request.uri contains "admin"  → URL中包含admin的请求
tcp.flags.syn == 1                 → 只看SYN包（连接请求）
tcp.flags.reset == 1               → 只看RST包（连接被拒绝）
tcp.analysis.flags                 → 分析TCP异常（重传、乱序等）
```

### 五、"Follow TCP Stream" —— 还原对话内容

这是Wireshark最强大的功能之一。它能把你选中的TCP连接从建立到关闭的所有数据包拼起来，还原成**完整的会话内容**。

**操作步骤：**
1. 在包列表中右键任意一个HTTP包
2. 选择 `Follow` → `TCP Stream`
3. 弹出新窗口，红色是客户端发送的，蓝色是服务器回复的
4. 编码选ASCII就能看到可读文本
5. 如果是HTTP流量，可以直接看到完整的请求和响应！

> 🔑 **蓝队场景**：这就是你能看到攻击payload的方法——追踪攻击者的TCP流，看他到底发了什么恶意请求。

### 六、实战场景演练

#### 场景1：分析一次HTTP访问

```
步骤1：打开浏览器访问 http://httpbin.org/get
步骤2：停止Wireshark抓包
步骤3：过滤器输入 http.host contains "httpbin"
步骤4：找到GET请求包 → 右键 Follow TCP Stream
步骤5：观察完整的HTTP请求和响应
```

你会看到什么？完整的请求头（User-Agent、Accept...）和响应头（Server、Content-Type...），这正是Day 3学的东西的实际呈现。

#### 场景2：查找可疑DNS查询

```
过滤器：dns
观察：客户端向DNS服务器查询了什么域名
蓝队关注：有没有查询到恶意域名？（如随机字符串+奇怪后缀）
```

#### 场景3：发现扫描行为

```
过滤器：tcp.flags.syn == 1 && tcp.flags.ack == 0
解释：只看SYN包（连接请求）
蓝队关注：同一源IP在短时间内向大量不同端口发SYN包 = 端口扫描！
```

---

## 🔧 实操任务

### 任务1：界面熟悉 + 基本抓包（20分钟）

1. 打开Wireshark，选择上网用的网卡
2. 点击开始抓包（鲨鱼鳍图标）
3. 打开浏览器访问3-5个不同网站
4. 停止抓包
5. 依次尝试以下显示过滤器：
   - `http`（如果看不到，可能是HTTPS，试试 `tls`）
   - `dns`
   - `tcp`
   - `icmp`

### 任务2：追踪TCP流（20分钟）

1. 访问 http://httpbin.org/get（注意是HTTP，不是HTTPS）
2. 在Wireshark中过滤：`http.host contains httpbin`
3. 找到第一个HTTP请求包 → 右键 → Follow → TCP Stream
4. 观察完整的请求和响应内容
5. 截图保存，标注出请求方法和状态码

### 任务3：过滤语法练习（20分钟）

```bash
# 在Wireshark显示过滤器栏依次输入以下过滤语句，理解每种过滤的效果：

# 1. 只看DNS流量
dns

# 2. 只看某个IP的流量（换成你访问的网站IP）
ip.addr == 你的目标IP

# 3. 只看443端口
tcp.port == 443

# 4. 只看HTTP POST请求
http.request.method == POST

# 5. 组合：HTTP + 特定IP
http && ip.addr == 192.168.1.1

# 6. 只看TCP三次握手的SYN包
tcp.flags.syn == 1 && tcp.flags.ack == 0
```

### 任务4：分析一次完整的网页加载（15分钟）

1. 访问一个图片较多的网页（如新闻网站）
2. 抓包后使用过滤器查看加载过程
3. 观察DNS查询 → TCP握手 → HTTP请求 → 数据传输的完整过程
4. 统计加载一个网页产生了多少个TCP连接

---

## ✅ 验收标准

- [ ] 能独立完成Wireshark抓包、停止、保存操作
- [ ] 能编写5种以上显示过滤语句，知道ip.addr、tcp.port、http的用法
- [ ] 能用Follow TCP Stream还原HTTP请求/响应内容
- [ ] 能筛选指定IP或端口的流量
- [ ] 能识别TCP三次握手的三个包（SYN→SYN+ACK→ACK）
- [ ] 理解抓包过滤器和显示过滤器的区别

---

## 📝 今日小结

Wireshark是蓝队的"透视眼镜"。今天你学会了如何抓包、过滤、追踪TCP流——这些操作在后面分析攻击流量时会天天用到。刚开始可能觉得过滤语法记不住，没关系，在Wireshark的过滤器输入框旁边有提示，随用随学很快就能记住。

**记住今天的核心**：
- 显示过滤器 = 从抓到的一堆包里挑出你要看的
- `ip.addr == x.x.x.x` = 只看和某IP相关的
- `tcp.port == 80` = 只看某端口
- Follow TCP Stream = 还原完整对话内容
- `&&` = 并且，`||` = 或者，`!` = 排除

---

## 📚 延伸阅读（可选）

- Wireshark官方Wiki：[Display Filters](https://wiki.wireshark.org/DisplayFilters)
- 挑战练习：下载公开的pcap样本文件（搜索"Wireshark sample captures"），用今天学的过滤器去分析

---

## 🎯 蓝队面试高频题（Day 8 主题）

**Q1：Wireshark的抓包过滤器和显示过滤器有什么区别？什么时候用哪个？**

> - 抓包过滤器（Capture Filter）：抓包前设置，语法简单（BPF语法），只抓符合条件的数据包。用于带宽大、只想抓特定流量的场景。
> - 显示过滤器（Display Filter）：抓包后筛选，语法强大（Wireshark专属语法），对已抓到的所有包进行显示筛选。用于精细分析和排查。
> - **蓝队实战**：护网期间网络流量非常大，先全量抓包（不过滤），存储下来。事后分析时用显示过滤器逐步缩小范围。**千万不要用抓包过滤器把流量预先过滤掉——你可能过滤掉了关键证据。**

**Q2："Follow TCP Stream"的工作原理是什么？蓝队用它做什么？**

> Follow TCP Stream把同一个TCP连接的所有数据包按序列号重新拼接，还原完整的双向通信内容。
> 蓝队场景：
> - 追踪HTTP攻击：看到完整的请求（攻击payload）和响应（攻击结果）
> - 追踪后门通信：还原C2命令和回传数据
> - 追踪数据泄露：看清楚攻击者从服务器偷走了什么数据
> - 还原FTP/Telnet等明文协议：直接看到用户名密码

**Q3：如何用Wireshark区分正常流量和扫描流量？**

> 正常流量特征：源IP分散、目标端口集中（80/443/53等常用端口）、有完整的TCP握手和数据传输
> 扫描流量特征：
> - 同一源IP短时间内连接大量不同目标端口（水平扫描）
> - 同一源IP扫描同一端口的大量不同目标IP（垂直扫描）
> - 大量SYN包没有后续数据传输（只敲门不进门）
> - 大量RST包（端口关闭被拒绝）
> - 连续端口（1,2,3,4...）或常见端口列表（22,80,443,3306...）
>
> Wireshark检测方法：
> ```
> # 统计每个源IP连接了多少个不同目标端口
> Statistics → Endpoints → TCP → 看每个IP的Ports列
> # 或用菜单：Statistics → Conversations → TCP
> ```

---

## 📖 深度阅读：Wireshark的分析菜单——你还没用到的隐藏功能

Wireshark 不只是"看包的"，它有很多内置的分析功能：

**1. Statistics → Protocol Hierarchy（协议层析）**
- 显示你抓到流量中各种协议的占比
- 一眼看出：正常应该是 HTTP/TLS/DNS 为主。如果出现大量不认识的协议→可疑

**2. Statistics → Conversations（会话统计）**
- 显示谁在和谁通话，通话多久，传了多少数据
- 排序找出：传数据最多的连接→可能是数据泄露
- 排序找出：持续时间最长的连接→可能是C2心跳

**3. Statistics → Endpoints（端点统计）**
- 显示流量中涉及的所有IP/端口及其数据量
- 排序找出：和最多不同IP通信的端点→可能是扫描源
- 排序找出：产生了最多数据量的IP→可能是数据泄露目标

**4. Statistics → IO Graph（IO图表）**
- 画流量随时间变化的曲线图
- 突然的尖峰→可能是DDoS或数据泄露爆发

**5. Statistics → HTTP → Requests**
- 列出所有HTTP请求的详细信息（URL、状态码等）
- 直接在表格里排序/筛选→比在包列表中翻找快得多

> **记住**：Wireshark的 "Statistics" 菜单是你从"看包"升级到"分析流量"的钥匙。

---

## 🏋️ 额外实操挑战

1. **分析真实pcap**：从 https://www.malware-traffic-analysis.net/ 下载一个恶意流量样本（选2024年的练习），用今天学的所有技能去分析
2. **TLS握手观察**：访问 https://www.baidu.com，在Wireshark中过滤 `tls.handshake.type == 1`（Client Hello），观察TLS握手的完整过程
3. **DNS分析挑战**：在Wireshark中抓取DNS流量（过滤 `dns`），找出一段流量中查询了哪些不同的域名
4. **IO图表练习**：用IO Graph功能画一段抓包流量的时间-包数曲线，标注出流量高峰期

---

## ⚠️ 新手常见误区纠正

1. **误区**："Wireshark只能分析明文流量，HTTPS抓了也白抓"
   - **更准确**：虽然无法看到HTTPS加密内容，但Wireshark仍然能看到：源/目标IP、端口、TLS版本、证书信息、SNI（访问的域名）、包大小变化模式。很多攻击行为从元数据就能判断——存在即是线索。
   
2. **误区**："抓包过滤器和显示过滤器语法一样"
   - **真相**：完全不一样！抓包用BPF语法（`host` `port` `net`），显示用Wireshark语法（`ip.addr==` `tcp.port==`）。在Wireshark的捕获选项中设置的过滤是BPF语法，上方过滤栏输入的是Wireshark语法。

3. **误区**："包太多了看不完，分析流量是不可能的"
   - **真相**：你不会一行一行看包。流程是：Statistical分析→找出异常IP/端口→过滤→Follow TCP Stream看交互内容。从几万个包到目标聚焦的几个TCP流，通常5分钟就够了。统计分析是"缩小范围"，Follow Stream是"精准打击"。


---

## 🎓 进阶过滤：Wireshark统计分析实战

除了前面学的Statistics菜单，还有几个对蓝队特别有用的分析功能：

**1. Display Filter Macros（显示过滤器宏）**
如果你经常用同一个复杂的过滤器，可以保存为宏：
```
Analyze → Display Filter Macros → 新建
名称: syn_scan
表达式: tcp.flags.syn == 1 and tcp.flags.ack == 0 and not tcp.port == 443
```
以后过滤栏直接输入 `${syn_scan}` 就行。

**2. Time Column（时间列）**
Wireshark默认显示"距第一个包的秒数"。但蓝队需要看真实时间：
```
View → Time Display Format → Date and Time of Day
```
这样可以看出攻击发生的真实时间，而不是相对时间。

**3. Coloring Rules（着色规则）**
给不同类型的包上不同颜色，一目了然：
```
View → Coloring Rules
比如设置 TCP RST 包为红色 → tcp.flags.reset == 1
SYN 包为黄色 → tcp.flags.syn == 1 && tcp.flags.ack == 0
```
护网值守时，红色包一出现你就知道有异常。

**4. Expert Information（专家信息）**
Wireshark内置的自动分析功能：
```
Analyze → Expert Information
```
会汇总所有协议异常——重传、乱序、校验错误、可疑行为。虽然不是100%准确，但能帮你快速定位问题。

---

## 🏋️ Wireshark高级挑战

1. **着色练习**：设置3个自定义着色规则 → SYN包黄色、RST包红色、DNS查询蓝色 → 抓包后一眼看出流量组成
2. **时间分析**：切到真实时间模式 → 抓取5分钟的常规上网流量 → 在IO Graph中画出流量曲线 → 标注出浏览网页和看视频的不同流量特征
3. **协议识别挑战**：找一段包含多种协议（HTTP/DNS/TLS/ICMP）的pcap，用 Protocol Hierarchy 统计各协议占的流量比例

---

## 📖 深度补充内容

### 面试高频题与实操扩展

## 💡 面试高频题：Wireshark流量分析

**Q: Wireshark的捕获过滤器和显示过滤器有什么区别？**
A: 捕获过滤器在抓包时生效（无法修改），语法是BPF（Berkeley Packet Filter），如`host 192.168.1.1 and port 80`。显示过滤器在已抓包中生效（随时可改），语法不同，如`ip.addr==192.168.1.1 and tcp.port==80`。蓝队现场分析时通常用显示过滤器——先全量抓包再逐层筛选。

**Q: 如何在Wireshark中还原一次完整的HTTP请求？**
A: ①先用`http.request`过滤出所有HTTP请求；②找到目标请求→右键→Follow→HTTP Stream（或TCP Stream）；③查看完整的请求-响应交互。这在分析Web攻击时非常关键——可以看到攻击者发了什么payload，服务器返回了什么，以及攻击是否成功。

**Q: 如何在Wireshark中识别Nmap扫描流量？**
A: ①TCP SYN扫描：大量SYN包发往不同端口，多数收到RST或超时（`tcp.flags.syn==1 and tcp.flags.ack==0`）；②TCP Connect扫描：完成三次握手后立即RST断开；③UDP扫描：大量UDP包发往不同端口，多数返回ICMP Port Unreachable。Nmap扫描的特征是"多端口、单主机、短时间"。

**Q: 蓝队最常用的5个Wireshark显示过滤器是什么？**
A: ①`ip.addr==x.x.x.x`（筛选特定IP的流量）；②`tcp.port==443`（筛选特定端口）；③`http.request.method=="POST"`（查看POST请求，通常包含攻击payload）；④`tcp.flags.reset==1`（查看RST包，判断连接被拒绝）；⑤`dns.qry.name contains "malware"`（查看DNS请求中的可疑域名）。

**Q: Wireshark抓包时发现大量TCP重传(Dup ACK/Retransmission)说明什么？**
A: 可能原因：①网络设备故障（网线/交换机端口问题）；②DDoS攻击导致带宽占满；③攻击者在进行TCP会话劫持；④中间人攻击（ARP欺骗导致数据包被劫持和重放）。蓝队需要结合时间段和源目IP做进一步判断。


## 📊 实操扩展：Wireshark分析一份真实Web攻击流量

模拟场景：以下是一个典型的Web攻击流量分析步骤。

**步骤1：定位攻击源IP**
```
http.request  # 先看所有HTTP请求
统计 → Endpoints → 查看哪个IP的请求数量异常多
```

**步骤2：还原攻击流量**
```
ip.src==可疑IP and http  # 只看该IP的HTTP流量
对可疑请求 → Follow → HTTP Stream
```

**步骤3：确认攻击类型**
- 如果在请求参数中看到 `' OR 1=1--` → SQL注入
- 如果看到 `<script>alert(1)</script>` → XSS
- 如果看到 `../../etc/passwd` → 路径遍历
- 如果看到连续大量不同路径的请求 → 目录扫描

**步骤4：判断攻击是否成功**
- 查看HTTP响应状态码：200→可能成功；403→被WAF拦截；500→触发了服务器错误
- 查看响应体大小：SQL注入成功拖库时，响应体通常异常大
- 查看后续请求：如果攻击者紧接着访问了不该访问的页面，说明攻击已成功


---

## 🔬 深度专题：Wireshark进阶：协议分析与攻击检测

### TCP流追踪进阶——还原完整攻击会话

基础TCP流追踪只能看单个连接，进阶用法可以还原跨连接的攻击链：

**1. 追踪攻击者的完整行为时间线**
```bash
# 提取攻击IP的所有TCP会话
tshark -r attack.pcap -Y "ip.src==192.168.1.100 || ip.dst==192.168.1.100" -T fields \
  -e frame.time -e ip.src -e ip.dst -e tcp.srcport -e tcp.dstport -e tcp.flags.syn -e tcp.flags.fin
```

**2. 检测异常TCP行为**
- SYN包数量/FIN包数量 > 3 = 可能存在SYN Flood攻击
- 大量RST包 = 端口扫描或连接中断攻击
- 零窗口（Zero Window）持续 = 接收端资源耗尽或DoS
- TCP窗口大小异常波动 = 可能的中间人攻击

**3. Wireshark专家信息（Expert Info）的使用**
- Analyze → Expert Info → 查看Wireshark自动识别出的协议异常
- Warning级别的"TCP Retransmission"、"TCP Dup ACK"、"TCP Out-Of-Order"需要关注
- 如果集中在某个时间段突然出现大量Warning = 可能有攻击

### DNS协议分析——发现隐蔽隧道

DNS是蓝队最常被忽视的协议之一。攻击者经常利用DNS做隐蔽通信（DNS隧道）：

**DNS隧道的流量特征**：
- 大量TXT/MX/CNAME类型的查询（正常DNS查询以A/AAAA为主）
- 请求的域名异常长（如`dGhpcyBpcyBhIHRlc3QK.malicious.com`——前面是一段Base64编码）
- 短时间内大量DNS查询同一域名的不同子域名（数据分片传输）
- DNS响应包异常大（正常的DNS响应通常<512字节）

**Wireshark检测命令**：
```bash
# 统计DNS查询类型分布
tshark -r capture.pcap -Y "dns.flags.response == 0" -T fields -e dns.qry.type | sort | uniq -c

# 查找异常长的DNS查询域名
tshark -r capture.pcap -Y "dns" -T fields -e dns.qry.name | awk "length>50"

# 查找DNS响应大于512字节的
tshark -r capture.pcap -Y "dns.flags.response == 1 && dns.length > 512"
```


---

## 🎯 实战思维训练

### 蓝队"条件反射"训练

网络安全值守中，很多判断需要在几秒内完成。以下是本日主题相关的"条件反射"训练：

**看到以下现象 → 立即联想到 → 采取动作**：

1. 短时间内同一IP大量不同URL请求 → 目录/漏洞扫描 → 检查是否返回了不该返回的内容
2. WAF告警+同IP的Web日志中有500错误 → 攻击可能在尝试绕过WAF → 查看完整请求体
3. 非工作时间的管理员登录 → 凭据泄露/后门 → 确认是否为合法运维操作
4. 同一文件被频繁POST请求 → Webshell心跳 → 检查文件内容和创建时间
5. 出站流量突增到非标准端口 → 数据渗出/C2通信 → 追踪目标IP并阻断

### "如果是你，你怎么防？"

假设你是护网蓝队负责人，面对今天学习的安全威胁，请设计你的防御方案：
- 预防层：如何在攻击发生前阻止？（安全配置/代码审计/权限控制）
- 检测层：攻击发生时如何发现？（日志/告警/流量分析的关键特征）
- 响应层：确认攻击后如何处置？（隔离/封禁/取证/恢复的标准动作）
- 复盘层：事后如何防止再次发生？（规则优化/流程改进/培训加固）

---

## 📈 学习效果自检

请回答以下问题，不看笔记：

1. 能不能用3句话向一个非安全同事解释今天学的核心概念？
2. 能不能在白板上画出今天涉及的关键流程/架构？
3. 能不能写出至少3条针对今天主题的检测规则/命令？
4. 如果面试官问"你遇到过XX问题吗？怎么处理的？"你能给出有细节的回答吗？
5. 今天的实操任务中，有没有遇到卡住的地方？记录到笔记中，明天优先解决。

> **记不住？** 正常的。安全知识不是"看一遍就记住"的——是需要"反复遇到、反复使用、反复验证"之后才内化的。重要的是**坚持每天动手**，让大脑建立"安全思维"的神经通路。

---

## 🔗 知识链接

将今天的内容与之前学过的知识建立连接：
- 今天的知识点在Kill Chain的哪个阶段？在ATT&CK中对应哪些技术？
- 今天的检测方法依赖之前学过的哪些工具？（Wireshark/grep/awk/Nmap...）
- 如果用今天学的知识去看Day 1的护网场景，你能额外发现什么问题？

建立知识之间的链接是"从入门到精通"的关键——孤立的知识点容易遗忘，相互连接的知识形成网络后就会变得牢固。
