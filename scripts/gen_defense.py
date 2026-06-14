import os

DIR = r'E:\internal_safe\cisp1\cisp\public\contents\cyber-learning\defense'

def gen(filename, content):
    path = os.path.join(DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    lines = content.count('\n') + 1
    print(f'  {filename}: {lines} lines')

# ============================================================
# Day 1: 安全运营中心概述
# ============================================================
gen('day-1.md', r"""# Day 1：安全运营中心概述

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：50 分钟
>
> 安全运营中心（SOC）是现代企业网络安全防御体系的中枢神经，负责7×24小时持续监控、检测、响应安全事件。理解 SOC 的架构、流程与核心能力，是成为一名合格安全运营工程师的第一步，也是 CISP 考试中安全管理方向的高频考点。

---

## 导航目录

- [一、SOC 的定义与核心使命](#一soc-的定义与核心使命)
- [二、SOC 的演进历程](#二soc-的演进历程)
- [三、SOC 组织架构与角色分工](#三soc-的组织架构与角色分工)
- [四、SOC 核心能力模型](#四soc-核心能力模型)
- [五、SOC 技术架构全景](#五soc-技术架构全景)
- [六、SOC 工作流程与运转机制](#六soc-工作流程与运转机制)
- [七、SOC 关键绩效指标](#七soc-关键绩效指标)
- [八、SOC 成熟度模型](#八soc-成熟度模型)
- [九、SOC 常见挑战与解决思路](#九soc-常见挑战与解决思路)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、SOC 的定义与核心使命

### 1.1 SOC 的正式定义

安全运营中心（Security Operations Center，SOC）是一个集中化的组织单元或功能实体，负责持续监控、评估和防御企业信息资产的安全威胁。Gartner 将 SOC 定义为："一个由人员、流程和技术组成的团队，致力于持续改进组织的安全态势，同时预防、检测、分析和响应网络安全事件。"

> **🔑 高分考点**：SOC 的三大支柱是 **人员（People）、流程（Process）、技术（Technology）**，三者缺一不可，这也是 CISP 考试中反复强调的核心概念。

### 1.2 SOC 的核心使命（5 大职责）

SOC 的核心使命可以归纳为以下五个维度：

| 职责维度 | 具体内容 | 典型活动 |
|:---|:---|:---|
| **持续监控** | 7×24 小时实时监控网络流量、日志、端点行为 | 通过 SIEM、EDR、NDR 等工具实现全量数据采集与分析 |
| **威胁检测** | 识别已知威胁（签名匹配）和未知威胁（行为分析） | 关联分析、UEBA 异常检测、威胁情报匹配 |
| **事件响应** | 对确认的安全事件进行遏制、根除、恢复 | 按照 PDCERF 或 SANS PICERL 模型执行标准化响应 |
| **漏洞管理** | 持续发现和评估资产漏洞，推动修复闭环 | 漏洞扫描、渗透测试、补丁管理优先级排序 |
| **合规报告** | 满足等保、GDPR、SOX 等法规的审计与报告要求 | 日志留存、事件报告、态势报告定期输出 |

> **💡 知识巧记**：SOC 五大使命记作 **"监控-检测-响应-漏洞-合规"**，对应英文首字母为 M-D-R-V-C（Monitor-Detect-Respond-Vulnerability-Compliance）。

### 1.3 SOC 与传统安全团队的区别

很多考生容易混淆 SOC 与 CERT/CSIRT 的概念。下表帮助区分：

| 对比维度 | SOC | CERT/CSIRT |
|:---|:---|:---|
| **工作模式** | 持续运营，7×24 常态化 | 事件驱动，应急响应时激活 |
| **核心活动** | 监控、检测、初步响应、报告 | 深度取证、逆向分析、攻防对抗 |
| **人员构成** | Tier 1/2/3 分析师分层 | 安全研究员、取证专家、逆向工程师 |
| **技术重心** | SIEM、SOAR、告警管理 | 沙箱、取证工具、恶意代码分析平台 |
| **考核指标** | MTTD、MTTR、告警处理量 | 事件定级准确率、根因分析深度 |

> **🔑 高分考点**：SOC 强调**常态化运营**，CERT 强调**应急响应**。两者互补而非替代。成熟的企业通常同时设立 SOC 和 CERT，SOC 发现事件后升级给 CERT 做深度处置。

---

## 二、SOC 的演进历程

### 2.1 第一代 SOC：日志聚合中心（2000-2008）

早期的 SOC 主要解决"日志分散"的问题。企业部署了防火墙、IDS、服务器等大量设备，但日志各自为政，安全分析人员需要逐个登录设备查看日志，效率极低。

**技术特征**：
- 以 Syslog 服务器为核心，集中收集日志
- 简单的关键字匹配告警（如 grep "failed login"）
- 缺乏关联分析能力
- 典型案例：使用 `rsyslog` + `logwatch` 搭建简易日志中心

```bash
# 早期 SOC 典型配置：rsyslog 集中收集日志
# /etc/rsyslog.conf
$ModLoad imudp
$UDPServerRun 514
$template RemoteLogs,"/var/log/remote/%HOSTNAME%/%PROGRAMNAME%.log"
*.* ?RemoteLogs
```

### 2.2 第二代 SOC：SIEM 驱动时代（2008-2015）

随着 Splunk（2003 年成立）和 QRadar（2005 年被 IBM 收购）等商业 SIEM 产品的成熟，SOC 进入了关联分析时代。

**核心进步**：
- 多数据源关联分析（防火墙日志 + IDS 告警 + 终端日志）
- 基于规则的实时告警
- 合规驱动的日志留存（等保要求 6 个月）
- 典型部署架构：ArcSight/QRadar/Splunk 作为核心引擎

```
第二代 SOC 典型架构：

[防火墙] ────┐
[IDS/IPS] ───┼──→ [日志采集器] ──→ [SIEM 引擎] ──→ [分析师控制台]
[服务器]  ───┤                        │
[终端]    ───┘                    [关联规则库]
```

### 2.3 第三代 SOC：智能运营时代（2015-至今）

当前第三代 SOC 的核心特征是引入 AI/ML、SOAR（安全编排自动化与响应）、威胁情报平台（TIP）和 ATT&CK 框架驱动分析。

**关键能力升级**：
- **UEBA（用户实体行为分析）**：使用机器学习检测异常行为，如 Splunk UBA、Microsoft Sentinel UEBA
- **SOAR**：自动化剧本（Playbook）执行，如 Splunk Phantom、Palo Alto Cortex XSOAR
- **威胁情报驱动**：集成 MISP、Anomali、Recorded Future 等 TIP 平台
- **ATT&CK 映射**：将检测规则映射到 MITRE ATT&CK 框架，实现覆盖度可视化

> **🔑 高分考点**：第三代 SOC 的标志性技术是 **SOAR + UEBA + TIP** 三件套，考试常考三者各自的作用和协同关系。

---

## 三、SOC 组织架构与角色分工

### 3.1 经典三梯次（Tier）模型

SOC 最经典的人员组织模式是三层梯队：

| 梯队 | 角色 | 核心职责 | 技能要求 |
|:---|:---|:---|:---|
| **Tier 1** | 初级分析师 | 告警筛选、初步分类、创建工单、简单事件处置 | SIEM 操作、基本网络知识、日志解读 |
| **Tier 2** | 中级分析师 | 深度事件分析、攻击链还原、威胁狩猎、编写检测规则 | 网络取证、恶意代码基础分析、ATT&CK 框架 |
| **Tier 3** | 高级分析师 | 复杂攻击调查、逆向分析、新攻击手法研究、检测策略制定 | 逆向工程、漏洞研究、威胁情报分析 |

### 3.2 SOC 关键岗位详解

**SOC 经理（SOC Manager）**：
- 负责团队管理、排班、绩效考核
- 制定运营流程和 SLA
- 向 CISO/CSO 汇报安全态势
- 管理 SOC 预算和工具采购

**安全分析师（Security Analyst）**：
- 每日处理 SIEM 告警队列
- 执行事件分类和初步调查
- 编写事件报告
- 典型工作流：告警 → 确认误报/真阳性 → 升级或关闭

**威胁狩猎者（Threat Hunter）**：
- 主动搜索绕过自动化检测的威胁
- 基于假设驱动的分析方法
- 使用 Jupyter Notebook、Spark 等工具进行大数据分析
- 典型假设："如果攻击者使用了合法的 PowerShell 来横向移动，我们的检测规则能发现吗？"

**安全编排工程师（SOAR Engineer）**：
- 开发和维护自动化剧本（Playbook）
- 集成各类安全工具 API
- 实现告警自动富化（IP 信誉查询、域名 WHOIS、文件哈希查询）

> **💡 知识巧记**：Tier 1 → "告警接线员"（快速筛选），Tier 2 → "案件侦查员"（深度分析），Tier 3 → "特种部队"（攻坚克难）。

### 3.3 SOC 排班模式

7×24 小时运营的 SOC 通常采用以下排班模式：

| 模式 | 描述 | 优点 | 缺点 |
|:---|:---|:---|:---|
| **8×5 常白班** | 仅工作日白天运营 | 成本低 | 覆盖严重不足 |
| **三班倒** | 早班/中班/夜班，每班 8 小时 | 全面覆盖 | 人员需求大（至少 5 人/岗） |
| **Follow-the-Sun** | 全球多地 SOC 接力，利用时区优势 | 无需夜班 | 需要多地协同，交接复杂 |
| **On-call 混合** | 白天常驻 + 夜间远程值班 | 成本适中 | 夜间响应速度较慢 |

---

## 四、SOC 核心能力模型

### 4.1 MITRE SOC 能力框架

MITRE 提出了 SOC 的十大核心能力，CISP 考试可能涉及：

1. **数据采集能力** — 全量日志、网络流量、端点遥测数据的完整采集
2. **检测工程能力** — 将威胁情报转化为可执行的检测规则
3. **事件分析能力** — 告警分类、攻击链还原、影响范围评估
4. **自动化与编排** — SOAR 剧本实现告警自动处置
5. **威胁情报能力** — 情报的采集、加工、消费闭环
6. **威胁狩猎能力** — 主动搜索未知威胁
7. **漏洞管理能力** — 从发现到修复的全生命周期管理
8. **红蓝对抗能力** — 通过模拟攻击验证检测有效性
9. **态势感知能力** — 全局安全态势的可视化展示
10. **持续改进能力** — 基于指标驱动优化运营效率

### 4.2 数据采集能力详解

数据采集是 SOC 的"血液"。没有全面、高质量的数据，后续所有分析都无从谈起。

**关键数据源**：

| 数据源类型 | 具体来源 | 采集技术 | 典型格式 |
|:---|:---|:---|:---|
| 网络流量 | 路由器 NetFlow、交换机 SPAN 镜像 | sFlow/NetFlow/IPFIX 协议 | NetFlow v9、IPFIX |
| 安全设备日志 | 防火墙、IDS/IPS、WAF | Syslog（UDP/TCP 514）| CEF、LEEF、JSON |
| 终端日志 | Windows Event Log、Linux auditd | Winlogbeat、Auditbeat、Osquery | XML、JSON |
| 应用日志 | Web 服务器、数据库、中间件 | Filebeat、Fluentd | Apache Combined、JSON |
| 身份认证日志 | AD、LDAP、SSO 系统 | Syslog、API 拉取 | 自定义格式 |
| 云平台日志 | AWS CloudTrail、Azure Monitor | API 拉取、Event Hub | JSON |

```yaml
# Winlogbeat 配置示例：采集 Windows 安全日志
winlogbeat.event_logs:
  - name: Security
    ignore_older: 72h
  - name: System
  - name: Application
output.elasticsearch:
  hosts: ["192.168.1.100:9200"]
  index: "winlogbeat-%{+yyyy.MM.dd}"
```

### 4.3 检测工程能力

检测工程是将安全知识转化为可执行检测规则的过程。核心方法论：

**Sigma 规则**：通用的检测规则格式，可转换为多种 SIEM 查询语言。

```yaml
# Sigma 规则示例：检测可疑的 PowerShell 下载执行
title: Suspicious PowerShell Download
id: 3b6ab547-8e4d-4f2c-98b4-4e2c5f3f3a9e
status: test
description: Detects suspicious PowerShell download cradles
references:
  - https://attack.mitre.org/techniques/T1059/001/
author: SOC Team
date: 2024/01/15
tags:
  - attack.execution
  - attack.t1059.001
logsource:
  product: windows
  category: process_creation
detection:
  selection:
    Image|endswith: '\powershell.exe'
    CommandLine|contains:
      - 'DownloadString'
      - 'DownloadFile'
      - 'Invoke-WebRequest'
      - 'Invoke-RestMethod'
      - 'Net.WebClient'
  condition: selection
falsepositives:
  - Legitimate administrative scripts
level: high
```

> **🔑 高分考点**：Sigma 是 **"一次编写，到处运行"** 的检测规则标准，支持转换为 Splunk SPL、Elasticsearch Query DSL、QRadar AQL 等多种格式。

---

## 五、SOC 技术架构全景

### 5.1 经典 SOC 技术栈

```
                          ┌─────────────────────────────────┐
                          │         SOC 分析师控制台         │
                          │    (Kibana / Splunk Dashboard)   │
                          └──────────────┬──────────────────┘
                                         │
                          ┌──────────────▼──────────────────┐
                          │         SOAR 编排层               │
                          │   (Splunk Phantom / Cortex XSOAR) │
                          └──────────────┬──────────────────┘
                                         │
          ┌──────────────────────────────┼──────────────────────────────┐
          │                              │                              │
┌─────────▼─────────┐      ┌────────────▼────────────┐      ┌─────────▼─────────┐
│   SIEM 引擎        │      │   威胁情报平台 (TIP)      │      │   大数据分析平台    │
│ (Splunk / ELK)    │◄────►│  (MISP / OpenCTI)       │      │ (Hadoop / Spark)   │
└─────────┬─────────┘      └─────────────────────────┘      └───────────────────┘
          │
    ┌─────┴──────────────────────────────────────┐
    │              数据采集层                      │
    │  (Logstash / Fluentd / Cribl / NXLog)      │
    └─────┬──────────────────────────────────────┘
          │
    ┌─────┴──────────────────────────────────────┐
    │              数据源层                        │
    │  防火墙 │ IDS │ EDR │ WAF │ AD │ 云审计     │
    └────────────────────────────────────────────┘
```

### 5.2 核心组件详解

**SIEM（安全信息与事件管理）**：
- **Splunk Enterprise Security**：商业 SIEM 标杆，按数据量计费
- **Elastic Security（ELK Stack）**：开源方案，ELK = Elasticsearch + Logstash + Kibana
- **IBM QRadar**：老牌 SIEM，金融行业广泛使用
- **Microsoft Sentinel**：云原生 SIEM，与 Azure 深度集成
- **ArcSight**：Micro Focus 产品，政府/军工领域使用较多

**SOAR（安全编排自动化与响应）**：
- 核心功能：告警自动富化、自动封禁 IP、自动创建工单、Playbook 执行
- 典型剧本示例：收到钓鱼邮件告警 → 提取发件 IP → 查询威胁情报 → 如确认为恶意 → 自动封禁 IP → 创建 Jira 工单 → 通知相关人员

**EDR（端点检测与响应）**：
- CrowdStrike Falcon、Microsoft Defender for Endpoint、SentinelOne
- 提供终端进程树、网络连接、文件操作等细粒度遥测数据

**NDR（网络检测与响应）**：
- 基于网络流量分析检测威胁（如 C2 通信、横向移动、数据外泄）
- 代表产品：Darktrace、Vectra AI、Corelight（基于 Zeek）

### 5.3 日志存储与保留策略

| 日志类型 | 热存储（SSD） | 温存储（HDD） | 冷存储（对象存储） |
|:---|:---|:---|:---|
| 安全告警日志 | 30 天 | 90 天 | 1 年 |
| 网络流量元数据 | 7 天 | 30 天 | 6 个月 |
| 原始 PCAP | 3 天 | — | 视合规要求 |
| 审计日志 | 30 天 | 180 天 | 3 年（等保要求 6 个月） |
| 终端遥测 | 7 天 | 30 天 | 1 年 |

```bash
# Elasticsearch ILM（索引生命周期管理）策略示例
PUT _ilm/policy/soc-hot-warm-cold
{
  "policy": {
    "phases": {
      "hot": {
        "min_age": "0ms",
        "actions": { "rollover": { "max_size": "50GB", "max_age": "1d" } }
      },
      "warm": {
        "min_age": "7d",
        "actions": { "shrink": { "number_of_shards": 1 }, "forcemerge": { "max_num_segments": 1 } }
      },
      "cold": {
        "min_age": "30d",
        "actions": { "searchable_snapshot": { "snapshot_repository": "soc_backup" } }
      },
      "delete": { "min_age": "365d", "actions": { "delete": {} } }
    }
  }
}
```

---

## 六、SOC 工作流程与运转机制

### 6.1 事件处理标准流程

SOC 的标准事件处理流程通常遵循以下步骤：

```
告警产生 → 告警分类 → 初步调查 → 确认/升级 → 深入分析 → 响应处置 → 复盘总结
   │          │          │          │          │          │          │
   ▼          ▼          ▼          ▼          ▼          ▼          ▼
 SIEM     Tier 1    查看原始   真阳性?    Tier 2/3   隔离/封禁   AAR报告
 规则      筛选       日志       → 升级    深度分析    清除/恢复  Lessons
 触发                         误报?                               Learned
                              → 关闭
```

### 6.2 告警处理 SLA 标准

| 告警严重级别 | 响应时限（SLA） | 升级条件 | 示例场景 |
|:---|:---|:---|:---|
| **Critical（严重）** | 15 分钟内响应 | 30 分钟无进展自动升级 | 勒索软件爆发、核心服务器失陷 |
| **High（高危）** | 30 分钟内响应 | 2 小时无进展自动升级 | 发现 C2 通信、成功登录可疑 IP |
| **Medium（中危）** | 4 小时内响应 | 8 小时无进展自动升级 | 端口扫描、暴力破解尝试 |
| **Low（低危）** | 24 小时内响应 | 48 小时无进展自动升级 | 策略违规、异常但非恶意的行为 |

> **🔑 高分考点**：MTTD（Mean Time to Detect，平均检测时间）和 MTTR（Mean Time to Respond，平均响应时间）是 SOC 最核心的运营指标。

### 6.3 交接班流程

7×24 运营的 SOC 必须建立规范的交接班机制：

1. **班次记录**：值班分析师在工单系统（如 Jira）中记录本班次所有事件的处理进展
2. **重点事项**：标注未关闭的高危告警、进行中的调查、待确认的异常
3. **环境变更**：记录班次内发生的网络变更、系统更新、规则变更
4. **交接会议**：交班和接班分析师进行 15 分钟面对面/线上交接
5. **确认签字**：接班分析师确认已理解所有待处理事项

---

## 七、SOC 关键绩效指标

### 7.1 效率指标

| 指标 | 缩写 | 定义 | 行业基准 |
|:---|:---|:---|:---|
| 平均检测时间 | MTTD | 从入侵发生到被检测的时间 | < 1 小时（成熟 SOC） |
| 平均响应时间 | MTTR | 从检测到完成遏制的时间 | < 4 小时 |
| 平均遏制时间 | MTTC | 从确认事件到完成遏制的时间 | < 1 小时 |
| 告警误报率 | FPR | 误报告警占总告警的比例 | < 30%（目标 < 10%） |
| 分析师人均处理量 | — | 每日人均处理的告警数量 | 50-100 条/天 |

### 7.2 效果指标

| 指标 | 定义 | 计算方式 |
|:---|:---|:---|
| 检测覆盖率 | SOC 能检测到的 ATT&CK 技术占总技术的比例 | 已覆盖技术数 / ATT&CK 总技术数 |
| 自动化率 | 通过 SOAR 自动处置的告警比例 | 自动处置数 / 总告警数 |
| 事件逃逸率 | 由外部渠道（第三方、用户报告）发现而非 SOC 发现的事件比例 | 外部报告事件数 / 总事件数 |

### 7.3 指标陷阱

> **🎯 考试陷阱提醒**：MTTD 和 MTTR 数值越低越好，但如果只追求低 MTTD 而放宽检测规则，会导致误报激增，反而降低运营效率。指标需要**平衡考虑**。

---

## 八、SOC 成熟度模型

### 8.1 CMM 五级成熟度

SOC 能力成熟度模型（SOC-CMM）通常分为 5 个等级：

| 等级 | 名称 | 特征 | 典型状态 |
|:---|:---|:---|:---|
| **Level 1** | 初始级 | 无专职 SOC，安全事件靠 IT 团队兼职处理 | 中小企业常见状态 |
| **Level 2** | 可重复级 | 有基本监控工具（如免费 SIEM），流程靠个人经验 | 开始有安全预算 |
| **Level 3** | 已定义级 | 标准化流程、SLA、KPI，专职 SOC 团队 | 大多数中型企业 |
| **Level 4** | 可管理级 | SOAR 自动化、威胁狩猎、ATT&CK 覆盖度可视化 | 金融、互联网头部企业 |
| **Level 5** | 优化级 | AI 驱动、自适应安全架构、持续自动优化 | 少数顶级安全企业 |

### 8.2 成熟度评估维度

评估 SOC 成熟度通常从以下 6 个维度进行：

1. **人员能力**：分析师技能水平、培训体系、认证覆盖率（CISP、CISSP、SANS 等）
2. **流程标准化**：SOP 完善度、事件分类标准、升级机制
3. **技术平台**：SIEM/SOAR/EDR/TIP 等工具栈的完整度和集成度
4. **数据质量**：数据源的全面性、日志标准化程度（如 CIM 数据模型）
5. **检测能力**：ATT&CK 覆盖度、检测规则数量和有效性
6. **持续改进**：红蓝对抗频率、AAR（After Action Review）机制

---

## 九、SOC 常见挑战与解决思路

### 9.1 告警疲劳（Alert Fatigue）

**问题描述**：SOC 每天产生数千甚至数万条告警，分析师无法逐条分析，导致真正的高危告警被淹没。

**真实数据**：根据 FireEye 2020 年报告，SOC 分析师平均每天收到 10000+ 告警，其中 40% 以上是误报，实际能处理的不到 50%。

**解决思路**：
- 实施告警聚合（将同一来源的多条告警合并为一条事件）
- 调优 SIEM 规则阈值，降低误报率
- 部署 SOAR 实现低危告警的自动处置
- 使用 UEBA 建立行为基线，只告警偏离基线的行为

### 9.2 人才短缺

**问题描述**：全球网络安全人才缺口超过 340 万（ISC² 2023 年报告），SOC 分析师是最紧缺的岗位之一。

**应对策略**：
- 建设 SOC 内部培训体系，培养 Tier 1 向 Tier 2 进阶
- 采用 MSSP（托管安全服务提供商）补充人力
- 通过 SOAR 自动化减少对人工分析的依赖
- 建立知识库，降低新人上手门槛

### 9.3 工具碎片化

**问题描述**：企业可能同时部署了 Splunk、CrowdStrike、Palo Alto、Tenable 等多个独立安全工具，各自为政，缺乏统一视图。

**解决思路**：
- 建立统一的安全数据湖（Security Data Lake）
- 采用 OCSF（Open Cybersecurity Schema Framework）标准化数据格式
- 通过 SOAR 平台实现多工具 API 集成
- 定期评估工具栈，淘汰重叠和低效的工具

### 9.4 真实案例：Capital One 数据泄露事件

2019 年 7 月，Capital One 发生大规模数据泄露，影响 1.06 亿用户。事后分析发现：

- **攻击者利用了配置错误的 AWS WAF**（CVE-2019-0000 系列 SSRF 漏洞）
- **SOC 未能及时发现异常 API 调用**：攻击者通过 SSRF 访问了 AWS 元数据服务，获取了临时凭证
- **教训**：SOC 需要监控云环境的 API 调用日志（CloudTrail），建立云安全告警规则

```bash
# 攻击者利用 SSRF 获取 AWS 临时凭证的关键步骤
# 攻击者通过 Web 应用发起请求：
curl http://vulnerable-app/ssrf?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/s3role

# 如果 SOC 监控了以下 CloudTrail 事件，本可以提前发现：
# - GetCallerIdentity 异常调用
# - S3 ListBuckets 来自非预期 IP
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | SOC 三大支柱 | ★★★★★ | 低 | 人员（People）、流程（Process）、技术（Technology） |
| 2 | SOC 与 CERT 的区别 | ★★★★☆ | 中 | SOC 常态化运营，CERT 事件驱动应急 |
| 3 | Tier 1/2/3 职责划分 | ★★★★☆ | 低 | T1 告警筛选，T2 深度分析，T3 攻坚研究 |
| 4 | MTTD 和 MTTR 定义 | ★★★★★ | 低 | MTTD 平均检测时间，MTTR 平均响应时间 |
| 5 | 第三代 SOC 标志技术 | ★★★☆☆ | 中 | SOAR + UEBA + TIP 三件套 |
| 6 | SIEM 全称与作用 | ★★★★★ | 低 | Security Information and Event Management，安全信息与事件管理 |
| 7 | SOC-CMM 五级模型 | ★★★☆☆ | 中 | 初始级→可重复级→已定义级→可管理级→优化级 |
| 8 | 告警疲劳应对策略 | ★★★★☆ | 中 | 告警聚合、规则调优、SOAR 自动化、UEBA 基线 |

### 💡 知识巧记口诀

> **"人流程技三支柱"** — SOC 核心是人员、流程、技术的有机统一，不是买一堆设备就能建好 SOC
>
> **"T1 筛 T2 查 T3 专"** — 三个梯队分工：Tier 1 筛选告警，Tier 2 深入调查，Tier 3 专家攻关
>
> **"SOC 常态运营，CERT 应急出动"** — SOC 是常备军，每天运转；CERT 是特种兵，事件驱动
>
> **"MTTD 发现快，MTTR 处理快"** — 两个核心指标：检测要快、响应要快，但不能以牺牲准确率为代价
>
> **"SOAR 自动跑剧本，UEBA 行为找异常"** — 第三代 SOC 的两大技术利器

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "SOC 就是买一套 SIEM 装上就行" | ❌ 错误！SOC 是组织能力，技术只是其中一环，没有人员和流程支撑的 SIEM 只是"告警显示器" |
| "MTTD 越短越好，可以无限制降低" | ❌ 错误！过短的检测时间往往意味着过于敏感的规则，导致误报率飙升，最终损害运营效率 |
| "SOC 应该把所有告警都处理完" | ❌ 错误！SOC 需要分层分级，低危告警可通过自动化处置，核心精力应聚焦高危事件 |
| "Tier 1 分析师不需要技术能力" | ❌ 错误！Tier 1 需要理解日志、网络协议、操作系统基础，否则无法判断告警的真伪 |
| "有了 AI 就能替代 SOC 分析师" | ❌ 错误！AI 辅助检测和自动化，但复杂攻击的调查决策仍需人类判断力 |

---

## 学习建议

1. 🏗️ **理解架构而非背工具名**：不要只记 Splunk/QRadar 等产品名称，要理解 SIEM 的底层原理——日志采集→解析→存储→检索→告警→可视化
2. 📊 **动手搭建一个简易 SOC 环境**：用 ELK Stack（Elasticsearch + Logstash + Kibana）+ 几台虚拟机搭建一个迷你 SOC，采集 Windows Event Log 和 Syslog
3. 📖 **阅读行业报告**：每年阅读 SANS SOC Survey、Gartner SOC 魔力象限、MITRE SOC 能力框架
4. 🔄 **实践 ATT&CK 映射**：将你的检测规则逐一映射到 MITRE ATT&CK 技术，评估覆盖度
5. 📋 **编写一份 SOC 运营 SOP**：模拟编写事件分类标准、告警处理流程、升级矩阵等文档
6. 🎯 **关注指标**：理解 MTTD/MTTR 等指标的计算方式，学会用数据衡量 SOC 效率

---

> **安全运营不是一蹴而就的项目，而是一场永不停歇的马拉松。每一次告警分析、每一次事件复盘，都是向更成熟的安全运营迈进的一步。**
""")

print("Day 1 done")

# ============================================================
# Day 2: 日志收集与管理
# ============================================================
gen('day-2.md', r"""# Day 2：日志收集与管理

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：50 分钟
>
> 日志是安全运营的"原材料"。没有高质量的日志收集，再先进的 SIEM 也是无米之炊。本章从 Syslog 协议原理、日志标准化、采集架构到存储策略，系统梳理安全日志管理的全链路，其中 Syslog 协议、日志保留期限、常见日志格式是 CISP 考试高频考点。

---

## 导航目录

- [一、日志管理的安全价值](#一日志管理的安全价值)
- [二、Syslog 协议深度解析](#二syslog-协议深度解析)
- [三、Windows 事件日志体系](#三windows-事件日志体系)
- [四、Linux 审计系统详解](#四linux-审计系统详解)
- [五、日志采集架构设计](#五日志采集架构设计)
- [六、日志标准化与富化](#六日志标准化与富化)
- [七、日志存储与生命周期管理](#七日志存储与生命周期管理)
- [八、日志分析实战技巧](#八日志分析实战技巧)
- [九、日志安全合规要求](#九日志安全合规要求)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、日志管理的安全价值

### 1.1 为什么日志是安全的基石

日志记录了信息系统中发生的每一个事件。对于安全运营而言，日志有三大核心价值：

| 价值维度 | 说明 | 典型场景 |
|:---|:---|:---|
| **事后追溯** | 发生安全事件后，通过日志还原攻击路径和时间线 | 数据泄露调查、内部违规取证 |
| **实时检测** | 将日志实时送入 SIEM 进行关联分析，发现攻击行为 | 暴力破解检测、异常登录告警 |
| **合规审计** | 满足法律法规对日志保留和审计的要求 | 等保 2.0、GDPR、SOX 审计 |

> **🔑 高分考点**：日志是**不可否认性（Non-repudiation）**的关键技术基础。没有日志，安全事件无法溯源、无法定责。

### 1.2 安全日志的"黄金数据"

并不是所有日志都有同等的安全价值。以下是最重要的安全日志类别：

| 日志类别 | 优先级 | 包含的关键信息 | 安全用途 |
|:---|:---:|:---|:---|
| 认证日志 | ★★★★★ | 登录成功/失败、用户、来源 IP、时间戳 | 暴力破解检测、账号异常检测 |
| 进程创建日志 | ★★★★★ | 进程名、命令行参数、父进程、用户 | 恶意软件执行、横向移动检测 |
| 网络连接日志 | ★★★★☆ | 源/目标 IP、端口、协议、字节数 | C2 通信、数据外泄检测 |
| 文件操作日志 | ★★★★☆ | 文件路径、操作类型、进程 | 勒索软件、数据窃取检测 |
| 注册表修改 | ★★★☆☆ | 键路径、修改值、进程 | 持久化机制检测 |
| DNS 查询日志 | ★★★★☆ | 查询域名、客户端 IP、响应 IP | DGA 域名检测、DNS 隧道检测 |

### 1.3 日志管理面临的挑战

- **海量数据**：大型企业每天产生 TB 级别的日志数据
- **格式异构**：不同厂商的设备使用完全不同的日志格式（CEF、LEEF、JSON、KV、纯文本）
- **时钟不同步**：设备时间不一致导致事件关联失败（必须配置 NTP 时间同步）
- **日志篡改**：攻击者入侵后通常会清除日志，需要日志防篡改机制
- **存储成本**：全量日志长期保存成本高昂，需要冷热分层策略

---

## 二、Syslog 协议深度解析

### 2.1 Syslog 协议概述

Syslog 是网络设备日志传输的事实标准，定义于 RFC 5424（最新版，2009 年）和 RFC 3164（旧版 BSD Syslog，2001 年）。几乎所有的网络设备、Linux/Unix 系统、安全设备都支持 Syslog。

**Syslog 协议栈**：
- 传输层：UDP 514（默认，无连接、不可靠但高效）或 TCP 514（可靠但开销大）
- 消息格式：RFC 5424 定义了结构化的 Syslog 消息格式
- 严重级别：0（Emergency）到 7（Debug）共 8 个级别
- 设施（Facility）：标识日志来源类型（0-23）

### 2.2 Syslog 消息格式详解

**RFC 5424 Syslog 消息结构**：

```
<PRI>VERSION TIMESTAMP HOSTNAME APP-NAME PROCID MSGID [SD-ID SD-PARAM...] MESSAGE
```

**逐字段解析**：

| 字段 | 说明 | 示例 |
|:---|:---|:---|
| PRI | 优先级 = Facility × 8 + Severity | `<134>` = local0 × 8 + 6 (Info) |
| VERSION | Syslog 协议版本 | `1` |
| TIMESTAMP | ISO 8601 格式时间戳 | `2024-06-15T08:30:00.000Z` |
| HOSTNAME | 发送设备主机名 | `fw-core-01` |
| APP-NAME | 应用名称 | `sshd` |
| PROCID | 进程 ID | `12345` |
| MSGID | 消息 ID | `FAILED_LOGIN` |
| SD | 结构化数据（键值对） | `[auth@32473 src_ip="10.1.1.100" user="root"]` |
| MESSAGE | 自由文本消息 | `Failed password for root from 10.1.1.100 port 22 ssh2` |

**实际 Syslog 消息示例**：

```
<134>1 2024-06-15T08:30:00.000Z fw-core-01 sshd 12345 FAILED_LOGIN [auth@32473 src_ip="10.1.1.100" user="root" result="failed"] Failed password for root from 10.1.1.100 port 22 ssh2
```

### 2.3 Syslog Severity（严重级别）

| 数值 | 级别 | 关键字 | 描述 | 安全场景示例 |
|:---:|:---|:---|:---|:---|
| 0 | Emergency | EMERG | 系统不可用 | 核心安全设备宕机 |
| 1 | Alert | ALERT | 必须立即处理 | 检测到正在进行的 DDoS 攻击 |
| 2 | Critical | CRIT | 严重情况 | 防火墙规则被绕过 |
| 3 | Error | ERROR | 错误情况 | IDS 引擎崩溃 |
| 4 | Warning | WARNING | 警告情况 | 磁盘空间不足 80% |
| 5 | Notice | NOTICE | 正常但重要 | 管理员登录成功 |
| 6 | Info | INFO | 信息性消息 | 防火墙允许连接 |
| 7 | Debug | DEBUG | 调试信息 | 数据包详细内容 |

### 2.4 Syslog Facility（设施类型）

| 数值 | 设施 | 用途 |
|:---:|:---|:---|
| 0 | kern | 内核消息 |
| 1 | user | 用户级消息 |
| 2 | mail | 邮件系统 |
| 3 | daemon | 系统守护进程 |
| 4 | auth | 安全/认证消息（Linux authpriv） |
| 5 | syslog | Syslogd 内部消息 |
| 10 | authpriv | 安全/认证（私有） |
| 16 | local0 | 本地自定义 0（安全设备常用） |
| 17 | local1 | 本地自定义 1 |
| 18-23 | local2-7 | 其他本地自定义 |

> **🔑 高分考点**：Facility 和 Severity 组合形成 PRI 值。公式：`PRI = Facility × 8 + Severity`。例如 `authpriv.info` = 10 × 8 + 6 = 86，对应 PRI `<86>`。

### 2.5 Syslog 配置实战

**Rsyslog 服务端配置（日志收集中心）**：

```bash
# /etc/rsyslog.conf
# 启用 UDP 和 TCP 接收
$ModLoad imudp
$UDPServerRun 514
$ModLoad imtcp
$InputTCPServerRun 514

# 按来源 IP 和设施分类存储
$template RemoteLogs,"/var/log/remote/%FROMHOST-IP%/%$YEAR%-%$MONTH%/%syslogfacility-text%.log"
:fromhost-ip, !isequal, "127.0.0.1" ?RemoteLogs

# 安全日志单独处理
$template AuthLogs,"/var/log/remote/%FROMHOST-IP%/auth.log"
:syslogfacility-text, isequal, "authpriv" ?AuthLogs

# 丢弃 debug 级别日志（节省空间）
*.debug ~
```

**Rsyslog 客户端配置（发送日志）**：

```bash
# /etc/rsyslog.d/50-forward.conf
# 将所有 authpriv 日志发送到 SOC 日志收集器
authpriv.* @192.168.100.50:514     # UDP
# authpriv.* @@192.168.100.50:514  # TCP（加一个@）
```

> **💡 知识巧记**：一个 `@` 是 UDP，两个 `@@` 是 TCP。UDP 快但不保证到达，TCP 可靠但可能有连接开销。

---

## 三、Windows 事件日志体系

### 3.1 Windows 事件日志架构

Windows 使用 EVT（旧版）和 EVTX（Windows Vista 起）格式存储事件日志。安全相关日志主要位于以下通道：

| 日志通道 | 说明 | 关键事件 ID |
|:---|:---|:---|
| **Security** | 安全审计事件（最重要） | 4624（登录成功）、4625（登录失败）、4688（进程创建）、5156（网络连接） |
| **System** | 系统事件 | 7045（服务安装）、7036（服务状态变更） |
| **Application** | 应用程序事件 | 应用程序崩溃、自定义审计 |
| **PowerShell Operational** | PowerShell 执行日志 | 4104（脚本块记录）、4103（模块记录） |
| **Sysmon Operational** | Sysinternals Sysmon 日志 | 1（进程创建）、3（网络连接）、11（文件创建）、13（注册表修改） |

### 3.2 关键安全事件 ID 详解

**Event ID 4624 — 成功登录**：

```
Log Name:      Security
Source:        Microsoft-Windows-Security-Auditing
Event ID:      4624
Task Category: Logon
Level:         Information
Keywords:      Audit Success
Description:
  Account Name:        administrator
  Account Domain:      CORP
  Logon ID:            0x3E7
  Logon Type:          10          # 10 = RemoteInteractive (RDP)
  Source Network Address: 192.168.1.100
  Source Port:         49123
```

**Logon Type 对照表**：

| Type | 含义 | 安全关注点 |
|:---:|:---|:---|
| 2 | 交互式登录（本地控制台） | 非工作时间出现需警惕 |
| 3 | 网络登录（SMB 共享） | PsExec 横向移动利用此类型 |
| 4 | 批处理登录 | 计划任务触发 |
| 5 | 服务登录 | 恶意服务可能利用 |
| 7 | 解锁 | 正常 |
| 8 | 网络明文登录（IIS） | 不推荐 |
| 9 | NewCredentials | RunAs 命令 |
| 10 | 远程交互式登录（RDP） | 重点关注来源 IP |
| 11 | 缓存交互式登录 | 域控制器不可达时使用 |

**Event ID 4625 — 登录失败**：

```powershell
# 查询最近 24 小时的登录失败事件
Get-WinEvent -FilterHashtable @{
    LogName='Security'
    ID=4625
    StartTime=(Get-Date).AddHours(-24)
} | Select-Object TimeCreated, @{N='User';E={$_.Properties[5].Value}}, @{N='SourceIP';E={$_.Properties[19].Value}} | Format-Table -AutoSize
```

**Event ID 4688 — 进程创建**（需要启用审计策略）：

```
关键字段：
  - NewProcessName: C:\Windows\System32\cmd.exe
  - ParentProcessName: C:\Windows\System32\winword.exe   ← Word 启动 cmd？可疑！
  - CommandLine: cmd.exe /c powershell -enc SQBFAF...     ← Base64 编码？恶意！
```

### 3.3 Sysmon — Windows 安全日志的增强利器

Sysmon（System Monitor）是微软 Sysinternals 套件中的免费工具，提供了远超 Windows 原生审计的事件详细程度。

**Sysmon 安装与配置**：

```bash
# 下载并安装 Sysmon（需要管理员权限）
sysmon64.exe -accepteula -i sysmonconfig.xml

# 更新配置
sysmon64.exe -c sysmonconfig.xml
```

**关键 Sysmon 事件**：

| Event ID | 事件类型 | 安全价值 |
|:---:|:---|:---|
| 1 | 进程创建 | 包含完整命令行、哈希值、父进程 GUID |
| 3 | 网络连接 | 记录每个进程的网络连接（含 IP、端口） |
| 7 | 镜像加载 | 检测 DLL 劫持、反射注入 |
| 8 | 远程线程创建 | 检测进程注入（常见恶意行为） |
| 11 | 文件创建 | 监控敏感目录的文件创建 |
| 13 | 注册表修改 | 检测持久化注册表项 |
| 22 | DNS 查询 | 进程级 DNS 查询记录（检测 DGA 域名） |

**Sysmon 配置示例（检测 Mimikatz）**：

```xml
<Sysmon schemaversion="4.82">
  <EventFiltering>
    <RuleGroup name="Detect Mimikatz" groupRelation="or">
      <ProcessAccess onmatch="include">
        <!-- Mimikatz 特征：访问 lsass.exe 进程 -->
        <TargetImage condition="end with">lsass.exe</TargetImage>
        <GrantedAccess condition="is">0x1010</GrantedAccess>
        <GrantedAccess condition="is">0x1410</GrantedAccess>
        <GrantedAccess condition="is">0x1438</GrantedAccess>
        <GrantedAccess condition="is">0x143a</GrantedAccess>
      </ProcessAccess>
    </RuleGroup>
  </EventFiltering>
</Sysmon>
```

---

## 四、Linux 审计系统详解

### 4.1 Auditd 架构

Linux Audit 子系统（auditd）是 Linux 内核级审计框架，能记录系统调用、文件访问、用户登录等细粒度事件。

**核心组件**：
- `auditd`：审计守护进程
- `auditctl`：运行时配置工具
- `ausearch`：审计日志搜索工具
- `aureport`：审计报告生成工具
- `/etc/audit/auditd.conf`：守护进程配置
- `/etc/audit/rules.d/`：审计规则目录

### 4.2 审计规则配置

```bash
# /etc/audit/rules.d/10-security.rules

# 监控 /etc/passwd 和 /etc/shadow 的修改（账户管理）
-w /etc/passwd -p wa -k identity_changes
-w /etc/shadow -p wa -k identity_changes
-w /etc/sudoers -p wa -k sudoers_changes

# 监控关键系统目录
-w /etc/cron.d/ -p wa -k cron_changes
-w /etc/init.d/ -p wa -k init_changes

# 监控所有用户执行的命令（高安全环境）
-a always,exit -F arch=b64 -S execve -k command_execution

# 监控对 /var/log 的删除行为
-w /var/log/ -p wa -k log_tampering

# 监控特权命令的使用
-a always,exit -F path=/usr/bin/sudo -F perm=x -k sudo_execution
-a always,exit -F path=/usr/bin/su -F perm=x -k su_execution

# 监控系统时间修改（反取证）
-a always,exit -F arch=b64 -S clock_settime -k time_change

# 加载规则
# auditctl -R /etc/audit/rules.d/10-security.rules
```

### 4.3 审计日志分析

**搜索关键事件**：

```bash
# 搜索失败的登录尝试
ausearch -m USER_LOGIN --success no -ts today

# 搜索特定用户的审计事件
ausearch -ua root -ts 06/15/2024 -te 06/16/2024

# 搜索 sudo 执行记录
ausearch -k sudo_execution -i

# 生成每日审计摘要报告
aureport --summary

# 生成认证事件报告
aureport -au -ts yesterday

# 搜索特定文件的访问记录
ausearch -f /etc/shadow -i
```

**审计日志条目示例**：

```
type=SYSCALL msg=audit(1718438400.123:4567): arch=c000003e syscall=59
  success=yes exit=0 a0=7f8c0c0012a0 a1=7f8c0c0013b0 a2=7f8c0c001400
  a3=8 items=2 ppid=1234 pid=5678 auid=1001 uid=0 gid=0 euid=0 suid=0
  fsuid=0 egid=0 sgid=0 fsgid=0 tty=pts0 ses=5 comm="bash"
  exe="/usr/bin/bash" key="command_execution"

# 解读：
# syscall=59 = execve 系统调用
# uid=0 = root 用户执行
# exe="/usr/bin/bash" = 执行的程序
# key="command_execution" = 匹配了我们配置的规则
```

---

## 五、日志采集架构设计

### 5.1 日志采集架构演进

```
第一阶段：直接写入
[设备] ──Syslog──→ [SIEM]

第二阶段：采集器代理
[设备] ──→ [Logstash/Fluentd] ──→ [消息队列] ──→ [SIEM]

第三阶段：流式处理（现代架构）
[设备] ──→ [Kafka] ──→ [Flink/Spark Streaming] ──→ [数据湖] ──→ [SIEM]
                                              └──→ [实时告警引擎]
```

### 5.2 采集器选型对比

| 采集器 | 特点 | 适用场景 |
|:---|:---|:---|
| **Logstash** | 插件丰富（200+），功能强大但资源消耗大 | 中大型企业，ELK 生态 |
| **Filebeat** | 轻量级，资源消耗低，ELK 官方推荐 | 终端日志采集 |
| **Fluentd/Fluent Bit** | CNCF 项目，支持多种输出 | 云原生环境 |
| **NXLog** | 支持 Windows 和 Linux，企业版功能强大 | 混合环境 |
| **Cribl Stream** | 商业产品，支持日志路由和降采样 | 大规模日志管道 |

### 5.3 Filebeat 配置实战

```yaml
# /etc/filebeat/filebeat.yml
filebeat.inputs:
  # 采集 Syslog
  - type: syslog
    protocol.udp:
      host: "0.0.0.0:514"
    fields:
      log_type: syslog
      environment: production

  # 采集 Linux 系统日志
  - type: filestream
    id: system-logs
    paths:
      - /var/log/messages
      - /var/log/secure
      - /var/log/audit/audit.log
    fields:
      log_type: system
    processors:
      - add_host_metadata: ~
      - add_cloud_metadata: ~

  # 采集 Web 服务器日志
  - type: filestream
    id: nginx-access
    paths:
      - /var/log/nginx/access.log
    parsers:
      - ndjson:
          target: "nginx"

# 输出到 Kafka（解耦采集与分析）
output.kafka:
  hosts: ["kafka1:9092", "kafka2:9092", "kafka3:9092"]
  topic: "security-logs"
  partition.round_robin:
    reachable_only: true
  required_acks: 1
  compression: gzip
  max_message_bytes: 1000000
```

### 5.4 Kafka 在日志架构中的作用

Kafka 作为日志管道的"缓冲层"，解决了以下关键问题：

- **削峰填谷**：应对突发日志洪峰（如 DDoS 攻击产生海量日志），保护下游 SIEM
- **解耦生产与消费**：日志生产者（采集器）和消费者（SIEM）独立扩展
- **多路复用**：同一份日志可被多个消费者订阅（SIEM、数据湖、合规系统）
- **消息持久化**：默认保留 7 天，SIEM 宕机不影响日志收集

```bash
# 创建安全日志 Topic（3 副本，3 分区）
kafka-topics.sh --create \
  --bootstrap-server kafka1:9092 \
  --topic security-logs \
  --partitions 12 \
  --replication-factor 3 \
  --config retention.ms=604800000 \
  --config compression.type=lz4
```

---

## 六、日志标准化与富化

### 6.1 常见日志格式标准

| 格式标准 | 全称 | 开发者 | 典型格式 |
|:---|:---|:---|:---|
| **Syslog RFC 5424** | The Syslog Protocol | IETF | 结构化键值对 |
| **CEF** | Common Event Format | ArcSight（HP） | `CEF:0\|vendor\|product\|version\|signature\|name\|severity\|extension` |
| **LEEF** | Log Event Extended Format | IBM QRadar | `LEEF:2.0\|vendor\|product\|version\|event\|attributes` |
| **JSON** | JavaScript Object Notation | — | 灵活的结构化格式 |
| **Elastic Common Schema** | ECS | Elastic | Elasticsearch 索引标准 |
| **OCSF** | Open Cybersecurity Schema Framework | AWS/Splunk 等 | 新兴的开放标准 |

**CEF 格式示例**：

```
CEF:0|Check Point|VPN-1|R80.40|Drop|Packet Dropped|5|
src=10.1.1.100 spt=54321 dst=10.2.2.200 dpt=445
proto=TCP act=Drop reason=Rule 105 enforcement=Prevent
```

**LEEF 格式示例**：

```
LEEF:2.0|IBM|QRadar|7.4.3|LOGIN_FAILED|Failed login attempt|
devTime=2024-06-15T08:30:00Z src=10.1.1.100 usrName=root
```

### 6.2 ECS (Elastic Common Schema) 字段映射

ECS 定义了统一的字段命名规范，解决不同日志源字段名不一致的问题：

| ECS 字段 | 含义 | 对应不同源的原始字段 |
|:---|:---|:---|
| `@timestamp` | 事件时间戳 | Syslog timestamp、WinEvent TimeCreated |
| `source.ip` | 源 IP 地址 | src_ip、src、source_ip、client_ip |
| `destination.ip` | 目标 IP 地址 | dst_ip、dst、destination_ip、server_ip |
| `user.name` | 用户名 | username、user、account、login |
| `event.action` | 事件动作 | action、event_type、operation |
| `event.outcome` | 事件结果 | success/failure、result、status |
| `network.transport` | 传输协议 | proto、protocol |
| `process.name` | 进程名 | ProcessName、Image、exe |
| `process.command_line` | 进程命令行 | CommandLine、cmdline |

### 6.3 日志富化（Enrichment）

日志富化是在原始日志上附加额外上下文信息的过程，使分析更加高效：

```python
# 日志富化处理示例（Python）
import ipaddress
import geoip2.database
import requests

def enrich_log(event):
    # 为日志事件添加富化信息
    # 1. IP 地理位置富化
    if 'source.ip' in event:
        reader = geoip2.database.Reader('/opt/geoip/GeoLite2-City.mmdb')
        try:
            response = reader.city(event['source.ip'])
            event['source.geo.country_name'] = response.country.name
            event['source.geo.city_name'] = response.city.name
            event['source.geo.location'] = {
                'lat': response.location.latitude,
                'lon': response.location.longitude
            }
        except:
            event['source.geo.country_name'] = 'Unknown'

    # 2. 威胁情报富化
    if 'source.ip' in event:
        ti_result = check_threat_intel(event['source.ip'])
        if ti_result:
            event['threat.indicator'] = ti_result

    # 3. 内部资产信息富化
    if 'source.ip' in event:
        asset_info = lookup_asset(event['source.ip'])
        if asset_info:
            event['source.asset.owner'] = asset_info['owner']
            event['source.asset.department'] = asset_info['department']
            event['source.asset.criticality'] = asset_info['criticality']

    # 4. 判断是否为内网 IP
    if 'source.ip' in event:
        ip = ipaddress.ip_address(event['source.ip'])
        event['source.ip.is_private'] = ip.is_private

    return event
```

---

## 七、日志存储与生命周期管理

### 7.1 日志保留策略

等保 2.0（GB/T 22239-2019）对日志存储有明确要求：

| 要求项 | 等保二级 | 等保三级 | 等保四级 |
|:---|:---|:---|:---|
| 日志存储期限 | ≥ 6 个月 | ≥ 6 个月 | ≥ 6 个月 |
| 审计记录保护 | 无法删除、修改 | 无法删除、修改、覆盖 | 专用审计设备 |
| 时钟同步 | NTP 同步 | NTP 同步 | 双源 NTP |
| 审计进程保护 | — | 非授权不能中断 | 非授权不能中断 |

> **🔑 高分考点**：等保三级要求日志保存**至少 6 个月**，且审计记录**不能被删除、修改或覆盖**。

### 7.2 冷热分层存储方案

```
热存储 (Hot) - SSD
├── 最近 7 天日志
├── 检索性能：秒级
└── 成本：高

温存储 (Warm) - HDD
├── 8-90 天日志
├── 检索性能：分钟级
└── 成本：中

冷存储 (Cold) - 对象存储 (S3/MinIO)
├── 91-365 天日志
├── 检索性能：需先恢复（分钟到小时级）
└── 成本：低

归档存储 (Archive)
├── 1 年以上（合规留存）
├── 检索性能：需工单恢复（小时到天级）
└── 成本：极低
```

### 7.3 日志完整性保护

**防止日志被篡改的技术手段**：

```bash
# 1. 日志文件属性锁定（Linux chattr）
chattr +a /var/log/secure    # 只能追加（append only）
chattr +i /var/log/audit/audit.log  # 完全不可变（immutable）

# 2. 远程日志转发（实时发送，本地不留存）
# 攻击者即使获取 root 权限删除了本地日志，远端已有记录
auth.* @@192.168.100.50:514

# 3. 日志哈希链（Hash Chain）
# 每条日志记录包含前一条的哈希，形成不可篡改的链
# 类似区块链的简易实现
```

```python
# 简易日志哈希链实现
import hashlib

class SecureLogger:
    def __init__(self):
        self.prev_hash = '0' * 64

    def log(self, message):
        content = f"{self.prev_hash}|{message}"
        current_hash = hashlib.sha256(content.encode()).hexdigest()
        entry = f"{current_hash}|{message}"
        self.prev_hash = current_hash
        return entry

# 使用示例
logger = SecureLogger()
entry1 = logger.log("User root logged in from 192.168.1.100")
entry2 = logger.log("User root executed sudo command")
# 每条记录都包含前一条的哈希，任何修改都会破坏链的完整性
```

---

## 八、日志分析实战技巧

### 8.1 高效日志搜索命令

```bash
# grep 高级用法
# 查找包含 "Failed password" 且 IP 不是 192.168.1.0/24 的记录
grep "Failed password" /var/log/secure | grep -v "192\.168\.1\."

# 统计每个 IP 的失败登录次数
grep "Failed password" /var/log/secure | grep -oP 'from \K[\d.]+' | sort | uniq -c | sort -rn | head -20

# awk 提取和统计
awk '/Failed password/ {print $(NF-3)}' /var/log/secure | sort | uniq -c | sort -rn

# 时间范围过滤
sed -n '/Jun 15 08:00/,/Jun 15 09:00/p' /var/log/secure | grep "Failed"

# 多文件并行搜索
zgrep "Failed password" /var/log/secure-*.gz | awk '{print $1,$2,$3,$(NF-3)}'
```

### 8.2 Splunk SPL 常用搜索语句

```spl
# 1. 查找暴力破解行为（1 小时内同一来源 IP 登录失败超过 10 次）
index=linux_logs sourcetype=linux_secure "Failed password"
| bucket _time span=1h
| stats count by src_ip, _time
| where count > 10
| sort - count

# 2. 检测异常时间的登录行为
index=windows_logs EventCode=4624 LogonType=10
| eval hour=strftime(_time, "%H")
| where hour < 7 OR hour > 22
| table _time, user, src_ip, hour

# 3. 查找可疑的 PowerShell 命令执行
index=windows_logs EventCode=4104
| search ScriptBlockText IN ("*DownloadString*","*DownloadFile*","*Invoke-WebRequest*","*-enc*","*FromBase64String*")
| table _time, host, user, ScriptBlockText

# 4. DNS 查询分析（检测 DGA 域名）
index=dns_logs
| eval domain_length=len(query)
| eval entropy=...  # 计算域名熵值
| where domain_length > 20 AND query NOT "*.microsoft.com" AND query NOT "*.windows.com"
| stats count by query
| sort - count
```

### 8.3 日志时间线重建

安全事件调查中，时间线重建是核心技能。以下是使用 Plaso/log2timeline 进行时间线分析：

```bash
# 安装 Plaso
pip install plaso

# 从磁盘镜像创建时间线
log2timeline.py --storage-file timeline.plaso /mnt/evidence/disk_image.dd

# 过滤特定时间范围的事件
psort.py -o l2tcsv -w timeline.csv timeline.plaso \
  "date > '2024-06-15 00:00:00' AND date < '2024-06-15 23:59:59'"

# 使用 Timesketch 进行可视化时间线分析
# Timesketch 是 Google 开源的协作式取证时间线分析工具
tsctl import --timeline_name "Case-2024-001" timeline.csv
```

---

## 九、日志安全合规要求

### 9.1 等保 2.0 日志相关控制点

| 控制点 | 要求 | 检查要点 |
|:---|:---|:---|
| 安全审计范围 | 覆盖所有用户、应用、系统 | 检查审计策略是否启用 |
| 审计记录内容 | 包含事件类型、时间、主体、客体、结果 | 检查日志字段完整性 |
| 审计记录保护 | 防止未授权删除、修改 | 检查日志访问控制 |
| 审计记录存储 | 至少 6 个月 | 检查日志归档策略 |
| 时钟同步 | 所有设备 NTP 同步 | 检查 NTP 配置 |
| 审计进程保护 | 审计进程不能中断 | 检查审计进程守护 |

### 9.2 GDPR 对日志的要求

GDPR 虽不直接规定日志技术标准，但通过以下条款间接影响日志管理：

- **第 30 条**：数据处理记录要求——需记录处理活动日志
- **第 33 条**：数据泄露通知——日志是发现和证明泄露的关键
- **第 5 条**：数据最小化原则——日志中的个人信息需脱敏
- **第 32 条**：安全处理——日志系统本身需安全

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | Syslog 协议严重级别 | ★★★★★ | 低 | 0-7 共 8 级，0 最严重，7 Debug |
| 2 | Syslog Facility 作用 | ★★★★☆ | 中 | 标识日志来源类型，0-23 共 24 种 |
| 3 | PRI 值计算公式 | ★★★★☆ | 中 | PRI = Facility × 8 + Severity |
| 4 | Windows 登录类型 3 vs 10 | ★★★★★ | 中 | 3=网络登录(SMB)，10=远程交互式(RDP) |
| 5 | 等保日志保存期限 | ★★★★★ | 低 | ≥ 6 个月 |
| 6 | Event ID 4624 vs 4625 | ★★★★★ | 低 | 4624 登录成功，4625 登录失败 |
| 7 | Syslog UDP vs TCP | ★★★☆☆ | 低 | UDP 514 默认，TCP 514 可靠 |
| 8 | 日志采集器对比 | ★★★☆☆ | 中 | Logstash 功能强，Filebeat 轻量 |

### 💡 知识巧记口诀

> **"EMERG 到 DEBUG，零到七分八级"** — Syslog 严重级别：Emergency(0)、Alert(1)、Critical(2)、Error(3)、Warning(4)、Notice(5)、Info(6)、Debug(7)
>
> **"四六二四成了，四六二五败了"** — Windows 事件 ID 4624 是登录成功，4625 是登录失败
>
> **"一个@走 UDP，两个@@走 TCP"** — Rsyslog 配置中，单 @ 是 UDP，双 @@ 是 TCP
>
> **"六六个月，铁打不动"** — 等保 2.0 要求日志至少保存 6 个月
>
> **"F八加S等于PRI"** — PRI = Facility × 8 + Severity

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "Syslog 是安全的日志传输协议" | ❌ 错误！标准 Syslog 无加密、无认证，需配合 TLS（Syslog over TLS，RFC 5425）使用 |
| "Windows 只要开启审计策略就能记录所有事件" | ❌ 错误！还需配置 SACL（系统访问控制列表）才能记录文件/注册表的细粒度访问 |
| "日志保留越久越好" | ❌ 错误！需平衡合规要求、存储成本和隐私保护，过长的保留期可能违反数据最小化原则 |
| "所有日志都该发送到 SIEM" | ❌ 错误！应过滤掉无安全价值的日志（如 Debug 级别），避免 SIEM 过载 |
| "NTP 同步偏差几分钟无所谓" | ❌ 错误！事件关联需要精确到秒级的时间同步，1 分钟偏差即可导致攻击链断裂 |

---

## 学习建议

1. 🖥️ **动手搭建 Rsyslog 服务器**：在一台 Ubuntu 虚拟机上配置 Rsyslog 接收远程日志，另一台发送日志，观察日志流转全过程
2. 📊 **配置 Winlogbeat + ELK**：将 Windows 安全日志采集到 Elasticsearch，在 Kibana 中创建暴力破解检测仪表板
3. 🔍 **分析真实的 auth.log**：从一台公网服务器导出 `/var/log/auth.log`，用 grep/awk 分析有多少次失败的 SSH 登录尝试
4. 📋 **编写日志标准化规则**：使用 Logstash 的 grok 插件，将不同设备的日志解析为统一的 JSON 格式
5. 📖 **阅读 Syslog RFC 5424**：理解 Syslog 协议标准，尤其是结构化数据（Structured Data）部分
6. ⏰ **检查公司环境的 NTP 同步**：确保所有安全设备都配置了 NTP，偏差在 1 秒以内

---

> **日志是安全事件的"黑匣子"。每一行看似平淡的日志记录，都可能是发现下一个安全事件的关键线索。养成每日看日志的习惯，是成为优秀安全分析师的第一步。**
""")

print("Day 2 done")

# ============================================================
# Day 3: SIEM系统部署
# ============================================================
gen('day-3.md', r"""# Day 3：SIEM系统部署

> **📘 文档定位**：CISP 考试核心基础 | 难度：中高级 | 预计阅读：55 分钟
>
> SIEM（安全信息与事件管理）是 SOC 的技术核心，也是 CISP 考试安全管理方向的高频考点。本章从 SIEM 架构原理、主流产品对比、部署规划、规则开发到性能优化，完整覆盖 SIEM 系统从 0 到 1 的建设全过程。

---

## 导航目录

- [一、SIEM 核心概念与价值定位](#一siem-核心概念与价值定位)
- [二、SIEM 技术架构深度剖析](#二siem-技术架构深度剖析)
- [三、主流 SIEM 产品对比](#三主流-siem-产品对比)
- [四、SIEM 部署规划与架构设计](#四siem-部署规划与架构设计)
- [五、ELK Stack 实战部署](#五elk-stack-实战部署)
- [六、关联规则开发方法论](#六关联规则开发方法论)
- [七、SIEM 数据建模与范式](#七siem-数据建模与范式)
- [八、SIEM 性能优化与扩展](#八siem-性能优化与扩展)
- [九、SIEM 运维管理最佳实践](#九siem-运维管理最佳实践)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、SIEM 核心概念与价值定位

### 1.1 SIEM 的定义与演进

SIEM（Security Information and Event Management，安全信息与事件管理）是由 Gartner 在 2005 年提出的概念，实际上是两个功能的融合：

| 组件 | 英文 | 核心功能 | 解决的问题 |
|:---|:---|:---|:---|
| **SIM** | Security Information Management | 日志管理、合规报告、长期存储 | "日志太多，找不到需要的" |
| **SEM** | Security Event Management | 实时监控、关联分析、告警通知 | "攻击正在发生，我们不知道" |

> **🔑 高分考点**：SIEM = SIM + SEM。SIM 侧重于**历史分析和合规**，SEM 侧重于**实时检测和响应**。现代 SIEM 已融合两者。

**SIEM 的演进阶段**：

| 阶段 | 时间 | 核心特征 | 代表产品 |
|:---|:---|:---|:---|
| 1.0 日志管理 | 2000-2008 | 集中存储、关键字搜索 | ArcSight Logger |
| 2.0 关联分析 | 2008-2015 | 实时规则引擎、仪表板 | QRadar、ArcSight ESM |
| 3.0 智能分析 | 2015-2020 | UEBA、机器学习、ATT&CK 映射 | Splunk ES、Exabeam |
| 4.0 云原生 | 2020-至今 | SaaS 化、无服务器、XDR 集成 | Microsoft Sentinel、Google Chronicle |

### 1.2 SIEM 的五大核心能力

```
                   ┌──────────────────────────────────┐
                   │          SIEM 五大能力            │
                   └──────────────────────────────────┘
                                    │
        ┌───────────────┬───────────┼───────────┬───────────────┐
        │               │           │           │               │
   ┌────▼────┐    ┌────▼────┐  ┌───▼────┐  ┌──▼──────┐   ┌────▼────┐
   │日志采集  │    │数据解析  │  │关联分析 │  │告警管理  │   │可视化   │
   │Collection│   │Parsing  │  │Correlation│ │Alerting │   │Dashboard│
   └─────────┘    └─────────┘  └────────┘  └─────────┘   └─────────┘
```

1. **日志采集与聚合**：从网络设备、服务器、安全设备、应用系统收集日志
2. **数据解析与标准化**：将异构日志解析为统一数据模型
3. **关联分析**：跨数据源进行时序关联和规则匹配
4. **告警管理**：生成、分级、通知、跟踪告警
5. **可视化与报告**：仪表板、合规报告、态势感知大屏

---

## 二、SIEM 技术架构深度剖析

### 2.1 经典 SIEM 架构分层

```
┌─────────────────────────────────────────────────────────────────┐
│                      展示层 (Presentation)                       │
│    Web UI │ Dashboard │ Report Generator │ Alert Console         │
├─────────────────────────────────────────────────────────────────┤
│                      分析层 (Analytics)                          │
│    Correlation Engine │ Rule Engine │ ML/AI Engine │ Search     │
├─────────────────────────────────────────────────────────────────┤
│                      处理层 (Processing)                         │
│    Log Parser │ Normalizer │ Enricher │ Stream Processor        │
├─────────────────────────────────────────────────────────────────┤
│                      存储层 (Storage)                            │
│    Hot Storage (SSD) │ Warm (HDD) │ Cold (Object Store) │ Index │
├─────────────────────────────────────────────────────────────────┤
│                      采集层 (Collection)                         │
│    Syslog Server │ Agent Manager │ API Collector │ Kafka Bus    │
├─────────────────────────────────────────────────────────────────┤
│                      数据源层 (Data Sources)                     │
│    Firewall │ IDS/IPS │ EDR │ WAF │ AD │ Cloud │ App │ DB      │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 关联引擎工作原理

关联引擎是 SIEM 的心脏，它将来自不同数据源的离散事件串联成有意义的攻击链。

**关联分析的三种模式**：

| 关联类型 | 工作原理 | 示例 |
|:---|:---|:---|
| **基于规则的关联** | 预定义规则 + 条件匹配 | "5 分钟内同一源 IP 登录失败 ≥ 10 次" → 暴力破解告警 |
| **基于统计的关联** | 统计基线 + 偏离检测 | "凌晨 3 点某服务器的出站流量是历史均值的 10 倍" → 数据外泄告警 |
| **基于状态的关联** | 状态机 + 攻击链模型 | "端口扫描 → 漏洞利用 → 下载恶意文件 → C2 通信" → 入侵确认告警 |

**规则引擎执行流程**：

```python
# 关联规则伪代码示例
def correlation_rule_brute_force(event_stream):
    window = []
    for event in event_stream:
        if event['type'] == 'LOGIN_FAILURE':
            window.append(event)
            # 滑动窗口：只保留最近 5 分钟的事件
            window = [e for e in window
                      if (event['timestamp'] - e['timestamp']).seconds < 300]
            # 统计同一来源 IP 的失败次数
            src_ip = event['source_ip']
            count = sum(1 for e in window if e['source_ip'] == src_ip)
            if count >= 10:
                generate_alert(
                    severity='HIGH',
                    title=f'Brute Force Attack from {src_ip}',
                    details=f'{count} failed logins in 5 minutes',
                    source_events=window
                )
                window = []  # 重置窗口，避免重复告警
```

### 2.3 SIEM 数据流处理

```bash
# 完整的 SIEM 数据流处理链（使用 Kafka + Logstash + Elasticsearch）

# 步骤 1：日志进入 Kafka
# 步骤 2：Logstash 消费 Kafka 消息并进行处理
```

```ruby
# logstash-pipeline.conf
input {
  kafka {
    bootstrap_servers => "kafka1:9092,kafka2:9092"
    topics => ["security-logs"]
    group_id => "siem-processors"
    consumer_threads => 4
    codec => json
  }
}

filter {
  # 根据日志类型路由到不同的处理管道
  if [log_type] == "syslog" {
    grok {
      match => { "message" => "%{SYSLOG5424PRI}%{SYSLOG5424LINE}" }
    }
    date {
      match => ["syslog5424_ts", "ISO8601"]
      target => "@timestamp"
    }
  } else if [log_type] == "windows_event" {
    # 解析 Windows Event Log 的 XML 格式
    xml {
      source => "event_xml"
      target => "win_event"
    }
  } else if [log_type] == "cef" {
    # 解析 ArcSight CEF 格式
    cef { }
  }

  # 统一字段映射到 ECS
  mutate {
    rename => {
      "src_ip" => "[source][ip]"
      "dst_ip" => "[destination][ip]"
      "src_port" => "[source][port]"
      "dst_port" => "[destination][port]"
    }
  }

  # IP 地理位置富化
  geoip {
    source => "[source][ip]"
    target => "[source][geo]"
    database => "/usr/share/GeoIP/GeoLite2-City.mmdb"
  }

  # 移除不需要的字段
  mutate {
    remove_field => ["message", "event_xml", "@version"]
  }
}

output {
  elasticsearch {
    hosts => ["es-node1:9200", "es-node2:9200", "es-node3:9200"]
    index => "siem-events-%{+YYYY.MM.dd}"
    user => "logstash_writer"
    password => "${ES_PASSWORD}"
    ssl => true
    ssl_certificate_verification => false
  }

  # 高优先级事件同时发送到告警 Topic
  if [event][severity] >= 7 {
    kafka {
      bootstrap_servers => "kafka1:9092"
      topic_id => "high-priority-alerts"
      codec => json
    }
  }
}
```

---

## 三、主流 SIEM 产品对比

### 3.1 商业 SIEM 产品矩阵

| 产品 | 厂商 | 部署模式 | 许可模式 | 优势 | 劣势 |
|:---|:---|:---|:---|:---|:---|
| **Splunk ES** | Splunk | 本地/云 | 按数据量（GB/天） | 搜索能力强，生态丰富 | 成本极高，需专业调优 |
| **QRadar** | IBM | 本地/云 | 按 EPS（每秒事件数） | 关联引擎成熟，金融行业标准 | 界面老旧，学习曲线陡 |
| **Sentinel** | Microsoft | SaaS 云原生 | 按数据量 | Azure 集成深，AI 能力强 | 多云环境支持较弱 |
| **Chronicle** | Google | SaaS 云原生 | 按员工数 | 无限存储，速度极快 | 中国市场访问受限 |
| **ArcSight** | Micro Focus | 本地 | 按 EPS | 政府军工广泛使用 | 架构老旧，维护成本高 |
| **LogRhythm** | LogRhythm | 本地/云 | 按节点 | 一体化（SIEM+UEBA+SOAR） | 市场份额小 |

### 3.2 开源 SIEM 方案

| 方案 | 组件 | 适用规模 | 优点 | 缺点 |
|:---|:---|:---|:---|:---|
| **ELK Stack** | Elasticsearch + Logstash + Kibana | 中型 | 社区活跃，文档丰富 | 安全功能需自行开发 |
| **Wazuh** | Wazuh Manager + Elasticsearch | 中小型 | 内置 HIDS 能力，合规检查 | 关联分析能力有限 |
| **Security Onion** | 集成多种工具 | 中型 | 一站式（NSM + SIEM + HIDS） | 部署复杂 |
| **Apache Metron** | Hadoop 生态 | 大型 | 大数据架构，流式处理 | 维护成本极高 |

### 3.3 SIEM 选型评估维度

```
SIEM 选型评估矩阵

维度              权重    评估要点
─────────────────────────────────────────
功能完整性        25%    日志采集、关联分析、可视化、报告
可扩展性          15%    集群扩展、日处理量上限、存储扩展
集成能力          15%    支持的数据源类型、API 开放性
性能              15%    查询延迟、EPS 处理能力、告警实时性
易用性            10%    学习曲线、UI 友好度、文档质量
成本              15%    许可费用、硬件成本、运维人力
合规支持           5%    等保、GDPR、SOX 报告模板
```

> **🔑 高分考点**：SIEM 选型的首要考量不是功能多强大，而是**与组织现有技术栈的匹配度**和**团队运维能力**。采购最贵的 SIEM 不等于安全能力提升。

---

## 四、SIEM 部署规划与架构设计

### 4.1 部署规模规划

| 规模 | 日处理量 | 推荐架构 | 硬件需求 |
|:---|:---|:---|:---|
| **小型** | < 50GB/天 | 单节点或 3 节点集群 | 3× 32C/128G/4TB SSD |
| **中型** | 50-500GB/天 | 5-10 节点集群 | 10× 32C/256G/8TB SSD |
| **大型** | 500GB-5TB/天 | 分布式集群 + Kafka | 30+ 节点，分层存储 |
| **超大型** | > 5TB/天 | 多数据中心 + 数据湖 | 定制化架构 |

### 4.2 高可用架构设计

```
                  ┌─────────────────────────────────┐
                  │          负载均衡器 (HAProxy)      │
                  │        192.168.1.10:9200          │
                  └──────────────┬──────────────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            │                    │                    │
    ┌───────▼───────┐   ┌───────▼───────┐   ┌───────▼───────┐
    │  ES Node 1    │   │  ES Node 2    │   │  ES Node 3    │
    │  Master+Data  │   │  Master+Data  │   │  Master+Data  │
    │  32C/256G     │   │  32C/256G     │   │  32C/256G     │
    └───────────────┘   └───────────────┘   └───────────────┘
            │                    │                    │
            └────────────────────┼────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     Kafka Cluster        │
                    │    3 Nodes (Broker)      │
                    │    16C/64G/2TB SSD      │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    Logstash Cluster      │
                    │    2 Nodes (Processing)  │
                    │    16C/32G               │
                    └──────────────────────────┘
```

**Elasticsearch 集群配置**：

```yaml
# elasticsearch.yml
cluster.name: siem-production
node.name: es-node-1
node.roles: [master, data, ingest]

# 网络配置
network.host: 0.0.0.0
http.port: 9200
transport.port: 9300
discovery.seed_hosts: ["es-node-1", "es-node-2", "es-node-3"]
cluster.initial_master_nodes: ["es-node-1", "es-node-2", "es-node-3"]

# 性能配置
indices.memory.index_buffer_size: 30%
thread_pool.write.queue_size: 10000

# 安全配置
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: elastic-certificates.p12
xpack.security.transport.ssl.truststore.path: elastic-certificates.p12

# 路径配置
path.data: /data1/elasticsearch,/data2/elasticsearch
path.logs: /var/log/elasticsearch
```

---

## 五、ELK Stack 实战部署

### 5.1 Docker Compose 快速部署

```yaml
# docker-compose.yml - ELK Stack 安全版
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.0
    container_name: es-node1
    environment:
      - node.name=es-node1
      - cluster.name=siem-docker
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms4g -Xmx4g"
      - ELASTIC_PASSWORD=${ES_PASSWORD}
      - xpack.security.enabled=true
      - xpack.security.enrollment.enabled=true
    volumes:
      - es-data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
      - "9300:9300"
    networks:
      - siem-net
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536
        hard: 65536

  logstash:
    image: docker.elastic.co/logstash/logstash:8.12.0
    container_name: logstash
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
      - ./logstash/config/logstash.yml:/usr/share/logstash/config/logstash.yml
    ports:
      - "514:514/udp"
      - "514:514/tcp"
      - "5044:5044"
    environment:
      - LS_JAVA_OPTS=-Xms2g -Xmx2g
    networks:
      - siem-net
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.12.0
    container_name: kibana
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
      - ELASTICSEARCH_USERNAME=kibana_system
      - ELASTICSEARCH_PASSWORD=${KIBANA_PASSWORD}
    networks:
      - siem-net
    depends_on:
      - elasticsearch

  # 可选：添加 Kafka 作为缓冲层
  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    container_name: zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    networks:
      - siem-net

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    container_name: kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    networks:
      - siem-net
    depends_on:
      - zookeeper

volumes:
  es-data:

networks:
  siem-net:
    driver: bridge
```

### 5.2 Elasticsearch 索引模板

```json
// 为安全事件创建优化的索引模板
PUT _index_template/siem-events-template
{
  "index_patterns": ["siem-events-*"],
  "template": {
    "settings": {
      "number_of_shards": 3,
      "number_of_replicas": 1,
      "refresh_interval": "30s",
      "codec": "best_compression",
      "routing.allocation.include._tier_preference": "data_hot",
      "index.lifecycle.name": "siem-hot-warm-cold-policy"
    },
    "mappings": {
      "dynamic": "strict",
      "properties": {
        "@timestamp": { "type": "date" },
        "event": {
          "properties": {
            "action": { "type": "keyword" },
            "category": { "type": "keyword" },
            "type": { "type": "keyword" },
            "outcome": { "type": "keyword" },
            "severity": { "type": "long" },
            "risk_score": { "type": "float" },
            "duration": { "type": "long" },
            "original": { "type": "text", "index": false }
          }
        },
        "source": {
          "properties": {
            "ip": { "type": "ip" },
            "port": { "type": "long" },
            "geo": {
              "properties": {
                "country_name": { "type": "keyword" },
                "city_name": { "type": "keyword" },
                "location": { "type": "geo_point" }
              }
            }
          }
        },
        "destination": {
          "properties": {
            "ip": { "type": "ip" },
            "port": { "type": "long" }
          }
        },
        "user": {
          "properties": {
            "name": { "type": "keyword" },
            "domain": { "type": "keyword" }
          }
        },
        "network": {
          "properties": {
            "transport": { "type": "keyword" },
            "protocol": { "type": "keyword" },
            "bytes": { "type": "long" }
          }
        },
        "rule": {
          "properties": {
            "name": { "type": "keyword" },
            "uuid": { "type": "keyword" },
            "category": { "type": "keyword" }
          }
        },
        "threat": {
          "properties": {
            "framework": { "type": "keyword" },
            "tactic": {
              "properties": {
                "id": { "type": "keyword" },
                "name": { "type": "keyword" }
              }
            },
            "technique": {
              "properties": {
                "id": { "type": "keyword" },
                "name": { "type": "keyword" }
              }
            }
          }
        }
      }
    }
  }
}
```

---

## 六、关联规则开发方法论

### 6.1 规则开发生命周期

```
威胁情报/攻击研究
        │
        ▼
  规则需求定义 ──── 编写 Sigma 规则
        │               │
        ▼               ▼
  规则测试验证 ←── 转换为 SIEM 查询
        │
        ▼
  部署到生产环境
        │
        ▼
  持续监控效果 ──── 误报反馈调优
        │
        ▼
  规则维护/退役
```

### 6.2 高频检测规则示例

**规则 1：检测暴力破解**

```yaml
title: SSH Brute Force Attack
id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
status: production
description: Detects SSH brute force attacks (10+ failed logins in 5 minutes)
author: SOC Team
date: 2024/06/15
tags:
  - attack.credential_access
  - attack.t1110.001
logsource:
  product: linux
  service: auth
detection:
  selection:
    message|contains:
      - 'Failed password'
      - 'authentication failure'
  timeframe: 5m
  condition: selection | count() by source_ip > 10
level: high
```

**规则 2：检测可疑 PowerShell 执行**

```yaml
title: Suspicious PowerShell Encoded Command
id: b2c3d4e5-f6a7-8901-bcde-f12345678901
status: production
description: Detects Base64 encoded PowerShell commands (common in attacks)
author: SOC Team
date: 2024/06/15
references:
  - https://attack.mitre.org/techniques/T1059/001/
  - https://attack.mitre.org/techniques/T1027/
tags:
  - attack.execution
  - attack.t1059.001
  - attack.defense_evasion
  - attack.t1027
logsource:
  product: windows
  service: powershell
  definition: 'Script Block Logging must be enabled (Event ID 4104)'
detection:
  selection_enc:
    ScriptBlockText|contains:
      - '-enc'
      - '-EncodedCommand'
      - '-e '
      - 'FromBase64String'
  selection_dl:
    ScriptBlockText|contains:
      - 'DownloadString'
      - 'DownloadFile'
      - 'Invoke-WebRequest'
      - 'Net.WebClient'
      - 'IEX'
      - 'Invoke-Expression'
  timeframe: 1h
  condition: selection_enc or selection_dl
falsepositives:
  - Legitimate admin scripts using encoded commands (should be rare)
level: high
```

**规则 3：检测 C2 通信（信标行为）**

```yaml
title: Potential C2 Beaconing Activity
id: c3d4e5f6-a7b8-9012-cdef-123456789012
status: production
description: Detects periodic network connections that may indicate C2 beaconing
author: SOC Team
date: 2024/06/15
references:
  - https://attack.mitre.org/techniques/T1071/001/
tags:
  - attack.command_and_control
  - attack.t1071.001
logsource:
  category: network_connection
detection:
  selection:
    destination.port:
      - 80
      - 443
      - 8080
      - 8443
  filter_main:
    destination.ip|range:
      - '10.0.0.0/8'
      - '172.16.0.0/12'
      - '192.168.0.0/16'
    # 排除知名 CDN 和云服务商 IP 段
  timeframe: 1h
  condition: >
    selection and not filter_main
    | bin(_time, 1m)
    | stats count by _time, source.ip, destination.ip
    | where count > 0
    | eventstats stdev(count) as jitter
    | where jitter < 2
level: medium
```

### 6.3 规则调优策略

| 策略 | 方法 | 效果 |
|:---|:---|:---|
| **白名单** | 排除已知的正常行为（如管理 IP 段、自动化工具） | 降低误报 |
| **阈值调整** | 根据环境调整触发阈值（如暴力破解次数阈值） | 平衡检出率和误报 |
| **上下文增强** | 结合资产重要性、用户角色等上下文 | 减少低价值告警 |
| **时间窗口** | 调整时间窗口大小（太短漏报，太长告警延迟） | 优化时效性 |
| **告警抑制** | 相同告警在冷却期内不再重复发送 | 减少告警风暴 |

---

## 七、SIEM 数据建模与范式

### 7.1 通用信息模型（CIM）

CIM（Common Information Model）是 Splunk 提出的数据标准化模型，已被业界广泛采纳：

| CIM 数据模型 | 包含的数据类型 | 关键字段 |
|:---|:---|:---|
| **Authentication** | 登录成功/失败、权限提升 | user, src_ip, action, app, result |
| **Network Traffic** | 网络流数据 | src_ip, dest_ip, transport, bytes_in, bytes_out |
| **Endpoint** | 进程、文件、注册表 | process_name, file_path, registry_key |
| **Malware** | 恶意软件检测事件 | signature, file_hash, infected_host |
| **Intrusion Detection** | IDS/IPS 告警 | signature, severity, src_ip, dest_ip |
| **Change Analysis** | 配置变更、账户变更 | change_type, object, before, after |
| **Email** | 邮件流量和威胁 | sender, recipient, subject, attachment |

### 7.2 数据模型设计原则

1. **统一时间戳格式**：所有事件统一使用 ISO 8601 格式（`2024-06-15T08:30:00.000Z`）
2. **IP 地址标准化**：使用专用 IP 数据类型，支持 CIDR 查询
3. **枚举值标准化**：`success/failure` 而非 `1/0`、`yes/no`、`true/false`
4. **嵌套结构**：将相关字段分组为对象（如 `source.ip`、`source.port`）
5. **避免字段爆炸**：每个索引的字段数控制在 1000 以内

---

## 八、SIEM 性能优化与扩展

### 8.1 Elasticsearch 性能调优

```yaml
# elasticsearch.yml 关键性能参数
# JVM 堆内存：不超过物理内存的 50%，且不超过 32GB（压缩指针限制）
# -Xms16g -Xmx16g

# 索引性能优化
indices.memory.index_buffer_size: 20%  # 索引缓冲区
index.translog.durability: async        # 异步写入 translog
index.translog.sync_interval: 30s       # 同步间隔

# 搜索性能优化
indices.queries.cache.size: 15%         # 查询缓存
indices.fielddata.cache.size: 15%       # 字段数据缓存

# 线程池优化
thread_pool.write.size: 8               # 写入线程数 = CPU 核心数
thread_pool.write.queue_size: 10000     # 写入队列
thread_pool.search.size: 16             # 搜索线程数
thread_pool.search.queue_size: 2000     # 搜索队列

# 合并策略
indices.store.throttle.max_bytes_per_sec: 100mb  # 合并限速
```

### 8.2 日志降采样策略

当数据量超过 SIEM 处理能力时，可采用降采样（Downsampling）：

```yaml
# 降采样策略示例
策略 A：丢弃 Debug 和 Info 级别日志
  - 保留：EMERG, ALERT, CRIT, ERROR, WARNING, NOTICE
  - 丢弃：INFO, DEBUG
  - 效果：减少 60-80% 数据量

策略 B：对网络流日志进行聚合
  - 原始：每条连接一个事件
  - 聚合后：5 分钟窗口内，相同五元组的连接聚合为一条（保留连接数和总字节数）
  - 效果：减少 80-90% 数据量

策略 C：基于时间的老化降采样
  - 7 天内：全量数据
  - 8-30 天：保留 1/10（随机采样）
  - 31-90 天：保留 1/100
  - 91 天以上：仅保留告警和关键事件
```

### 8.3 扩展策略

| 扩展方式 | 方法 | 适用场景 |
|:---|:---|:---|
| **垂直扩展** | 增加节点 CPU/内存/磁盘 | 小规模增长 |
| **水平扩展** | 增加 Elasticsearch 数据节点 | 数据量持续增长 |
| **读写分离** | 专用 Ingest 节点、Coordinator 节点、Data 节点 | 大规模部署 |
| **多集群联邦** | 跨集群搜索（CCS）| 多数据中心 |
| **冷热分离** | Hot/Warm/Cold 节点分层 | 成本优化 |

---

## 九、SIEM 运维管理最佳实践

### 9.1 日常运维检查清单

```bash
# 每日检查项
# 1. 集群健康状态
curl -s 'localhost:9200/_cluster/health?pretty'

# 2. 节点磁盘使用率
curl -s 'localhost:9200/_cat/allocation?v'

# 3. 索引速率（EPS）
curl -s 'localhost:9200/_cat/indices?v&s=index&h=index,docs.count,store.size'

# 4. 待处理任务数
curl -s 'localhost:9200/_cat/pending_tasks?v'

# 5. 慢查询日志
curl -s 'localhost:9200/_cat/tasks?v&detailed'

# 6. 集群磁盘水位线
# 超过 85% 触发低水位线（不再分配分片）
# 超过 90% 触发高水位线（迁移分片）
# 超过 95% 触发只读锁
```

### 9.2 备份与灾难恢复

```bash
# 创建快照仓库
PUT _snapshot/siem_backup_repo
{
  "type": "fs",
  "settings": {
    "location": "/mnt/backup/elasticsearch",
    "compress": true
  }
}

# 创建全量快照
PUT _snapshot/siem_backup_repo/snapshot_20240615?wait_for_completion=true
{
  "indices": "siem-events-*",
  "ignore_unavailable": true,
  "include_global_state": false
}

# 创建 SLM（快照生命周期管理）策略
PUT _slm/policy/daily-siem-backup
{
  "schedule": "0 30 2 * * ?",        # 每天凌晨 2:30
  "name": "<siem-snapshot-{now/d}>",
  "repository": "siem_backup_repo",
  "config": {
    "indices": ["siem-events-*", "siem-alerts-*"],
    "ignore_unavailable": false,
    "include_global_state": false
  },
  "retention": {
    "expire_after": "30d",
    "min_count": 5,
    "max_count": 50
  }
}
```

### 9.3 容量规划

```
SIEM 容量规划公式：

日数据量 (GB/天) = 设备数量 × 单设备日产量 (MB)
                  + 网络流日志量 (GB/天)
                  + 应用日志量 (GB/天)

存储需求 (TB) = 日数据量 (GB) × 保留天数 / 1000 × 1.2 (压缩比)

计算资源 (CPU 核心) = 日数据量 (GB) / 50 (粗略估算)

内存 (GB) = 日数据量 (GB) × 2 (粗略估算)

示例：
- 100 台服务器 × 100MB/天 = 10GB
- 50 台网络设备 × 50MB/天 = 2.5GB
- 20 个应用 × 200MB/天 = 4GB
- 总日产量 = 16.5GB
- 90 天存储 = 16.5 × 90 / 1000 × 1.2 ≈ 1.78TB
- 推荐 CPU = 16.5 / 50 ≈ 0.33 → 至少 8 核
- 推荐内存 = 16.5 × 2 ≈ 33GB → 至少 64GB
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | SIEM 全称与组成 | ★★★★★ | 低 | Security Information and Event Management = SIM + SEM |
| 2 | SIM vs SEM 区别 | ★★★★☆ | 中 | SIM 历史分析/合规，SEM 实时检测/响应 |
| 3 | SIEM 五大能力 | ★★★★☆ | 中 | 采集、解析、关联、告警、可视化 |
| 4 | 关联分析三种模式 | ★★★☆☆ | 高 | 基于规则、基于统计、基于状态 |
| 5 | Sigma 规则的作用 | ★★★★☆ | 中 | 通用检测规则格式，一次编写到处运行 |
| 6 | ELK 组件全称 | ★★★★★ | 低 | Elasticsearch + Logstash + Kibana |
| 7 | SIEM 数据存储分层 | ★★★☆☆ | 中 | Hot(SSD) → Warm(HDD) → Cold(对象存储) |
| 8 | 等保日志保留期限 | ★★★★★ | 低 | ≥ 6 个月 |

### 💡 知识巧记口诀

> **"SIM 存历史，SEM 抓实时"** — SIM 侧重历史分析和合规报告，SEM 侧重实时检测和告警
>
> **"ELK 三兄弟，存搜看"** — Elasticsearch 存数据，Logstash 处理数据，Kibana 看数据
>
> **"Hot-Warm-Cold，越久越冷"** — SIEM 存储分层，7 天内热存储，8-90 天温存储，91+ 天冷存储
>
> **"规则、统计、状态机，三种关联各不同"** — 基于规则的匹配、基于统计的偏离、基于状态机的攻击链
>
> **"Sigma 写一次，到处都能跑"** — Sigma 规则可转换为 Splunk SPL、ES DSL、QRadar AQL 等

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "SIEM 就是 Splunk" | ❌ 错误！Splunk 只是 SIEM 产品之一，SIEM 是一类系统的总称 |
| "开源 ELK 可以完全替代商业 SIEM" | ❌ 错误！ELK 提供了基础平台，但关联规则、UEBA、SOAR 等高级功能需要大量二次开发 |
| "SIEM 采集的日志越多越好" | ❌ 错误！海量低价值日志会淹没真正重要的安全事件，需要平衡覆盖面和信噪比 |
| "部署 SIEM 就等于建成了 SOC" | ❌ 错误！SIEM 是技术平台，SOC 还需要人员、流程、管理体系的配合 |
| "Sigma 规则可以直接在 SIEM 中运行" | ❌ 错误！Sigma 规则需要通过 sigmac 编译器转换为目标 SIEM 的查询语言才能执行 |

---

## 学习建议

1. 🏗️ **动手部署 ELK Stack**：在一台 16G 内存的机器上用 Docker Compose 部署 ELK + Kafka，理解各组件的协作关系
2. 📝 **编写 10 条 Sigma 规则**：覆盖暴力破解、Web 攻击、恶意软件、横向移动、数据外泄等场景
3. 🔄 **实践规则转换**：使用 sigmac 工具将 Sigma 规则转换为 Splunk SPL 和 Elasticsearch Query DSL
4. 📊 **构建安全仪表板**：在 Kibana 中创建 SOC 监控大屏——告警趋势图、攻击来源地图、Top 告警类型
5. 🎯 **模拟攻击测试**：在自己的实验环境中模拟攻击（如 Hydra 暴力破解、Nmap 扫描），验证 SIEM 规则是否能检测到
6. 📖 **阅读 Elastic 官方文档**：重点阅读 ECS（Elastic Common Schema）和 Elastic Security 部分

---

> **SIEM 不是买来就能用的"安全神器"，而是需要持续投入规则开发、告警调优、数据分析的"安全工作台"。一个精心调优的 SIEM，能让分析师从数千条告警中一眼看到真正的威胁。**
""")

print("Day 3 done")

# ============================================================
# Day 4: 入侵检测与防御
# ============================================================
gen('day-4.md', r"""# Day 4：入侵检测与防御

> **📘 文档定位**：CISP 考试核心基础 | 难度：中高级 | 预计阅读：50 分钟
>
> 入侵检测系统（IDS）和入侵防御系统（IPS）是网络安全防御体系中的"哨兵"与"守卫"。IDS 负责发现威胁并发出警报，IPS 在检测到威胁时主动阻断。理解两者的工作原理、部署模式和检测技术，是 CISP 考试中网络安全方向的高频考点。

---

## 导航目录

- [一、IDS/IPS 基础概念与区别](#一idsips-基础概念与区别)
- [二、入侵检测技术分类](#二入侵检测技术分类)
- [三、Snort/Suricata 规则体系](#三snortsuricata-规则体系)
- [四、IDS/IPS 部署架构设计](#四idsips-部署架构设计)
- [五、网络流量采集技术](#五网络流量采集技术)
- [六、Snort 实战部署与配置](#六snort-实战部署与配置)
- [七、Suricata 高级特性](#七suricata-高级特性)
- [八、告警分析与误报处理](#八告警分析与误报处理)
- [九、IDS/IPS 绕过技术及防御](#九idsips-绕过技术及防御)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、IDS/IPS 基础概念与区别

### 1.1 核心定义

**入侵检测系统（IDS, Intrusion Detection System）**：被动监控网络流量或主机活动，当检测到可疑行为时发出告警。IDS 是"旁路"部署，不参与实际数据流转发。

**入侵防御系统（IPS, Intrusion Prevention System）**：主动检测并阻断恶意流量。IPS 是"串联"部署，所有流量必须经过 IPS，它可以在攻击到达目标之前进行拦截。

| 对比维度 | IDS | IPS |
|:---|:---|:---|
| **部署模式** | 旁路（Out-of-band） | 串联（In-line） |
| **工作方式** | 被动监听、复制流量 | 主动转发、过滤流量 |
| **对网络影响** | 无延迟、无单点故障风险 | 引入延迟、存在单点故障风险 |
| **响应方式** | 告警通知、发送 RST 包 | 直接丢弃、阻断连接 |
| **典型场景** | 合规审计、威胁检测 | 实时防护、虚拟补丁 |
| **性能要求** | 相对较低 | 高（需线速处理） |

> **🔑 高分考点**：IDS 是"报警器"（只检测不阻断），IPS 是"防火墙+"（检测并阻断）。考试中常考两者的部署位置和优劣势对比。

### 1.2 基于部署位置的分类

| 类型 | 部署位置 | 监控范围 | 代表产品 |
|:---|:---|:---|:---|
| **NIDS** | 网络关键节点（交换机镜像口） | 整个网段的网络流量 | Snort、Suricata、Zeek |
| **HIDS** | 终端/服务器上 | 单台主机的系统调用、文件操作、日志 | OSSEC、Wazuh、Tripwire |
| **NIPS** | 网络边界串联 | 进出网络的流量 | Cisco Firepower、Palo Alto Threat Prevention |
| **HIPS** | 终端/服务器上 | 单台主机的进程行为 | McAfee HIPS、Symantec CSP |
| **WIDS/WIPS** | 无线网络 | 802.11 无线流量 | Cisco Aironet、Aruba |

### 1.3 NIDS 与 HIDS 互补关系

```
                    ┌──────────────────────────┐
                    │      互联网 / 外部网络      │
                    └──────────┬───────────────┘
                               │
                    ┌──────────▼───────────────┐
                    │      NIPS (串联防护)       │ ← 第一道防线：网络层阻断
                    └──────────┬───────────────┘
                               │
                    ┌──────────▼───────────────┐
                    │  NIDS (旁路检测 - SPAN)   │ ← 第二道防线：网络流量分析
                    └──────────┬───────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
     ┌────────▼──────┐  ┌─────▼──────┐  ┌──────▼────────┐
     │ HIDS (服务器)  │  │HIDS (服务器)│  │ HIDS (终端)    │
     │ OSSEC/Wazuh   │  │ OSSEC      │  │ Wazuh Agent   │
     └───────────────┘  └────────────┘  └───────────────┘
     ← 第三道防线：主机层文件完整性、系统调用监控
```

> **💡 知识巧记**：NIDS 是"外围监控摄像头"（看整个园区），HIDS 是"室内红外探测器"（看单个房间）。两者互补，多层防御。

---

## 二、入侵检测技术分类

### 2.1 基于签名的检测（Signature-based / Knowledge-based）

基于签名的检测是最传统、最广泛使用的检测方法。它将网络流量或系统行为与已知的攻击模式（签名/规则）进行匹配。

**工作原理**：
- 维护一个攻击签名数据库
- 实时将流量/事件与签名进行模式匹配
- 匹配成功则产生告警

**Snort 规则示例**：

```snort
# 检测 ICMP 大包攻击（Ping of Death）
alert icmp $EXTERNAL_NET any -> $HOME_NET any (
    msg:"ICMP Large Packet - Possible Ping of Death";
    dsize:>8000;
    reference:cve,CVE-1999-0128;
    classtype:denial-of-service;
    sid:1000001; rev:1;
)

# 检测 SSH 暴力破解
alert tcp $EXTERNAL_NET any -> $HOME_NET 22 (
    msg:"SSH Brute Force - Multiple Connections";
    flow:to_server,established;
    threshold:type threshold, track by_src, count 10, seconds 60;
    classtype:attempted-recon;
    sid:1000002; rev:1;
)

# 检测 SQL 注入尝试
alert tcp $EXTERNAL_NET any -> $HOME_NET 80 (
    msg:"SQL Injection Attempt - UNION SELECT";
    flow:to_server,established;
    content:"UNION"; nocase;
    content:"SELECT"; nocase; distance:0;
    classtype:web-application-attack;
    sid:1000003; rev:1;
)
```

**优点**：
- 误报率低（针对已知攻击）
- 可精确定位攻击类型（规则中定义了具体的攻击名称）
- 符合合规要求（可证明检测了哪些威胁）

**缺点**：
- 无法检测零日攻击（没有签名）
- 签名库需持续更新
- 容易被变种绕过（改一个字符可能就匹配不到了）

### 2.2 基于异常的检测（Anomaly-based / Behavior-based）

基于异常的检测通过建立"正常行为基线"，检测偏离基线的异常行为。

**工作原理**：
1. **学习阶段**：收集网络流量或系统行为，建立正常行为模型（基线）
2. **检测阶段**：将实时行为与基线比较，偏离超过阈值则告警

**常见的异常检测维度**：

| 检测维度 | 基线示例 | 异常示例 |
|:---|:---|:---|
| 流量量级 | 平均 100Mbps | 突然飙升到 1Gbps |
| 连接数 | 每 IP 平均 50 连接/分钟 | 某 IP 发起 1000 连接/分钟 |
| 协议分布 | HTTP 60%, DNS 20%, SSH 5% | SSH 突然占 50% |
| 时间模式 | 工作日 9:00-18:00 流量高 | 凌晨 3:00 流量激增 |
| DNS 查询 | 正常域名（baidu.com 等） | 随机字符串域名（DGA 特征） |

**优点**：
- 可检测未知攻击和零日漏洞利用
- 不依赖签名更新

**缺点**：
- 误报率较高（正常业务变更也可能触发告警）
- 需要较长的学习期来建立基线
- 攻击者可以缓慢地"训练"系统（缓慢偏离基线）

### 2.3 基于状态协议分析的检测（Stateful Protocol Analysis）

基于状态协议分析通过深入理解协议规范，检测违反协议状态机的行为。

**工作原理**：
- 维护每个连接的状态（类似防火墙的状态表）
- 解析应用层协议（HTTP、SMTP、DNS 等）
- 检测不符合协议规范的行为

**示例：HTTP 协议异常检测**：

```
正常 HTTP 请求：
  GET /index.html HTTP/1.1\r\n
  Host: www.example.com\r\n
  User-Agent: Mozilla/5.0\r\n
  \r\n

异常检测点：
  1. 请求方法不在 RFC 定义的范围内（如使用自定义方法）
  2. HTTP 版本号格式错误
  3. Header 中的字段包含非 ASCII 字符
  4. Content-Length 与实际 body 长度不一致
  5. 请求中包含多个 Host 头（HTTP Request Smuggling）
  6. URL 长度异常（超过正常范围，可能是缓冲区溢出尝试）
```

**Suricata 协议解析配置**：

```yaml
# suricata.yaml - 应用层协议检测
app-layer:
  protocols:
    tls:
      enabled: yes
      detection-ports:
        dp: 443
      ja3-fingerprints: yes  # JA3 TLS 指纹识别
    http:
      enabled: yes
      memcap: 256mb
      libhtp:
        default-config:
          personality: IDS
          request-body-limit: 4096
          response-body-limit: 4096
    dns:
      enabled: yes
      global-memcap: 128mb
    smtp:
      enabled: yes
      raw-extraction: yes
    smb:
      enabled: yes
      detection-ports:
        dp: 139, 445
```

### 2.4 三种检测技术的对比与组合

| 技术 | 检出率 | 误报率 | 零日检测 | 性能开销 | 典型应用 |
|:---|:---:|:---:|:---:|:---:|:---|
| 签名检测 | 高（已知） | 低 | ✗ | 中 | 基础告警 |
| 异常检测 | 中 | 中-高 | ✓ | 高 | 威胁狩猎 |
| 协议分析 | 高 | 低 | 部分 | 高 | 深度检测 |

> **🔑 高分考点**：现代 IDS/IPS 通常**结合多种检测技术**（混合检测），考试中常考三种技术各自的优劣和适用场景。

---

## 三、Snort/Suricata 规则体系

### 3.1 Snort 规则语法详解

Snort 规则由规则头和规则选项两部分组成：

```
<规则动作> <协议> <源IP> <源端口> <方向> <目标IP> <目标端口> (<规则选项>)
```

**规则头详解**：

| 组成部分 | 说明 | 示例 |
|:---|:---|:---|
| 规则动作 | 匹配后执行的动作 | alert, log, pass, drop, reject |
| 协议 | 匹配的 IP 协议 | tcp, udp, icmp, ip |
| 源/目标 IP | CIDR 表示，可用变量 | $HOME_NET, $EXTERNAL_NET, any |
| 端口 | 单个端口或范围 | any, 80, [80,443], 1024:2048 |
| 方向 | 单向/双向 | ->, <> |

**常用规则选项**：

| 选项关键字 | 功能 | 示例 |
|:---|:---|:---|
| `msg` | 告警消息 | `msg:"WEB-ATTACKS SQL injection"` |
| `content` | 内容匹配 | `content:"/etc/passwd"` |
| `nocase` | 不区分大小写 | `content:"select"; nocase;` |
| `depth` | 搜索深度 | `depth:100;` |
| `offset` | 搜索起始偏移 | `offset:10;` |
| `distance` | 相对前一次匹配的偏移 | `distance:0;` |
| `within` | 匹配范围限制 | `within:50;` |
| `pcre` | Perl 正则匹配 | `pcre:"/select.+from/i"` |
| `flow` | 流方向控制 | `flow:to_server,established` |
| `classtype` | 规则分类 | `classtype:web-application-attack` |
| `reference` | 参考资料 | `reference:cve,2021-44228` |
| `sid` | 规则唯一 ID | `sid:1000001;` |
| `rev` | 规则版本号 | `rev:2;` |

**完整规则示例**：

```snort
# 检测 Log4j (Log4Shell) 漏洞利用 CVE-2021-44228
alert tcp $EXTERNAL_NET any -> $HOME_NET $HTTP_PORTS (
    msg:"SERVER-WEBAPP Apache Log4j logging RCE attempt (CVE-2021-44228)";
    flow:to_server,established;
    content:"|24 7b|";  # ${ 的十六进制
    content:"jndi"; nocase; distance:0;
    pcre:"/\$\{.*jndi:(ldap|rmi|dns|iiop|http):\/\/.+\}/i";
    metadata:policy balanced-ips drop, service http;
    reference:cve,2021-44228;
    reference:url,github.com/apache/logging-log4j2;
    classtype:attempted-admin;
    sid:1001001; rev:1;
)
```

### 3.2 Suricata 规则增强特性

Suricata 兼容 Snort 规则语法，同时增加了许多增强特性：

```suricata
# Suricata 特有的关键字示例

# 1. 使用 XBits 实现跨数据包的状态跟踪
alert http $EXTERNAL_NET any -> $HOME_NET any (
    msg:"Suspicious File Download after Java User-Agent";
    flow:to_server,established;
    xbits:set,java_ua,track tx;
    http_user_agent; content:"Java/"; nocase;
    classtype:policy-violation;
    sid:2000001; rev:1;
)

alert http $EXTERNAL_NET any -> $HOME_NET any (
    msg:"Suspicious File Download - Possible Malware";
    flow:to_client,established;
    xbits:isset,java_ua,track tx;
    http.stat_code; content:"200";
    file_data;
    content:"MZ";  # PE 文件头
    classtype:trojan-activity;
    sid:2000002; rev:1;
)

# 2. Lua 脚本扩展
# 可以用 Lua 实现复杂的检测逻辑
alert tcp any any -> any any (
    msg:"Custom Lua Detection";
    luajit:custom_detect.lua;
    sid:2000003; rev:1;
)
```

### 3.3 规则优化技巧

```snort
# 不好的规则：content 顺序影响匹配效率
alert tcp any any -> any any (
    content:"rare-string";    # 放在前面
    content:"GET";            # 非常常见，应放在前面
    content:"/index.html";
)

# 优化后的规则：常见的内容放在前面，利用快速模式匹配
alert tcp any any -> any any (
    content:"GET";            # 最常见，快速过滤
    content:"/index.html";    # 进一步过滤
    content:"rare-string";    # 稀有字符串，最后精确匹配
    fast_pattern:only;        # 仅用第一个 content 做快速模式匹配
)

# 使用 flowbits 减少误报
# 只有先访问登录页面，再出现异常行为的才告警
alert http $HOME_NET any -> $EXTERNAL_NET any (
    msg:"Login Page Access";
    flow:to_server,established;
    content:"/login.php"; http_uri;
    flowbits:set,login_page_accessed;
    sid:3000001; rev:1;
)

alert http $EXTERNAL_NET any -> $HOME_NET any (
    msg:"SQL Injection After Login";
    flow:to_server,established;
    flowbits:isset,login_page_accessed;
    content:"UNION SELECT"; nocase;
    sid:3000002; rev:1;
)
```

---

## 四、IDS/IPS 部署架构设计

### 4.1 网络部署位置选择

```
                   ┌─────────────────────────────────────┐
                   │              互联网                   │
                   └──────────────┬──────────────────────┘
                                  │
                   ┌──────────────▼──────────────────────┐
                   │          边界路由器                    │
                   └──────────────┬──────────────────────┘
                                  │
                   ┌──────────────▼──────────────────────┐
                   │    ① 边界防火墙 + IPS 模块            │
                   │    (第一道防线，串联部署)              │
                   └──────────────┬──────────────────────┘
                                  │
                   ┌──────────────▼──────────────────────┐
                   │    ② 核心交换机 (SPAN 镜像口)         │
                   │    ┌─────────────────────────────┐  │
                   │    │ ③ NIDS (旁路，监控所有流量)   │  │
                   │    └─────────────────────────────┘  │
                   └──────────────┬──────────────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
┌─────────▼──────┐    ┌──────────▼─────┐    ┌───────────▼──────┐
│  ④ 服务器区     │    │   ⑤ DMZ 区     │    │  ⑥ 办公终端区     │
│  HIDS (OSSEC)  │    │  WAF + HIDS    │    │  HIDS (Wazuh)    │
└────────────────┘    └────────────────┘    └──────────────────┘
```

**部署位置说明**：

| 位置 | 设备类型 | 作用 | 关键配置 |
|:---|:---|:---|:---|
| ① | NIPS | 边界防护 | 串联，启用 drop 规则 |
| ③ | NIDS | 全网流量监控 | SPAN 镜像口，不丢包 |
| ④ | HIDS | 服务器防护 | 文件完整性检查、rootkit 检测 |
| ⑤ | WAF | Web 应用防护 | HTTP/HTTPS 深度检测 |
| ⑥ | HIDS | 终端防护 | 进程行为、注册表监控 |

### 4.2 TAP vs SPAN

| 对比维度 | SPAN（端口镜像） | TAP（网络分路器） |
|:---|:---|:---|
| **工作原理** | 交换机复制流量到镜像端口 | 物理设备分光/复制信号 |
| **成本** | 几乎零成本（交换机自带） | 需要购买硬件 |
| **丢包风险** | 交换机负载高时可能丢包 | 不丢包（物理复制） |
| **延迟** | 可能有微秒级延迟 | 几乎无延迟 |
| **双向流量** | 单端口输出（双向合并） | 可分离上下行 |
| **适用场景** | 一般监控 | 高精度取证、金融交易监控 |

---

## 五、网络流量采集技术

### 5.1 PCAP 文件分析

```bash
# tcpdump 抓包命令
# 抓取 80 端口的 HTTP 流量
tcpdump -i eth0 -w capture.pcap port 80

# 抓取特定主机的流量
tcpdump -i eth0 -w host_traffic.pcap host 192.168.1.100

# 抓取除 SSH 外的所有流量
tcpdump -i eth0 -w no_ssh.pcap not port 22

# 限制抓包大小（每个包只抓前 96 字节）
tcpdump -i eth0 -s 96 -w sample.pcap

# 环形缓冲区抓包（滚动覆盖）
tcpdump -i eth0 -W 10 -C 100 -w rolling.pcap
```

**tshark 高级分析**：

```bash
# 统计 HTTP 请求的 User-Agent 分布
tshark -r capture.pcap -Y "http.request" -T fields -e http.user_agent | sort | uniq -c | sort -rn

# 提取所有 DNS 查询域名
tshark -r capture.pcap -Y "dns.qry.name" -T fields -e dns.qry.name | sort -u

# 统计各 IP 的流量
tshark -r capture.pcap -q -z conv,tcp

# 统计各协议的分布
tshark -r capture.pcap -q -z io,phs

# 导出 HTTP 对象（文件）
tshark -r capture.pcap --export-objects "http,./http-files"
```

### 5.2 Zeek (Bro) 网络分析框架

Zeek（原名 Bro）是一个强大的网络安全监控框架，不同于 Snort 的签名匹配，Zeek 更加关注协议解析和行为记录。

```zeek
# Zeek 脚本示例：检测 SSH 暴力破解
# detect_ssh_bruteforce.zeek

module SSH;

export {
    redef enum Notice::Type += {
        Bruteforce_Attempt
    };
    const auth_failure_threshold = 10 &redef;
    const auth_failure_interval = 5min &redef;
}

global ssh_auth_failures: table[addr] of count &create_expire=5min;
global ssh_auth_failure_peers: table[addr] of set[addr] &create_expire=5min;

event ssh_auth_failed(c: connection)
{
    local src = c$id$orig_h;
    local dst = c$id$resp_h;

    if (src !in ssh_auth_failures)
        ssh_auth_failures[src] = 0;
    ssh_auth_failures[src] += 1;

    if (src !in ssh_auth_failure_peers)
        ssh_auth_failure_peers[src] = set();
    add ssh_auth_failure_peers[src][dst];

    if (ssh_auth_failures[src] >= auth_failure_threshold)
    {
        NOTICE([$note=Bruteforce_Attempt,
                $src=src,
                $msg=fmt("SSH bruteforce: %s attempted %d times against %d hosts",
                          src, ssh_auth_failures[src], |ssh_auth_failure_peers[src]|),
                $identifier=cat(src)]);
    }
}
```

---

## 六、Snort 实战部署与配置

### 6.1 Snort 安装与基础配置

```bash
# Ubuntu/Debian 安装 Snort 3
apt update
apt install -y build-essential libpcap-dev libpcre3-dev libdumbnet-dev \
  zlib1g-dev pkg-config libluajit-5.1-dev libssl-dev \
  libnghttp2-dev libhyperscan-dev

# 从源码编译 Snort 3
wget https://github.com/snort3/snort3/archive/refs/tags/3.1.80.0.tar.gz
tar xzf 3.1.80.0.tar.gz
cd snort3-3.1.80.0
./configure_cmake.sh --prefix=/usr/local/snort
cd build
make -j$(nproc)
make install

# 安装社区规则
wget https://www.snort.org/downloads/community/snort3-community-rules.tar.gz
tar xzf snort3-community-rules.tar.gz -C /usr/local/snort/etc/rules/
```

```yaml
# snort.lua - Snort 3 主配置文件
---------------------------------------------------------------------------
-- 网络变量定义
---------------------------------------------------------------------------
HOME_NET = [[ 192.168.0.0/16 10.0.0.0/8 172.16.0.0/12 ]]
EXTERNAL_NET = [[ !$HOME_NET ]]
HTTP_PORTS = [[ 80 8080 8000 443 8443 ]]
SSH_PORTS = [[ 22 ]]
DNS_SERVERS = [[ 192.168.1.53 192.168.2.53 ]]

---------------------------------------------------------------------------
-- 检测引擎配置
---------------------------------------------------------------------------
ips =
{
    mode = inline,          -- inline 模式（IPS），tap 模式（IDS）
    enable_builtin_rules = true,
    include = RULE_PATH .. '/snort3-community.rules',
    include = RULE_PATH .. '/custom-rules/*.rules',
}

---------------------------------------------------------------------------
-- 网络分析器
---------------------------------------------------------------------------
network =
{
    checksum_eval = {},
}

---------------------------------------------------------------------------
-- 输出插件
---------------------------------------------------------------------------
alerts =
{
    {
        syslog =
        {
            facility = 'LOG_AUTH',
            level = 'LOG_INFO',
        }
    },
    {
        alert_json =
        {
            file = true,
            limit = 1000,
        }
    },
    {
        alert_csv =
        {
            file = true,
            limit = 1000,
            fields = 'timestamp pkt_num proto pkt_gen pkt_len dir src_addr src_port dst_addr dst_port rule action class',
        }
    }
}
```

### 6.2 Snort 运行模式

```bash
# 1. IDS 模式（旁路监听）- 只检测不阻断
snort -c /usr/local/snort/etc/snort/snort.lua \
  -i eth0 \
  -l /var/log/snort \
  --plugin-path /usr/local/snort/lib/snort/plugins \
  -D  # 后台运行

# 2. IPS 模式（串联）- 检测并阻断
# 首先需要将网口配置为透明桥接模式
ip link add name br0 type bridge
ip link set eth0 master br0
ip link set eth1 master br0
ip link set br0 up

# 然后以 inline 模式运行 Snort
snort -c /usr/local/snort/etc/snort/snort.lua \
  -i eth0:eth1 \  # 两个网口组成 inline 对
  -Q \             # inline 模式
  -l /var/log/snort

# 3. 测试模式 - 验证配置文件
snort -c /usr/local/snort/etc/snort/snort.lua --warn-all

# 4. PCAP 回放模式 - 离线分析
snort -c /usr/local/snort/etc/snort/snort.lua \
  -r suspicious_traffic.pcap \
  -l /var/log/snort/replay
```

---

## 七、Suricata 高级特性

### 7.1 Suricata 多线程架构

Suricata 最大的优势是原生多线程支持，而 Snort 传统上是单线程的（Snort 3 有所改进）。

```
Suricata 线程模型：

┌─────────────────────────────────────────────────────────┐
│                    管理线程                               │
│              (Flow Manager, Counters)                    │
├─────────────────────────────────────────────────────────┤
│  捕获线程 1    │  捕获线程 2    │  捕获线程 3    │  ...  │
│  (AFP_PACKET)  │  (AFP_PACKET)  │  (AFP_PACKET)  │       │
├─────────────────────────────────────────────────────────┤
│  检测线程 1    │  检测线程 2    │  检测线程 3    │  ...  │
│  (Detect)      │  (Detect)      │  (Detect)      │       │
├─────────────────────────────────────────────────────────┤
│  输出线程 1    │  输出线程 2    │  ...                      │
│  (Output)      │  (Output)      │                          │
└─────────────────────────────────────────────────────────┘
```

```yaml
# suricata.yaml - 线程配置
threading:
  set-cpu-affinity: yes
  cpu-affinity:
    - management-cpu-set:
        cpu: [ 0 ]
    - worker-cpu-set:
        cpu: [ 1,2,3,4,5,6,7 ]
        mode: "exclusive"
  detect-thread-ratio: 1.5
```

### 7.2 Suricata 文件提取与恶意软件检测

```yaml
# suricata.yaml - 文件提取配置
- file-store:
    enabled: yes
    version: 2
    log-dir: /var/log/suricata/files
    force-magic: yes
    force-hash: [md5, sha1, sha256]
    write-fileinfo: yes
    stream-depth: 10mb
    max-open-files: 1000
```

```suricata
# 检测恶意 Office 文档（包含宏）
alert http $EXTERNAL_NET any -> $HOME_NET any (
    msg:"MALWARE Office Document with Macros Downloaded";
    flow:established,to_client;
    file_data;
    content:"doc"; within:512;
    filemagic:"Composite Document File V2 Document";
    filestore;
    classtype:trojan-activity;
    sid:4000001; rev:1;
)
```

---

## 八、告警分析与误报处理

### 8.1 告警分类优先级

| 优先级 | 告警类别 | 响应时间 | 典型规则 SID |
|:---:|:---|:---:|:---|
| 1 | 已确认的入侵（命令执行成功、数据外泄） | 立即（15 分钟内） | CVE 利用成功 |
| 2 | 尝试性攻击（漏洞探测、登录尝试） | 30 分钟内 | 扫描、暴力破解 |
| 3 | 可疑活动（异常流量、非标准行为） | 2 小时内 | 异常 DNS、加密隧道 |
| 4 | 策略违规（P2P、未授权服务） | 24 小时内 | 非标准端口 |

### 8.2 误报分析流程

```
告警产生
    │
    ▼
┌─────────────────────┐
│ 1. 验证告警真实性     │
│   - 查看原始数据包    │
│   - 检查时间线       │
│   - 确认资产信息      │
└────────┬────────────┘
         │
    ┌────▼────┐
    │ 真阳性?  │
    └─┬────┬──┘
      │是  │否
      ▼    ▼
  事件处理  记录误报原因
      │        │
      ▼        ▼
  升级处置  规则调优
              │
              ▼
         ┌──────────┐
         │ 调整阈值   │
         │ 添加例外   │
         │ 禁用规则   │
         └──────────┘
```

---

## 九、IDS/IPS 绕过技术及防御

### 9.1 常见绕过技术

| 绕过技术 | 原理 | 示例 | 防御方法 |
|:---|:---|:---|:---|
| **分片攻击** | 将攻击载荷分散到多个 IP 分片中 | `ping -s 65500` 大包分片 | 启用分片重组（stream5） |
| **编码绕过** | 使用 URL 编码、Unicode 编码混淆 | `%55%4E%49%4F%4E%20%53%45%4C%45%43%54` | 解码后再匹配 |
| **大小写混淆** | 混合大小写绕过内容匹配 | `UnIoN SeLeCt` | 使用 nocase 修饰符 |
| **多态 Shellcode** | 每次攻击使用不同的加密/编码 | XOR 编码的 shellcode | 行为分析 + 沙箱 |
| **分段传输** | HTTP Chunked 编码拆分攻击载荷 | Transfer-Encoding: chunked | HTTP 协议规范化 |
| **隧道技术** | 将攻击流量封装在允许的协议中 | DNS 隧道、ICMP 隧道 | 协议异常检测 |
| **SSL/TLS 加密** | 加密后的流量无法检测内容 | HTTPS 传输攻击载荷 | SSL 解密（MITM）|
| **IPv6 绕过** | 利用 IPv6 绕过仅配置 IPv4 的 IDS | IPv6 扩展头滥用 | 同时配置 IPv6 检测 |

**实际绕过示例**：

```python
# 攻击者可能使用的 IDS 绕过技巧
import requests

# 1. 利用 HTTP 参数污染
# IDS 可能只检查第一个参数，而服务器使用第二个参数
url = "http://target.com/search?q=safe&q=1' UNION SELECT * FROM users--"

# 2. 分块传输绕过
def chunked_request(url, data):
    # 使用 HTTP Chunked Transfer-Encoding 拆分请求体
    import socket
    host = "target.com"
    port = 80
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect((host, port))

    request = (
        f"POST /vuln HTTP/1.1\r\n"
        f"Host: {host}\r\n"
        f"Transfer-Encoding: chunked\r\n"
        f"\r\n"
    )
    sock.send(request.encode())

    # 将 payload 拆分为多个 chunk
    payload = "1' UNION SELECT * FROM users--"
    chunk_size = 5
    for i in range(0, len(payload), chunk_size):
        chunk = payload[i:i+chunk_size]
        sock.send(f"{len(chunk):x}\r\n{chunk}\r\n".encode())

    sock.send(b"0\r\n\r\n")
    return sock.recv(4096)
```

### 9.2 IDS 防御加固

```bash
# Snort 流重组配置（防御分片攻击）
# snort.lua
stream =
{
    tcp =
    {
        max_window = 65535,
        overlap_limit = 0,
        max_consecutive_small_segments = 0,
        require_3whs = 3600,    -- 要求三次握手
    },
    ip =
    {
        min_fragment_length = 0,
        max_fragments = 8192,
    }
}

# HTTP 规范化配置（防御编码绕过）
http_inspect =
{
    request_depth = -1,         -- 检查整个请求
    unicode_map = 1252,
    normalize_utf = true,
    extended_response_inspection = true,
    enable_cookie = true,
    decompress_swf = true,
    decompress_pdf = true,
}
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | IDS 与 IPS 核心区别 | ★★★★★ | 低 | IDS 旁路检测告警，IPS 串联检测阻断 |
| 2 | 三种检测技术 | ★★★★★ | 中 | 签名检测、异常检测、状态协议分析 |
| 3 | NIDS 与 HIDS 区别 | ★★★★☆ | 低 | NIDS 网络层，HIDS 主机层 |
| 4 | Snort 规则结构 | ★★★★☆ | 中 | 规则头（动作协议地址端口方向）+ 规则选项 |
| 5 | Snort 规则动作 | ★★★★☆ | 低 | alert, log, pass, drop, reject, sdrop |
| 6 | SPAN vs TAP | ★★★☆☆ | 中 | SPAN 交换机镜像（可能丢包），TAP 物理分路（不丢包） |
| 7 | IDS 绕过技术 | ★★★☆☆ | 高 | 分片、编码、隧道、加密 |
| 8 | 签名检测的局限性 | ★★★★☆ | 中 | 无法检测零日攻击，易被变种绕过 |

### 💡 知识巧记口诀

> **"IDS 旁路喊救命，IPS 串联直接拦"** — IDS 检测后告警，IPS 检测后阻断
>
> **"签名已知准，异常未知行"** — 签名检测对已知攻击准确率高，异常检测能发现未知威胁
>
> **"动作协议地址口，方向选项在后头"** — Snort 规则结构：动作 → 协议 → IP → 端口 → 方向 → (选项)
>
> **"分片编码隧道加密，四大绕过要谨记"** — 四种常见 IDS 绕过技术
>
> **"NIDS 看全网，HIDS 看单机"** — NIDS 监控整个网段，HIDS 只监控安装的主机

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "IDS 可以完全替代防火墙" | ❌ 错误！IDS 是检测工具，不具备访问控制功能，防火墙是访问控制的基础 |
| "Suricata 完全兼容 Snort 规则" | ⚠️ 部分正确！Suricata 兼容 Snort 规则语法，但部分高级关键字和行为有差异 |
| "启用所有规则是最安全的做法" | ❌ 错误！会产生海量告警和性能问题，应根据环境定制规则集 |
| "IPS 部署后就不需要 IDS 了" | ❌ 错误！IPS 关注阻断，IDS 关注检测，两者互补，IDS 还可以验证 IPS 是否漏报 |
| "签名检测能检测所有攻击" | ❌ 错误！签名只能检测已知攻击，零日漏洞和多态攻击需要行为分析 |

---

## 学习建议

1. 🖥️ **动手部署 Snort 或 Suricata**：在虚拟机上安装 Snort 3 或 Suricata，配置基本规则并测试告警
2. 📝 **编写 10 条自定义规则**：覆盖 Web 攻击、恶意软件、暴力破解、扫描、DDoS 等场景
3. 🧪 **用 Metasploitable 测试**：搭建 Metasploitable 靶机，用 Nmap 和 Metasploit 发起攻击，观察 IDS 告警
4. 🔄 **对比 Snort 和 Suricata**：在同一流量下对比两者的检测率和性能
5. 📊 **分析真实 PCAP**：从 malware-traffic-analysis.net 下载包含恶意流量的 PCAP 文件进行分析
6. 🎯 **实践绕过技术**：在实验环境中尝试常见的 IDS 绕过技术，理解攻击者的思维方式

---

> **IDS/IPS 不是"部署即安全"的黑盒，而是需要安全分析师持续调优、持续学习的"安全哨兵"。好的规则库和调优，能让 IDS 从"噪音发生器"变成真正的"威胁猎手"。**
""")

print("Day 4 done")

# ============================================================
# Day 5: 异常行为分析
# ============================================================
gen('day-5.md', r"""# Day 5：异常行为分析

> **📘 文档定位**：CISP 考试核心基础 | 难度：中高级 | 预计阅读：50 分钟
>
> 异常行为分析是第三代 SOC 的核心能力。当攻击者绕过了签名检测，异常行为分析是发现未知威胁的最后一道防线。本章从 UEBA（用户实体行为分析）原理、机器学习在安全中的应用、行为基线构建到威胁狩猎方法论，系统讲解如何通过行为分析发现隐藏的威胁。

---

## 导航目录

- [一、异常行为分析概述](#一异常行为分析概述)
- [二、UEBA 技术原理与架构](#二ueba-技术原理与架构)
- [三、行为基线构建方法论](#三行为基线构建方法论)
- [四、用户行为分析实战](#四用户行为分析实战)
- [五、实体行为分析（服务器/终端）](#五实体行为分析服务器终端)
- [六、网络行为异常检测](#六网络行为异常检测)
- [七、机器学习在异常检测中的应用](#七机器学习在异常检测中的应用)
- [八、威胁狩猎方法论](#八威胁狩猎方法论)
- [九、ATT&CK 驱动的行为分析](#九attck-驱动的行为分析)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、异常行为分析概述

### 1.1 为什么需要异常行为分析

传统基于签名的安全检测（如 IDS 规则、病毒特征码）面临三大困境：

| 困境 | 具体表现 | 数据支撑 |
|:---|:---|:---|
| **签名滞后** | 新漏洞利用到签名发布平均需要 60 天 | Verizon 2023 DBIR：零日漏洞平均 52 天才被发现 |
| **变种绕过** | 攻击者只需修改少量代码即可绕过签名 | 每天新产生 45 万+ 新恶意软件样本（AV-Test 2023） |
| **合法工具滥用** | 攻击者使用 PowerShell、WMI、PsExec 等合法工具 | 90% 以上的攻击包含合法工具滥用（CrowdStrike 2023） |

> **🔑 高分考点**：异常行为分析解决的是"未知威胁检测"问题。当攻击者的工具是合法的（Living-off-the-Land），行为是异常的唯一指标。

### 1.2 异常检测的基本原理

```
正常行为空间（Normal Behavior Space）
┌────────────────────────────────────────┐
│                                        │
│    ░░░░░░░░░░░░░░░░░░                  │
│    ░░░░ 正常行为 ░░░░░░    ★ 异常行为   │
│    ░░░░░░░░░░░░░░░░░░      （偏离基线） │
│    ░░░░░░░░░░░░░░░░░░                  │
│                                        │
└────────────────────────────────────────┘

检测逻辑：
  IF 当前行为与基线的距离 > 阈值 THEN 产生告警
  ELSE 更新基线（缓慢适应正常变化）
```

### 1.3 异常分析的三大挑战

| 挑战 | 描述 | 应对策略 |
|:---|:---|:---|
| **基线的动态性** | 正常行为会随时间变化（业务扩张、系统升级） | 自适应基线更新（指数加权移动平均） |
| **攻击者的适应性** | 攻击者会缓慢调整行为以"训练"异常检测系统 | 多维度交叉验证，不依赖单一特征 |
| **误报的代价** | 过多的误报导致分析师"狼来了"效应 | 结合上下文（资产重要性、威胁情报）降低误报 |

---

## 二、UEBA 技术原理与架构

### 2.1 UEBA 核心概念

UEBA（User and Entity Behavior Analytics，用户实体行为分析）是 Gartner 2015 年提出的概念，通过机器学习分析用户和实体（服务器、终端、应用）的行为模式，发现异常和潜在威胁。

**UEBA 的三大分析维度**：

```
                      UEBA 分析框架
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐    ┌────▼─────┐    ┌─────▼─────┐
    │ 用户行为   │    │ 实体行为  │    │ 对等分析   │
    │ User      │    │ Entity   │    │ Peer      │
    └───────────┘    └──────────┘    └───────────┘
    分析对象：        分析对象：       分析方法：
    - 登录行为       - 进程行为      - 同部门用户比较
    - 访问行为       - 网络连接      - 同类型服务器比较
    - 数据操作       - 文件变更      - 同角色用户比较
    - 权限变更       - 资源消耗      - 历史基线比较
```

### 2.2 UEBA 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                      数据源层                                 │
│   AD/LDAP │ VPN │ 云访问日志 │ DLP │ EDR │ 网络流量 │ 应用日志 │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    数据采集与预处理层                          │
│   - 数据清洗（去重、去噪、格式统一）                           │
│   - 特征工程（特征提取、编码、归一化）                         │
│   - 实体解析（同一用户/实体的多账号关联）                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    分析引擎层                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │ 规则引擎  │  │ 统计模型  │  │ ML 模型  │  │ 图分析引擎    │ │
│  │ Rule     │  │ Stats    │  │ ML       │  │ Graph       │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    评分与告警层                                │
│   - 风险评分（Risk Scoring，0-100）                           │
│   - 告警聚合（关联同一攻击的多个异常）                          │
│   - 优先级排序（结合资产重要性）                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    响应与可视化层                              │
│   调查时间线 │ 攻击路径图 │ 用户风险画像 │ SOAR 自动响应         │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 主流 UEBA 产品对比

| 产品 | 厂商 | 核心优势 | 适用场景 |
|:---|:---|:---|:---|
| **Splunk UBA** | Splunk | 与 Splunk ES 深度集成 | 已有 Splunk 的企业 |
| **Microsoft Sentinel UEBA** | Microsoft | Azure AD 原生集成，成本低 | Microsoft 365 用户 |
| **Exabeam** | Exabeam | 专用 UEBA 平台，时间线分析强 | 需要高级 UEBA 的场景 |
| **Securonix** | Securonix | 基于 Hadoop，大数据能力强 | 超大规模部署 |
| **Gurucul** | Gurucul | 身份分析专精 | IAM 密集型场景 |

---

## 三、行为基线构建方法论

### 3.1 基线构建流程

```
步骤 1：数据收集（2-4 周）
  收集足够多的历史数据，覆盖正常业务周期（工作日/周末/节假日/月底）

步骤 2：特征提取
  从原始日志中提取可量化的行为特征
  - 登录时间分布（小时级）
  - 登录地点分布（IP/地理位置）
  - 访问的资源类型分布
  - 数据访问量（文件数、数据量）

步骤 3：统计建模
  对每个特征建立统计分布
  - 均值 (μ) 和标准差 (σ)
  - 四分位数 (Q1, Q3)
  - 频率分布

步骤 4：阈值设定
  根据统计模型设定异常阈值
  - 简单阈值：> μ + 3σ（正态分布假设）
  - 百分位阈值：> P99（非参数）
  - 动态阈值：基于 MAD（中位数绝对偏差）

步骤 5：持续更新
  定期更新基线以适应正常业务变化
  - 指数加权移动平均（EWMA）
  - 滚动窗口更新
```

### 3.2 统计方法详解

**方法 1：Z-Score（标准分数）**

```python
import numpy as np

def zscore_anomaly_detection(data, threshold=3.0):
    # 使用 Z-Score 检测异常值
    mean = np.mean(data)
    std = np.std(data)
    anomalies = []
    for i, value in enumerate(data):
        z_score = (value - mean) / std if std > 0 else 0
        if abs(z_score) > threshold:
            anomalies.append((i, value, z_score))
    return anomalies

# 示例：检测异常登录时间
login_hours = [9, 9, 8, 9, 10, 9, 9, 9, 8, 9, 3, 9, 9]  # 3 点异常
anomalies = zscore_anomaly_detection(login_hours, threshold=2.0)
# 输出：[(10, 3, -3.2)]  - 凌晨 3 点登录是异常的
```

**方法 2：MAD（中位数绝对偏差）**

MAD 比 Z-Score 更鲁棒，不受极端值影响：

```python
def mad_anomaly_detection(data, threshold=3.5):
    # 使用 MAD 检测异常（鲁棒性更好）
    median = np.median(data)
    mad = np.median([abs(x - median) for x in data])
    if mad == 0:
        return []
    anomalies = []
    for i, value in enumerate(data):
        modified_z_score = 0.6745 * (value - median) / mad
        if abs(modified_z_score) > threshold:
            anomalies.append((i, value, modified_z_score))
    return anomalies
```

**方法 3：Isolation Forest（孤立森林）**

```python
from sklearn.ensemble import IsolationForest
import pandas as pd

def isolation_forest_detect(features_df, contamination=0.1):
    # 使用 Isolation Forest 检测多维异常
    model = IsolationForest(
        contamination=contamination,  # 预期异常比例
        random_state=42,
        n_estimators=100
    )
    # features_df 包含多个行为特征列
    predictions = model.fit_predict(features_df)
    # predictions: 1=正常, -1=异常
    anomalies = features_df[predictions == -1]
    return anomalies, model

# 使用示例
features = pd.DataFrame({
    'login_count': [5, 8, 3, 6, 7, 5, 4, 6, 50, 7],  # 50 异常
    'data_access_mb': [10, 15, 8, 12, 14, 11, 9, 13, 500, 15],  # 500 异常
    'unique_files': [3, 5, 2, 4, 5, 3, 2, 4, 100, 5],  # 100 异常
})
anomalies, model = isolation_forest_detect(features)
print(f"发现 {len(anomalies)} 个异常样本")
```

### 3.3 特征工程

UEBA 中关键的行为特征类别：

| 特征类别 | 特征示例 | 数据来源 |
|:---|:---|:---|
| **时间特征** | 登录时间分布（小时级）、工作日/周末 | AD 日志、VPN 日志 |
| **空间特征** | 登录 IP、地理位置、IP 网段 | VPN 日志、AD 日志 |
| **频率特征** | 每日登录次数、认证失败率、文件访问次数 | AD 日志、文件审计 |
| **容量特征** | 数据传输量、邮件发送量、打印量 | DLP、邮件网关 |
| **序列特征** | 典型操作序列（登录→查邮件→访问共享→退出） | 多日志源关联 |
| **关系特征** | 与谁通信、访问哪些服务器、组织汇报关系 | 网络流、AD 组 |

---

## 四、用户行为分析实战

### 4.1 异常登录检测

异常登录是最常见的 UEBA 场景之一，以下是具体检测方法：

```python
import datetime
from collections import defaultdict

class LoginAnomalyDetector:
    def __init__(self):
        self.user_hour_profile = defaultdict(lambda: defaultdict(int))
        self.user_ip_history = defaultdict(set)
        self.user_country_history = defaultdict(set)

    def train(self, historical_logins):
        # 从历史登录数据建立基线
        for login in historical_logins:
            user = login['user']
            hour = login['timestamp'].hour
            ip = login['source_ip']
            country = login.get('country', 'UNKNOWN')

            self.user_hour_profile[user][hour] += 1
            self.user_ip_history[user].add(ip)
            self.user_country_history[user].add(country)

    def detect(self, login_event):
        # 检测单次登录事件是否异常
        alerts = []
        user = login_event['user']
        hour = login_event['timestamp'].hour
        ip = login_event['source_ip']
        country = login_event.get('country', 'UNKNOWN')

        # 检测 1：非工作时间登录
        if 0 <= hour <= 6:
            if user in self.user_hour_profile:
                night_logins = sum(
                    v for h, v in self.user_hour_profile[user].items()
                    if 0 <= h <= 6
                )
                if night_logins == 0:
                    alerts.append({
                        'type': 'OFF_HOURS_LOGIN',
                        'severity': 'MEDIUM',
                        'detail': f'User {user} logged in at {hour}:00 (never logged in during night hours)'
                    })

        # 检测 2：新 IP 地址
        if user in self.user_ip_history and ip not in self.user_ip_history[user]:
            alerts.append({
                'type': 'NEW_IP_LOGIN',
                'severity': 'HIGH',
                'detail': f'User {user} logged in from new IP {ip}'
            })

        # 检测 3：新国家/地区
        if user in self.user_country_history and country not in self.user_country_history[user]:
            alerts.append({
                'type': 'NEW_COUNTRY_LOGIN',
                'severity': 'HIGH',
                'detail': f'User {user} logged in from new country {country}'
            })

        # 检测 4：不可能旅行（同一用户短时间内从两个地理位置很远的 IP 登录）
        # 需要结合上一次登录的时间和位置判断

        return alerts
```

### 4.2 数据泄露行为检测

数据泄露往往表现出以下异常行为模式：

| 异常模式 | 特征 | 检测方法 |
|:---|:---|:---|
| **数据囤积** | 短时间内访问/下载大量文件 | 文件访问量超过 P99 阈值 |
| **异常外传** | 向外部发送大量数据 | 出站流量异常、目标 IP 非业务相关 |
| **特权滥用** | 使用特权访问非工作相关的敏感数据 | 结合用户角色和访问目的判断 |
| **非工作时间数据访问** | 深夜或周末大量访问敏感数据 | 时间异常 + 数据量异常组合检测 |

```python
# 数据泄露检测伪代码
def detect_data_exfiltration(user_events, baseline):
    # 检测潜在的数据外泄行为
    risk_score = 0

    # 规则 1：数据访问量异常（超过 P99）
    if user_events.file_access_count > baseline['p99_file_access']:
        risk_score += 30
        reason = f"File access count ({user_events.file_access_count}) exceeds P99"

    # 规则 2：非工作时间访问敏感数据
    if user_events.hour < 7 or user_events.hour > 20:
        if user_events.sensitive_file_count > 0:
            risk_score += 40
            reason = f"Sensitive file access during off-hours"

    # 规则 3：访问了从未访问过的敏感目录
    new_sensitive_dirs = user_events.dirs - baseline['known_dirs']
    if new_sensitive_dirs:
        risk_score += 20
        reason = f"First-time access to sensitive directories"

    # 规则 4：USB 大容量拷贝
    if user_events.usb_write_mb > 100:
        risk_score += 50
        reason = f"Large USB write ({user_events.usb_write_mb}MB)"

    # 规则 5：邮件外发大附件
    if user_events.email_external_attachments_mb > 50:
        risk_score += 30
        reason = f"Large external email attachments"

    if risk_score >= 60:
        return {'alert': True, 'risk_score': risk_score, 'reason': reason}
    return {'alert': False}
```

### 4.3 内部威胁检测

内部威胁是最难检测的安全威胁之一，因为内部用户本身就拥有合法访问权限：

| 内部威胁类型 | 行为特征 | 检测指标 |
|:---|:---|:---|
| **即将离职员工** | 突然大量访问/下载数据 | 数据访问量突增 300%+ |
| **恶意内部人员** | 逐步提升权限、访问敏感系统 | 权限变更序列 + 异常访问 |
| **被劫持账户** | 行为模式突然改变 | 登录时间/地点/设备突变 |
| **疏忽型内部威胁** | 将敏感数据发送到个人邮箱 | 邮件规则检测 + DLP 关键字 |

---

## 五、实体行为分析（服务器/终端）

### 5.1 服务器异常行为

```python
class ServerAnomalyDetector:
    # 服务器异常行为检测器
    def __init__(self):
        self.baseline = {}

    def train(self, historical_metrics):
        # 建立服务器行为基线
        self.baseline = {
            'cpu_mean': np.mean([m['cpu'] for m in historical_metrics]),
            'cpu_std': np.std([m['cpu'] for m in historical_metrics]),
            'net_out_mean': np.mean([m['net_out_bytes'] for m in historical_metrics]),
            'net_out_std': np.std([m['net_out_bytes'] for m in historical_metrics]),
            'process_set': set.union(*[set(m['processes']) for m in historical_metrics]),
            'common_ports': self._get_common_ports(historical_metrics),
            'common_connections': self._get_common_connections(historical_metrics),
        }

    def detect(self, current_metrics):
        # 检测当前行为是否异常
        alerts = []

        # 1. CPU 使用率异常
        if current_metrics['cpu'] > self.baseline['cpu_mean'] + 3 * self.baseline['cpu_std']:
            alerts.append({'type': 'CPU_SPIKE', 'severity': 'MEDIUM'})

        # 2. 出站流量异常（可能数据外泄）
        if current_metrics['net_out_bytes'] > self.baseline['net_out_mean'] + 3 * self.baseline['net_out_std']:
            alerts.append({'type': 'NETWORK_OUTBOUND_SPIKE', 'severity': 'HIGH'})

        # 3. 新进程出现
        new_processes = set(current_metrics['processes']) - self.baseline['process_set']
        for proc in new_processes:
            if proc.lower() in ['nc.exe', 'ncat.exe', 'mimikatz.exe', 'psexec.exe']:
                alerts.append({'type': 'SUSPICIOUS_PROCESS', 'severity': 'CRITICAL', 'detail': proc})

        # 4. 新的网络连接目标
        new_connections = [conn for conn in current_metrics['connections']
                          if conn not in self.baseline['common_connections']]
        for conn in new_connections:
            alerts.append({'type': 'NEW_CONNECTION', 'severity': 'LOW', 'detail': conn})

        return alerts

    def _get_common_ports(self, metrics):
        # 统计常见的监听端口
        pass

    def _get_common_connections(self, metrics):
        # 统计常见的网络连接
        pass
```

### 5.2 进程行为链分析

攻击往往表现为一系列异常的进程行为链：

```
正常管理员行为链：
  explorer.exe → cmd.exe → whoami.exe
  （资源管理器打开命令行执行系统信息查询）

可疑攻击行为链：
  winword.exe → cmd.exe → powershell.exe (EncodedCommand) → rundll32.exe
  （Word 文档启动 cmd 再启动编码的 PowerShell 再加载 DLL）
  ↑ CVE-2017-0199 典型攻击链

勒索软件行为链：
  excel.exe → cmd.exe → vssadmin.exe delete shadows /all → cipher.exe /w:C:
  （Excel 宏启动命令行 → 删除卷影副本 → 擦除磁盘空间）
```

```python
# 进程链异常检测
SUSPICIOUS_CHAINS = [
    {
        'name': 'Office Macro Attack',
        'chain': ['winword.exe|excel.exe|powerpnt.exe', 'cmd.exe|powershell.exe', 'rundll32.exe|regsvr32.exe'],
        'description': 'Office 文档启动脚本解释器后加载 DLL'
    },
    {
        'name': 'Credential Dumping',
        'chain': ['*.exe', 'procdump.exe|lsass.exe', '*.exe'],
        'description': '进程访问 lsass.exe 后创建 dump 文件'
    },
    {
        'name': 'Ransomware',
        'chain': ['*.exe', 'vssadmin.exe', 'cipher.exe|bcdedit.exe'],
        'description': '删除卷影副本后擦除磁盘或修改启动配置'
    }
]
```

---

## 六、网络行为异常检测

### 6.1 C2 通信检测

C2（Command and Control）通信是攻击者控制已入侵主机的通道。异常行为分析是检测 C2 的主要手段：

**C2 通信的行为特征**：

| 特征 | 正常行为 | C2 行为 |
|:---|:---|:---|
| **通信频率** | 随机、突发 | 规律性的心跳（Beaconing），如每 60 秒一次 |
| **通信时长** | 长短不一 | 长时间低流量连接（"长连接、低流量"） |
| **数据包大小** | 变化大 | 固定大小或大小相近（控制指令通常较短） |
| **时间模式** | 工作时间活跃 | 全天候规律通信 |
| **目标 IP 属性** | 已知服务商 | 新注册域名、动态 DNS、异常国家/地区 |

**Beaconing 检测算法**：

```python
import numpy as np
from collections import defaultdict

def detect_beaconing(connections, time_window=3600, min_connections=5):
    # 检测周期性的 C2 Beaconing 行为
    # 按 (源IP, 目标IP, 目标端口) 分组
    groups = defaultdict(list)
    for conn in connections:
        key = (conn['src_ip'], conn['dst_ip'], conn['dst_port'])
        groups[key].append(conn['timestamp'])

    alerts = []
    for (src, dst, port), timestamps in groups.items():
        if len(timestamps) < min_connections:
            continue

        # 计算相邻连接的时间间隔
        intervals = []
        for i in range(1, len(timestamps)):
            interval = (timestamps[i] - timestamps[i-1]).total_seconds()
            intervals.append(interval)

        if len(intervals) < 3:
            continue

        # 计算间隔的标准差和抖动
        mean_interval = np.mean(intervals)
        std_interval = np.std(intervals)
        jitter = std_interval / mean_interval if mean_interval > 0 else float('inf')

        # 低抖动 + 规律间隔 = 可能的 Beaconing
        if jitter < 0.15 and 30 < mean_interval < 3600:
            alerts.append({
                'src': src,
                'dst': dst,
                'port': port,
                'mean_interval': mean_interval,
                'jitter': jitter,
                'connections': len(timestamps),
                'severity': 'HIGH'
            })

    return alerts
```

### 6.2 DNS 异常检测

DNS 是 C2 通信最常用的通道之一，因为 DNS 流量通常不被拦截：

```python
import math
from collections import Counter

def detect_dga_domains(dns_queries, entropy_threshold=3.5):
    # 检测 DGA（域名生成算法）生成的域名
    suspicious = []

    for query in dns_queries:
        domain = query['domain']
        domain_part = domain.split('.')[0]  # 去掉 TLD

        # 1. 域名长度异常
        if len(domain_part) > 20:
            suspicious.append({**query, 'reason': 'Long domain', 'score': 20})

        # 2. 计算香农熵（随机性）
        entropy = calculate_shannon_entropy(domain_part)
        if entropy > entropy_threshold:
            suspicious.append({**query, 'reason': f'High entropy ({entropy:.2f})', 'score': 30})

        # 3. 辅音/元音比例异常
        vowels = sum(1 for c in domain_part.lower() if c in 'aeiou')
        consonants = len(domain_part) - vowels
        if consonants > 0:
            ratio = vowels / consonants
            if ratio < 0.2:  # 元音太少，可能是随机生成
                suspicious.append({**query, 'reason': 'Low vowel ratio', 'score': 20})

        # 4. 数字比例过高
        digits = sum(1 for c in domain_part if c.isdigit())
        if digits / len(domain_part) > 0.5:
            suspicious.append({**query, 'reason': 'High digit ratio', 'score': 15})

        # 5. NXDOMAIN 响应（域名不存在）
        if query.get('response_code') == 'NXDOMAIN':
            suspicious.append({**query, 'reason': 'NXDOMAIN', 'score': 10})

    return suspicious

def calculate_shannon_entropy(s):
    # 计算字符串的香农熵
    if not s:
        return 0
    freq = Counter(s)
    length = len(s)
    entropy = 0
    for count in freq.values():
        prob = count / length
        entropy -= prob * math.log2(prob)
    return entropy

# 测试
test_domains = [
    {'domain': 'www.google.com', 'response_code': 'NOERROR'},
    {'domain': 'a7x9k2m4p1q8v3b6.example.com', 'response_code': 'NXDOMAIN'},  # 可疑
    {'domain': 'xyz-12345-67890.xyz', 'response_code': 'NXDOMAIN'},  # 可疑
]
suspicious = detect_dga_domains(test_domains)
```

---

## 七、机器学习在异常检测中的应用

### 7.1 监督学习 vs 无监督学习

| 方法 | 说明 | 安全应用 | 优点 | 缺点 |
|:---|:---|:---|:---|:---|
| **监督学习** | 需要标注的训练数据（正常/异常标签） | 恶意软件分类、钓鱼邮件检测 | 准确率高 | 需要大量标注数据 |
| **无监督学习** | 不需要标签，自动发现异常模式 | 用户行为异常、网络异常 | 不需要标注 | 误报率较高 |
| **半监督学习** | 少量标注 + 大量无标注数据 | 结合两种优势 | 成本适中 | 复杂度高 |

### 7.2 常用 ML 算法及安全应用

| 算法 | 类型 | 安全应用场景 | 原理简述 |
|:---|:---|:---|:---|
| **Isolation Forest** | 无监督 | 异常检测 | 通过随机分区隔离异常点 |
| **LOF（局部异常因子）** | 无监督 | 异常登录、异常访问 | 比较局部密度 |
| **Autoencoder** | 无监督 | 网络流量异常 | 重构误差检测异常 |
| **Random Forest** | 监督 | 恶意软件分类 | 多棵决策树投票 |
| **XGBoost** | 监督 | 钓鱼 URL 检测 | 梯度提升决策树 |
| **LSTM** | 监督 | 攻击序列预测 | 长短期记忆网络 |
| **GNN（图神经网络）** | 半监督 | 横向移动检测 | 图结构上的深度学习 |

### 7.3 Autoencoder 异常检测实战

```python
import tensorflow as tf
from tensorflow import keras
import numpy as np

class AutoencoderAnomalyDetector:
    # 使用自编码器进行异常检测
    def __init__(self, input_dim, encoding_dim=16):
        self.input_dim = input_dim
        self.encoding_dim = encoding_dim
        self.model = self._build_model()
        self.threshold = None

    def _build_model(self):
        # 构建自编码器模型
        # 编码器
        input_layer = keras.layers.Input(shape=(self.input_dim,))
        encoded = keras.layers.Dense(64, activation='relu')(input_layer)
        encoded = keras.layers.Dense(32, activation='relu')(encoded)
        encoded = keras.layers.Dense(self.encoding_dim, activation='relu')(encoded)

        # 解码器
        decoded = keras.layers.Dense(32, activation='relu')(encoded)
        decoded = keras.layers.Dense(64, activation='relu')(decoded)
        decoded = keras.layers.Dense(self.input_dim, activation='sigmoid')(decoded)

        autoencoder = keras.Model(input_layer, decoded)
        autoencoder.compile(optimizer='adam', loss='mse')
        return autoencoder

    def train(self, normal_data, epochs=50, batch_size=32):
        # 使用正常数据训练自编码器
        self.model.fit(
            normal_data, normal_data,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=0.1,
            shuffle=True,
            verbose=0
        )

        # 计算重构误差阈值
        reconstructions = self.model.predict(normal_data, verbose=0)
        mse = np.mean(np.square(normal_data - reconstructions), axis=1)
        self.threshold = np.percentile(mse, 95)  # 95 分位数作为阈值
        print(f"Threshold set to {self.threshold:.6f}")

    def detect(self, data):
        # 检测异常数据点
        reconstructions = self.model.predict(data, verbose=0)
        mse = np.mean(np.square(data - reconstructions), axis=1)
        anomalies = mse > self.threshold
        return anomalies, mse
```

---

## 八、威胁狩猎方法论

### 8.1 威胁狩猎的核心理念

威胁狩猎（Threat Hunting）是主动搜索网络中隐藏威胁的过程，与被动等待告警的传统方式形成互补。

```
传统检测 vs 威胁狩猎：

传统检测（被动）：
  告警 → 分类 → 调查 → 响应
  ↑ 依赖规则，等威胁来找你

威胁狩猎（主动）：
  假设 → 调查 → 发现 → 检测规则化
  ↑ 基于假设，你去找威胁
```

### 8.2 威胁狩猎循环

```
┌─────────────────────────────────────────────┐
│              威胁狩猎循环                      │
│                                              │
│   ① 提出假设 ──────────────────┐              │
│   (Hypothesis)                │              │
│       │                       │              │
│       ▼                       │              │
│   ② 数据收集                   │              │
│   (Data Collection)           │              │
│       │                       │              │
│       ▼                       │              │
│   ③ 数据分析                   │              │
│   (Analysis)                  │              │
│       │                       │              │
│       ▼                       │              │
│   ④ 发现/未发现                │              │
│   (Finding)                   │              │
│       │                       │              │
│       ▼                       │              │
│   ⑤ 响应/自动化 ────────────────┘              │
│   (Response/Automation)                       │
│       │                                       │
│       ▼                                       │
│   ⑥ 经验教训 → 更新到 ① 的假设库               │
│   (Lessons Learned)                           │
└─────────────────────────────────────────────┘
```

### 8.3 常见狩猎假设

| 假设编号 | 假设描述 | 数据源 | 调查方法 |
|:---|:---|:---|:---|
| H1 | 攻击者使用 PowerShell 无文件攻击 | PowerShell 日志 (Event 4104) | 搜索编码命令、下载字符串 |
| H2 | 存在 DNS 隧道进行数据外泄 | DNS 查询日志 | 分析查询频率、域名长度、熵值 |
| H3 | 攻击者通过 RDP 横向移动 | Windows Event 4624 Type 10 | 搜索异常时间的 RDP 登录 |
| H4 | 存在计划任务持久化 | 计划任务日志、Sysmon Event 1 | 搜索非系统路径的 schtasks |
| H5 | 注册表被用于持久化 | Sysmon Event 13 | 搜索 Run/RunOnce 键的修改 |
| H6 | 攻击者窃取了 LSASS 凭证 | Sysmon Event 10 | 搜索访问 lsass.exe 的可疑进程 |
| H7 | 存在 WMI 横向移动 | WMI 活动日志 | 搜索远程 WMI 调用 |

---

## 九、ATT&CK 驱动的行为分析

### 9.1 ATT&CK 与行为分析的关系

MITRE ATT&CK 框架将攻击者行为分解为战术（Tactic）和技术（Technique），为行为分析提供了标准的分析框架：

```
ATT&CK 驱动的行为分析：

战术 → 行为分析重点
──────────────────────────────
Initial Access    → 异常登录、钓鱼邮件检测
Execution         → 可疑进程链、脚本执行检测
Persistence       → 计划任务、注册表 Run 键、服务创建
Privilege Escalation → 异常 token 操作、UAC 绕过
Defense Evasion   → 日志清除、进程注入、编码混淆
Credential Access → LSASS 访问、SAM 文件读取
Discovery         → 异常的系统信息收集命令
Lateral Movement  → 异常 SMB 连接、远程服务创建
Collection        → 大量文件访问、异常目录遍历
Command and Control → Beaconing 检测、DNS 异常
Exfiltration      → 异常出站流量、非标准端口通信
```

### 9.2 行为检测覆盖率矩阵

| ATT&CK 技术 | 检测数据源 | 检测方法 | 覆盖率 |
|:---|:---|:---|:---:|
| T1059.001 (PowerShell) | PowerShell 日志 (4104) | 内容关键字 + 行为异常 | 高 |
| T1003.001 (LSASS Dump) | Sysmon Event 10 | 进程访问 lsass.exe | 高 |
| T1071.001 (Web C2) | 代理日志 + NetFlow | Beaconing 检测 | 中 |
| T1055 (Process Injection) | Sysmon Event 8 | 远程线程创建 | 中 |
| T1098 (Account Manipulation) | AD 审计日志 | 账户变更事件 | 高 |
| T1562.002 (Disable Logging) | Auditd/Sysmon | 审计进程终止 | 高 |
| T1027 (Obfuscated Files) | 文件扫描 + 熵值分析 | 高熵值文件检测 | 中 |

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | UEBA 全称与定义 | ★★★★★ | 低 | User and Entity Behavior Analytics，用户实体行为分析 |
| 2 | 异常检测三大挑战 | ★★★★☆ | 中 | 基线动态性、攻击者适应性、误报代价 |
| 3 | Z-Score 与 MAD 区别 | ★★★☆☆ | 高 | Z-Score 受异常值影响，MAD 鲁棒性更好 |
| 4 | Beaconing 检测指标 | ★★★★☆ | 中 | 低抖动（jitter < 0.15）+ 规律间隔 |
| 5 | DGA 域名检测特征 | ★★★★☆ | 中 | 高熵值、长域名、低元音比例、NXDOMAIN |
| 6 | 威胁狩猎循环步骤 | ★★★☆☆ | 中 | 假设→收集→分析→发现→响应→教训 |
| 7 | ATT&CK 与行为分析 | ★★★★☆ | 中 | 以 ATT&CK 技术为指导设计检测规则 |
| 8 | 监督 vs 无监督学习 | ★★★☆☆ | 中 | 监督需标注数据，无监督无需标注但误报高 |

### 💡 知识巧记口诀

> **"UEBA 三人行：用户、实体、对等"** — UEBA 三大分析维度：用户行为、实体行为、对等分析
>
> **"心跳规律低抖动，C2 Beaconing 显原形"** — C2 通信特征：规律性心跳 + 低抖动（jitter）
>
> **"熵高域长元音少，DGA 域名跑不了"** — DGA 检测三要素：高熵值、长域名、低元音
>
> **"假设-收集-分析-发现-响应-教训，六步狩猎循环"** — 威胁狩猎的六个步骤
>
> **"Isolation Forest 分得开，Autoencoder 重构差"** — 两种常用异常检测算法原理

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "异常行为分析可以替代签名检测" | ❌ 错误！两者互补。签名检测对已知攻击准确率高，异常分析补充未知威胁检测 |
| "UEBA 需要大量历史数据才能开始工作" | ⚠️ 部分正确！需要 2-4 周建立基线，但基于规则的部分可以立即生效 |
| "机器学习模型训练一次就够了" | ❌ 错误！行为模式会随时间变化，模型需要定期更新以适应用户和业务的变化 |
| "只要检测到异常就是攻击" | ❌ 错误！异常不等于攻击，可能是业务变更、系统升级等正常操作导致 |
| "威胁狩猎就是随机翻看日志" | ❌ 错误！威胁狩猎是基于假设的结构化调查过程，不是随机探索 |

---

## 学习建议

1. 🧪 **实践异常检测算法**：用 Python 实现 Z-Score、MAD、Isolation Forest 三种算法，在同一数据集上对比效果
2. 📊 **分析自己的行为数据**：导出自己的登录记录、VPN 日志，建立个人行为基线，观察是否有异常
3. 🔍 **使用 Elastic Security 的异常检测功能**：在 ELK Stack 中启用 Machine Learning 功能，测试异常检测任务
4. 🎯 **进行一次威胁狩猎练习**：基于 ATT&CK 技术选择一个假设，在自己的实验环境中验证
5. 📖 **阅读 MITRE ATT&CK 的检测建议**：每个 ATT&CK 技术页面都有"检测"章节，了解针对每项技术的检测方法
6. 🧠 **理解算法背后的数学原理**：不只会调用 sklearn，要理解 Z-Score、MAD、Isolation Forest 的数学原理

---

> **行为分析不是魔法，而是统计学和领域知识的结合。最好的异常检测分析师，既懂数学又懂攻击——知道"正常"是什么样，才能看出"异常"在哪里。**
""")

print("Day 5 done")

# ============================================================
# Day 6: 事件分类与分级
# ============================================================
gen('day-6.md', r"""# Day 6：事件分类与分级

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：45 分钟
>
> 安全事件分类与分级是安全运营的基础工作。正确的事件分类决定了响应优先级、资源分配和升级路径。本章从事件分类标准、严重级别定义、分类框架对比到实战分类案例，完整讲解安全事件管理的方法论，其中事件分类标准是 CISP 考试的高频考点。

---

## 导航目录

- [一、事件分类的重要性与原则](#一事件分类的重要性与原则)
- [二、主流事件分类框架](#二主流事件分类框架)
- [三、事件严重级别定义体系](#三事件严重级别定义体系)
- [四、事件分类实战流程](#四事件分类实战流程)
- [五、常见安全事件类型详解](#五常见安全事件类型详解)
- [六、事件分类的自动化实现](#六事件分类的自动化实现)
- [七、事件升级矩阵设计](#七事件升级矩阵设计)
- [八、事件分类与合规映射](#八事件分类与合规映射)
- [九、事件分类质量评估](#九事件分类质量评估)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、事件分类的重要性与原则

### 1.1 为什么需要事件分类

安全事件分类是整个安全运营体系的"路由系统"。没有统一分类，就会导致：

| 问题 | 具体表现 | 后果 |
|:---|:---|:---|
| **优先级混乱** | 低危告警占用大量分析资源 | 真正的高危事件被延误 |
| **统计失真** | 无法准确统计各类事件的数量和趋势 | 安全态势评估失真 |
| **响应错位** | 错误类型的团队处理错误类型的事件 | 响应效率低下 |
| **合规风险** | 无法按要求上报特定类型的安全事件 | 违反监管要求 |
| **知识沉淀困难** | 同类事件无法有效归档和复用经验 | 经验无法传承 |

> **🔑 高分考点**：事件分类的核心原则是 **"一致性、完备性、互斥性"**——同一类型的事件应归入同一类别，分类体系应覆盖所有可能的事件类型，不同类别之间不应有重叠。

### 1.2 事件分类的四大维度

```
事件分类四维模型：

        事件来源 (Source)
        ├── 网络设备告警
        ├── 终端安全告警
        ├── 用户报告
        └── 第三方通报
             │
    ┌────────┼────────┐
    │        │        │
事件类型    严重级别    影响范围
(Type)    (Severity) (Scope)
    │        │        │
    ├── 恶意软件  ├── P1  ├── 单台终端
    ├── 入侵     ├── P2  ├── 部门级
    ├── DDoS    ├── P3  ├── 公司级
    ├── 数据泄露 ├── P4  └── 外部影响
    └── 策略违规 └── P5
```

---

## 二、主流事件分类框架

### 2.1 NIST SP 800-61 事件分类

NIST（美国国家标准与技术研究院）在 SP 800-61《计算机安全事件处理指南》中定义了经典的事件分类：

| 类别 | 子类 | 典型事件 |
|:---|:---|:---|
| **外部/移除介质攻击** | 恶意软件通过 USB/CD/DVD 传播 | BadUSB 攻击、感染 U 盘 |
| **消耗资源攻击** | 暴力破解、撞库 | SSH 暴力破解、Web 登录爆破 |
| **欺骗攻击** | 冒充、伪造 | IP 欺骗、ARP 欺骗、钓鱼邮件 |
| **信息收集** | 扫描、嗅探、社会工程 | Nmap 扫描、DNS 区域传输、社工电话 |
| **入侵尝试** | 漏洞利用尝试（未成功） | Web 漏洞扫描、SQL 注入探测 |
| **入侵成功** | 攻击者获得访问权限 | WebShell 上传、提权成功、横向移动 |
| **恶意代码** | 病毒、蠕虫、木马、勒索软件 | WannaCry (2017)、NotPetya (2017) |
| **拒绝服务** | DDoS/DoS 攻击 | SYN Flood、HTTP Flood、DNS Amplification |
| **不当使用** | 违反可接受使用策略 | P2P 下载、挖矿、非授权服务 |
| **复合事件** | 多种类型组合 | APT 攻击（钓鱼+恶意软件+横向移动+数据外泄） |

### 2.2 等保 2.0 事件分类

中国等保 2.0 标准（GB/T 22239-2019）对安全事件分类有自己的体系：

| 事件类型 | 描述 | 等保要求 |
|:---|:---|:---|
| **有害程序事件** | 病毒、蠕虫、木马、僵尸网络 | 应能检测和防范 |
| **网络攻击事件** | DoS、漏洞利用、SQL 注入、XSS | 应在边界和主机层面防护 |
| **信息破坏事件** | 数据篡改、数据泄露、数据丢失 | 应加密存储、审计访问 |
| **信息内容安全事件** | 发布违规信息 | 应具备内容过滤能力 |
| **设备设施故障** | 硬件故障、电力中断 | 应具备冗余和灾备 |
| **灾难性事件** | 自然灾害、火灾 | 应制定业务连续性计划 |

### 2.3 VERIS 框架（事件记录标准）

VERIS（Vocabulary for Event Recording and Incident Sharing）是 Verizon DBIR 报告使用的标准化事件描述框架，使用 A⁴ 模型：

```
VERIS A⁴ 模型：
┌──────────────────────────────────────────┐
│ Agent（威胁主体）→ Action（行为）         │
│ → Asset（资产）→ Attribute（属性影响）    │
└──────────────────────────────────────────┘

Agent 分类：
  - External（外部攻击者）
  - Internal（内部人员）
  - Partner（合作伙伴）

Action 分类：
  - Malware（恶意软件）
  - Hacking（入侵）
  - Social（社会工程）
  - Misuse（权限滥用）
  - Physical（物理攻击）
  - Error（人为错误）
  - Environmental（环境因素）

Asset 分类：
  - Server（服务器）
  - User Device（用户终端）
  - Network（网络设备）
  - Person（人员）
  - Media（介质）

Attribute 分类：
  - Confidentiality（机密性受损）
  - Integrity（完整性受损）
  - Availability（可用性受损）
```

---

## 三、事件严重级别定义体系

### 3.1 五级严重度模型

| 级别 | 名称 | 定义 | 响应时间 | 典型事件 |
|:---:|:---|:---|:---:|:---|
| **P1** | 紧急 (Critical) | 核心业务中断、大规模数据泄露、勒索软件爆发 | 15 分钟 | 核心数据库被加密、客户数据泄露 |
| **P2** | 高危 (High) | 服务器被入侵、权限提升成功、C2 通信确认 | 30 分钟 | WebShell 上传、域控制器异常 |
| **P3** | 中危 (Medium) | 攻击尝试、恶意软件检测（未执行）、策略违规 | 4 小时 | 端口扫描、暴力破解、可疑文件下载 |
| **P4** | 低危 (Low) | 信息收集、异常但非恶意的行为 | 24 小时 | 信息泄露（非敏感）、过期证书 |
| **P5** | 信息 (Informational) | 正常安全事件，无需处置 | 无需响应 | 正常登录、允许的流量 |

### 3.2 严重度评估矩阵

评估事件严重级别时，需要考虑以下因素：

| 评估因子 | 权重 | 评估问题 |
|:---|:---:|:---|
| **影响范围** | 30% | 影响了多少资产？核心业务是否受影响？ |
| **数据敏感性** | 25% | 涉及的数据是什么级别？（公开/内部/机密/绝密） |
| **攻击进展** | 20% | 攻击处于哪个阶段？（探测/入侵/提权/横向移动/数据外泄） |
| **资产重要性** | 15% | 受影响的资产 C-I-A 评级？ |
| **可恢复性** | 10% | 是否可以从备份恢复？恢复需要多长时间？ |

**严重度计算示例**：

```
事件：Web 服务器发现 WebShell
- 影响范围：单台服务器（15分）
- 数据敏感性：该服务器可访问客户数据库（25分）
- 攻击进展：已上传后门，但未发现进一步活动（12分）
- 资产重要性：核心业务 Web 服务器（15分）
- 可恢复性：有备份，2 小时可恢复（5分）

总分：72 → P2（高危，30 分钟响应）
```

---

## 四、事件分类实战流程

### 4.1 Tier 1 分析师分类决策树

```
收到告警
    │
    ▼
┌─────────────────┐
│ 1. 是否为误报？   │──是──→ 关闭告警，记录误报原因
└────────┬────────┘
         │否
         ▼
┌─────────────────┐
│ 2. 判断事件类型   │
│ - 恶意软件？      │──→ 恶意软件处理流程
│ - 入侵尝试？      │──→ 入侵分析流程
│ - DoS/DDoS？    │──→ DoS 响应流程
│ - 数据泄露？      │──→ 数据泄露响应流程
│ - 策略违规？      │──→ 策略违规处理流程
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. 评估严重级别   │
│ (P1-P5)         │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   P1/P2     P3/P4/P5
    │         │
    ▼         ▼
 立即升级   创建工单
 通知管理层 排入队列
```

### 4.2 事件分类标签体系

一个好的事件分类系统应支持多标签：

```
事件 #INC-2024-001234 的标签示例：
┌─────────────────────────────────────┐
│ 类型：入侵尝试                        │
│ 子类：Web 攻击 / SQL 注入             │
│ 严重级别：P3（中危）                   │
│ 来源：WAF 告警                        │
│ 目标：CRM 系统 (10.1.2.100)           │
│ ATT&CK：T1190 (Exploit Public-Facing App) │
│ CVE：CVE-2023-34362 (MOVEit SQLi)   │
│ 影响范围：单台服务器                    │
│ 状态：调查中                          │
│ 分配：Tier 2 - 张三                   │
└─────────────────────────────────────┘
```

---

## 五、常见安全事件类型详解

### 5.1 恶意软件事件

| 子类型 | 典型特征 | 响应优先级 | 经典案例 |
|:---|:---|:---:|:---|
| **勒索软件** | 文件被加密、出现勒索信 | P1 | WannaCry (2017, 利用 EternalBlue CVE-2017-0144) |
| **挖矿木马** | CPU 使用率高、异常网络连接 | P2 | Outlaw 挖矿团伙（利用 SSH 弱口令传播） |
| **远控木马 (RAT)** | 异常进程、C2 通信 | P2 | PlugX、Poison Ivy、Cobalt Strike Beacon |
| **蠕虫** | 快速横向传播、网络扫描 | P1 | Conficker (2008, 利用 MS08-067) |
| **下载器 (Dropper)** | 下载并执行第二阶段载荷 | P2 | Emotet 通过恶意宏传播 |
| **无文件恶意软件** | 仅存在于内存、不落盘 | P2 | PowerShell Empire、Cobalt Strike |

**勒索软件应急响应要点**：

```bash
# 1. 立即隔离感染主机（断网）
# 物理拔网线 或
netsh interface set interface "Ethernet" admin=disable

# 2. 检查勒索信（通常包含攻击者联系方式）
# 常见勒索信文件：README.txt, HELP_DECRYPT.txt, _readme.txt

# 3. 识别勒索软件家族
# 检查文件扩展名变化：
#   .wncry → WannaCry
#   .encrypted → LockBit
#   .xxx → Rapid

# 4. 检查是否有已知的解密工具
# No More Ransom 项目：https://www.nomoreransom.org/

# 5. 从备份恢复（如果有未感染的备份）
# 6. 溯源感染途径（钓鱼邮件？RDP 弱口令？漏洞利用？）
```

### 5.2 网络入侵事件

| 攻击阶段 | 检测方法 | 关键数据源 |
|:---|:---|:---|
| **初始入侵** | 漏洞利用特征、异常 URL 访问 | WAF 日志、Web 服务器日志 |
| **命令执行** | 可疑进程创建 | Sysmon Event 1、Windows Event 4688 |
| **权限提升** | 异常 token 操作、UAC 绕过 | Windows Security Log |
| **持久化** | 计划任务、服务、注册表 | Sysmon Event 11/13、Autoruns |
| **横向移动** | SMB/WMI/PsExec/WinRM 连接 | Sysmon Event 3、NetFlow |
| **数据收集** | 大量文件访问 | 文件审计日志 |
| **数据外泄** | 异常出站流量 | 代理日志、NetFlow、DLP |

---

## 六、事件分类的自动化实现

### 6.1 基于规则的事件自动分类

```python
class EventClassifier:
    # 安全事件自动分类器
    # 分类规则（按优先级从高到低）
    CLASSIFICATION_RULES = [
        {
            'type': 'Ransomware',
            'severity': 'P1',
            'rules': [
                {'field': 'alert.signature', 'contains': ['ransomware', 'encrypt', 'ransom']},
                {'field': 'file.extension', 'in': ['.wncry', '.encrypted', '.lockbit']},
                {'field': 'process.command_line', 'contains': ['vssadmin delete shadows', 'cipher /w']},
            ],
            'match': 'any'  # 任一规则匹配即可
        },
        {
            'type': 'Web_Attack',
            'severity': 'P2',
            'rules': [
                {'field': 'alert.category', 'equals': 'web_attack'},
                {'field': 'url.original', 'regex': r'(union.*select|or\s+1=1|<script>|\.\./\.\./)'},
                {'field': 'http.response.status_code', 'equals': '200'},
            ],
            'match': 'all'
        },
        {
            'type': 'Brute_Force',
            'severity': 'P3',
            'rules': [
                {'field': 'event.action', 'contains': ['login', 'auth']},
                {'field': 'event.outcome', 'equals': 'failure'},
                {'aggregation': {'field': 'source.ip', 'count': '>10', 'window': '5m'}},
            ],
            'match': 'all'
        },
        {
            'type': 'C2_Communication',
            'severity': 'P2',
            'rules': [
                {'field': 'network.direction', 'equals': 'outbound'},
                {'field': 'destination.ip.reputation', 'equals': 'malicious'},
                {'field': 'network.beaconing', 'equals': True},
            ],
            'match': 'all'
        },
        {
            'type': 'Policy_Violation',
            'severity': 'P4',
            'rules': [
                {'field': 'event.category', 'equals': 'policy'},
            ],
            'match': 'any'
        },
    ]

    def classify(self, event):
        # 对事件进行分类
        for rule_set in self.CLASSIFICATION_RULES:
            if self._evaluate_rules(event, rule_set):
                return {
                    'type': rule_set['type'],
                    'severity': rule_set['severity'],
                    'classified_by': 'auto_classifier_v1'
                }
        # 默认分类
        return {
            'type': 'Unclassified',
            'severity': 'P4',
            'classified_by': 'auto_classifier_v1'
        }

    def _evaluate_rules(self, event, rule_set):
        # 评估规则集
        results = []
        for rule in rule_set['rules']:
            if 'aggregation' in rule:
                # 需要聚合计算的规则
                results.append(self._check_aggregation(event, rule))
            else:
                results.append(self._check_simple_rule(event, rule))

        if rule_set['match'] == 'any':
            return any(results)
        else:  # 'all'
            return all(results)

    def _check_simple_rule(self, event, rule):
        # 检查简单规则
        value = self._get_nested_field(event, rule['field'])
        if value is None:
            return False
        if 'contains' in rule:
            return any(s.lower() in str(value).lower() for s in rule['contains'])
        if 'equals' in rule:
            return str(value) == str(rule['equals'])
        if 'regex' in rule:
            import re
            return bool(re.search(rule['regex'], str(value), re.IGNORECASE))
        if 'in' in rule:
            return str(value) in rule['in']
        return False

    def _check_aggregation(self, event, rule):
        # 检查聚合规则（简化实现）
        # 实际环境中需要查询 SIEM 的聚合数据
        return True  # 简化处理

    def _get_nested_field(self, obj, field_path):
        # 获取嵌套字段值
        keys = field_path.split('.')
        for key in keys:
            if isinstance(obj, dict):
                obj = obj.get(key)
            else:
                return None
        return obj
```

### 6.2 SOAR 剧本中的自动分类

```yaml
# Splunk Phantom Playbook: 自动事件分类
name: Auto Classify Security Events
description: 自动对新告警进行分类和严重级别判定
playbook:
  - action: filter
    name: filter_new_alerts
    conditions:
      - field: status
        operator: equals
        value: new

  - action: decision
    name: classify_severity
    conditions:
      - condition: alert.severity == "critical" or alert.risk_score > 80
        actions:
          - set_severity: P1
          - notify_soc_manager
          - create_jira_ticket:
              priority: Critical
              assignee: soc_tier2

      - condition: alert.severity == "high" or alert.risk_score > 60
        actions:
          - set_severity: P2
          - create_jira_ticket:
              priority: High
              assignee: soc_tier2

      - condition: alert.severity == "medium" or alert.risk_score > 30
        actions:
          - set_severity: P3
          - create_jira_ticket:
              priority: Medium
              assignee: soc_tier1

      - default:
        actions:
          - set_severity: P4
          - auto_close_with_note: "Low severity, auto-closed"

  - action: enrich
    name: enrich_event
    tasks:
      - query_threat_intel:
          indicators:
            - source.ip
            - destination.ip
            - file.hash
      - query_asset_db:
          fields:
            - asset.owner
            - asset.criticality
      - query_geoip:
          ip_field: source.ip

  - action: post_process
    name: update_alert
    tasks:
      - update_status: in_progress
      - add_tags:
          - auto_classified
          - enriched
```

---

## 七、事件升级矩阵设计

### 7.1 标准升级矩阵

| 事件级别 | 首次响应 | 30分钟 | 2小时 | 8小时 | 24小时 |
|:---|:---|:---|:---|:---|:---|
| **P1** | Tier 1 → Tier 2 | → SOC 经理 | → CISO | → CEO | → 董事会 |
| **P2** | Tier 1 → Tier 2 | Tier 2 继续 | → SOC 经理 | → CISO | — |
| **P3** | Tier 1 | Tier 1 继续 | → Tier 2 | → SOC 经理 | — |
| **P4** | Tier 1 | — | — | → Tier 2 | → SOC 经理 |
| **P5** | 自动关闭 | — | — | — | — |

### 7.2 升级触发条件

| 触发条件 | 说明 | 动作 |
|:---|:---|:---|
| **时间超时** | 在 SLA 时间内未完成处置 | 自动升级到上一级 |
| **范围扩大** | 事件影响范围从单台扩大到多台 | 提升严重级别 |
| **新发现** | 调查中发现更严重的攻击行为 | 重新定级 |
| **外部通知** | 媒体、客户、监管机构知晓 | 升级到最高级别 |
| **数据泄露确认** | 确认敏感数据已被外泄 | 升级到 P1/P2 |

---

## 八、事件分类与合规映射

### 8.1 各法规对事件上报的要求

| 法规 | 上报时限 | 上报对象 | 触发条件 |
|:---|:---|:---|:---|
| **网络安全法** | 立即 | 网信办、公安 | 发生网络安全事件 |
| **等保 2.0** | 按规定 | 行业主管部门 | 重大安全事件 |
| **GDPR** | 72 小时内 | 数据保护机构 (DPA) | 个人数据泄露 |
| **PCI DSS** | 立即 | 发卡机构 | 持卡人数据泄露 |
| **HIPAA** | 60 天内 | 受影响个人 + HHS | 受保护健康信息泄露 |

### 8.2 事件分类与法规映射表

| 事件类型 | 网络安全法 | 等保 2.0 | GDPR | PCI DSS |
|:---|:---:|:---:|:---:|:---:|
| 个人信息泄露 > 10 万条 | ✓ 报告 | ✓ 报告 | ✓ 72h 报告 | — |
| 核心系统被入侵 | ✓ 报告 | ✓ 报告 | — | — |
| 支付卡数据泄露 | ✓ 报告 | — | ✓ 72h 报告 | ✓ 立即报告 |
| DDoS 导致服务中断 > 2h | ✓ 报告 | ✓ 报告 | — | — |
| 勒索软件感染 | ✓ 报告 | ✓ 报告 | 可能需报告 | — |

---

## 九、事件分类质量评估

### 9.1 分类质量指标

| 指标 | 计算方式 | 目标值 |
|:---|:---|:---|
| **分类准确率** | 正确分类事件数 / 总事件数 | > 95% |
| **分类一致性** | 不同分析师对同一事件分类的一致率 | > 90% |
| **重分类率** | 需要重新分类的事件比例 | < 5% |
| **平均分类时间** | 从告警产生到分类完成的平均时间 | < 10 分钟 |
| **自动分类覆盖率** | 自动分类事件占比 | > 70% |

### 9.2 分类质量控制

```python
def evaluate_classification_quality(events):
    # 评估事件分类质量
    metrics = {
        'total': len(events),
        'auto_classified': 0,
        'reclassified': 0,
        'correct': 0,
        'incorrect': 0,
    }

    for event in events:
        if event.get('classified_by') == 'auto_classifier':
            metrics['auto_classified'] += 1
        if event.get('reclassified', False):
            metrics['reclassified'] += 1
        if event.get('classification_correct', False):
            metrics['correct'] += 1
        else:
            metrics['incorrect'] += 1

    metrics['accuracy'] = metrics['correct'] / metrics['total']
    metrics['auto_rate'] = metrics['auto_classified'] / metrics['total']
    metrics['reclassify_rate'] = metrics['reclassified'] / metrics['total']

    return metrics
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | 事件分类三原则 | ★★★★☆ | 低 | 一致性、完备性、互斥性 |
| 2 | NIST 事件分类 | ★★★★★ | 中 | 恶意代码、入侵、DoS、不当使用等 |
| 3 | 五级严重度模型 | ★★★★★ | 低 | P1 紧急、P2 高危、P3 中危、P4 低危、P5 信息 |
| 4 | VERIS A⁴ 模型 | ★★★☆☆ | 中 | Agent→Action→Asset→Attribute |
| 5 | 等保事件分类 | ★★★★☆ | 中 | 有害程序、网络攻击、信息破坏、内容安全、设备故障、灾难 |
| 6 | GDPR 上报时限 | ★★★★☆ | 低 | 72 小时内 |
| 7 | 升级矩阵设计 | ★★★☆☆ | 中 | 基于时间和影响范围的双维度升级 |
| 8 | P1 事件响应时间 | ★★★★☆ | 低 | 15 分钟 |

### 💡 知识巧记口诀

> **"一致完备又互斥，三类原则记心中"** — 事件分类三原则：一致性、完备性、互斥性
>
> **"NIST 分六类：恶意入侵拒绝不当，信息收集和复合"** — NIST 六大事件类别
>
> **"P1 到 P5，紧急到信息"** — 严重级别从 P1（最严重）到 P5（最轻）
>
> **"GDPR 七十二小时，数据泄露必上报"** — GDPR 要求 72 小时内报告个人数据泄露
>
> **"VERIS 四个 A：谁干的、干了啥、影响了啥资产、损害了啥属性"** — VERIS A⁴ 模型

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "事件分类是一次性的" | ❌ 错误！分类可能随着调查深入而改变（如 P3 升级为 P2） |
| "所有告警都是安全事件" | ❌ 错误！告警（Alert）不等于事件（Incident），告警需要经过确认才能升级为事件 |
| "分类只需要看攻击类型" | ❌ 错误！还需要考虑影响范围、资产重要性、数据敏感性等多个维度 |
| "P4/P5 事件不需要记录" | ❌ 错误！所有事件都需要记录，用于趋势分析和统计 |
| "自动分类可以完全替代人工分类" | ❌ 错误！自动分类是初步判断，复杂事件仍需人工确认 |

---

## 学习建议

1. 📋 **建立自己的分类标准**：参考 NIST 和等保标准，为你所在组织建立一套事件分类标准
2. 🏷️ **实践事件分类**：选取 20 个真实的安全告警，练习分类和定级
3. 🔄 **设计升级矩阵**：为你的组织设计一套事件升级矩阵，明确各层级的响应时限
4. 🤖 **实现自动分类脚本**：用 Python 实现一个简单的事件自动分类器
5. 📊 **分析分类质量**：统计近 3 个月的事件分类数据，评估分类准确率
6. 📖 **阅读 NIST SP 800-61**：了解国际标准的事件分类和处理方法

---

> **准确的事件分类是高效安全运营的基石。分类错了，后面的所有响应都可能走错方向。花时间做好分类，就是为整个 SOC 节约时间。**
""")

print("Day 6 done")

# ============================================================
# Day 7: 应急响应PDCERF
# ============================================================
gen('day-7.md', r"""# Day 7：应急响应PDCERF

> **📘 文档定位**：CISP 考试核心基础 | 难度：中高级 | 预计阅读：55 分钟
>
> PDCERF 是中国网络安全应急响应的标准模型，也是 CISP 考试中分值最高的考点之一。本章从模型六大阶段逐一拆解，配合真实案例和实战工具，确保读者能够熟练掌握每个阶段的要点和操作流程。

---

## 导航目录

- [一、PDCERF 模型概述](#一pdcerf-模型概述)
- [二、准备阶段详解](#二准备阶段详解)
- [三、检测阶段详解](#三检测阶段详解)
- [四、遏制阶段详解](#四遏制阶段详解)
- [五、根除阶段详解](#五根除阶段详解)
- [六、恢复阶段详解](#六恢复阶段详解)
- [七、跟踪阶段详解](#七跟踪阶段详解)
- [八、PDCERF 与 PICERL 对比](#八pdcerf-与-picerl-对比)
- [九、应急响应实战案例](#九应急响应实战案例)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、PDCERF 模型概述

### 1.1 PDCERF 六大阶段

PDCERF 是中国信息安全应急响应的标准模型，由六个阶段组成：

```
PDCERF 应急响应模型：

┌──────────────────────────────────────────────────────────┐
│  P (Preparation)  →  D (Detection)  →  C (Containment)  │
│      准备                 检测                遏制         │
│       │                    │                   │          │
│       ▼                    ▼                   ▼          │
│  E (Eradication)  →  R (Recovery)  →  F (Follow-up)     │
│      根除                恢复               跟踪          │
└──────────────────────────────────────────────────────────┘
```

> **🔑 高分考点**：PDCERF 六个阶段是 **P-准备、D-检测、C-遏制、E-根除、R-恢复、F-跟踪**。考试必考，必须按顺序记住。

### 1.2 各阶段核心任务

| 阶段 | 英文 | 核心任务 | 关键产出物 |
|:---|:---|:---|:---|
| **准备** | Preparation | 建立应急组织、制定预案、准备工具、培训演练 | 应急预案、应急工具包、通讯录 |
| **检测** | Detection | 发现安全事件、确认事件真实性、初步定级 | 事件报告、初步分析 |
| **遏制** | Containment | 阻止事态扩大、隔离受影响系统、保护证据 | 遏制措施记录 |
| **根除** | Eradication | 清除恶意代码、修复漏洞、消除攻击入口 | 根除操作记录 |
| **恢复** | Recovery | 恢复系统到正常状态、验证安全性 | 恢复验证报告 |
| **跟踪** | Follow-up | 复盘总结、改进措施、知识沉淀 | 事件总结报告 (AAR) |

### 1.3 PDCERF 与应急响应生命周期

```
持续改进循环：

    ┌──────────┐
    │  准备(P)  │ ←── 从跟踪阶段的教训中更新准备
    └────┬─────┘
         │
    ┌────▼─────┐
    │  检测(D)  │
    └────┬─────┘
         │
    ┌────▼─────┐
    │  遏制(C)  │
    └────┬─────┘
         │
    ┌────▼─────┐
    │  根除(E)  │
    └────┬─────┘
         │
    ┌────▼─────┐
    │  恢复(R)  │
    └────┬─────┘
         │
    ┌────▼─────┐
    │  跟踪(F)  │ ──→ 反馈到准备阶段
    └──────────┘
```

---

## 二、准备阶段详解

### 2.1 应急响应组织架构

```
应急响应组织结构：

                    应急领导小组
                    (CISO/CIO)
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    应急响应组长      技术负责人       联络协调人
    (SOC Manager)   (Tech Lead)    (PR/Legal)
         │               │               │
    ┌────┴────┐    ┌─────┴─────┐    ┌────┴────┐
    │Tier 1  │    │网络应急组  │    │法务     │
    │Tier 2  │    │系统应急组  │    │公关     │
    │Tier 3  │    │应用应急组  │    │合规     │
    └────────┘    └───────────┘    └────────┘
```

### 2.2 应急预案编制

应急预案应包含以下核心内容：

| 章节 | 内容 | 示例 |
|:---|:---|:---|
| **总则** | 编制目的、依据、适用范围 | 依据《网络安全法》、等保 2.0 |
| **组织架构** | 应急小组构成、职责、联系方式 | 7×24 值班电话：138-xxxx-xxxx |
| **事件分类分级** | 事件类型定义、级别标准 | P1-P5 定义及响应时限 |
| **响应流程** | PDCERF 各阶段操作步骤 | 具体到每个阶段的 SOP |
| **资源保障** | 人员、工具、备件、预算 | 应急工具箱清单 |
| **培训演练** | 演练计划、频率、考核 | 每年至少 2 次红蓝对抗演练 |
| **附则** | 预案更新、生效日期 | 每年评审一次 |

### 2.3 应急工具箱

```bash
# 应急响应随身 U 盘应包含的工具
应急工具箱清单：

取证类：
  - FTK Imager (磁盘镜像)
  - Volatility (内存取证)
  - Wireshark (网络分析)
  - NetworkMiner (网络取证)

分析类：
  - Process Explorer (进程分析)
  - Autoruns (启动项分析)
  - TCPView (网络连接分析)
  - ProcMon (进程监控)

检测类：
  - Sysinternals Suite
  - YARA (恶意软件规则匹配)
  - ClamAV (病毒扫描)

清除类：
  - Malwarebytes
  - Kaspersky Virus Removal Tool

工具脚本：
  - 日志收集脚本 (收集 Windows Event、Linux logs)
  - 进程树导出脚本
  - 网络连接快照脚本
```

### 2.4 战前演练

| 演练类型 | 描述 | 频率 | 参与人员 |
|:---|:---|:---|:---|
| **桌面推演** | 围绕假设场景进行讨论式演练 | 每季度 | 核心应急团队 |
| **功能演练** | 针对特定环节（如遏制）的实操演练 | 每半年 | 技术团队 |
| **全面演练** | 全流程、全要素的实战演练 | 每年 | 全员参与 |
| **红蓝对抗** | 红队模拟攻击，蓝队检测响应 | 每半年 | 红蓝两队 |

---

## 三、检测阶段详解

### 3.1 事件发现渠道

| 渠道 | 典型来源 | 响应时间 | 可靠性 |
|:---|:---|:---:|:---:|
| **SIEM 告警** | Splunk/QRadar/Sentinel | 实时 | 中-高 |
| **EDR 告警** | CrowdStrike/Defender/SentinelOne | 实时 | 高 |
| **IDS/IPS 告警** | Snort/Suricata | 实时 | 中 |
| **用户报告** | 内部员工、客户 | 延迟 | 不定 |
| **外部通报** | CERT、公安部、厂商 | 延迟 | 高 |
| **主动发现** | 威胁狩猎、渗透测试 | — | 高 |

### 3.2 事件确认流程

```bash
# 事件确认检查清单

1. 验证告警的原始数据
   □ 查看原始日志/PACP
   □ 确认时间戳准确性
   □ 排除已知误报

2. 在受影响系统上收集信息
   # Linux
   ps auxf                    # 进程树
   netstat -antup             # 网络连接
   last -20                   # 登录历史
   find / -mtime -1 -ls       # 最近修改的文件

   # Windows
   netstat -ano | findstr ESTABLISHED   # 网络连接
   schtasks /query /fo LIST /v           # 计划任务
   reg query HKLM\Software\Microsoft\Windows\CurrentVersion\Run  # 启动项

3. 判断事件真实性
   □ 是否确认恶意行为？
   □ 是否影响业务？
   □ 是否需要启动应急响应？

4. 初步定级
   □ 评估影响范围
   □ 评估数据敏感性
   □ 确定 P1-P5 级别
```

### 3.3 初始证据收集

```bash
# Linux 系统初始证据收集脚本
#!/bin/bash
CASE_ID="IR-$(date +%Y%m%d-%H%M%S)"
EVIDENCE_DIR="/tmp/$CASE_ID"
mkdir -p $EVIDENCE_DIR

# 系统信息
uname -a > $EVIDENCE_DIR/system_info.txt
date >> $EVIDENCE_DIR/system_info.txt
uptime >> $EVIDENCE_DIR/system_info.txt

# 进程信息
ps auxf > $EVIDENCE_DIR/processes.txt
lsof > $EVIDENCE_DIR/open_files.txt

# 网络信息
netstat -antup > $EVIDENCE_DIR/network_connections.txt
ss -tuln > $EVIDENCE_DIR/listening_ports.txt
iptables -L -n -v > $EVIDENCE_DIR/iptables_rules.txt

# 用户信息
w > $EVIDENCE_DIR/logged_in_users.txt
last -50 > $EVIDENCE_DIR/login_history.txt
cat /etc/passwd > $EVIDENCE_DIR/passwd.txt
cat /etc/shadow > $EVIDENCE_DIR/shadow.txt

# 日志文件（只收集最近的行，避免文件过大）
tail -10000 /var/log/secure > $EVIDENCE_DIR/secure.log
tail -10000 /var/log/messages > $EVIDENCE_DIR/messages.log
tail -10000 /var/log/audit/audit.log > $EVIDENCE_DIR/audit.log

# 可疑文件
find / -type f -mtime -1 -size +1M 2>/dev/null > $EVIDENCE_DIR/recent_large_files.txt
find /tmp /var/tmp /dev/shm -type f 2>/dev/null > $EVIDENCE_DIR/temp_files.txt

# 打包证据
tar czf /tmp/${CASE_ID}.tar.gz $EVIDENCE_DIR
echo "Evidence collected: /tmp/${CASE_ID}.tar.gz"
```

---

## 四、遏制阶段详解

### 4.1 遏制策略分类

| 遏制类型 | 描述 | 适用场景 | 风险 |
|:---|:---|:---|:---|
| **网络隔离** | 将受感染主机从网络中断开 | 单台/少量主机感染 | 可能触发攻击者的"自毁"机制 |
| **VLAN 隔离** | 将受感染主机移到隔离 VLAN | 多台主机感染 | 配置复杂 |
| **ACL 阻断** | 在防火墙/路由器上阻断恶意 IP/端口 | 已知 C2 地址 | 攻击者可能更换 IP |
| **账户禁用** | 禁用被入侵的用户账户 | 账户被盗用 | 影响用户正常使用 |
| **服务暂停** | 暂停受影响的服务 | 服务被用于攻击 | 业务中断 |
| **全站断网** | 断开整个站点与互联网的连接 | 大规模勒索软件爆发 | 业务完全中断 |

### 4.2 遏制操作 SOP

```bash
# 遏制阶段操作步骤（以勒索软件为例）

# 步骤 1：立即通知
# - 通知 SOC 经理和 CISO
# - 通知受影响业务部门
# - 通知 IT 运维团队（准备恢复）

# 步骤 2：网络隔离
# 方案 A：交换机端口关闭（最彻底）
# 联系网络团队关闭受感染主机的交换机端口

# 方案 B：主机端网络禁用（应急）
# Windows
netsh interface set interface "Ethernet" admin=disable
# Linux
ip link set eth0 down

# 方案 C：防火墙 ACL（阻断横向移动）
# 在防火墙上添加规则
# 阻断 SMB (445)、RDP (3389)、WMI (135) 等横向移动常用端口
iptables -A INPUT -p tcp --dport 445 -j DROP
iptables -A INPUT -p tcp --dport 3389 -j DROP
iptables -A INPUT -p tcp --dport 135 -j DROP

# 步骤 3：保护证据
# 制作受感染主机的磁盘镜像（如可能）
# 收集内存镜像（使用 WinPmem 或 LiME）
# 保留恶意软件样本

# 步骤 4：防止扩散
# 强制重置所有用户密码
# 检查其他主机是否有类似感染迹象
# 在 EDR 中创建检测规则
```

### 4.3 遏制决策要点

> **🔑 高分考点**：遏制阶段需要在"阻止扩散"和"保护证据"之间取得平衡。有时为了收集攻击者信息（如 C2 地址），需要保持有限度的网络连接进行监控。这种策略称为"受控遏制"。

| 决策点 | 选项 A：立即隔离 | 选项 B：受控监控 |
|:---|:---|:---|
| **目的** | 最快速度阻止损害 | 收集攻击者信息 |
| **适用场景** | 勒索软件、数据外泄 | APT 攻击、需要溯源 |
| **风险** | 丢失溯源线索 | 攻击可能继续扩散 |
| **决定者** | SOC 经理 / CISO | CISO / 法务 |

---

## 五、根除阶段详解

### 5.1 根除操作清单

| 根除对象 | 操作 | 验证方法 |
|:---|:---|:---|
| **恶意进程** | 终止恶意进程及其子进程 | 重新检查进程列表 |
| **恶意文件** | 删除恶意可执行文件、脚本、WebShell | 文件哈希扫描 |
| **持久化机制** | 删除计划任务、服务、注册表 Run 键、启动文件夹 | Autoruns 扫描 |
| **后门账户** | 删除攻击者创建的账户 | 检查 /etc/passwd、AD 用户列表 |
| **漏洞** | 修补被利用的漏洞（打补丁、修改配置） | 漏洞扫描验证 |
| **横向移动痕迹** | 清除攻击者在其他主机上留下的后门 | 全网扫描 |

### 5.2 WebShell 清除实战

```bash
# WebShell 查找与清除

# 1. 查找最近修改的 PHP/JSP/ASPX 文件
find /var/www/html -name "*.php" -mtime -7 -ls
find /var/www/html -name "*.jsp" -mtime -7 -ls
find /var/www/html -name "*.aspx" -mtime -7 -ls

# 2. 搜索 WebShell 特征关键字
grep -r "eval(" /var/www/html --include="*.php"
grep -r "base64_decode" /var/www/html --include="*.php"
grep -r "shell_exec" /var/www/html --include="*.php"
grep -r "system(" /var/www/html --include="*.php"
grep -r "Runtime.getRuntime" /var/www/html --include="*.jsp"

# 3. 检查异常的大文件
find /var/www/html -type f -size +100k -name "*.php"

# 4. 使用 YARA 规则扫描 WebShell
yara -r webshell_rules.yar /var/www/html

# 5. 检查文件的 inode 创建时间（即使攻击者修改了 mtime）
stat /var/www/html/suspicious.php

# 6. 清除 WebShell 后：
# - 检查 Web 服务器日志，确定 WebShell 的上传途径
# - 修复文件上传漏洞
# - 重置所有 FTP/SSH 密码
# - 检查 crontab 中是否有后门任务
```

**常见 WebShell 文件名模式**：

```
常见 WebShell 伪装文件名：
  - config.php.bak
  - index.php.css
  - favicon.ico.php
  - .htaccess.php (隐藏文件)
  - wp-config.php.bak
  - error_log.php
  - shell.php (太明显了，但攻击者有时会用)
  - 1.php, a.php, x.php (简单的单字符名)
```

### 5.3 漏洞修复优先级

| 优先级 | 漏洞类型 | 修复时限 | 示例 |
|:---:|:---|:---|:---|
| **紧急** | 已被利用的漏洞、远程代码执行 | 48 小时内 | Log4Shell (CVE-2021-44228) |
| **高** | 可被轻易利用的漏洞、核心系统漏洞 | 1 周内 | ProxyShell (CVE-2021-34473) |
| **中** | 需要一定条件的漏洞 | 1 月内 | 本地提权漏洞 |
| **低** | 理论风险、信息泄露 | 按周期 | 版本信息泄露 |

---

## 六、恢复阶段详解

### 6.1 恢复策略

| 恢复方式 | 描述 | 适用场景 | 恢复时间 |
|:---|:---|:---|:---|
| **从备份恢复** | 使用未感染的备份数据恢复系统 | 数据被加密/破坏 | 小时级 |
| **系统重装** | 重新安装操作系统和应用 | 系统被深度感染 | 半天到一天 |
| **快照回滚** | 虚拟机快照回滚到感染前状态 | 虚拟化环境 | 分钟级 |
| **配置修复** | 修复被修改的配置 | 仅配置被篡改 | 分钟级 |
| **密码重置** | 全量重置受影响账户的密码 | 凭证泄露 | 小时级 |

### 6.2 恢复验证清单

```
恢复后验证清单：

□ 系统功能验证
  □ Web 服务正常访问
  □ 数据库正常读写
  □ API 接口正常响应
  □ 用户认证正常

□ 安全验证
  □ 漏洞扫描无高危漏洞
  □ 恶意软件扫描无检出
  □ EDR 代理正常运行
  □ 日志正常发送到 SIEM

□ 网络验证
  □ 防火墙规则恢复
  □ 网络连通性正常
  □ IDS/IPS 正常检测

□ 数据验证
  □ 关键数据完整
  □ 备份正常运行
  □ 数据一致性校验通过

□ 监控验证
  □ 监控告警已恢复
  □ 无异常告警产生
```

### 6.3 恢复时间目标 (RTO) 与恢复点目标 (RPO)

| 指标 | 定义 | 关键问题 | 典型值 |
|:---|:---|:---|:---|
| **RTO** | Recovery Time Objective（恢复时间目标） | 系统中断最多能容忍多长时间？ | 核心系统 4 小时，一般系统 24 小时 |
| **RPO** | Recovery Point Objective（恢复点目标） | 能容忍丢失多少数据？ | 核心系统 15 分钟，一般系统 24 小时 |

> **🔑 高分考点**：RTO 关注的是"时间"（多久恢复），RPO 关注的是"数据"（丢多少数据）。两者共同决定备份策略。

---

## 七、跟踪阶段详解

### 7.1 事件复盘 (AAR) 流程

```
After Action Review (AAR) 会议流程：

1. 事件概述（5分钟）
   - 事件时间线
   - 影响范围
   - 处置结果

2. 技术复盘（15分钟）
   - 攻击路径还原
   - 检测盲点分析
   - 工具效果评估

3. 流程复盘（10分钟）
   - 响应是否及时？
   - 升级是否顺畅？
   - 沟通是否有效？

4. 改进措施（15分钟）
   - 短期修复（1周内）
   - 中期改进（1月内）
   - 长期建设（1季度内）

5. 行动计划（10分钟）
   - 责任人
   - 截止日期
   - 验收标准
```

### 7.2 事件总结报告模板

```markdown
# 安全事件总结报告

## 基本信息
- 事件编号：IR-2024-001
- 事件级别：P2（高危）
- 发现时间：2024-06-15 08:30
- 遏制时间：2024-06-15 09:00
- 根除时间：2024-06-15 12:00
- 恢复时间：2024-06-15 14:00

## 事件概述
[简要描述事件]

## 攻击时间线
| 时间 | 事件 |
|:---|:---|
| 2024-06-15 02:00 | 攻击者扫描发现漏洞 |
| 2024-06-15 02:15 | 成功上传 WebShell |
| 2024-06-15 03:00 | 提权成功 |
| 2024-06-15 08:30 | SIEM 产生异常告警 |

## 根因分析
- 直接原因：未修补 CVE-2024-XXXX 漏洞
- 根本原因：漏洞管理流程未覆盖所有互联网资产

## 影响评估
- 受影响系统：3 台
- 数据泄露：无确认的数据泄露
- 业务中断：无

## 改进措施
| 编号 | 措施 | 责任人 | 截止日期 |
|:---|:---|:---|:---|
| 1 | 修补所有互联网资产的 CVE-2024-XXXX | 张三 | 2024-06-17 |
| 2 | 增加互联网资产发现频率（每周→每日） | 李四 | 2024-06-30 |
| 3 | 添加 WebShell 检测规则 | 王五 | 2024-06-20 |
```

### 7.3 知识库更新

```markdown
# 知识库条目：WebShell 应急响应

## 检测方法
1. 文件时间异常检测
2. WebShell 特征关键字扫描
3. 异常进程检测（Web 服务器进程执行了 cmd/bash）
4. 异常网络连接（Web 服务器连接了非业务 IP）

## 常用工具
- WebShellKiller、D盾、河马 WebShell 扫描器
- YARA 规则库

## 经验教训
- 2024-06-15 事件：WAF 未配置 WebShell 检测规则
- 建议：WAF 应启用文件上传后的恶意代码检测
```

---

## 八、PDCERF 与 PICERL 对比

### 8.1 PICERL 模型（SANS 模型）

SANS 提出的 PICERL 是国际上另一个常用的应急响应模型：

| 阶段 | PICERL | PDCERF | 差异 |
|:---|:---|:---|:---|
| 准备 | Preparation | Preparation (准备) | 相同 |
| 识别 | Identification | Detection (检测) | 名称不同，内容相近 |
| 遏制 | Containment | Containment (遏制) | 相同 |
| 根除 | Eradication | Eradication (根除) | 相同 |
| 恢复 | Recovery | Recovery (恢复) | 相同 |
| 经验总结 | Lessons Learned | Follow-up (跟踪) | 名称不同，内容相近 |

> **🔑 高分考点**：CISP 考试以 PDCERF 为准，但要知道 PICERL 的存在。两者核心思想一致，都是"准备→检测→遏制→根除→恢复→总结"的闭环。

### 8.2 其他应急响应模型

| 模型 | 来源 | 特点 |
|:---|:---|:---|
| **NIST SP 800-61** | NIST | 四阶段：准备→检测与分析→遏制、根除与恢复→事后活动 |
| **ISO/IEC 27035** | ISO | 五阶段：计划与准备→检测与报告→评估与决定→响应→总结 |
| **CERT/CC** | CMU | 六阶段模型，强调沟通管理 |

---

## 九、应急响应实战案例

### 9.1 案例：Web 服务器入侵应急响应

```
场景：公司官网 Web 服务器被植入挖矿木马

时间线：
  Day 1 14:00 - 运维报告服务器 CPU 持续 100%
  Day 1 14:15 - SOC 开始调查

检测阶段 (D)：
  - top 发现异常进程 "kworkerds" 占用 CPU 99%
  - 进程路径：/tmp/.X11-unix/kworkerds
  - netstat 发现连接 45.33.32.156:3333 (已知矿池)
  - 确认事件：Web 服务器被植入挖矿木马

遏制阶段 (C)：
  - kill -9 终止挖矿进程
  - iptables 阻断矿池 IP
  - 保持 Web 服务运行（只读模式）

根除阶段 (E)：
  - 找到 WebShell：/var/www/html/wp-content/uploads/2024/06/cache.php
  - 分析 WebShell 发现通过 WordPress 插件漏洞上传 (CVE-2024-XXXX)
  - 删除 WebShell 和挖矿程序
  - 更新 WordPress 插件到最新版本
  - 删除 /tmp 下所有可疑文件

恢复阶段 (R)：
  - 从备份恢复被篡改的文件
  - 重置所有 WordPress 管理员密码
  - 验证 Web 服务正常

跟踪阶段 (F)：
  - 更新 WAF 规则（增加 WebShell 检测）
  - 将 WordPress 纳入漏洞管理范围
  - 增加服务器 CPU 使用率监控告警
```

### 9.2 常用应急响应命令速查

```bash
# Linux 应急响应命令速查
# 进程分析
ps auxf | less                    # 进程树
ps -eo pid,ppid,cmd,%cpu,%mem --sort=-%cpu | head  # CPU 排行
lsof -p <PID>                     # 进程打开的文件
ls -la /proc/<PID>/exe            # 进程可执行文件路径
cat /proc/<PID>/cmdline           # 进程启动命令

# 网络分析
ss -tulnp                         # 监听端口
ss -antp | grep ESTAB             # 已建立连接
iptables -L -n -v                 # 防火墙规则
arp -a                            # ARP 表

# 用户分析
who                               # 当前登录用户
last -20                          # 登录历史
lastlog                           # 所有用户最后登录
cat /etc/passwd | grep -v nologin # 可登录用户

# 文件分析
find / -mtime -1 -type f 2>/dev/null    # 最近修改
find / -perm -4000 -o -perm -2000 2>/dev/null  # SUID/SGID
find / -nouser -o -nogroup 2>/dev/null  # 无主文件

# 持久化检查
crontab -l                        # 当前用户计划任务
cat /etc/crontab                  # 系统计划任务
ls -la /etc/cron.*                # 定时任务目录
systemctl list-unit-files | grep enabled  # 开机启动服务

# 日志分析
grep "Failed password" /var/log/secure | tail -50   # SSH 失败登录
grep "Accepted" /var/log/secure | tail -50          # SSH 成功登录
ausearch -m USER_LOGIN --success no -ts today       # 审计登录失败
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | PDCERF 六阶段名称 | ★★★★★ | 低 | 准备→检测→遏制→根除→恢复→跟踪 |
| 2 | 准备阶段内容 | ★★★★☆ | 中 | 组织、预案、工具、培训、演练 |
| 3 | 遏制策略类型 | ★★★★☆ | 中 | 网络隔离、VLAN隔离、ACL阻断、账户禁用、服务暂停 |
| 4 | 根除阶段操作 | ★★★★★ | 中 | 清除恶意代码、修复漏洞、消除持久化、删除后门账户 |
| 5 | RTO 与 RPO 区别 | ★★★★☆ | 中 | RTO 恢复时间目标，RPO 恢复点目标 |
| 6 | PDCERF vs PICERL | ★★★☆☆ | 中 | PDCERF 是中国标准，PICERL 是 SANS 模型 |
| 7 | 事件总结报告内容 | ★★★★☆ | 中 | 概述、时间线、根因、影响、改进措施 |
| 8 | 遏制与根除区别 | ★★★★★ | 中 | 遏制是"止血"（阻止扩散），根除是"治病"（清除威胁） |

### 💡 知识巧记口诀

> **"准检遏根复跟，六步应急闭环"** — PDCERF 六阶段：准备、检测、遏制、根除、恢复、跟踪
>
> **"遏制先止血，根除再治病"** — 遏制阶段是紧急处理阻止扩散，根除阶段是彻底清除威胁
>
> **"RTO 管时间，RPO 管数据"** — RTO 是恢复需要多长时间，RPO 是能容忍丢失多少数据
>
> **"证据保全与业务恢复，遏制阶段的两难选择"** — 遏制时需要在保护证据和快速恢复之间权衡
>
> **"跟踪不是终点，而是下一次准备的起点"** — 跟踪阶段的教训应反馈到准备阶段，形成闭环

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "遏制阶段应该直接删除恶意文件" | ❌ 错误！遏制是"隔离"而非"删除"，删除属于根除阶段。而且直接删除会破坏证据 |
| "恢复阶段就是重启服务器" | ❌ 错误！恢复包括系统重建、数据恢复、安全验证等多个步骤，不是简单重启 |
| "只要系统恢复正常，应急响应就结束了" | ❌ 错误！还必须完成跟踪阶段（复盘、改进、报告） |
| "准备阶段是一次性的" | ❌ 错误！准备阶段是一个持续的过程，每次事件后都要更新预案和工具 |
| "RTO 和 RPO 越小越好" | ❌ 错误！RTO/RPO 越小成本越高，需要根据业务重要性合理设定 |

---

## 学习建议

1. 📋 **编写一份应急预案**：为你所在的组织编写一份完整的网络安全应急预案
2. 🔧 **准备应急工具箱**：整理一个应急响应 U 盘，包含常用取证和分析工具
3. 🎯 **进行桌面推演**：组织一次以勒索软件为场景的桌面推演
4. 📊 **分析真实事件报告**：阅读 Verizon DBIR 报告中的真实案例，思考应对方法
5. 🔄 **对比学习**：对比 PDCERF 和 NIST SP 800-61，理解不同框架的异同
6. 📝 **练习写事件报告**：基于一个假设事件，写一份完整的事件总结报告

---

> **应急响应就像消防——平时多流汗（准备和演练），战时少流血（快速遏制和恢复）。每一次事件的复盘，都是下一次更好响应的基石。**
""")

print("Day 7 done")

print("Days 1-7 generated. Continuing with Days 8-30...")

# ============================================================
# Day 8: 防火墙技术
# ============================================================
gen('day-8.md', r"""# Day 8：防火墙技术

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：50 分钟
>
> 防火墙是网络安全的第一道防线，也是 CISP 考试网络安全方向的高频考点。本章从防火墙的分类、工作原理、访问控制列表（ACL）设计、状态检测机制到下一代防火墙（NGFW）高级功能，系统讲解防火墙技术的方方面面。包过滤、状态检测、代理防火墙的区别是考试必考内容。

---

## 导航目录

- [一、防火墙基础概念与分类](#一防火墙基础概念与分类)
- [二、包过滤防火墙详解](#二包过滤防火墙详解)
- [三、状态检测防火墙详解](#三状态检测防火墙详解)
- [四、应用代理防火墙详解](#四应用代理防火墙详解)
- [五、下一代防火墙](#五下一代防火墙)
- [六、iptables/nftables 实战](#六iptablesnftables-实战)
- [七、防火墙策略设计原则](#七防火墙策略设计原则)
- [八、防火墙部署架构](#八防火墙部署架构)
- [九、防火墙攻防技术](#九防火墙攻防技术)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、防火墙基础概念与分类

### 1.1 防火墙的定义与演进

防火墙（Firewall）是位于不同网络之间的访问控制设备，根据预设的安全策略监控和控制进出网络的流量。

**防火墙演进历程**：

| 代际 | 时间 | 技术 | 检测层级 | 代表产品 |
|:---|:---|:---|:---|:---|
| 第一代 | 1980s | 包过滤防火墙 | 网络层/传输层 | Cisco ACL |
| 第二代 | 1990s | 状态检测防火墙 | 传输层 | Check Point FireWall-1 |
| 第三代 | 2000s | 应用代理防火墙 | 应用层 | Blue Coat ProxySG |
| 第四代 | 2010s | 下一代防火墙 (NGFW) | 全栈 | Palo Alto, Fortinet |
| 第五代 | 2020s | 云原生防火墙/SASE | 全栈+云 | Zscaler, Netskope |

### 1.2 防火墙按技术分类

| 类型 | 工作层级 | 核心原理 | 优点 | 缺点 |
|:---|:---|:---|:---|:---|
| **包过滤** | L3-L4 | 检查 IP 头、TCP/UDP 头 | 速度快、对应用透明 | 无法理解应用层内容 |
| **状态检测** | L3-L4 | 维护连接状态表 | 安全性与性能平衡 | 仍无法检测应用层攻击 |
| **应用代理** | L7 | 代理客户端与服务器通信 | 深度应用层控制 | 延迟高、扩展性差 |
| **NGFW** | L3-L7 | 状态检测+应用识别+IPS | 全面防护 | 成本高 |

> **🔑 高分考点**：四种防火墙技术的区别是考试必考！包过滤只看包头、状态检测维护连接状态、应用代理中断直连、NGFW 融合多种技术。

### 1.3 防火墙按部署形态分类

| 形态 | 描述 | 典型场景 |
|:---|:---|:---|
| **硬件防火墙** | 专用硬件设备 | 企业边界、数据中心 |
| **软件防火墙** | 运行在通用操作系统上 | iptables、Windows 防火墙 |
| **虚拟防火墙** | 运行在虚拟化平台 | 云环境、多租户 |
| **云防火墙** | 云服务商提供的防火墙即服务 | AWS Security Group、Azure NSG |
| **容器防火墙** | Kubernetes 网络策略 | 微服务间流量控制 |

---

## 二、包过滤防火墙详解

### 2.1 包过滤原理

包过滤防火墙检查每个数据包的头部信息，根据 ACL 规则决定允许或拒绝：

```
数据包到达
    │
    ▼
┌─────────────────────────────────┐
│ 提取头部信息：                    │
│ - 源 IP 地址                     │
│ - 目标 IP 地址                   │
│ - 协议类型 (TCP/UDP/ICMP)        │
│ - 源端口                         │
│ - 目标端口                       │
│ - TCP 标志位 (SYN/ACK/FIN/RST)   │
└────────────┬────────────────────┘
             │
             ▼
    ┌────────────────┐
    │ 逐条匹配 ACL   │
    │ 第一条匹配即执行 │
    └───┬────────┬───┘
        │        │
    允许(ACCEPT)  拒绝(DROP/REJECT)
```

### 2.2 Cisco ACL 配置示例

```cisco
! 标准 ACL（仅匹配源 IP）
access-list 10 permit 192.168.1.0 0.0.0.255
access-list 10 deny any

! 扩展 ACL（匹配源/目标 IP、协议、端口）
! 允许 Web 服务器对外提供 HTTP/HTTPS 服务
access-list 100 permit tcp any host 10.1.1.100 eq 80
access-list 100 permit tcp any host 10.1.1.100 eq 443

! 允许内部网络访问互联网（状态检测隐式允许回包）
access-list 100 permit tcp 192.168.0.0 0.0.255.255 any established

! 允许 DNS 查询
access-list 100 permit udp any host 10.1.1.53 eq 53

! 允许 ICMP (ping)
access-list 100 permit icmp any any echo-reply
access-list 100 permit icmp any any time-exceeded

! 显式拒绝所有（隐式 deny any 在末尾）
access-list 100 deny ip any any log  ! log 关键字记录日志

! 应用到接口
interface GigabitEthernet0/1
  ip access-group 100 in
```

### 2.3 包过滤的局限性

| 局限性 | 说明 | 攻击示例 |
|:---|:---|:---|
| **无法检测应用层攻击** | 只检查包头，不分析载荷 | SQL 注入、XSS 可通过 80 端口进入 |
| **无法防御 IP 欺骗** | 不验证源 IP 的真实性 | 攻击者伪造内网 IP 绕过 ACL |
| **ACL 复杂度** | 规则多了难以维护 | 100+ 条规则时易出现逻辑漏洞 |
| **无状态** | 每个包独立处理，无法关联 | 无法区分新连接和已建立连接 |

---

## 三、状态检测防火墙详解

### 3.1 状态检测原理

状态检测防火墙（Stateful Firewall）维护一个"状态表"，记录所有活跃连接的上下文信息：

```
状态表结构：

┌─────────┬──────────┬──────────┬─────────┬─────────┬──────────┐
│ 源 IP   │ 源端口   │ 目标 IP  │ 目标端口│ 协议    │ 状态     │
├─────────┼──────────┼──────────┼─────────┼─────────┼──────────┤
│10.1.1.5 │ 54321    │1.2.3.4   │ 443     │ TCP     │ESTABLISHED│
│10.1.1.8 │ 12345    │8.8.8.8   │ 53      │ UDP     │ SEEN_REPLY│
└─────────┴──────────┴──────────┴─────────┴─────────┴──────────┘

处理逻辑：
- 出站包：匹配出站规则 → 允许 → 在状态表创建条目
- 入站包：先查状态表 → 命中 → 允许（无需匹配入站规则）
- 入站包：未命中 → 匹配入站规则 → 决定允许/拒绝
```

### 3.2 TCP 状态检测

状态检测防火墙跟踪 TCP 连接的三次握手和四次挥手过程：

```
TCP 状态跟踪：

客户端                     防火墙                     服务器
  │                          │                          │
  │──SYN──────────────────→│                          │
  │                   [NEW 状态]                        │
  │                          │──SYN──────────────────→│
  │                          │←──SYN+ACK──────────────│
  │                   [更新状态]                        │
  │←──SYN+ACK──────────────│                          │
  │                          │                          │
  │──ACK──────────────────→│                          │
  │                   [ESTABLISHED]                     │
  │                          │──ACK──────────────────→│
  │                          │                          │
  │                          │←──FIN──────────────────│
  │                   [CLOSE_WAIT]                      │
  │←──FIN──────────────────│                          │
  │──ACK──────────────────→│                          │
  │                   [TIME_WAIT → 超时清除]             │
```

### 3.3 状态检测 vs 包过滤

| 对比维度 | 包过滤 | 状态检测 |
|:---|:---|:---|
| **工作方式** | 每个包独立匹配规则 | 基于连接状态 |
| **性能** | 规则多时性能下降明显 | 状态表查询，效率高 |
| **安全性** | 低（易被 IP 欺骗、ACK 扫描绕过） | 中（需完整握手） |
| **配置复杂度** | 高（需双向规则） | 低（只需出站规则） |
| **典型产品** | Cisco ACL（基础） | iptables conntrack、Check Point |

> **🔑 高分考点**：状态检测防火墙的最大优势是 **"只需配置出站规则，入站回包自动放行"**，通过状态表实现。这大幅简化了策略配置。

---

## 四、应用代理防火墙详解

### 4.1 代理防火墙原理

应用代理防火墙（Application Proxy Firewall）中断客户端与服务器的直接连接，以中间人身份转发流量：

```
客户端                 代理防火墙                 服务器
  │                       │                       │
  │────TCP 连接──────────→│                       │
  │                       │────TCP 连接──────────→│
  │                       │                       │
  │────HTTP 请求─────────→│                       │
  │                       │──检查请求合法性────────│
  │                       │──过滤恶意内容─────────│
  │                       │──检查响应合法性────────│
  │                       │────HTTP 请求─────────→│
  │                       │←───HTTP 响应─────────│
  │←───HTTP 响应─────────│                       │
```

**代理防火墙的双重连接**：
- 客户端 ↔ 代理：连接 1
- 代理 ↔ 服务器：连接 2
- 两个连接完全独立，攻击者无法直接与目标服务器通信

### 4.2 代理类型

| 代理类型 | 描述 | 典型应用 |
|:---|:---|:---|
| **HTTP 代理** | 代理 HTTP/HTTPS 流量 | 上网行为管理、内容过滤 |
| **SMTP 代理** | 代理邮件流量 | 邮件安全网关、反垃圾邮件 |
| **DNS 代理** | 代理 DNS 查询 | DNS 安全过滤 |
| **FTP 代理** | 代理 FTP 流量 | 文件传输审计 |
| **SOCKS 代理** | 通用代理（L5） | 不解析应用层协议 |
| **反向代理** | 代理入站流量，保护后端服务器 | WAF、负载均衡 |

### 4.3 代理防火墙优缺点

| 优点 | 缺点 |
|:---|:---|
| 深度应用层检查（理解 HTTP、SMTP 等协议） | 延迟高（需要完整解析应用层数据） |
| 隐藏内部网络拓扑 | 不支持所有应用协议 |
| 细粒度访问控制（URL 级别、文件类型） | 扩展性差，高并发下性能瓶颈 |
| 内容缓存（加速访问） | 需要为每种协议单独配置代理 |
| 用户认证集成 | 不支持端到端加密（需中间解密） |

---

## 五、下一代防火墙

### 5.1 NGFW 定义与核心能力

Gartner 在 2009 年提出 NGFW（Next-Generation Firewall）概念，定义其必须具备以下能力：

| 能力 | 说明 | 示例 |
|:---|:---|:---|
| **传统防火墙功能** | 状态检测、NAT、VPN | 基本包过滤 |
| **应用识别** | 识别 3000+ 应用（不仅是端口） | 区分 HTTP 上的 Facebook vs 正常 Web |
| **用户身份识别** | 将流量关联到具体用户 | AD/LDAP 集成 |
| **集成 IPS** | 内置入侵防御 | 检测并阻断漏洞利用 |
| **SSL 解密** | 解密 HTTPS 流量进行检测 | 中间人解密+检测后重新加密 |
| **威胁情报集成** | 实时阻断已知恶意 IP/域名 | 自动更新威胁情报库 |

### 5.2 主流 NGFW 产品对比

| 产品 | 厂商 | 核心优势 | 适用场景 |
|:---|:---|:---|:---|
| **Palo Alto PA 系列** | Palo Alto | App-ID 应用识别最强 | 大型企业 |
| **FortiGate** | Fortinet | 性价比高，SD-WAN 集成 | 中大型企业、分支 |
| **Cisco Firepower** | Cisco | Cisco 生态集成 | Cisco 网络环境 |
| **Check Point Quantum** | Check Point | 安全策略统一管理 | 金融/政府 |
| **Hillstone（山石）** | 山石网科 | 国产化、等保合规 | 国内政企 |
| **Huawei USG** | 华为 | 国产化、SDN 集成 | 国内政企、运营商 |

### 5.3 NGFW 应用识别技术

```
Palo Alto App-ID 识别流程：

流量到达
    │
    ▼
┌─────────────────────┐
│ 1. 端口匹配          │ → 初步判断（如 443 可能是 HTTPS）
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ 2. SSL 解密          │ → 如果是 TLS，解密查看内容
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ 3. 应用签名匹配       │ → 匹配 3000+ 应用签名
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ 4. 协议解码          │ → 深度解析 HTTP/DNS 等协议
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ 5. 行为分析          │ → 检测应用内的异常行为
└────────┬────────────┘
         │
         ▼
      确定应用
  (如: ssl → facebook-base)
```

---

## 六、iptables/nftables 实战

### 6.1 iptables 基础

```bash
# iptables 五链四表

# 五链：
# PREROUTING → INPUT → FORWARD → OUTPUT → POSTROUTING

# 四表（按优先级）：
# raw → mangle → nat → filter

# 查看规则
iptables -L -n -v --line-numbers

# 基础规则配置
# 1. 默认策略（DROP 所有入站，ALLOW 所有出站）
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# 2. 允许本地回环
iptables -A INPUT -i lo -j ACCEPT

# 3. 允许已建立的和相关的连接（状态检测核心）
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# 4. 允许 SSH（限制来源 IP）
iptables -A INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT

# 5. 允许 HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# 6. 限制连接速率（防暴力破解）
iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW \
  -m recent --set --name SSH
iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW \
  -m recent --update --seconds 60 --hitcount 4 --name SSH -j DROP

# 7. 防止 SYN Flood（限制 SYN 包速率）
iptables -A INPUT -p tcp --syn -m limit --limit 10/s --limit-burst 20 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP

# 8. 防止端口扫描
iptables -A INPUT -p tcp -m tcp --tcp-flags ALL SYN,FIN -j DROP   # Xmas 扫描
iptables -A INPUT -p tcp -m tcp --tcp-flags ALL NONE -j DROP      # NULL 扫描

# 9. 记录被拒绝的流量
iptables -A INPUT -j LOG --log-prefix "IPTABLES-DROP: " --log-level 4
iptables -A INPUT -j DROP
```

### 6.2 nftables（iptables 的继任者）

```bash
# nftables 基础配置
# 创建表
nft add table inet filter

# 创建链
nft add chain inet filter input { type filter hook input priority 0\; policy drop\; }
nft add chain inet filter forward { type filter hook forward priority 0\; policy drop\; }
nft add chain inet filter output { type filter hook output priority 0\; policy accept\; }

# 允许本地回环
nft add rule inet filter input iif lo accept

# 允许已建立的连接
nft add rule inet filter input ct state established,related accept

# 允许 SSH
nft add rule inet filter input tcp dport 22 ct state new accept

# 允许 HTTP/HTTPS
nft add rule inet filter input tcp dport {80, 443} accept

# 防端口扫描（动态黑名单）
nft add set inet filter port_scanners { type ipv4_addr\; flags dynamic,timeout\; timeout 1h\; }
nft add rule inet filter input tcp flags syn ct state new \
  add @port_scanners { ip saddr limit rate over 10/minute } drop

# 查看规则
nft list ruleset
```

---

## 七、防火墙策略设计原则

### 7.1 安全策略设计原则

| 原则 | 描述 | 实施方法 |
|:---|:---|:---|
| **最小权限** | 只开放业务必需的端口和 IP | 逐条审核，去掉"any"规则 |
| **默认拒绝** | 默认拒绝所有流量，只显式允许必要流量 | `iptables -P INPUT DROP` |
| **纵深防御** | 多层防火墙（边界+内网+主机） | 分层部署 |
| **职责分离** | 策略审批和执行分离 | 双人复核 |
| **定期审计** | 每季度审计防火墙规则 | 规则清理、端口扫描验证 |

### 7.2 常见策略错误

| 错误 | 危害 | 修复 |
|:---|:---|:---|
| `permit ip any any` | 完全开放 | 删除，只放行必要流量 |
| 规则顺序错误 | 精细规则被粗放规则覆盖 | 调整顺序，精细规则在前 |
| 开放过多端口 | 攻击面扩大 | 最小化端口范围 |
| 仅限制 TCP 忽略 UDP | UDP 攻击绕过 | 同时限制 TCP 和 UDP |
| 未限制来源 IP | 任何来源可访问 | 限制来源 IP 范围 |

### 7.3 防火墙策略审计

```bash
# 检查当前开放的端口
nmap -sT -p- <firewall_ip>

# 检查防火墙规则冗余
# 工具：Firewall Auditor (Tufin, AlgoSec)

# 手动检查清单：
# □ 是否存在 any any 规则？
# □ 是否存在重复规则？
# □ 是否存在相互矛盾的规则？
# □ 是否有针对已下线服务的规则？
# □ 管理端口（SSH/HTTPS）是否限制了来源 IP？
```

---

## 八、防火墙部署架构

### 8.1 常见部署拓扑

```
典型企业防火墙部署架构：

                    ┌──────────┐
                    │  互联网   │
                    └────┬─────┘
                         │
                 ┌───────▼───────┐
                 │  边界路由器    │
                 └───────┬───────┘
                         │
              ┌──────────▼──────────┐
              │    边界防火墙 1       │ ← Active
              │  (NGFW + IPS + VPN) │
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │   核心交换机         │
              └──┬────────┬───────┬┘
                 │        │       │
        ┌────────▼──┐ ┌──▼─────┐ ┌▼──────────┐
        │  DMZ 区   │ │服务器区│ │ 办公区     │
        │ Web/Mail  │ │ 防火墙  │ │ 防火墙     │
        └───────────┘ └────────┘ └────────────┘
```

### 8.2 高可用部署（HA）

```bash
# 防火墙双机热备（Active-Standby）

# 配置 VRRP/HSRP 虚拟 IP
# 主防火墙：优先级 100
# 备防火墙：优先级 90
# 虚拟 IP：10.1.1.1（对外网关）

# 会话同步：
# 主防火墙将状态表实时同步到备防火墙
# 切换时间：< 1 秒（无状态丢失）

# 健康检测：
# - 链路检测（ping 上游网关）
# - 接口检测（link status）
# - 服务检测（IPS 引擎、AV 引擎）
```

---

## 九、防火墙攻防技术

### 9.1 常见防火墙绕过技术

| 技术 | 原理 | 防御 |
|:---|:---|:---|
| **端口复用** | 将恶意流量伪装在允许的端口上（如 80/443） | 应用层检测 (NGFW App-ID) |
| **协议隧道** | 将恶意协议封装在允许的协议中（DNS/ICMP 隧道） | 协议异常检测、流量分析 |
| **分片攻击** | 将攻击载荷分散到 IP 分片中 | 分片重组、最小分片长度限制 |
| **源端口欺骗** | 使用 53 (DNS) 等常见允许的源端口 | 限制源端口范围 |
| **ACK 扫描** | 发送 ACK 包探测，某些防火墙不检查 ACK 包 | 严格状态检测 |
| **IPv6 绕过** | 利用未配置安全策略的 IPv6 通道 | 统一管理 IPv4/IPv6 策略 |

### 9.2 Nmap 防火墙探测

```bash
# 探测防火墙规则
# 1. ACK 扫描（探测有状态防火墙）
nmap -sA -p 22,80,443 target.com

# 2. 分片扫描（测试分片处理）
nmap -f -p 80 target.com

# 3. 诱饵扫描（隐藏真实扫描源）
nmap -D RND:10 -p 80 target.com

# 4. 空闲扫描（使用僵尸主机扫描）
nmap -sI zombie_host -p 80 target.com

# 5. 源端口欺骗
nmap --source-port 53 -p 22 target.com

# 6. 使用特定 MTU（绕过某些分片检测）
nmap --mtu 8 -p 80 target.com
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | 防火墙四种技术类型 | ★★★★★ | 低 | 包过滤、状态检测、应用代理、NGFW |
| 2 | 包过滤与状态检测区别 | ★★★★★ | 中 | 包过滤无状态，状态检测维护连接表 |
| 3 | 代理防火墙原理 | ★★★★☆ | 中 | 中断直连，以中间人身份转发 |
| 4 | NGFW 核心能力 | ★★★★★ | 中 | 应用识别、用户识别、集成 IPS、SSL 解密 |
| 5 | iptables 三表五链 | ★★★☆☆ | 中 | filter/nat/mangle，INPUT/OUTPUT/FORWARD/PREROUTING/POSTROUTING |
| 6 | 防火墙策略原则 | ★★★★☆ | 低 | 最小权限、默认拒绝、纵深防御 |
| 7 | 状态表的作用 | ★★★★☆ | 中 | 记录连接状态，自动放行回包 |
| 8 | 防火墙部署位置 | ★★★★☆ | 低 | 边界、DMZ、服务器区、终端 |

### 💡 知识巧记口诀

> **"包过状代下，四代防火墙"** — 包过滤→状态检测→应用代理→下一代，四代技术演进
>
> **"状态表记连接，回包自动放"** — 状态检测防火墙的核心：状态表记录连接，入站回包自动放行
>
> **"NGFW 五个一：识应用、知用户、带 IPS、解 SSL、联情报"** — NGFW 五大核心能力
>
> **"最小权限默认拒，分层防御要记牢"** — 防火墙策略设计原则
>
> **"DMZ 放前面，内网藏后面"** — 防火墙部署原则：DMZ 区在防火墙外侧或中间，内网在防火墙后面

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "防火墙可以防御所有网络攻击" | ❌ 错误！防火墙主要做访问控制，无法防御应用层攻击（SQL 注入、XSS）和加密流量中的威胁 |
| "NGFW 可以完全替代 IPS" | ❌ 错误！NGFW 集成的是基础 IPS 功能，专业 IPS 仍有更细粒度的检测能力 |
| "iptables 的 DROP 和 REJECT 效果一样" | ❌ 错误！DROP 静默丢弃（超时），REJECT 回复 ICMP 不可达（立即告知），安全性和用户体验不同 |
| "防火墙策略只需配置入站规则" | ❌ 错误！出站规则同样重要，可以防止数据外泄和 C2 通信 |
| "包过滤防火墙已经过时了，不需要了解" | ❌ 错误！包过滤是基础，许多云安全组（如 AWS Security Group）本质仍是包过滤 |

---

## 学习建议

1. 🖥️ **动手配置 iptables**：在一台 Linux 虚拟机上配置完整的 iptables 规则集
2. 🔍 **使用 Nmap 测试**：用 Nmap 扫描配置了防火墙的主机，理解各种扫描的结果差异
3. 📊 **分析防火墙日志**：导出一周的防火墙拒绝日志，分析被阻止最多的端口和 IP
4. 🔄 **对比 iptables 和 nftables**：配置相同的安全策略，对比语法和性能
5. 🏗️ **搭建多层防火墙环境**：用虚拟机模拟边界+DMZ+内网的三层防火墙架构
6. 📖 **阅读 Palo Alto App-ID 技术白皮书**：理解 NGFW 的应用识别原理

---

> **防火墙是安全的第一道门，但绝不是最后一道。好的防火墙策略需要结合业务需求和安全要求，做到"该放的放得通，该拦的拦得住"。**
""")

print("Day 8 done")

# ============================================================
# Day 9: WAF部署与配置
# ============================================================
gen('day-9.md', r"""# Day 9：WAF部署与配置

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：50 分钟
>
> Web 应用防火墙（WAF）是保护 Web 应用免受 OWASP Top 10 攻击的关键防线。本章从 WAF 的部署模式、核心检测技术、规则配置、绕过与防御到实战案例，系统讲解 WAF 的全方位知识。其中 WAF 的三种部署模式和 SQL 注入/XSS 防护是 CISP 考试的高频考点。

---

## 导航目录

- [一、WAF 基础概念与定位](#一waf-基础概念与定位)
- [二、WAF 部署模式详解](#二waf-部署模式详解)
- [三、WAF 核心检测技术](#三waf-核心检测技术)
- [四、ModSecurity 实战部署](#四modsecurity-实战部署)
- [五、OWASP CRS 规则体系](#五owasp-crs-规则体系)
- [六、自定义 WAF 规则编写](#六自定义-waf-规则编写)
- [七、WAF 绕过与防御技术](#七waf-绕过与防御技术)
- [八、主流 WAF 产品对比](#八主流-waf-产品对比)
- [九、WAF 运维与优化](#九waf-运维与优化)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、WAF 基础概念与定位

### 1.1 WAF 的定义

WAF（Web Application Firewall，Web 应用防火墙）是专门保护 Web 应用的安全设备/软件，通过分析 HTTP/HTTPS 流量来检测和阻断针对 Web 应用的攻击。

> **🔑 高分考点**：WAF 工作在 OSI 第 7 层（应用层），区别于传统防火墙（L3-L4）和 IPS（L3-L7 但不专门针对 Web）。WAF 理解 HTTP 协议，能检测 SQL 注入、XSS、CSRF 等 Web 攻击。

### 1.2 WAF 与其它安全设备的区别

| 设备 | 防护层级 | 防护对象 | 典型攻击 |
|:---|:---|:---|:---|
| **传统防火墙** | L3-L4 | IP、端口 | DDoS、端口扫描 |
| **IPS/IDS** | L3-L7 | 漏洞利用 | CVE 利用、恶意软件 |
| **WAF** | L7 | Web 应用 | SQL 注入、XSS、CSRF |
| **RASP** | 应用内部 | 运行时行为 | 命令注入、反序列化 |

### 1.3 WAF 防护范围（OWASP Top 10）

| OWASP Top 10 (2021) | WAF 防护能力 | 典型规则 |
|:---|:---:|:---|
| A01: 访问控制失效 | 部分（URL 级别） | URL 白名单 |
| A02: 加密机制失效 | 有限 | TLS 强制 |
| A03: 注入攻击 | **强** | SQLi 规则集 |
| A04: 不安全设计 | 有限 | — |
| A05: 安全配置错误 | 部分 | 信息泄露规则 |
| A06: 易受攻击组件 | 有限 | CVE 虚拟补丁 |
| A07: 认证失效 | 部分 | 暴力破解规则 |
| A08: 软件与数据完整性 | 有限 | — |
| A09: 日志与监控 | 辅助 | 记录攻击日志 |
| A10: SSRF | **中** | URL 白名单、内网 IP 过滤 |

---

## 二、WAF 部署模式详解

### 2.1 三种部署模式

| 部署模式 | 工作方式 | 优点 | 缺点 |
|:---|:---|:---|:---|
| **反向代理模式** | WAF 作为 Web 服务器的前端代理 | 最安全、支持 SSL 卸载 | 需修改 DNS/网络配置 |
| **透明代理模式** | WAF 桥接在客户端与服务器之间 | 无需修改网络配置 | 不支持 SSL 检测（除非解密） |
| **插件/模块模式** | WAF 作为 Web 服务器模块运行 | 部署简单、性能高 | 仅保护单台服务器 |

### 2.2 反向代理模式部署

```
反向代理模式（最推荐）：

用户请求                     WAF (反向代理)                Web 服务器
   │                             │                           │
   │──https://example.com──────→│                           │
   │                             │──http://10.1.1.100:80──→│
   │                             │                           │
   │                             │←──HTTP 响应─────────────│
   │←──HTTP 响应────────────────│                           │

配置要点：
- DNS 将 example.com 指向 WAF IP
- WAF 配置 upstream/backend 指向真实 Web 服务器
- WAF 终结 SSL，后端可使用 HTTP（减轻服务器负载）
```

**Nginx 反向代理 + ModSecurity WAF 配置**：

```nginx
# /etc/nginx/conf.d/waf-proxy.conf
server {
    listen 443 ssl http2;
    server_name example.com;

    # SSL 配置
    ssl_certificate     /etc/ssl/certs/example.com.pem;
    ssl_certificate_key /etc/ssl/private/example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    # 启用 ModSecurity WAF
    modsecurity on;
    modsecurity_rules_file /etc/nginx/modsecurity/main.conf;

    location / {
        # 反向代理到后端 Web 服务器
        proxy_pass http://10.1.1.100:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2.3 透明代理模式

```
透明代理模式（桥接）：

用户 ←──────────→ 交换机 ←──────────→ WAF (L2 Bridge) ←──────────→ Web 服务器
                    │                    │                             │
                    │ 流量镜像/策略路由  │ 透明转发                     │

# Linux 桥接配置（WAF 透明代理）
ip link add br0 type bridge
ip link set eth0 master br0
ip link set eth1 master br0
ip link set br0 up

# iptables 将 HTTP 流量重定向到 WAF 检测端口
iptables -t nat -A PREROUTING -i br0 -p tcp --dport 80 \
  -j REDIRECT --to-port 8080
```

---

## 三、WAF 核心检测技术

### 3.1 基于签名的检测

基于签名（规则）是 WAF 最基础的检测方式，通过正则表达式匹配攻击模式：

```python
# WAF 签名检测原理示例
import re

class WAFSignatureEngine:
    def __init__(self):
        self.rules = [
            # SQL 注入检测
            {
                'id': '100001',
                'name': 'SQL Injection - UNION SELECT',
                'pattern': r'(?i)(union\s+(all\s+)?select)',
                'location': ['ARGS', 'BODY', 'HEADERS'],
                'severity': 'CRITICAL',
            },
            # XSS 检测
            {
                'id': '100002',
                'name': 'XSS - Script Tag',
                'pattern': r'(?i)<script[^>]*>.*?</script>',
                'location': ['ARGS', 'BODY'],
                'severity': 'CRITICAL',
            },
            # 命令注入检测
            {
                'id': '100003',
                'name': 'Command Injection',
                'pattern': r'(?i)(;\s*(cat|ls|id|whoami|uname|wget|curl)\b)',
                'location': ['ARGS', 'HEADERS'],
                'severity': 'CRITICAL',
            },
            # 路径遍历检测
            {
                'id': '100004',
                'name': 'Path Traversal',
                'pattern': r'(\.\./){2,}',
                'location': ['ARGS', 'REQUEST_URI'],
                'severity': 'HIGH',
            },
        ]

    def check_request(self, request):
        alerts = []
        for rule in self.rules:
            for location in rule['location']:
                data = self._get_location_data(request, location)
                if isinstance(data, str):
                    if re.search(rule['pattern'], data):
                        alerts.append({
                            'rule_id': rule['id'],
                            'name': rule['name'],
                            'severity': rule['severity'],
                            'location': location,
                        })
                elif isinstance(data, dict):
                    for key, value in data.items():
                        if isinstance(value, str) and re.search(rule['pattern'], value):
                            alerts.append({
                                'rule_id': rule['id'],
                                'name': rule['name'],
                                'severity': rule['severity'],
                                'location': f'{location}:{key}',
                                'matched': value[:100],
                            })
        return alerts
```

### 3.2 基于行为的检测

行为检测通过建立正常访问基线来发现异常：

- **请求频率**：单 IP 的请求速率异常
- **参数模式**：参数组合与正常模式不符
- **会话异常**：Session 行为模式突变
- **响应异常**：响应大小/时间异常

### 3.3 基于机器学习的检测

现代 WAF 越来越多地使用 ML 技术：

| ML 方法 | 应用 | 优势 |
|:---|:---|:---|
| **N-gram 分析** | SQL 注入载荷检测 | 不依赖关键词，检测变种 |
| **HMM（隐马尔可夫模型）** | 正常参数序列建模 | 检测参数异常组合 |
| **决策树/Random Forest** | 请求分类（正常/攻击） | 可解释性强 |
| **深度学习** | 复杂攻击模式识别 | 自动特征提取 |

---

## 四、ModSecurity 实战部署

### 4.1 ModSecurity 安装

```bash
# Ubuntu 安装 ModSecurity + Nginx
apt update
apt install -y libmodsecurity3 libmodsecurity-dev
apt install -y nginx

# 下载 ModSecurity Nginx 连接器
git clone https://github.com/SpiderLabs/ModSecurity-nginx.git
cd ModSecurity-nginx

# 编译 Nginx 模块
wget https://nginx.org/download/nginx-1.24.0.tar.gz
tar xzf nginx-1.24.0.tar.gz
cd nginx-1.24.0
./configure --with-compat --add-dynamic-module=../ModSecurity-nginx
make modules
cp objs/ngx_http_modsecurity_module.so /usr/share/nginx/modules/

# 下载 OWASP CRS 规则集
cd /etc/nginx/modsecurity/
wget https://github.com/coreruleset/coreruleset/archive/v4.0.0.tar.gz
tar xzf v4.0.0.tar.gz
cp coreruleset-4.0.0/crs-setup.conf.example crs-setup.conf
```

### 4.2 ModSecurity 配置

```nginx
# /etc/nginx/modsecurity/main.conf
SecRuleEngine On
SecRequestBodyAccess On
SecRequestBodyLimit 13107200
SecRequestBodyNoFilesLimit 131072
SecResponseBodyAccess On
SecResponseBodyLimit 524288
SecResponseBodyMimeType text/plain text/html text/xml
SecAuditEngine RelevantOnly
SecAuditLogRelevantStatus "^(?:5|4(?!04))"
SecAuditLogParts ABIJDEFHZ
SecAuditLog /var/log/modsecurity/audit.log
SecDebugLog /var/log/modsecurity/debug.log
SecDebugLogLevel 0

# 加载 OWASP CRS 规则
Include /etc/nginx/modsecurity/crs-setup.conf
Include /etc/nginx/modsecurity/coreruleset-4.0.0/rules/*.conf

# 自定义规则
Include /etc/nginx/modsecurity/custom-rules/*.conf
```

### 4.3 ModSecurity 自定义规则

```apache
# /etc/nginx/modsecurity/custom-rules/01-custom.conf

# 规则 1：封禁特定 IP
SecRule REMOTE_ADDR "@ipMatch 192.168.1.100" \
    "id:1001,phase:1,deny,status:403,msg:'IP Blocked'"

# 规则 2：限制请求速率（防 CC 攻击）
SecAction "id:1002,phase:1,nolog,pass,setvar:ip.rate_limit=+1,deprecatevar:ip.rate_limit=10/60"
SecRule IP:RATE_LIMIT "@gt 100" \
    "id:1003,phase:1,deny,status:429,msg:'Rate limit exceeded'"

# 规则 3：屏蔽敏感文件访问
SecRule REQUEST_URI "@contains .git" \
    "id:1004,phase:1,deny,status:404,msg:'Git directory access blocked'"

# 规则 4：检测 User-Agent 为空的请求（常见于扫描器）
SecRule REQUEST_HEADERS:User-Agent "^$" \
    "id:1005,phase:1,deny,status:403,msg:'Empty User-Agent'"

# 规则 5：阻止特定的文件上传类型
SecRule FILES_TMPNAMES "@inspectFile /opt/modsecurity/check_malware.sh" \
    "id:1006,phase:2,deny,status:403,msg:'Malicious file detected'"
```

---

## 五、OWASP CRS 规则体系

### 5.1 CRS 规则分类

OWASP Core Rule Set (CRS) 是使用最广泛的开源 WAF 规则集：

| 规则文件 | 防护内容 | 说明 |
|:---|:---|:---|
| REQUEST-910-IP-REPUTATION | IP 信誉 | 封禁已知恶意 IP |
| REQUEST-911-METHOD-ENFORCEMENT | HTTP 方法 | 限制允许的 HTTP 方法 |
| REQUEST-912-DOS-PROTECTION | DoS 防护 | 请求速率限制 |
| REQUEST-913-SCANNER-DETECTION | 扫描器检测 | 检测漏洞扫描器 |
| REQUEST-920-PROTOCOL-ENFORCEMENT | 协议规范 | HTTP 协议合规检查 |
| REQUEST-921-PROTOCOL-ATTACK | 协议攻击 | HTTP 走私、请求拆分 |
| REQUEST-930-APPLICATION-ATTACK-LFI | LFI/RFI | 文件包含攻击 |
| REQUEST-931-APPLICATION-ATTACK-RFI | RFI | 远程文件包含 |
| REQUEST-932-APPLICATION-ATTACK-RCE | RCE | 远程命令执行 |
| REQUEST-933-APPLICATION-ATTACK-PHP | PHP 攻击 | PHP 注入 |
| REQUEST-941-APPLICATION-ATTACK-XSS | XSS | 跨站脚本 |
| REQUEST-942-APPLICATION-ATTACK-SQLI | SQLi | SQL 注入 |
| REQUEST-943-APPLICATION-ATTACK-SESSION-FIXATION | Session | 会话固定 |
| REQUEST-949-BLOCKING-EVALUATION | 阻断评估 | 汇总评分决定阻断 |

### 5.2 CRS 异常评分模式

CRS 使用异常评分（Anomaly Scoring）而非单规则阻断：

```
CRS 异常评分机制：

每个匹配的规则贡献一个分数：
- Critical: 5 分
- Error: 4 分
- Warning: 3 分
- Notice: 2 分

当总分超过阈值时触发阻断：
- 入站阈值：5 (默认)
- 出站阈值：4 (默认)

示例：
  请求触发：
  - SQLi 规则 (Critical, 5 分)
  - XSS 规则 (Critical, 5 分)
  - 总分数 = 10 > 5 → 阻断
```

---

## 六、自定义 WAF 规则编写

### 6.1 SQL 注入防护规则

```apache
# SQL 注入检测规则集

# 基础 SQL 关键字检测
SecRule ARGS|REQUEST_BODY "@rx (?i)(\bselect\b.*\bfrom\b|\bunion\b.*\bselect\b|\binsert\b.*\binto\b|\bdelete\b.*\bfrom\b|\bdrop\b.*\btable\b|\bexec\b.*\bxp_cmdshell\b)" \
    "id:2001,phase:2,deny,status:403,msg:'SQL Injection Detected - Keywords'"

# SQL 注释注入检测
SecRule ARGS|REQUEST_BODY "@rx (?i)(--[^\r\n]*$|#|/\*.*\*/)" \
    "id:2002,phase:2,deny,status:403,msg:'SQL Injection - Comments'"

# SQL 十六进制编码检测
SecRule ARGS|REQUEST_BODY "@rx (?i)0x[0-9a-f]{6,}" \
    "id:2003,phase:2,deny,status:403,msg:'SQL Injection - Hex Encoding'"

# SQL 盲注函数检测
SecRule ARGS|REQUEST_BODY "@rx (?i)(sleep\(\d+\)|benchmark\(\d+,\s*\w+\)|pg_sleep\(\d+\))" \
    "id:2004,phase:2,deny,status:403,msg:'SQL Injection - Time-based Blind'"
```

### 6.2 Log4Shell 虚拟补丁

```apache
# Log4j CVE-2021-44228 虚拟补丁
# 检测 JNDI 注入字符串
SecRule ARGS|REQUEST_BODY|REQUEST_HEADERS|REQUEST_URI "@rx \$\{.*(jndi|lower|upper):.*\}" \
    "id:2100,phase:2,deny,status:403,msg:'Log4Shell JNDI Injection Attempt (CVE-2021-44228)'"

# 检测嵌套的 JNDI 查找（绕过尝试）
SecRule ARGS|REQUEST_BODY|REQUEST_HEADERS "@rx \$\{.*\$\{.*jndi.*\}.*\}" \
    "id:2101,phase:2,deny,status:403,msg:'Log4Shell Nested JNDI Lookup (Bypass Attempt)'"

# 检测 URL 编码的 JNDI
SecRule ARGS|REQUEST_BODY|REQUEST_HEADERS "@rx \%24\%7B.*jndi.*\%7D" \
    "id:2102,phase:2,deny,status:403,msg:'Log4Shell URL-Encoded JNDI'"
```

---

## 七、WAF 绕过与防御技术

### 7.1 常见 WAF 绕过技术

| 绕过技术 | 示例 | 防御方法 |
|:---|:---|:---|
| **大小写混用** | `SeLeCt * FrOm users` | 正则使用 `(?i)` 不区分大小写 |
| **注释插入** | `SEL/**/ECT` | 规范化后检测 |
| **URL 编码** | `%53%45%4C%45%43%54` | 解码后检测 |
| **双 URL 编码** | `%2553%2545...` | 递归解码 |
| **Unicode 编码** | `\u0053\u0045\u004C...` | Unicode 规范化 |
| **分块传输** | Chunked Transfer-Encoding | HTTP 请求规范化 |
| **参数污染** | `?id=1&id=1' UNION SELECT` | 检查所有参数值 |
| **Multipart 绕过** | 在文件上传表单中嵌入攻击载荷 | 解析 multipart 边界 |
| **HTTP 走私** | CL.TE / TE.CL 攻击 | 统一前端/后端解析 |

**绕过示例代码**：

```python
# WAF 绕过测试脚本
import requests

def test_waf_bypass(target_url):
    # 测试各种 WAF 绕过技术
    # 测试 1：正常 SQL 注入（基础检测）
    r = requests.get(target_url, params={'id': "1' OR '1'='1"})
    print(f"[1] Basic SQLi: {r.status_code}")

    # 测试 2：大小写混用绕过
    r = requests.get(target_url, params={'id': "1' oR '1'='1"})
    print(f"[2] Case mix: {r.status_code}")

    # 测试 3：注释插入绕过
    r = requests.get(target_url, params={'id': "1'/**/OR/**/1=1--"})
    print(f"[3] Comment insertion: {r.status_code}")

    # 测试 4：URL 编码绕过
    payload = "1'%20OR%20'1'='1"
    r = requests.get(target_url, params={'id': payload})
    print(f"[4] URL encoding: {r.status_code}")

    # 测试 5：双 URL 编码绕过
    payload = "1'%2520OR%2520'1'='1"
    r = requests.get(target_url, params={'id': payload})
    print(f"[5] Double URL encoding: {r.status_code}")

    # 测试 6：HTTP 参数污染
    r = requests.get(target_url, params=[('id', '1'), ('id', "1' OR 1=1--")])
    print(f"[6] Parameter pollution: {r.status_code}")
```

### 7.2 WAF 防御加固

```apache
# WAF 加固配置

# 1. 强制规范化请求
SecDefaultAction "phase:1,log,auditlog,pass"
SecRule REQUEST_URI|REQUEST_BODY "@validateUrlEncoding"

# 2. 限制请求方法
SecRule REQUEST_METHOD "!@rx ^(GET|HEAD|POST|OPTIONS)$" \
    "id:3001,phase:1,deny,status:405"

# 3. 限制 Content-Type
SecRule REQUEST_HEADERS:Content-Type "!@rx ^(application/x-www-form-urlencoded|multipart/form-data|application/json|text/xml)" \
    "id:3002,phase:1,deny,status:415"

# 4. 请求体大小限制
SecRequestBodyLimit 10485760  # 10MB

# 5. 强制 User-Agent
SecRule REQUEST_HEADERS:User-Agent "^$" \
    "id:3003,phase:1,deny,status:403"
```

---

## 八、主流 WAF 产品对比

| 产品 | 类型 | 部署模式 | 核心优势 | 适用场景 |
|:---|:---|:---|:---|:---|
| **ModSecurity + CRS** | 开源 | 模块/反向代理 | 免费、可定制 | 预算有限、技术能力强 |
| **Cloudflare WAF** | 云 WAF | SaaS | 全球节点、抗 DDoS | 中小网站 |
| **AWS WAF** | 云 WAF | SaaS | AWS 生态集成 | AWS 用户 |
| **Imperva** | 商业 | 云/本地 | 企业级防护 | 大型企业 |
| **F5 ASM** | 商业 | 硬件/虚拟 | 与 F5 负载均衡集成 | F5 用户 |
| **长亭雷池** | 商业 | 反向代理 | 语义分析引擎 | 国内企业 |
| **阿里云 WAF** | 云 WAF | SaaS | 国内云生态 | 国内阿里云用户 |

---

## 九、WAF 运维与优化

### 9.1 WAF 调优流程

```
WAF 上线调优流程：

1. 学习模式（1-2 周）
   - WAF 设置为"检测不阻断"
   - 收集所有告警
   - 分析误报模式

2. 白名单建立
   - 为已知的正常业务添加白名单
   - 例如：API 接口包含 "select" 是正常的查询参数

3. 渐进式阻断
   - 先阻断 Critical 级别的告警
   - 观察 1 周，无问题后增加 High 级别
   - 逐步扩展

4. 持续优化
   - 每周审查误报
   - 每月审查规则有效性
   - 关注新型攻击，更新规则
```

### 9.2 白名单配置

```apache
# 白名单：排除特定 URL/参数
# 例如：搜索接口允许 "select" 关键字

SecRule REQUEST_URI "@beginsWith /api/search" \
    "id:4001,phase:1,nolog,pass,ctl:ruleRemoveById=942100"

# 或降低特定规则的阈值
SecRule REQUEST_URI "@beginsWith /api/search" \
    "id:4002,phase:1,nolog,pass,ctl:ruleRemoveTargetById=942100;ARGS:q"
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | WAF 三种部署模式 | ★★★★★ | 中 | 反向代理、透明代理、插件/模块模式 |
| 2 | WAF 工作层级 | ★★★★☆ | 低 | OSI 第 7 层（应用层） |
| 3 | WAF 与 IPS 区别 | ★★★★☆ | 中 | WAF 专攻 Web 应用层，IPS 更通用 |
| 4 | OWASP CRS 评分机制 | ★★★☆☆ | 中 | 异常评分模式，累计分数超阈值触发阻断 |
| 5 | WAF 绕过技术 | ★★★★☆ | 中 | 大小写、注释、编码、分块、参数污染 |
| 6 | 虚拟补丁的概念 | ★★★★☆ | 中 | 用 WAF 规则临时修补未打补丁的漏洞 |
| 7 | ModSecurity 核心组件 | ★★★☆☆ | 低 | 开源 WAF 引擎，配合 OWASP CRS 规则集 |
| 8 | WAF 学习模式 | ★★★☆☆ | 中 | 先检测不阻断，建立白名单后逐步启用阻断 |

### 💡 知识巧记口诀

> **"反代透明插模块，三种部署各不同"** — WAF 三种部署模式：反向代理、透明代理、插件/模块
>
> **"WAF 第七层，专护 Web 应用"** — WAF 工作在 OSI 第 7 层，专门保护 Web 应用
>
> **"大小注编块参，六大绕过要警惕"** — 六大 WAF 绕过技术：大小写、注释、编码、分块、参数污染、协议走私
>
> **"先学后断，渐进式上线"** — WAF 上线应先学习模式收集数据，再逐步启用阻断
>
> **"虚拟补丁不虚拟，真的能防 Log4j"** — 虚拟补丁是通过 WAF 规则防御已知漏洞，效果真实有效

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "WAF 可以替代代码层面的安全修复" | ❌ 错误！WAF 是缓解措施，不是根本解决方案，漏洞仍需从代码层面修复 |
| "WAF 部署后 Web 应用就安全了" | ❌ 错误！WAF 不能防御业务逻辑漏洞、越权访问等问题 |
| "ModSecurity 默认规则就能完美防护" | ❌ 错误！默认规则会产生大量误报，需要针对业务调优 |
| "云 WAF 比本地 WAF 更好" | ❌ 错误！各有利弊，云 WAF 部署简单但有延迟，本地 WAF 性能好但运维复杂 |
| "WAF 可以防护 DDoS 攻击" | ❌ 部分正确！WAF 可以防护应用层 DDoS（CC 攻击），但无法防护大流量网络层 DDoS |

---

## 学习建议

1. 🖥️ **部署 ModSecurity + CRS**：在 Nginx 上部署 ModSecurity，启用 OWASP CRS 规则集
2. 🧪 **用 DVWA 测试**：搭建 DVWA（Damn Vulnerable Web Application），测试 WAF 对各种攻击的防护效果
3. 📝 **编写自定义规则**：为特定的业务场景编写自定义 WAF 规则
4. 🔍 **使用 WAFW00F 识别 WAF**：学习如何识别目标网站使用了哪种 WAF
5. 🎯 **实践 WAF 绕过**：在测试环境中尝试各种 WAF 绕过技术，理解攻击者的思路
6. 📊 **分析 WAF 日志**：学习解读 ModSecurity 审计日志，理解攻击模式

---

> **WAF 是 Web 安全的"最后一道防线"，但不是"万能药"。好的 WAF 策略需要结合业务特点持续调优——既能拦截真正的攻击，又不影响正常业务。**
""")

print("Day 9 done")

# Days 8-9 complete. Continuing with remaining days...

# ============================================================
# Day 10: VPN与网络隔离
# ============================================================
gen('day-10.md', r"""# Day 10：VPN与网络隔离

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：50 分钟
>
> VPN（虚拟专用网络）是构建安全远程访问和站点互联的核心技术。网络隔离则是限制攻击横向移动的关键安全架构。本章从 IPSec/SSL VPN 协议原理、配置实战到网络隔离策略（VLAN、微分段、零信任），系统讲解远程安全接入和网络分段的知识体系。

---

## 导航目录

- [一、VPN 基础概念与分类](#一vpn-基础概念与分类)
- [二、IPSec VPN 深度解析](#二ipsec-vpn-深度解析)
- [三、SSL/TLS VPN 深度解析](#三ssltls-vpn-深度解析)
- [四、WireGuard 现代 VPN](#四wireguard-现代-vpn)
- [五、VPN 安全风险与防护](#五vpn-安全风险与防护)
- [六、网络隔离基础](#六网络隔离基础)
- [七、VLAN 隔离实战](#七vlan-隔离实战)
- [八、微分段技术](#八微分段技术)
- [九、零信任网络架构](#九零信任网络架构)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、VPN 基础概念与分类

### 1.1 VPN 的定义

VPN（Virtual Private Network，虚拟专用网络）是在公共网络（如互联网）上建立加密隧道，实现安全、私密的远程通信的技术。

> **🔑 高分考点**：VPN 的核心三要素是 **加密（Confidentiality）、认证（Authentication）、完整性（Integrity）**。这三者缺一不可。

### 1.2 VPN 按协议分类

| 类型 | 协议 | 工作层级 | 典型应用 | 端口 |
|:---|:---|:---|:---|:---|
| **IPSec VPN** | ESP/AH + IKE | L3（网络层） | 站点到站点互联 | IP Proto 50(ESP), 51(AH), UDP 500/4500 |
| **SSL/TLS VPN** | TLS | L4-L7 | 远程用户接入 | TCP 443 |
| **PPTP** | PPTP | L2 | 已废弃 | TCP 1723 |
| **L2TP/IPSec** | L2TP + IPSec | L2 + L3 | 远程接入 | UDP 1701 + IPSec |
| **WireGuard** | WireGuard | L3 | 现代轻量 VPN | UDP 51820（默认）|
| **OpenVPN** | OpenVPN | L2/L3 | 灵活部署 | UDP/TCP 1194（可自定义）|

### 1.3 VPN 按场景分类

| 场景 | 描述 | 典型协议 | 代表方案 |
|:---|:---|:---|:---|
| **Site-to-Site** | 连接两个或多个站点 | IPSec | 总部-分支互联 |
| **Remote Access** | 远程用户接入企业网络 | SSL/TLS VPN | 员工远程办公 |
| **Client-to-Client** | 终端之间的加密通信 | WireGuard | 分布式团队 |
| **Cloud VPN** | 连接本地到云环境 | IPSec | AWS VPN Gateway |

---

## 二、IPSec VPN 深度解析

### 2.1 IPSec 协议族

IPSec 由多个协议组成：

```
IPSec 协议栈：

┌─────────────────────────────────────┐
│              IKE (密钥交换)           │
│  IKEv1 (RFC 2409) / IKEv2 (RFC 7296)│
│  UDP 端口 500, 4500 (NAT-T)          │
├─────────────────────────────────────┤
│        ESP (封装安全载荷)             │
│        IP 协议号 50                   │
│        提供：加密 + 认证 + 完整性      │
├─────────────────────────────────────┤
│        AH (认证头)                    │
│        IP 协议号 51                   │
│        提供：认证 + 完整性（不加密）    │
└─────────────────────────────────────┘

IPSec 两种模式：
- 传输模式 (Transport)：只加密 IP 载荷，IP 头不变
- 隧道模式 (Tunnel)：加密整个 IP 包并添加新 IP 头
```

### 2.2 IPSec 加密算法对比

| 算法 | 类型 | 密钥长度 | 安全性 | 性能 |
|:---|:---|:---|:---:|:---:|
| **AES-256-GCM** | 对称加密 + 认证 | 256 bit | 极高 | 高（硬件加速） |
| **AES-128-GCM** | 对称加密 + 认证 | 128 bit | 高 | 极高 |
| **ChaCha20-Poly1305** | 对称加密 + 认证 | 256 bit | 极高 | 高（无 AES-NI 时） |
| **3DES** | 对称加密 | 168 bit | 低（已废弃） | 低 |
| **DES** | 对称加密 | 56 bit | 极低（已破解） | — |

> **🔑 高分考点**：现代 IPSec 应使用 **AES-256-GCM** 或 **ChaCha20-Poly1305**，不再使用 3DES/DES。ESP 提供加密+认证，AH 只提供认证。

### 2.3 IKE 协商过程

```
IKEv2 协商过程（简化）：

阶段 1: IKE_SA_INIT
  Initiator                          Responder
      │──── IKE_SA_INIT (提议) ────────→│
      │     加密算法: AES-256-GCM        │
      │     DH 组: 2048-bit MODP         │
      │     PRF: SHA-256                 │
      │                                  │
      │←── IKE_SA_INIT (选择+DH公钥) ────│
      │     选定算法 + DH 公钥            │
      │                                  │
  [生成共享密钥 SKEYSEED]           [生成共享密钥 SKEYSEED]

阶段 2: IKE_AUTH
      │──── IKE_AUTH (加密+认证) ────────→│
      │     身份证书 + AUTH 载荷           │
      │                                  │
      │←── IKE_AUTH (加密+认证) ─────────│
      │     身份证书 + AUTH 载荷           │
      │                                  │
  [IPSec SA 建立，开始加密通信]
```

### 2.4 StrongSwan IPSec 配置

```bash
# /etc/ipsec.conf - StrongSwan Site-to-Site VPN
config setup
    charondebug="ike 2, knl 2, cfg 2"
    uniqueids=yes

conn site-a-to-site-b
    # IKE 配置
    keyexchange=ikev2
    ike=aes256-gcm16-prfsha384-ecp384!
    esp=aes256-gcm16-ecp384!

    # 端点配置
    left=203.0.113.1              # 本端公网 IP
    leftsubnet=10.1.0.0/16        # 本端内网
    leftid=@site-a.example.com
    leftcert=vpn-site-a.pem

    right=203.0.113.2             # 对端公网 IP
    rightsubnet=10.2.0.0/16       # 对端内网
    rightid=@site-b.example.com

    # 连接配置
    auto=start
    dpdaction=restart
    dpddelay=30s
    rekey=yes
    fragmentation=yes
    mobike=no
```

```bash
# /etc/ipsec.secrets
# RSA 密钥认证
: RSA vpn-site-a.pem "passphrase"

# 或使用预共享密钥 (PSK)
203.0.113.1 203.0.113.2 : PSK "YourStrongPreSharedKeyHere"
```

### 2.5 IPSec VPN 常见问题排查

```bash
# 检查 IPSec 状态
ipsec status
ipsec statusall

# 手动启动/停止连接
ipsec up site-a-to-site-b
ipsec down site-a-to-site-b

# 查看安全关联 (SA)
ipsec list-sas

# 抓包分析 IKE 协商
tcpdump -i eth0 -n port 500 or port 4500

# 检查 NAT 穿越 (NAT-T)
# 如果两端都在 NAT 后面，需要使用 NAT-T (UDP 4500)
# 启用方式：
# 在 ipsec.conf 中添加：nat_traversal=yes
```

---

## 三、SSL/TLS VPN 深度解析

### 3.1 SSL VPN 工作原理

SSL VPN 通过 TLS 协议建立加密隧道，通常工作在 TCP 443 端口：

```
SSL VPN 连接过程：

客户端浏览器                 SSL VPN 网关                企业内网资源
     │                           │                           │
     │──TLS 握手 (TCP 443)──────→│                           │
     │                           │                           │
     │←──证书认证────────────────│                           │
     │                           │                           │
     │──用户凭证 (用户名/密码)───→│                           │
     │                           │                           │
     │←──认证成功，建立隧道───────│                           │
     │                           │                           │
     │──访问内网资源─────────────→│──代理请求─────────────────→│
     │                           │←──资源响应────────────────│
     │←──加密返回────────────────│                           │
```

### 3.2 OpenVPN 配置

```bash
# OpenVPN 服务端配置
# /etc/openvpn/server.conf
port 1194
proto udp
dev tun
ca /etc/openvpn/easy-rsa/pki/ca.crt
cert /etc/openvpn/easy-rsa/pki/issued/server.crt
key /etc/openvpn/easy-rsa/pki/private/server.key
dh /etc/openvpn/easy-rsa/pki/dh.pem

# 加密配置
cipher AES-256-GCM
auth SHA256
tls-version-min 1.2
tls-cipher TLS-ECDHE-RSA-WITH-AES-256-GCM-SHA384

# 网络配置
server 10.8.0.0 255.255.255.0
push "route 10.1.0.0 255.255.0.0"  # 推送内网路由
push "dhcp-option DNS 10.1.1.53"

# 安全配置
keepalive 10 120
persist-key
persist-tun
user nobody
group nogroup

# 日志
status /var/log/openvpn/openvpn-status.log
log-append /var/log/openvpn/openvpn.log
verb 3
```

### 3.3 SSL VPN 安全加固

| 加固项 | 配置 | 说明 |
|:---|:---|:---|
| **禁用弱加密套件** | `ssl_ciphers HIGH:!aNULL:!MD5:!3DES` | 只允许高强度加密 |
| **最低 TLS 版本** | `ssl_protocols TLSv1.2 TLSv1.3` | 禁用 TLS 1.0/1.1 |
| **证书锁定** | 客户端验证服务器证书指纹 | 防中间人攻击 |
| **双因素认证** | 密码 + TOTP/短信/UKey | 防密码泄露 |
| **客户端安全检测** | 检查客户端补丁、杀毒软件状态 | 防受感染终端接入 |
| **会话超时** | 空闲 30 分钟自动断开 | 防会话劫持 |
| **并发限制** | 每用户最多 2 个并发连接 | 防凭证共享滥用 |

---

## 四、WireGuard 现代 VPN

### 4.1 WireGuard 特点

WireGuard 是新一代 VPN 协议，已合并到 Linux 内核（5.6+）：

| 特性 | WireGuard | OpenVPN | IPSec |
|:---|:---:|:---:|:---:|
| 代码量 | ~4000 行 | ~70000 行 | ~400000 行 (StrongSwan) |
| 加密算法 | 仅 ChaCha20Poly1305 | 多种可选 | 多种可选 |
| 密钥交换 | Noise Protocol | TLS/自定义 | IKEv1/v2 |
| 漫游支持 | 原生支持 | 需配置 | MOBIKE |
| 性能 | 极高 | 中 | 中-高 |
| 配置复杂度 | 极低 | 中 | 高 |

### 4.2 WireGuard 配置实战

```bash
# 服务端配置
# /etc/wireguard/wg0.conf
[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = <server-private-key>

# IP 转发（让客户端访问内网）
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT
PostUp = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# 客户端 1
[Peer]
PublicKey = <client1-public-key>
AllowedIPs = 10.0.0.2/32

# 客户端 2
[Peer]
PublicKey = <client2-public-key>
AllowedIPs = 10.0.0.3/32

# 生成密钥
# wg genkey | tee privatekey | wg pubkey > publickey
```

```ini
# 客户端配置
# client1.conf
[Interface]
Address = 10.0.0.2/24
PrivateKey = <client1-private-key>
DNS = 10.1.1.53

[Peer]
PublicKey = <server-public-key>
Endpoint = vpn.example.com:51820
AllowedIPs = 10.1.0.0/16  # 只路由内网流量
# AllowedIPs = 0.0.0.0/0  # 路由所有流量（全局 VPN）
PersistentKeepalive = 25   # NAT 穿透保持连接
```

---

## 五、VPN 安全风险与防护

### 5.1 已知 VPN 漏洞

| CVE 编号 | 影响产品 | 漏洞类型 | CVSS 评分 | 修复 |
|:---|:---|:---|:---:|:---|
| CVE-2024-21762 | FortiOS SSL VPN | 越界写入 (RCE) | 9.8 | 升级到 FortiOS 7.4.3+ |
| CVE-2023-27997 | FortiOS SSL VPN | 堆溢出 (RCE) | 9.8 | 升级到 FortiOS 7.2.5+ |
| CVE-2023-46805 | Ivanti Connect Secure | 认证绕过 + RCE | 8.2 | 升级 + 恢复出厂设置 |
| CVE-2021-22893 | Pulse Connect Secure | 认证绕过 (RCE) | 10.0 | 立即升级 |
| CVE-2019-11510 | Pulse Connect Secure | 任意文件读取 | 10.0 | 升级到 9.0R3.4+ |
| CVE-2019-19781 | Citrix ADC | 目录遍历 (RCE) | 9.8 | 升级到 13.0-47.24+ |

### 5.2 VPN 安全最佳实践

```bash
# VPN 安全加固清单

1. 定期更新 VPN 软件（启用自动更新）
2. 实施多因素认证 (MFA)
3. 限制 VPN 访问来源 IP（国别/地理围栏）
4. 启用客户端安全合规检查 (Host Checker)
5. 最小权限原则（用户只能访问必要的资源）
6. 监控 VPN 登录异常（新设备、新地点、异常时间）
7. 限制 VPN 会话时长（最长 12 小时）
8. 启用完整的 VPN 审计日志
9. 定期渗透测试 VPN 系统
10. 为 VPN 设备配置专用的带外管理接口
```

---

## 六、网络隔离基础

### 6.1 网络隔离的价值

网络隔离（Network Segmentation）是将网络划分为多个安全区域，限制区域间的通信：

```
网络隔离的核心价值：
┌────────────────────────────────────────────┐
│ 1. 减少攻击面                               │
│    - 攻击者即使攻破一个区域，也无法访问其他区域 │
│                                              │
│ 2. 限制横向移动                              │
│    - 阻止攻击者在内网自由漫游                 │
│                                              │
│ 3. 简化合规                                  │
│    - PCI DSS 要求持卡人数据环境必须隔离        │
│                                              │
│ 4. 便于监控                                  │
│    - 区域间的流量更容易分析和检测异常          │
└────────────────────────────────────────────┘
```

### 6.2 隔离层级

| 隔离层级 | 技术 | 粒度 | 管理复杂度 |
|:---|:---|:---|:---|
| **物理隔离** | 独立交换机/网线 | 粗 | 高 |
| **VLAN 隔离** | 802.1Q VLAN | 中 | 中 |
| **子网隔离** | IP 子网 + ACL | 中 | 中 |
| **微分段** | 主机防火墙/NSX | 细 | 高 |
| **应用隔离** | Service Mesh | 极细 | 极高 |

---

## 七、VLAN 隔离实战

### 7.1 VLAN 基础

VLAN（Virtual LAN，802.1Q）通过标签将物理网络划分为多个逻辑隔离的广播域：

```
VLAN 划分示例：

┌─────────────────────────────────────────────────┐
│                    核心交换机                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │VLAN 10  │  │VLAN 20  │  │VLAN 30  │          │
│  │ 管理网   │  │ 办公网   │  │ DMZ     │          │
│  │10.1.10.x│  │10.1.20.x│  │10.1.30.x│          │
│  └────┬────┘  └────┬────┘  └────┬────┘          │
│       │            │            │                │
└───────┼────────────┼────────────┼────────────────┘
        │            │            │
   ┌────▼───┐   ┌───▼────┐  ┌───▼────┐
   │管理终端 │   │办公终端  │  │Web服务器│
   └────────┘   └────────┘  └────────┘

VLAN 间路由通过 ACL 控制：
- VLAN 10 ↔ VLAN 20: 仅允许 IT 管理端口
- VLAN 20 ↔ VLAN 30: 仅允许 HTTP(80)/HTTPS(443)
- VLAN 10 ↔ VLAN 30: 仅允许 SSH(22)
```

### 7.2 Cisco VLAN 配置

```cisco
! 创建 VLAN
vlan 10
 name Management
vlan 20
 name Office
vlan 30
 name DMZ

! 配置接入端口
interface GigabitEthernet1/0/1
 switchport mode access
 switchport access vlan 10
 spanning-tree portfast

! 配置 Trunk 端口（连接交换机之间）
interface GigabitEthernet1/0/24
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30

! VLAN 间 ACL（在路由器/三层交换机上）
access-list 101 permit tcp 10.1.20.0 0.0.0.255 10.1.30.0 0.0.0.255 eq 80
access-list 101 permit tcp 10.1.20.0 0.0.0.255 10.1.30.0 0.0.0.255 eq 443
access-list 101 deny ip 10.1.20.0 0.0.0.255 10.1.30.0 0.0.0.255
access-list 101 permit ip any any
```

---

## 八、微分段技术

### 8.1 微分段概念

微分段（Micro-segmentation）将安全控制粒度从网络层细化到工作负载层（单台 VM/容器）：

```
传统分段 vs 微分段：

传统 VLAN 分段：                微分段：
┌─────────────┐               ┌─────────────┐
│  Web VLAN    │               │  Web-01     │ ← 独立策略
│  ┌───┐ ┌───┐ │               │  Web-02     │ ← 独立策略
│  │W1 │ │W2 │ │               │  App-01     │ ← 独立策略
│  └───┘ └───┘ │               │  App-02     │ ← 独立策略
└─────────────┘               │  DB-01      │ ← 独立策略
┌─────────────┐               └─────────────┘
│  App VLAN    │
│  ┌───┐ ┌───┐ │              策略示例：
│  │A1 │ │A2 │ │              Web-01 → App-01: TCP 8080
│  └───┘ └───┘ │              Web-01 → App-02: DENY
└─────────────┘              App-01 → DB-01: TCP 3306
┌─────────────┐              App-02 → DB-01: DENY
│  DB VLAN     │
│  ┌───┐ ┌───┐ │
│  │D1 │ │D2 │ │
│  └───┘ └───┘ │
└─────────────┘
```

### 8.2 Kubernetes 网络策略

```yaml
# Kubernetes NetworkPolicy - 微分段实现
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-allow-from-frontend
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Ingress
  ingress:
    # 只允许来自 frontend Pod 的流量
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 8080
    # 允许来自监控系统的流量
    - from:
        - namespaceSelector:
            matchLabels:
              name: monitoring
      ports:
        - protocol: TCP
          port: 9090
---
# 默认拒绝所有入站流量
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: production
spec:
  podSelector: {}
  policyTypes:
    - Ingress
```

---

## 九、零信任网络架构

### 9.1 零信任核心原则

零信任（Zero Trust）的核心思想是 **"永不信任，始终验证"**：

```
零信任三大原则：

1. 显式验证 (Verify Explicitly)
   - 基于所有可用数据点（身份、位置、设备健康、数据分类）进行认证和授权
   - 不是"在网络内就安全"

2. 最小权限访问 (Least Privilege Access)
   - 使用 JIT（Just-In-Time）和 JEA（Just-Enough-Access）
   - 限制横向移动

3. 假设被入侵 (Assume Breach)
   - 最小化爆炸半径
   - 端到端加密
   - 持续分析检测威胁
```

### 9.2 零信任架构组件

```
零信任架构参考模型 (NIST SP 800-207)：

┌──────────────────────────────────────────────┐
│               策略引擎 (Policy Engine)         │
│   - 基于身份、设备、上下文做出访问决策         │
│   - 实时风险评估                              │
└──────────────────┬───────────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
┌───▼────┐   ┌────▼─────┐   ┌───▼─────┐
│ 身份源  │   │ 设备健康  │   │ 威胁情报 │
│ (IdP)  │   │ (MDM)    │   │ (TI)    │
│ Azure AD│   │ Intune   │   │ MISP    │
└────────┘   └──────────┘   └─────────┘
                   │
         ┌─────────▼─────────┐
         │  策略执行点 (PEP)   │
         │  - 代理/网关       │
         │  - 每会话/每请求    │
         └───────────────────┘
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | VPN 三要素 | ★★★★★ | 低 | 加密、认证、完整性 |
| 2 | IPSec ESP vs AH | ★★★★★ | 中 | ESP 加密+认证，AH 仅认证 |
| 3 | IPSec 两种模式 | ★★★★☆ | 中 | 传输模式（只加密载荷），隧道模式（加密整个包） |
| 4 | IKE 端口 | ★★★★☆ | 低 | UDP 500 (IKE)，UDP 4500 (NAT-T) |
| 5 | SSL VPN vs IPSec VPN | ★★★★☆ | 中 | SSL VPN 客户端免安装、基于浏览器 |
| 6 | WireGuard 默认端口 | ★★★☆☆ | 低 | UDP 51820 |
| 7 | 网络隔离层级 | ★★★★☆ | 中 | 物理→VLAN→子网→微分段→应用 |
| 8 | 零信任核心原则 | ★★★★☆ | 中 | 永不信任、始终验证；最小权限；假设被入侵 |

### 💡 知识巧记口诀

> **"加密认证完整性，VPN 三要素缺一不可"** — VPN 安全三要素
>
> **"ESP 加密加认证，AH 只能做认证"** — IPSec 两种安全协议的核心区别
>
> **"IKE 五百起，NAT-T 四五洞"** — IKE 用 UDP 500，NAT 穿越用 UDP 4500
>
> **"WireGuard 五幺八二零，一行代码就搞定"** — WireGuard 默认端口 51820，配置极简
>
> **"永不信任总验证，最小权限假设侵"** — 零信任三大原则

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "VPN 加密了就绝对安全" | ❌ 错误！VPN 只保护传输过程，如果终端被入侵，VPN 反而成为攻击者进入内网的通道 |
| "PPTP 还可以用" | ❌ 错误！PPTP 的 MS-CHAPv2 已被破解，密码可被离线暴力破解，应禁用 |
| "IPSec 比 SSL VPN 更安全" | ❌ 错误！两者安全性取决于配置，配置不当的 IPSec 可能比正确配置的 SSL VPN 更不安全 |
| "VLAN 可以完全隔离流量" | ❌ 错误！VLAN 是逻辑隔离，VLAN 跳跃攻击（VLAN Hopping）可以绕过 |
| "零信任就是不用 VPN" | ❌ 错误！零信任是一种安全理念，仍然可以使用 VPN 作为传输加密手段 |

---

## 学习建议

1. 🖥️ **搭建 WireGuard VPN**：在两台虚拟机之间配置 WireGuard，测试性能和安全性
2. 🔧 **配置 StrongSwan IPSec**：搭建 Site-to-Site IPSec VPN，抓包分析 IKE 协商过程
3. 🧪 **测试 VLAN 隔离**：在交换机上配置多个 VLAN，用 ACL 控制 VLAN 间路由
4. 🔍 **审计现有 VPN**：检查现有 VPN 的加密算法、协议版本是否符合安全标准
5. 📊 **设计网络隔离方案**：为假设的中型企业设计一套网络隔离方案
6. 🎯 **了解零信任产品**：研究 Zscaler、Netskope 等零信任产品的架构原理

---

> **VPN 是通往企业内网的"数字隧道"，网络隔离是限制爆炸半径的"防火墙"。两者结合，才能构建真正安全的远程访问架构。**
""")

print("Day 10 done")

# ============================================================
# Day 11: IDS/IPS调优
# ============================================================
gen('day-11.md', r"""# Day 11：IDS/IPS调优

> **📘 文档定位**：CISP 考试核心基础 | 难度：中高级 | 预计阅读：45 分钟
>
> 部署 IDS/IPS 只是开始，持续调优才是发挥其真正价值的关键。未经调优的 IDS 会产生大量误报，导致"狼来了"效应。本章从规则优化、阈值调整、性能调优到告警验证，系统讲解如何将 IDS/IPS 从"噪音发生器"调校为"精准威胁猎手"。

---

## 导航目录

- [一、IDS/IPS 调优的必要性](#一idsips-调优的必要性)
- [二、规则集优化策略](#二规则集优化策略)
- [三、阈值与时间窗口调优](#三阈值与时间窗口调优)
- [四、白名单与抑制策略](#四白名单与抑制策略)
- [五、性能调优实战](#五性能调优实战)
- [六、告警质量评估体系](#六告警质量评估体系)
- [七、调优工具与自动化](#七调优工具与自动化)
- [八、持续调优生命周期](#八持续调优生命周期)
- [九、调优案例分析](#九调优案例分析)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、IDS/IPS 调优的必要性

### 1.1 未调优 IDS 的典型问题

| 问题 | 表现 | 数据 |
|:---|:---|:---|
| **告警洪流** | 每天数千条告警，分析师无法处理 | 平均每个 SOC 每天收到 10000+ 告警 |
| **高误报率** | 大量告警实际不是攻击 | 未调优 IDS 误报率可达 50-70% |
| **告警疲劳** | 分析师习惯性忽略告警 | 41% 的分析师承认曾忽略过告警 |
| **真实威胁被淹没** | 关键告警混在噪音中 | 平均 MTTD 从分钟级变为小时级 |

### 1.2 调优目标

| 指标 | 调优前 | 调优目标 |
|:---|:---|:---|
| 日告警量 | 10000+ | 500-1000 |
| 误报率 | 50-70% | < 20% |
| 告警处理率 | 30-40% | > 90% |
| MTTD | 数小时 | < 30 分钟 |
| 真阳性告警响应时间 | 数小时 | < 15 分钟 (Critical) |

---

## 二、规则集优化策略

### 2.1 规则分级管理

```
规则分级金字塔：

        ┌─────────┐
        │ 关键规则 │  100-200 条  → 必须启用，高优先级
        │ (P1/P2) │
       ┌┴─────────┴┐
       │  重要规则  │  300-500 条  → 默认启用，定期审核
       │  (P3)     │
      ┌┴───────────┴┐
      │  可选规则    │  500-1000 条 → 按需启用
      │  (P4/P5)   │
     ┌┴─────────────┴┐
     │   实验性规则   │  200-500 条  → 测试中，仅记录不告警
     └───────────────┘
```

### 2.2 按资产定制规则

不是所有规则都适用于所有环境。根据资产类型选择规则：

```bash
# 规则分类示例

# Web 服务器（只需 Web 相关规则）
# 不需要：数据库规则、邮件规则
# 需要：Web 攻击规则 (SQLi, XSS, LFI, RFI, WebShell)

# 数据库服务器（只需数据库相关规则）
# 不需要：HTTP 规则
# 需要：数据库访问规则 (Oracle, MySQL, MSSQL)

# 域控制器（只需 AD 相关规则）
# 不需要：Web 规则
# 需要：AD 认证规则、Kerberos 攻击规则 (Golden Ticket, DCSync)

# 按资产分组的 Snort 配置
# snort.lua
ips = {
    variables = {
        WEB_SERVERS = [[ 10.1.1.100, 10.1.1.101 ]],
        DB_SERVERS = [[ 10.1.2.100, 10.1.2.101 ]],
        DC_SERVERS = [[ 10.1.3.10, 10.1.3.11 ]],
    },
    include = RULE_PATH .. '/web-server-rules.rules',
    # 仅对 Web 服务器加载 Web 规则
}
```

### 2.3 禁用低价值规则

```suricata
# 识别并禁用低价值规则的标准：

# 1. 触发频率过高（> 1000次/天）且几乎都是误报
# 2. 针对已不存在的系统/服务
# 3. 检测的攻击技术已被其他规则覆盖（重复规则）
# 4. 产生大量 "notice" 级别告警但从未升级为事件

# 禁用规则示例
# 将规则 SID 添加到 disable.conf
# /etc/suricata/disable.conf
1:2000001  # 该规则每天触发 5000+ 次，已确认为正常业务行为
1:2000347  # 针对已下线的旧系统的规则
```

---

## 三、阈值与时间窗口调优

### 3.1 阈值调优方法

```python
class ThresholdOptimizer:
    # IDS 阈值优化器
    def analyze_threshold(self, historical_alerts, rule_id):
        # 分析历史告警数据，推荐最优阈值
        import numpy as np

        # 统计不同阈值下的告警数量
        thresholds = {}
        for threshold in range(1, 21):
            count = sum(1 for alert in historical_alerts
                       if alert['count'] >= threshold)
            thresholds[threshold] = count

        # 寻找拐点（Elbow Method）
        # 阈值增加时，告警数量下降最快的点
        best_threshold = self._find_elbow(thresholds)
        return {
            'recommended_threshold': best_threshold,
            'expected_alerts_per_day': thresholds[best_threshold],
            'reduction_percentage': (1 - thresholds[best_threshold] /
                                     thresholds[1]) * 100
        }

    def _find_elbow(self, thresholds):
        # 使用肘部法则找最优阈值
        # 计算相邻阈值间告警数量的下降率
        values = list(thresholds.values())
        decreases = [(values[i] - values[i+1]) / values[i]
                    for i in range(len(values)-1)]

        # 找到下降率显著变缓的点
        for i in range(1, len(decreases)):
            if decreases[i] < decreases[0] * 0.3:
                return i + 2  # +2 因为索引从 1 开始
        return 5  # 默认阈值
```

### 3.2 常见阈值调优案例

| 场景 | 默认阈值 | 调优后阈值 | 原因 |
|:---|:---|:---|:---|
| SSH 暴力破解 | 5次/5分钟 | 10次/5分钟 | 内部运维脚本偶尔输入错误密码 |
| 端口扫描 | 10端口/分钟 | 20端口/分钟 | 正常资产扫描也会触发 |
| SQL 注入 | 每条都告警 | 同一 IP 3次/小时 | 减少自动化扫描噪音 |
| DNS 隧道 | 查询长度 > 52 | 查询长度 > 64 + NXDOMAIN | 某些 CDN 域名本身较长 |

---

## 四、白名单与抑制策略

### 4.1 白名单设计原则

白名单是降低误报最有效的方法之一，但过度使用会引入安全风险：

```
白名单设计原则：

1. 尽量窄：白名单应尽可能精确
   ✓ 允许 192.168.1.100 访问 10.1.1.50:22
   ✗ 允许 192.168.1.0/24 访问 any

2. 有时效：临时白名单应设有效期
   ✓ 允许 1 小时（维护窗口）
   ✗ 永久允许

3. 有审批：白名单添加需要审批流程
   ✓ 提交申请 → Tier 2 审批 → SOC 经理批准
   ✗ 分析师自行添加

4. 可审计：白名单变更记录应完整
   ✓ 谁、何时、为什么、审批人
```

### 4.2 Suricata 抑制配置

```yaml
# /etc/suricata/threshold.config

# 格式：gen_id:sig_id, type, track, count, seconds

# 抑制特定 IP 产生的特定告警
suppress gen_id 1, sig_id 2001234, track by_src, ip 10.1.1.50

# 抑制来自内部扫描器的告警
suppress gen_id 1, sig_id 2002345, track by_src, ip 10.1.1.0/24

# 阈值限制（同一来源 60 秒内最多 1 条告警）
event_filter gen_id 1, sig_id 2003456, type limit, track by_src, count 1, seconds 60

# 阈值触发（同一来源 300 秒内 5 次才告警）
event_filter gen_id 1, sig_id 2004567, type threshold, track by_src, count 5, seconds 300

# 两者结合（5 分钟内达到 10 次才告警，且之后 60 秒内最多 1 条）
event_filter gen_id 1, sig_id 2005678, type both, track by_src, count 10, seconds 300
```

---

## 五、性能调优实战

### 5.1 Suricata 性能调优

```yaml
# suricata.yaml 性能优化配置

# 1. CPU 亲和性
threading:
  set-cpu-affinity: yes
  cpu-affinity:
    - management-cpu-set:
        cpu: [ 0 ]
    - worker-cpu-set:
        cpu: [ 1,2,3,4,5,6,7,8,9,10,11 ]
        mode: "exclusive"
    - detect-cpu-set:
        cpu: [ 1,2,3,4,5,6,7,8,9,10,11 ]

# 2. 内存配置
flow:
  memcap: 2gb
  hash-size: 1048576
  prealloc: 1048576
  emergency-recovery: 30

stream:
  memcap: 4gb
  depth: 1mb
  reassembly:
    memcap: 2gb
    depth: 1mb

# 3. 规则性能优化
detect:
  profile: high
  custom-values:
    toclient-groups: 100
    toserver-groups: 500
  prefilter:
    default: on
  sgh-mpm-context: auto
  inspection-recursion-limit: 3000

# 4. 数据包采集优化
af-packet:
  - interface: eth0
    threads: 8
    cluster-id: 99
    cluster-type: cluster_flow
    defrag: yes
    use-mmap: yes
    ring-size: 200000
    block-size: 1048576

# 5. 关闭不需要的协议解析
app-layer:
  protocols:
    http:
      enabled: yes
    dns:
      enabled: yes
    smtp:
      enabled: no    # 如果不处理邮件流量
    smb:
      enabled: yes
    ftp:
      enabled: no    # 如果不使用 FTP
```

### 5.2 Snort 性能调优

```lua
-- snort.lua 性能优化

-- 1. 检测引擎配置
detection = {
    pcre_match_limit = 1500,
    pcre_match_limit_recursion = 1500,
}

-- 2. 流配置
stream = {
    tcp = {
        session_timeout = 3600,
        max_window = 65535,
    },
    ip = {
        session_timeout = 180,
    },
    icmp = {
        session_timeout = 30,
    },
}

-- 3. 包处理
active = {
    responses = 5,
    min_interval = 5,
}

-- 4. 性能监控
perf_monitor = {
    time = 60,
    flow = true,
    events = true,
    max_flows = 100000,
    max_file_size = 1073741824,
}
```

### 5.3 性能测试工具

```bash
# 使用 tcpreplay 回放 PCAP 测试 IDS 性能
tcpreplay --intf1=eth0 --topspeed --multiplier=2.0 test_traffic.pcap

# 使用 iperf3 生成测试流量
# 服务端
iperf3 -s
# 客户端（生成 10Gbps 流量）
iperf3 -c <ids_ip> -t 300 -P 10 -b 10G

# 监控 IDS 性能指标
# Suricata 统计
suricatasc -c "iface-stat eth0"
suricatasc -c "uptime"

# 查看丢包情况
suricatasc -c "iface-bypassed-stat eth0"
```

---

## 六、告警质量评估体系

### 6.1 告警质量指标

| 指标 | 公式 | 目标值 |
|:---|:---|:---|
| **真阳性率 (TPR/Recall)** | TP / (TP + FN) | > 90% |
| **误报率 (FPR)** | FP / (FP + TN) | < 10% |
| **精确率 (Precision)** | TP / (TP + FP) | > 80% |
| **F1 分数** | 2 × P × R / (P + R) | > 0.85 |
| **告警-事件转化率** | 升级为事件数 / 总告警数 | > 5% |

### 6.2 告警质量仪表板

应定期（每周/每月）统计和展示以下指标：
- 各规则的告警量趋势（识别告警洪流规则）
- 误报率 Top 10 规则（优先调优目标）
- 真阳性告警类型分布（了解主要威胁）
- 被忽略/关闭的告警比例（告警疲劳指标）
- 平均告警处理时间（效率指标）

---

## 七、调优工具与自动化

### 7.1 自动化调优框架

```python
# IDS 规则自动调优框架
import pandas as pd
from datetime import datetime, timedelta

class IDSAutoTuner:
    # IDS 规则自动调优器
    def __init__(self, alert_data):
        self.alerts = pd.DataFrame(alert_data)
        self.tuning_recommendations = []

    def analyze(self):
        # 分析告警数据，生成调优建议
        self._find_noisy_rules()
        self._find_never_triggered_rules()
        self._suggest_threshold_adjustments()
        self._find_redundant_rules()
        return self.tuning_recommendations

    def _find_noisy_rules(self):
        # 找出告警量过高的规则
        rule_counts = self.alerts.groupby('rule_id').size()
        avg_count = rule_counts.mean()
        for rule_id, count in rule_counts.items():
            if count > avg_count * 5:  # 超过平均 5 倍
                self.tuning_recommendations.append({
                    'rule_id': rule_id,
                    'action': 'SUPPRESS_OR_DISABLE',
                    'reason': f'High volume: {count} alerts (5x average)',
                    'suggestion': 'Consider adding suppression or increasing threshold'
                })

    def _find_never_triggered_rules(self):
        # 找出从未触发的规则
        triggered_rules = set(self.alerts['rule_id'].unique())
        all_rules = set(self._load_all_rule_ids())
        for rule_id in all_rules - triggered_rules:
            self.tuning_recommendations.append({
                'rule_id': rule_id,
                'action': 'REVIEW',
                'reason': 'Never triggered in 90 days',
                'suggestion': 'Consider removing or verifying rule logic'
            })

    def _suggest_threshold_adjustments(self):
        # 建议阈值调整
        # 对每条规则，计算当前阈值下的告警分布
        pass

    def _find_redundant_rules(self):
        # 找出冗余规则（检测相同攻击的重复规则）
        pass
```

### 7.2 调优日志记录

```markdown
# 调优变更日志模板

## 变更 #2024-001
- 日期：2024-06-15
- 操作人：张三 (Tier 2)
- 审批人：李四 (SOC Manager)
- 规则 SID：2001234
- 操作：增加阈值（5→10）
- 原因：该规则每天产生 500+ 告警，99% 为内部运维脚本触发
- 预期效果：告警量减少 80%，不影响检出率
- 回滚计划：如一周内 SSH 暴力破解检出率下降，恢复原阈值
```

---

## 八、持续调优生命周期

```
IDS/IPS 持续调优生命周期：

    ┌──────────────────────────────┐
    │  1. 部署基线规则              │
    │  (默认规则集，检测模式)        │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │  2. 收集告警数据（2-4 周）     │
    │  - 告警量统计                 │
    │  - 误报/真阳标记              │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │  3. 分析并生成调优建议         │
    │  - 识别噪音规则               │
    │  - 添加白名单                 │
    │  - 调整阈值                   │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │  4. 实施调优变更              │
    │  - 测试环境验证               │
    │  - 生产环境部署               │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │  5. 验证调优效果              │
    │  - 告警量变化                 │
    │  - 检出率变化                 │
    │  - 误报率变化                 │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │  6. 持续监控 → 回到步骤 2      │
    └──────────────────────────────┘

调优频率建议：
- 新部署：每周调优
- 稳定期：每月调优
- 成熟期：每季度调优
```

---

## 九、调优案例分析

### 9.1 案例：Web 服务器 IDS 调优

**背景**：为 10 台 Web 服务器部署了 Suricata，使用 ET Open 规则集

**初始状态**：
- 日均告警量：8500 条
- 可处理率：30%
- 主要误报来源：内部监控系统扫描、CDN 回源

**调优步骤**：

```
第 1 步：白名单内部系统
  - 添加监控系统 IP 到白名单：告警减少 2000/天
  - 添加 CDN 回源 IP 到白名单：告警减少 1500/天

第 2 步：禁用不适用规则
  - 禁用针对邮件服务器 (SMTP) 的规则：告警减少 800/天
  - 禁用针对数据库 (Oracle/MSSQL) 的规则：告警减少 600/天

第 3 步：调整阈值
  - SQL 注入规则：阈值从 1 次/小时 → 3 次/小时（同 IP）
  - 扫描规则：阈值从 10 端口/分钟 → 20 端口/分钟

第 4 步：添加业务白名单
  - 搜索接口包含 "select" 是正常业务：添加参数白名单

最终结果：
  - 日均告警量：8500 → 1200（减少 86%）
  - 可处理率：30% → 95%
  - 未漏报已知攻击事件
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | IDS 调优的必要性 | ★★★★☆ | 低 | 降低误报、减少告警疲劳、提高真阳检出 |
| 2 | 白名单设计原则 | ★★★★☆ | 中 | 尽量窄、有时效、有审批、可审计 |
| 3 | 阈值调优方法 | ★★★☆☆ | 中 | 肘部法则、基于历史数据的统计分析 |
| 4 | Suricata 阈值配置 | ★★★☆☆ | 中 | threshold.conf：suppress/limit/threshold |
| 5 | IDS 性能优化要点 | ★★★☆☆ | 高 | CPU 亲和性、内存配置、关闭不必要协议解析 |
| 6 | 告警质量指标 | ★★★★☆ | 中 | TPR、FPR、Precision、F1 |
| 7 | 调优生命周期 | ★★★★☆ | 中 | 部署→收集→分析→实施→验证→监控 |
| 8 | 规则分级管理 | ★★★☆☆ | 中 | 关键(P1/P2)→重要(P3)→可选(P4/P5)→实验 |

### 💡 知识巧记口诀

> **"白名单要窄时效，审批审计四原则"** — 白名单设计四原则
>
> **"suppress 压告警，threshold 设门槛，limit 限频率"** — Suricata 三种阈值配置类型
>
> **"部署收集分析改，验证监控循环来"** — IDS 调优六步生命周期
>
> **"告警多不一定是好事，告警少不一定是坏事"** — 调优的核心是平衡检出率和误报率

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "IDS 部署后不需要调优" | ❌ 错误！未调优的 IDS 误报率极高，实际价值很低 |
| "把产生告警最多的规则都禁掉就好" | ❌ 错误！告警多不一定是误报，可能是真实攻击高发 |
| "白名单加得越多越好" | ❌ 错误！过多的白名单会留下安全盲区，攻击者可能利用白名单 IP 绕过检测 |
| "阈值调得越高越安全" | ❌ 错误！过高阈值可能导致漏报（如暴力破解阈值从 5 调到 100） |

---

## 学习建议

1. 📊 **分析现有 IDS 告警**：导出一个月告警数据，统计各规则的告警量，识别 Top 10 噪音规则
2. 🔧 **实践阈值调优**：为 3-5 条高频告警规则分析历史数据，推荐最优阈值
3. 📋 **建立白名单管理流程**：设计白名单申请、审批、过期流程
4. 🧪 **测试调优效果**：使用 PCAP 回放测试调优前后的告警量和检出率
5. 📈 **建立告警质量仪表板**：跟踪 TPR、FPR、告警量趋势等指标
6. 🔄 **实施持续调优**：制定每月的调优计划，形成制度化流程

---

> **好的 IDS 不是部署出来的，是调出来的。每一次精准的阈值调整、每一个合理的白名单，都在把 IDS 从"噪音制造机"变成"威胁猎手"。**
""")

print("Day 11 done")

# Continuing to generate remaining days (12-30)...

# ============================================================
# Day 12: DDoS防护
# ============================================================
gen('day-12.md', r"""# Day 12：DDoS防护

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：45 分钟
>
> DDoS（分布式拒绝服务）攻击是互联网上最常见、破坏性最大的攻击形式之一。2023 年全球 DDoS 攻击次数超过 1500 万次，最大攻击流量达到 Tbps 级别。本章从 DDoS 攻击类型、检测方法、防护体系到应急响应，系统讲解 DDoS 防护的完整知识体系。

---

## 导航目录

- [一、DDoS 攻击概述与分类](#一ddos-攻击概述与分类)
- [二、网络层 DDoS 攻击详解](#二网络层-ddos-攻击详解)
- [三、应用层 DDoS 攻击详解](#三应用层-ddos-攻击详解)
- [四、DDoS 检测技术](#四ddos-检测技术)
- [五、DDoS 防护体系架构](#五ddos-防护体系架构)
- [六、云清洗方案](#六云清洗方案)
- [七、DDoS 应急响应](#七ddos-应急响应)
- [八、知名 DDoS 案例复盘](#八知名-ddos-案例复盘)
- [九、DDoS 防护工具与命令](#九ddos-防护工具与命令)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、DDoS 攻击概述与分类

### 1.1 DDoS 定义

DDoS（Distributed Denial of Service，分布式拒绝服务攻击）是指攻击者利用多个分布式的攻击源（僵尸网络），向目标发送大量请求，耗尽目标的网络带宽或系统资源，导致正常用户无法访问。

> **🔑 高分考点**：DoS 是单源攻击，DDoS 是多源分布式攻击。DDoS 更难防御，因为攻击流量来自大量不同的 IP 地址。

### 1.2 DDoS 攻击分类

```
DDoS 攻击分类体系：

┌──────────────────────────────────────────────────────────┐
│                      DDoS 攻击                            │
├─────────────────────────┬────────────────────────────────┤
│    网络层 (L3/L4)       │      应用层 (L7)               │
├─────────────────────────┼────────────────────────────────┤
│ • SYN Flood             │ • HTTP Flood (CC 攻击)          │
│ • UDP Flood             │ • Slowloris (慢速攻击)          │
│ • ICMP Flood            │ • DNS Query Flood              │
│ • DNS Amplification     │ • HTTP POST Flood              │
│ • NTP Amplification     │ • Slow Read Attack             │
│ • Memcached Amplification│ • HashDoS                      │
│ • IP Fragmentation      │ • XML-RPC Flood                │
│ • ACK Flood             │ • API Flood                    │
│ • RST Flood             │                                │
└─────────────────────────┴────────────────────────────────┘

放大系数 (Amplification Factor)：
DNS:   28-54x   (8 字节查询 → 最多 432 字节响应)
NTP:   556x     (monlist 命令)
Memcached: 51000x (史上最高放大系数)
CLDAP: 46-55x
SSDP:  30x
```

### 1.3 DDoS 攻击趋势

| 年份 | 最大攻击规模 | 平均攻击规模 | 主要变化 |
|:---|:---|:---|:---|
| 2018 | 1.7 Tbps (Memcached) | 5 Gbps | 放大攻击成为主流 |
| 2020 | 2.3 Tbps (AWS Shield) | 10 Gbps | COVID-19 期间攻击激增 |
| 2022 | 3.47 Tbps (Azure) | 20 Gbps | 应用层攻击占比上升 |
| 2023 | 398M rps (HTTP/2 Rapid Reset, CVE-2023-44487) | 50 Gbps | HTTP/2 零日漏洞利用 |

---

## 二、网络层 DDoS 攻击详解

### 2.1 SYN Flood 攻击

SYN Flood 是最经典的 DDoS 攻击，利用 TCP 三次握手的特性：

```
正常 TCP 三次握手：            SYN Flood 攻击：

客户端        服务器            攻击者         服务器
  │──SYN──────→│                 │──SYN─────────→│
  │            │(分配资源)        │──SYN─────────→│ (半连接队列满)
  │←──SYN+ACK─│                 │──SYN─────────→│
  │            │                 │──SYN─────────→│
  │──ACK──────→│                 │──SYN─────────→│
  │            │(连接建立)        │  ...            │ (无法响应正常请求)
```

**SYN Flood 防御**：

```bash
# Linux 内核参数调优
# 1. 启用 SYN Cookies（最有效的防御）
sysctl -w net.ipv4.tcp_syncookies=1

# 2. 调整 SYN 队列大小
sysctl -w net.ipv4.tcp_max_syn_backlog=8192

# 3. 减少 SYN+ACK 重试次数
sysctl -w net.ipv4.tcp_synack_retries=2

# 4. 缩短 TIME_WAIT 超时
sysctl -w net.ipv4.tcp_fin_timeout=15

# 5. 启用 TCP Fast Open（减少握手开销）
sysctl -w net.ipv4.tcp_fastopen=3

# 6. iptables 限制 SYN 速率
iptables -A INPUT -p tcp --syn -m limit --limit 100/s --limit-burst 200 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP
```

### 2.2 DNS 放大攻击

DNS 放大攻击利用 DNS 服务器的响应比请求大得多的特性：

```
攻击者 → DNS 解析器（伪造源 IP 为受害者 IP）
DNS 解析器 → 受害者（大量 DNS 响应）

攻击请求示例（60 字节）：
dig ANY isc.org @8.8.8.8

响应大小：~3000 字节
放大系数：3000 / 60 = 50x
```

**DNS 放大攻击防御**：
- 关闭开放递归（Open Resolver）
- 实施 Response Rate Limiting (RRL)
- 使用 BCP38（入口过滤，防止 IP 欺骗）

```bash
# BIND 配置：限制递归查询来源
acl "trusted" { 192.168.0.0/16; 10.0.0.0/8; };
options {
    allow-recursion { trusted; };
    rate-limit {
        responses-per-second 5;
        window 5;
    };
};
```

### 2.3 Memcached 放大攻击（CVE-2018-1000115）

Memcached UDP 端口 11211 的反射放大攻击，放大系数高达 51000 倍：

```bash
# 检测本机是否开放 Memcached UDP
nmap -sU -p 11211 --script memcached-info <target>

# 攻击请求（通过伪造源 IP 实现反射）
# 攻击者向 Memcached 服务器发送 stats 命令
# 响应可达数 MB，全部发送到伪造的源 IP（受害者）

# 防御：
# 1. Memcached 绑定 127.0.0.1，不监听公网
# 2. 禁用 UDP（默认只使用 TCP）
# 3. 防火墙封锁 UDP 11211
```

---

## 三、应用层 DDoS 攻击详解

### 3.1 HTTP Flood (CC 攻击)

CC（Challenge Collapsar）攻击模拟正常用户行为，发起大量 HTTP 请求：

```
HTTP Flood 特征：
- 请求 URL 看似正常（GET /index.html）
- User-Agent 可能使用真实浏览器 UA
- 请求频率远超正常用户
- 来源 IP 分布广泛（代理池、肉鸡）

防护方法：
1. 行为分析：识别请求模式（频率、URL 分布、会话持续性）
2. JS Challenge：要求客户端执行 JavaScript 验证
3. CAPTCHA：人机验证
4. 频率限制：单 IP/会话的请求速率限制
```

**Nginx 频率限制配置**：

```nginx
# 定义限流区域（基于 IP，10MB 可存储 16 万个 IP）
limit_req_zone $binary_remote_addr zone=perip:10m rate=10r/s;
limit_req_zone $server_name zone=perserver:10m rate=100r/s;

server {
    location / {
        # 单 IP 限流：10 req/s，突发 20
        limit_req zone=perip burst=20 nodelay;
        limit_req_status 429;

        proxy_pass http://backend;
    }
}
```

### 3.2 Slowloris 慢速攻击

Slowloris 通过保持大量不完整的 HTTP 连接来耗尽服务器连接池：

```python
# Slowloris 攻击原理
import socket

def slowloris_attack(target, port=80):
    # Slowloris 慢速攻击示意
    sockets = []
    for i in range(500):  # 创建 500 个连接
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect((target, port))
        # 发送不完整的 HTTP 请求头
        sock.send(b"GET / HTTP/1.1\r\n")
        sock.send(f"Host: {target}\r\n".encode())
        sock.send(b"User-Agent: Mozilla/5.0\r\n")
        # 不发送 \r\n\r\n（不结束请求头），连接保持打开
        sockets.append(sock)

    # 定期发送额外的 header 行，保持连接不超时
    while True:
        for sock in sockets:
            try:
                sock.send(f"X-Keep-Alive: {i}\r\n".encode())
            except:
                sockets.remove(sock)
        time.sleep(10)
```

**Slowloris 防御**：

```nginx
# Nginx 防 Slowloris 配置
# 限制请求头读取时间
client_header_timeout 10s;
client_body_timeout 10s;

# 限制请求头大小
client_header_buffer_size 1k;
large_client_header_buffers 2 1k;

# 限制单个 IP 的并发连接数
limit_conn_zone $binary_remote_addr zone=perip:10m;
limit_conn perip 10;

# 关闭慢速连接的 keepalive
keepalive_timeout 5s;
```

### 3.3 HTTP/2 Rapid Reset (CVE-2023-44487)

2023 年 10 月披露的 HTTP/2 零日漏洞，利用 HTTP/2 的流重置机制：

```
攻击原理：
1. 攻击者建立 HTTP/2 连接
2. 快速创建大量流（Stream）
3. 立即发送 RST_STREAM 帧取消每个流
4. 服务器需要为每个流分配/释放资源
5. 大量 RST 导致服务器资源耗尽

影响：单个 HTTP/2 连接即可发起 3.98 亿 RPS 攻击
修复：限制单连接的流重置速率
```

---

## 四、DDoS 检测技术

### 4.1 基于流量基线的检测

```python
class DDoSDetector:
    # 基于流量基线的 DDoS 检测器
    def __init__(self):
        self.baseline = {
            'packets_per_second': 10000,
            'bits_per_second': 100 * 1024 * 1024,  # 100 Mbps
            'unique_src_ips': 100,
            'syn_ratio': 0.1,  # SYN 包占总包比例
            'new_connections_per_second': 500,
        }

    def detect(self, traffic_stats):
        alerts = []
        # 1. 流量突增检测
        if traffic_stats['bps'] > self.baseline['bits_per_second'] * 5:
            alerts.append({'type': 'VOLUMETRIC_FLOOD', 'severity': 'HIGH'})

        # 2. 包速率突增（可能是小包攻击）
        if traffic_stats['pps'] > self.baseline['packets_per_second'] * 10:
            alerts.append({'type': 'PACKET_FLOOD', 'severity': 'HIGH'})

        # 3. SYN Flood 检测（SYN 比例异常）
        syn_ratio = traffic_stats['syn_packets'] / max(traffic_stats['total_packets'], 1)
        if syn_ratio > 0.8:  # 80% 以上的包是 SYN
            alerts.append({'type': 'SYN_FLOOD', 'severity': 'CRITICAL'})

        # 4. 源 IP 数量突增
        if traffic_stats['unique_src_ips'] > self.baseline['unique_src_ips'] * 20:
            alerts.append({'type': 'DISTRIBUTED_ATTACK', 'severity': 'HIGH'})

        return alerts
```

### 4.2 NetFlow/sFlow 分析

```bash
# 使用 nfdump 分析 NetFlow 数据
# 检测流量异常

# 查看 Top 10 流量来源
nfdump -R /data/netflow -s srcip -n 10

# 查看特定时间的流量
nfdump -R /data/netflow -t '2024/06/15.08:00:00-2024/06/15.09:00:00'

# 检测 ICMP Flood（ICMP 流量异常高）
nfdump -R /data/netflow -o "fmt:%sa %da %pr %pkt %byt" 'proto icmp' | head

# 检测 UDP 反射攻击（高流量 + 固定源端口）
nfdump -R /data/netflow -o "fmt:%sa %sp %pkt %byt" 'proto udp and src port 53'
```

---

## 五、DDoS 防护体系架构

### 5.1 多层防护架构

```
DDoS 多层防护体系：

第一层：ISP/运营商清洗
  ┌──────────────────────────────────────┐
  │  BGP FlowSpec / RTBH (黑洞路由)       │
  │  在运营商层面丢弃攻击流量              │
  └──────────────┬───────────────────────┘
                 │
第二层：云清洗中心 (Scrubbing Center)
  ┌──────────────────────────────────────┐
  │  BGP Anycast 引流 → 清洗 → 回注       │
  │  清洗能力：数百 Gbps ~ 数 Tbps        │
  └──────────────┬───────────────────────┘
                 │
第三层：本地清洗设备
  ┌──────────────────────────────────────┐
  │  硬件 DDoS 清洗设备 (如 A10, Radware) │
  │  清洗能力：数十 Gbps                  │
  └──────────────┬───────────────────────┘
                 │
第四层：主机层防护
  ┌──────────────────────────────────────┐
  │  iptables / nftables / WAF          │
  │  SYN Cookie / Rate Limiting          │
  └──────────────────────────────────────┘
```

### 5.2 BGP FlowSpec 配置

```cisco
! BGP FlowSpec 示例：将攻击流量重定向到清洗设备
!
! 定义 FlowSpec 规则
flow-spec route Attack-Mitigation
  match destination-address 203.0.113.10/32
  match protocol tcp
  match destination-port 80
  match packet-length > 0
!
! 动作：重定向到清洗设备的下一跳
  redirect ip 192.168.100.1
  set community 65000:666
```

---

## 六、云清洗方案

### 6.1 主流云清洗服务

| 服务商 | 全球清洗能力 | 特色功能 | 适用场景 |
|:---|:---|:---|:---|
| **Cloudflare** | 296 Tbps | Magic Transit, Spectrum | Web 应用 + 网络层 |
| **AWS Shield Advanced** | > 15 Tbps | 成本保护、DDoS 响应团队 | AWS 用户 |
| **Akamai Prolexic** | > 20 Tbps | 全球清洗中心 | 大型企业 |
| **阿里云 DDoS 高防** | > 10 Tbps | 国内线路优化 | 国内业务 |
| **腾讯云 DDoS 防护** | > 10 Tbps | 游戏行业专精 | 国内游戏 |

### 6.2 引流方案

```
DNS 引流 (常见)：
  正常：example.com → A → 1.2.3.4
  攻击：example.com → A → 清洗中心 IP → 回源到 1.2.3.4

BGP Anycast 引流：
  正常：AS 65000 宣告 203.0.113.0/24
  攻击：AS 65001 (清洗中心) 宣告更具体的 /32 路由
        → 流量被吸引到清洗中心 → 清洗后回注
```

---

## 七、DDoS 应急响应

### 7.1 DDoS 应急响应流程

```
DDoS 攻击应急响应流程：

1. 确认攻击 (5 分钟内)
   □ 确认流量异常
   □ 识别攻击类型 (SYN/UDP/HTTP/...)
   □ 通知相关团队

2. 启动防护 (15 分钟内)
   □ 启用云清洗（如果有）
   □ 启用本地清洗设备
   □ 启用 BGP RTBH（紧急情况下）
   □ 调整限流策略

3. 流量分析 (持续)
   □ 分析攻击特征（来源 IP/端口/载荷）
   □ 提取过滤规则
   □ 联系 ISP/上游

4. 业务恢复
   □ 验证正常用户可访问
   □ 监控业务指标
   □ 逐步调整防护策略

5. 事后分析
   □ 攻击溯源（如可能）
   □ 评估防护效果
   □ 更新防护策略
```

### 7.2 应急响应命令

```bash
# DDoS 应急响应常用命令

# 1. 快速查看流量情况
iftop -i eth0
nload eth0

# 2. 统计连接数（按 IP）
netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -nr | head -20

# 3. 统计各状态的 TCP 连接数
netstat -ant | awk '{print $6}' | sort | uniq -c | sort -nr

# 4. 查看 SYN_RECV 状态连接数（SYN Flood 指标）
netstat -ant | grep SYN_RECV | wc -l

# 5. 查看 Apache/Nginx 并发连接数
ss -ant | grep :80 | grep ESTAB | wc -l

# 6. 临时封禁大量 IP
# 提取 Top 50 攻击 IP 并封禁
netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -nr | head -50 | while read count ip; do
    iptables -A INPUT -s $ip -j DROP
done

# 7. 查看系统资源
top -bn1 | head -20
free -h
```

---

## 八、知名 DDoS 案例复盘

| 案例 | 年份 | 规模 | 攻击类型 | 教训 |
|:---|:---|:---|:---|:---|
| **GitHub DDoS** | 2018 | 1.35 Tbps | Memcached 放大 | 开放 Memcached 的危险性 |
| **Dyn DNS** | 2016 | ~1.2 Tbps | Mirai 僵尸网络 IoT 设备 | IoT 安全的重要性 |
| **Google** | 2017 | 2.54 Tbps | 多向量组合 | 即使是顶级公司也需要持续防护 |
| **AWS** | 2020 | 2.3 Tbps | UDP/CLDAP 反射 | 放大攻击依然是主流 |
| **Cloudflare (HTTP/2)** | 2023 | 398M rps | CVE-2023-44487 | 协议级漏洞的影响 |

---

## 九、DDoS 防护工具与命令

### 9.1 测试工具（仅用于授权测试）

```bash
# hping3 - SYN Flood 测试
hping3 -S --flood -p 80 target.com

# 慢速攻击测试
slowhttptest -c 1000 -H -g -o slowloris -i 10 -r 200 -t GET -u http://target.com -x 24 -p 3

# Apache Benchmark 压力测试
ab -n 10000 -c 100 http://target.com/

# siege 压力测试
siege -c 200 -t 60S http://target.com/
```

### 9.2 流量分析工具

```bash
# tcpdump 抓包分析
tcpdump -i eth0 -nn -c 10000 -w ddos_sample.pcap

# 统计协议分布
tcpdump -i eth0 -nn -c 10000 | awk '{print $3}' | cut -d. -f1 | sort | uniq -c

# 查看包大小分布
tcpdump -i eth0 -nn -c 10000 -v | grep -oP 'length \K\d+' | sort -n | uniq -c
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | DoS vs DDoS 区别 | ★★★★★ | 低 | DoS 单源，DDoS 多源分布式 |
| 2 | SYN Flood 原理 | ★★★★★ | 中 | 大量 SYN 耗尽半连接队列 |
| 3 | DNS 放大攻击放大系数 | ★★★★☆ | 中 | 28-54x |
| 4 | CC 攻击定义 | ★★★★☆ | 低 | Challenge Collapsar，HTTP 层 DDoS |
| 5 | SYN Cookie 防御 | ★★★★★ | 中 | 不预分配资源，等三次握手完成 |
| 6 | Slowloris 攻击原理 | ★★★★☆ | 中 | 大量不完整 HTTP 请求耗尽连接池 |
| 7 | DDoS 防护层次 | ★★★★☆ | 中 | ISP→云清洗→本地清洗→主机 |
| 8 | CVE-2023-44487 | ★★★☆☆ | 中 | HTTP/2 Rapid Reset，398M rps |

### 💡 知识巧记口诀

> **"SYN 洪水半连接，Cookie 防护不预分"** — SYN Flood 和 SYN Cookie 防御
>
> **"DNS 放大五十倍，Memcached 五万倍"** — 不同协议的放大系数
>
> **"Slowloris 慢连接，慢到服务器崩溃"** — Slowloris 慢速攻击原理
>
> **"ISP 云清本地主，四层防护逐级挡"** — DDoS 四层防护体系

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "DDoS 攻击只能来自外部" | ❌ 错误！内部主机被感染后也可以发起 DDoS（肉鸡） |
| "防火墙能完全防御 DDoS" | ❌ 错误！防火墙本身可能成为 DDoS 的攻击目标，大流量攻击需要上游清洗 |
| "CDN 能防御所有类型的 DDoS" | ❌ 错误！CDN 主要防御 HTTP 层攻击，对网络层 DDoS 效果有限 |
| "增加带宽就能解决 DDoS 问题" | ❌ 错误！攻击者总能找到更大的带宽，需要多层防护 |

---

## 学习建议

1. 🧪 **在实验环境中模拟 SYN Flood**：使用 hping3 发起 SYN Flood，用 SYN Cookie 防御
2. 📊 **分析真实 DDoS 数据**：下载公开的 DDoS PCAP 数据（如 CAIDA DDoS 数据集）
3. 🔧 **配置 Nginx 限流**：配置 limit_req 和 limit_conn 防御 CC 攻击
4. ☁️ **了解云清洗方案**：研究 Cloudflare/AWS Shield 的 DDoS 防护机制
5. 📖 **阅读 AWS DDoS 白皮书**：了解 Best Practices for DDoS Resiliency

---

> **DDoS 攻击无法完全避免，但可以通过多层防护体系将其影响降到最低。防护 DDoS 不是"堵住所有流量"，而是"在攻击洪流中让正常用户的请求能够通过"。**
""")

print("Day 12 done")

# ============================================================
# Day 13: DNS安全
# ============================================================
gen('day-13.md', r"""# Day 13：DNS安全

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：50 分钟
>
> DNS（域名系统）是互联网的"电话簿"，也是攻击者最常利用的基础设施之一。DNS 安全事件频发——从 DNS 劫持、缓存投毒到 DNS 隧道和 DGA 域名。本章从 DNS 协议安全机制（DNSSEC）、常见攻击类型、检测与防御方法到 DNS 安全产品，系统讲解 DNS 安全的全方位知识。

---

## 导航目录

- [一、DNS 协议基础与安全风险](#一dns-协议基础与安全风险)
- [二、DNS 劫持与缓存投毒](#二dns-劫持与缓存投毒)
- [三、DNSSEC 深度解析](#三dnssec-深度解析)
- [四、DNS 隧道检测与防御](#四dns-隧道检测与防御)
- [五、DGA 域名检测](#五dga-域名检测)
- [六、DNS 安全产品与方案](#六dns-安全产品与方案)
- [七、DNS 日志分析与威胁检测](#七dns-日志分析与威胁检测)
- [八、DNS over HTTPS (DoH) 安全](#八dns-over-https-doh-安全)
- [九、DNS 安全最佳实践](#九dns-安全最佳实践)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、DNS 协议基础与安全风险

### 1.1 DNS 查询流程

```
DNS 递归查询流程：

客户端                   本地 DNS 解析器          根服务器  .com TLD  example.com NS
  │                           │                     │         │         │
  │──www.example.com A?──────→│                     │         │         │
  │                           │──. NS?────────────→│         │         │
  │                           │←──.com NS─────────│         │         │
  │                           │──example.com NS?───→         │         │
  │                           │←──ns1.example.com──────────→│         │
  │                           │──www.example.com A?────────────────────→│
  │                           │←──1.2.3.4────────────────────────────────│
  │←──1.2.3.4────────────────│                     │         │         │
```

### 1.2 DNS 安全风险全景

| 风险类型 | 描述 | 严重程度 | 典型案例 |
|:---|:---|:---:|:---|
| **DNS 劫持** | 篡改 DNS 解析结果 | 严重 | 2019 年 Sea Turtle 攻击篡改多国政府域名 |
| **DNS 缓存投毒** | 向 DNS 缓存注入虚假记录 | 严重 | 2008 年 Kaminsky 漏洞 (CVE-2008-1447) |
| **DNS 隧道** | 利用 DNS 协议传输非 DNS 数据 | 高 | 数据外泄、C2 通信 |
| **DGA 域名** | 算法生成大量域名用于 C2 | 高 | Conficker、Locky 等恶意软件 |
| **DNS 放大攻击** | 利用 DNS 响应进行 DDoS | 高 | 反射放大攻击 |
| **DNS 重绑定** | 绕过同源策略 | 中 | 攻击内网设备 |
| **域名劫持** | 窃取域名管理权限 | 严重 | 域名注册商被攻击 |

> **🔑 高分考点**：DNS 使用 UDP 53 端口（默认），无加密、无认证（传统 DNS），这三大特性使其成为攻击者的理想目标。

---

## 二、DNS 劫持与缓存投毒

### 2.1 DNS 劫持类型

| 劫持类型 | 攻击位置 | 技术手段 | 防御 |
|:---|:---|:---|:---|
| **本地劫持** | 终端 hosts 文件 | 恶意软件修改 hosts | HIDS 监控 hosts 文件 |
| **路由器劫持** | 家庭/企业路由器 | 修改 DHCP DNS 设置 | 路由器固件更新、强密码 |
| **ISP 劫持** | ISP DNS 服务器 | ISP 层面篡改 | 使用公共 DNS (8.8.8.8/1.1.1.1) |
| **注册商劫持** | 域名注册商 | 社工/钓鱼获取注册商账号 | 2FA、Registry Lock |

### 2.2 Kaminsky 缓存投毒（CVE-2008-1447）

Dan Kaminsky 在 2008 年发现了一个影响几乎所有 DNS 服务器的严重漏洞：

```
Kaminsky 攻击原理：

1. 攻击者向受害 DNS 服务器查询 random.example.com
2. DNS 服务器向 example.com 的权威服务器查询
3. 攻击者同时发送大量伪造的 DNS 响应
   伪造响应中包含：
   - 对 random.example.com 的响应
   - 附加记录（glue record）：将 www.example.com 指向攻击者 IP

关键：16 位 Transaction ID (TXID) 只有 65536 种可能
      源端口也是固定的，所以只需猜测 TXID

修复：
- 源端口随机化（增加 65536 倍猜测难度）
- DNSSEC 加密签名验证
```

**检查 DNS 源端口随机化**：

```bash
# 测试 DNS 服务器是否启用了源端口随机化
dig +short porttest.dns-oarc.net TXT

# 如果结果显示端口是固定的，说明存在风险
```

---

## 三、DNSSEC 深度解析

### 3.1 DNSSEC 工作原理

DNSSEC（Domain Name System Security Extensions）通过数字签名保证 DNS 数据的完整性和真实性：

```
DNSSEC 信任链：

. (Root) ─── DS 记录 ───→ .com (TLD)
                              │
                         DS 记录
                              │
                              ▼
                      example.com (域名)
                              │
                         DNSKEY (ZSK/KSK)
                              │
                         RRSIG (签名)
                              │
                              ▼
                      www.example.com A 记录

DNSSEC 新增记录类型：
- RRSIG: 资源记录签名（Resource Record Signature）
- DNSKEY: DNS 公钥
- DS: 委派签名者（Delegation Signer），建立父子信任链
- NSEC/NSEC3: 否定存在证明（证明某个域名不存在）
```

### 3.2 DNSSEC 验证过程

```bash
# 使用 dig 验证 DNSSEC
# +dnssec 标志请求 DNSSEC 记录
dig +dnssec www.isc.org A

# 输出中包含 RRSIG 记录表示已签名
# 如果验证失败，状态会显示 SERVFAIL

# 测试 DNSSEC 验证
dig +dnssec sigfail.verteiltesysteme.net A
# 应返回 SERVFAIL（验证失败）

dig +dnssec sigok.verteiltesysteme.net A
# 应返回 A 记录 + RRSIG（验证成功）
```

### 3.3 DNSSEC 部署步骤

```bash
# BIND DNSSEC 配置步骤

# 1. 生成 ZSK (Zone Signing Key) 和 KSK (Key Signing Key)
dnssec-keygen -a ECDSAP256SHA256 -n ZONE example.com
dnssec-keygen -a ECDSAP256SHA256 -n ZONE -f KSK example.com

# 2. 将公钥添加到区域文件
cat Kexample.com.*.key >> /etc/bind/db.example.com

# 3. 签名区域
dnssec-signzone -A -3 $(head -c 1000 /dev/random | sha1sum | cut -b 1-16) \
  -N INCREMENT -o example.com -t /etc/bind/db.example.com

# 4. 配置 BIND 加载签名后的区域文件
# named.conf:
zone "example.com" {
    type master;
    file "/etc/bind/db.example.com.signed";
    auto-dnssec maintain;
    inline-signing yes;
};

# 5. 将 DS 记录提交到上级注册商
# DS 记录可从 dsset-example.com. 文件中获取
```

### 3.4 DNSSEC 关键算法

| 算法编号 | 算法名称 | 安全性 | 推荐 |
|:---:|:---|:---|:---:|
| 5 | RSA/SHA-1 | 已废弃 | ✗ |
| 7 | RSASHA1-NSEC3-SHA1 | 低 | ✗ |
| 8 | RSA/SHA-256 | 中 | ⚠️ |
| 10 | RSA/SHA-512 | 中 | ⚠️ |
| 13 | ECDSA P-256/SHA-256 | 高 | ✓ |
| 14 | ECDSA P-384/SHA-384 | 高 | ✓ |
| 15 | Ed25519 | 高 | ✓ |
| 16 | Ed448 | 极高 | ✓ |

---

## 四、DNS 隧道检测与防御

### 4.1 DNS 隧道原理

DNS 隧道利用 DNS 协议传输任意数据，绕过防火墙和内容过滤：

```
DNS 隧道工作原理：

被控主机                              攻击者控制的 DNS 服务器
    │                                         │
    │──TXT? data.exfil.example.com──────────→│ (查询中包含编码数据)
    │                                         │ (解码查询中的子域名)
    │←──TXT "base64_encoded_command"────────│ (响应中包含命令)
    │                                         │

常见 DNS 隧道工具：
- dnscat2: 功能最全的 DNS 隧道工具
- Iodine: 支持 IPv4 over DNS
- DNSExfiltrator: 数据外泄专用
```

### 4.2 DNS 隧道检测方法

| 检测方法 | 具体指标 | 检测工具/规则 |
|:---|:---|:---|
| **查询频率异常** | 单客户端 DNS 查询量 > 基线 10x | SIEM 规则 |
| **域名长度异常** | 查询域名长度 > 52 字符 | Suricata DNS 规则 |
| **域名熵值异常** | 子域名部分的熵值 > 3.5 | Python/ML 检测 |
| **记录类型异常** | TXT 记录占比过高 | DNS 统计 |
| **NXDOMAIN 响应率** | 高比例的不存在域名响应 | DNS RPZ |
| **查询时间模式** | 全天候规律查询（C2 心跳） | 时间序列分析 |

```suricata
# Suricata DNS 隧道检测规则
alert dns $HOME_NET any -> any 53 (
    msg:"DNS Tunnel - Long Query Domain";
    dns.query; content:"."; pcre:"/^[^.]{52,}\./R";
    classtype:trojan-activity;
    sid:5000001; rev:1;
)

alert dns $HOME_NET any -> any 53 (
    msg:"DNS Tunnel - High TXT Query Rate";
    dns_query;
    dns.rrtype: 16;  # TXT 记录类型
    threshold:type threshold, track by_src, count 50, seconds 60;
    classtype:trojan-activity;
    sid:5000002; rev:1;
)
```

### 4.3 DNS 隧道防御

```bash
# DNS RPZ (Response Policy Zone) 配置
# /etc/bind/named.conf
zone "rpz" {
    type master;
    file "/etc/bind/db.rpz";
    allow-query { none; };
};

# 在 named.conf.options 中启用 RPZ
response-policy {
    zone "rpz";
};

# /etc/bind/db.rpz - 策略区域文件
$TTL 60
@ SOA localhost. admin.example.com. (1 3600 600 86400 60)
  NS localhost.

; 封锁已知恶意域名
malware-c2.example.com    CNAME .   ; CNAME . 表示 NXDOMAIN
phishing-site.com         A 127.0.0.1
                           AAAA ::1

; 封锁整个恶意 TLD
*.top                     CNAME .
```

---

## 五、DGA 域名检测

### 5.1 DGA 原理

DGA（Domain Generation Algorithm）是恶意软件用于生成大量备选 C2 域名的算法：

```
DGA 工作流程：

1. 恶意软件内置 DGA 算法
2. 根据种子（日期、热门话题、随机数）生成域名列表
3. 逐一尝试解析这些域名
4. 成功解析的域名就是 C2 服务器地址

种子示例：
  - 基于时间：2024-06-15 → hash → "a7x9k2m4p1q8v3b6.com"
  - 基于 Twitter 趋势：热门话题 → hash → 域名
  - 基于数学常数：π 的小数位 → 域名

知名 DGA 恶意软件：
  - Conficker: 每天生成 50000 个域名
  - Locky: 基于时间的 DGA
  - Gameover ZeuS: 每天 1000 个域名
```

### 5.2 DGA 域名特征

| 特征 | 正常域名 | DGA 域名 |
|:---|:---|:---|
| **域名长度** | 5-15 字符（平均） | 12-30+ 字符 |
| **元音辅音比** | 接近 1:2 | 极低（几乎没有元音） |
| **N-gram 频率** | 符合自然语言分布 | 随机分布 |
| **WHOIS 信息** | 完整、合理 | 隐私保护或新注册 |
| **解析结果** | 通常有 IP | 大多 NXDOMAIN |
| **TLS 证书** | 有效证书 | 自签名或无证书 |

```python
# DGA 域名检测示例
import re
import math
from collections import Counter

def is_dga_domain(domain, threshold=0.7):
    # 判断域名是否为 DGA 生成
    # 提取主域名部分
    main = domain.split('.')[0]

    score = 0
    # 1. 长度检查
    if len(main) > 15:
        score += 0.3

    # 2. 元音辅音比检查
    vowels = sum(1 for c in main.lower() if c in 'aeiou')
    if len(main) > 0:
        v_ratio = vowels / len(main)
        if v_ratio < 0.15:
            score += 0.3

    # 3. 熵值检查
    entropy = calculate_entropy(main)
    if entropy > 3.2:
        score += 0.2

    # 4. 数字比例检查
    digits = sum(1 for c in main if c.isdigit())
    if len(main) > 0 and digits / len(main) > 0.3:
        score += 0.2

    return score >= threshold
```

---

## 六、DNS 安全产品与方案

| 产品类型 | 代表产品 | 功能 |
|:---|:---|:---|
| **DNS 防火墙** | Infoblox, Cisco Umbrella | 基于威胁情报的 DNS 过滤 |
| **DNS RPZ** | BIND RPZ | 开源 DNS 策略控制 |
| **DNSSEC 验证** | BIND, Unbound, PowerDNS | DNS 数据完整性验证 |
| **DNS 日志分析** | Splunk DNS App, Zeek DNS | DNS 流量异常检测 |
| **DNS Sinkhole** | 自建或商业 | 将恶意域名解析到无害地址 |

---

## 七、DNS 日志分析与威胁检测

### 7.1 DNS 日志字段

```
典型 DNS 查询日志格式：

timestamp src_ip src_port dst_ip query_type query_domain response_code response_ip

示例：
2024-06-15 08:30:00 10.1.1.100 54321 8.8.8.8 A www.google.com NOERROR 142.250.80.4
2024-06-15 08:30:05 10.1.1.100 54322 8.8.8.8 A a7x9k2m4.example.com NXDOMAIN -
```

### 7.2 威胁检测查询

```spl
# Splunk SPL 检测示例

# 1. 检测 DGA 域名（NXDOMAIN 大量出现）
index=dns_logs response_code=NXDOMAIN
| stats count by client_ip, query
| where count > 5
| sort - count

# 2. 检测 DNS 隧道（查询域名过长）
index=dns_logs
| eval domain_length=len(query)
| where domain_length > 52
| table _time, client_ip, query, domain_length

# 3. 检测异常的 TXT 查询
index=dns_logs query_type=TXT
| stats count by client_ip, query
| where count > 10
| sort - count

# 4. 检测新出现的域名（从未见过）
index=dns_logs
| stats earliest(_time) as first_seen by query
| where first_seen > relative_time(now(), "-24h")
| stats count by query
```

---

## 八、DNS over HTTPS (DoH) 安全

### 8.1 DoH 带来的安全挑战

DoH（DNS over HTTPS，RFC 8484）将 DNS 查询封装在 HTTPS 中：

```
DoH 安全影响：

优点：
  ✓ 防止 DNS 窃听（加密）
  ✓ 防止 DNS 篡改（TLS 认证）
  ✓ 绕过 DNS 劫持

挑战：
  ✗ 绕过企业 DNS 安全策略（RPZ 失效）
  ✗ 无法通过传统 DNS 监控发现威胁
  ✗ 恶意软件利用 DoH 隐藏 C2 通信
  ✗ 数据外泄更难检测
```

### 8.2 DoH 检测与控制

```bash
# 检测 DoH 流量
# 方法 1：监控已知 DoH 服务器 IP
# 常见 DoH 服务器：
# Cloudflare: 1.1.1.1, 1.0.0.1
# Google: 8.8.8.8, 8.8.4.4
# Quad9: 9.9.9.9

# 方法 2：TLS 指纹检测 (JA3)
# 在 IDS 中配置 DoH 客户端指纹

# 方法 3：在企业防火墙上阻断已知 DoH 服务器
# 只允许企业 DNS 服务器的 DNS/DoT 流量

# 企业方案：部署内部 DoH 服务器
# 通过 GPO/策略将客户端 DoH 指向企业服务器
```

---

## 九、DNS 安全最佳实践

```
DNS 安全清单：

□ 1. 部署 DNSSEC（签名 + 验证）
□ 2. 使用 DNS RPZ 过滤恶意域名
□ 3. 限制递归查询来源（非 open resolver）
□ 4. 启用 Response Rate Limiting (RRL)
□ 5. 源端口随机化 + 0x20 编码
□ 6. 监控 DNS 日志并告警异常
□ 7. 使用独立的权威 DNS 和递归 DNS
□ 8. 对域名注册商账号启用 2FA
□ 9. 启用 Registry Lock（防域名转移）
□ 10. 定期审计 DNS 区域文件
□ 11. 使用多个 DNS 供应商（冗余）
□ 12. 监控证书透明度 (CT) 日志
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | DNS 端口与协议 | ★★★★★ | 低 | UDP 53，TCP 53（区域传输/大响应） |
| 2 | DNSSEC 新增记录类型 | ★★★★★ | 中 | RRSIG, DNSKEY, DS, NSEC/NSEC3 |
| 3 | Kaminsky 漏洞原理 | ★★★★☆ | 中 | TXID 仅 16 位 + 固定源端口 = 可猜测 |
| 4 | DNS 隧道检测方法 | ★★★★☆ | 中 | 域名长度、查询频率、熵值、TXT 占比 |
| 5 | DGA 域名特征 | ★★★★☆ | 中 | 长域名、低元音比、高熵值、高 NXDOMAIN 率 |
| 6 | DoH 端口 | ★★★☆☆ | 低 | TCP 443 (HTTPS) |
| 7 | DNS RPZ 功能 | ★★★☆☆ | 中 | DNS 防火墙，基于策略控制解析结果 |
| 8 | DNSSEC 信任链 | ★★★★☆ | 中 | 根→TLD→域名，通过 DS 记录建立 |

### 💡 知识巧记口诀

> **"DNSSEC 四记录：签名 RRSIG、密钥 DNSKEY、委派 DS、否认 NSEC"** — DNSSEC 四种新记录类型
>
> **"Kaminsky 猜 ID，随机端口来防御"** — Kaminsky 漏洞和防御
>
> **"DGA 三高一长：高熵高数高无，域名长"** — DGA 域名特征
>
> **"UDP 53 查，TCP 53 传，HTTPS 443 是 DoH"** — DNS 端口总结

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "DNSSEC 加密 DNS 查询" | ❌ 错误！DNSSEC 只提供签名验证（完整性+真实性），不加密。加密是 DoT/DoH 的功能 |
| "DNS 只使用 UDP" | ❌ 错误！DNS 使用 UDP 进行常规查询，但区域传输和大响应（>512 字节）使用 TCP |
| "所有 DNS 服务器都支持 DNSSEC" | ❌ 错误！全球 DNSSEC 验证率约 30%，部署率更低 |
| "DNSSEC 能防止 DNS 隧道" | ❌ 错误！DNSSEC 无法防止 DNS 隧道，隧道利用的是 DNS 协议本身 |

---

## 学习建议

1. 🔧 **部署 BIND DNS 服务器**：配置 DNSSEC 签名和验证
2. 🧪 **测试 DNS 隧道**：在实验环境中用 dnscat2 测试 DNS 隧道
3. 📊 **分析 DNS 日志**：收集一天的企业 DNS 日志，用 Splunk 或 Python 分析异常
4. 🔍 **了解 DoH 影响**：测试浏览器启用 DoH 后对企业 DNS 监控的影响
5. 📖 **阅读 DNSSEC RFC**：RFC 4033/4034/4035

---

> **DNS 是互联网的基石，也是最被忽视的安全盲区。保护好 DNS，就是保护了整个网络的第一跳安全。**
""")

print("Day 13 done")

# ============================================================
# Day 14: CDN与抗攻击
# ============================================================
gen('day-14.md', r"""# Day 14：CDN与抗攻击

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：45 分钟
>
> CDN（内容分发网络）是现代互联网架构的核心组件，也是抵御大规模 DDoS 攻击的关键基础设施。本章从 CDN 的工作原理、安全防护机制、常见攻击与绕过技术到实战配置，系统讲解 CDN 安全的全方位知识。

---

## 导航目录

- [一、CDN 基础概念与工作原理](#一cdn-基础概念与工作原理)
- [二、CDN 安全防护机制](#二cdn-安全防护机制)
- [三、CDN 抗 DDoS 能力](#三cdn-抗-ddos-能力)
- [四、CDN 绕过与源站泄露](#四cdn-绕过与源站泄露)
- [五、主流 CDN 安全配置](#五主流-cdn-安全配置)
- [六、CDN + WAF 联合防护](#六cdn--waf-联合防护)
- [七、CDN 日志与安全分析](#七cdn-日志与安全分析)
- [八、CDN 缓存投毒攻击](#八cdn-缓存投毒攻击)
- [九、CDN 安全最佳实践](#九cdn-安全最佳实践)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、CDN 基础概念与工作原理

### 1.1 CDN 的定义

CDN（Content Delivery Network，内容分发网络）是通过在全球部署边缘节点，将内容缓存到离用户最近的节点，从而加速内容传输和提升可用性的分布式网络系统。

> **🔑 高分考点**：CDN 的核心原理是 **"就近访问"**——用户请求被路由到最近的边缘节点，而非直接访问源站。这一特性也是 CDN 抗 DDoS 的基础。

### 1.2 CDN 工作流程

```
CDN 请求流程：

用户 → DNS 解析 → CDN 智能调度 → 边缘节点
                                        │
                                   ┌────▼────┐
                                   │ 有缓存？  │
                                   └─┬────┬──┘
                                     │是  │否
                                     ▼    ▼
                                  直接返回  回源获取
                                            │
                                            ▼
                                        源站服务器

CDN 智能调度技术：
- DNS 调度：根据用户 LDNS IP 返回最近的边缘节点 IP
- Anycast：同一 IP 在全球多个节点宣告，BGP 自动选择最近路径
- HTTP 重定向：302 重定向到最近的节点
```

### 1.3 CDN 的关键组件

| 组件 | 功能 | 技术实现 |
|:---|:---|:---|
| **边缘节点** | 缓存内容、响应用户请求 | Nginx/Varnish/TrafficServer |
| **调度中心** | 将用户请求分配到最优边缘节点 | DNS 智能解析/BGP Anycast |
| **源站** | 存储原始内容 | 用户自建服务器/云存储 |
| **监控系统** | 监控节点健康状态、流量分布 | 自研监控平台 |

---

## 二、CDN 安全防护机制

### 2.1 CDN 内置安全功能

现代 CDN 不仅仅是内容加速平台，更是安全防护平台：

| 安全功能 | 防护对象 | 实现方式 |
|:---|:---|:---|
| **DDoS 防护** | 网络层/应用层 DDoS | 全球分布式节点吸收攻击流量 |
| **WAF** | Web 应用攻击（SQLi/XSS 等） | 规则引擎 + 行为分析 |
| **Bot 管理** | 恶意爬虫、撞库、刷票 | 行为分析、JS Challenge、CAPTCHA |
| **TLS 加密** | 数据传输安全 | 边缘节点 SSL 终结 |
| **访问控制** | 未授权访问 | IP 白名单/黑名单、Geo 封锁、Token 鉴权 |
| **速率限制** | CC 攻击、API 滥用 | 基于 IP/Session/URL 的限流 |

### 2.2 Cloudflare 安全配置示例

```yaml
# Cloudflare WAF 自定义规则
# 封禁特定国家流量
(action: block, field: ip.geoip.country, operator: eq, value: KP)

# 速率限制规则
# 同一 IP 每分钟请求同一 URL 超过 100 次则触发 JS Challenge
{
  "url": "*",
  "period": 60,
  "requests": 100,
  "action": "js_challenge",
  "mitigation_timeout": 600
}

# Bot 管理
# 对确定为自动化的请求执行 JS Challenge
{
  "score": "<30",
  "action": "js_challenge"
}
```

### 2.3 Token 鉴权机制

CDN 常用的 URL Token 鉴权防止盗链和未授权访问：

```python
import hashlib
import time
import base64

def generate_cdn_token(url, key, expire_seconds=3600):
    # 生成 CDN Token 鉴权 URL
    expire_time = int(time.time()) + expire_seconds
    # 方式 1：MD5 签名（简单）
    token = hashlib.md5(f"{key}{url}{expire_time}".encode()).hexdigest()
    return f"{url}?token={token}&expire={expire_time}"

    # 方式 2：HMAC-SHA256（更安全）
    # import hmac
    # message = f"{url}{expire_time}"
    # signature = base64.urlsafe_b64encode(
    #     hmac.new(key.encode(), message.encode(), hashlib.sha256).digest()
    # ).decode().rstrip('=')
    # return f"{url}?sign={signature}&expire={expire_time}"

# 使用示例
protected_url = generate_cdn_token("/video/private.mp4", "my-secret-key-2024")
# 输出: /video/private.mp4?token=abc123...&expire=1718438400
```

---

## 三、CDN 抗 DDoS 能力

### 3.1 CDN 抗 DDoS 原理

CDN 天然具有抗 DDoS 能力，原因如下：

| 特性 | 抗 DDoS 作用 |
|:---|:---|
| **分布式架构** | 攻击流量被分散到全球数百个节点，单一节点承受的压力有限 |
| **海量带宽** | 头部 CDN 总带宽达数百 Tbps，远超大多数 DDoS 攻击规模 |
| **Anycast 路由** | 攻击流量被分散到最近的节点，无法集中攻击 |
| **源站隐藏** | 攻击者不知道源站真实 IP，只能攻击 CDN 节点 |
| **流量清洗** | CDN 节点内置 DDoS 检测和清洗能力 |

### 3.2 回源流量控制

```nginx
# CDN 回源限流（保护源站）
# 限制回源请求速率
limit_req_zone $binary_remote_addr zone=origin:10m rate=50r/s;

server {
    listen 80;
    server_name origin.example.com;

    # 只允许 CDN 节点 IP 访问源站
    allow 103.21.244.0/22;   # Cloudflare IP 段
    allow 103.22.200.0/22;
    allow 103.31.4.0/22;
    # ... 更多 CDN IP 段
    deny all;

    location / {
        limit_req zone=origin burst=100 nodelay;
        proxy_pass http://backend;
    }
}
```

---

## 四、CDN 绕过与源站泄露

### 4.1 源站 IP 泄露途径

攻击者可以通过以下方式发现隐藏在 CDN 后的真实源站 IP：

| 泄露途径 | 原理 | 防御方法 |
|:---|:---|:---|
| **DNS 历史记录** | 历史 DNS 记录可能暴露源站 IP | 更换 IP 后监控历史记录 |
| **SSL 证书** | 证书透明度 (CT) 日志 | 使用 CDN 提供的证书 |
| **邮件服务器** | 邮件头可能包含源站 IP | 使用独立邮件服务器 |
| **子域名** | 未接入 CDN 的子域名 | 所有子域名接入 CDN |
| **敏感文件** | phpinfo、错误页面 | 关闭错误显示 |
| **DNS 区域传输** | 未限制区域传输 | 限制 AXFR 请求 |
| **Censys/Shodan** | 搜索引擎收录 | 定期自查 |

### 4.2 源站 IP 发现工具

```bash
# 查找源站 IP 的方法（仅用于授权测试）

# 1. DNS 历史记录查询
# 使用 SecurityTrails、DNSDB 等平台

# 2. 子域名爆破
subfinder -d example.com
amass enum -d example.com

# 3. 全网扫描（Censys）
# censys search 'services.tls.certificates.leaf_data.subject.common_name:"example.com"'

# 4. 测试 CDN 之前的 IP
# 通过搜索引擎缓存、Wayback Machine 查找历史 IP

# 5. 多地 Ping 测试
# 如果 Ping 返回的 IP 在全球都相同，可能不是 CDN
ping -c 1 example.com
```

### 4.3 防御源站泄露

```bash
# 源站防护配置

# 1. 源站只允许 CDN IP 访问
iptables -A INPUT -p tcp --dport 80 -s 103.21.244.0/22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -s 103.22.200.0/22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j DROP

# 2. 使用 iptables 的 string 模块匹配 CDN 自定义头
iptables -A INPUT -p tcp --dport 80 \
  -m string --string "X-CDN-Auth: my-secret" --algo bm -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j DROP

# 3. Nginx 验证 CDN 回源请求头
# /etc/nginx/conf.d/origin.conf
server {
    listen 80;
    location / {
        if ($http_x_cdn_auth != "my-secret-token") {
            return 403;
        }
        proxy_pass http://backend;
    }
}
```

---

## 五、主流 CDN 安全配置

### 5.1 Cloudflare 安全层级

```yaml
# Cloudflare Security Level 设置
# Security Level 从低到高：
# - Essentially Off: 仅对最恶意的 IP 进行 JS Challenge
# - Low: 对威胁评分 > 50 的 IP 进行 JS Challenge
# - Medium (默认): 对威胁评分 > 25 的 IP 进行 JS Challenge
# - High: 对威胁评分 > 0 的 IP 进行 JS Challenge
# - I'm Under Attack!: 对所有访问者进行 JS Challenge

# 建议配置：
# 正常时期：Medium
# 受到攻击时：I'm Under Attack!
```

### 5.2 多 CDN 架构

```
多 CDN 高可用架构：

                 ┌─────────────┐
                 │  DNS 智能调度 │ (Route 53 / NS1 / Azure Traffic Manager)
                 └──────┬──────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
  ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐
  │ Cloudflare│  │  Akamai   │  │  Fastly   │
  │  CDN 1    │  │  CDN 2    │  │  CDN 3    │
  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
                 ┌──────▼──────┐
                 │   源站服务器  │
                 └─────────────┘

优势：
- 避免单点故障（单 CDN 宕机不影响服务）
- 全球覆盖更广（不同 CDN 在不同地区有优势）
- 议价能力（不被单一 CDN 绑定）
```

---

## 六、CDN + WAF 联合防护

CDN 边缘节点上部署 WAF，形成"加速+安全"一体化方案：

```
CDN + WAF 联合架构：

用户请求
    │
    ▼
┌─────────────────────────────┐
│  CDN 边缘节点                 │
│  ┌───────────────────────┐  │
│  │ 1. DDoS 防护 (L3/L4)   │  │ ← 网络层清洗
│  │ 2. WAF 检测 (L7)       │  │ ← 应用层检测
│  │ 3. Bot 管理             │  │ ← 自动化流量识别
│  │ 4. 速率限制             │  │ ← CC 攻击防护
│  │ 5. 缓存内容交付          │  │ ← 正常加速
│  └───────────────────────┘  │
└─────────────┬───────────────┘
              │ (通过的安全流量)
              ▼
┌─────────────────────────────┐
│  源站（隐藏 IP）              │
│  - 只接受 CDN 回源 IP        │
│  - 可选：本地 WAF 二次检测    │
└─────────────────────────────┘
```

---

## 七、CDN 日志与安全分析

### 7.1 CDN 日志关键字段

```json
{
  "timestamp": "2024-06-15T08:30:00Z",
  "client_ip": "203.0.113.50",
  "client_country": "CN",
  "edge_ip": "104.16.0.1",
  "request_method": "GET",
  "request_uri": "/api/users?id=1%27%20OR%20%271%27=%271",
  "status_code": 403,
  "waf_action": "block",
  "waf_rule_id": "942100",
  "waf_rule_message": "SQL Injection Detected",
  "cache_status": "miss",
  "origin_ip": "10.1.1.100",
  "user_agent": "Mozilla/5.0 ...",
  "threat_score": 85
}
```

### 7.2 CDN 安全分析要点

```spl
# Splunk 分析 CDN 日志

# 1. WAF 拦截统计
index=cdn_logs waf_action=block
| stats count by waf_rule_id, waf_rule_message
| sort - count

# 2. 攻击来源地理分布
index=cdn_logs waf_action=block
| stats count by client_country
| geom geo_countries

# 3. 高频攻击 IP
index=cdn_logs waf_action=block
| stats count by client_ip
| where count > 100
| sort - count

# 4. 缓存命中率异常（可能被 CC 攻击）
index=cdn_logs
| stats count(eval(cache_status="hit")) as hit,
        count(eval(cache_status="miss")) as miss
| eval hit_rate = hit / (hit + miss)
| where hit_rate < 0.3
```

---

## 八、CDN 缓存投毒攻击

### 8.1 缓存投毒原理

缓存投毒（Cache Poisoning）攻击通过向 CDN 发送特制请求，使 CDN 缓存恶意内容并返回给其他用户：

```
缓存投毒攻击示例：

攻击者发送：
GET /index.html HTTP/1.1
Host: example.com
X-Forwarded-Host: evil.com
→ CDN 缓存了包含 evil.com 链接的页面

正常用户访问：
GET /index.html HTTP/1.1
Host: example.com
→ CDN 返回缓存的恶意版本（包含 evil.com 链接）
```

### 8.2 缓存投毒防御

```nginx
# CDN 缓存投毒防御配置
# 1. 不缓存包含恶意头的响应
# 2. 使用 Vary 头正确区分缓存
# 3. 验证回源请求头

# 在源站 Nginx 配置
server {
    location / {
        # 只缓存安全的响应
        add_header Cache-Control "public, max-age=3600";

        # 如果请求包含异常头，禁用缓存
        if ($http_x_forwarded_host) {
            set $cache_control "no-cache";
        }
    }
}
```

---

## 九、CDN 安全最佳实践

```
CDN 安全最佳实践清单：

□ 1. 源站 IP 保密
□ 2. 源站仅允许 CDN 回源 IP 访问
□ 3. 启用 CDN WAF（至少 OWASP Top 10 防护）
□ 4. 启用 DDoS 防护（Always On）
□ 5. 配置速率限制
□ 6. 启用 Bot 管理
□ 7. 使用自定义回源认证头
□ 8. 所有子域名接入 CDN
□ 9. 启用 DNSSEC
□ 10. 定期审计 CDN 配置
□ 11. 启用 CDN 日志并集成到 SIEM
□ 12. 配置 SSL/TLS 为 Full (Strict) 模式
□ 13. 监控证书透明度日志
□ 14. 配置多 CDN 或备用 CDN
□ 15. 定期测试源站泄露
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | CDN 核心原理 | ★★★★★ | 低 | 就近访问，缓存加速，源站隐藏 |
| 2 | CDN 抗 DDoS 原理 | ★★★★★ | 中 | 分布式节点吸收、Anycast 分散、源站隐藏 |
| 3 | 源站泄露途径 | ★★★★☆ | 中 | DNS 历史、SSL CT、子域名、邮件头、错误页面 |
| 4 | CDN 安全功能 | ★★★★☆ | 中 | DDoS、WAF、Bot 管理、速率限制、TLS |
| 5 | 缓存投毒攻击 | ★★★☆☆ | 中 | 利用未验证的 HTTP 头污染缓存 |
| 6 | 回源认证 | ★★★☆☆ | 中 | 自定义头、IP 白名单、Token |
| 7 | Anycast 原理 | ★★★☆☆ | 中 | 同一 IP 在全球多处宣告，BGP 选择最近路径 |
| 8 | CDN+WAF 联合 | ★★★★☆ | 中 | 边缘节点集成 WAF，一体化安全加速 |

### 💡 知识巧记口诀

> **"近缓存隐源，CDN 三核心"** — 就近访问、缓存加速、隐藏源站
>
> **"DNS 历史证书透，子域邮件加错误"** — 五大源站泄露途径
>
> **"Anycast 同 IP 多地播，BGP 自动选最近"** — Anycast 原理

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "接入 CDN 后源站就绝对安全了" | ❌ 错误！源站 IP 可能通过各种途径泄露，需要额外防护 |
| "CDN 就是用来加速的" | ❌ 错误！现代 CDN 是安全+加速一体化平台 |
| "免费 CDN 的安全能力与付费版一样" | ❌ 错误！高级安全功能（Bot 管理、高级 WAF）通常仅付费版提供 |

---

## 学习建议

1. ☁️ **接入 Cloudflare CDN**：将自己的域名接入 Cloudflare，配置安全功能
2. 🔍 **测试源站泄露**：使用 DNS 历史记录、Censys 等工具测试源站 IP 是否泄露
3. 📊 **分析 CDN 安全日志**：了解 CDN 拦截了哪些类型的攻击
4. 🧪 **测试缓存投毒**：在实验环境中测试 CDN 缓存投毒攻击

---

> **CDN 是互联网的"盾牌"——它让攻击者只能打到分布全球的"分身"，而真正的源站安然隐藏在盾牌之后。**
""")

print("Day 14 done")

# ============================================================
# Day 15: Linux系统安全加固
# ============================================================
gen('day-15.md', r"""# Day 15：Linux系统安全加固

> **📘 文档定位**：CISP 考试核心基础 | 难度：中级 | 预计阅读：50 分钟
>
> Linux 是互联网服务器的绝对主力操作系统（超过 70% 的 Web 服务器运行 Linux），也是攻击者的首要目标。本章从最小安装、账户安全、文件权限、网络安全、审计配置到内核加固，系统讲解 Linux 安全加固的全方位最佳实践。

---

## 导航目录

- [一、Linux 安全加固概述](#一linux-安全加固概述)
- [二、最小化安装与软件管理](#二最小化安装与软件管理)
- [三、账户与认证安全](#三账户与认证安全)
- [四、文件系统权限加固](#四文件系统权限加固)
- [五、网络安全配置加固](#五网络安全配置加固)
- [六、SSH 安全加固](#六ssh-安全加固)
- [七、审计与日志配置](#七审计与日志配置)
- [八、内核安全参数调优](#八内核安全参数调优)
- [九、安全基线检查工具](#九安全基线检查工具)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、Linux 安全加固概述

### 1.1 加固原则

Linux 安全加固遵循以下基本原则：

| 原则 | 说明 | 实施方法 |
|:---|:---|:---|
| **最小安装** | 只安装必需的软件包 | `yum minimal install` / `apt --no-install-recommends` |
| **最小权限** | 用户/进程只拥有完成任务所需的最小权限 | sudo 细粒度配置、SELinux/AppArmor |
| **最小暴露** | 只开放必需的网络端口和服务 | 关闭不必要的服务、防火墙最小化规则 |
| **纵深防御** | 多层安全机制叠加 | iptables + SELinux + auditd + AIDE |
| **默认拒绝** | 默认拒绝，显式允许 | 防火墙策略、SELinux enforcing 模式 |

### 1.2 加固标准与框架

| 标准/框架 | 来源 | 适用场景 | 检查项数量 |
|:---|:---|:---|:---|
| **CIS Benchmarks** | Center for Internet Security | 通用 Linux 加固 | 200+ |
| **等保 2.0** | 中国公安部 | 国内政企 | 约 100 项 |
| **STIG** | DISA（美国国防部） | 军工/政府 | 300+ |
| **PCI DSS** | PCI 安全标准委员会 | 支付行业 | 约 50 项 Linux 相关 |

> **🔑 高分考点**：等保 2.0 三级要求 Linux 系统必须进行安全加固，包括最小安装、账户安全、访问控制、安全审计、入侵防范等。

---

## 二、最小化安装与软件管理

### 2.1 最小化安装

```bash
# CentOS/RHEL 最小化安装
yum groupinstall "Minimal Install"

# 移除不必要的软件包
yum remove telnet-server rsh-server talk-server \
  xinetd vsftpd nfs-utils rpcbind

# Ubuntu/Debian 最小化安装
apt install --no-install-recommends <package>

# 查看已安装的软件包
rpm -qa | sort  # RHEL/CentOS
dpkg -l          # Debian/Ubuntu
```

### 2.2 不需要的服务管理

```bash
# 列出所有运行中的服务
systemctl list-units --type=service --state=running

# 停止并禁用不需要的服务
systemctl stop telnet.socket
systemctl disable telnet.socket
systemctl mask telnet.socket  # mask 防止被其他服务启动

# 常见需要禁用的服务：
# telnet, rsh, rlogin, rexec - 明文协议
# vsftpd, proftpd - 如果不需要 FTP
# nfs-server, rpcbind - 如果不需要 NFS
# avahi-daemon - 如果不需要 mDNS
# cups - 如果不需要打印服务
```

---

## 三、账户与认证安全

### 3.1 密码策略配置

```bash
# /etc/login.defs - 密码老化策略
PASS_MAX_DAYS   90      # 密码最长使用天数
PASS_MIN_DAYS   7       # 密码最短使用天数
PASS_MIN_LEN    12      # 密码最小长度
PASS_WARN_AGE   7       # 密码过期前警告天数

# /etc/security/pwquality.conf - 密码复杂度
minlen = 12
minclass = 3            # 至少包含 3 种字符类型
maxrepeat = 3           # 最多连续重复 3 次
maxclassrepeat = 4      # 同类型字符最多连续 4 次
lcredit = -1            # 至少 1 个小写字母
ucredit = -1            # 至少 1 个大写字母
dcredit = -1            # 至少 1 个数字
ocredit = -1            # 至少 1 个特殊字符

# 使用 pam_tally2 限制登录失败次数
# /etc/pam.d/system-auth
auth required pam_tally2.so deny=5 unlock_time=900 even_deny_root root_unlock_time=300

# 查看用户登录失败次数
pam_tally2 --user root
# 重置失败计数
pam_tally2 --user root --reset
```

### 3.2 Sudo 权限管理

```bash
# /etc/sudoers - 细粒度 sudo 权限
# 使用 visudo 编辑，不要直接编辑 sudoers 文件

# 允许 webadmin 组管理 web 服务（无需完整 root）
%webadmin ALL=(root) /usr/bin/systemctl restart nginx, /usr/bin/systemctl reload nginx

# 允许 dbadmin 用户执行特定数据库命令
dbadmin ALL=(postgres) /usr/bin/pg_dump, /usr/bin/pg_restore

# 禁止 sudo 执行 shell（防止逃逸）
# 使用 NOEXEC 防止通过 sudo 获取 shell
Defaults    env_reset
Defaults    mail_badpass
Defaults    secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
Defaults    logfile="/var/log/sudo.log"
Defaults    !visiblepw       # 不显示密码输入
```

### 3.3 特权账户审计

```bash
# 查找 UID 0 的账户（应该只有 root）
awk -F: '($3 == 0) {print $1}' /etc/passwd

# 查找无密码账户
awk -F: '($2 == "" || $2 == "!") {print $1}' /etc/shadow

# 查找可登录的账户
grep -v '/nologin\|/false' /etc/passwd | cut -d: -f1

# 检查 /etc/passwd 和 /etc/shadow 权限
ls -la /etc/passwd /etc/shadow
# passwd 应为 644 (-rw-r--r--)
# shadow 应为 000 (----------) 或 400
```

---

## 四、文件系统权限加固

### 4.1 关键文件权限设置

```bash
# 设置关键系统文件权限
chmod 644 /etc/passwd
chmod 400 /etc/shadow
chmod 644 /etc/group
chmod 400 /etc/gshadow
chmod 600 /etc/ssh/sshd_config
chmod 644 /etc/hosts.allow /etc/hosts.deny

# 移除 SUID/SGID 位（不需要的程序）
# 查找所有 SUID 文件
find / -perm -4000 -type f 2>/dev/null

# 移除不必要的 SUID 位
chmod u-s /usr/bin/chage
chmod u-s /usr/bin/gpasswd
chmod u-s /usr/bin/newgrp

# 保留必要的 SUID 程序：
# /usr/bin/sudo, /usr/bin/su, /usr/bin/passwd
```

### 4.2 文件完整性监控 (AIDE)

```bash
# 安装和配置 AIDE (Advanced Intrusion Detection Environment)
yum install aide
apt install aide

# 初始化 AIDE 数据库
aide --init
cp /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz

# 配置 AIDE 监控规则 /etc/aide.conf
# 监控关键目录
/etc     p+i+n+u+g+s+m+c+acl+selinux+xattrs+sha512
/bin     p+i+n+u+g+s+m+c+acl+selinux+xattrs+sha512
/sbin    p+i+n+u+g+s+m+c+acl+selinux+xattrs+sha512
/usr/bin p+i+n+u+g+s+m+c+acl+selinux+xattrs+sha512
/usr/sbin p+i+n+u+g+s+m+c+acl+selinux+xattrs+sha512

# 定期检查文件完整性
aide --check

# 更新基线（确认变更合法后）
aide --update
```

### 4.3 分区挂载安全选项

```bash
# /etc/fstab 安全挂载选项
# /tmp 分区：防止执行程序
tmpfs /tmp tmpfs defaults,noexec,nosuid,nodev 0 0

# /home 分区：防止设备文件
/dev/sda3 /home ext4 defaults,nodev,nosuid 0 2

# /var 分区：防止执行
/dev/sda4 /var ext4 defaults,nodev,nosuid,noexec 0 2

# /var/tmp：绑定挂载到 /tmp
/var/tmp /tmp none bind 0 0
```

---

## 五、网络安全配置加固

### 5.1 内核网络参数调优

```bash
# /etc/sysctl.d/99-security.conf

# 1. 防止 IP 欺骗
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# 2. 忽略 ICMP 重定向
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0

# 3. 忽略源路由包
net.ipv4.conf.all.accept_source_route = 0

# 4. 记录 Martian 包（不可路由的源地址）
net.ipv4.conf.all.log_martians = 1

# 5. SYN Cookie 防护
net.ipv4.tcp_syncookies = 1

# 6. 减少 TCP keepalive 时间
net.ipv4.tcp_keepalive_time = 300
net.ipv4.tcp_keepalive_intvl = 60
net.ipv4.tcp_keepalive_probes = 5

# 7. 防止 TIME_WAIT 积累
net.ipv4.tcp_tw_reuse = 1

# 应用配置
sysctl -p /etc/sysctl.d/99-security.conf
```

### 5.2 限制网络访问

```bash
# TCP Wrapper 配置 /etc/hosts.allow
sshd: 192.168.1.0/24 10.1.1.0/24
vsftpd: ALL

# /etc/hosts.deny
ALL: ALL

# 注意：TCP Wrapper 只对链接了 libwrap 的服务生效
# 检查服务是否支持 TCP Wrapper：
ldd /usr/sbin/sshd | grep libwrap
```

---

## 六、SSH 安全加固

### 6.1 SSH 服务端加固

```bash
# /etc/ssh/sshd_config 安全配置

# 1. 禁用 root 直接登录
PermitRootLogin no

# 2. 仅允许密钥认证
PubkeyAuthentication yes
PasswordAuthentication no
ChallengeResponseAuthentication no

# 3. 限制登录用户
AllowUsers admin@192.168.1.0/24 deployer@10.1.0.0/16
# 或使用组控制
AllowGroups sshusers

# 4. 更改默认端口（减少自动扫描）
Port 2222

# 5. 限制协议版本
Protocol 2

# 6. 限制加密算法
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com
KexAlgorithms curve25519-sha256@libssh.org,diffie-hellman-group16-sha512

# 7. 登录限制
MaxAuthTries 3
MaxSessions 5
LoginGraceTime 30

# 8. 空闲超时
ClientAliveInterval 300
ClientAliveCountMax 2

# 9. 禁用不安全的转发
AllowTcpForwarding no
X11Forwarding no

# 10. 严格模式
StrictModes yes
```

### 6.2 SSH 密钥管理

```bash
# 生成强密钥
ssh-keygen -t ed25519 -a 100 -C "admin@example.com"

# 检查 authorized_keys 权限
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub

# 在 authorized_keys 中使用限制选项
# 限制特定密钥只能执行特定命令
command="/usr/local/bin/backup.sh",no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty ssh-ed25519 AAAAC3...
```

---

## 七、审计与日志配置

### 7.1 Auditd 审计规则

```bash
# /etc/audit/rules.d/50-security.rules

# 监控敏感文件访问
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/sudoers -p wa -k sudoers
-w /etc/ssh/sshd_config -p wa -k sshd_config

# 监控特权命令使用
-a always,exit -F path=/usr/bin/sudo -F perm=x -k sudo_exec
-a always,exit -F path=/usr/bin/su -F perm=x -k su_exec

# 监控系统时间修改
-a always,exit -F arch=b64 -S clock_settime -k time_change

# 监控审计配置修改
-w /etc/audit/auditd.conf -p wa -k audit_config
-w /etc/audit/rules.d/ -p wa -k audit_rules

# 确保审计规则不可变（重启后生效）
-e 2
```

### 7.2 Rsyslog 远程日志

```bash
# /etc/rsyslog.d/50-remote.conf
# 将所有日志发送到 SIEM
*.* @@192.168.100.50:514

# 使用 TLS 加密传输（生产环境推荐）
$DefaultNetstreamDriver gtls
$ActionSendStreamDriverMode 1
$ActionSendStreamDriverAuthMode x509/name
$ActionSendStreamDriverPermittedPeer logserver.example.com
*.* @@(o)logserver.example.com:6514
```

---

## 八、内核安全参数调优

### 8.1 内核安全模块

| 模块 | 作用 | 推荐设置 |
|:---|:---|:---|
| **SELinux** | 强制访问控制 (MAC) | Enforcing 模式 |
| **AppArmor** | Ubuntu 默认 MAC | Enforce 模式 |
| **seccomp** | 限制系统调用 | 配合容器/Docker 使用 |
| **Yama** | Ptrace 限制 | `kernel.yama.ptrace_scope=1` |
| **KASLR** | 内核地址空间随机化 | 默认启用 |
| **ExecShield** | 数据段不可执行 | 默认启用 |

```bash
# 检查 SELinux 状态
getenforce
# 设置为 Enforcing
setenforce 1
# 永久生效 /etc/selinux/config
SELINUX=enforcing

# 查看 SELinux 拒绝日志
ausearch -m avc -ts today
sealert -a /var/log/audit/audit.log

# Yama ptrace 限制
sysctl -w kernel.yama.ptrace_scope=1
# 0: 所有进程可 ptrace（不安全）
# 1: 只有父进程或特权进程可 ptrace（推荐）
# 2: 只有 CAP_SYS_PTRACE 可 ptrace
# 3: 完全禁用 ptrace
```

---

## 九、安全基线检查工具

### 9.1 自动化检查工具

| 工具 | 功能 | 使用方式 |
|:---|:---|:---|
| **Lynis** | 全面安全审计 | `lynis audit system` |
| **OpenSCAP** | SCAP 标准合规检查 | `oscap xccdf eval --profile xccdf_org.ssgproject.content_profile_cis` |
| **CIS-CAT** | CIS 基线检查（商业） | 图形化工具 |
| **chkrootkit** | Rootkit 检测 | `chkrootkit` |
| **rkhunter** | Rootkit + 后门检测 | `rkhunter --check --sk` |
| **ClamAV** | 病毒扫描 | `clamscan -r /` |

```bash
# Lynis 安全审计
lynis audit system --quick

# OpenSCAP 等保基线检查
oscap xccdf eval \
  --profile xccdf_org.ssgproject.content_profile_ospp \
  --results scan-results.xml \
  --report scan-report.html \
  /usr/share/xml/scap/ssg/content/ssg-rhel8-ds.xml
```

### 9.2 手动检查清单

```bash
# 快速安全检查脚本
#!/bin/bash
echo "=== Security Quick Check ==="

echo "1. SELinux Status:"
getenforce

echo "2. Firewall Status:"
iptables -L -n | head -20

echo "3. Open Ports:"
ss -tulnp

echo "4. Password-less Accounts:"
awk -F: '($2 == "" || $2 == "!") {print $1}' /etc/shadow

echo "5. Users with UID 0:"
awk -F: '($3 == 0) {print $1}' /etc/passwd

echo "6. Failed SSH Logins (last 24h):"
grep "Failed password" /var/log/secure | wc -l

echo "7. Recent Security Updates:"
rpm -qa --last | grep -i security | head -10

echo "8. Listening Services:"
systemctl list-units --type=service --state=running | grep -v "●"
```

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | Linux 加固原则 | ★★★★★ | 低 | 最小安装、最小权限、最小暴露、纵深防御 |
| 2 | 等保 2.0 Linux 要求 | ★★★★★ | 中 | 身份鉴别、访问控制、安全审计、入侵防范、恶意代码防范 |
| 3 | SSH 安全配置 | ★★★★★ | 中 | 禁用 root、密钥认证、改端口、限制 IP |
| 4 | 文件权限设置 | ★★★★☆ | 中 | passwd 644、shadow 400、SUID 审计 |
| 5 | SELinux 三种模式 | ★★★★☆ | 中 | Enforcing、Permissive、Disabled |
| 6 | Auditd 审计规则 | ★★★★☆ | 中 | -w 监控文件、-a 监控系统调用 |
| 7 | sysctl 安全参数 | ★★★☆☆ | 中 | rp_filter、syncookies、accept_redirects |
| 8 | AIDE 完整性检查 | ★★★☆☆ | 中 | 初始化→检查→更新基线 |

### 💡 知识巧记口诀

> **"最小装权限暴露，四原则要记牢"** — Linux 加固四原则
>
> **"禁 root 换端口密钥登，SSH 加固五板斧"** — SSH 安全加固要点
>
> **"Enforcing 强制管，Permissive 只记录，Disabled 完全关"** — SELinux 三种模式
>
> **"passwd 六四四，shadow 零零零"** — 关键文件权限记忆

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "SELinux 设置成 Permissive 就够了" | ❌ 错误！Permissive 只记录不阻止，等于没保护 |
| "chmod 777 只是权限设置，和安全无关" | ❌ 错误！过于宽松的权限可能导致信息泄露和提权 |
| "Linux 不需要杀毒软件" | ❌ 错误！Linux 虽然病毒较少，但作为文件服务器可能传播 Windows 病毒 |

---

## 学习建议

1. 🛡️ **运行 Lynis 审计**：在自己的 Linux 系统上运行 Lynis，根据报告逐项修复
2. 🔧 **实施等保基线**：按照等保 2.0 要求，逐项检查 Linux 系统
3. 📋 **编写加固脚本**：将本章的加固命令整理成可重复执行的自动化脚本
4. 🧪 **搭建测试环境**：在虚拟机中测试 SELinux 策略，学习如何排错

---

> **Linux 安全加固不是"一次性工程"，而是持续的过程。每次系统更新、每次新服务上线，都需要重新评估安全状态。**
""")

print("Day 15 done")
