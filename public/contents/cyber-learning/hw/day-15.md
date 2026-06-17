# Day 15：威胁狩猎实战
## 主动出击，去找那些藏在角落里的敌人

---

> 🎯 **今日目标**  
> 掌握威胁狩猎方法 · 学习假设驱动分析 · 理解狩猎工具使用

---

## 📖 一、威胁狩猎是什么？——不等告警，自己去找

之前学的都是"被动等告警"——攻击来了→IDS/EDR报警→你去处理。但有没有想过一个问题：

```
如果攻击者足够高级（APT级别）呢？
  → 他们可能绕过了你的IDS
  → 他们可能躲过了你的EDR
  → 你的SIEM上风平浪静
  → 但你已经被渗透了

这时候怎么办？——主动出击！去狩猎（Hunt）！
```

### 🦁 威胁狩猎的核心哲学

```
传统安全运维：  "没有告警 = 没有攻击"（被动等待）
威胁狩猎：       "没有告警 = 我来主动看看到底有没有"（主动探索）

就像打猎和等猎物的区别：
  护林员A：坐在岗亭里等游客报告看到熊
  护林员B：每天主动去森林深处找熊的足迹、粪便
  → B才是真正的猎人
```

---

## 📖 二、威胁狩猎的三种方法

### 🔬 方法1：假设驱动狩猎

先从ATT&CK中选一种攻击技术，假设攻击者会用它，然后在你的日志里去找证据。

```
示例：假设攻击者使用DNS隧道做C2通信（T1071.004）

我的假设：
  "如果攻击者在我网络里，他可能用DNS隧道隐蔽通信"

我的分析计划：
  1. 收集所有内网主机过去7天的DNS查询日志
  2. 分析特征：
     - 单主机查询频率 > 500次/小时
     - 平均域名长度 > 52字符（正常域名哪有这么长）
     - 大量TXT记录请求
  3. 命中这些特征的 → 深度分析

这就是"带着问题去找答案"，比盲目翻日志高效100倍
```

### 📊 方法2：指标驱动狩猎

监控关键指标偏离基线的行为。

```
正常基线（平时）：
  - 公司平均每天1000次SSH登录（都是运维）
  - 每个用户平均登录1-2台服务器
  - 80%登录在白天10:00-18:00

护网期间异常：
  - 今天SSH登录3000次
  - 有个普通员工登录了15台服务器
  - 凌晨2:00有50次登录
  → 指标偏离基线 → 可能被攻击了！
```

### 🎯 方法3：情报驱动狩猎

基于最新威胁情报进行针对性搜索。

```
最新情报：
  "APT29在最近的攻击中使用了新的C2域名模式：
   update-{random}.[microsoft|google|apple]-cdn.com"

我的狩猎行动：
  1. 搜索DNS日志中所有包含 "update-" 且后面跟着大厂的域名
  2. 找到匹配 → 检查请求这个域名的主机
  3. 发现了！一台服务器在过去一周内查询了
     update-x7k2.microsoft-cdn.com
  → APT29的C2通信！被我们狩猎找到了！
```

---

## 📖 三、威胁狩猎循环

威胁狩猎不是一次性的，而是一个持续的循环过程：

```
      ① 形成假设
      "攻击者可能用X技术"
            │
            ▼
      ② 收集数据
      从日志平台提取相关数据
            │
            ▼
      ③ 分析数据
      用规则/脚本/可视化找异常 ────┐
            │                     │
            ▼                     │（没找到就换下一个假设）
      ④ 发现威胁？               │
        ├─ 是 → ⑤ 响应处置       │
        │       ⑥ 分析为什么漏了   │
        │       ⑦ 改进检测规则     │
        │       ⑧ 回到①           │
        └─ 否 → 回到①            │
                                  │
         ◄────────────────────────┘
```

---

## 📖 四、威胁狩猎的数据源——你需要什么日志？

| 数据源 | 具体日志 | 能发现什么？ |
|--------|----------|-------------|
| **Sysmon** | Event ID 1（进程创建） | 异常进程链、黑客工具执行 |
| **Sysmon** | Event ID 3（网络连接） | C2通信、数据外传 |
| **Windows安全日志** | Event ID 4624/4625 | 异常登录、横向移动 |
| **PowerShell日志** | 模块加载/脚本块 | 无文件攻击 |
| **DNS日志** | A/TXT记录查询 | DNS隧道、DGA域名 |
| **WMI日志** | 操作审计 | 横向移动工具使用 |
| **计划任务日志** | Task Scheduler | 持久化后门 |

### 🔧 Sysmon——威胁狩猎的"夜视仪"

Sysmon是微软官方的系统监控工具，比Windows自带安全日志详细得多：

```
Windows安全日志：
  "有个进程启动了" ← 就这一句

Sysmon日志：
  "进程A用命令行xxx启动了进程B，
   进程B的哈希是yyy，父进程是zzz，
   网络连接到了1.2.3.4:443"
  ← 全都有！
```

---

## 📖 五、护网期间每日狩猎清单

```
每天早上8:00花1小时做以下狩猎查询：

☑ 昨晚有没有人凌晨3点登录？
  查询：Event ID 4624 且时间在 00:00-06:00

☑ 有没有进程在非工作时间大量连接外网？
  查询：Sysmon Event ID 3 且进程不是浏览器

☑ 有没有新的自启动项被添加？
  查询：注册表HKLM/.../Run新建了条目

☑ 有没有人用了不该用的工具？
  查询：进程名含 psexec/wmic/mimikatz/nc

☑ DNS有没有异常？
  查询：单主机域名查询>500/小时或域名长度>52

☑ 有没有人批量访问多台服务器的445端口？
  查询：内网445流量源IP→目标IP数量>10
```

---

## 💻 六、动手试试：假设驱动威胁狩猎

```python
# 假设驱动威胁狩猎框架
class ThreatHunter:
    def __init__(self, hunting_date):
        self.hunting_date = hunting_date
        self.hypotheses = []
        self.findings = []
    
    def add_hypothesis(self, name, attck_id, description, query_func):
        """添加一个狩猎假设"""
        self.hypotheses.append({
            'name': name,
            'attck_id': attck_id,
            'desc': description,
            'query': query_func
        })
    
    def hunt(self, log_data):
        """对日志数据执行所有假设"""
        for hyp in self.hypotheses:
            pct_complete = (self.hypotheses.index(hyp) + 1) / len(self.hypotheses) * 100
            print(f'🔍 [{pct_complete:.0f}%] 正在检查假设: {hyp["name"]}...')
            
            matches = hyp['query'](log_data)
            
            if matches:
                print(f'  🟡 发现 {len(matches)} 个可疑项！')
                for match in matches[:3]:  # 只展示前3条
                    print(f'     → {match}')
                self.findings.append({
                    'hypothesis': hyp,
                    'matches': matches,
                    'count': len(matches)
                })
            else:
                print(f'  ✅ 未发现异常')
    
    def report(self):
        """输出狩猎报告"""
        print(f'\n{"="*50}')
        print(f'🦁 威胁狩猎报告 - {self.hunting_date}')
        print(f'{"="*50}\n')
        
        if not self.findings:
            print('✅ 本次狩猎未发现威胁，环境看起来干净！')
            return
        
        total_threats = sum(f['count'] for f in self.findings)
        print(f'⚠️  共发现 {total_threats} 个可疑项，涉及 {len(self.findings)} 种攻击技术\n')
        
        for i, finding in enumerate(self.findings, 1):
            hyp = finding['hypothesis']
            print(f'{i}. [{hyp["attck_id"]}] {hyp["name"]}')
            print(f'   假设: {hyp["desc"]}')
            print(f'   命中: {finding["count"]} 条')
            print(f'   建议: 立即启动深度调查！\n')

# === 模拟一次护网每日狩猎 ===
hunter = ThreatHunter('2024-06-17 护网第5天')

# 假设1：攻击者使用DNS隧道
hunter.add_hypothesis(
    'DNS隧道C2通信', 'T1071.004',
    '假设攻击者使用DNS隧道进行隐蔽C2通信',
    lambda logs: [
        log for log in logs 
        if log.get('type') == 'dns' and (
            log.get('query_count', 0) > 500 or 
            log.get('avg_domain_len', 0) > 52
        )
    ]
)

# 假设2：攻击者在内网横向移动
hunter.add_hypothesis(
    '内网横向移动痕迹', 'T1021',
    '假设攻击者已经进入内网并尝试横向移动',
    lambda logs: [
        log for log in logs 
        if log.get('type') == 'auth' and
        log.get('unique_targets', 0) > 5
    ]
)

# 假设3：有凭据窃取行为
hunter.add_hypothesis(
    'LSASS凭据窃取', 'T1003.001',
    '假设攻击者尝试从内存中窃取凭据',
    lambda logs: [
        log for log in logs 
        if log.get('type') == 'process' and
        'lsass' in log.get('target_process', '').lower()
    ]
)

# 模拟日志数据
log_data = [
    {'type': 'dns', 'host': 'SRV-WEB01', 'query_count': 2000, 'avg_domain_len': 85},
    {'type': 'dns', 'host': 'SRV-WEB01', 'query_count': 50, 'avg_domain_len': 30},
    {'type': 'auth', 'host': 'PC-LISI', 'unique_targets': 12},
    {'type': 'process', 'host': 'PC-ZHANGSAN', 'target_process': 'mimikatz lsass'},
]

hunter.hunt(log_data)
hunter.report()
```

---

## 🧪 七、今日实验：ELK威胁狩猎

### 实验目标
在ELK中编写狩猎查询并发现隐藏威胁

### 实验步骤

```
1️⃣ 准备环境（ELK + Sysmon日志）
   确保Day 7部署的ELK中有Sysmon数据

2️⃣ 编写狩猎查询脚本
   ☑ Kibana Query Language (KQL):
     - event_id: 1 AND process_name: "cmd.exe" AND parent_process: "winword.exe"
   ☑ Elasticsearch DSL:
     - 复杂的聚合查询（按主机统计DNS查询数）

3️⃣ 执行6个日常狩猎假设
   ☑ 凌晨异常登录
   ☑ 异常进程链
   ☑ 高危工具执行
   ☑ DNS隧道特征
   ☑ 新自启动项
   ☑ 横向移动痕迹

4️⃣ 记录发现并输出狩猎报告
```

---

## 📝 八、今日测验

**Q1：威胁狩猎与威胁检测的主要区别是什么？**
- A. 没区别
- B. 狩猎是主动寻找，检测是被动响应  ✅
- C. 狩猎更简单
- D. 检测更高级

> 检测是等告警来，狩猎是自己去找可能漏掉的威胁。

**Q2：威胁狩猎循环的第一步是什么？**
- A. 响应处置
- B. 形成假设  ✅
- C. 分析数据
- D. 买工具

> 狩猎从假设开始——"我猜攻击者可能用了某种技术"，然后有针对性地去找证据。

**Q3：以下哪个日志最适合用作威胁狩猎的数据源？**
- A. 系统启动日志
- B. Sysmon进程创建日志（Event ID 1）  ✅
- C. 应用更新日志
- D. 性能日志

> Sysmon提供详细的进程创建、网络连接、文件创建等事件，比标准Windows日志丰富得多。

**Q4：威胁狩猎中"假设驱动"的最大好处是什么？**
- A. 减少工作量
- B. 有方向地搜索，而非大海捞针  ✅
- C. 不需要数据
- D. 不需要工具

> 有假设才知道去哪找、找什么，比盲目翻阅海量日志高效得多。

**Q5：护网期间建议多久做一次威胁狩猎？**
- A. 每周
- B. 每天  ✅
- C. 每月
- D. 不需要

> 护网期间攻击强度大、变化快，建议每天对前一天的日志做一次狩猎分析。

---

## 📚 九、课后资源

| 资源 | 链接 | 说明 |
|------|------|------|
| ThreatHunting.net | threathunting.net | 狩猎方法论文档 |
| Sysmon配置 | github.com/SwiftOnSecurity/sysmon-config | 最佳Sysmon配置 |
| ATT&CK狩猎指南 | attack.mitre.org | 按TTPs搜索狩猎方法 |

---

## 🧠 十、专家锦囊

> **赵安全说：** 威胁狩猎从David Bianco的痛苦金字塔底层开始。金字塔底部Hash/IP（容易变）→中间工具/网络（C2）→顶部TTPs（不变）。狩猎要从TTPs出发，关注攻击者行为模式而非具体IOC，这样狩猎才有持久价值。

---

📅 **Day 15 完成！** 今天你学会了威胁狩猎——不等告警，自己拿着"猎枪"去森林里找熊的足迹！
