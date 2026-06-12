# Windows / Linux 入侵排查实战手册

---

## 📋 目录

1. [入侵排查黄金流程](#一排查流程)
2. [Windows 入侵排查](#二windows排查)
3. [Linux 入侵排查](#三linux排查)
4. [Webshell 排查](#四webshell排查)
5. [勒索病毒排查](#五勒索排查)
6. [完整案例](#六完整案例)

---

## 一、排查流程

```
入侵排查黄金流程（收到告警后）：

Phase 1: 现场保护(10分钟)
  ✓ 勿重启/关机（内存证据会丢失！）
  ✓ 网络隔离（安全组/防火墙隔离，不断网可远程取证）
  ✓ 镜像取证（有条件：磁盘快照+内存dump）

Phase 2: 快速排查(30分钟)
  → 异常用户 → 异常进程 → 网络连接 → 自启动 → 日志

Phase 3: 深度分析(2-4小时)
  → 后门排查 → 持久化 → 横向移动痕迹 → 数据泄露

Phase 4: 清除与加固(4-8小时)
  → 清除恶意软件 → 修复漏洞 → 加固系统 → 恢复上线
```

---

## 二、Windows 排查

### 2.1 异常用户

```powershell
# 1. 查看所有用户
net user
Get-LocalUser | Select Name,Enabled,LastLogon

# 2. 查看管理员组
net localgroup Administrators
# → 是否有可疑的隐藏管理员？

# 3. 查看最近登录
# 安全日志 Event ID 4624 (登录成功), 4625 (登录失败)
Get-WinEvent -LogName Security -MaxEvents 50 | 
  Where-Object {$_.Id -eq 4624} | 
  Select TimeCreated, 
    @{n='User';e={$_.Properties[5].Value}},
    @{n='IP';e={$_.Properties[18].Value}}

# 4. 查看当前登录会话
query session
qwinsta
```

### 2.2 异常进程

```powershell
# 1. 查看所有进程
Get-Process | Select Name,Id,CPU,StartTime | Sort StartTime -Desc | Select -First 20

# 2. 查看进程树（找可疑父子关系）
# Explorer.exe → cmd.exe → powershell.exe ← 可疑!
Get-CimInstance Win32_Process | 
  Select ProcessId,Name,ParentProcessId,
    @{n='Parent';e={(Get-Process -Id $_.ParentProcessId -ErrorAction SilentlyContinue).Name}}

# 3. 查看进程命令行（找编码的PowerShell/可疑参数）
Get-WmiObject Win32_Process | 
  Select Name,ProcessId,CommandLine |
  Where-Object {$_.CommandLine -like "*powershell*" -and $_.CommandLine -like "*-e*"}

# 4. 可疑进程特征:
# - 名称模仿系统进程(svch0st.exe, 1sass.exe)
# - 路径在 Temp/Users/Public/
# - 无数字签名
# - 父进程可疑(word→powershell, java→cmd)
```

### 2.3 网络连接

```powershell
# 1. 所有网络连接
netstat -ano | findstr ESTABLISHED

# 2. 进程-端口映射
Get-NetTCPConnection | 
  Select LocalAddress,LocalPort,RemoteAddress,RemotePort,State,
    @{n='Process';e={(Get-Process -Id $_.OwningProcess).ProcessName}}

# 3. 查找外网连接(排除内网)
Get-NetTCPConnection | Where-Object {
  $_.RemoteAddress -notlike "10.*" -and
  $_.RemoteAddress -notlike "192.168.*" -and
  $_.RemoteAddress -notlike "172.16.*" -and
  $_.RemoteAddress -notlike "127.*"
} | Select RemoteAddress,RemotePort,OwningProcess

# 4. DNS 缓存（找C2域名）
ipconfig /displaydns | findstr "Record"
```

### 2.4 持久化检查

```powershell
# 1. 注册表自启动
reg query HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run

# 2. 计划任务
schtasks /query /fo LIST /v | findstr /i "exe"
# 检查: 名称可疑/高频触发/路径在TEMP

# 3. 服务
Get-Service | Where-Object {$_.StartType -eq "Automatic"} |
  Select Name,DisplayName,Status |
  Where-Object {$_.Name -notlike "Win*" -and $_.Name -notlike "Microsoft*"}

# 4. WMI 事件订阅
Get-WmiObject -Namespace root\subscription -Class __EventFilter
Get-WmiObject -Namespace root\subscription -Class CommandLineEventConsumer

# 5. 启动文件夹
dir "C:\Users\*\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\*"
dir "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup\*"
```

### 2.5 日志分析

```powershell
# 安全日志 Top 10 事件
Get-WinEvent -LogName Security -MaxEvents 1000 |
  Group-Object Id | Sort Count -Desc | Select -First 10

# 账户锁定(4740)
Get-WinEvent -LogName Security -FilterXPath "*[System[EventID=4740]]" -MaxEvents 20 |
  Select TimeCreated, @{n='User';e={$_.Properties[0].Value}}

# Kerberos 异常(4769 — TGS请求)
# 大量4769 → 可能 Kerberoasting
Get-WinEvent -LogName Security -FilterXPath "*[System[EventID=4769]]" -MaxEvents 100

# DCSync检测(4662)
Get-WinEvent -LogName Security -FilterXPath "*[System[EventID=4662]]" -MaxEvents 20
```

---

## 三、Linux 排查

### 3.1 异常用户

```bash
# 1. 查看可登录用户
cat /etc/passwd | grep -v nologin | grep -v false

# 2. UID 0 的用户(root之外的)
awk -F: '($3 == 0) {print $1}' /etc/passwd

# 3. 最近登录
last -20
lastlog

# 4. 当前登录
who
w

# 5. 登录失败记录
lastb -20
cat /var/log/btmp | strings | tail -20

# 6. 检查 sudo 历史
cat /var/log/auth.log | grep sudo | tail -50
```

### 3.2 异常进程

```bash
# 1. 进程树（关注CPU/内存异常高的进程）
ps auxf

# 2. CPU Top 10
ps aux --sort=-%cpu | head -11

# 3. 隐藏进程检测
# 比较ps和/proc
ps -ef | awk '{print $2}' > ps_pids.txt
ls /proc/ | grep -E '^[0-9]+$' > proc_pids.txt
diff ps_pids.txt proc_pids.txt
# → 有差异: 可能存在隐藏进程(需进一步排查Rootkit)

# 4. 可疑进程特征:
# - 名称奇怪或随机字符串
# - 在 /tmp, /dev/shm, /var/tmp 执行
# - 网络连接异常
cat /proc/<PID>/cmdline | tr '\0' ' '  # 命令行
ls -l /proc/<PID>/exe                     # 可执行文件
cat /proc/<PID>/environ | tr '\0' '\n'    # 环境变量
```

### 3.3 网络连接

```bash
# 1. 所有监听端口
netstat -tlnp || ss -tlnp

# 2. 所有建立连接
netstat -antp | grep ESTABLISHED || ss -antp | grep ESTAB

# 3. 查找外网连接
ss -antp | grep -v "127.0.0.1\|10\.\|192\.168\.\|172\.16"
# 关注: 连接到境外IP / 非标准端口 / 短周期连接

# 4. DNS 查询历史
# systemd-resolved
journalctl -u systemd-resolved --since "24 hours ago" | grep "question"
```

### 3.4 持久化

```bash
# 1. Crontab
crontab -l
cat /etc/crontab
ls -la /etc/cron.*/
ls -la /var/spool/cron/

# 2. Systemd 服务
systemctl list-units --type=service --state=running | grep -v "^●"
find /etc/systemd/system/ -name "*.service" -newer /etc/passwd

# 3. SSH authorized_keys
cat ~/.ssh/authorized_keys
cat /root/.ssh/authorized_keys

# 4. .bashrc / .profile
grep -rn "curl\|wget\|nc\|bash" ~/.bashrc ~/.profile /etc/profile 2>/dev/null

# 5. 最近修改的文件(找后门)
find / -type f -mtime -1 -not -path "/proc/*" -not -path "/sys/*" 2>/dev/null |
  grep -v "/var/log\|/var/cache"
```

### 3.5 Rootkit 检测

```bash
# 安装检测工具
apt install chkrootkit rkhunter -y

chkrootkit
rkhunter --check --skip-keypress

# 常见 Rootkit 特征:
# - lsmod 看不到的内核模块
# - /proc 中的隐藏PID
# - 命令被替换(ls/ps/netstat等)
# - 异常的 SUID 文件
find / -perm -4000 -type f -newer /bin/bash 2>/dev/null
```

---

## 四、Webshell 排查

```bash
# === 1. 基于时间的查找 ===
# 查找最近24小时创建/修改的PHP文件
find /var/www/ -name "*.php" -mtime -1

# === 2. 关键字搜索 ===
# 搜索常见Webshell特征
grep -rn "eval(" /var/www/ --include="*.php" 2>/dev/null
grep -rn "base64_decode" /var/www/ --include="*.php" 2>/dev/null
grep -rn "system(" /var/www/ --include="*.php" 2>/dev/null
grep -rn "exec(" /var/www/ --include="*.php" 2>/dev/null
grep -rn "assert(" /var/www/ --include="*.php" 2>/dev/null
grep -rn "shell_exec" /var/www/ --include="*.php" 2>/dev/null
grep -rn "\$_POST\[" /var/www/ --include="*.php" 2>/dev/null

# === 3. 工具扫描 ===
# D盾(Windows) — 最强免费Webshell查杀
# 河马Webshell扫描器
# find /var/www/ -name "*.php" | xargs -I {} clamscan {}

# === 4. 图片马检测 ===
# 找非标准图片路径下的图片文件
find /var/www/uploads/ -name "*.jpg" -exec file {} \; | grep -v "JPEG\|PNG\|GIF"
```

---

## 五、勒索排查

```
勒索病毒典型特征:
  ✓ 文件后缀被改为 .encrypted, .lockbit, .xxx等
  ✓ 出现勒索信(README.txt, HOW_TO_DECRYPT.html)
  ✓ 壁纸被修改为勒索信息
  ✓ 大量文件在短时间内被修改(CreateTime 集中)

排查步骤:
  ① 立即物理断网 / 防火墙隔离
  ② 确认感染时间(文件修改时间窗口)
  ③ 分析样本(上传到VirusTotal / ID Ransomware)
  ④ 确认勒索家族 → 查找解密工具
  ⑤ 评估备份可用性 → 优先恢复
  ⑥ 排查入侵入口(弱口令/漏洞/钓鱼)
```

---

## 六、完整案例

```
场景: 某企业内网服务器 CPU 100%

Phase 1: 发现
  Zabbix告警: 服务器CPU持续100%

Phase 2: 登录排查
  top → 发现陌生进程 [kworker] 占用500% CPU
  (服务器8核)

Phase 3: 进程分析
  ls -l /proc/<PID>/exe → /tmp/.cache/kworker
  strace -p <PID> → 发现连接矿池: pool.minexmr.com:4444

Phase 4: 持久化排查
  crontab -l → */5 * * * * /tmp/.cache/update.sh
  cat /tmp/.cache/update.sh → 从远程下载+执行

Phase 5: 清除
  kill -9 <PID>
  rm -rf /tmp/.cache/
  crontab -r

Phase 6: 溯源入口
  /var/log/auth.log → 发现root从外网IP登录
  → 弱口令 root/admin123 → SSH爆破成功

Phase 7: 加固
  ✓ 修改root密码为强密码
  ✓ PermitRootLogin no
  ✓ 启用 fail2ban
  ✓ 部署EDR

时间: 从发现到清除 2小时
```

---

## ✅ 排查 Checklist

- [ ] 现场保护(不重启/不掉电/镜像优先)
- [ ] 异常用户排查
- [ ] 异常进程排查(CPU/内存/进程树)
- [ ] 网络连接排查(外连IP/端口)
- [ ] 持久化排查(计划任务/服务/注册表)
- [ ] 日志分析(安全日志/登录日志)
- [ ] Rootkit检测(chkrootkit/rkhunter)
- [ ] Webshell扫描
- [ ] 入口溯源
- [ ] 加固+恢复
