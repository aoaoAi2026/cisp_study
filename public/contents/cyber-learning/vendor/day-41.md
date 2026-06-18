# Day 41 · 安恒明御DAS & 堡垒机 & 漏洞扫描

> **学习阶段**：第二层 — 安恒信息  
> **学习时长**：约 90 分钟  
> **难度等级**：中级  
> **前置知识**：数据库基础概念、运维安全概念  
> **学习目标**：掌握明御DAS数据库审计核心原理、了解安恒堡垒机运维审计机制、学习安恒全线产品协同  

---

## 目录

1. [开篇：安恒的数据安全版图](#1-开篇安恒的数据安全版图)
2. [数据库安全市场概述](#2-数据库安全市场概述)
3. [明御DAS产品概述](#3-明御das产品概述)
4. [DAS旁路审计架构深度解析](#4-das旁路审计架构深度解析)
5. [智能SQL解析引擎](#5-智能sql解析引擎)
6. [敏感数据自动识别](#6-敏感数据自动识别)
7. [全链路追踪与三层关联审计](#7-全链路追踪与三层关联审计)
8. [DAS告警与策略配置](#8-das告警与策略配置)
9. [DAS部署模式详解](#9-das部署模式详解)
10. [安恒堡垒机产品概述](#10-安恒堡垒机产品概述)
11. [堡垒机核心功能深度解析](#11-堡垒机核心功能深度解析)
12. [高危指令拦截机制](#12-高危指令拦截机制)
13. [会话录像与审计回放](#13-会话录像与审计回放)
14. [堡垒机部署架构](#14-堡垒机部署架构)
15. [明御漏洞扫描产品概述](#15-明御漏洞扫描产品概述)
16. [安恒全产品线协同作战](#16-安恒全产品线协同作战)
17. [安恒 vs 第一层厂商：专科医院 vs 综合医院](#17-安恒-vs-第一层厂商专科医院-vs-综合医院)
18. [实操实验：数据库审计与堡垒机模拟](#18-实操实验数据库审计与堡垒机模拟)
19. [实验一：MySQL审计日志配置与分析](#19-实验一mysql审计日志配置与分析)
20. [实验二：使用Yearning搭建SQL审核平台](#20-实验二使用yearning搭建sql审核平台)
21. [实验三：使用JumpServer搭建堡垒机](#21-实验三使用jumpserver搭建堡垒机)
22. [实验四：堡垒机高危指令拦截测试](#22-实验四堡垒机高危指令拦截测试)
23. [验收练习](#23-验收练习)
24. [今日总结](#24-今日总结)

---

## 1. 开篇：安恒的数据安全版图

昨天我们学习了安恒信息的Web安全核心产品（明御WAF和AiLPHA），今天我们把目光转向安恒的另一块核心业务——**数据安全**。

在安恒的产品体系中，数据安全是和Web安全并列的两大支柱：

```
安恒信息产品版图

    Web安全（左膀）          数据安全（右臂）
    ┌──────────────┐        ┌──────────────┐
    │ 明御WAF      │        │ 明御DAS      │  ← 今天学
    │ 玄武盾       │        │ 堡垒机       │  ← 今天学
    │ AiLPHA      │        │ AiGuard      │
    └──────────────┘        │ 数据库防火墙  │
                            │ 数据脱敏     │
                            │ 数据库加密   │
                            └──────────────┘

    为什么Web安全公司做数据安全也强？
    → Web应用的后端就是数据库
    → 理解Web攻击就能理解数据库面临的威胁
    → 从应用层到数据层的安全视角是完整的
```

> 如果把Web安全比作保护城堡的大门，那数据安全就是保护城堡里的金库。大门很重要，但金库才是攻击者的最终目标。

---

## 2. 数据库安全市场概述

### 2.1 为什么数据库安全如此重要？

企业的核心资产是什么？不是服务器，不是带宽，而是**数据**。客户信息、交易记录、财务数据、商业机密——这些都在数据库里。攻击者的最终目标往往不是攻破Web服务器，而是拿到数据库里的数据。

```
攻击链的终点：
Web漏洞 → 应用服务器沦陷 → 数据库凭据获取 → 数据库访问 → 数据窃取
                                                              ↑
                                                         最终目标
```

### 2.2 数据库安全产品矩阵

数据库安全是一个产品家族，不同产品解决不同的问题：

| 产品类型 | 代表产品 | 解决什么问题 | 部署方式 |
|----------|----------|-------------|----------|
| **数据库审计(DAS)** | 明御DAS | 谁在什么时间访问了什么数据？ | 旁路镜像 |
| **数据库防火墙** | 安恒数据库防火墙 | 阻止非法的数据库访问 | 串联 |
| **数据库加密** | 安恒数据库加密 | 即使数据泄露，也无法解密 | 透明加密 |
| **数据脱敏** | 安恒数据脱敏 | 测试/开发环境的数据不泄露 | 动态/静态脱敏 |
| **数据分类分级** | AiGuard | 自动发现和分类敏感数据 | 扫描+标记 |

> 其中，**数据库审计（DAS）是基础中的基础**——你首先得知道数据被谁访问了，才能谈防护。

---

## 3. 明御DAS产品概述

### 3.1 什么是DAS？

**DAS（Database Audit System，数据库审计系统）**，全称"明御数据库审计与风险控制系统"，是安恒信息在数据库安全领域的核心产品。

> 如果把数据库比作一个金库，DAS就是**金库门口的全天候监控摄像头**。它不阻止任何人进入（那是数据库防火墙的事），但它记录每个人的一举一动——谁进来了、什么时候进来的、做了什么操作、看了哪些数据。

### 3.2 DAS的核心价值

```
DAS解决的四大问题：

1. 合规要求
   → 等保2.0明确要求对数据库操作进行审计
   → 行业法规（金融、医疗等）要求数据访问可追溯

2. 事后追溯
   → 数据泄露发生后，谁泄露的？什么时候？泄露了什么？
   → DAS提供完整的操作记录作为证据

3. 实时告警
   → 发现异常的数据库操作（如批量导出敏感数据）
   → 实时通知管理员

4. 行为分析
   → 建立正常数据库访问行为基线
   → 发现偏离正常模式的异常行为（类似UEBA）
```

---

## 4. DAS旁路审计架构深度解析

### 4.1 为什么是旁路部署？

这是DAS最核心的设计理念——**旁路部署，零影响**：

```
串联部署（数据库防火墙的方式）：
应用 → [数据库防火墙] → 数据库
       ↑
       所有流量经过防火墙
       优点：可以拦截
       缺点：增加延迟、可能成为故障点

旁路部署（DAS的方式）：
应用 → 数据库
   ↘
     [交换机镜像端口]
        ↓
     [DAS审计设备]
        ↑
       只"看"流量，不影响业务
       优点：零延迟、零风险、不影响性能
       缺点：不能拦截，只能审计告警
```

> 类比：串联部署 = 在门口设一个安检门（每个进去的人都要过一下）；旁路部署 = 在墙上装一个摄像头（不影响通行，但记录一切）。

### 4.2 DAS的数据采集方式

```
DAS支持多种数据采集方式：

方式一：交换机端口镜像（SPAN）
┌──────────┐     ┌──────────┐
│ 应用服务器 │────→│  交换机   │────→ 数据库服务器
└──────────┘     └────┬─────┘
                      │ 镜像端口
                      ▼
                 ┌──────────┐
                 │ DAS审计   │
                 └──────────┘

方式二：数据库自身审计日志采集
┌──────────┐
│ 数据库    │ → 开启原生审计 → syslog/日志文件 → DAS采集
└──────────┘

方式三：Agent部署
┌──────────┐
│ 数据库服务器│ → 安装轻量Agent → 采集SQL流量 → 发送到DAS
└──────────┘

方式四：网络分流器(TAP)
互联网流量 → TAP设备 → 复制流量 → DAS审计
```

### 4.3 多数据库类型支持

明御DAS支持的主流数据库：

| 数据库类型 | 版本支持 | 协议解析 |
|-----------|----------|----------|
| Oracle | 9i/10g/11g/12c/19c | TNS协议 |
| MySQL | 5.x/8.x | MySQL协议 |
| SQL Server | 2005/2008/2012/2016/2019 | TDS协议 |
| PostgreSQL | 9.x/10.x/11.x/12.x/13.x | PostgreSQL协议 |
| DB2 | 9.x/10.x/11.x | DRDA协议 |
| 达梦(DM) | 7/8 | 达梦协议 |
| 人大金仓 | V7/V8 | Kingbase协议 |
| MongoDB | 3.x/4.x/5.x | MongoDB Wire Protocol |
| Redis | 3.x/4.x/5.x/6.x | Redis协议 |
| HBase | 1.x/2.x | HBase协议 |

### 4.4 DAS的协议解析流程

```
原始网络流量
    │
    ▼
┌──────────────┐
│  协议识别     │  ← 识别是什么数据库的流量（MySQL/Oracle/...）
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  协议解码     │  ← 按照数据库通信协议解码
│  (TNS/TDS等)  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  SQL语句提取  │  ← 从协议数据中提取出SQL语句
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  SQL解析      │  ← 解析SQL语句的结构（SELECT/FROM/WHERE等）
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  敏感数据匹配  │  ← 判断是否访问了敏感表/字段
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  策略匹配     │  ← 检查是否触发告警策略
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  存储与展示    │  ← 存入ES，供查询和报表
└──────────────┘
```

---

## 5. 智能SQL解析引擎

### 5.1 为什么需要SQL解析？

如果不解析SQL语句，DAS只能看到"有人执行了一条SQL"，但不知道这条SQL具体做了什么。SQL解析的目的就是**理解SQL语句的语义**。

```
原始SQL：
SELECT id, name, phone, id_card, salary FROM employees WHERE department = 'HR'

SQL解析后：
操作类型：SELECT（查询）
涉及表：employees
涉及字段：id, name, phone, id_card, salary（含敏感字段！）
过滤条件：department = 'HR'
风险等级：高（涉及身份证号、工资等敏感信息）
```

### 5.2 SQL解析的层次

```
SQL语句："SELECT name, salary FROM employees WHERE id = 100"

第一层：词法分析（Lexical Analysis）
→ 将SQL文本分解为Token（词法单元）
→ SELECT | name | , | salary | FROM | employees | WHERE | id | = | 100

第二层：语法分析（Syntax Analysis）
→ 构建抽象语法树(AST)
→      SELECT
→      /   |   \
→   name salary  FROM
→                  |
→              employees
→                  |
→               WHERE
→               /  |  \
→             id   =   100

第三层：语义分析（Semantic Analysis）
→ 理解SQL的含义
→ 操作类型：查询
→ 查询字段：name（姓名）、salary（工资）
→ 查询范围：id=100的单条记录
→ 风险评估：涉及敏感字段salary，但只查单条，风险较低
```

### 5.3 SQL语句分类

DAS能自动识别SQL语句的类型，不同类型有不同的风险权重：

| SQL类型 | 风险等级 | 典型操作 | 审计关注点 |
|---------|----------|----------|-----------|
| SELECT | 低-高 | 查询数据 | 是否查询敏感字段、是否大批量 |
| INSERT | 中 | 插入数据 | 插入的数据内容、批量插入 |
| UPDATE | 高 | 修改数据 | 修改的字段、WHERE条件 |
| DELETE | 高 | 删除数据 | 是否全表删除、是否有WHERE |
| DROP/TRUNCATE | 严重 | 删除表 | 任何执行都应告警 |
| ALTER/CREATE | 中 | 修改结构 | 是否在非维护时间窗口 |
| GRANT/REVOKE | 高 | 权限变更 | 任何权限变更都应告警 |
| EXEC/EXECUTE | 高 | 执行存储过程 | 执行的存储过程名称和参数 |

---

## 6. 敏感数据自动识别

### 6.1 敏感数据发现机制

DAS的一个关键能力是**自动发现数据库中的敏感数据**。它通过以下方式识别：

```
敏感数据发现方法：

方法一：字段名匹配
→ 字段名包含：password, passwd, pwd, id_card, phone, mobile, 
              salary, balance, credit_card, bank_account 等
→ 自动标记为敏感字段

方法二：数据内容匹配
→ 正则匹配身份证号：\d{17}[\dXx]
→ 正则匹配手机号：1[3-9]\d{9}
→ 正则匹配邮箱：[\w.]+@[\w.]+
→ 正则匹配银行卡号：\d{16,19}

方法三：数据分布分析
→ 高基数字段（值不重复且分布均匀）= 可能是ID/主键
→ 低基数字段（值集中在几个选项）= 可能是状态/类型字段
→ 特定格式数据 = 可能是敏感信息

方法四：手动标注
→ 管理员手动标记敏感表和字段
→ 支持从数据分类分级系统导入
```

### 6.2 敏感数据分级

```
敏感数据分级体系（示例）：

L1 - 公开数据
├── 产品目录
├── 公开新闻
└── 企业基本信息

L2 - 内部数据
├── 内部通讯录
├── 组织架构
└── 内部流程文档

L3 - 敏感数据
├── 客户姓名、手机号、邮箱
├── 合同信息
└── 员工工号

L4 - 高度敏感
├── 身份证号、银行卡号
├── 工资、财务数据
├── 核心业务数据
└── 密码哈希值

L5 - 绝密
├── 商业机密
├── 核心算法
└── 密钥/证书
```

### 6.3 敏感数据访问告警

当检测到访问敏感数据时，DAS根据数据等级触发不同级别的告警：

```
告警规则示例：

规则1：访问L4及以上敏感数据
条件：SQL涉及L4/L5级字段
动作：实时告警（邮件+短信+系统弹窗）
严重级别：高危

规则2：批量访问敏感数据
条件：单条SQL返回行数 > 1000 且 涉及L3+敏感字段
动作：实时告警
严重级别：高危

规则3：非工作时间访问敏感数据
条件：时间在 22:00-06:00 且 涉及L3+敏感字段
动作：实时告警
严重级别：中危

规则4：非授权应用访问敏感数据
条件：应用名不在白名单 且 涉及L4+敏感字段
动作：实时告警 + 自动阻断（需配合数据库防火墙）
严重级别：严重
```

---

## 7. 全链路追踪与三层关联审计

### 7.1 什么是三层关联？

数据库审计面临一个挑战：**你只能看到数据库层面的操作，但不知道是哪个应用、哪个用户在操作**。

```
没有三层关联的情况：
DAS记录：来自IP 10.1.1.50 的MySQL连接执行了 SELECT * FROM users
→ 只知道是10.1.1.50这个应用服务器
→ 不知道是哪个Web用户触发的
→ 不知道是哪个URL请求触发的

有三层关联的情况：
DAS记录：
→ 用户：张三（从Web层获取）
→ IP：202.10.5.100（真实客户端IP）
→ 应用：OA系统
→ URL：/employee/list
→ 操作：SELECT * FROM employees
→ 时间：2026-06-18 14:30:25
```

### 7.2 三层关联的实现原理

```
三层关联 = 应用层 + 中间层 + 数据库层

┌─────────────────────────────────────────────────────┐
│ 第一层：应用层                                       │
│ ┌─────────────┐                                     │
│ │ 浏览器       │                                     │
│ │ 用户：张三    │                                     │
│ │ IP：202.x   │                                     │
│ │ URL：/api/  │                                     │
│ └──────┬──────┘                                     │
│        │ HTTP请求                                    │
│        ▼                                            │
│ 第二层：中间层（Web/App服务器）                       │
│ ┌─────────────┐                                     │
│ │ Nginx/Tomcat│  ← DAS Agent注入追踪ID              │
│ │ 注入：TraceID│                                     │
│ └──────┬──────┘                                     │
│        │ SQL请求（携带TraceID）                       │
│        ▼                                            │
│ 第三层：数据库层                                     │
│ ┌─────────────┐                                     │
│ │ MySQL       │  ← DAS通过SQL注释捕获TraceID         │
│ └─────────────┘                                     │
└─────────────────────────────────────────────────────┘

技术实现：
1. 在应用代码中注入SQL注释：/* trace_id:xxx */
2. DAS解析SQL时提取trace_id
3. 将三层信息关联：用户信息 + 应用信息 + SQL操作
```

### 7.3 全链路追踪示例

```
场景：用户张三查询了自己的工资信息

应用层日志：
[2026-06-18 14:30:25] 张三 (202.10.5.100) 访问 /api/salary/query

中间层日志：
[2026-06-18 14:30:25] trace_id=abc123 处理请求 /api/salary/query

SQL（携带追踪ID）：
/* trace_id:abc123 app:OA user:zhangsan */
SELECT name, base_salary, bonus FROM salary WHERE employee_id = 'Z001'

DAS审计记录：
{
  "timestamp": "2026-06-18T14:30:25",
  "trace_id": "abc123",
  "user": "张三",
  "client_ip": "202.10.5.100",
  "app_name": "OA",
  "api_path": "/api/salary/query",
  "db_ip": "10.1.1.100",
  "db_name": "hr_db",
  "sql": "SELECT name, base_salary, bonus FROM salary WHERE employee_id = 'Z001'",
  "sql_type": "SELECT",
  "sensitive_fields": ["base_salary", "bonus"],
  "risk_level": "中",
  "affected_rows": 1
}
```

这样，当发生数据泄露时，你可以完整追溯到：
- 谁访问的（张三）
- 从哪里访问的（202.10.5.100）
- 通过什么应用访问的（OA系统）
- 访问了什么数据（工资表的薪资字段）
- 访问了多少数据（1条记录）
- 什么时间访问的（2026-06-18 14:30:25）

---

## 8. DAS告警与策略配置

### 8.1 告警策略体系

DAS的告警策略分为以下几大类：

```
告警策略分类：

┌─────────────────────────────────────────────────────────────┐
│ 1. 访问控制策略                                              │
│    · 非法IP访问：来源IP不在白名单                             │
│    · 非法时间访问：非工作时间（如22:00-06:00）                │
│    · 非法应用访问：应用名不在白名单                           │
│    · 非法用户访问：数据库用户不在白名单                       │
├─────────────────────────────────────────────────────────────┤
│ 2. SQL操作策略                                               │
│    · 高危操作：DROP/TRUNCATE/ALTER等                         │
│    · 批量操作：影响行数 > 阈值                                │
│    · 敏感操作：涉及敏感表/字段                                │
│    · 异常操作：与正常基线不符的操作                           │
├─────────────────────────────────────────────────────────────┤
│ 3. 数据安全策略                                              │
│    · 敏感数据访问：访问L4+级数据                              │
│    · 批量数据导出：大量SELECT或导出操作                       │
│    · 数据篡改：非预期的UPDATE/DELETE                         │
│    · 权限变更：GRANT/REVOKE操作                              │
├─────────────────────────────────────────────────────────────┤
│ 4. 异常行为策略                                              │
│    · 频率异常：短时间内大量SQL操作                            │
│    · 模式异常：偏离历史行为基线                              │
│    · 登录异常：暴力破解、异地登录                            │
│    · 提权异常：尝试执行高权限操作                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 策略配置示例

```
策略配置示例1：防止数据批量导出

策略名称：batch_data_export_detection
触发条件：
  - SQL类型 = SELECT
  - 返回行数 > 1000
  - 涉及表在敏感表列表中
  - 时间在 18:00-09:00（非工作时间）
动作：
  - 生成严重告警
  - 发送邮件通知DBA
  - 记录完整SQL和结果集大小
豁免：
  - 应用名 = "数据备份系统"
  - 用户 = "etl_user"

策略配置示例2：检测SQL注入后的数据窃取

策略名称：post_injection_data_theft
触发条件：
  - 同一来源IP在5分钟内：
    - 先有1次SQL注入尝试（WAF日志关联）
    - 后有数据库异常查询（涉及敏感表）
动作：
  - 生成严重告警
  - 自动阻断后续SQL（需配合数据库防火墙）
```

---

## 9. DAS部署模式详解

### 9.1 部署模式对比

| 部署模式 | 原理 | 优势 | 劣势 | 适用场景 |
|----------|------|------|------|----------|
| **端口镜像** | 交换机端口镜像 | 零影响、不接触生产 | 需要交换机支持 | 通用场景 |
| **网络分流器(TAP)** | 光纤/网线分流 | 不影响网络、可靠性高 | 需要硬件设备 | 高可靠性场景 |
| **Agent采集** | 数据库主机Agent | 不依赖网络设备 | 占用主机资源 | 云环境/虚拟化 |
| **数据库原生审计** | 开启数据库审计功能 | 最全面 | 影响数据库性能 | 合规必须 |
| **混合模式** | 多种方式结合 | 覆盖全面 | 架构复杂 | 大型企业 |

### 9.2 典型部署架构

```
中型企业DAS典型部署：

                    ┌─────────────┐
                    │  核心交换机  │
                    └──┬───┬───┬──┘
                       │   │   │
          ┌────────────┼───┼───┼────────────┐
          │镜像        │   │   │   镜像      │
          ▼            │   │   │            ▼
    ┌──────────┐       │   │   │      ┌──────────┐
    │ DAS审计   │       │   │   │      │ DAS审计   │
    │ (主)      │       │   │   │      │ (备)      │
    └──────────┘       │   │   │      └──────────┘
                       ▼   ▼   ▼
              ┌────────┐ ┌────┐ ┌────────┐
              │Oracle  │ │MySQL│ │SQL Svr │
              └────────┘ └────┘ └────────┘

关键设计：
- 主备DAS确保审计不中断
- 所有数据库服务器的流量都通过镜像端口采集
- DAS独立于数据库运行，零性能影响
```

---

## 10. 安恒堡垒机产品概述

### 10.1 什么是堡垒机？

**堡垒机（Bastion Host / Jump Server）**，也称为**运维安全审计系统**，是用于管理和审计IT运维操作的安全设备。

> 类比：堡垒机就像**金库的"管理员陪同"制度**。任何人要进入金库，必须先经过管理员（堡垒机），管理员记录下你是谁、什么时候来的、做了什么、什么时候离开的。而且整个过程都有录像（会话录像），事后可以回放。

### 10.2 堡垒机解决的核心问题

```
没有堡垒机时的运维管理困境：

┌─────────────────────────────────────────────────────┐
│ 问题1：账号管理混乱                                  │
│   · 多人共用root/administrator账号                   │
│   · 离职员工的账号没有及时回收                        │
│   · 不知道谁在什么时候登录了服务器                    │
├─────────────────────────────────────────────────────┤
│ 问题2：权限过大                                      │
│   · 运维人员拥有服务器的完全控制权                    │
│   · 无法限制"只能执行某些命令"                        │
│   · 无法限制"只能访问某些文件"                        │
├─────────────────────────────────────────────────────┤
│ 问题3：操作不可追溯                                  │
│   · 误操作导致系统故障，找不到责任人                  │
│   · 恶意操作（删库跑路）无法预警和阻止               │
│   · 出了事故无法还原操作过程                         │
├─────────────────────────────────────────────────────┤
│ 问题4：合规不满足                                    │
│   · 等保要求运维操作可审计                           │
│   · 行业监管要求操作留痕                             │
└─────────────────────────────────────────────────────┘

堡垒机 = 统一入口 + 身份认证 + 权限控制 + 操作审计 + 会话录像
```

---

## 11. 堡垒机核心功能深度解析

### 11.1 统一身份认证

堡垒机作为所有运维操作的**唯一入口**：

```
运维访问流程（有了堡垒机之后）：

运维人员 → 堡垒机（身份认证）→ 目标服务器

认证方式（多因素）：
第一因素：密码
第二因素：OTP动态令牌 / 手机验证码 / USB Key / 指纹
第三因素（可选）：来源IP限制 / 时间窗口限制

访问流程：
1. 运维人员登录堡垒机（Web界面或SSH客户端）
2. 堡垒机验证身份（密码+OTP）
3. 堡垒机根据权限策略决定"可以访问哪些服务器"
4. 堡垒机代理连接到目标服务器
5. 所有操作被全程记录
```

### 11.2 权限控制体系

堡垒机的权限控制可以非常精细：

```
权限控制层级：

┌─────────────────────────────────────────────────────┐
│ 第一层：谁能访问？                                    │
│   · 用户/用户组：张三、运维组、DBA组                  │
│   · 时间窗口：工作日9:00-18:00                        │
│   · 来源IP：仅允许办公网段                            │
├─────────────────────────────────────────────────────┤
│ 第二层：能访问什么？                                  │
│   · 资产/资产组：生产服务器组、数据库服务器组          │
│   · 账号：root、administrator、只读账号               │
│   · 协议：SSH、RDP、MySQL、HTTP                      │
├─────────────────────────────────────────────────────┤
│ 第三层：能做什么？                                    │
│   · 命令白名单：只允许 ls, cat, tail, top 等          │
│   · 命令黑名单：禁止 rm -rf, shutdown, reboot 等      │
│   · 文件传输：允许上传/下载哪些文件                   │
│   · 剪贴板控制：是否允许复制粘贴                      │
├─────────────────────────────────────────────────────┤
│ 第四层：需要什么审批？                                │
│   · 普通操作：直接放行                               │
│   · 敏感操作：需要上级审批                            │
│   · 紧急操作：事后补审批                              │
└─────────────────────────────────────────────────────┘
```

### 11.3 权限策略配置示例

```
策略示例：DBA运维权限

用户：李四（DBA组）
可访问资产：MySQL-01, MySQL-02, Oracle-01
可登录账号：dbadmin（非root）
可访问时间：工作日 9:00-21:00
来源IP限制：10.1.0.0/16

命令控制：
  白名单命令：
    · SELECT, INSERT, UPDATE, DELETE（DML操作）
    · SHOW, DESCRIBE, EXPLAIN（查询元数据）
    · mysql, mysqladmin（管理工具）
  
  黑名单命令：
    · DROP DATABASE, DROP TABLE
    · TRUNCATE TABLE
    · ALTER TABLE（需要审批）
    · GRANT, REVOKE（需要审批）
    · SHUTDOWN（绝对禁止）

文件传输：
  允许上传：.sql文件（需审批）
  允许下载：查询结果（限制1000行）
  禁止：导出整个数据库
```

---

## 12. 高危指令拦截机制

### 12.1 指令拦截原理

堡垒机通过**协议代理**实现对高危指令的实时拦截：

```
SSH命令拦截流程：

运维人员输入命令
    │
    ▼
┌──────────────────┐
│  SSH客户端        │
└────────┬─────────┘
         │ SSH连接
         ▼
┌──────────────────┐
│  堡垒机（代理）    │
│                  │
│  ┌────────────┐  │
│  │ 命令解析器  │  │ ← 解析输入的命令
│  └─────┬──────┘  │
│        │         │
│  ┌─────▼──────┐  │
│  │ 策略匹配器  │  │ ← 匹配黑名单/白名单
│  └─────┬──────┘  │
│        │         │
│  ┌─────▼──────┐  │
│  │ 拦截/放行  │  │
│  └─────┬──────┘  │
└────────┼─────────┘
         │
    ┌────▼────┐
    │ 拦截？   │
    └─┬────┬──┘
  Yes │    │ No
      │    └──────────→ 转发到目标服务器
      ▼
┌──────────────┐
│ 返回拒绝消息  │
│ 记录告警日志  │
│ 发送告警通知  │
└──────────────┘
```

### 12.2 高危指令库

堡垒机内置了丰富的高危指令识别库：

```
高危指令分类：

类别一：系统破坏类（绝对禁止）
├── rm -rf /          # 删除根目录
├── rm -rf *          # 删除当前目录所有文件
├── dd if=/dev/zero   # 清空磁盘
├── mkfs.*            # 格式化磁盘
├── fdisk             # 磁盘分区操作
└── > /dev/sda        # 覆盖磁盘

类别二：服务中断类（需要审批）
├── shutdown/reboot/init 0/init 6
├── service stop / systemctl stop
├── kill -9 (关键进程)
├── iptables -F（清空防火墙规则）
└── ifdown（关闭网络接口）

类别三：权限变更类（需要审批）
├── chmod 777         # 开放所有权限
├── useradd/userdel   # 增删用户
├── passwd            # 修改密码
├── visudo            # 修改sudo配置
└── usermod -aG wheel # 添加管理员组

类别四：数据危险操作（需要审批）
├── DROP DATABASE
├── TRUNCATE TABLE
├── DELETE FROM ... (无WHERE条件)
├── UPDATE ... SET ... (无WHERE条件)
└── mysqldump (全库导出)
```

### 12.3 智能拦截 vs 简单黑名单

安恒堡垒机的高明之处在于**智能识别**，而不是简单的字符串匹配：

```
简单黑名单的问题：
规则：禁止包含 "rm -rf" 的命令
绕过：echo "hello" && rm -rf /   # 前面加无害命令
绕过：rm -r -f /                  # 参数分开写
绕过：/bin/rm -rf /               # 使用绝对路径
绕过：$(echo rm) -rf /            # 命令替换

智能拦截的优势：
1. 命令解析：理解命令的真正结构和意图
2. 参数分析：识别参数的组合效果
3. 上下文感知：结合当前目录、用户身份等
4. 行为分析：连续执行的命令组合
```

---

## 13. 会话录像与审计回放

### 13.1 会话录像原理

堡垒机对所有运维会话进行**全程录像**，就像监控摄像头一样：

```
会话录像技术实现：

SSH会话录像：
→ 记录所有输入输出（stdin/stdout/stderr）
→ 使用ttyrec/asciinema格式存储
→ 支持文本搜索（可以搜索会话中的命令）
→ 存储空间小（纯文本，每小时约1-5MB）

RDP会话录像：
→ 记录屏幕画面（类似录屏）
→ 使用Guacamole或自研协议
→ 支持视频回放
→ 存储空间大（每小时约50-200MB）

数据库会话录像：
→ 记录所有SQL语句
→ 记录返回结果集大小
→ 记录会话时长
```

### 13.2 审计回放功能

```
审计回放支持的功能：

1. 精确回放
   → 像放视频一样回放操作过程
   → 支持快进、慢放、暂停
   → 支持跳转到特定时间点

2. 全文搜索
   → 搜索会话中输入过的所有命令
   → 搜索会话中显示过的所有文本
   → 快速定位关键操作

3. 异常标记
   → 自动标记高危操作的时间点
   → 标记敏感命令执行位置
   → 方便审计人员快速定位

4. 审计报表
   → 自动生成运维审计报表
   → 包含：谁、什么时间、操作了什么
   → 支持导出PDF/Excel
```

---

## 14. 堡垒机部署架构

### 14.1 典型部署架构

```
┌─────────────────────────────────────────────────────────────┐
│                    安恒堡垒机部署架构                         │
│                                                             │
│  运维人员                    堡垒机集群                      │
│  ┌──────┐              ┌──────────────┐                    │
│  │ PC-1 │──┐           │ 堡垒机-主     │                    │
│  └──────┘  │    HTTPS  │ (Web+Proxy)  │                    │
│            ├──────────→│              │                    │
│  ┌──────┐  │           └──────┬───────┘                    │
│  │ PC-2 │──┘                  │                            │
│  └──────┘                     │  HA/负载均衡                │
│                     ┌─────────┼─────────┐                  │
│               ┌─────▼────┐ ┌──▼──────┐ ┌─▼────────┐       │
│               │ 堡垒机-备1│ │堡垒机-备2│ │堡垒机-备3 │       │
│               └─────┬────┘ └────┬────┘ └─────┬─────┘       │
│                     │           │             │              │
│                     └───────────┼─────────────┘              │
│                                 │                            │
│              ┌──────────────────┼──────────────────┐        │
│              │                  │                  │        │
│        ┌─────▼─────┐     ┌─────▼─────┐     ┌─────▼─────┐  │
│        │ Linux服务器│     │Windows服务器│    │ 数据库服务器│  │
│        │  (SSH)    │     │  (RDP)     │     │ (MySQL等) │  │
│        └───────────┘     └───────────┘     └───────────┘  │
│                                                             │
│  关键组件：                                                 │
│  · 堡垒机集群（HA + 负载均衡）                              │
│  · LDAP/AD域集成（统一身份认证）                            │
│  · OTP动态令牌（双因素认证）                                │
│  · 外部存储（会话录像存储，通常需要大容量）                  │
└─────────────────────────────────────────────────────────────┘
```

### 14.2 高可用设计

```
高可用设计要点：

1. 堡垒机集群
   → 多台堡垒机构成集群，避免单点故障
   → 会话在集群内共享，一台故障不影响其他

2. 数据库高可用
   → 堡垒机配置数据使用主从数据库
   → 会话录像使用分布式存储

3. 会话录像存储
   → 本地存储 + 远程备份
   → 压缩存储（SSH文本会话压缩比高）

4. 逃生通道
   → 堡垒机故障时，紧急运维通道（物理访问或带外管理）
   → 严格审批 + 事后审计
```

---

## 15. 明御漏洞扫描产品概述

### 15.1 漏洞扫描器的作用

明御漏洞扫描器是安恒信息安全产品线中的重要一环，负责**主动发现系统和应用中的安全漏洞**。

> 类比：漏洞扫描器就像**定期体检**——在攻击者发现漏洞之前，自己先找到并修复。

### 15.2 漏洞扫描能力

```
明御漏洞扫描器支持的扫描类型：

┌─────────────────────────────────────────────────────────────┐
│ 系统漏洞扫描                                               │
│ ├── Windows系统漏洞（补丁缺失、配置缺陷）                    │
│ ├── Linux系统漏洞（内核漏洞、服务漏洞）                     │
│ └── 网络设备漏洞（交换机/路由器固件漏洞）                   │
├─────────────────────────────────────────────────────────────┤
│ Web漏洞扫描                                                │
│ ├── SQL注入、XSS、CSRF、SSRF                              │
│ ├── 文件上传、文件包含                                     │
│ ├── 命令注入、代码注入                                     │
│ └── OWASP Top 10全覆盖                                    │
├─────────────────────────────────────────────────────────────┤
│ 数据库漏洞扫描                                             │
│ ├── 数据库版本漏洞                                         │
│ ├── 弱口令检测                                             │
│ ├── 配置缺陷（权限过大、审计未开启）                        │
│ └── 补丁缺失检查                                           │
├─────────────────────────────────────────────────────────────┤
│ 基线合规检查                                               │
│ ├── CIS Benchmark对标                                     │
│ ├── 等保2.0配置基线                                       │
│ └── 自定义基线模板                                         │
└─────────────────────────────────────────────────────────────┘
```

### 15.3 漏洞管理流程

```
漏洞管理闭环：

[扫描发现] → [漏洞验证] → [风险评估] → [修复跟踪] → [复检验证]
     ↑                                                       │
     └───────────────────────────────────────────────────────┘
                          持续循环

详细步骤：
1. 扫描发现：定期自动扫描（如每周一次）
2. 漏洞验证：排除误报，确认漏洞真实存在
3. 风险评估：基于CVSS评分 + 资产重要性
4. 分配修复：分配给相应的运维团队
5. 修复跟踪：跟踪修复进度，超时升级
6. 复检验证：修复后重新扫描验证
```

---

## 16. 安恒全产品线协同作战

### 16.1 产品协同全景图

安恒信息的产品不是孤立的，它们可以协同工作，形成完整的安全防护体系：

```
┌─────────────────────────────────────────────────────────────┐
│                    安恒安全产品协同作战                       │
│                                                             │
│                         ┌──────────┐                        │
│                         │ AiLPHA   │                        │
│                         │ (指挥中心)│                        │
│                         └────┬─────┘                        │
│                              │                              │
│        ┌─────────────────────┼─────────────────────┐        │
│        │                     │                     │        │
│   ┌────▼────┐          ┌─────▼─────┐         ┌─────▼────┐  │
│   │明御WAF  │          │ 明御DAS   │         │ 堡垒机    │  │
│   │(外层防护)│          │ (数据审计) │         │ (运维管控) │  │
│   └────┬────┘          └─────┬─────┘         └─────┬────┘  │
│        │                     │                     │        │
│        │        ┌────────────┼────────────┐        │        │
│        │        │            │            │        │        │
│   ┌────▼────────▼──┐  ┌─────▼─────┐ ┌────▼────────▼────┐  │
│   │   Web应用       │  │  数据库    │ │  服务器/网络设备   │  │
│   │   (被保护)      │  │  (被保护)  │ │  (被保护)         │  │
│   └────────────────┘  └───────────┘ └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 16.2 协同场景

| 协同场景 | 涉及产品 | 协同方式 |
|----------|----------|----------|
| **Web攻击→数据窃取检测** | 明御WAF + DAS | WAF检测到SQL注入 → DAS检测到后续异常查询 → 关联告警 |
| **高危操作审批** | 堡垒机 + AiLPHA | 堡垒机发现高危指令 → AiLPHA评估风险 → 触发审批流程 |
| **漏洞修复验证** | 漏洞扫描 + WAF | 漏洞扫描发现Web漏洞 → 临时WAF虚拟补丁 → 修复后扫描验证 |
| **全流量安全分析** | AiLPHA + 所有产品 | 汇总WAF/DAS/堡垒机/漏洞扫描的所有日志 → 统一分析 |
| **攻击溯源** | AiLPHA + WAF + DAS | WAF记录攻击 → DAS记录数据访问 → 堡垒机记录操作 → 完整攻击链 |

---

## 17. 安恒 vs 第一层厂商：专科医院 vs 综合医院

### 17.1 定位差异

现在，我们已经学习了第一层（深信服/奇安信/华为）和第二层的前两个厂商（启明星辰/安恒信息），可以做一个定位对比：

```
网络安全厂商定位图谱：

综合医院（什么都能看）             专科医院（专注某个领域）
┌─────────────────────┐          ┌─────────────────────┐
│ 深信服               │          │ 安恒信息             │
│ · 产品线：10+条      │          │ · 产品线：聚焦Web+数据│
│ · 每个产品：80分     │          │ · 核心产品：95分     │
│ · 优势：全家桶       │          │ · 优势：深度专精     │
│ · 适合：中小企业     │          │ · 适合：Web/数据密集 │
├─────────────────────┤          ├─────────────────────┤
│ 奇安信               │          │ 绿盟科技             │
│ · 产品线：10+条      │          │ · 产品线：聚焦攻防   │
│ · 每个产品：80分     │          │ · 核心产品：95分     │
│ · 优势：国家队背景   │          │ · 优势：技术深度     │
│ · 适合：政企/国家队  │          │ · 适合：技术驱动企业 │
├─────────────────────┤          ├─────────────────────┤
│ 华为                 │          │ 长亭科技             │
│ · 产品线：10+条      │          │ · 产品线：聚焦WAF/扫描│
│ · 每个产品：85分     │          │ · 核心产品：98分     │
│ · 优势：自研芯片+生态 │         │ · 优势：CTF冠军团队  │
│ · 适合：华为生态客户  │          │ · 适合：对WAF要求极致│
└─────────────────────┘          └─────────────────────┘
```

### 17.2 安恒信息的三大差异化优势

```
安恒的三大差异化优势：

1. Web安全专家
   → 从Web安全起家，对HTTP/HTTPS协议的理解极深
   → 明御WAF是国内最早的WAF产品之一
   → ML学习引擎在WAF中的应用是行业领先

2. 数据安全新贵
   → 从Web安全自然延伸到数据安全
   → DAS数据库审计产品在金融行业广泛使用
   → 形成了从应用到数据的完整安全链

3. AI先行者
   → 2015年就推出AiLPHA，是行业最早引入AI的安全厂商之一
   → UEBA行为分析在安全领域的应用
   → AI驱动安全运营是行业趋势

如果把安全厂商比作医院：
安恒 = 顶尖的专科医院
  · 神经科（Web安全）= 全国第一
  · 心血管（数据安全）= 全国前三
  · 装备了最先进的AI诊断设备（AiLPHA）
  · 不看普通感冒（不做什么都做，只做最擅长的）
```

---

## 18. 实操实验：数据库审计与堡垒机模拟

### 18.1 实验目标

由于安恒DAS和堡垒机是商业产品，我们将使用开源方案来模拟其核心功能：
- MySQL原生审计日志 → 模拟DAS数据库审计
- Yearning → 模拟SQL审核功能
- JumpServer → 模拟堡垒机功能

### 18.2 实验环境

```
实验环境：
├── Docker & Docker Compose
├── MySQL 8.0
├── Yearning（SQL审核平台）
└── JumpServer（开源堡垒机）
```

---

## 19. 实验一：MySQL审计日志配置与分析

### 步骤1：启动MySQL并开启审计

```bash
# 创建MySQL工作目录
mkdir -p ~/das-lab/mysql-data
cd ~/das-lab

# docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: audit-mysql
    environment:
      MYSQL_ROOT_PASSWORD: RootPass123!
      MYSQL_DATABASE: testdb
    ports:
      - "3306:3306"
    volumes:
      - ./mysql-data:/var/lib/mysql
      - ./mysql-conf:/etc/mysql/conf.d
    command:
      - --general_log=ON
      - --general_log_file=/var/lib/mysql/general.log
      - --log_output=FILE
      - --slow_query_log=ON
      - --slow_query_log_file=/var/lib/mysql/slow.log
      - --long_query_time=2
      - --log_queries_not_using_indexes=ON
    networks:
      - audit-net

networks:
  audit-net:
    driver: bridge
EOF

# 启动
docker-compose up -d
```

### 步骤2：创建测试数据并模拟操作

```bash
# 等待MySQL就绪
sleep 30

# 创建测试表和用户
docker exec -i audit-mysql mysql -uroot -pRootPass123! << 'SQL'
-- 创建测试数据库和表
CREATE DATABASE IF NOT EXISTS company;
USE company;

-- 员工表（包含敏感数据）
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    phone VARCHAR(20),
    id_card VARCHAR(20),
    salary DECIMAL(10,2),
    department VARCHAR(50)
);

-- 插入测试数据
INSERT INTO employees (name, phone, id_card, salary, department) VALUES
('张三', '13800138001', '110101199001011234', 15000.00, '技术部'),
('李四', '13800138002', '110101199102022345', 18000.00, '技术部'),
('王五', '13800138003', '110101199203033456', 20000.00, '财务部'),
('赵六', '13800138004', '110101199304044567', 12000.00, '人事部'),
('钱七', '13800138005', '110101199405055678', 25000.00, '管理层');

-- 创建不同权限的用户
CREATE USER 'app_user'@'%' IDENTIFIED BY 'AppPass123!';
CREATE USER 'analyst'@'%' IDENTIFIED BY 'AnalystPass123!';
CREATE USER 'dba_user'@'%' IDENTIFIED BY 'DbaPass123!';

-- 分配不同权限
GRANT SELECT ON company.* TO 'app_user'@'%';  -- 只读
GRANT SELECT, INSERT, UPDATE ON company.* TO 'analyst'@'%';  -- 可写
GRANT ALL PRIVILEGES ON company.* TO 'dba_user'@'%';  -- 全部

FLUSH PRIVILEGES;
SQL
```

### 步骤3：模拟各类操作并观察审计日志

```bash
# 模拟正常业务查询（app_user）
docker exec audit-mysql mysql -uapp_user -pAppPass123! -e "
USE company;
SELECT name, department FROM employees WHERE department = '技术部';
SELECT COUNT(*) FROM employees;
"

# 模拟敏感数据查询（analyst）
docker exec audit-mysql mysql -uanalyst -pAnalystPass123! -e "
USE company;
SELECT * FROM employees WHERE salary > 15000;
SELECT name, phone, id_card FROM employees;
"

# 模拟危险操作（dba_user）
docker exec audit-mysql mysql -udba_user -pDbaPass123! -e "
USE company;
UPDATE employees SET salary = 99999 WHERE name = '张三';
DELETE FROM employees WHERE id = 5;
"

# 查看审计日志
echo ""
echo "========== General Log (所有操作记录) =========="
docker exec audit-mysql tail -50 /var/lib/mysql/general.log

echo ""
echo "========== Slow Query Log (慢查询记录) =========="
docker exec audit-mysql cat /var/lib/mysql/slow.log 2>/dev/null || echo "(无慢查询)"
```

### 步骤4：编写审计日志分析脚本

```bash
cat > ~/das-lab/audit_analyzer.py << 'PYEOF'
#!/usr/bin/env python3
"""
数据库审计日志分析器
模拟DAS的审计日志分析功能
"""

import re
from collections import defaultdict
from datetime import datetime

class AuditLogAnalyzer:
    """审计日志分析器"""
    
    # 敏感字段模式
    SENSITIVE_PATTERNS = {
        '身份证号': r'\d{17}[\dXx]',
        '手机号': r'1[3-9]\d{9}',
        '工资': r'salary|工资|薪水',
        '密码': r'password|passwd|密码',
        '银行卡': r'\d{16,19}',
    }
    
    # 高危操作模式
    HIGH_RISK_PATTERNS = {
        'DROP': r'\bDROP\b',
        'TRUNCATE': r'\bTRUNCATE\b',
        'DELETE_WITHOUT_WHERE': r'\bDELETE\s+FROM\s+\w+\s*;',
        'UPDATE_WITHOUT_WHERE': r'\bUPDATE\s+\w+\s+SET\b(?!.*\bWHERE\b)',
        'ALTER': r'\bALTER\s+(TABLE|DATABASE)\b',
        'GRANT': r'\bGRANT\b',
    }
    
    def __init__(self):
        self.alerts = []
        self.stats = defaultdict(int)
    
    def analyze_query(self, query, user, timestamp):
        """分析单条SQL查询"""
        query_upper = query.upper()
        risk_level = 'LOW'
        reasons = []
        
        # 检查高危操作
        for risk_name, pattern in self.HIGH_RISK_PATTERNS.items():
            if re.search(pattern, query, re.IGNORECASE):
                risk_level = 'CRITICAL'
                reasons.append(f'高危操作: {risk_name}')
                self.stats[f'high_risk_{risk_name}'] += 1
        
        # 检查敏感数据访问
        for sens_name, pattern in self.SENSITIVE_PATTERNS.items():
            if re.search(pattern, query, re.IGNORECASE):
                if risk_level != 'CRITICAL':
                    risk_level = 'HIGH'
                reasons.append(f'涉及敏感数据: {sens_name}')
                self.stats[f'sensitive_{sens_name}'] += 1
        
        # 检查批量操作
        if 'SELECT *' in query_upper and 'LIMIT' not in query_upper:
            if risk_level not in ('CRITICAL', 'HIGH'):
                risk_level = 'MEDIUM'
            reasons.append('全表查询(无LIMIT)')
        
        # 记录统计
        if 'SELECT' in query_upper:
            self.stats['total_selects'] += 1
        elif 'INSERT' in query_upper:
            self.stats['total_inserts'] += 1
        elif 'UPDATE' in query_upper:
            self.stats['total_updates'] += 1
        elif 'DELETE' in query_upper:
            self.stats['total_deletes'] += 1
        
        if reasons:
            alert = {
                'timestamp': timestamp,
                'user': user,
                'query': query[:100],
                'risk_level': risk_level,
                'reasons': reasons
            }
            self.alerts.append(alert)
            
            if risk_level in ('CRITICAL', 'HIGH'):
                print(f"🚨 [{risk_level}] {user}: {query[:80]}...")
                for reason in reasons:
                    print(f"   └─ {reason}")
        
        return risk_level
    
    def generate_report(self):
        """生成审计报告"""
        print("\n" + "=" * 60)
        print("  数据库审计报告")
        print("=" * 60)
        
        print(f"\n操作统计:")
        print(f"  SELECT: {self.stats['total_selects']}")
        print(f"  INSERT: {self.stats['total_inserts']}")
        print(f"  UPDATE: {self.stats['total_updates']}")
        print(f"  DELETE: {self.stats['total_deletes']}")
        
        print(f"\n告警统计:")
        print(f"  总告警数: {len(self.alerts)}")
        
        by_level = defaultdict(int)
        for alert in self.alerts:
            by_level[alert['risk_level']] += 1
        
        for level in ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']:
            if by_level[level] > 0:
                icon = {'CRITICAL': '🔴', 'HIGH': '🟠', 'MEDIUM': '🟡', 'LOW': '🔵'}[level]
                print(f"  {icon} {level}: {by_level[level]}")
        
        print(f"\n敏感数据访问:")
        for key, count in self.stats.items():
            if key.startswith('sensitive_'):
                print(f"  {key.replace('sensitive_', '')}: {count}次")


# 模拟审计分析
if __name__ == "__main__":
    analyzer = AuditLogAnalyzer()
    
    # 模拟查询序列
    queries = [
        ("app_user", "SELECT name, department FROM employees WHERE department = '技术部'"),
        ("app_user", "SELECT * FROM employees"),
        ("analyst", "SELECT name, phone, id_card FROM employees WHERE salary > 15000"),
        ("analyst", "SELECT * FROM employees WHERE id_card LIKE '110101%'"),
        ("dba_user", "UPDATE employees SET salary = 99999 WHERE name = '张三'"),
        ("dba_user", "DELETE FROM employees WHERE id = 5"),
        ("hacker", "DROP TABLE employees"),
        ("hacker", "SELECT * FROM employees"),
        ("hacker", "GRANT ALL ON *.* TO 'hacker'@'%'"),
    ]
    
    for user, query in queries:
        analyzer.analyze_query(query, user, datetime.now().isoformat())
    
    analyzer.generate_report()
PYEOF

python3 ~/das-lab/audit_analyzer.py
```

---

## 20. 实验二：使用Yearning搭建SQL审核平台

### 步骤1：部署Yearning

```bash
cd ~/das-lab

# 创建Yearning配置目录
mkdir -p yearning-data

cat >> docker-compose.yml << 'EOF'

  # Yearning SQL审核平台
  yearning:
    image: yeelabs/yearning:latest
    container_name: yearning
    environment:
      MYSQL_ADDR: mysql
      MYSQL_DB: Yearning
      MYSQL_USER: root
      MYSQL_PASSWORD: RootPass123!
      SECRET_KEY: dbcjqheupqjsuwsm
    ports:
      - "8000:8000"
    depends_on:
      - mysql
    networks:
      - audit-net
EOF

# 重新启动
docker-compose up -d

echo "Yearning SQL审核平台: http://localhost:8000"
echo "默认账号: admin"
echo "默认密码: Yearning_admin"
```

### 步骤2：配置SQL审核规则

Yearning启动后，通过Web界面配置SQL审核规则（模拟DAS的策略配置）：

```
登录 http://localhost:8000

配置SQL审核规则：
1. DDL操作必须审批
2. DML操作超过1000行必须审批
3. 禁止没有WHERE条件的UPDATE/DELETE
4. 查询语句最大返回行数10000
5. 禁止SELECT * 查询
```

---

## 21. 实验三：使用JumpServer搭建堡垒机

### 步骤1：部署JumpServer

```bash
# 在单独目录部署JumpServer（资源需求较大）
mkdir -p ~/bastion-lab
cd ~/bastion-lab

# 使用JumpServer官方快速安装脚本
# 注意：JumpServer需要至少4GB内存
curl -sSL https://github.com/jumpserver/jumpserver/releases/download/v3.10.0/quick_start.sh | bash

# 如果上面的命令不成功，使用Docker方式：
cat > docker-compose-jms.yml << 'EOF'
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: jms-mysql
    environment:
      MYSQL_ROOT_PASSWORD: JmsPass123!
      MYSQL_DATABASE: jumpserver
    volumes:
      - ./mysql-data:/var/lib/mysql
    networks:
      - jms-net

  redis:
    image: redis:7-alpine
    container_name: jms-redis
    networks:
      - jms-net

  core:
    image: jumpserver/core:v3.10.0
    container_name: jms-core
    environment:
      DB_ENGINE: mysql
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USER: root
      DB_PASSWORD: JmsPass123!
      DB_NAME: jumpserver
      REDIS_HOST: redis
      REDIS_PORT: 6379
      SECRET_KEY: k3jBf2Lp9mNqR5sV8yZ1aC4dG7hJ0lO3
      BOOTSTRAP_TOKEN: k3jBf2Lp9mNqR5sV
    depends_on:
      - mysql
      - redis
    networks:
      - jms-net

  koko:
    image: jumpserver/koko:v3.10.0
    container_name: jms-koko
    environment:
      CORE_HOST: http://core:8080
      BOOTSTRAP_TOKEN: k3jBf2Lp9mNqR5sV
    ports:
      - "2222:2222"
    depends_on:
      - core
    networks:
      - jms-net

  lion:
    image: jumpserver/lion:v3.10.0
    container_name: jms-lion
    environment:
      CORE_HOST: http://core:8080
      BOOTSTRAP_TOKEN: k3jBf2Lp9mNqR5sV
    depends_on:
      - core
    networks:
      - jms-net

  nginx:
    image: jumpserver/web:v3.10.0
    container_name: jms-web
    ports:
      - "8080:80"
    environment:
      CORE_HOST: http://core:8080
    depends_on:
      - core
      - koko
      - lion
    networks:
      - jms-net

networks:
  jms-net:
    driver: bridge
EOF

echo "JumpServer: http://localhost:8080"
echo "默认账号: admin"
echo "默认密码: admin"
```

---

## 22. 实验四：堡垒机高危指令拦截测试

### 步骤1：编写高危指令拦截模拟器

由于完整的JumpServer部署需要较多资源，这里提供一个简化的Python模拟器来演示高危指令拦截的原理：

```bash
cat > ~/bastion-lab/command_filter.py << 'PYEOF'
#!/usr/bin/env python3
"""
堡垒机高危指令拦截模拟器
模拟安恒堡垒机的命令过滤功能
"""

import re
import shlex

class BastionCommandFilter:
    """堡垒机命令过滤器"""
    
    def __init__(self):
        # 绝对禁止的命令模式（即使有审批也不允许）
        self.absolute_block = [
            r'rm\s+-rf\s+/',           # rm -rf /
            r'mkfs\.',                  # 格式化
            r'dd\s+if=/dev/zero',      # 清空磁盘
            r'>\s*/dev/sd[a-z]',       # 覆盖磁盘
            r'chmod\s+777\s+/',        # 修改根目录权限
        ]
        
        # 需要审批的命令
        self.require_approval = [
            r'rm\s+-rf',               # 强制删除
            r'shutdown',                # 关机
            r'reboot',                  # 重启
            r'DROP\s+(DATABASE|TABLE)', # 删除数据库/表
            r'TRUNCATE',                # 清空表
            r'DELETE\s+FROM.*(?!WHERE)',# 无条件删除
            r'useradd',                 # 添加用户
            r'passwd',                  # 修改密码
            r'iptables\s+-F',          # 清空防火墙规则
            r'kill\s+-9',              # 强制杀进程
        ]
        
        # 命令别名映射（防止简单绕过）
        self.alias_map = {
            'rm': ['/bin/rm', '/usr/bin/rm'],
            'shutdown': ['/sbin/shutdown', '/usr/sbin/shutdown', 'init 0', 'init 6'],
            'reboot': ['/sbin/reboot', '/usr/sbin/reboot', 'systemctl reboot'],
        }
    
    def expand_aliases(self, command):
        """展开命令别名"""
        expanded = [command]
        parts = command.split()
        if parts:
            cmd = parts[0]
            if cmd in self.alias_map:
                for alias in self.alias_map[cmd]:
                    expanded.append(command.replace(cmd, alias, 1))
        return expanded
    
    def check_command(self, command, user, target_server):
        """检查命令是否允许执行"""
        commands_to_check = self.expand_aliases(command)
        
        for cmd in commands_to_check:
            # 检查绝对禁止列表
            for pattern in self.absolute_block:
                if re.search(pattern, cmd, re.IGNORECASE):
                    return {
                        'allowed': False,
                        'reason': f'绝对禁止的操作：匹配规则 {pattern}',
                        'need_approval': False,
                        'alert_level': 'CRITICAL'
                    }
            
            # 检查需要审批列表
            for pattern in self.require_approval:
                if re.search(pattern, cmd, re.IGNORECASE):
                    return {
                        'allowed': False,
                        'reason': f'需要审批的操作：匹配规则 {pattern}',
                        'need_approval': True,
                        'alert_level': 'HIGH'
                    }
        
        return {
            'allowed': True,
            'reason': None,
            'need_approval': False,
            'alert_level': 'INFO'
        }
    
    def simulate_ssh_session(self, user, target_server, commands):
        """模拟SSH会话"""
        print(f"\n{'='*60}")
        print(f"堡垒机会话记录")
        print(f"{'='*60}")
        print(f"用户: {user}")
        print(f"目标服务器: {target_server}")
        print(f"会话开始时间: 2026-06-18 14:30:00")
        print(f"{'='*60}\n")
        
        blocked_count = 0
        approval_count = 0
        
        for cmd in commands:
            print(f"[{user}@{target_server}]$ {cmd}")
            
            result = self.check_command(cmd, user, target_server)
            
            if not result['allowed']:
                if result['need_approval']:
                    print(f"  ⚠️  需要审批: {result['reason']}")
                    print(f"  → 已提交审批请求，等待审批...")
                    approval_count += 1
                else:
                    print(f"  🚫 已拦截: {result['reason']}")
                    print(f"  → 命令已被堡垒机拦截，不允许执行")
                    blocked_count += 1
            else:
                print(f"  ✅ 允许执行")
        
        print(f"\n{'='*60}")
        print(f"会话统计:")
        print(f"  总命令数: {len(commands)}")
        print(f"  拦截命令: {blocked_count}")
        print(f"  需审批: {approval_count}")
        print(f"  允许执行: {len(commands) - blocked_count - approval_count}")
        print(f"{'='*60}\n")


# 演示
if __name__ == "__main__":
    filter = BastionCommandFilter()
    
    # 模拟DBA运维会话
    dba_commands = [
        "ls -la /var/log/mysql/",
        "tail -100 /var/log/mysql/error.log",
        "mysql -u root -p -e 'SHOW PROCESSLIST;'",
        "mysql -u root -p -e 'SELECT * FROM employees LIMIT 10;'",
        "rm -rf /var/lib/mysql/old_data/",      # 需要审批
        "DROP DATABASE test_old;",                # 需要审批
        "rm -rf /",                               # 绝对禁止
        "shutdown -h now",                        # 需要审批
        "systemctl restart mysql",                # 正常操作
    ]
    
    filter.simulate_ssh_session("dba_zhang", "MySQL-01", dba_commands)
    
    # 模拟系统管理员会话
    sysadmin_commands = [
        "uptime",
        "df -h",
        "free -m",
        "useradd testuser",                       # 需要审批
        "passwd testuser",                        # 需要审批
        "iptables -F",                            # 需要审批
        "dd if=/dev/zero of=/dev/sda",           # 绝对禁止
        "top",
    ]
    
    filter.simulate_ssh_session("sysadmin_li", "WebServer-01", sysadmin_commands)
PYEOF

python3 ~/bastion-lab/command_filter.py
```

---

## 23. 验收练习

### 基础题（必答）

**Q1：明御DAS为什么采用旁路部署？有什么优势和劣势？**

<details>
<summary>点击查看答案</summary>

DAS采用旁路部署，通过交换机端口镜像采集数据库流量，不在数据库的通信路径上。

优势：
- 零延迟，不影响数据库性能
- 零风险，不会成为故障点
- 部署简单，不需要修改数据库配置

劣势：
- 只能审计不能拦截（需要配合数据库防火墙才能拦截）
- 依赖交换机镜像功能
- 加密流量（如TLS）需要额外处理

</details>

**Q2：堡垒机解决的核心问题是什么？列出至少4个。**

<details>
<summary>点击查看答案</summary>

1. 账号管理混乱：多人共用账号，通过堡垒机实现一人一号
2. 权限过大：运维人员拥有完全控制权，通过命令黑白名单限制
3. 操作不可追溯：通过会话录像实现全程记录
4. 合规不满足：等保和行业监管要求运维操作可审计
5. 高危操作无拦截：通过命令过滤实时拦截危险操作

</details>

**Q3：DAS的三层关联审计是什么？如何实现？**

<details>
<summary>点击查看答案</summary>

三层关联审计将应用层、中间层、数据库层的操作关联起来：
- 应用层：知道哪个用户、从哪个IP、访问了哪个URL
- 中间层：在SQL中注入trace_id追踪标识
- 数据库层：DAS解析SQL时提取trace_id，关联三层信息

实现方式：在应用代码中向SQL注入注释标记（如 `/* trace_id:xxx */`），DAS解析SQL时提取并关联。

</details>

### 进阶题（选答）

**Q4：安恒信息的产品如何实现协同作战？请举例说明。**

<details>
<summary>点击查看答案</summary>

协同场景举例：
- WAF检测到SQL注入攻击 → 通知DAS加强该来源的审计 → DAS发现后续异常数据库查询 → 上报AiLPHA → AiLPHA综合判定为"成功的SQL注入攻击" → 自动通知堡垒机临时封禁相关账号
- 漏洞扫描发现Web漏洞 → 在WAF上创建虚拟补丁临时防护 → 通知运维修复漏洞 → 修复后重新扫描验证

</details>

**Q5：堡垒机的高危指令拦截如何防止绕过？**

<details>
<summary>点击查看答案</summary>

多层防绕过机制：
1. 命令解析：理解命令的真正结构（而非简单字符串匹配）
2. 别名展开：识别命令的各种等价写法（如 rm = /bin/rm）
3. 参数分析：识别参数的组合效果（rm -r -f = rm -rf）
4. 上下文感知：结合当前目录、用户身份等判断
5. 行为分析：分析连续命令的组合意图

</details>

---

## 24. 今日总结

### 核心收获

今天，我们完成了安恒信息数据安全产品线的学习：

**1. 明御DAS（数据库审计）**
- 旁路部署，零影响——这是DAS最核心的设计理念
- 智能SQL解析：词法分析→语法分析→语义分析，真正理解SQL含义
- 敏感数据自动识别：字段名匹配+数据内容匹配+数据分布分析
- 三层关联审计：应用层→中间层→数据库层全链路追踪

**2. 安恒堡垒机**
- 统一入口+身份认证+权限控制+操作审计+会话录像
- 高危指令智能拦截：命令解析+别名展开+参数分析+上下文感知
- 权限控制可精细到：谁能访问、能访问什么、能做什么、需要什么审批

**3. 安恒全产品线协同**
- Web安全（WAF）+ 数据安全（DAS）+ 运维安全（堡垒机）+ AI分析（AiLPHA）
- 从应用层到数据层的完整安全链

### 记忆口诀

```
安恒DAS三特点：旁路、解析、全关联
堡垒机管运维：认证、授权、看回放
Web数据两手抓，专精路线走得远
```

### 下一步

明天（Day 42），我们将完成安恒信息的学习，了解玄武盾云防护和安恒全线产品的阶段总结。

---

> **今日格言**：知道谁动了你的数据，是数据安全的第一步。不知道就等于在黑暗中裸奔。

> **扩展思考**：如果你是一家金融公司的安全负责人，你会优先部署DAS还是堡垒机？如果只能选一个，你选哪个？为什么？
