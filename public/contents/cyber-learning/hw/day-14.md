# Day 14：EDR终端安全实战
## 杀毒软件是保安，EDR是特工——最后的防线

---

> 🎯 **今日目标**  
> 理解EDR工作原理 · 掌握终端威胁检测 · 学习终端应急响应

---

## 📖 一、杀毒软件和EDR有什么区别？

用一个比喻就懂了：

```
传统杀毒软件 = 小区门口保安 👮
  只认识"通缉令"上的坏人（特征库里的已知病毒）
  不认识的就放进去
  能力强弱取决于"通缉令"更新速度

EDR = 小区里的便衣特工 🕵️
  不看长相，看行为
  有人撬门？抓！有人翻墙？抓！有人说谎？抓！
  不仅抓当前的坏人，还能复盘"他什么时候混进来的"
```

### 📊 直观对比

| 维度 | 传统杀毒 | EDR |
|------|----------|-----|
| 检测方式 | 特征库匹配 | 行为分析 |
| 能发现未知攻击吗？ | ❌ 基本不能 | ✅ 可以 |
| 能追溯攻击链吗？ | ❌ 不能 | ✅ 可以 |
| 能做终端隔离吗？ | ❌ 不能 | ✅ 一键隔离 |
| 适合护网用吗？ | 🔴 不够 | 🟢 必须 |

---

## 📖 二、EDR靠什么发现攻击？——"看行为不看脸"

### 👀 EDR监控的五大维度

```
1️⃣ 进程行为：
   ✅ 谁启动了谁？（进程调用链）
   ✅ 命令行参数是什么？
   ✅ 进程从哪来的？（文件路径）
   
   可疑示例：
   winword.exe → cmd.exe → powershell.exe -enc xxx
   ↑ Word启动命令行再启动PowerShell？很不正常！

2️⃣ 文件操作：
   ✅ 谁创建了文件？
   ✅ 文件放在哪？
   ✅ 文件类型对吗？
   
   可疑示例：
   C:\Windows\Temp\mimikatz.exe ← 著名黑客工具！

3️⃣ 网络连接：
   ✅ 谁连了外部IP？
   ✅ 连接的目标是什么？
   ✅ 流量模式对吗？
   
   可疑示例：
   notepad.exe连接了外网IP 45.33.32.156:443
   ↑ 记事本为什么要连外网？一定是木马！

4️⃣ 注册表操作：
   ✅ 谁修改了自启动项？
   ✅ 新注册了什么服务？
   
   可疑示例：
   HKCU\...\Run\ 里多了个随机名称的程序 → 持久化后门

5️⃣ 内存行为：
   ✅ 谁在注入其他进程？
   ✅ 谁在读取敏感内存区域（LSASS）？
   
   可疑示例：
   某进程访问了lsass.exe的内存 → 大概率在偷密码！
```

### 🎯 EDR最厉害的检测——异常进程链

```
正常进程链：
  explorer.exe → chrome.exe        ✅ 用户主动打开浏览器
  services.exe → svchost.exe       ✅ 系统服务启动
  cmd.exe → ping.exe               ✅ 管理员手动排查

异常进程链：
  winword.exe → cmd.exe            🚨 Word为什么启动命令行？
  excel.exe → powershell.exe       🚨 Excel为什么启动PowerShell？
  w3wp.exe → whoami.exe            🚨 IIS进程为什么执行whoami？
  java.exe → /bin/bash -c wget...  🚨 Java应用为什么下载文件？
```

> EDR就是通过这种"进程族谱"的分析，发现那些不应该发生的调用关系。

---

## 📖 三、EDR在护网中的实战应用

### ⚔️ 战前部署

```
1. 全终端覆盖（一台都不能少！）
   服务器 + 办公电脑 + 运维终端 + VPN设备 = 全部装EDR Agent

2. 策略配置
   ✅ 启用实时文件监控
   ✅ 启用进程行为分析
   ✅ 启用网络连接监控
   ✅ 配置高危行为告警
   ✅ 配置自动隔离策略（非核心系统）

3. 例外配置（白名单）
   ✅ 运维工具允许（但要限定执行者）
   ✅ 开发环境允许编译调试（但要限定目录）
   ✅ 杀毒软件/备份软件允许
```

### 🛡️ 战时应战

```
场景1：发现Webshell
  SIEM告警：Web服务器发现可疑PHP文件
  
  EDR行动：
  1. 自动扫描该Web服务器 → 确认进程异常
  2. 检查进程链：w3wp.exe → cmd.exe → powershell.exe？
  3. 确认入侵 → 一键隔离该服务器
  4. 保留内存和磁盘镜像供取证

场景2：内网横向移动
  EDR告警：财务部小王电脑连接了HR服务器
  
  EDR行动：
  1. 检查：小王的电脑上怎么有mimikatz.exe？
  2. 回溯：3小时前小王点了钓鱼邮件中的链接
  3. 进程链：OUTLOOK.EXE → Hacker.exe → mimikatz.exe
  4. 一键隔离小王电脑 + 扫描同网段所有电脑
```

---

## 📖 四、EDR的核心操作

### 🔒 一键隔离（主机隔离）

```
"隔离"意味着什么：
  ✅ 切断该主机所有网络连接（不能连出去，也不能被连进来）
  ✅ 只保留EDR管理通道（方便远程取证）
  ✅ 不关机（保留内存和磁盘证据）
  ✅ 不死进程（保留现场给分析师看）

这就像把嫌疑犯关在一个有监控的单间里
→ 他能被观察、能被审讯
→ 但不能再做坏事也不能和同伙联系
```

### 🔍 远程取证

```
EDR可以远程对被隔离的主机做：
  ✅ 查看进程列表（谁在运行？）
  ✅ 查看网络连接（连到哪里了？）
  ✅ 查看文件系统（多了什么文件？）
  ✅ 执行Shell命令（进一步排查）
  ✅ 下载可疑文件样本（给沙箱分析）
  ✅ 时间线重建（还原攻击过程）
```

---

## 📖 五、EDR部署的常见坑

```
❌ 坑1：只在服务器上装EDR
  → 攻击者通过办公电脑钓鱼进来，服务器EDR完全看不到

❌ 坑2：装了EDR但不开告警
  → 就像装了监控但没人看屏幕

❌ 坑3：策略太严格
  → 运维同事的正常操作也被拦 → 运维关掉EDR → 全完

❌ 坑4：告警积压不处理  
  → 3个月没看EDR告警 → 1000+条 → 可能攻击者已经住了半年

✅ 正确做法：
  1. 全终端覆盖（不落下一台）
  2. 策略从宽松开始，逐步收紧
  3. 告警必须当日清理
  4. 每月做一次威胁狩猎
  5. 季度策略Review和优化
```

---

## 💻 六、动手试试：EDR终端威胁检测模拟

```python
# EDR终端检测与响应模拟系统
class EDRSimulator:
    def __init__(self):
        self.alerts = []
        self.isolated_hosts = set()
        
        # 可疑进程链定义（父进程→子进程）
        self.suspicious_chains = [
            ('winword.exe', 'cmd.exe'),
            ('excel.exe', 'powershell.exe'),
            ('outlook.exe', 'wscript.exe'),
            ('w3wp.exe', 'cmd.exe'),
            ('java.exe', '/bin/bash'),
            ('chrome.exe', 'powershell.exe')
        ]
        
        # 高危工具特征
        self.dangerous_tools = [
            'mimikatz', 'psexec', 'procdump',
            'netcat', 'nc.exe', 'cobalt_strike'
        ]
        
        # 可疑注册表路径
        self.suspicious_registry = [
            'Run', 'RunOnce', 'Winlogon\\Shell',
            'Services\\'
        ]
    
    def monitor_process(self, host, process_name, parent_process, cmdline=''):
        """监控进程创建事件"""
        
        # 检查1：可疑进程调用链
        chain = (parent_process.lower(), process_name.lower())
        for suspicious in self.suspicious_chains:
            if chain == suspicious:
                self.alert(host, '🔴 异常进程链', 
                    f'{parent_process} ➜ {process_name}', '高')
                self.isolate(host)
                return
        
        # 检查2：高危黑客工具
        for tool in self.dangerous_tools:
            if tool in process_name.lower() or tool in cmdline.lower():
                self.alert(host, '🔴 检测到高危工具',
                    f'发现 {tool} 运行中', '紧急')
                self.isolate(host)
                return
        
        # 检查3：PowerShell编码命令（常见绕过手法）
        if 'powershell' in process_name.lower() and '-enc' in cmdline.lower():
            self.alert(host, '🟠 可疑PowerShell命令', 
                f'检测到Base64编码命令', '高')
    
    def monitor_network(self, host, process, dest_ip, dest_port):
        """监控网络连接"""
        
        # 规则：非浏览器进程连接外部IP
        browsers = ['chrome.exe', 'firefox.exe', 'msedge.exe', 'iexplore.exe']
        is_private_ip = dest_ip.startswith(('10.', '192.168.', '172.'))
        
        if process.lower() not in browsers and not is_private_ip:
            self.alert(host, '🟠 异常外联通信',
                f'{process} 连接外部 {dest_ip}:{dest_port}', '高')
    
    def alert(self, host, alert_type, description, severity):
        """记录告警"""
        self.alerts.append({
            'host': host,
            'type': alert_type,
            'desc': description,
            'severity': severity
        })
        print(f'[{severity}] {host}: {alert_type} — {description}')
    
    def isolate(self, host):
        """隔离主机"""
        if host not in self.isolated_hosts:
            self.isolated_hosts.add(host)
            print(f'  🔒 已自动隔离: {host}')
    
    def dashboard(self):
        """EDR态势面板"""
        print(f'\n=== 🛡️ EDR态势面板 ===')
        print(f'监控主机: 已隔离{len(self.isolated_hosts)}台')
        print(f'告警总数: {len(self.alerts)}')
        
        high_alerts = [a for a in self.alerts if a['severity'] in ('紧急', '高')]
        print(f'高危告警: {len(high_alerts)}')
        
        if high_alerts:
            print('\n🔴 高危事件:')
            for a in high_alerts:
                print(f'  [{a["host"]}] {a["desc"]}')

# === 模拟一次攻击检测 ===
print('=== 📡 EDR启动监控 ===\n')

edr = EDRSimulator()

# 模拟：钓鱼邮件 → Word宏 → 启动PowerShell下载木马
edr.monitor_process('PC-ZHANGSAN', 'winword.exe', 'explorer.exe', 
                    '/safe "c:\doc\简历.docm"')
edr.monitor_process('PC-ZHANGSAN', 'cmd.exe', 'winword.exe', 
                    'cmd /c powershell -enc SQBFAFgAKABOAGUAdwAtAE8AYgBqAGUAYwB0AC...')
edr.monitor_process('PC-ZHANGSAN', 'powershell.exe', 'cmd.exe', 
                    '-enc SQBFAFgAKABOAGUAdwAtAE8AYgBqAGUAYwB0AC...')

# 模拟：攻击者横向移动
edr.monitor_process('PC-ZHANGSAN', 'mimikatz.exe', 'explorer.exe', 
                    '"privilege::debug" "sekurlsa::logonpasswords"')

# 模拟：反弹Shell
edr.monitor_network('PC-ZHANGSAN', 'powershell.exe', '45.33.32.156', 4444)

edr.dashboard()
```

---

## 🧪 七、今日实验：部署开源EDR

### 实验目标
部署Wazuh（开源EDR）体验终端威胁检测

### 实验步骤

```
1️⃣ 部署Wazuh Server
   curl -sO https://packages.wazuh.com/4.x/wazuh-install.sh
   sudo bash wazuh-install.sh --generate-config-files

2️⃣ 安装Wazuh Agent（在测试终端上）
   下载Agent → 配置Server地址 → 启动Agent

3️⃣ 配置检测规则
   ☑ 可疑进程创建规则
   ☑ 异常网络连接规则
   ☑ 文件完整性监控规则

4️⃣ 使用Atomic Red Team模拟攻击
   Invoke-AtomicTest T1003.001  # 模拟凭据窃取(Lsass Dump)

5️⃣ 观察Wazuh告警
   ☑ 检查是否检测到凭据窃取行为
   ☑ 查看告警详情和时间线
```

---

## 📝 八、今日测验

**Q1：EDR与杀毒软件最核心的区别是什么？**
- A. 没区别
- B. EDR基于行为分析，杀毒基于特征库  ✅
- C. EDR更便宜
- D. 杀毒功能更多

> EDR通过持续行为监控发现未知威胁。传统杀毒只能识别已知恶意软件特征。

**Q2：以下哪项是确认感染后EDR最佳的操作？**
- A. 什么都不做
- B. 一键隔离受感染终端  ✅
- C. 卸载EDR
- D. 重启电脑

> 隔离切断攻击者的网络访问和横向移动能力，同时保留取证数据。

**Q3：以下哪个进程链最可疑？**
- A. explorer.exe → chrome.exe
- B. winword.exe → cmd.exe  ✅
- C. services.exe → svchost.exe
- D. explorer.exe → notepad.exe

> Word应该处理文档，不应启动命令行。这种异常进程链往往是宏病毒或漏洞利用。

**Q4：护网部署EDR需要覆盖哪些终端？**
- A. 只有服务器
- B. 所有服务器和办公终端  ✅
- C. 只有数据库
- D. 只有域控

> 攻击者可以从任意终端进入。只覆盖服务器等于敞开办公区大门。

**Q5：EDR的内存分析主要检测什么？**
- A. 内存使用量
- B. 内存注入和敏感进程访问（如读取lsass.exe）  ✅
- C. 内存大小
- D. 内存速度

> 读取lsass.exe内存是Mimikatz等凭据窃取工具的典型行为，EDR应重点监控。

---

## 📚 九、课后资源

| 资源 | 链接 | 说明 |
|------|------|------|
| MITRE ATT&CK EDR评估 | attackevals.mitre-engenuity.org | EDR产品测评 |
| Wazuh开源EDR | wazuh.com | 免费部署体验 |
| Sysmon配置 | github.com/SwiftOnSecurity/sysmon-config | 终端日志收集 |

---

## 🧠 十、专家锦囊

> **赵安全说：** EDR不是装完就完事了。需要持续运营：①定期Review告警（别让告警积压）②调优检测规则（减少噪声）③威胁狩猎（主动查找可疑行为）④升级检测能力（跟进新攻击技术）。装EDR就像买健身卡，买了不用等于白买。

---

📅 **Day 14 完成！** 今天你学会了EDR——终端安全的最后防线，看行为不看长相的便衣特工！
