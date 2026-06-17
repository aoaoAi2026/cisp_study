# Day 20：安全设备深度调优与联动
## 不是你有多少武器，而是这些武器能不能协同作战

---

> 🎯 **今日目标**  
> 设计多设备联动方案 · 解决告警孤岛问题 · 编写SOAR编排剧本

---

## 📖 一、告警孤岛——每个保安都看到小偷但彼此不说话

### 🏝️ 什么是告警孤岛？

```
场景：攻击者正在进行一次完整的Web攻击

防火墙告警：      "IP 45.33.32.156 访问了80端口"（正常，不放眼里）
WAF告警：         "检测到SQL注入尝试"（可疑，但没到紧急）
EDR告警：         "Web服务器有异常进程创建"（可疑，但单独看不确定）
SIEM：            （没人把以上信息关联起来）

结果：三个设备都看到了部分攻击迹象，但没人把碎片拼成完整画面
→ 安全分析师要手动去三个平台查看 + 关联 + 判断
→ 等他搞清楚了，攻击者已经完成入侵了

这就是告警孤岛——各自为战，信息不通！
```

### 🔗 联动之后是什么样子？

```
攻击者：IP 45.33.32.156 发起SQL注入攻击

WAF检测到SQL注入 → 立即推送告警到SIEM
SIEM收到告警 → 关联分析：
  ✓ 这个IP刚才访问过管理后台（来自防火墙日志）
  ✓ 过去1小时这个IP访问了50个不同的页面（来自WAF日志）
  ✓ 这个IP在威胁情报库中标记为"恶意"（来自TIP）
  → 综合判断：高危攻击！自动触发SOAR剧本！

SOAR自动执行：
  1. 通知防火墙：把 45.33.32.156 加入黑名单（自动）
  2. 通知EDR：扫描Web服务器，检查是否有异常进程（自动）
  3. 通知运维：创建工单（自动）
  4. 通知安全分析师：确认处置结果（人工）

从发现到封禁：15秒（自动化）
之前可能：15分钟（人工操作）
```

---

## 📖 二、设备联动的核心架构

```
                ┌──────────┐
                │  SOAR    │ ← 大脑：编排自动化响应
                │(剧本引擎)│
                └────┬─────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   ┌─────────┐ ┌──────────┐ ┌─────────┐
   │  SIEM   │ │威胁情报平台│ │ 工单系统 │
   │(关联分析)│ │  (TIP)   │ │         │
   └────┬────┘ └──────────┘ └─────────┘
        │
   ┌────┼────┬─────────┬─────────┐
   │    │    │         │         │
   ▼    ▼    ▼         ▼         ▼
 防火墙  WAF  IDS/IPS  EDR     蜜罐
(网络层)(应用层)(检测层)(终端层)(欺骗层)

每个设备都是眼睛和耳朵
SIEM是大脑中枢（信息汇聚+关联分析）
SOAR是双手（自动执行响应动作）
```

---

## 📖 三、典型联动剧本（Playbook）

### 📜 剧本1：SQL注入自动处置

```
触发条件：WAF检测到SQL注入攻击（High置信度）

第1步 [自动] WAF提取攻击源IP → 推送到SIEM
第2步 [自动] SIEM关联查询：
  - 该IP过去1小时访问了多少页面
  - 该IP在威胁情报库中的标签
  - 该IP是否攻击了多个目标
第3步 [自动] 如果确认是攻击 → SOAR启动剧本
第4步 [自动] 防火墙：block src_ip timeout=3600
第5步 [自动] EDR：扫描被攻击的Web服务器
第6步 [自动] SIEM：创建工单 INC-xxxx
第7步 [人工] 安全分析师审核并关单
```

### 📜 剧本2：勒索软件应急

```
触发条件：EDR检测到大量文件加密行为

第1步 [自动] EDR：立即隔离感染主机
第2步 [自动] 通知防火墙：阻断该主机所有网络通信
第3步 [自动] 发送通知：安全团队+运维+值班领导
第4步 [自动] 启动备份恢复检查
第5步 [人工] 安全团队确认感染范围
第6步 [人工] 从备份恢复数据
第7步 [人工] 全盘杀毒扫描
```

### 📜 剧本3：异常时间登录告警

```
触发条件：域控日志显示凌晨3:00有管理员登录

第1步 [自动] SIEM：确认登录来源IP和位置
第2步 [自动] 如果是境外IP → 提升告警级别
第3步 [自动] EDR：检查登录的机器是否有异常进程
第4步 [自动] 发送告警到安全分析师群
第5步 [人工] 安全分析师确认：
  - 如果是合法运维 → 关单
  - 如果确认入侵 → 启动PDCERF应急响应
```

---

## 📖 四、SOAR剧本设计原则

### ✅ 好的剧本

```
1. 简单可靠
   剧本不需要花里胡哨，能稳定执行就好
   2-3步能解决问题就不要写10步

2. 有回滚机制
   自动封禁了IP → 如果是误封 → 能一键回滚
   自动隔离了机器 → 如果是业务机器 → 能一键恢复

3. 有人工确认节点
   高风险操作（隔离核心服务器、阻断核心业务流量）
   → 必须人工确认
   
   低风险操作（封禁明显攻击IP）  
   → 可以全自动

4. 每一步都有日志
   记录：什么时间、谁、触发了什么动作、执行了什么、结果如何
```

### ❌ 坏的剧本

```
❌ 过于复杂：10+步骤，一环扣一环
   → 任何一步失败，整个剧本卡死

❌ 全自动无人值守：
   高风险操作也没有人工确认
   → 误杀业务系统，损失惨重

❌ 没有回滚：
   封了IP永久解不开
   → 误封了CEO的VPN → 灾难

❌ 没有日志：
   不知道剧本执行到哪一步了
   → 出了问题难以追溯
```

---

## 📖 五、设备联动的"最低组合"

如果你预算有限，至少要把这三层联动起来：

```
🥇 防火墙（网络层）
   ↓ 联动
🥈 SIEM（日志分析层）
   ↓ 联动
🥉 EDR（终端层）

为什么这三层够了？
  攻击者必须经过网络（防火墙能看到）
  → 在主机上执行（EDR能看到）
  → 两个日志汇聚到SIEM交叉验证
  → 形成完整的攻击视图！
```

---

## 💻 六、动手试试：SOAR编排剧本引擎

```python
# SOAR安全编排自动化响应剧本引擎
class SOARPlaybook:
    def __init__(self, name, description):
        self.name = name
        self.description = description
        self.steps = []
        self.execution_log = []
    
    def add_step(self, order, action, device, command, auto=True, 
                 rollback_cmd=''):
        """
        添加剧本步骤
        auto: True=自动执行, False=需人工确认
        rollback_cmd: 回滚命令
        """
        self.steps.append({
            'order': order,
            'action': action,
            'device': device,
            'command': command,
            'auto': auto,
            'rollback': rollback_cmd,
            'status': 'pending'
        })
    
    def execute(self, trigger_info):
        """执行剧本"""
        print(f'{"="*55}')
        print(f'🎬 执行剧本: {self.name}')
        print(f'📋 描述: {self.description}')
        print(f'🔔 触发: {trigger_info}')
        print(f'{"="*55}\n')
        
        self.steps.sort(key=lambda s: s['order'])
        
        for step in self.steps:
            mode = '🤖 自动' if step['auto'] else '👤 需人工确认'
            print(f'Step {step["order"]}. [{step["device"]}] {step["action"]}')
            print(f'   命令: {step["command"]}')
            print(f'   模式: {mode}')
            
            if step['rollback']:
                print(f'   回滚: {step["rollback"]}')
            
            if not step['auto']:
                print(f'   ⏸️  等待人工确认... (模拟通过)')
            
            # 模拟执行
            step['status'] = 'completed'
            self.execution_log.append({
                'step': step['order'],
                'status': 'completed',
                'timestamp': '2024-06-17 14:30:00'
            })
            print(f'   ✅ 完成\n')
    
    def rollback(self):
        """回滚剧本"""
        print(f'\n🔄 回滚剧本: {self.name}')
        for step in reversed(self.steps):
            if step['rollback']:
                print(f'  回滚Step {step["order"]}: {step["rollback"]} ✅')
    
    def summary(self):
        """剧本摘要"""
        auto_count = sum(1 for s in self.steps if s['auto'])
        manual_count = sum(1 for s in self.steps if not s['auto'])
        print(f'\n📊 剧本摘要: 共{len(self.steps)}步 | 🤖自动{auto_count} | 👤人工{manual_count}')

# === 创建SQL注入自动处置剧本 ===
playbook = SOARPlaybook(
    'SQL注入攻击自动处置',
    '当WAF检测到高置信度SQL注入攻击时，自动联动防火墙封禁+EDR扫描+创建工单'
)

# 添加剧本步骤
playbook.add_step(1, '检测SQL注入', 'WAF',
    '发现来自 {src_ip} 的SQL注入攻击，置信度:95%',
    auto=True)

playbook.add_step(2, '威胁情报查询', 'TIP',
    '查询 {src_ip} 是否在已知恶意IP库中',
    auto=True,
    rollback_cmd='')

playbook.add_step(3, '自动封禁攻击IP', '防火墙',
    'iptables -A INPUT -s {src_ip} -j DROP (timeout=3600)',
    auto=True,
    rollback_cmd='iptables -D INPUT -s {src_ip} -j DROP')

playbook.add_step(4, '扫描受影响主机', 'EDR',
    'scan --target {target_host} --profile full',
    auto=True)

playbook.add_step(5, '创建安全工单', 'SIEM/工单',
    'create_ticket --type=security --severity=high --assignee=sec_team',
    auto=True)

playbook.add_step(6, '通知安全分析师', '企业微信/钉钉',
    '发送告警: SQL注入攻击已自动处置，请审核工单INC-{id}',
    auto=True,
    rollback_cmd='')

playbook.add_step(7, '安全分析师审核确认', '人工',
    '确认：1)处置是否合理 2)是否需要升级响应 3)是否需要手动排查',
    auto=False)

# 执行剧本（模拟被触发）
playbook.execute('WAF检测到来自 45.33.32.156 的SQL注入攻击')
playbook.summary()
```

---

## 🧪 七、今日实验：设计设备联动方案

### 实验目标
根据现有安全设备清单，设计联动架构和剧本

### 实验步骤

```
场景：你有以下安全设备
  - 防火墙（华为/USG）
  - WAF（长亭/雷池）
  - EDR（某商业EDR）
  - SIEM（ELK）
  - （假设有SOAR平台可用）

1️⃣ 盘点现有设备
   ☑ 每台设备有哪些API/日志接口？
   ☑ 哪些可以接收外部指令？
   ☑ 日志格式是否统一？

2️⃣ 设计联动架构图
   ☑ 谁当大脑（SIEM）
   ☑ 谁当双手（SOAR）
   ☑ 数据怎么流转

3️⃣ 编写3个核心联动剧本
   ☑ 剧本1：Web攻击自动处置
   ☑ 剧本2：违规外联检测处置
   ☑ 剧本3：终端异常告警处置

4️⃣ 标注每个剧本的安全阀
   ☑ 哪些步骤自动？
   ☑ 哪些步骤需要人工确认？
   ☑ 回滚机制怎么设计？
```

---

## 📝 八、今日测验

**Q1：SOAR平台的主要功能不包括？**
- A. 安全编排
- B. 自动化响应
- C. 告警处理
- D. 漏洞扫描  ✅

> SOAR专注于事件的自动化编排和响应，漏洞扫描不是其核心功能。

**Q2：多设备联动的核心价值是什么？**
- A. 各自为战
- B. 打破告警孤岛，形成一体化防御  ✅
- C. 降低性能
- D. 增加复杂度

> 联动让不同设备协同作战，告警不再孤立，大幅提升响应速度和防御效率。

**Q3："告警孤岛"指的是什么问题？**
- A. 告警太多
- B. 各安全设备独立告警，无法关联形成完整攻击视图  ✅
- C. 告警太少
- D. 没有告警

> 各设备各管各的，分析师要手动跨平台查看才能拼出完整画面。

**Q4：SIEM在联动架构中的角色是什么？**
- A. 直接阻断攻击
- B. 日志汇聚中心+关联分析引擎+联动触发器  ✅
- C. 替代防火墙
- D. 存储数据

> SIEM是联动架构的大脑：收集日志 → 关联分析 → 触发联动 → 驱动SOAR执行。

**Q5：SOAR剧本应该遵循什么原则？**
- A. 越复杂越好
- B. 简单可靠+有回滚机制+可人工介入  ✅
- C. 全自动无人值守
- D. 随意设计

> 剧本追求可靠而非炫技。必须有安全回滚和人工确认环节，避免自动误杀业务。

---

## 📚 九、课后资源

| 资源 | 链接 | 说明 |
|------|------|------|
| SIEM部署指南 | elastic.co/guide/en/elastic-stack | ELK官方文档 |
| SOAR最佳实践 | sans.org/white-papers | SANS白皮书 |
| 告警关联方法论 | 各大安全厂商官网 | 关联分析技术 |

---

## 🧠 十、专家锦囊

> **钱运维说：** 不要为了联动而联动。联动的目的是提升效率而非炫技。建议先做最高ROI的联动：①WAF高危告警 → 防火墙自动封禁（简单但最有效）②EDR检测恶意进程 → SIEM告警+自动隔离。从简单可靠开始，逐步完善。

---

📅 **Day 20 完成！** 今天你学会了安全设备联动——打破告警孤岛，让所有保安协同作战！
