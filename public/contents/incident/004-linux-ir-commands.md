# Linux 应急响应常用命令速查

> **📘 文档定位**：CISP 考试 应急响应 核心 | 难度：⭐⭐⭐ | 预计阅读：25 分钟
>
> 系统整理 Linux 应急响应全链路常用命令，覆盖进程/网络/用户/文件/日志/持久化六大排查维度，是安全运维和应急响应人员的手边速查手册。

---

## 导航目录

- [一、进程排查命令](#一进程排查命令)
- [二、网络连接排查](#二网络连接排查)
- [三、用户与登录排查](#三用户与登录排查)
- [四、文件与后门排查](#四文件与后门排查)
- [五、日志分析命令](#五日志分析命令)
- [六、持久化机制排查](#六持久化机制排查)
- [七、安全部署 Checklist](#七安全部署-checklist)
- [八、高分考点与知识巧记](#八高分考点与知识巧记)

---

## 一、账号安全

```bash
# 查看可登录用户
cat /etc/passwd | grep -v /nologin | grep -v /false

# UID=0 的用户(不应有 root 之外的)
awk -F: '($3==0){print $1}' /etc/passwd

# 最近登录
last -20       # 成功登录
lastb -20      # 失败登录
lastlog        # 所有用户最后登录

# 当前登录
who && w

# 检查空密码
awk -F: '($2==""){print $1}' /etc/shadow

# SSH 公钥
cat ~/.ssh/authorized_keys
find / -name "authorized_keys" -exec cat {} \; 2>/dev/null
```

---

## 二、进程排查

```bash
# CPU Top 10
ps aux --sort=-%cpu | head -11

# 进程树
ps auxf

# 隐藏进程检测
ps -ef | awk '{print $2}' | sort > /tmp/ps.txt
ls /proc/ | grep -E '^[0-9]+$' | sort > /tmp/proc.txt
diff /tmp/ps.txt /tmp/proc.txt
# → 差异: 可能存在 Rootkit 隐藏的进程

# 可疑进程特征:
# - 名称中包含随机字符/空格
# - 在 /tmp /dev/shm /var/tmp 执行
# - 伪装系统进程名但路径不对
# - 大量CPU使用

# 进程详情
ls -l /proc/PID/exe            # 可执行文件
cat /proc/PID/cmdline | tr '\0' ' '; echo   # 命令行
cat /proc/PID/environ | tr '\0' '\n'         # 环境变量
lsof -p PID                     # 打开的文件
```

---

## 三、网络连接

```bash
# 所有连接
ss -antp | grep ESTAB

# 监听端口
ss -tlnp

# 外网连接(排除内网)
ss -antp | grep -v "127.0.0.1\|10\.\|192.168\.\|172.16"

# DNS 缓存
journalctl -u systemd-resolved --since "1 hour ago"

# ARP 表(检测 ARP 欺骗)
arp -a

# 防火墙规则
iptables -L -n -v
```

---

## 四、文件排查

```bash
# 最近24小时修改的文件
find / -type f -mtime -1 ! -path "/proc/*" ! -path "/sys/*" 2>/dev/null

# 可疑 SUID 文件
find / -perm -4000 -type f -newer /bin/bash 2>/dev/null

# Webshell 搜索
find /var/www/ -name "*.php" -mtime -1
grep -rn "eval(" /var/www/ --include="*.php" 2>/dev/null | grep -v "vendor"
grep -rn "base64_decode" /var/www/ --include="*.php" 2>/dev/null

# 大文件(可能打包数据)
find / -type f -size +100M 2>/dev/null | grep -v proc
```

---

## 五、持久化

```bash
# Crontab
crontab -l
cat /etc/crontab
ls -la /etc/cron.*/

# Systemd
systemctl list-units --type=service --state=running
find /etc/systemd/system/ -name "*.service" -mtime -7

# 自启动
cat ~/.bashrc
cat ~/.profile
cat /etc/profile

# LD_PRELOAD 后门
cat /etc/ld.so.preload 2>/dev/null
echo $LD_PRELOAD
```

---

## 六、日志

```bash
# 认证日志
grep "Failed password" /var/log/auth.log | tail -20
grep "Accepted" /var/log/auth.log | tail -20

# 命令历史
cat ~/.bash_history
cat /root/.bash_history

# 审计日志
ausearch -k exec | tail -50

# 系统日志
journalctl -xe --since "1 hour ago"
```

---

## 七、Rootkit 检测

```bash
chkrootkit
rkhunter --check --skip-keypress

# 被替换的二进制检测
rpm -Va 2>/dev/null          # RHEL/CentOS
debsums -c 2>/dev/null       # Debian/Ubuntu
```

---

## 八、一键取证脚本

```bash
#!/bin/bash
# Linux IR 快速取证
OUTPUT="/tmp/ir_$(hostname)_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUTPUT"

echo "[*] 系统信息" && uname -a > "$OUTPUT/system.txt" && date >> "$OUTPUT/system.txt"
echo "[*] 用户" && (w; last -20) > "$OUTPUT/users.txt"
echo "[*] 进程" && ps auxf > "$OUTPUT/processes.txt"
echo "[*] 网络" && ss -antp > "$OUTPUT/network.txt"
echo "[*] 文件" && find / -type f -mtime -1 ! -path "/proc/*" 2>/dev/null > "$OUTPUT/recent_files.txt"
echo "[*] 完成: $OUTPUT"
```
