# Nikto Web 服务器扫描器完全指南

> 分类：工具指南 | 难度：入门→进阶 | 阅读时间：约40分钟

## 概述

Nikto 是一个开源的 Web 服务器扫描器，能够对 Web 服务器进行全面测试以发现潜在的安全漏洞、配置错误和不安全的文件/程序。它由 Chris Sullo 和 David Lodge 开发，内置超过 6,700 个危险文件/CGI 检测项、1,250 个过时版本检测、270 个服务器配置问题检测。Nikto 虽然不如专业的 Web 漏洞扫描器（如 Burp Scanner、Acunetix）覆盖面广，但作为快速初筛和信息收集工具，它仍然非常高效实用。

**核心检测能力**：
- 服务器和软件版本信息识别
- 危险文件/目录检测（备份文件、配置文件、管理后台）
- 已知漏洞的 CGI/脚本检测
- 服务器配置错误（不安全的 Header、目录列表、HTTP 方法）
- 过时软件版本识别

## 核心知识点

- Nikto 基础扫描与输出格式
- 认证扫描（Basic Auth / Cookie）
- 代理与隧道扫描
- 结果解读与误报处理
- 与其他扫描器（Gobuster/dirsearch/WhatWeb）的配合
- 自定义数据库与插件

---

## 一、安装

```bash
# Kali Linux（预装）
sudo apt update && sudo apt install nikto -y

# Ubuntu/Debian
sudo apt install nikto -y

# macOS
brew install nikto

# 从源码安装
git clone https://github.com/sullo/nikto.git
cd nikto/program
perl nikto.pl -Version

# 更新数据库
sudo nikto -update
```

---

## 二、基础使用

### 2.1 标准扫描

```bash
# 基础扫描（默认端口80）
nikto -h http://target.com

# 指定端口
nikto -h http://target.com -p 8080

# HTTPS 扫描
nikto -h https://target.com -ssl

# 非标准 SSL 端口
nikto -h https://target.com -p 8443

# 多个端口
nikto -h http://target.com -p 80,443,8080,8443

# 从文件批量扫描
nikto -h targets.txt
```

### 2.2 输出格式

```bash
# 保存为文本
nikto -h http://target.com -o scan.txt

# HTML 报告
nikto -h http://target.com -o scan.html -Format html

# CSV 格式
nikto -h http://target.com -o scan.csv -Format csv

# XML 格式
nikto -h http://target.com -o scan.xml -Format xml

# 详细输出（-Display）
# 1=Show redirects, 2=Show cookies received
# 3=Show all 200/OK, 4=Show URLs which require authentication
# D=Debug, E=Errors, V=Verbose
nikto -h http://target.com -Display 123V
```

### 2.3 扫描速度控制

```bash
# 扫描延迟（秒，避免触发 WAF/IDS）
nikto -h http://target.com -Tuning 1 -delay 2

# 超时设置
nikto -h http://target.com -timeout 10

# 最大请求数（单次扫描限制）
nikto -h http://target.com -maxtime 30m
```

---

## 三、认证扫描

### 3.1 HTTP Basic Auth

```bash
nikto -h http://target.com -id admin:password
```

### 3.2 Cookie 认证

```bash
# 使用已登录的 Cookie
nikto -h http://target.com -C "PHPSESSID=abc123def456"
```

### 3.3 通过代理（配合 Burp Suite）

```bash
# HTTP 代理
nikto -h http://target.com -useproxy http://127.0.0.1:8080

# 带认证的代理
nikto -h http://target.com -useproxy http://admin:pass@proxy:3128
```

---

## 四、Tuning 扫描调优

### 4.1 Tuning 选项

| 选项 | 说明 | 检测内容 |
|:---|:---|:---|
| **0** | 文件上传 | 上传功能检测 |
| **1** | Interesting Files | 日志文件、配置文件、备份文件 |
| **2** | Misconfigurations | 服务器配置错误 |
| **3** | Information Disclosure | 信息泄露 |
| **4** | Injection | XSS/Script/HTML 注入 |
| **5** | Remote File Retrieval | 远程文件获取 |
| **6** | Denial of Service | DoS 测试 |
| **7** | Remote File Retrieval – Windows | Windows 远程文件 |
| **8** | Command Execution | 命令执行 |
| **9** | SQL Injection | SQL 注入 |
| **a** | Authentication Bypass | 认证绕过 |
| **b** | Software Identification | 软件识别 |
| **c** | Remote Source Inclusion | 远程文件包含 |
| **x** | Reverse Tuning | 排除特定类别 |

### 4.2 常用 Tuning 组合

```bash
# 仅检测危险文件（快，低风险）
nikto -h http://target.com -Tuning 1

# 信息收集（不发送攻击 Payload）
nikto -h http://target.com -Tuning 123b

# 完整扫描（排除 DoS 测试）
nikto -h http://target.com -Tuning 123457890abc

# 排除某些测试
nikto -h http://target.com -Tuning x6    # 排除 DoS
nikto -h http://target.com -Tuning x69   # 排除 DoS + SQL注入
```

---

## 五、与 Burp Suite 联动

```
流程：
1. 启动 Burp Suite，设置代理为 127.0.0.1:8080
2. 浏览器访问目标 → 分析站点结构
3. 用 Nikto 通过 Burp 代理扫描：
   nikto -h http://target.com -useproxy http://127.0.0.1:8080
4. 在 Burp HTTP History 中查看 Nikto 的所有请求
5. 发现可疑响应（403/200）→ 手工验证
6. Nikto 发现的管理后台 → Burp Intruder 爆破
```

---

## 六、与 WhatWeb 配合

```bash
# WhatWeb：快速识别 Web 技术栈
whatweb http://target.com

# 根据 WhatWeb 结果调整 Nikto 策略
# PHP站点 → 关注 config.php.bak, phpinfo.php, .htaccess
# WordPress → 关注 wp-admin, wp-config, xmlrpc.php
# Tomcat → 关注 manager, host-manager, examples
# IIS → 关注 web.config, .asp, .aspx

# 组合扫描流程
whatweb http://target.com > tech_stack.txt
nikto -h http://target.com -Tuning 1b -o nikto_scan.txt
gobuster dir -u http://target.com -w common.txt -x php,txt,bak
```

---

## 七、结果解读

### 7.1 高价值发现

```
信息泄露类：
/+CSCOT+/translation-table          → Cisco 设备翻译表泄露
/+CSCOE+/logo.html                  → Cisco SSL VPN 登录
/.env                               → Laravel .env 配置文件
/phpinfo.php                        → PHP 信息泄露
/_profiler/phpinfo                  → Symfony 调试信息
/server-status                      → Apache 服务器状态页
/WEB-INF/web.xml                    → Java web.xml 泄露
/console                            → Spring Boot Actuator

管理后台：
/admin / /administrator / /manager  → 管理后台
/wp-admin / /wp-login.php           → WordPress 后台
/umbraco/                           → Umbraco CMS
/user/login / /cms                  → 各种登录页面

危险文件：
/config.php.bak / .htaccess         → 备份/配置文件
/.git/HEAD                          → Git 仓库泄露
/.svn/entries                       → SVN 仓库泄露
```

### 7.2 常见误报

```
"/icons/" 目录被标记为目录列表 → Apache 默认行为，不一定有问题
/resetpassword → 可能只是普通重置页面
/phpmyadmin/ → ChatGPT 生成的内容不代表真的存在
某些 "XSS" 标记 → 需要手工验证是否真实可被利用
"/login" 404 → 可能路径不对，需要进一步确认
```

---

## 八、实战场景

### 场景一：内网快速安全摸底

```bash
# 从 Nmap 结果中提取 Web 服务器
grep "80/open" nmap.gnmap | awk '{print $2}' > web_hosts.txt

# 批量 Nikto 扫描
while read host; do
    nikto -h http://$host -Tuning 1b -o nikto_$host.txt &
done < web_hosts.txt
```

### 场景二：CTF Web 题信息收集

```bash
nikto -h http://ctf.target.com -Tuning 123b -o ctf_scan.txt
# + 同时运行 Gobuster/dirsearch
```

---

## 九、速查卡

```
基础扫描：       nikto -h http://target.com
HTTPS扫描：      nikto -h https://target.com -ssl
认证扫描：       -id admin:password
Cookie扫描：     -C "PHPSESSID=abc"
通过代理：       -useproxy http://127.0.0.1:8080
输出文本：       -o scan.txt
输出HTML：       -o scan.html -Format html
扫描延迟：       -delay 2
速度控制：       -Tuning 1 -maxtime 30m
更新数据库：     nikto -update

常用Tuning：
  只检测信息泄露:  -Tuning 123b
  排除DoS测试:     -Tuning x6
  排除SQL注入:     -Tuning x9
```

---

## 实战场景扩展

### 场景五：HTTPS 完整扫描

```bash
# HTTPS + 认证扫描
nikto -h https://target.com \
  -ssl \
  -Format htm \
  -output nikto_https.html

# 带客户端证书的 HTTPS
nikto -h https://internal.target.com \
  -ssl -C /path/to/cert.pem \
  -Format json -o nikto_results.json
```

### 场景六：认证扫描

```bash
# HTTP Basic 认证
nikto -h https://target.com -id admin:password

# Cookie-based 认证
nikto -h https://target.com/admin \
  -C "PHPSESSID=xxx; XSRF-TOKEN=yyy"

# NTLM 认证（内部 Web 应用）
nikto -h https://intranet.corp.local -id domain\\\user:password
```

### 场景七：大范围内网扫描

```bash
# 从文件读取目标
cat > targets.txt << EOF
https://10.0.1.10:443
https://10.0.1.11:8443
https://10.0.1.12:443
EOF

# 循环扫描
while read target; do
  nikto -h "$target" \
    -Format csv \
    -output "nikto_$(echo $target | tr ':/' '_').csv" \
    -timeout 10 &
done < targets.txt
wait
echo "Scan complete"
```

### 场景八：仅检测特定漏洞类型

```bash
# Tuning 参数详解
-t 1     # Interesting File / Seen in logs
-t 2     # Misconfiguration / Default File
-t 3     # Information Disclosure
-t 4     # Injection (XSS/Script/HTML)
-t 5     # Remote File Retrieval - Inside Web Root
-t 6     # Denial of Service
-t 7     # Remote File Retrieval - Server Wide
-t 8     # Command Execution / Remote Shell
-t 9     # SQL Injection
-t 0     # File Upload
-t a     # Authentication Bypass
-t b     # Software Identification
-t c     # Remote Source Inclusion
-t x     # Reverse Tuning (排除特定类型)

# 示例：仅检测信息泄露和错误配置
nikto -h https://target.com -Tuning 123 b

# 排除 DoS 和 SQL 注入
nikto -h https://target.com -Tuning x 69
```

### 场景九：自定义数据库扩展

```bash
# 更新 Nikto 数据库
nikto -update

# 查看数据库版本
nikto -Version

# 自定义扫描数据库
cd /usr/share/nikto/databases

# 修改扫描配置
# db_tests - 测试用例
# db_404_strings - 404 识别特征
# db_favicon - 图标指纹

# 添加自定义检测规则
echo '"custom_test","1","GET","/custom/endpoint","","","","","","","Custom vulnerability check","","","",""' >> db_tests
```

### 场景十：输出到 SIEM

```bash
# JSON 格式输出 → 导入 ELK/Splunk
nikto -h https://target.com \
  -Format json \
  -output nikto_scan_$(date +%Y%m%d).json

# 提取高危发现
jq '.vulnerabilities[] | select(.severity=="high")' nikto_scan.json

# 批量处理多个 JSON 报告
for f in nikto_scan_*.json; do
  jq -r '[.ip, .hostname, .port, .vulnerabilities[].msg] | @csv' "$f"
done
```

---

## 高级调优

```bash
# 性能优化
nikto -h https://target.com \
  -timeout 10 \         # 连接超时
  -maxtime 30m \         # 最大扫描时间
  -nointeractive \       # 非交互模式
  -nolookup              # 跳过 DNS 查询

# 通过代理扫描
nikto -h https://target.com \
  -useproxy http://127.0.0.1:8080

# 自定义 User-Agent
nikto -h https://target.com \
  -useragent "Mozilla/5.0 (custom_scanner)"

# 排除特定端口
nikto -h https://target.com -port 80,443
```

---

## Nikto vs Nuclei vs Burp Scanner 对比

| 特性 | Nikto | Nuclei | Burp Scanner |
|:---|:---|:---|:---|
| 目标 | Web 服务器 | 通用 | Web 应用 |
| 检测数量 | 6,700+ | 5,000+ 模板 | ~1,000+ |
| 速度 | 中等 | 极快 | 慢 |
| 自定义 | 基础 | 强（模板）| 中（插件）|
| 误报率 | 高 | 中低 | 低 |
| 适合 | 初学者/快速检查 | 大规模/自动化 | 深入渗透测试 |
| 价格 | 免费 | 免费 | $449/年起 |

---

> 📖 本文为"网安百宝箱"课程配套读物。更新于 2026-06-18
