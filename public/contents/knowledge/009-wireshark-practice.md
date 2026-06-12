# Wireshark 网络分析实战

---

## 一、捕获过滤器 (BPF)

```bash
# BPF (Berkeley Packet Filter) 语法
host 192.168.1.100          # 特定IP
net 192.168.1.0/24          # 网段
src host 10.0.0.1           # 源IP
dst port 443                # 目标端口
port 80 or port 443         # 多端口
not arp                     # 排除ARP
tcp port 3389               # RDP
greater 1000                # >1000字节的包
```

---

## 二、显示过滤器

```
// 按协议
http, dns, tcp, udp, icmp, arp, tls

// 按IP
ip.addr == 192.168.1.100
ip.src == 10.0.0.1
!(ip.addr == 192.168.1.0/24)

// 按TCP标志
tcp.flags.syn == 1 && tcp.flags.ack == 0  // SYN扫描
tcp.flags.reset == 1                        // RST包
tcp.analysis.retransmission                 // 重传

// 按HTTP
http.request.method == "POST"
http.host contains "login"
http.response.code == 200

// 按DNS
dns.qry.name contains "suspicious"
dns.flags.response == 0        // 仅查询

// 按TLS
tls.handshake.type == 1        // Client Hello
tls.handshake.extensions_server_name  // SNI域名

// 组合条件
http && ip.src == 10.0.0.100 && tcp.port == 8080
```

---

## 三、TLS 解密

```
方法1: RSA私钥（仅RSA密钥交换）
  Wireshark → Edit → Preferences → RSA Keys
  → 导入服务器私钥
  ✗ 不支持ECDHE（现代TLS默认使用)

方法2: SSLKEYLOGFILE ★推荐
  浏览器/应用导出pre-master secrets
  export SSLKEYLOGFILE=/tmp/sslkeys.log
  Wireshark → Preferences → TLS → (Pre)-Master-Secret log
  
方法3: 中间人代理
  Burp Suite / mitmproxy
  局限：仅HTTP协议，非标准协议无法
```

---

## 四、实战场景

```
场景1: 查找数据外泄
  → Statistics → Conversations → 按Bytes排序
  → 非标准端口的大流量 → 进一步分析内容

场景2: 发现C2 Beacon
  → 分析DNS查询频率 → 每60秒规律查询 → 可疑
  → 分析HTTP POST周期 → Beacon心跳

场景3: 分析TCP重传
  → tcp.analysis.retransmission → 查看
  → 大量重传 = 网络质量差/中间人干扰

场景4: 追踪HTTP流
  → 右键包 → Follow → HTTP/TCP Stream
  → 查看完整请求-响应
```

---

## 五、统计功能

```
Statistics 菜单：
  Summary: 总包/总流量/抓包时长
  Protocol Hierarchy: 各协议占比
  Conversations: 通信对端(IP间通信量排名)
  Endpoints: 端点(IP/端口)统计
  IO Graph: 流量时序图
  Flow Graph: 通信序列图
  Expert Info: 协议异常自动标注
```

---

## 六、Checklist

- [ ] BPF捕获过滤器熟练
- [ ] Display Filter高级语法
- [ ] TLS解密配置
- [ ] HTTP/DNS/TCP 会话追踪
- [ ] 异常流量模式识别
- [ ] 统计功能应用
