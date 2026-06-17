---
day: 15
title: 防火墙与WAF原理
phase: 第一阶段
difficulty: ⭐⭐ 基础
---

# Day 15：防火墙与WAF原理

> **阶段**：第一阶段 · 蓝队极速上岗 | **难度**：⭐⭐ 基础 | **课时**：2-3小时

---

## 📋 今日学习目标

1. 理解防火墙的工作模式和核心策略
2. 理解WAF（Web应用防火墙）的检测原理
3. 能够区分防火墙和WAF的作用
4. 学会使用iptables配置基础规则
5. 理解WAF的拦截逻辑和绕过风险

---

## 📖 核心知识讲解

### 一、防火墙是什么？（门卫比喻）

**防火墙 = 大楼的门卫**

门卫的工作很简单：
1. 有人要进来 → 看身份证（检查IP和端口）
2. 不在白名单上 → 不让进
3. 在黑名单上 → 直接拦住

防火墙管的是**第3-4层**（IP和端口层面），它不关心你进门后干了什么。

```
防火墙判断逻辑：
  来源IP是白名单吗？→ 放行
  目标端口是允许的吗？→ 放行
  以上都不是？→ 拒绝
```

**防火墙典型规则示例：**
| 规则 | 含义 |
|:---|:---|
| 允许 192.168.1.0/24 访问 22端口 | 只允许内网SSH登录 |
| 拒绝 45.33.32.156 的所有访问 | 封禁恶意IP |
| 允许 0.0.0.0/0 访问 80,443端口 | 允许全世界访问网站 |
| 拒绝 0.0.0.0/0 访问 3306端口 | 禁止外网访问数据库 |

### 二、WAF是什么？（安检机比喻）

**WAF = 机场的安检机**

安检机不是看你的身份证（那是门卫的事），而是检查你**带了什么**：
- 包里有没有刀？（请求里有没有SQL注入）
- 瓶子里是不是水？（参数里有没有XSS代码）
- 行李中有没有违禁品？（上传的文件是不是webshell）

WAF管的是**第7层**（HTTP应用层面），它能看到具体的请求内容。

```
WAF判断逻辑：
  HTTP请求进来了 → 检查URL参数有没有SQL关键字 → 有就拦截
                → 检查POST内容有没有script标签 → 有就拦截
                → 检查上传文件是不是.php → 是就拦截
                → 都通过了 → 放行
```

### 三、防火墙 vs WAF —— 核心区别

| 对比维度 | 防火墙 | WAF |
|:---|:---|:---|
| 工作层级 | 第3-4层（网络/传输层） | 第7层（应用层） |
| 比喻 | 门卫 | 安检机 |
| 看什么 | IP地址、端口、协议 | HTTP请求内容、参数、文件 |
| 能挡什么 | 非法IP访问、端口扫描 | SQL注入、XSS、文件上传、CSRF |
| 能防端口扫描吗 | ✅ | ❌ |
| 能防SQL注入吗 | ❌ | ✅ |
| 能防DDoS吗 | ✅（一定程度上） | ✅（HTTP层面） |
| 典型产品 | iptables、深信服FW | 阿里云WAF、Cloudflare WAF、ModSecurity |

### 四、iptables基础实操（Linux自带防火墙）

iptables是Linux系统自带的防火墙，在蓝队应急响应中经常用来**紧急封禁攻击IP**。

**iptables核心概念：**
```
iptables有三张"表"和五条"链"：

三张表（按功能分）：
  filter表 → 过滤数据包（最常用）
  nat表   → 地址转换
  mangle表→ 修改数据包

五条链（按时机分）：
  INPUT   → 进入本机的包（最常用）
  OUTPUT  → 从本机发出的包
  FORWARD → 经过本机转发的包
  PREROUTING  → 路由前
  POSTROUTING → 路由后
```

**蓝队最常用的iptables命令：**

```bash
# 查看当前规则
sudo iptables -L -n -v

# 封禁一个IP（阻止所有来自该IP的访问）
sudo iptables -A INPUT -s 45.33.32.156 -j DROP

# 只允许指定IP访问SSH
sudo iptables -A INPUT -p tcp --dport 22 -s 192.168.1.100 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 22 -j DROP

# 允许Web端口
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# 删除一条规则
sudo iptables -D INPUT -s 45.33.32.156 -j DROP

# 保存规则（重启后生效）
sudo iptables-save > /etc/iptables/rules.v4     # Debian/Ubuntu
sudo service iptables save                        # CentOS/RHEL
```

### 五、WAF的检测与绕过

WAF主要通过**规则匹配**来检测攻击，但它也有"天花板"：

**WAF能检测的攻击模式：**
```bash
# 这些请求WAF一般能拦截：
GET /page?id=1 OR 1=1              → 规则匹配：发现SQL关键字
GET /search?q=<script>alert(1)     → 规则匹配：发现XSS标签
POST /upload (文件是shell.php)      → 文件名黑名单
```

**WAF绕过的常见手法（了解即可，理解WAF局限）：**
- 大小写混写：`SeLeCt` 绕过区分大小写的规则
- 编码绕过：URL编码/Unicode编码
- 注释插入：`SEL/**/ECT` 在关键字中插注释
- 分块传输：把payload拆成多块发送

> 🎯 **蓝队需要理解**：WAF不是万能的，它只是第一道防线。被WAF拦住不代表没风险（可能已经被绕过），没被拦住的也要看是不是新攻击方式。

### 六、蓝队视角：防火墙和WAF的日志怎么看

**防火墙日志示例：**
```
Jun 12 14:20:00 kernel: [iptables] DROP IN=eth0 OUT= MAC=... SRC=45.33.32.156 DST=192.168.1.100 LEN=60 TOS=0x00 PROTO=TCP SPT=12345 DPT=22
```
解读：来自45.33.32.156的连接被防火墙丢弃，目标是SSH端口(22)。

**WAF日志示例：**
```
[2026-06-12 14:20:00] [error] [client 45.33.32.156] ModSecurity: Access denied. [msg "SQL Injection Attack"] [uri "/product.php?id=1' OR '1'='1"]
```
解读：WAF拦截了来自45.33.32.156的SQL注入攻击。

---

## 🔧 实操任务

### 任务1：iptables实操（25分钟）

在Kali Linux中打开终端，执行：

```bash
# 1. 查看当前规则
sudo iptables -L -n -v

# 2. 添加一条封禁规则（测试用，封禁一个不存在的IP）
sudo iptables -A INPUT -s 10.255.255.255 -j DROP

# 3. 查看规则是否生效
sudo iptables -L -n -v | grep 10.255.255.255

# 4. 删除这条规则
sudo iptables -D INPUT -s 10.255.255.255 -j DROP

# 5. 再次确认规则已删除
sudo iptables -L -n -v

# 6. 只允许80端口（小心！可能会断开SSH）
# ⚠️ 不要轻易在生产环境执行！
# sudo iptables -P INPUT DROP
# sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
# sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
```

### 任务2：区分防火墙和WAF的场景（15分钟）

判断以下场景应该用防火墙还是WAF处理：
1. 封禁一个来自国外的扫描IP → ?
2. 拦截URL中含有 `'OR '1'='1` 的请求 → ?
3. 禁止外部IP访问数据库端口3306 → ?
4. 防止用户上传.php后缀的webshell文件 → ?
5. 限制只有特定IP段才能SSH登录 → ?

### 任务3：了解WAF产品（15分钟）

1. 访问阿里云/腾讯云官网，搜索"WAF"，了解云WAF的功能
2. 了解ModSecurity（开源WAF）：搜索"ModSecurity入门"
3. 记录在你的笔记中：防火墙和WAF的区别

---

## ✅ 验收标准

- [ ] 能用自己的话解释防火墙和WAF的作用区别
- [ ] 能使用iptables查看规则、添加封禁规则、删除规则
- [ ] 能区分哪些安全需求由防火墙解决、哪些由WAF解决
- [ ] 理解WAF的检测原理（规则匹配）
- [ ] 知道WAF不是万能的，可能会被绕过

---

## 📝 今日小结

防火墙和WAF是蓝队的两道防线：防火墙管"谁可以进来"（IP/端口层面），WAF管"带什么东西进来"（HTTP内容层面）。今天学了两者的区别和iptables的基本操作，这在应急响应中非常实用——发现攻击时第一时间可能就是封IP。

**记住今天的核心**：
- 防火墙 = 门卫（管IP和端口）
- WAF = 安检机（管HTTP请求内容）
- `iptables -A INPUT -s IP -j DROP` = 封禁攻击IP
- WAF靠规则匹配，但可以被绕过

---

## 📚 延伸阅读（可选）

- 了解下一代防火墙（NGFW）和传统防火墙的区别
- 了解Cloudflare WAF的免费版功能
