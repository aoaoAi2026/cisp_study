# WPScan WordPress 安全扫描完全指南

> 分类：工具指南 | 难度：进阶 | 阅读时间：约45分钟

## 概述

WPScan 是由 WPScan Team 开发并维护的 WordPress 专用安全扫描器。它内置 WordPress 漏洞数据库（CVE 及核心/插件/主题的公开和私有漏洞），通过黑盒测试模式对 WordPress 站点进行安全评估。WPScan 在 WPScan.com 的 API 支持下，提供了全球最完整的 WordPress 漏洞检测能力。

**核心能力**：
- WordPress 版本探测与 CVE 检测
- 插件/主题枚举与已知漏洞匹配
- 用户名枚举
- 弱密码爆破
- WordPress 配置文件/备份文件发现
- REST API 枚举
- 数据库 Timthumb 等知名漏洞检测

## 核心知识点

- WPScan 基础扫描与高级选项
- API Token 注册与使用
- 用户枚举技术
- 密码爆破配置
- 插件/主题漏洞检测
- 自定义扫描参数
- 防火墙/WAF 检测与绕过

---

## 一、安装

### 1.1 Kali Linux（预装）

```bash
wpscan --version
sudo apt install wpscan -y
```

### 1.2 Ubuntu/Debian

```bash
sudo apt install ruby ruby-dev libcurl4-openssl-dev make gcc -y
sudo gem install wpscan

# 或通过 apt
sudo apt update && sudo apt install wpscan -y
```

### 1.3 macOS

```bash
brew install wpscan
# 或
sudo gem install wpscan
```

### 1.4 Docker

```bash
docker pull wpscanteam/wpscan
docker run -it --rm wpscanteam/wpscan --url https://target.com
```

### 1.5 API Token 注册

```bash
# 注册免费 API Token（每日25次漏洞查询）
# https://wpscan.com/register

# 使用 Token
wpscan --url https://target.com --api-token YOUR_TOKEN

# 配置为默认（.wpscan/db/cli_options.yml）
cli_options:
  api_token: 'YOUR_TOKEN'
```

---

## 二、基础扫描

### 2.1 基础命令

```bash
# 基础扫描
wpscan --url https://target.com

# 被动扫描（稳定模式）
wpscan --url https://target.com --stealthy

# 详细输出
wpscan --url https://target.com -v
# -vv: 更详细
# -vvv: 调试级别

# 输出到文件
wpscan --url https://target.com -o wpscan_report.txt
wpscan --url https://target.com --format json -o wpscan_report.json
```

### 2.2 枚举模式

```bash
# 枚举所有
wpscan --url https://target.com -e

# 选择性枚举
wpscan --url https://target.com \
  -e vp,vt,tt,cb,dbe,u,m
# vp  = 易受攻击的插件
# vt  = 易受攻击的主题
# tt  = 计时攻击（Timthumbs）
# cb  = 配置备份文件
# dbe = 数据库导出文件
# u   = 用户枚举
# m   = 媒体枚举
```

---

## 三、用户枚举

### 3.1 自动枚举

```bash
# 枚举用户（通过 author ID 遍历）
wpscan --url https://target.com -e u

# 枚举用户 ID 范围
wpscan --url https://target.com -e u1-100

# REST API 枚举（WordPress 4.7+）
curl https://target.com/wp-json/wp/v2/users
curl https://target.com/?rest_route=/wp/v2/users

# 其他枚举方法
# /?author=1  → 302 重定向到 /author/admin/
# /wp-json/oembed/1.0/embed?url=...
# XML-RPC: wp.getUsersBlogs
```

### 3.2 密码爆破

```bash
# 指定用户名+字典
wpscan --url https://target.com \
  -U admin -P /usr/share/wordlists/rockyou.txt

# 通过文件指定多用户
wpscan --url https://target.com \
  -U users.txt -P /usr/share/wordlists/rockyou.txt

# 控制爆破参数
wpscan --url https://target.com \
  -U users.txt -P passes.txt \
  --max-threads 5 \           # 线程数
  --request-timeout 60 \      # 超时
  --connect-timeout 30

# XML-RPC 爆破（可能绕过限速）
wpscan --url https://target.com \
  -U admin -P passes.txt \
  --password-attack xmlrpc
# 其他方法：wp-login（默认）, xmlrpc-multicall
```

---

## 四、插件与主题枚举

### 4.1 插件枚举

```bash
# 枚举所有插件（从已知列表）
wpscan --url https://target.com -e ap

# 枚举易受攻击的插件
wpscan --url https://target.com -e vp

# 仅枚举有已知漏洞的插件（需 API Token）
wpscan --url https://target.com -e vp --api-token TOKEN

# 指定自定义插件列表
wpscan --url https://target.com \
  --plugins-list /path/to/custom_plugins.txt

# 被动模式（通过页面HTML/CSS/JS引用检测）
wpscan --url https://target.com --plugins-detection passive
```

### 4.2 主题枚举

```bash
# 主题枚举
wpscan --url https://target.com -e at

# 易受攻击的主题
wpscan --url https://target.com -e vt --api-token TOKEN
```

### 4.3 版本检测方法

```
1. readme.txt → Stable tag 字段
2. plugin.php/style.css → Version 头部注释
3. changelog.txt → 最新版本号
4. HTML 模板中的版本注释
5. CSS/JS 文件中的 @version
```

---

## 五、配置备份与敏感文件

### 5.1 备份文件扫描

```bash
# 枚举配置备份
wpscan --url https://target.com -e cb

# 常见备份文件模式
# wp-config.php.bak
# wp-config.php~
# wp-config.php.old
# wp-config.php.save
# wp-config.php.swp
# wp-config.php.txt

# 数据库导出
wpscan --url https://target.com -e dbe
# *.sql
# *.sql.gz
# *.sql.zip
# db_backup.sql
```

### 5.2 敏感信息文件

```bash
# 检查的信息泄露
# error_log → PHP 错误日志
# debug.log → WordPress 调试日志
# .DS_Store → macOS 目录清单
# .git/ → Git 版本库
# .svn/ → SVN 版本库
# phpinfo.php → PHP 信息

# WPScan 自动检测
wpscan --url https://target.com -e cb,dbe
```

---

## 六、实战场景

### 场景一：快速 WordPress 安全审计

```bash
# 标准审计命令
wpscan --url https://target.com \
  -e vp,vt,u,cb,dbe \
  --api-token YOUR_TOKEN \
  --random-user-agent \
  --detection-mode mixed \
  -o audit_report_$(date +%Y%m%d).json \
  --format json
```

### 场景二：弱密码测试

```bash
# 先枚举用户
wpscan --url https://target.com -e u | tee users.txt

# 从结果提取用户名
grep -oP 'User: \K\w+' users.txt > usernames.txt

# 常用弱密码
echo -e "admin\npassword\n123456\nqwerty\nletmein" > common_passes.txt

# 爆破
wpscan --url https://target.com \
  -U usernames.txt -P common_passes.txt \
  --max-threads 3 \
  --request-timeout 60
```

### 场景三：WAF/防火墙绕过

```bash
# 使用随机 User-Agent
wpscan --url https://target.com --random-user-agent

# 代理扫描
wpscan --url https://target.com --proxy http://127.0.0.1:8080

# 降低探测速度
wpscan --url https://target.com --throttle 1000    # 毫秒延迟

# 使用 stealthy 模式
wpscan --url https://target.com --stealthy
```

---

## 七、与其他工具联动

```bash
# WPScan → sqlmap
# 发现插件 → 导出易受攻击的URL
wpscan --url https://target.com -e vp --format json | \
  jq '.plugins[] | .location' | \
  while read url; do
    sqlmap -u "$url" --batch
  done

# WPScan + Nuclei
wpscan --url https://target.com -e vp --format json -o wpscan.json
# 根据发现的版本信息构建 Nuclei 扫描
nuclei -u https://target.com -t ~/nuclei-templates/cms/wordpress/
```

---

## 八、速查卡

```
基础扫描:    wpscan --url URL
枚举全部:    wpscan --url URL -e
插件枚举:    -e ap（全部） -e vp（有漏洞的）
主题枚举:    -e at（全部） -e vt（有漏洞的）
用户枚举:    -e u
密码爆破:    -U user -P wordlist
备份文件:    -e cb,dbe
API Token:   --api-token TOKEN
输出:        -o file --format json
代理:        --proxy http://127.0.0.1:8080
Stealthy:    --stealthy
随机UA:      --random-user-agent

Docker:      docker run wpscanteam/wpscan --url URL
```

---

> 📖 本文为"网安百宝箱"课程配套读物。
> 参考：WPScan 官方 https://wpscan.com/
> 更新于 2026-06-18
