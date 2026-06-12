# Linux 应急响应常用命令速查

---

## 一、系统基本状态 (第一时间掌握)

```bash
# 1. 时间 / 主机名 / 内核 / 发行版
date
uptime
hostname
uname -a
cat /etc/os-release | head -5

# 2. 当前登录用户 / TTY
who
w
users
tty

# 3. 最近登录 / 失败登录 (黄金信息)
last -n 100
lastb -n 100              # 需要 /var/log/btmp 存在
lastlog
# 关注: 陌生 IP / 非常规账号 / 失败次数异常的账号

# 4. CPU / 内存 / 磁盘 (快速看是否挖矿 / 加密)
top -bn1 | head -20       # 一次性输出, 适合脚本
htop                       # 交互查看 (如果安装了)
free -h
df -h
df -i                      # inode 检查, 勒索病毒会快速消耗 inode
vmstat 1 3                # 3 秒的 CPU/内存上下文切换
iostat -x 1 3             # 磁盘 I/O 是否异常高

# 5. 系统负载 + 时间一致性
cat /proc/loadavg
timedatectl               # 检查时间 (日志时间戳依赖)
```

## 二、账号与认证

```bash
# 1. 当前账号
id
whoami

# 2. /etc/passwd 所有可登录账号 (shell 非 nologin/false)
awk -F: '$7 !~ /(nologin|false|sync|halt|shutdown)/ {print $1, $3, $7}' /etc/passwd

# 3. UID=0 (root) 账号 (是否有后门账号)
awk -F: '$3 == 0 {print $1}' /etc/passwd

# 4. /etc/shadow 中的异常密码字段
#    正常: $6$ / $y$ / locked = `!` / `*`
#    异常: 空字段, 或奇怪的 hash
awk -F: '$2 !~ /^[!*]/ {print $1, $2}' /etc/shadow
# 关注: 空密码 (无字符) / 未知算法

# 5. 最近新增用户 (按 /etc/passwd 修改时间 + /var/log/ 日志)
ls -l /etc/passwd /etc/shadow
grep -E "(useradd|adduser|newusers)" /var/log/auth.log /var/log/secure 2>/dev/null | tail -30

# 6. sudo 配置
cat /etc/sudoers
ls -la /etc/sudoers.d/
# 关注: ALL=(ALL) NOPASSWD: ALL 这类放行

# 7. SSH 配置 / 公钥
grep -E "PermitRootLogin|PasswordAuthentication|PubkeyAuthentication|AuthorizedKeysFile|AllowUsers|AllowGroups|DenyUsers|DenyGroups|Port|PermitEmptyPasswords" /etc/ssh/sshd_config
ls -la /root/.ssh/
ls -la /home/*/.ssh/
cat /root/.ssh/authorized_keys
cat /home/*/.ssh/authorized_keys 2>/dev/null | head -50
# 关注: 新增的陌生公钥、authorized_keys 可写 (权限 666/777)

# 8. SSH 最近登录
grep -E "Accepted|Failed|Invalid" /var/log/auth.log /var/log/secure 2>/dev/null | tail -50
journalctl -u sshd.service --since "24 hours ago" | tail -100

# 9. PAM 模块 (是否被替换为后门)
ls -la /etc/pam.d/
file /lib/x86_64-linux-gnu/security/*.so
# 若怀疑 pam 被篡改, 对比同版本发行版的 hash

# 10. /etc/securetty (允许 root 登录的 TTY 列表)
cat /etc/securetty
```

## 三、进程排查

```bash
# 1. 全量进程树 (最有价值)
ps auxf | head -80
pstree -ap            # 包含参数与 pid

# 2. 可疑进程关注清单:
#    - 无 Company / 无路径的进程
#    - 路径在 /tmp, /dev/shm, /var/tmp, /home
#    - 文件名模仿系统进程 (sshd-new, kthreadx, dbus-daemon-new)
#    - cmdline 含 base64 -d, python -c, curl|bash, wget -O-|sh

# 3. 查看进程 cmdline (原始参数)
for pid in $(ps -eo pid | tail -n +2); do
    echo -n "[pid=$pid] "; cat /proc/$pid/cmdline 2>/dev/null | tr '\0' ' '
    echo
done | head -80

# 4. 查看进程可执行文件是否已删除 (self-delete 木马特征)
ls -la /proc/*/exe 2>/dev/null | grep deleted

# 5. 高 CPU 占用进程 (典型挖矿)
ps -eo pid,ppid,pcpu,pmem,cmd --sort=-pcpu | head -20

# 6. 进程网络连接
ls -la /proc/*/fd 2>/dev/null | grep socket | head -30

# 7. 无 TTY 的进程 (后台 / 恶意进程常见)
ps -eo pid,tt,cmd | grep " ? " | head -40

# 8. 进程环境变量 (可能含秘密信息)
cat /proc/<PID>/environ | tr '\0' '\n' | head -30

# 9. strace 跟踪可疑进程系统调用 (谨慎, 可能影响性能)
strace -ff -p <PID> -o /tmp/trace.log -e trace=network,open,read,write 2>&1 | head -30

# 10. 进程打开的文件
lsof -p <PID> | head -50
```

## 四、网络排查

```bash
# 1. 所有监听端口 + 进程
ss -antlp
netstat -antlp
# 关注: 0.0.0.0 端口且进程名异常

# 2. ESTABLISHED 外部连接 (横向 / C2)
ss -antp | grep ESTAB
# 关注: 非 80/443 的外部地址; 同一 remote IP 多个连接

# 3. 原始套接字 (raw socket, 可疑 sniffer)
ss -w
ss -af link

# 4. 抓包 (tcpdump)
#    抓取 5 分钟, 用 Wireshark 离线分析
tcpdump -i any -w /tmp/capture.pcap -s 0 &
sleep 300; kill %1

#    抓 SYN 扫描 / 445 等横向:
tcpdump -n -i any "tcp[tcpflags] & tcp-syn != 0 and dst port 445"

# 5. 检查网卡 promisc 模式
ip link show
# 若某网卡 flags 含 PROMISC, 可能有 sniffer 运行

# 6. iptables / nftables 规则 (是否被篡改)
iptables -L -n -v --line-numbers
iptables -t nat -L -n -v
nft list ruleset

# 7. /etc/hosts / DNS
cat /etc/hosts
cat /etc/resolv.conf
# 关注: 指向可疑 DNS / 被劫持的内网域名

# 8. ARP 表 (ARP 欺骗 / 中间人)
arp -a
ip neigh
# 关注: 同一 MAC 多 IP / 网关 MAC 异常

# 9. 谁在连接我? (反查 IP 归属)
ss -antp | grep ESTAB | awk '{print $5}' | awk -F: '{print $1}' | sort -u | while read ip; do
    echo "=== $ip ==="
    whois -H "$ip" | grep -iE "netname|org-name|country" | head -3
done
```

## 五、文件系统排查

```bash
# 1. 最近 7 天修改的可执行 / 脚本 / 配置
find /etc /usr/bin /usr/sbin /bin /sbin /var/www /tmp /dev/shm /var/tmp /root /home \
    -type f -mtime -7 2>/dev/null | head -100

# 2. SUID / SGID 程序 (攻击者常设置 SUID 后门)
find / -type f \( -perm -4000 -o -perm -2000 \) 2>/dev/null

# 3. 无主文件 (uid/gid 不存在 /etc/passwd)
find / -nouser -o -nogroup 2>/dev/null | head -20
# 可能是攻击者 copy 进来、但没创建用户

# 4. 可写系统配置目录
ls -la /etc/ | head -20
find /etc -maxdepth 2 -writable -type d 2>/dev/null

# 5. 临时目录与下载文件
ls -lat /tmp/
ls -lat /dev/shm/
ls -lat /var/tmp/

# 6. /var/www / 应用目录可疑脚本 (WebShell)
#    见 "WebShell 排查" 章节

# 7. Web 日志最近 POST / GET (WebShell 痕迹)
grep "POST" /var/log/nginx/access.log /var/log/httpd/access_log 2>/dev/null | tail -50
grep "cmd=" /var/log/nginx/access.log | tail -30

# 8. 可疑大文件 / 加密文件
find / -type f -size +10M -mtime -3 2>/dev/null | head -30
find /var -iname "*readme*ransom*" 2>/dev/null | head -10

# 9. 隐藏文件与目录
ls -la /
ls -la /root
ls -la /home
find / -name ".*" -type f 2>/dev/null | grep -v proc | head -30

# 10. RPM / dpkg 包完整性校验 (检查系统二进制是否被替换)
rpm -Va 2>&1 | grep -E "^[0-9]+\. [0-9]+ /" | head -30
# 或 Debian:
dpkg -V 2>&1 | head -30
# 关注: 标记 "5" (MD5 改变) 的关键二进制 (ssh, sudo, ps, netstat, ls, top)
```

## 六、持久化排查

```bash
# 1. cron / crontab
crontab -l
ls -la /etc/cron.d/
cat /etc/crontab
ls -la /etc/cron.hourly/ /etc/cron.daily/ /etc/cron.weekly/ /etc/cron.monthly/
ls -la /var/spool/cron/
# 关注: curl / wget 脚本、以 bash/sh 结束、路径在 /tmp

# 2. init 脚本
ls -la /etc/init.d/
ls -la /etc/rc*.d/
cat /etc/rc.local

# 3. systemd
systemctl list-units --type=service --state=running | head -60
systemctl list-timers
# 关注: ExecStart 指向 /tmp、URL、动态下载脚本

# 4. profile / bashrc (登录 shell 执行)
cat /etc/profile
cat /etc/bash.bashrc
ls -la /etc/profile.d/
cat /root/.bashrc
cat /root/.bash_profile
# 关注: alias ssh=后门、PROMPT_COMMAND 植入、source 可疑脚本

# 5. /etc/ld.so.preload (动态库劫持 rootkit)
cat /etc/ld.so.preload
ls -la /etc/ld.so.preload
# 非空 = 非常可疑 (正常系统通常为空或不存在)

# 6. /etc/ld.so.conf.d/
ls -la /etc/ld.so.conf.d/
# 关注: 新增 .conf 指向可疑目录

# 7. kernel module rootkit
lsmod
# 关注: 无信息 / 奇怪名字的模块 (非发行版自带)
cat /proc/modules | head -30

# 8. systemd-journald / rsyslog 配置是否被修改 (关闭日志 / 转储到攻击者服务器)
cat /etc/rsyslog.conf
grep -E "auth|cron|daemon" /etc/rsyslog.conf /etc/rsyslog.d/*.conf 2>/dev/null
ls -la /var/log/ | head -30

# 9. systemd-journald Persistent / 是否开启
grep -i "Storage" /etc/systemd/journald.conf
```

## 七、关键日志分析

```bash
# 1. 认证日志
tail -n 200 /var/log/auth.log    # Debian/Ubuntu
tail -n 200 /var/log/secure      # RHEL/CentOS

# 2. 系统日志
tail -n 200 /var/log/syslog
tail -n 200 /var/log/messages
journalctl -n 200 --no-pager

# 3. sudo 执行记录
grep "sudo" /var/log/auth.log | tail -50

# 4. SSH 失败 (暴力破解源 IP)
grep "Failed password" /var/log/auth.log /var/log/secure 2>/dev/null |
    awk '{for(i=1;i<=NF;i++) if($i ~ /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/) print $i}' |
    sort | uniq -c | sort -rn | head -20

# 5. Web 访问日志 (WebShell 扫描)
#    见 "WebShell 排查" 章节

# 6. bash 历史
cat /root/.bash_history
cat /home/*/.bash_history 2>/dev/null
# 关注: wget / curl 下载 / base64 -d / chmod +x / ssh 多 IP

# 7. auditd (若启用, 能看到 exec/文件访问 / 特权调用)
cat /var/log/audit/audit.log | audit2allow | head -50
ausearch -m execve --start recent -i | head -50

# 8. dmesg / kernel 异常
dmesg -T | tail -50
journalctl -k -n 100
```

## 八、辅助工具 (一键生成报告)

```bash
# 1. Rootkit 检测
chkrootkit
rkhunter --check

# 2. 系统完整性
aide --check
aide --init

# 3. 取证辅助
#    - LiME (Linux Memory Extractor) 内存镜像
#    - Volatility / Rekall 离线分析内存
#    - sleuthkit / autopsy 文件系统分析
#    - bulk_extractor (从镜像中提 email / URL / 信用卡等)

# 4. YARA 扫描规则
#    https://github.com/Yara-Rules/rules
yara -r /path/to/rules /root /tmp /var/www

# 5. 综合信息收集脚本
#    - https://github.com/carlospolop/PEASS-ng (linuxPEASS / winPEAS)
#    - https://github.com/TonyThePenny/LinEnum
#    - 应急时跑一次, 全量收集
```

## 九、应急脚本 (可粘贴执行)

```bash
# 把以下内容保存为 /tmp/ir.sh, 执行 bash /tmp/ir.sh
# 输出保存到 /tmp/ir_report.txt

exec 1>/tmp/ir_report.txt 2>&1
echo "=== [Incident Report @ $(date)] ==="
echo
echo "[+] Uptime:" && uptime
echo "[+] Hostname:" && hostname
echo "[+] Kernel:" && uname -a
echo
echo "[+] Current users:" && who
echo "[+] Recent logins:" && last -n 30
echo "[+] UID=0 accounts:" && awk -F: '$3==0' /etc/passwd
echo
echo "[+] CPU top 10:" && ps -eo pid,ppid,pcpu,cmd --sort=-pcpu | head -11
echo
echo "[+] Processes with deleted executables:"
ls -la /proc/*/exe 2>/dev/null | grep deleted
echo
echo "[+] Listening ports:" && ss -antlp
echo
echo "[+] /tmp files:" && ls -lat /tmp/ | head -20
echo "[+] /dev/shm files:" && ls -lat /dev/shm/ | head -20
echo
echo "[+] Cron jobs:"
(crontab -l 2>&1; ls -la /etc/cron.d/ 2>&1; cat /etc/crontab 2>&1) | head -80
echo
echo "[+] /etc/ld.so.preload:" && cat /etc/ld.so.preload 2>&1
echo "[+] Recent modified files in /etc (7 days):" && find /etc -type f -mtime -7 2>/dev/null
echo
echo "[+] SUID files:" && find / -perm -4000 2>/dev/null | head -30
echo
echo "[+] SSH authorized_keys:" && cat /root/.ssh/authorized_keys 2>&1 | head -30
echo
echo "[+] iptables:" && iptables -L -n -v --line-numbers
echo
echo "[+] Recent /var/log/auth.log (last 100 lines):"
tail -100 /var/log/auth.log /var/log/secure 2>/dev/null
echo
echo "[+] .bash_history:" && cat /root/.bash_history 2>/dev/null | tail -50
echo "=== [End] ==="
```

## 十、CheckList

- [ ] 快速状态: uptime, 登录用户, CPU/内存/磁盘
- [ ] 账号安全: root 以外 UID=0 账号、sudo 配置、SSH authorized_keys
- [ ] 进程: 异常路径、deleted exe、高 CPU、python -c / curl|sh 等命令
- [ ] 网络: ESTABLISHED 到未知 IP、监听端口、iptables 规则
- [ ] 文件: /tmp、/dev/shm、上传目录、SUID、无主文件、.htaccess
- [ ] 持久化: cron、systemd unit、profile/bashrc、ld.so.preload、kernel module
- [ ] 日志: /var/log/auth.log, /var/log/syslog, bash_history, Web access.log
- [ ] 工具: chkrootkit/rkhunter/PMF/YARA
- [ ] 脚本: 执行应急脚本, 保存报告到 /tmp
- [ ] 取证: 保留镜像 + hash, 不删除原始文件
- [ ] 隔离: 断网后再做详细排查, 防止横向
