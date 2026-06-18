#!/usr/bin/env python3
"""Rich expander: compact topic data -> 500+ line markdown. Days 31-120."""
import os, sys

OUT = '.'
phase_map = lambda d: '第一阶段 - 初级蓝队夯实' if d<=60 else ('第二阶段 - 中级蓝队进阶' if d<=90 else '第三阶段 - 高级蓝队升华')

def write_md(day, lines):
    content = ''
    for l in lines:
        content += l + '\n'
    with open(os.path.join(OUT, f'day-{day}.md'), 'w', encoding='utf-8') as f:
        f.write(content)
    return len(lines)

# ─── RICH EXPANDER ───
def expand_day(day, title, diff, topics, tasks, checklist, interview, case, summary):
    """Expand compact topic data into 500+ line markdown.
    
    topics: list of (topic_name, [(subtitle, paragraphs_list), ...])
    Each paragraph_list item is a string or list of strings.
    """
    p = phase_map(day)
    L = []  # output lines
    # Frontmatter
    L.extend([f'---', f'day: {day}', f'title: {title}', f'phase: {p}', f'difficulty: {diff}', '---', ''])
    # Title
    L.extend([f'# Day {day}：{title}', '',
              f'> **阶段**：{p} | **难度**：{diff} | **课时**：2-3小时', '', '---', ''])
    # Goals
    L.append('## 📋 今日学习目标')
    L.append('')
    L.append(f'1. 系统掌握{title}的核心原理和工作机制')
    L.append(f'2. 理解攻击者如何利用相关技术进行攻击')
    L.append(f'3. 掌握蓝队针对相关技术的检测方法和工具')
    L.append(f'4. 能从日志和流量中识别相关攻击行为')
    L.append(f'5. 建立相关技术的纵深防御思路')
    L.append(f'6. 完成全部实操任务并达到验收标准')
    L.extend(['', '---', '', '## 📖 核心知识讲解', ''])
    
    # Content sections
    idx = 0
    for topic_name, subtopics in topics:
        idx += 1
        L.append(f'### {idx}、{topic_name}')
        L.append('')
        for sub_name, sub_body in subtopics:
            L.append(f'#### {sub_name}')
            L.append('')
            if isinstance(sub_body, list):
                for item in sub_body:
                    if isinstance(item, list):
                        L.extend(item)
                    else:
                        L.append(item)
            else:
                L.append(sub_body)
            L.append('')
        L.append('---')
        L.append('')
    
    # Tasks
    L.extend(['## 🔧 实操任务', ''])
    for i, t in enumerate(tasks, 1):
        L.append(f'{i}. {t}')
    L.extend(['', '---', '', '## ✅ 验收标准', ''])
    for c in checklist:
        L.append(f'- [ ] {c}')
    
    # Interview
    if interview:
        L.extend(['', '---', '', '## 💡 面试高频题', ''])
        for q, a in interview:
            L.append(f'**Q: {q}**')
            L.append('')
            L.append(f'A: {a}')
            L.append('')
    
    # Case
    if case:
        L.extend(['', '---', '', '## 📊 真实案例', ''])
        L.extend(case)
    
    # Summary
    L.extend(['', '---', '', '## 📝 今日小结', ''])
    L.append(summary)
    
    # Reading
    L.extend(['', '---', '', '## 📚 延伸阅读',
              '1. 将今天所学整理到个人笔记库，用自己的话重写核心概念',
              '2. 搜索今天主题相关的CVE编号和行业案例',
              '3. 在靶场中亲手复现今天学习的攻击手法（蓝队视角）',
              '4. 整理今天学到的检测规则到命令速查手册',
              '5. 在FreeBuf/安全客上搜索今天主题的实战文章',
              '6. 将今天遇到的疑问记录下来，作为明日补充目标',
              '7. 在Blue Team Labs Online找一道相关练习',
              '8. 画一张今天知识点的思维导图',
              ''])
    return L

# ─── TOPIC DATA: Day 33 ───
D33_TOPICS = [
    ("BurpSuite核心功能与蓝队使用场景", [
        ("什么是BurpSuite——Web安全的\"瑞士军刀\"", [
            "BurpSuite是PortSwigger公司开发的Web应用安全测试平台，是全球最广泛使用的Web安全工具之一。虽然它最初设计为渗透测试工具，但蓝队同样需要掌握它以\"用攻击者的视角看问题\"。",
            "",
            "**BurpSuite的三个版本**：",
            "- Community Edition（免费）：包含Proxy/Repeater/Decoder/Comparer等核心功能",
            "- Professional（付费）：增加Scanner/Intruder全功能/BApp插件商店",
            "- Enterprise（企业版）：持续扫描+CI/CD集成",
            "",
            "**蓝队为什么需要学BurpSuite？**",
            "1. **理解攻击流量构造**——通过Repeater逐包分析攻击载荷，理解攻击者的payload是如何构造的",
            "2. **验证告警真伪**——复现WAF告警中的请求，判断是真实攻击还是误报",
            "3. **模拟攻击验证**——在授权测试中验证安全设备的检测规则是否生效",
            "4. **学习攻击手法**——通过观察和构造请求，深入理解Web攻击的原理",
        ]),
        ("Proxy模块——HTTP/HTTPS流量拦截与分析", [
            "Proxy是BurpSuite最核心的模块，充当浏览器和服务器之间的\"中间人\"，可以拦截、查看、修改所有HTTP/HTTPS请求和响应。",
            "",
            "**配置步骤（跟着做一遍就懂）**：",
            "1. 启动BurpSuite → Proxy → Options → 确认监听地址为127.0.0.1:8080",
            "2. 配置浏览器代理为127.0.0.1:8080（或安装FoxyProxy插件方便切换）",
            "3. 访问http://burpsuite 下载CA证书 → 导入浏览器 → 实现对HTTPS流量的解密",
            "",
            "**蓝队使用场景**：",
            "- 打开Intercept（拦截模式）→ 浏览目标网站 → 查看每一个请求的完整内容（请求头/请求体/Cookie/参数）",
            "- 在HTTP History中查看所有请求-响应对 → 寻找攻击者可能利用的参数点",
            "- 使用Filter功能筛选特定域名的请求 → 专注分析目标应用",
            "",
            "**实操示例——分析登录请求**：",
            "```",
            "POST /login.php HTTP/1.1",
            "Host: target.com",
            "Content-Type: application/x-www-form-urlencoded",
            "Cookie: PHPSESSID=abc123",
            "",
            "username=admin&password=123456",
            "```",
            "蓝队通过观察此请求可以判断：登录接口是否使用了HTTPS？是否验证了CSRF Token？密码是否明文传输？这些都是在安全评估中需要关注的点。",
        ]),
        ("Repeater模块——请求重放与攻击模拟", [
            "Repeater让蓝队可以手动修改并重放单个HTTP请求——观察不同输入下服务器的响应差异，这是理解漏洞原理的最佳方式。",
            "",
            "**使用流程**：",
            "1. 在Proxy History中右键某个请求 → Send to Repeater",
            "2. 在Repeater中修改请求参数 → 点击Send → 观察Response",
            "3. 反复修改-发送-观察，直到完全理解该接口的行为",
            "",
            "**蓝队实战：验证SQL注入漏洞**",
            "```",
            "# 原始请求",
            "GET /product.php?id=1 HTTP/1.1",
            "",
            "# 修改参数测试注入（Repeater中修改）",
            "GET /product.php?id=1' HTTP/1.1  → 观察响应是否报错",
            "GET /product.php?id=1 AND 1=1 HTTP/1.1  → 观察响应是否正常",
            "GET /product.php?id=1 AND 1=2 HTTP/1.1  → 观察响应是否变化",
            "```",
            "通过Repeater，蓝队可以精确地理解\"这个参数是否可被注入\"——这比看100页理论文章更直观。",
        ]),
        ("Decoder与Comparer——编码解码与响应对比", [
            "**Decoder（编码解码器）**：",
            "- 支持URL编码/HTML编码/Base64/Hex/ASCII等多种编码格式的互相转换",
            "- 蓝队用法：解码攻击者的payload → 理解攻击意图（如Base64解码后的真实SQL语句）",
            "- 实操：复制一段`%3Cscript%3Ealert(1)%3C/script%3E`到Decoder → URL Decode → 看到真实的`<script>alert(1)</script>`",
            "",
            "**Comparer（对比器）**：",
            "- 对比两次请求/响应的差异——找出攻击者修改了什么参数",
            "- 蓝队用法：对比正常请求和攻击请求的差异 → 精确识别攻击payload",
            "- 实操：发送两个请求到Comparer → 逐字/逐词对比 → 红色高亮显示差异部分",
            "",
            "这两个模块虽然\"小\"，但在日常分析中非常实用。Decoder帮你\"解读密码\"，Comparer帮你\"找出不同\"。",
        ]),
        ("Intruder与Scanner——自动化攻击与蓝队视角", [
            "**Intruder（攻击器）**：",
            "- 对某个参数进行自动化批量测试（暴力破解/参数fuzzing/枚举ID）",
            "- 蓝队需要了解Intruder的能力范围——它的攻击模式（Sniper/Battering Ram/Pitchfork/Cluster Bomb）和payload类型",
            "- 蓝队检测：Intruder会在短时间内发送大量相似请求（参数值不同，其余相同）→ 这是Web日志中的明显特征",
            "",
            "**Scanner（扫描器——仅Professional版）**：",
            "- 自动爬取网站并检测漏洞（SQL注入/XSS/文件包含等100+种漏洞类型）",
            "- 蓝队需要了解：Scanner的流量特征是什么？如何区分BurpSuite扫描和真实攻击？",
            "- 典型特征：爬虫行为（大量404）+ 主动扫描（参数中出现探针payload） + 间隔规律",
            "",
            "> **核心认知**：蓝队学BurpSuite不是为了做渗透测试，而是为了\"精确理解攻击者的每一个动作\"。当你能用BurpSuite自己构造出攻击流量时，你就能在Wireshark/日志中一眼认出相同的攻击模式。",
        ]),
    ]),
]

D33_TASKS = [
    "下载安装BurpSuite Community Edition → 配置浏览器代理 → 成功拦截第一个HTTP请求",
    "用Repeater发送至少10个不同的请求到DVWA的SQL注入关卡 → 观察每个响应差异 → 记录测试过程",
    "在Decoder中解码一组编码过的攻击payload → 理解原始攻击意图",
    "用Comparer对比SQL注入成功和失败的响应 → 精确定位差异",
    "用BurpSuite的Proxy History导出一份HTTP流量 → 用Wireshark对比同一份流量的展示差异",
]
D33_CHECKLIST = [
    "能独立配置BurpSuite代理并拦截HTTP/HTTPS流量",
    "能使用Repeater重放请求并分析响应",
    "能使用Decoder解码Base64/URL/Hex编码的payload",
    "能使用Comparer对比两次请求/响应的差异",
    "能解释蓝队为什么需要学习\"攻击工具\"",
]
D33_INTERVIEW = [
    ("BurpSuite的Proxy和Repeater有什么区别？", "Proxy用于\"实时拦截和浏览\"（类似Wireshark的追踪流，可以看所有请求-响应），Repeater用于\"手动修改和重放单个请求\"（类似Postman，可以精确修改每个参数后单独发送）。Proxy看全貌，Repeater做深度分析。"),
    ("蓝队为什么要学BurpSuite？这不是渗透测试工具吗？", "理解攻击者使用的工具 = 理解攻击者的手法。学BurpSuite的三个核心价值：①验证告警——收到WAF告警后，在测试环境中用Repeater复现请求，判断是真攻击还是误报；②学习攻击——亲自构造payload比看文章学得更快、更扎实；③验证防御——测试你配置的WAF规则是否真的能拦截攻击。蓝队用BurpSuite就像警察学撬锁——不是为了偷东西，而是为了防盗。"),
    ("BurpSuite Intruder的流量特征是什么？如何检测？", "特征：①短时间内大量请求到同一URL；②每次请求只有一个/少数几个参数的值不同；③参数值呈现系统性的变化模式（字典遍历/数字递增/fuzz payload）。检测：Web日志中同一IP对同一路径的大量请求+参数变体超过50种+短时间内请求频率极高=Intruder攻击。"),
]
D33_CASE = [
    "**案例：用BurpSuite分析一次真实的Web攻击**",
    "",
    "某蓝队在护网期间收到SIEM告警——一个境外IP在5分钟内对电商网站的搜索接口发送了200+次请求。蓝队将告警中的请求复制到BurpSuite的Repeater中分析：",
    "",
    "1. 用Repeater逐个参数修改测试 → 发现搜索关键词参数存在反射型XSS",
    "2. 用Decoder解码payload → 发现攻击者尝试了3种XSS变体（<script>标签/img onerror/iframe src）",
    "3. 用Comparer对比不同payload的响应 → 确定`<img src=x onerror=alert(document.cookie)>`成功执行",
    "4. 确认该接口存在XSS漏洞 → 通知开发修复 → 更新WAF规则拦截此类payload",
    "",
    "如果没有BurpSuite，蓝队只能看Wireshark中的原始HTTP包——分析和验证效率会降低10倍以上。工具用对了，事半功倍。",
]
D33_SUMMARY = "今天系统学习了BurpSuite的核心模块（Proxy/Repeater/Decoder/Comparer/Intruder），建立了\"用攻击者工具理解攻击行为\"的蓝队思维。核心认知：蓝队学攻击工具不是为了攻击，而是为了更精确地理解攻击——当你自己能构造出攻击流量时，你就能在防御侧一眼认出它。BurpSuite就是你\"理解攻击\"的加速器。"

# ============================================================
# Day 34: SQLMap (Blue Team Perspective)
# ============================================================
D34_TOPICS = [
    ("SQLMap自动注入工具——蓝队识别指南", [
        ("SQLMap是什么——攻击者的\"全自动注入机器人\"", [
            "SQLMap是全球最流行的开源SQL注入自动化工具，使用Python编写，支持几乎所有主流数据库（MySQL/Oracle/PostgreSQL/MSSQL/Access/SQLite等）。对于攻击者来说，它是\"一键检测+利用\"的利器；对于蓝队来说，理解SQLMap的流量特征是识别自动化攻击的关键。",
            "",
            "**SQLMap的核心能力**：",
            "1. 自动检测SQL注入点（数字型/字符型/搜索型/盲注/报错注入/UNION注入）",
            "2. 自动获取数据库信息（版本/用户/数据库名/表名/列名）",
            "3. 自动拖取数据（dump指定表的所有数据）",
            "4. 自动写入文件（INTO OUTFILE → 写webshell到Web目录）",
            "5. 自动执行系统命令（通过xp_cmdshell/UDF等方式）",
            "",
            "**蓝队必知的SQLMap命令示例**：",
            "```bash",
            "# 基础检测",
            "sqlmap -u \"http://target.com/page.php?id=1\"",
            "",
            "# 指定注入技术（B=Boolean盲注, T=Time盲注, U=UNION, E=Error报错）",
            "sqlmap -u \"http://target.com/page.php?id=1\" --technique=BEU",
            "",
            "# 获取数据库列表",
            "sqlmap -u \"http://target.com/page.php?id=1\" --dbs",
            "",
            "# 拖取指定表数据",
            "sqlmap -u \"http://target.com/page.php?id=1\" -D dbname -T users --dump",
            "",
            "# 通过POST请求注入",
            "sqlmap -u \"http://target.com/login.php\" --data=\"user=admin&pass=123\"",
            "",
            "# OS Shell（获取系统命令执行权限）",
            "sqlmap -u \"http://target.com/page.php?id=1\" --os-shell",
            "```",
        ]),
        ("SQLMap流量特征——7个识别要点", [
            "蓝队识别SQLMap流量的7个关键特征（至少掌握前5个）：",
            "",
            "**特征1：系统性的参数变化（最核心特征）**",
            "SQLMap会对同一个参数进行20-30+种不同的payload测试。从一个简单的单引号探测开始，逐步升级到复杂的UNION/盲注/报错注入。日志中的表现：同一参数的值在短时间出现大量变体。",
            "```bash",
            "# 检测命令：统计同一IP对同一URL的参数变化",
            "grep 'SQLMAP_SUSPECT_IP' access.log | awk '{print $7}' | sort -u | wc -l",
            "# 如果参数变体 > 20 → 很可能是SQLMap",
            "```",
            "",
            "**特征2：时间盲注探测**",
            "SQLMap默认使用`sleep(5)`作为时间盲注的探测函数。",
            "```bash",
            "# 检测命令：查找sleep函数调用",
            "grep -iE '(sleep\\(|benchmark\\(|pg_sleep\\(|waitfor\\s+delay)' access.log",
            "```",
            "",
            "**特征3：User-Agent标识**",
            "默认UA包含`sqlmap`字样，但攻击者通常会用`--user-agent`参数修改。",
            "```bash",
            "grep -i 'sqlmap' access.log",
            "```",
            "",
            "**特征4：INFORMATION_SCHEMA查询（拖库前奏）**",
            "SQLMap在获取数据库结构时会频繁访问INFORMATION_SCHEMA系统表。",
            "```bash",
            "grep -i 'information_schema' access.log",
            "```",
            "",
            "**特征5：大量的布尔表达式探测**",
            "SQLMap通过AND 1=1/AND 1=2等布尔表达式判断注入是否存在。",
            "```bash",
            "# 检测命令",
            "grep -E '( and 1=1| and 1=2| or 1=1| and 2>1)' access.log | wc -l",
            "```",
            "",
            "**特征6：规律性的请求间隔**",
            "SQLMap在每个payload之间通常有固定的延迟（可配置），手工注入的间隔是不规律的。使用`--delay`参数的SQLMap会有非常规律的时间间隔。",
            "",
            "**特征7：UNION SELECT字段数探测**",
            "SQLMap会系统性地尝试不同数量的UNION SELECT字段（1,2,3→1,2,3,4→1,2,3,4,5→...）来探测可联合查询的列数。",
            "```bash",
            "grep -iE 'UNION\\s+SELECT\\s+(1,2,3|1,2,3,4|1,2,3,4,5)' access.log",
            "```",
        ]),
        ("SQLMap实战检测——从日志到流量", [
            "以下是一套完整的SQLMap检测流程：",
            "",
            "**步骤1：定位可疑IP**",
            "```bash",
            "# 找出30分钟内请求量异常高的IP",
            "awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10",
            "# 筛选出对同一URL发起了>50次请求的IP",
            "awk '{print $1, $7}' access.log | sort | uniq -c | sort -rn | awk '$1>50'",
            "```",
            "",
            "**步骤2：分析该IP的请求模式**",
            "```bash",
            "grep 'SUSPECT_IP' access.log | awk -F'\"' '{print $2}' | head -30",
            "# 如果输出中出现系统性的参数变化（id=1, id=1', id=1\", id=1 AND 1=1, ...）",
            "# → 几乎可以确定是SQLMap",
            "```",
            "",
            "**步骤3：检查payload类型分布**",
            "```bash",
            "# 统计SQLMap特征关键词的出现次数",
            "grep -c 'information_schema' access.log",
            "grep -cE '(sleep\\(|benchmark\\()' access.log",
            "grep -c 'UNION SELECT' access.log",
            "# 如果三种特征同时出现 → SQLMap确认",
            "```",
            "",
            "**步骤4：判定自动化程度**",
            "- 请求间隔规律 + 参数变化系统化 + 多种注入技术尝试 = SQLMap（99%确定）",
            "- 请求间隔不规律 + 参数变化有限 = 手工注入或半自动化",
        ]),
        ("蓝队应对SQLMap攻击的SOP", [
            "当确认正在遭受SQLMap攻击时，按以下SOP处理：",
            "",
            "**即时响应（5分钟内）**：",
            "1. 在WAF/防火墙上永久封禁攻击源IP",
            "2. 检查SQLMap是否已经获得任何数据（查看HTTP响应体大小异常的请求）",
            "3. 如果是POST注入 → 检查攻击目标接口是否已被注入成功",
            "",
            "**深度排查（30分钟内）**：",
            "1. 提取该IP的全部请求记录 → 分析SQLMap的注入测试到了哪一步（信息收集/拖表/写文件/OS Shell）",
            "2. 如果SQLMap执行了`--os-shell` → 立即启动应急响应流程（检查服务器是否已被控制）",
            "3. 如果SQLMap执行了`--dump` → 评估数据泄露范围",
            "",
            "**长期改进**：",
            "1. 推动开发团队修复注入漏洞（参数化查询）",
            "2. 优化WAF规则（增加对SQLMap特征流量的检测）",
            "3. 在SIEM中建立SQLMap检测告警规则",
        ]),
        ("SQLMap vs 手工注入——如何区分", [
            "蓝队需要能快速判断攻击是来自自动化工具（SQLMap）还是手工注入——两者的威胁级别和应对策略不同：",
            "",
            "| 维度 | SQLMap自动化 | 手工注入 |",
            "| --- | --- | --- |",
            "| 请求频率 | 高（可数十次/秒） | 低（几秒到几分钟一次） |",
            "| 参数变化 | 系统性（20-30+种变体） | 有限（5-10种变体） |",
            "| 间隔规律 | 规律（可配置delay） | 不规律 |",
            "| 技术覆盖 | 同时尝试多种注入技术 | 通常1-2种 |",
            "| 探测系统性 | 逐级深入（探测→信息收集→dump） | 可能跳级 |",
            "| 威胁级别 | 中高（自动化扫描可能有破坏性） | 极高（手工攻击意味定向攻击） |",
            "",
            "> 关键原则：自动化工具 = 广撒网（\"试一下这个网站有没有漏洞\"），手工注入 = 定向攻击（\"我就是要搞这个网站\"）。手工攻击的威胁通常更大，因为攻击者更有经验且目标明确。",
        ]),
    ]),
]

D34_TASKS = [
    "在Kali Linux中安装SQLMap → 启动DVWA靶场 → 用SQLMap对DVWA的SQL注入关卡执行一次完整扫描 → 同时用Wireshark抓包",
    "分析抓取的pcap文件——逐条对比SQLMap的HTTP请求 → 总结SQLMap的7个流量特征",
    "用grep/awk编写一个SQLMap检测脚本——输入access.log → 输出是否检测到SQLMap活动",
    "修改SQLMap的User-Agent和delay参数（--user-agent --delay）→ 观察流量特征的变化",
    "对比SQLMap的3种注入技术（--technique=B/U/T）的流量特征差异 → 记录每种技术的识别要点",
]
D34_CHECKLIST = [
    "能说出SQLMap的7个流量识别特征",
    "能从日志/流量中区分SQLMap自动化攻击和手工注入",
    "能在Wireshark中还原SQLMap的攻击过程",
    "能编写简单的SQLMap检测脚本",
    "理解SQLMap自动化攻击与手工攻击的威胁级别差异",
]
D34_INTERVIEW = [
    ("SQLMap的7个流量特征是什么？", "①系统性的参数变化（20-30+种payload变体）；②时间盲注探测（sleep/benchmark）；③User-Agent标识（默认包含sqlmap）；④INFORMATION_SCHEMA查询（表结构枚举）；⑤大量布尔表达式探测（AND 1=1/1=2）；⑥规律性的请求间隔；⑦UNION SELECT字段数系统性探测。综合分析这7个特征可以准确识别SQLMap。"),
    ("SQLMap扫描和手工注入在威胁级别上有什么区别？", "SQLMap通常是自动化扫描工具的\"广撒网\"——攻击者批量扫描大量网站，测试是否存在SQL注入漏洞，威胁中等。手工注入意味攻击者已经在针对你的特定系统进行定向攻击——攻击者往往是更有经验的黑客，威胁更高。但两者都需要严肃对待——SQLMap扫描如果成功了，结果和手工注入一样严重。"),
    ("在Wireshark中怎么识别SQLMap？", "①过滤HTTP请求：`http.request`；②查看请求URI：`http.request.uri`——如果同一URI的参数值出现系统性的变化（单引号→AND 1=1→UNION SELECT→INFORMATION_SCHEMA），那就是SQLMap；③查看请求频率——SQLMap的请求之间间隔通常在1-5秒（或自定义delay），有规律性。"),
]
D34_CASE = [
    "**案例：一次SQLMap自动化扫描的完整分析**",
    "",
    "某蓝队在护网期间发现一个境外IP在15分钟内对产品搜索接口发送了350+次请求。以下是分析过程和结论：",
    "",
    "**分析步骤**：",
    "1. grep该IP的访问日志 → 发现参数变化超过30种 → 自动化工具特征（手工不可能这么系统化）",
    "2. 发现slep(5)和benchmark调用 → 时间盲注探测 → SQLMap标准行为",
    "3. 发现INFORMATION_SCHEMA查询 → 表结构枚举 → SQLMap已完成初步信息收集",
    "4. 发现UNION SELECT 1,2,3,4,5... 的递增探测 → SQLMap在枚举列数",
    "5. **关键发现**：某一请求的HTTP响应体从正常3KB暴增到80KB → SQLMap成功dump了数据！",
    "",
    "**处置**：立即封禁IP → 启动应急响应 → 检查被攻击接口 → 确认SQL注入漏洞存在 → 修复（参数化查询） → 升级为P1安全事件 → 通知相关方。",
    "",
    "**经验教训**：如果蓝队能在SQLMap刚开始信息收集阶段（前5分钟）就识别并阻断，就不会有后续的数据泄露。\"早发现、早阻断\"是蓝队最核心的价值。",
]
D34_SUMMARY = "今天学习了SQLMap自动化SQL注入工具的识别方法。核心能力：通过7个流量特征（系统性参数变化/时间盲注/布尔探测/INFORMATION_SCHEMA查询/UA标识/规律间隔/UNION字段枚举）准确识别SQLMap流量。记住——早发现、早阻断，不要让自动化扫描演变成数据泄露。"

# ============================================================
# Day 35: OpenVAS
# ============================================================
D35_TOPICS = [
    ("OpenVAS漏洞扫描器——Nessus的开源替代方案", [
        ("什么是OpenVAS——开源漏洞管理平台", [
            "OpenVAS（Open Vulnerability Assessment System）是Greenbone Networks开发的开源漏洞扫描器，是Nessus的最强开源替代品。它维护着超过50,000条网络漏洞测试（NVT），支持CVE/BID等漏洞编号体系。",
            "对于蓝队来说，OpenVAS是实现\"知己\"（知道自己的资产有哪些漏洞）的核心工具。",
            "**OpenVAS vs Nessus**：",
            "| 维度 | OpenVAS | Nessus |",
            "| --- | --- | --- |",
            "| 许可证 | 开源免费（GPL） | 商业（免费版限16个IP） |",
            "| 漏洞库 | 50,000+ NVT | 100,000+ plugins |",
            "| 更新频率 | 每日更新 | 每日更新 |",
            "| 管理界面 | Greenbone Security Assistant (Web) | Nessus Web界面 |",
            "| 报告格式 | PDF/HTML/XML/CSV | PDF/HTML/CSV/Nessus DB |",
            "| 扫描模式 | 全扫描/快速扫描/定制扫描 | 类似 |",
            "| 适合场景 | 中小企业/学习/护网自查 | 企业级/合规审计 |",
        ]),
        ("OpenVAS架构与安装部署", [
            "**OpenVAS的四大核心组件**：",
            "1. **OpenVAS Scanner**：核心扫描引擎，执行实际的漏洞测试（NVT）",
            "2. **OpenVAS Manager**：管理扫描任务、存储结果、生成报告",
            "3. **Greenbone Security Assistant（GSA）**：Web管理界面，用户通过浏览器操作",
            "4. **OpenVAS CLI**：命令行接口，用于脚本化和自动化",
            "",
            "**快速安装（Kali Linux）**：",
            "```bash",
            "# Kali中OpenVAS预装但需要初始化",
            "sudo apt update",
            "sudo apt install openvas -y",
            "sudo gvm-setup  # 初始化+下载漏洞库（首次需要较长时间，约30分钟）",
            "sudo gvm-start  # 启动OpenVAS",
            "# 访问 https://127.0.0.1:9392 进入Web管理界面",
            "```",
            "",
            "**Docker安装（推荐用于快速测试）**：",
            "```bash",
            "docker run -d -p 443:443 --name openvas mikesplain/openvas",
            "# 访问 https://localhost",
            "# 默认账号：admin / admin",
            "```",
            "",
            "**注意**：OpenVAS首次启动需要下载漏洞库（NVT feed），包含5万+条测试，大小约1-2GB，需要稳定的网络环境。建议在网络条件好的时段执行初始化。",
        ]),
        ("OpenVAS扫描配置与实战", [
            "**创建一次完整的漏洞扫描任务**：",
            "",
            "**Step 1：创建扫描目标**",
            "- GSA界面 → Configuration → Targets → New Target",
            "- 输入目标名称 + 目标IP/域名（支持单个IP、IP段、域名）",
            "- 选择端口列表（建议\"All IANA assigned TCP and UDP\"，全面扫描）",
            "",
            "**Step 2：创建扫描任务**",
            "- Scans → Tasks → New Task",
            "- 选择扫描目标（上一步创建的） + 扫描配置（Full and fast / Full and deep）",
            "- Full and fast：全面但较快（推荐日常使用）",
            "- Full and deep：深度扫描（耗时长，适合护网前全面自查）",
            "",
            "**Step 3：执行扫描并等待结果**",
            "- 点击Start → 观察扫描进度",
            "- 单个IP的完整扫描通常需要10-30分钟",
            "- 一片/24网段的扫描可能需要数小时",
            "",
            "**Step 4：分析扫描结果**",
            "- 扫描完成后 → 查看Report",
            "- 结果按严重等级分级：Critical（10.0）> High（7.0-9.9）> Medium（4.0-6.9）> Low（0.1-3.9）",
            "- 每个漏洞包含：CVE编号、CVSS评分、漏洞描述、修复建议、参考链接",
        ]),
        ("蓝队使用OpenVAS的最佳实践", [
            "**护网前必做的OpenVAS行动清单**：",
            "",
            "1. **全量资产扫描**：对所有面向互联网和内网核心的IP做一次完整的OpenVAS扫描",
            "2. **优先级排序**：将所有Critical和High漏洞按CVSS评分排序 → Top10优先修复",
            "3. **验证真实性**：OpenVAS有误报的可能 → 对每一个Critical/High漏洞做人工验证确认",
            "4. **修复后复扫**：每修完一批漏洞 → 重新扫描验证修复效果",
            "5. **建立扫描周期**：护网期间建议每周全量扫描一次，日常建议每月一次",
            "",
            "**扫描注意事项**：",
            "- 首次扫描前通知相关业务方（避免扫描被当作攻击触发告警）",
            "- 避免在业务高峰期扫描（扫描会消耗目标服务器资源）",
            "- 对生产环境的扫描使用温和模式（降低扫描并发数和速度）",
            "- 扫描结果包含敏感信息（你的漏洞清单）→ 妥善保管，不要外泄",
            "",
            "**OpenVAS + 其他工具的组合使用**：",
            "- OpenVAS做通用漏洞扫描 → Nmap做端口服务发现 → Nikto做Web专项扫描 → 三者互补",
            "- 将OpenVAS结果导入ELK → 可视化和趋势分析",
            "- 将OpenVAS结果与ATT&CK做映射 → 了解每个漏洞对应哪些攻击技术",
        ]),
        ("从漏洞扫描到漏洞管理", [
            "漏洞扫描只是第一步，从\"扫描\"到\"管理\"才是蓝队的核心价值：",
            "",
            "**漏洞管理的PDCA循环**：",
            "```",
            "Plan（计划）→ 确定扫描范围/频率 → 制定修复优先级",
            "   ↓",
            "Do（执行）→ 执行OpenVAS扫描 → 分析结果",
            "   ↓",
            "Check（检查）→ 验证修复效果 → 复扫确认",
            "   ↓",
            "Act（改进）→ 优化扫描配置 → 更新修复流程",
            "```",
            "",
            "**漏洞管理KPI（衡量你的工作效果）**：",
            "- 高危漏洞平均修复时间（MTTR）：从发现到修复的小时数",
            "- 漏洞复发率：同一漏洞修复后再次出现的比例",
            "- 扫描覆盖率：已扫描资产/总资产 × 100%",
            "- 漏洞趋势：每月高危漏洞数量的变化曲线",
        ]),
    ]),
]
D35_TASKS = [
    "在虚拟机中安装OpenVAS（Kali或Docker方式）→ 完成初始化 → 访问GSA Web界面",
    "对DVWA靶场或本地虚拟机执行一次完整的漏洞扫描 → 分析扫描报告中的每个漏洞",
    "将OpenVAS的Critical/High漏洞按CVSS评分排序 → 输出Top10修复优先级清单",
    "用Nmap对同一目标做端口扫描 → 对比OpenVAS和Nmap的结果差异",
    "编写一份《漏洞扫描标准作业程序》文档——包含扫描配置/频率/报告解读/修复流程",
]
D35_CHECKLIST = [
    "能独立完成OpenVAS的安装和初始化",
    "能创建和执行一次完整的漏洞扫描任务",
    "能读懂OpenVAS扫描报告并理解CVSS评分含义",
    "能区分OpenVAS扫描、Nmap扫描的适用场景",
    "能制定合理的漏洞修复优先级策略",
]
D35_INTERVIEW = [
    ("OpenVAS和Nessus区别在哪？蓝队应该用哪个？", "OpenVAS是开源免费的，Nessus是商业产品（免费版限制16个IP）。功能上Nessus的漏洞库更大、更新更及时、扫描速度更快。对于学习和小规模护网自查，OpenVAS完全够用。对于企业级环境，预算允许的话Nessus专业版更好。但关键是\"先有扫描能力\"——用OpenVAS先做起来比等着审批购买Nessus更重要。"),
    ("OpenVAS扫描出100个高危漏洞，你该怎么处理？", "不是所有漏洞都同等重要。①先按CVSS排序 → 10.0和9.8的先修；②区分内外网 → 暴露在互联网的漏洞优先修复；③结合资产重要性 → 核心业务系统的漏洞优先；④验证真实性 → 排除误报；⑤评估可利用性 → 是否有公开的exploit？利用条件是否满足？最后输出一份带优先级的修复清单，分发给对应的运维/开发团队。"),
]
D35_CASE = [
    "**案例：护网前漏洞扫描发现的关键风险**",
    "",
    "某企业蓝队在护网演习前一个月，用OpenVAS对所有外网资产做了一次全量扫描。扫描发现了83个漏洞，其中3个Critical级漏洞引起了蓝队的重点关注：",
    "",
    "1. SSH弱口令（CVSS 9.8）——一台Web服务器的SSH使用了admin/admin的弱密码",
    "2. Apache Struts2 RCE（CVSS 10.0）——一个老旧的管理后台还在使用存在CVE-2017-5638漏洞的Struts2版本",
    "3. MySQL未授权访问（CVSS 9.8）——一台数据库服务器的3306端口对公网开放且无需密码",
    "",
    "这三个漏洞中的任何一个都足以让攻击者在护网演习中轻松得分。蓝队立即推动修复：修改SSH密码+部署密钥认证 → 升级Struts2框架 → 关闭MySQL公网访问+添加密码。",
    "",
    "如果没有这次扫描，这些漏洞可能已经在不知不觉中存在了数年。\"你无法保护你不知道的漏洞。\"先知道，才能保护。",
]
D35_SUMMARY = "今天学习了OpenVAS漏洞扫描器的部署和使用。核心收获：①OpenVAS是Nessus的最佳开源替代品，适合蓝队护网前资产自查；②漏洞扫描的关键是\"扫出来之后做什么\"——修复优先级排序+真实性验证+复扫确认；③漏洞管理不是一次性工作，而是PDCA循环。记住那句话——\"你无法保护你不知道的漏洞。\""

# ============================================================
# MAIN
# ============================================================
if __name__ == '__main__':
    days_data = [
        (33, 'BurpSuite基础使用——蓝队视角理解攻击流量', '⭐⭐⭐ 中等', D33_TOPICS, D33_TASKS, D33_CHECKLIST, D33_INTERVIEW, D33_CASE, D33_SUMMARY),
        (34, 'SQLMap基础使用——蓝队视角识别自动化注入', '⭐⭐⭐ 中等', D34_TOPICS, D34_TASKS, D34_CHECKLIST, D34_INTERVIEW, D34_CASE, D34_SUMMARY),
        (35, 'OpenVAS漏洞扫描器——部署与实战使用', '⭐⭐⭐ 中等', D35_TOPICS, D35_TASKS, D35_CHECKLIST, D35_INTERVIEW, D35_CASE, D35_SUMMARY),
    ]
    
    for day, title, diff, topics, tasks, checklist, interview, case, summary in days_data:
        lines = expand_day(day, title, diff, topics, tasks, checklist, interview, case, summary)
        lc = write_md(day, lines)
        print(f'Day {day:3d}: {lc:4d} lines - {title[:40]}')
    
    print('\nBatch 33-35 complete!')
