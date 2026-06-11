export interface CyberDayChallenge {
  type: string;
  title: string;
  description: string;
  url?: string;
}

export interface CyberDay {
  id: string;
  day: number;
  stage: 'basic' | 'intermediate' | 'advanced';
  title: string;
  description: string;
  objectives: string[];
  topics: string[];
  tools: {
    name: string;
    description: string;
    url: string;
  }[];
  environments: {
    name: string;
    description: string;
    url: string;
    dockerImage?: string;
  }[];
  challenges: CyberDayChallenge[];
  notes: string;
}

export interface CyberStage {
  id: 'basic' | 'intermediate' | 'advanced';
  title: string;
  subtitle: string;
  description: string;
  totalDays: number;
  color: string;
  icon: string;
  prerequisites: string[];
  skillsGained: string[];
  days: CyberDay[];
}

// ============================================================
// 阶段一：基础 30 天
// ============================================================
const basicStage: CyberStage = {
  id: 'basic',
  title: '基础阶段',
  subtitle: '信息安全入门 · 30天筑基',
  description:
    '从零开始构建信息安全知识体系，掌握核心概念、常见攻防手段和基本工具使用。本阶段涵盖网络基础、Web安全、密码学、社会工程学等核心领域。',
  totalDays: 30,
  color: 'cyber-green',
  icon: 'Shield',
  prerequisites: ['计算机基础', '会使用命令行', '对网络有概念'],
  skillsGained: [
    'Linux/Windows 系统基础',
    '网络协议理解（TCP/IP、HTTP/HTTPS）',
    '常见 Web 漏洞原理',
    '基本的渗透测试流程',
    '密码学与身份认证概念',
    '常用安全工具（Nmap、Burp、Kali）'
  ],
  days: [
    {
      id: 'basic-01', day: 1, stage: 'basic',
      title: '信息安全世界总览',
      description: '了解信息安全的大图景：什么是信息安全？核心三要素（CIA）是什么？有哪些角色和岗位？',
      objectives: [
        '理解信息安全 CIA 三要素：保密性、完整性、可用性',
        '了解红队/蓝队/紫队的角色分工',
        '知道常见的安全事件和著名攻击案例',
        '搭建学习环境和路线图'
      ],
      topics: [
        'CIA 三要素',
        '红队 vs 蓝队 vs 紫队',
        '信息安全发展历史',
        '知名黑客事件回顾',
        'CISP 知识体系介绍'
      ],
      tools: [
        { name: 'FreeBuf', description: '国内知名安全媒体', url: 'https://www.freebuf.com/' },
        { name: '先知社区', description: '高质量中文安全博客', url: 'https://xz.aliyun.com/' },
        { name: '腾讯安全玄武实验室', description: '中文案例分析', url: 'https://security.tencent.com/' }
      ],
      environments: [
        { name: 'Kali Linux 介绍', description: '了解最流行的渗透测试发行版', url: 'https://www.kali.org/' },
        { name: 'Parrot OS', description: '另一个可选的安全发行版', url: 'https://parrotsec.org/' }
      ],
      challenges: [
        { type: '阅读', title: '阅读一篇知名安全事件复盘', description: '例如"永恒之蓝"事件，了解其影响、原理、防护方案' },
        { type: '实验', title: '画出一张你自己的网络安全学习路线图', description: '用思维导图整理你的 90 天计划' }
      ],
      notes: '心态比工具重要。每天都有新东西学，不要被信息淹没。'
    },
    {
      id: 'basic-02', day: 2, stage: 'basic',
      title: '计算机网络基础（TCP/IP）',
      description: '理解网络分层、数据包、端口和常见协议。这是所有网络安全的基础。',
      objectives: [
        '理解 OSI 七层模型与 TCP/IP 四层模型',
        '认识 IP、MAC、端口号',
        '掌握 TCP 三次握手与四次挥手',
        '理解 HTTP/HTTPS 基本流程'
      ],
      topics: [
        'OSI 七层 vs TCP/IP 四层',
        'IP 地址与子网掩码',
        'TCP vs UDP',
        '端口号（21/22/23/80/443/3306/3389）',
        'HTTP 请求与响应'
      ],
      tools: [
        { name: 'Wireshark', description: '最流行的网络抓包分析工具', url: 'https://www.wireshark.org/' },
        { name: 'tcpdump', description: 'Linux 命令行抓包', url: 'https://www.tcpdump.org/' },
        { name: 'PacketLife 网络速查', description: '网络协议 cheatsheet', url: 'https://packetlife.net/' }
      ],
      environments: [
        { name: '个人电脑 + Wireshark', description: '直接安装在本地即可开始抓包', url: 'https://www.wireshark.org/' }
      ],
      challenges: [
        { type: '实操', title: '用 Wireshark 抓一次 HTTP 访问', description: '打开浏览器访问 http://example.com，并用 Wireshark 过滤 http 看请求与响应' },
        { type: '实操', title: '用 Wireshark 看一次 TCP 三次握手', description: '过滤 tcp，观察 SYN/SYN+ACK/ACK 三个包' }
      ],
      notes: '网络层知识不是一次就能全懂的，需要反复回来看。'
    },
    {
      id: 'basic-03', day: 3, stage: 'basic',
      title: 'Linux 命令行与系统基础',
      description: '90% 的服务器跑的是 Linux，不会 Linux 就不会安全运维。',
      objectives: [
        '掌握 20 个常用 Linux 命令',
        '理解文件权限（rwx）与用户管理',
        '能用 SSH 连接远程主机',
        '会使用 grep/awk/sed 做文本处理'
      ],
      topics: [
        '文件系统 /root /home /etc /var',
        '权限位与 sudo',
        '进程与服务管理（systemctl）',
        'SSH 登录与密钥认证',
        '常用命令：ls/cd/ps/netstat/curl'
      ],
      tools: [
        { name: 'explainshell.com', description: '解释任何 Linux 命令', url: 'https://explainshell.com/' },
        { name: 'Kali Linux', description: '自带最全安全工具', url: 'https://www.kali.org/' }
      ],
      environments: [
        { name: '本地 Linux 虚拟机', description: '推荐 VirtualBox/Ubuntu 22.04', url: 'https://www.virtualbox.org/' },
        { name: 'Kali Linux (Docker)', description: '不用装虚拟机也能试用 Kali', url: 'https://www.kali.org/docs/containers/kalilinux-docker/', dockerImage: 'kalilinux/kali-rolling' }
      ],
      challenges: [
        { type: '实操', title: '创建一个 test 用户并设置 SSH Key 登录', description: '禁用密码登录，仅允许密钥登录' },
        { type: '实操', title: '用 netstat/ss 查看本机监听的端口', description: '学会判断机器上跑了哪些服务' }
      ],
      notes: 'Windows 也可以学，但真实环境 Linux 是主流。'
    },
    {
      id: 'basic-04', day: 4, stage: 'basic',
      title: 'Windows 安全基础',
      description: '内网渗透中最常见的目标就是 Windows，理解其架构、权限与常见服务至关重要。',
      objectives: [
        '了解 Windows 用户组、NTFS 权限',
        '认识 Active Directory（AD）概念',
        '熟悉 Windows 常用服务（RDP/SMB）',
        '掌握基本的 Windows 命令'
      ],
      topics: [
        'Windows 本地账户 vs 域账户',
        'SAM/SYSTEM/NTDS 数据库',
        'SMB 协议与 445 端口风险',
        'RDP 3389 远程桌面',
        '常见 Windows 命令：net/netsh/wmic'
      ],
      tools: [
        { name: 'Sysinternals Suite', description: '微软官方系统诊断工具合集', url: 'https://learn.microsoft.com/zh-cn/sysinternals/' },
        { name: 'Process Hacker', description: '高级任务管理器', url: 'https://processhacker.sourceforge.io/' }
      ],
      environments: [
        { name: 'Windows 10 评估版', description: '可以免费试用 180 天', url: 'https://www.microsoft.com/zh-cn/software-download/windows10ISO' }
      ],
      challenges: [
        { type: '实操', title: '在 Windows 上查看本机开放端口', description: '使用 netstat -ano 查看并记录 PID' },
        { type: '阅读', title: '阅读微软官方安全文档', description: '看 Windows 安全最佳实践' }
      ],
      notes: '真实的内网渗透 80% 时间在对付 Windows。'
    },
    {
      id: 'basic-05', day: 5, stage: 'basic',
      title: 'HTML/HTTP/Web 基础',
      description: 'Web 应用是互联网最大的攻击面。理解 Web 工作原理是 Web 安全的入门。',
      objectives: [
        '理解前端三大件 HTML/CSS/JS',
        '能看懂 HTTP 请求和响应',
        '了解 Cookie/Session/JWT 基本概念',
        '能通过浏览器 DevTools 调试请求'
      ],
      topics: [
        'HTTP 方法（GET/POST/PUT/DELETE）',
        '常见 Header：Cookie/Authorization/Content-Type',
        '状态码（200/302/403/404/500）',
        '同源策略与 CORS',
        '浏览器开发者工具使用'
      ],
      tools: [
        { name: 'Postman', description: 'API 调试利器', url: 'https://www.postman.com/' },
        { name: 'curl/curlconverter', description: '命令行 HTTP 客户端', url: 'https://curlconverter.com/' },
        { name: 'Hoppscotch', description: 'Web 版 API 测试', url: 'https://hoppscotch.io/' }
      ],
      environments: [],
      challenges: [
        { type: '实操', title: '用 curl 访问自己常用的网站', description: '观察 HTTP 响应头和状态码' },
        { type: '实操', title: '浏览器 F12 调试 Cookies', description: '尝试修改/清除站点 cookie 看网站行为变化' }
      ],
      notes: '会用浏览器开发者工具，是所有 Web 安全的起点。'
    },
    {
      id: 'basic-06', day: 6, stage: 'basic',
      title: 'Web 安全入门：OWASP Top 10（上）',
      description: 'OWASP Top 10 是 Web 安全的"圣经"，是 Web 安全最重要的清单。',
      objectives: [
        '理解 SQL Injection 原理',
        '理解 XSS（跨站脚本）原理',
        '理解 CSRF（跨站请求伪造）原理',
        '能在本地靶场中复现这些漏洞'
      ],
      topics: [
        'SQL 注入',
        '反射型 XSS / 存储型 XSS / DOM XSS',
        'CSRF',
        '安全的编码与过滤',
        '输入验证和参数化查询'
      ],
      tools: [
        { name: 'OWASP ZAP', description: '开源 Web 扫描器', url: 'https://www.zaproxy.org/' },
        { name: 'Burp Suite 社区版', description: 'Web 安全 Swiss Army Knife', url: 'https://portswigger.net/burp' }
      ],
      environments: [
        { name: 'OWASP Juice Shop', description: '最流行的开源 Web 漏洞靶场', url: 'http://localhost:3000', dockerImage: 'bkimminich/juice-shop' },
        { name: 'DVWA', description: '经典 PHP 漏洞靶场', url: 'http://localhost:8081', dockerImage: 'vulnerables/web-dvwa' }
      ],
      challenges: [
        { type: '实验', title: '在 Juice Shop 中触发一次反射型 XSS', description: '利用搜索框输入脚本' },
        { type: '实验', title: '在 DVWA 中做一次 SQL 注入', description: '难度从 low 开始，目标是 dump 出用户表' }
      ],
      notes: '动手复现漏洞比读十篇文章都有效。'
    },
    {
      id: 'basic-07', day: 7, stage: 'basic',
      title: '周总结：第一周回顾',
      description: '第一周的回顾、测验与查漏补缺。',
      objectives: [
        '梳理前六天的笔记',
        '完成小测验检查掌握度',
        '规划下周学习重点'
      ],
      topics: ['网络基础', 'Linux/Windows 基础', 'Web 基础', 'OWASP Top 10'],
      tools: [
        { name: 'Anki 记忆卡片', description: '用间隔重复记忆知识点', url: 'https://apps.ankiweb.net/' }
      ],
      environments: [],
      challenges: [
        { type: '阅读', title: '整理本周知识点脑图', description: '把 6 天学过的内容画成脑图' },
        { type: '实验', title: '重做 3 个 Juice Shop 挑战', description: '巩固 SQL 注入和 XSS' }
      ],
      notes: '第一周重在适应学习节奏，不必追求 100% 掌握。'
    },
    {
      id: 'basic-08', day: 8, stage: 'basic',
      title: 'OWASP Top 10（下）+ 其他 Web 漏洞',
      description: '继续学习文件上传、命令注入、目录遍历、反序列化等漏洞。',
      objectives: [
        '理解文件上传漏洞与绕过',
        '理解命令注入',
        '理解目录遍历/路径穿越',
        '了解反序列化与 SSRF 的原理'
      ],
      topics: [
        '文件上传：黑名单/白名单/后缀绕过',
        '命令注入：; / & / | / $()',
        '目录遍历：../../etc/passwd',
        'XXE 与 SSRF',
        '安全配置错误'
      ],
      tools: [
        { name: 'Dirsearch', description: '目录扫描', url: 'https://github.com/maurosoria/dirsearch' },
        { name: 'ffuf', description: 'Fuzz 工具', url: 'https://github.com/ffuf/ffuf' }
      ],
      environments: [
        { name: 'bWAPP', description: '超过 100 种漏洞靶场', url: 'http://localhost:8082', dockerImage: 'raesene/bwapp' }
      ],
      challenges: [
        { type: '实验', title: '在 bWAPP 中触发命令注入', description: '通过 & 符号拼接系统命令' },
        { type: '实验', title: '在 bWAPP 中做文件上传', description: '上传一个"图片马"并访问它' }
      ],
      notes: 'Web 漏洞的数量很多，但原理其实相通：输入未被信任。'
    },
    {
      id: 'basic-09', day: 9, stage: 'basic',
      title: '认证与授权漏洞',
      description: '身份认证是系统的第一道门。认证与授权失效是非常常见的漏洞。',
      objectives: [
        '理解越权（水平/垂直）',
        '理解弱密码/默认凭证',
        '了解 Session 劫持和 JWT 风险',
        '知道 MFA 的作用'
      ],
      topics: [
        'Broken Authentication',
        'IDOR（不安全直接对象引用）',
        'JWT 安全：None 算法/密钥泄露',
        'Session Fixation',
        'OAuth/SSO 常见问题'
      ],
      tools: [
        { name: 'jwt.io', description: '在线 JWT 解码/编码', url: 'https://jwt.io/' },
        { name: 'Hashcat', description: '密码哈希破解', url: 'https://hashcat.net/hashcat/' }
      ],
      environments: [
        { name: 'Juice Shop', description: '内含丰富的认证绕过关卡', url: 'http://localhost:3000', dockerImage: 'bkimminich/juice-shop' }
      ],
      challenges: [
        { type: '实验', title: '在 Juice Shop 中做一次越权访问', description: '查看别人订单/个人资料' },
        { type: '实验', title: '爆破弱密码', description: '用 Burp Intruder 或 ffuf 做简单密码爆破' }
      ],
      notes: '认证永远是高风险区——很多公司栽在这里。'
    },
    {
      id: 'basic-10', day: 10, stage: 'basic',
      title: '密码学入门',
      description: '加密是信息安全的基石。对称加密、非对称加密、哈希，一个都不能少。',
      objectives: [
        '理解对称与非对称加密的区别',
        '掌握常见算法：AES、RSA、SHA',
        '理解数字签名与证书的原理',
        '能用 OpenSSL 做基本操作'
      ],
      topics: [
        '对称加密：AES/DES/3DES',
        '非对称加密：RSA/ECC',
        '哈希：MD5/SHA-1/SHA-256',
        'PKI 与 HTTPS',
        'OpenSSL 实操'
      ],
      tools: [
        { name: 'CyberChef', description: '在线瑞士军刀（编解码/加密）', url: 'https://gchq.github.io/CyberChef/' },
        { name: 'OpenSSL', description: '最常用的命令行加密工具', url: 'https://www.openssl.org/' },
        { name: 'Cryptii', description: '在线加密转换', url: 'https://cryptii.com/' }
      ],
      environments: [],
      challenges: [
        { type: '实操', title: '用 OpenSSL 生成 RSA 公私钥并做签名', description: 'openssl genrsa/sign/verify' },
        { type: '实验', title: '在 CyberChef 中完成 5 种编码转换', description: 'Base64/Hex/Morse 等' }
      ],
      notes: '密码学不是数学，但它用到数学——理解概念最重要。'
    },
    {
      id: 'basic-11', day: 11, stage: 'basic',
      title: '社会工程学',
      description: '安全最薄弱的环节往往是人。社工是攻击的起点，也是防护的难点。',
      objectives: [
        '理解社会工程学的常见手段',
        '识别钓鱼邮件和短信',
        '了解社工在真实攻击中的作用',
        '学习企业反社工培训要点'
      ],
      topics: [
        '钓鱼邮件/钓鱼网站',
        '假冒身份/电话社工',
        'USB 丢包攻击',
        '信息搜集（OSINT）',
        '安全意识培训'
      ],
      tools: [
        { name: 'Social-Engineer Toolkit (SET)', description: '经典社工工具箱', url: 'https://github.com/trustedsec/social-engineer-toolkit/' },
        { name: 'Have I Been Pwned', description: '查询邮箱是否泄露', url: 'https://haveibeenpwned.com/' },
        { name: 'Maltego', description: '图形化信息关联工具', url: 'https://www.maltego.com/' }
      ],
      environments: [],
      challenges: [
        { type: '阅读', title: '阅读一篇真实钓鱼邮件的分析', description: '从"发件人、链接、附件、标题"分析' },
        { type: '实操', title: '用 HIBP 查自己的邮箱是否在历史泄漏中', description: '了解哪些站点在何时泄漏了自己的信息' }
      ],
      notes: '技术不够，人来凑——攻击者也是这么想的。'
    },
    {
      id: 'basic-12', day: 12, stage: 'basic',
      title: '信息收集（侦察）',
      description: '攻击者的第一步永远是信息收集。学好侦察，让你在红队中事半功倍。',
      objectives: [
        '掌握域名/子域枚举',
        '掌握端口扫描（Nmap）',
        '掌握 WHOIS/DNS 信息',
        '学会用 Google Dorks 做高级搜索'
      ],
      topics: [
        '主动/被动信息收集',
        'Nmap 常用参数',
        '子域名枚举 (Amass/Subfinder)',
        'Google Dorks: site/filetype/inurl',
        '指纹识别 (Wappalyzer/WhatWeb)'
      ],
      tools: [
        { name: 'Nmap', description: '端口扫描之王', url: 'https://nmap.org/' },
        { name: 'Amass', description: 'OWASP 信息收集框架', url: 'https://github.com/owasp-amass/amass' },
        { name: 'Subfinder', description: '子域名发现', url: 'https://github.com/projectdiscovery/subfinder' },
        { name: 'Exploit-DB', description: 'Exploit 数据库', url: 'https://www.exploit-db.com/' }
      ],
      environments: [
        { name: '本地 Kali', description: '以上工具都内置了', url: 'https://www.kali.org/' }
      ],
      challenges: [
        { type: '实操', title: '用 nmap 扫描自己的路由器/本机', description: 'nmap -sV -p- 192.168.1.1' },
        { type: '实操', title: '用 Google Dorks 搜索某公司暴露的敏感文件', description: '例如 site:xxx.com filetype:pdf intext:密码' }
      ],
      notes: '信息收集决定了你能发现多少漏洞。'
    },
    {
      id: 'basic-13', day: 13, stage: 'basic',
      title: '扫描与漏洞探测',
      description: '从"有什么"到"有什么漏洞"，进入主动扫描阶段。',
      objectives: [
        '认识漏洞扫描器（Nessus/OpenVAS/Nikto）',
        '理解 CVE/CVSS',
        '能查 Exploit-DB 找 PoC',
        '理解自动化扫描的局限'
      ],
      topics: [
        'CVE 与 NVD 数据库',
        'CVSS 风险评分',
        'Nikto Web 扫描',
        'Nuclei 模板驱动扫描',
        '扫描报告解读'
      ],
      tools: [
        { name: 'Nuclei', description: '社区驱动的漏洞扫描', url: 'https://github.com/projectdiscovery/nuclei' },
        { name: 'Nikto', description: 'Web 服务器扫描', url: 'https://cirt.net/Nikto2' },
        { name: 'CVE Details', description: 'CVE 搜索引擎', url: 'https://www.cvedetails.com/' }
      ],
      environments: [],
      challenges: [
        { type: '实操', title: '用 Nikto 扫描 Juice Shop', description: '看能找出多少信息' },
        { type: '阅读', title: '阅读一个近期 CVE 的技术细节', description: '例如在 cvedetails.com 上看最新的 CVE' }
      ],
      notes: '工具不是魔法。真正理解漏洞才能用好扫描器。'
    },
    {
      id: 'basic-14', day: 14, stage: 'basic',
      title: '第二周回顾与小项目',
      description: '两周学习后的综合练习与项目构建。',
      objectives: ['总结两周知识点', '做一个综合小项目', '找出自己薄弱环节'],
      topics: ['Web 漏洞总结', '工具链整合', '漏洞复现'],
      tools: [],
      environments: [],
      challenges: [
        { type: '项目', title: '做一份个人靶场报告', description: '在 Juice Shop 中完成 5 个挑战并写成报告' },
        { type: '阅读', title: '写一篇自己本周学习总结', description: '发表在博客或笔记中' }
      ],
      notes: '输出是最好的输入。'
    },
    {
      id: 'basic-15', day: 15, stage: 'basic',
      title: '反向 Shell / Bind Shell 原理',
      description: '漏洞之后如何"拿下机器"？Shell 是最基本的后渗透形式。',
      objectives: [
        '理解正向 Shell 与反向 Shell 的区别',
        '知道常见的一句话木马',
        '能在靶场中拿到一个 Shell'
      ],
      topics: [
        'reverse shell vs bind shell',
        'bash/python/php 一句话',
        'nc / ncat 使用',
        'Web Shell 的隐藏和持久化'
      ],
      tools: [
        { name: 'revshells.com', description: '快速生成各种 reverse shell', url: 'https://www.revshells.com/' },
        { name: 'ncat', description: 'Nmap 配套的 nc 替代', url: 'https://nmap.org/ncat/' }
      ],
      environments: [
        { name: 'DVWA / bWAPP', description: '支持文件上传+命令注入，可用于 shell 获取练习', url: 'http://localhost:8081' }
      ],
      challenges: [
        { type: '实验', title: '在受控靶场中拿到一个 reverse shell', description: '上传/注入后 nc 监听接收到 shell' }
      ],
      notes: '实战中拿到 shell 只是开始，后续提权/横向才是大戏。'
    },
    {
      id: 'basic-16', day: 16, stage: 'basic',
      title: '恶意软件分析入门',
      description: '病毒、木马、勒索软件的基本分类和行为识别。',
      objectives: [
        '了解病毒/蠕虫/木马/RAT 的区别',
        '理解勒索软件的工作机制',
        '能用沙箱查看恶意样本行为',
        '知道恶意软件的常见持久化手段'
      ],
      topics: [
        '恶意软件分类',
        '勒索软件家族（LockBit/Conti 等）',
        '常见持久化手段（Run/服务/计划任务）',
        'APT 与网络攻击杀伤链',
        'YARA 规则入门'
      ],
      tools: [
        { name: 'VirusTotal', description: '多引擎在线扫描', url: 'https://www.virustotal.com/' },
        { name: 'Any.Run', description: '交互式沙箱', url: 'https://any.run/' },
        { name: 'Joe Sandbox', description: '高级恶意样本分析', url: 'https://www.joesandbox.com/' }
      ],
      environments: [],
      challenges: [
        { type: '阅读', title: '看一份 VirusTotal 的公开报告', description: '理解其中行为标签的含义' }
      ],
      notes: '恶意软件分析需要非常强的 Windows 基础 + 汇编基础。'
    },
    {
      id: 'basic-17', day: 17, stage: 'basic',
      title: '基本提权技术',
      description: '以普通用户身份进入后，如何成为 root/Administrator？',
      objectives: [
        '知道 Linux 常见提权方式',
        '知道 Windows 常见提权方式',
        '理解"内核漏洞"与"服务配置错误"提权'
      ],
      topics: [
        'Linux: sudo 配置错误、SUID、内核漏洞',
        'Windows: 服务权限、注册表、AlwaysInstallElevated',
        'Token 与 UAC',
        'GTFOBins 与 LOFL'
      ],
      tools: [
        { name: 'LinPEAS', description: 'Linux 本地提权枚举', url: 'https://github.com/carlospolop/PEASS-ng/tree/master/linPEAS' },
        { name: 'WinPEAS', description: 'Windows 本地提权枚举', url: 'https://github.com/carlospolop/PEASS-ng/tree/master/winPEAS' },
        { name: 'GTFOBins', description: 'Unix 工具提权清单', url: 'https://gtfobins.github.io/' }
      ],
      environments: [
        { name: 'VulnHub 靶场', description: '下载各种可练习提权的虚拟机', url: 'https://www.vulnhub.com/' }
      ],
      challenges: [
        { type: '阅读', title: '看一篇 VulnHub 的提权 writeup', description: '读一篇完整的 writeup 理解思路' }
      ],
      notes: '提权是一门大艺术：经验 + 运气 + 枚举。'
    },
    {
      id: 'basic-18', day: 18, stage: 'basic',
      title: 'Burp Suite 深入使用',
      description: 'Web 安全从业者的核心工具——Burp Suite 全套功能。',
      objectives: [
        '配置 Burp 代理和证书',
        '会用 Proxy/Repeater/Intruder/Scanner',
        '学会编写简单的 Payload'
      ],
      topics: [
        'Burp CA 证书安装',
        'Proxy 拦截与转发',
        'Repeater 手动测试',
        'Intruder 四种攻击模式',
        'Active/Passive Scan'
      ],
      tools: [
        { name: 'Burp Suite', description: 'Web 安全的绝对王者', url: 'https://portswigger.net/burp' },
        { name: 'PortSwigger 学院', description: '官方免费 Web 安全实验室', url: 'https://portswigger.net/web-security' }
      ],
      environments: [],
      challenges: [
        { type: '实验', title: '完成 PortSwigger 学院的 SQL 注入实验', description: '做 3 个 lab' },
        { type: '实验', title: '完成 PortSwigger 学院的 XSS 实验', description: '做 3 个 lab' }
      ],
      notes: '学会用 Burp 后，Web 安全世界大不一样。'
    },
    {
      id: 'basic-19', day: 19, stage: 'basic',
      title: '身份认证与访问控制',
      description: '系统是如何识别"你是谁、你能做什么"的？',
      objectives: [
        '理解 DAC/MAC/RBAC',
        '理解 OAuth 2.0 / SAML / LDAP',
        '理解多因素认证（MFA）',
        '了解身份管理（IAM/SSO）'
      ],
      topics: [
        '访问控制模型',
        'OAuth 与 OpenID Connect',
        '企业 SSO / AD 域',
        '最小权限原则',
        '特权账号管理 PAM'
      ],
      tools: [
        { name: 'Keycloak', description: '开源 IAM', url: 'https://www.keycloak.org/' },
        { name: 'OAuth 2.0 Playground', description: 'OAuth 流程可视化', url: 'https://www.oauth.com/playground/' }
      ],
      environments: [],
      challenges: [
        { type: '阅读', title: '阅读 OAuth 2.0 简化指南', description: '画出 Authorization Code Flow 的时序图' }
      ],
      notes: '大型企业身份架构是一个独立方向。'
    },
    {
      id: 'basic-20', day: 20, stage: 'basic',
      title: '数据库安全',
      description: '数据库是攻击的"终极目标"。数据库安全配置不可忽视。',
      objectives: [
        '理解 MySQL/PostgreSQL/MongoDB 基本安全配置',
        '知道 SQL 注入防护原理',
        '会检查数据库是否暴露在公网'
      ],
      topics: [
        '数据库默认凭证',
        'SQL Server/MongoDB 暴露风险',
        '参数化查询 / ORM',
        '最小权限数据库账号',
        '数据库审计日志'
      ],
      tools: [
        { name: 'sqlmap', description: '自动化 SQL 注入', url: 'https://sqlmap.org/' },
        { name: 'DBeaver', description: '数据库通用管理工具', url: 'https://dbeaver.io/' }
      ],
      environments: [],
      challenges: [
        { type: '实操', title: '用 sqlmap 验证一个注入点', description: '在 DVWA 中 sqlmap -u URL --dbs' }
      ],
      notes: '很多生产数据库仍然用 root/空密码——令人震惊。'
    },
    {
      id: 'basic-21', day: 21, stage: 'basic',
      title: '第三周综合：搭建个人靶场',
      description: '本周重点是把前两周学的内容整合到一个可操作环境中。',
      objectives: [
        '本地搭建 3 个靶场',
        '尝试完整的攻击链：侦察 → 扫描 → 漏洞 → 利用',
        '写一份完整报告'
      ],
      topics: ['综合攻击链', '报告撰写'],
      tools: [],
      environments: [
        { name: 'Juice Shop', url: 'http://localhost:3000', description: 'Web 漏洞环境', dockerImage: 'bkimminich/juice-shop' },
        { name: 'DVWA', url: 'http://localhost:8081', description: 'PHP 漏洞环境', dockerImage: 'vulnerables/web-dvwa' },
        { name: 'bWAPP', url: 'http://localhost:8082', description: '丰富漏洞练习', dockerImage: 'raesene/bwapp' }
      ],
      challenges: [
        { type: '项目', title: '完整攻击链报告', description: '从 nmap 扫描开始，到拿到 shell 结束' },
        { type: '项目', title: '在 3 个靶场中各完成 5 个挑战', description: '总计 15 个' }
      ],
      notes: '学习到一定阶段后，必须动手做综合项目。'
    },
    {
      id: 'basic-22', day: 22, stage: 'basic',
      title: '信息安全法规与等保',
      description: '法律、法规、等保——商业环境中的安全基础框架。',
      objectives: [
        '了解《网络安全法》《数据安全法》《个人信息保护法》',
        '理解等保 2.0 的基本要求',
        '知道安全合规在企业中的位置'
      ],
      topics: [
        '三法一条例',
        '等保 1.0 vs 2.0',
        '等保五个定级',
        '关键信息基础设施 CII',
        'GDPR 与国内法的对比'
      ],
      tools: [
        { name: '等保网', description: '等保相关资源', url: 'http://www.djbh.net/' }
      ],
      environments: [],
      challenges: [
        { type: '阅读', title: '阅读《网络安全法》全文摘要', description: '关注法律责任部分' }
      ],
      notes: '等保是中国企业安全的底线要求。'
    },
    {
      id: 'basic-23', day: 23, stage: 'basic',
      title: '安全运营与 SOC 概念',
      description: '蓝队的日常工作：监控、检测、响应。',
      objectives: [
        '理解 SOC（安全运营中心）是什么',
        '理解 SIEM 的价值',
        '知道 IDS/IPS 的区别',
        '掌握基本日志分析方法'
      ],
      topics: [
        'IDS vs IPS',
        'SIEM：Splunk/ELK',
        'MITRE ATT&CK 框架',
        '告警 triage',
        '7x24 监控与值班'
      ],
      tools: [
        { name: 'Splunk Free', description: '日志分析', url: 'https://www.splunk.com/' },
        { name: 'ELK Stack', description: 'Elasticsearch + Logstash + Kibana', url: 'https://www.elastic.co/elastic-stack' },
        { name: 'Suricata', description: '开源 IDS/IPS', url: 'https://suricata.io/' }
      ],
      environments: [],
      challenges: [
        { type: '阅读', title: '阅读 MITRE ATT&CK 矩阵简介', description: '挑 3 个技术做笔记' }
      ],
      notes: '蓝队工作对企业来说更刚需，但也更枯燥。'
    },
    {
      id: 'basic-24', day: 24, stage: 'basic',
      title: '应急响应流程',
      description: '安全事件发生后怎么办？应急响应是每个安全团队的基本功。',
      objectives: [
        '掌握 6 阶段响应流程',
        '知道事件分级',
        '学会写事件处置报告'
      ],
      topics: [
        '准备 → 检测 → 遏制 → 根除 → 恢复 → 总结',
        '取证工具与证据保全',
        'RTO/RPO/MTD 概念',
        '事件管理流程（ITIL / ISO 27035）'
      ],
      tools: [
        { name: 'Velociraptor', description: '终端取证', url: 'https://www.velocidex.com/' }
      ],
      environments: [],
      challenges: [
        { type: '阅读', title: '读一份公开的事件响应报告', description: '看应急响应 6 阶段在报告中的体现' }
      ],
      notes: '真实的响应 80% 是沟通，20% 是技术。'
    },
    {
      id: 'basic-25', day: 25, stage: 'basic',
      title: '移动安全与 IoT 基础',
      description: '手机、智能家居、工业设备——新攻击面层出不穷。',
      objectives: [
        '了解 Android/iOS 权限模型',
        '了解 IoT 设备安全常见问题',
        '理解固件分析基本概念'
      ],
      topics: [
        'Android Manifest 与权限',
        'iOS 沙箱',
        'IoT 默认凭证',
        'UPnP/MQTT/Modbus 协议',
        '固件解包与分析'
      ],
      tools: [
        { name: 'MobSF', description: '移动应用安全框架', url: 'https://github.com/MobSF/Mobile-Security-Framework-MobSF' },
        { name: 'firmadyne', description: '固件模拟', url: 'https://github.com/firmadyne/firmadyne' }
      ],
      environments: [],
      challenges: [
        { type: '阅读', title: '阅读一个 IoT 漏洞披露文章', description: '理解攻击面与复现步骤' }
      ],
      notes: 'IoT 安全是未来十年的热点之一。'
    },
    {
      id: 'basic-26', day: 26, stage: 'basic',
      title: '物理安全与办公环境安全',
      description: '物理接触即 root。物理攻击在企业中真实存在。',
      objectives: [
        '理解物理安全三大要素',
        '了解社会工程在物理层面的应用',
        '掌握会议室/打印机/USB 的风险'
      ],
      topics: [
        '门禁与监控',
        '尾随攻击 (Tailgating)',
        'Bad USB',
        '打印机/复印机风险',
        '数据中心物理门禁'
      ],
      tools: [
        { name: 'Hak5', description: '物理攻击硬件', url: 'https://shop.hak5.org/' }
      ],
      environments: [],
      challenges: [
        { type: '阅读', title: '看一个 Bad USB 的演示视频', description: '理解它能做什么、如何防护' }
      ],
      notes: '不要忽视物理安全。'
    },
    {
      id: 'basic-27', day: 27, stage: 'basic',
      title: '漏洞管理与补丁',
      description: '漏洞是持续存在的——漏洞管理是 1% 天才 + 99% 的坚持。',
      objectives: [
        '理解漏洞生命周期',
        '知道 CVSS 评分如何使用',
        '学会制定补丁管理策略'
      ],
      topics: [
        '漏洞披露时间线',
        'CVE 编号流程',
        '0-day / n-day 概念',
        '补丁周期与补丁测试',
        '漏洞管理平台（Nessus/Qualys）'
      ],
      tools: [
        { name: 'CVE.mitre.org', description: 'CVE 官方', url: 'https://cve.mitre.org/' },
        { name: 'First.org CVSS', description: 'CVSS 计算器', url: 'https://www.first.org/cvss/calculator/3.1' }
      ],
      environments: [],
      challenges: [
        { type: '实操', title: '用 CVSS 计算器给一个漏洞打分', description: '选一个你关注的 CVE' }
      ],
      notes: '打补丁是安全团队最不性感却最重要的工作。'
    },
    {
      id: 'basic-28', day: 28, stage: 'basic',
      title: '密码管理与企业安全实践',
      description: '密码是最薄弱的一环，也是企业安全的起点。',
      objectives: [
        '了解密码管理器',
        '理解企业密码策略模板',
        '掌握密码泄露查询方法'
      ],
      topics: [
        '密码策略与复杂度',
        '密码管理器 Bitwarden/1Password',
        '企业特权账号管理 PAM',
        'HIBP 泄露查询',
        'Pass-the-Hash/kerberoasting'
      ],
      tools: [
        { name: 'Bitwarden', description: '开源密码管理器', url: 'https://bitwarden.com/' },
        { name: 'Have I Been Pwned', description: '密码泄露查询', url: 'https://haveibeenpwned.com/' }
      ],
      environments: [],
      challenges: [
        { type: '实操', title: '安装密码管理器并迁移所有密码', description: '开启 2FA' }
      ],
      notes: '用好密码管理是你个人安全的第一步。'
    },
    {
      id: 'basic-29', day: 29, stage: 'basic',
      title: 'CTF 入门：实战演习',
      description: '把学习到的知识综合运用到 CTF 场景，是最好的练兵场。',
      objectives: [
        '了解 CTF 是什么',
        '完成 3 道 CTF 题',
        '掌握基本 CTF 工具链'
      ],
      topics: [
        'CTF 三种模式（解题/攻防/混合）',
        '常见 CTF 题型：Web/Pwn/Crypto/Reverse/Misc/Forensic',
        'CTF 解题思路与套路'
      ],
      tools: [
        { name: '攻防世界', description: '国内知名 CTF 平台', url: 'https://adworld.xctf.org.cn/' },
        { name: 'BUUCTF', description: '国内 CTF 平台', url: 'https://buuoj.cn/' },
        { name: 'picoCTF', description: '对新手友好的美国平台', url: 'https://picoctf.org/' },
        { name: 'Hack The Box', description: '最流行的靶场平台', url: 'https://www.hackthebox.com/' },
        { name: 'TryHackMe', description: '教学式 CTF', url: 'https://tryhackme.com/' }
      ],
      environments: [],
      challenges: [
        { type: '项目', title: '至少完成 3 道 CTF 题', description: '在 picoCTF 或攻防世界入门区完成 3 题' }
      ],
      notes: 'CTF 是检验学习的最佳方式。'
    },
    {
      id: 'basic-30', day: 30, stage: 'basic',
      title: '基础阶段毕业：总结 + 未来方向',
      description: '30 天基础阶段完成。做一份自己的毕业项目。',
      objectives: [
        '输出一份完整的 30 天学习笔记',
        '明确自己下阶段要深入的方向（红/蓝/审计/合规）',
        '列出下一个 30 天计划'
      ],
      topics: [
        '职业方向：渗透测试 / 安全运营 / 安全审计 / 安全研究 / 安全合规',
        '证书规划：CISP、OSCP、CEH、CISSP',
        '学习路线整理'
      ],
      tools: [],
      environments: [],
      challenges: [
        { type: '项目', title: '毕业项目：完整的企业安全审计报告', description: '搭建一套环境，从扫描到修复建议，输出完整审计报告' },
        { type: '项目', title: '写一篇 30 天学习总结', description: '发布到任何博客平台' }
      ],
      notes: '30 天之后不是结束，只是真正学习的开始。'
    }
  ]
};

export const cyberSecurityStages: CyberStage[] = [basicStage];
