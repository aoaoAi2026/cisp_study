# 搭建bWAPP靶场过程及遇见的问题

> 本文档存放于 docs/labs 目录中

## 一、搭建过程

### 1.1 靶场来源
jehy/bwapp GitHub（子目录 `bWAPP/` 含所有 PHP 脚本）

### 1.2 环境信息
- 操作系统：Kali Linux
- IP 地址：192.168.108.128
- Web 服务：Apache2
- 数据库：MariaDB
- 管理账号：`leet / leet123`（拥有 `WITH GRANT OPTION` 全局权限）

### 1.3 搭建步骤

1. **克隆源码到临时目录**
   ```bash
   sudo apt install git
   git clone https://githubfast.com/jehy/bwapp.git /tmp/bwapp_source
   ```

2. **拷贝 bWAPP 子目录到 Web 根目录**
   ```bash
   sudo cp -r /tmp/bwapp_source/bWAPP/ /var/www/html/bwapp
   sudo chown -R www-data:www-data /var/www/html/bwapp
   sudo chmod -R 755 /var/www/html/bwapp
   ```

3. **配置文件链路说明**
   - `connect_i.php` → `include("config.inc.php")` → `include("admin/settings.php")`
   - 因此只需修改 `admin/settings.php` 即可注入以下配置项：
     - `$db_server`
     - `$db_username`
     - `$db_password`
     - `$db_name`

4. **创建数据库与授权用户**
   使用 `leet / leet123` 管理账号登录 MariaDB，执行：
   ```sql
   CREATE DATABASE bwapp;
   CREATE USER 'bwapp'@'localhost' IDENTIFIED BY 'bwapp123';
   GRANT ALL PRIVILEGES ON bwapp.* TO 'bwapp'@'localhost' WITH GRANT OPTION;
   FLUSH PRIVILEGES;
   ```

5. **验证与初始化**
   - 访问 `http://192.168.108.128/bwapp/login.php`，HTTP 200 验证页面可达
   - 后续访问 `/bwapp/install.php` 完成建表
   - 默认登录凭据：`bee / bug`

---

## 二、遇见的问题及解决方案

### 问题 1：sudo mysql 通过 unix socket 登录被拒绝

**现象**：
```
Access denied for root@localhost using password NO
```

**原因**：
MariaDB root 账号并非使用 `unix_socket` 免密认证，而是密码认证。之前脚本中的 `2>/dev/null` 吞掉了所有 mysql stderr 输出，误以为数据库创建成功。

**解决方案**：
- 改用显式指定管理账号 `leet / leet123` 登录：
  ```bash
  mysql -u leet -p'leet123'
  ```
- 或重置 MariaDB root 密码后继续操作。

---

### 问题 2：改错了配置文件链路理解错误

**现象**：
误以为 `admin/settings.php` 独立生效，实际未生效。

**原因**：
`connect_i.php` 并非直接 include `settings.php`，而是先 include `config.inc.php`，再由 `config.inc.php` include `admin/settings.php`。

**验证**：
执行 `head config.inc.php` 确认 include 链路正确，最终修改 `settings.php` 仍然生效（因为最终仍会被 include）。

**解决方案**：
确认链路后，直接修改 `admin/settings.php` 中的数据库配置，验证生效。

---

### 问题 3：login.php 返回 HTTP 500

**现象**：
访问 login.php 返回 500，查 Apache error.log：
```
Access denied for bwapp@localhost
```

**原因**：
`bwapp` 数据库用户未创建。

**解决方案**：
使用拥有 `WITH GRANT OPTION` 权限的管理账号 `leet / leet123` 创建 `bwapp / bwapp123` 用户并授权，问题解决。

---

### 问题 4：login.php 返回 HTTP 500（最终根因：数据库大小写混淆 + 空库）

**现象**：
访问 login.php 页面本身返回 HTTP 200（含表单和 `Enter your credentials (bee/bug)` 提示，甚至签名匹配显示 verified），一旦提交 POST 登录（bee/bug）立即返回 HTTP 500。
查 Apache error.log：
```
[php:error] ... PHP Fatal error:  Uncaught mysqli_sql_exception: Table 'bwapp.users' doesn't exist
  in /var/www/html/bwapp/login.php:44
```

**根因（多次修复后最终定位）**：
1. `admin/settings.php` 配置：
   ```php
   $db_server = "localhost";
   $db_username = "bwapp";
   $db_password = "bwapp123";
   $db_name = "bwapp";  // 注意：全小写！
   ```
2. 但之前执行手动建表 SQL 时，或被 bWAPP 官方 install.php 的默认值影响，在 MariaDB 中实际存在**两个数据库**：
   ```
   +--------------------+
   | Database           |
   +--------------------+
   | bWAPP              |  ← 大写 W 和 P，5 张表 + bee/A.I.M. 用户数据 ✅
   | bwapp              |  ← 全小写，完全空库，没有任何表 ❌
   +--------------------+
   ```
3. PHP 使用 settings.php 中的 `$db_name = "bwapp"`（小写）连接，登录 SQL 查询 `SELECT ... FROM users` 命中了空库 → `Table 'bwapp.users' doesn't exist` → 500。

**解决方案（2 选 1，这里用最快的方案 A）**：

**方案 A（推荐，一步到位，无需迁移数据）：修改 settings.php 使用已有人口数据的大写数据库名**
```bash
# 备份
sudo cp /var/www/html/bwapp/admin/settings.php /var/www/html/bwapp/admin/settings.php.bak.$(date +%s)
# 替换 db_name 值
sudo sed -i 's/$db_name = "bwapp";/$db_name = "bWAPP";/' /var/www/html/bwapp/admin/settings.php
# 重启 Apache
sudo systemctl restart apache2
```
修改后 settings.php 数据库字段：
```php
20:$db_server = "localhost";
21:$db_username = "bwapp";
22:$db_password = "bwapp123";
23:$db_name = "bWAPP";   // ← 改为大写 W/P，命中有数据的库
```

**方案 B（需要迁移数据）：把大写 bWAPP 库的 5 张表 + 数据迁移到小写 bwapp 库**
适合坚持"数据库名全小写规范"的环境：
```sql
-- 以 leet 管理员登录后执行
USE `bWAPP`; SHOW TABLES;  -- 确认有 blog/heroes/movies/users/visitors 5 张
-- 每张表执行 CREATE TABLE bwapp.X LIKE bWAPP.X; INSERT INTO bwapp.X SELECT * FROM bWAPP.X;
RENAME TABLE
  `bWAPP`.blog TO `bwapp`.blog,
  `bWAPP`.heroes TO `bwapp`.heroes,
  `bWAPP`.movies TO `bwapp`.movies,
  `bWAPP`.users TO `bwapp`.users,
  `bWAPP`.visitors TO `bwapp`.visitors;
```

**验证（修复后 curl 回归测试）**：
```
# 提交 bee/bug 登录
curl -X POST -c cookie.txt -b cookie.txt \
  -d "login=bee&password=bug&form=submit" \
  http://127.0.0.1/bwapp/login.php
# HTTP_CODE:302 + REDIRECT: portal.php → 登录成功 ✅

# 使用 Cookie 访问 portal.php
curl -b cookie.txt http://127.0.0.1/bwapp/portal.php
# 含 <title>bWAPP - Portal</title> + "Welcome bee" + 158 个漏洞 <option> → 通过 ✅
```
登录后页面含完整 158 个漏洞下拉菜单，覆盖 A1-A10 + Extras：SQLi(各种注入)、XSS(反射/存储/DOM)、XXE、SSRF、CSRF、Heartbleed、Shellshock、文件上传、文件包含、点击劫持等。

---

## 三、访问地址与验证截图

### 访问地址
```
http://192.168.108.128/bwapp/login.php
```

### 默认登录凭据
- 用户名：`bee`
- 密码：`bug`

### 验证截图位置
截图存放于项目 `docs/labs/screenshots/bwapp/` 目录下（如不存在请手动创建并补充截图）：
- `login-page-200.png`：login.php 页面访问成功（HTTP 200）
- `install-success.png`：install.php 建表成功页面
- `dashboard-login.png`：使用 bee/bug 登录后的首页截图
