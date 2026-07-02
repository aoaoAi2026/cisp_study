# Day 17：DVWA实战-开放式重定向漏洞 Open HTTP Redirect

> **🎯 靶场实战** | 难度：⭐⭐ | 预计学习：45 分钟

---

# 第17章 DVWA实战：开放式重定向漏洞（钓鱼的黄金帮凶 🎣）

哈喽各位小伙伴们大家好！👋 欢迎来到第17章！

上一章 Day16 我们"烧脑"了一把 SQL 盲注——二分查找、逐个字符猜、时间延迟，相信你已经掌握了"在看不到数据库数据的时候，也能靠 True/False 或 时间差搞出所有信息"的硬核操作。😎

**今天这一章，难度断崖式下降！** 我们学一个"代码简单、原理简单、但在真实世界里**造成的财产损失和社会危害可能是所有漏洞里 Top 3**"的漏洞——**开放式重定向漏洞（Open Redirect / Unvalidated Redirect）**。

先看一个真实的**年度十大电信诈骗套路**里就有的场景👇

```
【📱 短信】【中国工商银行】尊敬的客户，您的电子密码器将于今日过期，
请立即登录我行网站 https://www.icbc.com.cn/login?redirect=https://xn--icbc-6j2du31bz9f.xn--fiqs8s/activate
进行激活，否则账户将被冻结。

👉 受害者一看：域名确实是 icbc.com.cn（工商银行官网），锁头也有，是 HTTPS！点进去！
👉 页面长这样：
    ┌─────────────────────────────────────────┐
    │ 🔒 https://www.icbc.com.cn/login        │
    │                                         │
    │  用户名： [_______________]             │
    │  密码：   [_______________]             │
    │  短信验证码：[_____]  [获取验证码]       │
    │               [登录并激活]  ⬅️ 点了它！│
    └─────────────────────────────────────────┘
👉 咔哒！！输入完点"登录并激活"的一瞬间！！
   页面就跳转到了：https://假工行.com/steal.php
   （页面还假模假样提示"激活成功，稍后自动跳转回首页"）
   😱 受害者啥都没察觉，但账号密码已经被黑客 POST 走了！！！
```

**这就是开放式重定向漏洞的威力！！** 它把 **100% 可信的官方域名**（icbc.com.cn）变成了黑客钓鱼链接的"合法外衣"——普通老百姓看地址栏、看 HTTPS 锁头、看备案号全是真的，但只要你点提交，**下一跳就是黑客的假网站**。这个漏洞本身**不直接偷数据**，但它是**社会工程学+钓鱼诈骗的"黄金放大器"**。

今天我们在 DVWA 里把 Open HTTP Redirect 的 **Low / Medium / High / Impossible** 四个级别挨个打穿，还要搞懂：
- 为什么 302 重定向能被"劫持到外网"？
- `strpos($_GET['url'], 'http') === 0` 这种看起来"已经校验过了"的代码为啥还能被绕过？
- 真正写对的重定向白名单长啥样？
- 作为普通用户，如何避免被这种"带官方域名的钓鱼链接"骗？
- 给零基础的你准备一张"Open Redirect 所有绕过姿势速查表"，背下来 CTF 秒拿 flag！🎯

坐稳扶好，我们出发！🚀

---

## 17.1 前置知识：到底什么是"重定向"？浏览器又是怎么跳的？ 🔀

### 17.1.1 生活比喻：火车站人工售票窗口的"指引员"

我们把浏览器想象成一个要去"指定目的地"的旅客，把 Web 服务器想象成火车站的售票窗口：

```
旅客（浏览器）：你好，我要去 A 窗口（URL：/redirect.php?forward=pageA.php）

窗口小哥（服务器）：好嘞！A 窗口今天不营业，你拿着这张红色小票（HTTP 302 状态码），
                    直接去写在小票上的那个地方（Location 头里的 URL）！
旅客：好嘞！（拿着小票二话不说就跑去了小票写的地方）

⚠️ 问题来了：如果"小票上写的目的地"不是站内的另一个窗口，而是"站外的诈骗团伙窝点"呢？
   旅客（浏览器）是不会质疑的！它看到 302 就会乖乖跳过去！这就是"漏洞"！
```

### 17.1.2 技术原理：HTTP 302 + Location Header

一次正常的重定向请求，数据包长这样👇（TCP 层面上的 HTTP 响应）：

```
HTTP/1.1 302 Found                    ← 状态码 302：告诉浏览器"临时搬到新地址了"
Location: /some/other/page.php        ← 关键！告诉浏览器"你去这个地址"
Content-Length: 0
Set-Cookie: ...

👉 浏览器收到 302 + Location 之后：不看响应 body！二话不说自动向 Location 里的 URL 再发一次 GET 请求。
```

**漏洞出在什么地方？**——**Location 头里的 URL 是完全由用户输入拼出来的、没有任何校验！**

如果用户输入的是 `forward=https://evil.com/phish.html`，服务器"傻呵呵"地拼到 Location 里：

```php
<?php
  $url = $_GET['forward'];  // 用户可控！
  header("Location: " . $url);  // 直接当成跳转目标！！
?>
```

浏览器收到的响应就是：
```
HTTP/1.1 302 Found
Location: https://evil.com/phish.html   ← 从官方域名 302 跳到黑客域名！
```

**✅ Open Redirect = 未校验的用户输入 + 直接拼到 Location 响应头里。** 就这么简单一行代码，就是一个高危漏洞！

下面这张 SVG 帮你把"正常站内跳转 vs 恶意站外跳转"的区别一眼看懂👇

<svg width="100%" viewBox="0 0 900 420" xmlns="http://www.w3.org/2000/svg" style="margin:20px 0;">
  <rect x="0" y="0" width="900" height="420" rx="14" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
  <text x="450" y="40" text-anchor="middle" font-family="Microsoft YaHei" font-size="20" fill="#1e3a8a" font-weight="bold">🔀 HTTP 302 重定向流程：正常站内跳转 vs 恶意站外跳转</text>
  <!-- 左侧：正常跳转 -->
  <g transform="translate(25,70)">
    <rect x="0" y="0" width="425" height="325" rx="14" fill="white" stroke="#16a34a" stroke-width="2.5"/>
    <rect x="0" y="0" width="425" height="48" rx="14" fill="#16a34a"/>
    <rect x="0" y="34" width="425" height="14" fill="#16a34a"/>
    <text x="212" y="30" text-anchor="middle" font-family="Microsoft YaHei" font-size="17" font-weight="bold" fill="white">✅ 正常跳转（站内 forward=home.php）</text>
    <!-- 浏览器 -->
    <g transform="translate(20,80)">
      <rect x="0" y="0" width="110" height="55" rx="8" fill="#dbeafe" stroke="#1d4ed8"/>
      <circle cx="14" cy="12" r="4" fill="#ef4444"/>
      <circle cx="28" cy="12" r="4" fill="#f59e0b"/>
      <circle cx="42" cy="12" r="4" fill="#22c55e"/>
      <rect x="5" y="24" width="100" height="24" rx="4" fill="white" stroke="#1d4ed8"/>
      <text x="55" y="40" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#1e3a8a">🌐 浏览器</text>
    </g>
    <text x="175" y="110" font-family="Consolas" font-size="12" fill="#16a34a" font-weight="bold">① GET</text>
    <polygon points="160,115 210,115 205,110 205,120" fill="#16a34a"/>
    <text x="175" y="135" font-family="Microsoft YaHei" font-size="10" fill="#166534">/redirect.php?forward=home.php</text>
    <!-- 服务器 -->
    <g transform="translate(285,80)">
      <rect x="0" y="0" width="120" height="55" rx="8" fill="#dcfce7" stroke="#15803d"/>
      <text x="60" y="24" text-anchor="middle" font-family="Microsoft YaHei" font-size="12" fill="#14532d" font-weight="bold">🖥️ 服务器</text>
      <text x="60" y="42" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#166534">icbc.com.cn</text>
    </g>
    <text x="175" y="180" font-family="Consolas" font-size="12" fill="#f59e0b" font-weight="bold">② 302 Found</text>
    <polygon points="210,185 160,185 165,180 165,190" fill="#f59e0b"/>
    <g transform="translate(145,195)">
      <rect x="0" y="0" width="145" height="30" rx="6" fill="#fef3c7" stroke="#d97706"/>
      <text x="72" y="20" text-anchor="middle" font-family="Consolas" font-size="11" fill="#92400e" font-weight="bold">Location: /home.php</text>
    </g>
    <text x="175" y="255" font-family="Consolas" font-size="12" fill="#16a34a" font-weight="bold">③ GET /home.php</text>
    <polygon points="160,260 210,260 205,255 205,265" fill="#16a34a"/>
    <text x="175" y="290" font-family="Microsoft YaHei" font-size="10" fill="#166534">👉 最终停留在【icbc.com.cn/home.php】✅ 安全</text>
  </g>
  <!-- 右侧：恶意跳转 -->
  <g transform="translate(455,70)">
    <rect x="0" y="0" width="425" height="325" rx="14" fill="white" stroke="#dc2626" stroke-width="2.5"/>
    <rect x="0" y="0" width="425" height="48" rx="14" fill="#dc2626"/>
    <rect x="0" y="34" width="425" height="14" fill="#dc2626"/>
    <text x="212" y="30" text-anchor="middle" font-family="Microsoft YaHei" font-size="17" font-weight="bold" fill="white">❌ 恶意跳转（forward=//evil.com）</text>
    <!-- 浏览器 -->
    <g transform="translate(20,80)">
      <rect x="0" y="0" width="110" height="55" rx="8" fill="#dbeafe" stroke="#1d4ed8"/>
      <circle cx="14" cy="12" r="4" fill="#ef4444"/>
      <circle cx="28" cy="12" r="4" fill="#f59e0b"/>
      <circle cx="42" cy="12" r="4" fill="#22c55e"/>
      <rect x="5" y="24" width="100" height="24" rx="4" fill="white" stroke="#1d4ed8"/>
      <text x="55" y="40" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#1e3a8a">🌐 浏览器</text>
    </g>
    <text x="175" y="110" font-family="Consolas" font-size="12" fill="#16a34a" font-weight="bold">① GET</text>
    <polygon points="160,115 210,115 205,110 205,120" fill="#16a34a"/>
    <text x="175" y="135" font-family="Microsoft YaHei" font-size="10" fill="#7f1d1d" font-weight="bold">/redirect.php?forward=//evil.com</text>
    <!-- 服务器 -->
    <g transform="translate(285,80)">
      <rect x="0" y="0" width="120" height="55" rx="8" fill="#dcfce7" stroke="#15803d"/>
      <text x="60" y="24" text-anchor="middle" font-family="Microsoft YaHei" font-size="12" fill="#14532d" font-weight="bold">🖥️ 服务器</text>
      <text x="60" y="42" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#166534">icbc.com.cn</text>
    </g>
    <text x="175" y="180" font-family="Consolas" font-size="12" fill="#f59e0b" font-weight="bold">② 302 Found</text>
    <polygon points="210,185 160,185 165,180 165,190" fill="#f59e0b"/>
    <g transform="translate(135,195)">
      <rect x="0" y="0" width="165" height="30" rx="6" fill="#fecaca" stroke="#dc2626"/>
      <text x="82" y="20" text-anchor="middle" font-family="Consolas" font-size="11" fill="#7f1d1d" font-weight="bold">Location: https://evil.com</text>
    </g>
    <text x="175" y="255" font-family="Consolas" font-size="12" fill="#dc2626" font-weight="bold">③ GET evil.com</text>
    <polygon points="160,260 210,260 205,255 205,265" fill="#dc2626"/>
    <text x="175" y="290" font-family="Microsoft YaHei" font-size="10" fill="#7f1d1d" font-weight="bold">👉 最终跑到【黑客服务器】❌ 被钓鱼！</text>
  </g>
</svg>

### 17.1.3 开放式重定向到底有啥危害？4 个真实场景

很多初学者会觉得："不就是跳个转吗？有啥大不了的？"——看完下面这 4 个你就懂了👇

| 危害级别 | 攻击场景 | 真实案例/原理 | 严重程度 |
|---|---|---|---|
| 🔥🔥🔥 顶级 | **钓鱼欺诈** | 银行/政务域名带 `?redirect=假网站`，受害者看到是真官网不怀疑，输密码就被偷走 | 🔴 高危，每年涉案金额数十亿 |
| 🔥🔥 高级 | **OAuth Token 窃取** | 登录授权 URL 里带 `redirect_uri=黑客域名`，用户点"同意授权"后 token 直接 POST 到黑客手里 | 🔴 高危，几乎所有大厂 OAuth 踩过 |
| 🔥 中级 | **XSS 放大器 / CSP 绕过** | 把 `javascript:` 协议丢进 Location，配合某些浏览器直接执行脚本（老版本） | 🟠 中危 |
| ⭐ 基础 | **网址/品牌信誉损害** | 官网链接跳去菠菜、黄色网站，被搜索引擎标记为"不安全" | 🟡 中危 |

> 🚨 **CISP-PTE 考点 + CTF 常考题型：** Open Redirect 是"逻辑漏洞四大金刚"（重定向+越权+验证码+支付逻辑）里最简单的一个，**每年 CISP-PTE 机试必考一题，CTF 入门赛基本一题 50 分起**，今天拿下它等于白捡分！🎉

---

## 17.2 正式闯关：DVWA Open Redirect Low 级别（完全裸奔）🔓

### 17.2.1 正常玩家视角：页面长啥样？

登录 DVWA → 切 security=**low** → 左侧点 **Open HTTP Redirect** 菜单。

你会看到一个提示：

```
Click to redirect the user.
👉 一个超链接：Redirect test #1
👉 点击链接后的 URL：/vulnerabilities/open_redirect/source/low.php?id=yes
```

点一下 "Redirect test #1"，浏览器会跳到 `/index.php`（站内首页）——**这是一个正常的"退出登录后跳首页"的功能**，id 参数决定"跳不跳转"，表面看不出毛病。

### 17.2.2 漏洞触发：把 `?id=yes` 换成 `?redirect=https://baidu.com`？不对，先看源码！

Low 级别的源码如下（**跟你想的可能不一样！** DVWA Low 不是直接 `?redirect=xxx` 那么直白）：

```php
<?php
if (array_key_exists ("redirect", $_GET) && $_GET['redirect'] != NULL) {
    header("Location: " . $_GET['redirect']);  // 直接拼用户输入到 Location！
    exit;
}
?>
```

哦！参数名不是 `id`，而是叫 **`redirect`**！

所以漏洞 payload 超级简单：**直接把任意 URL 填到 redirect 参数里**，服务器就会把它拼到 Location 里。下面给你 5 种不同的跳法（都属于 Low 级别 payload 大全），**零基础同学照着敲就行**👇

```
┌─ Low 级别 Payload 大全 ① 绝对路径形式 ────────────────────────────┐
│                                                                    │
│   http://192.168.56.102/dvwa/vulnerabilities/open_redirect/       │
│   source/low.php?redirect=https://www.baidu.com                   │
│                                                                    │
│   👉 点击后：HTTP 302 → 直接跳百度！✅                             │
└────────────────────────────────────────────────────────────────────┘

┌─ ② 协议相对路径形式（绕过必须 http 开头的简单检测）────────────────┐
│                                                                    │
│   ?redirect=//www.baidu.com                                        │
│                                                                    │
│   👉 浏览器会自动补全当前协议 http(s):// + //域名，照样跳外网！✅   │
└────────────────────────────────────────────────────────────────────┘

┌─ ③ 只带 // 的最短形式（CTF 里的常客）────────────────────────────┐
│                                                                    │
│   ?redirect=//evil.com                                             │
│                                                                    │
│   👉 跟 ② 完全等价，比 http://evil.com 少写 7 个字符！✅           │
└────────────────────────────────────────────────────────────────────┘

┌─ ④ 内网 SSRF 配合使用（Day23 SSRF 会展开，今天先记住）────────────┐
│                                                                    │
│   ?redirect=http://127.0.0.1:6379                                  │
│   ?redirect=file:///etc/passwd                                     │
│                                                                    │
│   👉 可以跳去内网、跳去 file 协议读文件！✅（某些浏览器限制 file）  │
└────────────────────────────────────────────────────────────────────┘

┌─ ⑤ javascript: 伪协议（老版本 Chrome/IE 会执行 XSS）──────────────┐
│                                                                    │
│   ?redirect=javascript:alert(document.cookie)                      │
│                                                                    │
│   👉 现在主流浏览器会禁止 Location 跳 javascript: 执行，了解即可！ │
└────────────────────────────────────────────────────────────────────┘
```

### 17.2.3 Low 源码解析：问题就出在一行代码上 💻

```php
<?php
// vulnerabilities/open_redirect/source/low.php
if (array_key_exists("redirect", $_GET) && $_GET['redirect'] != NULL) {
    // ⚠️ 致命问题：用户的 redirect 参数 100% 原样进 Location！
    header("Location: " . $_GET['redirect']);
    exit;
}
?>
```

**Low 级别问题总结（2 点）：**
1. **❌ 完全没有白名单 / 黑名单校验：** 没判断 redirect 是不是站内路径、有没有包含自己域名
2. **❌ 没有限制协议：** http/https/file/javascript 都能进 Location 头

**修复方向（Low → Impossible）：** 用**严格白名单**（`$allow_list = ['/index.php', '/login.php', '/home.php']`），**只允许跳本站的相对路径**，详见 17.5 节。

---

## 17.3 Medium 级别：加了 `strpos` 检测？有 3 种绕过！🚩

Medium 级别是 DVWA 里"最具有教育意义"的一个级别——开发者**自以为**加了防护，实际上 **3 种姿势就能绕过去**，而且每一种都是真实护网里的 Payload！

### 17.3.1 先看 Medium 源码，开发者加了什么"防护"？

```php
<?php
if (array_key_exists("redirect", $_GET) && $_GET['redirect'] != NULL) {
    $target = $_GET['redirect'];
    // 开发者：嗯！我只允许以 http:// 开头的 URL，防止相对路径乱跳！完美！😎
    if (strpos($target, "http://") === 0 || strpos($target, "https://") === 0) {
        header("Location: " . $target);  // 直接跳转
        exit;
    } else {
        // 非 http(s):// 开头？不让跳！（开发者觉得"安全了"）
        header("Location: /index.php");
    }
}
?>
```

开发者的"安全逻辑"翻译成人话：

> **"我只允许跳 http:// 或 https:// 开头的 URL，这样重定向就只能是合法的绝对链接了！我的网站无敌了！"** 🤣🤣🤣

哈哈哈哈这是最经典的"**校验了个寂寞**"——坏人要跳的恶意网站本来就是 `https://evil.com`，它本来就以 `https://` 开头啊！！😆

**绕过方法 ①：用本来就 https:// 开头的恶意域名（最朴素也最有效）**

```
✅ Payload：
/vulnerabilities/open_redirect/source/medium.php?redirect=https://www.baidu.com

👉 结果：直接跳外网！strpos() 判断为真，完美放行！
```

**这就是为什么 DVWA Medium 里这个校验等于没加。** 真实世界里可能会写"必须包含 `example.com`"，那我们继续往下看另外两种更高阶的绕过。

### 17.3.2 绕过方法 ②：使用 `@` 符号，把 `example.com` 变成"假的 Basic Auth 用户名"

这是 CTF 里绕"必须包含 xxx.com"的**头号大招**！**HTTP 协议规定：** URL 格式里 `https://用户名:密码@域名/路径`，@前面的部分是 Basic Auth 的用户名，**根本不是域名！** 浏览器会自动忽略 @ 之前的部分，直接访问 @ 后面的真实域名！

```
真实例子：
https://evil.com@google.com   →   浏览器实际跳去的是：✅ google.com
https://baidu.com@evil.com    →   浏览器实际跳去的是：✅ evil.com！
```

**假设 Medium 加了"必须包含 baidu.com"的校验，Payload 长这样：**

```
绕过前：https://evil.com                → ❌ 校验失败（没有 baidu.com）
绕过：  https://baidu.com@evil.com      → ✅ strpos("baidu.com") 命中！实际跳 evil.com！
```

**太帅了有没有！！** 真实浏览器拿到这个 URL 会直接把 `baidu.com` 解释成 Basic Auth 账号，后面才是真正要去的域名 😎。

### 17.3.3 绕过方法 ③：使用 `#` 锚点/或 `?` 参数，把白名单域名丢到不被解析的位置

跟绕过方法 ② 是同一种思路——**让"被要求出现的字符串"出现在 URL 里，但位置不影响真实跳转目标**。

- **用 `?` 查询参数：**
  ```
  白名单要求：URL 里必须包含 example.com
  Payload：  https://evil.com?example.com
             ✅ 包含了！但它只是查询参数的一部分，实际去 evil.com
  ```
- **用 `#` 锚点片段：**
  ```
  Payload：  https://evil.com#https://example.com
             ✅ 既包含了 http:// 开头（Medium 当前校验），
             又能把 example.com 塞到不影响解析的锚点里。
  ```
- **用 `.` 做子域名绕过（真实业务如果校验 "域名包含 example.com"）**
  ```
  白名单要求：strpos($url, 'example.com') !== false
  Payload：  https://example.com.evil.com
             ✅ 子域名方式包含 example.com，实际去 evil.com 的子域名！
  ```

### 17.3.4 一张速查表记住所有 Medium/通用绕过姿势（面试/CTF 背它）

<svg width="100%" viewBox="0 0 900 530" xmlns="http://www.w3.org/2000/svg" style="margin:20px 0;">
  <rect x="0" y="0" width="900" height="530" rx="14" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>
  <text x="450" y="40" text-anchor="middle" font-family="Microsoft YaHei" font-size="20" fill="#78350f" font-weight="bold">📋 Open Redirect 绕过姿势速查表（CISP/CTF 必背！）</text>
  <!-- 列1 -->
  <g transform="translate(25,70)">
    <rect x="0" y="0" width="280" height="110" rx="12" fill="white" stroke="#dc2626" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="38" rx="12" fill="#dc2626"/>
    <rect x="0" y="27" width="280" height="11" fill="#dc2626"/>
    <text x="140" y="23" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" fill="white" font-weight="bold">姿势 1 @ 认证绕过</text>
    <rect x="10" y="50" width="260" height="28" rx="6" fill="#0f172a"/>
    <text x="140" y="68" text-anchor="middle" font-family="Consolas" font-size="12" fill="#fbbf24">https://白名单@evil.com</text>
    <text x="140" y="100" text-anchor="middle" font-family="Microsoft YaHei" font-size="12" fill="#7f1d1d">白名单丢到 Basic Auth 用户名位</text>
  </g>
  <!-- 列2 -->
  <g transform="translate(310,70)">
    <rect x="0" y="0" width="280" height="110" rx="12" fill="white" stroke="#ea580c" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="38" rx="12" fill="#ea580c"/>
    <rect x="0" y="27" width="280" height="11" fill="#ea580c"/>
    <text x="140" y="23" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" fill="white" font-weight="bold">姿势 2 子域名 . 绕过</text>
    <rect x="10" y="50" width="260" height="28" rx="6" fill="#0f172a"/>
    <text x="140" y="68" text-anchor="middle" font-family="Consolas" font-size="12" fill="#fbbf24">https://白名单.evil.com</text>
    <text x="140" y="100" text-anchor="middle" font-family="Microsoft YaHei" font-size="12" fill="#9a3412">把白名单变成 evil.com 的子域</text>
  </g>
  <!-- 列3 -->
  <g transform="translate(595,70)">
    <rect x="0" y="0" width="280" height="110" rx="12" fill="white" stroke="#ca8a04" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="38" rx="12" fill="#ca8a04"/>
    <rect x="0" y="27" width="280" height="11" fill="#ca8a04"/>
    <text x="140" y="23" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" fill="white" font-weight="bold">姿势 3 ? 查询参数绕过</text>
    <rect x="10" y="50" width="260" height="28" rx="6" fill="#0f172a"/>
    <text x="140" y="68" text-anchor="middle" font-family="Consolas" font-size="12" fill="#fbbf24">https://evil.com?白名单</text>
    <text x="140" y="100" text-anchor="middle" font-family="Microsoft YaHei" font-size="12" fill="#713f12">白名单塞到不解析的 query 里</text>
  </g>
  <!-- 第二行 -->
  <g transform="translate(25,200)">
    <rect x="0" y="0" width="280" height="110" rx="12" fill="white" stroke="#16a34a" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="38" rx="12" fill="#16a34a"/>
    <rect x="0" y="27" width="280" height="11" fill="#16a34a"/>
    <text x="140" y="23" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" fill="white" font-weight="bold">姿势 4 # 锚点绕过</text>
    <rect x="10" y="50" width="260" height="28" rx="6" fill="#0f172a"/>
    <text x="140" y="68" text-anchor="middle" font-family="Consolas" font-size="12" fill="#fbbf24">https://evil.com#白名单</text>
    <text x="140" y="100" text-anchor="middle" font-family="Microsoft YaHei" font-size="12" fill="#14532d">锚点部分浏览器不会发给服务器</text>
  </g>
  <g transform="translate(310,200)">
    <rect x="0" y="0" width="280" height="110" rx="12" fill="white" stroke="#0ea5e9" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="38" rx="12" fill="#0ea5e9"/>
    <rect x="0" y="27" width="280" height="11" fill="#0ea5e9"/>
    <text x="140" y="23" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" fill="white" font-weight="bold">姿势 5 // 协议相对</text>
    <rect x="10" y="50" width="260" height="28" rx="6" fill="#0f172a"/>
    <text x="140" y="68" text-anchor="middle" font-family="Consolas" font-size="12" fill="#fbbf24">//evil.com/白名单</text>
    <text x="140" y="100" text-anchor="middle" font-family="Microsoft YaHei" font-size="12" fill="#075985">绕过"必须以 / 开头"的检查</text>
  </g>
  <g transform="translate(595,200)">
    <rect x="0" y="0" width="280" height="110" rx="12" fill="white" stroke="#7c3aed" stroke-width="2"/>
    <rect x="0" y="0" width="280" height="38" rx="12" fill="#7c3aed"/>
    <rect x="0" y="27" width="280" height="11" fill="#7c3aed"/>
    <text x="140" y="23" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" fill="white" font-weight="bold">姿势 6 路径穿越 ../</text>
    <rect x="10" y="50" width="260" height="28" rx="6" fill="#0f172a"/>
    <text x="140" y="68" text-anchor="middle" font-family="Consolas" font-size="12" fill="#fbbf24">/白名单/../../evil/</text>
    <text x="140" y="100" text-anchor="middle" font-family="Microsoft YaHei" font-size="12" fill="#4c1d95">绕过"必须以 /白名单"开头</text>
  </g>
  <!-- 实战口诀 -->
  <g transform="translate(25,335)">
    <rect x="0" y="0" width="850" height="170" rx="14" fill="#0f172a" stroke="#334155" stroke-width="2"/>
    <text x="425" y="35" text-anchor="middle" font-family="Microsoft YaHei" font-size="17" fill="#fbbf24" font-weight="bold">🎯 Open Redirect 万能绕过口诀（背这 6 句够你过 99% 的 WAF / 校验）</text>
    <g transform="translate(30,55)">
      <text x="0" y="0" font-family="Microsoft YaHei" font-size="14" fill="#a5f3fc">① 怕校验"以 http 开头"？用「//evil.com」协议相对，少写 7 字母！</text>
      <text x="0" y="30" font-family="Microsoft YaHei" font-size="14" fill="#86efac">② 怕校验"包含白名单域名"？用「白名单@evil.com」把域名塞 Basic Auth 用户名里！</text>
      <text x="0" y="60" font-family="Microsoft YaHei" font-size="14" fill="#fde68a">③ 还是不行？「白名单.evil.com」子域名大法！看起来有白名单，实际全是我的地牌！</text>
      <text x="0" y="90" font-family="Microsoft YaHei" font-size="14" fill="#fecaca">④ 「https://evil.com?白名单」丢查询参数；「#白名单」丢锚点，能出现就行不影响解析！</text>
      <text x="0" y="120" font-family="Microsoft YaHei" font-size="14" fill="#ddd6fe">⑤ 路径白名单？「/whitelist/../../../../target」../ 路径穿越（Day18 文件上传我们还会用到）</text>
    </g>
  </g>
</svg>

### 17.3.5 Medium 源码解析 & 修复思路

```php
<?php
if (array_key_exists("redirect", $_GET) && $_GET['redirect'] != NULL) {
    $target = $_GET['redirect'];
    if (strpos($target, "http://") === 0 || strpos($target, "https://") === 0) {
        // ⚠️ 伪防护：我们要跳的黑客域名本来就 https:// 开头啊！
        header("Location: " . $target);
        exit;
    } else {
        header("Location: /index.php");
    }
}
?>
```

**Medium 级别的致命错误：** 它写了校验，但校验的是**无关紧要的条件**（是不是 http(s) 开头），而真正应该校验的——**是不是只允许跳本域名、本路径**，它一个字都没做！

> 💡 零基础启示：**做安全校验，要校验"你允许的最小集合（白名单）"，而不是校验"你觉得坏的（黑名单/前缀）"。**
> 开发者的"嗯我只允许 http 开头"就是黑名单思路的反面教材——坏人合法使用 http，你就被干穿了。

---

## 17.4 High 级别：必须 `id=yes`？但 redirect 参数没校验啊！🤔

切 security=**high**，High 级别的源码看起来稍微"复杂"了一点：

```php
<?php
if (array_key_exists ("redirect", $_GET) && $_GET['redirect'] != NULL) {
    // 伪防护：要求同时带了 id 参数
    if (! (array_key_exists("id", $_GET) && $_GET['id'] == "yes")) {
        header("Location: /index.php?redirectError");
        exit;
    }
    // ⚠️ 但是... redirect 参数依然是直接拼！！完全没校验！！
    header("Location: " . $_GET['redirect']);
    exit;
}
?>
```

哈哈哈又是经典"**前门加锁后门全开**"系列 😂——开发者怕别人"直接调用 redirect.php"，于是加了个"必须带 `id=yes` 才能触发跳转"的前置校验。但**真正的漏洞点 `redirect` 参数**，它跟 Low 级别一模一样！！啥都没改！

**绕过方法：把 `id=yes` 也带上就行！**

```
✅ High 级别 Payload：
/vulnerabilities/open_redirect/source/high.php?id=yes&redirect=https://www.baidu.com

👉 先满足 id=yes（过"不能直接调用"的校验），再把跳的地址写 redirect 里，完美 302 跳外网！
```

**High 级别伪防护总结：** 加了个 id=yes 的"存在性检测"，就像**你在防盗门上焊死 10 把锁，但是旁边那堵墙用的是纸糊的**😂。

---

## 17.5 Impossible 级别：终于写对了！严格白名单 + 相对路径 ✅

```php
<?php
// 白名单！只允许跳这三个页面！其他一律跳首页
$allowedRedirects = array(
    "index.php",
    "instructions.php",
    "setup.php",
);
if (array_key_exists("redirect", $_GET) && $_GET['redirect'] != NULL) {
    $target = $_GET['redirect'];
    // ✅ 正确1：in_array() 严格匹配白名单，一点都不能多、不能少
    if (in_array($target, $allowedRedirects, true)) {
        header("Location: " . $target);
        exit;
    } else {
        // ✅ 正确2：不匹配？给一个统一错误页，不泄露任何东西
        header("Location: /index.php?redirectError=invalid");
    }
}
?>
```

**Impossible 级别的三层正确写法（必背！⭐⭐⭐）：**
1. **✅ 白名单 `in_array` 严格匹配（第 3 参数 true=类型严格）**：不是"包含"、不是"前缀"、不是"后缀"，是**完完全全一字不差**等于白名单里的条目
2. **✅ 只允许"站内相对路径"，不接受 http/https 外站链接**：Location 跳 `index.php` = 站内；跳 `https://evil.com` = 外站（直接被白名单拒绝）
3. **✅ 非法 URL 统一跳错误页**：不返回任何"你错在哪个字符"的信息，防止攻击者用"反馈差异"绕过白名单

> 🔥 **安全开发铁律：** 做 Redirect、做文件上传后缀、做下载白名单……**一切涉及"允许去哪里/允许传什么"的场景，通通白名单+严格匹配，别想黑名单和 strpos！**

---

## 17.6 真实世界钓鱼案例 + 普通用户如何防骗？💸

### 17.6.1 一个真实的重定向钓鱼攻击链（跟 DVWA 一模一样）

```
🎭 攻击链条 8 步走：
① 黑客注册了一个看起来跟淘宝像的域名：taobao-login-verify.com
② 黑客发现淘宝有 Open Redirect 漏洞：
   https://login.taobao.com/redirect.go?url=任意网址
③ 黑客把链接拼接好：
   https://login.taobao.com/redirect.go?url=https://taobao-login-verify.com
④ 黑客群发短信/邮件：
   【淘宝】您的账号因异常登录被锁定，请立即打开
   https://login.taobao.com/redirect.go?url=https://taobao...
⑤ 受害者一看：URL 域名是 login.taobao.com！真淘宝！点！
⑥ 淘宝服务器 302 跳 taobao-login-verify.com（受害者没察觉）
⑦ 假淘宝页面跟真淘宝一模一样，受害者输入账号/密码/短信码
⑧ 黑客拿到信息 → 登录真淘宝 → 清空余额/下单买礼品卡 😭
```

### 17.6.2 给零基础同学的 4 条防骗 Checklist（比反诈 APP 还好用！）

```
✅ 防骗 Check 1：提交敏感信息（密码/验证码/身份证）前，
   一定看"第二次加载出来"的页面的地址栏是不是官方域名！
   ↳ 重定向漏洞的特点就是"点完按钮/链接的第二跳才是假网站"，第一跳是真的！

✅ 防骗 Check 2：永远不要相信短信/微信发来的"紧急激活/紧急解封"链接。
   ↳ 正确做法：自己从手机桌面打开官方 APP，在 APP 里看消息！

✅ 防骗 Check 3：看到 URL 里包含 `?redirect=` / `?next=` / `?url=` / `?go=` / `?callback=`
   ↳ 多留一个心眼！把等号后面的那一串解码一下，是不是跳外站了？

✅ 防骗 Check 4：银行/支付类页面，点"登录"按钮之前，
   一定把 F12 → Network 打开看一下表单 action 是不是官方域名！
   ↳ 防止"假页面做得跟真的一毛一样"这种情况。
```

---

## 17.7 课后自测 + 作业 📝（零基础必做！）

### 📝 题 1：选择题（每题 10 分，共 30 分）

**1. 某 PHP 代码里有一行 `header("Location: ".$_GET['next'])`，它属于什么漏洞？**
- A. SQL 注入
- B. 开放式重定向（Open Redirect）
- C. XSS 跨站脚本
- D. CSRF 跨站请求伪造

**2. 某开发者想防止 Open Redirect，写了 `if(strpos($url,'.qq.com')!==false)` 放行，下列哪个 Payload 能成功绕过去跳外站？**
- A. `https://evil.com/?next=qq.com`
- B. `https://qq.com@evil.com/`
- C. `https://evil.com/#https://www.qq.com/`
- D. **以上三个都可以** ✨

**3. 修复 Open Redirect 最正确的姿势是？**
- A. `if (strpos($url, 'http') !== false)` 判断是否 http 开头
- B. 用 `in_array($url, ['/index.php','/login.php'], true)` 严格匹配白名单相对路径
- C. 把所有 `//evil.com` 替换成空字符串
- D. 禁止所有 302 跳转，全部改成 Meta Refresh 标签

### 🔧 题 2：实操题（每题 25 分，共 50 分）

**实操 1：Low / Medium / High 三级分别出一个 302 跳外站的 payload**
打开你的 DVWA，security 分别切 low/medium/high，进 Open HTTP Redirect，然后构造 payload，**用浏览器 F12 → Network 面板截一张 302 Location 指向外站的截图**，三级各一张。

**实操 2：写出 3 种"要求 URL 包含 taobao.com 但实际要跳 127.0.0.1"的绕过 URL**
（提示：今天 17.3 节的速查表，挑 3 个你觉得最帅的姿势！）

### 💡 题 3：思考题（20 分）

> 你是公司的安全工程师，产品经理说"业务方要求我们的登录页支持跳转到任意合作方的域名，合作方名单随时加**上百个**"，不能写死数组白名单。
>
> 请写出你会怎么设计"既满足业务又不产生 Open Redirect 漏洞"的方案？
>
> （**小提示：** Day12 CAPTCHA 我们学过一个"两步流程：第一步校验 CAPTCHA→ 返回 step2 表单，第二步才真正改密码"的思路，能不能把"跳外部域名"做成一个**用户可感知的"中转提示页"**？写清楚提示语 `您即将离开本网站，前往 xxx.com，是否继续？[取消] [继续前往]`，这就是大厂们都在用的"外链跳转提示页"！）

---

## 17.8 本章小结 + 下章预告 🚀

**🎉 Day17 开放式重定向 通关总结：**
- ✅ 搞懂了 HTTP 302 + Location 的基本工作原理 = 浏览器"看到小票就乖乖跑下一家"
- ✅ 搞懂了开放式重定向的 4 大危害：**钓鱼 / OAuth 偷 token / XSS 放大器 / 品牌污损**
- ✅ Low 级别完全无校验的裸跳漏洞，5 种不同 payload 打穿
- ✅ Medium 级别的 3 种绕过：**直接 http 开头本身合法 / @ 丢 Basic Auth / ? 或 # 把白名单丢不解析位**
- ✅ 拿到了 **6 条万能绕过速查表**（@ / 子域名 / ? / # / 协议相对 // / 路径穿越 ../）
- ✅ High 级别"加 id=yes 校验但 redirect 依然裸奔"的前门加锁后门全开案例
- ✅ Impossible 级别正确修复三件套：**in_array 严格白名单 + 只允许相对路径 + 非法统一错误页**
- ✅ 学会了 4 条防骗 Checklist，保护自己和家人不上"官方域名钓鱼短信"的当！

重定向漏洞今天拿下来之后，我们 DVWA 的**"逻辑漏洞四大金刚"**（CAPTCHA 已学、Weak Session 已学、Redirect 已学）就只剩最后一个了——**Header Injection HTTP 头注入 + 一些 DVWA 彩蛋漏洞（XSS Reflected 没讲的进阶玩法、CSRF 新姿势等）**。

**下一章 Day18：HTTP Header Injection HTTP 头注入**，我们会看到"开发者把用户可控的内容拼到 Set-Cookie、Location、Host 这些 HTTP 响应头里，导致被注入 CRLF `%0d%0a` 换行符之后，**一行注入变两行、Set-Cookie 被篡改、Location 被拼外站、甚至直接加 script 标签打 XSS**"的操作，以及最后一份 **DVWA 各模块速通 CheatSheet**（给你考前一晚上过一遍就能上场的神器），绝对干货满满！💪

**同学们把 6 条万能绕过口诀背下来！Day18 我们不见不散！👋**
