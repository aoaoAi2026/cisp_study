# tcpdump 命令行抓包分析完全指南

> 分类：工具指南 | 难度：进阶 | 阅读时间：约40分钟

## 概述

tcpdump 是 Linux/Unix 系统上最经典的命令行网络抓包工具，由 Van Jacobson、Craig Leres 和 Steven McCanne 在劳伦斯伯克利实验室开发。它使用 libpcap 库捕获网络数据包，通过 BPF（Berkeley Packet Filter）语法进行过滤，是服务器环境、远程排查、自动化脚本场景中不可替代的工具。与 Wireshark GUI 互补——tcpdump 负责高效抓取，Wireshark 负责深入分析。

**核心优势**：
- 极轻量，几乎所有 Linux 发行版预装
- 无需图形界面，适合 SSH 远程操作
- BPF 过滤语法强大且一致
- 输出可被 Wireshark 直接读取
- 适合脚本化和自动化

## 核心知识点

- tcpdump 基本命令选项与输出解读
- BPF 过滤器语法详解
- 常见协议抓取
- 文件保存与 Wireshark 联动
- 实战中的高级用法
- 安全注意事项

---

## 一、安装

```bash
# 大多 Linux 预装
which tcpdump

# Debian/Ubuntu
sudo apt install tcpdump -y

# RHEL/CentOS
sudo yum install tcpdump -y

# macOS（预装）
# 或 brew install tcpdump

# 权限（非 root 抓包）
sudo setcap cap_net_raw,cap_net_admin=eip /usr/sbin/tcpdump
# 将用户加入 pcap 组
sudo usermod -aG pcap $USER
```

---

## 二、基础命令与输出解读

### 2.1 基本抓包

```bash
# 抓取所有流量（默认 eth0）
sudo tcpdump

# 指定网卡
sudo tcpdump -i eth0
sudo tcpdump -i any           # 所有网卡（Linux）

# 限制包数量
sudo tcpdump -c 100 -i eth0   # 抓 100 个包后停止

# 不解析主机名和端口（加快速度）
sudo tcpdump -n -i eth0        # -n: 不解析域名
sudo tcpdump -nn -i eth0       # -nn: 不解析域名和端口名

# 详细输出
sudo tcpdump -v -i eth0        # 较多信息
sudo tcpdump -vv -i eth0       # 更多信息
sudo tcpdump -vvv -i eth0      # 最详细

# 显示十六进制
sudo tcpdump -X -i eth0        # Hex + ASCII
sudo tcpdump -XX -i eth0       # 含以太网头的 Hex + ASCII
sudo tcpdump -A -i eth0        # 仅 ASCII（适合 HTTP 文本）
```

### 2.2 输出行解读

```
12:34:56.789012 IP 192.168.1.100.54321 > 93.184.216.34.80: Flags [S], seq 123456789, win 65535, options [mss 1460], length 0
```

| 字段 | 含义 |
|:---|:---|
| 12:34:56.789012 | 时间戳（微秒精度）|
| IP | 网络层协议 |
| 192.168.1.100.54321 | 源 IP:端口 |
| > | 方向 |
| 93.184.216.34.80 | 目标 IP:端口 |
| Flags [S] | TCP 标志（S=SYN, .=ACK, P=PSH, F=FIN, R=RST）|
| seq 123456789 | 序列号 |
| win 65535 | TCP 窗口大小 |
| length 0 | 数据长度 |

---

## 三、BPF 过滤器语法

### 3.1 主机过滤

```bash
# 单主机
sudo tcpdump host 192.168.1.100

# 源/目标
sudo tcpdump src host 192.168.1.100
sudo tcpdump dst host 192.168.1.200

# 子网
sudo tcpdump net 192.168.1.0/24
sudo tcpdump src net 10.0.0.0/8

# 排除某主机
sudo tcpdump not host 192.168.1.1
sudo tcpdump host 192.168.1.100 and not port 22
```

### 3.2 端口过滤

```bash
# 单端口
sudo tcpdump port 80

# 端口范围
sudo tcpdump portrange 1-1024

# 源/目标端口
sudo tcpdump src port 443
sudo tcpdump dst port 80

# 多端口
sudo tcpdump port 80 or port 443 or port 8080
```

### 3.3 协议过滤

```bash
# 基础协议
sudo tcpdump tcp
sudo tcpdump udp
sudo tcpdump icmp
sudo tcpdump ip6
sudo tcpdump arp

# 组合协议
sudo tcpdump tcp or udp
sudo tcpdump "tcp[tcpflags] & (tcp-syn|tcp-fin) != 0"
```

### 3.4 TCP 标志位过滤

```bash
# 仅 SYN（连接请求/扫描检测）
sudo tcpdump 'tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack == 0'

# 仅 RST
sudo tcpdump 'tcp[tcpflags] & tcp-rst != 0'

# SYN-ACK
sudo tcpdump 'tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack != 0'

# 各种标志组合
tcp-syn tcp-ack tcp-fin tcp-rst tcp-push tcp-urg
```

### 3.5 高级过滤

```bash
# 包大小过滤
sudo tcpdump greater 1500           # 大于 1500 字节
sudo tcpdump less 64                # 小于 64 字节

# HTTP GET 请求
sudo tcpdump -A 'tcp port 80 and tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x47455420'
# 0x47455420 = "GET " 的十六进制

# HTTP POST 请求
sudo tcpdump -A 'tcp dst port 80 and (tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x504f5354)'

# DNS 查询
sudo tcpdump -nn udp port 53

# 广播/组播
sudo tcpdump broadcast
sudo tcpdump multicast

# VLAN 过滤
sudo tcpdump vlan 100

# 逻辑组合
sudo tcpdump '(host 192.168.1.100 and port 80) or (host 192.168.1.200 and port 443)'
```

---

## 四、保存与读取文件

### 4.1 保存 pcap 文件

```bash
# 保存到文件
sudo tcpdump -w capture.pcap -i eth0

# 保存 + 限制文件大小（MB）
sudo tcpdump -w capture.pcap -C 100 -i eth0
# 生成 capture.pcap, capture.pcap1, capture.pcap2... 每个 100MB

# 保存 + 限制包数量
sudo tcpdump -w capture.pcap -c 10000 -i eth0

# 保存 + 过滤器
sudo tcpdump -w web_traffic.pcap -i eth0 port 80 or port 443

# 旋转保存（按时间）
sudo tcpdump -w capture_%Y%m%d_%H%M.pcap -G 3600 -i eth0
# 每小时一个文件

# 后台运行
sudo nohup tcpdump -w capture.pcap -i eth0 &
```

### 4.2 读取 pcap 文件

```bash
# 基础读取
sudo tcpdump -r capture.pcap

# 读取 + 过滤器
sudo tcpdump -r capture.pcap host 192.168.1.100
sudo tcpdump -r capture.pcap port 443

# 读取 + 显示格式
sudo tcpdump -r capture.pcap -A      # ASCII
sudo tcpdump -r capture.pcap -X      # Hex+ASCII
sudo tcpdump -r capture.pcap -nn     # 不解析
```

### 4.3 与 Wireshark 联动

```bash
# tcpdump 抓包 → Wireshark 分析
# 1. 在服务器上用 tcpdump 抓包
sudo tcpdump -w server_capture.pcap -i eth0 host 192.168.1.100

# 2. 下载到本地
scp user@server:/path/server_capture.pcap ./

# 3. 用 Wireshark 打开分析
wireshark server_capture.pcap

# 或通过 SSH 实时查看
ssh user@server "sudo tcpdump -i eth0 -w - port 80" | wireshark -k -i -
```

---

## 五、实战场景

### 场景一：监控 Web 访问

```bash
# 实时显示 HTTP 请求
sudo tcpdump -A -s 0 'tcp port 80 and (tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x47455420 or tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x504f5354)'

# 更简单的：获取 HTTP Host 头
sudo tcpdump -A -s 0 'tcp port 80' | grep 'Host:'
```

### 场景二：SSH 连接故障排查

```bash
# 抓取到某主机的所有 SSH 连接
sudo tcpdump -i eth0 host 192.168.1.100 and port 22 -vvv

# 关注握手阶段
sudo tcpdump -i eth0 host 192.168.1.100 and port 22 and 'tcp[tcpflags] & tcp-syn != 0'
```

### 场景三：DNS 问题排查

```bash
# 抓取所有 DNS 查询
sudo tcpdump -i eth0 -n udp port 53

# 仅抓取查询（不抓响应）
sudo tcpdump -i eth0 -n 'udp dst port 53'

# 抓取特定域名
sudo tcpdump -i eth0 -n udp port 53 | grep "example.com"
```

### 场景四：检测端口扫描

```bash
# 检测 SYN 扫描（大量 SYN 到不同端口）
sudo tcpdump -nn -i eth0 'tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack == 0' | awk '{print $3}' | awk -F. '{print $1"."$2"."$3"."$4}' | sort | uniq -c | sort -n

# 检测 SYN-ACK 响应（确认开放端口）
sudo tcpdump -nn -i eth0 'tcp[tcpflags] & (tcp-syn|tcp-ack) == (tcp-syn|tcp-ack)' -c 100
```

### 场景五：NTP DDoS 放大攻击检测

```bash
# NTP monlist DDoS（大量 UDP 123 响应流量）
sudo tcpdump -i eth0 -nn 'udp src port 123 and greater 200' -c 50

# 高频 DNS 响应（DNS 放大攻击）
sudo tcpdump -i eth0 -nn 'udp src port 53 and greater 200' -c 50
```

---

## 六、高级用法

### 6.1 精确字符匹配

```bash
# 搜索载荷中含特定字符串的包
sudo tcpdump -A -s 0 'tcp port 80' | grep -i "password"
sudo tcpdump -A -s 0 'tcp port 25' | grep -i "AUTH LOGIN"
```

### 6.2 时间戳格式

```bash
# 默认微秒格式
sudo tcpdump -tttt -i eth0        # YYYY-MM-DD HH:MM:SS.ms
sudo tcpdump -tt -i eth0          # Unix 时间戳
sudo tcpdump -ttt -i eth0         # 相对上一包的时间差
```

### 6.3 数据包切片

```bash
# 只抓前 96 字节（通常足够分析 TCP/IP 头）
sudo tcpdump -s 96 -i eth0

# 抓满包（默认 262144 字节）
sudo tcpdump -s 0 -i eth0

# 固定大小（节省存储）
sudo tcpdump -s 128 -w small.pcap -i eth0
```

---

## 七、安全与合规

> 抓包需要注意：不要在无授权网络上抓取；生产环境使用只读模式；定期清理 pcap 文件（含大量敏感数据）；通过 SSH 管道实时分析而非保存文件。

---

## 八、速查卡

```
基础抓包：       sudo tcpdump -i eth0
限制数量：       -c 100
不解析DNS/端口：  -nn
详细输出：       -v / -vv / -vvv
ASCII显示：      -A
Hex+ASCII显示：  -X
保存文件：       -w capture.pcap
读取文件：       -r capture.pcap
主机过滤：       host 192.168.1.1
端口过滤：       port 80 or port 443
网络过滤：       net 192.168.1.0/24
SYN包过滤：      'tcp[tcpflags] & tcp-syn != 0'
排除流量：       not port 22
大小过滤：       greater 1500

远程实时分析：
ssh server "sudo tcpdump -i eth0 -w - port 80" | wireshark -k -i -
```

---

## 实战场景扩展

### 场景五：入侵检测——发现扫描行为

```bash
# 检测端口扫描（SYN包大量出现）
sudo tcpdump -i eth0 -nn 'tcp[tcpflags] & tcp-syn != 0' \
  | awk '{print $3}' | cut -d. -f1-4 | sort | uniq -c | sort -rn | head -20

# 检测 SYN Flood（统计每秒SYN包数）
sudo tcpdump -i eth0 -nn 'tcp[tcpflags] == tcp-syn' -c 1000

# 分析连接模式：同一源IP短时间内大量连接不同端口=扫描
sudo tcpdump -i eth0 -nn -c 5000 | \
  awk '{if($3 ~ /\./) print $3}' | cut -d. -f1-4 | \
  sort | uniq -c | sort -rn | head -10
```

### 场景六：TLS/SSL 流量分析

```bash
# 抓取 TLS Client Hello（SNI）
sudo tcpdump -i eth0 -nn -A 'tcp port 443 and tcp[((tcp[12:1]&0xf0)>>2)+5:1]=0x16'

# 抓取完整 TLS 握手
sudo tcpdump -i eth0 -nn -s 0 \
  'tcp port 443 and (tcp[tcpflags]&tcp-syn!=0 or tcp[((tcp[12:1]&0xf0)>>2)+5:1]=0x16)'

# 提取 TLS 证书中的 CN 信息
sudo tcpdump -i eth0 -nn -A 'tcp port 443' | \
  grep -oP '(?<=CN=)[^,\s]+' | sort -u
```

### 场景七：HTTP API 调试

```bash
# 抓取特定域名的 HTTP 流量
sudo tcpdump -i eth0 -A 'host api.target.com and port 80'

# 仅抓 POST 请求（含 body）
sudo tcpdump -i eth0 -A 'tcp port 80 and tcp[((tcp[12:1]&0xf0)>>2):4]=0x504f5354'

# 抓取请求+响应的首包
sudo tcpdump -i eth0 -A -s 0 'tcp port 80' | \
  grep -E "^(GET|POST|PUT|DELETE|HTTP|Host|Content-Type|Authorization)" 
```

### 场景八：VoIP/SIP 通话故障排查

```bash
# 抓取 SIP 协议
sudo tcpdump -i eth0 -nn -s 0 port 5060

# 抓取 RTP 流（语音数据）
sudo tcpdump -i eth0 -nn -s 0 'udp portrange 10000-20000'

# 统计 RTP 丢包
sudo tcpdump -i eth0 -nn -s 0 'udp portrange 10000-20000' -c 10000 | \
  tshark -r - -qz io,stat,1
```

### 场景九：取证分析——保存完整流量

```bash
# 保存完整流量供 Wireshark 分析
sudo tcpdump -i eth0 -w capture.pcap -s 0

# 循环保存（每100MB一个文件，保留最近5个）
sudo tcpdump -i eth0 -w capture.pcap -C 100 -W 5 -s 0

# 按时间切分
sudo tcpdump -i eth0 -w capture_%Y%m%d_%H%M.pcap -G 3600 -s 0
# -G 3600: 每小时新建一个文件

# 仅保存特定协议的流量
sudo tcpdump -i eth0 -w http_only.pcap -s 0 'port 80 or port 443'
```

### 场景十：DNS 流量安全监控

```bash
# 捕获所有 DNS 查询
sudo tcpdump -i eth0 -nn 'port 53'

# DNS 查询类型统计
sudo tcpdump -i eth0 -nn 'udp port 53' -c 1000 | \
  awk '{print $NF}' | sort | uniq -c | sort -rn

# 检测 DNS 隧道（大包 DNS 流量）
sudo tcpdump -i eth0 -nn 'port 53 and greater 150' -c 100

# 追踪特定域名的 DNS 查询
sudo tcpdump -i eth0 -nn 'port 53' -A | \
  grep -i "malware.example.com\|evil.c2.server"
```

---

## 高级技巧

### 性能优化

```bash
# 使用 -n 避免 DNS 反向解析（大幅提升性能）
sudo tcpdump -n -i eth0

# 增大缓冲区
sudo tcpdump -i eth0 -B 4096   # 4MB 缓冲区

# 限制快照长度（仅保存包头）
sudo tcpdump -i eth0 -s 96     # 仅前96字节（通常含完整IP+TCP头）

# 使用 BPF 过滤器在驱动层丢弃包
sudo tcpdump -i eth0 'port 80'  # 高效，驱动层过滤
```

### 网络延迟分析

```bash
# 计算 TCP 握手时间
sudo tcpdump -i eth0 -nn 'tcp[tcpflags] & (tcp-syn|tcp-ack) == tcp-syn' \
  -tttt | grep -A1 'client.ip'

# ARP 请求延迟
sudo tcpdump -i eth0 -nn 'arp' -tttt

# ICMP 延迟分析
sudo tcpdump -i eth0 -nn 'icmp' -ttt
# -ttt: 显示与上一包的时间差
```

---

## 常见问题排查

| 问题 | 原因 | 解决方案 |
|:---|:---|:---|
| `Permission denied` | 非 root | `sudo tcpdump` 或 `setcap cap_net_raw` |
| `No packets captured` | 网卡选择错误 | `tcpdump -D` 确认网卡 |
| 丢包 | 缓冲区不足 | `-B 8192` 增大缓冲区 |
| `promiscuous mode not supported` | 虚拟网卡限制 | 使用 `-p` 禁止混杂模式 |
| 乱码输出 | 未使用 `-A` | 文本协议加 `-A` 参数 |
| Wireshark 打不开文件 | pcap 格式错误 | 确认使用 `-w` 参数写入 |
| SSH 远程被自己流量淹没 | 抓取了 SSH 接口 | 用 `not port 22` 排除SSH流量 |

---

## 安全使用注意事项

1. **必须获得授权**后才能抓包（网络监控合规）
2. **敏感数据保护**：pcap 文件可能含明文密码/令牌
3. **存储管理**：pcap 文件可能迅速占满磁盘
4. **加密流量限制**：HTTPS/TLS 加密内容不可读（非中间人场景）
5. **取证链**：保存抓包时的系统时间用于证据链

---

> 📖 本文为"网安百宝箱"课程配套读物。更新于 2026-06-18
