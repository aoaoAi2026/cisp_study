# Day 10：内网渗透与横向移动
## 攻破了外围城墙之后——敌人在你肚子里到处乱窜

---

> 🎯 **今日目标**  
> 理解内网攻击手法 · 掌握横向移动技术 · 学习内网防护策略

---

## 📖 一、内网渗透是什么？——城堡被攻破之后

想象一座城堡：

```
🏰 城堡外墙 = 防火墙、WAF（第一道防线）
🏘️ 城堡内部 = 内网（各个房间、金库、武器库）
```

攻击者攻破外墙（拿到一个Webshell）进入城堡内部后，他不会满足于待在一个小房间。他会：

1. 🔍 **四处看看**（信息收集）：这城堡有哪些房间？金库在哪？
2. 🗝️ **偷钥匙**（凭据获取）：在哪能找到更多房间的钥匙？
3. 🚶 **到处溜达**（横向移动）：用偷来的钥匙去更多房间
4. 👑 **夺取王座**（拿下域控）：最终控制整个城堡

**这个过程就是"内网渗透"——护网中最危险的阶段！**

---

## 📖 二、第一步：信息收集——摸清你的家底

攻击者进入内网后，第一件事就是"踩点"：

### 🔍 攻击者会做什么？

```bash
# 1. 看看我在哪？（当前身份信息）
whoami                    # 我是谁？
ipconfig /all             # 我的IP是什么？DNS服务器在哪？→ 可能指向域控！

# 2. 周围有哪些邻居？（内网主机发现）
net view                  # Windows网络邻居
arp -a                    # 看看最近和谁说过话

# 3. 这是什么家庭？（域信息枚举）
net user /domain          # 域里有哪些用户？
net group "Domain Admins" /domain    # 谁是域管理员？👑
net group "Domain Computers" /domain # 有几台机器？

# 4. 高级侦查工具：BloodHound
# "用图告诉你：从你现在的位置，到域管理员，最短的攻击路径是什么"
```

### 🗺️ BloodHound——内网攻击的"谷歌地图"

BloodHound会生成一张图，告诉你：
```
你(普通用户) → 登录过ServerA(本地管理员) → ServerA上有域管理员登录会话 
→ 你可以偷域管理员的凭据 → 你就是域管理员了！
```

**对蓝队来说：BloodHound也是最好的防御工具！** 用它的视角看自己的内网，就知道攻击者会怎么走。

---

## 📖 三、第二步：凭据获取——偷钥匙

### 🗝️ Mimikatz——最著名的"钥匙小偷"

Windows会把用户的密码（或密码的哈希值）存在内存里，Mimikatz就是从内存里掏钥匙的工具。

```
攻击者运行 mimikatz：
  sekurlsa::logonpasswords
  → 哗啦啦，屏幕上满是密码和哈希值！

能偷到什么？
  ✅ 明文密码（如果系统配置不当）
  ✅ NTLM哈希（密码的"替代品"）
  ✅ Kerberos票据（域环境的"临时通行证"）
  ✅ 浏览器保存的密码
  ✅ RDP连接凭证
```

> 💡 你以为自己密码很复杂就安全了？攻击者根本不关心你的密码——他直接用你的**NTLM哈希**做身份验证！

---

## 📖 四、第三步：横向移动——到处溜达

### 🔑 Pass-the-Hash（哈希传递）

这是内网中最经典、最常用的横向移动技术：

```
正常登录：需要 "用户名 + 密码"
Hash传递：只需要 "用户名 + NTLM哈希值"

也就是说：攻击者不需要知道你的密码！
只要从内存里偷到NTLM哈希，就能以你的身份登录其他机器。
```

### 🚗 横向移动的"交通工具"

| 方法 | 做了什么 | 命令示例 |
|------|----------|----------|
| **WMI** | 远程执行命令 | `wmic /node:目标IP process call create "cmd.exe /c ..."` |
| **PsExec** | 远程启动程序 | `PsExec.exe \\目标IP -u 用户 -p 哈希 cmd` |
| **SMB共享** | 访问文件共享 | `\\目标IP\C$` |
| **RDP** | 远程桌面 | `mstsc /v:目标IP` |
| **WinRM** | 远程管理 | `Enter-PSSession 目标IP` |

### 🎯 攻击链示例

```
第1步：攻破Web服务器 → 拿到低权限Webshell
第2步：Web服务器上找到配置文件 → 数据库密码
第3步：用数据库账号尝试登录其他服务器 → 成功登上App服务器
第4步：App服务器上运行Mimikatz → 偷到域管理员哈希
第5步：Pass-the-Hash → 登录域控！
第6步：DCSync → 同步所有域用户的密码哈希 → 彻底控制整个域

从一台Web服务器到控制整个域，可能只需几个小时！
```

---

## 📖 五、域控攻击——终极目标

### 👑 DCSync——"假装我是另一个域控"

```
域环境里，多台域控之间会互相同步数据（包括用户密码哈希）。

DCSync攻击：攻击者伪装成"一台新的域控"
  → 对真实域控说："嗨兄弟，我刚加入域，把最新的用户数据同步给我"
  → 域控说："好的！" → 把所有用户密码哈希都发过去了
  → 攻击者拿到所有用户的凭据 → 游戏结束
```

### 🎫 Golden Ticket（黄金票据）

```
Kerberos认证中有一个超级票据——KRBTGT哈希。
拿到它 = 能伪造任意用户的身份，访问任何资源。

就像拿到了铸币厂的模板——你可以自己印钱了！
```

---

## 📖 六、内网防护——蓝队的反击

### 🛡️ 第一道内网防线：网络分段

```
❌ 糟糕设计：所有服务器在一个大平层
   攻击者进入一台 = 可以看到所有机器

✅ 好设计：按部门/安全等级分VLAN
   办公网 | 生产网 | 测试网 | 运维网（之间用防火墙隔离）
   攻击者在办公网 → 防火墙挡住 → 无法直接访问生产网
```

### 🛡️ 第二道内网防线：凭据保护

```
1. LAPS（本地管理员密码方案）
   每台电脑的本地管理员密码都不一样且定期更换
   → 攻击者拿到一台机器的密码，换一台就不能用

2. Protected Users 组
   把高权限用户加入此组
   → 禁止NTLM认证（让Pass-the-Hash失效！）
   → 禁止凭据缓存

3. Credential Guard（凭据卫士）
   Windows的虚拟化安全功能
   → Mimikatz也偷不到凭据！
```

### 🛡️ 第三道内网防线：横向移动检测

```
SIEM规则检测：
  ✅ 一个普通用户短时间内登录了5台以上不同机器
  ✅ 出现了NTLM认证（正常应该用Kerberos）
  ✅ WMI、PsExec等远程管理工具被非管理员使用
  ✅ 同一源IP尝试连接多个目标IP的445端口（SMB扫描）
```

---

## 💻 七、动手试试：横向移动检测器

```python
# 内网横向移动行为检测——蓝队视角
from collections import defaultdict

class LateralMovementDetector:
    def __init__(self):
        self.sessions = defaultdict(list)  # 记录登录行为
        self.alerts = []
    
    def record_login(self, src_ip, dst_ip, user, auth_type, time):
        """记录一次登录/认证事件"""
        self.sessions[src_ip].append({
            'user': user,
            'dst': dst_ip,
            'auth': auth_type,
            'time': time
        })
        # 每次记录后立即检查
        self._detect_anomalies(src_ip, dst_ip, user, auth_type)
    
    def _detect_anomalies(self, src, dst, user, auth_type):
        """检测可疑的横向移动行为"""
        
        # 规则1：NTLM认证 = Pass-the-Hash嫌疑
        if auth_type == 'NTLM':
            self.alerts.append(
                f'🔴 [PtH嫌疑] {src} ➜ {dst} | 用户:{user} | NTLM认证'
            )
        
        # 规则2：一个源IP短时间内登录多台机器
        targets = [s['dst'] for s in self.sessions[src]]
        unique_targets = set(targets)
        if len(unique_targets) > 5:
            self.alerts.append(
                f'🟠 [横向移动] {src} 已登录 {len(unique_targets)} 台主机'
            )
        
        # 规则3：高危远程管理工具使用
        unusual_tools = ['wmic', 'psexec', 'schtasks']
        # 正文中不检测具体工具，这里简化为检测登录目标数
    
    def report(self):
        """输出横向移动检测报告"""
        print('=== 🔍 内网横向移动检测报告 ===\n')
        if not self.alerts:
            print('✅ 未发现可疑横向移动行为')
            return
        
        seen = set()
        for alert in self.alerts:
            if alert not in seen:
                print(alert)
                seen.add(alert)
        
        print(f'\n📊 总计: {len(seen)} 条可疑告警')

# === 模拟一次内网入侵检测 ===
detector = LateralMovementDetector()

# 模拟：攻击者通过Pass-the-Hash横向移动
detector.record_login('10.0.0.99', 'DC01', 'admin', 'NTLM', '02:15')
detector.record_login('10.0.0.99', 'SRV-WEB01', 'admin', 'NTLM', '02:16')
detector.record_login('10.0.0.99', 'SRV-DB01', 'admin', 'NTLM', '02:17')

# 模拟：攻击者扫描登录多台机器
for i in range(8):
    detector.record_login('10.0.0.88', f'SERVER-{i:02d}', 'svc_backup', 
                          'Kerberos', f'03:{i:02d}')

detector.report()
```

---

## 🧪 八、今日实验：内网渗透攻防

### 实验目标
搭建AD域环境，体验内网攻击和防御

### 实验步骤

```
1️⃣ 搭建AD域环境
   - 1台域控(Windows Server)
   - 2台域成员服务器
   - 1台Win10客户机

2️⃣ 红队演练
   ☑ 从客户机获得初始权限
   ☑ 运行BloodHound收集域信息
   ☑ 分析到达域管的最短攻击路径
   ☑ 尝试Pass-the-Hash横向移动

3️⃣ 蓝队防御
   ☑ 启用Windows事件日志审计
   ☑ 部署Sysmon收集进程/网络日志
   ☑ 编写SIEM检测规则
   ☑ 配置LAPS + Protected Users组

4️⃣ 红蓝对抗验证
   ☑ 红队再次攻击 → 蓝队检测规则是否生效
```

---

## 📝 九、今日测验

**Q1：Mimikatz主要用来做什么？**
- A. 网络扫描
- B. 提取Windows内存中的凭据  ✅
- C. Web渗透
- D. 代码审计

> Mimikatz是凭据提取之王，能从LSASS内存中掏出密码、哈希、票据。

**Q2：Pass-the-Hash攻击的可怕之处是什么？**
- A. 需要知道密码
- B. 不需要明文密码，用NTLM哈希就能认证  ✅
- C. 很慢
- D. 容易被发现

> PtH绕过了"需要知道密码"这个前提，只要偷到哈希就能冒充你的身份。

**Q3：以下哪个是防止Pass-the-Hash的有效措施？**
- A. 关防火墙
- B. 使用Protected Users组+LAPS  ✅
- C. 加强密码复杂度
- D. 定期重启

> Protected Users组禁止NTLM认证（PtH直接失效），LAPS确保每台机器本地管理员密码唯一。

**Q4：BloodHound的核心价值是什么？**
- A. 杀毒
- B. 可视化分析域内攻击路径  ✅
- C. 防火墙
- D. 入侵检测

> BloodHound用"图"告诉你从A点到域管的最短攻击路径。蓝队也能用它自查弱点。

**Q5：DCSync攻击本质上是利用了什么？**
- A. Web漏洞
- B. 域控之间的数据同步机制  ✅
- C. 弱密码
- D. 网络延迟

> DCSync伪装成域控请求同步数据，域控"信任"了这个请求，就把密码哈希全发出去了。

---

## 📚 十、课后资源

| 资源 | 链接 | 说明 |
|------|------|------|
| BloodHound项目 | github.com/BloodHoundAD/BloodHound | AD攻击路径分析 |
| MITRE ATT&CK横向移动 | attack.mitre.org/tactics/TA0008 | 横向移动技术大全 |
| AD安全最佳实践 | docs.microsoft.com/AD-DS | 微软官方安全指南 |

---

## 🧠 十一、专家锦囊

> **赵安全说：** 护网中内网失守的典型路径：Web漏洞获取Webshell → 上传工具收集信息 → 找到域凭据（配置文件/内存）→ Pass-the-Hash横向移动 → 拿下域控。打破这个链条的关键是：Web层防护 + 凭据保护 + 横向移动检测。

> **钱运维说：** 横向移动检测需多维度结合：①网络流量（异常内网连接/端口扫描）②主机日志（异常进程创建/WMI调用）③认证日志（NTLM认证/异常登录源）。三个数据源交叉验证，能大幅提高检测准确率。

---

📅 **Day 10 完成！** 今天你了解了内网渗透的恐怖——从一台机器到控制整个域可能只需几小时。但你也学会了用网络分段+凭据保护+行为检测来防守！
