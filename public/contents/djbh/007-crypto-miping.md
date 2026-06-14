# 等保三级数据安全：加密存储与传输全方案

> **📘 文档定位**：CISP 考试 等保合规 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 系统讲解等保三级对数据加密的要求，覆盖国密算法选型（SM2/SM3/SM4）、传输加密（TLS/IPSec）、存储加密（全盘/文件/数据库）及密钥管理体系。

---

## 导航目录

- [一、等保加密要求解读](#一等保加密要求解读)
- [二、国密算法选型](#二国密算法选型)
- [三、传输加密方案](#三传输加密方案)
- [四、存储加密方案](#四存储加密方案)
- [五、密钥管理体系](#五密钥管理体系)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 📋 目录

1. [数据传输安全](#一传输安全)
2. [数据存储安全](#二存储安全)
3. [数据库加密方案](#三数据库加密)
4. [国密算法实践](#四国密实践)
5. [完整实施方案](#五实施方案)

---

## 一、传输安全

### 1.1 Web 通信加密

```nginx
# Nginx HTTPS 配置(等保三级要求 TLS 1.2+)
server {
    listen 443 ssl http2;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    ssl_certificate /etc/ssl/server.crt;
    ssl_certificate_key /etc/ssl/server.key;
    
    # 国密版本: 使用铜锁(Tongsuo)编译的 Nginx
    # enable_ntls on;
    # ssl_certificate /etc/ssl/sm2_sign.crt;
    # ssl_certificate_key /etc/ssl/sm2_sign.key;
}
```

### 1.2 数据库连接加密

```bash
# MySQL TLS 配置
# my.cnf
[mysqld]
require_secure_transport = ON
ssl_ca = /etc/mysql/certs/ca.pem
ssl_cert = /etc/mysql/certs/server-cert.pem
ssl_key = /etc/mysql/certs/server-key.pem

# 创建需要 TLS 的用户
CREATE USER 'appuser'@'%' IDENTIFIED BY 'Password' REQUIRE SSL;

# 验证: 连接后执行 SHOW STATUS LIKE 'Ssl_cipher';
```

### 1.3 应用间通信(mTLS)

```
微服务间通信 → mTLS 双向认证
  ✦ 每个服务有唯一 TLS 证书
  ✦ istio/consul 管理证书
  ✦ 确保内网通信也被加密
```

---

## 二、存储安全

### 2.1 敏感字段加密

```php
// ❌ 危险：明文存储
$sql = "INSERT INTO users (name, id_card, phone) VALUES ('$name', '$id_card', '$phone')";

// ✅ 安全：加密后存储
function encrypt($data, $key) {
    $iv = random_bytes(16);
    $encrypted = openssl_encrypt($data, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
    return base64_encode($iv . $encrypted);  // 存储 IV + 密文
}

function decrypt($data, $key) {
    $data = base64_decode($data);
    $iv = substr($data, 0, 16);
    $encrypted = substr($data, 16);
    return openssl_decrypt($encrypted, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
}

// 使用:
$encrypted_id = encrypt('320123199001011234', $master_key);
$sql = "INSERT INTO users (name, id_card) VALUES (?, ?)";
```

### 2.2 数据库透明加密(TDE)

```sql
-- MySQL 8.0+ InnoDB 表空间加密
-- my.cnf:
-- [mysqld]
-- early-plugin-load=keyring_file.so
-- keyring_file_data=/var/lib/mysql-keyring/keyring

-- 创建加密表
CREATE TABLE users (
    id INT,
    name VARCHAR(100),
    id_card VARBINARY(256)
) ENCRYPTION='Y';

-- MariaDB 数据加密
-- innodb_encrypt_tables = ON
-- innodb_encrypt_log = ON

-- PostgreSQL pgcrypto
CREATE EXTENSION pgcrypto;
SELECT pgp_sym_encrypt('sensitive data', 'encryption_key');
```

---

## 三、数据库加密

### 3.1 密钥管理层次

```
┌──────────────────────────────┐
│  KMS (HSM 硬件保护)          │
│  管理 Master Key              │
├──────────────────────────────┤
│  Master Key → 解密 DEK包      │
│  (存储在安全区域, 定期轮换)    │
├──────────────────────────────┤
│  DEK (Data Encryption Key)   │
│  → 加密数据库中的敏感字段      │
└──────────────────────────────┘

密钥不存储在应用代码中!
密钥不存储在数据库中!
```

### 3.2 应用加密 Demo

```python
from cryptography.fernet import Fernet
import boto3
import base64

class DataEncryption:
    def __init__(self):
        # 从 KMS 获取加密的 DEK
        self.kms = boto3.client('kms', region_name='cn-hangzhou')
        self.dek = self._get_dek()
        self.cipher = Fernet(self.dek)
    
    def _get_dek(self):
        """从 KMS 获取/生成 DEK"""
        response = self.kms.generate_data_key(
            KeyId='alias/app-encryption-key',
            KeySpec='AES_256'
        )
        return base64.b64encode(response['Plaintext'])
    
    def encrypt(self, data: str) -> str:
        return self.cipher.encrypt(data.encode()).decode()
    
    def decrypt(self, data: str) -> str:
        return self.cipher.decrypt(data.encode()).decode()

# 使用
enc = DataEncryption()
masked_id = enc.encrypt('320123199001011234')
print(masked_id)  # gAAAAABm...

# 存储到数据库
cursor.execute("INSERT INTO users (id_card) VALUES (?)", (masked_id,))
```

---

## 四、国密实践

```python
from gmssl import sm4, sm3

# SM4 加密
key = b'0123456789ABCDEF'  # 16字节
iv = b'0000000000000000'    # 16字节

sm4_cipher = sm4.CryptSM4()
sm4_cipher.set_key(key, sm4.SM4_ENCRYPT)
ciphertext = sm4_cipher.crypt_cbc(iv, plaintext)

# SM3 哈希
hash_value = sm3.sm3_hash(data.encode())
```

---

## 五、实施方案

```
Phase 1: 评估(1周)
  □ 识别所有敏感数据字段
  □ 确定加密方案(应用层/TDE)
  □ 选型密钥管理系统(KMS)

Phase 2: 实施(2-3周)
  □ 部署 KMS
  □ 修改应用添加加密层
  □ 存量数据加密迁移
  □ 功能测试

Phase 3: 灰度上线(1周)
  □ 双重读(明文+密文)
  □ 验证性能影响
  □ 全量切换
```
