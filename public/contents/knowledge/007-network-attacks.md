# 网络协议安全深度分析

---

## 一、ARP 欺骗与中间人

```
ARP协议无认证 → 任意主机可发送ARP响应 → ARP缓存投毒

攻击效果：
  Attacker MAC ← 网关IP → 受害者的流量经过攻击者中转
  → 中间人攻击(MITM) → 流量窃听/篡改/阻断

工具：
  arpspoof, Ettercap, BetterCAP

防御：
  ✓ 交换机端口安全(Port Security)
  ✓ DAI(Dynamic ARP Inspection) — 交换机级ARP检测
  ✓ 静态ARP表（重要设备）
  ✓ ARPWatch 监控异常ARP
```

---

## 二、DNS 缓存投毒 (Kaminsky 攻击)

```
Dan Kaminsky (2008) 发现的核心漏洞：

攻击原理：
  1. 伪造DNS响应，猜测Transaction ID (16位=65536种)
  2. 传统攻击：每次只能试1个 → 命中率极低
  3. Kaminsky方法：每次发送伪造响应批量子域请求 → 
     "www1.xxx.com", "www2.xxx.com"... → 大幅提高命中率

影响：可劫持任意域名的DNS解析

修复：
  ✓ DNS源端口随机化 (端口也参与猜测 → 65536×65536 ≈ 40亿)
  ✓ DNSSEC (数字签名防篡改) — ★终极方案
  ✓ DNS-over-HTTPS (DoH) — 应用层加密
  ✓ DNS-over-TLS (DoT) — 传输层加密
```

---

## 三、TCP 会话劫持

```
TCP劫持方法：

1. 盲劫持 (Blind Hijacking)：
   攻击者预测TCP序列号 → 注入伪造数据包
   难度：现代OS使用随机ISN → 几乎不可能

2. RST注入 (Session Termination)：
   伪造RST包(TCP重置)
   只需猜对窗口内的Seq号(约10万种可能)
   → "TCP Reset Attack" (Great Firewall of China使用此技术)

3. 中间人劫持：
   用ARP欺骗 → 在数据路径中 → 直接修改TCP数据
```

---

## 四、BGP 路由劫持

```
BGP (Border Gateway Protocol) 设计缺陷：
  无内置认证 → 任何BGP Speaker可宣告任意IP前缀

典型案例：
  2018年：某俄罗斯ISP劫持Google/Cloudflare/AWS等80+云服务流量
  2021年：AS55410劫持2万+路由前缀（包括Amazon/Akamai/Microsoft）

防御：
  ✓ RPKI (Resource Public Key Infrastructure) — 签名的ROA
  ✓ BGPsec (路由声明签名)
  ✓ IRR (Internet Routing Registry) 过滤
  ✓ 主要ISP/云厂商已部署

检测：
  BGPmon, BGPstream, RIPEstat — 实时监控BGP异常
```

---

## 五、DHCP 攻击

```
DHCP 无认证 → 伪造DHCP服务器 → 分配恶意IP配置

攻击类型：
  1. DHCP 耗尽 (DHCP Starvation)：
     伪造大量MAC地址请求IP → 合法地址池被耗尽
     
  2. DHCP 欺骗 (DHCP Spoofing)：
     伪造DHCP服务器 → 分配恶意DNS/Gateway
     → 流量被重定向到攻击者

防御：
  ✓ DHCP Snooping (交换机级) — 标记Trusted/Untrusted端口
  ✓ 802.1X 准入控制
```

---

## 六、Wireshark 实操：分析攻击流量

```bash
# 过滤 ARP 欺骗
arp.duplicate-address-detected  # 重复IP的ARP
arp.opcode == 2                 # ARP响应

# 过滤 DNS 异常
dns.flags.response == 0         # 仅查询
dns.qry.name contains "suspicious"
dns.qry.name matches "[a-z0-9]{20,}\.com"  # DGA域名

# 过滤 TCP 异常
tcp.analysis.retransmission     # TCP重传
tcp.analysis.fast_retransmission
tcp.analysis.lost_segment       # 丢包
tcp.flags.reset == 1            # RST包

# 过滤 DHCP 异常
bootp.option.dhcp == 2          # DHCP Offer(服务器响应)
bootp.option.dhcp == 5          # DHCP ACK
bootp.hw.mac_addr                # 查看MAC地址分布
```

---

## 七、Checklist

- [ ] 交换机部署DAI(Dynamic ARP Inspection)
- [ ] 关键DNS启用DNSSEC
- [ ] DHCP Snooping启用
- [ ] BGP RPKI部署（ISP层面）
- [ ] Wireshark异常流量分析能力
- [ ] 网络流量基线建立
