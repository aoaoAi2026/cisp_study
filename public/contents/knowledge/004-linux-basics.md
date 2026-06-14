# Linux 系统基础：权限、进程、网络与常用命令

> **📘 文档定位**：CISP 考试核心基础 | 难度：入门 | 预计阅读：40 分钟
>
> Linux 是服务器世界的事实标准，也为安全从业者提供了从 Web 渗透、应急响应到逆向分析的全栈能力。本文梳理 Linux 基础概念与常用命令，既是新手入门速查，也可作为老手的复盘参考。

---

## 导航目录

- [一、文件系统目录结构（FHS）](#一文件系统目录结构fhs)
- [二、权限与用户管理深度解析](#二权限与用户管理深度解析)
- [三、进程管理与监控](#三进程管理与监控)
- [四、内存与文件系统](#四内存与文件系统)
- [五、网络栈与常用命令](#五网络栈与常用命令)
- [六、Shell 与基础命令速查](#六shell-与基础命令速查)
- [七、应急响应速查（蓝队视角）](#七应急响应速查蓝队视角)
- [八、系统加固建议](#八系统加固建议)
- [九、高分考点与知识巧记](#九高分考点与知识巧记)

---

## 一、文件系统目录结构（FHS）

### 1.1 FHS 完整目录说明

FHS（Filesystem Hierarchy Standard）定义了 Linux 系统的标准目录布局：

| 目录 | 全称/含义 | 作用 | 安全关注点 |
| :--- | :--- | :--- | :--- |
| `/` | Root | 根目录，一切文件系统的起点 | 不应存放普通文件 |
| `/bin` | Binaries | 基础用户命令（ls, cp, cat 等） | 现代发行版多为 `/usr/bin` 的符号链接 |
| `/sbin` | System Binaries | 系统管理命令（fdisk, iptables 等） | root 权限执行 |
| `/boot` | Boot | 内核镜像、initramfs、引导加载器（grub） | **安全关键**：内核完整性 |
| `/dev` | Devices | 设备文件 | `/dev/null`、`/dev/random`、`/dev/sda` |
| `/etc` | Et Cetera | **系统级配置文件** | ⚠️ 攻击者目标：passwd、shadow、ssh/ |
| `/home` | Home | 普通用户主目录 | 用户数据、SSH keys、bash_history |
| `/root` | Root Home | root 用户主目录 | ⚠️ 攻击者最终目标 |
| `/lib` `/lib64` | Libraries | 共享库文件、内核模块 | 库劫持风险 |
| `/mnt` `/media` | Mount / Media | 临时挂载点 | USB 自动挂载风险 |
| `/opt` | Optional | 第三方软件包 | 非标准路径，管理易遗漏 |
| `/proc` | Process | **虚拟文件系统**：进程与内核信息 | 取证关键：`/proc/<pid>/` |
| `/sys` | System | 内核设备与驱动信息（sysfs） | 系统信息暴露 |
| `/tmp` | Temporary | 临时文件（部分系统重启清空） | ⚠️ 恶意软件常用落地路径 |
| `/usr` | Unix System Resources | 用户级程序（`/usr/bin`、`/usr/share`、`/usr/local`） | 程序完整性 |
| `/var` | Variable | 日志、缓存、动态数据 | 取证关键：`/var/log/` |
| `/run` | Runtime | 运行时数据（PID 文件、socket） | tmpfs，重启清空 |

> **💡 知识巧记**：
> - `/etc` = "编辑配置的地方"（Edit Text Configuration）
> - `/var` = "变化的数据"（Variable）
> - `/proc` = "进程信息"（Process）
> - `/opt` = "可选的第三方软件"（Optional）
> - `/tmp` = "临时文件"（Temporary）

### 1.2 安全关键目录

```
⚠️ 攻击者重点关注：
  /etc/passwd          → 用户信息（应只读，但不能是机密）
  /etc/shadow          → 密码哈希（仅 root 可读）
  /etc/ssh/            → SSH 配置和主机密钥
  /root/.ssh/          → root 的 SSH authorized_keys
  /var/log/            → 日志文件（攻击者会清理痕迹）
  /tmp /var/tmp        → 恶意文件落地和执行
  /etc/crontab         → 计划任务
  /var/spool/cron/     → 用户级计划任务
  /etc/sudoers         → sudo 权限配置
  /home/*/.bash_history → 用户命令历史
```

---

## 二、权限与用户管理深度解析

### 2.1 文件权限详解

Linux 文件权限使用 10 位字符表示：

```
类型  所有者      组          其他
 ↓    ↙  rwx  ↘  ↙  rwx  ↘  ↙  rwx  ↘
 -     r  w  x     r  w  -     r  -  -
 d     r  w  x     r  -  x     r  -  x
 l     r  w  x     r  w  x     r  w  x

第一位（文件类型）：
  -  = 普通文件
  d  = 目录（Directory）
  l  = 符号链接（Symbolic Link）
  b  = 块设备（Block Device，如磁盘）
  c  = 字符设备（Character Device，如终端）
  s  = Socket
  p  = 命名管道（Pipe/FIFO）
```

**权限数值对照表**：

| 权限 | 二进制 | 数值 | 含义 |
| :--- | :---: | :---: | :--- |
| `---` | 000 | 0 | 无权限 |
| `--x` | 001 | 1 | 仅执行 |
| `-w-` | 010 | 2 | 仅写入 |
| `-wx` | 011 | 3 | 写入+执行 |
| `r--` | 100 | 4 | 仅读取 |
| `r-x` | 101 | 5 | 读取+执行 |
| `rw-` | 110 | 6 | 读取+写入 |
| `rwx` | 111 | 7 | 读取+写入+执行 |

> **💡 知识巧记**：**"4 读 2 写 1 执行"** — 记住 `r=4, w=2, x=1`，通过加法组合任意权限。

**常用权限示例**：

```bash
chmod 755 file    # rwxr-xr-x  (所有者全权限，其他读+执行)
chmod 644 file    # rw-r--r--  (所有者读写，其他只读)
chmod 700 file    # rwx------  (仅所有者有权限)
chmod 600 file    # rw-------  (仅所有者读写，如 SSH 私钥)
chmod 777 file    # rwxrwxrwx  (所有人全权限，⚠️ 极度危险)
chmod 1777 /tmp   # rwxrwxrwt  (粘滞位，只能删除自己的文件)
```

### 2.2 特殊权限详解

| 权限 | 字母 | 数值 | 作用 | 安全风险 |
| :--- | :---: | :---: | :--- | :--- |
| **SUID** | s（所有者位） | 4000 | 执行时以文件所有者身份运行 | ⚠️ 提权关键：SUID root 程序被利用 |
| **SGID** | s（组位） | 2000 | 执行时以文件所属组身份运行 | 组权限提升 |
| **粘滞位** | t（其他位） | 1000 | 仅文件所有者和 root 可删除 | `/tmp` 必须设置 |

```bash
# 设置 SUID
chmod u+s /path/to/file    # 或 chmod 4755 file
# 示例：/usr/bin/passwd 需要 SUID root 来修改 /etc/shadow

# 查找 SUID 文件（安全审计常用）
find / -perm -4000 -type f 2>/dev/null
find / -perm -u=s -type f 2>/dev/null

# 查找 SGID 文件
find / -perm -2000 -type f 2>/dev/null
```

> **🔑 高分考点**：SUID 提权原理——如果 `/usr/bin/find` 有 SUID root 权限，攻击者可执行 `find . -exec /bin/bash -p \;` 获得 root shell。`-p` 参数保留 SUID 特权。

### 2.3 用户与组管理

**关键文件**：

| 文件 | 格式 | 权限 | 内容 |
| :--- | :--- | :--- | :--- |
| `/etc/passwd` | `user:x:uid:gid:comment:home:shell` | 644 | 用户基本信息（密码占位符 x） |
| `/etc/shadow` | `user:hash:lastchg:min:max:warn:inactive:expire` | 000（root） | **密码哈希与过期策略** |
| `/etc/group` | `group:x:gid:members` | 644 | 用户组信息 |

```bash
# 用户管理命令
useradd -m -s /bin/bash username        # 创建用户（-m 创建家目录）
userdel -r username                     # 删除用户（-r 同时删家目录）
usermod -aG sudo username               # 将用户加入 sudo 组
passwd username                         # 设置/修改密码
passwd -l username                      # 锁定账户
passwd -u username                      # 解锁账户

# 组管理命令
groupadd groupname                      # 创建组
groupdel groupname                      # 删除组
usermod -aG groupname username          # 添加用户到组
groups username                         # 查看用户所属组

# sudo 配置
visudo                                  # 安全编辑 /etc/sudoers
# 格式：username ALL=(ALL:ALL) ALL      # 用户可执行所有命令
#       username ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx
```

### 2.4 SUID/SGID 提权审计

```
常见危险 SUID 程序（如果存在 SUID 位）：
  bash, dash, sh         → 直接获得 shell
  python, perl, ruby     → 脚本提权
  find, vim, less, more  → 内置命令提权
  cp, mv, cat            → 读取/覆盖敏感文件
  nmap                   → --script 参数执行脚本

审计命令：
  # 查找所有 SUID 文件
  find / -perm -4000 -type f -ls 2>/dev/null
  
  # 查找所有 SGID 文件
  find / -perm -2000 -type f -ls 2>/dev/null
  
  # 查找可写的 SUID 文件
  find / -perm -4000 -type f -writable 2>/dev/null
  
  # 查找最近 7 天修改的 SUID 文件
  find / -perm -4000 -type f -mtime -7 2>/dev/null
```

---

## 三、进程管理与监控

### 3.1 进程管理命令

```bash
# 进程查看
ps aux                  # BSD 格式，显示所有进程
ps -ef                  # Unix 格式，显示所有进程
ps -eo pid,ppid,user,cmd  # 自定义输出格式
ps auxf                 # 树形显示进程父子关系

# 交互式监控
top                     # 实时进程监控
htop                    # 增强版 top（需安装）
atop                    # 高级系统和进程监控

# 进程树
pstree -p               # 显示进程树和 PID
pstree -u username      # 显示特定用户的进程树

# 进程查找与终止
pgrep -f "nginx"        # 按名称查找进程 PID
pkill -f "nginx"        # 按名称终止进程
kill -9 PID             # 强制终止（SIGKILL）
kill -15 PID            # 优雅终止（SIGTERM，默认）
kill -HUP PID           # 重新加载配置（SIGHUP）

# 后台作业控制
command &               # 后台运行
jobs                    # 查看后台作业
fg %1                   # 将作业 1 调回前台
bg %1                   # 继续运行作业 1
nohup command &         # 忽略 HUP 信号，登出后继续运行
disown                  # 将作业从 shell 作业列表中移除
```

### 3.2 服务管理（Systemd）

```bash
# systemctl 常用操作
systemctl status nginx            # 查看服务状态
systemctl start nginx             # 启动服务
systemctl stop nginx              # 停止服务
systemctl restart nginx           # 重启服务
systemctl reload nginx            # 重新加载配置（不中断服务）
systemctl enable nginx            # 开机自启
systemctl disable nginx           # 禁止开机自启
systemctl is-enabled nginx        # 检查是否开机自启

# 服务列表
systemctl list-units --type=service              # 所有已加载的服务
systemctl list-units --type=service --state=running  # 运行中的服务
systemctl list-unit-files --type=service         # 所有服务文件

# 日志查看
journalctl -u nginx               # 查看 nginx 日志
journalctl -u nginx --since today # 今天的日志
journalctl -u nginx -f            # 实时跟踪日志
journalctl --since "2025-06-01" --until "2025-06-14"
```

### 3.3 /proc 文件系统取证

```
关键 /proc 信息（蓝队取证必备）：

/proc/<pid>/cmdline     → 进程的完整命令行（\0 分隔，可用 tr '\0' ' ' 查看）
/proc/<pid>/exe         → 进程的可执行文件符号链接
/proc/<pid>/cwd         → 进程的当前工作目录
/proc/<pid>/environ     → 进程的环境变量（可能含敏感信息）
/proc/<pid>/fd/         → 进程打开的文件描述符（含 socket、管道）
/proc/<pid>/maps        → 进程内存映射（加载的库、堆、栈地址）
/proc/<pid>/status      → 进程状态（Name, State, Uid, VmSize 等）
/proc/<pid>/root        → 进程的根目录（chroot 可见）

常用取证命令：
  # 查看可疑进程的命令行
  cat /proc/<pid>/cmdline | tr '\0' ' '
  
  # 查看进程打开的网络连接
  ls -la /proc/<pid>/fd | grep socket
  lsof -p <pid>
  
  # 查看进程的真实可执行文件路径
  ls -la /proc/<pid>/exe
  
  # 对比进程名和实际文件路径（检测进程名伪装）
  cat /proc/<pid>/comm
  readlink /proc/<pid>/exe
```

### 3.4 常见 Linux 信号

| 信号 | 编号 | 作用 | 使用场景 |
| :--- | :---: | :--- | :--- |
| SIGHUP | 1 | 挂断（重新加载配置） | `kill -HUP <pid>` |
| SIGINT | 2 | 中断（Ctrl+C） | 优雅停止前台进程 |
| SIGQUIT | 3 | 退出（Ctrl+\），生成 core dump | 调试 |
| SIGKILL | 9 | **强制终止**（不可捕获） | 杀死僵尸/卡死进程 |
| SIGTERM | 15 | 终止（默认） | 优雅停止 |
| SIGSTOP | 19 | 暂停（不可捕获） | 暂停进程 |
| SIGCONT | 18 | 继续运行 | 恢复暂停的进程 |

---

## 四、内存与文件系统

### 4.1 内存与磁盘命令

```bash
# 内存查看
free -h                     # 人类可读格式查看内存
free -m                     # 以 MB 为单位
cat /proc/meminfo           # 详细内存信息

# 磁盘空间
df -h                       # 磁盘分区使用情况
df -i                       # inode 使用情况（inode 耗尽也无法创建文件）
du -sh /var/log/*           # 目录/文件大小
du -h --max-depth=1 /       # 一层深度的目录大小

# 挂载管理
mount                       # 查看所有挂载点
mount -t ext4 /dev/sdb1 /data  # 挂载分区
umount /data                # 卸载
lsblk                       # 列出块设备
blkid                       # 查看块设备 UUID

# 文件监控
lsof                        # 列出所有打开的文件
lsof -i :22                 # 查看占用 22 端口的进程
lsof -p <pid>               # 查看某进程打开的文件
fuser -v /var/log/auth.log  # 查看正在使用某文件的进程

# inotify 文件变化监控
inotifywait -m /etc/        # 监控 /etc 目录的文件变化
inotifywait -m -r /var/www/ # 递归监控
```

### 4.2 文件系统安全挂载选项

```bash
# 安全挂载建议
# /tmp 分区加固
# /etc/fstab 中添加：
tmpfs /tmp tmpfs noexec,nosuid,nodev 0 0

# 选项说明：
# noexec  → 禁止执行该分区上的二进制文件
# nosuid  → 忽略 SUID/SGID 位
# nodev   → 禁止解释字符/块设备文件

# /var/tmp 同样加固
# /etc/fstab 中添加：
tmpfs /var/tmp tmpfs noexec,nosuid,nodev 0 0

# /home 分区（如需）
# /etc/fstab 中添加：
/dev/sda3 /home ext4 defaults,nosuid,nodev 0 2
```

---

## 五、网络栈与常用命令

### 5.1 网络状态查看

```bash
# 现代命令（iproute2 套件，推荐）
ip addr show                    # 查看 IP 地址（替代 ifconfig）
ip route show                   # 查看路由表（替代 route）
ip link show                    # 查看网络接口
ip neigh show                   # 查看 ARP 表（替代 arp -a）

# 端口与连接
ss -tulnp                       # TCP/UDP 监听端口 + 进程名
ss -tanp                        # 所有 TCP 连接
ss -s                           # 连接统计摘要
netstat -tulnp                  # 传统命令（部分系统需安装 net-tools）
netstat -an | awk '/ESTABLISHED/ {print $5}' | sort | uniq -c | sort -rn
                                # 统计各远程 IP 的 ESTABLISHED 连接数

# 连通性测试
ping -c 4 example.com           # 发送 4 个 ICMP Echo
mtr example.com                 # 结合 ping + traceroute，持续路径质量检测
traceroute example.com          # 追踪路由路径（UDP 方式）
tcptraceroute example.com 443   # TCP 方式追踪（穿透防火墙）

# DNS 查询
dig example.com                 # 详细 DNS 查询
dig +short example.com          # 简洁输出
dig @8.8.8.8 example.com        # 指定 DNS 服务器
nslookup example.com            # 简单查询
host example.com                # 最简单查询
getent hosts example.com        # 使用系统解析器（含 /etc/hosts）
```

### 5.2 抓包与分析

```bash
# tcpdump 基础用法
tcpdump -i any -w capture.pcap                     # 抓所有流量保存
tcpdump -i eth0 'host 192.168.1.100'               # 按 IP 过滤
tcpdump -i any 'port 80 or port 443'               # 按端口过滤
tcpdump -i any 'tcp[tcpflags] & tcp-syn != 0'      # 抓 SYN 包
tcpdump -i any -n 'icmp'                           # 抓 ICMP
tcpdump -r capture.pcap 'tcp.port == 443'          # 读取文件并过滤

# 瑞士军刀 netcat / socat
nc -lvp 4444                    # 监听 4444 端口
nc 192.168.1.100 4444           # 连接到端口
nc -lvp 4444 -e /bin/bash       # 反弹 shell（服务端）
nc -w 3 -zv 192.168.1.100 22    # 端口扫描（TCP 连接测试）

# socat 高级用法
socat TCP-LISTEN:8080,fork TCP:192.168.1.100:80  # 端口转发
socat TCP-LISTEN:4444,reuseaddr,fork EXEC:/bin/bash  # 加密反弹 shell
```

### 5.3 防火墙管理

```bash
# iptables（传统）
iptables -L -n -v               # 查看所有规则
iptables -A INPUT -p tcp --dport 22 -j ACCEPT    # 允许 SSH
iptables -A INPUT -p tcp --dport 80 -j ACCEPT    # 允许 HTTP
iptables -A INPUT -j DROP       # 默认拒绝（⚠️ 注意顺序）
iptables-save > /etc/iptables/rules.v4           # 保存规则

# ufw（Ubuntu 简化防火墙）
ufw status                      # 查看状态
ufw enable                      # 启用防火墙
ufw allow 22/tcp                # 允许 SSH
ufw allow 80,443/tcp            # 允许 HTTP/HTTPS
ufw deny from 192.168.1.100     # 拒绝特定 IP
ufw default deny incoming       # 默认拒绝入站

# firewalld（RHEL/CentOS 7+）
firewall-cmd --state                    # 查看状态
firewall-cmd --list-all                 # 查看所有配置
firewall-cmd --add-service=http --permanent  # 永久添加 HTTP
firewall-cmd --add-port=8080/tcp --permanent # 永久添加端口
firewall-cmd --reload                   # 重新加载
```

---

## 六、Shell 与基础命令速查

### 6.1 文件操作

```bash
# 基础操作
ls -la                          # 详细列表（含隐藏文件）
ls -ltr                         # 按时间倒序（最新的在最后）
cd -                            # 返回上一个目录
mkdir -p a/b/c                  # 递归创建目录
rm -rf /path/to/dir             # ⚠️ 强制递归删除（危险！）
cp -a source dest               # 保留权限/时间戳的复制
mv source dest                  # 移动/重命名
ln -s /path/to/target linkname  # 创建符号链接

# 文件查看
cat file                        # 查看整个文件
tac file                        # 反向查看（最后一行在前）
head -n 20 file                 # 前 20 行
tail -n 20 file                 # 最后 20 行
tail -f /var/log/auth.log       # 实时跟踪日志
less file                       # 分页查看（可搜索）
more file                       # 分页查看（简单）

# 文件查找
find / -name "*.log" -type f                    # 按名称查找
find / -name "*.conf" -size +1M                  # 按大小查找
find / -perm -4000 -type f                       # 按权限查找
find / -mtime -7 -type f                         # 最近 7 天修改的文件
find / -user root -type f -perm -u=s             # root 的 SUID 文件
find / -name "*.log" -exec grep "error" {} \;    # 查找含 error 的日志

# 文件统计
wc -l file                      # 行数
wc -w file                      # 单词数
wc -c file                      # 字节数
sort file                       # 排序
sort -u file                    # 排序并去重
sort -n file                    # 数值排序
uniq -c file                    # 统计重复行次数
```

### 6.2 文本处理三剑客

```bash
# grep — 文本搜索
grep "pattern" file                     # 搜索模式
grep -i "pattern" file                  # 忽略大小写
grep -r "pattern" /etc/                 # 递归搜索目录
grep -v "pattern" file                  # 反向匹配（排除）
grep -E "pattern1|pattern2" file        # 扩展正则（或）
grep -F "fixed_string" file             # 固定字符串（非正则）
grep -c "pattern" file                  # 统计匹配行数
grep -n "pattern" file                  # 显示行号
grep -A 3 -B 2 "pattern" file           # 显示上下文（后 3 行前 2 行）

# sed — 流编辑器
sed 's/old/new/g' file                  # 全局替换
sed 's/old/new/2' file                  # 替换第 2 个匹配
sed '/pattern/d' file                   # 删除匹配行
sed -n '5,10p' file                     # 打印 5-10 行
sed -i 's/old/new/g' file               # 直接修改文件（-i 原地编辑）
sed 's/^#//' file                       # 去掉行首注释

# awk — 文本处理语言
awk '{print $1,$3}' file                # 打印第 1、3 列
awk -F: '{print $1,$3}' /etc/passwd     # 指定分隔符为冒号
awk '$3>1000 {print $1}' /etc/passwd    # 条件过滤（UID>1000）
awk '{sum+=$1} END {print sum}' file    # 求和
awk '{print NR,$0}' file                # 显示行号
awk '!seen[$0]++' file                  # 去重
```

### 6.3 权限与压缩

```bash
# 权限
chown user:group file                   # 修改所有者:组
chown -R user:group dir/                # 递归修改
chmod 755 file                          # 数值修改权限
chmod u+x file                          # 符号修改（给所有者加执行）
chmod g-w file                          # 移除组的写权限
chattr +i file                          # 设置不可变位（不可删除/修改）
chattr -i file                          # 移除不可变位
lsattr file                             # 查看扩展属性

# 压缩与归档
tar zcvf archive.tar.gz dir/            # 创建 gzip 压缩归档
tar zxvf archive.tar.gz                 # 解压 gzip 归档
tar jcvf archive.tar.bz2 dir/           # 创建 bzip2 压缩
tar Jcvf archive.tar.xz dir/            # 创建 xz 压缩
zip -r archive.zip dir/                 # 创建 zip
unzip archive.zip                       # 解压 zip
gzip file                               # 压缩单个文件
gunzip file.gz                          # 解压 .gz
```

---

## 七、应急响应速查（蓝队视角）

### 7.1 十步排查法

```bash
# ============ 步骤 1：当前登录用户与最近登录 ============
who                     # 当前登录用户
w                       # 当前登录用户及活动
last                    # 最近登录记录
lastb                   # 最近失败登录（暴力破解）
lastlog                 # 所有用户最后登录时间

# ============ 步骤 2：进程树与可疑进程 ============
ps auxf                 # 进程树
pstree -p               # 进程树 + PID
cat /proc/<pid>/cmdline | tr '\0' ' '  # 查看进程完整命令行
ls -la /proc/<pid>/fd   # 进程打开的文件/socket
ls -la /proc/<pid>/exe  # 进程可执行文件路径

# 查找隐藏进程
ps aux | awk '{print $2}' | sort > /tmp/ps_list.txt
ls /proc | grep -E '^[0-9]+$' | sort > /tmp/proc_list.txt
diff /tmp/ps_list.txt /tmp/proc_list.txt  # 差异即为隐藏进程

# ============ 步骤 3：网络连接 ============
ss -tanp                # 所有 TCP 连接 + 进程
ss -tulnp               # 监听端口 + 进程
netstat -an | awk '/ESTABLISHED/ {print $5}' | sort | uniq -c | sort -rn
                        # 按远程 IP 统计连接数
lsof -i                 # 所有网络连接
lsof -i :22             # 查看 SSH 连接

# ============ 步骤 4：计划任务 ============
crontab -l              # 当前用户计划任务
cat /etc/crontab        # 系统计划任务
ls -la /etc/cron.*      # cron.daily/weekly/monthly
ls -la /var/spool/cron/crontabs/  # 用户计划任务
systemctl list-timers   # systemd 定时器

# ============ 步骤 5：启动项与服务 ============
systemctl list-unit-files --type=service --state=enabled  # 开机自启服务
ls -la /etc/init.d/     # SysV init 脚本
ls -la /etc/rc*.d/      # 运行级别脚本
cat /etc/rc.local       # 本地启动脚本
ls -la /etc/profile.d/  # 全局 shell 配置
cat ~/.bashrc ~/.bash_profile ~/.profile  # 用户 shell 配置

# ============ 步骤 6：可疑用户与组 ============
cat /etc/passwd                         # 所有用户
cat /etc/shadow                         # 密码哈希（需 root）
awk -F: '($3==0) {print $1}' /etc/passwd  # UID=0 的账户（root 权限）
cat /etc/group                          # 所有组
cat /etc/sudoers                        # sudo 权限（需 root）

# ============ 步骤 7：最近修改的文件 ============
find / -mmin -1440 -type f \( -name '*.sh' -o -name '*.py' -o -name '*.so' \) 2>/dev/null
                                        # 最近 24 小时修改的可疑文件
find / -perm /6000 -type f 2>/dev/null  # 所有 SUID/SGID 文件
find / -perm -4000 -type f -mtime -7 2>/dev/null  # 最近 7 天新增 SUID

# ============ 步骤 8：关键日志 ============
# Debian/Ubuntu
tail -n 200 /var/log/auth.log           # 认证日志
tail -n 200 /var/log/syslog             # 系统日志

# RHEL/CentOS
tail -n 200 /var/log/secure             # 安全日志
tail -n 200 /var/log/messages           # 系统消息

# systemd 日志
journalctl --since "24 hours ago"       # 最近 24 小时
journalctl -u sshd --since "2 hours ago"  # SSH 最近 2 小时
journalctl -p err --since today         # 今天的错误日志

# ============ 步骤 9：SSH 与凭据检查 ============
ls -la ~/.ssh/ /root/.ssh/              # SSH 目录
cat ~/.ssh/authorized_keys              # 授权密钥
cat ~/.ssh/known_hosts                  # 已知主机
cat ~/.bash_history                     # 命令历史

# ============ 步骤 10：可疑端口与后门 ============
ss -tulnp                               # 所有监听端口
lsof -i | grep -v LISTEN                # 非监听的网络连接（出站）
netstat -anp | grep -E 'ESTABLISHED.*:(4444|5555|6666|7777|8888|9999|1337|31337)'
                                        # 常见后门端口
```

---

## 八、系统加固建议

### 8.1 加固检查清单

```
认证与访问控制：
  □ 禁用 root SSH 登录（PermitRootLogin no）
  □ 使用 SSH Key 登录，禁用密码认证（PasswordAuthentication no）
  □ 修改 SSH 默认端口（Port 2222）
  □ 设置强密码策略（/etc/login.defs、pam_pwquality）
  □ 限制 sudo 权限（仅必要用户、必要命令）
  □ 设置账户锁定策略（pam_tally2 或 pam_faillock）

网络安全：
  □ 配置防火墙仅开放必要端口
  □ 限制 SSH 访问来源 IP（防火墙规则或 /etc/hosts.allow）
  □ 部署 fail2ban 防暴力破解
  □ 禁用不必要的网络服务

系统安全：
  □ 保持系统与软件最新（定期 apt update && apt upgrade）
  □ 启用 SELinux（enforcing 模式）或 AppArmor
  □ 启用 auditd 审计关键系统调用
  □ 配置文件系统挂载选项（/tmp noexec,nosuid,nodev）

文件完整性：
  □ 部署 AIDE / Tripwire 文件完整性监控
  □ 监控 /etc/passwd、/etc/shadow、/etc/sudoers 变化
  □ 监控 crontab、/root/.ssh/authorized_keys 变化

日志与监控：
  □ 配置日志转发到集中日志服务器
  □ 设置日志轮转策略（logrotate）
  □ 部署 osquery / Wazuh 进行持续监控
  □ 监控异常登录（时间/地点/频率）
```

### 8.2 SSH 安全配置

```bash
# /etc/ssh/sshd_config 安全配置
Port 2222                                   # 修改默认端口
Protocol 2                                  # 仅使用 SSH 协议 v2
PermitRootLogin no                          # 禁止 root 直接登录
PasswordAuthentication no                   # 禁用密码认证
PubkeyAuthentication yes                    # 启用密钥认证
AuthorizedKeysFile .ssh/authorized_keys     # 授权密钥文件
MaxAuthTries 3                              # 最大认证尝试次数
MaxSessions 5                               # 单连接最大会话数
ClientAliveInterval 300                     # 客户端心跳间隔
ClientAliveCountMax 2                       # 心跳超时次数
AllowUsers alice bob                        # 仅允许特定用户
AllowGroups ssh-users                       # 仅允许特定组
X11Forwarding no                            # 禁用 X11 转发
```

---

## 九、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
| :---: | :--- | :---: | :---: | :--- |
| 1 | 文件权限（rwx 数值表示） | ⭐⭐⭐⭐⭐ | 低 | r=4, w=2, x=1；755=rwxr-xr-x；600=rw------- |
| 2 | SUID/SGID/粘滞位 | ⭐⭐⭐⭐⭐ | 中 | SUID=4000（以所有者执行）、SGID=2000、粘滞位=1000 |
| 3 | /etc/passwd vs /etc/shadow | ⭐⭐⭐⭐ | 低 | passwd 存用户信息、shadow 存密码哈希（仅 root 可读） |
| 4 | 进程管理命令 | ⭐⭐⭐⭐ | 低 | ps/top/kill/nice/systemctl |
| 5 | 网络命令（ss/netstat/tcpdump） | ⭐⭐⭐⭐ | 中 | ss -tulnp 查看监听端口、tcpdump 抓包 |
| 6 | Linux 目录结构（FHS） | ⭐⭐⭐⭐ | 低 | /etc 配置、/var 日志、/proc 进程、/tmp 临时 |
| 7 | 应急响应排查流程 | ⭐⭐⭐⭐⭐ | 高 | 用户→进程→网络→计划任务→启动项→日志 |
| 8 | SSH 安全加固 | ⭐⭐⭐⭐ | 中 | 禁用 root、密钥登录、改端口、fail2ban |
| 9 | 文件查找（find 命令） | ⭐⭐⭐⭐ | 中 | find / -perm -4000、find / -mtime -7 |
| 10 | grep/sed/awk 文本处理 | ⭐⭐⭐ | 中 | grep 搜索、sed 替换、awk 列处理 |
| 11 | Systemd 服务管理 | ⭐⭐⭐⭐ | 中 | systemctl start/stop/enable/disable |
| 12 | 防火墙（iptables/ufw） | ⭐⭐⭐ | 中 | iptables -A INPUT -p tcp --dport 22 -j ACCEPT |

### 💡 知识巧记口诀

#### 1. 文件权限
> **"4读2写1执行"** — 记住 `r=4, w=2, x=1`
>
> 常用组合：**"755 标准执行、644 标准文件、600 私密文件、700 私密脚本"**

#### 2. 目录结构
> **"etc 配置、var 变数据、proc 看进程、tmp 临时放、home 是家、root 是老家"**

#### 3. 进程管理
> **"ps 看快照、top 看实时、kill 杀进程、systemctl 管服务"**

#### 4. 文本三剑客
> **"grep 找内容、sed 改内容、awk 算内容"**

#### 5. 应急响应十步
> **"先看谁在线、再看跑啥进程、查网络连哪里、翻计划任务、查开机启动、审用户权限、找最近修改、看日志、查 SSH、扫端口"**

#### 6. SSH 加固
> **"root 禁登、密码不用、Key 认证、端口改、fail2ban 护"**

#### 7. SUID 提权
> **"找 SUID 文件(find / -perm -4000)、看是否可写、利用提权"**

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
| :--- | :--- |
| "kill -9 是最好的杀进程方式" | ❌ 错误！kill -9 (SIGKILL) 是强制终止，进程无法清理资源。应优先使用 kill -15 (SIGTERM) |
| "SUID 只能设置在二进制文件上" | ⚠️ 部分正确！Linux 上 SUID 对脚本无效（安全原因），仅对编译后的二进制文件有效 |
| "/etc/passwd 存储密码" | ❌ 错误！现代 Linux 的密码哈希存储在 /etc/shadow，/etc/passwd 中密码位为 x |
| "chmod 777 可以解决权限问题" | ⚠️ 极度危险！777 授予所有用户完全权限，正确的做法是分析权限需求精准授权 |
| "root 用户不受任何权限限制" | ⚠️ 不准确！root 可以绕过标准权限，但 SELinux/AppArmor 的强制访问控制、chattr +i 不可变位等仍有限制 |
| "ps 能看到所有进程" | ⚠️ 不完全！Rootkit 可以通过 hook 系统调用隐藏进程，需交叉验证 /proc 目录 |

---

## 学习建议

1. 🐧 **选一个发行版深耕**：Ubuntu/Debian 或 CentOS/RHEL/Fedora，掌握包管理（apt/dnf）
2. 💻 **日常使用命令行**：文件处理、grep/awk/sed、Shell 脚本、日志分析
3. 📝 **写实用 Shell 脚本**：自动化日常安全巡检任务
4. 📖 **阅读经典**：《鸟哥的 Linux 私房菜》或《Linux Command Line and Shell Scripting Bible》
5. 🎯 **模拟应急响应**：在测试机上制造反弹 shell、计划任务后门，按本文应急清单逐步复盘

---

> **Linux 基础并不可怕，关键是"持续在命令行里泡着"。从权限、进程、网络、日志四大块出发，再结合红蓝对抗的实际场景反复练习，你会逐渐形成对系统状态的直觉。**
