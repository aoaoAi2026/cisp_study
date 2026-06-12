# APT 组织分析：海莲花 / 蔓灵花 / 360APT 等知名 APT 组织全景

---

## 一、APT 的本质：高级持续威胁

```
APT = Advanced + Persistent + Threat
  Advanced: 具备 0day / 1day 漏洞、定制化恶意代码、长期对抗能力
  Persistent: 进入目标内网后长期潜伏 (6 个月~数年)、逐步提权、横向、驻留
  Threat: 有组织、有资金、有明确战略目标 (国家级别支持、黑产目标明确)
```

## 二、典型 APT 攻击链 (Lockheed Martin Kill Chain + MITRE ATT&CK)

```
  1. Reconnaissance (侦察): OSINT / 社工 / 钓鱼目标识别
  2. Weaponization (武器化): 构造带漏洞文档 (Office / PDF)
  3. Delivery (投送): 鱼叉钓鱼邮件 / 水坑攻击 / 供应链
  4. Exploitation (漏洞利用): 0day / 已知漏洞 (CVE-xxxx)
  5. Installation (植入): 后门 / 木马 / Rootkit
  6. Command & Control (C2): 建立隐蔽通信通道
  7. Actions on Objectives (行动): 凭据窃取 / 横向移动 / 数据外泄 / 破坏
```

## 三、国内研究机构报告的 APT 组织概览

| 代号 | 别名 / 其他研究机构命名 | 主要目标 | 惯用 TTPs |
|------|----------------------|---------|----------|
| **APT-C-06 (蔓灵花 / BeetleCampaign)** | Temp.Periscope, APT30 (FireEye) | 东南亚、政府、军方、媒体 | .lnk 钓鱼 + VBS/PS1 脚本 + 侧载 DLL |
| **APT-C-11 (海莲花 / OceanLotus)** | APT32, Group 27, Conimes | 中国周边 / 东南亚 / 越南 | 水坑 + 鱼叉邮件 + RTF 模板注入 + 侧载 |
| **APT-C-12 (响尾蛇 / SideWinder)** | Rancor, APT-Q-16 | 南亚政府、军事、外交 | 鱼叉邮件 + Office 宏 / RTF + 定制木马 |
| **APT-C-15 (摩诃草 / DarkHotel)** | DarkHotel (Kaspersky) | 酒店 WIFI 劫持 + 外交官 / 高管 | 酒店 WIFI 中间人、0day 投毒浏览器 |
| **APT-C-19 (蓝宝菇 / BlueMockingBird)** | 针对政府 / 军工科研 | 鱼叉邮件 + 定制宏 + 侧载 |
| **APT-C-23 (毒藤 / PoisonIvy 衍生)** | 针对科研院所 | 历史悠久的 RAT 家族, 变种众多 |
| **APT-C-34 (Mustang Panda)** | Mustang Panda / 野马熊猫 | 东南亚 / 欧美 NGO | HTML smuggling + LNK / 宏文档 + PlugX |
| **APT-C-39 (Patchwork)** | APT-C-39 / 360 命名 | 东南亚政府 | Office 文档 / 宏 / OLE 对象 |
| **APT-C-40 (GoldenJackal)** | 针对中亚、南亚政府 | 宏文档 + 侧载、2023 年公开 |

## 四、APT 组织实战剖析：海莲花 (OceanLotus)

### 4.1 主要特点

- **目标**: 越南政府 / 企业 / 媒体 / 海外越侨组织; 同时针对周边国家政府机构
- **攻击手法**:
  - 鱼叉钓鱼邮件 (越南语内容, 社会工程学高度定制)
  - 水坑攻击: 在越南语常用网站植入恶意代码
  - 供应链攻击: 攻击软件厂商 / 插件分发渠道
  - 0day 使用: Office / Flash / IE (已披露多个 CVE)
- **恶意代码**:
  - Denis / Remy / OceanLotus-Backdoor (C++ 定制)
  - 侧载: 利用知名合法软件签名 DLL 加载恶意 payload (DLL Side-Loading)
  - 多阶段: Shellcode → 下载器 → 最终后门 → 多种植入手法
- **C2 架构**:
  - 域名生成算法 (DGA) + 多层代理 / Fast-flux
  - 使用 blogspot / wordpress.com / imgur 等公共服务做 dead-drop

### 4.2 典型 TTPs (按 MITRE ATT&CK 映射)

```
Initial Access:
  T1566  Phishing (Spearphishing Attachment / Link)
  T1190  Exploit Public-Facing Application
  T1189  Drive-by Compromise (水坑)

Execution:
  T1204  User Execution (用户点击)
  T1059  Command and Scripting Interpreter (PowerShell / VBS / MSHTA)
  T1055  Process Injection

Persistence:
  T1547  Boot or Logon Autostart Execution (Run / RunOnce / Scheduled Task)
  T1574  Hijack Execution Flow (DLL Side-Loading)
  T1136  Create Account (域账号 / 本地账号)

Privilege Escalation:
  T1548  Abuse Elevation Control Mechanism
  T1068  Exploitation for Privilege Escalation

Defense Evasion:
  T1562  Impair Defenses (禁用/破坏 AV/EDR)
  T1070  Indicator Removal (清理日志 / 擦除痕迹)
  T1027  Obfuscated Files or Information (混淆/加密 Payload)

Credential Access:
  T1003  OS Credential Dumping (Mimikatz / SAM / NTDS.dit)
  T1555  Credentials from Password Stores

Discovery:
  T1018  Remote System Discovery
  T1087  Account Discovery
  T1083  File and Directory Discovery

Lateral Movement:
  T1021  Remote Services (RDP / SMB / WinRM / SSH)
  T1075  Pass the Hash

Collection:
  T1113  Screen Capture
  T1114  Email Collection
  T1005  Data from Local System

Command and Control:
  T1071  Application Layer Protocol (HTTP / HTTPS / DNS)
  T1008  Fallback Channels
  T1573  Encrypted Channel (TLS 自签证书)

Exfiltration:
  T1041  Exfiltration Over C2 Channel
  T1567  Exfiltration Over Web Service (Cloud Storage)

Impact:
  T1486  Data Encrypted for Impact (勒索)
  T1485  Data Destruction
```

## 五、APT 组织实战剖析：蔓灵花 (Temp.Periscope)

- **目标**: 中国海事/航运/港口/船级社/能源企业; 同时针对东南亚政府
- **特点**:
  - 多使用 .lnk 快捷方式 + VBS/JS 脚本
  - 钓鱼邮件高度定制 (伪装客户 / 合作伙伴 / 船期信息)
  - 使用侧载 DLL 执行; 木马采用加密配置
  - C2 多分布在亚洲节点 (越南 / 香港 / 新加坡)
- **历史行动**:
  - 针对中国海事相关单位长期渗透 (2017 年起被公开披露)
  - 使用多种免杀技术对抗国内杀软
  - 与 APT30 有一定关联 (FireEye 研究)

## 六、APT 组织实战剖析：响尾蛇 (SideWinder / Rancor)

- **目标**: 巴基斯坦 / 南亚政府、军事、外交
- **特点**:
  - RTF 模板注入 + 宏 + OLE
  - 使用 "Patchwork" 框架 / 自定义 RAT
  - 高度依赖漏洞文档 (CVE-2017-11882 / CVE-2018-0802 / 等 Equation Editor 漏洞)
  - 中文文档伪装: 议题 / 政策 / 外交文件

## 七、APT 防御要点

```
识别与发现:
  1. 邮件网关: 禁止宏 / 禁止 OLE / 禁止 JavaScript 附件
  2. EDR/XDR: 监控 Process Injection / 可疑 PowerShell / MSHTA / msiexec
  3. DNS 监控: 域名生成算法 (DGA)、可疑 C2 域名黑名单
  4. TLS 检查: 自签证书 / 异常 JA3 指纹 / 异常流量

阻止横向:
  1. LAPS 本地管理员密码随机化
  2. Protected Users 组 + Credential Guard
  3. RDP / WinRM / SMB 来源限制 + 审批
  4. 禁用 NTLM / 强制 Kerberos + AES

检测异常:
  1. UEBA (用户和实体行为分析): 发现非工作时间、非办公地登录
  2. SIEM 规则: 多机登录 / 多 IP 登录 / 异常大文件下载
  3. 蜜罐 / honeytoken: 伪造账号/文件, 引诱攻击者触发告警

响应:
  1. 隔离: 识别的 C2 IP / Domain → 阻断
  2. 取证: 内存镜像 + 磁盘镜像 + 网络包
  3. 清洗: 清除所有 APT 植入 (难度很大, 通常需要重装关键主机)
  4. 补漏: 修复初始漏洞 (邮件 / 浏览器 / Office / 系统)
  5. 情报: 订阅厂商 APT 报告 + IOC 黑名单
```

## 八、IOC 情报使用方法

```
获取来源:
  - 360 Netlab / 奇安信 / 微步在线 / 天际友盟 (国内厂商)
  - FireEye / Mandiant / CrowdStrike / SentinelLabs (海外厂商)
  - VirusTotal / OTX / MISP (社区)
  - 威胁情报平台订阅

IOC 类型:
  1. IP / Domain / URL → 导入 WAF / DNS / 防火墙
  2. Hash (MD5/SHA256) → 导入 EDR / 沙箱黑名单
  3. YARA Rule → 离线扫描 / EDR 内存扫描
  4. JA3/JA3S 指纹 → 识别 APT C2 通信
  5. 恶意文件名 / 路径 / 注册表键名 → HIPS 规则

实践:
  - 每日拉取 IOC, 自动更新 WAF / EDR / SIEM
  - IOC 带 TTL (过期失效), 避免误报
  - 结合 MITRE ATT&CK, 针对 APT 做专项规则 (行为特征比 IOC 更持久)
```

## 九、CheckList

- [ ] 订阅国内外主要 APT 研究机构的威胁情报报告
- [ ] 建立 IOC 黑名单自动化更新管道 (IP/Domain/URL/Hash)
- [ ] EDR / SIEM 覆盖所有终端与服务器
- [ ] 邮件网关禁止宏、OLE、可执行附件
- [ ] 核心系统启用 LAPS / Protected Users / Credential Guard
- [ ] 建立 UEBA / 行为基线, 识别异常登录与数据访问
- [ ] 对敏感部门做针对性钓鱼模拟测试, 持续培训
- [ ] 建立 APT 事件应急 SOP (含 C2 识别 / 取证 / 清洗流程)
- [ ] 部署蜜罐 / honeytoken, 主动发现横向扫描
- [ ] 定期红蓝对抗演练, 实战检验 APT 防御能力
- [ ] 保持与行业 CERT / 公安网安部门信息共享
