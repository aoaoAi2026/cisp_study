# 第1章 Linux系统安全概述

## 1.1 Linux安全基础概念

### 1.1.1 Linux安全模型

Linux操作系统采用了多层次的安全模型来保护系统资源和用户数据。这个安全模型的核心建立在几个基本概念之上：用户与组的身份认证、文件权限的访问控制、进程的资源管理，以及安全上下文的隔离机制。理解这些基础概念是进行安全加固的必备前提。

Linux系统中的每一个文件和进程都归属于某个用户和组。用户通过身份认证（通常是密码或SSH密钥）登录系统后，其操作权限受到文件权限和进程特权的限制。这种基于用户和组的权限模型被称为自主访问控制（Discretionary Access Control, DAC）。在DAC模型下，文件的所有者可以自主决定谁有权读取、写入或执行该文件。

除了DAC之外，Linux还支持强制访问控制（Mandatory Access Control, MAC）机制，如SELinux和AppArmor。MAC模型下，系统管理员可以定义全局安全策略，这些策略对所有用户和进程都具有约束力，即使文件所有者也无法绕过。CentOS和RHEL系统默认启用SELinux，而Ubuntu系统则默认使用AppArmor作为其MAC实现。

```
# 查看当前系统的SELinux状态
$ getenforce
Enforcing

# 查看SELinux的详细状态信息
$ sestatus
SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Current mode:                   enforcing
Mode from config file:          enforcing
Policy version:                 31
Policy from config file:        targeted
```

### 1.1.2 安全的核心原则

在Linux安全加固的实践中，有几个核心原则需要始终遵循。首先是**最小权限原则**（Principle of Least Privilege），该原则要求任何用户、程序或进程都只应被授予完成其任务所必需的最小权限集合。例如，一个Web服务器进程不需要root权限就能运行，它应该以专门创建的低权限用户身份运行，从而限制一旦该进程被攻击所能造成的损害范围。

其次是**纵深防御原则**（Defense in Depth），该原则主张在系统的多个层次上部署安全控制措施。即使某一层防护被突破，攻击者仍然需要面对后续层次的防护。这类似于现实中的城堡防御体系——外围城墙被攻破后，还有内城墙、护城河和守备部队等多道防线。在Linux系统中，纵深防御可能包括：网络层面的防火墙和入侵检测、系统层面的用户权限和文件权限、应用层面的安全配置和代码审计，以及物理层面的访问控制。

**默认拒绝原则**（Default Deny）是另一个重要的安全准则。该原则要求除非明确允许，否则所有访问都应被拒绝。与其费尽心思列出所有危险的禁止操作，不如明确列出所有允许的操作，其他一切则默认被禁止。这一原则在防火墙规则、SSH访问控制、SELinux策略等场景中都有广泛应用。

```
# 基于默认拒绝原则的iptables防火墙配置示例
# 首先删除所有现有规则
iptables -F
iptables -X

# 设置默认策略为DROP（拒绝）
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# 允许已建立的连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 仅允许特定端口的入站流量
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# 允许ping请求
iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT
```

### 1.1.3 安全边界的概念

Linux系统中的安全边界（Security Boundary）是分隔不同信任级别的分界线。理解这些边界对于正确部署安全控制至关重要。在同一安全边界内的组件通常具有相同的信任级别，而跨边界的访问则需要经过严格的验证和控制。

用户空间与内核空间的分离是Linux系统中最基本的安全边界。用户进程运行在用户空间，其权限受到严格限制；当用户进程需要访问硬件或执行特权操作时，必须通过系统调用请求内核代为执行。内核空间拥有完整的系统权限，如果攻击者成功突破用户空间进入内核空间，整个系统的控制权就将易手。

网络边界是另一个重要的安全边界。Linux系统通常通过iptables或nftables构建防火墙来控制进出系统的网络流量。正确配置的防火墙可以有效阻止未授权的网络访问，将潜在攻击者拒之门外。

容器边界在现代Linux系统中变得越来越重要。通过namespaces和cgroups技术，容器提供了进程级别的隔离。一个被攻陷的容器不应该能够直接影响宿主系统或其他容器，这就是容器安全边界的作用所在。

```
# 查看系统中的名称空间（容器隔离的基础）
$ ls -la /proc/self/ns
total 4096 Jun 25 10:30:22 2026 ..
lrwxrwxrwx 1 root root 0 Jun 25 10:30:22 2026 cgroup -> cgroup:[4026531835]
lrwxrwxrwx 1 root root 0 Jun 25 10:30:22 2026 ipc -> ipc:[4026531839]
lrwxrwxrwx 1 root root 0 Jun 25 10:30:22 2026 mnt -> mnt:[4026531840]
lrwxrwxrwx 1 root root 0 Jun 25 10:30:22 2026 net -> net:[4026531841]
lrwxrwxrwx 1 root root 0 Jun 25 10:30:22 2026 pid -> pid:[4026531844]
lrwxrwxrwx 1 root root 0 Jun 25 10:30:22 2026 user -> user:[4026531837]
lrwxrwxrwx 1 root root 0 Jun 25 10:30:22 2026 uts -> uts:[4026531838]
```

## 1.2 主流发行版安全特性

### 1.2.1 CentOS/RHEL的安全特性

CentOS（Community Enterprise Operating System）和其商业版本RHEL（Red Hat Enterprise Linux）是企业级Linux应用的标杆。这些发行版在安全方面有着卓越的表现，其安全特性主要体现在以下几个方面。

**SELinux（Security-Enhanced Linux）** 是RHEL/CentOS最显著的安全特性之一。SELinux由美国国家安全局（NSA）开发，采用Linux安全模块（LSM）框架实现。它在传统的Unix权限控制之上添加了基于类型强制（Type Enforcement）的访问控制机制。每个文件和进程都被赋予一个类型标签，而SELinux策略则定义了哪些类型可以相互访问。例如，Web服务器进程可能被标记为httpd_t类型，而Web内容文件被标记为httpd_sys_content_t类型，SELinux策略会规定httpd_t类型的进程只能读取httpd_sys_content_t类型的文件。

```
# 在CentOS/RHEL上管理SELinux状态
# 查看SELinux是否启用
getenforce

# 临时关闭SELinux（重启后失效）
setenforce 0

# 永久修改SELinux配置
# 编辑 /etc/selinux/config 文件
SELINUX=disabled  # 完全禁用
SELINUX=permissive  # 启用但只记录不执行
SELINUX=enforcing  # 启用并强制执行

# 查看文件的SELinux上下文
ls -Z /var/www/html
# 输出示例：-rw-r--r--. root root unconfined_u:object_r:httpd_sys_content_t:s0 /var/www/html/index.html

# 修改文件的SELinux上下文
semanage fcontext -a -t httpd_sys_content_t "/web(/.*)?"
restorecon -Rv /web
```

**firewalld** 是RHEL/CentOS 7及更高版本的默认防火墙管理工具。它提供了动态管理的防火墙功能，支持网络Zones的概念，可以根据不同的网络环境（如家庭、办公、公用网络）应用不同的安全策略。与传统的iptables相比，firewalld支持运行时更改配置而无需中断现有连接。

```
# CentOS/RHEL上使用firewalld配置防火墙
# 查看防火墙状态
systemctl status firewalld

# 查看当前活跃的规则
firewall-cmd --list-all

# 永久允许HTTP服务
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https

# 永久允许特定端口
firewall-cmd --permanent --add-port=8080/tcp

# 重新加载防火墙规则使更改生效
firewall-cmd --reload

# 创建自定义Zone
firewall-cmd --permanent --new-zone=myzone
firewall-cmd --permanent --zone=myzone --add-service=ssh
firewall-cmd --permanent --zone=myzone --add-port=2222/tcp
firewall-cmd --reload
```

RHEL/CentOS还提供了**OpenSCAP**工具用于安全合规性扫描。该工具基于SCAP（安全内容自动化协议）标准，可以对照CIS Benchmark等安全基线检查系统配置，发现安全漏洞和配置问题。

```
# 使用OpenSCAP进行安全基线扫描
# 安装OpenSCAP工具
yum install -y openscap-scanner scap-security-guide

# 列出可用的安全配置文件
oscap info /usr/share/xml/scap/ssg/content/ssg-rhel7-ds.xml

# 执行安全基线扫描
oscap xccdf eval --profile xccdf_org.ssgproject.content_profile_cis \
    --results /tmp/scan-results.xml \
    --report /tmp/scan-report.html \
    /usr/share/xml/scap/ssg/content/ssg-rhel7-ds.xml
```

### 1.2.2 Ubuntu的安全特性

Ubuntu是目前最流行的桌面Linux发行版之一，同时也在服务器领域有着广泛的应用。Ubuntu的安全特性主要体现在其对**AppArmor**的默认支持以及其积极的安全更新策略。

**AppArmor**是另一种MAC（强制访问控制）系统，与SELinux相比，它采用了一种更易于管理的配置文件方式。AppArmor通过声明式配置文件定义程序可以访问哪些文件和资源，而不是像SELinux那样基于复杂的类型和角色模型。这使得AppArmor对于普通管理员来说更加友好和易于理解。

```
# Ubuntu上管理AppArmor
# 查看AppArmor状态
aa-status
# 输出示例：
# apparmor module is loaded.
# 12 profiles are in enforce mode.
# ...

# 查看AppArmor配置目录
ls -la /etc/apparmor.d/

# 禁用AppArmor（不推荐）
# 临时禁用
sudo systemctl stop apparmor
# 永久禁用 - 编辑 /etc/default/grub
# 添加: GRUB_CMDLINE_LINUX="apparmor=0"
# 然后执行: sudo update-grub

# 查看某个程序的AppArmor配置文件
cat /etc/apparmor.d/usr.sbin.ntpd
```

Ubuntu的**Uncomplicated Firewall（UFW）**为iptables提供了一个简化的前端，使得防火墙配置变得直观易用。即使是不熟悉Linux网络管理的用户也能快速配置出基本的安全防护。

```
# Ubuntu上使用UFW配置防火墙
# 查看UFW状态
sudo ufw status verbose

# 启用UFW
sudo ufw enable

# 设置默认策略
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 允许SSH连接（重要！先执行此操作再启用防火墙）
sudo ufw allow ssh
# 或者指定端口
sudo ufw allow 22/tcp

# 允许特定应用
sudo ufw allow 'OpenSSH'
sudo ufw allow 'Nginx Full'

# 允许特定端口和协议
sudo ufw allow 8080/tcp

# 限制IP地址访问
sudo ufw allow from 192.168.1.0/24 to any port 22

# 拒绝特定连接
sudo ufw deny from 10.0.0.0/8 to any port 3306

# 删除规则
sudo ufw delete allow 8080/tcp

# 查看已添加的规则编号
sudo ufw status numbered
# 删除指定编号的规则
sudo ufw delete 3
```

Ubuntu还提供了**Snap包管理器**作为传统APT的补充。Snap包在独立的容器中运行，提供了额外的隔离层，可以有效限制恶意或有漏洞的软件对系统其他部分的影响。此外，Ubuntu的**Livepatch**服务允许用户在不重启系统的情况下应用内核安全更新，这对于需要高可用性的服务器环境非常有价值。

### 1.2.3 Debian的安全特性

Debian作为Ubuntu的上游发行版，以其稳定性和安全性著称。Debian项目的安全团队维护着一个专门的安全更新仓库，确保已知的安全漏洞能够被及时修复。

Debian默认不启用任何MAC系统，这给了管理员完全的选择权，可以根据需要部署SELinux、AppArmor或其他安全模块。Debian仓库中包含了所有主流MAC系统的软件包，安装和配置都非常方便。

```
# 在Debian上安装和配置SELinux
# 安装SELinux工具和策略
apt-get install selinux-basics selinux-policy-default

# 启用SELinux
selinux-activate

# 安装auditd用于SELinux日志记录
apt-get install auditd

# 在Debian上安装AppArmor
apt-get install apparmor apparmor-profiles apparmor-utils

# 启用AppArmor
systemctl enable apparmor
systemctl start apparmor

# 使用aa-status检查状态
aa-status
```

Debian的**安全更新**机制非常成熟。稳定版（Stable）发布后，安全更新会被单独打包并发布到security.debian.org仓库。管理员可以配置系统自动或手动安装这些更新，而无需等待完整的版本升级。

```
# 配置Debian自动安全更新
# 安装unattended-upgrades包
apt-get install unattended-upgrades

# 启用自动安全更新
dpkg-reconfigure -plow unattended-upgrades

# 手动配置自动更新
# 编辑 /etc/apt/apt.conf.d/50unattended-upgrades
```

## 1.3 安全加固原则

### 1.3.1 最小权限原则详解

最小权限原则是Linux安全加固的基石。该原则要求系统中的每个主体（用户、程序、进程）都只应被授予完成其合法任务所必需的最小权限集合。遵循这一原则可以显著降低系统被攻击的风险，因为即使某个账户或程序被攻破，攻击者所能造成的损害也被限制在最小范围内。

实施最小权限原则需要从多个维度考虑。在**用户权限**方面，应该避免给普通用户分配不必要的超级用户权限，sudo的使权应该精确到具体命令和具体用户。在**程序权限**方面，服务进程应该以专门的低权限用户身份运行，避免以root身份运行网络服务。在**文件权限**方面，应该遵循"need-to-know"原则，敏感文件只对需要访问它们的用户可见。

```
# 检查拥有sudo权限的用户和权限范围
# 查看哪些用户可以sudo
getent group sudo
# 或
cat /etc/group | grep sudo

# 查看具体的sudo权限配置（以root身份）
visudo -c
# 或查看 /etc/sudoers.d/ 目录下的配置

# 创建权限受限的sudo规则示例
# 允许webadmin用户仅能重启nginx服务
echo "webadmin ALL=(root) /bin/systemctl restart nginx" >> /etc/sudoers.d/webadmin

# 允许dbadmin用户以root身份运行mysql命令，但不能运行其他命令
echo "dbadmin ALL=(root) /usr/bin/mysql, /usr/bin/mysqldump" >> /etc/sudoers.d/dbadmin

# 验证配置
sudo -l -U webadmin
```

### 1.3.2 纵深防御体系构建

纵深防御是一种综合性的安全策略，它主张在系统的多个层次部署多种互补的安全控制措施。在Linux系统中，纵深防御通常包括以下几个层次：

**物理安全层**：限制对服务器物理访问，设置BIOS密码，防止从外部介质启动等。

**网络安全层**：部署防火墙控制网络流量，使用网络入侵检测系统，启用SELinux/AppArmor的网络策略等。

**系统安全层**：及时更新系统和软件，禁用不必要的服务，配置强密码策略，限制用户权限等。

**应用安全层**：安全配置Web服务器、数据库等应用软件，定期进行安全更新，启用应用级审计等。

**数据安全层**：加密敏感数据，定期备份，实施文件完整性检查等。

```
# 构建纵深防御的示例脚本
#!/bin/bash
# filename: harden_system.sh
# Linux系统安全加固脚本

echo "开始系统安全加固..."

# 1. 更新系统和安装安全工具
echo "[1/10] 更新系统软件包..."
yum update -y || apt-get update && apt-get upgrade -y

# 2. 配置防火墙
echo "[2/10] 配置防火墙..."
if command -v firewall-cmd &> /dev/null; then
    firewall-cmd --set-default-zone=drop
    firewall-cmd --permanent --add-service=ssh
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --reload
elif command -v ufw &> /dev/null; then
    ufw --force enable
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
fi

# 3. 禁用不必要的服务
echo "[3/10] 禁用不必要的服务..."
for service in telnet rsh rlogin xinetd cups vsftpd; do
    systemctl stop $service 2>/dev/null
    systemctl disable $service 2>/dev/null
done

# 4. 配置SSH安全
echo "[4/10] 配置SSH安全..."
sed -i 's/^PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd

# 5. 设置密码策略
echo "[5/10] 设置密码策略..."
if [ -f /etc/login.defs ]; then
    sed -i 's/PASS_MIN_LEN.*/PASS_MIN_LEN 12/' /etc/login.defs
fi

# 6. 限制文件权限
echo "[6/10] 限制关键文件权限..."
chmod 600 /etc/shadow
chmod 600 /etc/gshadow
chmod 644 /etc/passwd
chmod 644 /etc/group

# 7. 启用审计
echo "[7/10] 启用系统审计..."
systemctl enable auditd
systemctl start auditd

# 8. 配置SELinux/AppArmor
echo "[8/10] 配置MAC..."
if command -v getenforce &> /dev/null; then
    setenforce 1
fi

# 9. 设置内核参数
echo "[9/10] 设置网络安全内核参数..."
cat >> /etc/sysctl.conf << EOF
# 禁止IP源路由
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# 禁止ICMP重定向
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0

# 开启SYN Cookie防护
net.ipv4.tcp_syncookies = 1
EOF
sysctl -p

# 10. 安装配置fail2ban
echo "[10/10] 安装配置fail2ban..."
yum install -y fail2ban || apt-get install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban

echo "系统安全加固完成！"
```

### 1.3.3 安全配置基线

安全配置基线是一组经过验证的安全配置标准，它定义了系统在特定安全级别下应该满足的配置要求。使用安全配置基线可以确保系统的安全配置达到业界认可的标准水平，避免因个人经验不足而遗漏重要的安全设置。

**CIS Benchmark**是最广泛使用的安全配置基线标准之一，由互联网安全中心（Center for Internet Security）制定。CIS Benchmark针对各种操作系统、数据库、Web服务器等提供了详细的安全配置指南，包括每个检查项的重要性等级（Level 1、Level 2）、检查方法、修复建议等。

```
# 使用Lynis进行安全审计（适用于所有Linux发行版）
# 安装Lynis
git clone https://github.com/CISOfy/lynis.git
cd lynis
./lynis audit system

# 运行示例输出：
# [+] System Tools
# =================
#  - Checking installed tools...
#  - System tool: insserv                                         [ OK ]
#  - System tool: systemctl                                       [ OK ]
#
#  [+] Security Controllers
#  =========================
#  - Checking if SELinux is available                             [ OK ]
#  - Checking SELinux status                                      [ ENABLED ]
#
#  [+] System Logging
#  ==================
#  - Checking if a log daemon is running                          [ OK ]
#  - Checking logrotate configuration                              [ OK ]
#
#  [+] File Integrity
#  ===================
#  - Checking for AIDE                                            [ FOUND ]
```

## 1.4 系统安全检查方法

### 1.4.1 本地安全检查

进行本地安全检查是了解系统当前安全状态的重要手段。系统管理员应该定期执行安全检查，以便及时发现潜在的安全问题和配置缺陷。

本地安全检查通常包括以下几个方面：

**用户和组检查**：查看系统中是否存在异常的用户账户，检查是否有空密码或弱密码账户，审查sudo权限分配，查找已禁用账户的异常登录等。

```bash
# 检查所有用户账户
cat /etc/passwd

# 检查可以登录的Shell账户（非/sbin/nologin或/false）
grep -v nologin /etc/passwd | grep -v false

# 检查空密码账户
awk -F: '($2 == "") {print}' /etc/shadow

# 检查UID为0的非root账户（非常危险！）
awk -F: '($3 == 0) {print}' /etc/passwd

# 查看最近登录失败的记录
lastb | head -20

# 查看当前登录的用户
who

# 查看用户组
cat /etc/group
```

**进程和服务检查**：审计正在运行的进程，识别异常进程；检查开机自启服务；查看监听端口和服务banner信息。

```bash
# 检查正在运行的高危进程
ps aux | grep -E '(nc|netcat|ncat|wget|curl|bash -i|/bin/sh)'

# 检查隐藏进程
ps -ef | awk '{print $2}' | sort -n | uniq > /tmp/ps_procs
ls -la /proc/ | awk '{print $9}' | sort -n | uniq | comm -13 /tmp/ps_procs -

# 检查监听端口（网络服务）
ss -tulpn
# 或
netstat -tulpn

# 检查所有运行的服务
systemctl list-units --type=service --state=running
# 对于init.d系统
ls -la /etc/init.d/
chkconfig --list

# 检查服务是否开机自启
systemctl list-unit-files | grep enabled
```

**文件完整性检查**：检查系统关键文件的修改时间戳，验证重要文件的哈希值，查找异常的计划任务。

```bash
# 检查最近修改的关键系统文件
find /etc -type f -mtime -7 -ls

# 检查计划任务
crontab -l
cat /etc/crontab
ls -la /etc/cron.d/
ls -la /var/spool/cron/

# 检查异常的计划任务
cat /etc/cron.daily/* 2>/dev/null | grep -i "wget\|curl\|nc\|bash"

# 检查启动脚本
ls -la /etc/rc.local
ls -la /etc/init.d/
```

### 1.4.2 网络安全扫描

网络安全扫描用于发现系统中可能存在的网络层面的安全漏洞和配置问题。常用的扫描工具包括nmap、nessus、OpenVAS等。

```bash
# 使用nmap进行基本安全扫描
# 扫描开放端口
nmap -sT -sV -p 1-10000 localhost

# 扫描所有端口
nmap -sT -p- localhost

# 操作系统检测
nmap -O localhost

# 服务版本检测
nmap -sV --version-intensity 5 localhost

# 使用nmap脚本进行漏洞扫描
nmap --script=vuln localhost

# 常用漏洞检测脚本
nmap --script= ssh-v1,ssl-ccs-injection,ssl-cert,ssl-date localhost
```

### 1.4.3 自动化安全评估工具

自动化安全评估工具可以系统地检查系统的安全配置，是安全审计的重要辅助手段。这些工具通常内嵌了安全基线检查规则，可以自动对照标准发现配置问题。

**Lynis**是一个开源的安全审计工具，支持Linux、macOS、Solaris等Unix系统。它可以检查系统的安全配置、运行的服务、文件完整性、权限设置等多个方面。

```bash
# 安装和运行Lynis
# 在Debian/Ubuntu上
apt-get install lynis

# 在CentOS/RHEL上
yum install epel-release
yum install lynis

# 运行完整审计
lynis audit system

# 运行特定测试
lynis audit system --tests "FILE-6350 FILE-6352"

# 查看Lynis的建议报告
cat /var/log/lynis-report.dat

# 设置定时自动运行
echo "0 3 * * * root /usr/sbin/lynis audit system --cronjob" >> /etc/crontab
```

**AIDE（Advanced Intrusion Detection Environment）**是一个文件完整性检查工具，它可以监控系统文件的变更。当系统文件被非法修改时，AIDE能够及时发现并报警。

```bash
# 安装AIDE
apt-get install aide
yum install aide

# 初始化AIDE数据库
aide --init

# 检查完整性（日常使用）
aide --check

# 更新数据库（确认正常变更后）
aide --update

# 配置AIDE自定义规则
# 编辑 /etc/aide.conf
```

## 1.5 安全基线标准

### 1.5.1 CIS Benchmark详解

CIS Benchmark（Center for Internet Security Benchmarks）是由美国互联网安全中心制定的安全配置最佳实践标准。它是全球公认的最权威的安全配置基线之一，被广泛应用于企业安全评估和合规审计。

CIS Benchmark的检查项按照安全级别分为两个等级：

- **Level 1**：适用于大多数系统，基本安全要求，配置相对保守，不会对业务功能产生显著影响。
- **Level 2**：适用于高安全环境，提供更严格的安全控制，某些配置可能会影响系统功能或性能。

每个检查项都包含以下信息：

- 检查项ID（如：1.1.1）
- 检查项描述
- 重要性等级（Level 1/Level 2）
- 评分说明（Scored/Not Scored）
- 检测方法
- 修复建议

```bash
# 使用CIS-CAT Pro进行自动基线扫描
# 下载CIS-CAT Pro
# https://workbench.cisecurity.org/

# 运行扫描
java -jar CIS-CAT.jar -assess -s /path/to/SSG-rhel7-xccdf.xml -p xccdf_org.ssgproject.content_profile_cis -r html

# 使用OpenSCAP对照CIS基线扫描（CentOS/RHEL）
# 安装SCAP安全指南
yum install scap-security-guide

# 列出可用的CIS配置文件
oscap info /usr/share/xml/scap/ssg/content/ssg-rhel7-ds.xml

# 执行CIS基线扫描
oscap xccdf eval --profile xccdf_org.ssgproject.content_profile_cis \
    --results /tmp/cis-scan-results.xml \
    --report /tmp/cis-scan-report.html \
    /usr/share/xml/scap/ssg/content/ssg-rhel7-ds.xml
```

### 1.5.2 安全基线实施流程

实施安全基线通常遵循以下流程：

**第一阶段：基线选择**。根据系统的用途、安全级别、合规要求选择合适的基线标准。例如，Web服务器可能需要遵循CIS Benchmark for Linux的特定配置文件。

**第二阶段：现状评估**。使用自动化工具或手工检查对照基线标准评估当前配置，记录所有不符合项。

**第三阶段：加固实施**。按照基线要求逐项进行配置修改。对于某些可能导致业务中断的配置，应先在测试环境验证。

**第四阶段：复核验证**。加固完成后再次执行评估，确认所有项目都已达标。

**第五阶段：持续监控**。建立定期检查机制，确保系统配置不会随时间推移而偏离基线。

```
# 安全基线检查表示表示例
检查项ID | 检查项描述 | 当前值 | 目标值 | 状态 | 修复措施
---------|------------|--------|--------|------|----------
1.1.1 | 设置bootloader密码 | 未设置 | 需要密码 | 不通过 | 运行 grub2-mkpasswd-pbkdf2 并配置
1.1.2 | 禁用Ctrl+Alt+Del重启 | 已禁用 | 禁用 | 通过 | -
1.2.1 | 验证安装源完整性 | 未知 | GPG验证启用 | 不通过 | 配置yum gpgcheck=1
1.3.1 | 启用SELinux | Permissive | Enforcing | 不通过 | setenforce 1 并修改配置文件
...
```

## 1.6 常见安全风险

### 1.6.1 操作系统层面的风险

Linux操作系统面临多种安全风险，了解这些风险是进行有效防护的前提。

**软件漏洞**：Linux系统上运行的软件可能存在安全漏洞，攻击者可能利用这些漏洞获得未授权访问或执行恶意代码。 Heartbleed、Shellshock、Dirty COW等漏洞都曾在Linux系统上造成广泛影响。

**配置错误**：不当的系统配置可能暴露安全风险。例如，开放不必要的端口、设置弱密码、使用默认配置、误配置文件权限等都可能被攻击者利用。

**内部威胁**：拥有系统访问权限的内部人员可能有意或无意地造成安全事件。恶意的内部人员可能滥用其权限，而疏忽大意的员工可能成为社会工程攻击的目标。

**供应链攻击**：攻击者可能在软件供应链的某个环节植入恶意代码，例如在开源库的更新中植入后门。这类攻击难以检测，可能影响大量系统。

### 1.6.2 网络层面的风险

**未授权访问**：攻击者通过猜测密码、利用漏洞或社会工程手段获得系统访问权限。

**中间人攻击**：攻击者拦截并可能篡改两方之间的通信。在未加密的网络上尤为威胁。

**拒绝服务攻击**：攻击者通过消耗系统资源使合法用户无法获得服务。

**端口扫描和指纹识别**：攻击者通过扫描开放端口和识别服务版本寻找攻击目标。

### 1.6.3 应用层面的风险

**Web应用漏洞**：SQL注入、跨站脚本（XSS）、文件包含等Web应用漏洞可能导致服务器被入侵。

**配置泄露**：配置文件或代码仓库意外发布到互联网可能暴露敏感信息。

**弱密码**：简单或重复使用的密码容易被暴力破解或字典攻击破解。

## 1.7 安全加固流程

### 1.7.1 加固前的准备工作

进行Linux系统安全加固之前，充分的准备工作是确保加固顺利进行的关键。

**备份当前配置**：在对系统进行任何安全加固之前，首先应该备份所有关键配置文件。这包括网络配置、用户账户数据库、服务配置等。备份应该存储在与生产系统物理隔离的媒体上。

```bash
# 备份关键配置文件
mkdir /root/system-backup-$(date +%Y%m%d)
cd /root/system-backup-$(date +%Y%m%d)

# 备份网络配置
cp /etc/hosts .
cp /etc/resolv.conf .
cp /etc/sysconfig/network-scripts/* .

# 备份用户和认证配置
cp /etc/passwd .
cp /etc/shadow .
cp /etc/group .
cp /etc/gshadow .
cp /etc/sudoers .
cp -r /etc/sudoers.d/ .

# 备份服务配置
cp -r /etc/ssh/sshd_config .
cp /etc/rsyslog.conf .
cp /etc/sysctl.conf .

# 备份防火墙规则
if command -v firewall-cmd &> /dev/null; then
    firewall-cmd --list-all > firewall-rules.txt
elif command -v ufw &> /dev/null; then
    ufw status verbose > firewall-rules.txt
fi

# 备份cron任务
cp -r /etc/cron.d .
cp -r /var/spool/cron .

# 创建备份压缩包
tar -czvf system-backup-$(date +%Y%m%d).tar.gz .
rm -rf /root/system-backup-$(date +%Y%m%d)
```

**建立测试环境**：在生产环境进行加固之前，应在测试环境中验证加固措施的效果和影响。测试环境应该与生产环境尽可能一致，包括相同的操作系统版本、应用程序和配置。

**制定加固计划**：根据安全基线和风险评估结果，制定详细的加固计划。计划应包括：需要加固的项目、每个项目的具体操作步骤、预期结果、验证方法、回滚方案等。

**通知相关方**：如果加固可能影响系统可用性或功能，应提前通知用户和相关部门，并安排在维护窗口进行操作。

### 1.7.2 加固执行步骤

Linux安全加固通常按照以下顺序执行：

**第一步：系统更新**。确保系统和所有软件包都是最新版本，修复所有已知的安全漏洞。

```bash
# Debian/Ubuntu系统
apt-get update
apt-get upgrade -y
apt-get dist-upgrade -y

# CentOS/RHEL系统
yum update -y
```

**第二步：用户和认证加固**。配置强密码策略、账户锁定策略，审核用户权限，禁用不必要的账户。

**第三步：服务加固**。禁用不必要的服务，配置必要服务的安全选项。

**第四步：网络加固**。配置防火墙，限制网络访问，调整内核网络参数。

**第五步：文件系统加固**。设置正确的文件权限，配置敏感文件保护，实施文件完整性监控。

**第六步：日志和审计加固**。配置日志记录，启用审计，确保日志完整性。

**第七步：安装和配置额外安全工具**。如fail2ban、AIDE等。

### 1.7.3 加固后验证

完成加固后，必须进行验证以确保加固措施已正确实施且未影响系统正常运行。

```bash
# 验证防火墙配置
iptables -L -n -v
# 或
firewall-cmd --list-all
# 或
ufw status verbose

# 验证SELinux状态
getenforce
sestatus

# 验证SSH配置
sshd -t

# 验证密码策略
grep -E 'PASS_MIN_LEN|PASS_MAX_DAYS' /etc/login.defs
cat /etc/security/pwquality.conf

# 验证系统文件权限
ls -la /etc/shadow
ls -la /etc/sudoers
stat /etc/passwd

# 验证服务状态
systemctl list-units --type=service --state=running

# 运行Lynis进行最终审计
lynis audit system
```

## 1.8 常见攻击类型

### 1.8.1 暴力破解攻击

暴力破解攻击（Brute Force Attack）是指攻击者通过系统地尝试所有可能的密码组合来猜测正确密码的攻击方式。虽然理论上暴力破解最终能够破解任何密码，但通过限制尝试次数、设置强密码策略等措施，可以使破解所需的时间变得不切实际。

**实战案例**：某公司Web服务器SSH服务遭受到暴力破解攻击。攻击者使用包含数千个常见用户名和密码组合的字典，对SSH服务进行持续攻击。通过查看系统日志，可以发现大量失败的登录尝试：

```
# 查看SSH暴力破解痕迹
grep "Failed password" /var/log/auth.log | head -50
# 输出示例：
# Jun 25 10:30:15 server sshd[12345]: Failed password for root from 192.168.1.100 port 12345 ssh2
# Jun 25 10:30:16 server sshd[12346]: Failed password for admin from 192.168.1.100 port 12346 ssh2
# Jun 25 10:30:17 server sshd[12347]: Failed password for test from 192.168.1.100 port 12347 ssh2

# 统计攻击尝试次数
grep "Failed password" /var/log/auth.log | wc -l

# 找出攻击最频繁的IP地址
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -nr | head -10
```

**防御措施**：使用fail2ban自动封禁多次失败的IP、禁用root直接登录、使用密钥认证而非密码认证、限制登录尝试次数、设置复杂的密码策略等。

```bash
# 配置fail2ban防止SSH暴力破解
# 安装fail2ban
apt-get install fail2ban  # Debian/Ubuntu
yum install fail2ban      # CentOS/RHEL

# 配置fail2ban
cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
# 忽略的IP，多个用空格分隔
ignoreip = 127.0.0.1/8 192.168.1.0/24
# 禁止时长（秒）
bantime = 3600
# 查找时长（秒）
findtime = 600
# 最大尝试次数
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 86400
EOF

# 启动fail2ban
systemctl enable fail2ban
systemctl start fail2ban

# 检查fail2ban状态
fail2ban-client status
fail2ban-client status sshd
```

### 1.8.2 权限提升攻击

权限提升（Privilege Escalation）是指攻击者利用系统漏洞或配置错误，从低权限账户获得更高权限（通常是root）的攻击过程。权限提升分为水平提升（从同一级别的其他用户获取权限）和垂直提升（从低权限提升到高权限）。

**常见方法**：

- **利用SUID程序漏洞**：如果SUID程序存在缓冲区溢出或其他漏洞，攻击者可能利用它获得rootshell。

- **利用sudo配置错误**：错误的sudo配置可能允许普通用户执行原本需要root权限的命令。

- **利用内核漏洞**：Linux内核漏洞（如Dirty COW）可能被用于提权。

- **利用服务漏洞**：以root运行的服务存在漏洞时，攻击者可能利用它进行提权。

```bash
# 检查可能用于提权的SUID程序
find / -perm -4000 -type f 2>/dev/null

# 检查sudo配置错误
sudo -l

# 检查可写的/etc/passwd或/etc/shadow
ls -la /etc/passwd
ls -la /etc/shadow

# 检查NFS导出（可能导致SYMLINK攻击）
cat /etc/exports

# 检查计划任务脚本是否可写
ls -la /etc/cron.d/
ls -la /etc/cron.daily/
```

**防御措施**：及时更新系统和内核、审查SUID程序、正确配置sudo权限、监控权限提升行为等。

### 1.8.3 拒绝服务攻击

拒绝服务攻击（Denial of Service, DoS）旨在使系统资源耗尽，导致合法用户无法获得服务。分布式拒绝服务攻击（DDoS）则利用多台受控主机同时发起攻击。

**常见类型**：

- **带宽耗尽攻击**：向目标发送大量流量，耗尽其网络带宽。
- **连接耗尽攻击**：建立大量半开连接，耗尽目标的连接资源。
- **资源消耗攻击**：消耗CPU、内存、磁盘等系统资源。
- **应用层攻击**：针对特定应用的漏洞发送精心构造的请求。

```bash
# 检查系统资源使用情况
top
htop
vmstat 1 5

# 检查网络连接状态
ss -s
netstat -an | awk '/^tcp/ {s[$NF]++} END {for(k in s) print k, s[k]}'

# 检查异常的流量模式
iftop -n
nethogs

# 查看当前的网络连接
ss -tn
netstat -tn
```

**防御措施**：配置防火墙限制连接速率、使用入侵检测系统监控异常流量、启用内核参数缓解SYN洪泛、保持系统资源充足等。

```bash
# 配置Linux内核参数缓解DoS攻击
cat >> /etc/sysctl.conf << EOF

# 缓解SYN Flood攻击
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_syn_retries = 1

# 限制IP碎片
net.ipv4.ipfrag_high_thresh = 262144
net.ipv4.ipfrag_low_thresh = 196608

# 限制ICMP速率
net.ipv4.icmp_ratelimit = 100

# 限制并发连接数
net.ipv4.ip_local_port_range = 10000 65535
EOF

sysctl -p
```

## 1.9 真实安全事件案例

### 1.9.1 案例一：数据库服务器被入侵

某中型互联网公司的MySQL数据库服务器遭到入侵。攻击者通过Web应用SQL注入漏洞获得初步访问权限，然后利用MySQL配置错误进行了进一步渗透。

**事件经过**：

1. 攻击者发现公司官网存在SQL注入漏洞，利用该漏洞获取了Web服务器的低权限shell。

2. Web服务器以www-data用户运行，权限有限。攻击者发现系统中运行着MySQL服务，且MySQL配置文件存在弱密码。

3. 攻击者连接MySQL数据库，通过MySQL的LOAD_FILE函数读取了系统敏感文件，包括/etc/shadow。

4. 攻击者破解了root账户的弱密码后，获得了服务器的完全控制权。

**根本原因**：

- Web应用存在SQL注入漏洞
- MySQL root账户使用弱密码
- 服务器之间存在密码复用
- 缺乏网络隔离和访问控制

**改进措施**：

```bash
# 1. 修复SQL注入漏洞（代码层面）
# 2. 设置强密码策略
# 3. 限制MySQL远程访问
# 编辑 /etc/mysql/mysql.conf.d/mysqld.cnf
bind-address = 127.0.0.1

# 4. 创建低权限数据库用户
mysql -u root -p
CREATE USER 'webapp'@'localhost' IDENTIFIED BY 'StrongP@ssw0rd!';
GRANT SELECT, INSERT, UPDATE, DELETE ON webapp_db.* TO 'webapp'@'localhost';
FLUSH PRIVILEGES;

# 5. 配置防火墙限制数据库端口访问
iptables -A INPUT -p tcp -s 192.168.1.0/24 --dport 3306 -j ACCEPT
iptables -A INPUT -p tcp --dport 3306 -j DROP
```

### 1.9.2 案例二：SSH密钥泄露导致服务器被控

某云计算公司的运维工程师将私钥上传到了公开的GitHub仓库，导致多台生产服务器被非法访问。

**事件经过**：

1. 工程师在本地开发环境配置了SSH密钥访问生产服务器，为了方便多台服务器间免密码登录，将私钥和SSH配置打包备份。

2. 工程师将包含私钥的备份目录误传到了公开的GitHub仓库。

3. 攻击者发现该仓库并下载了私钥，利用私钥远程访问了其中一台生产服务器。

4. 由于服务器之间配置了SSH信任关系，攻击者无需密码即可访问所有信任该密钥的服务器。

**根本原因**：

- 私钥未设置 passphrase
- 私钥被上传到公开仓库
- 服务器间存在不安全的SSH信任关系
- 缺乏密钥管理和审计

**改进措施**：

```bash
# 1. 为所有SSH私钥设置强密码
ssh-keygen -p -f ~/.ssh/id_rsa

# 2. 创建新的SSH密钥对
ssh-keygen -t ed25519 -a 100 -f ~/.ssh/prod_deploy

# 3. 在目标服务器上配置新的公钥
ssh-copy-id -i ~/.ssh/prod_deploy.pub user@server

# 4. 删除不安全的SSH信任关系（从authorized_keys中移除不安全的内容）
# 编辑 ~/.ssh/authorized_keys
# 移除任何包含密码或来源不明的条目

# 5. 在SSH配置中限制关键选项
# 编辑 /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
# 限制特定用户可以从特定IP登录
AllowUsers deploy@192.168.1.100

# 6. 启用SSH证书认证（更安全的方式）
# 创建SSH CA
ssh-keygen -s ca_key -I "production_ca" -V +52w -z 2 ~/.ssh/*.pub

# 7. 配置SSH代理使用密码保护的私钥
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/prod_deploy
```

### 1.9.3 案例三：挖矿木马入侵事件

某科技公司的多台Linux服务器被发现运行着加密货币挖矿程序，导致CPU资源被大量占用，业务系统性能严重下降。

**事件经过**：

1. 攻击者利用Redis未授权访问漏洞向服务器植入SSH公钥，获得了初步访问权限。

2. 攻击者下载并执行了挖矿木马，该木马伪装成系统进程运行。

3. 挖矿木马修改了系统的计划任务和SSH配置，尝试在内网中横向传播。

4. 安全团队在日常巡检中发现服务器CPU使用率异常偏高，进而发现挖矿程序。

**排查和清理过程**：

```bash
# 1. 查找高CPU占用进程
top -c
ps aux --sort=-%cpu | head -10

# 2. 查找可疑进程（通常挖矿木马会有异常的名字）
ps aux | grep -E 'kworker|khugepaged|xmrig|minerd|cryptonight' | grep -v grep

# 3. 查看进程的文件描述符
ls -la /proc/PID/fd/

# 4. 检查网络连接（挖矿需要连接矿池）
netstat -anp | grep ESTABLISHED | head -20
ss -tnp | grep ESTABLISHED

# 5. 检查计划任务中的恶意条目
crontab -l
cat /etc/crontab
ls -la /etc/cron.d/
cat /var/spool/cron/root

# 6. 检查SSH authorized_keys中的可疑公钥
cat ~/.ssh/authorized_keys

# 7. 查找最近被修改的系统文件
find /etc -name "*.sh" -mtime -7
ls -la /etc/cron.d/

# 8. 检查系统启动项
systemctl list-units --type=service --state=running
ls -la /etc/systemd/system/
```

**防御措施**：

```bash
# 1. 禁用Redis公网访问或设置强密码
# 编辑 /etc/redis/redis.conf
bind 127.0.0.1
requirepass StrongRedisP@ssw0rd!

# 2. 配置防火墙限制Redis访问
iptables -A INPUT -p tcp -s 192.168.1.0/24 --dport 6379 -j ACCEPT
iptables -A INPUT -p tcp --dport 6379 -j DROP

# 3. 禁用Redis的FLUSHALL等危险命令
# 编辑 /etc/redis/redis.conf
rename-command FLUSHALL ""
rename-command FLUSHDB ""
rename-command CONFIG ""

# 4. 安装配置aide监控文件变更
aide --init
echo "0 3 * * * root /usr/sbin/aide --check" >> /etc/crontab

# 5. 限制用户进程资源
# 编辑 /etc/security/limits.conf
* hard nproc 100
* soft nproc 50
```

## 1.10 小结

本章介绍了Linux系统安全的基础知识，为后续章节的深入学习奠定了基础。我们学习了Linux安全模型的基本原理，理解了用户与组、文件权限、进程特权等核心概念。最小权限原则、纵深防御原则和默认拒绝原则是指导安全加固的三大基本原则。

在安全加固实践中，选择合适的安全基线标准至关重要。CIS Benchmark提供了详细的安全配置指南，管理员可以根据系统用途选择相应的安全级别进行检查和加固。

常见的安全风险涵盖了操作系统、网络和应用等多个层面。暴力破解、权限提升和拒绝服务是三种最常见的攻击类型。了解这些攻击的原理和特征，有助于我们更好地设计和实施防护措施。

安全加固是一个系统性的工程，需要在加固前做好充分的准备工作，包括备份配置、建立测试环境、制定加固计划等。加固完成后必须进行验证，确保所有措施都已正确实施。

通过分析真实的安全事件案例，我们可以看到大多数安全事件的发生都可以追溯到基本安全措施的缺失：弱密码、未修补的漏洞、配置错误、缺乏监控等。这些案例提醒我们，安全无小事，必须从基础做起，持续不断地改进系统的安全状况。

## 1.11 思考题

1. 请解释最小权限原则在Linux系统中的具体应用场景，并举例说明如何在实际工作中落实该原则。

2. 纵深防御策略通常包含哪些层次？每个层次的主要防护措施是什么？

3. 如果你需要对新部署的Linux服务器进行安全加固，请列出你的加固步骤和检查清单。

4. 请分析暴力破解攻击和权限提升攻击的区别，以及针对这两种攻击分别应该采取哪些防御措施。

5. 在实际工作中，如果发现服务器可能已经被入侵，你应该按照怎样的流程进行处理？

6. 请对比SELinux和AppArmor两种MAC系统的特点，分析它们各自的优缺点。

7. 为什么SSH密钥认证比密码认证更安全？在配置SSH密钥认证时应该注意哪些安全事项？

8. 请解释/etc/shadow文件中密码字段的格式，并说明如何判断一个密码的强度。

9. 如果你发现系统中有未知的高CPU占用进程，你应该按照怎样的步骤进行排查？

10. 请分析挖矿木马通常通过哪些途径入侵Linux服务器，以及如何检测和防范这类恶意软件。