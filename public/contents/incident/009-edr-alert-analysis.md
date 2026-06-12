# Windows EDR 告警分析实战手册

---

## 一、EDR 告警类型与分析方法

```
EDR核心告警类型（按ATT&CK战术分类）：

Execution (TA0002):
  • 可疑进程执行(explorer.exe → cmd.exe → powershell.exe)
  • 脚本执行(powershell -enc SQBFAFgA...)
  • LOLBin滥用(mshta/regsvr32/rundll32下载执行)

Persistence (TA0003):
  • Run/RunOnce注册表新建
  • 计划任务创建（名称仿冒系统任务）
  • WMI事件订阅
  • 服务创建（非系统路径）

Credential Access (TA0006):
  • LSASS进程访问（非系统进程如powershell访问lsass.exe）
  • SAM文件访问
  • NTDS.dit提取行为

Discovery (TA0007):
  • 大量whoami/net user/net group命令
  • Nmap/AdFind/BloodHound执行
  
Lateral Movement (TA0008):
  • PsExec/WMI远程执行
  • RDP非标准端口
  • SMB/WinRM异常连接
```

---

## 二、告警分析流程

```
告警分析五步法：

Step 1: 初步验证
  → 主机是否在线？是否生产环境？
  → 告警时间是否在正常运维窗口？
  → 是否有相关变更工单？

Step 2: 进程链分析 ★核心★
  → 查看进程树(父子关系)
  → 正常：User→explorer→chrome
  → 可疑：WinWord.exe → cmd.exe → powershell.exe
  → 高危：services.exe → cmd.exe (按理services.exe不直接启动cmd)

Step 3: 网络连接关联
  → 该进程连接了哪些IP/端口？
  → 连接的目标是否是已知恶意IP？
  → 出站流量大小和时间规律？

Step 4: 文件操作分析
  → 进程创建/修改了哪些文件？
  → 是否有释放exe/dll/脚本到临时目录？
  → 是否有访问LSASS/SAM的行为？

Step 5: 横向关联
  → 同一父进程是否在其他主机也执行？
  → 同一IP是否连接了其他主机？
  → 同一用户是否在多地登录？
```

---

## 三、CrowdStrike / Defender 告警解读

```bash
# CrowdStrike Falcon 告警示例
# 告警类型: SuspiciousProcess
# 检测模式: ParentImage=winword.exe → Image=powershell.exe → CommandLine="IEX(New-Object..."

# 分析：
# ✓ winword.exe 正常不应该启动 powershell
# ✓ CommandLine含下载执行代码 → 高置信度恶意
# → 判定：宏文档下载执行恶意代码

# Microsoft Defender for Endpoint
# 告警: "PowerShell downloading executable"
# DeviceEvents | where ActionType == "PowerShellCommand"
# | where AdditionalFields contains "DownloadString"
```

---

## 四、Checklist

- [ ] EDR进程树分析熟练
- [ ] 网络连接关联分析
- [ ] 文件操作时间线分析
- [ ] 误报vs真阳性判定标准
- [ ] 告警→工单标准化流转
