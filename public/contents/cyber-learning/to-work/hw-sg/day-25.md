# Day 25：实战模拟·定向攻击与内网事件处置
## 敌人已经进来了——不是"有没有"，而是"在哪里"

---

> 🎯 **今日目标**  
> 入侵告警核实 · 应急响应全流程 · 整改加固方案制定

---

## 📖 一、场景切换——从狂轰滥炸到精准打击

护网第一天红队是"火力覆盖"——对所有人一起打，看谁有漏洞。

到了第二天、第三天，红队策略变了：

```
第一天：广撒网
  "所有暴露面的高危漏洞都试试"
  "所有Web应用都扫一遍"
  "所有VPN都暴力破解一下"
  → 目的是：找到突破口

第二天起：精准打击
  "昨天在XX公司发现了一个SQL注入 → 今天专攻这条线"
  "那封钓鱼邮件有人点了 → 今天从这台机器横向铺开"
  → 目的是：扩大战果，拿下更多资产
```

**所以第二天开始，你面对的不再是"狂轰滥炸"，而是"精准刺杀"。**

---

## 📖 二、场景模拟：一封钓鱼邮件引发的事件

### 📧 攻击链回放

```
Day 2 上午 09:30
  红队发送钓鱼邮件给HR部门小王
  主题："关于2024年度调薪方案的紧急通知"
  附件：调薪方案.docm（含恶意宏）

Day 2 上午 09:35
  小王打开文档，启用了宏
  恶意宏下载了后门程序并执行
  后门程序连接到C2服务器：update.cdn-service.net

Day 2 上午 10:00
  红队通过后门获得了小王电脑的控制权
  在小王电脑上发现：
  - 浏览器保存了公司OA系统密码
  - 桌面上有个"服务器密码.txt"
  
Day 2 上午 10:30
  红队用OA密码登录了内网OA系统
  用服务器密码登录了文件服务器
  → 开始在内网横向移动

Day 2 上午 11:00
  SIEM告警：文件服务器发生异常大量文件读取
  安全团队发现异常
```

---

## 📖 三、蓝队响应——"先取证，后隔离"

### ⚡ 应急响应全流程

```
Step 1：核实告警（10:55-11:05）
  
  安全分析师打开SIEM：
  
  ✅ 告警确认：文件服务器过去30分钟被读取了5000+个文件
  ✅ 异常账户：登录用户是"wangxiaoming"（HR部门的）
  ✅ HR的人为什么在大量读文件服务器的文件？不正常！
  
  → 确认：这很可能是真实的入侵事件
  → 启动应急响应

Step 2：立即行动——取证（11:05-11:15）
  
  不要急着断网！先取证！
  
  ✅ 登录文件服务器 → 查看当前登录会话
  ✅ 记录可疑进程列表：tasklist /v
  ✅ 记录网络连接：netstat -anob
  ✅ 检查最近创建的文件
  ✅ 导出相关日志（保留原始时间戳）
  
  ⚠️ 关键：在"破坏现场"之前，先把证据收集全！

Step 3：遏制（11:15-11:20）
  
  ✅ 封锁来源：隔离小王电脑（EDR一键隔离）
  ✅ 封锁目标：文件服务器临时限制访问
  ✅ 阻断通道：防火墙禁止出站到 C2地址
  ✅ 通知小王：确认他刚才是否有异常操作

Step 4：深度溯源（11:20-12:00）
  
  🔍 溯源问题列表：
  1. 攻击者是怎么进来的？
     → 小王的钓鱼邮件
  2. 邮件是几点发的、几点点的？
     → 09:30发送、09:35打开、09:40宏执行
  3. 攻击者登陆了哪些系统？
     → 先从OA系统获取了IP信息，再连接到文件服务器
  4. 攻击者看了/下载了哪些文件？
     → 主要集中在"薪资"和"合同"文件夹
  5. 还有没有其他机器被横向移动？
     → 目前发现文件服务器，正在排查同网段其他机器

Step 5：影响评估（12:00-12:30）
  
  📊 受影响系统：
  - PC-WANGXIAOMING（已被感染）
  - OA服务器（被异常登录）
  - 文件服务器（文件被大量读取）
  
  📊 数据泄露评估：
  - 薪资文件夹（约200份PDF）→ 可能被下载
  - 合同文件夹（约50份合同扫描件）→ 可能被下载
  - 不包含核心交易数据 → 万幸！

Step 6：整改加固（下午+晚上）
  
  ✅ 技术层面：
  - 全员钓鱼安全意识培训
  - 部署MFA（多因素认证）
  - 服务器禁止存储明文密码
  - 文件服务器增加DLP监控
  
  ✅ 管理层面：
  - 发布《密码管理规定》
  - 桌面不得存放密码文件
  - 钓鱼邮件举报奖励机制
```

---

## 📖 四、关键决策点——什么时候断网？

```
场景1：发现机器已经被控制，但还没横向移动
  → 先取证（进程列表+网络连接+可疑文件）→ 然后断网隔离
  → 先取证是保留溯源线索

场景2：发现大量数据正在外传
  → 立刻断网！优先级：阻断泄露 > 保留证据
  → 每多一秒就多泄露一批数据

场景3：发现勒索软件正在加密文件
  → 立刻断网！必须立即遏制扩散
  → 同时记录加密进程名、文件扩展名等信息

判断口诀：
  数据在跑 → 先断网！
  攻击在潜伏 → 先取证再断网！
```

---

## 📖 五、同类事件防止——整改加固三管齐下

```
人：小王为什么会点钓鱼邮件？
  → 缺乏安全意识 → 全员安全意识培训+钓鱼测试

技术：为什么桌面上有明文密码文件？
  → 缺少密码管理工具 → 部署企业密码管理器

流程：为什么没人发现小王电脑异常？
  → EDR告警没覆盖这些指标 → 优化EDR规则+增加异常行为检测
```

---

## 💻 六、动手试试：事件复盘框架

```python
# 安全事件复盘系统
class IncidentReview:
    def __init__(self, title, date):
        self.title = title
        self.date = date
        self.timeline = []
        self.lessons = []
        self.affected_systems = []
    
    def add_timeline_event(self, time, action, result=''):
        """添加事件时间线"""
        self.timeline.append({
            'time': time,
            'action': action,
            'result': result
        })
    
    def add_affected_system(self, system_name, impact_level, data_involved):
        """记录受影响系统"""
        self.affected_systems.append({
            'system': system_name,
            'impact': impact_level,
            'data': data_involved
        })
    
    def add_lesson(self, problem, root_cause, solution, owner, deadline):
        """添加SMART教训"""
        self.lessons.append({
            'problem': problem,
            'root_cause': root_cause,
            'solution': solution,
            'owner': owner,
            'deadline': deadline
        })
    
    def report(self):
        """输出完整复盘报告"""
        print(f'{"="*60}')
        print(f'📋 安全事件复盘报告')
        print(f'事件: {self.title}')
        print(f'日期: {self.date}')
        print(f'{"="*60}\n')
        
        # 时间线
        print('【事件时间线】')
        icons = {
            '初始入侵': '🚪', '执行': '⚡', '持久化': '📌',
            'C2通信': '📡', '横向移动': '↔️', '数据窃取': '📤',
            '发现': '🔔', '响应': '🛡️', '遏制': '🔒', '恢复': '✅'
        }
        
        for event in self.timeline:
            icon = '⏰'
            for keyword, ic in icons.items():
                if keyword in event['action']:
                    icon = ic
                    break
            result_str = f' → {event["result"]}' if event['result'] else ''
            print(f'  {icon} {event["time"]}  {event["action"]}{result_str}')
        
        print()
        
        # 受影响系统
        if self.affected_systems:
            print('【受影响系统】')
            for s in self.affected_systems:
                impact_icon = '🔴' if s['impact'] == '高' else ('🟠' if s['impact'] == '中' else '🟡')
                print(f'  {impact_icon} {s["system"]} | 影响: {s["impact"]}')
                if s['data']:
                    print(f'     涉及数据: {s["data"]}')
            print()
        
        # 改进措施
        if self.lessons:
            print('【改进措施SMART】')
            for i, lesson in enumerate(self.lessons, 1):
                print(f'{i}. 📌 问题: {lesson["problem"]}')
                print(f'   🔍 根因: {lesson["root_cause"]}')
                print(f'   ✅ 方案: {lesson["solution"]}')
                print(f'   👤 负责人: {lesson["owner"]}')
                print(f'   ⏰ 截止: {lesson["deadline"]}\n')
        
        print('─' * 60)
        print('🔑 核心教训: 不要只修发现的问题，要修让它发生的流程缺陷')

# === 复盘钓鱼邮件导致的内网事件 ===
review = IncidentReview('钓鱼邮件导致内网文件服务器数据泄露', '2024-06-18')

# 攻击时间线
review.add_timeline_event('09:30', '红队发送钓鱼邮件给HR小王', '初始入侵')
review.add_timeline_event('09:35', '小王打开恶意文档，启用宏', '执行')
review.add_timeline_event('09:40', '恶意宏下载并执行后门程序', '持久化')
review.add_timeline_event('09:42', '后门连接C2服务器 update.cdn-service.net', 'C2通信')
review.add_timeline_event('10:00', '红队获得小王电脑完全控制权', '初始入侵完成')
review.add_timeline_event('10:15', '发现小王浏览器保存的OA密码', '凭据窃取')
review.add_timeline_event('10:20', '发现桌面明文密码文件pass.txt', '凭据窃取')
review.add_timeline_event('10:30', '使用OA密码登录OA系统，获取内网信息', '横向移动')
review.add_timeline_event('10:45', '使用服务器密码登录文件服务器', '横向移动')
review.add_timeline_event('11:00', '文件服务器5000+文件被读取，SIEM触发告警', '发现')
review.add_timeline_event('11:05', '安全分析师确认入侵，启动应急响应', '响应')
review.add_timeline_event('11:15', '隔离小王电脑，文件服务器限制访问', '遏制')
review.add_timeline_event('11:30', '启动深度溯源分析', '溯源')
review.add_timeline_event('14:00', '完成溯源报告，制定整改方案', '恢复')

# 受影响系统
review.add_affected_system('PC-WANGXIAOMING (HR部门)', '高', '桌面文件、浏览器密码')
review.add_affected_system('OA服务器', '中', '组织架构、员工信息')
review.add_affected_system('文件服务器', '高', '薪资PDF(200份)、合同(50份)')

# 改进措施
review.add_lesson(
    '员工点击钓鱼邮件',
    '缺乏钓鱼识别能力和安全意识',
    '1. 全员安全意识培训(必修课) 2. 每月钓鱼模拟测试 3. 部署邮件安全网关升级版',
    '赵安全(安全部)',
    '1周内完成培训，次月开始每月测试'
)

review.add_lesson(
    '桌面存放明文密码文件',
    '缺乏密码管理工具和管理规范',
    '1. 部署企业密码管理器(1Password) 2. 发布《密码管理规定》 3. 全量扫描并清理桌面密码文件',
    '李运维',
    '密码管理器2周部署完毕，清理工作即刻开始'
)

review.add_lesson(
    '办公终端安全防护不足',
    'EDR规则未覆盖Office宏行为',
    '1. EDR规则增加Office进程链检测 2. Office默认禁用宏 3. 办公终端EDR全覆盖',
    '钱安全运营',
    '3天内完成规则优化'
)

review.report()
```

---

## 🧪 七、今日实验：内网事件处置演练

### 实验目标
模拟内网入侵事件，完成完整的应急响应

### 实验步骤

```
场景：SIEM告警——HR部门PC加密的文件服务器进行异常大量文件读取

1️⃣ 接到告警（5分钟）
   ☑ 在SIEM确认告警信息
   ☑ 查看登录来源、账号、时间
   ☑ 初步判断：真实攻击还是误报？

2️⃣ 启动应急响应（15分钟）
   ☑ 取证：记录进程/网络/文件
   ☑ 遏制：隔离源主机
   ☑ 通知相关人

3️⃣ 深度溯源（30分钟）
   ☑ 还原完整攻击链
   ☑ 确定影响范围
   ☑ 评估数据泄露情况

4️⃣ 输出复盘报告（20分钟）
   ☑ 攻击时间线
   ☑ 根因分析(5Why)
   ☑ SMART改进措施
```

---

## 📝 八、今日测验

**Q1：确认一台内网服务器已被植入后门，需不需要立即断网？**
- A. 不用管
- B. 先收集证据再断网隔离  ✅
- C. 直接重装
- D. 删可疑文件

> 先取证后隔离——保留溯源线索。但如果是数据正在大量外传，优先级改为立即断网。

**Q2：溯源发现攻击者是先拿到HR部门密码才横向移动的，怎么防止同类事件？**
- A. 只改这个密码
- B. 全员MFA + 强密码管理 + 安全意识培训  ✅
- C. 换个邮箱
- D. 不管

> 人+技术+流程三管齐下。MFA是最有效的技术手段，密码管理器是最实用的管理手段。

**Q3：整改加固方案应以什么优先？**
- A. 所有漏洞一起修
- B. 修复攻击者实际利用的漏洞 → 同类资产相同漏洞  ✅
- C. 只修低危
- D. 忽略

> 先堵住确实被利用的口子，再辐射到同类资产——避免攻击者在同类目标上再来一次。

---

## 📚 九、课后资源

| 资源 | 链接 | 说明 |
|------|------|------|
| MFA部署最佳实践 | nist.gov | NIST身份认证指南 |
| 安全意识培训方案 | sans.org/security-awareness | SANS安全意识 |

---

## 🧠 十、专家锦囊

> **赵安全说：** 内网事件处置的"破窗效应"——护网中一旦确认内网有攻击者，应立即拉开全面排查。攻击者在内网往往不止一个据点，找到一个就代表可能有多个。不要只处置发现的那个点就放松警惕。

---

📅 **Day 25 完成！** 今天你学会了内网入侵事件处置——先取证后隔离，再复盘改进，从一次事件中挖掘系统性防护提升！
