# 第11章 ATT&CK攻防靶场搭建

## 11.1 MITRE ATT&CK 框架介绍

### 11.1.1 什么是ATT&CK

MITRE ATT&CK（Adversarial Tactics, Techniques, and Common Knowledge）是由MITRE公司发起的一个知识库项目，用于描述攻击者在攻击过程中可能使用的战术（Tactics）和技术（Techniques）。

ATT&CK框架基于真实的攻击事件观察，提供了一个通用的语言和分类体系，用于描述攻击者的行为模式。

**官方网站**：https://attack.mitre.org/

### 11.1.2 ATT&CK的核心概念

#### 战术（Tactics）

战术是攻击者的短期目标，描述了攻击者为什么要执行某个操作。ATT&CK企业矩阵包含以下14个战术：

1. **初始访问（Initial Access）**：获取进入网络/系统的入口
2. **执行（Execution）**：在目标系统上运行恶意代码
3. **持久化（Persistence）**：保持对系统的持续访问
4. **权限提升（Privilege Escalation）**：获得更高的权限
5. **防御规避（Defense Evasion）**：躲避安全检测和防护
6. **凭证访问（Credential Access）**：窃取账户名和密码等凭证
7. **发现（Discovery）**：探索和了解目标环境
8. **横向移动（Lateral Movement）**：在网络中移动传播
9. **收集（Collection）**：收集目标相关的数据
10. **命令与控制（Command and Control）**：与被控系统通信
11. **数据渗出（Exfiltration）**：窃取并传输数据
12. **影响（Impact）**：操纵、中断或破坏系统和数据
13. **侦察（Reconnaissance）**：攻击前的信息收集
14. **资源开发（Resource Development）**：建立攻击所需的资源

#### 技术（Techniques）

技术描述了攻击者如何实现某个战术目标。每个战术下包含多个技术，每个技术下可能还有子技术（Sub-techniques）。

例如：
- 战术：凭证访问
  - 技术：输入捕获（T1056）
    - 子技术：Keylogging（T1056.001）
  - 技术：凭证转储（T1003）
    - 子技术：LSASS内存（T1003.001）
    - 子技术：SAM数据库（T1003.002）

#### 程序（Procedures）

程序是攻击者使用某项技术的具体实现方式，是对技术的具体实例化。

### 11.1.3 ATT&CK矩阵

ATT&CK提供了多种矩阵，适用于不同的场景：

1. **企业矩阵（Enterprise）**：针对企业网络环境
2. **移动矩阵（Mobile）**：针对移动设备
3. **工业控制系统矩阵（ICS）**：针对工业控制系统
4. **网络矩阵（Network）**：针对网络设备

### 11.1.4 ATT&CK的应用场景

- **红蓝对抗**：红队使用ATT&CK模拟攻击，蓝队使用ATT&CK进行防御
- **威胁情报**：使用ATT&CK描述和分类威胁情报
- **安全评估**：基于ATT&CK评估防御能力
- **安全产品**：安全产品厂商使用ATT&CK描述检测能力
- **安全培训**：使用ATT&CK进行安全意识和技术培训

### 11.1.5 学习ATT&CK的资源

- **官方网站**：https://attack.mitre.org/
- **ATT&CK Navigator**：https://mitre-attack.github.io/attack-navigator/
- **MITRE CTID**：https://center.mitre.org/
- **GitHub**：https://github.com/mitre-attack

---

## 11.2 Atomic Red Team 安装与使用

### 11.2.1 Atomic Red Team 简介

Atomic Red Team是一个基于ATT&CK框架的测试库，提供了大量的原子测试（Atomic Tests），每个测试对应ATT&CK中的一项技术，可以帮助安全团队验证检测和防护能力。

**项目地址**：https://github.com/redcanaryco/atomic-red-team

**主要特点**：
- 基于ATT&CK框架组织
- 每个测试都有详细的文档
- 支持Windows、Linux、macOS
- 简单易用，一键执行
- 可以与其他工具集成

### 11.2.2 Atomic Red Team 结构

Atomic Red Team的目录结构如下：

```
atomic-red-team/
├── atomics/                 # 原子测试目录
│   ├── T1059/             # 对应ATT&CK技术编号
│   │   ├── T1059.md        # 技术说明文档
│   │   └── src/             # 测试脚本和源码
│   ├── T1003/
│   │   ├── T1003.md
│   │   └── src/
│   └── ...
├── docs/                    # 文档
├── execution-framework/       # 执行框架
├── install.ps1              # 安装脚本
└── README.md
```

每个技术目录下包含：
- **Markdown文档**：描述技术原理、测试步骤、预期结果等
- **src目录**：测试所需的脚本、二进制文件

### 11.2.3 安装 Invoke-AtomicRedTeam

Invoke-AtomicRedTeam是Atomic Red Team的PowerShell执行框架，用于方便地执行原子测试。

#### 【Windows环境】Windows系统安装

**步骤1：设置执行策略**

```bash
# 操作位置：PowerShell（管理员）
# 设置执行策略
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 验证执行策略
Get-ExecutionPolicy
# 预期输出：RemoteSigned
```

**步骤2：安装Invoke-AtomicRedTeam**

```bash
# 操作位置：PowerShell（管理员）
# 方法1：使用安装脚本
IEX (IWR 'https://raw.githubusercontent.com/redcanaryco/invoke-atomicredteam/master/install-atomicredteam.ps1' -UseBasicParsing);
Install-AtomicRedTeam -getAtomics

# 方法2：使用PowerShell模块安装
Install-Module -Name AtomicRedTeam -Scope CurrentUser -Force
Import-Module AtomicRedTeam
```

**步骤3：验证安装**

```bash
# 操作位置：PowerShell
# 验证模块安装
Get-Module -ListAvailable AtomicRedTeam

# 查看版本
(Get-Module AtomicRedTeam).Version
# 预期输出：显示版本号
```

**步骤4：手动安装（如果网络有问题）**

```bash
# 操作位置：PowerShell（管理员）
# 手动下载项目
cd C:\Tools
git clone https://github.com/redcanaryco/invoke-atomicredteam.git
git clone https://github.com/redcanaryco/atomic-red-team.git

# 导入模块
Import-Module C:\Tools\invoke-atomicredteam\Invoke-AtomicRedTeam.psd1 -Force

# 设置Atomic路径
$PSDefaultParameterValues["Invoke-AtomicTest:PathToAtomicsFolder"] = "C:\Tools\atomic-red-team\atomics"
```

#### 【Linux环境】Linux/macOS安装

Atomic Red Team主要支持Windows，但也有Linux和macOS的测试用例。

```bash
# 操作位置：终端
# 下载项目
cd /opt
git clone https://github.com/redcanaryco/atomic-red-team.git

# 设置执行权限
chmod +x atomic-red-team/atomics/*/src/*
```

### 11.2.4 基本使用

#### 1. 查看可用的原子测试

```bash
# 操作位置：PowerShell
# 列出所有原子测试（简要信息）
Invoke-AtomicTest All -ShowDetailsBrief

# 查看指定技术的测试
Invoke-AtomicTest T1055 -ShowDetailsBrief

# 查看测试详细信息
Invoke-AtomicTest T1059.001 -ShowDetails
```

#### 2. 执行原子测试

```bash
# 操作位置：PowerShell
# 执行单个测试
Invoke-AtomicTest T1059.001
# 预期输出：显示测试执行过程和结果

# 执行测试前先获取依赖项
Invoke-AtomicTest T1059.001 -GetPrereqs
# 预期输出：下载测试所需的依赖

# 执行测试并清理
Invoke-AtomicTest T1059.001 -Cleanup
# 预期输出：清理测试产生的文件和配置

# 只执行特定编号的测试
Invoke-AtomicTest T1059.001 -TestNumbers 1
```

#### 3. 按战术执行测试

```bash
# 操作位置：PowerShell
# 按战术执行
Invoke-AtomicTest "Credential Access" -ShowDetailsBrief

# 执行特定平台的测试
Invoke-AtomicTest T1059.001 -Platforms Windows
```

### 11.2.5 常用原子测试示例

#### 1. T1003.001 - LSASS内存凭证转储

```bash
# 操作位置：PowerShell（管理员）
# 查看详细信息
Invoke-AtomicTest T1003.001 -ShowDetails

# 执行测试
Invoke-AtomicTest T1003.001
# 预期输出：显示凭证转储的过程
```

#### 2. T1059.001 - PowerShell执行

```bash
# 操作位置：PowerShell（管理员）
Invoke-AtomicTest T1059.001
# 预期输出：执行PowerShell命令
```

#### 3. T1027 - 混淆文件和信息

```bash
# 操作位置：PowerShell（管理员）
Invoke-AtomicTest T1027
# 预期输出：显示文件混淆操作
```

#### 4. T1548 - 滥用 elevation 控制

```bash
# 操作位置：PowerShell（管理员）
Invoke-AtomicTest T1548
# 预期输出：显示权限提升操作
```

#### 5. T1053 - 计划任务/作业

```bash
# 操作位置：PowerShell（管理员）
Invoke-AtomicTest T1053
# 预期输出：创建计划任务
```

### 11.2.6 使用技巧

```bash
# 操作位置：PowerShell
# 1. 先看详情再执行
Invoke-AtomicTest T1059.001 -ShowDetails

# 2. 检查依赖
Invoke-AtomicTest T1059.001 -GetPrereqs

# 3. 及时清理
Invoke-AtomicTest T1059.001 -Cleanup

# 4. 按平台过滤
Invoke-AtomicTest T1059.001 -Platforms Windows

# 5. 记录结果
Invoke-AtomicTest T1059.001 -SessionOutputFormat File -SessionOutputPath C:\AtomicResults\
```

### 11.2.7 常见问题

**问题1：执行策略被禁止**

```
原因：PowerShell执行策略限制了脚本执行
解决方法：
1. 以管理员身份运行PowerShell
2. 设置执行策略：Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
3. 确认：Get-ExecutionPolicy
```

**问题2：无法下载依赖**

```
原因：网络问题或防火墙阻止
解决方法：
1. 检查网络连接
2. 使用代理
3. 手动下载依赖文件
```

**问题3：测试执行失败**

```
原因：权限不足或系统环境不支持
解决方法：
1. 确保以管理员身份运行
2. 检查系统环境要求
3. 查看测试详细输出
```

---

## 11.3 CALDERA 攻击模拟平台

### 11.3.1 CALDERA 简介

CALDERA是MITRE开发的一个自动化攻击模拟平台，基于ATT&CK框架，可以自动化地执行红队操作，帮助组织评估防御能力。

**官方网站**：https://caldera.mitre.org/
**GitHub**：https://github.com/mitre/caldera

**主要特点**：
- 基于ATT&CK框架
- 自动化攻击模拟
- 插件化架构
- 支持红蓝对抗
- 报告生成
- REST API

### 11.3.2 CALDERA 架构

CALDERA采用C/S架构：
- **服务端（Server）**：控制中心，提供Web界面和REST API
- **代理（Agent）**：部署在目标系统上的沙鼠程序，称为Sandcat

### 11.3.3 安装 CALDERA

#### 【通用】Docker安装（推荐）

**步骤1：安装Docker**

```bash
# 操作位置：终端
# Ubuntu/Debian
sudo apt update
sudo apt install -y docker.io docker-compose

# 启动Docker服务
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
# 预期输出：Docker version xx.x.xx
```

**步骤2：克隆项目**

```bash
# 操作位置：终端
cd /opt
sudo git clone https://github.com/mitre/caldera.git --recursive
cd caldera

# 查看文件结构
ls -la
```

**步骤3：使用Docker Compose启动**

```bash
# 操作位置：终端（caldera目录）
# 启动所有服务
docker-compose up -d
# 预期输出：启动成功

# 查看服务状态
docker-compose ps
```

**步骤4：访问Web界面**

```bash
# 操作位置：浏览器
# 访问地址
http://localhost:8888

# 默认账号：
# 红色用户：red / admin
# 蓝色用户：blue / admin
```

#### 【Linux环境】手动安装

**步骤1：安装依赖**

```bash
# 操作位置：终端
# 安装Python 3.8+
sudo apt update
sudo apt install -y python3 python3-pip python3-venv git

# 验证Python版本
python3 --version
# 预期输出：Python 3.8.x 或更高
```

**步骤2：下载CALDERA**

```bash
# 操作位置：终端
cd /opt
sudo git clone https://github.com/mitre/caldera.git --recursive
cd caldera
```

**步骤3：安装Python依赖**

```bash
# 操作位置：终端（caldera目录）
# 创建虚拟环境（推荐）
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip3 install -r requirements.txt
# 预期输出：安装完成
```

**步骤4：启动CALDERA**

```bash
# 操作位置：终端（caldera目录）
# 启动服务器
python3 server.py
# 预期输出：显示启动信息和访问地址
```

**步骤5：访问Web界面**

```bash
# 操作位置：浏览器
# 访问地址
http://localhost:8888

# 默认账号：
# 红色用户：red / admin
# 蓝色用户：blue / admin
```

### 11.3.4 CALDERA 基本使用

#### 1. 登录Web界面

登录后可以看到以下主要菜单：
- **Campaigns**：战役管理
- **Agents**：代理管理
- **Abilities**：能力（攻击技术）
- **Adversaries**：对手配置文件
- **Operations**：操作运行
- **Plugins**：插件管理
- **Reports**：报告

#### 2. 部署代理（Agent）

**Windows部署：**

```bash
# 操作位置：目标Windows系统PowerShell
# 1. 在CALDERA服务端中，进入Agents页面
# 2. 点击"Deploy an agent"
# 3. 选择目标平台（Windows）
# 4. 复制部署命令

# 5. 在目标系统上以管理员身份执行命令
# 示例命令：
$cer = 'http://192.168.1.10:8888';$key = 'xxx';IEX([System.IO.File]::ReadAllText((New-Object System.Net.WebClient).DownloadString($cer+'/downloads/'+$key+'/contact.ps1')))
```

#### 3. 创建对手配置文件（Adversary）

```bash
# 操作位置：CALDERA Web界面
# 1. 进入Adversaries页面
# 2. 点击"New adversary"
# 3. 填写名称和描述
#    Name: Test Adversary
#    Description: 测试对手配置
# 4. 添加攻击技术（Abilities）
#    - 选择战术
#    - 选择具体技术
# 5. 保存
```

#### 4. 创建操作（Operation）

```bash
# 操作位置：CALDERA Web界面
# 1. 进入Operations页面
# 2. 点击"Create operation"
# 3. 配置操作参数：
#    - Name: Test Operation
#    - Adversary: 选择对手配置文件
#    - Group: 选择代理组
#    - Autonomous: 选择自动化或手动
#    - Phase timeout: 阶段超时时间
# 4. 点击"Create"
# 5. 点击"Run"启动操作
```

#### 5. 查看结果

```bash
# 操作位置：CALDERA Web界面
# 1. 进入Operations页面
# 2. 点击正在运行的操作
# 3. 查看：
#    - 操作执行情况
#    - 每个技术的执行结果
#    - 产生的日志
# 4. 查看Reports页面获取报告
```

### 11.3.5 常用插件

CALDERA有丰富的插件生态：

- **Sandcat**：默认代理
- **Stockpile**：默认能力库
- **Response**：响应功能
- **Compass**：ATT&CK导航
- **GameBoard**：红蓝对抗
- **Atomic**：Atomic Red Team集成
- **Manx**：终端功能
- **Training**：培训功能

### 11.3.6 REST API 使用

CALDERA提供了REST API，可以自动化操作：

```bash
# 操作位置：终端
# 获取所有代理
curl -H "KEY: YOUR_API_KEY" http://localhost:8888/api/v2/agents

# 获取所有能力
curl -H "KEY: YOUR_API_KEY" http://localhost:8888/api/v2/abilities

# 获取所有对手
curl -H "KEY: YOUR_API_KEY" http://localhost:8888/api/v2/adversaries

# 启动操作
curl -X POST -H "KEY: YOUR_API_KEY" -H "Content-Type: application/json" http://localhost:8888/api/v2/operations -d '{
  "name": "Test Operation",
  "adversary_id": "ADV_ID",
  "group": "red",
  "autonomous": 1
}'
```

### 11.3.7 常见问题

**问题1：启动失败**

```
可能原因：
- Python版本不兼容
- 依赖未安装
- 端口被占用

解决方法：
1. 检查Python版本（需要3.8+）
2. 安装所有依赖：pip install -r requirements.txt
3. 修改配置文件中的端口
4. 查看错误日志
```

**问题2：代理连接不上**

```
可能原因：
- 网络不通
- 服务端地址错误
- 防火墙阻止

解决方法：
1. 检查网络连接
2. 确认服务端地址正确
3. 检查防火墙设置
4. 确认API密钥正确
```

**问题3：Web界面无法访问**

```
可能原因：
- 服务未启动
- 端口被占用
- 浏览器问题

解决方法：
1. 检查服务是否运行：docker-compose ps
2. 查看服务日志：docker-compose logs
3. 尝试其他端口
4. 清除浏览器缓存
```

---

## 11.4 DetectionLab 企业域环境搭建

### 11.4.1 DetectionLab 简介

DetectionLab是一个自动化构建企业域渗透测试环境的项目，可以快速搭建一个包含域环境，用于检测和防御测试。

**项目地址**：https://github.com/clong/DetectionLab

**环境组成**：
- **DC**：Windows域控制器
- **WEF**：Windows事件转发服务器
- **WIN10**：Windows 10客户端
- **logger**：日志收集服务器（Linux）

**预装软件**：
- Windows域环境
- 事件日志转发
- Sysmon
- OSQuery
- Velociraptor
- Splunk/HELK/Elastic
- APT模拟工具

### 11.4.2 环境要求

| 项目 | 最低配置 | 推荐配置 |
|------|----------|----------|
| 内存 | 16GB | 32GB |
| CPU | 4核 | 8核 |
| 硬盘 | 100GB | 200GB |
| 虚拟化软件 | VirtualBox或VMware | VMware Workstation/Fusion |
| Vagrant | 2.x | 最新版本 |

### 11.4.3 安装步骤

#### 【通用】安装虚拟化软件

**VirtualBox安装：**

```bash
# 操作位置：终端（Ubuntu/Debian）
# 下载VirtualBox
wget https://download.virtualbox.org/virtualbox/7.0.8/virtualbox-7.0_7.0.8-156879~Ubuntu~jammy_amd64.deb

# 安装
sudo dpkg -i virtualbox-7.0_7.0.8-156879~Ubuntu~jammy_amd64.deb
sudo apt install -f

# 验证安装
VBoxManage --version
```

**VMware安装：**

从官网下载并安装VMware Workstation（Windows/Linux）或 VMware Fusion（macOS）。

#### 【通用】安装 Vagrant

```bash
# 操作位置：终端
# 下载Vagrant（以Ubuntu为例）
wget https://releases.hashicorp.com/vagrant/2.3.4/vagrant_2.3.4_linux_amd64.zip
unzip vagrant_2.3.4_linux_amd64.zip
sudo mv vagrant /usr/local/bin/

# 或使用包管理器安装
sudo apt install -y vagrant

# 验证安装
vagrant --version
# 预期输出：Vagrant 2.3.4
```

#### 【通用】安装 Packer

```bash
# 操作位置：终端
# 下载Packer
wget https://releases.hashicorp.com/packer/1.8.6/packer_1.8.6_linux_amd64.zip
unzip packer_1.8.6_linux_amd64.zip
sudo mv packer /usr/local/bin/

# 验证安装
packer --version
# 预期输出：Packer 1.8.6
```

#### 【通用】下载 DetectionLab

```bash
# 操作位置：终端
cd /opt
sudo git clone https://github.com/clong/DetectionLab.git
cd DetectionLab

# 查看文件结构
ls -la
```

#### 【通用】构建环境

```bash
# 操作位置：终端（DetectionLab目录）
# 使用VirtualBox provider构建
./build.sh virtualbox
# 预期输出：开始下载镜像和构建虚拟机

# 或使用VMware provider
# ./build.sh vmware_desktop

# 构建过程会比较长，需要等待
```

### 11.4.4 环境架构

DetectionLab默认创建以下虚拟机：

| 主机名 | IP地址 | 操作系统 | 说明 |
|--------|--------|----------|------|
| logger | 192.168.56.105 | Ubuntu 20.04 | 日志收集 |
| dc | 192.168.56.100 | Windows Server 2019 | 域控制器 |
| wef | 192.168.56.101 | Windows Server 2019 | 事件转发 |
| win10 | 192.168.56.102 | Windows 10 | 客户端 |

**域名**：windomain.local

**默认凭据**：
- 域管理员：vagrant / vagrant
- 本地管理员：vagrant / vagrant

### 11.4.5 使用 DetectionLab

#### 1. 启动环境

```bash
# 操作位置：终端（DetectionLab/Vagrant目录）
cd DetectionLab/Vagrant

# 启动所有虚拟机
vagrant up
# 预期输出：显示每台虚拟机的启动状态

# 查看状态
vagrant status
```

#### 2. 访问各虚拟机

```bash
# 操作位置：终端（DetectionLab/Vagrant目录）
# 列出虚拟机状态
vagrant status

# 连接到dc
vagrant ssh dc

# 连接到win10
vagrant rdp win10
# 或
vagrant ssh win10
```

#### 3. 访问日志平台

根据配置的不同，可以访问：
- Splunk：https://192.168.56.105:8000（用户名：admin，密码：Splunk123!）
- HELK：https://192.168.56.105（默认账号）
- Velociraptor：https://192.168.56.105:8889

### 11.4.6 测试场景

DetectionLab可以用于：

1. **红蓝对抗练习**：红队攻击，蓝队检测
2. **检测规则测试**：测试Sigma规则、检测规则
3. **SIEM部署测试**：测试SIEM的检测能力
4. **安全产品测试**：测试EDR、NDR等产品
5. **取证分析练习**：入侵检测和响应（IR）演练

### 11.4.7 常见问题

**问题1：构建失败**

```
可能原因：
- 网络问题
- 资源不足
- 软件版本不兼容

解决方法：
1. 检查网络连接
2. 确保系统资源足够（至少16GB内存）
3. 查看构建日志
4. 使用正确的软件版本
```

**问题2：虚拟机启动失败**

```
可能原因：
- 虚拟化未启用
- VT-x/AMD-V未开启
- 内存不足

解决方法：
1. 检查BIOS中虚拟化是否启用
2. 确认VT-x/AMD-V已开启
3. 检查分配给虚拟机的内存
4. 查看Vagrant日志
```

**问题3：SSH连接失败**

```
可能原因：
- SSH服务未启动
- 网络配置错误
- 防火墙阻止

解决方法：
1. 检查虚拟机状态：vagrant status
2. 重启虚拟机：vagrant reload
3. 查看SSH日志
```

---

## 11.5 Elastic Security 检测环境

### 11.5.1 Elastic Security 简介

Elastic Security是Elastic公司的安全解决方案，基于Elastic Stack构建，提供了SIEM和端点安全功能。

**主要组件**：
- **Elasticsearch**：搜索引擎和数据存储
- **Kibana**：可视化界面
- **Elastic Agent**：端点代理
- **Fleet Server**：代理管理
- **Beats**：数据采集器

### 11.5.2 Elastic Stack 安装

#### 【通用】Docker安装（推荐）

**步骤1：下载docker-elk项目**

```bash
# 操作位置：终端
git clone https://github.com/deviantony/docker-elk.git
cd docker-elk
```

**步骤2：启动服务**

```bash
# 操作位置：终端（docker-elk目录）
# 启动所有服务
docker-compose up -d
# 预期输出：启动成功

# 查看服务状态
docker-compose ps
```

**步骤3：访问Kibana**

```bash
# 操作位置：浏览器
# 访问地址
http://localhost:5601

# 默认账号：
# 用户名：elastic
# 密码：changeme
```

#### 【Linux环境】手动安装 Elasticsearch

```bash
# 操作位置：终端
# 添加Elastic GPG密钥
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -

# 添加软件源
echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list

# 安装Elasticsearch
sudo apt update
sudo apt install elasticsearch

# 启动服务
sudo systemctl start elasticsearch
sudo systemctl enable elasticsearch
```

#### 【Linux环境】安装 Kibana

```bash
# 操作位置：终端
sudo apt install kibana

# 启动服务
sudo systemctl start kibana
sudo systemctl enable kibana
```

### 11.5.3 配置 Elastic Security

#### 1. 启用安全功能

```bash
# 操作位置：终端
# 编辑elasticsearch.yml
sudo nano /etc/elasticsearch/elasticsearch.yml

# 添加以下配置
xpack.security.enabled: true
xpack.security.enrollment.enabled: true
```

#### 2. 设置内置用户密码

```bash
# 操作位置：终端
# 设置内置用户密码
sudo /usr/share/elasticsearch/bin/elasticsearch-setup-passwords interactive
# 预期输出：交互式设置密码

# 或使用自动模式
/usr/share/elasticsearch/bin/elasticsearch-setup-passwords auto
```

#### 3. 配置Kibana连接

```bash
# 操作位置：终端
# 编辑kibana.yml
sudo nano /etc/kibana/kibana.yml

# 添加以下配置
elasticsearch.username: "kibana_system"
elasticsearch.password: "kibana_password"
```

### 11.5.4 部署 Elastic Agent

Elastic Agent用于收集端点数据。

**步骤1：安装Fleet Server**

```bash
# 操作位置：Kibana Web界面
# 1. 进入 Management -> Fleet
# 2. 按照提示添加Fleet Server
# 3. 在服务器上执行安装命令
```

**步骤2：安装Elastic Agent**

```bash
# 操作位置：目标系统终端
# 下载并安装Elastic Agent
curl -L -O https://artifacts.elastic.co/downloads/beats/elastic-agent/elastic-agent-8.11.0-linux-x86_64.tar.gz
tar xzvf elastic-agent-8.11.0-linux-x86_64.tar.gz
cd elastic-agent-8.11.0

# 安装（需要Fleet Server地址和 enrollment token）
sudo ./elastic-agent install --url=https://fleet-server:8220 --enrollment-token=TOKEN
```

### 11.5.5 集成安全检测规则

Elastic Security内置了大量检测规则，基于ATT&CK框架。

#### 1. 启用检测规则：

```bash
# 操作位置：Kibana Web界面
# 1. 进入 Security -> Detections
# 2. 点击"Manage detection rules"
# 3. 选择要启用的规则
# 4. 批量启用
```

#### 2. 加载预构建规则

Elastic提供了大量预构建的规则，覆盖：
- 初始访问
- 执行
- 持久化
- 权限提升
- 防御规避
- 凭证访问
- 发现
- 横向移动
- 等等

### 11.5.6 检测规则自定义

可以创建自定义检测规则：

```bash
# 操作位置：Kibana Web界面
# 1. 进入 Security -> Detections -> Rules
# 2. 点击"Create new rule"
# 3. 选择规则类型：
#    - 自定义查询（Custom query）
#    - 阈值（Threshold）
#    - 事件关联（Event correlation）
#    - 指示器匹配（Indicator match）
#    - 机器学习（ML）
# 4. 配置规则查询和条件
# 5. 设置严重性和风险评分
# 6. 保存规则
```

### 11.5.7 常见问题

**问题1：Elasticsearch启动失败**

```
可能原因：
- JVM内存配置不当
- 端口被占用
- 配置错误

解决方法：
1. 检查JVM内存配置
2. 查看端口占用：lsof -i:9200
3. 查看错误日志
```

**问题2：Kibana无法连接Elasticsearch**

```
可能原因：
- 认证信息错误
- 网络不通
- 证书问题

解决方法：
1. 检查用户名密码
2. 确认Elasticsearch运行状态
3. 检查证书配置
```

---

## 11.6 红蓝对抗靶场配置

### 11.6.1 红蓝对抗概述

红蓝对抗是一种安全评估方法，红队模拟攻击，蓝队负责防守，通过实战化验证组织的安全能力。

**红队（Red Team）**：
- 模拟真实攻击者
- 寻找防御弱点
- 评估检测能力

**蓝队（Blue Team）**：
- 检测攻击
- 响应事件
- 改进防御

**紫队（Purple Team）**：
- 红蓝协作
- 优化检测
- 持续改进

### 11.6.2 靶场环境设计

#### 1. 网络架构设计

典型的企业网络架构：

```
互联网
  |
[防火墙/边界设备]
  |
DMZ区（Web服务器、邮件服务器等）
  |
[内部防火墙]
  |
办公网络
  |
[域环境]
  |
数据中心
```

#### 2. 服务器配置

- 域控制器（DC）
- 文件服务器
- Web服务器
- 数据库服务器
- 邮件服务器
- VPN服务器
- 运维跳板机
- 开发服务器

#### 3. 终端配置

- Windows 10/11 客户端
- 不同权限用户
- 不同部门OU设计

### 11.6.3 防御体系建设

#### 1. 日志收集

- Windows事件日志
- Sysmon
- PowerShell日志
- 网络设备日志
- 应用程序日志
- 安全产品日志

#### 2. 检测工具

- SIEM（安全信息和事件管理）
- EDR（端点检测和响应）
- NDR（网络检测和响应）
- IDS/IPS（入侵检测/防御系统）

#### 3. 安全产品

- 防病毒软件
- 防火墙
- 入侵检测系统
- 身份认证系统
- 数据防泄漏（DLP）

### 11.6.4 攻击场景设计

#### 1. 初始访问

- 鱼叉式钓鱼
- 水坑攻击
- 利用公开漏洞
- 暴力破解
- 社会工程学

#### 2. 执行

- PowerShell恶意脚本
- 恶意Office宏病毒
- 白利用

#### 3. 持久化

- 注册表Run键
- 计划任务
- 服务
- WMI事件订阅
- 启动文件夹

#### 4. 权限提升

- 本地提权漏洞
- 令牌窃取
- 绕过UAC
- 服务弱权限

#### 5. 凭证访问

- 哈希传递
- 票据传递
- 键盘记录
- 凭证窃取

#### 6. 横向移动

- PsExec
- WMI
- WinRM
- RDP
- SMB

### 11.6.5 红蓝对抗流程

#### 1. 准备阶段

- 确定范围
- 制定规则
- 环境准备
- 工具准备

#### 2. 攻击阶段

- 侦察
- 初始访问
- 内网漫游
- 数据窃取
- 目标达成

#### 3. 检测阶段

- 监控分析
- 事件发现
- 事件响应
- 溯源分析

#### 4. 总结阶段

- 结果汇总
- 弱点分析
- 改进建议
- 复测验证

### 11.6.6 指标度量

- **MTTD（平均检测时间）**：从攻击开始到检测到的时间
- **MTTR（平均响应时间）**：从检测到到响应的时间
- **攻击成功率**：攻击成功的比例
- **检测率**：被检测到的攻击比例
- **防护率**：被防护的攻击比例

---

## 11.7 其他ATT&CK相关工具

### 11.7.1 MITRE ATT&CK Navigator

ATT&CK Navigator是一个Web应用，用于可视化和探索ATT&CK矩阵。

**项目地址**：https://github.com/mitre-attack/attack-navigator

**功能**：
- 可视化ATT&CK矩阵
- 标记覆盖的技术
- 多层叠加
- 导出图片和导入
- 自定义注释

**本地部署**：

```bash
# 操作位置：终端
git clone https://github.com/mitre-attack/attack-navigator.git
cd attack-navigator
npm install
npm start
# 预期输出：启动服务器

# 访问
http://localhost:4200
```

### 11.7.2 DeTT&CT

DeTT&CT是一个用于蓝队的工具，帮助蓝队根据ATT&CK评估检测可见性和检测覆盖度。

**项目地址**：https://github.com/rabobank-cdc/DeTTECT

**功能**：
- 数据质量评分
- 检测覆盖评分
- ATT&CK映射
- 改进建议

### 11.7.3 Sysmon 配置

Sysmon是Windows系统监控工具，提供详细的进程创建、网络连接等事件日志。

**安装**：

```bash
# 操作位置：PowerShell（管理员）
# 下载Sysmon
# 从微软Sysinternals下载

# 安装配置
Sysmon64.exe -i sysmon-config.xml
```

**推荐配置**：
- SwiftOnSecurity配置：https://github.com/SwiftOnSecurity/sysmon-config
- Olaf Hartong配置：https://github.com/olafhartong/sysmon-modular

### 11.7.4 Sigma 规则

Sigma是一个开源的检测规则格式，用于描述检测规则。

**项目地址**：https://github.com/SigmaHQ/sigma

**使用**：

```bash
# 操作位置：终端
# 克隆仓库
git clone https://github.com/SigmaHQ/sigma.git

# 使用sigmac转换规则
python sigmac -t es-qs -c win-sysmon.yml rule.yml
```

### 11.7.5 常见问题

**问题1：工具安装失败**

```
解决方法：
1. 检查系统要求
2. 安装依赖
3. 查看错误日志
```

---

## 11.8 学习建议

### 11.8.1 学习路径

1. **了解ATT&CK框架**：熟悉战术和技术
2. **学习检测技术**：学习各种攻击技术原理
3. **搭建检测环境**：搭建SIEM、日志收集
4. **模拟攻击测试**：使用Atomic Red Team等工具
5. **分析检测数据**：分析日志和检测结果
6. **持续改进优化**：优化检测规则和防御

### 11.8.2 推荐资源

**官方资源**：
- MITRE ATT&CK官方网站
- MITRE ATT&CK博客
- MITRE CTID

**社区**：
- ATT&CK社区
- 各种安全会议

### 11.8.3 实践建议

1. **动手实践**：搭建环境，动手操作
2. **记录笔记**：记录学习笔记和心得
3. **持续关注**：关注最新技术和更新
4. **交流分享**：和同行交流分享

---

## 11.9 本章小结

本章介绍了基于ATT&CK框架的攻防靶场搭建，包括：

1. **MITRE ATT&CK框架**：战术、技术、矩阵介绍
2. **Atomic Red Team**：原子测试库的安装和使用
3. **CALDERA攻击模拟平台**：自动化攻击模拟
4. **DetectionLab企业域环境**：一键搭建企业域测试环境
5. **Elastic Security检测环境**：SIEM和端点安全
6. **红蓝对抗靶场配置**：靶场设计和对抗流程
7. **其他工具**：ATT&CK Navigator、DeTT&CT、Sysmon、Sigma等

通过搭建这些环境，安全从业者可以在一个接近真实的企业环境中进行红蓝对抗练习，提升检测和响应能力。建议读者可以根据自己的需求选择合适的工具和环境，逐步搭建适合的攻防演练环境。
