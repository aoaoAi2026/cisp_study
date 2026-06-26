# 第9章 Web服务器安全加固

## 9.1 Web服务器安全概述

Web服务器是互联网中最常见的服务之一，也是黑客攻击的主要目标。常见的Web服务器安全威胁包括：SQL注入、跨站脚本（XSS）、跨站请求伪造（CSRF）、文件上传漏洞、敏感信息泄露、DDoS攻击、暴力破解等。

Nginx和Apache是Linux系统上最流行的两款Web服务器软件。Nginx以其高性能、低内存消耗著称，适合处理高并发请求；Apache以其功能丰富、模块化程度高著称，适合各种复杂应用场景。无论使用哪款Web服务器，都需要从配置优化、访问控制、传输加密、安全头部等多个维度进行加固。

Web服务器安全加固的原则是最小权限原则：只开放必要的功能和服务，删除或禁用不需要的模块和配置，定期更新软件版本以修复已知漏洞，使用安全的加密协议和证书，配置合理的访问控制策略。

## 9.2 Nginx安全配置详解

### 9.2.1 Nginx安装与基础配置

```bash
# 安装Nginx（CentOS/RHEL）
yum install -y epel-release
yum install -y nginx

# 安装Nginx（Debian/Ubuntu）
apt-get update
apt-get install -y nginx

# 启动并设置开机启动
systemctl enable nginx
systemctl start nginx

# 检查安装版本（应使用最新稳定版）
nginx -v
nginx -V

# 验证配置语法
nginx -t

# 主要配置文件位置
# /etc/nginx/nginx.conf          主配置文件
# /etc/nginx/conf.d/              子配置文件目录
# /etc/nginx/sites-available/    站点配置（Debian/Ubuntu）
# /etc/nginx/sites-enabled/       已启用站点（Debian/Ubuntu）
```

### 9.2.2 Nginx主配置文件安全加固

```bash
# 编辑Nginx主配置文件
vi /etc/nginx/nginx.conf

# 安全加固配置
user nginx;                    # 运行用户
worker_processes auto;         # 自动设置工作进程数
error_log /var/log/nginx/error.log warn;  # 错误日志级别
pid /var/run/nginx.pid;        # PID文件位置

# 加载动态模块（如果需要）
# load_module /usr/lib64/nginx/modules/ngx_http_perl_module.so;

events {
    worker_connections 1024;   # 单工作进程最大连接数
    multi_accept on;           # 接受多个连接
    use epoll;                 # 使用epoll多路复用
}

http {
    # 基础设置
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # 日志设置
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    '$request_id';  # 添加请求ID便于追踪
    access_log /var/log/nginx/access.log main;
    
    # 安全相关设置
    server_tokens off;          # 隐藏版本号
    more_clear_headers 'Server';  # 清除Server头
    
    # 文件上传限制
    client_max_body_size 10M;   # 最大请求体大小
    client_body_buffer_size 128k;  # 请求体缓冲区大小
    
    # 超时设置
    client_header_timeout 15s;
    client_body_timeout 15s;
    send_timeout 30s;
    keepalive_timeout 65s;
    
    # 缓冲区溢出保护
    client_body_buffer_size 1k;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 8k;
    
    # 禁用IP直接访问
    default_server_ listen 80 default_server;
    listen 443 ssl default_server;
    
    # 其他安全设置
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # 引入子配置
    include /etc/nginx/conf.d/*.conf;
}
```

### 9.2.3 禁止敏感文件访问

```bash
# 在 /etc/nginx/conf.d/security.conf 中添加

# 禁用目录索引
autoindex off;

# 禁用常见的敏感文件
location ~ /\. {
    deny all;
    access_log off;
    log_not_found off;
}

# 禁用版本控制文件访问
location ~* ^\.git {
    deny all;
}
location ~* ^\.svn {
    deny all;
}
location ~* ^\.hg {
    deny all;
}

# 禁用备份文件访问
location ~* \.(bak|config|sql|fla|psd|ini|log|sh|inc|swp|dist|old|orig)$ {
    deny all;
    access_log off;
    log_not_found off;
}

# 禁止访问配置文件
location ~* \.(htaccess|htpasswd|ini|conf|cfg)$ {
    deny all;
}
```

### 9.2.4 限制HTTP方法

```bash
# 只允许GET、POST、HEAD方法
if ($request_method !~ ^(GET|POST|HEAD)$ ) {
    return 405;
}

# 或者使用更精确的配置
location / {
    limit_except GET POST HEAD {
        deny all;
    }
}
```

## 9.3 Nginx HTTPS配置

### 9.3.1 获取SSL证书

```bash
# 使用Let's Encrypt免费证书（推荐）
# 安装certbot
yum install -y epel-release
yum install -y certbot python2-certbot-nginx

# 或apt-get安装
apt-get install -y certbot python3-certbot-nginx

# 获取并自动配置证书
certbot --nginx -d example.com -d www.example.com

# 仅获取证书（手动配置）
certbot certonly --webroot -w /var/www/html -d example.com -d www.example.com

# 查看证书位置
ls -la /etc/letsencrypt/live/example.com/

# 证书包含：
# fullchain.pem    完整证书链
# privkey.pem       私钥
# cert.pem          服务器证书
# chain.pem         中间证书
```

### 9.3.2 HTTPS服务器配置

```bash
# /etc/nginx/conf.d/ssl.conf

server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    
    # 强制重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com www.example.com;
    
    # SSL证书配置
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    # SSL安全配置
    ssl_protocols TLSv1.2 TLSv1.3;  # 只启用TLS1.2和1.3
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:
                 ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:
                 ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:
                 DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;
    
    # SSL会话优化
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    
    # OCSP Stapling配置
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
    
    # 安全头部
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
    
    # HSTS预加载（确认后再启用）
    # add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # 根目录
    root /var/www/html;
    index index.html index.htm;
    
    # 其他配置...
}
```

### 9.3.3 SSL测试与优化

```bash
# 使用Qualys SSL Labs测试配置
# 访问：https://www.ssllabs.com/ssltest/

# 本地测试SSL配置
openssl s_client -connect example.com:443 -starttls http
openssl s_client -connect example.com:443

# 检查证书信息
openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates -subject -issuer

# 检查支持的协议
openssl s_client -connect example.com:443 -tls1_2
openssl s_client -connect example.com:443 -tls1_3

# 检查DH参数
openssl dhparam -in /etc/nginx/ssl.dhparam.pem -text -noout
```

## 9.4 Nginx访问控制

### 9.4.1 基于IP的访问控制

```bash
# 允许特定IP访问管理后台
location /admin/ {
    allow 192.168.1.0/24;
    allow 10.0.0.0/8;
    deny all;
}

# 禁止特定IP访问
location / {
    deny 192.168.1.100;
    deny 10.0.0.0/8;
    allow all;
}

# 使用GeoIP模块限制国家访问（需要安装GeoIP库）
# yum install geoip-devel nginx-module-geoip
# 或 apt-get install libgeoip-dev nginx-module-geoip

# 配置示例
geoip_country /usr/share/GeoIP/GeoIP.dat;
geoip_city /usr/share/GeoIP/GeoLiteCity.dat;

server {
    # 允许特定国家访问
    if ($geoip_country_code !~ ^(CN|US|KR)$) {
        return 403;
    }
}
```

### 9.4.2 认证配置

```bash
# 使用htpasswd创建密码文件
yum install -y httpd-tools
htpasswd -cb /etc/nginx/.htpasswd admin password123

# 添加用户
htpasswd -b /etc/nginx/.htpasswd user2 password456

# 查看密码文件
cat /etc/nginx/.htpasswd

# 配置认证
location /private/ {
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
}

# 结合IP的认证（双重验证）
location /admin/ {
    satisfy any;  # 满足任一条件即可
    
    allow 192.168.1.0/24;
    deny all;
    
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

### 9.4.3 请求频率限制

```bash
# 定义限制区域
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=100r/s;

server {
    # 普通请求限制
    location / {
        limit_req zone=general burst=20 nodelay;
    }
    
    # 登录页面更严格的限制
    location /login/ {
        limit_req zone=login burst=5 nodelay;
    }
    
    # API接口限制
    location /api/ {
        limit_req zone=api burst=50 nodelay;
    }
}

# 连接数限制
limit_conn_zone $binary_remote_addr zone=conn:10m;

server {
    limit_conn conn 10;  # 单IP最大10个连接
    limit_conn_status 429;
}
```

## 9.5 Nginx限流配置

### 9.5.1 连接数限制

```bash
# 限制单个IP的并发连接数
limit_conn_zone $binary_remote_addr zone=addr:10m;

server {
    limit_conn addr 5;
    
    # 限制连接的处理方式
    limit_conn_status 503;
    limit_conn_log_level warn;
}
```

### 9.5.2 带宽限制

```bash
# 限制下载速度
location /download/ {
    limit_rate 500k;      # 限速500KB/s
    limit_rate_after 10m; # 前10MB不限速
}

# 按IP段限速
geo $limit {
    default 1;
    192.168.1.0/24 0;  # 内网不限速
}

server {
    if ($limit) {
        limit_rate 1m;
    }
}
```

### 9.5.3 复杂限流策略

```bash
# 使用map实现更复杂的限流
map $request_uri $limit_key {
    ~^/api/    $binary_remote_addr;
    ~^/login/  $binary_remote_addr;
    default    "";
}

limit_req_zone $limit_key zone=req_limit:10m rate=5r/s;

server {
    location /api/ {
        limit_req zone=req_limit burst=10 nodelay;
    }
    
    location /login/ {
        limit_req zone=req_limit burst=3 nodelay;
    }
}
```

## 9.6 Nginx安全头配置

### 9.6.1 重要安全头说明

Content-Security-Policy（CSP）用于防止XSS攻击，控制页面可以加载哪些资源。X-Frame-Options防止页面被iframe嵌入，防止点击劫持攻击。X-Content-Type-Options防止浏览器MIME类型嗅探。X-XSS-Protection是旧的XSS防护头，现在主要依赖CSP。Strict-Transport-Security（HSTS）强制使用HTTPS连接。Referrer-Policy控制Referer头的发送策略。

### 9.6.2 完整安全头配置

```bash
# 在server块中添加

# 基础安全头
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;

# CSP配置（根据实际需求调整）
# default-src 'self'：只允许同源资源
# 'unsafe-inline'：允许内联脚本（不推荐，但有时必要）
# data:：允许data:协议（用于图片等）
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.example.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.example.com; frame-ancestors 'self';" always;

# HSTS配置
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Permissions Policy（权限策略）
add_header Permissions-Policy "accelerometer=(),camera=(),geolocation=(),gyroscope=(),magnometer=(),microphone=(),payment=(),usb=()" always;

# 移除可能的泄露头
more_clear_headers 'X-Powered-By';
more_clear_headers 'X-AspNet-Version';
more_clear_headers 'X-AspNetMvc-Version';
```

## 9.7 Apache安全配置详解

### 9.7.1 Apache安装与基础配置

```bash
# 安装Apache（CentOS/RHEL）
yum install -y httpd httpd-tools

# 安装Apache（Debian/Ubuntu）
apt-get install -y apache2 apache2-utils

# 启动并设置开机启动
systemctl enable httpd
systemctl start httpd

# 验证安装
httpd -v

# 配置文件位置
# /etc/httpd/conf/httpd.conf     主配置文件（CentOS/RHEL）
# /etc/apache2/apache2.conf      主配置文件（Debian/Ubuntu）
# /etc/apache2/sites-available/  站点配置
# /etc/apache2/sites-enabled/     已启用站点
```

### 9.7.2 Apache主配置文件加固

```bash
# /etc/httpd/conf/httpd.conf

ServerTokens Prod      # 只显示"Server: Apache"
ServerRoot "/etc/httpd"
PidFile run/httpd.pid
Timeout 60             # 减少超时时间
KeepAlive On
MaxKeepAliveRequests 100
KeepAliveTimeout 5

# 降低运行权限
User apache
Group apache

# 禁止目录浏览
Options -Indexes -FollowSymLinks -Includes
AllowOverride None

# 禁止访问敏感文件
<Files ".ht*">
    Require all denied
</Files>

# 安全头部
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "no-referrer-when-downgrade"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set Content-Security-Policy "default-src 'self'"

# 禁止服务器指纹
ServerSignature Off
TraceEnable Off
```

### 9.7.3 Apache安全模块

```bash
# 启用必要的安全模块（Debian/Ubuntu）
a2enmod headers
a2enmod ssl
a2enmod rewrite
a2enmod authz_groupfile
a2enmod reqtimeout
a2enmod filter

# 检查已启用模块
apache2ctl -M
httpd -M
```

## 9.8 Apache HTTPS配置

### 9.8.1 SSL配置

```bash
# 安装SSL模块
a2enmod ssl

# 创建自签名证书（测试用）
mkdir -p /etc/ssl/private
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/apache.key \
    -out /etc/ssl/certs/apache.crt \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=Example/OU=IT/CN=example.com"

# SSL虚拟主机配置
# /etc/apache2/sites-available/default-ssl.conf

<VirtualHost *:443>
    ServerName example.com
    ServerAlias www.example.com
    DocumentRoot /var/www/html
    
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/apache.crt
    SSLCertificateKeyFile /etc/ssl/private/apache.key
    SSLCertificateChainFile /etc/ssl/certs/ca-bundle.crt
    
    # SSL协议和加密配置
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384
    SSLHonorCipherOrder on
    
    # HSTS
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    
    # 其他安全设置
    <Directory "/var/www/html">
        Options -Indexes -FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>
</VirtualHost>

# 启用SSL站点
a2ensite default-ssl
systemctl reload apache2
```

### 9.8.2 强制HTTPS重定向

```bash
# 在HTTP虚拟主机中添加
<VirtualHost *:80>
    ServerName example.com
    ServerAlias www.example.com
    
    RewriteEngine On
    RewriteCond %{HTTPS} !=on
    RewriteRule ^/?(.*) https://%{SERVER_NAME}/$1 [R=301,L]
</VirtualHost>
```

## 9.9 Apache访问控制

### 9.9.1 基于IP的访问控制

```bash
# 在Directory块中配置
<Directory "/var/www/html">
    # 允许特定IP段
    Require ip 192.168.1.0/24
    Require ip 10.0.0.0/8
    
    # 或拒绝特定IP
    <RequireAll>
        Require all granted
        Require not ip 192.168.1.100
    </RequireAll>
    
    # 或使用RequireAll/RequireAny组合
    <RequireAny>
        Require ip 192.168.1.0/24
        Require ip 10.0.0.0/8
    </RequireAny>
</Directory>
```

### 9.9.2 认证配置

```bash
# 创建密码文件
htpasswd -c /etc/apache/.htpasswd admin

# 配置认证
<Directory "/var/www/html/admin">
    AuthType Basic
    AuthName "Restricted Area"
    AuthUserFile /etc/apache/.htpasswd
    Require valid-user
    
    # 或只允许特定用户
    Require user admin
</Directory>

# 混合认证（IP+密码）
<Directory "/var/www/html/admin">
    <RequireAny>
        Require ip 192.168.1.0/24
        Require valid-user
    </RequireAny>
</Directory>
```

### 9.9.3 请求限制

```bash
# 安装mod_ratelimit模块
a2enmod ratelimit

# 限流配置
<IfModule mod_ratelimit.c>
    SetOutputFilter RATE_LIMIT
    SetEnv rate-limit 500  # 500KB/s
</IfModule>

# 使用mod_qos（需要安装）
# yum install mod_qos
<IfModule mod_qos.c>
    QS_SrvMaxConnPerIP 10
    QS_SrvMinDataRate 150 1200
</IfModule>
```

## 9.10 .htaccess安全配置

### 9.10.1 .htaccess基础

.htaccess文件允许目录级别的配置，无需重启Apache即可生效。但它的性能略低于主配置文件中的等效配置。

### 9.10.2 常用.htaccess安全配置

```bash
# /var/www/html/.htaccess

# 启用Rewrite引擎
RewriteEngine On

# 强制使用HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 阻止目录浏览
Options -Indexes

# 禁止访问隐藏文件
<FilesMatch "^\.">
    Require all denied
</FilesMatch>

# 禁止访问备份文件
<FilesMatch "\.(bak|config|sql|fla|psd|ini|log|sh|inc|swp|dist|old|orig)$">
    Require all denied
</FilesMatch>

# 防止SQL注入
RewriteCond %{QUERY_STRING} (\|%3E) [NC,OR]
RewriteCond %{QUERY_STRING} (<|%3C).*script.*(\>|%3E) [NC,OR]
RewriteCond %{QUERY_STRING} GLOBALS(=|\[|\%[0-9A-Z]{0,2}) [OR]
RewriteCond %{QUERY_STRING} _REQUEST(=|\[|\%[0-9A-Z]{0,2})
RewriteRule .* - [F,L]

# 防止XSS
RewriteCond %{QUERY_STRING} (<|%3C).*script.*(\>|%3E) [NC]
RewriteRule .* - [F,L]

# 防止目录遍历
RewriteCond %{QUERY_STRING} \.\./ [NC]
RewriteRule .* - [F,L]

# 设置安全头部
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "no-referrer-when-downgrade"
</IfModule>

# 限制文件上传大小
LimitRequestBody 10485760  # 10MB

# 设置字符编码
AddDefaultCharset UTF-8
```

## 9.11 Web服务器常见漏洞与防护

### 9.11.1 敏感信息泄露

```bash
# 检查服务器泄露的信息
curl -I http://example.com
curl -I http://example.com 2>&1 | grep -i server
curl -I http://example.com 2>&1 | grep -i x-powered-by

# 防护措施
# Nginx：关闭server_tokens
server_tokens off;
more_clear_headers 'X-Powered-By';
more_clear_headers 'X-AspNet-Version';

# Apache：
ServerTokens Prod
ServerSignature Off
Header unset X-Powered-By
Header unset X-AspNet-Version
```

### 9.11.2 点击劫持防护

```bash
# Nginx配置
add_header X-Frame-Options "SAMEORIGIN" always;

# Apache配置
Header always set X-Frame-Options "SAMEORIGIN"

# 可选值：
# DENY：页面不能被任何iframe嵌入
# SAMEORIGIN：只能被同源页面嵌入
# ALLOW-FROM uri：允许特定来源（已废弃）
```

### 9.11.3 CSRF防护

```bash
# 在Cookie中设置SameSite属性
# Nginx
add_header Set-Cookie "Path=/; HttpOnly; SameSite=Strict";

# Apache
Header edit Set-Cookie ^(.*)$ "$1; HttpOnly; SameSite=Strict"

# SameSite可选值：
# Strict：完全禁止跨站Cookie
# Lax：导航请求允许携带Cookie（如点击链接）
# None：允许跨站Cookie（需配合Secure）
```

### 9.11.4 请求走私防护

```bash
# 严格检查Content-Length
# Nginx
proxy_http_version 1.1;
proxy_set_header Connection "";

# Apache
RequestHeader unset Content-Length if [Present]
```

## 9.12 Web服务器安全检查

### 9.12.1 配置检查脚本

```bash
#!/bin/bash
# security_check.sh - Web服务器安全检查脚本

echo "=== Web Server Security Check ==="

# 检查版本信息泄露
echo -e "\n[1] 检查版本信息泄露..."
if command -v nginx &> /dev/null; then
    echo "Nginx检测:"
    nginx -V 2>&1 | head -1
    curl -I http://localhost 2>/dev/null | grep -i server
fi

if command -v httpd &> /dev/null; then
    echo "Apache检测:"
    httpd -v 2>&1 | grep version
    curl -I http://localhost 2>/dev/null | grep -i server
fi

# 检查SSL/TLS配置
echo -e "\n[2] 检查SSL/TLS配置..."
if [ -f /etc/nginx/conf.d/ssl.conf ] || [ -f /etc/apache2/sites-enabled/*.conf ]; then
    echo "SSL配置文件存在"
    # 检查SSL协议版本
    if command -v openssl &> /dev/null; then
        echo "支持的SSL协议:"
        openssl s_client -connect localhost:443 -tls1_2 2>&1 | grep -i "protocol" | head -1
    fi
fi

# 检查安全头部
echo -e "\n[3] 检查安全头部..."
curl -I http://localhost 2>/dev/null | grep -iE "x-frame|x-content|x-xss|strict-transport|content-security"

# 检查目录浏览
echo -e "\n[4] 检查目录浏览..."
curl -I http://localhost/.. 2>/dev/null | grep -iE "403|301|302"

# 检查防火墙
echo -e "\n[5] 检查防火墙状态..."
if command -v firewall-cmd &> /dev/null; then
    firewall-cmd --list-all | grep -i http
elif command -v ufw &> /dev/null; then
    ufw status | grep -i http
fi

# 检查日志配置
echo -e "\n[6] 检查访问日志..."
if [ -f /var/log/nginx/access.log ]; then
    echo "Nginx访问日志存在，最后5行:"
    tail -5 /var/log/nginx/access.log
elif [ -f /var/log/httpd/access_log ]; then
    echo "Apache访问日志存在，最后5行:"
    tail -5 /var/log/httpd/access_log
fi

echo -e "\n=== 检查完成 ==="
```

### 9.12.2 使用Lynis进行安全审计

```bash
# 安装Lynis
yum install -y lynis   # CentOS/RHEL
apt-get install -y lynis  # Debian/Ubuntu

# 运行安全审计
lynis audit system

# 运行特定测试
lynis audit system --tests-from-category "webserver"

# 查看帮助
lynis show options
```

## 9.13 WAF部署与配置

### 9.13.1 ModSecurity介绍

ModSecurity是开源的Web应用防火墙（WAF），可以与Apache、Nginx集成，提供实时的HTTP流量监控和攻击防护。

### 9.13.2 ModSecurity安装与配置

```bash
# 安装ModSecurity（CentOS/RHEL）
yum install -y mod_security mod_security_crs
yum install -y mod_ssl

# 安装ModSecurity（Nginx）
yum install -y mod_security mod_security_crs nginx-all-modules.noarch

# 安装ModSecurity（Debian/Ubuntu）
apt-get install -y libmodsecurity3 modsecurity-crs

# 基础配置
# /etc/httpd/conf.d/mod_security.conf

<IfModule mod_security2.c>
    # 启用ModSecurity
    SecRuleEngine On
    
    # 日志配置
    SecDebugLog /var/log/httpd/modsec_debug.log
    SecDebugLogLevel 0
    
    SecAuditEngine RelevantOnly
    SecAuditLogRelevantStatusCodes "412 417"
    SecAuditLogParts ABIJDEFHZ
    SecAuditLogType Serial
    SecAuditLog /var/log/httpd/modsec_audit.log
    
    # 规则配置
    IncludeOptional /etc/mod_security/crs/*.conf
    IncludeOptional /etc/mod_security/crs/base_rules/*.conf
    
    # 白名单
    SecRule REMOTE_ADDR "^127\.0\.0\.1$" "id:1000,phase:1,nolog,allow"
</IfModule>

# 重启服务
systemctl restart httpd
```

### 9.13.3 自定义ModSecurity规则

```bash
# /etc/httpd/conf.d/mod_security_custom.conf

# 阻止SQL注入
SecRule REQUEST_URI|REQUEST_HEADERS|ARGS|ARGS_NAMES \
    "@rx (?i)(union.*select|select.*from|insert.*into|delete.*from|drop.*table|update.*set|create.*table|alter.*table|exec.*\(|script|javascript|onerror=|onload=)" \
    "id:1001,phase:2,deny,status:403,msg:'SQL Injection or XSS Attack Detected',logdata:'%{MatchedVar}',severity:CRITICAL"

# 阻止目录遍历
SecRule REQUEST_URI|ARGS \
    "@rx (?i)(\.\.%2f|\.\./|%2e%2e%2f|%2e%2e/|%2e%2e%5c)" \
    "id:1002,phase:2,deny,status:403,msg:'Directory Traversal Attempt',logdata:'%{MatchedVar}'"

# 阻止常见扫描
SecRule REQUEST_HEADERS|REQUEST_URI \
    "@rx (?i)(nmap|nikto|sqlmap|burp|hydra|metasploit|w3af|acunetix|appscan)" \
    "id:1003,phase:1,deny,status:403,msg:'Security Scanner Detected'"

# 限制参数长度
SecRule ARGS "@gt 1000" \
    "id:1004,phase:2,deny,status:403,msg:'Argument Too Long'"

# 限制URL长度
SecRule REQUEST_LINE "@gt 8192" \
    "id:1005,phase:1,deny,status:414,msg:'Request Too Long'"
```

## 9.14 DDoS防护

### 9.14.1 Nginx DDoS防护配置

```bash
# /etc/nginx/conf.d/ddos_protection.conf

# 限制连接数
limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

server {
    limit_conn conn_limit 10;
    limit_conn_status 429;
}

# 限制请求速率
limit_req_zone $binary_remote_addr zone=req_limit:10m rate=5r/s;

server {
    limit_req zone=req_limit burst=10 nodelay;
}

# 限制带宽
location / {
    limit_rate 1m;       # 单连接限速1MB/s
    limit_rate_after 5m; # 前5MB不限速
}

# 阻止特定User-Agent
if ($http_user_agent ~* (Wget|curl|java|python|perl|go|axios|okhttp)) {
    return 403;
}

# 阻止空User-Agent
if ($http_user_agent ~ ^$) {
    return 403;
}
```

### 9.14.2 防范Slowloris攻击

```bash
# Nginx配置
client_header_timeout 15s;
client_body_timeout 15s;
send_timeout 30s;

# Apache配置
# /etc/httpd/conf/httpd.conf
Timeout 60
RequestReadTimeout header=20-40,MinRate=500 body=20,MinRate=500
```

## 9.15 实战案例：Web服务器被挂马的加固处理

### 9.15.1 场景描述

某公司Web服务器被黑客入侵，攻击者通过文件上传漏洞上传了WebShell，并篡改了网站首页。服务器被发现存在异常连接和大量垃圾文件。

### 9.15.2 紧急响应

```bash
# 1. 立即断开服务器网络连接（如果是云服务器，通过控制台操作）
# 或使用防火墙临时阻断
iptables -I INPUT -p tcp --dport 80 -j DROP
iptables -I INPUT -p tcp --dport 443 -j DROP

# 2. 检查可疑进程
ps aux | grep -E "php|python|perl|bash" | grep -v grep
top -c
lsof -i

# 3. 检查最近修改的文件
find /var/www/html -type f -mtime -7 -ls
find /tmp -type f -mtime -7 -ls
find /var/tmp -type f -mtime -7 -ls

# 4. 检查异常计划任务
crontab -l
cat /etc/crontab
ls -la /etc/cron.d/
cat /etc/cron.daily/*

# 5. 检查系统日志
last -20
lastlog
cat /var/log/auth.log | grep -i "failed\|error\|breach" | tail -50
```

### 9.15.3 查找并清除WebShell

```bash
# 1. 查找可疑PHP文件
find /var/www/html -name "*.php" -type f -exec grep -l "eval\|base64_decode\|gzinflate\|str_rot13\|shell_exec\|system(" {} \;

# 查找可疑文件特征
# 查找包含可疑函数的文件
grep -r --include="*.php" "eval(" /var/www/html/
grep -r --include="*.php" "base64_decode" /var/www/html/
grep -r --include="*.php" "shell_exec" /var/www/html/
grep -r --include="*.php" "exec(" /var/www/html/

# 查找包含混淆代码的文件
find /var/www/html -name "*.php" -type f -exec grep -l "chr\|ord\|substr\|md5\|sleep(" {} \;

# 查找最近创建的可疑文件
find /var/www/html -type f -mtime -3 -name "*.php"

# 2. 常见WebShell特征
# 一句话木马
grep -r "eval(\$_POST" /var/www/html/
grep -r "assert(\$_POST" /var/www/html/
grep -r "system(\$" /var/www/html/

# 冰鞋木马特征
grep -r "c死\$GLOBALS" /var/www/html/
grep -r "编码后的WebShell" /var/www/html/

# 3. 隔离可疑文件
mkdir /tmp/quarantine
find /var/www/html -name "*.php" -type f -exec grep -l "eval\|base64" {} \; -exec mv {} /tmp/quarantine/ \;

# 4. 清除恶意代码（如果文件可恢复）
# 使用原始备份替换被篡改的文件
```

### 9.15.4 系统安全加固

```bash
#!/bin/bash
# secure_server.sh - 服务器安全加固脚本

echo "Starting security hardening..."

# 1. 更新系统和软件
yum update -y
# 或 apt-get update && apt-get upgrade -y

# 2. 修改SSH配置
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd

# 3. 配置防火墙
iptables -F
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 2222 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT
iptables-save > /etc/iptables/rules.v4

# 4. 安装配置fail2ban
yum install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 86400
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 2222
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
EOF

systemctl restart fail2ban

# 5. 安装配置ModSecurity
yum install -y mod_security mod_security_crs
systemctl restart httpd

# 6. 设置文件和目录权限
chown -R root:root /var/www/html
chmod -R 755 /var/www/html
chmod 644 /var/www/html/*.html
chmod 644 /var/www/html/*.php
find /var/www/html -type d -exec chmod 755 {} \;

# 允许写入的目录（根据需要设置）
chmod 775 /var/www/html/uploads
chmod 775 /var/www/html/cache
chmod 775 /var/www/html/logs

# 7. 配置日志监控
cat >> /etc/logrotate.d/websec << 'EOF'
/var/www/html/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 root root
    sharedscripts
    postrotate
        systemctl reload nginx > /dev/null 2>&1 || true
    endscript
}
EOF

# 8. 启用SELinux
setenforce 1
sed -i 's/SELINUX=disabled/SELINUX=enforcing/' /etc/selinux/config

echo "Security hardening completed!"
```

### 9.15.5 后续改进

```bash
# 1. 部署Web应用防火墙（WAF）
# 使用ModSecurity规则
# 或使用云WAF服务（如阿里云WAF、腾讯云WAF）

# 2. 实施文件完整性监控
yum install -y tripwire
# 配置并初始化tripwire
twadmin --create-polfile --site-keyfile /etc/tripwire/site.key /etc/tripwire/twpol.txt
tripwire --init
# 定期检查
tripwire --check

# 3. 设置入侵检测
yum install -y aide
aide --init
aide --check

# 4. 实施备份策略
# 每天凌晨2点备份网站文件
0 2 * * * tar -czf /backup/www-$(date +\%Y\%m\%d).tar.gz /var/www/html/

# 5. 定期安全扫描
# 安装lynis进行安全审计
yum install -y lynis
lynis audit system --quick

# 6. 实施最小权限原则
# 为Web应用创建专用用户
useradd -r -s /sbin/nologin webapp
chown -R webapp:webapp /var/www/html
usermod -aG webapp apache
usermod -aG webapp nginx
```

## 9.16 本章小结

本章详细介绍了Web服务器（Nginx和Apache）的安全加固方法，涵盖了从基础配置到高级防护的各个方面。

基础安全配置部分讲解了如何隐藏服务器版本信息、禁用目录浏览、限制HTTP方法等。HTTPS配置部分介绍了SSL/TLS证书的获取和配置，以及如何启用现代加密协议和安全的加密套件。访问控制部分涵盖了基于IP的访问控制、用户名密码认证、请求频率限制等方法。

安全头部配置部分详细解释了各种安全头的作用和配置方法，包括CSP、X-Frame-Options、HSTS等。常见漏洞防护部分介绍了针对SQL注入、XSS、点击劫持等常见攻击的防护措施。

最后通过实战案例，展示了如何处理Web服务器被入侵后的紧急响应、WebShell清除和系统加固的完整流程。

## 9.17 思考题

1. 为什么生产环境中应该禁用Web服务器的版本信息显示？请说明具体的防护方法。

2. 请比较Nginx和Apache在处理高并发请求时的性能差异，以及这与安全配置的关系。

3. CSP（Content-Security-Policy）头的主要作用是什么？请设计一个合理的CSP策略。

4. 为什么要使用fail2ban等工具防护暴力破解？它的基本工作原理是什么？

5. 请解释什么是WebShell，如何检测和清除WebShell？

6. HSTS头的作用是什么？启用HSTS预加载需要注意什么？

7. ModSecurity WAF的基本工作原理是什么？它能防护哪些类型的攻击？

8. 如果发现Web服务器被入侵，应该按照怎样的流程进行应急响应？

9. 请设计一个完整的Nginx HTTPS配置，包括证书、加密套件、安全头部等。

10. 如何防止目录遍历攻击？请从Web服务器配置和应用程序代码两个层面说明。

## 9.18 Nginx高级安全配置详解

### 9.18.1 完整nginx.conf安全配置示例

```nginx
# /etc/nginx/nginx.conf 安全配置示例

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

# 安全事件日志格式
events {
    worker_connections 1024;
    multi_accept on;
}

http {
    # 基本安全配置
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # 隐藏版本信息
    server_tokens off;
    
    # 安全日志格式
    log_format security '$remote_addr - $remote_user [$time_local] '
                         '"$request" $status $body_bytes_sent '
                         '"$http_referer" "$http_user_agent" '
                         '$request_time $upstream_response_time';
    
    access_log /var/log/nginx/access.log security;
    
    # 性能优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # 缓冲区安全配置
    client_body_buffer_size 1k;
    client_header_buffer_size 1k;
    client_max_body_size 10m;
    large_client_header_buffers 2 1k;
    
    # 限制请求方法
    map $request_method $not_allowed {
        default 0;
        GET 0;
        POST 0;
        HEAD 0;
        OPTIONS 0;
        PUT 1;
        DELETE 1;
        PATCH 1;
    }
    
    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
    
    # SSL配置（如果启用）
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    include /etc/nginx/conf.d/*.conf;
}
```

### 9.18.2 Nginx请求限流详解

```nginx
# 限流配置示例
# 在http块中定义限流区域

# 基于IP的请求频率限制
limit_req_zone $binary_remote_addr zone=req_limit:10m rate=10r/s;

# 基于IP的连接数限制
limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

# 在server块中应用限流
server {
    listen 80;
    server_name example.com;
    
    # 请求频率限制（突发允许20个请求）
    limit_req zone=req_limit burst=20 nodelay;
    
    # 连接数限制（每个IP最多10个连接）
    limit_conn conn_limit 10;
    
    # 返回自定义错误页面
    limit_req_status 429;
    limit_conn_status 429;
    
    error_page 429 /429.html;
    location = /429.html {
        root /usr/share/nginx/html;
        internal;
    }
    
    # 登录接口更严格的限流
    location /login {
        limit_req zone=req_limit burst=5 nodelay;
        limit_conn conn_limit 5;
        proxy_pass http://backend;
    }
    
    # API接口限流
    location /api/ {
        limit_req zone=req_limit burst=50 nodelay;
        proxy_pass http://backend;
    }
}
```

### 9.18.3 Nginx防爬虫配置

```nginx
# 防爬虫配置
# 在server块中添加

# 禁止常见爬虫
if ($http_user_agent ~* (bot|crawl|spider|scraper|curl|wget|python|java|perl|ruby)) {
    return 403;
}

# 禁止特定爬虫
map $http_user_agent $block_bot {
    default 0;
    ~*Googlebot 0;      # 允许Google爬虫
    ~*Bingbot 0;        # 允许Bing爬虫
    ~*baiduspider 0;    # 允许百度爬虫
    ~*YandexBot 0;      # 允许Yandex爬虫
    ~*MJ12bot 1;        # 禁止MJ12bot
    ~*AhrefsBot 1;      # 禁止AhrefsBot
    ~*SemrushBot 1;     # 禁止SemrushBot
    ~*DotBot 1;         # 禁止DotBot
}

# 应用爬虫限制
server {
    if ($block_bot = 1) {
        return 403;
    }
    
    # 禁止空User-Agent
    if ($http_user_agent = "") {
        return 403;
    }
    
    # 禁止特定Referer
    if ($http_referer ~* (spam|malware|bad-site)) {
        return 403;
    }
}
```

## 9.19 ModSecurity WAF详解

### 9.19.1 ModSecurity安装配置

```bash
# 安装ModSecurity（CentOS）
yum install mod_security -y

# 安装ModSecurity（Ubuntu）
apt-get install libapache2-mod-security2 -y

# 启用ModSecurity
systemctl restart apache2

# 配置文件位置
# CentOS: /etc/httpd/conf.d/mod_security.conf
# Ubuntu: /etc/modsecurity/modsecurity.conf

# 编辑主配置
vi /etc/modsecurity/modsecurity.conf

# 启用规则引擎
SecRuleEngine On

# 设置审计日志
SecAuditEngine On
SecAuditLog /var/log/apache2/modsec_audit.log
SecAuditLogParts ABCFHZ

# 设置调试日志级别
SecDebugLog /var/log/apache2/modsec_debug.log
SecDebugLogLevel 0
```

### 9.19.2 OWASP CRS规则集配置

```bash
# 下载OWASP CRS规则集
cd /etc/modsecurity
git clone https://github.com/coreruleset/coreruleset.git owasp-crs
cd owasp-crs
cp crs-setup.conf.example crs-setup.conf

# 启用规则集
# 编辑Apache配置
vi /etc/apache2/mods-enabled/security2.conf

# 添加规则集路径
IncludeOptional /etc/modsecurity/owasp-crs/*.conf
IncludeOptional /etc/modsecurity/owasp-crs/rules/*.conf

# 重启Apache
systemctl restart apache2

# CRS规则集包含的防护：
# - SQL注入防护
# - XSS防护
# - 命令注入防护
# - 文件包含防护
# - 目录遍历防护
# - 信息泄露防护
# - 会话固定防护
```

### 9.19.3 自定义ModSecurity规则

```apache
# 自定义规则示例
# 在 /etc/modsecurity/custom_rules.conf 中添加

# 防护特定路径的SQL注入
SecRule REQUEST_URI "@streq /api/users" \
    "id:1001,phase:2,deny,status:403,msg:'SQL Injection Attempt'"

# 防护敏感文件访问
SecRule REQUEST_URI "@rx \.(env|git|svn|htpasswd|htaccess)$" \
    "id:1002,phase:1,deny,status:403,msg:'Sensitive File Access Blocked'"

# 防护命令注入
SecRule ARGS "@rx (system|exec|passthru|shell_exec|popen|proc_open)" \
    "id:1003,phase:2,deny,status:403,msg:'Command Injection Blocked'"

# 限制请求大小
SecRule REQUEST_BODY "@gt 1000000" \
    "id:1004,phase:2,deny,status:413,msg:'Request Body Too Large'"

# 防护路径遍历
SecRule REQUEST_URI "@rx (\.\./|\.\.\\)" \
    "id:1005,phase:1,deny,status:403,msg:'Path Traversal Blocked'"

# 白名单IP
SecRule REMOTE_ADDR "@ipMatch 192.168.1.0/24" \
    "id:1006,phase:1,pass,nolog,ctl:ruleEngine=Off"
```

## 9.20 Web服务器安全检查清单

| 检查项 | 检查方法 | 安全标准 |
|--------|---------|---------|
| 版本隐藏 | `curl -I http://localhost` | 无Server版本信息 |
| HTTPS启用 | `curl -I https://localhost` | TLSv1.2+ |
| HSTS头 | `curl -I https://localhost` | strict-transport-security |
| X-Frame-Options | `curl -I http://localhost` | SAMEORIGIN |
| X-Content-Type-Options | `curl -I http://localhost` | nosniff |
| 限流配置 | `nginx -T | grep limit` | 已配置 |
| WAF启用 | `apachectl -M | grep security` | mod_security |
| 日志格式 | `cat /etc/nginx/nginx.conf` | 包含安全字段 |
| 错误页面 | `ls /usr/share/nginx/html` | 自定义错误页 |
| 目录权限 | `ls -la /var/www/html` | 755或更严格 |
| 文件上传限制 | `nginx -T | grep body_size` | 已限制 |
| 禁用危险方法 | `nginx -T | grep PUT` | PUT已禁用 |

## 9.21 本章补充小结

Web服务器安全加固是Linux系统安全的重要组成部分。本章补充介绍了：

- **Nginx高级安全配置**：完整的nginx.conf安全配置示例、请求限流详解、防爬虫配置
- **ModSecurity WAF详解**：安装配置、OWASP CRS规则集、自定义规则编写
- **安全检查清单**：建立标准化的Web服务器安全检查流程

通过这些补充内容，可以建立更加完善的Web服务器安全管理体系，有效防止SQL注入、XSS、命令注入等常见Web攻击。