# PHP 代码审计实战指南

---

## 一、PHP 常见漏洞全景

| 漏洞类型 | 常见函数 / 场景 | 风险等级 |
|---------|----------------|---------|
| SQL 注入 | `mysqli_query($sql)`、`pdo->query()` 直接拼接变量 | 严重 |
| 命令执行 | `system()`、`exec()`、`shell_exec()`、`passthru()`、`` ` `` `` | 严重 |
| 文件上传 | `move_uploaded_file()`、未校验文件类型/后缀 | 严重 |
| 任意文件读取 | `file_get_contents()`、`include()`、`readfile()` 路径可控 | 高危 |
| 文件包含 | `include`、`require`、`include_once`、`require_once` | 高危 |
| XXE | `libxml_disable_entity_loader(false)`、`simplexml_load_string` | 高危 |
| XSS | `echo` / `print` 未转义输出 | 中高 |
| SSRF | `file_get_contents($url)`、`curl_exec($ch)` | 中高 |
| 反序列化 | `unserialize($user_input)`、`__wakeup`、`__destruct` POP 链 | 严重 |
| 逻辑漏洞 | 支付金额修改、越权、验证码绕过 | 高 |
| 变量覆盖 | `$$`、`extract()`、`parse_str()`、`import_request_variables()` | 中 |
| 弱类型比较 | `==` / `!=`、`in_array(..., true)` 第三个参数缺失 | 中 |

## 二、SQL 注入速查

### 2.1 危险写法

```php
// ❌ 直接拼接
$sql = "SELECT * FROM users WHERE id = " . $_GET['id'];
mysqli_query($conn, $sql);

// ❌ 双引号内变量解析
$sql = "SELECT * FROM users WHERE username = \"$_GET[user]\"";

// ❌ PDO 非预编译
$db->query("SELECT * FROM users WHERE id = {$_GET['id']}");
```

### 2.2 正确写法

```php
// ✅ 预编译 + 绑定
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_GET['id']]);

// ✅ 类型转换 + 白名单
$id = (int)$_GET['id'];
$allowed_tables = ['users', 'orders'];
$table = in_array($_GET['tbl'], $allowed_tables) ? $_GET['tbl'] : 'users';
```

### 2.3 绕过关键字过滤

```
select 'se'+'lect' ...      (MySQL 可拼接字符串)
/*!50000select*/ ...        (MySQL 内联注释)
0x73656c656374              (hex)
大小写 / 空白 / 换行变化
```

## 三、反序列化漏洞

### 3.1 危险场景

```php
// ❌ 用户可控数据直接 unserialize
unserialize($_COOKIE['user_data']);
unserialize($_POST['session']);
unserialize(base64_decode($_GET['data']));
```

### 3.2 POP 链思维

```php
// 关键点: 1) __destruct 2) __wakeup 3) __toString 4) __invoke 5) __call 6) __get/__set
//
// 示例链: Logger.__destruct → writes to log file (path from $this->logFile)
//         ↓ 修改 $logFile 为 shell.php, 内容为恶意日志
class Logger {
    public $logFile = '/var/log/app.log';
    public $content = '';
    function __destruct() {
        file_put_contents($this->logFile, $this->content);
    }
}
// 攻击者构造 O:6:"Logger":2:{s:7:"logFile";s:18:"/var/www/html/s.php";s:7:"content";s:25:"<?php eval($_POST[1]);";}
```

### 3.3 常见利用工具链

- **phpggc**: 生成针对主流框架 (Laravel / Symfony / CodeIgniter / ThinkPHP / WordPress) 的 POP 链
- **PHPGGC Online**: `phpggc Symfony/RCE4 exec 'id' | base64 -w0`
- **反序列化查字典**: `php -r "echo serialize(['a' => 'b']);"`

## 四、文件包含与文件上传

```php
// ❌ LFI:
include($_GET['page'] . '.php');
// 利用: ?page=../../../../etc/passwd (若无后缀, 或路径截断)

// ❌ 文件上传未校验:
move_uploaded_file($_FILES['f']['tmp_name'], 'uploads/' . $_FILES['f']['name']);
// 可能上传 shell.php / shell.jpg%00.php / phtml / php5 / pht

// ✅ 正确:
$allowed = ['jpg', 'jpeg', 'png', 'gif'];
$ext = strtolower(pathinfo($_FILES['f']['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allowed)) die('forbidden');
$new_name = uniqid() . '.' . $ext;
move_uploaded_file($_FILES['f']['tmp_name'], 'uploads/' . $new_name);
// 额外: uploads 目录放在 Web 根目录外 / 禁止执行权限
```

## 五、SSRF 与 XXE

```php
// SSRF 示例:
$url = $_POST['url'];
$img = file_get_contents($url);
// 利用: ?url=file:///etc/passwd  ?url=http://127.0.0.1:6379/  ?url=gopher://...

// XXE 示例 (libxml 默认在 libxml2 2.9 起禁用外部实体, 但老版本可能风险):
libxml_disable_entity_loader(false);  // ❌ 启用外部实体
$xml = simplexml_load_string($_POST['xml']);
// 利用: <?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>
```

## 六、弱类型 / 松散比较

| 表达式 | 结果 | 利用场景 |
|--------|------|---------|
| `0 == "admin"` | true | 密码比较: `if ($_POST['pass'] == $row['hash'])` |
| `'1abc' == 1` | true | 数字前缀比较 |
| `'0x1F' == 31` | true (PHP<8) | hex 字符串转数字 |
| `md5('240610708') == md5('QNKCDZO')` | true (0e 科学计数法) | hash 比较绕过 |
| `in_array($_GET['x'], [1,2,3])` | `"1abc"` 也能匹配 | 参数类型不严格 |
| `strcmp($_GET['a'], 'secret') == 0` | 数组 `a[]=1` 返回 NULL, 等于 0 | 登录绕过 |

## 七、代码审计流程

```
Step 1: 通读配置
  - php.ini: allow_url_fopen, allow_url_include, display_errors, open_basedir
  - config.php: 数据库密码、密钥、debug 标志

Step 2: 全局搜索危险函数
  grep -rE "(\b(eval|assert|system|exec|passthru|shell_exec|popen|proc_open|unserialize|include|require|include_once|require_once|file_get_contents|move_uploaded_file|parse_str|extract)\s*\(|\\\$\\\$)" src/

Step 3: 回溯输入 → 处理 → 输出
  每个 $_GET/$_POST/$_COOKIE/$_FILES/$_SERVER[PHP_SELF] 都要跟踪: 过滤? 转义? 在哪输出/执行?

Step 4: 权限检查
  登录态? 越权 (uid 可改)? 管理后台鉴权中间件?

Step 5: 漏洞验证
  手工验证 / sqlmap / Burp Active Scanner / 自研 PoC 脚本
```

## 八、典型 PHP 框架漏洞

| 框架 | 历史著名漏洞 |
|------|-------------|
| **ThinkPHP 5.x** | `Request 类方法调用链` → RCE (2018/2019 多版本) |
| **ThinkPHP 6.x** | 文件上传 + multi-files 解析缺陷 |
| **Laravel** | `Whoops` debug 页面 token 泄漏 (CVE-2021-3129) |
| **CodeIgniter** | xss_clean 函数绕过 / session 反序列化 |
| **WordPress** | 插件 upload / plugin-install 远程执行 大量 CVE |
| **Drupal** | Drupalgeddon (CVE-2014-3704, CVE-2018-7600) |
| **PHPCMS / Dedecms / EmpireCMS** | 文件上传、SQL 注入历史多 |

## 九、加固建议

```php
// 1) PHP 升级到 7.4+ (推荐 8.x), 废弃危险函数:
//    php.ini: disable_functions = exec,passthru,shell_exec,system,proc_open,popen

// 2) 所有输入使用预编译 SQL, 禁止字符串拼接
$db->prepare("SELECT ... WHERE id = ?")->execute([$id]);

// 3) 输出转义:
echo htmlspecialchars($user_input, ENT_QUOTES, 'UTF-8');

// 4) 文件上传:
//    a) 白名单后缀 (jpg/png/gif/pdf)
//    b) 随机重命名 (uniqid + ext)
//    c) 存储到 web 根目录外, 或 Nginx 禁止执行该目录
//    d) 不接受用户输入的完整路径

// 5) 反序列化: 禁止 unserialize($user_input), 改用 JSON
//    如果必须, 使用白名单类 (PHP 7+: unserialize($data, ['allowed_classes' => ['A','B']]))

// 6) 防止 SSRF:
//    a) 只允许 http(s):// 协议
//    b) 禁用内网 IP 段 (10./172.16-31/192.168/127)
//    c) 限制端口 (80/443)
//    d) 禁用重定向跟随

// 7) 关闭错误显示:
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', '/var/log/php/error.log');
```

## 十、CheckList

- [ ] 检查 php.ini / .user.ini: `disable_functions`、`allow_url_include`、`open_basedir`
- [ ] 数据库连接: 是否使用预编译? 是否有全局 addslashes 伪过滤?
- [ ] 搜索 `eval(`, `assert(`, `preg_replace('/e/')` (PHP <7 已废弃 `/e` modifier)
- [ ] 文件上传: 后缀校验、MIME 校验、随机重命名、上传目录权限
- [ ] 文件包含: include 路径是否可控? 是否限制在固定目录?
- [ ] `unserialize` 调用: 输入是否可控? 能否构造 POP 链?
- [ ] 登录 / 注册 / 支付 / 验证码: 有没有逻辑漏洞 (金额、数量、顺序)
- [ ] 管理后台 / 接口: 鉴权中间件是否有效? 越权测试?
- [ ] 弱类型: `==` / `strcmp` / `in_array` 第三个参数缺失?
- [ ] 第三方组件版本 (Composer.lock / 插件 / CMS 历史 CVE)
