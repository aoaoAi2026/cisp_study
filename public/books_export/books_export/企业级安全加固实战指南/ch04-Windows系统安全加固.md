# 第四章 Windows系统安全加固

## 4.1 Windows加固概述

Windows操作系统在企业环境中应用广泛，尤其是在域环境、办公终端、文件服务器等场景。Windows的安全加固有其独特的体系和工具。

### 4.1.1 Windows安全风险特点

**Windows系统特有的安全风险：**
```
├── 域环境风险：域控制器沦陷=全局沦陷
├── 组策略风险：配置不当导致全域影响
├── SMB协议风险：永恒之蓝等漏洞利用
├── RDP远程桌面：暴力破解、蓝盾漏洞
├── PowerShell：脚本攻击、无文件攻击
├── Office宏病毒：钓鱼攻击主要载体
├── UAC绕过：权限提升常见手段
├── Windows注册表：大量安全配置入口
└── 第三方软件：补丁管理复杂
```

### 4.1.2 Windows加固层次

```
第一层：系统基线配置（组策略、注册表）
第二层：账户与权限安全
第三层：网络与防火墙
第四层：终端防护（杀毒、EDR、补丁）
第五层：应用与数据安全
第六层：日志审计与监控
第七层：域环境安全加固
```

## 4.2 账户与口令安全

### 4.2.1 本地账户管理

```powershell
# 查看所有本地账户
Get-LocalUser
net user

# 查看管理员组成员
Get-LocalGroupMember -Group "Administrators"
net localgroup administrators

# 禁用Guest账户
Disable-LocalUser -Name "Guest"
net user guest /active:no

# 禁用不必要的账户
Disable-LocalUser -Name "DefaultAccount"
Disable-LocalUser -Name "WDAGUtilityAccount"

# 重命名管理员账户（安全通过隐蔽性）
Rename-LocalUser -Name "Administrator" -NewName "WinAdmin"
# net user administrator NewAdminName /add  # 另一种方式

# 修改管理员账户描述
Set-LocalUser -Name "Administrator" -Description "系统内置管理员账户"

# 设置账户锁定策略
net accounts /lockoutthreshold:5
net accounts /lockoutduration:30
net accounts /lockoutwindow:30

# 查看账户锁定策略
net accounts
```

### 4.2.2 密码策略加固

**本地安全策略配置：**
```powershell
# 查看密码策略
net accounts

# 设置密码策略（本地组策略）
# 密码必须符合复杂性要求：已启用
# 密码长度最小值：12个字符
# 密码最短使用期限：7天
# 密码最长使用期限：90天
# 强制密码历史：5个记住的密码
# 用可还原的加密来存储密码：已禁用

# 通过secedit配置
secedit /export /cfg "$env:TEMP\secpol.cfg" /areas SECURITYPOLICY

# 修改配置后导入
secedit /configure /db "$env:windir\security\local.sdb" /cfg "$env:TEMP\secpol.cfg" /areas SECURITYPOLICY
```

**PowerShell配置密码策略（域环境）：**
```powershell
# 查看域密码策略
Get-ADDefaultDomainPasswordPolicy

# 设置域密码策略
Set-ADDefaultDomainPasswordPolicy -Identity "corp.com" `
    -MinPasswordLength 12 `
    -MaxPasswordAge "90.00:00:00" `
    -MinPasswordAge "7.00:00:00" `
    -PasswordHistoryCount 5 `
    -ComplexityEnabled $true `
    -ReversibleEncryptionEnabled $false `
    -LockoutThreshold 5 `
    -LockoutDuration "00:30:00" `
    -LockoutObservationWindow "00:30:00"
```

### 4.2.3 内置账户安全

```powershell
# 检查并加固内置账户

# 1. Administrator账户
# 禁用内置管理员（改用其他管理员账户）
Disable-LocalUser -Name "Administrator"

# 2. Guest账户
Disable-LocalUser -Name "Guest"

# 3. DefaultAccount
Disable-LocalUser -Name "DefaultAccount" -ErrorAction SilentlyContinue

# 4. 检查所有启用的账户
Get-LocalUser | Where-Object { $_.Enabled -eq $true } | Select-Object Name, Enabled, LastLogon

# 5. 检查账户描述
Get-LocalUser | Select-Object Name, Description

# 6. 检查密码永不过期的账户
Get-LocalUser | Where-Object { $_.PasswordExpires -eq $null } | Select-Object Name, PasswordExpires

# 设置密码过期（针对非服务账户）
Set-LocalUser -Name "username" -PasswordNeverExpires $false
```

## 4.3 组策略安全加固

### 4.3.1 本地组策略配置要点

**计算机配置 → Windows设置 → 安全设置：**

```
账户策略
├── 密码策略
│   ├── 密码必须符合复杂性要求：已启用
│   ├── 密码长度最小值：12个字符
│   ├── 密码最短使用期限：7天
│   ├── 密码最长使用期限：90天
│   ├── 强制密码历史：5个记住的密码
│   └── 用可还原的加密来存储密码：已禁用
│
└── 账户锁定策略
    ├── 账户锁定阈值：5次无效登录
    ├── 账户锁定时间：30分钟
    └── 重置账户锁定计数器：30分钟后

本地策略
├── 审核策略
│   ├── 审核登录事件：成功,失败
│   ├── 审核账户管理：成功,失败
│   ├── 审核对象访问：成功,失败
│   ├── 审核策略更改：成功,失败
│   ├── 审核特权使用：失败
│   ├── 审核系统事件：成功,失败
│   └── 审核进程跟踪：成功,失败
│
├── 用户权限分配
│   ├── 从网络访问此计算机：Administrators, Users
│   ├── 允许本地登录：Administrators
│   ├── 拒绝本地登录：Guest
│   ├── 拒绝从网络访问这台计算机：Guest, Support_388945a0
│   ├── 关闭系统：Administrators
│   ├── 取得文件或其他对象的所有权：Administrators
│   └── 调试程序：Administrators（建议移除Users）
│
└── 安全选项
    ├── 交互式登录:不显示最后的用户名：已启用
    ├── 交互式登录:密码过期警告：14天
    ├── 交互式登录:无需按 Ctrl+Alt+Del：已禁用
    ├── 网络访问:不允许SAM账户的匿名枚举：已启用
    ├── 网络访问:不允许SAM账户和共享的匿名枚举：已启用
    ├── 网络访问:限制匿名访问命名管道和共享：已启用
    ├── 网络安全:LAN管理器身份验证级别：发送 NTLMv2 响应
    ├── 网络安全:在超过登录时间后强制注销：已启用
    ├── 设备:只有本地登录的用户才能访问CD-ROM：已启用
    ├── 设备:只有本地登录的用户才能访问软盘：已启用
    └── 关机:允许系统在未登录前关机：已禁用
```

### 4.3.2 重要注册表加固项

```powershell
# 禁用自动运行（防U盘病毒）
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "NoDriveTypeAutoRun" -Value 255 -Type DWord
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "NoAutoRun" -Value 1 -Type DWord

# 隐藏上一次登录用户名
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" -Name "dontdisplaylastusername" -Value 1 -Type DWord

# 禁用Windows Installer
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Installer" -Name "DisableMSI" -Value 2 -Type DWord

# 限制PowerShell执行策略
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
# 或者更严格
# Set-ExecutionPolicy -ExecutionPolicy AllSigned -Scope LocalMachine

# 禁用SMBv1（防永恒之蓝）
Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol
Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force

# 启用Windows Defender
Set-MpPreference -DisableRealtimeMonitoring $false
Set-MpPreference -DisableBehaviorMonitoring $false

# 禁用Telnet客户端
Disable-WindowsOptionalFeature -Online -FeatureName TelnetClient

# 禁用TFTP
Disable-WindowsOptionalFeature -Online -FeatureName TFTP

# 禁用远程注册表
Set-Service -Name RemoteRegistry -StartupType Disabled
Stop-Service -Name RemoteRegistry -Force

# 禁用SSDP发现
Set-Service -Name SSDPSRV -StartupType Disabled
Stop-Service -Name SSDPSRV -Force

# 禁用UPnP设备主机
Set-Service -Name upnphost -StartupType Disabled
Stop-Service -Name upnphost -Force
```

## 4.4 网络与防火墙

### 4.4.1 Windows防火墙配置

```powershell
# 查看防火墙状态
Get-NetFirewallProfile
netsh advfirewall show allprofiles

# 启用所有配置文件的防火墙
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
netsh advfirewall set allprofiles state on

# 设置默认入站规则阻止，出站规则允许
Set-NetFirewallProfile -DefaultInboundAction Block -DefaultOutboundAction Allow

# 查看现有规则
Get-NetFirewallRule | Where-Object { $_.Enabled -eq "True" } | Select-Object DisplayName, Direction, Action

# 放行特定端口
# 放行RDP（仅允许特定IP，示例）
New-NetFirewallRule -DisplayName "Allow RDP from Internal" `
    -Direction Inbound -Protocol TCP -LocalPort 3389 `
    -RemoteAddress "192.168.1.0/24" -Action Allow

# 放行Web服务
New-NetFirewallRule -DisplayName "Allow HTTP" `
    -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow

New-NetFirewallRule -DisplayName "Allow HTTPS" `
    -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow

# 禁用危险的入站规则
Disable-NetFirewallRule -DisplayName "文件和打印机共享" -Direction Inbound
Disable-NetFirewallRule -DisplayName "远程协助" -Direction Inbound

# 阻止特定出站连接（可选，严格环境）
# New-NetFirewallRule -DisplayName "Block PowerShell to Internet" `
#     -Direction Outbound -Program "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" `
#     -RemoteAddress "Internet" -Action Block

# 重置防火墙到默认状态（谨慎使用）
# netsh advfirewall reset
```

### 4.4.2 网络协议加固

```powershell
# 禁用NetBIOS over TCP/IP
$adapters = Get-WmiObject -Class Win32_NetworkAdapterConfiguration | Where-Object { $_.IPEnabled -eq $true }
foreach ($adapter in $adapters) {
    $adapter.SetTcpipNetbios(2)  # 2 = 禁用NetBIOS
}

# 禁用LLMNR
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient" -Name "EnableMulticast" -Value 0 -Type DWord

# 禁用WPAD（防中间人攻击）
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Internet Settings\WinHttp" -Name "DisableAutoDiscovery" -Value 1 -Type DWord

# 启用SMB签名
Set-SmbServerConfiguration -RequireSecuritySignature $true -EnableSecuritySignature $true -Force
Set-SmbClientConfiguration -RequireSecuritySignature $true -EnableSecuritySignature $true -Force

# 配置TLS版本（优先TLS 1.2）
# 启用TLS 1.2
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server" -Name "Enabled" -Value 1 -Type DWord
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server" -Name "DisabledByDefault" -Value 0 -Type DWord

# 禁用SSL 3.0
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\SSL 3.0\Server" -Name "Enabled" -Value 0 -Type DWord
```

## 4.5 RDP远程桌面加固

### 4.5.1 RDP安全配置

```powershell
# 检查RDP状态
Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" -Name "fDenyTSConnections"

# 启用RDP（按需）
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" -Name "fDenyTSConnections" -Value 0

# 禁用RDP（不需要则禁用）
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" -Name "fDenyTSConnections" -Value 1

# 网络级别身份验证（NLA）- 必须启用
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" -Name "UserAuthentication" -Value 1

# 设置RDP加密级别为高
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" -Name "MinEncryptionLevel" -Value 3

# 限制RDP用户组
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" -Name "fSingleSessionPerUser" -Value 1

# 修改RDP默认端口（安全通过隐蔽性，不建议单独依赖）
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" -Name "PortNumber" -Value 33890

# 防火墙同步放行新端口
New-NetFirewallRule -DisplayName "Allow RDP on 33890" -Direction Inbound -Protocol TCP -LocalPort 33890 -Action Allow

# 重启RDP服务
Restart-Service -Name TermService -Force
```

### 4.5.2 RDP安全最佳实践

```
RDP安全检查清单：
□ 启用网络级别身份验证(NLA)
□ 使用VPN或跳板机访问，不直接暴露公网
□ 修改默认端口（辅助手段）
□ 限制允许登录的用户组
□ 启用账户锁定策略
□ 使用强密码或双因素认证
□ 限制可连接的来源IP
□ 启用RDP日志审计
□ 定期检查RDP登录日志
□ 及时安装RDP相关安全补丁
```

**检查RDP登录日志：**
```powershell
# 查看RDP成功登录
Get-WinEvent -FilterHashtable @{
    LogName = 'Security'
    ID = 4624
    StartTime = (Get-Date).AddDays(-7)
} | Where-Object { $_.Message -match 'LogonType.*\s10\s' } | Select-Object -First 20

# 查看RDP失败登录
Get-WinEvent -FilterHashtable @{
    LogName = 'Security'
    ID = 4625
    StartTime = (Get-Date).AddDays(-7)
} | Select-Object -First 20
```

## 4.6 补丁与更新管理

### 4.6.1 Windows Update配置

```powershell
# 查看更新状态
Get-WindowsUpdateLog

# 检查已安装的更新
Get-HotFix
wmic qfe list

# 配置自动更新
# 设置为自动下载并安装
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update" -Name "AUOptions" -Value 4 -Type DWord

# AUOptions值说明：
# 1 = 禁用自动更新
# 2 = 通知下载和安装
# 3 = 自动下载并通知安装
# 4 = 自动下载并计划安装

# 配置更新安装时间
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update" -Name "ScheduledInstallDay" -Value 0 -Type DWord  # 0 = 每天
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update" -Name "ScheduledInstallTime" -Value 3 -Type DWord  # 3 = 凌晨3点

# 检查关键补丁（MS17-010 永恒之蓝示例）
Get-HotFix | Where-Object { $_.HotFixID -in @("KB4012212", "KB4012213", "KB4012214", "KB4012215", "KB4012216", "KB4012217") }
```

### 4.6.2 WSUS企业级更新管理

```powershell
# 配置客户端指向WSUS服务器
$WSUSServer = "http://wsus.corp.com:8530"

Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" -Name "WUServer" -Value $WSUSServer
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" -Name "WUStatusServer" -Value $WSUSServer

# 配置更新组
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" -Name "TargetGroup" -Value "Servers"
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" -Name "TargetGroupEnabled" -Value 1 -Type DWord

# 强制检测更新
usoclient StartScan
```

## 4.7 Windows Defender配置

### 4.7.1 Defender策略配置

```powershell
# 查看Defender状态
Get-MpComputerStatus

# 启用实时保护
Set-MpPreference -DisableRealtimeMonitoring $false

# 启用云提供的保护
Set-MpPreference -DisableBlockAtFirstSeen $false

# 启用行为监控
Set-MpPreference -DisableBehaviorMonitoring $false

# 启用脚本扫描
Set-MpPreference -DisableScriptScanning $false

# 启用PUA保护（可能不需要的应用）
Set-MpPreference -PUAProtection Enabled

# 配置扫描计划
# 每日快速扫描
Set-MpPreference -ScanScheduleDay Everyday
Set-MpPreference -ScanScheduleTime 0x3  # 凌晨3点

# 每周完全扫描
Set-MpPreference -ScanParameters 2
Set-MpPreference -RemediationScheduleDay Saturday
Set-MpPreference -RemediationScheduleTime 0x2  # 凌晨2点

# 排除项配置（谨慎添加）
# Add-MpPreference -ExclusionPath "D:\VMs"
# Add-MpPreference -ExclusionProcess "sqlservr.exe"
```

### 4.7.2 Defender攻击面减少(ASR)

```powershell
# 启用攻击面减少规则
# 阻止Office应用创建子进程
Add-MpPreference -AttackSurfaceReductionRules_Ids D4F940AB-401B-4EFC-AADC-AD5F3C50688A `
    -AttackSurfaceReductionRules_Actions Enabled

# 阻止Office应用注入到其他进程
Add-MpPreference -AttackSurfaceReductionRules_Ids 75668C1F-73B5-4CF0-BB93-3ECF5CB7CC84 `
    -AttackSurfaceReductionRules_Actions Enabled

# 阻止Office应用创建可执行内容
Add-MpPreference -AttackSurfaceReductionRules_Ids 3B576869-A4EC-4529-8536-B80A7769E899 `
    -AttackSurfaceReductionRules_Actions Enabled

# 阻止从Office宏中调用Win32 API
Add-MpPreference -AttackSurfaceReductionRules_Ids 92E97FA1-2EDF-4476-BDD6-9DD0B4DDDC7B `
    -AttackSurfaceReductionRules_Actions Enabled

# 阻止JS/VBS脚本启动下载的可执行内容
Add-MpPreference -AttackSurfaceReductionRules_Ids D3E037E1-3EB8-44C8-A917-57927947596D `
    -AttackSurfaceReductionRules_Actions Enabled

# 阻止从电子邮件客户端/Webmail执行的可执行内容
Add-MpPreference -AttackSurfaceReductionRules_Ids BE9BA2D9-53EA-4CDC-84E5-9B1EEEE46550 `
    -AttackSurfaceReductionRules_Actions Enabled

# 查看ASR规则状态
Get-MpPreference | Select-Object -Property AttackSurfaceReductionRules_*
```

## 4.8 日志与审计

### 4.8.1 配置安全审计

```powershell
# 查看当前审计策略
auditpol /get /category:*

# 配置高级审计策略
# 账户登录
auditpol /set /subcategory:"凭据验证" /success:enable /failure:enable
auditpol /set /subcategory:"Kerberos身份验证服务" /success:enable /failure:enable
auditpol /set /subcategory:"Kerberos服务票证操作" /success:enable /failure:enable

# 账户管理
auditpol /set /subcategory:"用户账户管理" /success:enable /failure:enable
auditpol /set /subcategory:"计算机账户管理" /success:enable /failure:enable
auditpol /set /subcategory:"安全组管理" /success:enable /failure:enable
auditpol /set /subcategory:"分发组管理" /success:enable /failure:enable
auditpol /set /subcategory:"其他账户管理事件" /success:enable /failure:enable

# 登录/注销
auditpol /set /subcategory:"登录" /success:enable /failure:enable
auditpol /set /subcategory:"注销" /success:enable /failure:enable
auditpol /set /subcategory:"账户锁定" /success:enable /failure:enable
auditpol /set /subcategory:"IPsec主模式" /success:enable /failure:enable
auditpol /set /subcategory:"IPsec快速模式" /success:enable /failure:enable
auditpol /set /subcategory:"特殊登录" /success:enable /failure:enable
auditpol /set /subcategory:"其他登录/注销事件" /success:enable /failure:enable

# 对象访问
auditpol /set /subcategory:"文件系统" /success:enable /failure:enable
auditpol /set /subcategory:"注册表" /success:enable /failure:enable
auditpol /set /subcategory:"内核对象" /success:disable /failure:disable
auditpol /set /subcategory:"SAM" /success:enable /failure:enable

# 策略更改
auditpol /set /subcategory:"审计策略更改" /success:enable /failure:enable
auditpol /set /subcategory:"身份验证策略更改" /success:enable /failure:enable
auditpol /set /subcategory:"授权策略更改" /success:enable /failure:enable
auditpol /set /subcategory:"筛选平台策略更改" /success:enable /failure:enable
auditpol /set /subcategory:"MPSSVC规则级别策略更改" /success:enable /failure:enable

# 特权使用
auditpol /set /subcategory:"敏感特权使用" /success:enable /failure:enable
auditpol /set /subcategory:"非敏感特权使用" /success:disable /failure:disable
auditpol /set /subcategory:"其他特权使用事件" /success:enable /failure:enable

# 系统
auditpol /set /subcategory:"安全状态更改" /success:enable /failure:enable
auditpol /set /subcategory:"安全系统扩展" /success:enable /failure:enable
auditpol /set /subcategory:"系统完整性" /success:enable /failure:enable
auditpol /set /subcategory:"IPsec驱动程序" /success:enable /failure:enable
auditpol /set /subcategory:"其他系统事件" /success:enable /failure:enable

# 详细跟踪
auditpol /set /subcategory:"进程创建" /success:enable /failure:disable
auditpol /set /subcategory:"进程终止" /success:disable /failure:disable
auditpol /set /subcategory:"RPC事件" /success:disable /failure:disable
auditpol /set /subcategory:"DPAPI活动" /success:enable /failure:enable

# 保存审计策略到文件
auditpol /backup /file:"C:\audit_policy.csv"
```

### 4.8.2 事件日志配置

```powershell
# 配置日志大小
# 安全日志 - 200MB
wevtutil sl Security /ms:209715200

# 系统日志 - 100MB
wevtutil sl System /ms:104857600

# 应用程序日志 - 100MB
wevtutil sl Application /ms:104857600

# 设置日志覆盖策略（按需覆盖旧日志）
wevtutil sl Security /rt:true /ab:false

# 转发事件到SIEM系统（示例）
# wecutil qc /quiet
# wecutil cs subscription.xml
```

**关键事件ID监控清单：**
```
账户安全：
4624 - 成功登录
4625 - 登录失败
4634 - 账户注销
4647 - 用户启动注销
4720 - 创建用户账户
4722 - 启用用户账户
4723 - 尝试更改密码
4724 - 尝试重置密码
4725 - 禁用用户账户
4726 - 删除用户账户
4727 - 创建安全组
4728 - 成员添加到安全组
4729 - 成员从安全组移除
4732 - 成员添加到本地组
4735 - 安全组属性更改
4740 - 用户账户被锁定

特权操作：
4672 - 使用特殊权限登录
4673 - 特权服务调用
4674 - 特权操作尝试
4698 - 创建计划任务
4699 - 删除计划任务
4700 - 启用计划任务
4701 - 禁用计划任务
4702 - 更新计划任务

系统关键：
4697 - 服务安装
7045 - 服务安装（系统日志）
4616 - 系统时间更改
4904 - 安全事件注册
4905 - 安全事件取消注册
```

## 4.9 PowerShell安全

### 4.9.1 执行策略

```powershell
# 查看当前执行策略
Get-ExecutionPolicy -List

# 设置执行策略
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine

# 执行策略级别（从最宽松到最严格）：
# Bypass - 不阻止，无警告
# Unrestricted - 允许所有，远程脚本有警告
# RemoteSigned - 本地脚本可运行，远程脚本需签名
# AllSigned - 所有脚本必须有可信签名
# Restricted - 不允许运行脚本，只能交互
# Undefined - 未设置，使用父作用域策略

# 各作用域优先级：
# 1. MachinePolicy（组策略-计算机）
# 2. UserPolicy（组策略-用户）
# 3. Process（当前进程，临时）
# 4. CurrentUser（当前用户）
# 5. LocalMachine（本机）
```

### 4.9.2 PowerShell日志与防护

```powershell
# 启用PowerShell模块日志记录
$regPath = "HKLM:\SOFTWARE\Wow6432Node\Policies\Microsoft\Windows\PowerShell\ModuleLogging"
New-Item -Path $regPath -Force
Set-ItemProperty -Path $regPath -Name "EnableModuleLogging" -Value 1 -Type DWord
Set-ItemProperty -Path $regPath -Name "ModuleNames" -Value "*" -Type String

# 启用PowerShell脚本块日志记录
$regPath = "HKLM:\SOFTWARE\Wow6432Node\Policies\Microsoft\Windows\PowerShell\ScriptBlockLogging"
New-Item -Path $regPath -Force
Set-ItemProperty -Path $regPath -Name "EnableScriptBlockLogging" -Value 1 -Type DWord
Set-ItemProperty -Path $regPath -Name "EnableScriptBlockInvocationLogging" -Value 1 -Type DWord

# 启用PowerShell转录
$regPath = "HKLM:\SOFTWARE\Wow6432Node\Policies\Microsoft\Windows\PowerShell\Transcription"
New-Item -Path $regPath -Force
Set-ItemProperty -Path $regPath -Name "EnableTranscripting" -Value 1 -Type DWord
Set-ItemProperty -Path $regPath -Name "EnableInvocationHeader" -Value 1 -Type DWord
Set-ItemProperty -Path $regPath -Name "OutputDirectory" -Value "C:\PSLogs" -Type String

# 约束语言模式
# $ExecutionContext.SessionState.LanguageMode = "ConstrainedLanguage"
# 注意：约束语言模式会限制很多功能，需谨慎使用
```

## 4.10 域环境加固

### 4.10.1 域控制器安全

```powershell
# 域控制器安全检查清单
<#
□ 物理安全：域控制器在安全机房
□ 账户安全：Administrator账户重命名并禁用，使用DSRM账户
□ 补丁管理：及时安装安全补丁
□ 备份策略：每日系统状态备份
□ 监控告警：登录异常、权限变更实时告警
□ 时间同步：可靠的NTP时间源
□ 只读域控制器：分支机构部署RODC
□ 管理主机：专用管理终端登录DC
#>

# 检查域功能级别
Get-ADDomain | Select-Object Name, DomainMode, ForestMode

# 检查域控制器列表
Get-ADDomainController -Filter * | Select-Object Name, Site, OperatingSystem

# 检查域管理员组成员
Get-ADGroupMember -Identity "Domain Admins" -Recursive | Select-Object Name, SamAccountName

# 检查企业管理员组成员
Get-ADGroupMember -Identity "Enterprise Admins" -Recursive | Select-Object Name, SamAccountName

# 检查架构管理员组成员
Get-ADGroupMember -Identity "Schema Admins" -Recursive | Select-Object Name, SamAccountName

# 检查受保护的用户组（敏感账户保护）
Get-ADGroupMember -Identity "Protected Users" -Recursive | Select-Object Name

# 检查AdminSDHolder受保护账户
Get-ADUser -Filter {adminCount -eq 1} -Properties adminCount | Select-Object Name, SamAccountName, adminCount
```

### 4.10.2 组策略安全设计

```
组策略最佳实践：
1. 最小权限原则
   - 用户加入普通用户组，不加入本地管理员
   - 仅IT管理员有域管理员权限

2. 密码与账户策略
   - 密码长度≥12位
   - 密码复杂度启用
   - 账户锁定策略启用
   - Kerberos策略配置合理

3. 安全选项配置
   - 交互式登录不显示上次用户名
   - 限制匿名枚举
   - NTLMv2认证
   - UAC启用

4. 软件限制
   - AppLocker应用白名单
   - 禁止未经授权的软件安装
   - 限制PowerShell执行策略

5. 审计策略
   - 启用高级安全审计
   - 配置合理的日志大小
   - 日志集中收集
```

## 4.11 加固验证脚本

```powershell
# Windows安全加固快速检查脚本
# 以管理员身份运行

Write-Host "===== Windows安全加固检查 =====" -ForegroundColor Cyan
Write-Host "主机名: $env:COMPUTERNAME"
Write-Host "系统: $((Get-CimInstance Win32_OperatingSystem).Caption)"
Write-Host ""

$pass = 0
$fail = 0

function Check-Pass($msg) {
    Write-Host "[PASS] " -ForegroundColor Green -NoNewline
    Write-Host $msg
    $script:pass++
}

function Check-Fail($msg) {
    Write-Host "[FAIL] " -ForegroundColor Red -NoNewline
    Write-Host $msg
    $script:fail++
}

# 1. 检查防火墙
Write-Host "【1. 防火墙检查】" -ForegroundColor Yellow
$firewallStatus = Get-NetFirewallProfile | Where-Object { $_.Enabled -eq "True" }
if ($firewallStatus.Count -ge 3) {
    Check-Pass "所有防火墙配置文件已启用"
} else {
    Check-Fail "部分防火墙配置文件未启用"
}

# 2. 检查自动更新
Write-Host ""
Write-Host "【2. 自动更新检查】" -ForegroundColor Yellow
$au = Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update" -ErrorAction SilentlyContinue
if ($au.AUOptions -eq 4) {
    Check-Pass "自动更新已启用（自动下载并安装）"
} else {
    Check-Fail "自动更新未正确配置"
}

# 3. 检查Guest账户
Write-Host ""
Write-Host "【3. Guest账户检查】" -ForegroundColor Yellow
$guest = Get-LocalUser -Name "Guest" -ErrorAction SilentlyContinue
if ($guest -and !$guest.Enabled) {
    Check-Pass "Guest账户已禁用"
} else {
    Check-Fail "Guest账户状态异常"
}

# 4. 检查密码策略
Write-Host ""
Write-Host "【4. 密码策略检查】" -ForegroundColor Yellow
$accounts = net accounts
$minLen = ($accounts | Select-String "密码长度最小值").ToString().Split(" ")[-1]
if ([int]$minLen -ge 8) {
    Check-Pass "密码最小长度: $minLen 位"
} else {
    Check-Fail "密码最小长度不足: $minLen 位"
}

# 5. 检查Defender
Write-Host ""
Write-Host "【5. Defender检查】" -ForegroundColor Yellow
$defender = Get-MpComputerStatus -ErrorAction SilentlyContinue
if ($defender -and $defender.RealTimeProtectionEnabled) {
    Check-Pass "Defender实时保护已启用"
} else {
    Check-Fail "Defender未启用或不存在"
}

# 6. 检查SMBv1
Write-Host ""
Write-Host "【6. SMBv1检查】" -ForegroundColor Yellow
$smb1 = Get-WindowsOptionalFeature -Online -FeatureName SMB1Protocol -ErrorAction SilentlyContinue
if ($smb1 -and $smb1.State -eq "Disabled") {
    Check-Pass "SMBv1协议已禁用"
} else {
    Check-Fail "SMBv1协议未禁用"
}

# 7. 检查RDP NLA
Write-Host ""
Write-Host "【7. RDP安全检查】" -ForegroundColor Yellow
$rdpNLA = (Get-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" -Name UserAuthentication -ErrorAction SilentlyContinue).UserAuthentication
if ($rdpNLA -eq 1) {
    Check-Pass "RDP网络级别身份验证已启用"
} else {
    Check-Fail "RDP网络级别身份验证未启用"
}

# 汇总
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "检查结果：通过 $pass 项，失败 $fail 项" -ForegroundColor White
$total = $pass + $fail
if ($total -gt 0) {
    $rate = [math]::Round($pass * 100 / $total, 1)
    Write-Host "合规率: $rate%" -ForegroundColor Cyan
}
Write-Host "================================" -ForegroundColor Cyan
```

## 4.12 本章小结

本章全面介绍了Windows系统安全加固：

1. **账户安全**：本地账户管理、密码策略、内置账户加固
2. **组策略加固**：本地策略配置、注册表安全项
3. **网络与防火墙**：Windows防火墙、网络协议加固
4. **RDP远程桌面**：安全配置、最佳实践、日志审计
5. **补丁管理**：Windows Update、WSUS企业级管理
6. **Windows Defender**：基础配置、攻击面减少(ASR)
7. **日志审计**：高级审计策略、关键事件ID监控
8. **PowerShell安全**：执行策略、脚本日志、防护配置
9. **域环境加固**：域控制器安全、组策略设计

下一章将进入网络设备安全加固的内容。

---

**实战作业：**
1. 找一台Windows服务器，运行本章的检查脚本
2. 对比CIS Windows Benchmark，找出差距
3. 配置PowerShell脚本块日志，观察攻击检测效果
