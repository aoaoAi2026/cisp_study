
## 4.14 rsyslog高级配置

### 4.14.1 高级日志过滤规则

rsyslog提供了强大的日志过滤能力，除了传统的设施/优先级过滤外，还支持基于消息内容、属性、正则表达式等多种过滤方式。RainerScript是rsyslog的高级配置语言，支持条件判断、循环、变量等编程特性，可以实现复杂的日志处理逻辑。

基于属性的过滤（Property-Based Filters）允许根据日志消息的任意属性进行匹配，包括时间戳、主机名、进程名、消息内容等。这种过滤方式比传统的facility/priority更加灵活，可以针对特定场景精确筛选日志。

```bash
# /etc/rsyslog.d/10-advanced-filter.conf
# 基于消息内容过滤

# 包含特定关键字的日志发送到独立文件
:msg, contains, "ERROR" /var/log/errors.log
:msg, contains, "WARNING" /var/log/warnings.log

# 使用正则表达式匹配（注意：~表示正则匹配）
:msg, ereregex, "^.*Critical error.*$" /var/log/critical.log

# 基于主机名过滤
:hostname, isequal, "web-server-01" /var/log/hosts/web01.log
:hostname, startswith, "db-" /var/log/databases/all-db.log

# 基于进程名过滤
:programname, isequal, "sshd" /var/log/sshd-detail.log
:programname, contains, "nginx" /var/log/nginx-syslog.log

# 过滤后停止处理（防止重复记录）
:msg, contains, "DEBUG" stop
```

RainerScript提供了类似编程语言的条件判断能力，支持if/then/else结构，可以组合多个条件实现复杂的过滤逻辑。

```bash
# /etc/rsyslog.d/20-rainer-script.conf
# RainerScript高级过滤示例

# 组合条件过滤
if $programname == 'sshd' and $msg contains 'Failed password' then {
    action(type="omfile" file="/var/log/auth/failed-ssh.log")
    stop
}

# 多重条件判断
if $syslogfacility-text == 'auth' or $syslogfacility-text == 'authpriv' then {
    if $syslogpriority-text == 'emerg' or $syslogpriority-text == 'alert' then {
        action(type="omfile" file="/var/log/auth/critical-auth.log")
        action(type="omusrmsg" users="root")
    }
    action(type="omfile" file="/var/log/auth.log")
    stop
}

# 基于时间的过滤
if $timegenerated contains " 02:" or $timegenerated contains " 03:" then {
    if $msg contains "error" then {
        action(type="omfile" file="/var/log/night-errors.log")
    }
}

# 变量和模板结合
set $!custom!hostname = $hostname;
set $!custom!program = $programname;

template(name="json-template" type="list") {
    constant(value="{")
    constant(value="\"timestamp\":\"")
    property(name="timereported" dateFormat="rfc3339")
    constant(value="\",\"host\":\"")
    property(name="hostname")
    constant(value="\",\"severity\":\"")
    property(name="syslogseverity-text")
    constant(value="\",\"facility\":\"")
    property(name="syslogfacility-text")
    constant(value="\",\"program\":\"")
    property(name="programname")
    constant(value="\",\"message\":\"")
    property(name="msg" format="json")
    constant(value="\"}\n")
}

*.info action(type="omfile" file="/var/log/json/all.json" template="json-template")
```

### 4.14.2 日志转发高级配置

日志转发是rsyslog的核心功能之一，高级配置包括队列管理、可靠性保证、故障转移和TLS加密传输等。队列系统确保在网络故障时日志不会丢失，而是暂存在本地，待网络恢复后再重新发送。

rsyslog支持多种队列类型：Direct队列（同步直接发送）、LinkedList队列（内存链表队列）、FixedArray队列（固定大小数组队列）和Disk队列（磁盘持久化队列）。生产环境建议使用Disk队列或Disk-assisted内存队列，确保日志不丢失。

```bash
# /etc/rsyslog.d/30-forwarding.conf
# 高级日志转发配置

# 1. 定义转发动作（带队列）
action(
    type="omfwd"
    target="log-master.example.com"
    port="514"
    protocol="tcp"
    
    # 队列配置
    queue.type="LinkedList"
    queue.filename="fwd_main"
    queue.size="100000"
    queue.maxdiskspace="5g"
    queue.highwatermark="80000"
    queue.lowwatermark="20000"
    queue.saveonshutdown="on"
    queue.dequeuebatchsize="1000"
    
    # 重连配置
    action.resumeRetryCount="-1"
    action.resumeInterval="30"
    action.resumeIntervalMax="300"
    
    # 超时配置
    action.timeout="10"
    network.timeout="30"
    
    # TLS配置
    streamdriver="gtls"
    streamdrivermode="1"
    streamdriverauthmode="x509/name"
    streamdriverpermittedpeers="log-master.example.com"
)

# 2. 多目标故障转移配置
# 主服务器失败后自动切换到备用服务器
if $syslogfacility-text == 'auth' or $syslogfacility-text == 'authpriv' then {
    action(
        type="omfwd"
        target="log-primary.example.com"
        port="6514"
        protocol="tcp"
        streamdriver="gtls"
        streamdrivermode="1"
        queue.type="Disk"
        queue.filename="fwd_auth_primary"
        queue.maxdiskspace="2g"
        action.resumeRetryCount="3"
        action.resumeInterval="10"
    )
    action(
        type="omfwd"
        target="log-secondary.example.com"
        port="6514"
        protocol="tcp"
        streamdriver="gtls"
        streamdrivermode="1"
        queue.type="Disk"
        queue.filename="fwd_auth_secondary"
        queue.maxdiskspace="2g"
    )
    stop
}

# 3. 按日志级别选择不同的转发目标
*.emerg action(type="omfwd" target="alert-server.example.com" port="514" protocol="udp")
*.alert :omfwd:alert-server.example.com:514
*.crit;*.err @@error-collector.example.com:514
*.info;*.notice;*.warning @@log-collector.example.com:514
```

### 4.14.3 logrotate深度配置

logrotate是Linux系统日志管理的标准工具，除了基本的轮转功能外，还支持丰富的脚本钩子、共享脚本执行、多文件模式匹配、大小触发轮转等高级特性。合理配置logrotate可以在保证日志可用性的同时，有效控制磁盘空间占用。

prerotate和postrotate脚本是logrotate的重要特性，分别在轮转前和轮转后执行。共享脚本（sharedscripts）可以避免对同一组文件重复执行脚本，提高效率。此外，logrotate还支持firstaction/lastaction等更精细的钩子。

```bash
# /etc/logrotate.d/security-logs
# 安全日志专用轮转配置

# 认证日志 - 高安全性要求
/var/log/auth.log
/var/log/secure
{
    daily
    rotate 90
    compress
    delaycompress
    dateext
    dateformat -%Y%m%d
    dateyesterday
    
    # 权限控制
    create 0600 root root
    
    # 最小文件大小，小于则不轮转
    minsize 100k
    
    # 最大文件大小，超过立即轮转
    size 100M
    
    # 忽略文件不存在的错误
    missingok
    
    # 不处理空文件
    notifempty
    
    # 脚本只执行一次（多个文件只执行一次）
    sharedscripts
    
    # 轮转前执行
    prerotate
        # 记录轮转前的文件哈希用于完整性校验
        if [ -f /var/log/auth.log ]; then
            sha256sum /var/log/auth.log >> /var/log/auth-hashes.log
        fi
        # 检查日志文件是否被篡改
        if [ -f /var/log/auth.log ]; then
            chattr -a /var/log/auth.log 2>/dev/null || true
        fi
    endscript
    
    # 轮转后执行
    postrotate
        # 重新加载rsyslog
        systemctl reload rsyslog > /dev/null 2>&1 || true
        # 重新设置追加属性
        chattr +a /var/log/auth.log 2>/dev/null || true
        # 新文件的哈希
        sha256sum /var/log/auth.log >> /var/log/auth-hashes.log
    endscript
    
    # 轮转前的最后检查
    firstaction
        # 检查磁盘空间，低于10%则发出告警
        usage=$(df /var/log | awk 'NR==2 {print $5}' | sed 's/%//')
        if [ "$usage" -gt 90 ]; then
            logger -p user.crit "WARNING: /var/log disk usage is ${usage}%"
        fi
    endscript
    
    # 所有轮转完成后执行
    lastaction
        # 清理超过保留期的归档
        find /var/log/ -name "auth.log-*.gz" -mtime +90 -delete
    endscript
}

# Web服务器访问日志 - 按大小轮转
/var/log/nginx/*.log
/var/log/apache2/*.log
{
    size 500M
    rotate 30
    compress
    delaycompress
    dateext
    missingok
    notifempty
    create 0640 www-data adm
    sharedscripts
    
    postrotate
        # Nginx重新打开日志
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 $(cat /var/run/nginx.pid) 2>/dev/null || true
        fi
        # Apache重新加载
        if [ -f /var/run/apache2/apache2.pid ]; then
            /etc/init.d/apache2 reload > /dev/null 2>&1 || true
        fi
    endscript
}

# audit审计日志 - 特殊处理
/var/log/audit/*.log
{
    weekly
    rotate 52
    compress
    dateext
    dateformat -%Y%m%d
    missingok
    notifempty
    create 0600 root root
    
    postrotate
        # 重启auditd以重新打开日志文件
        /sbin/service auditd rotate > /dev/null 2>&1 || true
        service auditd rotate > /dev/null 2>&1 || true
    endscript
}
```

```bash
# lograte自动化调度配置

# 创建每小时执行的logrotate任务
cat > /etc/cron.hourly/logrotate-hourly << 'EOF'
#!/bin/sh
# 每小时检查一次大日志文件的轮转
test -x /usr/sbin/logrotate || exit 0
/usr/sbin/logrotate /etc/logrotate.d/hourly-logs 2>&1 | logger -t logrotate-hourly
EOF

chmod +x /etc/cron.hourly/logrotate-hourly

# 调试logrotate配置
logrotate -d /etc/logrotate.d/security-logs

# 强制执行轮转（测试用）
logrotate -f /etc/logrotate.d/security-logs

# 查看轮转状态
cat /var/lib/logrotate/status
```

### 4.14.4 远程日志服务器高可用搭建

生产环境的远程日志服务器需要高可用性，避免单点故障导致日志丢失。常见的架构包括主从复制、负载均衡集群、以及分层日志架构。分层架构中，客户端先将日志发送到本地的转发器（Relay），转发器再将日志汇总发送到中央日志集群，这样可以减少中央服务器的连接数并提供本地缓冲。

日志服务器的性能调优也非常关键，包括内核参数调优（网络缓冲区、文件描述符限制）、rsyslog性能参数（工作线程数、队列大小、批量处理）、以及存储规划（SSD用于热数据、HDD用于冷数据）。

```bash
# 中央日志服务器配置 - /etc/rsyslog.d/50-server.conf
# 高性能日志接收服务器配置

# 1. 性能调优全局配置
global(
    workDirectory="/var/spool/rsyslog"
    mainMsgQueue.type="LinkedList"
    mainMsgQueue.size="200000"
    mainMsgQueue.workerThreads="4"
    mainMsgQueue.dequeueBatchSize="500"
)

# 2. 模块加载
module(load="imtcp" MaxSessions="2000" MaxListeners="10")
module(load="imudp" TimeRequery="500")
module(load="imuxsock")
module(load="imklog")

# 3. TCP接收（带TLS）
input(
    type="imtcp"
    port="6514"
    StreamDriver.Name="gtls"
    StreamDriver.Mode="1"
    StreamDriver.AuthMode="anon"
    name="tls-tcp-input"
)

# 4. 普通TCP接收（内网用）
input(
    type="imtcp"
    port="514"
    ruleset="remote-tcp"
    name="plain-tcp-input"
)

# 5. UDP接收
input(
    type="imudp"
    port="514"
    ruleset="remote-udp"
    name="udp-input"
)

# 6. 规则集定义 - TCP远程日志
ruleset(name="remote-tcp") {
    # 按主机名创建目录
    if $fromhost-ip != "" then {
        action(
            type="omfile"
            FileCreateMode="0640"
            DirCreateMode="0750"
            FileGroup="adm"
            dirGroup="adm"
            file="/var/log/remote/%fromhost-ip%/%syslogfacility-text%.log"
        )
    }
    
    # 安全日志单独存储
    if $syslogfacility-text == 'auth' or $syslogfacility-text == 'authpriv' then {
        action(
            type="omfile"
            file="/var/log/remote-secure/%fromhost-ip%-auth.log"
            FileCreateMode="0600"
        )
    }
}

# 7. 规则集定义 - UDP远程日志
ruleset(name="remote-udp") {
    action(
        type="omfile"
        file="/var/log/remote-udp/%HOSTNAME%/syslog.log"
    )
}

# 8. 访问控制
$AllowedSender TCP, 127.0.0.1, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
$AllowedSender UDP, 127.0.0.1, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
```

```bash
# 日志中继服务器（Relay）配置
# /etc/rsyslog.d/40-relay.conf
# 用于分层日志架构：本地客户端 -> 中继 -> 中央服务器

# 接收本地和邻近服务器的日志
module(load="imtcp")
input(type="imtcp" port="514")

module(load="imudp")
input(type="imudp" port="514")

# 接收后转发到中央服务器
# 使用磁盘辅助队列确保日志不丢失
*.* action(
    type="omfwd"
    target="central-log.example.com"
    port="6514"
    protocol="tcp"
    streamdriver="gtls"
    streamdrivermode="1"
    
    # 磁盘辅助队列
    queue.type="Disk"
    queue.filename="relay_queue"
    queue.maxdiskspace="20g"
    queue.saveonshutdown="on"
    
    # 重连设置
    action.resumeRetryCount="-1"
    action.resumeInterval="60"
)

# 本地也保留一份（可选）
*.info;mail.none;authpriv.none;cron.none /var/log/syslog
authpriv.* /var/log/secure
```

```bash
# 日志服务器内核参数调优
# 编辑 /etc/sysctl.conf

# 网络缓冲区调优
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216

# TCP连接队列
net.core.somaxconn = 4096
net.ipv4.tcp_max_syn_backlog = 4096

# 文件描述符限制
# 编辑 /etc/security/limits.conf
# root soft nofile 65536
# root hard nofile 65536
# * soft nofile 65536
# * hard nofile 65536

# 应用配置
sysctl -p
```

## 4.15 syslog-ng日志系统

### 4.15.1 syslog-ng简介与安装

syslog-ng是一款高性能、功能丰富的开源日志管理系统，是传统syslog的现代化替代方案。它的名字中的"ng"代表"next generation"（下一代）。syslog-ng在保留syslog协议兼容性的同时，提供了更强大的过滤能力、更灵活的配置语法、更好的性能和更丰富的输出目标支持。

与rsyslog相比，syslog-ng的配置语法更加结构化和直观，采用声明式的配置风格。它支持的核心特性包括：多协议支持（syslog、RFC5424、JSON、CSV等）、强大的过滤和重写规则、数据库直接输出、消息分类和标记、地理IP解析、以及高性能的多线程架构。

```bash
# 安装syslog-ng

# Debian/Ubuntu
apt-get update
apt-get install syslog-ng syslog-ng-core

# CentOS/RHEL (需要EPEL源)
yum install epel-release
yum install syslog-ng

# 验证安装
syslog-ng --version

# 服务管理
systemctl enable syslog-ng
systemctl start syslog-ng
systemctl status syslog-ng

# 配置文件位置
# 主配置: /etc/syslog-ng/syslog-ng.conf
# 配置目录: /etc/syslog-ng/conf.d/
# 模块目录: /usr/lib/syslog-ng/

# 检查配置语法
syslog-ng --syntax-only
syslog-ng -s

# 重新加载配置
systemctl reload syslog-ng
```

syslog-ng的核心架构由四个基本组件构成：Sources（日志源）、Destinations（目标）、Filters（过滤器）和Log Paths（日志路径）。日志从Source进入，经过Filter过滤后，发送到一个或多个Destination。这种模块化的设计使得配置非常灵活，可以构建复杂的日志处理流水线。

```bash
# syslog-ng配置的基本结构
# source s_xxx { ... };
# filter f_xxx { ... };
# destination d_xxx { ... };
# log { source(s_xxx); filter(f_xxx); destination(d_xxx); };

# 查看默认配置
cat /etc/syslog-ng/syslog-ng.conf

# 示例：查看已启用的模块
syslog-ng --module-registry

# 调试模式启动（前台运行，输出详细日志）
syslog-ng -F -v -d
```

### 4.15.2 基本配置示例

syslog-ng的配置文件采用C-like的语法结构，支持注释、变量、模板等特性。一个典型的配置文件从全局选项开始，然后定义各种source、filter和destination，最后通过log语句将它们组合起来。

Source定义日志的来源，可以是本地套接字、文件、TCP/UDP网络端口、管道、甚至是程序输出。syslog-ng支持多种日志格式的自动识别，可以处理标准的BSD syslog格式、IETF syslog格式以及自定义格式。

```bash
# /etc/syslog-ng/syslog-ng.conf
# 完整配置示例

@version: 3.38
@include "scl.conf"

# ========== 全局选项 ==========
options {
    # 时间戳格式
    ts-format(iso);
    
    # 主机名解析
    use-dns(no);
    use-fqdn(no);
    
    # 消息大小限制
    log-msg-size(65536);
    
    # 队列配置
    log-fifo-size(10000);
    
    # 链式主机名（记录经过的中继）
    chain-hostnames(no);
    
    # 保留原始消息
    keep-hostname(yes);
    
    # 文件权限
    file-perm(0640);
    dir-perm(0750);
    create-dirs(yes);
    
    # 统计信息
    stats-level(1);
    stats-freq(3600);
};

# ========== 日志源定义 ==========

# 1. 本地系统日志源
source s_local {
    # 本地套接字（systemd/journald）
    system();
    
    # 内核日志
    internal();
    
    # 传统的/dev/log套接字
    unix-dgram("/dev/log");
};

# 2. 网络日志源
source s_network {
    # UDP接收
    udp(
        ip(0.0.0.0)
        port(514)
        log-msg-size(65536)
    );
    
    # TCP接收
    tcp(
        ip(0.0.0.0)
        port(514)
        max-connections(1000)
        log-msg-size(65536)
    );
};

# 3. 安全设备日志源
source s_security {
    # 防火墙日志（单独端口）
    udp(port(5141) program-override("firewall"));
    
    # IDS/IPS日志
    udp(port(5142) program-override("ids"));
};

# ========== 过滤器定义 ==========

# 按设施过滤
filter f_auth { facility(auth, authpriv); };
filter f_mail { facility(mail); };
filter f_cron { facility(cron); };
filter f_kern { facility(kern); };

# 按优先级过滤
filter f_emergency { level(emerg); };
filter f_alert { level(alert, emerg); };
filter f_critical { level(crit, alert, emerg); };
filter f_error { level(err..emerg); };
filter f_warning { level(warning..emerg); };
filter f_info { level(info..emerg); };

# 按程序名过滤
filter f_sshd { program("sshd"); };
filter f_sudo { program("sudo"); };
filter f_nginx { program("nginx"); };

# 按消息内容过滤
filter f_failed_login {
    program("sshd") and match("Failed password" value("MESSAGE"));
};

filter f_success_login {
    program("sshd") and match("Accepted" value("MESSAGE"));
};

# 按主机过滤
filter f_web_servers { host("^web-.*" type(perl)); };
filter f_db_servers { host("^db-.*" type(perl)); };

# ========== 目标定义 ==========

# 本地文件目标
destination d_auth { file("/var/log/auth.log"); };
destination d_syslog { file("/var/log/syslog"); };
destination d_mail { file("/var/log/mail.log"); };
destination d_cron { file("/var/log/cron.log"); };
destination d_kern { file("/var/log/kern.log"); };
destination d_messages { file("/var/log/messages"); };

# 按主机名分离的日志文件
destination d_per_host {
    file("/var/log/hosts/${HOST}/syslog.log"
        create-dirs(yes)
        dir-perm(0750)
    );
};

# 认证日志单独按主机存储
destination d_per_host_auth {
    file("/var/log/hosts/${HOST}/auth.log"
        create-dirs(yes)
        file-perm(0600)
    );
};

# 控制台告警
destination d_console { usertty("root"); };

# 转发到远程服务器
destination d_remote {
    tcp("log-server.example.com" port(514));
};

# 转发到远程服务器（TLS加密）
destination d_remote_tls {
    syslog("log-server.example.com"
        port(6514)
        transport(tls)
        tls(
            ca-file("/etc/syslog-ng/tls/ca.crt")
            cert-file("/etc/syslog-ng/tls/client.crt")
            key-file("/etc/syslog-ng/tls/client.key")
            peer-verify(yes)
        )
        disk-buffer(
            mem-buf-size(100000)
            disk-buf-size(1048576000)
            reliable(yes)
            dir("/var/lib/syslog-ng/disk-buffer")
        )
    );
};

# JSON格式输出
destination d_json_file {
    file("/var/log/json/all-json.log"
        template("$(format-json --scope rfc5424 --scope dot-nv-pairs)\n")
    );
};

# ========== 日志路径定义 ==========

# 本地系统日志
log {
    source(s_local);
    
    # 认证日志
    log {
        filter(f_auth);
        destination(d_auth);
    };
    
    # 邮件日志
    log {
        filter(f_mail);
        destination(d_mail);
        flags(final);
    };
    
    # 定时任务日志
    log {
        filter(f_cron);
        destination(d_cron);
        flags(final);
    };
    
    # 内核日志
    log {
        filter(f_kern);
        destination(d_kern);
    };
    
    # 紧急消息发送到控制台
    log {
        filter(f_emergency);
        destination(d_console);
    };
    
    # 其余日志到syslog
    log {
        destination(d_syslog);
    };
};

# 网络接收的日志
log {
    source(s_network);
    
    # 按主机存储
    destination(d_per_host);
    
    # 认证日志单独存储
    log {
        filter(f_auth);
        destination(d_per_host_auth);
    };
    
    # 同时转发到中央服务器
    destination(d_remote_tls);
};

# 包含自定义配置
@include "/etc/syslog-ng/conf.d/*.conf"
```

### 4.15.3 日志过滤与分类

syslog-ng的过滤和分类能力是其最强大的特性之一。除了基本的设施、优先级、主机名和程序名过滤外，syslog-ng还支持基于消息内容的正则表达式匹配、字段提取、消息重写、以及基于外部数据库或文件的动态过滤。

分类（Classification）是syslog-ng的高级功能，可以自动识别日志消息的类型，并将其归类到预定义的类别中。syslog-ng内置了一个模式数据库（Pattern Database），包含数千种常见应用的日志模式，可以自动识别并分类日志消息，便于后续的分析和告警。

```bash
# /etc/syslog-ng/conf.d/filter-classify.conf
# 高级过滤与分类配置

# ========== 高级过滤器 ==========

# 1. 基于消息内容的复合过滤
filter f_security_events {
    (
        program("sshd") and match("Failed password|Accepted password|Invalid user" value("MESSAGE"))
    ) or (
        program("sudo") and match("COMMAND=" value("MESSAGE"))
    ) or (
        facility(auth, authpriv) and level(warning..emerg)
    );
};

# 2. 基于正则表达式的过滤
filter f_suspicious_activity {
    match("Nmap|scan|exploit|sqlmap|nikto|dirb" value("MESSAGE") type(perl) flags(ignore-case));
};

# 3. 工作时间外的登录
filter f_off_hours_login {
    program("sshd")
    and match("Accepted" value("MESSAGE"))
    and (
        date('H', value('DATE')) >= 22
        or date('H', value('DATE')) < 6
    );
};

# ========== 重写规则 ==========

# 消息标准化
rewrite r_normalize_messages {
    # 清理多余的空白字符
    subst(" +", " ", value("MESSAGE") type(perl) flags(global));
    
    # 替换敏感信息（脱敏）
    subst("password=[^ ]+", "password=***", value("MESSAGE") type(perl) flags(ignore-case));
    subst("token=[^ ]+", "token=***", value("MESSAGE") type(perl) flags(ignore-case));
};

# 添加自定义字段
rewrite r_add_custom_fields {
    set("$HOST" value("CUSTOM_HOST"));
    set("secure" value("LOG_CATEGORY") condition(filter(f_security_events)));
    set("normal" value("LOG_CATEGORY") condition(not filter(f_security_events)));
};

# ========== 消息分类（Pattern Database）==========

# 使用内置的模式数据库
parser p_pattern_db {
    db_parser(file("/etc/syslog-ng/patterndb.xml"));
};

# CSV解析器解析结构化日志
parser p_csv_parser {
    csv-parser(
        columns("HTTP_METHOD", "HTTP_PATH", "HTTP_STATUS", "RESPONSE_TIME")
        delimiters(" ")
        quote-pairs('"')
    );
};

# JSON解析器
parser p_json {
    json-parser(prefix(".json."));
};

# key=value解析器
parser p_kv_parser {
    kv-parser(prefix(".kv."));
};

# ========== 分类后的日志路径 ==========

# 安全事件专用日志路径
log {
    source(s_local);
    source(s_network);
    
    # 先应用重写规则
    rewrite(r_normalize_messages);
    rewrite(r_add_custom_fields);
    
    # 安全事件
    log {
        filter(f_security_events);
        
        # 分类
        parser(p_pattern_db);
        
        # 安全事件存储到独立文件
        destination {
            file("/var/log/security/security-events.log"
                create-dirs(yes)
                file-perm(0600)
                dir-perm(0700)
            );
        };
        
        # 同时发送到告警系统
        destination {
            program("/usr/local/bin/security-alert.sh"
                template("${ISODATE} ${HOST} ${MESSAGE}\n")
            );
        };
        
        flags(final);
    };
    
    # 可疑活动
    log {
        filter(f_suspicious_activity);
        destination {
            file("/var/log/security/suspicious.log" create-dirs(yes));
        };
    };
};

# Web访问日志解析示例
log {
    source(s_local);
    
    filter { program("nginx-access"); };
    
    # 解析访问日志
    parser {
        csv-parser(
            columns("CLIENT_IP", "IDENT", "USER", "TIMESTAMP", "REQUEST",
                    "STATUS", "BYTES", "REFERER", "USER_AGENT")
            delimiters(" ")
            quote-pairs('""[]')
            escape-char("\")
        );
    };
    
    # 存储到文件
    destination {
        file("/var/log/nginx/parsed-access.log"
            template("${ISODATE} ${CLIENT_IP} ${REQUEST} ${STATUS} ${BYTES}\n")
        );
    };
    
    # 404错误单独统计
    log {
        filter { "${STATUS}" eq "404" };
        destination {
            file("/var/log/nginx/404-errors.log");
        };
    };
};
```

```bash
# 创建模式数据库（简化示例）
# /etc/syslog-ng/patterndb.xml

cat > /etc/syslog-ng/patterndb.xml << 'EOF'
<?xml version='1.0' encoding='UTF-8'?>
<patterndb version='4' pub_date='2026-01-01'>
  <ruleset name='syslogd' id='1'>
    <pattern>sshd</pattern>
      <rules>
        <rule id='SSHD-LOGIN_FAILED' class='security' context-id='ssh-login'>
          <patterns>
            <pattern>Failed password for @ESTRING:USER: @from @ESTRING:IPADDR: @port</pattern>
          </patterns>
          <tags>
            <tag>security</tag>
            <tag>authentication-failure</tag>
          </tags>
        </rule>
        <rule id='SSHD-LOGIN_SUCCESS' class='system' context-id='ssh-login'>
          <patterns>
            <pattern>Accepted password for @ESTRING:USER: @from @ESTRING:IPADDR: @port</pattern>
          </patterns>
          <tags>
            <tag>authentication-success</tag>
          </tags>
        </rule>
      </rules>
  </ruleset>
</patterndb>
EOF

# 验证配置并重新加载
syslog-ng --syntax-only
systemctl reload syslog-ng
```
