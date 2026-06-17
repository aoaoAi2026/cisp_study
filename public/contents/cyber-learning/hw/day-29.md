---
day: 29
title: ATT&CK框架与Kill Chain模型
phase: 第一阶段
difficulty: ⭐⭐ 基础
---

# Day 29：ATT&CK框架与Kill Chain模型（蓝队视角）

> **阶段**：第一阶段 · 初级蓝队夯实 | **难度**：⭐⭐ 基础 | **课时**：2-3小时

---

## 📋 今日学习目标

1. 理解攻击链（Kill Chain）模型的7个阶段
2. 了解ATT&CK框架的基本结构和用途
3. 学会将告警映射到ATT&CK技术编号
4. 用ATT&CK框架指导检测点设置
5. 会用蓝队视角使用ATT&CK（不是去攻击，是为了检测）

---

## 📖 核心知识讲解

### 一、Kill Chain —— 攻击者的"作案七步"

洛克希德·马丁公司提出了"网络攻击链"（Cyber Kill Chain）模型，把攻击过程拆成7个阶段：

| 阶段 | 英文 | 通俗比喻（偷东西） | 攻击技术举例 |
|:---|:---|:---|:---|
| 1 | Reconnaissance（侦察） | 踩点，看哪家好偷 | 端口扫描、社交工程收集信息 |
| 2 | Weaponization（武器化） | 准备好撬锁工具 | 制作恶意文件、编写exploit |
| 3 | Delivery（投递） | 把工具送到目标 | 钓鱼邮件、挂马网页 |
| 4 | Exploitation（利用） | 用工具撬锁 | 执行exploit、SQL注入 |
| 5 | Installation（安装） | 钻进窗后装后门 | 安装木马、上传webshell |
| 6 | C2（指挥控制） | 遥控指挥盗窃 | 木马回连C2服务器 |
| 7 | Actions（目标行动） | 偷东西走人 | 窃取数据、加密勒索、横向移动 |

> 🎯 **蓝队核心认知**：攻击者在每个阶段都可能被检测到！越早发现损失越小。

**蓝队在每个阶段的检测机会：**

| 攻击阶段 | 蓝队能发现什么 | 用什么发现 |
|:---|:---|:---|
| 侦察 | 端口扫描、目录扫描 | IDS(Wireshark特征)、Web日志(密集404) |
| 武器化 | 难直接检测 | 情报共享 |
| 投递 | 钓鱼邮件、恶意链接 | 邮件安全网关、代理日志 |
| 利用 | SQL注入payload、命令注入 | WAF、IDS、Web日志 |
| 安装 | webshell文件、后门进程 | 文件完整性监控、进程监控 |
| C2 | 异常外连、心跳流量 | 流量分析、DNS日志 |
| 行动 | 数据外传、横向扫描 | DLP、防火墙出站规则 |

### 二、ATT&CK —— 攻击者的"兵器谱"

ATT&CK（Adversarial Tactics, Techniques, and Common Knowledge）是MITRE公司维护的攻击技术知识库。

**通俗理解：** Kill Chain告诉你攻击者"分几个阶段作案"，ATT&CK告诉你每个阶段"用了什么具体手法"。

**ATT&CK矩阵结构：**

```
ATT&CK for Enterprise 矩阵：
├── 战术(Tactics)：12个攻击阶段（Kill Chain的升级版）
│   ├── Initial Access（初始访问）
│   ├── Execution（执行）
│   ├── Persistence（持久化）
│   ├── Privilege Escalation（提权）
│   ├── Defense Evasion（防御规避）
│   ├── Credential Access（凭据访问）
│   ├── Discovery（发现）
│   ├── Lateral Movement（横向移动）
│   ├── Collection（收集）
│   ├── Command and Control（C2）
│   ├── Exfiltration（数据渗出）
│   └── Impact（影响）
│
└── 技术(Techniques)：每个战术下的具体手法
    └── 子技术(Sub-techniques)：更细粒度的手法
```

**举例：看一个实际攻击的ATT&CK映射**

```
攻击事件：某Web服务器被攻陷，内网被横向渗透

时间线与分析：
02:00 T1046  Network Service Scanning   → 端口扫描
02:15 T1190  Exploit Public-Facing App  → SQL注入漏洞利用
02:30 T1505.003 Server Software Comp.   → 上传Webshell
02:40 T1059.003 Windows Command Shell  → 执行系统命令
02:50 T1136.001 Local Account          → 创建后门账号
03:00 T1021.001 Remote Desktop Protocol → 横向移动(RDP)
03:30 T1003.001 LSASS Memory           → Mimikatz窃取凭据
03:50 T1041   Exfil Over C2 Channel    → 通过C2外传数据
```

**每个编号就是一个ATT&CK技术ID！** 全球安全人员使用统一的"语言"描述攻击。

### 三、蓝队如何使用ATT&CK框架

**用法1：检测覆盖度评估**

把你能检测到的攻击映射到ATT&CK矩阵，看看哪些战术/技术没有检测手段：

```
你的检测能力评估：
Tactics             检测覆盖度
Initial Access      ████████░░  80%（缺供应链攻击检测）
Execution           ██████░░░░  60%（缺脚本引擎检测）
Persistence         ████░░░░░░  40%（缺WMI事件订阅检测）
...                 需要补充检测规则
```

**用法2：告警分析时参考**

收到一条告警 → 查它对应哪个ATT&CK技术 → 查这个技术通常的前置和后置技术 → 找是不是还有其他相关告警

**用法3：红蓝对抗中的沟通语言**

红队："我们用了T1003.001（LSASS内存读取）拿到了凭据"
蓝队："我们检测到了T1003.001的行为，时间点是..."

---

## 🔧 实操任务

### 任务1：用ATT&CK分析Day 27的攻击链（20分钟）

1. 打开 [attack.mitre.org](https://attack.mitre.org)
2. 把Day 27模拟值守中20条告警的攻击行为逐一映射到ATT&CK技术
3. 列出你发现的攻击链覆盖了哪些ATT&CK战术

### 任务2：了解ATT&CK Navigator（15分钟）

1. 打开 [mitre-attack.github.io/attack-navigator](https://mitre-attack.github.io/attack-navigator)
2. 尝试标记几个你熟悉的检测技术
3. 观察哪些战术区域是空白（说明你需要补充检测手段）

---

## ✅ 验收标准

- [ ] 能说出Kill Chain的7个阶段
- [ ] 理解ATT&CK的战术-技术-子技术三层结构
- [ ] 能将一个攻击事件映射到对应的ATT&CK技术
- [ ] 知道蓝队用ATT&CK的3种方式

---

## 📝 今日小结

Kill Chain让你理解攻击的"阶段"，ATT&CK让你知道每个阶段的"手法"。把告警从"来了一个SQL注入"升级为"检测到T1190（利用面向公众应用），该技术常见于初始访问阶段，根据ATT&CK，攻击者接下来可能进行T1505.003（植入Webshell）"，你的分析就从"点"变成了"面"。

**记住核心**：ATT&CK = 攻击技术百科全书，蓝队用它评估检测覆盖、分析告警关联、统一沟通语言。

---

## 📚 延伸阅读（可选）

- [ATT&CK官网](https://attack.mitre.org) 最权威的参考
- 了解ATT&CK for ICS（工控系统版本）和ATT&CK for Mobile（移动端版本）
