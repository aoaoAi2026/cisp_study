# Nuclei 模板化快速漏洞扫描器完全指南

> 分类：工具指南 | 难度：进阶 | 阅读时间：约40分钟

## 概述

Nuclei 是由 ProjectDiscovery 团队开发的基于 YAML 模板的快速漏洞扫描器。它将漏洞检测逻辑编写为可复用的 YAML 模板（Template），通过模板引擎向目标发送 HTTP/DNS/TCP/SSL 等协议的探测请求，并根据响应判断漏洞是否存在。Nuclei 以其极高的速度、庞大的社区模板生态（5000+）、CI/CD 友好性，已成为现代渗透测试和自动化漏洞扫描的核心工具。

**核心特性**：
- 基于 YAML 模板，易于编写和共享
- 内置 HTTP/DNS/TCP/SSL/WebSocket/Network/File/JavaScript/Code 八种协议
- 社区模板库：https://github.com/projectdiscovery/nuclei-templates（5000+）
- 支持工作流（Workflow）模板
- 支持条件匹配、提取器、变量
- CI/CD 集成友好

## 核心知识点

- Nuclei 安装与模板库管理
- 基础扫描与高级过滤
- YAML 模板语法与编写
- 八种协议详解
- 工作流模板
- 与其他 ProjectDiscovery 工具的配合

---

## 一、安装

```bash
# Kali Linux
sudo apt install nuclei -y

# Go 安装
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# macOS
brew install nuclei

# Docker
docker pull projectdiscovery/nuclei

# 验证
nuclei -version

# 下载/更新模板库
nuclei -update-templates
# 模板默认保存在 ~/nuclei-templates/
```

---

## 二、基础扫描

### 2.1 基本命令

```bash
# 扫描单目标
nuclei -u http://target.com

# 扫描目标列表
nuclei -l targets.txt

# 使用特定模板
nuclei -u http://target.com -t cves/ -t exposures/

# 使用特定标签
nuclei -u http://target.com -tags cve,oast

# 排除标签
nuclei -u http://target.com -etags dos,fuzz

# 指定严重度
nuclei -u http://target.com -severity critical,high,medium

# 指定作者
nuclei -u http://target.com -author geeknik

# 并发控制
nuclei -l targets.txt -c 50

# 速率限制
nuclei -l targets.txt -rl 100        # 每秒 100 请求
nuclei -l targets.txt -rlm 10        # 每分钟 10 请求
```

### 2.2 输出格式

```bash
# JSON 输出
nuclei -u http://target.com -json -o results.json

# JSON Lines（适合管道处理）
nuclei -u http://target.com -jsonl -o results.jsonl

# Markdown 报告
nuclei -u http://target.com -me report_dir

# 实时输出
nuclei -u http://target.com -silent
```

---

## 三、模板库使用

### 3.1 模板目录结构

```
~/nuclei-templates/
├── cves/            # CVE 漏洞检测
├── exposures/       # 信息暴露（.git、.env、备份文件）
├── vulnerabilities/ # 通用漏洞（XSS、SQLi、SSRF）
├── misconfiguration/# 配置错误
├── technologies/    # 技术栈识别
├── dns/             # DNS 相关
├── default-logins/  # 默认凭证
├── exposures/       # 信息泄露
├── fuzzing/         # 模糊测试
├── iot/             # IoT 设备
├── file/            # 文件相关漏洞
├── headless/        # 浏览器自动化检测
├── network/         # 网络协议检测
├── ssl/             # TLS/SSL 检测
└── workflows/       # 工作流模板
```

### 3.2 按分类扫描

```bash
# CVE 检测
nuclei -u http://target.com -t cves/

# 信息泄露
nuclei -u http://target.com -t exposures/

# 技术栈识别
nuclei -u http://target.com -t technologies/

# 全量扫描
nuclei -u http://target.com -t ~/nuclei-templates/

# CVSS 评分过滤
nuclei -u http://target.com -severity critical,high

# 仅检测有新公开漏洞利用的
nuclei -u http://target.com -ep

# 仅检测特定年份 CVE
nuclei -u http://target.com -t cves/2024/
```

---

## 四、YAML 模板编写

### 4.1 基础模板结构

```yaml
id: example-template

info:
  name: 示例漏洞检测
  author: 分析师名
  severity: medium
  description: |
    这是一个示例模板
  reference:
    - https://example.com/
  tags: example,test
  metadata:
    max-request: 1

requests:
  - method: GET
    path:
      - "{{BaseURL}}/admin"
    matchers:
      - type: word
        words:
          - "Admin Panel"
```

### 4.2 matchers（匹配器）

```yaml
# 单词匹配
matchers:
  - type: word
    words:
      - "vulnerable"
      - "root:"
    condition: and/or

# 状态码匹配
matchers:
  - type: status
    status:
      - 200
      - 301

# 正则匹配
matchers:
  - type: regex
    regex:
      - "SQL syntax"
      - "mysql_fetch"

# 响应大小
matchers:
  - type: dsl
    dsl:
      - "len(body) > 0"

# 组合匹配
matchers-condition: and
matchers:
  - type: status
    status:
      - 200
  - type: word
    words:
      - "Dashboard"
```

### 4.3 extractors（提取器）

```yaml
extractors:
  - type: regex
    name: version
    regex:
      - "Version: ([0-9.]+)"
    group: 1

  - type: kval  # Key-Value
    kval:
      - "server"
```

### 4.4 高级请求

```yaml
# POST 请求
requests:
  - method: POST
    path:
      - "{{BaseURL}}/api/login"
    headers:
      Content-Type: application/json
    body: |
      {"username":"admin","password":"{{password}}"}

# 多步请求
requests:
  - raw:
      - |
        GET /login HTTP/1.1
        Host: {{Hostname}}

      - |
        POST /login HTTP/1.1
        Host: {{Hostname}}
        Content-Type: application/x-www-form-urlencoded

        username=admin&password=test
```

---

## 五、模板编写实战

### 5.1 简单 CVE 检测

```yaml
id: CVE-2021-44228

info:
  name: Apache Log4j RCE
  author: 分析师
  severity: critical
  description: Log4j JNDI injection vulnerability
  tags: cve,cve2021,log4j,rce

requests:
  - method: GET
    path:
      - '{{BaseURL}}'
    headers:
      X-Forwarded-For: '${jndi:ldap://{{interactsh-url}}}'
    matchers:
      - type: word
        part: interactsh_protocol
        words:
          - 'dns'
```

### 5.2 信息泄露检测

```yaml
id: env-file-exposure

info:
  name: .env File Exposure
  author: 分析师
  severity: high
  tags: exposures,config

requests:
  - method: GET
    path:
      - '{{BaseURL}}/.env'
      - '{{BaseURL}}/.env.backup'
      - '{{BaseURL}}/.env.production'
    matchers:
      - type: word
        words:
          - 'APP_KEY='
          - 'DB_PASSWORD='
```

---

## 六、与其他工具配合

```bash
# subfinder → 子域名 → httpx → 存活检测 → nuclei → 漏洞扫描
subfinder -d target.com | httpx | nuclei -t cves/

# naabu → 端口扫描 → nuclei network 模板
naabu -host target.com | nuclei -t network/

# 自定义集成管线
subfinder -d target.com -silent | \
    httpx -silent | \
    nuclei -t ~/nuclei-templates/cves/ -severity critical,high

# nuclei + interactsh（带外检测）
nuclei -u http://target.com -t cves/ -iserver https://your-interactsh-server
```

---

## 七、自动化与 CI/CD

```bash
# GitHub Actions
- name: Nuclei Scan
  run: |
    nuclei -u https://staging.example.com \
      -t ~/nuclei-templates/ \
      -severity critical,high \
      -json -o nuclei_report.json

# 定时扫描
# crontab: 0 2 * * * nuclei -l targets.txt -t cves/ -json -o daily_$(date +%Y%m%d).json
```

---

## 八、速查卡

```
安装:              go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
更新模板:          nuclei -update-templates
扫描单目标:        nuclei -u URL
扫描列表:          nuclei -l targets.txt
指定模板:          -t path/to/templates/
指定标签:          -tags cve,oast
排除标签:          -etags dos
指定严重度:        -severity critical,high,medium
并发控制:          -c 50
速率限制:          -rl 100 -rlm 10
JSON输出:          -json -o results.json
静默模式:          -silent
调试模式:          -debug
验证模板:          nuclei -validate -t template.yaml

模板仓库:          https://github.com/projectdiscovery/nuclei-templates
搭配使用:          subfinder → httpx → nuclei
```

---

## 九、YAML 模板语法深度解析

### 9.1 模板结构

```yaml
id: CVE-2024-XXXXX                  # 唯一模板 ID

info:
  name: 漏洞名称
  author: 作者
  severity: critical|high|medium|low|info
  description: 漏洞描述
  reference:
    - https://cve.mitre.org/
    - https://nvd.nist.gov/
  tags: cve,oast,rce

# HTTP 协议探测
requests:
  - method: GET|POST|PUT|DELETE|PATCH
    path:
      - "{{BaseURL}}/vulnerable/endpoint"
    
    headers:
      User-Agent: Mozilla/5.0
    
    body: |
      {"key": "value"}
    
    # 匹配条件（AND逻辑）
    matchers-condition: and
    matchers:
      - type: word
        words:
          - "vulnerable"
          - "root:"
        condition: or                 # words 内是 OR 逻辑
    
      - type: status
        status:
          - 200
    
      - type: regex
        regex:
          - "admin.*password"
    
    # 提取器
    extractors:
      - type: regex
        name: extracted_password
        regex:
          - "password['\"]\\s*:\\s*['\"](.*)['\"]"
```

### 9.2 匹配器（Matchers）类型

| 类型 | 说明 | 示例 |
|:---|:---|:---|
| **word** | 关键字匹配 | `words: ["admin", "root:"]` |
| **status** | HTTP 状态码 | `status: [200, 201]` |
| **size** | 响应大小（字节）| `size: [1024, 2048]` |
| **regex** | 正则表达式 | `regex: ["(?i)error"]` |
| **binary** | 二进制匹配 | 十六进制内容 |
| **dsl** | 数学表达式 | `dsl: ["len(body)>1000"]` |

### 9.3 匹配条件组合

```yaml
# AND 条件：所有匹配器都要满足
matchers-condition: and
matchers:
  - type: word
    words: ["success"]
  - type: status
    status: [200]

# OR 条件：任一匹配器满足即命中
matchers-condition: or
matchers:
  - type: word
    words: ["root:x:0:0"]
  - type: word
    words: ["uid=0(root)"]
```

### 9.4 变量与辅助函数

```yaml
# 内置变量
{{BaseURL}}          # 目标 URL
{{Hostname}}         # 目标主机名
{{Host}}             # 目标主机
{{Port}}             # 目标端口
{{Path}}             # 目标路径
{{randstr}}          # 随机字符串
{{rand_int(1000,9999)}}  # 随机整数

# 辅助函数
{{hex_encode("test")}}   # 十六进制编码
{{base64("test")}}       # Base64 编码
{{md5("test")}}          # MD5哈希
{{sha1("test")}}         # SHA1哈希
{{reverse("hello")}}     # 字符串反转
{{date_time("%Y-%m-%d")}} # 当前日期

# 自定义动态值
variables:
  oast: "{{randstr}}.oast.live"
```

### 9.5 请求管道（Pipelines）

```yaml
requests:
  # 步骤1：获取 CSRF Token
  - method: GET
    path:
      - "{{BaseURL}}/login"
    extractors:
      - type: regex
        name: csrf_token
        regex:
          - 'name="csrf_token" value="([^"]+)"'
  
  # 步骤2：使用提取的 Token 提交
  - method: POST
    path:
      - "{{BaseURL}}/change-password"
    body: |
      csrf_token={{csrf_token}}&password=newpass
    
    matchers:
      - type: word
        words: ["password changed"]
```

---

## 十、DNS / TCP / SSL 协议模板

### 10.1 DNS 模板

```yaml
id: dns-caa-misconfig
info:
  name: DNS CAA Record Check
  severity: info
  tags: dns,caa

dns:
  - name: "{{FQDN}}"
    type: CAA
    class: INET
    
    matchers:
      - type: word
        words:
          - "IN\tCAA"
        negative: true      # 不存在 CAA 记录=问题
```

### 10.2 TCP 模板

```yaml
id: tcp-mysql-detect
info:
  name: MySQL Service Detection
  severity: info
  tags: network,tcp,mysql

tcp:
  - host:
      - "{{Hostname}}"
    port: 3306
    inputs:
      - data: ""            # 空输入获取 banner
    
    matchers:
      - type: regex
        regex:
          - "MySQL\\s[\\d.]+"
    
    extractors:
      - type: regex
        regex:
          - "MySQL\\s([\\d.]+)"
```

### 10.3 SSL/TLS 模板

```yaml
id: ssl-expired-cert
info:
  name: SSL Expired Certificate
  severity: low
  tags: ssl,tls

ssl:
  - address: "{{Hostname}}:443"
    
    matchers:
      - type: dsl
        dsl:
          - "not_before > date_time() || not_after < date_time()"
```

---

## 十一、工作流（Workflow）模板

### 11.1 基础工作流

```yaml
id: wordpress-full-workflow
info:
  name: WordPress Suite
  severity: medium
  tags: workflow

workflows:
  # 模板列表：按顺序执行
  - template: technologies/wordpress-detect.yaml
  - template: cves/2024/CVE-2024-XXXXX.yaml
  - template: vulnerabilities/wordpress-plugins.yaml
  - template: misconfiguration/wordpress-debug-log.yaml
  - template: exposures/wordpress-backup-files.yaml

# 条件工作流
  - template: cves/2024/CVE-2024-YYYYY.yaml
    # 仅在前面模板检测到特定匹配后执行
```

### 11.2 条件执行

```yaml
workflows:
  - template: detect-apache.yaml
  - template: cves/apache-struts2.yaml
    matchers:
      - type: word
        words: ["apache"]
    subtemplates:
      - template: cves/apache-httpd-cves.yaml
      - template: misconfig/apache-config.yaml
```

---

## 十二、实战场景扩展

### 场景六：API 安全扫描

```bash
# 扫描 OpenAPI/Swagger 端点
nuclei -u https://api.target.com -t ~/nuclei-templates/exposures/apis/

# 使用自定义模板
nuclei -u https://api.target.com \
  -t api-templates/ \
  -severity critical,high

# 扫描 GraphQL 端点
nuclei -u https://api.target.com/graphql \
  -t ~/nuclei-templates/technologies/graphql-detect.yaml
```

### 场景七：CVE-2024 批量检测

```bash
# 对资产列表检测最新 CVE
nuclei -l assets.txt \
  -t ~/nuclei-templates/cves/2024/ \
  -severity critical,high \
  -json -o cve2024_scan.json \
  -stats -stats-interval 60

# 输出受影响列表
cat cve2024_scan.json | jq -r 'select(.info.severity=="critical") | "\(.host) - \(.info.name)"'
```

### 场景八：子域名接管检测

```bash
# 先收集子域名
subfinder -d target.com | sort -u > subdomains.txt

# 检测子域名接管
nuclei -l subdomains.txt \
  -t ~/nuclei-templates/dns/ \
  -t ~/nuclei-templates/takeovers/ \
  -o takeover_results.txt

# 重点关注的结果
grep -E "critical|high" takeover_results.txt
```

### 场景九：CI/CD 管道集成

```yaml
# .github/workflows/nuclei-scan.yml
name: Daily Nuclei Scan
on:
  schedule:
    - cron: '0 6 * * *'   # 每天 6:00 UTC
  workflow_dispatch:

jobs:
  nuclei-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Nuclei
        run: |
          go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
      - name: Update Templates
        run: nuclei -update-templates
      - name: Run Scan
        run: |
          nuclei -l targets.txt \
            -t ~/nuclei-templates/ \
            -severity critical,high,medium \
            -json -o nuclei_report.json
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: nuclei-report
          path: nuclei_report.json
```

### 场景十：与被动扫描结合

```bash
# 先被动收集
amass enum -d target.com -o amass_domains.txt
subfinder -d target.com -o subfinder_domains.txt
cat amass_domains.txt subfinder_domains.txt | sort -u > all_domains.txt

# 检测活跃的 Web 服务
cat all_domains.txt | httpx -o live_targets.txt

# Nuclei 扫描
nuclei -l live_targets.txt \
  -t ~/nuclei-templates/ \
  -severity critical,high \
  -stats -o nuclei_results.txt
```

---

## 十三、高级技巧

### 13.1 排除误报

```yaml
# 使用 matchers 排除开发/测试环境
matchers-condition: and
matchers:
  - type: word
    words:
      - "root:"
  - type: status
    status:
      - 200
  - type: word
    words:
      - "staging"
      - "test"
      - "dev"
    negative: true       # 不匹配包含这些词的结果
```

### 13.2 自定义速率与并发

```bash
# 精细化控制
nuclei -l targets.txt \
  -c 30 \                     # 30 模板并发
  -bs 50 \                    # 50 个目标批量处理
  -rl 150 \                   # 每秒 150 请求
  -rlm 500 \                  # 每分钟 500 请求
  -timeout 10 \               # 10 秒超时
  -retries 2                  # 重试 2 次
```

### 13.3 Headless 浏览器模板

```yaml
id: javascript-xss-detection
info:
  name: JavaScript XSS Detection
  severity: medium
  tags: xss,headless

headless:
  - steps:
      - action: navigate
        args:
          url: "{{BaseURL}}"
      
      - action: waitload
      
      - action: extract
        args:
          target: "document.title"
      
      - action: script
        args:
          code: |
            var xss = document.querySelector('#xss');
            return xss ? xss.innerHTML : '';
    
    matchers:
      - type: word
        words:
          - "alert(1)"
```

---

## 十四、模板仓库管理

```bash
# 管理模板
nuclei -update-templates                    # 更新所有模板
nuclei -update-templates -ud /custom/path   # 自定义路径

# 查看模板统计
nuclei -tl                                  # 列出所有模板
nuclei -tl -severity critical               # 仅严重模板
nuclei -tl -tags cve | wc -l               # CVE 模板数量

# 模板验证
nuclei -validate -t my_template.yaml

# 分类管理
# 按需下载特定分类
nuclei -ut -update-directory cves           # 仅更新 CVE 模板
nuclei -ut -update-directory exposures      # 仅更新暴露面板
```

---

## 十五、与其他 ProjectDiscovery 工具集成

```bash
# 完整侦察流水线
subfinder -d target.com | \          # 子域名发现
  dnsx -resp-only | \                # DNS 解析
  httpx -status-code -title | \      # Web 服务探测
  nuclei -t ~/nuclei-templates/      # 漏洞扫描

# 一线式被动+主动扫描
subfinder -d target.com -silent | \
  naabu -p 80,443,8080,8443 | \      # 端口扫描
  httpx -silent | \
  nuclei -t ~/nuclei-templates/ \
    -severity critical,high \
    -stats -silent

# 结果可视化
# nuclei → JSON → Python 脚本 → HTML 报告
```

---

## 十六、安全与合规提示

1. **Nuclei 扫描会发送真实请求**，未经授权的扫描可能违反法律
2. **生产环境谨慎扫描**：-severity critical 优先，避免 DOS 模板
3. **速率限制**：使用 -rl 和 -rlm 避免影响目标
4. **排除危险模板**：`-etags dos,intrusive` 排除破坏性测试
5. **结果保密**：扫描结果含漏洞信息，妥善保存
6. **合规使用**：仅对有书面授权的目标使用

---

> 📖 本文为"网安百宝箱"课程配套读物。更新于 2026-06-18
