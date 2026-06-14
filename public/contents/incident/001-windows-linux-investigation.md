# Windows / Linux 入侵排查实战手册

> **📘 文档定位**：CISP 考试核心基础 | 难度：⭐⭐⭐ | 预计阅读：35 分钟
>
> 入侵排查是安全运营人员的基本功。本文系统梳理 Windows 和 Linux 双平台的入侵排查方法论，覆盖从现场保护到清除加固的完整流程，提供可直接复制执行的操作命令，帮助读者快速建立"发现异常→定位源头→清除后门"的实战能力。

---

## 导航目录

- [一、入侵排查黄金流程](#一入侵排查黄金流程)
- [二、Windows 入侵排查](#二windows-入侵排查)
- [三、Linux 入侵排查](#三linux-入侵排查)
- [四、Webshell 排查](#四webshell-排查)
- [五、勒索病毒排查](#五勒索病毒排查)
- [六、完整案例](#六完整案例)
- [七、安全部署 Checklist](#七安全部署-checklist)
- [八、高分考点与知识巧记](#八高分考点与知识巧记)

---

## 一、入侵排查黄金流程

### 1.1 为什么需要标准化流程

入侵排查不同于日常运维，需要在最短时间内完成"发现→遏制→清除→溯源"的闭环。没有标准化流程很容易遗漏关键证据或破坏取证线索。

```
入侵排查黄金流程（收到告警后）：

Phase 1: 现场保护 (10分钟)
  ✓ 勿重启/关机（内存证据会丢失！）
  ✓ 网络隔离（安全组/防火墙隔离，不断网可远程取证）
  ✓ 镜像取证（有条件：磁盘快照+内存dump）

Phase 2: 快速排查 (30分钟)
  → 异常用户 → 异常进程 → 网络连接 → 自启动 → 日志

Phase 3: 深度分析 (2-4小时)
  → 后门排查 → 持久化 → 横向移动痕迹 → 数据泄露

Phase 4: 清除与加固 (4-8小时)
  → 清除恶意软件 → 修复漏洞 → 加固系统 → 恢复上线
```

> **🔑 高分考点**：应急响应的四个阶段——准备（Preparation）、检测与分析（Detection & Analysis）、遏制清除与恢复（Containment, Eradication & Recovery）、事后活动（Post-Incident Activity）。现场保护的核心原则是**不改变原始证据**。

### 1.2 应急响应优先级矩阵

| 优先级 | 场景 | 响应时限 | 示例 |
|:---:|:---|:---:|:---|
| P1 | 正在进行的攻击/数据外泄 | 15分钟 | 勒索病毒加密中、数据大量外传 |
| P2 | 已确认入侵但已遏制 | 1小时 | WebShell已隔离、后门已发现 |
| P3 | 可疑行为/告警待确认 | 4小时 | 异常登录告警、可疑进程告警 |
| P4 | 低危告警/信息收集 | 24小时 | 端口扫描、单次失败登录 |

---

## 二、Windows 入侵排查

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

> **🔑 高分考点**：进程链分析是区分正常行为和攻击行为的关键。正常链：`services.exe → svchost.exe`；恶意链：`winword.exe → cmd.exe → powershell.exe`。父进程异常是检测无文件攻击的核心指标。

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

> **🔑 高分考点**：Windows 持久化常见位置——注册表 Run 键（`HKCU/HKLM\...\Run`）、计划任务（`schtasks`）、Windows 服务（`sc create`）、WMI 事件订阅（`__EventFilter + CommandLineEventConsumer`）、启动文件夹。APT 攻击中 WMI 事件订阅尤为隐蔽。

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

### 2.6 Windows 关键事件 ID 速查表

| Event ID | 事件描述 | 安全含义 |
|:---:|:---|:---|
| 4624 | 登录成功 | 重点关注 LogonType 10 (RDP) 和非工作时间登录 |
| 4625 | 登录失败 | 大量 4625 可能表示暴力破解 |
| 4672 | 特殊权限登录 | 管理员权限使用 |
| 4688 | 进程创建 | 含命令行参数，可用于还原攻击链 |
| 4697 | 服务安装 | 后门服务检测 |
| 4720 | 用户创建 | 攻击者创建后门账户 |
| 4740 | 账户锁定 | 暴力破解的副作用 |
| 4769 | Kerberos TGS 请求 | Kerberoasting 检测 |
| 4662 | 目录服务访问 | DCSync 检测 |

---

## 三、Linux 入侵排查

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

> **🔑 高分考点**：Linux 持久化常见位置——Crontab（`/etc/crontab`、`/var/spool/cron/`）、Systemd 服务（`/etc/systemd/system/`）、SSH authorized_keys、`.bashrc/.profile`（LD_PRELOAD 后门）、SUID 文件。攻击者喜欢利用 `LD_PRELOAD` 注入恶意 so 实现隐蔽持久化。

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

### 3.6 Linux 与 Windows 排查对比

| 排查项 | Windows | Linux |
|:---|:---|:---|
| 用户检查 | `net user` / `Get-LocalUser` | `cat /etc/passwd` / `last` |
| 进程检查 | `Get-Process` / `tasklist` | `ps auxf` / `/proc` |
| 网络连接 | `netstat -ano` / `Get-NetTCPConnection` | `ss -antp` / `netstat -antp` |
| 持久化 | 注册表 / 计划任务 / 服务 / WMI | Crontab / Systemd / SSH key |
| 日志 | Event Log (ID 4624/4625/4688) | `/var/log/auth.log` / `journalctl` |
| Rootkit | `Get-WmiObject` 对比 | `chkrootkit` / `rkhunter` |

---

## 四、Webshell 排查

### 4.1 手工排查命令

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

### 4.2 Webshell 特征分类

| 类型 | 特征函数 | 示例 |
|:---|:---|:---|
| 一句话木马 | `eval($_POST[...])` | `<?php @eval($_POST['cmd']);?>` |
| 命令执行型 | `system()/exec()/shell_exec()` | `<?php system($_GET['cmd']);?>` |
| 加密型 | `base64_decode()/gzinflate()` | 冰蝎/哥斯拉加密 payload |
| 图片马 | 隐藏在图片文件中的 PHP 代码 | `.jpg` 包含 `<?php` 代码块 |
| 内存马 | Filter/Listener 型（Java） | 无文件落地，内存中驻留 |

> **🔑 高分考点**：Webshell 检测的三种方法——基于签名（关键字匹配 eval/assert/system）、基于行为（文件时间异常、路径异常）、基于流量（异常 POST 请求模式、User-Agent 特征）。

---

## 五、勒索病毒排查

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

### 5.1 勒索病毒入侵途径统计

```
主要入侵方式：
  ① RDP爆破 — 最常见的入口(45%)
  ② 钓鱼邮件 — 含恶意附件/链接(25%)
  ③ 漏洞利用 — VPN/Web漏洞(20%)
  ④ 其他 — 弱口令/U盘等(10%)
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

## 七、安全部署 Checklist

- [ ] 现场保护(不重启/不掉电/镜像优先)
- [ ] 异常用户排查（Windows: `net user`/ Linux: `cat /etc/passwd`）
- [ ] 异常进程排查(CPU/内存/进程树)
- [ ] 网络连接排查(外连IP/端口)
- [ ] 持久化排查(计划任务/服务/注册表/WMI/Crontab)
- [ ] 日志分析(安全日志/登录日志/Event ID)
- [ ] Rootkit检测(chkrootkit/rkhunter)
- [ ] Webshell扫描
- [ ] 入口溯源
- [ ] 加固+恢复
- [ ] 输出事件报告并归档

---

## 八、高分考点与知识巧记

### 高分考点速查表

| 序号 | 考点 | 频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | 应急响应四阶段 | ⭐⭐⭐⭐⭐ | ⭐ | 准备→检测分析→遏制清除恢复→事后活动 |
| 2 | Windows 关键事件 ID | ⭐⭐⭐⭐ | ⭐⭐ | 4624(登录)/4625(失败)/4688(进程创建)/4720(用户创建) |
| 3 | Linux 进程隐藏检测 | ⭐⭐⭐⭐ | ⭐⭐ | 对比 `ps` 输出和 `/proc` 目录 |
| 4 | Windows 持久化位置 | ⭐⭐⭐⭐ | ⭐⭐ | 注册表Run/计划任务/服务/WMI事件订阅/启动文件夹 |
| 5 | Linux 持久化位置 | ⭐⭐⭐⭐ | ⭐⭐ | Crontab/Systemd/SSH key/.bashrc/LD_PRELOAD |
| 6 | Webshell 检测关键字 | ⭐⭐⭐⭐⭐ | ⭐ | eval/assert/base64_decode/system/exec/shell_exec |
| 7 | Rootkit 检测工具 | ⭐⭐⭐ | ⭐⭐ | chkrootkit / rkhunter |
| 8 | 勒索病毒主要入口 | ⭐⭐⭐⭐ | ⭐ | RDP爆破(45%)/钓鱼邮件(25%)/漏洞利用(20%) |
| 9 | 现场保护第一原则 | ⭐⭐⭐⭐⭐ | ⭐ | 不重启/不关机/不改变原始证据 |
| 10 | 进程链分析 | ⭐⭐⭐ | ⭐⭐⭐ | 正常: explorer→chrome；恶意: word→powershell |

### 知识巧记口诀

> 🎵 **应急四阶段**："准备检测，遏制恢复，事后复盘"——P-D-C-P
>
> 🎵 **Windows 事件 ID 记法**："四六二四进，四六二五败，四六八八进程在，四七二零新用户来"
>
> 🎵 **排查五步法**："用户进程网，持久日志藏"——用户→进程→网络→持久化→日志
>
> 🎵 **Webshell 关键词**："eval assert system exec，base64 里面藏"——六大危险函数一次记住
>
> 🎵 **现场保护口诀**："不关不重启，内存莫丢弃，镜像要先做，证据链要齐"

---
