# Day 4：Web应用渗透基础

> 🎯 面试目标：掌握Web渗透的核心流程，能画出典型Web攻击面并解释OWASP Top 10

## 知识速览

### 核心概念
- **OWASP Top 10（2021版）**：①访问控制失效 ②加密失败 ③注入攻击 ④不安全设计 ⑤安全配置错误 ⑥脆弱和过时组件 ⑦认证和授权失败 ⑧软件和数据完整性失效 ⑨安全日志和监控失败 ⑩SSRF。面试时必须能背出并举例
- **HTTP请求/响应结构**：请求行(方法+URL+版本)→请求头(Host/Cookie/User-Agent等)→请求体(POST参数/JSON)；响应行(状态码)→响应头(Set-Cookie/Content-Type)→响应体(HTML/JSON)。理解每个头部在渗透中的作用
- **同源策略与CORS**：浏览器最核心的安全机制——协议+域名+端口三者完全相同才允许跨文档访问。CORS是跨域资源共享的受控放宽机制，配置不当可导致敏感数据泄露

### 必问考点

| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| 给你一个 Web 应用，你的测试思路是什么？ | 按OWASP Top 10逐项排查：先做信息收集（指纹识别、目录结构、JS源码审计API端点）→认证测试（弱口令、暴力破解、会话管理）→授权测试（越权、IDOR）→输入验证测试（XSS/SQL注入/命令注入）→业务逻辑测试（支付篡改、优惠券绕过）→配置测试（敏感文件泄露、默认口令） |
| HTTP 状态码在渗透中有什么价值？ | 403说明路径存在但无权限（可尝试绕过），401说明需要认证，302/301可能是登录后跳转（跟踪目标），500说明后端报错（可能触发SQL注入或代码执行），200 OK+异常内容可能是成功利用的反馈 |
| 什么是 IDOR？怎么发现和利用？ | 不安全的直接对象引用——攻击者通过修改请求中的对象ID（如user_id=123改为124）访问他人数据。测试方法：抓包改参数，对比不同用户身份下返回的数据。常见于API接口中 /api/user/123/profile 这种RESTful设计 |

### 技术细节

Burp Suite 核心使用场景：
```
Proxy（拦截器） → Repeater（重放修改） → Intruder（爆破测试）
       │                   │                      │
  修改请求参数        验证单个漏洞          FUZZ参数/目录/密码
       │                   │                      │
       └───────────────────┴──────────────────────┘
                           │
                    Scanner/Extender
                    （自动化+插件扩展）
```

SQLMap 基础用法：
```bash
# GET请求注入检测
sqlmap -u "http://target.com/page.php?id=1" --batch

# POST请求注入
sqlmap -u "http://target.com/login" --data="user=admin&pass=123" --batch

# 获取数据库名
sqlmap -u "http://target.com/page.php?id=1" --dbs

# 获取表名
sqlmap -u "http://target.com/page.php?id=1" -D dbname --tables

# 脱库
sqlmap -u "http://target.com/page.php?id=1" -D dbname -T users --dump
```

## 常见陷阱
- ⚠️ 拿到网站直接上扫描器，不先手动浏览理解业务逻辑——业务逻辑漏洞（如越权、支付篡改）扫描器是扫不出来的
- ⚠️ 面试时只会说"用Burp Suite抓包"，但说不出Burp Suite六大模块（Proxy/Repeater/Intruder/Scanner/Decoder/Comparer）各自的功能

## 今日检测
1. 默写 OWASP Top 10（2021版）并给每一项举一个实际案例
2. 打开 Burp Suite，用 Repeater 和 Intruder 分别完成一个测试场景
3. 自己搭建一个 WebGoat/DVWA 环境，完成认证绕过和越权实验
