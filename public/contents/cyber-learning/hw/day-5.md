---
day: 5
title: Linux系统基础（下）
phase: 第一阶段
difficulty: ⭐ 入门
---

# Day 5：Linux系统基础（下）

> **阶段**：第一阶段 · 蓝队极速上岗 | **难度**：⭐ 入门 | **课时**：2-3小时

---

## 📋 今日学习目标

1. 掌握grep命令，能从日志中筛选出目标信息
2. 初步了解awk和sed的文本处理能力
3. 学会查看进程（ps/top）和端口（netstat/ss）
4. 理解管道符 `|` 的威力——把多个命令串联起来
5. 实现"从海量日志中找到攻击IP"的完整操作

---

## 📖 核心知识讲解

### 一、grep —— 蓝队最重要的文本搜索工具

`grep` 是 Linux 中的"搜索神器"。你可以把它理解为高级版的Ctrl+F——它能从成千上万行日志中，瞬间找到你想要的东西。

**基本用法：**
```bash
grep "关键词" 文件名

# 例子：从日志中找所有包含"error"的行
grep "error" /var/log/syslog
```

**蓝队最常用的grep选项：**

| 选项 | 含义 | 使用场景 |
|:---|:---|:---|
| `-i` | 忽略大小写 | 搜索时不区分error/Error/ERROR |
| `-v` | 反向匹配（排除） | 把正常的行过滤掉，只看异常的 |
| `-n` | 显示行号 | 定位到具体行，方便上下文查看 |
| `-c` | 统计匹配次数 | 快速统计某个IP访问了多少次 |
| `-r` | 递归搜索目录 | 在多个日志文件中搜索 |
| `-E` | 使用正则表达式 | 匹配IP地址、邮箱等复杂模式 |
| `-A N` | 同时显示匹配行后N行 | 看到攻击请求后，再看响应是什么 |
| `-B N` | 同时显示匹配行前N行 | 看到错误前发生了什么 |

**实战例子（重点掌握！）：**

```bash
# 1. 从日志中找特定IP的所有访问（大小写不敏感）
grep -i "192.168.1.100" /var/log/nginx/access.log

# 2. 排除正常的200状态码，只看异常的
grep -v " 200 " /var/log/nginx/access.log

# 3. 统计某个IP访问了多少次
grep -c "192.168.1.100" /var/log/nginx/access.log

# 4. 递归搜索所有日志文件中的"failed"
grep -r "failed" /var/log/

# 5. 搜IP地址（正则表达式）
grep -E "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" access.log

# 6. 找到"error"后显示前后各3行上下文
grep -n -C 3 "error" /var/log/syslog
```

> 💡 **蓝队实战场景**：有人报告"服务器可能被攻击了"，你第一件事就是 `grep` 攻击IP、`grep` 异常状态码、`grep` 可疑关键词。

### 二、管道符 `|` —— Linux命令的精髓

管道符 `|` 的作用是把**前一个命令的输出**当作**后一个命令的输入**。这就像流水线——每一步处理完自动传到下一步。

**这个功能被称为Linux哲学："小工具组合成大能力"**

```bash
# 没有管道：要分好几步
grep "error" app.log > temp.txt    # 先存到临时文件
wc -l temp.txt                      # 再统计行数

# 有管道：一行搞定！
grep "error" app.log | wc -l
# grep找到所有含error的行 → 通过管道传给wc → wc统计行数
```

**蓝队日常中的管道组合：**

```bash
# 场景1：找出访问最多的前5个IP
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -5
#     ↓              ↓               ↓       ↓          ↓         ↓
#   读日志    提取IP字段    排序   去重并计数  按次数倒排   取前5名

# 场景2：只看POST请求（因为攻击经常用POST）
cat access.log | grep "POST" | less

# 场景3：统计404错误的数量
cat access.log | grep " 404 " | wc -l

# 场景4：找出所有被拒绝的IP，去重并保存
grep "Failed password" /var/log/secure | awk '{print $(NF-3)}' | sort -u > bad_ip.txt
```

### 三、awk 入门 —— 按列提取数据

日志文件通常是分列的，`awk` 就是专门用来"切列"的工具。

**基本概念：** `awk` 默认用空格/Tab把每行切成多个字段（列），`$1` 是第1列，`$2` 是第2列，`$0` 是整行。

```bash
# 假设日志格式是：
# 192.168.1.1 - - [10/Oct/2023:13:55:36] "GET /index.html HTTP/1.1" 200 2326
#    $1          $2 $3        $4                  $5     $6      $7     $8  $9

# 只看IP（第1列）
awk '{print $1}' access.log

# 只看第1列（IP）和第9列（状态码）
awk '{print $1, $9}' access.log

# 只看状态码不是200的请求
awk '$9 != 200 {print $1, $9}' access.log

# 统计每个IP的访问次数
awk '{count[$1]++} END {for(ip in count) print ip, count[ip]}' access.log
```

> 💡 别被语法吓到，先用 `awk '{print $1}'` 和 `awk '{print $NF}'`（$NF = 最后一列），这是90%的日常场景。

### 四、sed 入门 —— 批量替换和编辑

`sed` 是"流编辑器"，可以在不打开文件的情况下批量修改内容：

```bash
# 把日志里的192.168.1.1全部替换成[内部IP]
sed 's/192.168.1.1/[内部IP]/g' access.log

# 删除所有空行
sed '/^$/d' access.log

# 只看第10到第20行
sed -n '10,20p' access.log
```

> 蓝队用得最多的是 `s/旧/新/g` 替换功能。

### 五、查看进程和端口

#### ps —— "现在有哪些程序在跑？"

```bash
ps aux          # 显示所有进程（最常用）
ps aux | grep nginx    # 找不到nginx？用grep筛选
ps aux | grep root     # 看看root用户在跑什么
ps aux --sort=-%mem    # 按内存使用量排序，找出吃内存的程序
```

> ⚠️ **蓝队关注点**：看到陌生的进程名？可能是攻击者的后门程序！

#### top —— "哪个程序最耗资源？"（实时监控）

```bash
top             # 实时显示系统资源使用情况
# 按 q 退出，按 1 看每个CPU核心，按 M 按内存排序
```

#### netstat —— "哪些端口在监听？"

```bash
netstat -tlnp          # 查看所有正在监听（listening）的TCP端口
netstat -an            # 查看所有连接（包括已建立的）
netstat -an | grep 22  # 只看SSH端口（22）的连接
netstat -an | grep ESTABLISHED  # 只看活跃连接
```

> ⚠️ **蓝队关注点**：端口列表中出现了不认识的端口？某IP有大量ESTABLISHED连接？这可能是入侵迹象！

#### ss —— netstat的"升级版"（更快）

```bash
ss -tlnp           # 等同于netstat -tlnp，但速度更快
ss -an | grep 3389 # 看远程桌面端口
```

### 六、组合实战：从海量日志中找到攻击者

这是一个真实的蓝队分析流程：

```bash
# 场景：怀疑Web服务器被扫描
# 文件：/var/log/nginx/access.log（假设有10万行）

# 步骤1：先看看404最多的IP是谁
cat access.log | grep " 404 " | awk '{print $1}' | sort | uniq -c | sort -rn | head
#                      ↓提取404    ↓提取IP     ↓排序  ↓去重计数  ↓倒排   ↓只显示前几个

# 步骤2：看看这个可疑IP都访问了什么
grep "可疑IP" access.log | awk '{print $7}' | sort -u
#                                           ↓只看请求路径，去重

# 步骤3：看看他在什么时候活动的
grep "可疑IP" access.log | awk '{print $4}' | head -1
grep "可疑IP" access.log | awk '{print $4}' | tail -1

# 步骤4：统计这个IP产生了多少不同状态码
grep "可疑IP" access.log | awk '{print $9}' | sort | uniq -c
```

---

## 🔧 实操任务

### 任务1：grep专项练习（20分钟）

创建一个练习日志文件，然后用grep查找：

```bash
# 创建模拟日志
cat > ~/practice_log.txt << 'EOF'
192.168.1.1 - - [01/Jun/2026:10:00:00] "GET /index.html HTTP/1.1" 200 1234
10.0.0.55 - - [01/Jun/2026:10:01:00] "POST /login HTTP/1.1" 401 567
192.168.1.100 - - [01/Jun/2026:10:02:00] "GET /admin HTTP/1.1" 403 890
172.16.0.99 - - [01/Jun/2026:10:03:00] "GET /shell.php HTTP/1.1" 404 234
10.0.0.55 - - [01/Jun/2026:10:04:00] "POST /login HTTP/1.1" 401 567
10.0.0.55 - - [01/Jun/2026:10:05:00] "POST /login HTTP/1.1" 401 567
10.0.0.55 - - [01/Jun/2026:10:06:00] "POST /login HTTP/1.1" 200 890
EOF

# 练习题：
# 1. 找出所有状态码不是200的行
grep -v " 200 " ~/practice_log.txt

# 2. 找出所有POST请求
grep "POST" ~/practice_log.txt

# 3. 统计10.0.0.55访问了多少次
grep -c "10.0.0.55" ~/practice_log.txt

# 4. 找出所有结果状态码是4xx的行（用正则）
grep -E " [4][0-9]{2} " ~/practice_log.txt
```

### 任务2：管道+awk组合练习（20分钟）

```bash
# 1. 提取所有IP地址（第1列）
cat ~/practice_log.txt | awk '{print $1}'

# 2. 提取IP和状态码
cat ~/practice_log.txt | awk '{print $1, $9}'

# 3. 统计每个IP的访问次数
cat ~/practice_log.txt | awk '{print $1}' | sort | uniq -c | sort -rn

# 4. 找出所有请求的页面路径
cat ~/practice_log.txt | awk '{print $7}' | sort -u
```

### 任务3：进程和端口检查（10分钟）

```bash
# 查看所有监听端口
ss -tlnp

# 看SSH相关进程
ps aux | grep ssh

# 看当前活跃的网络连接
ss -an | head -20
```

---

## ✅ 验收标准

- [ ] 能用grep从日志中筛选指定IP、状态码、请求方法的记录
- [ ] 理解管道符 `|` 的作用，能组合2个以上命令
- [ ] 能用 `awk '{print $1}'` 提取日志的IP列
- [ ] 能用 `ss -tlnp` 查看监听端口并识别常见服务
- [ ] 能用 `ps aux | grep 关键字` 查找进程
- [ ] 完成"从日志中统计访问TOP5 IP"的完整操作

---

## 📝 今日小结

今天学了Linux的"组合拳"——grep搜、awk切、管道连。这三个工具看起来简单，但组合起来威力惊人。在后面的日志分析学习中，你会反复使用这些技能。

**记住今天的核心**：
- `grep` = 搜索引擎，能在千万行日志中找到你要的东西
- `awk` = 切列工具，`$1` 是第一列，`$NF` 是最后一列
- `|` = 流水线，把多个小工具串成一条自动化生产线
- `ss -tlnp` = 检查哪些端口开着（看看有没有后门）

---

## 📚 延伸阅读（可选）

- 练习正则表达式：搜索"RegexOne"在线交互式教程
- 挑战题：用一行命令统计 `/var/log/secure` 中每种登录失败类型（如"Invalid user"、"Failed password"）的数量
