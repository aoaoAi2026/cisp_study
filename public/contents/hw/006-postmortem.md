# 护网复盘方法论与持续改进

> **📘 文档定位**：CISP 考试 护网行动 核心 | 难度：⭐⭐⭐ | 预计阅读：25 分钟
>
> 系统讲解护网结束后的复盘方法论，覆盖攻击事件还原/防御漏洞分析/经验教训总结/改进计划制定等完整复盘流程。

---

## 导航目录

- [一、复盘方法论概述](#一复盘方法论概述)
- [二、攻击事件还原](#二攻击事件还原)
- [三、防御漏洞分析](#三防御漏洞分析)
- [四、经验教训总结](#四经验教训总结)
- [五、改进计划制定](#五改进计划制定)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

> 📅 2026-06-12 | 🎯 进阶 | ⏱ 20 min | 分类：护网工程

## 📋 提纲

1. 护网复盘的价值与时机
2. 复盘流程：四阶段法
3. 事件复盘模板（单个安全事件）
4. 整体复盘模板（全护网周期）
5. 根因分析（RCA）方法论
6. 改进清单与跟踪
7. 真实复盘案例
8. 排错指南

---

## 1. 复盘价值与时机

### 1.1 为什么必须复盘

```
没有复盘 = 同样的问题下次还会出现
好的复盘 = 一次教训，终身免疫
```

| 复盘产出 | 价值 |
|---------|------|
| 攻击手法库 | 下次同类攻击可快速识别 |
| 防护盲区清单 | 知道哪里还需要加固 |
| 检测规则补充 | 把漏检的TTP变成Sigma规则 |
| SOP优化 | 流程更快更准 |
| 技术债务清单 | 知道下个周期优先做什么 |

### 1.2 复盘时机

| 事件级别 | 复盘时机 | 参与人员 |
|---------|---------|---------|
| P1 重大事件 | 处置完成后 24h 内 | 全部参与者 + 指挥部 |
| P2 中等事件 | 处置完成后 48h 内 | 直接参与者 + Tier3 |
| P3 一般事件 | 护网结束后统一复盘 | Tier1组长 + Tier2 |
| 护网整体复盘 | 护网结束后 1 周内 | 全部值班人员 |

---

## 2. 复盘四阶段法

```
阶段1: WHAT（发生了什么）
├─ 时间线重建
├─ 攻击链还原  
├─ 影响面评估
└─ 攻击者画像

阶段2: WHY（为什么发生）  
├─ 攻击为什么成功
├─ 为什么没检测到
├─ 为什么响应慢
└─ 根因分析

阶段3: HOW（如何改进）
├─ 短期修复（1周内）
├─ 中期加固（1月内）
├─ 长期规划（下个护网前）
└─ 责任人与截止日期

阶段4: SHARE（沉淀分享）
├─ 编写复盘报告
├─ 更新检测规则
├─ 更新SOP流程
└─ 团队分享会（Lunch & Learn）
```

---

## 3. 事件复盘模板

### 3.1 单事件复盘报告模板

```markdown
# 安全事件复盘报告

## 基本信息
- 事件编号: INC-2026-0612-003
- 事件名称: 内网Exchange服务器被入侵
- 发现时间: 2026-06-12 14:32
- 确认时间: 2026-06-12 14:45
- 遏制时间: 2026-06-12 15:20
- 根除时间: 2026-06-13 10:00
- 恢复时间: 2026-06-13 18:00
- 事件级别: P1
- 值班班组: 白班（张三/李四/陈十一/杨十四）

## 攻击时间线
```
2026-06-10 22:15 攻击者扫描发现 Exchange Server 暴露在公网
2026-06-10 22:18 利用 CVE-2021-26855 SSRF 漏洞获取认证Token
2026-06-10 22:22 写入 WebShell 到 OWA 目录
2026-06-10 22:30 通过 WebShell 上传 Cobalt Strike Beacon
2026-06-10 22:35 Beacon 回调 C2 服务器（45.33.32.156:443）
2026-06-10 22:40 使用 procdump 转储 LSASS 进程
2026-06-10 23:10 提取到域管理员凭据
2026-06-11 01:20 通过 SMB 横向移动到文件服务器
2026-06-11 03:45 开始压缩打包敏感文件
2026-06-11 05:30 通过 DNS 隧道分段外传数据（共 2.3GB）
2026-06-12 14:32 SOC 值班人员发现异常 DNS 流量告警
2026-06-12 14:45 Tier2 确认真阳性
```

## 攻击链（ATT&CK Mapping）
| 阶段 | Tactic | Technique | 证据 |
|------|--------|-----------|------|
| 初始访问 | TA0001 | T1190 - 公网应用漏洞利用 | CVE-2021-26855 |
| 执行 | TA0002 | T1059.001 - PowerShell | 内存执行Beacon |
| 持久化 | TA0003 | T1505.003 - WebShell | /owa/auth/shell.aspx |
| 权限提升 | TA0004 | T1003.001 - LSASS Dump | procdump.exe |
| 横向移动 | TA0008 | T1021.002 - SMB | 向文件服务器横向 |
| 收集 | TA0009 | T1560.001 - Archive Data | 7z压缩敏感文件 |
| 外泄 | TA0010 | T1048.002 - DNS Tunneling | DNS TXT查询2.3GB |

## 根因分析（5 Whys）
```
Why 1: 为什么被入侵？
→ Exchange存在未修复的CVE-2021-26855

Why 2: 为什么漏洞未修复？
→ 补丁发布后未及时安装（2021.3发布，已过去5年）

Why 3: 为什么没及时发现补丁缺失？
→ 漏洞管理平台（DefectDojo）的Exchange扫描模块未配置

Why 4: 为什么DefectDojo扫描模块缺失？
→ 安全团队和Exchange运维团队分工不清

Why 5: 为什么分工不清？
→ 缺乏明确的漏洞管理流程与SLA制度

根因：漏洞管理流程缺失 + 责任边界不清 + 监控盲区
```

## 检测评估

| 检测手段 | 是否触发 | 为什么没触发 |
|---------|---------|------------|
| WAF | ❌ | Exchange漏洞通过SSRF，不经过WAF |
| IPS | ❌ | 攻击流量经过TLS加密，IPS未解密 |
| EDR | ❌ | Exchange服务器未安装EDR Agent |
| SIEM | ✅ | 最终通过DNS异常流量告警发现 |
| NDR | ❌ | DNS隧道未配置检测规则 |
| 漏洞扫描 | ❌ | Exchange扫描未配置 |

## 改进措施

### 短期（本周内）
- [x] 修复Exchange CVE-2021-26855/26857/26858/27065（责任人: Exchange管理员 李明，截止: 06-13）
- [x] Exchange服务器安装EDR Agent（责任人: 李明，截止: 06-13）
- [x] 全网排查是否有其他Exchange未修复（责任人: 陈十一，截止: 06-14）
- [x] 添加DNS隧道检测规则到Zeek/Suricata（责任人: 杨十四，截止: 06-15）

### 中期（本月内）
- [ ] 建立漏洞扫描全覆盖机制：所有面向公网资产必须加入扫描范围（责任人: 安全经理，截止: 06-30）
- [ ] 明确安全团队与运维团队的漏洞管理分工SLA（责任人: CISO，截止: 06-30）
- [ ] 所有服务器部署EDR Agent，在线率目标99%（责任人: 杨十四，截止: 06-30）
- [ ] 添加Sigma规则检测LSASS Access + WebShell写入 + Archive收集（责任人: 陈十一，截止: 06-30）

### 长期（下个护网前）
- [ ] 建立TLS解密能力（SSL Forward Proxy），让IPS能检测加密流量
- [ ] 部署NDR全流量分析平台
- [ ] 季度红蓝对抗演练，重点验证检测盲区
- [ ] Exchange安全加固专项（禁用不必要的EWS/禁用外部OWA/启用MFA）

## 经验教训
1. **"面向公网 = 最先被打 = 必须最硬"** — 公网资产要有最高优先级的安全覆盖
2. **DNS是最后一道检测防线** — 当所有检测都失败时，DNS异常是最后的警报
3. **EDR覆盖率是硬指标** — 没有Agent的主机 = 裸奔
4. **5年前的漏洞照样能打进护网** — 不要以为老漏洞就不重要

## 附件
- [ ] Exchange服务器内存镜像（Volatility分析结果）
- [ ] Cobalt Strike Beacon样本（SHA256: a3f2b...）
- [ ] DNS隧道流量pcap
- [ ] WebShell文件（/owa/auth/shell.aspx）
```

---

## 4. 整体复盘模板

### 4.1 全护网周期复盘大纲

```markdown
# XX年护网 安全防护复盘报告

## 一、护网概况
- 护网时间: 2026-06-01 ~ 06-14
- 参演单位: XX集团及下属10家子公司
- 值班总人数: 32人（T1:16, T2:10, T3:6）
- 总防护资产数: 5362

## 二、数据统计

### 2.1 告警数据
| 指标 | 数值 |
|------|------|
| 总告警数 | 68,421 |
| 日均告警数 | 4,887 |
| 确认真阳性 | 342 (0.5%) |
| 误报数 | 47,894 (70%) |
| 其他(扫描等) | 20,185 |

### 2.2 事件数据
| 指标 | 数值 |
|------|------|
| P1事件 | 3 |
| P2事件 | 12 |
| P3事件 | 45 |
| 成功入侵 | 1 (Exchange) |
| 防守成功拦截 | 341 |

### 2.3 处置数据
| 指标 | 数值 |
|------|------|
| 封禁IP数 | 2,847 |
| 封禁IP段 | 23 |
| 禁用账号 | 15 |
| 隔离服务器 | 8 |
| 应急响应启动 | 4次 |
| 溯源成功 | 2次 |

### 2.4 攻防数据
| 攻击类型 | 数量 | 占比 |
|---------|------|------|
| Web漏洞利用 | 12,345 | 18% |
| 暴力破解 | 18,234 | 27% |
| 漏洞扫描 | 25,678 | 37% |
| 钓鱼邮件 | 234 | 0.3% |
| DDoS | 3次 | - |
| 社工（电话/微信） | 15次 | - |

## 三、得分/扣分情况
- 总分: XX分
- 扣分项:
  1. Exchange被成功入侵: -XX分
  2. VPN账号被社工获取: -XX分（及时发现并禁用，仅扣少量分）
- 加分项:
  1. 主动发现并处置APT攻击: +XX分
  2. 成功溯源并获取攻击者身份: +XX分
  3. 威胁情报共享: +XX分

## 四、成功经验
1. SOAR自动化处置覆盖了67%的告警，Tier1工作量降低40%
2. 蜜罐成功捕获2次横向移动尝试
3. 护网前漏洞大扫除关闭了89%的高危漏洞
4. 7x24双人值班制保证了响应速度

## 五、不足之处（按严重程度排序）
1. Exchange补丁管理缺失 → 导致最大失分
2. EDR覆盖率仅91% → 9%的服务器处于监控盲区
3. DNS/NDR检测规则不足 → 攻击者可通过DNS隧道外传数据
4. 漏洞扫描覆盖不全 → 部分公网资产未纳入
5. Tier1人员经验不足 → 第一周误判率高

## 六、改进计划（详见附录）
- 短期（1月内）: 15项整改
- 中期（3月内）: 8项整改
- 长期（半年内）: 5项整改

## 七、资源需求
- 新增NDR平台: XX万
- EDR Agent补充: XX万/年
- TI威胁情报订阅: XX万/年
- 培训预算: XX万

## 八、附录
- A: 全部P1/P2事件详细复盘
- B: 攻击来源统计（Top20攻击IP/国家/组织）
- C: 新发现IOC清单（已同步MISP）
- D: 新增检测规则清单（15条Sigma + 8条Wazuh）
- E: 改进跟踪表
```

---

## 5. 根因分析（RCA）方法论

### 5.1 5 Whys 法

```python
#!/usr/bin/env python3
"""5 Whys 根因分析工具"""

class FiveWhys:
    def __init__(self, incident_name):
        self.incident_name = incident_name
        self.whys = []

    def start(self, initial_statement):
        """开始5 Whys分析"""
        self.whys = [{
            "level": 0,
            "question": "发生了什么？",
            "answer": initial_statement
        }]
        return self

    def why(self, answer):
        """进入下一层Why"""
        level = len(self.whys)
        self.whys.append({
            "level": level,
            "question": f"Why {level}?",
            "answer": answer
        })
        return self

    def root_cause(self):
        """分析是否找到根因"""
        if len(self.whys) < 3:
            return "需要继续深挖"

        last_answer = self.whys[-1]['answer'].lower()

        # 根因信号：涉及流程/制度/人员/培训等管理问题
        management_keywords = ['流程', '制度', '规范', '标准', '培训', '分工', '职责', 'sla', '考核', '设计']
        if any(kw in last_answer for kw in management_keywords):
            return "✅ 已到达管理层面根因"

        # 还停留在技术层面
        technical_keywords = ['bug', '漏洞', '配置', '补丁', '代码', '版本', '性能', '内存']
        if any(kw in last_answer for kw in technical_keywords):
            return "⚠️ 仍处于技术层面，建议继续追问：'为什么这个技术问题存在？'"

        return "🤔 不确定是否到达根因，建议继续追问"

    def export(self):
        """导出5 Whys报告"""
        report = f"# {self.incident_name} - 5 Whys 根因分析\n\n"
        for w in self.whys:
            prefix = "│  " * (w['level'] - 1) + "├─ " if w['level'] > 0 else ""
            report += f"{prefix}Q: {w['question']}\n"
            report += f"{'│  ' * w['level']}A: {w['answer']}\n\n"

        report += f"\n## 根因判定\n{self.root_cause()}\n"
        return report


# 使用示例
if __name__ == "__main__":
    fw = FiveWhys("Exchange被入侵事件")
    fw.start("未授权攻击者通过CVE-2021-26855入侵Exchange服务器")
    fw.why("Exchange存在未修复的高危漏洞")
    fw.why("补丁发布后未及时安装")
    fw.why("漏洞管理平台未检测到该漏洞")
    fw.why("Exchange未纳入漏洞扫描范围")
    fw.why("安全团队与运维团队对公网资产的漏洞管理分工不明确")

    print(fw.export())
```

### 5.2 鱼骨图分析（Ishikawa）

```
                        人员                     流程                     技术
                    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
                    │ Tier1经验不足  │    │ 补丁流程不完善 │    │ EDR未安装     │
                    │ 判定速度慢    │    │ 无强制修复SLA  │    │ NDR规则缺失  │
                    │              │    │              │    │ 漏洞扫描不全  │
                    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
                           │                   │                   │
                           └───────────────────┼───────────────────┘
                                               │
                                        ┌──────▼───────┐
                                        │   Exchange   │
                                        │   被成功入侵   │
                                        └──────▲───────┘
                                               │
                           ┌───────────────────┼───────────────────┐
                           │                   │                   │
                    ┌──────┴───────┐    ┌──────┴───────┐    ┌──────┴───────┐
                    │ 只做了告警通知 │    │ 服务器性能差  │    │ 没有明确分工  │
                    │ 没有自动处置  │    │ 不敢装Agent   │    │ 安全vs运维    │
                    │              │    │              │    │              │
                    └──────────────┘    └──────────────┘    └──────────────┘
                        工具                     环境                     管理
```

---

## 6. 改进跟踪

### 6.1 改进跟踪表

```python
#!/usr/bin/env python3
"""护网改进跟踪系统"""

import json
from datetime import datetime, timedelta

class ImprovementTracker:
    def __init__(self, filename="improvements.json"):
        self.filename = filename
        self.items = self.load()

    def load(self):
        try:
            with open(self.filename, 'r') as f:
                return json.load(f)
        except:
            return []

    def add(self, title, category, priority, owner, deadline, description):
        """添加改进项"""
        item = {
            "id": f"IMP-{len(self.items)+1:04d}",
            "title": title,
            "category": category,     # 短期/中期/长期
            "priority": priority,      # P0/P1/P2/P3
            "owner": owner,
            "deadline": deadline,
            "description": description,
            "status": "待开始",
            "created_at": datetime.now().isoformat(),
            "completed_at": None,
            "verification": "",        # 验证方法
            "verification_result": ""  # 验证结果
        }
        self.items.append(item)
        self.save()
        return item

    def update_status(self, item_id, status, verification_result=""):
        for item in self.items:
            if item['id'] == item_id:
                item['status'] = status
                if status == "已完成":
                    item['completed_at'] = datetime.now().isoformat()
                item['verification_result'] = verification_result
                self.save()
                return item
        return None

    def get_overdue(self):
        """获取逾期未完成的改进项"""
        now = datetime.now()
        overdue = []
        for item in self.items:
            if item['status'] != '已完成':
                deadline = datetime.fromisoformat(item['deadline'])
                if now > deadline:
                    overdue.append(item)
        return overdue

    def get_stats(self):
        """统计改进项完成情况"""
        total = len(self.items)
        completed = sum(1 for i in self.items if i['status'] == '已完成')
        in_progress = sum(1 for i in self.items if i['status'] == '进行中')
        pending = sum(1 for i in self.items if i['status'] == '待开始')
        overdue = len(self.get_overdue())

        return {
            "总计": total,
            "已完成": f"{completed} ({completed/total*100:.0f}%)" if total else "0",
            "进行中": in_progress,
            "待开始": pending,
            "逾期": f"🔴 {overdue}" if overdue else "✅ 无逾期"
        }

    def save(self):
        with open(self.filename, 'w') as f:
            json.dump(self.items, f, ensure_ascii=False, indent=2)


# 使用示例
if __name__ == "__main__":
    tracker = ImprovementTracker()

    # 添加改进项
    tracker.add(
        title="Exchange漏洞修复 + EDR部署",
        category="短期",
        priority="P0",
        owner="李明",
        deadline="2026-06-13",
        description="修复CVE-2021-26855系列漏洞，安装EDR Agent，验证Agent在线"
    )

    tracker.add(
        title="DNS隧道检测规则部署",
        category="短期",
        priority="P1",
        owner="杨十四",
        deadline="2026-06-15",
        description="在Zeek中部署DNS隧道检测脚本，在SIEM中创建对应告警规则"
    )

    tracker.add(
        title="漏洞扫描全覆盖",
        category="中期",
        priority="P1",
        owner="安全经理",
        deadline="2026-06-30",
        description="确认所有公网资产加入扫描范围，Exchange/SharePoint/所有Web应用"
    )

    print(json.dumps(tracker.get_stats(), indent=2, ensure_ascii=False))
```

---

## 7. 真实复盘案例

### 案例1：VPN账号被社工

**背景**：护网第3天，攻击者冒充IT部门打电话给某员工，声称"VPN升级需要验证密码"，成功获取VPN账号密码。

**时间线**：
```
10:30 攻击者电话联系员工A
10:35 员工A告知VPN密码
10:42 攻击者使用VPN登录（IP: 境外）
10:43 UEBA触发异常告警（该员工从未从境外登录）
10:45 Tier1确认异常
10:48 禁用该VPN账号
10:50 通知员工A修改密码+安全意识教育
11:00 排查该账号在10:42-10:48期间的操作（无敏感操作）
```

**根因**：安全意识培训未覆盖"电话社工"场景

**改进**：
- 全员紧急安全意识提示（IT绝不会电话索取密码）
- VPN启用MFA强制认证（短期）
- 每季度安全意识培训 + 钓鱼测试（长期）

---

## 8. 排错指南

| 常见问题 | 解决方案 |
|---------|---------|
| 复盘变成"批斗会" | 会前声明：Blame-Free 原则，目标找系统问题不是找人背锅 |
| 参与者不敢说实话 | 匿名收集反馈 + 主持人引导"对事不对人" |
| 找不到根因 | 用5 Whys多追问几层，引入外部视角（安全顾问/其他团队） |
| 改进措施没落实 | 建立跟踪表 + 周报跟进 + 改进项纳入个人KPI |
| 复盘报告没人看 | 精简成1页摘要 + 可视化图表 + 管理层汇报 |

---

## ✅ 复盘 Checklist

- [ ] 确定复盘会议时间（P1事件24h内/整体复盘1周内）
- [ ] 邀请所有相关人员
- [ ] 准备时间线数据（SIEM/EDR/防火墙日志）
- [ ] 准备ATT&CK攻击链Mapping
- [ ] 执行5 Whys根因分析
- [ ] 确认检测盲区（为什么没检测到）
- [ ] 确认响应瓶颈（为什么响应慢）
- [ ] 制定改进措施（含责任人+截止日期）
- [ ] 编写复盘报告
- [ ] 创建改进跟踪表
- [ ] 更新检测规则（Sigma/Wazuh/防火墙）
- [ ] 更新SOP流程
- [ ] 团队分享会
- [ ] 1个月后检查改进项完成情况

> 📚 延伸阅读：HW/001-蓝队防护方案 | HW/004-值班方案 | SOC/018-成熟度评估
