
## 4.16 auditd审计系统深度详解

### 4.16.1 auditd高级配置

auditd是Linux内核级审计系统的用户空间组件，负责将内核产生的审计记录写入磁盘。除了基本配置外，auditd还支持许多高级特性，包括远程审计、审计调度器（audispd）插件、以及与其他安全系统的集成。深入理解这些高级配置对于构建企业级审计体系至关重要。

audispd（审计调度器）是auditd的重要组件，负责将审计事件分发给其他应用程序。通过audispd插件，可以实现审计事件的实时处理、远程发送、告警通知等功能。常见的插件包括audisp-remote（远程审计）、audisp-prelude（与 Prelude IDS集成）、audisp-syslog（转发到syslog）等。

```bash
# /etc/audit/auditd.conf 高级配置详解
# 完整的生产环境配置示例

# 日志文件路径
log_file = /var/log/audit/audit.log

# 日志格式：RAW（原始）或 NOLOG（不写本地）
log_format = RAW

# 日志文件所属组
log_group = root

# 优先级提升值
priority_boost = 4

# 刷新方式：NONE、INCREMENTAL、DATA、SYNC
flush = INCREMENTAL_ASYNC

# 增量刷新频率（每多少条刷新一次）
freq = 50

# 保留的日志文件数量
num_logs = 10

# 调度器服务质量：lossy（可能丢失）或 lossless（不丢失）
disp_qos = lossless

# 审计调度器路径
dispatcher = /sbin/audispd

# 主机名格式：NONE、HOSTNAME、FQD、NUMERIC
name_format = HOSTNAME

# 自定义主机名（name_format = USER时使用）
# name = myserver

# 单个日志文件最大大小（MB）
max_log_file = 50

# 达到最大大小后的动作：IGNORE、SYSLOG、SUSPEND、ROTATE、KEEP_LOGS
max_log_file_action = ROTATE

# 剩余空间阈值（MB），低于此值触发space_left_action
space_left = 100

# 空间不足时的动作：IGNORE、SYSLOG、EMAIL、EXEC、SUSPEND、SINGLE、HALT
space_left_action = SYSLOG

# 告警邮件接收人
action_mail_acct = root

# 管理员空间阈值（MB），低于此值触发admin_space_left_action
admin_space_left = 50

# 管理员空间不足时的动作
admin_space_left_action = SUSPEND

# 磁盘满时的动作
disk_full_action = SUSPEND

# 磁盘错误时的动作
disk_error_action = SUSPEND

# 是否使用libwrap进行TCP包装访问控制
use_libwrap = yes

# TCP监听端口（0表示不监听，远程审计时设置）
tcp_listen_port = 0

# TCP连接队列大小
tcp_listen_queue = 5

# 每个地址的最大连接数
tcp_max_per_addr = 1

# 是否启用客户端ID验证
use_nice_io = yes

# 是否启用Kerberos 5认证
enable_krb5 = no

# Kerberos主体名
krb5_principal = auditd

# Kerberos keytab文件路径
# krb5_keytab = /etc/audit/audit.keytab

# 安全模式：设置为yes后，部分配置不能在运行时修改
secure_mode = no

# 验证SELinux上下文
validate_sids = yes

# 最大线程数
max_threads = 32

# 启用基于规则的引擎过滤
# enable_bpf = no
```

```bash
# audispd配置
# /etc/audisp/audispd.conf

# 审计调度器配置
q_depth = 256
overflow_action = SYSLOG
priority_boost = 4
max_restarts = 10
name_format = HOSTNAME
# name = myserver

# 插件配置目录
plugin_dir = /etc/audisp/plugins.d
```

```bash
# audispd插件配置示例

# 1. 远程审计插件
# /etc/audisp/plugins.d/au-remote.conf
active = yes
direction = out
path = /sbin/audisp-remote
type = builtin
args = 
format = managed

# 远程审计服务器配置
# /etc/audisp/audisp-remote.conf
remote_server = audit-server.example.com
port = 60
transport = tcp
queue_file = /var/spool/audit/remote.log
mode = immediate
queue_depth = 1024
format = managed
network_retry_time = 1
max_tries_per_record = 3
max_time_per_record = 5
heartbeat_timeout = 0
network_failure_action = syslog
disk_low_action = ignore
disk_full_action = suspend
disk_error_action = suspend
remote_ending_action = reconnect
generic_error_action = syslog
generic_warning_action = syslog
queue_error_action = syslog

# 2. Syslog转发插件
# /etc/audisp/plugins.d/syslog.conf
active = yes
direction = out
path = /sbin/audisp-syslog
type = builtin
args = LOG_INFO
format = string

# 3. Prelude IDS集成插件
# /etc/audisp/plugins.d/prelude.conf
active = no
direction = out
path = /usr/lib/x86_64-linux-gnu/audisp/prelude
type = always
format = string
```

```bash
# 启用远程审计接收（服务器端）
# /etc/audit/auditd.conf 中设置
tcp_listen_port = 60

# 配置防火墙
iptables -A INPUT -p tcp --dport 60 -s 10.0.0.0/8 -j ACCEPT

# 重启auditd
systemctl restart auditd

# 验证监听
ss -tlnp | grep 60
```

### 4.16.2 auditctl命令详解

auditctl是auditd的命令行控制工具，用于管理审计规则、查看审计状态、以及控制审计系统的行为。掌握auditctl的各种选项是进行有效审计配置的基础。auditctl可以动态添加、删除和查看审计规则，这些更改会立即生效，但重启后会丢失，除非保存到规则文件中。

auditctl的功能可以分为几大类：状态查询与控制、规则管理、文件系统监控、系统调用监控、以及用户/进程过滤。理解这些功能分类有助于快速定位需要的命令选项。

```bash
# auditctl命令详解

# ========== 1. 状态查询与控制 ==========

# 查看审计系统状态
auditctl -s
# 输出示例：
# enabled 1
# failure 1
# pid 1234
# rate_limit 0
# backlog_limit 8192
# lost 0
# backlog 0
# backlog_wait_time 0
# loginuid_immutable 0 unlocked

# 启用/禁用审计
auditctl -e 1    # 启用
auditctl -e 0    # 禁用
auditctl -e 2    # 锁定配置（之后不能再修改，直到重启）

# 设置失败模式（0=沉默, 1=打印kmsg, 2=panic）
auditctl -f 1

# 设置速率限制（每秒消息数，0表示无限制）
auditctl -r 0

# 设置积压队列限制
auditctl -b 8192

# 查看内核版本和审计子系统版本
auditctl -v

# ========== 2. 规则管理 ==========

# 查看当前所有规则
auditctl -l

# 查看规则（带行号）
auditctl -l -k

# 删除所有规则
auditctl -D

# 从文件加载规则
auditctl -R /etc/audit/rules.d/audit.rules

# ========== 3. 文件系统监控规则 ==========

# 语法：auditctl -w path -p permissions -k key_name
# 权限：r(读) w(写) x(执行) a(属性变更)

# 监控文件写入和属性变更
auditctl -w /etc/passwd -p wa -k passwd_change

# 监控文件读取
auditctl -w /etc/shadow -p r -k shadow_read

# 监控文件执行
auditctl -w /bin/su -p x -k su_execution

# 监控目录
auditctl -w /etc/sudoers.d/ -p wa -k sudoers_dir

# 移除监控
auditctl -W /etc/passwd -p wa -k passwd_change
# 或直接移除路径
auditctl -W /etc/passwd

# ========== 4. 系统调用监控规则 ==========

# 语法：auditctl -a action,filter -S syscall -F condition -k key
# action: always（总是记录）或 never（从不记录）
# filter: task、exit、user、exclude

# 监控特定系统调用
auditctl -a always,exit -S execve -k command_exec

# 监控多个系统调用
auditctl -a always,exit -S open,openat,creat -k file_open

# 按架构过滤
auditctl -a always,exit -F arch=b64 -S execve -k exec_64
auditctl -a always,exit -F arch=b32 -S execve -k exec_32

# 按用户ID过滤
auditctl -a always,exit -S execve -F uid=1000 -k user1000_cmds

# 按有效用户ID过滤
auditctl -a always,exit -S execve -F euid=0 -k root_cmds

# 按进程名过滤
auditctl -a always,exit -S all -F exe=/usr/bin/sshd -k sshd_activity

# 按路径过滤（文件操作）
auditctl -a always,exit -S openat -F path=/etc/shadow -k shadow_access

# 按成功/失败过滤
auditctl -a always,exit -S execve -F success=0 -k failed_exec
auditctl -a always,exit -S execve -F success=1 -k success_exec

# 组合多个过滤条件
auditctl -a always,exit -F arch=b64 -S execve -F euid=0 -F success=1 -k root_success_exec

# 删除系统调用规则
auditctl -d always,exit -S execve -k command_exec

# ========== 5. 用户身份过滤 ==========

# 监控特定用户的所有操作（通过loginuid）
auditctl -a always,user -F auid=1000 -k user_1000_all

# 排除特定用户的审计
auditctl -a never,user -F auid=0 -k exclude_root

# 监控登录UID范围
auditctl -a always,user -F "auid>=1000" -F "auid<=2000" -k normal_users

# ========== 6. 高级过滤选项 ==========

# 按进程ID过滤
auditctl -a always,exit -S all -F pid=1234 -k pid_1234

# 按会话ID过滤
auditctl -a always,user -F sessionid=10 -k session_10

# 按组ID过滤
auditctl -a always,exit -S execve -F gid=100 -k group100

# 按父进程ID过滤
auditctl -a always,exit -S execve -F ppid=1 -k init_children

# 按文件系统类型过滤
auditctl -a always,exit -S mount -F fstype=nfs -k nfs_mount

# ========== 7. 规则列表管理 ==========

# 列出所有规则（按类型）
auditctl -l

# 列出带有关键词的规则
auditctl -l -k

# 查看规则的详细信息
auditctl -s -l

# 保存当前规则到文件
auditctl -l > /etc/audit/rules.d/current-rules.rules
```

### 4.16.3 ausearch高级用法

ausearch是审计日志的查询工具，支持多种过滤条件和输出格式。高级用法包括复杂的时间范围查询、多条件组合过滤、自定义输出格式、以及与其他工具的管道协作。掌握ausearch的高级查询技巧可以极大提高日志分析效率。

ausearch支持丰富的过滤选项，可以按事件类型、系统调用、用户、进程、文件、关键词、时间范围等维度进行查询。多个过滤条件可以组合使用，实现精确的日志检索。

```bash
# ausearch高级用法详解

# ========== 1. 基本查询选项 ==========

# 按关键词（key）查询
ausearch -k passwd_change
ausearch -k sshd_config

# 按事件类型查询
ausearch -m USER_AUTH
ausearch -m EXECVE
ausearch -m PATH
ausearch -m SYSCALL

# 查看所有支持的事件类型
ausearch -m --help | head -50

# 常用事件类型：
# USER_START / USER_END - 用户会话开始/结束
# USER_AUTH - 用户认证
# USER_ACCT - 用户账户变更
# EXECVE - 程序执行
# PATH - 文件路径访问
# SYSCALL - 系统调用
# CONFIG_CHANGE - 审计配置变更
# ANOM_ABEND - 异常终止
# AVC - SELinux AVC消息
# NETWORK_SOCKET - 网络套接字操作

# ========== 2. 时间范围查询 ==========

# 按开始时间查询
ausearch -ts 06/25/2026 00:00:00

# 按结束时间查询
ausearch -te 06/25/2026 12:00:00

# 时间范围查询
ausearch -ts 06/24/2026 00:00:00 -te 06/25/2026 00:00:00

# 相对时间查询（最近10分钟）
ausearch -ts recent

# 今天的日志
ausearch -ts today

# 昨天的日志
ausearch -ts yesterday

# 本周的日志
ausearch -ts this-week

# 本月的日志
ausearch -ts this-month

# ========== 3. 用户相关查询 ==========

# 按登录UID查询
ausearch -ua 1000
ausearch -ua root

# 按有效UID查询
ausearch -e 0

# 按用户ID范围
ausearch -ua 1000-2000

# 排除特定用户
ausearch -ua root -i --success no

# ========== 4. 进程相关查询 ==========

# 按进程ID查询
ausearch -p 12345

# 按进程名查询
ausearch -c sshd
ausearch -c sudo
ausearch -c bash

# 按父进程ID查询
ausearch --ppid 1

# ========== 5. 文件相关查询 ==========

# 按文件名查询
ausearch -f /etc/passwd
ausearch -f /etc/shadow

# 按文件描述符查询
ausearch --fd 2

# ========== 6. 系统调用查询 ==========

# 按系统调用名查询
ausearch -sc execve
ausearch -sc open,openat

# 按系统调用号查询
ausearch -sc 59

# 成功/失败的系统调用
ausearch -sc execve -sv yes    # 成功
ausearch -sc execve -sv no     # 失败

# ========== 7. 网络相关查询 ==========

# 按主机名查询
ausearch -hn web01.example.com

# 按地址/端口查询
ausearch -sa 192.168.1.100
ausearch -sp 22
ausearch -da 192.168.1.1
ausearch -dp 80

# ========== 8. 输出格式控制 ==========

# 可读格式解释（UID转用户名等）
ausearch -i -k passwd_change

# 只解释用户/组
ausearch -ui -k passwd_change

# 原始格式
ausearch --raw

# CSV格式
ausearch -c sudo --csv

# 只显示唯一记录
ausearch -u -k shadow_change

# 只显示最后N条
ausearch -k login_failed | tail -n 100

# ========== 9. 高级组合查询示例 ==========

# 查询特定用户执行的所有命令
ausearch -ua 1000 -m EXECVE -i

# 查询root用户执行的所有命令（今天）
ausearch -ts today -e 0 -m EXECVE -i

# 查询所有失败的认证尝试
ausearch -m USER_AUTH -sv no -i

# 查询特定IP的SSH登录失败
ausearch -m USER_AUTH -sv no -sa 192.168.1.200 -i

# 查询对/etc目录的修改
ausearch -f /etc -sv yes -i

# 查询所有setuid程序执行
ausearch -m PATH -F mode=4755 -i

# 查询配置变更
ausearch -m CONFIG_CHANGE -i

# 查询所有异常终止的进程
ausearch -m ANOM_ABEND -i

# 查询特定时间范围内的sudo使用
ausearch -ts "06/24/2026 09:00:00" -te "06/24/2026 18:00:00" -c sudo -i

# ========== 10. 与其他工具结合 ==========

# 统计失败登录次数
ausearch -m USER_AUTH -sv no --raw | wc -l

# 找出失败登录最多的IP
ausearch -m USER_AUTH -sv no -i | grep "addr=" | awk '{print $NF}' | sort | uniq -c | sort -nr | head -10

# 统计每个用户执行的命令数
ausearch -m EXECVE -i | grep "auid=" | awk -F'auid=' '{print $2}' | awk '{print $1}' | sort | uniq -c | sort -nr

# 查看最近修改的文件
ausearch -m PATH -f /etc -i | head -50

# 实时监控审计日志（类似tail -f）
ausearch -f /etc/passwd -i --just-one
# 配合watch命令
watch -n 10 'ausearch -ts recent -k security_event -i | tail -20'
```

### 4.16.4 aureport高级报表

aureport用于从审计日志中生成各种汇总报告。除了基本的报告类型外，aureport还支持自定义报告、时间范围过滤、以及多种输出格式。高级报表功能可以帮助管理员快速了解系统的安全态势，识别异常行为模式。

aureport提供了十几种预定义的报告类型，涵盖认证、执行、文件、用户、终端、主机等各个维度。通过组合不同的选项，可以生成针对特定场景的定制化报告。

```bash
# aureport高级报表详解

# ========== 1. 概览报告 ==========

# 生成完整的概览报告
aureport

# 可读格式
aureport -i

# 生成摘要报告
aureport --summary

# ========== 2. 认证报告 ==========

# 认证事件报告
aureport -au

# 认证失败报告
aureport -au --failed

# 认证成功报告
aureport -au --success

# 认证摘要
aureport -au --summary

# ========== 3. 命令执行报告 ==========

# 执行命令报告
aureport -x

# 执行命令摘要
aureport -x --summary

# 失败的命令执行
aureport -x --failed

# ========== 4. 文件访问报告 ==========

# 文件访问报告
aureport -f

# 文件访问摘要
aureport -f --summary

# 失败的文件访问
aureport -f --failed

# ========== 5. 用户活动报告 ==========

# 用户报告
aureport -u

# 用户摘要
aureport -u --summary

# ========== 6. 终端登录报告 ==========

# 登录报告
aureport -l

# 失败的登录
aureport -l --failed

# 登录摘要
aureport -l --summary

# ========== 7. 进程报告 ==========

# 进程报告
aureport -p

# 进程摘要
aureport -p --summary

# ========== 8. 网络报告 ==========

# 网络套接字报告
aureport -n

# 网络摘要
aureport -n --summary

# ========== 9. 系统调用报告 ==========

# 系统调用报告
aureport -s

# 系统调用摘要
aureport -s --summary

# ========== 10. 密钥（规则标记）报告 ==========

# 按key统计的报告
aureport -k

# key摘要
aureport -k --summary

# ========== 11. 时间范围过滤 ==========

# 今天的报告
aureport -ts today -i

# 昨天的报告
aureport -ts yesterday -te today -i

# 特定日期范围
aureport -ts 06/01/2026 00:00:00 -te 06/25/2026 23:59:59 -i

# 最近的报告
aureport -ts recent -i

# ========== 12. 高级选项 ==========

# 基于开始事件号
aureport --start-event 1000

# 基于结束事件号
aureport --end-event 2000

# 指定日志文件
aureport -if /var/log/audit/audit.log.1

# 输入是原始格式
aureport --input-logs

# CSV格式输出
aureport -au --csv

# 解释UID/GID为名称
aureport -i -x

# 只显示前N条
aureport -x -n 20

# ========== 13. 自定义报告脚本示例 ==========

# 生成每日安全报告脚本
cat > /usr/local/bin/daily-audit-report.sh << 'EOF'
#!/bin/bash
# 每日审计安全报告

REPORT_FILE="/var/log/audit/daily-report-$(date +%Y%m%d).txt"
YESTERDAY=$(date -d "yesterday" +%m/%d/%Y)
TODAY=$(date +%m/%d/%Y)

echo "========================================" > $REPORT_FILE
echo "每日审计安全报告 - $(date)" >> $REPORT_FILE
echo "报告周期: $YESTERDAY 00:00:00 - $TODAY 00:00:00" >> $REPORT_FILE
echo "========================================" >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "【1. 系统概览】" >> $REPORT_FILE
aureport -ts $YESTERDAY -te $TODAY -i >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "【2. 认证统计】" >> $REPORT_FILE
aureport -ts $YESTERDAY -te $TODAY -au --summary -i >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "【3. 失败登录TOP10 IP】" >> $REPORT_FILE
ausearch -ts $YESTERDAY -te $TODAY -m USER_AUTH -sv no -i 2>/dev/null | \
    grep -oP 'addr=[\d.]+' | sort | uniq -c | sort -rn | head -10 >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "【4. 命令执行统计】" >> $REPORT_FILE
aureport -ts $YESTERDAY -te $TODAY -x --summary -i >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "【5. 文件修改统计】" >> $REPORT_FILE
aureport -ts $YESTERDAY -te $TODAY -f --summary -i | head -20 >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "【6. 用户活动统计】" >> $REPORT_FILE
aureport -ts $YESTERDAY -te $TODAY -u --summary -i >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "【7. 关键安全事件】" >> $REPORT_FILE
echo "--- sudo使用 ---" >> $REPORT_FILE
ausearch -ts $YESTERDAY -te $TODAY -c sudo -i 2>/dev/null | head -30 >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "--- 配置文件修改 ---" >> $REPORT_FILE
ausearch -ts $YESTERDAY -te $TODAY -k passwd_change -i 2>/dev/null >> $REPORT_FILE
ausearch -ts $YESTERDAY -te $TODAY -k sshd_config -i 2>/dev/null >> $REPORT_FILE
echo "" >> $REPORT_FILE

echo "========================================" >> $REPORT_FILE
echo "报告生成完毕" >> $REPORT_FILE

# 发送邮件（可选）
# mail -s "每日审计报告 - $(hostname)" admin@example.com < $REPORT_FILE

echo "报告已生成: $REPORT_FILE"
EOF

chmod +x /usr/local/bin/daily-audit-report.sh

# 添加到crontab每天凌晨1点执行
# 0 1 * * * root /usr/local/bin/daily-audit-report.sh
```

### 4.16.5 审计规则编写高级示例

编写高质量的审计规则是发挥auditd价值的关键。好的审计规则应该覆盖关键安全事件、同时控制日志量避免信息过载。规则编写需要在监控全面性和系统性能之间取得平衡。以下提供多种场景下的高级审计规则示例，包括合规导向、入侵检测、以及异常行为监控等。

合规导向的审计规则通常需要满足特定的安全标准要求，如PCI-DSS、HIPAA、SOX等。这些标准通常要求对认证事件、特权用户操作、敏感数据访问、配置变更等进行详细审计。

```bash
# /etc/audit/rules.d/99-advanced.rules
# 高级审计规则集合

# ========== 1. 基础控制规则 ==========
-D
-b 8192
-f 1
--backlog_wait_time 60000

# ========== 2. 身份与访问管理审计 ==========

# 密码和账户文件变更
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/group -p wa -k identity
-w /etc/gshadow -p wa -k identity
-w /etc/security/opasswd -p wa -k identity

# sudo配置
-w /etc/sudoers -p wa -k sudo_config
-w /etc/sudoers.d/ -p wa -k sudo_config

# 登录配置
-w /etc/login.defs -p wa -k login_config
-w /etc/securetty -p wa -k login_config
-w /etc/security/ -p wa -k pam_config
-w /etc/pam.d/ -p wa -k pam_config

# SSH配置
-w /etc/ssh/sshd_config -p wa -k sshd_config

# 用户/组操作命令审计
-a always,exit -F arch=b64 -S execve -F path=/usr/sbin/useradd -k user_mgmt
-a always,exit -F arch=b64 -S execve -F path=/usr/sbin/userdel -k user_mgmt
-a always,exit -F arch=b64 -S execve -F path=/usr/sbin/usermod -k user_mgmt
-a always,exit -F arch=b64 -S execve -F path=/usr/sbin/groupadd -k user_mgmt
-a always,exit -F arch=b64 -S execve -F path=/usr/sbin/groupdel -k user_mgmt
-a always,exit -F arch=b64 -S execve -F path=/usr/sbin/groupmod -k user_mgmt
-a always,exit -F arch=b64 -S execve -F path=/usr/bin/passwd -k passwd_change

# ========== 3. 特权操作审计 ==========

# root用户执行的所有命令
-a always,exit -F arch=b64 -S execve -F euid=0 -k root_exec
-a always,exit -F arch=b32 -S execve -F euid=0 -k root_exec

# setuid/setgid程序执行
-a always,exit -F arch=b64 -S execve -F mode=4755 -k setuid_exec
-a always,exit -F arch=b64 -S execve -F mode=6755 -k setuid_exec

# sudo相关系统调用
-a always,exit -F arch=b64 -S execve -F exe=/usr/bin/sudo -k sudo_command
-a always,exit -F arch=b64 -S execve -F exe=/usr/bin/su -k su_command

# ========== 4. 文件系统完整性审计 ==========

# 系统二进制文件
-w /bin/ -p rx -k system_bin
-w /sbin/ -p rx -k system_bin
-w /usr/bin/ -p rx -k system_bin
-w /usr/sbin/ -p rx -k system_bin
-w /usr/local/bin/ -p rx -k local_bin
-w /usr/local/sbin/ -p rx -k local_bin

# 重要配置目录
-w /etc/ -p wa -k etc_changes

# 库文件
-w /lib/ -p w -k lib_change
-w /lib64/ -p w -k lib_change
-w /usr/lib/ -p w -k lib_change
-w /usr/lib64/ -p w -k lib_change

# 内核模块
-w /sbin/insmod -p x -k kernel_module
-w /sbin/modprobe -p x -k kernel_module
-w /sbin/rmmod -p x -k kernel_module
-w /etc/modules-load.d/ -p wa -k kernel_module_config

# ========== 5. 网络活动审计 ==========

# 网络套接字创建
-a always,exit -F arch=b64 -S socket -k network_socket
-a always,exit -F arch=b64 -S connect -k network_connect
-a always,exit -F arch=b64 -S accept -k network_accept
-a always,exit -F arch=b64 -S bind -k network_bind
-a always,exit -F arch=b64 -S listen -k network_listen

# 网络配置变更
-w /etc/hostname -p wa -k network_config
-w /etc/hosts -p wa -k network_config
-w /etc/resolv.conf -p wa -k network_config
-w /etc/sysconfig/network-scripts/ -p wa -k network_config
-w /etc/netplan/ -p wa -k network_config

# 防火墙配置
-w /etc/iptables/ -p wa -k firewall_config
-w /etc/nftables.conf -p wa -k firewall_config

# ========== 6. 进程与系统管理审计 ==========

# 挂载操作
-a always,exit -F arch=b64 -S mount -k mount_operation
-a always,exit -F arch=b64 -S umount2 -k mount_operation

# 系统时间变更
-a always,exit -F arch=b64 -S adjtimex -k time_change
-a always,exit -F arch=b64 -S settimeofday -k time_change
-a always,exit -F arch=b64 -S clock_settime -k time_change
-w /etc/localtime -p wa -k timezone_change

# 系统关机/重启
-a always,exit -F arch=b64 -S execve -F path=/sbin/shutdown -k system_shutdown
-a always,exit -F arch=b64 -S execve -F path=/sbin/reboot -k system_reboot
-a always,exit -F arch=b64 -S execve -F path=/sbin/halt -k system_halt

# 内核参数
-w /etc/sysctl.conf -p wa -k sysctl_config
-w /etc/sysctl.d/ -p wa -k sysctl_config

# ========== 7. Cron与定时任务审计 ==========

-w /etc/crontab -p wa -k cron_config
-w /etc/cron.d/ -p wa -k cron_config
-w /etc/cron.daily/ -p wa -k cron_config
-w /etc/cron.hourly/ -p wa -k cron_config
-w /etc/cron.weekly/ -p wa -k cron_config
-w /etc/cron.monthly/ -p wa -k cron_config
-w /var/spool/cron/ -p wa -k user_cron

# ========== 8. 日志与审计自保护 ==========

# 审计日志文件
-w /var/log/audit/ -p wa -k audit_log_access

# 审计配置
-w /etc/audit/ -p wa -k audit_config

# syslog配置
-w /etc/rsyslog.conf -p wa -k syslog_config
-w /etc/rsyslog.d/ -p wa -k syslog_config
-w /etc/syslog-ng/ -p wa -k syslog_config

# 日志文件目录
-w /var/log/ -p w -k log_modification

# ========== 9. Web应用安全审计 ==========

# Web根目录（防止webshell写入）
-w /var/www/html/ -p w -k webroot_write
-w /var/www/ -p w -k webroot_write

# 上传目录重点监控
-w /var/www/html/uploads/ -p wxa -k upload_dir

# Nginx/Apache配置
-w /etc/nginx/ -p wa -k nginx_config
-w /etc/apache2/ -p wa -k apache_config
-w /etc/httpd/ -p wa -k httpd_config

# ========== 10. 数据库审计 ==========

# MySQL配置
-w /etc/mysql/ -p wa -k mysql_config
-w /etc/my.cnf -p wa -k mysql_config

# PostgreSQL配置
-w /etc/postgresql/ -p wa -k pgsql_config

# ========== 11. 入侵检测相关规则 ==========

# 敏感目录写入（潜在的后门植入）
-w /tmp/ -p wxa -k tmp_activity
-w /var/tmp/ -p wxa -k tmp_activity
-w /dev/shm/ -p wxa -k shm_activity

# 隐藏文件创建（监控.开头的文件）
# 注意：这个规则量可能很大，建议只监控关键目录
-a always,exit -F arch=b64 -S creat -S open -S openat -F dir=/tmp -F name=^\\. -k hidden_file

# rootkit常见路径
-w /etc/ld.so.preload -p wa -k ld_preload
-w /etc/ld.so.conf.d/ -p wa -k ld_config

# ========== 12. 排除规则（减少噪音）==========

# 排除某些高频但低风险的操作
-a never,exit -F arch=b64 -S openat -F path=/proc
-a never,exit -F arch=b64 -S openat -F path=/sys
-a never,exit -F arch=b64 -S read

# 排除auditd自身的日志写入
-a never,exit -F arch=b64 -S write -F exe=/sbin/auditd

# 排除某些系统进程
-a never,user -F auid=4294967295  # 未设置loginuid的内核线程
```

## 4.17 日志分析实战

### 4.17.1 grep/awk/sed高级用法

日志分析是Linux安全运营的核心技能之一。grep、awk、sed是日志分析的"三剑客"，掌握它们的高级用法可以极大提高日志处理效率。grep擅长文本搜索过滤，awk擅长结构化数据处理，sed擅长文本转换编辑。三者结合使用，可以处理绝大多数日志分析场景。

grep的高级用法包括多模式匹配、反向匹配、上下文显示、递归搜索、正则表达式等。配合Shell管道，可以实现复杂的日志统计和筛选。awk则更像一门编程语言，支持变量、条件判断、循环、数组等，可以对日志进行字段级别的精细处理。sed是流编辑器，擅长批量替换、删除、插入等文本转换操作。

```bash
# ========== grep高级用法 ==========

# 1. 多模式匹配
# 同时匹配多个关键词（或关系）
grep -E "Failed|Invalid|error" /var/log/auth.log

# 同时匹配多个模式（并且关系，使用管道）
grep "sshd" /var/log/auth.log | grep "Failed"
grep "sshd.*Failed" /var/log/auth.log

# 从文件读取模式
cat > patterns.txt << 'EOF'
Failed password
Invalid user
EOF
grep -f patterns.txt /var/log/auth.log

# 2. 反向匹配（排除）
# 排除包含特定关键词的行
grep -v "debug" /var/log/syslog
grep -vE "(debug|info)" /var/log/syslog

# 3. 显示上下文
# 显示匹配行的前后几行
grep -C 5 "error" /var/log/syslog     # 前后各5行
grep -B 5 "error" /var/log/syslog     # 前5行
grep -A 5 "error" /var/log/syslog     # 后5行

# 4. 递归搜索目录
grep -r "password" /var/log/
grep -R "password" /var/log/          # 跟随符号链接
grep -rl "192.168.1.100" /var/log/    # 只列出文件名

# 5. 只显示匹配的部分
grep -o "from [0-9.]*" /var/log/auth.log
grep -oP '\d+\.\d+\.\d+\.\d+' /var/log/auth.log  # Perl正则

# 6. 计数
grep -c "Failed" /var/log/auth.log
grep -c "Accepted" /var/log/auth.log

# 7. 高亮显示
grep --color=auto "Failed" /var/log/auth.log

# 8. 忽略大小写
grep -i "error" /var/log/syslog

# 9. 行号
grep -n "error" /var/log/syslog

# 10. 只显示匹配的文件名
grep -l "error" /var/log/*.log

# ========== awk高级用法 ==========

# 1. 字段处理（默认按空格分割）
# 打印第1和第5个字段
awk '{print $1, $5}' /var/log/auth.log

# 指定分隔符
awk -F: '{print $1, $3}' /etc/passwd
awk -F'[ :]' '{print $1, $5}' /var/log/auth.log  # 多分隔符

# 2. 条件过滤
# 打印第9字段为"Failed"的行
awk '$9 == "Failed"' /var/log/auth.log

# 数值比较
awk '$5 > 100' access.log

# 模式匹配
awk '/Failed password/ {print $1, $2, $3, $11}' /var/log/auth.log

# 3. 变量与计算
# 统计总响应时间
awk '{sum += $NF} END {print "Total:", sum, "Average:", sum/NR}' access.log

# 计算平均值
awk '{total += $10; count++} END {print "Average response:", total/count}' access.log

# 4. 数组与统计
# 统计每个IP的访问次数
awk '{count[$1]++} END {for (ip in count) print count[ip], ip}' access.log | sort -nr

# 统计每个用户的登录次数
awk '/Accepted/ {count[$11]++} END {for (user in count) print count[user], user}' /var/log/auth.log | sort -nr

# 统计HTTP状态码分布
awk '{status[$9]++} END {for (s in status) print s, status[s]}' access.log | sort

# 5. 字符串处理
# 提取IP地址
awk '{match($0, /[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/, arr); print arr[0]}' /var/log/auth.log

# 子串
awk '{print substr($0, 1, 50)}' /var/log/syslog

# 字符串长度
awk 'length($0) > 200' /var/log/syslog

# 6.  BEGIN/END块
awk 'BEGIN {print "IP\t\tCount"} {count[$1]++} END {for (ip in count) print ip "\t" count[ip]}' access.log

# 7. 多文件处理
awk 'FNR==NR {ip[$1]=1; next} $1 in ip' whitelist.txt access.log

# 8. 格式化输出
awk '{printf "%-20s %5d %s\n", $1, $10, $7}' access.log

# ========== sed高级用法 ==========

# 1. 文本替换
# 全局替换
sed 's/error/ERROR/g' /var/log/syslog

# 只替换每行第一个匹配
sed 's/error/ERROR/' /var/log/syslog

# 替换指定行范围
sed '1,100s/error/ERROR/g' /var/log/syslog

# 使用不同的分隔符（避免和/冲突）
sed 's|/var/log/|/log/|g' file.txt

# 2. 删除行
# 删除匹配的行
sed '/debug/d' /var/log/syslog

# 删除空行
sed '/^$/d' /var/log/syslog

# 删除空白行（包括空格）
sed '/^\s*$/d' /var/log/syslog

# 删除首行
sed '1d' file.txt

# 删除最后一行
sed '$d' file.txt

# 删除前10行
sed '1,10d' file.txt

# 3. 插入和追加
# 在匹配行前插入
sed '/error/i\===== ERROR =====' /var/log/syslog

# 在匹配行后追加
sed '/error/a\-----' /var/log/syslog

# 4. 提取行
# 提取指定行范围
sed -n '100,200p' /var/log/syslog

# 提取匹配的行（类似grep）
sed -n '/error/p' /var/log/syslog

# 从匹配行到文件末尾
sed -n '/error/,$p' /var/log/syslog

# 5. 转换大小写
sed 's/[a-z]/\U&/g' file.txt    # 转大写
sed 's/[A-Z]/\L&/g' file.txt    # 转小写

# 6. 反向引用
# 提取IP和日期
sed -n 's/\([0-9.]*\) - - \[\([^]]*\)\].*/\1 \2/p' access.log

# 7. 多次编辑
sed -e 's/error/ERROR/g' -e 's/warning/WARNING/g' file.txt

# ========== 三剑客组合实战 ==========

# 1. 统计访问量最高的TOP10 URL
awk '{print $7}' access.log | sort | uniq -c | sort -rn | head -10

# 2. 统计每个IP的404错误次数
grep " 404 " access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -20

# 3. 分析SSH暴力破解来源TOP10
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head -10

# 4. 提取今天的错误日志
grep "^$(date '+%b %e')" /var/log/syslog | grep -i error

# 5. 统计每小时访问量
awk '{print substr($4, 2, 13)}' access.log | sort | uniq -c

# 6. 找出访问超过100次的IP（可能是攻击）
awk '{count[$1]++} END {for (ip in count) if (count[ip] > 100) print count[ip], ip}' access.log | sort -rn

# 7. 日志格式转换（Nginx访问日志转CSV）
awk '{print $1 "," $4 "," $7 "," $9 "," $10}' access.log > access.csv

# 8. 计算平均响应时间
grep " 200 " access.log | awk '{sum += $NF; count++} END {print sum/count}'

# 9. 找出慢速请求（响应时间>5秒）
awk '$NF > 5000' access.log | tail -20

# 10. 监控实时日志并高亮错误
tail -f /var/log/syslog | sed 's/error/\\o033[31merror\\o033[0m/gI'
```

### 4.17.2 日志分析shell脚本示例

Shell脚本是日志分析自动化的重要工具，可以将重复性的分析工作脚本化，提高效率并保证一致性。好的日志分析脚本应该具备参数化输入、清晰的输出格式、错误处理、以及可扩展性等特点。以下提供几个实用的日志分析脚本示例，涵盖安全审计、性能分析、异常检测等场景。

编写日志分析脚本时需要注意几个要点：正确处理日志轮转文件、处理大文件时的内存效率、时间范围的正确解析、以及结果的可读性呈现。使用函数封装可以提高脚本的可维护性。

```bash
#!/bin/bash
# filename: security-log-analyzer.sh
# 安全日志综合分析脚本
# 功能：分析认证日志、检测暴力破解、异常登录等

# 配置
AUTH_LOG="/var/log/auth.log"
SECURE_LOG="/var/log/secure"
OUTPUT_DIR="/var/log/security-reports"
REPORT_FILE="$OUTPUT_DIR/security-report-$(date +%Y%m%d-%H%M%S).txt"

# 阈值配置
FAILED_THRESHOLD=10        # 单IP失败登录阈值
OFF_HOUR_START=22          # 非工作时间开始
OFF_HOUR_END=6             # 非工作时间结束

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 确保输出目录存在
mkdir -p "$OUTPUT_DIR"

# 检测日志文件位置
if [ -f "$AUTH_LOG" ]; then
    LOG_FILE="$AUTH_LOG"
elif [ -f "$SECURE_LOG" ]; then
    LOG_FILE="$SECURE_LOG"
else
    echo "错误：找不到认证日志文件"
    exit 1
fi

# ========== 函数定义 ==========

print_header() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}========================================${NC}"
}

print_section() {
    echo ""
    echo -e "${YELLOW}【$1】${NC}"
    echo "----------------------------------------"
}

# 统计总登录情况
stat_login_summary() {
    print_section "登录统计总览"
    
    total_success=$(grep -c "Accepted" "$LOG_FILE")
    total_failed=$(grep -c "Failed password" "$LOG_FILE")
    total_invalid=$(grep -c "Invalid user" "$LOG_FILE")
    
    echo "成功登录次数: $total_success"
    echo "失败登录次数: $total_failed"
    echo "无效用户尝试: $total_invalid"
    
    if [ "$total_failed" -gt 0 ]; then
        failure_rate=$(echo "scale=2; $total_failed * 100 / ($total_success + $total_failed)" | bc)
        echo "失败率: ${failure_rate}%"
    fi
}

# TOP10 失败登录IP
top_failed_ips() {
    print_section "失败登录TOP10 IP"
    
    grep "Failed password" "$LOG_FILE" | \
        awk '{print $(NF-3)}' | \
        sort | uniq -c | sort -rn | head -10 | \
        awk '{printf "%-5s %-15s %s\n", $1, $2, "次失败尝试"}'
}

# TOP10 被攻击用户名
top_attacked_users() {
    print_section "被攻击TOP10用户名"
    
    grep "Failed password" "$LOG_FILE" | \
        awk '{print $9}' | \
        sort | uniq -c | sort -rn | head -10
}

# 检测暴力破解IP
detect_brute_force() {
    print_section "暴力破解检测（超过${FAILED_THRESHOLD}次失败）"
    
    local suspects=$(grep "Failed password" "$LOG_FILE" | \
        awk '{print $(NF-3)}' | \
        sort | uniq -c | sort -rn | \
        awk -v threshold="$FAILED_THRESHOLD" '$1 > threshold {print $2, $1}')
    
    if [ -z "$suspects" ]; then
        echo "未检测到超过阈值的暴力破解尝试"
    else
        echo -e "${RED}检测到以下IP可能正在进行暴力破解：${NC}"
        echo "$suspects" | while read ip count; do
            echo "  IP: $ip, 失败次数: $count"
            
            # 检查是否有成功登录（可能已被破解）
            local success=$(grep "Accepted.*$ip" "$LOG_FILE" | wc -l)
            if [ "$success" -gt 0 ]; then
                echo -e "  ${RED}警告：该IP有 $success 次成功登录！${NC}"
            fi
        done
    fi
}

# 非工作时间登录检测
off_hours_login() {
    print_section "非工作时间登录检测（${OFF_HOUR_START}:00 - ${OFF_HOUR_END}:00）"
    
    local off_hour_logins=0
    
    grep "Accepted" "$LOG_FILE" | while read line; do
        hour=$(echo "$line" | awk '{print $3}' | cut -d: -f1)
        if [ "$hour" -ge "$OFF_HOUR_START" ] || [ "$hour" -lt "$OFF_HOUR_END" ]; then
            echo "$line"
            ((off_hour_logins++))
        fi
    done
    
    echo ""
    echo "非工作时间登录总数: $off_hour_logins"
}

# sudo使用统计
sudo_usage() {
    print_section "Sudo使用统计"
    
    local total_sudo=$(grep -c "sudo:" "$LOG_FILE")
    echo "总sudo调用次数: $total_sudo"
    
    echo ""
    echo "TOP10 sudo用户:"
    grep "sudo:" "$LOG_FILE" | \
        grep "COMMAND=" | \
        awk '{print $4}' | \
        sort | uniq -c | sort -rn | head -10
    
    echo ""
    echo "最近20条sudo命令:"
    grep "sudo:" "$LOG_FILE" | \
        grep "COMMAND=" | \
        tail -20
}

# 新用户/组变更
account_changes() {
    print_section "账户变更记录"
    
    local useradds=$(grep -c "useradd" "$LOG_FILE")
    local userdels=$(grep -c "userdel" "$LOG_FILE")
    local usermods=$(grep -c "usermod" "$LOG_FILE")
    
    echo "新建用户: $useradds 次"
    echo "删除用户: $userdels 次"
    echo "修改用户: $usermods 次"
    
    if [ "$useradds" -gt 0 ] || [ "$userdels" -gt 0 ]; then
        echo ""
        echo "详细记录:"
        grep -E "useradd|userdel|usermod" "$LOG_FILE" | tail -20
    fi
}

# 生成完整报告
generate_report() {
    print_header "安全日志分析报告"
    echo "分析时间: $(date)"
    echo "日志文件: $LOG_FILE"
    echo "日志大小: $(du -h "$LOG_FILE" | cut -f1)"
    
    stat_login_summary
    top_failed_ips
    top_attacked_users
    detect_brute_force
    off_hours_login
    sudo_usage
    account_changes
    
    echo ""
    print_header "报告结束"
}

# ========== 主程序 ==========

case "${1:-report}" in
    report)
        generate_report | tee "$REPORT_FILE"
        echo ""
        echo "报告已保存到: $REPORT_FILE"
        ;;
    brute)
        detect_brute_force
        ;;
    sudo)
        sudo_usage
        ;;
    failed)
        top_failed_ips
        ;;
    summary)
        stat_login_summary
        ;;
    *)
        echo "用法: $0 [report|brute|sudo|failed|summary]"
        echo "  report  - 生成完整报告（默认）"
        echo "  brute   - 暴力破解检测"
        echo "  sudo    - sudo使用统计"
        echo "  failed  - 失败登录TOP10"
        echo "  summary - 登录统计概览"
        exit 1
        ;;
esac
```

```bash
#!/bin/bash
# filename: web-log-analyzer.sh
# Web服务器访问日志分析脚本

LOG_FILE="$1"
TOP_N=20

if [ -z "$LOG_FILE" ] || [ ! -f "$LOG_FILE" ]; then
    echo "用法: $0 <access_log_file>"
    echo "示例: $0 /var/log/nginx/access.log"
    exit 1
fi

echo "========================================"
echo "Web访问日志分析报告"
echo "日志文件: $LOG_FILE"
echo "分析时间: $(date)"
echo "========================================"

# 基本统计
total_requests=$(wc -l < "$LOG_FILE")
echo ""
echo "【基本统计】"
echo "总请求数: $total_requests"

# 唯一IP数
unique_ips=$(awk '{print $1}' "$LOG_FILE" | sort -u | wc -l)
echo "唯一IP数: $unique_ips"

# 唯一URL数
unique_urls=$(awk '{print $7}' "$LOG_FILE" | sort -u | wc -l)
echo "唯一URL数: $unique_urls"

# 流量统计
total_bytes=$(awk '{sum += $10} END {print sum}' "$LOG_FILE")
total_mb=$(echo "scale=2; $total_bytes / 1024 / 1024" | bc)
echo "总流量: ${total_mb} MB"

# HTTP状态码分布
echo ""
echo "【HTTP状态码分布】"
awk '{status[$9]++} END {
    for (s in status) {
        printf "%s: %d (%.2f%%)\n", s, status[s], status[s]/NR*100
    }
}' "$LOG_FILE" | sort

# TOP访问IP
echo ""
echo "【TOP${TOP_N}访问IP】"
awk '{count[$1]++} END {
    for (ip in count) print count[ip], ip
}' "$LOG_FILE" | sort -rn | head -$TOP_N | \
    awk '{printf "%-6s %-15s %s\n", $1, $2, "次请求"}'

# TOP访问URL
echo ""
echo "【TOP${TOP_N}访问URL】"
awk '{count[$7]++} END {
    for (url in count) print count[url], url
}' "$LOG_FILE" | sort -rn | head -$TOP_N

# 404错误TOP页面
echo ""
echo "【TOP${TOP_N} 404页面】"
awk '$9 == 404 {count[$7]++} END {
    for (url in count) print count[url], url
}' "$LOG_FILE" | sort -rn | head -$TOP_N

# 请求方法分布
echo ""
echo "【请求方法分布】"
awk '{method[$6]++} END {
    for (m in method) printf "%s: %d\n", m, method[m]
}' "$LOG_FILE" | sort

# 按小时统计访问量
echo ""
echo "【每小时访问量】"
awk '{
    hour = substr($4, 14, 2)
    count[hour]++
} END {
    for (h in count) printf "%s:00 - %d 次\n", h, count[h]
}' "$LOG_FILE" | sort

# 慢速请求（如果日志包含响应时间）
echo ""
echo "【TOP${TOP_N} 最慢请求】"
# 假设响应时间在最后一列
if [ $(awk 'NR==1 {print NF}' "$LOG_FILE") -ge 10 ]; then
    sort -k10 -rn "$LOG_FILE" | head -$TOP_N | \
        awk '{printf "%8dms %s %s\n", $NF, $6, $7}'
fi

echo ""
echo "========================================"
echo "分析完成"
```

### 4.17.3 常用分析场景

日志分析的场景非常广泛，从日常的系统监控到安全事件响应，再到合规审计，都需要用到日志分析技能。以下是几个常见的安全分析场景，包括SSH暴力破解检测、Web攻击检测、异常行为识别等。掌握这些常用场景的分析方法，可以快速应对大部分安全事件。

每个分析场景都有其特定的日志特征和分析方法。关键在于理解攻击的行为特征，然后在日志中寻找对应的痕迹。例如，暴力破解的特征是短时间内大量失败登录，SQL注入的特征是URL中包含SQL关键字，webshell的特征是可疑的文件上传和异常的PHP执行路径。

```bash
# ========== 场景1: SSH暴力破解检测 ==========

# 1.1 查看失败登录总数
grep -c "Failed password" /var/log/auth.log

# 1.2 找出攻击来源TOP10
grep "Failed password" /var/log/auth.log | \
    awk '{print $(NF-3)}' | \
    sort | uniq -c | sort -rn | head -10

# 1.3 查看针对特定用户的攻击
grep "Failed password for root" /var/log/auth.log | wc -l
grep "Failed password for admin" /var/log/auth.log | wc -l

# 1.4 检测用户名枚举（Invalid user）
grep "Invalid user" /var/log/auth.log | \
    awk '{print $8}' | sort | uniq -c | sort -rn | head -20

# 1.5 检查是否有IP成功登录（可能已破解）
for ip in $(grep "Failed password" /var/log/auth.log | \
    awk '{print $(NF-3)}' | sort -u); do
    success=$(grep "Accepted.*$ip" /var/log/auth.log | wc -l)
    if [ "$success" -gt 0 ]; then
        echo "警告: $ip 有 $success 次成功登录!"
    fi
done

# 1.6 按时间统计失败登录（检测攻击时间模式）
grep "Failed password" /var/log/auth.log | \
    awk '{print $3}' | cut -d: -f1 | \
    sort | uniq -c | sort -k2 -n

# ========== 场景2: Web攻击检测 ==========

# 2.1 SQL注入检测
grep -iE "(union.*select|select.*from|insert.*into|drop.*table|update.*set|delete.*from|or 1=1|' or '|--)" \
    /var/log/nginx/access.log | head -20

# 2.2 XSS攻击检测
grep -iE "(<script|javascript:|onerror=|onload=|alert\()" \
    /var/log/nginx/access.log | head -20

# 2.3 目录遍历检测
grep -E "(\.\./|\.\.\\\\|%2e%2e%2f|%2e%2e/" \
    /var/log/nginx/access.log | head -20

# 2.4 命令注入检测
grep -iE "(;.*ls|;.*cat|;.*whoami|\|.*id|\$\(|`.*`)" \
    /var/log/nginx/access.log | head -20

# 2.5 扫描器检测
grep -iE "(nmap|sqlmap|nikto|dirb|burp|wpscan|acunetix|nessus)" \
    /var/log/nginx/access.log | head -20

# 2.6 敏感文件访问检测
grep -iE "(phpmyadmin|wp-admin|admin\.php|login\.php|\.env|\.git|\.bak|\.sql|\.zip)" \
    /var/log/nginx/access.log | head -20

# 2.7 404错误集中的IP（可能在扫描）
awk '$9 == 404 {count[$1]++} END {
    for (ip in count) if (count[ip] > 20) print count[ip], ip
}' /var/log/nginx/access.log | sort -rn | head -20

# ========== 场景3: 异常登录检测 ==========

# 3.1 新用户首次登录
# 对比历史登录记录
last | awk '{print $1}' | sort -u > current_users.txt
# 和已知用户列表对比
diff known_users.txt current_users.txt

# 3.2 异常时间段登录
# 凌晨2-5点的登录
awk -F'[ :]' '$1 == "Jun" && $3 >= 2 && $3 < 5 && /Accepted/ {print $0}' \
    /var/log/auth.log

# 3.3 异地登录检测
# 提取登录IP并查询归属地（需要GeoIP工具）
grep "Accepted" /var/log/auth.log | \
    awk '{print $(NF-3)}' | sort -u | while read ip; do
        geo=$(geoiplookup "$ip" 2>/dev/null | head -1)
        echo "$ip - $geo"
    done

# 3.4 登录失败后立即成功（可能密码被猜中）
grep -E "(Failed|Accepted)" /var/log/auth.log | tail -100

# ========== 场景4: 检测webshell ==========

# 4.1 查找可疑的PHP文件（最近7天新建）
find /var/www/html -name "*.php" -mtime -7 -type f

# 4.2 查找包含危险函数的PHP文件
find /var/www/html -name "*.php" -exec grep -l "eval\|exec\|system\|shell_exec\|passthru\|assert" {} \;

# 4.3 分析访问日志中POST到可疑文件的请求
awk '$6 == "POST" && $7 ~ /\.php$/ && $9 == 200' \
    /var/log/nginx/access.log | tail -20

# 4.4 查找上传目录中的可执行文件
find /var/www/html/uploads -type f -name "*.php" -o -name "*.pl" -o -name "*.py" -o -name "*.sh"

# 4.5 检查文件修改时间异常的文件
find /var/www/html -type f -name "*.php" -newer /etc/passwd

# ========== 场景5: 系统入侵痕迹检测 ==========

# 5.1 检查新增用户
cat /etc/passwd | awk -F: '$3 >= 1000 {print $1, $3}' > current_users.txt
# 和基线对比

# 5.2 检查setuid文件变化
find / -perm -4000 -type f > current_setuid.txt
# 和基线对比

# 5.3 检查计划任务异常
crontab -l
ls -la /etc/cron.d/
ls -la /var/spool/cron/

# 5.4 检查系统日志中的异常
grep -i "segfault\|panic\|oops\|corruption" /var/log/syslog
grep -i "error\|warning" /var/log/kern.log | tail -20

# 5.5 检查异常的网络连接
netstat -tlnp
ss -tlnp
# 对比已知的正常服务

# 5.6 检查异常进程
ps auxf
# 查找隐藏进程（对比ps和/proc）

# 5.7 检查rootkit痕迹
chkrootkit
rkhunter --check

# ========== 场景6: 性能异常分析 ==========

# 6.1 分析响应时间异常
awk '$NF > 5000' /var/log/nginx/access.log | tail -20  # 响应超过5秒

# 6.2 找出最耗时的URL
awk '{sum[$7] += $NF; count[$7]++} END {
    for (url in sum) printf "%.2fms avg, %d reqs - %s\n", sum[url]/count[url], count[url], url
}' /var/log/nginx/access.log | sort -rn | head -20

# 6.3 错误率分析
awk '{total[$7]++; if ($9 >= 400) errors[$7]++} END {
    for (url in total) {
        err_rate = (url in errors) ? errors[url]/total[url]*100 : 0
        if (err_rate > 5) printf "%.1f%% errors - %s (%d/%d)\n", err_rate, url, errors[url], total[url]
    }
}' /var/log/nginx/access.log | sort -rn | head -20

# 6.4 流量突增检测
# 按分钟统计请求数
awk '{
    minute = substr($4, 2, 16)
    count[minute]++
} END {
    for (m in count) print m, count[m]
}' /var/log/nginx/access.log | sort | tail -60
```
