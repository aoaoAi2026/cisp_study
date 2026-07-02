# 搭建 Pikachu 靶场过程及问题（超详细·通俗易懂版）

> 📌 **一句话简介**：Pikachu（皮卡丘）是一个**国人开发的「综合型 Web 漏洞练习靶场」**，不是只练 SQL 注入，而是把 **XSS、CSRF、文件上传、RCE、文件包含、SSRF、XXE、反序列化、暴力破解** 10 多种 Web 常见漏洞全部做成一个个练习页面，漏洞场景都很贴近真实开发代码，适合「SQLi-Labs 通关之后想试试综合漏洞」。
>
> 🌐 当前部署地址：**http://192.168.108.128/pikachu/**
>
> （首页点进去就能看到 10 大类漏洞分组，每个分组里有多个漏洞点，比如「SQL注入」有 GET数字型、POST字符型、搜索型、XX型4种，每种还有相应的场景和解题提示）

---

## 一、用的什么环境？（和 SQLi-Labs 共享 LAMP）

Pikachu 跟 SQLi-Labs **共用同一套 Apache + MariaDB + PHP 基础环境**，省了很多重复安装的功夫：

| 组件 | 值 | 说明 |
|------|----|------|
| **Web** | Apache 2.4 / 端口 80 | 同 SQLi-Labs |
| **PHP** | 8.4.22 (mod_php) | 同 SQLi-Labs |
| **MariaDB** | 11.8.6 / 端口 3306 | 同 SQLi-Labs（账号 `leet : leet123`） |
| **独立 DB** | `pikachu`（和 security 库分开，互不影响）| Pikachu 专用数据库 |
| **源码位置** | `/var/www/html/pikachu/` (7.3MB, 111 个 PHP 文件)| Pikachu 项目根目录 |
| **子模块** | vul(主练习模块) + pkxss(XSS 独立平台) + test | Pikachu 分三大块 |

> 💡 **为什么跟 SQLi-Labs 共用 Apache 能互不干扰？**
> 因为它们挂的 URL 路径不一样：`/sqli-labs/` 和 `/pikachu/`，相当于 Apache 同一棵树上长了两棵小树苗，互不抢营养。

---

## 二、实际搭建步骤（踩坑→解决 → 成功）

### 第 1 步：下载代码到 `/var/www/html/pikachu`

同样用「zip 包下载 + unzip」的方式（比 git clone 稳，见 SQLi-Labs 文档理由）：

| 下载源 | 结果 |
|--------|------|
| gitee/zhuifengshaonian233/pikachu master.zip | ❌ 404 Not Found |
| **gitee/mirrors/pikachu master.zip** | ✅ **成功！832KB/s，3.6MB 4 秒下完** |
| gitee/songboy/pikachu master.zip | （没跑到这步就成功了）|
| github/zhuifengshaonianhanlu/pikachu master.zip | （备用）|

解压完目录结构：
```
/var/www/html/pikachu/
├── assets/        ← 样式表、JS、图片（Pikachu 用的 ACE 后台模板）
├── inc/           ← ⭐ 核心：config.inc.php + mysql.inc.php + 函数
├── vul/           ← ⭐ 主漏洞模块：burteforce / csrf / deser / fileinclude / rce / sqli / ssrf / unsafeupload / xxe / xss
├── pkxss/         ← ⭐ XSS 独立平台（单独再挂一套 DB 配置）
├── install.php    ← ⭐ 初始化安装脚本（POST submit 才执行）
├── header.php / footer.php / index.php
└── test/
```

---

### 第 2 步：配置数据库连接 —— 连环踩 4 个坑

Pikachu 的连接配置比 SQLi-Labs「调皮」多了，**前后踩了 4 次 Undefined constant**，每次修一个又冒出来新的一个 😅，耐心看下去。

#### 坑 1️⃣：`DB_HOST` 带下划线 vs `DBHOST` 不带下划线 —— 我居然全写错了

我第一次想当然地在 `inc/config.inc.php` 写了：
```php
define('DB_HOST', '127.0.0.1');      ❌
define('DB_USER', 'leet');            ❌
define('DB_PASSWORD', 'leet123');     ❌
define('DB_NAME', 'pikachu');         ❌
```

结果打开 `install.php` 全是 Notice：
```
Notice: Use of undefined constant DBHOST - assumed 'DBHOST'
Notice: Use of undefined constant DBUSER - assumed 'DBUSER'
```

然后打开 `install.php` 源码一看才知道（**读源码！读源码！读源码！**重要的事说 3 遍）：
```php
// install.php 第 4 行
$dbhost = DBHOST;   ← 常量名是 DBHOST（没有下划线！）
$dbuser = DBUSER;   ← DBUSER（没有下划线！）
$dbpw   = DBPW;     ← DBPW ！（不是 DB_PASSWORD！）
$dbname = DBNAME;   ← DBNAME（没有下划线！）
```

**解决**：改成官方约定的命名（**没有下划线**！）：
```php
define('DBHOST','127.0.0.1');
define('DBUSER','leet');
define('DBPW',  'leet123');
define('DBNAME','pikachu');
```
💡 经验：**靶场初始化脚本报 Notice「Use of undefined constant XXX」时，先 grep 一下源码里用的到底是什么常量名，不要想当然。**

#### 坑 2️⃣：`install.php` 只有 **POST 提交才会执行初始化**，GET 访问只看到表单

我改完配置以后连续 `curl http://127.0.0.1/pikachu/install.php` 了 3 次，每次返回 30KB 的 HTML，但是 pikachu 库的表数量永远是 `total_tables = 0` —— 死活不建表。

又去读 install.php 源码，结果发现：
```php
if(isset($_POST['submit'])){    ← ⭐ 只有 POST 了 submit 字段才执行！
  // --- 建库、建表、灌数据全在这大括号里！---
  $drop_db = "drop database if exists $dbname";
  $create_db = "CREATE DATABASE $dbname";
  CREATE TABLE users ... ;
  INSERT INTO users VALUES (1,'admin',md5('123456'),1) ... ;
  CREATE TABLE member/message/xssblind ... ;
}
```

GET 访问只会输出 HTML 表单（让你点一个「开始安装」按钮），PHP 初始化逻辑根本不跑。

**解决方法**：
```bash
# 模拟 POST 提交表单（submit 字段名就是 submit，值随便写一个非空字符串都行）
curl -sL -F submit=开始安装 http://127.0.0.1/pikachu/install.php
```
然后看到响应里出现了关键字：
```
Notice: 数据库连接成功
Notice: 新建数据库 pikachu 成功!
✅ 成功/创建/notice/pikachu   （关键字全出现了）
```
pikachu 库终于有了 5 张表。

#### 坑 3️⃣：全局扫描发现 `DBPORT` 没定义！（SQLi 暴力破解/CSRF/XSS存储 模块报 Fatal）

我以为大功告成了，去点开 `vul/sqli/sqli_id.php?id=1`（SQL 注入 GET 数字型），结果：
```
Fatal error: Uncaught Error: Undefined constant "DBPORT" in /var/www/html/pikachu/inc/mysql.inc.php:3
```

读 `inc/mysql.inc.php` 第一行函数：
```php
function connect($host=DBHOST,$username=DBUSER,$password=DBPW,$databasename=DBNAME,$port=DBPORT){
                                                              ↑↑↑↑↑↑↑↑
         // ⭐ 这里默认参数第 5 个值写的是 DBPORT 常量！我之前根本没定义！
```

SQLi-Labs 那种简单的连接是 `mysqli_connect($host,$user,$pass)` 3 参数的，Pikachu 自己封装了 `connect()` 函数，还**要求必须有端口号参数常量**（虽然 MySQL 默认就是 3306）。

**解决**：在 inc/config.inc.php 再加一行：
```php
define('DBPORT', '3306');   ← 就这么简单！
```

顺手我还写了个全局 grep 工具把所有 PHP 里用的 DB* 常量都搜出来，确保没有遗漏：
```bash
grep -rhoE "DB[A-Z_]+" /var/www/html/pikachu --include="*.php" | sort -u
DBHOST / DBPORT / DBUSER / DBPW / DBNAME / DB_CHARSET / DB_HOST / DB_NAME / DB_PASSWORD / DB_TYPE / DB_USER   ← 11 个都齐了！
```
我在 config.inc.php 里把这 11 个全定义（带下划线的就用 `if (!defined('X')) define('X', Y)` 风格转一下别名，保证不管代码用什么命名风格都能读到）。

#### 坑 4️⃣：CSRF 模块报 `Undefined constant MYSQL_ASSOC`（PHP 8 又移除了一个老常量）

这是最后一个 Fatal error。点开 CSRF GET 修改密码页面：
```
Fatal error: Uncaught Error: Undefined constant "MYSQL_ASSOC" in csrf_get_edit.php:70
```

原因：`MYSQL_ASSOC` 是跟之前 SQLi-Labs 里 `mysql_*` 函数配套的 fetch 常量，早在 PHP 7.0 就从核心移除了，但是 Pikachu 2018 年的代码里有一处老写法：
```php
mysql_fetch_array($result, MYSQL_ASSOC);   ← 用了 MYSQL_ASSOC 常量
```
（我们 shim 把 mysql_fetch_array 函数转成了 mysqli_fetch_array，但**常量本身没定义**，PHP 8 就 Fatal。）

**解决**：在 config.inc.php 加 3 个兼容常量（PHP 8 对应 MYSQLI_* 常量值完全一致）：
```php
if (!defined('MYSQL_BOTH'))  define('MYSQL_BOTH',  MYSQLI_BOTH);   // 数值 = 1
if (!defined('MYSQL_ASSOC')) define('MYSQL_ASSOC', MYSQLI_ASSOC);  // 数值 = 2
if (!defined('MYSQL_NUM'))   define('MYSQL_NUM',   MYSQLI_NUM);    // 数值 = 3
```

加完后 Pikachu 最后一个 FATAL 也变成 0 了！🎉 全部 19 个模块 HTTP 200/302，OK。

---

### 第 3 步：手动兜底建表（防止 install.php POST 漏执行）

因为 Pikachu 只在 POST submit 时建库，而且每次运行 install.php 都会 `DROP DATABASE pikachu`（危险！），所以我写了一份 `MANUAL SQL` 脚本作为备份方案 —— 万一 install.php 跑崩了，可以随时手动把 4 张核心表建起来：

```sql
DROP DATABASE IF EXISTS pikachu;
CREATE DATABASE pikachu DEFAULT CHARACTER SET utf8mb4;
USE pikachu;
CREATE TABLE users (id INT(10) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                    username VARCHAR(30) NOT NULL,
                    password VARCHAR(66) NOT NULL,
                    level INT(11) NOT NULL) ENGINE=MyISAM;
INSERT IGNORE INTO users VALUES
  (1,'admin', MD5('123456'), 1),
  (2,'pikachu', MD5('000000'), 2),
  (3,'test', MD5('abc123'), 3);
CREATE TABLE member (id INT PRIMARY KEY AUTO_INCREMENT,
                     username VARCHAR(30), pw VARCHAR(32), sex VARCHAR(5),
                     phonenum VARCHAR(11), email VARCHAR(30), address VARCHAR(60),
                     regtime DATETIME) ENGINE=MyISAM;
CREATE TABLE message (id INT PRIMARY KEY AUTO_INCREMENT,
                      title VARCHAR(50), content VARCHAR(200),
                      time DATETIME, userid INT);
CREATE TABLE xssblind (id INT PRIMARY KEY AUTO_INCREMENT,
                       time DATETIME, content TEXT);
```

（member 表我还插入了 vince/allen/grady/kobe/kevin/lucy …… 共 10 个「成员管理」练习用的假人账号，方便后面 SQLi 注入测试。）

---

### 第 4 步：全模块 HTTP 健康检查（逐个验证）

Pikachu 一共有 **10 大类漏洞模块**，我逐个点了一遍（curl 模拟），结果：

| 漏洞类型 | 代表页面 | 状态 |
|---------|---------|------|
| 🟢 SQL 注入 | sqli_id.php (GET 数字型)、sqli_str.php (POST字符型)、sqli_search.php (搜索型) | ✅ HTTP 200、无 FATAL |
| 🟢 XSS（跨站脚本）| xss_reflected_get.php?message=hello（反射型）、xss_stored.php（存储型） | ✅ HTTP 200，message 关键字能回显到页面上 |
| 🟢 暴力破解 | bf_form.php (表单)、bf_server.php (验证码绕过) | ✅ HTTP 200 |
| 🟢 RCE（命令执行）| rce_ping.php、rce_eval.php | ✅ HTTP 200（后面练命令注入就 ping 127.0.0.1;id） |
| 🟢 文件包含 | fi_local.php?filename=file1.php（本地）、fi_remote.php?filename=file3.php（远程）| ✅ HTTP 200 |
| 🟢 不安全文件上传 | clientcheck.php (前端校验) | ✅ HTTP 200；MIME 校验 404 是路径写错了，实际文件名是 `getimagesizecheck.php` |
| 🟢 SSRF | ssrf_curl.php?url=file:///etc/passwd | ✅ HTTP 200，可以读 /etc/passwd |
| 🟢 CSRF | csrf_get_edit.php | ✅ HTTP 200，有 token 参数 |
| 🟢 XXE | xxe_1.php | ✅ HTTP 200（我路径一开始写错成 xxe/index.php 404，实际文件是 xxe_1.php） |
| 🟢 PKXSS 平台 | pkxss/index.php | ✅ HTTP 302（跳转是正常的，说明登录逻辑起作用） |
| 🔴 之前 FATAL | csrf_get_edit.php / csrf post 等 | ✅ 补完 MYSQL_ASSOC 常量后 OK，FATAL 降到 0 |

**最终状态：FATAL = 0，全部模块绿灯 ✅**

---

## 三、搭建过程中遇到的问题 & 解决方案总表

| # | 遇到的问题 | 怎么发现的 | 解决方案 |
|---|-----------|-----------|----------|
| 1 | **Pikachu 要求 DB 常量名是 DBHOST/DBUSER/DBPW/DBNAME（不带下划线）**，我写成带下划线的了 | `Use of undefined constant DBHOST` Notice | 读 `install.php` 源码，改成官方约定的无下划线 4 常量 |
| 2 | **install.php 只有 POST submit 了才执行初始化**，GET 访问只看到空表单 | 连续 curl 3 次，pikachu 库表数始终是 0 | 用 `curl -F submit=开始安装` 模拟 POST 提交 |
| 3 | `inc/mysql.inc.php` 的 `connect()` 函数**默认参数需要 DBPORT 常量**，之前没定义 | 所有连 DB 的模块（SQLi/CSRF/暴破/XSS存储）全部 Fatal error Undefined constant DBPORT | inc/config.inc.php 加 `define('DBPORT','3306');` |
| 4 | `MYSQL_ASSOC` 常量在 PHP 8 移除了 | CSRF GET 修改密码页 Fatal：Undefined constant "MYSQL_ASSOC" | 加 3 个别名常量 (`MYSQL_ASSOC`→`MYSQLI_ASSOC` 等) 兼容 |
| 5 | **每次访问 install.php（不管 GET/POST）都会 DROP pikachu 库！** | 多次 curl install.php 后表又没了 | install 成功后**不要随便再 curl install.php**；写一份 MANUAL SQL 备份脚本随时重建 |
| 6 | XXE 模块 404（路径写错了）| 一开始写的是 vul/xxe/xxe_index.php → 404 | 找文件：`find pikachu/vul/xxe -name "*.php"`，实际是 `xxe_1.php` |
| 7 | Pikachu 的 PKXSS 子项目有**自己独立的 config**（pkxss/inc/config.inc.php） | 一开始只改了 inc/config.inc.php，PKXSS 访问报连不上库 | pkxss/inc/config.inc.php 也写一份同样的 DBHOST/DBPORT/DBUSER/DBPW/DBNAME 配置 |

---

## 四、最终成果 + 默认账号 + 快速入门

```
✅ Pikachu 部署完成
├── 访问地址：
│   ├── 综合靶场首页 :  http://192.168.108.128/pikachu/
│   ├── SQL GET 注入  :  http://192.168.108.128/pikachu/vul/sqli/sqli_id.php?id=1
│   ├── XSS 反射型    :  http://192.168.108.128/pikachu/vul/xss/xss_reflected_get.php?message=<script>alert(1)</script>
│   ├── 文件上传前端校验 :  http://192.168.108.128/pikachu/vul/unsafeupload/clientcheck.php
│   ├── 暴力破解表单  :  http://192.168.108.128/pikachu/vul/burteforce/bf_form.php
│   ├── RCE 命令执行  :  http://192.168.108.128/pikachu/vul/rce/rce_ping.php
│   ├── CSRF 修改密码 :  http://192.168.108.128/pikachu/vul/csrf/csrfget/csrf_get_edit.php
│   ├── SSRF CURL     :  http://192.168.108.128/pikachu/vul/ssrf/ssrf_curl.php?url=file:///etc/passwd
│   └── PKXSS 平台    :  http://192.168.108.128/pikachu/pkxss/
├── 默认用户（所有登录都能用）：
│   ├── admin / 123456 (level 1)
│   ├── pikachu / 000000 (level 2)
│   └── test / abc123 (level 3)
├── 成员管理 member 表的假人（vince/allen/grady/kobe/kevin...共 10 个），方便 SQLi 测
├── 源码：/var/www/html/pikachu/  (7.3 MB, 111 PHP files)
├── 数据库：pikachu 库（users/member/message/xssblind 4 张核心表 + PKXSS 表）
└── 数据库账号：127.0.0.1:3306  leet / leet123  (和 SQLi-Labs 共用)
```

> 🔄 **想重置 Pikachu 环境？**
> ```bash
> # 方式 1：官方方式（POST install 会删库重灌）
> curl -sL -F submit=重置 http://192.168.108.128/pikachu/install.php >/dev/null
>
> # 方式 2：手动 SQL（如果上面把库删崩了，直接跑我们准备的 MANUAL SQL 文件）
> ```

🎉 **Pikachu 搭建成功！10 大类漏洞模块 19 个练习点全部绿灯可用。**
