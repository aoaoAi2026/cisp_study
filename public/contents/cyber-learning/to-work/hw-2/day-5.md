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

---

## 🎯 蓝队面试高频题（Day 5 主题）

**Q1：grep、awk、sed 三者的分工是什么？**

> - **grep** = 搜索引擎——从一堆数据里找出包含特定模式的行（大海捞针）
> - **awk** = 切列工具——把每行数据按空格切成多列，提取你需要的那几列
> - **sed** = 批量编辑器——在不打开文件的情况下批量替换、删除、插入
> 
> 三者组合 = 蓝队的"日志处理流水线"：grep筛选→awk提取→sed格式化。

**Q2：管道符 `|` 的本质是什么？**

> 管道符把前一个命令的"标准输出"连接到后一个命令的"标准输入"。它不是简单的先后执行，而是**实时流式传递**——前一个命令每产生一行，后一个命令就立刻处理一行，不用等前一个命令全部执行完。
> 
> 蓝队典型场景：`tail -f access.log | grep " 500 "` → 实时监控访问日志，一旦出现500错误立刻显示。因为在tail -f持续输出的同时，grep同时在工作。

**Q3：如何用一行命令统计access.log中访问次数最多的前10个IP？**

> ```bash
> cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10
> ```
> 拆解：读文件→awk取第1列(IP)→sort排序(uniq需要)→uniq -c去重并计数→sort -rn按数字降序→head取前10
> 
> 这道题是蓝队面试的"Hello World"级别考题，必须能秒答。

---

## 📖 深度阅读：从日志中发现攻击的"五步法"

蓝队面对几百万行的日志，不能一行一行看。以下是系统化的分析步骤：

**第一步：粗略统计（找到异常点）**
```bash
# 统计状态码分布——如果404比例异常高，很可能被扫描了
cat access.log | awk '{print $9}' | sort | uniq -c | sort -rn
# 统计请求方法——如果出现PUT/DELETE/OPTIONS等非标准方法，要看是不是攻击
cat access.log | awk '{print $6}' | sort | uniq -c | sort -rn
# 统计每小时的请求量——凌晨3点突然高峰？可疑
cat access.log | awk '{print $4}' | cut -d: -f2 | sort | uniq -c
```

**第二步：定位高频IP（找出最活跃的"访客"）**
```bash
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -20
# 如果某个IP的访问量是第二名的10倍以上→排除正常爬虫后很可能是攻击
```

**第三步：针对可疑IP做行为画像**
```bash
# 这个IP都访问了什么路径
grep "可疑IP" access.log | awk '{print $7}' | sort -u
# 这个IP造成了哪些状态码
grep "可疑IP" access.log | awk '{print $9}' | sort | uniq -c
# 这个IP用了什么User-Agent
grep "可疑IP" access.log | awk -F'"' '{print $6}' | sort -u
```

**第四步：提取攻击payload**
```bash
# 看到可疑请求后，提取完整的请求参数
grep "可疑IP" access.log | grep -i "union\|select\|script\|alert\|\\.\\./"
# 注意大小写不敏感(-i)和正则中的管道符(\|)
```

**第五步：关联其他日志**
```bash
# 这个IP有没有在其他日志中出现
grep -r "可疑IP" /var/log/
# 这个时间段有没有其他安全告警
grep "异常时间段" /var/log/secure
```

---

## 🏋️ 额外实操挑战

1. **生成模拟日志**：用脚本生成一个10万行的模拟访问日志（包含正常+攻击），然后用五步法分析
2. **正则入门**：学5个最基本的正则表达式：`.*`（任意字符）、`[0-9]`（数字）、`^`（开头）、`$`（结尾）、`|`（或者）
3. **组合挑战**：只用一行命令，从 /var/log/secure 中统计尝试SSH登录失败最多的前5个IP
4. **实时监控**：终端1中 `tail -f /var/log/secure`，终端2中尝试SSH登录（成不成功都行），观察终端1的实时输出

---

## ⚠️ 新手常见误区纠正

1. **误区**："awk太复杂了，我用grep就够了"
   - **真相**：grep只能找"包含某关键词的行"，但很多信息是结构化的——你需要的只是其中某一列。只学grep就像只学用放大镜看世界，学awk等于多了一台显微镜。
   
2. **误区**："正则表达式记不住，用普通搜索代替"
   - **真相**：普通搜索找不到 `192.168.X.X` 这种模式（因为X在变）。正则表达式就是处理"变动的模式"——IP地址模式、邮箱模式、URL模式。不需要记住所有语法，把 `.*` `[0-9]` `.` `|` 这几个记住就覆盖80%场景。

3. **误区**："直接写一个Python脚本分析日志，比命令行方便"
   - **真相**：Python更灵活，但命令行更快。排查应急响应时，时间比优雅重要。你可以在30秒内用命令行定位到异常IP，然后如果需要复杂分析再用Python。两种工具都要会，命令行是"急救包"，Python是"手术台"。

---

## 📖 深度补充内容

### 💡 面试高频题：Linux基础（下）+三剑客

**Q1: grep、awk、sed各自的定位是什么？**
A: grep=文本搜索（找到包含特定模式的行）；awk=文本处理（按列提取、计算、格式化输出）；sed=文本编辑（查找替换、删除行、插入内容）。蓝队最常用的组合：`grep '攻击特征' access.log | awk '{print $1,$7}' | sort | uniq -c | sort -rn`。

**Q2: 写一个命令，从nginx日志中统计每个IP的请求数，取TOP10。**
A: `awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10`。这是蓝队日志分析的"起手式"——先看谁在大量访问，再针对可疑IP进行深度排查。

**Q3: 怎么用awk过滤出状态码为500的请求行？**
A: `awk '$9==500' access.log`。状态码500是SQL注入、命令注入的常见"标志"——攻击payload导致服务端报错。蓝队看到连续500状态码要立即提高警惕。

**Q4: sed在蓝队工作中有什么实际用途？**
A: ①脱敏日志（替换真实IP为占位符，用于分享）：`sed 's/[0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+/x.x.x.x/g'`；②提取特定时间段日志：`sed -n '/08:00/,/12:00/p' access.log`；③删除无用字段精简日志。

**Q5: 进程排查时，ps aux输出中哪些列最关键？**
A: USER（进程属主，异常用户启动的进程需警惕）、%CPU/%MEM（挖矿病毒的高CPU特征）、STAT（S=睡眠/R=运行/Z=僵尸，Z状态进程过多可能是攻击后遗症）、START（进程启动时间，异常时间的进程需排查）、COMMAND（完整的命令行参数，攻击者经常修改进程名伪装）。


---

## 🔬 深度专题：Linux三剑客进阶——蓝队日志分析实战

### grep高级用法：蓝队日志分析必杀技

基础grep只是入门，以下进阶用法能让你在日志分析中快人一步：

**1. 正则表达式组合检测**
```bash
# 同时检测多种攻击（SQL注入+XSS+路径遍历）
grep -iP "(union.*select|<script>|\.\./\.\./|sleep\(|cmd=|exec\(|wget |curl )" access.log
```

**2. 上下文输出（看攻击前后的请求）**
```bash
# 显示匹配行的前后3行——还原攻击链上下文
grep -iP -B3 -A3 "union.*select" access.log
```

**3. 反向匹配（排除噪声）**
```bash
# 排除CDN和已知正常IP的访问
grep -v -E "(1.2.3.4|cdn\.example\.com|googlebot)" access.log | grep -i "union"
```

**4. 计数统计（攻击频率分析）**
```bash
# 统计每种攻击的发生频率
grep -c "union.*select" access.log  # SQL注入次数
grep -c "<script>" access.log        # XSS次数
grep -c "\\.\\./\\.\\./" access.log  # 路径遍历次数
```

### awk进阶：从简单提取到统计分析

**1. 按时间段统计攻击**
```bash
# 统计每小时的SQL注入攻击次数
grep -i "union" access.log | awk -F':' '{print $2":"$3}' | cut -d':' -f1,2 | sort | uniq -c | sort -rn
```

**2. 计算攻击者排名和贡献度**
```bash
# 统计每个攻击IP的攻击次数和占比
awk '{ips[$1]++} END {for(i in ips) printf "%-20s %5d %.1f%%\n", i, ips[i], ips[i]*100/NR}' access.log | sort -k2 -rn | head -20
```

**3. 提取并统计User-Agent（发现自动化工具）**
```bash
# 统计UA分布，发现异常值
awk -F'"' '{print $6}' access.log | sort | uniq -c | sort -rn | head -20
# 如果看到sqlmap/XSS扫描器/Python脚本的UA → 确认自动化攻击
```

**4. 响应体大小分析（发现拖库行为）**
```bash
# 统计响应体大小的TOP10（异常大的可能是拖库）
awk '{print $10}' access.log | sort -rn | head -10
# 结合状态码200 + 异常大的响应体 = 拖库特征
```

### sed在蓝队中的5个实用场景

1. **日志脱敏**：`sed "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/x.x.x.x/g" access.log > sanitized.log`
2. **时间范围提取**：`sed -n "/08:00/,/12:00/p" access.log > morning.log`
3. **特定请求方法筛选**：`sed -n "/POST/p" access.log > post_requests.log`
4. **移除无关字段**：`sed "s/ - - \[.*\] //" access.log`  # 去掉时间戳和用户字段，精简日志
5. **格式化输出**：`sed "s/\"GET /GET: /; s/ HTTP.*//" access.log | awk "{print \$1, \$4}" | head`  # 提取IP和请求路径

### 组合技巧：三剑客联动分析

最强大的分析不是单独使用grep/awk/sed，而是将它们串联起来：

```bash
# 实战案例：找出SQL注入攻击者TOP10并提取它们的完整攻击链
grep -i "union.*select" access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10 | while read count ip; do
  echo "=== IP: $ip (攻击$count次) ==="
  grep "$ip" access.log | head -5  # 显示该IP的前5条请求
  echo ""
done
```

**分析链路**：grep筛选攻击 → awk提取IP → sort+uniq统计 → while循环逐个分析 → 输出攻击者行为画像。

这就是"三剑客"的真正威力——不是各自为战，而是无缝协作。

