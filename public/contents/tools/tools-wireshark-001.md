# Wireshark 流量分析实战：从抓包到溯源

> 分类：工具指南 | 难度：进阶 | 阅读时间：约28分钟

## 概述

Wireshark 是全球使用最广泛的网络协议分析器。无论是蓝队的告警研判、应急溯源，还是红队的数据窃取分析、协议逆向，Wireshark 都是核心分析武器。本指南从基础过滤语法到高级攻击流量识别，帮你建立完整的流量分析方法论。

## 核心知识点

- 抓包前的环境准备与捕获过滤器（Capture Filter）
- 显示过滤器的核心语法与常用技巧
- TCP 流追踪与会话分析
- HTTP/HTTPS/DNS 协议深入分析
- 常见攻击流量的特征识别
- 统计功能与数据导出

## 正文

### 一、抓包准备

#### 1.1 网络安全实验环境

```bash
# Linux 上安装
sudo apt install wireshark
sudo usermod -aG wireshark $USER   # 允许非 root 抓包

# Windows 上需安装 Npcap（而非 WinPcap）
```

#### 1.2 捕获过滤器（Capture Filter）

在开始抓包前使用，减少无关流量，节省资源：

| 过滤器 | 说明 |
|------|------|
| `host 192.168.1.1` | 仅捕获该主机的流量 |
| `net 192.168.1.0/24` | 仅捕获该子网的流量 |
| `port 80 or port 443` | 仅捕获 HTTP/HTTPS |
| `tcp port 445` | 仅捕获 SMB 流量 |
| `not arp and not stp` | 排除 ARP 和生成树协议噪音 |
| `host 10.0.0.5 and not port 22` | 某主机除 SSH 外的流量 |

### 二、显示过滤器（Display Filter）

捕获后进行精确筛选的核心技能：

#### 2.1 常用过滤语法

```
# IP 层面
ip.addr == 192.168.1.1      # 源或目标 IP
ip.src == 10.0.0.5           # 源 IP
ip.dst == 10.0.0.6           # 目标 IP

# TCP 层面
tcp.port == 80               # 源或目标端口
tcp.flags.syn == 1           # 仅 SYN 包（检测扫描）
tcp.flags.reset == 1         # RST 包（端口关闭）
tcp.analysis.retransmission  # 重传包（网络问题）

# HTTP 层面
http.request                  # 所有 HTTP 请求
http.response                 # 所有 HTTP 响应
http.host == "example.com"    # 特定域名
http.request.uri contains "login"  # URI 包含 login
http.user_agent contains "sqlmap"  # 检测 SQLMap 攻击
http.request.method == POST   # 仅 POST 请求

# DNS 层面
dns                           # 所有 DNS 流量
dns.qry.name contains "evil"  # 可疑域名
dns.flags.rcode != 0          # DNS 查询失败（可能隧道）

# 综合示例
http.request and ip.src == 192.168.1.100
tcp.port == 445 and tcp.flags.syn == 1
```

#### 2.2 逻辑组合

```
&& (and)     || (or)     ! (not)
(http or dns) and !(ip.src == 10.0.0.1)
```

### 三、追踪 TCP 流——会话还原

Wireshark 的 TCP Stream 功能可以还原完整会话：

- **右键** → **Follow** → **TCP Stream**
- 还原 HTTP 请求/响应、FTP 数据传输、Telnet 会话等
- 红色为客户端→服务端，蓝色为服务端→客户端

**实战场景**：
- 追踪 HTTP 登录过程，查找明文密码
- 还原 FTP 文件传输内容
- 分析 SQL 注入的 Payload

### 四、常见攻击流量识别

#### 4.1 端口扫描

```
特征：短时间大量 SYN 包到不同端口
过滤器：tcp.flags.syn == 1 and tcp.flags.ack == 0
分析：统计 → 终端节点 → 查看源 IP 到目标端口的连接数
```

#### 4.2 SQL 注入

```
特征：HTTP 请求中包含 SQL 关键字
过滤器：http.request.uri contains "union" or http.request.uri contains "select"
检测：追踪 TCP 流查看完整 Payload
```

#### 4.3 Webshell 通信

```
特征：规律的 HTTP POST 请求，User-Agent 可能异常
分析：
1. 过滤 POST 请求：http.request.method == POST
2. 按时间排序查看是否有规律通信
3. 追踪 TCP 流分析 POST Body 内容（经常 Base64 编码）
```

#### 4.4 DNS 隧道

```
特征：异常的 DNS 查询（长域名、高频次、非标准 TLD）
过滤器：dns.qry.name matches ".[a-zA-Z0-9]{20,}"
分析：正常 DNS 查询域名很短，隧道流量的查询字段异常长
```

#### 4.5 Cobalt Strike Beacon

```
特征：周期性 HTTP GET 请求，包含特定 URI 特征
常见特征：Malleable C2 Profile 可能改变，但周期性模式不变
过滤器：http.time > 0.5 and http.request.method == GET
统计 → I/O 图表可直观看到"心跳"信号
```

### 五、实用统计功能

| 功能 | 路径 | 用途 |
|------|------|------|
| 协议层次 | 统计 → 协议层次 | 查看流量协议分布 |
| 端点统计 | 统计 → 端点 | 找出通信最多的 IP |
| 会话统计 | 统计 → 会话 | 查看 IP 之间的通信 |
| I/O 图表 | 统计 → I/O 图表 | 可视化流量趋势 |
| HTTP 请求 | 统计 → HTTP → 请求 | 列出所有 HTTP 请求 |
| 专家信息 | 分析 → 专家信息 | 自动标记异常/错误 |

### 六、数据导出

```
文件 → 导出特定分组 → 选择过滤后的数据包导出为新 pcap
文件 → 导出对象 → HTTP → 导出传输的文件
```

---

> 📖 本文为"网安百宝箱"课程配套读物。
> 参考：Wireshark 官方文档 https://www.wireshark.org/docs/
> 更新于 2026-06-18
