# 网络安全学习路线总览（护网 / 渗透 / 等保 / CTF）

---

## 🚩 路线总览

```
基础阶段 (0-3个月) ──▶ 方向分化 (3-6个月) ──▶ 深度提升 (6-18个月) ──▶ 专家 (18个月+)
```

---

## 📚 第一阶段：基础（0-3 个月）

### 1.1 计算机与网络基础

| 内容 | 推荐资源 |
|------|---------|
| Linux 系统管理 | 《鸟哥的 Linux 私房菜：基础学习篇》 |
| 常用命令 | bash / grep / sed / awk / find / curl / wget / netstat / ss |
| 计算机网络 | 《图解 TCP/IP》、《计算机网络：自顶向下方法》 |
| TCP/IP、HTTP(S)、DNS、ARP、路由 | Wireshark 抓包实战 |
| 操作系统原理 | 进程 / 线程 / 内存 / 文件系统 |

### 1.2 编程语言

| 语言 | 用途 | 级别要求 |
|------|------|---------|
| **Python 3** | 脚本、PoC、爬虫、自动化、数据分析 | 熟练（推荐 500+ 行项目经验） |
| **C / C++** | Pwn / Reverse 底层理解 | 阅读能力 + 基础编写 |
| **JavaScript** | Web 前端 / Node.js 安全 | 基础阅读 |
| **PHP / Java / Go** | 常见 Web 后端 | 基础阅读 |
| **Bash** | Linux 运维与渗透 | 熟练 |
| **SQL** | MySQL / PostgreSQL 语句 | 熟练 |

### 1.3 Web 基础

- HTML / CSS / JavaScript 基础
- HTTP/HTTPS、Cookie / Session、JWT、CORS
- Nginx / Apache 配置、虚拟主机、反向代理
- PHP / Java / Python 各做一个小项目（留言板 / 博客）

### 1.4 安全入门阅读

- 《白帽子讲 Web 安全》（吴翰清）
- 《Web 安全深度剖析》
- OWASP Top 10（每年更新）
- 观看：Web 安全入门视频（B站 / YouTube）

---

## 🛡️ 第二阶段：分方向（3-6 个月）

### A. 渗透测试 / 红队方向

**核心课程与练习**

| 模块 | 内容 | 练习平台 |
|------|------|---------|
| 信息收集 | 子域名 / 端口 / 指纹 / 情报 | FOFA / Shodan / Censys / OneForAll |
| Web 漏洞 | SQL/XSS/SSRF/XXE/反序列化/文件上传/逻辑漏洞 | DVWA / Pikachu / Upload-Labs / SQLi-Labs |
| 中间件 & CMS | Nginx、Apache、Tomcat、Weblogic、Jboss、Struts2、WordPress、Drupal、织梦 | Vulhub / Vulfocus |
| 内网渗透 | 域环境、横向、凭据导出、Kerberoasting | Vulnstack / 红日靶场 |
| 后渗透 | MSF、Cobalt Strike、Empire、Pupy、CS 插件开发 | HackTheBox / TryHackMe |
| 免杀 | Shellcode、混淆、二进制免杀、进程注入 | 自己搭环境实验 |

**建议节奏（3 个月）**

```
第1月：信息收集 + Web Top 10 逐个突破
第2月：中间件 + CMS 漏洞；Vulhub 全刷一遍
第3月：内网域渗透 + 后渗透工具链；写完整渗透报告
```

**认证**：OSCP（强烈推荐）、OSCE、eJPT、eWPT、CRTP、CRTO

---

### B. 蓝队 / 护网 / 应急响应方向

| 模块 | 内容 |
|------|------|
| 主机安全 | Windows/Linux 基线加固、EDR、组策略、审计策略 |
| 网络防御 | 防火墙、IDS/IPS、WAF、蜜罐、流量分析 |
| 日志分析 | ELK、Splunk、Sigma 规则、Windows 事件 ID、Linux auth.log |
| 应急响应 | 勒索软件、钓鱼、Webshell 排查、内存取证、磁盘取证 |
| 护网实战 | 值守流程、7×24、事件分级、上报、复盘 |

**认证**：CISP、CISSP、CEH、CompTIA Security+、GCIH、GCFA

**推荐阅读**

- 《蓝队实战指南》
- 《Windows 应急响应实战》
- 《Linux 服务器安全策略》
- SIGMA 规则集

---

### C. 等保测评 / 合规方向

| 模块 | 内容 |
|------|------|
| 等保 2.0 标准 | GB/T 22239 / 28448 / 22240 / 25070 |
| 定级与备案 | 1~5 级分级、定级报告、备案流程 |
| 技术要求 | 物理 / 网络 / 主机 / 应用 / 数据 / 管理中心 |
| 管理要求 | 制度 / 机构 / 人员 / 建设 / 运维 |
| 测评方法 | 文档审查 / 访谈 / 配置核查 / 工具测试 / 渗透测试 |
| 差距分析与整改 | 高风险问题 Top20 处置 |

**认证**：CISP（注册信息安全专业人员）、CISSP、CCSRP、IT审计师

**推荐阅读**

- 《信息安全等级保护测评师培训教材》
- 公安部信息安全等级保护评估中心公开资料

---

### D. CTF 方向

**方向细分**

| 方向 | 基础题源 | 进阶题源 |
|------|---------|---------|
| **Web** | DVWA / Pikachu / upload-labs | CTFHub / BUUCTF / NSSCTF / XNSEC |
| **Pwn** | pwnable.kr / pwnable.tw / ret2school | 攻防世界 / pwn.college / heap-exploitation |
| **Reverse** | crackmes.one / reversing.kr / CTFHub 逆向入门 | NSSCTF / 攻防世界 高级区 |
| **Crypto** | cryptopals.com / CTFHub Crypto | rwctf / N1CTF / *CTF 复现 |
| **Misc** | CTFHub / BUUCTF misc 区 | 流量分析 / 隐写进阶 |

**推荐节奏（6 个月入门）**

```
第1-2月：熟悉 Linux + Python + 常用工具；各方向入门题各刷 20 道
第3-4月：选定主方向（如 Web 或 Pwn），深入 100+ 题；参加线上赛
第5-6月：加入战队，组队打比赛，写 Writeup；目标主方向题目能独立解出
```

---

## 🧗 第三阶段：深度提升（6-18 个月）

### A. 渗透 / 红队进阶

- 代码审计（PHP / Java / .NET / Go）
- 1day / Nday 分析与复现
- 高级内网：Exchange、Kerberos 各种攻击、资源基于约束的委派（RBCD）
- 红队指挥与调度、ATT&CK 框架应用
- C2 开发（基于 Nim / Rust / Go）
- APT 组织 TTP 学习与复现

### B. 蓝队进阶

- ATT&CK for Defense / D3FEND
- SIEM / SOAR / UEBA / NTA 建设
- 威胁情报（TI）、IOC、YARA 规则
- 红蓝对抗：做蓝队视角，分析红队路径
- 应急响应演练（至少每季度一次）
- 蜜罐体系（Cowrie、Glastopf、HoneyPy、Conpot）

### C. CTF 进阶

- **Web**：现代框架（Laravel、ThinkPHP、Spring、Flask）源码审计
- **Pwn**：glibc 各版本 heap exploit、内核 pwn、浏览器 pwn、IoT pwn
- **Reverse**：脱壳（Themida / VMProtect）、anti-analysis、Android Native、iOS
- **Crypto**：格密码（Lattice）、后量子密码、CTF 难题复现
- **战队**：加入本地或线上战队，稳定参加国内外赛事

---

## 🎓 第四阶段：专家（18 个月+）

- 持续参与高水平比赛 / 攻防演练 / 护网
- 开源工具开发 / 漏洞研究 / CVE 提交
- 输出技术文章 / 演讲 / 培训
- 领域深耕：IoT 安全 / 云原生安全 / 车联网 / AI 安全 / 移动安全 / 区块链
- 团队管理：组建 / 带领战队或安全团队

---

## 📦 推荐工具清单

| 分类 | 工具 |
|------|------|
| 信息收集 | Nmap、Masscan、OneForAll、Amass、Subfinder、Xray、httpx、FOFA、Shodan、ZoomEye |
| Web 扫描 | Burp Suite、Xray、Nuclei、dirsearch、ffuf、sqlmap |
| Pwn | pwntools、GDB + pwndbg、ROPgadget、one_gadget、glibc-all-in-one、checksec |
| Reverse | IDA Pro、Ghidra、x64dbg、Frida、angr、die、Detect It Easy |
| Crypto | SageMath、gmpy2、PyCryptodome、RsaCtfTool、z3-solver、yafu |
| Misc | binwalk、foremost、010 Editor、Stegsolve、zsteg、Audacity、Wireshark、CyberChef |
| 运维 | Ansible、Docker、K8s、ELK、Prometheus、Grafana |
| 笔记 | Typora / Obsidian / Notion、CheatSheet、自建知识库 |

---

## 🌐 推荐社区 / 平台 / 公众号

- **社区**：先知社区 / 安全客 / Freebuf / 嘶吼 / CTFHub / XNSEC / T00ls
- **平台**：Bugcrowd / HackerOne / 补天 / 漏洞盒子 / HackTheBox / TryHackMe
- **赛事**：强网杯、XCTF、N1CTF、*CTF、Real World CTF、Google CTF、DEFCON CTF
- **公众号**：网信攻防、斗象能力中心、绿盟科技技术博客、奇安信 CERT、阿里安全响应中心

---

## ⚠️ 道德与法律

- 始终保持在授权范围内测试
- 未经授权的入侵 / 数据访问在各国均属违法
- 对发现的漏洞遵循「负责任披露」原则
- CTF 环境与真实世界严格隔离
- 遵守《网络安全法》与相关法律法规

---

> 网络安全是一条「终身学习」之路。每天进步一点点，一年后回头看，你会感谢现在努力的自己。加油！💪
