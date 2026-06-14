# Day 49：第七周总结与测验

> **所属周**：Week 7 — 网络安全 · **主题**：网络协议安全全体系回顾与模拟测验

---

## 📑 目录

1. [第七周知识地图](#一第七周知识地图)
2. [每日精华回顾](#二每日精华回顾)
3. [核心对比表汇总](#三核心对比表汇总)
4. [关键数字记忆](#四关键数字记忆)
5. [模拟测验（15题）](#五模拟测验15题)
6. [网络安全防护体系总结](#六网络安全防护体系总结)
7. [下周预览](#七下周预览)
8. [学习进度检查](#八学习进度检查)

---

## 一、第七周知识地图

```
                    ┌─────────────────────────┐
                    │     网络安全知识体系      │
                    └───────────┬─────────────┘
                                │
    ┌───────────┬───────────────┼───────────────┬───────────────┐
    │           │               │               │               │
┌───▼───┐  ┌───▼───┐     ┌────▼────┐     ┌───▼───┐     ┌────▼────┐
│协议安全│  │ 防火墙  │     │ IDS/IPS │     │  VPN   │     │ 无线安全 │
│(Day43) │  │(Day44) │     │(Day45)  │     │(Day46) │     │(Day47)  │
├───────┤  ├───────┤     ├────────┤     ├───────┤     ├────────┤
│·ARP欺骗│  │·包过滤  │     │·IDSvsIPS│    │·IPsec │     │·WPA3 SAE│
│·SYNFlood│ │·状态检测│     │·Snort规则│   │·SSL VPN│    │·802.1X  │
│·DNS劫持│  │·NGFW   │     │·HIDS    │    │·WireGuard│   │·EvilTwin│
│·IPsec  │  │·DMZ    │     │·SIEM协作│    │·对比表  │    │·WIPS    │
└───────┘  └───────┘     └────────┘     └───────┘     └────────┘
                                │
                    ┌───────────▼───────────┐
                    │    网络分段 (Day 48)    │
                    ├───────────────────────┤
                    │·VLAN/802.1Q安全       │
                    │·微分段(Micro-Seg)     │
                    │·SDN安全              │
                    │·零信任(NIST 800-207)  │
                    │·SDP(软件定义边界)      │
                    │·NAC(网络访问控制)      │
                    └───────────────────────┘
```

---

## 二、每日精华回顾

### Day 43：网络协议安全
```
核心掌握：
  · TCP/IP四层模型及每层安全威胁
  · ARP欺骗：无状态+无条件接受Reply → MITM
  · SYN Flood：填充半连接队列 → SYN Cookie防御（无状态握手）
  · DNS缓存投毒：16位TXID+固定端口可攻击 → DNSSEC
  · IP欺骗：源地址伪造 → 入向过滤(BCP 38)
```

### Day 44：防火墙技术
```
核心掌握：
  · 五代防火墙：包过滤→状态检测→应用代理→UTM→NGFW
  · 状态检测核心：状态表自动处理回程流量
  · NGFW标志：不论端口识别应用 + 用户感知
  · DMZ设计原则：对互联网有条件开放，对内网严格限制
  · 默认拒绝原则：最后规则deny+log
```

### Day 45：入侵检测系统
```
核心掌握：
  · IDS旁路只告警 vs IPS串联能阻断
  · 四种检测方法：签名+异常+协议+信誉
  · Snort规则结构：action proto src -> dst (options)
  · HIDS：文件完整性+日志分析+进程监控
  · 告警优先级矩阵：高影响+高准确=P0
```

### Day 46：VPN技术
```
核心掌握：
  · IPsec两协议：ESP(加密+认证) vs AH(仅认证)
  · 传输vs隧道：端到端 vs 网关到网关
  · SSL VPN优势：无客户端+细粒度+443端口友好
  · WireGuard理念：4000行代码 + 现代密码 + 内核态
  · PPTP：永远不要用（MS-CHAPv2可破解）
```

### Day 47：无线网络安全
```
核心掌握：
  · WEP不安全的三个原因：RC4+短IV(24位)+静态密钥
  · WPA3 SAE：抗离线暴力 + 前向保密 + PMF强制
  · 802.1X三件套：Supplicant + Authenticator + Auth Server
  · Evil Twin防御：WPA3 SAE双向认证
  · WIPS：检测Rogue AP + Deauth攻击 + 自动防御
```

### Day 48：网络分段
```
核心掌握：
  · VLAN跳跃：Switch Spoofing + Double Tagging
  · 防御：关闭DTP + 改Native VLAN + Trunk全打Tag
  · 微分段：工作负载级别的安全策略
  · 零信任："永不信任，始终验证"
  · SDP：先认证后连接（Controller+Gateway+Client）
  · NAC：接入前认证+健康检查+动态VLAN分配
```

---

## 三、核心对比表汇总

### 防火墙代际对比

| 代际 | 技术 | 检查范围 | 关键能力 |
|------|------|---------|---------|
| 1代 | 包过滤 | L3-L4头 | ACL规则 |
| 2代 | 状态检测 | L3-L4连接 | 状态表 |
| 3代 | 应用代理 | L7完整协议 | 内容过滤 |
| 4代 | UTM | 多引擎 | 功能堆叠 |
| 5代 | NGFW | L7应用识别 | 应用+用户感知 |

### VPN协议对比

| 协议 | 安全强度 | 部署难度 | 当前推荐 |
|------|---------|---------|---------|
| PPTP | ☠ 已死 | 低 | ❌ 永远不要用 |
| L2TP/IPsec | ⚠️ 中等 | 中 | ❌ 逐步淘汰 |
| IPsec IKEv2 | ✅ 强 | 高 | ✅ 站点到站点 |
| SSL VPN | ✅ 强 | 中 | ✅ 远程接入 |
| WireGuard | ✅ 强 | 低 | ✅ 新时代首选 |

### Wi-Fi安全协议

| 协议 | 加密 | 认证方式 | 安全性 |
|------|------|---------|--------|
| WEP | RC4 | 静态密钥 | ☠ 分钟级破解 |
| WPA | TKIP(RC4) | PSK/802.1X | ⚠️ 已淘汰 |
| WPA2 | CCMP(AES) | PSK/802.1X | ⚠️ KRACK(2017) |
| WPA3 | GCMP(AES-256) | SAE/802.1X | ✅ 当前推荐 |

---

## 四、关键数字记忆

```
┌─────────────────────────────────────────────────────┐
│              Week 7 必记数字                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  · ARP缓存投毒：无状态、无认证（经典必考）             │
│  · DNS查询TXID：16位（2^16=65536种可能）             │
│  · 802.1Q VLAN ID：12位（0-4095，可用1-4094）       │
│  · WEP IV长度：24位（1670万种，数小时循环）           │
│  · WPS PIN：8位（最后1位校验=7位有效，11000种可能）   │
│                                                     │
│  · IPsec ESP协议号：50                              │
│  · IPsec AH协议号：51                                │
│  · IKEv2端口：UDP 500/4500                          │
│                                                     │
│  · WireGuard代码量：~4000行                         │
│  · OpenVPN代码量：~100000行                          │
│  · IPsec(StrongSwan)：~400000行                     │
│                                                     │
│  · TCP三次握手：SYN → SYN+ACK → ACK                 │
│  · SYN Cookie：无状态握手（加密时间戳记录）            │
│                                                     │
│  · DMZ设计原则：入站限特定服务，对内部严格限制         │
│  · NAC健康检查：5+项目（防毒、补丁、防火墙、加密等）   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 五、模拟测验（15题）

### 📝 单选题

**1. ARP欺骗攻击利用了ARP协议的什么特点？**

A. ARP使用强加密
B. ARP是无状态的、无认证的，会无条件接受ARP响应
C. ARP工作在应用层
D. ARP需要TCP连接

<details><summary>答案</summary>

**B** — ARP协议设计时就假设局域网是可信的，无状态无认证，无条件更新ARP缓存。
</details>

---

**2. SYN Cookie技术的核心原理是？**

A. 增加服务器内存来存储更多半连接
B. 不在服务器端存储半连接状态，将状态信息加密编码到SYN-ACK中
C. 使用防火墙过滤所有SYN包
D. 客户端计算Cookie验证身份

<details><summary>答案</summary>

**B** — SYN Cookie将连接状态加密编码在返回的SYN-ACK的序列号中，客户端ACK回来时解码验证，无需维护半连接队列。
</details>

---

**3. 以下哪项是NGFW区别于传统防火墙的标志性能力？**

A. 状态检测
B. 包过滤
C. 不论端口识别应用
D. NAT转换

<details><summary>答案</summary>

**C** — NGFW的核心能力是不依赖端口号识别应用（如识别走443端口的任何应用），并支持基于应用和用户的安全策略。
</details>

---

**4. Snort规则中，哪种动作会丢弃数据包而不通知发送方？**

A. alert
B. pass
C. drop
D. reject

<details><summary>答案</summary>

**C** — drop静默丢弃数据包，reject丢弃并发送TCP RST或ICMP Port Unreachable通知发送方。
</details>

---

**5. IPS与IDS最核心的区别是？**

A. IDS支持签名检测，IPS不支持
B. IDS旁路部署不阻断流量，IPS串联部署可实时阻断
C. 两者功能完全相同
D. IDS比IPS更贵

<details><summary>答案</summary>

**B** — IDS通过SPAN/TAP被动获取流量只能告警，IPS串联在网络中可实时丢弃恶意流量。
</details>

---

**6. WPA3 SAE握手相比WPA2 PSK的最大安全改进是？**

A. 更快的连接速度
B. 抗离线字典攻击（每次猜测需与AP交互）
C. 支持更多设备
D. 不需要密码

<details><summary>答案</summary>

**B** — SAE使用Dragonfly密钥交换（PAKE），攻击者每次密码猜测都必须与AP在线交互，无法离线暴力破解。
</details>

---

**7. 哪种VPN协议代码量最小（约4000行），审计最为便利？**

A. IPsec
B. OpenVPN
C. WireGuard
D. L2TP

<details><summary>答案</summary>

**C** — WireGuard以其极简设计著称，仅约4000行代码，远小于IPsec和OpenVPN。
</details>

---

**8. VLAN跳跃攻击中，"Double Tagging"方法要求攻击者接入的VLAN等于什么？**

A. 管理VLAN
B. 任何Trunk端口
C. Native VLAN
D. 默认网关

<details><summary>答案</summary>

**C** — Double Tagging攻击只有在攻击者的接入VLAN等于Trunk的Native VLAN时才能成功。
</details>

---

**9. 零信任架构的核心理念是？**

A. 内网就是安全的
B. 永不信任，始终验证
C. 防火墙隔离就够了
D. VPN就是零信任

<details><summary>答案</summary>

**B** — "Never Trust, Always Verify"是零信任的核心理念，不论网络位置，每次访问都需要验证。
</details>

---

**10. IPsec ESP协议在隧道模式下保护范围是？**

A. 仅数据部分
B. 仅IP头
C. 整个原始IP包（IP头+数据）
D. 仅端口号

<details><summary>答案</summary>

**C** — 隧道模式下，ESP将整个原始IP包（包括原始IP头）加密，并添加新的IP头。
</details>

---

### 📝 判断题

**11. 交换机部署Port Security可以有效防御MAC泛洪攻击。**
<details><summary>答案</summary>✅ 正确 — Port Security限制每端口允许的MAC地址数量，超过则触发违规动作。</details>

**12. WEP的IV长度为48位，足够安全。**
<details><summary>答案</summary>❌ 错误 — WEP的IV仅24位（约1670万），在繁忙网络中数小时内就会循环重复。</details>

**13. DNSSEC加密了DNS查询，防止窃听。**
<details><summary>答案</summary>❌ 错误 — DNSSEC仅提供数据来源认证和完整性，不提供机密性。加密DNS需要用DNS over TLS/HTTPS。</details>

**14. 微分段可以将安全策略细化到单个工作负载级别，即使在同一VLAN内。**
<details><summary>答案</summary>✅ 正确 — 微分段的核心价值就是在同一网络段内实现主机级别的访问控制。</details>

**15. WPA3的OWE技术让开放Wi-Fi网络也能自动加密。**
<details><summary>答案</summary>✅ 正确 — OWE使用DH密钥交换为开放网络提供加密，用户无需密码即可享受加密保护。</details>

---

## 六、网络安全防护体系总结

```
纵深防御（Defense in Depth） — 网络安全维度：

  Layer 1 — 边界防护
    └─ 防火墙 (NGFW) + DMZ设计

  Layer 2 — 网络检测
    └─ IDS/IPS + NDR + NetFlow分析

  Layer 3 — 安全通信
    └─ VPN (IPsec/SSL/WireGuard) + TLS

  Layer 4 — 网络分段
    └─ VLAN + 微分段 + 零信任/SDP

  Layer 5 — 接入控制
    └─ 802.1X + NAC + 无线WIPS

  Layer 6 — 监控响应
    └─ SIEM + SOAR + 日志审计

关键词：
  "边界是不够的，需要全程纵深的可见性"
```

---

## 七、下周预览

### Week 8：应用安全

```
Day 50 → Web安全基础（OWASP Top 10概述，HTTP安全头）
Day 51 → SQL注入深入（盲注、二次注入、绕过技术）
Day 52 → XSS深入（DOM XSS、CSP防御、mXSS）
Day 53 → CSRF攻击（Token防御、SameSite Cookie）
Day 54 → 文件上传漏洞（绕过技术、恶意文件检测）
Day 55 → 安全编码实践（输入验证、输出编码、SAST）
Day 56 → 第八周总结与测验
```

---

## 八、学习进度检查

```
✅ Week 1：信息安全基础 (Day 1-7)           ████████ 完成
✅ Week 2：信息安全法规 (Day 8-14)          ████████ 完成
✅ Week 3：访问控制 (Day 15-21)              ████████ 完成
✅ Week 4：安全运营 (Day 22-28)              ████████ 完成
✅ Week 5：漏洞与攻击 (Day 29-35)            ████████ 完成
✅ Week 6：加密技术 (Day 36-42)              ████████ 完成
✅ Week 7：网络安全 (Day 43-49)              ████████ 完成
⬜ Week 8：应用安全 (Day 50-56)              ░░░░░░░░ 待学习
⬜ Week 9：物理安全 (Day 57-63)              ░░░░░░░░ 待学习
⬜ Week 10：安全工程 (Day 64-70)             ░░░░░░░░ 待学习
⬜ Week 11：业务安全 (Day 71-77)             ░░░░░░░░ 待学习
⬜ Week 12：模拟考试 (Day 78-84)             ░░░░░░░░ 待学习

────────────────────────────────────────────
总体进度：49/84 (58%)
```

---

> **🎯 Week 7完成！** 网络安全是CISP考试的高频考点。继续前进，下周将学习应用安全——OWASP Top 10、SQL注入、XSS、CSRF等Web安全核心技术。
