# 网络攻击画像与 ATT&CK 映射实战

当一次攻击发生后，蓝队要回答的终极问题不是 **"攻击者做了什么"**，而是 **"这伙人是谁、他们会什么、他们下一步会做什么、我们该怎么防"**。构建**攻击画像（Attacker Profile）**并把行为映射到 **MITRE ATT&CK 框架**，是从"被动响应"到"主动预判"的关键一步。

## 1. 什么是攻击画像（TTPs）？

**TTPs（Tactics, Techniques, and Procedures）** 即策略、技术和过程，描述的是攻击者"怎么做事"。典型画像包括：

| 画像维度 | 示例内容 |
|----------|----------|
| **初始访问偏好** | 钓鱼 / 公开漏洞利用 / 暴力破解 / 供应链 |
| **典型工具** | Cobalt Strike / Metasploit / 哥斯拉 / 冰蝎 / mimikatz |
| **横向移动方式** | RDP / SMB / WMI / PsExec / SSH / WinRM |
| **权限维持方式** | 计划任务 / 启动项 / 服务 / 账号克隆 / Webshell |
| **C2 通信特征** | DNS 隧道 / HTTPS 自定义协议 / 合法域名伪装 / 时间节奏 |
| **数据窃取方式** | Rclone / 7z + FTP / WebDAV / 邮件外带 |
| **反分析 / 反沙箱** | 沙箱检测 / 加壳 / 代码混淆 / 延迟执行 |
| **时间窗口** | 工作时间 / 非工作时间 / 特定节假日 |
| **语言 / 时区特征** | 样本 / 工具中的时区、语言包、UI 文本 |
| **目标画像** | 行业偏好（政府 / 制造 / 能源 / 金融）、组织规模 |

把这些维度填好之后，我们就得到了一份"攻击者的简历"。

## 2. MITRE ATT&CK 矩阵是什么？

**ATT&CK（Adversarial Tactics, Techniques, and Common Knowledge）** 是 MITRE 维护的一个**开放的攻击者行为知识库**，把攻击行为按"战术（Tactic）→ 技术（Technique）→ 子技术（Sub-Technique）"组织起来。在企业防御中，它扮演三种角色：

1. **统一语言**：用 `T1059.003 / T1078.003` 这样的编号替代"黑客在服务器上跑了个东西"之类的口语化描述。
2. **检测能力评估**：把自家检测规则对齐到 ATT&CK，一眼看出"哪些行为我们看不见"。
3. **红蓝对抗剧本**：红队按 ATT&CK 组织攻击路径，蓝队按 ATT&CK 组织检测与响应。

### 2.1 护网中常用的 ATT&CK 战术（14 个）

| 战术 ID | 中文名 | 说明（护网常见） |
|---------|--------|------------------|
| Reconnaissance | 侦察 | 公网信息收集、端口扫描、目录扫描 |
| Resource Development | 资源开发 | 注册仿冒域名、搭建 C2、准备工具 |
| Initial Access | 初始访问 | 钓鱼、漏洞利用、暴力破解、VPN 账号 |
| Execution | 执行 | PowerShell / cmd / 宏 / Python 执行 |
| Persistence | 权限维持 | 计划任务、启动项、服务、WebShell |
| Privilege Escalation | 权限提升 | 本地漏洞、令牌窃取、服务提权 |
| Defense Evasion | 防御绕过 | 关闭杀软、禁用日志、白名单滥用、混淆 |
| Credential Access | 凭证访问 | Mimikatz、Kerberoasting、哈希抓取 |
| Discovery | 发现 | 网络 / 系统 / 文件 / AD 侦察 |
| Lateral Movement | 横向移动 | SMB / RDP / WMI / SSH / WinRM |
| Collection | 收集 | 抓敏感文件、剪贴板、邮件 |
| Command and Control | 命令控制 | C2 通信、域名生成算法（DGA）、隧道 |
| Exfiltration | 数据外泄 | 压缩 + 外带 / 云盘 / DNS 隧道 |
| Impact | 影响 | 勒索、数据销毁、拒绝服务 |

## 3. 一次真实攻击的 ATT&CK 映射示例

假设在护网中发生一次攻击，以下是从原始日志到 ATT&CK 的映射过程：

### 3.1 原始事件时间线

```text
T+00:00 攻击者对 mail.example.com 的 OWA 进行暴力破解（500 次失败后成功）
T+00:03 登录成功，使用 Webmail 查看邮件、搜索"密码"字样
T+00:10 使用相同账号登录 VPN（无 MFA）
T+00:15 从 VPN 出口对内网 10.0.0.0/16 做端口扫描
T+00:25 发现 10.1.2.33（Web 服务器）445 端口开放，尝试 SMB 连接
T+00:30 PsExec 执行命令上传可疑 exe（命名为 svchost.exe，路径 C:\Windows\Temp）
T+00:32 可疑 exe 运行，对外 443 发起 HTTPS 连接至 198.51.100.23
T+00:45 发现 mimikatz 行为（lsass.exe 被读取）
T+01:10 使用获取到的管理员账号，通过 RDP 登录到数据库服务器
T+01:30 对数据库执行 SELECT * FROM customer ... INTO OUTFILE '/tmp/cc.csv'
T+02:00 使用 Rclone 将 /tmp/cc.csv 同步到某对象存储（外带）
T+03:00 清理部分日志：wevtutil cl Security（清空安全日志）
```

### 3.2 ATT&CK 映射结果表

| 时间点 | 行为描述 | 战术 | 技术（ATT&CK ID） | 检测状态 |
|--------|----------|------|-------------------|----------|
| T+00:00 | OWA 暴力破解 | Initial Access | T1110.003（密码喷射/暴力破解-Web 会话） | ✓ 已发现 |
| T+00:03 | 邮箱搜索敏感关键词 | Collection | T1114.001（邮箱收集） | ✗ 未检测 |
| T+00:10 | 同一账号异地 VPN 登录 | Initial Access | T1078.003（合法账号-本地账号） | ✗ 未检测（缺乏关联） |
| T+00:15 | 内网端口扫描 | Discovery | T1046（网络服务扫描） | ✓ 已发现 |
| T+00:25 | SMB 连接尝试 | Lateral Movement | T1021.002（SMB 横向） | ✓ 已发现 |
| T+00:30 | PsExec 上传木马 | Execution + Lateral Movement | T1569.002（PsExec） | ✓ 已发现 |
| T+00:32 | HTTPS C2 通信 | Command and Control | T1071.001（应用层协议-HTTPS） | ✗ 未检测（流量特征未标记） |
| T+00:45 | mimikatz 读取 lsass | Credential Access | T1003.001（lsass 内存凭证） | ✓ 已发现 |
| T+01:10 | RDP 登录数据库服务器 | Lateral Movement | T1021.001（RDP 横向） | ✗ 未检测（本地 IP 合法） |
| T+01:30 | 批量导出数据库表 | Collection | T1567（数据本地收集）+ T1530（云/本地数据） | ✗ 未检测（数据库审计缺失） |
| T+02:00 | Rclone 同步数据至对象存储 | Exfiltration | T1567.002（数据外带-云存储） | ✗ 未检测（DNS/出口流量） |
| T+03:00 | 清空安全日志 | Defense Evasion | T1070.001（指示器删除-主机日志） | ✗ 未检测（日志服务器无预警） |

### 3.3 基于映射结果的"防御缺口报告"

```text
【防御缺口 TOP 5】

1. T1071.001（C2-HTTPS）：目前仅靠域名黑名单，未做 JA3 指纹 + 流量行为分析
   → 建议：引入流量分析 / NDR / 补充 JA3 情报

2. T1070.001（日志清除）：未对事件日志被清除做预警
   → 建议：SIEM 规则：Security 日志大小突变 / wevtutil cl 命令告警

3. T1567.002（云存储外带）：未对终端访问未登记对象存储做限制
   → 建议：终端 EDR + 出口代理策略 + DNS 威胁情报

4. T1530（数据库批量导出）：数据库审计等级较低
   → 建议：对核心库启用数据库审计系统，关注 SELECT INTO OUTFILE / TOP N 查询

5. T1110 + T1078（相同账号跨系统登录）：缺乏跨系统登录关联
   → 建议：UEBA 规则：同一账号在短时间内登录多个异构系统，升级为 L3 事件
```

## 4. 如何在护网中落地 ATT&CK

### 4.1 第一步：把"检测规则"对齐到 ATT&CK

每个检测规则（SIEM/WAF/EDR/IDS）都应该标上 ATT&CK 技术编号。示例：

```yaml
- rule_id: SIEM-R0042
  rule_name: "mimikatz-lsass-dump"
  mitre: T1003.001
  data_source:
    - Windows Security Event (4663 / 4688)
    - EDR 进程访问
  detection: >
    process_name IN ("mimikatz*", "sekurlsa*")
    OR (target_process = "lsass.exe" AND access_mask = 0x1010)
  response: L3 重要，自动升级

- rule_id: SIEM-R0047
  rule_name: "psexec-lateral-movement"
  mitre: T1569.002
  detection: >
    4697 事件（服务安装）+ 随后出现 cmd.exe / powershell.exe
    从非运维源 IP 在 10 分钟内登录 5+ 台不同主机
```

### 4.2 第二步：绘制"自己的 ATT&CK 热力图"

```text
护网结束后可输出"防御热力图"：

  战术 / 技术           命中次数    已检测    未检测    改进计划
  Initial Access         23           18        5        加强 OWA + VPN MFA
  Execution              17           14        3        补全 PowerShell 日志
  Credential Access      9            7         2        优化 mimikatz 检测
  Lateral Movement       31           22        9        引入 NDR + 数据库审计
  ...                   ...          ...       ...       ...
```

### 4.3 第三步：用 ATT&CK 设计红队演练剧本

```text
【下次护网红队剧本（基于上次未检测项）】
- 红队剧本一：T1071.001（C2-HTTPS）+ T1571（非标准端口） → 测试我方流量检测
- 红队剧本二：T1070.001（清除日志）+ T1027（混淆文件） → 测试取证与反分析能力
- 红队剧本三：T1567.002（云存储外带） → 测试数据防泄漏能力
```

## 5. 攻击画像的长期维护："攻击者档案"

在每次护网 / 真实事件后，建议建立"攻击者档案"：

```text
【攻击者档案示例】
档案编号： ATK-2025-003
首次观测： 2025-09-12（护网期间）
最后观测： 2025-09-20
情报来源： 内部 SOC + 威胁情报平台 + 友方行业共享

TTPs：
  - 初始访问： T1110.003（OWA 暴力破解）、T1566（钓鱼邮件）
  - 执行：     T1059.001（PowerShell）、T1053.005（计划任务）
  - 凭证：     T1003.001（mimikatz）
  - 横向：     T1021.002（SMB）、T1569.002（PsExec）
  - C2：       T1071.001（HTTPS）+ T1001.003（DNS 隧道备用）
  - 外带：     T1567.002（Rclone 云对象存储）

工具指纹：
  - mimikatz 变种哈希： xxxx
  - 自写木马哈希：       yyyy
  - C2 域名/IP：  198.51.100.23 / cdn-akamai-backup[.]top

语言/时区： 样本中含中文注释；C2 心跳主要发生在工作日 09-21 时（UTC+8）

行业偏好： 政府 / 大型央企 / 医疗

防御建议：
  - 在 SIEM 中新增"攻击者档案匹配"规则：同源 TTPs 一旦命中即 L3
  - 把上述 C2 域名 / IP / 哈希同步到防火墙 + EDR + 邮件网关
  - 下次护网前，针对档案中的 TTPs 做专项测试
```

## 6. 实践中的常见问题

| 问题 | 建议 |
|------|------|
| "映射太粗，分不清技术" | 优先标到"技术级别（Txxxx）"，子技术（Txxxx.00y）能标就标，标不到不强求 |
| "事件太多，映射时间不够" | L1/L2 事件走规则自动映射；L3/L4 人工复核 |
| "检测和 ATT&CK 总是对不上" | 从检测规则出发做"反向映射"：每条规则对应哪些 ATT&CK 技术 |
| "做完一次就丢了" | 把 ATT&CK 热力图变成**月度 / 季度报表**，长期追踪防御能力变化 |
| "只 ATT&CK，不改防御" | 映射只是手段，**用映射结果推动规则/工具/流程改进**才是目标 |

## 7. 总结：攻击画像的"飞轮效应"

当把一次次事件持续地：

```text
 原始日志 → 事件研判 → ATT&CK 映射 → 攻击者画像 → 更新检测规则 → 更多事件被捕获
    ▲                                                                         │
    └──────────────────────────────────────────────────────────────────────────┘
```

就形成了一个**自增强的防御飞轮**：**越分析 → 越懂对手 → 越能抓新攻击 → 越能防住**。在护网这个"集中考场"上，这样的飞轮能让团队从"被攻击牵着走"进化到"预判攻击者下一步"。
