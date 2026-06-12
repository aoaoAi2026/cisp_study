# Windows 系统基础：域、权限、进程与事件日志

Windows 在企业办公与服务器中占据重要位置，也自然成为红队/蓝队的主战场。掌握 Windows 基础——用户/组/权限、活动目录（AD）、常见进程、服务与事件日志——对攻防都至关重要。本文做一次结构化梳理。

## 一、Windows 版本与常见路径

| 位置 | 说明 |
| --- | --- |
| `C:\Windows` | 系统目录（`%SystemRoot%`） |
| `C:\Windows\System32` | 64 位系统文件；32 位系统在 `SysWOW64` |
| `C:\Program Files` / `C:\Program Files (x86)` | 64/32 位程序安装目录 |
| `C:\ProgramData` | 系统级应用数据（隐藏，`%ProgramData%`） |
| `C:\Users\<username>` | 用户主目录（`%USERPROFILE%`） |
| `C:\Users\<username>\AppData\Local / LocalLow / Roaming` | 用户应用数据 |
| `%TEMP%` / `%TMP%` | 临时目录（恶意软件常落地位置） |
| `\\<DC>\SYSVOL`、`\\<DC>\NETLOGON` | 域共享，组策略与脚本下发 |

## 二、用户 / 组 / 权限

### 2.1 用户与组

- 本地账户 vs 域账户（Active Directory）；
- 常见内置组：`Administrators`、`Domain Admins`、`Enterprise Admins`、`Schema Admins`、`Users`、`Guests`、`Remote Desktop Users`、`Authenticated Users`、`NT AUTHORITY\SYSTEM`（本地系统账户，权限极高）、`NT AUTHORITY\NETWORK SERVICE`、`LOCAL SERVICE`；
- 用 `whoami /all`、`net user`、`net localgroup administrators`、`net group "Domain Admins" /domain` 查询；
- 用 `lusrmgr.msc` 打开本地用户组管理（非家庭版）。

### 2.2 NTFS 权限与共享权限

- **DACL（Discretionary Access Control List）**：每个对象上谁可做什么；
- **继承**：默认子对象继承父对象权限；
- **权限**：Read / Write / Modify / Full Control / List Folder / Read & Execute / Special Permissions；
- 右键 → 属性 → 安全，或用 `icacls`、`Get-Acl / Set-Acl` 管理；
- 共享权限（SMB）与 NTFS 权限：最终权限取二者更严格的交集。

### 2.3 UAC（User Account Control）

- 管理员登录时默认以"标准用户 token"运行；执行高权限操作时弹出提示（`consent.exe`）；
- 绕过 UAC 的常见手法：` fodhelper.exe`、`sdclt.exe`、`eventvwr.exe` 等"自动提权程序"缺陷；
- 防御：保持 UAC 为默认或更高、限制管理员数量、定期审计管理员登录。

## 三、活动目录（Active Directory）基础

AD 是 Windows 企业环境的核心：

- **Domain Controller（DC）**：负责认证、组策略；
- **Domain**：账户/计算机/组策略的管理边界；
- **Forest / Tree**：多个域通过信任关系组织；
- **LDAP（Lightweight Directory Access Protocol）**：目录查询协议，端口 389（未加密/STARTTLS）、636（LDAPS）；
- **Kerberos**：默认域认证协议，依赖 KDC（Key Distribution Center，通常就是 DC）；
- **GPO（Group Policy）**：集中下发策略、脚本、软件；
- **SYSVOL**：DC 间复制 GPO 的共享目录（若权限配置错误，可被普通用户读密码）。

典型枚举命令（红/蓝共用）：

```
net user /domain
net group "Domain Admins" /domain
net group "Enterprise Admins" /domain
net accounts /domain
net view /domain
nltest /dclist:<domain>
nltest /dsgetdc:<domain>
gpresult /r
```

## 四、进程 / 服务 / 计划任务

- **任务管理器 / Process Explorer / Process Hacker**：查看进程、命令行、加载 DLL、句柄；
- **常见系统进程**：
  - `System (PID 4)`、`smss.exe`（会话管理器）、`csrss.exe`（Windows 子系统）；
  - `wininit.exe`、`services.exe`、`svchost.exe`（多个实例，承载服务）、`lsass.exe`（本地安全授权，Mimikatz 的目标）、`winlogon.exe`、`explorer.exe`；
  - 异常项：没有合法签名、路径异常、运行在 `%TEMP%`/`C:\ProgramData` 下的随机命名进程；
- **服务管理**：`services.msc`、`sc query`、`sc start/stop`、`Get-Service`、`Set-Service`；
- **计划任务**：`taskschd.msc`、`schtasks /query /fo LIST /v`、`Get-ScheduledTask`。红队常滥用计划任务持久化。

## 五、注册表基础

注册表是 Windows 的配置数据库，分多个 Hive：

| Hive | 含义 |
| --- | --- |
| `HKEY_LOCAL_MACHINE (HKLM)` | 系统级配置 |
| `HKEY_CURRENT_USER (HKCU)` | 当前用户配置 |
| `HKEY_USERS (HKU)` | 所有用户配置 |
| `HKEY_CLASSES_ROOT (HKCR)` | 文件关联与 COM 类（HKLM + HKCU 的合并视图） |
| `HKEY_CURRENT_CONFIG` | 当前硬件配置 |

常见攻防相关键：

- `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run / RunOnce`（启动项持久化）；
- `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\...`（资源管理器行为）；
- `HKLM\SYSTEM\CurrentControlSet\Services`（服务配置）；
- `HKLM\SYSTEM\CurrentControlSet\Control\Lsa`（LSASS 配置，如 WDigest、RunAsPPL）；
- `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options`（IFEO 注入点）。

操作方式：`regedit` GUI、`reg add / query / delete`、`reg save`、PowerShell `Get-ItemProperty / New-ItemProperty`。

## 六、事件日志

Windows 事件日志是蓝队最核心的数据源之一：

- 位置：`%SystemRoot%\System32\Winevt\Logs\*.evtx`；
- 查看工具：事件查看器（`eventvwr.msc`）、PowerShell `Get-WinEvent`、`wevtutil qe`、第三方工具（Elastic Winlogbeat/Splunk/Sysmon）；
- 常见通道：
  - `Security`：安全事件（登录/注销/特权使用/对象访问）；
  - `System`：系统/服务/驱动相关；
  - `Application`：应用程序日志；
  - `Setup`：安装相关；
  - `ForwardedEvents` / 自定义通道（Sysmon、PowerShell）。

### 6.1 关键安全事件 ID（Security 通道）

| 事件 ID | 含义 |
| --- | --- |
| 4624 | 登录成功（Logon Type: 2 交互 / 3 网络 / 4 批处理 / 5 服务 / 7 解锁 / 9 NewCredentials / 10 远程交互 / 11 缓存登录） |
| 4625 | 登录失败（暴力破解/密码喷洒） |
| 4634 / 4647 | 注销 |
| 4672 | 使用管理员特权登录（关注是否异常账户） |
| 4698 / 4699 / 4700 / 4701 / 4702 | 计划任务创建/删除/修改等（持久化监控） |
| 4720 / 4722 / 4726 / 4728 / 4729 / 4732 / 4733 | 账户创建、启用、删除、加入组变化 |
| 4740 | 账户锁定（暴力破解触发） |
| 4688 | 进程创建（需开启审核，配合命令行参数监控） |
| 4697 | 服务安装 |
| 5140 | 网络共享对象被访问 |
| 5145 | 共享文件被检查是否可被访问（可观察横向 `\\DC\ADMIN$` 等） |
| 4663 | 对象访问（尝试访问文件/注册表，需对象 SACL 配置） |

### 6.2 Sysmon 强化日志

- 由 Microsoft Sysinternals 提供，可提供进程创建、网络连接、文件创建、驱动加载、管道、WMI、镜像注入等深度事件；
- 推荐部署配合 Sigma 规则集做检测；
- 常用事件 ID：1（进程创建）、3（网络连接）、7（镜像加载）、8（CreateRemoteThread）、11（文件创建）、15（FileCreateStreamHash，关注 ADS）、17/18（命名管道）、19/20/21（WmiEvent）。

## 七、常用命令速查

### 信息收集

```
systeminfo
ver
hostname
whoami /all
net user
net localgroup administrators
netstat -ano | findstr LISTENING
tasklist /v
wmic os get caption,version,buildnumber
wmic product get name,version      (仅列出通过 MSI 安装的程序)
wmic service get name,displayname,state,startmode | findstr /i running
```

### 网络相关

```
ipconfig /all
ipconfig /displaydns
arp -a
route print
netsh advfirewall firewall show rule name=all
netsh interface portproxy show all
```

### 事件日志（PowerShell）

```
Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4625 } -MaxEvents 50
Get-WinEvent -FilterXPath "*[System[EventID=4688] and EventData[Data[@Name='NewProcessName'] and (Data='C:\\Windows\\System32\\cmd.exe')]]" -LogName Security -MaxEvents 20
```

## 八、典型持久化手段与防御线索

| 手法 | 监控线索 |
| --- | --- |
| Run/RunOnce 注册表启动项 | 审计 `HKLM\...\Run`、`HKCU\...\Run` 变化 |
| 计划任务 | 事件 ID 4698/4699/4700/4701/4702 |
| 服务安装 | 事件 ID 4697、`services.exe` 行为 |
| 登录脚本 / GPO 脚本 | 检查 `\\DC\SYSVOL` 变更、`userinit` 值 |
| IFEO / AEDebug 劫持 | 关注 `Image File Execution Options` 键值 |
| COM 劫持 / CLSID 替换 | 关注 `HKCR\CLSID` 异常修改与加载 |
| AMSI 绕过 / ETW 修补 | 监控 `amsi.dll` 加载、PowerShell 版本使用、未签名脚本 |
| WMI 事件订阅 | Sysmon 事件 19/20/21；`wmic /namespace:\\root\subscription PATH __EventFilter` |
| 账户操作 | 事件 ID 4720/4722/4726/4728/4729 |
| Golden Ticket / Silver Ticket | Kerberos TGT/ST 异常：RC4-HMAC 仍在使用、异常账户、异常加密类型 |

## 九、学习建议

1. 安装一台 Windows Server 与 Windows 客户端，手工搭建一个小型 AD 域（DC + 两台成员机）；
2. 在 AD 中演练：账户创建、组策略下发、LDAP 查询、Kerberos 登录与委派；
3. 阅读 Microsoft 官方文档：Windows 安全基线、事件 ID 说明；
4. 熟练使用 Sysinternals 套件：Process Explorer、Process Monitor、Autoruns、PsExec、LogonSessions、Sysmon；
5. 建立自己的"攻击-检测"对照清单：每次遇到一种攻击手段，都要对应到可观测的事件与日志；
6. 关注《Windows Internals》与 CTF/靶场（如 Hack The Box、攻防世界）中的 Windows 题目。

Windows 系统虽然庞大，但把它拆成"账户-权限-域-进程-服务-注册表-日志"七个模块，逐个击破，就不会那么迷茫。安全从业者不一定要成为 Windows 专家，但必须对"系统行为"有足够敏锐的直觉。
