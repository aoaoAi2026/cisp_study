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

---

## 🎯 高频面试题

**Q1：Windows应急排查的5个核心检查点是什么？**

> 口诀"进服启计网"（进程→服务→启动项→计划任务→网络）：
> 1. **进程**（tasklist/tasklist /svc）：可疑进程名（svch0st假冒svchost）、CPU异常高的进程、父进程异常
> 2. **服务**（services.msc/sc query）：新增的可疑服务、服务名和显示名不一致
> 3. **启动项**（注册表Run键/msconfig/autoruns）：随开机启动的恶意程序
> 4. **计划任务**（taskschd.msc/schtasks）：攻击者设置的持久化定时任务
> 5. **网络**（netstat -ano/TCPView）：与陌生IP外连的进程、异常端口

**Q2：如何检查Windows有没有被创建隐藏账户？**

> ```
> 1. net user → 看有没有不认识的用户名
> 2. net localgroup administrators → 看管理员组有谁
> 3. 计算机管理 → 本地用户和组 → 用户 → 描述列查看
> 4. 注册表 HKEY_LOCAL_MACHINE\SAM\SAM\Domains\Account\Users\Names
> 5. 特别留意用户名后带$的（隐藏账户标志）
> 6. 事件查看器 → 安全日志 → 事件ID 4720（账户创建）→ 看创建时间
> ```

---

## 💻 Windows应急实操检查清单

```bat
:: 1. 看谁在登录
net user
net localgroup administrators
query user

:: 2. 看什么在跑
tasklist /svc
tasklist /m     :: 看每个进程加载了什么DLL

:: 3. 看谁在连
netstat -ano | findstr ESTABLISHED
netstat -ano | findstr LISTENING

:: 4. 看开机启动
wmic startup list full
schtasks /query /fo LIST /v

:: 5. 看最近文件
dir /s /od /p C:\Users\     :: 按日期排序，快速找出最近新建的文件
dir /s /od /p C:\Windows\Temp\

:: 6. 看事件日志
wevtutil qe Security /c:20 /rd:true /f:text   :: 最近20条安全事件
```

---

## 📖 深度补充内容

### 面试高频题

## 💡 面试高频题：Windows应急排查

**Q: Windows应急排查的5个核心排查点是什么？**
A: ①进程排查（`tasklist` / Process Explorer）：找出可疑进程——路径异常（/temp/、/Users/Public/目录下的进程）、签名异常（未签名或签名无效）、父进程异常（由cmd.exe或wscript.exe启动的svchost.exe）；②服务排查（`services.msc` / `sc query`）：检查新增的异常服务、服务二进制路径是否被篡改；③启动项排查（`msconfig` / Autoruns）：检查注册表Run键、启动文件夹、计划任务中新加入的项目；④账户排查（`net user` / `lusrmgr.msc`）：检查新增用户、隐藏用户（用户名以$结尾）、管理员组成员变更；⑤网络连接排查（`netstat -anob`）：检查异常的外部连接（境外IP、非标准端口）、监听中的可疑端口。

**Q: Windows事件日志中哪些Event ID与入侵相关？**
A: ①4624（登录成功）+ 4625（登录失败）→ 暴力破解；②4672（特权登录）→ 攻击者升级为管理员；③4688（进程创建）→ 追踪攻击者执行了哪些命令（需开启命令行审计）；④4698（计划任务创建）→ 建立持久化；⑤4720（账户创建）→ 添加后门账户；⑥4732/4738（安全组变更）→ 将自身加入管理员组；⑦1102（审计日志被清除）→ 攻击者试图抹除痕迹；⑧5145（网络共享对象访问被阻止）→ 横向移动尝试。

**Q: 如何在Windows上排查计划任务后门？**
A: ①`schtasks /query /fo LIST /v` → 列出所有计划任务，重点关注：触发器时间为非工作时间的任务、执行路径在临时目录（/temp/、/appdata/）的任务、任务名包含随机字符/模仿系统任务名的任务；②检查C:\Windows\Tasks\和C:\Windows\System32\Tasks\目录 → 查看.xml配置文件是否被篡改；③查看事件ID 4698 → 计划任务创建记录。与基线对比——如果出现不认识的计划任务=后门。


---

## 🎯 实战思维训练

### 蓝队"条件反射"训练

网络安全值守中，很多判断需要在几秒内完成。以下是本日主题相关的"条件反射"训练：

**看到以下现象 → 立即联想到 → 采取动作**：

1. 短时间内同一IP大量不同URL请求 → 目录/漏洞扫描 → 检查是否返回了不该返回的内容
2. WAF告警+同IP的Web日志中有500错误 → 攻击可能在尝试绕过WAF → 查看完整请求体
3. 非工作时间的管理员登录 → 凭据泄露/后门 → 确认是否为合法运维操作
4. 同一文件被频繁POST请求 → Webshell心跳 → 检查文件内容和创建时间
5. 出站流量突增到非标准端口 → 数据渗出/C2通信 → 追踪目标IP并阻断

### "如果是你，你怎么防？"

假设你是护网蓝队负责人，面对今天学习的安全威胁，请设计你的防御方案：
- 预防层：如何在攻击发生前阻止？（安全配置/代码审计/权限控制）
- 检测层：攻击发生时如何发现？（日志/告警/流量分析的关键特征）
- 响应层：确认攻击后如何处置？（隔离/封禁/取证/恢复的标准动作）
- 复盘层：事后如何防止再次发生？（规则优化/流程改进/培训加固）

---

## 📈 学习效果自检

请回答以下问题，不看笔记：

1. 能不能用3句话向一个非安全同事解释今天学的核心概念？
2. 能不能在白板上画出今天涉及的关键流程/架构？
3. 能不能写出至少3条针对今天主题的检测规则/命令？
4. 如果面试官问"你遇到过XX问题吗？怎么处理的？"你能给出有细节的回答吗？
5. 今天的实操任务中，有没有遇到卡住的地方？记录到笔记中，明天优先解决。

> **记不住？** 正常的。安全知识不是"看一遍就记住"的——是需要"反复遇到、反复使用、反复验证"之后才内化的。重要的是**坚持每天动手**，让大脑建立"安全思维"的神经通路。

---

## 🔗 知识链接

将今天的内容与之前学过的知识建立连接：
- 今天的知识点在Kill Chain的哪个阶段？在ATT&CK中对应哪些技术？
- 今天的检测方法依赖之前学过的哪些工具？（Wireshark/grep/awk/Nmap...）
- 如果用今天学的知识去看Day 1的护网场景，你能额外发现什么问题？

建立知识之间的链接是"从入门到精通"的关键——孤立的知识点容易遗忘，相互连接的知识形成网络后就会变得牢固。


---

## 🔬 进阶专题：本日知识在真实护网中的应用

### 护网场景还原

想象你正在护网值守中，突然收到一条与本日主题相关的告警。以下是标准的思维和处理流程：

**1. 第一反应（0-30秒）**：确认告警来源设备是否正常 → 查看告警级别 → 判断是否为"狼来了"

**2. 快速研判（30秒-2分钟）**：提取关键信息（源IP/目标资产/攻击类型/时间）→ 查威胁情报 → 看同一IP的其他告警

**3. 深度分析（2-10分钟）**：回放原始流量/日志 → 还原攻击payload → 判断攻击是否成功

**4. 处置决策（10-15分钟）**：确认是攻击→定级→封IP/隔离/升级事件；确认是误报→标记→优化规则

**5. 记录闭环（15-20分钟）**：填写工单（研判依据+处置动作+证据截图）→ 标记闭环


### 高手与新手的关键区别

| 维度 | 新手 | 高手 |
| --- | --- | --- |
| 看告警 | 只看这一条告警的内容 | 同时关联其他设备/其他时间的同类告警 |
| 判断依据 | "这个payload看起来像攻击" | "这个payload+这个User-Agent+这个时间点+这个频率=SQLMap自动化扫描" |
| 处置方式 | 封IP→完事 | 封IP+排查漏洞+检查是否已有数据泄露+通知业务方+更新WAF规则 |
| 记录质量 | "已处置" | "10:05收到WAF SQL注入告警→核查源IP 45.x为境外IP+威胁情报标记恶意→查看该IP完整请求链→确认SQLMap自动化扫描→已在WAF永久封禁+通知开发修复参数化查询→附件：攻击流量pcap+威胁情报截图" |

### 你今天学的知识在ATT&CK中的映射

花5分钟思考以下问题（有助于建立安全思维框架）：

- 今天的攻击手法在ATT&CK中属于哪个战术？对应的技术编号是什么？

- 用Kill Chain模型分析：这种攻击通常发生在哪几个阶段？

- 你的检测手段应该部署在Kill Chain的哪一环？为什么？

- 如果你负责设计针对这种攻击的防御方案，你会从哪几个层面入手？


> **记住**：蓝队不是"见招拆招"的被动防守，而是"知己知彼"的主动防御。每天学完一个知识点后，立刻思考"如果我是攻击者我会怎么用"+"如果我是防御者我该怎么挡"——这种双向思维是蓝队核心竞争力的来源。

---

## 📓 学习笔记模板

建议用以下模板整理今天的学习笔记，放入个人知识库：

```
【知识卡片：本日主题】
日期：2026-06-XX
核心概念（一句话）：
关键原理（3-5点）：
1.
2.
3.
检测方法（命令/规则）：
常见误报与排查：
实际案例简述：
面试题准备（3道）：
关联知识（链接到其他知识卡片）：
未解决的问题（明天继续研究）：
```

> **知识管理的黄金法则**：不是你存了多少，而是你能随时调用多少。每周花1小时整理和回顾笔记，比你再看一遍原始资料更有效。

---

## 🔬 进阶专题（续2）

### 护网场景还原

想象你正在护网值守中，突然收到一条与本日主题相关的告警。以下是标准的思维和处理流程：

**1. 第一反应（0-30秒）**：确认告警来源设备是否正常 → 查看告警级别 → 判断是否为"狼来了"

**2. 快速研判（30秒-2分钟）**：提取关键信息（源IP/目标资产/攻击类型/时间）→ 查威胁情报 → 看同一IP的其他告警

**3. 深度分析（2-10分钟）**：回放原始流量/日志 → 还原攻击payload → 判断攻击是否成功

**4. 处置决策（10-15分钟）**：确认是攻击→定级→封IP/隔离/升级事件；确认是误报→标记→优化规则

**5. 记录闭环（15-20分钟）**：填写工单（研判依据+处置动作+证据截图）→ 标记闭环


### 高手与新手的关键区别

| 维度 | 新手 | 高手 |
| --- | --- | --- |
| 看告警 | 只看这一条告警的内容 | 同时关联其他设备/其他时间的同类告警 |
| 判断依据 | "这个payload看起来像攻击" | "这个payload+这个User-Agent+这个时间点+这个频率=SQLMap自动化扫描" |
| 处置方式 | 封IP→完事 | 封IP+排查漏洞+检查是否已有数据泄露+通知业务方+更新WAF规则 |
| 记录质量 | "已处置" | "10:05收到WAF SQL注入告警→核查源IP 45.x为境外IP+威胁情报标记恶意→查看该IP完整请求链→确认SQLMap自动化扫描→已在WAF永久封禁+通知开发修复参数化查询→附件：攻击流量pcap+威胁情报截图" |

### 你今天学的知识在ATT&CK中的映射

花5分钟思考以下问题（有助于建立安全思维框架）：

- 今天的攻击手法在ATT&CK中属于哪个战术？对应的技术编号是什么？

- 用Kill Chain模型分析：这种攻击通常发生在哪几个阶段？

- 你的检测手段应该部署在Kill Chain的哪一环？为什么？

- 如果你负责设计针对这种攻击的防御方案，你会从哪几个层面入手？


> **记住**：蓝队不是"见招拆招"的被动防守，而是"知己知彼"的主动防御。每天学完一个知识点后，立刻思考"如果我是攻击者我会怎么用"+"如果我是防御者我该怎么挡"——这种双向思维是蓝队核心竞争力的来源。

---

## 📓 学习笔记模板

建议用以下模板整理今天的学习笔记，放入个人知识库：

```
【知识卡片：本日主题】
日期：2026-06-XX
核心概念（一句话）：
关键原理（3-5点）：
1.
2.
3.
检测方法（命令/规则）：
常见误报与排查：
实际案例简述：
面试题准备（3道）：
关联知识（链接到其他知识卡片）：
未解决的问题（明天继续研究）：
```

> **知识管理的黄金法则**：不是你存了多少，而是你能随时调用多少。每周花1小时整理和回顾笔记，比你再看一遍原始资料更有效。

---

## 🎯 今日学习里程碑检查

**知识掌握度自评（1-5分）**：
- 我能不看笔记讲清楚今天核心概念的原理：___分
- 我能写出今天学到的至少3条检测规则/命令：___分
- 我能解决今天实操任务中的所有问题：___分
- 我能在面试中流畅回答今天主题相关的问题：___分

**如果任何一项低于3分**，请标记为"需复习"，明天开始前花10分钟回顾。

**知识串联检查**：
- 今天的内容在Kill Chain中对应哪个阶段？
- 用ATT&CK框架看，今天的技术属于哪个战术？
- 今天学到的检测方法与之前学过的哪些工具（Wireshark/grep/Nmap/ELK）可以结合使用？

> **学以致用**：最好的学习方法就是"教"。试着用最简单的语言向一个非安全背景的朋友解释你今天学到的核心概念——如果你能让对方听懂，说明你真正掌握了。
