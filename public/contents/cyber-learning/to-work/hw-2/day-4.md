---
day: 4
title: Linux系统基础（上）
phase: 第一阶段
difficulty: ⭐ 入门
---

# Day 4：Linux系统基础（上）

> **阶段**：第一阶段 · 蓝队极速上岗 | **难度**：⭐ 入门 | **课时**：3-4小时

---

## 📋 今日学习目标

1. 理解为什么蓝队必须会Linux
2. 了解虚拟机概念，完成VirtualBox/VMware+Linux系统安装
3. 理解Linux文件系统目录结构（每个目录是干什么的）
4. 熟练使用15个以上Linux基础命令
5. 能够在Linux中完成目录和文件的基本操作

---

## 📖 核心知识讲解

### 一、为什么蓝队必须学Linux？

可能你会想：我平时用的是Windows啊，为什么还要学Linux？

答案是：**互联网上绝大多数服务器跑的都是Linux。**

| 场景 | Windows | Linux |
|:---|:---|:---|
| Web服务器（Nginx/Apache） | 少 | **绝大多数** |
| 数据库服务器（MySQL/Redis） | 少 | **绝大多数** |
| 防火墙/IDS等安全设备 | 少 | **绝大多数** |
| 攻击者的工具和靶机 | 极少 | **几乎全部** |
| 安全分析工具（ELK/Wireshark） | 部分支持 | **最佳支持** |

一句话：**你不懂Linux，就看不懂被攻击服务器的日志，也排查不了Linux服务器上的安全问题。**

### 二、虚拟机——在你的电脑里再装一个"电脑"

虚拟机就像一个软件，可以在你的Windows电脑里再模拟出一台"电脑"，你可以在这台假电脑里安装Linux系统而**不影响你原来的Windows系统**。

**免费选择：**
- **VirtualBox**（Oracle出品，完全免费，入门首选）
- **VMware Workstation Player**（免费个人版，性能更好）

**安装步骤概览（以VirtualBox为例）：**

1. 去 [virtualbox.org](https://www.virtualbox.org) 下载安装VirtualBox
2. 去 [kali.org](https://www.kali.org) 下载Kali Linux的VirtualBox镜像
3. 在VirtualBox中"新建"→选Linux/Debian→分配内存（建议2GB以上）→使用下载的镜像文件
4. 启动虚拟机，进入Linux系统

> 💡 **小贴士**：如果电脑配置不高，可以安装更轻量的Ubuntu Server（无图形界面），命令行一样用。

### 三、Linux文件系统——像一棵倒挂的树

Linux没有C盘D盘，所有东西都在一个根目录 `/` 下面，像一棵倒挂的树：

```
/                          ← 根目录（一切从这里开始）
├── /bin                   ← 基础命令（ls, cp, mv等）
├── /boot                  ← 启动文件（不要乱动）
├── /dev                   ← 设备文件（硬盘、U盘等抽象成文件）
├── /etc                   ← 配置文件（很重要！各种软件的配置都在这）
│   ├── /etc/passwd        ← 用户信息
│   └── /etc/shadow        ← 密码信息
├── /home                  ← 普通用户的家目录（像Windows的"我的文档"）
│   └── /home/kali         ← kali用户的家
├── /root                  ← root（超级管理员）的家目录
├── /tmp                   ← 临时文件（重启后清空）
├── /usr                   ← 用户安装的软件
├── /var                   ← 经常变化的数据（日志、缓存等）
│   └── /var/log           ← ★★★★★ 日志文件！（蓝队最常来的地方）
│       ├── secure         ← 安全相关日志（登录、认证）
│       ├── messages       ← 系统通用日志
│       └── nginx/         ← Web服务器日志
└── /opt                   ← 手动安装的大型软件
```

> 🔑 **蓝队必记目录**：
> - `/var/log/` → 找日志
> - `/etc/` → 找配置
> - `/home/` 和 `/root/` → 找用户文件和可疑文件
> - `/tmp/` → 找攻击者放的临时文件

### 四、Linux命令行基础——告别鼠标

Linux大部分工作靠**敲命令**完成。这看起来"不友好"，但效率极高——敲一行命令可能比鼠标点半天更快更准。

**命令的基本格式：**
```bash
命令  [选项]  [参数]
ls    -l      /home
│     │       └── 对谁操作（路径）
│     └── 怎么操作（选项控制行为）
└── 干什么（命令名称）
```

### 五、15个基本命令详解（边看边练！）

#### 1. pwd —— "我在哪？"
```bash
pwd
# 输出：/home/kali
# 意思：显示你当前在哪个目录下
```

#### 2. ls —— "这里有什么？"
```bash
ls          # 列出当前目录的文件和文件夹
ls -l       # 详细信息（权限、大小、时间）
ls -a       # 显示隐藏文件（以.开头的文件）
ls -la      # 组合：详细信息+隐藏文件（最常用）
ls -lh      # 加了-h，文件大小会显示为KB/MB（人类可读）
```

#### 3. cd —— "去别的目录"
```bash
cd /var/log        # 去指定目录（绝对路径）
cd ..              # 回到上一级（两个点 = 父目录）
cd ~               # 回家目录（波浪号 = 你的home）
cd -               # 回到刚才在的目录
cd                 # 直接cd = 回家目录
```

#### 4. mkdir —— "建个文件夹"
```bash
mkdir mynotes          # 创建 mynotes 目录
mkdir -p a/b/c         # 递归创建（一路建下去）
```

#### 5. touch —— "新建一个空文件"
```bash
touch readme.txt       # 创建空文件 readme.txt
touch file{1,2,3}.txt  # 批量创建 file1.txt file2.txt file3.txt
```

#### 6. cp —— "复制"
```bash
cp a.txt b.txt         # 复制文件
cp -r dir1 dir2        # 复制整个目录（-r是递归的意思）
```

#### 7. mv —— "移动/重命名"
```bash
mv old.txt new.txt     # 重命名
mv file.txt /tmp/      # 移动文件到/tmp/
```

#### 8. rm —— "删除"（⚠️ 危险操作！）
```bash
rm file.txt            # 删除文件（没有回收站！）
rm -r mydir/           # 删除整个目录
rm -rf mydir/          # 强制删除，不提示（非常危险！慎用！）
```

#### 9. cat —— "看看文件里写了什么"
```bash
cat readme.txt         # 显示整个文件内容
cat -n readme.txt      # 带行号显示
```

#### 10. less —— "翻页看文件"（比cat好用）
```bash
less /var/log/secure   # 用方向键上下翻，按q退出，按/搜索
```

#### 11. head / tail —— "看开头/看结尾"
```bash
head -20 access.log    # 看前20行
tail -20 access.log    # 看最后20行
tail -f access.log     # 实时追踪！（日志滚动时自动刷新，蓝队最爱）
```

#### 12. echo —— "输出点东西"
```bash
echo "hello"                    # 输出 hello
echo "hello" > test.txt        # 把hello写进test.txt（覆盖）
echo "world" >> test.txt       # 把world追加到test.txt（追加）
```

`>` 和 `>>` 的区别很重要：`>` 会覆盖原来内容，`>>` 是追加。

#### 13. chmod —— "改权限"
```bash
chmod 755 script.sh    # 让脚本可执行
# r=4, w=2, x=1
# 7=r+w+x=读+写+执行
# 5=r+x=读+执行
```

#### 14. whoami / id —— "我是谁？"
```bash
whoami         # 当前用户名
id             # 当前用户的详细信息（uid、gid、group）
```

#### 15. man —— "命令说明书"
```bash
man ls         # 查看ls命令的帮助文档
ls --help      # 简略版帮助（很多命令支持）
```

---

## 🔧 实操任务

### 任务1：安装Linux虚拟机（60-90分钟）

1. 下载并安装 **VirtualBox**（virtualbox.org）或 **VMware Workstation Player**
2. 下载 **Kali Linux** 镜像（kali.org → Get Kali → Virtual Machines）
3. 在虚拟机中安装Kali Linux
4. 启动进入Linux系统，打开终端（Terminal）

> 如果下载慢，也可以用国内镜像：搜索"Kali Linux 清华镜像"或"Kali Linux 阿里云镜像"
> 配置不够的话选轻量版：Ubuntu Server 20.04 LTS

### 任务2：15个命令逐条练习（30分钟）

打开终端，按顺序敲一遍所有15条命令：

```bash
# 1. 看自己在哪
pwd

# 2. 看当前目录有啥
ls -la

# 3. 去/tmp目录
cd /tmp

# 4. 创建练习目录
mkdir -p ~/ctf_practice/logs ~/ctf_practice/tools

# 5. 进入练习目录
cd ~/ctf_practice

# 6. 创建文件
touch logs/access.log logs/error.log

# 7. 写点东西进去
echo "192.168.1.1 - GET /index.html 200" >> logs/access.log
echo "192.168.1.100 - POST /login 401" >> logs/access.log
echo "10.0.0.55 - GET /admin 403" >> logs/access.log

# 8. 查看文件内容
cat logs/access.log

# 9. 复制一份
cp logs/access.log logs/access_backup.log

# 10. 改个名
mv logs/access_backup.log logs/old.log

# 11. 用less翻页看
less logs/access.log
# (按q退出)

# 12. 看前两行
head -2 logs/access.log

# 13. 看最后一行
tail -1 logs/access.log

# 14. 我是谁
whoami

# 15. 看看权限
ls -la logs/
```

### 任务3：目录结构探索（10分钟）

```bash
# 去日志目录看看
ls -la /var/log/

# 看看系统配置文件
ls -la /etc/

# 看看有哪些用户
cat /etc/passwd | head
```

---

## ✅ 验收标准

- [ ] 成功安装Linux虚拟机，能正常启动到桌面/命令行
- [ ] 能在终端中熟练使用至少15个基础命令
- [ ] 能说出 `/var/log`、`/etc`、`/home`、`/tmp` 四个目录的用途
- [ ] 理解 `>` 和 `>>` 的区别
- [ ] 完成目录创建、文件创建、内容写入、复制、移动、改名全流程
- [ ] 知道 `rm -rf` 的危险性，不会随意使用

---

## 📝 今日小结

今天迈入了Linux世界的门槛。你可能觉得命令行很"原始"，但请相信我——等你用熟了，你会觉得命令行比鼠标快10倍。这15个命令是Linux的"字母表"，后面学grep/awk/sed、分析日志、应急排查，全都建立在这些基础之上。

**记住今天的核心**：
- `/var/log` = 蓝队的"案发现场"（日志都在这里）
- `tail -f` = 实时看日志的神器
- `>` 覆盖，`>>` 追加
- `rm -rf` = 核弹按钮，别乱按

---

## 📚 延伸阅读（可选）

- 在线练习Linux命令（无需安装）：搜索"Webminal"或"JSLinux"
- 书籍推荐：《鸟哥的Linux私房菜-基础学习篇》- Linux中文入门神书
- 遇到命令想不起参数？`man 命令名` 或 `命令名 --help` 随时查

---

## 🎯 蓝队面试高频题（Day 4 主题）

**Q1：Linux文件权限 `rwxr-xr--` 是什么意思？怎么用数字表示？**

> 这是9位权限字符串，分三组（所有者-用户组-其他人）：
> - rwx（所有者）：读+写+执行 = 4+2+1 = 7
> - r-x（用户组）：读+执行 = 4+0+1 = 5
> - r--（其他人）：只读 = 4+0+0 = 4
> - 所以数字表示是 **754**
> 
> 蓝队关注：配置文件（如 /etc/shadow）权限应该是 000 或 400（只有root能看）。如果 /etc/shadow 权限是 777（所有人都能读写执行）→ 严重安全漏洞！

**Q2：/var/log 目录下有哪些蓝队必须关注的日志文件？**

> | 文件 | 内容 | 蓝队用它找什么 |
> |:---|:---|:---|
> | /var/log/secure 或 auth.log | 认证日志（SSH登录、sudo等） | 暴力破解、异常登录时间/来源IP |
> | /var/log/messages 或 syslog | 系统通用日志 | 异常服务启动/停止、内核错误 |
> | /var/log/nginx/access.log | Web访问日志 | SQL注入、目录扫描、Webshell访问 |
> | /var/log/nginx/error.log | Web错误日志 | 攻击导致的500错误 |
> | /var/log/cron | 定时任务日志 | 攻击者设置的后门定时任务 |
> | /var/log/audit/audit.log | 审计日志（需装auditd） | 详细的操作追踪 |

**Q3：`chmod 777` 是什么意思？为什么危险？**

> 777 = rwxrwxrwx = 任何人都能读、写、执行这个文件。如果Web目录权限是777→攻击者上传了webshell可以直接执行。如果数据库配置文件权限是777→普通用户也能读到数据库密码。**安全原则：用最小权限原则，能400就不要644，能600就不要777。**

---

## 📖 深度阅读：Linux目录结构中的安全侦察点

蓝队排查一台疑被入侵的服务器时，这些位置要优先查看：

**1. 用户相关——找后门账户**
```bash
cat /etc/passwd          # 看有没有新增的可疑用户（UID为0的是超级用户）
cat /etc/shadow          # 看有没有无密码或弱密码账户
cat /etc/sudoers         # 看谁被赋予了sudo权限
last -20                 # 最近20次登录记录
```

**2. 启动项相关——找持久化后门**
```bash
crontab -l               # 当前用户的定时任务
cat /etc/crontab         # 系统级定时任务
ls /etc/cron.*           # 定时任务目录
systemctl list-units --type=service | grep -i enabled  # 开机自启服务
```

**3. 网络连接相关——找C2回连**
```bash
ss -tunap                # 所有TCP/UDP连接+对应进程
cat /etc/hosts           # hosts文件有没有被篡改（DNS劫持）
cat /etc/resolv.conf     # DNS服务器是否被改
```

---

## 🏋️ 额外实操挑战

1. **权限挑战**：创建一个文件 `secret.txt`，设置权限为 600（只有自己能读写），尝试用另一个用户读取它——应该失败
2. **目录侦察**：进入 /etc/ 目录，用 `ls -la` 查看所有文件权限。找出哪些文件权限看起来太宽松了
3. **路径记忆**：在纸上默写出Linux根目录下的12个主要子目录及其用途。每天睡前默写一遍，一周后你闭着眼睛都知道去哪找东西
4. **命令速记**：在手机备忘录里建一个"Linux命令速查"，把15个命令的常用选项都记下来，地铁上随时复习

---

## ⚠️ 新手常见误区纠正

1. **误区**："Linux太难了，我还是用Windows分析吧"
   - **真相**：大部分安全工具（Wireshark算例外）在Linux下功能最强、最完整。而且被攻击的服务器99%是Linux，你排查的日志就长在Linux上。逃不掉的。
   
2. **误区**："sudo和root一样，用sudo就行"
   - **真相**：sudo=临时的root权限，每次操作都有审计记录。直接用root登录操作=没有审计记录，出了事都不知道谁干的。**安全基线要求：禁止root直接登录，所有操作走sudo。**

3. **误区**："rm -rf 不就是删文件吗，有什么大不了的"
   - **一个真实故事**：某运维一条 `rm -rf / tmp/xxx`（注意`/`后面多了个空格）直接把根目录删了，整个服务器瘫痪。**养成习惯：删除前先用ls确认路径，重要操作先备份。**


---

## 🎓 进阶命令：这些你可能每天都用到

除了15个基础命令，以下是蓝队日常最高频的进阶命令：

**find——"从整个系统中找出符合条件的文件"**
```bash
# 蓝队最常用场景：查找攻击者留下的文件
find / -name "*.php" -mtime -1        # 最近一天内修改的PHP文件（找webshell）
find / -name "*.php" -mtime -1        # -mtime -1 = 最近24小时修改
find /tmp -type f -mmin -60           # /tmp下最近60分钟的文件（攻击者常藏文件在/tmp）
find / -user www-data -type f 2>/dev/null   # 找出所有属于Web用户的文件
find / -perm -4000 -type f 2>/dev/null      # 找出所有SUID文件（可能被提权利用）
```

**which / whereis——"这个命令在哪？"**
```bash
which nc        # 找nc（netcat）的路径 → 如果服务器不该有nc却存在→可疑！
which python3   # 确定Python在哪个位置
```

**wc——"统计行数/字数"**
```bash
wc -l access.log            # 日志有多少行
grep " 404 " access.log | wc -l   # 有多少条404记录
```

**sort 和 uniq——"排序和去重"（必须和管道配合）**
```bash
# 排序
cat ips.txt | sort          # 按字母排序
cat ips.txt | sort -n       # 按数字排序
cat ips.txt | sort -u       # 排序+去重
# 去重计数
cat ips.txt | sort | uniq -c        # 统计每个IP出现次数
cat ips.txt | sort | uniq -c | sort -rn  # 按次数降序排列
```

**history——"你之前敲过什么命令？"**
```bash
history         # 看自己敲过的命令
history | grep ssh   # 找SSH相关操作
# 蓝队场景：检查可疑用户的历史命令→看他登录后做了什么
cat /home/可疑用户/.bash_history
```

**find + grep 组合——文件内容的大搜捕**
```bash
# 在所有.log文件中搜索 "error"
find /var/log -name "*.log" -exec grep -l "error" {} \;
# 在所有PHP文件中搜索 base64_decode（很多webshell用它混淆代码）
find /var/www -name "*.php" -exec grep -l "base64_decode" {} \;
```

> **记重点**：`find / -name` 找文件名，`grep -r` 找文件内容，`find + grep` 组合是在整个服务器搜webshell的经典手法。

---

## 📖 深度补充内容

### 💡 面试高频题：Linux基础（上）

**Q1: Linux文件权限rwx分别对应什么数字？**
A: r=4, w=2, x=1。755代表rwxr-xr-x（属主可读可写可执行，属组和其他人可读可执行）。蓝队应急时经常需要检查可疑文件的权限——攻击者上传的webshell通常是777。

**Q2: /etc/passwd和/etc/shadow有什么区别？**
A: passwd存用户信息（用户名:UID:GID:家目录:Shell），所有用户可读。shadow存加密后的密码哈希，仅root可读。应急时检查passwd中是否有UID=0的非root账号（后门账号），检查shadow是否有新增用户记录。

**Q3: Linux系统应急排查时，最先检查哪些目录？**
A: ①/tmp和/var/tmp（攻击者常用临时目录存放工具）；②/dev/shm（内存文件系统，可以隐藏文件）；③~/.ssh/authorized_keys（SSH后门）；④/etc/crontab和/var/spool/cron/（计划任务后门）；⑤/usr/share/或/var/www/（Web目录webshell）。

**Q4: find命令怎么用？给几个蓝队常用场景。**
A: ①找最近24小时修改过的文件：`find / -mtime -1 -type f 2>/dev/null`；②找隐藏文件：`find / -name ".*" -type f 2>/dev/null`；③找SUID文件：`find / -perm -4000 -type f 2>/dev/null`（攻击者常利用SUID提权）；④找webshell特征：`find /var/www -name "*.php" -exec grep -l 'eval' {} \;`。


---

## 🔬 深度专题：Linux权限模型与安全审计

### SUID/SGID/GUID深度解析——攻击者最爱的提权点

Linux的SUID（Set User ID）是蓝队安全排查中必须重点关注的权限位。

**SUID的工作原理**：当一个可执行文件设置了SUID位，执行该文件时，进程将以文件属主（通常是root）的身份运行，而非执行者的身份。

**攻击者如何利用SUID提权**：
```bash
# 查找所有SUID文件
find / -perm -4000 -type f 2>/dev/null

# 常见的不安全SUID程序（GTFOBins中有利用方法）
# /usr/bin/find → find . -exec /bin/sh \; → 提权为root
# /usr/bin/vim → vim -c ":!sh" → 提权为root
# /usr/bin/bash → bash -p → 以root权限运行bash
# /usr/bin/python → python -c "import os; os.system('/bin/sh')"
```

**蓝队安全基线检查**：
1. 定期审计所有SUID文件（对比基线，发现新增的SUID文件=后门）
2. 对于业务不需要的SUID程序，移除SUID位：`chmod u-s /path/to/file`
3. 对于必需的SUID程序，限制执行权限（仅特定组可执行）
4. 使用auditd监控SUID文件的创建和执行

**应急排查命令**：
```bash
# 列出今天新增的SUID文件（对比昨天的快照）
diff <(find / -perm -4000 -type f 2>/dev/null | sort) <(cat /var/backup/suid_baseline.txt)
```

### Linux的5种特殊权限位速查

| 权限位 | 数值 | 含义 | 蓝队关注点 |
| --- | --- | --- | --- |
| SUID | 4000 | 以文件属主身份执行 | 攻击者提权的主要利用点 |
| SGID | 2000 | 以文件属组身份执行 | 目录SGID可使新建文件继承目录组 |
| Sticky Bit | 1000 | 仅文件属主可删除（如/tmp） | 防止普通用户删除他人文件 |
| Capabilities | - | 细粒度权限（超越root） | 可能被滥用来绕过权限限制 |
| ACL | - | 访问控制列表 | 比传统rwx更灵活，但也更复杂 |

