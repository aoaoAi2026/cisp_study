---
day: 16
title: 360磐云 & 资产测绘
phase: 厂商产品学习
difficulty: ⭐⭐⭐ 进阶
---

# Day 16：360磐云 & 资产测绘

> "你不知道自己有什么资产，就不知道攻击者会从哪里进来。"

---

## 📋 今日学习目标

1. 掌握360磐云云安全SaaS的产品体系和核心能力
2. 理解磐云的三大核心组件：CBH/CWPP/WAF
3. 深入理解资产测绘的核心概念和工作原理
4. 掌握资产测绘的四大步骤：子域名发现→端口扫描→指纹识别→暴露面分析
5. 能够使用开源工具完成基础的资产发现链路
6. 理解暴露面分析在护网中的关键价值
7. 学会评估企业的互联网暴露面风险
8. 掌握subfinder+nmap+nuclei开源资产发现链路

---

## 📖 核心知识讲解

### 第一章：360磐云——云安全SaaS全家桶

#### 1.1 产品定位

360磐云是360推出的云安全SaaS服务平台，为企业提供一站式云安全能力。

> **比喻**：传统安全产品就像在自己家里安装各种安防设备（摄像头、报警器、防盗门）。磐云则像一个专业的"安防物业公司"——你把房子交给他们管，他们用专业的设备、人员和经验来保护你的安全。

#### 1.2 磐云产品体系

```
                   360磐云云安全SaaS平台
    ┌─────────────────────────────────────────────┐
    │                                              │
    │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
    │  │  CBH     │  │  CWPP    │  │  WAF     │   │
    │  │ 云堡垒机  │  │ 云工作负载 │  │ Web应用  │   │
    │  │          │  │ 保护平台  │  │ 防火墙   │   │
    │  └──────────┘  └──────────┘  └──────────┘   │
    │                                              │
    │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
    │  │  资产测绘 │  │ 漏洞扫描  │  │ 合规检测  │   │
    │  │          │  │          │  │          │   │
    │  └──────────┘  └──────────┘  └──────────┘   │
    │                                              │
    │  ┌──────────────────────────────────────┐    │
    │  │         统一管理控制台                 │    │
    │  │    · 资产全景    · 风险仪表盘          │    │
    │  │    · 安全报告    · 告警管理            │    │
    │  └──────────────────────────────────────┘    │
    └─────────────────────────────────────────────┘
```

#### 1.3 三大核心组件详解

**① CBH——云堡垒机（Cloud Bastion Host）**

| 特性 | 说明 |
|:---|:---|
| 核心功能 | 运维审计、权限管控、操作录像、双因子认证 |
| 支持协议 | SSH/RDP/VNC/Telnet/FTP/SFTP |
| 部署方式 | SaaS化，无需本地部署 |
| 核心价值 | 所有运维操作可审计、可追溯、可回放 |
| 合规价值 | 满足等保三级对运维审计的要求 |

**运维审计工作流：**
```
运维人员 → 登录堡垒机（双因子认证） → 选择目标资产
    → 建立会话（全程录像） → 执行运维操作
    → 操作日志记录 → 会话结束 → 录像存储（可回放）
```

**② CWPP——云工作负载保护平台（Cloud Workload Protection Platform）**

| 特性 | 说明 |
|:---|:---|
| 核心功能 | 主机入侵检测、漏洞管理、文件完整性监控、微隔离 |
| 支持环境 | 物理机/虚拟机/容器/公有云/私有云 |
| 部署方式 | Agent安装 + SaaS管理 |
| 核心价值 | 统一管理混合云环境中的所有工作负载安全 |
| 与椒图对比 | 功能类似但偏SaaS化，椒图偏私有化部署 |

**③ WAF——Web应用防火墙**

| 特性 | 说明 |
|:---|:---|
| 核心功能 | SQL注入/XSS/CSRF防护、CC攻击防护、Bot管理、API安全 |
| 部署方式 | 反向代理/SaaS/云原生 |
| 防护模式 | 阻断模式/监控模式 |
| 规则更新 | 实时云端更新，无需客户操作 |
| 核心价值 | 保护Web应用免受OWASP Top 10威胁 |

#### 1.4 磐云的优势与局限

| 优势 | 局限 |
|:---|:---|
| 零部署门槛，注册即用 | 数据经过云端，部分客户有顾虑 |
| 持续云端更新，无需维护 | 定制化能力不如私有化部署 |
| 弹性扩展，按需付费 | 对网络延迟敏感 |
| 与360威胁情报联动 | 离线环境无法使用 |
| 中小企业友好 | 大规模环境成本可能更高 |

---

### 第二章：资产测绘——看见你的攻击面

#### 2.1 什么是资产测绘？

资产测绘（Asset Mapping / Attack Surface Discovery）是指通过技术手段发现和识别企业所有互联网暴露的资产，包括但不限于：域名、子域名、IP地址、开放端口、运行服务、Web应用、中间件、框架版本等。

> **比喻**：资产测绘就像给企业做一次"全身CT扫描"——你不知道自己身体里有什么问题（资产），但CT能全部照出来。护网中，攻击者也会做同样的扫描，谁先发现问题，谁就占了先机。

#### 2.2 为什么资产测绘是护网第一课？

| 场景 | 没有资产测绘 | 有资产测绘 |
|:---|:---|:---|
| 护网开始前 | 不知道有哪些资产暴露 | 全面掌握暴露面 |
| 漏洞爆发时 | 不知道哪些资产受影响 | 快速定位受影响资产 |
| 安全巡检 | 手工盘点，容易遗漏 | 自动化持续监测 |
| 攻击溯源 | 不知道被攻击的是哪个资产 | 精确关联资产信息 |
| 合规审计 | 资产台账不准确 | 资产清单准确完整 |

#### 2.3 资产测绘四大步骤

```
步骤一：子域名发现
    │
    │  技术：证书透明度日志(CT)、DNS暴力枚举、搜索引擎、被动DNS
    │  工具：subfinder、amass、OneForAll
    │
    ▼
步骤二：端口扫描
    │
    │  技术：TCP SYN扫描、TCP Connect扫描、UDP扫描
    │  工具：nmap、masscan、zmap
    │
    ▼
步骤三：指纹识别
    │
    │  技术：Banner抓取、HTTP响应分析、服务特征匹配
    │  工具：httpx、whatweb、wappalyzer
    │
    ▼
步骤四：暴露面分析
    │
    │  分析：哪些服务暴露？版本是什么？有已知漏洞吗？
    │  输出：资产清单、风险评估、修复建议
    │
    ▼
输出：完整的互联网暴露面资产台账
```

#### 2.4 第一步：子域名发现

**技术一：证书透明度日志（Certificate Transparency, CT）**

```
原理：
所有CA机构签发的SSL证书都会被记录到公开的CT日志中。
通过查询CT日志，可以发现企业的所有SSL证书及其关联的域名。

示例查询（crt.sh）：
https://crt.sh/?q=%25.example.com

返回结果可能包含：
- www.example.com
- mail.example.com
- admin.example.com       ← 可能暴露了管理后台！
- dev.example.com         ← 可能暴露了开发环境！
- staging.example.com     ← 可能暴露了测试环境！
- vpn.example.com         ← VPN入口！
- oa.example.com          ← OA系统入口！
```

**技术二：DNS暴力枚举**

```bash
# 使用常见子域名字典进行枚举
# 字典通常包含数万到数十万个常见子域名

常见子域名示例：
www, mail, smtp, pop3, imap, webmail, 
ftp, sftp, ssh, vpn, remote, portal, 
admin, administrator, manage, cms, 
api, dev, test, staging, uat, 
oa, erp, crm, hr, finance, 
wiki, docs, confluence, jira, gitlab, 
jenkins, nexus, harbor, grafana, kibana
```

**技术三：搜索引擎发现**

```
使用Google Dork语法发现子域名：
site:example.com -www.example.com

使用其他搜索引擎：
- Shodan: org:"Company Name"
- Fofa: domain="example.com"
- ZoomEye: site:example.com
- Censys: services.tls.certificates.leaf_data.subject.common_name:"example.com"
```

#### 2.5 第二步：端口扫描

```bash
# Nmap常用扫描参数
nmap -sS -p- --min-rate 1000 -oA scan_results target.com
# -sS: TCP SYN扫描（半开扫描，速度快且隐蔽）
# -p-: 扫描全部65535个端口
# --min-rate: 最小发包速率
# -oA: 输出所有格式

# 快速扫描常用端口（Top 1000）
nmap -sS --top-ports 1000 target.com

# 服务版本探测
nmap -sV -p 22,80,443,3306,6379,8080 target.com

# 操作系统探测
nmap -O target.com

# NSE脚本扫描（漏洞检测）
nmap --script vuln target.com
```

**常见端口及对应服务：**

| 端口 | 服务 | 风险 |
|:---|:---|:---|
| 21 | FTP | 弱口令、匿名访问 |
| 22 | SSH | 弱口令、暴力破解 |
| 23 | Telnet | 明文传输、高危 |
| 25 | SMTP | 邮件伪造 |
| 53 | DNS | DNS投毒、域传送 |
| 80/443 | HTTP/HTTPS | Web漏洞 |
| 135/139/445 | SMB | 永恒之蓝漏洞 |
| 1433 | MSSQL | 弱口令、命令执行 |
| 1521 | Oracle | 弱口令 |
| 3306 | MySQL | 弱口令、未授权 |
| 3389 | RDP | 弱口令、暴力破解 |
| 5432 | PostgreSQL | 弱口令 |
| 6379 | Redis | 未授权访问 |
| 27017 | MongoDB | 未授权访问 |
| 9200 | Elasticsearch | 未授权访问 |
| 11211 | Memcached | 未授权访问 |

#### 2.6 第三步：指纹识别

```bash
# httpx - HTTP服务探测与指纹识别
httpx -l subdomains.txt -title -tech-detect -status-code -o results.txt

# 输出示例：
# https://www.example.com [200] [nginx/1.18.0] [React,jQuery] [Example Corp]
# https://admin.example.com [401] [Apache/2.4.41] [PHP] []
# https://api.example.com [200] [nginx] [Vue.js] []

# whatweb - Web技术栈识别
whatweb https://www.example.com

# 输出示例：
# https://www.example.com [200 OK] Country[UNITED STATES][US]
# HTTPServer[nginx/1.18.0], IP[192.0.2.1], 
# jQuery[3.5.1], React[17.0.2], 
# X-Powered-By[Express]
```

#### 2.7 第四步：暴露面分析

将前三步的数据汇总，形成暴露面分析报告：

```yaml
# 暴露面分析报告模板
asset_inventory:
  total_domains: 156
  total_subdomains: 2341
  total_ips: 89
  total_open_ports: 456

risk_summary:
  critical: 3    # 如：Redis未授权、管理后台暴露、struts2漏洞
  high: 12       # 如：弱口令服务、过期SSL证书、敏感信息泄露
  medium: 45     # 如：不必要的端口开放、信息泄露
  low: 89        # 如：HTTP而非HTTPS、版本信息暴露

critical_findings:
  - asset: redis-internal.example.com:6379
    risk: Redis未授权访问
    remediation: 配置认证密码或绑定内网IP
    
  - asset: admin.example.com
    risk: 管理后台暴露在公网
    remediation: 添加IP白名单或VPN访问
    
  - asset: jenkins.example.com:8080
    risk: Jenkins未授权访问
    remediation: 启用认证或关闭公网访问
```

---

### 第三章：开源资产发现链路实战

#### 3.1 subfinder + nmap + nuclei 工具链

这是目前业界最流行的开源资产发现+漏洞扫描组合：

```
subfinder (子域名发现)
    │
    ▼
dnsx (DNS解析验证)
    │
    ▼
httpx (HTTP服务探测+指纹识别)
    │
    ▼
nmap (端口扫描+服务识别)
    │
    ▼
nuclei (漏洞扫描验证)
```

#### 3.2 工具安装与环境准备

```bash
# 1. 安装 subfinder（子域名发现工具）
# GitHub: https://github.com/projectdiscovery/subfinder
go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest

# 2. 安装 dnsx（DNS工具）
go install -v github.com/projectdiscovery/dnsx/cmd/dnsx@latest

# 3. 安装 httpx（HTTP探测工具）
go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest

# 4. 安装 nuclei（漏洞扫描器）
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# 5. nmap 通常系统自带，或通过包管理器安装
# Ubuntu/Debian: sudo apt install nmap
# CentOS/RHEL: sudo yum install nmap
# macOS: brew install nmap
# Windows: 从 https://nmap.org/download.html 下载
```

#### 3.3 完整资产发现流程

```bash
# ====== 步骤一：子域名发现 ======

# 使用 subfinder 发现子域名
subfinder -d example.com -o subdomains.txt

# 查看发现结果
cat subdomains.txt
# www.example.com
# mail.example.com
# api.example.com
# admin.example.com
# dev.example.com
# ...

# 也可以使用多个工具组合提高覆盖率
# 方案1: subfinder + amass + 证书透明度
# 方案2: OneForAll（国内综合工具，覆盖更多国内数据源）

# ====== 步骤二：DNS解析验证 ======

# 使用 dnsx 验证子域名是否解析
dnsx -l subdomains.txt -a -aaaa -cname -resp -o resolved.txt

# 筛选出解析成功的域名
cat resolved.txt | grep -E "\[A\]" | awk '{print $1}' > alive_subdomains.txt

# ====== 步骤三：HTTP服务探测 ======

# 使用 httpx 探测HTTP/HTTPS服务
httpx -l alive_subdomains.txt \
  -title \
  -tech-detect \
  -status-code \
  -content-length \
  -web-server \
  -o http_results.txt

# 查看探测结果
cat http_results.txt

# ====== 步骤四：端口扫描 ======

# 从 httpx 结果中提取IP列表
cat http_results.txt | grep -oP '\d+\.\d+\.\d+\.\d+' | sort -u > ips.txt

# 使用 nmap 扫描（先扫描Top 1000端口，再对关键IP全端口扫描）
nmap -iL ips.txt --top-ports 1000 -oA nmap_top1000

# 对Web服务器IP做全端口扫描
nmap -iL web_ips.txt -p- --min-rate 1000 -oA nmap_full

# ====== 步骤五：漏洞扫描 ======

# 使用 nuclei 进行漏洞扫描
# 先更新 nuclei 模板库
nuclei -update-templates

# 对发现的HTTP服务进行漏洞扫描
nuclei -l http_results.txt \
  -severity critical,high,medium \
  -o nuclei_results.txt

# 查看高危漏洞
cat nuclei_results.txt | grep -E "critical|high"

# ====== 步骤六：生成报告 ======

# 汇总所有结果，生成暴露面分析报告
echo "=== 资产发现报告 ===" > report.txt
echo "发现时间: $(date)" >> report.txt
echo "" >> report.txt
echo "=== 子域名统计 ===" >> report.txt
echo "发现子域名总数: $(wc -l < subdomains.txt)" >> report.txt
echo "存活子域名数: $(wc -l < alive_subdomains.txt)" >> report.txt
echo "" >> report.txt
echo "=== 端口统计 ===" >> report.txt
echo "开放端口总数: $(grep -c 'open' nmap_top1000.gnmap)" >> report.txt
echo "" >> report.txt
echo "=== 漏洞统计 ===" >> report.txt
echo "严重漏洞: $(grep -c 'critical' nuclei_results.txt)" >> report.txt
echo "高危漏洞: $(grep -c 'high' nuclei_results.txt)" >> report.txt
echo "中危漏洞: $(grep -c 'medium' nuclei_results.txt)" >> report.txt
```

#### 3.4 工具组合最佳实践

| 阶段 | 推荐工具组合 | 说明 |
|:---|:---|:---|
| 子域名发现 | subfinder + OneForAll + amass | 多工具交叉验证，提高覆盖率 |
| DNS解析 | dnsx + massdns | 快速解析+验证 |
| HTTP探测 | httpx | 功能最全的HTTP探测工具 |
| 端口扫描 | nmap (精确) + masscan (快速) | 先用masscan快速过一遍，再用nmap精确扫 |
| 指纹识别 | httpx + whatweb + wappalyzer | 多维度指纹识别 |
| 漏洞扫描 | nuclei (通用) + xray (Web) | nuclei覆盖范围广，xray擅长Web漏洞 |
| 可视化 | aquatone (截图) | 自动截图所有Web页面，快速review |

---

## 🔧 动手实操

### 实操一：子域名发现练习

```bash
# 选择一个测试目标（建议用自己的域名或授权的测试环境）
TARGET="example.com"

# 1. 使用 subfinder
subfinder -d $TARGET -o subfinder_results.txt

# 2. 查看证书透明度日志
curl -s "https://crt.sh/?q=%25.${TARGET}&output=json" | \
  jq -r '.[].name_value' | \
  sort -u > crtsh_results.txt

# 3. 使用 Google Dork（浏览器中）
# site:example.com -www.example.com

# 4. 合并去重
cat subfinder_results.txt crtsh_results.txt | sort -u > all_subdomains.txt
echo "总共发现 $(wc -l < all_subdomains.txt) 个子域名"
```

### 实操二：nmap端口扫描练习

```bash
# 注意：仅在授权的目标上操作！
# 可以在本地搭建测试环境：docker run -d -p 8080:80 nginx

# 扫描本地测试目标
nmap -sV -p 8080 localhost

# 扫描常用端口
nmap -sS --top-ports 100 scanme.nmap.org

# 服务版本探测
nmap -sV scanme.nmap.org

# 操作系统探测
nmap -O scanme.nmap.org

# 导出XML格式结果
nmap -sV -oX scan_results.xml scanme.nmap.org
```

### 实操三：nuclei漏洞扫描练习

```bash
# 1. 安装 nuclei
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# 2. 更新模板库
nuclei -update-templates

# 3. 列出可用的模板
nuclei -tl  # 列出所有模板

# 4. 对单个目标扫描
nuclei -u https://example.com -severity critical,high

# 5. 对多个目标批量扫描
nuclei -l targets.txt -severity critical,high -o results.txt

# 6. 使用特定模板
nuclei -u https://example.com -t cves/ -t exposures/
```

---

## 📝 知识速查表

### 资产测绘工具速查

| 工具 | 用途 | 语言 | 特点 |
|:---|:---|:---|:---|
| subfinder | 子域名发现 | Go | 被动收集，速度快 |
| amass | 子域名发现 | Go | 功能最全，主动+被动 |
| OneForAll | 子域名发现 | Python | 国内数据源丰富 |
| dnsx | DNS工具 | Go | 快速批量DNS查询 |
| massdns | DNS解析 | C | 超高性能DNS解析 |
| nmap | 端口扫描 | C/C++ | 最经典，功能最全 |
| masscan | 端口扫描 | C | 极速全互联网扫描 |
| httpx | HTTP探测 | Go | 功能丰富的HTTP工具 |
| whatweb | Web指纹 | Ruby | Web技术栈识别 |
| nuclei | 漏洞扫描 | Go | 模板化，社区活跃 |
| xray | Web漏洞扫描 | Go | 国内工具，Web专精 |
| aquatone | 截图可视化 | Go | 自动截图Web页面 |

### 磐云产品速查

| 组件 | 类型 | 解决什么问题 | 部署方式 | 适用场景 |
|:---|:---|:---|:---|:---|
| CBH | 云堡垒机 | 运维审计、操作录像 | SaaS | 等保合规、运维管理 |
| CWPP | 云工作负载保护 | 主机安全、入侵检测 | Agent+SaaS | 混合云环境主机安全 |
| WAF | Web应用防火墙 | Web攻击防护 | 反向代理/SaaS | Web应用安全防护 |

---

## ✅ 今日验收标准

- [ ] 能画出360磐云的产品体系图
- [ ] 能解释CBH/CWPP/WAF各自的核心功能
- [ ] 能独立完成subfinder子域名发现
- [ ] 能使用nmap进行端口扫描并理解输出
- [ ] 理解资产测绘四大步骤的技术原理
- [ ] 能搭建subfinder+nmap+nuclei开源资产发现链路
- [ ] 能编写一份基础的暴露面分析报告
- [ ] 理解资产测绘在护网中的关键价值

---

## 💡 常见误区与避坑指南

### 误区1：资产测绘做一次就够了

**真相**：资产是动态变化的。新业务上线、开发测试环境暴露、人员变更都可能导致新的暴露面。资产测绘应该是持续进行的过程，建议每周至少一次。

### 误区2：nmap扫描所有端口太慢，没必要

**真相**：攻击者不会只扫Top 1000端口。很多高危服务运行在非标准端口（如Redis在16379、Jenkins在18080）。条件允许的情况下，至少对关键IP做一次全端口扫描。

### 误区3：磐云SaaS化就不安全

**真相**：SaaS化不意味着不安全，而是安全责任模型的变化。关键是选择可信的厂商，理解数据流向，评估合规要求。

### 误区4：子域名发现=资产测绘

**真相**：子域名发现只是资产测绘的第一步。完整的资产测绘还包括端口扫描、服务识别、指纹分析、漏洞评估。只有全部完成，才能说对暴露面有全面了解。

### 误区5：工具跑一遍就行了，不需要分析结果

**真相**：工具只是手段，分析才是价值。拿到nmap和nuclei的结果后，需要人工分析：哪些是业务需要的？哪些是历史遗留？哪些是配置错误？然后制定优先级进行修复。

---

## 📚 延伸阅读

1. **360磐云资源**
   - 360磐云产品官网
   - 磐云用户手册
   - 360云安全白皮书

2. **资产测绘工具文档**
   - subfinder官方文档（GitHub）
   - nmap官方文档（nmap.org/book）
   - nuclei模板编写指南
   - ProjectDiscovery工具套件

3. **技术文章**
   - 攻击面管理（ASM）最佳实践
   - 互联网暴露面测绘方法论
   - 证书透明度日志在资产发现中的应用

4. **相关标准**
   - OWASP Attack Surface Analysis Cheat Sheet
   - NIST SP 800-53 资产管理控制
   - CIS Controls 1&2：资产与软件清单

5. **练习建议**
   - 在授权环境下完整执行一次资产发现链路
   - 用subfinder+nmap+nuclei扫描自己的测试环境
   - 编写一份资产发现标准操作流程（SOP）
   - 对比不同工具在资产发现中的覆盖率和准确度

---

> **今日小结**：360磐云代表了安全产品SaaS化的趋势——降低部署门槛、持续云端更新、按需弹性扩展。而资产测绘是安全建设的第一步——你不知道自己有什么，就不知道需要保护什么。subfinder+nmap+nuclei这条开源工具链，是每个安全从业者都应该掌握的基本功。明天我们将学习360威胁情报和DNS安全检测能力。

---

*Day 16 完成 | 下一日：360威胁情报 & DNS安全*

---

## 🧪 360阶段总结：三级产品体系全景回顾

### 360完整产品矩阵图
```
                    360安全产品体系
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   ┌────────┐      ┌────────┐      ┌──────────┐
   │终端安全│      │安全运营│      │云安全SaaS│
   └───┬────┘      └───┬────┘      └────┬─────┘
       │               │               │
   ┌───┴─────┐    ┌────┴─────┐    ┌───┴──────┐
   │安全卫士  │    │本地安全  │    │磐云      │
   │(个人版)  │    │大脑      │    │(云安全)  │
   │          │    │(SOC)     │    │          │
   │企业安全云│    │          │    │资产测绘  │
   │(SaaS版)  │    │360天擎   │    │(ZoomEye) │
   │          │    │(EDR联动) │    │          │
   │360天擎   │    │          │    │DNS安全   │
   │(私有部署)│    │威胁情报  │    │(360DNS)  │
   └─────────┘    └──────────┘    └──────────┘
```

### 360四天学习回顾：自检清单
| Day | 主题 | 核心知识点 | 掌握度(/10) |
|:---|:---|:---|:---:|
| Day 14 | 360安全卫士/天擎 | 四大引擎+三级产品体系 | /10 |
| Day 15 | 360本地安全大脑 | SOC架构+云地联动+AI分析 | /10 |
| Day 16 | 360磐云+资产测绘 | SaaS安全+资产发现工具链 | /10 |
| Day 17 | 360威胁情报+DNS安全 | 情报数据优势+DNS攻防 | /10 |

### 360 vs 奇安信 终端安全领域大决战
| 维度 | 360天擎 | 奇安信天擎 | 评论 |
|:---|:---|:---|:---|
| 共同点 | 名称相同！ | 都是"天擎" | 历史原因(分家前同一产品) |
| 数据优势 | 17亿终端 | 政企专精 | 360数据量大，奇安信政企样本好 |
| 引擎技术 | 四大引擎(云+本地) | 自研引擎 | 360引擎更多样化 |
| 政企适配 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 奇安信信创支持更全 |
| 护网经验 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 奇安信护网参与度更高 |
| 价格 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 360性价比更好 |
| 云端能力 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 360云端数据反哺更强 |

### 360四天学习精华速记卡
```
Day 14（终端）：四级体系（卫士→企业安全云→天擎→安全大脑）
Day 15（运营）：云地联动（云端数据+本地分析+终端可见）
Day 16（SaaS）：磐云+资产测绘，SaaS化安全服务
Day 17（情报）：17亿终端数据→全球最大威胁情报网
```

### 360四天学习精华速记卡
```
Day 14（终端）：四级体系（卫士→企业安全云→天擎→安全大脑）
Day 15（运营）：云地联动（云端数据+本地分析+终端可见）
Day 16（SaaS）：磐云+资产测绘，SaaS化安全服务
Day 17（情报）：17亿终端数据→全球最大威胁情报网
```

### 360 vs 奇安信终端安全对比
| 维度 | 360天擎 | 奇安信天擎 | 评论 |
|:---|:---|:---|:---|
| 数据优势 | 17亿终端 | 政企专精 | 360量大，奇安信质好 |
| 引擎 | 四大引擎 | 自研引擎 | 360更丰富 |
| 政企适配 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 奇安信信创更全 |
| 护网经验 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 奇安信参与度更高 |
| 价格 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 360性价比好 |

### 360完整产品矩阵
```
              360安全产品体系
                   │
      ┌────────────┼────────────┐
      ▼            ▼            ▼
 ┌────────┐  ┌────────┐  ┌──────────┐
 │终端安全│  │安全运营│  │云安全SaaS│
 └───┬────┘  └───┬────┘  └────┬─────┘
     │           │            │
 ┌───┴─────┐ ┌──┴──────┐ ┌───┴──────┐
 │安全卫士  │ │本地安全 │ │磐云      │
 │企业安全云│ │大脑(SOC)│ │资产测绘  │
 │360天擎  │ │360天擎  │ │DNS安全   │
 └─────────┘ └─────────┘ └──────────┘
```

### 360四天学习精华速记
```
Day 14（终端）：四级体系（卫士→企业安全云→天擎→安全大脑）
Day 15（运营）：云地联动（云端数据+本地分析+终端可见）
Day 16（SaaS）：磐云+资产测绘，SaaS化安全服务
Day 17（情报）：17亿终端数据→全球最大威胁情报网
```

### 360 vs 奇安信 终端安全终极对比
```
共同点：
- 产品名都叫"天擎"（分家前同一产品线）
- 都提供EPP+EDR一体化能力
- 都支持私有化和SaaS两种部署

差异点：
- 数据：360 17亿终端 vs 奇安信政企专精样本
- 引擎：360四大引擎 vs 奇安信自研引擎
- 信创：奇安信适配更全面
- 护网：奇安信参与度和口碑更高
- 价格：360性价比更优
- 云端：360云端数据反哺更强

选型建议：
- 政企护网场景 → 奇安信天擎
- SMB性价比 → 360天擎/360企业安全云
- 最佳组合 → 两者互补使用
```

### 360资产测绘工具链实战
```
攻击面管理三步法：
1. 资产发现
   subfinder -d example.com → 发现子域名
   amass enum -d example.com → 深度枚举
   fofa/ZoomEye查询 → 网络空间搜索引擎

2. 端口扫描
   nmap -sS -p- --open -oA scan_result target_ips
   masscan -p1-65535 --rate=10000 target_range

3. 漏洞验证
   nuclei -t templates/ -l live_hosts.txt → 批量漏洞检测
   高危漏洞优先验证（RCE/SQL注入/文件上传）
```

### 360磐云SaaS安全服务体系
```
磐云 = 360的SaaS安全能力平台
提供云端免部署的安全服务：
├─ 云WAF → SaaS化Web防护（DNS改指向即用）
├─ 云抗DDoS → 云端流量清洗（T级防护）
├─ 云漏扫 → SaaS化漏洞扫描（无需部署扫描器）
├─ 云等保 → 等保合规评估服务
└─ 云日志审计 → 云端日志采集与分析

优势：零部署/免运维/按年订阅
适合：SMB/多分支机构/预算有限的企业
```

### 360 Day 16 自测卡
| 考核维度 | 分值 | 自评 |
|:---|:---:|:---:|
| 攻击面管理三工具链 | 25 | /25 |
| 磐云SaaS服务体系 | 25 | /25 |
| 360 vs 奇安信终端对比 | 25 | /25 |
| 360完整产品矩阵 | 25 | /25 |
| **总分** | **100** | **/100** |

### Day 16 360 SaaS安全核心记忆
```
"磐云=SaaS化安全能力(免部署)+资产测绘(管攻击面)
360 vs 奇安信终端：360数据量大+性价比，奇安信信创全+护网强"
```

### Day 16 核心收获小结
> SaaS安全是360的差异化赛道——磐云让SMB企业也能获得企业级安全能力。资产测绘工具链(subfinder+nmap+nuclei)是每个安全工程师的基本功。

### Day 16 速记口令
> "磐云 = 免部署安全(SaaS化) + 资产测绘(攻击面管理) → SMB的360入口"

### Day 16 结语速记
> 360 SaaS安全 = SMB的企业级安全能力入口。不用买设备、不用运维、按年订阅，就能获得WAF/DDoS/漏扫等能力。

---
