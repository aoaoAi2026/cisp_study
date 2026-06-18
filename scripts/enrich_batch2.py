#!/usr/bin/env python3
"""
面试内容数据驱动生成器 — 读取紧凑的JSON知识库，渲染为高质量markdown面试内容。
解决嵌入大量中文导致引号冲突的问题。
"""
import json, os, re

BASE = r'e:\internal_safe\cisp1\cisp\public\contents\interview-learning'
CONTENT_DB = {}  # key: "module/day-NN" -> content data

# ============ 内容格式：为每个模板文件定义紧凑结构 ============
# 每项: (module, dayfile, title, subtitle, [(q, a), ...], [trap, ...], [check, ...])

def add(mod, dayfile, title, subtitle, qas, traps, checks):
    CONTENT_DB[f"{mod}/{dayfile}"] = {
        "title": title,
        "subtitle": subtitle,
        "qas": qas,
        "traps": traps,
        "checks": checks
    }

def render_md(data):
    lines = [f"# {data['title']}\n", f"> {data['subtitle']}\n", "## 核心知识点\n"]
    for q, a in data['qas']:
        lines.append(f"### Q: {q}\n")
        lines.append(f"{a}\n")
    lines.append("## 面试陷阱\n")
    for t in data['traps']:
        lines.append(f"- {t}\n")
    lines.append("\n## 今日检测\n")
    for i, c in enumerate(data['checks'], 1):
        lines.append(f"{i}. {c}\n")
    return "".join(lines)

# ================================================================
# BASIC 模块剩余
# ================================================================
add("basic", "day-25.md", "Day 25：安全运营中心(SOC)",
    "[SOC面试核心] SOC架构/告警分级/SOAR自动化/KPI指标/人员排班",
    [
        ("请从0到1设计一个中小型企业的SOC",
         "四阶段设计：\n\n"
         "**阶段0-需求对齐(第一周)**：和CISO/CTO对齐保护什么资产、合规要求、预算\n\n"
         "**阶段1-日志接入(第1-2月)**：最小可用日志集——AD域控+VPN+EDR+Office365/AWS CloudTrail+防火墙→全部推入SIEM。优先接入高频攻击数据源：VPN登录日志(爆破攻击)、EDR告警(终端第一响应)\n\n"
         "**阶段2-告警规则(第2-3月)**：从MITRE ATT&CK选Top技术→写检测规则。最出效果的5条初级规则：①1小时内同账号失败>10次(爆破) ②非工作时间VPN登录 ③不可行旅行(5分钟两国家登录) ④Domain Admins成员变更 ⑤大量上行流量(数据泄露)\n\n"
         "**阶段3-人员排班(第3-4月)**：L1分析师(外包/初级)告警初筛→L2分析师(内部中级)事件研判→L3/应急响应(内部高级)复杂事件\n\n"
         "**阶段4-自动化(第4-6月)**：SOAR Playbook→暴力破解自动封锁IP+禁用账号。Threat Hunting每月至少一次假设驱动的主动搜索"),

        ("什么是SOAR？和SIEM的区别是什么？",
         "SIEM(安全信息与事件管理)：被动收集分析日志→产生告警→展示给分析师。核心是【看】。\n"
         "SOAR(安全编排自动化与响应)：在SIEM基础上增加Playbook编排+自动响应+案例管理+威胁情报集成。核心是【做】。\n\n"
         "关键区别：SIEM输出告警+仪表盘，SOAR输出自动化动作+案例报告。SIEM依赖日志源，SOAR需要SIEM/EDR/防火墙作为触发器。告警量越大SIEM需要的人越多，SOAR自动化率越高需要的人越少。\n\n"
         "什么时候上SOAR：日均告警>500条L1已处理不过来、标准操作流程已稳定、预算充足。开源方案有Shuffle/n8n，商业有Splunk SOAR/Palo Alto XSOAR/Tines"),

        ("Threat Hunting(威胁狩猎)和传统SOC告警处理有什么区别？",
         "告警处理是被动的——SIEM触发告警→分析师响应→关闭，基于已知的恶意(签名/模式)。\n"
         "威胁狩猎是主动的——分析师提出假设(而非等告警)→主动搜索证据→证实或证伪，基于未知的恶意。\n\n"
         "Sqrrl狩猎模型五步：1)假设——攻击者可能通过钓鱼获得初始访问在做横向移动 2)数据收集——集中搜索AD日志/NetFlow/EDR Telemetry 3)分析——查询非标准端口SMB连接/黄金票据事件ID 4)发现→创建告警规则确保持续检测 5)未发现→记录提升了对此向量防御的信心度\n\n"
         "面试举例：基于ATT&CK T1059.001(PowerShell)做威胁狩猎——搜索所有PowerShell调用中DownloadString/Invoke-Expression/FromBase64String等关键词，寻找隐藏后渗透活动"),

        ("SOC的误报率太高怎么办？",
         "四层解法：\n"
         "1. 规则优化(前30%见效)：分析Top 10高频告警→每条都问这是误报吗→如果是，规则太宽还是本身就是错的→持续迭代\n"
         "2. 上下文丰富(再30%见效)：告警中包含主机名/业务Owner/最近10分钟相关告警→L1不用跨系统查信息\n"
         "3. 白名单抑制(再20%见效)：已知IT变更窗口不发告警、扫描器IP不标记为攻击、已知测试账号不作爆破告警\n"
         "4. 风险评分(最后20%)：资产重要性×告警严重度×告警频率=风险分→L1只看高风险。UEBA行为基线→偏离基线的才告警\n\n"
         "坦诚说：误报不可能为0，降低误报的另一面是漏报率上升。SOC的挑战永远在两者之间找平衡"),

        ("SOC的排班模式和核心KPI有哪些？",
         "排班模式：8h×3班(最常见，交接清晰但夜班招人难)、12h×2班(交接少但疲劳判断出错)、Follow-the-Sun(亚太→欧洲→美洲三个SOC接力，天然7x24无夜班但跨时区协作难)、On-Call(小团队日班+夜班被PagerDuty叫醒，成本低但SLA难保证)\n\n"
         "核心KPI：MTTD(Mean Time to Detect)<15分钟、MTTR(Mean Time to Respond)<30分钟(严重)、MTTContain<1小时、告警误报率<30%、告警自动化处理率>40%\n\n"
         "面试加分：提到SOC最大成本是人(70%+)，分析师培训/降低流失率/告警疲劳管理这些软性问题SOC Manager非常关注"),
    ],
    [
        "说SOC就是看SIEM屏幕——核心价值在于快速发现+准确研判+高效响应，描述MTTD/MTTR优化经验更有说服力",
        "没有讲人的因素——分析师培训/降低流失/告警疲劳管理这些软性问题SOC Manager非常关注",
        "把SOAR当万能药——能自动化已知流程但遇到0day仍需人判断"
    ],
    ["搭建ELK/Security Onion→接入Sysmon日志→写3条告警规则", "为暴力破解告警编写SOAR Playbook伪代码：发现→确认→响应→通知", "了解MITRE ATT&CK框架的Tactics/Techniques/Sub-techniques层次结构"]
)

add("basic", "day-26.md", "Day 26：安全态势感知",
    "[态势感知面试核心] 态势感知三要素/UEBA/攻击路径分析/平台架构评估",
    [
        ("态势感知平台的核心架构是怎样的？",
         "分层架构4层：\n"
         "**L1-数据采集层**：Agent/Log Forwarder/Syslog→Kafka消息队列→支撑日均TB级吞吐\n"
         "**L2-数据处理层**：Flink/Spark Streaming实时流处理→日志范式化(ECS/CEF)→富化(威胁情报/资产/GEO IP)\n"
         "**L3-分析引擎层**：规则引擎(关联分析A→B→C序列)、ML引擎(异常检测/聚类)、图引擎(攻击路径/团伙分析)\n"
         "**L4-展示层**：安全大屏(拓扑/攻击实时)、告警工作台(处置流程)、报告系统(周报/月度态势)\n\n"
         "面试亮点：能提到全流量(NTA/NPM)对态势感知的重要性——日志告诉你发生了什么，全流量告诉你怎么发生的。NTA+EDR+日志三源关联是最佳实践"),

        ("描述UEBA的工作原理和实际落地案例",
         "UEBA四步法：\n"
         "1. 数据摄入：VPN日志+AD域日志+Proxy/DLP日志+邮件审计→归一化\n"
         "2. 实体画像(Entity Profiling)：为每个用户/设备建立特征向量(常用时段/IP段/应用/数据传输量均值)→按天/周更新\n"
         "3. 基线建模(Baselining)：用绝对中位差MAD或Isolation Forest→计算每个行为的Anomaly Score\n"
         "4. 风险评分+告警：Anomaly Score超阈值→Peer Group对比(同部门同角色是否有类似行为)→区分真正异常和公司政策变化\n\n"
         "实际案例——内部数据泄露：研发工程师平时12:00-0:00办公→某周五凌晨3:00登VPN→从GitLab大量clone→压缩后上传个人云盘。UEBA在行为偏离+数据外传双维度触发告警，2小时内阻止。这个案例面试时能把UEBA说得很具体"),

        ("谈谈攻击路径图(Attack Graph)的生成和防御价值",
         "攻击路径图用图论模拟攻击者在网络中的移动路径。\n"
         "生成方式：输入网络拓扑(子网/防火墙规则)、资产漏洞(CVE扫描)、访问关系(AD组成员/VPN权限)→从每个入口(Web/DMZ)出发→基于漏洞前置条件做BFS/DFS→找到到达核心资产(域控/DB)的最短路径\n"
         "工具：BloodHound(AD域)、AttackIQ/Safebreach(商用BAS)\n\n"
         "防御价值：不是修补所有漏洞，而是修补Choke Point——多条攻击路径汇聚的关键节点/账号→优先加固。如跳板机同时能访问DMZ和内网→这就是Choke Point\n\n"
         "面试举例：用BloodHound分析发现Helpdesk账号同时是多个服务器的Local Admin→收回不必要权限→攻击路径有效长度增加3跳"),

        ("如何评估态势感知平台是否好用？",
         "五维指标：\n"
         "1. 告警质量：高价值告警/总告警<5%说明噪声大\n"
         "2. 威胁覆盖率：用Valkyrie/Red Canary原子测试50种攻击手法→检出率>70%算可用\n"
         "3. 响应时效：攻击发生到平台告警延迟<1小时\n"
         "4. 运维成本：规则维护<20人时/周算正常\n"
         "5. 可扩展性：能否不深度开发就接入新数据源→应有标准化Parser SDK"),

        ("为什么态势感知容易变成面子工程？如何避免？",
         "很多SA平台大屏炫酷(3D地图+攻击动画)但分析价值低(告警泛滥+规则老旧)。根因是重建设轻运营。\n"
         "避免方案：①建设中立即可用——第一天上线告警存量不超过20条(从最重要告警开始) ②运营KPI——每月必须有威胁狩猎报告+告警质量分析 ③平台团队和运营团队分开→闭环改进"),
    ],
    [
        "态势感知可视化和分析混淆——3D大屏不等于分析能力强，真正价值在于关联分析准确性和攻击链还原完整性",
        "说态势感知能防一切——它基于已知推断未知，不能替代防火墙/WAF/EDR等硬防御",
        "UEBA冷启动问题——新系统上线1-2周内无基线不会有有效告警，面试提到说明你真做过"
    ],
    ["用BloodHound分析AD域攻击路径→识别5个关键Choke Point", "用Kibana创建攻击链还原Dashboard：攻击IP→时间线→受影响资产→MITRE映射", "阅读Gartner SIEM/态势感知Magic Quadrant→总结3个行业趋势"]
)

# ================================================================
# DEFENSE 模块
# ================================================================

defense_qas = {
    "day-7.md": [
        ("WAF的核心检测技术有哪些？如何绕过WAF？",
         "WAF四代检测技术：①正则/黑名单(初代，易绕过) ②语义分析(语法树解析SQL/XSS) ③机器学习模型(历史行为建模) ④RASP(运行时应用自保护，嵌入应用内部)\n\n"
         "常见绕过：编码混淆(HTML实体/URL/Unicode混用)、大小写变换(<sCrIpT>)、协议变换(jAvAsCrIpT:)、利用WAF白名单域名重定向、HTTP参数污染(HPP)、分块传输(chunked encoding乱序)、HTTP走私(前后端解析不一致)、用JSON替代Form提交\n\n"
         "面试金句：WAF是纵深防御的一层，不是银弹。能从绕过角度分析说明你理解战斗的全貌"),

        ("什么是RASP(Runtime Application Self-Protection)？和传统WAF有什么不同？",
         "RASP是嵌入应用内部的Agent(如Java Agent/JVM TI)，在运行时拦截每个API调用(I/O/网络/SQL/命令执行)，监控上下文而非流量。\n\n"
         "WAF vs RASP：WAF看HTTP流量包，RASP看应用内部执行；WAF无法感知加密后的攻击，RASP在解密后拦截；WAF可能误报，RASP有应用上下文判断更精准；但RASP对性能有影响(每API调用都要检查)且如果Agent被卸载则防护全失"),

        ("SQL注入的WAF绕过技巧有哪些？",
         "经典绕过手法：①注释截断(`/**/`代替空格) ②大小写混用(`UnIoN SeLeCt`) ③双写(`UNIunionON`) ④内联注释(`/*!50000union*/`) ⑤等价函数替换(locate代替instr) ⑥宽字节注入(GBK编码中%df%27吃掉转义符) ⑦HTTP参数分割 ⑧分块传输+hex编码\n\n"
         "面试强调：绕过不是目的，理解WAF的检测逻辑——基于正则的WAF容易绕过，基于语义的WAF需要构造逻辑正确的但形式异常的语句"),

        ("请描述Webshell检测的方法论",
         "静态检测：特征码匹配(如常见webshell函数eval/assert/system)、文件哈希黑名单、文件创建时间异常、扩展名与内容不匹配(.jpg文件含<?php)\n"
         "动态检测：进程行为(Web进程fork了bash/perl/python子进程)、网络连接(Web进程对外发起TCP连接→反弹shell信号)、文件完整性监控(tripwire/inotify监控Web目录变更)\n"
         "日志检测：Web访问日志中POST请求比例异常、单一URI被反复访问、User-Agent异常(webshell客户端)\n"
         "高级：基于ML的PHP/ASP/JSP AST语法树分析→区分正常代码和webshell的语义差异"),
    ],
    "day-8.md": [
        ("邮件安全的三驾马车SPF/DKIM/DMARC分别解决什么问题？",
         "SPF(Sender Policy Framework)：DNS TXT记录声明哪些IP可以代表你的域名发邮件→收件方验证来源IP→解决发信人伪造。如`v=spf1 ip4:192.0.2.0/24 include:_spf.google.com ~all`\n"
         "DKIM(DomainKeys Identified Mail)：用私钥给邮件签名→收件方用DNS公钥验证签名→确保邮件内容未被篡改\n"
         "DMARC(Domain-based Message Authentication)：告诉收件方SPF和DKIM都失败时怎么处理(reject/quarantine/none)→并接收聚合报告→形成闭环\n\n"
         "面试加分：SPF的~all(软拒绝)和-all(硬拒绝)的区别——~all只是标记但不拒绝。-all才能真正防伪造但可能误伤正常转发。三者缺一不可"),

        ("钓鱼邮件攻击有哪些常见类型？如何防御？",
         "钓鱼类型：①凭证钓鱼(假登录页面→窃取密码+MFA code实时转发) ②恶意附件(Office宏/PDF JS/ISO镜像绕过Mark-of-the-Web) ③鱼叉式钓鱼(定向攻击，精心构造社交工程) ④Business Email Compromise(冒充CEO/CFO要求转账) ⑤QR码钓鱼(Quishing→诱导扫码到钓鱼站)\n\n"
         "防御方案：SPF/DKIM/DMARC防止域名伪造、邮件网关(Proofpoint/Mimecast)沙箱引爆、URL重写+点击时实时检测、DMARC报告监控、安全意识培训+钓鱼演练(KnowBe4)、MFA+Security Key(U2F)防凭证窃取"),

        ("反向代理钓鱼(Evilginx/Modlishka)如何绕过MFA？怎么防？",
         "原理：攻击者在用户和目标网站之间做中间人→用户在真实网站登录(包括MFA验证)→代理捕获Session Cookie→用Cookie冒充用户绕过MFA\n\n"
         "防御：①FIDO2/WebAuthn Security Key→绑定了域名的凭证不会跨域传递(代理的域名是evil.com不是google.com) ②检测TLS证书不一致 ③浏览器安全策略(浏览器应显示钓鱼域而非真实域) ④用户教育——不要点击邮件中的链接、检查浏览器地址栏"),

        ("企业邮件安全架构应该怎么设计？",
         "四层邮件安全：\n"
         "L1-边界过滤：SPF/DKIM/DMARC验证发件方→灰名单Greylisting→黑名单RBL→反病毒引擎\n"
         "L2-内容分析：沙箱引爆(附件深度分析)→URL重写+实时检测→自然语言处理检测BEC邮件\n"
         "L3-内部监控：异常邮件规则(大量外发/深夜发信/CEO名字冒充)→DLP数据防泄露→邮件审计归档\n"
         "L4-用户端：Phish Alert Button一键上报→安全意识培训→模拟钓鱼演练→MFA+Security Key"),
    ],
    "day-9.md": [
        ("DLP(Data Loss Prevention)的核心技术有哪些？",
         "DLP三种部署形态：网络DLP(监控邮件/Web/FTP流量)和终端DLP(Agent监控文件操作/USB/剪贴板)和存储DLP(扫描SharePoint/S3/文件服务器中的敏感数据)\n\n"
         "检测技术：①精确匹配(如身份证号正则\\d{17}[\\dXx]) ②指纹匹配(对已知敏感文件做哈希指纹→检测是否被外泄) ③关键词/字典匹配 ④统计方法(检测异常大量数据传输) ⑤机器学习(NLP分类→识别合同/身份证/PII文档)\n\n"
         "面试亮点：DLP最大的挑战不是技术而是——你要告诉一个销售他不能把客户名单发到自己的Gmail，业务阻力是DLP落地的最大障碍"),

        ("数据分类分级的实操流程是什么？",
         "DSMM(数据安全能力成熟度模型)中数据分类分级是第一步：\n"
         "1. 资产盘点：梳理所有系统/数据库/文件服务器中的数据资产\n"
         "2. 分类：按业务属性→客户数据/员工数据/财务数据/知识产权/经营数据\n"
         "3. 分级：按安全属性→核心数据/重要数据/一般数据+按法规(个人信息/敏感个人信息/重要数据)\n"
         "4. 标签化：在数据资产目录中打标签→与DLP/加密/访问控制策略联动\n"
         "5. 持续运营：新业务上线同步完成分类分级→定期复审"),

        ("数据脱敏的几种方式及其应用场景",
         "静态脱敏：ETL时将数据永久变换→如开发/测试环境(永远不需要真实数据)。方法：替换(生成假数据)、混淆(数字加减随机偏移)、加密(可逆但密钥需保护)\n"
         "动态脱敏：查询时根据用户角色实时返回不同粒度→如客服看到138****5678，风控看到完整手机号\n"
         "格式保留加密(FPE)：加密后保持格式一致→如身份证号加密后仍为18位。数据可用(用于关联查询)但不可读(除非有密钥)\n"
         "Tokenization：敏感数据替换为Token→原始数据存在金库(Vault)→业务用Token操作。广泛应用在PCI DSS支付领域中的信用卡号处理"),

        ("GDPR、个人信息保护法、数据安全法三者的比较",
         "GDPR(欧盟2018)：核心原则——合法性+知情同意+目的限制+数据最小化。适用所有处理欧盟居民数据的组织。罚款：全球年营收4%或2000万欧元\n"
         "个人信息保护法(中国2021)：借鉴GDPR但更强——敏感个人信息单独同意+自动化决策可拒绝+个人信息跨境提供有安全评估要求。罚款：上一年度营业额5%\n"
         "数据安全法(中国2021)：关注所有数据(不限于个人信息)——数据分类分级+重要数据/核心数据特别保护+数据安全审查+数据出口管制\n\n"
         "面试时能横向比较三者说明有国际化视野"),
    ],
}

for dayfile, qa_list in defense_qas.items():
    title_map = {
        "day-7.md": "Day 7：Web应用安全防护",
        "day-8.md": "Day 8：邮件安全与反钓鱼",
        "day-9.md": "Day 9：数据安全与DLP",
    }
    sub_map = {
        "day-7.md": "[Web安全面试核心] WAF工作原理/绕过技巧/RASP/Webshell检测",
        "day-8.md": "[邮件安全面试核心] SPF/DKIM/DMARC/钓鱼攻击/钓鱼代理/邮件安全架构",
        "day-9.md": "[数据安全面试核心] DLP技术/数据分类分级/脱敏/FPE/法规比较",
    }
    traps_map = {
        "day-7.md": [
            "说WAF已经过时——RASP/WAAP(Web应用和API保护)是演进方向但WAF仍是基础层",
            "WAF绕过不是目的——面试官想看的是你理解WAF局限性的深度，列举绕过手法后要接上防御建议",
            "Webshell检测只依赖特征码——现代webshell(AntSword/冰蝎/哥斯拉)使用加密流量和内存执行，特征码基本无效"
        ],
        "day-8.md": [
            "SPF的~all和-all混淆——~all不拒绝只标记，大部分企业用~all避免误伤",
            "认为DMARC开了就万事大吉——p=none等于没开(只报告不拒绝)，p=reject才真正防止伪造",
            "忘了邮件安全的用户端——再好的网关也挡不住用户点击，安全意识培训+钓鱼演练是必须项"
        ],
        "day-9.md": [
            "数据分类分级的纸上谈兵——只会讲概念不谈落地困难(业务部门不配合/历史数据量大/分级标准争议大)暴露经验不足",
            "把Tokenization和加密混为一谈——Token无数学关系(生成随机字符串)，加密是可逆的数学变换",
            "GDPR只适用于欧洲公司——它适用于任何处理欧盟居民数据的组织，不管你在哪里"
        ],
    }
    checks_map = {
        "day-7.md": ["用ModSecurity配置自定义WAF规则→测试SQL注入/XSS防护", "尝试用分块传输绕过本地WAF", "用Burp的WAF Bypass插件测试绕过方法"],
        "day-8.md": ["检查你域名的SPF/DKIM/DMARC配置→用mxtoolbox.com验证", "用swaks发送伪造邮件测试SPF状态", "部署GoPhish做一次内部钓鱼演练"],
        "day-9.md": ["用开源DLP工具(MyDLP/OpenDLP)扫描测试环境中的敏感文件", "为一个模拟公司制定数据分类分级标准草案", "对比GDPR/个保法(个人信息保护法)的关键条款差异"],
    }
    add("defense", dayfile, title_map[dayfile], sub_map[dayfile], qa_list, traps_map[dayfile], checks_map[dayfile])

# ================================================================
# AI 模块（day-3~day-10）
# ================================================================
ai_early_qas = {
    "day-3.md": [
        ("TCP三次握手和四次挥手的详细过程，在安全面试中有什么考点？",
         "三次握手：Client→SYN→Server→SYN+ACK→Client→ACK。面试常考：①SYN Flood攻击利用的就是只发SYN不完成握手→耗尽半连接队列→backlog参数(默认值/net.core.somaxconn) ②TCP序列号预测→如果ISN可预测→伪造TCP连接→CVE-2001-0168(Mitnick攻击Kevin Mitnick的最经典案例)\n\n"
         "四次挥手：Active→FIN→Passive→ACK→Passive→FIN→Active→ACK。考点：①TIME_WAIT状态持续2MSL→端口耗尽攻击 ②RST攻击→伪造RST包中断合法连接→需要序列号在窗口内\n\n"
         "面试金句：理解TCP状态机让你在分析网络攻击时有底层视角——SYN Flood看半连接队列、RST攻击看序列号窗口、会话劫持看序列号可预测性"),

        ("TCP三次握手和四次挥手的详细过程，在安全面试中有什么考点？",
         "请参考上题。额外考点：TCP Fast Open(TFO)允许在SYN包中携带数据→攻击者可在SYN中注入恶意数据绕过NGFW检测(NGFW通常看到SYN-ACK后才开始检查)。TCP的各种Option字段(MSS/Window Scale/Timestamp)在Nmap OS指纹识别中被广泛利用"),

        ("IP分片在网络安全中的利用方式",
         "IP分片(fragmentation)用于绕过防火墙和IDS：\n"
         "1. Tiny Fragment Attack：将TCP头拆分到不同片→防火墙只看到第一个片的IP头而TCP端口在第二片→绕过端口过滤\n"
         "2. Fragmentation Overlap：第二片和第一片的偏移重叠→不同操作系统的重组策略不同(Windows用先来/NT用后来/Linux用新)→可能导致IDS看到的内容和目标机重组后的内容不一致\n"
         "3. Teardrop攻击：构造重叠偏移→老系统内核重组时崩溃\n\n"
         "防御：NGFW应该做IP分片重组(Reassembly)后再检测→但内存开销大。hping3 --frag可测试分片绕过效果"),

        ("ICMP协议有哪些安全利用？",
         "ICMP不仅仅用于ping！安全利用：①ICMP隧道——将数据编码在ICMP Echo载荷中→绕过仅检查TCP/UDP的防火墙。工具：ptunnel/icmpsh ②Smurf攻击——向广播地址发送ICMP Echo Request→源IP伪造为目标IP→目标被全网回复淹没 ③ICMP Redirect——伪造Redirect消息改变目标路由表→中间人\n\n"
         "防御：边界防火墙限制入站ICMP仅允许Echo Reply和Destination Unreachable；内网交换机禁用ICMP Redirect；IDS/NetFlow监控异常ICMP流量(如大量ICMP Tunnel数据)"),
    ],
    "day-4.md": [
        ("HTTPS的TLS握手完整过程和安全考点",
         "TLS 1.3握手(RTT减少为1次)：ClientHello(支持的密码套件+客户端随机数+DH公钥)→ServerHello(选定的套件+服务器随机数+DH公钥+证书+Finished)→Client Finished→开始加密传输\n\n"
         "安全面试考点：①证书链验证——根CA→中间CA→服务器证书→任何一环被攻破整个链崩溃 ②Heartbleed(CVE-2014-0160)——TLS心跳扩展漏洞，读取服务器内存(含私钥) ③降级攻击——强制降为弱密码套件(RC4/DES)→POODLE攻击迫使服务器从TLS降为SSLv3 ④中间人——如果客户端不验证证书(如忽略证书错误的APP/API调用)→Burp/Fiddler可直接解密HTTPS"),

        ("HTTP安全头(CSP/HSTS/X-Frame-Options等)的作用和配置要点",
         "CSP(Content-Security-Policy)：限制页面资源来源→`default-src 'self'; script-src 'self' 'nonce-{rnd}'`。最强配置用nonce+strict-dynamic\n"
         "HSTS(Strict-Transport-Security)：强制浏览器只用HTTPS→`max-age=31536000; includeSubDomains; preload`。一旦preload→浏览器内置列表中，HTTP永不访问。但首次访问(TOFU)仍有风险\n"
         "X-Frame-Options：防止点击劫持→DENY/SAMEORIGIN。CSP的frame-ancestors更强大可替代\n"
         "X-Content-Type-Options: nosniff：防止MIME类型嗅探→攻击者上传含JS的图片文件\n"
         "Referrer-Policy：控制Referer头泄露→strict-origin-when-cross-origin(仅同站发送完整URL)\n\n"
         "面试亮点：用securityheaders.com扫描目标展示安全头质量"),

        ("HTTP请求走私(Request Smuggling)的原理和利用",
         "原理：前端代理(nginx/HAProxy)和后端服务器对Content-Length和Transfer-Encoding的解析差异→攻击者发送一个被前端和前一个请求合并、后端当作两个请求的HTTP包→第二个请求走私进入下一个用户的请求位置。\n\n"
         "类型：CL.TE(前端看Content-Length，后端看Transfer-Encoding→前端说请求体长X，后端看到chunked截断到0\\r\\n→剩余部分成为下个请求)。TE.CL和TE.TE类似思路\n\n"
         "利用：①Cache Poisoning→走私请求被后端当作正常请求缓存→其他用户拿到被篡改的内容 ②WAF绕过→走私请求绕过了WAF检查 ③Session劫持→走私请求偷取其他用户的Cookie\n\n"
         "防御：前后端使用相同方式解析(统一用HTTP/2禁用chunked)、WAF/firewall做请求规范性检查"),

        ("HTTP/2和HTTP/3(QUIC)带来的安全变化",
         "HTTP/2：多路复用(一个TCP连接多个Stream)→HTTP/1.1的请求排队问题解决了但也带来了新攻击面——HPACK压缩导致的头部压缩信息泄露(CRIME攻击变种)\n"
         "HTTP/3(QUIC)：基于UDP而非TCP→加密在传输协议内置(不像TLS跑在TCP之上)→0-RTT恢复连接(重连时在第一个包就发数据)→0-RTT重放风险(攻击者可重放0-RTT数据→服务端需保证幂等)\n\n"
         "面试加分：HTTP/3的普及意味着DDoS防御不能再只靠SYN Cookie(TCP层防御失效)，需要在UDP层做流量清洗"),
    ],
}

for dayfile, qa_list in ai_early_qas.items():
    title_map = {
        "day-3.md": "Day 3：TCP/IP协议栈深挖",
        "day-4.md": "Day 4：HTTP/HTTPS深入与安全",
    }
    sub_map = {
        "day-3.md": "[网络协议面试核心] TCP状态机/三次握手四挥手/IP分片绕过/ICMP隧道",
        "day-4.md": "[Web协议面试核心] TLS握手/HTTP安全头/请求走私/HTTP3安全",
    }
    traps_map = {
        "day-3.md": ["TCP的三次握手是基本题，一定要能默画状态图——面试官可能追问SYN Cookie和SYN Proxy的区别", "IP分片攻击虽老但防火墙绕过测试中仍有效", "ICMP不只是ping——ICMP隧道和Redirect是面试加分点"],
        "day-4.md": ["TLS版本号做假——TLS 1.3在ClientHello中Version字段仍写TLS 1.2以兼容→用supported_versions扩展声明真正的1.3", "HSTS preload一旦提交很难移除——你的域名需要先确认长期只用HTTPS", "HTTP请求走私常常是CTF考点，企业面试问得少但理解它体现HTTP协议功底深"],
    }
    checks_map = {
        "day-3.md": ["用Wireshark抓取TCP三次握手→分析SEQ/ACK序号和窗口大小", "用hping3构造SYN Flood→用netstat观察半连接队列变化", "用ptunnel搭建ICMP隧道→测试绕过防火墙"],
        "day-4.md": ["用openssl s_client分析目标网站TLS握手详情", "用securityheaders.com检查你的网站安全头评分", "在Burp里手动构造一个HTTP请求走私Payload(CL.TE型)"],
    }
    add("ai", dayfile, title_map[dayfile], sub_map[dayfile], qa_list, traps_map[dayfile], checks_map[dayfile])

# ================================================================
# AI 模块 day-5
# ================================================================
add("ai", "day-5.md", "Day 5：DNS安全深层分析",
    "[DNS安全面试核心] DNS协议安全/DNS隧道/DNSSEC/DNS劫持/域名安全",
    [
        ("DNS隧道(DNS Tunneling)的原理、利用和检测",
         "原理：将TCP/UDP数据编码在DNS查询/响应中。客户端编码数据→发起DNS TXT/MX/CNAME查询→DNS隧道服务器(权威DNS)解码数据→上网代理→返回响应编码为DNS响应。工具：iodine/dnscat2。\n\n"
         "为什么有效：DNS通常不被防火墙严格检查(很多企业出口放行UDP 53端口)。数据隐藏在合法的DNS流量中\n\n"
         "检测方法：①DNS查询频率异常(正常用户不会每秒发几十次DNS查询) ②查询域名长度异常(正常域名短，隧道域名长)→统计FQDN平均长度>50字符 ③查询类型异常(正常多为A/AAAA，隧道多TXT/MX/CNAME) ④DNS熵值分析→隧道用base32/hex编码→字符分布均匀(高熵)"),

        ("DNSSEC解决了什么问题？为什么推广这么慢？",
         "DNSSEC通过数字签名确保DNS响应的完整性和真实性——防止DNS缓存投毒。工作方式：DNS记录用区域私钥签名→递归DNS用DS记录中的公钥验证。信任链从根域(.root)向下逐级签名。\n\n"
         "推广慢的原因：①配置复杂——密钥管理(KSK/ZSK)、签名过期自动轮换 ②放大攻击——DNSSEC响应包远大于请求(ANY查询可放大50x)→被利用做DDoS ③不完全加密——DNSSEC只签名不加密→DNS查询内容仍明文可见(DoH/DoT解决加密) ④域名注册商支持不足"),

        ("DNS劫持的多种形式和防御",
         "形式：①本地Hosts文件劫持(恶意软件修改) ②路由器DNS劫持(篡改DHCP下发的DNS) ③DNS缓存投毒(Kaminsky攻击—伪造DNS响应塞入递归DNS缓存) ④注册商/域名劫持(社工/漏洞窃取域名管理权) ⑤BGP劫持(劫持IP前缀→DNS服务器运维团队的告配置错误)\n\n"
         "防御：DNSSEC防止缓存投毒、DoH/DoT防止本地网络劫持、域名注册商开启WHOIS隐私+域名锁(Transfer Lock)+双因素认证、监控DNS记录变更(用DNSTwist等发现伪造)"),

        ("DoH(DNS over HTTPS)和DoT(DNS over TLS)的对比和安全影响",
         "DoH：DNS查询伪装成HTTPS→端口443→和Web流量完全混合→防火墙无法区分DNS和Web。隐私好(运营商看不见DNS请求)但安全运维变难(内部DNS监控失效)\n"
         "DoT：DNS查询走TLS→专用端口853→企业可针对性监控/过滤。隐私弱于DoH(端口分流可见)但安全运维更可控\n\n"
         "安全影响：企业正面临安全与隐私的权衡——DoH让传统DNS监控系统失明，需要从端点(EDR/浏览器策略)做DNS安全"),
    ],
    ["DNS隧道不是只在CTF中有用——真实APT组织(OilRig/APT29)大量使用DNS隧道做C2", "DNSSEC的加密≠DoH的加密——DNSSEC是完整性签名，DoH是传输加密", "DoH在Chrome/Firefox的默认开启意味着很多企业员工已经在绕开公司DNS过滤——这是安全团队普遍低估的问题"],
    ["用iodine/dnscat2搭建DNS隧道→Wireshark抓包分析特征", "用dig +dnssec查询一个开启DNSSEC的域名→分析RRSIG记录", "用DNSTwist生成域名的typosquatting候选列表"]
)

# ================================================================
# AI 模块 day-8,9,10
# ================================================================
ai_data_days = {
    "day-8.md": {
        "title": "Day 8：NumPy安全数据处理",
        "subtitle": "[安全数据处理面试核心] NumPy高效数值计算/安全日志分析/特征提取",
        "qas": [
            ("用NumPy做安全日志分析的实战例子",
             "安全日志分析中NumPy的超能力在于向量化操作：无需Python for循环，直接对整个数组做运算→速度提升100x+。\n\n"
             "实战一：批量IP地址转换→`np.array([ip_to_int(ip) for ip in ips], dtype=np.uint32)`→所有IP在数组中，做范围比较(判断是否属于某网段)只需一行\n\n"
             "实战二：时间序列异常检测→登录事件时间戳→`diffs = np.diff(timestamps)`→相邻事件时间间隔→`np.percentile(diffs, [1, 99])`→找出极端异常的时间窗口(暴力破解通常间隔短)\n\n"
             "实战三：特征向量化→流量大小/包数/端口数组成特征矩阵→用NumPy的`np.mean/var/corrcoef`快速计算统计特征→输入ML模型\n\n"
             "面试说这个体现你理解安全数据处理和通用工具的关系"),

            ("NumPy的vectorization在安全数据处理中为什么重要？",
             "安全数据量大(可能每天亿级事件)→纯Python循环处理太慢→NumPy的C底层向量化操作直接把整个数组交给BLAS/LAPACK库→充分发挥CPU SIMD指令。\n"
             "典型场景：对1000万个网络事件按端口分组→pandas DataFrame→`df.groupby('port').size()`底层就是NumPy的`np.unique(ports, return_counts=True)`。懂底层原理不是炫技，是优化性能瓶颈时能给出方案"),
        ],
    },
    "day-9.md": {
        "title": "Day 9：Pandas进阶数据处理",
        "subtitle": "[安全数据处理面试核心] Pandas数据清洗/分组聚合/时间序列/告警分析",
        "qas": [
            ("用Pandas做安全告警分析的实际流程",
             "典型分析流程：\n"
             "```python\n"
             "# 1. 加载SIEM告警数据\n"
             "df = pd.read_csv('alerts.csv', parse_dates=['timestamp'])\n"
             "# 2. 按资产分组找Top告警源\n"
             "top_assets = df.groupby('src_ip').size().nlargest(10)\n"
             "# 3. 时间窗口聚合(每小时告警量)\n"
             "hourly = df.set_index('timestamp').resample('1h').size()\n"
             "# 4. 找异常高峰(3 sigma)\n"
             "mean, std = hourly.mean(), hourly.std()\n"
             "anomalies = hourly[abs(hourly - mean) > 3*std]\n"
             "```\n\n"
             "面试亮点：Pandas的resample+rolling是做安全时间序列分析的基础。可以追踪每天某个IP的告警趋势→拐点就是攻击开始或停止的信号"),

            ("Pandas如何做安全日志的关联分析？",
             "多数据源关联：\n"
             "```python\n"
             "# 防火墙日志和AD域日志做关联\n"
             "merged = pd.merge(firewall_logs, ad_logs, \n"
             "                  left_on='src_ip', right_on='client_ip', \n"
             "                  how='inner')\n"
             "# 找出同一用户在防火墙异常后AD也有异常的时间窗口\n"
             "merged['time_diff'] = (merged['fw_time'] - merged['ad_time']).abs()\n"
             "suspicious = merged[merged['time_diff'] < pd.Timedelta('5min')]\n"
             "```\n\n"
             "关联分析在SIEM中是核心能力——Pandas可以作为SIEM的离线分析补充，处理SIEM内置关联引擎做不到的灵活分析"),
        ],
    },
    "day-10.md": {
        "title": "Day 10：时间序列安全数据处理",
        "subtitle": "[时间序列面试核心] 异常检测/趋势分析/季节性分解/滑动窗口",
        "qas": [
            ("时间序列分析在威胁检测中的应用",
             "安全中的时间序列无处不在：每小时登录次数/每分钟DNS查询量/每天恶意IP扫描频次。\n\n"
             "三大检测方法：\n"
             "1. SARIMA/Prophet季节性分解→区分正常周期波动(工作日高峰vs周末低谷)和真正异常\n"
             "2. EWMA(指数加权移动平均)→对近期数据更高权重→快速检测突增(如DDoS开始)\n"
             "3. Isolation Forest在时间维度的滑动窗口应用→找出与其他窗口行为不同的时间窗口\n\n"
             "面试举例：用Prophet建模每日VPN登录量→模型预测正常范围→某天凌晨3点登录量超出3sigma(正常=0)→异常告警"),

            ("什么是季节性分解？在安全场景中为什么重要？",
             "时间序列 = 趋势(Trend) + 季节性(Seasonality) + 残差(Residual)。季节性(Tuesday vs Sunday的不同、发薪日vs平时、圣诞假期vs工作日)如果不分解→会被误当为攻击。\n\n"
             "场景：某金融App每小时交易量有规律的午高峰+夜低谷→如果不用季节性分解→每天午高峰的'异常值'都会触发告警→分析师告警疲劳。用STL分解(LOESS)提纯残差→真正异常是残差中的离群值。\n\n"
             "工具链：statsmodels的seasonal_decompose或Facebook Prophet(自带假日效应处理)"),
        ],
    },
}

for dayfile, info in ai_data_days.items():
    traps = {
        "day-8.md": ["NumPy只是工具——面试时讲清你用它解决了什么安全问题比只会API调用重要", "向量化不是魔法——超大数组仍吃内存，需要分块处理(chunk/block)"],
        "day-9.md": ["Pandas读百万行安全日志内存可能不够用→要了解chunksize分块读和dask/polars替代方案", "resample的closed和label参数容易搞错→面试时当场写错可能减分"],
        "day-10.md": ["时间序列模型不是越复杂越好——很多时候stl分解+3sigma就够用", "安全管理层不关心用了什么算法→关心检测出了什么攻击、阻止了多少损失"],
    }
    checks = {
        "day-8.md": ["用NumPy处理本地auth.log→统计每小时登录失败次数→找异常高峰", "对比Python纯循环和NumPy向量化操作处理100万条日志的性能差异"],
        "day-9.md": ["用Pandas加载SIEM导出的CSV→分组分析Top 10告警源→时间窗口聚合", "用pd.merge做AD日志和VPN日志的关联分析→找5分钟内的同时登出/异地登录"],
        "day-10.md": ["用Prophet对本地Web服务器访问日志做小时级别预测→找异常访问时段", "用STL分解火墙每日流量→分离趋势和季节性→看残差中的异常点"],
    }
    add("ai", dayfile, info["title"], info["subtitle"], info["qas"], traps[dayfile], checks[dayfile])

# ================================================================
# HW 模块
# ================================================================
hw_qas = {
    "day-9.md": [
        ("基线检查(Baseline Check)的核心内容是什么？",
         "安全基线是安全配置的最低标准。CIS(Center for Internet Security) Baseline是最广泛的标准。\n\n"
         "操作系统基线：密码策略(复杂度/长度/有效期)、账户策略(锁定阈值/Guest禁用)、审计策略、服务管理(禁用不必要的服务)、文件系统权限(/etc/shadow 000权限)\n"
         "网络设备基线：SNMP Community String非默认(不为public/private)、Telnet禁用→用SSH、Banner不泄露版本信息、ACL精确配置\n"
         "数据库基线：默认账户锁定/删除(如MySQL的test库和匿名用户)、审计日志开启、加密传输强制、密码存储用哈希不用明文\n\n"
         "工具：CIS-CAT扫描器/Goss(开源)/Lynis/OpenSCAP。面试加分：提到用Ansible/Puppet做自动化基线检查+不合规自动修复"),

        ("如何制定企业的安全基线标准？",
         "四步法：\n"
         "1. 参考业界标准：CIS Benchmark(最全最细)+等级保护要求(合规基线)+STIG(美国国防部标准，军工/政府参考)\n"
         "2. 结合业务场景裁剪：CIS建议的某个配置可能影响业务(如密码90天过期→业务系统每90天要停机维护)→业务团队评审后决定是否放宽\n"
         "3. 分等级执行：核心系统→强制基线100%达标；一般系统→80%达标；测试环境→建议但非强制\n"
         "4. 持续运营：每季度重新扫描→新上系统必须基线检查通过后才能上线→不合规项生成工单跟踪到关闭"),
    ],
    "day-10.md": [
        ("漏洞扫描的原理和主流工具",
         "漏洞扫描器工作原理：①资产发现(ICMP/TCP探测) ②端口扫描(服务识别) ③版本检测(banner/特征匹配) ④漏洞匹配(CVE库映射到检测脚本/NASL) ⑤验证测试(发送专用PoC→看响应是否证明漏洞存在)\n\n"
         "主流工具：Nessus(商业，最广泛)/OpenVAS(开源，Nessus的前身)/Nexpose(Rapid7)/Qualys(云端SaaS)。Web专用：AWVS/AppScan/Burp Scanner\n\n"
         "面试区分：Network Scanner(Nessus/OpenVAS)扫操作系统和网络设备漏洞，Web Scanner(AWVS/Burp)扫Web应用漏洞，两者互补。有经验的面试官会追问扫描调度策略——生产环境什么时候扫描、扫前需要什么审批"),

        ("漏洞扫描的常见误报和如何降低",
         "漏洞扫描误报来源：①版本号匹配(端口Banner显示nginx/1.18但实际已打补丁→扫描器只看版本号) ②环境差异(测试环境的漏洞在生产环境已修复但扫描器不知道) ③配置差异(nginx实际已通过配置修复了CVE但扫描器只检测版本号)\n\n"
         "降低误报的方法：①认证扫描(给扫描器凭据)→检验补丁安装情况而非只猜版本 ②漏洞验证→扫描器不仅要匹配版本还要发送Payload确认漏洞真的存在 ③和业务Owner确认→配置已修补、实际不受影响\n\n"
         "关键：扫描只是发现Potential Issue，不一定每个都要修——安全团队要区分真正的风险和被误报的假风险"),

        ("OWASP Dependency-Check和SCA(软件组成分析)有什么关系？",
         "SCA(Software Composition Analysis)检查你的应用依赖了哪些第三方组件→这些组件是否有已知CVE。OWASP Dependency-Check是最广泛的开源SCA工具(Java/.NET/Python/Node.js都支持)。\n\n"
         "面试考点：①为什么会出Log4Shell(CVE-2021-44228)——就是SCA没做到位，大量企业不知道依赖了有漏洞的Log4j版本 ②SBOM(Software Bill of Materials)→CycloneDX/SPDX标准格式——美国联邦政府已强制供应商提供SBOM ③SCA不只检查直接依赖→还要检查间接依赖(依赖的依赖)→Dependency-Check的这个能力叫transitive dependency分析"),
    ],
}

for dayfile, qa_list in hw_qas.items():
    title_map = {"day-9.md": "Day 9：基线检查与安全加固", "day-10.md": "Day 10：漏洞扫描与验证"}
    sub_map = {"day-9.md": "[基线安全面试核心] CIS Benchmark/安全基线制定/自动化基线扫描", "day-10.md": "[漏洞扫描面试核心] Nessus/OpenVAS/误报处理/SCA/SBOM"}
    traps_map = {
        "day-9.md": ["CIS Benchmark不是照搬就行——有些配置影响业务需要定制", "基线检查只是开始——修复不合规项的难度远大于发现，自动化修复是进阶能力"],
        "day-10.md": ["不要说只跑Nessus就够了——扫描需要适当提前通知业务方(避免误报告警海啸)", "SBOM不只是工程师的事——法务和合规团队也关心第三方组件的开源许可证合规"],
    }
    checks_map = {
        "day-9.md": ["用Lynis对本地Linux做基线检查→分析输出→手工修复3条不合规项", "阅读CIS Benchmark的Linux Level 1配置清单→挑5条你认为最重要的"],
        "day-10.md": ["在靶机环境(MetaSploitable2)用Nessus/OpenVAS做全端口+全漏洞扫描→分析报告", "用OWASP Dependency-Check扫描一个Java/Node项目→看依赖树的CVE"],
    }
    add("hw", dayfile, title_map[dayfile], sub_map[dayfile], qa_list, traps_map[dayfile], checks_map[dayfile])

# ================================================================
# 主程序
# ================================================================
def is_template(content):
    return ('概念一：' in content and '的定义与范围' in content) or ('请简单介绍一下' in content and '背诵式回答' in content)

def main():
    fixed = 0
    for key, data in CONTENT_DB.items():
        module, filename = key.split('/')
        fp = os.path.join(BASE, module, filename)
        if not os.path.exists(fp):
            print(f"SKIP (not found): {key}")
            continue
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
        if not is_template(content):
            print(f"SKIP (already enriched): {key}")
            continue
        md = render_md(data)
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(md)
        fixed += 1
        print(f"FIXED: {key} ({len(md)} chars)")
    print(f"\nTotal fixed: {fixed}")

if __name__ == '__main__':
    main()
