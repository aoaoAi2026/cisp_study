"""
替换 cyberDefense.ts def-21~def-30 的 quiz(2-5题)、codeExamples、expertNotes 为专属内容
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

# ==================== DAY 21-30 ====================

QUIZ_TAIL = {
    'def-21': [
        {"question":"STRIDE中\"S\"代表什么威胁？","options":["A. Spoofing(伪装)","B. Scanning(扫描)","C. Sniffing(嗅探)","D. Spamming(垃圾邮件)"],"correctIndex":0,"explanation":"S=Spoofing(伪装/身份欺骗)，对应认证(Authentication)安全属性。"},
        {"question":"SAST与DAST的主要区别是什么？","options":["A. SAST更快","B. SAST分析源代码(白盒)，DAST测试运行中应用(黑盒)","C. DAST更准确","D. SAST不需要代码"],"correctIndex":1,"explanation":"SAST是静态白盒测试分析源代码，DAST是动态黑盒测试运行中的应用。"},
        {"question":"SDL的哪个阶段最早介入安全？","options":["A. 测试阶段","B. 培训阶段","C. 响应阶段","D. 上线后"],"correctIndex":1,"explanation":"SDL从培训阶段就介入安全，培养开发人员安全意识是第一步。"},
        {"question":"OWASP Dependency-Check的作用是什么？","options":["A. 检查代码风格","B. 扫描第三方依赖已知漏洞","C. 性能测试","D. 单元测试"],"correctIndex":1,"explanation":"Dependency-Check扫描项目依赖库中是否存在已知的CVE漏洞。"},
    ],
    'def-22': [
        {"question":"等保2.0将保护对象扩展到了哪些领域？","options":["A. 仅传统信息系统","B. 云计算、物联网、工控、大数据等","C. 仅网络设备","D. 仅服务器"],"correctIndex":1,"explanation":"等保2.0扩展了保护对象，新增云计算、物联网、移动互联、工控系统、大数据等。"},
        {"question":"等保2.0的一个中心、三重防护是指什么？","options":["A. 一个数据中心的防护","B. 安全管理中心+安全通信网络/区域边界/计算环境","C. 一个防火墙","D. 三重备份"],"correctIndex":1,"explanation":"一个中心(安全管理中心)、三重防护(安全通信网络、安全区域边界、安全计算环境)。"},
        {"question":"等保定级后几步流程的正确顺序是什么？","options":["A. 定级→测评→备案","B. 定级→备案→测评→监督","C. 备案→定级→测评","D. 测评→定级→备案"],"correctIndex":1,"explanation":"等保正确流程：定级→备案→建设整改→等级测评→监督检查。"},
        {"question":"等保2.0与1.0最大的变化是什么？","options":["A. 增加了云等保","B. 变\"自主定级\"为\"依法定级\"且扩展保护对象","C. 取消了测评","D. 降低了要求"],"correctIndex":1,"explanation":"等保2.0核心变化:依法定级、扩展保护对象、强调主动防御和持续监测。"},
    ],
    'def-23': [
        {"question":"等保差距分析报告的主要内容是什么？","options":["A. 仅列出问题","B. 现状描述+差距比对+整改建议","C. 仅安全扫描结果","D. 仅预算评估"],"correctIndex":1,"explanation":"差距分析报告应包含现状描述、与等保要求对标差距、具体整改建议和优先级。"},
        {"question":"等保建设整改中，技术整改包括哪些？","options":["A. 只买防火墙","B. 部署安全设备、加固系统、安全配置","C. 只写制度","D. 只做培训"],"correctIndex":1,"explanation":"技术整改包括部署安全设备(防火墙/IDS/WAF等)、系统加固、安全配置优化等。"},
        {"question":"等级测评由谁来做？","options":["A. 企业自己做","B. 公安部认可的测评机构","C. 任何安全公司","D. 不需要测评"],"correctIndex":1,"explanation":"等级测评必须由公安部认可的等级保护测评机构进行，测评报告具有法律效力。"},
        {"question":"等保整改完成后，多长时间需要重新测评？","options":["A. 永远不用","B. 三级系统每年一次","C. 每五年一次","D. 每十年一次"],"correctIndex":1,"explanation":"等保三级系统要求每年至少进行一次等级测评，四级每半年一次。"},
    ],
    'def-24': [
        {"question":"风险值计算公式中不包含哪个因子？","options":["A. 资产价值","B. 威胁可能性","C. 脆弱性严重程度","D. 员工数量"],"correctIndex":3,"explanation":"风险值=资产价值×威胁可能性×脆弱性严重程度，员工数量不是风险计算因子。"},
        {"question":"当风险处于可接受范围时，应采取什么策略？","options":["A. 规避","B. 转移","C. 接受","D. 忽略"],"correctIndex":2,"explanation":"风险接受(Risk Acceptance)指风险在可接受范围内，管理层知情并正式接受该残余风险。"},
        {"question":"定性风险评估和定量风险评估的区别？","options":["A. 没有区别","B. 定性用等级(高/中/低)，定量用数值/金额","C. 定量更快","D. 定性更准确"],"correctIndex":1,"explanation":"定性评估用描述性等级，定量评估用具体数值(如可能损失XX万元)。"},
        {"question":"残余风险需要谁审批？","options":["A. 安全工程师","B. 管理层","C. 普通员工","D. 任何人"],"correctIndex":1,"explanation":"残余风险必须由管理层正式批准接受，明确知晓并承担相关风险责任。"},
    ],
    'def-25': [
        {"question":"RPO=4小时的含义是什么？","options":["A. 备份需要4小时","B. 最多允许丢失4小时的数据","C. 系统4小时后恢复","D. 演练需要4小时"],"correctIndex":1,"explanation":"RPO=4小时表示灾难发生时，最多允许丢失最近4小时内的数据。"},
        {"question":"热备站点(Hot Site)的典型RTO是多少？","options":["A. 24小时以上","B. 1小时内","C. 48小时","D. 72小时"],"correctIndex":1,"explanation":"热备站点具备实时数据同步，可在1小时甚至几分钟内接管业务。"},
        {"question":"3-2-1备份原则中的\"1\"代表什么？","options":["A. 1个备份副本","B. 1份异地备份","C. 每天备份1次","D. 1个备份管理员"],"correctIndex":1,"explanation":"3-2-1原则:至少3份数据副本、2种不同存储介质、1份异地(Off-site)存储。"},
        {"question":"业务连续性计划(BCP)与灾难恢复计划(DRP)的关系？","options":["A. 毫无关系","B. BCP范围更大，包含DRP","C. DRP包含BCP","D. 完全相同"],"correctIndex":1,"explanation":"BCP涵盖整个业务持续运营(含人员、场地、流程)，DRP专注于IT系统和数据恢复，DRP是BCP的子集。"},
    ],
    'def-26': [
        {"question":"安全策略/方针属于哪个层级？","options":["A. 操作层面","B. 战术层面","C. 战略层面(最高层)","D. 技术层面"],"correctIndex":2,"explanation":"安全策略/方针是组织安全的最高层战略文件，定义安全目标、原则和总体方向。"},
        {"question":"安全基线(Security Baseline)的作用是什么？","options":["A. 最高的安全标准","B. 最低安全配置要求","C. 可选的建议","D. 仅供参考"],"correctIndex":1,"explanation":"安全基线是系统必须满足的最低安全配置标准，低于基线即为不合规。"},
        {"question":"制度落地执行的关键保障是什么？","options":["A. 仅培训","B. 技术控制+监督检查+考核奖惩","C. 仅技术控制","D. 仅发文件"],"correctIndex":1,"explanation":"制度落地的三维保障:技术控制(强制执行)、监督检查(确保执行)、考核奖惩(激励约束)。"},
        {"question":"安全制度应多久评审更新一次？","options":["A. 不需要更新","B. 至少每年一次或有重大变更时","C. 每五年一次","D. 每十年一次"],"correctIndex":1,"explanation":"安全制度应至少每年评审一次，或在发生重大安全事件、业务变化、法规更新时及时修订。"},
    ],
    'def-27': [
        {"question":"为什么钓鱼演练的链接不要直接用真实钓鱼页面？","options":["A. 技术限制","B. 法律合规风险，需要在道德框架内","C. 成本太高","D. 没有效果"],"correctIndex":1,"explanation":"钓鱼演练应在合法合规框架内进行，目标页应为教育页面而非真正收集凭据，避免法律和信任风险。"},
        {"question":"安全培训效果最好的形式是什么？","options":["A. 发邮件","B. 场景模拟+互动式培训","C. 贴海报","D. 看视频"],"correctIndex":1,"explanation":"场景模拟和互动式培训参与度高、印象深刻，效果远好于单向灌输式培训。"},
        {"question":"社会工程攻击最常见的形式是什么？","options":["A. 尾随进入","B. 钓鱼邮件和电话诈骗","C. USB丢弃","D. 冒充维修人员"],"correctIndex":1,"explanation":"钓鱼邮件和电话诈骗(Vishing)是最高频的社会工程攻击形式，投入产出比最高。"},
        {"question":"员工识别钓鱼邮件最关键的检查点是什么？","options":["A. 邮件排版","B. 发件人地址和链接实际URL","C. 附件大小","D. 发送时间"],"correctIndex":1,"explanation":"悬停查看链接真实URL和检查发件人地址是否被伪造，是识别钓鱼最有效的手段。"},
    ],
    'def-28': [
        {"question":"红蓝对抗中，蓝队最重要的能力是什么？","options":["A. 攻击能力","B. 检测和快速响应能力","C. 系统开发","D. 密码破解"],"correctIndex":1,"explanation":"蓝队的核心能力是检测攻击行为并快速响应遏制，缩短攻击者驻留时间(Dwell Time)。"},
        {"question":"AWD攻防模式的特点是什么？","options":["A. 只做攻击","B. 攻击他人同时防御自己，攻守兼备","C. 只做防御","D. 理论答题"],"correctIndex":1,"explanation":"AWD(Attack With Defense)每队既要攻击其他队伍又要修补自身漏洞，综合考察攻防能力。"},
        {"question":"红蓝对抗结束后复盘总结的重点是？","options":["A. 谁赢了","B. 发现的防御短板和改进措施","C. 参与者表现","D. 攻击工具"],"correctIndex":1,"explanation":"复盘核心是发现防御体系的不足并制定改进计划，胜负本身不是目的。"},
        {"question":"紫队(Purple Team)的作用是什么？","options":["A. 替代红队","B. 促进红蓝协作，知识共享","C. 替代蓝队","D. 独立攻击"],"correctIndex":1,"explanation":"紫队促进红蓝两队协作，共享攻击技术和防御策略，确保演练成果转化为实际防御提升。"},
    ],
    'def-29': [
        {"question":"MISP平台的主要功能是什么？","options":["A. 防火墙管理","B. 威胁情报共享与协作","C. 代码管理","D. 日志存储"],"correctIndex":1,"explanation":"MISP(Malware Information Sharing Platform)是开源威胁情报共享平台，用于收集、存储、分发IOC。"},
        {"question":"战术情报(Tactical Intel)主要面向谁？","options":["A. 管理层","B. 安全运营/响应团队","C. 普通员工","D. 客户"],"correctIndex":1,"explanation":"战术情报面向安全运营和事件响应团队，提供TTPs(Tactics, Techniques, Procedures)用于检测和防御。"},
        {"question":"威胁情报中TTP是什么的缩写？","options":["A. Time To Patch","B. Tactics, Techniques, Procedures","C. Threat Tracking Platform","D. Trusted Third Party"],"correctIndex":1,"explanation":"TTP=Tactics(战术)+Techniques(技术)+Procedures(过程)，描述攻击者的行为模式。"},
        {"question":"Pyramid of Pain中最难改变的攻击者要素是什么？","options":["A. IP地址","B. 域名","C. 工具","D. TTPs(战术技术过程)"],"correctIndex":3,"explanation":"痛苦金字塔底层(IP/域名)易变，顶层TTPs是攻击者行为模式，最难改变。防御TTPs层面最有效。"},
    ],
    'def-30': [
        {"question":"SOAR平台的核心价值是什么？","options":["A. 日志存储","B. 安全编排自动化与响应","C. 身份认证","D. 加密通信"],"correctIndex":1,"explanation":"SOAR(Security Orchestration, Automation and Response)通过剧本(Playbook)自动化安全响应流程。"},
        {"question":"SOC成熟度L5(自适应)的特点是什么？","options":["A. 被动响应","B. 有流程","C. 主动检测","D. AI驱动智能化运营，可预测威胁"],"correctIndex":3,"explanation":"L5自适应阶段利用AI/ML技术实现智能威胁预测、自适应防御和自动化决策。"},
        {"question":"SIEM与SOAR的关系是什么？","options":["A. 同一个东西","B. SIEM产生告警→SOAR自动化响应","C. 没有关系","D. SOAR替代SIEM"],"correctIndex":1,"explanation":"SIEM负责日志汇聚分析和告警生成，SOAR接收告警后按剧本自动执行响应动作，两者互补。"},
        {"question":"安全运营中MTTD和MTTR分别指什么？","options":["A. 检测时间和修复时间","B. 平均检测时间和平均响应时间","C. 传输时间和运行时间","D. 维护时间和恢复时间"],"correctIndex":1,"explanation":"MTTD(Mean Time to Detect)平均检测时间，MTTR(Mean Time to Respond)平均响应时间，是SOC关键KPI。"},
    ],
}

CODES = {
    'def-21': [{"title":"SDL威胁建模","language":"python","code":"# STRIDE威胁建模练习\nclass ThreatModel:\n    def __init__(self, asset):\n        self.asset = asset\n        self.threats = []\n    def analyze(self, component, flow):\n        stride = {'S':'伪装-身份认证','T':'篡改-完整性','R':'否认-审计','I':'信息泄露-加密','D':'DoS-可用性','E':'提权-授权'}\n        for key, desc in stride.items():\n            if self._check_threat(component, key):\n                self.threats.append(f'[{key}] {component}: {desc}')\n        return self.threats\n    def _check_threat(self, component, key):\n        checks = {'login':['S','D'],'api':['T','I','E','D'],'db':['T','I','R']}\n        return key in checks.get(component, [])\n    def report(self):\n        print(f'=== {self.asset} 威胁模型 ===')\n        for t in self.threats: print(f'  ⚠ {t}')\n\nmodel = ThreatModel('在线商城')\nfor comp in ['login','api','db']:\n    model.analyze(comp, 'HTTP')\nmodel.report()\nprint('缓解措施: 强认证+加密+审计+限流+RBAC')","explanation":"STRIDE威胁建模实践，分析组件威胁并给出缓解措施"}],
    'def-22': [{"title":"等保定级计算","language":"python","code":"# 等保2.0定级参考工具\nclass DengbaoLeveling:\n    def __init__(self):\n        self.scores = {}\n    def assess(self, name, c_score, i_score, a_score):\n        total = c_score + i_score + a_score\n        if total >= 15: level = 5\n        elif total >= 12: level = 4\n        elif total >= 9: level = 3\n        elif total >= 6: level = 2\n        else: level = 1\n        self.scores[name] = {'C':c_score,'I':i_score,'A':a_score,'总分':total,'等级':level}\n    def report(self):\n        print('=== 等保定级评估 ===')\n        for name, s in self.scores.items():\n            lvl_desc = {1:'自主保护',2:'指导保护',3:'监督保护',4:'强制保护',5:'专控保护'}\n            print(f'{name}: C={s[\"C\"]} I={s[\"I\"]} A={s[\"A\"]} 总分={s[\"总分\"]} -> 第{s[\"等级\"]}级({lvl_desc[s[\"等级\"]]})')\n\ndb = DengbaoLeveling()\ndb.assess('企业门户', 3, 2, 3)   # 总分8 -> 二级\ndb.assess('核心交易系统', 5, 4, 4) # 总分13 -> 四级\ndb.assess('内部OA', 2, 2, 3)     # 总分7 -> 二级\ndb.report()","explanation":"等保2.0定级参考，基于CIA三个维度评分计算保护等级"}],
    'def-23': [{"title":"等保差距分析","language":"python","code":"# 等保差距分析工具\nclass GapAnalysis:\n    REQUIREMENTS = {'安全物理环境':10,'安全通信网络':8,'安全区域边界':8,'安全计算环境':10,'安全管理中心':6,'安全管理制度':6,'安全管理人员':6,'安全建设管理':8}\n    def __init__(self):\n        self.gaps = {}\n    def check(self, domain, passed):\n        total = self.REQUIREMENTS[domain]\n        gap = total - passed\n        rate = passed/total\n        self.gaps[domain] = (total, passed, gap, rate)\n    def report(self):\n        print('=== 等保差距分析报告 ===')\n        for domain, (total, passed, gap, rate) in self.gaps.items():\n            status = '合规' if rate>=0.8 else '待整改' if rate>=0.6 else '严重不足'\n            print(f'  [{status}] {domain}: {passed}/{total} 缺口={gap}')\n        total_gap = sum(g for _,_,g,_ in self.gaps.values())\n        print(f'\\n总差距项: {total_gap}，建议优先整改高风险项')\n\nga = GapAnalysis()\nga.check('安全物理环境', 8)\nga.check('安全通信网络', 5)\nga.check('安全区域边界', 4)\nga.check('安全管理中心', 3)\nga.report()","explanation":"等保差距分析工具，对标等保要求计算各领域合规程度"}],
    'def-24': [{"title":"风险矩阵计算","language":"python","code":"# 信息安全风险评估\nclass RiskCalculator:\n    def __init__(self):\n        self.risks = []\n    def evaluate(self, asset, value, threat, vuln):\n        risk_score = value * threat * vuln\n        if risk_score >= 50: level = '极高'\n        elif risk_score >= 25: level = '高'\n        elif risk_score >= 10: level = '中'\n        else: level = '低'\n        self.risks.append({'资产':asset,'价值':value,'威胁':threat,'脆弱性':vuln,'风险值':risk_score,'等级':level})\n    def report(self):\n        print('=== 风险评估报告 ===')\n        self.risks.sort(key=lambda x: x['风险值'], reverse=True)\n        for r in self.risks:\n            treatment = {'极高':'规避或缓解','高':'重点缓解','中':'缓解或转移','低':'接受'}\n            print(f'  [{r[\"等级\"]}] {r[\"资产\"]}: 风险值={r[\"风险值\"]} -> {treatment[r[\"等级\"]]}')\n\nrc = RiskCalculator()\nrc.evaluate('核心数据库', 5, 4, 3)   # 60 极高\nrc.evaluate('Web服务器', 4, 3, 2)   # 24 中(接近高)\nrc.evaluate('内部文件服务器', 3, 2, 2) # 12 中\nrc.evaluate('打印服务器', 1, 2, 1)   # 2 低\nrc.report()","explanation":"风险评估计算器，基于资产价值×威胁×脆弱性计算风险等级"}],
    'def-25': [{"title":"RPO/RTO计算器","language":"python","code":"# 灾难恢复 RPO/RTO 计算\nclass DRPlanner:\n    def __init__(self):\n        self.systems = []\n    def add_system(self, name, rto_h, rpo_h, criticality):\n        cost_factor = {'核心':10, '重要':5, '一般':1}\n        dr_cost = cost_factor.get(criticality, 5) * (1/rto_h + 1/max(rpo_h, 0.1)) * 10\n        strategy = '双活' if rto_h < 0.5 else '热备' if rto_h < 2 else '温备' if rto_h < 8 else '冷备'\n        self.systems.append({'系统':name,'RTO(h)':rto_h,'RPO(h)':rpo_h,'关键性':criticality,'策略':strategy,'预估成本':int(dr_cost)})\n    def report(self):\n        print('=== 灾难恢复规划 ===')\n        total = 0\n        for s in self.systems:\n            print(f'  {s[\"系统\"]}({s[\"关键性\"]}): RTO={s[\"RTO(h)\"]}h RPO={s[\"RPO(h)\"]}h -> {s[\"策略\"]} 成本:{s[\"预估成本\"]}')\n            total += s['预估成本']\n        print(f'  总预算估算: {total} 单位')\n\ndr = DRPlanner()\ndr.add_system('核心交易', 0.25, 0, '核心')\ndr.add_system('CRM', 2, 1, '重要')\ndr.add_system('OA', 24, 12, '一般')\ndr.report()","explanation":"灾难恢复规划工具，根据RTO/RPO推荐备份策略和成本估算"}],
    'def-26': [{"title":"安全策略检查","language":"python","code":"# 安全策略合规检查\nclass PolicyAuditor:\n    def __init__(self):\n        self.checks = []\n    def check_password_policy(self, min_len, has_complex, max_age):\n        passed = min_len >= 8 and has_complex and max_age <= 90\n        self.checks.append(('密码策略',\n            f'最小{min_len}位,复杂度{\"有\"if has_complex else\"无\"},有效期{max_age}天',\n            '合规' if passed else '不合规'))\n    def check_access_control(self, has_mfa, least_priv, review_cycle):\n        passed = has_mfa and least_priv and review_cycle <= 90\n        self.checks.append(('访问控制',\n            f'MFA{\"有\"if has_mfa else\"无\"},最小权限{\"是\"if least_priv else\"否\"},评审周期{review_cycle}天',\n            '合规' if passed else '不合规'))\n    def check_audit(self, enabled, retention):\n        passed = enabled and retention >= 180\n        self.checks.append(('审计日志',\n            f'启用{\"是\"if enabled else\"否\"},保留{retention}天',\n            '合规' if passed else '不合规'))\n    def report(self):\n        print('=== 安全策略合规审计 ===')\n        ok = fail = 0\n        for policy, detail, status in self.checks:\n            mark = '✓' if status == '合规' else '✗'\n            print(f'  {mark} {policy}: {detail} -> {status}')\n            if status == '合规': ok += 1\n            else: fail += 1\n        compliance_rate = ok/(ok+fail)*100 if (ok+fail)>0 else 0\n        print(f'\\n合规率: {compliance_rate:.0f}% ({ok}/{ok+fail})')\n\npa = PolicyAuditor()\npa.check_password_policy(8, True, 90)\npa.check_password_policy(6, False, 180)\npa.check_access_control(True, True, 60)\npa.check_audit(True, 365)\npa.report()","explanation":"安全策略合规审计，检查密码/访问控制/审计策略是否符合基线要求"}],
    'def-27': [{"title":"钓鱼邮件检测","language":"python","code":"# 钓鱼邮件特征检测\nclass PhishingDetector:\n    def __init__(self):\n        self.keywords = {'紧急','立即','您的账户','验证','密码','安全升级','已锁定','点击此处','确认','过期'}\n    def analyze(self, subject, from_addr, links):\n        score = 0\n        reasons = []\n        urgency = sum(1 for w in self.keywords if w in subject)\n        if urgency >= 2:\n            score += 30; reasons.append(f'紧迫感词汇x{urgency}')\n        if any(d in from_addr.lower() for d in ['account-security','support-ticket','verify']):\n            score += 20; reasons.append(f'可疑发件人: {from_addr}')\n        suspicious_domains = ['login-verify','secure-update','account-confirm']\n        for link in links:\n            if any(d in link for d in suspicious_domains):\n                score += 25; reasons.append(f'可疑链接: {link}')\n            if '@' in link:\n                score += 20; reasons.append(f'链接含@符号: {link}')\n        threat = '高' if score>=50 else '中' if score>=25 else '低'\n        return threat, score, reasons\n\nprint('=== 钓鱼邮件分析 ===')\ndetector = PhishingDetector()\ntests = [\n    ('紧急！您的账户即将被锁定！', 'account-security@fake.com', ['https://login-verify.com/reset']),\n    ('月度安全报告', 'sec@company.com', ['https://company.com/report']),\n    ('您好，请确认账户信息', 'support-ticket@evil.org', ['https://account-confirm.net/verify']),\n]\nfor subj, frm, links in tests:\n    threat, score, reasons = detector.analyze(subj, frm, links)\n    print(f'  主题: {subj}')\n    print(f'  -> 威胁等级: {threat} (分数:{score})')\n    for r in reasons: print(f'     • {r}')","explanation":"钓鱼邮件特征检测器，分析紧迫感词汇/可疑发件人/恶意链接"}],
    'def-28': [{"title":"红蓝对抗记分","language":"python","code":"# 红蓝对抗演练计分系统\nclass PurpleExercise:\n    def __init__(self):\n        self.red = {'边界突破':0,'横向移动':0,'权限提升':0,'目标达成':0,'持久化':0}\n        self.blue = {'检测':0,'响应':0,'阻断':0,'溯源':0,'恢复':0}\n    def red_score(self, action, success):\n        if action in self.red:\n            self.red[action] += 10 if success else 5\n    def blue_score(self, action, success):\n        if action in self.blue:\n            self.blue[action] += 10 if success else 3\n    def report(self):\n        red_total = sum(self.red.values())\n        blue_total = sum(self.blue.values())\n        print('=== 红蓝对抗战报 ===')\n        print(f'红队: {red_total}分 | 蓝队: {blue_total}分')\n        print(f'结论: {\"红队优势\"if red_total>blue_total else\"蓝队防守有效\"if blue_total>red_total else\"势均力敌\"}')\n        if blue_total < red_total * 0.7:\n            print('⚠ 蓝队需加强检测和响应能力!')\n\npe = PurpleExercise()\npe.red_score('边界突破', True)\npe.red_score('横向移动', True)\npe.red_score('权限提升', True)\npe.red_score('目标达成', True)\npe.blue_score('检测', False)\npe.blue_score('响应', True)\npe.blue_score('阻断', False)\npe.blue_score('溯源', True)\npe.report()","explanation":"红蓝对抗计分系统，评估攻防双方表现并提出改进建议"}],
    'def-29': [{"title":"IOC匹配引擎","language":"python","code":"# 威胁情报IOC匹配引擎\nclass IOCMatcher:\n    def __init__(self):\n        self.iocs = []\n    def add_ioc(self, ioc_type, value, confidence):\n        self.iocs.append({'type':ioc_type,'value':value,'confidence':confidence})\n    def match(self, log_entry):\n        hits = []\n        for ioc in self.iocs:\n            if ioc['value'].lower() in log_entry.lower():\n                hits.append(ioc)\n        return hits\n    def alert(self, hits):\n        if not hits: return\n        severity = 'HIGH' if any(h['confidence']>=80 for h in hits) else 'MEDIUM' if any(h['confidence']>=50 for h in hits) else 'LOW'\n        print(f'[{severity}] IOC匹配: {len(hits)}个')\n        for h in hits:\n            print(f'  • {h[\"type\"]}: {h[\"value\"]} (置信度:{h[\"confidence\"]})')\n\nprint('=== IOC匹配引擎 ===')\nmatcher = IOCMatcher()\nmatcher.add_ioc('ip', '185.130.5.231', 90)\nmatcher.add_ioc('domain', 'evil-c2.malware.xyz', 85)\nmatcher.add_ioc('hash', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6', 75)\n# 模拟日志\nlogs = ['GET /login.php from 185.130.5.231','DNS query for cdn.cloudflare.com','POST /api/user from 10.0.1.50','Connection to evil-c2.malware.xyz:443']\nfor log in logs:\n    print(f'日志: {log[:50]}...')\n    hits = matcher.match(log)\n    matcher.alert(hits)","explanation":"威胁情报IOC匹配引擎，将日志与已知威胁指标进行匹配告警"}],
    'def-30': [{"title":"SOC运营仪表盘","language":"python","code":"# SOC安全运营KPI仪表盘\nfrom datetime import datetime, timedelta\n\nclass SOCDashboard:\n    def __init__(self):\n        self.alerts = []\n        self.incidents = []\n    def add_alert(self, severity, mttd_h):\n        self.alerts.append({'severity':severity,'mttd':mttd_h})\n    def add_incident(self, level, mttr_h):\n        self.incidents.append({'level':level,'mttr':mttr_h})\n    def kpi_report(self):\n        print('=== SOC运营KPI ===')\n        if self.alerts:\n            avg_mttd = sum(a['mttd'] for a in self.alerts)/len(self.alerts)\n            print(f'MTTD(平均检测时间): {avg_mttd:.1f}h')\n            high = sum(1 for a in self.alerts if a['severity']=='high')\n            print(f'高危告警: {high}/{len(self.alerts)}')\n        if self.incidents:\n            avg_mttr = sum(i['mttr'] for i in self.incidents)/len(self.incidents)\n            print(f'MTTR(平均响应时间): {avg_mttr:.1f}h')\n            resolved = sum(1 for i in self.incidents if i['level']!='open')\n            print(f'事件解决率: {resolved}/{len(self.incidents)}')\n        maturity = 'L3-优化' if avg_mttd<4 else 'L2-规范'\n        print(f'成熟度评估: {maturity}')\n\nsoc = SOCDashboard()\nsoc.add_alert('high', 0.5)\nsoc.add_alert('medium', 2.0)\nsoc.add_alert('high', 1.5)\nsoc.add_incident('high', 3.0)\nsoc.add_incident('medium', 1.5)\nsoc.add_incident('low', 0.5)\nsoc.kpi_report()","explanation":"SOC运营仪表盘，计算MTTD/MTTR/解决率等关键运营指标"}],
}

NOTES = {
    'def-21': [
        {"author":"赵安全","title":"SDL落地最大的难点是文化","content":"SDL技术不难，难的是文化转变。开发团队习惯了'先上线后修'，安全团队总被当成'拦路虎'。建议:1)安全左移 2)提供自助工具 3)培训而非指责 4)安全成为开发团队的KPI。","url":"https://www.microsoft.com/en-us/securityengineering/sdl"},
        {"author":"钱运维","title":"威胁建模不要过度设计","content":"STRIDE是好方法，但不要每个功能都做完整威胁建模。优先级:核心支付流程>用户认证>个人信息处理>普通功能。投入产出比合理才是可持续的SDL实践。","url":"https://owasp.org/www-community/Threat_Modeling"},
        {"author":"孙情报","title":"代码审计工具选型建议","content":"SAST工具推荐：SonarQube(开源、Java/.NET)、Semgrep(轻量、多语言、自定义规则)、Bandit(Python专用)。建议CI/CD中集成：提交触发→SAST扫描→严重漏洞阻断合并。","url":"https://www.freebuf.com/articles/es/301234.html"},
    ],
    'def-22': [
        {"author":"赵安全","title":"等保2.0不是负担是指导","content":"很多企业把等保看成合规负担，这是误区。等保2.0的要求本质上是安全最佳实践的规范化。按等保要求做好，安全水平自然就提升了。把等保当成安全建设的'菜单'和'验收标准'。","url":"https://www.freebuf.com/articles/es/234567.html"},
        {"author":"钱运维","title":"云等保的特殊要求","content":"云环境下等保需要特别注意:1)明确与云商的共享责任边界 2)虚拟化网络安全 3)多租户隔离 4)云审计日志。建议使用等保合规基线和自动化检查工具。","url":"https://www.freebuf.com/articles/network/256789.html"},
        {"author":"孙情报","title":"等保定级的常见错误","content":"定级常见误区:1)定低了(核心业务定二级) 2)没考虑业务关联影响 3)多个系统随意合并定级 4)定级报告不专业。建议请有经验的咨询机构协助，定级是等保的基础不能马虎。","url":"https://www.freebuf.com/articles/security-management/278901.html"},
    ],
    'def-23': [
        {"author":"赵安全","title":"等保整改要分优先级","content":"等保整改不是一股脑全做。建议优先级:1)高风险项(网络暴露漏洞) 2)合规红线(不满足必被否决) 3)核心系统 4)一般系统。先解决最关键最紧急的问题，逐步完善。","url":"https://www.freebuf.com/articles/es/289012.html"},
        {"author":"钱运维","title":"等保测评准备的checklist","content":"测评前准备:1)整理资产清单 2)收集所有安全设备配置 3)准备管理制度文件 4)访谈人员预演 5)自查整改。千万别什么都不准备就测评，大概率过不了。","url":"https://www.freebuf.com/articles/security-management/290123.html"},
        {"author":"孙情报","title":"等保不是一劳永逸","content":"通过等保测评只是起点不是终点。安全状态是动态的:系统变更、新漏洞、新威胁都需要持续管理。建议建立持续合规监控机制，不等下一次测评才发现问题。","url":"https://www.freebuf.com/articles/network/301456.html"},
    ],
    'def-24': [
        {"author":"赵安全","title":"风险评估要讲实际","content":"风险评估最忌闭门造车。评估小组应包含:业务负责人(了解资产价值)、IT运维(了解技术现状)、安全人员(了解威胁)。多角色参与才能保证评估结果客观准确。","url":"https://www.freebuf.com/articles/es/267890.html"},
        {"author":"钱运维","title":"小型风险评估怎么做","content":"小团队资源有限，推荐快速风险评估方法:1)列出TOP10资产 2)评估CIA影响 3)列出TOP5威胁 4)分析脆弱性 5)生成风险矩阵。一页纸就够，关键是执行改进措施。","url":"https://www.freebuf.com/articles/security-management/278934.html"},
        {"author":"孙情报","title":"风险处置的决策艺术","content":"风险处置不是纯技术决策。考虑因素:合规要求(等保、GDPR等)、业务影响、成本效益、管理层风险偏好。安全负责人的价值在于帮管理层在安全和业务之间找到平衡点。","url":"https://www.freebuf.com/articles/es/289056.html"},
    ],
    'def-25': [
        {"author":"赵安全","title":"DR演练比方案更重要","content":"很多公司写了漂亮的DR方案，但从未演练过。真出事时才发现:网络不通、数据不对、人员不会操作。建议至少每半年做一次桌面演练，每年做一次模拟切换。","url":"https://www.freebuf.com/articles/es/245678.html"},
        {"author":"钱运维","title":"备份一定验证可恢复性","content":"备份成功的'假象':日志显示备份成功了，但从来没恢复验证过。强烈建议每月自动执行恢复测试:1)随机选备份文件 2)恢复至测试环境 3)验证数据完整性 4)记录恢复时间。","url":"https://www.freebuf.com/articles/network/256789.html"},
        {"author":"孙情报","title":"混合云灾备架构设计","content":"利用混合云做灾备:生产在私有云/IDC，灾备在公有云。故障时快速在云端拉起。优势是成本可控(平时资源不占用)、弹性扩展、按需付费。关键是数据和网络要提前验证一致性。","url":"https://www.freebuf.com/articles/es/267890.html"},
    ],
    'def-26': [
        {"author":"赵安全","title":"安全策略的生命周期","content":"安全策略不是写完就完了。完整生命周期:起草→评审→审批→发布→宣贯→执行→检查→修订。很多公司前四步做了，后四步没做，策略就成了摆设。","url":"https://www.freebuf.com/articles/security-management/278901.html"},
        {"author":"钱运维","title":"制度落地的黄金法则","content":"制度落地的三大黄金法则:1)简单明了(一线员工能看懂) 2)可执行(有操作指南) 3)有检查(不执行有后果)。记住:写100条没人看的制度不如做好3条。","url":"https://www.freebuf.com/articles/security-management/289012.html"},
        {"author":"孙情报","title":"密码策略的反面教训","content":"传统密码策略(90天更换+复杂组合+历史记录)反而降低了安全，因为员工开始使用弱密码或写下来。NIST最新建议:长度优先(12+位)、不强制定期更换、支持粘贴、配合MFA使用。","url":"https://www.freebuf.com/articles/es/301456.html"},
    ],
    'def-27': [
        {"author":"赵安全","title":"安全意识培训的心理学","content":"人的安全行为改变需要:1)认知(知道要做什么) 2)动机(愿意做) 3)能力(能做) 4)触发(提示做)。单纯的培训只解决认知，还需要激励机制、易用工具和环境提示。","url":"https://www.freebuf.com/articles/es/278934.html"},
        {"author":"钱运维","title":"钓鱼演练的正确打开方式","content":"钓鱼演练注意:1)事前与HR/法务沟通确认合规 2)失败者提供教育而非惩罚 3)定期变化模板 4)公布整体统计而非个人点名。目标是教育不是羞辱，否则适得其反。","url":"https://www.freebuf.com/articles/security-management/289045.html"},
        {"author":"孙情报","title":"安全文化比培训更重要","content":"最理想的安全状态:不是员工被迫遵守规则，而是主动报告问题。安全文化要素:领导以身作则、安全简单不碍事、报告有奖励、事件不追责(并鼓励报告)。培训只是手段，文化才是目的。","url":"https://www.freebuf.com/articles/es/301567.html"},
    ],
    'def-28': [
        {"author":"赵安全","title":"红蓝对抗不是比赛","content":"红蓝对抗的核心目的不是'谁赢了'，而是'我们发现了什么弱点'。最成功的演练是找到了最多防御短板并制定了改进计划。建议所有演练以改善防御为目的，淡化胜负。","url":"https://www.freebuf.com/articles/es/267890.html"},
        {"author":"钱运维","title":"蓝队能力建设路线图","content":"蓝队能力建设五阶段:1)基础监控(部署必要的检测工具) 2)告警处理(建立标准流程) 3)威胁狩猎(主动搜索) 4)自动化(SOAR) 5)攻防联动(紫队)。别跳级，打好基础最重要。","url":"https://www.freebuf.com/articles/network/278901.html"},
        {"author":"孙情报","title":"紫队-红蓝的桥梁","content":"紫队模式是红蓝对抗的最佳实践演进。紫队确保红队的技术发现可以转化为蓝队的检测规则，不再各练各的。典型做法:红队展示攻击→蓝队尝试检测→联合复盘→制定改进→验证。","url":"https://www.freebuf.com/articles/es/289012.html"},
    ],
    'def-29': [
        {"author":"赵安全","title":"威胁情报要从'能用'到'有用'","content":"很多组织买了威胁情报但用不起来。秘诀:1)聚焦相关的(与你行业/地区有关) 2)自动化匹配(对接SIEM/SOAR) 3)闭环反馈(消费后评估质量) 4)逐步建立自有情报源。","url":"https://www.freebuf.com/articles/es/256789.html"},
        {"author":"钱运维","title":"MISP部署的经验","content":"MISP部署建议:1)配置自动同步社区(如CIRCL) 2)建立标签体系方便分类 3)配置衰减策略(Sighting) 4)对接SIEM做自动匹配 5)内部建立情报贡献文化。","url":"https://www.freebuf.com/articles/network/267890.html"},
        {"author":"孙情报","title":"免费威胁情报源汇总","content":"值得关注的免费情报:1)Abuse.ch(Botnet/SSL黑名单) 2)AlienVault OTX 3)Emerging Threats规则 4)GreyNoise(扫描背景) 5)URLhaus(恶意URL)。建议按优先级集成到SIEM/SOAR中。","url":"https://www.freebuf.com/articles/es/278934.html"},
    ],
    'def-30': [
        {"author":"赵安全","title":"SOC建设的常见误区","content":"SOC常见误区:1)买了SIEM=建了SOC(差得远) 2)重技术轻人员(人是核心) 3)告警求多不求精(告警疲劳) 4)没有KPI没法衡量 5)一次性建设不持续优化。","url":"https://www.freebuf.com/articles/es/278901.html"},
        {"author":"钱运维","title":"SOC KPI设计指南","content":"SOC关键KPI建议:MTTD(检测时间)<1h、MTTR(响应时间)<4h、告警分类率>95%、误报率<10%、事件升级率<5%、分析师利用率70-80%。指标要有目标、有趋势、可改进。","url":"https://www.freebuf.com/articles/security-management/289012.html"},
        {"author":"孙情报","title":"从零开始建SOC","content":"从零建SOC路线:1)先做日志集中(ELK) 2)开发基础检测规则 3)建立值班和响应流程 4)引入威胁情报 5)部署SOAR自动化。不要想一步到位，分阶段持续建设，每个月都要有进步。","url":"https://www.freebuf.com/articles/es/301678.html"},
    ],
}

# ==================== Regex patterns ====================

OLD_QUIZ_TAIL = r'\{"question":"信息安全的三个基本要素是什么？","options":\["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"\],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"\},\{"question":"纵深防御的核心原则是什么？","options":\["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一产品"\],"correctIndex":1,"explanation":"纵深防御通过多层安全控制叠加保护系统。"\},\{"question":"安全事件应急响应第一步？","options":\["修复漏洞","通知媒体","隔离受影响系统","重装系统"\],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"\},\{"question":"以下哪项不是SOC的主要职能？","options":\["安全监控","威胁检测","产品研发","事件响应"\],"correctIndex":2,"explanation":"产品研发不属于SOC的安全运营核心职能。"\}'

OLD_CODE = r'codeExamples:\s*\[{"title":"动手实践","language":"python","code":"# 安全防御实践.*?"explanation":"安全防御配置基线检查代码示例"}\]'

OLD_NOTES = r'expertNotes:\s*\[{"author":"张伟","title":"安全防御体系建设".*?"url":"https://www.freebuf.com/articles/es/278934.html"}\]'

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
    print('=== Defense Part3: def-21 ~ def-30 ===\n')
    for i in range(21, 31):
        replace_day_content(f'def-{i}')
    print('\n=== Part3 完成 ===')
