# Windows 系统基础：域、权限、进程与事件日志

> **📘 文档定位**：CISP 考试核心基础 | 难度：进阶 | 预计阅读：50 分钟
>
> Windows 在企业办公与服务器中占据重要位置，也自然成为红队/蓝队的主战场。掌握 Windows 基础——用户/组/权限、活动目录（AD）、常见进程、服务与事件日志——对攻防都至关重要。本文做一次结构化梳理。

---

## 导航目录

- [一、Windows 版本与常见路径](#一windows-版本与常见路径)
- [二、用户 / 组 / 权限](#二用户--组--权限)
- [三、活动目录（Active Directory）基础](#三活动目录active-directory基础)
- [四、进程 / 服务 / 计划任务](#四进程--服务--计划任务)
- [五、注册表基础](#五注册表基础)
- [六、事件日志](#六事件日志)
- [七、常用命令速查](#七常用命令速查)
- [八、典型持久化手段与防御线索](#八典型持久化手段与防御线索)
- [九、高分考点与知识巧记](#九高分考点与知识巧记)

---

## 一、Windows 版本与常见路径

### 1.1 关键目录说明

| 位置 | 环境变量 | 说明 | 安全关注点 |
| :--- | :--- | :--- | :--- |
| `C:\Windows` | `%SystemRoot%` | 操作系统核心目录 | 系统文件完整性 |
| `C:\Windows\System32` | — | **64 位系统文件**（64 位 OS） | ⚠️ 名称误导：存 64 位文件 |
| `C:\Windows\SysWOW64` | — | **32 位系统文件**（64 位 OS） | WOW64=Windows 32-bit on Windows 64-bit |
| `C:\Windows\System32\drivers` | — | 内核驱动(.sys) | Rootkit 常替换驱动 |
| `C:\Windows\System32\config` | — | 注册表 Hive 文件 | SAM、SYSTEM 包含密码哈希 |
| `C:\Windows\System32\Winevt\Logs` | — | 事件日志 .evtx 文件 | 取证核心数据源 |
| `C:\Windows\System32\Tasks` | — | 计划任务 XML 定义 | 持久化常用路径 |
| `C:\Windows\Temp` | `%SystemRoot%\Temp` | 系统级临时目录 | 恶意软件落地路径 |
| `C:\Program Files` | `%ProgramFiles%` | 64 位程序安装目录 | 程序完整性校验 |
| `C:\Program Files (x86)` | `%ProgramFiles(x86)%` | 32 位程序安装目录 | 32 位程序兼容 |
| `C:\ProgramData` | `%ProgramData%` | 系统级应用数据（隐藏） | 恶意软件藏身之所 |
| `C:\Users\<user>` | `%USERPROFILE%` | 用户主目录 | 个人数据和凭据 |
| `C:\Users\<user>\AppData\Local` | `%LOCALAPPDATA%` | 本地应用数据 | 浏览器缓存、Chrome 数据 |
| `C:\Users\<user>\AppData\Roaming` | `%APPDATA%` | 漫游应用数据 | 启动项、持久化 |
| `%TEMP%` / `%TMP%` | `C:\Users\<user>\AppData\Local\Temp` | 用户临时目录 | ⚠️ 恶意软件最常用落地路径 |
| `\\<DC>\SYSVOL` | — | 域共享（组策略与脚本下发） | ⚠️ 权限配置错误可被读密码 |
| `\\<DC>\NETLOGON` | — | 域登录脚本共享 | 登录脚本执行 |

> **💡 知识巧记**：
> - `System32` 存 64 位、`SysWOW64` 存 32 位——最反直觉的命名！
> - `AppData` 三层：**Local 本地不动、LocalLow 低权限用、Roaming 跟着域账户走**
> - `%TEMP%` = 恶意软件第一落脚点

### 1.2 Windows 安全版本演进

| 版本 | 关键安全特性 | 考试关联 |
| :--- | :--- | :--- |
| Windows Vista / 2008 | UAC、BitLocker、完整性级别 | UAC 诞生 |
| Windows 7 / 2008 R2 | AppLocker、DirectAccess | 企业级应用控制 |
| Windows 8 / 2012 | Secure Boot、ELAM | UEFI 安全启动 |
| Windows 10 / 2016 | Credential Guard、WDAG、Defender ATP | 凭据保护 |
| Windows 11 / 2022 | TPM 2.0 强制、VBS 默认、Smart App Control | 硬件安全强制 |

---

## 二、用户 / 组 / 权限

### 2.1 用户与组详解

**本地账户 vs 域账户**：
```
本地账户：存在于本地 SAM 数据库中，仅本机有效
  格式：.\username 或 COMPUTERNAME\username
  存储：C:\Windows\System32\config\SAM（注册表 Hive）

域账户：存在于 Active Directory 中，全域有效
  格式：DOMAIN\username 或 username@domain.com
  存储：域控制器的 NTDS.dit 数据库
```

**关键内置组与 SID**：

| 组名 | SID（尾段） | 权限级别 | 攻防意义 |
| :--- | :--- | :--- | :--- |
| **Administrators** | S-1-5-32-544 | 本地最高权限 | 攻：目标组；防：严格控制成员 |
| **Domain Admins** | S-1-5-21-*-512 | 域内所有计算机管理员 | 攻：最终目标；防：最小化成员 |
| **Enterprise Admins** | S-1-5-21-*-519 | 林中所有域管理员 | 攻：森林级控制；防：极少使用 |
| **Schema Admins** | S-1-5-21-*-518 | 可修改 AD 架构 | 攻：持久化后门；防：默认为空 |
| **NT AUTHORITY\SYSTEM** | S-1-5-18 | **本地系统账户**（高于 Admin） | 攻：服务权限；防：服务隔离 |
| **NT AUTHORITY\NETWORK SERVICE** | S-1-5-20 | 网络服务（远程时为匿名） | 服务账户最小权限 |
| **NT AUTHORITY\LOCAL SERVICE** | S-1-5-19 | 本地服务（无网络认证） | 最低权限服务 |
| **Remote Desktop Users** | S-1-5-32-555 | 远程桌面权限 | 攻：横向移动入口 |

> **🔑 高分考点**：`NT AUTHORITY\SYSTEM` 的权限**高于** Administrators 组成员！它可以访问 Administrators 无法访问的某些系统资源（如 SAM 注册表）。获取 SYSTEM 权限是本地提权的最高目标。

**常用查询命令**：
```cmd
whoami /all                     # 当前用户完整信息（SID、组、权限）
net user                        # 本地用户列表
net user username               # 指定用户详细信息
net user username /domain       # 域用户详细信息
net localgroup administrators   # 本地管理员组成员
net group "Domain Admins" /domain  # 域管理员组成员
lusrmgr.msc                     # 图形界面管理本地用户和组
```

### 2.2 NTFS 权限详解

```
DACL（Discretionary Access Control List）：
  每个文件/目录/注册表项都有一个 DACL
  DACL 包含零个或多个 ACE（Access Control Entry）
  每个 ACE 定义：谁（SID）+ 允许/拒绝 + 什么权限

权限继承：
  默认子对象继承父对象权限
  可禁用继承并显式设置
  显式 ACE 优先于继承 ACE

六种标准权限：
  Read               → 读取文件内容/列出目录
  Write              → 写入文件/创建文件
  Read & Execute     → 读取 + 执行（运行程序）
  List Folder Contents → 仅列出目录内容（仅目录）
  Modify             → 读+写+执行+删除
  Full Control       → 上述全部 + 修改权限 + 获取所有权

权限管理命令：
  icacls file.txt                    # 查看文件权限
  icacls file.txt /grant User:R      # 授予用户读取权限
  icacls file.txt /remove User       # 移除用户权限
  icacls file.txt /inheritance:d     # 禁用继承
  Get-Acl file.txt | Format-List     # PowerShell 查看权限
```

**NTFS 权限 vs 共享权限**：
```
共享权限（SMB）：控制通过网络访问时的权限
NTFS 权限：控制本地和网络访问时的权限

最终有效权限 = NTFS 权限 ∩ 共享权限（取更严格者）
最佳实践：共享权限设为 Everyone Full Control，通过 NTFS 权限精确控制
```

### 2.3 UAC（User Account Control）

```
UAC 工作原理：
  管理员登录时，系统创建两个 Token：
  1. 标准用户 Token（默认使用，Filtered Token）
  2. 管理员 Token（仅在提权时使用，Linked Token）
  
  执行高权限操作时，弹出 consent.exe 提示
  安全桌面（Secure Desktop）防止恶意程序模拟点击

UAC 四种级别：
  始终通知（Always Notify）           → 最安全
  仅当程序尝试更改时通知（默认）       → 平衡
  仅当程序尝试更改时通知（不降低亮度） → 不安全
  从不通知（Never Notify）            → ⚠️ 极度危险

常见 UAC 绕过手法：
  fodhelper.exe 绕过  → 利用注册表键值劫持提权
  sdclt.exe 绕过     → 利用备份与还原控制面板
  eventvwr.exe 绕过  → 利用事件查看器注册表劫持
  DLL 劫持绕过       → 高权限程序加载恶意 DLL

防御：
  ✓ UAC 保持默认或更高级别
  ✓ 限制本地管理员组成员数量
  ✓ 启用 "以管理员批准模式运行所有管理员"（默认）
  ✓ 监控 UAC 绕过相关注册表修改
```

---

## 三、活动目录（Active Directory）基础

### 3.1 AD 核心概念

```
Domain Controller（DC）：
  - 域的核心服务器，负责身份认证
  - 存储 AD 数据库（NTDS.dit）
  - 运行 KDC（Key Distribution Center）服务
  - 处理 Kerberos 和 NTLM 认证

Domain（域）：
  - 账户、计算机、组策略的管理边界
  - 同一域内资源共享，统一认证
  - 域内所有 DC 之间通过复制保持数据一致

Tree（域树）：
  - 多个域通过父子信任关系形成树
  - 共享连续命名空间（如 corp.com → emea.corp.com）
  - 双向可传递信任关系

Forest（林）：
  - 一个或多个域树的集合
  - 林是安全边界（Enterprise Admins 跨域控制）
  - 共享同一架构（Schema）和配置（Configuration）
```

**AD 核心协议**：
| 协议 | 端口 | 用途 | 安全版本 |
| :--- | :--- | :--- | :--- |
| LDAP | 389 | 目录查询 | LDAPS 端口 636（TLS） |
| Kerberos | 88 | 域认证（默认） | AES 加密 |
| NTLM | — | 旧认证协议 | NTLMv2 仍有使用 |
| SMB | 445 | 文件共享 | SMB 签名/加密 |
| DNS | 53 | AD 服务发现 | 集成在 AD 中 |

### 3.2 Kerberos 认证流程

```
认证流程（简化版）：
  客户端                           KDC（DC）                   目标服务
    |                                  |                            |
    |① AS-REQ（请求 TGT）              |                            |
    |  - 用户名                        |                            |
    |  - 时间戳（用密码哈希加密）       |                            |
    |--------------------------------->|                            |
    |                                  |                            |
    |② AS-REP（返回 TGT）              |                            |
    |  - TGT（用 KRBTGT 密钥加密）      |                            |
    |  - 会话密钥（用密码哈希加密）     |                            |
    |<---------------------------------|                            |
    |                                  |                            |
    |③ TGS-REQ（请求 ST）              |                            |
    |  - TGT + 认证符                  |                            |
    |--------------------------------->|                            |
    |                                  |                            |
    |④ TGS-REP（返回 ST）              |                            |
    |  - ST（用服务密钥加密）           |                            |
    |  - 服务会话密钥                   |                            |
    |<---------------------------------|                            |
    |                                  |                            |
    |⑤ AP-REQ（出示 ST）               |                            |
    |  - ST + 认证符                   |                            |
    |-------------------------------------------------------------->|
    |                                  |                            |

TGT = Ticket Granting Ticket（票据授予票据）— 身份证明，有效期 10 小时
ST  = Service Ticket（服务票据）— 访问特定服务的票据
KRBTGT = 域内最关键的账户，其密码哈希可解密所有 TGT

关键攻击：
  Golden Ticket：攻击者获取 KRBTGT 哈希 → 伪造任意 TGT → 全域持久化
  Silver Ticket：攻击者获取服务账户哈希 → 伪造特定服务的 ST → 横向移动
  Kerberoasting：请求 TGS 并离线破解服务账户密码
  AS-REP Roasting：针对不需要预认证的账户，离线破解密码
```

### 3.3 LDAP 与枚举命令

```cmd
# 基础枚举
net user /domain                           # 域用户列表
net user username /domain                  # 指定用户详情
net group "Domain Admins" /domain          # 域管理员组
net group "Enterprise Admins" /domain      # 企业管理员组
net accounts /domain                       # 域账户策略
net view /domain                           # 域列表
net view /domain:DOMAIN                    # 域内计算机列表

# 域控制器信息
nltest /dclist:<domain>                    # 域控制器列表
nltest /dsgetdc:<domain>                   # 当前 DC 详情
nltest /trusted_domains                    # 信任关系

# 组策略
gpresult /r                                # 当前用户组策略结果
gpresult /h report.html                    # 导出 HTML 报告

# 高级枚举（PowerShell）
Get-ADUser -Filter * -Properties *         # 所有 AD 用户
Get-ADGroup -Filter *                      # 所有 AD 组
Get-ADComputer -Filter *                   # 所有 AD 计算机
Get-ADTrust -Filter *                      # 信任关系
```

### 3.4 GPO 与 SYSVOL

```
组策略（GPO）：
  - 集中管理 Windows 配置的机制
  - 应用于站点、域或 OU（组织单元）
  - 包含计算机配置和用户配置
  - 更新间隔：90 分钟（DC 间复制可达 15 分钟）

SYSVOL 安全风险：
  \\<DC>\SYSVOL\<domain>\Policies\
  如果 GPO 中包含明文密码（如启动脚本、MSI 安装密码）
  → 任何经过认证的域用户都可以读取
  → 信息泄露 → 提权

防御：
  ✓ 不在 GPO 中存储密码
  ✓ 使用 Group Managed Service Accounts (gMSA)
  ✓ 审计 SYSVOL 权限
  ✓ 使用 LAPS（Local Administrator Password Solution）
```

---

## 四、进程 / 服务 / 计划任务

### 4.1 核心系统进程详解

| 进程名 | 典型 PID | 父进程 | 作用 | 异常特征 |
| :--- | :--- | :--- | :--- | :--- |
| **System** | 4 | — | 内核线程宿主 | 始终 PID 4 |
| **smss.exe** | — | System | 会话管理器（Session 0 和 Session 1） | 只有一个实例 |
| **csrss.exe** | — | — | Windows 子系统（控制台/ GUI） | Session 0 和 Session 1 各一个 |
| **wininit.exe** | — | — | Windows 初始化（启动服务子系统） | Session 0 独有 |
| **services.exe** | — | wininit.exe | 服务控制管理器（SCM） | 所有 svchost.exe 的父进程 |
| **svchost.exe** | — | services.exe | 服务宿主进程（多个实例） | 路径必须在 System32 |
| **lsass.exe** | — | wininit.exe | **本地安全授权子系统** | ⚠️ Mimikatz 目标，内存中存凭据 |
| **winlogon.exe** | — | — | 用户登录管理 | Session 1 独有 |
| **explorer.exe** | — | — | Windows 桌面 Shell | 每个交互用户一个实例 |

> **🔑 高分考点**：`lsass.exe` 是攻击者的核心目标——它内存中包含明文密码、NTLM 哈希、Kerberos 票据。Mimikatz 等工具通过注入 lsass.exe 进程提取凭据。Windows 10+ 的 Credential Guard 通过虚拟化隔离 LSASS 进程来防御。

**异常进程检测要点**：
```
✓ 进程名拼写错误：svch0st.exe、lsasss.exe、expl0rer.exe
✓ 路径异常：从 %TEMP% 或 %APPDATA% 运行的 svchost.exe
✓ 父进程异常：svchost.exe 的父进程不是 services.exe
✓ 无数字签名或签名不匹配
✓ 网络连接：System 进程有网络连接（可能是 rootkit）
✓ 命令行参数异常：powershell.exe -enc <base64>
```

### 4.2 服务管理

```cmd
# 命令行管理
sc query                     # 所有服务状态
sc query <服务名>             # 指定服务状态
sc start <服务名>             # 启动服务
sc stop <服务名>              # 停止服务
sc config <服务名> start= auto  # 设为自动启动
sc create <服务名> binPath= "C:\malware.exe"  # ⚠️ 创建恶意服务

# PowerShell 管理
Get-Service                  # 所有服务
Get-Service -Name "WinRM"    # 指定服务
Get-Service | Where-Object {$_.Status -eq "Running"}  # 运行中的服务
Set-Service -Name "WinRM" -StartupType Automatic      # 设为自动启动

# 图形界面
services.msc                 # 服务管理控制台
```

### 4.3 计划任务

```cmd
# schtasks 命令
schtasks /query /fo LIST /v                          # 所有计划任务（详细）
schtasks /query /tn "TaskName" /fo LIST /v            # 指定任务详情
schtasks /create /tn "MyTask" /tr "C:\evil.exe" /sc DAILY /st 09:00  # 创建任务
schtasks /delete /tn "MyTask" /f                       # 删除任务

# PowerShell 管理
Get-ScheduledTask                                       # 所有计划任务
Get-ScheduledTask -TaskPath "\Microsoft\Windows\"       # 指定路径
Get-ScheduledTask | Where-Object {$_.State -eq "Ready"} # 已就绪的任务
```

---

## 五、注册表基础

### 5.1 五大根键（Hive）

| Hive | 缩写 | 对应文件 | 内容 |
| :--- | :--- | :--- | :--- |
| **HKEY_LOCAL_MACHINE** | HKLM | `%SystemRoot%\System32\config\*` | 系统全局配置 |
| **HKEY_CURRENT_USER** | HKCU | `%USERPROFILE%\NTUSER.DAT` | 当前登录用户配置 |
| **HKEY_USERS** | HKU | 多个 NTUSER.DAT | 所有用户配置 |
| **HKEY_CLASSES_ROOT** | HKCR | HKLM\Software\Classes + HKCU\Software\Classes | 文件关联与 COM 注册 |
| **HKEY_CURRENT_CONFIG** | HKCC | — | 当前硬件配置（HKLM 子集） |

### 5.2 攻防关键注册表键

| 注册表键 | 用途 | 攻防关联 |
| :--- | :--- | :--- |
| `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run` | 系统级启动项 | 持久化最常用 |
| `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` | 用户级启动项 | 无需管理员权限的持久化 |
| `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce` | 一次性启动项 | 执行后自动删除 |
| `HKLM\SYSTEM\CurrentControlSet\Services` | 服务配置 | 服务持久化 |
| `HKLM\SYSTEM\CurrentControlSet\Control\Lsa` | LSA 配置 | WDigest、RunAsPPL |
| `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options` | IFEO（映像劫持） | 进程劫持、调试器劫持 |
| `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon` | Winlogon 配置 | Shell 替换、Userinit 劫持 |
| `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders` | 用户 Shell 目录 | 启动目录重定向 |

**注册表操作命令**：
```cmd
reg query "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run"
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v MyApp /t REG_SZ /d "C:\evil.exe"
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v MyApp /f
reg save HKLM\SAM sam.hive       # ⚠️ 备份 SAM（需 SYSTEM 权限）
```

**PowerShell 操作**：
```powershell
Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run"
Set-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "MyApp" -Value "C:\app.exe"
Remove-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "MyApp"
```

---

## 六、事件日志

### 6.1 关键安全事件 ID（Security 通道）

Windows 事件日志是蓝队最核心的数据源之一。以下按攻防场景组织：

**登录相关（最重要）**：
| 事件 ID | 含义 | 攻防应用 |
| :---: | :--- | :--- |
| **4624** | 登录成功 | ⚠️ 关注 Logon Type 判断登录方式 |
| **4625** | 登录失败 | 暴力破解/密码喷洒检测 |
| **4634** | 注销 | 会话结束 |
| **4647** | 用户发起注销 | 主动注销 |
| **4672** | 管理员特权登录 | 关注异常账户使用管理员权限 |
| **4740** | 账户锁定 | 暴力破解触发 |

**4624 登录类型（Logon Type）速查**：
| Type | 含义 | 典型场景 |
| :---: | :--- | :--- |
| 2 | 交互式登录 | 本地控制台登录 |
| 3 | 网络登录 | SMB 共享、PsExec |
| 4 | 批处理 | 计划任务 |
| 5 | 服务 | 服务启动 |
| 7 | 解锁 | 屏幕解锁 |
| 8 | NetworkCleartext | IIS 基本认证 |
| 9 | NewCredentials | RunAs /netonly |
| 10 | 远程交互 | 远程桌面（RDP） |
| 11 | 缓存登录 | 离线/缓存凭据登录 |

**账户管理相关**：
| 事件 ID | 含义 | 攻防应用 |
| :---: | :--- | :--- |
| **4720** | 用户账户创建 | 后门账户检测 |
| **4722** | 用户账户启用 | 停用账户被重新激活 |
| **4726** | 用户账户删除 | 痕迹清理 |
| **4728** | 成员加入安全全局组 | 如加入 Domain Admins |
| **4729** | 成员从安全全局组移除 | 权限变更 |
| **4732** | 成员加入安全本地组 | 如加入 Administrators |
| **4733** | 成员从安全本地组移除 | 权限变更 |

**进程与服务相关**：
| 事件 ID | 含义 | 攻防应用 |
| :---: | :--- | :--- |
| **4688** | 进程创建 | ⚠️ 核心！需启用命令行审计 |
| **4697** | 服务安装 | 服务持久化检测 |
| **4698** | 计划任务创建 | 持久化检测 |
| **4699** | 计划任务删除 | 痕迹清理 |
| **4700** | 计划任务启用 | 持久化激活 |
| **4702** | 计划任务更新 | 持久化修改 |

**文件共享与对象访问**：
| 事件 ID | 含义 | 攻防应用 |
| :---: | :--- | :--- |
| **5140** | 网络共享对象被访问 | 横向移动检测 |
| **5145** | 共享文件访问检查 | 关注 `\\DC\ADMIN$`、`\\DC\C$` 等 |
| **4663** | 对象访问尝试 | 需配置 SACL，监控敏感文件访问 |

### 6.2 Sysmon 强化日志

Sysmon（System Monitor）由 Sysinternals 提供，是 Windows 事件日志的强力补充：

| 事件 ID | 含义 | 攻防价值 |
| :---: | :--- | :--- |
| **1** | 进程创建 | 完整命令行、哈希、父进程、用户 |
| **3** | 网络连接 | 进程网络连接（TCP/UDP） |
| **7** | 镜像加载 | DLL 加载监控 |
| **8** | CreateRemoteThread | 进程注入检测 |
| **11** | 文件创建 | 文件落地监控 |
| **12/13/14** | 注册表操作 | 注册表修改监控 |
| **15** | FileCreateStreamHash | ADS（NTFS 数据流）创建 |
| **17** | 命名管道创建 | C2 通信检测 |
| **18** | 命名管道连接 | C2 通信检测 |
| **19/20/21** | WMI 事件 | WMI 持久化检测 |
| **22** | DNS 查询 | DNS 隧道/C2 检测 |

> **🔑 高分考点**：Sysmon 事件 ID 1（进程创建）是最重要的事件之一。它记录完整命令行、父进程、文件哈希，配合 Sigma 规则集可实现高精度威胁检测。

---

## 七、常用命令速查

### 7.1 信息收集

```cmd
systeminfo                          # 系统基本信息（OS 版本、补丁、硬件）
ver                                 # 操作系统版本
hostname                            # 主机名
whoami /all                         # 当前用户完整信息
net user                            # 本地用户列表
net localgroup administrators       # 管理员组成员
netstat -ano                        # 所有网络连接（-a 所有、-n 数字、-o PID）
netstat -ano | findstr LISTENING    # 监听端口
tasklist /v                         # 详细进程列表
tasklist /svc                       # 进程与服务映射
tasklist /m                         # 进程加载的 DLL
wmic os get caption,version,buildnumber  # OS 版本信息
wmic product get name,version       # 已安装软件（仅 MSI 安装的）
wmic service get name,displayname,state,startmode | findstr /i running  # 运行中的服务
driverquery /v                      # 已加载驱动
```

### 7.2 网络相关

```cmd
ipconfig /all                       # 完整网络配置
ipconfig /displaydns                # DNS 缓存
arp -a                              # ARP 缓存表
route print                         # 路由表
netstat -ano | findstr ESTABLISHED  # 已建立连接
netsh advfirewall firewall show rule name=all  # 防火墙规则
netsh interface portproxy show all  # 端口转发
nslookup example.com                # DNS 查询
```

### 7.3 事件日志（PowerShell）

```powershell
# 登录成功（最近 50 条）
Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4624} -MaxEvents 50

# 登录失败（最近 50 条）
Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4625} -MaxEvents 50

# 进程创建（需启用审核策略）
Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4688} -MaxEvents 50

# 服务安装
Get-WinEvent -FilterHashtable @{LogName='System'; ID=7045} -MaxEvents 50

# XPath 高级过滤
Get-WinEvent -FilterXPath "*[System[EventID=4688] and EventData[Data[@Name='NewProcessName'] and (Data='C:\\Windows\\System32\\cmd.exe')]]" -LogName Security -MaxEvents 20

# 按时间范围查询
Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4625; StartTime=(Get-Date).AddHours(-1)}
```

---

## 八、典型持久化手段与防御线索

| 手法 | 实现方式 | 监控线索 | 检测难度 |
| :--- | :--- | :--- | :---: |
| **Run/RunOnce 注册表** | `reg add HKLM\...\Run /v name /t REG_SZ /d "C:\mal.exe"` | Sysmon ID 13（注册表修改） | ⭐ |
| **计划任务** | `schtasks /create /tn "Update" /tr "C:\mal.exe" /sc DAILY` | 事件 ID 4698、Sysmon ID 1 | ⭐⭐ |
| **服务安装** | `sc create "ServiceName" binPath= "C:\mal.exe" start= auto` | 事件 ID 4697、Sysmon ID 1 | ⭐⭐ |
| **登录脚本** | 修改 GPO 登录脚本或 userinit 注册表 | 审计 `\\DC\SYSVOL` 变更 | ⭐⭐⭐ |
| **IFEO 劫持** | 注册表 Image File Execution Options 设置 Debugger | 监控 IFEO 键修改 | ⭐⭐⭐ |
| **WMI 事件订阅** | `wmic /namespace:\\root\subscription PATH __EventFilter CREATE ...` | Sysmon ID 19/20/21 | ⭐⭐⭐ |
| **DLL 劫持** | 将恶意 DLL 放在搜索路径中 | Sysmon ID 7（镜像加载） | ⭐⭐⭐⭐ |
| **COM 劫持** | 修改 CLSID 注册表指向恶意 DLL | 监控 `HKCR\CLSID` 修改 | ⭐⭐⭐⭐ |
| **Golden Ticket** | 获取 KRBTGT 哈希后伪造 TGT | 异常 TGT 使用（RC4、异常账户） | ⭐⭐⭐⭐⭐ |
| **Silver Ticket** | 获取服务账户哈希后伪造 ST | 异常 ST 使用 | ⭐⭐⭐⭐⭐ |
| **Skeleton Key** | 在 lsass.exe 中注入万能密码 | lsass.exe 内存完整性 | ⭐⭐⭐⭐⭐ |
| **DSRM 后门** | 修改 DSRM 管理员密码并允许网络登录 | 注册表 `DsrmAdminLogonBehavior` | ⭐⭐⭐⭐ |

---

## 九、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
| :---: | :--- | :---: | :---: | :--- |
| 1 | Windows 安全机制演进 | ⭐⭐⭐⭐ | 中 | UAC=Vista、Secure Boot=Win8、Credential Guard=Win10 |
| 2 | SYSTEM 账户权限 | ⭐⭐⭐⭐ | 低 | 高于 Administrators，SID S-1-5-18 |
| 3 | NTFS 权限类型 | ⭐⭐⭐ | 低 | Read/Write/Modify/Full Control |
| 4 | UAC 工作原理 | ⭐⭐⭐⭐ | 中 | 双 Token、Filtered Token、安全桌面 |
| 5 | Active Directory 核心概念 | ⭐⭐⭐⭐⭐ | 中 | Domain/Forest/Tree、DC、LDAP、Kerberos |
| 6 | Kerberos 认证流程 | ⭐⭐⭐⭐⭐ | 高 | AS-REQ→TGT→TGS-REQ→ST→AP-REQ |
| 7 | Golden Ticket vs Silver Ticket | ⭐⭐⭐⭐⭐ | 高 | GT=KRBTGT 哈希伪造 TGT；ST=服务哈希伪造 ST |
| 8 | 4624 登录事件与登录类型 | ⭐⭐⭐⭐⭐ | 中 | Type 2=交互、3=网络、10=RDP、5=服务 |
| 9 | 关键安全事件 ID | ⭐⭐⭐⭐⭐ | 中 | 4624/4625/4672/4688/4697/4720/4728/4740 |
| 10 | Sysmon 事件 ID | ⭐⭐⭐⭐ | 中 | 1=进程、3=网络、7=DLL、8=注入、11=文件 |
| 11 | 常见系统进程 | ⭐⭐⭐ | 低 | smss/csrss/lsass/svchost/winlogon/explorer |
| 12 | 持久化手段 | ⭐⭐⭐⭐ | 高 | Run注册表、计划任务、服务、WMI、Golden Ticket |
| 13 | 注册表五大 Hive | ⭐⭐⭐ | 低 | HKLM/HKCU/HKU/HKCR/HKCC |
| 14 | LSASS 凭据保护 | ⭐⭐⭐⭐ | 中 | Credential Guard 虚拟化隔离、RunAsPPL |

### 💡 知识巧记口诀

#### 1. Windows 目录结构
> **"System32 存 64，WOW64 存 32——Windows 最反直觉的命名"**
>
> **"ProgramData 隐藏深、AppData 三层分、TEMP 目录恶意落"**

#### 2. 用户与组
> **"SYSTEM 高于 Admin、Domain Admin 管全域、Enterprise Admin 跨森林"**

#### 3. Kerberos 认证
> **"先要 TGT 证明我是谁，再要 ST 访问服务"**
>
> 口诀：**"AS→TGT→TGS→ST→AP"** — 五步认证法

#### 4. 票据攻击
> **"Golden 拿 KRBTGT 伪造 TGT 全域通，Silver 拿服务哈希伪造 ST 单服务"**
>
> **"GT 是万能钥匙，ST 是单把钥匙"**

#### 5. 登录事件 4624
> **"2 交互坐机前、3 网络连共享、4 批处理计划任务、5 服务自启动、10 远程桌面来"**

#### 6. 事件 ID 速记
> **"4624 登成功、4625 登失败、4688 跑进程、4697 装服务、4720 建账户、4728 加组、4740 锁账户"**

#### 7. 持久化手段
> **"Run 键注册表启、计划任务定时起、服务装成系统级、WMI 无文件、票据伪造最难防"**

#### 8. 进程异常检测
> **"名不对、路不对、爹不对、签不对——四不对必可疑"**

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
| :--- | :--- |
| "Administrators 组权限最高" | ❌ 错误！SYSTEM 账户权限高于 Administrators |
| "UAC 是完全的安全边界" | ❌ 错误！UAC 不是安全边界，仅是一种便利性/安全性平衡机制 |
| "Sysmon 是 Windows 自带的" | ❌ 错误！Sysmon 是 Sysinternals 工具，需单独下载安装 |
| "Kerberos 替代了 NTLM" | ⚠️ 不准确！NTLM 在非域环境、IP 地址访问等场景仍会回退使用 |
| "事件 ID 4624 都是正常登录" | ❌ 错误！需关注 Logon Type、来源 IP、登录时间等上下文 |
| "注册表 Run 键只有 HKLM 有" | ❌ 错误！HKLM 和 HKCU 都有 Run 键，用户级无需管理员权限 |
| "Golden Ticket 需要域管理员权限" | ⚠️ 不准确！需要的是 KRBTGT 账户的哈希，获取方式多种多样 |

---

## 学习建议

1. 🏗️ **搭建 AD 实验环境**：安装 Windows Server + Windows 客户端，手工搭建小型 AD 域（DC + 两台成员机）
2. 🧪 **演练 AD 攻防**：账户创建、组策略下发、LDAP 查询、Kerberos 登录与委派、Mimikatz 凭据提取
3. 📖 **阅读官方文档**：Microsoft Windows 安全基线、事件 ID 说明文档
4. 🛠️ **熟练使用 Sysinternals**：Process Explorer、Process Monitor、Autoruns、PsExec、Sysmon
5. 📋 **建立检测对照表**：每种攻击手段都要对应到可观测的事件与日志
6. 🎯 **练习 CTF/靶场**：Hack The Box、攻防世界中的 Windows 题目

---

> **Windows 系统虽然庞大，但把它拆成"账户-权限-域-进程-服务-注册表-日志"七个模块，逐个击破，就不会那么迷茫。安全从业者不一定要成为 Windows 专家，但必须对"系统行为"有足够敏锐的直觉。**
