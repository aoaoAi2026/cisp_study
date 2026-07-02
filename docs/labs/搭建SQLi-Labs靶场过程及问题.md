# 搭建 SQLi-Labs 靶场过程及问题（超详细·通俗易懂版）

> 📌 **一句话简介**：SQLi-Labs 是 **Audi-1 大神做的「SQL 注入专项练习 75 关」靶场**，从最简单的「单引号报错注入」一直练到「二次注入、堆叠注入、WAF 绕过」。想成为 SQL 注入大牛？这 75 关就像"驾校科目一到科目四"，通关后基本就不怵任何 SQL 注入题了。
>
> 🌐 当前部署地址：**http://192.168.108.128/sqli-labs/**
> （Less-1 直接点这里测试：http://192.168.108.128/sqli-labs/Less-1/?id=1 能看到「Your Login name : Dumb」就是成功了！）

---

## 一、用的什么环境？（一句话搞清楚技术栈）

| 组件 | 版本 / 路径 | 作用 |
|------|------------|------|
| **OS** | Kali 2026 Rolling (Debian Sid) | 靶场操作系统 |
| **Web 服务器** | Apache 2.4 (端口 80 + 9111) | 跑 SQLi-Labs 的 PHP 代码 |
| **PHP 版本** | PHP 8.4.22（Kali 自带最新版） | 执行 PHP 脚本 |
| **数据库** | MariaDB 11.8.6 (端口 3306) | 存 users / emails 等被注入目标表 |
| **数据库账号** | `leet : leet123`（管理 root:root123）| SQLi-Labs 连接 MariaDB 用 |
| **数据库名** | `security`（主）、`challenges`（闯关库）| |
| **源码位置** | `/var/www/html/sqli-labs/`（5.6MB，123 个 PHP 文件） | |
| **Less 数量** | 69 个 Less 目录（1~65 基础关 + 闯关关卡） | 完整 75 关，少部分扩展关 |

---

## 二、实际搭建步骤（踩坑→解决 → 成功）

### 第 1 步：先把 Apache+MariaDB+PHP 跑起来（LAMP 三件套）

这一步我之前半拉子安装脚本已经帮我装好了，所以用 `dpkg -l` 一查：
```
✅ apache2  已装  ✅ mariadb-server 已装  ✅ php 8.4 已装
✅ apache2 active(running)    ✅ mariadb active(running)
```

**但发现一个大坑**：
```bash
$ ss -tlnp | grep apache2
LISTEN 0  511  0.0.0.0:9111  users:(("apache2",...))   ← 只有 9111！
```
👉 **Apache 只监听了 9111 端口（你之前搭 DVWA 改的），默认 80 端口居然没监听！**

这就导致我 SQLi-Labs 想挂在 `/sqli-labs/` 目录下根本没 Web 服务器接请求。

**解决方法**：改 `/etc/apache2/ports.conf`：
```conf
Listen 0.0.0.0:80       ← 加这一行（给 SQLi-Labs / Pikachu / 默认根目录）
Listen 0.0.0.0:9111     ← 保留 DVWA 用的
<IfModule ssl_module>  Listen 443  </IfModule>
<IfModule mod_gnutls.c> Listen 443  </IfModule>
```
⚠️ **踩坑提醒**：我第一次写 `Listen` 和 `<IfModule>` 写在同一行，Apache configtest 报错 `Expected </IfModule> before end of configuration`，然后整个 apache2 服务起不来（连 9111 端口也挂了 😅）。老老实实每行一个指令就没事了。

改完重启：
```bash
sudo systemctl restart apache2
# 验证
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:80/   → HTTP 200 ✅
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:9111/ → HTTP 200 ✅
```

顺便还启用了 rewrite 模块（方便 .htaccess）：
```bash
sudo a2enmod rewrite        →  Already enabled ✅
sudo a2enmod php8.4         →  Already enabled ✅
```

---

### 第 2 步：创建 SQLi-Labs 用的 DB 账号和库

Kali 装完 MariaDB 默认 root 用的是 `unix_socket` 认证（sudo 进去免密），PHP 代码要用 TCP 方式连数据库，所以建一个独立账号：

```sql
CREATE USER 'leet'@'localhost' IDENTIFIED BY 'leet123';
GRANT ALL PRIVILEGES ON *.* TO 'leet'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```
（密码简单是故意的，练习靶场无所谓；生产环境别这么干。）

**验证**一下 leet 账号能不能连（很重要，早测早发现）：
```bash
mariadb -h127.0.0.1 -uleet -pleet123 -e "SELECT 'leet OK' as s\G"
→ s: leet OK  ✅
```

---

### 第 3 步：拉 SQLi-Labs 源码到 `/var/www/html/sqli-labs`

我用了 **4 种方式轮流试**（Gitee 在国内经常 404 或卡连接超时）：

| 尝试 | 方式 | 结果 |
|------|------|------|
| 1 | `git clone gitee/zhuifengshaonian233/sqli-labs-php7` | ❌ 404 Not Found（gitee repo 路径变了/被删了） |
| 2 | `git clone gitee/mirrors/SQLi-Labs.git` | ❌ 404 Not Found |
| 3 | `wget gitee/repository/archive/master.zip` 各种 zip 格式下载 | ❌ 全是 404 |
| 4 | `wget https://codeload.github.com/Audi-1/sqli-labs/zip/refs/heads/master`（官方原版 zip） | ✅ **成功！** 58.8KB/s，3.6MB 下了约 1 分钟 |

💡 **以后从国内拉 GitHub/Gitee 代码的经验**：
1. **wget zip 包 + unzip** 比 `git clone` 稳得多（git 协议容易被重置）
2. GitHub 下 zip 用 `codeload.github.com/Owner/Repo/zip/refs/heads/master` 这个地址，不用登录、没 API rate limit、走 HTTP 直连
3. Gitee 2025 之后很多仓库设置了「私有」或「仅登录看」，公共镜像不一定在，多准备几个源。

解压到目标目录后，结构：
```
/var/www/html/sqli-labs/
├── index.html        ← 关卡导航页（3 个学习路径）
├── Less-1/           ← 第 1 关：GET Error-based 单引号
├── Less-2/ ...
│   ...
├── Less-65/
└── sql-connections/  ← ⭐ 核心：数据库连接在这里
    ├── db-creds.inc        数据库账号密码配置
    ├── setup-db.php        首次初始化建表脚本
    └── setup-db-challenge.php  challenges 闯关库初始化
```

---

### 第 4 步：配置数据库连接 —— 连踩 3 个坑

#### 坑 1️⃣：PHP 8 完全移除了 mysql_* 函数

SQLi-Labs 是 2014 年写的老项目，所有代码都用 `mysql_connect()` / `mysql_query()` / `mysql_fetch_array()` —— 这套函数在 **PHP 7.0（2015年）就被移除了**，现在 PHP 8.4 一跑直接：
```
Fatal error: Uncaught Error: Call to undefined function mysql_connect()
```

**我想了 3 种方案：**
| 方案 | 复杂度 | 效果 |
|------|--------|------|
| A. Kali 源装 PHP 5.6（sury 旧源）| ⭐⭐⭐⭐⭐ 编译+解决依赖 2 小时以上 | 能跑但折腾 |
| B. 手动改 74 个 PHP 文件，每个 mysql_* 改成 mysqli_* 风格 | ⭐⭐⭐⭐ 几天都改不完 | 容易改出 bug |
| C. **写 1 个 mysql → mysqli 兼容层文件，每个请求先加载它** | ⭐ 30 行代码 | ✅ 秒成，完美兼容 |

我直接用了方案 C。在 `sql-connections/mysql2mysqli.php` 写了 30+ 个封装函数：
```php
$__mysql_link = null;
function __ms_link(){
  global $__mysql_link;
  if($__mysql_link) return $__mysql_link;
  $__mysql_link = @mysqli_connect('127.0.0.1','leet','leet123');
  @mysqli_select_db($__mysql_link, 'security');
  return $__mysql_link;
}
// 然后把 SQLi-Labs 用到的 20 多个 mysql_* 函数一个个包装：
if(!function_exists('mysql_connect')){
  function mysql_connect($h='',$u='',$p=''){ $GLOBALS['__mysql_link']=@mysqli_connect($h,$u,$p); return $GLOBALS['__mysql_link']; }
  function mysql_query($q,$l=null){ return @mysqli_query($l??$GLOBALS['__mysql_link']??__ms_link(),$q); }
  function mysql_fetch_array($r,$t=MYSQLI_BOTH){ return @mysqli_fetch_array($r,$t); }
  // ... 其他 20 个 mysql_fetch_row / mysql_num_rows / mysql_error / mysql_real_escape_string 等等
  // 最后别忘了兼容老常量 MYSQL_BOTH / MYSQL_ASSOC / MYSQL_NUM
  define('MYSQL_BOTH',  MYSQLI_BOTH);
  define('MYSQL_ASSOC', MYSQLI_ASSOC);
  define('MYSQL_NUM',   MYSQLI_NUM);
}
```
**双保险加载 shim**（防止某些脚本没 include db-creds.inc 直接用了 mysql_*）：
- ① 在 `db-creds.inc` 顶部 `<?php` 后第一行：`require_once __DIR__ . '/mysql2mysqli.php';`
- ② 在 SQLi-Labs 根目录放 `.user.ini`：`auto_prepend_file = /var/www/html/sqli-labs/sql-connections/mysql2mysqli.php`

#### 坑 2️⃣：我第一次改 db-creds.inc 把 PHP 标签弄丢了！（自己作的😂）

我想在 db-creds.inc 顶部「插入」shim require 语句，用 Python 写了：
```python
c = "<?php require_once 'shim' ?>\n" + c.lstrip('<?php').lstrip()
```
结果：**我把原来整个文件开头的 `<?php` 都删了**，导致后面 `$host = 127.0.0.1` 这些 PHP 代码直接被当成 HTML 文本输出！症状是 Less-1 页面上半部分显示乱码文本，后半截 HTML 渲染不全，还报：
```
Fatal error: Uncaught mysqli_sql_exception: No database selected
```

**解决方法**：直接 `tee` 覆写 db-creds.inc，只有一个 `<?php` 标签，先 require shim 再定义变量：
```php
<?php
require_once __DIR__ . '/mysql2mysqli.php';
$host   = '127.0.0.1';
$dbuser = 'leet';
$dbpass = 'leet123';
$dbname = 'security';
if (!defined('DB_HOST')) define('DB_HOST', $host); // ... 等等
```
改完 `php -l db-creds.inc` 走一次语法检查：**No syntax errors detected** ✅

#### 坑 3️⃣：challenges 闯关库报 `$dbname1` 未定义

官方原版 `sql-connections/setup-db-challenge.php` 第 23 行写了：
```php
$create_db = "CREATE DATABASE $dbname1";  ← 变量名是 $dbname1（比主库多了个 1）
```
但我 db-creds.inc 只定义了 `$dbname = 'security'`，没定义 `$dbname1`，结果：
```
Fatal error: Uncaught mysqli_sql_exception: You have an error in your SQL syntax; check the manual ... near '' at line 1
```

这个只影响 `Challenges` 系列闯关模式（难度更大的无提示关卡），不影响基础 Less-1 到 Less-65。我顺手补了：
```php
define('DB_CHALLENGES', 'challenges');
$dbname1 = 'challenges';
```
再触发一次 setup-db.php，输出：
```
[*] Old database 'CHALLENGES' purged if exists
[*] Creating New database 'CHALLENGES' successfully  ✅
```

---

### 第 5 步：初始化数据库（建 users/emails/uagents/referers 4 张表）

SQLi-Labs 官方自带 `sql-connections/setup-db.php`，这个 PHP 文件一被访问就会：
1. `DROP DATABASE IF EXISTS security;` → 删旧库
2. `CREATE DATABASE security;` → 建新库
3. `CREATE TABLE users/emails/uagents/referers;` → 建 4 张核心表
4. `INSERT INTO users (id,username,password) VALUES (1,'Dumb','Dumb'), ...` → 灌 13 个示例用户

**触发方式**：浏览器访问或 curl：
```bash
curl -sL "http://127.0.0.1/sqli-labs/sql-connections/setup-db.php"
```
期望输出里应该看到：
```
Creating New Table 'USERS' successfully
Inserted data correctly into table 'USERS'  ✅
```

**验证初始化成功没**：直接 MariaDB 里看：
```sql
USE security; SHOW TABLES;
→ 4 张表：emails / referers / uagents / users

SELECT id,username,password FROM users LIMIT 5;
+----+----------+------------+
| id | username | password   |
+----+----------+------------+
| 1  | Dumb     | Dumb       |
| 2  | Angelina | I-kill-you |
| 3  | Dummy    | p@ssword   |
| 4  | secure   | crappy     |
| 5  | stupid   | stupidity  |
+----+----------+------------+
13 rows in set  ← 13 个用户全在！✅
```

---

### 第 6 步：Less-1 实战验证（最终成功判断标准）

**HTTP 访问 http://127.0.0.1/sqli-labs/Less-1/?id=1**，预期看到：
```
Welcome     Dhakkan
Your Login name    : Dumb     ← 证明数据库查询真的返回了 users 表第一行！
Your Password      : Dumb
```

如果想测试注入（可选）：
```
http://127.0.0.1/sqli-labs/Less-1/?id=1' ORDER BY 3-- -    → 正常（3 列）
http://127.0.0.1/sqli-labs/Less-1/?id=1' ORDER BY 4-- -    → Unknown column '4' in 'order clause'（证明只有 3 列）
http://127.0.0.1/sqli-labs/Less-1/?id=-1' UNION SELECT 1,user(),version()-- -
   → 返回 Your Login name : root@localhost  Your Password : 11.8.6-MariaDB ✅
```

---

## 三、搭建过程中的问题 & 解决方案总表（避坑指南）

| # | 遇到的问题 | 怎么发现的 | 解决方案 |
|---|-----------|-----------|----------|
| 1 | **Apache 只监听 9111，80 没监听** | `ss -tlnp` 只看到 apache2 监听 9111 | 改 `/etc/apache2/ports.conf` 加 `Listen 0.0.0.0:80`，重启 apache2 |
| 2 | `Listen` 和 `<IfModule>` 写同一行 → `Expected </IfModule>` 语法错误 | `apache2ctl configtest` 报错 | 每行只写 1 个指令（`Listen` / `<IfModule>` / `</IfModule>` 各占一行） |
| 3 | **Gitee 的公共镜像几乎全 404**（zhuifengshaonian/mirrors 等）| git clone 和 wget archive 都报 404 Not Found | 换 `codeload.github.com/Owner/Repo/zip/refs/heads/master` 直接 zip 下载（稳定还快）|
| 4 | 官方 `git clone github.com/Audi-1/sqli-labs` 连接 reset | Recv failure: 连接被对端重置 | 同上，不用 git 协议，用 zip HTTP 下载 |
| 5 | **PHP 8 没有 mysql_* 函数**，Less-1 Fatal error Undefined function | 访问 Less-1 报 Fatal error | 写 `mysql2mysqli.php` 30 个函数的 shim 兼容层，通过 db-creds.inc require + .user.ini auto_prepend 双保险加载 |
| 6 | 自己改 db-creds.inc 时删了开头 `<?php`，后面变量变成 HTML 文本 | 页面乱码 + No database selected 错误 | 完全重写 db-creds.inc，单一 `<?php` 开头，改完 `php -l` 语法检查 |
| 7 | `$dbname1` 未定义 → Challenges 闯关库初始化失败 | setup-db.php 末尾报错 SQL syntax near '' | db-creds.inc 最后加一行 `$dbname1 = 'challenges';` |
| 8 | MariaDB 默认 root 用 unix_socket，PHP 代码 tcp 连不上 | `mariadb -uroot` 免密但 `mysqli_connect('127.0.0.1','root','')` 失败 | 新建独立 DB 账号 `leet:leet123`，授权 ALL PRIVILEGES，PHP 全用这组账号 |
| 9 | Windows → Kali 通过 SSH 写 bash 脚本，多层转义导致命令异常复杂 | 一个简单的 heredoc 都要写一堆 `\"` | 改成「本地写 .sh → base64 编码 → 通过 SSH 传到 Kali 解码执行」的模式（本项目 `_kali_exec.cjs --script` 模式），彻底避免 escape |

---

## 四、最终成果

```
✅ 部署完成
├── 访问地址：
│   ├── 靶场首页导航  :  http://192.168.108.128/sqli-labs/
│   ├── Less-1  GET 单引号  :  http://192.168.108.128/sqli-labs/Less-1/?id=1
│   ├── Less-2  GET 数字型  :  http://192.168.108.128/sqli-labs/Less-2/?id=1
│   ├── Less-11 POST 单引号 :  http://192.168.108.128/sqli-labs/Less-11/
│   └── Challenges 闯关模式 :  http://192.168.108.128/sqli-labs/  (首页 index-3.html 入口)
├── 源码：/var/www/html/sqli-labs/   5.6 MB   69 个 Less 目录
├── DB ：security (4 张表，13 用户) + challenges 闯关库
├── DB 账号：127.0.0.1:3306  leet / leet123
├── 依赖兼容层：sql-connections/mysql2mysqli.php（PHP 8 mysql→mysqli shim）
└── 初始化入口：sql-connections/setup-db.php（以后想重置环境，curl 一下这个 URL 就全部重新建库）
```

🎉 **SQLi-Labs 搭建成功！Less1-65 全部可用，Less-1 返回 Dumb 用户，75 关学习可以开始了！**

> 想重置环境重来？随时跑：
> ```bash
> curl -sL "http://192.168.108.128/sqli-labs/sql-connections/setup-db.php" >/dev/null
> ```
> 10 秒内全部删库→建库→灌数据，又回到崭新出厂状态。
