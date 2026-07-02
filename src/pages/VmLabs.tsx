import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, Terminal, RefreshCw, ChevronDown, ChevronRight, Play,
  AlertTriangle, CheckCircle2, XCircle, Clock, Send, Download,
  Trash2, Server, ShieldAlert, KeyRound, Crosshair, Compass,
  Network, Zap, Copy, Bug, Cpu, Wifi, WifiOff, Activity,
  ExternalLink, Target, Globe2, BookMarked, BookOpen, Lightbulb, Info,
} from 'lucide-react';

// ===== 类型 =====
type MachineStatus = {
  id: string;
  name: string;
  role: string;
  os: string;
  icon: string;
  host: string;
  port?: number;
  online?: boolean;
  latencyMs?: number;
  pingOk?: boolean;
  openPorts?: Array<{ port: number; protocol: string; service: string; extra?: string }>;
  info?: string;
  error?: string;
  connectedSince?: number | null;
  nmapSnippet?: string;
};

type AttackStep = {
  id: string;
  name: string;
  description: string;
  command: string;
  timeout?: number;
  dangerous?: boolean;
};

type AttackModule = {
  id: string;
  name: string;
  icon: string;
  color: string;
  steps: AttackStep[];
};

type ExecOutput = {
  execId: string;
  label: string;
  command: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  startedAt: string;
  moduleId?: string;
  stepId?: string;
  stepName?: string;
};

type HistoryItem = {
  execId: string;
  startedAt: string;
  endedAt?: string;
  label?: string;
  command: string;
  exitCode: number;
  success: boolean;
  moduleId?: string;
  stepId?: string;
};

type QuickTool = {
  id: string;
  name: string;
  cmd: string;
  timeout?: number;
  icon: string;
  category: string;
};

type DvwaTarget = {
  id: string;
  name: string;
  icon: string;
  machine: string;
  baseUrl: string;
  color?: string;
  builtBy?: string;
  defaultCredsHint?: string;
  loginPage?: string;
  setupPage?: string;
  online?: boolean;
  latencyMs?: number;
  httpCode?: number;
  setupCode?: number;
  requiresSetup?: boolean;
  looksLikeDvwa?: boolean;
  bodySnippet?: string;
  error?: string;
};

// ===== 新增：通用 Web 靶场类型 =====
type WebTarget = {
  id: string;
  name: string;
  icon: string;
  machine: string;
  baseUrl: string;
  color?: string;
  category?: string;
  categoryLabel?: string;
  builtBy?: string;
  status?: 'ready' | 'planned' | 'building' | 'unavailable';
  description?: string;
  vulnerabilities?: string[];
  difficulty?: string | null;
  defaultCredsHint?: string;
  loginUrl?: string;
  setupUrl?: string;
  plannedNotice?: string;
  // 实时检查字段
  online?: boolean;
  latencyMs?: number | null;
  httpCode?: number | null;
  verified?: boolean;
  signaturesMatched?: string[];
  bodySnippet?: string;
  checkNote?: string;
  error?: string;
};

type WebCategory = {
  key: string;
  label: string;
  icon: string;
  color: string;
};

type WebStats = {
  totalCount: number;
  readyCount: number;
  plannedCount: number;
  onlineCount: number;
};

// ============================================================
// 前端 Fallback 数据（后端未启动/API失败时直接展示，保证页面不会空白）
// ============================================================

const FALLBACK_MACHINES: MachineStatus[] = [
  {
    id: 'kali',
    name: 'Kali Linux（攻击机）',
    role: 'attacker',
    os: 'Kali Linux',
    icon: '🐉',
    host: '192.168.108.128',
    port: 22,
    online: false,
    info: '未连接到后端，请启动后端服务并启用 Kali SSH（端口 22，账号 kail / 密码 kail）',
    error: '后端未连接：无法进行 SSH 健康检查',
  },
  {
    id: 'win7',
    name: 'Windows 7（靶机）',
    role: 'target',
    os: 'Windows 7',
    icon: '🪟',
    host: '192.168.108.129',
    online: false,
    info: '未连接到后端：无法进行端口扫描',
    error: '后端未连接：无法进行 Ping/Nmap 探测',
  },
];

const FALLBACK_CATEGORIES: WebCategory[] = [
  { key: 'web-general', label: 'Web通用漏洞练习', icon: '🌐', color: 'indigo' },
  { key: 'windows-priv', label: 'Windows提权', icon: '🪟', color: 'amber' },
  { key: 'intranet-domain', label: '内网域环境', icon: '🏰', color: 'rose' },
  { key: 'middleware', label: '中间件漏洞', icon: '🧱', color: 'emerald' },
  { key: 'cms', label: 'CMS漏洞', icon: '📰', color: 'fuchsia' },
  { key: 'java-deserialize', label: 'Java反序列化', icon: '☕', color: 'orange' },
  { key: 'enterprise', label: '企业级综合靶场', icon: '🏢', color: 'violet' },
];

const FALLBACK_WEB_TARGETS: WebTarget[] = [
  // ==================== status=ready（11 个已就绪）====================
  { id: 'dvwa', name: 'DVWA · Damn Vulnerable Web App', icon: '🎯', machine: 'kali', baseUrl: 'http://192.168.108.128/dvwa/', color: 'cyan', category: 'web-general', categoryLabel: 'Web通用漏洞练习', builtBy: 'day085 · APT 包 + MariaDB（Apache 80）', status: 'ready', defaultCredsHint: 'admin / password', loginUrl: 'http://192.168.108.128/dvwa/login.php', setupUrl: 'http://192.168.108.128/dvwa/setup.php', description: '经典 Damn Vulnerable Web Application，覆盖 SQLi/XSS/CSRF/命令注入/文件包含/上传等所有常见 Web 漏洞类型，入门必练。', vulnerabilities: ['SQL注入', 'XSS跨站脚本', 'CSRF', '命令注入', '文件包含', '文件上传', '暴力破解', '弱会话ID'] },
  { id: 'sqli-labs', name: 'SQLi-Labs · 注入专项77关', icon: '🗃️', machine: 'kali', baseUrl: 'http://192.168.108.128/sqli-labs/', color: 'indigo', category: 'web-general', categoryLabel: 'Web通用漏洞练习', builtBy: 'day086 · GitHub源码部署 /sqli-labs 路径', status: 'ready', defaultCredsHint: 'root/root（文档）/ leet/leet123（实际）', setupUrl: 'http://192.168.108.128/sqli-labs/sql-connections/setup-db.php', description: '专注 SQL 注入的经典靶场，77 个关卡 Page1~4，覆盖 GET/POST/Cookie/Header 注入、布尔/时间盲注、报错注入、堆叠注入、二次注入等全部场景。', vulnerabilities: ['GET注入', 'POST注入', 'Cookie注入', 'Header注入', '布尔盲注', '时间盲注', '报错注入', '堆叠注入', '二次注入', 'WAF绕过'] },
  { id: 'xss-challenges', name: 'XSS-Challenges · XSS专项', icon: '💉', machine: 'kali', baseUrl: 'http://192.168.108.128/xss/', color: 'rose', category: 'web-general', categoryLabel: 'Web通用漏洞练习', builtBy: 'day087 · GitHub源码部署 /xss 路径', status: 'ready', defaultCredsHint: '无需登录', description: '专注 XSS 跨站脚本的专项靶场，覆盖反射型、存储型、DOM 型、CSP 绕过、JSfuck、Unicode 绕过等多场景 XSS 挑战。', vulnerabilities: ['反射型XSS', '存储型XSS', 'DOM型XSS', 'CSP绕过', '编码绕过', 'Flash XSS'] },
  { id: 'pikachu', name: 'Pikachu · 皮卡丘中文靶场', icon: '⚡', machine: 'kali', baseUrl: 'http://192.168.108.128/pikachu/', color: 'rose', category: 'web-general', categoryLabel: 'Web通用漏洞练习', builtBy: 'day088 · PHP+MariaDB 源码部署 /pikachu 路径', status: 'ready', defaultCredsHint: 'admin / 123456（pikachu/000000, test/abc123）', loginUrl: 'http://192.168.108.128/pikachu/index.php', setupUrl: 'http://192.168.108.128/pikachu/install.php', description: '国内知名中文 Web 安全练习靶场，含 12 大漏洞模块，对 SSRF、XXE、反序列化、PHP 反序列化、逻辑漏洞覆盖全面，讲解深入浅出。', vulnerabilities: ['SQL注入', 'XSS', 'CSRF', 'SSRF', 'XXE', '文件上传', '文件包含', '反序列化', '逻辑漏洞', '越权访问'] },
  { id: 'upload-labs', name: 'Upload-Labs · 文件上传专项21关', icon: '📤', machine: 'kali', baseUrl: 'http://192.168.108.128:8084/', color: 'teal', category: 'web-general', categoryLabel: 'Web通用漏洞练习', builtBy: 'day089 · PHP独立环境（端口 8084）', status: 'ready', defaultCredsHint: 'admin / admin', description: '专注文件上传漏洞的靶场，共 21 关，系统覆盖前端 JS 校验、MIME 类型绕过、后缀黑名单绕过、%00 截断、.htaccess、解析漏洞等全部上传技巧。', vulnerabilities: ['前端JS绕过', 'MIME绕过', '后缀黑名单绕过', '%00截断', '.user.ini', '.htaccess', 'Apache解析漏洞', 'IIS解析漏洞'] },
  { id: 'bwapp', name: 'bWAPP · 158漏洞综合应用', icon: '🐝', machine: 'kali', baseUrl: 'http://192.168.108.128/bwapp/login.php', color: 'amber', category: 'web-general', categoryLabel: 'Web通用漏洞练习', builtBy: 'day090 · PHP+MariaDB /bwapp 路径', status: 'ready', defaultCredsHint: 'bee / bug（安装 admin / 12345678）', loginUrl: 'http://192.168.108.128/bwapp/login.php', setupUrl: 'http://192.168.108.128/bwapp/install.php', description: 'bWAPP (buggy web application) 158 个漏洞练习点，覆盖 OWASP Top 10、HTML5、XML、Heartbleed、Shellshock、SSL 等，综合漏洞训练平台。', vulnerabilities: ['SQLi', 'XSS', 'XXE', 'SSRF', 'CSRF', '点击劫持', 'Heartbleed', 'Shellshock', '上传', '包含'] },
  { id: 'tomcat', name: 'Tomcat PUT RCE · CVE-2017-12615', icon: '🐈', machine: 'kali', baseUrl: 'http://192.168.108.128:8080/', color: 'emerald', category: 'middleware', categoryLabel: '中间件漏洞', builtBy: 'day092 · 独立 Tomcat 8.5.19 Docker（端口 8080）', status: 'ready', defaultCredsHint: 'tomcat / tomcat（manager后台）', description: 'Tomcat 任意文件写入导致 RCE（CVE-2017-12615），配合弱口令 manager 后台部署 WAR 包拿 Shell，Java 中间件经典入门漏洞。', vulnerabilities: ['CVE-2017-12615 PUT上传', 'Manager弱口令', 'WAR包部署RCE'] },
  { id: 'struts2', name: 'Struts2 S2-045 OGNL RCE', icon: '🏗️', machine: 'kali', baseUrl: 'http://192.168.108.128:8082/', color: 'orange', category: 'java-deserialize', categoryLabel: 'Java反序列化', builtBy: 'day093 · Vulhub Docker 容器（端口 8082）', status: 'ready', description: 'S2-045（CVE-2017-5638）基于 Content-Type 头的 OGNL 表达式注入 RCE，Java 漏洞利用必知必会经典 Payload。', vulnerabilities: ['S2-045 OGNL RCE', 'S2-016 命令执行', 'S2-007 类型转换注入', 'DevMode RCE'] },
  { id: 'thinkphp', name: 'ThinkPHP 5.x RCE 靶场', icon: '🧠', machine: 'kali', baseUrl: 'http://192.168.108.128:8081/', color: 'violet', category: 'cms', categoryLabel: 'CMS漏洞', builtBy: 'day096 · Vulhub Docker 独立 PHP 实例（端口 8081）', status: 'ready', description: 'ThinkPHP 5.0.x/5.1.x 系列 RCE 漏洞，覆盖 method=__construct 变量覆盖、s=index/think\\app/invokefunction 等经典利用链。', vulnerabilities: ['ThinkPHP 5 RCE', '变量覆盖RCE', 'invokefunction RCE', 'Session反序列化'] },
  { id: 'webgoat', name: 'WebGoat · Java安全教学40章(+WebWolf)', icon: '🐐', machine: 'kali', baseUrl: 'http://192.168.108.128:8083/WebGoat', color: 'lime', category: 'web-general', categoryLabel: 'Web通用漏洞练习', builtBy: 'day098 · SpringBoot JAR (WebGoat 8083 / WebWolf 9091)', status: 'ready', defaultCredsHint: 'guest / guest（可自注册）', loginUrl: 'http://192.168.108.128:8083/WebGoat/login', description: 'OWASP WebGoat 著名 Java Web 安全教学平台，覆盖认证绕过、JWT、SQLi、XXE、路径遍历、反序列化等 40+ 章节；配套 WebWolf :9091 接收外带数据。', vulnerabilities: ['SQLi(高级)', 'JWT攻击', 'XXE', 'SSRF', '反序列化', '认证绕过', '路径遍历', 'Open Redirect'] },
  { id: 'vulhub-platform', name: 'Vulhub平台 · 200+容器化CVE环境', icon: '📦', machine: 'kali', baseUrl: 'http://192.168.108.128:8000/', color: 'fuchsia', category: 'enterprise', categoryLabel: '企业级综合靶场', builtBy: 'dayXXX · Docker Compose 编排 Vulhub 仓库（4 容器已运行 + 一键扩展）', status: 'ready', defaultCredsHint: '不同环境独立账号（见 Vulhub 官方文档）', description: 'Vulhub 开源漏洞靶场平台，覆盖 200+ 真实 CVE 环境，含 Fastjson/Shiro/Log4j2/ThinkPHP/WebLogic/Nginx/Spring 等一键 docker-compose up 启动。当前已运行：Tomcat/Struts2/ThinkPHP/平台首页。', vulnerabilities: ['Fastjson系列', 'Shiro系列', 'Log4j2系列', 'ThinkPHP系列', 'WebLogic系列', 'Nginx解析漏洞', 'Spring系列'] },

  // ==================== status=planned（5 个待搭建 Vulhub Docker）====================
  { id: 'fastjson', name: 'Fastjson 反序列化 RCE 合集', icon: '⚡', machine: 'kali', baseUrl: 'http://192.168.108.128:8090/', color: 'lime', category: 'java-deserialize', categoryLabel: 'Java反序列化', builtBy: 'day100 · Vulhub Docker 编排多版本 Fastjson 镜像', status: 'planned', defaultCredsHint: '无需登录（接口靶场）', description: 'Fastjson 1.2.x 反序列化 RCE 合集，覆盖 JNDI 注入（JdbcRowSetImpl、TemplatesImpl）、AutoType 绕过、BCEL ClassLoader 等多版本利用链。', vulnerabilities: ['Fastjson 1.2.24 JNDI', 'Fastjson 1.2.47 AutoType', 'Fastjson 1.2.68 绕过', 'BCEL ClassLoader'], plannedNotice: 'day100 planned · Vulhub Docker 编排 :8090' },
  { id: 'log4j2', name: 'Log4j2 JNDI RCE · Log4Shell', icon: '🌲', machine: 'kali', baseUrl: 'http://192.168.108.128:8983/', color: 'sky', category: 'java-deserialize', categoryLabel: 'Java反序列化', builtBy: 'day101 · Vulhub Docker spring-boot / solr 镜像', status: 'planned', defaultCredsHint: 'Solr 无需登录（其他环境看文档）', description: 'CVE-2021-44228 Log4Shell，近年影响最广的 RCE。覆盖 ${jndi:ldap://} 基础利用、WAF 绕过、高版本 JDK trustURLCodebase 限制绕过等。', vulnerabilities: ['Log4Shell CVE-2021-44228', 'CVE-2021-45046 绕过', 'DNSLOG外带', 'RMI/JRMP 替代协议'], plannedNotice: 'day101 planned · Vulhub Docker Solr :8983' },
  { id: 'shiro', name: 'Shiro RememberMe 反序列化 RCE', icon: '🔒', machine: 'kali', baseUrl: 'http://192.168.108.128:8080/', color: 'slate', category: 'java-deserialize', categoryLabel: 'Java反序列化', builtBy: 'day102 · Vulhub Docker shiro 1.2.4 / 1.4.1 多版本', status: 'planned', defaultCredsHint: 'root / 123456', loginUrl: 'http://192.168.108.128:8080/login', description: 'Apache Shiro 默认密钥 Shiro-550 / Shiro-721，硬编码 AES Key 导致反序列化 RCE，蓝队流量特征明显（rememberMe=xxx Cookie）。', vulnerabilities: ['Shiro-550 默认密钥', 'Shiro-721 Padding Oracle', 'CC/CommonsBeanutils 利用链'], plannedNotice: 'day102 planned · Vulhub Docker 镜像' },
  { id: 'nginx', name: 'Nginx 解析漏洞/配置缺陷靶场', icon: '🚀', machine: 'kali', baseUrl: 'http://192.168.108.128:8080/', color: 'emerald', category: 'middleware', categoryLabel: '中间件漏洞', builtBy: 'day103 · Vulhub Docker 多版本 Nginx 镜像', status: 'planned', defaultCredsHint: '无需登录', description: 'Nginx 中间件配置缺陷靶场，覆盖 CVE-2013-4547 文件名逻辑漏洞、Nginx 解析漏洞 (file.php/a.jpg)、CRLF 注入、目录穿越等多场景。', vulnerabilities: ['Nginx 解析漏洞', 'CVE-2013-4547', 'CRLF注入', '目录穿越', '配置错误', 'SSRF'], plannedNotice: 'day103 planned · Vulhub Docker 多镜像' },
  { id: 'websphere', name: 'WebSphere · CVE 经典漏洞靶场', icon: '⚙️', machine: 'kali', baseUrl: 'http://192.168.108.128:9060/ibm/console', color: 'violet', category: 'middleware', categoryLabel: '中间件漏洞', builtBy: 'day104 · Docker 部署 WebSphere Application Server（多CVE）', status: 'planned', defaultCredsHint: '控制台 admin / 参考镜像文档', description: 'IBM WebSphere Application Server 经典 CVE 靶场，覆盖 CVE-2020-4450 / CVE-2021-2109 / CVE-2016-6193 等多个 Java 反序列化/管理控制台 RCE。', vulnerabilities: ['CVE-2020-4450', 'CVE-2021-2109', 'CVE-2016-6193', '控制台弱口令', 'Java反序列化'], plannedNotice: 'day104 planned · CVE 靶场 · Docker 部署' },

  // ==================== status=unavailable（6 个暂不可用）====================
  { id: 'ithema-labs', name: 'IThema-Labs · 合天智汇（Win2008独立VM）', icon: '🏛️', machine: 'standalone-vm', baseUrl: '', color: 'amber', category: 'windows-priv', categoryLabel: 'Windows提权', builtBy: 'day091 · Win2008 独立虚拟机 · 非 Kali 网段', status: 'unavailable', defaultCredsHint: 'Win2008独立登录（启动后查快照文档）', description: '合天智汇 IThema-Labs Windows 靶场，独立 Win2008 VM，含 Windows 各种提权场景（内核漏洞/SID History/SMB Relay 等），需 VMware 独立启动。', vulnerabilities: ['Windows内核提权', 'Bypass UAC', 'SID History滥用', 'SMB Relay', '令牌窃取', '服务路径劫持'], plannedNotice: 'day091 unavailable · Win2008 独立VM · 需单独启动' },
  { id: 'webbug', name: 'WebBug · 综合Web靶场', icon: '🪲', machine: 'standalone-vm', baseUrl: '', color: 'rose', category: 'web-general', categoryLabel: 'Web通用漏洞练习', builtBy: 'day094 · 独立VM部署 · 非 Kali 网段', status: 'unavailable', defaultCredsHint: '参考靶场发布文档', description: 'WebBug 国产综合 Web 漏洞靶场，覆盖 SQLi/XSS/上传/包含/反序列化/逻辑漏洞等多场景，需要独立 VM 运行。', vulnerabilities: ['SQLi注入', 'XSS', '文件上传', '文件包含', '反序列化', '逻辑漏洞', '越权'], plannedNotice: 'day094 unavailable · 独立VM · 非 Kali 网段' },
  { id: 'vulstack', name: 'VulStack · 红队评估内网多VM靶场', icon: '🔺', machine: 'multi-vm-intranet', baseUrl: '', color: 'indigo', category: 'intranet-domain', categoryLabel: '内网域环境', builtBy: 'day095 · 多VM内网编排（域控+Web+DB多台）', status: 'unavailable', defaultCredsHint: '多机独立账号（按靶场手册获取初始WebShell）', description: 'VulStack 系列红队评估靶场，由多 VM 组合的真实内网环境，含域控、Web 入口、MySQL/MSSQL 数据库、横向移动、权限维持等完整 ATT&CK 场景。', vulnerabilities: ['Webshell上传', '内网代理', '哈希传递PtH', '票据传递PtT', '域控提权', '横向SMB/WMI', '权限维持'], plannedNotice: 'day095 unavailable · 多VM内网编排 · 资源占用大' },
  { id: 'webforpentester', name: 'WebForPentester · PentesterLab ISO靶场', icon: '💽', machine: 'vmware-iso', baseUrl: '', color: 'teal', category: 'web-general', categoryLabel: 'Web通用漏洞练习', builtBy: 'day099 · PentesterLab 官方 ISO · 需 VMware 挂载', status: 'unavailable', defaultCredsHint: 'HTTP无鉴权 · ISO启动后发现IP', description: 'PentesterLab Web For Pentester 系列 ISO 靶场，OSCP/OSWE 备考经典资源。分 I/II/III 三个版本，覆盖基础 Web 到高级漏洞利用链条。', vulnerabilities: ['基础SQLi/XSS', '高级SQLi(盲/报错)', 'LDAP注入', 'XPath注入', '代码注入', '命令注入', '文件包含'], plannedNotice: 'day099 unavailable · ISO 镜像需独立 VMware 挂载' },
  { id: 'redsun-domain', name: '红日域环境 · 红日攻防内网靶场', icon: '🌅', machine: 'multi-vm-domain', baseUrl: '', color: 'red', category: 'intranet-domain', categoryLabel: '内网域环境', builtBy: 'day105 · 多VM域环境编排（DC+Exchange+Web+文件服务器）', status: 'unavailable', defaultCredsHint: '多机域账号/本地账号 · 需初始WebShell后枚举', description: '红日安全出品的综合域内网攻防靶场，含 AD 域控、Exchange、OWA、CMS Web、共享服务器等多角色，覆盖域渗透全流程（委派/SPN/约束委派/零登录等）。', vulnerabilities: ['AD域枚举', 'Kerberoast', '委派攻击', 'DCSync', 'PTH/PTT/PTK', 'Exchange漏洞', 'ZeroLogon/NoPac'], plannedNotice: 'day105 unavailable · 多VM域控环境 · 需≥32G内存' },
  { id: 'enterprise-range', name: '企业级靶场搭建 · 多OS多网段综合靶场', icon: '🏢', machine: 'multi-segment', baseUrl: '', color: 'violet', category: 'enterprise', categoryLabel: '企业级综合靶场', builtBy: 'day106 · 规划中 · 整合Linux/Windows/网络/安全设备多网段', status: 'unavailable', defaultCredsHint: '规划中 · 多角色初始账号（DMZ/Web/DB/AD区）', description: '企业级综合靶场（规划阶段），包含 DMZ 区、办公区、管理区、核心区多网段，部署 Linux/Windows/SecurityOnion/WAF/IDS/防火墙 等多角色，模拟真实企业攻防对抗。', vulnerabilities: ['DMZ边界突破', '内网横向', 'WAF/IDS绕过', '流量分析', '钓鱼/社工', '权限维持', '蓝队溯源反制'], plannedNotice: 'day106 unavailable · 规划中 · 多OS多网段 · 高资源宿主机' },
];

const COLOR_MAP: Record<string, string> = {
  cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  indigo: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
  rose: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  amber: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  violet: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
  // 新增颜色支持
  teal: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
  fuchsia: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10',
  lime: 'text-lime-400 border-lime-500/30 bg-lime-500/10',
  slate: 'text-slate-400 border-slate-500/30 bg-slate-500/10',
  sky: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
  orange: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
};

const COLOR_HEX: Record<string, string> = {
  cyan: '#22d3ee',
  indigo: '#818cf8',
  rose: '#fb7185',
  amber: '#fbbf24',
  emerald: '#34d399',
  violet: '#a78bfa',
  teal: '#2dd4bf',
  fuchsia: '#e879f9',
  lime: '#a3e635',
  slate: '#94a3b8',
  sky: '#38bdf8',
  orange: '#fb923c',
};

const MODULE_ICON_LUCIDE: Record<string, React.ReactNode> = {
  recon: React.createElement(Compass, { size: 16 }),
  smb: React.createElement(Network, { size: 16 }),
  exploit: React.createElement(Crosshair, { size: 16 }),
  brute: React.createElement(KeyRound, { size: 16 }),
  postex: React.createElement(Activity, { size: 16 }),
  dvwa: React.createElement(Target, { size: 16 }),
};

// ======== 🔬 学习路径图 LEARNING_PATH：7 阶段，从新手到红队拔高（行业标准成长曲线）========
type LearningStage = {
  stageNo: string;                 // 01~07
  levelTag: string;                // L0新手 / L1基础 / L2进阶 / L3高级 / L4专家 / L5资深 / L6红队
  title: string;                   // 阶段标题
  subtitle: string;                // 副标题（一句话目标）
  emoji: string;                   // 阶段图标 emoji
  accent: string;                  // tailwind 颜色 key，对应 COLOR_MAP
  accentHex: string;               // 对应 COLOR_HEX
  duration: string;                // 预计学习周期（行业平均）
  prereq: string;                  // 前置要求（新手：零基础即可 ...）
  skills: string[];                // 本阶段必须掌握的知识点清单
  rangeIds: string[];              // 本阶段对应的靶场 ID，匹配 WebTarget.id（ready / planned / unavailable 全支持）
  challengeStars: 1 | 2 | 3 | 4 | 5;   // 阶段难度 ★1~★5
};

const LEARNING_PATH: LearningStage[] = [
  // ======= 阶段 01 L0 新手启蒙 =======
  {
    stageNo: '01',
    levelTag: 'L0 · 新手启蒙',
    title: 'Web 安全入门 & 工具基础',
    subtitle: '先搭好工具链、摸清 HTTP 世界，再打靶不迟',
    emoji: '🌱',
    accent: 'cyan',
    accentHex: COLOR_HEX.cyan,
    duration: '3 ~ 7 天 · 每天 2 小时',
    prereq: '零基础即可，了解 HTML/URL 基础加分',
    skills: [
      'HTTP/HTTPS 协议：请求方法 / Header / Cookie / Session',
      'Burp Suite：抓包、Intruder 爆破、Repeater 改包',
      '浏览器 DevTools Network / Console / Application 面板',
      'Nmap：TCP/UDP 端口扫描、服务识别、脚本扫描',
      'Kali 常用命令：curl / wget / netstat / ss / grep',
    ],
    rangeIds: ['dvwa'],              // 第一阶段就用 DVWA Low 档体验
    challengeStars: 1,
  },
  // ======= 阶段 02 L1 专项突破 I：注入 & XSS =======
  {
    stageNo: '02',
    levelTag: 'L1 · 专项突破 I',
    title: 'SQL 注入 & XSS 专项通关',
    subtitle: '两大最高频 Web 漏洞，77 + 4 关逐个攻破',
    emoji: '💉',
    accent: 'indigo',
    accentHex: COLOR_HEX.indigo,
    duration: '7 ~ 14 天 · 至少每关手写一遍 Payload',
    prereq: '完成阶段 01，掌握 Burp Repeater 基本使用',
    skills: [
      'SQLi 基础：数字/字符/搜索型注入，UNION 查询',
      'SQLi 高级：布尔盲注、时间盲注、报错注入、堆叠注入、二次注入',
      'SQLi 进阶：Cookie/Header/User-Agent 注入、宽字节、WAF 绕过（编码、内联注释）',
      'XSS 反射型 / 存储型 / DOM 型三类型',
      'XSS 绕过：标签过滤、事件过滤、CSP、编码绕过、JSFuck',
      'Payload 编写：每个 Payload 手写一次，拒绝只靠工具一键梭',
    ],
    rangeIds: ['sqli-labs', 'xss-challenges'],
    challengeStars: 2,
  },
  // ======= 阶段 03 L2 专项突破 II：OWASP Top10 中阶 =======
  {
    stageNo: '03',
    levelTag: 'L2 · 专项突破 II',
    title: 'OWASP Top 10 全面覆盖',
    subtitle: '上传 / 包含 / SSRF / XXE / CSRF / 越权 / 逻辑漏洞 全扫',
    emoji: '🌳',
    accent: 'rose',
    accentHex: COLOR_HEX.rose,
    duration: '10 ~ 20 天 · 每漏洞类型至少 3 种利用方式',
    prereq: '通关 SQLi-Labs Less-1~30，XSS-Challenges 通关至少 3 关',
    skills: [
      '文件上传 21 关：前端 / MIME / 后缀黑名单 / .htaccess / .user.ini / %00 / 解析漏洞',
      '文件包含 LFI/RFI：php://filter / 日志包含 / Session / Pear 扩展',
      'SSRF：curl/file_get_contents/dict/gopher 协议利用',
      'XXE：有回显 / 无回显 OOB / DTD 实体注入 / PHP 伪协议',
      'CSRF：GET / POST 两种场景、Token 缺失校验的利用',
      '反序列化：PHP 魔术方法 __wakeup / __destruct、POP 链构造',
      '越权 & 逻辑漏洞：水平越权、支付金额篡改、验证码复用',
    ],
    rangeIds: ['upload-labs', 'pikachu', 'bwapp'],
    challengeStars: 3,
  },
  // ======= 阶段 04 L3 框架 & 组件漏洞 =======
  {
    stageNo: '04',
    levelTag: 'L3 · 框架组件漏洞',
    title: '国内外 CMS + Java Web 综合训练',
    subtitle: 'ThinkPHP 国产 CMS RCE + WebGoat 40 章节系统训练',
    emoji: '🧠',
    accent: 'violet',
    accentHex: COLOR_HEX.violet,
    duration: '10 ~ 20 天 · 看源码分析 + 漏洞复现 + 修复分析三步走',
    prereq: '阶段 03 通关，了解 PHP / Java Web 基础',
    skills: [
      'ThinkPHP 5.0.x / 5.1.x 多版本 RCE 链分析：__construct / invokefunction / method',
      'CMS 漏洞通法：定位路由解析、参数提取、敏感函数接收处',
      'Java Web 基础：Servlet / Filter / Spring MVC 接收请求方式',
      'WebGoat：认证绕过 / JWT 四件套 / SQLi(高级) / XXE / SSRF / 反序列化',
      '配套 WebWolf：接收 OOB 外带 DNS/HTTP 请求，验证无回显漏洞',
    ],
    rangeIds: ['thinkphp', 'webgoat'],
    challengeStars: 3,
  },
  // ======= 阶段 05 L4 中间件漏洞体系 =======
  {
    stageNo: '05',
    levelTag: 'L4 · 中间件体系',
    title: '中间件 & 应用服务器 漏洞图谱',
    subtitle: 'Tomcat / Nginx / WebSphere 经典 CVE + 弱口令后台',
    emoji: '🧱',
    accent: 'emerald',
    accentHex: COLOR_HEX.emerald,
    duration: '7 ~ 14 天 · 重点在 Banner 识别 + CVE 号匹配',
    prereq: '完成阶段 04，能独立根据版本号查 CVE 并复现',
    skills: [
      'Tomcat 系列：CVE-2017-12615 PUT、Manager 弱口令、WAR 部署',
      'Nginx 解析漏洞：file.php/a.jpg、CVE-2013-4547 文件名逻辑、CRLF 注入、目录穿越',
      'WebSphere 控制台：默认密码、CVE-2020-4450 / CVE-2021-2109 RCE',
      '中间件识别技巧：HTTP Server 头 / 默认错误页 / favicon.ico hash',
      'Manager / Console 后台爆破字典 + 部署流程（WAR包提权）',
    ],
    rangeIds: ['tomcat', 'nginx', 'websphere'],
    challengeStars: 4,
  },
  // ======= 阶段 06 L5 Java 反序列化专项（高薪面试必考）=======
  {
    stageNo: '06',
    levelTag: 'L5 · Java 反序列化专家',
    title: 'Java 反序列化 RCE 全链条打通',
    subtitle: 'Struts2 / Fastjson / Shiro / Log4j2 四大金刚 + ysoserial',
    emoji: '☕',
    accent: 'orange',
    accentHex: COLOR_HEX.orange,
    duration: '14 ~ 30 天 · 必须读 ysoserial 源码 + 动手写 Exploit',
    prereq: 'Java 基础语法，能读 Spring / Java Web 项目源码；完成阶段 04~05',
    skills: [
      'Struts2：OGNL 表达式 S2-045 / S2-016 / S2-007 DevMode RCE 原理',
      'Fastjson：JdbcRowSetImpl JNDI、TemplatesImpl、BCEL ClassLoader、1.2.47 AutoType Bypass',
      'Shiro：Shiro-550 默认 AES Key、CommonsBeanutils / CommonsCollections 利用链',
      'Log4Shell：${jndi:ldap://} 经典 Payload、高版本 trustURLCodebase 绕过、${::-j} 绕 WAF',
      'ysoserial 使用 + 源码：CC1/CC6/CC7/CCK1/CB1 链 Gadget 分析',
      'JNDI 注入利用：LDAP/RMI/JRMP 三种协议，d4m/ marshalsec 工具配合',
    ],
    rangeIds: ['struts2', 'fastjson', 'shiro', 'log4j2'],
    challengeStars: 5,
  },
  // ======= 阶段 07 L6 企业级综合 + 内网域 =======
  {
    stageNo: '07',
    levelTag: 'L6 · 红队 / 企业级',
    title: '企业综合攻防 & AD 内网域渗透',
    subtitle: '从单个漏洞到 200+CVE 武器库 + 域环境 ATT&CK 全流程',
    emoji: '🏢',
    accent: 'fuchsia',
    accentHex: COLOR_HEX.fuchsia,
    duration: '1 ~ 3 个月 · 长期实战，每周末一次完整靶场',
    prereq: '通关 11 个在线靶场，完整阶段 01~06；了解 Windows / Linux 基础',
    skills: [
      'Vulhub 200+ CVE：Fastjson / Shiro / Log4j / Nginx / Think / Spring 系列全过一遍',
      'Cobalt Strike / MSF 基础：Web Delivery / Bind / Reverse Shell',
      '内网代理：frp / nps / EarthWorm / reGeorg 正向反向隧道',
      '横向移动：哈希传递 PtH、票据传递 PtT、WMI / SMBExec / PsExec / WinRM',
      'AD 域渗透：SPN / Kerberoast / AS-REP Roast / 委派攻击 / DCSync / NoPac / ZeroLogon',
      '权限维持：启动项 / 服务 / WMI / SSP / 计划任务 / 黄金白银票据',
      '蓝队视角：流量 IDS 特征、WAF 绕过、反溯源',
    ],
    rangeIds: [
      'vulhub-platform',
      'ithema-labs', 'webbug', 'vulstack',
      'webforpentester', 'redsun-domain', 'enterprise-range',
    ],
    challengeStars: 5,
  },
];
// ======== LEARNING_PATH 定义结束 ========

// ===== 小工具：复制到剪贴板 =====
async function copyText(txt: string) {
  try {
    await navigator.clipboard.writeText(txt);
    return true;
  } catch (_) {
    return false;
  }
}

// ===== 主页面 =====
export const VmLabs: React.FC = () => {
  const [machines, setMachines] = useState<MachineStatus[]>([]);
  const [dvwaTargets, setDvwaTargets] = useState<DvwaTarget[]>([]);
  // 新：通用 Web 靶场状态
  const [webTargets, setWebTargets] = useState<WebTarget[]>([]);
  const [readyTargets, setReadyTargets] = useState<WebTarget[]>([]);
  const [plannedTargets, setPlannedTargets] = useState<WebTarget[]>([]);
  const [webCategories, setWebCategories] = useState<WebCategory[]>([]);
  const [webStats, setWebStats] = useState<WebStats | null>(null);
  const [webByCategory, setWebByCategory] = useState<Record<string, WebTarget[]>>({});

  const [targetIp, setTargetIp] = useState<string>('');
  const [attackerIp, setAttackerIp] = useState<string>('');
  const [modules, setModules] = useState<AttackModule[]>([]);
  const [quickTools, setQuickTools] = useState<QuickTool[]>([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingDvwa, setLoadingDvwa] = useState(false);
  const [loadingWeb, setLoadingWeb] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string>('recon');
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({ recon: true });
  const [runningExecId, setRunningExecId] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<ExecOutput[]>([]);
  const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null);
  const [customCmd, setCustomCmd] = useState<string>('nmap -Pn -n -sV -T4 ');
  const [customTimeout, setCustomTimeout] = useState<number>(60);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [tab, setTab] = useState<'wizard' | 'terminal' | 'history'>('wizard');
  // 后端连接状态：true=成功获取到后端响应，false=使用前端 fallback 数据
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  const outputRef = useRef<HTMLPreElement>(null);

  // 初始化：拉基本信息 + 模块 + 状态（容错模式：单个 fetch 失败不阻塞其它，
  // 全部失败时使用前端 fallback 数据，保证页面不会变成空白）
  useEffect(() => {
    (async () => {
      // 每个 fetch 独立 catch，返回一个占位空对象，避免 Promise.all 一败全败
      const safeJson = <T extends object>(url: string, fallback: T): Promise<T> =>
        fetch(url)
          .then(async (r) => {
            if (!r.ok) return fallback;
            try { return (await r.json()) as T; } catch { return fallback; }
          })
          .catch(() => fallback);

      const [infoRes, modRes, quickRes, statusRes, historyRes, dvwaInfoRes, webInfoRes] = await Promise.all([
        safeJson<{ machines?: MachineStatus[]; target?: { host: string }; attacker?: { host: string } }>('/api/vm-labs/info', {}),
        safeJson<{ modules?: AttackModule[]; targetIp?: string; attackerIp?: string }>('/api/vm-labs/attack-modules', {}),
        safeJson<{ tools?: QuickTool[] }>('/api/vm-labs/quick-tools', {}),
        safeJson<{
          machines?: MachineStatus[]; targetIp?: string; attackerIp?: string;
          dvwaTargets?: DvwaTarget[]; webTargets?: WebTarget[]; readyTargets?: WebTarget[];
          plannedTargets?: WebTarget[]; webCategories?: WebCategory[];
          webByCategory?: Record<string, WebTarget[]>; webStats?: WebStats;
        }>('/api/vm-labs/status', {}),
        safeJson<{ history?: HistoryItem[] }>('/api/vm-labs/history?limit=50', {}),
        safeJson<{ targets?: DvwaTarget[] }>('/api/vm-labs/dvwa/info', {}),
        safeJson<{ targets?: WebTarget[]; categories?: WebCategory[]; counts?: { total: number; ready: number; planned: number } }>('/api/vm-labs/web-targets/info', {}),
      ]);

      // === 判断后端是否真实在线 ===
      // 只要 /info 或 /status 其中一个返回了 machines，就认为是通的
      const haveRealMachines = (statusRes.machines && statusRes.machines.length > 0) ||
                               (infoRes.machines && infoRes.machines.length > 0);
      const haveRealTargets = (webInfoRes.targets && webInfoRes.targets.length > 0) ||
                              (statusRes.webTargets && statusRes.webTargets.length > 0);
      const connected = haveRealMachines || haveRealTargets ||
                        (typeof modRes.modules !== 'undefined' && modRes.modules.length > 0);
      setBackendConnected(connected);

      // === machines：先用后端返回的，否则兜底 FALLBACK_MACHINES ===
      const rawMachines = statusRes.machines?.length ? statusRes.machines : infoRes.machines;
      const finalMachines = rawMachines?.length ? rawMachines : FALLBACK_MACHINES.map((m) => ({ ...m }));
      setMachines(finalMachines);

      // === DVWA：先用 status 里的（带实时状态），否则用 dvwa/info ===
      const finalDvwa = statusRes.dvwaTargets?.length ? statusRes.dvwaTargets : dvwaInfoRes.targets;
      setDvwaTargets(finalDvwa || []);

      // === 通用 Web 靶场：优先后端返回，否则兜底前端内嵌 FALLBACK_WEB_TARGETS ===
      let allWeb: WebTarget[] = statusRes.webTargets?.length ? statusRes.webTargets : (webInfoRes.targets || []);
      if (!allWeb.length) allWeb = FALLBACK_WEB_TARGETS.map((t) => ({ ...t }));
      setWebTargets(allWeb);

      let ready: WebTarget[] = statusRes.readyTargets?.length ? statusRes.readyTargets : allWeb.filter((t) => t.status === 'ready');
      let planned: WebTarget[] = statusRes.plannedTargets?.length ? statusRes.plannedTargets : allWeb.filter((t) => t.status !== 'ready');
      setReadyTargets(ready);
      setPlannedTargets(planned);

      const cats: WebCategory[] = statusRes.webCategories?.length ? statusRes.webCategories :
        (webInfoRes.categories?.length ? webInfoRes.categories : FALLBACK_CATEGORIES);
      setWebCategories(cats);

      // 按 category 分组（兜底也自己计算）
      let byCat = statusRes.webByCategory;
      if (!byCat || Object.keys(byCat).length === 0) {
        byCat = {};
        cats.forEach((c) => { byCat![c.key] = allWeb.filter((t) => t.category === c.key); });
      }
      setWebByCategory(byCat);

      // webStats：后端给了就用，否则按 fallback 数据计算
      let stats: WebStats | null = statusRes.webStats || null;
      if (!stats) {
        const countsFromInfo = webInfoRes.counts;
        if (countsFromInfo) {
          stats = {
            totalCount: countsFromInfo.total || allWeb.length,
            readyCount: countsFromInfo.ready || ready.length,
            plannedCount: countsFromInfo.planned || planned.length,
            onlineCount: 0,
          };
        } else {
          stats = {
            totalCount: allWeb.length,
            readyCount: ready.length,
            plannedCount: planned.length,
            onlineCount: connected ? ready.filter((t) => t.online).length : 0,
          };
        }
      }
      setWebStats(stats);

      // === IP / 模块 / 工具 / 历史 ===
      const tIp = statusRes.targetIp || modRes.targetIp || infoRes.target?.host ||
                  FALLBACK_MACHINES.find((m) => m.role === 'target')?.host || '';
      const aIp = statusRes.attackerIp || modRes.attackerIp || infoRes.attacker?.host ||
                  FALLBACK_MACHINES.find((m) => m.role === 'attacker')?.host || '';
      setTargetIp(tIp);
      setAttackerIp(aIp);
      setModules(modRes.modules || []);
      setQuickTools(quickRes.tools || []);
      setHistory(historyRes.history || []);
      setCustomCmd((c) => {
        if (c.endsWith(' ') && tIp) return `${c}${tIp}`;
        if (!c.trim()) return `nmap -Pn -n -sV -T4 ${tIp}`;
        return c;
      });
      // 默认展开 dvwa 向导
      setOpenSteps((o) => ({ ...o, dvwa: true }));
    })();
  }, []);

  // 自动滚到终端输出底部
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputs, selectedOutputId]);

  // 自动补全靶机 IP 到 customCmd
  useEffect(() => {
    if (!targetIp) return;
    setCustomCmd((c) => {
      if (!c.trim()) return `nmap -Pn -n -sV -T4 ${targetIp}`;
      return c;
    });
  }, [targetIp]);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  }

  async function refreshStatus() {
    setLoadingStatus(true);
    try {
      const res = await fetch('/api/vm-labs/status');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const gotMachines = (data.machines?.length ?? 0) > 0;
      setBackendConnected((prev) => prev || gotMachines || (data.webTargets?.length ?? 0) > 0);
      setMachines(gotMachines ? data.machines : FALLBACK_MACHINES.map((m) => ({ ...m })));
      if (data.dvwaTargets?.length) setDvwaTargets(data.dvwaTargets);
      // 新：Web 靶场数据（无则兜底）
      if (data.webTargets?.length) setWebTargets(data.webTargets);
      if (data.readyTargets?.length) setReadyTargets(data.readyTargets);
      else setReadyTargets(webTargets.length ? webTargets.filter((t) => t.status === 'ready') : FALLBACK_WEB_TARGETS.filter((t) => t.status === 'ready'));
      if (data.plannedTargets?.length) setPlannedTargets(data.plannedTargets);
      else setPlannedTargets(webTargets.length ? webTargets.filter((t) => t.status !== 'ready') : FALLBACK_WEB_TARGETS.filter((t) => t.status !== 'ready'));
      if (data.webCategories?.length) setWebCategories(data.webCategories);
      else setWebCategories(FALLBACK_CATEGORIES);
      if (data.webByCategory && Object.keys(data.webByCategory).length) setWebByCategory(data.webByCategory);
      if (data.webStats) setWebStats(data.webStats);
      if (!gotMachines && !backendConnected) {
        showToast('后端未连接：显示的是本地静态靶场列表，无法使用 SSH 执行命令');
      } else {
        showToast('靶场状态已刷新');
      }
    } catch (e: any) {
      setBackendConnected(false);
      setMachines(FALLBACK_MACHINES.map((m) => ({ ...m })));
      if (!webTargets.length) {
        setWebTargets(FALLBACK_WEB_TARGETS.map((t) => ({ ...t })));
        setReadyTargets(FALLBACK_WEB_TARGETS.filter((t) => t.status === 'ready'));
        setPlannedTargets(FALLBACK_WEB_TARGETS.filter((t) => t.status !== 'ready'));
        setWebCategories(FALLBACK_CATEGORIES);
      }
      showToast('后端未连接：请先启动 backend/server.js（端口 3002）后再刷新');
    } finally {
      setLoadingStatus(false);
    }
  }

  async function refreshDvwa() {
    setLoadingDvwa(true);
    try {
      if (!backendConnected) throw new Error('后端未连接');
      const res = await fetch('/api/vm-labs/dvwa/status');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.dvwaTargets?.length) setDvwaTargets(data.dvwaTargets);
      showToast('DVWA 靶场状态已刷新');
    } catch (_e) {
      showToast('后端未连接：无法对 DVWA 做实时健康检查');
    } finally {
      setLoadingDvwa(false);
    }
  }

  // 新：刷新所有 Web 靶场健康状态
  async function refreshWebTargets() {
    setLoadingWeb(true);
    try {
      if (!backendConnected) throw new Error('后端未连接');
      const res = await fetch('/api/vm-labs/web-targets/status');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.targets?.length) setWebTargets(data.targets);
      if (data.readyTargets) setReadyTargets(data.readyTargets);
      if (data.plannedTargets) setPlannedTargets(data.plannedTargets);
      if (data.categories?.length) setWebCategories(data.categories);
      if (data.byCategory) setWebByCategory(data.byCategory);
      if (data.totalCount != null) {
        setWebStats({
          totalCount: data.totalCount,
          readyCount: data.readyCount,
          plannedCount: data.plannedCount,
          onlineCount: data.onlineCount,
        });
      }
      showToast(`已刷新 Web 靶场状态（在线 ${data.onlineCount ?? '?'}/${data.readyCount ?? '?'})`);
    } catch (_e) {
      showToast('后端未连接：无法从 Kali 发起真实 HTTP 健康检查');
    } finally {
      setLoadingWeb(false);
    }
  }

  async function reconnectKali() {
    if (!backendConnected) {
      showToast('请先启动 backend/server.js 并配置 Kali SSH，再点击「重连 Kali」');
      return;
    }
    try {
      const res = await fetch('/api/vm-labs/reconnect', { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.status?.online) showToast('Kali 已重连 ✅');
      else showToast(`Kali 重连失败：${data.status?.error || '请检查 SSH 服务是否启用（22 端口）'}`);
      refreshStatus();
    } catch (e: any) {
      showToast(`重连失败：${e?.message || '后端未启动'}`);
    }
  }

  // 核心：运行命令（通用）
  async function runCommand(payload: {
    command: string;
    timeout?: number;
    label: string;
    moduleId?: string;
    stepId?: string;
    iAcceptRisk?: boolean;
  }) {
    if (runningExecId) {
      showToast('已有命令在运行，请等待执行完成');
      return;
    }
    if (!backendConnected) {
      const startedAt = new Date().toISOString();
      const execId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const placeholder: ExecOutput = {
        execId,
        label: payload.label,
        command: payload.command,
        stdout: '',
        stderr: '',
        exitCode: 2,
        startedAt,
        moduleId: payload.moduleId,
        stepId: payload.stepId,
      };
      setOutputs((arr) => [placeholder, ...arr]);
      setSelectedOutputId(execId);
      setTab('terminal');
      showToast('后端未连接：无法在 Kali 执行命令，请先启动 backend/server.js');
      return;
    }
    const startedAt = new Date().toISOString();
    const execId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    // 先在 outputs 里放一条占位
    const placeholder: ExecOutput = {
      execId,
      label: payload.label,
      command: payload.command,
      stdout: `[*] 命令已提交，正在 Kali 上执行...\n[*] 开始时间: ${startedAt}\n[*] $ ${payload.command}\n\n`,
      stderr: '',
      exitCode: -999,
      startedAt,
      moduleId: payload.moduleId,
      stepId: payload.stepId,
    };
    setOutputs((arr) => [placeholder, ...arr]);
    setSelectedOutputId(execId);
    setRunningExecId(execId);
    setTab('terminal');

    try {
      // 使用向导 step 接口或通用 exec 接口
      let resp: Response;
      let body: any;
      if (payload.moduleId && payload.stepId && !payload.iAcceptRisk) {
        resp = await fetch(`/api/vm-labs/attack/${payload.moduleId}/${payload.stepId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ iAcceptRisk: payload.iAcceptRisk }),
        });
      } else if (payload.moduleId && payload.stepId && payload.iAcceptRisk) {
        resp = await fetch(`/api/vm-labs/attack/${payload.moduleId}/${payload.stepId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ iAcceptRisk: true }),
        });
      } else {
        resp = await fetch('/api/vm-labs/exec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: payload.command,
            timeout: (payload.timeout || 60) * 1000,
            label: payload.label,
            moduleId: payload.moduleId,
            stepId: payload.stepId,
          }),
        });
      }
      body = await resp.json();
      if (!resp.ok && body.dangerous) {
        // 危险步骤，弹窗确认
        const ok = window.confirm(
          `⚠️ 此步骤 [${body.stepName}] 被标记为危险：可能导致靶机蓝屏或不稳定。\n\n你确认要继续执行吗？\n\n建议：先给 Win7 做个快照再跑。`
        );
        if (!ok) {
          setOutputs((arr) =>
            arr.map((o) =>
              o.execId === execId
                ? { ...o, stdout: o.stdout + `[!] 用户取消了危险步骤：${body.stepName}\n`, exitCode: 130 }
                : o
            )
          );
          setRunningExecId(null);
          return;
        }
        // 再次请求带 iAcceptRisk
        const resp2 = await fetch(`/api/vm-labs/attack/${payload.moduleId}/${payload.stepId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ iAcceptRisk: true }),
        });
        body = await resp2.json();
        if (!resp2.ok) throw new Error(body.error || '执行失败');
      } else if (!resp.ok) {
        throw new Error(body.error || `HTTP ${resp.status}`);
      }

      const out: ExecOutput = {
        execId: body.execId || execId,
        label: payload.label,
        command: body.command || payload.command,
        stdout: (placeholder.stdout || '') + (body.stdout || ''),
        stderr: body.stderr || '',
        exitCode: typeof body.exitCode === 'number' ? body.exitCode : -1,
        startedAt: body.startedAt || startedAt,
        moduleId: payload.moduleId,
        stepId: payload.stepId,
        stepName: body.stepName,
      };
      setOutputs((arr) => {
        const idx = arr.findIndex((o) => o.execId === execId);
        if (idx === -1) return [out, ...arr];
        const copy = [...arr];
        copy[idx] = out;
        return copy;
      });
      // 更新历史
      const hist = await fetch('/api/vm-labs/history?limit=50').then((r) => r.json());
      setHistory(hist.history || []);
    } catch (e: any) {
      setOutputs((arr) =>
        arr.map((o) =>
          o.execId === execId
            ? {
                ...o,
                stdout: o.stdout + `\n[✗] 执行出错：${e?.message || '未知错误'}\n`,
                exitCode: 1,
              }
            : o
        )
      );
      showToast(`执行出错：${e?.message || ''}`);
    } finally {
      setRunningExecId(null);
    }
  }

  function toggleStepGroup(modId: string) {
    setOpenSteps((o) => ({ ...o, [modId]: !o[modId] }));
  }

  const activeMod = modules.find((m) => m.id === activeModuleId);
  const selectedOutput = outputs.find((o) => o.execId === selectedOutputId) || outputs[0] || null;
  const kali = machines.find((m) => m.id === 'kali');
  const win7 = machines.find((m) => m.id === 'win7');

  return (
    <div className="space-y-6 pb-12">
      {/* ========== 后端连接状态（全局醒目告警）========== */}
      {!backendConnected && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-red-500/50 bg-gradient-to-br from-red-500/10 via-red-500/5 to-red-500/10 p-5"
        >
          <div className="flex flex-wrap items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/40 flex items-center justify-center">
              <AlertTriangle size={28} className="text-red-400" />
            </div>
            <div className="flex-1 min-w-[300px]">
              <h3 className="text-lg font-bold text-red-300 font-orbitron flex items-center gap-2">
                ⚠️ 后端服务未连接 · SSH / 命令执行功能暂不可用
              </h3>
              <p className="mt-2 text-sm text-red-200/80 leading-relaxed">
                当前页面显示的是前端<strong className="text-red-200">本地缓存的靶场静态数据</strong>。
                要使用 <strong>命令执行（SSH 连 Kali）</strong>、<strong>靶场实时探活</strong>、<strong>攻击向导一键跑模块</strong> 等功能，
                请先启动后端服务并确认 Kali SSH 可连通。
              </p>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-red-100/90 font-mono">
                <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
                  <span className="text-red-300">① 启动后端</span>：<br />
                  <code className="text-red-200">cd backend && node server.js</code>
                </div>
                <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
                  <span className="text-red-300">② 确认端口</span>：<br />
                  <code className="text-red-200">curl http://localhost:3002/api/health</code>
                </div>
                <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
                  <span className="text-red-300">③ Kali 启 SSH</span>：<br />
                  <code className="text-red-200">sudo systemctl start ssh &amp;&amp; sudo ufw allow 22</code>
                </div>
                <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
                  <span className="text-red-300">④ .env 配置</span>：<br />
                  <code className="text-red-200">KALI_HOST=192.168.108.128 KALI_USER=kail KALI_PASS=kail</code>
                </div>
              </div>
            </div>
            <div className="shrink-0 flex flex-col gap-2">
              <button
                onClick={refreshStatus}
                disabled={loadingStatus}
                className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={16} className={loadingStatus ? 'animate-spin' : ''} />
                后端启动后点我重连
              </button>
              <a
                href="#/lab/vm-labs"
                className="px-4 py-2 rounded-lg border border-red-500/30 text-red-300/80 text-xs text-center hover:text-red-200"
                onClick={(e) => { e.preventDefault(); window.location.reload(); }}
              >
                ⟳ 手动刷新页面
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* 顶部横幅 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 border border-cyber-green/20 bg-gradient-to-br from-cyber-green/10 via-cyber-black to-cyber-purple/10"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-cyber-green font-orbitron flex items-center gap-2">
                <Server size={24} /> 真实靶场中心 · VM Labs
              </h1>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-mono border ${
                  backendConnected
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-500/10 border-amber-500/40 text-amber-300 animate-pulse'
                }`}
              >
                {backendConnected ? '● 后端已连接 · SSH 可用' : '○ 后端未连接 · 仅展示靶场清单'}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-400 max-w-3xl leading-relaxed">
              连接你的 <span className="text-cyan-400">Kali 攻击机</span>、
              <span className="text-amber-400"> Win7 靶机</span>，以及部署在两台 VM 上的
              <span className="text-violet-400"> Web 漏洞靶场矩阵 </span>
              （{webStats ? `${webStats.readyCount} 已就绪 / ${webStats.totalCount} 规划` : `${FALLBACK_WEB_TARGETS.filter(t=>t.status==='ready').length} 已就绪 / ${FALLBACK_WEB_TARGETS.length} 规划`}）。
              在真实环境中演练信息收集、漏洞扫描、漏洞利用、密码爆破、后渗透等全流程渗透测试。
              {backendConnected ? '所有命令真实在 Kali 上执行，结果自动归档到学习记录。' : <span className="text-amber-300">⚠️ 启动后端（backend/server.js）后即可启用 SSH 命令执行。</span>}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {attackerIp && (
                <span className={`px-2 py-1 rounded border font-mono ${kali?.online ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300' : 'bg-cyan-500/5 border-cyan-500/30 text-cyan-400/80'}`}>
                  🐉 攻击机 {attackerIp}:22 (SSH)
                  {backendConnected && (kali?.online ? ' ✅ 在线' : ' ❌ 未连通')}
                  {!backendConnected && ' · 静态信息'}
                </span>
              )}
              {targetIp && (
                <span className={`px-2 py-1 rounded border font-mono ${win7?.online ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-amber-500/5 border-amber-500/30 text-amber-400/80'}`}>
                  🪟 靶机 {targetIp} (SMB/RDP/HTTP)
                  {backendConnected && (win7?.online ? ' ✅ 在线' : ' ⚠️ 未探测')}
                  {!backendConnected && ' · 静态信息'}
                </span>
              )}
              {webStats && (
                <span className="px-2 py-1 rounded bg-violet-500/10 border border-violet-500/30 text-violet-300 font-mono">
                  🎯 Web靶场 {backendConnected ? `${webStats.onlineCount ?? 0}/${webStats.readyCount} 在线` : `${webStats.readyCount} 已就绪`} · {webStats.plannedCount} 搭建中
                </span>
              )}
              {/* 已就绪靶场快速链接（全部 ready 靶场，不再限制 6 个） */}
              {readyTargets.filter(t => t.status === 'ready' && t.baseUrl && !t.baseUrl.includes('待启动')).map((d) => (
                <a
                  key={d.id}
                  href={d.baseUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-2 py-1 rounded border font-mono hover:underline inline-flex items-center gap-1 text-[11px] ${
                    COLOR_MAP[d.color || 'violet'] || 'bg-violet-500/10 border-violet-500/30 text-violet-300'
                  }`}
                  title={`${d.name} - ${d.description || ''}`}
                >
                  <Globe2 size={11} /> {d.icon} {d.name.replace(/·.*/, '').trim()}
                  <ExternalLink size={10} />
                </a>
              ))}
              <span className="px-2 py-1 rounded bg-cyber-green/10 border border-cyber-green/30 text-cyber-green font-mono">
                🔐 仅限授权靶场使用
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={refreshWebTargets}
              disabled={loadingWeb}
              title={backendConnected ? '从 Kali 发起真实 HTTP 探活' : '后端未连接：仅本地静态列表'}
              className="px-4 py-2 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 text-sm transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              <RefreshCw size={16} className={loadingWeb ? 'animate-spin' : ''} /> 刷新 Web 靶场
            </button>
            <button
              onClick={reconnectKali}
              title={backendConnected ? 'SSH 重连 Kali' : '先启动 backend/server.js 并配置 Kali SSH'}
              className={`px-4 py-2 rounded-lg border text-sm transition-colors flex items-center gap-2 ${
                backendConnected
                  ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20'
                  : 'border-gray-500/40 bg-gray-500/10 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Zap size={16} /> 重连 Kali
            </button>
            <button
              onClick={refreshStatus}
              disabled={loadingStatus}
              className="px-4 py-2 rounded-lg border border-cyber-green/30 bg-cyber-green/10 text-cyber-green hover:bg-cyber-green/20 text-sm transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              <RefreshCw size={16} className={loadingStatus ? 'animate-spin' : ''} /> 刷新全部状态
            </button>
          </div>
        </div>
      </motion.div>

      {/* 虚拟机状态卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[kali, win7].map((m) =>
          m ? (
            <MachineCard
              key={m.id}
              m={{
                ...m,
                // 未连接后端时，强制显示 error/info 提示
                online: backendConnected ? !!m.online : false,
                info: !backendConnected
                  ? (m.id === 'kali' ? '静态展示：需要启动后端并配置 SSH 才能执行命令 / 连接 Kali' : '静态展示：需要启动后端才能对 Win7 做 Ping/Nmap 探测')
                  : m.info,
              }}
              loading={loadingStatus}
              backendConnected={backendConnected}
            />
          ) : null
        )}
      </div>

      {/* ========== Web 漏洞靶场矩阵（按分类展示已就绪的靶场）========== */}
      <div id="web-matrix-anchor" className="scroll-mt-4" />
      {readyTargets.length > 0 && (
        <div className="space-y-5">
          {webCategories.map((cat) => {
            const list = (webByCategory[cat.key] || readyTargets.filter(t => t.category === cat.key))
              .filter(t => t.status === 'ready');
            if (list.length === 0) return null;
            const paletteBorder =
              cat.color === 'amber' ? 'border-amber-500/20'
              : cat.color === 'violet' ? 'border-violet-500/20'
              : cat.color === 'rose' ? 'border-rose-500/20'
              : 'border-indigo-500/20';
            const paletteGrad =
              cat.color === 'amber' ? 'from-amber-500/10'
              : cat.color === 'violet' ? 'from-violet-500/10'
              : cat.color === 'rose' ? 'from-rose-500/10'
              : 'from-indigo-500/10';
            const paletteTitle =
              cat.color === 'amber' ? 'text-amber-400'
              : cat.color === 'violet' ? 'text-violet-400'
              : cat.color === 'rose' ? 'text-rose-400'
              : 'text-indigo-400';
            const paletteBtn =
              cat.color === 'amber' ? 'border-amber-500/20 hover:bg-amber-500/10 text-amber-300'
              : cat.color === 'violet' ? 'border-violet-500/20 hover:bg-violet-500/10 text-violet-300'
              : cat.color === 'rose' ? 'border-rose-500/20 hover:bg-rose-500/10 text-rose-300'
              : 'border-indigo-500/20 hover:bg-indigo-500/10 text-indigo-300';
            return (
              <div key={cat.key} className={`rounded-xl border ${paletteBorder} bg-gradient-to-br ${paletteGrad} via-transparent to-transparent p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <span className={`${paletteTitle} text-base leading-none`}>{cat.icon}</span>
                    <span className={paletteTitle}>{cat.label}</span>
                    <span className="text-gray-500 text-xs ml-1">({list.length})</span>
                  </h2>
                  <button
                    onClick={refreshWebTargets}
                    disabled={loadingWeb}
                    className={`text-xs inline-flex items-center gap-1 px-2 py-1 rounded border ${paletteBtn} disabled:opacity-60`}
                  >
                    <RefreshCw size={12} className={loadingWeb ? 'animate-spin' : ''} /> 刷新
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {list.map((t) => (
                    <div key={t.id} id={`target-${t.id}`} data-target-id={t.id} className="scroll-mt-4">
                      <WebTargetCard t={t} loading={loadingWeb} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========== 待搭建靶场预告区（planned / building） ========== */}
      {plannedTargets.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-500/10 via-transparent to-transparent p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <Clock size={16} className="text-slate-400" />
              <span className="text-slate-300">靶场预告 · 即将上线</span>
              <span className="text-gray-500 text-xs ml-1">({plannedTargets.length})</span>
            </h2>
            <span className="text-xs text-slate-400 bg-slate-500/10 border border-slate-500/20 px-2 py-1 rounded">
              搭建进度 {webStats ? `${webStats.readyCount}/${webStats.totalCount}` : '...'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {plannedTargets.map((t) => (
              <div key={t.id} id={`target-${t.id}`} data-target-id={t.id} className="scroll-mt-4">
                <PlannedTargetCard t={t} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 快捷工具条 */}
      {quickTools.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <h2 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
            <Zap size={16} className="text-cyber-green" /> 一键工具
          </h2>
          <div className="flex flex-wrap gap-2">
            {quickTools.map((t) => (
              <motion.button
                key={t.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  runCommand({
                    command: t.cmd,
                    timeout: (t.timeout || 60000) / 1000,
                    label: `[快捷] ${t.name}`,
                  })
                }
                disabled={!!runningExecId}
                className="px-3 py-2 text-xs rounded-lg border border-white/10 bg-[#0f172a] hover:border-cyber-green/30 hover:bg-cyber-green/5 text-gray-300 hover:text-cyber-green transition-all disabled:opacity-50 flex items-center gap-1.5"
                title={t.cmd}
              >
                <span>{t.icon}</span>
                <span className="font-medium">{t.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 切换：向导 / 终端 / 历史 */}
      <div className="flex gap-1 border-b border-white/10">
        {(
          [
            ['wizard', '🧙 攻击向导', '信息收集 → SMB → 利用 → 爆破 → 后渗透'],
            ['terminal', '💻 命令终端', '自定义命令，直接在 Kali 上执行'],
            ['history', '📜 执行历史', '最近执行的命令与结果'],
          ] as const
        ).map(([k, label, desc]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-3 text-sm transition-colors text-left ${
              tab === k
                ? 'text-cyber-green border-b-2 border-cyber-green bg-cyber-green/5'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className="font-semibold">{label}</div>
            <div className="text-xs text-gray-500 font-normal">{desc}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* 左侧：向导/自定义命令 */}
        <div className="xl:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {tab === 'wizard' && (
              <motion.div
                key="wizard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {/* 模块列表 */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                  {modules.map((mod) => {
                    const open = !!openSteps[mod.id];
                    const isActive = activeModuleId === mod.id;
                    const color = COLOR_MAP[mod.color] || 'text-gray-400 border-white/10 bg-white/5';
                    const hex = COLOR_HEX[mod.color] || '#22d3ee';
                    return (
                      <div key={mod.id} className="border-b border-white/5 last:border-b-0">
                        <button
                          onClick={() => {
                            setActiveModuleId(mod.id);
                            toggleStepGroup(mod.id);
                          }}
                          className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                            isActive ? 'bg-black/20' : 'hover:bg-white/5'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center text-base ${color}`}
                          >
                            {MODULE_ICON_LUCIDE[mod.id] || <Bug size={14} />}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-sm" style={{ color: hex }}>
                              <span className="mr-2">{mod.icon}</span>
                              {mod.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {mod.steps.length} 个步骤
                            </div>
                          </div>
                          {open ? (
                            <ChevronDown size={16} className="text-gray-400" />
                          ) : (
                            <ChevronRight size={16} className="text-gray-400" />
                          )}
                        </button>

                        <AnimatePresence>
                          {open && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 space-y-2 border-t border-white/5 pt-3">
                                {mod.steps.map((s) => (
                                  <AttackStepCard
                                    key={s.id}
                                    step={s}
                                    moduleColor={hex}
                                    running={runningExecId != null}
                                    onRun={(acceptRisk) =>
                                      runCommand({
                                        command: s.command,
                                        timeout: (s.timeout || 60000) / 1000,
                                        label: `${mod.name} · ${s.name}`,
                                        moduleId: mod.id,
                                        stepId: s.id,
                                        iAcceptRisk: acceptRisk,
                                      })
                                    }
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {tab === 'terminal' && (
              <motion.div
                key="terminal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="rounded-xl border border-white/10 bg-[#0a0a0f] p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <Terminal size={16} className="text-cyber-green" /> Kali 自定义终端
                  </h3>
                  <div>
                    <label className="text-xs text-gray-500">命令 (bash)</label>
                    <textarea
                      value={customCmd}
                      onChange={(e) => setCustomCmd(e.target.value)}
                      rows={5}
                      className="mt-1 w-full bg-black/50 border border-white/10 rounded-lg p-3 font-mono text-xs text-cyber-green focus:outline-none focus:border-cyber-green/50"
                      placeholder="如：nmap -Pn -n -sV -T4 192.168.108.129"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <label className="text-xs text-gray-500">超时 (秒)</label>
                      <input
                        type="number"
                        min={3}
                        max={600}
                        value={customTimeout}
                        onChange={(e) =>
                          setCustomTimeout(Math.min(600, Math.max(3, Number(e.target.value) || 60)))
                        }
                        className="ml-2 w-20 bg-black/50 border border-white/10 rounded px-2 py-1 text-sm text-gray-200 focus:outline-none focus:border-cyber-green/50"
                      />
                    </div>
                    <div className="flex-1" />
                    <button
                      onClick={() => copyText(customCmd).then((ok) => showToast(ok ? '已复制' : '复制失败'))}
                      className="px-3 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-white/30 text-xs flex items-center gap-1.5"
                    >
                      <Copy size={14} /> 复制命令
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      disabled={!customCmd.trim() || !!runningExecId}
                      onClick={() =>
                        runCommand({
                          command: customCmd,
                          timeout: customTimeout,
                          label: '[自定义终端]',
                        })
                      }
                      className="px-4 py-2 rounded-lg bg-cyber-green text-cyber-black font-bold text-sm flex items-center gap-2 disabled:opacity-50 hover:bg-cyber-green/90"
                    >
                      <Play size={16} /> 执行命令
                    </motion.button>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1 border-t border-white/5 pt-3">
                    <div>💡 提示：</div>
                    <ul className="list-disc pl-4 space-y-0.5">
                      <li>命令在 Kali ({attackerIp || '攻击机'}) 上真实执行</li>
                      <li>禁止 SSH 端口转发 (-L/-R/-D)、nc -e 反向 shell 等</li>
                      <li>如需攻击 {targetIp || '靶机 IP'}，可直接使用向导中的一键工具</li>
                    </ul>
                  </div>
                </div>

                {/* 输出列表 */}
                {outputs.length > 0 && (
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-1 max-h-80 overflow-y-auto">
                    <div className="text-xs font-semibold text-gray-400 px-2 pb-1">最近执行</div>
                    {outputs.map((o) => (
                      <button
                        key={o.execId}
                        onClick={() => setSelectedOutputId(o.execId)}
                        className={`w-full text-left p-2 rounded-lg flex items-center gap-2 text-xs transition-colors ${
                          selectedOutputId === o.execId
                            ? 'bg-cyber-green/10 border border-cyber-green/30'
                            : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        {o.exitCode === -999 ? (
                          <RefreshCw size={12} className="animate-spin text-cyan-400" />
                        ) : o.exitCode === 0 ? (
                          <CheckCircle2 size={12} className="text-green-400" />
                        ) : (
                          <XCircle size={12} className="text-rose-400" />
                        )}
                        <span className="text-gray-200 flex-1 truncate">
                          {o.label}
                        </span>
                        <span className="text-gray-500 font-mono">
                          {new Date(o.startedAt).toLocaleTimeString('zh-CN', { hour12: false })}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2 max-h-[640px] overflow-y-auto"
              >
                <div className="flex items-center justify-between px-1 pb-2 border-b border-white/5">
                  <div className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <Clock size={16} className="text-cyber-purple" /> 执行历史 ({history.length})
                  </div>
                  <button
                    onClick={() =>
                      fetch('/api/vm-labs/history?limit=200')
                        .then((r) => r.json())
                        .then((d) => setHistory(d.history || []))
                    }
                    className="text-xs text-gray-400 hover:text-cyber-green"
                  >
                    刷新
                  </button>
                </div>
                {history.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">暂无历史记录，跑一个攻击向导试试看～</div>
                ) : (
                  history.map((h) => (
                    <div
                      key={h.execId}
                      className="p-2 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        {h.success ? (
                          <CheckCircle2 size={12} className="text-green-400" />
                        ) : (
                          <XCircle size={12} className="text-rose-400" />
                        )}
                        <span className="text-gray-200 font-medium flex-1 truncate">
                          {h.label || '未命名命令'}
                        </span>
                        <span className="text-gray-500 font-mono">
                          exit {h.exitCode}
                        </span>
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-gray-400 bg-black/30 rounded p-1.5 border border-white/5 break-all line-clamp-2">
                        $ {h.command}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-500">
                        <span>
                          {new Date(h.startedAt).toLocaleString('zh-CN', { hour12: false })}
                        </span>
                        <button
                          onClick={() => {
                            setCustomCmd(h.command);
                            setTab('terminal');
                            showToast('已载入到命令终端');
                          }}
                          className="text-cyber-green hover:underline ml-auto"
                        >
                          再次执行 →
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 右侧：终端输出 */}
        <div className="xl:col-span-3">
          <div className="rounded-xl border border-white/10 bg-[#0a0a0f] h-[640px] flex flex-col">
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3 bg-black/30">
              <Terminal size={16} className="text-cyber-green" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-200 truncate">
                  {selectedOutput ? selectedOutput.label : '命令输出'}
                </div>
                {selectedOutput && (
                  <div className="text-xs text-gray-500 font-mono truncate">
                    $ {selectedOutput.command}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedOutput?.exitCode === -999 && (
                  <span className="px-2 py-1 rounded text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                    <RefreshCw size={12} className="animate-spin" /> 运行中...
                  </span>
                )}
                {selectedOutput && selectedOutput.exitCode !== -999 && (
                  <span
                    className={`px-2 py-1 rounded text-xs border ${
                      selectedOutput.exitCode === 0
                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    exit {selectedOutput.exitCode}
                  </span>
                )}
                {selectedOutput && (
                  <button
                    onClick={() =>
                      copyText(selectedOutput.stdout + (selectedOutput.stderr ? '\nSTDERR:\n' + selectedOutput.stderr : '')).then(
                        (ok) => showToast(ok ? '输出已复制' : '复制失败')
                      )
                    }
                    className="p-1.5 rounded hover:bg-white/10 text-gray-400"
                    title="复制输出"
                  >
                    <Copy size={14} />
                  </button>
                )}
                {selectedOutput && (
                  <button
                    onClick={() => {
                      const blob = new Blob(
                        [
                          `# ${selectedOutput.label}\n# CMD: ${selectedOutput.command}\n# Time: ${selectedOutput.startedAt}\n\n`,
                          selectedOutput.stdout,
                          selectedOutput.stderr ? `\n\n===== STDERR =====\n${selectedOutput.stderr}` : '',
                        ],
                        { type: 'text/plain;charset=utf-8' }
                      );
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `vm-labs-${selectedOutput.execId}.log`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="p-1.5 rounded hover:bg-white/10 text-gray-400"
                    title="下载 .log"
                  >
                    <Download size={14} />
                  </button>
                )}
                {outputs.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('清空所有本地输出记录？（服务器历史记录不会删除）')) {
                        setOutputs([]);
                        setSelectedOutputId(null);
                      }
                    }}
                    className="p-1.5 rounded hover:bg-white/10 text-gray-400"
                    title="清空输出"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>

            <pre
              ref={outputRef}
              className="flex-1 overflow-y-auto p-4 text-xs font-mono text-cyber-green/90 whitespace-pre-wrap break-words leading-relaxed"
            >
              {!selectedOutput && (
                <span className="text-gray-500">
                  {runningExecId
                    ? '等待命令执行结果...\n'
                    : '// 选择左侧的攻击向导、点击一键工具，或在"命令终端"中输入自定义命令。\n// 输出会显示在这里。\n\n// 推荐启动顺序：\n//   1. 信息收集 → 快速端口扫描\n//   2. SMB 扫描与利用 → 永恒蓝检测\n//   3. 根据开放端口选择对应的漏洞利用或爆破模块\n'}
                </span>
              )}
              {selectedOutput && (
                <>
                  <span className="text-cyan-400">
                    === {selectedOutput.label} ==={'\n'}
                  </span>
                  <span className="text-gray-500">
                    $ {selectedOutput.command}
                    {'\n\n'}
                  </span>
                  <span>{selectedOutput.stdout || '(无 stdout)'}</span>
                  {selectedOutput.stderr && (
                    <span className="text-rose-400 block mt-2 pt-2 border-t border-white/5">
                      {'\n'}---- STDERR ----{'\n'}
                      {selectedOutput.stderr}
                    </span>
                  )}
                </>
              )}
            </pre>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-[#111827] border border-cyber-green/30 text-sm text-cyber-green shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===== 子组件：虚拟机状态卡 =====
const MachineCard: React.FC<{ m: MachineStatus; loading?: boolean; backendConnected?: boolean }> = ({
  m,
  loading,
  backendConnected = true,
}) => {
  const isAttacker = m.role === 'attacker';
  return (
    <motion.div
      layout
      className={`rounded-xl p-5 border ${
        !backendConnected
          ? 'border-slate-500/30 bg-gradient-to-br from-slate-500/5 to-transparent'
          : m.online
          ? isAttacker
            ? 'border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent'
            : 'border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent'
          : 'border-rose-500/30 bg-rose-500/5'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl ${
              !backendConnected
                ? 'border-slate-500/40 bg-slate-500/15 opacity-70'
                : m.online
                ? isAttacker
                  ? 'border-cyan-500/40 bg-cyan-500/15'
                  : 'border-amber-500/40 bg-amber-500/15'
                : 'border-rose-500/40 bg-rose-500/15'
            }`}
          >
            {m.icon || <Monitor size={22} />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-100">{m.name}</span>
              {loading ? (
                <RefreshCw size={12} className="animate-spin text-gray-400" />
              ) : !backendConnected ? (
                <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-mono border border-slate-500/40 px-2 py-0.5 rounded bg-slate-500/10">
                  <Clock size={10} /> 静态展示（后端未连）
                </span>
              ) : m.online ? (
                <span className="inline-flex items-center gap-1 text-xs text-green-400">
                  <Wifi size={12} /> 在线
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-rose-400">
                  <WifiOff size={12} /> 离线
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{m.os}</div>
            <div className="text-xs font-mono text-gray-500 mt-0.5">
              {m.host}
              {m.port ? `:${m.port}` : ''}
            </div>
          </div>
        </div>
        <div className="text-right space-y-1">
          {backendConnected && m.latencyMs != null && (
            <div
              className={`text-xs font-mono px-2 py-1 rounded inline-block ${
                m.online
                  ? 'bg-white/5 text-gray-300 border border-white/10'
                  : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
              }`}
            >
              延迟 {m.latencyMs}ms
            </div>
          )}
        </div>
      </div>

      {(isAttacker && (m.online || !backendConnected) && m.info) && (
        <div className={`mt-3 p-2 rounded border text-[11px] font-mono break-all ${
          backendConnected ? 'bg-black/20 border-white/5 text-gray-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-300'
        }`}>
          {m.info}
        </div>
      )}
      {backendConnected && !isAttacker && m.openPorts && m.openPorts.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
            <Cpu size={12} /> 开放服务 ({m.openPorts.length})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {m.openPorts.map((p) => (
              <div
                key={`${p.port}-${p.protocol}`}
                className="px-2 py-1.5 rounded bg-black/30 border border-white/10 text-xs"
                title={p.extra}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-amber-300">
                    {p.port}/{p.protocol}
                  </span>
                  <span className="text-gray-400 truncate">{p.service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {(m.online === false && m.error && backendConnected) && (
        <div className="mt-3 p-2 rounded bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
          <ShieldAlert size={14} className="mt-0.5 flex-shrink-0" />
          <div className="break-all">{m.error}</div>
        </div>
      )}
      {!backendConnected && (
        <div className="mt-3 p-2 rounded bg-slate-500/10 border border-slate-500/20 text-xs text-slate-300 flex items-start gap-2">
          <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-amber-400" />
          <div>
            要使用 <strong>SSH 命令执行 / {isAttacker ? '远程工具' : '端口扫描'}</strong> 请先启动后端：
            <code className="text-amber-300 ml-1">cd backend && node server.js</code>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ===== 子组件：DVWA 靶场状态卡（保留向后兼容） =====
const DvwaCard: React.FC<{ d: DvwaTarget; loading?: boolean }> = ({ d, loading }) => {
  const color = d.color === 'cyan' ? 'cyan' : d.color === 'amber' ? 'amber' : 'violet';
  const palette =
    color === 'cyan'
      ? {
          border: 'border-cyan-500/30',
          bg: 'from-cyan-500/10 to-transparent',
          iconBg: 'border-cyan-500/40 bg-cyan-500/15',
          text: 'text-cyan-300',
        }
      : color === 'amber'
      ? {
          border: 'border-amber-500/30',
          bg: 'from-amber-500/10 to-transparent',
          iconBg: 'border-amber-500/40 bg-amber-500/15',
          text: 'text-amber-300',
        }
      : {
          border: 'border-violet-500/30',
          bg: 'from-violet-500/10 to-transparent',
          iconBg: 'border-violet-500/40 bg-violet-500/15',
          text: 'text-violet-300',
        };

  const ok = d.online === true;
  return (
    <motion.div
      layout
      className={`rounded-xl p-4 border ${palette.border} bg-gradient-to-br ${palette.bg}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center text-xl ${palette.iconBg}`}>
            {d.icon || <Globe2 size={20} />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-100 truncate">{d.name}</span>
              {loading ? (
                <RefreshCw size={12} className="animate-spin text-gray-400" />
              ) : ok ? (
                <span className="inline-flex items-center gap-1 text-xs text-green-400">
                  <Wifi size={12} /> 可访问
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-rose-400">
                  <WifiOff size={12} /> 不可达
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{d.builtBy || 'DVWA Web 靶场'}</div>
            <div className="text-[11px] font-mono text-gray-500 mt-0.5 truncate">
              {d.machine === 'kali' ? '🐲 Kali: ' : d.machine === 'win7' ? '🪟 Win7: ' : ''}
              {d.baseUrl}
            </div>
          </div>
        </div>
        <div className="text-right space-y-1.5 shrink-0">
          {d.latencyMs != null && (
            <div className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-gray-300 border border-white/10 inline-block">
              {d.httpCode ? `HTTP ${d.httpCode} · ` : ''}{d.latencyMs}ms
            </div>
          )}
          <div className="flex flex-wrap gap-1 justify-end">
            <a
              href={d.baseUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs px-2 py-1 rounded bg-black/30 border border-white/10 text-gray-300 hover:border-violet-500/40 hover:text-violet-300 inline-flex items-center gap-1"
              title={d.baseUrl}
            >
              <ExternalLink size={11} /> 首页
            </a>
            {d.loginPage && (
              <a
                href={`${d.baseUrl}${d.loginPage}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs px-2 py-1 rounded bg-black/30 border border-white/10 text-gray-300 hover:border-emerald-500/40 hover:text-emerald-300 inline-flex items-center gap-1"
                title="默认账密 admin / password"
              >
                <KeyRound size={11} /> 登录
              </a>
            )}
            {d.setupPage && (
              <a
                href={`${d.baseUrl}${d.setupPage}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs px-2 py-1 rounded bg-black/30 border border-white/10 text-gray-300 hover:border-amber-500/40 hover:text-amber-300 inline-flex items-center gap-1"
                title="建表 Setup"
              >
                <Zap size={11} /> Setup
              </a>
            )}
          </div>
        </div>
      </div>
      {(d.defaultCredsHint || d.looksLikeDvwa != null || d.requiresSetup || d.error) && (
        <div className="mt-3 space-y-1.5">
          {d.defaultCredsHint && (
            <div className="text-[11px] text-gray-400 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-black/20 border border-white/5">
              <KeyRound size={11} className="text-amber-400" /> 默认账密:
              <span className="font-mono text-amber-300">{d.defaultCredsHint}</span>
            </div>
          )}
          {d.looksLikeDvwa && (
            <div className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              <CheckCircle2 size={11} /> 已校验：响应内容符合 DVWA 特征
            </div>
          )}
          {d.requiresSetup && (
            <div className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <AlertTriangle size={11} /> 请先点击 Setup 创建数据库表
            </div>
          )}
          {!ok && d.error && (
            <div className="text-[11px] px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start gap-1.5">
              <XCircle size={11} className="mt-0.5 shrink-0" />
              <span className="break-all">{d.error}</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

// ===== 子组件：通用 Web 靶场卡片（已就绪 status=ready） =====
const WebTargetCard: React.FC<{ t: WebTarget; loading?: boolean }> = ({ t, loading }) => {
  const colorName =
    (['cyan', 'indigo', 'rose', 'amber', 'emerald', 'violet', 'teal', 'fuchsia', 'lime', 'slate', 'sky', 'orange'].includes(t.color || '')
      ? t.color
      : 'violet') as keyof typeof COLOR_HEX;
  const hex = COLOR_HEX[colorName] || COLOR_HEX.violet;
  const palette = {
    border: `border-[${hex}]/30`,
    bg: `from-[${hex}]/10`,
    iconBg: `border-[${hex}]/40 bg-[${hex}]/15`,
    text: `text-[${hex}]-300`,
  };
  // fallback: 使用 style 直接设置颜色以避免动态 tailwind 类失效
  const inlineBorder = { borderColor: `${hex}44` };
  const inlineIconBg = { borderColor: `${hex}66`, backgroundColor: `${hex}22` };
  const inlineBg = { backgroundImage: `linear-gradient(135deg, ${hex}1a, transparent 70%)` };

  const ok = t.online === true;
  const verified = t.verified === true;
  return (
    <motion.div
      layout
      className="rounded-xl p-4 border bg-gradient-to-br"
      style={{ ...inlineBorder, ...inlineBg }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-xl border flex items-center justify-center text-xl shrink-0"
            style={inlineIconBg}
          >
            {t.icon || <Globe2 size={20} />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-100 truncate">{t.name}</span>
              {loading ? (
                <RefreshCw size={12} className="animate-spin text-gray-400" />
              ) : ok ? (
                <span className="inline-flex items-center gap-1 text-xs text-green-400">
                  <Wifi size={12} /> 可访问
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-rose-400">
                  <WifiOff size={12} /> 不可达
                </span>
              )}
              {verified && ok && (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                  <CheckCircle2 size={10} /> 已验证
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span
                className="px-1.5 py-0.5 rounded text-[10px] border"
                style={{ borderColor: `${hex}44`, color: hex, backgroundColor: `${hex}12` }}
              >
                {t.categoryLabel || t.category}
              </span>
              <span className="truncate">{t.builtBy}</span>
            </div>
            <div className="text-[11px] font-mono text-gray-500 mt-0.5 truncate" title={t.baseUrl}>
              {t.machine === 'kali' ? '🐲 ' : t.machine === 'win7' ? '🪟 ' : t.machine === 'vmware' ? '💿 ' : ''}
              {t.baseUrl}
            </div>
          </div>
        </div>
        <div className="text-right space-y-1.5 shrink-0">
          {(t.latencyMs != null && typeof t.latencyMs === 'number') && (
            <div className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-gray-300 border border-white/10 inline-block">
              {t.httpCode ? `HTTP ${t.httpCode} · ` : ''}{t.latencyMs}ms
            </div>
          )}
          <div className="flex flex-wrap gap-1 justify-end">
            {t.baseUrl && !t.baseUrl.includes('待启动') && (
              <a
                href={t.baseUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs px-2 py-1 rounded bg-black/30 border border-white/10 text-gray-300 hover:text-white hover:border-white/30 inline-flex items-center gap-1"
                title={`打开 ${t.name}`}
              >
                <ExternalLink size={11} /> 打开
              </a>
            )}
            {t.loginUrl && (
              <a
                href={t.loginUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs px-2 py-1 rounded bg-black/30 border border-white/10 text-gray-300 hover:border-emerald-500/40 hover:text-emerald-300 inline-flex items-center gap-1"
                title={t.defaultCredsHint ? `默认账密：${t.defaultCredsHint}` : '登录页'}
              >
                <KeyRound size={11} /> 登录
              </a>
            )}
            {t.setupUrl && (
              <a
                href={t.setupUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs px-2 py-1 rounded bg-black/30 border border-white/10 text-gray-300 hover:border-amber-500/40 hover:text-amber-300 inline-flex items-center gap-1"
                title="安装 / Setup"
              >
                <Zap size={11} /> Setup
              </a>
            )}
          </div>
        </div>
      </div>
      {/* 描述 / 漏洞列表 / 状态提示 */}
      <div className="mt-3 space-y-1.5">
        {t.description && (
          <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
            {t.description}
          </p>
        )}
        {t.vulnerabilities && t.vulnerabilities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {t.vulnerabilities.slice(0, 5).map((v) => (
              <span
                key={v}
                className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 border border-white/5 text-gray-400"
              >
                #{v}
              </span>
            ))}
            {t.vulnerabilities.length > 5 && (
              <span className="text-[10px] px-1.5 py-0.5 text-gray-500">
                +{t.vulnerabilities.length - 5} 更多
              </span>
            )}
          </div>
        )}
        {t.defaultCredsHint && (
          <div className="text-[11px] text-gray-400 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-black/20 border border-white/5">
            <KeyRound size={11} className="text-amber-400" /> 默认账密:
            <span className="font-mono text-amber-300">{t.defaultCredsHint}</span>
          </div>
        )}
        {!ok && t.status === 'ready' && t.error && (
          <div className="text-[11px] px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start gap-1.5">
            <XCircle size={11} className="mt-0.5 shrink-0" />
            <span className="break-all">{t.error}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ===== 子组件：待搭建靶场预告卡（status=planned / building） =====
const PlannedTargetCard: React.FC<{ t: WebTarget }> = ({ t }) => {
  const isBuilding = t.status === 'building';
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4 border border-dashed border-slate-500/30 bg-slate-500/[0.03] hover:bg-slate-500/[0.06] hover:border-slate-400/40 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl border border-slate-500/40 bg-slate-500/10 flex items-center justify-center text-xl shrink-0 opacity-80 grayscale-[30%]">
            {t.icon || <Clock size={20} />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-300 truncate">{t.name}</span>
              {isBuilding ? (
                <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  <RefreshCw size={10} className="animate-spin" /> 搭建中
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-500/10 border border-slate-500/30 text-slate-300">
                  <Clock size={10} /> 待搭建
                </span>
              )}
              {t.difficulty && (
                <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-300">
                  难度: {t.difficulty}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span className="px-1.5 py-0.5 rounded text-[10px] border border-slate-500/30 text-slate-400 bg-slate-500/10">
                {t.categoryLabel || t.category}
              </span>
              <span className="truncate">{t.builtBy}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {t.description && (
          <p className="text-[11px] text-gray-500 leading-relaxed">
            {t.description}
          </p>
        )}
        {t.vulnerabilities && t.vulnerabilities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {t.vulnerabilities.slice(0, 4).map((v) => (
              <span
                key={v}
                className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 border border-white/5 text-gray-500"
              >
                #{v}
              </span>
            ))}
            {t.vulnerabilities.length > 4 && (
              <span className="text-[10px] px-1.5 py-0.5 text-gray-600">
                +{t.vulnerabilities.length - 4} 漏洞类型
              </span>
            )}
          </div>
        )}
        {t.plannedNotice && (
          <div className="text-[11px] px-2 py-1 rounded bg-sky-500/5 border border-sky-500/15 text-sky-400/90 flex items-start gap-1.5 leading-relaxed">
            <AlertTriangle size={11} className="mt-0.5 shrink-0" />
            <span>{t.plannedNotice}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ===== 子组件：攻击步骤卡 =====
const AttackStepCard: React.FC<{
  step: AttackStep;
  moduleColor: string;
  running: boolean;
  onRun: (acceptRisk?: boolean) => void;
}> = ({ step, moduleColor, running, onRun }) => (
  <div
    className={`p-3 rounded-lg border bg-black/20 ${
      step.dangerous
        ? 'border-rose-500/40 hover:border-rose-400'
        : 'border-white/5 hover:border-white/15'
    } transition-colors`}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-200">{step.name}</span>
          {step.dangerous && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
              <AlertTriangle size={10} /> 危险
            </span>
          )}
        </div>
        <div className="text-xs text-gray-400 mt-1">{step.description}</div>
        <div
          className="mt-2 p-2 rounded font-mono text-[11px] bg-black/40 border border-white/5 text-gray-300 break-all line-clamp-3"
          style={{ borderLeftColor: moduleColor, borderLeftWidth: 2 }}
          title={step.command}
        >
          $ {step.command}
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={10} />
            超时 {Math.round((step.timeout || 60000) / 1000)}s
          </span>
          <button
            onClick={() => copyText(step.command).then((ok) => (ok ? null : null))}
            className="text-gray-500 hover:text-gray-200 flex items-center gap-1"
            title="复制命令"
          >
            <Copy size={10} /> 复制
          </button>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onRun(step.dangerous ? false : undefined)}
        disabled={running}
        className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-cyber-black disabled:opacity-50 transition-colors ${
          step.dangerous
            ? 'bg-rose-400 hover:bg-rose-500'
            : 'bg-cyber-green hover:brightness-110'
        }`}
        title="执行此步骤"
      >
        <Play size={16} />
      </motion.button>
    </div>
  </div>
);

export default VmLabs;
