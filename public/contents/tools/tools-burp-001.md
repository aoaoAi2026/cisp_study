# Burp Suite 实战完全指南：Web 渗透的必备利器

> 分类：工具指南 | 难度：进阶 | 阅读时间：约60分钟

## 概述

Burp Suite 是 PortSwigger 公司开发的 Web 应用安全测试集成平台，被全球安全从业者视为 Web 渗透测试的事实标准工具。从流量拦截、请求修改、自动化扫描，到漏洞验证、会话分析、扩展开发，Burp Suite 覆盖了 Web 安全测试的全流程。无论是挖 SRC、做渗透测试、代码审计，还是 CTF 解题，掌握 Burp Suite 都是基本功。

**版本对比**：
- **社区版（Community）**：免费，包含 Proxy/Repeater/Decoder/Comparer/Sequencer + 限速 Intruder
- **专业版（Professional）**：收费（$449/年），增加不限速 Intruder/Active Scanner/Passive Scanner/Collaborator/REST API
- **企业版（Enterprise）**：CI/CD 集成的大规模持续扫描平台

## 核心知识点

- Proxy 代理拦截、流量路由与 HTTP 请求修改
- Repeater 请求重放与手工验证方法论
- Intruder 自动化爆破、参数 Fuzz 与 Payload 生成
- Scanner 自动化漏洞扫描（主动+被动）
- Decoder 编解码工具与 Comparer 请求对比
- Collaborator 带外数据交互检测（OAST）
- Sequencer 会话 Token 随机性分析
- Extender 扩展开发、BApp Store 与自定义插件
- Project Options 项目配置与测试范围管理

---

## 一、环境搭建与配置

### 1.1 安装

```bash
# 各平台通用：从官网下载 JAR 文件
# https://portswigger.net/burp/releases

# Linux/macOS 启动
java -jar -Xmx2g burpsuite_pro.jar

# Windows 启动
javaw -Xmx2g -jar burpsuite_pro.jar

# 内存优化建议
java -jar -Xmx4g -XX:MaxPermSize=256m burpsuite_pro.jar   # 大项目推荐 4GB
```

### 1.2 浏览器代理配置

**代理设置**：
- 代理地址：`127.0.0.1`
- 端口：`8080`（Burp 默认）
- HTTPS：需要导入 Burp 的 CA 证书

**证书导入步骤**：
```
1. 浏览器访问 http://burp
2. 点击 "CA Certificate" 下载 cacert.der
3. 浏览器设置 → 隐私与安全 → 证书管理 → 导入
4. Firefox 用户需在 Firefox 自己的证书管理器中导入（不使用系统证书）
5. Chrome/Edge 用户导入系统证书即可（Windows → certlm.msc）
```

### 1.3 浏览器插件推荐

| 插件 | 用途 |
|:---|:---|
| FoxyProxy | 快速切换代理开关 |
| Proxy SwitchyOmega | 按域名规则自动切换代理 |
| HackBar | 手工编码/解码测试 |

### 1.4 初始配置优化

```
User Options → Display → HTTP Message Display：
  - 勾选 "Line wrap"（长行自动换行）
  - 字体调整为等宽字体（如 Consolas/Monaco）

User Options → Misc → Hotkeys：
  - Send to Repeater: Ctrl+R（默认好用）
  - Send to Intruder: Ctrl+I
  - Send to Decoder: Ctrl+D

Project Options → HTTP → Redirections：
  - 设置为 "Always"（跟踪所有重定向）
```

---

## 二、Proxy 代理模块详解

### 2.1 Intercept（拦截）

Intercept 是渗透测试的起点。所有通过 Burp 代理的 HTTP(S) 请求都会被截获，允许手工修改后再放行。

```
操作流程：
1. 浏览器配置代理 → 127.0.0.1:8080
2. Burp → Proxy → Intercept → Intercept is on
3. 浏览器访问目标 → 请求出现在 Intercept 中
4. 分析/修改请求参数、Header、Body
5. Forward（放行）/ Drop（丢弃）
```

**快捷操作**：

| 按钮 | 功能 | 快捷键 |
|:---|:---|:---|
| Forward | 放行当前请求 | Ctrl+F |
| Drop | 丢弃当前请求 | - |
| Action → Do intercept → Response | 同时拦截响应 | - |
| Intercept is on/off | 开启/关闭拦截 | 点击按钮 |

**实战技巧**：
- 平时关掉 Intercept（不拦截），浏览器正常访问积累流量
- 需要测试特定请求时：先在 HTTP History 找到请求 → 右键 → "Add to scope" → 设置拦截规则仅拦截 scope 内域名
- 登录/注册/上传等关键操作时临时打开拦截

### 2.2 HTTP History（历史记录）

HTTP History 记录了所有经过代理的请求和响应，是数据分析的核心界面。

**关键过滤功能**：
```
Filter: 按请求类型、状态码、MIME 类型、搜索关键词过滤
Scope: 仅在 scope 内 vs 所有流量
搜索栏：支持正则表达式搜索请求/响应内容
```

```
# 过滤器设置建议
Show only in-scope items    → 业务测试时开启
Filter by MIME type          → 排除 CSS/JS/图片（减少噪音）
Filter by status code        → 4XX/5XX 重点关注
Filter by search term        → "password"/"token"/"admin"
```

### 2.3 WebSockets History

WebSocket 通信在现代 Web 应用中越来越常见（实时推送、在线聊天）。Burp 可拦截和重放 WebSocket 消息：

```
Proxy → WebSockets History → 查看所有 WebSocket 消息
右键 → Send to Repeater → 修改和重放
```

### 2.4 Proxy Options 精要设置

| 配置项 | 推荐设置 | 原因 |
|:---|:---|:---|
| Proxy Listeners → 127.0.0.1:8080 | 仅监听本地 | 避免被他人连接 |
| Intercept Client Requests | `AND URL Is in target scope` | 仅拦截目标范围 |
| Intercept Server Responses | 取消勾选 | 通常不需拦截响应 |
| Match and Replace | 自动修改 User-Agent | 伪装移动端/特定浏览器 |
| TLS Pass Through | 添加不需要拦截的域名 | 避免非目标流量干扰 |
| Response Modification | `Convert HTTPS links to HTTP` | 帮助发现隐藏链接 |

---

## 三、Repeater 手工测试核心

Repeater 是手工验证漏洞的核心工具，允许你反复修改并发送单个 HTTP 请求，观察每一次细微改动的响应差异。

### 3.1 基本操作

```
工作流：
1. 在 HTTP History/Proxy/Sitemap 中找到感兴趣的请求
2. 右键 → Send to Repeater（或 Ctrl+R）
3. 在 Repeater 中修改请求的任意部分：
   - 修改 URL 参数
   - 修改 POST Body
   - 修改 Cookie/Token/Header
   - 修改 HTTP 方法（GET↔POST↔PUT↔DELETE）
4. 点击 Send → 查看 Response
5. 反复调整参数，对比不同输入的响应差异
```

### 3.2 Repeater 高级功能

**多 Tab 并行测试**：
```
右键 → "Send to Repeater" 多次
每个 Tab 独立发送请求 → 对比分析
```

**请求历史**：
```
Repeater → 右上角 "History" 下拉 → 查看同一 Tab 的历史请求
使用 ↑ ↓ 箭头键快速切换历史请求
```

**自动跟踪重定向**：
```
Repeater Options → "Follow redirections"：
  - Never（默认）
  - On-site only（仅同站）
  - Always（始终跟踪）
```

**HTTP 方法快速切换**：
```
右键请求行 → "Change request method" → 自动在 GET/POST 间切换
```

**编码/解码**：
```
选中文本 → 右键 → Convert selection：
  - URL → URL-encode / URL-decode
  - HTML → HTML-encode / HTML-decode
  - Base64 → Base64-encode / Base64-decode
```

### 3.3 Repeater 实战技巧

**技巧1：快速构造测试用例**
```
原始请求：
GET /api/user?id=123 HTTP/1.1

修改为注入测试：
GET /api/user?id=123' HTTP/1.1
GET /api/user?id=123 OR 1=1 HTTP/1.1
GET /api/user?id=123;sleep(5) HTTP/1.1
```

**技巧2：越权测试**
```
获取管理员 Cookie 后：
1. 发送管理员请求 → 记录完整响应内容
2. 替换为普通用户 Cookie → 重新发送
3. 对比两次响应 → 判断是否存在越权
```

**技巧3：Multi-Tab 对比**
```
场景：测试 IDOR（不安全的直接对象引用）
Tab 1: GET /api/order/1001 （查看订单1001）
Tab 2: GET /api/order/1002 （尝试查看订单1002）
→ 如果 Tab 2 也返回成功 → 存在 IDOR 漏洞
```

### 3.4 Repeater 与 Comparer 联动

```
1. 在 Repeater 中发送两次请求（正常/异常参数）
2. 右键 Response → "Send to Comparer"
3. Comparer → 对比两个响应的差异
→ 快速定位异常点
```

---

## 四、Intruder 自动化攻击引擎

Intruder 是 Burp Suite 的自动化测试模块，支持暴力破解、参数 Fuzz、枚举遍历等多种攻击模式。

### 4.1 四种攻击类型详解

| 类型 | 工作方式 | 请求数 | 典型场景 |
|:---|:---|:---|:---|
| **Sniper** | 每个位置依次使用字典，每次只变一个位置 | positions × payloads | 单参数 Fuzz、单个参数遍历 |
| **Battering ram** | 所有位置同时使用同一个 Payload 值 | payloads | 两个字段需相同值（如用户名=密码）|
| **Pitchfork** | 各位置分别使用独立字典，一一对应 | min(len1, len2) | 用户名:密码配对（字典顺序对应）|
| **Cluster bomb** | 所有位置的全排列组合 | len1 × len2 | 多参数全排测试 |

### 4.2 Intruder 操作流程

```
步骤1：选择攻击位置
- 在 HTTP History/Proxy 中选择请求 → Send to Intruder (Ctrl+I)
- Intruder → Positions → 点击 "Clear §" 清除所有标记
- 选中需要爆破的参数值 → 点击 "Add §" 标记

步骤2：选择攻击类型
- Attack type 下拉：Sniper / Battering ram / Pitchfork / Cluster bomb

步骤3：配置 Payload
- Payloads 标签 → Payload set (选择对应的位置)
- Payload type: Simple list（常用）
- 粘贴 payload 列表或加载文件

步骤4：配置过滤和匹配
- Options → Grep - Match：标记关心的响应内容（如"登录成功"、"Welcome"）
- Options → Grep - Extract：自动提取响应中的关键字段

步骤5：启动攻击
- 点击 "Start attack"
- 分析结果表：按 Length/Status/Time 列排序，找异常响应
```

### 4.3 Payload 类型全览

| Payload 类型 | 说明 | 使用场景 |
|:---|:---|:---|
| Simple list | 预定义列表 | 弱口令、常见目录 |
| Runtime file | 运行时读文件 | 超大数据集 |
| Numbers | 数字序列 | ID 遍历、分页测试 |
| Dates | 日期序列 | Token 时间戳猜测 |
| Brute forcer | 字符集排列 | 短字符串穷举 |
| Null payloads | 空载荷 | 配合其他条件使用 |
| Character frobber | 逐字符修改 | Unicode/编码测试 |
| Bit flipper | 逐位翻转 | JWT/Cookie 篡改 |
| Username generator | 用户名字典生成 | 内网用户名猜测 |
| ECB block shuffler | 密码学攻击 | AES-ECB 解密测试 |
| Extension-generated | 扩展生成 | 自定义 Payload 逻辑 |
| Copy other payload | 复用其他位置 | 多位置同 Payload |

### 4.4 Intruder 资源池与限速

```
Intruder → Resource Pool：
- 最大并发请求数
- 请求延迟（固定/可变）
- 失败重试次数

建议：
- 自动化测试：10-20 并发 + 50ms 延迟
- 生产环境测试：1-3 并发 + 200-500ms 延迟
- 社区版注意限速（约每秒1个请求）
```

### 4.5 Intruder 实战场景

**场景1：弱口令爆破**
```
1. 拦截登录请求 → Send to Intruder
2. Positions: 标记 username 和 password 为 §payload§
3. Attack type: Cluster bomb
4. Payload set 1: 常见用户名 (admin/root/test)
5. Payload set 2: 弱口令字典 (password/123456/admin123)
6. Options → Grep-Match: 添加 "登录成功"/"Welcome"/"Dashboard"
7. Start attack → 按响应长度/内容筛选成功登录
```

**场景2：参数 Fuzz（发现隐藏参数）**
```
1. 在 GET 参数中标记位置
2. Attack type: Sniper
3. Payload: 
   - SQL 注入 Payload 列表
   - XSS Payload 列表
   - SSTI Payload 列表
   - 路径遍历 Payload 列表
4. 按响应长度/状态码变化 → 发现异常响应 → 手工验证
```

**场景3：验证码绕过测试**
```
1. 拦截含验证码的请求
2. Positions: 仅标记验证码值（或直接不标记验证码）
3. Attack type: Sniper
4. Payload: 固定值列表或 Null payloads（看服务器是否验证验证码）
```

**场景4：API 参数发现**
```
请求: /api/user?name=admin
修改为: /api/user?§name§=admin
Payloads: username,user,id,uid,email,pass,password,token,key,secret...
→ 测试不同参数名对应的响应
```

---

## 五、Scanner 自动化扫描（专业版）

### 5.1 主动扫描 vs 被动扫描

| 特性 | 主动扫描（Active） | 被动扫描（Passive） |
|:---|:---|:---|
| 发送额外请求 | ✅ 是 | ❌ 否 |
| 发现漏洞类型 | SQL注入、XSS、命令注入等 | 信息泄露、不安全Header、Cookie标志 |
| 对目标影响 | 可能修改数据/触发告警 | 完全无影响 |
| 扫描速度 | 较慢（大量请求） | 实时 |
| 适用环境 | 测试/预发布环境 | 所有环境（包括生产） |

### 5.2 扫描配置

```
Dashboard → "New Scan"

Scan details：
  - Scan type: Crawl and Audit（爬虫+审计）/ Audit only
  - URLs to scan: 输入列表或从文件导入
  - Protocol settings: HTTP/HTTPS

Scan configuration：
  - Crawl Optimization: Faster/Normal/More thorough
  - Audit Optimization: Faster/Normal/More thorough
  - 自定义扫描配置（可保存）

Application login：
  - 录制登录序列
  - 配置登录验证（检测登出条件）
```

### 5.3 扫描结果解读

| 严重等级 | 颜色 | 含义 | 处理建议 |
|:---|:---|:---|:---|
| High | 红色 | 高危漏洞 | 立即修复 |
| Medium | 橙色 | 中危漏洞 | 按计划修复 |
| Low | 蓝色 | 低危漏洞 | 可延后修复 |
| Information | 灰色 | 信息发现 | 辅助分析 |

每个漏洞报告包含：
- Issue background（漏洞背景）
- Remediation（修复建议）
- Evidence（证据：含请求/响应原文）
- References（参考资料）

---

## 六、辅助模块详细指南

### 6.1 Decoder（编解码器）

Decoder 支持多种编码格式的互转：

| 编码类型 | 说明 | 典型场景 |
|:---|:---|:---|
| URL | URL 编码/解码 | GET 参数处理 |
| HTML | HTML 实体编码/解码 | XSS Payload 处理 |
| Base64 | Base64 编码/解码 | JWT Token、Cookie、Basic Auth |
| Hex | 十六进制 | 二进制数据查看 |
| Gzip | 压缩/解压缩 | HTTP Response Body 解压 |
| ASCII Hex | ASCII 码十六进制转换 | 精确字符分析 |
| Construct SAML | SAML 参数构造 | SSO 测试 |

```
使用方式：
1. 从 Repeater/Proxy 选中数据 → Send to Decoder
2. 多次编码/解码（层级嵌套编码场景）
3. 生成校验和（MD5/SHA-1/SHA-256）
```

### 6.2 Comparer（比较器）

主要用于对比两个请求或响应的差异，寻找越权漏洞和细微变化：

```
使用场景：
- 普通用户 vs 管理员 → 相同API的响应差异 → 发现越权
- 空密码 vs 正确密码 → 响应时间差异 → 用户枚举
- 正常参数 vs 注入参数 → 响应变化 → 确认注入
- 两个版本的应用 → 差异分析

操作：选中两个消息 → 右键 → Send to Comparer → 查看高亮差异
```

### 6.3 Sequencer（会话分析器）

通过收集大量 Session Token/Cookie 来评估其随机性（熵值分析）：

```
使用场景：
- 评估登录后 Cookie 的随机性
- 分析 CSRF Token 的可预测性
- 验证密码重置 Token 的安全性
- 分析 API Token 的生成规律

操作：
1. 找到包含 Token 的响应 → Send to Sequencer
2. 设定样本数量（100-50000）
3. 启动 Live Capture
4. 查看分析结果：Overall result (Excellent/Good/Fair/Poor)
5. 详细查看：字符级分析、位级分析、FIPS 测试
```

### 6.4 Collaborator（带外交互检测）

Collaborator 是 Burp 专业版独有的带外数据（OAST）检测工具，用于发现无回显的漏洞：

```
检测的漏洞类型：
- SSRF（服务端请求伪造）
- XXE（XML 外部实体注入）
- Blind XSS（盲跨站脚本）
- 异步 SQL 注入
- 命令注入（DNS/HTTP 出网）
- 邮件头注入
- SSTI（服务端模板注入）

工作原理：
1. Burp 生成唯一的 Collaborator 子域名
2. 在疑似漏洞点注入 Collaborator URL
3. 如果目标服务器与 Collaborator 服务器发生交互
4. Collaborator 记录并报告（含来源IP、请求时间等）
```

**实战示例**：
```
# SSRF 检测
GET /api/fetch?url=http://xxxxx.burpcollaborator.net HTTP/1.1
→ 观察 Collaborator 是否收到 DNS/HTTP 请求

# XXE 检测
POST /api/xml HTTP/1.1
Content-Type: application/xml

<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://xxxxx.burpcollaborator.net/xxe">
]>
<data>&xxe;</data>
```

---

## 七、Target 域与站点地图

### 7.1 Scope（测试范围）

正确设置 Scope 是专业测试的第一步：

```
Target → Site map → 右键目标 → "Add to scope"

Scope 的重要性：
1. 仅拦截 Scope 内流量（减少干扰）
2. Scanner 仅扫描 Scope 内 URL
3. Sitemap 默认显示 Scope 内内容
4. 避免意外测试非授权系统

设置建议：
- 使用正则："^https?://.*\.target\.com$"
- 排除静态资源："^https?://.*\.target\.com/(images|css|js)/"
- 测试完成后彻底清除 Scope
```

### 7.2 Site Map（站点地图）

Sitemap 自动聚合所有经过代理的 URL，形成站点结构图：

```
Site map 内容：
- URL 树状结构
- 每个 URL 的请求/响应数量
- 已发现的漏洞标记
- 表单/登录识别
- 注释和用户可以自定义标记

实用操作：
- 右键 → "Scan this branch" → 扫描整个目录树
- 右键 → "Engagement tools" → 查找注释/脚本/引用
```

---

## 八、Project Options 与配置管理

### 8.1 关键配置项

| 配置区域 | 重要设置 | 说明 |
|:---|:---|:---|
| Connections → Upstream Proxy | 上游代理链 | 配合 SSRF/内网测试 |
| HTTP → Redirections | Always | 跟踪所有重定向 |
| HTTP → Streaming Responses | 启用 | 处理大响应/流式数据 |
| HTTP → HTTP/2 | 按需启用 | 测试 HTTP/2 服务 |
| Sessions → Session Handling | 自动刷新 Cookie | Session 过期自动重新登录 |
| Sessions → Macros | 录制操作序列 | 自动处理复杂认证 |
| Misc → Logging | 记录所有流量 | 审计和回溯分析 |

### 8.2 Session Handling（会话管理）

```
场景：Token 每小时过期，影响自动化扫描

解决：
1. Project Options → Sessions → Session Handling Rules → Add
2. Rule Actions → Add → "Run a macro"
3. 录制登录宏 → 自动重新登录获取新 Token
4. "Update current request with parameters matched from final macro response"
```

### 8.3 Match and Replace（匹配替换）

```
Proxy → Options → Match and Replace

常用规则：
- 替换 User-Agent 为移动端 → 测试移动 API
- 替换 Accept-Language → 测试多语言功能
- 移除/替换 Referer → 测试 CSRF 保护
- 添加自定义 Header → 测试 Header 注入
- 强制启用 Burp 的 "hidden form fields" 可见
```

---

## 九、Extender 扩展生态

### 9.1 BApp Store 推荐扩展

| 扩展名 | 功能 | 推荐度 |
|:---|:---|:---:|
| **Active Scan++** | 增强主动扫描能力 | ⭐⭐⭐⭐⭐ |
| **Autorize** | 自动越权测试 | ⭐⭐⭐⭐⭐ |
| **Turbo Intruder** | 高速 HTTP 攻击引擎 | ⭐⭐⭐⭐⭐ |
| **Logger++** | 增强日志记录 | ⭐⭐⭐⭐ |
| **JSON Web Tokens** | JWT 解析和攻击 | ⭐⭐⭐⭐⭐ |
| **Java Deserialization Scanner** | Java 反序列化漏洞检测 | ⭐⭐⭐⭐⭐ |
| **Backslash Powered Scanner** | 智能扫描增强 | ⭐⭐⭐⭐ |
| **CSRF Scanner** | CSRF 漏洞自动检测 | ⭐⭐⭐⭐ |
| **Retire.js** | JS 库漏洞检测 | ⭐⭐⭐⭐ |
| **Software Vulnerability Scanner** | 软件版本漏洞关联 | ⭐⭐⭐⭐ |
| **Param Miner** | 隐藏参数发现 | ⭐⭐⭐⭐⭐ |
| **HTTP Request Smuggler** | HTTP 请求走私检测 | ⭐⭐⭐⭐⭐ |
| **Reflected Parameters** | 反射参数识别 | ⭐⭐⭐⭐ |
| **Decoder Improved** | 增强版编解码器 | ⭐⭐⭐⭐ |
| **Upload Scanner** | 文件上传漏洞扫描 | ⭐⭐⭐⭐ |

### 9.2 Turbo Intruder 详解

Turbo Intruder 是 James Kettle 开发的替代 Intruder 的高速攻击引擎，使用 Python 编写攻击脚本：

```python
# Turbo Intruder 脚本示例：并发用户名枚举
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint,
                           concurrentConnections=10,
                           requestsPerConnection=100,
                           pipeline=True
                           )
    for user in open('users.txt'):
        engine.queue(target.req, user.strip())

def handleResponse(req, interesting):
    if 'Login successful' in req.response:
        table.add(req)
```

---

## 十、社区版 vs 专业版 vs 企业版

| 功能 | 社区版 | 专业版 | 企业版 |
|:---|:---:|:---:|:---:|
| Proxy/Repeater/Decoder | ✅ | ✅ | ✅ |
| Intruder（限速~1req/s） | ✅ | ✅ | ✅ |
| Intruder（不限速） | ❌ | ✅ | ✅ |
| Active Scanner | ❌ | ✅ | ✅ |
| Passive Scanner | ❌ | ✅ | ✅ |
| Collaborator | ❌ | ✅ | ✅ |
| REST API | ❌ | ✅ | ✅ |
| 保存/恢复项目 | ❌ | ✅ | ✅ |
| Scheduled Scans | ❌ | ❌ | ✅ |
| CI/CD Integration | ❌ | ❌ | ✅ |
| 多用户/角色管理 | ❌ | ❌ | ✅ |
| 价格 | 免费 | $449/年 | 按需定价 |

---

## 十一、实战场景

### 场景一：登录接口完整渗透测试

```
1. Proxy 拦截登录请求 → 分析参数和加密方式
2. Repeater 手工测试：
   - 修改密码参数 → 测试弱加密（Base64? MD5? 明文?）
   - 删除密码参数 → 测试空密码绕过
   - 修改用户ID → 测试任意用户登录
   - 测试 SQL 注入（' OR 1=1--）
   - 测试响应时间差 → 用户枚举
3. Intruder 自动化：
   - Cluster bomb: 用户名×密码 爆破
   - Sniper: 密码字典遍历（已知用户名）
4. Sequencer 分析 Cookie/Session 随机性
5. 查看响应头：Set-Cookie secure/httpOnly/ SameSite 标志
```

### 场景二：API 接口全面安全测试

```
1. Scope 设定 → 仅拦截 API 域名
2. 遍历所有端点 → 记录到 Site map
3. 对每个端点使用 Repeater 测试：
   - 缺少认证 Token → 未授权访问
   - 越权测试（修改资源 ID）
   - 输入验证（超长字符串、特殊字符）
   - HTTP 方法篡改（GET↔POST↔PUT↔DELETE）
4. JSON/XML 参数注入：
   - JSON: {"$gt":""}, {"$ne":""}
   - XML: XXE Payload
   - GraphQL: 内省查询
5. 批量 Intruder 测试：
   - 用 Cluster bomb 遍历用户ID + 操作
```

### 场景三：CTF 解题中的 Burp 使用

```
Web 题标准流程：
1. 浏览器开代理，全面访问站点 → 积累完整流量
2. HTTP History 搜索 "flag" / "admin" / "password"
3. 分析 Cookie/Token（可能包含有用信息）
4. Intruder 爆破登录/目录
5. Repeater 手工修改参数
6. 查看隐藏 HTML 注释（Burp 自动标记注释内容）
7. 如有文件上传 → 测试文件类型绕过
8. 响应的特殊 Header → X-* 自定义头可能含线索
```

---

## 十二、常见问题与排错

| 问题 | 可能原因 | 解决方案 |
|:---|:---|:---|
| 浏览器 HTTPS 报错 | 未导入 Burp CA 证书 | 访问 http://burp 下载并导入证书 |
| 特定域名无法访问 | 浏览器使用内置证书固定（Certificate Pinning）| Android/iOS 需绕过 SSL Pinning |
| Intruder 速度极慢 | 社区版限速 | 升级专业版或使用 Turbo Intruder |
| Scanner 无结果 | Scope 未正确设置 | 检查 Target → Scope |
| Burp 内存不足 | JVM 堆内存太小 | 启动时加 -Xmx4g 参数 |
| .exe 版本无法启动 | JRE 版本问题 | 使用 JAR 版本 + 本地 Java |
| HTTP/2 网站无法拦截 | 协议不兼容 | Project Options → HTTP → 降级为 HTTP/1 |

---

## 十三、练习与自测

1. 搭建 DVWA/bWAPP 靶场，用 Burp 完成完整的登录接口测试（包括爆破、SQL注入、XSS测试）
2. 用 Intruder 的四种攻击类型分别完成同一测试，总结使用场景差异
3. 安装 Turbo Intruder，对比与原生 Intruder 的性能差异
4. 用 Comparer 对比两个用户对同一 API 的响应，实践越权检测
5. 录制 Session Handling 宏，实现过期 Token 自动刷新

---

## 十四、速查卡

```
拦截开关：        Intercept is on/off
放行：            Forward (Ctrl+F)
发送到 Repeater： Ctrl+R / 右键 → Send to Repeater
发送到 Intruder： Ctrl+I
发送到 Decoder：  Ctrl+D
开启扫描：        右键 → "Scan" / "Actively scan this host"
设置 Scope：      右键 → "Add to scope"
搜索：            Ctrl+Shift+F（全局搜索）/ Ctrl+F（当前）
编码：            选中文本 → 右键 → Convert selection
HTTP 方法切换：   右键 → Change request method
证书下载：        浏览器访问 http://burp
```

---

---

## 十五、Collaborator 带外数据（OAST）详解

Collaborator 是 Burp Pro 的独门利器，通过带外（Out-of-Band）通道检测盲漏洞。

### 15.1 工作原理

```
1. Burp 生成唯一子域名（如 abc123.burpcollaborator.net）
2. 将 payload 注入目标（如 HTTP Header、DNS 查询）
3. 如果目标解析/访问了该子域，Burp Collaborator 服务器收到请求
4. Burp 轮询 Collaborator 服务器，显示交互记录
5. 根据交互类型判断漏洞（DNS→SSTI、HTTP→SSRF、SMTP→邮件注入）
```

### 15.2 实战：检测盲 SSRF

```http
# 原始请求
POST /api/webhook HTTP/1.1
Host: target.com
Content-Type: application/json

{"url": "http://abc123.burpcollaborator.net/test"}

# 如果 Collaborator 收到 HTTP 请求 → 确认 SSRF
```

```bash
# 检测盲 XXE
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://abc123.burpcollaborator.net/xxe">
]>
<root>&xxe;</root>
```

### 15.3 Collaborator 高级配置

```
Project Options → Misc → Burp Collaborator Server：
  - 使用公共服务器（默认）
  - 或自建私有 Collaborator 服务器（企业内网场景）

# 自建 Collaborator 服务器
java -jar burpsuite_pro.jar --collaborator-server
# 配置 DNS：将 *.your-domain.com NS 指向 Collaborator 服务器
# 在 Burp 中设置：Project Options → Misc → Collaborator → Use private server
```

---

## 十六、BApp Store 精选扩展

| 插件 | 功能 | 适用场景 |
|:---|:---|:---|
| **Turbo Intruder** | HTTP 竞速引擎，百万级并发 | 竞态条件、Token爆破 |
| **Autorize** | 自动化越权检测 | 水平/垂直越权批量验证 |
| **ActiveScan++** | 增强主动扫描 | 补充原生扫描规则 |
| **JWT Editor** | JWT 生成/修改/重放 | API Token 测试 |
| **Param Miner** | 猜测隐藏参数 | 参数污染、CRLF |
| **HTTP Request Smuggler** | 请求走私检测 | CL.TE / TE.CL 攻击 |
| **.NET Beautifier** | VIEWSTATE 解码 | ASP.NET 应用测试 |
| **Hackvertor** | 编码/反编码标签 | 绕过 WAF |
| **Reflector** | XSS 反射点扫描 | XSS 发现 |
| **Logger++** | 增强日志记录 | 流量分析 |

### 16.1 Turbo Intruder 实战

```python
# Turbo Intruder 脚本示例：并发用户名枚举
def queueRequests(target, wordlists):
    engine = RequestEngine(
        endpoint=target.endpoint,
        concurrentConnections=20,
        requestsPerConnection=100,
        pipeline=True
    )
    for word in open('/usr/share/wordlists/usernames.txt'):
        engine.queue(target.req, word.rstrip())

def handleResponse(req, interesting):
    if 'incorrect' not in req.response:
        table.add(req)
```

---

## 十七、Session Handling 高级规则

### 17.1 自动登录宏

```
步骤：
1. Project options → Sessions → Session Handling Rules → Add
2. Rule Actions → Add → Run a macro
3. 录制宏：
   a. 打开 Session Handling Rules → Macros → Add
   b. 录制登录流程（POST /login → 获取 Cookie/Token → 验证）
4. 设置触发条件：Session is invalid / 特定 HTTP 响应码
5. 配置作用域（Scope）
```

### 17.2 Token 自动刷新

```http
# 场景：API 使用短期 JWT + Refresh Token
# 规则配置：
# 触发条件：HTTP/1.1 401 Unauthorized
# 执行宏：
#   1. POST /refresh {refresh_token: xxx}
#   2. 提取新 access_token
#   3. 更新当前请求的 Authorization Header
# 然后重试原请求
```

---

## 十八、扩展开发入门

### 18.1 Java 扩展基础

```java
package burp;

public class BurpExtender implements IBurpExtender {
    @Override
    public void registerExtenderCallbacks(IBurpExtenderCallbacks callbacks) {
        callbacks.setExtensionName("My First Extension");
        callbacks.registerHttpListener(new IHttpListener() {
            @Override
            public void processHttpMessage(int toolFlag, 
                    boolean messageIsRequest,
                    IHttpRequestResponse messageInfo) {
                // 处理每个 HTTP 消息
                if (messageIsRequest) {
                    byte[] request = messageInfo.getRequest();
                    // 修改请求逻辑
                }
            }
        });
    }
}
```

### 18.2 Python 扩展（Jython）

```python
from burp import IBurpExtender, IHttpListener

class BurpExtender(IBurpExtender, IHttpListener):
    def registerExtenderCallbacks(self, callbacks):
        self._callbacks = callbacks
        callbacks.setExtensionName("Python Demo Extension")
        callbacks.registerHttpListener(self)
    
    def processHttpMessage(self, toolFlag, messageIsRequest, messageInfo):
        if messageIsRequest:
            request = messageInfo.getRequest()
            analyzedRequest = self._callbacks.getHelpers().analyzeRequest(request)
            headers = analyzedRequest.getHeaders()
            # 自定义逻辑
```

---

## 十九、性能优化与大规模测试

### 19.1 JVM 调优

```bash
# 大项目推荐配置
java -jar -Xmx8g -Xms2g \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=200 \
  -Djava.awt.headless=true \
  burpsuite_pro.jar

# 参数说明
# -Xmx8g: 最大堆内存 8GB
# -Xms2g: 初始堆内存 2GB
# UseG1GC: G1 垃圾回收器（低延迟）
# headless=true: 无头模式（服务器部署用）
```

### 19.2 项目文件管理

```
1. 定期清理：Project options → Temp files → Clean up
2. 分项目保存：每个测试对象单独 .burp 项目文件
3. 导出配置：Project options → Save configuration（复用配置）
4. 磁盘空间：长期项目文件可能达数 GB，注意存储
```

---

## 二十、集成其他工具

```bash
# Burp + sqlmap
1. Burp 拦截请求 → 右键 Save item → 保存为 request.txt
2. sqlmap -r request.txt --batch --dbs

# Burp + nuclei
1. Burp 找到端点 → 导出 URL 列表
2. nuclei -l burp_urls.txt -t ~/nuclei-templates/

# Burp + ffuf/custom script
# 从 Burp 复制请求为 curl 命令
curl -X POST https://target.com/api \
  -H "Cookie: $(burp_cookie)" \
  -H "Content-Type: application/json" \
  -d '{"user":"admin"}'
```

---

## 二十一、常见高危漏洞的 Burp 测试流程

### SQL 注入
```
1. 拦截请求 → Send to Repeater
2. 在参数后加 ' " ` 等测试字符，观察响应差异
3. 加入注释符 -- # /**/ 观察
4. 验证 Boolean-based: ' OR 1=1-- vs ' AND 1=2--
5. 确认注入后 → Save to file → 交给 sqlmap
```

### XSS
```
1. 在每个输入参数中插入 <xss> 标记
2. 在响应中用 Ctrl+F 搜索 <xss>
3. 如果出现在 HTML 正文/属性/JS 上下文中 → 构造对应 PoC
4. 测试 WAF 绕过：大小写混淆、编码、标签变形
```

### IDOR
```
1. 拦截请求 → Send to Repeater
2. 修改资源 ID（如 user_id=100 → 101, 102）
3. 对比两个用户的响应内容（用 Comparer）
4. 如果看到其他用户数据 = 确认 IDOR
```

---

## 二十二、安全合规与实战建议

1. **永远先确认授权范围**：Scope 设置是法律边界线
2. **敏感数据处理**：项目文件中可能含目标凭据，妥善保管
3. **日志留存**：保留测试流量记录用于报告和复核
4. **限速控制**：Intruder/Scanner 要控制并发，避免影响目标
5. **企业版使用**：CI/CD 集成时配置自动扫描阈值
6. **插件审核**：BApp 第三方插件需审核代码安全性

---

> 📖 本文为"网安百宝箱"课程配套读物。
> 参考：PortSwigger 官方文档 https://portswigger.net/burp/documentation | Web Security Academy https://portswigger.net/web-security
> 更新于 2026-06-18
