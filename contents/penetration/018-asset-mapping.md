# 资产测绘与批量打点（FOFA/Shodan/Quake/鹰图实战）

> 资产测绘是红队行动的第一步。本文系统介绍 FOFA、Shodan、Quake、鹰图（ZoomEye）四大平台的高级搜索语法、API 自动化、多源合并去重，以及如何把测绘结果对接 Xray / Nuclei 做批量打点。

## 1. 四大平台对比

| 平台 | 定位 | 优点 | 缺点 | 推荐指数 |
|------|------|------|------|------|
| **FOFA** | 中文资产测绘（fofa.info） | 国内资产覆盖最全面，语法直观 | 免费额度有限 | ★★★★★ |
| **Shodan** | 全球网络空间搜索引擎（shodan.io） | 端口/服务指纹极细，数据量大 | 国内站点不如 FOFA 全 | ★★★★☆ |
| **Quake** | 360 网络空间测绘（quake.360.net） | 响应体/证书/JS 可全文检索 | 社区模板较少 | ★★★★☆ |
| **ZoomEye（鹰图）** | 知道创宇网络空间搜索引擎（zoomeye.org） | Web / Host 双模式，和 Seebug 联动 | 部分高级语法偏冷门 | ★★★☆☆ |

### 1.1 四平台通用搜索思路

1. **从根域名出发**：`domain="target.com"`（FOFA/Quake/ZoomEye）、`ssl:target.com`（Shodan）；
2. **从 ICP / 注册单位出发**：`icp="京ICP备XXXX号"`、`cert="target company"`；
3. **从证书反查**：`cert.subject="target.com"`、`cert="-----BEGIN CERTIFICATE-----"`；
4. **从 ASN 出发**：`asn="AS12345"`、`org="target ltd"`；
5. **从 title/body 关键字反查**：`title="后台管理系统"`、`body="Powered by"`。

## 2. FOFA 高级语法与实战

FOFA 是国内最常用的资产测绘平台，支持 `domain`、`host`、`ip`、`cert`、`title`、`body`、`icp`、`city`、`port`、`banner`、`app`、`os`、`country` 等关键字。

### 2.1 核心语法速查

```
# 根域名 + 子域名
domain="target.com"

# 证书包含 target.com（可命中泛域名）
cert="target.com"

# 标题
title="后台管理系统"

# 页面正文包含特定字符串
body="thinkphp" && country="CN"

# ICP 备案号（强力手段）
icp="京ICP备2020000000号"

# 端口限定
port="8080" || port="8443"

# 指纹（由 FOFA 识别）
app="Spring Boot Actuator"
app="Jenkins"
app="Druid Monitor"
app="Node-RED"
app="Apache Tomcat" && status_code="200"

# 国家/城市
country="CN" && city="beijing"

# 组合：国内暴露在公网的 Jenkins 未授权访问
title="Dashboard [Jenkins]" && body="Dashboard [Jenkins]" && country="CN"
```

### 2.2 FOFA Pro API 使用

```python
import requests, json

API_KEY = "your-fofa-api-key"
EMAIL   = "your@mail.com"
QUERY   = 'domain="target.com" && status_code="200"'
PAGE    = 1
SIZE    = 100

resp = requests.get("https://fofa.info/api/v1/search/all", params={
    "email": EMAIL,
    "key": API_KEY,
    "qbase64": __import__("base64").b64encode(QUERY.encode()).decode(),
    "page": PAGE,
    "size": SIZE,
    "fields": "host,ip,port,title,domain,server",
})
data = resp.json()
for item in data.get("results", []):
    print(" | ".join(item))
```

**fields** 可选字段：`ip,port,protocol,country_name,region,city,longitude,latitude,as_number,as_organization,host,domain,os,server,icp,title,jarm,certs_match,timestamp,cert`。

## 3. Shodan 搜索与 API

Shodan 主打「服务 banner 索引」，对 IoT、工控、RDP、SSH、Redis 等非 Web 资产覆盖极佳。

### 3.1 常用 Shodan 过滤符

```
# 主机名/域名
hostname:target.com
ssl:"target.com"

# 产品指纹
product:"nginx"
product:"Microsoft IIS httpd"

# 端口
port:22
port:3389
port:6379

# HTTP 标题/正文
http.title:"Dashboard"
http.html:"wp-admin"

# 地理位置
country:CN
city:Beijing

# 组织/ASN
org:"Target Company"
asn:AS12345

# 组合：暴露在公网的 Redis 且无密码
product:"redis" port:6379 -"\\"NOAUTH\\""
```

### 3.2 Shodan CLI 批量导出

```bash
# 安装
pip install shodan
shodan init <your-api-key>

# 搜索并下载前 1000 条
shodan download --limit 1000 target.json.gz 'hostname:target.com'

# 解析为 IP:PORT 列表
shodan parse --fields ip_str,port --separator ':' target.json.gz > shodan-targets.txt
```

## 4. Quake（360）与鹰图 ZoomEye

### 4.1 Quake 特色语法

Quake 对响应体内容做了全文索引，支持 `app:`、`cert:`、`favicon.hash:`、`body:`、`header:`、`hostname:` 等。

```
# 响应体包含敏感字符串
response:"root:" AND response:":/bin/bash"

# favicon 哈希
favicon:"-1555279520"

# 证书
cert:"target.com" cert:"Let's Encrypt"

# 资产组合（域名 + IP 段）
domain:"target.com" OR ip:"1.2.3.0/24"
```

### 4.2 ZoomEye 特色语法

ZoomEye 区分 `web` 和 `host` 两个维度：

```
# Web 搜索
iconhash:"-1555279520"
title:"后台"
site:target.com
app:"Jenkins"

# Host 搜索
port:3306
service:"mysql"
app:"MySQL" country:"CN"

# 登录后 API 调用
curl -X POST https://api.zoomeye.org/user/login \
     -H 'Content-Type: application/json' \
     -d '{"username":"you@mail.com","password":"xxx"}'
```

## 5. 多源合并与去重工作流

在实际项目中，我们通常同时调用 3~4 个平台 API，然后做合并去重。以下是推荐工作流：

```
1. 以根域名、ICP、组织名为起点，在 4 个平台分别搜索
2. 将结果统一成 "http(s)://host:port" 或 "IP:PORT" 格式
3. 用 httpx 做存活探测 + title 提取
4. 去重（去 URL、去标题重复的管理后台、去 favicon hash 相同的重复站点）
5. 交付给 Xray / Nuclei 做批量扫描
```

### 5.1 合并去重脚本示例

```bash
# 1. 分别从各平台导出 URL 列表（每行一个 http(s)://...）
cat fofa.txt shodan.txt quake.txt zoomeye.txt | sort -u > raw.txt

# 2. 用 httpx 做存活探测，导出标题/状态码
httpx -l raw.txt -silent -title -status-code -fc 404,502 -o alive.txt

# 3. 按 favicon hash 去重（同指纹保留一个代表）
cat alive.txt | awk -F '\\[' '{print $1}' | sort -u > unique-alive.txt

# 4. 交付给 Nuclei 批量扫描
nuclei -l unique-alive.txt -t ~/nuclei-templates/ \
       -s critical,high -rl 100 -o nuclei-result.jsonl -j
```

### 5.2 常用工具组合

| 工具 | 用途 |
|------|------|
| **OneForAll** | 子域名爆破（DNS / HTTPS / Certificate Transparency） |
| **Amass** | OSINT 资产收集，子域名主动/被动双模式 |
| **Subfinder** | 被动子域名收集（支持 VirusTotal / SecurityTrails 等源） |
| **httpx** | HTTP 存活探测 + 状态码 + title + 指纹 |
| **naabu** | 端口扫描（TCP SYN，比 nmap 快） |
| **fav-up** | favicon hash 反查（Shodan/FOFA 语法自动生成） |
| **EHole / Glass / Finger** | 应用指纹识别 |

## 6. API 自动化实战：FOFA + httpx + Xray 全链路

下面给出一个完整的 Python 脚本，演示从 **FOFA API 拉资产 → httpx 存活探测 → Xray 批量扫描 → Nuclei 漏洞扫描** 的完整链路。

```python
import requests, base64, subprocess, os

FOFA_EMAIL = "your@mail.com"
FOFA_KEY   = "your-fofa-key"
TARGET_DOMAIN = "target.com"
QUERY = f'domain="{TARGET_DOMAIN}" && status_code="200"'

def fofa_search(query, page=1, size=500):
    b64 = base64.b64encode(query.encode()).decode()
    r = requests.get("https://fofa.info/api/v1/search/all", params={
        "email": FOFA_EMAIL, "key": FOFA_KEY,
        "qbase64": b64, "page": page, "size": size,
        "fields": "url",
    }, timeout=30)
    return [item[0] for item in r.json().get("results", [])]

assets = fofa_search(QUERY)
with open("fofa-assets.txt", "w") as f:
    f.write("\n".join(assets))

# 存活探测（需系统已安装 httpx）
subprocess.run(["httpx", "-l", "fofa-assets.txt", "-silent", "-o", "alive.txt"])

# Xray 批量扫描（需系统已安装 xray）
subprocess.run([
    "./xray", "webscan",
    "--url-file", "alive.txt",
    "--html-output", "xray-report.html",
])

# Nuclei 批量扫描
subprocess.run([
    "nuclei", "-l", "alive.txt",
    "-t", "~/nuclei-templates/",
    "-s", "critical,high",
    "-o", "nuclei-report.jsonl", "-j",
])
```

## 7. 典型场景：从 ICP 号出发的企业画像

```
1. 通过站长之家 / 天眼查 / ICP 查询，获取目标公司所有备案域名；
2. 逐个域名做 FOFA：domain="target.com"、cert="target.com"、icp="xxx"；
3. 导出 Shodan：ssl:target.com hostname:target.com org:"Target Ltd"；
4. 导出 Quake：domain:"target.com"；
5. 合并、去重、httpx 探活；
6. 按 favicon hash 归并同类系统（一套后台可能被多个域名复用）；
7. 对典型后台（Jenkins / Druid / Grafana / Kibana / Swagger / Solr）做重点人工测试。
```

## 8. 注意事项与合规提醒

- 资产测绘本身只是 **被动信息收集**，不涉及对目标的主动攻击；
- 在 **未获得授权** 的情况下，请勿对测绘结果做进一步扫描或攻击；
- 大型企业的子域名数量可能破万，请配合 `-rl`（速率限制）控制扫描压力；
- 尊重目标的 robots 与节流策略，避免触发 429 / WAF；
- 测绘结果可能包含第三方资产（CDN、SaaS），需人工剔除。

## 9. 进一步学习

- **FOFA 官方文档**：https://fofa.info/api
- **Shodan 官方手册**：https://beta.shodan.io/search/filters
- **ZoomEye API**：https://www.zoomeye.org/doc
- **Quake 使用手册**：https://quake.360.net/quake/doc
- **资产测绘工具链**：OneForAll / Amass / Subfinder / httpx / naabu
- **指纹识别工具**：EHole / Glass / Finger / TideFinger

掌握四大平台 + 自动化脚本 + 指纹归并思路后，基本可以在 1~2 天内完成一家中大型企业的初步资产画像，为后续外网打点和定向攻击打下坚实基础。
