---
day: 9
title: Web访问日志分析
phase: 第一阶段
difficulty: ⭐ 入门
---

# Day 9：Web访问日志分析

> **阶段**：第一阶段 · 蓝队极速上岗 | **难度**：⭐ 入门 | **课时**：2-3小时

---

## 📋 今日学习目标

1. 理解Nginx/Apache访问日志的每个字段含义
2. 能够用Linux命令对日志进行统计分析
3. 能从日志中识别SQL注入、目录扫描等攻击特征
4. 掌握"找出异常"的核心思路：先看整体统计，再看异常个案
5. 学会编写简单的日志分析脚本思路

---

## 📖 核心知识讲解

### 一、Web访问日志长什么样？

Web服务器（Nginx/Apache）会把每一次访问都记录下来。一条典型的日志长这样：

```
192.168.1.100 - - [10/Jun/2026:14:35:22 +0800] "GET /admin/login.php HTTP/1.1" 200 4521 "https://www.example.com/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
```

看起来很乱？我们把它拆开来：

| 字段 | 示例值 | 含义 | 通俗解释 |
|:---|:---|:---|:---|
| `$remote_addr` | `192.168.1.100` | 客户端IP | 谁访问的 |
| `-` | `-` | 远程用户（一般没有） | 不用管 |
| `-` | `-` | 认证用户（一般没有） | 不用管 |
| `$time_local` | `[10/Jun/2026:14:35:22]` | 访问时间 | 什么时候来的 |
| `$request` | `"GET /admin/login.php HTTP/1.1"` | 请求行 | 要干什么 |
| `$status` | `200` | HTTP状态码 | 结果如何 |
| `$body_bytes_sent` | `4521` | 响应大小(字节) | 回了多少数据 |
| `$http_referer` | `"https://www.example.com/"` | 从哪个页面跳过来的 | 上一站在哪 |
| `$http_user_agent` | `"Mozilla/5.0..."` | 浏览器/爬虫标识 | 用什么浏览器 |

> 🎯 **蓝队分析时最看重的3个字段**：客户端IP、请求内容、状态码。就这三个字段配合起来，能发现90%的攻击行为。

### 二、日志分析的"黄金三步法"

不管给你多大的日志文件，分析思路都一样：

```
第一步：宏观统计（把握全局）
  → 总共有多少条请求？
  → 什么时间段最活跃？
  → 哪些IP访问最多？

第二步：异常发现（找可疑点）
  → 谁在产生大量404？
  → 谁的请求参数很奇怪？（引号、SQL关键字等）
  → 谁在深夜大量访问？

第三步：深度钻取（聚焦攻击）
  → 可疑IP都干了什么？
  → 攻击成功了吗（状态码200还是403）？
  → 需要封禁和处理吗？
```

### 三、用Linux命令分析日志的"标准工具箱"

假设日志文件叫 `access.log`，以下是你最常用的分析命令：

#### 1. 宏观统计

```bash
# 总共有多少条日志
wc -l access.log

# 访问最多的前10个IP
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# 状态码分布统计
cat access.log | awk '{print $9}' | sort | uniq -c | sort -rn

# 访问最多的前10个页面
cat access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -10

# 每小时的访问量分布（发现异常时间窗口）
cat access.log | awk '{print $4}' | cut -d: -f2 | sort | uniq -c
```

#### 2. 发现异常

```bash
# 产生最多404的IP（可能在扫目录）
cat access.log | grep " 404 " | awk '{print $1}' | sort | uniq -c | sort -rn | head

# 产生最多403的IP（可能在越权访问）
cat access.log | grep " 403 " | awk '{print $1}' | sort | uniq -c | sort -rn | head

# 产生最多500的请求（可能攻击导致服务器崩溃）
cat access.log | grep " 500 " | awk '{print $7}' | sort | uniq -c | sort -rn | head

# 使用非标准User-Agent的请求（可能是扫描器）
cat access.log | grep -v "Mozilla" | awk '{print $1, $NF}'
```

#### 3. 聚焦单个可疑IP

```bash
# 看看这个IP都访问了什么（汇总）
grep "192.168.1.100" access.log | awk '{print $7}' | sort | uniq -c

# 看看这个IP的访问时间范围
grep "192.168.1.100" access.log | head -1
grep "192.168.1.100" access.log | tail -1

# 看看这个IP产生了哪些状态码
grep "192.168.1.100" access.log | awk '{print $9}' | sort | uniq -c

# 导出这个IP的所有访问（方便进一步分析）
grep "192.168.1.100" access.log > suspect_ip.txt
```

### 四、攻击特征的日志识别

#### 1. SQL注入特征

攻击者在URL参数里插入SQL语句，日志里能看到明显的SQL关键字：

```
# 可疑日志示例：
192.168.1.100 - - [10/Jun/2026:15:00:00] "GET /product.php?id=1' OR '1'='1 HTTP/1.1" 200 1234
192.168.1.100 - - [10/Jun/2026:15:00:05] "GET /product.php?id=1 UNION SELECT 1,2,3 HTTP/1.1" 200 2345
192.168.1.100 - - [10/Jun/2026:15:00:10] "GET /product.php?id=1' AND 1=2 HTTP/1.1" 200 567
```

**识别特征：**
- URL中包含 `'`、`"`、`--` 
- URL中包含 `UNION`、`SELECT`、`OR 1=1`、`AND 1=2`
- 请求中带有 `' OR '1'='1`

**用grep快速排查：**
```bash
grep -iE "(union.*select|or.*1=1|and.*1=2|select.*from)" access.log
```

#### 2. 目录/文件扫描特征

攻击者用工具暴破网站目录，特点是短时间内大量404：

```
192.168.1.100 - - [10/Jun/2026:15:00:01] "GET /admin HTTP/1.1" 404 -
192.168.1.100 - - [10/Jun/2026:15:00:02] "GET /wp-admin HTTP/1.1" 404 -
192.168.1.100 - - [10/Jun/2026:15:00:03] "GET /phpmyadmin HTTP/1.1" 404 -
192.168.1.100 - - [10/Jun/2026:15:00:04] "GET /backup.zip HTTP/1.1" 404 -
...（几百条类似的404连续出现）
```

**识别特征：**
- 同一IP连续大量404
- 请求路径包含常见敏感目录名（admin/backup/test/phpmyadmin等）
- 请求间隔极短（零点几秒）

**排查方法：**
```bash
# 找出404最多的IP
grep " 404 " access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head

# 看这个IP都访问了什么目录
grep "可疑IP" access.log | awk '{print $7}' | sort -u
```

#### 3. XSS（跨站脚本）特征

```
GET /search?q=<script>alert(1)</script> HTTP/1.1
GET /comment?msg=<img src=x onerror=alert(1)> HTTP/1.1
```

**识别特征：**
- URL中包含 `<script>`
- URL中包含 `javascript:`
- URL中包含 `onerror=`、`onload=` 等事件处理

#### 4. 暴力破解特征

```
192.168.1.100 - - [10/Jun/2026:15:00:00] "POST /login HTTP/1.1" 401 -
192.168.1.100 - - [10/Jun/2026:15:00:01] "POST /login HTTP/1.1" 401 -
192.168.1.100 - - [10/Jun/2026:15:00:02] "POST /login HTTP/1.1" 401 -
...（POST请求 + 连续401 + 同一IP）
```

---

## 🔧 实操任务

### 任务1：创建模拟日志并分析（30分钟）

```bash
# 在Linux终端中创建模拟日志文件
cat > ~/simulate_access.log << 'EOF'
192.168.1.1 - - [10/Jun/2026:10:00:00] "GET /index.html HTTP/1.1" 200 1234
192.168.1.1 - - [10/Jun/2026:10:00:05] "GET /style.css HTTP/1.1" 200 567
192.168.1.1 - - [10/Jun/2026:10:00:10] "GET /logo.png HTTP/1.1" 200 8900
10.0.0.55 - - [10/Jun/2026:10:01:00] "GET /admin HTTP/1.1" 404 123
10.0.0.55 - - [10/Jun/2026:10:01:01] "GET /wp-admin HTTP/1.1" 404 123
10.0.0.55 - - [10/Jun/2026:10:01:02] "GET /phpmyadmin HTTP/1.1" 404 123
10.0.0.55 - - [10/Jun/2026:10:01:03] "GET /backup HTTP/1.1" 404 123
10.0.0.55 - - [10/Jun/2026:10:01:04] "GET /.git/config HTTP/1.1" 404 123
172.16.0.99 - - [10/Jun/2026:10:02:00] "GET /product.php?id=1' OR '1'='1 HTTP/1.1" 200 3456
172.16.0.99 - - [10/Jun/2026:10:02:05] "GET /product.php?id=1 UNION SELECT 1,2,3 HTTP/1.1" 500 123
192.168.1.200 - - [10/Jun/2026:10:03:00] "GET /index.html HTTP/1.1" 200 1234
192.168.1.200 - - [10/Jun/2026:10:03:05] "GET /about.html HTTP/1.1" 200 2345
192.168.1.200 - - [10/Jun/2026:10:03:10] "GET /contact.html HTTP/1.1" 200 3456
10.0.0.55 - - [10/Jun/2026:10:04:00] "POST /login HTTP/1.1" 401 567
10.0.0.55 - - [10/Jun/2026:10:04:01] "POST /login HTTP/1.1" 401 567
10.0.0.55 - - [10/Jun/2026:10:04:02] "POST /login HTTP/1.1" 401 567
172.16.0.99 - - [10/Jun/2026:10:05:00] "GET /search.php?q=<script>alert(1)</script> HTTP/1.1" 200 234
EOF
```

### 任务2：用学过的命令分析这份日志（20分钟）

依次执行以下命令并理解结果：

```bash
# 1. 总共有多少条记录？
wc -l ~/simulate_access.log

# 2. TOP5访问IP是哪些？
cat ~/simulate_access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -5

# 3. 状态码分布？
cat ~/simulate_access.log | awk '{print $9}' | sort | uniq -c | sort -rn

# 4. 找出产生404最多的IP
cat ~/simulate_access.log | grep " 404 " | awk '{print $1}' | sort | uniq -c | sort -rn

# 5. 找出SQL注入嫌疑的请求
cat ~/simulate_access.log | grep -iE "union|select|or.*1=1|<script>"

# 6. 查看可疑IP(10.0.0.55)的所有访问
grep "10.0.0.55" ~/simulate_access.log | awk '{print $7, $9}'
```

### 任务3：安全问题判断（10分钟）

根据分析结果，回答以下问题：
1. 哪个IP可能在扫目录？
2. 哪个IP可能在SQL注入？
3. 哪个IP可能在暴力破解登录？
4. 哪些IP是正常用户？

---

## ✅ 验收标准

- [ ] 能解释Web访问日志每个字段的含义
- [ ] 能写出统计TOP10访问IP、状态码分布的命令
- [ ] 能从日志中识别出目录扫描行为（密集404）
- [ ] 能从日志中识别出SQL注入特征
- [ ] 能对单个可疑IP的访问行为进行聚焦分析
- [ ] 理解"先看整体统计，再看异常个案"的分析思路

---

## 📝 今日小结

Web日志分析是蓝队最基础的"手艺活"。今天你学会了怎么看日志、怎么从海量记录中找到蛛丝马迹。其实攻击者的行为在日志里都有痕迹——扫目录会产生密集404，SQL注入会在URL里留下SQL关键字，暴力破解会有连续401。

**记住今天的核心口诀**：
- `awk '{print $1}'|sort|uniq -c|sort -rn|head` → 统计排名
- `grep " 404 "` → 找扫描者
- `grep -iE "union|select"` → 找SQL注入
- 先看整体 → 找异常 → 钻进去分析

---

## 📚 延伸阅读（可选）

- 下载真实公开日志练习：搜索"public nginx access log samples"或"secrepo.com"
- 了解ELK（Elasticsearch + Logstash + Kibana）是什么，这是企业级日志分析方案
