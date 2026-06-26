# 第二十一章 证书管理与PKI安全

## 21.1 PKI概述

### 21.1.1 公钥基础设施概念

公钥基础设施（Public Key Infrastructure，PKI）是一套用于管理数字证书和公钥加密的系统。主要组件包括：

- **证书颁发机构（CA）**：签发和管理数字证书
- **注册机构（RA）**：验证证书申请者身份
- **证书吊销列表（CRL）**：存储已吊销的证书
- **OCSP响应器**：提供在线证书状态查询
- **证书存储库**：存储和分发证书

### 21.1.2 数字证书结构

X.509数字证书包含以下关键字段：

```
证书版本
序列号
签名算法
颁发者
有效期（从...到...）
主体（Subject）
主体公钥信息
密钥标识符
颁发者备用名称
主体备用名称
...
签名值
```

## 21.2 OpenSSL证书管理

### 21.2.1 OpenSSL基础命令

```bash
# 查看OpenSSL版本
openssl version

# 查看OpenSSL支持的算法
openssl list -cipher-algorithms
openssl list -digest-algorithms

# 创建私钥
openssl genrsa -out private.key 2048
openssl genrsa -out private.key 4096  # 更安全

# 创建加密私钥
openssl genrsa -aes256 -out private_encrypted.key 2048

# 从私钥提取公钥
openssl rsa -in private.key -pubout -out public.key

# 查看证书信息
openssl x509 -in certificate.crt -text -noout
openssl x509 -in certificate.crt -issuer -subject -dates

# 验证证书
openssl verify -CAfile ca.crt certificate.crt

# 查看证书序列号
openssl x509 -in certificate.crt -serial -noout

# 查看证书指纹
openssl x509 -in certificate.crt -fingerprint -sha256 -noout
openssl x509 -in certificate.crt -fingerprint -md5 -noout
```

### 21.2.2 自签名证书创建

```bash
# 创建自签名证书
openssl req -new -x509 -key private.key -out certificate.crt -days 365 \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=MyOrg/OU=IT/CN=example.com"

# 创建多域名证书
openssl req -new -x509 -key private.key -out certificate.crt -days 365 \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=MyOrg/OU=IT/CN=example.com" \
    -addext "subjectAltName=DNS:example.com,DNS:www.example.com,DNS:api.example.com"

# 创建带扩展的证书
cat > cert.ext << 'EOF'
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = example.com
DNS.2 = www.example.com
DNS.3 = api.example.com
IP.1 = 10.0.0.1
EOF

openssl req -new -key private.key -out certificate.csr
openssl x509 -req -in certificate.csr -signkey private.key -out certificate.crt -days 365 -extfile cert.ext
```

### 21.2.3 证书签名请求（CSR）

```bash
# 创建CSR
openssl req -new -key private.key -out request.csr \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=MyOrg/OU=IT/CN=example.com"

# 查看CSR内容
openssl req -in request.csr -text -noout

# 使用配置文件创建CSR
cat > csr.conf << 'EOF'
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = v3_req

[dn]
C=CN
ST=Beijing
L=Beijing
O=MyOrg
OU=IT
CN=example.com

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = example.com
DNS.2 = www.example.com
EOF

openssl req -new -key private.key -out request.csr -config csr.conf
```

### 21.2.4 证书格式转换

```bash
# PEM转DER
openssl x509 -in certificate.crt -outform DER -out certificate.der

# DER转PEM
openssl x509 -in certificate.der -inform DER -out certificate.crt

# PEM转PKCS12（PFX）
openssl pkcs12 -export -in certificate.crt -inkey private.key -certfile ca.crt -out certificate.pfx

# PKCS12转PEM
openssl pkcs12 -in certificate.pfx -nodes -out certificate_and_key.pem

# 从PKCS12提取私钥
openssl pkcs12 -in certificate.pfx -nocerts -out private.key

# 从PKCS12提取证书
openssl pkcs12 -in certificate.pfx -clcerts -nokeys -out certificate.crt

# 从PKCS12提取CA证书
openssl pkcs12 -in certificate.pfx -cacerts -nokeys -out ca.crt

# 查看PKCS12内容
openssl pkcs12 -in certificate.pfx -info -noout
```

## 21.3 私有CA配置

### 21.3.1 创建私有CA

```bash
# 创建CA目录结构
mkdir -p /etc/pki/CA/{certs,crl,newcerts,private}
cd /etc/pki/CA

# 创建CA私钥
openssl genrsa -aes256 -out private/ca.key 4096
chmod 600 private/ca.key

# 创建CA证书
openssl req -new -x509 -key private/ca.key -out ca.crt -days 3650 \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=MyOrg/OU=Security/CN=MyRoot-CA"

# 创建序列号文件
echo 1000 > serial

# 创建索引文件
touch index.txt index.txt.attr

# CA配置文件
cat > openssl.cnf << 'EOF'
[ ca ]
default_ca = CA_default

[ CA_default ]
dir = /etc/pki/CA
certs = $dir/certs
new_certs_dir = $dir/newcerts
database = $dir/index.txt
serial = $dir/serial
RANDFILE = $dir/private/.rand
private_key = $dir/private/ca.key
certificate = $dir/ca.crt
default_days = 365
default_md = sha256
policy = policy_match
copy_extensions = copy

[ policy_match ]
countryName = match
stateOrProvinceName = match
organizationName = match
organizationalUnitName = optional
commonName = supplied
emailAddress = optional

[ req ]
default_bits = 2048
default_md = sha256
distinguished_name = req_distinguished_name
string_mask = utf8only
x509_extensions = v3_ca

[ req_distinguished_name ]
countryName = Country Name (2 letter code)
stateOrProvinceName = State or Province Name
localityName = Locality Name
0.organizationName = Organization Name
organizationalUnitName = Organizational Unit Name
commonName = Common Name
emailAddress = Email Address
EOF
```

### 21.3.2 使用私有CA签发证书

```bash
# 1. 用户创建私钥和CSR
cd /home/user/certs
openssl genrsa -out user.key 2048
openssl req -new -key user.key -out user.csr \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=MyOrg/OU=IT/CN=user@example.com"

# 2. CA签发证书
cd /etc/pki/CA
openssl ca -in /home/user/certs/user.csr -out /home/user/certs/user.crt \
    -config openssl.cnf

# 3. 验证证书
openssl verify -CAfile ca.crt /home/user/certs/user.crt

# 4. 吊销证书
openssl ca -revoke /home/user/certs/user.crt -config openssl.cnf

# 5. 生成CRL
openssl ca -gencrl -out crl/ca.crl -config openssl.cnf

# 6. 查看CRL
openssl crl -in crl/ca.crl -noout -text
```

### 21.3.3 证书链配置

```bash
# 创建中间CA
mkdir -p /etc/pki/CA/intermediate/{certs,crl,csr,private,newcerts}
chmod 700 /etc/pki/CA/intermediate/private

# 创建中间CA私钥
openssl genrsa -aes256 -out /etc/pki/CA/intermediate/private/intermediate.key 4096

# 创建中间CA CSR
openssl req -new -key /etc/pki/CA/intermediate/private/intermediate.key \
    -out /etc/pki/CA/intermediate/csr/intermediate.csr \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=MyOrg/OU=Intermediate-CA/CN=My-Intermediate-CA"

# Root CA签发中间CA证书
openssl ca -in /etc/pki/CA/intermediate/csr/intermediate.csr \
    -out /etc/pki/CA/intermediate/certs/intermediate.crt \
    -extensions v3_ca -extfile /etc/pki/CA/openssl.cnf \
    -config /etc/pki/CA/openssl.cnf

# 创建证书链文件
cat /etc/pki/CA/intermediate/certs/intermediate.crt /etc/pki/CA/ca.crt > bundle.crt

# 验证证书链
openssl verify -CAfile /etc/pki/CA/ca.crt -untrusted /etc/pki/CA/intermediate/certs/intermediate.crt user.crt
```

## 21.4 TLS安全配置

### 21.4.1 Nginx TLS配置

```nginx
# /etc/nginx/conf.d/tls-hardened.conf

server {
    listen 443 ssl http2;
    server_name example.com;
    
    # 证书配置
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    ssl_trusted_certificate /etc/nginx/ssl/ca-chain.crt;
    
    # TLS版本配置（禁用SSLv3和TLSv1.0/1.1）
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # 安全加密套件
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;
    
    # SSL会话配置
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
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
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    
    # 证书透明度（CT）
    add_header X-CT "SCT" always;
    
    location / {
        root /var/www/html;
        index index.html;
    }
}

# HTTP到HTTPS重定向
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

### 21.4.2 Apache TLS配置

```apache
# /etc/httpd/conf.d/ssl.conf

# SSL配置
SSLEngine on
SSLCertificateFile /etc/pki/tls/certs/example.com.crt
SSLCertificateKeyFile /etc/pki/tls/private/example.com.key
SSLCertificateChainFile /etc/pki/tls/certs/ca-chain.crt

# TLS版本配置
SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1

# 加密套件配置
SSLCipherSuite ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256
SSLHonorCipherOrder on

# Session配置
SSLSessionCache shmcb:/run/httpd/sslcache(512000)
SSLSessionTimeout 1d
SSLSessionTickets off

# OCSP配置
SSLUseStapling on
SSLStaplingCache shmcb:/run/httpd/stapling_cache(128000)
SSLStaplingStandardCacheTimeout 3600
SSLStaplingErrorCacheTimeout 600

# 安全头部
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"

# 禁用TRACE方法
RewriteEngine On
RewriteCond %{REQUEST_METHOD} ^TRACE
RewriteRule .* - [F]
```

### 21.4.3 Postfix TLS配置

```bash
# /etc/postfix/main.cf 添加

# TLS配置
smtpd_tls_security_level = may
smtpd_tls_wrappermode = no
smtpd_tls_protocols = !SSLv2,!SSLv3,!TLSv1,!TLSv1.1
smtpd_tls_ciphers = medium
smtpd_tls_mandatory_protocols = !SSLv2,!SSLv3,!TLSv1,!TLSv1.1
smtpd_tls_mandatory_ciphers = high
tls_ssl_options = NO_COMPRESSION

# 证书配置
smtpd_tls_cert_file = /etc/pki/tls/certs/postfix.crt
smtpd_tls_key_file = /etc/pki/tls/private/postfix.key
smtpd_tls_CAfile = /etc/pki/tls/certs/ca-chain.crt

# 日志
smtpd_tls_loglevel = 1
smtp_tls_security_level = may
smtp_tls_protocols = !SSLv2,!SSLv3,!TLSv1,!TLSv1.1
smtp_tls_ciphers = medium
smtp_tls_cert_file = /etc/pki/tls/certs/postfix.crt
smtp_tls_key_file = /etc/pki/tls/private/postfix.key
smtp_tls_CAfile = /etc/pki/tls/certs/ca-chain.crt

# 会话缓存
smtpd_tls_session_cache_database = btree:/var/lib/postfix/smtpd_scache
smtp_tls_session_cache_database = btree:/var/lib/postfix/smtp_scache
```

## 21.5 证书管理工具

### 21.5.1 certbot自动证书管理

```bash
# 安装certbot
yum install epel-release -y
yum install certbot python2-certbot-nginx -y

# 或Ubuntu
apt install certbot python3-certbot-nginx -y

# 申请证书
certbot certonly --nginx -d example.com -d www.example.com

# 自动续期
certbot renew --dry-run

# 添加到crontab
echo "0 0,12 * * * root certbot renew --quiet" >> /etc/crontab

# 使用DNS验证
certbot certonly --manual --preferred-challenges dns -d example.com
```

### 21.5.2 证书监控脚本

```bash
#!/bin/bash
# 证书到期监控脚本

CERT_DIR="/etc/nginx/ssl"
ALERT_DAYS=30
EMAIL="admin@example.com"

echo "=== 证书到期检查 ===" > /tmp/cert_check.txt
echo "检查时间: $(date)" >> /tmp/cert_check.txt
echo "" >> /tmp/cert_check.txt

check_cert() {
    local cert=$1
    local expiry=$(openssl x509 -in "$cert" -noout -enddate 2>/dev/null | cut -d= -f2)
    local expiry_epoch=$(date -d "$expiry" +%s 2>/dev/null)
    local now_epoch=$(date +%s)
    local days_left=$(( (expiry_epoch - now_epoch) / 86400 ))
    
    echo "证书: $cert" >> /tmp/cert_check.txt
    echo "到期时间: $expiry" >> /tmp/cert_check.txt
    echo "剩余天数: $days_left" >> /tmp/cert_check.txt
    
    if [ $days_left -le $ALERT_DAYS ]; then
        echo "⚠️ 警告: 证书即将到期!" >> /tmp/cert_check.txt
    fi
    echo "" >> /tmp/cert_check.txt
}

# 检查所有证书
for cert in $(find $CERT_DIR -name "*.crt" 2>/dev/null); do
    check_cert "$cert"
done

# 发送邮件
if [ -s /tmp/cert_check.txt ]; then
    mail -s "证书到期检查" $EMAIL < /tmp/cert_check.txt
fi
```

### 21.5.3 ACME协议与Let's Encrypt

```bash
# 使用acme.sh管理证书
curl https://get.acme.sh | sh

# 申请证书
~/.acme.sh/acme.sh --issue -d example.com -d www.example.com --nginx

# 使用DNS API
~/.acme.sh/acme.sh --issue -d example.com --dns dns_dp

# 安装证书
~/.acme.sh/acme.sh --install-cert -d example.com \
    --key-file /etc/nginx/ssl/example.com.key \
    --fullchain-file /etc/nginx/ssl/example.com.crt \
    --reloadcmd "systemctl reload nginx"

# 升级acme.sh
~/.acme.sh/acme.sh --upgrade --auto-upgrade
```

## 21.6 证书安全检查清单

| 检查项 | 检查方法 | 安全标准 |
|--------|---------|---------|
| 私钥权限 | `ls -l private.key` | 600 |
| 证书过期 | `openssl x509 -in cert.crt -noout -dates` | 未过期 |
| TLS版本 | `grep ssl_protocols nginx.conf` | TLSv1.2+ |
| 加密套件 | `grep ssl_ciphers nginx.conf` | 安全套件 |
| 证书链完整 | `openssl verify -CAfile ca.crt cert.crt` | 验证通过 |
| HSTS配置 | `curl -I https://example.com` | 已配置 |
| OCSP Stapling | `openssl s_client -status example.com:443` | 已启用 |
| CRL分发 | `openssl verify -CRLfile ca.crl cert.crt` | 已配置 |
| 私钥加密 | `openssl rsa -in key.enc -check` | 已加密 |
| SAN配置 | `openssl x509 -in cert.crt -noout -ext subjectAltName` | 已配置 |

## 21.7 实战案例：企业PKI体系部署

### 21.7.1 案例需求

某企业需要建立完整的PKI体系：
- 私有Root CA
- 中间CA（开发、测试、生产）
- 证书自动化管理
- 证书过期监控

### 21.7.2 部署步骤

**第一步：建立Root CA**

```bash
# 创建目录结构
mkdir -p /etc/pki/enterprise/{ca/{certs,crl,newcerts,private},intermediate/{certs,crl,csr,private,newcerts},certs,private}

# 生成Root CA密钥
openssl genrsa -aes256 -out /etc/pki/enterprise/ca/root-ca.key 4096
chmod 600 /etc/pki/enterprise/ca/root-ca.key

# 生成Root CA证书
openssl req -x509 -new -nodes -key /etc/pki/enterprise/ca/root-ca.key \
    -sha256 -days 3650 -out /etc/pki/enterprise/ca/root-ca.crt \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=MyEnterprise/CN=MyEnterprise-Root-CA"

# 导出Root CA（用于客户端安装）
openssl pkcs12 -inkey /etc/pki/enterprise/ca/root-ca.key -in /etc/pki/enterprise/ca/root-ca.crt \
    -export -out /etc/pki/enterprise/ca/root-ca.pfx -name "Enterprise Root CA"
```

**第二步：建立中间CA**

```bash
# 生成中间CA密钥
openssl genrsa -aes256 -out /etc/pki/enterprise/intermediate/intermediate-ca.key 4096
chmod 600 /etc/pki/enterprise/intermediate/intermediate-ca.key

# 生成中间CA CSR
openssl req -new -key /etc/pki/enterprise/intermediate/intermediate-ca.key \
    -out /etc/pki/enterprise/intermediate/intermediate-ca.csr \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=MyEnterprise/CN=MyEnterprise-Intermediate-CA"

# Root CA签发中间CA证书
openssl x509 -req -in /etc/pki/enterprise/intermediate/intermediate-ca.csr \
    -CA /etc/pki/enterprise/ca/root-ca.crt \
    -CAkey /etc/pki/enterprise/ca/root-ca.key \
    -CAcreateserial \
    -out /etc/pki/enterprise/intermediate/intermediate-ca.crt \
    -days 1825 -sha256

# 创建证书链
cat /etc/pki/enterprise/intermediate/intermediate-ca.crt \
    /etc/pki/enterprise/ca/root-ca.crt > /etc/pki/enterprise/ca-chain.crt

# 验证证书链
openssl verify -CAfile /etc/pki/enterprise/ca/root-ca.crt \
    /etc/pki/enterprise/intermediate/intermediate-ca.crt
```

**第三步：自动化证书签发**

```bash
# 创建签发脚本
cat > /usr/local/bin/sign-cert.sh << 'EOF'
#!/bin/bash
# 证书签发脚本

CA_DIR="/etc/pki/enterprise/intermediate"
CA_KEY="$CA_DIR/intermediate-ca.key"
CA_CERT="$CA_DIR/intermediate-ca.crt"
CA_CHAIN="/etc/pki/enterprise/ca-chain.crt"
CA_SERIAL="$CA_DIR/serial"
OUTPUT_DIR="/etc/pki/enterprise/certs"

if [ $# -lt 3 ]; then
    echo "用法: $0 <CN> <alt_names> <days>"
    echo "示例: $0 web.example.com 'DNS:web.example.com,DNS:www.example.com' 365"
    exit 1
fi

CN="$1"
ALT_NAMES="$2"
DAYS="${3:-365}"

# 生成密钥
KEY_FILE="$OUTPUT_DIR/$CN.key"
openssl genrsa -out "$KEY_FILE" 2048
chmod 600 "$KEY_FILE"

# 生成CSR
CSR_FILE="/tmp/$CN.csr"
cat > /tmp/csrext.cnf << CNF
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = v3_req

[dn]
CN=$CN

[v3_req]
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth, clientAuth
subjectAltName = $ALT_NAMES
CNF

openssl req -new -key "$KEY_FILE" -out "$CSR_FILE" -config /tmp/csrext.cnf

# 签发证书
CERT_FILE="$OUTPUT_DIR/$CN.crt"
openssl x509 -req -in "$CSR_FILE" \
    -CA "$CA_CERT" -CAkey "$CA_KEY" \
    -CAcreateserial \
    -out "$CERT_FILE" -days "$DAYS" -sha256 \
    -extfile /tmp/csrext.cnf -extensions v3_req

# 清理临时文件
rm -f "$CSR_FILE" /tmp/csrext.cnf

echo "证书已签发:"
echo "  密钥: $KEY_FILE"
echo "  证书: $CERT_FILE"
echo "  CA链: $CA_CHAIN"
EOF

chmod +x /usr/local/bin/sign-cert.sh

# 使用示例
/usr/local/bin/sign-cert.sh "web.example.com" "DNS:web.example.com,DNS:www.example.com" 365
```

**第四步：部署证书监控**

```bash
# 证书到期监控
cat > /usr/local/bin/cert-monitor.sh << 'EOF'
#!/bin/bash
# 企业证书监控系统

ALERT_EMAIL="security@example.com"
CERT_DIR="/etc/pki/enterprise/certs"
WARN_DAYS=30
CRIT_DAYS=7

send_alert() {
    local subject="$1"
    local body="$2"
    echo "$body" | mail -s "$subject" $ALERT_EMAIL
}

check_expiry() {
    local cert=$1
    local cn=$(basename $cert .crt)
    local expiry=$(openssl x509 -in "$cert" -noout -enddate 2>/dev/null | cut -d= -f2)
    local expiry_epoch=$(date -d "$expiry" +%s 2>/dev/null)
    local now_epoch=$(date +%s)
    local days_left=$(( (expiry_epoch - now_epoch) / 86400 ))
    
    if [ $days_left -le $CRIT_DAYS ]; then
        send_alert "[紧急] 证书即将过期: $cn" "证书 $cn 将在 $days_left 天后过期!\n到期时间: $expiry\n请立即续期。"
    elif [ $days_left -le $WARN_DAYS ]; then
        send_alert "[警告] 证书即将过期: $cn" "证书 $cn 将在 $days_left 天后过期。\n到期时间: $expiry"
    fi
}

# 检查所有证书
for cert in $(find $CERT_DIR -name "*.crt" 2>/dev/null); do
    check_expiry "$cert"
done

# 发送每日报告
REPORT="/tmp/cert-report-$(date +%Y%m%d).txt"
echo "企业证书状态报告" > $REPORT
echo "生成时间: $(date)" >> $REPORT
echo "" >> $REPORT

for cert in $(find $CERT_DIR -name "*.crt" 2>/dev/null); do
    cn=$(basename $cert .crt)
    expiry=$(openssl x509 -in "$cert" -noout -enddate | cut -d= -f2)
    echo "$cn: $expiry" >> $REPORT
done

mail -s "每日证书状态报告" $ALERT_EMAIL < $REPORT
EOF

chmod +x /usr/local/bin/cert-monitor.sh

# 添加到crontab
echo "0 9 * * * /usr/local/bin/cert-monitor.sh" >> /etc/crontab
```

## 21.8 本章小结

证书管理与PKI安全是Linux系统安全的重要组成部分。本章介绍了：

- **PKI基础概念**：CA、RA、CRL、OCSP等组件
- **OpenSSL证书管理**：密钥生成、证书签发、格式转换
- **私有CA配置**：创建私有CA、签发用户证书、证书链
- **TLS安全配置**：Nginx、Apache、Postfix的TLS加固配置
- **证书管理工具**：certbot、acme.sh自动化证书管理
- **安全检查清单**：证书安全配置检查标准
- **实战案例**：企业PKI体系完整部署过程

通过合理的证书管理和TLS安全配置，可以建立完善的公钥基础设施，保护网络通信安全。
