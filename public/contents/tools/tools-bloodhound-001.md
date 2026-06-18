# BloodHound Active Directory 攻击路径分析完全指南

> 分类：工具指南 | 难度：进阶 | 阅读时间：约40分钟

## 概述

BloodHound 是分析 Active Directory（AD）域环境中攻击路径的利器，由 Andy Robbins、Rohan Vazarkar 和 Will Schroeder（@harmj0y）创建。它通过图数据库（Neo4j）可视化 AD 中的用户、计算机、组、GPO、ACL 等对象之间的关系，自动发现从低权限用户到域管理员的最短攻击路径（Attack Path）。BloodHound 彻底改变了域渗透的方式——传统上依赖人工经验枚举，现在可以一键分析整个域的攻击面。

**核心组件**：
- **SharpHound**（Windows C#）：数据采集器（推荐）
- **BloodHound.py**（Python）：免杀远程采集器
- **BloodHound GUI**：Neo4j 图数据库前端
- **BloodHound CE**：企业版（新架构，更现代的界面）

## 核心知识点

- SharpHound 采集器配置与运行
- Neo4j 数据库安装与 BloodHound 连接
- 核心查询：Find Shortest Paths to Domain Admins
- Attack Path 分析与利用
- 高级 Edge 分析（ACL、Kerberos Delegation、GPO）
- BloodHound CE 新功能
- 防御视角：用 BloodHound 做 AD 安全审计

---

## 一、安装

### 1.1 BloodHound CE（推荐）

```bash
# Linux
# 下载 GitHub Release 的 ZIP 包
# 解压后运行
./BloodHound

# Docker（CE 版本）
docker run -p 7687:7687 -e NEO4J_AUTH=neo4j/password neo4j

# macOS
brew install --cask bloodhound

# Windows
# 下载 BloodHound-win32-x64.zip
```

### 1.2 Neo4j 数据库

```bash
# 安装 Neo4j
sudo apt install neo4j -y

# BloodHound CE 版默认端口 7687
# 默认账号：neo4j / bloodhoundcommunity

# 首次运行需要修改密码
```

---

## 二、数据采集

### 2.1 SharpHound（Windows）

```powershell
# 基础采集
SharpHound.exe -c All

# 仅采集关键信息
SharpHound.exe -c Session,Group,LocalAdmin

# 指定域控制器
SharpHound.exe -c All -d corp.local -dc dc01.corp.local

# 采集特定 OU
SharpHound.exe -c All --CollectionMethods Session --OU "OU=Finance,DC=corp,DC=local"

# 隐蔽模式
SharpHound.exe -c Session,LoggedOn --Stealth

# 输出为 ZIP 文件，导入 BloodHound
```

### 2.2 BloodHound.py（Linux 免杀）

```bash
# GitHub: fox-it/BloodHound.py
pip install bloodhound

bloodhound-python -d corp.local -u username -p password -c all -ns 10.0.0.5
# 生成 .json 文件，压缩后导入 BloodHound
```

---

## 三、核心分析

### 3.1 上传数据

```
1. BloodHound → Upload Data → 选择 ZIP 文件
2. 等待图数据库处理（通常几秒到几分钟）
```

### 3.2 预置查询（最常用）

| 查询 | 说明 |
|:---|:---|
| **Find Shortest Paths to Domain Admins** | 到域管理员的最短攻击路径 |
| **Find Principals with DCSync Rights** | 谁有 DCSync 权限 |
| **Find Computers where Domain Users are Local Admin** | 域用户在哪些机器上是本地管理员 |
| **Find Kerberoastable Users** | 可 Kerberoasting 的用户 |
| **Find AS-REP Roastable Users** | 可不预认证的账号 |
| **Find All Paths from Domain Users to High Value Targets** | 所有到高价值目标的攻击路径 |
| **List all Kerberoastable Accounts** | 列出所有 Kerberoastable 账号 |
| **Shortest Paths to Unconstrained Delegation Systems** | 到无约束委派系统的最短路径 |

### 3.3 自定义 Cypher 查询

```
# 用户 → 组成员 → 管理员权限
MATCH p=(u:User)-[:MemberOf*1..]->(g:Group)-[:AdminTo]->(c:Computer)
WHERE u.name =~ "(?i)HELPDESK.*"
RETURN p

# 查找会话收集攻击路径
MATCH p=(c:Computer)-[:HasSession]->(u:User)
WHERE u.highvalue = true
RETURN p
```

---

## 四、攻击路径分析

### 4.1 经典攻击路径类型

```
1. 用户 → 组 → Local Admin → 服务器：
   普通用户 → 加入某组 → 该组是某服务器的本地管理员

2. Kerberoasting：
   普通用户 → Kerberoastable 用户 → 破解密码 → 该账号有域管权限

3. ACL 滥用路径：
   普通用户 → WriteDACL → 某用户 → 修改该用户权限 → Domain Admin

4. GPO 滥用路径：
   普通用户 → GPO 修改权限 → 修改 GPO → 所有应用该 GPO 的计算机

5. 约束委派攻击：
   普通用户 → 控制某计算机 → 该计算机有约束委派 → 模拟域管

6. DCSync 权限：
   普通用户 → 组 → Replicating Directory Changes 权限 → DCSync
```

### 4.2 图分析技巧

```
Node 颜色：
- 蓝色：用户
- 绿色：组
- 红色：计算机
- 黄色：域控制器
- 紫色箭头：高风险路径

Edge（连线）含义：
- MemberOf：组成员
- AdminTo：管理员权限
- HasSession：会话存在
- WriteDacl：ACL 写权限
- GenericAll：完全控制权限
- ForceChangePassword：强制改密权限
- Owns：所有者
- AddMembers：添加成员权限
- ReadLAPSPassword：LAPS 密码读取权限
```

---

## 五、实战场景

### 场景一：红队攻击路径发现

```
1. SharpHound 采集数据
2. 导入 BloodHound
3. 查询：Shortest Paths to Domain Admins
4. 分析路径：
   - Node 1: DOMAIN\jsmith（普通用户）
   - + MemberOf → IT Support（组）
   - + AdminTo → IT-WS01（计算机）
   - + HasSession → DOMAIN\Admin_Tom（在 IT-WS01 上有会话）
   - + MemberOf → Domain Admins
5. 攻击：获取 jsmith 权限 → 登录 IT-WS01 → 从内存提取 Admin_Tom 凭据 → 域管
```

### 场景二：蓝队 AD 安全审计

```
1. 用 BloodHound 定期采集 AD 数据
2. 关注的风险指标：
   - 到域管路径数 > 100 → 攻击面过大
   - 普通用户直接 AdminTo 域控 → 高危
   - DCSync 权限过多
   - 域用户 Local Admin 的机器太多
   - 过多的 Kerberoastable 账号
3. 根据发现路径制定修复方案
4. 定期对比图数据 → 检测异常变化
```

---

## 六、速查卡

```
安装:               下载 BloodHound CE + Neo4j
Neo4j端口:          7687 (Bolt)
SharpHound采集:     SharpHound.exe -c All
BHPy采集:           bloodhound-python -d DOMAIN -u user -p pass -c all -ns DC_IP
导入数据:           Upload Data → 选择 ZIP
核心查询:           Find Shortest Paths to Domain Admins
节点:               蓝色用户/绿色组/红色计算机/黄色DC
边:                 MemberOf/AdminTo/HasSession/WriteDacl/GenericAll

BloodHound CE对比老版：
  - 现代化 UI
  - 内置 Attack Path 可视化
  - 支持多域森林
  - REST API
```

---

## 实战场景扩展

### 场景五：查找域管理员的最短路径

```
1. 上传数据后，搜索 "DOMAIN ADMINS@CORP.LOCAL"
2. 右键节点 → "Shortest Paths to Here"
3. 分析结果：
   - User → HasSession → Computer → AdminTo → DC
   - User → MemberOf → Group → WriteDacl → Group → AdminTo → DC

4. 利用路径：
   - HasSession: 横向移动到该计算机 → 从内存提取凭据
   - WriteDacl: 给自己添加 DCSync 权限
   - ForceChangePassword: 重置目标用户密码
```

### 场景六：Kerberos 委派攻击路径

```
查询语句：
MATCH (c:Computer)-[:AllowedToDelegate]->(s:Computer)
RETURN c.name, s.name

分析：
1. 找到配置了非约束委派（Unconstrained Delegation）的计算机
2. 模拟用户登录到该计算机 → DC 的 TGT 会被缓存
3. 从内存中提取 DC 的 TGT → 生成 Golden Ticket

查询无约束委派：
MATCH (c:Computer) WHERE c.unconstraineddelegation = true 
RETURN c.name

查询约束委派：
MATCH (c:Computer)-[:AllowedToDelegate]->(s:Computer) 
RETURN c.name, s.name
```

### 场景七：ACL 权限提升分析

```
查询语句：
MATCH p=(u:User)-[r:WriteDacl|WriteOwner|GenericAll|GenericWrite|
         Owns|AllExtendedRights|AddMember|ForceChangePassword]->(g:Group)
WHERE g.highvalue = true
RETURN p

利用方法：
1. WriteDacl → 给自己添加 DCSync 权限
2. GenericAll → 完全控制目标对象
3. ForceChangePassword → 修改目标密码后登录
4. AddMember → 将自己加入高权限组
```

### 场景八：跨域攻击路径

```cypher
// 查找域信任关系
MATCH (d:Domain)-[:TrustedBy]->(d2:Domain)
RETURN d.name, d2.name

// 查找跨域组
MATCH (g:Group) WHERE g.domain = "child.corp.local"
MATCH (g)-[:MemberOf*1..]->(dg:Group) 
WHERE dg.domain = "corp.local"
RETURN g.name, dg.name

// 从子域用户到父域域管理员的路径
MATCH p=shortestPath(
  (u:User {domain: "CHILD.CORP.LOCAL"})-[:MemberOf|HasSession|AdminTo|
   MemberOf|GenericAll|GenericWrite|WriteDacl|WriteOwner|Owns*1..]->
  (g:Group {name: "DOMAIN ADMINS@CORP.LOCAL"})
)
RETURN p
```

### 场景九：BloodHound CE 高级查询

```cypher
// CE 版本 Cypher 查询

// GPO 控制分析
MATCH (c:Computer)-[:HasSIDHistory]->(sid:SID)
WHERE c.enabled = true
RETURN c.name, sid.value

// 密码永不过期的高权限用户
MATCH (u:User)
WHERE u.highvalue = true AND u.pwdneverexpires = true
RETURN u.name

// 不在 Protected Users 组的域管理员
MATCH (u:User)-[:MemberOf*1..]->(g:Group {name: "DOMAIN ADMINS@CORP.LOCAL"})
WHERE NOT (u)-[:MemberOf]->(:Group {name: "PROTECTED USERS@CORP.LOCAL"})
RETURN u.name
```

### 场景十：防御视角——安全隐患审计

```cypher
// 查找"共享本地管理员"问题
MATCH (g:Group {name: "DOMAIN ADMINS@CORP.LOCAL"})
MATCH (c:Computer)-[:MemberOf*1..]->(g)
RETURN c.name, "域控上的域管理员组有非授权账户"

// 查找未约束委派（高风险）
MATCH (c:Computer) 
WHERE c.unconstraineddelegation = true 
  AND c.operatingsystem =~ "(?i)server.*"
RETURN c.name, "存在未约束委派的服务器"

// 查找启用 RC4 的 Kerberos 账户
MATCH (u:User {hasspn: true}) 
RETURN u.name, u.serviceprincipalnames
```

---

## 防御加固建议

基于 BloodHound 发现的常见安全隐患：

1. **清理不必要的本地管理员**：确保每台服务器仅授权人员有管理员权限
2. **启用 Protected Users 组**：防止域管理员的凭据被缓存
3. **限制委派**：将有委派权限的账户降至最低
4. **监控 ACL 变更**：异常 WriteDacl 操作应触发告警
5. **定期运行 BloodHound 审计**：在攻击者之前发现问题

---

---

## 一、安装与配置（补充）

### 1.1 Neo4j 数据库配置

```bash
# Ubuntu/Debian 手动安装 Neo4j
wget -O - https://debian.neo4j.com/neotechnology.gpg.key | sudo apt-key add -
echo 'deb https://debian.neo4j.com stable latest' | sudo tee /etc/apt/sources.list.d/neo4j.list
sudo apt update && sudo apt install neo4j -y

# 配置（解决初始连接问题）
sudo vim /etc/neo4j/neo4j.conf
# 修改：
dbms.default_listen_address=0.0.0.0
dbms.security.auth_enabled=true

# 首次运行（修改默认密码）
sudo neo4j-admin set-initial-password YOUR_PASSWORD
sudo systemctl start neo4j
sudo systemctl enable neo4j

# 验证
cypher-shell -u neo4j -p YOUR_PASSWORD
# Cypher> RETURN 1;
```

### 1.2 SharpHound 采集选项详解

```powershell
# Collection Methods 详解
-c Default          # 默认：Group, LocalAdmin, Session, Trusts, ACL, ObjectProps, Container, RDP, DCOM, PSRemote
-c All              # 全部（含 DcOnly 方法，在域控上运行）
-c DcOnly           # 仅域控采集（组、信任、GPO、OU、容器等，不含会话）
-c Session          # 会话采集（HasSession edge）
-c LoggedOn         # 登录用户采集
-c Group            # 组成员采集
-c LocalAdmin       # 本地管理员采集
-c RDP              # RDP 会话
-c DCOM             # DCOM 权限
-c PSRemote         # PowerShell Remoting 会话
-c Trusts           # 域信任关系
-c ACL              # 访问控制列表
-c Container        # OU/容器关系
-c ObjectProps      # 对象属性
-c ComputerOnly     # 仅计算机对象

# 组合使用（推荐）
SharpHound.exe -c Session,Group,LocalAdmin,ACL,ObjectProps,DCOM
```

### 1.3 BloodHound.py 高级选项

```bash
# 安装
pip install bloodhound

# 基础采集
bloodhound-python -d corp.local -u user -p pass -ns 10.0.0.5 -c all

# 高级选项
bloodhound-python -d corp.local \
  -u user -p pass \
  -dc dc01.corp.local \          # 指定域控
  -ns 10.0.0.5 \                 # DNS 服务器
  -c all \                        # 全部采集方法
  --dns-tcp \                     # 使用 TCP DNS
  --zip                           # 输出为 zip（方便上传）
```

---

## 二、核心 Edge 类型大全

| Edge 类型 | 说明 | 利用方式 |
|:---|:---|:---|
| **AdminTo** | 本地管理员权限 | 横向移动 |
| **HasSession** | 用户会话 | 凭据窃取 |
| **MemberOf** | 组成员关系 | 权限继承 |
| **ForceChangePassword** | 强制改密码 | 账户接管 |
| **AddMembers** | 添加组成员 | 权限提升 |
| **GenericAll** | 完全控制 | 对象接管 |
| **GenericWrite** | 通用写入 | SPN 添加 |
| **WriteOwner** | 写入所有者 | 权限获取 |
| **WriteDacl** | 写入 DACL | DCSync 权限 |
| **AllExtendedRights** | 所有扩展权限 | 密码重置 |
| **ReadLAPSPassword** | 读取 LAPS 密码 | 本地管理 |
| **ReadGMSAPassword** | 读取 gMSA 密码 | 服务账户 |
| **AddKeyCredentialLink** | 添加密钥凭据 | Shadow Credentials |
| **SQLAdmin** | SQL 管理员 | 数据库访问 |
| **ExecuteDCOM** | DCOM 执行 | 远程执行 |
| **CanRDP** | RDP 权限 | 远程桌面 |
| **CanPSRemote** | PSRemote 权限 | WinRM |
| **AllowedToDelegate** | 委派权限 | 凭据中继 |
| **AllowedToAct** | 基于资源的委派 | 计算机接管 |
| **Owns** | 对象所有者 | 完全控制 |
| **Contains** | 容器包含 | OU/组结构 |
| **GpLink** | GPO 链接 | GPO 攻击 |
| **DCSync** | DCSync 权限 | 哈希导出 |
| **GetChanges/GetChangesAll** | 目录复制 | DCSync |

---

## 三、预定义查询详解

```
Find Shortest Paths to Domain Admins
→ 找到从任意节点到达域管理员组的最短路径
→ 优先关注条数少、步数短的路径

Find Principals with DCSync Rights
→ 谁有 DCSync 权限
→ 这些账户是"等价于域管理员"

Find Users with Foreign Domain Group Membership
→ 哪些用户属于外部域的组
→ 跨域攻击入口

Find Computers with Unconstrained Delegation
→ 非约束委派的计算机
→ TGT 窃取目标

Find Kerberoastable Users
→ 哪些用户有 SPN（可进行 Kerberoasting）
→ 破解其 Kerberos TGS

Find AS-REP Roastable Users
→ 哪些用户不要求 Kerberos 预认证
→ 无需凭据即可获取 TGT 哈希
```

---

> 📖 本文为"网安百宝箱"课程配套读物。更新于 2026-06-18
