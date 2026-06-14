# Day 53：CSRF攻击

> **所属周**：Week 8 — 应用安全 · **主题**：跨站请求伪造防御体系

---

## 📑 目录

1. [CSRF攻击原理回顾](#一csrf攻击原理回顾)
2. [Anti-CSRF Token深入](#二anti-csrf-token深入)
3. [SameSite Cookie机制](#三samesite-cookie机制)
4. [CSRF高级攻击技术](#四csrf高级攻击技术)
5. [CSRF与XSS组合攻击](#五csrf与xss组合攻击)
6. [CSRF防御综合策略](#六csrf防御综合策略)
7. [SSRF：服务端请求伪造](#七ssrf服务端请求伪造)
8. [CISP考试速查](#cisp考试速查)
9. [自检清单](#自检清单)

---

## 一、CSRF攻击原理回顾

### 1.1 攻击条件

```
CSRF攻击成功的必要条件：

① 用户在目标网站已登录（Cookie有效）
② 目标网站的请求参数可预测
③ 攻击者能诱导用户触发请求

经典攻击流程：

  受害者                  目标网站 www.bank.com
  1. 登录银行网站 ─────────────→ 获得Session Cookie
  2. 访问恶意页面（或点击链接）
      ← 返回恶意HTML:
      <form action="https://bank.com/transfer" method="POST">
        <input type="hidden" name="to" value="attacker">
        <input type="hidden" name="amount" value="10000">
      </form>
      <script>document.forms[0].submit()</script>
  3. 浏览器自动提交表单（带Cookie）
     ─────────────────→ POST /transfer
                         to=attacker&amount=10000
                         Cookie: session=abc123
  4. 处理请求 ──→ 转账成功！（认为是合法请求）
```

### 1.2 常见受影响操作

| 操作类型 | 风险场景 |
|----------|---------|
| 账号修改 | 改密码、改邮箱、改手机号 |
| 资金操作 | 转账、支付、提现 |
| 权限变更 | 添加管理员、修改权限 |
| 内容发布 | 发帖、发私信、评论 |
| 设置修改 | 改安全设置、关闭2FA |

---

## 二、Anti-CSRF Token深入

### 2.1 Token实现原理

```
完整的CSRF Token流程：

        Client                        Server
          │                              │
          │ 1. GET /transfer-form        │
          │ ───────────────────────→    │
          │                              │  生成随机Token
          │                              │  存入Session
          │    2. 返回表单(含隐藏Token)     │
          │ ←─────────────────────────  │
          │    <input type="hidden"      │
          │     name="csrf_token"        │
          │     value="a8f3b2c1">       │
          │                              │
          │ 3. POST /transfer            │
          │    csrf_token=a8f3b2c1       │
          │    + Cookie(Session)         │
          │ ───────────────────────→    │
          │                              │  比较POST中的Token
          │                              │  与Session中的Token
          │                              │  ✓ 匹配 → 处理请求
          │    4. 确认结果               │
          │ ←─────────────────────────  │

Token安全要求：
  ✅ 随机性：至少128位熵的安全随机数
  ✅ 绑定：Token与用户Session绑定
  ✅ 一次性：每个Session生成新Token，或每次请求更新
  ✅ 保密：不在URL中传递，不在Referer中泄露
```

### 2.2 常见Token实现错误

```
❌ 错误1：Token可预测
   csrf_token = md5(user_id)  → 攻击者可计算

❌ 错误2：Token范围过宽
   同一Token在所有操作中重用 → 泄露一个令牌全受影响

❌ 错误3：Token比较不严格
   if csrf_token in user_input:  → 空Token也通过

❌ 错误4：GET请求携带Token
   GET /delete?id=1&token=xxx  → Token在URL/Referer日志泄露

❌ 错误5：Token在Cookie中双重提交但无验证
   → 攻击者可以为目标域名设置Cookie (Cookie Tossing)

✅ 正确实现：
   · 安全随机数生成 (SecureRandom/crypto.randomBytes)
   · 服务器端比较（恒定时间）
   · 每个用户独立的Token
   · POST/PUT/DELETE类请求需Token
   · Token不在Cookie中（仅Session）
```

---

## 三、SameSite Cookie机制

### 3.1 三个模式深入

```
Set-Cookie: session=abc; SameSite=Strict; Secure; HttpOnly

┌────────────┬────────────────────────────────────────┐
│   模式      │                  行为                  │
├────────────┼────────────────────────────────────────┤
│ Strict     │ 仅第一方（同站）请求发送Cookie           │
│            │ 外部链接点进来 → 不带Cookie（需重新登录） │
│            │ 最安全但有UX影响                        │
├────────────┼────────────────────────────────────────┤
│ Lax        │ 顶级导航GET请求发送Cookie               │
│            │ 跨站POST/iframe/img不发送               │
│            │ Chrome 80+默认值，推荐                  │
├────────────┼────────────────────────────────────────┤
│ None       │ 所有请求发送Cookie                     │
│            │ 必须+Secure属性                        │
│            │ 用于跨站登录等场景                      │
└────────────┴────────────────────────────────────────┘
```

### 3.2 SameSite防护效果

```
防御矩阵：

  攻击类型                  Strict      Lax       None
  ──────────────────────────────────────────────────
  POST自动提交表单           ✅防御      ✅防御      ❌
  图片/iframe GET            ✅防御      ✅防御      ❌
  <link> GET                 ✅防御      ✅防御      ❌
  点击链接(导航)             ❌不防护     ⚠️部分     ❌
  window.location跳转        ❌不防护     ⚠️部分     ❌

注意：SameSite=Lax 允许顶级GET导航 → 
  攻击者构造 <a href="https://bank.com/transfer?amount=10000&to=attacker">
  → 用户点击 → Cookie发送 → 如果银行用GET处理转账 → 攻击成功！

教训：永远不要用GET请求执行有副作用的操作！
```

---

## 四、CSRF高级攻击技术

### 4.1 JSON CSRF

```
传统CSRF：表单POST (application/x-www-form-urlencoded)
JSON CSRF：针对 Content-Type: application/json 的API

利用方式1 — 表单enctype trick：
  <form action="/api/update" method="POST" 
        enctype="text/plain">
    <input name='{"name":"attacker","email":"evil@a.com","x":"'
           value='y"}' >
  </form>
  发送: {"name":"attacker","email":"evil@a.com","x":"=y"}

利用方式2 — fetch + 跨域（需CORS配合）：
  如果Access-Control-Allow-Origin:* 且 Allow-Credentials:false
  → fetch发送JSON请求，但无Cookie（攻击效果有限）
```

### 4.2 登录CSRF

```
登录CSRF：

攻击者让受害者不知不觉用攻击者的账号登录目标网站
  → 攻击者账号的浏览历史 → 受害者看到攻击者搜索记录
  → 攻击者账号的输入 → 保存在攻击者账号下
  → 受害者误以为是自己账号，输入敏感信息

防御：
  ✅ 登录表单也应有CSRF Token
  ✅ 登录后强制刷新Session ID
```

---

## 五、CSRF与XSS组合攻击

### 5.1 XSS绕过CSRF防御

```
如果存在XSS漏洞，所有CSRF防御都可能被绕过：

① XSS绕过Token防御：
   XSS读取页面中的Token → 随请求发送
   
② XSS绕过SameSite：
   XSS在当前域执行 → 请求是第一方请求 → SameSite不防御

③ XSS绕过Referer检查：
   在目标页面内执行fetch → Referer是目标网站本身

结论：XSS > CSRF（有XSS的地方CSRF防御形同虚设）
       → 优先修复XSS，其次才是CSRF
```

---

## 六、CSRF防御综合策略

### 6.1 防御层次

```
纵深防御：

Layer 1 — 首要防御：
  ✅ SameSite=Lax Cookie（浏览器自动防护）

Layer 2 — 标准防御：
  ✅ Anti-CSRF Token（服务器端验证）

Layer 3 — 辅助防御：
  ✅ Referer/Origin头验证
  ✅ 自定义头部 (X-Requested-With)
  ✅ 操作确认（二次验证：输入密码/验证码）
  ✅ 敏感操作使用POST，GET只读

Layer 4 — 前置防御：
  ✅ XSS防护（防止Token被窃取）
  ✅ 短会话超时
  ✅ 限制关键操作频率
```

### 6.2 Token vs SameSite vs Referer

| 方案 | 可靠性 | 实现难度 | 局限性 |
|------|--------|---------|--------|
| CSRF Token | ✅ 可靠 | 中 | 需每个表单添加 |
| SameSite Cookie | ✅ 可靠 | 低 | 旧浏览器不支持 |
| Referer验证 | ⚠️ 辅助 | 低 | 可以被隐藏 |
| 自定义Header | ✅ 有效 | 中 | 仅AJAX请求 |
| 验证码/二次确认 | ✅ 最可靠 | 高 | 用户体验差 |

> 💡 最佳实践：**SameSite + Token + 合理使用GET/POST = 三层防护**

---

## 七、SSRF：服务端请求伪造

### 7.1 SSRF原理

```
CSRF vs SSRF：

CSRF：让用户的浏览器发请求（C = Client）
SSRF：让服务器发请求（S = Server）

SSRF攻击：
  攻击者                  服务器                  内网
    │                        │                      │
    │  POST /fetch-url       │                      │
    │  url=http://169.254    │                      │
    │  .169.254/latest/      │                      │
    │ ───────────────────→  │                      │
    │                        │  GET /latest/        │
    │                        │ ───────────────────→ │
    │                        │                      │ ← AWS元数据
    │                        │  返回访问密钥         │
    │                        │ ←─────────────────── │
    │  返回元数据             │                      │
    │ ←───────────────────  │                      │

常见利用目标：
  · AWS EC2: http://169.254.169.254/latest/meta-data/
  · 本地服务: http://localhost:6379/ (Redis)
  · 内网探测: http://192.168.1.0/24/
  · 文件读取: file:///etc/passwd
  · Gopher协议: gopher://攻击Redis/MySQL
```

### 7.2 SSRF防御

```
✅ URL白名单（只允许特定域名）
✅ 禁用不安全的URL协议(file://, gopher://, dict://)
✅ DNS解析后验证IP（拒绝内网IP：10.x, 172.16-31.x, 192.168.x, 127.x）
✅ 使用代理隔离服务端请求
✅ 响应内容验证（预期格式）
✅ 网络层防火墙限制服务器出站连接
```

---

## 八、CISP考试速查

| 考点 | 记忆要点 |
|------|---------|
| CSRF利用条件 | "登录状态 + 可预测请求 + 诱导触发" |
| Token防CSRF原理 | "服务器比对请求Token与Session中Token" |
| SameSite作用 | "Lax自动防大多数CSRF" |
| SSRF与CSRF区别 | "CSRF:浏览器, SSRF:服务器" |
| GET禁止副作用 | "GET请求只读，永远不用GET做修改操作" |

---

## 九、自检清单

- [ ] CSRF攻击成功的三个必要条件？
- [ ] Anti-CSRF Token的正确实现要素？
- [ ] SameSite三种模式的区别？
- [ ] 为什么XSS存在时CSRF防御形同虚设？
- [ ] JSON CSRF如何实施？
- [ ] SSRF与CSRF的核心区别？
- [ ] CSRF纵深防御包含哪几层？

---

> **下一步**：Day 54 学习文件上传漏洞——绕过技术与安全检测。
