---
day: 6
title: 值守工具（Linux命令+Nmap）
phase: 第一阶段
difficulty: ⭐ 入门
---

# Day 6：值守工具（Linux命令+Nmap）

> **阶段**：第一阶段 · 基础夯实周（零基础→初级岗达标） | **难度**：⭐ 入门 | **课时**：2-3小时

---

## 📋 今日学习目标

1. **熟练使用15个以上Linux基础命令**：cd/ls/cp/mv/rm/chmod/ps/netstat/grep/awk/sed/find/top/tail/cat/head/wc/sort/uniq，至少会用，知道什么时候用
2. **能用grep+awk+sort+uniq组合拳分析日志**：把Day 4学的日志分析方法落地为实际可执行的命令
3. **掌握Nmap三种以上扫描模式**：TCP SYN扫描(-sS)、服务版本扫描(-sV)、操作系统识别(-O)
4. **用ps/netstat排查异常进程和网络连接**：这可能是你发现入侵的第一条线索
5. **建立"常用命令宝典"**：整理一个自己的命令速查表，值守时不用百度
6. **实操目标**：用Nmap扫描靶机→用Linux命令分析日志→查出可疑进程

---

## 📖 核心知识讲解

### 一、为什么Linux命令是蓝队的基本功？

你可能觉得"有WAF、有SIEM、有各种安全设备，干嘛还要学Linux命令？"

**答案是：安全设备告诉你有攻击，Linux命令帮你验证和处置。**

```
WAF告警："来自IP X的SQL注入攻击"     ← 告诉你"有攻击"
Linux命令：grep X access.log | grep SELECT  ← 帮你验证"攻击是否成功"
Linux命令：iptables -I INPUT -s X -j DROP    ← 帮你处置"封禁IP"
Linux命令：ps aux | grep suspicious           ← 帮你排查"有没有后门"
```

**换句话说：安全设备是你的"哨兵"，Linux命令是你的"武器"。哨兵喊"有敌人"，你还得自己拿武器去打。**

---

### 二、蓝队必备Linux命令（分类精讲）

#### 2.1 文件与目录操作——"在服务器上走路"

```bash
# 基础行走
pwd                     # 我现在在哪？（Print Working Directory）
cd /var/log             # 去日志目录
ls -la /var/log         # 看目录里有什么（l=长格式，a=含隐藏文件）
ls -lt                  # 按修改时间排序（最新的在最前面）⭐ 查Webshell利器

# 查看文件内容
cat access.log          # 一次性显示整个文件（小文件适用）
tail -f access.log      # 实时跟踪文件尾部（监控日志流）⭐ 值守必备
tail -n 100 access.log  # 看最后100行
head -n 50 access.log   # 看前50行
less access.log         # 分页浏览大文件（按q退出，按/搜索）

# 文件操作
cp file1 file2          # 复制（Copy）
mv file1 /tmp/          # 移动（Move）
rm suspicious.php       # 删除（Remove）- 小心！删了就没了
mkdir evidence          # 创建目录（Make Directory）
```

**值守场景示例**：
```bash
# 检查Web目录下最近24小时内修改的文件 → 找Webshell
find /var/www/html -type f -mtime -1 -ls

# 看实时日志，盯着有没有异常请求
tail -f /var/log/nginx/access.log | grep --color -E "404|500|\.php|select"
```

---

#### 2.2 文本处理——"日志分析的瑞士军刀"

这是蓝队最核心的技能。先看**单个工具**的功能，再看**组合拳**的威力。

**grep — 筛选器，从海量文本中捞出你要的行**

```bash
# 基础用法
grep "404" access.log                    # 找所有包含404的行
grep -i "select" access.log              # 忽略大小写
grep -v "googlebot" access.log           # 排除包含googlebot的行（排除爬虫）
grep -E "union|select|1=1" access.log    # 正则：找SQL注入特征（-E启用正则）
grep -c "4625" security.evtx             # 统计匹配行数

# 值守实战用法
grep "Failed password" /var/log/secure   # 找所有SSH登录失败
grep -E " (404|500) " access.log         # 找所有404和500
grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' access.log | sort | uniq -c | sort -rn
                                         # 从access.log中提取所有IP并统计TOP N
```

**awk — 列处理器，从一行文本中提取特定字段**

```bash
# access.log格式：IP - - [时间] "请求" 状态码 大小 "referer" "UA"
# awk默认按空格分列，$1=IP, $7=URL, $9=状态码, $10=大小

awk '{print $1}' access.log              # 提取第1列（IP地址）
awk '{print $1, $7, $9}' access.log      # 提取IP、URL、状态码
awk '$9 == 404 {print $1, $7}' access.log # 只输出状态码为404的行
awk '{count[$1]++} END {for(ip in count) print count[ip], ip}' access.log
                                         # 按IP统计请求次数
```

**sort + uniq — 排序去重统计组合**

```bash
# 经典统计分析流程
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# 拆解这个组合拳每一步的作用：
# cat access.log              → 输出整个文件
# | awk '{print $1}'         → 只取IP那一列
# | sort                      → 把IP排序（uniq只能合并相邻的）
# | uniq -c                   → 统计每个IP出现了多少次
# | sort -rn                  → 按数量从高到低排序（r=逆序，n=数字排序）
# | head -10                  → 只显示前10个
```

**wc — 计数器**

```bash
wc -l access.log              # 统计文件有多少行
grep "404" access.log | wc -l # 统计有多少个404
```

**sed — 流编辑器（查找替换/提取）**

```bash
sed -n '100,200p' access.log  # 只看第100-200行
sed 's/原字符串/新字符串/g' file  # 全局替换
```

---

#### 2.3 进程与网络——"排查入侵的第一现场"

**ps — 查看进程（**这条命令可能救你的命**）**

```bash
ps aux                     # 列出所有进程的详细信息
ps aux | grep nginx        # 找nginx相关进程
ps aux --sort=-%mem | head -10  # 按内存使用排序Top10

# ⭐ 值守时发现CPU 100%，立刻执行：
ps aux --sort=-%cpu | head -10   # 按CPU使用排序Top10，看谁是"凶手"

# ⭐ 找可疑进程
ps aux | grep -E "sh|bash|python|perl|nc"  # 脚本后门常用这些
ps aux | grep -v grep | grep -E "^www-data|^apache|^nobody" 
# 找出以Web服务用户身份运行的进程（Webshell执行的特征）
```

**ps 输出列解读**：
```
USER    PID  %CPU %MEM    VSZ   RSS TTY  STAT  START   TIME COMMAND
root      1   0.0  0.1  22536  3188 ?    Ss    Jun15   0:01 /sbin/init
www-data 9999 0.0  0.2 123456 7890 ?    S     09:15   0:00 /bin/sh -c /tmp/.cache/b
                                                                     ↑↑↑↑↑↑↑↑↑
                                                    这很像Webshell执行后门命令！
```

**netstat / ss — 查看网络连接**

```bash
netstat -tlnp              # 查看所有监听端口（谁在开端口等连接？）
netstat -anp               # 查看所有网络连接和监听端口
netstat -anp | grep ESTABLISHED | grep -v ":80\|:443"
                           # 查看建立中的连接，排除80/443（只看非Web连接）
netstat -anp | grep "203.0.113.50"  # 查看某个IP的所有连接

# ⭐ 值守排查场景：
netstat -anp | grep -E "ESTABLISHED" | grep -v "127.0.0.1"
# → 看有哪些"非本地"的外连，如果是非80/443/22端口，高度可疑
```

**ss命令（netstat的现代替代）**：
```bash
ss -tlnp                  # 看监听端口
ss -anp | grep ESTAB      # 看已建立的连接
```

---

#### 2.4 系统资源监控

```bash
top                        # 实时看系统资源（CPU/内存/进程），按q退出
htop                       # 增强版（更直观，但需要额外安装）
free -h                    # 看内存使用情况（h=人类可读格式）
df -h                      # 看磁盘使用情况（Disk Free）
du -sh /var/www/html/      # 看某个目录占了多少空间（Disk Usage）
uptime                     # 系统运行了多久、负载如何
```

**值守排查场景**：
```bash
# 服务器突然很卡，快速排查"三板斧"：
top                        # ① 看CPU/内存谁在"吃资源"
netstat -anp | grep ESTAB | wc -l  # ② 网络连接数是否异常
df -h                      # ③ 磁盘是不是被写满了（勒索/日志爆炸）
```

---

#### 2.5 用户与权限

```bash
who                        # 当前谁登录了？
w                          # 更详细：谁登录了、在执行什么命令？
last                       # 查看历史登录记录
lastlog                    # 每个用户的最后登录时间
cat /etc/passwd            # 查看所有用户账户
cat /etc/shadow            # 查看密码hash（需要root）
cat /etc/group             # 查看所有用户组
history                    # 查看当前用户的命令历史
```

**值守排查场景**：
```bash
# 怀疑被入侵，检查有没有新增的后门用户：
cat /etc/passwd | grep -E "/bin/bash|/bin/sh" | grep -v "nologin"
# → 列出所有能登录shell的用户，检查有没有不认识的

# 查看root用户最近的命令历史
cat /root/.bash_history | tail -50
```

---

#### 2.6 find — "搜索大杀器"

```bash
# ⭐⭐⭐ 值守排查最常用：
find / -name "*.php" -mtime -1           # 全盘找最近1天修改的php文件
find /var/www -type f -mmin -30          # 找最近30分钟修改的文件
find / -perm -4000 -o -perm -2000 2>/dev/null  # 找SUID/SGID文件（提权后门）
find / -size +100M 2>/dev/null           # 找大于100MB的文件
find / -name "*backdoor*" -o -name "*shell*" 2>/dev/null  # 找后门文件
find /var/www -name "*.php" -newer /var/www/index.php
                                         # 找比index.php更新的php文件
```

---

### 三、Nmap — "网络侦查的第一工具"

Nmap就像蓝队的**望远镜**——让你看见网络上有哪些主机、开了哪些端口、运行着什么服务。

#### 3.1 三种常用扫描模式

| 模式 | 命令参数 | 速度 | 隐蔽性 | 信息量 | 适用场景 |
|------|---------|------|--------|--------|---------|
| TCP SYN 扫描 | `-sS` | 快 | 较高 | 端口状态 | 日常使用（默认） |
| 服务版本扫描 | `-sV` | 慢 | 低 | 端口+服务版本 | 资产盘点 |
| OS 识别 | `-O` | 中 | 低 | OS猜测 | 主机摸排 |

```bash
# 基础扫描一台主机
nmap 192.168.1.10                    # 扫描最常见的1000个端口

# 扫描指定端口
nmap -p 80,443,3306 192.168.1.10     # 只扫80/443/3306端口
nmap -p 1-1000 192.168.1.10           # 扫描1-1000端口
nmap -p- 192.168.1.10                 # 扫描所有65535个端口（慢！）

# 探测服务版本和操作系统
nmap -sV 192.168.1.10                # 服务版本探测
nmap -O 192.168.1.10                 # 操作系统识别
nmap -A 192.168.1.10                 # 全面探测（= -sV + -O + 脚本扫描）

# 扫描整个网段
nmap -sS 192.168.1.0/24              # 扫描C段254台主机
nmap -sn 192.168.1.0/24              # Ping扫描（只发现存活主机，不扫端口）
```

#### 3.2 Nmap 输出解读

```bash
$ nmap -sV 192.168.1.10

PORT     STATE    SERVICE   VERSION
22/tcp   open     ssh       OpenSSH 7.4 (protocol 2.0)
80/tcp   open     http      Apache httpd 2.4.6
443/tcp  open     ssl/http  Apache httpd 2.4.6
3306/tcp open     mysql     MySQL 5.5.68
8080/tcp filtered http-proxy
```

**字段解读**：

| 字段 | 含义 | 蓝队关注 |
|------|------|---------|
| PORT | 端口号 + 协议(tcp/udp) | 非预期端口=可疑 |
| STATE | open=开着 / closed=关了 / filtered=被防火墙挡了 | open的每个都要有"理由" |
| SERVICE | 识别出的服务类型 | 与实际业务比对 |
| VERSION | 服务版本号 | **版本号→查已知漏洞** |

**蓝队分析思路**：
1. 列出所有 open 端口 → 与资产表比对 → 有"多余"的端口？→ 可能是后门
2. 查看版本号 → 在漏洞库中搜索 → 有已知高危漏洞？→ 需要立即修复
3. 3306(MySQL)对外开放？→ 不应该！→ 检查防火墙策略

---

### 四、"值守三板斧"——日常排查标准流程

当你坐进值守位，每2小时做一次主动排查：

```bash
# 第一板斧：看呼吸（系统是否还活着）
uptime                   # 负载情况
free -h                  # 内存
df -h                    # 磁盘
top -bn1 | head -5       # CPU进程Top

# 第二板斧：看日志（有没有人在敲门）
tail -n 200 /var/log/secure | grep "Failed password" | wc -l  # SSH暴力破解量
tail -n 200 /var/log/nginx/access.log | grep " 404 " | awk '{print $1}' | sort | uniq -c | sort -rn | head -5
                         # 最近200行中，谁在大量产生404（扫描）？

# 第三板斧：看网络（有没有异常流量）
netstat -anp | grep ESTABLISHED | grep -v "127.0.0.1" | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -10
                         # 当前连接数最多的外部IP Top10
```

---

## 🔧 实操任务

### 任务1：日志分析实战命令（20分钟）

用以下命令组合完成一个常见的值守分析任务：

**场景**：给你一段 Web 访问日志（access.log），请完成以下分析：

```bash
# ① 统计日志总行数
wc -l access.log

# ② 找出访问量最大的10个IP
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# ③ 统计状态码分布
cat access.log | awk '{print $9}' | sort | uniq -c | sort -rn

# ④ 找出所有404的请求路径（去重排序）
grep " 404 " access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -10

# ⑤ 找出所有包含SQL注入特征的请求
grep -iE "(union.*select|select.*from|1=1|sleep\()" access.log

# ⑥ 找出非标准User-Agent的请求（可能是工具发起的）
cat access.log | awk -F'"' '{print $6}' | sort | uniq -c | sort -rn | head -10

# ⑦ 统计每个小时的请求量分布（看看有没有异常的"凌晨高峰"）
cat access.log | awk '{print $4}' | cut -d: -f2 | sort | uniq -c
```

### 任务2：Nmap资产扫描（15分钟）

```bash
# 假设你有权限对测试网段做扫描：
# ① Ping扫描——看网段里有哪些存活主机
nmap -sn 192.168.1.0/24

# ② 对存活主机做详细端口扫描
nmap -sS -sV 192.168.1.10

# ③ 写一份简单的扫描报告：
# - 开放了哪些端口？
# - 每个端口运行什么服务？什么版本？
# - 有没有不应该开放的端口？
# - 有没有存在已知漏洞的版本？
```

### 任务3：模拟入侵排查（25分钟）

**场景**：你发现一台Web服务器（192.168.1.100）CPU和网络流量异常高。请执行以下排查步骤：

```bash
# 第一步：看谁在吃资源
top -bn1 | head -20
# 预期发现：一个名为 "xmr" 的进程占用99% CPU → 可能是挖矿程序

# 第二步：看这个进程的详细信息
ps aux | grep xmr
# 记录进程的PID、启动用户、启动时间

# 第三步：看进程在哪
ls -la /proc/[PID]/
cat /proc/[PID]/cmdline    # 进程的启动命令
ls -la /proc/[PID]/exe     # 进程的可执行文件路径

# 第四步：看网络连接
netstat -anp | grep [PID] | grep ESTABLISHED
# 看挖矿程序连接到了哪些外部IP和端口（通常是矿池地址）

# 第五步：看文件
find / -name "xmr*" -type f 2>/dev/null
find / -name "*.sh" -mtime -3 2>/dev/null  # 最近3天创建的shell脚本

# 第六步：看启动项（怎么持久化的）
crontab -l -u www-data           # 看www-data用户的计划任务
cat /etc/crontab                  # 看系统级计划任务
ls -la /var/spool/cron/           # 看所有用户的计划任务文件
```

---

## ✅ 验收标准

- [ ] 能在不看笔记的情况下敲出grep/awk/sort/uniq组合命令分析日志
- [ ] 能用ps/top/netstat三件套完成一次主机安全巡检
- [ ] 能用Nmap做端口扫描并解读输出
- [ ] 能用find命令在3分钟内定位最近修改的可疑文件
- [ ] 会执行"值守三板斧"流程（看呼吸→看日志→看网络）
- [ ] 能看懂每条命令的输出并做出安全判断

---

## 📝 今日小结

今天学的是蓝队**手上功夫**——Linux命令和Nmap。它们是你在值守台上的**肌肉记忆**。

**两个核心思想**：
1. **命令是工具，场景是关键**。不要孤立地学命令，要知道什么场景用什么命令
2. **组合拳 > 单打独斗**。grep+awk+sort+uniq的威力远大于单个命令之和

**记住这三句命令**，它们是值守中最常用的：
```bash
# ① 查日志中的攻击者
grep "404" access.log | awk '{print $1}' | sort | uniq -c | sort -rn
# ② 查系统是不是被搞了
ps aux --sort=-%cpu | head -10 && netstat -anp | grep ESTABLISHED | grep -v 127.0.0.1 | wc -l
# ③ 查有没有新文件（后门）
find /var/www -type f -mtime -1 -ls
```

---

## 📚 延伸阅读

- 《鸟哥的Linux私房菜》- 经典Linux入门教材
- Nmap官方手册：https://nmap.org/book/man.html
- explainshell.com — 粘贴命令，逐项解释每个参数的含义
- Linux Security Cookbook

---

## 🎯 蓝队面试高频题（Day 6 主题）

**Q1：如何在一台Linux服务器上做安全巡检？说出你会执行的10步检查。**

> 回答：① uptime + free -h + df -h → 系统资源健康检查；② top / ps aux → 看CPU/内存占用最高的进程，识别异常进程；③ netstat -anp / ss -anp → 查看所有网络连接和监听端口，检查是否有可疑的外部连接或后门端口；④ last → 查看历史登录记录，检查是否有异常登录；⑤ cat /etc/passwd | grep bash → 检查是否有新增的可登录账户；⑥ crontab -l 和 /etc/crontab → 检查计划任务，是否被添加了恶意任务；⑦ find / -mtime -1 -type f → 查找最近一天修改的文件；⑧ history → 查看root和其他用户的命令历史；⑨ iptables -L / firewall-cmd --list-all → 查看防火墙规则是否正常；⑩ 查看关键日志：/var/log/secure（登录）、/var/log/messages（系统）、应用日志。

**Q2：grep、awk、sed的区别和使用场景？**

> 回答：grep是**行筛选器**——从文本中找出包含指定模式的行（grep "404" access.log → 只保留有404的行）；awk是**列处理器**——按分隔符拆分每行，然后对特定列做操作（awk '{print $1, $7}' access.log → 只输出IP和URL）；sed是**流编辑器**——对文本做查找替换、插入删除等操作（sed 's/原IP/新IP/g' file → 批量替换IP）。简单记：grep找行，awk取列，sed改内容。实际使用中三者经常组合：先用grep筛选、再用awk提取字段、必要时用sed修改。

**Q3：Nmap的 -sS 和 -sV 有什么区别？为什么默认用 -sS？**

> 回答：-sS 是TCP SYN半开扫描，只发送SYN包，如果收到SYN+ACK就认为端口开放，然后立即发送RST断开（不完成完整的三次握手），所以速度快、日志痕迹少、很多应用服务根本记录不到；-sV 是服务版本探测，需要完成完整的TCP连接并与服务交互以识别具体的软件名称和版本号，所以更慢但信息更丰富。日常扫描先用 -sS 快速确定有哪些端口开放，再对感兴趣的端口用 -sV 获取详细版本信息。默认用 -sS 是因为速度和隐蔽性的平衡最好。

**Q4：如何查找一台Linux服务器上最近被修改过的文件？**

> 回答：首选 `find` 命令。① `find /var/www -type f -mtime -1` 查找最近1天（24小时）修改的文件；② `find / -type f -mmin -30` 查找最近30分钟修改的文件；③ `find /var/www -name "*.php" -newer /var/www/index.php` 查找比index.php更新的php文件（找Webshell常用）；④ `find / -type f -mtime -1 -size +10k` 查找最近1天修改且大小超过10K的文件；⑤ 加 `-ls` 参数可以同时显示详细信息：`find /var/www -type f -mtime -1 -ls`。

---

## 📖 深度补充内容

### 命令速查卡（打印贴在工位！）

```
┌────────────── 蓝队值守命令速查卡 ──────────────┐
│                                                  │
│ 【日志分析】                                     │
│ grep "4625" security.log | wc -l     暴力破解量  │
│ grep "404" access.log|awk '{print $1}'|sort|uniq │
│   -c|sort -rn|head   TOP扫描IP                   │
│ tail -f access.log|grep --color "404\|500"       │
│                        实时监控错误/攻击          │
│                                                  │
│ 【系统排查】                                     │
│ ps aux --sort=-%cpu|head -5  CPU TOP5进程        │
│ netstat -anp|grep ESTAB|grep -v 127|wc -l  外连数│
│ last -n 20              最近20次登录记录          │
│ crontab -l              当前用户计划任务          │
│                                                  │
│ 【文件排查】                                     │
│ find /var/www -mtime -1 -name "*.php" -ls        │
│ find / -perm -4000 2>/dev/null   找SUID文件      │
│                                                  │
│ 【防火墙操作】                                   │
│ iptables -I INPUT -s IP -j DROP   封禁IP         │
│ iptables -L -n                   查看规则         │
│ iptables -D INPUT 1              删除第1条规则    │
└──────────────────────────────────────────────────┘
```

---

## ⚠️ 新手常见误区纠正

1. **误区**："命令参数太长背不下来，每次都百度"
   - **真相**：常用命令参数每天用10次以上，一周就形成肌肉记忆。关键不是死记，而是理解每个参数的意义
   - **正确做法**：理解 `-l`=long, `-a`=all, `-r`=reverse, `-n`=numeric，触类旁通

2. **误区**："所有操作都用root账户"
   - **真相**：root是"核按钮"，日常值守排查用普通账户足够。用root操作如果误删文件后果严重
   - **正确做法**：日常用普通账户，必要时sudo，始终保持"最小权限原则"

3. **误区**："ps aux|grep 可疑进程名"就够了
   - **真相**：攻击者常常把后门命名为"合法"进程名（如 httpd、crond），你要看进程路径、启动时间、父进程
   - **正确做法**：用 `ps auxf` 看进程树（f=forest），用 `ls -la /proc/[PID]/exe` 看实际路径

4. **误区**："nmap -A 全部扫一遍"
   - **真相**：-A 扫描非常慢且流量大，生产环境做全面扫描可能影响业务或被IDS报警
   - **正确做法**：先 -sn 发现存活→再 -sS 扫端口→最后对感兴趣的端口用 -sV

---

## 🏋️ 额外实操挑战

### 挑战1：编写你的"值守脚本"
把"值守三板斧"写成一个可执行的shell脚本 `patrol.sh`，运行就输出一份简洁的安全巡检报告。

### 挑战2：Nmap扫描练习
在你的测试环境（如Metasploitable/DVWA）执行一次Nmap扫描，写出完整的端口/服务/版本清单，并标记出存在的已知漏洞。

### 挑战3：命令组合题
用一条命令实现：找出access.log中访问了.php文件、返回状态码不是200也不是404的所有IP和URL。

---

## 🎯 实战思维训练

### 蓝队"条件反射"训练

| 看到现象 | 想到的命令 | 目的 |
|---------|-----------|------|
| CPU突然100% | `top -bn1 \| head -20` | 找出罪魁祸首进程 |
| 磁盘空间暴降 | `find / -size +100M -mtime -1` | 找突然出现的大文件 |
| 连接数异常 | `netstat -anp \| grep ESTAB \| wc -l` | 统计总量 |
| 新文件出现 | `find /var/www -mtime -1 -type f` | 定位新文件 |
| SSH登录异常 | `last \| head -20` 和 `grep Accepted /var/log/secure` | 查看登录记录 |

---

## 📈 学习效果自检

1. 不查资料，能写出统计access.log中访问量TOP10 IP的完整命令吗？
2. `ps aux --sort=-%mem` 会输出什么？各个列代表什么意思？
3. `netstat -tlnp` 中 `-t` `-l` `-n` `-p` 分别代表什么？
4. Nmap 的 `-sS` 和 `-sV` 有什么区别？分别在什么场景使用？
5. 如何用 find 命令在一台服务器上快速找到最近1小时内在 /var/www 下新增的 .php 文件？

---

## 🔗 知识链接

- **前置依赖**：Day 4 日志分析（今天学的命令是把分析思路落地执行）
- **后续关联**：Day 7 第一阶段考核（会给一段日志让你用命令分析）
- **横向关联**：Day 8 WAF绕过检测（需要命令分析绕过特征）
- **岗位对标**：整个值守生涯每天都要用这些命令

---

## 📓 学习笔记模板

```
【知识卡片：值守工具（Linux+Nmap）】
日期：
核心命令速记：

【日志三件套】
grep  → 筛选行
awk   → 提取列
sort/uniq → 统计

【进程排查三件套】
ps    → 看进程
top   → 看资源
netstat → 看网络

【Nmap】
-sS → 快速扫端口
-sV → 识别服务版本
-O  → 猜操作系统
-A  → 全能扫

【值守诗句】（帮助记忆三句核心命令）
一看404找扫描（grep 404 | awk | sort | uniq -c）
二看进程找异常（ps aux --sort=-%cpu | head）
三看外连抓后门（netstat -anp | grep ESTAB）

## 🛠️ 深度扩展：生产环境的"值守自动化"

### 编写值守巡检脚本

以下是一个可以直接使用的完整值守脚本 `patrol.sh`，运行后生成巡检报告：

```bash
#!/bin/bash
# ═══════════════════════════════════════════
# patrol.sh — 蓝队值守巡检脚本 v1.0
# 用法：bash patrol.sh
# 输出：当前目录下生成 patrol_report_YYYYMMDD_HHMMSS.txt
# ═══════════════════════════════════════════

REPORT="patrol_report_$(date +%Y%m%d_%H%M%S).txt"
{
    echo "╔══════════════════════════════════════════════════╗"
    echo "║     蓝队值守巡检报告                              ║"
    echo "║     时间：$(date '+%Y-%m-%d %H:%M:%S')           ║"
    echo "║     主机：$(hostname)                            ║"
    echo "║     IP：$(hostname -I | awk '{print $1}')        ║"
    echo "╚══════════════════════════════════════════════════╝"
    echo ""
    
    # ─── 第一板斧：看呼吸（系统健康）───
    echo "═══════════════════════════════════════════════════"
    echo "【第一板斧：系统健康检查】"
    echo "═══════════════════════════════════════════════════"
    
    echo ""
    echo ">>> 系统负载："
    uptime
    echo ""
    
    echo ">>> 内存使用："
    free -h
    echo ""
    
    echo ">>> 磁盘使用："
    df -h | grep -vE "tmpfs|devtmpfs|squashfs"
    echo ""
    
    echo ">>> CPU TOP5进程："
    ps aux --sort=-%cpu | head -6 | tail -5 | awk '{printf "  PID=%-6s CPU=%-5s MEM=%-5s CMD=%s\n", $2, $3"%", $4"%", $11}'
    echo ""
    
    echo ">>> 内存 TOP5进程："
    ps aux --sort=-%mem | head -6 | tail -5 | awk '{printf "  PID=%-6s CPU=%-5s MEM=%-5s CMD=%s\n", $2, $3"%", $4"%", $11}'
    echo ""
    
    # ─── 第二板斧：看日志（攻击检测）───
    echo "═══════════════════════════════════════════════════"
    echo "【第二板斧：攻击检测】"
    echo "═══════════════════════════════════════════════════"
    
    echo ""
    echo ">>> SSH暴力破解（最近1小时失败登录TOP10 IP）："
    grep "$(date +"%b %e %H")" /var/log/secure 2>/dev/null | \
        grep "Failed password" | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head -10
    echo ""
    
    echo ">>> SSH成功登录（最近24小时）："
    grep "Accepted" /var/log/secure 2>/dev/null | tail -10 | \
        awk '{print $1,$2,$3, "用户:",$9, "来自:",$11}'
    echo ""
    
    echo ">>> 最近sudo操作："
    grep "sudo:" /var/log/secure 2>/dev/null | tail -10 | \
        awk -F';' '{print $1, $NF}'
    echo ""
    
    if [ -f /var/log/nginx/access.log ]; then
        echo ">>> Nginx 状态码分布（最近1000行）："
        tail -1000 /var/log/nginx/access.log 2>/dev/null | \
            awk '{print $9}' | sort | uniq -c | sort -rn
        echo ""
        
        echo ">>> Nginx 404 TOP5 IP（最近1000行）："
        tail -1000 /var/log/nginx/access.log 2>/dev/null | \
            grep " 404 " | awk '{print $1}' | sort | uniq -c | sort -rn | head -5
        echo ""
        
        echo ">>> Nginx 访问量 TOP5 IP（最近1000行）："
        tail -1000 /var/log/nginx/access.log 2>/dev/null | \
            awk '{print $1}' | sort | uniq -c | sort -rn | head -5
        echo ""
    fi
    
    # ─── 第三板斧：看网络（连接状态）───
    echo "═══════════════════════════════════════════════════"
    echo "【第三板斧：网络连接检查】"
    echo "═══════════════════════════════════════════════════"
    
    echo ""
    echo ">>> 监听端口："
    ss -tlnp 2>/dev/null | awk '{if(NR>1) print "  "$0}' || netstat -tlnp 2>/dev/null | awk '{if(NR>1) print "  "$0}'
    echo ""
    
    echo ">>> 连接状态统计："
    ss -s 2>/dev/null || netstat -an | awk '/^tcp/ {print $6}' | sort | uniq -c | sort -rn
    echo ""
    
    echo ">>> 外部ESTABLISHED连接TOP10 IP："
    ss -tan state established 2>/dev/null | awk '{print $5}' | cut -d: -f1 | \
        grep -v "127.0.0.1" | sort | uniq -c | sort -rn | head -10
    echo ""
    
    # ─── 第四板斧：看文件（变更监控）───
    echo "═══════════════════════════════════════════════════"
    echo "【第四板斧：文件变更检查】"
    echo "═══════════════════════════════════════════════════"
    
    echo ""
    echo ">>> 最近24小时修改的php文件（Webshell检测）："
    find /var/www -name "*.php" -mtime -1 -ls 2>/dev/null | head -20
    echo ""
    
    echo ">>> 最近24小时在/tmp创建的可执行文件："
    find /tmp -type f -mtime -1 -executable -ls 2>/dev/null | head -10
    echo ""
    
    echo ">>> 隐藏文件和目录（.开头）："
    find / -name ".*" -type f -mtime -1 -not -path "/proc/*" -not -path "/sys/*" 2>/dev/null | head -10
    echo ""
    
    # ─── 汇总异常标记 ───
    echo "═══════════════════════════════════════════════════"
    echo "【汇总告警标记】"
    echo "═══════════════════════════════════════════════════"
    echo ""
    
    ALERTS=0
    # 检查点1：CPU使用率 > 90%
    CPU_LOAD=$(uptime | awk -F'load average:' '{print $2}' | awk -F',' '{print $1}' | tr -d ' ')
    if [ "$(echo "$CPU_LOAD > $(nproc)" | bc 2>/dev/null)" = "1" ]; then
        echo "⚠️  【告警】CPU负载超过核心数！当前负载：$CPU_LOAD，核心数：$(nproc)"
        ALERTS=$((ALERTS+1))
    fi
    
    # 检查点2：磁盘使用率 > 85%
    DISK_USE=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
    if [ "$DISK_USE" -gt 85 ] 2>/dev/null; then
        echo "⚠️  【告警】磁盘使用率超过85%！当前：${DISK_USE}%"
        ALERTS=$((ALERTS+1))
    fi
    
    # 检查点3：SYN_RECV异常
    SYN_RECV=$(ss -s 2>/dev/null | grep synrecv | awk '{print $2}')
    if [ -n "$SYN_RECV" ] && [ "$SYN_RECV" -gt 100 ] 2>/dev/null; then
        echo "⚠️  【告警】SYN_RECV半开连接数异常！当前：$SYN_RECV"
        ALERTS=$((ALERTS+1))
    fi
    
    # 检查点4：SSH暴力破解量
    BRUTE_COUNT=$(grep "$(date +"%b %e %H")" /var/log/secure 2>/dev/null | grep "Failed password" | wc -l)
    if [ "$BRUTE_COUNT" -gt 50 ] 2>/dev/null; then
        echo "⚠️  【告警】最近1小时SSH失败次数：${BRUTE_COUNT}次（疑似暴力破解）"
        ALERTS=$((ALERTS+1))
    fi
    
    if [ "$ALERTS" -eq 0 ]; then
        echo "✅  未发现异常告警，系统状态正常"
    else
        echo ""
        echo "⚠️  共发现 ${ALERTS} 条异常告警，建议进一步排查"
    fi
    
    echo ""
    echo "═══════════════════════════════════════════════════"
    echo "  巡检完成时间：$(date '+%Y-%m-%d %H:%M:%S')"
    echo "═══════════════════════════════════════════════════"
    
} | tee "$REPORT"

echo ""
echo "📄 报告已保存至：$REPORT"
```

---

### Nmap高级用法补充

```bash
# Nmap脚本引擎（NSE）— 蓝队资产盘点利器

# 扫描常见Web漏洞（非破坏性）
nmap --script http-sql-injection -p 80,443 192.168.1.10
nmap --script http-shellshock --script-args uri=/cgi-bin/test.cgi 192.168.1.10

# 枚举SSL证书（获取域名/组织/有效期信息）
nmap --script ssl-cert -p 443 192.168.1.10

# 枚举HTTP方法（OPTIONS请求，看是否支持PUT/DELETE等危险方法）
nmap --script http-methods -p 80,443 192.168.1.10

# 检查是否存在默认/常见web应用
nmap --script http-enum -p 80,443 192.168.1.10
# → 自动发现 /phpmyadmin/ /wp-admin/ /manager/html 等

# 检测SMB漏洞（MS17-010永恒之蓝！）
nmap --script smb-vuln-ms17-010 -p 445 192.168.1.0/24

# 批量扫描并输出到文件
nmap -sS -sV -oA scan_result 192.168.1.0/24
# -oA = 同时输出三种格式：.nmap .xml .gnmap

# 只输出开放端口的IP（用于快速资产盘点）
nmap -sS -p 22,80,443,3306,3389 --open 192.168.1.0/24 -oG - | grep "/open/"
```

---

### Linux排查命令的"三板斧二期"

当你发现可疑进程和网络连接后，如何深入调查：

```bash
# ─── 第一层：进程溯源 ───
# 从可疑PID出发，查看进程树
pstree -p [PID]                    # 看进程的父子关系
ps -ef | grep [PID]                # 看进程的完整命令行
cat /proc/[PID]/cmdline            # 看进程启动时的完整命令
cat /proc/[PID]/environ            # 看进程的环境变量（可能含敏感信息）
ls -la /proc/[PID]/fd              # 看进程打开了哪些文件/网络套接字
lsof -p [PID]                      # 更详细的文件和网络连接

# 如果进程文件已被删除但进程仍在运行（常见恶意软件技巧）：
ls -la /proc/[PID]/exe             # 如果显示 (deleted) → 文件已删但进程还在跑！
cat /proc/[PID]/exe > /tmp/malware_recovery  # 恢复被删除的可执行文件

# ─── 第二层：网络溯源 ───
# 从可疑IP/端口出发，反向找进程
lsof -i :4444                      # 哪个进程在4444端口上通信？
ss -tanp | grep "203.0.113.50"     # 哪个进程连了这个IP？
netstat -anp | grep "[PID]"        # 某个进程的所有网络连接

# ─── 第三层：持久化溯源 ───
# 找出恶意进程是怎么"活下来"的
systemctl list-units --type=service | grep -i suspicious  # systemd服务
ls -la /etc/systemd/system/*.service                       # 自定义服务
ls -la /etc/init.d/                                        # SysV init脚本
crontab -l -u [USER]                                       # 用户级定时任务
for user in $(cut -f1 -d: /etc/passwd); do 
    echo "=== $user ==="; crontab -l -u $user 2>/dev/null
done                                                        # 枚举所有用户的crontab
cat /etc/rc.local                                           # 开机自启动脚本
```

---

## 🔧 实战场景练习

### 练习A：应急排查全流程

**场景**：凌晨2点，你接到告警——某台Web服务器（192.168.1.100）的网络流量异常增加，出站流量突然从正常的10Mbps飙到200Mbps。

请写出你的10步排查流程：

```
① ssh连接到服务器 → 确认能连上，系统还在运行
② uptime → 看负载是否异常高
③ ps aux --sort=-%cpu | head -10 → 找出CPU大户
④ netstat -anp | grep ESTABLISHED | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -10
   → 看哪个外部IP被连接最多（数据外传的目标）
⑤ tcpdump -i eth0 -nn -c 100 → 抓包看看出站流量在传什么
⑥ ls -la /proc/[可疑PID]/ → 对可疑进程做详细检查
⑦ lsof -p [可疑PID] → 看进程打开了哪些文件
⑧ find /var/www -name "*.php" -mtime -1 -ls → 查是否有新上传的Webshell
⑨ grep "POST.*upload" /var/log/nginx/access.log | tail -20 → 查最近的上传记录
⑩ 封禁目标IP + 隔离服务器 + 保存证据 + 写报告
```

### 练习B：Nmap的"红蓝双用"思维

```
红队用Nmap做什么：
  → 发现开放端口 = 攻击面
  → 识别服务版本 = 找已知漏洞
  → 识别操作系统 = 定向攻击

蓝队用Nmap做什么：
  → 资产盘点 = 我到底跑了哪些服务？
  → 配置审计 = 有没有不该开放的端口？
  → 基线比对 = 和上次扫描结果对比，有没有新增端口？
  → 合规检查 = 是否满足安全基线（如MySQL不应该对外）
```

---

## 📊 日常安全巡检的"结果分析"——从输出到决策

巡检脚本跑完了，生成了一堆输出。真正体现蓝队价值的是你怎么"读"这些输出：

```markdown
【巡检结果分析的四类判断】

判断1：CPU高负载 = 正常还是异常？
  正常情况：
    → 业务高峰期（如电商的双11/618）CPU 80-90% = 正常
    → 数据库正在执行定时备份/归档 → CPU短时间飙升 = 正常
    → 编译服务器正在构建项目 → CPU接近100% = 正常
  异常情况：
    → 凌晨3点业务空闲时CPU持续 > 90% → 异常！
    → 平时CPU 20%的服务器突然飙到80%且持续 → 异常！
    → CPU高但top中看不到高CPU进程（进程名以.开头/被隐藏）→ 异常！
  
  关键：CPU负载必须结合"时间 + 业务背景"来判断。
  与其背"CPU超过80%就告警"，不如学会问："这个时间点，这台服务器应该在干什么？"

判断2：网络连接 = 正常还是恶意？
  正常连接：
    → Web服务器连数据库服务器（3306端口）= 正常业务连接
    → 内网服务器连外部NTP服务器（123端口）= 正常时间同步
    → DNS服务器连外部53端口 = 正常DNS查询
  可疑连接：
    → Web服务器连境外IP的4444/8080/4443端口 → 可能是反弹Shell
    → 财务部门电脑连数据库服务器 → 财务人员不应该直接连DB
    → 打印机的IP在凌晨发起外部连接 → 打印机不应该有这种行为
  
  关键：建立"每类资产应有的网络行为基线"。
  Web服务器应该连什么？DB服务器应该连什么？域控应该连什么？

判断3：进程变化 = 正常更新还是恶意植入？
  正常新增进程：
    → yum/apt更新后新增的系统进程
    → 运维部署的新业务进程
    → 安全软件自身的更新
  可疑新增进程：
    → /tmp /dev/shm /var/tmp 目录下的可执行文件
    → 进程名模仿系统进程但有拼写差异（systemd-update vs systemd-updated）
    → Web服务器用户（www-data/apache/nginx）运行的bash/sh进程
    → 进程的父进程异常（Web进程→bash→curl链条 = WebShell执行）
  
  关键：不只看"有什么进程"，还要看"进程是谁创建的（父进程）"

判断4：文件变更 = 正常还是后门？
  正常变更：
    → 运维人员部署的新版本Web文件（有计划、有记录）
    → 日志文件的正常增长
    → 缓存文件的更新
  可疑变更：
    → Web目录中出现了从未部署过的.php/.jsp/.asp文件
    → 文件的创建时间是凌晨/非工作时间
    → 文件所有者是Web服务用户（www-data等）而非开发/运维用户
    → 文件被放在了不应该出现的位置（如/images目录下有.php文件）
```

**巡检中"直觉"的养成：**

```markdown
新手看巡检结果："CPU正常、内存正常、磁盘正常、网络正常 → 没问题"
老手看巡检结果："CPU正常、内存正常 → 但syslog中有一条'segfault'、
  网络连接中有一个3389端口连接（这台服务器不应该有RDP！）→ 有问题！"
  
直觉不是"猜"，是你脑子里有一个"正常画像"——你知道这台服务器
"平时应该是什么样子"。任何偏离这个"正常画像"的数据点，
即使看起来无害，也可能是攻击的痕迹。

如何建立"正常画像"？
  → 在你"空闲"的时候（没错，安全工程师要学会在没出事时做功课），
    花时间去了解你负责的每台服务器：
    ① 它是干什么的？（Web/DB/文件/代理...）
    ② 它正常情况下应该运行哪些进程？
    ③ 它应该有哪些网络连接？（连谁、被谁连）
    ④ 它什么时候是业务高峰期、什么时候是空闲？
    ⑤ 它的正常CPU/内存/磁盘使用范围是什么？
  → 把这些信息记录在你的"资产台账"中
  → 这样当巡检发现异常时，你不需要Google"这个正常吗"，你心里已经有答案
```

---

## 🛡️ 蓝队日常巡检的"上报与记录"——让你的工作被看见

```markdown
很多蓝队新人做了大量巡检工作，但领导和同事不知道。不是他们不关心，
而是你没有"翻译"你的工作成果。以下是巡检记录的"正确姿势"：

❌ 差记录：
  "今日巡检：服务器A正常、服务器B正常、服务器C正常。无异常。"

✅ 好记录：
  "今日巡检3台核心Web服务器，覆盖9个检查项（CPU/内存/磁盘/进程/网络/
   登录/定时任务/Webshell/SUID文件），完成时间10:15-10:45。
   正常项：24/27，异常项：3/27。
   异常1：Web-02的/tmp目录发现可疑可执行文件systmd（伪装systemd），
   已隔离并取证，待进一步分析（工单#SEC-2024-0421）。
   异常2：Web-03的/var/log/auth.log有3次来自境外IP的失败SSH登录，
   已封禁IP并持续监控。
   异常3：三台服务器的nginx访问日志中均发现同IP的目录扫描行为，
   频率约200请求/分钟，持续约5分钟。已加入WAF监控规则。
  → 建议：统一检查所有Web服务器的/tmp目录是否有类似可疑文件。"

这个好记录的价值：
  → 组长立刻知道：你今天做了实质性工作、发现了真实威胁
  → 其他分析师看到：知道这些异常的存在，交班不会遗漏
  → 一个月后复盘：可以追溯到"这个恶意文件是什么时候发现的、怎么处置的"
```

---

未解决的问题：
```
