# 常见漏洞类型：从 SQL 注入到缓冲区溢出

> **📘 文档定位**：CISP 考试技术域核心重点 | 难度：⭐⭐⭐ | 预计阅读：28 分钟
>
> 理解了漏洞的基本概念之后，本章聚焦于 CISP 考试中最常出现的具体漏洞类型——SQL 注入、XSS、CSRF、缓冲区溢出、文件上传、命令注入等。每种漏洞都从原理、示例、检测、防御四个维度讲解，帮你建立"看到描述就知道是什么类型"的应试能力。

---

## 导航目录

1. [注入攻击家族](#一注入攻击家族)
2. [XSS 跨站脚本](#二xss-跨站脚本)
3. [CSRF 跨站请求伪造](#三csrf-跨站请求伪造)
4. [缓冲区溢出](#四缓冲区溢出)
5. [文件上传与目录遍历](#五文件上传与目录遍历)
6. [认证与会话安全](#六认证与会话安全)
7. [CISP 考试要点速查](#七cisp-考试要点速查)

---

## 一、注入攻击家族

### 1.1 SQL 注入 (SQL Injection)

```
原理：攻击者通过构造恶意的输入，操纵后端 SQL 查询

经典案例：
正常登录：
SELECT * FROM users WHERE username='admin' AND password='123456'

SQL 注入攻击：
用户名输入：admin' --
生成 SQL：
SELECT * FROM users WHERE username='admin' --' AND password='xxx'
                                          ↑ 注释掉密码验证

结果：无需密码即可登录为 admin！

SQL 注入分类：
├── 联合查询注入 (Union-Based)
│   使用 UNION SELECT 获取其他表数据
├── 报错注入 (Error-Based)
│   利用数据库错误信息泄露数据
├── 布尔盲注 (Boolean-Based Blind)
│   根据页面返回的 True/False 逐字符猜解数据
├── 时间盲注 (Time-Based Blind)
│   根据响应时间差异判断结果
├── 堆叠查询 (Stacked Queries)
│   一次执行多条 SQL 语句（;分隔）
└── 二次注入 (Second-Order)
    注入的数据先存储，后被用到另一个 SQL 查询时触发

防御方法：
1. 参数化查询 (Prepared Statements) ← 🟢 最有效
   SELECT * FROM users WHERE username=? AND password=?

2. 输入验证和过滤
   ├── 白名单验证（只允许已知合法的输入）
   └── 转义特殊字符

3. 最小权限原则
   └── 数据库账户只授予所需的最小权限

4. 错误信息屏蔽
   └── 不向前端返回详细的数据库错误信息

5. Web 应用防火墙 (WAF)
   └── 检测和拦截 SQL 注入尝试
```

### 1.2 命令注入 (Command Injection)

```
原理：将操作系统命令注入到应用程序中执行

示例：
有一个 Ping 功能：用户输入 IP → 后端执行 ping [user_input]

正常输入：127.0.0.1
后端执行：ping 127.0.0.1

恶意输入：127.0.0.1; cat /etc/passwd
后端执行：ping 127.0.0.1; cat /etc/passwd
                         ↑ 分号分隔，执行了额外命令

常见命令分隔符：
├── ;    (Linux/Windows)
├── &&   (Linux/Windows)
├── ||   (Linux/Windows)
├── |    (管道)
└── ` 或 $() (命令替换)

防御：
├── 避免将用户输入传递给系统命令
├── 如必须，使用白名单限制输入
├── 对特殊字符进行转义
└── 使用参数化 API 而非字符串拼接
```

### 1.3 XXE (XML 外部实体注入)

```
原理：利用 XML 解析器处理外部实体的功能

恶意 XML：
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<data>&xxe;</data>

解析后 &xxe; 被替换为 /etc/passwd 的内容 → 文件内容泄露

危害：
├── 读取服务器本地文件
├── SSRF (服务端请求伪造)：让服务器访问内网资源
├── DoS (Billion Laughs Attack)
└── 端口扫描

防御：
├── 禁用外部实体解析
└── XML 解析器配置：DTD 禁用、外部实体禁用
```

---

## 二、XSS 跨站脚本

### 2.1 三种 XSS 类型

```
XSS (Cross-Site Scripting) =
攻击者在用户浏览器中执行恶意 JavaScript

1. 反射型 XSS (Reflected XSS)
   恶意脚本在 HTTP 请求参数中，服务器"反射"回响应页面
   例：/?search=<script>alert('XSS')</script>
       搜索结果页直接显示这个search值 → 脚本执行

2. 存储型 XSS (Stored XSS) ← 最危险
   恶意脚本存储在服务器（数据库/文件），每次访问都触发
   例：在论坛发帖内容中注入 <script>stekal_cookie()</script>
       每个查看该帖的用户都被攻击

3. DOM型 XSS (DOM-Based XSS)
   恶意脚本在客户端 JavaScript 处理 DOM 时触发
   完全在浏览器端，不经过服务器
   例：URL hash 被 innerHTML 写入页面（不加过滤）

XSS 能做什么：
├── 窃取 Cookie → 会话劫持
├── 键盘记录
├── 钓鱼表单注入
├── 重定向到恶意网站
├── 网页截图
└── 浏览器漏洞利用
```

### 2.2 XSS 防御

```
XSS 防御防线：

1. 输出编码 ← 最重要！
   HTML 上下文：< → &lt;   > → &gt;   " → &quot;
   JS 上下文：使用 \xHH 编码
   URL 上下文：使用 %HH 编码

2. 内容安全策略 (CSP)
   Content-Security-Policy: default-src 'self';
       script-src 'self' 'nonce-random123';
   → 只允许从白名单来源加载脚本

3. HttpOnly Cookie
   Set-Cookie: sessionid=abc; HttpOnly
   → Cookie 无法被 JavaScript 访问 → 防 Cookie 窃取

4. 输入验证
   ├── 白名单：只允许已知安全的输入
   └── 对 HTML 标签使用富文本过滤 (如 DOMPurify)
```

---

## 三、CSRF 跨站请求伪造

### 3.1 CSRF 原理

```
CSRF (Cross-Site Request Forgery) =

攻击者诱导用户在已登录的网站 A 上执行非预期的操作

攻击场景：
1. 用户登录了 bank.com (Cookie 中存有会话)
2. 用户在另一个标签页访问了 evil.com
3. evil.com 的页面中有一个隐藏的表单/图片：
   <img src="https://bank.com/transfer?to=attacker&amount=10000">
4. 浏览器自动携带 bank.com 的 Cookie → 请求被认证通过！
5. 攻击成功：用户不知不觉间完成了转账

CSRF 的条件：
├── 用户已登录目标站点（Cookie 有效）
├── 目标站点对请求的验证仅依赖 Cookie
└── 攻击者能够构造触发目标操作的有效请求
```

### 3.2 CSRF 防御

```
CSRF 防御策略：

1. CSRF Token ← 最常用
   ├── 服务器生成一个随机 Token
   ├── 嵌入表单（隐藏字段）或请求头
   ├── 提交时服务端验证 Token
   └── 攻击者无法获取这个随机Token → 攻击失败

2. SameSite Cookie
   Set-Cookie: session=abc; SameSite=Strict
   ├── Strict：完全禁止跨站发送 Cookie
   ├── Lax：仅允许顶级导航（GET请求链接点击）
   └── None：允许跨站（需要同时设置 Secure）

3. 验证 Referer/Origin 请求头
   ├── 检查请求来源是否可信
   └── 注意：Referer 可以被篡改或缺失

4. 二次确认
   └── 敏感操作前要求输入密码/MFA
```

---

## 四、缓冲区溢出

### 4.1 原理

```
缓冲区溢出 (Buffer Overflow) =

向固定大小的缓冲区写入超过其容量的数据，
导致溢出的数据覆盖相邻内存区域。

经典 C 代码示例：
char buffer[8];
gets(buffer);  // 不检查输入长度！

如果用户输入 "AAAAAAAABBBBBBBB"
buffer 的8字节空间不够 → 溢出数据覆盖了返回地址
→ 返回地址被改写为攻击者指定的值
→ 程序"返回"到攻击者的恶意代码

内存布局：
低地址                         高地址
[buffer 8字节][EBP][返回地址][函数参数]
     ↑
输入超过8字节 → 覆盖 EBP 和返回地址
```

### 4.2 利用与防御

```
缓冲区溢出的利用：
├── 覆盖返回地址 → 跳转到 shellcode
├── Shellcode = 一小段机器码（通常 spawn shell）
└── "给攻击者一个命令行"

防御机制：

1. 栈不可执行 (DEP/NX)
   ├── 标记栈内存为"不可执行"
   └── 防御：shellcode 无法在栈上执行
   绕过：ROP (Return-Oriented Programming)

2. 地址空间随机化 (ASLR)
   ├── 每次程序启动时随机化内存地址布局
   ├── 攻击者无法预测 shellcode 应该跳到哪里
   └── 防御：精确地址不可预测

3. 栈金丝雀 (Stack Canary)
   ├── 在返回地址前放一个随机值
   ├── 返回前检查值是否改变
   └── → 改变了 = 检测到溢出 → 终止程序

4. SafeSEH (Windows)
   └── 验证异常处理链的完整性

5. 安全编程
   ├── 使用 safe 函数 (strncpy 替代 strcpy)
   ├── 边界检查
   └── 使用内存安全语言 (Rust/Go/Java)
```

### 4.3 其他溢出类型

```
整数溢出 (Integer Overflow)
├── int 最大值 2,147,483,647 + 1 = -2,147,483,648
├── 可能导致分配过小的缓冲区 → 后续溢出
└── 例：n = user_input; malloc(n * sizeof(element));

堆溢出 (Heap Overflow)
├── 动态分配的内存区域溢出
└── 比栈溢出更难利用，但同样危险

格式化字符串漏洞 (Format String)
├── printf(user_input);
├── 恶意输入：%x %x %x %s → 读取栈上数据
└── 输入：%n → 向任意地址写入
```

---

## 五、文件上传与目录遍历

### 5.1 文件上传漏洞

```
原理：未对上传文件做充分验证 → 攻击者上传恶意脚本

攻击步骤：
1. 攻击者上传 webshell.php (内容为 <?php system($_GET['cmd']); ?>)
2. 通过 Web 访问该文件：/uploads/webshell.php?cmd=whoami
3. → 服务器执行系统命令！

防御措施：
├── 文件类型白名单（只允许已知安全的扩展名）
│   允许：.jpg .png .pdf
│   禁止：.php .jsp .asp .exe .sh
├── 检查文件内容（魔术字节），不仅看扩展名
├── 上传目录禁止脚本执行
│   Apache：移除该目录的 ExecCGI 和 PHP Handler
├── 文件重命名（随机文件名，去掉原始扩展名）
├── 文件大小限制
└── 病毒扫描
```

### 5.2 目录遍历

```
原理：通过 ../ 突破 Web 目录限制，访问系统任意文件

攻击示例：
正常路径：/download?file=report.pdf
实际路径：/var/www/files/report.pdf

恶意路径：/download?file=../../../../etc/passwd
实际路径：/var/www/files/../../../../etc/passwd
         = /etc/passwd → 读取到系统密码文件！

防御：
├── 规范化路径后检查是否在允许的目录内
├── 过滤 ../ 或使用白名单文件名
├── 使用 chroot / 容器隔离文件系统
└── 应用以最小权限运行（如 www-data）
```

---

## 六、认证与会话安全

### 6.1 常见认证漏洞

```
1. 弱密码 (Weak Password)
   ├── 用户使用常见密码/默认密码
   └── 防御：密码强度策略 + 密码泄露检测

2. 暴力破解 (Brute Force)
   ├── 无限次尝试登录
   ├── 防御：账户锁定/延迟/验证码
   └── 注意：锁定策略可能被用于 DoS

3. 用户名枚举 (Username Enumeration)
   ├── 登录失败时"用户名不存在" vs "密码错误"
       → 攻击者可以枚举有效用户名
   └── 防御：统一的错误消息 "用户名或密码错误"

4. 会话固定 (Session Fixation)
   ├── 攻击者为用户预设一个 Session ID
   ├── 用户登录后该 Session 获得认证状态
   └── 攻击者用预设的 Session ID → 以用户身份访问
   防御：登录成功后重新生成 Session ID

5. 会话超时不足
   ├── Session 永不过期 → 风险大
   └── 防御：合理的超时时间 (15-30分钟空闲)
```

---

## 七、CISP 考试要点速查

### 漏洞速查表

| 漏洞类型 | 核心特征 | 防御关键词 |
|----------|----------|-----------|
| SQL 注入 | 操纵后端数据库查询 | **参数化查询** |
| XSS (存储型) | 恶意脚本存储在服务器 | **输出编码 + CSP** |
| CSRF | 跨站伪造请求 | **CSRF Token** |
| 缓冲区溢出 | 写超缓冲区容量 | **DEP+ASLR+Canary** |
| 命令注入 | 注入系统命令 | 白名单 + 避免拼接 |
| 文件上传 | 上传恶意脚本 | **文件类型白名单** |
| 目录遍历 | ../ 突破路径限制 | 路径规范化 |

### 常见考试陷阱

1. ~~参数化查询只能防 SQL 注入~~ → 它是最有效的方法，但不能解决所有注入（如命令注入）
2. ~~HttpOnly 防 XSS~~ → HttpOnly 只防 Cookie 被窃取，不防 XSS 本身
3. ~~有防火墙就不用防注入~~ → WAF 是补偿控制，不能替代安全编码
4. ~~ASLR 完全防溢出~~ → ROP 可以绕过（需要 DEP 配合）
5. ~~SQL 注入 = 联合查询~~ → 有多种类型，盲注同样是 SQL 注入

### 自检清单

- [ ] 理解 SQL 注入的原理和参数化查询防御
- [ ] 区分三种 XSS（反射/存储/DOM）
- [ ] 掌握 CSRF 的原理和 Token 防御
- [ ] 了解缓冲区溢出的三种防御机制
- [ ] 知道文件上传的安全防御措施
- [ ] 理解会话固定攻击的原理

---

> 💡 **本章小结**：常见漏洞类型是 CISP 技术域考试的重中之重。SQL 注入（参数化查询）、XSS（输出编码）、CSRF（Token）是三大必考漏洞。缓冲区溢出的 DEP/ASLR/Canary 三层防御机制是经典考点。对于每种漏洞，都要能说出"原理→危害→防御"三点。
