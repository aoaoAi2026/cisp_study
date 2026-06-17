// CISP 模拟考试题库 - 78道模拟考题
// 按 CISP 知识域分类：信息安全保障、信息安全技术、信息安全管理、信息安全法规与标准、安全工程与运营

export interface MockQuestion {
  id: number;
  question: string;
  options: { label: string; text: string }[];
  correct: string;
  domain: string;
  explanation: string;
}

export const mockExamPool: MockQuestion[] = [
  // ========== 1. 信息安全保障（约10%，6题） ==========
  {
    id: 1,
    question: 'IATF（信息保障技术框架）将信息系统分为哪四个部分？',
    options: [
      { label: 'A', text: '物理环境、网络环境、主机环境、应用环境' },
      { label: 'B', text: '本地计算环境、区域边界、网络和基础设施、支撑性基础设施' },
      { label: 'C', text: '感知层、网络层、平台层、应用层' },
      { label: 'D', text: '终端、服务器、数据库、中间件' }
    ],
    correct: 'B',
    domain: '信息安全保障',
    explanation: 'IATF 3.0 将信息系统划分为四个部分：本地计算环境、区域边界、网络和基础设施、支撑性基础设施（包括密钥管理基础设施KMI/PKI和检测响应基础设施）。'
  },
  {
    id: 2,
    question: 'P2DR 模型比 PDR 模型多了哪个环节？',
    options: [
      { label: 'A', text: '检测（Detection）' },
      { label: 'B', text: '响应（Response）' },
      { label: 'C', text: '策略（Policy）' },
      { label: 'D', text: '保护（Protection）' }
    ],
    correct: 'C',
    domain: '信息安全保障',
    explanation: 'PDR 模型包含保护（Protection）、检测（Detection）、响应（Response）。P2DR 模型在此基础上增加了策略（Policy）环节，强调安全策略是整个模型的核心和基础。'
  },
  {
    id: 3,
    question: '纵深防御（Defense-in-Depth）策略的核心思想是什么？',
    options: [
      { label: 'A', text: '部署单一最强防护设备' },
      { label: 'B', text: '在多个层面部署多种防护措施' },
      { label: 'C', text: '完全依赖防火墙进行防护' },
      { label: 'D', text: '让用户自己负责安全防护' }
    ],
    correct: 'B',
    domain: '信息安全保障',
    explanation: '纵深防御策略的核心思想是在网络、主机、应用、数据等多个层面部署多种不同类型的安全防护措施，当一层防护失效时，其他层仍能继续提供保护。'
  },
  {
    id: 4,
    question: '以下哪个模型强调"安全是一个过程，而不是一个产品"？',
    options: [
      { label: 'A', text: 'OSI 七层模型' },
      { label: 'B', text: 'P2DR 模型' },
      { label: 'C', text: 'TCP/IP 模型' },
      { label: 'D', text: '瀑布模型' }
    ],
    correct: 'B',
    domain: '信息安全保障',
    explanation: 'P2DR 模型强调安全是一个动态持续的过程，需要根据策略不断调整保护、检测和响应措施，而不是仅靠购买安全产品就能解决所有问题。'
  },
  {
    id: 5,
    question: '信息安全的 CIA 三要素中，"A" 代表什么？',
    options: [
      { label: 'A', text: '认证性（Authentication）' },
      { label: 'B', text: '可用性（Availability）' },
      { label: 'C', text: '不可否认性（Accountability）' },
      { label: 'D', text: '审计性（Auditability）' }
    ],
    correct: 'B',
    domain: '信息安全保障',
    explanation: 'CIA 三要素是信息安全的核心目标：C（Confidentiality，机密性）、I（Integrity，完整性）、A（Availability，可用性）。'
  },
  {
    id: 6,
    question: '以下哪项不属于信息安全的扩展属性？',
    options: [
      { label: 'A', text: '不可否认性' },
      { label: 'B', text: '可审计性' },
      { label: 'C', text: '可扩展性' },
      { label: 'D', text: '可控性' }
    ],
    correct: 'C',
    domain: '信息安全保障',
    explanation: '信息安全的扩展属性包括不可否认性、可审计性、可控性、可靠性等。可扩展性是系统架构属性，不属于信息安全的核心或扩展属性。'
  },

  // ========== 2. 信息安全技术（约40%，28题） ==========
  // 密码学
  {
    id: 7,
    question: 'SM4 属于什么类型的密码算法？',
    options: [
      { label: 'A', text: '非对称加密算法' },
      { label: 'B', text: '对称分组加密算法' },
      { label: 'C', text: '哈希算法' },
      { label: 'D', text: '流加密算法' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'SM4 是我国发布的商用密码标准，属于对称分组加密算法，分组长度为128位，密钥长度为128位。'
  },
  {
    id: 8,
    question: 'RSA 算法的安全性基于什么数学难题？',
    options: [
      { label: 'A', text: '离散对数问题' },
      { label: 'B', text: '大整数分解难题' },
      { label: 'C', text: '椭圆曲线离散对数问题' },
      { label: 'D', text: '背包问题' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'RSA 算法的安全性基于大整数分解难题：将两个大素数的乘积分解回原来的素数在计算上是不可行的。'
  },
  {
    id: 9,
    question: '数字签名主要提供哪些安全属性？',
    options: [
      { label: 'A', text: '仅机密性' },
      { label: 'B', text: '完整性、认证性和不可否认性' },
      { label: 'C', text: '仅可用性' },
      { label: 'D', text: '仅访问控制' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: '数字签名利用非对称密码技术，提供数据完整性（防篡改）、身份认证（确认发送方）和不可否认性（发送方无法否认）。'
  },
  {
    id: 10,
    question: 'SHA-256 属于什么类型的算法？',
    options: [
      { label: 'A', text: '对称加密算法' },
      { label: 'B', text: '非对称加密算法' },
      { label: 'C', text: '哈希函数（散列函数）' },
      { label: 'D', text: '消息认证码算法' }
    ],
    correct: 'C',
    domain: '信息安全技术',
    explanation: 'SHA-256 是 SHA-2 系列的安全哈希算法，输出256位哈希值，属于密码学哈希函数，用于数据完整性校验。'
  },
  {
    id: 11,
    question: '以下哪个算法基于椭圆曲线密码学（ECC）？',
    options: [
      { label: 'A', text: 'AES' },
      { label: 'B', text: 'DES' },
      { label: 'C', text: 'SM2' },
      { label: 'D', text: 'RC4' }
    ],
    correct: 'C',
    domain: '信息安全技术',
    explanation: 'SM2 是我国发布的椭圆曲线公钥密码算法标准，基于椭圆曲线离散对数难题。AES、DES、RC4 均为对称加密算法。'
  },
  {
    id: 12,
    question: '以下哪种攻击方式针对的是哈希算法的碰撞特性？',
    options: [
      { label: 'A', text: '重放攻击' },
      { label: 'B', text: '中间人攻击' },
      { label: 'C', text: '碰撞攻击' },
      { label: 'D', text: '拒绝服务攻击' }
    ],
    correct: 'C',
    domain: '信息安全技术',
    explanation: '碰撞攻击是指找到两个不同的输入，使其产生相同的哈希输出。MD5 和 SHA-1 已被证明存在碰撞漏洞。'
  },
  {
    id: 13,
    question: '在 PKI 体系中，CA 的主要职责是什么？',
    options: [
      { label: 'A', text: '加密用户数据' },
      { label: 'B', text: '签发和管理数字证书' },
      { label: 'C', text: '防火墙管理' },
      { label: 'D', text: '网络流量监控' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'CA（Certificate Authority，证书授权中心）是 PKI 的核心组件，负责签发、更新、撤销和管理数字证书。'
  },
  {
    id: 14,
    question: 'Diffie-Hellman 密钥交换协议主要用于解决什么问题？',
    options: [
      { label: 'A', text: '数据加密' },
      { label: 'B', text: '在不安全的信道上安全地协商共享密钥' },
      { label: 'C', text: '数字签名' },
      { label: 'D', text: '身份认证' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'Diffie-Hellman 协议允许通信双方在不安全的公共信道上协商出一个共享密钥，用于后续的对称加密通信。'
  },
  // 网络安全
  {
    id: 15,
    question: 'HTTPS 默认使用的端口是？',
    options: [
      { label: 'A', text: '80' },
      { label: 'B', text: '443' },
      { label: 'C', text: '8080' },
      { label: 'D', text: '22' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'HTTPS（HTTP Secure）默认使用 443 端口，在 HTTP 基础上增加了 TLS/SSL 加密层。HTTP 使用 80 端口。'
  },
  {
    id: 16,
    question: 'SSH 默认使用的端口是？',
    options: [
      { label: 'A', text: '21' },
      { label: 'B', text: '22' },
      { label: 'C', text: '23' },
      { label: 'D', text: '25' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'SSH（Secure Shell）默认使用 22 端口，提供加密的远程登录服务。Telnet 使用 23 端口（不安全）。'
  },
  {
    id: 17,
    question: '防火墙主要工作在 OSI 模型的哪几层？',
    options: [
      { label: 'A', text: '仅物理层' },
      { label: 'B', text: '仅应用层' },
      { label: 'C', text: '网络层、传输层和应用层' },
      { label: 'D', text: '仅数据链路层' }
    ],
    correct: 'C',
    domain: '信息安全技术',
    explanation: '传统防火墙工作在网络层和传输层（包过滤、状态检测），下一代防火墙（NGFW）还能工作在应用层进行深度包检测（DPI）。'
  },
  {
    id: 18,
    question: 'IDS 与 IPS 的主要区别是什么？',
    options: [
      { label: 'A', text: 'IDS 检测并报警，IPS 检测并可主动阻断' },
      { label: 'B', text: 'IDS 只能检测内部攻击，IPS 只能检测外部攻击' },
      { label: 'C', text: 'IDS 是硬件设备，IPS 是软件系统' },
      { label: 'D', text: '两者功能完全相同' }
    ],
    correct: 'A',
    domain: '信息安全技术',
    explanation: 'IDS（入侵检测系统）主要检测和报警；IPS（入侵防御系统）在 IDS 基础上增加了主动防御能力，可以实时阻断攻击流量。'
  },
  {
    id: 19,
    question: '以下哪种攻击通过篡改 DNS 响应将用户重定向到恶意网站？',
    options: [
      { label: 'A', text: 'ARP 欺骗' },
      { label: 'B', text: 'DNS 欺骗（DNS Spoofing）' },
      { label: 'C', text: 'SYN 洪水攻击' },
      { label: 'D', text: 'CSRF 攻击' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'DNS 欺骗攻击通过篡改 DNS 解析结果，将合法域名指向恶意 IP 地址，使用户访问时被重定向到钓鱼或恶意网站。'
  },
  {
    id: 20,
    question: '以下哪个协议用于将 IP 地址解析为 MAC 地址？',
    options: [
      { label: 'A', text: 'DNS' },
      { label: 'B', text: 'ARP' },
      { label: 'C', text: 'DHCP' },
      { label: 'D', text: 'ICMP' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'ARP（Address Resolution Protocol，地址解析协议）用于将网络层的 IP 地址解析为数据链路层的 MAC 地址。'
  },
  {
    id: 21,
    question: 'VPN 技术的主要作用是什么？',
    options: [
      { label: 'A', text: '提高网络带宽' },
      { label: 'B', text: '在公共网络上建立加密通信隧道' },
      { label: 'C', text: '替代物理网络布线' },
      { label: 'D', text: '自动分配 IP 地址' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'VPN（Virtual Private Network）在公共网络（如互联网）上建立加密的虚拟专用通道，实现安全的远程接入和数据传输。'
  },
  {
    id: 22,
    question: '以下哪种攻击属于拒绝服务攻击（DoS）？',
    options: [
      { label: 'A', text: 'SQL 注入' },
      { label: 'B', text: 'SYN 洪水攻击' },
      { label: 'C', text: '跨站脚本攻击' },
      { label: 'D', text: '钓鱼攻击' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'SYN 洪水攻击通过发送大量半连接请求消耗服务器资源，使合法用户无法建立连接，是典型的拒绝服务攻击方式。'
  },
  {
    id: 23,
    question: 'TCP/IP 协议模型共分为几层？',
    options: [
      { label: 'A', text: '3 层' },
      { label: 'B', text: '4 层' },
      { label: 'C', text: '5 层' },
      { label: 'D', text: '7 层' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'TCP/IP 模型分为 4 层：网络接口层、网络层（IP）、传输层（TCP/UDP）、应用层。OSI 参考模型分为 7 层。'
  },
  {
    id: 24,
    question: '以下哪个工具主要用于网络数据包捕获和分析？',
    options: [
      { label: 'A', text: 'Nmap' },
      { label: 'B', text: 'Wireshark' },
      { label: 'C', text: 'Metasploit' },
      { label: 'D', text: 'Burp Suite' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'Wireshark 是开源的网络协议分析工具，用于捕获和分析网络数据包。Nmap 用于端口扫描，Metasploit 用于渗透测试，Burp Suite 用于 Web 安全测试。'
  },
  {
    id: 25,
    question: '以下哪个是 XSS 攻击的防御措施？',
    options: [
      { label: 'A', text: '对用户输入进行转义和输出编码' },
      { label: 'B', text: '关闭防火墙' },
      { label: 'C', text: '使用弱密码' },
      { label: 'D', text: '禁用 HTTPS' }
    ],
    correct: 'A',
    domain: '信息安全技术',
    explanation: '防御 XSS 攻击的核心是对用户输入进行验证、过滤，对输出到页面的内容进行 HTML 实体编码，防止恶意脚本执行。'
  },
  {
    id: 26,
    question: 'SQL 注入攻击主要利用什么漏洞？',
    options: [
      { label: 'A', text: '数据库版本过旧' },
      { label: 'B', text: '应用程序对用户输入处理不当' },
      { label: 'C', text: '网络传输未加密' },
      { label: 'D', text: '操作系统配置错误' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'SQL 注入的根本原因是应用程序将用户输入直接拼接到 SQL 语句中执行，而没有使用参数化查询或预编译语句。'
  },
  {
    id: 27,
    question: '以下哪个属于多因素认证（MFA）的正确组合？',
    options: [
      { label: 'A', text: '用户名 + 密码' },
      { label: 'B', text: '密码 + 短信验证码' },
      { label: 'C', text: '两个不同的密码' },
      { label: 'D', text: '密码 + 密保问题' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: '多因素认证需要至少两种不同类别的认证因素：你知道的（密码）+ 你拥有的（手机接收验证码）。密码+密保问题属于同一类别（知识因素）。'
  },
  {
    id: 28,
    question: '以下哪个工具主要用于端口扫描和主机发现？',
    options: [
      { label: 'A', text: 'Wireshark' },
      { label: 'B', text: 'Nmap' },
      { label: 'C', text: 'Metasploit' },
      { label: 'D', text: 'Nikto' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'Nmap（Network Mapper）是最流行的开源端口扫描和主机发现工具，支持多种扫描技术和操作系统探测。'
  },
  {
    id: 29,
    question: '以下哪种攻击方式属于社会工程学攻击？',
    options: [
      { label: 'A', text: 'SQL 注入' },
      { label: 'B', text: 'XSS 攻击' },
      { label: 'C', text: '钓鱼攻击（Phishing）' },
      { label: 'D', text: '缓冲区溢出' }
    ],
    correct: 'C',
    domain: '信息安全技术',
    explanation: '社会工程学通过心理操纵和人际互动技巧获取信息或访问权限。钓鱼攻击通过伪装成可信实体诱骗用户泄露敏感信息，是典型的社会工程学攻击。'
  },
  {
    id: 30,
    question: 'OWASP Top 10 中，2021 版本排名第一的 Web 安全风险是？',
    options: [
      { label: 'A', text: 'SQL 注入' },
      { label: 'B', text: '失效的访问控制（Broken Access Control）' },
      { label: 'C', text: '跨站脚本 XSS' },
      { label: 'D', text: '安全配置错误' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: '自 2021 年起，失效的访问控制取代注入类攻击成为 OWASP Top 10 的头号安全风险，包括越权访问、目录遍历等问题。'
  },
  // 系统与应用安全
  {
    id: 31,
    question: '以下哪个属于操作系统安全的核心机制？',
    options: [
      { label: 'A', text: '内存管理' },
      { label: 'B', text: '身份认证和访问控制' },
      { label: 'C', text: '文件压缩' },
      { label: 'D', text: '图形界面渲染' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: '身份认证和访问控制是操作系统安全的核心机制，用于确认用户身份并控制其对系统资源的访问权限。'
  },
  {
    id: 32,
    question: '以下哪种恶意软件会自我复制并传播到其他计算机？',
    options: [
      { label: 'A', text: '特洛伊木马' },
      { label: 'B', text: '蠕虫（Worm）' },
      { label: 'C', text: '间谍软件' },
      { label: 'D', text: '广告软件' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: '蠕虫是一种能够自我复制并通过网络自动传播的恶意软件，不需要依附于其他程序。特洛伊木马需要用户主动运行。'
  },
  {
    id: 33,
    question: 'WannaCry 勒索软件主要利用了哪个漏洞进行传播？',
    options: [
      { label: 'A', text: 'Heartbleed' },
      { label: 'B', text: 'EternalBlue（MS17-010）' },
      { label: 'C', text: 'Shellshock' },
      { label: 'D', text: 'Log4j' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'WannaCry 于 2017 年爆发，主要利用 NSA 泄露的 EternalBlue 漏洞（对应微软补丁 MS17-010）通过 SMB 协议传播。'
  },
  {
    id: 34,
    question: '以下哪个命令可用于测试网络连通性？',
    options: [
      { label: 'A', text: 'cat' },
      { label: 'B', text: 'ping' },
      { label: 'C', text: 'chmod' },
      { label: 'D', text: 'cp' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'ping 命令通过发送 ICMP 回显请求包来测试目标主机的网络可达性和延迟。'
  },
  {
    id: 35,
    question: '以下哪个端口通常用于远程桌面协议（RDP）？',
    options: [
      { label: 'A', text: '22' },
      { label: 'B', text: '3389' },
      { label: 'C', text: '445' },
      { label: 'D', text: '110' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'RDP（Remote Desktop Protocol）默认使用 3389 端口。22 是 SSH，445 是 SMB，110 是 POP3。'
  },
  {
    id: 36,
    question: '以下哪种备份方式只备份自上次备份以来发生变化的数据？',
    options: [
      { label: 'A', text: '完全备份' },
      { label: 'B', text: '增量备份' },
      { label: 'C', text: '差异备份' },
      { label: 'D', text: '镜像备份' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: '增量备份只备份自上次任何类型备份以来发生变化的数据。差异备份备份自上次完全备份以来的所有变化数据。'
  },
  {
    id: 37,
    question: '以下哪个属于 Web 应用防火墙（WAF）的主要功能？',
    options: [
      { label: 'A', text: '防止 DDoS 攻击' },
      { label: 'B', text: '过滤和监控 HTTP/HTTPS 流量中的恶意请求' },
      { label: 'C', text: '加密数据库连接' },
      { label: 'D', text: '管理用户密码' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: 'WAF（Web Application Firewall）专门用于过滤、监控和阻断 HTTP/HTTPS 流量中的恶意 Web 请求，如 SQL 注入、XSS 等攻击。'
  },
  {
    id: 38,
    question: '以下哪个协议用于安全的电子邮件传输？',
    options: [
      { label: 'A', text: 'SMTP' },
      { label: 'B', text: 'POP3' },
      { label: 'C', text: 'SMTPS / POP3S（使用 TLS/SSL）' },
      { label: 'D', text: 'FTP' }
    ],
    correct: 'C',
    domain: '信息安全技术',
    explanation: 'SMTPS（SMTP over SSL/TLS）和 POP3S 分别在 SMTP 和 POP3 基础上增加了加密层，用于安全的电子邮件传输。'
  },
  {
    id: 39,
    question: '以下哪个不属于常见的 Web 安全漏洞？',
    options: [
      { label: 'A', text: 'CSRF（跨站请求伪造）' },
      { label: 'B', text: 'SSRF（服务器端请求伪造）' },
      { label: 'C', text: 'TCP 三次握手' },
      { label: 'D', text: '文件上传漏洞' }
    ],
    correct: 'C',
    domain: '信息安全技术',
    explanation: 'TCP 三次握手是 TCP 协议建立连接的正常机制，不属于安全漏洞。CSRF、SSRF、文件上传漏洞都是常见的 Web 安全漏洞。'
  },
  {
    id: 40,
    question: '以下哪个是数据库加密的主要目的？',
    options: [
      { label: 'A', text: '提高数据库查询速度' },
      { label: 'B', text: '保护存储在数据库中的敏感数据' },
      { label: 'C', text: '减少数据库存储空间' },
      { label: 'D', text: '简化数据库备份' }
    ],
    correct: 'B',
    domain: '信息安全技术',
    explanation: '数据库加密通过对存储的数据进行加密，防止未经授权的访问者直接读取数据库文件中的敏感信息，即使数据库文件被窃取也能保护数据。'
  },

  // ========== 3. 信息安全管理（约30%，18题） ==========
  {
    id: 41,
    question: 'ISO 27001 是什么标准？',
    options: [
      { label: 'A', text: '质量管理体系标准' },
      { label: 'B', text: '信息安全管理体系（ISMS）标准' },
      { label: 'C', text: '环境管理体系标准' },
      { label: 'D', text: '食品安全管理体系标准' }
    ],
    correct: 'B',
    domain: '信息安全管理',
    explanation: 'ISO 27001 是国际标准化组织发布的信息安全管理体系（ISMS）标准，规定了建立、实施、维护和持续改进信息安全管理体系的要求。'
  },
  {
    id: 42,
    question: 'PDCA 循环中的四个阶段分别指什么？',
    options: [
      { label: 'A', text: '计划（Plan）- 执行（Do）- 检查（Check）- 处置（Act）' },
      { label: 'B', text: '准备（Prepare）- 部署（Deploy）- 检查（Check）- 评估（Assess）' },
      { label: 'C', text: '计划（Plan）- 设计（Design）- 编码（Code）- 测试（Test）' },
      { label: 'D', text: '采购（Purchase）- 开发（Develop）- 配置（Configure）- 审计（Audit）' }
    ],
    correct: 'A',
    domain: '信息安全管理',
    explanation: 'PDCA 循环又称戴明环，是持续改进的管理方法：Plan（计划）、Do（执行）、Check（检查）、Act（处置/改进）。'
  },
  {
    id: 43,
    question: '信息安全风险评估的经典计算公式是什么？',
    options: [
      { label: 'A', text: '风险 = 资产 + 威胁 + 脆弱性' },
      { label: 'B', text: '风险 = 资产价值 × 威胁发生概率 × 脆弱性严重程度' },
      { label: 'C', text: '风险 = 威胁 - 脆弱性' },
      { label: 'D', text: '风险 = 资产 / 防护措施' }
    ],
    correct: 'B',
    domain: '信息安全管理',
    explanation: '经典风险计算模型：风险值 = 资产价值 × 威胁发生概率 × 脆弱性严重程度。三者缺一不可，共同决定风险的大小。'
  },
  {
    id: 44,
    question: '"最小权限原则"的核心理念是什么？',
    options: [
      { label: 'A', text: '给用户分配最大权限以提高效率' },
      { label: 'B', text: '给用户分配完成任务所需的最少权限' },
      { label: 'C', text: '所有用户使用相同的权限' },
      { label: 'D', text: '管理员拥有所有系统权限' }
    ],
    correct: 'B',
    domain: '信息安全管理',
    explanation: '最小权限原则（Principle of Least Privilege）要求用户和程序只拥有完成其工作所必需的最小权限，以减少潜在的安全风险。'
  },
  {
    id: 45,
    question: '"职责分离"原则的主要目的是什么？',
    options: [
      { label: 'A', text: '提高工作效率' },
      { label: 'B', text: '防止个人滥用权力，减少欺诈和错误' },
      { label: 'C', text: '减少人员数量' },
      { label: 'D', text: '简化管理流程' }
    ],
    correct: 'B',
    domain: '信息安全管理',
    explanation: '职责分离（Separation of Duties）将关键业务流程中的敏感任务拆分给不同人员执行，使单个人无法独立完成可能产生危害的操作。'
  },
  {
    id: 46,
    question: '以下哪个属于预防性安全控制措施？',
    options: [
      { label: 'A', text: '日志审计' },
      { label: 'B', text: '防火墙规则' },
      { label: 'C', text: '入侵检测系统' },
      { label: 'D', text: '安全事件分析' }
    ],
    correct: 'B',
    domain: '信息安全管理',
    explanation: '防火墙规则属于预防性控制，目的是阻止不安全行为的发生。日志审计、IDS、事件分析属于检测性控制，用于发现和记录安全事件。'
  },
  {
    id: 47,
    question: '在访问控制中，RBAC 的全称是什么？',
    options: [
      { label: 'A', text: 'Rule-Based Access Control' },
      { label: 'B', text: 'Role-Based Access Control' },
      { label: 'C', text: 'Resource-Based Access Control' },
      { label: 'D', text: 'Risk-Based Access Control' }
    ],
    correct: 'B',
    domain: '信息安全管理',
    explanation: 'RBAC = Role-Based Access Control，基于角色的访问控制。通过定义角色并分配权限给角色，再将用户分配到相应角色来管理访问权限。'
  },
  {
    id: 48,
    question: '以下哪个是业务连续性计划（BCP）的首要步骤？',
    options: [
      { label: 'A', text: '选择备份软件' },
      { label: 'B', text: '业务影响分析（BIA）' },
      { label: 'C', text: '购买保险' },
      { label: 'D', text: '招聘安全人员' }
    ],
    correct: 'B',
    domain: '信息安全管理',
    explanation: '业务影响分析（BIA）识别组织的关键业务功能、依赖关系和中断影响，是制定业务连续性计划的基础和首要步骤。'
  },
  {
    id: 49,
    question: 'RPO（Recovery Point Objective）代表什么？',
    options: [
      { label: 'A', text: '恢复时间目标' },
      { label: 'B', text: '恢复点目标（可容忍的数据丢失量）' },
      { label: 'C', text: '资源计划目标' },
      { label: 'D', text: '风险优先级目标' }
    ],
    correct: 'B',
    domain: '信息安全管理',
    explanation: 'RPO 是灾难发生后可容忍的最大数据丢失量，决定了备份频率。RTO（Recovery Time Objective）是恢复时间目标，指可容忍的业务中断时间。'
  },
  {
    id: 50,
    question: '数据备份的 3-2-1 原则中的 "1" 代表什么？',
    options: [
      { label: 'A', text: '每天备份 1 次' },
      { label: 'B', text: '1 份离线/异地备份' },
      { label: 'C', text: '保留 1 个月的备份' },
      { label: 'D', text: '使用 1 种备份介质' }
    ],
    correct: 'B',
    domain: '信息安全管理',
    explanation: '3-2-1 备份原则：3 份数据副本、2 种不同存储介质、1 份离线或异地备份。该原则可有效防范数据丢失风险。'
  },
  {
    id: 51,
    question: '以下哪个文档是信息安全管理体系的核心文件？',
    options: [
      { label: 'A', text: '员工午餐菜单' },
      { label: 'B', text: '安全策略、规程和标准' },
      { label: 'C', text: '年度财务报表' },
      { label: 'D', text: '产品营销手册' }
    ],
    correct: 'B',
    domain: '信息安全管理',
    explanation: '安全策略、规程和标准是信息安全管理体系的核心文档，为组织的信息安全实践提供指导和规范。'
  },
  {
    id: 52,
    question: '在安全事件响应流程中，"遏制"阶段的主要目的是什么？',
    options: [
      { label: 'A', text: '查明事件的根本原因' },
      { label: 'B', text: '限制事件的影响范围，防止进一步扩散' },
      { label: 'C', text: '恢复系统到正常状态' },
      { label: 'D', text: '撰写事件报告' }
    ],
    correct: 'B',
    domain: '信息安全管理',
    explanation: '遏制（Containment）阶段的目标是隔离受影响的系统和网络，限制安全事件的影响范围，防止事态进一步扩大。'
  },
  {
    id: 53,
    question: '以下哪种情况最可能导致数据泄露？',
    options: [
      { label: 'A', text: '使用强密码策略' },
      { label: 'B', text: '定期更新系统补丁' },
      { label: 'C', text: '员工将敏感数据发送到个人邮箱' },
      { label: 'D', text: '启用多因素认证' }
    ],
    correct: 'C',
    domain: '信息安全管理',
    explanation: '内部人员的不当行为是数据泄露的常见原因。组织应通过数据防泄漏（DLP）策略、安全意识培训等措施管控敏感数据的流转。'
  },
  {
    id: 54,
    question: 'ISO 27002 与 ISO 27001 的主要区别是什么？',
    options: [
      { label: 'A', text: 'ISO 27002 是管理体系要求标准，ISO 27001 是实践指南' },
      { label: 'B', text: 'ISO 27002 提供信息安全控制措施的实践指南，ISO 27001 是认证标准' },
      { label: 'C', text: '两者内容完全相同' },
      { label: 'D', text: 'ISO 27002 仅适用于金融行业' }
    ],
    correct: 'B',
    domain: '信息安全管理',
    explanation: 'ISO 27001 是信息安全管理体系的规范标准（可用于认证），规定了 ISMS 的要求。ISO 27002 提供了信息安全控制措施的实践指南和最佳实践。'
  },
  {
    id: 55,
    question: '以下哪个属于生物识别技术的特点？',
    options: [
      { label: 'A', text: '容易丢失或被盗' },
      { label: 'B', text: '具有唯一性和难以复制性' },
      { label: 'C', text: '必须定期更换' },
      { label: 'D', text: '可以与他人共享' }
    ],
    correct: 'B',
    domain: '信息安全管理',
    explanation: '生物特征（指纹、虹膜、人脸等）具有唯一性、稳定性和难以复制的特点，是可靠的身份认证方式。'
  },
  {
    id: 56,
    question: '以下哪个不属于信息安全管理中的安全控制类型？',
    options: [
      { label: 'A', text: '预防性控制' },
      { label: 'B', text: '检测性控制' },
      { label: 'C', text: '纠正性控制' },
      { label: 'D', text: '盈利性控制' }
    ],
    correct: 'D',
    domain: '信息安全管理',
    explanation: '安全控制通常分为预防性（防止事件发生）、检测性（发现事件）、纠正性（恢复和修复）和威慑性控制。盈利性控制不属于安全控制类型。'
  },
  {
    id: 57,
    question: '安全意识培训的主要目的是什么？',
    options: [
      { label: 'A', text: '提高员工编程能力' },
      { label: 'B', text: '增强员工识别和防范安全威胁的能力' },
      { label: 'C', text: '替代技术防护措施' },
      { label: 'D', text: '减少 IT 部门人员' }
    ],
    correct: 'B',
    domain: '信息安全管理',
    explanation: '安全意识培训旨在提高员工对信息安全威胁的认识，使其能够识别钓鱼邮件、社会工程学攻击等常见威胁，并掌握正确的安全操作规范。'
  },
  {
    id: 58,
    question: '以下哪个是安全审计的主要目的？',
    options: [
      { label: 'A', text: '增加系统性能' },
      { label: 'B', text: '评估安全控制的有效性并发现违规行为' },
      { label: 'C', text: '降低网络带宽' },
      { label: 'D', text: '自动修复漏洞' }
    ],
    correct: 'B',
    domain: '信息安全管理',
    explanation: '安全审计通过检查和评估安全控制措施的实施情况和有效性，发现安全漏洞、配置错误和违规行为，为安全改进提供依据。'
  },

  // ========== 4. 信息安全法规与标准（约10%，8题） ==========
  {
    id: 59,
    question: '《中华人民共和国网络安全法》正式实施的日期是？',
    options: [
      { label: 'A', text: '2015 年 6 月 1 日' },
      { label: 'B', text: '2016 年 6 月 1 日' },
      { label: 'C', text: '2017 年 6 月 1 日' },
      { label: 'D', text: '2018 年 6 月 1 日' }
    ],
    correct: 'C',
    domain: '信息安全法规与标准',
    explanation: '《中华人民共和国网络安全法》由全国人大常委会于 2016 年 11 月 7 日通过，自 2017 年 6 月 1 日起施行。'
  },
  {
    id: 60,
    question: '《中华人民共和国数据安全法》正式实施的日期是？',
    options: [
      { label: 'A', text: '2020 年 9 月 1 日' },
      { label: 'B', text: '2021 年 6 月 1 日' },
      { label: 'C', text: '2021 年 9 月 1 日' },
      { label: 'D', text: '2022 年 1 月 1 日' }
    ],
    correct: 'C',
    domain: '信息安全法规与标准',
    explanation: '《数据安全法》由全国人大常委会于 2021 年 6 月 10 日通过，自 2021 年 9 月 1 日起施行，是我国数据安全领域的基础性法律。'
  },
  {
    id: 61,
    question: '《中华人民共和国个人信息保护法》正式实施的日期是？',
    options: [
      { label: 'A', text: '2021 年 6 月 1 日' },
      { label: 'B', text: '2021 年 9 月 1 日' },
      { label: 'C', text: '2021 年 11 月 1 日' },
      { label: 'D', text: '2022 年 1 月 1 日' }
    ],
    correct: 'C',
    domain: '信息安全法规与标准',
    explanation: '《个人信息保护法》由全国人大常委会于 2021 年 8 月 20 日通过，自 2021 年 11 月 1 日起施行，是我国个人信息保护领域的基础性法律。'
  },
  {
    id: 62,
    question: '网络安全等级保护 2.0 的核心标准是什么？',
    options: [
      { label: 'A', text: 'GB/T 19001' },
      { label: 'B', text: 'GB/T 22239' },
      { label: 'C', text: 'GB/T 14001' },
      { label: 'D', text: 'GB/T 20000' }
    ],
    correct: 'B',
    domain: '信息安全法规与标准',
    explanation: 'GB/T 22239《信息安全技术 网络安全等级保护基本要求》是等保 2.0 的核心标准，规定了不同等级信息系统的安全保护要求。'
  },
  {
    id: 63,
    question: '网络安全等级保护将信息系统分为几个安全等级？',
    options: [
      { label: 'A', text: '3 级' },
      { label: 'B', text: '4 级' },
      { label: 'C', text: '5 级' },
      { label: 'D', text: '6 级' }
    ],
    correct: 'C',
    domain: '信息安全法规与标准',
    explanation: '等级保护将信息系统分为 5 个安全等级：第一级（自主保护）、第二级（指导保护）、第三级（监督保护）、第四级（强制保护）、第五级（专控保护）。'
  },
  {
    id: 64,
    question: '根据《网络安全法》，网络运营者应当履行的安全保护义务不包括以下哪项？',
    options: [
      { label: 'A', text: '制定内部安全管理制度和操作规程' },
      { label: 'B', text: '采取数据分类、重要数据备份和加密等措施' },
      { label: 'C', text: '定期向社会公开发布用户数据' },
      { label: 'D', text: '采取防范计算机病毒和网络攻击的技术措施' }
    ],
    correct: 'C',
    domain: '信息安全法规与标准',
    explanation: '《网络安全法》规定网络运营者应当保护用户数据安全，不得泄露、篡改、毁损其收集的个人信息，而非公开发布用户数据。'
  },
  {
    id: 65,
    question: '以下哪项属于《个人信息保护法》中定义的敏感个人信息？',
    options: [
      { label: 'A', text: '姓名' },
      { label: 'B', text: '生物识别、宗教信仰、特定身份、医疗健康、金融账户、行踪轨迹等信息' },
      { label: 'C', text: '电子邮箱地址' },
      { label: 'D', text: '工作单位' }
    ],
    correct: 'B',
    domain: '信息安全法规与标准',
    explanation: '《个人信息保护法》规定，敏感个人信息包括生物识别、宗教信仰、特定身份、医疗健康、金融账户、行踪轨迹等信息，以及不满十四周岁未成年人的个人信息。'
  },
  {
    id: 66,
    question: '等保 2.0 相比等保 1.0 的主要变化不包括？',
    options: [
      { label: 'A', text: '名称从"信息系统安全等级保护"改为"网络安全等级保护"' },
      { label: 'B', text: '扩展了保护对象，包括云计算、物联网、移动互联网等' },
      { label: 'C', text: '安全要求从"基本要求"一个层面扩展到"安全通用要求+安全扩展要求"' },
      { label: 'D', text: '将等级从 5 级减少到 3 级' }
    ],
    correct: 'D',
    domain: '信息安全法规与标准',
    explanation: '等保 2.0 仍保持 5 个安全等级不变，主要变化包括名称调整、保护对象扩展（新增云计算、物联网、移动互联、工业控制）、安全要求结构优化等。'
  },

  // ========== 5. 安全工程与运营（约10%，12题） ==========
  {
    id: 67,
    question: 'SDL 的全称是什么？',
    options: [
      { label: 'A', text: 'Software Development Lifecycle' },
      { label: 'B', text: 'Security Development Lifecycle（安全开发生命周期）' },
      { label: 'C', text: 'System Design Language' },
      { label: 'D', text: 'Secure Data Link' }
    ],
    correct: 'B',
    domain: '安全工程与运营',
    explanation: 'SDL（Security Development Lifecycle）是微软提出的安全开发生命周期，将安全活动集成到软件开发的各个阶段，从源头减少安全漏洞。'
  },
  {
    id: 68,
    question: 'STRIDE 威胁建模方法包含哪些威胁类型？',
    options: [
      { label: 'A', text: '欺骗（Spoofing）、篡改（Tampering）、否认（Repudiation）、信息泄露（Information Disclosure）、拒绝服务（Denial of Service）、权限提升（Elevation of Privilege）' },
      { label: 'B', text: '扫描（Scanning）、追踪（Tracing）、拦截（Intercepting）、删除（Deleting）、加密（Encrypting）、降级（Degrading）' },
      { label: 'C', text: '嗅探（Sniffing）、欺骗（Spoofing）、重放（Replay）、注入（Injection）、溢出（Overflow）、绕过（Bypass）' },
      { label: 'D', text: '社会工程（Social Engineering）、勒索（Ransomware）、间谍软件（Spyware）、广告软件（Adware）、 Rootkit、键盘记录（Keylogger）' }
    ],
    correct: 'A',
    domain: '安全工程与运营',
    explanation: 'STRIDE 是微软提出的威胁分类模型：S（欺骗）、T（篡改）、R（否认）、I（信息泄露）、D（拒绝服务）、E（权限提升）。'
  },
  {
    id: 69,
    question: '渗透测试的标准流程通常包括以下哪些阶段？',
    options: [
      { label: 'A', text: '信息收集 → 漏洞扫描 → 漏洞利用 → 后渗透 → 报告输出' },
      { label: 'B', text: '直接攻击 → 获取权限 → 删除日志' },
      { label: 'C', text: '安装工具 → 批量扫描 → 自动利用' },
      { label: 'D', text: '社会工程 → 物理入侵 → 数据窃取' }
    ],
    correct: 'A',
    domain: '安全工程与运营',
    explanation: '标准渗透测试流程包括：信息收集（侦察）、漏洞扫描、漏洞利用、后渗透（横向移动、权限维持）、报告输出等阶段。'
  },
  {
    id: 70,
    question: '以下哪个工具属于渗透测试框架？',
    options: [
      { label: 'A', text: 'Microsoft Word' },
      { label: 'B', text: 'Metasploit' },
      { label: 'C', text: 'Adobe Photoshop' },
      { label: 'D', text: 'Google Chrome' }
    ],
    correct: 'B',
    domain: '安全工程与运营',
    explanation: 'Metasploit 是最流行的开源渗透测试框架，包含大量漏洞利用模块和辅助工具，广泛用于安全测试和漏洞研究。'
  },
  {
    id: 71,
    question: '在 DevSecOps 中，"安全"应该处于什么位置？',
    options: [
      { label: 'A', text: '仅在系统上线前进行安全测试' },
      { label: 'B', text: '贯穿整个开发和运维生命周期' },
      { label: 'C', text: '仅在发现漏洞后介入' },
      { label: 'D', text: '完全由安全团队独立负责' }
    ],
    correct: 'B',
    domain: '安全工程与运营',
    explanation: 'DevSecOps 强调将安全实践集成到 DevOps 的每个阶段，实现"安全左移"，使安全成为开发和运维全生命周期的内在组成部分。'
  },
  {
    id: 72,
    question: '以下哪个是安全编码的重要原则？',
    options: [
      { label: 'A', text: '信任所有用户输入' },
      { label: 'B', text: '对所有外部输入进行验证和过滤' },
      { label: 'C', text: '使用硬编码密码方便调试' },
      { label: 'D', text: '禁用所有安全机制以提高性能' }
    ],
    correct: 'B',
    domain: '安全工程与运营',
    explanation: '安全编码的核心原则之一是对所有外部输入（用户输入、文件、网络数据等）进行严格的验证、过滤和消毒处理，防止注入类攻击。'
  },
  {
    id: 73,
    question: '以下哪个是安全运维（SecOps）的核心活动？',
    options: [
      { label: 'A', text: '仅关注系统性能优化' },
      { label: 'B', text: '持续监控、威胁检测、事件响应和漏洞管理' },
      { label: 'C', text: '仅负责软件功能开发' },
      { label: 'D', text: '仅处理用户投诉' }
    ],
    correct: 'B',
    domain: '安全工程与运营',
    explanation: '安全运维的核心活动包括持续的安全监控、威胁检测与分析、安全事件响应、漏洞和补丁管理、日志审计等，确保系统持续安全运行。'
  },
  {
    id: 74,
    question: '以下哪个是代码审计的主要目的？',
    options: [
      { label: 'A', text: '提高代码运行速度' },
      { label: 'B', text: '发现源代码中的安全漏洞和编码缺陷' },
      { label: 'C', text: '美化代码格式' },
      { label: 'D', text: '减少代码行数' }
    ],
    correct: 'B',
    domain: '安全工程与运营',
    explanation: '代码审计通过人工或自动化工具检查源代码，发现潜在的安全漏洞（如注入、缓冲区溢出、硬编码密钥等）和编码缺陷，在开发阶段消除安全隐患。'
  },
  {
    id: 75,
    question: '以下哪个不属于常见的安全测试类型？',
    options: [
      { label: 'A', text: '黑盒测试' },
      { label: 'B', text: '白盒测试' },
      { label: 'C', text: '灰盒测试' },
      { label: 'D', text: '蓝盒测试' }
    ],
    correct: 'D',
    domain: '安全工程与运营',
    explanation: '常见的安全测试类型包括黑盒测试（无内部信息）、白盒测试（有完整内部信息）、灰盒测试（有部分内部信息）。"蓝盒测试"不是标准的安全测试术语。'
  },
  {
    id: 76,
    question: '在数据中心物理安全中，环境监控系统主要监控什么？',
    options: [
      { label: 'A', text: '员工考勤' },
      { label: 'B', text: '温度、湿度、烟雾、漏水等环境参数' },
      { label: 'C', text: '网络带宽使用情况' },
      { label: 'D', text: '软件版本更新' }
    ],
    correct: 'B',
    domain: '安全工程与运营',
    explanation: '环境监控系统监测数据中心的温度、湿度、烟雾、漏水、电力等环境参数，确保 IT 设备在适宜的环境中稳定运行。'
  },
  {
    id: 77,
    question: '以下哪个是安全基线（Security Baseline）的主要作用？',
    options: [
      { label: 'A', text: '提高网络带宽' },
      { label: 'B', text: '定义系统或设备的最低安全配置要求' },
      { label: 'C', text: '替代防火墙功能' },
      { label: 'D', text: '自动修复所有漏洞' }
    ],
    correct: 'B',
    domain: '安全工程与运营',
    explanation: '安全基线定义了系统、网络设备或应用程序的最低安全配置要求，作为部署和运维的安全标准，减少因配置不当导致的安全风险。'
  },
  {
    id: 78,
    question: '以下哪个是漏洞管理流程的正确顺序？',
    options: [
      { label: 'A', text: '发现 → 评估 → 修复 → 验证 → 报告' },
      { label: 'B', text: '修复 → 发现 → 评估 → 验证' },
      { label: 'C', text: '报告 → 发现 → 修复 → 验证' },
      { label: 'D', text: '验证 → 发现 → 评估 → 修复' }
    ],
    correct: 'A',
    domain: '安全工程与运营',
    explanation: '漏洞管理的标准流程包括：发现（扫描/识别）、评估（风险评级）、修复（打补丁/缓解措施）、验证（确认修复效果）、报告（记录和汇报）。'
  },
];
