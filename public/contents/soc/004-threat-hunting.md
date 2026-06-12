# 威胁狩猎(Threat Hunting)方法论与实战

---

## 一、威胁狩猎核心概念

```
Threat Hunting = 主动寻找已绕过现有安全检测的威胁

区别：
  安全监控 (Detection)：被动等待告警
  威胁狩猎 (Hunting) ★：主动寻找未被检测到的威胁

假设前提 (Assume Breach)：
  "攻击者已经在网络中了，只是我们还没发现"

狩猎问题：
  不是"我们被攻击了吗？"
  而是"攻击者已经进来了，他们在哪里？"
```

---

## 二、三大狩猎方法论

### 2.1 Sqrrl 狩猎模型 (2015)

```
Sqrrl Threat Hunting Loop (持续循环)：

  Hypothesis → 数据分析 → 发现/未发现 → 改进检测
       ↑                                     │
       └─────────────────────────────────────┘

狩猎的四种方式：
  1. 假设驱动 (Hypothesis-driven)
     "如果攻击者使用PowerShell下载payload，会留下什么痕迹？"
     → 在SIEM中搜索特征

  2. IOC驱动 (Indicator-driven)
     "已知APT28使用这个C2域名，我们的DNS日志中有吗？"
     → 查询威胁情报匹配

  3. 机器学习驱动 (ML-driven)
     "过去30天哪些主机的网络行为异常偏离了基线？"
     → 异常检测模型

  4. 场景驱动 (Situational)
     "刚公布Log4Shell，我们的Java应用日志是否有JNDI注入痕迹？"
     → 应急场景狩猎
```

### 2.2 PEAK 威胁狩猎框架 (Splunk)

```
PEAK (Prepare, Execute, Act, Knowledge):

  Prepare (准备):
    ├── 确定狩猎目标 (什么类型的威胁？APT/勒索/内部威胁?)
    ├── 收集数据 (哪些日志源可用？)
    └── 准备工具

  Execute (执行):
    ├── 数据探索: 了解数据质量、字段含义、正常基线
    ├── 异常搜索: Stacking/Clustering/Time-series
    └── 模式匹配: 已知TTP搜索、Sigma规则

  Act (行动):
    ├── 确认发现 → 创建Case → IR响应
    ├── 无发现 → 记录狩猎过程
    └── 不确定 → 深入调查

  Knowledge (知识沉淀):
    └── 将发现转化为自动化检测规则
```

---

## 三、常用狩猎技术

### 3.1 Stacking (堆叠分析)

```
Stacking = 对数据进行分组计数，找出异常值

示例1: 进程命令行堆叠
  | stats count BY process.command_line
  → 99%的cmd.exe实例命令行相同
  → 发现1条异常长命令: "cmd.exe /c powershell -enc SQBFAFgA..."
  → 可能：攻击者的PowerShell encoded command

示例2: 用户登录主机数堆叠
  | stats count_distinct(host.name) BY user.name
  → 普通用户: 1-3台主机
  → admin用户: 50台主机
  → 该admin可能是自动化工具/蠕虫/横向移动

示例3: DNS查询堆叠
  | stats count BY dns.question.name
  → 正常域名: 10000+次(Google/CDN等)
  → 可疑域名: 仅1次查询 → 可能是C2 beacon
```

### 3.2 频率分析 (Frequency Analysis)

```kql
// 检测：非工作时间登录
event.category: "authentication"
AND event.outcome: "success"
| eval hour = date_extract("@timestamp", "HOUR")
| where hour >= 22 OR hour <= 6
| where user.name NOT IN ("service_accounts", "backup_user")
| stats count BY user.name, host.name
| sort count desc
```

### 3.3 聚类分析 (Clustering)

```
聚类在威胁狩猎中的应用：

1. 进程行为聚类：
   将主机按"执行了哪些进程"分组
   如果某主机突然出现了组内其他主机都没有的进程 → 调查

2. 网络流量聚类：
   所有主机访问的外部IP聚类
   如果某主机访问了孤立的"不常见IP" → 可能是C2通信
```

---

## 四、狩猎工具集

| 工具 | 用途 | 说明 |
|------|------|------|
| **Velociraptor** | 端点取证查询 | 类SQL查询端点历史数据 |
| **HELK** | 狩猎实验环境 | ELK+Spark+Jupyter |
| **DeepBlueCLI** | Windows事件分析 | Eric Conrad, PowerShell |
| **Kansa** | PowerShell事件收集 | Incident Response |
| **osquery** | 端点SQL查询 | Facebook开源 |
| **Sysmon** | Windows事件采集 | Microsoft, 详细进程/网络事件 |

### Velociraptor 狩猎查询

```sql
-- 狩猎查询示例：查找所有Windows主机的计划任务
SELECT 
    Name,
    Command,
    Enabled,
    LastRunTime
FROM Artifact.Windows.System.TaskScheduler()
WHERE Command =~ '(powershell|cmd|wscript|cscript|mshta)'

-- 查找最近24小时新创建的服务
SELECT 
    Name,
    DisplayName,
    PathName,
    StartType
FROM Artifact.Windows.System.Services()
WHERE Created > now() - 86400
```

---

## 五、MITRE ATT&CK 狩猎矩阵

```
ATT&CK Tactic → 狩猎查询示例：

Execution (TA0002):
  查找powershell/cmd/wmic非标准父进程
  例：WinWord.exe → powershell.exe (可疑)

Persistence (TA0003):
  查找Run/RunOnce注册表新建项
  查找WMI事件消费者
  查找新建计划任务(不在维护窗口内)

Credential Access (TA0006):
  查找lsass.exe进程访问(非正常进程)
  查找NTDS.dit文件访问

Discovery (TA0007):
  查找大量net use / net view / whoami命令
  单主机短时间内大量查询 → 攻击者侦察阶段

Lateral Movement (TA0008):
  查找PsExec / WMI / WinRM跨主机调用
  查找SMB连接(端口445)到大量内网主机

Exfiltration (TA0010):
  查找非标准端口大流量出站(非80/443)
  查找DNS TXT大包(隧道)
```

---

## 六、Checklist

- [ ] 建立狩猎团队/狩猎角色
- [ ] 确定狩猎频率(≥1次/周，事后+常态化)
- [ ] 部署狩猎工具(Velociraptor/osquery/HELK)
- [ ] 编写狩猎假设库(至少50个假设)
- [ ] 建立ATT&CK狩猎矩阵
- [ ] 狩猎发现 → 自动化检测规则转化
- [ ] 季度威胁评估(关注最新TTPs)
- [ ] 狩猎记录与知识沉淀
- [ ] 协同红队验证(让红队模仿APT → 猎人们能找到吗？)
