# 第四章 MITRE ATT&CK框架

> 第4章 | 50页

4.1 ATT&CK框架概述

MITRE ATT&CK是一个基于真实观察的全球可访问的战术和技术知识库，被世界各地的企业和政府用作开发特定威胁模型和方法的基础。

4.2 ATT&CK战术（Tactics）

企业矩阵包含14个战术：
- 初始访问（Initial Access）
- 执行（Execution）
- 持久化（Persistence）
- 权限提升（Privilege Escalation）
- 防御绕过（Defense Evasion）
- 凭据访问（Credential Access）
- 发现（Discovery）
- 横向移动（Lateral Movement）
- 收集（Collection）
- 命令与控制（Command and Control）
- 数据渗出（Exfiltration）
- 影响（Impact）
- 侦察（Reconnaissance）
- 资源开发（Resource Development）

4.3 ATT&CK技术（Techniques）

每个战术下包含多个技术（Techniques），每个技术下可能包含子技术（Sub-techniques）。
例如：
- T1566 钓鱼（Phishing）
  - T1566.001 鱼叉式钓鱼附件
  - T1566.002 鱼叉式钓鱼链接
  - T1566.003 语音钓鱼

4.4 ATT&CK的应用场景

- 威胁检测：基于ATT&CK设计检测规则
- 红蓝对抗：红队模拟TTPs，蓝队检测TTPs
- 差距评估：评估现有防护覆盖的技术点
- 威胁情报：用ATT&CK描述攻击者TTPs
- 安全运营：将告警映射到ATT&CK
