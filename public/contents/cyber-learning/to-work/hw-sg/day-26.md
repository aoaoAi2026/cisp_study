# Day 26：实战模拟·APT隐蔽攻击与收官
## 越到最后越危险——疲劳是蓝队最大的敌人

---

> 🎯 **今日目标**  
> 识别隐蔽攻击（DNS/ICMP隧道） · 全域风险排查清零 · 防守成效统计

---

## 📖 一、护网收官——最容易翻车的时刻

### 📊 历史数据告诉我们的残酷事实

```
护网演习失分时间分布：
  第一天-第三天：25%  （大家都很警觉）
  第四天-第七天：30%  （开始疲劳了）
  最后48小时：   45%  ← 失分最多的时候！

为什么最后48小时失分最多？
  😴 人员极度疲劳（连续熬夜一周）
  😮‍💨 心理上放松（"快结束了，应该没什么大事"）
  🎯 红队做最后冲刺（"最后机会了，用藏着的招数"）
```

> ⚠️ **护网不到最后一分钟，都不能松懈！**

---

## 📖 二、APT的隐蔽攻击手法——收官阶段常见

红队在收官阶段会切换到"隐蔽模式"，因为他们知道常规攻击手法已经被你摸透了。

### 🕳️ DNS隧道——利用DNS绕防火墙

```
为什么DNS隧道是APT的最爱？

1. 几乎所有网络都允许DNS出站
   你的防火墙：禁止出站到任意IP → 严格
   你的DNS设置：允许查任意域名 → 放行
   → 攻击者利用这个"必须开放"的通道！

2. DNS流量监控少
   你看Web日志、SSH日志、数据库日志
   你看DNS日志吗？
   → 这是安全监控的最大盲区之一

3. 如何识别DNS隧道？
   
   正常DNS查询：
   每台电脑每小时 50-200 次查询
   域名长度：15-30 字符 (www.baidu.com)
   查询类型：A记录（获取IP地址）

   DNS隧道特征：
   单台电脑每小时 1000+ 次查询 🚨
   域名超长：e9c8f7a6b5d4e3f2...malicious.xyz（50+字符）🚨
   大量 TXT/NULL 记录请求 🚨
   → 这里面藏了数据！每次查询都在往外传信息！
```

### 📡 ICMP隧道——ping里藏数据

```
ICMP = ping 命令使用的协议

正常ping：
  ping www.baidu.com → 发出32字节的ICMP包
  目的：测试目标是否在线

ICMP隧道：
  攻击者把数据藏在ping包里：
  每个ping包的数据字段里放一点机密数据
  接收端把大量ping包的数据字段拼起来
  → 一份完整的机密文件就传出去了！
  
检测方法：
  监控ICMP包的大小和频率
  正常ping：32-64字节，偶尔几个
  隧道ping：1000+字节（最大可到65535），持续大量发送
```

---

## 📖 三、护网收官阶段的工作重点

### 🗓️ 收官阶段日程表

```
倒数第3天（全部精力在检测和处置）：

  上午（08:00-12:00）
  ✅ 隐蔽攻击专项排查
     - DNS日志全面分析（过去7天所有异常DNS查询）
     - 网络流量回溯（有没有大流量出站？）
     - 检查有没有新增的持久化后门
  
  下午（14:00-18:00）
  ✅ 全域风险排查清零
     - 扫描所有主机的新增计划任务
     - 扫描所有主机的新增自启动项
     - 扫描所有主机的新增用户账户
     - 扫描所有主机的新增服务

倒数第2天（防守成效统计和数据汇总）：

  上午（08:00-12:00）
  ✅ 统计防守成效
     - 总告警数
     - 拦截成功率
     - 溯源成功率
     - MTTD（平均检测时间）
     - MTTR（平均响应时间）
  
  下午（14:00-22:00）
  ✅ 结项报告框架搭建
     - 护网总览
     - 关键数据
     - 典型案例
     - 改进建议

最后1天（但护网还没结束！）：
  
  ✅ 保持最高警惕！
  ✅ 站好最后一班岗
  ✅ 红队可能在最后几小时用"杀手锏"
```

---

## 📖 四、全域风险排查——收官清场行动

护网快结束了，你要确保攻击者没有在你网络里留下"定时炸弹"（持久化后门）：

### 🔍 清场排查清单

```
☑ 排查新增用户账户
   Windows: net user /domain → 有没有新增的可疑用户？
   Linux: cat /etc/passwd | grep -v nologin → 新增了谁？

☑ 排查新增计划任务
   Windows: schtasks /query /fo LIST /v
   Linux: crontab -l (每个用户都要看)
   → 有没有来历不明的计划任务？

☑ 排查新增自启动项
   注册表: HKLM\...\Run, HKCU\...\Run
   → 有没有异常程序每次开机自动启动？

☑ 排查新增服务
   Windows: sc query state= all
   Linux: systemctl list-units --type=service
   → 有没有伪装成"Windows Update"的木马服务？

☑ 排查WMI事件订阅
   → 最隐蔽的持久化方式之一
   → 用工具检查WMI永久事件订阅

☑ 排查新增文件
   在Web目录、系统目录、临时目录
   查找过去7天内创建的可疑文件

☑ 排查异常进程
   有没有进程名很像系统进程但其实不是的？
   例: svch0st.exe (是0不是o!) / lsasss.exe (多一个s!)
```

---

## 📖 五、防守成效统计——用数据说话

### 📊 核心指标体系

```
1️⃣ 告警总量
   整个护网期间共产生多少告警？
   
2️⃣ 拦截成功率
   = 被成功拦截的攻击 / 总攻击尝试 * 100%
   越高越好！目标 > 95%

3️⃣ 事件闭环率
   = 已处置完成的事件 / 总事件数 * 100%
   目标 = 100%（不能有未闭环的事件）

4️⃣ 溯源成功率
   = 成功溯源到攻击源的事件 / 总事件数 * 100%
   越高越好，这是加分项！

5️⃣ MTTD（Mean Time To Detect）
   = 从攻击发生到检测发现的平均时间
   越低越好！目标 < 30分钟

6️⃣ MTTR（Mean Time To Respond）
   = 从发现到完成处置的平均时间
   越低越好！目标 < 60分钟
```

---

## 💻 六、动手试试：DNS隧道检测器

```python
# DNS隧道隐蔽通信检测
class DNSTunnelDetector:
    def __init__(self):
        self.queries = {}  # {host: [(domain, type), ...]}
    
    def record_query(self, host, domain, query_type='A'):
        """记录一次DNS查询"""
        if host not in self.queries:
            self.queries[host] = []
        self.queries[host].append({
            'domain': domain,
            'type': query_type,
            'length': len(domain)
        })
    
    def scan(self, time_window_hours=1):
        """扫描所有主机的DNS行为"""
        print(f'=== 🔍 DNS隧道检测 (过去{time_window_hours}小时) ===\n')
        
        suspicious_hosts = []
        
        for host, queries in self.queries.items():
            query_count = len(queries)
            avg_domain_len = sum(q['length'] for q in queries) / query_count if query_count > 0 else 0
            txt_queries = sum(1 for q in queries if q['type'] == 'TXT')
            max_domain_len = max(q['length'] for q in queries)
            
            alerts = []
            
            # 规则1：查询频率异常高
            if query_count > 500:
                alerts.append(f'高频查询: {query_count}次/小时')
            
            # 规则2：平均域名长度异常
            if avg_domain_len > 52:
                alerts.append(f'超长域名: 平均{avg_domain_len:.0f}字符')
            
            # 规则3：大量TXT记录请求
            if txt_queries > 50:
                alerts.append(f'大量TXT请求: {txt_queries}次')
            
            # 规则4：单个域名超长
            if max_domain_len > 100:
                alerts.append(f'发现超长域名: {max_domain_len}字符')
            
            # 输出结果
            if alerts:
                risk_level = '🔴 高危' if len(alerts) >= 3 else ('🟠 可疑' if len(alerts) >= 2 else '🟡 注意')
                print(f'{risk_level} {host}:')
                for alert in alerts:
                    print(f'  ⚡ {alert}')
                
                # 展示一些可疑域名样本
                long_domains = [q['domain'] for q in queries if q['length'] > 52]
                if long_domains:
                    print(f'  可疑域名样本:')
                    for d in long_domains[:3]:
                        print(f'    {d}')
                print()
                
                suspicious_hosts.append((host, len(alerts)))
            else:
                print(f'🟢 {host}: 正常 (查询{query_count}次, 平均域名{avg_domain_len:.0f}字符)')
        
        # 汇总
        print(f'{"="*50}')
        print(f'📊 扫描总计: {len(self.queries)}台主机')
        if suspicious_hosts:
            suspicious_hosts.sort(key=lambda x: x[1], reverse=True)
            print(f'⚠️  可疑主机: {len(suspicious_hosts)}台')
            print(f'🔴 最可疑: {suspicious_hosts[0][0]}')
        else:
            print(f'✅ 未发现DNS隧道迹象')

# === 模拟检查 ===
detector = DNSTunnelDetector()

# 模拟正常主机
for _ in range(30):
    detector.record_query('PC-ENG-01', 'www.baidu.com', 'A')

# 模拟APT使用DNS隧道
tunnel_host = 'SRV-FINANCE'
for i in range(600):  # 高频查询
    # 模拟编码数据的超长域名
    encoded_data = f'data-block-{i:05d}-' + 'a' * 40
    domain = f'{encoded_data}.evil-c2.xyz'
    detector.record_query(tunnel_host, domain, 'TXT' if i % 3 == 0 else 'A')

# 正常主机
for _ in range(50):
    detector.record_query('PC-HR-05', 'www.google.com', 'A')

detector.scan()
```

---

## 🧪 七、今日实验：隐蔽攻击识别演练

### 实验目标
在日志中识别DNS隧道和ICMP隧道攻击

### 实验步骤

```
1️⃣ 准备数据
   ☑ 正常DNS日志（模拟）
   ☑ 混入DNS隧道日志（高频+超长域名+TXT请求）

2️⃣ 编写检测规则
   ☑ DNS查询频率检测
   ☑ 域名长度异常检测
   ☑ TXT记录比例异常检测

3️⃣ 执行扫描
   ☑ 对所有主机过去7天的DNS日志扫描
   ☑ 标记异常主机

4️⃣ 统计护网指标
   ☑ MTTD：从攻击开始到被检测发现的平均时间
   ☑ MTTR：从发现到处置完成的平均时间
   ☑ 拦截成功率

5️⃣ 输出收官检查报告
```

---

## 📝 八、今日测验

**Q1：如何识别DNS隧道？**
- A. 很难
- B. DNS查询频率异常高 + 域名长度异常 + 大量TXT记录请求  ✅
- C. 看DNS服务器端口
- D. 看IP地址

> DNS隧道三大特征：高频查询、超长域名（编码数据）、大量TXT/NULL记录请求。

**Q2：护网即将结束，还需要保持高度警惕吗？**
- A. 可以放松了
- B. 越到最后越不能放松，历史上最多失分发生在最后48小时  ✅
- C. 直接下班
- D. 只留一个人

> 护网最后48小时是失分最多的时段，越是疲劳越要警惕。

**Q3：护网防守成效评估的核心指标不包括？**
- A. 总告警数
- B. 拦截成功率
- C. 员工满意度  ✅
- D. MTTD/MTTR

> 防守成效的核心指标是：告警总数、拦截率、闭环率、溯源成功率、MTTD、MTTR。这些都是可量化的硬指标。

---

## 📚 九、课后资源

| 资源 | 链接 | 说明 |
|------|------|------|
| DNS隧道检测技术 | 安全厂商白皮书 | 详细检测方法 |
| ICMP隧道分析 | 网络分析教程 | 隐蔽信道检测 |
| 护网指标体系 | 安全运营实践 | 防守成效度量 |

---

## 🧠 十、专家锦囊

> **钱运维说：** 护网收官最容易翻车。最后48小时建议：①最后两天增加轮换频次（减少单车次时间）②设置"收官警示"提醒全员 ③领导到一线督战提振士气 ④防御策略可以适当收紧（反正快结束了，宁可误拦不可放过）。

---

📅 **Day 26 完成！** 今天你学会了护网收官——识别隐蔽攻击、全域风险清零、统计数据说话。记住：不到最后一秒不放松！
