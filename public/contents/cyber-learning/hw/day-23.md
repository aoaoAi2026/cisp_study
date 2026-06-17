---
day: 23
title: Windows应急排查
phase: 第一阶段
difficulty: ⭐⭐ 基础
---

# Day 23：Windows应急排查

> **阶段**：第一阶段 · 蓝队极速上岗 | **难度**：⭐⭐ 基础 | **课时**：2-3小时

---

## 📋 今日学习目标

1. 掌握Windows系统的5项核心应急排查动作
2. 能排查可疑进程和服务
3. 能检查计划任务和启动项中的后门
4. 能分析登录日志进行溯源
5. 能在模拟环境中完成一次完整的Windows应急排查

---

## 📖 核心知识讲解

### 一、Windows应急排查总览

当怀疑一台Windows机器被入侵，按以下顺序排查：

```
排查顺序（从易到难，从外到内）：
① 网络连接 → 有没有可疑外连？
② 进程列表 → 有没有陌生进程？
③ 服务列表 → 有没有可疑服务？
④ 启动项   → 有没有开机自启的后门？
⑤ 计划任务 → 有没有定时执行的恶意程序？
⑥ 用户账户 → 有没有被偷偷创建的用户？
⑦ 登录日志 → 谁登录过？什么时候？
⑧ 文件检查 → 有没有webshell或可疑文件？
```

### 二、五项核心排查动作

#### 动作1：排查网络连接 —— "机器在和谁通信？"

```powershell
# 查看所有网络连接（含进程名）
netstat -anob

# PowerShell版本（更好看）
Get-NetTCPConnection | Select-Object LocalAddress,LocalPort,RemoteAddress,RemotePort,State,OwningProcess

# 重点关注：
# - 是否有外连到境外IP的连接？
# - 是否有非标准端口的连接(非80/443)？
# - 连接状态 ESTABLISHED 表示正在通信中
# - 进程名是否为陌生进程？
```

**可疑特征：**
- cmd.exe/powershell.exe 外连到境外IP
- svchost.exe 连接非微软服务端口
- 陌生进程连接了4444/5555/6666等高危端口（Metasploit/Cobalt Strike常用）

#### 动作2：排查进程 —— "有没有混进坏人？"

```powershell
# 列出所有进程
tasklist

# 更详细的信息（含命令行参数）
wmic process get Name,ProcessId,ExecutablePath,CommandLine

# PowerShell版本
Get-Process | Select Name,Id,Path

# 查找没有签名的进程（正规软件都有数字签名）
Get-Process | Get-AuthenticodeSignature | Where-Object {$_.Status -ne "Valid"}
```

**可疑特征：**
- 进程路径在 C:\Users\xxx\AppData\Local\Temp\ 下
- 进程名伪装成系统进程但路径不对（如svchost.exe不在System32下）
- 进程名包含随机字符串（如dkjf23.exe）
- 进程CPU/内存使用异常高（可能是挖矿）

#### 动作3：排查服务和启动项 —— "有没有开机自启的后门？"

```powershell
# 查看所有服务
Get-Service | Format-Table Name,DisplayName,Status,StartType

# 查看自启动项（注册表Run键）
Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Run
Get-ItemProperty HKCU:\Software\Microsoft\Windows\CurrentVersion\Run

# 查看启动文件夹
ls "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup"
ls "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup"

# 用Autoruns工具（更全面，需要下载）
# 下载Sysinternals Suite中的autoruns.exe
```

**可疑特征：**
- 注册表Run键中有陌生程序路径
- 服务名称伪装成微软服务但描述异常
- 服务路径指向Temp目录

#### 动作4：排查计划任务 —— "有没有定时炸弹？"

```powershell
# 查看所有计划任务
schtasks /query /fo LIST /v

# PowerShell版本
Get-ScheduledTask | Where-Object {$_.State -ne "Disabled"}

# 只看最近创建的
Get-ScheduledTask | Sort-Object -Property Date -Descending | Select -First 10
```

**可疑特征：**
- 任务每隔1-5分钟执行一次（典型的持久化频率）
- 任务执行的内容包含奇怪路径或脚本
- 任务的"创建时间"在异常时间点（凌晨）

#### 动作5：排查用户和登录 —— "谁来过？"

```powershell
# 查看所有本地用户
net user

# 查看管理员组成员
net localgroup Administrators

# 查看最近登录记录
Get-WinEvent -LogName Security -MaxEvents 100 | Where-Object {$_.Id -eq 4624} | Select TimeCreated, @{n='User';e={$_.Properties[5].Value}}, @{n='IP';e={$_.Properties[18].Value}}

# 查看登录失败记录
Get-WinEvent -LogName Security -MaxEvents 100 | Where-Object {$_.Id -eq 4625}
```

**可疑特征：**
- 管理员组中有不认识的用户
- 有账户在深夜/凌晨登录
- 登录来源IP是境外IP

### 三、应急排查一键脚本

把上面的命令组合成一个排查脚本，拷贝到目标机器上执行：

```powershell
# Windows应急排查一键脚本
Write-Host "===== 1. 系统信息 =====" -ForegroundColor Cyan
systeminfo | findstr /B /C:"OS Name" /C:"System Boot Time"

Write-Host "===== 2. 当前用户 =====" -ForegroundColor Cyan
whoami
net user

Write-Host "===== 3. 网络连接 =====" -ForegroundColor Cyan
netstat -anob | findstr ESTABLISHED

Write-Host "===== 4. 进程列表（前20个）=====" -ForegroundColor Cyan
Get-Process | Sort-Object -Property CPU -Descending | Select -First 20

Write-Host "===== 5. 计划任务（最近10个）=====" -ForegroundColor Cyan
Get-ScheduledTask | Sort-Object -Property Date -Descending | Select -First 10

Write-Host "===== 6. 用户登录（最近20次）=====" -ForegroundColor Cyan
Get-WinEvent -LogName Security -MaxEvents 20 | Where-Object {$_.Id -eq 4624}

Write-Host "===== 7. 启动项 =====" -ForegroundColor Cyan
Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Run
Get-ItemProperty HKCU:\Software\Microsoft\Windows\CurrentVersion\Run
```

---

## 🔧 实操任务

### 任务1：熟悉排查命令（20分钟）

在你的Windows电脑上（非生产环境），打开PowerShell管理员模式，依次执行上述五项核心排查命令，观察输出结果，判断你的系统是否有异常。

### 任务2：检查登录日志（15分钟）

1. 打开事件查看器 → Windows日志 → 安全
2. 筛选事件ID 4624
3. 看看最近有哪些登录记录
4. 有没有你不认识的用户？有没有异常的登录时间？

### 任务3：创建模拟排查报告（15分钟）

假设你在排查中发现以下异常，请写一份排查报告：

```
发现：
- 管理员组多了一个用户 helpdesk1
- C:\Users\Public\下有一个隐藏文件夹 .tmp，里面有 update.exe
- 计划任务中有一个 UpdateCheck 任务，每5分钟执行一次，执行 update.exe
- netstat 显示 update.exe 外连到境外 IP 45.33.32.156:4444
```

写出你的排查结论和处置建议。

---

## ✅ 验收标准

- [ ] 能独立完成Windows系统的5项核心排查动作
- [ ] 能识别可疑进程（路径异常/名称伪装/无数字签名）
- [ ] 能检查计划任务和启动项中的异常
- [ ] 能分析登录日志判断异常登录
- [ ] 能写出结构清晰的排查报告

---

## 📝 今日小结

Windows应急排查就像给电脑做"全身体检"——看进程是不是都认识、看网络连接是不是都合法、看有没有被偷偷加了后门。今天你学会了5项核心排查动作，记住排查思路比记住具体命令更重要：先看外连，再看进程，然后查持久化（服务/启动项/计划任务），最后查用户和登录。

**记住今天的核心**：
- 排查顺序：网络→进程→服务→启动项→计划任务→用户→日志
- 可疑路径：Temp目录、Public目录下的exe
- 可疑命名：伪装系统进程名但路径不对
- 计划任务每分钟执行 = 高嫌疑

---

## 📚 延伸阅读（可选）

- 下载Sysinternals Suite（微软官方工具包），尤其是Process Explorer和Autoruns
- 了解火绒剑、PCHunter等国内安全排查工具
