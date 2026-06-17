# Day 5：威胁情报与溯源分析

> **📘 文档定位**：护网工程情报溯源 | 难度：入门 | 预计阅读：30 分钟
>
> 威胁情报就是你对抗攻击者的"情报系统"，溯源分析就是你当一回"网络侦探"。今天学会怎么用IOC当通缉令、怎么沿着线索追踪攻击者。

---

## 导航目录

- [一、威胁情报是什么？](#一威胁情报是什么)
- [二、IOC vs IOA——两种威胁指标](#二ioc-vs-ioa两种威胁指标)
- [三、威胁情报的四层分类](#三威胁情报的四层分类)
- [四、从哪里获取威胁情报？](#四从哪里获取威胁情报)
- [五、溯源分析——做一回网络侦探](#五溯源分析做一回网络侦探)
- [六、溯源工具和技术](#六溯源工具和技术)
- [七、威胁情报在护网中的应用](#七威胁情报在护网中的应用)
- [八、实战演练与能力检验](#八实战演练与能力检验)

---

## 一、威胁情报是什么？

### 1.1 用大白话说

**威胁情报** = 关于"谁会攻击你、用什么手段、什么时候可能动手"的**信息**。

类比一下：
- 🚔 普通安全设备 = 在你家门口装了一个摄像头
- 📡 威胁情报 = 告诉你"最近有个小偷团伙在附近活动，他们喜欢从窗户进入，专偷珠宝"

有了威胁情报，你就不是被动地等攻击发生，而是**提前知道攻击者要做什么**，提前布防。

### 1.2 威胁情报能帮你做什么

| 能力 | 说人话 |
|:---|:---|
| **提前预警** | 知道攻击者正在用某个新漏洞，赶紧去补 |
| **快速研判** | 一个可疑IP告警 → 查情报库 → 哦这是已知恶意IP，直接封 |
| **攻击溯源** | 能追踪攻击者用的是哪个APT团伙的工具 |
| **情报共享** | 兄弟单位被攻击的IOC，拿来用，免得自己也中招 |

---

## 二、IOC vs IOA——两种威胁指标

这是安全领域最重要的概念区分之一！

### 2.1 IOC（入侵指标）—— "通缉令照片"

IOC = Indicator of Compromise，就像警察发的"通缉令"——告诉你长什么样的就是坏蛋。

| IOC类型 | 举例 | 像什么 |
|:---|:---|:---|
| IP地址 | `45.33.32.156` | "这个车牌号是在逃嫌犯的车" |
| 域名 | `evil-c2.malware.xyz` | "这个地址是贼窝" |
| 文件哈希 | `MD5: a1b2c3d4...` | "这个指纹是逃犯的" |
| URL路径 | `/admin/uploadshell.php` | "这个门牌号有问题" |
| 注册表键值 | `HKLM\...\Run\malware` | "这个标记代表有问题" |

**IOC的特点**：
- ✅ 精确：可以自动化匹配，漏报少
- ❌ 易变：攻击者换个IP/域名就失效了

### 2.2 IOA（攻击指标）—— "形迹可疑的行为"

IOA = Indicator of Attack，描述的是**行为模式**，不是具体的数字。

| IOA类型 | 举例 |
|:---|:---|
| 异常进程创建 | Word进程突然启动了cmd.exe |
| 持久化注册 | 在Run键添加了不可信的程序 |
| 计划任务注册 | 创建了一个奇怪名字的计划任务 |
| 异常登录模式 | 凌晨3点从境外IP登录财务系统 |

**IOA的特点**：
- ✅ 持久：行为模式不变，换IP也没用
- ❌ 复杂：需要行为分析能力，不易自动化

### 2.3 IOC vs IOA 一张表总结

| 对比维度 | IOC | IOA |
|:---|:---|:---|
| 是什么 | 具体的恶意指标 | 可疑的行为模式 |
| 比喻 | 通缉犯照片 | "凌晨3点在银行门口徘徊" |
| 准确度 | 高（匹配上基本就是） | 中（需要结合其他信息研判） |
| 时效性 | 短（攻击者会换IP） | 长（行为模式难改变） |
| 检测方式 | 特征匹配 | 行为分析 |
| 举例 | 恶意IP: 1.2.3.4 | Word→cmd→powershell |

> **💡 金句**：IOC告诉你"这是坏蛋"，IOA告诉你"这看起来像坏蛋"。两者结合才完整。

---

## 三、威胁情报的四层分类

### 3.1 从高到低的四个层次

```
       ┌──────────────┐
       │  战略情报     │  ← CISO/高层看的
       │  "谁要搞我？" │
       ├──────────────┤
       │  战术情报     │  ← 安全经理看的
       │  "用什么手法？"│
       ├──────────────┤
       │  运营情报     │  ← 运营团队看的
       │  "什么时候搞我？"│
       ├──────────────┤
       │  技术情报     │  ← 设备自动消费的
       │  "IP/Domain/Hash"│
       └──────────────┘
```

### 3.2 各层情报的对比

| 层次 | 内容 | 消费者 | 时效性 |
|:---|:---|:---|:---|
| **战略** | 攻击趋势、行业威胁、地缘政治 | CISO/安全总监 | 月/季度 |
| **战术** | ATT&CK TTPs、攻击工具 | 安全架构师 | 周/月 |
| **运营** | 攻击活动预警、新兴漏洞 | SOC分析师 | 天/周 |
| **技术** | IP、域名、Hash、URL | SIEM/防火墙 | 秒/分钟 |

---

## 四、从哪里获取威胁情报？

### 4.1 免费威胁情报源

| 来源 | 类型 | 网址 |
|:---|:---|:---|
| MISP | 开源威胁情报平台 | misp-project.org |
| AlienVault OTX | 社区威胁情报 | otx.alienvault.com |
| Abuse.ch | 恶意软件IOC | abuse.ch |
| VirusTotal | 文件/URL分析 | virustotal.com |
| ThreatFox | IOC数据库 | threatfox.abuse.ch |

### 4.2 商业威胁情报

| 来源 | 特点 |
|:---|:---|
| 微步在线 | 国内领先，中文友好 |
| 奇安信威胁情报中心 | 护网经验丰富 |
| 360威胁情报中心 | 数据量大 |
| Recorded Future | 国际顶级 |

### 4.3 MISP 介绍

**MISP**（Malware Information Sharing Platform）是开源威胁情报共享平台：
- 🔓 完全开源免费
- 🔄 支持多家威胁情报源自动导入
- 📤 支持情报共享和导出
- 🏷️ 支持标签分类和关联分析
- 🐳 可用Docker快速部署

---

## 五、溯源分析——做一回网络侦探

### 5.1 溯源分析的完整流程

```
发现告警
  ↓
提取IOC（可疑IP、域名、文件哈希）
  ↓
威胁情报匹配（这个IP是已知恶意IP吗？是谁在用？）
  ↓
关联日志分析（这个IP还访问了什么？做了什么？）
  ↓
确定攻击路径（怎么进来的 → 做了什么 → 去了哪里）
  ↓
定位攻击源（攻击者是哪个组织/团伙？）
  ↓
输出溯源报告
```

### 5.2 IOC自动匹配引擎

```python
# IOC威胁情报自动匹配引擎
class IOCMatcher:
    def __init__(self):
        self.iocs = {
            'ip': set(),
            'domain': set(),
            'hash': set()
        }
    
    def add_ioc(self, ioc_type, value):
        """添加一条威胁情报IOC"""
        self.iocs[ioc_type].add(value.lower())
    
    def scan_log(self, log_entry):
        """扫描一条日志是否命中IOC"""
        matches = []
        for ip in self.iocs['ip']:
            if ip in log_entry:
                matches.append(f'🔴 IP命中: {ip}')
        for domain in self.iocs['domain']:
            if domain in log_entry.lower():
                matches.append(f'🔴 域名命中: {domain}')
        return matches
    
    def batch_scan(self, logs):
        """批量扫描多条日志"""
        print('='*50)
        print('        IOC威胁情报扫描')
        print('='*50)
        total_hits = 0
        for log in logs:
            hits = self.scan_log(log)
            if hits:
                print(f'📋 {log[:50]}...')
                for hit in hits:
                    print(f'   {hit}')
                total_hits += len(hits)
        print(f'\n✅ 扫描完成: {len(logs)}条日志, {total_hits}个命中')

# 创建情报库
matcher = IOCMatcher()
# 添加已知恶意IOC
matcher.add_ioc('ip', '45.33.32.156')
matcher.add_ioc('ip', '103.224.182.250')
matcher.add_ioc('domain', 'evil-c2.malware.xyz')
matcher.add_ioc('domain', 'bad-apt.phish.cn')

# 扫描日志
logs = [
    'GET /login from 192.168.1.50 - normal user access',
    'Connection from 45.33.32.156 to port 443 - suspicious!',
    'DNS query: evil-c2.malware.xyz - C2 communication!',
    'Connection from 10.0.0.1 to internal server',
]
matcher.batch_scan(logs)
```

### 5.3 溯源的五个维度

| 维度 | 查什么 | 用什么工具 |
|:---|:---|:---|
| IP溯源 | Whois信息、ASN归属、BGP路由 | whois命令、bgp.he.net |
| 域名溯源 | DNS历史记录、注册信息 | PassiveDNS、VirusTotal |
| 样本溯源 | 恶意软件的功能和来源 | IDA Pro、沙箱分析 |
| 攻击链映射 | 攻击步骤→ATT&CK技术 | ATT&CK Navigator |
| 组织归属 | 关联已知APT组织TTPs | 威胁情报平台 |

---

## 六、溯源工具和技术

### 6.1 溯源工具箱

| 工具 | 做什么 | 平台 |
|:---|:---|:---|
| VirusTotal | 查文件/URL/IP是否已知恶意 | Web |
| Shodan | 查IP关联的服务和漏洞 | Web |
| Censys | 互联网资产搜索 | Web |
| PassiveTotal | 被动DNS+Whois分析 | Web |
| Maltego | 信息关联分析可视化 | 桌面 |
| MISP | 威胁情报管理和共享 | 服务器 |

### 6.2 溯源分析报告框架

```markdown
# [事件名称] 溯源分析报告

## 1. 事件概述
- 发现时间、发现方式、事件级别

## 2. 攻击时间线
- 按时间顺序还原攻击者行为

## 3. 攻击手法分析
- 使用的漏洞、工具、ATT&CK映射

## 4. 攻击源分析
- IP归属、组织归属、动机分析

## 5. 影响范围
- 受影响系统、数据类型、业务影响

## 6. 证据材料
- 日志截图、样本哈希、数据包

## 7. 改进建议
- 短期/中期/长期改进措施
```

---

## 七、威胁情报在护网中的应用

### 7.1 护网三个阶段的情报运用

| 阶段 | 怎么用威胁情报 |
|:---|:---|
| **战前准备** | 获取最新的攻击趋势和TTPs，针对性加固 |
| **战时防守** | 实时IOC匹配告警，威胁情报辅助研判 |
| **战后复盘** | 情报共享，更新防御策略 |

### 7.2 威胁情报使用中的常见错误

| 错误 | 后果 | 正确做法 |
|:---|:---|:---|
| 买了情报但没用 | 白花钱 | 把IOC接入SIEM做实时匹配 |
| 只关注IOC不关注TTPs | 攻击者换个IP就失效 | 同时关注行为模式(IOA) |
| 不做情报验证 | 误封正常IP影响业务 | 重要IOC先验证再应用 |
| 不参与情报共享 | 孤军奋战 | 加入行业情报共享群 |

---

## 八、实战演练与能力检验

### 8.1 今日动手练习

1. 去 [VirusTotal](https://www.virustotal.com) 查一个你遇到过的可疑IP
2. 用上面的 `IOCMatcher` 代码，加入你自己的威胁情报库
3. 如果你有SIEM系统，尝试把MISP的IOC导入SIEM

### 8.2 今日自我检测

1. IOC和IOA的区别是什么？（答案：IOC是具体指标如恶意IP，IOA是行为模式如异常进程链）
2. MISP是什么？（答案：Malware Information Sharing Platform，开源威胁情报共享平台）
3. 威胁情报分哪四个层次？（答案：战略、战术、运营、技术）
4. 溯源分析的第一步是什么？（答案：提取IOC）
5. 威胁情报在护网中最直接的应用是什么？（答案：IOC实时匹配告警，快速研判攻击）

---

## 📚 扩展阅读

- [MISP威胁情报平台](https://www.misp-project.org/)
- [VirusTotal](https://www.virustotal.com)
- [AlienVault OTX](https://otx.alienvault.com)
- [MITRE ATT&CK Groups](https://attack.mitre.org/groups/)

---

> **🛡️ 今日金句**：威胁情报不是买来的数据，而是用起来的能力。情报只有融入检测体系，才能发挥真正的价值。知己知彼，百战不殆。
