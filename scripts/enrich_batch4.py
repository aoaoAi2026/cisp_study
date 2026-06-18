#!/usr/bin/env python3
"""面试内容填充 Batch 4 (Final) - Penetration day-15~26 + AI day-12~26"""
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
# PENETRATION day-15~26 (Linux提权/后渗透/令牌/CS/横向/域渗透/Kerberos/持久化/反取证/MSF/免杀/无线)
# ================================================================

pen_qas = {
    "day-15.md": [
        ("Linux提权的标准化检查流程",
         "三阶段：\n"
         "信息收集(2min)：id; uname -a; sudo -l; find / -perm -4000; getcap -r /; crontab -l; ls /etc/cron*; ss -tlnp; env; cat ~/.bash_history\n"
         "自动扫描(1min)：./linpeas.sh或linux-exploit-suggester→逐个验证输出的提权向量\n"
         "针对性利用：sudo -l有NOPASSWD→GTFObin查sudo提权。SUID二进制→GTFObin查利用方法。老内核→searchsploit kernel。Docker组→docker逃逸。Cron脚本可写→修改脚本反弹shell\n\n"
         "面试金句：同时跑自动扫描和手动排查，linpeas结果做交叉验证——不盲目信任任何一个工具"),

        ("SUID二进制提权的三类经典案例",
         "类型1-GTFObin可滥用SUID：find有SUID→find . -exec /bin/sh -p \\;。vim有SUID→vim -c ':py3 import os;os.setuid(0);os.execl(\"/bin/sh\",\"sh\",\"-c\",\"exec sh\")'\n"
         "类型2-LD_PRELOAD劫持：如sudo允许保留LD_PRELOAD→编译共享库→sudo LD_PRELOAD=evil.so command\n"
         "类型3-通配符注入：root cron执行tar cf /backup/*→在目录创建--checkpoint=1和--checkpoint-action=exec=sh shell.sh的文件→tar把文件名当参数→执行shell.sh\n\n"
         "DirtyCow(CVE-2016-5195)→影响2007年起所有内核版本→利用COW竞争条件写入只读内存→覆盖/etc/passwd"),

        ("Capabilities和传统SUID的差异",
         "SUID赋予完整root权限→颗粒度粗→如果程序有漏洞→攻击者获完整root。Capabilities将root拆成40+小权限→每进程只获最小所需\n"
         "危险Capabilities：cap_setuid(elevate uid)、cap_sys_ptrace(inject到root进程)、cap_dac_read_search(读/etc/shadow)、cap_sys_module(加载内核模块)\n"
         "容器最佳实践：--cap-drop=ALL --cap-add=NET_BIND_SERVICE→完全最小化"),
    ],
    "day-16.md": [
        ("Linux后渗透的五步标准流程",
         "1.凭据收集：/etc/shadow→hashcat爆破。~/.ssh/id_rsa→SSH横向。~/.bash_history + .env + web配置文件→找明文密码\n"
         "2.内网发现：ip addr; arp -a; cat /etc/hosts; bash端口扫描for循环\n"
         "3.横向移动：SSH密钥直连、收集到的凭据复用、Redis/Memcached未授权→打内网\n"
         "4.持久化：crontab反向shell、SSH key追加、SUID后门cp /bin/bash /tmp/.bash→chmod 4755、PAM后门\n"
         "5.痕迹清理：unset HISTFILE; rm ~/.bash_history; ln -s /dev/null ~/.bash_history"),
    ],
    "day-17.md": [
        ("Windows Access Token/Potato家族提权",
         "Primary Token(进程创建时分配控制安全上下文)+Impersonation Token(线程临时模拟其他用户)。关键权限SeImpersonatePrivilege\n"
         "Potato家族：Hot Potato(NBNS)→Rotten Potato(DCOM BITS)→Juicy Potato(可靠CLSID)→PrintSpoofer(打印机RPC CVE-2020-1048)→GodPotato\n"
         "原理：有SeImpersonate→创建命名管道→欺骗SYSTEM进程连接→ImpersonateNamedPipeClient()→窃取SYSTEM Token"),
    ],
    "day-18.md": [
        ("Cobalt Strike Beacon的通信协议和隐蔽性",
         "HTTP/HTTPS Beacon：GET取任务+POST回传→心跳间隔(3-60s)+Jitter(0-50%)→伪装正常Web流量→但频率规律可能被ML检测\n"
         "DNS Beacon：TXT/MX查询编码传送→隐蔽性高(DNS通常不被HTTPS中间人检查)→但速度慢(一次查询最多几十字节)\n"
         "SMB Beacon：Named Pipe内网转发→不出互联网→需已有Internet入口做跳板。Malleable C2 Profile是核心→自定义HTTP头/URI/证书/UA伪装业务流量"),
    ],
}

for dayfile, qa_list in pen_qas.items():
    title_map = {"day-15.md": "Day 15：Linux权限提升", "day-16.md": "Day 16：Linux后渗透与横向移动", "day-17.md": "Day 17：令牌窃取与Token提权", "day-18.md": "Day 18：Cobalt Strike深度实战"}
    sub_map = {"day-15.md": "[Linux提权面试核心] SUID/Capability/Sudo/Crontab/内核漏洞", "day-16.md": "[Linux后渗透面试核心] 凭据收集/SSH劫持/持久化/痕迹清理", "day-17.md": "[Token面试核心] Access Token/Impersonation/Potato家族/SeImpersonate", "day-18.md": "[CS面试核心] Beacon通信/DNS隧道/Malleable C2/隐蔽对抗"}
    traps = {"day-15.md": ["linpeas有误报漏报→交叉验证多工具", "docker组=root→id在docker组可docker run -v /:/mnt alpine chroot /mnt sh", "内核提权不评估风险→DirtyCow可能致内核崩溃"],
             "day-16.md": ["忘收集数据库凭据→Web配置文件的DB密码可能通用", "SSH密钥没检查known_hosts→拿了私钥不知道连哪个目标", "横向移动大流量扫描→触发内网告警"],
             "day-17.md": ["有SeImpersonate不一定能提权→还需能创建命名管道+欺骗SYSTEM连接", "Token窃取不是万能→Win10 1809+某些Service Account仍有此漏洞"],
             "day-18.md": ["CS不是钓鱼工具→Beacon是后渗透操作平台", "Malleable C2决定隐蔽程度→默认profile极易被检测", "DNS Beacon慢→设计隐蔽通信需权衡速度和隐蔽"]}
    checks = {"day-15.md": ["linpeas扫描测试Linux→手动验证输出", "GTFObin搜索python/vim/find的SUID提权→在测试环境验证", "docker run -v /:/host -it alpine测试docker组的容器逃逸"],
              "day-16.md": ["chisel在两台Linux间搭SOCKS5→proxychains扫描内网", "SSH Agent Forwarding实验：A→B→C,B被控→利用agent连接C", "手动排查Linux后门(对照后门清单逐条检查)"],
              "day-17.md": ["在Windows测试机用whoami /priv检查→如有SeImpersonate→PrintSpoofer测试", "用Process Explorer观察Token→理解Primary vs Impersonation的区别"],
              "day-18.md": ["搭建CS测试环境→配置自定义Malleable C2 Profile→验证流量特征", "分析CS的HTTP Beacon流量(Wireshark)→找检测特征点"]}
    add("penetration", dayfile, title_map[dayfile], sub_map[dayfile], qa_list, traps[dayfile], checks[dayfile])

# Penetration day-19~26
pen_remaining = {
    "day-19.md": [("内网横向移动技术的完整武器库", "PsExec(通过ADMIN$共享+SCM服务控制)→上传服务exe→启动→执行命令。WMI(Windows Management Instrumentation)→远程创建进程。PowerShell Remoting(WinRM/5985)→Enter-PSSession。SMB横向→用被控机器的凭据访问其他机器的C$/ADMIN$。RDP→mstsc /v:target。SSH(Windows 10 1809+自带OpenSSH Server)\n\n面试亮点：横向移动不是只用一种方法——不同环境不同方法，SMB被监控→换WMI，WMI被监控→换WinRM。讲出多方法+能测出哪种当前可用才是实战思维")],
    "day-20.md": [("Windows域渗透的基础知识体系", "AD域核心概念：Domain Controller(域控/KDC)。NTDS.dit(域数据库，存所有用户哈希)。KRBTGT(域Kerberos密钥分发中心账户→拿到它的Hash=拿到金票工厂)。SYSVOL(域共享策略目录→可能泄露密码/脚本)\n\n基础攻击：LLMNR/NBT-NS毒化(Responder→监听广播查询→伪造响应→捕获Net-NTLMv2 Hash→hashcat爆破)。SMB Relay(将捕获的Net-NTLMv2中继到其他机器→如果目标未开启SMB签名→以该用户身份执行命令)")],
    "day-21.md": [("Kerberos协议深度攻击：委派+Tickets", "非约束委派攻击：控制非约束委派服务器→诱导DC访问(SpoolSample打印机服务触发器)→DC的TGT缓存被dump→做成金票。约束委派绕过：配置了S4U2Self+协议转换的服务→用Rubeus s4u /impersonateuser:Administrator→获取DC的ST→S4U2Proxy跳到任意服务。RBCD攻击：控制能修改目标机器msDS-AllowedToActOnBehalfOfOtherIdentity属性的账户→添加自己的机器账户→获取管理员ST")],
    "day-22.md": [("持久化与权限维持的常见技术", "Windows持久化：注册表Run键(HKLM/HKCU\\..\\Run)、计划任务(schtasks /create)、WMI事件订阅(Event Consumer→系统启动时触发)、服务安装(sc create)、DLL劫持(替换应用加载的DLL)、LSA Authentication Package(加载恶意DLL到lsass.exe)\nLinux持久化：Crontab、SSH Key追加、PAM后门、LD_PRELOAD Rootkit(/etc/ld.so.preload)、内核模块Rootkit\n面试强调：红队看多样性，蓝队看覆盖率→你能检测出几种？")],
    "day-23.md": [("日志清理与反取证的基础知识", "Windows清理：wevtutil cl→清除事件日志(Event ID 1102因此被记录)。删除Prefetch文件(.pf)和Recent文档、清理注册表MRU(Most Recently Used)、禁用或暂停Sysmon/tripwire\nLinux清理：unset HISTFILE; rm ~/.bash_history; ln -s /dev/null ~/.bash_history。删除/var/log/*中的关键日志(auth.log/syslog)。注意：如果日志同时写入了远程SIEM→本地清理无用→反取证必须考虑中央日志系统\n面试金句：真正高级的APT不会大规模清日志→因为清日志本身就是一种告警(Event ID 1102)。他们会有选择性地删除几条关键事件≤在噪音中消失")],
    "day-24.md": [("Metasploit框架的深度使用", "核心模块类型：exploit(利用漏洞)→payload(执行载荷，如meterpreter_reverse_tcp)→auxiliary(扫描/DoS/嗅探)→post(后渗透，如hashdump/enum_logged_on_users)→encoder(编码绕过AV)\n\nMSF高级用法：autoroute(添加被控主机路由→通过session打内网)→socks_proxy(开SOCKS代理→proxychains用外部工具)。resource script(批量自动化).rc文件→一条命令执行整个渗透流程\n面试说：MSF在护网演练中因特征太明显容易被EDR秒杀→实际红队更依赖Cobalt Strike和C2 Custom Framework")],
    "day-25.md": [("免杀与AV/EDR对抗的核心技术", "免杀二八法则：80%被检测是因为静态特征(文件中已有已知恶意代码Hash)→20%是动态行为。静态免杀：代码混淆(变量名重命名/控制流平坦化/字符串加密)、壳/加壳(UPX/Themida→也可能被反壳检测)、多态代码(每次生成不同的二进制)\n动态免杀：API Unhooking(恢复被EDR Hook的ntdll.dll函数→绕过用户态检测)、Process Injection→注入到白名单进程(svchost/explorer→白进程做黑事)、syscall直接调用(绕开ntdll Hook)")],
    "day-26.md": [("无线安全测试的核心技术", "Wi-Fi安全：WPA2-PSK破解→抓取四次握手包(airodump-ng+deauth强制断开用户重连)→aircrack-ng/hashcat -m 22000爆破。WPA3的Dragonblood漏洞(CVE-2019-9494)→降级攻击+侧信道。WPS PIN暴力(pixiewps)→8位PIN可在线秒破。Evil Twin(伪造同名AP诱导用户连接→捕获密码)\n蓝牙：BlueBorne(2017)→无需配对的远程RCE、BLE GATT特征值窃听/篡改\n面试亮点：能讲清楚抓WPA握手的原理(为什么需要Deauth)而不是只会用工具")]
}

for dayfile, qa_list in pen_remaining.items():
    dn = int(dayfile.split('-')[1].split('.')[0])
    titles = {19: "Day 19：内网横向移动技术", 20: "Day 20：Windows域渗透基础", 21: "Day 21：Kerberos协议深度攻击", 22: "Day 22：持久化与权限维持", 23: "Day 23：日志清理与反取证", 24: "Day 24：Metasploit框架深度", 25: "Day 25：免杀与AV/EDR对抗", 26: "Day 26：无线安全测试"}
    subs = {19: "[横向移动面试核心] PsExec/WMI/WinRM/SMB/RDP多武器", 20: "[域渗透面试核心] NTDS.dit/KRBTGT/LLMNR毒化/SMB Relay", 21: "[委派面试核心] 非约束委派/约束委派/RBCD/SpoolSample", 22: "[持久化面试核心] 注册表/WMI/计划任务/LSA/DLL劫持", 23: "[反取证面试核心] Windows/Linux日志清理/SIEM远程日志", 24: "[MSF面试核心] exploit/payload/post/autoroute/socks", 25: "[免杀面试核心] 静态免杀/动态免杀/syscall/API Unhooking", 26: "[无线安全面试核心] WPA2破解/WPA3/Evil Twin/蓝牙"}
    traps_all = {19: ["讲横向移动不只列工具→每种方法在不同环境的效果不同→展示你的判断力", "未授权横向移动在生产环境可能触发告警→讲清楚你的风险意识"],
                 20: ["LLMNR/NBT-NS毒化需要内网Responder→MAC flooding不一定能成", "域渗透不是从0开始的→需要先有一个域账户(低权限也行)"],
                 21: ["委派攻击需要特定条件→讲清楚每种委派的前提条件比列举攻击更重要", "非约束委派是最危险的但也是最容易被发现的→红队和蓝队都知"],
                 22: ["持久化的最终目的是重连→但每次重连都是一次新的告警机会", "有些持久化方式需要高权限(服务安装/LSA)→低权限时有限选择"],
                 23: ["日志清空本身就是告警(1102)→真正的APT选择性删除而非全清", "远程SIEM下的本地清无效→反取证必须考虑日志的存储方式"],
                 24: ["MSF的默认payload特征在EDR中秒杀→自定制payload是必修课", "护网演练中MSF的成功率持续下降→理解为什么比会用更重要"],
                 25: ["静态免杀是入门→动态免杀(syscall/ppid spoofing)才是主战场", "免杀不是一次性→AV每天更新特征→需要持续优化载荷"],
                 26: ["WPA3并非绝对安全→Dragonblood降级攻击依然有效", "无线安全测试前必须获得授权→非法WiFi嗅探/Cracking是违法行为"],
    }
    checks_all = {19: ["测试环境用PsExec/WMI/PowerShell Remoting横向移动→理解各自网络包区别", "Wireshark抓包分析三种横向移动的网络特征"],
                   20: ["搭建测试域→用BloodHound做域信息收集(SharpHound collector)", "用Responder做LLMNR毒化→捕获Net-NTLMv2→hashcat测试爆破"],
                   21: ["用Rubeus做S4U攻击→理解S4U2Self和S4U2Proxy的票据差异", "分析域控的委派配置→Get-ADComputer -Filter {TrustedForDelegation -eq $true}"],
                   22: ["在测试Windows上实现3种不同的持久化方法→写检测规则找它们", "用Autoruns检查持久化痕迹→对比你实现的三种"],
                   23: ["在测试机执行wevtutil cl查看Event 1102是否被记录", "配置Winlogbeat转发到远程ELK→测试本地清日志后SIEM是否还留着"],
                   24: ["用MSF的resource script写一个自动化渗透流程(扫描→利用→后渗透)", "尝试用msfvenom生成免杀payload→放在VirusTotal上测查杀率"],
                   25: ["学习syscall直接调用的原理(hell's gate/halos gate)", "尝试对简单Shellcode做异或编码→检查免杀效果"],
                   26: ["在测试环境(获得授权后)用aircrack-ng破解WPA2→理解抓握手原理", "用bettercap做WiFi探测→建立周围WiFi资产清单"],
    }
    add("penetration", dayfile, titles[dn], subs[dn], qa_list, traps_all[dn], checks_all[dn])

# ================================================================
# AI day-12~26
# ================================================================
ai_remaining = {
    "day-12.md": [("安全数据的清洗流程和常见问题", "数据清洗三阶段：①缺失值处理(用均值/中位数/众数填充或删除)→关键看缺失比例(>50%舍弃列，<5%填充) ②异常值检测(Z-score/IQR/Isolation Forest)→安全场景中异常值可能本身就是攻击信号→不盲目删除！③标准化/归一化(MinMax/StandardScaler)→ML模型对不同尺度特征敏感\n\n安全特有清洗：时间戳格式统一(多种SIEM格式混用→统一Epoch)、IP地址范式化(10.0.0.1 vs 10.000.000.001→统一)、日志级别映射(不同设备INFO/WARNING/ERROR含义不同→统一严重度)")],
    "day-13.md": [("安全日志文本处理的基础技术", "正则表达式：从原始日志提取关键字段→IP正则、时间戳正则、URL路径提取→这是SIEM Parser的基础。TF-IDF：从大量安全日志中找出区分度最高的关键词→发现新兴攻击词汇(以前从未出现的payload关键词)。N-Gram：滑动窗口捕获连续词组→用于检测编码后的命令(如base64编码的PowerShell→按n-gram频率与正常命令不同)\n\n面试举例：用TF-IDF分析一天的安全日志→Top词中突然出现'Invoke-Mimikatz'→这是以前从未出现的→高概率的真实攻击或渗透测试")],
    "day-14.md": [("数据处理Pipeline的总结和面试要点", "安全数据处理Pipeline：采集(Kafka) → 解析/范式化(Logstash/Fluentd) → 富化(GeoIP/威胁情报/资产) → 存储(S3/HDFS) → 分析(SIEM/ML)\n\n面试中你能展示的Pipeline思维：①理解数据从产生到分析的完整链路 ②能指出哪个环节是性能瓶颈(往往是解析阶段的正则→优化为grok pattern) ③知道Pipeline各环节的可靠性设计(日志丢失?格式变化?延迟?)"),

         ("怎么设计一个能处理日均TB级安全日志的Pipeline？",
          "分治策略：\n1. 边缘预处理：在Agent端先过滤(丢弃已知的噪音日志)→只发有价值的日志→减少传输量\n2. Kafka分区：按时间或源IP做partition→Flink/Spark并行消费→提升处理吞吐\n3. 热/温/冷分层：最近7天数据在ES(快速查询)→30天前归档到S3(低成本)→一年前数据用Athena/BigQuery按需查询\n4. Schema on Read vs Schema on Write：先存原始JSON→查询时再定义Schema→灵活但查询慢→未来按需做ETL物化为Parquet")],
    "day-16.md": [("概率论在安全检测中的应用", "贝叶斯定理在IDS中：P(攻击|告警) = P(告警|攻击)×P(攻击) / P(告警)。P(攻击)是攻击的Base Rate(先验概率)→即使IDS检测率为99%→如果攻击本身极低(万分之一)→告警中真攻击的概率只有约1%→这解释了为什么IDS有大量误报\n\n面试金句：贝叶斯定理解释了SIEM告警噪音的数学本质→不是IDS不好(99%检测率)→而是Base Rate太低(Bayesian Base Rate Fallacy)")],
    "day-17.md": [("统计分布在安全分析中的应用", "泊松分布：每小时安全事件数→如果均值是5→某小时出现20个→泊松概率极低→可能是攻击。对数正态分布：Dwell Time(攻击者在网络中的潜伏时间)、文件大小、数据传输量→通常符合对数正态→异常偏离表示潜在数据外泄\n面试举例：用泊松分布建立某系统CPU使用率的告警基线→如果P(X>=observed)<0.001→触发告警→比固定阈值更智能")],
    "day-18.md": [("假设检验与统计推断在安全中的角色", "A/B测试应用：新增了一条WAF规则→错误拦截率是否显著增加？→用卡方检验比较对照组和实验组的拦截率→p<0.05说明规则的负面影响是统计显著的\n异常检测中的假设检验：H0=正常(今天和昨天一样)→H1=异常(今天不一样)→如Grubbs检验测试单个异常值→Grubbs test statistic > Critical Value→拒绝H0→判定异常\n面试亮点：假设检验可以从直觉的判断提升到数学层面的决策→展示数据驱动安全决策的思维"),

         ("安全告警中的多重比较问题(Bonferroni Correction)",
          "如果你同时监控100个指标→每个用p<0.05→即使完全没有攻击→期望有5个指标会有'异常'→这就是多重比较问题。Bonferroni校正→p/100=0.0005→更严格的阈值→减少误报但增加漏报\n\n安全分析的权衡：SOC要平衡误报率和漏报率→Bonferroni过于保守(漏报多)→实际常用Benjamini-Hochberg(FDR控制)→允许一定比例的误报但控制漏报")],
    "day-19.md": [("统计异常检测的实战方法", "三招：\n1. Z-Score方法：x超出均值的3个标准差→异常。简单但有假阴性(对周期性无视)\n2. IQR(四分位数间距)：Q3+1.5×IQR以上为异常→更鲁棒(不受极端值影响)\n3. MAD(绝对中位差)：不受异常值影响的鲁棒Z-score→MAD是每个点到中位数的中位数→异常值对MAD影响极小\n\n实战：用MAD检测暴力破解→某台服务器的10分钟窗口内登录失败次数→MAD-Zscore>3→告警")],
    "day-20.md": [("基线建立与自适应阈值", "静态阈值的问题：人每年在变，3sigma在今天合适下个月就不合适了→基线需要自适应\n自适应方案：EWMA(指数加权移动平均)→越近的数据权重越高→自动跟踪行为变化。动态3sigma：用近期数据(如过去30天)重新计算μ和σ→每周自动更新\n挑战：如果攻击者在基线学习期间很安静→基线污染(把攻击行为也学成了正常)→这是威胁建模的关键挑战")],
    "day-21.md": [("统计基线检测阶段总结和面试技巧", "阶段总结：你学到的统计方法(Poisson/贝叶斯/假设检验/Z-score/自适应基线)有统一目标→将安全判断从定性(我感觉异常)提升到定量(数学上异常概率)的层次\n\n面试技巧：面试时不要罗列统计方法→而是讲一个完整故事：某系统每天告警300条→用统计方法找出每天的Top 5真实威胁→MTTD从4小时降到30分钟→节约了2个L1分析师的工时\n数据驱动安全不是用统计方法炫技→而是解决实际问题的能力"),
         ("统计方法在安全中的局限性",
          "最大局限：所有统计方法都假设历史数据代表正常行为→但攻击者可以逐步改变行为(慢速基线污染)→如每天多偷1MB数据→30天后基线适应了1GB/天的外传→不会被标记异常\n\n因此统计方法需辅以：①规则(基于威胁知识的硬检测，不变的东西) ②ML(可学习复杂模式但需大量标注数据) ③Threat Hunting(人的直觉)")],
    "day-22.md": [("网络流量特征工程的实战方法", "特征工程是将原始网络包/NetFlow数据转化为ML模型可理解的数字特征的过程\n关键特征：①统计特征(包大小均/方差/max/min、流时长、字节数、包数) ②协议特征(端口、协议号、TCP Flag组合→如SYN-only=扫描) ③时序特征(包间隔的均/方差、活跃-静默模式) ④内容特征(熵值→加密流量vs明文、载荷前N字节的分布)\n面试举例：C2 Beacon特征→包间隔高度规律(因为心跳机制)→方差极小→与浏览器的随机化不同→这就是ML检测C2的基础")],
    "day-23.md": [("恶意软件分析的ML方法", "静态ML：从PE文件提取特征→导入表API序列(n-gram)、字节直方图、文件头信息、字符串熵→用随机森林/SVM分类恶意vs正常\n动态ML：在沙箱中执行→API调用序列(时序很重要)→文件/注册表/网络操作→用LSTM/CNN学习行为序列→发现新型恶意软件\n局限：对抗性恶意软件会刻意避开ML检测→如添加大量无害API调用混淆行为序列→或者检测沙箱环境不下发恶意行为")],
    "day-24.md": [("机器学习安全概述", "ML安全分两类：①用ML做安全(ML for Security)→将ML应用于入侵检测/恶意软件检测/UEBA ②ML自身的安全(Security of ML)→对抗样本/数据投毒/模型窃取/模型逆向\n\n面试你必须分清的两面：面试官问AI安全可能指的是①(MLE做安全产品)或者②(保护AI系统本身)→你回答之前先确认！否则答偏直接减分"),
         ("安全ML系统的落地挑战",
          "三大挑战：①标注数据→安全数据高度不平衡(99.9%正常+0.1%攻击)→导致模型倾向预测正常→需要SMOTE/类别权重等方法 ②模型解释性→安全团队需要知道为什么告警(传统规则透明，ML模型黑箱)→需要用SHAP/LIME解释 ③模型退化→攻击手法不断变化→训练时的攻击样本可能已过时→持续训练+定期重评估")],
    "day-25.md": [("监督学习对抗样本在安全中的威胁", "对抗样本不只是学术问题→实际攻击者已经使用：①恶意软件变形→添加无实际功能的代码+修改控制流→绕过基于ML的静态检测 ②网络流量伪装→模仿正常流量模式绕过基于ML的NIDS ③垃圾邮件绕过→添加小扰动修改邮件得分\n\n防御：对抗训练→在训练集中加入对抗样本→模型学会抵抗这类攻击。但这不是完美方案→攻击者总是在演变→防御需要持续迭代")],
    "day-26.md": [("模型安全与后门攻击的综合讨论", "模型后门(Backdoor)：训练时植入触发器→带触发器的样本一定被分类为攻击者指定label→如所有的'停止'标志旁放一个黄色贴纸→模型当作'限速80'。BadNet/Narcissus是经典后门攻击\n\n模型供应链安全：从HuggingFace/ModelZoo下载的预训练模型→可能有后门→用前需扫描+验证行为。对抗后门的手段：模型微调(正常数据上继续训练→覆盖后门)、Neural Cleanse(检测每个类的最小触发扰动→如果某个类需要的扰动异常小→可能有后门)"),
         ("AI安全面试的综合建议",
          "大总结：ML安全面试需要你既懂ML原理(FGSM/PGD/对抗训练/模型结构)又懂安全思维(攻击面/威胁模型/防御纵深)\n面试忌：只讲ML不讲安全→这是AI工程师面，不是安全工程师面。只讲安全不讲ML→说明你不理解ML安全的特殊性\n面试宜：讲你实际用ML解决安全问题的经验(如用Isolation Forest建立了某系统的异常检测→发现了之前SIEM规则漏掉的3次内部攻击)")]
}

for dayfile, qa_list in ai_remaining.items():
    dn = int(dayfile.split('-')[1].split('.')[0])
    title_map = {
        12: ("Day 12：安全数据清洗实战", "[数据清洗面试核心] 缺失值/异常值/范式化/安全特有清洗"),
        13: ("Day 13：安全日志文本处理", "[文本处理面试核心] 正则/TF-IDF/N-Gram/日志解析"),
        14: ("Day 14：数据处理Pipeline总结", "[Pipeline面试核心] Kafka/Flink/热温冷分层/规模设计"),
        16: ("Day 16：概率论与安全检测", "[概率论面试核心] 贝叶斯定理/Base Rate Fallacy/误报本质"),
        17: ("Day 17：统计分布在安全分析中的应用", "[统计分布面试核心] 泊松分布/对数正态/异常检测"),
        18: ("Day 18：假设检验与统计推断", "[假设检验面试核心] A/B测试/多重比较/FDR控制"),
        19: ("Day 19：统计异常检测实战", "[异常检测面试核心] Z-score/IQR/MAD/暴力破解检测"),
        20: ("Day 20：基线建立与自适应阈值", "[自适应基线面试核心] EWMA/动态3sigma/基线污染"),
        21: ("Day 21：统计基线检测阶段总结", "[阶段总结面试核心] 定量化安全/面试故事/统计局限"),
        22: ("Day 22：网络流量特征工程", "[特征工程面试核心] NetFlow流量特征/C2 Beacon检测"),
        23: ("Day 23：恶意软件分析", "[恶意软件ML面试核心] PE分类/API序列/沙箱行为"),
        24: ("Day 24：机器学习安全概述", "[ML安全面试核心] ML for Security vs Security of ML"),
        25: ("Day 25：监督学习对抗样本", "[对抗样本面试核心] 恶意软件变形/流量伪装/对抗训练"),
        26: ("Day 26：模型安全与后门攻击", "[后门攻击面试核心] BadNet/供应链/Neural Cleanse"),
    }
    traps = ["ML方法是手段不是目的——面试要讲你用ML解决了什么安全问题，不是炫耀模型有多复杂",
             "模型效果评估不能只看Accuracy——安全领域的Accuracy因为数据极度不平衡(99.9%正常)而基本没有意义→要看Precision/Recall/F1特别是Recall",
             "面试被问ML的局限性时→坦诚讨论训练数据过时/对抗演化/模型解释性三大挑战→展示你理解技术边界"]
    checks = ["将本Day的核心方法用Python实现一个简化的Demo(如自己写的Z-score异常检测)", "找一个相关的安全数据(CICIDS/Malware-traffic-analysis)→实践本Day的方法", "把本Day知识点整理成一个30秒的面试口述(录音自听)"]

    add("ai", dayfile, title_map[dn][0], title_map[dn][1], qa_list, traps, checks)

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
