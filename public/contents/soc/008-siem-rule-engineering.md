# SIEM 规则编写深度实战：Sigma / Splunk SPL / Elastic KQL

---

## 一、Sigma 规则核心结构

```yaml
title: Suspicious PowerShell Download Cradle
id: 3b6ab547-8ecc-4e25-85c5-25ee1e49e9f8
status: stable
description: |
  Detects PowerShell download commands commonly 
  used by attackers to download payloads
author: SOC Team
date: 2026/09/01
modified: 2026/09/15

logsource:
  category: process_creation
  product: windows
  service: security

detection:
  selection_powershell:
    EventID: 4688
    NewProcessName|endswith: '\powershell.exe'
    
  selection_cmdline:
    CommandLine|contains:
      - 'DownloadString'
      - 'DownloadFile'
      - 'Invoke-WebRequest'
      - 'Invoke-RestMethod'
      - 'Net.WebClient'
      - 'Start-BitsTransfer'
      - 'IEX'
      - 'Invoke-Expression'
    
  filter_legitimate:
    # 排除已知的正常使用场景
    # (根据环境自定义)
    CommandLine|contains: 'Microsoft.Online.Administration'
    
  condition: selection_powershell and selection_cmdline and not filter_legitimate

falsepositives:
  - System administrators running legitimate download scripts
  - CI/CD pipeline scripts
  - Software deployment tools

level: high

tags:
  - attack.t1059.001
  - attack.t1105
  - attack.execution
```

---

## 二、Sigma 高价值检测规则清单

```
Top 20 必写检测规则（按ATT&CK战术）：

Execution:
  1. PowerShell -EncodedCommand执行
  2. WMI 执行进程 (wmic process call create)
  3. MSHTA执行JavaScript/VBScript
  4. certutil下载执行
  5. Regsvr32执行远程脚本

Persistence:
  6. Run/RunOnce注册表新建
  7. 计划任务创建
  8. WMI永久事件订阅
  9. 服务创建（非系统路径）

Credential Access:
  10. LSASS内存访问（非系统进程）
  11. 域内DCSync检测
  12. NTDS.dit 提取
  13. SAM注册表访问

Discovery:
  14. BloodHound/SharpHound 执行
  15. AdFind 执行
  16. Nmap/NetScan 执行

Lateral Movement:
  17. PsExec远程执行
  18. WMI远程进程创建
  19. WinRM远程会话

C2/Exfiltration:
  20. 非标准端口大流量出站
```

---

## 三、Splunk SPL 检测实战

```
// 检测横向移动 — PsExec
index=wineventlog EventCode=7045 
| search Service_File_Name="%SystemRoot%\\*.exe"
| stats count by host, Service_Name, Service_File_Name
| where count > 0

// 检测Kerberoasting — 大量TGS请求
index=wineventlog EventCode=4769 
  ServiceName!="*$" 
  TicketEncryptionType=0x17 
| stats count by Account_Name, ServiceName, ClientAddress
| sort -count

// 检测PowerShell EncodedCommand
index=wineventlog EventCode=4688 
  NewProcessName="*powershell.exe" 
  CommandLine="* -enc *" OR CommandLine="* -EncodedCommand *"
| table _time, host, Account_Name, CommandLine

// 检测异常父子进程链
index=wineventlog EventCode=4688
| eval suspicious=if(
    (ParentProcessName="*winword.exe" AND NewProcessName="*powershell.exe") OR
    (ParentProcessName="*excel.exe" AND NewProcessName="*cmd.exe") OR
    (ParentProcessName="*outlook.exe" AND NewProcessName="*wscript.exe"),
    "Yes", "No")
| search suspicious="Yes"
| table _time, host, ParentProcessName, NewProcessName, CommandLine
```

---

## 四、Elastic KQL 检测实战

```kql
// 检测可疑PowerShell下载
event.category: "process" 
AND event.type: "start"
AND process.name: "powershell.exe"
AND process.command_line.text: (
  "DownloadString" OR "DownloadFile" OR 
  "Invoke-WebRequest" OR "Net.WebClient" OR
  "IEX" OR "Invoke-Expression"
)
AND NOT process.command_line.text: "Microsoft.Online"

// 检测LSASS访问
event.category: "process"
AND event.type: "access"
AND target.process.name: "lsass.exe"
AND NOT process.name: (
  "svchost.exe" OR "MsMpEng.exe" OR 
  "csrss.exe" OR "wininit.exe"
)
| stats count by process.name, host.name
| where count > 5

// 检测DNS tunneling (长域名/高频率)
event.category: "dns"
AND dns.question.registered_domain: *
| eval len = length(dns.question.name)
| where len > 50
| stats count by dns.question.name, source.ip
| sort count desc

// 检测异常登录时间
event.category: "authentication"
AND event.outcome: "success"
| eval hour = date_extract("@timestamp", "HOUR")
| where hour >= 22 OR hour <= 6
| where NOT user.name: ("svc_*", "*-backup")
| stats count by user.name, host.name
| sort count desc
```

---

## 五、规则测试与误报率评估

```
新规则上线前验证流程：

Step 1: 历史回查
  将新规则应用到过去30天的日志
  → 如果命中 > 1000条/天 → 规则太宽 → 优化
  → 如果命中 < 1条/天 → 规则太窄 → 检查是否正确

Step 2: 手动抽样
  随机抽取100条命中 → 逐条人工判定
  → 真阳性率 > 60% → 可上线
  → 真阳性率 40-60% → 加过滤条件后上线
  → 真阳性率 < 40% → 重新设计

Step 3: 灰度上线
  新规则先设为 "仅告警不升级" → 运行1-2周
  → 观察误报量 → 调优 → 
  → 达标后 → 加入P1-P4分类

Step 4: 定期审计
  每条规则每季度审查：
  - 命中率是否下降？（可能已过时）
  - 误报率是否上升？（环境变化）
  - 是否需要更新？（新TTP需要覆盖）
```
