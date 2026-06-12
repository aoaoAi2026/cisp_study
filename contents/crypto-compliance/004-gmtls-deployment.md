# 国密 SSL/TLS 部署实战与 Wireshark 抓包分析

---

## 一、国密 TLS 协议

### 1.1 TLCP 标准

```
TLCP (Transport Layer Cryptography Protocol)
原名：GM/T 0024-2014 SSL VPN 技术规范
最新：GB/T 38636-2020 信息安全技术 传输层密码协议

TLCP = 国密版TLS，与标准TLS的重要区别：

┌─────────────┬──────────────┬──────────────┐
│             │ TLS (国际)   │ TLCP (国密)   │
├─────────────┼──────────────┼──────────────┤
│ 密钥交换     │ ECDHE       │ ECC-SM2      │
│             │ (P-256/X25519)│ (SM2曲线)    │
│ 签名认证     │ RSA/ECDSA   │ SM2          │
│ 对称加密     │ AES-GCM     │ SM4 (CBC/GCM)│
│ 哈希/MAC    │ SHA-256     │ SM3          │
│ 证书类型     │ X.509v3     │ 双证书体系    │
│ 端口         │ 443         │ 443(可共存)   │
└─────────────┴──────────────┴──────────────┘

实际部署通常双栈(同时支持TLS+TLCP)：
  客户端支持国密 → TLCP握手
  客户端不支持国密 → 回退TLS握手
```

### 1.2 国密双证书体系

```
TLCP 双证书要求：
  签名证书 + 加密证书 (各一个)

签名证书 (Signature Certificate)：
  - 用途：身份认证 + 数字签名(握手签名)
  - 密钥用途(KeyUsage)：digitalSignature
  - 扩展密钥用途：TLS 客户端/服务器认证

加密证书 (Encryption Certificate)：
  - 用途：密钥交换(密钥加密)
  - 密钥用途(KeyUsage)：keyEncipherment
  - SM2密钥交换协议需要独立的加密密钥对

为什么需要双证书？
  TLCP中SM2密钥交换和SM2数字签名
  理论上可以用同一个SM2密钥对，
  但安全最佳实践要求分离（不同用途不同密钥）
```

---

## 二、Nginx 国密部署

### 2.1 Tongsuo (铜锁) 方案

```bash
# 铜锁 (原BabaSSL) — 蚂蚁集团开源
# 这是目前最主流的国密TLS开源方案
# https://github.com/Tongsuo-Project/Tongsuo

# 编译安装
git clone https://github.com/Tongsuo-Project/Tongsuo.git
cd Tongsuo
./Configure --prefix=/usr/local/tongsuo enable-ntls
make -j$(nproc)
sudo make install

# 编译国密版Nginx (基于铜锁)
git clone https://github.com/Tongsuo-Project/tongsuo-nginx.git
cd tongsuo-nginx
./configure \
  --with-openssl=../Tongsuo \
  --with-http_ssl_module \
  --with-stream_ssl_module \
  --prefix=/usr/local/nginx-gm
make && sudo make install
```

```nginx
# Nginx 国密配置 (支持TLS+TLCP双栈)
server {
    listen 443 ssl;
    server_name gm.example.com;

    # 开启国密TLCP(铜锁专有指令)
    enable_ntls on;

    # 双证书配置(必须两个)
    ssl_certificate         /etc/ssl/sm2_sign.crt;    # 签名证书
    ssl_certificate_key     /etc/ssl/sm2_sign.key;    # 签名私钥

    ssl_certificate         /etc/ssl/sm2_enc.crt;     # 加密证书
    ssl_certificate_key     /etc/ssl/sm2_enc.key;     # 加密私钥

    # 也可同时配置国际证书(双栈)
    # ssl_certificate         /etc/ssl/rsa.crt;
    # ssl_certificate_key     /etc/ssl/rsa.key;

    # 国密密码套件
    ssl_ciphers "ECC-SM2-SM4-GCM-SM3:ECC-SM2-SM4-CBC-SM3:ECDHE-RSA-AES128-GCM-SHA256";

    # 加密套件优先级
    ssl_prefer_server_ciphers on;

    location / {
        root /var/www/html;
    }
}
```

### 2.2 浏览器访问验证

```bash
# 1. 使用支持国密的浏览器
#    - 360安全浏览器 (国密专版)
#    - 奇安信可信浏览器
#    - 红莲花浏览器
#    - Chrome + gmssl插件(第三方)

# 2. 验证国密连接
#    浏览器地址栏 → 查看证书 → 确认是SM2证书

# 3. 命令行验证
curl --ntls https://gm.example.com
# (需要编译铜锁版curl支持--ntls参数)
```

---

## 三、Wireshark 国密 TLS 分析

### 3.1 抓包设置

```bash
# 抓取国密TLS流量
tcpdump -i eth0 port 443 -w gmtls.pcap

# Wireshark 分析:
# Filter: ssl.handshake.type == 1  (Client Hello)
#         ssl.handshake.type == 2  (Server Hello)

# Client Hello 中国密扩展：
#   检查 Cipher Suites 是否包含:
#   - 0xE001 (ECC-SM2-SM4-SM3)
#   - 0xE003 (ECC-SM2-SM4-CBC-SM3)
#   这些是非标准密码套件ID，由GM/T 0024定义

# Server Hello 响应：
#   如果支持国密 → 返回国密密码套件
#   不支持国密 → 返回标准TLS密码套件
```

### 3.2 解密国密TLS流量

```bash
# Wireshark 导入SM2私钥解密：
# 前提：密钥交换使用RSA/ECDHE → SM2密钥交换不支持被动解密！
# (因为SM2密钥交换使用ECDHE-like机制，具有前向安全性)
# 只能解密握手流量，不能解密应用数据

# 更实用的方案：在应用层记录日志
# Nginx 开启 sslkeylog
# (需铜锁支持SSLKEYLOGFILE，类似Firefox/NSS)
export SSLKEYLOGFILE=/tmp/sslkeys.log
# 然后在Wireshark中: Edit→Preferences→TLS→(Pre)-Master-Secret log filename
```

---

## 四、Apache 国密部署

```bash
# Apache httpd + mod_ssl (编译铜锁版)
# 与Nginx思路相同：用铜锁替换OpenSSL

# 编译：
./configure --with-ssl=/usr/local/tongsuo \
    --enable-ssl --enable-so
make && make install

# httpd-ssl.conf 配置：
<VirtualHost *:443>
    ServerName gm.example.com
    
    SSLEngine on
    # 国密双证书
    SSLCertificateFile /etc/ssl/sm2_sign.crt
    SSLCertificateKeyFile /etc/ssl/sm2_sign.key
    # 第二个证书需要额外配置模块或合并证书链
</VirtualHost>
```

---

## 五、常见问题排障

### 5.1 握手失败

```
原因排查：
  1. 检查密码套件是否正确配置
     → openssl s_client -connect gm.example.com:443 -ntls

  2. 证书不匹配
     → SM2证书对必须包含签名+加密两个证书
     → 检查证书链是否完整(CA证书链)

  3. 证书与密钥不匹配
     → openssl x509 -in sign.crt -noout -modulus
     → openssl sm2 -in sign.key -noout -modulus
     → 两值对比

  4. 客户端不支持国密
     → 回退到标准TLS
```

### 5.2 性能问题

```
国密TLS比标准TLS约慢25-40%：

原因：
  - SM4 (32轮) vs AES-GCM (硬件指令AES-NI加速)
  - SM2 vs ECDSA-RSA混合（SM2计算量居中）

优化：
  - 启用硬件加速：ARMv8 SM3/SM4指令
  - 鲲鹏920/飞腾2000+ 原生国密指令加速
  - Intel IceLake+: AES-NI可用于部分SM4优化
  - 会话复用(TLCP Session Resumption)减少握手
```

---

## 六、Checklist

- [ ] 铜锁/Tongsuo 编译部署
- [ ] 国密版Nginx/Apache编译
- [ ] SM2双证书申请与配置
- [ ] TLCP密码套件配置
- [ ] 国密+国际双栈测试
- [ ] 浏览器兼容性测试(国密浏览器)
- [ ] Wireshark抓包验证
- [ ] 证书过期监控与自动续期
- [ ] 性能基线测试
- [ ] 日志+审计配置
