# Linux 系统基础：权限、进程、网络与常用命令

Linux 是服务器世界的事实标准，也为安全从业者提供了从 Web 渗透、应急响应到逆向分析的全栈能力。本文梳理 Linux 基础概念与常用命令，既是新手入门速查，也可作为老手的复盘参考。

## 一、目录结构（FHS 概览）

| 目录 | 作用 |
| --- | --- |
| `/` | 根目录 |
| `/bin`、`/sbin` | 基础命令（单用户模式也可使用）；现代发行版多为 `/usr/bin` 的符号链接 |
| `/boot` | 内核、initramfs、引导加载器（grub） |
| `/dev` | 设备文件（`/dev/null`、`/dev/sda`、`/dev/shm` 等） |
| `/etc` | 系统级配置文件（passwd、shadow、hosts、nginx、ssh 等） |
| `/home` | 用户主目录 |
| `/root` | root 用户主目录 |
| `/lib`、`/lib64` | 共享库、内核模块 |
| `/mnt`、`/media` | 临时挂载点 |
| `/opt` | 可选第三方软件 |
| `/proc` | 进程与内核信息伪文件系统（procfs） |
| `/sys` | 内核设备与驱动信息（sysfs） |
| `/tmp` | 临时文件，部分系统重启清空 |
| `/usr` | 用户级程序与数据（`/usr/bin`、`/usr/share`、`/usr/local`） |
| `/var` | 日志、缓存、动态数据（`/var/log`、`/var/www`、`/var/lib/mysql`） |
| `/run` | 运行时数据（PID 文件、socket） |

## 二、权限与用户管理

### 2.1 文件权限

```
drwxr-xr-x 2 root root 4096 Sep 1 12:00 /etc
-rw-r--r-- 1 alice users 1024 Sep 1 12:00 notes.txt
-rwsr-xr-x 1 root root 8400 ... /usr/bin/su
```

- 首字符：`-` 普通文件 / `d` 目录 / `l` 符号链接 / `b` 块设备 / `c` 字符设备 / `s` socket / `p` 管道；
- 9 位权限：所有者（User）、组（Group）、其他（Other），各 3 位 `r w x`；
- 数字表示：`r=4, w=2, x=1`，如 `chmod 755 file` = `rwxr-xr-x`；
- 特殊权限：`setuid (s)`、`setgid (s)`、粘滞位 `t`（如 `/tmp` 目录）。

### 2.2 用户 / 组

- `/etc/passwd`：用户信息（`name:x:uid:gid:gecos:home:shell`）；
- `/etc/shadow`：密码哈希（仅 root 可读）；
- `/etc/group`：用户组；
- 常用命令：`useradd / userdel / usermod / groupadd / passwd / su / sudo`；
- sudo 规则由 `/etc/sudoers` 管理（使用 `visudo` 编辑）。

### 2.3 SUID / SGID 提权思路（蓝/红共同关注）

- `find / -perm -4000 -type f 2>/dev/null`：查找 SUID 文件；
- 若存在可写的 SUID 程序或脚本，可被用来提权；
- 典型危险项：`bash`、`cp`、`nmap`、`vim`、`find`、`python` 等带 SUID。

## 三、进程管理

- `ps aux` / `ps -ef`：列出进程；
- `top` / `htop`：交互查看 CPU/内存/负载；
- `pstree`：进程树；
- `pgrep`、`pkill`、`kill`、`killall`：查找/结束进程；
- `nice`、`renice`：调整优先级；
- `jobs`、`bg`、`fg`、`&`、`nohup`：作业控制；
- `systemctl` / `service`：Systemd 服务管理（start/stop/enable/disable/status）；
- `/proc/<pid>/{status,cmdline,exe,fd,map_files}`：低阶进程信息，常用于取证。

## 四、内存与文件系统

- `free -h`：查看内存与 swap；
- `df -h`：磁盘空间；
- `du -sh /var/log/*`：目录大小；
- `mount`、`umount`、`lsblk`、`blkid`：挂载与块设备；
- `inotifywait`、`fswatch`：文件变化监控（蓝队应急常用）；
- `lsof`：列出打开的文件/socket（`lsof -i :22` 查看占用端口 22 的进程）；
- `fuser`：查找正在使用某文件的进程。

## 五、网络栈与常用命令

- `ss -tulnp` / `netstat -tulnp`：查看监听端口与进程；
- `ip addr`、`ip route`、`ip link`：取代 `ifconfig`、`route`；
- `ping`、`ping6`、`mtr`：连通性与丢包路径检查；
- `traceroute`、`tcptraceroute`：路径追踪；
- `tcpdump -i any -w demo.pcap 'tcp port 80'`：抓包；
- `dig`、`nslookup`、`getent hosts`：DNS 解析；
- `curl -v https://example.com`、`wget`：HTTP 下载调试；
- `nc` / `ncat` / `socat`：瑞士军刀，端口转发、反弹 shell 常用；
- `iptables` / `nftables` / `ufw` / `firewalld`：防火墙。

## 六、Shell 与基础命令速查

### 文件操作
- `ls -la`、`cd`、`pwd`、`mkdir -p`、`rm -rf`、`cp -a`、`mv`、`ln -s`；
- `cat`、`tac`、`head`、`tail -f`、`less`、`more`；
- `wc -l`、`sort -u`、`uniq -c`、`cut -d: -f1`、`paste`、`join`；
- `find / -name '*.log' -size +10M -mtime -7`：按名称/大小/时间查找。

### 文本处理
- `grep -r "pattern" /etc`：递归查找；
- `grep -E`（扩展正则）、`grep -F`（固定字符串）、`grep -v`（反向）；
- `sed 's/old/new/g' file`、`awk '{print $1,$3}' file`、`tr 'A-Z' 'a-z'`；
- `xargs`、`paste`、`pr`、`tee` 等配合管道。

### 权限与压缩
- `chown user:group file`、`chmod 755 file`、`chattr +i file`（不可变位）；
- `tar zcvf a.tar.gz dir/`、`tar zxvf a.tar.gz`；
- `zip -r a.zip dir/`、`unzip a.zip`；
- `gzip`、`bzip2`、`xz`、`zstd`。

## 七、应急响应速查（蓝队视角）

```
# 1. 当前登录用户与最近登录
who / w / last / lastb

# 2. 进程树与可疑进程
ps auxf / pstree -p
cat /proc/<pid>/cmdline | tr '\0' ' '; echo
ls -la /proc/<pid>/fd  # 观察打开的 socket/可疑文件

# 3. 网络连接
ss -tanp / netstat -tanp
netstat -an | awk '/ESTABLISHED/ {print $5}' | sort | uniq -c | sort -rn

# 4. 计划任务
ls -la /etc/cron* /var/spool/cron/crontabs/
crontab -l; cat /etc/crontab

# 5. 启动项与服务
systemctl list-unit-files --type=service --state=enabled
ls -la /etc/init.d/; ls -la /etc/rc*.d/
ls -la /etc/profile.d/ ~/.bashrc ~/.bash_profile ~/.profile

# 6. 可疑用户/组
cat /etc/passwd; cat /etc/group
awk -F: '$3==0' /etc/passwd  # 找出 UID=0 的账号

# 7. 最近修改的可执行文件 / SUID / SGID
find / -perm /6000 -type f 2>/dev/null
find / -mmin -1440 -type f \( -name '*.sh' -o -name '*.so' -o -perm /111 \) 2>/dev/null | head

# 8. 关键日志
tail -n 200 /var/log/auth.log /var/log/secure
tail -n 200 /var/log/syslog /var/log/messages
journalctl --since "24 hours ago" -u sshd

# 9. SSH key 与可疑凭据
ls -la ~/.ssh/ /root/.ssh/
cat ~/.ssh/authorized_keys  # 检查未知 key

# 10. 可疑端口与反向 shell
ss -tulnp
lsof -i | grep -v LISTEN
```

## 八、加固建议（简要）

1. 禁用 root SSH 登录，使用普通用户 + sudo；
2. 使用 SSH key 登录，禁用 PasswordAuthentication；
3. 设置强密码策略（`/etc/login.defs`、pam_pwquality）；
4. 配置防火墙仅开放必要端口；
5. 启用 auditd / auditbeat 审计关键系统调用；
6. 关闭不必要的服务（`systemctl disable`）；
7. 保持系统与软件最新（`apt-get update && apt-get upgrade` / `dnf/yum update`）；
8. 开启 fail2ban / ufw 等防护；
9. 监控 `/etc/passwd`、`/etc/shadow`、crontab、`/root/.ssh` 等敏感文件的修改；
10. 文件系统加固：`noexec,nosuid,nodev` 挂载 `/tmp`、`/var/tmp` 等。

## 九、学习建议

1. 至少熟悉一种发行版（Ubuntu/Debian 或 CentOS/RHEL/Fedora），掌握包管理（apt/dnf）；
2. 每天使用命令行完成日常任务：文件处理、文本 grep/awk/sed、脚本、日志分析；
3. 写 10+ 个实用 Shell 脚本，体会 Shell 的威力与坑；
4. 阅读《鸟哥的 Linux 私房菜》或《Linux Command Line and Shell Scripting Bible》；
5. 模拟一次"入侵排查"实验：在测试机上制造反弹 shell、计划任务后门，按本文应急清单逐步复盘。

Linux 基础并不可怕，关键是"持续在命令行里泡着"。从权限、进程、网络、日志四大块出发，再结合红蓝对抗的实际场景反复练习，你会逐渐形成对系统状态的直觉。
