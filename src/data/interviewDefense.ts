// 面试突击 — 安全防御：26天全量复习 + 14天面试实战 = 40天
import { cyberDefensePlan } from './cyberDefense';
import { type CyberDay, type CyberLearningPlan, type QuizQuestion } from './cyberBasic';

function mergeEvenly(days: CyberDay[], target: number): CyberDay[] {
  const n = days.length;
  const result: CyberDay[] = [];
  const groupSize = n / target;
  for (let g = 0; g < target; g++) {
    const start = Math.round(g * groupSize);
    const end = Math.round((g + 1) * groupSize);
    const chunk = days.slice(start, end);
    if (chunk.length === 0) continue;
    const first = chunk[0];
    const last = chunk[chunk.length - 1];
    result.push({
      id: `interview-def-review-${g + 1}`,
      day: g + 1,
      title: `复习 Day ${g + 1}: ${first.title}`,
      subtitle: chunk.length > 1 ? `速览 Day${first.day}-Day${last.day}（${chunk.length}天合一）` : `原版 Day${first.day}`,
      objectives: [...new Set(chunk.flatMap(d => d.objectives || []))],
      content: chunk.map(d => `## ${d.title}\n\n${d.content || ''}`).join('\n\n---\n\n'),
      keyPoints: [...new Set(chunk.flatMap(d => d.keyPoints || []))] as string[],
      quiz: chunk.flatMap(d => d.quiz || []),
      codeExamples: chunk.flatMap(d => d.codeExamples || []),
      resources: chunk.flatMap(d => d.resources || []),
      labEnvironment: chunk.flatMap(d => d.labEnvironment || []),
      expertNotes: chunk.flatMap(d => d.expertNotes || []),
    } as CyberDay);
  }
  return result;
}

const reviewDays = mergeEvenly(cyberDefensePlan.days, 26);

const q = (q: string, opts: string[], ans: number, exp: string): QuizQuestion => ({ question: q, options: opts, correctIndex: ans, explanation: exp });

const interviewDays: CyberDay[] = [
  {
    id: 'interview-def-i27', day: 27, title: '安全运营中心SOC', subtitle: 'SOC架构·告警研判·流程',
    objectives: ['SOC运营全流程掌握'],
    keyPoints: ['SOC架构','告警分级','研判流程','MTTD/MTTR','排班轮值'],
    content: `# SOC 安全运营面试 20 问

**Q1: SOC的核心职能？**
日志收集→集中分析→告警→研判→响应→闭环 | 7×24监控+威胁狩猎+安全事件管理

**Q2: SOC团队结构？**
Tier1初始研判(分流)→Tier2深度分析(定性)→Tier3高级分析(狩猎/逆向)→SOC经理(流程/报告)

**Q3: 日常告警来源？**
SIEM(关联规则)、EDR(端点告警)、NDR(流量告警)、DLP(数据泄露)、邮件网关、威胁情报匹配

**Q4: 告警分级标准？**
严重P1(数据泄露/正在进行的攻击)→高危P2(木马/暴力破解成功)→中危P3(扫描/可疑登录失败)→低危P4(信息/误报)

**Q5: 告警研判核心思路？**
①确认告警真实性(是不是真攻击) ②判断攻击阶段(侦察/利用/横向/C2) ③评估影响范围 ④决定响应动作

**Q6: MTTD vs MTTR？**
MTTD=Mean Time to Detect(发现时间) | MTTR=Mean Time to Respond(响应时间) | 都是SOC核心指标

**Q7: 常见误报来源？**
正常业务行为(定时任务扫描)、软件更新(连接微软更新IP)、扫描器自身活动、网络波动

**Q8: 大规模告警怎么处理？**
聚合(相同源/相同目标/相同特征)→找根因→建抑制规则→批量处理→复盘调优

**Q9: SOC的KPI？**
告警量、误报率、MTTD、MTTR、事件处理数、规则覆盖率、自动化处理率

**Q10: SOC如何与IR团队协作？**
SOC发现→升级到IR→IR调查处置→复测→案例复盘→SOC优化规则`,
    quiz: [q('SOC Tier1分析师主要做什么？',['深度分析','分流研判','规则开发','渗透测试'],1,'Tier1负责告警初始分流和简单研判'),q('MTTD代表？',['修复时间','检测时间','响应时间','分析时间'],1,'MTTD=Mean Time to Detect平均检测时间')]
  },
  {
    id: 'interview-def-i28', day: 28, title: 'SIEM与日志分析', subtitle: 'Splunk·ELK·日志范式化·关联规则',
    objectives: ['SIEM精通和日志分析'],
    keyPoints: ['SIEM选型','日志范式化','关联规则','SPL/KQL','日志源'],
    content: `# SIEM与日志分析面试题

**Q1: SIEM核心组件？**
采集器(agent/beats)→范式化→存储→关联引擎→告警→可视化→SOAR

**Q2: Splunk的核心概念？**
Index(索引)、Source Type(源类型)、Fields(字段)、SPL(搜索语言)、Dashboard、Alert、Lookup

**Q3: ELK vs Splunk？**
ELK开源免费自维护(Elasticsearch+Logstash+Kibana) | Splunk商业产品功能强但贵

**Q4: 日志范式化为什么重要？**
不同设备日志格式不同→统一字段名→关联分析→跨设备事件链 → 如Windows登录和VPN登录的关联

**Q5: Windows关键事件ID？**
4624登录成功 4625登录失败 4688进程创建 5156网络连接 4104PowerShell 4698计划任务 7045服务安装

**Q6: 被问"怎么建一条检测规则"？**
①明确检测场景(如暴力破解) ②确定数据源(登录日志) ③找特征(同一源IP 5分钟内4625≥10次) ④写关联规则 ⑤测试误报 ⑥上线

**Q7: 常用关联规则场景？**
暴力破解、横向移动、C2通信(定时心跳)、异常时间登录、管理员组变更、敏感命令执行

**Q8: 日志存储和保留策略？**
热存储(SSD 7-30天查询快)→温存储(HDD 3-6月优化存储)→冷存储(归档备份 1年+合规要求)

**Q9: SIEM选型考虑因素？**
EPS(每秒日志量)、预算、团队能力、已有基础设施(云/本地)、日志源兼容性

**Q10: 日志质量检查？**
是否有缺失时间段、关键字段是否解析、时间戳是否统一(UTC)、是否有重复/断裂`,
    quiz: [q('Windows 4625事件代表？',['登录成功','登录失败','进程创建','服务安装'],1,'4625=Logon Failed 登录失败'),q('ELK中K代表？',['Kubernetes','Kibana','Kafka','Keycloak'],1,'ELK=Elasticsearch+Logstash+Kibana')]
  },
  {
    id: 'interview-def-i29', day: 29, title: 'EDR/XDR/NDR', subtitle: '端点检测·流量分析·扩展检测',
    objectives: ['端点检测技术掌握'],
    keyPoints: ['EDR工作原理','XDR','NDR','端点遥测','检测方法'],
    content: `# EDR/XDR/NDR 面试题

**Q1: EDR vs 传统AV？**
AV签名匹配已知恶意软件 | EDR行为检测+威胁狩猎+事件时间线+响应(隔离/杀进程)

**Q2: EDR怎么检测恶意行为？**
进程链分析(Parent-Child关系)、命令行参数、网络连接、文件操作、注册表、内存扫描、ML评分

**Q3: 常见EDR产品？**
CrowdStrike Falcon、Microsoft Defender for Endpoint、SentinelOne、CarbonBlack、Elastic Security

**Q4: XDR相比EDR的优势？**
EDR只管端点 | XDR融合多个数据源(端点+网络+邮件+云+身份)做跨层检测

**Q5: NDR(流量分析)能做什么？**
C2通信检测(心跳)、横向移动检测(SMB/WMI行为)、数据泄露检测(大流量外传)、协议异常

**Q6: 如何绕过EDR？**
①无文件执行(内存) ②分裂进程链(PPID spoofing) ③syscall直接调用 ④签名滥用 ⑤LOLBAS

**Q7: EDR部署考虑？**
性能影响、敏感系统例外策略(闭环测试)、更新策略、告警渠道、与SIEM集成

**Q8: 端点遥测数据包含什么？**
进程事件(Fork/Exec)、网络事件(Connect/Listen)、文件事件(Create/Write/Read)、注册表事件、模块加载事件

**Q9: 事件时间线怎么做？**
关联进程链+文件+注册表+网络, 画出攻击路径:恶意文档→下载payload→powershell执行→C2连接

**Q10: 评价一款EDR怎么评？**
检测率+误报率+性能影响+响应能力(隔离/远程Shell)+API支持+威胁情报丰富度`,
    quiz: [q('EDR核心相比AV的优势？',['更新快','行为检测','免费','跨平台'],1,'EDR通过行为分析检测未知威胁而AV依赖已知签名'),q('XDR的X代表？',['极端','扩展','外部','额外'],1,'XDR=Extended Detection and Response扩展检测与响应')]
  },
  {
    id: 'interview-def-i30', day: 30, title: '应急响应实战', subtitle: 'PDCERF·入侵排查·取证',
    objectives: ['应急响应全流程实战'],
    keyPoints: ['PDCERF','入侵排查','取证','内存分析','日志时间线'],
    content: `# 应急响应面试题

**Q1: 收到"服务器被黑了"怎么处理？**
确认→隔离(断网/下线)→留存证据(内存镜像+磁盘镜像+日志)→排查(后门/时间线)→根除→恢复→复盘

**Q2: 入侵排查第一步？**
①看当前连接(netstat -an) ②看进程(ps aux / tasklist) ③看启动项/计划任务 ④看账户变更 ⑤看日志(安全日志/Web日志)

**Q3: Linux排查关键命令？**
last(logins) lastb(failed) w(who) netstat -tlnp history crontab find / -mtime -N recent files

**Q4: Windows排查关键？**
eventvwr→Security(4624/4625/4672) | taskschd.msc(计划任务) | compmgmt.msc(用户/共享) | autoruns(启动项)

**Q5: WebShell排查？**
特征:非标准文件名(.jpg.php修改时间异常) | grep curl/exec/eval/system/base64_decode | D盾/河马扫描

**Q6: 挖矿排查？**
高CPU进程、外连矿池IP/域名(DNS)、定时任务/crontab、隐藏进程

**Q7: 勒索排查？**
文件后缀变化、勒索信(README)、批量加密时间、RDP/漏洞入侵入口

**Q8: 后门持久化排查？**
Linux: SSH授权密钥、crontab、启动脚本(.bashrc/.profile)、LD_PRELOAD
Windows: 服务、Run键、计划任务、WMI事件、DLL劫持

**Q9: 时间线分析？**
MACTIME(文件修改/访问/创建/变更时间)+日志时间 → 还原攻击过程 | 注意时间被篡改

**Q10: 证据链保存？**
内存→磁盘→日志→网络流量 | 哈希固化+链式保管(Chain of Custody) | 原始介质不直接操作`,
    quiz: [q('PDCERF中D代表？',['销毁','检测','防御','开发'],1,'PDCERF中D=Detection检测(发现入侵)'),q('Linux查历史登录命令？',['history','last','who','w'],1,'last显示登录历史lastb显示失败登录')]
  },
  {
    id: 'interview-def-i31', day: 31, title: '取证与逆向基础', subtitle: '内存·磁盘·网络取证',
    objectives: ['取证基础技术'],
    keyPoints: ['内存取证','磁盘取证','文件雕刻','时间线','网络取证'],
    content: `# 取证与逆向面试题

**Q1: 内存取证能拿到什么？**
进程列表、网络连接、加载的DLL、注册表信息、cmd历史命令、密码/密钥残留、恶意代码样本

**Q2: Volatility基本用法？**
vol -f memory.dmp imageinfo→pslist→netscan→cmdscan→malfind(detect injected code)→dumpfiles

**Q3: 磁盘取证要素？**
$MFT(文件系统元数据)、删除文件恢复、文件签名识别、日志文件(USN Journal)、注册表文件(SAM/SYSTEM)

**Q4: 如何恢复删除的文件？**
文件未真正删除→标记为空闲空间→文件雕刻(PhotoRec/testdisk)→根据文件头尾特征恢复

**Q5: 时间线分析工具？**
log2timeline/Plaso→分析日志+文件系统时间→生成可视化时间线→找出攻击时间窗口

**Q6: 注册表分析要点？**
SAM/SYSTEM→提取Hash | SOFTWARE→软件信息 | NTUSER.DAT→Run键/Recent | Amcache→程序执行证据

**Q7: 网络取证抓什么？**
PCAP(TCPdump/Wireshark)→C2流量→数据泄露流量→横向移动流量 | 注意HTTPS加密

**Q8: PE文件分析？**
PE头→导入表(API调用)→节区资源→特征字符串 | 静态:IDA→动态:沙箱

**Q9: 恶意文档分析？**
Oletools(rtfobj/olevba)→宏提取→VBA分析→Payload提取 | PDF:peepdf/pdfid

**Q10: 取证报告要素？**
案件概述→分析设备→分析过程→发现(工具+截图)→结论→附录(哈希/工具版本)`,
    quiz: [q('Volatility分析内存用什么命令看进程？',['netscan','pslist','cmdline','malfind'],1,'pslist列出进程netscan看网络连接malfind找注入'),q('Plaso用于什么分析？',['内存','流量','时间线','代码'],2,'log2timeline/Plaso用于构建事件时间线')]
  },
  {
    id: 'interview-def-i32', day: 32, title: '网络防御体系', subtitle: '防火墙·IDS/IPS·WAF·蜜罐',
    objectives: ['网络防御技术面试'],
    keyPoints: ['防火墙','IDS/IPS','WAF','蜜罐','网络隔离','零信任网络'],
    content: `# 网络防御面试题

**Q1: 防火墙原理？**
包过滤(L3/L4)→状态检测(跟踪连接状态)→应用层防火墙(深度包检测)→下一代防火墙NGFW(集成IPS/AV)

**Q2: IDS vs IPS？**
IDS入侵检测(旁路、告警、不影响流量) | IPS入侵防御(串联、阻断、影响性能) | 部署位置不同

**Q3: WAF部署模式？**
反向代理(串联)、透明代理(旁路)、嵌入式(插件) | 旁路不阻流量仅告警

**Q4: 蜜罐有什么用？**
①诱捕攻击者了解攻击手法 ②消耗攻击者时间 ③检测内网扫描(任何碰蜜罐的行为都是恶意的)

**Q5: 蜜罐类型？**
低交互(模拟服务Honeyd/Dionaea)→高交互(真实系统) | 蜜标(数据库假数据/假文件) | 蜜网(多蜜罐)

**Q6: 网络分段/隔离？**
物理隔离(不同网络)、VLAN逻辑隔离、微分段(数据中心东西向)、SDN策略

**Q7: 零信任网络的核心？**
永远不信任永远验证、微隔离、身份驱动、持续认证、最小权限 | ZTNA代替VPN

**Q8: DMZ区设计？**
外网↔防火墙↔DMZ(Web/Mail等对外服务)↔防火墙↔内网 | DMZ被攻陷不影响内网

**Q9: 常见DDoS防御？**
CDN分散流量、专业清洗服务(Cloudflare)、黑洞路由、流量整形 | 三层(ICMPflood/SYNflood)七层(HTTPflood)

**Q10: NAC网络准入？**
802.1X认证、MAC认证、Portal认证 | 未合规设备不能接入(无杀软/补丁不足阻断)`,
    quiz: [q('IDS和IPS最核心的区别？',['检测能力','部署位置','旁路vs串联','价格'],2,'IDS旁路不影响流量只告警，IPS串联可以阻断'),q('蜜罐最大的价值？',['数据存储','高交互','内网扫描检测','伪装'],2,'任何访问蜜罐的行为都是可疑的，对检测内网扫描价值极高')]
  },
  {
    id: 'interview-def-i33', day: 33, title: '云安全基础', subtitle: 'AWS/阿里云安全·容器安全·K8S',
    objectives: ['云安全基本概念'],
    keyPoints: ['共享责任模型','IAM','容器安全','K8S安全','云WAF'],
    content: `# 云安全面试题

**Q1: 共享责任模型？**
云厂商负责"云的安全"(物理/网络/虚拟化) | 用户负责"云中的安全"(OS/应用/数据/配置/访问控制)

**Q2: 云安全常见问题？**
公开S3桶、IAM权限过大、安全组0.0.0.0/0开放、密钥泄露(GitHub)、未加密数据

**Q3: K8S安全要素？**
RBAC、Pod Security Policy、Network Policy、Secret管理、镜像签名、运行时安全(Falco)

**Q4: 容器安全vs虚拟机安全？**
容器共享内核→内核漏洞影响全主机 | 镜像供应链风险 | 容器以root运行 | 不安全挂载docker.sock

**Q5: 云环境WAF与本地WAF区别？**
云WAF免部署弹性扩展 | 但数据流经第三方 | 本地WAF可控但需维护

**Q6: CASB云访问安全代理？**
发现影子IT→数据防泄露(DLP)→威胁防护→合规 | 在用户和使用云服务之间做安全中间人

**Q7: CSPM云安全态势管理？**
检查云资源配置(错误配置检查)→合规基线→自动修复 | Prisma Cloud/Wiz

**Q8: CWPP云工作负载保护？**
主机/容器/Serverless运行时安全 | 传统的EDR但针对云优化

**Q9: 云安全面试常见追问？**
"你怎么管理云上的密钥"→KMS/Vault/不硬编码/自动轮转
"你怎么做云环境日志审计"→CloudTrail+SIEM / 日志集中存储

**Q10: IAM最佳实践？**
最小权限、定期审计权限、使用角色而非密钥、MFA强制开启、联合身份(SSO)`,
    quiz: [q('共享责任模型中方负责什么？',['物理','网络','数据','虚拟化'],2,'用户负责云中的数据/应用/OS/配置/访问控制'),q('K8S中管理权限用什么？',['Calico','RBAC','Helm','Etcd'],1,'K8S RBAC管理用户和服务账号的权限')]
  },
  {
    id: 'interview-def-i34', day: 34, title: '数据安全与DLP', subtitle: '数据分类·加密·DLP·隐私',
    objectives: ['数据安全体系'],
    keyPoints: ['数据分类分级','DLP','加密','数据库安全','脱敏'],
    content: `# 数据安全面试题

**Q1: 数据安全的核心三要素？**
数据分类分级→数据保护(加密/脱敏)→数据监控(DLP/审计)

**Q2: 数据分类vs分级？**
分类:C端/P端/商业秘密 | 分级:绝密(5)/机密(4)/秘密(3)/内部(2)/公开(1) | 分类侧重类型分级侧重敏感程度

**Q3: DLP怎么工作的？**
网络DLP(拦截邮件/Web上传)→端点DLP(USB/打印控制)→存储DLP(扫描文件服务器) | 指纹/正则/关键词

**Q4: 数据脱敏方式？**
静态脱敏(数据出库时)→动态脱敏(查询时根据权限)→格式保留脱敏(tokenization)

**Q5: 数据库安全措施？**
加密(TDE全库/列级)→审计(SQL审计)→防火墙(Database Firewall)→漏洞检测→权限最小化

**Q6: 密钥管理KMS？**
密钥全生命周期:生成→存储→分发→轮转→销毁 | HSM硬件安全模块 | 不硬编码不Git

**Q7: 数据生命周期安全？**
创建(分类)→存储(加密)→使用(权限控制)→共享(DLP)→归档(加密)→销毁(安全删除)

**Q8: 数据库审计要点？**
谁(用户)什么时候(时间)从哪里(IP)做了什么(SQL语句)看了什么(数据量) | 异常体积查询

**Q9: 备份安全？**
备份加密、异地存储、定期恢复演练、防勒索(不可变备份)

**Q10: 隐私计算？**
联邦学习(数据不动模型动)、同态加密(密文计算)、安全多方计算(多方数据联合计算不出域)`,
    quiz: [q('DLP缩写代表？',['数据链路协议','数据防泄露','动态负载保护','深度包检测'],1,'DLP=Data Loss Prevention数据防泄露'),q('数据脱敏与加密主要区别？',['算法不同','脱敏不可逆加密可逆','都不可逆','都一样'],1,'加密可解密还原，脱敏通常不可逆')]
  },
  {
    id: 'interview-def-i35', day: 35, title: '邮件安全', subtitle: '邮件网关·SPF/DKIM/DMARC·钓鱼检测',
    objectives: ['邮件安全技术栈'],
    keyPoints: ['邮件安全协议','SPF','DKIM','DMARC','邮件头分析','钓鱼邮件'],
    content: `# 邮件安全面试题

**Q1: 邮件安全三大协议？**
SPF(发件人IP授权)、DKIM(邮件签名防篡改)、DMARC(设置SPF+DKIM失败时的处理策略)

**Q2: SPF怎么工作？**
接收方检查发件域名的DNS TXT记录→验证发件IP是否在授权列表→不在则SPF失败

**Q3: DKIM签名原理？**
发件服务器用私钥对邮件内容签名→签名放DKIM-Signature头→收件方用DNS公钥验签

**Q4: DMARC配置示例？**
v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com | p=none/reject/quarantine

**Q5: 怎么判断一封邮件是不是钓鱼？**
①发件人地址(域名伪造)②链接悬停后URL(不匹配)③附件类型(.exe/.zip加密)④邮件头分析⑤语气(紧急/威胁)

**Q6: 邮件头关键字段？**
Received(路由路径)、Return-Path(退信地址)、Reply-To(回复地址)、X-Originating-IP(发件IP)

**Q7: 邮件网关检测技术？**
反病毒(AV)扫描、反垃圾(Bayesian/黑名单Real-time Blackhole)、URL检测(沙箱)、附件沙箱

**Q8: 收到钓鱼邮件除了删除还要做什么？**
①分析邮件头→提取IOC(IP/URL/域名)②搜其他人是否也收到③如果已点链接→立即应急④拉黑发件域/IP

**Q9: 如何做钓鱼演练？**
①选受害者②造仿真钓鱼邮件③发送④统计点击/输入率⑤培训⑥反复直到降到目标值

**Q10: 邮件加密？**
S/MIME(端到端加密+签名)→TLS传输加密→Secure Email Gateway加密网关`,
    quiz: [q('SPF记录存在哪里？',['邮件服务器','DNS TXT记录','邮件头','HTTP头'],1,'SPF记录存放在域名的DNS TXT记录中'),q('DMARC p=reject意味着？',['放行','标记','拒绝','忽略'],2,'p=reject策略表示SPF或DKIM失败时直接拒收邮件')]
  },
  {
    id: 'interview-def-i36', day: 36, title: '攻击模拟与BAS', subtitle: '红队·紫队·攻击模拟·BAS平台',
    objectives: ['攻击模拟技术'],
    keyPoints: ['BAS','Breach Attack Simulation','紫队','假设入侵','自动化攻击模拟'],
    content: `# 攻击模拟面试题

**Q1: BAS是什么？**
Breach and Attack Simulation 攻击模拟自动化平台 | 模拟攻击手法→验证安全控制是否生效→持续改进

**Q2: BAS vs 渗透测试？**
BAS自动化持续(每周/每日) | 渗透测试手工深层(每季/半年) | BAS补充渗透测试的频率

**Q3: 紫队怎么运作？**
红队攻→蓝队检测→紫队复盘优化→改进检测规则→循环 | 对抗→合作

**Q4: 假设入侵(Assume Breach)思维？**
不追求边界完美防御→假设已被入侵→重心放在检测/响应/遏制/恢复

**Q5: 攻击模拟覆盖ATT&CK哪些？**
覆盖率% = 已检测技术数/ATT&CK相关技术总数 | Initial Access/Execution/Persistence/Defense Evasion等

**Q6: 如何评估安全控制的有效性？**
用模拟攻击逐一验证→哪些检测到了哪些没检测到→找出检测盲区→补规则/补工具

**Q7: 安全度量常用指标？**
检测覆盖率、MTTD、MTTR、漏洞修复时间、钓鱼点击率、补丁合规率

**Q8: 如何建立安全度量体系？**
定义指标→收集数据→建立基线→设置目标→持续监控→汇报管理层

**Q9: 自动化安全验证的场景？**
每次CI/CD→自动BAS模拟→每周对生产随机测试→策略变更后自动验证→红蓝演练前自动化探测

**Q10: 安全建设成熟度？**
L1初始(事件驱动)→L2管理(有流程)→L3定义(标准化)→L4量化(度量)→L5优化(自适应)`,
    quiz: [q('BAS区别于渗透最主要的是？',['深度','自动化·持续','人工','价格'],1,'BAS自动持续运行补充渗透测试的频率不足'),q('Assume Breach的核心是什么？',['更好的防火墙','假设已入侵','更强的密码','更快的WAF'],1,'Assume Breach假设已遭入侵重心从防御转向检测和响应')]
  },
  {
    id: 'interview-def-i37', day: 37, title: '场景模拟 Day 1', subtitle: '蓝队面试连环追问',
    objectives: ['蓝队面试场景应对'],
    keyPoints: ['蓝队面试','应急响应场景','告警研判场景','威胁狩猎场景'],
    content: `# 蓝队面试场景

**场景1:"发现大量4625登录失败事件怎么处理"**
①确认源IP是外部还是内部
②时间窗口(1h内多少次)
③如果是外部→暴力破解→封IP
④如果是内部→横向移动→应急响应升级
⑤如果是服务账号→检查是否有服务配置变更

**场景2:"晚上3点收到告警有数据外传"**
①远程登机器→断开网络(抑制)
②ps/netstat看是什么进程
③分析流量捕获→确定外传数据量/IP→收集证据
④如果是真的→升级通知→根除→恢复→复盘

**场景3:"怎么检测webshell"**
①流量层面:对php/jsp/aspx的POST请求、非标准header、异常User-Agent
②主机层面:文件时间戳异常、命令执行日志、D盾/河马扫描
③SIEM:Web服务器日志异常(访问量突增/特殊URL)

**场景4:"安全建设从0到1怎么做"**
①资产梳理(有什么)②风险评估(什么最重要)③基本防护(防火墙/杀软/补丁)④日志和监控(SIEM)⑤流程(应急/变更)⑥检测规则⑦持续优化

**场景5:"如何跟业务团队推安全要求"**
用业务语言:不安全的后果(数据泄露→处罚/损失)→给简单方案不做过度安全→先解决高风险能快速落地的→用数据和案例说话`,
    quiz: []
  },
  {
    id: 'interview-def-i38', day: 38, title: '等保合规深入', subtitle: '等保2.0·关基保护·ISO27001·网络安全审查',
    objectives: ['合规面试精通'],
    keyPoints: ['等保定级','安全控制项','差距分析','合规测评','数据安全法'],
    content: `# 等保合规面试题

**Q1: 等保2.0定级流程？**
资产整理→确定定级对象→初步定级(业务信息安全等级+系统服务安全等级)→专家评审→备案

**Q2: 等保三级主要控制项？**
安全管理制度、安全管理机构、安全管理人员、安全建设管理、安全运维管理 | 技术:物理/网络/主机/应用/数据安全

**Q3: 等保测评怎么做？**
访谈→检查→测试→验证→评分→出具报告 | 差距分析→整改→复测

**Q4: 关基保护(CII)？**
关键信息基础设施保护条例 | 对国家安全/国计民生有重要影响的网络设施 | 额外安全义务

**Q5: 数据安全法对企业的影响？**
数据分类分级、数据安全审查、跨境数据管理、重要数据保护、处罚加重

**Q6: GDPR vs 个保法？**
GDPR(欧盟) 个保法(中国) | 共同:知情同意/最小必要/数据主体权利 | 处罚不同

**Q7: ISO27001认证流程？**
体系建立→试运行→内部审核→管理评审→认证审核(一阶段/二阶段)→发证→监督审核(每年)

**Q8: 安全审计vs渗透测试？**
安全审计更广(合规/管理/技术) | 渗透测试专于技术漏洞发现

**Q9: 供应链安全要求？**
供应商安全评估→合同安全条款→定期审计→漏洞通报→退出机制

**Q10: 安全合规面试常问？**
"你怎么落地等保"→差距分析→整改方案→推动业务修改→测评→通过→持续保持`,
    quiz: [q('等保二级到三级的核心区别？',['测评频率','控制项数量','定级方式','备案部门'],1,'三级比二级多约36项安全要求控制项更多'),q('关基保护条例主要保护什么？',['个人数据','国家安全','企业机密','软件版权'],1,'CII保护对国家安全和国计民生有重要影响的关键信息基础设施')]
  },
  {
    id: 'interview-def-i39', day: 39, title: '检测工程与Sigma规则', subtitle: '编写检测规则·Sigma·ATT&CK映射',
    objectives: ['检测规则编写能力'],
    keyPoints: ['Sigma规则','Yara规则','检测工程','规则调优','ATT&CK映射'],
    content: `# 检测工程面试题

**Q1: Sigma规则是什么？**
通用检测规则格式(SIEM无关)→可转换为Splunk/ELK/Qradar等不同SIEM查询语言

**Q2: Sigma规则结构？**
title/id/status/description/author → logsource(产品/category) → detection(selection+condition) → false positives → level → tags(ATT&CK)

**Q3: 写一条检测mimikatz的Sigma？**
selection: LogonType=9|SeDebugPrivilege|lsass.exe access| 同进程内有这些行为→检测

**Q4: Yara规则？**
文件特征匹配规则 | meta(描述)+strings(特征)+condition(逻辑) | 恶意软件家族识别

**Q5: 规则怎么调优？**
上线→观察误报→加白名单(排除正常程序/正常用户/正常行为)→降低误报→找漏报→补规则

**Q6: 检测工程的流程？**
需求(检测场景)→数据源(什么日志)→特征提取→规则编写→测试→上线→调优→反馈→迭代

**Q7: ATT&CK映射怎么做？**
把每条检测规则对应到一个或多个ATT&CK技术ID→可视化覆盖率→找盲区

**Q8: 什么是检测覆盖率？**
已有检测的ATT&CK技术数÷该环境相关的ATT&CK技术总数×100% | 但不能只看数量

**Q9: 规则性能考量？**
聚合查询避免全扫、合理时间窗口、限定索引范围、避免频繁正则大扫描

**Q10: 如何减少告警疲劳？**
设置告警阈值、合并关联告警、分析后调优、Tier1分流、自动化处理低风险告警`,
    quiz: [q('Sigma规则转什么SIEM查询？',['Splunk/ELK','nmap','burp','wireshark'],0,'Sigma是SIEM通用格式可转为Splunk SPL、Elastic Query等多种'),q('Yara主要用于什么场景？',['日志分析','文件特征匹配','网络检测','内存分析'],1,'Yara根据特征匹配文件用于恶意软件家族识别')]
  },
  {
    id: 'interview-def-i40', day: 40, title: '全真模拟面试 — 防守篇', subtitle: '20道随机面试题 · 独立作答',
    objectives: ['模拟安全防御面试·查漏补缺'],
    keyPoints: ['SOC·SIEM·EDR·应急响应·合规'],
    content: `# 全真模拟面试 — 安全防御模块

**1.** SOC日常运营的核心工作有哪些？

**2.** 收到一个"可疑进程"告警怎么研判？

**3.** SIEM的日志范式化为什么重要？

**4.** EDR和传统AV的核心区别？

**5.** 应急响应的PDCERF每步做什么？

**6.** Linux/Windows被入侵怎么排查？

**7.** 如何检测暴力破解？动手写逻辑

**8.** WebShell怎么检测？主机+网络两个层面

**9.** 怎么建一条内网横向移动检测规则？

**10.** 邮件安全三协议SPF/DKIM/DMARC各自作用？

**11.** 云安全共享责任模型怎么理解？

**12.** 数据防泄露DLP怎么部署？

**13.** 蜜罐在安全防御中的价值？

**14.** 零信任的核心原则？

**15.** ISO27001 vs 等保2.0的区别？

**16.** BAS和渗透测试的区别？

**17.** 攻击模拟怎么提高检测覆盖率？

**18.** 安全建设从0到1怎么做？

**19.** 供应链安全怎么管理？

**20.** 你处理过的最复杂安全事件是什么？STAR方式描述

---

**自评**：≥16题通透→12-15题需加深→<12题回顾前26天+面试实战`,
    quiz: []
  }
];

export const interviewDefensePlan: CyberLearningPlan = {
  id: 'defense',
  name: '安全防御·面试突击',
  subtitle: 'Security Defense · 40 Days',
  description: '前26天全量知识速览 + 后14天面试实战。覆盖SOC、SIEM、EDR、应急响应、网络防御、云安全、数据安全、合规等全部蓝队面试考点',
  icon: '🔒',
  difficulty: '高级',
  totalDays: 40,
  color: 'text-cyber-blue',
  bgColor: 'bg-cyber-blue/10',
  borderColor: 'border-cyber-blue/30',
  prerequisites: cyberDefensePlan.prerequisites,
  certification: cyberDefensePlan.certification,
  days: [...reviewDays, ...interviewDays],
};
