# 第8章 SELinux与AppArmor

## 8.1 SELinux基础概念

### 8.1.1 SELinux简介

SELinux（Security-Enhanced Linux）是美国国家安全局（NSA）开发的一种强制访问控制（MAC）系统，它集成在Linux内核中，为Linux系统提供额外的安全层。与传统的自主访问控制（DAC）不同，SELinux通过标签和策略对进程、文件、端口等系统资源进行强制访问控制，即使拥有root权限，进程也只能访问其策略允许的资源。

传统的Linux权限模型基于用户和文件权限（rwx权限），任何拥有root权限的进程都可以执行任何操作，这带来了一定的安全风险。而SELinux采用最小权限原则，默认情况下拒绝所有访问，只有在策略明确允许的情况下才会授权访问。

SELinux的工作不依赖于传统的Linux权限系统。即使你将一个文件的权限设置为777，或者进程以root用户运行，SELinux仍然可以阻止该进程访问该文件，前提是SELinux策略认为这个访问是不安全的。这种机制为系统提供了更深层次的安全保护。

### 8.1.2 SELinux工作原理

SELinux的工作基于三个核心概念：主体（Subject）、客体（Object）和策略（Policy）。主体是系统中的活动实体，通常是进程；客体是系统中被访问的被动实体，包括文件、目录、端口、网络接口等；策略是一组规则，定义了哪些主体可以访问哪些客体。

SELinux为系统中的每个主体和客体都分配了一个安全上下文（Security Context）。这个上下文是一个标签，包含三个主要组成部分：用户（User）、角色（Role）和类型（Type）。当进程尝试访问文件时，SELinux内核会检查进程的上下文和文件的上下文，然后根据策略决定是否允许访问。

这个过程发生在Linux内核的安全模块中，不需要用户空间的干预。所有的访问决策都在内核层面完成，这使得SELinux的保护非常坚实，难以绕过。

### 8.1.3 SELinux工作模式

SELinux有三种工作模式，通过getenforce或sestatus命令可以查看当前模式：

**Enforcing模式**是SELinux的正常工作模式，在该模式下，SELinux会根据策略强制执行访问控制，任何违反策略的操作都会被拒绝并记录到日志中。这是生产环境的推荐模式。

**Permissive模式**用于测试和调试，在该模式下，SELinux不会强制执行策略，但会记录违反策略的操作。这对于调试策略问题非常有帮助，可以在不影响服务正常运行的情况下测试新的策略规则。

**Disabled模式**是完全禁用SELinux，此时SELinux不提供任何访问控制。在大多数情况下，不推荐使用该模式，因为它会使系统失去SELinux提供的安全保护。

```bash
# 查看当前SELinux模式
getenforce
# 输出示例：Enforcing

# 查看详细的SELinux状态
sestatus
# 输出示例：
# SELinux status:                 enabled
# SELinuxfs mount:                /sys/fs/selinux
# SELinux root directory:         /etc/selinux
# Loaded policy name:             targeted
# Current mode:                   enforcing
# Mode from config file:          enforcing
# Policy MLS status:              enabled
# Policy deny_unknown status:     allowed
# Max kernel policy version:      33

# 临时切换到Permissive模式（立即生效，重启后失效）
setenforce 0
getenforce  # 输出：Permissive

# 临时切换回Enforcing模式
setenforce 1
getenforce  # 输出：Enforcing
```
## 8.2 SELinux上下文详解

### 8.2.1 上下文格式与组成

SELinux安全上下文的标准格式为：user:role:type:level。对于大多数桌面和服务器系统，主要关注前三部分，MLS系统才会使用level字段。

**用户（User）**是SELinux策略中定义的安全用户标识，它与Linux系统用户不同，是一种独立的身份标识。例如，system_u表示系统进程，root表示root用户的安全上下文。

**角色（Role）**定义了主体可以访问的客体类型范围。对于进程，通常是object_r角色；对于文件，也有相应的角色定义。

**类型（Type）**是SELinux策略中最关键的组成部分，它定义了主体可以访问哪些类型的客体。对于文件，类型被称为file_type；对于进程，通常有特定的进程类型。

```bash
# 完整的安全上下文格式说明
# user:role:type:level
# 
# user - SELinux用户标识
# role - 角色（进程通常为object_r，文件也有相应角色）
# type - 类型（最关键的组成部分，决定访问权限）
# level - MLS安全级别（可选，MLS策略使用）

# 查看文件的完整安全上下文
ls -Z /var/log/messages
# 输出示例：system_u:object_r:var_log_t:s0  /var/log/messages

# 查看进程的安全上下文
ps auxZ | head -5
# 输出示例：
# system_u:system_r:init_t:s0          1 ?        /sbin/init
# system_u:system_r:kernel_t:s0        2 ?        [kthreadd]

# 查看用户的SELinux上下文
id -Z
# 输出示例：unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023
```

### 8.2.2 查看和修改上下文

**查看文件上下文：**

```bash
# 使用ls的-Z选项查看文件的SELinux上下文
ls -Z /var/www/html/index.html
# 输出示例：unconfined_u:object_r:httpd_sys_content_t:s0  /var/www/html/index.html

# 查看目录及其中所有文件的上下文
ls -lZ /var/www/html/
# 输出示例：
# total 48
# -rw-r--r--. root root system_u:object_r:httpd_sys_content_t:s0 index.html
# -rw-r--r--. root root system_u:object_r:httpd_sys_content_t:s0 about.html

# 查看进程的上下文
ps auxZ | grep nginx
# 输出示例：
# system_u:system_r:nginx_t:s0  nginx: master process /usr/sbin/nginx

# 查看用户的上下文
id -Z
# 输出示例：unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023

# 查看端口的上下文
semanage port -l | grep http
# 输出示例：
# http_port_t                  tcp      80, 81, 443, 488, 8008, 8009, 8443, 9000
```

**常见的上下文类型：**

对于Web服务器文件，通常使用httpd_sys_content_t类型；对于Web服务器日志，使用httpd_log_t类型；对于SSH私钥，使用sshd_key_t类型；对于用户主目录，使用user_home_t类型。

```bash
# Web服务相关类型
httpd_sys_content_t      # Web服务器可读的文件内容
httpd_sys_rw_content_t   # Web服务器可读写的内容
httpd_log_t              # Web服务器日志文件
httpd_cache_t            # Web服务器缓存目录
httpd_tmp_t              # Web服务器临时文件

# 数据库相关类型
mysqld_db_t              # MySQL数据库文件
mysqld_log_t             # MySQL日志文件
mysqld_var_run_t         # MySQL运行时文件
postgresql_db_t          # PostgreSQL数据库文件

# SSH相关类型
sshd_key_t              # SSH私钥
sshd_cert_t             # SSH证书
sshd_exec_t             # SSH可执行文件
```

**修改文件上下文：**

```bash
# 使用chcon命令临时修改上下文（立即生效，但重启后可能失效）
chcon -t httpd_sys_content_t /var/www/html/index.html
chcon -R -t httpd_sys_content_t /var/www/html/

# 使用reference文件作为模板修改上下文
chcon --reference=/var/www/html/index.html /var/www/html/about.html

# 使用restorecon恢复默认上下文（根据策略定义的默认规则）
restorecon /var/www/html/index.html
restorecon -R /var/www/html/

# 永久修改默认上下文（需要semanage）
semanage fcontext -a -t httpd_sys_content_t "/var/www/html(/.*)?"
semanage fcontext -a -t httpd_sys_content_t "/srv/www(/.*)?"

# 查看文件当前的上下文
ls -Z /var/www/html/index.html

# 查看策略定义的默认上下文
semanage fcontext -l | grep /var/www
```

### 8.2.3 上下文转换

当进程启动时，它会继承父进程的上下文。但某些服务（如Apache、Nginx）需要转换到特定的上下文才能访问特定类型的文件。这个转换过程由策略规则定义。

对于Apache，父进程运行在httpd_t类型，而子进程在处理请求时会转换到httpd_sys_content_t类型的文件。SELinux策略定义了这些转换规则，确保Web服务器只能访问授权的文件和资源。

### 8.2.4 SELinux上下文深度解析

#### MLS级别与多级安全

在高级SELinux配置中，特别是使用MLS（Multi-Level Security）策略时，上下文中还包含安全级别（Level）信息。安全级别采用s0:c0,c1格式，其中s0是敏感级别，c0和c1是类别组合。

**敏感级别（s0-s15）：**代表信息的保密等级，s0最低（公开），s15最高（绝密）。

**类别（c0-cn）：**用于标记信息的类别或部门，如c0表示财务，c1表示人力资源。

```bash
# 查看完整的SELinux上下文（包括MLS级别）
ls -Z /etc/shadow
# 输出示例：system_u:object_r:shadow_t:s0    /etc/shadow

# 查看用户进程的安全级别
ps auxZ | grep httpd
# 输出示例：system_u:system_r:httpd_t:s0-s15:c0,c1

# 在MLS模式下设置文件的安全级别
chcon -l s0 /var/www/html/public.html                    # 设置为公开
chcon -l s1:c0 /var/www/html/confidential.html           # 设置为机密
chcon -l s1:c0,c1 /var/www/html/topsecret.html           # 设置为绝密

# 查看当前用户的安全许可级别
id -Z
# 输出示例：staff_u:user_r:user_t:s0-s0:c0.c255
```

#### 上下文继承与域转换

当一个进程启动新程序时，会发生域转换（Domain Transition）。SELinux通过策略规则控制这种转换，确保进程只能按照预期的方式转换到新的安全上下文。

```bash
# 查看Apache进程的域转换
ps auxZ | grep httpd
# httpd父进程: system_u:system_r:httpd_t:s0
# httpd子进程: system_u:system_r:httpd_t:s0

# 查看域转换规则
semanage transition -l | grep httpd
# 输出示例：
# httpd_t httpd_exec_t httpd_t httpd_sys_script_t

# 这表示：
# 主体: httpd_t (源域)
# 程序: httpd_exec_t (执行文件的类型)
# 目标: httpd_t (目标域)
# 入口: httpd_sys_script_t (可选的入口类型)

# 查看哪些类型可以转换到httpd_t
sesearch --allow --source httpd_t --target_type httpd_exec_t
```

#### 常见上下文类型参考表

| 资源类型 | 典型路径 | SELinux类型 |
|---------|---------|-------------|
| Apache文档根 | /var/www/html | httpd_sys_content_t |
| Apache日志 | /var/log/httpd | httpd_log_t |
| Nginx文档根 | /usr/share/nginx/html | httpd_sys_content_t |
| MySQL数据 | /var/lib/mysql | mysqld_db_t |
| PostgreSQL数据 | /var/lib/pgsql | postgresql_db_t |
| SSH密钥 | /etc/ssh/*_key | sshd_key_t |
| 用户主目录 | /home/* | user_home_dir_t |
| 系统配置 | /etc/* | etc_t |
| NFS挂载 | /mnt/nfs/* | nfs_t |
## 8.3 SELinux布尔值

### 8.3.1 布尔值概念

SELinux布尔值是一组开关，用于在不修改策略源代码的情况下调整SELinux策略的行为。这使得管理员可以根据实际需求快速启用或禁用某些策略规则，而无需重新编译整个策略。

每个布尔值控制一组相关的访问权限。当一个布尔值被启用时，策略中相关的规则就会生效；当被禁用时，这些规则就不起作用。

### 8.3.2 布尔值管理命令

```bash
# 查看所有布尔值及其当前状态
getsebool -a

# 查找特定的布尔值
getsebool -a | grep httpd
getsebool -a | grep mysql

# 查看布尔值的详细描述
semanage boolean -l

# 查看特定布尔值的状态
getsebool httpd_can_network_connect

# 临时启用布尔值
setsebool httpd_can_network_connect on

# 永久启用布尔值（-P选项会将设置写入策略配置）
setsebool -P httpd_can_network_connect on
setsebool -P httpd_can_sendmail off
```

### 8.3.3 常用布尔值说明

**Apache/Nginx相关：**

```bash
httpd_can_network_connect      # 允许HTTP服务连接网络端口
httpd_can_sendmail             # 允许HTTP服务发送邮件
httpd_enable_cgi               # 允许HTTP服务执行CGI脚本
httpd_unified                 # 统一管理所有HTTP相关权限
httpd_use_nfs                # 允许HTTP服务访问NFS文件系统
httpd_use_cifs               # 允许HTTP服务访问SMB/CIFS文件系统
```

**MySQL相关：**

```bash
mysql_connect_any            # 允许MySQL连接任意端口
mysql_read_bad_content       # 允许MySQL读取非MySQL内容文件
```

**NFS/Samba相关：**

```bash
nfs_export_all_ro           # 允许NFS只读导出
nfs_export_all_rw           # 允许NFS读写导出
samba_enable_home_dirs      # 允许Samba访问用户主目录
```

### 8.3.4 布尔值实战场景详解

#### 场景一：Web应用需要连接外部数据库

**问题描述：**Web应用程序部署在Apache服务器上，需要连接远程MySQL数据库，但连接被SELinux阻止。

**诊断过程：**

```bash
# 1. 检查Apache错误日志
tail -20 /var/log/httpd/error_log

# 2. 检查SELinux拒绝日志
ausearch -m avc -c httpd -ts recent

# 3. 使用audit2why分析原因
ausearch -m avc -c httpd -ts recent | audit2why
```

**解决方案：**

```bash
# 启用HTTP服务网络连接布尔值
setsebool -P httpd_can_network_connect on

# 验证设置
getsebool httpd_can_network_connect
```

#### 场景二：Web应用需要发送邮件

**问题描述：**PHP应用程序使用mail()函数发送邮件，但邮件无法发送。

**诊断过程：**

```bash
# 1. 检查邮件日志
tail -20 /var/log/maillog

# 2. 检查SELinux日志
ausearch -m avc -c httpd -ts recent | audit2why
```

**解决方案：**

```bash
# 启用HTTP服务发送邮件布尔值
setsebool -P httpd_can_sendmail on
```

#### 场景三：Samba共享目录给Web服务器

**问题描述：**Web服务器需要从Samba共享读取内容，但访问被拒绝。

**诊断过程：**

```bash
# 1. 检查Samba共享挂载
df -h /mnt/samba

# 2. 检查SELinux上下文
ls -Z /mnt/samba

# 3. 检查是否有访问samba_share_t类型的策略规则
sesearch --allow -s httpd_t -t samba_share_t
```

**解决方案：**

```bash
# 方案1：修改Samba共享的SELinux上下文为httpd可访问的类型
semanage fcontext -a -t httpd_sys_content_t '/mnt/samba(/.*)?'
restorecon -Rv /mnt/samba

# 方案2：启用Samba共享开关
setsebool -P samba_export_all_ro on
```

## 8.4 SELinux策略管理

### 8.4.1 SELinux策略类型

**Targeted策略：**这是RHEL/CentOS系统的默认策略，只针对特定的系统服务进行强制访问控制，其他进程在unconfined_t域中运行，不受SELinux限制。这种策略在安全性和可用性之间提供了良好的平衡。

**Minimum策略：**最小化策略，仅对选定的进程应用SELinux保护，适用于对安全性有更高要求的场景。

**MLS（Multi-Level Security）策略：**多级安全策略，提供军事级别的安全保护，通过安全级别（绝密、机密、公开等）控制信息流动。

```bash
# 查看当前使用的策略类型
sestatus | grep "Loaded policy name"

# 查看所有可用的策略类型
ls /etc/selinux/

# 查看SELinux配置文件
cat /etc/selinux/config
```

### 8.4.2 策略包管理

```bash
# 查看当前安装的SELinux策略包
rpm -qa | grep selinux

# 查看策略状态
sestatus

# 列出已加载的策略模块
semodule -list

# 手动加载策略模块
semodule -i mypolicy.pp

# 移除策略模块
semodule -r mypolicy

# 启用/禁用策略模块
semodule -e mypolicy
semodule -d mypolicy
```

### 8.4.3 SELinux策略配置

**配置SELinux主配置文件：**

```bash
# 编辑SELinux配置文件
vi /etc/selinux/config

# 内容如下：
# SELINUX=enforcing    # 可选值：enforcing, permissive, disabled
# SELINUXTYPE=targeted # 可选值：targeted, minimum, mls
# SETLOCALDEFS=0

# 使用setenforce临时更改模式
setenforce 0  # 临时切换到Permissive模式
setenforce 1  # 切换回Enforcing模式

# 查看当前模式
getenforce
```

### 8.4.4 策略模块开发基础

当现有的布尔值无法满足需求时，可能需要开发自定义的SELinux策略模块。

```bash
# 1. 安装策略开发工具
yum install -y selinux-policy-devel audit2allow

# 2. 收集AVC拒绝事件
ausearch -m avc -c httpd -o avc.log

# 3. 从AVC日志生成策略模块
audit2allow -M myapp < avc.log

# 4. 查看生成的策略文件
cat myapp.te

# 5. 编译策略模块
make -f /usr/share/selinux/devel/Makefile myapp.pp

# 6. 安装策略模块
semodule -i myapp.pp

# 7. 验证模块已加载
semodule -l | grep myapp
```

### 8.4.5 策略分析工具

SELinux提供了多个工具来分析策略和排查问题：

```bash
# seinfo：查看策略中的详细信息
seinfo -a                    # 显示所有属性
seinfo -r                    # 显示所有角色
seinfo -u                    # 显示所有用户
seinfo -t                    # 显示所有类型

# sesearch：搜索策略规则
sesearch --allow -s httpd_t -t httpd_sys_content_t
sesearch --allow -s httpd_t -t httpd_sys_content_t -c file
```
## 8.5 SELinux实战配置

### 8.5.1 Apache配置

```bash
# 1. 安装Apache和SELinux管理工具
yum install -y httpd httpd-tools selinux-policy selinux-policy-targeted policycoreutils

# 2. 设置正确的文件上下文
semanage fcontext -a -t httpd_sys_content_t "/var/www(/.*)?"
semanage fcontext -a -t httpd_log_t "/var/log/httpd(/.*)?"
semanage fcontext -a -t httpd_sys_rw_content_t "/var/www/cgi-bin(/.*)?"

# 3. 恢复默认上下文
restorecon -R /var/www
restorecon -R /var/log/httpd

# 4. 配置必要的布尔值
setsebool -P httpd_can_network_connect on
setsebool -P httpd_can_sendmail off
setsebool -P httpd_enable_cgi on
setsebool -P httpd_unified on

# 5. 允许Apache监听非标准端口
semanage port -a -t http_port_t -p tcp 8080

# 6. 启用并启动Apache
systemctl enable httpd
systemctl start httpd

# 7. 检查Apache上下文
ps auxZ | grep httpd
```

### 8.5.2 Nginx配置

```bash
# 1. 安装Nginx
yum install -y nginx selinux-policy selinux-policy-targeted

# 2. 设置文件上下文
semanage fcontext -a -t httpd_sys_content_t "/usr/share/nginx/html(/.*)?"
semanage fcontext -a -t httpd_log_t "/var/log/nginx(/.*)?"
semanage fcontext -a -t httpd_cache_t "/var/cache/nginx(/.*)?"

# 3. 恢复上下文
restorecon -R /usr/share/nginx/html
restorecon -R /var/log/nginx
restorecon -R /var/cache/nginx

# 4. 配置布尔值
setsebool -P httpd_can_network_connect on

# 5. 检查状态
ps auxZ | grep nginx
```

### 8.5.3 MySQL配置

```bash
# 1. 安装MySQL
yum install -y mysql-server selinux-policy selinux-policy-targeted

# 2. 设置数据目录上下文
semanage fcontext -a -t mysqld_db_t "/var/lib/mysql(/.*)?"

# 3. 设置日志文件上下文
semanage fcontext -a -t mysqld_log_t "/var/log/mysql(/.*)?"

# 4. 设置run目录上下文
semanage fcontext -a -t mysqld_var_run_t "/var/run/mysqld(/.*)?"

# 5. 恢复上下文
restorecon -R /var/lib/mysql
restorecon -R /var/log/mysql
restorecon -R /var/run/mysqld

# 6. 配置布尔值
setsebool -P mysql_connect_any off
setsebool -P mysql_read_bad_content on

# 7. 启动MySQL
systemctl enable mysqld
systemctl start mysqld
```

### 8.5.4 PostgreSQL配置

```bash
# 1. 安装PostgreSQL
yum install -y postgresql-server selinux-policy selinux-policy-targeted

# 2. 初始化数据库
postgresql-setup initdb

# 3. 设置数据目录上下文
semanage fcontext -a -t postgresql_db_t "/var/lib/pgsql/data(/.*)?"

# 4. 恢复上下文
restorecon -R /var/lib/pgsql/data

# 5. 配置布尔值
setsebool -P postgresql_can_rsync on
setsebool -P nis_enabled on

# 6. 启动PostgreSQL
systemctl enable postgresql
systemctl start postgresql
```

## 8.6 SELinux日志分析与故障排除

### 8.6.1 SELinux日志位置

SELinux的日志信息通常保存在/var/log/audit/audit.log文件中。如果使用auditd服务，所有SELinux拒绝访问的记录都会记录在这个文件中。

```bash
# 查看SELinux相关的审计日志
tail -f /var/log/audit/audit.log | grep selinux

# 使用ausearch搜索SELinux事件
ausearch -m AVC -ts recent

# 搜索今天的所有SELinux拒绝事件
ausearch -m avc -ts today

# 搜索特定进程的AVC事件
ausearch -m avc -c httpd

# 搜索特定类型的访问
ausearch -m avc -ss failed

# 使用 aureport 生成报告
aureport -a    # 报告AVC事件
```

### 8.6.2 sealert工具

sealert是RHEL/CentOS系统提供的SELinux诊断工具，可以分析日志并给出修复建议：

```bash
# 安装setroubleshoot（如果未安装）
yum install -y setroubleshoot setroubleshoot-server

# 确保auditd服务运行
systemctl enable auditd
systemctl start auditd

# 使用sealert分析日志
sealert -a /var/log/audit/audit.log

# 生成HTML报告
sealert -a /var/log/audit/audit.log > /tmp/selinux_report.html

# 查看特定事件详情
sealert -l <event_id>
```

### 8.6.3 常见故障排除

**场景1：Apache无法读取Web文件**

症状：浏览器显示403 Forbidden错误
原因：文件上下文不正确

```bash
# 诊断：
# 查看文件上下文
ls -Z /var/www/html/index.html

# 解决方案：
# 设置正确的SELinux上下文
semanage fcontext -a -t httpd_sys_content_t "/var/www/html(/.*)?"
restorecon -v /var/www/html/index.html
```

**场景2：Nginx无法连接后端PHP-FPM**

症状：502 Bad Gateway错误
原因：可能是SELinux阻止了连接

```bash
# 检查PHP-FPM进程上下文
ps auxZ | grep php-fpm

# 允许Nginx连接PHP-FPM
setsebool -P httpd_can_network_connect on
```

**场景3：SSH无法访问用户主目录**

症状：SSH登录失败
原因：主目录上下文不正确

```bash
# 检查主目录上下文
ls -Zd /home/user

# 设置正确的上下文
semanage fcontext -a -t home_root_t "/home"
restorecon -Rv /home
```

### 8.6.4 使用audit2why和audit2allow

```bash
# 分析SELinux拒绝原因
ausearch -m avc -ts recent | audit2why

# 查看完整的AVC拒绝信息
ausearch -m avc -c httpd | audit2why

# 生成自定义策略模块
ausearch -m avc -c httpd | audit2allow -M my_httpd_policy

# 安装自定义策略
semodule -i my_httpd_policy.pp

# 直接允许当前拒绝的操作（使用local模块）
ausearch -m avc -c httpd | audit2allow -M local_httpd
semodule -i local_httpd.pp
```

### 8.6.5 sealert高级用法与日志分析实战

```bash
# 1. 生成完整的SELinux诊断报告
sealert -a /var/log/audit/audit.log 2>&1 | tee /tmp/full_report.txt

# 2. 实时监控SELinux拒绝事件
while true; do
    ausearch -m avc -ts recent | head -1 | audit2why
    sleep 1
done

# 3. 统计AVC事件
ausearch -m avc -ts today | wc -l

# 按进程统计
ausearch -m avc -ts today | awk '{print $NF}' | cut -d'=' -f2 | sort | uniq -c | sort -rn

# 4. 分析特定时间段的AVC事件
ausearch -m avc -ts 10:00:00 -te 11:00:00 | audit2allow
```

### 8.6.6 故障排除流程总结

```bash
# 第一步：确认SELinux状态
sestatus
getenforce

# 第二步：查找AVC拒绝事件
ausearch -m avc -ts recent | audit2why

# 第三步：使用sealert获取详细建议
sealert -a /var/log/audit/audit.log

# 第四步：根据建议修复
# 可能的修复方式：
# 1. 修改文件上下文
semanage fcontext -a -t httpd_sys_content_t "/path/to/file"
restorecon -v /path/to/file

# 2. 启用布尔值
setsebool -P boolean_name on

# 3. 添加端口
semanage port -a -t type_t -p tcp port_number

# 4. 创建自定义策略模块
ausearch -m avc ... | audit2allow -M module_name
semodule -i module_name.pp

# 第五步：验证修复
ausearch -m avc -ts recent | audit2why

# 第六步：测试服务
systemctl restart service_name
curl http://localhost/
```## 8.7 AppArmor基础

### 8.7.1 AppArmor简介

AppArmor是另一种Linux强制访问控制系统，主要被Debian、Ubuntu等Debian系发行版使用。与SELinux不同，AppArmor使用简单的配置文件（profile）来定义程序可以访问哪些文件和资源，这使得AppArmor的配置相对更加直观和易于理解。

AppArmor的核心设计理念是"应用程序沙箱化"，它将每个应用程序限制在其需要的资源范围内。如果应用程序试图访问未在profile中明确允许的资源，AppArmor会阻止该操作并记录到日志中。

### 8.7.2 AppArmor核心概念

**Profile（配置文件）：**定义了应用程序可以访问的文件、网络资源、能力和执行方式。

**Enforce模式：**强制模式，AppArmor会阻止违规行为并记录日志。

**Complain模式：**投诉模式，AppArmor只记录违规行为而不阻止。

### 8.7.3 AppArmor与SELinux对比

SELinux基于类型访问控制，AppArmor基于路径访问控制。SELinux配置复杂但粒度细，AppArmor配置简单但粒度相对粗。## 8.8 AppArmor配置与管理

### 8.8.1 AppArmor管理命令

```bash
# 查看AppArmor状态
apparmor_status
aa-status

# 查看所有profile列表
aa-status --profiles

# 切换profile到complain模式
aa-complain /etc/apparmor.d/usr.bin.nginx

# 切换profile到enforce模式
aa-enforce /etc/apparmor.d/usr.bin.nginx

# 重新加载profile
systemctl reload apparmor
```

### 8.8.2 AppArmor Profile结构

```bash
# /etc/apparmor.d/usr.bin.nginx
#include <tunables/global>

/usr/sbin/nginx {
    #include <abstractions/base>
    
    /etc/nginx/ r,
    /etc/nginx/** r,
    /var/log/nginx/ r,
    /var/log/nginx/** rw,
    /usr/sbin/nginx mr,
    network tcp,
    bind 80 tcp,
    bind 443 tcp,
}
```

### 8.8.3 AppArmor Profile语法

**文件访问规则：** r(读取), w(写入), a(追加), k(锁定)
**执行规则：** ux, Ux, px, Px, ix
**网络规则：** network tcp, bind tcp 80

### 8.8.4 创建自定义Profile

```bash
# 使用aa-genprof生成
aa-genprof /usr/bin/myapp

# 手动创建
cat > /etc/apparmor.d/usr.bin.myapp << 'EOF'
/usr/bin/myapp {
    #include <abstractions/base>
    /etc/myapp/*.conf r,
    /var/lib/myapp/** rw,
    network inet stream,
}
EOF

apparmor_parser -r /etc/apparmor.d/usr.bin.myapp
aa-enforce /etc/apparmor.d/usr.bin.myapp
```## 8.9 AppArmor实战配置

### 8.9.1 Nginx AppArmor配置

```bash
# 检查Nginx profile
ls /etc/apparmor.d/ | grep nginx

# 创建自定义profile
cat > /etc/apparmor.d/usr.sbin.nginx << 'EOF'
#include <tunables/global>

/usr/sbin/nginx {
    #include <abstractions/base>
    /etc/nginx/ r,
    /etc/nginx/** r,
    /var/log/nginx/ r,
    /var/log/nginx/** rw,
    /var/cache/nginx/** rwk,
    /usr/sbin/nginx rm,
    network tcp,
    bind 80 tcp,
    bind 443 tcp,
    capability setuid,
    capability setgid,
}
EOF

apparmor_parser -r /etc/apparmor.d/usr.sbin.nginx
aa-enforce /usr/sbin/nginx
systemctl restart nginx
```

### 8.9.2 MySQL AppArmor配置

```bash
# 检查MySQL profile
ls /etc/apparmor.d/ | grep mysql

# 添加自定义路径
vi /etc/apparmor.d/usr.sbin.mysqld

# 重新加载
apparmor_parser -r /etc/apparmor.d/usr.sbin.mysqld
systemctl restart mysql
```

### 8.9.3 SSH AppArmor配置

```bash
# 检查SSH profile
ls /etc/apparmor.d/ | grep sshd

# 自定义配置允许用户主目录
vi /etc/apparmor.d/usr.sbin.sshd
# 添加：
# /home/*/ r,
# /home/*/.ssh/ r,

apparmor_parser -r /etc/apparmor.d/usr.sbin.sshd
systemctl restart sshd
```

## 8.10 AppArmor与SELinux深度对比

### 8.10.1 架构设计对比

SELinux使用内核安全子系统，通过扩展属性存储安全上下文。AppArmor使用路径匹配，不需要文件系统特殊支持。

### 8.10.2 选择建议

**选择SELinux：** 需要极高安全级别、细粒度控制、使用RHEL/CentOS、需要MLS功能。

**选择AppArmor：** 使用Debian/Ubuntu、需要简单配置、快速部署、只需保护特定应用。

## 8.11 禁用和启用安全模块

### 8.11.1 临时禁用/启用SELinux

```bash
setenforce 0  # Permissive
setenforce 1  # Enforcing
```

### 8.11.2 永久禁用/启用SELinux

```bash
vi /etc/selinux/config
# SELINUX=disabled
reboot
```

### 8.11.3 临时禁用/启用AppArmor

```bash
systemctl stop apparmor
systemctl disable apparmor
```## 8.12 实战案例：SELinux阻止服务运行的处理

### 8.12.1 场景描述

某管理员在CentOS服务器上安装了一个自定义Web应用程序，该程序需要读取/opt/custom_app/目录下的配置文件和资源文件。但是，Web服务器无法访问这些文件，查看日志发现是SELinux阻止了访问。

### 8.12.2 问题诊断

```bash
# 1. 检查Web服务器错误日志
tail -20 /var/log/httpd/error_log
# 发现：Permission denied: Could not open configuration file /opt/custom_app/conf/httpd.conf

# 2. 检查SELinux日志
ausearch -m avc -ts recent
# 发现AVC拒绝：
# avc: denied { read open } for pid=12345 comm="httpd" name="conf" 
# scontext=system_u:system_r:httpd_t:s0
# tcontext=system_u:object_r:default_t:s0

# 3. 使用sealert获取详细报告
sealert -a /var/log/audit/audit.log
```

### 8.12.3 问题解决

```bash
# 1. 设置正确的SELinux上下文
semanage fcontext -a -t httpd_sys_content_t "/opt/custom_app(/.*)?"
restorecon -Rv /opt/custom_app/

# 2. 如果需要网络访问
setsebool -P httpd_can_network_connect on

# 3. 重启Web服务
systemctl restart httpd

# 4. 验证
curl http://localhost/
```

### 8.12.4 预防措施

```bash
# 创建部署脚本包含SELinux配置
cat > /opt/custom_app/deploy.sh << 'EOF'
#!/bin/bash
APP_DIR="/opt/custom_app"
semanage fcontext -a -t httpd_sys_content_t "$APP_DIR(/.*)?" || true
restorecon -Rv $APP_DIR/
setsebool -P httpd_can_network_connect on 2>/dev/null || true
echo "Deployment completed."
EOF
chmod +x /opt/custom_app/deploy.sh
```

### 8.12.5 进阶：自定义SELinux策略模块

```bash
# 1. 收集AVC拒绝事件
ausearch -m avc -c httpd -o avc.log

# 2. 生成策略模块
audit2allow -M custom_httpd < avc.log

# 3. 安装模块
semodule -i custom_httpd.pp

# 4. 验证
semodule -l | grep custom_httpd
```## 8.13 数据库服务SELinux配置实战

### 8.13.1 MySQL SELinux配置详解

```bash
# 1. MySQL文件上下文配置
semanage fcontext -a -t mysqld_db_t "/data/mysql(/.*)?"
restorecon -Rv /data/mysql

# 2. MySQL日志文件上下文
semanage fcontext -a -t mysqld_log_t "/var/log/mysql(/.*)?"
restorecon -Rv /var/log/mysql

# 3. MySQL布尔值
setsebool -P mysql_connect_any off
setsebool -P mysql_read_bad_content on

# 4. MySQL端口配置
semanage port -a -t mysqld_port_t -p tcp 3307

# 5. 验证
ps auxZ | grep mysqld
```

### 8.13.2 PostgreSQL SELinux配置详解

```bash
# 1. PostgreSQL文件上下文
semanage fcontext -a -t postgresql_db_t "/data/postgresql(/.*)?"
restorecon -Rv /data/postgresql

# 2. PostgreSQL布尔值
setsebool -P postgresql_can_rsync on

# 3. PostgreSQL端口配置
semanage port -a -t postgresql_port_t -p tcp 5433

# 4. 验证
ps auxZ | grep postgres
```

### 8.13.3 Nginx与后端数据库连接

```bash
# 确保Nginx可以连接网络
setsebool -P httpd_can_network_connect on

# 如果使用unix socket
semanage fcontext -a -t httpd_sys_rw_content_t "/var/run/php-fpm(/.*)?"
restorecon -Rv /var/run/php-fpm
```

## 8.14 Web应用程序SELinux策略实战

### 8.14.1 Django应用SELinux配置

```bash
# 1. 安装必要的包
yum install -y httpd mod_wsgi python3-selinux

# 2. 设置文件上下文
semanage fcontext -a -t httpd_sys_content_t "/opt/myapp(/.*)?"
semanage fcontext -a -t httpd_sys_rw_content_t "/opt/myapp/media(/.*)?"
restorecon -Rv /opt/myapp

# 3. 配置布尔值
setsebool -P httpd_can_network_connect on
setsebool -P httpd_can_network_connect_db on

systemctl restart httpd
```

### 8.14.2 Node.js应用SELinux配置

```bash
# 1. 创建systemd服务
cat > /etc/systemd/system/nodeapp.service << 'EOF'
[Unit]
Description=Node.js Application
After=network.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=/opt/nodeapp
ExecStart=/usr/bin/node /opt/nodeapp/server.js
Restart=on-failure
EOF

# 2. 设置文件上下文
semanage fcontext -a -t var_t "/opt/nodeapp(/.*)?"
restorecon -Rv /opt/nodeapp

# 3. 启动服务
systemctl daemon-reload
systemctl enable nodeapp
systemctl start nodeapp
```

### 8.14.3 自定义Web应用通用配置模板

```bash
APP_NAME="myapp"
APP_DIR="/opt/${APP_NAME}"

mkdir -p ${APP_DIR}/{conf,html,logs,data}

semanage fcontext -a -t httpd_config_t "${APP_DIR}/conf(/.*)?"
semanage fcontext -a -t httpd_sys_content_t "${APP_DIR}/html(/.*)?"
semanage fcontext -a -t httpd_sys_rw_content_t "${APP_DIR}/data(/.*)?"

restorecon -R ${APP_DIR}
setsebool -P httpd_can_network_connect on
```## 8.15 本章小结

本章详细介绍了Linux的两个主要强制访问控制系统：SELinux和AppArmor。

SELinux部分涵盖了工作模式（Enforcing、Permissive、Disabled）、安全上下文的概念和管理、布尔值的配置、策略管理以及日志分析和故障排除方法。SELinux通过类型强制访问控制为系统提供细粒度的安全保护，是Red Hat系发行版的默认选择。

AppArmor部分介绍了其基于路径的访问控制模型、profile配置语法和管理工具。AppArmor的配置文件更加直观，易于理解和编写，适合Debian/Ubuntu系统使用。

两个系统各有特点：SELinux提供更细粒度的控制，但配置复杂；AppArmor配置简单，但控制粒度相对粗略。在实际生产环境中，应根据具体需求和发行版选择合适的安全模块，并正确配置以提供有效的安全保护。

## 8.16 思考题

1. SELinux的三种工作模式有什么区别？在什么场景下应该使用每种模式？

2. 请解释SELinux安全上下文的组成及其各部分的作用。

3. SELinux布尔值的作用是什么？请举例说明在实际工作中如何使用布尔值解决权限问题。

4. 当SELinux阻止某个服务访问特定文件时，应该如何快速诊断和解决问题？

5. AppArmor和SELinux在设计理念上有什么主要区别？各有何优缺点？

6. 请编写一个AppArmor profile，保护Nginx服务能够正常访问配置文件、网页内容和日志文件。

7. 如果一个Web应用程序被SELinux阻止访问/opt/webapp/目录下的文件，请列出完整的故障排除和处理步骤。

8. 在生产环境中，为什么应该谨慎禁用SELinux或AppArmor？有什么替代方案？

9. 请解释aa-complain和aa-enforce命令的作用，以及何时应该使用它们。

10. 如何将一个自定义的SELinux策略模块永久安装到系统中？请描述完整的过程。

11. 请比较MySQL和PostgreSQL在SELinux环境下的配置要点有何异同。

12. 在配置Django或Node.js等Web应用时，SELinux配置有哪些共同点和差异？## 8.17 SELinux策略分析工具详解

### 8.17.1 seinfo命令详解

seinfo是SELinux策略分析的核心工具，可以查看策略中的各种信息。

```bash
# 查看seinfo帮助
seinfo --help

# 查看所有用户
seinfo -u
# 输出示例：
# users: 4
#    staff_u
#    sysadm_u
#    unconfined_u
#    user_u

# 查看所有角色
seinfo -r
# 输出示例：
# roles: 5
#    auditadm_r
#    guest_r
#    staff_r
#    sysadm_r
#    user_r

# 查看所有类型
seinfo -t | head -30
# types: 2347

# 查看指定类型的详细信息
seinfo -t httpd_t -x

# 查看所有属性
seinfo -a | head -20

# 查看布尔值
seinfo -b | head -30

# 查看策略统计信息
seinfo
```### 8.17.2 sesearch命令详解

sesearch用于搜索策略规则，是分析访问权限的重要工具。

```bash
# 查找所有allow规则
sesearch --allow

# 查找httpd_t允许访问的规则
sesearch --allow -s httpd_t | head -30

# 查找httpd_t对httpd_sys_content_t的allow规则
sesearch --allow -s httpd_t -t httpd_sys_content_t

# 查找httpd_t对文件的allow规则
sesearch --allow -s httpd_t -t httpd_sys_content_t -c file

# 查找httpd_t对目录的allow规则
sesearch --allow -s httpd_t -t httpd_sys_content_t -c dir

# 查找所有类型转换规则
sesearch --type_transition

# 查找httpd_t的类型转换规则
sesearch --type_transition -s httpd_t

# 查找httpd_t到httpd_sys_content_t的类型转换
sesearch --type_transition -s httpd_t -t httpd_sys_content_t

# 查找所有审核规则
sesearch --audit

# 查找特定进程的审核规则
sesearch --audit -s httpd_t
```

## 8.18 SELinux日志分析高级技巧

### 8.18.1 ausearch高级用法

```bash
# 按时间范围搜索
ausearch -m avc -ts 10:00:00 -te 11:00:00

# 按日期搜索
ausearch -m avc -sd yesterday

# 按进程ID搜索
ausearch -m avc -p 1234

# 按inode搜索
ausearch -m avc -f /var/www/html/index.html

# 按结果搜索
ausearch -m avc -sr failed

# 按用户搜索
ausearch -m avc -ua 1000

# 按系统调用搜索
ausearch -m avc -sc open

# 输出格式选项
ausearch -m avc -i           # 解释数字为人类可读格式
ausearch -m avc -raw         # 输出原始格式
ausearch -m avc -json        # 输出JSON格式
```

### 8.18.2 aureport高级用法

```bash
# 生成AVC事件报告
aureport -a

# 生成认证报告
aureport -au

# 生成时间线报告
aureport -t

# 生成摘要报告
aureport -s

# 生成失败事件报告
aureport -f -i | grep denied

# 按用户生成报告
aureport -u -i

# 生成每日摘要
aureport -i -ts yesterday
```

## 8.19 AppArmor Profile高级配置

### 8.19.1 复杂Profile示例

```bash
# 生产级Nginx AppArmor Profile
cat > /etc/apparmor.d/usr.sbin.nginx << 'EOF'
#include <tunables/global>

/usr/sbin/nginx {
    #include <abstractions/base>
    #include <abstractions/nginx>
    #include <abstractions/ssl_certs>

    capability setuid,
    capability setgid,
    capability net_bind_service,
    capability chown,

    network inet stream,
    network inet6 stream,
    network unix stream,
    
    bind 80 stream,
    bind 443 stream,

    /etc/nginx/ r,
    /etc/nginx/** r,
    /etc/ssl/certs/** r,
    /etc/ssl/private/** r,

    /var/log/nginx/ r,
    /var/log/nginx/** rw,
    /var/cache/nginx/** rwk,
    /var/run/nginx.pid rw,

    /var/www/ r,
    /var/www/** r,

    /usr/sbin/nginx rm,
    /lib/x86_64-linux-gnu/**/*.so* r,

    signal (receive) set=(term,uparam) peer=/usr/sbin/nginx,
    ptrace (trace) peer=/usr/sbin/nginx,
}
EOF

apparmor_parser -r /etc/apparmor.d/usr.sbin.nginx
aa-enforce /usr/sbin/nginx
```

### 8.19.2 Profile调试技巧

```bash
# 1. 使用complain模式调试
aa-complain /etc/apparmor.d/usr.bin.myapp

# 2. 运行程序并触发日志
curl http://localhost/

# 3. 查看日志
tail -f /var/log/syslog | grep apparmor

# 4. 使用aa-logprof更新profile
aa-logprof

# 5. 重新加载并测试
apparmor_parser -r /etc/apparmor.d/usr.bin.myapp

# 6. 完成后切换到enforce模式
aa-enforce /etc/apparmor.d/usr.bin.myapp

# 查看profile状态
aa-status | grep myapp

# 测试profile语法
apparmor_parser -T /etc/apparmor.d/usr.bin.myapp
```

## 8.20 综合实战案例

### 8.20.1 LAMP环境SELinux配置

完整的LAMP（Linux + Apache + MySQL + PHP）环境SELinux配置实战。

```bash
# 1. 安装组件
yum install -y httpd httpd-tools mariadb-server php php-mysql selinux-policy selinux-policy-targeted

# 2. 设置Web内容SELinux上下文
semanage fcontext -a -t httpd_sys_content_t "/var/www(/.*)?"
semanage fcontext -a -t httpd_sys_rw_content_t "/var/www/html/uploads(/.*)?"
semanage fcontext -a -t httpd_log_t "/var/log/httpd(/.*)?"

# 3. 创建上传目录
mkdir -p /var/www/html/uploads
restorecon -Rv /var/www

# 4. 配置MySQL数据目录
mkdir -p /data/mysql
semanage fcontext -a -t mysqld_db_t "/data/mysql(/.*)?"
restorecon -Rv /data/mysql

# 5. 配置布尔值
setsebool -P httpd_can_network_connect on
setsebool -P httpd_can_sendmail off
setsebool -P httpd_enable_cgi on
setsebool -P mysql_read_bad_content on

# 6. 配置端口
semanage port -a -t http_port_t -p tcp 8080

# 7. 启动服务
systemctl enable httpd mariadb
systemctl start mariadb httpd

# 8. 测试
curl -I http://localhost/
mysql -u root -e "SELECT 1;"
```### 8.20.2 Node.js + PostgreSQL环境配置

```bash
# 1. 安装组件
yum install -y nodejs npm postgresql postgresql-server httpd mod_proxy_html selinux-policy selinux-policy-targeted

# 2. 创建Node.js应用
mkdir -p /opt/myapp
cat > /opt/myapp/server.js << 'EOF'
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello!'));
app.listen(3000);
EOF

# 3. 配置systemd服务
cat > /etc/systemd/system/nodeapp.service << 'EOF'
[Unit]
Description=Node.js Application
After=network.target postgresql.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/node /opt/myapp/server.js
Restart=on-failure
EOF

# 4. 设置文件上下文
semanage fcontext -a -t var_t "/opt/myapp(/.*)?"
restorecon -Rv /opt/myapp

# 5. 配置PostgreSQL
mkdir -p /data/postgresql
semanage fcontext -a -t postgresql_db_t "/data/postgresql(/.*)?"
restorecon -Rv /data/postgresql

postgresql-setup initdb
systemctl enable postgresql
systemctl start postgresql

# 6. 创建数据库
su - postgres -c "psql -c \"CREATE USER myuser WITH PASSWORD 'pass';\""
su - postgres -c "psql -c \"CREATE DATABASE mydb OWNER myuser;\""

# 7. 配置Apache反向代理
cat > /etc/httpd/conf.d/nodejs.conf << 'EOF'
ProxyPass /api http://localhost:3000/
ProxyPassReverse /api http://localhost:3000/
EOF

# 8. 配置布尔值
setsebool -P httpd_can_network_connect on
setsebool -P httpd_can_network_relay on
setsebool -P postgresql_can_rsync on

# 9. 启动服务
systemctl daemon-reload
systemctl enable nodeapp httpd
systemctl restart httpd
systemctl start nodeapp

# 10. 测试
curl http://localhost/
curl http://localhost/api
```

### 8.20.3 Nginx + PHP-FPM + MySQL环境配置

```bash
# 1. 安装组件
yum install -y nginx php-fpm php-mysqlnd mariadb-server selinux-policy selinux-policy-targeted

# 2. 配置PHP-FPM
cat > /etc/php-fpm.d/www.conf << 'EOF'
[www]
user = nginx
group = nginx
listen = /var/run/php-fpm.sock
listen.owner = nginx
listen.group = nginx
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
EOF

# 3. 配置Nginx
cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /var/www/html;
    index index.php index.html;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
EOF

# 4. 设置文件上下文
semanage fcontext -a -t httpd_sys_content_t "/var/www(/.*)?"
semanage fcontext -a -t httpd_sys_rw_content_t "/var/www/html/uploads(/.*)?"
semanage fcontext -a -t httpd_sys_rw_content_t "/var/run/php-fpm(/.*)?"
semanage fcontext -a -t httpd_log_t "/var/log/nginx(/.*)?"
semanage fcontext -a -t mysqld_db_t "/var/lib/mysql(/.*)?"

restorecon -Rv /var/www /var/log/nginx /var/run/php-fpm

# 5. 配置布尔值
setsebool -P httpd_can_network_connect on
setsebool -P httpd_can_network_relay on
setsebool -P mysql_read_bad_content on

# 6. 创建测试文件
mkdir -p /var/www/html/uploads
echo "<?php phpinfo(); ?>" > /var/www/html/index.php

# 7. 启动服务
systemctl enable nginx php-fpm mariadb
systemctl start mariadb nginx php-fpm

# 8. 测试
curl -I http://localhost/
curl http://localhost/index.php
ls -la /var/www/html/uploads/
```

### 8.20.4 多站点Web主机SELinux配置

```bash
# 场景：服务器托管多个独立网站，每个网站在自己的目录中

SITE1_DIR="/var/www/vhosts/site1.com"
SITE2_DIR="/var/www/vhosts/site2.com"
SITE3_DIR="/opt/apps/site3"

# 1. 创建目录结构
mkdir -p $SITE1_DIR/{html,uploads,logs}
mkdir -p $SITE2_DIR/{html,uploads,logs}
mkdir -p $SITE3_DIR/{public,data,logs}

# 2. 设置所有者
chown -R apache:apache $SITE1_DIR
chown -R nginx:nginx $SITE2_DIR
chown -R nodejs:nodejs $SITE3_DIR

# 3. 配置SELinux上下文
# Site1 - Apache
semanage fcontext -a -t httpd_sys_content_t "$SITE1_DIR/html(/.*)?"
semanage fcontext -a -t httpd_sys_rw_content_t "$SITE1_DIR/uploads(/.*)?"
semanage fcontext -a -t httpd_log_t "$SITE1_DIR/logs(/.*)?"

# Site2 - Nginx  
semanage fcontext -a -t httpd_sys_content_t "$SITE2_DIR/html(/.*)?"
semanage fcontext -a -t httpd_sys_rw_content_t "$SITE2_DIR/uploads(/.*)?"
semanage fcontext -a -t httpd_log_t "$SITE2_DIR/logs(/.*)?"

# Site3 - Node.js
semanage fcontext -a -t httpd_sys_content_t "$SITE3_DIR/public(/.*)?"
semanage fcontext -a -t httpd_sys_rw_content_t "$SITE3_DIR/data(/.*)?"
semanage fcontext -a -t httpd_log_t "$SITE3_DIR/logs(/.*)?"

# 4. 恢复上下文
restorecon -Rv $SITE1_DIR $SITE2_DIR $SITE3_DIR

# 5. 配置布尔值
setsebool -P httpd_can_network_connect on
setsebool -P httpd_can_sendmail off

# 6. 验证配置
ls -lZ $SITE1_DIR
ls -lZ $SITE2_DIR
ls -lZ $SITE3_DIR

# 7. 测试访问
curl -H "Host: site1.com" http://localhost/
curl -H "Host: site2.com" http://localhost/
curl http://localhost:3000/
```
## 8.21 常见问题与解决方案

### 8.21.1 SELinux常见问题

**问题1：VSFTPD无法访问用户主目录**

```bash
# 症状：FTP用户登录后无法访问自己的主目录
# 原因：FTP服务上下文不正确

# 解决
setsebool -P ftp_home_dir on
getsebool ftp_home_dir
```

**问题2：Samba共享无法访问**

```bash
# 症状：Windows客户端无法访问Samba共享
# 原因：SELinux阻止Samba访问

# 解决
setsebool -P samba_enable_home_dirs on
setsebool -P smbd_anon_write off

# 如果需要读写
setsebool -P samba_export_all_rw on
```

**问题3：NFS共享无法挂载**

```bash
# 症状：客户端挂载NFS失败
# 原因：SELinux阻止NFS访问

# 解决
setsebool -P nfs_export_all_ro on
setsebool -P nfs_export_all_rw on

# 如果使用autofs
setsebool -P autofs_use_nfs on
```

**问题4：Postfix无法接收邮件**

```bash
# 症状：邮件无法到达本地邮箱
# 原因：Postfix权限不足

# 解决
setsebool -P postfix_local_write_mail_spool on
```

**问题5：Cron任务无法执行**

```bash
# 症状：用户的cron任务不执行
# 原因：SELinux阻止cron访问用户文件

# 解决
setsebool -P cron_can_relabel on
setsebool -P domain_can_mmap_files on
```

**问题6：Git clone失败**

```bash
# 症状：SSH方式git clone失败
# 原因：SSH上下文不正确

# 解决
setsebool -P git_system_enable_homedirs on
```

### 8.21.2 AppArmor常见问题

**问题1：应用程序无法读取配置文件**

```bash
# 症状：应用启动失败，提示权限拒绝
# 原因：Profile未允许读取配置文件

# 解决
# 编辑profile，添加读取规则
vi /etc/apparmor.d/usr.bin.myapp
# 添加：/etc/myapp/*.conf r,

# 重新加载
apparmor_parser -r /etc/apparmor.d/usr.bin.myapp
```

**问题2：应用程序无法绑定特权端口**

```bash
# 症状：应用无法绑定80或443端口
# 原因：Profile未允许绑定端口

# 解决
# 编辑profile
vi /etc/apparmor.d/usr.bin.myapp
# 添加：bind 80 tcp,  或  bind 1024-65535 tcp,

apparmor_parser -r /etc/apparmor.d/usr.bin.myapp
```

**问题3：子进程无法访问网络**

```bash
# 症状：主进程正常但子进程无法连接网络
# 原因：未使用ix继承父profile权限

# 解决
# 编辑profile，使用ix执行子进程
/usr/bin/myapp ix,
```

## 8.22 安全加固检查清单

### 8.22.1 SELinux安全加固检查表

```bash
# 1. 确认SELinux状态
sestatus | grep "SELinux status"
# 应该显示：enabled

# 2. 确认运行模式
getenforce
# 生产环境应该显示：Enforcing

# 3. 检查策略类型
sestatus | grep "Loaded policy name"
# 应该显示：targeted 或 MLS

# 4. 检查文件上下文
matchpathcon -V /var/www/html/
# 确保所有文件都有正确的上下文

# 5. 检查日志中的拒绝事件
ausearch -m avc -ts recent | wc -l
# 数值应该很小或为0

# 6. 检查布尔值配置
getsebool -a | grep off | wc -l
# 确保必要的布尔值已启用

# 7. 定期审计
aureport -a -i
```

### 8.22.2 AppArmor安全加固检查表

```bash
# 1. 确认AppArmor状态
aa-status | grep "apparmor module is loaded"
# 应该显示：apparmor module is loaded

# 2. 检查enforce模式的profile数量
aa-status --enforced | grep -c "enforce"
# 应该有合理数量的profile处于enforce模式

# 3. 检查profile语法
apparmor_parser -T /etc/apparmor.d/*
# 确保没有语法错误

# 4. 检查日志中的拒绝事件
tail -100 /var/log/syslog | grep apparmor | grep denied
# 应该没有或很少

# 5. 定期更新profile
aa-logprof
```

## 8.23 附录：SELinux与AppArmor命令速查表

### SELinux常用命令

| 命令 | 功能 |
|------|------|
| getenforce | 查看当前模式 |
| setenforce 0/1 | 临时切换模式 |
| sestatus | 查看详细状态 |
| ls -Z | 查看文件上下文 |
| ps auxZ | 查看进程上下文 |
| id -Z | 查看用户上下文 |
| chcon | 临时修改上下文 |
| restorecon | 恢复默认上下文 |
| semanage fcontext | 管理文件默认上下文 |
| getsebool | 查看布尔值 |
| setsebool -P | 设置布尔值（永久） |
| ausearch | 搜索审计日志 |
| audit2why | 分析拒绝原因 |
| audit2allow | 生成策略模块 |
| sealert | SELinux诊断工具 |
| semodule | 管理策略模块 |

### AppArmor常用命令

| 命令 | 功能 |
|------|------|
| aa-status | 查看状态 |
| aa-enforce | 启用强制模式 |
| aa-complain | 启用投诉模式 |
| aa-logprof | 更新profile |
| aa-genprof | 生成profile |
| apparmor_parser | 加载profile |
| aa-report | 生成报告 |