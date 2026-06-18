# Day 3：入侵检测与防御系统(IDS/IPS)

> 🎯 面试目标：能清晰区分IDS与IPS的部署模式、检测方法，并掌握签名规则编写和部署策略

## 知识速览
### 核心概念
- **IDS（入侵检测系统）**：旁路部署，复制流量进行分析，检测到威胁后发出告警但不阻断。分为NIDS（网络型）和HIDS（主机型）。优点是不影响网络性能，缺点是只能检测不能防御。
- **IPS（入侵防御系统）**：串联部署，流量必须经过IPS才能到达目标，检测到威胁后可实时阻断。优点是能主动防御，缺点是可能成为性能瓶颈和单点故障点。
- **检测方法分类**：①特征/签名检测——匹配已知攻击模式，误报率低但无法检测零日攻击；②异常检测——建立正常行为基线，偏离基线的视为可疑，能检测未知攻击但误报率高；③基于协议的检测——检查协议是否合规（如HTTP RFC规范）。
- **部署位置**：边界IPS（网络出口）、核心交换旁路IDS（东西向流量）、服务器区前端IPS、云环境中通过虚拟补丁实现vIPS。

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| IDS和IPS的区别是什么？实际中如何选择？ | 核心区别：IDS旁路检测→告警不阻断，IPS串联部署→可实时阻断。选择：互联网出口优先部署IPS（主动阻断），核心内部交换区部署IDS（只监控不影响业务），关键服务器前端部署IPS做虚拟补丁 |
| 什么是IDS的误报和漏报？如何平衡？ | 误报（False Positive）：正常流量被误判为攻击；漏报（False Negative）：真实攻击未被检测到。平衡方法：①根据资产价值调整策略敏感度（关键系统严格策略）②持续优化签名库③结合威胁情报减少噪声④使用SIEM进行二次关联分析降低误报 |
| Suricata/Snort规则的基本结构是怎样的？ | 规则由三部分组成：规则头（action、protocol、源/目的IP端口、方向）+ 规则体（msg、sid、rev、content/pcre等检测选项）。例如：`alert tcp $EXTERNAL_NET any -> $HOME_NET 80 (msg:"SQL Injection"; content:"union select"; sid:100001;)` |
| 如何处理IDS/IPS告警洪泛？ | ①告警分级（critical/high/medium/low）②告警聚合（相同类型告警合并）③SOAR自动化处理低级别告警④关联分析降噪⑤定期tuning关闭无价值告警⑥建立告警到事件的映射阈值 |

### 技术细节
Suricata规则示例（检测WebShell上传）：
```
# 检测PHP一句话木马上传
alert http $EXTERNAL_NET any -> $HOME_NET 80 (
  msg:"PHP Webshell Upload Detected";
  flow:to_server,established;
  content:"POST"; http_method;
  content:"<?php"; http_client_body;
  pcre:"/<\\?php\\s+(eval|assert|system|exec)/i";
  classtype:web-application-attack;
  sid:2000001; rev:1;
)

# 检测横向移动（SMB）
alert smb $HOME_NET any -> $HOME_NET any (
  msg:"Lateral Movement - PsExec Detected";
  content:"|FF|SMB|A2|"; offset:4; depth:4;
  content:"PSEXESVC";
  classtype:attempted-admin;
  sid:2000002; rev:1;
)
```

## 常见陷阱
- ⚠️ **陷阱："部署了IDS/IPS就高枕无忧"**——IDS/IPS对加密流量基本无效（除非做SSL解密），对零日攻击和高级定制攻击检测能力有限，且需要持续维护和优化规则库。
- ⚠️ **陷阱："告警越多说明IDS/IPS越有效"**——恰恰相反，大量未经优化的告警等于没有告警。"狼来了"效应会导致安全团队忽略真正的威胁。好的IDS/IPS应该告警精准、可操作。
- ⚠️ **陷阱："IPS直接上线全阻断模式"**——新部署的IPS应该先用"只告警"模式运行一段时间，观察误报情况，逐步将高置信度规则切换为阻断模式，避免影响正常业务。

## 今日检测
1. 画出NIDS和HIDS的典型部署架构图，标注流量走向
2. 编写3条Suricata规则：一条检测SQL注入，一条检测目录遍历攻击，一条检测C2心跳通信
3. 假设你是安全运营人员，每天收到5000条IDS告警，设计一个告警处理流程，将需要人工分析的告警控制在50条以内
