// 网络安全基础学习计划（30天）
export interface CyberDay {
  id: string;
  day: number;
  title: string;
  subtitle: string;
  objectives: string[];
  content: string;
  keyPoints: string[];
  codeExamples?: {
    title: string;
    language: string;
    code: string;
    explanation: string;
  }[];
  labEnvironment?: {
    name: string;
    description: string;
    url: string;
    type: 'docker' | 'online' | 'tool' | 'local';
    setup?: string;
    expectedOutput?: string;
  }[];
  recommendedTools?: {
    name: string;
    description: string;
    url: string;
    type: 'local' | 'online' | 'browser';
  }[];
  quiz?: QuizQuestion[];
  resources?: {
    name: string;
    url: string;
    type: 'article' | 'video' | 'book';
  }[];
  expertNotes?: {
    author: string;
    title: string;
    content: string;
    url?: string;
  }[];
  environmentSetup?: {
    dockerCommand?: string;
    localCommand?: string;
    prerequisites?: string[];
    verificationSteps?: string[];
  };
}

export type QuestionType = 'single' | 'multiple' | 'boolean' | 'fill';

export interface QuizQuestion {
  id?: string;
  type?: QuestionType;
  question: string;
  options?: string[];
  correctIndex?: number;
  correctIndices?: number[];
  correctAnswer?: string;
  explanation: string;
}

export interface CyberLearningPlan {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  difficulty: '入门' | '进阶' | '高级';
  totalDays: number;
  color: string;
  bgColor: string;
  borderColor: string;
  prerequisites: string[];
  certification: string;
  days: CyberDay[];
  category?: string;
  learningPath?: string[];
  skills?: string[];
  tags?: string[];
}

export const cyberBasicPlan: CyberLearningPlan = {
  id: 'basic',
  name: '网络安全基础',
  subtitle: 'Network Security Fundamentals',
  description: '从零开始，系统掌握网络安全基础知识体系，覆盖网络协议、Web安全、密码学、漏洞原理等核心领域。',
  icon: '🛡️',
  difficulty: '入门',
  totalDays: 30,
  color: 'text-cyber-green',
  bgColor: 'bg-cyber-green/10',
  borderColor: 'border-cyber-green/30',
  prerequisites: ['基本计算机操作能力', '了解网络基本概念'],
  certification: '可继续学习渗透测试或安全运维课程',
  days: [
    { 
      id: 'basic-1', day: 1, title: '网络安全概述', subtitle: 'Security Overview', 
      objectives: ['理解网络安全定义', '了解行业发展', '认识就业方向'], 
      content: `网络安全是保护网络系统免受未授权入侵、破坏、窃取数据的学科。

【CIA三要素】
• 保密性(Confidentiality)：防止未授权访问敏感信息
  - 数据分类：公开、内部、机密、绝密
  - 措施：加密、访问控制、身份认证
  
• 完整性(Integrity)：保证数据准确完整，未经授权不可修改
  - 措施：哈希、数字签名、版本控制、审计日志
  
• 可用性(Availability)：确保授权用户可正常访问资源
  - 措施：冗余、备份、容灾、负载均衡

【威胁分类】
• 外部威胁：黑客攻击、蠕虫病毒、DDoS攻击
• 内部威胁：员工误操作、恶意内部人员
• 社会工程：钓鱼邮件、电话诈骗、身份伪造

【行业方向】
• 安全运维：日常安全监控、事件响应
• Web安全：Web应用渗透测试、安全加固
• 渗透测试：模拟黑客攻击发现漏洞
• 安全分析：日志分析、威胁狩猎
• 安全架构：安全体系设计、风险管理

【网络安全法】
• 2017年6月1日《网络安全法》正式实施
• 等级保护制度成为法定要求
• 数据安全和个人信息保护日益重要`,
      keyPoints: ['CIA是信息安全核心目标', '保密性-完整性-可用性', '威胁分外部和内部', '社会工程利用人性弱点', '网络安全已上升为国家战略'],
      codeExamples: [{ title: '密码强度检测', language: 'python', code: 'import re\n\ndef check_password_strength(password):\n    \"\"\"检测密码强度\"\"\"\n    score = 0\n    feedback = []\n    \n    # 长度检查\n    if len(password) >= 8:\n        score += 1\n    else:\n        feedback.append(\"密码长度至少需要8位\")\n    \n    if len(password) >= 12:\n        score += 1\n    \n    # 包含大写字母\n    if re.search(r\"[A-Z]\", password):\n        score += 1\n    else:\n        feedback.append(\"建议包含大写字母\")\n    \n    # 包含小写字母\n    if re.search(r\"[a-z]\", password):\n        score += 1\n    else:\n        feedback.append(\"建议包含小写字母\")\n    \n    # 包含数字\n    if re.search(r\"[0-9]\", password):\n        score += 1\n    else:\n        feedback.append(\"建议包含数字\")\n    \n    # 包含特殊字符\n    if re.search(r\"[!@#$%^&*(),.?\":{}|<>]\", password):\n        score += 1\n    else:\n        feedback.append(\"建议包含特殊字符\")\n    \n    # 评估等级\n    if score <= 2:\n        level = \"弱\"\n        color = \"红色\"\n    elif score <= 4:\n        level = \"中等\"\n        color = \"黄色\"\n    else:\n        level = \"强\"\n        color = \"绿色\"\n    \n    return {\n        \"score\": score,\n        \"level\": level,\n        \"color\": color,\n        \"feedback\": feedback\n    }\n\n# 测试\npassword = input(\"请输入密码: \")\nresult = check_password_strength(password)\nprint(f\"密码强度: {result[\'level\']} ({result[\'color\']})\")\nif result[\"feedback\"]:\n    print(\"建议:\")\n    for tip in result[\"feedback\"]:\n        print(f\"  - {tip}\")', explanation: '检测密码强度，包含长度、大小写字母、数字和特殊字符检查' }],
      labEnvironment: [{ name: 'Wireshark抓包分析', description: '使用Wireshark分析TCP三次握手', url: 'https://www.wireshark.org/', type: 'local', setup: '1. 下载安装Wireshark: https://www.wireshark.org/\n2. 选择网络接口开始抓包\n3. 过滤HTTP流量: http\n4. 追踪TCP流查看完整通信\n5. 观察SYN→SYN-ACK→ACK握手过程', expectedOutput: '能看到完整的TCP三次握手过程，四次挥手断开过程' }],
      recommendedTools: [{ name: 'Wireshark', description: '网络协议分析器', url: 'https://www.wireshark.org/', type: 'local' }, { name: 'tcpdump', description: '命令行抓包工具', url: 'https://www.tcpdump.org/', type: 'local' }],
      quiz: [
        { type: 'single', question: 'CIA三要素不包括以下哪个？', options: ['A. 保密性', 'B. 完整性', 'C. 可用性', 'D. 可控性'], correctIndex: 3, explanation: 'CIA三要素：保密性(Confidentiality)、完整性(Integrity)、可用性(Availability)。可控性不属于CIA。' },
        { type: 'single', question: '以下哪种属于社会工程学攻击？', options: ['A. SQL注入', 'B. 钓鱼邮件', 'C. DDoS攻击', 'D. 暴力破解'], correctIndex: 1, explanation: '社会工程学利用人性弱点，钓鱼邮件是典型代表，通过欺骗用户获取敏感信息。' },
        { type: 'boolean', question: '《网络安全法》于2017年6月1日正式实施。', options: ['A. 正确', 'B. 错误'], correctIndex: 0, explanation: '《网络安全法》于2017年6月1日正式实施，是我国网络空间安全的基础性法律。' },
        { type: 'multiple', question: '以下哪些属于网络安全行业方向？（多选）', options: ['A. 安全运维', 'B. Web安全', 'C. 程序开发', 'D. 渗透测试'], correctIndices: [0, 1, 3], explanation: '安全运维、Web安全、渗透测试都是网络安全方向，程序开发不属于网络安全行业。' },
        { type: 'fill', question: '网络安全的三大核心目标是：保密性、______和可用性。', correctAnswer: '完整性', explanation: 'CIA三要素：保密性(Confidentiality)、完整性(Integrity)、可用性(Availability)。' },
        { type: 'single', question: '密码学在网络安全中的主要作用是保障？', options: ['A. 可用性', 'B. 完整性', 'C. 保密性', 'D. 以上全部'], correctIndex: 3, explanation: '密码学通过加密保障保密性，通过数字签名保障完整性，应用于网络安全各个方面。' },
        { type: 'boolean', question: '内部威胁比外部威胁更容易防范。', options: ['A. 正确', 'B. 错误'], correctIndex: 1, explanation: '内部威胁更难防范，因为内部人员通常已经具有一定的访问权限，且攻击行为更难被检测。' },
        { type: 'single', question: '以下哪项是保障数据完整性的技术手段？', options: ['A. 加密', 'B. 哈希函数', 'C. 防火墙', 'D. 入侵检测'], correctIndex: 1, explanation: '哈希函数可以检测数据是否被篡改，用于保障数据完整性。' }
      ],
      resources: [{ name: 'OSI模型详解', url: 'https://刊目网.com/article/116.html', type: 'article' }],
      expertNotes: [
        { author: '刘迟', title: '网络协议学习心得', content: '学习网络协议最好的方法就是抓包分析。建议用Wireshark抓取正常网络流量，逐一分析每个数据包的各层头部信息，理解封装和分用的过程。推荐书籍：《TCP/IP详解》卷1，《计算机网络：自顶向下方法》。', url: 'https://book.douban.com/subject/10794055/' },
        { author: '秦错误', title: '网络基础学习建议', content: '很多人忽视物理层和数据链路层，但这些是网络的基础。建议学习：1)理解二进制和十六进制转换，2)理解MAC地址结构，3)理解ARP协议的工作原理，4)理解交换机和路由器的区别。这些对后续学习网络安全非常重要。', url: 'https://zhuanlan.zhihu.com/p/26341615' }
      ],
      environmentSetup: {
        prerequisites: ['Wireshark已安装', '有网络连接'],
        verificationSteps: ['1. 运行Wireshark，选择网络接口', '2. 开始抓包，过滤: tcp', '3. 访问一个HTTP网站', '4. 追踪TCP流查看完整握手和HTTP请求']
      }
    },
    { 
      id: 'basic-3', day: 3, title: '常见端口与服务', subtitle: 'Common Ports', 
      objectives: ['记忆常用端口', '了解服务用途', '掌握端口扫描基础'], 
      content: `网络服务通过端口识别，端口号范围0-65535。

【知名端口(1-1023)】

Web服务
• 80/8080：HTTP，超文本传输协议
• 443：HTTPS，HTTP over TLS/SSL
• 3000：常见开发服务器端口
• 5000：Flask等开发框架默认端口

文件传输
• 20/21：FTP文件传输协议(20数据，21控制)
• 22：SSH/SFTP加密远程管理
• 69：TFTP简单文件传输

邮件服务
• 25：SMTP简单邮件传输
• 110：POP3邮局协议v3
• 143：IMAP交互邮件访问协议

数据库
• 3306：MySQL/MariaDB
• 1433：MS SQL Server
• 5432：PostgreSQL
• 6379：Redis
• 27017：MongoDB

远程管理
• 22：SSH(加密)
• 23：Telnet(明文，不安全)
• 3389：RDP远程桌面(Windows)
• 5900：VNC远程桌面

目录服务
• 389：LDAP轻量目录访问协议
• 636：LDAPS加密ldap

【注册端口(1024-49151)】
• 1080：SOCKS代理
• 1521：Oracle数据库
• 3306：MySQL
• 3389：RDP

【动态端口(49152-65535)】
客户端程序随机使用，也称临时端口

【端口分类】
• 系统端口(1-1023)：需要root权限
• 注册端口(1024-49151)：可自行注册使用
• 动态端口(49152-65535)：客户端临时使用`,
      keyPoints: ['HTTP=80, HTTPS=443', 'SSH=22, FTP=21', 'MySQL=3306, Redis=6379', 'RDP=3389远程桌面', '端口1-1023为系统端口'],
      codeExamples: [{ title: 'Python端口扫描器', language: 'python', code: 'import socket\nfrom concurrent.futures import ThreadPoolExecutor\n\ndef scan_port(host, port):\n    s = socket.socket()\n    s.settimeout(1)\n    result = s.connect_ex((host, port))\n    s.close()\n    return port, result == 0\n\nfor port in [22, 80, 443, 3306]:\n    port, open = scan_port(\"localhost\", port)\n    if open:\n        print(f\"Port {port} OPEN\")', explanation: '简单的端口扫描脚本' }],
      labEnvironment: [{ name: 'CSRF-Lab在线练习', description: 'CSRF漏洞测试平台', url: 'https://github.com/OWASP/NodeGoat', type: 'online', setup: '1. 访问本地OWASP NodeGoat或在线演示\n2. 找一个存在CSRF的功能(如修改密码)\n3. 构造恶意页面自动提交表单\n4. 验证是否成功执行', expectedOutput: '成功在用户不知情的情况下完成操作' }],
      recommendedTools: [{ name: 'Burp Suite', description: 'CSRF Poc生成器', url: 'https://portswigger.net/burp', type: 'local' }, { name: 'CSRF-Tester', description: 'CSRF测试工具', url: 'https://github.com/ OWASP/BSDG-SecFairy', type: 'local' }],
      quiz: [
        { question: 'CSRF攻击利用的是什么？', options: ['A. 用户的浏览器漏洞', 'B. 服务器漏洞', 'C. 用户已登录的身份', 'D. JavaScript漏洞'], correctIndex: 2, explanation: 'CSRF利用用户已登录的身份，在用户不知情的情况下发送恶意请求，浏览器会自动携带Cookie。' },
        { question: 'CSRF和XSS的主要区别是？', options: ['A. CSRF窃取数据，XSS不窃取', 'B. CSRF借用身份发请求，XSS执行脚本', 'C. XSS更危险', 'D. 没有区别'], correctIndex: 1, explanation: 'XSS是注入恶意脚本执行，可以获取数据；CSRF是借用已登录身份发送请求，通常不获取响应内容。' },
        { question: 'CSRF Token的作用是？', options: ['A. 加密数据传输', 'B. 验证请求来自自己的表单', 'C. 防止SQL注入', 'D. 防止XSS'], correctIndex: 1, explanation: 'CSRF Token是随机生成的，攻击者无法猜测，提交时验证Token可以确保请求来自合法表单。' },
        { question: 'SameSite=Strict Cookie会怎样？', options: ['A. Cookie永不丢失', 'B. Cookie永不发送', 'C. Cookie不随跨站请求发送', 'D. Cookie加密存储'], correctIndex: 2, explanation: 'SameSite=Strict的Cookie不会随任何跨站请求发送，是防止CSRF的有效手段，但可能影响正常跨站操作。' },
        { question: '以下哪个不是有效的CSRF防护？', options: ['A. CSRF Token', 'B. 验证码', 'C. 过滤敏感字符', 'D. SameSite Cookie'], correctIndex: 2, explanation: '过滤敏感字符是防XSS的方法，不是防CSRF。CSRF防护需要验证请求来源或使用Token。' }
      ],
      expertNotes: [
        { author: 'Leticia', title: '漫谈CSRF攻击与防御', content: 'CSRF看似简单，但很多大型网站都曾存在。关键点：1)所有敏感操作都需要CSRF防护，2)Token要随机且一次性的，3)验证Referer/Origin时要防范伪造，4)考虑子域名的信任问题，5)Token最好放在表单中而非Cookie中，因为Cookie可能被XSS攻击转储。SPA应用要注意API的CSRF防护。', url: 'https://blog.ccccf.cc/' }
      ],
      environmentSetup: {
        prerequisites: ['DVWA靶场已运行'],
        verificationSteps: ['1. 进入CSRF模块', '2. 使用Burp Suite生成CSRF POC', '3. 构造恶意页面测试']
      }
    ,
      resources: [{"name": "常见端口速查表", "url": "https://www.speedguide.net/ports.php", "type": "article"}, {"name": "IETF端口号分配", "url": "https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml", "type": "article"}, {"name": "Nmap端口扫描教程", "url": "https://nmap.org/book/port-scanning-tutorial.html", "type": "article"}, {"name": "网络服务安全配置指南", "url": "https://www.freebuf.com/articles/network/252965.html", "type": "article"}]},
    { id: 'basic-2', day: 2, title: 'OSI七层模型与TCP/IP', subtitle: 'OSI Model & TCP/IP', objectives: ['掌握OSI七层结构', '理解各层功能', '了解数据封装过程'], content: `OSI(开放系统互连)七层模型是网络通信的标准框架。

【七层结构详解】

第一层 物理层(Physical)
功能：比特流传输，物理介质
设备：网卡、集线器、网线、光纤
协议：RS-232、Ethernet(IEEE 802.3)
数据单元：比特(bit)

第二层 数据链路层(Data Link)
功能：帧传输，MAC地址寻址
设备：交换机、网桥
协议：Ethernet II、PPP、STP
数据单元：帧(frame)
MAC地址：48位，如00:1A:2B:3C:4D:5E

第三层 网络层(Network)
功能：IP路由选择，逻辑寻址
设备：路由器、三层交换机
协议：IP、ICMP、ARP
数据单元：数据包(packet)
IP地址：32位(IPv4)，如192.168.1.1

第四层 传输层(Transport)
功能：端到端连接，可靠传输
协议：TCP(可靠)、UDP(快速)
数据单元：数据段(segment)
端口号：16位，1-1023系统端口

第五层 会话层(Session)
功能：会话管理，同步
协议：NetBIOS、RPC

第六层 表示层(Presentation)
功能：数据格式转换，加密解密
协议：SSL/TLS、JPEG

第七层 应用层(Application)
功能：直接为用户提供服务
协议：HTTP、FTP、SMTP、DNS

【数据封装过程】
应用层数据 → 传输层添加端口 → 网络层添加IP → 数据链路层添加MAC → 物理层比特传输

【TCP三次握手】
1. 客户端发送SYN包(seq=x)
2. 服务器返回SYN+ACK(seq=y, ack=x+1)
3. 客户端发送ACK(ack=y+1)

【TCP/IP四层模型】
应用层(应用+表示+会话)、传输层、网络层、网络接口层(数据链路+物理)`, keyPoints: ['物理-链路-网络-传输-会话-表示-应用', 'TCP是可靠协议，UDP是快速协议', 'IP地址是网络层，MAC是链路层', 'HTTP在应用层', '数据从高层向低层封装'],
      codeExamples: [{ title: 'Python端口扫描', language: 'python', code: 'import socket\nfor port in [22, 80, 443, 3306]:\n    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n    s.settimeout(1)\n    result = s.connect_ex(("127.0.0.1", port))\n    if result == 0:\n        print(f"Port {port} is OPEN")\n    s.close()', explanation: '简单端口扫描脚本' }],
      labEnvironment: [{ name: 'Wireshark抓包', description: '使用Wireshark分析TCP三次握手', url: 'https://www.wireshark.org/', type: 'local', setup: '1. 下载Wireshark: https://www.wireshark.org/\n2. 选择网卡开始抓包\n3. 过滤HTTP流量: http\n4. 观察SYN→SYN-ACK→ACK握手过程', expectedOutput: '看到完整的TCP三次握手' }],
      recommendedTools: [{ name: 'Wireshark', description: '网络协议分析器', url: 'https://www.wireshark.org/', type: 'local' }],
      quiz: [
        { type: 'single', question: '路由器工作在哪一层？', options: ['A. 物理层', 'B. 数据链路层', 'C. 网络层', 'D. 传输层'], correctIndex: 2, explanation: '路由器根据IP地址进行路由选择，工作在网络层。' },
        { type: 'single', question: 'TCP和UDP的主要区别？', options: ['A. TCP更快', 'B. TCP可靠，UDP不可靠', 'C. UDP更安全', 'D. 没有区别'], correctIndex: 1, explanation: 'TCP提供可靠传输(三次握手、重传)，UDP提供快速传输但不保证可靠性。' },
        { type: 'single', question: 'MAC地址有多少位？', options: ['A. 32位', 'B. 48位', 'C. 64位', 'D. 128位'], correctIndex: 1, explanation: 'MAC地址是48位(6字节)。' },
        { type: 'single', question: 'HTTP协议工作在OSI哪一层？', options: ['A. 传输层', 'B. 网络层', 'C. 应用层', 'D. 会话层'], correctIndex: 2, explanation: 'HTTP是应用层协议。' },
        { type: 'boolean', question: 'TCP三次握手需要三次数据交换才能建立连接。', options: ['A. 正确', 'B. 错误'], correctIndex: 0, explanation: 'TCP三次握手：SYN→SYN-ACK→ACK，共三次数据交换。' },
        { type: 'fill', question: 'OSI七层模型中，______层负责端到端的可靠传输。', correctAnswer: '传输', explanation: '传输层负责端到端的可靠传输，主要协议是TCP。' },
        { type: 'multiple', question: '以下哪些是传输层协议？（多选）', options: ['A. TCP', 'B. UDP', 'C. IP', 'D. HTTP'], correctIndices: [0, 1], explanation: 'TCP和UDP都是传输层协议，IP是网络层，HTTP是应用层。' },
        { type: 'single', question: 'TCP三次握手的目的是？', options: ['A. 建立加密通道', 'B. 同步序列号建立连接', 'C. 传输数据', 'D. 断开连接'], correctIndex: 1, explanation: '三次握手同步双方序列号并建立可靠的TCP连接。' }
      ],
      resources: [{ name: 'OSI七层模型详解', url: 'https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/', type: 'article' }],
      expertNotes: [
        { author: '刘迟', title: '网络协议学习心得', content: '学习网络协议最好的方法就是抓包分析。建议用Wireshark抓取正常网络流量，逐一分析每个数据包的各层头部信息，理解封装和分用的过程。推荐书籍：《TCP/IP详解》卷1，《计算机网络：自顶向下方法》。学习顺序建议：先理解物理层和数据链路层，再学习网络层和传输层，最后学习应用层协议。', url: 'https://book.douban.com/subject/10794055/' },
        { author: '秦错误', title: '网络基础学习建议', content: '很多人忽视物理层和数据链路层，但这些是网络的基础。建议学习：1)理解二进制和十六进制转换，2)理解MAC地址结构，3)理解ARP协议的工作原理，4)理解交换机和路由器的区别。这些对后续学习网络安全非常重要。推荐使用模拟器：Cisco Packet Tracer或GNS3。', url: 'https://zhuanlan.zhihu.com/p/26341615' },
        { author: '网络安全老司机', title: 'TCP三次握手深度解析', content: 'TCP三次握手的本质是序列号同步和双向确认。第一次握手：客户端告诉服务器自己的初始序列号；第二次握手：服务器确认收到并告诉客户端自己的序列号；第三次握手：客户端确认收到。理解序列号的作用是理解TCP可靠性的关键。', url: 'https://blog.csdn.net/qq_38265137/article/details/80531884' }
      ],
      environmentSetup: { prerequisites: ['Wireshark已安装'], verificationSteps: ['1. 启动Wireshark选择网卡', '2. 过滤TCP流量', '3. 观察三次握手'] }
    },
    {
      id: 'basic-4', day: 4, title: '常见端口扫描', subtitle: 'Port Scanning', objectives: ['掌握Nmap使用', '理解扫描类型', '学习结果分析'], content: `端口扫描是渗透测试的第一步，用于发现目标系统开放的服务。

【常见端口分类】

Web服务：80(HTTP), 443(HTTPS), 8080(HTTP代理)
文件传输：21(FTP), 22(SSH/SFTP)
数据库：3306(MySQL), 1433(MSSQL), 5432(PostgreSQL), 6379(Redis)
远程管理：22(SSH), 23(Telnet), 3389(RDP)
邮件服务：25(SMTP), 110(POP3), 143(IMAP)
DNS：53

【Nmap扫描类型】
-sS: TCP SYN扫描(半开扫描)
-sT: TCP Connect扫描
-sU: UDP扫描
-sV: 版本检测
-O: 操作系统检测
-A: 全面扫描

【常用参数】
-p: 指定端口范围
--top-ports: 扫描最常见端口
-sC: 使用默认脚本
-T4: 快速扫描`, keyPoints: ['端口扫描是渗透测试第一步', 'Nmap是最常用工具', '-sS是SYN半开扫描', '-sV识别服务版本', '443=HTTP, 80=HTTP, 22=SSH'],
      codeExamples: [{ title: 'Nmap扫描命令', language: 'bash', code: '# 基本扫描\nnmap -sV 192.168.1.1\n\n# 扫描所有端口\nnmap -p- 192.168.1.1\n\n# 扫描常见1000个端口\nnmap 192.168.1.1\n\n# 全面扫描\nnmap -A 192.168.1.1', explanation: 'Nmap常用扫描命令' }],
      labEnvironment: [{ name: 'Nmap扫描', description: '使用Nmap扫描本地靶场', url: 'http://localhost', type: 'local', setup: '1. 安装Nmap: https://nmap.org/download.html\n2. 启动本地靶场: docker run -d -p 8081:80 vulnerables/web-dvwa\n3. 扫描: nmap -sV localhost', expectedOutput: '看到开放的端口和服务版本' }],
      recommendedTools: [{ name: 'Nmap', description: '网络扫描工具', url: 'https://nmap.org/', type: 'local' }],
      quiz: [
        { type: 'single', question: 'SSH默认端口是？', options: ['A. 21', 'B. 22', 'C. 23', 'D. 3389'], correctIndex: 1, explanation: 'SSH默认使用22端口。' },
        { type: 'single', question: 'MySQL数据库默认端口？', options: ['A. 1433', 'B. 3306', 'C. 5432', 'D. 6379'], correctIndex: 1, explanation: 'MySQL默认使用3306端口。' },
        { type: 'single', question: 'HTTPS使用哪个端口？', options: ['A. 80', 'B. 443', 'C. 8080', 'D. 8443'], correctIndex: 1, explanation: 'HTTPS默认443端口。' },
        { type: 'single', question: 'Nmap中-sS参数表示？', options: ['A. UDP扫描', 'B. SYN扫描', 'C. Connect扫描', 'D. Ping扫描'], correctIndex: 1, explanation: '-sS是SYN半开扫描。' },
        { type: 'boolean', question: '端口号范围是1-65535，其中1-1023是系统端口。', options: ['A. 正确', 'B. 错误'], correctIndex: 0, explanation: '端口号范围是0-65535，1-1023是知名端口(系统端口)。' },
        { type: 'fill', question: 'FTP协议使用两个端口：______端口用于控制连接，20端口用于数据连接。', correctAnswer: '21', explanation: 'FTP使用21端口作为控制连接，20端口作为数据连接。' },
        { type: 'multiple', question: '以下哪些端口属于Web服务常用端口？（多选）', options: ['A. 80', 'B. 443', 'C. 8080', 'D. 3306'], correctIndices: [0, 1, 2], explanation: '80(HTTP)、443(HTTPS)、8080(开发服务器)都是Web服务常用端口，3306是MySQL端口。' },
        { type: 'single', question: '以下哪个端口属于系统端口？', options: ['A. 22', 'B. 3306', 'C. 443', 'D. 8080'], correctIndex: 0, explanation: '22是系统端口(1-1023)，其他是注册端口。' }
      ],
      resources: [{ name: 'Nmap官方文档', url: 'https://nmap.org/book/man.html', type: 'article' }],
      expertNotes: [
        { author: '余弦', title: '端口扫描要点', content: '端口扫描是渗透测试的第一步。通过端口扫描可快速了解目标开放的服务，确定攻击面。常用策略：先扫描常见端口，再针对重点端口详细检测。建议使用-sS半开扫描，速度快且不易被日志记录。', url: 'https://nmap.org/' },
        { author: '安全研究员小明', title: 'Nmap高级技巧', content: 'Nmap不仅仅是端口扫描工具，还可以：1)使用-sV检测服务版本，2)使用-A进行全面扫描，3)使用--script运行NSE脚本，4)使用-oN/-oX输出报告。学习Nmap脚本引擎可以大幅扩展扫描能力。', url: 'https://medium.com/@securityjunky/nmap-advanced-techniques-5a6c8a4e497a' },
        { author: '渗透测试工程师', title: '端口扫描避坑指南', content: '实战中端口扫描需要注意：1)避免全端口扫描(-p-)，太耗时；2)注意扫描速率，避免触发IDS/IPS；3)UDP扫描较慢，需要耐心；4)扫描结果要交叉验证，避免误报；5)记住常见端口对应的服务。', url: 'https://www.secjuice.com/nmap-tutorial/' }
      ],
      environmentSetup: { prerequisites: ['Nmap已安装'], verificationSteps: ['1. 启动本地靶场', '2. 运行: nmap -sV localhost', '3. 查看开放端口'] }
    },
    {
      id: 'basic-5', day: 5, title: '加密基础与算法', subtitle: 'Encryption Basics', objectives: ['理解对称加密', '理解非对称加密', '了解混合加密'], content: `加密是将明文转换为密文的过程，保障数据保密性。

【对称加密】
原理：加密和解密使用相同密钥
特点：速度快，适合大量数据传输
算法：AES(高级加密标准)、DES(已淘汰)、3DES

AES模式：
ECB(电子密码本)：简单，相同明文产生相同密文
CBC(密码块链)：需要IV，更安全
GCM(伽罗瓦计数器)：提供认证，推荐

密钥长度：AES-128、AES-192、AES-256

【非对称加密】
原理：公钥加密，私钥解密
特点：速度慢，但解决密钥分发问题
算法：RSA、ECC(椭圆曲线)

RSA基于大数分解难题，公钥(n, e)，私钥(n, d)

【混合加密】
原理：非对称加密传输对称密钥，对称加密传输数据
应用：TLS/SSL协议

TLS握手流程：
1. 客户端获取服务器证书
2. 验证证书合法性
3. 客户端生成对称密钥
4. 用公钥加密对称密钥
5. 使用对称密钥加密通信`, keyPoints: ['对称加密使用相同密钥', '非对称加密使用公钥私钥', 'AES是当前对称加密标准', 'RSA基于大数分解', 'HTTPS使用混合加密'],
      codeExamples: [{ title: 'Python AES加密', language: 'python', code: 'from cryptography.fernet import Fernet\n# 生成密钥\nkey = Fernet.generate_key()\nf = Fernet(key)\n# 加密\ntoken = f.encrypt(b"Hello")\n# 解密\nprint(f.decrypt(token))', explanation: '使用Fernet进行AES加密' }],
      labEnvironment: [{ name: 'OpenSSL加密', description: '使用OpenSSL命令行', url: 'https://www.openssl.org/', type: 'local', setup: '1. 生成随机密钥: openssl rand -base64 32\n2. AES加密: openssl enc -aes-256-cbc -salt -in file.txt -out file.enc\n3. AES解密: openssl enc -d -aes-256-cbc -in file.enc', expectedOutput: '成功加密和解密文件' }],
      recommendedTools: [{ name: 'OpenSSL', description: '加密工具', url: 'https://www.openssl.org/', type: 'local' }],
      quiz: [
        { type: 'single', question: '对称和非对称加密的主要区别？', options: ['A. 速度不同', 'B. 密钥数量不同', 'C. 安全性不同', 'D. 应用场景不同'], correctIndex: 1, explanation: '对称使用相同密钥，非对称使用公钥私钥对。' },
        { type: 'single', question: '当前推荐的对称加密算法？', options: ['A. DES', 'B. 3DES', 'C. AES', 'D. RC4'], correctIndex: 2, explanation: 'AES是当前最安全最快的对称加密算法。' },
        { type: 'single', question: 'RSA算法的安全性基于？', options: ['A. 离散对数', 'B. 大数分解', 'C. 椭圆曲线', 'D. 哈希碰撞'], correctIndex: 1, explanation: 'RSA基于大数分解难题。' },
        { type: 'single', question: 'HTTPS使用哪种加密？', options: ['A. 仅对称', 'B. 仅非对称', 'C. 混合', 'D. 不加密'], correctIndex: 2, explanation: 'HTTPS使用混合加密。' },
        { type: 'boolean', question: '对称加密的速度比非对称加密快。', options: ['A. 正确', 'B. 错误'], correctIndex: 0, explanation: '对称加密速度比非对称加密快100-1000倍。' },
        { type: 'fill', question: 'AES是______加密标准，支持128、192、256位密钥长度。', correctAnswer: '高级', explanation: 'AES是Advanced Encryption Standard的缩写，即高级加密标准。' },
        { type: 'multiple', question: '以下哪些是对称加密算法？（多选）', options: ['A. AES', 'B. RSA', 'C. DES', 'D. ECC'], correctIndices: [0, 2], explanation: 'AES和DES是对称加密算法，RSA和ECC是非对称加密算法。' },
        { type: 'single', question: '为什么非对称加密不直接加密大数据？', options: ['A. 不安全', 'B. 速度太慢', 'C. 只能加密小数据', 'D. 密钥太长'], correctIndex: 1, explanation: '非对称加密速度慢100-1000倍。' }
      ],
      resources: [{ name: 'OpenSSL Cookbook', url: 'https://www.feistyduck.com/library/openssl-cookbook/', type: 'book' }],
      expertNotes: [
        { author: '知道创宇', title: 'Web加密实践', content: 'Web安全中加密应用：密码存储用bcrypt/scrypt/PBKDF2，通信用TLS，敏感数据用AES。但加密不是万能的，密钥管理是难点。对称加密速度快适合大量数据，非对称加密适合密钥交换。', url: 'https://blog.knownsec.com/' },
        { author: '密码学入门者', title: 'AES算法学习心得', content: 'AES是块密码，分组长度128位。学习AES应从结构入手：字节代换(SubBytes)、行移位(ShiftRows)、列混合(MixColumns)、轮密钥加(AddRoundKey)。推荐使用CryptoPals挑战来实践。', url: 'https://cryptopals.com/' },
        { author: '安全架构师老王', title: '混合加密原理详解', content: 'HTTPS采用混合加密：先用非对称加密交换对称密钥，再用对称加密传输数据。非对称加密保证密钥安全交换，对称加密保证传输效率。理解这个原理是理解TLS的基础。', url: 'https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/' }
      ],
      environmentSetup: { prerequisites: ['Python cryptography库'], verificationSteps: ['1. pip install cryptography', '2. 运行加密脚本'] }
    },
    {
      id: 'basic-6', day: 6, title: '哈希算法与数字签名', subtitle: 'Hash & Digital Signature', objectives: ['理解哈希特性', '掌握常见算法', '了解数字签名'], content: `哈希算法将任意长度输入转换为固定长度输出。

【哈希的四个特性】
单向性：易计算输出，难还原输入
固定输出：无论输入多长，输出长度固定
雪崩效应：输入微小变化，输出完全不同
抗碰撞：难找到两个不同输入产生相同输出

【常见算法】

MD5：128位，不安全，已被破解
SHA-1：160位，弱，已被攻破
SHA-256：256位，安全，推荐
SHA-512：512位，安全
SHA-3：最新标准
bcrypt/scrypt/Argon2：密码存储专用

【密码存储最佳实践】
不使用MD5/SHA-1存储密码
使用bcrypt、scrypt或Argon2
每个密码使用随机盐(16字节)
迭代次数( bcrypt建议cost=10 )

【数字签名】
发送方：计算哈希 → 用私钥加密哈希 → 发送消息+签名
接收方：用公钥解密签名得哈希 → 计算消息哈希 → 对比

【HMAC】
基于哈希的消息认证码，验证消息完整性和真实性`, keyPoints: ['哈希函数单向不可逆', 'MD5已被破解', 'SHA-256是推荐算法', 'bcrypt用于密码存储', '数字签名验证来源'],
      codeExamples: [{ title: 'Python哈希计算', language: 'python', code: 'import hashlib\nimport os\n\n# 密码加盐哈希\nsalt = os.urandom(16)\npassword = b"MyPass123"\nhashed = hashlib.pbkdf2_hmac("sha256", password, salt, 100000)\nprint(f"Hash: {hashed.hex()[:64]}")', explanation: '使用PBKDF2进行安全密码哈希' }],
      labEnvironment: [{ name: '在线哈希工具', description: 'CyberChef在线加密', url: 'https://gchq.github.io/CyberChef/', type: 'online', setup: '1. 访问CyberChef\n2. 输入数据\n3. 选择Hash算法\n4. 查看输出', expectedOutput: '理解哈希算法和雪崩效应' }],
      recommendedTools: [{ name: 'CyberChef', description: '在线加密工具', url: 'https://gchq.github.io/CyberChef/', type: 'online' }],
      quiz: [
        { type: 'single', question: 'MD5输出多少位？', options: ['A. 64位', 'B. 128位', 'C. 160位', 'D. 256位'], correctIndex: 1, explanation: 'MD5输出128位哈希值。' },
        { type: 'single', question: '以下哪个算法目前仍安全？', options: ['A. MD5', 'B. SHA-1', 'C. SHA-256', 'D. SHA-1+盐'], correctIndex: 2, explanation: 'SHA-256仍然安全。' },
        { type: 'single', question: '哈希算法的雪崩效应？', options: ['A. 输入越长输出越长', 'B. 输入微小变化输出完全不同', 'C. 相同输入相同输出', 'D. 无法还原输入'], correctIndex: 1, explanation: '雪崩效应指输入微小变化导致输出完全不同。' },
        { type: 'single', question: '密码存储应使用？', options: ['A. MD5', 'B. SHA-256', 'C. bcrypt/scrypt/Argon2', 'D. Base64'], correctIndex: 2, explanation: 'bcrypt/scrypt/Argon2专为密码设计。' },
        { type: 'boolean', question: '哈希算法是单向函数，无法逆向还原原始数据。', options: ['A. 正确', 'B. 错误'], correctIndex: 0, explanation: '哈希函数具有单向性，只能从输入计算输出，不能从输出还原输入。' },
        { type: 'fill', question: 'SHA-256输出______位哈希值，是目前推荐使用的安全哈希算法。', correctAnswer: '256', explanation: 'SHA-256输出256位哈希值。' },
        { type: 'multiple', question: '以下哪些是密码存储推荐使用的算法？（多选）', options: ['A. MD5', 'B. bcrypt', 'C. scrypt', 'D. Argon2'], correctIndices: [1, 2, 3], explanation: 'bcrypt、scrypt、Argon2都是专为密码存储设计的算法，MD5已不安全。' },
        { type: 'single', question: '哈希算法可以逆向吗？', options: ['A. 可以用公钥', 'B. 可以用私钥', 'C. 不可以', 'D. 可以暴力破解'], correctIndex: 2, explanation: '哈希是单向函数。' }
      ],
      resources: [{ name: '密码学基础', url: 'https://en.wikipedia.org/wiki/Cryptographic_hash_function', type: 'article' }],
      expertNotes: [
        { author: 'V那片天', title: '密码存储安全实践', content: '密码存储要点：不用MD5/SHA-1；用bcrypt cost=10-12；每个密码独立随机盐；多因素认证比任何复杂密码都重要。泄露的密码哈希应使用HIBP查询是否已被破解。', url: 'https://www.freebuf.com/' },
        { author: '安全开发工程师', title: '数字签名原理与应用', content: '数字签名=哈希+非对称加密。发送方用私钥签名，接收方用公钥验证。数字签名保证：1)完整性(数据未被篡改)，2)不可否认性(发送方不能否认发送)。推荐使用ECDSA或Ed25519。', url: 'https://medium.com/@alex.burka/digital-signatures-explained-8b86837022a0' },
        { author: '渗透测试专家', title: '哈希碰撞攻击实战', content: 'MD5和SHA-1已被破解，可以构造两个不同文件产生相同哈希。实战中可用于伪造数字签名、绕过文件校验。防御方法：升级到SHA-256或SHA-3。', url: 'https://www.schneier.com/blog/archives/2017/02/sha-1_collision.html' }
      ],
      environmentSetup: { prerequisites: ['Python hashlib'], verificationSteps: ['1. 运行哈希脚本', '2. 测试不同输入'] }
    },
    {
      id: 'basic-7', day: 7, title: 'HTTP协议详解', subtitle: 'HTTP Protocol', objectives: ['掌握HTTP结构', '理解请求方法', '了解状态码'], content: `HTTP(超文本传输协议)是Web应用的基础。

【HTTP请求结构】

请求行：GET /index.html HTTP/1.1
请求方法：GET、POST、PUT、DELETE
请求头：Host, User-Agent, Cookie, Content-Type
请求体：POST数据

【常见请求方法】
GET：获取资源，参数在URL
POST：提交数据，参数在请求体
PUT：更新资源
DELETE：删除资源
HEAD：只获取响应头

【HTTP响应结构】

状态行：HTTP/1.1 200 OK
状态码：
2xx(成功)：200 OK
3xx(重定向)：301, 302
4xx(客户端错误)：400, 401, 403, 404
5xx(服务器错误)：500, 502, 503

【重要状态码】
200 OK - 成功
301/302 - 重定向
400 Bad Request - 语法错误
401 Unauthorized - 需认证
403 Forbidden - 无权限
404 Not Found - 资源不存在
500 - 服务器错误
503 - 服务不可用

【HTTPS】
HTTP over TLS/SSL，端口443
加密传输，证书验证身份

【HTTP/2和HTTP/3】
HTTP/2：多路复用、头部压缩
HTTP/3：基于QUIC(UDP)`, keyPoints: ['HTTP是无状态协议', 'GET参数在URL, POST在请求体', '200成功, 404未找到', 'HTTP是明文协议', 'HTTPS=HTTP+TLS'],
      codeExamples: [{ title: 'Python HTTP请求', language: 'python', code: 'import requests\nr = requests.get("http://httpbin.org/get")\nprint(r.status_code)\nr = requests.post("http://httpbin.org/post", data={"key": "value"})\nprint(r.text)', explanation: '使用requests库发送HTTP请求' }],
      labEnvironment: [{ name: 'HTTPbin', description: '在线HTTP测试', url: 'https://httpbin.org/', type: 'online', setup: '1. 访问 httpbin.org\n2. /get测试GET请求\n3. /post测试POST\n4. /status/404测试状态码', expectedOutput: '理解HTTP请求响应' }],
      recommendedTools: [{ name: 'Postman', description: 'API测试工具', url: 'https://www.postman.com/', type: 'local' }],
      quiz: [
        { question: 'HTTP 404表示？', options: ['A. 服务器错误', 'B. 资源不存在', 'C. 权限不足', 'D. 请求超时'], correctIndex: 1, explanation: '404 Not Found表示资源不存在。' },
        { question: 'GET和POST的主要区别？', options: ['A. GET更快', 'B. GET参数在URL, POST在请求体', 'C. POST更安全', 'D. 没有区别'], correctIndex: 1, explanation: 'GET参数在URL，POST参数在请求体。' },
        { question: 'HTTP是无状态协议意味着？', options: ['A. 无法保存用户信息', 'B. 每次请求独立', 'C. 服务器不记录', 'D. 全部都是'], correctIndex: 3, explanation: '无状态意味着服务器不保留请求信息。' },
        { question: 'HTTPS相比HTTP增加了？', options: ['A. 更快', 'B. TLS/SSL加密', 'C. 更多功能', 'D. 更短响应'], correctIndex: 1, explanation: 'HTTPS = HTTP + TLS/SSL。' },
        { question: '301和302的区别？', options: ['A. 301临时, 302永久', 'B. 301永久, 302临时', 'C. 没有区别', 'D. 301用于POST'], correctIndex: 1, explanation: '301永久重定向，302临时重定向。' }
      ],
      resources: [{ name: 'HTTP协议详解', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', type: 'article' }],
      expertNotes: [{ author: 'P小猫', title: 'HTTP协议分析', content: 'Web渗透测试关注点：请求方法、请求头、状态码、安全头。推荐工具：Burp Suite的Repeater和Proxy模块。', url: 'https://zhuanlan.zhihu.com/p/25509101' }],
      environmentSetup: { prerequisites: ['Python requests'], verificationSteps: ['1. 浏览器F12查看请求', '2. 使用requests发送请求'] }
    },
    {
      id: 'basic-8', day: 8, title: 'XSS跨站脚本攻击', subtitle: 'XSS', objectives: ['理解XSS原理', '掌握三种类型', '学习防护措施'], content: `XSS(跨站脚本攻击)允许在受害者浏览器执行恶意JavaScript。

【XSS危害】
窃取Cookie/Session、键盘记录、修改页面(钓鱼)、植入蠕虫、DDoS

【三种XSS类型】

反射型XSS(Non-Persistent)
恶意脚本在当前请求中，不存储
攻击方式：通过URL参数传播
例：http://site.com/search?q=<script>alert(1)</script>

存储型XSS(Persistent)
恶意脚本存储在服务器数据库
所有访问者都会受害
危害最大！常见于评论区、论坛

DOM型XSS
不经过服务器，完全在客户端
利用DOM对象处理用户输入

【XSS绕过】
大小写：<ScRiPt>alert(1)</ScRiPt>
事件处理器：<img src=x onerror=alert(1)>
编码：HTML实体、Unicode
双重标签：<scr<script>ipt>

【防护措施】
输入过滤：白名单验证
输出编码：HTML转义，& → &amp;，< → &lt;
不同上下文不同编码
安全头：CSP, X-XSS-Protection
HttpOnly Cookie：JS无法读取`, keyPoints: ['XSS注入恶意脚本到页面', '存储型XSS最危险', 'HTML转义是基础防护', 'CSP可限制脚本', 'HttpOnly防Cookie被JS读取'],
      codeExamples: [{ title: 'XSS示例', language: 'html', code: '<!-- 攻击 -->\n<div>Hello, <?php echo $_GET["name"]; ?></div>\n\n<!-- 防护：HTML转义 -->\n<div>Hello, <?php echo htmlspecialchars($_GET["name"]); ?></div>', explanation: 'XSS攻击和HTML转义防护' }],
      labEnvironment: [{ name: 'DVWA XSS', description: 'DVWA XSS测试', url: 'http://localhost:8081', type: 'docker', setup: '1. 访问 http://localhost:8081\n2. 进入XSS Reflected模块\n3. Low级别输入<script>alert(1)</script>', expectedOutput: '成功弹出alert' }],
      recommendedTools: [{ name: 'Burp Suite', description: 'Web安全测试', url: 'https://portswigger.net/burp', type: 'local' }],
      quiz: [
        { question: '哪种XSS危害最大？', options: ['A. 反射型', 'B. 存储型', 'C. DOM型', 'D. 三者相同'], correctIndex: 1, explanation: '存储型XSS存储在数据库，所有访问者受害。' },
        { question: 'XSS在谁的浏览器执行？', options: ['A. 攻击者', 'B. 受害者', 'C. 服务器', 'D. 数据库'], correctIndex: 1, explanation: 'XSS是客户端攻击，在受害者浏览器执行。' },
        { question: 'XSS基础防护是？', options: ['A. 过滤关键字', 'B. HTML转义', 'C. 禁用JS', 'D. 使用POST'], correctIndex: 1, explanation: 'HTML转义是基础防护。' },
        { question: '哪个不是XSS危害？', options: ['A. 窃取Cookie', 'B. 窃取密码', 'C. 修改页面', 'D. 执行系统命令'], correctIndex: 3, explanation: 'XSS是浏览器端攻击，无法直接执行系统命令。' },
        { question: 'HttpOnly的作用？', options: ['A. 防止Cookie被盗', 'B. 防止JS访问Cookie', 'C. 加密Cookie', 'D. 永久保存'], correctIndex: 1, explanation: 'HttpOnly使JS无法读取Cookie。' }
      ],
      resources: [{ name: 'OWASP XSS', url: 'https://owasp.org/www-community/attacks/xss/', type: 'article' }],
      expertNotes: [{ author: 'Nicky', title: 'XSS深入理解', content: 'XSS可以做到：绕过HttpOnly窃取Cookie、识别用户指纹、键盘记录、修改页面钓鱼。防护要分层：输入过滤+输出编码+CSP+HttpOnly+CORS。', url: 'https://www.ichunqiu.com/' }],
      environmentSetup: { dockerCommand: 'docker run -d -p 8081:80 vulnerables/web-dvwa', prerequisites: ['DVWA运行中'], verificationSteps: ['1. 进入XSS模块', '2. 输入测试脚本'] }
    },
    {
      id: 'basic-9', day: 9, title: 'CSRF跨站请求伪造', subtitle: 'CSRF', objectives: ['理解CSRF原理', '掌握与XSS区别', '学习防护措施'], content: `CSRF(跨站请求伪造)利用受害者的已登录身份发起恶意请求。

【CSRF原理】
1. 用户登录网站A，获取有效Session
2. 用户被诱导访问恶意网站B
3. 网站B中包含自动提交的恶意请求
4. 浏览器自动携带Cookie发送请求
5. 网站A认为是合法请求

【CSRF特点】
• 攻击者不知道Cookie内容
• 只能发送请求，无法获取响应
• 利用的是用户已认证的身份

【CSRF与XSS区别】
XSS：执行JS，窃取数据
CSRF：借用身份发请求，不获取响应

【CSRF攻击示例】
<img src="http://bank.com/transfer?to=hacker&amount=10000">

【防护方法】

1. CSRF Token(最重要)
服务器生成随机Token
表单提交时验证
<input type="hidden" name="csrf_token" value="随机Token">

2. 验证Referer/Origin
检查请求来源

3. SameSite Cookie
SameSite=Strict：禁止跨站Cookie
SameSite=Lax：GET可发送

4. 验证码
关键操作二次确认

5. 双重提交Cookie
Token同时放在Cookie和参数中`, keyPoints: ['CSRF借用Cookie发请求', 'CSRF Token最有效', '与XSS原理不同', 'SameSite Cookie可阻止', 'XSS可窃取Token'],
      codeExamples: [{ title: 'CSRF Token验证', language: 'php', code: '<?php\nsession_start();\nif (empty($_SESSION["csrf_token"])) {\n    $_SESSION["csrf_token"] = bin2hex(random_bytes(32));\n}\n\nfunction verify_csrf() {\n    return hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"]);\n}', explanation: 'CSRF Token生成和验证' }],
      labEnvironment: [{ name: 'CSRF测试', description: 'CSRF漏洞测试', url: 'http://localhost:8081', type: 'docker', setup: '1. 进入DVWA CSRF模块\n2. 使用Burp生成CSRF POC\n3. 构造恶意页面测试', expectedOutput: '成功在用户不知情情况下执行操作' }],
      recommendedTools: [{ name: 'Burp Suite', description: 'CSRF测试', url: 'https://portswigger.net/burp', type: 'local' }],
      quiz: [
        { question: 'CSRF利用什么？', options: ['A. 浏览器漏洞', 'B. 服务器漏洞', 'C. 用户已登录身份', 'D. JS漏洞'], correctIndex: 2, explanation: 'CSRF利用用户已登录身份发送请求。' },
        { question: 'CSRF和XSS的主要区别？', options: ['A. CSRF窃取数据', 'B. CSRF借用身份发请求，XSS执行脚本', 'C. XSS更危险', 'D. 没有区别'], correctIndex: 1, explanation: 'XSS执行JS可获取数据，CSRF借用身份发请求。' },
        { question: 'CSRF Token的作用？', options: ['A. 加密数据', 'B. 验证请求来自自己表单', 'C. 防SQL注入', 'D. 防XSS'], correctIndex: 1, explanation: 'CSRF Token是随机的，攻击者无法猜测。' },
        { question: 'SameSite=Strict会怎样？', options: ['A. Cookie永不丢失', 'B. Cookie永不发送', 'C. Cookie不随跨站发送', 'D. Cookie加密'], correctIndex: 2, explanation: 'SameSite=Strict的Cookie不随跨站请求发送。' },
        { question: '以下哪个不是CSRF防护？', options: ['A. CSRF Token', 'B. 验证码', 'C. 过滤敏感字符', 'D. SameSite Cookie'], correctIndex: 2, explanation: '过滤敏感字符是防XSS，不是防CSRF。' }
      ],
      resources: [{ name: 'OWASP CSRF', url: 'https://owasp.org/www-community/attacks/csrf', type: 'article' }],
      expertNotes: [{ author: 'Leticia', title: 'CSRF防护', content: 'CSRF防护要点：所有敏感操作都需要CSRF防护；Token要随机且一次性；验证Referer时要防范伪造；Token最好放在表单中而非Cookie中。', url: 'https://blog.ccccf.cc/' }],
      environmentSetup: { dockerCommand: 'docker run -d -p 8081:80 vulnerables/web-dvwa', prerequisites: ['DVWA运行中'], verificationSteps: ['1. 进入CSRF模块', '2. 使用Burp生成POC'] }
    },
    {
      id: 'basic-10', day: 10, title: '文件上传漏洞', subtitle: 'File Upload',
      objectives: ['理解漏洞原理', '掌握绕过方法', '学习防护措施'], 
      content: `文件上传漏洞是Web应用中危险等级最高的漏洞之一。

【漏洞原理】
服务器未严格验证上传文件的类型、内容或名称，直接保存并可被访问执行。

【危害】
• 上传WebShell获取服务器权限
• 上传恶意文件传播恶意软件
• 消耗服务器存储资源
• 上传超大文件造成DoS

【上传点识别】
• 头像、证件照上传
• 文档上传（PDF、Word）
• 附件上传
• CMS后台的文件管理

【绕过方法】

1. 前端验证绕过
删除或修改JS验证代码
Burp Suite拦截修改

2. MIME类型绕过
修改Content-Type为合法类型
Content-Type: image/jpeg

3. 扩展名绕过
• 大小写：.pHp .PhP .PHP
• 双重扩展名：.jpg.php
• 空格/点绕过：.php(空格) .php.
• 00截断：.php%00.jpg (需关闭PHP解析)
• .htaccess重写

4. 内容检测绕过
• 图片马：在一张正常图片后追加PHP代码
• 合并绕过：将合法图片和PHP代码合并

【WebShell】
<?php @eval($_POST['cmd']); ?>
访问方式：POST请求，参数cmd=phpinfo();

【常见WebShell工具】
• 蚁剑(AntSword)：支持多种加密
• 冰蝎(Behinder)：加密流量
• 哥斯拉(Godzilla)：特征隐藏

【防护方法】

1. 白名单验证
只允许上传特定扩展名
$allowed = ['jpg', 'png', 'gif'];

2. 文件重命名
上传后重命名为随机名称
$filename = uniqid() . '.' . $ext;

3. 禁止执行权限
上传目录不解析PHP
Nginx: location /uploads { }

4. 内容检测
验证文件头是否为图片
getimagesize()检测图片尺寸`,
      keyPoints: ['上传恶意文件并执行', 'WebShell是最常见的恶意文件', '白名单比黑名单安全', '文件应存储在Web根目录外', '内容检测比扩展名检测安全'],
      codeExamples: [
        { title: '不安全的文件上传', language: 'php', code: '代码示例已简化，请参考实验环境进行实践', explanation: '对比不安全的文件上传和安全的验证流程' }
      ],
      labEnvironment: [{ name: 'DVWA File Upload', description: 'DVWA文件上传模块', url: 'http://localhost:8081', type: 'docker', setup: '1. 进入DVWA File Upload模块\n2. 上传php文件(如shell.php)\n3. 使用Burp拦截修改MIME类型\n4. 访问上传的文件: http://localhost:8081/hackable/uploads/shell.php\n5. 使用蚁剑或冰蝎连接', expectedOutput: '成功上传并执行WebShell' }],
      recommendedTools: [{ name: 'AntSword', description: 'WebShell管理工具', url: 'https://github.com/AntSwordProject/AntSword-Loader', type: 'local' }, { name: '冰蝎', description: '加密WebShell工具', url: 'https://github.com/rebeyond/Behinder', type: 'local' }],
      quiz: [
        { question: '文件上传漏洞最严重的危害是？', options: ['A. 消耗服务器存储', 'B. 上传恶意文件传播病毒', 'C. 获取服务器WebShell', 'D. 导致网站无法访问'], correctIndex: 2, explanation: '上传WebShell可以获取服务器命令执行权限，是最严重的危害。其他选项影响较小。' },
        { question: '防止文件上传漏洞最有效的方法是？', options: ['A. 限制文件大小', 'B. 白名单验证', 'C. 禁止上传页面访问', 'D. 使用HTTPS'], correctIndex: 1, explanation: '白名单只允许特定安全扩展名，从根本上拒绝危险文件。黑名单很容易被绕过。' },
        { question: '00截断的原理是？', options: ['A. 文件名被截断', 'B. ASCII 0被当作字符串结束', 'C. PHP解析错误', 'D. 文件上传失败'], correctIndex: 1, explanation: '00(ASCII 0)在字符串处理时被当作结束符，后面的内容被丢弃，可用于绕过.php.jpg这样的扩展名检查。' },
        { question: '图片马需要配合什么漏洞才能直接执行？', options: ['A. SQL注入', 'B. XSS', 'C. 文件包含', 'D. CSRF'], correctIndex: 2, explanation: '图片马只是将PHP代码追加到图片中，需要文件包含漏洞(如include)才能让PHP解析执行。' },
        { question: 'WebShell的功能是？', options: ['A. 扫描漏洞', 'B. 提供Web界面管理服务器', 'C. 执行系统命令', 'D. 加速网站'], correctIndex: 2, explanation: 'WebShell是运行在Web服务器上的命令执行工具，攻击者通过Web界面远程控制服务器。' }
      ],
      expertNotes: [
        { author: '安云', title: '从文件上传到服务器权限', content: '文件上传是getshell最常用的手段。实战中注意：1)先用简单payload测试，如<?php phpinfo(); ?>，2)根据服务器类型选择shell，如Linux用bash反弹连接，3)注意文件路径是绝对路径还是相对路径，4)遇到截断先看PHP版本和magic_quotes配置，5)上传后要验证是否真的能执行。推荐工具：Burp Suite截包、AntSword管理WebShell。', url: 'https://www.91ri.org/' }
      ],
      environmentSetup: {
        dockerCommand: 'docker run -d -p 8081:80 vulnerables/web-dvwa',
        prerequisites: ['DVWA已运行', 'AntSword已安装(可选)'],
        verificationSteps: ['1. 创建shell.php文件', '2. 上传到DVWA', '3. 访问上传的文件', '4. 如果能执行则漏洞存在']
      }
    ,
      resources: [{"name": "文件上传漏洞详解(OWASP)", "url": "https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload", "type": "article"}, {"name": "文件上传绕过手册", "url": "https://www.anquanke.com/post/id/208639", "type": "article"}, {"name": "图片马生成技术", "url": "https://www.freebuf.com/articles/web/239245.html", "type": "article"}, {"name": "文件上传安全最佳实践", "url": "https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html", "type": "article"}]},
    { id: 'basic-11', day: 11, title: 'SSRF服务器端请求伪造', subtitle: 'Server-Side Request Forgery', objectives: ['理解SSRF原理', '掌握攻击方式', '学习防护措施'], content: `SSRF让服务器代替攻击者发起请求，可访问内网资源。

【攻击原理】
Web应用接受用户输入作为URL参数，未严格验证就直接发起请求。

【攻击场景】
• 访问内网IP：?url=http://192.168.1.1/admin
• 读取本地文件：?url=file:///etc/passwd
• 扫描内网端口：?url=http://192.168.1.1:22
• 攻击内部服务：?url=gopher://127.0.0.1:6379/_INFO

【Gopher协议】
可访问Redis、Memcache等服务的文本协议
结合未授权访问可执行任意命令

【防护方法】
1. URL白名单验证
2. 禁止内网IP访问
3. 禁用危险协议(file://, gopher://, dict://)
4. 限制请求超时`, keyPoints: ['SSRF让服务器代替发起请求', '可访问内网资源', '可读取本地文件', '协议限制是重要防护', 'URL白名单最有效'],
      codeExamples: [{ title: 'SSRF漏洞代码', language: 'php', code: '<?php\n// 危险！直接请求用户输入的URL\n$url = $_GET["url"];\n$content = file_get_contents($url);\necho $content;\n\n// 攻击payload\n// ?url=http://192.168.1.1/admin\n// ?url=file:///etc/passwd\n// ?url=http://127.0.0.1:22\n\n// 安全做法\nfunction is_safe_url($url) {\n    $parsed = parse_url($url);\n    // 只允许HTTP/HTTPS\n    if (!in_array($parsed["scheme"], ["http", "https"])) {\n        return false;\n    }\n    // 检查内网IP\n    $ip = gethostbyname($parsed["host"]);\n    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE)) {\n        return true;\n    }\n    return false;\n}', explanation: 'SSRF漏洞代码和安全修复示例' }],
      labEnvironment: [{ name: 'SSRF靶场', description: '本地SSRF练习', url: 'http://localhost:8081', type: 'docker', setup: '1. DVWA有SSRF模块\n2. 访问: ?url=http://127.0.0.1:80\n3. 尝试: ?url=file:///etc/passwd', expectedOutput: '能够通过SSRF访问服务器内部资源' }],
      recommendedTools: [{ name: 'SSRFmap', description: 'SSRF自动化工具', url: 'https://github.com/swisskyrepo/SSRFmap', type: 'local' }],
      quiz: [
        { question: 'SSRF和CSRF的主要区别是？', options: ['A. SSRF窃取Cookie', 'B. SSRF由服务器发起', 'C. SSRF攻击内网', 'D. 两者相同'], correctIndex: 1, explanation: 'SSRF利用服务器发起请求可访问内网，CSRF利用用户浏览器发起请求。' },
        { question: 'SSRF可以读取本地文件使用的协议是？', options: ['A. http://', 'B. file://', 'C. ftp://', 'D. gopher://'], correctIndex: 1, explanation: 'file://协议可以读取本地文件，如file:///etc/passwd。' },
        { question: 'Gopher协议在SSRF中的用途是？', options: ['A. 读取文件', 'B. 扫描端口', 'C. 攻击Redis等文本协议服务', 'D. 下载文件'], correctIndex: 2, explanation: 'Gopher协议可以构建文本请求，攻击Redis、Memcache等服务的未授权访问。' },
        { question: '防止SSRF最有效的方法是？', options: ['A. 过滤localhost', 'B. URL白名单', 'C. 过滤内网IP', 'D. 使用POST方法'], correctIndex: 1, explanation: 'URL白名单只允许访问预定义的合法URL，从根本上防止SSRF。' },
        { question: 'SSRF可以访问的内网资源包括？', options: ['A. 云服务器元数据', 'B. 数据库', 'C. 内部管理后台', 'D. 全部都可以'], correctIndex: 3, explanation: 'SSRF可以访问服务器所在内网的任意资源，包括元数据、数据库、管理后台等。' }
      ],
      expertNotes: [{ author: 'H小黑', title: 'SSRF深入利用', content: 'SSRF看似简单，但利用场景非常丰富：1)通过file://读取配置文件，2)通过gopher://攻击Redis/数据库，3)通过dict://探测端口，4)结合云服务元数据获取敏感信息。推荐工具：SSRFmap自动化检测，Burp Suite手动测试。', url: 'https://blog.91test.org/' }],
      environmentSetup: { dockerCommand: 'docker run -d -p 8081:80 vulnerables/web-dvwa', prerequisites: ['DVWA已运行'], verificationSteps: ['1. 进入SSRF模块', '2. 尝试访问内部URL'] }
    ,
      resources: [{"name": "SSRF攻击完全指南", "url": "https://portswigger.net/web-security/ssrf", "type": "article"}, {"name": "SSRF漏洞挖掘与利用", "url": "https://www.anquanke.com/post/id/201885", "type": "article"}, {"name": "云环境SSRF攻击", "url": "https://www.freebuf.com/articles/web/260806.html", "type": "article"}, {"name": "SSRF防御方案设计", "url": "https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html", "type": "article"}]},
    { id: 'basic-12', day: 12, title: '密码学总结与PKI体系', subtitle: 'PKI & Digital Certificate', objectives: ['理解PKI体系', '掌握数字证书', '了解TLS握手'], content: `PKI(公钥基础设施)是支撑现代加密通信的核心体系。

【PKI组件】
1. CA(证书颁发机构)：签发和管理数字证书
2. RA(注册机构)：验证证书申请者身份
3. 数字证书：包含公钥和身份信息的电子文件
4. 证书吊销列表(CRL)：存储已吊销证书
5. OCSP服务器：在线查询证书状态

【数字证书】
格式：X.509 v3
内容：
• 公钥
• 持有者信息
• 颁发者信息
• 有效期
• 序列号
• 签名

证书链：根证书 → 中间证书 → 服务器证书

【TLS握手过程】
1. 客户端发送ClientHello(支持的加密套件)
2. 服务器发送ServerHello(选定加密套件)+证书
3. 客户端验证证书，提取公钥
4. 客户端生成预主密钥，用公钥加密发送
5. 双方计算会话密钥
6. 加密通信开始

【自签名证书】
openssl req -newkey rsa:2048 -nodes -keyout server.key -x509 -days 365 -out server.crt`, keyPoints: ['PKI是公钥基础设施', 'CA是证书颁发机构', 'X.509是证书标准', 'TLS握手建立加密通道', '证书链验证是重要环节'],
      codeExamples: [{ title: 'OpenSSL生成证书', language: 'bash', code: '# 生成私钥和自签名证书\nopenssl req -newkey rsa:2048 -nodes -keyout server.key -x509 -days 365 -out server.crt\n\n# 查看证书信息\nopenssl x509 -in server.crt -text -noout\n\n# 验证证书\nopenssl verify server.crt\n\n# 创建证书链(中间CA)\nopenssl req -new -key intermediate.key -out intermediate.csr\nopenssl x509 -req -in intermediate.csr -CA root.crt -CAkey root.key -CAcreateserial -out intermediate.crt', explanation: '使用OpenSSL创建自签名证书和证书链' }],
      labEnvironment: [{ name: 'SSL Labs测试', description: '在线SSL/TLS检测', url: 'https://www.ssllabs.com/ssltest/', type: 'online', setup: '1. 访问SSL Labs\n2. 输入要检测的域名\n3. 查看SSL配置评级和详细报告', expectedOutput: '获取SSL配置评分和漏洞检测结果' }],
      recommendedTools: [{ name: 'OpenSSL', description: '加密工具', url: 'https://www.openssl.org/', type: 'local' }],
      quiz: [
        { question: 'PKI的核心组件是？', options: ['A. 浏览器', 'B. CA证书颁发机构', 'C. 防火墙', 'D. 加密算法'], correctIndex: 1, explanation: 'CA(Certificate Authority)是PKI的核心，负责签发和管理数字证书。' },
        { question: 'TLS握手的主要目的是？', options: ['A. 建立加密通道', 'B. 传输数据', 'C. 用户认证', 'D. 会话保持'], correctIndex: 0, explanation: 'TLS握手用于协商加密算法并建立加密通道，后续数据传输都使用会话密钥加密。' },
        { question: '证书链验证的目的是？', options: ['A. 加快速度', 'B. 验证服务器身份可信', 'C. 节省带宽', 'D. 没有用处'], correctIndex: 1, explanation: '证书链验证确保服务器证书是被可信CA签发的，确保服务器身份真实。' },
        { question: '自签名证书的问题在于？', options: ['A. 不安全', 'B. 不被浏览器信任', 'C. 已被破解', 'D. 效率低'], correctIndex: 1, explanation: '自签名证书不被浏览器内置的CA信任，会显示不安全警告。' },
        { question: 'X.509证书不包含以下哪个信息？', options: ['A. 公钥', 'B. 私钥', 'C. 持有者信息', 'D. 有效期'], correctIndex: 1, explanation: 'X.509证书包含公钥、持有者信息、颁发者信息、有效期等，但不包含私钥。私钥需要单独生成和保管。' }
      ],
      expertNotes: [{ author: 'Acutus', title: 'TLS协议安全指南', content: 'TLS安全配置要点：1)使用TLS 1.2/1.3，禁用SSLv3和TLS1.0/1.1，2)使用强加密套件，禁用弱加密，3)配置完美的前向保密(PFS)，4)合理设置HSTS，5)定期更新证书。推荐工具：SSL Labs测试、testssl.sh。', url: 'https://blog.pyhttp.com/' }],
      environmentSetup: { prerequisites: ['OpenSSL已安装'], verificationSteps: ['1. 使用OpenSSL生成自签名证书', '2. 配置Web服务器使用证书', '3. 使用SSL Labs测试配置'] }
    ,
      resources: [{"name": "PKI体系深入解析", "url": "https://www.cloudflare.com/learning/ssl/how-does-public-key-encryption-work/", "type": "article"}, {"name": "数字证书工作原理", "url": "https://www.freebuf.com/articles/network/232061.html", "type": "article"}, {"name": "SSL/TLS握手详解", "url": "https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/", "type": "article"}, {"name": "证书透明性监控", "url": "https://crt.sh/", "type": "article"}]},
    { id: 'basic-13', day: 13, title: '身份认证与授权', subtitle: 'Authentication & Authorization', objectives: ['掌握认证因素', '了解多因素认证', '理解OAuth/JWT'], content: `身份认证确认用户身份，授权决定用户可以做什么。

【认证因素】
1. 知识因素：密码、安全问题
2. 持有因素：U盾、手机、硬件令牌
3. 生物因素：指纹、虹膜、人脸

【多因素认证(MFA)】
组合多种认证因素：
• 密码+短信验证码
• 密码+硬件令牌
• 指纹+密码

【Session vs JWT】
Session：服务端存储，Cookie传输
JWT：Token自包含用户信息

【OAuth 2.0】
授权框架，允许第三方应用访问用户资源
流程：授权码模式最安全
1. 用户授权
2. 颁发授权码
3. 用授权码换Token

【SSO单点登录】
一次登录，多系统访问
SAML是传统的SSO协议
OIDC是现代的SSO方案`,
      keyPoints: ['身份认证三因素', '多因素比单因素安全', 'JWT是令牌格式', 'Session存储服务端', 'OAuth是授权框架'],
      codeExamples: [{ title: 'JWT实现', language: 'python', code: 'import jwt\nimport datetime\n\n# 创建JWT\nsecret = "your-secret-key"\npayload = {\n    "user_id": 123,\n    "username": "admin",\n    "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)\n}\ntoken = jwt.encode(payload, secret, algorithm="HS256")\nprint(f"JWT Token: {token}")\n\n# 验证JWT\ntry:\n    decoded = jwt.decode(token, secret, algorithms=[\"HS256\"])\n    print(f"Decoded: {decoded}")\nexcept jwt.ExpiredSignatureError:\n    print(\"Token已过期\")\nexcept jwt.InvalidTokenError:\n    print(\"无效Token\")', explanation: '使用PyJWT创建和验证JWT Token' }],
      labEnvironment: [{ name: 'JWT调试', description: '在线JWT解析', url: 'https://jwt.io/', type: 'online', setup: '1. 访问 https://jwt.io/\n2. 输入JWT Token\n3. 查看Header和Payload\n4. 验证签名', expectedOutput: '能够解析JWT Token并理解其结构' }],
      recommendedTools: [{ name: 'Auth0', description: '身份认证服务', url: 'https://auth0.com/', type: 'online' }],
      quiz: [
        { question: '以下哪种是双因素认证？', options: ['A. 密码+安全问题', 'B. 密码+指纹', 'C. 指纹+面部', 'D. 智能卡+U盾'], correctIndex: 1, explanation: '密码是知识因素，指纹是生物因素，不同类型组合才是双因素。' },
        { question: 'JWT的优势是？', options: ['A. 服务端存储', 'B. 自包含用户信息', 'C. 更安全', 'D. 无法伪造'], correctIndex: 1, explanation: 'JWT将用户信息包含在Token本身中，无需服务端存储。' },
        { question: 'OAuth 2.0的授权码模式用于？', options: ['A. 用户登录', 'B. 让第三方应用访问用户资源', 'C. 加密通信', 'D. 存储数据'], correctIndex: 1, explanation: 'OAuth 2.0授权码模式允许第三方应用在用户授权下访问其在其他服务的资源。' },
        { question: 'Session认证的问题在于？', options: ['A. 不安全', 'B. 服务端存储开销', 'C. 无法验证', 'D. 速度慢'], correctIndex: 1, explanation: 'Session需要在服务端存储，高并发时增加服务器内存压力。' },
        { question: 'HttpOnly Cookie的作用是？', options: ['A. 防止XSS读取Session', 'B. 加快速度', 'C. 加密数据', 'D. 持久保存'], correctIndex: 0, explanation: 'HttpOnly Cookie无法被JavaScript读取，可防止XSS攻击窃取Session ID。' }
      ],
      expertNotes: [{ author: 'CrazyRabbit', title: '认证系统安全设计', content: '认证系统设计要点：1)密码存储用bcrypt/scrypt，2)登录失败要限流，3)使用MFA保护重要账户，4)JWT要设置合理过期时间，5)Refresh Token要安全存储。推荐实践：Google Authenticator实现TOTP MFA。', url: 'https://blog.ccccf.cc/' }],
      environmentSetup: { prerequisites: ['Python已安装'], verificationSteps: ['1. pip install pyjwt', '2. 运行JWT创建和验证脚本'] }
    ,
      resources: [{"name": "JWT认证机制详解", "url": "https://jwt.io/introduction", "type": "article"}, {"name": "OAuth 2.0协议详解", "url": "https://oauth.net/2/", "type": "article"}, {"name": "多因素认证实施指南", "url": "https://www.nist.gov/itl/applied-cybersecurity/tig/back-basics-multi-factor-authentication", "type": "article"}, {"name": "单点登录SSO安全", "url": "https://www.anquanke.com/post/id/205854", "type": "article"}]},
    { id: 'basic-14', day: 14, title: '越权与业务逻辑漏洞', subtitle: 'Access Control Flaws', objectives: ['理解越权漏洞', '掌握业务逻辑漏洞', '学习防护措施'], content: `越权和业务逻辑漏洞是Web应用中常见但难以发现的问题。

【越权漏洞类型】
1. 水平越权：同级别用户间访问对方数据
   例：用户A访问用户B的订单
   
2. 垂直越权：低权限用户访问高权限功能
   例：普通用户访问管理员后台

【IDOR不安全的直接对象引用】
用户可预测的资源ID
例：/order?id=1001 → /order?id=1002

【业务逻辑漏洞】
1. 跳过验证步骤：绕过验证码、跳过密码验证
2. 金额修改：负数购买、金额溢出
3. 竞争条件：并发情况下的超卖
4. 验证码回退：验证成功后验证码未失效

【防护方法】
1. 对象级别权限检查
2. 随机不可预测的资源ID
3. 关键操作验证当前用户身份
4. 服务端验证每一步业务流程`,
      keyPoints: ['水平越权是同级别越权', '垂直越权是权限提升', 'IDOR不验证对象归属', '业务漏洞存在业务流程中', '需要理解业务才能发现'],
      codeExamples: [{ title: '越权漏洞代码', language: 'php', code: '<?php\n// 水平越权漏洞\nsession_start();\n$user_id = $_SESSION["user_id"];\n$order_id = $_GET["order_id"];  // 用户可控\n$sql = "SELECT * FROM orders WHERE order_id=$order_id";\n// 未验证订单是否属于当前用户\n\n// 安全做法\n$sql = "SELECT * FROM orders WHERE order_id=$order_id AND user_id=$user_id";\n// 添加用户ID验证', explanation: '水平越权漏洞和修复方法' }],
      labEnvironment: [{ name: 'Juice Shop', description: 'OWASP Juice Shop靶场', url: 'http://localhost:3000', type: 'docker', setup: '1. 访问 http://localhost:3000\n2. 注册账户\n3. 尝试修改URL参数访问其他用户数据\n4. 寻找水平越权和垂直越权漏洞', expectedOutput: '发现并利用越权漏洞访问未授权数据' }],
      recommendedTools: [{ name: 'Burp Suite', description: '越权测试工具', url: 'https://portswigger.net/burp', type: 'local' }],
      quiz: [
        { question: '普通用户访问另一个普通用户信息属于？', options: ['A. 垂直越权', 'B. 水平越权', 'C. 未授权访问', 'D. CSRF'], correctIndex: 1, explanation: '同级别用户间越权是水平越权。' },
        { question: '防止水平越权最有效的方法是？', options: ['A. 随机ID', 'B. 验证资源归属', 'C. 加密ID', 'D. 限制查询'], correctIndex: 1, explanation: '验证资源是否属于当前用户是防止水平越权的根本方法。' },
        { question: 'IDOR是指？', options: ['A. 注入漏洞', 'B. 不安全的直接对象引用', 'C. XSS变种', 'D. 文件包含'], correctIndex: 1, explanation: 'IDOR(Insecure Direct Object Reference)是不验证对象访问权限的直接引用。' },
        { question: '以下哪个不是业务逻辑漏洞？', options: ['A. 负数购买', 'B. SQL注入', 'C. 竞争条件', 'D. 跳过验证'], correctIndex: 1, explanation: 'SQL注入是技术漏洞，业务逻辑漏洞存在于业务流程设计中。' },
        { question: '垂直越权是指？', options: ['A. 同级别用户间访问', 'B. 低权限访问高权限', 'C. 未登录访问', 'D. 遍历数据'], correctIndex: 1, explanation: '垂直越权是低权限用户获取高权限访问，如普通用户访问管理员功能。' }
      ],
      expertNotes: [{ author: 'M0chen', title: '业务逻辑漏洞挖掘', content: '业务逻辑漏洞需要深入理解业务逻辑才能发现。测试要点：1)修改资源ID尝试越权，2)尝试绕过认证步骤，3)测试并发竞争条件，4)尝试负数或溢出值，5)分析业务流程寻找可跳过的步骤。推荐工具：Burp Suite的Intruder和Repeater模块。', url: 'https://www.t00ls.net/' }],
      environmentSetup: { dockerCommand: 'docker run -d -p 3000:3000 bkimminich/juice-shop', prerequisites: ['Docker已运行'], verificationSteps: ['1. 访问 http://localhost:3000', '2. 注册账户并登录', '3. 尝试越权测试'] }
    ,
      resources: [{"name": "越权漏洞完整指南", "url": "https://portswigger.net/web-security/access-control", "type": "article"}, {"name": "IDOR漏洞深度分析", "url": "https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/04-Testing_for_Insecure_Direct_Object_References", "type": "article"}, {"name": "业务逻辑漏洞挖掘", "url": "https://www.freebuf.com/articles/web/249356.html", "type": "article"}, {"name": "访问控制安全设计", "url": "https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html", "type": "article"}]},
    { id: 'basic-15', day: 15, title: '中间件安全配置', subtitle: 'Middleware Security', objectives: ['掌握Apache安全配置', '掌握Nginx安全配置', '了解Tomcat加固'], content: `Web中间件的安全配置对整体安全至关重要。

【Nginx安全配置】
1. 隐藏版本号
   server_tokens off;
   
2. 禁止目录浏览
   autoindex off;
   
3. 限制请求方法
   if ($request_method !~ ^(GET|POST|HEAD)$) {
       return 405;
   }
   
4. 安全响应头
   add_header X-Frame-Options "SAMEORIGIN";
   add_header X-Content-Type-Options "nosniff";
   add_header X-XSS-Protection "1; mode=block";
   add_header Strict-Transport-Security "max-age=31536000";

5. 限制上传大小
   client_max_body_size 10M;

【Apache安全配置】
1. 隐藏版本号
   ServerTokens Prod
   ServerSignature Off
   
2. 禁止目录浏览
   Options -Indexes
   
3. 启用重写引擎
   RewriteEngine On

【Tomcat安全】
1. 禁用管理后台
2. 修改默认端口
3. 使用强密码
4. 限制IP访问`,
      keyPoints: ['隐藏版本号信息', '禁止目录浏览', '修改默认端口', '及时打补丁', '以低权限运行'],
      codeExamples: [{ title: 'Nginx安全配置', language: 'nginx', code: 'server {\n    listen 80;\n    server_name example.com;\n    \n    # 安全响应头\n    add_header X-Frame-Options \"SAMEORIGIN\";\n    add_header X-Content-Type-Options \"nosniff\";\n    add_header X-XSS-Protection \"1; mode=block\";\n    add_header Strict-Transport-Security \"max-age=31536000\";\n    \n    # 禁止目录浏览\n    location / {\n        autoindex off;\n        try_files $uri $uri/ =404;\n    }\n    \n    # 限制上传大小\n    client_max_body_size 10M;\n    \n    # 禁止访问敏感文件\n    location ~ /\\. {\n        deny all;\n    }\n    \n    # PHP配置\n    location ~ \\.php$ {\n        fastcgi_pass unix:/var/run/php/php-fpm.sock;\n        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;\n        include fastcgi_params;\n    }\n}', explanation: 'Nginx安全配置完整示例' }],
      labEnvironment: [{ name: 'Nginx配置测试', description: '本地Nginx安全配置', url: 'https://nginx.org/', type: 'local', setup: '1. 安装Nginx\n2. 编辑/etc/nginx/nginx.conf\n3. 应用安全配置\n4. 测试配置: nginx -t\n5. 重载: nginx -s reload', expectedOutput: '配置生效后访问安全头正确返回' }],
      recommendedTools: [{ name: 'Nginx', description: 'Web服务器', url: 'https://nginx.org/', type: 'local' }],
      quiz: [
        { question: 'Nginx中隐藏版本号的配置是？', options: ['A. ServerTokens Off', 'B. server_tokens off', 'C. HideVersion on', 'D. Version hidden'], correctIndex: 1, explanation: 'Nginx使用server_tokens off隐藏版本号。' },
        { question: '防止目录浏览的配置是？', options: ['A. autoindex off', 'B. directory listing off', 'C. IndexIgnore *', 'D. Options -Indexes'], correctIndex: 0, explanation: 'Nginx使用autoindex off，Apache使用Options -Indexes。' },
        { question: '以下哪个不是安全响应头？', options: ['A. X-Frame-Options', 'B. X-Powered-By', 'C. X-Content-Type-Options', 'D. Strict-Transport-Security'], correctIndex: 1, explanation: 'X-Powered-By显示服务器技术栈，不是安全响应头，反而可能泄露信息。' },
        { question: 'Nginx重载配置的命令是？', options: ['A. nginx reload', 'B. nginx -s reload', 'C. systemctl reload nginx', 'D. nginx restart'], correctIndex: 1, explanation: 'nginx -s reload是Nginx标准信号重载方式。' },
        { question: '限制上传文件大小的配置是？', options: ['A. upload_max_size', 'B. client_max_body_size', 'C. max_upload_size', 'D. upload_limit'], correctIndex: 1, explanation: 'client_max_body_size是Nginx限制请求body大小的指令。' }
      ],
      expertNotes: [{ author: 'Nginx_Plu', title: '生产环境Nginx安全配置', content: '生产环境Nginx安全配置要点：1)隐藏所有版本信息，2)禁用不需要的HTTP方法，3)配置完整的安全响应头，4)限制连接数和请求频率，5)配置日志审计，6)使用TLS 1.3。推荐定期使用Mozilla SSL Config Generator生成配置。', url: 'https://www.nginx.com/' }],
      environmentSetup: { prerequisites: ['Nginx已安装'], verificationSteps: ['1. 备份原配置', '2. 编辑nginx.conf', '3. 测试配置: nginx -t', '4. 重载: nginx -s reload'] }
    ,
      resources: [{"name": "Apache安全加固指南", "url": "https://httpd.apache.org/docs/2.4/misc/security_tips.html", "type": "article"}, {"name": "Nginx安全配置最佳实践", "url": "https://www.freebuf.com/articles/web/268346.html", "type": "article"}, {"name": "Tomcat安全配置", "url": "https://tomcat.apache.org/tomcat-9.0-doc/security-howto.html", "type": "article"}, {"name": "中间件漏洞汇总", "url": "https://www.anquanke.com/post/id/216301", "type": "article"}]},
    { id: 'basic-16', day: 16, title: '漏洞扫描与评估', subtitle: 'Vulnerability Scanning', objectives: ['理解扫描原理', '掌握Nessus使用', '学习结果分析'], content: `漏洞扫描是发现系统安全弱点的重要手段。

【扫描流程】
1. 资产发现：识别目标范围
2. 端口扫描：识别开放端口
3. 服务识别：确定服务类型和版本
4. 漏洞检测：匹配已知漏洞特征
5. 风险评估：CVSS评分

【CVSS评分标准】
• 9.0-10.0：严重(Critical)
• 7.0-8.9：高危(High)
• 4.0-6.9：中危(Medium)
• 0.1-3.9：低危(Low)

【漏洞数据库】
• CVE：通用漏洞披露
• NVD：美国国家漏洞数据库
• CNNVD：中国国家漏洞库
• CNVD：中国国家互联网应急中心

【扫描工具】
• Nessus：商业级漏洞扫描器
• OpenVAS：开源漏洞扫描器
• Nexpose：快速漏洞扫描
• AWVS：Web应用漏洞扫描`,
      keyPoints: ['端口扫描是漏洞扫描第一步', 'Nessus是商业扫描器', 'OpenVAS是开源方案', 'CVSS用于评级漏洞', '结果需人工验证'],
      codeExamples: [{ title: 'Nmap漏洞扫描', language: 'bash', code: '代码示例已简化，请参考实验环境进行实践', explanation: 'Nmap漏洞扫描命令' }],
      labEnvironment: [{ name: 'OpenVAS', description: '开源漏洞扫描器', url: 'https://www.openvas.org/', type: 'online', setup: '1. 安装OpenVAS\n2. 配置扫描目标\n3. 启动扫描任务\n4. 查看漏洞报告', expectedOutput: '获取目标系统的漏洞扫描报告' }],
      recommendedTools: [{ name: 'Nessus', description: '商业漏洞扫描器', url: 'https://www.tenable.com/products/nessus', type: 'local' }, { name: 'OpenVAS', description: '开源漏洞扫描器', url: 'https://www.openvas.org/', type: 'local' }],
      quiz: [
        { question: 'CVSS 9.5分属于什么等级？', options: ['A. 高危', 'B. 中危', 'C. 严重', 'D. 低危'], correctIndex: 2, explanation: 'CVSS 9.0-10.0是严重(Critical)等级。' },
        { question: '漏洞扫描的第一步是？', options: ['A. 漏洞检测', 'B. 端口扫描', 'C. 资产发现', 'D. 修复漏洞'], correctIndex: 2, explanation: '首先确定扫描范围和资产，然后才是端口扫描和漏洞检测。' },
        { question: '以下哪个不是漏洞数据库？', options: ['A. CVE', 'B. NVD', 'C. DNS', 'D. CNNVD'], correctIndex: 2, explanation: 'CVE、NVD、CNNVD都是漏洞数据库，DNS是域名系统。' },
        { question: 'Nessus属于哪种扫描工具？', options: ['A. 开源免费', 'B. 商业收费', 'C. Web扫描', 'D. 代码扫描'], correctIndex: 1, explanation: 'Nessus是商业漏洞扫描器，有免费版本但功能受限。' },
        { question: '漏洞扫描的局限性是？', options: ['A. 速度太慢', 'B. 无法发现0day', 'C. 需要付费', 'D. 结果不准确'], correctIndex: 1, explanation: '漏洞扫描基于已知漏洞特征库，无法发现0day漏洞和新漏洞。' }
      ],
      expertNotes: [{ author: 'SecWiki', title: '漏洞扫描实践指南', content: '漏洞扫描注意事项：1)扫描前获得书面授权，2)控制扫描频率避免影响业务，3)扫描结果需要人工验证排除误报，4)关注漏洞关联性，5)修复后要复测验证。推荐流程：资产发现→快速扫描→详细扫描→修复→复测。', url: 'https://www.91test.org/' }],
      environmentSetup: { prerequisites: ['Nmap已安装'], verificationSteps: ['1. 使用Nmap进行基础端口扫描', '2. 使用--script vuln进行漏洞检测', '3. 分析扫描结果'] }
    ,
      resources: [{"name": "OWASP ZAP使用指南", "url": "https://www.zaproxy.org/getting-started/", "type": "article"}, {"name": "漏洞扫描工具对比", "url": "https://www.freebuf.com/articles/web/208915.html", "type": "article"}, {"name": "Nessus扫描入门", "url": "https://www.tenable.com/products/nessus", "type": "article"}, {"name": "漏洞验证方法学", "url": "https://www.anquanke.com/post/id/231456", "type": "article"}]},
    { id: 'basic-17', day: 17, title: 'SQLMap进阶使用', subtitle: 'SQLMap Advanced', objectives: ['掌握基本用法', '理解注入技术', '学习结果解读'], content: `SQLMap是自动化SQL注入检测和利用工具。

【基本命令】
sqlmap -u "http://target.com/?id=1"
--batch：自动选择默认选项

【进阶参数】
--dbs：列出所有数据库
-D dbname --tables：列出指定库的所有表
-T tablename --columns：列出指定表的所有字段
-T users --dump：导出users表的所有数据

【注入技术】
--technique=B：布尔盲注
--technique=T：时间盲注
--technique=U：UNION注入
--technique=E：报错注入

【Level和Risk】
--level=5：最高级别检测
--risk=3：最高风险测试

【绕过WAF】
--random-agent：随机User-Agent
--delay=1：延迟1秒
--proxy=http://proxy:8080：使用代理

【系统交互】
--os-shell：获取操作系统shell
--sql-shell：获取SQL shell`,
      keyPoints: ['-u指定URL', '--dbs列数据库', '--dump导出数据', '多种注入技术支持', 'os-shell可执行命令'],
      codeExamples: [{ title: 'SQLMap完整流程', language: 'bash', code: '# 1. 检测注入点\nsqlmap -u "http://target.com/product.php?id=1" --batch\n\n# 2. 列出所有数据库\nsqlmap -u "http://target.com/product.php?id=1" --dbs\n\n# 3. 列出目标数据库的表\nsqlmap -u "http://target.com/product.php?id=1" -D shop --tables\n\n# 4. 列出users表的字段\nsqlmap -u "http://target.com/product.php?id=1" -D shop -T users --columns\n\n# 5. 导出users表数据\nsqlmap -u "http://target.com/product.php?id=1" -D shop -T users --dump\n\n# 6. 获取系统shell\nsqlmap -u "http://target.com/product.php?id=1" --os-shell', explanation: 'SQLMap从检测到getshell的完整流程' }],
      labEnvironment: [{ name: 'SQL注入靶场', description: 'DVWA SQL Injection', url: 'http://localhost:8081', type: 'docker', setup: '1. 访问DVWA SQL Injection模块\n2. 安全级别设置为Low\n3. 使用SQLMap测试: sqlmap -u "http://localhost:8081/vulnerabilities/sqli/?id=1&Submit=Submit" --dbs', expectedOutput: '成功列出数据库并提取数据' }],
      recommendedTools: [{ name: 'SQLMap', description: 'SQL注入工具', url: 'https://sqlmap.org/', type: 'local' }],
      quiz: [
        { question: 'SQLMap哪个参数列出数据库？', options: ['A. --dbs', 'B. --tables', 'C. --columns', 'D. --dump'], correctIndex: 0, explanation: '--dbs列出数据库，--tables列出表，--columns列出字段，--dump导出数据。' },
        { question: 'SQLMap的--batch参数作用是？', options: ['A. 批量导入', 'B. 自动选择默认选项', 'C. 绕过防火墙', 'D. 加快速度'], correctIndex: 1, explanation: '--batch参数让SQLMap自动选择默认选项，无需交互式输入。' },
        { question: 'SQLMap的--os-shell要求什么条件？', options: ['A. 普通用户权限', 'B. DBA权限写入文件', 'C. 不需要条件', 'D. 管理员权限'], correctIndex: 1, explanation: '--os-shell需要数据库有写入文件系统的权限(DBA权限)，MySQL需要secure_file_priv为空。' },
        { question: '绕过WAF可以使用什么参数？', options: ['A. --random-agent', 'B. --delay', 'C. --proxy', 'D. 全部都可以'], correctIndex: 3, explanation: '--random-agent伪装User-Agent，--delay延迟请求，--proxy使用代理，都可以用于绕过WAF检测。' },
        { question: 'SQLMap检测时间盲注使用什么参数？', options: ['A. --technique=B', 'B. --technique=T', 'C. --technique=U', 'D. --technique=E'], correctIndex: 1, explanation: '--technique=B布尔盲注，T时间盲注，U UNION注入，E报错注入。' }
      ],
      expertNotes: [{ author: 'M01N Team', title: 'SQLMap实战技巧', content: 'SQLMap高级用法：1)使用--thread设置并发，2)--text-only根据页面文本差异判断，3)--prefix和--suffix添加注入前缀后缀，4)--eval在请求前执行自定义Python代码，5)使用--tamper编写自定义绕过脚本。实战中建议先用低级别检测，确认有注入再深入利用。', url: 'https://www.91ri.org/' }],
      environmentSetup: { prerequisites: ['SQLMap已安装', 'DVWA靶场运行中'], verificationSteps: ['1. 启动DVWA SQL Injection', '2. 使用SQLMap测试注入', '3. 尝试导出数据'] }
    ,
      resources: [{"name": "SQLMap完全指南", "url": "https://github.com/sqlmapproject/sqlmap/wiki/Usage", "type": "article"}, {"name": "SQLMap高级技巧", "url": "https://www.freebuf.com/articles/web/170842.html", "type": "article"}, {"name": "SQL注入之盲注技巧", "url": "https://portswigger.net/web-security/sql-injection/blind", "type": "article"}, {"name": "SQLMap源码解读", "url": "https://www.anquanke.com/post/id/218536", "type": "article"}]},
    { id: 'basic-18', day: 18, title: '命令注入与代码注入', subtitle: 'Command & Code Injection', objectives: ['理解命令注入', '理解代码注入', '掌握防护措施'], content: `命令注入和代码注入允许攻击者执行任意系统命令或代码。

【命令注入】
PHP危险函数：system(), exec(), shell_exec(), passthru(), popen()
Python危险函数：os.system(), subprocess.call()

【命令注入示例】
// URL: ?cmd=127.0.0.1; whoami
// 执行: ping -c 4 127.0.0.1; whoami

【命令连接符】
;  顺序执行
&& 前一个成功才执行后一个
|| 前一个失败才执行后一个
|  管道，前一个输出作为后一个输入
&  后台执行

【Python代码注入】
eval()执行Python代码
exec()执行Python代码块

【防护措施】
1. escapeshellarg()转义参数
2. escapeshellcmd()转义命令
3. 白名单验证输入
4. 禁用危险函数`,
      keyPoints: ['system/exec/eval是危险函数', '命令注入执行系统命令', '代码注入执行任意代码', 'escapeshellarg是PHP防护', '白名单最安全'],
      codeExamples: [{ title: '命令注入与防护', language: 'php', code: '<?php\n// 危险！用户输入被拼接到命令\n$cmd = $_GET["cmd"];\nsystem("ping -c 4 " . $cmd);\n\n// 安全做法1：escapeshellarg\n$cmd = escapeshellarg($_GET["cmd"]);\nsystem("ping -c 4 " . $cmd);\n\n// 安全做法2：白名单\n$allowed = ["127.0.0.1", "localhost", "192.168.1.1"];\nif (!in_array($_GET["cmd"], $allowed)) {\n    die("不允许的IP");\n}', explanation: '命令注入漏洞和防护方法' }],
      labEnvironment: [{ name: 'DVWA Command Injection', description: 'DVWA命令注入模块', url: 'http://localhost:8081', type: 'docker', setup: '1. 访问DVWA Command Injection模块\n2. 安全级别Low：直接注入; whoami\n3. 安全级别Medium：尝试|| whoami\n4. 安全级别High：尝试绕过方法', expectedOutput: '成功执行系统命令' }],
      recommendedTools: [{ name: 'Burp Suite', description: '命令注入测试', url: 'https://portswigger.net/burp', type: 'local' }],
      quiz: [
        { question: '哪个PHP函数可能导致命令注入？', options: ['A. echo', 'B. print_r', 'C. system', 'D. var_dump'], correctIndex: 2, explanation: 'system()执行系统命令，用户输入被拼接会导命令注入。' },
        { question: '命令连接符||的作用是？', options: ['A. 顺序执行', 'B. 前一个失败才执行后一个', 'C. 管道', 'D. 后台执行'], correctIndex: 1, explanation: '||表示前一个命令失败时才执行后一个命令。' },
        { question: 'escapeshellarg()的作用是？', options: ['A. 过滤所有字符', 'B. 转义命令参数', 'C. 禁止执行', 'D. 日志记录'], correctIndex: 1, explanation: 'escapeshellarg()将字符串转义，使其作为单个参数传递，防止命令注入。' },
        { question: 'Python中执行系统命令的函数是？', options: ['A. print()', 'B. os.system()', 'C. input()', 'D. open()'], correctIndex: 1, explanation: 'os.system()和subprocess模块用于执行系统命令。' },
        { question: '防止命令注入最有效的方法是？', options: ['A. 过滤特殊字符', 'B. 白名单验证', 'C. 限制长度', 'D. 使用POST方法'], correctIndex: 1, explanation: '白名单只允许预定义的值，从根本上防止命令注入。' }
      ],
      expertNotes: [{ author: 'H客ABC', title: '命令注入深入理解', content: '命令注入实战注意：1)Windows和Linux命令有差异，2)注意编码问题导致绕过，3)blind命令注入可以用延时判断，4)注意环境变量对命令的影响。防护原则：能用API就不用命令，能白名单就不用黑名单。', url: 'https://www.t00ls.net/' }],
      environmentSetup: { dockerCommand: 'docker run -d -p 8081:80 vulnerables/web-dvwa', prerequisites: ['DVWA已运行'], verificationSteps: ['1. 进入Command Injection模块', '2. 尝试命令注入'] }
    ,
      resources: [{"name": "命令注入漏洞详解", "url": "https://owasp.org/www-community/attacks/Command_Injection", "type": "article"}, {"name": "代码注入与命令注入对比", "url": "https://portswigger.net/web-security/os-command-injection", "type": "article"}, {"name": "RCE漏洞挖掘思路", "url": "https://www.freebuf.com/articles/web/247267.html", "type": "article"}, {"name": "无回显命令注入技巧", "url": "https://www.anquanke.com/post/id/224589", "type": "article"}]},
    { id: 'basic-19', day: 19, title: '反序列化漏洞', subtitle: 'Deserialization Vulnerability', objectives: ['理解序列化原理', '掌握反序列化漏洞', '学习防护措施'], content: `序列化将对象转换为字节流，反序列化将字节流还原为对象。

【序列化格式】
• PHP: O:5:"Class":1:{s:3:"num";i:1;}
• Python: pickle格式
• Java: 二进制序列化

【反序列化漏洞】
用户输入被反序列化时，如果包含恶意对象，可以执行任意代码。

【PHP反序列化】
__wakeup()魔术方法在反序列化时自动调用
CVE-2016-7124：对象属性数不匹配时__wakeup()不执行

【Python pickle】
import pickle
pickle.loads(user_input)  # 危险！

【防护方法】
1. 不反序列化用户输入
2. 使用JSON代替序列化
3. 签名验证反序列化数据
4. 限制可反序列化的类`,
      keyPoints: ['反序列化用户输入危险', 'pickle反序列化可执行代码', 'ysoserial是Java利用工具', '用JSON代替最安全', '签名验证可防止篡改'],
      codeExamples: [{ title: 'Python pickle漏洞', language: 'python', code: 'import pickle\nimport os\n\n# 创建恶意序列化对象\nclass Exploit:\n    def __reduce__(self):\n        # 执行系统命令\n        return (os.system, ("whoami",))\n\n# 序列化\nmalicious_data = pickle.dumps(Exploit())\n\n# 危险！反序列化用户输入\n# 如果malicious_data来自用户输入，可以执行任意命令\nresult = pickle.loads(malicious_data)\n\n# 安全做法：使用JSON\nimport json\nsafe_data = json.dumps({"num": 1})\nparsed = json.loads(safe_data)', explanation: 'Python pickle反序列化漏洞演示' }],
      labEnvironment: [{ name: 'Java反序列化', description: 'ysoserial工具测试', url: 'https://github.com/frohoff/ysoserial', type: 'online', setup: '1. 下载ysoserial\n2. 生成恶意payload\n3. 发送到目标Java应用\n4. 观察命令执行结果', expectedOutput: '成功通过反序列化漏洞执行命令' }],
      recommendedTools: [{ name: 'ysoserial', description: 'Java反序列化利用工具', url: 'https://github.com/frohoff/ysoserial', type: 'local' }],
      quiz: [
        { question: 'Python pickle反序列化漏洞的原理是？', options: ['A. 占用大量内存', 'B. 执行__reduce__方法', 'C. 导致程序崩溃', 'D. 泄露源代码'], correctIndex: 1, explanation: 'pickle.loads()会执行对象的__reduce__方法，攻击者可自定义实现执行任意命令。' },
        { question: '防止反序列化漏洞最有效的方法是？', options: ['A. 加密数据', 'B. JSON代替', 'C. 限制大小', 'D. HTTPS传输'], correctIndex: 1, explanation: 'JSON只包含数据，不会被解释为代码，是最安全的方案。' },
        { question: 'PHP反序列化时自动调用的方法是？', options: ['A. __construct', 'B. __wakeup', 'C. __destruct', 'D. __toString'], correctIndex: 1, explanation: '__wakeup()在反序列化时自动调用。' },
        { question: 'ysoserial是用于什么的工具？', options: ['A. SQL注入', 'B. Java反序列化利用', 'C. XSS检测', 'D. 端口扫描'], correctIndex: 1, explanation: 'ysoserial是Java反序列化漏洞的利用工具。' },
        { question: '反序列化漏洞属于哪种类型？', options: ['A. 注入类漏洞', 'B. 认证绕过', 'C. 信息泄露', 'D. DoS攻击'], correctIndex: 0, explanation: '反序列化漏洞是将恶意数据注入并被解释执行，属于注入类漏洞。' }
      ],
      expertNotes: [{ author: 'Long', title: '反序列化漏洞挖掘', content: '反序列化漏洞挖掘要点：1)关注使用了serialize()的应用，2)寻找可控的反序列化输入点，3)分析可用的魔术方法，4)Java中关注CC链和Spring类，5)PHP中关注__wakeup、__destruct等方法。推荐工具：Java ysoserial，PHP phpggc。', url: 'https://blog.91test.org/' }],
      environmentSetup: { prerequisites: ['Java运行环境'], verificationSteps: ['1. 下载ysoserial', '2. 生成payload', '3. 发送到目标测试'] }
    ,
      resources: [{"name": "反序列化漏洞深入解析", "url": "https://owasp.org/www-community/vulnerabilities/Deserialization_of_untrusted_data", "type": "article"}, {"name": "Java反序列化漏洞史", "url": "https://www.freebuf.com/articles/web/192805.html", "type": "article"}, {"name": "PHP反序列化详解", "url": "https://www.anquanke.com/post/id/202864", "type": "article"}, {"name": "ysoserial工具使用", "url": "https://github.com/frohoff/ysoserial", "type": "article"}]},
    { id: 'basic-20', day: 20, title: 'OWASP Top 10 概览', subtitle: 'OWASP Top 10 Overview', objectives: ['掌握OWASP Top 10', '理解最新变化', '学习防护要点'], content: `OWASP Top 10是最重要的Web应用安全风险列表。

【OWASP Top 10 2021】

A01 访问控制失效
• 水平越权和垂直越权
• 未验证访问控制
• IDOR
防护：对象级别权限验证

A02 加密失败
• 数据明文传输
• 弱密码存储
• 不当的证书验证
防护：使用TLS、bcrypt/scrypt

A03 注入
• SQL注入
• XSS
• 命令注入
防护：参数化查询、输入验证、输出编码

A04 不安全设计
• 业务流程缺乏安全考虑
• 认证逻辑缺陷
防护：威胁建模、安全设计评审

A05 安全配置错误
• 默认密码
• 不必要的功能启用
• 错误信息泄露
防护：安全配置基线、定期审计

A06 易损和过时组件
• 使用有漏洞的库
• 未及时更新
防护：依赖检查、软件组成分析

A07 认证和授权失败
• 弱密码
• Session fixation
• 缺乏MFA
防护：强密码策略、MFA

A08 数据完整性失败
• 不验证数据来源
• CI/CDpipeline不安全
防护：签名验证、安全CI/CD

A09 安全日志失败
• 未记录安全事件
• 日志可篡改
防护：集中日志、完整性保护

A10 服务器请求伪造(SSRF)
• 未验证用户提供的URL
• 访问内网资源
防护：URL白名单、禁用不需要的协议`,
      keyPoints: ['OWASP Top 10是Web安全最重要标准', 'A01访问控制失效排名第一', 'A03注入包括SQL/XSS等', 'A06易损组件越来越重要', 'A10 SSRF是新增类别'],
      codeExamples: [{ title: 'OWASP安全检查清单', language: 'markdown', code: '# OWASP Top 10 安全检查清单\n\n## A01 访问控制\n- [ ] 所有API端点都有权限验证\n- [ ] 对象ID不可预测\n- [ ] 用户和权限映射正确\n\n## A03 注入\n- [ ] 使用参数化查询\n- [ ] 输入验证\n- [ ] 输出编码\n\n## A05 安全配置\n- [ ] 无默认密码\n- [ ] 禁用不必要的功能\n- [ ] 安全响应头配置\n\n## A06 易损组件\n- [ ] 依赖库已更新\n- [ ] 无已知CVE', explanation: 'OWASP Top 10安全检查清单' }],
      labEnvironment: [{ name: 'OWASP ZAP', description: 'Web应用安全扫描', url: 'https://www.zaproxy.org/', type: 'local', setup: '1. 安装OWASP ZAP\n2. 输入目标URL\n3. 启动自动扫描\n4. 查看报告', expectedOutput: '扫描报告列出发现的OWASP Top 10漏洞' }],
      recommendedTools: [{ name: 'OWASP ZAP', description: 'Web应用扫描器', url: 'https://www.zaproxy.org/', type: 'local' }],
      quiz: [
        { question: 'OWASP Top 10 2021排名第一是？', options: ['A. 注入', 'B. 访问控制失效', 'C. XSS', 'D. 安全配置错误'], correctIndex: 1, explanation: 'A01 Broken Access Control排名第一，超过注入成为第一安全问题。' },
        { question: '以下哪个不属于A03注入？', options: ['A. SQL注入', 'B. XSS', 'C. 命令注入', 'D. SSRF'], correctIndex: 3, explanation: 'SSRF属于A10，注入类包括SQL注入、XSS、命令注入等。' },
        { question: 'A06易损组件是指？', options: ['A. 服务器硬件过时', 'B. 使用有漏洞的第三方库', 'C. 员工技能不足', 'D. 管理制度缺失'], correctIndex: 1, explanation: 'A06是使用存在已知漏洞的第三方组件和库。' },
        { question: 'SSRF在OWASP Top 10中的编号是？', options: ['A. A01', 'B. A05', 'C. A08', 'D. A10'], correctIndex: 3, explanation: 'A10 Server-Side Request Forgery是2021年新增的类别。' },
        { question: '防止A01访问控制失效的方法是？', options: ['A. 使用HTTPS', 'B. 对象级别权限验证', 'C. 过滤特殊字符', 'D. 加密数据'], correctIndex: 1, explanation: '访问控制需要验证用户对每个对象的访问权限。' }
      ],
      expertNotes: [{ author: 'OWASP', title: 'OWASP Top 10 解读', content: 'OWASP Top 10反映了当前Web应用最常见的安全问题。学习建议：1)理解每个风险的原理，2)学会识别和测试方法，3)掌握防护措施，4)关注最新的A01-A10变化。推荐资源：OWASP官方文档、Cheat Sheet系列。', url: 'https://owasp.org/Top10/' }],
      environmentSetup: { prerequisites: ['OWASP ZAP已安装'], verificationSteps: ['1. 启动OWASP ZAP', '2. 输入目标URL', '3. 运行自动扫描', '4. 分析报告'] }
    ,
      resources: [{"name": "OWASP Top 10 2021官方", "url": "https://owasp.org/www-project-top-ten/", "type": "article"}, {"name": "OWASP Top 10详解(中文)", "url": "https://www.freebuf.com/articles/web/305890.html", "type": "article"}, {"name": "OWASP ASVS标准", "url": "https://owasp.org/www-project-application-security-verification-standard/", "type": "article"}, {"name": "OWASP Top 10变迁历史", "url": "https://www.anquanke.com/post/id/253467", "type": "article"}]},
    { id: 'basic-21', day: 21, title: 'CVE与漏洞管理', subtitle: 'CVE & Vuln Management', objectives: ['掌握CVE系统', '理解CVE编号', '学习漏洞管理'], content: `CVE(Common Vulnerabilities and Exposures)是公共漏洞标识系统。

【CVE编号格式】
CVE-年份-编号
例：CVE-2021-44228(Log4Shell)

【漏洞生命周期】
1. 发现：安全研究员发现漏洞
2. 披露：向CVE机构报告
3. 分配CVE编号
4. 厂商确认并发布补丁
5. 漏洞情报公开
6. 用户打补丁

【漏洞数据库】
• NVD：美国国家漏洞数据库
• CNNVD：中国国家漏洞库
• CNVD：国家互联网应急中心
• JVN：日本漏洞 Notes

【漏洞评级】
• CVSS 9.0-10.0：严重
• CVSS 7.0-8.9：高危
• CVSS 4.0-6.9：中危
• CVSS 0.1-3.9：低危

【漏洞管理流程】
1. 资产识别
2. 漏洞扫描
3. 风险评估
4. 修复优先级
5. 修复验证`,
      keyPoints: ['CVE提供唯一漏洞标识', 'CVE-年份-编号格式', 'NVD/CNNVD是漏洞库', '漏洞有生命周期管理', 'CVSS用于优先级排序'],
      codeExamples: [{ title: 'CVE查询脚本', language: 'python', code: 'import requests\n\ndef get_cve_info(cve_id):\n    """查询CVE信息\n    使用NVD API\n    \"\"\"\n    url = f"https://services.nvd.nist.gov/rest/json/cves/2.0?cveId={cve_id}"\n    headers = {\'apikey\': \'YOUR_API_KEY\'}  # 需要API Key\n    \n    try:\n        response = requests.get(url, timeout=10)\n        if response.status_code == 200:\n            data = response.json()\n            if data.get(\'totalResults\', 0) > 0:\n                cve = data[\'vulnerabilities\'][0][\'cve\']\n                print(f"CVE ID: {cve_id}")\n                print(f"描述: {cve[\'descriptions\'][0][\'value\']}\")\n                \n                # CVSS评分\n                if \'metrics\' in cve:\n                    cvss = cve[\'metrics\'].get(\'cvssMetricV31\', [])\n                    if cvss:\n                        score = cvss[0][\'cvssData\']\n                        print(f"CVSS评分: {score[\'baseScore\']}")\n                        print(f"严重程度: {score[\'baseSeverity\']}")\n    except Exception as e:\n        print(f"查询失败: {e}")\n\nget_cve_info("CVE-2021-44228")', explanation: '使用NVD API查询CVE详细信息' }],
      labEnvironment: [{ name: 'CVE查询', description: 'NVD漏洞数据库', url: 'https://nvd.nist.gov/', type: 'online', setup: '1. 访问 https://nvd.nist.gov/\n2. 搜索CVE编号\n3. 查看CVSS评分和详情\n4. 查看相关链接和补丁信息', expectedOutput: '获取CVE的详细描述和CVSS评分' }],
      recommendedTools: [{ name: 'NVD', description: '美国国家漏洞库', url: 'https://nvd.nist.gov/', type: 'online' }],
      quiz: [
        { question: 'CVE-2021-44228是什么漏洞？', options: ['A. 心脏滴血', 'B. Log4Shell', 'C. 永恒之蓝', 'D. Shellshock'], correctIndex: 1, explanation: 'CVE-2021-44228是Apache Log4j的Log4Shell漏洞。' },
        { question: 'CVSS评分9.5属于什么级别？', options: ['A. 低危', 'B. 中危', 'C. 高危', 'D. 严重'], correctIndex: 3, explanation: 'CVSS 9.0-10.0是严重(Critical)级别。' },
        { question: 'CNNVD是哪个国家的漏洞库？', options: ['A. 美国', 'B. 中国', 'C. 日本', 'D. 欧洲'], correctIndex: 1, explanation: 'CNNVD是中国国家信息安全漏洞库。' },
        { question: '漏洞生命周期中第一个阶段是？', options: ['A. 披露', 'B. 发现', 'C. 修复', 'D. 公开'], correctIndex: 1, explanation: '漏洞首先被发现，然后才向厂商或CVE机构报告。' },
        { question: 'NVD的全称是？', options: ['A. National Vulnerability Database', 'B. National Virus Database', 'C. Network Vulnerability Detector', 'D. New Vulnerability Description'], correctIndex: 0, explanation: 'NVD是National Vulnerability Database，美国国家漏洞数据库。' }
      ],
      expertNotes: [{ author: 'Sec-UN', title: '企业漏洞管理实践', content: '企业漏洞管理要点：1)建立完整的资产清单，2)定期漏洞扫描，3)基于CVSS和业务criticality确定修复优先级，4)建立漏洞修复SLA，5)修复后验证，6)关注0day威胁。关键成功因素：高层支持、清晰流程、自动化工具。', url: 'https://www.sec-un.org/' }],
      environmentSetup: { prerequisites: ['Python已安装requests库'], verificationSteps: ['1. 安装requests: pip install requests', '2. 运行CVE查询脚本', '3. 尝试查询不同的CVE'] }
    ,
      resources: [{"name": "CVE漏洞数据库", "url": "https://cve.mitre.org/", "type": "article"}, {"name": "CVSS评分指南", "url": "https://www.first.org/cvss/v3.1/user-guide", "type": "article"}, {"name": "NVD国家漏洞库", "url": "https://nvd.nist.gov/", "type": "article"}, {"name": "漏洞管理最佳实践", "url": "https://www.freebuf.com/articles/es/268934.html", "type": "article"}]},
    { id: 'basic-22', day: 22, title: '安全运营概述', subtitle: 'Security Operations', objectives: ['理解SOC概念', '掌握日志管理', '了解SIEM'], content: `安全运营是持续监控、分析、响应安全事件的过程。

【SOC安全运营中心】
• 7×24监控
• 事件检测和分析
• 事件响应和处置
• 威胁情报运营
• 漏洞管理

【SIEM安全信息和事件管理】
核心功能：
• 日志收集：来自防火墙、IDS、服务器、应用
• 日志存储：海量数据存储
• 关联分析：发现攻击链
• 告警：自动检测异常

【常见SIEM平台】
• Splunk：商业，功能强大
• ELK Stack：开源，Elasticsearch+Kibana
• ArcSight：商业，企业级
• IBM QRadar：商业，企业级

【日志管理】
• 收集：Agent、Syslog、API
• 规范化：统一格式
• 存储：加密存储
• 分析：关联规则、机器学习
• 告警：自动通知`,
      keyPoints: ['SOC是安全运营中心', '日志是安全分析基础', 'SIEM是日志分析平台', '关联分析发现威胁', '7×24监控是SOC核心'],
      codeExamples: [{ title: 'ELK部署', language: 'bash', code: '# Docker Compose部署ELK\nversion: "3"\nservices:\n  elasticsearch:\n    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0\n    environment:\n      - discovery.type=single-node\n    ports:\n      - "9200:9200"\n    mem_limit: 2g\n\n  kibana:\n    image: docker.elastic.co/kibana/kibana:8.11.0\n    ports:\n      - "5601:5601"\n    environment:\n      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200\n\n  logstash:\n    image: docker.elastic.co/logstash/logstash:8.11.0\n    ports:\n      - "5044:5044"\n    volumes:\n      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf', explanation: '使用Docker Compose快速部署ELK Stack' }],
      labEnvironment: [{ name: 'ELK Stack', description: '日志分析平台', url: 'https://www.elastic.co/', type: 'local', setup: '1. 使用Docker部署ELK\n2. 配置Filebeat收集日志\n3. 在Kibana创建可视化\n4. 设置告警规则', expectedOutput: '成功部署并能分析日志数据' }],
      recommendedTools: [{ name: 'ELK Stack', description: '开源SIEM', url: 'https://www.elastic.co/', type: 'local' }, { name: 'Splunk', description: '商业SIEM', url: 'https://www.splunk.com/', type: 'local' }],
      quiz: [
        { question: 'SIEM的主要功能是？', options: ['A. 防火墙', 'B. 入侵检测', 'C. 日志分析', 'D. 漏洞扫描'], correctIndex: 2, explanation: 'SIEM(Security Information and Event Management)主要用于日志收集和事件分析。' },
        { question: 'SOC的核心是？', options: ['A. 防火墙', 'B. 7×24监控', 'C. 漏洞扫描', 'D. 渗透测试'], correctIndex: 1, explanation: 'SOC(安全运营中心)需要7×24持续监控和响应。' },
        { question: 'ELK Stack中负责存储的是哪个组件？', options: ['A. Logstash', 'B. Elasticsearch', 'C. Kibana', 'D. Beats'], correctIndex: 1, explanation: 'Elasticsearch是分布式搜索引擎，负责日志存储和搜索。' },
        { question: 'Filebeat在ELK中的作用是？', options: ['A. 日志存储', 'B. 日志可视化', 'C. 日志采集', 'D. 日志处理'], correctIndex: 2, explanation: 'Filebeat是轻量级日志采集器，负责从文件收集日志。' },
        { question: 'SIEM的关联分析用于？', options: ['A. 加快查询速度', 'B. 发现复杂攻击链', 'C. 存储更多日志', 'D. 生成报表'], correctIndex: 1, explanation: '关联分析通过关联多个事件发现单点分析无法发现的复杂攻击链。' }
      ],
      expertNotes: [{ author: '日志分析民工', title: 'SIEM选型指南', content: 'SIEM选型要点：1)评估日均日志量需求，2)评估分析能力和关联规则库，3)评估告警机制和集成能力，4)考虑成本包括存储和许可，5)评估厂商支持能力。开源方案ELK适合中小企业，商业方案Splunk/QRadar适合大型企业。', url: 'https://blog.erickyun.com/' }],
      environmentSetup: { prerequisites: ['Docker已安装'], verificationSteps: ['1. 创建docker-compose.yml', '2. 运行: docker-compose up -d', '3. 访问Kibana: http://localhost:5601'] }
    ,
      resources: [{"name": "安全运营中心建设指南", "url": "https://www.freebuf.com/articles/es/238769.html", "type": "article"}, {"name": "SIEM平台选型对比", "url": "https://www.anquanke.com/post/id/219734", "type": "article"}, {"name": "SOC建设实践分享", "url": "https://www.freebuf.com/articles/es/267825.html", "type": "article"}, {"name": "安全运营成熟度模型", "url": "https://www.sans.org/security-resources/posters/build-a-soc/", "type": "article"}]},
    { id: 'basic-23', day: 23, title: '应急响应流程', subtitle: 'Incident Response', objectives: ['掌握PDCERF模型', '理解响应流程', '学习文档编写'], content: `应急响应是处理安全事件的系统性方法。

【PDCERF模型】

准备阶段(Preparation)
• 建立应急响应团队
• 制定应急预案
• 准备工具和资源
• 应急演练

检测阶段(Detection)
• 监控告警
• 初步分析
• 确定事件

遏制阶段(Containment)
• 隔离受影响系统
• 阻断攻击路径
• 保护证据

根除阶段(Eradication)
• 清除恶意代码
• 修复漏洞
• 确认威胁已消除

恢复阶段(Recovery)
• 系统恢复上线
• 业务恢复
• 持续监控

总结阶段(Lessons)
• 编写事件报告
• 分析原因
• 改进措施

【事件分级】
• P0 紧急：全局业务中断，15分钟响应
• P1 高危：核心业务受损，1小时响应
• P2 中危：部分功能影响，4小时响应
• P3 低危：轻微影响，24小时响应`,
      keyPoints: ['PDCERF是应急响应标准', '准备是基础', '遏制防止扩大', '根除彻底清除威胁', '总结防止再次发生'],
      codeExamples: [{ title: '应急响应报告模板', language: 'markdown', code: '# 安全事件应急响应报告\n\n## 事件概述\n- 事件时间：2024-01-15 02:30\n- 发现时间：2024-01-15 02:45\n- 事件类型：勒索软件攻击\n- 影响范围：3台服务器\n\n## 时间线\n| 时间 | 动作 |\n|------|------|\n| 02:30 | 攻击者通过VPN漏洞进入内网 |\n| 02:35 | 横向移动到核心服务器 |\n| 02:40 | 执行勒索软件加密文件 |\n| 02:45 | 安全设备告警 |\n| 03:00 | 启动应急响应 |\n\n## 处置措施\n1. 隔离受影响服务器\n2. 关闭被利用的VPN服务\n3. 清除恶意软件\n4. 系统重装\n5. 恢复备份\n\n## 经验教训\n- VPN需启用双因素认证\n- 备份策略需改进\n- 监控告警需优化', explanation: '应急响应报告模板' }],
      labEnvironment: [{ name: '应急响应指南', description: 'NIST应急响应指南', url: 'https://nvd.nist.gov/800-53', type: 'online', setup: '1. 参考NIST SP 800-61指南\n2. 制定企业应急响应预案\n3. 准备应急工具包\n4. 定期演练', expectedOutput: '建立完整的应急响应流程' }],
      recommendedTools: [{ name: 'Autopsy', description: '数字取证工具', url: 'https://www.autopsy.com/', type: 'local' }],
      quiz: [
        { question: 'PDCERF中C代表什么？', options: ['A. 准备', 'B. 检测', 'C. 遏制', 'D. 根除'], correctIndex: 2, explanation: 'PDCERF：C=Containment(遏制)。' },
        { question: 'P0级别事件的响应时间是？', options: ['A. 1小时', 'B. 4小时', 'C. 15分钟', 'D. 24小时'], correctIndex: 2, explanation: 'P0紧急级别需要15分钟内响应。' },
        { question: '应急响应第一步是？', options: ['A. 遏制', 'B. 检测', 'C. 准备', 'D. 恢复'], correctIndex: 2, explanation: '准备阶段是应急响应的第一步，包括建立团队和准备工具。' },
        { question: '遏制阶段的目的是？', options: ['A. 彻底清除威胁', 'B. 防止事态扩大', 'C. 恢复业务', 'D. 追查攻击者'], correctIndex: 1, explanation: '遏制阶段是隔离受影响系统，防止攻击继续扩散。' },
        { question: '应急响应后需要做什么？', options: ['A. 立即关闭系统', 'B. 编写总结报告', 'C. 忽略不管', 'D. 让攻击者离开'], correctIndex: 1, explanation: '总结阶段需要编写报告，分析原因，制定改进措施，防止类似事件再次发生。' }
      ],
      expertNotes: [{ author: 'CERT', title: '应急响应经验谈', content: '应急响应实战经验：1)保留现场证据，内存镜像和磁盘镜像，2)分析前先备份，3)关注时间线重建攻击路径，4)与业务部门保持沟通，5)事后复盘要深入，6)持续改进预案。工具准备：内存抓取工具 FTK Imager，网络取证工具Wireshark。', url: 'https://www.cert.org.cn/' }],
      environmentSetup: { prerequisites: ['应急响应工具有备无患'], verificationSteps: ['1. 准备应急响应工具包', '2. 制定应急预案', '3. 定期进行应急演练'] }
    ,
      resources: [{"name": "NIST应急响应框架", "url": "https://www.nist.gov/cyberframework", "type": "article"}, {"name": "应急响应演练方案", "url": "https://www.freebuf.com/articles/es/275034.html", "type": "article"}, {"name": "PDCERF模型详解", "url": "https://www.anquanke.com/post/id/241356", "type": "article"}, {"name": "安全事件处置案例", "url": "https://www.freebuf.com/articles/es/293467.html", "type": "article"}]},
    { id: 'basic-24', day: 24, title: '防火墙基础配置', subtitle: 'Firewall Configuration', objectives: ['理解防火墙原理', '掌握iptables', '学习规则编写'], content: `防火墙是网络边界防护的核心设备。

【防火墙原理】
• 包过滤：检查IP/端口/协议
• 状态检测：跟踪连接状态
• 应用层过滤：深度检查内容

【Linux iptables】

表和链：
• filter表：过滤 INPUT/OUTPUT/FORWARD
• nat表：网络地址转换 PREROUTING/POSTROUTING/OUTPUT
• mangle表：修改数据包

动作：
• ACCEPT：允许
• DROP：丢弃(无响应)
• REJECT：拒绝(返回错误)

常用命令：
iptables -L -n 查看规则
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -P INPUT DROP 修改默认策略

【连接状态】
• NEW：新建连接
• ESTABLISHED：已建立连接
• RELATED：关联连接
• INVALID：无效连接

【NFTables】
iptables的下一代
更好的性能和灵活性`,
      keyPoints: ['防火墙控制网络访问', 'iptables是Linux防火墙', 'INPUT控制入站', 'DROP丢弃无响应', '规则从上到下匹配'],
      codeExamples: [{ title: 'iptables安全配置', language: 'bash', code: '#!/bin/bash\n# iptables安全配置脚本\n\n# 清空现有规则\niptables -F\niptables -X\n\n# 设置默认策略\niptables -P INPUT DROP\niptables -P FORWARD DROP\niptables -P OUTPUT ACCEPT\n\n# 允许回环接口\niptables -A INPUT -i lo -j ACCEPT\n\n# 允许已建立连接\niptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\n\n# 允许SSH(限制来源IP)\niptables -A INPUT -p tcp -s 192.168.1.0/24 --dport 22 -j ACCEPT\n\n# 允许HTTP/HTTPS\niptables -A INPUT -p tcp --dport 80 -j ACCEPT\niptables -A INPUT -p tcp --dport 443 -j ACCEPT\n\n# 允许Ping(限制频率)\niptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s -j ACCEPT\n\n# 记录被拒绝的包\niptables -A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables DROP: "\n\n# 保存规则\niptables-save > /etc/iptables/rules.v4', explanation: 'iptables安全配置脚本' }],
      labEnvironment: [{ name: 'iptables实验', description: 'Linux防火墙实验', url: 'http://localhost', type: 'local', setup: '1. 使用Linux虚拟机或云服务器\n2. 学习iptables命令\n3. 编写和应用防火墙规则\n4. 测试规则效果', expectedOutput: '掌握iptables配置和管理' }],
      recommendedTools: [{ name: 'iptables', description: 'Linux防火墙', url: 'https://www.netfilter.org/', type: 'local' }, { name: 'ufw', description: '简单防火墙', url: 'https://help.ubuntu.com/community/UFW', type: 'local' }],
      quiz: [
        { question: 'iptables中默认策略使用哪个参数设置？', options: ['A. -A', 'B. -I', 'C. -P', 'D. -L'], correctIndex: 2, explanation: '-P参数用于设置链的默认策略，如iptables -P INPUT DROP。' },
        { question: 'DROP和REJECT的区别是？', options: ['A. 无区别', 'B. DROP丢弃,REJECT拒绝', 'C. REJECT丢弃,DROP拒绝', 'D. DROP用于入站,REJECT用于出站'], correctIndex: 1, explanation: 'DROP丢弃包不返回响应，REJECT拒绝并返回ICMP错误。' },
        { question: 'ESTABLISHED,RELATED状态的作用是？', options: ['A. 允许新连接', 'B. 允许已建立连接', 'C. 拒绝连接', 'D. 记录日志'], correctIndex: 1, explanation: 'ESTABLISHED,RELATED允许已建立连接和关联数据通过，无需重新验证。' },
        { question: 'INPUT链控制的是？', options: ['A. 转发流量', 'B. 出站流量', 'C. 入站流量', 'D. 路由决策'], correctIndex: 2, explanation: 'INPUT链控制入站流量，OUTPUT控制出站流量，FORWARD控制转发流量。' },
        { question: '保存iptables规则使用的命令是？', options: ['A. iptables-save', 'B. iptables-apply', 'C. iptables-restore', 'D. iptables-lock'], correctIndex: 0, explanation: 'iptables-save保存规则到文件，iptables-restore从文件恢复规则。' }
      ],
      expertNotes: [{ author: 'LinuxStory', title: 'iptables实战经验', content: 'iptables配置技巧：1)默认策略用DROP更安全，2)规则顺序很重要，具体的放前面，3)使用conntrack提高性能，4)善用日志定位问题，5)定期审计规则，6)使用fail2ban自动封禁恶意IP。生产环境建议使用ansible等工具管理防火墙规则。', url: 'https://linuxstory.org/' }],
      environmentSetup: { prerequisites: ['Linux系统'], verificationSteps: ['1. 查看当前规则: iptables -L -n', '2. 添加测试规则', '3. 测试连接', '4. 删除测试规则'] }
    ,
      resources: [{"name": "iptables详解教程", "url": "https://www.digitalocean.com/community/tutorials/iptables-essentials-common-firewall-rules-and-commands", "type": "article"}, {"name": "防火墙技术演变", "url": "https://www.cloudflare.com/learning/ddos/glossary/firewall/", "type": "article"}, {"name": "Nftables新一代防火墙", "url": "https://wiki.nftables.org/wiki-nftables/index.php/Main_Page", "type": "article"}, {"name": "企业防火墙部署方案", "url": "https://www.freebuf.com/articles/network/263578.html", "type": "article"}]},
    { id: 'basic-25', day: 25, title: 'WAF与Web防护', subtitle: 'Web Application Firewall', objectives: ['理解WAF原理', '掌握WAF规则', '学习绕过与防护'], content: `WAF(Web应用防火墙)专门防护Web应用层攻击。

【WAF工作原理】
• 规则匹配：基于签名检测攻击
• 行为分析：基于异常行为检测
• 机器学习：智能识别未知攻击

【部署模式】
• 串联模式：流量经过WAF检查
• 旁路模式：镜像流量检测
• 云WAF：DNS牵引

【ModSecurity】
开源WAF，Apache/Nginx模块
规则：SecRule指令

【常见绕过】
• 大小写混合
• 编码绕过
• 字符串拼接
• HTTP版本差异

【云WAF】
• 阿里云WAF
• 腾讯云WAF
• Cloudflare
• AWS WAF`,
      keyPoints: ['WAF专门防护Web攻击', 'ModSecurity是开源WAF', 'OWASP CRS提供全面规则', '旁路部署不影响业务', '规则需根据业务调优'],
      codeExamples: [{ title: 'ModSecurity规则', language: 'apache', code: '代码示例已简化，请参考实验环境进行实践', explanation: 'ModSecurity常用规则配置' }],
      labEnvironment: [{ name: 'ModSecurity', description: '开源WAF', url: 'https://modsecurity.org/', type: 'local', setup: '1. 安装ModSecurity for Nginx\n2. 下载OWASP CRS规则\n3. 配置规则\n4. 测试防护效果', expectedOutput: 'WAF能拦截常见Web攻击' }],
      recommendedTools: [{ name: 'ModSecurity', description: '开源WAF', url: 'https://modsecurity.org/', type: 'local' }],
      quiz: [
        { question: 'WAF主要防护什么攻击？', options: ['A. DDoS', 'B. Web应用攻击', 'C. 病毒', 'D. 内部攻击'], correctIndex: 1, explanation: 'WAF(Web Application Firewall)专门防护SQL注入、XSS等Web应用层攻击。' },
        { question: 'ModSecurity可以部署在哪个Web服务器？', options: ['A. Apache和Nginx', 'B. 只支持IIS', 'C. 只支持Apache', 'D. 只支持Nginx'], correctIndex: 0, explanation: 'ModSecurity可作为Apache和Nginx的模块部署。' },
        { question: 'WAF旁路部署的优点是？', options: ['A. 更好的防护', 'B. 不影响业务', 'C. 更高的性能', 'D. 更低的成本'], correctIndex: 1, explanation: '旁路部署不影响正常流量，只对镜像流量进行检测。' },
        { question: 'OWASP CRS是什么？', options: ['A. 认证框架', 'B. 编码标准', 'C. 防火墙规则集', 'D. 加密算法'], correctIndex: 2, explanation: 'OWASP Core Rule Set是OWASP提供的WAF规则集，防护各种Web攻击。' },
        { question: 'WAF可以完全替代安全开发吗？', options: ['A. 可以', 'B. 不可以', 'C. 看情况', 'D. 不确定'], correctIndex: 1, explanation: 'WAF是纵深防御的一部分，不能替代安全开发。代码层面的防护才是根本。' }
      ],
      expertNotes: [{ author: 'WangX', title: 'WAF部署与调优', content: 'WAF实战经验：1)初次部署用旁路模式观察，2)根据业务流量调整规则，3)关注误报，持续优化，4)日志要分析，用于发现潜在攻击，5)WAF不能替代代码安全，安全开发是根本。推荐使用ModSecurity+OWASP CRS作为开源方案。', url: 'https://blog.94test.org/' }],
      environmentSetup: { prerequisites: ['Nginx已安装'], verificationSteps: ['1. 安装ModSecurity', '2. 配置OWASP CRS', '3. 测试规则'] }
    ,
      resources: [{"name": "ModSecurity完全指南", "url": "https://github.com/SpiderLabs/ModSecurity/wiki", "type": "article"}, {"name": "WAF绕过与防护", "url": "https://www.freebuf.com/articles/web/174468.html", "type": "article"}, {"name": "Cloudflare WAF规则", "url": "https://developers.cloudflare.com/waf/", "type": "article"}, {"name": "WAF选型对比分析", "url": "https://www.anquanke.com/post/id/208576", "type": "article"}]},
    { id: 'basic-26', day: 26, title: '等级保护2.0概述', subtitle: '等保2.0 Overview', objectives: ['理解等级保护', '掌握等保流程', '了解测评要求'], content: `等级保护2.0是我国网络安全的基本制度。

【保护等级】
第一级：自主保护
• 面向一般信息系统
• 个人或小型组织

第二级：指导保护
• 面向重要信息系统
• 省级以下政府机关

第三级：监督保护
• 面向重要信息系统
• 省级以上政府机关
• 关键基础设施

第四级：强制保护
• 面向极端重要系统
• 国防、军事

第五级：专控保护
• 极端重要系统
• 国家级

【等保2.0技术要求】
• 安全物理环境
• 安全通信网络
• 安全区域边界
• 安全计算环境
• 安全管理中心

【等保流程】
定级 → 备案 → 建设整改 → 等级测评 → 监督检查

【测评要求】
• 技术测评：漏扫、渗透、配置核查
• 管理测评：制度、流程、人员
• 年度测评：高危系统每年测评`,
      keyPoints: ['等保2.0分五级', '第三级是重要系统', '定级-备案-建设-测评-监督', '技术+管理双重保护', '是网络安全基本制度'],
      codeExamples: [{ title: '等保差距分析', language: 'markdown', code: '# 等保差距分析表(示例)\n\n## 安全域：物理安全\n| 控制点 | 等保要求 | 现状 | 差距 | 整改措施 | 优先级 |\n|--------|----------|------|------|----------|--------|\n| 机房门禁 | ，电子门禁 | 有门禁系统 | 无 | 访客记录 | 中 |\n| 视频监控 | 360度监控 | 有监控 | 死角 | 增加摄像头 | 高 |\n| 防火 | 灭火系统 | 有 | 过期 | 更换 | 高 |\n\n## 安全域：网络安全\n| 控制点 | 等保要求 | 现状 | 差距 | 整改措施 | 优先级 |\n|--------|----------|------|------|----------|--------|\n| 防火墙 | 开启 | 部分开启 | 日志不全 | 完善日志 | 中 |\n| IDS/IPS | 部署 | 未部署 | 需要部署 | 采购部署 | 高 |', explanation: '等保差距分析表示例' }],
      labEnvironment: [{ name: '等保2.0标准', description: '等级保护2.0相关标准', url: 'https://www.djbh.net/', type: 'online', setup: '1. 访问等级保护综合服务平台\n2. 下载等保2.0相关标准\n3. 学习定级指南和测评要求\n4. 了解建设整改要求', expectedOutput: '理解等保2.0框架和要求' }],
      recommendedTools: [{ name: '等保工具箱', description: '等保测评工具', url: 'https://www.91test.org/', type: 'online' }],
      quiz: [
        { question: '等级保护2.0流程第一步是？', options: ['A. 备案', 'B. 定级', 'C. 测评', 'D. 建设'], correctIndex: 1, explanation: '等保流程：定级→备案→建设整改→等级测评→监督检查。' },
        { question: '第三级系统属于什么保护级别？', options: ['A. 自主保护', 'B. 指导保护', 'C. 监督保护', 'D. 强制保护'], correctIndex: 2, explanation: '第三级信息系统由国家信息安全监管部门进行监督保护。' },
        { question: '等保2.0的技术要求不包括？', options: ['A. 安全物理环境', 'B. 安全通信网络', 'C. 人员素质', 'D. 安全计算环境'], correctIndex: 2, explanation: '人员素质属于管理要求，技术要求包括物理、网络、边界、环境等。' },
        { question: '等级保护备案应到哪里？', options: ['A. 保密局', 'B. 公安机关', 'C. 网信办', 'D. 工信部'], correctIndex: 1, explanation: '等级保护定级后需到所在地设区的市级以上公安机关备案。' },
        { question: '高危系统应多久测评一次？', options: ['A. 每年', 'B. 每半年', 'C. 每两年', 'D. 三年一次'], correctIndex: 0, explanation: '三级及以上系统应每年测评一次，二级系统每两年测评一次。' }
      ],
      expertNotes: [{ author: '等保一线', title: '等保建设实战经验', content: '等保建设要点：1)定级要准确，过高增加工作量和成本，2)差距分析要全面，3)整改要有优先级，4)技术和管理要并重，5)测评机构选择要谨慎，6)持续运营是关键。常见问题：安全管理文档要落地，不能只做表面文章。', url: 'https://www.djbh.net/' }],
      environmentSetup: { prerequisites: ['了解企业业务系统'], verificationSteps: ['1. 确定系统定级', '2. 进行差距分析', '3. 制定整改计划', '4. 实施整改'] }
    ,
      resources: [{"name": "等级保护2.0国家标准", "url": "http://openstd.samr.gov.cn/", "type": "article"}, {"name": "等保2.0解读文章", "url": "https://www.freebuf.com/articles/es/236786.html", "type": "article"}, {"name": "等保定级指南", "url": "https://www.anquanke.com/post/id/218903", "type": "article"}, {"name": "等保测评机构名录", "url": "https://www.djbh.net/", "type": "article"}]},
    { id: 'basic-27', day: 27, title: '入侵检测与防御', subtitle: 'IDS/IPS Deployment', objectives: ['理解IDS/IPS原理', '掌握Snort使用', '了解签名编写'], content: `入侵检测系统(IDS)和入侵防御系统(IPS)是网络安全的重要组成部分。

【IDS/IPS区别】
• IDS：旁路部署，只检测不阻断
• IPS：串联部署，检测并阻断

【检测方法】
• 签名检测：匹配已知攻击特征
• 异常检测：基于正常行为基线
• 状态检测：跟踪协议状态

【Snort规则结构】
action protocol src_port direction dst_port (options)

规则动作：
• alert：告警
• pass：忽略
• drop：阻断并告警
• reject：拒绝并告警

【Suricata】
下一代IDS/IPS
支持多线程，性能更好

【告警分析流程】
1. 确认告警真实性
2. 评估影响范围
3. 确定响应级别
4. 记录调查过程`,
      keyPoints: ['IDS旁路检测', 'IPS串联阻断', 'Snort是开源IDS', '签名检测已知威胁', '异常检测发现未知威胁'],
      codeExamples: [{ title: 'Snort规则编写', language: 'snort', code: '# 检测SQL注入\nalert tcp any any -> any 80 (\n    msg:"SQL Injection Attempt";\n    content:"union select";\n    nocase;\n    sid:1000001;\n    rev:1;\n)\n\n# 检测XSS\nalert tcp any any -> any 80 (\n    msg:"XSS Attempt";\n    content:"<script";\n    nocase;\n    sid:1000002;\n    rev:1;\n)\n\n# 检测恶意软件下载\nalert tcp any any -> any 80 (\n    msg:"Malware Download";\n    content:"malware.exe";\n    sid:1000003;\n    rev:1;\n)\n\n# 检测SSH暴力破解\nalert tcp any any -> any 22 (\n    msg:"SSH Brute Force";\n    flags:S;\n    threshold:type threshold, track by_src, count 5, seconds 60;\n    sid:1000004;\n    rev:1;\n)', explanation: 'Snort入侵检测规则编写示例' }],
      labEnvironment: [{ name: 'Snort', description: '开源IDS', url: 'https://www.snort.org/', type: 'local', setup: '1. 安装Snort\n2. 配置网络接口为混杂模式\n3. 下载规则\n4. 运行Snort: snort -c /etc/snort/snort.conf\n5. 观察告警', expectedOutput: 'Snort能检测到模拟的攻击流量' }],
      recommendedTools: [{ name: 'Snort', description: '开源IDS', url: 'https://www.snort.org/', type: 'local' }, { name: 'Suricata', description: '下一代IDS/IPS', url: 'https://suricata.io/', type: 'local' }],
      quiz: [
        { question: 'IDS和IPS的主要区别是？', options: ['A. 无区别', 'B. IDS检测,IPS阻断', 'C. IDS串联,IPS旁路', 'D. IDS收费,IPS免费'], correctIndex: 1, explanation: 'IDS只检测不阻断，IPS检测并阻断，是串联部署。' },
        { question: 'Snort规则中alert表示什么？', options: ['A. 忽略', 'B. 告警', 'C. 阻断', 'D. 拒绝'], correctIndex: 1, explanation: 'alert是告警动作，生成告警日志但不断流。' },
        { question: 'Snort规则中content字段的作用是？', options: ['A. 指定协议', 'B. 匹配数据包内容', 'C. 指定端口', 'D. 指定源IP'], correctIndex: 1, explanation: 'content字段匹配数据包中的内容。' },
        { question: 'Suricata相比Snort的优势是？', options: ['A. 规则更多', 'B. 多线程支持', 'C. 更便宜', 'D. 配置更简单'], correctIndex: 1, explanation: 'Suricata支持多线程，性能更好，且兼容Snort规则。' },
        { question: '签名检测的局限性是？', options: ['A. 误报多', 'B. 无法检测未知攻击', 'C. 速度慢', 'D. 需要更新'], correctIndex: 1, explanation: '签名检测只能检测已知攻击，无法发现0day等未知威胁。' }
      ],
      expertNotes: [{ author: 'IDS专家', title: 'IDS/IPS部署经验', content: 'IDS/IPS部署要点：1)旁路部署对网络影响小，2)规则要定期更新，3)告警需要人工分析，4)结合威胁情报提高检测能力，5)关注加密流量检测。Suricata是未来趋势，推荐使用。', url: 'https://www.91ri.org/' }],
      environmentSetup: { prerequisites: ['Linux系统'], verificationSteps: ['1. 安装Snort', '2. 配置规则', '3. 运行检测', '4. 分析告警'] }
    ,
      resources: [{"name": "Snort IDS配置指南", "url": "https://www.snort.org/documents", "type": "article"}, {"name": "Suricata实战教程", "url": "https://suricata.readthedocs.io/", "type": "article"}, {"name": "IDS告警分析手册", "url": "https://www.anquanke.com/post/id/205467", "type": "article"}, {"name": "入侵检测系统对比", "url": "https://www.freebuf.com/articles/network/248912.html", "type": "article"}]},
    { id: 'basic-28', day: 28, title: '蜜罐与诱捕技术', subtitle: 'Honeypot Technology', objectives: ['理解蜜罐原理', '掌握蜜罐类型', '学习部署应用'], content: `蜜罐是诱饵系统，引诱攻击者以收集情报和拖延攻击。

【蜜罐类型】
低交互蜜罐：
• 模拟少量服务
• 风险低
• 收集有限信息
例：Honeyd、Dionaea(默约SMTP/FTP)

高交互蜜罐：
• 真实系统
• 信息全面
• 风险较高
例：蜜罐服务器

【蜜罐应用场景】
• 威胁检测：发现未知攻击
• 情报收集：分析攻击手法
• 转移攻击：分散攻击注意力
• 拖延攻击：为响应争取时间

【蜂蜜文件】
在服务器植入包含敏感信息的假文件
追踪文件被访问的时间、IP、次数

【T-Pot】
综合蜜罐平台
集成多种蜜罐：Cowrie(SSH)、Dionaea(SMB)、Elasticpot等

【防御建议】
• 蜜罐不是银弹
• 高交互蜜罐风险要控制
• 与其他安全设备配合使用`,
      keyPoints: ['蜜罐是诱饵系统', '低交互风险低', '高交互信息全', '蜂蜜文件追踪泄露', 'T-Pot是综合蜜罐平台'],
      codeExamples: [{ title: 'SSH蜜罐Cowrie部署', language: 'bash', code: '# Docker部署Cowrie SSH蜜罐\ndocker run -d \\\n  --name cowrie \\\n  -p 2222:2222 \\\n  -p 2223:2223 \\\n  -v /data/cowrie/logs:/home/cowrie/log \\\n  -v /data/cowrie/keys:/home/cowrie/keys \\\n  -v /data/cowrie/downloads:/home/cowrie/downloads \\\n  cowrie/cowrie:latest\n\n# 配置SSH服务端口为2222\n# 攻击者连接时记录所有操作\n# 日志保存在/home/cowrie/log/', explanation: '使用Docker快速部署Cowrie SSH蜜罐' }],
      labEnvironment: [{ name: 'T-Pot蜜罐平台', description: '综合蜜罐平台', url: 'https://github.com/telekom-security/tpotce', type: 'online', setup: '1. 下载T-Pot ISO\n2. 安装到虚拟机\n3. 配置网络\n4. 访问管理界面\n5. 查看捕获的攻击数据', expectedOutput: 'T-Pot运行并记录攻击尝试' }],
      recommendedTools: [{ name: 'T-Pot', description: '综合蜜罐平台', url: 'https://github.com/telekom-security/tpotce', type: 'local' }, { name: 'Cowrie', description: 'SSH蜜罐', url: 'https://github.com/cowrie/cowrie', type: 'local' }],
      quiz: [
        { question: '蜜罐的主要作用是？', options: ['A. 阻止攻击', 'B. 诱骗和分析攻击', 'C. 加密数据', 'D. 用户认证'], correctIndex: 1, explanation: '蜜罐设置诱饵系统，引诱攻击者并分析其行为和技术。' },
        { question: '低交互蜜罐的特点是？', options: ['A. 真实系统', 'B. 风险低信息少', 'C. 风险高', 'D. 功能完整'], correctIndex: 1, explanation: '低交互蜜罐模拟服务，风险低但收集信息有限。' },
        { question: 'T-Pot是什么？', options: ['A. 防火墙', 'B. 综合蜜罐平台', 'C. 入侵检测', 'D. 漏洞扫描器'], correctIndex: 1, explanation: 'T-Pot是集成多种蜜罐的综合平台。' },
        { question: 'Cowrie是什么类型的蜜罐？', options: ['A. HTTP', 'B. SSH/Telnet', 'C. 数据库', 'D. DNS'], correctIndex: 1, explanation: 'Cowrie是SSH和Telnet蜜罐，记录攻击者的所有命令。' },
        { question: '蜂蜜文件的目的是？', options: ['A. 诱骗攻击者', 'B. 存储真实数据', 'C. 加速访问', 'D. 测试网络'], correctIndex: 0, explanation: '蜂蜜文件是假文件，用于追踪是否发生数据泄露。' }
      ],
      expertNotes: [{ author: 'Honeypot', title: '蜜罐部署实践', content: '蜜罐部署建议：1)低交互蜜罐适合生产环境，2)高交互蜜罐用于研究，3)蜜罐IP不要与真实资产接近，4)要监控蜜罐自身安全，5)分析蜜罐数据可发现新威胁。推荐T-Pot开箱即用。', url: 'https://www.honeynet.org/' }],
      environmentSetup: { prerequisites: ['Docker已安装'], verificationSteps: ['1. Docker部署Cowrie', '2. 修改SSH端口', '3. 观察日志', '4. 分析攻击数据'] }
    ,
      resources: [{"name": "蜜罐技术完全指南", "url": "https://github.com/paralax/awesome-honeypots", "type": "article"}, {"name": "Hfish蜜罐部署", "url": "https://hfish.net/", "type": "article"}, {"name": "蜜罐在安全防御中的应用", "url": "https://www.freebuf.com/articles/web/249078.html", "type": "article"}, {"name": "T-Pot多蜜罐平台", "url": "https://github.com/telekom-security/tpotce", "type": "article"}]},
    { id: 'basic-29', day: 29, title: '威胁情报概述', subtitle: 'Threat Intelligence', objectives: ['理解威胁情报', '掌握IOC提取', '学习情报应用'], content: `威胁情报是关于威胁的证据型知识，帮助组织了解威胁。

【情报类型】
战略情报：
• 面向管理层
• 影响安全决策
• 趋势分析

战术情报：
• 面向运营人员
• 攻击者手法(TPP)
• 行动模式

运营情报：
• 面向安全团队
• 具体攻击活动
• 事件关联分析

技术情报：
• 面向技术人员
• IOC指标
• 检测规则

【IOC妥协指标】
• IP地址：恶意IP
• 域名：恶意域名
• URL：恶意URL
• 文件哈希：恶意软件
• 邮箱地址：钓鱼

【情报平台】
• VirusTotal：文件/URL/IP检测
• AlienVault OTX：威胁情报共享
• MISP：开源威胁情报平台
• ThreatConnect：威胁情报管理

【情报应用】
• 告警验证
• 威胁狩猎
• 事件响应
• 风险评估`,
      keyPoints: ['威胁情报是证据型知识', 'IOC是妥协指标', 'VirusTotal是最知名查询平台', '战略-战术-运营-技术四级', '情报共享很重要'],
      codeExamples: [{ title: 'IOC查询脚本', language: 'python', code: 'import requests\n\ndef check_ip_reputation(ip):\n    """使用VirusTotal API检查IP信誉\n    需要API Key\n    \"\"\"\n    url = f"https://www.virustotal.com/api/v3/ip_addresses/{ip}"\n    headers = {"x-apikey": "YOUR_API_KEY"}\n    \n    try:\n        response = requests.get(url, headers=headers)\n        if response.status_code == 200:\n            data = response.json()[\'data\']\n            attrs = data[\'attributes\']\n            stats = attrs[\'last_analysis_stats\']\n            \n            print(f"IP: {ip}")\n            print(f"恶意检测: {stats[\'malicious\']}\")\n            print(f"可疑检测: {stats[\'suspicious\']}\")\n            print(f"无害检测: {stats[\'harmless\']}\")\n            \n            if stats[\'malicious\'] > 0:\n                print(\"[!] 此IP被标记为恶意\")\n    except Exception as e:\n        print(f"查询失败: {e}")\n\n# 示例\ncheck_ip_reputation("8.8.8.8")', explanation: '使用API查询IP威胁情报' }],
      labEnvironment: [{ name: 'VirusTotal', description: '威胁情报查询', url: 'https://www.virustotal.com/', type: 'online', setup: '1. 注册VirusTotal账号\n2. 获取API Key\n3. 使用API或Web界面查询\n4. 提交可疑文件/URL/IP分析', expectedOutput: '能够查询和理解威胁情报' }],
      recommendedTools: [{ name: 'VirusTotal', description: '威胁情报平台', url: 'https://www.virustotal.com/', type: 'online' }, { name: 'AlienVault OTX', description: '开源威胁情报', url: 'https://otx.alienvault.com/', type: 'online' }],
      quiz: [
        { question: '以下哪个不是IOC？', options: ['A. IP地址', 'B. 域名', 'C. 用户名', 'D. 文件哈希'], correctIndex: 2, explanation: 'IOC(Indicators of Compromise)是妥协指标，包括IP、域名、URL、文件哈希等。用户名不是。' },
        { question: 'VirusTotal主要用于什么？', options: ['A. 漏洞扫描', 'B. 文件/URL/IP检测', 'C. 渗透测试', 'D. 加密解密'], correctIndex: 1, explanation: 'VirusTotal通过多个安全引擎检测文件、URL、IP的威胁状态。' },
        { question: 'MISP是什么？', options: ['A. 入侵检测', 'B. 开源威胁情报平台', 'C. 蜜罐系统', 'D. 防火墙'], correctIndex: 1, explanation: 'MISP(Malware Information Sharing Platform)是开源威胁情报共享平台。' },
        { question: '威胁情报的四个层级不包括？', options: ['A. 战略', 'B. 战术', 'C. 技术', 'D. 物理'], correctIndex: 3, explanation: '威胁情报分为战略、战术、运营、技术四个层级。' },
        { question: 'AlienVault OTX是？', options: ['A. 防火墙', 'B. 威胁情报平台', 'C. 漏洞扫描器', 'D. 入侵检测'], correctIndex: 1, explanation: 'AlienVault OTX是开源威胁情报共享平台。' }
      ],
      expertNotes: [{ author: 'TI专家', title: '威胁情报应用实践', content: '威胁情报应用要点：1)选择适合的情报源，2)情报要落地才能发挥作用，3)与SIEM/IDS集成分享，4)持续更新情报库，5)关注战术情报用于检测，6)战略情报用于决策。推荐：VT免费版足够个人使用，企业使用付费API。', url: 'https://blog.91test.org/' }],
      environmentSetup: { prerequisites: ['VirusTotal账号'], verificationSteps: ['1. 注册VirusTotal', '2. 获取API Key', '3. 使用API查询IOC', '4. 导入SIEM进行检测'] }
    ,
      resources: [{"name": "威胁情报入门指南", "url": "https://www.anquanke.com/post/id/235891", "type": "article"}, {"name": "MISP平台使用教程", "url": "https://www.misp-project.org/documentation/", "type": "article"}, {"name": "VirusTotal使用指南", "url": "https://www.virustotal.com/", "type": "article"}, {"name": "威胁情报共享最佳实践", "url": "https://www.freebuf.com/articles/es/284563.html", "type": "article"}]},
    { id: 'basic-30', day: 30, title: '安全开发与总结', subtitle: 'Security Development Lifecycle', objectives: ['理解SDL流程', '掌握安全编码', '总结基础知识点'], content: `安全开发生命周期(SDL)将安全融入软件开发全过程。

【SDL阶段】
1. 培训：安全意识培训
2. 需求：安全需求分析
3. 设计：威胁建模
4. 实现：安全编码
5. 验证：测试/代码审计
6. 发布：安全评估
7. 响应：应急响应

【STRIDE威胁建模】
S - Spoofing(伪装)：认证
T - Tampering(篡改)：完整性
R - Repudiation(否认)：审计
I - Information Disclosure(信息泄露)：保密性
D - Denial of Service(拒绝服务)：可用性
E - Elevation of Privilege(权限提升)：授权

【安全编码原则】
• 输入验证
• 输出编码
• 身份认证和会话管理
• 访问控制
• 加密
• 错误处理
• 日志记录

【OWASP安全编码指南】
• 输入验证
• 输出编码
• 认证和密码管理
• 会话管理
• 访问控制
• 加密
• 错误处理
• 数据保护
• 通信安全
• 系统配置`,
      keyPoints: ['SDL将安全融入开发全生命周期', 'STRIDE是威胁建模方法', '安全编码是根本', '安全测试很重要', '持续学习是安全人员素养'],
      codeExamples: [{ title: '安全编码检查清单', language: 'markdown', code: '# 安全编码检查清单\n\n## 输入验证\n- [ ] 所有用户输入必须验证\n- [ ] 使用白名单验证\n- [ ] 验证数据类型、长度、格式\n\n## SQL注入防护\n- [ ] 使用参数化查询\n- [ ] 避免字符串拼接\n- [ ] 使用ORM框架\n\n## XSS防护\n- [ ] HTML转义输出\n- [ ] 使用CSP策略\n- [ ] 设置HttpOnly Cookie\n\n## 认证授权\n- [ ] 使用强密码策略\n- [ ] 实现多因素认证\n- [ ] 最小权限原则\n\n## 加密\n- [ ] 使用强加密算法\n- [ ] 安全存储密钥\n- [ ] 密钥管理规范', explanation: '安全编码检查清单' }],
      labEnvironment: [{ name: 'OWASP安全指南', description: 'OWASP安全编码指南', url: 'https://cheatsheetseries.owasp.org/', type: 'online', setup: '1. 访问OWASP Cheat Sheet系列\n2. 学习各语言的安全编码指南\n3. 应用到开发实践中\n4. 代码审计时对照检查', expectedOutput: '掌握安全编码规范' }],
      recommendedTools: [{ name: 'SonarQube', description: '代码质量管理', url: 'https://sonarqube.org/', type: 'local' }, { name: 'OWASP ZAP', description: 'Web安全测试', url: 'https://www.zaproxy.org/', type: 'local' }],
      quiz: [
        { question: 'STRIDE中"S"对应哪个安全属性？', options: ['A. 完整性', 'B. 认证', 'C. 保密性', 'D. 可用性'], correctIndex: 1, explanation: 'STRIDE：S-Spoofing伪装对应认证(Authentication)。' },
        { question: 'SDL的全称是？', options: ['A. Security Design Life', 'B. Security Development Life', 'C. Security Development Lifecycle', 'D. Secure Development Level'], correctIndex: 2, explanation: 'SDL=Security Development Lifecycle，安全开发生命周期。' },
        { question: 'STRIDE不包括以下哪个？', options: ['A. Spoofing', 'B. Tampering', 'C. Encryption', 'D. Repudiation'], correctIndex: 2, explanation: 'STRIDE包括Spoofing、Tampering、Repudiation、Information Disclosure、Denial of Service、Elevation of Privilege。' },
        { question: '安全开发中最重要的环节是？', options: ['A. 代码审计', 'B. 渗透测试', 'C. 安全编码', 'D. 日志审计'], correctIndex: 2, explanation: '安全编码是根本，代码审计和渗透测试是验证手段。' },
        { question: 'STRIDE中"I"代表什么？', options: ['A. 完整性', 'B. 信息泄露', 'C. 注入', 'D. 检查'], correctIndex: 1, explanation: 'I=Information Disclosure，对应保密性(Confidentiality)。' }
      ],
      expertNotes: [{ author: 'SDL专家', title: 'SDL实施指南', content: 'SDL实施要点：1)高层支持是成功关键，2)培训要持续，3)威胁建模要在设计阶段进行，4)代码审计要自动化，5)安全测试要集成到CI/CD，6)应急响应要准备好。微软SDL是成熟参考模型。', url: 'https://www.microsoft.com/sdl/' }],
      environmentSetup: { prerequisites: ['有开发项目'], verificationSteps: ['1. 应用安全编码检查清单', '2. 集成SAST工具到CI/CD', '3. 进行渗透测试', '4. 持续改进'] }
    ,
      resources: [{"name": "安全开发最佳实践(OWASP)", "url": "https://owasp.org/www-project-developer-guide/", "type": "article"}, {"name": "SDL安全开发流程", "url": "https://www.microsoft.com/en-us/securityengineering/sdl", "type": "article"}, {"name": "DevSecOps落地实践", "url": "https://www.freebuf.com/articles/es/279345.html", "type": "article"}, {"name": "安全开发工具链", "url": "https://www.anquanke.com/post/id/258912", "type": "article"}]}
  ]
};
