# MITRE ATT&CK 实战：框架解读与检测应用

---

## 一、ATT&CK 框架概览

```
  MITRE ATT&CK = Adversarial Tactics, Techniques, and Common Knowledge
    ├─ Tactics (战术, 攻击者"为什么做这件事"): 14 个阶段
    ├─ Techniques (技术, 攻击者"怎么做"): 每个战术下多个技术
    └─ Sub-techniques (子技术, 更精细的变体)

  ATT&CK for Enterprise (企业) 覆盖 Windows / macOS / Linux / 云 / 网络设备:

    1. Initial Access          (初始访问)         = 如何进入目标组织
    2. Execution              (执行)              = 如何运行恶意代码
    3. Persistence            (持久化)            = 如何长期驻留
    4. Privilege Escalation   (权限提升)          = 如何获取更高权限
    5. Defense Evasion        (防御规避)          = 如何绕过 AV/EDR/日志
    6. Credential Access      (凭据访问)          = 如何偷取密码 / 票据
    7. Discovery              (发现)              = 如何侦察网络 / 主机 / 用户
    8. Lateral Movement       (横向移动)          = 如何在网络中移动
    9. Collection             (收集)              = 如何收集目标数据
    10. Command and Control  (命令与控制)         = 如何与 C2 通信
    11. Exfiltration         (数据外泄)           = 如何把数据偷出
    12. Impact               (影响)               = 如何破坏系统
    (Reconnaissance + Resource Development = 攻击前准备, 在 PRE-ATT&CK 中)
```

## 二、14 大战术 + 代表性技术速查 (简化版)

```
  Initial Access (TA0001)
    T1566 Phishing            鱼叉钓鱼邮件
    T1190 Exploit Public-Facing Application  漏洞利用外网应用
    T1189 Drive-by Compromise  水坑攻击
    T1133 External Remote Services  VPN / RDP 凭据被盗

  Execution (TA0002)
    T1059 Command and Scripting Interpreter (PowerShell / cmd / bash)
    T1053 Scheduled Task/Job   (at / schtasks / cron)
    T1055 Process Injection
    T1204 User Execution       用户点击运行

  Persistence (TA0003)
    T1547 Boot or Logon Autostart (Run / RunOnce / .profile / .bashrc)
    T1543 Create or Modify System Process (Windows Service / systemd)
    T1136 Create Account       新建账号
    T1098 Account Manipulation 账号操作

  Privilege Escalation (TA0004)
    T1548 Abuse Elevation Control Mechanism (UAC 绕过 / sudo)
    T1068 Exploitation for Privilege Escalation (本地提权漏洞)
    T1574 Hijack Execution Flow (DLL 侧载 / PATH 注入)

  Defense Evasion (TA0005)
    T1562 Impair Defenses     关闭/破坏 AV/EDR/日志
    T1027 Obfuscated Files    文件加密/混淆
    T1070 Indicator Removal   擦除日志 / 清理痕迹
    T1553 Subvert Trust Controls  绕过代码签名
    T1564 Hide Artifacts       隐藏文件 / 进程 / 注册表

  Credential Access (TA0006)
    T1003 OS Credential Dumping (Mimikatz / SAM / NTDS.dit / /etc/shadow)
    T1555 Credentials from Password Stores (浏览器密码 / 凭据管理器)
    T1110 Brute Force         密码暴力破解
    T1558 Steal or Forge Kerberos Tickets (Golden Ticket / Silver Ticket)

  Discovery (TA0007)
    T1087 Account Discovery
    T1018 Remote System Discovery
    T1083 File and Directory Discovery
    T1069 Permission Groups Discovery (Domain Admins / Administrators)

  Lateral Movement (TA0008)
    T1021 Remote Services     (RDP / WinRM / SSH / SMB)
    T1075 Pass the Hash        PtH
    T1550 Use Alternate Authentication Material (Pass the Ticket / Pass the Key)
    T1023 Data from Shared Network Resources

  Collection (TA0009)
    T1113 Screen Capture      截屏
    T1114 Email Collection    邮件收集
    T1115 Clipboard Data      剪贴板
    T1005 Data from Local System

  Command and Control (TA0011)
    T1071 Application Layer Protocol (HTTP / HTTPS / DNS / SMB)
    T1573 Encrypted Channel    TLS / 自加密
    T1008 Fallback Channels    备用 C2 通道
    T1090 Proxy / TOR / 多层代理

  Exfiltration (TA0010)
    T1041 Exfiltration Over C2 Channel
    T1567 Exfiltration Over Web Service (S3 / OneDrive / Google Drive)
    T1052 Exfiltration Over Physical Medium (U盘)

  Impact (TA0040)
    T1486 Data Encrypted for Impact (勒索)
    T1485 Data Destruction    (擦除 / 破坏)
    T1490 Inhibit System Recovery (删除 VSS 备份)
    T1498 Network Denial of Service
```

## 三、ATT&CK 在企业安全中的应用场景

### 3.1 安全能力评估 (Security Maturity Model)

```
  步骤:
    1. 列出企业关心的主要技术 (比如: T1059 PowerShell / T1003 Credential Dumping ...
    2. 对每个技术评估:
       - Prevent (阻止): 是否能阻止此类攻击? (EMET / WDAC / SRP)
       - Detect (检测): 是否能检测到? (EDR / SIEM 规则)
       - Respond (响应): 有自动化 Playbook 吗?
       - Predict (预测): 有无威胁情报预警?
    3. 输出雷达图 / 热力图: 识别企业防御薄弱环节 (最大缺口)
    4. 针对性投入:
         - 缺 Detect 的技术: 补 EDR / 写 SIEM 规则
         - 缺 Prevent 的技术: 部署 SRP / WDAC / 补丁管理
         - 缺情报的技术: 订阅威胁情报源
```

### 3.2 蓝队检测规则映射

```
  把已有检测能力映射到 ATT&CK:
    - EDR 规则 / HIPS 规则 → T 编号
    - SIEM 规则 / 用例 (Use Case) → T 编号
    - WAF 规则 → T 编号
    - 邮件网关规则 → T 编号
    - 网络 IDS / IPS (Snort/Suricata) → T 编号

  示例映射:
    规则: "检测 PowerShell -enc base64 长参数"
      ↓ 映射
    T1059.001 Command and Scripting Interpreter: PowerShell

    规则: "检测到 mimikatz 关键词 / sekurlsa 调用
      ↓ 映射
    T1003.001 OS Credential Dumping: LSASS Memory

    规则: "检测 Run / RunOnce 注册表修改"
      ↓ 映射
    T1547.001 Registry Run Keys / Startup Folder

    规则: "检测大量 SMB 登录失败 (4625)
      ↓ 映射
    T1110.003 Brute Force: Password Spraying
```

### 3.3 红队进攻路线设计

```
  红队按 ATT&CK 矩阵设计攻击步骤, 并故意使用蓝队薄弱的技术:

    1. Initial Access:  T1566 Phishing + OLE + Macro
    2. Execution:       T1059.003 PowerShell (无文件)
    3. Persistence:     T1547.001 Run + T1543.003 Windows Service
    4. Priv Esc:        T1548.002 UAC Bypass + T1068 CVE-2021-xxxx
    5. Defense Evasion: T1562.001 Disable AV + T1564.001 Hidden Files
    6. Credential:      T1003.001 LSASS + T1558.001 Golden Ticket
    7. Lateral:         T1021.002 RDP + T1075 PtH + T1021.006 WinRM
    8. C2:              T1071.001 HTTP + T1573.001 Symmetric Encryption
    9. Exfil:           T1567.002 Cloud Storage (OneDrive)
    10. Impact:         T1486 Ransomware (模拟)

  演练后蓝队输出: 哪些技术被检测? 哪些没被检测? 改进计划
```

## 四、从 ATT&CK → 可落地的检测规则模板

```
  通用模板: [T-编号] [Tactics] [Source] [Event ID] [Pattern] → [告警级别]

  示例 1 (Windows 事件日志 + SIEM):
    T1078.002 Valid Accounts: Domain Accounts
      Source: Security Event Log
      Event ID: 4625 (失败) + 4624 (成功)
      Pattern: 同用户 10 分钟内失败 ≥ 20 次, 然后成功登录 (密码喷洒)
      Severity: High

  示例 2 (PowerShell 日志):
    T1059.001 PowerShell
      Source: Microsoft-Windows-PowerShell/Operational
      Event ID: 4104 (Script Block Logging)
      Pattern: "FromBase64String" + "Invoke-Expression" + 长度 > 1000
      Severity: Critical

  示例 3 (Linux 审计):
    T1548.001 Abuse Elevation Control Mechanism: Setuid and Setgid
      Source: auditd / syscall
      Pattern: chmod u+s / * 或 chmod +s 执行
      Severity: High

  示例 4 (网络流量):
    T1071.004 Application Layer Protocol: DNS
      Source: DNS Query Log
      Pattern: 单主机 1 分钟内 > 50 个唯一 DNS 查询, 且域名熵值 > 4.0 (DGA)
      Severity: High

  示例 5 (EDR 行为):
    T1003.001 LSASS Memory
      Source: EDR telemetry
      Pattern: "OpenProcess" target = lsass.exe AND caller NOT in whitelist
      Severity: Critical
```

## 五、常用公开 ATT&CK 检测资源

```
  1. MITRE Cyber Analytics Repository (CAR)
     https://car.mitre.org
     - 官方提供的分析用例 (Detection Analytic)

  2. MITRE ATT&CK Navigator
     https://mitre-attack.github.io/attack-navigator/
     - 可视化矩阵浏览器 / 编辑器
     - 企业可导入自己的检测能力, 生成热力图

  3. Sigma Rules (通用 SIEM 规则)
     https://github.com/SigmaHQ/sigma
     - 社区维护的高质量检测规则, 已按 ATT&CK 编号标注
     - 支持 Splunk / Elastic / QRadar / ArcSight 等

  4. Elastic Detection Rules
     https://github.com/elastic/detection-rules

  5. Red Canary / Atomic Red Team
     https://github.com/redcanaryco/atomic-red-team
     - 红队测试框架, 每个 ATT&CK 技术都有对应的可执行测试脚本

  6. Uncoder Rule Translator
     https://uncoder.io
     - Sigma 规则转换到各 SIEM 查询语言

  7. MITRE Engenuity ATT&CK Evaluations
     https://attackevals.mitre-engenuity.org
     - 对主流 EDR 厂商做 ATT&CK 覆盖能力评测
```

## 六、实战：建立企业 ATT&CK 检测能力的步骤

```
  Step 1. 梳理资产: 哪些资产需要检测 (终端 / 服务器 / 云 / 网络)
  Step 2. 选择关注的威胁:
            - 金融行业: 勒索软件 + 金融木马 (T1486 / T1059 / T1053)
            - 政府行业: APT (T1566 / T1055 / T1003 / T1021)
            - 互联网公司: Web 入侵 (T1190 / T1190) + 数据外泄 (T1567)
  Step 3. 建立 ATT&CK 检测矩阵 (使用 Navigator + 自建表格)
  Step 4. 引入 Sigma 规则 / Elastic Detection Rules / 自定义规则
  Step 5. 规则质量评估: 误报率 / 命中率 / 平均响应时间
  Step 6. 用 Atomic Red Team 做红蓝对抗, 验证每个 T 技术是否被检测
  Step 7. 持续改进: 每月 review 薄弱 T 技术, 补充规则
  Step 8. 管理层报告: 用 ATT&CK 矩阵展示防御进展 (覆盖率从 20% → 60% → 80% ...)
```

## 七、常见 APT 组织的 ATT&CK 映射（概念示例）

```
  海莲花 (APT32) 典型 TTP:
    Initial Access:    T1566 Phishing + T1189 Drive-by
    Execution:         T1059.005 VisualBasic / T1059.003 PowerShell
    Persistence:       T1547.001 Run + T1574.002 DLL Side-Loading
    Priv Escalation:   T1548.002 UAC Bypass
    Defense Evasion:   T1562.001 Disable AV + T1027 Obfuscated Files
    Credential Access: T1003.001 LSASS + T1555 Credentials from Stores
    Lateral Movement:  T1021.002 RDP + T1075 Pass the Hash
    C2:                T1071.001 HTTP(S) + T1008 Fallback Channels
    Exfiltration:      T1567.002 Exfiltrate to Web Service
```

## 八、CheckList

- [ ] 企业已部署 ATT&CK Navigator 并建立自定义矩阵
- [ ] 所有 SIEM / EDR 规则已按 ATT&CK 编号标注
- [ ] 每月 review 防御覆盖率 (按 T 技术)
- [ ] 引入 Sigma 规则集, 定期更新
- [ ] 已部署 Atomic Red Team 做定期红队测试 (至少季度一次)
- [ ] 按红队测试结果更新防御规则
- [ ] 管理层定期看到基于 ATT&CK 的防御进展报告 (覆盖率变化)
- [ ] 订阅 MITRE ATT&CK 新版本, 及时引入新增 T 技术
- [ ] 威胁情报 (APT 报告) 也按 ATT&CK 技术分类存档 (便于快速响应)
- [ ] 安全团队成员都接受过 ATT&CK 基础培训, 能读懂矩阵并用它沟通
