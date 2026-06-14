#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate 28 cyber-learning/basic/ articles (days 3-30).
Each file is 550+ lines with real technical content, CVE numbers, and commands.
Uses programmatic content generation to keep script size manageable.
"""
import os

DIR = r'E:\internal_safe\cisp1\cisp\public\contents\cyber-learning\basic'
os.makedirs(DIR, exist_ok=True)

# ─── Content Templates ───
def sec(title, anchor, body):
    return (title, anchor, body)

def make_article(day, title, diff, mins, desc, sections, exams, mnems, traps, advices, quote):
    """Assemble a complete article from structured parts."""
    nav = '\n'.join(f'- [{s[0]}](#{s[1]})' for s in sections)
    body = '\n\n---\n\n'.join(s[2] for s in sections)
    ep = '\n'.join(f'| {i+1} | {e[0]} | {e[1]} | {e[2]} | {e[3]} |' for i,e in enumerate(exams))
    mn = '\n\n'.join(f'#### {i+1}. {m[0]}\n> **"{m[1]}"** — {m[2]}\n>\n> {m[3]}' for i,m in enumerate(mnems))
    tr = '\n'.join(f'| {t[0]} | {t[1]} |' for t in traps)
    ad = '\n'.join(f'{i+1}. {a}' for i,a in enumerate(advices))
    
    content = f'''# Day {day}：{title}

> **📘 文档定位**：CISP 考试核心基础 | 难度：{diff} | 预计阅读：{mins} 分钟
>
> {desc}

---

## 导航目录

{nav}
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

{body}

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
{ep}

### 💡 知识巧记口诀

{mn}

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
{tr}

---

## 学习建议

{ad}

---

> {quote}
'''
    path = os.path.join(DIR, f'day-{day}.md')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    lines = content.count('\n') + 1
    print(f'  day-{day}.md: {lines} lines')
    return lines

total = 0

# ═══════════════════════════════════════════
# DAY 3: 常见端口与服务
# ═══════════════════════════════════════════
total += make_article(3,
    '常见端口与服务',
    '入门', '35',
    '端口是网络通信的逻辑端点，每个网络服务都绑定在特定端口上。理解常见端口及其对应服务，是端口扫描识别、防火墙规则配置、服务加固的基础。本章系统梳理 TCP/UDP 常用端口、服务识别方法、端口安全加固实践，以及端口相关的攻击与防御。',
    [
        sec('一、端口基础概念', '一端口基础概念', '''## 一、端口基础概念

### 1.1 什么是端口

端口（Port）是传输层协议（TCP/UDP）用于标识特定应用程序或服务的16位数字标识符。一个IP地址可以有65536个端口（0-65535），每个端口可以绑定一个服务进程。

**端口的本质**：端口 = 进程的网络门牌号。当数据包到达主机后，操作系统通过目的端口号将数据交付给对应的应用程序。

```
IP地址 : 端口号  →  唯一标识一个网络通信端点（Socket）
192.168.1.5 : 80  →  Web 服务器
192.168.1.5 : 22  →  SSH 服务
192.168.1.5 : 3306 → MySQL 数据库
```

### 1.2 端口号分类

| 范围 | 类别 | 说明 | 示例 |
|:---|:---|:---|:---|
| **0-1023** | 熟知端口（Well-known Ports） | 由 IANA 分配，系统级服务使用，需要 root 权限绑定 | 80(HTTP), 443(HTTPS), 22(SSH), 53(DNS) |
| **1024-49151** | 注册端口（Registered Ports） | 由 IANA 注册，应用程序可使用 | 3306(MySQL), 5432(PostgreSQL), 8080(HTTP-alt), 6379(Redis) |
| **49152-65535** | 动态/私有端口（Dynamic Ports） | 客户端临时使用，操作系统自动分配 | 浏览器发起连接时的源端口 |

> **🔑 高分考点**：熟知端口 0-1023 在 Linux 下只有 root 才能绑定，这是安全机制——防止普通用户伪装成系统服务。

### 1.3 端口与协议的绑定关系

一个端口可以同时被 TCP 和 UDP 使用，因为它们是不同的协议：

```bash
# 同一个端口号，TCP 和 UDP 可以各自独立绑定
# 例如 DNS 同时使用 TCP/53 和 UDP/53
ss -tlnp | grep :53    # TCP 53 (DNS 区域传输)
ss -ulnp | grep :53    # UDP 53 (DNS 查询)
```'''),
        sec('二、TCP 常用端口详解', '二tcp-常用端口详解', '''## 二、TCP 常用端口详解

### 2.1 Web 服务端口

| 端口 | 服务 | 协议 | 说明 | 安全风险 |
|:---:|:---|:---|:---|:---|
| **80** | HTTP | TCP | 超文本传输协议，明文传输 | 明文嗅探、中间人攻击 |
| **443** | HTTPS | TCP | HTTP over TLS/SSL，加密传输 | 证书伪造、降级攻击（SSL Stripping） |
| **8080** | HTTP-alt | TCP | HTTP 代理/备用端口 | 常见于开发环境，默认无认证 |
| **8443** | HTTPS-alt | TCP | HTTPS 备用端口 | 同上 |
| **8000** | HTTP-dev | TCP | 开发服务器常用 | Django/Flask 开发服务器默认端口 |
| **9090** | HTTP-mgmt | TCP | Web 管理界面 | Cockpit、Prometheus 等管理面板 |

```bash
# 检测 Web 服务
curl -I http://target:80         # HTTP HEAD 请求
curl -k https://target:8443      # HTTPS（忽略证书验证）
nmap -sV -p 80,443,8080,8443 target  # 服务版本探测
```

### 2.2 远程管理端口

| 端口 | 服务 | 说明 | 安全建议 |
|:---:|:---|:---|:---|
| **22** | SSH | Secure Shell，加密远程管理 | 禁用密码登录，只用密钥；改默认端口；配置 Fail2Ban |
| **23** | Telnet | 明文远程管理（不安全） | 禁用！用 SSH 替代 |
| **3389** | RDP | Windows 远程桌面 | 启用 NLA（网络级认证）；限制来源 IP；改默认端口 |
| **5900** | VNC | 虚拟网络计算 | 使用 VNC over SSH 隧道；设置强密码 |
| **5631** | PCAnywhere | 远程控制 | 已过时，不建议使用 |

```bash
# SSH 安全配置 /etc/ssh/sshd_config
Port 2222                        # 改默认端口
PermitRootLogin no               # 禁止 root 登录
PasswordAuthentication no        # 禁用密码认证
PubkeyAuthentication yes         # 仅允许密钥认证
MaxAuthTries 3                   # 最大尝试次数
```

### 2.3 数据库端口

| 端口 | 数据库 | 默认认证 | 常见漏洞 |
|:---:|:---|:---|:---|
| **3306** | MySQL/MariaDB | 用户名+密码 | CVE-2012-2122（认证绕过）、弱密码爆破 |
| **1433** | Microsoft SQL Server | Windows 认证/SQL 认证 | xp_cmdshell 命令执行、弱 sa 密码 |
| **1521** | Oracle Database | 用户名+密码+SID | TNS Listener 投毒、默认账号 |
| **5432** | PostgreSQL | 用户名+密码 | pg_hba.conf 配置不当、COPY 命令风险 |
| **27017** | MongoDB | 默认无认证（3.0前） | 未授权访问（曾导致大量数据泄露） |
| **6379** | Redis | 默认无认证 | 写 SSH key 获取服务器权限、写 crontab |
| **9200** | Elasticsearch | 默认无认证 | 数据泄露、RCE（CVE-2014-3120） |
| **11211** | Memcached | 无认证 | UDP 放大攻击（放大倍数可达 10000+） |

```bash
# 数据库端口扫描
nmap -sV -p 3306,1433,1521,5432,27017,6379,9200 target

# Redis 未授权访问利用
redis-cli -h target -p 6379
> CONFIG SET dir /root/.ssh
> CONFIG SET dbfilename authorized_keys
> SET key "\\n\\nssh-rsa AAA...\\n\\n"
> SAVE
```

### 2.4 文件传输端口

| 端口 | 服务 | 说明 | 安全性 |
|:---:|:---|:---|:---|
| **21** | FTP 控制 | 文件传输协议（控制通道） | 明文传输密码！用 SFTP/FTPS 替代 |
| **20** | FTP 数据 | 文件传输协议（数据通道） | 主动模式使用 |
| **22** | SFTP | SSH 文件传输 | 安全，推荐使用 |
| **69** | TFTP | 简单文件传输 | 无认证，仅用于网络设备配置传输 |
| **445** | SMB | Windows 文件共享 | 永恒之蓝（CVE-2017-0144）、勒索病毒传播 |
| **139** | NetBIOS | Windows 旧式文件共享 | 信息泄露、已逐步淘汰 |
| **2049** | NFS | 网络文件系统 | 配置不当可导致未授权挂载 |

```bash
# FTP 匿名登录检测
ftp target 21
# 用户名: anonymous，密码: 任意

# SMB 漏洞检测
nmap --script smb-vuln-ms17-010 -p 445 target
```'''),
        sec('三、UDP 常用端口详解', '三udp-常用端口详解', '''## 三、UDP 常用端口详解

### 3.1 核心 UDP 服务端口

| 端口 | 服务 | 说明 | 安全风险 |
|:---:|:---|:---|:---|
| **53** | DNS | 域名解析服务 | DNS 放大攻击、DNS 劫持、DNS 隧道 |
| **67/68** | DHCP | 动态主机配置协议 | DHCP 欺骗（伪造 DHCP 服务器）、DHCP 耗尽攻击 |
| **69** | TFTP | 简单文件传输 | 无认证，可被利用传输恶意文件 |
| **123** | NTP | 网络时间协议 | NTP 放大攻击（monlist 命令，放大 500+ 倍） |
| **161/162** | SNMP | 简单网络管理协议 | SNMPv1/v2 使用 community string（默认 public/private） |
| **514** | Syslog | 系统日志 | 可被利用发送伪造日志 |
| **1900** | SSDP | 简单服务发现协议 | SSDP 反射放大攻击 |
| **5353** | mDNS | 多播 DNS | 信息泄露、欺骗攻击 |

### 3.2 UDP 放大攻击详解

UDP 放大攻击（Amplification Attack）利用无连接的 UDP 协议特点——攻击者伪造受害者 IP 地址，向有放大效应的 UDP 服务发送小请求，服务返回大响应给受害者。

| 协议 | 端口 | 放大倍数 | 利用方法 |
|:---|:---:|:---:|:---|
| **Memcached** | 11211 | 10,000-50,000x | `stats` 命令返回大量数据 |
| **NTP** | 123 | 500-700x | `monlist` 命令（已废弃但仍有设备支持） |
| **DNS** | 53 | 50-70x | `ANY` 查询返回所有记录 |
| **SSDP** | 1900 | 30x | UPnP 设备发现响应 |
| **CLDAP** | 389 | 50x | 无连接 LDAP 查询 |
| **Chargen** | 19 | 100x | 字符生成服务（应禁用） |
| **QOTD** | 17 | 100x | 每日名言服务（应禁用） |

```bash
# 检测 NTP monlist 漏洞
nmap -sU -p 123 --script ntp-monlist target

# 检测 Memcached UDP
nmap -sU -p 11211 --script memcached-info target

# 检测开放 DNS 解析器
nmap -sU -p 53 --script dns-recursion target
dig @target version.bind chaos txt
```'''),
        sec('四、端口扫描技术详解', '四端口扫描技术详解', '''## 四、端口扫描技术详解

### 4.1 Nmap 扫描类型

Nmap 支持多种扫描技术，不同扫描方式适用于不同场景：

| 扫描类型 | 参数 | 原理 | 特点 | 适用场景 |
|:---|:---:|:---|:---|:---|
| **TCP SYN 扫描** | `-sS` | 发送 SYN，收到 SYN+ACK→开放，RST→关闭 | 半开扫描，不完成握手，速度快 | **最常用**，默认扫描方式（root） |
| **TCP Connect 扫描** | `-sT` | 完成完整三次握手 | 日志记录多，无需 root | 非 root 用户使用 |
| **UDP 扫描** | `-sU` | 发送 UDP 包，ICMP Port Unreachable→关闭 | 速度慢，需组合使用 | 发现 UDP 服务 |
| **NULL 扫描** | `-sN` | 不设置任何标志位 | 可绕过部分防火墙 | 探测防火墙规则 |
| **FIN 扫描** | `-sF` | 只设置 FIN 标志 | 同上 | 同上 |
| **Xmas 扫描** | `-sX` | 设置 FIN/URG/PSH | 同上 | 同上 |
| **ACK 扫描** | `-sA` | 只设置 ACK 标志 | 用于探测防火墙规则（有状态/无状态） | 防火墙规则映射 |
| **Window 扫描** | `-sW` | 分析 TCP 窗口大小 | 某些系统窗口大小反映端口状态 | 特定系统 |
| **Idle 扫描** | `-sI zombie` | 利用僵尸主机 IPID 预测 | 完全隐藏扫描方 IP | 隐蔽扫描 |

### 4.2 Nmap 实战命令

```bash
# === 基础扫描 ===
# 快速扫描 Top 1000 端口（默认）
nmap target

# 扫描所有端口（1-65535）
nmap -p- target

# 扫描指定端口
nmap -p 22,80,443,3306,8080 target
nmap -p 1-1024 target

# === 服务版本与 OS 探测 ===
# 服务版本探测
nmap -sV target
nmap -sV --version-intensity 9 target  # 最高强度

# OS 指纹识别
nmap -O target
nmap -O --osscan-guess target         # 猜测 OS

# 综合扫描（最常用）
nmap -sV -sC -O -p- target            # -sC=默认脚本扫描

# === 防火墙/IDS 规避 ===
# 分片扫描
nmap -f target                        # 将包分成小片

# 修改 MTU
nmap --mtu 16 target

# 使用诱饵（Decoy）
nmap -D RND:10 target                 # 随机 10 个诱饵 IP

# 延迟扫描（规避速率检测）
nmap -T2 target                       # 慢速（T0-T5）
nmap --scan-delay 5s target           # 每次探测间隔 5 秒

# === 脚本扫描（NSE）===
# 漏洞检测
nmap --script vuln target
nmap --script smb-vuln-ms17-010 -p 445 target

# 服务枚举
nmap --script http-enum target
nmap --script smb-enum-shares -p 445 target

# 暴力破解
nmap --script ftp-brute -p 21 target

# === 输出格式 ===
nmap -oN output.txt target            # 普通文本
nmap -oX output.xml target            # XML 格式
nmap -oG output.gnmap target          # Grepable 格式
nmap -oA output target                # 所有格式
```

### 4.3 其他端口扫描工具

```bash
# Masscan：极速端口扫描（互联网级）
masscan -p1-65535 --rate=10000 target

# RustScan：快速端口扫描 + Nmap 联动
rustscan -a target -- -sV -sC

# Netcat：手动端口探测
nc -zv target 22
nc -zv target 80-100

# /dev/tcp（Bash 内置）
timeout 1 bash -c "echo >/dev/tcp/target/22" && echo "open"
```'''),
        sec('五、服务识别与 Banner 抓取', '五服务识别与-banner-抓取', '''## 五、服务识别与 Banner 抓取

### 5.1 Banner 抓取方法

Banner 是服务在连接建立后返回的欢迎信息，包含软件名称、版本号等关键信息。

```bash
# Netcat 手动抓取
nc -v target 22        # SSH banner: SSH-2.0-OpenSSH_8.9p1
nc -v target 80        # 发送 HEAD 请求
echo -e "HEAD / HTTP/1.0\\r\\n\\r\\n" | nc target 80

# Telnet 手动抓取
telnet target 25       # SMTP banner

# curl 查看响应头
curl -I http://target

# Nmap 服务探测
nmap -sV --version-intensity 9 -p 22,80,443 target

# amap 服务指纹识别
amap -bqv target 80

# WhatWeb：Web 技术栈识别
whatweb target

# Wappalyzer：浏览器插件，识别 Web 技术栈
```

### 5.2 常见服务 Banner 示例

| 服务 | 端口 | 典型 Banner | 暴露信息 |
|:---|:---:|:---|:---|
| SSH | 22 | `SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6` | 协议版本、软件、OS |
| HTTP | 80 | `Server: Apache/2.4.41 (Ubuntu)` | Web 服务器及版本 |
| SMTP | 25 | `220 mail.example.com ESMTP Postfix` | 邮件服务器 |
| FTP | 21 | `220 ProFTPD 1.3.5 Server` | FTP 服务器及版本 |
| MySQL | 3306 | `5.7.38-0ubuntu0.18.04.1` | 数据库版本 |

> **🔑 高分考点**：隐藏 Banner 是安全加固的基本操作，可增加攻击者的信息收集难度，但不能依赖于此作为安全措施（Security by Obscurity）。

### 5.3 服务 Banner 隐藏

```bash
# Apache: 修改 ServerTokens 和 ServerSignature
# /etc/apache2/conf-available/security.conf
ServerTokens Prod        # 只返回 "Apache"
ServerSignature Off      # 不显示版本信息

# Nginx: 修改 server_tokens
# /etc/nginx/nginx.conf
server_tokens off;       # 不显示版本号

# SSH: 修改 Banner（/etc/ssh/sshd_config）
# Banner /etc/issue.net  （但注意会暴露自定义信息）

# 验证
curl -I http://target | grep Server
```'''),
        sec('六、端口安全加固实践', '六端口安全加固实践', '''## 六、端口安全加固实践

### 6.1 最小化开放端口原则

**原则**：只开放业务必需的端口，关闭所有不必要的服务。

```bash
# === Linux 端口管理 ===
# 查看所有监听端口及对应进程
ss -tlnp
ss -ulnp

# 查看所有网络连接
netstat -tunap

# 查看防火墙规则
iptables -L -n -v
ufw status              # Ubuntu
firewall-cmd --list-all # CentOS/RHEL

# === 关闭不必要的服务 ===
# systemd
systemctl list-units --type=service --state=running
systemctl stop telnet.socket
systemctl disable telnet.socket

# 查找并关闭可疑进程
lsof -i -P -n | grep LISTEN
```

### 6.2 防火墙端口策略

```bash
# === iptables 白名单策略 ===
# 默认拒绝所有入站
iptables -P INPUT DROP
# 允许已建立的连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
# 允许 SSH（仅特定来源 IP）
iptables -A INPUT -p tcp --dport 22 -s 10.0.0.0/8 -j ACCEPT
# 允许 HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# === ufw（Ubuntu）===
ufw default deny incoming
ufw default allow outgoing
ufw allow from 10.0.0.0/8 to any port 22
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# === firewalld（CentOS/RHEL）===
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

### 6.3 端口安全最佳实践

1. **定期端口审计**：每月扫描对外开放端口，清理不再使用的服务
   ```bash
   nmap -sV -p- localhost  # 本地扫描
   nmap -sV -p- --open target  # 仅显示开放端口
   ```
2. **修改默认端口**：将 SSH 从 22 改为其他端口（如 2222），减少自动化扫描命中率
3. **限制来源 IP**：对管理端口（SSH、RDP、数据库）使用 IP 白名单
4. **使用 VPN/堡垒机**：管理端口不直接暴露在公网
5. **关闭不需要的 UDP 服务**：Chargen(19)、QOTD(17)、Echo(7) 等应禁用
6. **配置 Fail2Ban**：对 SSH、Web 登录等实施暴力破解防护
   ```bash
   apt install fail2ban
   # /etc/fail2ban/jail.local
   [sshd]
   enabled = true
   maxretry = 3
   bantime = 3600
   ```'''),
        sec('七、端口相关的攻击技术', '七端口相关的攻击技术', '''## 七、端口相关的攻击技术

### 7.1 基于端口的常见攻击

| 攻击类型 | 目标端口 | 攻击原理 | 真实案例 |
|:---|:---:|:---|:---|
| **永恒之蓝** | 445 (SMB) | 利用 SMBv1 漏洞实现 RCE | WannaCry 勒索软件（CVE-2017-0144） |
| **Redis 未授权** | 6379 | 无认证直接访问，写入 SSH key | 大量云服务器被入侵挖矿 |
| **MongoDB 勒索** | 27017 | 无认证访问，删除数据后索要赎金 | 2017年 MongoDB 勒索潮 |
| **Elasticsearch 攻击** | 9200 | 未授权访问导致数据泄露/RCE | CVE-2014-3120 |
| **Hadoop YARN RCE** | 8088 | 未授权提交任务执行命令 | 云服务器被入侵挖矿 |
| **Docker API 未授权** | 2375/2376 | 未授权访问 Docker Remote API | 容器逃逸、主机控制 |
| **Jenkins RCE** | 8080 | 未授权 Script Console 执行 Groovy | CVE-2018-1000861 |
| **Rsync 未授权** | 873 | 未授权文件同步 | 敏感文件泄露 |

### 7.2 端口转发与隧道技术

```bash
# SSH 本地端口转发（将远程端口映射到本地）
ssh -L 3306:db-server:3306 user@jump-host
# 本地访问 localhost:3306 = 通过跳板机访问 db-server:3306

# SSH 远程端口转发（将本地端口暴露到远程）
ssh -R 8080:localhost:80 user@public-server
# 访问 public-server:8080 = 访问本地 localhost:80

# SSH 动态端口转发（SOCKS 代理）
ssh -D 1080 user@jump-host
# 配置浏览器 SOCKS 代理 127.0.0.1:1080

# 端口转发工具
# socat: TCP 端口转发
socat TCP-LISTEN:8080,fork TCP:internal-host:80

# iptables NAT 转发
iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 10.0.0.5:80
```

### 7.3 后门端口检测

```bash
# 检查异常监听端口
ss -tlnp | grep -v "127.0.0.1"

# 检查非标准端口上的已知服务
# 例如 HTTP 服务跑在非 80/443 端口
nmap -sV -p- --open target | grep -E "http|ssh|mysql"

# 检查出站连接（C2 通信）
ss -tnp state established | grep -v ":22\|:80\|:443"

# 使用 lsof 关联进程和网络连接
lsof -i -P -n | grep -v "127.0.0.1"
```'''),
        sec('八、端口监控与告警', '八端口监控与告警', '''## 八、端口监控与告警

### 8.1 实时端口监控

```bash
# watch 定期检查端口变化
watch -n 5 'ss -tlnp | sort'

# 使用 diff 对比端口快照
ss -tlnp > /tmp/ports_before.txt
# ... 等待一段时间 ...
ss -tlnp > /tmp/ports_after.txt
diff /tmp/ports_before.txt /tmp/ports_after.txt

# 使用 auditd 监控关键端口
auditctl -w /etc/ssh/sshd_config -p wa -k sshd_config_change

# 使用 OSSEC/Wazuh 进行文件完整性监控
# 配置监控 /etc/services、防火墙规则文件
```

### 8.2 端口安全自动化

```python
#!/usr/bin/env python3
"""端口安全监控脚本 - 检测新增监听端口"""
import subprocess
import json
import hashlib
import time

def get_listening_ports():
    """获取当前所有监听端口"""
    result = subprocess.run(
        ['ss', '-tlnp'],
        capture_output=True, text=True
    )
    return result.stdout

def hash_ports(data):
    """计算端口状态哈希"""
    return hashlib.sha256(data.encode()).hexdigest()

def monitor_ports(interval=60):
    """持续监控端口变化"""
    baseline = get_listening_ports()
    baseline_hash = hash_ports(baseline)
    print(f"[*] Baseline hash: {baseline_hash[:16]}...")
    print(f"[*] Monitoring every {interval}s...")
    
    while True:
        time.sleep(interval)
        current = get_listening_ports()
        current_hash = hash_ports(current)
        
        if current_hash != baseline_hash:
            print(f"[!] ALERT: Port state changed!")
            print(f"    Old hash: {baseline_hash[:16]}...")
            print(f"    New hash: {current_hash[:16]}...")
            print(f"    Diff:")
            # 简单对比
            old_lines = set(baseline.split('\\n'))
            new_lines = set(current.split('\\n'))
            added = new_lines - old_lines
            removed = old_lines - new_lines
            for line in added:
                if line.strip():
                    print(f"    [+] NEW: {line}")
            for line in removed:
                if line.strip():
                    print(f"    [-] REMOVED: {line}")
            baseline = current
            baseline_hash = current_hash

if __name__ == '__main__':
    monitor_ports(interval=30)
```

### 8.3 SIEM 端口告警规则

```bash
# Splunk 搜索：检测新端口监听
index=os sourcetype=netstat 
| stats earliest(_time) as first_seen by host port process
| where first_seen > relative_time(now(), "-1h")

# ELK 告警：检测敏感端口开放
# Elasticsearch Watcher 规则
# 当 22(SSH)/3389(RDP)/3306(MySQL) 从内网变为公网监听时触发
```'''),
        sec('九、实战：端口安全评估', '九实战端口安全评估', '''## 九、实战：端口安全评估

### 9.1 完整端口评估流程

```bash
# 步骤 1：全端口扫描
nmap -sS -p- -T4 --open -oA full_scan target

# 步骤 2：服务版本探测
nmap -sV --version-intensity 7 -p $(grep open full_scan.gnmap | cut -d/ -f1 | paste -sd,) target

# 步骤 3：漏洞脚本扫描
nmap --script vuln -p 22,80,443,445,3306,6379,8080 target

# 步骤 4：UDP Top 100 端口扫描
nmap -sU --top-ports 100 -T4 target

# 步骤 5：生成报告
nmap -sV -sC -O -p- -oA comprehensive target
```

### 9.2 端口安全加固检查清单

| 检查项 | 命令/方法 | 预期结果 |
|:---|:---|:---|
| 无 Telnet(23) | `ss -tlnp \| grep :23` | 无输出 |
| SSH 禁用密码登录 | `grep PasswordAuthentication /etc/ssh/sshd_config` | `no` |
| SSH 禁用 root 登录 | `grep PermitRootLogin /etc/ssh/sshd_config` | `no` |
| 无默认数据库端口暴露公网 | 外网扫描 3306/1433/27017/6379 | 不应开放 |
| 防火墙默认拒绝策略 | `iptables -L -n` | `Chain INPUT (policy DROP)` |
| 关闭无用 UDP 服务 | `ss -ulnp` | 无 chargen(19)/echo(7)/discard(9) |
| SNMP 使用 v3 | `nmap -sU -p 161 --script snmp-info` | SNMPv3 或关闭 |
| Fail2Ban 运行中 | `systemctl status fail2ban` | active (running) |

### 9.3 常见错误配置与修复

| 错误配置 | 风险 | 修复方法 |
|:---|:---|:---|
| MySQL 绑定 0.0.0.0 | 数据库暴露公网 | 绑定 127.0.0.1 或内网 IP |
| Redis 无密码 | 未授权访问 | `requirepass strong_password` |
| MongoDB 无认证 | 数据泄露/勒索 | 启用认证，绑定内网 IP |
| Docker API 开放 | 容器逃逸 | 使用 TLS 认证，限制访问来源 |
| SNMP community public | 信息泄露 | 使用 SNMPv3 或修改 community string |
| Memcached UDP 开放 | DDoS 放大攻击 | `-U 0` 禁用 UDP |'''),
    ],
    [
        ('端口号分类三段', '⭐⭐⭐⭐⭐', '低', '熟知端口(0-1023)、注册端口(1024-49151)、动态端口(49152-65535)'),
        ('常见 Web 端口', '⭐⭐⭐⭐⭐', '低', 'HTTP=80、HTTPS=443、HTTP-alt=8080、HTTPS-alt=8443'),
        ('常见远程管理端口', '⭐⭐⭐⭐⭐', '低', 'SSH=22、Telnet=23、RDP=3389、VNC=5900'),
        ('常见数据库端口', '⭐⭐⭐⭐⭐', '中', 'MySQL=3306、MSSQL=1433、Oracle=1521、PostgreSQL=5432、Redis=6379、MongoDB=27017'),
        ('常见文件传输端口', '⭐⭐⭐⭐', '中', 'FTP=21/20、SFTP=22、TFTP=69、SMB=445、NFS=2049'),
        ('Nmap SYN 扫描原理', '⭐⭐⭐⭐⭐', '中', '发送SYN→SYN+ACK=开放、RST=关闭；半开扫描，不完成握手'),
        ('Nmap 扫描类型对比', '⭐⭐⭐⭐', '中', 'SYN(-sS)/Connect(-sT)/UDP(-sU)/NULL(-sN)/FIN(-sF)/Xmas(-sX)'),
        ('UDP 放大攻击原理', '⭐⭐⭐⭐⭐', '中', '伪造源IP→向放大服务发小请求→大响应打受害者；Memcached(10000x)/NTP(500x)/DNS(50x)'),
        ('永恒之蓝端口', '⭐⭐⭐⭐', '中', '445(SMB)；CVE-2017-0144；WannaCry 利用'),
        ('Redis 未授权利用', '⭐⭐⭐⭐', '中', '写SSH key/写crontab获取服务器权限'),
        ('端口安全加固原则', '⭐⭐⭐⭐⭐', '中', '最小化开放端口、修改默认端口、限制来源IP、使用VPN/堡垒机'),
        ('Banner 信息泄露', '⭐⭐⭐', '低', 'Banner暴露软件版本→攻击者可针对性利用；隐藏Banner增加难度但不能依赖'),
    ],
    [
        ('端口三段分类', '"0-1023熟知，1024-49151注册，49152-65535动态"', '熟知端口需root绑定、注册端口IANA分配、动态端口临时使用', '记忆：熟知→注册→动态，范围依次增大'),
        ('常见端口速记', '"80 HTTP、443 HTTPS、22 SSH、53 DNS、3306 MySQL、6379 Redis、3389 RDP"', 'Web(80/443)、远程(22/3389)、DNS(53)、数据库(3306/1433/5432/6379/27017)', '分类记忆：Web端口、远程端口、数据库端口、邮件端口'),
        ('Nmap 扫描口诀', '"-sS SYN半开、-sT 全连接、-sU UDP、-sV 版本、-O OS、-sC 默认脚本"', '最常用组合：nmap -sV -sC -O -p- target', '参数记忆：s=scan、V=version、C=script、O=OS'),
        ('UDP 放大攻击', '"源IP伪造，小请求换大响应"', 'Memcached(10000x) > NTP(500x) > DNS(50x) > SSDP(30x)', '利用UDP无连接特性，伪造源IP地址'),
        ('Redis 未授权', '"无密码→写文件→拿权限"', '写SSH authorized_keys 或写crontab计划任务', '防御：requirepass强密码 + bind内网IP'),
    ],
    [
        ('端口越多服务越全', '每个不必要的开放端口都是一个潜在的攻击面，应最小化'),
        ('改端口号就安全了', 'Security by Obscurity，端口扫描可以轻松发现非标准端口上的服务'),
        ('UDP 不重要可以不扫描', '很多关键服务使用UDP（DNS/NTP/SNMP），UDP漏洞同样危险'),
        ('防火墙允许就是安全的', '防火墙只控制网络访问，不能防止应用层攻击（如SQL注入）'),
        ('Nmap 扫描不会被发现', 'Connect扫描(-sT)会完成三次握手，IDS/IPS可以检测到扫描行为'),
        ('关闭端口服务就关了', '确认服务已停止并禁用开机自启：systemctl stop & disable'),
        ('内网端口不需要管理', '内部威胁同样危险，内网也应按最小权限原则管理端口'),
    ],
    [
        '使用 Nmap 对自己的测试环境执行全端口扫描（nmap -sV -sC -O -p- localhost），分析每个开放端口对应的服务',
        '搭建 Redis 未授权访问实验环境，理解攻击原理后实施加固',
        '使用 iptables/ufw 配置白名单防火墙策略，只开放必要端口',
        '使用 tcpdump 抓取一次完整的端口扫描过程，分析攻击者视角',
        '配置 Fail2Ban 保护 SSH 服务，模拟暴力破解验证防护效果',
    ],
    '端口是网络安全的\"门窗\"。知道哪些门窗开着、通向哪里、谁来敲门——这是安全从业者的基本功。定期审查端口，及时关闭不用的服务，这是最简单也最有效的安全措施之一。',
)

print(f'\\nDay 3: OK')

# ═══════════════════════════════════════════
# DAY 4: 常见端口扫描 (extended)
# ═══════════════════════════════════════════
total += make_article(4,
    '常见端口扫描技术',
    '进阶', '40',
    '端口扫描是网络安全中最基础也最重要的侦察技术。通过端口扫描，攻击者可以发现目标系统上运行的服务，安全人员则可以评估自身的攻击面。本章深入讲解 Nmap 的高级扫描技术、防火墙/IDS 规避方法、扫描结果分析以及自动化扫描脚本编写。',
    [
        sec('一、端口扫描原理深入', '一端口扫描原理深入', '''## 一、端口扫描原理深入

### 1.1 TCP 三次握手与端口状态判断

端口扫描利用 TCP 协议的状态机来判断端口状态：

```
发送方                       目标端口(开放)               目标端口(关闭)
  |                              |                           |
  | ---- SYN (Seq=x) ----------> |                           |
  |                              |                           |
  | <--- SYN+ACK (Seq=y,Ack=x+1) |                           |
  |                              |                           |
  | ---- RST ------------------> |                           |
  |                              |                           |
  |                              |        ---- SYN ---------> |
  |                              |                           |
  |                              |        <--- RST ---------- |
```

**端口状态判断逻辑**：
- 收到 SYN+ACK → 端口**开放**（Open）
- 收到 RST → 端口**关闭**（Closed）
- 无响应（超时）→ 端口**过滤**（Filtered，被防火墙拦截）
- 收到 ICMP Unreachable → 端口**过滤**（Filtered）

### 1.2 Nmap 端口状态六种

| 状态 | 含义 | 判断依据 |
|:---|:---|:---|
| **open** | 端口开放，有服务在监听 | 收到 SYN+ACK |
| **closed** | 端口关闭，无服务监听 | 收到 RST |
| **filtered** | 被防火墙/IDS 过滤，无法判断 | 无响应或收到 ICMP 错误 |
| **unfiltered** | 端口可访问但无法确定是否开放 | ACK 扫描收到 RST |
| **open|filtered** | 开放或被过滤（UDP/特殊扫描） | 无响应（无法区分） |
| **closed|filtered** | 关闭或被过滤 | IP ID 空闲扫描结果 |

> **🔑 高分考点**：open|filtered 是 Nmap 最\"模糊\"的状态，出现在 UDP 扫描和 NULL/FIN/Xmas 扫描中——因为无响应既可能表示端口开放（不回复），也可能表示被过滤。

### 1.3 操作系统指纹识别原理

Nmap 的 OS 检测基于 TCP/IP 协议栈指纹（RFC 标准未严格规定的实现差异）：

| 检测维度 | 具体检测内容 | 差异来源 |
|:---|:---|:---|
| **TTL 初始值** | 不同 OS 使用不同初始 TTL | Windows=128, Linux=64, Cisco=255 |
| **TCP Window Size** | 窗口大小初始值不同 | Linux=29200, Windows=65535 |
| **TCP Options** | 选项顺序和内容不同 | MSS, WSopt, SACK, Timestamps 组合 |
| **DF 位** | 是否设置 Don't Fragment 标志 | 不同 OS 策略不同 |
| **IP ID 生成** | IP ID 递增方式 | 全局递增/每连接递增/随机 |
| **ICMP 响应** | ICMP 错误消息格式 | 引用原包数据量不同 |'''),
        sec('二、Nmap 高级扫描技术', '二nmap-高级扫描技术', '''## 二、Nmap 高级扫描技术

### 2.1 NSE 脚本引擎详解

Nmap Scripting Engine (NSE) 是 Nmap 最强大的功能之一，提供 600+ 个内置脚本。

**脚本分类**：

| 分类 | 用途 | 示例脚本 | 命令 |
|:---|:---|:---|:---|
| **auth** | 认证绕过检测 | ftp-anon | `--script auth` |
| **broadcast** | 广播发现 | broadcast-dns-service-discovery | `--script broadcast` |
| **brute** | 暴力破解 | ssh-brute, ftp-brute | `--script brute` |
| **default** | 默认安全扫描 | 综合检测 | `-sC` 或 `--script default` |
| **discovery** | 服务发现 | dns-brute | `--script discovery` |
| **dos** | 拒绝服务测试 | http-slowloris | `--script dos` |
| **exploit** | 漏洞利用 | smb-vuln-ms17-010 | `--script exploit` |
| **fuzzer** | 模糊测试 | dns-fuzz | `--script fuzzer` |
| **intrusive** | 侵入式扫描 | http-sql-injection | `--script intrusive` |
| **malware** | 恶意软件检测 | http-malware-host | `--script malware` |
| **safe** | 安全扫描（无影响） | http-title | `--script safe` |
| **version** | 版本探测 | 各种 -sV 辅助 | `--script version` |
| **vuln** | 漏洞检测 | 各种 CVE 检测 | `--script vuln` |

```bash
# 使用通配符选择脚本
nmap --script "http-*" target          # 所有 HTTP 相关脚本
nmap --script "smb-vuln-*" target      # 所有 SMB 漏洞脚本
nmap --script "not intrusive" target   # 排除侵入式脚本

# 脚本参数传递
nmap --script http-brute --script-args 'userdb=users.txt,passdb=pass.txt' target
```

### 2.2 高级扫描技巧

```bash
# === 隐蔽扫描技术 ===
# Idle 扫描（完全隐藏扫描方 IP）
nmap -sI zombie_host target
# 前提：zombie_host 需要有可预测的 IP ID 递增（如旧式打印机）

# FTP Bounce 扫描（利用 FTP 代理扫描）
nmap -b username:password@ftp-server target

# === 分片与混淆 ===
# IP 分片（将 TCP 头分散到多个包）
nmap -f target
nmap --mtu 8 target          # 自定义 MTU（最小 8）

# 诱饵扫描（混入虚假 IP）
nmap -D 192.168.1.5,192.168.1.10,ME target
nmap -D RND:20 target         # 随机 20 个诱饵

# 源端口欺骗（伪装成常见服务）
nmap --source-port 53 target  # 伪装 DNS 流量
nmap --source-port 80 target  # 伪装 HTTP 流量

# 随机化扫描顺序
nmap --randomize-hosts target_range

# 伪造 MAC 地址
nmap --spoof-mac 00:11:22:33:44:55 target
nmap --spoof-mac Cisco target  # 使用厂商前缀

# === 时间与性能 ===
# 时间模板 T0(Paranoid)-T5(Insane)
nmap -T4 target               # 快速扫描（默认 T3）
nmap -T2 target               # 慢速扫描（规避 IDS）

# 自定义时间参数
nmap --min-rate 100 --max-rate 1000 target
nmap --scan-delay 1s --max-scan-delay 10s target
nmap --host-timeout 30m target
```'''),
        sec('三、防火墙与IDS规避', '三防火墙与ids规避', '''## 三、防火墙与IDS规避

### 3.1 防火墙类型与检测

防火墙主要分为两类：有状态防火墙和无状态防火墙。

| 类型 | 工作原理 | Nmap 检测方法 | 绕过思路 |
|:---|:---|:---|:---|
| **无状态（Stateless）** | 逐包检查，不跟踪连接状态 | ACK 扫描(-sA)：收到 RST=unfiltered | 利用无状态不跟踪连接的特点 |
| **有状态（Stateful）** | 跟踪连接状态，只允许已建立连接的响应 | ACK 扫描：无响应或 ICMP=filtered | 使用已建立连接的特征 |

### 3.2 IDS/IPS 规避技术

```bash
# === 速率控制 ===
# 极慢扫描（每小时几个包）
nmap -T0 --max-parallelism 1 --scan-delay 60s target

# === 流量混淆 ===
# 数据填充（增加包大小）
nmap --data-length 100 target     # 每个包填充 100 字节随机数据

# 错误校验和（部分 IDS 不检查校验和）
nmap --badsum target

# === 协议隧道 ===
# 使用代理链
proxychains nmap -sT target

# 通过 SSH 隧道
ssh -D 1080 user@jump-host
proxychains nmap -sT -Pn target

# === 分片规避 ===
nmap -f target                    # 基本分片
nmap --mtu 16 target             # 极小 MTU（8 字节倍数）
nmap -f -f target                # 双次分片（更碎片化）
```

### 3.3 实战规避策略

```
攻击者规避 IDS/IPS 的层次化策略：

第一层：时间分散
  ├── 慢速扫描（T0/T1）
  ├── 随机延迟
  └── 非工作时间扫描

第二层：流量混淆
  ├── 诱饵 IP（Decoy）
  ├── 源端口伪装（53/80/443）
  ├── MAC 地址伪造
  └── 数据填充

第三层：协议利用
  ├── IP 分片
  ├── Idle 扫描（隐藏真实 IP）
  └── FTP Bounce 代理

第四层：网络层规避
  ├── 代理/VPN/Tor
  ├── 分段扫描（不同来源 IP 扫不同端口）
  └── 分布式扫描
```'''),
        sec('四、扫描结果分析与利用', '四扫描结果分析与利用', '''## 四、扫描结果分析与利用

### 4.1 Nmap 输出格式解析

```bash
# === XML 输出（最适合程序解析）===
nmap -sV -oX scan.xml target

# Python 解析 Nmap XML
```

```python
#!/usr/bin/env python3
"""解析 Nmap XML 输出并提取关键信息"""
import xml.etree.ElementTree as ET

def parse_nmap_xml(xml_file):
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    results = []
    for host in root.findall('host'):
        ip = host.find('address').get('addr')
        
        for port in host.findall('.//port'):
            port_id = port.get('portid')
            protocol = port.get('protocol')
            
            state = port.find('state')
            state_val = state.get('state')
            
            service = port.find('service')
            if service is not None:
                service_name = service.get('name', 'unknown')
                product = service.get('product', '')
                version = service.get('version', '')
            else:
                service_name = 'unknown'
                product = ''
                version = ''
            
            if state_val == 'open':
                results.append({
                    'ip': ip,
                    'port': port_id,
                    'protocol': protocol,
                    'service': service_name,
                    'product': product,
                    'version': version
                })
    
    return results

# 使用示例
results = parse_nmap_xml('scan.xml')
for r in results:
    print(f"{r['ip']}:{r['port']}/{r['protocol']} - {r['service']} {r['product']} {r['version']}")

# 按服务类型分类统计
from collections import Counter
service_count = Counter(r['service'] for r in results)
for svc, count in service_count.most_common():
    print(f"  {svc}: {count}")
```

### 4.2 批量扫描与自动化

```bash
# === 批量扫描 IP 段 ===
# 扫描整个 C 段
nmap -sV -p 22,80,443,3306 192.168.1.0/24

# 从文件读取目标
nmap -iL targets.txt -sV -oA batch_scan

# === 并行扫描 ===
# 使用 GNU Parallel 加速
cat targets.txt | parallel -j 10 nmap -sV -oN results/{}.txt {}

# === 定时扫描任务 ===
# crontab: 每周日凌晨全端口扫描
# 0 2 * * 0 nmap -sV -p- -oA weekly_scan target
```'''),
        sec('五、端口扫描防御技术', '五端口扫描防御技术', '''## 五、端口扫描防御技术

### 5.1 检测端口扫描

```bash
# === 使用 PSAD 检测扫描 ===
# PSAD (Port Scan Attack Detector) 分析 iptables 日志
apt install psad
# 配置 /etc/psad/psad.conf
# EMAIL_ADDRESSES  root@localhost
# HOSTNAME         your-hostname
psad --Sig-update
service psad start

# === 手动检测扫描行为 ===
# 查看大量 SYN_RECV 状态（SYN 扫描特征）
ss -tan state syn-recv | wc -l

# 查看短时间内来自同一 IP 的大量连接
netstat -ant | awk '{print $5}' | sort | uniq -c | sort -rn | head -20

# tcpdump 检测扫描
tcpdump -i eth0 -nn 'tcp[tcpflags] & tcp-syn != 0 and not host 10.0.0.0/8' | head -50
```

### 5.2 防御端口扫描

| 防御层次 | 方法 | 配置示例 |
|:---|:---|:---|
| **网络层** | 防火墙限制连接速率 | `iptables -A INPUT -p tcp --syn -m limit --limit 10/s -j ACCEPT` |
| **网络层** | 黑洞非必要端口 | 关闭所有非必要服务 |
| **主机层** | 修改默认端口 | SSH 改 2222，RDP 改 33890 |
| **主机层** | Port Knocking | 按特定顺序访问端口后才开放 SSH |
| **检测层** | IDS/IPS 规则 | Snort/Suricata 扫描检测规则 |
| **检测层** | 日志分析 | 集中分析防火墙/系统日志 |

### 5.3 Port Knocking 配置

```bash
# knockd 配置示例 /etc/knockd.conf
[openSSH]
    sequence    = 7000,8000,9000
    seq_timeout = 10
    command     = /sbin/iptables -A INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
    tcpflags    = syn

[closeSSH]
    sequence    = 9000,8000,7000
    seq_timeout = 10
    command     = /sbin/iptables -D INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
    tcpflags    = syn

# 使用 knock 客户端
knock target 7000 8000 9000
ssh user@target
knock target 9000 8000 7000  # 关闭
```'''),
        sec('六、自动化扫描脚本开发', '六自动化扫描脚本开发', '''## 六、自动化扫描脚本开发

### 6.1 Python 端口扫描器

```python
#!/usr/bin/env python3
"""多线程端口扫描器"""
import socket
import threading
import argparse
from queue import Queue

class PortScanner:
    def __init__(self, target, ports, threads=100):
        self.target = target
        self.ports = Queue()
        for p in ports:
            self.ports.put(p)
        self.threads = threads
        self.results = []
        self.lock = threading.Lock()
    
    def scan_port(self, port):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex((self.target, port))
            if result == 0:
                try:
                    service = socket.getservbyport(port, 'tcp')
                except:
                    service = 'unknown'
                with self.lock:
                    self.results.append((port, service))
                    print(f'[+] {port}/tcp open - {service}')
            sock.close()
        except:
            pass
    
    def worker(self):
        while not self.ports.empty():
            port = self.ports.get()
            self.scan_port(port)
            self.ports.task_done()
    
    def run(self):
        print(f'[*] Scanning {self.target}...')
        threads = []
        for _ in range(self.threads):
            t = threading.Thread(target=self.worker)
            t.daemon = True
            t.start()
            threads.append(t)
        self.ports.join()
        print(f'[*] Done. {len(self.results)} open ports found.')
        return sorted(self.results)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('target', help='Target IP or hostname')
    parser.add_argument('-p', '--ports', default='1-1024', help='Port range')
    parser.add_argument('-t', '--threads', type=int, default=100)
    args = parser.parse_args()
    
    # 解析端口范围
    ports = []
    for part in args.ports.split(','):
        if '-' in part:
            start, end = map(int, part.split('-'))
            ports.extend(range(start, end+1))
        else:
            ports.append(int(part))
    
    scanner = PortScanner(args.target, ports, args.threads)
    scanner.run()
```

### 6.2 Bash 一键扫描脚本

```bash
#!/bin/bash
# quick-scan.sh - 快速端口扫描脚本

TARGET=$1
OUTDIR="scan_${TARGET}_$(date +%Y%m%d)"
mkdir -p "$OUTDIR"

echo "[*] Quick port scan for $TARGET"
nmap -sS -T4 --top-ports 1000 --open -oA "$OUTDIR/quick" "$TARGET"

echo "[*] Service detection on open ports..."
OPEN_PORTS=$(grep "open" "$OUTDIR/quick.gnmap" | cut -d/ -f1 | paste -sd,)
if [ -n "$OPEN_PORTS" ]; then
    nmap -sV -sC -p "$OPEN_PORTS" -oA "$OUTDIR/services" "$TARGET"
fi

echo "[*] UDP top 100 scan..."
nmap -sU --top-ports 100 -T4 -oA "$OUTDIR/udp" "$TARGET"

echo "[*] Results saved to $OUTDIR/"
```'''),
        sec('七、扫描工具对比与选型', '七扫描工具对比与选型', '''## 七、扫描工具对比与选型

### 7.1 端口扫描工具对比

| 工具 | 速度 | 准确度 | 隐蔽性 | 适用场景 | 特点 |
|:---|:---:|:---:|:---:|:---|:---|
| **Nmap** | 中 | 极高 | 中 | 通用扫描、漏洞检测 | 功能最全面，NSE 脚本引擎 |
| **Masscan** | 极高 | 中 | 低 | 互联网级快速扫描 | 6分钟扫完整个互联网 |
| **Zmap** | 极高 | 中 | 低 | 大规模互联网测量 | 学术研究常用 |
| **RustScan** | 高 | 高 | 中 | 快速端口发现 + Nmap 联动 | 自动调优，3秒扫完65535端口 |
| **Netcat** | 低 | 高 | 高 | 单端口手动探测 | 最基础，无特征 |
| **Unicornscan** | 高 | 中 | 中 | 大规模 UDP/TCP 扫描 | 异步无状态扫描 |

### 7.2 工具选择建议

| 场景 | 推荐工具 | 命令示例 |
|:---|:---|:---|
| 日常渗透测试 | Nmap | `nmap -sV -sC -O -p- target` |
| 大规模资产发现 | Masscan + Nmap | `masscan -p1-65535 --rate=10000 target && nmap -sV -p [open_ports] target` |
| 快速端口发现 | RustScan | `rustscan -a target -- -sV -sC` |
| 隐蔽扫描 | Nmap + 规避参数 | `nmap -sS -T2 -D RND:10 --data-length 50 target` |
| 内网横向扫描 | Nmap + 脚本 | `nmap -sV --script smb-vuln-*,http-* 10.0.0.0/24` |'''),
        sec('八、法律与道德边界', '八法律与道德边界', '''## 八、法律与道德边界

### 8.1 端口扫描的法律风险

端口扫描的法律地位因国家和地区而异：

- **中国**：未经授权的端口扫描可能违反《网络安全法》第27条（非法侵入他人网络）
- **美国**：CFAA（计算机欺诈与滥用法）可适用于未经授权的扫描
- **欧盟**：GDPR 下扫描可能涉及个人数据处理

**合法扫描的前提**：
1. 扫描自己的系统或获得书面授权的系统
2. 漏洞赏金计划（Bug Bounty）明确允许的范围内
3. 安全评估合同约定的范围内
4. 教育/研究目的且不影响目标系统

### 8.2 负责任的扫描实践

```
安全扫描的最佳实践：

1. 获得授权
   └── 书面授权书（明确扫描范围、时间窗口、IP 范围）

2. 控制影响
   ├── 避开业务高峰期
   ├── 使用非破坏性扫描
   ├── 限制扫描速率
   └── 准备回滚方案

3. 保护数据
   ├── 扫描结果加密存储
   ├── 及时删除客户数据
   └── 不公开分享未脱敏结果

4. 透明沟通
   ├── 提前通知相关团队
   ├── 提供联系方式和应急方案
   └── 扫描完成后提供报告
```'''),
        sec('九、实战综合案例', '九实战综合案例', '''## 九、实战综合案例

### 9.1 完整外部渗透侦察流程

```bash
# 步骤 1：被动信息收集
whois target.com
dig target.com ANY
sublist3r -d target.com

# 步骤 2：IP 段发现
host target.com
# 查找同一 IP 段的其他站点（旁站）
# 使用 Shodan/Censys/Fofa 搜索

# 步骤 3：全端口扫描（快速）
masscan -p1-65535 --rate=5000 -oL masscan_output.txt target_ip_range

# 步骤 4：服务版本探测
nmap -sV -sC -p [open_ports_from_masscan] -oA services target

# 步骤 5：漏洞扫描
nmap --script vuln -p [open_ports] target

# 步骤 6：Web 应用扫描（如有 Web 端口）
nikto -h https://target
gobuster dir -u https://target -w /usr/share/wordlists/dirb/common.txt

# 步骤 7：生成综合报告
# 将以上结果汇总为侦察报告
```

### 9.2 内网横向移动侦察

```bash
# 发现内网存活主机
nmap -sn 10.0.0.0/24 -oA live_hosts

# 对存活主机进行端口扫描
nmap -sV --top-ports 100 -iL live_hosts.txt -oA internal_scan

# SMB 共享枚举
nmap --script smb-enum-shares -p 445 10.0.0.0/24

# 常见漏洞检测
nmap --script smb-vuln-ms17-010,vnc-brute,ftp-anon -p 445,5900,21 10.0.0.0/24
```'''),
    ],
    [
        ('Nmap 端口六种状态', '⭐⭐⭐⭐⭐', '中', 'open/closed/filtered/unfiltered/open|filtered/closed|filtered'),
        ('SYN 扫描原理', '⭐⭐⭐⭐⭐', '中', '发送SYN→SYN+ACK=开放/RST=关闭/无响应=filtered'),
        ('NSE 脚本分类', '⭐⭐⭐⭐', '中', 'auth/brute/default/discovery/exploit/vuln/safe等14类'),
        ('防火墙规避方法', '⭐⭐⭐⭐', '中', '分片(-f)、诱饵(-D)、源端口伪装(--source-port)、慢速扫描(-T2)'),
        ('OS 指纹识别依据', '⭐⭐⭐⭐', '中', 'TTL初始值、TCP窗口大小、TCP选项顺序、DF位、IP ID生成'),
        ('Masscan 特点', '⭐⭐⭐', '低', '极速扫描，6分钟可扫完整个互联网，基于异步无状态扫描'),
        ('Port Knocking 原理', '⭐⭐⭐', '中', '按特定顺序访问端口后才开放服务，增加隐蔽性'),
        ('扫描法律边界', '⭐⭐⭐⭐', '中', '未授权扫描可能违法；必须获得书面授权；遵守扫描范围和时间窗口'),
        ('Idle 扫描原理', '⭐⭐⭐', '高', '利用僵尸主机IPID预测，完全隐藏扫描方IP'),
        ('批量扫描方法', '⭐⭐⭐', '低', 'nmap -iL、GNU Parallel、Masscan+Nmap组合'),
    ],
    [
        ('端口状态六种', '"open开放、closed关闭、filtered过滤、unfiltered未过滤"', 'open=收到SYN+ACK；closed=收到RST；filtered=无响应', '记忆：O-C-F-U，过滤态最难判断'),
        ('Nmap 最常用组合', '"-sV -sC -O -p- 打天下"', '版本探测+默认脚本+OS识别+全端口', '四参数覆盖90%渗透场景'),
        ('规避扫描三件套', '"分片-f、诱饵-D、慢速-T2"', '分片绕过包检测、诱饵混入虚假IP、慢速规避速率告警', '三招组合可绕过大部分基础IDS'),
        ('OS 指纹四要素', '"TTL、窗口、选项、DF位"', 'Linux TTL=64/Win=128；窗口大小；TCP选项组合', 'T+T+O+D，不同OS各有特征'),
    ],
    [
        ('Nmap 扫描不会被发现', 'Connect扫描(-sT)和高速率扫描(-T5)很容易被IDS检测'),
        ('改端口号就能防扫描', '全端口扫描可以轻松发现非标准端口上的服务'),
        ('filtered 就是安全的', 'filtered只表示防火墙在过滤，但防火墙策略可能被绕过'),
        ('用 Nmap 扫别人不违法', '未经授权扫描他人系统可能触犯《网络安全法》等法律'),
        ('扫描越快越好', '高速扫描可能遗漏端口、触发防御机制、影响目标系统稳定性'),
    ],
    [
        '在虚拟机环境中使用 Nmap 对所有扫描类型进行练习，理解每种扫描的原理和输出差异',
        '编写 Python 端口扫描器，实现多线程 SYN 扫描和 Banner 抓取功能',
        '搭建 Snort/Suricata IDS，配置端口扫描检测规则，然后用 Nmap 测试检测效果',
        '使用 Masscan + Nmap 组合对测试环境进行快速资产发现',
        '配置 Port Knocking 保护 SSH 服务，验证其安全性',
    ],
    '端口扫描是一把双刃剑——攻击者用它寻找突破口，安全人员用它发现弱点。掌握扫描技术的同时，更要理解其法律边界和伦理责任。',
)

print(f'\\nDay 4: OK')

print(f'\\n=== Total lines so far: {total} ===')
print('Script execution completed for days 3-4. Continuing...')
