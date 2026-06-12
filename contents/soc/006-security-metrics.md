# 安全运营指标体系与量化管理

---

## 一、运营指标金字塔

```
安全指标金字塔 (从上到下)：

      ┌──────────────┐
      │  业务指标      │ ← 对董事会/CEO: 风险降低/损失避免
      ├──────────────┤
      │  效果指标      │ ← 对CISO: 覆盖率/检出率/修复率
      ├──────────────┤
      │  效率指标      │ ← 对SOC Manager: MTTD/MTTR/自动化率
      ├──────────────┤
      │  运营指标      │ ← 对分析师: 告警量/处理量/准确率
      └──────────────┘
```

---

## 二、MTTD/MTTR 体系

### 2.1 MTTx 定义

```
MTTD (Mean Time to Detect) — 平均检测时间
  从攻击者首次行动 → SIEM/EDR产生告警的时间
  行业基准：<1小时 (成熟SOC: <15分钟)

MTTA (Mean Time to Acknowledge) — 平均确认时间
  从告警产生 → 分析师确认告警的时间
  行业基准：<30分钟 (成熟SOC: <5分钟)

MTTR (Mean Time to Respond/Resolve) — 平均响应时间
  从告警确认 → 事件关闭的时间
  行业基准：<4小时 (成熟SOC: <1小时)

MTTC (Mean Time to Contain) — 平均遏制时间
  从确认事件 → 攻击被遏制(隔离/阻断)的时间
  行业基准：<1小时 (成熟SOC: <15分钟)
```

### 2.2 MTTD/MTTR 计算

```python
class MetricsCalculator:
    """安全运营指标计算"""
    
    def calculate_mttd(self, incidents):
        """MTTD = 平均(检测时间 - 事件开始时间)"""
        total = 0
        for inc in incidents:
            detection_delta = inc.detection_time - inc.start_time
            total += detection_delta.total_seconds()
        return total / len(incidents) / 3600  # 小时
    
    def calculate_mttr(self, incidents):
        """MTTR = 平均(关闭时间 - 检测时间)"""
        total = 0
        for inc in incidents:
            resolution_delta = inc.close_time - inc.detection_time
            total += resolution_delta.total_seconds()
        return total / len(incidents) / 3600
```

---

## 三、核心KPI指标

### 3.1 检测能力指标

```
检出率 (Detection Rate / True Positive Rate):
  检出率 = 正确告警 / (正确告警 + 漏报)
  目标: >95%

误报率 (False Positive Rate):
  误报率 = 误报告警 / 总告警
  目标: <10%

告警覆盖率 (Alert Coverage):
  ATT&CK技术中已被检测规则覆盖的比例
  目标: 覆盖ATT&CK Top 50技术

漏报发现率 (Missed Detection Discovery):
  通过红蓝对抗/渗透测试发现的新漏报
  用于驱动检测规则优化
```

### 3.2 响应能力指标

```
自动化率 (Automation Rate):
  自动化率 = 自动化处置告警 / 总告警
  目标: >60% (>80%为优秀)

SLA达标率:
  P1事件 15分钟响应/1小时闭环
  P2事件 1小时响应/4小时闭环
  P3事件 4小时响应/24小时闭环
  
平均处理时长 (Average Handling Time):
  分析师从打开告警到完成分析的时间
  目标: <15分钟
```

### 3.3 效果指标

```
漏洞修复率:
  修复率 = 已修复漏洞 / 应修复漏洞
  Critical: 24小时内修复率 >95%
  High: 7天内修复率 >90%

攻击面缩减:
  对外暴露的服务/端口数量的减少趋势

安全事件趋势:
  本月严重事件数 vs 上月 vs 去年同期
  趋势下降 = 防护有效
```

---

## 四、RSAC 安全度量框架

```
RSAC (RSA Conference) 推荐的安全度量：

1. 覆盖率指标
   - 终端EDR覆盖率
   - 日志采集覆盖率
   - 网络流量采集覆盖率

2. 有效性指标
   - 红蓝对抗中蓝队检出比例
   - ATT&CK检测覆盖率
   - Phishing演练中员工上报率

3. 时效性指标
   - MTTD / MTTA / MTTR / MTTC (如上)

4. 效率指标
   - 分析师人均处理告警量
   - 告警误报率
   - 自动化处置比例

5. 业务影响指标
   - 安全事件导致的服务中断时长
   - 恶意软件感染后恢复成本
   - 勒索事件赎金 + 恢复成本
```

---

## 五、持续改进 (PDCA)

```
安全运营PDCA环：

Plan (计划):
  ├── 季度/年度安全运营目标
  ├── 新增检测场景规划
  └── 预算与资源分配

Do (执行):
  ├── 日常监控+告警处理
  ├── 事件响应+威胁狩猎
  └── 规则开发+自动化编写

Check (检查):
  ├── 月度运营指标Review
  ├── 红蓝对抗验证(蓝队检出率)
  ├── 告警质量抽样审核
  └── 第三方安全评估

Act (改进):
  ├── 根据Review结果调整策略
  ├── 优化检测规则(低质量→下线)
  ├── 提升自动化覆盖场景
  └── 团队培训与技术提升
```

---

## 六、Checklist

- [ ] 建立运营指标基线
- [ ] MTTD/MTTR/MTTC体系化追踪
- [ ] 检测覆盖率对标ATT&CK矩阵
- [ ] 自动化率月度提升计划
- [ ] 月度运营复盘(指标+案例+改进)
- [ ] 红蓝对抗验证检测有效性
- [ ] 安全运营SLA建立与考核
- [ ] 第三方安全评估(年度)
- [ ] 运营管理看板(实时KPI)
