export interface BookChapter {
  id: string;
  title: string;
  content?: string;
  fileName?: string;
  pageCount: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  subCategory?: string;
  cover: string;
  description: string;
  pages: number;
  difficulty: '入门' | '进阶' | '高级';
  publishYear: number;
  isbn?: string;
  tags: string[];
  rating: number;
  readers: number;
  chapters: BookChapter[];
  highlights?: string[];
  prerequisites?: string[];
  targetAudience: string;
  folder?: string;
}

export interface BookCategory {
  name: string;
  description: string;
  icon: string;
  count: number;
}

const books: Book[] = [
  {
    id: 'cybersecurity-lab-setup-guide',
    title: '网安环境搭建实战指南',
    author: '网安实验团队',
    category: '系统安全',
    cover: '实战',
    description: '从零搭建完整的网络安全实验环境，涵盖30章10大模块，从虚拟化基础到各类漏洞靶场，从渗透测试工具到红蓝对抗环境，从Web漏洞到工控云安全，从代码审计到移动安全，帮助读者快速构建自己的安全实验室。每章都有详细的安装步骤、配置说明和使用教程，图文并茂，即学即用。',
    pages: 1650,
    difficulty: '入门',
    publishYear: 2024,
    tags: ['环境搭建', '漏洞靶场', '渗透测试', '护网', '红蓝对抗', 'Docker', '虚拟化', '代码审计', '移动安全', '恶意代码分析'],
    rating: 4.8,
    readers: 12800,
    targetAudience: '网络安全初学者、渗透测试工程师、安全运维人员、红队蓝队成员、安全爱好者',
    prerequisites: ['计算机基础', '基本网络知识'],
    folder: '网安环境搭建实战指南',
    highlights: [
      '30章完整知识体系，10大模块全覆盖',
      '基础篇+Web漏洞篇+渗透测试篇+护网演练篇+靶场篇+专项环境篇',
      'VMware/VirtualBox/Kali/Docker 基础环境全掌握',
      'DVWA/SQLi-Labs/BWAPP/WebGoat/Vulhub 主流靶场全覆盖',
      'Burp Suite/sqlmap/Metasploit/Nmap 核心工具配置',
      'Cobalt Strike/ELK/Security Onion 红蓝对抗环境',
      'CTFd/VulnHub/红日靶场 各类靶场搭建',
      '代码审计/恶意代码分析/移动安全 进阶实战环境',
      '无线安全/API安全/IoT安全/邮件安全 专项安全环境'
    ],
    chapters: [
      { id: 'ch1', title: '第一章 虚拟化环境搭建', fileName: 'ch01-虚拟化环境搭建.md', pageCount: 50 },
      { id: 'ch2', title: '第二章 Kali Linux渗透测试系统', fileName: 'ch02-Kali Linux渗透测试系统.md', pageCount: 55 },
      { id: 'ch3', title: '第三章 DVWA漏洞平台搭建', fileName: 'ch03-DVWA漏洞平台搭建.md', pageCount: 45 },
      { id: 'ch4', title: '第四章 SQL注入环境SQLi-Labs搭建', fileName: 'ch04-SQL注入环境SQLi-Labs搭建.md', pageCount: 50 },
      { id: 'ch5', title: '第五章 BWAPP漏洞平台搭建', fileName: 'ch05-BWAPP漏洞平台搭建.md', pageCount: 50 },
      { id: 'ch6', title: '第六章 WebGoat与WebWolf搭建', fileName: 'ch06-WebGoat与WebWolf搭建.md', pageCount: 45 },
      { id: 'ch7', title: '第七章 Vulhub漏洞环境搭建', fileName: 'ch07-Vulhub漏洞环境搭建.md', pageCount: 55 },
      { id: 'ch8', title: '第八章 专项漏洞练习平台', fileName: 'ch08-专项漏洞练习平台.md', pageCount: 50 },
      { id: 'ch9', title: '第九章 渗透测试工具集搭建', fileName: 'ch09-渗透测试工具集搭建.md', pageCount: 55 },
      { id: 'ch10', title: '第十章 Metasploit渗透框架', fileName: 'ch10-Metasploit渗透框架.md', pageCount: 55 },
      { id: 'ch11', title: '第十一章 ATT&CK攻防靶场搭建', fileName: 'ch11-ATT&CK攻防靶场搭建.md', pageCount: 50 },
      { id: 'ch12', title: '第十二章 红队演练环境搭建', fileName: 'ch12-红队演练环境搭建.md', pageCount: 55 },
      { id: 'ch13', title: '第十三章 蓝队SOC安全运营环境', fileName: 'ch13-蓝队SOC安全运营环境.md', pageCount: 60 },
      { id: 'ch14', title: '第十四章 VulnHub靶场环境', fileName: 'ch14-VulnHub靶场环境.md', pageCount: 50 },
      { id: 'ch15', title: '第十五章 CTF竞赛环境搭建', fileName: 'ch15-CTF竞赛环境搭建.md', pageCount: 50 },
      { id: 'ch16', title: '第十六章 云安全实验环境', fileName: 'ch16-云安全实验环境.md', pageCount: 55 },
      { id: 'ch17', title: '第十七章 工控安全实验环境', fileName: 'ch17-工控安全实验环境.md', pageCount: 55 },
      { id: 'ch18', title: '第十八章 逆向分析环境搭建', fileName: 'ch18-逆向分析环境搭建.md', pageCount: 55 },
      { id: 'ch19', title: '第十九章 电子取证分析环境', fileName: 'ch19-电子取证分析环境.md', pageCount: 55 },
      { id: 'ch20', title: '第二十章 综合攻防靶场搭建', fileName: 'ch20-综合攻防靶场搭建.md', pageCount: 60 },
      { id: 'ch21', title: '第二十一章 CMS漏洞环境搭建', fileName: 'ch21-CMS漏洞环境搭建.md', pageCount: 45 },
      { id: 'ch22', title: '第二十二章 内网渗透环境搭建', fileName: 'ch22-内网渗透环境搭建.md', pageCount: 55 },
      { id: 'ch23', title: '第二十三章 社会工程学与钓鱼环境', fileName: 'ch23-社会工程学与钓鱼环境.md', pageCount: 50 },
      { id: 'ch24', title: '第二十四章 代码审计环境搭建', fileName: 'ch24-代码审计环境搭建.md', pageCount: 70 },
      { id: 'ch25', title: '第二十五章 恶意代码分析环境', fileName: 'ch25-恶意代码分析环境.md', pageCount: 65 },
      { id: 'ch26', title: '第二十六章 移动安全测试环境', fileName: 'ch26-移动安全测试环境.md', pageCount: 65 },
      { id: 'ch27', title: '第二十七章 无线安全环境搭建', fileName: 'ch27-无线安全环境搭建.md', pageCount: 60 },
      { id: 'ch28', title: '第二十八章 API安全测试环境', fileName: 'ch28-API安全测试环境.md', pageCount: 55 },
      { id: 'ch29', title: '第二十九章 IoT物联网安全环境', fileName: 'ch29-IoT物联网安全环境.md', pageCount: 60 },
      { id: 'ch30', title: '第三十章 邮件安全测试环境', fileName: 'ch30-邮件安全测试环境.md', pageCount: 60 },
    ]
  },
  {
    id: 'network-security-basics',
    title: '网络安全基础',
    author: '网络安全研究组',
    category: '基础理论',
    cover: '基础',
    description: '从零开始系统学习网络安全，20章完整内容涵盖基础概念、攻击技术、防御体系、管理实战四大板块，通俗易懂，适合零基础入门学习者。',
    pages: 760,
    difficulty: '入门',
    publishYear: 2024,
    tags: ['网络安全', '入门', '基础概念', '攻防技术', '安全管理'],
    rating: 4.9,
    readers: 18680,
    targetAudience: '网络安全初学者、IT从业人员、安全爱好者',
    prerequisites: ['计算机基础'],
    folder: '网络安全基础',
    highlights: [
      '20章完整知识体系，从入门到进阶',
      '四大模块：基础概念+攻击技术+防御体系+管理实战',
      '通俗易懂，案例丰富，适合零基础',
      '网络基础、密码学、Web攻击、恶意代码全涵盖',
      '身份认证、数据安全、终端加固、安全运营',
      '应急响应、灾难恢复、安全意识、法律法规',
      '综合实战案例贯穿，未来趋势与职业发展'
    ],
    chapters: [
      { id: 'ch1', title: '第一章 什么是网络安全？', fileName: 'ch01-什么是网络安全.md', pageCount: 40 },
      { id: 'ch2', title: '第二章 网络基础（上）', fileName: 'ch02-网络基础-上.md', pageCount: 50 },
      { id: 'ch3', title: '第三章 网络基础（下）', fileName: 'ch03-网络基础-下.md', pageCount: 45 },
      { id: 'ch4', title: '第四章 密码学基础', fileName: 'ch04-密码学基础.md', pageCount: 55 },
      { id: 'ch5', title: '第五章 安全模型与标准规范', fileName: 'ch05-安全模型与标准规范.md', pageCount: 45 },
      { id: 'ch6', title: '第六章 信息收集与漏洞扫描', fileName: 'ch06-信息收集与漏洞扫描.md', pageCount: 50 },
      { id: 'ch7', title: '第七章 Web应用攻击', fileName: 'ch07-Web应用攻击.md', pageCount: 65 },
      { id: 'ch8', title: '第八章 恶意代码与勒索软件', fileName: 'ch08-恶意代码与勒索软件.md', pageCount: 55 },
      { id: 'ch9', title: '第九章 社会工程学与钓鱼攻击', fileName: 'ch09-社会工程学与钓鱼攻击.md', pageCount: 45 },
      { id: 'ch10', title: '第十章 内网渗透与横向移动', fileName: 'ch10-内网渗透与横向移动.md', pageCount: 60 },
      { id: 'ch11', title: '第十一章 防火墙与入侵检测系统', fileName: 'ch11-防火墙与入侵检测系统.md', pageCount: 55 },
      { id: 'ch12', title: '第十二章 身份认证与访问控制', fileName: 'ch12-身份认证与访问控制.md', pageCount: 50 },
      { id: 'ch13', title: '第十三章 数据安全与隐私保护', fileName: 'ch13-数据安全与隐私保护.md', pageCount: 60 },
      { id: 'ch14', title: '第十四章 终端安全与主机加固', fileName: 'ch14-终端安全与主机加固.md', pageCount: 50 },
      { id: 'ch15', title: '第十五章 安全运营与威胁检测', fileName: 'ch15-安全运营与威胁检测.md', pageCount: 55 },
      { id: 'ch16', title: '第十六章 应急响应与事件处置', fileName: 'ch16-应急响应与事件处置.md', pageCount: 60 },
      { id: 'ch17', title: '第十七章 灾难恢复与业务连续性', fileName: 'ch17-灾难恢复与业务连续性.md', pageCount: 45 },
      { id: 'ch18', title: '第十八章 安全意识与人员管理', fileName: 'ch18-安全意识与人员管理.md', pageCount: 45 },
      { id: 'ch19', title: '第十九章 法律法规与合规要求', fileName: 'ch19-法律法规与合规要求.md', pageCount: 50 },
      { id: 'ch20', title: '第二十章 综合实战与未来展望', fileName: 'ch20-综合实战与未来展望.md', pageCount: 55 },
    ]
  },
  {
    id: 'penetration-testing-guide',
    title: '渗透测试实战指南',
    author: '安全攻防实验室',
    category: '渗透测试',
    cover: '渗透',
    description: '从零开始学习渗透测试，涵盖信息收集、漏洞利用、后渗透全流程。',
    pages: 450,
    difficulty: '进阶',
    publishYear: 2024,
    tags: ['渗透测试', 'Kali', '漏洞利用', 'CTF'],
    rating: 4.9,
    readers: 23450,
    targetAudience: '渗透测试工程师、安全研究员、CTF选手',
    prerequisites: ['网络安全基础', 'Linux基础', '编程基础'],
    highlights: [
      '完整的渗透测试流程',
      'Kali Linux工具详解',
      'OWASP Top 10实战',
      '内网渗透与域渗透'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 渗透测试概述',
        content: '1.1 什么是渗透测试\n\n渗透测试是通过模拟恶意攻击者的攻击方式，对计算机系统、网络或应用程序进行安全评估的过程。\n\n1.2 渗透测试类型\n\n- 黑盒测试：完全不了解系统内部结构\n- 白盒测试：完全了解系统源代码和架构\n- 灰盒测试：部分了解系统信息\n\n1.3 渗透测试流程\n\n1. 前期交互（Pre-engagement）\n2. 信息收集（Information Gathering）\n3. 威胁建模（Threat Modeling）\n4. 漏洞分析（Vulnerability Analysis）\n5. 漏洞利用（Exploitation）\n6. 后渗透（Post-Exploitation）\n7. 报告编写（Reporting）\n\n1.4 法律与道德\n\n渗透测试必须获得书面授权，遵守法律法规和道德规范。',
        pageCount: 25
      },
      {
        id: 'ch2',
        title: '第二章 信息收集',
        content: '2.1 被动信息收集\n\n- Whois查询\n- DNS枚举\n- 搜索引擎使用（Google Hacking）\n- 社交媒体情报收集\n- Shodan、FOFA等网络空间搜索引擎\n\n2.2 主动信息收集\n\n- 端口扫描：Nmap使用详解\n- 服务识别：版本探测、Banner抓取\n- 操作系统识别：指纹识别\n- 漏洞扫描：Nessus、OpenVAS\n\n2.3 信息整理与分析\n\n- 网络拓扑绘制\n- 攻击面分析\n- 脆弱点识别',
        pageCount: 55
      },
      {
        id: 'ch3',
        title: '第三章 Web应用渗透测试',
        content: '3.1 OWASP Top 10\n\n- A01: 失效的访问控制\n- A02: 加密机制失效\n- A03: 注入（SQL注入、XSS等）\n- A04: 不安全的设计\n- A05: 安全配置错误\n- A06: 易受攻击和过时的组件\n- A07: 识别和认证失败\n- A08: 软件和数据完整性失败\n- A09: 安全日志和监控失败\n- A10: 服务端请求伪造（SSRF）\n\n3.2 SQL注入\n\n- 注入原理\n- UNION注入\n- 布尔盲注\n- 时间盲注\n- 宽字节注入\n- 二次注入\n\n3.3 XSS跨站脚本攻击\n\n- 反射型XSS\n- 存储型XSS\n- DOM型XSS\n- XSS利用：Cookie窃取、钓鱼、键盘记录\n\n3.4 文件上传漏洞\n\n3.5 命令执行漏洞\n\n3.6 CSRF跨站请求伪造',
        pageCount: 80
      },
      {
        id: 'ch4',
        title: '第四章 漏洞利用基础',
        content: '4.1 漏洞类型\n\n- 缓冲区溢出\n- 格式化字符串漏洞\n- 整数溢出\n- Use-After-Free\n- 堆溢出\n\n4.2 Metasploit框架\n\n- MSF架构\n- 模块使用\n- Payload生成\n- 后渗透模块\n\n4.3 漏洞利用开发\n\n- 漏洞原理分析\n- Exploit开发流程\n- Shellcode编写\n- 绕过防护机制',
        pageCount: 65
      },
      {
        id: 'ch5',
        title: '第五章 后渗透测试',
        content: '5.1 权限提升\n\n- Windows提权\n- Linux提权\n- 内核漏洞利用\n- 服务配置错误利用\n\n5.2 内网渗透\n\n- 端口转发与隧道\n- 内网信息收集\n- 横向移动\n- 域环境渗透\n\n5.3 维持访问\n\n- 后门安装\n- Rootkit\n- 计划任务\n\n5.4 痕迹清理\n\n- 日志清除\n- 文件删除\n- 时间戳伪造',
        pageCount: 70
      },
      {
        id: 'ch6',
        title: '第六章 无线渗透测试',
        content: '6.1 无线网络基础\n\n6.2 WEP破解\n\n6.3 WPA/WPA2破解\n\n6.4 Evil Twin攻击\n\n6.5 无线嗅探',
        pageCount: 45
      },
      {
        id: 'ch7',
        title: '第七章 渗透测试报告',
        content: '7.1 报告结构\n\n7.2 漏洞评级标准\n\n7.3 修复建议编写\n\n7.4 报告模板',
        pageCount: 35
      }
    ]
  },
  {
    id: 'cryptography-practical',
    title: '密码学实战',
    author: '密码学研究团队',
    category: '密码学',
    cover: '密码',
    description: '从古典密码到现代密码学，深入理解加密原理并动手实现各种密码算法。',
    pages: 380,
    difficulty: '高级',
    publishYear: 2023,
    tags: ['密码学', '加密算法', '数学', 'Python'],
    rating: 4.7,
    readers: 12300,
    targetAudience: '密码学爱好者、安全研究员、开发工程师',
    prerequisites: ['数学基础', '编程基础'],
    highlights: [
      '古典密码与现代密码',
      '对称加密与非对称加密',
      '哈希函数与数字签名',
      '密码学Python实现'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 密码学概述',
        content: '1.1 密码学发展历史\n\n从古典密码到现代密码学的发展历程。\n\n1.2 密码学基本概念\n\n明文、密文、密钥、加密、解密\n\n1.3 密码分析学\n\n- 唯密文攻击\n- 已知明文攻击\n- 选择明文攻击\n- 选择密文攻击\n\n1.4 密码学应用场景',
        pageCount: 30
      },
      {
        id: 'ch2',
        title: '第二章 古典密码',
        content: '2.1 替换密码\n\n- 凯撒密码\n- 维吉尼亚密码\n- 单表替换\n- 多表替换\n\n2.2 置换密码\n\n- 栅栏密码\n- 列置换密码\n\n2.3 古典密码分析\n\n- 频率分析\n- 暴力破解\n- 巧合指数',
        pageCount: 45
      },
      {
        id: 'ch3',
        title: '第三章 对称加密',
        content: '3.1 分组密码\n\n- DES算法原理\n- 3DES\n- AES算法详解\n\n3.2 加密模式\n\nECB、CBC、CFB、OFB、CTR、GCM\n\n3.3 流密码\n\nRC4、ChaCha20\n\n3.4 Python实现\n\n使用PyCryptodome库实现对称加密',
        pageCount: 60
      },
      {
        id: 'ch4',
        title: '第四章 非对称加密',
        content: '4.1 公钥密码学基础\n\nDiffie-Hellman密钥交换\n\n4.2 RSA算法\n\n- 数学原理\n- 密钥生成\n- 加密解密\n- 数字签名\n\n4.3 椭圆曲线密码学（ECC）\n\n- 椭圆曲线数学\n- ECDH密钥交换\n- ECDSA数字签名\n\n4.4 公钥基础设施（PKI）\n\n数字证书、CA、证书链',
        pageCount: 55
      },
      {
        id: 'ch5',
        title: '第五章 哈希函数',
        content: '5.1 哈希函数性质\n\n单向性、抗碰撞性、雪崩效应\n\n5.2 常见哈希算法\n\nMD5、SHA-1、SHA-256、SHA-3、SM3\n\n5.3 消息认证码\n\nHMAC、CMAC\n\n5.4 哈希攻击\n\n长度扩展攻击、彩虹表',
        pageCount: 50
      },
      {
        id: 'ch6',
        title: '第六章 数字签名与认证',
        content: '6.1 数字签名\n\nRSA签名、DSA、ECDSA、Schnorr签名\n\n6.2 数字证书\n\nX.509证书、证书验证\n\n6.3 身份认证\n\n- 基于口令的认证\n- 双因素认证\n- 生物识别认证',
        pageCount: 45
      },
      {
        id: 'ch7',
        title: '第七章 密码学应用',
        content: '7.1 HTTPS/TLS\n\nTLS握手过程、证书验证\n\n7.2 密码货币\n\n比特币、区块链密码学\n\n7.3 端到端加密\n\nSignal协议\n\n7.4 同态加密与零知识证明',
        pageCount: 50
      }
    ]
  },
  {
    id: 'reverse-engineering',
    title: '逆向工程入门到精通',
    author: '二进制安全团队',
    category: '二进制安全',
    cover: '逆向',
    description: '系统学习逆向工程技术，从静态分析到动态调试，掌握软件逆向分析核心技能。',
    pages: 520,
    difficulty: '高级',
    publishYear: 2024,
    tags: ['逆向工程', '二进制', '反汇编', '调试'],
    rating: 4.8,
    readers: 9800,
    targetAudience: '逆向工程师、漏洞研究员、恶意软件分析师',
    prerequisites: ['C/C++编程', '汇编语言', '操作系统基础'],
    highlights: [
      'x86/x64汇编语言',
      'IDA Pro使用详解',
      '静态分析与动态调试',
      '恶意代码分析实战'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 逆向工程概述',
        content: '1.1 什么是逆向工程\n\n1.2 逆向工程应用场景\n\n- 漏洞挖掘\n- 恶意软件分析\n- 软件破解\n- 兼容性分析\n\n1.3 法律与道德问题\n\n1.4 学习路径',
        pageCount: 20
      },
      {
        id: 'ch2',
        title: '第二章 x86/x64汇编语言',
        content: '2.1 CPU架构\n\n2.2 寄存器\n\n通用寄存器、段寄存器、标志寄存器\n\n2.3 指令集\n\n- 数据传送指令\n- 算术运算指令\n- 逻辑运算指令\n- 控制转移指令\n- 函数调用约定\n\n2.4 寻址方式',
        pageCount: 60
      },
      {
        id: 'ch3',
        title: '第三章 PE文件格式',
        content: '3.1 PE文件结构\n\n- DOS头\n- PE头\n- 节表\n- 导入表\n- 导出表\n- 重定位表\n- 资源节\n\n3.2 可执行文件加载过程\n\n3.3 PE工具使用\n\nPEview、CFF Explorer、LordPE',
        pageCount: 55
      },
      {
        id: 'ch4',
        title: '第四章 静态分析',
        content: '4.1 IDA Pro使用\n\n- 界面介绍\n- 反汇编\n- 反编译（F5）\n- 交叉引用\n- 注释与重命名\n- 结构体定义\n\n4.2 Ghidra使用\n\n4.3 代码识别与分析\n\n- 函数识别\n- 字符串分析\n- 算法识别',
        pageCount: 80
      },
      {
        id: 'ch5',
        title: '第五章 动态调试',
        content: '5.1 OllyDbg/x64dbg\n\n- 断点设置\n- 单步执行\n- 内存查看\n- 寄存器修改\n- 插件使用\n\n5.2 WinDbg\n\n5.3 GDB调试\n\n5.4 反调试技术',
        pageCount: 70
      },
      {
        id: 'ch6',
        title: '第六章 加壳与脱壳',
        content: '6.1 壳的原理\n\n6.2 常见加壳工具\n\nUPX、ASPack、Themida、VMProtect\n\n6.3 脱壳技术\n\n- 单步跟踪法\n- ESP定律\n- 内存镜像法\n\n6.4 自动脱壳工具',
        pageCount: 50
      },
      {
        id: 'ch7',
        title: '第七章 恶意代码分析',
        content: '7.1 恶意软件分类\n\n7.2 静态分析方法\n\n7.3 动态分析方法\n\n7.4 沙箱分析\n\n7.5 逆向分析实例',
        pageCount: 65
      },
      {
        id: 'ch8',
        title: '第八章 漏洞挖掘',
        content: '8.1 漏洞类型\n\n- 缓冲区溢出\n- 格式化字符串\n- 整数溢出\n- Use-After-Free\n- 堆溢出\n\n8.2 Fuzzing技术\n\n8.3 漏洞利用开发',
        pageCount: 60
      }
    ]
  },
  {
    id: 'web-security-deep-dive',
    title: 'Web安全深度剖析',
    author: 'Web安全研究组',
    category: 'Web安全',
    cover: 'Web',
    description: '深入解析Web安全原理，从HTTP协议到浏览器安全，全面掌握Web攻防技术。',
    pages: 480,
    difficulty: '进阶',
    publishYear: 2024,
    tags: ['Web安全', 'HTTP', '浏览器安全', '漏洞挖掘'],
    rating: 4.9,
    readers: 18760,
    targetAudience: 'Web安全工程师、开发工程师、安全研究员',
    prerequisites: ['Web开发基础', '网络安全基础'],
    highlights: [
      'HTTP协议安全',
      '浏览器安全原理',
      'OWASP Top 10详解',
      '现代Web防御技术'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 HTTP协议安全',
        content: '1.1 HTTP协议基础\n\n请求方法、状态码、请求头、响应头\n\n1.2 HTTPS原理\n\nTLS握手、证书验证、前向保密\n\n1.3 HTTP/2与HTTP/3\n\n新特性与安全影响\n\n1.4 Cookie与Session安全\n\n- Cookie属性：Secure、HttpOnly、SameSite\n- Session劫持与防护\n- JWT安全',
        pageCount: 50
      },
      {
        id: 'ch2',
        title: '第二章 浏览器安全',
        content: '2.1 同源策略\n\n- 同源策略定义\n- 跨域限制\n- 跨域方案：CORS、JSONP、代理\n\n2.2 浏览器安全沙箱\n\n2.3 XSS防护机制\n\n- Content Security Policy (CSP)\n- XSS Auditor\n- 输入输出编码\n\n2.4 点击劫持防护\n\nX-Frame-Options、frame-ancestors\n\n2.5 混合内容问题',
        pageCount: 55
      },
      {
        id: 'ch3',
        title: '第三章 SQL注入深度解析',
        content: '3.1 SQL注入原理\n\n3.2 注入类型\n\n- 联合查询注入\n- 报错注入\n- 布尔盲注\n- 时间盲注\n- 堆叠查询\n- 宽字节注入\n- 二次注入\n\n3.3 各数据库注入技巧\n\nMySQL、MSSQL、Oracle、PostgreSQL、SQLite\n\n3.4 绕过WAF\n\n3.5 SQL注入防护\n\n- 参数化查询\n- 输入验证\n- ORM安全使用\n- WAF部署',
        pageCount: 70
      },
      {
        id: 'ch4',
        title: '第四章 XSS跨站脚本攻击',
        content: '4.1 XSS类型\n\n- 反射型XSS\n- 存储型XSS\n- DOM型XSS\n- 自我XSS\n- Mutated XSS\n\n4.2 XSS利用技术\n\n- Cookie窃取\n- 钓鱼攻击\n- 键盘记录\n- 浏览器指纹\n- CSRF配合\n- BeEF框架使用\n\n4.3 XSS绕过技巧\n\n- 标签过滤绕过\n- 事件处理器\n- 编码绕过\n- DOM XSS技巧\n\n4.4 XSS防护\n\n- 输入验证\n- 输出编码\n- CSP策略\n- HttpOnly Cookie',
        pageCount: 75
      },
      {
        id: 'ch5',
        title: '第五章 SSRF与文件上传',
        content: '5.1 SSRF服务器端请求伪造\n\n- SSRF原理\n- 利用场景\n- 内网探测\n- 云环境利用\n- 绕过技巧\n- SSRF防护\n\n5.2 文件上传漏洞\n\n- 前端验证绕过\n- MIME类型绕过\n- 扩展名绕过\n- .htaccess利用\n- 解析漏洞\n- 文件上传防护',
        pageCount: 55
      },
      {
        id: 'ch6',
        title: '第六章 业务逻辑漏洞',
        content: '6.1 业务逻辑漏洞概述\n\n6.2 常见业务逻辑漏洞\n\n- 越权访问（水平越权、垂直越权）\n- 支付漏洞\n- 验证码绕过\n- 密码找回漏洞\n- 批量注册\n- 条件竞争\n\n6.3 业务逻辑漏洞挖掘思路\n\n6.4 防护措施',
        pageCount: 50
      },
      {
        id: 'ch7',
        title: '第七章 现代Web安全',
        content: '7.1 API安全\n\nREST API安全、GraphQL安全\n\n7.2 JWT安全\n\nJWT结构、常见漏洞、安全使用\n\n7.3 OAuth安全\n\nOAuth 2.0流程、常见漏洞\n\n7.4 SAML安全\n\n7.5 WebSocket安全\n\n7.6 前端框架安全\n\nReact、Vue、Angular安全问题',
        pageCount: 60
      },
      {
        id: 'ch8',
        title: '第八章 Web安全防御体系',
        content: '8.1 安全开发生命周期（SDL）\n\n8.2 WAF应用防火墙\n\n8.3 代码审计\n\n8.4 安全测试\n\n8.5 漏洞响应流程',
        pageCount: 45
      }
    ]
  },
  {
    id: 'linux-security-hardening',
    title: 'Linux安全加固实战',
    author: 'Linux安全团队',
    category: '系统安全',
    cover: 'Linux',
    description: '全面的Linux系统安全加固指南，从内核到应用，构建稳固的Linux安全防线。',
    pages: 350,
    difficulty: '进阶',
    publishYear: 2024,
    tags: ['Linux', '系统加固', '安全基线', '运维安全'],
    rating: 4.7,
    readers: 14500,
    targetAudience: '系统运维工程师、安全工程师',
    prerequisites: ['Linux基础操作'],
    highlights: [
      'Linux安全基线',
      '内核安全参数',
      '入侵检测系统',
      '日志审计与分析'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 Linux安全概述',
        content: '1.1 Linux安全模型\n\n1.2 用户与权限\n\n1.3 安全加固原则\n\n最小权限原则、纵深防御\n\n1.4 安全基线标准\n\nCIS Benchmark、等保要求',
        pageCount: 30
      },
      {
        id: 'ch2',
        title: '第二章 账户与权限安全',
        content: '2.1 用户管理\n\n- 账户策略\n- 密码策略\n- 账户锁定\n- 闲置会话超时\n\n2.2 sudo配置\n\n- sudoers文件详解\n- 最小权限配置\n- sudo日志\n\n2.3 文件权限\n\n- 基本权限（rwx）\n- 特殊权限（SUID、SGID、Sticky）\n- ACL访问控制列表\n- umask配置\n\n2.4 PAM认证模块',
        pageCount: 50
      },
      {
        id: 'ch3',
        title: '第三章 系统服务安全',
        content: '3.1 服务最小化\n\n关闭不必要的服务\n\n3.2 SSH安全加固\n\n- 禁止root登录\n- 密钥登录\n- 端口修改\n- 失败锁定\n- fail2ban部署\n\n3.3 防火墙配置\n\niptables、firewalld、ufw\n\n3.4 内核参数加固\n\nsysctl.conf安全配置',
        pageCount: 55
      },
      {
        id: 'ch4',
        title: '第四章 文件系统安全',
        content: '4.1 磁盘加密\n\nLUKS、eCryptfs\n\n4.2 文件完整性检查\n\nAIDE、tripwire\n\n4.3 日志文件系统\n\n4.4 挂载选项安全\n\nnoexec、nosuid、nodev\n\n4.5 敏感文件保护',
        pageCount: 40
      },
      {
        id: 'ch5',
        title: '第五章 日志与审计',
        content: '5.1 syslog/rsyslog\n\n5.2 日志集中收集\n\n5.3 auditd审计系统\n\n5.4 日志分析工具\n\n5.5 日志轮转',
        pageCount: 45
      },
      {
        id: 'ch6',
        title: '第六章 入侵检测',
        content: '6.1 HIDS主机入侵检测\n\nOSSEC、Samhain\n\n6.2 Rootkit检测\n\nrkhunter、chkrootkit\n\n6.3 异常监控\n\n6.4 应急响应',
        pageCount: 45
      },
      {
        id: 'ch7',
        title: '第七章 应用安全',
        content: '7.1 Web服务器加固\n\nNginx、Apache安全配置\n\n7.2 数据库安全\n\nMySQL、PostgreSQL加固\n\n7.3 Docker容器安全\n\n7.4 Kubernetes安全',
        pageCount: 50
      },
      {
        id: 'ch8',
        title: '第八章 安全运维',
        content: '8.1 补丁管理\n\n8.2 备份与恢复\n\n8.3 安全监控\n\n8.4 应急响应流程',
        pageCount: 35
      }
    ]
  },
  {
    id: 'digital-forensics',
    title: '数字取证技术',
    author: '取证技术实验室',
    category: '网络攻防',
    cover: '取证',
    description: '专业的数字取证技术指南，涵盖磁盘取证、内存取证、网络取证、移动设备取证。',
    pages: 420,
    difficulty: '进阶',
    publishYear: 2024,
    tags: ['数字取证', '电子证据', '司法鉴定', '应急响应'],
    rating: 4.6,
    readers: 7800,
    targetAudience: '取证工程师、网安警察、应急响应人员',
    prerequisites: ['操作系统基础', '网络基础'],
    highlights: [
      '电子证据链',
      '磁盘取证技术',
      '内存取证分析',
      '取证报告撰写'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 数字取证概述',
        content: '1.1 数字取证定义\n\n1.2 取证原则\n\n- 证据完整性\n- 取证合法性\n- 过程可追溯\n\n1.3 证据链\n\n1.4 取证标准与规范\n\n1.5 取证工具介绍\n\nFTK、EnCase、Autopsy、X-Ways Forensics',
        pageCount: 35
      },
      {
        id: 'ch2',
        title: '第二章 磁盘取证',
        content: '2.1 磁盘结构\n\nMBR、GPT、分区表\n\n2.2 文件系统\n\nNTFS、FAT32、ext4\n\n2.3 证据获取\n\n- 磁盘镜像\n- 写保护\n- 哈希校验\n\n2.4 数据分析\n\n- 文件恢复\n- 删除文件分析\n- 未分配空间分析\n- 注册表分析\n\n2.5 时间线分析',
        pageCount: 65
      },
      {
        id: 'ch3',
        title: '第三章 内存取证',
        content: '3.1 内存取证基础\n\n3.2 内存镜像获取\n\n3.3 Volatility框架\n\n- 进程分析\n- 网络连接分析\n- DLL注入检测\n- Rootkit检测\n- 密码提取\n\n3.4 内存取证实战',
        pageCount: 60
      },
      {
        id: 'ch4',
        title: '第四章 网络取证',
        content: '4.1 网络流量获取\n\n4.2 Wireshark分析\n\n4.3 协议分析\n\n4.4 入侵证据提取\n\n4.5 网络时间线',
        pageCount: 55
      },
      {
        id: 'ch5',
        title: '第五章 Windows取证',
        content: '5.1 Windows系统结构\n\n5.2 注册表取证\n\n5.3 事件日志分析\n\n5.4 Prefetch分析\n\n5.5 Jump List分析\n\n5.6 浏览器历史分析',
        pageCount: 60
      },
      {
        id: 'ch6',
        title: '第六章 移动设备取证',
        content: '6.1 Android取证\n\n6.2 iOS取证\n\n6.3 应用数据分析\n\n6.4 云数据获取',
        pageCount: 50
      },
      {
        id: 'ch7',
        title: '第七章 恶意代码取证',
        content: '7.1 恶意软件分析\n\n7.2 感染痕迹提取\n\n7.3 持久化机制分析\n\n7.4 C2通信分析',
        pageCount: 45
      },
      {
        id: 'ch8',
        title: '第八章 取证报告',
        content: '8.1 报告结构\n\n8.2 证据展示\n\n8.3 鉴定意见\n\n8.4 出庭作证',
        pageCount: 35
      }
    ]
  },
  {
    id: 'cloud-security-guide',
    title: '云安全实战指南',
    author: '云安全研究团队',
    category: '云安全',
    cover: '云安全',
    description: '全面覆盖AWS、Azure、阿里云等主流云平台安全配置与最佳实践。',
    pages: 400,
    difficulty: '进阶',
    publishYear: 2024,
    tags: ['云安全', 'AWS', '阿里云', '容器安全'],
    rating: 4.7,
    readers: 11200,
    targetAudience: '云运维工程师、安全工程师、云架构师',
    prerequisites: ['云计算基础', '网络安全基础'],
    highlights: [
      '云安全责任共担模型',
      'IAM身份与访问管理',
      '容器安全与K8s安全',
      '云安全合规审计'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 云安全概述',
        content: '1.1 云计算基础\n\nIaaS、PaaS、SaaS\n\n1.2 云安全责任共担模型\n\n1.3 云安全挑战\n\n1.4 云原生安全\n\n1.5 主流云平台介绍\n\nAWS、Azure、GCP、阿里云、腾讯云',
        pageCount: 35
      },
      {
        id: 'ch2',
        title: '第二章 IAM身份与访问管理',
        content: '2.1 IAM基础概念\n\n用户、组、角色、策略\n\n2.2 最小权限原则\n\n2.3 MFA多因素认证\n\n2.4 联邦身份认证\n\n2.5 权限审计\n\n2.6 各云平台IAM实践',
        pageCount: 55
      },
      {
        id: 'ch3',
        title: '第三章 网络安全',
        content: '3.1 VPC安全\n\n- 安全组\n- 网络ACL\n- VPC peering\n- 私有子网\n\n3.2 DDoS防护\n\n3.3 WAF部署\n\n3.4 CDN安全\n\n3.5 混合云网络安全',
        pageCount: 50
      },
      {
        id: 'ch4',
        title: '第四章 数据安全',
        content: '4.1 云存储安全\n\n- 对象存储安全配置\n- 存储桶策略\n- 数据加密\n\n4.2 数据库安全\n\nRDS安全配置、数据库审计\n\n4.3 密钥管理\n\nKMS、密钥轮换\n\n4.4 数据泄露防护',
        pageCount: 55
      },
      {
        id: 'ch5',
        title: '第五章 容器安全',
        content: '5.1 Docker安全\n\n- 镜像安全\n- 容器运行时安全\n- Docker Bench for Security\n\n5.2 Kubernetes安全\n\n- RBAC配置\n- Pod安全策略\n- Network Policy\n- 准入控制\n\n5.3 容器镜像扫描\n\n5.4 容器运行时防护',
        pageCount: 60
      },
      {
        id: 'ch6',
        title: '第六章 云安全监控',
        content: '6.1 日志收集与分析\n\nCloudTrail、CloudWatch、阿里云日志服务\n\n6.2 安全监控告警\n\n6.3 云安全态势管理（CSPM）\n\n6.4 云工作负载保护（CWPP）',
        pageCount: 45
      },
      {
        id: 'ch7',
        title: '第七章 云安全合规',
        content: '7.1 等保2.0云安全要求\n\n7.2 云合规标准\n\n7.3 云安全评估\n\n7.4 云渗透测试',
        pageCount: 40
      },
      {
        id: 'ch8',
        title: '第八章 云安全最佳实践',
        content: '8.1 安全左移\n\n8.2 DevSecOps\n\n8.3 自动化安全检查\n\n8.4 云安全架构设计',
        pageCount: 40
      }
    ]
  },
  {
    id: 'soc-operations-guide',
    title: 'SOC安全运营实战',
    author: '安全运营中心',
    category: '安全运营',
    cover: 'SOC',
    description: '从零到一搭建安全运营中心，掌握SIEM、威胁检测、应急响应核心技能。',
    pages: 380,
    difficulty: '高级',
    publishYear: 2024,
    tags: ['SOC', 'SIEM', '安全运营', '威胁检测'],
    rating: 4.8,
    readers: 8900,
    targetAudience: 'SOC分析师、安全运营工程师、安全管理者',
    prerequisites: ['网络安全基础', '系统运维基础'],
    highlights: [
      'SOC建设方法论',
      'SIEM部署与规则编写',
      '威胁检测实战',
      '安全运营指标体系'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 SOC概述',
        content: '1.1 什么是SOC\n\n1.2 SOC的定位与价值\n\n1.3 SOC建设阶段\n\n1.4 SOC团队组织架构\n\n1.5 SOC能力成熟度模型',
        pageCount: 30
      },
      {
        id: 'ch2',
        title: '第二章 SIEM安全信息与事件管理',
        content: '2.1 SIEM基础概念\n\n2.2 主流SIEM产品\n\nSplunk、Elastic Security、QRadar、奇安信、深信服\n\n2.3 日志收集架构\n\n2.4 日志规范化\n\n2.5 关联分析引擎',
        pageCount: 55
      },
      {
        id: 'ch3',
        title: '第三章 威胁检测',
        content: '3.1 威胁检测方法\n\n- 特征检测\n- 异常检测\n- 行为分析\n- 威胁情报\n\n3.2 MITRE ATT&CK框架\n\n3.3 检测规则编写\n\nSigma规则、Splunk SPL\n\n3.4 误报处理与调优',
        pageCount: 60
      },
      {
        id: 'ch4',
        title: '第四章 威胁情报',
        content: '4.1 威胁情报概述\n\n4.2 情报来源\n\n4.3 STIX/TAXII标准\n\n4.4 威胁情报应用\n\n4.5 IOC管理',
        pageCount: 40
      },
      {
        id: 'ch5',
        title: '第五章 安全事件响应',
        content: '5.1 事件分级\n\n5.2 响应流程\n\n5.3 工单系统\n\n5.4 升级机制\n\n5.5 闭环管理',
        pageCount: 45
      },
      {
        id: 'ch6',
        title: '第六章 SOAR安全编排自动化',
        content: '6.1 SOAR概念\n\n6.2 剧本（Playbook）设计\n\n6.3 自动化响应\n\n6.4 主流SOAR平台',
        pageCount: 40
      },
      {
        id: 'ch7',
        title: '第七章 SOC运营管理',
        content: '7.1 运营指标（KPI/KRI）\n\n7.2 值班制度\n\n7.3 培训与考核\n\n7.4 红蓝对抗\n\n7.5 持续改进',
        pageCount: 50
      },
      {
        id: 'ch8',
        title: '第八章 实战案例',
        content: '8.1 勒索病毒事件处置\n\n8.2 网页篡改事件\n\n8.3 数据泄露事件\n\n8.4 APT攻击检测',
        pageCount: 40
      }
    ]
  },
  {
    id: 'malware-analysis',
    title: '恶意代码分析实战',
    author: '恶意代码分析组',
    category: '二进制安全',
    cover: '恶意代码',
    description: '系统化的恶意代码分析教程，从基础静态分析到高级动态分析，全面掌握恶意软件分析技能。',
    pages: 560,
    difficulty: '高级',
    publishYear: 2024,
    tags: ['恶意代码', '病毒分析', '逆向工程', '沙箱'],
    rating: 4.9,
    readers: 6700,
    targetAudience: '恶意代码分析师、逆向工程师、安全研究员',
    prerequisites: ['逆向工程基础', '汇编语言', '操作系统原理'],
    highlights: [
      '恶意代码分类与行为',
      '静态分析技术',
      '动态分析技术',
      '高级反分析技术对抗'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 恶意代码概述',
        content: '1.1 恶意代码历史\n\n1.2 恶意代码分类\n\n- 病毒（Virus）\n- 蠕虫（Worm）\n- 木马（Trojan）\n- 勒索软件（Ransomware）\n- 间谍软件（Spyware）\n- 僵尸网络（Botnet）\n- Rootkit\n- 广告软件\n\n1.3 攻击链模型\n\n1.4 分析环境搭建',
        pageCount: 35
      },
      {
        id: 'ch2',
        title: '第二章 静态分析基础',
        content: '2.1 文件类型识别\n\n2.2 字符串分析\n\n2.3 加壳检测\n\n2.4 PE结构分析\n\n2.5 导入导出表分析\n\n2.6 资源节分析\n\n2.7 静态分析工具\n\nPEiD、Dependency Walker、Resource Hacker',
        pageCount: 55
      },
      {
        id: 'ch3',
        title: '第三章 动态分析基础',
        content: '3.1 分析环境\n\n虚拟机、沙箱\n\n3.2 进程监控\n\nProcess Explorer、Process Monitor\n\n3.3 网络监控\n\nWireshark、TCPView、Fakenet\n\n3.4 文件系统监控\n\n3.5 注册表监控\n\n3.6 沙箱分析\n\nCuckoo Sandbox、Joe Sandbox、微步云沙箱',
        pageCount: 60
      },
      {
        id: 'ch4',
        title: '第四章 逆向分析进阶',
        content: '4.1 IDA Pro高级技巧\n\n4.2 动态调试\n\nx64dbg、WinDbg\n\n4.3 代码分析方法\n\n- 函数识别\n- 算法识别\n- 字符串解密\n\n4.4 恶意代码常见模式',
        pageCount: 65
      },
      {
        id: 'ch5',
        title: '第五章 反分析技术',
        content: '5.1 反调试技术\n\n- 检测调试器\n- 时间检查\n- 异常处理\n\n5.2 反虚拟机技术\n\nVMware、VirtualBox检测与绕过\n\n5.3 代码混淆\n\n- 控制流混淆\n- 字符串加密\n- 花指令\n\n5.4 加壳与脱壳',
        pageCount: 60
      },
      {
        id: 'ch6',
        title: '第六章 恶意代码行为分析',
        content: '6.1 持久化机制\n\n- 注册表\n- 计划任务\n- 服务\n- 驱动加载\n\n6.2 网络通信\n\n- C2通信\n- 协议分析\n- DGA域名生成算法\n\n6.3 数据窃取\n\n6.4 横向移动\n\n6.5 勒索软件分析',
        pageCount: 70
      },
      {
        id: 'ch7',
        title: '第七章 高级恶意代码',
        content: '7.1 Rootkit分析\n\n7.2 Bootkit分析\n\n7.3 无文件恶意代码\n\n7.4 APT恶意代码分析\n\n7.5 移动恶意代码',
        pageCount: 65
      },
      {
        id: 'ch8',
        title: '第八章 恶意代码分析报告',
        content: '8.1 报告结构\n\n8.2 IOC提取\n\n8.3 样本分析\n\n8.4 防护建议',
        pageCount: 35
      }
    ]
  },
  {
    id: 'red-team-hw',
    title: '护网红队实战指南',
    author: '红队攻防实验室',
    category: '护网红队',
    cover: '红队',
    description: '专业的护网红队攻击演练全流程指南，涵盖信息收集、漏洞利用、横向移动、权限维持，真实还原APT攻击手法。',
    pages: 580,
    difficulty: '高级',
    publishYear: 2024,
    tags: ['护网', '红队', 'APT', '横向移动', '权限维持'],
    rating: 4.9,
    readers: 8500,
    targetAudience: '红队队员、渗透测试工程师、安全研究员',
    prerequisites: ['渗透测试基础', '内网渗透经验', 'Windows/Linux系统精通'],
    folder: '护网红队实战指南',
    highlights: [
      '护网演练规则与评分标准',
      '红队攻击链全流程',
      'ATT&CK框架实战',
      '0day漏洞利用',
      '横向移动与权限维持',
      '红队工具开发'
    ],
    chapters: [
      { id: 'ch1', title: '第一章 什么是红队？', fileName: 'ch01-什么是红队.md', pageCount: 45 },
      { id: 'ch2', title: '第二章 红队作战地图', fileName: 'ch02-红队作战地图.md', pageCount: 50 },
      { id: 'ch3', title: '第三章 前期侦察', fileName: 'ch03-前期侦察.md', pageCount: 65 },
      { id: 'ch4', title: '第四章 C2基础设施搭建', fileName: 'ch04-C2基础设施搭建.md', pageCount: 60 },
      { id: 'ch5', title: '第五章 外网打点', fileName: 'ch05-外网打点.md', pageCount: 70 },
      { id: 'ch6', title: '第六章 钓鱼实战', fileName: 'ch06-钓鱼实战.md', pageCount: 55 },
      { id: 'ch7', title: '第七章 初次访问控制', fileName: 'ch07-初次访问控制.md', pageCount: 65 },
      { id: 'ch8', title: '第八章 内网信息收集', fileName: 'ch08-内网信息收集.md', pageCount: 60 },
      { id: 'ch9', title: '第九章 横向移动', fileName: 'ch09-横向移动.md', pageCount: 70 },
      { id: 'ch10', title: '第十章 域渗透实战', fileName: 'ch10-域渗透实战.md', pageCount: 75 },
      { id: 'ch11', title: '第十一章 权限维持', fileName: 'ch11-权限维持.md', pageCount: 60 },
      { id: 'ch12', title: '第十二章 近源渗透', fileName: 'ch12-近源渗透.md', pageCount: 50 },
      { id: 'ch13', title: '第十三章 免杀与痕迹清理', fileName: 'ch13-免杀与痕迹清理.md', pageCount: 70 },
      { id: 'ch14', title: '第十四章 蓝队视角', fileName: 'ch14-蓝队视角.md', pageCount: 55 },
      { id: 'ch15', title: '第十五章 红队报告与复盘', fileName: 'ch15-红队报告与复盘.md', pageCount: 50 },
      { id: 'ch16', title: '第十六章 综合实战案例', fileName: 'ch16-综合实战案例.md', pageCount: 80 },
    ]
  },
  {
    id: 'blue-team-hw',
    title: '护网蓝队防守指南',
    author: '蓝队防御中心',
    category: '护网蓝队',
    cover: '蓝队',
    description: '全面的护网蓝队防守实战指南，从基础概念到高阶实战，涵盖防守体系建设、监测预警、入侵检测、威胁狩猎、应急响应、溯源分析，助你构建坚不可摧的纵深防御体系。',
    pages: 680,
    difficulty: '高级',
    publishYear: 2024,
    tags: ['护网', '蓝队', '防守', '入侵检测', '应急响应', '溯源', '威胁狩猎'],
    rating: 4.9,
    readers: 9200,
    targetAudience: '蓝队队员、安全运营工程师、应急响应人员、安全管理者',
    prerequisites: ['网络安全基础', '系统运维基础', '安全运营基础'],
    folder: '护网蓝队防守指南',
    highlights: [
      '护网防守体系建设方法论',
      '全方位监测预警体系',
      '入侵检测与深度分析',
      '威胁狩猎实战技巧',
      '应急响应全流程指南',
      '溯源分析与攻击者画像',
      '红队视角的防守思维',
      '蓝队职业成长路径'
    ],
    chapters: [
      { id: 'ch1', title: '第一章 什么是蓝队？', fileName: 'ch01-什么是蓝队.md', pageCount: 45 },
      { id: 'ch2', title: '第二章 防守体系建设', fileName: 'ch02-防守体系建设.md', pageCount: 55 },
      { id: 'ch3', title: '第三章 资产梳理与风险评估', fileName: 'ch03-资产梳理与风险评估.md', pageCount: 50 },
      { id: 'ch4', title: '第四章 安全加固与基线', fileName: 'ch04-安全加固与基线.md', pageCount: 60 },
      { id: 'ch5', title: '第五章 监测预警体系', fileName: 'ch05-监测预警体系.md', pageCount: 65 },
      { id: 'ch6', title: '第六章 日志与SIEM', fileName: 'ch06-日志与SIEM.md', pageCount: 55 },
      { id: 'ch7', title: '第七章 入侵检测分析', fileName: 'ch07-入侵检测分析.md', pageCount: 65 },
      { id: 'ch8', title: '第八章 威胁情报与威胁狩猎', fileName: 'ch08-威胁情报与威胁狩猎.md', pageCount: 60 },
      { id: 'ch9', title: '第九章 漏洞管理与补丁', fileName: 'ch09-漏洞管理与补丁.md', pageCount: 50 },
      { id: 'ch10', title: '第十章 终端安全与EDR', fileName: 'ch10-终端安全与EDR.md', pageCount: 55 },
      { id: 'ch11', title: '第十一章 护网值守与研判', fileName: 'ch11-护网值守与研判.md', pageCount: 50 },
      { id: 'ch12', title: '第十二章 应急响应实战', fileName: 'ch12-应急响应实战.md', pageCount: 65 },
      { id: 'ch13', title: '第十三章 溯源分析技术', fileName: 'ch13-溯源分析技术.md', pageCount: 55 },
      { id: 'ch14', title: '第十四章 红队视角 —— 知己知彼', fileName: 'ch14-红队视角.md', pageCount: 45 },
      { id: 'ch15', title: '第十五章 蓝队报告与复盘', fileName: 'ch15-蓝队报告与复盘.md', pageCount: 40 },
      { id: 'ch16', title: '第十六章 蓝队成长之路', fileName: 'ch16-蓝队成长之路.md', pageCount: 35 },
    ]
  },
  {
    id: 'red-blue-attack-defense',
    title: '红蓝攻防-构建实战化网络安全防御体系',
    author: '红蓝攻防研究中心',
    category: '护网红队',
    cover: '攻防',
    description: '从红蓝攻防视角全面讲解实战化网络安全防御体系建设，涵盖ATT&CK框架、攻击链、资产风险管理、监测检测、威胁狩猎、应急响应、威胁情报、态势感知、安全运营，帮你从零到一构建真正能打仗的防御体系。',
    pages: 650,
    difficulty: '高级',
    publishYear: 2024,
    tags: ['红蓝对抗', '实战化防御', 'ATT&CK', '威胁狩猎', '应急响应', '态势感知', '安全运营'],
    rating: 4.9,
    readers: 7800,
    targetAudience: '安全负责人、安全运营工程师、红蓝队队员、企业安全架构师',
    prerequisites: ['网络安全基础', '渗透测试基础', '安全运营基础'],
    folder: '红蓝攻防-构建实战化网络安全防御体系',
    highlights: [
      '红蓝攻防核心概念与价值',
      'MITRE ATT&CK框架与杀伤链',
      '攻击者视角全流程解析',
      '实战化防御体系六大支柱',
      '威胁狩猎与态势感知落地',
      '红蓝对抗实战演练方法论',
      '安全运营与人员能力建设',
      '五阶段落地路线图'
    ],
    chapters: [
      { id: 'ch1', title: '第一章 什么是红蓝攻防？', fileName: 'ch01-什么是红蓝攻防.md', pageCount: 45 },
      { id: 'ch2', title: '第二章 实战化防御体系概述', fileName: 'ch02-实战化防御体系概述.md', pageCount: 50 },
      { id: 'ch3', title: '第三章 ATT&CK框架与杀伤链', fileName: 'ch03-ATTACK框架与杀伤链.md', pageCount: 60 },
      { id: 'ch4', title: '第四章 红蓝对抗的组织与流程', fileName: 'ch04-红蓝对抗的组织与流程.md', pageCount: 45 },
      { id: 'ch5', title: '第五章 攻击者视角：外网打点', fileName: 'ch05-攻击者视角-外网打点.md', pageCount: 65 },
      { id: 'ch6', title: '第六章 攻击者视角：内网渗透', fileName: 'ch06-攻击者视角-内网渗透.md', pageCount: 70 },
      { id: 'ch7', title: '第七章 攻击者视角：权限维持', fileName: 'ch07-攻击者视角-权限维持.md', pageCount: 60 },
      { id: 'ch8', title: '第八章 攻击者视角：数据窃取与痕迹清理', fileName: 'ch08-攻击者视角-数据窃取与痕迹清理.md', pageCount: 55 },
      { id: 'ch9', title: '第九章 防御体系：资产与风险管理', fileName: 'ch09-防御体系-资产与风险管理.md', pageCount: 60 },
      { id: 'ch10', title: '第十章 防御体系：监测与检测', fileName: 'ch10-防御体系-监测与检测.md', pageCount: 65 },
      { id: 'ch11', title: '第十一章 防御体系：威胁狩猎', fileName: 'ch11-防御体系-威胁狩猎.md', pageCount: 55 },
      { id: 'ch12', title: '第十二章 防御体系：应急响应', fileName: 'ch12-防御体系-应急响应.md', pageCount: 65 },
      { id: 'ch13', title: '第十三章 威胁情报与态势感知', fileName: 'ch13-威胁情报与态势感知.md', pageCount: 50 },
      { id: 'ch14', title: '第十四章 红蓝对抗实战演练', fileName: 'ch14-红蓝对抗实战演练.md', pageCount: 55 },
      { id: 'ch15', title: '第十五章 安全运营与人员能力', fileName: 'ch15-安全运营与人员能力.md', pageCount: 50 },
      { id: 'ch16', title: '第十六章 实战化防御体系的落地之路', fileName: 'ch16-实战化防御体系的落地之路.md', pageCount: 45 },
    ]
  },
  {
    id: 'kali-linux-pentest',
    title: 'Kali Linux渗透测试全流程详解',
    author: '渗透测试研究中心',
    category: '护网红队',
    cover: 'Kali',
    description: '从零开始系统学习Kali Linux渗透测试，涵盖环境搭建、信息收集、漏洞扫描、Web渗透、系统漏洞利用、密码攻击、内网渗透、后渗透、社工、无线渗透、报告撰写，16章完整渗透测试全流程，通俗易懂，实战性强。',
    pages: 680,
    difficulty: '进阶',
    publishYear: 2024,
    tags: ['Kali', '渗透测试', 'Web渗透', '内网渗透', 'Metasploit', '后渗透', '社会工程学'],
    rating: 4.9,
    readers: 9200,
    targetAudience: '渗透测试工程师、安全运维人员、网络安全爱好者、红蓝队队员',
    prerequisites: ['网络安全基础', '操作系统基础'],
    folder: 'Kali Linux渗透测试全流程详解',
    highlights: [
      'Kali Linux环境搭建与基础操作',
      '信息收集与漏洞扫描全流程',
      'Web渗透测试八大核心漏洞详解',
      'Metasploit从入门到精通',
      '密码攻击与哈希破解实战',
      '内网横向移动与域渗透',
      '后渗透提权、持久化、痕迹清理',
      '社会工程学与无线渗透',
      '渗透测试报告撰写指南',
      '完整实战案例贯穿全书'
    ],
    chapters: [
      { id: 'ch1', title: '第一章 什么是Kali Linux？', fileName: 'ch01-什么是Kali Linux.md', pageCount: 40 },
      { id: 'ch2', title: '第二章 Kali Linux环境搭建', fileName: 'ch02-Kali Linux环境搭建.md', pageCount: 45 },
      { id: 'ch3', title: '第三章 信息收集', fileName: 'ch03-信息收集.md', pageCount: 55 },
      { id: 'ch4', title: '第四章 漏洞扫描', fileName: 'ch04-漏洞扫描.md', pageCount: 50 },
      { id: 'ch5', title: '第五章 Web应用渗透测试（上）', fileName: 'ch05-Web应用渗透测试-上.md', pageCount: 65 },
      { id: 'ch6', title: '第六章 Web应用渗透测试（下）', fileName: 'ch06-Web应用渗透测试-下.md', pageCount: 60 },
      { id: 'ch7', title: '第七章 系统漏洞利用与Metasploit', fileName: 'ch07-系统漏洞利用与Metasploit.md', pageCount: 65 },
      { id: 'ch8', title: '第八章 密码攻击', fileName: 'ch08-密码攻击.md', pageCount: 55 },
      { id: 'ch9', title: '第九章 后渗透 —— 信息收集与提权', fileName: 'ch09-后渗透-信息收集与提权.md', pageCount: 60 },
      { id: 'ch10', title: '第十章 内网渗透 —— 横向移动', fileName: 'ch10-内网渗透-横向移动.md', pageCount: 70 },
      { id: 'ch11', title: '第十一章 权限维持与持久化', fileName: 'ch11-权限维持与持久化.md', pageCount: 55 },
      { id: 'ch12', title: '第十二章 痕迹清理与反取证', fileName: 'ch12-痕迹清理与反取证.md', pageCount: 50 },
      { id: 'ch13', title: '第十三章 社会工程学攻击', fileName: 'ch13-社会工程学攻击.md', pageCount: 55 },
      { id: 'ch14', title: '第十四章 无线网络渗透测试', fileName: 'ch14-无线网络渗透测试.md', pageCount: 50 },
      { id: 'ch15', title: '第十五章 渗透测试报告撰写', fileName: 'ch15-渗透测试报告撰写.md', pageCount: 45 },
      { id: 'ch16', title: '第十六章 综合实战案例', fileName: 'ch16-综合实战案例.md', pageCount: 60 },
    ]
  },
  {
    id: 'hw-purple-team',
    title: '护网紫队实战',
    author: '紫队评估中心',
    category: '护网红队',
    cover: '紫队',
    description: '护网紫队裁判与评估指南，红蓝对抗设计、效果评估、漏洞验证、安全度量体系建设。',
    pages: 380,
    difficulty: '高级',
    publishYear: 2024,
    tags: ['护网', '紫队', '评估', '红蓝对抗', '安全度量'],
    rating: 4.8,
    readers: 5600,
    targetAudience: '紫队队员、安全管理人员、安全评估师',
    prerequisites: ['红队技术', '蓝队技术', '安全评估基础'],
    highlights: [
      '红蓝对抗设计',
      '效果评估方法',
      '漏洞验证',
      '安全度量体系'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 紫队概述',
        content: '1.1 紫队定位\n\n紫队是红蓝对抗中的裁判和评估方，负责对抗设计、过程监督、效果评估和能力提升。\n\n1.2 紫队职责\n\n- 对抗方案设计\n- 规则制定\n- 过程监督\n- 效果评估\n- 能力改进\n\n1.3 紫队能力要求\n\n- 红队技术理解\n- 蓝队技术理解\n- 评估方法论\n- 数据分析能力',
        pageCount: 35
      },
      {
        id: 'ch2',
        title: '第二章 红蓝对抗设计',
        content: '2.1 对抗目标设定\n\n2.2 攻击场景设计\n\n2.3 防守目标设定\n\n2.4 评分标准制定\n\n2.5 对抗规则制定',
        pageCount: 50
      },
      {
        id: 'ch3',
        title: '第三章 对抗过程管理',
        content: '3.1 过程监督\n\n3.2 事件仲裁\n\n3.3 进度管理\n\n3.4 冲突处理',
        pageCount: 45
      },
      {
        id: 'ch4',
        title: '第四章 效果评估',
        content: '4.1 攻击效果评估\n\n4.2 防守效果评估\n\n4.3 检测能力评估\n\n4.4 响应能力评估\n\n4.5 整体安全能力评估',
        pageCount: 55
      },
      {
        id: 'ch5',
        title: '第五章 漏洞验证与复测',
        content: '5.1 漏洞验证方法\n\n5.2 漏洞复测\n\n5.3 修复验证\n\n5.4 风险评级',
        pageCount: 45
      },
      {
        id: 'ch6',
        title: '第六章 安全度量体系',
        content: '6.1 安全度量指标\n\n6.2 度量方法\n\n6.3 成熟度模型\n\n6.4 能力提升路线图',
        pageCount: 50
      },
      {
        id: 'ch7',
        title: '第七章 报告与复盘',
        content: '7.1 评估报告\n\n7.2 复盘会议\n\n7.3 改进建议\n\n7.4 持续改进',
        pageCount: 40
      }
    ]
  },
  // ========== 可下载验证书籍 ==========
  {
    id: 'white-hat-web-security',
    title: '白帽子讲Web安全（纪念版）',
    author: '吴翰清',
    category: 'Web安全',
    cover: '白帽',
    description: '互联网时代的数据安全与个人隐私受到前所未有的挑战，各种新奇的攻击技术层出不穷。黑客不再神秘，攻击技术原来如此，小网站也能找到适合自己的安全道路。',
    pages: 450,
    difficulty: '入门',
    publishYear: 2020,
    tags: ['Web安全', 'XSS', 'SQL注入', 'CSRF'],
    rating: 4.9,
    readers: 35000,
    targetAudience: 'Web安全入门者、前端开发工程师、安全工程师',
    prerequisites: ['计算机基础', 'Web开发基础'],
    highlights: [
      '18个Web安全核心章节',
      '浏览器安全详解',
      'XSS/CSRF/注入攻击深度剖析',
      '安全开发流程(SDL)'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 我的安全世界观',
        content: '1.1 安全本质\n\n安全问题的本质是信任问题。在设计安全方案时，我们需要考虑信任边界，明确哪些是可信的，哪些是不可信的。\n\n1.2 安全原则\n\n- 最小权限原则\n- 纵深防御原则\n- 数据与代码分离原则\n- 不可预测性原则\n\n1.3 安全评估\n\n安全评估的四个步骤：资产等级划分→威胁分析→风险分析→确认解决方案',
        pageCount: 25
      },
      {
        id: 'ch2',
        title: '第二章 浏览器安全',
        content: '2.1 同源策略\n\n同源策略是浏览器最核心的安全机制，限制了不同源之间的交互。\n\n2.2 浏览器沙箱\n\n浏览器的安全沙箱可以限制代码的执行权限，保护系统安全。\n\n2.3 恶意网站拦截\n\n浏览器会拦截恶意网站，保护用户安全。',
        pageCount: 26
      },
      {
        id: 'ch3',
        title: '第三章 跨站脚本攻击（XSS）',
        content: '3.1 XSS简介\n\nXSS是跨站脚本攻击，允许攻击者往Web页面里插入恶意Script代码。\n\n3.2 XSS分类\n\n- 反射型XSS：非持久化攻击\n- 存储型XSS：持久化攻击\n- DOM型XSS：基于DOM的攻击\n\n3.3 XSS攻击向量\n\n- <script>标签\n- 事件处理器\n- javascript:伪协议\n- SVG标签',
        pageCount: 40
      },
      {
        id: 'ch4',
        title: '第四章 跨站点请求伪造（CSRF）',
        content: '4.1 CSRF原理\n\nCSRF攻击者盗用用户的身份，以用户的名义发送恶意请求。\n\n4.2 CSRF攻击流程\n\n1. 用户登录受信任网站\n2. 攻击者诱导用户访问恶意网站\n3. 恶意网站发送请求到受信任网站\n4. 浏览器携带Cookie发送请求\n\n4.3 CSRF防御\n\n- 验证码\n- Token机制\n- Referer检查',
        pageCount: 35
      },
      {
        id: 'ch5',
        title: '第五章 点击劫持（ClickJacking）',
        content: '5.1 点击劫持原理\n\n攻击者使用透明iframe覆盖在网页上，诱导用户点击。\n\n5.2 防御措施\n\n- X-Frame-Options头\n- Frame Busting\n- CSP策略',
        pageCount: 30
      },
      {
        id: 'ch6',
        title: '第六章 HTML5安全',
        content: '6.1 新增标签风险\n\nHTML5引入了新的标签和属性，可能带来安全隐患。\n\n6.2 Web Storage\n\nlocalStorage和sessionStorage的安全问题。\n\n6.3 WebSocket\n\n双向通信的安全考虑。',
        pageCount: 35
      },
      {
        id: 'ch7',
        title: '第七章 注入攻击',
        content: '7.1 SQL注入\n\n攻击者通过在输入中注入SQL语句，达到获取数据或破坏系统的目的。\n\n7.2 注入检测与防御\n\n- 参数化查询\n- 输入过滤\n- 存储过程\n\n7.3 其他注入\n\n- LDAP注入\n- XML注入\n- 命令注入',
        pageCount: 40
      },
      {
        id: 'ch8',
        title: '第八章 文件上传漏洞',
        content: '8.1 文件上传原理\n\nWeb应用允许用户上传文件，可能被利用上传恶意文件。\n\n8.2 攻击方式\n\n- WebShell上传\n- 绕过上传限制\n- 解析漏洞利用\n\n8.3 防御措施\n\n- 文件类型检查\n- 文件内容检查\n- 权限控制',
        pageCount: 35
      },
      {
        id: 'ch9',
        title: '第九章 认证与会话管理',
        content: '9.1 认证方式\n\n- 密码认证\n- 证书认证\n- 生物认证\n- 多因素认证\n\n9.2 Session安全\n\n- Session fixation攻击\n- Session hijacking\n- Session Token保护\n\n9.3 最佳实践\n\n安全的会话管理策略。',
        pageCount: 35
      },
      {
        id: 'ch10',
        title: '第十章 访问控制',
        content: '10.1 访问控制模型\n\n- DAC自主访问控制\n- MAC强制访问控制\n- RBAC基于角色的访问控制\n\n10.2 垂直越权与水平越权\n\n越权访问的两种类型及防御。',
        pageCount: 30
      },
      {
        id: 'ch11',
        title: '第十一章 加密算法与随机数',
        content: '11.1 加密基础\n\n对称加密与非对称加密的区别与应用。\n\n11.2 安全加密实践\n\n- 密钥管理\n- 算法选择\n- 密码存储安全\n\n11.3 随机数安全\n\n伪随机数的安全问题。',
        pageCount: 40
      },
      {
        id: 'ch12',
        title: '第十二章 Web框架安全',
        content: '12.1 模板引擎安全\n\n模板引擎的XSS防护。\n\n12.2 框架安全特性\n\n主流框架的安全机制。\n\n12.3 Web API安全\n\nRESTful API的安全设计。',
        pageCount: 35
      },
      {
        id: 'ch13',
        title: '第十三章 应用层拒绝服务攻击',
        content: '13.1 DDoS原理\n\n分布式拒绝服务攻击的原理。\n\n13.2 应用层DDoS\n\n- CC攻击\n- 慢速连接攻击\n\n13.3 防御策略\n\n- 限流\n- 验证码\n- 分布式缓存',
        pageCount: 35
      },
      {
        id: 'ch14',
        title: '第十四章 PHP安全',
        content: '14.1 PHP安全配置\n\nphp.ini安全配置项。\n\n14.2 PHP安全函数\n\n- htmlspecialchars\n- addslashes\n- mysql_real_escape_string\n\n14.3 PHP框架安全\n\n主流PHP框架的安全实践。',
        pageCount: 40
      },
      {
        id: 'ch15',
        title: '第十五章 Web Server配置安全',
        content: '15.1 Apache安全配置\n\nApache安全配置要点。\n\n15.2 Nginx安全配置\n\nNginx安全加固指南。\n\n15.3 隐藏版本信息\n\n减少信息泄露风险。',
        pageCount: 30
      },
      {
        id: 'ch16',
        title: '第十六章 互联网业务安全',
        content: '16.1 业务安全风险\n\n- 账户安全\n- 交易安全\n- 支付安全\n\n16.2 抗欺诈策略\n\n业务安全风控策略。',
        pageCount: 35
      },
      {
        id: 'ch17',
        title: '第十七章 安全开发流程（SDL）',
        content: '17.1 SDL简介\n\n安全开发生命周期。\n\n17.2 威胁建模\n\nSTRIDE模型的应用。\n\n17.3 安全测试\n\n安全测试方法与工具。',
        pageCount: 30
      },
      {
        id: 'ch18',
        title: '第十八章 安全运营',
        content: '18.1 安全运营概述\n\n安全运营的概念与职责。\n\n18.2 入侵检测\n\nIDS与IPS的部署。\n\n18.3 应急响应\n\n安全事件的响应流程。',
        pageCount: 25
      }
    ]
  },
  {
    id: 'web-hacking-techniques',
    title: '黑客攻防技术宝典：Web实战篇（第2版）',
    author: 'Dafydd Stuttard',
    category: 'Web安全',
    cover: 'Web攻防',
    description: 'Web安全领域专家的经验结晶，系统阐述了如何针对Web应用程序展开攻击与反攻击，深入剖析了攻击时所使用的技巧、步骤和工具。',
    pages: 650,
    difficulty: '进阶',
    publishYear: 2019,
    tags: ['Web安全', '渗透测试', '漏洞利用', 'OWASP'],
    rating: 4.8,
    readers: 28000,
    targetAudience: '渗透测试工程师、安全研究员、Web开发工程师',
    prerequisites: ['Web开发基础', 'HTTP协议', '数据库基础'],
    highlights: [
      '21个章节涵盖Web安全全领域',
      '数百个漏洞实验室',
      '详细的攻击步骤与工具使用',
      'OWASP Top 10深度剖析'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 Web应用程序安全与风险',
        content: '1.1 Web应用程序的发展\n\n现代Web应用程序的复杂性和安全风险。\n\n1.2 Web应用程序安全现状\n\n当前Web安全威胁概述。\n\n1.3 安全边界\n\n应用程序安全的边界划分。',
        pageCount: 20
      },
      {
        id: 'ch2',
        title: '第二章 核心防御机制',
        content: '2.1 处理用户访问\n\n身份认证与会话管理的安全机制。\n\n2.2 处理用户输入\n\n输入验证的策略与方法。\n\n2.3 防御机制设计\n\n安全机制的设计原则。',
        pageCount: 25
      },
      {
        id: 'ch3',
        title: '第三章 Web应用程序技术',
        content: '3.1 HTTP协议\n\nHTTP请求与响应详解。\n\n3.2 Web功能\n\nWeb应用程序的常见功能组件。\n\n3.3 编码方案\n\nURL编码、HTML编码等。',
        pageCount: 30
      },
      {
        id: 'ch4',
        title: '第四章 解析应用程序',
        content: '4.1 内容发现\n\n发现隐藏内容和功能。\n\n4.2 应用程序映射\n\n绘制应用程序的攻击面。\n\n4.3 分析攻击面\n\n识别潜在的攻击目标。',
        pageCount: 35
      },
      {
        id: 'ch5',
        title: '第五章 避开客户端控件',
        content: '5.1 客户端输入验证\n\n绕过客户端验证机制。\n\n5.2 浏览器扩展\n\nFlash、Java、Silverlight安全。\n\n5.3 状态非预期修改\n\n隐藏的表单字段、Cookie攻击等。',
        pageCount: 40
      },
      {
        id: 'ch6',
        title: '第六章 攻击验证机制',
        content: '6.1 认证技术\n\n密码登录、证书认证等。\n\n6.2 认证攻击\n\n密码猜测、暴力破解等。\n\n6.3 防御措施\n\n安全的认证机制设计。',
        pageCount: 35
      },
      {
        id: 'ch7',
        title: '第七章 攻击会话管理',
        content: '7.1 会话令牌\n\n令牌生成与安全传输。\n\n7.2 会话攻击\n\n会话劫持、预测、固定攻击。\n\n7.3 防御机制\n\n安全的会话管理策略。',
        pageCount: 40
      },
      {
        id: 'ch8',
        title: '第八章 攻击访问控制',
        content: '8.1 访问控制模型\n\n垂直越权与水平越权。\n\n8.2 测试访问控制\n\n识别和测试访问控制漏洞。\n\n8.3 防御措施\n\n安全的访问控制设计。',
        pageCount: 35
      },
      {
        id: 'ch9',
        title: '第九章 攻击数据存储区',
        content: '9.1 SQL注入\n\nSQL注入原理与利用。\n\n9.2 注入检测\n\n识别SQL注入漏洞。\n\n9.3 防御措施\n\n参数化查询等防御方法。',
        pageCount: 55
      },
      {
        id: 'ch10',
        title: '第十章 测试后端组件',
        content: '10.1 操作系统命令注入\n\n命令注入漏洞的利用。\n\n10.2 文件路径遍历\n\n路径遍历攻击。\n\n10.3 模板注入\n\n模板注入漏洞。',
        pageCount: 35
      },
      {
        id: 'ch11',
        title: '第十一章 攻击应用程序逻辑',
        content: '11.1 逻辑缺陷\n\n应用程序逻辑漏洞。\n\n11.2 攻击案例\n\n实际逻辑漏洞攻击案例。\n\n11.3 防御建议\n\n逻辑安全设计。',
        pageCount: 35
      },
      {
        id: 'ch12',
        title: '第十二章 攻击其他用户',
        content: '12.1 XSS攻击\n\n跨站脚本攻击深度剖析。\n\n12.2 XSS利用\n\nXSS攻击的利用方式。\n\n12.3 防御措施\n\nXSS防护策略。',
        pageCount: 55
      },
      {
        id: 'ch13',
        title: '第十三章 攻击用户：其他技巧',
        content: '13.1 CSRF\n\n跨站请求伪造攻击。\\n\n13.2 UI伪装攻击\n\n点击劫持等UI攻击。\n\n13.3 钓鱼攻击\n\n钓鱼攻击的防御。',
        pageCount: 40
      },
      {
        id: 'ch14',
        title: '第十四章 定制攻击自动化',
        content: '14.1 自动化攻击\n\n使用工具自动化攻击。\n\n14.2 定制工具开发\n\n开发自定义攻击工具。\n\n14.3 绕过防御\n\n绕过WAF等防御机制。',
        pageCount: 35
      },
      {
        id: 'ch15',
        title: '第十五章 利用信息泄露',
        content: '15.1 错误信息泄露\n\n错误信息收集与利用。\n\n15.2 调试信息\n\n调试信息泄露风险。\n\n15.3 防御措施\n\n减少信息泄露。',
        pageCount: 30
      },
      {
        id: 'ch16',
        title: '第十六章 攻击本地编译型应用程序',
        content: '16.1 缓冲区溢出\n\n本地应用程序溢出漏洞。\n\n16.2 整数溢出\n\n整数溢出漏洞。\n\n16.3 格式化字符串\n\n格式化字符串漏洞。',
        pageCount: 35
      },
      {
        id: 'ch17',
        title: '第十七章 攻击应用程序架构',
        content: '17.1 架构缺陷\n\n应用程序架构安全问题。\n\n17.2 共享环境攻击\n\n共享宿主环境攻击。\n\n17.3 缓存投毒\n\n缓存安全问题。',
        pageCount: 30
      },
      {
        id: 'ch18',
        title: '第十八章 攻击Web服务器',
        content: '18.1 Web服务器漏洞\n\n常见Web服务器漏洞。\n\n18.2 应用程序服务器漏洞\n\n应用服务器安全问题。\n\n18.3 防御措施\n\n服务器安全加固。',
        pageCount: 30
      },
      {
        id: 'ch19',
        title: '第十九章 查找源代码中的漏洞',
        content: '19.1 代码审计\n\n源代码安全审计方法。\n\n19.2 自动化审计\n\n使用工具自动发现漏洞。\n\n19.3 常见漏洞模式\n\n代码中的常见漏洞模式。',
        pageCount: 30
      },
      {
        id: 'ch20',
        title: '第二十章 Web应用程序黑客工具包',
        content: '20.1 Burp Suite\n\nWeb渗透测试神器使用指南。\n\n20.2 SQLMap\n\nSQL注入自动化工具。\n\n20.3 其他工具\n\n常用渗透测试工具介绍。',
        pageCount: 35
      },
      {
        id: 'ch21',
        title: '第二十一章 Web应用程序渗透测试方法论',
        content: '21.1 渗透测试流程\n\n完整的渗透测试方法论。\n\n21.2 测试阶段\n\n各阶段的测试要点。\n\n21.3 报告撰写\n\n渗透测试报告编写。',
        pageCount: 30
      }
    ]
  },
  {
    id: 'kali-linux-pentest',
    title: 'Kali Linux渗透测试全流程详解',
    author: '王佳亮（Snow狼）',
    category: '渗透测试',
    cover: 'Kali',
    description: 'Kali Linux零基础入门级图书，涵盖渗透测试的整个流程，对各个环节涉及的具体工具和技术进行案例式介绍。Ghost Wolf Lab负责人，10多年渗透测试经验。',
    pages: 480,
    difficulty: '入门',
    publishYear: 2024,
    tags: ['Kali Linux', '渗透测试', '内网渗透', '提权'],
    rating: 4.9,
    readers: 42000,
    targetAudience: '渗透测试入门者、网络安全爱好者、CTF选手',
    prerequisites: ['计算机基础', 'Linux基础'],
    highlights: [
      '11个渗透测试核心章节',
      '信息收集到内网横向渗透全流程',
      '数百个实战案例',
      '社工与无线攻击详解'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 渗透测试系统',
        content: '1.1 渗透测试系统简介\n\n渗透测试的概念与重要性。\n\n1.2 Kali Linux的安装\n\n详细讲解Kali Linux的安装过程，包括物理机和虚拟机安装。\n\n1.3 靶机\n\n常用渗透测试靶机介绍：DVWA、Metasploitable、Vulnhub等。',
        pageCount: 26
      },
      {
        id: 'ch2',
        title: '第二章 信息收集',
        content: '2.1 信息收集的概念\n\n信息收集是渗透测试的第一步，也是最重要的一步。\n\n2.2 开源情报\n\n- Whois查询\n- DNS枚举\n- 子域名发现\n- Google Hacking\n\n2.3 主动侦查\n\n- 端口扫描（Nmap）\n- 服务识别\n- 操作系统识别\n\n2.4 综合侦查\n\n- Maltego\n- theHarvester',
        pageCount: 45
      },
      {
        id: 'ch3',
        title: '第三章 漏洞扫描',
        content: '3.1 漏洞数据库\n\nCVE、CNVD等漏洞数据库介绍。\n\n3.2 Nmap漏洞扫描\n\n使用Nmap进行漏洞扫描。\n\n3.3 Nikto漏洞扫描\n\nWeb服务器漏洞扫描工具。\n\n3.4 Wapiti漏洞扫描\n\nWeb应用漏洞扫描器。\n\n3.5 ZAP漏洞扫描\n\nOWASP ZAP使用指南。\n\n3.6 xray漏洞扫描\n\n国产漏洞扫描器使用。\n\n3.7 CMS漏洞扫描\n\nWordPress、Drupal等CMS漏洞扫描。',
        pageCount: 28
      },
      {
        id: 'ch4',
        title: '第四章 漏洞利用',
        content: '4.1 Web安全漏洞\n\n常见Web漏洞类型概述。\n\n4.2 Burp Suite的使用\n\nWeb渗透测试神器Burp Suite详解。\n\n4.3 SQL注入\n\nSQL注入漏洞原理与利用，包括：\n- Union注入\n- 布尔盲注\n- 时间盲注\n- 报错注入\n\n4.4 XSS漏洞\n\nXSS漏洞利用与钓鱼攻击。\n\n4.5 文件包含漏洞\n\n本地文件包含与远程文件包含。\n\n4.6 Metasploit渗透测试框架\n\nMetasploit的使用与exploit开发。\n\n4.7 实例演示\n\n完整的漏洞利用案例。',
        pageCount: 80
      },
      {
        id: 'ch5',
        title: '第五章 提权',
        content: '5.1 提权方法\n\n- 本地服务提权\n- 内核漏洞提权\n- SUID提权\n- 配置错误提权\n\n5.2 使用Metasploit框架提权\n\nMeterpreter提权模块使用。\n\n5.3 利用PowerShell脚本提权\n\nPowerSploit等脚本使用。\n\n5.4 Starkiller后渗透框架\n\nStarkiller使用指南。',
        pageCount: 30
      },
      {
        id: 'ch6',
        title: '第六章 持久化',
        content: '6.1 使用Metasploit框架实现持久化\n\nMeterpreter后门部署。\n\n6.2 使用Starkiller框架实现持久化\n\nStarkiller持久化模块。\n\n6.3 持久化交互式代理\n\n建立持久化代理通道。\n\n6.4 WebShell\n\n各类WebShell的部署与连接。',
        pageCount: 30
      },
      {
        id: 'ch7',
        title: '第七章 内网横向渗透',
        content: '7.1 信息收集\n\n内网信息收集：\n- 网络拓扑探测\n- 存活主机发现\n- 端口扫描\n\n7.2 横向移动\n\n- Pass the Hash\n- Pass the Ticket\n- PSEXEC\n- WMI\n- WinRM\n\n7.3 域渗透\n\nActive Directory域渗透技术。',
        pageCount: 25
      },
      {
        id: 'ch8',
        title: '第八章 暴力破解',
        content: '8.1 哈希\n\n密码哈希介绍与识别。\n\n8.2 密码字典\n\n密码字典生成与优化。\n\n8.3 hashcat暴力破解\n\nGPU加速的哈希破解工具。\n\n8.4 Hydra暴力破解\n\n在线密码破解工具。\n\n8.5 John暴力破解\n\nJohn the Ripper使用指南。\n\n8.6 使用Metasploit暴力破解\n\nMetasploit暴力破解模块。',
        pageCount: 20
      },
      {
        id: 'ch9',
        title: '第九章 无线攻击',
        content: '9.1 无线探测\n\n使用airodump-ng进行无线探测。\n\n9.2 查找隐藏的SSID\n\n隐藏SSID发现技术。\n\n9.3 绕过MAC地址认证\n\nMAC地址伪装攻击。\n\n9.4 无线网络数据加密协议\n\nWEP、WPA、WPA2安全性分析。\n\n9.5 拒绝服务攻击\n\n无线DoS攻击方法。\n\n9.6 克隆AP攻击\n\nEvil Twin攻击。\n\n9.7 架设钓鱼AP\n\nHostapd搭建钓鱼热点。\n\n9.8 自动化工具破解\n\nreaver、WIFITE等工具使用。',
        pageCount: 30
      },
      {
        id: 'ch10',
        title: '第十章 中间人攻击',
        content: '10.1 中间人攻击原理\n\nARP欺骗与DNS欺骗原理。\n\n10.2 Ettercap框架\n\n局域网中间人攻击工具。\n\n10.3 Bettercap框架\n\nBettercap高级功能使用。\n\n10.4 使用arpspoof发起中间人攻击\n\narpspoof命令使用。\n\n10.5 SSL攻击\n\nSSLstrip、SSLsplit等SSL攻击技术。',
        pageCount: 25
      },
      {
        id: 'ch11',
        title: '第十一章 社会工程学',
        content: '11.1 社会工程学攻击方法\n\n社会工程学基本原理。\n\n11.2 Social-Engineer Toolkit\n\nSET工具集使用。\n\n11.3 钓鱼邮件攻击\n\n钓鱼邮件制作与发送。\n\n11.4 物理社会工程\n\nUSB攻击、RFID克隆等。',
        pageCount: 25
      }
    ]
  },
  {
    id: 'malware-analysis-practice',
    title: '恶意代码分析实战',
    author: 'Michael Sikorski, Andrew Honig',
    category: '二进制安全',
    cover: '恶意代码',
    description: '内容全面的恶意代码分析技术指南，兼顾理论，重在实践。IDA Pro作者推荐。涵盖恶意代码行为、静态分析、动态分析、对抗与反对抗方法。',
    pages: 420,
    difficulty: '高级',
    publishYear: 2021,
    tags: ['恶意代码', '逆向工程', '沙箱', 'Rootkit'],
    rating: 4.8,
    readers: 15000,
    targetAudience: '恶意代码分析师、逆向工程师、安全研究员',
    prerequisites: ['汇编语言', '操作系统原理', 'C/C++编程'],
    highlights: [
      '21章全面覆盖恶意代码分析',
      'Shellcode分析技术',
      'C++恶意代码分析',
      '64位恶意代码分析'
    ],
    chapters: [
      {
        id: 'ch0',
        title: '第0章 恶意代码分析技术入门',
        content: '0.1 恶意代码分析概述\n\n恶意代码分析的目的与方法。\n\n0.2 分析环境搭建\n\n虚拟机配置与工具安装。',
        pageCount: 10
      },
      {
        id: 'ch1',
        title: '第1章 静态分析基础技术',
        content: '1.1 文件特征分析\n\n文件哈希计算与识别。\n\n1.2 字符串分析\n\n从恶意代码中提取字符串。\n\n1.3 依赖库分析\n\n识别恶意代码使用的库函数。',
        pageCount: 25
      },
      {
        id: 'ch2',
        title: '第2章 在虚拟机中分析恶意代码',
        content: '2.1 虚拟机配置\n\nVMware、VirtualBox配置。\n\n2.2 快照与恢复\n\n使用快照隔离恶意代码。\n\n2.3 网络配置\n\n安全隔离的分析环境。',
        pageCount: 15
      },
      {
        id: 'ch3',
        title: '第3章 动态分析基础技术',
        content: '3.1 进程监控\n\nProcess Explorer、Process Monitor使用。\n\n3.2 注册表监控\n\n注册表变化跟踪。\n\n3.3 网络监控\n\nWireshark、TCPView使用。',
        pageCount: 20
      },
      {
        id: 'ch4',
        title: '第4章 x86反汇编速成班',
        content: '4.1 寄存器\n\nx86寄存器详解。\n\n4.2 指令集\n\n常用x86指令。\n\n4.3 函数调用约定\n\ncdecl、stdcall、fastcall。',
        pageCount: 35
      },
      {
        id: 'ch5',
        title: '第5章 IDA Pro',
        content: '5.1 IDA界面\n\nIDA Pro主界面介绍。\n\n5.2 反汇编导航\n\n交叉引用、函数分析。\n\n5.3 插件使用\n\n常用IDA插件介绍。',
        pageCount: 30
      },
      {
        id: 'ch6',
        title: '第6章 识别汇编中的C代码结构',
        content: '6.1 条件分支\n\nif/else结构识别。\n\n6.2 循环结构\n\nfor、while循环识别。\n\n6.3 函数调用\n\n函数调用模式识别。',
        pageCount: 30
      },
      {
        id: 'ch7',
        title: '第7章 分析恶意Windows程序',
        content: '7.1 Windows API\n\n常见Windows API分析。\n\n7.2 特权提升\n\nWindows特权机制分析。\n\n7.3 代码注入\n\n远程线程注入等技术的识别。',
        pageCount: 30
      },
      {
        id: 'ch8',
        title: '第8章 动态调试',
        content: '8.1 调试基础\n\n调试器原理。\n\n8.2断点设置\n\n软件断点、硬件断点、内存断点。',
        pageCount: 20
      },
      {
        id: 'ch9',
        title: '第9章 使用OllyDbg',
        content: '9.1 OllyDbg界面\n\nOllyDbg主界面介绍。\n\n9.2 调试技巧\n\n常用调试技术。\n\n9.3 插件\n\nODbgScript等插件使用。',
        pageCount: 35
      },
      {
        id: 'ch10',
        title: '第10章 使用WinDbg调试内核',
        content: '10.1 内核调试配置\n\nWinDbg双机调试设置。\n\n10.2 内核命令\n\n常用内核调试命令。\n\n10.3 驱动调试\n\n内核驱动调试技术。',
        pageCount: 40
      },
      {
        id: 'ch11',
        title: '第11章 恶意代码行为',
        content: '11.1 文件操作\n\n恶意代码的文件行为。\n\n11.2 注册表操作\n\n注册表持久化技术。\n\n11.3 进程注入\n\n各种进程注入技术分析。',
        pageCount: 30
      },
      {
        id: 'ch12',
        title: '第12章 隐蔽的恶意代码启动',
        content: '12.1 启动方式\n\n各种持久化启动方式。\n\n12.2 服务启动\n\nWindows服务机制。\n\n12.3 计划任务\n\n任务计划程序利用。',
        pageCount: 25
      },
      {
        id: 'ch13',
        title: '第13章 数据加密',
        content: '13.1 加密算法识别\n\n识别恶意代码中的加密。\n\n13.2 常用加密\n\nAES、RC4等算法识别。\n\n13.3 解密技术\n\n手动解密方法。',
        pageCount: 30
      },
      {
        id: 'ch14',
        title: '第14章 恶意代码的网络特征',
        content: '14.1 网络协议\n\n恶意代码常用协议。\n\n14.2 C2通信\n\n命令控制服务器通信。\n\n14.3 流量分析\n\n网络流量特征提取。',
        pageCount: 30
      },
      {
        id: 'ch15',
        title: '第15章 对抗反汇编',
        content: '15.1 反汇编技术\n\n反汇编算法原理。\n\n15.2 对抗技术\n\n跳转混淆等对抗技术。\n\n15.3 识别方法\n\n识别反汇编对抗。',
        pageCount: 30
      },
      {
        id: 'ch16',
        title: '第16章 反调试技术',
        content: '16.1 检测调试器\n\nIsDebuggerPresent等API。\n\n16.2 时间检测\n\n基于时间的反调试。\n\n16.3 异常处理\n\n异常处理反调试。',
        pageCount: 25
      },
      {
        id: 'ch17',
        title: '第17章 反虚拟机技术',
        content: '17.1 虚拟机检测\n\nVMware、VirtualBox检测。\n\n17.2 绕过技术\n\n绕过虚拟机检测。\n\n17.3 分析技巧\n\n分析反虚拟机恶意代码。',
        pageCount: 25
      },
      {
        id: 'ch18',
        title: '第18章 加壳与脱壳',
        content: '18.1 加壳原理\n\n壳的工作原理。\n\n18.2 常见壳\n\nUPX、ASPack等。\n\n18.3 脱壳技术\n\n手动脱壳方法。',
        pageCount: 30
      },
      {
        id: 'ch19',
        title: '第19章 shellcode分析',
        content: '19.1 shellcode基础\n\nshellcode编写原理。\n\n19.2 分析方法\n\nshellcode分析技术。\n\n19.3 案例分析\n\n实际shellcode分析。',
        pageCount: 25
      },
      {
        id: 'ch20',
        title: '第20章 C++代码分析',
        content: '20.1 C++反汇编\n\nC++对象的反汇编表示。\n\n20.2 STL分析\n\n标准模板库分析。\n\n20.3 案例分析\n\nC++恶意代码分析。',
        pageCount: 25
      },
      {
        id: 'ch21',
        title: '第21章 64位恶意代码',
        content: '21.1 x64架构\n\nx64与x86区别。\n\n21.2 分析工具\n\nx64调试器使用。\n\n21.3 案例分析\n\n64位恶意代码分析。',
        pageCount: 20
      }
    ]
  },
  {
    id: 'hacking-exposed-malware',
    title: '黑客大曝光：恶意软件和Rootkit安全',
    author: 'Michael A. Davis, Sean M. Bodmer, Aaron LeMasters',
    category: '二进制安全',
    cover: '曝光',
    description: '抵御恶意软件和Rootkit不断掀起的攻击浪潮！用现实世界的案例研究和实例揭示黑客如何使用工具渗透和劫持系统。',
    pages: 380,
    difficulty: '高级',
    publishYear: 2021,
    tags: ['恶意软件', 'Rootkit', '入侵检测', '防病毒'],
    rating: 4.7,
    readers: 12000,
    targetAudience: '安全工程师、逆向工程师、安全运维',
    prerequisites: ['操作系统原理', '汇编基础', '网络基础'],
    highlights: [
      '11章涵盖恶意软件与Rootkit全领域',
      '内核模式Rootkit分析',
      'HIPS与NIPS识别技术',
      'Rootkit检测方法'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 传染方法',
        content: '1.1 恶意软件传播方式\n\n- 邮件附件\n- 漏洞利用\n- 社会工程\n- 捆绑传播\n\n1.2 蠕虫与病毒\n\n蠕虫与病毒的传播机制区别。',
        pageCount: 30
      },
      {
        id: 'ch2',
        title: '第二章 恶意软件功能',
        content: '2.1 恶意软件分类\n\n按功能分类的恶意软件类型。\n\n2.2 后门功能\n\n远程控制与命令执行。\n\n2.3 信息窃取\n\n键盘记录、屏幕截取等。',
        pageCount: 30
      },
      {
        id: 'ch3',
        title: '第三章 用户模式Rootkit',
        content: '3.1 用户模式Rootkit原理\n\nIAT钩子、内联钩子等技术。\n\n3.2 常见Rootkit\n\nHacker Defender等经典Rootkit分析。\n\n3.3 检测方法\n\n用户模式Rootkit检测技术。',
        pageCount: 35
      },
      {
        id: 'ch4',
        title: '第四章 内核模式Rootkit',
        content: '4.1 内核架构\n\nWindows内核结构简介。\n\n4.2 DKOM攻击\n\n直接内核对象操作。\n\n4.3 过滤驱动\n\n内核过滤驱动Rootkit。\n\n4.4 检测与防御\n\n内核Rootkit检测技术。',
        pageCount: 45
      },
      {
        id: 'ch5',
        title: '第五章 虚拟Rootkit',
        content: '5.1 虚拟化技术\n\n硬件虚拟化原理。\n\n5.2 虚拟机后门\n\n基于虚拟化的后门技术。\n\n5.3 Blue Pill攻击\n\n虚拟化Rootkit攻击。',
        pageCount: 25
      },
      {
        id: 'ch6',
        title: '第六章 Rootkit的未来',
        content: '6.1 技术发展趋势\n\nRootkit技术的演进方向。\n\n6.2 应对策略\n\n未来防御策略。',
        pageCount: 20
      },
      {
        id: 'ch7',
        title: '第七章 防病毒',
        content: '7.1 防病毒技术\n\n特征码、行为检测技术。\n\n7.2 免杀技术\n\n逃逸防病毒检测的方法。\n\n7.3 下一代防病毒\n\n机器学习在防病毒中的应用。',
        pageCount: 35
      },
      {
        id: 'ch8',
        title: '第八章 主机保护系统',
        content: '8.1 HIPS\n\n主机入侵防御系统介绍。\n\n8.2 应用程序控制\n\n白名单与黑名单机制。',
        pageCount: 25
      },
      {
        id: 'ch9',
        title: '第九章 基于主机的入侵预防',
        content: '9.1 行为监控\n\n基于行为的威胁检测。\n\n9.2 漏洞利用预防\n\n缓冲区溢出防护等技术。',
        pageCount: 25
      },
      {
        id: 'ch10',
        title: '第十章 Rootkit检测',
        content: '10.1 检测方法论\n\nRootkit检测的系统方法。\n\n10.2 工具使用\n\nGMER、IceSword等工具。\n\n10.3 手动检测\n\n手动Rootkit检测技术。',
        pageCount: 35
      },
      {
        id: 'ch11',
        title: '第十一章 常规安全实践',
        content: '11.1 安全基线\n\n系统安全加固标准。\n\n11.2 最小权限\n\n最小权限原则实施。\n\n11.3 持续监控\n\n持续安全监控策略。',
        pageCount: 25
      }
    ]
  },
  {
    id: 'hacking-exposed-7',
    title: '黑客大曝光：网络安全机密与解决方案（第7版）',
    author: 'Stuart McClure, Joel Scambray, George Kurtz',
    category: '网络攻防',
    cover: '黑客大曝光',
    description: '全球销量第一的网络和计算机信息安全图书，被信息安全界奉为"武林秘笈"。以独创的知己知彼视角揭示"黑客攻击的方法学"。',
    pages: 580,
    difficulty: '进阶',
    publishYear: 2021,
    tags: ['网络安全', '黑客攻防', '渗透测试', '无线安全'],
    rating: 4.9,
    readers: 45000,
    targetAudience: '安全工程师、渗透测试工程师、IT管理员',
    prerequisites: ['网络基础', '操作系统基础'],
    highlights: [
      '12章涵盖网络攻防全领域',
      '全球销量第一的安全图书',
      '踩点→扫描→查点三步曲',
      '最新攻击技术防范对策'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 踩点',
        content: '1.1 信息收集\n\n被动信息收集与主动信息收集。\n\n1.2 DNS查询\n\nDNS记录枚举与分析。\n\n1.3 Whois查询\n\nWhois数据库查询与利用。',
        pageCount: 30
      },
      {
        id: 'ch2',
        title: '第二章 扫描',
        content: '2.1 端口扫描\n\nTCP、UDP扫描技术。\n\n2.2 服务识别\n\nBanner抓取与服务指纹识别。\n\n2.3 漏洞扫描\n\n漏洞扫描工具使用。',
        pageCount: 35
      },
      {
        id: 'ch3',
        title: '第三章 查点',
        content: '3.1 账户查点\n\n枚举用户账户信息。\n\n3.2 共享资源\n\nSMB、FTP等共享资源查点。\n\n3.3 SNMP查点\n\nSNMP协议信息收集。',
        pageCount: 25
      },
      {
        id: 'ch4',
        title: '第四章 攻击Windows',
        content: '4.1 认证攻击\n\n密码破解与传递哈希。\n\n4.2 漏洞利用\n\nWindows漏洞利用技术。\n\n4.3 权限提升\n\nWindows提权技术。',
        pageCount: 45
      },
      {
        id: 'ch5',
        title: '第五章 攻击Unix',
        content: '5.1 服务攻击\n\nUnix服务漏洞利用。\n\n5.2 SSH攻击\n\nSSH暴力破解与密钥窃取。\n\n5.3 提权\n\nUnix系统提权技术。',
        pageCount: 40
      },
      {
        id: 'ch6',
        title: '第六章 网络犯罪和高级持续威胁',
        content: '6.1 APT攻击\n\nAPT攻击特征与流程。\n\n6.2 供应链攻击\n\n供应链安全问题。\n\n6.3 防御策略\n\nAPT防御措施。',
        pageCount: 35
      },
      {
        id: 'ch7',
        title: '第七章 远程连接和VoIP攻击',
        content: '7.1 VPN攻击\n\nVPN协议漏洞与利用。\n\n7.2 VoIP安全\n\nVoIP系统攻击与防御。\n\n7.3 远程桌面\n\nRDP攻击技术。',
        pageCount: 30
      },
      {
        id: 'ch8',
        title: '第八章 无线攻击',
        content: '8.1 无线侦察\n\n无线网络发现与指纹识别。\n\n8.2 WEP破解\n\nWEP加密破解技术。\n\n8.3 WPA/WPA2攻击\n\nWPA破解与Reaver攻击。\n\n8.4 无线入侵检测\n\n无线入侵检测系统。',
        pageCount: 40
      },
      {
        id: 'ch9',
        title: '第九章 硬件攻击',
        content: '9.1 物理攻击\n\n物理访问攻击技术。\n\n9.2 USB攻击\n\nBadUSB等USB攻击。\n\n9.3 固件攻击\n\n固件提取与篡改。',
        pageCount: 30
      },
      {
        id: 'ch10',
        title: '第十章 攻击网页和数据库',
        content: '10.1 Web应用攻击\n\nSQL注入、XSS等攻击。\n\n10.2 数据库攻击\n\n数据库漏洞利用。\n\n10.3 WebShell\n\nWebShell上传与连接。',
        pageCount: 40
      },
      {
        id: 'ch11',
        title: '第十一章 攻击移动设备',
        content: '11.1 Android攻击\n\nAndroid系统攻击技术。\n\n11.2 iOS攻击\n\niOS系统攻击与越狱。\n\n11.3 移动恶意软件\n\n移动端恶意软件分析。',
        pageCount: 35
      },
      {
        id: 'ch12',
        title: '第十二章 防范对策手册',
        content: '12.1 安全架构\n\n纵深防御体系建设。\n\n12.2 应急响应\n\n安全事件响应流程。\n\n12.3 合规要求\n\n等级保护与合规要求。',
        pageCount: 30
      }
    ]
  },
  {
    id: 'cryptography-network-security',
    title: '密码学与网络安全（第3版）',
    author: 'Atul Kahate',
    category: '密码学',
    cover: '密码学',
    description: '以自底向上的方式介绍：从密码学到网络安全，再到案例研究。涵盖IEEE 802.11安全、Elgamal加密、云安全以及Web服务安全。',
    pages: 320,
    difficulty: '入门',
    publishYear: 2022,
    tags: ['密码学', '加密算法', 'PKI', '网络安全'],
    rating: 4.6,
    readers: 18000,
    targetAudience: '密码学入门者、安全开发人员',
    prerequisites: ['数学基础', '计算机基础'],
    highlights: [
      '9章系统讲解密码学基础',
      '对称密钥与非对称密钥算法',
      'PKI公钥基础设施',
      '网络安全协议详解'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 计算机攻击与计算机安全',
        content: '1.1 安全威胁\n\n网络安全威胁类型概述。\n\n1.2 攻击类型\n\n被动攻击、主动攻击。\n\n1.3 安全目标\n\nCIA三元组：保密性、完整性、可用性。',
        pageCount: 30
      },
      {
        id: 'ch2',
        title: '第二章 密码技术',
        content: '2.1 古典密码\n\n凯撒密码、维吉尼亚密码等。\n\n2.2 对称加密\n\n对称加密的基本原理。\n\n2.3 非对称加密\n\n公钥密码学原理。',
        pageCount: 40
      },
      {
        id: 'ch3',
        title: '第三章 对称密钥算法与AES',
        content: '3.1 DES\n\n数据加密标准。\n\n3.2 3DES\n\n三重DES算法。\n\n3.3 AES\n\n高级加密标准详解。\n\n3.4 加密模式\n\nECB、CBC、GCM等模式。',
        pageCount: 45
      },
      {
        id: 'ch4',
        title: '第四章 基于计算机的非对称密钥算法',
        content: '4.1 RSA\n\nRSA算法原理与实现。\n\n4.2 椭圆曲线\n\nECC椭圆曲线密码学。\n\n4.3 Diffie-Hellman\n\n密钥交换协议。',
        pageCount: 40
      },
      {
        id: 'ch5',
        title: '第五章 公钥基础设施',
        content: '5.1 数字证书\n\nX.509证书结构。\n\n5.2 PKI体系\n\n公钥基础设施组成。\n\n5.3 证书颁发\n\n证书申请与颁发流程。',
        pageCount: 35
      },
      {
        id: 'ch6',
        title: '第六章 Internet安全协议',
        content: '6.1 SSL/TLS\n\nSSL/TLS协议详解。\n\n6.2 HTTPS\n\nHTTPS安全连接。\n\n6.3 IPsec\n\nIPsec VPN协议。',
        pageCount: 35
      },
      {
        id: 'ch7',
        title: '第七章 用户认证机制',
        content: '7.1 认证方式\n\n密码、生物识别等认证。\n\n7.2 Kerberos\n\nKerberos认证协议。\n\n7.3 单点登录\n\nSSO认证机制。',
        pageCount: 30
      },
      {
        id: 'ch8',
        title: '第八章 加密与安全实现',
        content: '8.1 安全编程\n\n安全编码实践。\n\n8.2 密钥管理\n\n密钥生成、存储、销毁。\n\n8.3 密码存储\n\n安全密码存储方法。',
        pageCount: 30
      },
      {
        id: 'ch9',
        title: '第九章 网络安全、防火墙与VPN',
        content: '9.1 防火墙\n\n防火墙类型与配置。\n\n9.2 VPN\n\nVPN技术与应用。\n\n9.3 IDS/IPS\n\n入侵检测与防御系统。',
        pageCount: 35
      }
    ]
  },
  {
    id: 'red-blue-warfare',
    title: '红蓝攻防：构建实战化网络安全防御体系',
    author: '奇安信安服团队',
    category: '护网红队',
    cover: '红蓝攻防',
    description: '从红队、蓝队、紫队视角全面讲解如何进行红蓝攻防实战演练。奇安信安服团队多年服务大型政企机构的经验总结。',
    pages: 280,
    difficulty: '进阶',
    publishYear: 2024,
    tags: ['红蓝对抗', '护网', '渗透测试', '应急响应'],
    rating: 4.9,
    readers: 25000,
    targetAudience: '红队队员、蓝队队员、安全管理人员',
    prerequisites: ['渗透测试基础', '安全运营基础'],
    highlights: [
      '13章涵盖红蓝紫三方视角',
      '蓝队攻击4阶段8种手段',
      '红队防守4阶段8种策略',
      '攻防演练组织全流程'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 认识红蓝紫',
        content: '1.1 为什么要实战攻防演练\n\n演练的意义与价值。\n\n1.2 红队定义与演变\n\n红队的发展历程。\n\n1.3 蓝队定义与演变\n\n蓝队的职责演进。\n\n1.4 紫队角色\n\n紫队的裁判与评估职能。',
        pageCount: 30
      },
      {
        id: 'ch2',
        title: '第二章 蓝队攻击的4个阶段',
        content: '2.1 准备阶段\n\n攻击前的情报收集与工具准备。\n\n2.2 边界突破\n\nWeb渗透、漏洞利用等方式突破边界。\n\n2.3 内部拓展\n\n内网信息收集与横向移动。\n\n2.4 成果巩固\n\n权限维持与痕迹清理。',
        pageCount: 30
      },
      {
        id: 'ch3',
        title: '第三章 蓝队常用的攻击手段',
        content: '3.1 漏洞利用\n\n0day、Nday漏洞利用。\n\n3.2 弱口令攻击\n\n密码爆破与凭据重用。\n\n3.3 社会工程\n\n钓鱼邮件、水坑攻击等。\n\n3.4 供应链攻击\n\n第三方组件漏洞利用。',
        pageCount: 35
      },
      {
        id: 'ch4',
        title: '第四章 蓝队攻击的必备能力',
        content: '4.1 技术能力\n\n漏洞挖掘与利用能力。\n\n4.2 情报能力\n\n威胁情报收集与分析。\n\n4.3 工具能力\n\n攻击工具开发与使用。',
        pageCount: 25
      },
      {
        id: 'ch5',
        title: '第五章 蓝队经典攻击实例',
        content: '5.1 案例分析\n\n典型攻击场景复盘。\n\n5.2 攻击路径\n\n攻击路径还原与分析。\n\n5.3 经验教训\n\n攻击中的经验总结。',
        pageCount: 30
      },
      {
        id: 'ch6',
        title: '第六章 红队防守的实施阶段',
        content: '6.1 准备阶段\n\n安全基线建立与资产梳理。\n\n6.2 防护阶段\n\n纵深防御体系部署。\n\n6.3 响应阶段\n\n安全事件监测与响应。\n\n6.4 总结阶段\n\n攻防演练总结与改进。',
        pageCount: 30
      },
      {
        id: 'ch7',
        title: '第七章 红队常用的防守策略',
        content: '7.1 纵深防御\n\n多层安全防护体系建设。\n\n7.2 零信任\n\n零信任安全架构。\n\n7.3 持续监测\n\n7x24小时安全监测。',
        pageCount: 30
      },
      {
        id: 'ch8',
        title: '第八章 红队常用的防护手段',
        content: '8.1 访问控制\n\n最小权限与身份认证。\n\n8.2 加密通信\n\n传输加密与存储加密。\n\n8.3 安全监控\n\n日志收集与关联分析。',
        pageCount: 25
      },
      {
        id: 'ch9',
        title: '第九章 红队常用的关键安全设备',
        content: '9.1 防火墙\n\n边界防护设备。\n\n9.2 IDS/IPS\n\n入侵检测与防御系统。\n\n9.3 WAF\n\nWeb应用防火墙。\n\n9.4 态势感知\n\n安全态势感知平台。',
        pageCount: 30
      },
      {
        id: 'ch10',
        title: '第十章 红队经典防守实例',
        content: '10.1 攻击检测\n\n成功检测攻击案例。\n\n10.2 应急响应\n\n快速响应处置案例。\n\n10.3 追踪溯源\n\n攻击者身份追踪案例。',
        pageCount: 30
      },
      {
        id: 'ch11',
        title: '第十一章 如何组织一场实战攻防演练',
        content: '11.1 演练目标\n\n明确演练目的与范围。\n\n11.2 演练范围\n\n确定攻击目标与规则。\n\n11.3 评分标准\n\n攻击成果评分机制。',
        pageCount: 25
      },
      {
        id: 'ch12',
        title: '第十二章 组织攻防演练的5个阶段',
        content: '12.1 组织策划\n\n演练方案设计。\n\n12.2 前期准备\n\n环境搭建与队伍组建。\n\n12.3 实战攻防\n\n正式演练实施。\n\n12.4 应急演练\n\n突发事件处理演练。\n\n12.5 演练总结\n\n成果评估与改进。',
        pageCount: 30
      },
      {
        id: 'ch13',
        title: '第十三章 组织沙盘推演的4个阶段',
        content: '13.1 场景设计\n\n推演场景设计。\n\n13.2 角色分配\n\n红蓝紫角色分配。\n\n13.3 推演执行\n\n桌面推演实施。\n\n13.4 总结评估\n\n推演效果评估。',
        pageCount: 25
      }
    ]
  },
  {
    id: 'linux-for-security',
    title: '给安全工程师讲透Linux',
    author: '网络掌控者',
    category: '系统安全',
    cover: 'Linux安全',
    description: '面向黑客攻击、网络安全和渗透测试的初学者，通过Kali Linux系统详细介绍使用Linux操作系统的基础知识与渗透测试技能。',
    pages: 420,
    difficulty: '入门',
    publishYear: 2024,
    tags: ['Linux', 'Kali', '渗透测试', '安全运维'],
    rating: 4.7,
    readers: 22000,
    targetAudience: 'Linux安全入门者、渗透测试初学者',
    prerequisites: ['计算机基础'],
    highlights: [
      'Linux系统基础知识',
      '文件权限与用户管理',
      'Bash和Python脚本编程',
      '安全性和匿名性配置'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 Kali Linux简介',
        content: '1.1 Kali Linux概述\n\nKali Linux是专为渗透测试设计的Linux发行版。\n\n1.2 安装配置\n\n虚拟机安装与网络配置。\n\n1.3 工具集\n\nKali内置安全工具概述。',
        pageCount: 25
      },
      {
        id: 'ch2',
        title: '第二章 Linux系统基础',
        content: '2.1 文件系统\n\nLinux目录结构与文件类型。\n\n2.2 命令行基础\n\n常用命令详解。\n\n2.3 文本处理\n\ngrep、sed、awk等工具。',
        pageCount: 40
      },
      {
        id: 'ch3',
        title: '第三章 文件权限与用户管理',
        content: '3.1 权限模型\n\nrwx权限与chmod。\n\n3.2 特殊权限\n\nSUID、SGID、Sticky Bit。\n\n3.3 用户管理\n\n用户添加、删除、权限分配。',
        pageCount: 35
      },
      {
        id: 'ch4',
        title: '第四章 网络配置与安全',
        content: '4.1 网络配置\n\nIP地址、路由配置。\n\n4.2 防火墙\n\niptables配置与规则编写。\n\n4.3 网络诊断\n\ntcpdump、netstat等工具。',
        pageCount: 40
      },
      {
        id: 'ch5',
        title: '第五章 进程与服务管理',
        content: '5.1 进程管理\n\nps、top、kill等命令。\n\n5.2 服务管理\n\nsystemd服务配置。\n\n5.3 定时任务\n\ncron任务配置与利用。',
        pageCount: 30
      },
      {
        id: 'ch6',
        title: '第六章 脚本编程基础',
        content: '6.1 Bash脚本\n\nBash脚本编写基础。\n\n6.2 条件判断\n\nif、case条件语句。\n\n6.3 循环\n\nfor、while循环。',
        pageCount: 35
      },
      {
        id: 'ch7',
        title: '第七章 Python安全脚本',
        content: '7.1 Python基础\n\nPython语法入门。\n\n7.2 网络编程\n\nsocket编程基础。\n\n7.3 安全工具开发\n\nPython安全工具编写。',
        pageCount: 45
      },
      {
        id: 'ch8',
        title: '第八章 安全与匿名性',
        content: '8.1 痕迹清理\n\n日志清除与痕迹隐藏。\n\n8.2 加密通信\n\nOpenVPN、Tor配置。\n\n8.3 代理chain\n\n代理链配置与使用。',
        pageCount: 40
      },
      {
        id: 'ch9',
        title: '第九章 渗透测试工具',
        content: '9.1 信息收集\n\nNmap、Maltego使用。\n\n9.2 漏洞扫描\n\nNikto、OpenVAS使用。\n\n9.3 漏洞利用\n\nMetasploit使用指南。',
        pageCount: 50
      },
      {
        id: 'ch10',
        title: '第十章 应急响应',
        content: '10.1 取证基础\n\n数字取证基本流程。\n\n10.2 日志分析\n\n系统日志分析方法。\n\n10.3 恶意代码检测\n\nLinux恶意软件分析。',
        pageCount: 40
      }
    ]
  },
  {
    id: 'white话-security',
    title: '白话网络安全',
    author: '翟立东（中国科学院信息工程研究所）',
    category: '基础理论',
    cover: '白话',
    description: '汇集"大东话安全"团队多年从事网络安全科普活动的经验和成果，采用轻松活泼的对话体形式，用32个故事介绍网络安全知识。',
    pages: 380,
    difficulty: '入门',
    publishYear: 2023,
    tags: ['网络安全', '科普', '入门', '病毒', '攻防'],
    rating: 4.8,
    readers: 35000,
    targetAudience: '网络安全初学者、对安全感兴趣的普通人',
    prerequisites: ['计算机基础'],
    highlights: [
      '5篇32章，用故事讲安全',
      '计算机病毒原理与案例',
      '网络攻击手段详解',
      '最新安全技术介绍'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第1篇 病毒初现',
        content: '01 江湖第一魔道：病毒\n\n计算机病毒的原理与历史。\n\n02 史上最复杂的计算机蠕虫病毒：Flame\n\nFlame蠕虫病毒深度剖析。\n\n03 "性感"的病毒：MSN性感鸡\n\nMSN病毒发展史。\n\n04 千禧年的千年虫\n\n千年虫问题回顾。\n\n05 凶猛的病毒：极虎病毒\n\n病毒产业链分析。',
        pageCount: 50
      },
      {
        id: 'ch2',
        title: '第2篇 魔道相长',
        content: '08 短信嗅探\n\nGSM短信安全漏洞。\n\n09 网站镜像\n\n网站镜像攻击技术。\n\n10 流量劫持\n\n流量劫持原理与防范。\n\n11 位置隐私\n\nGPS与位置服务安全。\n\n12 Wi-Fi探针\n\nWi-Fi探针隐私泄露。\n\n13 DDoS攻击\n\n分布式拒绝服务攻击。\n\n14 逻辑炸弹\n\n逻辑炸弹的原理与危害。',
        pageCount: 60
      },
      {
        id: 'ch3',
        title: '第3篇 正者无敌',
        content: '15 杀毒\n\n杀毒技术与病毒防护。\n\n16 CTF竞赛\n\n网络安全竞赛介绍。\n\n17 爬虫和反爬虫\n\n数据爬取与反爬虫技术。\n\n18 APT攻击\n\n高级持续性威胁分析。',
        pageCount: 45
      },
      {
        id: 'ch4',
        title: '第4篇 新生安全',
        content: '19 金融安全\n\n金融木马与防护。\n\n20 大数据安全\n\n大数据时代的安全挑战。\n\n21 物联网安全\n\nIoT设备安全隐患。\n\n22 人工智能安全\n\nAI安全与对抗样本。\n\n23 供应链安全\n\n供应链攻击防御。\n\n24 工控安全\n\n工业控制系统安全。\n\n25 区块链安全\n\n区块链安全问题。\n\n26 航空安全\n\n航空电子系统安全。\n\n27 移动安全\n\n手机安全问题。\n\n28 数据安全\n\n数据保护技术。',
        pageCount: 80
      },
      {
        id: 'ch5',
        title: '第5篇 隐逸江湖',
        content: '29 黑产运行\n\n网络黑色产业链。\n\n30 黑色产业链\n\n黑客地下经济分析。\n\n31 世界最顶级的黑客会议\n\nDEF CON等黑客大会。\n\n32 黑客世界探秘\n\n黑客文化与精神。',
        pageCount: 40
      }
    ]
  },
  // ========== 第二批精选书籍 ==========
  {
    id: 'white-hat-browser-security',
    title: '白帽子讲浏览器安全',
    author: '钱文祥',
    category: 'Web安全',
    cover: '浏览器',
    description: '浏览器是重要的互联网入口，一旦受到漏洞攻击，将直接影响到用户的信息安全。兼顾攻击者、研究者和用户三个场景，对大部分攻击都提供了分析思路和防御方案。',
    pages: 320,
    difficulty: '进阶',
    publishYear: 2021,
    tags: ['浏览器安全', 'XSS', 'CSRF', '同源策略'],
    rating: 4.7,
    readers: 12000,
    targetAudience: 'Web安全研究员、前端开发工程师',
    prerequisites: ['Web安全基础', 'JavaScript基础'],
    highlights: [
      '浏览器安全机制深度剖析',
      '同源策略与绕过技术',
      '浏览器扩展安全',
      '攻击与防御双视角'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 浏览器安全概述',
        content: '1.1 浏览器安全的重要性\n\n浏览器作为互联网入口，其安全性直接影响用户信息安全。\n\n1.2 浏览器安全模型\n\n同源策略、沙箱机制等安全模型。\n\n1.3 攻击面分析\n\n浏览器的攻击面与攻击向量。',
        pageCount: 30
      },
      {
        id: 'ch2',
        title: '第二章 同源策略',
        content: '2.1 同源策略原理\n\n同源策略的定义与作用。\n\n2.2 跨域技术\n\nJSONP、CORS等跨域方案。\n\n2.3 同源策略绕过\n\n各种绕过同源策略的方法。',
        pageCount: 35
      },
      {
        id: 'ch3',
        title: '第三章 浏览器扩展安全',
        content: '3.1 扩展机制\n\n浏览器扩展的工作原理。\n\n3.2 扩展漏洞\n\n常见扩展安全漏洞。\n\n3.3 扩展攻防\n\n针对扩展的攻击与防御。',
        pageCount: 30
      },
      {
        id: 'ch4',
        title: '第四章 插件安全',
        content: '4.1 Flash安全\n\nFlash插件的安全问题。\n\n4.2 Java Applet\n\nJava插件安全。\n\n4.3 插件攻击\n\n插件漏洞利用技术。',
        pageCount: 25
      },
      {
        id: 'ch5',
        title: '第五章 浏览器漏洞挖掘',
        content: '5.1 漏洞类型\n\n浏览器常见漏洞类型。\n\n5.2 Fuzzing技术\n\n浏览器Fuzzing方法。\n\n5.3 漏洞利用\n\n浏览器漏洞利用技术。',
        pageCount: 35
      },
      {
        id: 'ch6',
        title: '第六章 点击劫持与UI攻击',
        content: '6.1 点击劫持原理\n\nClickJacking攻击技术。\n\n6.2 各种UI攻击\n\n界面操作劫持类攻击。\n\n6.3 防御措施\n\nX-Frame-Options等防御方法。',
        pageCount: 30
      },
      {
        id: 'ch7',
        title: '第七章 浏览器隐私安全',
        content: '7.1 Cookie安全\n\nCookie的安全问题。\n\n7.2 追踪技术\n\n浏览器指纹等追踪技术。\n\n7.3 隐私保护\n\n隐私保护技术与工具。',
        pageCount: 30
      },
      {
        id: 'ch8',
        title: '第八章 浏览器安全配置',
        content: '8.1 安全配置\n\n浏览器安全设置。\n\n8.2 安全扩展\n\n安全扩展推荐。\n\n8.3 最佳实践\n\n浏览器安全使用最佳实践。',
        pageCount: 30
      }
    ]
  },
  {
    id: 'white-hat-web-scan',
    title: '白帽子讲Web扫描',
    author: '余弦',
    category: 'Web安全',
    cover: 'Web扫描',
    description: '详细讲述Web扫描器的概念、原理、实践及反制等知识。站在安全和开发的双重角度，呈现完整的Web扫描器技术体系。',
    pages: 280,
    difficulty: '进阶',
    publishYear: 2021,
    tags: ['Web扫描', '漏洞扫描', '渗透测试', '爬虫'],
    rating: 4.6,
    readers: 10000,
    targetAudience: '安全开发工程师、渗透测试工程师',
    prerequisites: ['Web安全基础', 'Python编程基础'],
    highlights: [
      'Web扫描器原理与实现',
      '爬虫技术与页面解析',
      '漏洞检测插件开发',
      '扫描器对抗与绕过'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 Web扫描器概述',
        content: '1.1 什么是Web扫描器\n\n自动化安全测试工具的定义。\n\n1.2 扫描器分类\n\n主动扫描、被动扫描等类型。\n\n1.3 主流扫描器\n\nAWVS、AppScan、Nikto等。',
        pageCount: 25
      },
      {
        id: 'ch2',
        title: '第二章 爬虫技术',
        content: '2.1 爬虫原理\n\nWeb爬虫的工作机制。\n\n2.2 深度爬取\n\nAJAX、单页应用的爬取。\n\n2.3 爬虫绕过\n\n绕过反爬虫机制。',
        pageCount: 35
      },
      {
        id: 'ch3',
        title: '第三章 漏洞检测原理',
        content: '3.1 漏洞特征\n\n各类漏洞的特征识别。\n\n3.2 检测算法\n\n漏洞检测的算法实现。\n\n3.3 误报与漏报\n\n如何降低误报漏报率。',
        pageCount: 30
      },
      {
        id: 'ch4',
        title: '第四章 SQL注入检测',
        content: '4.1 注入点识别\n\nSQL注入点发现技术。\n\n4.2 注入检测\n\n布尔盲注、时间盲注检测。\n\n4.3 注入利用\n\n数据获取与提权。',
        pageCount: 35
      },
      {
        id: 'ch5',
        title: '第五章 XSS检测',
        content: '5.1 XSS检测原理\n\n反射型、存储型XSS检测。\n\n5.2 DOM XSS检测\n\nDOM型XSS的检测技术。\n\n5.3 WAF绕过\n\n绕过WAF检测。',
        pageCount: 30
      },
      {
        id: 'ch6',
        title: '第六章 扫描器插件开发',
        content: '6.1 插件架构\n\n扫描器插件系统设计。\n\n6.2 插件开发\n\n自定义漏洞检测插件。\n\n6.3 插件优化\n\n插件性能与准确性优化。',
        pageCount: 30
      },
      {
        id: 'ch7',
        title: '第七章 扫描器对抗',
        content: '7.1 WAF对抗\n\n绕过Web应用防火墙。\n\n7.2 反扫描技术\n\n反爬虫与反扫描机制。\n\n7.3 扫描隐身\n\n扫描行为隐蔽技术。',
        pageCount: 30
      },
      {
        id: 'ch8',
        title: '第八章 扫描器实战',
        content: '8.1 扫描配置\n\n扫描器配置最佳实践。\n\n8.2 报告生成\n\n漏洞报告编写。\n\n8.3 工具集成\n\n与其他安全工具集成。',
        pageCount: 25
      }
    ]
  },
  {
    id: 'web-frontend-hacker',
    title: 'Web前端黑客技术揭秘',
    author: '钟晨鸣（余弦）',
    category: 'Web安全',
    cover: '前端黑客',
    description: 'Web前端的黑客攻防技术，包含XSS、CSRF、界面操作劫持三大类，涉及信任关系、Cookie安全、Flash安全、DOM渲染、字符集、跨域、高级钓鱼、蠕虫思想等。',
    pages: 350,
    difficulty: '高级',
    publishYear: 2020,
    tags: ['前端安全', 'XSS', 'CSRF', 'Flash安全'],
    rating: 4.8,
    readers: 15000,
    targetAudience: '前端安全研究员、Web安全工程师',
    prerequisites: ['JavaScript精通', 'Web安全基础'],
    highlights: [
      '前端安全三大类攻击',
      'Flash安全深度剖析',
      'DOM型XSS高阶技巧',
      '高级钓鱼与蠕虫'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 信任与信任关系',
        content: '1.1 安全的本质\n\n信任边界与安全模型。\n\n1.2 Web信任模型\n\nWeb应用的信任关系。\n\n1.3 信任边界突破\n\n打破信任边界的方法。',
        pageCount: 30
      },
      {
        id: 'ch2',
        title: '第二章 跨站脚本（XSS）',
        content: '2.1 XSS原理\n\n跨站脚本攻击基础。\n\n2.2 XSS分类\n\n反射型、存储型、DOM型。\n\n2.3 高级XSS\n\n各种XSS变种与技巧。',
        pageCount: 45
      },
      {
        id: 'ch3',
        title: '第三章 跨站请求伪造（CSRF）',
        content: '3.1 CSRF原理\n\n跨站请求伪造攻击。\n\n3.2 CSRF利用\n\nCSRF的各种利用场景。\n\n3.3 防御绕过\n\n绕过CSRF防御的方法。',
        pageCount: 35
      },
      {
        id: 'ch4',
        title: '第四章 界面操作劫持',
        content: '4.1 点击劫持\n\nClickJacking攻击技术。\n\n4.2 拖放劫持\n\nDrag and Drop劫持。\n\n4.3 触屏劫持\n\n移动端触屏劫持攻击。',
        pageCount: 35
      },
      {
        id: 'ch5',
        title: '第五章 Cookie安全',
        content: '5.1 Cookie机制\n\nCookie的工作原理。\n\n5.2 Cookie攻击\n\nCookie窃取与利用。\n\n5.3 Cookie安全\n\nSecure、HttpOnly等属性。',
        pageCount: 35
      },
      {
        id: 'ch6',
        title: '第六章 Flash安全',
        content: '6.1 Flash安全模型\n\nFlash的安全沙箱。\n\n6.2 Crossdomain.xml\n\n跨域策略文件配置。\n\n6.3 Flash漏洞\n\nFlash安全漏洞利用。',
        pageCount: 35
      },
      {
        id: 'ch7',
        title: '第七章 高级钓鱼',
        content: '7.1 钓鱼技术\n\n各种钓鱼攻击手法。\n\n7.2 标签页劫持\n\n浏览器标签页钓鱼。\n\n7.3 无地址栏钓鱼\n\n高级钓鱼技术。',
        pageCount: 30
      },
      {
        id: 'ch8',
        title: '第八章 Web蠕虫',
        content: '8.1 蠕虫原理\n\nWeb蠕虫的传播机制。\n\n8.2 XSS蠕虫\n\nXSS蠕虫编写与防御。\n\n8.3 蠕虫防御\n\n蠕虫检测与防御技术。',
        pageCount: 30
      }
    ]
  },
  {
    id: 'gray-hat-hacking',
    title: '灰帽黑客（第5版）',
    author: 'Daniel Regalado等',
    category: '渗透测试',
    cover: '灰帽',
    description: '在上一版本基础上做了全面细致的更新，新增13章内容，分析敌方当前的武器、技能和战术，提供切实有效的补救措施、案例研究和可部署的测试实验。',
    pages: 520,
    difficulty: '高级',
    publishYear: 2022,
    tags: ['渗透测试', '漏洞挖掘', '漏洞利用', '红蓝对抗'],
    rating: 4.9,
    readers: 20000,
    targetAudience: '高级渗透测试工程师、安全研究员',
    prerequisites: ['渗透测试基础', '编程基础'],
    highlights: [
      '第五版全面更新',
      '新增13章前沿内容',
      '实战案例与实验',
      '攻击与防御双视角'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 灰帽黑客概述',
        content: '1.1 黑客伦理\n\n白帽、灰帽、黑帽的区别。\n\n1.2 道德规范\n\n渗透测试的道德准则。\n\n1.3 法律边界\n\n网络安全法律边界。',
        pageCount: 20
      },
      {
        id: 'ch2',
        title: '第二章  footprinting',
        content: '2.1 信息收集\n\n开源情报收集技术。\n\n2.2 Google Hacking\n\nGoogle搜索技巧。\n\n2.3 社会工程学\n\n社工信息收集。',
        pageCount: 30
      },
      {
        id: 'ch3',
        title: '第三章 扫描技术',
        content: '3.1 端口扫描\n\n各种端口扫描技术。\n\n3.2 服务识别\n\n版本探测与指纹识别。\n\n3.3 漏洞扫描\n\n自动化漏洞扫描。',
        pageCount: 35
      },
      {
        id: 'ch4',
        title: '第四章 漏洞发现',
        content: '4.1 漏洞类型\n\n各类漏洞识别方法。\n\n4.2 Fuzzing\n\n漏洞Fuzzing技术。\n\n4.3 代码审计\n\n源代码漏洞发现。',
        pageCount: 40
      },
      {
        id: 'ch5',
        title: '第五章 漏洞利用',
        content: '5.1 缓冲区溢出\n\n栈溢出与堆溢出。\n\n5.2 格式字符串\n\n格式化字符串漏洞。\n\n5.3 整数溢出\n\n整数溢出漏洞利用。',
        pageCount: 45
      },
      {
        id: 'ch6',
        title: '第六章 恶意代码',
        content: '6.1 Shellcode\n\nShellcode编写技术。\n\n6.2 后门技术\n\n后门编写与隐藏。\n\n6.3 免杀技术\n\n防病毒绕过技术。',
        pageCount: 40
      },
      {
        id: 'ch7',
        title: '第七章 无线网络攻击',
        content: '7.1 WEP破解\n\nWEP加密破解。\n\n7.2 WPA/WPA2\n\nWPA攻击技术。\n\n7.3 Evil Twin\n\n邪恶双胞胎攻击。',
        pageCount: 35
      },
      {
        id: 'ch8',
        title: '第八章 Web应用攻击',
        content: '8.1 SQL注入\n\nSQL注入攻击技术。\n\n8.2 XSS攻击\n\n跨站脚本攻击。\n\n8.3 CSRF攻击\n\n跨站请求伪造。',
        pageCount: 40
      },
      {
        id: 'ch9',
        title: '第九章 渗透测试方法论',
        content: '9.1 PTES\n\n渗透测试执行标准。\n\n9.2 OSSTMM\n\n开源安全测试方法。\n\n9.3 报告撰写\n\n渗透测试报告编写。',
        pageCount: 30
      },
      {
        id: 'ch10',
        title: '第十章 防御措施',
        content: '10.1 补丁管理\n\n漏洞修复与补丁。\n\n10.2 访问控制\n\n最小权限原则。\n\n10.3 安全监测\n\n入侵检测与监控。',
        pageCount: 30
      }
    ]
  },
  {
    id: 'hacking-secrets',
    title: '黑客秘笈：渗透测试实用指南（第2版）',
    author: 'Peter Kim',
    category: '渗透测试',
    cover: '秘笈',
    description: '市场上口碑极好的渗透测试图书，在美亚测试图书领域排名第1。全书以橄榄球的行话阐述渗透测试的战术，实战性极强。',
    pages: 350,
    difficulty: '进阶',
    publishYear: 2021,
    tags: ['渗透测试', 'Kali', 'Metasploit', '实战'],
    rating: 4.8,
    readers: 18000,
    targetAudience: '渗透测试工程师、安全爱好者',
    prerequisites: ['网络基础', 'Linux基础'],
    highlights: [
      '美亚渗透测试图书排名第1',
      '实战性极强的指南',
      'Kali Linux工具详解',
      '渗透测试战术体系'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 准备阶段',
        content: '1.1 渗透测试流程\n\n完整的渗透测试生命周期。\n\n1.2 工具准备\n\nKali Linux工具集配置。\n\n1.3 环境搭建\n\n靶场与测试环境。',
        pageCount: 25
      },
      {
        id: 'ch2',
        title: '第二章 情报收集',
        content: '2.1 开源情报\n\nOSINT技术与工具。\n\n2.2 信息收集\n\n主动与被动信息收集。\n\n2.3 社会工程学\n\n社工攻击手法。',
        pageCount: 35
      },
      {
        id: 'ch3',
        title: '第三章 漏洞扫描',
        content: '3.1 Nessus\n\nNessus漏洞扫描器使用。\n\n3.2 OpenVAS\n\n开源漏洞扫描器。\n\n3.3 手动验证\n\n漏洞手动验证方法。',
        pageCount: 35
      },
      {
        id: 'ch4',
        title: '第四章 漏洞利用',
        content: '4.1 Metasploit\n\nMSF框架深入使用。\n\n4.2 Exploit开发\n\n漏洞利用开发基础。\n\n4.3 提权技术\n\n本地提权方法。',
        pageCount: 40
      },
      {
        id: 'ch5',
        title: '第五章 后渗透',
        content: '5.1 信息收集\n\n内网信息收集技巧。\n\n5.2 横向移动\n\n内网横向渗透技术。\n\n5.3 权限维持\n\n后门与持久化。',
        pageCount: 40
      },
      {
        id: 'ch6',
        title: '第六章 Web应用测试',
        content: '6.1 Burp Suite\n\nBurp Suite高级技巧。\n\n6.2 漏洞利用\n\nWeb漏洞利用实战。\n\n6.3 WebShell\n\nWebShell管理与利用。',
        pageCount: 35
      },
      {
        id: 'ch7',
        title: '第七章 无线网络',
        content: '7.1 无线侦察\n\n无线网络发现。\n\n7.2 密码破解\n\n无线密码破解技术。\n\n7.3 无线攻击\n\n各种无线攻击手法。',
        pageCount: 30
      },
      {
        id: 'ch8',
        title: '第八章 报告与总结',
        content: '8.1 报告结构\n\n渗透测试报告模板。\n\n8.2 风险评级\n\n漏洞风险评估。\n\n8.3 修复建议\n\n安全加固建议。',
        pageCount: 25
      }
    ]
  },
  {
    id: 'the-art-of-exploit',
    title: '黑客之道（第2版）：漏洞发掘的艺术',
    author: 'Jon Erickson',
    category: '二进制安全',
    cover: '漏洞艺术',
    description: '美亚全五星好评，畅销10余年，销量10余万册。随书附赠配套完整的Linux环境，供读者编程和调试使用。从黑客角度介绍了计算机系统知识。',
    pages: 450,
    difficulty: '高级',
    publishYear: 2021,
    tags: ['漏洞挖掘', '缓冲区溢出', 'Shellcode', '逆向工程'],
    rating: 4.9,
    readers: 25000,
    targetAudience: '安全研究员、漏洞挖掘工程师',
    prerequisites: ['C语言编程', '汇编语言基础'],
    highlights: [
      '畅销10余年的经典',
      '从黑客角度深入讲解',
      '配套Linux实验环境',
      '漏洞挖掘与利用艺术'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 编程概述',
        content: '1.1 C语言基础\n\nC编程语言回顾。\n\n1.2 汇编语言\n\nx86汇编基础。\n\n1.3 内存结构\n\n程序内存布局。',
        pageCount: 40
      },
      {
        id: 'ch2',
        title: '第二章 网络技术',
        content: '2.1 TCP/IP协议\n\n网络协议基础。\n\n2.2 Socket编程\n\n网络编程技术。\n\n2.3 网络嗅探\n\n数据包捕获与分析。',
        pageCount: 35
      },
      {
        id: 'ch3',
        title: '第三章 漏洞挖掘',
        content: '3.1 缓冲区溢出\n\n栈溢出原理详解。\n\n3.2 堆溢出\n\n堆溢出利用技术。\n\n3.3 格式化字符串\n\n格式化字符串漏洞。',
        pageCount: 50
      },
      {
        id: 'ch4',
        title: '第四章 破解技术',
        content: '4.1 调试技术\n\nGDB调试器使用。\n\n4.2 软件破解\n\n软件注册机制破解。\n\n4.3 反逆向技术\n\n反调试与反汇编。',
        pageCount: 45
      },
      {
        id: 'ch5',
        title: '第五章 Shellcode',
        content: '5.1 Shellcode编写\n\nShellcode开发基础。\n\n5.2 Shellcode优化\n\nShellcode编码与压缩。\n\n5.3 Shellcode利用\n\nShellcode注入技术。',
        pageCount: 40
      },
      {
        id: 'ch6',
        title: '第六章 高级漏洞',
        content: '6.1 整数溢出\n\n整数溢出漏洞利用。\n\n6.2 竞争条件\n\nTOCTOU竞争条件。\n\n6.3 内存破坏\n\n各种内存破坏技术。',
        pageCount: 40
      },
      {
        id: 'ch7',
        title: '第七章 密码学',
        content: '7.1 加密算法\n\n对称与非对称加密。\n\n7.2 哈希函数\n\n哈希算法与碰撞。\n\n7.3 密码攻击\n\n密码分析技术。',
        pageCount: 35
      },
      {
        id: 'ch8',
        title: '第八章 网络攻击',
        content: '8.1 端口扫描\n\n各种扫描技术。\n\n8.2 漏洞利用\n\n远程漏洞利用。\n\n8.3 拒绝服务\n\nDoS与DDoS攻击。',
        pageCount: 35
      }
    ]
  },
  {
    id: 'near-source-pentest',
    title: '黑客大揭秘：近源渗透测试',
    author: '杨芸',
    category: '渗透测试',
    cover: '近源渗透',
    description: '讲解当渗透测试人员靠近或位于目标建筑内部，如何利用各类无线网络、物理接口、智能设备的安全缺陷进行近源渗透测试。',
    pages: 320,
    difficulty: '进阶',
    publishYear: 2021,
    tags: ['近源渗透', '物理渗透', '无线安全', '社工'],
    rating: 4.7,
    readers: 8000,
    targetAudience: '红队队员、物理渗透测试师',
    prerequisites: ['渗透测试基础', '无线网络基础'],
    highlights: [
      '近源渗透测试全指南',
      '物理接口安全缺陷',
      '智能设备攻击',
      '红队物理渗透'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 近源渗透概述',
        content: '1.1 什么是近源渗透\n\n物理接近的渗透测试方式。\n\n1.2 近源渗透的价值\n\n内网渗透的另一种入口。\n\n1.3 法律与道德\n\n物理渗透的边界。',
        pageCount: 20
      },
      {
        id: 'ch2',
        title: '第二章 物理侦察',
        content: '2.1 场地侦察\n\n目标建筑环境侦察。\n\n2.2 社会工程学\n\n人员信息收集。\n\n2.3 物理访问\n\n进入建筑的方法。',
        pageCount: 30
      },
      {
        id: 'ch3',
        title: '第三章 Wi-Fi近源攻击',
        content: '3.1 Wi-Fi探测\n\n无线网络发现。\n\n3.2 Evil Twin\n\n伪造AP攻击。\n\n3.3 WPA破解\n\n无线密码破解。',
        pageCount: 40
      },
      {
        id: 'ch4',
        title: '第四章 物理接口攻击',
        content: '4.1 USB攻击\n\nBadUSB等USB攻击。\n\n4.2 串口攻击\n\n调试接口利用。\n\n4.3 其他接口\n\n各种物理接口攻击。',
        pageCount: 40
      },
      {
        id: 'ch5',
        title: '第五章 智能设备攻击',
        content: '5.1 IoT设备\n\n物联网设备攻击。\n\n5.2 门禁系统\n\n门禁攻击与绕过。\n\n5.3 监控系统\n\n摄像头攻击。',
        pageCount: 35
      },
      {
        id: 'ch6',
        title: '第六章 社会工程学',
        content: '6.1 假冒身份\n\n身份伪装技术。\n\n6.2 尾随进入\n\nTailgating技巧。\n\n6.3 垃圾桶潜水\n\nDumpster Diving。',
        pageCount: 35
      },
      {
        id: 'ch7',
        title: '第七章 内网接入',
        content: '7.1 网络接入\n\n接入内部网络。\n\n7.2 信息收集\n\n内网信息收集。\n\n7.3 权限获取\n\n内网权限提升。',
        pageCount: 35
      },
      {
        id: 'ch8',
        title: '第八章 近源渗透工具',
        content: '8.1 硬件工具\n\n近源渗透硬件设备。\n\n8.2 软件工具\n\n近源渗透软件工具。\n\n8.3 工具制作\n\nDIY攻击设备。',
        pageCount: 30
      }
    ]
  },
  {
    id: 'windows-hacker-programming',
    title: 'Windows黑客编程技术详解',
    author: '甘迪文',
    category: '二进制安全',
    cover: 'Win黑客编程',
    description: '介绍黑客编程的基础技术，涉及用户层下的Windows编程和内核层下的Rootkit编程。分为用户篇和内核篇两部分，详解Windows黑客编程。',
    pages: 380,
    difficulty: '高级',
    publishYear: 2021,
    tags: ['Windows', '黑客编程', 'Rootkit', '内核'],
    rating: 4.8,
    readers: 12000,
    targetAudience: 'Windows安全研究员、逆向工程师',
    prerequisites: ['C/C++编程', 'Windows API基础'],
    highlights: [
      '用户层与内核层双篇',
      'Rootkit编程详解',
      'Windows系统编程',
      '黑客技术原理与实现'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 Windows编程基础',
        content: '1.1 Win32 API\n\nWindows API基础。\n\n1.2 内存管理\n\n虚拟内存与堆管理。\n\n1.3 进程线程\n\n进程与线程机制。',
        pageCount: 35
      },
      {
        id: 'ch2',
        title: '第二章 用户层钩子',
        content: '2.1 IAT Hook\n\n导入表钩子技术。\n\n2.2 Inline Hook\n\n内联钩子实现。\n\n2.3 消息钩子\n\nSetWindowsHookEx。',
        pageCount: 40
      },
      {
        id: 'ch3',
        title: '第三章 进程注入',
        content: '3.1 CreateRemoteThread\n\n远程线程注入。\n\n3.2 反射注入\n\nReflective DLL Injection。\n\n3.3 进程掏空\n\nProcess Hollowing。',
        pageCount: 40
      },
      {
        id: 'ch4',
        title: '第四章 后门技术',
        content: '4.1 启动项后门\n\n注册表启动项。\n\n4.2 服务后门\n\nWindows服务后门。\n\n4.3 COM劫持\n\n组件对象模型劫持。',
        pageCount: 35
      },
      {
        id: 'ch5',
        title: '第五章 内核编程基础',
        content: '5.1 驱动开发\n\nWDK驱动开发入门。\n\n5.2 内核内存\n\n内核内存管理。\n\n5.3 同步机制\n\n内核同步对象。',
        pageCount: 40
      },
      {
        id: 'ch6',
        title: '第六章 Rootkit技术',
        content: '6.1 SSDT Hook\n\n系统服务描述表钩子。\n\n6.2 IDT Hook\n\n中断描述表钩子。\n\n6.3 IRP Hook\n\nIRP钩子技术。',
        pageCount: 45
      },
      {
        id: 'ch7',
        title: '第七章 内核隐藏技术',
        content: '7.1 进程隐藏\n\nDKOM进程隐藏。\n\n7.2 模块隐藏\n\n驱动模块隐藏。\n\n7.3 文件隐藏\n\n文件系统过滤。',
        pageCount: 35
      },
      {
        id: 'ch8',
        title: '第八章 反调试与免杀',
        content: '8.1 反调试技术\n\n各种反调试手段。\n\n8.2 反虚拟机\n\n虚拟机检测与绕过。\n\n8.3 免杀技术\n\n防病毒软件绕过。',
        pageCount: 35
      }
    ]
  },
  {
    id: 'cpp-hacker-programming',
    title: 'C++黑客编程揭秘与防范（第2版）',
    author: '冀云',
    category: '二进制安全',
    cover: 'C++黑客',
    description: '市面上关于黑客入门的书籍较为繁多，本书专注于C++黑客编程，从攻击者和防御者双重角度讲解黑客编程技术与防范方法。',
    pages: 420,
    difficulty: '高级',
    publishYear: 2020,
    tags: ['C++', '黑客编程', '逆向工程', '免杀'],
    rating: 4.6,
    readers: 9000,
    targetAudience: 'C++安全开发、逆向工程师',
    prerequisites: ['C++精通', '数据结构算法'],
    highlights: [
      'C++黑客编程实战',
      '攻击与防范双视角',
      '木马病毒开发技术',
      '软件保护与破解'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 C++与黑客编程',
        content: '1.1 C++语言优势\n\n为什么选择C++。\n\n1.2 开发环境\n\nVS开发环境配置。\n\n1.3 黑客编程基础\n\n黑客编程的概念。',
        pageCount: 25
      },
      {
        id: 'ch2',
        title: '第二章 木马开发',
        content: '2.1 木马原理\n\n木马的工作机制。\n\n2.2 C/S架构\n\n客户端服务端架构。\n\n2.3 功能实现\n\n木马功能模块开发。',
        pageCount: 45
      },
      {
        id: 'ch3',
        title: '第三章 病毒技术',
        content: '3.1 病毒原理\n\n计算机病毒机制。\n\n3.2 文件感染\n\nPE文件感染技术。\n\n3.3 传播机制\n\n病毒传播方式。',
        pageCount: 40
      },
      {
        id: 'ch4',
        title: '第四章 注入技术',
        content: '4.1 DLL注入\n\n各种DLL注入方法。\n\n4.2 代码注入\n\nShellcode注入。\n\n4.3 钩子注入\n\nSetWindowsHookEx。',
        pageCount: 45
      },
      {
        id: 'ch5',
        title: '第五章 逆向分析',
        content: '5.1 静态分析\n\nIDA Pro逆向分析。\n\n5.2 动态调试\n\nOllyDbg调试技术。\n\n5.3 算法还原\n\n加密算法逆向。',
        pageCount: 45
      },
      {
        id: 'ch6',
        title: '第六章 软件破解',
        content: '6.1 保护机制\n\n常见软件保护方式。\n\n6.2 破解技术\n\n各种破解手法。\n\n6.3 Patch技术\n\n补丁制作技术。',
        pageCount: 40
      },
      {
        id: 'ch7',
        title: '第七章 免杀技术',
        content: '7.1 特征码免杀\n\n修改特征码方法。\n\n7.2 加壳技术\n\n加壳与脱壳。\n\n7.3 花指令\n\n垃圾代码添加。',
        pageCount: 35
      },
      {
        id: 'ch8',
        title: '第八章 安全防范',
        content: '8.1 主动防御\n\nHIPS主机防护。\n\n8.2 软件保护\n\n软件加密保护。\n\n8.3 安全编程\n\n安全编码实践。',
        pageCount: 35
      }
    ]
  },
  {
    id: 'antivirus-evasion',
    title: '黑客免杀攻防',
    author: '任晓珲',
    category: '二进制安全',
    cover: '免杀攻防',
    description: '国内首部关于黑客免杀技术的专著，为反病毒工程师剖析恶意软件和应对安全威胁提供全面指导。从攻击者和防御者双视角深入讲解。',
    pages: 350,
    difficulty: '高级',
    publishYear: 2020,
    tags: ['免杀', '反病毒', '恶意软件', '加壳'],
    rating: 4.7,
    readers: 11000,
    targetAudience: '反病毒工程师、恶意代码分析师',
    prerequisites: ['汇编语言', 'PE文件结构'],
    highlights: [
      '国内首部免杀技术专著',
      '攻防双视角深入',
      '免杀技术全解析',
      '反病毒实战指南'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 免杀技术概述',
        content: '1.1 免杀的概念\n\n免杀技术的定义。\n\n1.2 免杀与杀毒\n\n矛与盾的较量。\n\n1.3 免杀分类\n\n文件免杀、内存免杀等。',
        pageCount: 25
      },
      {
        id: 'ch2',
        title: '第二章 杀毒软件原理',
        content: '2.1 特征码检测\n\n特征码扫描技术。\n\n2.2 启发式检测\n\n启发式病毒检测。\n\n2.3 云查杀\n\n云安全技术。',
        pageCount: 35
      },
      {
        id: 'ch3',
        title: '第三章 文件免杀',
        content: '3.1 特征码定位\n\n定位杀毒软件特征码。\n\n3.2 特征码修改\n\n修改特征码方法。\n\n3.3 PE结构优化\n\nPE文件结构调整。',
        pageCount: 40
      },
      {
        id: 'ch4',
        title: '第四章 内存免杀',
        content: '4.1 内存特征\n\n内存特征码检测。\n\n4.2 内存免杀方法\n\n内存免杀技术。\n\n4.3 行为免杀\n\n行为特征绕过。',
        pageCount: 35
      },
      {
        id: 'ch5',
        title: '第五章 加壳技术',
        content: '5.1 压缩壳\n\nUPX等压缩壳。\n\n5.2 加密壳\n\nVMProtect等加密壳。\n\n5.3 自定义壳\n\n编写简单加壳器。',
        pageCount: 40
      },
      {
        id: 'ch6',
        title: '第六章 花指令与混淆',
        content: '6.1 花指令原理\n\n垃圾指令添加。\n\n6.2 控制流混淆\n\n控制流平坦化等。\n\n6.3 代码虚拟化\n\n虚拟机保护技术。',
        pageCount: 35
      },
      {
        id: 'ch7',
        title: '第七章 反虚拟机与反调试',
        content: '7.1 虚拟机检测\n\nVMware检测与绕过。\n\n7.2 反调试技术\n\n各种反调试手段。\n\n7.3 Sandbox检测\n\n沙箱环境检测。',
        pageCount: 35
      },
      {
        id: 'ch8',
        title: '第八章 反病毒实战',
        content: '8.1 病毒分析\n\n恶意代码分析流程。\n\n8.2 病毒查杀\n\n病毒清除技术。\n\n8.3 防御策略\n\n企业防病毒策略。',
        pageCount: 30
      }
    ]
  },
  {
    id: 'python-gray-hat',
    title: 'Python灰帽子：黑客与逆向工程师的Python编程之道',
    author: 'Justin Seitz',
    category: '二进制安全',
    cover: 'Python灰帽',
    description: '知名安全机构Immunity Inc资深黑帽主笔，关于编程语言Python如何被广泛应用于黑客与逆向工程领域的经典著作。',
    pages: 250,
    difficulty: '进阶',
    publishYear: 2020,
    tags: ['Python', '逆向工程', '调试器', '漏洞挖掘'],
    rating: 4.8,
    readers: 16000,
    targetAudience: 'Python安全开发、逆向工程师',
    prerequisites: ['Python编程', '汇编基础'],
    highlights: [
      'Immunity Inc资深专家著作',
      'Python安全编程实战',
      '调试器开发教程',
      '逆向与漏洞挖掘工具'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 准备工作',
        content: '1.1 Python环境\n\nPython开发环境配置。\n\n1.2 调试工具\n\n调试工具介绍。\n\n1.3 安全库\n\n常用Python安全库。',
        pageCount: 20
      },
      {
        id: 'ch2',
        title: '第二章 调试器原理',
        content: '2.1 调试机制\n\nWindows调试API。\n\n2.2 断点原理\n\n软件与硬件断点。\n\n2.3 异常处理\n\n调试异常处理。',
        pageCount: 30
      },
      {
        id: 'ch3',
        title: '第三章 自己写调试器',
        content: '3.1 基础调试器\n\n编写简单调试器。\n\n3.2 断点设置\n\n实现断点功能。\n\n3.3 寄存器访问\n\n读写寄存器。',
        pageCount: 35
      },
      {
        id: 'ch4',
        title: '第四章 Immunity Debugger',
        content: '4.1 Immunity介绍\n\nImmunity Debugger概述。\n\n4.2 PyCommand\n\n编写PyCommand插件。\n\n4.3 脚本开发\n\nImmunity脚本开发。',
        pageCount: 30
      },
      {
        id: 'ch5',
        title: '第五章 IDA Python',
        content: '5.1 IDA脚本\n\nIDC与IDAPython。\n\n5.2 批量分析\n\n批量代码分析。\n\n5.3 漏洞挖掘\n\nIDA辅助漏洞挖掘。',
        pageCount: 30
      },
      {
        id: 'ch6',
        title: '第六章 模糊测试',
        content: '6.1 Fuzzing原理\n\n模糊测试基础。\n\n6.2 Fuzzing框架\n\n编写Fuzzing框架。\n\n6.3 文件Fuzzing\n\n文件格式模糊测试。',
        pageCount: 30
      },
      {
        id: 'ch7',
        title: '第七章 漏洞利用',
        content: '7.1 Shellcode\n\nPython生成Shellcode。\n\n7.2 漏洞利用\n\n利用开发辅助。\n\n7.3 利用框架\n\n编写利用框架。',
        pageCount: 25
      },
      {
        id: 'ch8',
        title: '第八章 网络工具',
        content: '8.1 网络编程\n\nPython网络编程。\n\n8.2 扫描器\n\n编写端口扫描器。\n\n8.3 嗅探器\n\n数据包嗅探工具。',
        pageCount: 25
      }
    ]
  },
  {
    id: 'social-engineering-attack',
    title: '黑客社会工程学攻击2',
    author: '杨哲',
    category: '社会工程',
    cover: '社工攻击',
    description: '国内首本以案例为主，理论为辅的"社会工程学"参考书。讲的不仅仅是案例，更是一种社会工程师的思维模式与enjoy hacking的方法。',
    pages: 280,
    difficulty: '进阶',
    publishYear: 2021,
    tags: ['社会工程学', '钓鱼攻击', '心理操纵', '物理渗透'],
    rating: 4.6,
    readers: 9000,
    targetAudience: '红队队员、社工渗透师',
    prerequisites: ['心理学基础', '沟通能力'],
    highlights: [
      '国内首本社工参考书',
      '案例为主理论为辅',
      '社工思维模式培养',
      '真实攻击场景还原'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 社会工程学概述',
        content: '1.1 什么是社会工程学\n\n利用人性弱点的攻击方式。\n\n1.2 社工的威力\n\n最危险的攻击向量。\n\n1.3 社工攻击分类\n\n社工攻击的各种类型。',
        pageCount: 25
      },
      {
        id: 'ch2',
        title: '第二章 信息收集',
        content: '2.1 开源情报\n\nOSINT信息收集。\n\n2.2 个人信息\n\n个人隐私信息获取。\n\n2.3 企业信息\n\n企业组织信息收集。',
        pageCount: 30
      },
      {
        id: 'ch3',
        title: '第三章 钓鱼攻击',
        content: '3.1 邮件钓鱼\n\n钓鱼邮件制作与发送。\n\n3.2 网站钓鱼\n\n伪造钓鱼网站。\n\n3.3 鱼叉式钓鱼\n\n针对性钓鱼攻击。',
        pageCount: 40
      },
      {
        id: 'ch4',
        title: '第四章 电话社工',
        content: '4.1 电话社工原理\n\n声音的信任建立。\n\n4.2 话术设计\n\n社工话术编写。\n\n4.3 场景实战\n\n电话社工案例。',
        pageCount: 35
      },
      {
        id: 'ch5',
        title: '第五章 物理社工',
        content: '5.1 身份伪装\n\n假冒身份进入。\n\n5.2 尾随技术\n\nTailgating技巧。\n\n5.3 检查点绕过\n\n安检绕过方法。',
        pageCount: 35
      },
      {
        id: 'ch6',
        title: '第六章 心理操纵',
        content: '6.1 影响力原理\n\nCialdini六大原则。\n\n6.2 说服技巧\n\n说服心理学。\n\n6.3 信任建立\n\n快速建立信任。',
        pageCount: 35
      },
      {
        id: 'ch7',
        title: '第七章 社工工具',
        content: '7.1 SET工具集\n\nSocial-Engineer Toolkit。\n\n7.2 BeEF框架\n\n浏览器攻击框架。\n\n7.3 社工库\n\n社工库查询与利用。',
        pageCount: 30
      },
      {
        id: 'ch8',
        title: '第八章 防范与意识培训',
        content: '8.1 安全意识\n\n员工安全意识培训。\n\n8.2 社工防范\n\n社会工程学防御。\n\n8.3 应急预案\n\n社工事件响应。',
        pageCount: 25
      }
    ]
  },
  {
    id: 'art-of-deception',
    title: '反欺骗的艺术：世界传奇黑客的经历分享',
    author: 'Kevin D. Mitnick',
    category: '社会工程',
    cover: '反欺骗',
    description: '凯文·米特尼克(Kevin D. Mitnick)曾经是历史上最令FBI头痛的计算机顽徒之一，现在已成为全球广受欢迎的计算机安全专家之一。',
    pages: 320,
    difficulty: '入门',
    publishYear: 2019,
    tags: ['社会工程学', '黑客传奇', '安全意识', '欺骗技术'],
    rating: 4.9,
    readers: 25000,
    targetAudience: '安全意识培训、企业员工',
    prerequisites: ['无'],
    highlights: [
      '世界头号黑客作品',
      '真实社工故事',
      '安全意识培训必读',
      '传奇黑客经历分享'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 攻击者的技术',
        content: '1.1 信息的吸引力\n\n信息对攻击者的价值。\n\n1.2 收集信息\n\n各种信息收集方法。\n\n1.3 骗局与诡计\n\n经典社工欺骗手法。',
        pageCount: 30
      },
      {
        id: 'ch2',
        title: '第二章 内线的诱惑',
        content: '2.1 公司员工\n\n利用员工获取信息。\n\n2.2 技术支持\n\n假冒技术支持。\n\n2.3 身份冒用\n\n冒充他人身份。',
        pageCount: 35
      },
      {
        id: 'ch3',
        title: '第三章 攻击计算机',
        content: '3.1 密码攻击\n\n密码获取技术。\n\n3.2 网络入侵\n\n网络渗透案例。\n\n3.3 物理访问\n\n物理入侵案例。',
        pageCount: 35
      },
      {
        id: 'ch4',
        title: '第四章 经典骗局',
        content: '4.1 电话骗局\n\n经典电话社工案例。\n\n4.2 邮件骗局\n\n邮件欺骗案例。\n\n4.3 现场骗局\n\n面对面欺骗案例。',
        pageCount: 35
      },
      {
        id: 'ch5',
        title: '第五章 流程和安全',
        content: '5.1 安全流程\n\n企业安全流程设计。\n\n5.2 安全策略\n\n安全策略制定。\n\n5.3 安全培训\n\n员工安全意识培训。',
        pageCount: 30
      },
      {
        id: 'ch6',
        title: '第六章 保卫企业王国',
        content: '6.1 安全架构\n\n企业安全架构设计。\n\n6.2 访问控制\n\n最小权限原则。\n\n6.3 安全监测\n\n安全事件监控。',
        pageCount: 35
      },
      {
        id: 'ch7',
        title: '第七章 员工的角色',
        content: '7.1 安全意识\n\n员工安全意识培养。\n\n7.2 可疑行为\n\n识别可疑行为。\n\n7.3 报告机制\n\n安全事件报告。',
        pageCount: 30
      },
      {
        id: 'ch8',
        title: '第八章 下一次攻击浪潮',
        content: '8.1 未来趋势\n\n社工攻击发展趋势。\n\n8.2 防御策略\n\n未来防御策略。\n\n8.3 持续改进\n\n安全持续改进。',
        pageCount: 25
      }
    ]
  },
  {
    id: 'hacker-psychology',
    title: '黑客心理学——社会工程学原理',
    author: '杨义先、钮心忻',
    category: '社会工程',
    cover: '黑客心理',
    description: '所有信息安全问题，几乎都可以归因于人。在过去数十年里，全球信息安全界的研究重点几乎都是"如何从技术上去对抗黑客"，忽略了"黑客是人"这一基本事实。',
    pages: 280,
    difficulty: '入门',
    publishYear: 2019,
    tags: ['社会工程学', '心理学', '安全意识', '人因安全'],
    rating: 4.5,
    readers: 8000,
    targetAudience: '安全研究人员、HR、管理层',
    prerequisites: ['心理学基础'],
    highlights: [
      '从心理学角度看安全',
      '人因安全深度分析',
      '社会工程学原理',
      '杨义先教授著作'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 人因安全',
        content: '1.1 人的因素\n\n安全中最薄弱的环节。\n\n1.2 心理学与安全\n\n心理学在安全中的应用。\n\n1.3 人因工程\n\n人因安全研究。',
        pageCount: 30
      },
      {
        id: 'ch2',
        title: '第二章 社会工程心理学',
        content: '2.1 说服心理学\n\n说服的心理机制。\n\n2.2 影响力原理\n\n六大影响力武器。\n\n2.3 认知偏差\n\n认知偏差的利用。',
        pageCount: 35
      },
      {
        id: 'ch3',
        title: '第三章 信任与欺骗',
        content: '3.1 信任建立\n\n心理学中的信任机制。\n\n3.2 欺骗识别\n\n谎言与欺骗的识别。\n\n3.3 微表情\n\n微表情心理学。',
        pageCount: 35
      },
      {
        id: 'ch4',
        title: '第四章 密码心理学',
        content: '4.1 密码习惯\n\n人们设置密码的习惯。\n\n4.2 密码破解\n\n基于心理学的密码破解。\n\n4.3 密码安全\n\n安全密码策略。',
        pageCount: 30
      },
      {
        id: 'ch5',
        title: '第五章 网络行为心理',
        content: '5.1 网络行为\n\n网络行为心理分析。\n\n5.2 点击行为\n\n为什么人们会点击。\n\n5.3 下载行为\n\n下载心理分析。',
        pageCount: 30
      },
      {
        id: 'ch6',
        title: '第六章 安全意识',
        content: '6.1 意识培养\n\n安全意识培养方法。\n\n6.2 行为改变\n\n安全行为改变理论。\n\n6.3 培训效果\n\n安全培训效果评估。',
        pageCount: 30
      },
      {
        id: 'ch7',
        title: '第七章 社工攻击防范',
        content: '7.1 心理防范\n\n心理防线建设。\n\n7.2 识别技术\n\n社工攻击识别方法。\n\n7.3 应对策略\n\n社工攻击应对方法。',
        pageCount: 30
      },
      {
        id: 'ch8',
        title: '第八章 安全文化',
        content: '8.1 安全文化\n\n企业安全文化建设。\n\n8.2 安全氛围\n\n安全氛围营造。\n\n8.3 安全行为\n\n安全行为激励。',
        pageCount: 25
      }
    ]
  },
  {
    id: 'hacking-exposed-system',
    title: '黑客攻防技术宝典：系统实战篇（第2版）',
    author: 'Ira Winkler等',
    category: '系统安全',
    cover: '系统实战',
    description: '由世界顶级安全专家亲自执笔，详细阐述了系统安全、应用程序安全、软件破解、加密解密等安全领域的核心问题。',
    pages: 420,
    difficulty: '进阶',
    publishYear: 2020,
    tags: ['系统安全', 'Windows', 'Linux', '应用安全'],
    rating: 4.7,
    readers: 14000,
    targetAudience: '系统安全工程师、运维工程师',
    prerequisites: ['操作系统基础', '网络基础'],
    highlights: [
      '世界顶级安全专家著作',
      'Windows/Linux双系统',
      '应用程序安全',
      '加密解密技术'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 操作系统安全',
        content: '1.1 Windows安全\n\nWindows安全模型。\n\n1.2 Linux安全\n\nLinux安全机制。\n\n1.3 安全基线\n\n操作系统安全加固。',
        pageCount: 40
      },
      {
        id: 'ch2',
        title: '第二章 认证攻击',
        content: '2.1 密码攻击\n\n密码破解技术。\n\n2.2 认证绕过\n\n认证机制绕过。\n\n2.3 凭据窃取\n\n凭据窃取技术。',
        pageCount: 40
      },
      {
        id: 'ch3',
        title: '第三章 权限提升',
        content: '3.1 本地提权\n\n本地权限提升技术。\n\n3.2 内核漏洞\n\n内核漏洞利用。\n\n3.3 配置错误\n\n配置错误提权。',
        pageCount: 45
      },
      {
        id: 'ch4',
        title: '第四章 应用程序安全',
        content: '4.1 缓冲区溢出\n\n应用程序溢出漏洞。\n\n4.2 输入验证\n\n输入验证漏洞。\n\n4.3 安全编码\n\n安全编码实践。',
        pageCount: 40
      },
      {
        id: 'ch5',
        title: '第五章 恶意软件',
        content: '5.1 木马技术\n\n木马植入与隐藏。\n\n5.2 Rootkit\n\nRootkit技术分析。\n\n5.3 间谍软件\n\n间谍软件检测。',
        pageCount: 35
      },
      {
        id: 'ch6',
        title: '第六章 数据库安全',
        content: '6.1 Oracle安全\n\nOracle数据库安全。\n\n6.2 MySQL安全\n\nMySQL数据库安全。\n\n6.3 SQL注入\n\n数据库注入攻击。',
        pageCount: 40
      },
      {
        id: 'ch7',
        title: '第七章 加密解密',
        content: '7.1 加密算法\n\n常见加密算法。\n\n7.2 密码分析\n\n密码分析技术。\n\n7.3 加密破解\n\n加密破解方法。',
        pageCount: 35
      },
      {
        id: 'ch8',
        title: '第八章 安全加固',
        content: '8.1 系统加固\n\n操作系统加固。\n\n8.2 服务加固\n\n网络服务安全。\n\n8.3 安全监控\n\n系统安全监控。',
        pageCount: 35
      }
    ]
  },
  {
    id: 'stop-hacker',
    title: '阻击黑客：技术、策略与案例',
    author: '徐焱',
    category: '网络攻防',
    cover: '阻击黑客',
    description: '从问题定义开始，从系统化的角度看待安全，讨论当前安全发展的变化、安全的思维方式、目标，并且分析了不同的威胁模型。',
    pages: 380,
    difficulty: '进阶',
    publishYear: 2020,
    tags: ['攻防技术', '威胁模型', '安全策略', '实战案例'],
    rating: 4.6,
    readers: 10000,
    targetAudience: '安全工程师、安全管理人员',
    prerequisites: ['网络安全基础'],
    highlights: [
      '系统化的安全视角',
      '威胁模型分析方法',
      '攻防技术与策略',
      '真实案例剖析'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 安全的视角',
        content: '1.1 安全本质\n\n重新理解安全。\n\n1.2 安全目标\n\n安全建设的目标。\n\n1.3 威胁模型\n\n不同的威胁模型。',
        pageCount: 30
      },
      {
        id: 'ch2',
        title: '第二章 攻击方法',
        content: '2.1 攻击链\n\n攻击链模型分析。\n\n2.2 攻击技术\n\n常见攻击技术。\n\n2.3 攻击工具\n\n黑客工具分析。',
        pageCount: 35
      },
      {
        id: 'ch3',
        title: '第三章 防御体系',
        content: '3.1 纵深防御\n\n纵深防御体系建设。\n\n3.2 主动防御\n\n主动防御技术。\n\n3.3 威胁狩猎\n\n威胁狩猎方法。',
        pageCount: 40
      },
      {
        id: 'ch4',
        title: '第四章 检测技术',
        content: '4.1 入侵检测\n\nIDS/IPS技术。\n\n4.2 行为分析\n\n异常行为检测。\n\n4.3 威胁情报\n\n威胁情报应用。',
        pageCount: 40
      },
      {
        id: 'ch5',
        title: '第五章 响应与恢复',
        content: '5.1 应急响应\n\n安全事件响应流程。\n\n5.2 事件调查\n\n安全事件调查方法。\n\n5.3 系统恢复\n\n系统恢复技术。',
        pageCount: 35
      },
      {
        id: 'ch6',
        title: '第六章 Web攻防',
        content: '6.1 Web攻击\n\nWeb攻击技术分析。\n\n6.2 WAF技术\n\nWAF防护原理。\n\n6.3 防护策略\n\nWeb防护策略。',
        pageCount: 35
      },
      {
        id: 'ch7',
        title: '第七章 实战案例',
        content: '7.1 入侵案例\n\n真实入侵案例分析。\n\n7.2 APT案例\n\nAPT攻击案例。\n\n7.3 防御案例\n\n成功防御案例。',
        pageCount: 35
      },
      {
        id: 'ch8',
        title: '第八章 安全策略',
        content: '8.1 安全战略\n\n企业安全战略。\n\n8.2 安全组织\n\n安全团队建设。\n\n8.3 安全成熟度\n\n安全成熟度模型。',
        pageCount: 30
      }
    ]
  },
  {
    id: 'art-of-intrusion',
    title: '反入侵的艺术',
    author: 'Kevin D. Mitnick',
    category: '网络攻防',
    cover: '反入侵',
    description: '四个志同道合的伙伴用口袋大小的计算机在拉斯维加大把挣钱。真实故事！都是作者Kevin D. Mitnick与黑客面谈后，根据他们的真实经历撰写的。',
    pages: 280,
    difficulty: '入门',
    publishYear: 2019,
    tags: ['入侵案例', '黑客故事', '安全意识', '真实案例'],
    rating: 4.8,
    readers: 18000,
    targetAudience: '安全爱好者、企业安全培训',
    prerequisites: ['无'],
    highlights: [
      '传奇黑客米特尼克作品',
      '真实黑客入侵故事',
      '第一手面谈记录',
      '安全意识培训教材'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 闯入银行',
        content: '1.1 发现漏洞\n\n银行系统漏洞发现。\n\n1.2 入侵过程\n\n详细入侵过程描述。\n\n1.3 被入侵的银行\n\n受害银行的故事。',
        pageCount: 35
      },
      {
        id: 'ch2',
        title: '第二章 入侵五角大楼',
        content: '2.1 目标锁定\n\n选择五角大楼作为目标。\n\n2.2 系统突破\n\n如何突破防御。\n\n2.3 后果\n\n入侵的后果。',
        pageCount: 35
      },
      {
        id: 'ch3',
        title: '第三章 网络窃贼',
        content: '3.1 信用卡盗窃\n\n信用卡信息窃取。\n\n3.2 诈骗手段\n\n各种诈骗方法。\n\n3.3 地下经济\n\n黑客地下经济。',
        pageCount: 30
      },
      {
        id: 'ch4',
        title: '第四章 硅谷窃贼',
        content: '4.1 技术天才\n\n技术天才的黑客之路。\n\n4.2 公司入侵\n\n入侵科技公司。\n\n4.3 商业机密\n\n商业机密窃取。',
        pageCount: 35
      },
      {
        id: 'ch5',
        title: '第五章 系统分析师',
        content: '5.1 内部威胁\n\n内部人员的威胁。\n\n5.2 权限滥用\n\n权限滥用案例。\n\n5.3 信任背叛\n\n信任的背叛。',
        pageCount: 30
      },
      {
        id: 'ch6',
        title: '第六章 入侵欧洲',
        content: '6.1 跨国攻击\n\n跨国黑客攻击。\n\n6.2 电信系统\n\n电信系统入侵。\n\n6.3 国际追捕\n\n国际执法合作。',
        pageCount: 30
      },
      {
        id: 'ch7',
        title: '第七章 防御策略',
        content: '7.1 经验教训\n\n从案例中学习。\n\n7.2 防御建议\n\n具体的防御建议。\n\n7.3 安全实践\n\n安全最佳实践。',
        pageCount: 25
      },
      {
        id: 'ch8',
        title: '第八章 未来展望',
        content: '8.1 攻击趋势\n\n未来攻击趋势。\n\n8.2 防御进化\n\n防御技术发展。\n\n8.3 安全未来\n\n网络安全的未来。',
        pageCount: 20
      }
    ]
  },
  {
    id: 'crypto-encryption-decryption',
    title: '黑客攻防：实战加密与解密',
    author: '叶绍琛',
    category: '密码学',
    cover: '实战加密解密',
    description: '从黑客攻防的专业角度，结合网络攻防中的实际案例，图文并茂地再现Web渗透涉及的密码获取与破解过程。',
    pages: 320,
    difficulty: '进阶',
    publishYear: 2020,
    tags: ['密码破解', '加密解密', 'Web渗透', 'Hash'],
    rating: 4.6,
    readers: 9000,
    targetAudience: '渗透测试工程师、密码学爱好者',
    prerequisites: ['Web安全基础', '密码学基础'],
    highlights: [
      '密码获取与破解全流程',
      'Web渗透实战案例',
      '各种哈希算法破解',
      '加密解密技术实战'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 密码概述',
        content: '1.1 密码的重要性\n\n密码在安全中的地位。\n\n1.2 密码分类\n\n各种密码类型。\n\n1.3 攻击方法\n\n密码攻击方法分类。',
        pageCount: 25
      },
      {
        id: 'ch2',
        title: '第二章 Web密码获取',
        content: '2.1 明文密码\n\n明文密码获取方法。\n\n2.2 数据库密码\n\n数据库密码提取。\n\n2.3 配置文件\n\n配置文件密码发现。',
        pageCount: 35
      },
      {
        id: 'ch3',
        title: '第三章 Hash破解',
        content: '3.1 MD5破解\n\nMD5哈希破解。\n\n3.2 SHA破解\n\nSHA系列哈希破解。\n\n3.3 其他Hash\n\n各种哈希类型破解。',
        pageCount: 40
      },
      {
        id: 'ch4',
        title: '第四章 在线密码破解',
        content: '4.1 暴力破解\n\n在线暴力破解。\n\n4.2 字典攻击\n\n字典生成与使用。\n\n4.3 验证码绕过\n\n验证码绕过技术。',
        pageCount: 35
      },
      {
        id: 'ch5',
        title: '第五章 加密算法分析',
        content: '5.1 对称加密\n\n对称加密算法分析。\n\n5.2 非对称加密\n\n公钥密码分析。\n\n5.3 哈希算法\n\n哈希算法碰撞。',
        pageCount: 40
      },
      {
        id: 'ch6',
        title: '第六章 密码分析工具',
        content: '6.1 Hashcat\n\nGPU哈希破解工具。\n\n6.2 John\n\nJohn the Ripper。\n\n6.3 Hydra\n\n在线密码爆破工具。',
        pageCount: 35
      },
      {
        id: 'ch7',
        title: '第七章 无线密码破解',
        content: '7.1 WEP破解\n\nWEP加密破解。\n\n7.2 WPA破解\n\nWPA/WPA2破解。\n\n7.3 WPS破解\n\nWPS漏洞利用。',
        pageCount: 35
      },
      {
        id: 'ch8',
        title: '第八章 密码保护',
        content: '8.1 安全密码\n\n设置安全密码。\n\n8.2 密码管理\n\n密码管理器使用。\n\n8.3 多因素认证\n\n多因素认证技术。',
        pageCount: 30
      }
    ]
  },
  {
    id: 'wireless-hacking',
    title: '无线网络黑客攻防',
    author: '杨哲',
    category: '无线安全',
    cover: '无线攻防',
    description: '以日趋严峻的无线网络安全为切入点，从常用的无线网络攻击环境搭建入手，循序渐进地剖析了无线网络安全及黑客技术涉及的各个方面。',
    pages: 350,
    difficulty: '进阶',
    publishYear: 2020,
    tags: ['无线网络', 'Wi-Fi安全', 'WPA破解', '无线渗透'],
    rating: 4.7,
    readers: 11000,
    targetAudience: '无线网络安全工程师、渗透测试工程师',
    prerequisites: ['网络基础', 'Linux基础'],
    highlights: [
      '15章覆盖无线安全全领域',
      'WEP/WPA破解详解',
      '无线DoS攻击',
      '蓝牙与RFID安全'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 无线网络基础',
        content: '1.1 Wi-Fi技术\n\n802.11标准概述。\n\n1.2 加密方式\n\nWEP、WPA、WPA2。\n\n1.3 无线网络架构\n\nAP、客户端、Ad-hoc。',
        pageCount: 30
      },
      {
        id: 'ch2',
        title: '第二章 环境搭建',
        content: '2.1 网卡选择\n\n支持监听模式的网卡。\n\n2.2 驱动安装\n\n无线网卡驱动配置。\n\n2.3 工具安装\n\n无线安全工具集合。',
        pageCount: 25
      },
      {
        id: 'ch3',
        title: '第三章 无线侦察',
        content: '3.1 网络发现\n\n无线网络扫描。\n\n3.2 客户端侦测\n\n无线客户端发现。\n\n3.3 信号分析\n\n无线信号分析。',
        pageCount: 30
      },
      {
        id: 'ch4',
        title: '第四章 WEP破解',
        content: '4.1 WEP原理\n\nWEP加密原理。\n\n4.2 IVs捕获\n\n初始化向量捕获。\n\n4.3 密码破解\n\nWEP密码破解。',
        pageCount: 35
      },
      {
        id: 'ch5',
        title: '第五章 WPA/WPA2破解',
        content: '5.1 WPA原理\n\nWPA/WPA2加密原理。\n\n5.2 握手包捕获\n\n四步握手捕获。\n\n5.3 字典破解\n\nWPA密码破解。',
        pageCount: 40
      },
      {
        id: 'ch6',
        title: '第六章 WPS破解',
        content: '6.1 WPS原理\n\nWPS工作原理。\n\n6.2 PIN破解\n\nWPS PIN码破解。\n\n6.3 防护措施\n\nWPS安全设置。',
        pageCount: 25
      },
      {
        id: 'ch7',
        title: '第七章 无线攻击',
        content: '7.1 无线DoS\n\n无线拒绝服务攻击。\n\n7.2 Evil Twin\n\n邪恶双胞胎攻击。\n\n7.3 中间人攻击\n\n无线MITM攻击。',
        pageCount: 35
      },
      {
        id: 'ch8',
        title: '第八章 蓝牙与RFID',
        content: '8.1 蓝牙安全\n\n蓝牙安全漏洞。\n\n8.2 RFID安全\n\nRFID攻击技术。\n\n8.3 NFC安全\n\nNFC安全问题。',
        pageCount: 30
      }
    ]
  },
  {
    id: 'car-hacking',
    title: '汽车黑客大曝光',
    author: 'Craig Smith',
    category: '物联网安全',
    cover: '车联网',
    description: '现代的汽车比以往任何时候都更加计算机化。信息娱乐和导航系统、Wi-Fi、软件自动更新，都令数以百万计的人受到攻击威胁。',
    pages: 280,
    difficulty: '高级',
    publishYear: 2021,
    tags: ['车联网', '汽车安全', 'CAN总线', 'IoT'],
    rating: 4.7,
    readers: 7000,
    targetAudience: '物联网安全研究员、汽车安全工程师',
    prerequisites: ['网络基础', 'C语言基础'],
    highlights: [
      '汽车安全领域经典',
      'CAN总线深度剖析',
      '车载系统攻击',
      '车联网安全'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 汽车安全概述',
        content: '1.1 汽车计算机化\n\n现代汽车的计算机系统。\n\n1.2 安全威胁\n\n汽车安全威胁模型。\n\n1.3 攻击面\n\n汽车攻击面分析。',
        pageCount: 25
      },
      {
        id: 'ch2',
        title: '第二章 CAN总线',
        content: '2.1 CAN协议\n\nCAN总线协议详解。\n\n2.2 CAN工具\n\nCAN总线分析工具。\n\n2.3 CAN逆向\n\nCAN总线逆向工程。',
        pageCount: 40
      },
      {
        id: 'ch3',
        title: '第三章 车载系统',
        content: '3.1 ECU\n\n电子控制单元分析。\n\n3.2 车机系统\n\n车载信息娱乐系统。\n\n3.3 固件分析\n\n固件提取与分析。',
        pageCount: 35
      },
      {
        id: 'ch4',
        title: '第四章 诊断接口',
        content: '4.1 OBD-II\n\nOBD诊断接口。\n\n4.2 UDS协议\n\n统一诊断服务。\n\n4.3 诊断攻击\n\n诊断服务攻击。',
        pageCount: 35
      },
      {
        id: 'ch5',
        title: '第五章 无线攻击',
        content: '5.1 蓝牙攻击\n\n车载蓝牙攻击。\n\n5.2 Wi-Fi攻击\n\n车载Wi-Fi攻击。\n\n5.3 蜂窝网络\n\n车联网蜂窝网络安全。',
        pageCount: 35
      },
      {
        id: 'ch6',
        title: '第六章 物理攻击',
        content: '6.1 接口利用\n\n物理接口攻击。\n\n6.2 调试接口\n\nJTAG/SWD调试。\n\n6.3 芯片攻击\n\n芯片级攻击技术。',
        pageCount: 30
      },
      {
        id: 'ch7',
        title: '第七章 车联网安全',
        content: '7.1 V2X安全\n\n车联网通信安全。\n\n7.2 车云安全\n\n车云连接安全。\n\n7.3 数据安全\n\n汽车数据保护。',
        pageCount: 30
      },
      {
        id: 'ch8',
        title: '第八章 汽车安全防护',
        content: '8.1 安全架构\n\n汽车安全架构设计。\n\n8.2 入侵检测\n\n车载入侵检测系统。\n\n8.3 安全标准\n\n汽车安全标准法规。',
        pageCount: 25
      }
    ]
  },
  {
    id: 'emergency-response-guide',
    title: '网络安全应急响应实战指南',
    author: '应急响应专家组',
    category: '护网蓝队',
    cover: '应急响应',
    description: '全面的网络安全应急响应实战指南，涵盖勒索病毒、数据泄露、DDoS攻击等常见安全事件的应急处置流程与实操方法。',
    pages: 480,
    difficulty: '进阶',
    publishYear: 2024,
    tags: ['应急响应', '护网蓝队', '勒索病毒', '数据泄露', '溯源分析'],
    rating: 4.9,
    readers: 28000,
    targetAudience: '应急响应工程师、蓝队队员、安全运维人员',
    prerequisites: ['网络安全基础', '操作系统基础'],
    highlights: [
      'PDCERF应急响应模型详解',
      '勒索病毒应急处置全流程',
      '数据泄露事件溯源分析',
      '应急响应工具箱使用指南'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 应急响应概述',
        content: '1.1 什么是应急响应\n\n应急响应是指组织为了应对突发安全事件而进行的一系列工作，包括预防、监测、处置、恢复和总结。\n\n1.2 应急响应的重要性\n\n- 减少安全事件造成的损失\n- 快速恢复业务系统正常运行\n- 防范类似事件再次发生\n- 满足合规性要求\n\n1.3 PDCERF模型\n\n- 准备阶段（Preparation）\n- 检测阶段（Detection）\n- 遏制阶段（Containment）\n- 根除阶段（Eradication）\n- 恢复阶段（Recovery）\n- 跟踪阶段（Follow-up）\n\n1.4 应急响应组织架构\n\n- 应急响应领导小组\n- 应急响应技术组\n- 应急响应保障组\n- 应急响应公关组',
        pageCount: 35
      },
      {
        id: 'ch2',
        title: '第二章 应急准备工作',
        content: '2.1 应急预案制定\n\n- 应急预案的分类和级别\n- 应急预案的主要内容\n- 应急预案的评审与更新\n- 应急演练的组织与实施\n\n2.2 应急响应工具准备\n\n- 系统工具：进程查看、网络连接、服务管理\n- 取证工具：磁盘镜像、内存取证、日志分析\n- 恶意代码分析工具：沙箱、反病毒、逆向工具\n- 网络分析工具：Wireshark、tcpdump、流量分析平台\n\n2.3 应急响应知识库\n\n- 常见攻击手法知识库\n- 漏洞信息库\n- 威胁情报库\n- 处置经验库\n\n2.4 应急联络机制\n\n- 内部联络人清单\n- 外部支援联络方式\n- 监管部门上报渠道\n- 应急响应服务供应商',
        pageCount: 45
      },
      {
        id: 'ch3',
        title: '第三章 安全事件检测与研判',
        content: '3.1 安全事件监测手段\n\n- 安全设备告警：防火墙、IDS/IPS、WAF、EDR\n- 日志分析：系统日志、应用日志、安全日志\n- 流量分析：异常流量、恶意通信、C2连接\n- 威胁情报：IOC匹配、威胁狩猎\n\n3.2 常见安全事件类型\n\n- 恶意代码感染：病毒、木马、勒索软件\n- 网络攻击：DDoS、SQL注入、XSS\n- 数据泄露：数据窃取、数据泄露\n- 未授权访问：账号被盗、权限提升\n- 内网渗透：横向移动、域控攻陷\n\n3.3 安全事件研判方法\n\n- 事件真实性验证\n- 影响范围评估\n- 危害程度分析\n- 事件定级（一般、较大、重大、特别重大）\n\n3.4 误报排除技巧\n\n- 告警上下文分析\n- 多源数据交叉验证\n- 白名单机制\n- 基线对比分析',
        pageCount: 55
      },
      {
        id: 'ch4',
        title: '第四章 勒索病毒应急处置',
        content: '4.1 勒索病毒概述\n\n- 勒索病毒的发展历史\n- 常见勒索病毒家族：WannaCry、LockBit、Conti、BlackCat\n- 勒索病毒的传播途径\n- 勒索病毒的加密原理\n\n4.2 勒索病毒应急处置流程\n\n第一步：隔离受感染主机\n- 立即断开网络连接\n- 禁用无线网卡\n- 拔出网线\n- 防止横向扩散\n\n第二步：保护现场证据\n- 记录系统时间\n- 截屏勒索信息\n- 保存系统日志\n- 内存镜像（如果条件允许）\n\n第三步：病毒样本采集\n- 定位病毒文件位置\n- 计算文件哈希值\n- 备份病毒样本（加密存储）\n- 上传到威胁情报平台分析\n\n第四步：影响范围排查\n- 检查同网段主机\n- 检查共享文件夹\n- 检查域控服务器\n- 检查备份系统\n\n4.3 勒索病毒解密可能性评估\n\n- 在线解密工具查询\n- 病毒家族分析\n- 加密算法分析\n- 密钥恢复可能性\n\n4.4 系统恢复方案\n\n- 从备份恢复（首选方案）\n- 解密工具恢复（如果可用）\n- 重装系统恢复\n- 数据重建方案\n\n4.5 勒索病毒防范措施\n\n- 补丁管理：及时安装系统补丁\n- 终端防护：部署EDR/XDR\n- 邮件安全：防钓鱼邮件过滤\n- 数据备份：3-2-1备份策略\n- 访问控制：最小权限原则',
        pageCount: 60
      },
      {
        id: 'ch5',
        title: '第五章 数据泄露事件应急处置',
        content: '5.1 数据泄露事件类型\n\n- 外部攻击导致的数据泄露\n- 内部人员数据泄露\n- 第三方数据泄露\n- 公开配置错误导致泄露\n\n5.2 数据泄露检测方法\n\n- 数据泄露监控工具\n- 暗网监控\n- 异常数据传输检测\n- 数据库审计\n\n5.3 数据泄露应急处置流程\n\n第一步：遏制数据泄露\n- 关闭泄露源\n- 封禁相关账号\n- 切断数据传输通道\n- 修改相关密码密钥\n\n第二步：泄露范围评估\n- 确定泄露数据类型\n- 统计泄露数据量\n- 评估受影响用户/组织数量\n- 评估数据敏感级别\n\n第三步：溯源分析\n- 攻击路径溯源\n- 攻击时间线还原\n- 攻击者画像分析\n- 泄露点确认\n\n5.4 数据泄露通知要求\n\n- 监管部门上报时限\n- 用户通知要求\n- 公众沟通策略\n- 法律合规风险评估\n\n5.5 数据泄露后的整改措施\n\n- 漏洞修复\n- 权限整改\n- 数据分类分级\n- 数据防泄漏（DLP）部署',
        pageCount: 55
      },
      {
        id: 'ch6',
        title: '第六章 DDoS攻击应急处置',
        content: '6.1 DDoS攻击类型\n\n- 网络层DDoS：SYN洪水、UDP洪水、ICMP洪水\n- 传输层DDoS：TCP连接耗尽\n- 应用层DDoS：HTTP洪水、CC攻击、慢速攻击\n- 反射放大攻击：DNS反射、NTP反射、SSDP反射\n\n6.2 DDoS攻击检测\n\n- 流量基线建立\n- 异常流量告警\n- 攻击类型识别\n- 攻击源分析\n\n6.3 DDoS攻击应急处置\n\n第一步：攻击确认与评估\n- 确认是DDoS攻击而非业务高峰\n- 评估攻击流量大小\n- 评估受影响业务范围\n- 评估攻击持续时间\n\n第二步：流量清洗\n- 启用运营商清洗服务\n- 部署本地清洗设备\n- 黑洞路由配置\n- 流量限速\n\n第三步：业务保障\n- 业务降级策略\n- 静态页面缓存\n- CDN加速\n- 多活调度\n\n6.4 DDoS防护体系建设\n\n- 运营商级清洗\n- CDN防护\n- 本地清洗设备\n- 应用层防护（WAF）\n- 弹性带宽',
        pageCount: 50
      },
      {
        id: 'ch7',
        title: '第七章 内网入侵应急处置',
        content: '7.1 内网入侵迹象\n\n- 异常账号登录\n- 异常进程运行\n- 异常网络连接\n- 敏感文件被访问\n- 域控异常日志\n\n7.2 内网入侵应急处置流程\n\n第一步：隔离失陷主机\n- 网络隔离\n- 账号禁用\n- 会话断开\n\n第二步：入侵路径分析\n- 初始入侵点确认\n- 横向移动路径还原\n- 权限提升方式分析\n- 权限维持手段排查\n\n第三步：影响范围确认\n- 失陷主机清单\n- 被盗账号清单\n- 被访问敏感数据\n- 被篡改系统文件\n\n7.3 域环境入侵处置\n\n- 域控安全检查\n- 域账号清理\n- 组策略核查\n- 域内主机批量排查\n\n7.4 系统加固与恢复\n\n- 漏洞补丁安装\n- 弱口令整改\n- 权限清理\n- 监控加强',
        pageCount: 55
      },
      {
        id: 'ch8',
        title: '第八章 应急响应溯源技术',
        content: '8.1 溯源分析概述\n\n- 溯源的目标与意义\n- 溯源的难度与挑战\n- 溯源的方法体系\n- 溯源结果的运用\n\n8.2 日志溯源分析\n\n- Windows事件日志分析\n- Linux系统日志分析\n- Web服务器日志分析\n- 安全设备日志分析\n- 日志关联分析技巧\n\n8.3 网络流量溯源\n\n- 全流量存储与回溯\n- 攻击流量特征分析\n- C2通信流量识别\n- 数据外发流量检测\n- 攻击链还原\n\n8.4 主机取证溯源\n\n- 进程分析\n- 启动项分析\n- 计划任务分析\n- 服务分析\n- 文件时间线分析\n- 内存取证\n\n8.5 攻击者画像\n\n- 攻击手法分析\n- 工具集分析\n- TTPs提取\n- 威胁归因分析',
        pageCount: 60
      },
      {
        id: 'ch9',
        title: '第九章 应急响应报告与复盘',
        content: '9.1 应急响应报告结构\n\n- 事件概述\n- 处置过程\n- 根因分析\n- 影响评估\n- 整改建议\n\n9.2 报告撰写技巧\n\n- 时间线清晰\n- 数据准确\n- 图文并茂\n- 结论明确\n- 建议可行\n\n9.3 应急复盘会议\n\n- 处置过程回顾\n- 经验教训总结\n- 存在问题分析\n- 改进措施制定\n\n9.4 持续改进\n\n- 应急预案更新\n- 防护体系优化\n- 人员能力提升\n- 工具平台升级',
        pageCount: 35
      }
    ]
  },
  {
    id: 'intrusion-detection-guide',
    title: '入侵检测与防御技术详解',
    author: '安全检测技术研究组',
    category: '护网蓝队',
    cover: '入侵检测',
    description: '深入讲解入侵检测系统（IDS）、入侵防御系统（IPS）的工作原理、部署方式、规则编写和实战应用，全面提升蓝队检测能力。',
    pages: 420,
    difficulty: '进阶',
    publishYear: 2024,
    tags: ['入侵检测', 'IDS', 'IPS', '护网蓝队', '威胁检测', '规则编写'],
    rating: 4.8,
    readers: 22000,
    targetAudience: '蓝队队员、安全运营工程师、安全分析师',
    prerequisites: ['网络安全基础', 'TCP/IP协议基础'],
    highlights: [
      'IDS/IPS工作原理深度解析',
      'Suricata/Snort规则编写实战',
      '常见攻击检测规则库',
      '误报/漏报优化技巧'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 入侵检测概述',
        content: '1.1 入侵检测的概念\n\n入侵检测是通过对计算机系统或网络中的关键点进行信息收集和分析，从中发现系统或网络中是否存在违反安全策略的行为和被攻击的迹象。\n\n1.2 入侵检测的发展历史\n\n- 第一代：基于主机的入侵检测（HIDS）\n- 第二代：基于网络的入侵检测（NIDS）\n- 第三代：入侵防御系统（IPS）\n- 第四代：下一代入侵检测（NGIDS）\n\n1.3 入侵检测技术分类\n\n- 基于特征的检测（Signature-based）\n- 基于异常的检测（Anomaly-based）\n- 基于状态的检测（Stateful protocol analysis）\n- 基于威胁情报的检测（Threat Intelligence）\n\n1.4 入侵检测系统部署位置\n\n- 网络边界处\n- 核心交换机旁\n- 服务器区域入口\n- 重要业务系统前端\n- 终端主机上',
        pageCount: 40
      },
      {
        id: 'ch2',
        title: '第二章 基于网络的入侵检测（NIDS）',
        content: '2.1 NIDS工作原理\n\n- 数据包捕获\n- 协议解析\n- 规则匹配\n- 告警生成\n\n2.2 主流NIDS产品\n\n- Snort：开源轻量级NIDS\n- Suricata：高性能多线程NIDS\n- Zeek（Bro）：网络安全监控平台\n- 商业产品：深信服、启明星辰、绿盟等\n\n2.3 网络流量捕获技术\n\n- 端口镜像（SPAN/RSPAN）\n- 网络分流器（TAP）\n- 混杂模式\n- 零拷贝技术\n\n2.4 协议解析深度\n\n- 二层协议解析\n- 三层协议解析\n- 四层协议解析\n- 应用层协议解析：HTTP、DNS、FTP、SMB等',
        pageCount: 50
      },
      {
        id: 'ch3',
        title: '第三章 Suricata规则编写实战',
        content: '3.1 Suricata规则结构\n\n一条完整的Suricata规则由以下几部分组成：\n- 动作（Action）：pass、drop、reject、alert\n- 协议（Protocol）：tcp、udp、icmp、http等\n- 源/目的地址：IP地址、IP段、any\n- 源/目的端口：端口号、端口范围、any\n- 方向（Direction）：-> 单向、<> 双向\n- 规则选项（Rule Options）：msg、sid、content、pcre等\n\n3.2 基础规则选项\n\n- msg：规则描述信息\n- sid：规则唯一标识\n- rev：规则版本号\n- classtype：规则分类\n- priority：优先级\n- reference：参考链接\n\n3.3 内容匹配选项\n\n- content：内容匹配\n- nocase：忽略大小写\n- depth：匹配深度\n- offset：匹配偏移\n- distance：两次匹配间距\n- within：匹配范围限制\n- pcre：正则表达式匹配\n\n3.4 高级规则选项\n\n- flow：流状态匹配\n- uricontent：URI内容匹配\n- dsize：数据包大小匹配\n- flags：TCP标志位匹配\n- itype：ICMP类型匹配\n- byte_test：字节测试\n- byte_jump：字节跳转\n\n3.5 实战：编写SQL注入检测规则\n\n示例规则：\nalert tcp any any -> any 80 (msg:"SQL Injection Attempt"; flow:to_server,established; uricontent:"SELECT"; nocase; uricontent:"FROM"; nocase; distance:0; classtype:web-application-attack; sid:1000001; rev:1;)',
        pageCount: 55
      },
      {
        id: 'ch4',
        title: '第四章 常见攻击检测规则',
        content: '4.1 Web攻击检测\n\n- SQL注入检测规则\n- XSS跨站脚本检测规则\n- 文件上传漏洞检测\n- 命令注入检测\n- 路径遍历检测\n- CSRF攻击检测\n- WebShell检测\n\n4.2 网络攻击检测\n\n- 端口扫描检测\n- 暴力破解检测\n- DDoS攻击检测\n- ARP欺骗检测\n- DNS隧道检测\n- ICMP隧道检测\n\n4.3 恶意代码检测\n\n- WebShell特征检测\n- 远控木马通信特征\n- 勒索软件流量特征\n- 挖矿程序检测\n- C2通信检测\n\n4.4 内网攻击检测\n\n- 横向移动检测\n- 域内枚举检测\n- Kerberoasting检测\n- AS-REP Roasting检测\n- 传递哈希（PtH）检测',
        pageCount: 60
      },
      {
        id: 'ch5',
        title: '第五章 误报与漏报优化',
        content: '5.1 误报产生原因\n\n- 规则编写不够精确\n- 正常业务流量特征与攻击相似\n- 编码/加密导致匹配失效\n- 业务特殊性\n\n5.2 误报处理方法\n\n- 白名单机制\n- 规则调优\n- 上下文关联\n- 基线学习\n\n5.3 漏报产生原因\n\n- 攻击手法未知（0day）\n- 加密传输无法检测\n- 规则覆盖不全\n- 攻击特征变种\n\n5.4 降低漏报策略\n\n- 多检测引擎结合\n- 威胁情报补充\n- 异常检测辅助\n- 红蓝对抗检验\n\n5.5 规则优化最佳实践\n\n- 定期回顾告警数据\n- 建立误报反馈机制\n- 持续迭代规则库\n- 版本控制规则文件',
        pageCount: 45
      },
      {
        id: 'ch6',
        title: '第六章 基于主机的入侵检测（HIDS）',
        content: '6.1 HIDS工作原理\n\n- 文件完整性监控（FIM）\n- 日志分析\n- 进程监控\n- 注册表监控（Windows）\n- 系统调用监控\n\n6.2 主流HIDS工具\n\n- OSSEC：开源HIDS\n- Wazuh：OSSEC增强版\n- Tripwire：文件完整性监控\n- AIDE：高级入侵检测环境\n- 商业EDR产品\n\n6.3 文件完整性监控\n\n- 关键系统文件监控\n- 配置文件监控\n- Web目录监控\n- 二进制文件监控\n- 哈希校验机制\n\n6.4 日志监控与分析\n\n- 系统日志监控\n- 认证日志监控\n- 应用日志监控\n- 异常行为检测\n\n6.5 实战：部署Wazuh HIDS\n\n- 服务端安装配置\n- 客户端安装部署\n- 规则配置与调优\n- 告警配置与通知',
        pageCount: 55
      },
      {
        id: 'ch7',
        title: '第七章 入侵防御系统（IPS）',
        content: '7.1 IPS工作原理\n\n- 串接部署模式\n- 实时阻断能力\n- 基于特征的阻断\n- 基于行为的阻断\n\n7.2 IPS部署模式\n\n- 透明模式（网桥模式）\n- 路由模式\n- 混合模式\n- 旁路监听+TCP重置\n\n7.3 IPS与IDS的区别\n\n- 部署方式不同：串接 vs 旁路\n- 响应方式不同：主动阻断 vs 被动告警\n- 性能要求不同：低延迟 vs 可容忍延迟\n- 误报影响不同：业务中断 vs 告警干扰\n\n7.4 IPS部署注意事项\n\n- 性能冗余设计\n- 高可用性部署\n- 灰度上线策略\n- 紧急旁路机制\n- 定期规则更新',
        pageCount: 40
      },
      {
        id: 'ch8',
        title: '第八章 高级检测技术',
        content: '8.1 基于异常的检测\n\n- 流量基线建立\n- 行为基线学习\n- 统计分析方法\n- 机器学习应用\n\n8.2 沙箱检测技术\n\n- 沙箱工作原理\n- 动态行为分析\n- 恶意代码家族判定\n- 沙箱绕过与对抗\n\n8.3 威胁情报检测\n\n- IOC匹配检测\n- TTPs模式识别\n- 威胁狩猎（Threat Hunting）\n- 情报驱动的检测\n\n8.4 UEBA用户实体行为分析\n\n- 用户行为基线\n- 异常行为检测\n- 风险评分机制\n- 内部威胁检测',
        pageCount: 45
      }
    ]
  },
  {
    id: 'threat-intelligence-guide',
    title: '威胁情报分析实战指南',
    author: '威胁情报研究中心',
    category: '护网蓝队',
    cover: '威胁情报',
    description: '全面介绍威胁情报的收集、分析、应用全流程，包括IOC管理、威胁狩猎、攻击者画像、APT组织追踪等实战技能。',
    pages: 380,
    difficulty: '进阶',
    publishYear: 2024,
    tags: ['威胁情报', '护网蓝队', 'APT', '威胁狩猎', 'IOC', 'ATT&CK'],
    rating: 4.7,
    readers: 18000,
    targetAudience: '威胁情报分析师、蓝队队员、安全研究员',
    prerequisites: ['网络安全基础', '入侵检测基础'],
    highlights: [
      '威胁情报全生命周期管理',
      'APT组织追踪与画像',
      '威胁狩猎实战方法论',
      'MITRE ATT&CK框架应用'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 威胁情报概述',
        content: '1.1 什么是威胁情报\n\n威胁情报是基于证据的知识，包括上下文、机制、指标、启示和可操作的建议，用于描述针对资产的现有或即将出现的威胁或危险。\n\n1.2 威胁情报的分类\n\n按类型分类：\n- 战略情报（Strategic Intelligence）\n- 运营情报（Operational Intelligence）\n- 战术情报（Tactical Intelligence）\n- 技术情报（Technical Intelligence）\n\n按来源分类：\n- 开源情报（OSINT）\n- 商业情报\n- 政府情报\n- 内部情报\n- 共享情报\n\n1.3 威胁情报的价值\n\n- 提升检测能力\n- 加快响应速度\n- 优化防御策略\n- 支撑风险决策\n- 了解威胁态势\n\n1.4 威胁情报发展趋势\n\n- AI/ML在威胁情报中的应用\n- 自动化情报运营\n- 情报共享生态建设\n- 攻击面管理（ASM）融合',
        pageCount: 40
      },
      {
        id: 'ch2',
        title: '第二章 威胁情报收集',
        content: '2.1 开源威胁情报源（OSINT）\n\n国外开源情报源：\n- VirusTotal：多引擎病毒扫描和IOC查询\n- AbuseIPDB：恶意IP数据库\n- Shodan：物联网搜索引擎\n- Censys：主机和证书搜索引擎\n- GreyNoise：噪音流量过滤\n- MITRE ATT&CK：攻击战术技术知识库\n\n国内开源情报源：\n- 微步在线威胁情报社区\n- 360威胁情报中心\n- 奇安信威胁情报中心\n- 安恒威胁情报中心\n- CNTVD国家信息安全漏洞共享平台\n\n2.2 暗网情报收集\n\n- 暗网论坛监控\n- 暗网市场监控\n- 数据泄露监控\n- 黑客组织监控\n\n2.3 漏洞情报收集\n\n- CVE漏洞库\n- CNNVD漏洞库\n- 漏洞披露平台\n- 安全厂商公告\n- 研究者博客\n\n2.4 情报收集工具\n\n- MISP：威胁情报平台\n- OpenCTI：开源威胁情报平台\n- TheHive：安全事件响应平台\n- 情报聚合工具',
        pageCount: 50
      },
      {
        id: 'ch3',
        title: '第三章 IOC管理与应用',
        content: '3.1 IOC概述\n\nIOC（Indicators of Compromise，失陷指标）是表示系统或网络已被入侵的 forensic 数据。\n\n常见IOC类型：\n- IP地址：恶意IP、C2服务器IP\n- 域名：恶意域名、C2域名、DGA域名\n- URL：恶意URL、钓鱼URL\n- 文件哈希：MD5、SHA1、SHA256\n- 证书：恶意SSL证书指纹\n- 注册表项：恶意软件注册表项\n- Mutex：互斥量\n\n3.2 IOC的生命周期\n\n- 发现阶段：通过各种渠道发现新的IOC\n- 验证阶段：验证IOC的真实性和恶意性\n- 发布阶段：将IOC分发给防护设备\n- 应用阶段：在检测和响应中使用IOC\n- 过期阶段：IOC失效后降级或移除\n\n3.3 IOC管理最佳实践\n\n- 去重与归一化\n- 标记与分类\n- 评分与优先级\n- 过期管理\n- 质量评估\n\n3.4 IOC在安全设备中的应用\n\n- 防火墙黑名单\n- IDS/IPS规则\n- EDR检测规则\n- SIEM关联分析\n- DNS安全防护',
        pageCount: 45
      },
      {
        id: 'ch4',
        title: '第四章 MITRE ATT&CK框架',
        content: '4.1 ATT&CK框架概述\n\nMITRE ATT&CK是一个基于真实观察的全球可访问的战术和技术知识库，被世界各地的企业和政府用作开发特定威胁模型和方法的基础。\n\n4.2 ATT&CK战术（Tactics）\n\n企业矩阵包含14个战术：\n- 初始访问（Initial Access）\n- 执行（Execution）\n- 持久化（Persistence）\n- 权限提升（Privilege Escalation）\n- 防御绕过（Defense Evasion）\n- 凭据访问（Credential Access）\n- 发现（Discovery）\n- 横向移动（Lateral Movement）\n- 收集（Collection）\n- 命令与控制（Command and Control）\n- 数据渗出（Exfiltration）\n- 影响（Impact）\n- 侦察（Reconnaissance）\n- 资源开发（Resource Development）\n\n4.3 ATT&CK技术（Techniques）\n\n每个战术下包含多个技术（Techniques），每个技术下可能包含子技术（Sub-techniques）。\n例如：\n- T1566 钓鱼（Phishing）\n  - T1566.001 鱼叉式钓鱼附件\n  - T1566.002 鱼叉式钓鱼链接\n  - T1566.003 语音钓鱼\n\n4.4 ATT&CK的应用场景\n\n- 威胁检测：基于ATT&CK设计检测规则\n- 红蓝对抗：红队模拟TTPs，蓝队检测TTPs\n- 差距评估：评估现有防护覆盖的技术点\n- 威胁情报：用ATT&CK描述攻击者TTPs\n- 安全运营：将告警映射到ATT&CK',
        pageCount: 50
      },
      {
        id: 'ch5',
        title: '第五章 APT组织与追踪',
        content: '5.1 APT概述\n\nAPT（Advanced Persistent Threat，高级持续性威胁）是指组织持续、秘密地对特定目标进行网络攻击的行为。\n\nAPT的特点：\n- 高级（Advanced）：攻击技术复杂，使用0day漏洞\n- 持续（Persistent）：长期潜伏，持续窃取数据\n- 威胁（Threat）：有组织、有目的、有资源支持\n\n5.2 知名APT组织介绍\n\n国内APT组织：\n- 海莲花（OceanLotus）：越南背景，针对中国政府和企业\n- 蓝宝菇（BlueMockingBird）：针对中国机构\n- 蔓灵花（BITTER）：针对南亚和中国\n\n国外APT组织：\n-  Equation Group：美国NSA背景\n- APT29（Cozy Bear）：俄罗斯背景\n- APT28（Fancy Bear）：俄罗斯背景\n- Lazarus Group：朝鲜背景\n\n5.3 APT组织追踪方法\n\n- 基础设施关联分析\n- TTPs模式匹配\n- 代码相似性分析\n- 攻击目标聚类\n- 语言/时区分析\n\n5.4 APT防御策略\n\n- 网络分段\n- 多因素认证\n- 终端检测与响应（EDR）\n- 邮件安全防护\n- 数据防泄漏\n- 威胁狩猎',
        pageCount: 50
      },
      {
        id: 'ch6',
        title: '第六章 威胁狩猎实战',
        content: '6.1 威胁狩猎概述\n\n威胁狩猎（Threat Hunting）是主动、迭代地搜索网络中逃避现有安全控制的高级威胁的过程。\n\n威胁狩猎与传统检测的区别：\n- 主动 vs 被动\n- 假设驱动 vs 告警驱动\n- 发现未知威胁 vs 发现已知威胁\n- 人力密集 vs 自动化\n\n6.2 威胁狩猎方法论\n\n基于假设的狩猎（Hypothesis-Driven Hunting）：\n1. 形成假设\n2. 收集数据\n3. 验证假设\n4. 调查发现\n5. 记录结果\n6. 改进检测\n\n6.3 威胁狩猎数据来源\n\n- 全流量数据\n- 终端EDR数据\n- 日志数据（系统、应用、安全）\n- DNS数据\n- 代理日志\n- 威胁情报\n\n6.4 常见狩猎场景\n\n- 横向移动检测狩猎\n- 权限维持狩猎\n- 数据渗出狩猎\n- C2通信狩猎\n- 内部威胁狩猎\n\n6.5 威胁狩猎成熟度模型\n\nLevel 0：初始级 - 主要依赖告警\nLevel 1：最小级 - 定期进行狩猎\nLevel 2：过程级 - 有正式的狩猎流程\nLevel 3：创新级 - 数据驱动的狩猎\nLevel 4：领先级 - 自动化狩猎运营',
        pageCount: 55
      },
      {
        id: 'ch7',
        title: '第七章 威胁情报平台建设',
        content: '7.1 威胁情报平台功能架构\n\n- 情报采集层：多源情报接入\n- 情报处理层：清洗、去重、关联、富化\n- 情报存储层：结构化存储、图数据库\n- 情报分析层：关联分析、聚类分析、态势分析\n- 情报应用层：检测、响应、狩猎、可视化\n\n7.2 主流威胁情报平台\n\n开源平台：\n- MISP：Malware Information Sharing Platform\n- OpenCTI：Open Cyber Threat Intelligence platform\n- TheHive：安全事件响应平台\n\n商业平台：\n- 微步在线威胁情报平台\n- 奇安信威胁情报平台\n- 360威胁情报中心\n\n7.3 情报运营体系\n\n- 情报团队建设\n- 情报工作流程\n- 情报质量度量\n- 情报效果评估\n\n7.4 情报共享与协作\n\n- 行业情报共享\n- 政企情报共享\n- 国际情报合作\n- 情报共享标准（STIX/TAXII）',
        pageCount: 45
      }
    ]
  },
  {
    id: 'security-operations-guide',
    title: '安全运营中心（SOC）建设实战',
    author: '安全运营专家组',
    category: '护网蓝队',
    cover: '安全运营',
    description: '全面讲解SOC安全运营中心的建设方法论、技术架构、人员团队、流程制度，以及日常运营和持续优化实践。',
    pages: 450,
    difficulty: '高级',
    publishYear: 2024,
    tags: ['SOC', '安全运营', '护网蓝队', 'SIEM', 'SOAR', '安全管理'],
    rating: 4.8,
    readers: 20000,
    targetAudience: '安全运营负责人、SOC经理、蓝队队长',
    prerequisites: ['网络安全基础', '安全设备使用经验'],
    highlights: [
      'SOC建设全流程方法论',
      'SIEM部署与规则优化',
      'SOAR编排自动化实践',
      '安全运营度量指标体系'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 SOC概述',
        content: '1.1 什么是SOC\n\nSOC（Security Operations Center，安全运营中心）是组织中负责网络安全监测、分析、响应和运营的集中化团队和设施。\n\n1.2 SOC的核心职能\n\n- 安全监测：7x24小时安全监控\n- 威胁检测：发现安全威胁和入侵行为\n- 应急响应：安全事件的快速处置\n- 漏洞管理：漏洞的发现、跟踪和修复\n- 合规管理：满足等保、ISO27001等合规要求\n- 安全报表：向上级和监管部门汇报\n\n1.3 SOC的发展阶段\n\n第一阶段：设备堆叠阶段\n- 采购了各种安全设备\n- 各自为战，缺乏联动\n- 告警量大，人力不足\n\n第二阶段：平台整合阶段\n- 部署SIEM平台\n- 日志集中收集分析\n- 告警关联分析\n- 初步的运营流程\n\n第三阶段：智能运营阶段\n- 引入SOAR自动化编排\n- 威胁情报驱动检测\n- 威胁狩猎主动发现\n- 数据化运营度量\n\n第四阶段：自适应安全阶段\n- AI驱动的智能检测\n- 自动化响应处置\n- 持续自适应风险与信任评估（CARTA）\n\n1.4 SOC建设模式\n\n- 自建SOC：自己建设团队和平台\n- 外包SOC：外包给专业安全厂商\n- 混合SOC：自建+外包结合\n- 云SOC：基于云的安全运营服务',
        pageCount: 45
      },
      {
        id: 'ch2',
        title: '第二章 SOC技术架构',
        content: '2.1 SOC技术架构分层\n\n- 数据采集层：日志、流量、终端数据采集\n- 数据处理层：清洗、归一化、存储\n- 检测分析层：SIEM、UEBA、威胁情报\n- 响应处置层：SOAR、工单、自动化\n- 展示呈现层：态势感知、报表、可视化\n\n2.2 数据采集架构\n\n- 日志采集：Syslog、Agent、API、文件采集\n- 流量采集：镜像流量、NetFlow、探针\n- 终端采集：EDR Agent、HIDS\n- 云环境采集：云API、云日志服务\n\n2.3 SIEM平台架构\n\n- 采集层：各类日志采集器\n- 处理层：日志解析、归一化、富化\n- 存储层：全文检索、时序数据库\n- 分析层：关联规则、异常检测、威胁情报\n- 展示层：Dashboard、报表、告警\n\n2.4 主流SIEM产品\n\n商业产品：\n- Splunk Enterprise Security\n- IBM QRadar\n- ArcSight\n- 奇安信NGSOC\n- 深信服SIP\n- 绿盟SAS\n\n开源方案：\n- ELK Stack（Elasticsearch + Logstash + Kibana）\n- Graylog\n- Apache Metron\n\n2.5 SOAR架构\n\n- 剧本（Playbook）：编排工作流\n- 应用（App）：第三方系统集成\n- 案例（Case）：事件管理\n- 指标（Metric）：度量指标',
        pageCount: 55
      },
      {
        id: 'ch3',
        title: '第三章 SIEM部署与规则优化',
        content: '3.1 SIEM部署规划\n\n- 数据源梳理：哪些设备/系统需要接入\n- 日志量评估：每天日志量、峰值流量\n- 存储规划：存储周期、存储容量、分层存储\n- 性能规划：EPS（每秒事件数）、查询性能\n\n3.2 日志源接入最佳实践\n\n网络设备：\n- 防火墙：流量日志、威胁日志、操作日志\n- 交换机/路由器：操作日志、认证日志\n- IDS/IPS：告警日志\n- WAF：Web攻击日志\n\n服务器：\n- Windows系统：安全日志、系统日志、应用日志\n- Linux系统：syslog、auth.log、secure日志\n- 数据库：审计日志、操作日志\n\n应用系统：\n- Web服务器：access.log、error.log\n- 业务应用：操作日志、审计日志\n\n安全产品：\n- EDR：终端告警、进程事件\n- 邮件网关：邮件日志、病毒日志\n- 漏洞扫描器：扫描结果\n\n3.3 日志解析与归一化\n\n- 日志字段提取\n- 字段映射（标准化字段名）\n- 时间格式统一\n- 数据类型转换\n- 日志分类打标\n\n3.4 关联规则编写\n\n常见关联场景：\n- 暴力破解：同一IP短时间内多次登录失败\n- 端口扫描：同一IP短时间内访问大量端口\n- 横向移动：同一账号在多台主机登录\n- 数据外泄：短时间内大量数据上传\n- Webshell：文件上传+异常命令执行\n\n3.5 告警优化与降噪\n\n- 误报白名单\n- 告警聚合\n- 告警抑制\n- 告警分级\n- 优先级计算',
        pageCount: 60
      },
      {
        id: 'ch4',
        title: '第四章 SOAR安全编排自动化响应',
        content: '4.1 SOAR概述\n\nSOAR（Security Orchestration, Automation and Response，安全编排自动化与响应）是将安全运营中的各种工具、流程和人员进行编排和自动化，以提高安全运营效率和响应速度的技术。\n\n4.2 SOAR核心能力\n\n- 编排（Orchestration）：连接和协调各种安全工具\n- 自动化（Automation）：将重复性工作自动化\n- 响应（Response）：安全事件的响应处置\n- 案例管理（Case Management）：事件全生命周期管理\n\n4.3 常见自动化场景\n\n告警 enrichment：\n- 自动查询IP信誉\n- 自动查询域名信息\n- 自动查询文件哈希\n- 自动查威胁情报\n\n自动处置：\n- 自动封禁恶意IP\n- 自动禁用被盗账号\n- 自动隔离感染主机\n- 自动阻断恶意域名\n\n工单自动化：\n- 自动创建工单\n- 自动分配工单\n- 自动通知相关人员\n- 自动跟踪工单状态\n\n4.4 剧本（Playbook）设计\n\n剧本设计原则：\n- 从简单到复杂\n- 先人工确认后全自动\n- 灰度验证逐步推广\n- 定期回顾优化\n\n常见剧本：\n- 钓鱼邮件处置剧本\n- 勒索病毒处置剧本\n- 暴力破解处置剧本\n- 数据泄露处置剧本\n\n4.5 主流SOAR产品\n\n商业产品：\n- Phantom（Splunk）\n- Demisto（Palo Alto）\n- 奇安信SOAR\n- 深信服SOAR\n\n开源产品：\n- Shuffle\n- Cortex XSOAR社区版',
        pageCount: 50
      },
      {
        id: 'ch5',
        title: '第五章 SOC团队建设',
        content: '5.1 SOC组织架构\n\nSOC经理：\n- 整体负责SOC运营\n- 团队管理与建设\n- 预算与资源协调\n- 向上级汇报\n\n安全分析师（L1/L2/L3）：\n- L1分析师：7x24值守，告警初筛\n- L2分析师：事件深度分析与处置\n- L3分析师：高级威胁分析、威胁狩猎\n\n应急响应工程师：\n- 重大事件应急响应\n- 溯源分析\n- 现场支持\n\n威胁情报分析师：\n- 威胁情报收集分析\n- IOC运营\n- APT追踪\n\n安全运营工程师：\n- 平台运维\n- 规则优化\n- 工具开发\n\n5.2 人员能力要求\n\nL1分析师能力要求：\n- 网络安全基础知识\n- 常见攻击类型了解\n- 安全设备基本操作\n- 基本的日志分析能力\n\nL2分析师能力要求：\n- 深入理解攻击手法\n- 熟练使用分析工具\n- 应急响应能力\n- 溯源分析基础\n\nL3分析师能力要求：\n- 高级威胁检测能力\n- 威胁狩猎能力\n- 逆向分析/恶意代码分析\n- 漏洞研究能力\n\n5.3 人员培训与成长\n\n- 入职培训体系\n- 定期技能培训\n- CTF比赛练兵\n- 红蓝对抗演练\n- 技术分享会\n\n5.4 人员排班与值守\n\n- 7x24值守排班\n- 交接班制度\n- 值班管理制度\n- 应急待命机制',
        pageCount: 50
      },
      {
        id: 'ch6',
        title: '第六章 安全运营流程制度',
        content: '6.1 安全运营流程体系\n\n- 监测预警流程\n- 事件分级分类标准\n- 事件响应处置流程\n- 工单管理流程\n- 漏洞管理流程\n- 变更管理流程\n- 汇报沟通流程\n\n6.2 事件分级标准\n\n特别重大事件（I级）：\n- 核心业务系统大面积瘫痪\n- 大量敏感数据泄露\n- 造成重大经济损失或社会影响\n\n重大事件（II级）：\n- 重要业务系统中断\n- 部分敏感数据泄露\n- 造成较大影响\n\n较大事件（III级）：\n- 一般业务系统受影响\n- 非核心数据泄露\n- 影响范围有限\n\n一般事件（IV级）：\n- 单个终端受感染\n- 尝试性攻击扫描\n- 无实际损失\n\n6.3 事件响应流程\n\n1. 告警发现与确认\n2. 事件定级\n3. 启动响应\n4. 遏制与根除\n5. 恢复与重建\n6. 调查与溯源\n7. 总结与改进\n\n6.4 日常运营制度\n\n- 每日安全简报\n- 每周运营周报\n- 每月运营月报\n- 每季度运营复盘\n- 年度安全报告\n\n6.5 质量保障体系\n\n- 服务水平协议（SLA）\n- 关键绩效指标（KPI）\n- 质量抽检机制\n- 持续改进机制',
        pageCount: 45
      },
      {
        id: 'ch7',
        title: '第七章 安全运营度量指标',
        content: '7.1 度量指标体系框架\n\n- 监测类指标\n- 检测类指标\n- 响应类指标\n- 运营类指标\n- 效果类指标\n\n7.2 监测类指标\n\n- 日志接入覆盖率\n- 日志完整性\n- 日志正常率\n- 监控覆盖率\n- 告警总量\n\n7.3 检测类指标\n\n- 检测率\n- 误报率\n- 漏报率\n- 平均检测时间（MTTD）\n- 告警信噪比\n\n7.4 响应类指标\n\n- 平均响应时间（MTTR）\n- 平均遏制时间\n- 平均恢复时间\n- 处置完成率\n- SLA达标率\n\n7.5 运营类指标\n\n- 工单处理量\n- 事件数量趋势\n- 漏洞修复率\n- 安全培训覆盖率\n- 团队人效\n\n7.6 效果类指标\n\n- 安全事件发生率\n- 重大安全事件数量\n- 数据泄露事件数量\n- 风险降低程度\n- 业务保障能力',
        pageCount: 40
      }
    ]
  },
  {
    id: 'log-forensics-guide',
    title: '日志分析与数字取证实战',
    author: '取证技术研究组',
    category: '护网蓝队',
    cover: '取证技术',
    description: '深入讲解Windows/Linux系统日志、Web日志、网络流量日志的分析技巧，以及磁盘取证、内存取证、网络取证等数字取证技术。',
    pages: 460,
    difficulty: '进阶',
    publishYear: 2024,
    tags: ['日志分析', '数字取证', '护网蓝队', '溯源分析', '内存取证'],
    rating: 4.8,
    readers: 19000,
    targetAudience: '应急响应工程师、取证分析师、蓝队队员',
    prerequisites: ['操作系统基础', '网络安全基础'],
    highlights: [
      'Windows/Linux日志深度分析',
      'Web攻击日志溯源技巧',
      '磁盘与内存取证实战',
      '取证工具使用指南'
    ],
    chapters: [
      {
        id: 'ch1',
        title: '第一章 数字取证概述',
        content: '1.1 数字取证的概念\n\n数字取证（Digital Forensics）是指对计算机、网络、移动设备等数字设备中存在的电子数据进行识别、收集、保存、分析和呈堂的过程。\n\n1.2 数字取证的原则\n\n- 合法性原则：取证过程符合法律规定\n- 完整性原则：证据完整，未被篡改\n- 真实性原则：证据真实可靠\n- 关联性原则：证据与案件相关\n- 可重复性原则：取证过程可重复验证\n\n1.3 数字取证的分类\n\n按取证对象分类：\n- 主机取证：计算机、服务器取证\n- 网络取证：网络流量、网络设备取证\n- 移动取证：手机、平板等移动设备取证\n- 物联网取证：IoT设备取证\n- 云取证：云计算环境取证\n\n按取证目的分类：\n- 犯罪取证：为刑事诉讼收集证据\n- 应急取证：为应急响应收集信息\n- 合规取证：为合规审计收集证据\n- 内部调查取证：为内部调查收集证据\n\n1.4 取证工具链\n\n- 证据收集工具：dd、FTK Imager、EnCase\n- 证据分析工具：Autopsy、X-Ways Forensics\n- 内存取证工具：Volatility、Redline\n- 网络取证工具：Wireshark、NetworkMiner\n- 日志分析工具：ELK、Splunk',
        pageCount: 40
      },
      {
        id: 'ch2',
        title: '第二章 Windows系统日志分析',
        content: '2.1 Windows日志体系\n\n- 系统日志（System）：系统组件运行日志\n- 应用日志（Application）：应用程序运行日志\n- 安全日志（Security）：安全审计日志\n- 安装日志（Setup）：安装相关日志\n- 转发事件（Forwarded Events）：转发的其他主机日志\n\n2.2 重要安全事件ID\n\n登录注销相关：\n- 4624：账户登录成功\n- 4625：账户登录失败\n- 4634：账户注销\n- 4647：用户发起注销\n- 4672：使用特殊权限登录\n- 4675：敏感特权使用\n- 4720：创建用户账户\n- 4722：启用用户账户\n- 4724：尝试重置密码\n- 4728：成员添加到启用安全的全局组\n- 4732：成员添加到启用安全的本地组\n\n对象访问相关：\n- 4656：请求对象的句柄\n- 4660：删除对象\n- 4663：尝试访问对象\n\n策略变更相关：\n- 4719：系统审计策略更改\n- 4738：用户帐户已更改\n\n2.3 登录类型详解\n\n登录类型2：交互式登录（本地登录）\n登录类型3：网络登录（共享文件夹、IIS等）\n登录类型4：批处理登录（计划任务）\n登录类型5：服务登录（服务启动）\n登录类型7：解锁登录（屏幕保护解锁）\n登录类型8：网络明文登录（IIS基本认证）\n登录类型9：新凭据登录（runas /netonly）\n登录类型10：远程交互式登录（RDP/终端服务）\n登录类型11：缓存交互式登录（使用缓存凭据）\n\n2.4 日志分析实战\n\n暴力破解分析：\n- 筛选4625事件\n- 统计同一IP/账号的失败次数\n- 分析时间分布\n- 查找是否有后续成功登录\n\n横向移动分析：\n- 4624事件中的登录类型3/10\n- 同一账号在多台主机登录\n- 异常登录时间分析\n- 源IP地址追踪\n\n权限提升分析：\n- 4672特权登录事件\n- 新创建的服务（7045事件）\n- 计划任务创建\n- 注册表Run键修改',
        pageCount: 55
      },
      {
        id: 'ch3',
        title: '第三章 Linux系统日志分析',
        content: '3.1 Linux日志体系\n\n主要日志文件：\n- /var/log/syslog：系统主日志（Debian/Ubuntu）\n- /var/log/messages：系统主日志（CentOS/RHEL）\n- /var/log/auth.log：认证日志（Debian/Ubuntu）\n- /var/log/secure：安全日志（CentOS/RHEL）\n- /var/log/nginx/：Nginx日志\n- /var/log/apache2/：Apache日志\n- /var/log/cron：计划任务日志\n- /var/log/btmp：失败登录记录\n- /var/log/wtmp：登录记录\n- /var/run/utmp：当前登录用户\n\n3.2 认证日志分析\n\n关键字段：\n- 时间戳\n- 主机名\n- 进程名/ID\n- 认证结果\n- 用户名\n- 源IP\n- 认证方式\n\nSSH登录分析：\n- 成功登录：Accepted password for ... from ...\n- 失败登录：Failed password for ... from ...\n- 非法用户：Invalid user ... from ...\n- 端口扫描：Connection closed by authenticating user ...\n\n分析技巧：\n- 统计失败登录IP Top N\n- 统计被暴力破解的账号\n- 查找异常时间登录\n- 查找异常地点登录\n\n3.3 历史命令分析\n\n- ~/.bash_history：Bash历史\n- ~/.zsh_history：Zsh历史\n- history命令查看\n- 历史命令时间戳设置\n- 不可删除的历史记录\n\n3.4 系统痕迹分析\n\n- 进程分析：ps、top\n- 网络连接：netstat、ss\n- 端口监听：lsof -i\n- 启动项：systemd、init.d、rc.local\n- 计划任务：crontab、cron.d\n- 服务：systemctl list-units --type=service\n- 内核模块：lsmod\n- 后门排查：rkhunter、chkrootkit',
        pageCount: 50
      },
      {
        id: 'ch4',
        title: '第四章 Web日志分析',
        content: '4.1 Web日志格式\n\nNginx/Apache常见日志格式：\n- 通用日志格式（Common Log Format）\n- 组合日志格式（Combined Log Format）\n- 自定义日志格式\n\n典型日志字段：\n- 客户端IP\n- 时间戳\n- 请求方法\n- 请求URL\n- HTTP协议版本\n- 响应状态码\n- 响应字节数\n- Referer\n- User-Agent\n\n4.2 Web攻击日志特征\n\nSQL注入特征：\n- URL/POST中包含SELECT、UNION、AND、OR等SQL关键字\n- 单引号、双引号、注释符（--、/*）\n- OR 1=1、sleep()、benchmark()等典型注入语句\n\nXSS特征：\n- <script>、javascript:、onerror、onload等\n- alert、document.cookie等\n- <img src=x onerror=...>等变形\n\n文件上传特征：\n- .php、.asp、.jsp、.aspx等脚本后缀\n- multipart/form-data请求\n- 上传路径可访问\n\n命令注入特征：\n- ;、|、&&、||等命令连接符\n- system()、exec()、passthru()等函数\n- whoami、id、cat /etc/passwd等命令\n\n4.3 日志分析工具\n\n- awk/sed/grep：命令行日志分析\n- goaccess：实时Web日志分析\n- ELK Stack：日志平台\n- Splunk：商业日志平台\n- AWStats：日志统计工具\n\n4.4 实战：Web攻击溯源\n\n1. 确定攻击时间范围\n2. 筛选攻击特征日志\n3. 统计攻击IP\n4. 分析攻击路径\n5. 还原攻击过程\n6. 查找攻击入口点\n7. 评估受影响范围',
        pageCount: 55
      },
      {
        id: 'ch5',
        title: '第五章 磁盘取证',
        content: '5.1 磁盘取证基础\n\n- 磁盘镜像制作原则：只读、完整、校验\n- 镜像格式：RAW（dd）、E01（EnCase）、AFF\n- 哈希校验：MD5、SHA1、SHA256\n- 写保护设备：硬件写保护、软件写保护\n\n5.2 磁盘镜像工具\n\n- dd：Linux/Unix内置工具\n  语法：dd if=/dev/sda of=/evidence/sda.dd bs=4M conv=noerror,sync\n\n- FTK Imager：Windows下常用镜像工具\n- ddrescue：损坏磁盘镜像工具\n- Guymager：Linux下图形化镜像工具\n\n5.3 文件系统分析\n\nWindows文件系统：\n- FAT32\n- NTFS：MFT、ADS、USN日志\n- ReFS\n\nLinux文件系统：\n- ext2/ext3/ext4\n- XFS\n- Btrfs\n\n5.4 NTFS深入分析\n\n- MFT（主文件表）\n- $MFT、$MFTMirr\n- 属性类型：$STANDARD_INFORMATION、$FILE_NAME、$DATA\n- 备用数据流（ADS）\n- USN变更日志\n- 回收站分析\n- Prefetch预读取文件\n- LNK快捷方式文件\n- Jumplists跳转列表\n\n5.5 文件恢复\n\n- 已删除文件恢复\n- 格式化恢复\n- RAW恢复\n- 碎片文件恢复\n\n5.6 取证分析工具\n\n- Autopsy：开源数字取证平台\n- X-Ways Forensics：商业取证工具\n- FTK：Forensic Toolkit\n- EnCase：经典取证工具',
        pageCount: 55
      },
      {
        id: 'ch6',
        title: '第六章 内存取证',
        content: '6.1 内存取证概述\n\n内存取证是对计算机的内存（RAM）进行镜像和分析，以获取系统运行状态、进程、网络连接、加密密钥等信息的取证技术。\n\n内存取证的价值：\n- 获取运行中的进程信息\n- 发现无文件恶意软件（Fileless Malware）\n- 获取网络连接信息\n- 提取加密密钥\n- 获取内存中的密码\n- 发现内核级Rootkit\n\n6.2 内存镜像工具\n\nWindows内存镜像：\n- WinPmem\n- DumpIt\n- FTK Imager\n- Memoryze\n\nLinux内存镜像：\n- LiME（Linux Memory Extractor）\n- /dev/mem（部分系统）\n- fmem\n\n6.3 Volatility内存取证框架\n\nVolatility是最流行的开源内存取证框架，支持Windows、Linux、MacOS等系统。\n\n常用插件：\n- imageinfo：获取镜像信息\n- pslist：列出进程\n- pstree：进程树\n- psscan：扫描进程（可发现隐藏进程）\n- netscan：网络连接扫描\n- cmdscan：命令历史\n- consoles：控制台历史\n- hashdump：提取密码哈希\n- malfind：查找可疑内存\n- filescan：扫描文件\n- handles：句柄列表\n- svcscan：服务扫描\n- modscan：驱动模块扫描\n\n6.4 实战：恶意代码内存分析\n\n1. 获取内存镜像\n2. 确认系统版本（imageinfo）\n3. 进程分析（pslist/psscan）\n4. 网络连接分析（netscan）\n5. DLL分析（dlllist）\n6. 注入检测（malfind）\n7. 服务分析（svcscan）\n8. 驱动分析（modscan）\n9. 命令历史（cmdscan/consoles）',
        pageCount: 55
      },
      {
        id: 'ch7',
        title: '第七章 网络取证',
        content: '7.1 网络取证概述\n\n网络取证是对网络流量进行捕获、记录和分析，以发现网络攻击、重建通信过程、提取证据的技术。\n\n网络取证数据来源：\n- 全流量存储\n- NetFlow/sFlow/IPFIX\n- 防火墙日志\n- IDS/IPS告警\n- 代理服务器日志\n- DNS日志\n\n7.2 流量捕获与存储\n\n- 端口镜像（SPAN/RSPAN/ERSPAN）\n- 网络分流器（TAP）\n- 捕获工具：Wireshark、tcpdump、dumpcap\n- 存储方案：大容量存储、分布式存储\n\n7.3 Wireshark流量分析\n\nWireshark常用功能：\n- 过滤器：显示过滤器、捕获过滤器\n- 协议解析：深度解析各种协议\n- 流追踪：TCP流、UDP流\n- 统计分析：端点统计、会话统计\n- 导出对象：HTTP对象、FTP对象\n\n常用过滤表达式：\n- 按IP：ip.addr == 192.168.1.1\n- 按端口：tcp.port == 80\n- 按协议：http、dns、ftp\n- 按内容：http.request.uri contains \"admin\"\n\n7.4 常见攻击流量特征\n\n端口扫描：\n- 短时间内大量SYN包\n- 目的端口分散\n- 源IP单一或少数\n\n暴力破解：\n- 大量认证失败响应\n- 同一账号多次尝试\n- 同一IP多次尝试\n\nWeb攻击：\n- SQL注入特征字符\n- XSS特征字符\n- 异常URL编码\n\nC2通信：\n- 周期性通信\n- 异常端口\n- 加密流量但证书异常\n- DNS隧道特征\n\n7.5 网络取证工具\n\n- Wireshark：图形化网络协议分析器\n- NetworkMiner：网络取证分析工具\n- Xplico：网络流量分析工具\n- Moloch：大规模流量捕获与分析\n- Suricata + eve.json：流量告警分析',
        pageCount: 50
      }
    ]
  },
  {
    id: 'src-vulnerability-mining',
    title: 'SRC漏洞挖掘实战',
    author: '安全研究团队',
    category: 'Web安全',
    cover: 'SRC',
    description: '一本面向网络安全爱好者和渗透测试工程师的SRC漏洞挖掘实战指南，从SRC平台的基础知识入手，系统讲解各类Web漏洞的挖掘技巧、业务逻辑漏洞的发现方法、进阶漏洞的利用思路，以及漏洞报告的编写规范。全书16章，结合大量真实案例，帮助读者快速掌握SRC漏洞挖掘的核心技能。',
    pages: 680,
    difficulty: '进阶',
    publishYear: 2024,
    tags: ['SRC', '漏洞挖掘', 'Web安全', '渗透测试', '白帽子'],
    rating: 4.9,
    readers: 15680,
    targetAudience: '网络安全爱好者、渗透测试工程师、安全研究员、漏洞挖掘爱好者、CTF选手',
    prerequisites: ['HTTP协议基础', 'Web开发基础', 'Linux基础操作', '编程基础'],
    folder: 'SRC漏洞挖掘实战',
    highlights: [
      '16章完整知识体系，从入门到实战',
      '覆盖主流SRC平台规则与技巧',
      '详解10+类常见漏洞挖掘方法',
      '包含50+真实漏洞案例分析',
      '提供完整的漏洞报告模板',
      '分享SRC排名提升经验',
      '职业发展路径与成长指南'
    ],
    chapters: [
      { id: 'ch1', title: '第一章 认识SRC漏洞挖掘', fileName: 'ch01-认识SRC漏洞挖掘.md', pageCount: 42 },
      { id: 'ch2', title: '第二章 SRC平台与规则解读', fileName: 'ch02-SRC平台与规则解读.md', pageCount: 45 },
      { id: 'ch3', title: '第三章 信息收集与资产发现', fileName: 'ch03-信息收集与资产发现.md', pageCount: 48 },
      { id: 'ch4', title: '第四章 漏洞挖掘工具箱', fileName: 'ch04-漏洞挖掘工具箱.md', pageCount: 45 },
      { id: 'ch5', title: '第五章 SQL注入漏洞挖掘', fileName: 'ch05-SQL注入漏洞挖掘.md', pageCount: 50 },
      { id: 'ch6', title: '第六章 XSS跨站脚本漏洞挖掘', fileName: 'ch06-XSS跨站脚本漏洞挖掘.md', pageCount: 48 },
      { id: 'ch7', title: '第七章 文件上传与包含漏洞', fileName: 'ch07-文件上传与包含漏洞.md', pageCount: 45 },
      { id: 'ch8', title: '第八章 CSRF与SSRF漏洞挖掘', fileName: 'ch08-CSRF与SSRF漏洞挖掘.md', pageCount: 45 },
      { id: 'ch9', title: '第九章 逻辑漏洞挖掘', fileName: 'ch09-逻辑漏洞挖掘.md', pageCount: 50 },
      { id: 'ch10', title: '第十章 越权漏洞挖掘', fileName: 'ch10-越权漏洞挖掘.md', pageCount: 45 },
      { id: 'ch11', title: '第十一章 API接口漏洞挖掘', fileName: 'ch11-API接口漏洞挖掘.md', pageCount: 45 },
      { id: 'ch12', title: '第十二章 JWT与认证漏洞挖掘', fileName: 'ch12-JWT与认证漏洞挖掘.md', pageCount: 42 },
      { id: 'ch13', title: '第十三章 反序列化漏洞挖掘', fileName: 'ch13-反序列化漏洞挖掘.md', pageCount: 45 },
      { id: 'ch14', title: '第十四章 云安全与配置错误', fileName: 'ch14-云安全与配置错误.md', pageCount: 42 },
      { id: 'ch15', title: '第十五章 漏洞报告编写与沟通', fileName: 'ch15-漏洞报告编写与沟通.md', pageCount: 45 },
      { id: 'ch16', title: '第十六章 SRC排名提升与成长之路', fileName: 'ch16-SRC排名提升与成长之路.md', pageCount: 43 },
    ]
  },
  {
    id: 'linux-security-hardening',
    title: 'Linux安全加固实战',
    author: '安全运维团队',
    category: '基础理论',
    cover: 'Linux',
    description: '一本面向运维工程师、安全管理员和网络管理员的Linux安全加固实战指南。从Linux系统安全基础入手，系统讲解用户账户安全、系统服务加固、网络安全配置、Web服务器安全、数据库安全、容器安全、日志审计以及应急响应等全方位安全加固实践。全书16章，结合大量真实案例和命令示例，帮助读者快速掌握Linux系统安全加固的核心技能。',
    pages: 720,
    difficulty: '进阶',
    publishYear: 2024,
    tags: ['Linux', '安全加固', '运维', '系统安全', '容器安全'],
    rating: 4.9,
    readers: 12580,
    targetAudience: 'Linux运维工程师、系统管理员、安全管理员、网络工程师、DevOps工程师',
    prerequisites: ['Linux基础操作', '命令行基础', '网络基础知识', '脚本编程基础'],
    folder: 'Linux安全加固实战',
    highlights: [
      '16章完整知识体系，从基础到实战',
      '覆盖CentOS/Ubuntu/Debian等主流发行版',
      '详解20+种常用服务的安全加固方法',
      '包含100+个安全加固命令和配置示例',
      '提供完整的自动化加固脚本',
      '包含真实安全事件案例分析',
      '详细的故障排查和应急响应指南'
    ],
    chapters: [
      { id: 'ch1', title: '第一章 Linux系统安全概述', fileName: 'ch01-Linux系统安全概述.md', pageCount: 45 },
      { id: 'ch2', title: '第二章 用户账户与权限安全', fileName: 'ch02-用户账户与权限安全.md', pageCount: 48 },
      { id: 'ch3', title: '第三章 文件系统安全', fileName: 'ch03-文件系统安全.md', pageCount: 45 },
      { id: 'ch4', title: '第四章 日志与审计', fileName: 'ch04-日志与审计.md', pageCount: 48 },
      { id: 'ch5', title: '第五章 系统服务加固', fileName: 'ch05-系统服务加固.md', pageCount: 42 },
      { id: 'ch6', title: '第六章 SSH安全配置', fileName: 'ch06-SSH安全配置.md', pageCount: 48 },
      { id: 'ch7', title: '第七章 防火墙配置', fileName: 'ch07-防火墙配置.md', pageCount: 45 },
      { id: 'ch8', title: '第八章 SELinux与AppArmor', fileName: 'ch08-SELinux与AppArmor.md', pageCount: 42 },
      { id: 'ch9', title: '第九章 Web服务器安全加固', fileName: 'ch09-Web服务器安全加固.md', pageCount: 48 },
      { id: 'ch10', title: '第十章 数据库安全加固', fileName: 'ch10-数据库安全加固.md', pageCount: 45 },
      { id: 'ch11', title: '第十一章 缓存服务安全加固', fileName: 'ch11-缓存服务安全加固.md', pageCount: 42 },
      { id: 'ch12', title: '第十二章 邮件服务安全加固', fileName: 'ch12-邮件服务安全加固.md', pageCount: 40 },
      { id: 'ch13', title: '第十三章 容器安全', fileName: 'ch13-容器安全.md', pageCount: 48 },
      { id: 'ch14', title: '第十四章 自动化安全加固脚本', fileName: 'ch14-自动化安全加固脚本.md', pageCount: 45 },
      { id: 'ch15', title: '第十五章 安全扫描与漏洞修复', fileName: 'ch15-安全扫描与漏洞修复.md', pageCount: 42 },
      { id: 'ch16', title: '第十六章 应急响应与安全监控', fileName: 'ch16-应急响应与安全监控.md', pageCount: 45 },
      { id: 'ch17', title: '第十七章 VPN与网络隧道安全', fileName: 'ch17-VPN与网络隧道安全.md', pageCount: 45 },
      { id: 'ch18', title: '第十八章 DNS服务器安全', fileName: 'ch18-DNS服务器安全.md', pageCount: 48 },
      { id: 'ch19', title: '第十九章 负载均衡器安全', fileName: 'ch19-负载均衡器安全.md', pageCount: 50 },
      { id: 'ch20', title: '第二十章 代理服务器安全', fileName: 'ch20-代理服务器安全.md', pageCount: 48 },
      { id: 'ch21', title: '第二十一章 证书管理与PKI安全', fileName: 'ch21-证书管理与PKI安全.md', pageCount: 50 },
      { id: 'ch22', title: '第二十二章 备份与灾难恢复', fileName: 'ch22-备份与灾难恢复.md', pageCount: 48 },
      { id: 'ch23', title: '第二十三章 等级保护合规实践', fileName: 'ch23-等级保护合规实践.md', pageCount: 50 },
    ]
  },
  {
    id: 'enterprise-security-hardening-guide',
    title: '企业级安全加固实战指南',
    author: '企业安全架构团队',
    category: '系统安全',
    cover: '加固',
    description: '全面的企业级安全加固实战指南，涵盖23章八大模块，从基础理论到云原生安全，从系统网络到应用数据，从等保合规到红蓝对抗，从灾备建设到安全运营，构建企业纵深防御体系。全书包含大量命令示例、配置模板和加固脚本，理论与实战结合，是安全运维人员的必备工具书。',
    pages: 1130,
    difficulty: '进阶',
    publishYear: 2024,
    tags: ['安全加固', '等保2.0', '系统加固', '网络安全', '云原生安全', '红蓝对抗', '自动化加固', '灾备', '数据恢复'],
    rating: 4.9,
    readers: 16800,
    targetAudience: '安全运维工程师、系统管理员、网络工程师、安全架构师、企业安全负责人',
    prerequisites: ['操作系统基础', '网络基础知识', '安全基础概念'],
    folder: '企业级安全加固实战指南',
    highlights: [
      '23章完整知识体系，8大模块全覆盖',
      '基础篇+系统篇+网络篇+服务篇+云原生篇+应用数据篇+实战篇+灾备篇',
      '覆盖Linux/Windows/网络设备/防火墙/Web服务/数据库/中间件',
      'Docker/K8s/云服务/应用安全/数据加密全场景',
      '100+个命令示例、配置文件模板、加固脚本',
      '等级保护2.0合规实践完整解读',
      '应急响应、自动化加固、红蓝对抗实战演练',
      '主流厂商灾备方案对比（华为/Dell EMC/Veritas/爱数/英方等）',
      '灾备演练与验证完整方法论',
      '安全运营与持续改进方法论'
    ],
    chapters: [
      { id: 'ch1', title: '第一章 安全加固概述与方法论', fileName: 'ch01-安全加固概述与方法论.md', pageCount: 55 },
      { id: 'ch2', title: '第二章 安全基线与评估标准', fileName: 'ch02-安全基线与评估标准.md', pageCount: 50 },
      { id: 'ch3', title: '第三章 Linux系统安全加固', fileName: 'ch03-Linux系统安全加固.md', pageCount: 65 },
      { id: 'ch4', title: '第四章 Windows系统安全加固', fileName: 'ch04-Windows系统安全加固.md', pageCount: 60 },
      { id: 'ch5', title: '第五章 交换机与路由器安全加固', fileName: 'ch05-交换机与路由器安全加固.md', pageCount: 55 },
      { id: 'ch6', title: '第六章 防火墙与WAF安全配置', fileName: 'ch06-防火墙与WAF安全配置.md', pageCount: 55 },
      { id: 'ch7', title: '第七章 Web服务器安全加固', fileName: 'ch07-Web服务器安全加固.md', pageCount: 58 },
      { id: 'ch8', title: '第八章 数据库安全加固', fileName: 'ch08-数据库安全加固.md', pageCount: 60 },
      { id: 'ch9', title: '第九章 中间件安全加固', fileName: 'ch09-中间件安全加固.md', pageCount: 55 },
      { id: 'ch10', title: '第十章 负载均衡与高可用安全', fileName: 'ch10-负载均衡与高可用安全.md', pageCount: 52 },
      { id: 'ch11', title: '第十一章 Docker容器安全加固', fileName: 'ch11-Docker容器安全加固.md', pageCount: 55 },
      { id: 'ch12', title: '第十二章 Kubernetes集群安全加固', fileName: 'ch12-Kubernetes集群安全加固.md', pageCount: 58 },
      { id: 'ch13', title: '第十三章 云主机与云服务安全加固', fileName: 'ch13-云主机与云服务安全加固.md', pageCount: 52 },
      { id: 'ch14', title: '第十四章 应用安全加固与代码安全', fileName: 'ch14-应用安全加固与代码安全.md', pageCount: 60 },
      { id: 'ch15', title: '第十五章 数据安全与加密防护', fileName: 'ch15-数据安全与加密防护.md', pageCount: 55 },
      { id: 'ch16', title: '第十六章 等级保护2.0合规实践', fileName: 'ch16-等级保护2.0合规实践.md', pageCount: 60 },
      { id: 'ch17', title: '第十七章 应急响应与安全加固实战', fileName: 'ch17-应急响应与安全加固实战.md', pageCount: 65 },
      { id: 'ch18', title: '第十八章 自动化安全加固实践', fileName: 'ch18-自动化安全加固实践.md', pageCount: 58 },
      { id: 'ch19', title: '第十九章 红蓝对抗与安全加固验证', fileName: 'ch19-红蓝对抗与安全加固验证.md', pageCount: 55 },
      { id: 'ch20', title: '第二十章 安全运营与持续改进', fileName: 'ch20-安全运营与持续改进.md', pageCount: 60 },
      { id: 'ch21', title: '第二十一章 灾备基础与策略规划', fileName: 'ch21-灾备基础与策略规划.md', pageCount: 55 },
      { id: 'ch22', title: '第二十二章 主流厂商灾备方案详解', fileName: 'ch22-主流厂商灾备方案详解.md', pageCount: 65 },
      { id: 'ch23', title: '第二十三章 灾备实战演练与验证', fileName: 'ch23-灾备实战演练与验证.md', pageCount: 60 },
    ]
  },
  {
    id: 'shoot-range-manual',
    title: '靶场搭建与实战练习手册',
    author: '靶场实战团队',
    category: '渗透测试',
    subCategory: '靶场实战',
    cover: '靶场',
    description: '从零开始搭建网络安全靶场环境，手把手教你搭建DVWA、SQLi-Labs、Upload-Labs、Pikachu、VulnHub、Vulhub等主流靶场，并完成全部通关实战。32章完整内容，从环境准备到高级漏洞复现，循序渐进，通俗易懂，适合零基础新手入门。',
    pages: 1280,
    difficulty: '入门',
    publishYear: 2026,
    tags: ['靶场搭建', 'DVWA', 'SQL注入', 'XSS', '文件上传', 'VulnHub', 'Vulhub', 'Docker', '渗透测试'],
    rating: 4.9,
    readers: 5600,
    targetAudience: '网络安全初学者、渗透测试入门者、安全爱好者',
    prerequisites: ['基本计算机操作能力'],
    folder: '靶场搭建与实战练习手册',
    highlights: [
      '32章完整靶场实战教程，从零到精通',
      'DVWA全模块详解 + 通关指南',
      'SQLi-Labs 75关SQL注入从入门到精通',
      'Upload-Labs 21关文件上传绕过技巧',
      'Pikachu综合靶场全漏洞练习',
      'VulnHub虚拟机靶机实战（Jangow/Kioptrix/DC-1）',
      'Docker + Vulhub漏洞环境复现',
      '手把手教学，通俗易懂，新手友好'
    ],
    chapters: [
      { id: 'ch1', title: '第一章 写在前面的话', fileName: 'ch01-写在前面的话.md', pageCount: 25 },
      { id: 'ch2', title: '第二章 环境准备 - PHPStudy安装', fileName: 'ch02-环境准备-PHPStudy安装.md', pageCount: 35 },
      { id: 'ch3', title: '第三章 必备工具安装与使用', fileName: 'ch03-必备工具安装与使用.md', pageCount: 45 },
      { id: 'ch4', title: '第四章 第一个靶场 - DVWA搭建全流程', fileName: 'ch04-第一个靶场-DVWA搭建全流程.md', pageCount: 50 },
      { id: 'ch5', title: '第五章 DVWA实战 - 暴力破解', fileName: 'ch05-DVWA实战-暴力破解.md', pageCount: 40 },
      { id: 'ch6', title: '第六章 DVWA实战 - 命令注入漏洞', fileName: 'ch06-DVWA实战-命令注入漏洞.md', pageCount: 45 },
      { id: 'ch7', title: '第七章 DVWA实战 - CSRF跨站请求伪造', fileName: 'ch07-DVWA实战-CSRF跨站请求伪造.md', pageCount: 40 },
      { id: 'ch8', title: '第八章 DVWA实战 - 文件包含漏洞', fileName: 'ch08-DVWA实战-文件包含漏洞.md', pageCount: 45 },
      { id: 'ch9', title: '第九章 DVWA实战 - 文件上传漏洞', fileName: 'ch09-DVWA实战-文件上传漏洞.md', pageCount: 50 },
      { id: 'ch10', title: '第十章 DVWA实战 - SQL注入入门', fileName: 'ch10-DVWA实战-SQL注入入门.md', pageCount: 55 },
      { id: 'ch11', title: '第十一章 DVWA实战 - XSS跨站脚本攻击', fileName: 'ch11-DVWA实战-XSS跨站脚本攻击.md', pageCount: 55 },
      { id: 'ch12', title: '第十二章 DVWA其他模块与通关总结', fileName: 'ch12-DVWA其他模块与通关总结.md', pageCount: 40 },
      { id: 'ch13', title: '第十三章 SQLi-Labs搭建与基础注入Less1-10', fileName: 'ch13-SQLi-Labs搭建与基础注入Less1-10.md', pageCount: 60 },
      { id: 'ch14', title: '第十四章 SQLi-Labs进阶注入Less11-25', fileName: 'ch14-SQLi-Labs进阶注入Less11-25.md', pageCount: 65 },
      { id: 'ch15', title: '第十五章 SQLi-Labs盲注与绕过Less26-40', fileName: 'ch15-SQLi-Labs盲注与绕过Less26-40.md', pageCount: 70 },
      { id: 'ch16', title: '第十六章 SQLi-Labs高级注入Less41-55', fileName: 'ch16-SQLi-Labs高级注入Less41-55.md', pageCount: 70 },
      { id: 'ch17', title: '第十七章 SQLi-Labs终极挑战Less56-75', fileName: 'ch17-SQLi-Labs终极挑战Less56-75.md', pageCount: 75 },
      { id: 'ch18', title: '第十八章 SQL注入神器sqlmap使用指南', fileName: 'ch18-SQL注入神器sqlmap使用指南.md', pageCount: 55 },
      { id: 'ch19', title: '第十九章 Upload-Labs搭建与前端绕过Pass1-7', fileName: 'ch19-Upload-Labs搭建与前端绕过Pass1-7.md', pageCount: 50 },
      { id: 'ch20', title: '第二十章 Upload-Labs后缀绕过与解析漏洞Pass8-15', fileName: 'ch20-Upload-Labs后缀绕过与解析漏洞Pass8-15.md', pageCount: 60 },
      { id: 'ch21', title: '第二十一章 Upload-Labs图片马与高级绕过Pass16-21', fileName: 'ch21-Upload-Labs图片马与高级绕过Pass16-21.md', pageCount: 65 },
      { id: 'ch22', title: '第二十二章 Pikachu靶场搭建与XSS全关卡', fileName: 'ch22-Pikachu靶场搭建与XSS全关卡.md', pageCount: 55 },
      { id: 'ch23', title: '第二十三章 Pikachu靶场SQL注入与文件上传', fileName: 'ch23-Pikachu靶场SQL注入与文件上传.md', pageCount: 50 },
      { id: 'ch24', title: '第二十四章 Pikachu其他漏洞与靶场总结', fileName: 'ch24-Pikachu其他漏洞与靶场总结.md', pageCount: 45 },
      { id: 'ch25', title: '第二十五章 VMware与Kali配置优化', fileName: 'ch25-VMware与Kali配置优化.md', pageCount: 45 },
      { id: 'ch26', title: '第二十六章 Jangow 1.0.1靶机搭建与信息收集', fileName: 'ch26-Jangow-1.0.1靶机搭建与信息收集.md', pageCount: 55 },
      { id: 'ch27', title: '第二十七章 Jangow 1.0.1完整渗透通关教程', fileName: 'ch27-Jangow-1.0.1完整渗透通关教程.md', pageCount: 70 },
      { id: 'ch28', title: '第二十八章 Kioptrix Level 1完整渗透流程', fileName: 'ch28-Kioptrix-Level-1完整渗透流程.md', pageCount: 75 },
      { id: 'ch29', title: '第二十九章 Docker安装与Vulhub环境搭建', fileName: 'ch29-Docker安装与Vulhub环境搭建.md', pageCount: 50 },
      { id: 'ch30', title: '第三十章 Web框架漏洞复现ThinkPHP S2等', fileName: 'ch30-Web框架漏洞复现ThinkPHP-S2等.md', pageCount: 65 },
      { id: 'ch31', title: '第三十一章 中间件漏洞复现Apache Nginx Tomcat', fileName: 'ch31-中间件漏洞复现Apache-Nginx-Tomcat.md', pageCount: 70 },
      { id: 'ch32', title: '第三十二章 DC-1靶机实战与学习路线总结', fileName: 'ch32-DC-1靶机实战与学习路线总结.md', pageCount: 80 },
    ]
  },
];

export const bookCategories: BookCategory[] = [
  { name: '全部', description: '所有网络安全书籍', icon: '📚', count: books.length },
  { name: '护网红队', description: '护网红队攻击与APT攻击', icon: '🔴', count: books.filter(b => b.category === '护网红队').length },
  { name: '护网蓝队', description: '护网蓝队防守与应急响应', icon: '🔵', count: books.filter(b => b.category === '护网蓝队').length },
  { name: '基础理论', description: '网络安全基础概念与理论', icon: '📖', count: books.filter(b => b.category === '基础理论').length },
  { name: 'Web安全', description: 'Web应用安全与防护', icon: '🌐', count: books.filter(b => b.category === 'Web安全').length },
  { name: '渗透测试', description: '渗透测试技术与实战', icon: '🔓', count: books.filter(b => b.category === '渗透测试').length },
  { name: '二进制安全', description: '逆向工程与漏洞挖掘', icon: '💻', count: books.filter(b => b.category === '二进制安全').length },
  { name: '系统安全', description: '操作系统安全加固', icon: '🖥️', count: books.filter(b => b.category === '系统安全').length },
  { name: '密码学', description: '密码学原理与应用', icon: '🔐', count: books.filter(b => b.category === '密码学').length },
  { name: '网络攻防', description: '网络攻击与防御技术', icon: '🛡️', count: books.filter(b => b.category === '网络攻防').length },
  { name: '社会工程', description: '社会工程学与社工攻击', icon: '👤', count: books.filter(b => b.category === '社会工程').length },
  { name: '无线安全', description: '无线网络与Wi-Fi安全', icon: '📡', count: books.filter(b => b.category === '无线安全').length },
  { name: '物联网安全', description: 'IoT与车联网安全', icon: '🚗', count: books.filter(b => b.category === '物联网安全').length },
  { name: '云安全', description: '云计算与容器安全', icon: '☁️', count: books.filter(b => b.category === '云安全').length },
  { name: '安全运营', description: 'SOC运营与应急响应', icon: '📊', count: books.filter(b => b.category === '安全运营').length },
];

export default books;
