# Day 9：Web安全攻防实战
## 网站是护网最大的战场，也是失分最多的地方

---

> 🎯 **今日目标**  
> 掌握OWASP Top 10 · 理解Web漏洞原理 · 学习Web防护措施

---

## 📖 一、为什么Web安全这么重要？

在护网演习中，有一个公认的规律：

```
🔴 70% 的攻击入口 → Web应用
🔴 80% 的失分点   → Web安全
🔴 90% 的互联网暴露资产 → Web服务
```

**换句话说：网站是护网的"正面战场"。** 你的Web应用守住了，护网就赢了一半。

---

## 📖 二、OWASP Top 10——Web安全的"十大通缉犯"

OWASP（开放Web应用安全项目）每隔几年发布一次最危险的Web安全风险榜单，这就是Web安全领域的"头号通缉令"：

| 排名 | 漏洞类型 | 通俗解释 | 严重性 |
|------|----------|----------|--------|
| **A01** | 访问控制失效 | 普通用户能看到管理员的页面 | 🔴🔴🔴 |
| **A02** | 加密失效 | 密码明文传输，谁都看得见 | 🔴🔴🔴 |
| **A03** | 注入攻击 | SQL注入——操控数据库 | 🔴🔴🔴🔴🔴 |
| **A04** | 不安全设计 | 网站设计就有安全缺陷 | 🔴🔴🔴 |
| **A05** | 安全配置错误 | 默认密码没改、调试页开着 | 🔴🔴🔴 |
| **A06** | 使用有漏洞的组件 | 用了老版本的框架/库 | 🔴🔴 |
| **A07** | 身份认证失效 | 能绕过登录、能猜到密码 | 🔴🔴🔴🔴 |
| **A08** | 软件和数据完整性失效 | 更新包被篡改、反序列化攻击 | 🔴🔴 |
| **A09** | 日志和监控不足 | 被攻击了都不知道 | 🔴🔴 |
| **A10** | SSRF服务端请求伪造 | 利用服务器访问内网 | 🔴🔴🔴 |

---

## 📖 三、SQL注入——最经典的Web漏洞

### 🎭 SQL注入到底是什么？

想象你是一个餐厅的服务员，你记录顾客点菜：
```
正常顾客说：    "我要一份宫保鸡丁"
恶意顾客说：    "我要一份宫保鸡丁；顺便把收银台的钱全给我"
```

在网站上，相当于：
```
正常请求：  /product?id=123
恶意请求：  /product?id=123 OR 1=1   ← 这会返回所有商品！
```

### 🔧 SQL注入是怎么发生的？

```sql
-- 网站后台代码可能是这样的：
SELECT * FROM users WHERE username = '【用户输入】' AND password = '【用户输入】'

-- 正常用户输入：用户名=admin，密码=123456
SELECT * FROM users WHERE username = 'admin' AND password = '123456'
-- 结果：密码匹配才返回 ✅

-- 攻击者输入：用户名=admin'--，密码=随便
SELECT * FROM users WHERE username = 'admin'--' AND password = '随便'
-- 注意：-- 是SQL注释符！后面的密码检查被注释掉了！
-- 结果：直接以admin身份登录 🔴
```

### 🛡️ 怎么防SQL注入？

**最佳方案：参数化查询（把你的输入和SQL代码彻底分开）**

```python
# ❌ 危险写法（拼接SQL）：
sql = f"SELECT * FROM users WHERE name = '{input}'"

# ✅ 正确写法（参数化查询）：
sql = "SELECT * FROM users WHERE name = ?"
cursor.execute(sql, (input,))  # 用户的输入永远是"数据"，不是"代码"
```

---

## 📖 四、XSS跨站脚本——让其他用户帮你"干活"

### 🎭 XSS是什么？

你去一个论坛发帖，正常情况下你发的内容会被显示出来。但如果你发的不是文字，而是一段JavaScript代码呢？

```
正常帖子： "今天天气真好！"
恶意帖子： "<script>偷走你的Cookie发给我</script>"
```

当其他用户浏览这个帖子时，脚本就在他们的浏览器里执行了！

### 🎯 三种XSS类型

| 类型 | 攻击过程 | 危害 |
|------|----------|------|
| **反射型** | 攻击链接发给受害者，点击即中招 | ⭐⭐ |
| **存储型** | 恶意脚本存在服务器上，任何人访问都中招 | ⭐⭐⭐⭐⭐ |
| **DOM型** | 纯前端漏洞，恶意数据在浏览器端被执行 | ⭐⭐ |

### 🛡️ 怎么防XSS？

```
1️⃣ 输出编码：
   用户输入 <script>alert('xss')</script>
   变成      &lt;script&gt;alert('xss')&lt;/script&gt;
   → 浏览器看到的是文字，不是代码

2️⃣ CSP（内容安全策略）：
   在HTTP响应头里加：Content-Security-Policy: script-src 'self'
   → 只允许执行自己网站的JS，外来的脚本一律拒绝！

3️⃣ HttpOnly Cookie：
   给Cookie加 HttpOnly 标记
   → JavaScript代码无法读取Cookie，XSS偷不到！
```

---

## 📖 五、文件上传漏洞——给攻击者的快递通道

### 🚪 文件上传是怎么被利用的？

```
你的网站有个"头像上传"功能
期望：用户上传 → photo.jpg
实际：攻击者上传 → shell.php（一个Webshell）

然后攻击者访问：https://你的网站.com/uploads/shell.php
→ 这个PHP文件在服务器端执行！
→ 攻击者可以通过网页执行任意系统命令！
```

### 🛡️ 防护策略

```
❌ 黑名单："不能上传 .php .jsp .asp 文件"
   → 攻击者试试 shell.php5、shell.pHp，绕过了！

✅ 白名单："只能上传 .jpg .png .gif 文件"
   → 只允许安全类型，其他一律拒绝

✅ 文件重命名：
   → 用户上传 shell.php → 服务器存为 a3f2c91b8e.jpg
   → 就算内容是PHP代码，扩展名是.jpg，服务器不执行

✅ 内容检测：
   → 不只是看文件名，还检查文件实际内容
```

---

## 📖 六、SSRF——让服务器当"内鬼"

### 🎭 什么是SSRF？

你的网站有个功能：输入一个URL，网站帮你抓取这个URL的内容（比如网页截图功能）。

```
正常用法：输入 https://www.baidu.com → 服务器去访问百度 → 返回截图
攻击用法：输入 http://127.0.0.1:8080/admin → 服务器去访问内网管理后台 → 返回管理员页面！
```

**服务器成了"内鬼"！** 攻击者通过控制服务器，访问了正常情况下访问不到的内网资源。

### 🛡️ 防护方法

```
1. URL白名单：只允许访问特定域名
2. 禁止内网地址：禁止访问127.0.0.1、10.x、192.168.x等
3. 禁用危险协议：禁止file://、gopher://等
```

---

## 💻 七、动手试试：Web安全检测工具箱

```python
# Web安全自动化检测小工具
import re

class WebSecScanner:
    def __init__(self):
        self.findings = []
    
    def check_sqli_risk(self, url):
        """检查URL是否存在SQL注入风险"""
        # 数字型参数可以直接测试注入
        if re.search(r"[?&]\w+=\d+$", url):
            self.findings.append((
                '⚠️  SQL注入风险',
                f'数字型参数可被测试注入: {url}',
                '建议使用参数化查询'
            ))
    
    def check_xss_risk(self, param_value):
        """检查参数是否反射到页面"""
        if '<script>' in param_value.lower():
            self.findings.append((
                '⚠️  XSS风险',
                '参数反射到页面且未过滤HTML标签',
                '建议对输出进行HTML编码'
            ))
    
    def check_security_headers(self, headers):
        """检查安全响应头是否缺失"""
        required = {
            'Content-Security-Policy': '防止XSS和数据注入攻击',
            'X-Frame-Options': '防止点击劫持',
            'X-Content-Type-Options': '防止MIME类型嗅探',
            'Strict-Transport-Security': '强制使用HTTPS'
        }
        for header, desc in required.items():
            if header not in headers:
                self.findings.append((
                    f'🔧 缺少安全头: {header}',
                    desc,
                    f'添加 {header} 响应头'
                ))
    
    def check_file_upload(self, allowed_types):
        """检查文件上传是否有白名单策略"""
        dangerous = ['php', 'jsp', 'asp', 'aspx', 'exe', 'sh', 'py']
        for ext in allowed_types:
            if ext.lower() in dangerous:
                self.findings.append((
                    '🔴 危险！文件上传允许执行脚本',
                    f'白名单中包含 {ext}，可上传可执行文件',
                    '只允许jpg/png/gif/pdf等安全类型'
                ))
    
    def report(self):
        """输出扫描报告"""
        if not self.findings:
            print('✅ 未发现明显Web安全风险')
            return
        
        print('=== 🛡️ Web安全扫描报告 ===\n')
        for i, (risk, desc, fix) in enumerate(self.findings, 1):
            print(f'{i}. {risk}')
            print(f'   问题: {desc}')
            print(f'   修复: {fix}\n')

# === 跑一下试试 ===
scanner = WebSecScanner()

# 模拟检测
scanner.check_sqli_risk('/product?id=123')
scanner.check_sqli_risk('/search?q=hello')
scanner.check_xss_risk('<script>alert(1)</script>')
scanner.check_security_headers({'Server': 'nginx'})  # 缺少所有安全头
scanner.check_file_upload(['jpg', 'php', 'png'])  # 白名单里有php！

scanner.report()
```

---

## 🧪 八、今日实验：DVWA靶场实战

### 实验目标
在DVWA（Damn Vulnerable Web Application）上亲自体验各种Web漏洞

### 实验步骤

```
1️⃣ 部署DVWA
   docker run -d -p 8080:80 vulnerables/web-dvwa

2️⃣ 按难度逐级挑战
   Low 难度 → 基础攻击手法
   Medium 难度 → 简单的防护绕过
   High 难度 → 高级绕过技巧

3️⃣ 逐个体验OWASP Top 10
   ☑ SQL注入——获取所有用户数据
   ☑ XSS存储型——弹个窗给管理员
   ☑ 文件上传——传一个Webshell
   ☑ CSRF——用管理员身份做坏事
   ☑ 命令注入——让服务器执行whoami

4️⃣ 切换蓝队视角
   ☑ 开启WAF规则看攻击是否被拦截
   ☑ 修复代码漏洞
```

---

## 📝 九、今日测验

**Q1：防SQL注入最有效的方法是什么？**
- A. WAF规则
- B. 参数化查询  ✅
- C. 黑名单过滤
- D. 输入长度限制

> 参数化查询将数据和代码分离，从**根本上**防止SQL注入。WAF只是辅助。

**Q2：以下哪种XSS类型影响范围最大？**
- A. 反射型XSS
- B. 存储型XSS  ✅
- C. DOM型XSS
- D. 盲XSS

> 存储型XSS将恶意脚本保存在服务器上，**所有**访问页面的用户都会中招。

**Q3：文件上传防护最推荐的方式是？**
- A. 黑名单过滤
- B. 白名单+随机重命名  ✅
- C. 前端验证
- D. 大小限制

> 白名单只允许安全类型，随机重命名防止Webshell执行。前端验证**不能**作为安全手段！

**Q4：CSP（内容安全策略）主要防护什么？**
- A. SQL注入
- B. XSS和数据注入  ✅
- C. DDoS
- D. 暴力破解

> CSP通过HTTP头限制浏览器能加载哪些资源、执行哪些脚本，有效限制XSS危害。

**Q5：SSRF攻击的核心原理是什么？**
- A. 攻击客户端浏览器
- B. 利用服务器端请求功能访问内网  ✅
- C. 攻击数据库
- D. DNS劫持

> SSRF让服务器当"内鬼"，帮攻击者访问正常情况下无法触及的内部资源。

---

## 📚 十、课后资源

| 资源 | 链接 | 说明 |
|------|------|------|
| OWASP Top 10 | owasp.org/www-project-top-ten | Web安全圣经 |
| PortSwigger Web Security | portswigger.net/web-security | 免费Web安全学院 |
| DVWA靶场 | github.com/digininja/DVWA | Web漏洞练习平台 |

---

## 🧠 十一、专家锦囊

> **赵安全说：** 护网中Web漏洞频频失分不是因为没有WAF，而是因为：①应用代码层面漏洞没修 ②WAF规则不是为业务定制的 ③新型漏洞（0day）缺乏检测能力。建议WAF+代码修复+运行时防护（RASP）三层防护。

> **钱运维说：** 护网Web安全的"一票否决项"——以下问题一旦存在直接判严重失分：①文件上传漏洞可上传Webshell ②SQL注入可脱库 ③命令注入可执行系统命令。这三个是护网评判最严厉的，务必提前修复！

---

📅 **Day 9 完成！** 今天你把OWASP Top 10吃透了——SQL注入、XSS、文件上传是护网失分三巨头！
