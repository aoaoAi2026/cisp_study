"""
替换 cyberDefense.ts def-1~def-10 的 quiz(2-5题)、codeExamples、expertNotes 为专属内容
"""
import re, json, os, sys
sys.stdout.reconfigure(encoding='utf-8')

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPATH = os.path.join(BASE, 'src/data/cyberDefense.ts')

def make_quiz(qs):
    """生成quiz JSON字符串(每个题是一个obj)"""
    parts = []
    for q in qs:
        parts.append(json.dumps(q, ensure_ascii=False))
    return ','.join(parts)

def make_code(codes):
    return ','.join(json.dumps(c, ensure_ascii=False) for c in codes)

def make_notes(notes):
    return ','.join(json.dumps(n, ensure_ascii=False) for n in notes)

# ==================== DAY 1-10 专属数据 ====================

QUIZ_TAIL = {  # 每个day的后4道quiz题
    'def-1': [
        {"question":"SOC分析师L1级别主要负责什么？","options":["A. 事件调查与分析","B. 初始告警筛选和分类","C. 威胁狩猎","D. SOC管理"],"correctIndex":1,"explanation":"L1分析师(Tier 1)负责告警的初步筛选、分类和简单事件处理，是SOC的第一道防线。"},
        {"question":"以下哪个不是SOC常用的工具？","options":["A. SIEM","B. MISP","C. GitLab","D. Splunk"],"correctIndex":2,"explanation":"GitLab是代码管理平台，不属于SOC安全运营工具。"},
        {"question":"SOC的7×24小时运营模式主要解决什么问题？","options":["A. 降低成本","B. 全天候安全威胁监控","C. 提高员工满意度","D. 合规要求"],"correctIndex":1,"explanation":"网络攻击随时可能发生，7×24运营确保在任何时间都能及时发现和响应安全威胁。"},
        {"question":"虚拟SOC(Virtual SOC)的特点是什么？","options":["A. 全部自建","B. 完全外包","C. 结合内部和外部资源","D. 不需要人员"],"correctIndex":2,"explanation":"虚拟SOC混合使用内部团队和外部服务商资源，灵活性和成本控制更好。"},
    ],
    'def-2': [
        {"question":"Linux系统中认证日志存储在哪个文件？","options":["A. /var/log/syslog","B. /var/log/auth.log","C. /var/log/messages","D. /var/log/secure"],"correctIndex":1,"explanation":"/var/log/auth.log是Debian/Ubuntu系列Linux的认证日志，记录登录、sudo等认证事件。"},
        {"question":"Syslog的默认端口是多少？","options":["A. 53","B. 161","C. 514","D. 443"],"correctIndex":2,"explanation":"Syslog使用UDP 514端口（TCP 6514用于可靠传输），是日志集中收集的标准协议。"},
        {"question":"Windows Event ID 4625代表什么？","options":["A. 登录成功","B. 登录失败","C. 账户锁定","D. 权限变更"],"correctIndex":1,"explanation":"Event ID 4625表示账户登录失败，是安全分析中排查暴力破解的重要指标。"},
        {"question":"日志集中化的最大好处是什么？","options":["A. 节省存储空间","B. 跨设备关联分析和统一查询","C. 减少日志量","D. 加快网络速度"],"correctIndex":1,"explanation":"日志集中化将分散的设备日志汇聚到统一平台，实现跨设备关联分析，大幅提升威胁发现效率。"},
    ],
    'def-3': [
        {"question":"ELK Stack中Logstash的作用是什么？","options":["A. 数据可视化","B. 日志存储","C. 日志收集与处理","D. 告警通知"],"correctIndex":2,"explanation":"Logstash是数据处理管道，负责从多种来源收集日志、解析转换、输出到Elasticsearch。"},
        {"question":"Kibana主要提供什么功能？","options":["A. 日志存储","B. 数据采集","C. 可视化与仪表板","D. 告警规则引擎"],"correctIndex":2,"explanation":"Kibana是ELK的可视化层，提供仪表板、图表、搜索等功能，帮助分析师直观理解数据。"},
        {"question":"SIEM告警规则配置中，以下哪个做法最合理？","options":["A. 尽可能多配规则","B. 只配高危规则","C. 按场景配置并持续调优","D. 使用默认规则即可"],"correctIndex":2,"explanation":"告警规则需要按实际安全场景设计，并持续根据误报和漏报反馈进行调优。"},
        {"question":"Filebeat与Logstash的区别是什么？","options":["A. 没有区别","B. Filebeat更轻量，Logstash功能更丰富","C. Filebeat只能处理文本","D. Logstash替代Filebeat"],"correctIndex":1,"explanation":"Filebeat是轻量级采集器(资源占用极小)，Logstash功能更强大但资源消耗也更大，通常配合使用。"},
    ],
    'def-4': [
        {"question":"Snort规则中'sid'字段的作用是什么？","options":["A. 指定源IP","B. 规则唯一标识符","C. 指定协议","D. 设置优先级"],"correctIndex":1,"explanation":"sid(Signature ID)是Snort规则的唯一标识符，用于区分不同的检测规则。"},
        {"question":"Suricata相比Snort的主要优势是什么？","options":["A. 免费","B. 多线程支持","C. 更简单","D. 不需要规则"],"correctIndex":1,"explanation":"Suricata原生支持多线程并行处理，在高速网络环境下性能优于传统Snort。"},
        {"question":"IDS部署在网络的哪个位置最合适？","options":["A. 出口路由器外侧","B. 防火墙外侧","C. 核心交换机的镜像端口","D. 终端机器上"],"correctIndex":2,"explanation":"IDS通常部署在核心交换机的SPAN端口位置，可监控流经网络的所有流量而不影响业务。"},
        {"question":"一个IDS告警显示'ET TROJAN Zeus Bot Checkin'，这最可能是什么？","options":["A. 正常流量","B. DDoS攻击","C. 木马通信","D. 扫描行为"],"correctIndex":2,"explanation":"ET规则检测到Zeus木马的C2通信特征，需要立即调查受感染主机。"},
    ],
    'def-5': [
        {"question":"Isolation Forest算法的特点是什么？","options":["A. 需要大量标注数据","B. 隔离异常点而非描述正常点","C. 只能检测已知攻击","D. 实时性差"],"correctIndex":1,"explanation":"Isolation Forest通过随机切割特征空间来隔离异常点，异常点更容易被隔离，适合高维数据异常检测。"},
        {"question":"UEBA中的'UE'代表什么？","options":["A. User Experience","B. User and Entity","C. Unified Endpoint","D. User Encryption"],"correctIndex":1,"explanation":"UEBA=User and Entity Behavior Analytics，分析用户和实体(设备/应用)的行为模式。"},
        {"question":"以下哪个场景最适合用异常检测？","options":["A. 已知病毒签名匹配","B. 检测异常时间的异地登录","C. 端口扫描检测","D. 文件哈希比对"],"correctIndex":1,"explanation":"异常检测擅长发现与正常行为模式偏离的活动，如异常时间、异常地点的登录行为。"},
        {"question":"行为基线建立的挑战是什么？","options":["A. 技术太简单","B. 用户行为会动态变化","C. 不需要数据","D. 规则配置简单"],"correctIndex":1,"explanation":"用户行为不是静态的，会随时间、角色变化而改变，基线需要持续学习和更新。"},
    ],
    'def-6': [
        {"question":"CVSS评分系统中，分数范围是多少？","options":["A. 0-5","B. 0-10","C. 1-100","D. 0-100"],"correctIndex":1,"explanation":"CVSS(通用漏洞评分系统)评分范围0-10，9.0+为紧急，7.0-8.9为高危。"},
        {"question":"以下哪个事件应定为'紧急'级别？","options":["A. 单个用户密码过期","B. 核心数据库被加密勒索","C. 扫描探测","D. 低危漏洞发现"],"correctIndex":1,"explanation":"核心数据库被勒索加密直接威胁业务连续性和数据安全，必须定为紧急级别立即响应。"},
        {"question":"安全事件报告中不需要包含的内容是？","options":["A. 事件时间线","B. 影响范围","C. 员工个人绩效","D. 处置过程"],"correctIndex":2,"explanation":"安全事件报告关注事件本身，不应包含与事件无关的人员绩效信息。"},
        {"question":"事件响应中'Triage'的含义是什么？","options":["A. 修复漏洞","B. 事件分类与优先级排序","C. 系统恢复","D. 漏洞扫描"],"correctIndex":1,"explanation":"Triage(分类)是事件响应的第一步，根据严重程度和影响范围确定处理优先级。"},
    ],
    'def-7': [
        {"question":"PDCERF中'D'代表什么？","options":["A. 准备(Prepare)","B. 检测(Detection)","C. 遏制(Containment)","D. 根除(Eradication)"],"correctIndex":1,"explanation":"PDCERF=Prepare-Detection-Containment-Eradication-Recovery-Follow-up。"},
        {"question":"应急响应中'遏制'阶段最常见的操作是什么？","options":["A. 重装系统","B. 断开网络隔离受感染主机","C. 通知媒体","D. 修复漏洞"],"correctIndex":1,"explanation":"遏制阶段的首要目标是防止威胁扩散，最直接有效的方式是将受感染系统从网络隔离。"},
        {"question":"应急响应中证据保存最重要的原则是什么？","options":["A. 先修复再取证","B. 保持证据完整性(Chain of Custody)","C. 证据可随意修改","D. 只保存日志"],"correctIndex":1,"explanation":"证据保管链(Chain of Custody)确保证据从收集到呈堂的完整性和可追溯性。"},
        {"question":"PDCERF的'Follow-up'阶段主要做什么？","options":["A. 恢复系统","B. 总结复盘与改进","C. 隔离系统","D. 检测威胁"],"correctIndex":1,"explanation":"Follow-up阶段通过复盘找出安全漏洞和响应不足，制定改进措施防止类似事件再次发生。"},
    ],
    'def-8': [
        {"question":"iptables中DROP和REJECT的区别是什么？","options":["A. 完全相同","B. DROP静默丢弃，REJECT返回拒绝消息","C. REJECT丢弃，DROP返回消息","D. DROP比REJECT慢"],"correctIndex":1,"explanation":"DROP静默丢弃包不通知发送方，REJECT会返回ICMP拒绝消息。DROP安全性更高但不便于排错。"},
        {"question":"nftables相比iptables的主要改进是什么？","options":["A. 更快配置","B. 统一的用户空间工具和内核API","C. 更多链","D. 免费开源"],"correctIndex":1,"explanation":"nftables替代iptables/ip6tables/arptables/ebtables，提供统一的框架，减少代码重复。"},
        {"question":"防火墙默认策略设为DROP的好处是什么？","options":["A. 性能最好","B. 默认拒绝，白名单放行","C. 方便调试","D. 允许所有流量"],"correctIndex":1,"explanation":"白名单策略(默认拒绝+按需放行)是安全最佳实践，确保只允许经过批准的流量通过。"},
        {"question":"以下哪个不是防火墙的类型？","options":["A. 包过滤防火墙","B. 状态检测防火墙","C. 应用代理防火墙","D. 负载均衡防火墙"],"correctIndex":3,"explanation":"负载均衡是流量分发技术，不属于防火墙类型。"},
    ],
    'def-9': [
        {"question":"WAF部署在什么位置？","options":["A. 数据库前面","B. Web服务器前面","C. 终端前面","D. 交换机前面"],"correctIndex":1,"explanation":"WAF(Web应用防火墙)部署在Web服务器前面，检查所有HTTP/HTTPS请求，拦截Web层攻击。"},
        {"question":"ModSecurity的SecRule指令中'transform'的作用是什么？","options":["A. 修改请求","B. 对数据进行预处理","C. 转发请求","D. 记录日志"],"correctIndex":1,"explanation":"transform用于对匹配前的数据进行预处理，如小写转换、URL解码等，提高规则匹配准确性。"},
        {"question":"WAF规则产生误报时应该怎么做？","options":["A. 直接删除规则","B. 分析误报原因并添加例外","C. 关闭WAF","D. 忽略不管"],"correctIndex":1,"explanation":"误报应仔细分析原因，通过配置白名单或调整规则来排除正常业务，不能简单删除安全规则。"},
        {"question":"OWASP CRS是什么？","options":["A. 一款WAF产品","B. WAF核心规则集","C. 渗透测试工具","D. 扫描器"],"correctIndex":1,"explanation":"OWASP CRS(Core Rule Set)是ModSecurity的默认规则集，包含大量Web攻击检测规则。"},
    ],
    'def-10': [
        {"question":"WireGuard相比OpenVPN的主要优势是什么？","options":["A. 免费","B. 代码简洁且性能高","C. 更安全","D. 支持更多平台"],"correctIndex":1,"explanation":"WireGuard内核实现仅约4000行代码，相比OpenVPN的10万+行，更易审计且性能更好。"},
        {"question":"零信任架构的核心原则是什么？","options":["A. 信任内网","B. 永不信任，始终验证","C. 边界防护","D. 信任VPN用户"],"correctIndex":1,"explanation":"零信任打破了传统的'内网即安全'假设，对任何人、设备、网络访问都持续验证。"},
        {"question":"DMZ(非军事区)通常部署哪些服务器？","options":["A. 核心数据库","B. Web/邮件/DNS等公共服务","C. 域控制器","D. 备份服务器"],"correctIndex":1,"explanation":"DMZ部署需要对外提供服务的服务器，即使被攻破也不影响内部核心网络。"},
        {"question":"以下哪个不是网络分段的好处？","options":["A. 限制攻击横向移动","B. 提高网络性能","C. 增加攻击面","D. 便于访问控制"],"correctIndex":2,"explanation":"网络分段通过VLAN等方式隔离不同区域，限制攻击者在内网的横向移动能力，减小攻击面。"},
    ],
}

CODES = {
    'def-1': [{"title":"SOC告警模拟系统","language":"python","code":"# SOC告警处理模拟\nimport random, time, datetime\n\nalert_types = ['暴力破解', '恶意软件', '异常登录', '数据泄露', '扫描探测']\nseverities = ['低', '中', '高', '紧急']\n\ndef generate_alert():\n    return {\n        'id': random.randint(10000, 99999),\n        'type': random.choice(alert_types),\n        'severity': random.choice(severities),\n        'time': datetime.datetime.now().isoformat(),\n        'source_ip': f'192.168.{random.randint(1,255)}.{random.randint(1,255)}'\n    }\n\ndef triage(alert):\n    if alert['severity'] in ['紧急', '高']:\n        print(f\"[立即响应] {alert['type']} | {alert['source_ip']}\")\n    else:\n        print(f\"[排队处理] {alert['type']} | {alert['source_ip']}\")\n\nprint('=== SOC告警模拟 ===')\nfor _ in range(5):\n    alert = generate_alert()\n    triage(alert)\n    time.sleep(0.5)\nprint('模拟完成，等待下一轮告警...')","explanation":"模拟SOC告警产生和L1分析师分诊处理流程"}],
    'def-2': [{"title":"Windows日志分析","language":"python","code":"# 模拟Windows安全日志分析\nimport re\n\nlog_entries = [\n    'EventID=4625 Account=admin Source=192.168.1.100',\n    'EventID=4624 Account=user01 Source=192.168.1.50',\n    'EventID=4625 Account=admin Source=10.0.0.5',\n    'EventID=4625 Account=admin Source=192.168.1.100',\n    'EventID=4624 Account=SYSTEM Source=127.0.0.1',\n]\n\ndef analyze_bruteforce(logs, threshold=3):\n    fail_map = {}\n    for log in logs:\n        if '4625' in log:\n            account = re.search(r'Account=(\S+)', log).group(1)\n            source = re.search(r'Source=(\S+)', log).group(1)\n            key = f'{account}@{source}'\n            fail_map[key] = fail_map.get(key, 0) + 1\n    for key, count in fail_map.items():\n        if count >= threshold:\n            print(f'[告警] {key} 登录失败 {count} 次，可能暴力破解!')\n\nprint('=== 日志安全分析 ===')\nanalyze_bruteforce(log_entries)\nprint('分析完成')","explanation":"分析Windows安全日志，检测暴力破解行为"}],
    'def-3': [{"title":"ELK查询DSL生成","language":"python","code":"# Elasticsearch查询DSL构建\nimport json\n\ndef build_search_query(keyword=None, time_range='24h', severity=None):\n    query = {'query': {'bool': {'must': [], 'filter': []}}, 'size': 50}\n    if keyword:\n        query['query']['bool']['must'].append({'match': {'message': keyword}})\n    if severity:\n        query['query']['bool']['filter'].append({'term': {'severity': severity}})\n    query['query']['bool']['filter'].append({\n        'range': {'@timestamp': {'gte': f'now-{time_range}'}}\n    })\n    print(json.dumps(query, indent=2, ensure_ascii=False))\n    return query\n\nprint('=== SIEM查询构建 ===')\nbuild_search_query(keyword='failed login', severity='high')\nprint()\nbuild_search_query(keyword='SQL Injection')","explanation":"构建Elasticsearch查询DSL，模拟SIEM平台搜索功能"}],
    'def-4': [{"title":"Snort规则解析器","language":"python","code":"# Snort规则解析与模拟匹配\nimport re\n\nrules = [\n    'alert tcp any any -> any 80 (msg:\"SQL Injection\"; content:\"union select\"; sid:1000001;)',\n    'alert tcp any any -> any 22 (msg:\"SSH Brute Force\"; threshold:count 5,seconds 60; sid:1000002;)',\n    'alert icmp any any -> any any (msg:\"ICMP Flood\"; dsize:>1000; sid:1000003;)',\n]\n\ndef parse_snort_rule(rule):\n    msg = re.search(r'msg:\"(.+?)\"', rule)\n    sid = re.search(r'sid:(\\d+)', rule)\n    content_match = re.search(r'content:\"(.+?)\"', rule)\n    return {\n        'message': msg.group(1) if msg else 'N/A',\n        'signature_id': sid.group(1) if sid else 'N/A',\n        'content': content_match.group(1) if content_match else None\n    }\n\nprint('=== Snort规则解析 ===')\nfor rule in rules:\n    info = parse_snort_rule(rule)\n    print(f'[SID:{info[\"signature_id\"]}] {info[\"message\"]} -> {info[\"content\"] or \"流量特征\"}')","explanation":"解析Snort IDS规则结构，提取检测逻辑"}],
    'def-5': [{"title":"登录异常检测","language":"python","code":"# 基于统计的异常登录检测\nimport numpy as np\n\nuser_history = [(8,2),(9,5),(10,3),(11,1),(13,2),(14,4),(15,2),(16,3),(17,1)]\n\ndef detect_anomaly(history, new_hour, new_count):\n    hours = [h[0] for h in history]\n    counts = [h[1] for h in history]\n    mean = np.mean(counts)\n    std = np.std(counts)\n    threshold = mean + 3 * std\n    if new_hour not in hours:\n        print(f'[异常] 新登录时间: {new_hour}:00 (历史无此时间段)')\n    if new_count > threshold:\n        print(f'[异常] 频率过高: {new_count} (阈值: {threshold:.1f})')\n    else:\n        print(f'[正常] 频率: {new_count} (阈值: {threshold:.1f})')\n\nprint('=== 异常登录检测 ===')\ndetect_anomaly(user_history, 3, 20)  # 凌晨3点\ndetect_anomaly(user_history, 14, 2)  # 正常","explanation":"使用统计方法检测异常登录行为"}],
    'def-6': [{"title":"安全事件分类系统","language":"python","code":"# 安全事件自动分类与分级\nclass SecurityIncident:\n    def __init__(self, etype, affected_system, impact):\n        self.etype = etype\n        self.affected_system = affected_system\n        self.impact = impact\n    def classify(self):\n        tmap = {'ransomware':('恶意代码','紧急'),'data_breach':('数据泄露','高'),'phishing':('钓鱼','中'),'scanning':('扫描探测','低')}\n        info = tmap.get(self.etype,('未知','待评估'))\n        sla = {'紧急':'15分钟','高':'1小时','中':'4小时','低':'24小时'}\n        print(f'类型: {info[0]} | 严重: {info[1]} | SLA: {sla[info[1]]} | {self.impact}')\n\nprint('=== 事件分类分级 ===')\nfor inc in [SecurityIncident('ransomware','财务系统','全局中断'),SecurityIncident('phishing','邮箱','凭证泄露'),SecurityIncident('scanning','外围IP','无影响')]:\n    inc.classify()","explanation":"安全事件自动分类和SLA分级管理系统"}],
    'def-7': [{"title":"PDCERF流程引擎","language":"python","code":"# PDCERF应急响应流程模拟\nclass IncidentResponse:\n    def __init__(self, name):\n        self.name = name\n        self.timeline = []\n    def execute(self, phase, actions):\n        print(f'[{phase}]')\n        for a in actions:\n            print(f'  ✓ {a}')\n            self.timeline.append((phase, a))\n\nir = IncidentResponse('勒索软件感染')\nir.execute('准备', ['激活响应团队','确认预案'])\nir.execute('检测', ['确认勒索类型','评估影响范围'])\nir.execute('遏制', ['断开感染主机网络','隔离受影响网段'])\nir.execute('根除', ['清除恶意软件','扫描其他主机'])\nir.execute('恢复', ['从备份恢复数据','验证系统完整性'])\nir.execute('总结', ['编写事件报告','复盘改进措施'])\nprint(f'事件完成，共{len(ir.timeline)}步骤')","explanation":"PDCERF六阶段应急响应流程完整模拟"}],
    'def-8': [{"title":"iptables安全配置","language":"bash","code":"# iptables安全基线配置脚本\n# 默认策略\niptables -P INPUT DROP\niptables -P FORWARD DROP\niptables -P OUTPUT ACCEPT\n\n# 允许回环\niptables -A INPUT -i lo -j ACCEPT\n\n# 允许已建立连接\niptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT\n\n# SSH防暴力破解\niptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set\niptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP\n\n# 开放服务\niptables -A INPUT -p tcp --dport 80 -j ACCEPT\niptables -A INPUT -p tcp --dport 443 -j ACCEPT\n\n# 防常见扫描\niptables -A INPUT -p tcp --tcp-flags ALL SYN,FIN -j DROP\niptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP\niptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s -j ACCEPT\n\necho '防火墙规则已配置'","explanation":"iptables防火墙安全基线配置，含SSH防爆破和抗扫描规则"}],
    'def-9': [{"title":"ModSecurity WAF检测","language":"python","code":"# WAF规则模拟检测\nimport re\n\nwaf_rules = [\n    ('SQL注入', r\"(?i)(union\\s+select|1'='1)\"),\n    ('XSS攻击', r\"(?i)(<script|<iframe|javascript:)\"),\n    ('路径遍历', r\"(?i)(\\.\\./|\\.\\.\\\\|%2e%2e)\"),\n    ('命令注入', r\"(?i)(;\\s*(cat|ls|id|whoami))\"),\n]\n\ntests = ['/search?q=hello','/login?user=admin\\' OR \\'1\\'=\\'1','/page?url=../../etc/passwd','/profile?name=<script>alert(1)</script>']\n\nprint('=== WAF安全检测 ===')\nfor req in tests:\n    blocked = False\n    for name, pat in waf_rules:\n        if re.search(pat, req):\n            print(f'[拦截] {name}: {req[:60]}')\n            blocked = True\n            break\n    if not blocked:\n        print(f'[通过] {req}')","explanation":"模拟WAF规则引擎检测Web攻击请求"}],
    'def-10': [{"title":"WireGuard VPN配置","language":"python","code":"# WireGuard VPN配置生成\nserver_config = \"\"\"[Interface]\nAddress = 10.0.0.1/24\nListenPort = 51820\nPrivateKey = <server_private_key>\n\n[Peer]\n# Client: dev-laptop\nPublicKey = <client_public_key>\nAllowedIPs = 10.0.0.2/32\n\"\"\"\n\nclient_config = \"\"\"[Interface]\nAddress = 10.0.0.2/24\nPrivateKey = <client_private_key>\nDNS = 1.1.1.1\n\n[Peer]\nPublicKey = <server_public_key>\nEndpoint = vpn.example.com:51820\nAllowedIPs = 0.0.0.0/0\n\"\"\"\n\nprint('=== WireGuard Server Config ===')\nprint(server_config)\nprint('=== WireGuard Client Config ===')\nprint(client_config)\nprint('提示: 使用 wg-quick up wg0 启动VPN')","explanation":"WireGuard VPN服务端和客户端配置自动生成"}],
}

NOTES = {
    'def-1': [
        {"author":"赵安全","title":"SOC建设实战经验","content":"建设SOC最大的挑战不是技术选型，而是人员和流程。建议先定义好告警处理SOP，再引入SIEM平台。L1/L2/L3分析师要有清晰的分工和升级机制。","url":"https://www.freebuf.com/articles/es/267825.html"},
        {"author":"钱运维","title":"安全运营中的人机结合","content":"SOC不能全靠自动化。虽然有SOAR可以编排响应，但复杂事件的分析和决策仍需经验丰富的分析师。建议人机结合，自动化处理已知威胁，分析师专注未知和复杂威胁。","url":"https://www.anquanke.com/post/id/243567.html"},
        {"author":"孙情报","title":"从零开始搭建SOC","content":"小团队搭建SOC可以从ELK Stack开始，成本低上手快。关键要有：1)日志集中化 2)告警规则 3)值班制度 4)事件处理流程。不要追求大而全，先让监控跑起来再逐步完善。","url":"https://www.sans.org/security-resources/posters/build-a-soc/"},
    ],
    'def-2': [
        {"author":"赵安全","title":"日志管理的三个关键","content":"日志管理要做好三点：全(覆盖所有关键设备)、准(时间同步、格式统一)、快(快速检索)。建议使用NTP统一时间，使用JSON格式结构化日志，方便后续分析。","url":"https://www.freebuf.com/articles/es/234567.html"},
        {"author":"钱运维","title":"Windows事件日志最佳实践","content":"Windows安全分析必须开启的审计策略：登录事件(4624/4625)、账户管理(4720/4726)、特权使用(4672)、进程创建(4688)。建议配合Sysmon获得更详细的进程和网络信息。","url":"https://learn.microsoft.com/zh-cn/windows/security/threat-protection/auditing/"},
        {"author":"孙情报","title":"日志存储成本优化","content":"日志量大的企业面临存储成本压力。建议：1)分级存储(热数据SSD、温数据HDD、冷数据归档) 2)日志压缩 3)按需保留(合规要求+分析需求) 4)定期清理过期日志。","url":"https://www.elastic.co/guide/en/elastic-stack/current/installing-elastic-stack.html"},
    ],
    'def-3': [
        {"author":"赵安全","title":"Elasticsearch安全配置要点","content":"生产环境ELK必须做好安全配置：1)启用X-Pack认证 2)配置节点间TLS 3)角色权限分离 4)定期备份快照。切勿将Kibana直接暴露在公网！","url":"https://www.elastic.co/guide/en/elasticsearch/reference/current/security.html"},
        {"author":"钱运维","title":"SIEM告警规则设计思路","content":"好的告警规则不是越多越好。建议从MITRE ATT&CK框架出发，选择与业务相关的攻击技术设计检测规则。每条规则要有明确的场景描述、优先级定义和响应SOP。","url":"https://www.sans.org/white-papers/36812/"},
        {"author":"孙情报","title":"开源SIEM选型经验","content":"中小企业开源SIEM选型建议：ELK(最灵活，社区活跃)、Wazuh(自带HIDS，开箱即用)、Security Onion(集成度高，适合安全分析)、Graylog(界面友好，运维简单)。","url":"https://www.freebuf.com/articles/es/345672.html"},
    ],
    'def-4': [
        {"author":"赵安全","title":"Snort部署位置策略","content":"Snort部署位置很关键：1)边界入口(监测外部攻击) 2)核心交换机镜像端口(监测内部横向移动) 3)关键服务器前端(重点保护)。建议至少部署在边界和核心交换机两个位置。","url":"https://www.snort.org/documents"},
        {"author":"钱运维","title":"Suricata规则优化心得","content":"默认ET规则集会产生大量告警。优化建议：1)先全量运行一周收集数据 2)分析高频告警，排除业务相关 3)按阈值调整 4)关注高危规则有效性。目标是减少90%误报但保持检出率。","url":"https://suricata.readthedocs.io/"},
        {"author":"孙情报","title":"IDS vs IPS部署选择","content":"IDS(旁路监控)不影响业务但只能检测告警；IPS(串联防护)可以实时阻断但影响性能和可用性。建议先在IDS模式运行，规则稳定后再切换到IPS模式做关键链路的防护。","url":"https://www.anquanke.com/post/id/205467"},
    ],
    'def-5': [
        {"author":"赵安全","title":"UEBA落地经验","content":"UEBA不是万能药。部署前需明确：1)有哪些可用的行为数据 2)能定义什么样的基线 3)偏离多少算异常。建议从登录行为和文件访问行为开始，场景明确效果好。","url":"https://www.gartner.com/en/documents/3988143"},
        {"author":"钱运维","title":"异常检测的误报问题","content":"异常检测最大的挑战是误报。解决思路：1)多个维度交叉验证 2)结合威胁情报 3)有人工反馈机制让模型学习。单维度异常检测误报率太高，多维度交叉能降低90%误报。","url":"https://www.freebuf.com/articles/es/267895.html"},
        {"author":"孙情报","title":"从规则检测到AI检测","content":"传统SIEM依赖规则，但规则只能检测已知攻击。未来趋势是AI+规则：AI负责发现异常模式(未知威胁)，规则负责精准匹配(已知威胁)。两者结合才是最佳方案。","url":"https://www.anquanke.com/post/id/238456"},
    ],
    'def-6': [
        {"author":"赵安全","title":"安全事件分级实践经验","content":"事件分级千万不要拍脑袋。建议基于两个维度：业务影响(核心/非核心)和扩散风险(已扩散/可控)。把分级标准写成checklist，让L1分析师有据可依。","url":"https://www.first.org/cvss/v3.1/user-guide"},
        {"author":"钱运维","title":"事件响应中的沟通管理","content":"重大安全事件中沟通比技术更重要。建议提前准备好：1)内部升级通报模板 2)对外公关口径 3)监管报告模板 4)客户通知模板。等事件发生再想沟通方案就晚了。","url":"https://www.nist.gov/cyberframework"},
        {"author":"孙情报","title":"事件报告怎么写","content":"好的事件报告应该包含：执行摘要(给管理层)、详细时间线(给技术团队)、影响评估、处置过程、根因分析、改进建议。记住：报告不是为了追责，是为了防止再次发生。","url":"https://www.freebuf.com/articles/es/278934.html"},
    ],
    'def-7': [
        {"author":"赵安全","title":"应急团队建设要点","content":"应急响应团队需要：1)明确的角色分工(指挥、技术、沟通、记录) 2)备用联系方式 3)定期演练(至少每季度一次) 4)应急工具箱(提前准备，不要临时找工具)。","url":"https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf"},
        {"author":"钱运维","title":"遏制阶段常见错误","content":"遏制阶段最常见3个错误：1)急于删文件破坏证据 2)直接断网导致攻击者破坏 3)不确定影响范围就操作。应优先保护证据→分析攻击路径→精确遏制。","url":"https://www.freebuf.com/articles/es/275034.html"},
        {"author":"孙情报","title":"桌面演练的价值","content":"从桌面演练开始。召集各方角色，主持人描述攻击场景，团队口头推演每个阶段的响应动作。低成本高效率，能暴露流程中的很多问题，是起步最好的方式。","url":"https://www.anquanke.com/post/id/241356"},
    ],
    'def-8': [
        {"author":"赵安全","title":"iptables容易踩的坑","content":"iptables容易犯的错误：1)远程操作先配DROP把自己踢下线(应先备份) 2)规则顺序影响匹配 3)-A追加导致优先级错误 4)重启后规则丢失(需iptables-persistent)。","url":"https://www.digitalocean.com/community/tutorials/iptables-essentials-common-firewall-rules-and-commands"},
        {"author":"钱运维","title":"企业防火墙架构设计","content":"企业防火墙应该是分层架构：边界防火墙(网络层)→WAF(应用层)→主机防火墙(最后防线)。每一层都有自己的职责，层层设防。不要把所有希望放在边界防火墙上。","url":"https://www.freebuf.com/articles/network/263578.html"},
        {"author":"孙情报","title":"nftables是未来","content":"虽然iptables还在广泛使用，但nftables已成为Linux内核主流防火墙框架。建议新项目直接使用nftables，语法更简洁，性能更好。旧系统可逐步迁移。","url":"https://wiki.nftables.org/wiki-nftables/index.php/Main_Page"},
    ],
    'def-9': [
        {"author":"赵安全","title":"WAF不是银弹","content":"WAF可防御大部分常见Web攻击，但不能完全依赖。攻击者会研究WAF绕过技术。建议WAF+应用层安全编码+定期渗透测试三道防线结合。","url":"https://github.com/SpiderLabs/ModSecurity/wiki"},
        {"author":"钱运维","title":"WAF运维的血泪教训","content":"WAF上线初期3个月内，误报率可能高达30%以上。一定要有专人负责Rule Tuning。建议流程：监控→分析告警→确认误报→添加例外→验证。这个循环要持续进行。","url":"https://www.freebuf.com/articles/web/174468.html"},
        {"author":"孙情报","title":"云WAF vs 本地WAF","content":"云WAF(Cloudflare/AWS)部署简单免运维但灵活性差；本地WAF(ModSecurity)完全可控但运维复杂。建议非核心用云WAF，核心系统用本地+云WAF双重防护。","url":"https://www.anquanke.com/post/id/208576"},
    ],
    'def-10': [
        {"author":"赵安全","title":"WireGuard为什么快","content":"WireGuard比OpenVPN快很多的原因：1)内核级实现 2)极简协议设计 3)使用最新加密算法(ChaCha20) 4)无连接状态管理。如果团队能接受其简单的功能集，强烈推荐。","url":"https://www.wireguard.com/quickstart/"},
        {"author":"钱运维","title":"零信任落地的三个步骤","content":"零信任不是买一个产品就能实现的。分三步走：1)资产和身份盘点 2)实施MFA+设备认证 3)逐步实施微隔离。从小到大，从核心系统到边缘系统。","url":"https://www.nist.gov/publications/zero-trust-architecture"},
        {"author":"孙情报","title":"网络分段的规划建议","content":"网络分段建议至少划分：办公网、生产网、DMZ、测试网、管理网五个区域。区域之间通过防火墙严格限制访问。特别要注意管理网段的安全，这是攻击者最想进入的区域。","url":"https://www.freebuf.com/articles/network/275412.html"},
    ],
}

# ==================== 替换逻辑 ====================

# 通用quiz问题2-5的精确文本(用于匹配替换)
OLD_QUIZ_TAIL = r'\{"question":"信息安全的三个基本要素是什么？","options":\["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"\],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"\},\{"question":"纵深防御的核心原则是什么？","options":\["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一产品"\],"correctIndex":1,"explanation":"纵深防御通过多层安全控制叠加保护系统。"\},\{"question":"安全事件应急响应第一步？","options":\["修复漏洞","通知媒体","隔离受影响系统","重装系统"\],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"\},\{"question":"以下哪项不是SOC的主要职能？","options":\["安全监控","威胁检测","产品研发","事件响应"\],"correctIndex":2,"explanation":"产品研发不属于SOC的安全运营核心职能。"\}'

# 通用codeExamples的匹配模式
OLD_CODE = r'codeExamples:\s*\[{"title":"动手实践","language":"python","code":"# 安全防御实践.*?"explanation":"安全防御配置基线检查代码示例"}\]'

# 通用expertNotes的匹配模式
OLD_NOTES = r'expertNotes:\s*\[{"author":"张伟","title":"安全防御体系建设"[^]]*"url":"https://www.freebuf.com/articles/es/278934.html"}\]'

def replace_day_content(day_id):
    """替换指定day的quiz尾题、codeExamples、expertNotes"""
    with open(FPATH, 'r', encoding='utf-8') as f:
        text = f.read()
    
    modified = False
    
    # 1. 替换quiz问题2-5
    if day_id in QUIZ_TAIL:
        new_quiz_tail = make_quiz(QUIZ_TAIL[day_id])
        day_pattern = rf"(id:\s*'{day_id}'.+?)" + OLD_QUIZ_TAIL
        m = re.search(day_pattern, text, re.DOTALL)
        if m:
            text = text[:m.start()] + m.group(1) + new_quiz_tail + text[m.end():]
            print(f'  {day_id}: quiz ✓', end='')
            modified = True
        else:
            print(f'  {day_id}: quiz ✗(未匹配)', end='')
    
    # 2. 替换codeExamples
    if day_id in CODES:
        day_pattern_code = rf"(id:\s*'{day_id}'.+?)" + OLD_CODE
        m = re.search(day_pattern_code, text, re.DOTALL)
        if m:
            new_code_str = 'codeExamples: [' + make_code(CODES[day_id]) + ']'
            text = text[:m.start()] + m.group(1) + new_code_str + text[m.end():]
            print(' code ✓', end='')
            modified = True
        else:
            print(' code ✗', end='')
    
    # 3. 替换expertNotes
    if day_id in NOTES:
        day_pattern_notes = rf"(id:\s*'{day_id}'.+?)" + OLD_NOTES
        m = re.search(day_pattern_notes, text, re.DOTALL)
        if m:
            new_notes_str = 'expertNotes: [' + make_notes(NOTES[day_id]) + ']'
            text = text[:m.start()] + m.group(1) + new_notes_str + text[m.end():]
            print(' notes ✓')
            modified = True
        else:
            print(' notes ✗')
    
    if modified:
        with open(FPATH, 'w', encoding='utf-8') as f:
            f.write(text)
    
    return modified


if __name__ == '__main__':
    print('=== Defense Part1: 替换 def-1 ~ def-10 专属内容 ===\n')
    for i in range(1, 11):
        day_id = f'def-{i}'
        replace_day_content(day_id)
    print('\n=== Part1 完成 ===')
