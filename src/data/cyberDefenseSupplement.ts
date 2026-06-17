// 安全防御计划(30天)补充数据 - 每天额外5-7道题目
export interface SupplementDay {
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    correctIndices?: number[];
    explanation: string;
  }[];
}

const supplement: Record<number, SupplementDay> = {

1: { quiz: [
  { question: "SOC的L2分析师(L2 Analyst)主要负责什么？", options: ["A. 告警筛选", "B. 深度事件调查和分析", "C. SOC管理", "D. 设备采购"], correctIndex: 1, explanation: "L2分析师(Tier 2)负责对L1升级的复杂事件进行深度分析和调查，需要更强的技术能力和经验。" },
  { question: "威胁猎人(Threat Hunter)和SOC分析师的根本区别？", options: ["A. 完全相同", "B. 猎人主动搜索未知威胁，分析师主要响应已知告警", "C. 猎人更初级", "D. 分析师不需要技术"], correctIndex: 1, explanation: "威胁狩猎是主动寻找已绕过现有检测的威胁，而SOC分析师主要对SIEM告警做响应处理。" },
  { question: "MSSP(托管安全服务提供商)相比自建SOC的主要优势？", options: ["A. 更贵", "B. 降低建设成本，共享威胁情报和专家资源", "C. 响应更慢", "D. 不适合中小企业"], correctIndex: 1, explanation: "MSSP提供共享的安全基础设施和专家，降低企业自己建设和维护SOC的成本，适合预算有限的组织。" },
  { question: "以下哪个是SOC评估的关键指标(KPI)？", options: ["A. 员工数量", "B. MTTD(平均检测时间)和MTTR(平均响应时间)", "C. 服务器数量", "D. 预算金额"], correctIndex: 1, explanation: "MTTD(Mean Time to Detect)和MTTR(Mean Time to Respond)是衡量SOC效率的核心指标，反映检测和响应的速度。" },
  { question: "SOC中'告警疲劳'(Alert Fatigue)指的是？", options: ["A. 系统过载", "B. 过多误报告警导致分析师忽略真实威胁", "C. 硬件故障", "D. 网络延迟"], correctIndex: 1, explanation: "高误报率的大量告警使分析师疲于处理，可能忽略或漏掉真正的安全事件，是SOC运营的主要挑战。" },
  { question: "以下哪些是SOC的常见职能？（多选）", options: ["A. 安全监控", "B. 事件响应", "C. 威胁情报分析", "D. 漏洞管理"], correctIndex: -1, correctIndices: [0, 1, 2, 3], explanation: "SOC职能涵盖安全监控、事件响应处置、威胁情报运营和漏洞管理等多个方面。" },
] },

2: { quiz: [
  { question: "Windows事件ID 4625代表什么？", options: ["A. 成功登录", "B. 登录失败", "C. 账户创建", "D. 服务启动"], correctIndex: 1, explanation: "Windows事件ID 4625=登录失败。4624=成功登录。监控4625的异常频率可发现暴力破解攻击。" },
  { question: "Linux Syslog中优先级从高到低排序正确的是？", options: ["A. INFO > WARNING > ERROR", "B. EMERG > ALERT > CRIT > ERR > WARNING > NOTICE > INFO > DEBUG", "C. DEBUG > INFO", "D. 没有优先级"], correctIndex: 1, explanation: "Syslog优先级：Emergency(0)最高 → Alert → Critical → Error → Warning → Notice → Info → Debug(7)最低。" },
  { question: "日志集中化的核心价值是？", options: ["A. 节省磁盘空间", "B. 统一搜索、关联分析和长期保存", "C. 减少服务器数量", "D. 加速网络"], correctIndex: 1, explanation: "集中化日志可实现跨设备的关联分析(如登录失败+后续成功=可能的暴力破解成功)，且支持长期审计追溯。" },
  { question: "Syslog使用什么传输层协议？", options: ["A. TCP", "B. UDP(默认514端口，不可靠)\nTLS加密的Syslog是更安全的选择", "C. HTTP", "D. ICMP"], correctIndex: 1, explanation: "Syslog默认使用UDP 514端口(不可靠传输)。Syslog over TLS(TCP 6514)提供加密和可靠传输。" },
  { question: "检测日志篡改的重要措施是？", options: ["A. 删除日志", "B. 日志完整性校验(哈希链)和实时转发到独立日志服务器", "C. 压缩日志", "D. 加密"], correctIndex: 1, explanation: "将日志实时转发到独立的、加固的日志服务器，配合完整性校验(如区块链式哈希链)防止攻击者删除或修改日志。" },
] },

3: { quiz: [
  { question: "ELK中Kibana的主要用途？", options: ["A. 日志采集", "B. 数据可视化和仪表板", "C. 日志存储", "D. 告警引擎"], correctIndex: 1, explanation: "Kibana提供数据可视化(图表/仪表板)、搜索分析和管理的Web界面，连接到Elasticsearch进行交互式数据分析。" },
  { question: "SIEM关联规则中，什么类型的规则可以检测暴力破解？", options: ["A. 单事件规则", "B. 序列规则(阈值+时间窗口)：N次登录失败后M秒内成功登录", "C. 资产规则", "D. 合规规则"], correctIndex: 1, explanation: "序列关联规则检测事件序列：指定时间窗口内同一来源的多次登录失败后出现成功登录，触发暴力破解告警。" },
  { question: "Logstash Pipeline的三个阶段是？", options: ["A. 输入→存储→输出", "B. Input→Filter→Output(输入→过滤/解析→输出)", "C. 读取→写入→关闭", "D. 加密→传输→解密"], correctIndex: 1, explanation: "Logstash Pipeline：Input(接收数据)→Filter(解析/Grok/GeoIP)→Output(发送到Elasticsearch等)。Filter阶段做数据标准化。" },
  { question: "Elasticsearch中用于全文搜索的核心数据结构是？", options: ["A. 关系表", "B. 倒排索引(Inverted Index)", "C. 链表", "D. 哈希表"], correctIndex: 1, explanation: "倒排索引将文档中的词映射到其出现位置，是Elasticsearch实现快速全文搜索的核心数据结构。" },
  { question: "SIEM规则调优最主要的目标是？", options: ["A. 增加规则数量", "B. 减少误报同时保持检测能力", "C. 删除所有规则", "D. 降低性能"], correctIndex: 1, explanation: "SIEM规则调优的黄金目标：降低误报率(减少噪音)同时保持或提高真正威胁的检出率(TPR)。" },
] },

4: { quiz: [
  { question: "Snort规则中'flow:to_server,established'的含义？", options: ["A. 任意方向", "B. 已建立连接且流向服务器方向的流量", "C. 流向客户端", "D. 没有连接"], correctIndex: 1, explanation: "flow限制规则的检测方向：to_server=客户端→服务器，to_client=服务器→客户端，established=TCP已建立连接。" },
  { question: "IDS部署在防火墙之前和之后各有什么优缺点？", options: ["A. 完全相同", "B. 之前看到所有攻击但告警多，之后只看到绕过防火墙的攻击更有价值", "C. 之后什么也看不到", "D. 不需要IDS"], correctIndex: 1, explanation: "防火墙前：看到全部流量含被防火墙拦截的(噪音大)。防火墙后：只看到穿透防火墙的(更有价值但可能错过信息)。" },
  { question: "Snort规则中'classtype'字段的作用？", options: ["A. 无作用", "B. 攻击分类(如web-application-attack、attempted-admin等)", "C. 设置优先级", "D. 指定协议"], correctIndex: 1, explanation: "classtype定义攻击类别，不同类别可关联不同优先级(priority)，便于告警分级和统一管理。" },
  { question: "检测零日攻击(0-day)的最佳IDS部署策略？", options: ["A. 仅基于签名", "B. 结合异常检测和行为分析，不只是依赖签名", "C. 不需要IDS", "D. 关闭IDS"], correctIndex: 1, explanation: "基于签名的规则无法检测未知攻击(0-day)，需要结合异常检测、行为分析、沙箱等补充检测手段。" },
  { question: "以下哪个不是IDS检测方法？", options: ["A. 基于签名(Signature-based)", "B. 基于异常(Anomaly-based)", "C. 基于状态协议分析(Stateful Protocol Analysis)", "D. 基于加密(Encryption-based)"], correctIndex: 3, explanation: "IDS三大检测方法：签名检测(已知威胁)、异常检测(偏离基线)、状态协议分析(协议规格不符)。加密本身不是检测方法。" },
] },

5: { quiz: [
  { question: "UEBA中建立用户行为基线需要什么数据？", options: ["A. 不需要数据", "B. 历史行为数据(登录时间/IP/访问资源/操作频率等)", "C. 密码", "D. 个人信息"], correctIndex: 1, explanation: "UEBA通过收集用户历史行为数据(登录时间地点、访问模式、操作习惯等)建立正常行为基线模型。" },
  { question: "Isolation Forest算法的核心思想是？", options: ["A. 聚合数据", "B. 异常点更容易被随机切割隔离", "C. 分类数据", "D. 聚类"], correctIndex: 1, explanation: "Isolation Forest通过随机选择特征和分割值构建隔离树，异常点(稀少且与正常点不同)在树中更浅的位置被隔离。" },
  { question: "以下哪种行为最可能被UEBA标记为异常？", options: ["A. 工作日9:00登录", "B. 凌晨3:00从境外IP首次登录并大量下载数据", "C. 使用常用浏览器", "D. 发送邮件"], correctIndex: 1, explanation: "异常时间(凌晨3:00)+异常地点(境外IP)+异常行为(大量下载)高度偏离正常基线，UEBA应触发高危告警。" },
  { question: "UEBA中'Peer Group Analysis'是什么？", options: ["A. 与同事对比", "B. 将用户行为与同角色/同部门群体基线对比发现异常", "C. 与历史对比", "D. 随机对比"], correctIndex: 1, explanation: "Peer Group分析将个人行为与同组(同部门/同角色)的正常范围对比，如一个HR下载大量代码文件即异常。" },
] },

6: { quiz: [
  { question: "CVSS 3.x评分中Attack Vector: Network(N)代表什么？", options: ["A. 需要物理接触", "B. 可远程网络利用(最危险)", "C. 需要局域网", "D. 不需要网络"], correctIndex: 1, explanation: "Attack Vector=Network表示漏洞可通过网络远程利用，不需要物理或本地访问，攻击范围最广，评分通常更高。" },
  { question: "安全事件分类中，P1(优先级1)事件的特征是？", options: ["A. 轻微影响", "B. 核心业务中断或重大数据泄露", "C. 低危漏洞", "D. 测试事件"], correctIndex: 1, explanation: "P1/P0为最高级别事件：核心系统中断、重大数据泄露、勒索软件感染等，需要立即响应(15分钟内)。" },
  { question: "安全事件报告应包含的关键要素不包括？", options: ["A. 事件时间线", "B. 影响范围", "C. 处置措施", "D. 员工个人信息"], correctIndex: 3, explanation: "事件报告应包含事件时间线、影响评估、处置过程、根因分析和改进建议，不应包含无关的个人信息。" },
  { question: "NIST事件响应框架的四个阶段？", options: ["A. 准备→发现→报告→结束", "B. 准备→检测分析→遏制根除恢复→事后活动", "C. 扫描→攻击→清理→报告", "D. 只有两个阶段"], correctIndex: 1, explanation: "NIST SP 800-61四阶段：准备(Preparation)→检测与分析→遏制/根除/恢复→事后活动(Post-Incident Activity/Lessons Learned)。" },
  { question: "确定事件优先级的最关键因素是？", options: ["A. 事件名称", "B. 对业务的实际影响和资产价值", "C. 攻击者国籍", "D. 发现时间"], correctIndex: 1, explanation: "事件优先级应基于对业务的实际影响(数据损失/服务中断/合规风险)和保护资产的价值，而非攻击者属性。" },
] },

7: { quiz: [
  { question: "PDCERF应急响应模型中'C'代表什么？", options: ["A. 收集", "B. 抑制/遏制(Containment)", "C. 清理", "D. 加密"], correctIndex: 1, explanation: "Containment(遏制)的目标是限制事件扩散范围，如隔离受影响系统、断开网络连接，防止攻击横向移动。" },
  { question: "'Eradication'(根除)阶段的主要任务？", options: ["A. 恢复备份", "B. 彻底清除恶意代码和后门，修复利用的漏洞", "C. 通知用户", "D. 重新安装系统"], correctIndex: 1, explanation: "根除阶段找出并移除所有攻击痕迹：删除恶意文件、关闭后门、修复漏洞、重置凭证，确保攻击者无法再回来。" },
  { question: "应急响应中'黄金时间'(Golden Hour)指的是？", options: ["A. 工作时间", "B. 事件发生后的最初几小时，关键决策影响整体影响", "C. 黄金时段", "D. 培训时间"], correctIndex: 1, explanation: "安全事件发生后的最初几小时决策最为关键，正确的遏制和取证决策可显著减小损失。" },
  { question: "应急响应演练(Tabletop Exercise)的目的？", options: ["A. 没有用处", "B. 在桌面推演中验证应急计划和团队协作", "C. 实时攻击", "D. 测试防火墙"], correctIndex: 1, explanation: "桌面推演(Tabletop)在无真实压力下讨论和演练应急响应流程，发现计划不足和团队配合问题。" },
  { question: "事件响应文档中'Lessons Learned'(经验教训)的重要性？", options: ["A. 不重要", "B. 复盘总结改进防止同类事件再次发生", "C. 归档即可", "D. 问责"], correctIndex: 1, explanation: "经验教训总结是持续改进的核心：分析根本原因、识别流程缺陷、制定改进措施，防止同类事件再次发生。" },
] },

8: { quiz: [
  { question: "状态检测防火墙(Stateful Firewall)相比包过滤防火墙的优势？", options: ["A. 完全相同", "B. 跟踪连接状态，自动放行返回流量，更智能", "C. 更简单", "D. 速度更慢"], correctIndex: 1, explanation: "状态检测防火墙维护连接状态表，理解TCP握手和连接状态，无需为返回流量单独配置规则，更安全也更方便。" },
  { question: "下一代防火墙(NGFW)集成了什么额外功能？", options: ["A. 仅包过滤", "B. 集成了IPS、应用识别、用户身份感知等", "C. 仅VPN", "D. 仅NAT"], correctIndex: 1, explanation: "NGFW融合了传统防火墙+IPS+应用识别与控制+用户身份识别+威胁情报等，提供更全面的安全防护。" },
  { question: "防火墙的DMZ区域设计原则？", options: ["A. 与内网直接连通", "B. 内外网隔离：Internet→外部防火墙→DMZ→内部防火墙→内网", "C. 不需要防火墙", "D. 放在内网"], correctIndex: 1, explanation: "DMZ通过双防火墙架构实现Internet与内网隔离，即使DMZ服务器被攻破，内部防火墙仍保护内网安全。" },
  { question: "防火墙规则设计遵循什么顺序？", options: ["A. 随机顺序", "B. 从上到下匹配，第一条匹配规则生效", "C. 从下到上", "D. 随机匹配"], correctIndex: 1, explanation: "防火墙规则按从上到下顺序匹配，命中即停止。应将最精确/限制最多的规则放在前面，通用规则放在后面。" },
  { question: "防火墙只能防御来自外部的攻击，无法防御内部威胁。这个说法？", options: ["A. 正确", "B. 不完全正确：防火墙也可做内网分段隔离南北/东西向流量", "C. 取决于品牌", "D. 取决于价格"], correctIndex: 1, explanation: "防火墙不仅可以防护外部(南北向)，现代微隔离(Micro-segmentation)方案也用防火墙实现内网东西向流量的分段隔离。" },
] },

9: { quiz: [
  { question: "WAF的'反向代理'部署模式是如何工作的？", options: ["A. 旁路监听", "B. 客户端→WAF→后端服务器→WAF→客户端(串联代理)", "C. 只记录不拦截", "D. 直接连接"], correctIndex: 1, explanation: "反向代理模式WAF串联在Web服务器前，所有流量必经过WAF检测后再转发，可实时阻断攻击。" },
  { question: "ModSecurity WAF中SecRuleEngine On/Off/DetectionOnly的区别？", options: ["A. 完全相同", "B. On=阻断, Off=关闭, DetectionOnly=只记录不阻断", "C. 只有On和Off", "D. Off仍然阻断"], correctIndex: 1, explanation: "DetectionOnly模式(学习模式)不阻断请求只记录，适合上线初期减少误阻断。On模式匹配规则即阻断。" },
  { question: "WAF规则更新不及时的风险？", options: ["A. 没有风险", "B. 无法防御新出现的Web攻击技术(0day)", "C. 只影响性能", "D. 只影响日志"], correctIndex: 1, explanation: "WAF规则库需要持续更新以覆盖新攻击技术和CVE漏洞利用。过期的规则库存在防护盲区。" },
  { question: "以下哪种攻击WAF最难防御？", options: ["A. 标准SQL注入", "B. 复杂业务逻辑漏洞(如越权/参数篡改)", "C. 已知XSS payload", "D. 目录遍历"], correctIndex: 1, explanation: "WAF擅长检测已知攻击模式(注入/XSS)但对业务逻辑漏洞(越权/流程绕过/参数篡改)检测效果有限，需应用层安全编码。" },
] },

10: { quiz: [
  { question: "IPSec VPN中IKE(Internet Key Exchange)的作用？", options: ["A. 数据传输", "B. 协商和建立安全关联(SA)及密钥交换", "C. 加密数据", "D. 压缩数据"], correctIndex: 1, explanation: "IKE负责VPN隧道的建立：身份认证、协商加密算法和密钥(DH交换)、建立IPSec SA，分为IKEv1和IKEv2。" },
  { question: "SSL VPN和IPSec VPN的主要区别？", options: ["A. 完全相同", "B. SSL VPN基于浏览器/HTTPS更易部署，IPSec需客户端软件", "C. SSL VPN更安全", "D. IPSec已淘汰"], correctIndex: 1, explanation: "SSL VPN通过浏览器HTTPS访问(无客户端)，IPSec需要专用客户端但提供更全面的网络层访问。" },
  { question: "网络微分段(Micro-segmentation)的核心目的？", options: ["A. 加速网络", "B. 精细控制东西向流量，限制攻击横向移动范围", "C. 扩大网络", "D. 减少设备"], correctIndex: 1, explanation: "微分段将数据中心/云环境按应用粒度划分安全区域，精细控制每台VM/容器间的通信，阻止攻击横向扩散。" },
  { question: "零信任网络(ZTNA)的核心理念？", options: ["A. 内网绝对安全", "B. 永不信任，始终验证(Never Trust, Always Verify)", "C. 信任所有设备", "D. 不需要认证"], correctIndex: 1, explanation: "零信任不信任任何网络位置(包括内网)，每次访问都需认证和授权，基于身份和上下文持续验证。" },
] },

11: { quiz: [
  { question: "IDS/IPS规则调优中'Suppression'(抑制)的作用？", options: ["A. 删除规则", "B. 对特定源/目标地址抑制告警(已知的非恶意扫描)", "C. 加速检测", "D. 增加规则"], correctIndex: 1, explanation: "Suppression对确认为非恶意的特定源IP或目标地址产生的告警进行抑制，减少噪音让团队聚焦真实威胁。" },
  { question: "IDS规则'Thresholding'(阈值限制)的用途？", options: ["A. 删除规则", "B. 限制单位时间内触发告警的次数防止告警风暴", "C. 加速", "D. 增加灵敏度"], correctIndex: 1, explanation: "Thresholding限制规则在时间窗口内触发的最大次数，防止大规模扫描产生数千条重复告警(告警风暴)。" },
  { question: "Snort规则中的'priority'值合理范围？", options: ["A. 0-100", "B. 1-4(数字越小优先级越高)", "C. 任意值", "D. 不需要设置"], correctIndex: 1, explanation: "Snort中priority通常1-4：1=High、2=Medium、3=Low、4=Very Low。classtype关联默认priority值。" },
  { question: "新部署IDS时建议的运行模式？", options: ["A. 直接阻断", "B. 先以检测模式(不阻断)运行调优，降低误报后再启用阻断", "C. 随机模式", "D. 关闭所有规则"], correctIndex: 1, explanation: "新IDS初期应在Passive/Alert模式运行1-2周，观察并调优规则(抑制误报、调整阈值)后再启用Inline阻断模式。" },
] },

12: { quiz: [
  { question: "DDoS攻击中SYN Flood的工作原理？", options: ["A. 大流量下载", "B. 大量SYN半连接耗尽服务器连接表(不完成三次握手)", "C. 正常请求", "D. DNS攻击"], correctIndex: 1, explanation: "SYN Flood发送大量SYN包但不响应SYN-ACK(或不发送ACK)，耗尽服务器的半连接队列，导致正常用户无法连接。" },
  { question: "Cloudflare等CDN如何缓解DDoS攻击？", options: ["A. 增加带宽", "B. 分布式全球节点吸收和分散攻击流量", "C. 关闭服务", "D. 修改DNS"], correctIndex: 1, explanation: "CDN利用全球分布的边缘节点网络分散吸收攻击流量，配合Anycast将攻击分流到最近的节点处理。" },
  { question: "DNS Amplification(DNS放大攻击)利用了什么？", options: ["A. DNS解析慢", "B. 伪造源IP发送小查询触发大响应(放大倍数可达50x+)", "C. 修改DNS记录", "D. 删除DNS"], correctIndex: 1, explanation: "攻击者伪造受害者的IP发送DNS查询(小包)，DNS服务器返回大响应(放大)，导致受害带宽被耗尽。" },
  { question: "以下哪个不是DDoS防护策略？", options: ["A. 增加带宽", "B. 等待攻击自行停止(被动)", "C. BGP黑洞路由", "D. CDN流量清洗"], correctIndex: 1, explanation: "等待不会阻止DDoS，需主动防护：流量清洗(Scrubbing)、CDN分散、BGP Blackhole、限速、ACL过滤等。" },
] },

13: { quiz: [
  { question: "DNSSEC的核心安全功能是？", options: ["A. 加速DNS解析", "B. 对DNS响应进行数字签名防止DNS欺骗/缓存投毒", "C. 加密DNS查询", "D. 隐藏DNS查询"], correctIndex: 1, explanation: "DNSSEC使用数字签名验证DNS响应完整性和真实性，防止DNS缓存投毒(Cache Poisoning)和中间人篡改。注意DNSSEC不加密传输。" },
  { question: "DNS over HTTPS(DoH)的安全价值？", options: ["A. 加速解析", "B. 加密DNS查询防止窃听和篡改", "C. 仅用于浏览器", "D. 不影响安全"], correctIndex: 1, explanation: "DoH将DNS查询封装在HTTPS中加密传输，防止中间人窃听和篡改DNS查询内容，同时也带来监控(可见性)挑战。" },
  { question: "DNS劫持(DNS Hijacking)的常见方式不包括？", options: ["A. 修改路由器DNS设置", "B. 正常DNS缓存更新", "C. 恶意软件修改hosts文件", "D. 篡改DNS服务器记录"], correctIndex: 1, explanation: "正常DNS缓存更新是标准操作。DNS劫持手段包括：修改路由器DNS、篡改hosts文件、入侵DNS服务器改记录、中间人攻击等。" },
  { question: "企业DNS安全最佳实践包括？", options: ["A. 使用公共DNS", "B. 部署内部DNS防护、使用DNSSEC、监控DNS查询异常", "C. 不需要", "D. 只用IPv4"], correctIndex: 1, explanation: "企业DNS安全应包括内部DNS防护解析器、启用DNSSEC验证、DNS查询日志监控异常(如DGA域名/Tunneling)、使用DNS防火墙。" },
] },

14: { quiz: [
  { question: "CDN隐藏源站IP的实现方式？", options: ["A. 公网IP", "B. CDN节点反向代理，用户只看到CDN IP不知真实源站", "C. VPN", "D. 不隐藏"], correctIndex: 1, explanation: "CDN作为反向代理，用户请求到达CDN边缘节点，CDN再回源请求内容。用户只知道CDN IP不知道源站真实IP。" },
  { question: "CDN如何防护CC攻击(Challenge Collapsar)？", options: ["A. 增加带宽", "B. JS挑战/验证码、频率限制、行为分析识别非人类请求", "C. 不管", "D. 关闭服务"], correctIndex: 1, explanation: "CDN通过JS Challenge、CAPTCHA验证、Rate Limiting和行为分析区分正常用户和CC攻击Bot，对Bot进行拦截或挑战。" },
  { question: "Anycast网络在抗DDoS中的作用？", options: ["A. 没有作用", "B. 同一IP通告到全球多节点，攻击就近被分散处理", "C. 增加单点故障", "D. 降低性能"], correctIndex: 1, explanation: "Anycast将同一IP地址通告到全球多个数据中心，攻击流量被路由到最近节点，实现天然的负载分散和攻击稀释。" },
  { question: "CDN回源时源站IP泄露的风险？", options: ["A. 没风险", "B. 攻击者可绕过CDN直接攻击源站(DDoS/漏洞利用)", "C. 自动防护", "D. CDN自动处理"], correctIndex: 1, explanation: "源站IP泄露后攻击者可绕过CDN防护直接攻击源站，需确保源站仅接受CDN回源IP的访问并做好源站自身防护。" },
] },

15: { quiz: [
  { question: "Linux最小化安装(Minimal Install)的安全意义？", options: ["A. 节省空间", "B. 减少攻击面：未安装的服务和组件不存在漏洞", "C. 加速启动", "D. 只为了好看"], correctIndex: 1, explanation: "最小化安装只安装必需包，减少不必要的服务和组件的攻击面，遵循最小化原则降低被攻击的风险。" },
  { question: "Linux中SELinux的三种运行模式是？", options: ["A. 开/关", "B. Enforcing(强制)、Permissive(仅记录)、Disabled(禁用)", "C. 只有一种", "D. 仅Ubuntu支持"], correctIndex: 1, explanation: "SELinux三种模式：Enforcing强制实施策略并拒绝违规操作(生产推荐)；Permissive只记录不拒绝(调试用)；Disabled完全关闭。" },
  { question: "Linux中哪些文件应特别保护不被未授权访问？", options: ["A. 普通文本", "B. /etc/passwd、/etc/shadow、SSH私钥、sudoers", "C. /tmp中的临时文件", "D. 日志文件"], correctIndex: 1, explanation: "/etc/shadow(密码哈希)、SSH私钥、/etc/sudoers等文件是权限提升的关键目标，必须严格限制访问权限。" },
  { question: "fail2ban的主要功能？", options: ["A. 备份文件", "B. 监控日志自动封禁异常IP(暴力破解/扫描)", "C. 更新系统", "D. 加速网络"], correctIndex: 1, explanation: "fail2ban监控日志文件(如/var/log/auth.log)中的失败认证，达到阈值后自动调用iptables封禁攻击源IP。" },
  { question: "Linux内核参数安全加固：net.ipv4.tcp_syncookies=1的作用？", options: ["A. 无关紧要", "B. 启用SYN Cookie防护SYN Flood攻击", "C. 加速网络", "D. 修改路由"], correctIndex: 1, explanation: "SYN Cookies使用加密Cookie代替传统的半连接队列，在SYN Flood攻击时不消耗服务器连接资源。" },
] },

16: { quiz: [
  { question: "Active Directory中Domain Admin和Enterprise Admin的区别？", options: ["A. 完全相同", "B. Domain Admin管理单域，Enterprise Admin管理整个林", "C. 后者权限更低", "D. 只有一种"], correctIndex: 1, explanation: "Domain Admin管理所在域的所有计算机，Enterprise Admin可管理整个Active Directory林的所有域(最高权限组)。" },
  { question: "AD安全中，Kerberos Golden Ticket攻击的原理？", options: ["A. 盗取密码", "B. 获取KRBTGT账户哈希后伪造任意权限的TGT票据", "C. 暴力破解", "D. DNS劫持"], correctIndex: 1, explanation: "获取域控的KRBTGT账户NTLM哈希后，攻击者可伪造任意用户(包括域管理员)的TGT票据，实现域完全控制。" },
  { question: "AD中Protected Users组的安全特性？", options: ["A. 没有特殊", "B. 强制Kerberos认证、禁用NTLM、禁用缓存凭据等", "C. 降低安全", "D. 仅用于Guest"], correctIndex: 1, explanation: "Protected Users组禁用NTLM认证(防PtH)、禁用DES/RC4加密、不缓存凭据，有效防御多种凭据窃取攻击。" },
  { question: "检测DCSync攻击(模拟域控复制)的方法？", options: ["A. 无法检测", "B. 监控事件ID 4662(目录服务访问)异常的复制请求", "C. 查看防火墙", "D. 查看网络流量"], correctIndex: 1, explanation: "DCSync攻击使用MS-DRSR协议请求复制域数据(含密码哈希)，监控Event ID 4662配合非域控发起复制请求可检测。" },
  { question: "AD安全基线中，LAPS(Local Admin Password Solution)的作用？", options: ["A. 没有作用", "B. 自动管理并定期轮换每台计算机的本地管理员密码", "C. 加速系统", "D. 监控网络"], correctIndex: 1, explanation: "LAPS自动为域内每台计算机设置唯一且定期变更的本地管理员密码，防止横向移动中利用相同本地管理员密码。" },
] },

17: { quiz: [
  { question: "数据库安全中，参数化查询防SQL注入的核心原理？", options: ["A. 过滤单引号", "B. SQL结构与数据分离，预编译后将参数作为数据而非代码", "C. WAF过滤", "D. 错误隐藏"], correctIndex: 1, explanation: "参数化查询先将SQL语句结构发送给数据库预编译，再单独发送参数值，参数值永远不会被解析为SQL代码。" },
  { question: "数据库加密中，TDE(透明数据加密)保护什么？", options: ["A. 网络传输", "B. 静态数据文件(数据文件和备份文件)", "C. 内存中数据", "D. 应用层"], correctIndex: 1, explanation: "TDE在数据库文件级别加密(数据文件、日志文件、备份文件)，对应用层透明。不保护传输中或内存中的数据。" },
  { question: "数据库审计(Database Audit)应记录哪些操作？", options: ["A. 所有操作", "B. 敏感数据访问、权限变更、DDL操作、异常登录", "C. 仅查询", "D. 仅写入"], correctIndex: 1, explanation: "数据库审计重点：敏感表访问、权限变更(GRANT/REVOKE)、结构变更(DDL)、登录失败、批量数据导出等关键操作。" },
  { question: "最小权限原则在数据库安全中的应用？", options: ["A. 给所有用户管理员权限", "B. 每个账户只授予其完成任务所需的最小权限", "C. 不需要权限", "D. 统一用一个账户"], correctIndex: 1, explanation: "数据库账户遵循最小权限：应用只给CRUD(不建表)、报表只给只读、DBA日常运维不用sa/sysadmin。" },
] },

18: { quiz: [
  { question: "Docker容器安全中，以非root用户运行容器的好处？", options: ["A. 方便", "B. 即使容器被突破攻击者也只获得容器内低权限", "C. 无区别", "D. 自动安全"], correctIndex: 1, explanation: "容器内以非root运行遵循最小权限原则，即使容器被突破攻击者也难以获得root权限进行容器逃逸或影响宿主机。" },
  { question: 'Docker中"--read-only"标志的作用？', options: ["A. 不能启动", "B. 将容器文件系统设为只读，防止攻击者写入恶意文件", "C. 加速容器", "D. 减少内存"], correctIndex: 1, explanation: '--read-only使容器根文件系统只读(需配合tmpfs挂载临时目录)，阻止攻击者在容器内写入Webshell或下载恶意工具。' },
  { question: "容器逃逸(Container Escape)可能利用什么？", options: ["A. 不需要任何漏洞", "B. 内核漏洞、特权模式(--privileged)、挂载Docker Socket等", "C. 网络攻击", "D. 密码破解"], correctIndex: 1, explanation: "容器逃逸常见途径：内核漏洞提权、--privileged特权容器、挂载docker.sock(Docker API访问)、capabilities过度授权等。" },
  { question: "Docker镜像安全扫描工具(如Trivy/Clair)检测什么？", options: ["A. 镜像大小", "B. 镜像中各层包含的已知漏洞(CVE)", "C. 镜像作者", "D. 镜像下载速度"], correctIndex: 1, explanation: "镜像安全扫描器分析镜像各层中的操作系统包和应用依赖，匹配CVE漏洞库，识别存在的已知漏洞并给出修复建议。" },
  { question: "容器安全中'不可变基础设施'(Immutable Infrastructure)理念？", options: ["A. 频繁修改容器", "B. 容器不可被修改，更新时重建新镜像部署替代旧容器", "C. 不更新", "D. 只读所有文件"], correctIndex: 1, explanation: "不应在容器运行中打补丁或修改，而是构建新镜像重新部署。确保每个容器环境一致可追溯，减少配置漂移。" },
] },

19: { quiz: [
  { question: "云安全共享责任模型中，IaaS模式下客户负责什么？", options: ["A. 什么都不负责", "B. 操作系统、应用、数据的安全配置和管理", "C. 物理安全", "D. 网络硬件"], correctIndex: 1, explanation: "IaaS共享责任：云商负责物理/网络/虚拟化安全，客户负责OS以上(应用、数据、访问控制、配置)的安全。" },
  { question: "S3存储桶公开访问的常见安全风险？", options: ["A. 没有风险", "B. 敏感数据被未授权访问/下载", "C. 自动加密", "D. 无法访问"], correctIndex: 1, explanation: "S3/Blob公开访问(Public read)可被任何人访问下载，历史上大量数据泄露事故都源于云存储配置错误。" },
  { question: "云安全中CSPM(云安全态势管理)工具的作用？", options: ["A. 代码开发", "B. 自动检测云配置错误和合规风险(公开存储/过度权限等)", "C. 选择云商", "D. 数据备份"], correctIndex: 1, explanation: "CSPM工具自动扫描云环境配置，检测偏离安全基线的问题：公开存储桶、过度宽松的安全组、未加密资源、未开启日志等。" },
  { question: "云环境中Identity and Access Management(IAM)最佳实践？", options: ["A. 使用root账户日常操作", "B. 最小权限+多因素认证+定期审计+临时凭证", "C. 所有用户统一权限", "D. 不用IAM"], correctIndex: 1, explanation: "IAM最佳实践：最小权限原则、MFA强制启用、定期审计清理未使用权限、使用角色和临时凭证不长期保存AK/SK。" },
] },

20: { quiz: [
  { question: "API安全中，JWT Token应设置什么来防止重放？", options: ["A. 不需要设置", "B. 较短的有效期(exp) + jti(唯一ID防重放)", "C. 永不过期", "D. 只用密码"], correctIndex: 1, explanation: "JWT应设置合理exp(过期时间)限制Token生命周期，使用jti(唯一标识)+服务端黑名单防止Token重放攻击。" },
  { question: "API Rate Limiting(速率限制)的安全作用？", options: ["A. 加快API", "B. 防止暴力破解、爬虫和DDoS攻击", "C. 降低性能", "D. 增加延迟"], correctIndex: 1, explanation: "Rate Limiting限制单位时间API调用次数，可有效缓解暴力破解(密码/Token)、爬虫抓取、API层面的DDoS攻击。" },
  { question: "GraphQL API特有的安全风险？", options: ["A. 与REST相同", "B. 深度嵌套查询导致资源耗尽、内省查询泄露Schema、批量攻击", "C. 无风险", "D. 自动安全"], correctIndex: 1, explanation: "GraphQL的灵活性也带来风险：深层嵌套查询(资源耗尽DOS)、Introspection泄露API结构、Batching导致绕过Rate Limit等。" },
  { question: "API网关在安全中的作用？", options: ["A. 仅路由", "B. 统一认证授权、Rate Limiting、请求验证、日志审计", "C. 后端的替代", "D. 不需要"], correctIndex: 1, explanation: "API网关作为统一入口集中实现认证授权、速率限制、请求/响应验证、日志审计、CORS控制等安全能力。" },
] },

21: { quiz: [
  { question: "SDL中威胁建模(Threat Modeling)的最佳时机？", options: ["A. 编码完成后", "B. 需求分析和架构设计阶段(越早越好)", "C. 测试阶段", "D. 上线后"], correctIndex: 1, explanation: "威胁建模在需求和设计阶段进行(左移原则)，在编码实现前识别潜在威胁并设计防护措施，修复成本最低。" },
  { question: "STRIDE威胁模型中的S代表什么？", options: ["A. 安全", "B. Spoofing(欺骗/冒充身份)", "C. 扫描", "D. 速度"], correctIndex: 1, explanation: "STRIDE: Spoofing(欺骗)、Tampering(篡改)、Repudiation(否认)、Information Disclosure(信息泄露)、DoS、Elevation(权限提升)。" },
  { question: "安全编码中'输入验证'的正确位置？", options: ["A. 只在客户端", "B. 客户端和服务端双重验证，以服务端为准", "C. 只在服务端", "D. 不需要"], correctIndex: 1, explanation: "客户端验证提升体验，服务端验证是安全底线。永远不能只依赖客户端验证，攻击者可绕过所有前端控制。" },
  { question: "DevSecOps中'安全左移'(Shift Left)的核心含义？", options: ["A. 安全团队放左边", "B. 在开发早期(设计/编码阶段)就融入安全", "C. 延迟安全", "D. 不需要安全"], correctIndex: 1, explanation: "安全左移将安全从运维阶段移到开发和设计阶段，在SDLC早期发现和修复安全问题，成本低效果好。" },
] },

22: { quiz: [
  { question: "等保2.0中，安全通用要求分为哪几个层面？", options: ["A. 仅技术", "B. 技术安全和管理安全两大层面", "C. 仅管理", "D. 仅物理"], correctIndex: 1, explanation: "等保通用要求分技术安全(物理/网络/主机/应用/数据)和管理安全(制度/机构/人员/建设/运维)，共十个安全类。" },
  { question: "等保三级'安全计算环境'要求中对哪些对象有要求？", options: ["A. 仅服务器", "B. 服务器、数据库、网络设备、安全设备、应用系统等", "C. 仅网络设备", "D. 仅应用"], correctIndex: 1, explanation: "安全计算环境覆盖所有计算节点：服务器、终端、数据库、网络设备、安全设备、应用系统、数据等，是等保的核心控制点。" },
  { question: "等保三级要求多久做一次等级测评？", options: ["A. 每月", "B. 每年至少一次", "C. 每三年", "D. 不需要"], correctIndex: 1, explanation: "等保三级要求每年至少进行一次等级测评，二级建议每两年一次，四级每半年一次，五级根据特殊要求。" },
  { question: "等保定级三要素不包括？", options: ["A. 信息系统所属类型", "B. 受侵害的客体", "C. 对客体的侵害程度", "D. 系统建设成本"], correctIndex: 3, explanation: "等保定级三要素：①信息系统受到破坏时所侵害的客体(公民/社会/国家)；②对客体造成的侵害程度；③综合确定安全等级。" },
] },

23: { quiz: [
  { question: "等保建设中'安全方案设计'的主要输出文档？", options: ["A. 不需要", "B. 安全技术方案和管理制度体系文件", "C. 购买清单", "D. 网络拓扑"], correctIndex: 1, explanation: "安全方案设计输出包括安全技术方案(技术措施选择与设计)和安全管理制度体系文件，作为后续建设的依据。" },
  { question: "等保安全建设整改的优先级原则？", options: ["A. 随机整改", "B. 先高风险项后低风险项(基于风险评估结果)", "C. 先低风险", "D. 只看价格"], correctIndex: 1, explanation: "应基于差距分析和风险评估结果，优先整改高风险项(易被攻击且影响大的安全问题)，合理分配资源和时间。" },
  { question: "等保项目中'差距分析'(Gap Analysis)的作用？", options: ["A. 没有作用", "B. 评估当前安全状态与等保要求之间的差距", "C. 直接建设", "D. 不做分析"], correctIndex: 1, explanation: "差距分析找出当前安全措施与等保要求之间的不足(Gap)，确定需要新建或改进的安全控制项，是等保建设的起点。" },
] },

24: { quiz: [
  { question: "风险评估方法中'定量分析'和'定性分析'的区别？", options: ["A. 完全相同", "B. 定量用数值(ALE=年损失)，定性用等级(高/中/低)", "C. 定性更精确", "D. 定量更简单"], correctIndex: 1, explanation: "定量风险评估使用具体数值(ALE=SLE×ARO，预计年损失金额)，定性使用描述性等级(高/中/低)评估风险和影响。" },
  { question: "风险计算公式Risk = ？", options: ["A. 资产价值×漏洞", "B. 威胁发生的可能性 × 威胁造成的影响(经典简化)", "C. 只取决于威胁", "D. 只取决于漏洞"], correctIndex: 1, explanation: "风险基本公式：Risk = Likelihood(可能性) × Impact(影响)。更完整：R = f(Asset, Threat, Vulnerability, Controls)。" },
  { question: "风险处置的四种策略？", options: ["A. 只有接受", "B. 规避、转移、缓解、接受", "C. 只有缓解", "D. 只有转移"], correctIndex: 1, explanation: "四策略：①规避(停止高危活动)②转移(买保险/外包)③缓解(部署安全措施降低风险)④接受(评估后接受残余风险)。" },
  { question: "残余风险(Residual Risk)的含义？", options: ["A. 没有风险", "B. 采取安全措施后仍然存在的风险", "C. 最大的风险", "D. 最小的风险"], correctIndex: 1, explanation: "残余风险是部署安全控制措施后仍存在的风险，管理层需评估并正式接受可容忍的残余风险水平。" },
] },

25: { quiz: [
  { question: "RTO(Recovery Time Objective)和RPO(Recovery Point Objective)的区别？", options: ["A. 完全相同", "B. RTO=恢复时间目标(停多久)，RPO=恢复点目标(丢多少数据)", "C. RTO只用于备份", "D. RPO不用于灾难恢复"], correctIndex: 1, explanation: "RTO定义业务允许的最大中断时间，RPO定义可容忍的数据丢失量(多久前的数据)。RTO=时间，RPO=数据量。" },
  { question: "BCP(业务连续性计划)和DRP(灾难恢复计划)的关系？", options: ["A. 互不相关", "B. BCP范围更广(含DRP)，DRP专注于IT系统恢复", "C. DRP范围更大", "D. 只用一种"], correctIndex: 1, explanation: "BCP覆盖整个业务连续(人员、流程、设施、供应商等)，DRP是BCP的子集专注于IT基础设施和系统的恢复。" },
  { question: "热站(Hot Site)、温站(Warm Site)、冷站(Cold Site)的区别？", options: ["A. 没有区别", "B. 热站=实时就绪秒级切换，温站=部分就绪小时级，冷站=空场地天级", "C. 根据温度选择", "D. 根据颜色选择"], correctIndex: 1, explanation: "热站：硬件/数据/网络实时就绪(RTO分钟级)；温站：硬件就绪需恢复数据(RTO小时级)；冷站：空场地需全部搭建(RTO天级)。" },
  { question: "备份策略3-2-1规则的含义？", options: ["A. 随意备份", "B. 3份副本、2种不同介质、1份异地存储", "C. 3天备份一次", "D. 2个系统备份"], correctIndex: 1, explanation: "3-2-1备份黄金法则：至少3份数据副本，存储在2种不同介质上，至少1份副本在异地(防同地灾难)。" },
] },

26: { quiz: [
  { question: "信息安全策略(Information Security Policy)的三个层级？", options: ["A. 只有一个", "B. 策略(Policy)→标准(Standard)→流程/指南(Procedure/Guideline)", "C. 两个层级", "D. 不需要"], correctIndex: 1, explanation: "策略层(定义方向和原则)→标准层(定义具体要求)→流程指南层(具体操作步骤)，自上而下逐步细化。" },
  { question: "安全制度中'AUP'(可接受使用策略)通常规定什么？", options: ["A. 员工工资", "B. 员工可接受的公司IT资源使用行为规范", "C. 服务器配置", "D. 网络拓扑"], correctIndex: 1, explanation: "AUP(Acceptable Use Policy)定义员工使用公司电脑、网络、邮箱等IT资源的可接受和禁止行为，是基础安全制度。" },
  { question: "密码策略中常见的密码复杂度要求？", options: ["A. 不限制", "B. 至少8位+大小写字母+数字+特殊字符三类以上组合", "C. 只用数字", "D. 只用字母"], correctIndex: 1, explanation: "标准密码策略：最小长度(≥8或12)、复杂度(大小写+/数字+/特殊字符三选三以上)、历史密码记忆(不重用)、定期更换。" },
  { question: "安全制度管理中'定期评审'(Periodic Review)的作用？", options: ["A. 无作用", "B. 确保制度与业务变化和技术发展同步更新", "C. 仅检查格式", "D. 归档"], correctIndex: 1, explanation: "定期评审安全制度确保其持续适用：法规变化、新威胁、新业务模式和技术都可能要求更新安全管理制度。" },
] },

27: { quiz: [
  { question: "安全意识培训中'钓鱼邮件识别'通常教员工关注什么？", options: ["A. 邮件内容好坏", "B. 发件人地址异常拼写、紧急催促语气、可疑链接/附件", "C. 邮件大小", "D. 发送时间"], correctIndex: 1, explanation: "钓鱼邮件识别要点：发件人地址伪造(相似域名)、紧急催促/恐吓语气、可疑短链接、未预期的附件、语法错误等。" },
  { question: "社会工程学攻击中'Tailgating'(尾随)是指什么？", options: ["A. 电子邮件攻击", "B. 未授权人员紧跟授权人员进入安全区域", "C. 电话诈骗", "D. 网络钓鱼"], correctIndex: 1, explanation: "尾随是物理社会工程攻击，攻击者紧跟刷卡的授权人员进入门禁区域，利用礼貌(帮开门)来绕过物理安全控制。" },
  { question: "安全培训中'清洁桌面政策'(Clean Desk Policy)的意义？", options: ["A. 美观", "B. 防止敏感信息通过纸质文件/便利贴/屏幕被未授权查看", "C. 方便清洁", "D. 减少灰尘"], correctIndex: 1, explanation: "清洁桌面政策要求离开工位时收起敏感文件、锁屏、不贴密码便利贴，防止路过式信息窃取。" },
  { question: "衡量安全意识培训效果最直接的方式？", options: ["A. 问卷调查", "B. 模拟钓鱼测试的点击率变化趋势", "C. 罚款", "D. 口头询问"], correctIndex: 1, explanation: "模拟钓鱼演练的点击率和报告率变化是量化的培训效果指标。培训后点击率应持续下降，报告率持续上升。" },
] },

28: { quiz: [
  { question: "红蓝对抗中，Red Team(红队)的职责？", options: ["A. 修复漏洞", "B. 模拟真实攻击者，测试组织检测和响应能力", "C. 监控网络", "D. 写报告"], correctIndex: 1, explanation: "红队模拟APT等高级攻击者使用真实攻击技术(TTPs)测试蓝队的检测(能否发现)和响应(能否处置)能力。" },
  { question: "紫队(Purple Team)在红蓝对抗中的作用？", options: ["A. 替代红队", "B. 促进红蓝协作：实时沟通攻击方法和检测差距", "C. 替代蓝队", "D. 不需要"], correctIndex: 1, explanation: "紫队不是独立团队，而是红蓝协作模式：红队和蓝队一起工作，实时分享攻击技术和检测盲区，提高整体防御。" },
  { question: "红蓝对抗演习中，蓝队(Blue Team)的核心任务？", options: ["A. 攻击", "B. 检测、响应和防御(发现并阻止红队攻击)", "C. 什么都不做", "D. 只写报告"], correctIndex: 1, explanation: "蓝队负责防御：监控安全告警、检测红队活动、响应和遏制攻击、评估安全控制的有效性。" },
  { question: "红蓝对抗演练和渗透测试的主要区别？", options: ["A. 完全相同", "B. 红蓝对抗更全面(测试整个安全体系+检测响应)，渗透测试聚焦漏洞发现", "C. 渗透测试更全面", "D. 没区别"], correctIndex: 1, explanation: "渗透测试目标导向(找漏洞)，红蓝对抗全过程模拟攻击(测试检测/响应/流程/人员的全面防御体系)。" },
] },

29: { quiz: [
  { question: "威胁情报的Pyramid of Pain(痛苦金字塔)中，什么最难改变？", options: ["A. 哈希值", "B. TTPs(战术技术过程)", "C. IP地址", "D. 域名"], correctIndex: 1, explanation: "TTPs(战术技术过程)位于金字塔顶端，是最难改变的攻击本质。改变IP/域名容易，改变攻击方法(TTPs)需要攻击者重新研发。" },
  { question: "威胁情报平台TIP(Threat Intelligence Platform)的核心功能？", options: ["A. 发送邮件", "B. 聚合并关联多源威胁情报，自动分发IOC到安全设备", "C. 开发软件", "D. 备份数据"], correctIndex: 1, explanation: "TIP聚合多源情报(商业/开源/行业ISAC)，去重关联分析后自动将可行动IOC分发到SIEM/防火墙/EDR等安全设备。" },
  { question: "MISP(恶意软件信息共享平台)主要用途？", options: ["A. 加密", "B. 威胁情报共享和协作(支持STIX格式)", "C. 漏洞扫描", "D. 防火墙"], correctIndex: 1, explanation: "MISP是开源威胁情报共享平台，支持STIX标准，用于组织间安全事件的协作共享和IOC聚合分析。" },
  { question: "威胁情报中'战略性情报'(Strategic)的受众是？", options: ["A. 安全分析师", "B. 管理层和决策者(了解威胁趋势和风险)", "C. SOC值班员", "D. 开发人员"], correctIndex: 1, explanation: "战略性情报面向CISO/董事会：行业威胁趋势、攻击者动机、风险评估。战术/技术情报面向安全运营团队的具体防护。" },
  { question: "如何衡量威胁情报的质量？", options: ["A. 数量越多越好", "B. 及时性(Timeliness)、准确性(Accuracy)、相关性(Relevance)、可操作性(Actionability)", "C. 只看来源", "D. 只看价格"], correctIndex: 1, explanation: "威胁情报质量的四个维度：及时(非过期)、准确(无误报)、相关(与行业/技术栈匹配)、可操作(能直接用于防护)。" },
] },

30: { quiz: [
  { question: "安全运营体系建设中'SOC成熟度模型'通常分为几级？", options: ["A. 2级", "B. 3-5级(从初始/被动到主动/自适应)", "C. 只有1级", "D. 10级"], correctIndex: 1, explanation: "SOC成熟度通常5级：初始级(无正式SOC)→被动级(响应告警)→主动级(威胁狩猎)→预测级(威胁情报驱动)→自适应级(自动化+AI)。" },
  { question: "SOAR(安全编排自动化与响应)的核心价值？", options: ["A. 替换所有安全人员", "B. 自动化重复任务、编排多工具协同、加速响应(MTTR降低)", "C. 只做日志", "D. 替代SIEM"], correctIndex: 1, explanation: "SOAR通过Playbook自动化重复安全操作(告警富化→判断→封禁)，集成多工具协同工作，显著降低MTTR和减少手工操作。" },
  { question: "安全度量指标(Metrics)中'覆盖率'(Coverage)指什么？", options: ["A. 员工数量", "B. 受安全监控保护的资产比例(如EDR部署率)", "C. 预算使用率", "D. 培训人数"], correctIndex: 1, explanation: "Coverage衡量安全控制的覆盖范围：如EDR部署率%、日志接入率%、漏洞扫描覆盖率%，反映了安全可见性的广度。" },
  { question: "构建安全运营体系的正确顺序？", options: ["A. 买设备→上系统→定流程", "B. 定策略→建流程→上平台(技术)→持续改进(PPDR模型)", "C. 随机建设", "D. 只需技术"], correctIndex: 1, explanation: "安全运营建设路径：策略(目标范围)→流程(事件响应/告警处理SOP)→平台(工具技术SIEM/SOAR)→持续度量改进(PCDA循环)。" },
  { question: "以下哪些是衡量安全运营成功的指标？（多选）", options: ["A. MTTD减少", "B. MTTR减少", "C. 误报率降低", "D. 资产覆盖率提升"], correctIndex: -1, correctIndices: [0, 1, 2, 3], explanation: "提高检测速度(MTTD)、加快响应(MTTR)、降低误报、扩大覆盖范围都是安全运营成熟度提升的关键表现。" },
] },

};

export default supplement;
