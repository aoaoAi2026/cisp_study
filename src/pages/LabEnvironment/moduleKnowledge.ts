import type { ModuleKnowledge } from './types';

/** 各模块的知识面板数据 */
export const MODULE_KNOWLEDGE: Record<string, ModuleKnowledge> = {
  xss: {
    theory: `XSS（跨站脚本攻击）是在目标网站注入恶意脚本的攻击方式。当用户浏览被注入脚本的页面时，脚本在用户浏览器中执行，从而窃取Cookie、劫持会话或重定向到钓鱼网站。分为三种类型：反射型（非持久化）、存储型（持久化）和DOM型（客户端）。`,
    vectors: [
      '<script>alert(1)</script> — 最基础的script标签注入',
      '<img src=x onerror=alert(1)> — 利用img标签的事件处理器',
      '<svg onload=alert(1)> — SVG标签的事件处理器绕过',
      'javascript:alert(1) — 伪协议注入',
      '<body onload=alert(1)> — 利用body事件',
      '\'"><script>alert(1)</script> — 闭合引号+标签突破',
      '<scr<script>ipt>alert(1)</scr</script>ipt> — 嵌套绕过WAF',
    ],
    defenses: [
      '对所有用户输入进行HTML实体编码（< → &lt; > → &gt;）',
      '设置HttpOnly Cookie防止JavaScript读取',
      '使用CSP（Content-Security-Policy）头部限制脚本来源',
      '使用DOMPurify等库对HTML内容进行白名单过滤',
      '避免使用innerHTML，使用textContent或createTextNode',
      '输入验证：限制输入长度和允许的字符集',
    ],
    cves: ['CVE-2024-27980 - Node.js child_process XSS', 'CVE-2023-3079 - Google Chrome V8类型混淆XSS'],
    cispPoints: [
      'XSS是CISP考试Web安全部分的必考内容',
      '需掌握三种XSS类型的区别与防御方法',
      '理解同源策略、CSP与XSS防御的关系',
    ],
    tools: ['Burp Suite Scanner', 'XSStrike', 'DOMPurify', 'NoScript浏览器插件'],
  },

  sqli: {
    theory: `SQL注入（SQL Injection）是通过将恶意的SQL代码插入到应用程序的输入参数中，欺骗数据库执行非预期查询的攻击方式。攻击者可以绕过认证、窃取数据、修改数据甚至执行系统命令。分为联合查询注入、布尔盲注、时间盲注和报错注入四大类。`,
    vectors: [
      "' OR '1'='1 — 绕过登录认证的经典payload",
      "' UNION SELECT 1,2,3-- — 联合查询确定列数",
      "' UNION SELECT user(),database()-- — 获取数据库信息",
      "' AND SLEEP(5)-- — 时间盲注探测",
      "' AND (SELECT LENGTH(database()))>5-- — 布尔盲注",
      "' AND EXTRACTVALUE(1,CONCAT(0x7e,USER()))-- — 报错注入",
      "'; DROP TABLE users;-- — 破坏性SQL注入",
      "1'; SELECT LOAD_FILE('/etc/passwd')-- — 文件读取",
    ],
    defenses: [
      '使用参数化查询（Prepared Statements）是最佳防御',
      '使用ORM框架（避免拼接SQL）',
      '存储过程 + 严格的参数类型校验',
      '最小权限原则：数据库账户只授予必要权限',
      'Web应用防火墙（WAF）设置SQL注入规则',
      '输入验证：白名单验证 + 类型转换',
    ],
    cves: ['CVE-2024-1597 - PostgreSQL JDBC SQL注入', 'CVE-2023-34362 - MOVEit Transfer SQL注入'],
    cispPoints: [
      'SQL注入是OWASP Top 10长期位居前列的漏洞',
      '参数化查询 vs 输入过滤的区别（考试重点）',
      '需了解宽字节注入等特殊变种',
    ],
    tools: ['sqlmap', 'Burp Suite', 'SQLninja', 'Havij'],
  },

  ctf: {
    theory: `CTF（Capture The Flag）是网络安全竞赛形式。参赛者通过分析目标系统、解密信息、利用漏洞来获取隐藏的Flag。常见分类包括：Web安全、密码学（Crypto）、逆向工程（Reverse）、杂项（Misc）和Pwn（二进制漏洞利用）。`,
    vectors: [
      'Web：SQL注入、XSS、文件包含、反序列化、SSRF',
      '密码学：Base64、ROT13、XOR、RSA攻击、哈希破解',
      '逆向：反编译、动态调试、strings分析、加壳检测',
      '杂项：隐写术、流量分析、取证、编码转换',
      'Pwn：栈溢出、ROP链、格式化字符串、堆利用',
    ],
    defenses: ['CTF不是为了学习防御，而是理解攻击原理', '在实际系统中，应使用对应的防御措施（参考各模块）'],
    cves: [],
    cispPoints: [
      'CTF是理解攻击原理的最佳实践方式',
      '护网行动（HW）中常涉及类似的攻防场景',
      '推荐在CTFtime.org关注国际赛事',
    ],
    tools: ['Burp Suite', 'Ghidra', 'Wireshark', 'Python', 'CyberChef', 'pwntools'],
  },

  password: {
    theory: `密码破解是通过暴力枚举、字典匹配或彩虹表查询等方式获取密码明文的过程。现代密码系统使用加盐哈希（如bcrypt、Argon2）增加破解难度。破解方法包括字典攻击（使用常见密码列表）、暴力破解（穷举所有组合）和彩虹表攻击（预计算的Hash→密码映射表）。`,
    vectors: [
      '字典攻击：使用rockyou.txt等常见密码字典',
      '暴力破解：按字符集穷举（数字→字母→特殊字符）',
      '彩虹表：预计算Hash链，空间换时间',
      'Hash识别：通过长度和格式判断Hash类型',
      '组合攻击：常见单词+数字+特殊字符的组合',
    ],
    defenses: [
      '使用bcrypt、Argon2id等慢Hash算法',
      '加盐（Salt）：每个密码使用不同的随机盐值',
      '实施账号锁定策略（5次失败锁定）',
      '强制密码强度策略（长度+复杂度）',
      '使用多因素认证（MFA/2FA）作为额外防护',
    ],
    cves: ['CVE-2024-3094 - xz/liblzma后门（供应链攻击）'],
    cispPoints: [
      'CISP考试要求了解Hash函数的基本概念',
      '密码策略是信息安全管理的重要部分',
      '了解等保2.0对密码强度的要求',
    ],
    tools: ['hashcat', 'John the Ripper', 'Hydra', 'Hash-Identifier'],
  },

  crypto: {
    theory: `密码学是研究信息加密、解密和认证的科学。对称加密（AES、DES）使用相同密钥加解密；非对称加密（RSA、ECC）使用公钥加密私钥解密；哈希函数（SHA256、MD5）用于完整性校验；Base64和JWT是编码/令牌格式，非加密算法。`,
    vectors: [
      'AES-ECB模式：相同明文块产生相同密文块（企鹅攻击）',
      'RSA小指数攻击：e=3时存在广播攻击',
      'JWT alg=none攻击：篡改算法为空绕过签名验证',
      '哈希长度扩展攻击：适用于MD5/SHA1/SHA2（不含SHA3）',
      '填充预言攻击：利用解密填充错误泄露明文',
    ],
    defenses: [
      '对称加密使用AES-GCM（认证加密模式）',
      'RSA密钥至少2048位，使用OAEP填充',
      'JWT必须验证签名算法，禁止alg=none',
      '使用SHA256/SHA3替代MD5和SHA1',
      '密钥管理：使用HSM或密钥管理服务',
    ],
    cves: ['CVE-2022-21449 - Java ECDSA签名伪造'],
    cispPoints: [
      '对称/非对称加密的区别是考试基础题',
      '了解数字签名和数字证书的原理',
      '国密算法SM2/SM3/SM4的基本知识',
    ],
    tools: ['CyberChef', 'OpenSSL', 'hashcat', 'jwt.io', 'PyCryptodome'],
  },

  network: {
    theory: `网络攻击利用网络协议的缺陷进行欺骗、拦截和破坏。ARP欺骗通过伪造ARP响应劫持局域网流量；DNS劫持篡改域名解析结果；中间人攻击插入通信链路窃取信息；SYN Flood利用TCP三次握手耗尽服务器资源。`,
    vectors: [
      'ARP欺骗：伪造ARP响应，声称攻击者MAC是网关IP',
      'DNS劫持：拦截DNS查询，返回伪造的IP地址',
      '中间人攻击：建立两条独立加密通道，解密/重加密',
      'SYN Flood：发送大量SYN包填满半连接队列',
      'DNS放大攻击：利用DNS响应比请求大实现DDoS',
    ],
    defenses: [
      'ARP防护：使用静态ARP表/DHCP Snooping/DAI',
      'DNS防护：使用DNSSEC验证解析结果',
      'MitM防护：证书固定（Certificate Pinning）',
      'SYN Flood：启用SYN Cookie/TCP半连接队列优化',
      '网络分段和防火墙规则限制',
    ],
    cves: ['CVE-2024-38077 - Windows远程桌面许可服务RCE'],
    cispPoints: [
      'CISP考试覆盖OSI七层模型及各层攻击',
      '等保2.0对网络安全的合规要求',
      '了解IDS/IPS的工作原理',
    ],
    tools: ['Wireshark', 'Ettercap', 'Bettercap', 'Scapy', 'Nmap'],
  },

  vulncode: {
    theory: `安全编码的核心是"不信任任何输入"。许多安全漏洞的根源都在于代码层面的不安全实现。SQL注入源于字符串拼接SQL、XSS源于直接拼接HTML、命令注入源于调用系统命令时拼接用户输入。通过对比不安全代码和安全代码可以直观理解修复方法。`,
    vectors: [
      'SQL注入 → 字符串拼接 vs 参数化查询',
      'XSS → innerHTML vs textContent/DOMPurify',
      '命令注入 → os.system vs subprocess.run(list)',
      '路径遍历 → open(user_name) vs os.path.normpath+验证',
      '反序列化 → pickle.loads vs json.loads',
      '硬编码密钥 → 代码中写死 vs 环境变量',
      '弱加密 → MD5/DES vs SHA256+盐值/AES-GCM',
      '无限速 → 无限制 vs 速率限制器',
    ],
    defenses: [
      '输入验证：所有外部输入必须验证（白名单优先）',
      '输出编码：根据上下文选择合适的编码方式',
      '参数化查询：永远不要拼接SQL',
      '安全API：使用安全的库函数替代危险函数',
      '最小权限：代码运行在最低必要权限下',
    ],
    cves: [],
    cispPoints: [
      '安全编码实践是CISP考试的重要组成部分',
      '理解OWASP Top 10与代码层面的对应关系',
      '掌握SDL（安全开发生命周期）的基本概念',
    ],
    tools: ['SonarQube', 'CodeQL', 'Bandit', 'ESLint安全插件', 'Snyk'],
  },

  burp: {
    theory: `Burp Suite是最常用的Web安全测试工具。代理功能拦截和修改HTTP/HTTPS请求；Repeater允许手动重放和修改请求；Intruder用于自动化测试（如暴力破解、参数测试）；Scanner自动发现漏洞。本模拟器让你体验核心的请求编辑与响应分析功能。`,
    vectors: [
      '修改请求参数测试输入验证',
      '修改Cookie测试会话管理',
      '添加/修改HTTP头测试安全头',
      '修改请求方法（GET→POST）测试接口兼容性',
      '重放请求测试幂等性和竞态条件',
    ],
    defenses: [
      '服务端必须验证所有输入，不可信任客户端',
      '实施CSRF Token防止跨站请求伪造',
      '设置安全响应头（X-Frame-Options、CSP等）',
      '使用HTTPS防止中间人修改流量',
    ],
    cves: [],
    cispPoints: [
      '渗透测试工具链的了解是CISP实操考点',
      '理解HTTP协议基础（方法、状态码、头部）',
    ],
    tools: ['Burp Suite Pro', 'OWASP ZAP', 'Fiddler', 'Charles', 'Mitmproxy'],
  },

  waf: {
    theory: `WAF（Web应用防火墙）通过检测HTTP请求中的恶意模式来保护Web应用。核心工作模式包括：黑名单（拦截已知攻击特征）、白名单（只允许已知安全请求）、正则规则匹配。WAF可以部署在网络层、主机层或云层。`,
    vectors: [
      'SQL注入 → 检测 UNION SELECT、DROP、1=1 等关键字',
      'XSS → 检测 <script>、onerror=、javascript: 等',
      '路径遍历 → 检测 ../、..\\ 模式',
      '命令注入 → 检测 ;、|、&&、$() 等分隔符',
      '文件包含 → 检测 php://、file:// 等协议',
    ],
    defenses: [
      'WAF不是万能药，需配合安全编码使用',
      '定期更新WAF规则库',
      '使用自定义规则覆盖业务特有场景',
      '设置WAF日志监控和告警',
      '结合RASP（运行时应用自我保护）提供纵深防御',
    ],
    cves: [],
    cispPoints: [
      'WAF是等保2.0中网络安全的重要组成部分',
      '了解WAF的部署模式（反向代理、透明桥接）',
      '理解WAF绕过的常见方法',
    ],
    tools: ['ModSecurity', 'CloudFlare WAF', 'AWS WAF', 'NAXSI'],
  },

  log: {
    theory: `日志分析是安全运营的核心能力。通过分析Web服务器日志、认证日志和系统日志，安全分析师可以发现攻击行为、追踪入侵路径、收集证据。常见的日志格式包括：Apache/Nginx的CLF（通用日志格式）和Syslog格式。`,
    vectors: [
      '暴力破解：短时间内大量失败登录记录',
      'SQL注入：URL参数中包含SQL关键字',
      'XSS攻击：URL中包含script标签',
      '目录扫描：大量404响应码来自同一IP',
      'Webshell访问：异常的PHP文件请求',
      '数据泄露：异常大的响应体或大量数据导出',
    ],
    defenses: [
      '启用所有关键服务的日志记录',
      '集中化日志管理（ELK/Splunk/安全中心）',
      '设置日志告警规则（如：5分钟内10次失败登录）',
      '日志保留至少6个月（合规要求）',
      '日志完整性保护（防止篡改）',
    ],
    cves: [],
    cispPoints: [
      '安全审计和日志分析是CISP重要考点',
      '等保2.0要求日志保留至少6个月',
      '了解SIEM（安全信息和事件管理）的概念',
    ],
    tools: ['ELK Stack', 'Splunk', 'Graylog', 'Wazuh', 'GoAccess'],
  },

  logic: {
    theory: `逻辑漏洞（Business Logic Vulnerabilities）发生在应用程序的业务流程中存在设计缺陷，而非技术层面的漏洞。攻击者利用正常的应用功能以非预期方式达到恶意目的。这类漏洞难以被自动化工具检测，需要人工理解业务流程。`,
    vectors: [
      '价格篡改：修改请求中的价格参数（负数、0元、溢出）',
      '优惠券滥用：重复使用、叠加使用、修改优惠券面额',
      '越权访问：修改URL中的ID参数访问他人数据（IDOR）',
      '步骤绕过：跳过支付步骤直接完成订单',
      '竞态条件：并发请求绕过余额检查',
      '数量溢出：修改购买数量为负数或极大值',
    ],
    defenses: [
      '服务端验证所有关键业务参数（不信任客户端）',
      '数据库事务+行锁保证原子操作',
      '严格的权限检查：每次请求验证用户对资源的访问权',
      '状态机验证：确保业务流程按正确顺序进行',
      '优惠券防重：数据库记录每次使用，唯一约束',
    ],
    cves: [],
    cispPoints: [
      '逻辑漏洞是近年网络安全考试的新增热点',
      '理解OWASP Top 10中失效的访问控制（A01）',
      '了解SSRF、CSRF等与逻辑漏洞的关联',
    ],
    tools: ['Burp Suite', '手动测试', '代码审计'],
  },
};
