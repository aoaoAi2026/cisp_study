# Day 88 - 薄弱点专项复习4（Web安全与代码审计）

> **冲刺说明**：Web安全是CISP考试的常客，OWASP Top 10、SQL注入、XSS、CSRF是最核心的考点。今天把这些Web攻击的原理、危害和防御手段彻底搞清楚。

---

## 📋 目录导航

| 章节 | 内容 | 建议用时 |
|------|------|---------|
| 一 | OWASP Top 10 概览 | 15 分钟 |
| 二 | SQL注入深度解析 | 20 分钟 |
| 三 | XSS跨站脚本攻击 | 15 分钟 |
| 四 | CSRF与其他Web攻击 | 15 分钟 |
| 五 | 代码审计与安全开发 | 15 分钟 |
| 六 | 专项选择题练习（15题） | 25 分钟 |
| 七 | 高频易错点总结 | 10 分钟 |

---

## 一、OWASP Top 10 概览

| 排名 | 漏洞类型 | 一句话描述 |
|------|---------|-----------|
| 1 | 访问控制失效 | 普通用户访问了管理员功能 |
| 2 | 加密失效 | 敏感数据明文传输/弱加密 |
| 3 | 注入 | SQL/OS/LDAP命令被注入执行 |
| 4 | 不安全设计 | 架构层面缺乏安全设计 |
| 5 | 安全配置错误 | 默认密码未改、目录列出 |
| 6 | 脆弱和过时的组件 | 使用有已知漏洞的库 |
| 7 | 身份认证和授权失败 | 弱密码、会话管理漏洞 |
| 8 | 软件和数据完整性失效 | 未验证的更新包、CI/CD注入 |
| 9 | 安全日志和监控失效 | 被入侵后长期未发现 |
| 10 | SSRF服务端请求伪造 | 服务器被利用发起内部请求 |

---

## 二、SQL注入深度解析

### 2.1 什么是SQL注入

攻击者将恶意的SQL代码插入到应用的输入参数中，从而操纵后端数据库。

**典型案例**：
```sql
-- 原始SQL：
SELECT * FROM users WHERE username = '${input}' AND password = '${hash}'

-- 攻击者输入 username: admin' --
-- 拼接后变成：
SELECT * FROM users WHERE username = 'admin' --' AND password = 'xxx'
-- "--" 后面全被注释掉了！不需要密码就能登录
```

### 2.2 SQL注入类型

| 类型 | 特点 | 示例 |
|------|------|------|
| 基于错误的注入 | 通过数据库错误信息获取结构 | `' AND 1=CONVERT(int,@@version)--` |
| 联合查询注入 | 使用UNION获取其他表数据 | `' UNION SELECT user,password FROM users--` |
| 盲注（布尔型） | 根据页面是否变化推断数据 | `' AND 1=1--`（正常）vs `' AND 1=2--`（异常） |
| 盲注（时间型） | 根据响应时间推断 | `' AND IF(1=1,SLEEP(5),0)--` |
| 堆叠查询 | 执行多条SQL语句 | `'; DROP TABLE users; --` |

### 2.3 SQL注入防御

| 防御方法 | 说明 | 效果 |
|---------|------|------|
| **参数化查询/预编译** | 将数据和SQL结构分离 | ⭐ 最有效 |
| 输入验证与过滤 | 白名单验证 | 辅助手段 |
| 最小特权原则 | 数据库账号只给必要权限 | 纵深防御 |
| 存储过程 | 封装SQL逻辑 | 辅助手段 |
| WAF | Web应用防火墙 | 兜底防护 |
| 错误信息屏蔽 | 不暴露数据库错误详情 | 增加攻击难度 |

---

## 三、XSS跨站脚本攻击

### 3.1 XSS三种类型

| 类型 | 存储位置 | 触发方式 | 危害程度 |
|------|---------|---------|---------|
| **反射型** | 不存储 | 点击恶意链接触发 | 中 |
| **存储型** | 存到服务器 | 受害者访问页面即触发 | 高（影响所有用户） |
| **DOM型** | 不经过服务器 | 客户端JS直接处理了恶意数据 | 中 |

### 3.2 XSS攻击向量示例

```html
<!-- 最常见的XSS -->
<script>alert('XSS')</script>

<!-- 事件处理器 -->
<img src=x onerror="alert('XSS')">

<!-- JavaScript伪协议 -->
<a href="javascript:alert('XSS')">Click me</a>

<!-- CSS中的XSS -->
<div style="background:url('javascript:alert(1)')">
```

### 3.3 XSS防御措施

| 防御方法 | 说明 |
|---------|------|
| **输出编码** | 渲染前对HTML实体编码（`<` → `&lt;`） |
| **内容安全策略CSP** | HTTP头限制脚本来源 |
| **HttpOnly Cookie** | 防止JS读取敏感Cookie |
| **输入验证** | 白名单过滤 |
| **XSS过滤器** | 现代浏览器内置 |

---

## 四、CSRF与其他Web攻击

### 4.1 CSRF（跨站请求伪造）

**攻击原理**：
1. 用户登录了银行网站（Cookie有效）
2. 用户同时浏览了恶意网站
3. 恶意网站偷偷向银行发转账请求
4. 浏览器自动带上Cookie → 银行以为用户自己在操作

**防御方法**：
| 方法 | 原理 |
|------|------|
| CSRF Token | 每次提交需带随机令牌 |
| SameSite Cookie | 限制跨站请求带Cookie |
| Referer/Origin检查 | 验证请求来源 |
| 二次验证 | 关键操作需再次输入密码 |

### 4.2 SSRF（服务端请求伪造）

攻击者利用服务器发起请求，访问内网资源。

```
攻击者 → 公网服务器 ───（内网请求）──→ 内网数据库
         (可访问)                  (不可直接访问)
```

**防御**：URL白名单、禁用不需要的协议、内网地址黑名单

### 4.3 文件上传漏洞

| 风险 | 描述 |
|------|------|
| 上传WebShell | 上传可执行脚本（.php/.jsp/.asp） |
| 覆盖关键文件 | 上传同名文件覆盖 |
| 路径穿越 | `../../../etc/passwd` |

**防御**：文件类型白名单、重命名、内容校验、隔离存储

---

## 五、代码审计与安全开发

### 5.1 SDL安全开发生命周期

```
需求 → 设计 → 编码 → 测试 → 发布 → 运维
  │      │      │      │      │       │
安全需求 威胁建 静态分析 安全测试 安全检 应急响
        模(STR 代码审 渗透测  查   应
        IDE)  计     试
```

### 5.2 SAST vs DAST

| 对比 | SAST（静态分析） | DAST（动态分析） |
|------|-----------------|-----------------|
| 何时进行 | 编码阶段（白盒） | 运行阶段（黑盒） |
| 是否需运行 | 不需要 | 需要 |
| 能发现 | 代码级别漏洞 | 运行时漏洞 |
| 误报率 | 较高 | 较低 |
| **记忆** | S=Source(源码) | D=Dynamic(动态) |

### 5.3 STRIDE威胁建模

| 字母 | 威胁类型 | 被破坏的属性 |
|------|---------|-------------|
| S | 欺骗（Spoofing） | 认证 |
| T | 篡改（Tampering） | 完整性 |
| R | 否认（Repudiation） | 不可否认性 |
| I | 信息泄露 | 机密性 |
| D | 拒绝服务（DoS） | 可用性 |
| E | 权限提升 | 授权 |

---

## 六、专项选择题练习（15题）

**1. 以下哪项是防御SQL注入最有效的方法？**

A. 防火墙
B. 参数化查询（预编译语句）
C. 关闭数据库
D. 使用HTTP代替HTTPS

<details>
<summary>答案与解析</summary>

**B** —— 参数化查询/预编译语句将SQL结构和数据分离，从根本上杜绝注入。A是辅助手段，C不实际。

</details>

---

**2. 存储型XSS与反射型XSS的关键区别是？**

A. 存储型更安全
B. 存储型将恶意代码存储在服务器，影响所有访问页面的用户
C. 反射型不需要用户交互
D. 两者完全相同

<details>
<summary>答案与解析</summary>

**B** —— 存储型XSS将恶意脚本存入服务器（如评论、个人资料），每个访问该页面的用户都会被攻击。反射型需要用户点击特定链接。

</details>

---

**3. CSRF攻击依赖于？**

A. SQL注入漏洞
B. 用户已登录目标网站且浏览器自动带Cookie
C. 服务器漏洞
D. XSS漏洞

<details>
<summary>答案与解析</summary>

**B** —— CSRF利用的是Web的Cookie自动携带机制。用户在已登录状态下访问恶意网站，恶意网站利用自动携带的Cookie伪造请求。

</details>

---

**4. SAST（静态应用安全测试）属于什么类型的测试？**

A. 黑盒测试
B. 白盒测试
C. 灰盒测试
D. 渗透测试

<details>
<summary>答案与解析</summary>

**B** —— SAST分析源代码，属于白盒测试（有源码访问权）。DAST不分析源码，只测试运行中的应用，属于黑盒测试。S=Source=有源码。

</details>

---

**5. STRIDE模型中，"T"代表什么？**

A. 传输
B. 篡改（Tampering）
C. 时间
D. 威胁

<details>
<summary>答案与解析</summary>

**B** —— STRIDE：Spoofing(欺骗)、Tampering(篡改)、Repudiation(否认)、Info Disclosure(信息泄露)、DoS(拒绝服务)、Elevation of Privilege(权限提升)。

</details>

---

**6. 为了防御XSS，输出时应对特殊字符进行HTML实体编码。`<`应编码为？**

A. `&gt;`
B. `&lt;`
C. `&amp;`
D. `&quot;`

<details>
<summary>答案与解析</summary>

**B** —— `<`编码为`&lt;`（less than），`>`编码为`&gt;`（greater than），`&`编码为`&amp;`，`"`编码为`&quot;`。

</details>

---

**7. 内容安全策略CSP通过什么方式配置？**

A. HTML meta标签或HTTP响应头
B. 数据库配置
C. 操作系统防火墙
D. JavaScript代码

<details>
<summary>答案与解析</summary>

**A** —— CSP通过HTTP头`Content-Security-Policy`或HTML `<meta http-equiv="Content-Security-Policy">`配置，限定浏览器只能加载来自指定源的脚本和资源。

</details>

---

**8. SSRF攻击的特点是利用服务器？**

A. 攻击客户端浏览器
B. 发起对内部网络的请求
C. 加密数据库
D. 修改DNS记录

<details>
<summary>答案与解析</summary>

**B** —— SSRF（Server-Side Request Forgery）利用服务器向内部网络发起请求，绕过防火墙访问内网资源。S=Server(服务器端)。

</details>

---

**9. 防止文件上传漏洞，最不应该的做法是？**

A. 白名单限制文件类型
B. 仅依赖客户端JavaScript验证
C. 给上传文件重命名
D. 将文件存储在Web目录外

<details>
<summary>答案与解析</summary>

**B** —— 客户端验证可以被轻易绕过，只能作为辅助手段，**必须**在服务端进行验证。服务端验证才是真正的安全保障。

</details>

---

**10. WebShell是什么？**

A. 一种杀毒软件
B. 攻击者上传到服务器的恶意脚本，用于远程控制
C. Web服务器的正常管理工具
D. 防火墙的一种

<details>
<summary>答案与解析</summary>

**B** —— WebShell是攻击者利用文件上传等漏洞植入的恶意脚本（如一句话木马），通过浏览器即可远程执行命令和管理服务器。

</details>

---

**11. OWASP Top 10中排名第一的安全风险是？**

A. 注入
B. XSS跨站脚本
C. 访问控制失效
D. 加密失效

<details>
<summary>答案与解析</summary>

**C** —— 在最新的OWASP Top 10（2021版）中，访问控制失效（Broken Access Control）排名第一，从原先的第五位跃升到第一。注入降至第三。

</details>

---

**12. 以下哪项是CSRF Token防御的核心原理？**

A. 加密所有数据
B. 每次提交带随机令牌，攻击者无法预测
C. 使用HTTPS
D. 禁用Cookie

<details>
<summary>答案与解析</summary>

**B** —— CSRF Token是每次请求生成不可预测的随机值，攻击者无法构造包含正确Token的请求，从而防止跨站请求伪造。

</details>

---

**13. 代码审计中，以下写法最不安全的是？**

A. `PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id=?");`
B. `Statement stmt = conn.createStatement(); stmt.executeQuery("SELECT * FROM users WHERE id=" + userId);`
C. 使用ORM框架
D. 使用存储过程

<details>
<summary>答案与解析</summary>

**B** —— 直接拼接用户输入到SQL语句中是最危险的写法，存在SQL注入。A使用PreparedStatement是安全的参数化查询。

</details>

---

**14. HttpOnly Cookie的主要作用是？**

A. 加密Cookie内容
B. 防止JavaScript读取Cookie，减轻XSS危害
C. 使Cookie永久有效
D. Cookie只能通过FTP传输

<details>
<summary>答案与解析</summary>

**B** —— HttpOnly标志使得Cookie无法被JavaScript（如`document.cookie`）访问，即使存在XSS漏洞，攻击者也偷不到Session Cookie。

</details>

---

**15. 渗透测试与漏洞扫描的区别是？**

A. 完全相同
B. 渗透测试包含人工验证和利用，漏洞扫描是自动化检测
C. 漏洞扫描比渗透测试更深入
D. 两者都需要手动进行

<details>
<summary>答案与解析</summary>

**B** —— 漏洞扫描是自动化工具（如Nessus）批量检测，渗透测试是安全专家模拟真实攻击，包含验证和利用漏洞的全过程。

</details>

---

## 七、高频易错点总结

| 易混淆概念 | 快速记忆法 |
|-----------|-----------|
| **SAST vs DAST** | S=Source（有源码，白盒），D=Dynamic（无源码，黑盒）|
| **XSS三种类型** | 反射=传一次，存储=存服务器，DOM=客户端处理 |
| **CSRF vs XSS** | XSS=脚本注入，CSRF=请求伪造（利用Cookie）|
| **SQL注入防御** | 参数化查询是根本，WAF是兜底 |
| **SSRF** | S=Server，服务器代替攻击者发请求 |
| **STRIDE** | S-T-R-I-D-E 字母顺序记住六种威胁 |
| **HttpOnly** | 防XSS偷Cookie，非加密 |

---

## 🧘 考试心态提醒

- OWASP Top 10前三名（访问控制、加密失效、注入）**必考至少一题**
- XSS和CSRF容易混淆——XSS是注入脚本运行，CSRF是利用Cookie伪造请求
- SAST/DAST、渗透测试/漏洞扫描，都是"前者深入后者自动化"的关系

> **今日目标**：15道题答对13道以上！
