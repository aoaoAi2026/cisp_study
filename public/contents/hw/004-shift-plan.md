# 护网7x24值班方案与战时指挥体系

> **📘 文档定位**：CISP 考试 护网行动 核心 | 难度：⭐⭐⭐ | 预计阅读：25 分钟
>
> 系统讲解护网期间 7x24 值班方案设计、战时指挥体系搭建、信息通报机制及值班人员 KPI 考核方案。

---

## 导航目录

- [一、值班方案设计](#一值班方案设计)
- [二、战时指挥体系](#二战时指挥体系)
- [三、信息通报机制](#三信息通报机制)
- [四、人员调度与考核](#四人员调度与考核)
- [五、安全部署 Checklist](#五安全部署-checklist)
- [六、高分考点与知识巧记](#六高分考点与知识巧记)

---

> 📅 2026-06-12 | 🎯 进阶 | ⏱ 20 min | 分类：护网工程

## 📋 提纲

1. 护网值班特点与普通SOC的区别
2. 三级值班体系设计（一线/二线/专家组）
3. 排班方案（三班倒/四班三运转/五班三运转）
4. 交接班制度与SOP
5. 战时指挥链与信息通报
6. 告警升级与备勤激活机制
7. 值班环境搭建
8. 真实案例与排错

---

## 1. 护网值班 vs 日常 SOC 值班

| 维度 | 日常 SOC | 护网期间 |
|------|---------|---------|
| 值班人数 | 2-4 人/班 | 6-12 人/班 |
| 告警量 | 200-500 条/天 | 2000-5000 条/天 |
| 告警类型 | 常规攻击为主 | APT 级针对性攻击 |
| 误报率 | 30-50% | 10-20%（攻击密度高） |
| 处置SLA | 30-60 min | 5-15 min |
| 上报要求 | 内部周报 | 每日向指挥部汇报 |
| 心理压力 | 正常 | 极高（扣分焦虑） |
| 排班模式 | 三班倒 | 四班三运转/双人值班 |
| EDR模式 | 检测 | 阻断（主动模式） |
| 规则集 | 日常规则 | 护网增强规则 |

---

## 2. 三级值班体系

```
┌─────────────────────────────────────────────────┐
│              护网指挥部（总指挥 + 参谋）             │
│          决策重大事件、协调外部资源                   │
├─────────────────────────────────────────────────┤
│  第三级：Tier 3 专家应急组（7x24 电话待命）           │
│  - 应急响应专家（APT处置）                          │
│  - 取证专家（内存/磁盘取证）                         │
│  - 逆向专家（恶意样本分析）                          │
│  - 网络专家（封堵/引流/旁路）                        │
├─────────────────────────────────────────────────┤
│  第二级：Tier 2 高级分析师（现场值班）                 │
│  - 每班 2-4 人                                     │
│  - 复杂告警研判 + 攻击链还原                         │
│  - 处置决策（拦截/诱捕/溯源）                         │
├─────────────────────────────────────────────────┤
│  第一级：Tier 1 初级分析师（现场值班）                 │
│  - 每班 4-8 人                                     │
│  - 告警初筛 + 分流 + 快速封堵                        │
│  - 日志排查 + 设备巡检                               │
└─────────────────────────────────────────────────┘
```

### 2.1 各级职责与授权

**Tier 1 授权清单**：
- ✅ 封堵已知恶意IP（单IP/小段）
- ✅ 禁用已知恶意域名（DNS黑名单）
- ✅ 踢出可疑用户VPN会话
- ✅ 重置可疑用户密码（非特权账号）
- ❌ 封堵网段（需Tier2批准）
- ❌ 隔离服务器（需Tier2批准）
- ❌ 修改防火墙核心策略（需Tier3批准）

**Tier 2 授权清单**：
- ✅ Tier1 所有权限
- ✅ 隔离中低风险服务器
- ✅ 封锁A类网段（/16以上需Tier3）
- ✅ 启动EDR全盘扫描
- ✅ 启动终端网络隔离
- ✅ 通知受影响业务部门
- ❌ 断网/关停核心业务系统（需指挥部批准）

**Tier 3 授权清单**：
- ✅ Tier1 + Tier2 所有权限
- ✅ 启动全网络封堵
- ✅ 关停受影响业务系统
- ✅ 启动BCP/DRP（业务连续性计划）
- ✅ 对外通报（集团公司/监管机构）

---

## 3. 排班方案

### 3.1 四班三运转（推荐方案）

**适用于**：护网期间（通常2-3周），团队 20-30 人

```
班次设置：
A班 (白班) 08:00 - 16:00  (8h)  - 主防时段
B班 (晚班) 16:00 - 00:00  (8h)  - 次防时段  
C班 (夜班) 00:00 - 08:00  (8h)  - 最低防时段
D班 (休息)  全天休息         - 强制恢复

4天一循环：
Day  1: A白  B晚  C夜  D休
Day  2: D休  A白  B晚  C夜
Day  3: C夜  D休  A白  B晚
Day  4: B晚  C夜  D休  A白

优点：每个班次都有人，连续工作不超过2天
缺点：需要4组人，人力需求大
```

### 3.2 排班自动生成脚本

```python
#!/usr/bin/env python3
"""
护网排班自动生成器
输入：人员名单、技能等级、特殊约束
输出：Excel 排班表 + 通知
"""

from datetime import datetime, timedelta
import itertools
import random

class HWShiftPlanner:
    SHIFTS = {
        "白班": {"start": 8, "end": 16, "hours": 8, "min_tier1": 3, "min_tier2": 2},
        "晚班": {"start": 16, "end": 0, "hours": 8, "min_tier1": 4, "min_tier2": 2},
        "夜班": {"start": 0, "end": 8, "hours": 8, "min_tier1": 2, "min_tier2": 1},
    }

    def __init__(self, hw_start, hw_end):
        self.hw_start = datetime.strptime(hw_start, "%Y-%m-%d")
        self.hw_end = datetime.strptime(hw_end, "%Y-%m-%d")
        self.members = []  # [{"name": "xxx", "tier": 1-3, "constraints": {...}}, ...]
        self.schedule = {}  # {date: {"白班": [...], "晚班": [...], "夜班": [...]}}

    def add_member(self, name, tier, skills=None, constraints=None):
        """添加值班人员"""
        self.members.append({
            "name": name,
            "tier": tier,           # 1, 2, 3
            "skills": skills or [],  # ["network", "windows", "linux", "forensics"]
            "constraints": constraints or {},  # {"no_night": True, "max_consecutive": 2}
        })

    def generate(self):
        """生成完整排班表"""
        members_tier1 = [m for m in self.members if m['tier'] == 1]
        members_tier2 = [m for m in self.members if m['tier'] == 2]
        members_tier3 = [m for m in self.members if m['tier'] == 3]

        # 验证最低人力
        min_t1 = max(s['min_tier1'] for s in self.SHIFTS.values())
        min_t2 = max(s['min_tier2'] for s in self.SHIFTS.values())
        
        if len(members_tier1) < min_t1 * 2:
            raise ValueError(f"Tier1 人员不足，需要 {min_t1*2} 人（两倍于单班需求），现有 {len(members_tier1)}")
        if len(members_tier2) < min_t2 * 2:
            raise ValueError(f"Tier2 人员不足，需要 {min_t2*2} 人，现有 {len(members_tier2)}")

        # 为每个人追踪已排班次
        member_shifts = {m['name']: [] for m in self.members}
        member_consecutive = {m['name']: 0 for m in self.members}

        current_date = self.hw_start
        while current_date <= self.hw_end:
            date_key = current_date.strftime("%Y-%m-%d")
            self.schedule[date_key] = {"白班": [], "晚班": [], "夜班": []}

            for shift_name, shift_config in self.SHIFTS.items():
                self._assign_shift(
                    date_key, shift_name, shift_config,
                    members_tier1, members_tier2, members_tier3,
                    member_shifts, member_consecutive
                )

            current_date += timedelta(days=1)

        # 分配备班人员
        self._assign_backup(members_tier2, members_tier3)

        return self.schedule

    def _assign_shift(self, date_key, shift_name, shift_config, t1_pool, t2_pool, t3_pool, member_shifts, member_consecutive):
        """为一个班次分配人员"""
        assigned = []

        # 选择 Tier2（每班至少1人）
        available_t2 = self._get_available(t2_pool, date_key, shift_name, member_shifts, member_consecutive)
        t2_needed = shift_config['min_tier2']
        t2_picks = self._pick_best(available_t2, t2_needed, ["windows", "linux", "network"])
        assigned.extend(t2_picks)
        for m in t2_picks:
            member_shifts[m['name']].append(f"{date_key}_{shift_name}")

        # 选择 Tier1
        available_t1 = self._get_available(t1_pool, date_key, shift_name, member_shifts, member_consecutive)
        t1_needed = shift_config['min_tier1']
        t1_picks = self._pick_best(available_t1, t1_needed, ["alert_triage", "log_analysis"])
        assigned.extend(t1_picks)
        for m in t1_picks:
            member_shifts[m['name']].append(f"{date_key}_{shift_name}")

        # Tier3 专家：确保每班至少1人技能互补
        # Tier3 通常电话待命，不排固定班，但需要指定当班Tier3负责人
        available_t3 = self._get_available(t3_pool, date_key, shift_name, member_shifts, member_consecutive)
        if available_t3:
            t3_pick = available_t3[0]
            assigned.append(t3_pick)
            member_shifts[t3_pick['name']].append(f"{date_key}_{shift_name}_oncall")

        self.schedule[date_key][shift_name] = [{'name': a['name'], 'tier': a['tier']} for a in assigned]

    def _get_available(self, pool, date_key, shift_name, member_shifts, member_consecutive):
        """过滤出可用人员"""
        available = []
        for m in pool:
            # 检查约束
            constraints = m.get('constraints', {})

            # 不能连续上同一个班次超过2天
            recent_shifts = [s for s in member_shifts.get(m['name'], []) if date_key.split('-')[1:] == s.split('_')[0].split('-')[1:]]
            if len(recent_shifts) >= constraints.get('max_consecutive', 2):
                continue

            # 夜班限制
            if shift_name == '夜班' and constraints.get('no_night'):
                continue

            # 检查昨天是否值夜班（夜班后需要休息）
            yesterday = (datetime.strptime(date_key, "%Y-%m-%d") - timedelta(days=1)).strftime("%Y-%m-%d")
            had_night_yesterday = any(f"{yesterday}_夜班" in s for s in member_shifts.get(m['name'], []))
            if had_night_yesterday and shift_name == '白班':
                continue  # 夜班后不上第二天白班

            # 当天只能上一个班
            already_today = any(date_key in s for s in member_shifts.get(m['name'], []))
            if already_today:
                continue

            available.append(m)

        return available

    def _pick_best(self, candidates, count, preferred_skills):
        """从候选人中选择最优组合（技能互补）"""
        if len(candidates) <= count:
            return candidates

        # 优先选择技能覆盖最广的组合
        best_pick = None
        best_coverage = -1

        for combo in itertools.combinations(candidates, count):
            covered_skills = set()
            for c in combo:
                covered_skills.update(c.get('skills', []))
            coverage = len(covered_skills & set(preferred_skills))
            if coverage > best_coverage:
                best_coverage = coverage
                best_pick = combo

        return list(best_pick) if best_pick else candidates[:count]

    def _assign_backup(self, t2_pool, t3_pool):
        """分配备班人员：不上固定班但保持电话畅通"""
        self.backup = {
            "daily": [],      # 每日随机指定2名T2备班
            "tier3_oncall": []  # T3 7x24轮值
        }

    def export_excel(self, filename):
        """导出 Excel 排班表"""
        try:
            import openpyxl
            from openpyxl.styles import PatternFill, Font, Alignment, Border, Side

            wb = openpyxl.Workbook()
            ws = wb.active
            ws.title = "护网排班表"

            # 样式定义
            header_fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
            header_font = Font(name="微软雅黑", size=11, bold=True, color="FFFFFF")
            white_fill = PatternFill(start_color="FFF2CC", end_color="FFF2CC", fill_type="solid")
            night_fill = PatternFill(start_color="D9E2F3", end_color="D9E2F3", fill_type="solid")
            late_fill = PatternFill(start_color="E2EFDA", end_color="E2EFDA", fill_type="solid")

            # 表头
            headers = ["日期", "白班 (08-16)", "", "", "晚班 (16-00)", "", "", "夜班 (00-08)", "", ""]
            sub_headers = ["", "T1", "T2", "T3待命", "T1", "T2", "T3待命", "T1", "T2", "T3待命"]

            for col, h in enumerate(headers, 1):
                cell = ws.cell(row=1, column=col, value=h)
                cell.fill = header_fill
                cell.font = header_font

            for col, sh in enumerate(sub_headers, 1):
                cell = ws.cell(row=2, column=col, value=sh)
                cell.font = Font(name="微软雅黑", bold=True, size=10)

            # 填充排班数据
            row = 3
            for date_key in sorted(self.schedule.keys()):
                ws.cell(row=row, column=1, value=date_key)
                
                shifts_order = ["白班", "晚班", "夜班"]
                for shift_idx, shift_name in enumerate(shifts_order):
                    base_col = 2 + shift_idx * 3
                    members = self.schedule[date_key].get(shift_name, [])

                    t1_members = [m['name'] for m in members if m['tier'] == 1]
                    t2_members = [m['name'] for m in members if m['tier'] == 2]
                    t3_members = [m['name'] for m in members if m['tier'] == 3]

                    ws.cell(row=row, column=base_col, value='\n'.join(t1_members))
                    ws.cell(row=row, column=base_col+1, value='\n'.join(t2_members))
                    ws.cell(row=row, column=base_col+2, value='\n'.join(t3_members))

                    # 颜色区分
                    fill = white_fill if shift_name == "白班" else (late_fill if shift_name == "晚班" else night_fill)
                    for c in range(base_col, base_col+3):
                        ws.cell(row=row, column=c).fill = fill

                row += 1

            wb.save(filename)
            print(f"✅ 排班表已导出: {filename}")
        except ImportError:
            print("⚠️ 需要安装 openpyxl: pip install openpyxl")


# 使用示例
if __name__ == "__main__":
    planner = HWShiftPlanner("2026-06-15", "2026-06-28")

    # 添加Tier1（8人）
    for name in ['张三','李四','王五','赵六','孙七','周八','吴九','郑十']:
        planner.add_member(name, tier=1, skills=["alert_triage", "log_analysis"])

    # 添加Tier2（6人）
    for name in ['陈十一','林十二','黄十三','杨十四','刘十五','许十六']:
        planner.add_member(name, tier=2, skills=["windows", "linux", "network", "forensics"])

    # 添加Tier3专家（3人）
    for name in ['何专家','吕专家','施专家']:
        planner.add_member(name, tier=3, skills=["apt_response", "reverse_engineering"])

    schedule = planner.generate()
    planner.export_excel("hw_shift_schedule.xlsx")
```

---

## 4. 交接班制度

### 4.1 交接班 SOP

```
⏰ 交接前 30 min（交班人）：
□ 整理本班次事件台账（TheHive导出）
□ 标注未处置完成的事件及原因
□ 更新监控Dashboard截图
□ 检查所有安全设备状态（防火墙/IPS/WAF/EDR正常）
□ 确认所有Tier3专家通讯畅通
□ 整理本班次的特殊事件（攻击态势变化/新漏洞/指挥部新要求）
□ 填写交接班记录表

⏰ 交接时 15 min（交班 + 接班）：
□ 交班人口述：本班次关键事件 + 待处置事件
□ 接班人口述：确认理解所有待处置事件
□ 双方签字确认

⏰ 接班后 15 min（接班人）：
□ 登录所有监控系统
□ 确认告警通知畅通（钉钉/邮件/短信）
□ 检查SIEM大盘是否正常刷新
□ 向Tier3值班专家报到
```

### 4.2 交接班记录模板

```yaml
交接班记录:
  日期: "2026-06-12"
  班次: "白班 (08:00-16:00)"
  交班人: "张三, 李四"
  接班人: "王五, 赵六"

  本班次汇总:
    总告警数: 342
    已处置: 338
    误报: 120
    确认真阳性: 15
    升级Tier2: 3
    升级Tier3: 1
    封禁IP数: 47

  关键事件:
    - id: INC-2026-0612-001
      title: "疑似Cobalt Strike Beacon告警"
      status: "Tier2分析中"
      priority: "P1"
      owner: "陈十一"
      notes: "已确认外联IP为C2，等待网络取证结果"
      
    - id: INC-2026-0612-002
      title: "VPN异常登录-多个境外IP"
      status: "已处置"
      priority: "P2"
      action: "封禁IP段 x3，禁用异常账号 x2"

  待处置事件:
    - INC-2026-0612-001: "等待网络包分析"
    - INC-2026-0612-003: "Exchange CVE扫描结果待确认"

  设备状态:
    防火墙: "正常"
    IPS: "正常，规则版本 20260612.1"
    WAF: "正常"
    EDR: "Agent在线率 98.5%"
    SIEM: "索引速率 15000/s，延迟 5s"

  指挥部通知:
    - "今日攻击态势：扫描类攻击增加，重点关注Exchange/SharePoint"
    - "新增IOC 20条，已同步到SIEM黑名单"

  交接确认:
    交班人签字: "张三"
    接班人签字: "王五"
    时间: "2026-06-12 16:15"
```

---

## 5. 战时指挥与信息通报

### 5.1 指挥链

```
指挥部
  ├─ 总指挥(CIO/CISO): 最终决策
  ├─ 副总指挥(安全总监): 日常指挥
  └─ 参谋组:
       ├─ 态势参谋: 攻击态势分析
       ├─ 情报参谋: 威胁情报同步
       └─ 协调参谋: 业务/IT/厂商协调

SOC值班组
  ├─ 当班Tier3专家
  ├─ 当班Tier2组长
  ├─ Tier1值班组
  └─ 备班梯队

业务联络人
  ├─ 各业务部门安全接口人
  ├─ IT基础设施主管
  └─ 公关/法务（如需对外通报）
```

### 5.2 信息通报制度

| 类型 | 频次 | 内容 | 接收人 |
|------|------|------|--------|
| 小时报 | 整点 | 告警量/封堵/重大事件 | SOC组长 |
| 班次报 | 交班 | 完整台账 | 接班人员 |
| 日报 | 每日18:00 | 攻击态势/处置/设备/IOC | 指挥部 |
| 即时报 | 实时 | P1/P2事件 | Tier3+指挥部 |
| 态势报 | 每4h | 攻击来源/手法/趋势 | 指挥部+参谋 |

---

## 6. 告警升级与备勤激活

```python
#!/usr/bin/env python3
"""护网告警升级与备勤自动激活"""

class HWAlertEscalation:
    def __init__(self):
        self.escalation_rules = [
            {
                "condition": lambda a: a['severity'] == 'critical' and a['confirmed'],
                "action": "immediate_escalation",
                "notify": ["tier3_oncall", "commander", "deputy_commander"],
                "timeout_minutes": 5
            },
            {
                "condition": lambda a: a['type'] == 'data_breach' or a['type'] == 'ransomware',
                "action": "emergency_response",
                "notify": ["tier3_oncall", "commander", "ciso"],
                "timeout_minutes": 1
            },
            {
                "condition": lambda a: a['alert_rate_per_hour'] > 200,
                "action": "activate_backup_team",
                "notify": ["tier2_backup", "tier3_oncall"],
                "timeout_minutes": 30
            },
            {
                "condition": lambda a: len(a.get('compromised_hosts', [])) > 3,
                "action": "emergency_response",
                "notify": ["tier3_oncall", "commander"],
                "timeout_minutes": 15
            }
        ]

    def evaluate(self, alert):
        for rule in self.escalation_rules:
            if rule['condition'](alert):
                return self.execute_escalation(alert, rule)
        return {"escalated": False}

    def execute_escalation(self, alert, rule):
        """执行升级动作"""
        message = f"""
🔴 护网告警升级 - {rule['action']}
> 事件ID: {alert.get('id', 'N/A')}
> 类型: {alert.get('type', 'Unknown')}
> 严重性: {alert.get('severity', 'Unknown')}
> 受影响资产: {len(alert.get('compromised_hosts', []))}

⚠️ 请在{rule['timeout_minutes']}分钟内响应！
"""
        # 钉钉通知
        for target in rule['notify']:
            self.send_dingtalk(target, message)

        # 电话通知（P1 + 勒索）
        if rule['timeout_minutes'] <= 5:
            self.make_phone_call(rule['notify'][0])

        return {
            "escalated": True,
            "action": rule['action'],
            "notified": rule['notify'],
            "timeout_minutes": rule['timeout_minutes']
        }

    def send_dingtalk(self, target, message):
        # 实现钉钉通知
        pass

    def make_phone_call(self, target):
        # 实现电话拨号（通过阿里云语音通知API等）
        pass
```

---

## 7. 值班环境搭建

### 7.1 硬件环境

**作战室最低配置**：
- 大屏显示器 × 2（55"+，一个显示SIEM大盘，一个显示攻击态势）
- 工作站/笔记本 × 每班人数
- 千兆网络 + 4G/5G 备用网络（万一有线挂了）
- IP电话/对讲机（紧急通信）

### 7.2 软件环境

**每台值班工作站的软件清单**：

```bash
# Windows 工作站必备
- Chrome/Edge（访问SIEM Kibana/监控页面）
- Termius/PuTTY（SSH连接服务器）
- Wireshark（流量分析）
- VSCode + Python（日志分析脚本）
- TheHive 客户端（工单系统）
- 钉钉/飞书/企业微信（通知）
- KeePass（密码管理器——护网期间各系统密码临时变更）
- Snipaste（截图工具——证据固定）
- Obsidian/Notion（实时笔记）
- IDA Pro / Ghidra（Tier2工作站——恶意样本分析）
```

---

## 8. 排错与应急预案

### 应急场景与处置

| 场景 | 处置 |
|------|------|
| **SIEM宕机** | 切到ES直查模式 + Kibana手动查询，通知基础设施组恢复 |
| **EDR控制台不可用** | 各终端开启Wazuh本地阻断模式（Agent可独立工作），通过Wazuh API直接下发指令 |
| **大屏断电/网断** | 切到笔记本 + 4G热点，保持监控能力 |
| **换班时无接班人** | 交班人延后下班，通知组长调配其他班组替补 |
| **Tier3电话不通** | 激活Tier3备选名单（至少3人），同时通知指挥部 |
| **大规模攻击导致告警风暴** | 启用"战备模式"：自动封禁境外IP段 → 只保留P1告警 → 通知指挥部决定是否断网 |

### 战备模式切换脚本

```python
def enable_war_mode(level=1):
    """
    护网战备模式
    level 1: 增强防护（自动封禁境外IP/已知恶意IP）
    level 2: 高压防护（关闭非必要外网端口/限制VPN/阻断所有未知外联）  
    level 3: 战时断网（仅保留核心业务）
    """
    if level >= 1:
        # 1. EDR切换到阻断模式
        update_edr_policy("block")
        # 2. IPS切换到拦截模式
        update_ips_mode("prevent")
        # 3. 自动封禁境外IP段
        block_foreign_ip_ranges()
        # 4. 提升告警阈值（减少告警风暴）
        increase_alert_threshold()

    if level >= 2:
        # 5. 关闭非必要外网端口
        close_noncritical_ports()
        # 6. VPN需二次认证
        enable_vpn_2fa()
        # 7. 禁止所有新出站连接（白名单外）
        enable_outbound_whitelist()

    if level >= 3:
        # 8. 断开互联网连接（保留核心业务链路）
        disable_internet_except(["核心支付系统", "核心交易系统"])
        # 9. 切换到内网应急通信
        enable_internal_comms()

    send_war_mode_notification(level)
```

---

## ✅ 值班方案 Checklist

- [ ] 确认护网时间窗口，制定排班表
- [ ] 确认 Tier1(8+人) Tier2(6+人) Tier3(3+人) 人员到位
- [ ] 各人员排班约束确认（夜班限制/请假/特殊需求）
- [ ] 交接班记录模板印刷/电子化
- [ ] 作战室环境搭建（大屏/工作站/网络/备用电源）
- [ ] 所有值班工作站软件安装验证
- [ ] 告警升级规则在 SOAR 中配置
- [ ] 备班激活通知流程测试
- [ ] 战时指挥链通讯录更新
- [ ] 信息通报模板准备（小时报/班次报/日报）
- [ ] 战备模式切换脚本就绪
- [ ] Tier3 紧急联系电话测试通过
- [ ] 护网前 1 天全要素演练

> 📚 延伸阅读：HW/001-蓝队防护方案 | SOC/016-护网SOC增强 | HW/003-红蓝对抗反制
