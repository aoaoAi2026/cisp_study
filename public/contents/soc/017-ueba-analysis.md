# UEBA 用户实体行为分析实战

> **📘 文档定位**：CISP 考试 安全运营 高级 | 难度：⭐⭐⭐⭐ | 预计阅读：25 分钟
>
> 系统讲解 UEBA（用户实体行为分析）的技术原理与实战应用，覆盖行为基线建立/异常检测模型/内部威胁发现/账号失陷检测。

---

## 导航目录

- [一、UEBA 技术原理](#一ueba-技术原理)
- [二、行为基线建立](#二行为基线建立)
- [三、异常检测模型](#三异常检测模型)
- [四、内部威胁检测](#四内部威胁检测)
- [五、账号失陷检测](#五账号失陷检测)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、UEBA 核心原理

```
UEBA = 建立行为基线 → 发现偏离 → 风险评分 → 告警

与传统SIEM的差异：
  SIEM: "检测已知攻击模式" (if-else规则)
  UEBA: "发现异常行为模式" (从正常行为中找出异常)

机器学习在此的作用：
  不是"AI替代分析员"
  而是"AI帮分析员过滤掉99%的正常行为，聚焦1%异常"
```

---

## 二、十大检测场景

```
场景1: 异常登录时空
  用户平时：北京办公室 9:00-18:00
  今天凌晨3:00从境外IP登录 → 高风险

场景2: 大量文件访问
  用户平时：访问100个文件/天
  今天访问5000个文件 → 可能在收集数据

场景3: 特权滥用
  管理员平时：执行10条管理命令/天
  今天执行200条 → 可能是横向移动

场景4: 数据批量下载
  O365/SharePoint → 一次性下载大量文件
  正常用户行为：偶尔1-2个大文件
  批量下载：20+文件同时下载 → UEBA告警

场景5: VPN异常
  平时VPN连接时间：1-2小时
  今天VPN连接时间：12小时（下载数据？）

场景6: 账号共享
  IP1登录userA → 5分钟后 IP2(不同城市)登录userA
  → 不可能的旅行(Impossible Travel) → 极高风险

场景7: 离职前异常
  离职前1周 → 大量下载/打印/邮件转发
  → 带走公司数据的常见模式

场景8: 服务账户异常
  svc_backup平时：只执行备份程序
  突然被用于远程桌面登录 → 高危（凭据被窃）

场景9: 异常的Kerberos行为
  普通用户平时：5-10个TGS请求/小时
  突然1000+个TGS请求/小时 → Kerberoasting攻击

场景10: 异常进程行为
  进程平时：读取文件/连接内网数据库
  突然：写新文件/连接外网IP → 可疑
```

---

## 三、开源 UEBA 方案

```yaml
# Elastic Stack ML (Elasticsearch X-Pack ML Jobs)

# 配置异常登录检测 Job
PUT _ml/anomaly_detectors/auth_anomaly
{
  "description": "Detect anomalous authentication",
  "analysis_config": {
    "bucket_span": "15m",
    "detectors": [
      {
        "function": "high_count",
        "by_field_name": "user.name",
        "partition_field_name": "host.name"
      }
    ]
  },
  "data_description": {
    "time_field": "@timestamp"
  }
}
```

```python
# Isolation Forest 异常检测示例
from sklearn.ensemble import IsolationForest
import numpy as np

# 特征：用户每日行为向量
# [登录次数, 文件访问数, 传输字节量, 登录时间方差, VPN时长]
user_behavior = np.array([
    [10, 100, 500000, 2, 60],     # 正常用户
    [12, 120, 600000, 3, 90],     # 正常用户
    [800, 5000, 50000000, 20, 720], # ← 异常！
])

model = IsolationForest(contamination=0.1)
model.fit(user_behavior)

# 预测异常
predictions = model.predict(user_behavior)
# -1 = 异常, 1 = 正常
for i, pred in enumerate(predictions):
    if pred == -1:
        print(f"用户{i}行为异常!")
```

---

## 四、UEBA 告警与 SIEM 联动

```
UEBA 告警 ≠ 独立事件
UEBA 告警 × SIEM规则 = 高置信度检测

联动示例：
  UEBA: "用户X行为异常(文件访问量飙升500%)"
  + SIEM: "用户X刚通过VPN从境外登录"
  + SIEM: "用户X正在访问从未碰过的数据库表"
  → 综合判断: 数据正在被窃取 → P1告警

部署架构：
  UEBA(Elastic ML/自有模型) → 
  输出异常分数到Elasticsearch/Kafka → 
  SIEM规则订阅异常事件 → 关联分析 → 告警
```

---

## 五、Checklist

- [ ] 确定UEBA检测场景(Top 10)
- [ ] 行为基线建立(至少30天数据)
- [ ] UEBA告警与SIEM关联规则
- [ ] 误报率评估(初期人工审核)
- [ ] 模型持续更新（每月重训练）
- [ ] 离职人员/高危用户专项监控
