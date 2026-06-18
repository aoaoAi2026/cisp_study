# Day 11：VPN与远程安全接入

> 🎯 面试目标：掌握IPSec/SSL VPN原理、零信任远程接入架构，能流畅回答VPN相关面试题

## 知识速览

### 核心概念
- **IPSec VPN**：网络层加密协议，通过AH(认证头)和ESP(封装安全载荷)提供机密性+完整性+抗重放，工作于传输模式/隧道模式
- **SSL/TLS VPN**：应用层VPN，通过HTTPS隧道传输内网流量，部署简便但性能略低于IPSec，适合移动办公场景
- **零信任远程接入(ZTNA)**：不再基于网络位置信任，每次访问都需认证授权，SDP(软件定义边界)是其核心实现
- **VPN split-tunneling**：分流隧道技术，只将内网流量走VPN，外网直连，减轻VPN网关压力
- **WireGuard**：新一代VPN协议，代码量仅4000行，基于Noise协议框架+Curve25519，性能远超OpenVPN/IPSec

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| IPSec VPN 和 SSL VPN 的本质区别是什么？分别在什么场景选用？ | IPSec工作在网络层(第3层)，SSL工作于传输层之上(第4-7层)。IPSec适合站点到站点(site-to-site)互联、对性能要求高的场景；SSL适合移动办公、BYOD、不需要安装客户端的场景。面试要强调：IPSec需配置IKE策略+IPSec策略，SSL只需浏览器即可。 |
| 零信任对传统VPN有什么冲击？ | 传统VPN模型是'城墙模式'——进入内网即信任一切，零信任是'机场安检模式'——每个资源访问都要验证。核心变化：从'网络中心'变为'身份中心'，最小权限原则，持续验证，假设已被入侵。面试时能讲清楚BeyondCorp/Google零信任架构会加分。 |
| VPN 隧道建立过程中 IKEv2 的关键步骤？ | IKEv2四步：①IKE_SA_INIT(协商加密算法+Diffie-Hellman交换) → ②IKE_AUTH(证书/PSK认证+生成第一对Child SA) → ③CREATE_CHILD_SA(后续隧道协商) → ④INFORMATIONAL(keepalive+错误通知)。相比IKEv1，IKEv2减少了一半报文，支持MOBIKE(IP切换不断连)。 |
| 远程接入中如何防御中间人攻击？ | 1)证书绑定(Certificate Pinning)防止伪造证书 2)双向TLS认证 3)MFA多因素认证(密码+Token+生物特征) 4)持续设备健康检查(是否安装EDR、系统补丁状态) 5)网络微隔离——即使用户接入也不给过大权限 |
| 介绍一下Split-tunneling的安全风险和应对 | 主要风险：外网流量不受VPN保护可能被劫持、DNS泄露、本地网络攻击面暴露。应对：配置明确的内网路由表、强制DNS走VPN隧道(DNS over VPN)、启用本地防火墙规则阻止非必要出站流量。 |

### 技术细节
**IPSec隧道建立(简化流程)**：
1. 发起方发送支持的加密/哈希/DH算法列表
2. 响应方选择匹配的算法组合
3. Diffie-Hellman密钥交换 → 生成共享密钥
4. IKE SA建立(双向认证：证书或PSK)
5. 基于IKE SA协商IPSec SA → 确定ESP/AH参数
6. 数据通过ESP加密传输

**面试代码演示思路**：可以用StrongSwan/Libreswan搭建IPSec隧道，或用WireGuard快速搭建VPN(一个配置文件即可)，面试时提及实际操作经验比纯理论更打动人。WireGuard配置核心字段：
```ini
[Interface]
PrivateKey = <client_private_key>
Address = 10.0.0.2/24
DNS = 10.0.0.1

[Peer]
PublicKey = <server_public_key>
Endpoint = vpn.example.com:51820
AllowedIPs = 10.0.0.0/24
```


## 常见陷阱
- ⚠️ 混淆IPSec的AH和ESP——AH只做认证不做加密，ESP可做加密+认证，面试中答反会减分
- ⚠️ 认为VPN就是绝对安全——需补充说明：VPN只保护传输过程，终端安全(恶意软件、数据泄露)仍需其他措施
- ⚠️ 忽视IKEv1的安全缺陷——IKEv1 aggressive mode可能泄露PSK哈希，已被IKEv2替代，面试中提及说明你关注安全演进

## 今日检测
1. 画图对比IPSec传输模式和隧道模式的包结构差异
2. 用Wireshark抓取一个IPSec ESP包，分析其加密特征
3. 调研你目标公司使用的远程接入方案(如Pulse Secure/Cisco AnyConnect/Cloudflare Access)，准备一段你对它的理解
