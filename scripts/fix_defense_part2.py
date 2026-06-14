"""
替换 cyberDefense.ts def-11~def-20 的 quiz(2-5题)、codeExamples、expertNotes 为专属内容
"""
import re, json, os, sys
sys.stdout.reconfigure(encoding='utf-8')

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPATH = os.path.join(BASE, 'src/data/cyberDefense.ts')

def make_quiz(qs):
    return ','.join(json.dumps(q, ensure_ascii=False) for q in qs)
def make_code(codes):
    return ','.join(json.dumps(c, ensure_ascii=False) for c in codes)
def make_notes(notes):
    return ','.join(json.dumps(n, ensure_ascii=False) for n in notes)

# ==================== DAY 11-20 ====================

QUIZ_TAIL = {
    'def-11': [
        {"question":"IDS调优中最优先处理的是什么类型的告警？","options":["A. 所有告警","B. 高频误报","C. 低危告警","D. 一次性告警"],"correctIndex":1,"explanation":"高频误报会淹没有意义的真实告警(告警疲劳)，应优先处理和优化。"},
        {"question":"Snort规则中'threshold'关键字的作用是什么？","options":["A. 设置优先级","B. 限制告警频率","C. 修改匹配内容","D. 指定协议"],"correctIndex":1,"explanation":"threshold用于控制告警频率，防止短时间内大量相同告警。"},
        {"question":"IDS规则更新周期建议多久一次？","options":["A. 每年一次","B. 每日或每周定期更新","C. 不需要","D. 每季度一次"],"correctIndex":1,"explanation":"新漏洞不断出现，IDS规则建议每天或至少每周更新，保持检测能力。"},
        {"question":"以下哪个指标最能反映IDS的检测质量？","options":["A. 告警总数","B. 误报率和检出率","C. 日志大小","D. CPU使用率"],"correctIndex":1,"explanation":"检测质量核心指标是误报率(FPR)和检出率(TPR/Recall)。"},
    ],
    'def-12': [
        {"question":"SYN Cookie防护的原理是什么？","options":["A. 加大带宽","B. 不立即分配资源，通过Cookie验证","C. 限制连接数","D. 过滤IP"],"correctIndex":1,"explanation":"SYN Cookie在收到SYN时不立即分配TCB资源，而是计算Cookie返回，只有收到正确ACK才建立连接。"},
        {"question":"应用层DDoS攻击(如HTTP Flood)的特点是什么？","options":["A. 消耗带宽","B. 请求看起来正常但量大","C. 数据包畸形","D. 容易识别"],"correctIndex":1,"explanation":"应用层DDoS发送看似正常的HTTP请求，难以通过简单包特征区分，需要行为分析。"},
        {"question":"DDoS清洗中心的工作原理是什么？","options":["A. 直接丢弃所有流量","B. 将流量引流到清洗中心过滤后再回注","C. 增加服务器","D. 限制用户"],"correctIndex":1,"explanation":"清洗中心通过DNS牵引或BGP引流将流量导入，过滤恶意流量后将正常流量回注到源站。"},
        {"question":"CDN在DDoS防护中的主要作用是什么？","options":["A. 加速访问","B. 分散攻击流量","C. 加密数据","D. 存储内容"],"correctIndex":1,"explanation":"CDN通过全球分布的边缘节点分散攻击流量，单一节点承受的攻击被稀释。"},
    ],
    'def-13': [
        {"question":"DNSSEC通过什么机制防止DNS篡改？","options":["A. 加密传输","B. 数字签名","C. IP过滤","D. 端口随机化"],"correctIndex":1,"explanation":"DNSSEC使用非对称加密对DNS记录进行数字签名，客户端可验证响应的完整性和真实性。"},
        {"question":"DNS over HTTPS(DoH)的端口是多少？","options":["A. 53","B. 443","C. 853","D. 80"],"correctIndex":1,"explanation":"DoH将DNS查询封装在HTTPS中，使用443端口，使DNS流量看起来像普通HTTPS流量。"},
        {"question":"DNS隧道攻击的原理是什么？","options":["A. 大量DNS查询耗尽资源","B. 在DNS查询中编码数据穿透防火墙","C. 篡改DNS记录","D. 伪造DNS服务器"],"correctIndex":1,"explanation":"DNS隧道将数据编码在DNS查询/响应中，由于DNS流量通常不被防火墙拦截，可绕过安全策略。"},
        {"question":"以下哪个DNS服务器支持DoH？","options":["A. 1.1.1.1(Cloudflare)","B. 192.168.1.1","C. 10.0.0.1","D. 172.16.0.1"],"correctIndex":0,"explanation":"Cloudflare的1.1.1.1和Google的8.8.8.8都支持DoH加密DNS查询。私有IP不是公共DNS服务。"},
    ],
    'def-14': [
        {"question":"CDN'回源'是指什么？","options":["A. 用户访问CDN","B. CDN向源站请求未缓存内容","C. 数据备份","D. 域名解析"],"correctIndex":1,"explanation":"当CDN边缘节点没有缓存所需内容时，会向源站发起请求获取内容，这个过程称为回源。"},
        {"question":"Anycast在抗DDoS中的优势是什么？","options":["A. 加密传输","B. 攻击流量被分散到最近的节点","C. 更快响应","D. 降低成本"],"correctIndex":1,"explanation":"Anycast让多个节点共用同一IP，流量自动路由到最近的节点，攻击流量被自然分散。"},
        {"question":"CDN中启用HSTS的作用是什么？","options":["A. 加速访问","B. 强制浏览器使用HTTPS","C. 压缩内容","D. 缓存优化"],"correctIndex":1,"explanation":"HSTS强制浏览器只能通过HTTPS访问，防止SSL剥离攻击。"},
        {"question":"高可用架构中消除单点故障最重要的手段是什么？","options":["A. 加强监控","B. 冗余设计","C. 购买保险","D. 增加防火墙"],"correctIndex":1,"explanation":"冗余设计(多节点、多机房、多活)是高可用的核心，任何单点都可能成为故障点。"},
    ],
    'def-15': [
        {"question":"Linux中/etc/shadow文件的正确权限是多少？","options":["A. 777","B. 644","C. 600","D. 755"],"correctIndex":2,"explanation":"/etc/shadow存储密码哈希，应该只允许root读写(600)，普通用户没有读取权限。"},
        {"question":"SSH配置中禁用密码登录后如何认证？","options":["A. 无需认证","B. 使用公钥认证","C. 使用验证码","D. 使用短信"],"correctIndex":1,"explanation":"禁用密码登录(PasswordAuthentication no)后，必须配置SSH公钥认证作为替代。"},
        {"question":"Linux SELinux的安全上下文不包括以下哪个？","options":["A. 用户(User)","B. 角色(Role)","C. 类型(Type)","D. 密码(Password)"],"correctIndex":3,"explanation":"SELinux安全上下文包含User:Role:Type:Level四个字段，密码不属于安全上下文。"},
        {"question":"以下哪个命令可以查看Linux审计日志？","options":["A. cat /var/log/syslog","B. ausearch","C. dmesg","D. journalctl"],"correctIndex":1,"explanation":"ausearch是auditd审计系统的查询工具，用于搜索和分析审计规则产生的日志事件。"},
    ],
    'def-16': [
        {"question":"Active Directory中GPO的全称是什么？","options":["A. Global Policy Object","B. Group Policy Object","C. General Policy Option","D. Group Permission Order"],"correctIndex":1,"explanation":"GPO(Group Policy Object)是AD中的组策略对象，用于集中管理域内计算机和用户配置。"},
        {"question":"BloodHound主要用来分析AD中的什么？","options":["A. 性能问题","B. 攻击路径和权限关系","C. 日志审计","D. 网络流量"],"correctIndex":1,"explanation":"BloodHound通过图数据库分析AD中的用户、组、计算机之间的权限关系，发现潜在的攻击路径。"},
        {"question":"Kerberos协议中TGT的全称是什么？","options":["A. Ticket Granting Ticket","B. Token Generation Ticket","C. Trust Gateway Token","D. Transport Grant Token"],"correctIndex":0,"explanation":"TGT(Ticket Granting Ticket)是Kerberos认证中的票据授予票据，用于获取访问特定服务的票据。"},
        {"question":"保护AD域控制器最重要的是什么？","options":["A. 安装杀毒软件","B. 物理隔离和严格访问控制","C. 关闭防火墙","D. 开放所有端口"],"correctIndex":1,"explanation":"域控制器是AD核心，一旦被攻破整个域失陷。物理安全和严格访问控制是防护基础。"},
    ],
    'def-17': [
        {"question":"MySQL中mysql_secure_installation工具的作用是什么？","options":["A. 安装MySQL","B. 初次安全配置","C. 备份数据库","D. 性能优化"],"correctIndex":1,"explanation":"mysql_secure_installation用于MySQL安装后的初始安全设置，包括设置root密码、删除匿名用户等。"},
        {"question":"SQL注入防御中参数化查询的原理是什么？","options":["A. 加密SQL语句","B. 将用户输入与SQL逻辑分离","C. 限制查询长度","D. 添加验证码"],"correctIndex":1,"explanation":"参数化查询将SQL结构(代码)与数据(参数)分离，数据库不会将参数内容作为SQL执行。"},
        {"question":"数据库审计应该记录哪些信息？","options":["A. 只有登录","B. 所有DML和DDL操作","C. 只记录select","D. 只记录delete"],"correctIndex":1,"explanation":"完整的数据库审计应记录所有操作，包括查询(DML)和结构变更(DDL)，便于事后追溯。"},
        {"question":"数据库备份的3-2-1原则是指什么？","options":["A. 3次备份2个版本1个位置","B. 3份拷贝2种介质1份异地","C. 3天2次1个备份","D. 3个工具2个数据库1个脚本"],"correctIndex":1,"explanation":"3-2-1备份原则：至少3份数据拷贝，存储在2种不同介质上，其中1份存放在异地。"},
    ],
    'def-18': [
        {"question":"Dockerfile中USER指令的作用是什么？","options":["A. 指定镜像作者","B. 指定容器运行时的用户","C. 设置环境变量","D. 暴露端口"],"correctIndex":1,"explanation":"USER指令指定容器中进程运行的用户身份，避免使用root用户运行应用是容器安全基本要求。"},
        {"question":"Trivy可以扫描以下哪些内容？","options":["A. 只扫描镜像","B. 镜像漏洞和配置问题","C. 只扫描代码","D. 只扫描依赖"],"correctIndex":1,"explanation":"Trivy是全面的安全扫描器，可以扫描容器镜像漏洞、配置错误和依赖安全问题。"},
        {"question":"Docker的Read-only Root Filesystem的作用是什么？","options":["A. 提高性能","B. 禁止容器修改系统文件","C. 节省空间","D. 加速启动"],"correctIndex":1,"explanation":"只读根文件系统阻止容器运行时修改系统文件，减少攻击者在容器内写入恶意文件的风险。"},
        {"question":"容器逃逸是指什么？","options":["A. 容器停止运行","B. 从容器内获取宿主机权限","C. 容器迁移","D. 容器删除"],"correctIndex":1,"explanation":"容器逃逸是严重安全威胁，攻击者从容器环境中突破隔离获取宿主机访问权限。"},
    ],
    'def-19': [
        {"question":"IaaS模式下，安全责任划分中用户负责什么？","options":["A. 物理硬件安全","B. 操作系统及以上","C. 虚拟化层","D. 什么都不用管"],"correctIndex":1,"explanation":"IaaS中用户负责Guest OS及以上的安全(操作系统、应用、数据)，云商负责底层基础设施。"},
        {"question":"CSPM解决了云安全的什么问题？","options":["A. 性能优化","B. 云资源配置合规和安全态势管理","C. 费用管理","D. 应用开发"],"correctIndex":1,"explanation":"CSPM(Cloud Security Posture Management)持续检查云资源配置是否符合安全最佳实践和合规要求。"},
        {"question":"最常见的云安全事件原因是什么？","options":["A. 零日漏洞","B. 云资源配置错误","C. DDoS攻击","D. APT攻击"],"correctIndex":1,"explanation":"配置错误(如S3桶公开访问、安全组规则过于宽松)是绝大多数云安全事件的根本原因。"},
        {"question":"AWS中IAM的最佳实践是什么？","options":["A. 使用root账户日常操作","B. 最小权限原则","C. 所有用户Admin权限","D. 不使用MFA"],"correctIndex":1,"explanation":"最小权限原则(Least Privilege)要求只为用户分配完成工作所需的最小权限集。"},
    ],
    'def-20': [
        {"question":"OAuth 2.0中Authorization Code流程的第一步是什么？","options":["A. 获取Access Token","B. 用户授权后返回Authorization Code","C. 直接访问资源","D. 注册应用"],"correctIndex":1,"explanation":"OAuth 2.0授权码流程：用户授权→返回授权码→用授权码换Access Token→访问资源。"},
        {"question":"API限流(Rate Limiting)一般返回哪个HTTP状态码？","options":["A. 200","B. 404","C. 429","D. 500"],"correctIndex":2,"explanation":"HTTP 429(Too Many Requests)表示客户端发送了过多请求，触发了限流策略。"},
        {"question":"JWT的三个组成部分是什么？","options":["A. Header.Body.Signature","B. Header.Payload.Signature","C. Token.Key.Data","D. User.Pass.Token"],"correctIndex":1,"explanation":"JWT由Header(声明类型和算法)、Payload(载荷数据)、Signature(签名)三部分组成。"},
        {"question":"API安全中使用TLS的作用是什么？","options":["A. 加速传输","B. 加密传输数据防窃听","C. 压缩数据","D. 缓存响应"],"correctIndex":1,"explanation":"TLS(Transport Layer Security)加密API通信，防止传输过程中的数据被窃听或篡改。"},
    ],
}

CODES = {
    'def-11': [{"title":"告警质量评估","language":"python","code":"# IDS告警质量评估\nclass AlertQuality:\n    def __init__(self):\n        self.tp = self.fp = self.tn = self.fn = 0\n    def add(self, actual, alert):\n        if actual and alert: self.tp += 1\n        elif not actual and alert: self.fp += 1\n        elif not actual and not alert: self.tn += 1\n        else: self.fn += 1\n    def report(self):\n        precision = self.tp/(self.tp+self.fp) if (self.tp+self.fp)>0 else 0\n        recall = self.tp/(self.tp+self.fn) if (self.tp+self.fn)>0 else 0\n        fpr = self.fp/(self.fp+self.tn) if (self.fp+self.tn)>0 else 0\n        print(f'检出率: {recall:.1%} | 精确率: {precision:.1%} | 误报率: {fpr:.1%}')\n        if fpr > 0.1: print('⚠ 误报率过高，需调优规则!')\n\naq = AlertQuality()\nfor _ in range(45): aq.add(True, True)\nfor _ in range(5): aq.add(True, False)\nfor _ in range(12): aq.add(False, True)\nfor _ in range(38): aq.add(False, False)\naq.report()","explanation":"评估IDS告警质量，计算误报率与检出率指导规则调优"}],
    'def-12': [{"title":"SYN Flood检测","language":"python","code":"# SYN Flood攻击检测\nfrom collections import defaultdict\nfrom datetime import datetime\n\nclass SYNFloodDetector:\n    def __init__(self, threshold=100, window=10):\n        self.threshold = threshold\n        self.window = window\n        self.counter = defaultdict(list)\n    def record(self, src_ip):\n        now = datetime.now()\n        self.counter[src_ip] = [t for t in self.counter[src_ip] if (now-t).total_seconds() <= self.window]\n        self.counter[src_ip].append(now)\n        count = len(self.counter[src_ip])\n        if count >= self.threshold:\n            print(f'[SYN Flood] {src_ip} {count}SYN/{self.window}s!')\n            return True\n        return False\n\ndetector = SYNFloodDetector(threshold=5, window=10)\nprint('=== SYN Flood检测 ===')\nfor i in range(8): detector.record('10.0.0.99')  # 攻击\nfor i in range(2): detector.record('192.168.1.50')  # 正常","explanation":"基于滑动窗口的SYN Flood攻击检测算法"}],
    'def-13': [{"title":"DNS安全分析","language":"python","code":"# DNS安全分析与隧道检测\ndef analyze_dns(domain):\n    alerts = []\n    if len(domain) > 100:\n        alerts.append(f'[DNS隧道] 异常长域名: {domain[:80]}...')\n    entropy = len(set(domain.split('.')[0])) / max(len(domain.split('.')[0]), 1)\n    if entropy > 0.8 and len(domain) > 30:\n        alerts.append(f'[DGA域名] 高熵值: {domain}')\n    susp_tlds = ['.tk', '.ml', '.ga', '.pw', '.xyz']\n    if any(domain.endswith(tld) for tld in susp_tlds):\n        alerts.append(f'[可疑TLD] {domain}')\n    return alerts\n\nprint('=== DNS安全分析 ===')\ntests = ['www.google.com', 'abcdefgh1234qrstuvwxyz5678malware.xyz', 'A'*60+'.example.tk']\nfor d in tests:\n    r = analyze_dns(d)\n    if r:\n        for a in r: print(a)\n    else:\n        print(f'[正常] {d}')","explanation":"DNS安全分析，检测DNS隧道和DGA域名特征"}],
    'def-14': [{"title":"CDN缓存监控","language":"python","code":"# CDN缓存命中率监控\nimport random\n\nclass CDNMonitor:\n    def __init__(self):\n        self.total = self.hits = self.misses = 0\n    def process(self, url):\n        self.total += 1\n        if random.random() < 0.90:\n            self.hits += 1\n            print(f'[Hit] {url}')\n        else:\n            self.misses += 1\n            print(f'[Miss] {url} -> 回源')\n    def report(self):\n        if self.total == 0: return\n        rate = self.hits/self.total*100\n        print(f'总请求: {self.total} | 命中率: {rate:.1f}% | 回源: {self.misses}')\n        if rate < 80: print('⚠ 缓存命中率偏低')\n\nm = CDNMonitor()\nurls = ['/index.html','/api/users','/style.css','/images/logo.png']\nfor _ in range(20): m.process(random.choice(urls))\nm.report()","explanation":"CDN缓存监控，统计命中率和回源量保护源站"}],
    'def-15': [{"title":"Linux安全基线检查","language":"python","code":"# Linux安全基线检查\nimport os\n\nclass LinuxSecCheck:\n    def __init__(self):\n        self.results = []\n    def check_perm(self, path, expected):\n        try:\n            actual = oct(os.stat(path).st_mode)[-3:]\n            if actual != expected:\n                self.results.append(f'[FAIL] {path}: {actual} (期望{expected})')\n            else:\n                self.results.append(f'[OK]   {path}: {expected}')\n        except:\n            self.results.append(f'[WARN] {path}: 不存在')\n\nprint('=== Linux安全基线检查 ===')\nchecker = LinuxSecCheck()\nfor p, perm in [('/etc/shadow', '000'), ('/etc/passwd', '644'), ('/root', '700')]:\n    checker.check_perm(p, perm)\nfor r in checker.results: print(r)\nprint('建议: 使用Lynis进行完整安全审计')","explanation":"Linux系统安全基线自动化检查脚本"}],
    'def-16': [{"title":"AD权限关系分析","language":"python","code":"# Active Directory权限分析\nclass ADAnalyzer:\n    def __init__(self):\n        self.groups = {}\n        self.acls = []\n    def add_user(self, name, groups):\n        for g in groups:\n            self.groups.setdefault(g, []).append(name)\n    def add_acl(self, who, resource, perm):\n        self.acls.append((who, resource, perm))\n    def find_paths(self, target):\n        print(f'攻击路径分析 - {target}:')\n        for who, what, perm in self.acls:\n            if what == target and 'FullControl' in perm:\n                members = self.groups.get(who, [])\n                print(f'  ⚠ {who}({len(members)}人) 拥有完全控制: {members}')\n\nprint('=== AD安全分析 ===')\na = ADAnalyzer()\na.add_user('admin01', ['Domain Admins'])\na.add_user('user01', ['IT Support'])\na.add_acl('IT Support', 'Domain Controller', 'FullControl')\na.find_paths('Domain Controller')\nprint('建议: 使用BloodHound进行完整分析')","explanation":"AD权限关系分析，识别过度授权和攻击路径"}],
    'def-17': [{"title":"SQL注入防护","language":"python","code":"# 安全vs不安全数据库查询\nprint('=== SQL注入防护对比 ===')\n\n# 危险方式\nusername = \"admin' OR '1'='1\"\nunsafe = f\"SELECT * FROM users WHERE username = '{username}'\"\nprint(f'[危险] {unsafe}')\n\n# 安全方式(参数化查询)\nsafe_sql = \"SELECT * FROM users WHERE username = ?\"\nsafe_params = [username]\nprint(f'[安全] SQL: {safe_sql}')\nprint(f'[安全] 参数: {safe_params}')\nprint('关键: 参数化查询将结构(代码)和数据(参数)分离')","explanation":"对比不安全SQL拼接与安全参数化查询，演示SQL注入防护"}],
    'def-18': [{"title":"Docker安全扫描","language":"python","code":"# Docker容器安全检查\nclass DockerSec:\n    def __init__(self):\n        self.issues = []\n    def check_dockerfile(self, content):\n        checks = {\n            'USER root': ('高危', '应使用非root用户'),\n            ':latest': ('中危', '应使用固定版本标签'),\n        }\n        for pat, (sev, fix) in checks.items():\n            if pat in content:\n                self.issues.append((sev, pat, fix))\n    def check_runtime(self, cfg):\n        if cfg.get('privileged'):\n            self.issues.append(('紧急', '特权模式', '移除privileged:true'))\n        if not cfg.get('read_only'):\n            self.issues.append(('中危', '未启用只读', '设置read_only:true'))\n    def report(self):\n        print('=== Docker安全扫描 ===')\n        for i, (sev, issue, fix) in enumerate(self.issues, 1):\n            print(f'{i}. [{sev}] {issue} -> {fix}')\n\ns = DockerSec()\ns.check_dockerfile('FROM ubuntu:latest\\nUSER root')\ns.check_runtime({'privileged':True, 'read_only':False})\ns.report()","explanation":"Docker容器安全检查，扫描Dockerfile和运行时配置中的安全隐患"}],
    'def-19': [{"title":"云安全配置审计","language":"python","code":"# 云安全配置审计\nclass CloudAuditor:\n    def __init__(self):\n        self.findings = []\n    def check_s3(self, name, public, encrypted):\n        if public: self.findings.append(f'[紧急] S3 {name}: 公开访问!')\n        if not encrypted: self.findings.append(f'[高] S3 {name}: 未加密')\n    def check_sg(self, name, rules):\n        for r in rules:\n            if r.get('cidr') == '0.0.0.0/0' and r.get('port') in [22, 3389]:\n                self.findings.append(f'[高] SG {name}: {r[\"port\"]}对全网开放')\n    def check_iam(self, name, mfa, policies):\n        if not mfa: self.findings.append(f'[中] IAM {name}: 未启用MFA')\n        if 'AdministratorAccess' in policies: self.findings.append(f'[中] IAM {name}: 管理员权限')\n\nprint('=== 云安全审计 ===')\na = CloudAuditor()\na.check_s3('customer-data', True, False)\na.check_sg('web-sg', [{'port': 22, 'cidr': '0.0.0.0/0'}])\na.check_iam('developer01', False, ['AdministratorAccess'])\nfor f in a.findings: print(f)\nprint('建议: 使用Prowler进行自动化云安全审计')","explanation":"云安全配置审计检查S3、安全组、IAM等常见云错误配置"}],
    'def-20': [{"title":"API限流中间件","language":"python","code":"# API限流(Rate Limiting)\nimport time\nfrom collections import defaultdict\n\nclass RateLimiter:\n    def __init__(self, max_req=10, window=60):\n        self.max_req = max_req\n        self.window = window\n        self.reqs = defaultdict(list)\n    def allowed(self, client_id):\n        now = time.time()\n        self.reqs[client_id] = [t for t in self.reqs[client_id] if now-t < self.window]\n        if len(self.reqs[client_id]) >= self.max_req:\n            retry = int(self.window-(now-self.reqs[client_id][0]))\n            print(f'[429] {client_id} 限流, {retry}s后重试')\n            return False\n        self.reqs[client_id].append(now)\n        print(f'[200] {client_id} ({len(self.reqs[client_id])}/{self.max_req})')\n        return True\n\nlimiter = RateLimiter(max_req=5)\nprint('=== API限流测试 ===')\nfor i in range(7):\n    limiter.allowed('api-key-abc')\n    time.sleep(0.1)","explanation":"API限流滑动窗口算法实现，防止DDoS和API滥用"}],
}

NOTES = {
    'def-11': [
        {"author":"赵安全","title":"告警疲劳是运营的最大敌人","content":"如果每天收到1000条告警，分析师会麻木。解决告警疲劳：1)告警聚合 2)分级(高危才通知) 3)自动化(低危自动处理) 4)静默期(维护窗口)。目标是让每一条告警都值得关注。","url":"https://www.freebuf.com/articles/es/258934.html"},
        {"author":"钱运维","title":"Suricata性能调优实战","content":"Suricata性能调优要点：1)规则分组(按需加载) 2)关闭不需要的协议解析 3)使用af-packet模式 4)多worker模式 5)合理设置检测引擎参数。能提升3-5倍吞吐量。","url":"https://suricata.readthedocs.io/en/suricata-6.0.0/performance/"},
        {"author":"孙情报","title":"IDS规则生命周期管理","content":"IDS规则需要生命周期管理：新建(导入)→启用(测试通过)→调优(排除误报)→生效(正式运行)→退役(规则过时)。建议用Git管理规则版本，方便回滚和审计。","url":"https://www.snort.org/documents"},
    ],
    'def-12': [
        {"author":"赵安全","title":"DDoS防护的核心思路","content":"DDoS防护三步走：1)稀释(用CDN/Anycast分散攻击流量) 2)清洗(识别并过滤恶意流量) 3)源站保护(隐藏真实IP)。单纯扩容带宽是抗不住的，需要多层防护体系。","url":"https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/"},
        {"author":"钱运维","title":"防DDoS也要有应急预案","content":"DDoS发生时快速响应比技术手段更重要。预案应包含：1)检测和确认流程 2)清洗切换步骤 3)与ISP/云厂商联系方式 4)沟通模板 5)演练记录。提前准备好，不要临时抱佛脚。","url":"https://aws.amazon.com/shield/ddos-attack-protection/"},
        {"author":"孙情报","title":"小企业的DDoS防护方案","content":"小企业没大预算做DDoS防护，建议：1)使用Cloudflare免费CDN(自带基本防护) 2)配置Nginx连接数和速率限制 3)准备备用IP 4)与ISP保持良好关系，关键时可请求上游过滤。","url":"https://www.freebuf.com/articles/network/235678.html"},
    ],
    'def-13': [
        {"author":"赵安全","title":"DNS安全容易被忽视","content":"DNS是互联网基础设施，但DNS安全常被忽视。攻击者可利用DNS做DDoS放大、数据外传隧道、C2通信。建议至少做三件事：启用DNSSEC、限制递归查询、监控DNS异常。","url":"https://www.cloudflare.com/learning/dns/dns-security/"},
        {"author":"钱运维","title":"DoH/DoT的利与弊","content":"加密DNS(DoH/DoT)保护了用户隐私，但也带来新问题：传统DNS监控手段失效，恶意软件可利用DoH绕过企业DNS安全策略。建议企业环境配合DNS策略一起使用。","url":"https://developers.cloudflare.com/1.1.1.1/encryption/"},
        {"author":"孙情报","title":"DNS隧道检测技巧","content":"检测DNS隧道：1)异常长的DNS查询(超100字符) 2)高熵值子域名(随机字符) 3)同一客户端大量不同域名查询 4)DNS查询频率异常(如每30秒一次)。用这些指标做异常检测。","url":"https://www.anquanke.com/post/id/245678"},
    ],
    'def-14': [
        {"author":"赵安全","title":"CDN安全不仅仅是加速","content":"CDN除加速访问，安全功能同样重要：1)隐藏源站IP防直接攻击 2)DDoS防护(流量分散) 3)WAF规则(边缘拦截) 4)Bot管理(减少恶意爬虫)。合理利用这些功能事半功倍。","url":"https://www.cloudflare.com/learning/cdn/what-is-a-cdn/"},
        {"author":"钱运维","title":"CDN配置中的安全清单","content":"配置CDN时安全checklist：1)强制HTTPS 2)启用HSTS 3)配置WAF规则 4)限制源站仅接受CDN IP 5)启用DDoS防护 6)开启Bot Fight Mode 7)配置Rate Limiting。一条都不能少。","url":"https://developers.cloudflare.com/fundamentals/security/"},
        {"author":"孙情报","title":"多CDN架构的考量","content":"大流量场景考虑多CDN架构(Cloudflare+阿里云CDN等)，避免单一CDN故障导致服务不可用。配合智能DNS做流量调度和故障切换，提升整体可用性和容灾能力。","url":"https://www.freebuf.com/articles/es/268934.html"},
    ],
    'def-15': [
        {"author":"赵安全","title":"Linux加固不是一次性工作","content":"安全加固不是做完就完事。系统环境在变化(新软件、新用户、新配置)，安全基线也要持续维护。建议用Lynis或OpenSCAP定期扫描，建立安全合规的持续监控机制。","url":"https://cisofy.com/lynis/"},
        {"author":"钱运维","title":"SELinux不要直接关","content":"很多教程建议关闭SELinux，这在生产环境是危险的。SELinux提供了重要的强制访问控制层。花时间理解audit2allow工具，配置自定义策略，而不是简单粗暴地关掉它。","url":"https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/chap-system_auditing"},
        {"author":"孙情报","title":"自动化加固的实践","content":"推荐用Ansible/SaltStack做Linux批量安全加固。定义好安全基线playbook，新机器上架自动执行，既提高效率又保证一致性。推送前先在测试环境验证，避免生产事故。","url":"https://www.freebuf.com/articles/system/256789.html"},
    ],
    'def-16': [
        {"author":"赵安全","title":"AD安全的核心风险","content":"AD安全的核心风险：1)域管理员组过大 2)服务账户权限过高 3)默认配置不安全 4)Kerberos票据攻击。建议定期用BloodHound/PingCastle做安全评估，清理不必要管理员权限。","url":"https://learn.microsoft.com/zh-cn/windows-server/identity/ad-ds/plan/security-best-practices/"},
        {"author":"钱运维","title":"AD攻击的最常见路径","content":"攻击者进入AD后典型攻击路径：获取普通域用户凭据→枚举域信息→Kerberoasting→凭据转储(DCSync)→域控完全控制。理解这条路径才能有效防御，在每个环节设置检测和阻断。","url":"https://www.freebuf.com/articles/system/245678.html"},
        {"author":"孙情报","title":"LAPS一定要部署","content":"LAPS(本地管理员密码解决方案)是免费微软工具，能解决本地管理员密码复用这个老大难问题。部署LAPS后每台机器本地管理员密码都是唯一的、定期更换的，能有效阻止横向移动。","url":"https://learn.microsoft.com/zh-cn/windows-server/identity/laps/"},
    ],
    'def-17': [
        {"author":"赵安全","title":"数据库安全的三个层次","content":"数据库安全要分层防护：1)网络安全(限制访问IP、VPN) 2)认证授权(最小权限、强密码) 3)数据安全(加密存储、审计日志)。三层都要做，缺一不可。","url":"https://dev.mysql.com/doc/refman/8.0/en/security.html"},
        {"author":"钱运维","title":"SQL注入防御要纵深","content":"防SQL注入不能只靠WAF。最佳方案：1)参数化查询(代码层) 2)数据库最小权限 3)WAF规则(网络层) 4)安全审计(持续监控)。纵深防御最可靠，单层防护总有被绕过的可能。","url":"https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"},
        {"author":"孙情报","title":"数据库审计怎么落地","content":"数据库审计方案：1)MySQL原生审计插件 2)代理层审计(ProxySQL) 3)旁路抓包审计。建议根据合规要求和预算选择方案。审计日志要加密存储防止篡改，审计策略要持续更新。","url":"https://www.freebuf.com/articles/database/267890.html"},
    ],
    'def-18': [
        {"author":"赵安全","title":"容器安全的误区","content":"很多人觉得容器是隔离的就安全了，这是误区。容器共享宿主机内核，一旦逃逸全完。安全加固要点：非root运行、只读文件系统、Seccomp限制、镜像扫描、运行时监控。","url":"https://docs.docker.com/engine/security/"},
        {"author":"钱运维","title":"Docker镜像瘦身与安全","content":"镜像越小越安全(攻击面小)。推荐：1)Alpine基础镜像 2)多阶段构建 3)不装编译工具 4)distroless镜像(连shell都没有)。同时定期用Trivy扫描漏洞，构建流水线自动化扫描。","url":"https://github.com/aquasecurity/trivy"},
        {"author":"孙情报","title":"Kubernetes安全入门","content":"K8s安全重点：1)RBAC最小权限 2)Pod Security Admission 3)Network Policy网络策略 4)Secret管理(别写YAML里) 5)镜像签名验证。从Day 1就把安全策略配置好。","url":"https://kubernetes.io/docs/concepts/security/"},
    ],
    'def-19': [
        {"author":"赵安全","title":"云安全责任模型不要搞混","content":"最常见的云安全事故源于对共享责任模型的误解。简单记忆：云厂商负责'云的安全'(物理/网络/虚拟化)，你负责'云中的安全'(OS/应用/数据/配置/身份)。不管哪层都不要假设云厂商帮你做好了。","url":"https://www.cloudflare.com/learning/privacy/what-is-the-cloud-shared-responsibility-model/"},
        {"author":"钱运维","title":"S3数据泄露防御","content":"S3桶公开访问导致的数据泄露太多了。防御措施：1)默认Block Public Access 2)启用S3访问日志 3)配置CloudTrail审计 4)用AWS Config规则自动检测公开桶 5)启用服务端加密。","url":"https://docs.aws.amazon.com/security/"},
        {"author":"孙情报","title":"云安全工具链推荐","content":"多云环境建议部署统一云安全工具链：Prowler(安全审计)→ScoutSuite(合规扫描)→CloudMapper(网络可视化)→Falco(运行时安全)。最好通过CSPM平台集成所有工具统一管理。","url":"https://www.freebuf.com/articles/es/289012.html"},
    ],
    'def-20': [
        {"author":"赵安全","title":"API安全的三个支柱","content":"API安全三支柱：1)认证(你是谁，JWT/OAuth) 2)授权(你能做什么，RBAC/ABAC) 3)审计(你做了什么，日志)。缺任何一根支柱API就不安全。另外API也要做输入验证和输出过滤。","url":"https://owasp.org/www-project-api-security/"},
        {"author":"钱运维","title":"OAuth 2.0常见安全漏洞","content":"OAuth 2.0实现中常见漏洞：1)redirect_uri未严格验证 2)state参数未使用(CSRF风险) 3)Access Token泄露在URL中 4)授权码可重复使用。这些在开发和测试阶段就要注意排查。","url":"https://oauth.net/2/security-considerations/"},
        {"author":"孙情报","title":"API网关就是API的安全大门","content":"API网关(Kong/APISIX)是把所有API安全策略统一实施的最佳位置。在网关层统一做：认证、限流、日志、CORS、IP白名单、请求校验。后端服务可以专注于业务逻辑，安全交给网关。","url":"https://www.freebuf.com/articles/web/289012.html"},
    ],
}

# ==================== Regex patterns ====================

OLD_QUIZ_TAIL = r'\{"question":"信息安全的三个基本要素是什么？","options":\["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"\],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"\},\{"question":"纵深防御的核心原则是什么？","options":\["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一产品"\],"correctIndex":1,"explanation":"纵深防御通过多层安全控制叠加保护系统。"\},\{"question":"安全事件应急响应第一步？","options":\["修复漏洞","通知媒体","隔离受影响系统","重装系统"\],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"\},\{"question":"以下哪项不是SOC的主要职能？","options":\["安全监控","威胁检测","产品研发","事件响应"\],"correctIndex":2,"explanation":"产品研发不属于SOC的安全运营核心职能。"\}'

OLD_CODE = r'codeExamples:\s*\[{"title":"动手实践","language":"python","code":"# 安全防御实践.*?"explanation":"安全防御配置基线检查代码示例"}\]'

OLD_NOTES = r'expertNotes:\s*\[{"author":"张伟","title":"安全防御体系建设"[^]]*"url":"https://www.freebuf.com/articles/es/278934.html"}\]'

def replace_day_content(day_id):
    with open(FPATH, 'r', encoding='utf-8') as f:
        text = f.read()
    
    modified = False
    
    if day_id in QUIZ_TAIL:
        new_quiz_tail = ','.join(json.dumps(q, ensure_ascii=False) for q in QUIZ_TAIL[day_id])
        m = re.search(rf"(id:\s*'{day_id}'.+?)" + OLD_QUIZ_TAIL, text, re.DOTALL)
        if m:
            text = text[:m.start()] + m.group(1) + new_quiz_tail + text[m.end():]
            print(f'  {day_id}: quiz OK', end='')
            modified = True
        else:
            print(f'  {day_id}: quiz FAIL', end='')
    
    if day_id in CODES:
        m = re.search(rf"(id:\s*'{day_id}'.+?)" + OLD_CODE, text, re.DOTALL)
        if m:
            new_code = 'codeExamples: [' + ','.join(json.dumps(c, ensure_ascii=False) for c in CODES[day_id]) + ']'
            text = text[:m.start()] + m.group(1) + new_code + text[m.end():]
            print(' code OK', end='')
            modified = True
        else:
            print(' code FAIL', end='')
    
    if day_id in NOTES:
        m = re.search(rf"(id:\s*'{day_id}'.+?)" + OLD_NOTES, text, re.DOTALL)
        if m:
            new_notes = 'expertNotes: [' + ','.join(json.dumps(n, ensure_ascii=False) for n in NOTES[day_id]) + ']'
            text = text[:m.start()] + m.group(1) + new_notes + text[m.end():]
            print(' notes OK')
            modified = True
        else:
            print(' notes FAIL')
    
    if modified:
        with open(FPATH, 'w', encoding='utf-8') as f:
            f.write(text)
    return modified


if __name__ == '__main__':
    print('=== Defense Part2: def-11 ~ def-20 ===\n')
    for i in range(11, 21):
        replace_day_content(f'def-{i}')
    print('\n=== Part2 完成 ===')
