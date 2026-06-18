# -*- coding: utf-8 -*-
"""Smart expander: compact per-day data -> 500+ line rich markdown files."""
import os
OUT = os.path.dirname(os.path.abspath(__file__))

def phase(d):
    if d <= 60: return ('第一阶段','第一阶段 · 初级蓝队夯实')
    elif d <= 90: return ('第二阶段','第二阶段 · 中级蓝队进阶')
    return ('第三阶段','第三阶段 · 高级蓝队升华')

H = lambda h,r: '\n'.join(['| '+' | '.join(h)+' |','|'+'|'.join([':---']*len(h))+'|'] + 
    ['| '+' | '.join(str(c) for c in row)+' |' for row in r])

# ---- Core expander ----
def expand_day(day, meta, sections_raw):
    """meta=(title,diff,goals,intro_metaphor)
       sections_raw = list of (sec_title, [paragraphs], [(table_h,table_rows)], codes, metaphor_text)
       Each paragraph/task/checklist etc expanded generously.""" 
    title, diff, goals, intro = meta
    ph, phs = phase(day)
    
    out = []
    out.append('---')
    out.append(f'day: {day}')
    out.append(f'title: {title}')
    out.append(f'phase: {ph}')
    out.append(f'difficulty: {diff}')
    out.append('---')
    out.append('')
    out.append(f'# Day {day}：{title}')
    out.append('')
    out.append(f'> **阶段**：{phs} | **难度**：{diff} | **预计课时**：2-3小时')
    out.append('')
    out.append('---')
    out.append('')
    out.append('## 📋 今日学习目标')
    out.append('')
    for g in goals:
        out.append(f'{goals.index(g)+1}. {g}')
    out.append('')
    out.append('---')
    out.append('')
    out.append('## 📖 核心知识讲解')
    out.append('')
    if intro:
        out.append(intro)
        out.append('')
    
    for i, sec in enumerate(sections_raw):
        sec_title = sec[0]
        paragraphs = sec[1] if len(sec) > 1 else []
        tables = sec[2] if len(sec) > 2 else []
        codes = sec[3] if len(sec) > 3 else []
        metaphor = sec[4] if len(sec) > 4 else ''
        
        cn = ['零','一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五']
        n = cn[i+1] if i+1 < len(cn) else str(i+1)
        out.append(f'### {n}、{sec_title}')
        out.append('')
        
        for p in paragraphs:
            # p can be: "text" or ("type", "content") 
            if isinstance(p, tuple):
                ptype, ptext = p
                if ptype == 'quote':
                    out.append(f'> {ptext}')
                elif ptype == 'bold':
                    out.append(f'**{ptext}**')
                elif ptype == 'tip':
                    out.append(f'> 💡 **小贴士**：{ptext}')
                elif ptype == 'warn':
                    out.append(f'> ⚠️ **注意**：{ptext}')
                elif ptype == 'key':
                    out.append(f'> 🔑 **重点**：{ptext}')
                else:
                    out.append(ptext)
            else:
                out.append(p)
            out.append('')
        
        for th, tr in tables:
            out.append(H(th, tr))
            out.append('')
        
        for c in codes:
            out.append('```')
            for cl in c.split('\n'):
                out.append(cl)
            out.append('```')
            out.append('')
        
        if metaphor:
            if isinstance(metaphor, tuple) and len(metaphor) == 2:
                mtype, mtext = metaphor
                if mtype == 'key': out.append(f'> 🔑 **重点**：{mtext}')
                elif mtype == 'warn': out.append(f'> ⚠️ **注意**：{mtext}')
                elif mtype == 'tip': out.append(f'> 💡 **小贴士**：{mtext}')
                else: out.append(f'> 🧠 **打个比方**：{mtext}')
            else:
                out.append(f'> 🧠 **打个比方**：{metaphor}')
            out.append('')
    
    return out

def add_tasks_tail(out, tasks, checklist, summary, reading):
    out.append('---')
    out.append('')
    out.append('## 🔧 实操任务')
    out.append('')
    for i,t in enumerate(tasks,1): out.append(f'{i}. {t}')
    out.append('')
    out.append('---')
    out.append('')
    out.append('## ✅ 验收标准')
    out.append('')
    for t in checklist: out.append(f'- [ ] {t}')
    out.append('')
    out.append('---')
    out.append('')
    out.append('## 📝 今日小结')
    out.append('')
    out.append(summary)
    out.append('')
    out.append('---')
    out.append('')
    out.append('## 📚 延伸阅读')
    out.append('')
    for r in reading: out.append(f'- {r}')
    return out

def write_file(day, lines):
    fname = os.path.join(OUT, f'day-{day}.md')
    with open(fname, 'w', encoding='utf-8') as f:
        for line in lines:
            f.write(line + '\n')
    return len(lines)

# ============ DAY 29: ATT&CK + Kill Chain ============
D29S = [  # sections_raw format
('ATT&CK矩阵是什么——一张表看懂黑客的所有招式', [
    'ATT&CK（Adversarial Tactics, Techniques, and Common Knowledge）由美国MITRE公司维护，是全球网络安全领域最权威的攻击行为知识库。它把成百上千种已知攻击手法整理成一个矩阵结构：每一列是一个"战术目标"（Tactics），每一列下面是实现该目标的具体"技术"（Techniques）。',
    ('key','ATT&CK有14个战术（企业版），每个战术下有几十到上百个具体技术。总计超过500个技术条目。你不需要全部记住——但你需要知道怎么查。'),
    'ATT&CK矩阵就像一个"字典"——当你不知道攻击者用的是什么手法时，来这里查。当你想知道某类攻击的检测方法时，来这里找对应的Mitigations和Detections。',
], [
    (['概念','英文','含义','打个比方','蓝队接头暗号'],[
        ['战术(Tactics)','Tactical Goal','攻击者想达成的"阶段性目标"','"我要混进办公区"','看到TA编号（如TA0001）'],
        ['技术(Techniques)','Technique','实现战术的"具体方法"','"跟在前台后面蹭进去"或"借别人工卡刷"','看到T编号（如T1190）'],
        ['子技术','Sub-technique','技术的"细化变种和特化版本"','"趁前台去厕所时蹭进去"','看到T编号.001（如T1190.001）'],
    ]),
    (['#','战术','编号','攻击者想干什么','蓝队应该怎么检测'],[
        ['1','初始访问','TA0001','从外部进入内部网络','WAF/防火墙/邮件网关'],
        ['2','执行','TA0002','让恶意代码跑起来','EDR进程监控/脚本拦截'],
        ['3','持久化','TA0003','系统重启后还能回来','启动项/计划任务/服务监控'],
        ['4','提权','TA0004','从普通用户变成管理员','权限变更审计'],
        ['5','防御绕过','TA0005','关闭杀软/清日志/混淆代码','EDR自身保护/完整性监控'],
        ['6','凭据访问','TA0006','偷密码/Hash/Token','LSASS访问监控/异常登录检测'],
        ['7','发现','TA0007','了解内网环境','异常扫描/info收集检测'],
        ['8','横向移动','TA0008','从一台机器跳到另一台','内网流量监控/异常RDP/SSH'],
        ['9','收集','TA0009','搜刮敏感数据','DLP/文件访问审计'],
        ['10','C2通信','TA0011','与攻击者保持远程联系','DNS/HTTP异常外连检测'],
        ['11','数据渗出','TA0010','把偷到的数据传出去','外传流量基线/加密流量分析'],
    ]),
], [], 'ATT&CK就像一本"敌军战术手册"——列出了所有已知的"敌人的打法"。你不需要背完整本书，但你必须知道怎么查、怎么用。'),

('Kill Chain——攻击的7个环节，每个都是你的拦截机会', [
    '杀伤链（Cyber Kill Chain）由Lockheed Martin公司提出，把一次完整的网络攻击拆解为7个环环相扣的步骤。攻击者必须走完全部7步才算"成功"，而你只需要在任意一步拦截成功——攻击就中断了。',
    '这是一个非常乐观的防御模型——它的核心思想是"只要有一环断了，整个攻击就失败"。虽然现实中韧性更强的攻击者会尝试多条路径，但这个模型仍然是规划防御策略的最佳起点。',
], [
    (['步骤','名称','攻击者动作','蓝队检测/防御','如果此步被拦截...'],[
        ['1','侦察(Recon)','收集IP/域名/邮箱/技术栈信息','扫描监控、服务器信息隐藏','攻击者连目标长啥样都不知道'],
        ['2','武器化(Weaponize)','制作恶意文档/payload/exploit','威胁情报提前获知恶意Hash','武器没造出来/造出来就被标记'],
        ['3','投递(Delivery)','钓鱼邮件/水坑攻击/USB投递','邮件网关/Web过滤/安全意识','武器送到了但没人打开'],
        ['4','利用(Exploit)','触发漏洞执行代码','IPS/WAF/EDR检测Exploit','漏洞被触发但代码没执行'],
        ['5','安装(Install)','安装后门/持久化','EDR/HIPS拦截安装行为','后门装不上'],
        ['6','C2通信(C2)','建立远程控制通道','DNS/流量分析/IP黑名单','后门装了但连不上控制端'],
        ['7','行动(Act)','窃取数据/破坏/勒索','DLP/异常流量/蜜罐','折腾一圈什么都没偷到'],
    ]),
], [], 'Kill Chain就像拆弹——一共有7根线，剪断任意一根就能阻止爆炸。而且剪得越早越安全——如果你在第1步（侦察）就发现并阻止，后面6步根本不会发生。'),

('ATT&CK + Kill Chain 结合——蓝队的"攻防对照表"', [
    '把Kill Chain的每个阶段映射到ATT&CK的对应战术，你就得到了完整的"攻防对照表"——知道攻击者在每个阶段会用什么方法，你就知道你需要在每个阶段部署什么检测和防御手段。',
    ('key','这就是蓝队做"防御能力评估"的核心方法。'),
], [
    (['Kill Chain阶段','ATT&CK战术','攻击者技术举例','蓝队应对'], [
        ['侦察','TA0043','端口扫描、OSINT、DNS枚举','防火墙/IDS监控扫描、Google Hacking防范'],
        ['武器化','(攻击者侧)','制作钓鱼页面、恶意宏','威胁情报：提前获知最新恶意文件'],
        ['投递','TA0001','钓鱼邮件、漏洞利用、弱口令','WAF/邮件网关/安全意识培训/复杂度策略'],
        ['利用','TA0002','执行PowerShell/Shellcode','EDR行为检测/AppLocker/脚本日志'],
        ['安装','TA0003/TA0005','创建计划任务/注册表Run/服务','HIPS/EDR/启动项变更告警'],
        ['C2','TA0011','HTTP/DNS/ICMP隧道回连','防火墙出站策略/NGFW/DNS安全'],
        ['行动','TA0009/TA0010','大规模数据读取、加密文件','DLP/异常流量基线/文件完整性监控'],
    ]),
], [], ''),

('蓝队防御能力评估实战——ATT&CK覆盖度分析', [
    '这是蓝队最高频的实战技能。面试时如果你能说清楚"用ATT&CK做过覆盖度分析"，面试官会对你的体系化思维印象深刻。',
    '**评估步骤：**',
    '1. 列出你现有的所有安全检测/防御手段（WAF/IDS/EDR/SIEM规则等）',
    '2. 逐条对照ATT&CK的14个战术，标记你的覆盖情况',
    '3. 对每个战术打分：5=多层全覆盖，3=有覆盖但薄弱，1=几乎没有',
    '4. 优先资源投入给评分最低的战术——那些就是你防御体系的"软肋"',
    '5. 定期（每季度/每次护网后）重新评估——攻击者在进化，你的防御也要进化',
    '',
    '**示例评估表：**',
], [
    (['ATT&CK战术','当前覆盖','评分','风险等级','改进建议'], [
        ['初始访问','WAF+防火墙+邮件网关','★★★★☆','中','补充DMARC邮件认证'],
        ['执行','EDR+AppLocker','★★★★☆','中','增加脚本日志审计'],
        ['持久化','EDR启动项监控','★★★☆☆','高','部署HIPS，增强注册表监控'],
        ['提权','无专项检测','★★☆☆☆','高','部署漏洞扫描+EDR提权检测规则'],
        ['防御绕过','EDR自身保护','★★★☆☆','中','增加完整性监控'],
        ['横向移动','几乎无覆盖','★☆☆☆☆','🔴极高','部署内网蜜罐+异常RDP/SSH检测'],
        ['C2通信','出站防火墙','★★☆☆☆','🔴极高','部署NTA全流量分析+DNS安全'],
    ]),
], [], ('key','ATT&CK覆盖度评估不是一次性工作——护网前后、重大变更后都需要重新做。这是蓝队"知己知彼"的方法论基础。')),

('最高频ATT&CK技术速查——今天先记住这10个', [
    '不需要一次记住数百个技术，先把这10个最高频的记住：',
], [
    (['T编号','技术名','大白话','为什么重要'], [
        ['T1190','Exploit Public-Facing App','利用公网应用的漏洞','最常见的攻击入口——Log4j/Shiro/Struts2全是这一类'],
        ['T1566.001','Spearphishing Attachment','精准钓鱼（带附件）','95%的APT攻击都是从一封邮件开始的'],
        ['T1059.001','PowerShell','用PowerShell执行命令','攻击者最爱——Windows自带，免杀，功能强大'],
        ['T1078','Valid Accounts','用偷来的合法账号登录','最难检测——和正常登录几乎没区别'],
        ['T1505.003','Web Shell','在Web服务器上留后门','Web攻陷后的标准操作'],
        ['T1110.001','Password Guessing','暴力破解密码','最常见的攻击——防护做好就挡掉99%'],
        ['T1003.001','LSASS Memory Dump','从内存偷Windows密码Hash','拿到Hash=拿到整个域的门票'],
        ['T1021.001','Remote Desktop Protocol','用远程桌面横向移动','内网横移最方便——Windows自带'],
        ['T1041','Exfiltrate Over C2','通过C2通道外传数据','数据泄露的最后一步'],
        ['T1486','Data Encrypted for Impact','勒索软件加密文件','近三年增长最快的攻击类型'],
    ]),
], [], '就像学英语不需要背完整本词典，先背最常用的500个单词。ATT&CK的这10个技术就是你在日常防御中会最频繁遇到的"高频词汇"。'),
]

D29_META = ('ATT&CK框架与Kill Chain模型——蓝队的"敌军战术手册"', '⭐⭐ 基础', [
    '理解ATT&CK框架的矩阵结构和导航方式',
    '掌握Kill Chain的7个攻击阶段及蓝队在每个阶段的检测/防御手段',
    '学会从蓝队视角映射"检测点"到攻击链的每个环节',
    '能说出10个以上ATT&CK技术及其对应的战术',
    '理解如何用ATT&CK做防御能力评估（面试高频题！）',
], '> 🧠 **白话理解**：ATT&CK框架就像一本"敌军战术手册"——列出了黑客从踩点到得手的所有套路（14类战术，500+种具体技术）。Kill Chain则把一次攻击串成一条"流水线"——侦察→武器化→投递→利用→安装→C2→行动，共7个环节。把两者结合，你就知道"攻击者怎么打、我应该在哪个环节设防"——这就是蓝队的核心工作思维。')

D29_TASKS = [
    '打开 https://attack.mitre.org/ → 浏览Enterprise Matrix → 任选3个技术，点进去看它们的Detection和Mitigation',
    '打开 https://mitre-attack.github.io/attack-navigator/ → 尝试创建一张空白的防御热力图',
    '用Kill Chain的7个阶段分析一次你听说过的真实攻击事件（如某公司数据泄露），写出每个阶段可能发生的事',
    '搜索"ATT&CK 防御覆盖度评估"找一篇分析文章，理解工业界怎么做这件事',
    '将Day 19-20学到的攻击类型（端口扫描/SQL注入/XSS等）对应到ATT&CK的技术编号',
]
D29_CHECKLIST = [
    '能说清楚ATT&CK的战术(Tactics)和技术(Techniques)的区别',
    '能说出Kill Chain的7个阶段及每个阶段的蓝队防御手段',
    '能找到ATT&CK矩阵中任意5个战术及其中的代表技术',
    '能用ATT&CK做一次"模拟防御覆盖度评估"（列出你的检测手段覆盖了哪些战术）',
    '理解"攻击越早拦截越好"的纵深防御思想，能举例说明',
]
D29_SUMMARY = '今天打开了蓝队"知识框架"的大门。ATT&CK = 所有已知攻击技术的百科全书（14个战术，500+种技术）；Kill Chain = 攻击的7阶段流水线。两者结合 = 蓝队评估防御能力的方法论基础。你今天不需要记住所有技术，但必须记住"做防御评估先去ATT&CK查"这个习惯。明天开始学习第一个具体攻击技术——SQL注入的深度原理。'
D29_READING = [
    'ATT&CK官网 → https://attack.mitre.org/',
    'ATT&CK Navigator → https://mitre-attack.github.io/attack-navigator/',
    'MITRE: Getting Started with ATT&CK → 官方入门指南',
    '搜索"ATT&CK 蓝队防御评估" → 找中文文章加深理解',
    'Lockheed Martin: The Cyber Kill Chain → 原始模型论文',
]

# ---- Build Day 29 ----
lines29 = expand_day(29, D29_META, D29S)
lines29 = add_tasks_tail(lines29, D29_TASKS, D29_CHECKLIST, D29_SUMMARY, D29_READING)
lines = write_file(29, lines29)
print(f'Day 29: {lines} lines')
