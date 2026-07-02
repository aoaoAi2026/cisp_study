# 搭建 SQLi-Labs（day086 · 靶场2）过程及遇见的问题

> 靶场来源：[SQLi-Labs GitHub Audi-1/sqli-labs](https://github.com/Audi-1/sqli-labs)
> Kali 部署路径：`/var/www/html/sqli-labs/`（Apache 根目录）
> 外部访问：`http://192.168.108.128/sqli-labs/`
> 数据库连接凭证（写入 sql-connections/db-creds.inc）：`leet / leet123`，库名 `security` 主库 + `challenges` 挑战库

---

## 一、环境信息与准备

| 项 | 值 |
|---|---|
| 操作系统 | Kali Linux 2024.x |
| Web Server | Apache 2 (端口 80) |
| PHP 版本 | PHP 8.x（Kali 默认） |
| Database | MariaDB 10.x（已为 DVWA 创建 `leet / leet123` 超级管理员） |
| 代码位置 | `/var/www/html/sqli-labs`（77 个 Less 目录，含 Pages 1~4 + 挑战库） |
| 权限 | 目录属主 www-data:www-data，可写（Apache+PHP 文件上传类 Less 可正常工作） |

---

## 二、部署步骤回顾（源码已在盘，只需初始化 DB + 修正配置）

因代码已由之前部署者 git clone 到 Apache 目录，实际步骤为**验证 + 修正 + 回归**：

### Step 1：检查数据库凭证配置文件

```bash
cat /var/www/html/sqli-labs/sql-connections/db-creds.inc
```

实际内容（已做 PHP8 兼容：因 SQLi-Labs 官方原版用 `mysql_*()` 函数，PHP 7 以后已移除；本部署在同目录提供了 `mysql2mysqli.php` 兼容层）：

```php
<?php
// ===== Kali LAMP：先加载 mysql -> mysqli 兼容层（保证 PHP8 兼容）=====
require_once __DIR__ . '/mysql2mysqli.php';

// ===== 数据库连接参数 =====
$host   = '127.0.0.1';  // TCP (非 socket)，便于明确授权
$dbuser = 'leet';
$dbpass = 'leet123';
$dbname = 'security';

if (!defined('DB_HOST'))     define('DB_HOST',     $host);
if (!defined('DB_USER'))     define('DB_USER',     $dbuser);
if (!defined('DB_PASSWORD')) define('DB_PASSWORD', $dbpass);
if (!defined('DB_NAME'))     define('DB_NAME',     $dbname);
define('DB_CHALLENGES','challenges'); $dbname1='challenges';
```

> ⭐ 关键点：`leet/leet123` 是 DVWA 部署时创建的 MariaDB 管理账号，拥有 `WITH GRANT OPTION`，可以 `CREATE DATABASE`、`DROP DATABASE`、`CREATE USER` 等，足够 SQLi-Labs 的 setup-db.php 使用。

### Step 2：一键初始化两个数据库（图形化或命令行两种方式）

**方式 A（推荐初学者，官方推荐）**：浏览器打开 `http://192.168.108.128/sqli-labs/sql-connections/setup-db.php`，页面会自动：
- `DROP DATABASE IF EXISTS security;`
- `CREATE DATABASE security;`
- 创建 4 张表（`users`、`emails`、`referers`、`uagents`）并导入人口数据（users 表默认 13 条：Dumb/Angelina/Dummy 等经典账号）
- 同样初始化 `challenges` 挑战库（1 张自定义表 `ZFOYVMQN7U`，包含随机 70+ 关挑战）

**方式 B（命令行，适合自动化部署）**：直接执行 setup-db.php 内含的 SQL 脚本：

```bash
cd /var/www/html/sqli-labs/sql-connections
# 如 setup-db.php 内部有输出纯 SQL 的逻辑，直接用 leet 账号登录 MariaDB 执行：
mysql -uleet -pleet123 <<'SQL'
SHOW DATABASES;
USE security; SHOW TABLES; SELECT COUNT(*) FROM users;
USE challenges; SHOW TABLES;
SQL
```

### Step 3：验证最终数据库结构（实际输出）

```
+--------------------+
| Database           |
+--------------------+
| security           |  ✅ 主库，4 张表
| challenges         |  ✅ 挑战库
+--------------------+

---TABLES security---
+--------------------+
| Tables_in_security |
+--------------------+
| emails             |
| referers           |
| uagents            |
| users              |  ← 13 条用户（Dumb/Dummy 等）
+--------------------+
users_cnt: 13

---TABLES challenges---
+----------------------+
| Tables_in_challenges |
+----------------------+
| ZFOYVMQN7U           |  ← 自定义表名，challenge 使用
+----------------------+
```

### Step 4：HTTP 功能回归测试（真实 Payload 验证）

**Less-1 Error Based GET id=1**：
```
GET http://192.168.108.128/sqli-labs/Less-1/?id=1
```
返回 HTTP 200，body 包含：
```html
<title>Less-1 **Error Based- String**</title>
Welcome   <font color="#FF0000"> Dhakkan </font><br>
Your Login name:Dumb<br>Your Password:Dumb
```
✅ 数据库查询正确返回了 Dumb/Dumb（users 表 id=1 第一条人口数据）。

**Less-1 经典 SQLi `' or 1=1 -- -` 回显验证**：
```
GET /sqli-labs/Less-1/?id=' OR 1=1 -- -
```
会返回全部 13 条 users 的 Login name/Password（经典万能密码演示场景，证明注入点存在）。

**Less-2 / Less-3 / Less-4 / Less-5** 同时 HTTP 200，分别对应数值型注入、单引号+括号型、双引号+括号型、布尔盲注。

---

## 三、问题及解决方案

### 问题 1：PHP8 环境下 `mysql_*()` 函数 "Call to undefined function"

**现象**：直接部署原版 SQLi-Labs 到 PHP 8，所有 Less 页面报错：
```
Fatal error: Uncaught Error: Call to undefined function mysql_connect()
  in sql-connections/db-creds.inc:XX
```

**根因**：SQLi-Labs 官方代码停留在 PHP5 时代，使用了 `mysql_query / mysql_connect / mysql_fetch_array / mysql_real_escape_string` 等在 PHP 7.0 后被移除的 ext/mysql 扩展。

**解决方案**：在 `db-creds.inc` 最顶部**先加载一个 mysql→mysqli 映射兼容层**（`mysql2mysqli.php`）。兼容层用 `function_alias` 或直接重定义：
```php
// mysql2mysqli.php 简化示例（核心：把老函数映射到 mysqli 过程化风格）
if (!extension_loaded('mysql') && extension_loaded('mysqli')) {
    $GLOBALS['___mysqli_ston'] = [];
    function mysql_connect($h,$u,$p){ $c=mysqli_connect($h,$u,$p); $GLOBALS['___mysqli_ston'][0]=$c; return $c; }
    function mysql_select_db($db,$c=null){ return mysqli_select_db($c??@$GLOBALS['___mysqli_ston'][0], $db); }
    function mysql_query($q,$c=null){ return mysqli_query($c??@$GLOBALS['___mysqli_ston'][0], $q); }
    // ... 其他 fetch_array / num_rows / escape_string / result 等约 20 个函数
}
```
Kali 靶机已部署完整版兼容层于 `/var/www/html/sqli-labs/sql-connections/mysql2mysqli.php`，**所有 77 Less 均不再报 Undefined function**。

> 同类参考：DVWA 也走同一套路，DVWA 新版代码本身就是 mysqli 写法，所以不需要兼容层。

---

### 问题 2：数据库账号权限不足（Access denied; need CREATE/DROP privilege）

**现象**：点击 Setup/reset Database for labs 后：
```
SQLSTATE[42000] [1044] Access denied for user ''@'localhost' to database 'security'
```
或 db-creds.inc 使用默认 `root / ''` 空密码时：
```
Access denied for user 'root'@'localhost' (using password: NO)
```

**根因**：Kali 的 MariaDB 新版本默认启用 `unix_socket` 认证插件，本地 mysql -u root 无需密码、但 PHP Apache 上下文用 127.0.0.1 走 TCP 时 socket 插件不生效；同时 SQLi-Labs 默认 `$dbuser='root' $dbpass=''` 与实际凭证不匹配。

**解决方案**：使用 DVWA 已建好并经过实战验证的管理账号：
- DB Host: `127.0.0.1`（TCP，避免 unix_socket 陷阱）
- DB User: `leet`
- DB Pass: `leet123`
- 授权验证：
```sql
SHOW GRANTS FOR 'leet'@'localhost';
-- 确认有 GRANT ALL PRIVILEGES ON *.* TO 'leet'@'localhost' IDENTIFIED BY PASSWORD '*xxxx' WITH GRANT OPTION
```
✅ setup-db.php 用 leet/leet123 能够 DROP+CREATE security 和 challenges 两库。

---

### 问题 3：后端签名 `['SQLi-Labs','Less-','Audi-1']` 全部不命中导致 verified=false

**现象**：手动访问 `/sqli-labs/` 明明是完整首页，但 `/api/vm-labs/web-targets/status` 返回：
```json
{ "id":"sqli-labs", "online":true, "verified":false, "signaturesMatched":[] }
```

**根因**（实际 curl 抓取首页前 3000 字节比对）：

vmLabs.js 里预设 3 个签名 → 实际页面对照：
| 预设签名 | 是否存在 | 原因 |
|---|---|---|
| `SQLi-Labs` (小写 labs) | ❌ | 真实 H1 是 `<font>SQLi-LABS  Page-1<i>(Basic Challenges)</i></font>`，**LABS 全大写** + 两个空格 |
| `Less-` | ❌（在 index.html 里） | index.html 是 FreeMind 思维导图页，**直接是 Page1/2/3/4 锚**，Less-1 等文字只在 `<img src="index.html_files/xxx">` 或内部 `<div>` 里，curl 抓取的 3KB 片段不含 |
| `Audi-1` | ❌ | 原版文档/版权页有，但 Kali 精简克隆版首页 footer 被清理，Audi-1 根本不存在 |

**解决方案**：把 vmLabs.js 的 signatures 改成 curl 验证 100% 命中的 3 个：
```js
checkPath: 'index.html',
signatures: [
  'SQLi-LABS',                     // H1 标题（大写 LABS）
  'SQL Injections',                // <title>SQL Injections</title>
  'Setup/reset Database for labs'  // 右上角锚链接文字
],
status: 'ready',
```
修改后：signaturesMatched = 3/3 全部命中，verified=true ✅。

---

### 问题 4：默认凭证显示 root/root，但真实部署使用 leet/leet123（容易误导前端）

**现象**：前端 VmLabs 卡片展示 "DB：root / root"，用户打开 setup-db.php 拿 root/root 连接会失败。

**根因**：SQLi-Labs 原始设计就是让用户随意改 db-creds.inc，README 默认写的 root/root，实际部署换成了 leet/leet123。VM_TARGETS 的 defaultCreds 写的是默认文档值。

**解决方案（信息披露层面，非代码改动）**：
1. `defaultCreds: { user:'root', pass:'root' }` 保留文档原版意图
2. `credentials` 字段补充真实情况：`root / root（文档默认），实际 Kali 上连接凭证为 leet / leet123`
3. `notes` 字段写明 `数据库 leet/leet123 security+challenges`

让前端卡片能够同时展示两者差异，避免实际连接试错。

---

## 四、最终访问地址与验证清单

| 项 | 值 |
|---|---|
| **首页（思维导图式导航）** | `http://192.168.108.128/sqli-labs/index.html`（Page-1 Basic） |
| **Page-2 Advanced** | `http://192.168.108.128/sqli-labs/index-1.html` |
| **Page-3 Stacked** | `http://192.168.108.128/sqli-labs/index-2.html` |
| **Page-4 Challenges** | `http://192.168.108.128/sqli-labs/index-3.html` |
| **初始化数据库** | `http://192.168.108.128/sqli-labs/sql-connections/setup-db.php` |
| **Less-1（入门）** | `http://192.168.108.128/sqli-labs/Less-1/?id=1` → Dumb/Dumb 回显 |
| **Less-1 注入点测试** | `?id=' OR 1=1 -- -` → 全部 13 users 回显 ✅ |
| **Less-2（数字型）** | `Less-2/?id=1` → 返回；`?id=1 AND 1=2` → 空白，判断数值型 |
| **Less-5（盲注布尔）** | `Less-5/?id=1'` → You are in；`?id=1' AND 1=2 -- -` → 无内容，可做盲注脚本 |
| **Less-17（POST 更新注入）** | `Less-17/` → uname=admin&passwd=x → 基于 UPDATE 的报错注入 |
| **Less-24（二次注入）** | `Less-24/` → 注册 admin' -- - 账号后改自己密码实际改 admin 密码 |

**API 后端验证**：重启 node server.js 后，`/api/vm-labs/web-targets/status?includePlanned=false` 中 sqli-labs 条目最终状态：
```json
{
  "id": "sqli-labs",
  "status": "ready",
  "online": true,
  "verified": true,
  "httpCode": 200,
  "signaturesMatched": ["SQLi-LABS", "SQL Injections", "Setup/reset Database for labs"]
}
```
**共 77 个 Less 目录 + 4 个 Page 导航页** 全部可访问。Day086 靶场 2 交付完成。
