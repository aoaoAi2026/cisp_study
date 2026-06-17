# Day 18：重大安全事件深度溯源与复盘
## 破案不只是抓人，还要搞清楚"为什么会这样"

---

> 🎯 **今日目标**  
> 掌握5Why根因分析 · 学习取证溯源工具链 · 输出整改方案

---

## 📖 一、为什么溯源和复盘如此重要？

护网演习中的经典场景：

```
事件：Web服务器被上传了Webshell

❌ 表面处置（又回到原点）：
  "删掉Webshell，打上补丁，完事"
  → 下次换个方式又来了

✅ 深度溯源+复盘（根本解决问题）：
  "这个Webshell是怎么上传的？"
  → SQL注入获取了管理员密码
  "为什么会有SQL注入？"
  → 这个模块是外包的，上线前没做安全测试
  "为什么没做安全测试？"
  → 公司没有安全测试流程
  "为什么没有安全测试流程？"
  → SO整改：建立SDL安全开发流程！

→ 从一个Webshell → 推动建立了完整的安全开发体系！
```

---

## 📖 二、5Why分析法——五层追问找根因

5Why是丰田发明的根因分析方法（是的，造车企业发明的）：

### 🔍 用5Why分析一次真实事件

```
事件：数据库被拖库，100万用户数据泄露

Why 1：为什么数据库被拖库？
  → 攻击者拿到了数据库管理员密码

Why 2：为什么攻击者能拿到密码？
  → 密码明文写在Web应用的配置文件里

Why 3：为什么密码会明文写在配置文件里？
  → 开发人员为了方便调试把密码写在了代码里

Why 4：为什么开发人员能把密码写进代码？
  → 没有代码安全扫描工具，没人发现这个问题

Why 5：为什么没有代码安全扫描工具？
  → 安全预算不足，管理层没有批准采购

根因：不是密码太简单，不是攻击者太厉害
  → 是安全治理层面的问题：缺乏安全开发规范和安全预算
```

### ⚡ 直接原因 vs 根本原因

```
直接原因（Direct Cause）= 发生了什么（Trigger）
  例子："攻击者利用了SQL注入漏洞"

根本原因（Root Cause）= 为什么会发生（System Issue）  
  例子："公司没有安全开发流程，上线前不做安全测试"

复盘核心：不要停留在直接原因，一定要挖到根本原因！
```

---

## 📖 三、电子取证——还原犯罪现场

### 🔬 取证三大领域

| 领域 | 取证内容 | 常用工具 | 能发现什么 |
|------|----------|----------|-----------|
| **磁盘取证** | 硬盘镜像分析 | FTK Imager, Autopsy | 删除的文件、隐藏数据、时间线 |
| **内存取证** | RAM内存快照 | Volatility | 正在运行的进程、网络连接、密码 |
| **日志取证** | 各类日志文件 | ELK, Splunk | 登录记录、操作记录、攻击时间线 |

### ⚠️ 取证第一铁律：不破坏原始证据

```
❌ 错误做法：
  怀疑某台服务器有Webshell → 登录进去找 → 打开文件看 → 删掉
  → 文件时间戳被改了！证据被污染了！

✅ 正确做法：
  1. 先做磁盘镜像（用dd/ftk imager做个完整快照）
  2. 先做内存转储（用DumpIt或WinPMEM）
  3. 对镜像进行分析（原始服务器不动）
  4. 所有操作记录在案（谁、什么时间、做了什么）
```

### 📋 证据保管链（Chain of Custody）

```
一条完整的证据链：

2024-06-17 09:00 张三（安全工程师）发现异常 → 报告
2024-06-17 09:15 李四（取证工程师）开始取证 → 做磁盘镜像
2024-06-17 09:30 镜像MD5: a1b2c3... → 记录哈希
2024-06-17 09:45 镜像交王五（分析工程师）→ 签收
2024-06-17 12:00 王五完成分析 → 输出取证报告
...

每一步都有记录 → 证据在法庭上也能用！
```

---

## 📖 四、事件溯源的完整流程

```
第1步：发现告警
  SIEM/WAF/EDR 发出告警 → 确认是否为真实攻击

第2步：初始研判
  ✅ 什么类型的攻击？
  ✅ 攻击源在哪？（IP/域名）
  ✅ 影响了哪些系统？

第3步：时间线重建
  ⏰ 攻击者最早什么时间进入的？
  ⏰ 什么时间提权的？
  ⏰ 什么时间横向移动的？
  ⏰ 什么时间窃取数据的？
  → 用日志拼出完整的攻击时间线

第4步：攻击路径还原
  🗺️ 从哪儿进来的？（初始入侵点）
  🗺️ 去了哪些地方？（横向移动）
  🗺️ 最终到了哪？（攻击目标）

第5步：攻击源定位
  📍 IP归属（Whois查询）
  📍 域名注册信息
  📍 使用的工具和基础设施

第6步：输出溯源报告
  📄 事件概述 → 攻击时间线 → 攻击路径 → 影响评估 → 改进建议
```

---

## 📖 五、怎么写一份好的复盘报告？

### 📄 复盘报告框架

```
1. 事件概述（1段话）
   什么时间、什么系统、发生了什么、影响多大

2. 攻击时间线（最直观的方式）
   14:30  攻击者发送钓鱼邮件
   14:35  员工点击链接，输入了账号密码
   14:40  攻击者登录VPN
   14:50  攻击者开始内网扫描
   15:20  攻击者在Web服务器上发现SQL注入
   16:00  攻击者获取数据库管理员密码
   17:30  数据开始外传
   18:00  安全团队发现异常

3. 根因分析（5Why）
   一层一层挖到根本原因

4. 改进措施（SMART原则）
   Specific   → 具体要做什么
   Measurable → 怎么衡量完成了
   Achievable → 能做到吗
   Relevant   → 与根因相关吗
   Time-bound → 什么时候完成

5. 责任人和时间表
   谁负责什么、什么时候完成
```

### ❌ 常见的复盘陷阱

```
陷阱1：停留在表面原因
  "密码太简单了" → 加强密码策略
  ← 这只是治标，根因可能是"为什么会有这个弱密码账户"

陷阱2：改进措施太虚
  "加强安全意识" → 怎么加强？谁负责？什么时候？
  ← SMART原则！

陷阱3：变成追责会而非改进会
  "都是张三的问题，他不该..." 
  ← 复盘的目标是改进流程，不是找人背锅
```

---

## 💻 六、动手试试：5Why根因分析引擎

```python
# 5Why根因分析框架
class FiveWhyAnalyzer:
    def __init__(self, incident_name, date):
        self.incident_name = incident_name
        self.date = date
        self.whys = []
        self.timeline = []
        self.improvements = []
    
    def add_why(self, question_index, problem_statement, answer):
        """添加一层Why分析"""
        self.whys.append({
            'level': question_index,
            'problem': problem_statement,
            'answer': answer
        })
    
    def add_timeline_event(self, time, event, category=''):
        """添加攻击时间线"""
        self.timeline.append({
            'time': time,
            'event': event,
            'category': category
        })
    
    def add_improvement(self, problem, solution, owner, deadline, kpi=''):
        """添加SMART改进措施"""
        self.improvements.append({
            'problem': problem,
            'solution': solution,
            'owner': owner,
            'deadline': deadline,
            'kpi': kpi
        })
    
    def analyze(self):
        """分析根因"""
        if len(self.whys) >= 3:
            root_cause = self.whys[-1]['answer']
            surface_cause = self.whys[0]['problem']
            return {
                'surface': surface_cause,
                'root': root_cause,
                'depth': len(self.whys)
            }
        return {'surface': '', 'root': '分析不充分，需要继续深挖', 'depth': len(self.whys)}
    
    def report(self):
        """输出完整复盘报告"""
        print(f'{"="*60}')
        print(f'📋 事件复盘报告: {self.incident_name}')
        print(f'📅 日期: {self.date}')
        print(f'{"="*60}\n')
        
        # 5Why分析
        print('【根因分析 - 5Why】')
        for w in self.whys:
            indent = '  ' * (w['level'] - 1)
            print(f'{indent}Why {w["level"]}: {w["problem"]}')
            print(f'{indent}  → {w["answer"]}\n')
        
        analysis = self.analyze()
        print(f'🔍 表面原因: {analysis["surface"]}')
        print(f'🎯 根本原因: {analysis["root"]}')
        print(f'📏 分析深度: {analysis["depth"]}层\n')
        
        # 时间线
        if self.timeline:
            print('【攻击时间线】')
            for event in self.timeline:
                icon = {'初始入侵': '🚪', '提权': '⬆️', '横向移动': '↔️',
                        '数据窃取': '📤', '发现': '🔔'}.get(event['category'], '⏰')
                print(f'  {icon} {event["time"]}  {event["event"]}')
            print()
        
        # SMART改进措施
        if self.improvements:
            print('【改进措施 - SMART原则】')
            for i, imp in enumerate(self.improvements, 1):
                print(f'{i}. 📌 问题: {imp["problem"]}')
                print(f'   ✅ 方案: {imp["solution"]}')
                print(f'   👤 负责人: {imp["owner"]}')
                print(f'   ⏰ 截止日期: {imp["deadline"]}')
                if imp['kpi']:
                    print(f'   📊 KPI: {imp["kpi"]}')
                print()
        
        print('─' * 60)
        print('💡 复盘核心: 不追责，找系统性问题，用SMART措施确保改进落地')

# === 分析一次数据库泄露事件 ===
analyzer = FiveWhyAnalyzer('客户数据库泄露事件', '2024-06-17')

# 添加攻击时间线
analyzer.add_timeline_event('09:30', '攻击者向HR部门发送鱼叉钓鱼邮件', '初始入侵')
analyzer.add_timeline_event('09:35', 'HR员工点击链接，下载含宏恶意文档', '初始入侵')
analyzer.add_timeline_event('09:40', '恶意宏执行，下载后门木马', '初始入侵')
analyzer.add_timeline_event('10:15', '攻击者通过后门获取员工桌面权限', '提权')
analyzer.add_timeline_event('11:00', '在桌面上找到明文密码文件 pass.txt', '提权')
analyzer.add_timeline_event('11:30', '使用密码登录数据库服务器', '横向移动')
analyzer.add_timeline_event('12:00-14:00', '执行SELECT导出全部客户数据', '数据窃取')
analyzer.add_timeline_event('14:30', 'SIEM检测到异常大量数据库查询→告警', '发现')

# 5Why分析
analyzer.add_why(1, '为什么数据库会被拖库？', '攻击者获取了数据库管理员密码')
analyzer.add_why(2, '为什么攻击者能获取密码？', 'HR员工在桌面放了明文密码文件')
analyzer.add_why(3, '为什么员工会在桌面放明文密码？', '公司没有密码管理规范，员工觉得'记住太麻烦'')
analyzer.add_why(4, '为什么没有密码管理规范？', '安全部门从未发过关于密码保管的制度文件')
analyzer.add_why(5, '为什么安全部门没有推动此事？', '安全团队只有2人，日常救火都忙不过来，无暇顾及制度建设')

# SMART改进措施
analyzer.add_improvement(
    '员工明文存储密码',
    '1)部署企业密码管理器(如1Password)全程队覆盖 2)发布《密码管理规定》并全员培训',
    '赵安全(安全部)',
    '2024-07-01',
    '全员密码管理器使用率≥95%，半年内同类事件=0起'
)

analyzer.add_improvement(
    '安全团队人力不足',
    '申请增加2名安全工程师编制(HC)，2024Q3到位',
    '钱总监(CTO)',
    '2024-09-30',
    '安全团队扩展至4人，7×24值班可覆盖'
)

analyzer.add_improvement(
    '钓鱼邮件防范能力弱',
    '1)全员工钓鱼演练(每月一次) 2)邮件安全网关升级 3)Office宏默认禁用',
    '李运维(安全运营)',
    '2024-07-15',
    '钓鱼邮件点击率从25%降至≤5%'
)

analyzer.report()
```

---

## 🧪 七、今日实验：完整事件溯源

### 实验目标
给定模拟入侵日志，还原完整攻击链

### 实验步骤

```
1️⃣ 获取模拟入侵日志
   - Web服务器日志 (access.log)
   - 系统安全日志 (Security.evtx)
   - 防火墙日志
   - Sysmon日志

2️⃣ 使用时序分析工具
   ☑ Plaso/log2timeline 建立统一时间线
   ☑ 从最早的可疑事件开始梳理

3️⃣ 还原攻击路径
   ☑ 攻击者怎么进来的？
   ☑ 进来后做了什么？
   ☑ 去了哪些机器？
   ☑ 最终做了什么？

4️⃣ 使用5Why分析根因
   ☑ 为什么会被攻击成功？
   ☑ 为什么检测系统没发现？
   ☑ 推到系统性问题

5️⃣ 编写整改方案（SMART）
   ☑ 具体措施 + 责任人 + 截止日期
```

---

## 📝 八、今日测验

**Q1：5Why分析法中，'5'代表什么？**
- A. 必须问5个人
- B. 连续追问约5次，找到根本原因  ✅
- C. 5个步骤
- D. 5种工具

> 5只是经验值，关键是层层深入直到找到系统性根因。有时3层就够了，有时要7层。

**Q2：直接原因和根本原因的区别是什么？**
- A. 没区别
- B. 直接原因=发生了什么(trigger)，根本原因=为什么会发生(system issue)  ✅
- C. 根本原因不重要
- D. 直接原因是猜测

> 复盘要穿透表面的trigger，找到系统性的root cause。

**Q3：电子取证的第一原则是什么？**
- A. 速度第一
- B. 不破坏原始证据  ✅
- C. 省钱
- D. 先删可疑文件

> 必须先做镜像再分析，使用只读工具，保护证据完整性。

**Q4：改进措施最应该符合什么标准？**
- A. 模糊
- B. SMART原则（具体、可衡量、可实现、相关、有时限）  ✅
- C. 随便
- D. 长篇大论

> SMART = Specific + Measurable + Achievable + Relevant + Time-bound。每条改进都应该是可落地、可检验的。

**Q5：复盘会最应该避免什么？**
- A. 分析问题
- B. 变成追责大会  ✅
- C. 提出建议
- D. 总结教训

> 复盘的目标是改进流程，不是找人背锅。"无责备"文化是有效复盘的基础。

---

## 📚 九、课后资源

| 资源 | 链接 | 说明 |
|------|------|------|
| NIST SP 800-61 | nvlpubs.nist.gov | 事件响应标准 |
| Volatility | volatilityfoundation.org | 内存取证工具 |
| 无责备复盘 | sre.google/sre-book | Google的复盘文化 |

---

## 🧠 十、专家锦囊

> **赵安全说：** 复盘中最常见的陷阱：①停留在表面原因而不深挖 ②改进措施太虚而不具体 ③变成追责会而非改进会。好的复盘 = 客观事实 + 深度根因 + 可行计划。

---

📅 **Day 18 完成！** 今天你学会了深度溯源和复盘——不只抓人，还要找到"为什么这事儿会发生"，并用SMART改进措施确保不再重演！
