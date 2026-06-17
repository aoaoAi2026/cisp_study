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
