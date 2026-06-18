# Gobuster 与 Web 目录枚举工具全指南

> 分类：工具指南 | 难度：入门 | 阅读时间：约40分钟

## 概述

Web 目录/文件枚举是渗透测试信息收集阶段的关键步骤。通过暴力枚举 Web 服务器的隐藏目录、文件和子域名，可以发现管理后台、备份文件、API 端点、配置文件等敏感资源。Gobuster（Go 语言编写）、dirsearch（Python）和 ffuf（Go/Fast Fuzzer）是这一领域的三大核心工具，各有优劣，互相补充。

**三者对比**：
| 特性 | Gobuster | dirsearch | ffuf |
|:---|:---|:---|:---|
| 语言 | Go | Python | Go |
| 速度 | 极快 | 中快 | 极快 |
| DNS 子域枚举 | ✅ | ❌ | ✅ |
| VHOST 枚举 | ✅ | ❌ | ✅ |
| 递归扫描 | ❌ | ✅ | ✅ |
| 自定义 Header | ✅ | ✅ | ✅ |
| 扩展名/后缀 | ✅ | ✅ | ✅ |

## 核心知识点

- Gobuster 四大模式：dir、dns、vhost、fuzz
- dirsearch 的递归扫描与结果分析
- ffuf 的 FUZZ 关键字与过滤
- 字典选择与优化策略
- 结果过滤与报告整理

---

## 一、Gobuster 全指南

### 1.1 安装

```bash
# Ubuntu/Debian/Kali
sudo apt install gobuster -y

# macOS
brew install gobuster

# Go 安装
go install github.com/OJ/gobuster/v3@latest

# 验证
gobuster --version
```

### 1.2 Dir 模式（目录/文件枚举）

```bash
# 基础用法
gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt

# 指定扩展名
gobuster dir -u http://target.com -w common.txt -x php,txt,html,bak,zip

# 多线程（默认10，最大可调）
gobuster dir -u http://target.com -w common.txt -t 50

# 指定状态码过滤
gobuster dir -u http://target.com -w common.txt -s 200,301,302,403

# 排除状态码
gobuster dir -u http://target.com -w common.txt -b 404,400

# 自定义 Header
gobuster dir -u http://target.com -w common.txt \
    -H "Cookie: session=abc123" \
    -H "User-Agent: Mozilla/5.0"

# 跟踪重定向
gobuster dir -u http://target.com -w common.txt --follow-redirect

# 输出结果
gobuster dir -u http://target.com -w common.txt -o results.txt

# 完整扫描示例
gobuster dir -u http://target.com \
    -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt \
    -x php,asp,aspx,jsp,html,txt,bak,old,zip,tar.gz,conf,config \
    -t 50 \
    -s 200,301,302,403,500 \
    -o gobuster_scan.txt \
    --timeout 5s \
    --no-tls-validation
```

### 1.3 DNS 模式（子域名枚举）

```bash
gobuster dns -d target.com -w /usr/share/wordlists/subdomains-top1million-5000.txt

# 指定 DNS 服务器
gobuster dns -d target.com -w subdomains.txt -r 8.8.8.8:53

# 输出
gobuster dns -d target.com -w subdomains.txt -o subdomains.txt
```

### 1.4 VHOST 模式（虚拟主机枚举）

```bash
gobuster vhost -u http://192.168.1.100 -w subdomains.txt

# 排除默认响应长度
gobuster vhost -u http://192.168.1.100 -w subdomains.txt --exclude-length=1234
```

### 1.5 Fuzz 模式（自定义模糊测试）

```bash
# Gobuster 3.0+ 的 fuzz 模式使用 {GOBUSTER} 占位符
gobuster fuzz -u http://target.com/api/{GOBUSTER} -w params.txt

# 用于模糊测试 API 端点、参数名等
```

---

## 二、dirsearch 全指南

### 2.1 安装

```bash
# 源码安装
git clone https://github.com/maurosoria/dirsearch.git
cd dirsearch
pip install -r requirements.txt

# Kali 预装
# 或通过 pip
pip install dirsearch

# 验证
python dirsearch.py --version
```

### 2.2 基础用法

```bash
# 基础扫描
python dirsearch.py -u http://target.com

# 多字典
python dirsearch.py -u http://target.com -w dict1.txt,dict2.txt

# 多线程
python dirsearch.py -u http://target.com -t 30

# 指定扩展名
python dirsearch.py -u http://target.com -e php,asp,aspx,jsp,html

# 详细输出
python dirsearch.py -u http://target.com --full-url

# 递归扫描
python dirsearch.py -u http://target.com -r --recursion-depth=3

# 自定义 Header
python dirsearch.py -u http://target.com \
    --header="Cookie: session=abc" \
    --header="Authorization: Bearer token"

# 代理
python dirsearch.py -u http://target.com --proxy="http://127.0.0.1:8080"

# 输出格式
python dirsearch.py -u http://target.com -o results.txt --format=plain
```

### 2.3 结果分析

```bash
# dirsearch 自动生成 reports/ 目录
# reports/target.com/ 包含 JSON/CSV/HTML 格式报告

# 关注状态码：
# 200 → 可直接访问，重点关注
# 301/302 → 重定向（可能有更深路径）
# 403 → 禁止访问（可能包含敏感内容）
# 401 → 需要认证
# 500 → 服务器错误（可能触发了bug）
```

---

## 三、ffuf 全指南

### 3.1 安装

```bash
# Ubuntu/Debian/Kali
sudo apt install ffuf -y

# Go 安装
go install github.com/ffuf/ffuf/v2@latest

# macOS
brew install ffuf

# 验证
ffuf -V
```

### 3.2 目录枚举

```bash
# FUZZ 关键字是核心
ffuf -u http://target.com/FUZZ -w /usr/share/wordlists/dirb/common.txt

# 多扩展名
ffuf -u http://target.com/FUZZ -w words.txt -e .php,.html,.asp

# 过滤状态码
ffuf -u http://target.com/FUZZ -w words.txt -fc 404

# 过滤响应大小
ffuf -u http://target.com/FUZZ -w words.txt -fs 1234

# 匹配状态码
ffuf -u http://target.com/FUZZ -w words.txt -mc 200,301,302

# 递归扫描
ffuf -u http://target.com/FUZZ -w words.txt -recursion -recursion-depth 2
```

### 3.3 POST 参数枚举

```bash
# POST 数据中使用 FUZZ
ffuf -u http://target.com/api/login \
     -X POST \
     -d 'username=FUZZ&password=test' \
     -w users.txt \
     -H "Content-Type: application/x-www-form-urlencoded"
```

### 3.4 子域名枚举

```bash
ffuf -u http://FUZZ.target.com -w subdomains.txt

# VHOST 枚举（同一IP的不同虚拟主机）
ffuf -u http://target.com -H "Host: FUZZ.target.com" -w vhosts.txt -fs 1234
```

### 3.5 多位置 Fuzz

```bash
# 多字典多位置
ffuf -u http://target.com/api/FUZZ1/FUZZ2 \
     -w endpoints.txt:FUZZ1 \
     -w ids.txt:FUZZ2
```

---

## 四、推荐字典

```bash
# Kali 内置
/usr/share/wordlists/dirb/common.txt              # 小字典，快速扫描
/usr/share/wordlists/dirb/big.txt                  # 大字典
/usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt  # 中型
/usr/share/wordlists/dirbuster/directory-list-2.3-small.txt   # 小型

# SecLists（推荐额外安装）
/usr/share/seclists/Discovery/Web-Content/common.txt
/usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
/usr/share/seclists/Discovery/DNS/subdomains-top1million-20000.txt

# 自定义精确字典
# admin, backup, config, test, dev, staging, api, v1, v2, old, new,
# upload, files, tmp, temp, log, logs, db, database, include,
# .git, .svn, .env, .htaccess, robots.txt, sitemap.xml
```

---

## 五、实战技巧

### 5.1 三步扫描策略

```bash
# 步骤1：快速初扫（小字典，无扩展名）
gobuster dir -u http://target.com -w common.txt -t 50

# 步骤2：扩展名定向扫描（根据技术栈）
# PHP站点：-x php,txt,bak,old,sql,zip
# ASP站点：-x asp,aspx,ashx,config,bak
# Java站点：-x jsp,do,action,xml,properties

# 步骤3：递归深入扫描
python dirsearch.py -u http://target.com/admin/ -r -e php
```

### 5.2 结果分析技巧

```
高价值目标：
- /admin, /login, /dashboard → 管理后台
- /api, /graphql, /swagger → API文档
- /.git, /.svn, /.env → 源码泄露
- /backup, /dump, /export → 数据备份
- /phpinfo.php, /server-status → 信息泄露
- /wp-admin, /wp-content → WordPress
- /console, /actuator → Java 调试端点
```

### 5.3 与 Burp Suite 联动

```
1. Gobuster/dirsearch 发现目录 → Burp Spider 深度爬行
2. 特定响应 → Burp Repeater 手工测试
3. 403/401 页面 → Burp 尝试绕过认证
```

---

## 六、速查卡

```
Gobuster Dir:   gobuster dir -u URL -w wordlist.txt -x php,html
Gobuster DNS:   gobuster dns -d domain.com -w subdomains.txt
Gobuster VHOST: gobuster vhost -u URL -w vhosts.txt

dirsearch:      python dirsearch.py -u URL -e php,asp -t 30
dirsearch 递归:  -r --recursion-depth=3

ffuf:           ffuf -u URL/FUZZ -w wordlist.txt
ffuf 多扩展名:   -e .php,.html,.asp
ffuf 过滤:       -fc 404 -fs 1234
ffuf VHOST:      -H "Host: FUZZ.domain.com"

推荐字典:       /usr/share/wordlists/dirb/common.txt
               /usr/share/seclists/Discovery/Web-Content/common.txt
```

---

## 实战场景扩展

### 场景六：API 端点发现

```bash
# API 扫描专用字典
gobuster dir -u https://api.target.com \
  -w /usr/share/seclists/Discovery/Web-Content/api/api-endpoints.txt \
  -o api_results.txt

# 配合 ffuf 使用更高效的 API 字典
ffuf -u https://api.target.com/FUZZ \
  -w /usr/share/seclists/Discovery/Web-Content/raft-small-words.txt \
  -fc 404 -o api.json
```

### 场景七：子域名枚举

```bash
# DNS 模式子域名爆破
gobuster dns -d target.com \
  -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt \
  -r 8.8.8.8 \
  -o subdomains.txt

# 配合 Amass 子域名收集
amass enum -d target.com -o amass_passive.txt
gobuster dns -d target.com -w combined_subdomains.txt >> all_subdomains.txt
cat all_subdomains.txt | sort -u | httpx -silent > live_subdomains.txt
```

### 场景八：VHOST 虚拟主机发现

```bash
# VHOST 爆破
gobuster vhost -u https://target.com \
  -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-2000.txt \
  --append-domain \
  -o vhosts.txt

# ffuf VHOST 模式（更快）
ffuf -u https://target.com \
  -H "Host: FUZZ.target.com" \
  -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-2000.txt \
  -fs 1234  # 过滤掉默认页面的响应大小
```

### 场景九：多扩展名批量扫描

```bash
# -x 参数的后缀不是独立扫描，而是添加到每个 word 后面
gobuster dir -u https://target.com \
  -w /usr/share/wordlists/dirb/common.txt \
  -x .php,.html,.asp,.aspx,.jsp,.bak,.old,.zip,.tar.gz \
  -o multi_ext_results.txt

# 推荐：对每个扩展名分类解析
for ext in php html asp aspx jsp; do
  gobuster dir -u https://target.com \
    -w common.txt -x .$ext -o ext_$ext.txt &
done
wait
```

### 场景十：绕过 CDN/WAF

```bash
# 使用代理轮换
gobuster dir -u https://target.com \
  -w wordlist.txt \
  --proxy http://127.0.0.1:8080

# 自定义 User-Agent
gobuster dir -u https://target.com \
  -w wordlist.txt \
  -a "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

# 添加 Headers
gobuster dir -u https://target.com \
  -w wordlist.txt \
  -H "X-Forwarded-For: 127.0.0.1" \
  -H "Authorization: Bearer token123"

# 使用 SOCKS5 代理
gobuster dir -u https://target.com \
  -w wordlist.txt \
  --proxy socks5://127.0.0.1:1080
```

### 场景十一：S3 Bucket 枚举

```bash
# AWS S3 Bucket 发现
gobuster s3 -w /usr/share/seclists/Discovery/Web-Content/raft-large-words.txt

# 或使用专门的 s3scanner
s3scanner scan --bucket-file wordlist.txt
```

### 场景十二：并发控制与隐蔽扫描

```bash
# 降低并发（隐蔽），增加延迟
gobuster dir -u https://target.com \
  -w wordlist.txt \
  -t 10 \          # 10 线程（低调）
  --delay 500ms    # 每次请求延迟 500ms

# 快速扫描（激进）
gobuster dir -u https://target.com \
  -w wordlist.txt \
  -t 50 \          # 50 线程
  --no-tls-validation \  # 跳过 TLS 验证
  --timeout 5s
```

---

## 三大目录爆破工具对比

| 特性 | Gobuster | ffuf | Dirb/Dirbuster |
|:---|:---|:---|:---|
| **语言** | Go | Go | C/Java |
| **速度** | 快 | 极快 | 中等 |
| **并发** | 可控线程 | 高性能并发 | 固定线程 |
| **过滤** | 状态码/大小 | 状态码/大小/字数/正则 | 基础 |
| **扩展名** | `-x php,html` | `-e .php,.html` | `-X .php` |
| **递归** | 不支持 | 支持（-recursion）| 支持 |
| **VHOST** | 支持 | 支持 | 不支持 |
| **POST 数据** | 不支持 | 支持（-d）| 不支持 |
| **自定义头** | 支持 | 支持 | 支持 |

---

## 字典推荐策略

```bash
# 发现阶段（小字典，全面）
/usr/share/seclists/Discovery/Web-Content/common.txt
/usr/share/seclists/Discovery/Web-Content/directory-list-2.3-small.txt

# 深度阶段（大字典，耗时长）
/usr/share/seclists/Discovery/Web-Content/raft-large-words.txt
/usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt

# API 专用
/usr/share/seclists/Discovery/Web-Content/api/
/usr/share/seclists/Discovery/Web-Content/swagger.txt

# 技术栈特定
# WordPress:  /usr/share/seclists/Discovery/Web-Content/CMS/wp-plugins.txt
# Tomcat:     /usr/share/seclists/Discovery/Web-Content/tomcat.txt
# Jenkins:    /usr/share/seclists/Discovery/Web-Content/Jenkins.txt
```

---

> 📖 本文为"网安百宝箱"课程配套读物。更新于 2026-06-18
