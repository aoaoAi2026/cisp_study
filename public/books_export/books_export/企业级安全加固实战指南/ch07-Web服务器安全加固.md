# 第七章 Web服务器安全加固

## 7.1 Web服务器安全概述

Web服务器是企业对外提供服务的主要入口，也是攻击者最常针对的目标。Nginx和Apache是最主流的两款Web服务器，本章将分别介绍它们的安全加固方法。

### 7.1.1 Web服务器攻击面

```
Web服务器攻击面：
├── 服务层攻击
│   ├── 服务器软件漏洞
│   ├── 配置错误利用
│   ├── 拒绝服务攻击
│   └── 明文传输窃听
├── 应用层攻击
│   ├── SQL注入
│   ├── XSS跨站脚本
│   ├── 文件上传漏洞
│   ├── 目录遍历
│   └── 命令注入
├── 信息泄露
│   ├── 服务器版本泄露
│   ├── 目录列表泄露
│   ├── 错误信息泄露
│   └── 备份文件泄露
└── 传输层攻击
    ├── SSL/TLS漏洞
    ├── 证书问题
    └── 中间人攻击
```

### 7.1.2 加固整体思路

```
Web服务器安全加固五层模型：

第1层：传输安全（HTTPS/TLS）
├── 强加密套件
├── 证书安全
└── HSTS

第2层：服务器配置安全
├── 隐藏版本信息
├── 禁用危险方法
├── 访问控制
└── 安全响应头

第3层：应用防护
├── WAF规则
├── 请求限制
└── 输入验证

第4层：文件系统安全
├── 权限隔离
├── 禁止执行权限
└── 敏感文件保护

第5层：日志与监控
├── 访问日志
├── 错误日志
└── 安全审计
```

## 7.2 Nginx安全加固

### 7.2.1 基础安全配置

```nginx
# /etc/nginx/nginx.conf

user nginx;
worker_processes auto;
worker_rlimit_nofile 65535;

error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 10240;
    use epoll;
    multi_accept on;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # ===== 隐藏版本信息 =====
    server_tokens off;
    
    # ===== 日志格式 =====
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    # ===== 基础性能与安全 =====
    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;
    keepalive_timeout  65;
    types_hash_max_size 2048;
    server_names_hash_bucket_size 128;
    client_header_buffer_size 4k;
    large_client_header_buffers 4 32k;

    # ===== 请求体限制（防大文件攻击） =====
    client_max_body_size 10m;
    client_body_buffer_size 128k;
    client_header_timeout 10;
    client_body_timeout 10;
    send_timeout 10;

    # ===== Gzip压缩 =====
    gzip on;
    gzip_min_length 1k;
    gzip_buffers 4 16k;
    gzip_comp_level 6;
    gzip_types text/plain application/x-javascript text/css application/xml application/json;
    gzip_vary on;
    gzip_disable "MSIE [1-6]\.";

    # ===== 安全响应头 =====
    # 点击劫持防护
    add_header X-Frame-Options "SAMEORIGIN" always;
    # MIME类型嗅探防护
    add_header X-Content-Type-Options "nosniff" always;
    # XSS防护（现代浏览器已不推荐，改用CSP）
    add_header X-XSS-Protection "1; mode=block" always;
    # 引用策略
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    # 内容安全策略（根据实际情况调整）
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';" always;
    # HSTS（HTTPS环境启用）
    # add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # ===== 限流配置 =====
    # 连接数限制
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;
    # 请求频率限制
    limit_req_zone $binary_remote_addr zone=req_limit:10m rate=10r/s;
    # 爬虫限制
    limit_req_zone $http_user_agent zone=crawler:10m rate=1r/s;

    include /etc/nginx/conf.d/*.conf;
}
```

### 7.2.2 服务器块安全配置

```nginx
# /etc/nginx/conf.d/example.com.conf

server {
    listen 80;
    server_name www.example.com example.com;
    root /var/www/example.com;
    index index.html index.php;

    # ===== 隐藏Nginx版本 =====
    server_tokens off;

    # ===== 字符集 =====
    charset utf-8;

    # ===== 访问日志 =====
    access_log /var/log/nginx/example.com.access.log main;
    error_log /var/log/nginx/example.com.error.log warn;

    # ===== 连接限制 =====
    limit_conn conn_limit 10;
    limit_req zone=req_limit burst=20 nodelay;

    # ===== 禁止访问隐藏文件 =====
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # ===== 禁止访问敏感文件 =====
    location ~* \.(bak|backup|old|orig|sql|ini|conf|log|sh|py|pl|rb|env)$ {
        deny all;
        access_log off;
        log_not_found off;
    }

    # ===== 禁止访问源代码文件 =====
    location ~* \.(git|svn|cvs|hg)$ {
        deny all;
    }

    # ===== 禁止目录列表 =====
    autoindex off;

    # ===== 静态文件缓存 =====
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|eot|svg)$ {
        expires 30d;
        access_log off;
        add_header Cache-Control "public, immutable";
    }

    # ===== PHP处理（示例） =====
    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        
        # PHP安全参数
        fastcgi_param PHP_VALUE "open_basedir=/var/www/example.com:/tmp";
        fastcgi_param PHP_ADMIN_VALUE "disable_functions=exec,passthru,shell_exec,system,proc_open,popen,curl_exec,curl_multi_exec,parse_ini_file,show_source";
    }

    # ===== 禁止直接访问某些目录 =====
    location ~* /(uploads|files)/.*\.(php|phtml|php5|php7)$ {
        deny all;
    }

    # ===== 禁止危险的HTTP方法 =====
    if ($request_method !~ ^(GET|HEAD|POST|OPTIONS)$ ) {
        return 405;
    }

    # ===== 反爬虫User-Agent =====
    if ($http_user_agent ~* (sqlmap|nmap|nikto|havij|acunetix|nessus|w3af|burp|hydra|medusa|netsparker)) {
        return 403;
    }

    # ===== 主站配置 =====
    location / {
        try_files $uri $uri/ /index.php?$args;
    }
}
```

### 7.2.3 HTTPS/TLS安全配置

```nginx
# HTTPS服务器配置
server {
    listen 443 ssl http2;
    server_name www.example.com example.com;
    root /var/www/example.com;

    # ===== SSL证书 =====
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    ssl_trusted_certificate /etc/nginx/ssl/ca-bundle.crt;

    # ===== SSL协议版本（禁用不安全版本） =====
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # ===== 加密套件（强加密优先） =====
    ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';

    # ===== ECDH曲线 =====
    ssl_ecdh_curve secp384r1;

    # ===== SSL会话缓存 =====
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;

    # ===== OCSP Stapling =====
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    # ===== HSTS（启用前确保全站HTTPS正常） =====
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # ===== 安全响应头 =====
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;" always;

    # ===== HTTP重定向到HTTPS（在另一个server块） =====
    # 见下方配置
}

# HTTP重定向到HTTPS
server {
    listen 80;
    server_name www.example.com example.com;
    return 301 https://$server_name$request_uri;
}
```

### 7.2.4 Nginx访问控制

```nginx
# IP黑白名单

# 禁止特定IP访问
deny 192.168.1.100;
deny 10.0.0.0/8;
allow all;

# 仅允许特定IP访问管理后台
location /admin/ {
    allow 192.168.1.0/24;
    allow 10.0.0.0/8;
    deny all;
}

# 基于地理位置的访问控制（需要GeoIP模块）
# GeoIP2配置
http {
    geoip2 /usr/share/GeoIP/GeoLite2-Country.mmdb {
        $geoip2_data_country_code country iso_code;
    }

    # 创建地图
    map $geoip2_data_country_code $allowed_country {
        default yes;
        CN yes;
        US yes;
        # 禁止的国家
        KP no;
        IR no;
    }
}

# 使用
server {
    if ($allowed_country = no) {
        return 403;
    }
}
```

### 7.2.5 Nginx安全加固最佳实践

```
Nginx安全加固清单：

□ 基础安全
  □ 隐藏版本号（server_tokens off）
  □ 禁用目录列表（autoindex off）
  □ 禁止访问隐藏文件和敏感文件
  □ 禁用不必要的HTTP方法
  □ 请求体大小限制
  □ 超时时间合理设置

□ 传输安全
  □ 强制HTTPS
  □ 禁用SSLv2/SSLv3/TLSv1.0/TLSv1.1
  □ 启用TLSv1.2/TLSv1.3
  □ 强加密套件
  □ 启用HSTS
  □ 启用OCSP Stapling
  □ 证书定期更新

□ 访问控制
  □ 管理后台IP白名单
  □ API接口限流
  □ 反爬虫策略
  □ 危险User-Agent拦截
  □ IP黑名单/地理封禁

□ 安全响应头
  □ X-Frame-Options
  □ X-Content-Type-Options
  □ Content-Security-Policy
  □ Referrer-Policy
  □ X-XSS-Protection（兼容老浏览器）

□ PHP安全（如使用PHP）
  □ 禁止上传目录执行PHP
  □ open_basedir限制
  □ 危险函数禁用
  □ try_files防止文件注入

□ 日志与监控
  □ 访问日志开启
  □ 错误日志开启
  □ 日志定期轮转
  □ 访问日志分析
  □ 异常流量告警
```

## 7.3 Apache安全加固

### 7.3.1 基础安全配置

```apache
# /etc/httpd/conf/httpd.conf (RHEL/CentOS)
# /etc/apache2/apache2.conf (Ubuntu/Debian)

# ===== 基础配置 =====
ServerTokens Prod
ServerSignature Off
TraceEnable Off
Timeout 60
KeepAlive On
MaxKeepAliveRequests 100
KeepAliveTimeout 5
LimitRequestLine 4094
LimitRequestFields 100
LimitRequestFieldsize 8190
LimitRequestBody 10485760

# ===== 用户与组 =====
User apache
Group apache

# ===== 根目录配置 =====
<Directory />
    AllowOverride None
    Require all denied
    Options None
    AllowOverride None
</Directory>

# ===== Web根目录 =====
<Directory "/var/www/html">
    Options -Indexes -FollowSymLinks -ExecCGI
    AllowOverride None
    Require all granted
    
    # 禁止访问隐藏文件
    <FilesMatch "^\.">
        Require all denied
    </FilesMatch>
    
    # 禁止访问敏感文件
    <FilesMatch "\.(bak|backup|old|orig|sql|ini|conf|log|sh|py|pl|rb|env)$">
        Require all denied
    </FilesMatch>
</Directory>

# ===== 禁用不必要的模块 =====
# 在/etc/httpd/conf.modules.d/中禁用
# 建议禁用的模块：
# - mod_info
# - mod_userdir
# - mod_imagemap
# - mod_actions
# - mod_speling
# - mod_autoindex（不需要目录列表时）
```

### 7.3.2 HTTPS配置

```apache
# /etc/httpd/conf.d/ssl.conf

Listen 443 https

SSLRandomSeed startup file:/dev/urandom 256
SSLRandomSeed connect file:/dev/urandom 256

SSLCipherSuite HIGH:!aNULL:!MD5:!RC4:!3DES:!CAMELLIA
SSLHonorCipherOrder on

SSLProtocol all -SSLv2 -SSLv3 -TLSv1 -TLSv1.1
SSLCertificateFile /etc/pki/tls/certs/example.com.crt
SSLCertificateKeyFile /etc/pki/tls/private/example.com.key
SSLCertificateChainFile /etc/pki/tls/certs/ca-bundle.crt

<VirtualHost _default_:443>
    ServerName www.example.com:443
    DocumentRoot "/var/www/html"
    
    # HSTS
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    
    # 安全响应头
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Content-Security-Policy "default-src 'self'"
    
    # 安全重定向
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>
```

### 7.3.3 访问控制

```apache
# IP访问控制
<Directory "/var/www/html/admin">
    Require ip 192.168.1.0/24
    Require ip 10.0.0.0/8
</Directory>

# 禁止访问特定文件
<Files ~ "\.(bak|old|sql|conf)$">
    Require all denied
</Files>

# 禁用HTTP方法
<Location />
    <LimitExcept GET POST HEAD OPTIONS>
        Require all denied
    </LimitExcept>
</Location>

# mod_security WAF
# 安装mod_security
# yum install mod_security mod_security_crs

# 启用
<IfModule mod_security2.c>
    SecRuleEngine On
    SecRequestBodyAccess On
    SecResponseBodyAccess On
    SecAuditEngine RelevantOnly
    SecAuditLog /var/log/httpd/modsec_audit.log
    SecDebugLog /var/log/httpd/modsec_debug.log
    SecDebugLogLevel 0
    
    # 包含OWASP CRS规则
    IncludeOptional /usr/share/modsecurity-crs/*.conf
</IfModule>
```

## 7.4 PHP安全加固

### 7.4.1 php.ini安全配置

```ini
; /etc/php.ini 或 /etc/php/7.x/fpm/php.ini

; ===== 基础安全 =====
; 禁用危险函数
disable_functions = exec,passthru,shell_exec,system,proc_open,popen,curl_exec,curl_multi_exec,parse_ini_file,show_source,phpinfo,dl,assert,pcntl_exec,eval,create_function,array_map,array_walk,array_filter,uasort,uksort

; 禁用全局变量
register_globals = Off

; 隐藏PHP版本
expose_php = Off

; 禁止显示错误（生产环境）
display_errors = Off
display_startup_errors = Off
log_errors = On
error_log = /var/log/php_errors.log
error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT

; ===== 上传安全 =====
file_uploads = On
upload_max_filesize = 10M
max_file_uploads = 10
upload_tmp_dir = /tmp/php_uploads

; ===== 远程文件访问 =====
allow_url_fopen = Off
allow_url_include = Off

; ===== 会话安全 =====
session.save_handler = files
session.save_path = /var/lib/php/session
session.use_strict_mode = 1
session.use_cookies = 1
session.use_only_cookies = 1
session.cookie_httponly = 1
session.cookie_secure = 1
session.cookie_samesite = "Strict"
session.gc_maxlifetime = 1440
session.hash_function = sha256
session.hash_bits_per_character = 5

; ===== open_basedir限制 =====
open_basedir = /var/www:/tmp:/var/lib/php/session

; ===== 内存限制 =====
memory_limit = 128M
max_execution_time = 30
max_input_time = 60
max_input_vars = 1000

; ===== 魔术引号（已废弃，但确保关闭） =====
magic_quotes_gpc = Off
magic_quotes_runtime = Off

; ===== 其他 =====
short_open_tag = Off
mysql.allow_local_infile = Off
```

### 7.4.2 PHP-FPM安全配置

```ini
; /etc/php-fpm.d/www.conf

; 运行用户
user = nginx
group = nginx

; 监听方式
listen = 127.0.0.1:9000
; 或Unix Socket
; listen = /var/run/php-fpm.sock
; listen.owner = nginx
; listen.group = nginx
; listen.mode = 0660

; 进程管理
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500

; 慢日志
slowlog = /var/log/php-fpm/www-slow.log
request_slowlog_timeout = 10s

; PHP管理员值（不能被ini_set覆盖）
php_admin_value[open_basedir] = /var/www:/tmp
php_admin_value[disable_functions] = exec,passthru,shell_exec,system,proc_open,popen
php_admin_flag[allow_url_fopen] = off
php_admin_flag[expose_php] = off
```

## 7.5 应用层安全加固

### 7.5.1 输入验证与输出编码

```php
<?php
// ===== 输入验证示例 =====

// 验证整数
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if ($id === false) {
    die('无效的ID');
}

// 验证邮箱
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
if ($email === false) {
    die('无效的邮箱地址');
}

// 验证URL
$url = filter_input(INPUT_POST, 'url', FILTER_VALIDATE_URL);
if ($url === false) {
    die('无效的URL');
}

// 正则验证用户名（字母数字下划线，3-20位）
$username = filter_input(INPUT_POST, 'username');
if (!preg_match('/^[a-zA-Z0-9_]{3,20}$/', $username)) {
    die('用户名格式不正确');
}

// ===== 输出编码 =====
// 防止XSS
function safe_echo($str) {
    echo htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

// HTML输出
echo htmlspecialchars($user_input, ENT_QUOTES, 'UTF-8');

// JavaScript输出
echo json_encode($user_input, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);

// URL输出
echo urlencode($user_input);
?>
```

### 7.5.2 文件上传安全

```php
<?php
// 安全的文件上传处理

// 允许的文件类型白名单
$allowed_types = [
    'jpg' => 'image/jpeg',
    'png' => 'image/png',
    'gif' => 'image/gif',
    'pdf' => 'application/pdf'
];

// 最大文件大小
$max_size = 2 * 1024 * 1024; // 2MB

// 上传目录（Web不可直接访问，或放在Web目录外）
$upload_dir = '/var/www/uploads/';

if ($_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['file'];
    
    // 1. 检查文件大小
    if ($file['size'] > $max_size) {
        die('文件太大');
    }
    
    // 2. 获取文件扩展名
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    // 3. 检查扩展名白名单
    if (!isset($allowed_types[$ext])) {
        die('不允许的文件类型');
    }
    
    // 4. 检查MIME类型
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime_type = $finfo->file($file['tmp_name']);
    if ($mime_type !== $allowed_types[$ext]) {
        die('文件类型不匹配');
    }
    
    // 5. 检查文件头（图片检测）
    if (in_array($ext, ['jpg', 'png', 'gif'])) {
        $image_info = getimagesize($file['tmp_name']);
        if (!$image_info) {
            die('无效的图片文件');
        }
    }
    
    // 6. 生成安全的文件名
    $safe_filename = uniqid() . '.' . $ext;
    $destination = $upload_dir . $safe_filename;
    
    // 7. 移动文件
    if (move_uploaded_file($file['tmp_name'], $destination)) {
        // 8. 设置正确的权限
        chmod($destination, 0644);
        echo '上传成功: ' . $safe_filename;
    } else {
        die('上传失败');
    }
}
?>

<!-- Nginx配置中禁止上传目录执行PHP -->
<!-- 
location ~* /uploads/.*\.(php|phtml|php5)$ {
    deny all;
}
-->
```

### 7.5.3 SQL注入防护

```php
<?php
// 使用PDO预处理语句防止SQL注入

$pdo = new PDO(
    'mysql:host=localhost;dbname=test;charset=utf8mb4',
    'username',
    'password',
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false, // 禁用模拟预处理
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
);

// ===== 查询示例 =====

// 1. 单参数查询
$id = $_GET['id'];
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$id]);
$user = $stmt->fetch();

// 2. 命名参数
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username AND status = :status");
$stmt->execute([
    ':username' => $_POST['username'],
    ':status' => 1
]);

// 3. LIKE查询
$search = '%' . $_GET['search'] . '%';
$stmt = $pdo->prepare("SELECT * FROM users WHERE username LIKE ?");
$stmt->execute([$search]);

// 4. IN查询（需要动态构建参数）
$ids = [1, 2, 3, 4];
$placeholders = implode(',', array_fill(0, count($ids), '?'));
$stmt = $pdo->prepare("SELECT * FROM users WHERE id IN ($placeholders)");
$stmt->execute($ids);

// ===== 注意事项 =====
// - 不要拼接SQL语句
// - 不要相信任何用户输入
// - 开启错误异常便于调试
// - 使用最小权限的数据库账户
?>
```

## 7.6 日志与安全监控

### 7.6.1 日志配置

```nginx
# Nginx日志格式
log_format security '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" '
                    '"$http_x_forwarded_for" '
                    'rt=$request_time '
                    'ua="$http_user_agent"';

# 访问日志
access_log /var/log/nginx/access.log security;

# 错误日志
error_log /var/log/nginx/error.log warn;
```

### 7.6.2 日志轮转

```bash
# /etc/logrotate.d/nginx
/var/log/nginx/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 nginx nginx
    sharedscripts
    postrotate
        /bin/kill -USR1 `cat /var/run/nginx.pid 2>/dev/null` 2>/dev/null || true
    endscript
}
```

## 7.7 加固检查清单

```
Web服务器加固检查清单：

□ 服务器配置
  □ 隐藏版本信息
  □ 禁用目录列表
  □ 禁止访问隐藏文件
  □ 禁止访问敏感文件后缀
  □ 禁用TRACE方法
  □ 限制请求体大小
  □ 超时时间合理设置

□ 传输安全
  □ 强制HTTPS
  □ 禁用SSLv2/3和TLSv1.0/1.1
  □ 使用强加密套件
  □ 启用HSTS
  □ 启用OCSP Stapling
  □ 证书有效期检查
  □ 支持TLSv1.3

□ 安全响应头
  □ X-Frame-Options
  □ X-Content-Type-Options
  □ Content-Security-Policy
  □ Referrer-Policy
  □ Strict-Transport-Security

□ 访问控制
  □ 管理后台IP白名单
  □ 接口限流
  □ 爬虫防护
  □ 危险User-Agent拦截

□ 应用安全
  □ 输入验证
  □ 输出编码（防XSS）
  □ 参数化查询（防SQL注入）
  □ 文件上传安全
  □ CSRF防护
  □ 会话安全

□ PHP安全
  □ 禁用危险函数
  □ open_basedir限制
  □ 关闭错误显示
  □ 隐藏PHP版本
  □ 禁止远程文件包含
  □ 安全的会话配置

□ 日志监控
  □ 访问日志开启
  □ 错误日志开启
  □ 日志轮转配置
  □ 定期日志分析
  □ 异常告警
```

## 7.8 本章小结

本章全面介绍了Web服务器安全加固：

1. **Nginx加固**：基础配置、HTTPS安全、访问控制、限流
2. **Apache加固**：主配置、SSL配置、访问控制
3. **PHP安全**：php.ini配置、PHP-FPM安全、危险函数禁用
4. **应用层安全**：输入验证、文件上传、SQL注入防护
5. **安全响应头**：CSP、HSTS、X-Frame-Options等
6. **日志监控**：日志格式、轮转、安全分析

下一章将学习数据库安全加固。

---

**实战作业：**
1. 对你的Nginx配置做一次全面安全检查
2. 配置CSP策略并测试是否影响业务
3. 实现一个安全的文件上传功能
