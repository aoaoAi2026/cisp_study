# 第三章 Linux系统安全加固

## 3.1 Linux加固概述

Linux是企业服务器最常用的操作系统，也是攻击者最常针对的目标。本章从实战角度出发，全面覆盖Linux系统安全加固的核心要点。

### 3.1.1 Linux安全风险分析

**常见攻击面：**
```
攻击入口
├── 网络层：端口扫描、DDoS、中间人攻击
├── 系统层：弱口令、漏洞利用、提权攻击
├── 应用层：Web漏洞、中间件漏洞
├── 数据层：数据泄露、数据篡改
└── 管理层：社会工程学、供应链攻击
```

**典型入侵路径：**
```
1. 端口扫描发现SSH服务
2. 弱口令暴力破解登录
3. 本地漏洞提权至root
4. 横向移动到其他服务器
5. 安装后门持久化控制
6. 窃取数据或破坏系统
```

### 3.1.2 加固路线图

```
第一阶段：基础加固（必须做）
├── 账户安全
├── 密码策略
├── SSH加固
├── 防火墙配置
├── 关闭无用服务
└── 文件权限加固

第二阶段：增强加固（建议做）
├── SELinux/AppArmor
├── 审计日志
├── 入侵检测
├── 系统监控
├── 文件完整性检查
└── 补丁管理

第三阶段：高级加固（核心系统）
├── 内核参数加固
├── 资源限制
├── 磁盘加密
├── 双因素认证
├── 安全基线自动化
└── 安全运维平台
```

## 3.2 账户与口令安全

### 3.2.1 账户管理

**禁用不必要的系统账户：**
```bash
# 查看所有可登录账户
cat /etc/passwd | grep -v nologin | grep -v false

# 锁定不需要的账户
usermod -L games
usermod -L ftp
usermod -L nobody

# 禁用不必要账户的登录shell
usermod -s /sbin/nologin lp
usermod -s /sbin/nologin mail
usermod -s /sbin/nologin uucp
usermod -s /sbin/nologin operator
usermod -s /sbin/nologin gopher
```

**检查异常账户：**
```bash
# 检查UID为0的账户（应该只有root）
awk -F: '($3 == 0) {print $1}' /etc/passwd

# 检查空密码账户
awk -F: '($2 == "") {print $1}' /etc/shadow

# 检查可登录账户列表
awk -F: '($7 !~ /nologin|false/) {print $1, $7}' /etc/passwd

# 检查最近创建的账户
grep -E "useradd|adduser" /var/log/secure 2>/dev/null || \
grep -E "useradd|adduser" /var/log/auth.log 2>/dev/null
```

**删除无用账户：**
```bash
# 删除不必要的默认账户
userdel adm
userdel lp
userdel sync
userdel shutdown
userdel halt
userdel news
userdel uucp
userdel operator
userdel games
userdel gopher

# 注意：删除前确认这些账户不被系统服务使用
```

### 3.2.2 密码策略加固

**配置密码有效期：**
```bash
# 编辑 /etc/login.defs
cat >> /etc/login.defs << 'EOF'
# 密码最长使用天数
PASS_MAX_DAYS   90
# 密码最短使用天数
PASS_MIN_DAYS   7
# 密码最小长度
PASS_MIN_LEN    12
# 密码过期前提醒天数
PASS_WARN_AGE   14
EOF

# 对已有用户设置密码有效期
chage -M 90 -m 7 -W 14 root
chage -M 90 -m 7 -W 14 <username>

# 查看用户密码状态
chage -l root
```

**配置密码复杂度（pam_pwquality）：**
```bash
# RHEL/CentOS 安装
yum install libpwquality -y

# Ubuntu/Debian 安装
apt install libpam-pwquality -y

# 配置密码复杂度要求
cat > /etc/security/pwquality.conf << 'EOF'
# 密码最小长度
minlen = 12
# 最少包含大写字母数
ucredit = -1
# 最少包含小写字母数
lcredit = -1
# 最少包含数字数
dcredit = -1
# 最少包含特殊字符数
ocredit = -1
# 最多连续相同字符
maxrepeat = 3
# 最少不同字符数
minclass = 3
# 不允许包含用户名
gecoscheck = 1
# 禁止使用的字典
dictcheck = 1
dictpath = /usr/share/dict/words
EOF

# 配置PAM（RHEL/CentOS）
cat > /etc/pam.d/passwd << 'EOF'
password    required    pam_pwquality.so retry=3
password    sufficient    pam_unix.so sha512 shadow nullok try_first_pass use_authtok
password    required    pam_deny.so
EOF
```

**配置账户锁定策略：**
```bash
# RHEL/CentOS 配置登录失败锁定
cat >> /etc/pam.d/system-auth << 'EOF'
auth        required      pam_tally2.so deny=5 unlock_time=300 even_deny_root root_unlock_time=600
EOF

cat >> /etc/pam.d/password-auth << 'EOF'
auth        required      pam_tally2.so deny=5 unlock_time=300 even_deny_root root_unlock_time=600
EOF

# Ubuntu/Debian 配置
cat >> /etc/pam.d/common-auth << 'EOF'
auth required pam_tally2.so deny=5 unlock_time=300 even_deny_root root_unlock_time=600
EOF

# 查看账户锁定状态
pam_tally2 -u root

# 手动解锁账户
pam_tally2 -u root -r
```

### 3.2.3 禁止root直接登录

```bash
# 创建管理员用户
useradd admin
passwd admin
usermod -aG wheel admin    # RHEL/CentOS
# usermod -aG sudo admin   # Ubuntu/Debian

# 配置sudo免密（可选，根据安全要求）
cat >> /etc/sudoers.d/admin << 'EOF'
admin ALL=(ALL) NOPASSWD: ALL
EOF
chmod 0440 /etc/sudoers.d/admin

# 禁止root通过SSH登录
sed -i 's/^#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/^PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config

# 禁止root本地登录（可选，极端安全场景）
# echo "root禁用登录" > /etc/nologin
# 注意：这会禁止所有普通用户登录，仅root可登录

# 重启SSH服务
systemctl restart sshd
```

## 3.3 SSH服务加固

### 3.3.1 基础配置加固

```bash
# 备份原配置
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

# 编辑SSH配置文件
cat > /etc/ssh/sshd_config << 'EOF'
# ===== 协议与端口 =====
# 使用SSH协议版本2
Protocol 2
# 修改默认端口（安全通过隐蔽性，不建议单独依赖）
Port 2222
# 监听地址（根据实际网卡配置）
ListenAddress 0.0.0.0

# ===== 身份验证 =====
# 禁止root登录
PermitRootLogin no
# 禁止空密码
PermitEmptyPasswords no
# 禁用密码认证，使用密钥
PasswordAuthentication no
# 启用公钥认证
PubkeyAuthentication yes
# 公钥存放文件
AuthorizedKeysFile .ssh/authorized_keys
# 禁用基于主机的认证
HostbasedAuthentication no
# 忽略rhosts文件
IgnoreRhosts yes

# ===== 登录控制 =====
# 最大认证尝试次数
MaxAuthTries 3
# 最大同时会话数
MaxSessions 5
# 登录宽限时间（秒）
LoginGraceTime 30
# 允许的用户列表（白名单，按需配置）
# AllowUsers admin opsuser
# 允许的用户组
# AllowGroups sshusers

# ===== 会话与转发 =====
# 禁用TCP转发
AllowTcpForwarding no
# 禁用X11转发
X11Forwarding no
# 禁用代理转发
AllowAgentForwarding no
# 客户端保活间隔
ClientAliveInterval 300
# 客户端保活次数（超时断开）
ClientAliveCountMax 2

# ===== 日志 =====
# 日志级别
LogLevel VERBOSE
# 记录登录信息
SyslogFacility AUTHPRIV

# ===== 其他安全选项 =====
# 禁用用户环境
PermitUserEnvironment no
# 严格模式
StrictModes yes
# 最大启动连接数
MaxStartups 10:30:60
EOF

# 设置正确的权限
chmod 600 /etc/ssh/sshd_config

# 验证配置是否正确
sshd -t

# 重启SSH服务
systemctl restart sshd
```

### 3.3.2 SSH密钥认证配置

```bash
# 在客户端生成密钥对（客户端操作）
ssh-keygen -t ed25519 -b 4096 -C "admin@company.com" -f ~/.ssh/id_ed25519
# 或者RSA密钥
ssh-keygen -t rsa -b 4096 -C "admin@company.com"

# 设置密钥文件权限
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub

# 将公钥上传到服务器
ssh-copy-id -i ~/.ssh/id_ed25519.pub admin@server-ip

# 服务器端设置正确的权限
chmod 700 /home/admin/.ssh
chmod 600 /home/admin/.ssh/authorized_keys
chown -R admin:admin /home/admin/.ssh

# 测试密钥登录
ssh -i ~/.ssh/id_ed25519 admin@server-ip

# 确认密钥登录成功后，再禁用密码认证
# PasswordAuthentication no
```

### 3.3.3 SSH高级加固

**使用fail2ban防止暴力破解：**
```bash
# 安装fail2ban
yum install fail2ban -y      # RHEL/CentOS
apt install fail2ban -y      # Ubuntu/Debian

# 配置SSH防护
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
# 封禁时间（秒）
bantime = 3600
# 检测时间窗口（秒）
findtime = 600
# 最大尝试次数
maxretry = 3
# 忽略的IP
ignoreip = 127.0.0.1 192.168.1.0/24

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
backend = %(sshd_backend)s
EOF

# 启动服务
systemctl enable fail2ban
systemctl start fail2ban

# 查看封禁状态
fail2ban-client status
fail2ban-client status sshd

# 手动解封IP
fail2ban-client set sshd unbanip 192.168.1.100
```

**SSH跳板机配置：**
```bash
# 跳板机上的SSH配置
cat >> /etc/ssh/sshd_config << 'EOF'
# 只允许从跳板机访问内网服务器
# 内网服务器sshd_config配置：
# AllowUsers *@jumper-ip
EOF

# 客户端通过跳板机连接内网服务器
ssh -J admin@jumper-server admin@internal-server

# 或者在~/.ssh/config中配置
cat >> ~/.ssh/config << 'EOF'
Host internal-server
    HostName 10.0.0.100
    User admin
    ProxyJump admin@jumper-server
EOF
```

## 3.4 服务与端口加固

### 3.4.1 关闭不必要的服务

```bash
# 查看所有已启用的服务
systemctl list-unit-files --type=service --state=enabled

# 查看当前运行的服务
systemctl list-units --type=service --state=running

# 关闭危险和不必要的服务
systemctl disable --now avahi-daemon
systemctl disable --now cups
systemctl disable --now bluetooth
systemctl disable --now rpcbind
systemctl disable --now nfs-server
systemctl disable --now vsftpd
systemctl disable --now telnet.socket
systemctl disable --now rsh.socket
systemctl disable --now rlogin.socket
systemctl disable --now rexec.socket

# 禁用不必要的系统服务
systemctl mask ctrl-alt-del.target  # 禁用Ctrl+Alt+Del重启
systemctl mask autofs
systemctl mask abrtd
systemctl mask kdump
```

### 3.4.2 端口最小化

```bash
# 查看当前监听端口
ss -tlnp
netstat -tlnp

# 检查UDP端口
ss -ulnp

# 查看所有网络连接
ss -anp

# 根据业务需求，只保留必要的端口
# 常见需要开放的端口：
# 22 - SSH（建议修改）
# 80 - HTTP
# 443 - HTTPS
# 3306 - MySQL（仅内网）
# 6379 - Redis（仅内网，建议绑定127.0.0.1）

# 验证每个监听端口的必要性
# 对每个开放端口回答：为什么需要开放？能否限制来源IP？
```

## 3.5 文件系统与权限加固

### 3.5.1 关键文件权限

```bash
# 设置系统关键文件权限
chmod 644 /etc/passwd
chmod 000 /etc/shadow
chmod 644 /etc/group
chmod 000 /etc/gshadow
chmod 644 /etc/profile
chmod 644 /etc/bashrc
chmod 600 /etc/ssh/sshd_config
chmod 600 /etc/ssh/ssh_host_*_key
chmod 644 /etc/ssh/ssh_host_*_key.pub
chmod 600 /etc/sudoers
chmod 600 /etc/grub.conf

# 检查SUID/SGID文件（潜在风险）
find / -perm /6000 -type f 2>/dev/null

# 移除不必要的SUID权限
chmod u-s /usr/bin/newgrp
chmod u-s /usr/bin/gpasswd
chmod u-s /usr/bin/chfn
chmod u-s /usr/bin/chsh
chmod g-s /usr/sbin/utempter
```

### 3.5.2 挂载选项加固

```bash
# 编辑 /etc/fstab，添加安全挂载选项
# 对 /tmp 分区加固
tmpfs  /tmp  tmpfs  defaults,nosuid,noexec,nodev  0 0

# 对 /home 分区加固
# /dev/sda3  /home  ext4  defaults,nosuid,noexec,nodev  0 0

# 对 /var 分区加固
# /dev/sda4  /var   ext4  defaults,nosuid,noexec  0 0

# 禁用不必要的文件系统
cat >> /etc/modprobe.d/disable-fs.conf << 'EOF'
install cramfs /bin/true
install freevxfs /bin/true
install jffs2 /bin/true
install hfs /bin/true
install hfsplus /bin/true
install squashfs /bin/true
install udf /bin/true
EOF
```

## 3.6 防火墙配置

### 3.6.1 firewalld配置（RHEL/CentOS）

```bash
# 启用防火墙
systemctl enable firewalld
systemctl start firewalld

# 设置默认区域为drop（拒绝所有入站）
firewall-cmd --set-default-zone=drop

# 放行必要的服务
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https

# 自定义端口
firewall-cmd --permanent --add-port=2222/tcp

# 限制来源IP
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" service name="ssh" accept'

# 重新加载配置
firewall-cmd --reload

# 查看规则
firewall-cmd --list-all
```

### 3.6.2 iptables配置

```bash
# 清空现有规则
iptables -F
iptables -X
iptables -Z

# 默认策略
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# 允许回环接口
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# 允许已建立的连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 放行SSH（限制速率防暴力破解）
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set --name SSH
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 5 --rttl --name SSH -j DROP
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 放行HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# 允许ping
iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT

# 记录并拒绝其他
iptables -A INPUT -j LOG --log-prefix "IPTABLES-DROP: "
iptables -A INPUT -j DROP

# 保存规则
iptables-save > /etc/sysconfig/iptables
```

## 3.7 内核参数加固

```bash
# 编辑 /etc/sysctl.conf
cat > /etc/sysctl.d/99-security.conf << 'EOF'
# ===== 网络安全 =====
# 禁止IP转发（路由器功能，普通服务器不需要）
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0

# 禁止源路由数据包
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv6.conf.default.accept_source_route = 0

# 禁止ICMP重定向
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0

# 禁止发送ICMP重定向
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0

# 启用反向路径过滤（防IP欺骗）
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# 忽略广播ICMP请求（防Smurf攻击）
net.ipv4.icmp_echo_ignore_broadcasts = 1

# 忽略错误ICMP响应
net.ipv4.icmp_ignore_bogus_error_responses = 1

# SYN Cookie（防SYN Flood）
net.ipv4.tcp_syncookies = 1

# 减小SYN重试次数
net.ipv4.tcp_syn_retries = 2
net.ipv4.tcp_synack_retries = 2

# 减小TIMEWAIT连接数
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_keepalive_intvl = 30
net.ipv4.tcp_keepalive_probes = 3

# ===== 文件系统安全 =====
# 禁止coredump
fs.suid_dumpable = 0

# 增大文件描述符限制
fs.file-max = 65535

# ===== 内存安全 =====
# 启用ASLR（地址空间随机化）
kernel.randomize_va_space = 2

# 禁止Magic SysRq键
kernel.sysrq = 0

# 限制pid最大值
kernel.pid_max = 65536
EOF

# 应用配置
sysctl -p /etc/sysctl.d/99-security.conf
```

## 3.8 日志审计

### 3.8.1 配置rsyslog

```bash
# 配置日志集中存储
cat > /etc/rsyslog.d/security.conf << 'EOF'
# 认证日志单独存储
auth,authpriv.*                 /var/log/secure.log

# 内核日志
kern.*                          /var/log/kern.log

# 系统守护进程日志
daemon.*                        /var/log/daemon.log

# 所有日志的错误级别
*.err                           /var/log/error.log

# 发送到远程日志服务器（按需配置）
# *.* @@192.168.1.100:514
EOF

# 重启rsyslog
systemctl restart rsyslog
```

### 3.8.2 配置auditd

```bash
# 安装auditd
yum install audit -y
apt install auditd -y

# 配置审计规则
cat > /etc/audit/rules.d/audit.rules << 'EOF'
# ===== 系统调用审计 =====
# 审计所有setuid/setgid程序的执行
-a always,exit -F arch=b64 -S execve -F path=/usr/bin/su -k privileged
-a always,exit -F arch=b64 -S execve -F path=/usr/bin/sudo -k privileged

# 审计密码修改
-a always,exit -F arch=b64 -S execve -F path=/usr/bin/passwd -k password_change

# ===== 文件访问审计 =====
# 审计passwd/shadow文件修改
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/group -p wa -k identity
-w /etc/gshadow -p wa -k identity

# 审计SSH配置
-w /etc/ssh/sshd_config -p wa -k ssh_config

# 审计sudo配置
-w /etc/sudoers -p wa -k sudo
-w /etc/sudoers.d/ -p wa -k sudo

# 审计防火墙配置
-w /etc/sysconfig/iptables -p wa -k firewall
-w /etc/firewalld/ -p wa -k firewall

# 审计系统库文件（防篡改）
-w /usr/lib64/ -p w -k lib_integrity
-w /lib64/ -p w -k lib_integrity

# ===== 系统管理操作 =====
# 审计账户管理命令
-a always,exit -F arch=b64 -S execve -F path=/usr/sbin/useradd -k account_mgmt
-a always,exit -F arch=b64 -S execve -F path=/usr/sbin/userdel -k account_mgmt
-a always,exit -F arch=b64 -S execve -F path=/usr/sbin/usermod -k account_mgmt
-a always,exit -F arch=b64 -S execve -F path=/usr/sbin/groupadd -k account_mgmt

# 审计系统启动/关机
-w /var/log/wtmp -p wa -k logins
-w /var/run/utmp -p wa -k session
EOF

# 重启auditd
systemctl restart auditd
systemctl enable auditd

# 查看审计日志
ausearch -k password_change
aureport -a
```

## 3.9 入侵检测与防护

### 3.9.1 AIDE文件完整性检查

```bash
# 安装AIDE
yum install aide -y
apt install aide -y

# 初始化数据库
aide --init

# 生成的数据库文件
mv /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz

# 执行完整性检查
aide --check

# 每日自动检查（cron）
cat > /etc/cron.daily/aide_check << 'EOF'
#!/bin/bash
/usr/sbin/aide --check > /var/log/aide/$(date +%Y%m%d).log 2>&1
EOF
chmod +x /etc/cron.daily/aide_check
```

### 3.9.2 RKHunter检查Rootkit

```bash
# 安装RKHunter
yum install rkhunter -y
apt install rkhunter -y

# 更新病毒库
rkhunter --update

# 运行检查
rkhunter --check

# 生成报告
rkhunter --check --report-warnings-only > /var/log/rkhunter.log
```

## 3.10 加固验证清单

```bash
# ===== 快速加固验证脚本 =====

echo "===== Linux加固验证清单 ====="
echo ""

# 1. root登录
echo "[1] SSH root登录检查:"
grep PermitRootLogin /etc/ssh/sshd_config

# 2. 密码策略
echo ""
echo "[2] 密码策略:"
grep -E "PASS_MAX_DAYS|PASS_MIN_LEN" /etc/login.defs

# 3. 空密码账户
echo ""
echo "[3] 空密码账户:"
awk -F: '($2 == "") {print $1}' /etc/shadow || echo "无"

# 4. UID=0账户
echo ""
echo "[4] UID=0账户:"
awk -F: '($3 == 0) {print $1}' /etc/passwd

# 5. 防火墙状态
echo ""
echo "[5] 防火墙状态:"
systemctl is-active firewalld 2>/dev/null || iptables -L | head -5

# 6. SELinux状态
echo ""
echo "[6] SELinux状态:"
getenforce 2>/dev/null || echo "未启用"

# 7. 审计服务
echo ""
echo "[7] 审计服务:"
systemctl is-active auditd

# 8. 监听端口
echo ""
echo "[8] 监听端口:"
ss -tlnp | head -10

echo ""
echo "===== 验证完成 ====="
```

## 3.11 本章小结

本章系统介绍了Linux系统安全加固的实战要点：

1. **账户安全**：禁用无用账户、强化密码策略、禁止root登录
2. **SSH加固**：协议版本、密钥认证、fail2ban防暴力破解
3. **服务端口**：最小化原则，关闭不必要的服务和端口
4. **文件系统**：权限加固、挂载选项安全、SUID/SGID检查
5. **防火墙**：firewalld和iptables两种配置方式
6. **内核加固**：网络安全参数、内存保护、系统调优
7. **日志审计**：rsyslog日志配置、auditd审计规则
8. **入侵检测**：AIDE文件完整性、RKHunter Rootkit检测

下一章将继续Windows系统安全加固的内容。

---

**实战作业：**
1. 找一台测试服务器，按照本章内容做一次完整加固
2. 加固前后各做一次漏洞扫描，对比结果
3. 编写一个你自己的加固脚本
