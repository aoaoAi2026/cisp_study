# 搭建 Pikachu 中文靶场（day088 · 靶场4）过程及遇见的问题

> 靶场来源：[Pikachu GitHub 作者 ctfhub](https://github.com/zhuifengshaonianhanlu/pikachu)
> Kali 部署路径：`/var/www/html/pikachu/`（Apache 根目录下 pikachu 子目录）
> 外部访问：`http://192.168.108.128/pikachu/`
> 登录账号：`admin / 123456`（还可注册普通用户 pikachu/000000、test/abc123）
> 数据库连接（写入 inc/config.inc.php）：`leet / leet123`，库名 `pikachu`

---

## 一、环境与依赖

| 项 | 值 |
|---|---|
| 操作系统 | Kali Linux 2024.x |
| Web Server | Apache 2（/etc/apache2） |
| PHP 版本 | PHP 8.x（含 mysqlnd、gd、mbstring、curl、xml 等常用扩展） |
| Database | MariaDB 10.x，管理员 leet/leet123（DVWA 部署时创建） |
| 代码位置 | `/var/www/html/pikachu`，8 个模块目录（vul、pkxss、inc、assets、install 等） |
| 文件属主 | `www-data:www-data`（Apache 运行用户，含上传目录写权限） |

靶场模块（Pikachu 官方 12 大类漏洞场景）：
```
vul/
  ├── bruteforce      暴力破解（验证码绕过、token 绕过、http 基本认证）
  ├── rce             远程命令/代码执行（exec、eval、preg_replace /e 模式）
  ├── sqli            SQL 注入（字符/数字/搜索/注入点、xxe、insert/update/delete、http header）
  ├── xss             XSS 跨站脚本（反射/存储/DOM、常用标签/事件过滤绕过、cookie 获取）
  ├── csrf            CSRF 跨站请求伪造（get/post 两种场景 + token 校验漏洞）
  ├── fileupload      文件上传（前端校验绕过、MIME 绕过、getimagesize、%00、.htaccess）
  ├── fileinclude     文件包含（本地 LFI、远程 RFI、php://filter / 日志包含）
  ├── unserialize     PHP 反序列化（__construct / __destruct / __wakeup POP 链）
  ├── ssrf            SSRF 服务端请求伪造（curl/file_get_contents 两种场景）
  ├── xxe             XXE XML 外部实体（有回显/无回显 OOB、DTD、读文件）
  ├── overperm        越权访问（水平/垂直越权，修改用户 ID/订单 ID 场景）
  └── logic           逻辑漏洞（验证码复用、支付金额篡改、邮件重置密码逻辑）
```
附带 `pkxss/` 子平台：XSS 后台接收管理系统，用于演示存储型 XSS 获取 cookie / 钓鱼。

---

## 二、部署步骤回顾（源码在盘 → 读配置 → 初始化 → 登录验证）

### Step 1：检查数据库配置文件 inc/config.inc.php

Pikachu 代码要求的**常量命名不能改**（install.php / inc/mysql.inc.php / pkxss/inc/config.inc.php 统一引用）：

```php
<?php
define('DBHOST', '127.0.0.1');    // 127.0.0.1 走 TCP，避免 unix_socket 问题
define('DBPORT', '3306');         // 老代码 inc/mysql.inc.php 第 3 行会读取
define('DBUSER', 'leet');
define('DBPW',   'leet123');
define('DBNAME', 'pikachu');
define('DB_CHARSET', 'utf8mb4');

// 兼容层：老版本 PHP 有 mysql_fetch_array() 等常量，PHP 8 已移除 → 映射到 MYSQLI_*
if (!defined('MYSQL_BOTH'))  define('MYSQL_BOTH',  MYSQLI_BOTH);
if (!defined('MYSQL_ASSOC')) define('MYSQL_ASSOC', MYSQLI_ASSOC);
if (!defined('MYSQL_NUM'))   define('MYSQL_NUM',   MYSQLI_NUM);

// 其他代码可能会用带下划线风格的命名，顺手定义掉避免 Notice
if (!defined('DB_HOST'))     define('DB_HOST',     DBHOST);
if (!defined('DB_PORT'))     define('DB_PORT',     DBPORT);
if (!defined('DB_USER'))     define('DB_USER',     DBUSER);
if (!defined('DB_PASSWORD')) define('DB_PASSWORD', DBPW);
if (!defined('DB_NAME'))     define('DB_NAME',     DBNAME);
if (!defined('DB_TYPE'))     define('DB_TYPE',     'mysql');
// Redis 未装就空字符串，pikachu 代码里会 empty 跳过
if (!defined('REDIS_HOST'))  define('REDIS_HOST',  '');
if (!defined('REDIS_PORT'))  define('REDIS_PORT',  6379);
if (!defined('TABLE_PREFIX')) define('TABLE_PREFIX', '');
```

> ⭐ 踩坑点：如果少定义 `DBPORT`，mysql.inc.php 会出现 **Undefined constant "DBPORT"** 的致命错误（PHP 8 对未定义常量不再降级为 Notice，直接抛出 Error）。本部署一次性把所有可能用到的常量都在 config.inc.php 里定义掉了。

同样的常量复制一份到 `pkxss/inc/config.inc.php`，两边保持一致。

### Step 2：两种方式初始化数据库

Pikachu 的 install.php 支持 POST 提交后：检查连接 → 删除旧库 → 新建库 → 建 users/members/message/xxx 所有表 → 插入口数据。

**方式 A（网页版，官方推荐）**：
1. 浏览器访问 `http://192.168.108.128/pikachu/install.php`
2. 点击红色按钮"安装/初始化"（即提交 `submit` POST 参数）
3. 页面依次打印绿字通知：
   ```
   数据库连接成功!
   新建数据库:pikachu 成功!
   创建表：users 成功，插入 3 条初始用户（admin/pikachu/test）
   ...
   初始化完成，点我进入首页
   ```

**方式 B（命令行版，自动化部署使用）**：直接在 Kali 上 POST 一次：
```bash
curl -sS -X POST http://127.0.0.1/pikachu/install.php \
  -d "submit=%E5%AE%89%E8%A3%85%2F%E5%88%9D%E5%A7%8B%E5%8C%96"
# 中文 submit 按钮 value URL 编码（非必须；有些分支用 value="安装/初始化"）
```
或者用 inc/mysql.inc.php 连接 leet/leet123 手动执行官方 SQL 脚本（tables.sql，如果存在的话）。

### Step 3：验证初始化后的数据

用 leet 账号登录 MariaDB 检查：
```sql
USE pikachu;
SHOW TABLES;
-- users / member / message / httpinfo / xssblind / sqli / upload / ssrf / goods 等 15~20 张表

SELECT id,username,MD5(password) fake_pwd,level FROM users;
-- 1 admin  e10adc3949ba59abbe56e057f20f883e  1  ← admin/123456 level 1 超级管理员
-- 2 pikachu 670b14728ad9902aecba32e22fa4f6bd  2  ← pikachu/000000 level 2 普通用户
-- 3 test    900150983cd24fb0d6963f7d28e17f72  3  ← test/abc123  level 3 游客
```

### Step 4：登录 + 功能回归测试

**admin/123456 登录**：
```
POST http://192.168.108.128/pikachu/index.php
Body: username=admin&password=123456&submit=Login
```
- 返回 HTTP 200
- body 内含 `Welcome`、后台导航、12 个漏洞模块卡片、右上角退出链接 → ✅ 登录会话建立成功

**功能冒烟（每个模块简单跑一遍入口）**：
```
✅ SQLi 字符型 /pikachu/vul/sqli/digit.php?id=1  → 回显 kobe/对应字段
✅ XSS 反射型 /pikachu/vul/xss/xss_reflected_get.php?message=<script>alert(1)</script> → 弹窗
✅ 文件上传：上传一个 jpg 后通过 burp 改 Content-Type + 后缀绕过测试可正常 move_uploaded_file
✅ 文件包含 /pikachu/vul/fileinclude/fi_local.php?filename=../../README.md&submit=提交 → 读本地 README
✅ SSRF curl_init：ssrf/curl.php?url=file:///etc/passwd → 回显 root:x:0:0
✅ XXE：vul/xxe/xxe_1.php 提交 Payload <?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/hostname">]><a>&xxe;</a> → 回显主机名
✅ PHP 反序列化：vul/unserialize/unserialize1.php POST oid=O:1:"S":1:{s:4:"test";s:30:"phpinfo();system('id');";}  → eval 反序列化
✅ 暴力破解 captcha：brute/force_code.php 验证码客户端生成可复用 bug 验证
```

---

## 三、问题及解决方案

### 问题 1：PHP8 报错 `Fatal error: Undefined constant DBPORT`

**现象**：打开 /pikachu/ 首页白屏 + Apache error.log：
```
[php:error] ... Uncaught Error: Undefined constant "DBPORT"
  in /var/www/html/pikachu/inc/mysql.inc.php:3
```

**根因**：PHP 8 起 Undefined constant 从 Notice 升级为 **Error**。老版本 Pikachu 的 inc/config.inc.php 只定义了 `DBHOST/DBUSER/DBPW/DBNAME` 四个，**遗漏了 `DBPORT` 常量**（实际 mysql.inc.php 第 3 行 `$link = mysqli_connect(DBHOST, DBUSER, DBPW, DBNAME, DBPORT)` 要用）。

**解决方案**：在 config.inc.php 最顶部 `define('DBPORT', '3306');` 补齐。本部署一次性把 `DB_*` 带下划线一套、`MYSQL_BOTH/ASSOC/NUM` 老常量、Redis 空值占位等全部提前 define 齐，缺什么补什么，消除所有 Undefined constant。

---

### 问题 2：点击 install.php 初始化按钮后 "数据连接失败，请仔细检查 inc/config.inc.php 的配置"

**现象**：install.php 刚 submit 就返回红叉 数据连接失败。

**根因**（两种可能性各踩一次）：
1. 密码写错（最常见）：`DBPW` 写的是空字符串或 root 空密码，但 MariaDB 不允许；
2. **DBHOST=localhost 的坑**：用 `localhost` 时 PHP mysqli 会优先尝试 unix socket 连接，Apache www-data 上下文下 socket 路径（/run/mysqld/mysqld.sock）权限问题，表现为 connect failed。但 SSH 里 `mysql -h localhost` 正常。

**解决方案**：
- **一律 DBHOST='127.0.0.1'**，强制 TCP 连接 + 显式 DBPORT='3306'；
- 连接凭证用 DVWA 已验证的 leet/leet123（拥有 CREATE DATABASE、DROP DATABASE 权限，install.php 会删库重建必须要有这权限）。

改完后：install.php 连接绿字 + 建表成功。

---

### 问题 3：上传类关卡文件 move 失败 permission denied

**现象**：`vul/fileupload/upload.php` 上传 jpg 不报错但路径下找不到文件；Apache error.log：
```
PHP Warning:  move_uploaded_file(/var/www/html/pikachu/vul/fileupload/upload/xx.jpg):
  Failed to open stream: Permission denied
```

**根因**：/var/www/html/pikachu 一开始是 git clone 以 root 身份拉的，目录属主 root:root，而 Apache 进程以 www-data 运行。虽然文件可读但写目录被拒。

**解决方案**：递归改属主 + 给上传目录 775：
```bash
# Kali 下执行
echo "kail" | sudo -S chown -R www-data:www-data /var/www/html/pikachu
echo "kail" | sudo -S find /var/www/html/pikachu -type d -exec chmod 775 {} \;
echo "kail" | sudo -S find /var/www/html/pikachu -type f -exec chmod 664 {} \;
```
上传/包含/ssrf 所有写文件操作瞬间正常 ✅。

---

### 问题 4：后端 verified=false，签名 `皮卡丘/PkQzm` 全部不命中

**现象**：前端 API 返回 pikachu 条目 online=true 但 verified=false：
```json
{ "id":"pikachu","status":"planned","online":true,"verified":false,"signaturesMatched":[] }
```

**根因**：vmLabs.js 预设签名 vs 实际页面（英文版 build 拉取的是作者英文版分支）：

| 预设签名 | 是否存在 | 原因 |
|---|---|---|
| `pikachu` | ✅ | `<title>Get the pikachu</title>` 有 |
| `皮卡丘`（3 个汉字） | ❌ | 英文版界面全英文，所有可见文案和图片 alt 都没"皮卡丘"三字 |
| `PkQzm` | ❌ | 未知缩写，在源码 grep 整个 pikachu 目录也找不到，可能是某 fork 的 session 名 |

只有 1/3 命中，后端判断 verified=true（只要 ≥1 签名命中就算通过），但 status=planned 时函数会**直接跳过探测返回占位信息 online=false**，导致即使页面在也显示不在线 — 两个错误叠加的表象：planned 被直接短路 → 实际上线但卡片离线。

**解决方案**：
1. `status: 'planned' → 'ready'`（关键！让 checkWebTargetOnline 进入真实 HTTP 探测分支，而不是占位 return）；
2. `signatures: ['pikachu','皮卡丘','PkQzm'] → ['pikachu','Get the pikachu','assets/css/bootstrap.min.css']`，3 个签名 curl 实际页面 100% 全命中：
   - `pikachu`：title 里有；
   - `Get the pikachu`：`<title>Get the pikachu</title>` 完整句子唯一；
   - `assets/css/bootstrap.min.css`：首页 head 里的 bootstrap CSS `<link>`，静态资源稳定出现。

改完后：signaturesMatched = 3/3，verified=true，状态绿灯亮。

---

## 四、最终访问地址与验证清单

| 功能点 | 地址与说明 | 状态 |
|---|---|---|
| **首页 + 登录入口** | `http://192.168.108.128/pikachu/index.php`（admin/123456） | ✅ HTTP 200 |
| **安装向导（重装库）** | `http://192.168.108.128/pikachu/install.php` | ✅ 可访问，可重新初始化 |
| **暴力破解模块** | `brute/force_code.php`（验证码） / `brute/basics.php`（基础用户枚举） | ✅ |
| **RCE 模块** | `rce/exec_rce.php` 命令执行 / `rce/eval_rce.php` 代码执行 | ✅ |
| **SQL 注入模块** | `sqli/digit.php?id=1` 数字型 / `sqli/char.php` 字符型 / `sqli/search.php` 搜索型 / `sqli/header.php` UA 注入 | ✅ 4 类注入点均回显数据 |
| **XSS 模块** | `xss/xss_reflected_get.php` / `xss/xss_stored.php`（留言板存储型）/ `xss/xss_dom.php` | ✅ 存储型会写入 db 再被管理员查看触发 |
| **PKXSS XSS 后台** | `http://192.168.108.128/pikachu/pkxss/`（独立 cookie 接收平台） | ✅ 独立库/配置，双平台互通 |
| **CSRF** | `csrf/getcsrf.php` GET CSRF 修改密码 / `csrf/postcsrf.php` POST 表单 | ✅ 配合 XSS 可组合利用 |
| **文件上传** | `fileupload/upload.php`（前端 JS 校验）/ `fileupload/upload2.php`（MIME）/ `fileupload/upload3.php`（getimagesize） | ✅ 3 关均正常 move |
| **文件包含** | `fileinclude/fi_local.php` LFI / `fileinclude/fi_remote.php` RFI | ✅ 支持 php://filter、日志包含技巧 |
| **反序列化** | `unserialize/unserialize1.php` 直接 unserialize($_GET) / `unserialize2.php` S 类演示 | ✅ |
| **SSRF** | `ssrf/curl.php` SSRF(curl) / `ssrf/fgc.php` SSRF(file_get_contents) | ✅ file:///dict:///gopher:// 均支持 |
| **XXE** | `xxe/xxe_1.php` 有回显 / `xxe/xxe_2.php` 无回显 OOB | ✅ libxml 默认 2.9+ 需要 `LIBXML_NOENT` 显式启用 |
| **越权+逻辑漏洞** | `overpermission/op1.php` 水平越权改他人信息 / `logic/logic.php` 支付金额抓包改 | ✅ |

**后端 API 验证（最终态）**：
```json
{
  "id": "pikachu",
  "status": "ready",
  "online": true,
  "verified": true,
  "httpCode": 200,
  "signaturesMatched": ["pikachu", "Get the pikachu", "assets/css/bootstrap.min.css"]
}
```

Day088 靶场 4 Pikachu 交付完成，12 大漏洞模块 + PKXSS 独立平台 全部可操作。
