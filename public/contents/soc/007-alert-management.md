# SOC 告警分级、降噪与处理流程实战

> 📅 2026-06-12 | 🎯 进阶 | ⏱ 18 min | 分类：安全运营/SOC

## 📋 提纲

1. 告警分类体系
2. P1-P4 四级分类标准
3. 告警降噪策略
4. Tier1-3流转规则
5. 告警SLA设计
6. 告警质量度量

---

## 1. 告警分类体系

```
P1 (Critical)  - 已确认正在进行的成功攻击，需要立即响应
P2 (High)      - 很可能正在发生攻击，需要紧急调查
P3 (Medium)    - 可疑行为，需要例行调查
P4 (Low)       - 信息性告警，日常关注
```

### 1.1 P1 判定标准

触发即P1：
- EDR检测到恶意软件执行
- 成功的数据外传（>100MB）
- 域控上检测到异常操作
- 特权账号在非工作时间登录
- 攻击者获取SYSTEM/DA权限
- Webshell成功上传

### 1.2 告警判定自动化

```python
class AlertClassifier:
    def classify(self, alert):
        """自动判定告警等级"""
        score = 0

        # 攻击成功标记
        if alert.get('attack_success'):
            score += 40

        # 涉及关键资产
        if alert.get('asset', {}).get('is_critical'):
            score += 30

        # 威胁情报命中
        if alert.get('threat_intel', {}).get('malicious'):
            score += 20

        # 高危告警类型
        if alert['rule_id'] in ['mimikatz_detected', 'lsass_access', 'c2_beacon', 
                                 'ransomware_activity', 'data_exfiltration']:
            score += 30

        # 横向移动
        if alert.get('lateral_movement'):
            score += 25

        # 非工作时间
        hour = alert.get('timestamp', {}).get('hour', 12)
        if hour in [0, 1, 2, 3, 4, 5, 22, 23]:
            score += 10

        # 判定
        if score >= 70:    return "P1"
        elif score >= 40:  return "P2"
        elif score >= 20:  return "P3"
        else:              return "P4"

    def get_sla(self, priority):
        return {
            "P1": {"response": "5 min", "containment": "15 min", "resolution": "4 h"},
            "P2": {"response": "15 min", "containment": "1 h", "resolution": "24 h"},
            "P3": {"response": "1 h", "containment": "8 h", "resolution": "72 h"},
            "P4": {"response": "24 h", "containment": "N/A", "resolution": "7 d"},
        }.get(priority, {})
```

---

## 2. Tier1-3 流转规则

```
告警产生 → 自动分类
  ├─ P4 → 直接归档（不通知人）
  ├─ P3 → Tier1队列（2h内处理）
  ├─ P2 → Tier1队列 + 通知（30min内必处理）
  └─ P1 → 跳过Tier1，直接通知Tier2+Tier3
```

### 2.1 Tier1 操作手册

```python
#!/usr/bin/env python3
"""Tier1 分析师告警处理SOP自动化"""

class Tier1SOP:
    def handle_alert(self, alert):
        """Tier1 标准处理流程"""
        enriched = self.enrich(alert)
        verdict = self.triage(enriched)

        actions = {
            "false_positive": self.close_as_fp,
            "known_good": self.close_as_known,
            "suspicious": self.escalate_to_tier2,
            "malicious": self.emergency_escalate,
        }

        return actions.get(verdict, self.escalate_to_tier2)(enriched)

    def triage(self, enriched):
        """Tier1 研判逻辑"""
        # 检查：是不是已知攻击 → 工具自动判定为真阳
        # 检查：是不是内部安全工具触发 → 白名单
        # 检查：检查资产环境 → 测试环境可降级
        # 检查：关联历史 → 同类告警是否常出现

        if self.is_internal_tool(enriched):
            return "known_good"

        if self.is_definitely_malicious(enriched):
            return "malicious"

        if self.needs_investigation(enriched):
            return "suspicious"

        return "false_positive"

    def emergency_escalate(self, enriched):
        """紧急升级 - 直接通知Tier3"""
        self.create_p1_incident(enriched)
        self.send_urgent_notification(enriched)
        self.auto_contain(enriched)  # 如果可以自动遏制
```

---

## 3. 告警质量度量

| 指标 | 计算 | 目标 |
|------|------|------|
| 误报率 | FP/总告警 | <30% |
| 漏报率 | 确认攻击中未被检测的 | <5% |
| 平均判定时间 | 告警产生→Tier1判定 | <5min |
| 升级准确率 | 升级后确认真阳/总升级 | >80% |
| 自动化率 | SOAR自动处置/总告警 | >60% |

---

## ✅ 告警管理 Checklist

- [ ] P1-P4分级标准确认
- [ ] Tier1 SOP文档
- [ ] 告警降噪配置
- [ ] 告警质量周报

> 📚 延伸阅读：SOC/001-SOC建设 | SOC/002-SIEM分析 | SOC/009-EDR运营
