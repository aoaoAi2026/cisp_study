# -*- coding: utf-8 -*-
"""Full content generator for Days 29-50. Each file will have 500+ lines of rich, metaphor-heavy content."""
import os
OUT = os.path.dirname(os.path.abspath(__file__))

def phase(d):
    if d <= 60: return ('第一阶段','第一阶段 \u00b7 初级蓝队夯实')
    elif d <= 90: return ('第二阶段','第二阶段 \u00b7 中级蓝队进阶')
    return ('第三阶段','第三阶段 \u00b7 高级蓝队升华')

def tbl(h, r):
    return '| ' + ' | '.join(h) + ' |\n|' + '|'.join([':---' for _ in h]) + '|\n' + '\n'.join('| ' + ' | '.join(str(c) for c in row) + ' |' for row in r) + '\n'

def sec(t, b):
    return '\n### ' + t + '\n\n' + b + '\n'

HEADER = r'''---
day: {day}
title: {title}
phase: {phase}
difficulty: {diff}
---

# Day {day}：{title}

> **阶段**：{phase_str} | **难度**：{diff} | **预计课时**：2-3 小时

---

## 📋 今日学习目标

{goals}

---

## 📖 核心知识讲解

{intro}

'''

FOOTER = r'''
---

## 🔧 实操任务

{tasks}

---

## ✅ 验收标准

{checklist}

---

## 📝 今日小结

{summary}

---

## 📚 延伸阅读

{reading}
'''

def write_day(day, title, diff, goals, intro, sections, tasks, checklist, summary, reading):
    ph, phs = phase(day)
    g = '\n'.join(f'{i}. {t}' for i,t in enumerate(goals,1))
    body = HEADER.format(day=day, title=title, phase=ph, diff=diff, phase_str=phs, goals=g, intro=intro)
    for stitle, sbody in sections:
        body += sec(stitle, sbody)
    body += FOOTER.format(
        tasks='\n'.join(f'{i}. {t}' for i,t in enumerate(tasks,1)),
        checklist='\n'.join(f'- [ ] {t}' for t in checklist),
        summary=summary,
        reading='\n'.join(f'- {t}' for t in reading))
    fname = os.path.join(OUT, f'day-{day}.md')
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(body)
    return body.count('\n')

# ========== DAY 29: ATT&CK Framework & Kill Chain ==========
D29 = lambda: write_day(29, 'ATT&CK框架与Kill Chain模型——蓝队的"敌军战术手册"', '\u2b50\u2b50 \u57fa\u7840', [
    '理解ATT&CK框架的矩阵结构和导航方式',
    '掌握Kill Chain的7个攻击阶段',
    '学会从蓝队视角映射"检测点"到攻击链的每个环节',
    '能说出5个以上ATT&CK战术（Tactics）和对应技术（Techniques）',
    '理解为什么ATT&CK是蓝队最重要的知识框架之一',
], r'''
> 🧠 **白话理解**：ATT&CK框架就像一本"敌军战术手册"——列出了黑客从踩点到得手的所有套路。Kill Chain就是一条"攻击流水线"——每一步都是你可以拦截的关卡。把两者结合起来，你就知道"攻击者可能怎么来，我应该在哪个环节设防"。

蓝队最大的困惑之一："攻击方法这么多，我该从哪学起？" ATT&CK回答了这个问题——它把成百上千种攻击技术组织成一个矩阵，每个技术都有编号、描述、检测方法。Kill Chain则把这些技术串联成一条"攻击时间线"——侦察→武器化→投递→利用→安装→C2→行动。

''', [
    ('ATT&CK矩阵是什么——一张表看懂黑客的所有招式', r'''
ATT&CK（Adversarial Tactics, Techniques, and Common Knowledge）由MITRE公司维护，是网络安全领域最权威的攻击行为知识库。它用一个矩阵来组织所有已知的攻击技术：

```
ATT&CK Matrix (企业版，简化示意)

               ┌──────────────────────────── 战术(Tactics) = 攻击目标 ────────────────────────────┐
               │ 初始访问   执行     持久化   提权     防御绕过 凭据访问 发现    横向移动 收集    C2     数据渗出
               │ (TA0001) (TA0002) (TA0003) (TA0004) (TA0005) (TA0006) (TA0007) (TA0008) (TA0009) (TA0011) (TA0010)
├──────────────┼──────────────────────────────────────────────────────────────────────────────────┤
│ 技术         │                                                                                   │
│ (Techniques) │ 每个格子下面有多个具体技术(ID: TXXXX)                                              │
│              │ 例如"初始访问"下面有：                                                             │
│ 具体攻击方法  │   T1190 - 利用公开漏洞                                                           │
│              │   T1566 - 钓鱼邮件                                                                │
│              │   T1078 - 利用有效账户                                                            │
│              │   T1133 - 外部远程服务                                                             │
└──────────────┴──────────────────────────────────────────────────────────────────────────────────┘
```

**三个核心概念：**

| 概念 | 英文 | 含义 | 打个比方 |
|:---|:---|:---|:---|
| 战术 | Tactics | 攻击者的"目标"——他想干什么 | "我要进入大楼"（初始访问） |
| 技术 | Techniques | 实现战术的"具体方法" | "从窗户翻进去"或"冒充员工刷卡" |
| 子技术 | Sub-techniques | 技术的"变种" | "打碎玻璃翻窗户"vs"撬锁翻窗户" |

> **蓝队用法**：你的防御要覆盖所有11个战术。如果你发现你的防御只在"初始访问"阶段有防火墙/WAF，但"横向移动"阶段没有任何检测手段——那攻击者一旦过了第一关就能在内网畅通无阻。ATT&CK就是帮你看清"防御盲区"的地图。
'''),

    ('Kill Chain——攻击的7个环节，每个都是你的拦截机会', r'''
杀伤链（Cyber Kill Chain）由Lockheed Martin提出，把一次完整攻击分解为7个步骤。每一步你都有机会检测和拦截：

''' + tbl(['步骤', '名称', '攻击者在做什么', '蓝队检测/防御手段', '如果这步拦住了...'], [
    ['1', '侦察(Recon)', '收集目标信息：IP/域名/员工邮箱/技术栈', '监控扫描行为、隐藏服务器信息', '攻击者连目标长啥样都不知道'],
    ['2', '武器化(Weaponize)', '制作攻击工具：带后门的文档、恶意payload', '邮件网关检测恶意附件', '恶意文件被拦截，到不了用户'],
    ['3', '投递(Delivery)', '把武器送进去：发钓鱼邮件、上传webshell', '邮件过滤、WAF拦截、安全意识培训', '武器送到了但没人打开'],
    ['4', '利用(Exploit)', '触发漏洞执行代码', 'IPS/EDR/WAF拦截exploit行为', '漏洞被触发但代码没执行'],
    ['5', '安装(Install)', '安装后门、持久化程序', 'EDR拦截恶意软件安装、HIPS阻止注册表修改', '后门装不上'],
    ['6', 'C2通信(C2)', '建立远程控制通道', '网络流量分析、DNS监控、IP信誉库', '后门装了但连不上控制端'],
    ['7', '行动(Act)', '达成目标：窃取数据、破坏系统', 'DLP数据防泄露、异常流量检测', '折腾半天什么都没偷到'],
]) + r'''

> **核心认知**：攻击者必须完成全部7步才算成功。你只需要在任何一步拦住他——攻击链就断了。而且攻击越往后（越靠近第7步），蓝队就越被动。所以**最佳防御是把攻击扼杀在早期阶段**（第1-3步）。
'''),

    ('ATT&CK + Kill Chain 结合使用——蓝队的终极"攻防地图"', r'''
把Kill Chain的每个阶段映射到ATT&CK的战术，你就得到了一张完整的"哪里可以设防"地图：

''' + tbl(['Kill Chain阶段', '对应ATT&CK战术', '关键检测技术', '蓝队典型操作'], [
    ['侦察', '侦察(TA0043)', '流量监控、扫描检测', '防火墙拒绝扫描IP、隐藏Server头'],
    ['武器化', '(攻击者侧，蓝队不可见)', '威胁情报：提前获知恶意文件Hash', '邮件网关过滤、端点安全'],
    ['投递', '初始访问(TA0001)', '钓鱼检测、Web攻击检测', 'WAF/IDS/邮件网关告警'],
    ['利用', '执行(TA0002)', 'exploit检测、异常进程监控', 'EDR/IPS检测并阻断'],
    ['安装', '持久化(TA0003)+防御绕过(TA0005)', '注册表监控、启动项监控', 'HIPS拦截、EDR告警'],
    ['C2', 'C2通信(TA0011)', 'DNS监控、异常外连检测', '防火墙出站策略、DNS sinkhole'],
    ['行动', '收集(TA0009)+数据渗出(TA0010)', 'DLP、大流量异常检测', 'DLP阻断、流量清洗'],
]) + r'''

> **背下来**：这7x11的对应关系就是你进行防御能力评估的检查清单。护网前做"防御能力评估"时，就是逐个检查"每个Kill Chain阶段我们有没有对应的检测/防御手段"。
'''),

    ('蓝队如何用ATT&CK做防御能力评估', r'''
这是蓝队最核心的实战技能之一。步骤：

**Step 1：列出你的防御清单**
```
你有哪些安全设备：防火墙/WAF/IDS/EDR/SIEM...
每个设备能检测/防御什么类型的攻击？
```

**Step 2：逐战术对照**
```
ATT&CK有11个战术，对每个战术问：
  - 我们有没有覆盖这个战术的检测手段？
  - 覆盖得够不够？（比如"横向移动"只有IDS一条规则 vs 检测+阻断+蜜罐告警三层防护）
```

**Step 3：打分和优先级**
| 战术 | 覆盖度 | 评分(1-5) | 优先级 |
|:---|:---|:---|:---|
| 初始访问 | WAF+防火墙+IPS | 4 | 中 |
| 持久化 | EDR | 3 | 高（单点覆盖） |
| 横向移动 | 无专门检测 | 1 | 🔴 最高（盲区！） |

**Step 4：制定改进计划**
针对评分最低的战术优先补充防御手段。

> **面试加分点**：当面试官问"你做过防御能力评估吗"，你说"我用ATT&CK框架对11个战术逐项评估覆盖率，发现横向移动和C2通信是覆盖盲区，然后针对性补充了检测规则..."——这句话就体现了你不是只会跑工具，而是有体系化的防御思维。
'''),

    ('ATT&CK实战导航——你该怎么用这个框架', r'''
**学习阶段（现在）**：
1. 打开 https://attack.mitre.org/ → 先只看"Enterprise Matrix"
2. 随便点一个技术（比如 T1059 Command and Scripting Interpreter）→ 看它的描述、检测方法、缓解措施
3. 每天学一个新攻击技术时，到ATT&CK里找到它的编号和位置
4. 养成习惯：任何攻击手法都去ATT&CK查——它就像一个"攻击技术维基百科"

**中级阶段**：
1. 用ATT&CK Navigator画热力图——红色=覆盖不足，绿色=覆盖良好
2. 把你的检测规则和ATT&CK技术一一对应（Rule T1059.001 → 检测PowerShell攻击）
3. 做Gap Analysis：哪些ATT&CK技术我们完全没覆盖？

**高级阶段**：
1. 基于ATT&CK构建威胁模型：某APT组织常用的技术组合 → 针对性强化对应检测
2. 自动化ATT&CK覆盖度评估
3. 输出"ATT&CK防御成熟度报告"

> **今天的最小行动**：打开 https://attack.mitre.org/matrices/enterprise/，花10分钟浏览一下整个矩阵的11列。不需要记住所有技术——只需要知道"有这么个东西，以后查攻击技术时来这找"。
'''),

    ('常见攻击技术精选——今天先记住这10个T编号', r'''
不需要一次记住全部几百个技术，先记住最高频的10个：

''' + tbl(['T编号', '技术名称', '大白话', '为什么重要'], [
    ['T1059', 'Command & Scripting Interpreter', '用脚本(PS/bash)执行命令', '攻击者最常用的执行方式'],
    ['T1078', 'Valid Accounts', '用偷来的合法账户登录', '最难检测——看不出和正常登录什么区别'],
    ['T1566', 'Phishing', '钓鱼邮件', '90%以上APT攻击的初始突破点'],
    ['T1505', 'Server Software Component', 'WebShell后门', 'Web攻击后最常见的持久化方式'],
    ['T1041', 'Exfiltrate Over C2 Channel', '通过C2通道偷数据', '数据泄露的最后一步'],
    ['T1021', 'Remote Services', '远程服务(RDP/SSH)横向移动', '内网横移最常用方法'],
    ['T1003', 'OS Credential Dumping', '从内存中偷密码Hash', '拿到密码=拿到了整个域的钥匙'],
    ['T1110', 'Brute Force', '暴力破解', '最常见且最容易被检测的攻击'],
    ['T1190', 'Exploit Public-Facing App', '利用公网应用漏洞', '攻击者入内的最常见入口'],
    ['T1486', 'Data Encrypted for Impact', '加密数据(勒索)', '近年来增长最快的攻击类型'],
])

> **记忆法**：T编号可以不用背，但要记住"ATT&CK有11列，每列下面有一堆T编号的技术"。以后分析攻击时，把看到的攻击行为对应到某个T编号——这叫"ATT&CK Mapping"，是蓝队的基本技能。
'''),
], [
    '打开 https://attack.mitre.org/ → 浏览Enterprise Matrix → 找到T1059技术，看它的检测方法',
    '打开 https://attack.mitre.org/ → 下载ATT&CK Navigator → 尝试画一个"你所在组织"的防御热力图（哪怕只有5个格子）',
    '用Kill Chain的7个阶段分析一次你知道的真实攻击事件（如Log4j漏洞利用）：每个阶段发生了什么？在哪里可以拦截？',
    '搜索"ATT&CK 蓝队检测"找一篇中文文章，加深理解',
    '尝试将Day 19-20学到的攻击类型（端口扫描/SQL注入等）对应到ATT&CK的技术编号',
], [
    '能解释ATT&CK的战术(Tactics)和技术(Techniques)的区别',
    '能说出Kill Chain的7个阶段以及每阶段蓝队的检测/防御手段',
    '能找到ATT&CK矩阵中至少5个战术及其对应的技术编号',
    '能用自己的话说清楚"ATT&CK Mapping"是什么、为什么要做',
    '理解"攻击越早拦截越好"的防御纵深思想',
], r'''今天学会了蓝队最重要的"知识框架"——ATT&CK和Kill Chain。ATT&CK = 所有攻击技术的百科全书，Kill Chain = 把这些技术串成攻击链。把两者结合，你就有了评估防御能力的"参照系"——知道攻击者怎么来，才知道防御应该设在哪。今天的关键词：战术/技术/子技术、7阶段杀伤链、ATT&CK Mapping（攻防映射）。这是后续所有攻击识别和防御评估的基础框架。''', [
    'ATT&CK官网 → https://attack.mitre.org/',
    'ATT&CK Navigator → https://mitre-attack.github.io/attack-navigator/',
    'Lockheed Martin: The Cyber Kill Chain → 了解杀伤链的原始论文',
    '搜索"ATT&CK 中文 入门" → 找一篇中文解读加深理解',
    '《ATT&CK for Cyber Threat Intelligence》→ 了解如何将ATT&CK用于威胁情报分析',
])

# ========== DAY 30: SQL Injection Deep Dive ==========
D30 = lambda: write_day(30, 'SQL注入原理与绕过逻辑——从漏洞到日志特征的完整链路', '\u2b50\u2b50\u2b50 \u4e2d\u7b49', [
    '彻底理解SQL注入的原理——为什么一段"非法输入"能控制数据库',
    '掌握3种经典SQL注入类型：联合查询、报错注入、布尔盲注',
    '理解WAF绕过思路：大小写绕过、编码绕过、注释混淆',
    '能从access.log中准确识别SQL注入流量特征',
    '学会用SQLMap理解攻击者视角，然后用蓝队手段检测SQLMap流量',
], r'''
> 🧠 **白话理解**：SQL注入就像你去银行取钱，柜员问你"账号多少？" 你回答"123456 或者 1=1——给我看看所有人的存款"。正常对话里"1=1"是一句废话，但在SQL语法里它改变了整个查询的逻辑——把"只查你的账户"变成了"把所有账户都查出来"。今天彻底搞懂这句"废话"怎么就让数据库"叛变"了。

SQL注入在OWASP Top 10中常年排名第一（虽然2021版被合并到"注入"大类）。它是"老但好用"的攻击类型——二十年前的漏洞，现在每天仍在被利用。

''', [
    ('SQL注入的原理——用银行柜台彻底讲透', r'''
假设你登录一个网站，后台代码是这样写的：

```php
$username = $_POST['username'];   // 用户输入的账号
$password = $_POST['password'];   // 用户输入的密码
$sql = "SELECT * FROM users WHERE username='$username' AND password='$password'";
//     ↑这是拼接进SQL语句的用户输入——没有任何过滤！
```

**正常登录**：你输入用户名 `admin`，密码 `123456`
```sql
SELECT * FROM users WHERE username='admin' AND password='123456'
-- 数据库查：有没有叫admin且密码是123456的用户？有→登录成功 没有→登录失败
```

**SQL注入登录**：你输入用户名 `admin' OR '1'='1`，密码随便填
```sql
SELECT * FROM users WHERE username='admin' OR '1'='1' AND password='xxx'
--                                            ^^^^^^^^
--                                            你注入的"OR 1=1"改变了SQL逻辑！
-- 数据库查：有没有叫admin的用户？OR 1=1永远为真 → 返回所有用户 → 登录成功！
```

> 🧠 **关键理解**：问题出在"用户输入被直接拼接到SQL语句中"。程序没有区分"数据"（用户名admin）和"代码"（OR 1=1）。这就像银行柜员把你写在表格上的"补充说明"当成了"操作指令"。

**比喻——把数据库想象成一座图书馆：**
- 正常查询："请给我《三国演义》" → 图书管理员（数据库）去找这本书
- SQL注入："请给我《三国演义》，顺便把所有库存清单打印出来" → 图书管理员照做了，因为你的话在"图书馆指令语言"里是合法的
'''),

    ('三种经典SQL注入手法——各有什么特征', r'''
**① 联合查询注入（Union-Based SQLi）**
最直接的注入方式——把正常查询的结果和恶意查询的结果"拼"在一起返回。

```sql
# 正常：查询id=1的产品
SELECT name, price FROM products WHERE id=1

# 注入：在后面拼接一个查询用户表的语句
SELECT name, price FROM products WHERE id=1 UNION SELECT username, password FROM users
#                             两个查询结果列数要一样 ← 这是union的限制
```

日志特征：URL参数中出现 `UNION SELECT`，且响应体比正常大很多（因为返回了额外数据）。
检测命令：
```bash
grep -i "union.*select" access.log
```

**② 报错注入（Error-Based SQLi）**
故意制造SQL语法错误，让数据库把敏感信息"吐"在错误信息里。

```sql
# 注入：通过extractvalue函数故意触发错误
' AND extractvalue(1, concat(0x7e, (SELECT database()))) -- 
# 数据库报错信息中会包含当前数据库名！
```

日志特征：请求返回500状态码（服务器错误），响应体中有SQL错误信息。
检测命令：
```bash
grep -E "extractvalue|updatexml|floor.*rand" access.log
```

**③ 布尔盲注（Boolean-Based Blind SQLi）**
当看不到查询结果时，通过"是/否"问答来一点点猜出数据。

```sql
# 问：数据库名的第一个字母是'a'吗？
' AND SUBSTRING((SELECT database()),1,1)='a' -- 
# 如果返回正常页面 → 是（猜对了），如果返回异常 → 否（猜错了）
# 重复26次猜出第一个字母，再重复猜后面的...
```

日志特征：同一参数的大量类似请求（只变化一个判断条件），每次请求返回两种不同的响应。
检测命令：
```bash
grep "SUBSTRING\|ascii\|mid\|ord" access.log
```
'''),

    ('SQLMap——攻击者的自动化利器，蓝队的检测重点', r'''
SQLMap是最知名的自动化SQL注入工具。它把上面三种手法全部自动化了——你只需要给它一个可能存在注入的URL，它就自动探测、自动利用、自动拖库。

**SQLMap的流量特征（蓝队必须能识别）：**

| 特征 | 具体表现 | 检测方法 |
|:---|:---|:---|
| User-Agent | 默认 `sqlmap/1.x#stable` | WAF/IDS检测UA；攻击者可能会改，但很多忘改 |
| 请求参数 | 短时间发送大量变体（`'` `"` `)` `AND 1=1` `AND 1=2`）| 同一URL短时间内大量请求+参数包含SQL测试字符 |
| URI | 可能包含 `%27` (`'` 的URL编码) | URL解码后包含SQL关键字 |
| 时间盲注 | 请求中包含 `WAITFOR DELAY` 或 `SLEEP(5)` | 响应时间异常长（5秒+） |
| 频率 | 短时间内几百到几千个请求 | 速率监控告警 |

**Wireshark检测SQLMap流量：**
```
过滤器：http.request.uri contains "select" or http.request.uri contains "union"
再看同一IP的请求频率——正常用户不会每秒钟发10个带SQL关键字的请求
```

> **蓝队思维**：你必须知道SQLMap怎么用（至少知道它能干什么、流量长什么样），才能在护网中发现它。**你的目标是检测SQLMap，不是防御SQL注入本身（那是WAF的事）。**
'''),

    ('SQL注入的日志特征速查表——蓝队日常必备', r'''
以下是你看到日志时用来判断"是不是SQL注入"的速查手册：

''' + tbl(['特征类型', '特征内容', '日志示例', '严重程度'], [
    ['单引号探测', "URL参数中出现 `'` 或 `%27`", '?id=1\'', '中（可能是正常输入）'],
    ['永真条件', '`OR 1=1` `OR \'a\'=\'a` `OR 1`', '?id=1 OR 1=1', '高（明确注入意图）'],
    ['UNION查询', '`UNION SELECT` `UNION ALL SELECT`', '?id=-1 UNION SELECT 1,2,user()', '严重（正在拖数据）'],
    ['注释符', '`-- ` `#` `/**/`在URL中', '?id=1--', '高'],
    ['系统函数', '`user()` `database()` `version()` `@@version`', '?id=1 AND user()', '严重（正在收集信息）'],
    ['INFORMATION_SCHEMA', '查表结构的关键词', '?id=1 UNION SELECT table_name FROM information_schema.tables', '严重（正在拖库结构）'],
    ['时间盲注', '`SLEEP(5)` `WAITFOR DELAY` `BENCHMARK`', '?id=1 AND SLEEP(5)', '严重（盲注）'],
    ['报错函数', '`extractvalue` `updatexml` `floor`', '?id=1 AND extractvalue(1,concat(0x7e,database()))', '严重（报错注入）'],
    ['堆叠查询', '`;` 后跟另一条SQL', '?id=1; DROP TABLE users--', '严重（可能破坏数据）'],
    ['编码混淆', '`CHAR(65,66,67)` = `ABC`', '?id=1 UNION SELECT CHAR(117,115,101,114)', '高（试图绕过WAF）'],
])

**蓝队分析流程（看到SQL注入告警时）：**
1. 提取告警中的URL和请求参数
2. 到access.log中搜索同一IP的所有请求
3. 判断：是一次性探测还是系统化注入攻击？
   - 一次性探测 = 测试性质的1-2个请求 → 低优先级（可能是扫描器）
   - 系统化注入 = 几十到几百个请求，用了多种手法 → 高优先级（真实的攻击尝试）
4. 查看对应请求的响应状态码 → 200说明注入成功了？→ 立刻升级！
5. 结合响应体大小 → 异常大的响应体可能包含拖库数据
'''),

    ('用银行类比记住SQL注入的防御层级', r'''
SQL注入的防御不是"一层墙"，而是多层防线：

```
第一层：输入验证（银行柜台第一步：检查你的身份证）
  → 手机号只允许数字、邮箱必须有@、用户名最大50字符
  → 把明显不合理的输入直接拒绝
           ↓ 如果绕过了...
第二层：参数化查询（银行柜台第二步：用标准表单填信息）
  → SELECT * FROM users WHERE username=? AND password=?
  → ?是占位符，用户输入只当"数据"，绝不会被当"代码"执行
  → ⭐ 这是防御SQL注入的终极方案！
           ↓ 如果应用层没做...
第三层：WAF（银行大厅的安检门）
  → 检测请求中是否有SQL注入特征，有就拦截
           ↓ 如果WAF被绕过...
第四层：数据库最小权限（金库的权限分级）
  → Web应用连接数据库的账户只有SELECT权限，没DROP权限
  → 即使注入成功，也只能查数据，不能删数据
           ↓ 如果还是被注入成功了...
第五层：监控告警（银行监控中心）
  → 日志/IDS/SIEM检测到SQL注入流量 → 告警 → 蓝队响应
```

> **一句话记住**：参数化查询（或ORM框架如MyBatis的 `#{}`） = 永绝SQL注入后患。其他层都是辅助。如果你的Web应用还在用拼接SQL，无论WAF多强都是在"用创可贴堵动脉出血"。
'''),
], [
    '在DVWA靶场中完成SQL注入（Low级别） → 同时用BurpSuite或浏览器F12抓取注入请求 → 记录请求特征',
    '用grep在access.log中搜索SQL注入特征：`grep -iE "union|select|' or |information_schema" access.log`',
    '在Wireshark中模拟：在本机 `curl "http://127.0.0.1/test?id=1' OR '1'='1"` → 抓包 → 查看HTTP请求中的注入payload',
    '搜索"SQLMap流量分析"，找一篇分析SQLMap流量的文章，学习识别自动化注入工具',
    '用自己的话画一张"SQL注入防御五层体系"的思维导图',
], [
    '能用大白话解释SQL注入的原理（为什么拼接SQL有安全问题）',
    '能说出3种SQL注入类型（联合查询/报错注入/盲注）及其日志特征',
    '能从access.log中用grep识别出SQL注入尝试',
    '能解释SQLMap的流量特征，并说出至少3种识别SQLMap扫描的方法',
    '理解参数化查询为什么是防御SQL注入的终极方案',
    '能说出SQL注入的5层防御体系',
], r'''今天彻底搞懂了SQL注入——用户输入被当作代码执行。三种注入类型各有特征：UNION SELECT是"直接问"、报错注入是"故意犯错让数据库说漏嘴"、盲注是"反复问是/否来猜"。从蓝队角度，最重要的是能在日志中识别这些特征：单引号+OR+UNION+系统函数，并用Wireshark看到SQLMap的自动化流量。防御核心：参数化查询。WAF是辅助，不是根本。''', [
    'OWASP: SQL Injection → https://owasp.org/www-community/attacks/SQL_Injection',
    'PortSwigger: SQL Injection Cheat Sheet → SQL注入的各种payload速查',
    'SQLMap官方Wiki → https://github.com/sqlmapproject/sqlmap/wiki',
    'DVWA靶场 → 动手练SQL注入的最好入门靶场',
    '搜索"SQL Injection 绕过WAF"了解攻击者怎么对抗检测',
])

if __name__ == '__main__':
    import sys
    funcs = {'29': D29, '30': D30}
    days = sys.argv[1:] if len(sys.argv) > 1 else sorted(funcs.keys())
    for d in days:
        if d in funcs:
            lines = funcs[d]()
            print(f'Day {d}: {lines} lines')
    print('Done!')
