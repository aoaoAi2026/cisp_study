# 第三章 Linux系统日志分析

> 第3章 | 50页

3.1 Linux日志体系

主要日志文件：
- /var/log/syslog：系统主日志（Debian/Ubuntu）
- /var/log/messages：系统主日志（CentOS/RHEL）
- /var/log/auth.log：认证日志（Debian/Ubuntu）
- /var/log/secure：安全日志（CentOS/RHEL）
- /var/log/nginx/：Nginx日志
- /var/log/apache2/：Apache日志
- /var/log/cron：计划任务日志
- /var/log/btmp：失败登录记录
- /var/log/wtmp：登录记录
- /var/run/utmp：当前登录用户

3.2 认证日志分析

关键字段：
- 时间戳
- 主机名
- 进程名/ID
- 认证结果
- 用户名
- 源IP
- 认证方式

SSH登录分析：
- 成功登录：Accepted password for ... from ...
- 失败登录：Failed password for ... from ...
- 非法用户：Invalid user ... from ...
- 端口扫描：Connection closed by authenticating user ...

分析技巧：
- 统计失败登录IP Top N
- 统计被暴力破解的账号
- 查找异常时间登录
- 查找异常地点登录

3.3 历史命令分析

- ~/.bash_history：Bash历史
- ~/.zsh_history：Zsh历史
- history命令查看
- 历史命令时间戳设置
- 不可删除的历史记录

3.4 系统痕迹分析

- 进程分析：ps、top
- 网络连接：netstat、ss
- 端口监听：lsof -i
- 启动项：systemd、init.d、rc.local
- 计划任务：crontab、cron.d
- 服务：systemctl list-units --type=service
- 内核模块：lsmod
- 后门排查：rkhunter、chkrootkit
