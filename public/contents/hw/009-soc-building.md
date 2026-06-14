# 护网中SOC建设与告警降噪实战

> **📘 文档定位**：CISP 考试 护网行动 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：25 分钟
>
> 系统讲解护网期间 SOC 的建设要点与告警降噪策略，覆盖战时 SOC 增强/高频告警处理/误报过滤/自动化响应方案。

---

## 导航目录

- [一、护网 SOC 增强策略](#一护网-soc-增强策略)
- [二、告警降噪方法论](#二告警降噪方法论)
- [三、高频告警应对](#三高频告警应对)
- [四、自动化响应方案](#四自动化响应方案)
- [五、安全部署 Checklist](#五安全部署-checklist)
- [六、高分考点与知识巧记](#六高分考点与知识巧记)

---

> 📅 2026-06-12 | 🎯 进阶 | ⏱ 20 min | 分类：护网工程

## 📋 提纲

1. 护网SOC与日常SOC的差异
2. 告警降噪五层策略
3. 护网专用检测规则集
4. 告警优先级动态调整
5. 护网值班Dashboard
6. 护网日报/班次报模板

---

## 1. 护网SOC vs 日常SOC

| 维度 | 日常 | 护网 |
|------|------|------|
| 日均告警量 | 200-500 | 2000-5000 |
| 误报率目标 | <30% | <10% |
| 告警SLA | 30min | 5-15min |
| EDR模式 | 检测 | 阻断 |
| 规则集 | 日常200+ | 护网增强400+ |
| 值班人数 | 2-4人 | 6-12人 |
| 日报频次 | 周报/月报 | 小时报/班次报 |

---

## 2. 告警降噪五层策略

### 2.1 降噪架构

```
原始告警(5000条/天)
    ↓
第1层：白名单过滤 → 去掉已知安全测试/运维操作(剩余3500)
    ↓
第2层：资产上下文 → 结合资产价值/角色过滤(剩余2000)
    ↓
第3层：告警合并 → 同IP/同类型5分钟窗口合并(剩余800)
    ↓
第4层：动态基线 → 与正常行为基线比较(剩余300)
    ↓  
第5层：威胁情报富化 → 标注威胁等级(剩余100条可处理告警)
```

### 2.2 实现代码

```python
#!/usr/bin/env python3
"""告警降噪引擎"""

from dataclasses import dataclass, field
from typing import List, Dict
from datetime import datetime, timedelta
from collections import defaultdict
import json

@dataclass
class Alert:
    id: str
    timestamp: datetime
    source_ip: str
    dest_ip: str
    rule_id: str
    severity: str  # critical/high/medium/low
    description: str
    asset_info: Dict = field(default_factory=dict)
    threat_intel: Dict = field(default_factory=dict)

class AlertNoiseReducer:
    def __init__(self, config):
        self.config = config
        self.whitelist = self.load_whitelist()
        self.asset_db = self.load_asset_db()

    def reduce(self, alerts: List[Alert]) -> List[Alert]:
        """五层降噪流水线"""
        print(f"原始告警: {len(alerts)}")

        # 第1层：白名单过滤
        after_l1 = self.layer1_whitelist(alerts)
        print(f"L1白名单后: {len(after_l1)}")

        # 第2层：资产上下文过滤
        after_l2 = self.layer2_asset_context(after_l1)
        print(f"L2资产上下文后: {len(after_l2)}")

        # 第3层：告警合并（去重）
        after_l3 = self.layer3_merge(after_l2)
        print(f"L3合并后: {len(after_l3)}")

        # 第4层：动态基线
        after_l4 = self.layer4_baseline(after_l3)
        print(f"L4基线后: {len(after_l4)}")

        # 第5层：威胁情报标注
        after_l5 = self.layer5_threat_intel(after_l4)
        print(f"L5情报富化后: {len(after_l5)}")
        print(f"降噪率: {(1-len(after_l5)/max(len(alerts),1))*100:.1f}%")

        return after_l5

    def layer1_whitelist(self, alerts):
        """第1层：白名单过滤"""
        filtered = []
        for alert in alerts:
            key = f"{alert.source_ip}_{alert.rule_id}"
            if key in self.whitelist:
                continue  # 白名单中的告警直接丢弃

            # 跳过已知的扫描器/漏洞扫描器IP
            if self.is_known_scanner(alert.source_ip):
                continue

            # 跳过内部安全工具的告警
            if self.is_internal_tool(alert.source_ip):
                continue

            filtered.append(alert)
        return filtered

    def layer2_asset_context(self, alerts):
        """第2层：资产上下文过滤"""
        filtered = []
        for alert in alerts:
            asset = self.asset_db.get(alert.dest_ip, {})

            # 开发/测试环境 → 降低告警优先级或过滤
            if asset.get('env') == 'dev':
                if alert.severity in ['low', 'medium']:
                    continue  # 开发环境低中危不告警

            # 非关键资产 → 过滤低危
            if not asset.get('is_critical'):
                if alert.severity == 'low':
                    continue

            # 资产未上线（已退役？）
            if asset.get('status') == 'decommissioned':
                continue

            # 补充资产信息
            alert.asset_info = asset
            filtered.append(alert)

        return filtered

    def layer3_merge(self, alerts):
        """第3层：告警合并 - 同源IP+同规则5分钟内合并"""
        buckets = defaultdict(list)
        window = timedelta(minutes=5)

        for alert in alerts:
            key = f"{alert.source_ip}_{alert.rule_id}"
            buckets[key].append(alert)

        merged = []
        for key, bucket in buckets.items():
            bucket.sort(key=lambda x: x.timestamp)

            current_group = [bucket[0]]
            for alert in bucket[1:]:
                if alert.timestamp - current_group[-1].timestamp <= window:
                    current_group.append(alert)
                else:
                    merged.append(self.merge_group(current_group))
                    current_group = [alert]

            merged.append(self.merge_group(current_group))

        return merged

    def merge_group(self, group):
        """合并一组相似告警"""
        merged = group[0]
        merged.description = f"{merged.description} (合并{len(group)}条, 时间范围{group[0].timestamp}-{group[-1].timestamp})"

        # 如果合并数超过阈值，升级告警
        if len(group) >= 20:
            if merged.severity != 'critical':
                merged.severity = 'critical'
                merged.description += " [已自动升级为CRITICAL]"

        return merged

    def layer4_baseline(self, alerts):
        """第4层：动态基线"""
        filtered = []
        for alert in alerts:
            # 查询该IP在过去7天的告警频率
            baseline = self.get_baseline(alert.source_ip, alert.rule_id, days=7)

            # 如果当前与基线偏差不大 → 可能是正常波动
            if baseline.get('avg_daily', 0) > 0:
                today_count = self.get_today_count(alert.source_ip, alert.rule_id)
                deviation = today_count / baseline['avg_daily']

                if deviation < 2:  # 没超过2倍基线
                    alert.severity = 'low'  # 降级

            # 如果是第一次出现 → 反而值得关注
            if baseline.get('total', 0) == 0:
                alert.description += " [首次出现-需关注]"

            filtered.append(alert)
        return filtered

    def layer5_threat_intel(self, alerts):
        """第5层：威胁情报富化"""
        for alert in alerts:
            # 查询威胁情报
            intel = self.query_threat_intel(alert.source_ip)
            alert.threat_intel = intel

            # 已知恶意IP → 升级
            if intel.get('malicious'):
                if alert.severity != 'critical':
                    alert.severity = 'critical'
                    alert.description += " [威胁情报命中-恶意IP]"

            # 高风险国家
            if intel.get('country') in ['RU', 'KP', 'IR']:
                if alert.severity == 'low':
                    alert.severity = 'medium'
                    alert.description += " [高风险国家]"

        return alerts

    def is_known_scanner(self, ip):
        scanners = ['shodan', 'censys', 'zoomeye', 'fofa']
        # 查询IP是否属于已知扫描引擎
        try:
            import socket
            hostname = socket.gethostbyaddr(ip)[0]
            return any(s in hostname.lower() for s in scanners)
        except:
            return False

    def is_internal_tool(self, ip):
        # 内部工具IP白名单
        return ip.startswith('10.0.100.')  # 安全工具段

    def get_baseline(self, ip, rule_id, days):
        # 从ES查询历史基线
        return {"avg_daily": 5, "total": 35}

    def get_today_count(self, ip, rule_id):
        return 8

    def query_threat_intel(self, ip):
        return {"malicious": False, "country": "CN"}

    def load_whitelist(self):
        return set()

    def load_asset_db(self):
        return {}

    def load_config(self):
        return {}
```

---

## 3. 护网增强规则集

```python
# 护网期间全局规则调整
HW_RULES = {
    # 1. 境外IP告警提升一级
    "foreign_ip_escalation": {
        "condition": "alert.source_ip.geo.country NOT IN ('CN')",
        "action": "severity += 1",
    },

    # 2. 非工作时间检测灵敏度提升
    "off_hours_sensitivity": {
        "condition": "alert.timestamp.hour IN (0,1,2,3,4,5,6,22,23)",
        "action": "add_tags(['off_hours', 'hw_enhanced'])",
    },

    # 3. 告警聚合窗口缩短
    "merge_window": {
        "default": 10,  # 日常10分钟
        "hw": 3,         # 护网3分钟
    },

    # 4. 可疑域名列表
    "suspicious_tlds": [".top", ".xyz", ".tk", ".ml", ".ga", ".cf", ".pw", ".cc", ".ws"],

    # 5. 内网横向移动检测增强
    "lateral_movement_sensitivity": "high",
}
```

---

## 4. 护网日报模板

```markdown
# 护网日报 - 2026年6月12日

## 告警总览
| 指标 | 数值 | 变化 |
|------|------|------|
| 总告警 | 4,521 | ↑12% |
| 降噪后 | 342 | - |
| P1事件 | 1 | 新增 |
| P2事件 | 5 | ↑1 |
| 自动封禁IP | 203 | - |
| 自动处置率 | 67.2% | ↓3% |

## 攻击态势
- 攻击来源 Top3: 美国(34%), 俄罗斯(18%), 荷兰(12%)
- 攻击类型 Top3: 漏洞扫描(41%), 暴力破解(27%), Web攻击(15%)

## 重大事件
1. **[P1] Exchange CVE利用** - 被WAF拦截，封禁攻击IP x 12
2. **[P2] VPN暴力破解** - 封禁攻击IP x 47，无成功登录

## 设备状态
- EDR在线率: 98.5%
- WAF: 正常
- IPS: 正常

## 明日关注
- 加强Exchange/SharePoint监控
- 预计攻击量会继续上升
- Tier1分析师张三病假，已调配李四顶班
```

---

## 5. 排错指南

| 问题 | 原因 | 解决 |
|------|------|------|
| 告警太多人处理不过来 | 降噪不够 | 收紧白名单+合并窗口+动态阈值 |
| 漏掉了真实攻击 | 降噪过度 | 降低降噪阈值+人工抽检 |
| 告警延迟>5分钟 | ES性能 | 增加节点+优化索引+增大refresh_interval |

---

## ✅ SOC护网 Checklist

- [ ] 降噪引擎部署调优
- [ ] 护网规则集切换
- [ ] EDR切换阻断模式
- [ ] 值班Dashboard上线
- [ ] 日报/班次报模板就绪
- [ ] 告警通知渠道验证

> 📚 延伸阅读：SOC/001-SOC建设 | SOC/002-SIEM分析 | HW/004-值班方案
