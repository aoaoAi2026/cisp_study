# Day 16：高阶攻击与APT攻击体系
## 从小偷到特工——国家级网络攻击是什么样子的

---

> 🎯 **今日目标**  
> 理解APT攻击特征 · 掌握APT检测方法 · 学习APT组织TTPs

---

## 📖 一、APT是什么？——从小毛贼到间谍组织

### 🎭 三个层次看懂网络攻击

```
普通黑客（Script Kiddie）：
  特征：用现成工具扫一扫，打打小网站
  目的：炫耀、练手、搞破坏
  防护：防火墙+杀毒软件基本够用
  比喻：街上随机撬锁的小偷 🦝

有组织犯罪团伙（Cyber Crime）：
  特征：勒索软件、盗取信用卡、诈骗
  目的：赚钱
  防护：需要专业安全团队
  比喻：有组织、有分工的盗窃团伙 🦊

APT（Advanced Persistent Threat）：
  特征：国家/情报机构背景、使用0day、潜伏数年
  目的：间谍活动、情报窃取、关键设施破坏
  防护：需要顶级安全运营+情报共享
  比喻：受过长期训练、有国家支持的特工 🐲
```

### 📊 APT的三大特征

| 特征 | 含义 | 你能理解成这样 |
|------|------|---------------|
| **A - Advanced（高级）** | 使用0day漏洞、定制化恶意软件、多种攻击技术组合 | 用的武器都是自制的，市面上买不到也检测不到 |
| **P - Persistent（持续）** | 潜伏数月甚至数年，长期窃取情报 | 不是抢一票就跑，而是长期卧底 |
| **T - Threat（威胁）** | 针对特定国家/行业/企业，有明确政治/经济目标 | 攻击你不是随机的，你就是他们的目标 |

---

## 📖 二、国内活跃的APT组织——你在和谁对抗？

| APT组织 | 绰号 | 主要目标 | 特色手法 |
|---------|------|----------|----------|
| **海莲花** | OceanLotus | 东南亚政企、海事机构 | 鱼叉钓鱼+自研远控木马 |
| **毒云藤** | APT-C-01 | 政府、科研、能源 | 钓鱼邮件+伪造网站 |
| **蔓灵花** | Bitter | 政府、军工、能源 | 复杂的C2基础设施 |
| **响尾蛇** | SideWinder | 政府、军事 | 大量使用PowerShell |
| **蓝宝菇** | APT-C-12 | 核能、航空航天 | 长期潜伏窃取资料 |

---

## 📖 三、APT攻击全生命周期——他们是怎么一步步进来的？

```
┌─────────────────────────────────────────────────┐
│               APT 攻击全生命周期                      │
├──────┬──────┬──────┬──────┬──────┬──────┬─────────┤
│ 侦察  │ 武器化 │ 投递  │ 利用  │ 安装  │ C2   │ 目标达成 │
│ 3个月  │ 1个月  │ 1天  │ 几分钟│ 几分钟│ 数月 │ 数月-年 │
└──────┴──────┴──────┴──────┴──────┴──────┴─────────┘
```

### ① 侦察阶段（可能持续数月）

```
攻击者研究你的公司就像一个学生在做毕业课题：
  ✅ 公司官网：组织结构、员工邮箱格式
  ✅ 招聘网站：你们在用哪些技术？（Java? Python? Oracle?）
  ✅ 领英：员工信息、职位、项目经验
  ✅ GitHub：有没有员工不小心传了密码/配置文件？
  ✅ 历史泄露数据：从Have I Been Pwned查员工泄露的密码
  ✅ 社交媒体：员工的日常习惯、出国行程
  
→ 攻击者比你想象的更了解你的公司
```

### ② 武器化阶段

```
根据侦察结果，定制攻击武器：
  ✅ 制作针对你们公司域名的钓鱼页面
  ✅ 编写针对你们用到的软件的漏洞利用代码
  ✅ 在恶意文档中植入你的名字和项目信息
  ✅ 准备C2服务器基础设施（多个域名、多台VPS）
```

### ③ 投递阶段

```
最常用的投递方式（按成功率排列）：
  1. 鱼叉钓鱼邮件（含恶意附件或链接）—— 成功率80%+
  2. 水坑攻击（黑掉你们行业常用的论坛/网站）
  3. 物理接近（USB掉落攻击、假装访客）
  4. 供应链攻击（黑掉你们的软件供应商）
```

### ④ 利用 → ⑤ 安装 → ⑥ C2

```
利用漏洞获得初始权限后：
  → 安装持久化后门（计划任务/注册表/WMI）
  → 建立C2通信通道（HTTPS/DNS/ICMP隧道）
  → 获取更高权限（提权）
  → 横向移动到目标系统
```

### ⑦ 目标达成阶段

```
根据任务目标执行：
  ✅ 窃取机密文件（悄悄地打包上传）
  ✅ 监控内部通信（偷看邮件、聊天记录）
  ✅ 长期潜伏（等待关键时刻行动）
  ✅ 销毁证据（攻击完成后清理痕迹）
```

---

## 📖 四、APT的三大杀招

### 🔪 杀招1：DCSync

```
你是一个APT攻击者，已经控制了一台内网服务器。
你的终极目标：域控上的所有用户密码哈希。

如果直接攻击域控 → 可能被检测到
聪明的做法（DCSync）：
  → 伪装成一台"新加入的域控"
  → 向真实域控发送同步请求："嗨，我刚来，把最新数据给我"
  → 域控以为你是合法域控 → 把所有用户哈希发过来
  → 你拿到了整个域的钥匙！
```

### 🎫 杀招2：Golden Ticket（黄金票据）

```
Kerberos认证体系中有一个超级密钥：KRBTGT账户的哈希
拿到它 = 能签发任何人的"临时身份证"

APT拿到KRBTGT哈希后：
  → 自己签发一个"域管理员"的票据
  → 有效期：10年
  → 即使域管改了密码，这个票据依然有效！
  → 随时可以以域管身份访问任何资源
```

### 🎯 杀招3：DLL侧加载（DLL Side-Loading）

```
APT不自己写exe文件（容易被杀毒软件发现），
而是利用合法签名的程序加载恶意DLL：

  C:\合法软件\legit.exe（有微软签名的）
  + C:\合法软件\恶意.dll（APT放的）
  → 杀毒软件：legit.exe是合法的 → 放行！
  → 但legit.exe加载了恶意DLL → APT代码执行了！

这就是"借用别人的通行证"进小区。
```

---

## 📖 五、怎么对抗APT？——"假设已被入侵"心态

对抗APT不能用对抗普通黑客的思维：

```
❌ 错误心态：  "我们有防火墙+WAF+EDR，很安全"
✅ 正确心态：  "假设攻击者已经在内网了，我们要怎么发现他？"

因为APT会用0day绕过你的防火墙
会用定制木马躲过你的EDR
会用合法工具隐藏自己
```

### 🛡️ APT检测策略

```
1️⃣ 不依赖特征检测
   APT不用已知恶意软件，特征库没用
   → 改用行为分析

2️⃣ 关注"合法的异常"  
   攻击者用 psexec（微软官方工具）横向移动
   → 不是检测 psexec 本身
   → 而是检测"为什么HR部门的人在运维服务器？"

3️⃣ DNS流量是必看的
   APT无论如何需要C2通信
   DNS通常不加密、不监控
   → 是APT最常用的隐蔽通道

4️⃣ 常态化威胁狩猎
   不等待告警，每天主动去日志里找异常
   → 按照ATT&CK框架逐项排查

5️⃣ 多维度关联分析
   单独的syslog看起来没问题
   单独的网络流量看起来没问题  
   但放在一起：同一时间，同一台机器
   → 一边有可疑进程，一边有异常外联 → 有问题！
```

---

## 💻 六、动手试试：APT异常行为检测

```python
# APT攻击检测——隐蔽活动行为分析
from collections import defaultdict

class APTDetector:
    def __init__(self):
        # 基线阈值（正常行为的上限）
        self.thresholds = {
            'dns_queries_per_hour': 500,    # DNS查询频率
            'new_processes_per_hour': 50,    # 新进程创建频率
            'lateral_auths_per_hour': 10,    # 横向登录尝试频率
            'domain_len_avg': 52,            # 平均DNS域名长度
            'off_hours_login': 3,            # 非工作时间登录次数
        }
        self.baselines = defaultdict(lambda: defaultdict(float))
        self.host_profiles = defaultdict(dict)
    
    def observe(self, host, event_type, value, hour=12):
        """记录主机行为"""
        self.baselines[host][event_type] += value
        
        # 记录行为时间分布
        if 'hour_distribution' not in self.host_profiles[host]:
            self.host_profiles[host]['hour_distribution'] = defaultdict(int)
        self.host_profiles[host]['hour_distribution'][hour] += 1
    
    def detect_anomalies(self, host):
        """检测异常行为"""
        alerts = []
        profile = self.baselines[host]
        
        # 检查1：DNS隧道（高频+超长域名）
        if profile.get('dns_queries_per_hour', 0) > self.thresholds['dns_queries_per_hour']:
            alerts.append({
                'severity': '🔴 高',
                'type': 'DNS隧道嫌疑',
                'detail': f'{host} DNS查询 {profile["dns_queries_per_hour"]:.0f}次/小时 (阈值{self.thresholds["dns_queries_per_hour"]})',
                'attck': 'T1071.004'
            })
        
        if profile.get('domain_len_avg', 0) > self.thresholds['domain_len_avg']:
            alerts.append({
                'severity': '🟠 中',
                'type': 'DNS隧道(超长域名)',
                'detail': f'{host} 平均域名长度 {profile["domain_len_avg"]:.0f} (阈值{self.thresholds["domain_len_avg"]})',
                'attck': 'T1071.004'
            })
        
        # 检查2：横向移动
        if profile.get('lateral_auths_per_hour', 0) > self.thresholds['lateral_auths_per_hour']:
            alerts.append({
                'severity': '🔴 高',
                'type': '横向移动嫌疑',
                'detail': f'{host} 横向认证 {profile["lateral_auths_per_hour"]:.0f}次/小时',
                'attck': 'T1021'
            })
        
        # 检查3：非工作时间异常活动
        hour_dist = self.host_profiles[host].get('hour_distribution', {})
        off_hours = sum(v for h, v in hour_dist.items() if h < 6 or h > 22)
        if off_hours > self.thresholds['off_hours_login']:
            alerts.append({
                'severity': '🟠 中',
                'type': '非工作时间活动',
                'detail': f'{host} 凌晨/深夜活动 {off_hours}次',
                'attck': 'T1036'
            })
        
        return alerts
    
    def full_scan(self):
        """全环境扫描"""
        print('=== 🔍 APT异常行为检测 ===\n')
        all_alerts = []
        for host in self.baselines:
            alerts = self.detect_anomalies(host)
            all_alerts.extend(alerts)
            for alert in alerts:
                print(f'{alert["severity"]} [{alert["attck"]}] {alert["detail"]}')
        
        if not all_alerts:
            print('✅ 未发现异常行为')
        else:
            print(f'\n📊 共发现 {len(all_alerts)} 条异常')

# === 模拟APT隐蔽活动检测 ===
detector = APTDetector()

# 模拟APT使用DNS隧道（高频+超长域名）
detector.observe('SRV-FINANCE', 'dns_queries_per_hour', 2000, 3)   # 凌晨3点
detector.observe('SRV-FINANCE', 'domain_len_avg', 78)
detector.observe('SRV-FINANCE', 'off_hours_login', 5, 3)

# 模拟APT横向移动
detector.observe('PC-HR-05', 'lateral_auths_per_hour', 45, 2)      # 凌晨2点
detector.observe('PC-HR-05', 'off_hours_login', 8, 2)

# 正常主机
detector.observe('PC-ENG-01', 'dns_queries_per_hour', 30, 10)
detector.observe('PC-ENG-01', 'lateral_auths_per_hour', 2, 10)

detector.full_scan()
```

---

## 🧪 七、今日实验：APT攻击事件复盘

### 实验目标
分析公开APT报告，提取TTPs并编写检测规则

### 实验步骤

```
1️⃣ 选择一份公开APT分析报告
   推荐：海莲花、APT29、Lazarus等组织的分析报告

2️⃣ 提取APT的TTPs
   ☑ 他们用什么初始入侵方式？
   ☑ 他们用什么持久化方法？
   ☑ 他们C2通信有什么特征？
   ☑ 他们横向移动用什么工具？
   ☑ 他们怎么窃取数据？

3️⃣ 映射到ATT&CK框架
   把每个技术标注对应的ATT&CK ID

4️⃣ 编写检测规则
   ☑ 用提取的TTPs编写SIEM规则
   ☑ 用Suricata/Yara规则检测特定特征

5️⃣ 用Atomic Red Team验证检测规则
```

---

## 📝 八、今日测验

**Q1：APT攻击与普通网络攻击最大的区别是什么？**
- A. 没区别
- B. 长期性、定向性、组织化高级攻击  ✅
- C. 技术更落后
- D. 只针对个人

> APT = Advanced（高级）+ Persistent（持续）+ Threat（威胁），是国家级的有组织定向攻击。

**Q2：APT攻击中最常用的初始入侵手段是什么？**
- A. 直接攻击防火墙
- B. 鱼叉式钓鱼邮件  ✅
- C. 广播攻击
- D. 物理入侵

> 80%+的APT入侵从一封针对特定目标的钓鱼邮件开始，成功率远高于技术攻击。

**Q3：DCSync攻击的目标是什么？**
- A. Web服务器
- B. 从域控同步域用户密码哈希  ✅
- C. 数据库
- D. VPN设备

> DCSync伪装成域控，请求"同步数据"，域控就会把所有用户凭据哈希发过去。

**Q4：对抗APT最核心的心态是什么？**
- A. 我们有最好的设备
- B. 假设已被入侵，持续检测和狩猎  ✅
- C. 等告警
- D. 相信防火墙

> 面对APT不能抱有侥幸心理，必须假设攻击者已经在环境中。

**Q5：Golden Ticket（黄金票据）为什么危险？**
- A. 能窃取数据
- B. 拿到KRBTGT哈希后可以伪造任意用户身份，且改密码也无效  ✅
- C. 很贵
- D. 很稀有

> KRBTGT是Kerberos的根密钥，拿到后可以自己签发任意票据，有效期可设10年。

---

## 📚 九、课后资源

| 资源 | 链接 | 说明 |
|------|------|------|
| MITRE ATT&CK Groups | attack.mitre.org/groups | 全球APT组织TTPs |
| APT分析报告 | securelist.com | 卡巴斯基APT报告 |
| 威胁情报平台 | otx.alienvault.com | 开源威胁情报 |

---

## 🧠 十、专家锦囊

> **赵安全说：** APT检测不能只靠设备。APT攻击者往往会研究你用的安全设备并针对性地绕过。对付APT需要：①假设已被入侵的心态 ②主动威胁狩猎 ③多维度关联分析 ④红蓝对抗验证。防御APT的核心不是买设备，而是持续的安全运营能力。

---

📅 **Day 16 完成！** 今天你见识了国家级网络攻击——APT不是小偷而是特工，对抗方式必须升级！
