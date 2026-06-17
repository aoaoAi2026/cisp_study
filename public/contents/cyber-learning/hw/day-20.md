---
day: 20
title: 常见攻击识别-入侵类
phase: 第一阶段
difficulty: ⭐⭐ 基础
---

# Day 20：常见攻击识别——入侵类

> **阶段**：第一阶段 · 蓝队极速上岗 | **难度**：⭐⭐ 基础 | **课时**：2-3小时

---

## 📋 今日学习目标

1. 能准确识别暴力破解的日志/告警特征
2. 能识别SQL注入攻击在日志中的表现
3. 能识别XSS和文件上传攻击的日志特征
4. 学会从模拟告警中筛选真实入侵、排除误报
5. 综合运用情报+日志+流量多维判断

---

## 📖 核心知识讲解

### 一、暴力破解识别

#### 特征速查

| 维度 | 特征 |
|:---|:---|
| **时间** | 短时间内密集尝试（每秒数次到数十次） |
| **来源** | 单一IP（或分布式暴破则为多IP） |
| **目标** | 同一账户（精准暴破）或多个账户（用户名枚举） |
| **结果** | 大量失败 + 偶尔成功 |

#### 在Windows安全日志中
```
事件ID 4625 密集出现：
1分钟内 > 5次 = 疑似暴力破解
1分钟内 > 20次 = 基本确认暴力破解
同一IP + 不同用户名 = 用户名枚举（暴破变种）
同一IP + 同一用户名 + 连续失败后突然4624 = 暴破成功！
```

#### 在Linux secure日志中
```bash
# 找暴破来源IP
grep "Failed password" /var/log/secure | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn

# 找暴破使用的用户名
grep "Failed password" /var/log/secure | awk '{print $(NF-5)}' | sort | uniq -c | sort -rn

# 判断是否成功（找同一IP在密集失败后的Accepted）
grep -E "Accepted|Failed" /var/log/secure | grep "可疑IP"
```

#### 在Web日志中
```
192.168.1.100 - - [12/Jun/2026:14:20:00] "POST /login HTTP/1.1" 401 -
192.168.1.100 - - [12/Jun/2026:14:20:01] "POST /login HTTP/1.1" 401 -
192.168.1.100 - - [12/Jun/2026:14:20:02] "POST /login HTTP/1.1" 401 -
192.168.1.100 - - [12/Jun/2026:14:20:03] "POST /login HTTP/1.1" 200 -   ← 成功了！
```

### 二、SQL注入攻击识别

#### Web日志中的特征

```bash
# 最经典的SQL注入特征
GET /product.php?id=1' OR '1'='1
GET /product.php?id=1 UNION SELECT 1,2,3
GET /product.php?id=1' AND 1=2
GET /product.php?id=-1' UNION SELECT user(),database(),version()--
GET /product.php?id=1'; WAITFOR DELAY '0:0:5'--    ← 时间盲注！

# POST请求中的注入
POST /login
username=admin'--&password=xxx
username=admin' OR '1'='1'--&password=xxx
```

#### 快速排查命令
```bash
# 搜SQL注入关键字
grep -iE "(union.*select|select.*from|or.*1=1|and.*1=2|waitfor.*delay|sleep\()" access.log

# 看到很多单引号（注入探测）
grep "%27\|' OR\|--\+" access.log

# 看哪些IP在用SQL注入
grep -iE "union|select" access.log | awk '{print $1}' | sort | uniq -c | sort -rn
```

#### 判断SQL注入是否成功

```
请求返回200 → 可能是正常响应，也可能是注入了但没显示数据
请求返回大量数据（body_bytes_sent字段很大） → 可能在拖库！
请求返回500 → SQL语句错误，暴露了数据库信息（信息泄露）
请求返回302 → 可能绕过了登录验证
```

### 三、XSS攻击识别

XSS攻击的核心标识是请求中包含HTML/JavaScript代码：

```bash
# XSS常见payload特征
GET /search?q=<script>alert(1)</script>
GET /comment?msg=<img src=x onerror=alert(1)>
GET /page?url=javascript:alert(document.cookie)
POST /profile
name=<svg/onload=alert(1)>&email=test@test.com

# 排查命令
grep -iE "(<script|javascript:|onerror=|onload=|alert\(|document\.cookie)" access.log
```

### 四、文件上传攻击识别

```
# 危险文件后缀上传
POST /upload HTTP/1.1
Content-Type: multipart/form-data
filename="shell.php"           ← .php当作头像上传！
filename="cmd.jsp"             ← JSP webshell
filename="test.php.jpg"        ← 双后缀绕过
filename="shell.php%00.jpg"    ← 截断绕过

# 排查命令
grep -iE "\.php|\.jsp|\.asp|\.aspx" access.log | grep POST
```

### 五、综合研判技巧 —— 从告警中"找线索"

#### 技巧1：时间线串联
```
02:00 - 端口扫描告警（探测阶段）
02:15 - SQL注入告警（利用阶段）
02:30 - 文件上传告警（获取权限）
02:45 - 异常外连告警（建立后门）
→ 这是一个完整的攻击链！
```

#### 技巧2：多数据源交叉验证
```
IDS告警：某IP在SQL注入
  ↓ 验证1：Web日志中有对应的注入请求吗？
  ↓ 验证2：该IP在威胁情报中是恶意的吗？
  ↓ 验证3：系统日志中该IP有异常登录吗？
  ↓ 三条都验证 → 高置信度真实攻击
```

#### 技巧3：正常vs异常行为基线判断
```
正常用户：
  - 工作时间访问
  - 访问的是公开页面
  - User-Agent是正常浏览器
  - 失败几次后会停止

攻击者：
  - 全天候活动，尤其深夜
  - 访问敏感路径（admin/phpmyadmin）
  - User-Agent可能是脚本/工具
  - 持续攻击不停止
```

### 六、常见误报排除

| 误报类型 | 怎么回事 | 怎么排除 |
|:---|:---|:---|
| 安全测试 | 公司安全团队在测试 | 查询源IP是否为安全团队IP |
| 正常业务 | 业务代码触发了规则 | 分析业务逻辑，确认是合法操作 |
| 搜索引擎 | 爬虫爬取了所有页面 | User-Agent为Googlebot/Baiduspider |
| CDN回源 | CDN节点回源请求 | 来源IP为CDN节点IP段 |
| 扫描平台 | 第三方安全扫描 | ZoomEye/Shodan/Censys的IP段 |

---

## 🔧 实操任务

### 任务1：综合攻击识别练习（25分钟）

创建一份新的模拟日志，包含多种攻击：

```bash
cat > ~/attack_test.log << 'EOF'
192.168.1.1 - - [12/Jun/2026:09:00:00] "GET /index.html HTTP/1.1" 200 1234
45.33.32.156 - - [12/Jun/2026:02:00:00] "GET / HTTP/1.1" 200 5678
45.33.32.156 - - [12/Jun/2026:02:00:05] "GET /login HTTP/1.1" 200 2345
45.33.32.156 - - [12/Jun/2026:02:00:10] "POST /login HTTP/1.1" 401 123
45.33.32.156 - - [12/Jun/2026:02:00:11] "POST /login HTTP/1.1" 401 123
45.33.32.156 - - [12/Jun/2026:02:00:12] "POST /login HTTP/1.1" 401 123
45.33.32.156 - - [12/Jun/2026:02:00:13] "POST /login HTTP/1.1" 401 123
45.33.32.156 - - [12/Jun/2026:02:00:14] "POST /login HTTP/1.1" 200 4567
45.33.32.156 - - [12/Jun/2026:02:01:00] "GET /admin/users.php HTTP/1.1" 200 8901
45.33.32.156 - - [12/Jun/2026:02:05:00] "GET /product.php?id=-1 UNION SELECT user,password FROM users HTTP/1.1" 200 15678
45.33.32.156 - - [12/Jun/2026:02:05:30] "GET /upload.php HTTP/1.1" 200 1234
45.33.32.156 - - [12/Jun/2026:02:06:00] "POST /upload.php HTTP/1.1" 200 567
192.168.1.5 - - [12/Jun/2026:09:20:00] "GET /about.html HTTP/1.1" 200 3456
192.168.1.5 - - [12/Jun/2026:09:25:00] "GET /products.php?category=books HTTP/1.1" 200 4567
192.168.1.5 - - [12/Jun/2026:09:30:00] "GET /products.php?category=<script>alert('xss')</script> HTTP/1.1" 200 2345
EOF
```

分析这份日志：
1. 找出发动攻击的IP
2. 梳理攻击链（按时间线）
3. 判断攻击是否成功
4. 写出处置建议

### 任务2：误报判断练习（10分钟）

判断以下场景是真实攻击还是误报：
1. 公司安全测试团队IP产生了SQL注入告警 → ?
2. Google爬虫触发了目录扫描告警 → ?
3. 凌晨3点境外IP登录成功（但该用户确实在国外出差） → ?

---

## ✅ 验收标准

- [ ] 能从日志中识别暴力破解攻击（密集401 + 突然200）
- [ ] 能从日志中识别SQL注入攻击（SQL关键字在URL中）
- [ ] 能从日志中识别XSS和文件上传攻击
- [ ] 能用多维度交叉验证判断是否为真实攻击
- [ ] 能排除3种以上常见误报
- [ ] 完成模拟攻击链分析

---

## 📝 今日小结

今天你学的是蓝队最核心的"眼力"——从日志中识别入侵行为。暴力破解看密集失败的登录、SQL注入看URL中的SQL语句、XSS看script标签、文件上传看危险文件后缀。记住：一个攻击者往往不是只做一件事，学会把告警串成"攻击链"，你才能看到全局。

**记住今天的核心**：
- 暴破 = 密集401/4625 → 突然200/4624 = 成功
- SQL注入 = URL中有`UNION SELECT`、`' OR 1=1`等
- XSS = URL中有`<script>`、`onerror=`
- 文件上传 = POST上传.php/.jsp文件
- 攻击链 = 扫描→注入→上传→持久化

---

## 📚 延伸阅读（可选）

- 搜索"安全告警分析案例复盘"阅读真实分析报告
- 了解ATT&CK框架：将攻击行为映射到标准技术编号
