# Windows / Linux 入侵排查实战手册

---

## 一、黄金响应流程 (黄金 24 小时)

```
Step 1. 事件确认
  - 告警源: IDS/IPS / WAF / SIEM / EDR / 内部举报 / 外部通报
  - 确认是否真实入侵, 避免误报 (False Positive)
  - 冻结可疑账号 + 隔离可疑主机 (断网/快照)

Step 2. 现场保护 (重中之重)
  - 不要立刻关机 (内存数据丢失)
  - 先做内存镜像: DumpIt / FTK Imager / LiME
  - 再做磁盘镜像: dd / FTK / xcopy + 校验 hash
  - 保存网络流量: tcpdump / Wireshark 抓包

Step 3. 快速范围评估
  - 同一账号登录的其它主机?
  - 横向扫描 (SMB/RDP/WinRM) 痕迹?
  - 同一 C2 IP / 同一 Payload 其它主机?

Step 4. 入侵路径重建 (Timeline)
  - 入口点: 钓鱼邮件 / 漏洞利用 / 弱口令
  - 首次成功执行: 时间、账号、进程
  - 后续行为: 横向、权限维持、数据窃取、破坏

Step 5. 清除/恢复 (仅在取证完毕后执行)
  - 清除后门 / webshell / 计划任务
  - 重置所有被泄密码
  - 打补丁 / 更新版本 / 恢复数据
  - 增强监控: 7×24 观察是否回退

Step 6. 报告 + 复盘
  - 事件报告 (时间轴、攻击链、影响面、已采取措施)
  - 内部复盘: 为什么被入侵? 为什么没提前发现? 如何改进?
  - 合规通报: 等保 / GDPR / PIPL 要求的主管部门报备
```

## 二、Windows 入侵排查清单

### 2.1 账号与登录事件

```powershell
# 1. 查看本地用户, 特别关注 Administrators 组成员
net user
net localgroup administrators
Get-LocalUser | Where-Object {$_.Enabled -eq $true}
Get-LocalGroupMember -Group "Administrators"

# 2. 隐藏用户 (用户名带 $)
Get-WmiObject -Class Win32_UserAccount | Select-Object Name, Disabled, Status

# 3. 登录日志 (需安全日志已启用)
# 事件 ID 4625 = 登录失败; 4624 = 登录成功; 4672 = 管理员登录; 4776 = NTLM 认证; 4720 = 创建账号
wevtutil qe Security /q:"*[System/EventID=4624]" /c:20 /f:text
Get-WinEvent -LogName Security | Where-Object {$_.Id -eq 4625} | Select -First 10 | Format-List

# 4. RDP 登录痕迹: 查看 TerminalServices-LocalSessionManager/Operational.evtx
Get-WinEvent -LogName Microsoft-Windows-TerminalServices-LocalSessionManager/Operational | Select -First 20
# 事件 ID 21 (登录成功) + 23 (注销)

# 5. 最近登录的 RDP IP (注册表与事件日志)
reg query "HKCU:\Software\Microsoft\Terminal Server Client\Servers" /s
Get-ChildItem -Path "HKCU:\Software\Microsoft\Terminal Server Client\Servers" -Recurse
```

### 2.2 进程 / 服务 / 计划任务

```powershell
# 1. 异常进程 (关注: 无签名/路径异常/父进程异常)
Get-Process | Select-Object Id, Name, Path, Company | Format-Table -AutoSize
# 重点排查: powershell.exe -enc / cmd /c "..." / regsvr32 / mshta / rundll32 / msiexec / wscript

# 2. wmic 列出进程 + 命令行
wmic process get ProcessID, ParentProcessID, Name, CommandLine /format:list
# Get-CimInstance Win32_Process | Select Name, ProcessId, ParentProcessId, CommandLine

# 3. 可疑服务
Get-Service | Where-Object {$_.Status -eq "Running" -and $_.StartType -ne "Disabled"} | Sort StartType
# 关注: 随机名服务、第三方厂商、路径指向临时目录

# 4. 计划任务 (Persistence)
schtasks /query /fo LIST /v
Get-ScheduledTask | Select TaskName, State, Author, Description
# 关注: 以 SYSTEM 权限运行、奇怪的任务名、执行 powershell/rundll32

# 5. 启动项
wmic startup get caption, command, user
Get-CimInstance -ClassName Win32_StartupCommand | Select Name, Command, Location, User

# 6. 驱动 (Rootkit 排查)
driverquery /v | findstr /i "unknown"
fltmc filters   # 过滤驱动 (Minifilter), 常被勒索软件使用
```

### 2.3 网络连接

```powershell
# 1. 查看当前网络连接 (关注 ESTABLISHED 到外部 IP)
netstat -ano
# Get-NetTCPConnection -State Established | Select LocalAddress, LocalPort, RemoteAddress, RemotePort, State, OwningProcess

# 2. 对应 PID 的进程名
Get-Process -Id <PID> | Select Name, Path, StartTime

# 3. 代理配置 (攻击者常设置代理隐藏)
reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyServer
reg query "HKLM\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyServer

# 4. 查看已建立的 SMB 会话 (横向)
net session
net use
Get-SmbSession
```

### 2.4 文件与注册表 (Persistence)

```powershell
# 1. 最近修改的可执行文件 (按时间排序)
Get-ChildItem C:\ -Include *.exe,*.dll,*.ps1,*.bat,*.vbs,*.js -Recurse -ErrorAction SilentlyContinue |
    Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) } |
    Sort-Object LastWriteTime -Descending | Select -First 50 FullName, LastWriteTime, Length

# 2. 临时目录 / 下载目录
ls C:\Users\*\AppData\Local\Temp\*
ls C:\Windows\Temp\*
ls C:\Users\*\Downloads\*
ls C:\ProgramData\*

# 3. 浏览器历史 + 下载记录 (钓鱼入口)
# Chrome: %LocalAppData%\Google\Chrome\User Data\Default\History (SQLite)
# Edge  : %LocalAppData%\Microsoft\Edge\User Data\Default\History
# IE    : PowerShell Get-ItemProperty "HKCU:\Software\Microsoft\Internet Explorer"

# 4. 注册表 Run 键 (常见 Persistence)
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Run"
Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
Get-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer\Run"
Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Windows\Load"

# 5. Image File Execution Options (调试器劫持)
Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options" -Recurse

# 6. WMI 事件订阅 (WMI Persistence)
Get-CimInstance -Namespace root\subscription -ClassName __EventFilter
Get-CimInstance -Namespace root\subscription -ClassName CommandLineEventConsumer
Get-CimInstance -Namespace root\subscription -ClassName __FilterToConsumerBinding
```

### 2.5 日志分析

```powershell
# Windows 事件日志 (Event Log) 常见 Event ID
#    4624 登录成功 / 4625 登录失败 / 4634 注销
#    4672 使用特殊权限登录 (登录到管理员)
#    4698/4699/4700/4701/4702 创建/删除/修改计划任务
#    4720 创建用户 / 4726 删除用户 / 4732 加入本地组
#    4688 进程创建 / 4689 进程结束 (需开启审核)
#    5140 网络共享对象被访问 (SMB)
#    5145 检查共享目录访问 (可看到 \\\\C$、ADMIN$ 等横向行为)
#    104  日志被清除 (攻击者擦除痕迹)
#    7045 服务安装 (很多 PSEXEC 横向会产生)

# 关键日志文件位置:
#   %SystemRoot%\System32\winevt\Logs\Security.evtx
#   %SystemRoot%\System32\winevt\Logs\System.evtx
#   %SystemRoot%\System32\winevt\Logs\Application.evtx
#   PowerShell:
#     Microsoft-Windows-PowerShell/Operational (事件 ID 4103/4104 = 脚本块日志)
#     Microsoft-Windows-PowerShell/Analytic    (需启用, 事件 ID 53504)

# 7. 分析示例: 过滤最近 1 小时登录失败
Get-WinEvent -LogName Security -MaxEvents 1000 |
    Where-Object {$_.Id -eq 4625 -and $_.TimeCreated -gt (Get-Date).AddHours(-1)} |
    Format-List TimeCreated, Message

# 8. 使用 Sysmon (强烈推荐部署, 能大幅提升事件可见度)
#    事件 ID 1=进程创建 / 3=网络连接 / 6=驱动加载 / 7=镜像加载 / 8=远程线程创建 / 11=文件创建 / 15=FileCreateStreamHash / 255=错误
wevtutil qe Microsoft-Windows-Sysmon/Operational /q:"*[System/EventID=1]" /c:50 /f:text
```

## 三、Linux 入侵排查清单

### 3.1 账号与 SSH 登录

```bash
# 1. 当前登录用户
who
w
last | head -50            # 最近登录记录 (btmp = 失败登录, wtmp = 成功, utmp = 当前)
lastb | head -50           # 失败登录
lastlog                    # 每个账号最近一次登录

# 2. 异常用户 (UID=0 除 root 外; 无 home 目录; shell 非 /usr/sbin/nologin 的服务账号)
cat /etc/passwd
awk -F: '$3 == 0 {print $1}' /etc/passwd
awk -F: '($7 != "/usr/sbin/nologin" && $7 != "/bin/false") {print $1, $7}' /etc/passwd

# 3. 排查可疑账号 (无口令、空密码、非首次登录时创建)
cat /etc/shadow | grep -v "!\|*"   # 有密码的账号 (!/锁定, * 禁用)
awk -F: '$2 == "" {print $1}' /etc/shadow  # 空密码

# 4. SSH 授权密钥
cat ~/.ssh/authorized_keys
cat /home/*/.ssh/authorized_keys
ls -la /root/.ssh/ /home/*/.ssh/
# 关注: 未知公钥、writeable 文件 (权限 > 600)

# 5. sshd_config
grep -E "PermitRootLogin|PasswordAuth|Pubkey|Port|AllowUsers|DenyUsers|PermitEmpty" /etc/ssh/sshd_config
# 历史登录 IP
grep "Accepted" /var/log/auth.log /var/log/secure 2>/dev/null | tail -50
grep "Failed" /var/log/auth.log /var/log/secure 2>/dev/null | tail -50
```

### 3.2 进程与 CPU/内存异常

```bash
# 1. 全量进程树
ps auxf
ps -efL | head -100    # 显示线程 (很多挖矿木马用多线程)
# 关注: CPU 持续高占用、奇怪的命令行参数 (如 /tmp/.x/./a)、名字与系统进程相似 (sshd-new, kthreadX)

# 2. 可疑进程路径 (关注 /tmp / /dev/shm / /var/tmp / 用户目录下的可执行)
ls -la /tmp/
ls -la /dev/shm/
ls -la /var/tmp/
ls -la /home/*/
ls -la /root/

# 3. 查看进程可执行路径是否存在 (挖矿木马常自我删除)
ls -la /proc/<PID>/exe      # 若显示 "deleted" 即进程已在磁盘删除 (典型木马特征)
ls -la /proc/<PID>/cwd      # 当前工作目录
cat /proc/<PID>/cmdline | tr '\0' ' '

# 4. 矿池地址网络探测
ss -antp | grep -i established
netstat -antp
# 关注: 连接 stratum+tcp:// / mining 常见端口 (3333, 8899, 14444, 25565 等)
# 挖矿木马进程常调用 curl/wget 拉取脚本

# 5. 异常 CPU 占用 (矿机最显著特征)
top -bn1 | head -20
htop
atop
```

### 3.3 计划任务与开机自启 (Persistence)

```bash
# 1. cron 任务
crontab -l
ls -la /var/spool/cron/
cat /etc/crontab
ls -la /etc/cron.d/
ls -la /etc/cron.hourly/
ls -la /etc/cron.daily/
ls -la /etc/cron.weekly/
ls -la /etc/cron.monthly/
# 关注: curl/wget 拉脚本、奇怪的 sh 路径、@reboot 一次性启动项

# 2. init 脚本 / systemd unit
ls -la /etc/init.d/
ls -la /etc/rc*.d/
systemctl list-unit-files --type=service
systemctl list-timers
# 关注: 随机名服务 (如 systemd-update-daily.service 伪造)、ExecStart 指向 /tmp、URL

# 3. profile 劫持 (每次用户登录执行)
cat /etc/profile
cat /etc/bash.bashrc
cat /etc/profile.d/*.sh
cat ~/.bashrc
cat ~/.bash_profile
cat ~/.profile
# 典型: alias ssh="ssh + 记录口令"、每次登录执行 curl 脚本

# 4. LD_PRELOAD / /etc/ld.so.preload (Rootkit 共享库注入)
cat /etc/ld.so.preload
ls -la /etc/ld.so.preload
# 如果这个文件存在且不是常规配置, 可能是 rootkit

# 5. /etc/rc.local / /etc/init.d/rc*.d 自定义启动脚本
cat /etc/rc.local
ls -la /etc/rc.local
# rc.local 中不应有网络脚本、下载、异常命令
```

### 3.4 网络异常流量

```bash
# 1. 当前连接
ss -antp            # 比 netstat 更快
netstat -antp
# 关注: ESTABLISHED 到外部 IP, 特别是非 80/443 的端口

# 2. 出口方向
iptables -L -n -v
ip6tables -L -n -v
# 关注: 防火墙规则是否被篡改、是否有接受所有包的规则

# 3. sniffer 模式检测 (可疑 promisc)
ip link show
# 网卡若显示 "PROMISC" 可能有抓包程序运行

# 4. 抓包 (如果可以)
tcpdump -i any -w capture.pcap -s 0
# 5 分钟后 Ctrl+C, 用 Wireshark 离线分析
# 关注: DNS 查询 (C2)、大量 POST / 心跳包、非标准端口 SMB

# 5. DNS 查询异常
cat /etc/resolv.conf
# 检查 nameserver 是否被改为未知 DNS
cat /etc/hosts
# 是否有恶意静态解析记录
```

### 3.5 文件系统与可疑可执行

```bash
# 1. 最近修改的文件 (按时间排序, 过滤配置)
find /etc /usr/bin /usr/sbin /bin /sbin /tmp /dev/shm /var/tmp /root -mtime -3 -type f 2>/dev/null | head -100

# 2. SUID/SGID 文件 (攻击者常设置)
find / -type f \( -perm -4000 -o -perm -2000 \) 2>/dev/null | head -30

# 3. 可写的系统目录
find / -type d \( -perm -o+w -o -perm -g+w \) -not -path "/proc/*" -not -path "/sys/*" 2>/dev/null

# 4. Web 目录中的 webshell (PHP/JSP/ASPX/纯代理)
find /var/www -type f -name "*.php" -mtime -14 2>/dev/null | xargs grep -l "eval\|assert\|system\|shell_exec\|passthru\|preg_replace.*\/e" 2>/dev/null | head -20
find /usr/share/nginx -type f -name "*.jsp" 2>/dev/null

# 5. 检查二进制完整性 (如被替换的 sshd / su / ps)
rpm -Va     # RPM 系统 (RHEL/CentOS)
dpkg -V     # Debian/Ubuntu
# 重点关注 "5" 标志 = MD5 已变

# 6. webshell 常见特征 (grep 关键函数)
# PHP: eval, assert, system, exec, shell_exec, passthru, preg_replace(/e), `反引号`, include
# JSP: Runtime.getRuntime().exec, ProcessBuilder, FileWriter
# ASPX: System.Diagnostics.Process.Start, Request.Form, WriteFile
```

### 3.6 关键日志

```bash
# 1. auth 日志 (SSH/sudo/su 等)
tail -n 200 /var/log/auth.log       # Debian/Ubuntu
tail -n 200 /var/log/secure         # RHEL/CentOS

# 2. 系统日志
tail -n 200 /var/log/syslog
tail -n 200 /var/log/messages
journalctl -xe --since "1 hour ago"

# 3. Web 访问日志 (定位 webshell 入口)
tail -n 200 /var/log/nginx/access.log
tail -n 200 /var/log/httpd/access_log
grep -E "(cmd=|exec=|shell=|pass=|eval\(|upload)" /var/log/*log | head -50

# 4. sudo 审计
grep "sudo" /var/log/auth.log /var/log/secure | tail -50

# 5. bash 历史 (简单但常被攻击者擦除)
cat /root/.bash_history
cat /home/*/.bash_history
# 关注: wget / curl 拉木马、chmod +x、base64 decode、echo ... | sh、ssh 批量登录

# 6. history 被清空的替代方案:
#    使用 auditd + 规则, 或 zsh/bash PROMPT_COMMAND 日志
cat /etc/bashrc | grep HIST
cat /root/.bashrc  | grep HIST
ls -la /var/log/audit/audit.log
```

## 四、快速执行脚本模板

将以下命令封装为 shell / ps1 脚本, 作为应急第一时间跑出报告:

```bash
# for Linux
echo "[+] Current users:" && who
echo "[+] Recent logins:" && last -n 20
echo "[+] UID=0 users:" && awk -F: '$3==0' /etc/passwd
echo "[+] Cron jobs:" && (crontab -l; ls -la /etc/cron.d/; ls -la /var/spool/cron/) 2>&1
echo "[+] Listening ports:" && ss -antlp
echo "[+] /tmp files:" && ls -lat /tmp/ | head -30
echo "[+] SUID files:" && find / -perm -4000 2>/dev/null | head -30
echo "[+] ld.so.preload:" && cat /etc/ld.so.preload 2>/dev/null
echo "[+] Recent modified files:" && find /etc -mtime -3 -type f 2>/dev/null
echo "[+] .bash_history:" && tail -50 /root/.bash_history 2>/dev/null
```

```powershell
# for Windows
Write-Host "[+] Local admins:" -ForegroundColor Green
Get-LocalGroupMember -Group "Administrators"

Write-Host "[+] Recent logon events (4624):" -ForegroundColor Green
Get-WinEvent -FilterHashtable @{LogName="Security"; ID=4624} -MaxEvents 20 |
    Select TimeCreated, @{n='User';e={$_.Properties[5].Value}},
           @{n='IP';e={$_.Properties[18].Value}} | Format-Table -AutoSize

Write-Host "[+] Listening ports:" -ForegroundColor Green
Get-NetTCPConnection -State Listen | Select LocalAddress, LocalPort, OwningProcess, State

Write-Host "[+] Scheduled tasks:" -ForegroundColor Green
Get-ScheduledTask | Where TaskName -like "*" | Select TaskName, State, Author | Format-Table

Write-Host "[+] Recent created files (last 24h, c:\windows\ and c:\users\):"
Get-ChildItem -Path C:\Users,C:\Windows -Recurse -ErrorAction SilentlyContinue |
    Where {$_.LastWriteTime -gt (Get-Date).AddDays(-1) -and $_.Extension -in ".exe",".ps1",".bat",".dll"} |
    Select -First 30 FullName, LastWriteTime, Length
```

## 五、CheckList (每次应急按顺序执行)

- [ ] **冻结现场**: 立即隔离主机, 但不要关机 (保留内存)
- [ ] **取证**: 内存 dump + 磁盘镜像 + 流量抓包 + hash 校验
- [ ] **账号**: 排查可疑账号 / 新增账号 / 管理员组成员 / SSH 公钥
- [ ] **登录日志**: 成功/失败登录、RDP/SSH 暴力破解源 IP
- [ ] **进程**: ps auxf / Get-Process, 关注无签名、路径异常、CPU 高占用
- [ ] **网络**: ESTABLISHED 外部 IP、监听端口、代理配置、DNS hosts
- [ ] **持久化**: cron / 计划任务 / Run 注册表 / WMI / systemd unit / rc.local
- [ ] **文件**: /tmp, /dev/shm, Web 目录, 最近修改文件, SUID
- [ ] **日志**: Sysmon/Security.evtx, auth.log, bash_history, web access/error log
- [ ] **清理**: 清除 webshell/木马/计划任务, 重置被泄账号密码, 打补丁
- [ ] **监控**: 增强 7×24 监控, 观察是否再次被入侵
- [ ] **报告**: 时间轴、攻击链、影响面、证据、整改建议
