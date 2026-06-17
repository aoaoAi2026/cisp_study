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
