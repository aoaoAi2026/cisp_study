# 第八章：Hashcat - GPU密码破解神器

## 8.1 Hashcat 简介

### 什么是 Hashcat？

想象你有一台超级计算机，能够同时尝试数百万个密码。**Hashcat**就是这样的工具——利用GPU进行超高速密码破解。

**Hashcat**号称世界上最快的密码破解工具：
- 支持GPU加速
- 支持CPU多核
- 支持数百种哈希类型
- 支持多种攻击模式

简单来说，Hashcat是**现代密码破解的王者**。

### Hashcat与John的区别

| 工具 | 破解方式 | 速度 | 适用场景 |
|------|------|------|----------|
| John | CPU | 每秒几万 | 小规模破解 |
| Hashcat | GPU | 每秒数十亿 | 大规模破解 |

---

## 8.2 系统要求与显卡驱动安装

### 系统要求

| 要求 | 说明 |
|------|------|
| GPU | NVIDIA/AMD/Intel显卡 |
| CPU | 支持多核破解 |
| 内存 | 至少4GB |
| 显卡驱动 | 最新版本 |

### NVIDIA显卡驱动安装

**Windows：**
访问NVIDIA官网下载驱动。

**Linux：**
```bash
sudo apt install nvidia-driver
```

验证安装：
```bash
nvidia-smi
```

---

## 8.3 Windows 系统安装教程

### 下载安装

1. 访问：https://hashcat.net/hashcat/
2. 下载Windows版本
3. 解压到固定目录

### 目录结构

```
hashcat/
├── hashcat.exe       # 主程序
├── kernels/          # GPU内核
├── charsets/         # 字符集
└── masks/            # Mask模板
```

### 性能测试

```batch
hashcat.exe -b
```

进行基准测试，显示各哈希的破解速度。

---

## 8.4 Linux 系统安装教程

### Kali Linux（预装）

Kali预装Hashcat：
```bash
hashcat -b
```

### Ubuntu/Debian 安装

```bash
sudo apt install hashcat
```

### 源码安装

```bash
git clone https://github.com/hashcat/hashcat.git
cd hashcat
make
sudo make install
```

---

## 8.5 Hash类型详解

### 查看所有Hash类型

```bash
hashcat --help | grep "Hash Type"
```

### 常用Hash类型

| Hash模式 | 类型 | 说明 |
|------|------|------|
| 0 | MD5 | 最常见 |
| 100 | SHA1 | 常见 |
| 1000 | NTLM | Windows密码 |
| 1400 | SHA256 | 常见 |
| 1700 | SHA512 | 常见 |
| 3000 | LM | Windows旧密码 |
| 5600 | NetNTLMv2 | Windows网络认证 |
| 3200 | bcrypt | 安全密码 |
| 10000 | Django PBKDF2 | Django框架 |
| 10500 | PDF 1.4-1.6 | PDF密码 |
| 11600 | 7-Zip | 7z密码 |
| 12500 | RAR3-hp | RAR密码 |
| 13000 | RAR5 | RAR5密码 |
| 13600 | WinZip | ZIP密码 |
| 22000 | WPA-PBKDF2-PMKID | WiFi密码 |
| 22001 | WPA-PMK-PMKID | WiFi密码 |

### 指定Hash类型

```bash
hashcat -m 0 hash.txt wordlist.txt
```

`-m 0`表示MD5。

---

## 8.6 基础破解命令详解

### 基本命令结构

```bash
hashcat -m MODE -a ATTACK hash.txt wordlist.txt
```

### 常用参数

| 参数 | 说明 |
|------|------|
| -m | Hash类型 |
| -a | 攻击模式 |
| -o | 输出文件 |
| --force | 强制运行 |
| -d | 设备选择 |
| -w | 工作负载 |
| --show | 显示已破解 |

### 示例

**字典攻击MD5：**
```bash
hashcat -m 0 -a 0 hash.txt wordlist.txt
```

**暴力攻击MD5：**
```bash
hashcat -m 0 -a 3 hash.txt
```

---

## 8.7 字典攻击详解

### 字典攻击模式（-a 0）

```bash
hashcat -m 0 -a 0 hash.txt wordlist.txt
```

### 字典文件

常用字典：
| 字典 | 位置 |
|------|------|
| rockyou.txt | Kali: /usr/share/wordlists/ |
| crackstation.txt | 网络下载 |

### 解压字典

Kali的rockyou需要解压：
```bash
gzip -d /usr/share/wordlists/rockyou.txt.gz
```

---

## 8.8 组合攻击详解

### 组合攻击模式（-a 1）

将两个字典组合：
```bash
hashcat -m 0 -a 1 hash.txt dict1.txt dict2.txt
```

字典1和字典2的每个词都会组合。

---

## 8.9 Mask攻击详解

### Mask攻击模式（-a 3）

暴力破解特定格式的密码。

**Mask语法：**

| 字符 | 说明 | 范围 |
|------|------|------|
| ?l | 小写字母 | abcdefghijklmnopqrstuvwxyz |
| ?u | 大写字母 | ABCDEFGHIJKLMNOPQRSTUVWXYZ |
| ?d | 数字 | 0123456789 |
| ?s | 特殊字符 | «space»!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~ |
| ?a | 所有字符 | ?l?u?d?s |
| ?b | 二进制 | 0x00-0xff |

### Mask示例

**破解6位数字密码：**
```bash
hashcat -m 0 -a 3 hash.txt '?d?d?d?d?d?d'
```

**破解8位小写字母：**
```bash
hashcat -m 0 -a 3 hash.txt '?l?l?l?l?l?l?l?l'
```

**破解常见密码格式（字母+3数字）：**
```bash
hashcat -m 0 -a 3 hash.txt '?l?l?l?l?l?d?d?d'
```

### 自定义字符集

```bash
hashcat -m 0 -a 3 hash.txt -1 '?l?d' '?1?1?1?1?1?1'
```

`-1`定义自定义字符集1，包含小写字母和数字。

---

## 8.10 规则文件详解

### 什么是规则？

规则对字典中的密码进行变换：
- 大小写变换
- 数字添加
- 字符替换

### 使用规则

```bash
hashcat -m 0 -a 0 hash.txt wordlist.txt -r rules/best64.rule
```

### 常用规则

| 规则文件 | 说明 |
|------|------|
| best64.rule | 最常用规则 |
| OneRuleToRuleThemAll.rule | 大型规则 |

### 规则语法示例

| 规则 | 说明 |
|------|------|
| : | 不改变 |
| l | 转小写 |
| u | 转大写 |
| c | 首字母大写 |
| r | 反转 |
| $1 | 后面加1 |
| ^1 | 前面加1 |
| sa@ | a替换为@ |

---

## 8.11 实战案例：NTLM Hash破解

### 获取NTLM Hash

使用工具（如mimikatz）提取Windows密码哈希。

### 破解NTLM

```bash
hashcat -m 1000 -a 0 hash.txt wordlist.txt
```

### 破解结果

```bash
hashcat -m 1000 --show hash.txt
```

---

## 8.12 实战案例：WiFi密码破解

### 获取WiFi Handshake

使用aircrack-ng捕获WiFi握手包：
```bash
aircrack-ng capture.cap -J hash.hccap
```

### 破解WiFi密码

```bash
hashcat -m 22000 hash.hccap wordlist.txt
```

---

## 8.13 实战案例：Office文件破解

### 获取Office Hash

使用office2john提取哈希（John工具）：
```bash
office2john document.xlsx > hash.txt
```

### 破解密码

```bash
hashcat -m 9600 hash.txt wordlist.txt
```

---

## 总结

本章介绍了Hashcat的使用：

1. **安装配置**：GPU驱动、各系统安装
2. **Hash类型**：数百种Hash格式
3. **攻击模式**：字典、组合、Mask
4. **规则文件**：密码变换规则
5. **实战案例**：NTLM、WiFi、Office破解

Hashcat是现代密码破解的必备工具，GPU加速让破解速度大幅提升。

下一章我们将学习Hydra——在线密码爆破工具！