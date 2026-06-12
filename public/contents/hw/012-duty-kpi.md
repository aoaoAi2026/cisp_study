# 护网值班人员KPI考核与激励制度

> 📅 2026-06-12 | 🎯 进阶 | ⏱ 18 min | 分类：护网工程

## 📋 提纲

1. KPI考核原则
2. Tier1/Tier2/Tier3 分级KPI
3. 扣分/加分项设计
4. 自动采集系统
5. 护网后激励方案
6. KPI Dashboard

---

## 1. 考核原则

```
护网KPI不是"抓错人"——是激励团队在高压下做出最佳表现。

原则：
1. 重过程轻结果：做了什么 > 最终得失分（攻防结果有随机性）
2. 鼓励主动发现：主动发现的攻击 ×2 权重
3. 容错机制：新手第一年不设硬性扣分
4. 团队整体评分：Tier1-3一起考核，不内耗
5. 匿名反馈：每班次后匿名评价队友
```

---

## 2. 分级KPI

### 2.1 Tier1 分析师KPI

```python
#!/usr/bin/env python3
class Tier1KPI:
    def __init__(self, analyst_name):
        self.name = analyst_name
        self.metrics = {
            # 数量指标（40%）
            "alerts_handled": 0,           # 处置告警数 目标: >50/班
            "alerts_escalated": 0,         # 升级告警数
            "auto_block_ips": 0,           # 自动封禁IP数

            # 质量指标（40%）
            "accurate_verdict_rate": 0,    # 研判准确率 目标: >85%
            "false_positive_rate": 0,      # 误报率（越低越好）目标: <30%
            "false_negative_count": 0,     # 漏判数（严重扣分）

            # 时效指标（20%）
            "avg_triage_time_seconds": 0,  # 平均研判时间 目标: <5min
            "handover_completeness": 0,    # 交接完整率 目标: 100%
            "missed_shifts": 0,            # 缺勤次数（严重扣分）
        }

    def calculate_score(self):
        scores = {}

        # 数量得分
        handled = self.metrics['alerts_handled']
        if handled >= 80:
            scores['quantity'] = 40
        elif handled >= 50:
            scores['quantity'] = 30 + (handled - 50) * 0.33
        elif handled >= 30:
            scores['quantity'] = 20 + (handled - 30) * 0.5
        else:
            scores['quantity'] = max(0, handled * 0.5)

        # 质量得分
        acc = self.metrics['accurate_verdict_rate']
        if acc >= 0.95:
            scores['quality'] = 40 + (acc - 0.95) * 200  # 超过95%有奖励
        elif acc >= 0.85:
            scores['quality'] = 35
        elif acc >= 0.70:
            scores['quality'] = 25
        else:
            scores['quality'] = 15

        # 漏判扣分（每漏判1个P1扣10分）
        fn = self.metrics['false_negative_count']
        scores['quality'] -= fn * 10
        scores['quality'] = max(0, scores['quality'])

        # 时效得分
        avg_time = self.metrics['avg_triage_time_seconds']
        if avg_time <= 180:  # 3分钟内
            scores['timeliness'] = 20
        elif avg_time <= 300:  # 5分钟内
            scores['timeliness'] = 15
        elif avg_time <= 600:  # 10分钟内
            scores['timeliness'] = 10
        else:
            scores['timeliness'] = 5

        # 缺勤
        scores['timeliness'] -= self.metrics['missed_shifts'] * 10

        total = sum(scores.values())
        total = max(0, min(100, total))

        # 等级
        if total >= 90:
            grade = "S - 卓越"
        elif total >= 80:
            grade = "A - 优秀"
        elif total >= 70:
            grade = "B - 良好"
        elif total >= 60:
            grade = "C - 合格"
        else:
            grade = "D - 需改进"

        return {"score": round(total, 1), "grade": grade, "breakdown": scores}
```

### 2.2 Tier2 高级分析师KPI

| 指标 | 权重 | 目标值 | 计算方式 |
|------|------|--------|---------|
| P1事件处置成功率 | 25% | >95% | 处置成功/处置总数 |
| 攻击链还原率 | 20% | >80% | 完整还原攻击链的事件数/确认真阳性事件数 |
| Sigma规则贡献 | 15% | >3条/护网 | 有效新增检测规则数 |
| Tier1指导质量 | 15% | Tier1评价>4.5/5 | 匿名Tier1评分 |
| 平均分析时间 | 15% | P1<30min, P2<2h | 从接警到完成分析 |
| IOC输出 | 10% | >20条/护网 | 经MISP验证的有效IOC数 |

### 2.3 Tier3 专家KPI

| 指标 | 权重 | 目标值 |
|------|------|--------|
| 应急响应速度 | 30% | 接通知后15min内到场/上线 |
| 事件处置效果 | 30% | 根除率100%, 无二次复发 |
| 技术输出 | 20% | 护网后输出技术复盘报告+改进方案 |
| 团队赋能 | 20% | 护网期间至少1次全员技术分享 |

---

## 3. 加分/扣分项

### 加分项（红榜）

```python
BONUS_POINTS = {
    "主动发现未被检测到的攻击": 20,
    "成功溯源到攻击者身份": 15,
    "编写高质量Sigma规则（并被采纳）": 10,
    "主动提交高质量威胁情报（>10条）": 8,
    "应急处置速度<5分钟（P1事件）": 5,
    "护网期间零失误": 5,
    "主动帮助同事解决难题": 3,
    "发现新的攻击手法并通报": 10,
}
```

### 扣分项（黑榜）

```python
PENALTY_POINTS = {
    "P1漏判导致攻击成功": -30,
    "P2漏判导致攻击扩散": -15,
    "应急响应迟到>30分钟": -20,
    "未按时交接班": -10,
    "告警未按时处置（超SLA）": -5,
    "未按要求记录工单": -3,
    "护网期间擅离值守": -25,
    "泄露内部信息（对外透露护网情况）": -50,  # 严重违规
}
```

---

## 4. KPI自动采集系统

```python
#!/usr/bin/env python3
"""
护网KPI自动采集器
每小时自动从各系统采集数据，生成实时KPI报表
"""

import requests
import json
from datetime import datetime, timedelta
from collections import defaultdict

class HWKPICollector:
    def __init__(self, es_url, thehive_url, wazuh_url):
        self.es = es_url
        self.thehive = thehive_url
        self.wazuh = wazuh_url
        self.kpi_data = defaultdict(dict)

    def collect_tier1_kpi(self, analyst_name, shift_date):
        """采集Tier1 KPI数据"""
        kpi = {}

        # 1. 告警处置数（从TheHive工单）
        kpi['alerts_handled'] = self.query_thehive_cases(
            analyst_name, shift_date,
            status="closed"
        )

        # 2. 升级数
        kpi['alerts_escalated'] = self.query_thehive_cases(
            analyst_name, shift_date,
            escalation="yes"
        )

        # 3. 研判准确率（用Tier2复核结果反向计算）
        reviewed = self.query_tier2_review(analyst_name, shift_date)
        correct = sum(1 for r in reviewed if r['verdict'] == 'correct')
        total = len(reviewed)
        kpi['accurate_verdict_rate'] = correct / total if total else 0

        # 4. 平均研判时间（从TheHive时间戳计算）
        kpi['avg_triage_time_seconds'] = self.calc_avg_triage_time(
            analyst_name, shift_date
        )

        # 5. 漏判检测
        kpi['false_negative_count'] = self.detect_false_negatives(
            analyst_name, shift_date
        )

        # 6. 封禁IP数
        kpi['auto_block_ips'] = self.query_es_blocks(analyst_name, shift_date)

        return kpi

    def query_thehive_cases(self, analyst, date, **filters):
        """查询TheHive工单统计"""
        # TheHive API查询
        query = {
            "query": {
                "_and": [
                    {"_field": "createdBy", "_value": analyst},
                    {"_gte": {"_field": "createdAt", "_value": f"{date}T00:00:00Z"}},
                    {"_lt": {"_field": "createdAt", "_value": f"{date}T23:59:59Z"}},
                ]
            }
        }

        for key, value in filters.items():
            if key == 'status':
                query['query']['_and'].append(
                    {"_field": "status", "_value": value}
                )
            if key == 'escalation':
                query['query']['_and'].append(
                    {"_gt": {"_field": "severity", "_value": 2}}
                )

        resp = requests.post(
            f"{self.thehive}/api/v1/query",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json=query
        )
        return len(resp.json())

    def calc_avg_triage_time(self, analyst, date):
        """计算平均研判时间"""
        # 从TheHive工单的创建时间到关闭时间
        resp = requests.post(
            f"{self.thehive}/api/v1/query",
            json={
                "query": [
                    {"_field": "createdBy", "_value": analyst},
                    {"_field": "status", "_value": "Closed"},
                    {"_gte": {"_field": "createdAt", "_value": f"{date}"}},
                ]
            },
            headers={"Authorization": f"Bearer {self.api_key}"}
        )

        cases = resp.json()
        if not cases:
            return 0

        total_seconds = 0
        for case in cases:
            created = datetime.fromtimestamp(case['createdAt'] / 1000)
            closed = datetime.fromtimestamp(case['updatedAt'] / 1000)
            total_seconds += (closed - created).total_seconds()

        return total_seconds / len(cases)

    def detect_false_negatives(self, analyst, date):
        """
        检测漏判：
        1. 查找分析师标记为"误报"但后来被Tier2确认为"真阳"的告警
        2. 查找未处理的告警中后来被确认为真实的
        """
        false_negatives = []

        # 查询该分析师标记为误报/忽略的告警
        resp = requests.post(
            f"{self.thehive}/api/v1/query",
            json={
                "query": [
                    {"_field": "createdBy", "_value": analyst},
                    {"_field": "status", "_value": "Ignored"},
                    {"_gte": {"_field": "createdAt", "_value": f"{date}"}},
                ]
            },
            headers={"Authorization": f"Bearer {self.api_key}"}
        )

        ignored = resp.json()
        for case in ignored:
            # 检查是否有后续事件证实这是真实攻击
            related_events = self.find_related_events(case)
            if related_events:
                false_negatives.append({
                    "case_id": case['id'],
                    "title": case['title'],
                    "related_events": related_events
                })

        return len(false_negatives)

    def generate_daily_kpi_report(self, date):
        """生成KPI日报"""
        report = {
            "date": date,
            "generated_at": datetime.now().isoformat(),
            "tier1": {},
            "tier2": {},
            "team_stats": {},
            "highlights": [],
            "warnings": []
        }

        # 逐人采集
        for analyst in self.get_on_duty_analysts(date):
            report['tier1'][analyst] = self.collect_tier1_kpi(analyst, date)

        # 团队统计
        all_handled = sum(a['alerts_handled'] for a in report['tier1'].values())
        all_accurate = sum(
            a['alerts_handled'] * a.get('accurate_verdict_rate', 0)
            for a in report['tier1'].values()
        )

        report['team_stats'] = {
            "total_alerts_handled": all_handled,
            "avg_accuracy": f"{all_accurate/max(all_handled,1)*100:.1f}%",
            "false_negatives": sum(
                a.get('false_negative_count', 0)
                for a in report['tier1'].values()
            ),
            "on_time_handover": "100%",  # 从交接记录计算
        }

        # 标注优秀/需改进
        for analyst, kpi in report['tier1'].items():
            tier1 = Tier1KPI(analyst)
            for k, v in kpi.items():
                tier1.metrics[k] = v
            result = tier1.calculate_score()
            kpi['score'] = result['score']
            kpi['grade'] = result['grade']

            if result['grade'].startswith('S'):
                report['highlights'].append(f"⭐ {analyst}: {result['grade']}")
            elif result['grade'].startswith('D'):
                report['warnings'].append(f"⚠️ {analyst}: {result['grade']}，需关注")

        return report

    def get_on_duty_analysts(self, date):
        """获取当天值班人员名单"""
        # 从排班系统获取
        return ["张三", "李四", "王五", "赵六"]  # 示例

    def find_related_events(self, case):
        """查找关联事件"""
        return []

    def query_es_blocks(self, analyst, date):
        return 0  # 从Wazuh API获取


if __name__ == "__main__":
    collector = HWKPICollector(
        es_url="http://elasticsearch:9200",
        thehive_url="http://thehive:9000",
        wazuh_url="http://wazuh:55000"
    )

    report = collector.generate_daily_kpi_report("2026-06-12")
    print(json.dumps(report, indent=2, ensure_ascii=False))
```

---

## 5. 激励方案

### 5.1 物质激励

| 等级 | 奖励 | 条件 |
|------|------|------|
| S级 | 护网奖金 × 2.0 + 额外假期3天 | KPI ≥ 90 + 重大贡献 |
| A级 | 护网奖金 × 1.5 + 额外假期1天 | KPI ≥ 80 |
| B级 | 护网奖金 × 1.0 | KPI ≥ 70 |
| C级 | 护网奖金 × 0.5 | KPI ≥ 60 |
| D级 | 无奖金 + 复盘面谈 | KPI < 60 |

### 5.2 精神激励

- 护网荣誉墙：S/A级永久展示
- "护网之星"勋章：每轮评选3人
- 优先晋升：S级连续2轮纳入晋升池
- 对外展示：S级事迹写入安全团队年报

---

## 6. KPI Dashboard

```json
{
  "dashboard": {
    "title": "护网KPI实时看板",
    "panels": [
      {
        "title": "Tier1分析师排名",
        "type": "bar_gauge",
        "sort": "KPI分数",
        "colors": {"90-100": "green", "70-89": "yellow", "0-69": "red"}
      },
      {
        "title": "告警处置量趋势",
        "type": "timeseries",
        "group_by": "analyst"
      },
      {
        "title": "研判准确率",
        "type": "gauge",
        "thresholds": [{"value": 85, "color": "green"}, {"value": 70, "color": "yellow"}]
      },
      {
        "title": "平均研判时间（分钟）",
        "type": "stat",
        "thresholds": [{"value": 5, "color": "green"}, {"value": 10, "color": "red"}]
      },
      {
        "title": "漏判事件",
        "type": "table",
        "columns": ["分析师", "事件ID", "描述", "等级"]
      }
    ]
  }
}
```

---

## ✅ KPI制度 Checklist

- [ ] KPI指标确认（Tier1/Tier2/Tier3差异化）
- [ ] KPI自动采集脚本开发完成
- [ ] TheHive API数据对接
- [ ] 每日KPI日报自动生成
- [ ] KPI Dashboard上线
- [ ] 激励方案报批
- [ ] 护网前全员宣讲KPI规则
- [ ] 护网后KPI汇总 + 激励发放
- [ ] 匿名反馈收集

> 📚 延伸阅读：HW/001-蓝队防护方案 | HW/004-值班方案 | SOC/006-安全指标体系
