# Day 1：CTF概述与F12网络面板深度拆解

> **学习目标**：掌握CTF基本概念，熟练使用浏览器开发者工具分析HTTP请求
> 
> **学习时长**：2-3小时
> 
> **难度等级**：⭐⭐

---

## 📚 今日内容概览

1. CTF竞赛基本概念
2. CTF三大赛制详解
3. CTF五大方向介绍
4. 浏览器F12开发者工具
5. 网络面板深度使用
6. HTTP请求结构分析
7. 实战练习：CTFHub HTTP协议

---

## 一、CTF竞赛基本概念

### 1.1 什么是CTF

```
CTF (Capture The Flag) = 夺旗赛

核心理念：在模拟环境中解决安全挑战，获取"Flag"作为解题凭证

Flag格式：
  - flag{xxx}
  - FLAG{xxx}
  - ctf{xxx}
  - hctf{xxx}（比赛缩写前缀）
  
示例：
  flag{w3lc0me_t0_ctf_w0rld}
  FLAG{sql_1nj3ct10n_m4st3r}
```

### 1.2 CTF的起源与发展

```
起源：
  - 1996年：DEF CON 4首次举办CTF
  - 最初是物理夺旗游戏的数字化版本
  - 目的：培养网络安全人才

发展历程：
  - 1996-2000：萌芽期，DEF CON为主
  - 2000-2010：成长期，各大安全会议开始举办
  - 2010-2020：爆发期，全球赛事数量激增
  - 2020-至今：成熟期，职业化、商业化

中国CTF发展：
  - 2012年：首届全国大学生信息安全竞赛
  - 2015年：CTF在国内开始流行
  - 2018年：各类CTF平台大量涌现
  - 现在：已成为安全人才选拔标准之一
```

### 1.3 CTF的价值与意义

```
对个人的价值：
  ✅ 系统学习网络安全知识
  ✅ 提升实战攻防能力
  ✅ 积累项目经验
  ✅ 获得行业认可
  ✅ 拓展人脉圈子
  ✅ 获得奖金和荣誉

对企业的价值：
  ✅ 选拔安全人才
  ✅ 评估技术能力
  ✅ 培养安全意识
  ✅ 提升团队水平

对行业的价值：
  ✅ 推动安全技术发展
  ✅ 培养安全人才
  ✅ 促进技术交流
  ✅ 提升整体安全水平
```

---

## 二、CTF三大赛制详解

### 2.1 Jeopardy（解题模式）

```
定义：
  各方向独立解题，提交Flag得分

特点：
  - 最常见的CTF赛制
  - 门槛较低，适合新手
  - 题目分类清晰
  - 可以选择擅长方向

题目类型：
  - Web：Web安全漏洞
  - Pwn：二进制漏洞利用
  - Reverse：逆向工程
  - Crypto：密码学
  - Misc：杂项

计分方式：
  - 静态分值：题目固定分数
  - 动态分值：解出人数越多分越低
  
排名规则：
  - 总分优先
  - 同分看最后一题提交时间

代表比赛：
  - DEF CON CTF Qualifier
  - 全国大学生信息安全竞赛
  - 强网杯
  - XNUCA
```

### 2.2 AWD（攻防模式）

```
定义：
  Attack with Defense
  每队维护服务器，攻击别人+修补自己

特点：
  - 对抗性强
  - 模拟真实攻防
  - 考验综合能力
  - 需要团队配合

比赛流程：
  1. 每队获得相同的服务器环境
  2. 服务运行着有漏洞的服务
  3. 攻击其他队伍获取Flag
  4. 修补自己服务器的漏洞
  5. 被攻击会扣分，攻击成功加分

计分方式：
  - 攻击分：成功攻击其他队伍
  - 防御分：成功防御攻击
  - 服务分：服务正常运行
  
核心技能：
  - 漏洞挖掘
  - 漏洞利用
  - 漏洞修补
  - 日志分析
  - 流量分析

代表比赛：
  - DEF CON CTF Finals
  - 强网杯线下赛
  - 护网行动
```

### 2.3 King of the Hill

```
定义：
  抢占并维护"山头"，持续控制得分

特点：
  - 持久对抗
  - 资源争夺
  - 策略性强
  - 高级别赛事

比赛流程：
  1. 多个"山头"（服务器）
  2. 攻占山头获取控制权
  3. 维持控制时间越长得分越多
  4. 其他队伍可以抢夺控制权

计分方式：
  - 控制时间
  - 控制数量
  - 防御成功次数

代表比赛：
  - KOTH类型的CTF
  - 部分高级别赛事
```

### 2.4 三大赛制对比

| 赛制 | 难度 | 团队要求 | 技术广度 | 实战性 |
|:---|:---:|:---:|:---:|:---:|
| Jeopardy | ⭐⭐ | 低 | 高 | ⭐⭐ |
| AWD | ⭐⭐⭐⭐ | 高 | 高 | ⭐⭐⭐⭐⭐ |
| King of the Hill | ⭐⭐⭐⭐⭐ | 高 | 中 | ⭐⭐⭐⭐ |

---

## 三、CTF五大方向介绍

### 3.1 Web安全

```
定义：
  针对Web应用程序的安全漏洞进行攻击和防御

核心内容：
  - HTTP协议
  - SQL注入
  - XSS跨站脚本
  - CSRF跨站请求伪造
  - 文件上传漏洞
  - 文件包含漏洞
  - 命令执行
  - SSRF服务器端请求伪造
  - XXE外部实体注入
  - SSTI模板注入
  - 反序列化漏洞

技能要求：
  - HTTP协议理解
  - Web开发基础（HTML/CSS/JS/PHP/Python）
  - 数据库知识
  - Burp Suite使用
  - 常见漏洞原理

难度评估：
  入门：⭐⭐
  进阶：⭐⭐⭐
  高级：⭐⭐⭐⭐

工具依赖：
  - Burp Suite
  - 浏览器开发者工具
  - SQLMap
  - Dirsearch
  - Nmap
```

### 3.2 Pwn（二进制安全）

```
定义：
  针对二进制程序的漏洞进行利用

核心内容：
  - 栈溢出
  - 堆溢出
  - 格式化字符串漏洞
  - ROP链构造
  - 堆利用技术
  - 内核漏洞利用
  - 沙箱逃逸

技能要求：
  - C/C++编程
  - 汇编语言（x86/x64）
  - 操作系统原理
  - 内存管理机制
  - GDB调试
  - pwntools使用

难度评估：
  入门：⭐⭐⭐⭐
  进阶：⭐⭐⭐⭐⭐
  高级：⭐⭐⭐⭐⭐⭐

工具依赖：
  - GDB + pwndbg/peda
  - pwntools
  - ROPgadget
  - one_gadget
  - IDA Pro/Ghidra
```

### 3.3 Reverse（逆向工程）

```
定义：
  分析程序逻辑，破解保护机制

核心内容：
  - 静态分析
  - 动态调试
  - 脱壳技术
  - 反混淆
  - 算法识别
  - 协议分析
  - 游戏逆向

技能要求：
  - 汇编语言
  - C/C++编程
  - PE/ELF文件格式
  - 加密算法
  - 反调试技术

难度评估：
  入门：⭐⭐⭐
  进阶：⭐⭐⭐⭐
  高级：⭐⭐⭐⭐⭐

工具依赖：
  - IDA Pro
  - Ghidra
  - x64dbg/OllyDbg
  - Cheat Engine
  - APKTool/JADX
```

### 3.4 Crypto（密码学）

```
定义：
  破解或绕过加密机制

核心内容：
  - 古典密码
  - 对称加密
  - 非对称加密
  - 哈希函数
  - 数字签名
  - 编码解码
  - 数学问题

技能要求：
  - 数论基础
  - 概率统计
  - Python编程
  - 密码学原理
  - 数学工具使用

难度评估：
  入门：⭐⭐⭐
  进阶：⭐⭐⭐⭐
  高级：⭐⭐⭐⭐⭐

工具依赖：
  - Python
  - SageMath
  - OpenSSL
  - CyberChef
  - RsaCtfTool
```

### 3.5 Misc（杂项）

```
定义：
  各种非典型安全挑战

核心内容：
  - 隐写术
  - 流量分析
  - 取证分析
  - 编程题
  - OSINT
  - 区块链安全
  - IoT安全

技能要求：
  - 编程能力
  - 工具使用
  - 信息搜集
  - 逻辑思维
  - 广泛的知识面

难度评估：
  入门：⭐⭐
  进阶：⭐⭐⭐
  高级：⭐⭐⭐⭐

工具依赖：
  - Wireshark
  - Stegsolve
  - 010 Editor
  - Audacity
  - Binwalk
  - Volatility
```

### 3.6 五大方向对比

| 方向 | 入门难度 | 工具依赖 | 数学要求 | 编程要求 | 就业前景 |
|:---|:---:|:---:|:---:|:---:|:---:|
| Web | ⭐⭐ | 中 | 低 | 中 | ⭐⭐⭐⭐⭐ |
| Pwn | ⭐⭐⭐⭐ | 高 | 中 | 高 | ⭐⭐⭐⭐ |
| Reverse | ⭐⭐⭐ | 高 | 中 | 高 | ⭐⭐⭐⭐ |
| Crypto | ⭐⭐⭐ | 中 | 高 | 中 | ⭐⭐⭐ |
| Misc | ⭐⭐ | 中 | 低 | 中 | ⭐⭐⭐ |

---

## 四、浏览器F12开发者工具

### 4.1 开发者工具概述

```
什么是开发者工具：
  浏览器内置的调试和分析工具
  用于查看和修改网页内容

打开方式：
  - F12快捷键
  - Ctrl+Shift+I
  - 右键→检查
  - 菜单→更多工具→开发者工具

支持浏览器：
  - Chrome（推荐）
  - Firefox
  - Edge
  - Safari
```

### 4.2 开发者工具面板介绍

```
元素面板（Elements）：
  - 查看和修改HTML结构
  - 查看和修改CSS样式
  - 实时预览修改效果

控制台面板（Console）：
  - 执行JavaScript代码
  - 查看日志输出
  - 调试JavaScript

源代码面板（Sources）：
  - 查看网页源代码
  - 设置断点调试
  - 查看加载的资源

网络面板（Network）：
  - 查看所有网络请求
  - 分析请求和响应
  - 查看资源加载时间

应用面板（Application）：
  - 查看存储数据
  - 管理Cookie
  - 查看本地存储

安全面板（Security）：
  - 查看证书信息
  - 检查HTTPS状态
```

### 4.3 网络面板详解

```
网络面板功能：
  1. 查看所有HTTP请求
  2. 分析请求头和响应头
  3. 查看请求体和响应体
  4. 分析请求时间
  5. 过滤和搜索请求

关键设置：
  - Preserve log：保留日志（跳转后不清空）
  - Disable cache：禁用缓存
  - Offline：离线模式
  - Throttling：网络限速

请求列表字段：
  - Name：请求名称
  - Status：状态码
  - Type：资源类型
  - Initiator：发起者
  - Size：大小
  - Time：耗时
  - Waterfall：时间线

请求详情标签：
  - Headers：请求头和响应头
  - Preview：预览响应内容
  - Response：原始响应内容
  - Timing：请求时间分析
```

### 4.4 网络面板在CTF中的应用

```
应用场景：
  1. 分析HTTP请求方法
  2. 查看和修改请求头
  3. 分析Cookie
  4. 查看响应内容
  5. 发现隐藏接口
  6. 分析AJAX请求

常见操作：
  - 查看请求URL
  - 修改请求参数
  - 添加自定义请求头
  - 修改Cookie值
  - 重放请求
  - 复制为cURL命令

技巧：
  - 使用过滤器快速定位请求
  - 使用搜索功能查找关键字
  - 勾选Preserve log防止跳转丢失
  - 使用Copy as fetch快速构造请求
```

---

## 五、HTTP请求结构分析

### 5.1 HTTP协议基础

```
HTTP (HyperText Transfer Protocol)：
  超文本传输协议
  用于Web浏览器和服务器之间的通信

特点：
  - 无状态协议
  - 基于TCP/IP
  - 默认端口80
  - HTTPS默认端口443

版本：
  - HTTP/1.0：每次请求建立新连接
  - HTTP/1.1：持久连接，管道化
  - HTTP/2：多路复用，头部压缩
  - HTTP/3：基于QUIC，更快速
```

### 5.2 HTTP请求结构

```
请求行：
  方法 URL 协议版本
  GET /index.html HTTP/1.1

请求头：
  Host: www.example.com
  User-Agent: Mozilla/5.0
  Accept: text/html
  Cookie: session=abc123
  Content-Type: application/x-www-form-urlencoded

请求体：
  POST请求才有请求体
  key1=value1&key2=value2

完整示例：
  POST /login HTTP/1.1
  Host: ctf.example.com
  Content-Type: application/x-www-form-urlencoded
  Content-Length: 27
  
  username=admin&password=123
```

### 5.3 HTTP请求方法

```
GET：
  - 获取资源
  - 参数在URL中
  - 有长度限制
  - 可被缓存

POST：
  - 提交数据
  - 参数在请求体中
  - 无长度限制
  - 不可缓存

PUT：
  - 更新资源
  - 幂等操作

DELETE：
  - 删除资源
  - 幂等操作

HEAD：
  - 只获取响应头
  - 不获取响应体

OPTIONS：
  - 查询支持的HTTP方法

PATCH：
  - 部分更新资源

TRACE：
  - 回显服务器收到的请求

CONNECT：
  - 建立隧道连接
```

### 5.4 常见请求头

```
Host：
  目标服务器域名
  Host: www.example.com

User-Agent：
  客户端标识
  User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)

Accept：
  可接受的响应内容类型
  Accept: text/html,application/xhtml+xml

Accept-Language：
  可接受的语言
  Accept-Language: zh-CN,zh;q=0.9

Accept-Encoding：
  可接受的编码方式
  Accept-Encoding: gzip, deflate

Content-Type：
  请求体类型
  Content-Type: application/x-www-form-urlencoded
  Content-Type: application/json
  Content-Type: multipart/form-data

Content-Length：
  请求体长度
  Content-Length: 42

Cookie：
  发送Cookie
  Cookie: session=abc123; token=xyz789

Referer：
  请求来源页面
  Referer: https://www.google.com/

Authorization：
  认证信息
  Authorization: Basic YWRtaW46MTIzNDU2

X-Forwarded-For：
  客户端真实IP
  X-Forwarded-For: 192.168.1.100
```

### 5.5 HTTP响应结构

```
状态行：
  协议版本 状态码 状态描述
  HTTP/1.1 200 OK

响应头：
  Server: Apache/2.4.41
  Content-Type: text/html; charset=UTF-8
  Content-Length: 1234
  Set-Cookie: session=abc123
  Location: /redirect

响应体：
  <!DOCTYPE html>
  <html>
  <head><title>CTF</title></head>
  <body>...</body>
  </html>
```

### 5.6 常见状态码

```
2xx 成功：
  200 OK：请求成功
  201 Created：资源创建成功
  204 No Content：成功但无内容

3xx 重定向：
  301 Moved Permanently：永久重定向
  302 Found：临时重定向
  304 Not Modified：资源未修改
  307 Temporary Redirect：临时重定向

4xx 客户端错误：
  400 Bad Request：请求格式错误
  401 Unauthorized：未认证
  403 Forbidden：禁止访问
  404 Not Found：资源不存在
  405 Method Not Allowed：方法不允许
  429 Too Many Requests：请求过多

5xx 服务器错误：
  500 Internal Server Error：服务器内部错误
  502 Bad Gateway：网关错误
  503 Service Unavailable：服务不可用
  504 Gateway Timeout：网关超时
```

---

## 六、实战练习：CTFHub HTTP协议

### 6.1 CTFHub平台介绍

```
CTFHub：
  - CTF学习平台
  - 提供技能训练
  - 题目分类清晰
  - 适合新手入门

访问地址：
  https://www.ctfhub.com

HTTP协议模块：
  - 请求方式
  - 302跳转
  - Cookie
  - 消息头
  - 响应包源代码
  - 重定向
  - 基础认证
  - 响应头
```

### 6.2 练习1：请求方式

```
题目描述：
  HTTP请求方式有GET、POST等，本题要求使用特定请求方式

解题步骤：
  1. 打开CTFHub「HTTP协议-请求方式」
  2. F12打开开发者工具
  3. 切换到Network面板
  4. 刷新页面，查看请求
  5. 分析请求方法和响应

F12操作：
  1. F12→Network
  2. 勾选"Preserve log"
  3. 刷新页面
  4. 点击第一个请求
  5. 查看Headers标签

关键发现：
  - Request Method: GET
  - Status Code: 200

进阶操作：
  1. 右键请求→Copy→Copy as fetch
  2. 在Console中粘贴
  3. 修改method为POST
  4. 执行获取Flag
```

### 6.3 练习2：302跳转

```
题目描述：
  HTTP 302状态码表示临时重定向

解题步骤：
  1. 打开CTFHub「HTTP协议-302跳转」
  2. F12打开开发者工具
  3. Network面板勾选"Preserve log"（重要！）
  4. 刷新页面
  5. 观察请求序列

关键发现：
  - 第一个请求：302 Found
  - Location响应头指向新地址
  - 浏览器自动跳转

获取Flag：
  - 查看302响应的响应头
  - Flag可能在Location中
  - 或在响应体中

注意：
  如果不勾选"Preserve log"，跳转后请求会丢失
```

### 6.4 练习3：Cookie

```
题目描述：
  Cookie用于维持会话状态

解题步骤：
  1. 打开CTFHub「HTTP协议-Cookie」
  2. F12打开开发者工具
  3. Application面板→Cookies
  4. 查看当前Cookie值

分析Cookie：
  Name: admin
  Value: 0
  
修改Cookie：
  1. 双击Value值
  2. 将0改为1
  3. 刷新页面
  4. 获取Flag

F12操作路径：
  F12→Application→Storage→Cookies→选择域名
```

### 6.5 练习4：User-Agent

```
题目描述：
  User-Agent标识客户端类型

解题步骤：
  1. 打开CTFHub「HTTP协议-User-Agent」
  2. F12打开开发者工具
  3. Network面板查看请求头
  4. 找到User-Agent字段

常见User-Agent：
  PC Chrome:
  Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
  
  iPhone:
  Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)
  
  Android:
  Mozilla/5.0 (Linux; Android 10; SM-G981B)

修改方法：
  1. Console面板执行fetch
  2. 添加headers参数
  3. 设置User-Agent为新值

示例代码：
  fetch('/api', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
    }
  })
```

### 6.6 练习5：Referer

```
题目描述：
  Referer表示请求来源

解题步骤：
  1. 打开CTFHub「HTTP协议-Referer」
  2. 分析题目要求
  3. 修改Referer值

常见场景：
  - 防盗链：要求Referer来自特定域名
  - 来源验证：要求从特定页面跳转

修改方法：
  fetch('/api', {
    headers: {
      'Referer': 'https://www.google.com/'
    }
  })

注意事项：
  - Referer拼写正确（不是Referrer）
  - URL格式完整（包含协议）
```

---

## 七、今日总结

### 7.1 知识点回顾

```
✅ CTF基本概念
  - CTF定义和Flag格式
  - CTF的价值和意义

✅ CTF三大赛制
  - Jeopardy解题模式
  - AWD攻防模式
  - King of the Hill

✅ CTF五大方向
  - Web安全
  - Pwn二进制
  - Reverse逆向
  - Crypto密码学
  - Misc杂项

✅ 浏览器开发者工具
  - 各面板功能
  - 网络面板详解

✅ HTTP协议基础
  - 请求结构
  - 响应结构
  - 常见状态码
  - 常见请求头

✅ CTFHub实战练习
  - 请求方式
  - 302跳转
  - Cookie修改
  - User-Agent修改
  - Referer修改
```

### 7.2 今日作业

```
必做题：
  1. 完成CTFHub「HTTP协议」模块全部题目
  2. 截图每个请求的Headers
  3. 标注出Host、User-Agent、Referer字段

选做题：
  1. 使用Console的fetch API重放请求
  2. 尝试修改不同的请求头观察效果
  3. 整理常见状态码含义

提交内容：
  - 截图文件（PNG格式）
  - 学习笔记（Markdown格式）
```

### 7.3 明日预告

```
Day 2：GET与POST手搓战

学习内容：
  - GET和POST的区别
  - 使用F12修改请求方法
  - 使用fetch API构造请求
  - CTFHub POST请求题目

准备工作：
  - 复习HTTP请求方法
  - 了解fetch API基础
```

---

## 八、扩展阅读

### 8.1 CTF赛事推荐

```
国际赛事：
  - DEF CON CTF
  - HITCON CTF
  - PlaidCTF
  - 0CTF
  - TokyoWesterns CTF

国内赛事：
  - 全国大学生信息安全竞赛
  - 强网杯
  - 网鼎杯
  - XNUCA
  - 红帽杯

练习平台：
  - CTFHub
  - BUUCTF
  - 攻防世界
  - Bugku
  - 实验吧
```

### 8.2 学习资源推荐

```
在线教程：
  - CTFHub技能树
  - CTF Wiki
  - 菜鸟教程HTTP章节

视频教程：
  - B站CTF入门教程
  - YouTube CTF教程

书籍推荐：
  - 《CTF竞赛权威指南》
  - 《Web安全深度剖析》
  - 《白帽子讲Web安全》

社区论坛：
  - 先知社区
  - 看雪论坛
  - 吾爱破解
  - FreeBuf
```

### 8.3 常用工具下载

```
浏览器：
  - Chrome: https://www.google.com/chrome/
  - Firefox: https://www.mozilla.org/firefox/

抓包工具：
  - Burp Suite: https://portswigger.net/burp
  - Fiddler: https://www.telerik.com/fiddler

编码解码：
  - CyberChef: https://gchq.github.io/CyberChef/
  - Base64 Decode: https://www.base64decode.org/

在线工具：
  - HTTP在线测试: https://httpbin.org/
  - 正则表达式测试: https://regex101.com/
```

---

## 九、常见问题FAQ

### Q1: CTF难学吗？

```
回答：
  CTF有一定学习曲线，但并非不可逾越。
  
建议：
  1. 从Web和Misc方向入门
  2. 每天坚持练习
  3. 多看WriteUp
  4. 加入学习社群

时间估计：
  - 入门：1-2个月
  - 进阶：3-6个月
  - 精通：1年以上
```

### Q2: 需要什么基础？

```
回答：
  不同方向要求不同。

基础要求：
  Web方向：
    - HTTP协议基础
    - HTML/CSS/JavaScript
    - 基本编程能力
    
  Pwn方向：
    - C/C++编程
    - 汇编语言
    - 操作系统原理
    
  Crypto方向：
    - 数学基础
    - Python编程
    
  Reverse方向：
    - 汇编语言
    - C/C++编程
    
  Misc方向：
    - 编程能力
    - 工具使用
```

### Q3: 如何选择主攻方向？

```
回答：
  建议先尝试所有方向，找到感兴趣的。

选择标准：
  1. 兴趣：最感兴趣的方向
  2. 天赋：学得最快的方向
  3. 就业：市场需求大的方向
  4. 资源：学习资源多的方向

推荐路径：
  1. 先学Web和Misc入门
  2. 尝试所有方向
  3. 选择1-2个主攻方向
  4. 其他方向保持了解
```

### Q4: F12抓不到包怎么办？

```
回答：
  可能原因和解决方案：

1. 请求太快：
   - 勾选"Preserve log"
   - 使用Ctrl+F5强制刷新

2. HTTPS证书问题：
   - 安装Burp CA证书
   - 或使用F12即可

3. WebSocket请求：
   - 查看WS标签
   - 不是HTTP请求

4. 被过滤：
   - 检查过滤器设置
   - 选择"All"显示全部
```

### Q5: 如何提高解题速度？

```
回答：
  速度来自熟练度和经验积累。

提高方法：
  1. 多刷题：量变引起质变
  2. 整理笔记：建立知识库
  3. 复盘总结：分析解题思路
  4. 学习技巧：掌握快捷操作
  5. 工具熟练：提高操作效率

时间目标：
  - 入门题：5-10分钟
  - 简单题：10-20分钟
  - 中等题：30-60分钟
  - 困难题：1-2小时
```

---

## 十、笔记模板

```
Day 1 学习笔记
====================

日期：____年__月__日
学习时长：___小时

一、知识点总结
--------------
1. CTF定义：
   
2. 三大赛制：
   
3. 五大方向：
   
4. HTTP请求结构：
   

二、练习记录
------------
题目1：请求方式
  - 解题思路：
  - 关键步骤：
  - Flag：

题目2：302跳转
  - 解题思路：
  - 关键步骤：
  - Flag：


三、遇到的问题
--------------
问题1：
  解决方法：

问题2：
  解决方法：


四、明日计划
------------
1. 
2. 
3. 


五、自我评价
------------
理解程度：⭐⭐⭐⭐⭐
动手能力：⭐⭐⭐⭐⭐
完成情况：⭐⭐⭐⭐⭐
```

---

**恭喜你完成Day 1的学习！明天继续加油！** 🎉
