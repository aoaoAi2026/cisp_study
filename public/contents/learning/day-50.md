# Day 50：Web安全基础

> **所属周**：Week 8 — 应用安全 · **主题**：OWASP Top 10与HTTP安全机制

---

## 📑 目录

1. [OWASP Top 10 (2021) 深度解析](#一owasp-top-10-2021-深度解析)
2. [HTTP安全头详解](#二http安全头详解)
3. [同源策略与CORS](#三同源策略与cors)
4. [Cookie安全属性](#四cookie安全属性)
5. [Web安全测试工具](#五web安全测试工具)
6. [安全开发框架](#六安全开发框架)
7. [CISP考试速查](#cisp考试速查)
8. [自检清单](#自检清单)

---

## 一、OWASP Top 10 (2021) 深度解析

### 1.1 2021版全览

```
┌────────┬────────────────────────────┬──────────────────────────────┐
│  排名   │         风险类别            │          核心问题             │
├────────┼────────────────────────────┼──────────────────────────────┤
│ A01    │ 失效的访问控制 (Broken AC)   │ 权限校验不严格，越权访问        │
│ A02    │ 加密失效 (Crypto Failures)  │ 弱加密、敏感数据泄露            │
│ A03    │ 注入 (Injection)            │ 用户输入拼接到解释器命令         │
│ A04    │ 不安全设计 (Insecure Design) │ 缺乏安全需求分析               │
│ A05    │ 安全配置错误 (Security Misconfig)│ 默认配置、错误配置          │
│ A06    │ 易受攻击和过时组件            │ 未更新的第三方库和组件          │
│ A07    │ 识别和认证失败                │ 弱认证、会话管理缺陷           │
│ A08    │ 软件和数据完整性失败          │ 未验证的更新、CI/CD篡改         │
│ A09    │ 安全日志和监控不足            │ 日志缺失、告警不及时            │
│ A10    │ SSRF (服务端请求伪造)         │ 服务器端请求未经验证            │
└────────┴────────────────────────────┴──────────────────────────────┘

A01取代A03登顶：失效的访问控制成为最常见的严重漏洞
新增：A04不安全设计、A08软件数据完整性失败、A10 SSRF
退出Top 10：XML外部实体(XXE)、跨站脚本(XSS深入A03注入)
```

### 1.2 A01：失效的访问控制

```
失效的访问控制示例：

① URL参数修改：
   /user/profile?id=123 → 改为?id=456 → 查看他人资料

② 路径遍历：
   /download?file=report.pdf → ?file=../../../etc/passwd

③ 缺少功能级访问控制：
   普通用户直接访问 /admin/deleteUser 未检查权限

④ CORS配置错误：
   Access-Control-Allow-Origin: * + Access-Control-Allow-Credentials: true

防御：
  ✅ 默认拒绝，明确授权
  ✅ 服务端强制检查权限（不信任客户端）
  ✅ 使用成熟的访问控制框架
  ✅ JWT令牌验证每次请求
```

### 1.3 A08：软件和数据完整性失败

```
新的独立风险分类：

① 不安全的CI/CD管道：
   未签名的构建产物 → 依赖可能被投毒
   未经验证的第三方组件

② 不安全的反序列化：
   Java/PHP/.NET反序列化远程代码执行
   Jackson、Fastjson已知漏洞

③ 自动更新机制缺陷：
   更新包未签名 → 可以分发恶意更新
   SolarWinds (2020) 供应链攻击典型

防御：
  ✅ 使用依赖扫描工具(OWASP Dependency-Check)
  ✅ 数字签名验证所有更新包
  ✅ SLSA框架(Security Levels for Software Artifacts)
```

---

## 二、HTTP安全头详解

### 2.1 安全响应头一览

```
┌──────────────────────────┬──────────────────────────────────┐
│        安全头             │              作用                │
├──────────────────────────┼──────────────────────────────────┤
│ Content-Security-Policy  │ 限制资源加载来源，防XSS          │
│ Strict-Transport-Security│ 强制HTTPS，防降级攻击            │
│ X-Frame-Options          │ 防点击劫持                       │
│ X-Content-Type-Options   │ 防MIME类型嗅探                   │
│ Referrer-Policy          │ 控制Referrer信息泄露              │
│ Permissions-Policy       │ 限制浏览器API使用                 │
│ Cross-Origin-*-Policy    │ 跨域资源隔离(COOP/COEP/CORP)     │
│ Cache-Control            │ 控制缓存(敏感数据不缓存)          │
└──────────────────────────┴──────────────────────────────────┘
```

### 2.2 CSP详解

```
Content-Security-Policy 指令系统：

default-src 'self'                     ← 默认只允许同源
script-src 'self' 'nonce-{random}'     ← 脚本来源控制
style-src 'self' 'unsafe-inline'       ← 样式来源
img-src 'self' data: https:            ← 图片来源
connect-src 'self' https://api.example.com ← 连接来源
frame-src 'none'                       ← 禁止嵌套框架
form-action 'self'                     ← 限制表单提交目标

安全等级：
  Level 1: 基本源白名单
  Level 2: nonce/hash + 'strict-dynamic'
  Level 3: 'unsafe-hashes' + 报告组

推荐策略：
  CSP: default-src 'none'; script-src 'self'; 
       style-src 'self'; img-src 'self';
       connect-src 'self'; frame-ancestors 'none';
       base-uri 'self'; form-action 'self';
```

### 2.3 Missing安全头的检测

```
安全头检查清单：

□ HSTS: max-age≥1年 + includeSubDomains + preload
□ CSP: 非空策略，无'unsafe-inline'和'unsafe-eval'
□ X-Frame-Options: DENY 或 SAMEORIGIN
□ X-Content-Type-Options: nosniff
□ Referrer-Policy: strict-origin-when-cross-origin
□ Permissions-Policy: 限制不必要的API
□ 无 Server/X-Powered-By 泄露服务器信息
```

---

## 三、同源策略与CORS

### 3.1 同源策略(SOP)

```
同源 (Same Origin) = 协议 + 域名 + 端口 完全相同

  https://example.com:443/page
  ├── 协议: https
  ├── 域名: example.com
  └── 端口: 443 (隐式)

与以下对比：
  http://example.com  → ❌ 协议不同
  https://sub.example.com → ❌ 子域名不同
  https://example.com:8443 → ❌ 端口不同
  https://example.com/other → ✅ 同源 (路径不影响)

同源策略限制：
  · 无法读取另一个源的DOM
  · 无法读取另一个源的Cookie/LocalStorage
  · 无法发送跨域AJAX请求
```

### 3.2 CORS配置

```
CORS = Cross-Origin Resource Sharing → 安全地突破同源策略

关键响应头：
  Access-Control-Allow-Origin: https://trusted-site.com
  Access-Control-Allow-Methods: GET, POST
  Access-Control-Allow-Credentials: true  ← 允许发送Cookie
  Access-Control-Allow-Headers: Content-Type
  Access-Control-Max-Age: 86400  ← 预检缓存时间

常见错误配置：
  ❌ Access-Control-Allow-Origin: *
     配合 Access-Control-Allow-Credentials: true → 禁止组合！

  ❌ 反射用户输入的Origin头
     Access-Control-Allow-Origin: {{request.headers.origin}}
     → 允许任何Origin

  ❌ 过于宽松的Access-Control-Allow-Origin: null
     → null origin可能来自iframe sandbox
```

---

## 四、Cookie安全属性

### 4.1 Cookie安全标识

```
Set-Cookie: sessionId=abc123; 
            Secure;           ← 仅HTTPS传输
            HttpOnly;         ← 禁止JavaScript访问
            SameSite=Lax;     ← 防CSRF
            Domain=example.com;
            Path=/;
            Max-Age=3600;

各属性作用：

┌───────────┬──────────────────────────────────────┐
│   属性     │                作用                  │
├───────────┼──────────────────────────────────────┤
│ Secure    │ 只在HTTPS连接中发送Cookie            │
│ HttpOnly  │ 禁止 document.cookie JavaScript访问  │
│ SameSite  │ 控制跨站请求是否发送Cookie            │
│ Domain    │ 限定Cookie的作用域名                 │
│ Path      │ 限定Cookie的作用路径                 │
│ Max-Age   │ 过期时间(秒)，比Expires优先          │
└───────────┴──────────────────────────────────────┘
```

### 4.2 SameSite详解

```
SameSite三种模式：

① Strict（最安全）：
   仅同站请求发送Cookie
   从外部站点点击链接 → 不带Cookie → 可能需重新登录
   
② Lax（推荐，Chrome默认）：
   顶级导航(GET)发送Cookie
   跨站POST/iframe/img不发送
   从搜索引擎点进页面 → 带Cookie ✅

③ None（需要Secure）：
   所有跨站请求发送Cookie
   必须配合 Secure 属性
   用于需要跨站认证的场景

防御效果：
  SameSite=Lax → 自动防御大部分CSRF攻击
```

---

## 五、Web安全测试工具

### 5.1 工具矩阵

```
┌──────────────────┬──────────────────────────────────┐
│      工具         │             用途                  │
├──────────────────┼──────────────────────────────┤
│ Burp Suite Pro   │ 拦截代理 + 扫描 + 渗透测试      │
│ OWASP ZAP        │ 开源Web安全扫描器，自动+手动    │
│ Nikto            │ Web服务器漏洞扫描               │
│ SQLMap           │ 自动化SQL注入检测               │
│ ffuf/gobuster    │ 目录/文件爆破                   │
│ Nmap             │ 端口扫描 + NSE脚本              │
│ WhatWeb/Wappalyzer│ 技术栈识别                     │
│ Dalfox/XSStrike  │ XSS自动化检测                  │
└──────────────────┴──────────────────────────────┘
```

---

## 六、安全开发框架

### 6.1 内置安全机制

```
现代框架的安全特性：

┌──────────┬──────────────────────────────────────┐
│  框架     │              安全特性               │
├──────────┼──────────────────────────────────────┤
│ Spring   │ Spring Security + CSRF Token +       │
│          │ 参数化查询(JPA) + 自动编码(Thymeleaf) │
│ Django   │ CSRF Middleware + XSS过滤 + SQL ORM  │
│ Express  │ Helmet中间件 + express-session       │
│ ASP.NET  │ AntiForgeryToken + Razor编码         │
│ Laravel  │ CSRF + Eloquent ORM + Blade编码      │
└──────────┴──────────────────────────────────────┘

共同的安全能力：
  ✅ 自动XSS防护（模板引擎自动HTML编码）
  ✅ 内置CSRF防护（令牌验证）
  ✅ ORM参数化查询（防SQL注入）
  ✅ 安全会话管理
  ✅ 安全HTTP头支持
```

---

## 七、CISP考试速查

### 关键考点

| 考点 | 记忆要点 |
|------|---------|
| OWASP Top 10 2021 | "A01访问控制登顶，A03注入降为第三" |
| CSP价值 | "防XSS的最强手段，限制脚本来源" |
| SameSite | "Strict最严，Lax是默认（Chrome），None需Secure" |
| 同源三要素 | "协议 + 域名 + 端口" |
| Cookie三大安全属性 | "Secure + HttpOnly + SameSite" |

### 常见陷阱

1. **"用了HTTPS就安全了"** → 还需要CSP+HSTS+安全Cookie
2. **"OWASP Top 10只是Web的"** → 很多风险也适用于API和移动端
3. **"CORS配置Access-Control-Allow-Origin: *就够了"** → 不能与credentials:true共用

---

## 八、自检清单

- [ ] OWASP Top 10 (2021) 的十项风险能说出吗？
- [ ] CSP如何防御XSS攻击？
- [ ] SameSite的三种模式及其区别？
- [ ] 同源策略的三要素？
- [ ] Cookie的Secure/HttpOnly/SameSite分别防止什么？
- [ ] 常见的不安全HTTP安全头配置有哪些？
- [ ] 404页面有哪些关键安全头？

---

> **下一步**：Day 51 深入学习SQL注入——盲注、二次注入与绕过技巧。
