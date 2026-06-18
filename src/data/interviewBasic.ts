// 面试突击 — 网络安全基础：26天全量复习 + 19天面试实战 = 45天
import { cyberBasicPlan, type CyberDay, type CyberLearningPlan, type QuizQuestion } from './cyberBasic';

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
      id: `interview-basic-review-${g + 1}`,
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

const reviewDays = mergeEvenly(cyberBasicPlan.days, 26);

const q = (question: string, opts: string[], ans: number, exp: string): QuizQuestion => ({ question, options: opts, correctIndex: ans, explanation: exp });

const interviewDays: CyberDay[] = [
  {
    id: 'interview-basic-i27', day: 27, title: '网络协议 20 问', subtitle: 'TCP/IP·HTTP·DNS·HTTPS',
    objectives: ['秒答网络协议经典面试题'],
    keyPoints: ['OSI vs TCP/IP','三次握手四次挥手','HTTP1/2/3','HTTPS握手','DNS','Cookie/Session/Token'],
    content: `# 网络协议 20 道高频面试题

**Q1: 浏览器输入URL发生了什么？**
DNS解析→TCP三次握手→TLS握手(HTTPS)→HTTP请求→服务端处理→HTTP响应→浏览器渲染→四次挥手

**Q2: OSI七层 vs TCP/IP四层？**
OSI: 物数网传会表应 | TCP/IP: 网络接口·网络层·传输层·应用层

**Q3: 三次握手为什么不是两次？**
防止旧SYN导致服务端建立无效连接浪费资源。两次握手=服务端收到SYN就分配资源，可能被历史连接欺骗。

**Q4: 四次挥手TIME_WAIT作用？**
① 确保最后ACK到达(丢了对方重发FIN) ② 让旧报文在网络中消散(2MSL≈60s)

**Q5: TCP如何保证可靠？**
确认应答+超时重传+滑动窗口+流量控制+拥塞控制(慢启动/拥塞避免/快重传/快恢复)

**Q6: TCP vs UDP？**
TCP面向连接/可靠/有序/慢(HTTP,SSH) | UDP无连接/不可靠/无序/快(DNS,视频,游戏)

**Q7: HTTP 1.0→1.1→2.0→3？**
1.0短连接 | 1.1持久连接+管道化+Host头 | 2多路复用+头部压缩+ServerPush | 3基于QUIC(UDP)零RTT

**Q8: HTTPS握手流程？**
ClientHello→ServerHello+证书→验证书+生成PreMaster→双方生成会话密钥→对称加密通信

**Q9: 中间人攻击如何防御？**
证书链验证+证书锁定+CA体系+HTTPS+HSTS

**Q10: DNS解析全过程？**
浏览器缓存→hosts→本地DNS→根域→顶级域→权威DNS→返回IP | 注意递归vs迭代、DNS污染/劫持

**Q11: Cookie/Session/Token/JWT？**
Cookie浏览器存自动带 | Session服务端存有状态 | Token无状态自管理 | JWT三段式自包含

**Q12: 跨域怎么解决？**
CORS(Access-Control-Allow-Origin)+JSONP(仅GET)+代理转发+postMessage

**Q13: XSS vs CSRF？**
XSS注入恶意脚本(反射/存储/DOM)防御输出编码CSP | CSRF利用登录态伪请求防御Token+SameSite

**Q14: 对称加密vs非对称？**
对称AES快但密钥分发难 | 非对称RSA慢但安全 | 实际混合:非对称传密钥→对称通信

**Q15: GET vs POST？**
GET参数在URL有长度限制幂等 | POST参数在Body无限制不幂等 | 实际区别:语义不同

**Q16: 状态码 200/301/302/304/400/401/403/404/500/502/503？**
200成功301永久重定向302临时304缓存400参数错401未认证403禁止404未找到500服务器错502网关错503不可用

**Q17: RESTful API设计原则？**
资源用名词复数+HTTP动词表示操作+版本号+状态码语义+分页参数+HATEOAS

**Q18: WebSocket原理？**
HTTP升级→101 Switching→全双工长连接→keepalive→适合即时通讯

**Q19: CDN原理？**
就近访问+DNS调度+内容缓存+源站回源+动静分离

**Q20: 正向代理vs反向代理？**
正向:客户端→代理→服务端(翻墙/匿名) | 反向:客户端→代理→内网服务(Nginx/负载均衡)`,
    quiz: [q('HTTP/2解决了什么？',['跨域','队头阻塞','缓存','认证'],1,'HTTP/2多路复用并发多请求避免HTTP/1.1队头阻塞'),q('JWT三段式？',['Header.Token.Sig','Header.Payload.Sig','Token.Secret.Key','Public.Private.Hash'],1,'JWT=base64(Header).base64(Payload).签名')],
    resources: [],
    expertNotes: [{author:'面试官', title:'高频追问', content:'问HTTP必追问HTTPS握手+中间人攻击，这两问必须背熟'}]
  },
  {
    id: 'interview-basic-i28', day: 28, title: '操作系统与计算机基础', subtitle: '进程线程·内存·IO·文件系统',
    objectives: ['操作系统核心概念速答'],
    keyPoints: ['进程vs线程','死锁4条件','虚拟内存','Linux权限','CPU调度'],
    content: `# 操作系统 20 道高频面试题

**Q1: 进程vs线程？**
进程=资源分配最小单位(独立地址空间) | 线程=CPU调度最小单位(共享进程地址空间) | 协程=用户态轻量线程

**Q2: 进程间通信IPC？**
管道(FIFO/匿名)、消息队列、共享内存(最快)、信号量、Socket、信号

**Q3: 死锁4必要条件+预防？**
①互斥 ②占有且等待 ③不可剥夺 ④循环等待 | 破任一条件:按序申请/超时放弃/银行家算法

**Q4: 虚拟内存？**
逻辑地址→物理地址映射、分页/分段、页面置换(LRU/LFU)、缺页中断、TLB快表

**Q5: 页面置换算法？**
OPT(最优)、FIFO、LRU(最近最少用)、LFU(最不常用)、Clock

**Q6: 用户态vs内核态？**
用户态受限不能直接访问硬件 | 内核态完全权限 | 切换:系统调用/中断/异常

**Q7: Linux文件权限644/755/777？**
rwx(读写执行)| user/group/other | chmod/chown | umask

**Q8: Linux常用命令？**
top/free/df/du/ps/netstat/ss/lsof/strace/tcpdump/find/grep/awk/sed

**Q9: 硬链接vs软链接？**
硬链接同一inode不能跨分区 | 软链接独立inode可跨分区本质路径

**Q10: Coredump？**
程序异常崩溃时内存快照、用gdb分析、ulimit -c开启

**Q11: 堆vs栈？**
栈编译器自动分配释放存局部变量快有限 | 堆程序员分配释放存大对象慢易泄漏

**Q12: 内存泄漏如何排查？**
valgrind/AddressSanitizer/heap profiler/代码审查智能指针

**Q13: 大端序vs小端序？**
大端=高位字节存低地址(网络序) | 小端=低位字节存低地址(x86) | htonl/ntohl转换

**Q14: CPU调度算法？**
FCFS/SJF/优先级/轮转RR/多级反馈队列 | CFS(Linux)

**Q15: 中断vs异常？**
中断=外部硬件异步 | 异常=CPU执行指令同步(缺页/除零/断点)

**Q16: 并发vs并行？**
并发=交替执行单核 | 并行=同时执行多核

**Q17: 锁的种类？**
互斥锁/自旋锁/读写锁/条件变量/信号量/RCU

**Q18: CAS乐观锁？**
Compare And Swap无锁原子操作、ABA问题(加版本号解决)

**Q19: 零拷贝？**
sendfile/splice减少用户态内核态数据拷贝、mmap映射

**Q20: Docker vs 虚拟机？**
Docker共享宿主机内核轻量启动快 | VM独立OS隔离好资源占用大`,
    quiz: [q('死锁必要条件不包括？',['互斥','占有且等待','优先级','循环等待'],2,'死锁4条件:互斥/占有且等待/不可剥夺/循环等待，优先级不是'),q('硬链接vs软链接哪个可以跨分区？',['硬链接','软链接','都可以','都不可以'],1,'软链接本质是路径字符串可跨分区，硬链接同一inode不能跨分区')]
  },
  {
    id: 'interview-basic-i29', day: 29, title: '网络安全核心概念', subtitle: '安全模型·加密·认证·防御体系',
    objectives: ['安全基础理论速答'],
    keyPoints: ['CIA三元组','AAA认证','PDRR模型','纵深防御','零信任','SDL','威胁建模'],
    content: `# 安全基础 20 问

**Q1: CIA三元组？**
机密性(Confidentiality加密访问控制)、完整性(Integrity哈希签名)、可用性(Availability冗余容灾)

**Q2: 安全模型？**
Bell-LaPadula(机密性不向上读向下写)、Biba(完整性不向下读向上写)、Clark-Wilson(完整性职责分离)

**Q3: AAA？**
认证(Authentication你是谁)、授权(Authorization你能干什么)、审计(Accounting你做了什么)

**Q4: 访问控制模型？**
DAC(自主Owner决定)、MAC(强制标签系统决定)、RBAC(角色)、ABAC(属性)

**Q5: PDRR/PPDR？**
Protection→Detection→Response→Recovery | Policy→Protection→Detection→Response

**Q6: 纵深防御？**
多层防御体系:网络边界·主机·应用·数据 层层设防 任何单点失败不导致整体失守

**Q7: 零信任架构？**
Never Trust Always Verify、微隔离、持续验证、最小权限、假设已入侵

**Q8: SDL安全开发生命周期？**
需求安全分析→安全设计(威胁建模)→安全编码→安全测试→安全发布→应急响应

**Q9: 威胁建模STRIDE？**
欺骗/篡改/否认/信息泄露/拒绝服务/权限提升 → 对应CIA+认证+授权+不可否认

**Q10: 密码学基础？**
哈希(MD5/SHA)不可逆防篡改 | 对称(AES/DES)加解密同密钥 | 非对称(RSA/ECC)公私钥对

**Q11: 数字签名过程？**
A对消息哈希→用私钥加密=签名 | B收到→用A公钥解密签名→比对哈希→验签成功

**Q12: 数字证书？**
CA签发=公钥+身份信息+CA签名 | X.509格式 | PKI体系

**Q13: 哈希碰撞攻击？**
找到两个不同输入产生相同哈希值 | MD5/SHA1已不推荐→SHA256+

**Q14: HMAC？**
带密钥的哈希=防篡改+防伪装 | HMAC-SHA256

**Q15: 彩虹表？**
预计算哈希链加速密码破解 | 防御:盐(salt)+慢哈希(bcrypt/scrypt/Argon2)

**Q16: Kerberos协议？**
客户端→AS拿TGT→TGS拿ST→服务 | 基于票据+对称密钥

**Q17: OAuth2.0？**
授权码模式:用户登录授权→获得code→用code换token→用token访问资源

**Q18: SSO单点登录？**
CAS/OAuth/OIDC/SAML | 一次登录多系统共享会话

**Q19: 等保2.0？**
网络安全等级保护:定级→备案→整改→测评→检查 | 二级起步三级基本要求

**Q20: 应急响应流程？**
准备→检测→抑制→根除→恢复→复盘(PDCERF)`,
    quiz: [q('CIA分别代表？',['加密/完整/认证','机密/完整/可用','控制/检验/审计','证书/身份/访问'],1,'CIA=Confidentiality机密性+Integrity完整性+Availability可用性'),q('STRIDE中E代表？',['加密','逃逸','权限提升','信息泄露'],2,'STRIDE中E=Elevation of Privilege权限提升')]
  },
  {
    id: 'interview-basic-i30', day: 30, title: 'OWASP Top 10 详解', subtitle: 'Web安全核心漏洞',
    objectives: ['OWASP Top10每类都能说清'],
    keyPoints: ['注入','失效认证','敏感数据泄露','XXE','失效访问控制','安全配置错误','XSS','不安全反序列化','已知漏洞组件','日志监控不足'],
    content: `# OWASP Top 10 逐条详解

**1. 注入 — SQL注入为例**
\`\`\`
# 经典: SELECT * FROM users WHERE name='$input'
# 输入: ' OR 1=1 -- 
→ WHERE name='' OR 1=1 --'  返回所有用户
\`\`\`
防御: 参数化查询(PreparedStatement)、ORM、输入校验、最小权限

**2. 失效的身份认证**
弱密码·暴力破解·凭证填充·Session固定·JWT未验签
防御: MFA、强密码策略、限速、JWT验签

**3. 敏感数据泄露**
明文存储·传输未加密·日志泄露·API返回过多
防御: 加密存储、TLS、脱敏日志、最小返回

**4. XML外部实体注入(XXE)**
\`\`\`xml
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
\`\`\`
防御: 禁用外部实体、用JSON代替XML、更新解析器

**5. 失效的访问控制**
水平越权(同权限看别人数据)、垂直越权(低权限做高权限操作)
防御: 服务端统一鉴权、最小权限、RBAC/ABAC

**6. 安全配置错误**
默认密码·目录遍历·错误信息·不必要的HTTP方法·CORS配置过宽
防御: 安全加固、最小化、定期扫描

**7. XSS跨站脚本**
反射型·存储型·DOM型
防御: 输出编码、CSP、HttpOnly、输入校验

**8. 不安全的反序列化**
Java(ObjectInputStream)、PHP(unserialize)、Python(pickle)
防御: 签名校验、白名单类、不用不可信数据反序列化

**9. 使用含有已知漏洞的组件**
依赖了有CVE的库(Log4shell/Struts2/Spring)
防御: SCA扫描、依赖更新、最小依赖

**10. 日志和监控不足**
攻击持续发生却无人知晓
防御: 日志集中收集、SIEM、告警阈值、定期审计`,
    quiz: [q('哪个不是OWASP Top10常见项？',['SQL注入','XSS','CSRF','失效访问控制'],2,'CSRF不在OWASP Top10单独列项归入失效访问控制'),q('XXE防御最有效的方法？',['输入过滤','禁用外部实体','WAF','使用SSL'],1,'禁用外部实体直接从根源消除XXE风险')]
  },
  {
    id: 'interview-basic-i31', day: 31, title: 'Web安全深度', subtitle: 'SQL注入·XSS·SSRF·文件上传·命令注入',
    objectives: ['常见Web漏洞原理利用防御精通'],
    keyPoints: ['SQLi盲注','二次注入','CSP绕过','HttpOnly','SSRF','文件上传绕过'],
    content: `# Web安全深度面试题

**Q1: SQL注入分类？**
联合查询注入、布尔盲注、时间盲注、报错注入、堆叠注入、二次注入、宽字节注入

**Q2: 盲注怎么利用？**
布尔盲注:页面有差异(如返回长度)逐字符猜 | 时间盲注:if(substr(...),sleep(0.5),0)逐字符猜

**Q3: SQL注入绕过WAF？**
双写(uniunionon)、大小写(UnIoN)、编码(url/hex/unicode)、注释(/**/)、等价符(or=||)

**Q4: XSS绕过CSP？**
CSP绕过:JSONP回调、DOM clobbering、script gadgets、不完整策略

**Q5: SSRF怎么打内网？**
gopher协议打Redis/MySQL、file读文件、dict探测端口、302跳转绕过黑名单

**Q6: 文件上传绕过？**
前端校验绕过、Content-Type修改、黑名单绕过(.php5/.phtml/.htaccess)、图片马+解析漏洞、%00截断(file.php%00.jpg)

**Q7: XXE高级利用？**
读文件、SSRF、端口扫描、DoS(billion laughs)、盲XXE(out-of-band)

**Q8: 反序列化链？**
Java: HashMap→readObject→反射(Runtime.exe) | PHP: magic methods(__wakeup/__destruct)

**Q9: 模板注入SSTI？**
Jinja2: {{config}} {{''.__class__.__mro__[2].__subclasses__()}} | FreeMarker/Thymeleaf类似

**Q10: CRLF注入？**
用%0d%0a分割HTTP头实现HTTP响应拆分 Set-Cookie伪造`,
    quiz: [q('时间盲注用哪个函数？',['sleep()','wait()','delay()','timeout()'],0,'MySQL时间盲注常用sleep或benchmark，MSSQL用waitfor delay'),q('哪种方式不能绕过文件上传黑名单？',['双扩展名','大小写','%00截断','参数化查询'],3,'参数化查询是SQL防御方式与文件上传无关')]
  },
  {
    id: 'interview-basic-i32', day: 32, title: '密码学与认证授权', subtitle: '加密算法·PKI·TLS·OAuth·JWT',
    objectives: ['密码学核心概念面试必答'],
    keyPoints: ['AES/RSA/ECC','Diffie-Hellman','TLS1.3','证书链','JWT安全','OAuth2.0'],
    content: `# 密码学深度面试题

**Q1: 对称加密AES？**
分组128bit、密钥128/192/256、ECB/CBC/GCM模式、CTR流模式
ECB不安全相同明文→相同密文 | CBC需要随机IV | GCM提供AEAD

**Q2: RSA原理？**
选两大素数p,q、n=pq、φ(n)=(p-1)(q-1)、选e与φ(n)互质、d=e⁻¹ mod φ(n)
公钥(e,n)加密c=m^e mod n | 私钥(d,n)解密m=c^d mod n

**Q3: ECC vs RSA？**
ECC用更短密钥达到同等安全(256bit ECC≈3072bit RSA) | 适合移动/嵌入式

**Q4: Diffie-Hellman？**
A选a计算g^a发B | B选b计算g^b发A | 双方计算g^(ab)=共同密钥
中间人攻击:认证DH/ECDHE需要证书签名防篡改

**Q5: TLS 1.3改进？**
① 1-RTT握手 ② 移除不安全算法(RC4/MD5) ③ 仅AEAD ④ 0-RTT重连 ⑤ encryped SNI

**Q6: 数字证书链？**
Root CA→Intermediate CA→Server Cert | 逐级验证签名至信任锚

**Q7: JWT安全问题？**
none算法绕过、密钥暴力(HS256弱密钥)、未验签名、敏感信息明文在payload

**Q8: OAuth2.0四种模式？**
授权码(Web应用)、隐式(SPA已废弃)、密码(信任客户端)、客户端凭证(服务间)

**Q9: OIDC vs OAuth2.0？**
OAuth2.0=授权框架 | OIDC=OAuth2.0之上加身份认证(id_token+UserInfo)

**Q10: 密码存储最佳实践？**
bcrypt/scrypt/Argon2慢哈希+盐 → 绝对不用MD5/SHA直接存密码`,
    quiz: [q('ECC 256bit相当于RSA多少bit？',['1024','2048','3072','4096'],2,'ECC 256≈RSA 3072安全强度'),q('JWT none算法攻击如何防御？',['不用JWT','验签时拒绝none','加密payload','缩短token'],1,'验签时显式拒绝none算法即可防御')]
  },
  {
    id: 'interview-basic-i33', day: 33, title: '内网安全与域渗透基础', subtitle: 'AD域·Kerberos·横向移动·提权',
    objectives: ['内网基础概念掌握'],
    keyPoints: ['AD域结构','Kerberos攻击','黄金票据','NTLM','哈希传递','横向移动'],
    content: `# 内网安全面试题

**Q1: AD域是什么？**
Active Directory微软目录服务、集中管理用户/计算机/策略、LDAP+Kerberos+DNS

**Q2: Kerberos攻击？**
Kerberoasting(破解服务票据)、Golden Ticket(伪造TGT krbtgt)、Silver Ticket(伪造ST服务票据)、AS-REP Roasting(免预认证用户)

**Q3: 黄金票据vs白银票据？**
Golden Ticket: krbtgt hash→伪造任意TGT→可生成任意ST→访问任意服务(域控最高权限)
Silver Ticket: 服务hash→伪造该服务ST→只能访问该服务(范围受限)

**Q4: NTLM认证流程？**
客户端发送用户名→服务端发Challenge→客户端用NTLM Hash加密Challenge→服务端验证

**Q5: PTH哈希传递？**
用NTLM Hash直接认证无需明文 | 工具:mimikatz(sekurlsa::pth) | 防御:Credential Guard

**Q6: PTT票据传递？**
导出内存中的Kerberos票据在其他机器使用 | 无需提权到SYSTEM

**Q7: 横向移动手法？**
PsExec/WMI/SMB/远程桌面/WinRM/计划任务/DCOM

**Q8: Windows提权？**
服务权限错误(UAC绕过)、内核漏洞、Token窃取、AlwaysInstallElevated、计划任务

**Q9: 域内信息收集？**
net view/net group "domain admins"/BloodHound/PowerView

**Q10: 内网穿透/端口转发？**
frp/ngrok/SSH隧道/reGeorg/HTTP隧道`,
    quiz: [q('黄金票据需要哪个hash？',['administrator hash','krbtgt hash','machine hash','service hash'],1,'Golden Ticket需krbtgt的NTLM hash来伪造TGT'),q('PTH需要什么？',['明文密码','NTLM Hash','Kerberos票据','SSL证书'],1,'Pass-The-Hash用NTLM Hash直接认证无需明文')]
  },
  {
    id: 'interview-basic-i34', day: 34, title: '安全运营与应急响应', subtitle: 'SOC·SIEM·EDR·应急响应流程',
    objectives: ['安全运营面试速答'],
    keyPoints: ['SIEM','EDR/XDR','威胁狩猎','应急响应','日志分析','SOAR'],
    content: `# 安全运营面试题

**Q1: SOC日常运营？**
日志收集分析、告警研判、事件响应、威胁狩猎、漏洞管理、基线检查

**Q2: SIEM是什么？**
Security Information and Event Management | Splunk ELK Qradar | 日志聚合+关联分析+告警

**Q3: EDR vs XDR？**
EDR端点检测响应(单终端) | XDR扩展检测响应(跨终端/网络/云/邮件)

**Q4: 应急响应流程？**
PDCERF: 准备(工具/人员/预案)→检测(发现)→抑制(断网/下线)→根除(清后门)→恢复(上线)→复盘

**Q5: 常见告警研判？**
暴力破解、异常登录(异地/非工时)、敏感命令执行、webshell上传、C2通信、数据泄露

**Q6: 日志分析重点？**
登录日志(Security Event 4624/4625)、进程创建(Sysmon 4688)、网络连接(5156)、PowerShell(4104)

**Q7: 威胁狩猎？**
主动寻找已绕过防御系统的威胁 | MITRE ATT&CK映射 | 假设已入侵的思维

**Q8: SOAR？**
安全编排自动化响应 | 剧本(Playbook)自动处理常规告警 | 减少MTTR

**Q9: 漏洞管理流程？**
资产发现→漏洞扫描→风险评估→修复→验证→复扫 | CVSS评分优先级

**Q10: 安全基线？**
CIS Benchmark | 密码策略/日志审计/最小安装/防火墙规则/服务最小化`,
    quiz: [q('SIEM核心功能不包括？',['日志聚合','关联分析','漏洞扫描','告警'],2,'SIEM主要做日志聚合关联告警，漏洞扫描是单独的漏洞管理系统'),q('PDCERF中C代表？',['控制','遏制','检查','清除'],1,'PDCERF中C=Containment遏制/抑制')]
  },
  {
    id: 'interview-basic-i35', day: 35, title: '安全合规与数据隐私', subtitle: '等保·GDPR·个人信息保护法·ISO27001',
    objectives: ['安全合规面试必问'],
    keyPoints: ['等保2.0','分级保护','GDPR','个人信息保护法','数据安全法','ISO27001','网络安全法'],
    content: `# 安全合规面试题

**Q1: 网络安全法核心？**
网络实名制、网络安全等级保护、关键信息基础设施保护、个人信息保护、应急响应义务

**Q2: 等保2.0 vs 1.0？**
新增:云计算/移动互联/物联网/工控/大数据扩展要求 | 三级要求从175项→211项 | 增加可信验证

**Q3: 等保定级？**
一级(自主保护)二级(指导保护)三级(监督保护)四级(强制保护)五级(专控保护)

**Q4: 数据安全法要点？**
数据分类分级、数据安全审查、跨境数据管理、重要数据保护

**Q5: 个人信息保护法？**
知情同意、最小必要、目的限制、删除权、可携带权、影响评估(DPIA)

**Q6: GDPR？**
适用范围(欧盟)、数据主体权利、DPO、72小时通报、巨额罚款(4%全球营收)

**Q7: ISO27001？**
信息安全管理体系ISMS | PDCA循环 | 控制项Annex A共114项

**Q8: 风险评估方法？**
定性vs定量、ALE=SLE×ARO、风险矩阵、威胁建模

**Q9: SOC2 vs ISO27001？**
SOC2关注服务组织控制(安全/可用/处理完整性/机密/隐私) | ISO27001是管理体系认证

**Q10: 安全审计？**
日志审计、配置审计、代码审计、渗透测试、合规审计、供应链审计`,
    quiz: [q('等保三级属于什么保护级别？',['自主保护','指导保护','监督保护','强制保护'],2,'等保三级=监督保护，国家监管部门监督'),q('GDPR数据泄露通知时限？',['24小时','48小时','72小时','7天'],2,'GDPR要求72小时内通知监管机构')]
  },
  {
    id: 'interview-basic-i36', day: 36, title: '代码安全与开发安全', subtitle: '安全编码·代码审计·DevSecOps',
    objectives: ['安全开发基础概念'],
    keyPoints: ['安全编码','代码审计','DevSecOps','SAST/DAST/IAST','供应链安全','SCA'],
    content: `# 代码安全面试题

**Q1: 安全编码常见问题？**
输入校验不足、输出编码遗漏、权限校验缺失、异常信息泄露、不安全的依赖

**Q2: SAST vs DAST？**
SAST白盒静态分析(源代码)→开发阶段 | DAST黑盒动态测试(运行态)→测试阶段 | IAST插桩→两者结合

**Q3: DevSecOps？**
把安全嵌入DevOps全流程: 开发(Lint/SAST)→构建(SCA)→测试(DAST/IAST)→部署(镜像扫描/配置检查)→运行(RASP)

**Q4: SCA软件成分分析？**
识别第三方依赖+已知漏洞(CVE)+许可证合规 | 工具:Dependency-Check/Snyk/BlackDuck

**Q5: 安全代码审计方法？**
①敏感函数追踪(exec/system/eval) ②污点分析(taint tracking) ③控制流分析(权限绕过)

**Q6: RASP？**
Runtime Application Self-Protection 运行时应用自我保护 | 插桩在应用内部检测和阻断攻击

**Q7: 供应链安全？**
SolarWinds教训:验证第三方软件来源+签名校验+最小权限+持续监控

**Q8: API安全？**
认证(Token/JWT)、授权(OAuth)、限速、输入校验、响应最小化、API Gateway

**Q9: 安全SDK设计？**
默认安全、最小权限、API简洁防误用、加密强算法、密钥管理

**Q10: 安全评审Checklist？**
认证是否完善、权限是否校验、输入是否过滤、输出是否编码、日志是否脱敏`,
    quiz: [q('SAST是什么类型测试？',['黑盒','白盒','灰盒','渗透测试'],1,'SAST=Static Application Security Testing静态白盒分析源码'),q('RASP运行在哪个阶段？',['编码','编译','测试','运行时'],3,'RASP=Runtime Application Self-Protection插桩运行时代码')]
  },
  {
    id: 'interview-basic-i37', day: 37, title: '场景模拟 Day 1', subtitle: '模拟真实面试追问',
    objectives: ['应对面试官连环追问'],
    keyPoints: ['结构化表达','STAR法则','连环答','反问环节'],
    content: `# 模拟面试场景

**场景1:被问到"一个请求从浏览器到服务器经历了什么"**
你的回答框架：
① DNS解析(递归/迭代/缓存)
② TCP三次握手(SYN→SYN-ACK→ACK)
③ TLS握手(HTTPS情况)  
④ HTTP请求构造(请求行/头/体)
⑤ 服务端处理(负载均衡→Web服务器→应用→数据库)
⑥ 响应返回(状态码/内容)
⑦ 浏览器渲染(HTML/CSS/JS)
⑧ 四次挥手

**追问预判**：TLS用了哪个版本？为什么1.3更好？会话恢复怎么做？CDN在这过程中哪一步介入？

**场景2:被问到"你怎么发现某个漏洞的"**
STAR法则回答：
Situation: 在XX项目安全测试中
Task: 需要评估Web应用安全性
Action: 先用Burp抓包发现API参数未校验，尝试修改userId参数
Result: 成功越权访问其他用户数据，确认为水平越权漏洞，已推动修复

**场景3:被问到"你做过的最有成就感的安全项目"**
同样套STAR，突出:你主动做了什么、解决了什么难题、带来了什么价值

**场景4:反问环节**
不要问"加班吗""福利怎么样"——问:
- 团队目前主要面临哪些安全挑战？
- 安全建设处于哪个阶段(从0到1还是优化)？
- 团队的安全工具链是怎么样的？

**场景5:被问到不知道的问题**
不要说"不知道"就结束——说"这个问题我目前了解不深，但我的理解是XXX，我下来会深入学习"`,
    quiz: [q('面试回答复杂问题推荐用什么框架？',['SMART','STAR','SWOT','PDCA'],1,'STAR=Situation Task Action Result结构化讲故事'),q('反问环节应该问什么？',['薪资','加班','团队挑战','放假天数'],2,'问团队挑战展现你的关注点和专业度')]
  },
  {
    id: 'interview-basic-i38', day: 38, title: '简历包装与自我介绍', subtitle: '让面试官60秒记住你',
    objectives: ['自我介绍亮点突出','简历无硬伤'],
    keyPoints: ['三要素自我介绍','简历硬伤检查','项目描述公式'],
    content: `# 简历与自我介绍

**自我介绍60秒公式**：
① 我是谁(学校/专业/工作年限) 10s
② 我做过什么(1-2个核心项目用STAR简述) 30s
③ 为什么我适合(技术栈+安全方向匹配) 15s
④ 收尾(表达兴趣) 5s

**简历硬伤检查清单**：
❌ 错别字(低级错误致命)
❌ 技术栈罗列太多不精("精通"要能回答)
❌ 项目描述只说做了什么不说成果(无数据/无影响)
❌ 时间线有空白无法解释
❌ 岗位不匹配(投红队但简历全是运维)

**项目描述公式**：
"针对[什么问题]使用[什么技术]实现了[什么结果]使[什么指标]提升了[多少]"
例:"针对SQL注入防御不足问题，引入预编译+WAF+基线检查，使注入漏洞降低90%"

**技能打分法**：
精通(80%以上问题能答)→熟悉(60%能答)→了解(知道概念)→放在简历上用词对应真实水平`,
    quiz: []
  },
  {
    id: 'interview-basic-i39', day: 39, title: '安全岗位全景与职业规划', subtitle: '红蓝紫队·甲方乙方·技术方向',
    objectives: ['理解安全行业全景和岗位选择'],
    keyPoints: ['红蓝紫队','甲方vs乙方','产品安全vs企业安全','攻防研究vs安全开发','职业发展路径'],
    content: `# 安全岗位全景图

**大方向分类**：
🔴 红队/攻防: 渗透测试、漏洞挖掘、红队演练、APT模拟
🔵 蓝队/防御: SOC分析师、安全运营、应急响应、威胁狩猎
🟣 紫队/管理: 安全架构、安全合规、安全管理、安全咨询
🟢 安全开发: 安全工具开发、安全SDK、SDL、DevSecOps

**甲方vs乙方**：
甲方(企业): 纵深宽但深度可能有限、了解业务、工作稳定
乙方(安全厂商): 技术深度强、接触多行业、压力大但成长快

**产品安全vs企业安全**：
产品安全: 一个产品的安全全生命周期(SDL、代码审计、渗透测试)
企业安全: 企业的安全体系(SOC、合规、网络防护、办公安全)

**常见面试岗位要求**：
- 渗透测试工程师: 漏洞原理+利用+工具+报告
- SOC/安全运营: SIEM+告警研判+应急响应+日志分析
- 安全开发: 编码能力+安全知识+工具开发
- 安全合规: 等保+法规+文档能力+沟通
- 安全研究: 漏洞发现+深度研究能力+CTF

**职业发展常见路径**：
技术线: 初级→中级→高级→专家/架构师→首席科学家
管理线: 工程师→安全主管→安全总监→CSO

**面试常见追问**: 你对自己3-5年的规划是什么？→表达技术深耕+业务理解的意愿`,
    quiz: []
  },
  {
    id: 'interview-basic-i40', day: 40, title: '全真模拟面试', subtitle: '20道随机面试题 · 独立作答',
    objectives: ['模拟真实面试·查漏补缺'],
    keyPoints: ['限时作答','结构化表达','自评纠错'],
    content: `# 全真模拟面试 — 基础模块

限时60分钟独立完成以下20题，每题3分钟。不会的标记，结束后针对性复习。

**1.** 说说TCP三次握手，为什么不是两次？

**2.** HTTPS握手过程和TLS 1.3的改进？

**3.** HTTP 1.0/1.1/2/3的区别？

**4.** XSS三种类型和防御方式？

**5.** SQL注入分类和盲注怎么利用？

**6.** CSRF原理和防御？

**7.** OWASP Top 10说出至少6条

**8.** 对称加密和非对称加密区别？各自代表算法？

**9.** JWT是什么？安全问题有哪些？

**10.** DNS解析全过程？

**11.** 进程和线程的区别？

**12.** 死锁四个必要条件？

**13.** SSRF原理和如何打内网？

**14.** 等保2.0定级和三级要求？

**15.** 数字签名和数字证书原理？

**16.** 应急响应流程？PDCERF每步做什么？

**17.** CIA三元组是什么？

**18.** 零信任的核心思想？

**19.** 文件上传绕过方式有哪些？

**20.** 金票银票区别和利用条件？

---

**自评标准**:
- 答对16+题: 基础扎实，面试官很难挂你
- 答对12-15题: 有准备但需强化原理
- 答对12题以下: 回头重学前9天的核心概念`,
    quiz: [
      q('TCP三次握手为什么不是两次？简要回答',[],-1,'防止旧SYN导致服务器建立无效连接，两次时服务端收到SYN就分配资源'),
      q('说出至少8个OWASP Top 10',[],-1,'注入/失效认证/敏感数据泄漏/XXE/失效访问控制/安全配置错误/XSS/不安全反序列化/已知漏洞组件/日志监控不足')
    ]
  },
  {
    id: 'interview-basic-i41', day: 41, title: '全真模拟面试（一）', subtitle: '自我介绍·技术问答·场景设计',
    objectives: ['完成一次30分钟全真模拟面试'],
    keyPoints: ['自我介绍','技术问答链式追问','场景设计','抗压测试'],
    content: '# 网络安全基础方向 — 全真模拟面试（一）：自我介绍·技术问答·场景设计\n\n## 🎯 今日目标\n\n完成一次30分钟全真模拟面试，重点练习自我介绍和技术问答的开场部分。\n\n---\n\n## 📋 模拟面试流程\n\n### 第一环节：自我介绍（3分钟）\n\n**模板**：\n\n> 面试官好，我是XXX，有X年网络安全基础方向经验。\n> 我擅长[核心技能1]、[核心技能2]和[核心技能3]。\n> 最近参与过[代表性项目]，在这个项目中我负责[你的角色]，取得了[量化成果]。\n> 我一直关注网络安全基础领域的最新动态，对[热点技术]有深入研究。\n> 希望能加入贵团队，在网络安全基础方向持续深耕。\n\n**关键技巧**：控制在3分钟内 | 用数字量化成果 | 与岗位JD对应 | 结尾留悬念引导追问\n\n### 第二环节：技术问答链式追问（15分钟）\n\n面试官会从你的自我介绍中挑一个技术点深挖，准备应对3-5层追问：\n\n**链式追问示例**（以"Web安全"为例）：\n1. Q: "你说熟悉Web安全，讲一个你挖过的有意思的漏洞？"\n2. Q: "为什么当时选择用这个工具而不是另一个？"\n3. Q: "如果WAF拦截了你的payload，你会怎么绕过？"\n4. Q: "你挖的这个漏洞的根本原因是什么？架构上怎么避免？"\n5. Q: "如果你来设计这个系统的安全方案，你会怎么做？"\n\n**应对策略**：不知道的诚实说不会但展示学习思路 | 每个回答控制在1-2分钟 | 适时反问确认问题\n\n### 第三环节：场景设计题（12分钟）\n\n**典型场景题**："如果公司新上线一个网络安全基础相关的系统，从安全角度你会怎么评估？"\n\n**回答框架**：\n1. 资产梳理 → "首先我会梳理系统的资产：有哪些组件、暴露哪些端口、处理什么数据"\n2. 威胁建模 → "然后用STRIDE/攻击树方法梳理可能的威胁"\n3. 风险评估 → "对威胁进行风险评级，确定优先级"\n4. 测试验证 → "通过渗透测试/代码审计验证漏洞"\n5. 修复建议 → "给出分层的修复方案和整改时间线"\n\n---\n\n## 📝 面试评分卡（自评）\n\n| 维度 | 1分(差) | 2分(一般) | 3分(好) | 4分(优秀) |\n|------|---------|-----------|---------|----------|\n| 表达清晰度 | □ | □ | □ | □ |\n| 技术深度 | □ | □ | □ | □ |\n| 逻辑思维 | □ | □ | □ | □ |\n| 场景分析 | □ | □ | □ | □ |\n| 抗压表现 | □ | □ | □ | □ |\n',
    quiz: []
  },
  {
    id: 'interview-basic-i42', day: 42, title: '全真模拟面试（二）', subtitle: '协议分析·漏洞原理·工具实操',
    objectives: ['深度技术面试模拟'],
    keyPoints: ['协议分析','漏洞原理','工具实操','防御方案'],
    content: '# 网络安全基础方向 — 全真模拟面试（二）：协议分析·漏洞原理·工具实操\n\n## 🎯 今日目标\n\n深度技术面试模拟，聚焦网络安全基础方向的核心技术问题。\n\n---\n\n## 📋 高频技术面试题\n\n以下是面试中高频出现的技术问题，每道题都要能做到「流畅口述回答」而非「心里知道」。\n\n### Q1：请解释TCP三次握手过程，以及SYN Flood攻击如何利用这一机制？\n\n**参考答案**：三次握手：Client→SYN→Server→SYN+ACK→Client→ACK→Server。SYN Flood攻击者发送大量SYN包但不完成握手，服务端半连接队列被占满，正常用户无法连接。防御：SYN Cookie、增加半连接队列、缩短超时时间、防火墙限流。\n\n**口述练习要点**：\n- 用自己的话重新组织，不要背答案\n- 控制在2分钟内\n- 先给结论再展开，如"核心是三点：第一...第二...第三..."\n- 准备被追问的深度（面试官会追问"为什么""还有呢"）\n\n---\n\n### Q2：SQL注入的原理是什么？如何防御？\n\n**参考答案**：原理：将恶意SQL代码插入应用输入参数，后端拼接执行。分类：联合查询注入、报错注入、布尔盲注、时间盲注、堆叠注入。防御：参数化查询/预编译（最有效）、输入验证白名单、最小权限原则、WAF。\n\n**口述练习要点**：\n- 用自己的话重新组织，不要背答案\n- 控制在2分钟内\n- 先给结论再展开，如"核心是三点：第一...第二...第三..."\n- 准备被追问的深度（面试官会追问"为什么""还有呢"）\n\n---\n\n### Q3：CSRF和XSS有什么区别？各自的防御方式？\n\n**参考答案**：XSS是注入恶意脚本到页面执行（偷Cookie、劫持会话），CSRF是诱导用户点击链接发送已认证请求（改密码、转账）。XSS防御：输出编码、CSP、HttpOnly Cookie。CSRF防御：CSRF Token、SameSite Cookie、Referer校验。\n\n**口述练习要点**：\n- 用自己的话重新组织，不要背答案\n- 控制在2分钟内\n- 先给结论再展开，如"核心是三点：第一...第二...第三..."\n- 准备被追问的深度（面试官会追问"为什么""还有呢"）\n\n---\n\n### Q4：HTTPS的TLS握手过程是怎样的？\n\n**参考答案**：ClientHello(支持的密码套件+随机数)→ServerHello(选定套件+随机数+证书)→Client验证证书→Client生成Pre-Master用公钥加密发送→双方用三个随机数生成Session Key→Finished消息确认。前向安全性由ECDHE密钥交换保证。\n\n**口述练习要点**：\n- 用自己的话重新组织，不要背答案\n- 控制在2分钟内\n- 先给结论再展开，如"核心是三点：第一...第二...第三..."\n- 准备被追问的深度（面试官会追问"为什么""还有呢"）\n\n---\n\n### Q5：日常使用的安全工具和它们的作用？\n\n**参考答案**：Nmap(端口扫描/服务识别)、Burp Suite(Web渗透测试代理)、Wireshark(网络抓包分析)、Metasploit(漏洞利用框架)、Sqlmap(SQL注入自动化)、Hydra(密码破解)、Nessus(漏洞扫描)、John the Ripper(密码哈希破解)。\n\n**口述练习要点**：\n- 用自己的话重新组织，不要背答案\n- 控制在2分钟内\n- 先给结论再展开，如"核心是三点：第一...第二...第三..."\n- 准备被追问的深度（面试官会追问"为什么""还有呢"）\n\n---\n\n## 🎭 模拟面试：角色扮演\n\n找一位朋友扮演面试官，或对着镜子/录音练习：\n\n1. 面试官："请做一个简短的自我介绍"（你的回答应与网络安全基础方向相关）\n2. 面试官随机抽上面的1-2道题追问\n3. 面试官对回答进行3层追问，测试深度\n4. 结束后互评：哪些回答好？哪些需要补？\n\n---\n\n## 📊 技术面试自评\n\n| 题目 | 能口述回答？ | 能扛2层追问？ | 需要补充的知识 |\n|------|-------------|-------------|---------------|\n| 请解释TCP三次握手过程，以及SYN Flood攻击如何利用... | □是 □否 | □是 □否 | |\n| SQL注入的原理是什么？如何防御？... | □是 □否 | □是 □否 | |\n| CSRF和XSS有什么区别？各自的防御方式？... | □是 □否 | □是 □否 | |\n| HTTPS的TLS握手过程是怎样的？... | □是 □否 | □是 □否 | |\n| 日常使用的安全工具和它们的作用？... | □是 □否 | □是 □否 | |\n',
    quiz: []
  },
  {
    id: 'interview-basic-i43', day: 43, title: '全真模拟面试（三）', subtitle: '项目经验深挖·行为面试',
    objectives: ['项目讲述与行为面试'],
    keyPoints: ['项目STAR讲述','冲突解决','团队协作','失败案例'],
    content: '# 网络安全基础方向 — 全真模拟面试（三）：项目经验深挖·行为面试\n\n## 🎯 今日目标\n\n掌握STAR法则讲述项目经验，应对行为面试中的各类场景题。\n\n---\n\n## 📋 项目经验面试（STAR法则）\n\n### 面试题：请用STAR法则讲述一个你参与的安全项目。\n\n**回答指引**：Situation: 公司面临什么安全威胁。Task: 你的具体任务(如漏洞修复/安全评估)。Action: 采取的步骤(工具选择→方案设计→执行→验证)。Result: 量化成果(修复X个漏洞/降低Y%风险)。\n\n---\n\n### 面试题：描述一次你与技术团队解决冲突的经历。\n\n**回答指引**：示例场景：开发团队认为你报告的低危漏洞"不重要"。你的做法：用CVSS评分+业务影响分析证明风险→提供具体修复方案→协助排期→建立安全左移流程。\n\n---\n\n### 面试题：遇到不熟悉的技术问题时如何处理？\n\n**回答指引**：结构化方法：明确问题边界→查阅官方文档和CVE→搭建测试环境复现→社区/同事求助→记录知识库。强调学习能力和主动性。\n\n---\n\n## 🗣️ 行为面试常见问题\n\n**Q: "你最大的缺点是什么？"**\n\n> 不要说"我太追求完美"这样的假缺点。真诚但策略性地回答：选一个真实但不致命的缺点，然后强调你在如何改进。例如："我有时太专注于技术细节，在时间管理上需要加强。我现在的做法是用番茄钟设定硬性截止时间，效果不错。"\n\n**Q: "为什么离开上一家公司？"**\n\n> 向前看而非向后看。"在上一家公司学到了X和Y，但希望能有更多机会深入Z方向，这与贵团队的定位非常匹配。"\n\n**Q: "你未来的职业规划是什么？"**\n\n> 短期(1-2年)：深耕网络安全基础技术，成为团队的技术骨干。中期(3-5年)：积累架构设计经验，能独立负责大型安全项目的方案设计和落地。长期(5年+)：成为网络安全基础领域的专家，反哺社区和新人。\n\n---\n\n## ✅ 今日任务清单\n\n1. □ 准备2-3个STAR故事（每个3分钟版本）\n2. □ 对着镜子练习项目讲述，录音回听\n3. □ 准备3个"你有什么问题想问我们"的反问\n4. □ 与朋友做一次15分钟模拟行为面试\n',
    quiz: []
  },
  {
    id: 'interview-basic-i44', day: 44, title: '全真模拟面试（四）', subtitle: 'HR面·薪资谈判·职业规划',
    objectives: ['HR面试与谈薪'],
    keyPoints: ['职业规划','薪资谈判','企业文化','反问技巧'],
    content: '# 网络安全基础方向 — 全真模拟面试（四）：HR面·薪资谈判·职业规划\n\n## 🎯 今日目标\n\n掌握HR面试的沟通策略和薪资谈判技巧。\n\n---\n\n## 💰 薪资谈判策略\n\n### 谈判前的准备\n\n- **市场调研**：了解目标公司/行业/城市的薪资范围（参考：Boss直聘/Lagou/脉脉/Glassdoor）\n- **自我定位**：网络安全基础方向X年经验的市场价位是多少？\n- **底线/期望/理想**：设定三个数字（低于底线不考虑/合理期望/努力可达）\n- **替代方案BATNA**：如果这个Offer没谈成，你还有其他选择吗？\n\n### HR常见话术与应对\n\n| HR话术 | 真实含义 | 你的应对 |\n|--------|---------|----------|\n| "你的期望薪资是多少？" | 试探你的底线 | "我了解贵司在这个岗位的预算范围吗？"先把球踢回去 |\n| "我们内部有薪资体系，可能达不到你的期望" | 压价 | "除了base，能了解下总包包含哪些吗？年终/股票/补贴/培训" |\n| "我们很认可你，但需要看HC审批" | 可能在拖或者压价 | "理解，我这边也有其他面试在流程中，希望能尽快确认" |\n| "这个岗位的预算就是X" | 这就是上限了 | 如果X低于底线，礼貌拒绝；接近期望，可以谈其他福利(远程/弹性/培训预算) |\n\n### 总包(Total Package)谈判清单\n\n不是只谈月薪！可以谈的包括：\n- 基本工资(Base)\n- 年终奖/绩效奖金(Bonus) — 问清楚是几个月、什么考核标准\n- 股票/期权(RSU/Options) — 行权价、归属期、公司估值\n- 签字费(Sign-on Bonus)\n- 五险一金基数和比例\n- 培训预算/考证报销(如OSCP、CISSP考试费)\n- 弹性工作/远程办公\n- 带薪年假\n\n---\n\n## 🏢 企业文化适配\n\nHR面也是在评估你与企业文化的匹配度：\n\n**你需要了解的**：\n- 团队规模和组成（多少人？什么背景？）\n- 技术栈和工具链（用什么安全产品？）\n- 工作模式（敏捷/瀑布？每日站会？On-call机制？）\n- 晋升机制（职级体系？多久评估一次？）\n- 安全团队在公司的地位（向CTO汇报还是CISO？）\n\n---\n\n## 🙋 反问环节（一定要准备！）\n\n好的反问展示你的思考和关注点：\n\n**技术方向**：\n> "团队目前在网络安全基础方面最大的安全挑战是什么？"\n> "安全团队未来的技术路线图是怎样的？"\n\n**个人发展**：\n> "这个岗位前3个月的期望是什么？"\n> "团队对新人的培养机制是怎样的？"\n\n**不要问的**：\n> ❌ "公司做什么的？"（面试前应该查过）\n> ❌ "加班多吗？"（问法可以改为"团队通常的工作节奏是怎样的"）\n',
    quiz: []
  },
  {
    id: 'interview-basic-i45', day: 45, title: '全真模拟面试（五）', subtitle: '终极模拟·综合评分·查漏补缺',
    objectives: ['全方位面试自评与查漏补缺'],
    keyPoints: ['综合评分卡','知识盲区盘点','面试话术打磨','最终自测'],
    content: '# 网络安全基础方向 — 全真模拟面试（五）：终极模拟·综合评分·查漏补缺\n\n## 🎯 今日目标\n\n完成全方位面试自评，找出知识盲区，打磨面试话术，做最后一次全真模拟。\n\n---\n\n## 📋 综合面试评分卡\n\n按以下维度给自己打分（1-5分），≥3分才算合格，<3分的需要补强：\n\n| 维度 | 分数(1-5) | 自评 | 改进计划 |\n|------|-----------|------|----------|\n| 自我介绍(3分钟版) | ___ | | |\n| 技术基础问答 | ___ | | |\n| 深度技术追问 | ___ | | |\n| 项目经验讲述(STAR) | ___ | | |\n| 行为面试应对 | ___ | | |\n| 场景设计分析 | ___ | | |\n| 薪资谈判准备 | ___ | | |\n| HR交流策略 | ___ | | |\n| 反问问题准备 | ___ | | |\n| 整体自信度 | ___ | | |\n\n---\n\n## 🔍 网络安全基础方向知识盲区盘点\n\n逐项检查以下知识领域，标记掌握程度（✅熟练 / ⚠️需要复习 / ❌完全不会）：\n\n- □ 网络基础：能画出OSI七层并说明每层协议吗？\n- □ Web安全：能解释OWASP Top 10每项的原理和防御吗？\n- □ 密码学：能区分对称/非对称加密、哈希、数字签名吗？\n- □ 工具：能用至少5种安全工具独立完成渗透测试吗？\n- □ 语言：能用Python编写安全脚本吗？\n\n**行动计划**：把标记为⚠️和❌的项排优先级，用最后的时间突击补强。\n\n---\n\n## 🎭 终极全真模拟\n\n### 模拟设定\n\n- **时长**：45分钟（完整真实面试时长）\n- **角色**：你 = 网络安全基础方向候选人 | 模拟面试官 = 朋友/同事/镜子中的自己\n- **流程**：自我介绍3分钟 → 技术问答15分钟 → 项目深挖10分钟 → 场景设计10分钟 → HR环节5分钟 → 反问2分钟\n\n### 模拟面试步骤\n\n1. **完整做一次45分钟模拟**，用手机录音全程\n2. **回听录音**，标注问题：哪卡壳了？哪回答得好？语速节奏如何？\n3. **针对性优化**：卡壳的地方补充知识，啰嗦的地方精简话术\n4. **再做一次**（至少做2轮），直到你能流畅完成\n\n---\n\n## 📝 面试话术打磨\n\n### 困难问题的「万能回答框架」\n\n**遇到不会的问题**：\n> "这是一个很好的问题。坦率地说，我在这个具体点上经验不多，但我对相关领域X和Y比较熟悉。我的理解是...（尝试从相关原理推导）。如果实际遇到这个问题，我的思路会是：首先查阅官方文档/Official RFC，然后搭建环境实验验证，最后结合业务场景给出方案。"\n\n**被问到失败的案例**：\n> "有一次在XX项目中，因为XX原因导致XX结果。我从中学到了XX（诚实+反思+成长）。之后我建立了XX机制来避免类似问题，在后来的项目中再也没有出现过。"\n\n---\n\n## 🎉 面试冲刺总结\n\n恭喜！你已经完成了45天的面试突击训练！最后几点提醒：\n\n1. **面试前一晚**：早睡，准备好衣服，查好路线，打印2份简历\n2. **面试当天**：提前15分钟到，深呼吸，保持微笑\n3. **面试中**：语速适中不要快，遇到不会的坦诚不编造，适时反问\n4. **面试后**：当天复盘记录问题，写感谢邮件\n5. **心态**：每一次面试都是一次学习，没有白面的面试\n\n> 祝你在网络安全基础方向的面试中旗开得胜！🛡️\n',
    quiz: []
  }
];

export const interviewBasicPlan: CyberLearningPlan = {
  id: 'basic',
  name: '网络安全基础·面试突击',
  subtitle: 'Security Fundamentals · 40 Days',
  description: '前26天全量知识速览 + 后14天面试实战。覆盖网络协议、操作系统、OWASP Top10、密码学、内网安全、安全运营、合规等全部面试考点',
  icon: '🛡️',
  difficulty: '入门',
  totalDays: 45,
  color: 'text-cyber-green',
  bgColor: 'bg-cyber-green/10',
  borderColor: 'border-cyber-green/30',
  prerequisites: cyberBasicPlan.prerequisites,
  certification: cyberBasicPlan.certification,
  days: [...reviewDays, ...interviewDays],
};
