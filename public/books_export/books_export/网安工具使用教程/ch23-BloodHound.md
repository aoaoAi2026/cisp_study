# 第二十三章：BloodHound - 域环境分析工具

## 23.1 BloodHound 简介

### 什么是 BloodHound？

想象一下，你是一名侦探，进入了一个复杂的犯罪团伙内部。这个团伙有很多成员，他们之间有着复杂的关系——谁是老大？谁听谁的命令？谁可以接触到核心机密？

要搞清楚这些关系，你需要一张关系图。但手动绘制这张图非常困难，因为关系太多了。这时你发现了一个神奇的工具，它可以自动收集所有成员的信息，然后画出一张清晰的关系图，甚至告诉你从一个小喽啰到老大的最短路径！

**BloodHound**就是这样一个神奇的工具——它可以自动收集Windows域环境中的所有信息，然后通过图形化方式展示域内的各种关系，帮助你找到从普通用户到域管理员的最短攻击路径。

简单来说，BloodHound是一个**域环境分析和攻击路径可视化工具**，被称为"域渗透的地图"。

### BloodHound 能做什么？

| 功能 | 说明 | 通俗理解 |
|------|------|----------|
| 域关系分析 | 分析用户、组、计算机之间的关系 | 画出人际关系图 |
| 攻击路径发现 | 找出从低权限到高权限的路径 | 找到到达老大的最短路线 |
| 权限问题识别 | 发现不安全的权限配置 | 找出防守漏洞 |
| 信任关系分析 | 分析域信任和外部信任 | 了解帮派之间的关系 |
| 可视化展示 | 用图形化方式展示所有关系 | 一目了然的地图 |

### 为什么BloodHound如此强大？

在域环境中，权限关系非常复杂。一个普通用户可能通过多层关系间接获得了管理员权限，但手动分析这些关系几乎是不可能的。

BloodHound的强大之处在于：

1. **自动采集数据**：通过SharpHound自动收集域内所有对象的信息
2. **智能分析关系**：使用图数据库分析对象之间的复杂关系
3. **可视化展示**：用图形化方式展示攻击路径，一目了然
4. **一键查询**：内置多种查询模板，一键找出攻击路径

---

## 23.2 安装教程

### 系统环境要求

BloodHound需要两个组件：
1. **Neo4j数据库**：用于存储和查询图形数据
2. **BloodHound客户端**：用于可视化展示和分析

### 安装Neo4j数据库

**方法一：使用APT安装（Ubuntu/Kali）**

```bash
# 添加Neo4j仓库
wget -O - https://debian.neo4j.com/neotechnology.gpg.key | sudo apt-key add -
echo 'deb https://debian.neo4j.com stable 4.4' | sudo tee -a /etc/apt/sources.list.d/neo4j.list

# 更新并安装
sudo apt update
sudo apt install neo4j

# 启动服务
sudo systemctl start neo4j
sudo systemctl enable neo4j
```

**方法二：使用Docker安装（推荐）**

```bash
# 创建数据目录
mkdir -p ~/neo4j/data ~/neo4j/logs ~/neo4j/plugins

# 运行Neo4j容器
docker run -d \
  --name neo4j \
  -p 7474:7474 \
  -p 7687:7687 \
  -v ~/neo4j/data:/data \
  -v ~/neo4j/logs:/logs \
  -v ~/neo4j/plugins:/plugins \
  -e NEO4J_AUTH=neo4j/password \
  neo4j:4.4
```

### 配置Neo4j

首次访问Neo4j需要修改密码：

1. 打开浏览器，访问 http://localhost:7474
2. 默认用户名：`neo4j`，密码：`neo4j`
3. 按照提示修改密码（建议设置为复杂密码）

### 安装BloodHound客户端

**方法一：下载预编译版本**

1. 访问 https://github.com/BloodHoundAD/BloodHound/releases
2. 下载对应平台的版本
3. 解压后运行

**方法二：从源码编译**

```bash
# 安装依赖
sudo apt install git nodejs npm

# 克隆源码
git clone https://github.com/BloodHoundAD/BloodHound.git
cd BloodHound

# 安装依赖
npm install

# 编译
npm run build

# 运行
npm start
```

### 连接到Neo4j

打开BloodHound客户端，输入连接信息：
- **URL**：`bolt://localhost:7687`
- **用户名**：`neo4j`
- **密码**：你设置的密码

---

## 23.3 数据采集详解

### 使用SharpHound采集数据

SharpHound是BloodHound的数据采集工具，需要在域内的Windows主机上运行。

#### 下载SharpHound

从 https://github.com/BloodHoundAD/BloodHound/releases 下载SharpHound.exe

#### 基础采集命令

```powershell
# 基本采集（采集所有信息）
SharpHound.exe -c all

# 只采集用户和组信息
SharpHound.exe -c group,user

# 只采集信任关系
SharpHound.exe -c trust

# 采集ACL信息
SharpHound.exe -c acl
```

#### 常用参数

| 参数 | 说明 | 示例 |
|------|------|------|
| -c | 指定采集类型 | `-c all` |
| -d | 指定域名 | `-d corp.local` |
| -u | 指定用户名 | `-u admin` |
| -p | 指定密码 | `-p password` |
| -dc | 指定域控制器 | `-dc dc01.corp.local` |
| -o | 指定输出目录 | `-o C:\temp` |
| --encrypt | 加密输出文件 | `--encrypt` |

#### 采集类型详解

| 类型 | 说明 | 采集内容 |
|------|------|----------|
| all | 全部采集 | 所有信息 |
| group | 组信息 | 用户组、组成员 |
| user | 用户信息 | 用户属性、登录时间 |
| computer | 计算机信息 | 计算机属性、操作系统 |
| trust | 信任关系 | 域信任、外部信任 |
| acl | ACL信息 | 访问控制列表 |
| object | 对象信息 | AD对象属性 |
| container | 容器信息 | OU、容器 |
| session | 会话信息 | 用户登录会话 |
| localgroup | 本地组 | 本地管理员组 |
| psremote | PS远程 | PowerShell远程配置 |
| rdp | RDP配置 | 远程桌面配置 |

### 数据采集实战

#### 场景一：在域控制器上采集

```powershell
# 在域控制器上运行，采集所有信息
SharpHound.exe -c all -d corp.local -u Administrator -p P@ssw0rd
```

#### 场景二：在普通用户主机上采集

```powershell
# 在普通用户主机上运行，使用当前用户权限
SharpHound.exe -c all
```

#### 场景三：通过PowerShell远程采集

```powershell
# 使用PowerShell远程执行SharpHound
Invoke-Command -ComputerName target01 -ScriptBlock {
    C:\temp\SharpHound.exe -c all -o C:\temp
}
```

---

## 23.4 数据导入详解

### 导入数据到BloodHound

1. 打开BloodHound客户端，确保已连接到Neo4j
2. 点击左上角的"Upload Data"按钮
3. 选择采集到的JSON文件（可以选择多个）
4. 点击"Open"开始导入

### 导入过程说明

导入过程中会显示进度：
1. **Parsing**：解析JSON文件
2. **Ingesting**：将数据导入Neo4j
3. **Building Relationships**：建立对象之间的关系
4. **Completed**：导入完成

### 导入问题排查

如果导入失败，可能是以下原因：
- Neo4j服务未启动：检查Neo4j状态
- 数据文件损坏：重新采集数据
- 版本不兼容：使用匹配的SharpHound和BloodHound版本

---

## 23.5 界面介绍

### 主界面布局

BloodHound主界面分为几个区域：

| 区域 | 位置 | 功能 |
|------|------|------|
| 搜索栏 | 顶部 | 搜索用户、计算机、组等对象 |
| 查询模板 | 左侧 | 内置的查询模板 |
| 图形区 | 中央 | 可视化展示关系图 |
| 信息面板 | 右侧 | 显示选中对象的详细信息 |
| 工具栏 | 底部 | 操作按钮（放大、缩小、导出等） |

### 搜索功能

在搜索栏中输入关键词，可以搜索：
- **用户名**：如 `john`、`Administrator`
- **计算机名**：如 `PC01`、`DC01`
- **组名**：如 `Domain Admins`、`Administrators`
- **OU名**：如 `IT Department`

### 查询模板

左侧的查询模板包含多种预设查询：

| 查询名称 | 说明 | 用途 |
|----------|------|------|
| Shortest Path to Domain Admins | 到域管理员的最短路径 | 发现提权路径 |
| Find All Domain Admins | 查找所有域管理员 | 了解管理员列表 |
| Find Principals with DCSync Rights | 查找具有DCSync权限的对象 | 发现高危权限 |
| Find Kerberoastable Users | 查找可被Kerberoast的用户 | 发现Kerberoast攻击目标 |
| Find Users with SPNs | 查找具有SPN的用户 | 发现服务账户 |
| Find Local Admin Access | 查找本地管理员权限 | 发现横向移动路径 |
| Find Unconstrained Delegation | 查找非约束委派 | 发现委派漏洞 |
| Find Constrained Delegation | 查找约束委派 | 发现委派配置 |

---

## 23.6 分析功能详解

### 查询攻击路径

#### 步骤1：搜索目标用户

在搜索栏输入用户名，如 `john`，然后按回车。

#### 步骤2：选择查询模板

从左侧选择一个查询模板，如"Shortest Path to Domain Admins"。

#### 步骤3：分析结果

图形区会显示从该用户到域管理员的最短路径。每个节点代表一个对象，箭头代表关系。

### 图形元素说明

| 元素 | 含义 | 颜色 |
|------|------|------|
| 用户节点 | 域用户 | 蓝色 |
| 计算机节点 | 域计算机 | 橙色 |
| 组节点 | 用户组 | 绿色 |
| 域节点 | 域 | 紫色 |
| 箭头 | 对象之间的关系 | 灰色 |
| 粗箭头 | 关键路径 | 红色 |

### 常见关系类型

| 关系 | 说明 | 示例 |
|------|------|------|
| MemberOf | 组成员关系 | john是Domain Admins成员 |
| AdminTo | 管理员关系 | john是PC01的管理员 |
| HasSession | 会话关系 | john在PC01上有会话 |
| Trusts | 信任关系 | corp.local信任child.corp.local |
| Owns | 所有权关系 | john拥有GPO对象 |
| WriteDacl | 写入权限 | john可以修改ACL |

### 高级分析技巧

#### 技巧一：多路径分析

可以同时选择多个查询模板，对比不同路径的复杂度。

#### 技巧二：过滤结果

使用右侧信息面板的过滤功能，只显示特定类型的对象或关系。

#### 技巧三：导出分析结果

点击底部工具栏的"Export"按钮，可以将图形导出为PNG图片或JSON数据。

---

## 23.7 实战案例：域渗透路径分析

### 场景说明

假设你已经获得了一个普通域用户的凭证，现在需要分析如何提升权限到域管理员。

### 步骤

**步骤1：采集数据**

在域内的任意Windows主机上运行SharpHound：

```powershell
SharpHound.exe -c all -o C:\temp
```

采集完成后，会生成一个或多个JSON文件。

**步骤2：导入数据**

将JSON文件导入BloodHound：

1. 打开BloodHound客户端
2. 点击"Upload Data"
3. 选择采集到的JSON文件
4. 等待导入完成

**步骤3：搜索普通用户**

在搜索栏输入普通用户名，如 `lowuser`，按回车。

**步骤4：查询最短路径**

从左侧查询模板中选择"Shortest Path to Domain Admins"。

**步骤5：分析路径**

图形区会显示从 `lowuser` 到域管理员的最短路径。例如：

```
lowuser -> Helpdesk组 -> PC01管理员 -> PC01上的高权限用户 -> Domain Admins
```

**步骤6：验证路径**

根据分析结果，逐步验证每一步：

1. 确认lowuser是Helpdesk组成员
2. 确认Helpdesk组对PC01有管理员权限
3. 确认PC01上有高权限用户的会话
4. 确认该用户是Domain Admins成员

**步骤7：制定攻击计划**

根据分析结果，制定攻击计划：

1. 使用lowuser凭证登录域
2. 通过Helpdesk组权限访问PC01
3. 在PC01上获取高权限用户的凭证
4. 使用高权限用户凭证获取域管理员权限

---

## 23.8 防御方法

### 权限最小化

1. 避免过度授权：只授予用户必要的最小权限
2. 定期审计权限：定期检查用户和组的权限配置
3. 移除不必要的权限：及时移除不再需要的权限

### 监控异常行为

1. 监控BloodHound数据采集：SharpHound的行为具有特征性
2. 监控大量LDAP查询：异常的LDAP查询可能表示数据采集
3. 监控异常的Neo4j连接：检测未授权的BloodHound使用

### 安全配置

1. 限制域控制器访问：只允许授权人员访问域控制器
2. 启用审计日志：记录所有权限变更和访问行为
3. 使用强密码策略：防止密码被破解后用于横向移动

---

## 23.9 常见问题与解决方案

### 问题1：SharpHound采集失败

**现象**：运行SharpHound后没有生成JSON文件

**原因**：权限不足、网络问题、防火墙阻止

**解决方案**：
- 使用具有域权限的用户运行
- 检查网络连接
- 临时关闭防火墙测试

### 问题2：BloodHound连接Neo4j失败

**现象**：无法连接到Neo4j数据库

**原因**：Neo4j未启动、端口被占用、密码错误

**解决方案**：
- 检查Neo4j服务状态
- 检查端口7687是否被占用
- 确认用户名和密码正确

### 问题3：导入数据后图形为空

**现象**：导入数据后图形区没有显示任何内容

**原因**：数据不完整、版本不兼容、查询条件不匹配

**解决方案**：
- 重新采集数据
- 使用匹配版本的SharpHound和BloodHound
- 尝试不同的查询模板

### 问题4：查询结果不准确

**现象**：查询结果显示的路径与实际不符

**原因**：数据过期、权限变更、缓存问题

**解决方案**：
- 重新采集最新数据
- 清除Neo4j缓存
- 验证查询结果

---

## 总结

本章详细介绍了BloodHound的使用：

1. **什么是BloodHound**：域环境分析和攻击路径可视化工具
2. **安装配置**：Neo4j数据库和BloodHound客户端的安装
3. **数据采集**：使用SharpHound采集域数据，支持多种采集类型
4. **数据导入**：将JSON数据导入BloodHound进行分析
5. **界面介绍**：主界面布局、搜索功能、查询模板
6. **分析功能**：图形元素说明、常见关系类型、高级分析技巧
7. **实战案例**：从普通用户到域管理员的攻击路径分析
8. **防御方法**：权限最小化、监控异常行为、安全配置
9. **常见问题**：采集失败、连接失败、数据为空、结果不准确的解决方案

BloodHound是域渗透分析的必备工具，它可以帮助你在复杂的域环境中快速找到攻击路径，提高渗透测试的效率。

下一章我们将学习Evil-WinRM——Windows远程管理攻击工具！