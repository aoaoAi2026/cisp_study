# TCP/IP 深入理解：从三次握手到拥塞控制

TCP/IP 是整个互联网的基础协议族，也是所有网络安全工作的底层根基。理解 TCP/IP 的工作原理，不仅能帮助我们抓包、分析流量，还能更好地理解各类网络攻击（如 DDoS、TCP 劫持、端口扫描）的本质。本文从协议分层、连接管理、流量控制、拥塞控制到常见攻击，做一次系统梳理。

## 一、协议分层

TCP/IP 四层模型：

| 层级 | 典型协议 / 组件 | 作用 |
| --- | --- | --- |
| 应用层 | HTTP、HTTPS、DNS、SSH、FTP | 为应用程序提供服务 |
| 传输层 | TCP、UDP | 进程间通信、可靠性 / 实时性保障 |
| 网络层 | IP、ICMP、ARP | 路由选择、跨网段寻址 |
| 网络接口层（链路层） | 以太网、Wi-Fi、PPP | 物理传输、帧封装、MAC 寻址 |

OSI 七层模型中的"会话层 / 表示层"在 TCP/IP 模型中被合并到应用层，由各应用协议自行处理（如 TLS 往往放在传输层与应用层之间）。

## 二、IP 层核心概念

- **IP 地址**：32 位（IPv4）或 128 位（IPv6），用于网络寻址。
- **子网 / CIDR**：通过子网掩码或 `/24`、`/16` 的无类域间路由划分网段。
- **路由 / 网关**：跨网段数据包由路由器/网关转发。
- **ICMP**：IP 的辅助协议，`ping`（echo request/reply）、`traceroute`、ICMP Redirect、PMTUD 等基于 ICMP 实现。
- **ARP / NDP**：地址解析协议，用于 IP → MAC 的映射；IPv6 下由邻居发现协议（NDP）替代。
- **MTU / MSS**：最大传输单元（链路层限制）、最大段大小（TCP 分段依据，通常 MSS = MTU - 40）。

## 三、TCP 头部与关键字段

TCP 头部（基础 20 字节，选项可扩展至 60 字节）：

- 源端口 / 目的端口：16 位，共 65536 个端口；
- 序列号（Seq）：本次发送数据段的第一个字节的序号；
- 确认号（Ack）：期望收到对端下一个字节的序号；
- 数据偏移：TCP 头长度（4 位 × 4 = 最大 60 字节）；
- 控制位：`URG / ACK / PSH / RST / SYN / FIN`；
- 窗口大小（Window）：滑动窗口的接收窗口，用于流控；
- 校验和：覆盖 TCP 伪头部 + TCP 头 + 数据；
- 紧急指针：配合 URG 位使用；
- 选项：常见 MSS、SACK、Timestamps、Window Scale（WSopt）。

## 四、三次握手与四次挥手

### 4.1 三次握手（Three-way Handshake）

```
Client                                Server
  | SYN (seq=x)                          |
  |------------------------------------->|
  |                                      |
  |          SYN+ACK (seq=y, ack=x+1)    |
  |<-------------------------------------|
  |                                      |
  | ACK (ack=y+1)                        |
  |------------------------------------->|
  |          (ESTABLISHED)               |
```

- 第一次握手：Client 发送 SYN，携带初始序列号 ISN(c)；
- 第二次握手：Server 回 SYN+ACK，ISN(s) + ack=ISN(c)+1；
- 第三次握手：Client 回 ACK，ack=ISN(s)+1；两端连接建立。

> 为什么不是两次？主要是为了**确认双方收发能力**，防止历史连接干扰新连接（RFC 793/9293），也能抵御半开连接 SYN 洪泛（但需要 SYN Cookies 等机制配合）。

### 4.2 四次挥手（Four-way Handshake）

```
Client                                Server
  | FIN (seq=u)                          |
  |------------------------------------->| CLOSE_WAIT(Server)
  |                                      |
  |          ACK (ack=u+1)               |
  |<-------------------------------------|
  |                                      |
  |          FIN (seq=v)                 |
  |<-------------------------------------|
  |                                      |
  | ACK (ack=v+1)                        |
  |------------------------------------->| 进入 CLOSED
  | TIME_WAIT (2*MSL)                    |
```

- 主动关闭方发送 FIN，进入 FIN_WAIT_1；
- 被动方回 ACK，进入 CLOSE_WAIT，再发送 FIN 进入 LAST_ACK；
- 主动方回 ACK，进入 TIME_WAIT（2×MSL，约 2 分钟），确保最后一个 ACK 能被对端收到；
- 最终两端 CLOSED。

## 五、TCP 可靠性机制

- **序列号 / 确认号**：数据按字节编号，对端通过 Ack 号告知已收到多少。
- **重传（Retransmission）**：发送端维护重传计时器（RTO，基于 RTT 动态计算），超时未收到 Ack 则重传。
- **快速重传（Fast Retransmit）**：收到 3 个重复 Ack，不等超时直接重传。
- **流量控制（Flow Control）**：接收端通过 TCP 头的 Window 字段通知发送端自己的接收窗口，避免被淹没。
- **拥塞控制（Congestion Control）**：通过慢启动、拥塞避免、快速恢复等算法，在网络拥塞时调节发送速率。

## 六、拥塞控制算法概览

| 阶段 | 描述 |
| --- | --- |
| 慢启动（Slow Start） | cwnd（拥塞窗口）按 Ack 指数增长，直到达到 ssthresh 或出现丢包 |
| 拥塞避免（Congestion Avoidance） | cwnd 线性增长（每 RTT 增加约 1 MSS），直到检测到拥塞 |
| 快速重传 / 快速恢复 | 收到 3 个重复 Ack 时，ssthresh = cwnd/2，cwnd 线性恢复，而非回退到 1 MSS |

主流算法演变：Tahoe → Reno → NewReno → Cubic（Linux 默认）→ BBR（谷歌提出，基于带宽与 RTT 模型）。BBR 不再把丢包当作唯一的拥塞信号，对长肥管道（长距离、高带宽）更友好。

## 七、UDP 简述

- 无连接、不可靠、开销小；
- 适用：DNS、实时音视频（WebRTC）、游戏、QUIC；
- 应用层自行实现可靠性（如 QUIC 在 UDP 上实现了类似 TCP 的握手、重传、拥塞控制）。

## 八、常见网络攻击与防御

| 攻击类型 | 原理 | 防御 |
| --- | --- | --- |
| SYN Flood | 大量伪造源 IP 的 SYN，耗尽服务器 SYN backlog | SYN Cookies、SYN Proxy、防火墙限速 |
| TCP RST 攻击 | 伪造 RST 报文中断合法连接 | TCP 序列号随机性、加密协议（TLS）下影响有限 |
| DNS 放大 / NTP 放大 | 伪造源 IP + 小请求 → 大响应 | 关闭开放递归、anycast、速率限制 |
| ICMP Flood / Smurf | 广播 + 伪造源 IP 放大攻击 | 禁用 ICMP 广播响应、速率限制 |
| ARP 欺骗 / MITM | 伪造 ARP Reply 篡改网关 MAC | 静态 ARP、DAI、802.1X、VLAN 隔离 |
| TCP 劫持 / 会话劫持 | 猜测/嗅探到序列号后注入恶意数据 | TLS 加密、递增随机 ISN、Cookie 安全属性 |
| 端口扫描（Nmap） | 发送 SYN/FIN/NULL/Xmas 探测端口 | 防火墙限流、IPS、端口触发、减少开放服务 |
| Slowloris / RUDY | 低速 HTTP 请求耗尽连接资源 | 连接超时限制、ModSecurity、反向代理限流 |

## 九、抓包与分析实践

- **Wireshark**：过滤器 `tcp.port == 80`、`ip.addr == 10.0.0.1`、`tcp.flags.reset == 1`、`http.request`；
- **tcpdump**：`tcpdump -i any -w demo.pcap host 10.0.0.1 and port 443`；
- **tshark**：配合脚本化做批量 IO 分析；
- 查看 **TCP 流**：Wireshark 右键 → Follow → TCP Stream，可看到还原后的应用层数据；
- 关注 **重传、Dup Ack、ZeroWindow、RST** 等异常事件，定位网络问题。

## 十、学习建议

1. 用 Wireshark 抓一次自己的 `curl https://example.com`，完整观察 DNS、TCP 三次握手、TLS ClientHello、HTTP、TCP 四次挥手；
2. 用 `netstat/ss` 查看本机连接状态表，理解 LISTEN / ESTABLISHED / TIME_WAIT 等含义；
3. 阅读《TCP/IP 详解 卷1：协议》或 RFC 793/9293，夯实理论基础；
4. 动手用 Scapy 构造 SYN、ICMP、DNS 报文，加深对报文结构的理解；
5. 结合 DDoS 防护产品文档（如 Cloudflare、AWS Shield）理解攻击缓解实践。

掌握 TCP/IP 需要"理论 + 抓包 + 实践工具"三轮驱动。只要坚持每周抓一次包、分析一次异常流，很快就能形成稳定的"网络直觉"。
