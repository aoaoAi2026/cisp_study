# -*- coding: utf-8 -*-
"""批量生成 basic/ Day3~10 完整教程 (550+行/篇，001-tcp-ip-deep.md 格式)"""
import os

DIR = r'E:\internal_safe\cisp1\cisp\public\contents\cyber-learning\basic'

def gen(filename, content):
    path = os.path.join(DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    lines = content.count('\n')
    print(f'  {filename}: {lines} lines')
    return lines

def hf(text): return f'> **🔑 高分考点**：{text}'
def qj(text): return f'> **💡 知识巧记**：{text}'

# ══════════════════════ DAY 3 ══════════════════════
total = 0
total += gen('day-3.md', f"""# Day 3：常见端口与服务

> **📘 文档定位**：CISP 考试核心基础 | 难度：入门 | 预计阅读：35 分钟
>
> 端口是传输层区分不同网络服务的核心机制，也是渗透测试信息收集的第一站。掌握常见端口及其对应服务，是识别攻击面、理解网络通信的基础。本文覆盖所有 CISP 高频端口考点。

---

## 导航目录

- [一、端口基础概念](#一端口基础概念)
- [二、熟知端口（0-1023）全表](#二熟知端口0-1023全表)
- [三、注册端口与应用](#三注册端口与应用)
- [四、端口扫描技术详解](#四端口扫描技术详解)
- [五、端口与服务关联分析](#五端口与服务关联分析)
- [六、Windows 常见端口](#六windows-常见端口)
- [七、Linux 常见端口](#七linux-常见端口)
- [八、数据库端口速查](#八数据库端口速查)
- [九、端口安全加固实践](#九端口安全加固实践)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、端口基础概念

### 1.1 什么是端口

端口（Port）是传输层用于区分同一台主机上不同网络服务的**16位数字标识符**。IP地址定位主机，端口号定位主机上的具体服务。

**核心公式**：**通信端点 = IP地址 + 端口号**。例如 `192.168.1.100:443` 表示主机上的 HTTPS 服务。

### 1.2 端口范围分类（RFC 6335）

| 范围 | 名称 | 数量 | 使用方式 | 典型端口 |
|:---|:---|:---:|:---|:---|
| **0 - 1023** | 熟知端口（Well-known Ports） | 1024 | 系统/root 才能绑定 | 80(HTTP)、443(HTTPS)、22(SSH) |
| **1024 - 49151** | 注册端口（Registered Ports） | 48028 | 应用程序可注册使用 | 3306(MySQL)、5432(PostgreSQL)、8080(代理) |
| **49152 - 65535** | 动态/私有端口（Dynamic/Private） | 16384 | 客户端临时端口 | 浏览器访问网站时随机分配 |

### 1.3 TCP 端口 vs UDP 端口

同一个端口号可以同时被 TCP 和 UDP 使用，它们是独立的。例如 DNS 同时使用 `UDP 53`（标准查询）和 `TCP 53`（区域传输/大响应）。

```bash
# 查看本机所有监听端口
netstat -an | findstr LISTENING     # Windows
netstat -tlnp                        # Linux (TCP listening)
ss -tlnp                             # Linux (推荐，更快)

# 查看端口对应的进程
netstat -ano | findstr :443          # Windows - 查看谁在用443
lsof -i :443                         # Linux - 查看端口占用
```

---

## 二、熟知端口（0-1023）全表

| 端口 | 协议 | 服务 | 说明 | CISP 考点 |
|:---:|:---|:---|:---|:---:|
| **20** | TCP | FTP-DATA | FTP 数据传输（主动模式） | 主动/被动模式区别 |
| **21** | TCP | FTP | FTP 控制连接 | 明文传输，用 SFTP/FTPS 替代 |
| **22** | TCP | SSH | 安全 Shell 远程管理 | 替代 Telnet(23) |
| **23** | TCP | Telnet | 远程登录（明文，不安全） | **已淘汰，禁用** |
| **25** | TCP | SMTP | 简单邮件传输（发送邮件） | 配合 POP3/IMAP |
| **53** | UDP/TCP | DNS | 域名解析服务 | UDP=查询、TCP=区域传输 |
| **67/68** | UDP | DHCP | 动态主机配置（67服务器/68客户端） | DORA 四步流程 |
| **69** | UDP | TFTP | 简单文件传输（无认证） | 配置传输、PXE启动 |
| **80** | TCP | HTTP | 超文本传输协议 | **明文，无加密** |
| **110** | TCP | POP3 | 邮局协议v3（接收邮件） | 下载到本地 |
| **123** | UDP | NTP | 网络时间协议 | 时间同步、放大攻击 |
| **143** | TCP | IMAP | 邮件访问协议（在线） | 邮件保留在服务器 |
| **161** | UDP | SNMP | 简单网络管理协议 | 监控网络设备 |
| **162** | UDP | SNMP Trap | SNMP 陷阱（告警推送） | 异步告警通知 |
| **389** | TCP/UDP | LDAP | 轻量目录访问协议 | AD 域认证基础 |
| **443** | TCP | HTTPS | HTTP over TLS | **Web 安全核心端口** |
| **445** | TCP | SMB | Windows 文件共享 | 永恒之蓝(CVE-2017-0144) |
| **514** | UDP | Syslog | 系统日志协议 | SIEM 收集基础 |
| **636** | TCP | LDAPS | LDAP over TLS | AD 域安全认证 |
| **993** | TCP | IMAPS | IMAP over TLS | 邮件加密读取 |
| **995** | TCP | POP3S | POP3 over TLS | 邮件加密下载 |

{hf('熟知端口 0-1023 是 CISP 基础中的基础——以下至少记住：21(FTP)/22(SSH)/23(Telnet)/25(SMTP)/53(DNS)/80(HTTP)/443(HTTPS)/445(SMB)。考法：给你端口号问服务，或给你服务问端口号。')}

---

## 三、注册端口与应用

### 3.1 数据库端口

| 端口 | 数据库 | 默认 | 备注 |
|:---:|:---|:---|:---|
| **1433** | Microsoft SQL Server | TCP | 也使用 UDP 1434（Browser服务） |
| **1521** | Oracle Database | TCP | Listener 默认端口 |
| **3306** | MySQL / MariaDB | TCP | 最流行的开源数据库 |
| **5432** | PostgreSQL | TCP | 另一个流行开源数据库 |
| **6379** | Redis | TCP | 内存缓存——**未授权访问重灾区** |
| **27017** | MongoDB | TCP | NoSQL文档数据库——**默认无密码** |
| **9200** | Elasticsearch | TCP | 搜索引擎——**曾多次爆出数据泄露** |

### 3.2 Web/应用中间件端口

| 端口 | 服务 | 说明 |
|:---:|:---|:---|
| **8080** | HTTP 代理/备用 | Tomcat、Jenkins、Nginx 常用 |
| **8000/8001** | Web 开发服务器 | Python Django/Flask 默认 |
| **8443** | HTTPS 备用 | Tomcat SSL 默认 |
| **9090** | Web 管理 | Cockpit(Linux Web管理) |
| **3000** | Node.js 开发 | Express、React 开发服务器 |
| **5000** | Python Flask | Flask 开发服务器默认 |

### 3.3 远程管理与监控端口

| 端口 | 服务 | 安全风险 |
|:---:|:---|:---|
| **3389** | RDP（远程桌面） | **暴力破解高发端口**，限制3389公网暴露 |
| **5900** | VNC（虚拟网络计算） | 弱口令风险 |
| **22** | SSH | 应禁用密码登录，使用密钥认证 |
| **10050/10051** | Zabbix Agent/Server | 监控数据泄露风险 |
| **9090** | Prometheus | 时序监控，需访问控制 |

{hf('数据库端口是高频考点：MySQL=3306、MSSQL=1433、Oracle=1521、PostgreSQL=5432、Redis=6379、MongoDB=27017。Redis(6379)和MongoDB(27017)默认无认证是渗透测试中最常见的未授权访问漏洞。')}

---

## 四、端口扫描技术详解

### 4.1 TCP 端口扫描类型

| 扫描类型 | Nmap 参数 | 原理 | 特点 | 隐蔽程度 |
|:---|:---:|:---|:---|:---:|
| **TCP SYN 扫描** | `-sS` | 发送 SYN，收到 SYN+ACK→开放，RST→关闭 | 默认扫描，快速、半开连接 | ⭐⭐⭐ |
| **TCP Connect 扫描** | `-sT` | 完成完整三次握手 | 系统日志会记录，较慢 | ⭐ |
| **TCP FIN 扫描** | `-sF` | 发送 FIN 包，无响应→开放，RST→关闭 | 可绕过部分防火墙 | ⭐⭐⭐⭐ |
| **TCP NULL 扫描** | `-sN` | 所有标志位为 0，同上原理 | 同上 | ⭐⭐⭐⭐ |
| **TCP Xmas 扫描** | `-sX` | FIN/URG/PSH 全置位，同上 | 同上 | ⭐⭐⭐⭐ |
| **TCP ACK 扫描** | `-sA` | 发送 ACK，用于判断防火墙规则 | 不判断端口开放，判断过滤规则 | N/A |

### 4.2 UDP 端口扫描

```bash
# UDP扫描比TCP慢很多——因为UDP无连接，没有确认机制
nmap -sU 192.168.1.1                     # 基本UDP扫描
nmap -sU -p 53,161,500 192.168.1.1       # 指定UDP端口扫描
nmap -sU --top-ports 100 192.168.1.0/24  # 扫描TOP 100 UDP端口
```

### 4.3 完整扫描命令示例

```bash
# 综合扫描（最常用）
nmap -sS -sV -O -p- --script=default 192.168.1.1
# -sS: TCP SYN扫描
# -sV: 版本探测
# -O: 操作系统探测
# -p-: 扫描全部65535个端口
# --script=default: 运行默认NSE脚本

# 快速扫描常用端口
nmap -F 192.168.1.0/24                    # Fast模式，仅100个常用端口

# 检测服务版本
nmap -sV --version-intensity 9 192.168.1.1 # 强度9（最高）

# 使用脚本检测漏洞
nmap --script vuln 192.168.1.1             # 运行漏洞检测脚本
```

{qj('TCP 扫描口诀："SYN半开（-sS）、Connect完整（-sT）、FIN/NULL/Xmas隐蔽（-sF/-sN/-sX）——越隐蔽越不标准但越容易被检测"')}

---

## 五、端口与服务关联分析

### 5.1 端口≠服务

重要原则：**端口号只是"约定"，不代表服务。** 攻击者可以把 SSH 开在 80 端口伪装成 HTTP，也可以把恶意后门监听在 443 端口伪装成 HTTPS。

```bash
# Nmap 服务版本探测来识别真正的服务
nmap -sV -p 80 192.168.1.1
# 输出: 80/tcp open  http    Apache httpd 2.4.41
# 即使端口是80，实际服务是Apache

nmap -sV -p 2222 192.168.1.1
# 输出: 2222/tcp open  ssh     OpenSSH 8.2
# 端口不是22，但实际服务是SSH
```

### 5.2 Banner 抓取

```bash
# 手动banner抓取
nc -nv 192.168.1.1 22          # Netcat 连接SSH
# 输出: SSH-2.0-OpenSSH_8.2p1  ← 直接暴露版本信息

nc -nv 192.168.1.1 80
echo -e "GET / HTTP/1.0\\r\\n\\r\\n" | nc 192.168.1.1 80  # HTTP banner

# Nmap banner抓取
nmap -sV --script=banner 192.168.1.1
```

---

## 六、Windows 常见端口

| 端口 | 服务 | 协议 | 安全建议 |
|:---:|:---|:---:|:---|
| **135** | RPC 端点映射 | TCP/UDP | WannaCry 利用此端口传播 |
| **137/138** | NetBIOS 名称服务/数据报 | UDP | 内网共享，公网应禁用 |
| **139** | NetBIOS 会话服务(NBSS) | TCP | 旧版文件共享 |
| **445** | SMB over TCP（直连） | TCP | **永恒之蓝(CVE-2017-0144)** |
| **3389** | RDP 远程桌面 | TCP | **暴力破解重灾区**——改端口或VPN访问 |
| **5985** | WinRM (HTTP) | TCP | PowerShell 远程管理 |
| **5986** | WinRM (HTTPS) | TCP | PowerShell 远程管理（加密） |
| **88** | Kerberos 认证 | TCP/UDP | AD 域核心认证协议 |
| **464** | Kerberos 密码修改 | TCP/UDP | 域用户改密 |

---

## 七、Linux 常见端口

| 端口 | 服务 | 说明 |
|:---:|:---|:---|
| **22** | SSH | 远程管理核心 |
| **111** | Portmapper (rpcbind) | NFS/NIS 依赖此服务 |
| **2049** | NFS | 网络文件系统——**配置不当可匿名挂载** |
| **25/465/587** | SMTP 相关 | Postfix/Sendmail |
| **631** | CUPS 打印服务 | 打印机共享 |
| **5432** | PostgreSQL | 数据库 |
| **6379** | Redis | 缓存——默认无密码 |
| **27017** | MongoDB | 文档数据库——默认无密码 |

---

## 八、数据库端口速查

| 数据库 | 默认端口 | 连接示例 |
|:---|:---:|:---|
| MySQL / MariaDB | 3306 | `mysql -h 192.168.1.1 -u root -p` |
| PostgreSQL | 5432 | `psql -h 192.168.1.1 -U postgres` |
| Microsoft SQL Server | 1433 | `sqlcmd -S 192.168.1.1,1433` |
| Oracle DB | 1521 | `sqlplus user/pass@192.168.1.1:1521/ORCL` |
| Redis | 6379 | `redis-cli -h 192.168.1.1` |
| MongoDB | 27017 | `mongo 192.168.1.1:27017` |
| Elasticsearch | 9200 | `curl http://192.168.1.1:9200/` |
| Cassandra | 9042 | CQL native transport |
| Memcached | 11211 | 内存缓存，UDP可用于放大攻击 |

---

## 九、端口安全加固实践

### 9.1 关闭不必要的服务

```bash
# Linux - 检查所有监听端口
ss -tlnp                    # TCP 监听
ss -ulnp                    # UDP 监听

# 禁用不需要的服务
systemctl stop telnet.socket
systemctl disable telnet.socket
systemctl mask telnet.socket   # 防止被其他服务间接启动

# Windows - 检查监听端口
netstat -ano | findstr LISTENING
# 在 services.msc 中禁用不需要的服务
```

### 9.2 防火墙最小化端口暴露

```bash
# iptables - 只开放必要端口
iptables -A INPUT -p tcp --dport 22 -s 10.0.0.0/8 -j ACCEPT   # SSH仅内网
iptables -A INPUT -p tcp --dport 443 -j ACCEPT                  # HTTPS公网
iptables -A INPUT -p tcp --dport 80 -j ACCEPT                   # HTTP公网
iptables -A INPUT -j DROP                                        # 默认拒绝
```

### 9.3 端口安全最佳实践

| 实践 | 说明 | 重要性 |
|:---|:---|:---:|
| **最小化开放端口** | 仅开放业务必需的端口 | ⭐⭐⭐⭐⭐ |
| **改默认端口（有一定价值）** | SSH 改到 2222、RDP 改到非 3389 | ⭐⭐⭐ |
| **端口敲门（Port Knocking）** | 按特定顺序"敲门"后才开放端口 | ⭐⭐⭐ |
| **IP 白名单限制** | 仅允许特定来源IP访问管理端口 | ⭐⭐⭐⭐⭐ |
| **定期端口扫描审计** | 每月扫描一次确保无未授权开放端口 | ⭐⭐⭐⭐ |
| **禁止 root 直接 SSH 登录** | `PermitRootLogin no` | ⭐⭐⭐⭐⭐ |

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | 熟知端口范围 0-1023 | ⭐⭐⭐⭐⭐ | 低 | 系统特权端口，仅 root 可绑定 |
| 2 | HTTP=80, HTTPS=443 | ⭐⭐⭐⭐⭐ | 低 | HTTPS = HTTP + TLS |
| 3 | DNS 同时使用 UDP 和 TCP 53 | ⭐⭐⭐⭐ | 中 | UDP 标准查询，TCP 区域传输和大响应 |
| 4 | FTP 使用 21(控制)+20(数据) | ⭐⭐⭐⭐ | 中 | 主动模式和被动模式端口不同 |
| 5 | SSH=22, Telnet=23 | ⭐⭐⭐⭐ | 低 | Telnet 明文不安全→已淘汰→用 SSH |
| 6 | MySQL=3306, MSSQL=1433 | ⭐⭐⭐⭐ | 低 | 需区分记住 |
| 7 | Redis(6379)/MongoDB(27017)默认无密码 | ⭐⭐⭐⭐ | 中 | 未授权访问重灾区 |
| 8 | 永恒之蓝利用 445 端口 SMB 服务 | ⭐⭐⭐⭐⭐ | 中 | CVE-2017-0144，MS17-010 |
| 9 | SYN扫描(-sS) vs Connect扫描(-sT) | ⭐⭐⭐ | 中 | SYN半开(不完成握手)/Connect全连接 |
| 10 | 端口≠服务(端口只是约定) | ⭐⭐⭐ | 低 | 服务可以在任意端口运行 |

### 💡 知识巧记口诀

> **核心端口记忆**："21下文件、22贝壳(SSH)、23太老(Telnet)、25发信(SMTP)、53域名、80网页、110收件(POP3)、143在线(IMAP)、443安全网、445微软享、3306买SQL(MySQL)、3389远程桌(RDP)"

> **端口三段式**："0-1023是系统(熟知端口)、1024-49151是注册、49152-65535是临时(客户端)"

> **扫描方式**："-sS半开静悄悄(SYN)、-sT全开有记录(Connect)、-sU慢慢扫(UDP)"

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "DNS只用UDP 53" | 错误！DNS区域传输和大响应(>512字节)使用TCP 53 |
| "端口号可以同时被TCP和UDP使用" | 正确！TCP 80和UDP 80是两个独立的端口 |
| "把SSH改到2222端口就安全了" | 不彻底！nmap -sV能识别服务版本，真正安全靠密钥认证+IP白名单 |
| "telnet 23端口可以继续使用" | 错误！明文传输已被淘汰，应使用SSH |
| "FTP只有21一个端口" | 错误！控制连接用21，数据连接用20(主动模式)或随机端口(被动模式) |

---

## 学习建议

1. 📋 **背熟核心20端口**：21/22/23/25/53/67-68/80/110/123/143/161/389/443/445/3306/3389/5432/6379/8080/27017——这是基础中的基础
2. 🔬 **动手扫描**：在自己的虚拟机环境用 `nmap -sS -sV 目标IP` 扫描，观察输出中的端口和服务信息
3. 🛡️ **加固实践**：检查自己VPS/服务器的开放端口，关闭所有非必要的服务
4. 📊 **关联记忆**：端口不是孤立的——和对应的协议、服务、攻击方式一起记
5. 🗺️ **渗透视角**：打开一个目标时，端口扫描是第一步——开放了哪些端口=暴露了哪些攻击面

---

> **端口是信息收集的第一步——每个开放端口都是一个潜在的攻击入口。掌握端口知识就像记住了每个"门牌号"背后的"住户"是谁。**
""")

print(f"Day 3 done, total lines so far: {total}")

# ══════════════════════ DAY 4 ══════════════════════
total += gen('day-4.md', f"""# Day 4：常见端口扫描

> **📘 文档定位**：CISP 考试核心基础 / 渗透实战 | 难度：中级 | 预计阅读：45 分钟
>
> 端口扫描是渗透测试中信息收集的第一步，也是最关键的一步——知道目标开放了哪些端口，才能判断运行了哪些服务、存在哪些可能的漏洞。本文详细拆解各种端口扫描技术原理，配合 Nmap 实战命令，让你从原理到实践彻底掌握端口扫描。

---

## 导航目录

- [一、端口扫描概述与法律边界](#一端口扫描概述与法律边界)
- [二、TCP 全连接扫描（Connect Scan）](#二tcp-全连接扫描connect-scan)
- [三、TCP SYN 半开扫描（SYN Scan）](#三tcp-syn-半开扫描syn-scan)
- [四、TCP FIN/NULL/Xmas 隐蔽扫描](#四tcp-finnullxmas-隐蔽扫描)
- [五、UDP 扫描技术](#五udp-扫描技术)
- [六、Nmap 核心命令大全](#六nmap-核心命令大全)
- [七、Nmap NSE 脚本引擎](#七nmap-nse-脚本引擎)
- [八、扫描速度与绕过技术](#八扫描速度与绕过技术)
- [九、其他扫描工具对比](#九其他扫描工具对比)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、端口扫描概述与法律边界

### 1.1 什么是端口扫描

端口扫描（Port Scanning）是向目标主机的 TCP/UDP 端口发送探测数据包，根据响应来判断端口状态（开放/关闭/过滤）的技术。

**端口六种状态**（Nmap 分类）：

| 状态 | 英文 | 含义 |
|:---|:---|:---|
| **open** | 开放 | 端口上有服务在监听，可连接 |
| **closed** | 关闭 | 可达但无服务监听，回 RST |
| **filtered** | 过滤 | 被防火墙/IDS阻挡，无法判断 |
| **unfiltered** | 未过滤 | 端口可达但Nmap无法判断开/关（ACK扫描特有） |
| **open|filtered** | 开放或过滤 | UDP/FIN扫描常见结果 |
| **closed|filtered** | 关闭或过滤 | IP ID Idle扫描特有 |

### 1.2 法律与道德边界

> **⚠️ 重要提醒**：未经授权对他人的系统进行端口扫描可能构成违法行为。扫描前必须获得书面授权！学习练习请使用自己搭建的靶机（Metasploitable、DVWA、HackTheBox等）。

---

## 二、TCP 全连接扫描（Connect Scan）

### 2.1 原理

TCP Connect 扫描调用系统 `connect()` 函数，完成**完整的三次握手**：

```
扫描端                          目标端
  |                               |
  | ① SYN →                       | 端口开放 → ② SYN+ACK
  | ③ ACK →                       |
  |                               | 端口关闭 → ② RST
```

### 2.2 优点与缺点

| 优点 | 缺点 |
|:---|:---|
| 不需要 root/管理员权限 | 完整三次握手，目标系统会记录连接日志 |
| 实现简单，所有操作系统支持 | 扫描速度比 SYN 扫描慢 |
| 不需要构造原始数据包 | 容易被检测（大量连接日志） |

### 2.3 实战命令

```bash
# TCP Connect 扫描
nmap -sT 192.168.1.1

# 指定端口
nmap -sT -p 80,443,8080 192.168.1.1

# 扫描端口范围
nmap -sT -p 1-1024 192.168.1.1

# 扫描全部 65535 个端口
nmap -sT -p- 192.168.1.1

# 非特权用户扫描（不使用ICMP和SYN）
nmap -sT -Pn 192.168.1.1
```

---

## 三、TCP SYN 半开扫描（SYN Scan）

### 3.1 原理（最常用扫描方式）

SYN 扫描不完成三次握手，在收到 SYN+ACK 后直接发送 RST 断开，所以**目标系统不会记录完整连接**：

```
扫描端                          目标端
  |                               |
  | ① SYN →                       | 端口开放 → ② SYN+ACK
  | ③ RST →（断开，不完成握手）      |
  |                               | 端口关闭 → ② RST
```

### 3.2 SYN 扫描的四种响应解析

| 目标响应 | 端口状态 | 说明 |
|:---|:---:|:---|
| SYN + ACK | **open** | 端口在监听，回复预连接 |
| RST | **closed** | 端口可达但无服务 |
| 无响应（多次重传后） | **filtered** | 被防火墙静默丢弃 |
| ICMP 不可达错误 | **filtered** | 被防火墙显式拒绝 |

### 3.3 为什么 SYN 是默认扫描方式

1. **快速**：不需要完成三次握手，效率更高
2. **相对隐蔽**：不会建立完整连接，大部分系统不记录半开连接
3. **准确**：能可靠地区分 open/closed/filtered 三种状态

### 3.4 实战命令

```bash
# SYN 扫描（默认，需要 root 权限）
sudo nmap -sS 192.168.1.1

# 快速扫描常用1000端口
sudo nmap -sS -F 192.168.1.0/24

# 版本探测 + OS探测 + 脚本扫描
sudo nmap -sS -sV -O -A 192.168.1.1

# 使用 SYN 扫描时指定网卡
sudo nmap -sS -e eth0 192.168.1.1
```

---

## 四、TCP FIN/NULL/Xmas 隐蔽扫描

### 4.1 三种隐蔽扫描对比

| 扫描类型 | 发送的TCP标志 | Nmap 参数 | 响应规则 |
|:---|:---:|:---:|:---|
| **FIN 扫描** | FIN | `-sF` | 无响应→open\|filtered，RST→closed |
| **NULL 扫描** | 所有标志位为0 | `-sN` | 同上 |
| **Xmas 扫描** | FIN+URG+PSH | `-sX` | 同上 |

### 4.2 原理（利用RFC 793规范）

RFC 793规定：如果端口**关闭**，收到不包含SYN/RST/ACK标志的包应该回复RST；如果端口**开放**，收到这类包应该**直接丢弃不响应**。

```
扫描端            端口开放             端口关闭
  |                  |                  |
  | FIN/NULL/Xmas →  |                  |
  |                  | (静默忽略)        | ← RST
  | 无响应 →         |                  |
  | open|filtered    | closed           |
```

### 4.3 局限性

**重要限制**：这类扫描**只对遵循RFC 793的系统有效**。Windows系统（以及某些新版Linux）会对所有这类包回复RST，导致全部显示为closed。因此FIN/NULL/Xmas扫描主要用于躲避防火墙和探测类Unix系统。

### 4.4 实战命令

```bash
nmap -sF 192.168.1.1     # FIN扫描
nmap -sN 192.168.1.1     # NULL扫描
nmap -sX 192.168.1.1     # Xmas扫描

# 组合隐蔽扫描+慢速
nmap -sF -T2 -f 192.168.1.1
```

{qj('FIN/NULL/Xmas 扫描口诀："开不响、关回RST——但Windows不按规矩来，全都回RST"')}

---

## 五、UDP 扫描技术

### 5.1 UDP 扫描为何困难

UDP 是无连接协议——没有握手和确认机制，这让端口状态判断变得困难：

| 发送探测包后的响应 | 端口状态 |
|:---|:---:|
| 收到 UDP 响应数据 | **open** |
| 收到 ICMP Port Unreachable（类型3，代码3） | **closed** |
| 收到其他 ICMP Unreachable | **filtered** |
| 超时无响应 | **open\|filtered**（最常见） |

### 5.2 为什么 UDP 扫描慢

- 无连接，需要等待超时来确定 open\|filtered
- ICMP 错误响应通常有速率限制
- 65535 个 UDP 端口 × 每个端口至少 1 秒超时 = 18 小时

### 5.3 加速 UDP 扫描

```bash
# 并行扫描（加快速度）
sudo nmap -sU --min-rate 1000 192.168.1.1

# 仅扫描常见UDP端口
sudo nmap -sU -F 192.168.1.1

# 指定端口列表
sudo nmap -sU -p 53,67,68,123,161,500 192.168.1.1

# UDP + TCP 同时扫
sudo nmap -sS -sU -p T:80,443,U:53,161 192.168.1.1
```

### 5.4 常用 UDP 端口

| 端口 | 服务 | Nmap探测方式 |
|:---:|:---|:---|
| 53 | DNS | 发送DNS查询请求 |
| 67/68 | DHCP | 发送DHCP请求 |
| 123 | NTP | 发送NTP请求 |
| 161 | SNMP | 发送SNMP GetRequest |
| 500 | IKE/IPSec | 发送IKE探测包 |
| 1900 | UPnP | 发送SSDP发现请求 |

---

## 六、Nmap 核心命令大全

### 6.1 目标指定

```bash
nmap 192.168.1.1                        # 单个IP
nmap 192.168.1.1-100                    # IP范围
nmap 192.168.1.0/24                     # CIDR网段
nmap 192.168.1.*                        # 通配符
nmap 192.168.1.1 192.168.2.1            # 多个不连续IP
nmap -iL targets.txt                    # 从文件读取目标
nmap --exclude 192.168.1.1 192.168.1.0/24  # 排除指定IP
```

### 6.2 端口指定

```bash
nmap -p 80 192.168.1.1                  # 单个端口
nmap -p 80,443,8080 192.168.1.1         # 多个端口
nmap -p 1-1000 192.168.1.1              # 端口范围
nmap -p- 192.168.1.1                    # 全部65535端口
nmap --top-ports 100 192.168.1.1        # TOP 100最常用端口
nmap -p http,https,ssh 192.168.1.1      # 用服务名指定端口
```

### 6.3 服务/版本/OS 探测

```bash
nmap -sV 192.168.1.1                        # 服务版本探测
nmap -sV --version-intensity 9 192.168.1.1  # 强度0-9（9最强最慢）
nmap -sV --version-all 192.168.1.1          # 尝试所有探针
nmap -O 192.168.1.1                         # 操作系统探测
nmap -O --osscan-guess 192.168.1.1           # 更激进地猜测OS
nmap -A 192.168.1.1                          # 综合扫描（OS+版本+脚本+traceroute）
```

### 6.4 输出格式

```bash
nmap -oN scan.txt 192.168.1.1           # 普通文本输出
nmap -oX scan.xml 192.168.1.1           # XML输出（可导入Metasploit）
nmap -oG scan.gnmap 192.168.1.1         # Grepable格式（便于grep筛选）
nmap -oA scan_result 192.168.1.1        # 三种格式同时输出
```

### 6.5 时序与性能

| 模板 | 参数 | 等待时间 | 扫描间隔 | 并行度 | 场景 |
|:---|:---:|:---:|:---:|:---:|:---|
| Paranoid | `-T0` | 5分钟 | 序列化 | 无并行 | IDS逃避极致 |
| Sneaky | `-T1` | 15秒 | 序列化 | 无并行 | IDS逃避 |
| Polite | `-T2` | 1秒 | 0.4秒 | 无并行 | 礼貌扫描 |
| Normal | `-T3` | 1秒 | 0秒 | 按需 | **默认** |
| Aggressive | `-T4` | 1.25秒 | 0秒 | 按需 | **常用快速扫描** |
| Insane | `-T5` | 0.3秒 | 0秒 | 按需 | 极速扫描，可能丢包 |

---

## 七、Nmap NSE 脚本引擎

### 7.1 NSE 脚本分类

| 分类 | 说明 | 示例 |
|:---|:---|:---|
| **auth** | 认证绕过检测 | ftp-anon |
| **broadcast** | 广播探测 | broadcast-dns-service-discovery |
| **brute** | 暴力破解 | ssh-brute, http-brute |
| **default** | 默认脚本集 | `-sC` 等价 `--script=default` |
| **discovery** | 信息发现 | smb-enum-shares |
| **dos** | 拒绝服务测试 | http-slowloris |
| **exploit** | 漏洞利用 | smb-vuln-ms17-010 |
| **fuzzer** | 模糊测试 | dns-fuzz |
| **malware** | 恶意软件检测 | http-google-malware |
| **safe** | 安全脚本（无破坏性） | ssh-hostkey |
| **version** | 版本探测增强 | skypev2-version |
| **vuln** | 漏洞检测 | vulners, smb-vuln-* |

### 7.2 漏洞扫描脚本

```bash
# 检测MS17-010（永恒之蓝）
nmap --script smb-vuln-ms17-010 -p 445 192.168.1.0/24

# 综合漏洞扫描（使用vulners数据库）
nmap -sV --script vulners -p 80,443 192.168.1.1

# HTTP漏洞检测
nmap --script "http-*" -p 80,443 192.168.1.1

# SMB枚举
nmap --script smb-enum-shares,smb-os-discovery -p 445 192.168.1.1
```

{hf('NSE的vuln类和exploit类脚本是渗透测试的重要工具。——script vuln是综合漏洞扫描，——script smb-vuln-ms17-010是专门检测永恒之蓝。这两个脚本在实战中极其常用。')}

---

## 八、扫描速度与绕过技术

### 8.1 绕过防火墙技术

| 技术 | Nmap 参数 | 原理 |
|:---|:---|:---|
| **分片** | `-f` / `--mtu 16` | 将TCP头分割成极小的片段，让包过滤防火墙难以重组 |
| **诱饵扫描** | `-D RND:10` | 混入大量伪造IP，让被扫方无法确定真实来源 |
| **空闲扫描** | `-sI zombie_IP` | 利用僵尸机的IP ID递增特性，完全隐藏扫描方 |
| **源端口欺骗** | `--source-port 53` | 伪装源端口为53(DNS)，绕过防火墙ACL |
| **MAC欺骗** | `--spoof-mac 0` | 随机MAC地址，绕过MAC过滤 |
| **数据长度** | `--data-length 100` | 在包尾附加随机数据，改变指纹特征 |

### 8.2 实战：利用DNS端口绕过防火墙

```bash
# 很多防火墙允许DNS(53端口)的流量通过
# 将扫描包的源端口设置为53来绕过
sudo nmap -sS --source-port 53 -p 1-1000 192.168.1.1

# 或使用g选项配合源端口
sudo nmap -sS -g 53 192.168.1.1
```

---

## 九、其他扫描工具对比

| 工具 | 平台 | 主要特点 | 适用场景 |
|:---|:---|:---|:---|
| **Nmap** | 全平台 | 功能最全面，NSE脚本引擎 | **首选工具**，所有场景 |
| **Masscan** | Linux/macOS | 极速，6分钟扫完整个互联网 | 大范围快速端口发现 |
| **Zmap** | Linux | 学术级，45分钟扫完IPv4 | 互联网测绘 |
| **RustScan** | 全平台 | Rust开发，3秒内扫完65535端口 | 快速端口发现+Nmap联动 |
| **Netcat** | 全平台 | 万能网络工具，单端口测试 | 单端口探测+banner抓取 |
| **Unicornscan** | Linux | 专注于UDP扫描 | 大规模UDP端口扫描 |
| **Angry IP Scanner** | 全平台 | GUI界面友好 | 内网资产发现 |

```bash
# Masscan 示例——6分钟扫完整张网段
masscan -p1-65535 --rate=10000 192.168.1.0/24

# RustScan 示例——3秒扫完65535端口
rustscan -a 192.168.1.1 --range 1-65535

# Netcat 单端口探测
nc -znv -w 2 192.168.1.1 22   # z=扫描模式 n=不DNS反查 v=详细 w=超时
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | TCP SYN扫描(-sS)原理 | ⭐⭐⭐⭐⭐ | 中 | 发SYN→收SYN+ACK后发RST断开，不完成握手 |
| 2 | TCP Connect扫描(-sT)原理 | ⭐⭐⭐⭐ | 中 | 完成三次握手，目标会记录连接 |
| 3 | SYN扫描的四种响应 | ⭐⭐⭐⭐ | 中 | SYN+ACK=open; RST=closed; 无响应=filtered; ICMP错误=filtered |
| 4 | FIN/NULL/Xmas扫描原理 | ⭐⭐⭐ | 高 | 利用RFC793：开放端口忽略异常包，关闭端口回RST |
| 5 | FIN扫描在Windows上的局限 | ⭐⭐⭐ | 中 | Windows对所有异常包都回RST，导致全部显示closed |
| 6 | UDP扫描为何慢 | ⭐⭐⭐ | 中 | 无连接+需等待超时+ICMP速率限制 |
| 7 | Nmap默认扫描方式 | ⭐⭐⭐ | 低 | TCP SYN扫描(-sS) |
| 8 | 分片绕过防火墙(-f) | ⭐⭐⭐ | 中 | 将TCP头分成极小片段绕过简单包过滤 |
| 9 | NSE vuln类脚本 | ⭐⭐⭐⭐ | 中 | --script vuln / --script smb-vuln-ms17-010 |
| 10 | 端口六种状态(Nmap) | ⭐⭐⭐ | 低 | open/closed/filtered/unfiltered/open\|filtered/closed\|filtered |

### 💡 知识巧记口诀

> **SYN扫描**："打个招呼(SYN)就回头(RST)"——收到SYN+ACK就知道开，然后马上断开，神不知鬼不觉

> **隐蔽扫描三兄弟**："开不响、关RST；Windows不按规矩、全都RST"——FIN/NULL/Xmas适合绕过防火墙，不适合扫Windows

> **UDP扫描慢**："无连接无确认，全靠等超时和ICMP——'open\|filtered'是常态"

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "端口扫描一定违法" | 不一定——扫描自己的资产或经授权的扫描合法，但未经授权的扫描可能触犯法律 |
| "SYN扫描不会产生任何日志" | 不完全——现代防火墙/IDS仍能检测到SYN扫描的流量模式 |
| "Connect扫描不需要root" | 正确！-sT不需要特权，但速度慢且不隐蔽 |
| "FIN扫描在Linux上也能扫Windows" | 错误！Windows系统无视RFC793规范，FIN扫描结果不可靠 |
| "Nmap只有端口扫描功能" | 错误！Nmap有NSE脚本引擎，能做漏洞检测、暴力破解、服务枚举等 |

---

## 学习建议

1. 🎯 **从SYN扫描开始**：`sudo nmap -sS -sV -O 目标IP` 是最常用的命令组合，先在虚拟机里熟练使用
2. 📊 **对比扫描结果**：同一目标分别用 -sS / -sT / -sF 扫描，对比输出的差异，加深对各种扫描方式的理解
3. 🔍 **学习看 Nmap 输出**：输出中的 open/closed/filtered 各代表什么——这是分析结果的基础
4. 🏠 **搭建靶机**：下载 Metasploitable 2 或 VulnHub 靶机，在隔离环境中练习各种扫描技术
5. 🛡️ **从蓝队视角**：同时使用 Wireshark 抓包观察扫描流量，理解攻击者行为特征

---

> **端口扫描是渗透测试的"敲门砖"——不知道门开着什么，就不知道从哪里进去。掌握 Nmap 的 SYN 扫描是最低要求，NSE 脚本引擎才是真正的战斗力。**
""")

print(f"Day 4 done, total lines so far: {total}")

print("\\n✅ basic/day-3.md ~ day-4.md 已生成")
print(f"累计: 4 篇")
