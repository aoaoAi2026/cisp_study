# 第5章 BWAPP漏洞平台搭建

## 5.1 BWAPP概述

BWAPP（buggy web application）是一个免费开源的Web应用漏洞测试平台，由Malik Mesbahi创建。BWAPP包含了超过100个Web漏洞，涵盖了OWASP Top 10中的所有主要漏洞类型，是一个非常全面的Web安全学习平台。它使用PHP编写，支持多种数据库后端。

### 5.1.1 BWAPP的特点

- **漏洞数量多**：包含100+个Web漏洞
- **漏洞类型全面**：涵盖几乎所有常见Web漏洞
- **难度分级**：提供低、中、高三个安全级别
- **多语言支持**：支持英语、法语、荷兰语等
- **CMS集成**：包含了对WordPress、Joomla、Drupal等CMS的漏洞示例
- **移动端支持**：包含一些移动API漏洞
- **学习资源丰富**：官方提供详细的漏洞说明和修复建议

### 5.1.2 与其他靶场对比

| 特性 | DVWA | BWAPP | WebGoat |
|-----|------|-------|---------|
| 漏洞数量 | 约15个 | 100+个 | 约40个课程 |
| 难度级别 | 4级 | 3级 | 循序渐进 |
| 语言 | PHP | PHP | Java |
| 学习曲线 | 简单 | 中等 | 较难 |
| 适合人群 | 初学者 | 初中级 | 中高级 |

### 5.1.3 环境要求

| 组件 | 最低版本要求 |
|-----|-----------|
| 操作系统 | Windows/Linux/macOS |
| Web服务器 | Apache/Nginx |
| PHP | 5.4 及以上 |
| MySQL | 5.0 及以上 |
| 浏览器 | 任意现代浏览器 |

## 5.2 【Windows环境】PHPStudy搭建BWAPP

### 步骤1：下载BWAPP源码

**操作位置**：本地计算机浏览器

**执行命令**：无（手动下载）

1. 访问BWAPP官方下载页面：https://sourceforge.net/projects/bwapp/
2. 或访问GitHub仓库：https://github.com/BWAPP/bwapp
3. 点击"Download"或Clone按钮下载ZIP包

**预期输出**：下载得到 `bwapp-master.zip` 或通过Git克隆得到 `bwapp` 文件夹

---

### 步骤2：解压到PHPStudy网站目录

**操作位置**：Windows文件资源管理器

**执行命令**：无（手动操作）

1. 解压下载的ZIP包
2. 将解压后的 `bwapp` 文件夹复制到PHPStudy网站目录

```powershell
# 典型路径示例
E:\phpStudy\WWW\bwapp
# 或
D:\phpstudy_pro\WWW\bwapp
```

**预期输出**：在PHPStudy网站目录下看到bwapp文件夹，目录结构如下：

```
E:\phpStudy\WWW\bwapp\
├── admin/
├── images/
├── password/
├── connect_bwapp.php
├── hall.php
├── login.php
├── logout.php
├── register.php
├── admin.php
├── config/
│   └── inc/
│       └── config.inc.php.dist
├── db/
│   └── bwapp.sql
└── ...
```

---

### 步骤3：配置BWAPP数据库连接

**操作位置**：Windows命令行或文件编辑器

**执行命令**：

```powershell
# 位置：E:\phpStudy\WWW\bwapp\

# 复制配置文件
copy config\inc\config.inc.php.dist config\inc\config.inc.php
```

**预期输出**：

```
已复制         1 个文件。
```

**配置数据库连接**：

编辑 `E:\phpStudy\WWW\bwapp\config\inc\config.inc.php` 文件：

```php
<?php
/* 手动设置 - 2018-05-14 */

// Database connection settings
$db_server = "localhost";
$db_username = "root";           # 根据PHPStudy配置填写
$db_password = "root";           # 根据PHPStudy配置填写
$db_name = "bwapp";

// 其他设置...
?>
```

> **注意**：PHPStudy默认MySQL用户名通常是 `root`，密码也是 `root` 或为空。请根据实际情况修改。

---

### 步骤4：创建bwapp数据库

**操作位置**：phpMyAdmin管理界面

**执行命令**：无（通过Web界面操作）

1. 打开浏览器访问 phpMyAdmin：`http://localhost/phpmyadmin`
2. 点击"数据库"选项卡
3. 在"新建数据库"输入框中填写 `bwapp`
4. 选择排序规则：`utf8_general_ci`
5. 点击"创建"按钮

**预期输出**：

```
数据库 "bwapp" 已创建。
编码: UTF-8 Unicode (utf8_general_ci)
```

**导入SQL表结构**：

1. 点击左侧边栏中的 `bwapp` 数据库
2. 点击顶部"导入"选项卡
3. 点击"选择文件"，浏览到 `E:\phpStudy\WWW\bwapp\db\bwapp.sql`
4. 点击"执行"按钮

**预期输出**：

```
导入成功，执行了 XX 条查询。
```

---

### 步骤5：配置PHP参数

**操作位置**：PHPStudy管理界面

**执行命令**：无（通过图形界面操作）

1. 打开PHPStudy，托盘图标右键 → 打开PHPStudy面板
2. 点击"设置" → "PHP扩展"
3. 确保以下扩展已启用：
   - `mysqli` 或 `mysqlnd`
   - `mbstring`
   - `gd`
   - `curl`（部分功能需要）

4. 点击"配置" → "php.ini"
5. 确保以下配置项：

```ini
allow_url_fopen = On
allow_url_include = On
display_errors = On
file_uploads = On
```

6. 保存并重启Apache服务

---

### 步骤6：访问安装页面完成安装

**操作位置**：Web浏览器

**执行命令**：无

1. 打开浏览器访问：`http://localhost/bwapp/install.php`
2. 或使用域名访问：`http://bwapp.test/install.php`（需配置虚拟主机）

**预期输出**：

```
bWAPP Setup
=====================================

bWAPP has not been installed yet!

[  Click here to install bWAPP  ]
```

3. 点击"Click here to install bWAPP"链接

**预期输出**：

```
bWAPP has been installed successfully!
Enjoy bWAPP!
```

---

### 步骤7：登录BWAPP

**操作位置**：Web浏览器

**执行命令**：无

1. 访问登录页面：`http://localhost/bwapp/login.php`

**预期输出**：显示BWAPP登录表单

2. 输入默认凭据：
   - 用户名：`bee`
   - 密码：`bug`

3. 点击"Login"按钮

**预期输出**：成功登录后进入BWAPP主界面，显示漏洞分类菜单

---

## 5.3 【Linux环境】LAMP搭建BWAPP

### 步骤1：安装LAMP环境

**操作位置**：Linux终端

**执行命令**：

```bash
# Ubuntu/Debian系统
sudo apt update
sudo apt install -y apache2 mysql-server php php-mysql php-mbstring php-gd php-curl

# 验证服务状态
sudo systemctl status apache2
sudo systemctl status mysql
```

**预期输出**：

```
● apache2.service - The Apache HTTP Server
   Loaded: loaded (/lib/systemd/system/apache2.service; enabled)
   Active: active (running) since...
```

```
● mysql.service - MySQL Community Server
   Loaded: loaded (/lib/systemd/system/mysql.service; enabled)
   Active: active (running) since...
```

---

### 步骤2：验证PHP和MySQL

**操作位置**：Linux终端

**执行命令**：

```bash
# 检查PHP版本
php -v

# 检查MySQL版本
mysql --version

# 检查PHP模块
php -m | grep -E "mysqli|mbstring|gd"
```

**预期输出**：

```
PHP 8.1.x (cli) (built: ...)
Copyright (c) The PHP Group
Zend Engine v4.1.x
```

```
mysql  Ver 8.0.x for Linux on x86_64 (MySQL Community Server)
```

---

### 步骤3：下载BWAPP源码

**操作位置**：Linux终端

**执行命令**：

```bash
# 进入Web目录
cd /var/www/html/

# 使用Git克隆（推荐）
sudo git clone https://github.com/BWAPP/bwapp.git

# 如果Git不可用，使用wget下载
# sudo wget https://github.com/BWAPP/bwapp/archive/refs/heads/master.zip
# sudo unzip master.zip
# sudo mv bwapp-master bwapp
```

**预期输出**：

```
Cloning into 'bwapp'...
remote: Enumerating objects: XX, done.
remote: Counting objects: 100% (XX/XX), done.
Receiving objects: 100% (XX/XX), XX KiB | XX.XX MiB/s, done.
Resolving deltas: 100% (XX/XX), done.
```

---

### 步骤4：设置目录权限

**操作位置**：Linux终端

**执行命令**：

```bash
# 设置目录权限
sudo chmod -R 755 /var/www/html/bwapp/

# 设置Web服务器用户为所有者
sudo chown -R www-data:www-data /var/www/html/bwapp/

# 确保images和password目录可写
sudo chmod -R 777 /var/www/html/bwapp/images/
sudo chmod -R 777 /var/www/html/bwapp/passwords/
```

**预期输出**：无错误输出表示成功

---

### 步骤5：配置BWAPP

**操作位置**：Linux终端

**执行命令**：

```bash
# 进入bwapp目录
cd /var/www/html/bwapp

# 复制配置文件
sudo cp config/install.php.txt config/install.php
# 或者直接配置config.inc.php
```

**配置数据库连接**：

```bash
sudo nano /var/www/html/bwapp/config/inc/config.inc.php
```

修改配置文件内容：

```php
<?php
/* 手动设置 - 2024-01-01 */

// Database connection settings
$db_server = "localhost";
$db_username = "bwapp";
$db_password = "bwapp_pass";    # 自定义密码
$db_name = "bwapp";

// Other settings...
?>
```

---

### 步骤6：创建MySQL数据库和用户

**操作位置**：Linux终端

**执行命令**：

```bash
# 登录MySQL
sudo mysql
```

**预期输出**：

```
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is XX
Server version: 8.0.X MySQL Community Server
...
mysql>
```

**执行SQL命令**：

```sql
-- 创建数据库
CREATE DATABASE bwapp CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 创建专用用户
CREATE USER 'bwapp'@'localhost' IDENTIFIED BY 'bwapp_pass';

-- 授予权限
GRANT ALL PRIVILEGES ON bwapp.* TO 'bwapp'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

**预期输出**：

```
Query OK, XX rows affected (XX sec)
```

---

### 步骤7：导入BWAPP数据库表

**操作位置**：Linux终端

**执行命令**：

```bash
# 方法1：使用mysql命令导入
mysql -u bwapp -p bwapp < /var/www/html/bwapp/db/bwapp.sql

# 方法2：登录MySQL后导入
sudo mysql -u root -p
```

```sql
USE bwapp;
SOURCE /var/www/html/bwapp/db/bwapp.sql;
EXIT;
```

**预期输出**：

```
Query OK, XX rows affected (XX sec)
```

---

### 步骤8：配置PHP参数

**操作位置**：Linux终端

**执行命令**：

```bash
# 找到PHP配置文件
sudo nano /etc/php/8.1/apache2/php.ini
# 或
sudo nano /etc/php/7.4/apache2/php.ini
```

**修改配置项**：

```ini
allow_url_fopen = On
allow_url_include = On
display_errors = On
file_uploads = On
```

**重启Apache**：

```bash
sudo systemctl restart apache2
```

---

### 步骤9：访问BWAPP完成安装

**操作位置**：Web浏览器

**执行命令**：无

1. 浏览器访问：`http://localhost/bwapp/install.php`
2. 或 `http://your-ip/bwapp/install.php`（远程访问）

**预期输出**：显示安装页面

3. 点击"Click here to install bWAPP"

**预期输出**：

```
bWAPP has been installed successfully!
```

---

### 步骤10：登录测试

**操作位置**：Web浏览器

**执行命令**：无

1. 访问：`http://localhost/bwapp/login.php`
2. 输入凭据：
   - 用户名：`bee`
   - 密码：`bug`

**预期输出**：成功进入BWAPP主界面

---

## 5.4 【Docker】BWAPP快速部署

### 步骤1：安装Docker环境

**操作位置**：Linux终端 / Windows PowerShell

**【Linux环境】执行命令**：

```bash
# 安装Docker（Ubuntu/Debian）
sudo apt update
sudo apt install -y docker.io docker-compose

# 启动Docker服务
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
docker-compose --version
```

**预期输出**：

```
Docker version 24.0.x, build xxxxx
docker-compose version v2.20.x, build xxxxx
```

**【Windows环境】执行命令**：

```powershell
# 确保已安装Docker Desktop
# 打开PowerShell验证
docker --version
docker-compose --version
```

**预期输出**：同上

---

### 步骤2：拉取BWAPP镜像

**操作位置**：Linux终端 / Windows PowerShell

**执行命令**：

```bash
sudo docker pull raesene/bwapp
```

**预期输出**：

```
Using default tag: latest
latest: Pulling from raesene/bwapp
...
Status: Downloaded newer image for raesene/bwapp:latest
```

---

### 步骤3：运行BWAPP容器

**操作位置**：Linux终端 / Windows PowerShell

**执行命令**：

```bash
# 运行容器（后台模式）
sudo docker run -d --name bwapp -p 8082:80 raesene/bwapp

# 查看容器状态
sudo docker ps
```

**预期输出**：

```
CONTAINER ID   IMAGE          COMMAND                  CREATED        STATUS        PORTS                  NAMES
xxxxxxxxxxxx   raesene/bwapp  "/usr/local/bin/..."    XX seconds ago Up XX seconds  0.0.0.0:8082->80/tcp   bwapp
```

---

### 步骤4：初始化BWAPP

**操作位置**：Web浏览器

**执行命令**：无

1. 访问安装页面：`http://localhost:8082/bwapp/install.php`
2. 或 `http://your-ip:8082/bwapp/install.php`

**预期输出**：

```
bWAPP Setup
=====================================
bWAPP has not been installed yet!
[  Click here to install bWAPP  ]
```

3. 点击安装链接

**预期输出**：

```
bWAPP has been installed successfully!
```

---

### 步骤5：登录BWAPP

**操作位置**：Web浏览器

**执行命令**：无

1. 访问：`http://localhost:8082/bwapp/login.php`
2. 登录凭据：
   - 用户名：`bee`
   - 密码：`bug`

**预期输出**：成功进入主界面

---

### 步骤6：使用Docker Compose部署（推荐）

**操作位置**：Linux终端 / Windows PowerShell

**创建docker-compose.yml文件**：

```bash
sudo nano /opt/bwapp/docker-compose.yml
```

**文件内容**：

```yaml
version: '3.8'

services:
  bwapp:
    image: raesene/bwapp
    container_name: bwapp
    ports:
      - "8082:80"
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=bwapp_docker
```

**启动服务**：

```bash
# 创建目录
sudo mkdir -p /opt/bwapp
cd /opt/bwapp

# 启动服务
sudo docker-compose up -d

# 查看状态
sudo docker-compose ps
```

**预期输出**：

```
NAME                COMMAND                  SERVICE             STATUS              PORTS
bwapp               "/usr/local/bin/..."     bwapp               running             0.0.0.0:8082->80/tcp
```

---

## 5.5 【通用】BWAPP账号配置与界面介绍

### 5.5.1 默认账号说明

| 用户名 | 密码 | 角色 | 说明 |
|--------|------|------|------|
| bee | bug | 普通用户 | 主要学习账号 |
| admin | 12345678 | 管理员 | 可管理所有设置 |

---

### 5.5.2 主界面功能区域

**顶部导航栏**：
- bWAPP Logo
- 当前安全级别显示（low/medium/high）
- 用户信息
- 登出按钮

**左侧漏洞分类菜单**：
- SQL Injection（SQL注入）
- XSS（跨站脚本）
- Authentication（认证）
- Authorization（授权）
- File Management（文件管理）
- CSRF（跨站请求伪造）
- XXE（XML外部实体）
- SSRF（服务端请求伪造）
- etc.

**主内容区**：
- 当前漏洞模块说明
- 漏洞测试表单
- 漏洞测试结果

---

### 5.5.3 安全级别设置

**操作位置**：Web浏览器

1. 在页面顶部的"Security level"下拉菜单中选择级别
2. 点击"Set"按钮确认

| 级别 | 说明 | 适用场景 |
|------|------|----------|
| low | 漏洞明显，容易利用 | 入门学习 |
| medium | 有基本防护 | 进阶学习 |
| high | 防护较完善 | 高级挑战 |

---

## 5.6 BWAPP漏洞分类（100+漏洞）

### 5.6.1 A1-Injection（注入漏洞）

| 漏洞名称 | 安全级别 | 说明 |
|----------|----------|------|
| SQL Injection (GET/Search) | Low-Medium | GET型SQL注入-搜索框 |
| SQL Injection (GET/Select) | Low-Medium | GET型SQL注入-下拉框 |
| SQL Injection (Login Form/Hero) | Low | 登录表单SQL注入 |
| SQL Injection (Login Form/Admin) | Low | 管理员登录SQL注入 |
| SQL Injection (Insert) | Low | INSERT语句SQL注入 |
| SQL Injection (Update) | Low | UPDATE语句SQL注入 |
| SQL Injection - Stored (Blog) | Low-Medium | 存储型SQL注入-博客 |
| SQL Injection - Blind | Medium-High | SQL盲注 |
| LDAP Injection | Medium | LDAP注入 |
| XML/XPath Injection | Low-Medium | XML/XPath注入 |
| Command Injection | Medium-High | 命令注入 |
| HTML Injection - Reflected | Low-Medium | HTML注入-反射型 |
| HTML Injection - Stored | Low-Medium | HTML注入-存储型 |
| PHP Code Injection | High | PHP代码注入 |
| SSI Injection | Medium | 服务端包含注入 |

---

### 5.6.2 A2-Broken Authentication（认证失效）

| 漏洞名称 | 安全级别 | 说明 |
|----------|----------|------|
| Session ID in URL | Low | URL会话ID |
| Insecure Login Forms | Low | 不安全登录表单 |
| Password Attacks | Medium | 密码攻击 |
| Password Change | Low | 密码修改 |
| Forgot Password | Low | 忘记密码 |
| Two-Factor Authentication | High | 双因素认证 |

---

### 5.6.3 A3-XSS（跨站脚本）

| 漏洞名称 | 安全级别 | 说明 |
|----------|----------|------|
| XSS - Reflected (GET) | Low | 反射型XSS-GET |
| XSS - Reflected (POST) | Low | 反射型XSS-POST |
| XSS - Reflected (AJAX) | Low | 反射型XSS-AJAX |
| XSS - Reflected (JSON) | Low | 反射型XSS-JSON |
| XSS - Stored (Blog) | Low-Medium | 存储型XSS-博客 |
| XSS - Stored (Cookie) | Medium | 存储型XSS-Cookie |
| XSS - DOM | Medium | DOM型XSS |

---

### 5.6.4 A4-Insecure Direct Object References（不安全的直接对象引用）

| 漏洞名称 | 安全级别 | 说明 |
|----------|----------|------|
| IDOR | Low-Medium | 不安全的直接对象引用 |
| Directory Traversal | Low-Medium | 目录遍历 |
| File Inclusion - Local | Low | 本地文件包含 |
| File Inclusion - Remote | High | 远程文件包含 |

---

### 5.6.5 A5-Security Misconfiguration（安全配置错误）

| 漏洞名称 | 安全级别 | 说明 |
|----------|----------|------|
| Admin Panel | Low | 管理后台 |
| Error Pages | Low | 错误页面信息泄露 |
| HTTP Security Headers | Medium | HTTP安全头缺失 |
| Debug Mode | Medium | 调试模式 |

---

### 5.6.6 A6-Sensitive Data Exposure（敏感数据泄露）

| 漏洞名称 | 安全级别 | 说明 |
|----------|----------|------|
| Insecure Login | Low | 不安全登录 |
| MySQL Data Exposure | Medium | MySQL数据泄露 |
| Information Disclosure | Low-Medium | 信息泄露 |

---

### 5.6.7 A7-Missing Access Control（访问控制缺失）

| 漏洞名称 | 安全级别 | 说明 |
|----------|----------|------|
| Missing Functional Access Control | Low-Medium | 功能级访问控制缺失 |
| Horizontal Privilege Escalation | Medium | 水平权限提升 |
| Vertical Privilege Escalation | Medium-High | 垂直权限提升 |

---

### 5.6.8 A8-CSRF（跨站请求伪造）

| 漏洞名称 | 安全级别 | 说明 |
|----------|----------|------|
| CSRF (Change Password) | Low | CSRF修改密码 |
| CSRF (Transfer Credits) | Low | CSRF转账 |
| CSRF (Blog) | Low | CSRF博客 |

---

### 5.6.9 A9-A10 其他漏洞

| 漏洞名称 | 安全级别 | 说明 |
|----------|----------|------|
| XXE - Basic | Medium | XML外部实体注入基础 |
| XXE - Blind | High | XXE盲注 |
| SSRF (Port Scanning) | Medium | SSRF端口扫描 |
| HTTP Response Splitting | High | HTTP响应分割 |
| Insecure Web Service | Medium | 不安全的Web服务 |

---

## 5.7 BWAPP使用技巧与学习建议

### 5.7.1 学习路线建议

**初级阶段**：
1. 设置安全级别为 `low`
2. 从SQL Injection基础关卡开始
3. 学习XSS三种类型的区别
4. 了解文件上传漏洞的基本原理

**中级阶段**：
1. 提升到 `medium` 级别
2. 学习绕过技术（如SQL注入绕过）
3. 练习CSRF攻击与防御
4. 学习IDOR漏洞的利用

**高级阶段**：
1. 挑战 `high` 级别
2. 深入理解防护机制
3. 学习组合漏洞利用
4. 研究修复方案

---

### 5.7.2 常用工具配合

**Burp Suite配置**：

1. 设置浏览器代理：`127.0.0.1:8080`
2. 拦截请求并修改参数
3. 使用Repeater重放测试
4. 使用Intruder进行暴力测试

**sqlmap配合BWAPP**：

```bash
# GET型SQL注入检测
sqlmap -u "http://localhost/bwapp/sqli_1.php?title=test&action=search" \
       --cookie="PHPSESSID=xxx; security_level=0"

# POST型SQL注入检测
sqlmap -u "http://localhost/bwapp/sqli_2.php" \
       --data="title=test&action=search" \
       --cookie="PHPSESSID=xxx; security_level=0"

# 自动化枚举
sqlmap -u "http://localhost/bwapp/sqli_1.php" \
       --cookie="PHPSESSID=xxx; security_level=0" \
       --dbs --tables --columns --dump
```

---

## 5.8 【常见问题】BWAPP安装与使用问题

### 5.8.1 安装问题

---

**问题1：访问install.php显示空白页或错误**

**可能原因**：
- Apache/PHP/MySQL服务未启动
- PHP配置错误
- 文件权限不足

**解决方法**：

```powershell
# Windows - 检查PHPStudy服务状态
# 打开PHPStudy面板，查看Apache和MySQL是否运行

# Linux - 检查服务状态
sudo systemctl status apache2
sudo systemctl status mysql

# 检查PHP错误日志
sudo tail -f /var/log/apache2/error.log
# 或
sudo tail -f /var/log/httpd/error_log
```

---

**问题2：数据库连接失败（Database connection failed）**

**可能原因**：
- MySQL服务未启动
- config.inc.php中数据库凭据错误
- 数据库用户权限不足

**解决方法**：

```sql
-- 登录MySQL检查
sudo mysql -u root -p

-- 检查用户权限
SHOW GRANTS FOR 'bwapp'@'localhost';

-- 重新授予权限
GRANT ALL PRIVILEGES ON bwapp.* TO 'bwapp'@'localhost';
FLUSH PRIVILEGES;
```

**检查config.inc.php配置**：

```php
$db_server = "localhost";
$db_username = "bwapp";
$db_password = "your_password";  # 与创建用户时的密码一致
$db_name = "bwapp";
```

---

**问题3：登录失败，用户名bee/bug无法登录**

**可能原因**：
- 数据库未正确导入
- sessions表为空
- 安全级别设置问题

**解决方法**：

```sql
-- 检查users表
sudo mysql -u root -p bwapp
SELECT * FROM users;
```

**预期输出**：

```
+--------+----------+----------------------------------+-------------+
| userid | login    | password                         | email       |
+--------+----------+----------------------------------+-------------+
| 1      | bee      | 8c3536ec4c9fa2f5a6f3a6892b8c5ad4 | bee@bwapp.com |
+--------+----------+----------------------------------+-------------+
```

如果为空，需要重新导入 `bwapp.sql`：

```bash
mysql -u bwapp -p bwapp < /var/www/html/bwapp/db/bwapp.sql
```

---

### 5.8.2 功能问题

---

**问题4：文件上传功能不工作**

**可能原因**：
- images目录权限不足
- PHP file_uploads配置关闭
- 安全级别设置为high

**解决方法**：

```bash
# Linux - 设置目录权限
sudo chmod -R 777 /var/www/html/bwapp/images/
sudo chmod -R 777 /var/www/html/bwapp/passwords/
```

```ini
; php.ini检查
file_uploads = On
upload_max_filesize = 2M
post_max_size = 8M
```

---

**问题5：命令注入漏洞无法执行命令**

**可能原因**：
- PHP的exec/shell_exec等函数被禁用
- 安全级别为high
- disable_functions配置

**解决方法**：

```bash
# 检查禁用函数
php -i | grep disable_functions

# 如果在安全级别high下，命令注入是被禁用的
# 切换到low或medium级别测试
```

---

**问题6：某些漏洞页面显示404 Not Found**

**可能原因**：
- .htaccess文件被忽略
- Apache mod_rewrite未启用
- URL重写规则问题

**解决方法**：

```bash
# Linux - 启用mod_rewrite
sudo a2enmod rewrite
sudo systemctl restart apache2

# 检查Apache配置允许.htaccess
sudo nano /etc/apache2/sites-available/000-default.conf
```

添加：

```apache
<Directory /var/www/html/bwapp>
    AllowOverride All
</Directory>
```

---

### 5.8.3 Docker问题

---

**问题7：Docker容器启动后无法访问**

**可能原因**：
- 端口冲突
- 防火墙阻止
- 容器网络问题

**解决方法**：

```bash
# 检查端口占用
sudo netstat -tulpn | grep 8082
# 或
sudo lsof -i :8082

# 检查容器日志
sudo docker logs bwapp

# 检查防火墙（Linux）
sudo ufw status
sudo ufw allow 8082/tcp
```

---

**问题8：容器内数据库初始化失败**

**可能原因**：
- 容器启动时数据库连接超时
- 容器启动顺序问题

**解决方法**：

```bash
# 等待几秒后重新访问install.php
sleep 10
# 重新访问 http://localhost:8082/bwapp/install.php

# 或重启容器
sudo docker restart bwapp
```

---

**问题9：如何完全删除BWAPP容器和镜像**

**解决方法**：

```bash
# 停止并删除容器
sudo docker stop bwapp
sudo docker rm bwapp

# 删除镜像
sudo docker rmi raesene/bwapp

# 一键清理（如果使用docker-compose）
cd /opt/bwapp
sudo docker-compose down --rmi all
```

---

## 5.9 本章小结

本章详细介绍了BWAPP漏洞平台的多种搭建方法：

1. **Windows环境（PHPStudy）**：适合Windows用户快速搭建
2. **Linux环境（LAMP）**：适合服务器环境和深度学习
3. **Docker部署**：最快捷的部署方式，环境隔离且易于管理

BWAPP包含100+个Web漏洞，涵盖：
- SQL注入、XSS跨站脚本
- 认证失效、授权问题
- 文件管理、CSRF、XXE、SSRF
- CMS漏洞（WordPress、Joomla、Drupal）

建议按照"低→中→高"的难度梯度系统学习，理论结合实践，掌握漏洞原理和防御方法。
