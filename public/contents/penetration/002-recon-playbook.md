# 外网打点（信息收集 + 端口 + 指纹）实施手册

## 1. 信息收集总览

```
目标企业
 ├── 域名 / 子域名 / 备案信息
 ├── 公网 IP / C 段 / ASN
 ├── 端口与服务（80/443/22/3389/8080/...）
 ├── Web 指纹（CMS / 框架 / 中间件）
 ├── 邮箱 / 员工信息（GitHub / 脉脉 / LinkedIn）
 ├── 历史漏洞（CVE / CNVD / 漏洞平台）
 └── 供应链（外包 / 子公司 / 合作伙伴）
```

## 2. 子域名收集

### 2.1 工具链

```bash
# 1. OneForAll（综合性强，推荐）
python3 oneforall.py --target target.com run

# 2. Subfinder（速度快，适合快速枚举）
subfinder -d target.com -all -silent -o sub.txt

# 3. Amass（主动+被动，覆盖率高）
amass enum -passive -d target.com -o amass.txt

# 4. CT 证书透明
curl -s "https://crt.sh/?q=%25.target.com&output=json" | jq -r '.[].name_value' | sort -u

# 5. 第三方 API：Virustotal / SecurityTrails / DNSDB
# 6. 搜索引擎：site:target.com / site:*.target.com
```

### 2.2 子域名解析与存活

```bash
# 解析
massdns -r resolvers.txt -t A -o S sub.txt -w resolved.txt
# HTTP 存活探测
cat sub.txt | httpx -silent -title -status-code -tech-detect -cdn -o live.txt
```

## 3. IP 段与 ASN

```bash
# 1. Whois 查询域名对应 IP 段
whois target.com | grep -iE 'CIDR|NetRange|inetnum'

# 2. ASN 信息
whois -h whois.radb.net -- "-i origin AS12345"
# BGP.he.net：浏览器查看 AS 路由信息

# 3. Shodan / FOFA
# FOFA 语法：domain="target.com" || cert="target.com" || ip="1.2.3.0/24"
# Shodan 语法：hostname:target.com, ssl:"target.com", net:"1.2.3.0/24"
```

## 4. 端口扫描

### 4.1 快速全端口（Masscan + Nmap）

```bash
# 全端口快速扫描（慎用以避免影响业务）
sudo masscan 10.0.0.0/24 -p1-65535 --rate 2000 -oL masscan.log

# 从 masscan 结果提取开放端口，再用 nmap 做服务版本识别
nmap -sS -sV -sC -Pn -p T:21,22,80,443,3306,3389,6379,8080,9000 -iL targets.txt -oN nmap_scan.txt
```

### 4.2 常见敏感端口清单

| 端口 | 服务 | 关注风险 |
|------|------|---------|
| 21 | FTP | 匿名登录 / 弱口令 / vsftpd 漏洞 |
| 22 | SSH | 弱口令 / 老版本（CVE-2024-6387） |
| 23 | Telnet | 明文传输 / 弱口令 |
| 389/636 | LDAP | 未授权 / 弱口令 |
| 445 | SMB | 永恒之蓝 / SMBGhost / 弱口令 |
| 3306 | MySQL | 未授权 / 弱口令 / UDF |
| 3389 | RDP | BlueKeep(CVE-2019-0708) / 弱口令 |
| 5432 | PostgreSQL | 未授权 / 弱口令 |
| 6379 | Redis | 未授权 / SSH key 写入 RCE |
| 9200 | Elasticsearch | 未授权 / 历史 RCE |
| 11211 | Memcached | 未授权读取 |
| 27017 | MongoDB | 未授权访问 |
| 10050 | Zabbix | 默认口令 / 历史 RCE |
| 8080/7001/8888/9090 | 管理后台 | Tomcat / Weblogic / JBOSS / Jenkins |
| 2375/2376 | Docker | Docker API 未授权 RCE |

## 5. Web 指纹识别

### 5.1 常用工具

```bash
# EHole 棱洞指纹
./EHole -f live.txt -o ehole.json

# Glass / finger
python3 glass.py -f url.txt

# Wappalyzer / WhatWeb
whatweb -v http://target.com

# httpx -tech-detect（已经在上一步使用）
```

### 5.2 关注指纹类型

- **国内 CMS**：织梦 / 帝国 / PHPcms / 动易 / 致远 OA / 泛微 OA / 通达 OA / 蓝凌 OA / 用友 NC
- **开发框架**：Spring Boot / Struts2 / ThinkPHP / Laravel / Flask / Django / Shiro / Fastjson
- **中间件**：Nginx / Apache / Tomcat / JBoss / Weblogic / WebSphere / IIS
- **云服务**：阿里 / 腾讯 / 华为云 OSS、COS、CDN 配置问题

## 6. 目录与文件探测

```bash
# Gobuster 目录扫描
gobuster dir -u http://target.com -w ./wordlist/dicc.txt -x php,jsp,action,html,txt,zip,rar,sql,log -t 50 -o dir.txt

# 7kbscan / dirmap / Dirsearch
python3 dirmap.py -i http://target.com -lcf

# Git/SVN 泄漏探测
GitHack.py http://target.com/.git/
SVNDump.py http://target.com/.svn/entries
```

常见敏感文件：`/admin`、`/manager`、`/console`、`/actuator`、`/druid`、`/swagger-ui.html`、`/phpinfo.php`、`/backup.zip`、`/.git/config`、`/robots.txt`、`/web.config`、`/.DS_Store`

## 7. 员工信息与账户泄漏

- **Pastebin / 0bin / GitHub Gist**：搜索 `target.com password` / `@target.com`
- **Git 泄漏工具**：`gitleaks`、`trufflehog`、`Gitrob`、`GitGuardian`
- **LinkedIn / 脉脉**：收集员工姓名，用于生成邮箱字典和社工
- **账户泄漏查询**：HaveIBeenPwned / Dehashed（需 API Key）

## 8. 指纹 → POC 匹配与漏洞验证

```bash
# Nuclei 批量 POC（需先下载社区 nuclei-templates）
nuclei -l live.txt -t ./nuclei-templates/cves/ -s critical,high -o nuclei_critical.txt

# Xray 被动扫描 + 主动爬虫
xray_linux_amd64 webscan --listen 127.0.0.1:7777 --html-output xray.html
# 浏览器挂上该代理并访问目标

# POC-T / Vulmap / T14 综合利用框架
python3 POC-T.py -s thinkphp_rce2 -aF "app=\"thinkphp\"" --dork "thinkphp"
```

## 9. 情报平台速查

| 类型 | 平台 |
|------|------|
| 网络空间测绘 | FOFA / Shodan / ZoomEye / Quake / Hunter |
| 域名信息 | 站长之家 / ICP 备案查询 / DNSDB / SecurityTrails |
| 漏洞库 | CVE / CNVD / CNNVD / Exploit-DB / Seebug / Packet Storm |
| 威胁情报 | 微步 / 奇安信 / 360 / VirusTotal / AbuseIPDB |

## 10. 工作流建议

1. 明确目标与授权
2. 被动情报（域名/子域/ASN/员工信息）→ 不去直接触达目标
3. 端口扫描 → 服务识别
4. Web 指纹 → CVE/POC 匹配
5. 人工检查：各系统登录、文件上传、后台接口
6. 组合利用链编写 PoC 并验证
7. 输出报告

---

**免责声明**：本手册仅用于合法的授权安全测试。使用以上工具和技术时必须取得书面授权，并遵守相关法律法规。
