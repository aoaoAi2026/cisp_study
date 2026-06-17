# Day 21：攻防技战法提炼与体系化沉淀
## 把这次护网的教训，变成下次护网的武器

---

> 🎯 **今日目标**  
> 编写完整技战法文档 · 掌握ATT&CK映射方法 · 建立组织安全知识库

---

## 📖 一、技战法是什么？——安全人员的"菜谱"

### 👨‍🍳 一个好比喻

```
没有技战法的安全团队：
  "上次护网碰到过一个Webshell，当时怎么处置来着？"
  "我忘了，好像是张三处理的..."
  "他离职了..."
  → 每次攻击都是"从零开始"，经验无法传承

有技战法的安全团队：
  "有Webshell告警！查一下技战法库"
  🗂️ 检索：T1505.003 → Webshell检测与处置技战法
  📄 文档包含：攻击场景→检测规则→处置步骤→防护建议
  → 新人也能按文档一步步处理
```

**技战法 = 把"张三的经验"变成"团队的能力"**

---

## 📖 二、一份完整的技战法长什么样？

### 📋 技战法五大要素

```
1️⃣ 适用场景（Scenario）
   "这个技战法适用于什么情况？"
   
   例子：攻击者通过Web漏洞上传了Webshell，
        并在内网进行横向移动

2️⃣ 攻击手法（Attack TTPs）
   "攻击者是怎么做的？"
   
   例子：
   - 利用文件上传漏洞上传 .jsp Webshell
   - 通过Webshell执行 whoami / ipconfig 收集信息
   - 上传 mimikatz 窃取凭据
   - 使用 Pass-the-Hash 横向移动到域控
   |→ 对应 ATT&CK：T1505.003 → T1003.001 → T1550.002

3️⃣ 检测方法（Detection）
   "我们怎么发现他？"
   ⚠️ 这里必须给具体规则！不能只说思路！
   
   例子（具体规则）：
   ① SIEM规则：
      index=web_logs AND file_extension IN ("jsp","php","aspx")
      AND request_method="POST" AND file_path="/uploads/*"
   
   ② Suricata规则：
      alert http $HOME_NET any -> $EXTERNAL_NET any
      (msg:"Webshell C2通信"; content:"eval(base64_decode";)
   
   ③ Yara规则：
      rule Webshell_China_Chopper {
         strings: $a = "base64_decode" $b = "eval"
         condition: $a and $b
      }

4️⃣ 处置流程（Response）
   "发现了怎么处理？"
   
   例子：
   Step 1: 确认Webshell文件位置和类型
   Step 2: 立即隔离受影响主机（网络隔离）
   Step 3: 收集Webshell样本和访问日志
   Step 4: 分析攻击来源和上传途径
   Step 5: 清除Webshell和攻击者后门
   Step 6: 修复漏洞（文件上传白名单）
   Step 7: 加固Web应用（WAF规则更新）

5️⃣ 防护建议（Prevention）
   "怎么防止下次再发生？"
   
   例子：
   - 文件上传采用白名单+随机重命名
   - WAF启用文件上传扫描
   - Web目录设置不可执行权限
   - 定期扫描Web目录的新增脚本文件
```

---

## 📖 三、黄金指标（Golden Signal）——技战法的"杀手锏"

### 🥇 什么是Golden Signal？

```
普通检测指标：
  "发现异常进程" → 每天100条 → 90条是误报（运维在执行任务）
  
黄金指标：
  "蜜罐服务器被访问" → 每年3次 → 每次都确实是攻击者
  
区别：黄金指标 = 极高可靠性 + 极低误报率
    发现即认定有问题，几乎不需要研判！
```

### 📊 几个经典的Golden Signal

```
🥇 蜜罐被访问
   蜜罐不对外提供服务，任何访问都是恶意的
   → 100%是攻击

🥇 进程链异常
   winword.exe → cmd.exe → powershell.exe
   → 99%是恶意宏攻击

🥇 非管理员使用PsExec
   PsExec是运维工具，普通员工不应该用
   → 95%是横向移动

🥇 凌晨有大量DNS查询
   正常业务凌晨不会有大量DNS
   → 90%是C2通信或数据外传

🥇 新文件出现在启动目录
   C:\Users\xxx\AppData\Roaming\Microsoft\Windows\Start Menu\
   → 95%是持久化后门
```

---

## 📖 四、ATT&CK映射——用"通用语言"写技战法

### 🗣️ 为什么需要ATT&CK映射？

```
不映射：
  "我们公司碰到了一种攻击，就是那种...先发邮件，然后...嗯..."
  → 别人听不懂你在说什么

映射后：
  "攻击者先使用T1566.001（鱼叉钓鱼附件）获得初始访问，
   然后T1204.002（恶意宏）执行代码，
   最后T1505.003（Webshell）建立持久化"
  → 全世界安全人员都能秒懂！
```

### 🗂️ 常用ATT&CK技术速查表

| 阶段 | ATT&CK ID | 技术名称 | 中文描述 |
|------|-----------|----------|----------|
| 初始访问 | T1566 | Phishing | 钓鱼攻击 |
| 执行 | T1059 | Command/Scripting | 命令执行 |
| 持久化 | T1505.003 | Web Shell | Webshell |
| 提权 | T1003.001 | LSASS Memory | 凭据窃取 |
| 防御规避 | T1070 | Indicator Removal | 清除痕迹 |
| 凭据访问 | T1003 | OS Credential Dumping | 系统凭据导出 |
| 发现 | T1046 | Network Service Scanning | 网络扫描 |
| 横向移动 | T1021.002 | SMB/Windows Admin Shares | 内网横向 |
| 收集 | T1005 | Data from Local System | 本地数据收集 |
| C2 | T1071.001 | Web Protocols | HTTP/HTTPS C2 |
| 渗出 | T1041 | Exfiltration Over C2 | 通过C2外传数据 |

---

## 📖 五、知识库建设——从"我知道"到"团队知道"

### 📚 六大类成果归档

```
1️⃣ SOP（标准操作程序）
   - 护网值班SOP
   - 告警分级处置SOP
   - 交接班SOP

2️⃣ 技战法（战术技法）
   - Webshell检测技战法
   - 钓鱼邮件防御技战法
   - DNS隧道检测技战法

3️⃣ 检测规则（Detection Rules）
   - SIEM关联规则（Elasticsearch/KQL）
   - 网络检测规则（Suricata/Snort）
   - 主机检测规则（Yara/Sysmon）

4️⃣ 工具脚本（Scripts/Tools）
   - 告警自动分级脚本
   - IOC批量匹配脚本
   - 资产快速排查脚本

5️⃣ 应急预案（Playbooks）
   - Webshell应急响应剧本
   - 勒索软件应急响应剧本
   - 数据泄露应急响应剧本

6️⃣ 培训材料（Training）
   - 安全意识培训PPT
   - 新员工安全入职培训
   - 护网专项培训材料
```

### 🔍 归档三原则

```
1. 可检索
   给每份文档打标签：攻击类型、ATT&CK ID、技术领域、严重级别
   用统一命名规范：如 "[HW-2024]T1505.003_Webshell检测技战法_v1.0.md"

2. 可复用
   规则直接可用（不要只说思路，要写具体语法）
   脚本直接可跑（带注释、带示例）

3. 可传承
   新人入职 → 先看技战法库 → 快速上手
   老人离职 → 知识留在库中 → 不会失传
```

---

## 💻 六、动手试试：技战法知识库

```python
# 技战法知识库系统
class TacticKB:
    def __init__(self):
        self.entries = []
    
    def add_entry(self, name, scenario, attck_ids, golden_signal, 
                  detection_rules, response_steps, prevention):
        """添加一条技战法"""
        self.entries.append({
            'id': len(self.entries) + 1,
            'name': name,
            'scenario': scenario,
            'attck_ids': attck_ids if isinstance(attck_ids, list) else [attck_ids],
            'golden_signal': golden_signal,
            'detection_rules': detection_rules,
            'response_steps': response_steps,
            'prevention': prevention,
            'created': '2024-06-17'
        })
    
    def search_by_attck(self, attck_id):
        """按ATT&CK ID检索技战法"""
        results = [e for e in self.entries if attck_id in e['attck_ids']]
        if results:
            print(f'=== 🔍 搜索 ATT&CK: {attck_id} ({len(results)}条结果) ===\n')
            for e in results:
                print(f'📄 [{e["id"]}] {e["name"]}')
                print(f'   ATT&CK: {", ".join(e["attck_ids"])}')
                print(f'   黄金信号: {e["golden_signal"]}\n')
        else:
            print(f'未找到与 {attck_id} 相关的技战法')
        return results
    
    def search_by_keyword(self, keyword):
        """关键词搜索"""
        results = []
        for e in self.entries:
            text = str(e).lower()
            if keyword.lower() in text:
                results.append(e)
        print(f'=== 🔍 搜索: "{keyword}" ({len(results)}条结果) ===\n')
        for e in results:
            print(f'📄 [{e["id"]}] {e["name"]} | ATT&CK: {", ".join(e["attck_ids"])}')
        return results
    
    def list_golden_signals(self):
        """列出所有黄金指标"""
        print('=== 🥇 黄金指标库 ===\n')
        for e in self.entries:
            print(f'[{", ".join(e["attck_ids"])}] {e["name"]}:')
            print(f'  → {e["golden_signal"]}\n')
    
    def stats(self):
        """知识库统计"""
        from collections import Counter
        
        total = len(self.entries)
        all_attcks = []
        for e in self.entries:
            all_attcks.extend(e['attck_ids'])
        
        top_attcks = Counter(all_attcks).most_common(5)
        
        print(f'=== 📊 技战法知识库统计 ===')
        print(f'总计技战法: {total} 篇')
        print(f'覆盖ATT&CK技术: {len(set(all_attcks))} 种')
        print(f'\n覆盖最多的ATT&CK:')
        for attck, count in top_attcks:
            print(f'  {attck}: {count}篇')

# === 构建技战法知识库 ===
kb = TacticKB()

# 添加技战法1：Webshell检测
kb.add_entry(
    name='Webshell上传检测与处置',
    scenario='攻击者通过文件上传漏洞上传Webshell',
    attck_ids=['T1505.003', 'T1190'],
    golden_signal='Web目录下出现.jsp/.php/.aspx文件，且文件包含eval/base64等函数',
    detection_rules=[
        ('SIEM', 'index=web_logs file_extension IN ("jsp","php") | stats count by file_path'),
        ('Yara', 'rule Webshell { strings: $a="eval" $b="base64_decode" condition: $a and $b }'),
        ('HIDS', '监控 /var/www/ 下新增脚本文件的创建事件')
    ],
    response_steps=[
        '确认Webshell文件路径和内容',
        '隔离受影响Web服务器',
        '收集Webshell样本和访问日志',
        '分析入侵途径（日志溯源）',
        '清除Webshell和攻击者后门',
        '修复漏洞+WAF规则更新'
    ],
    prevention='文件上传白名单+随机重命名+Web目录不可执行权限+WAF文件扫描'
)

# 添加技战法2：DNS隧道检测
kb.add_entry(
    name='DNS隧道C2通信检测',
    scenario='APT攻击者使用DNS隧道进行隐蔽C2通信，绕过防火墙检测',
    attck_ids=['T1071.004', 'T1048'],
    golden_signal='单主机DNS查询频率>500次/小时 且 平均域名长度>52字符',
    detection_rules=[
        ('SIEM', 'index=dns_logs | stats count, avg(domain_length) by src_ip HAVING count>500'),
        ('Suricata', 'alert dns $HOME_NET any -> any 53 (msg:"DNS隧道"; dns_query; content:"."; '
                     'byte_test:1,>,52,0,relative;)')
    ],
    response_steps=[
        '确认异常DNS查询的源主机',
        '检查源主机的进程和网络连接',
        '提取C2域名并加入威胁情报',
        '隔离感染主机',
        '分析数据外传量'
    ],
    prevention='DNS安全检测部署+出站DNS流量监控+限制DNS服务器仅使用内部DNS'
)

# 添加技战法3：Pass-the-Hash检测
kb.add_entry(
    name='Pass-the-Hash横向移动检测',
    scenario='攻击者窃取NTLM哈希后，通过PtH技术在域内横向移动',
    attck_ids=['T1550.002', 'T1021'],
    golden_signal='发生NTLM认证（而非Kerberos）+同一源IP短时间内登录多台主机',
    detection_rules=[
        ('SIEM', 'index=windows_logs EventID=4624 AuthenticationPackage=NTLM '
                 '| stats count, dc(target_ip) by src_ip'),
        ('EDR', '监控 mimikatz.exe / psexec.exe / wmic.exe 的执行')
    ],
    response_steps=[
        '确认PtH攻击的源主机和目标主机',
        '立即隔离源主机',
        '检查目标主机是否被入侵',
        '重置受影响账户密码',
        '启用Protected Users组+LAPS'
    ],
    prevention='Protected Users组+LAPS+Credential Guard+禁用NTLM(尽量)'
)

# 演示检索功能
kb.search_by_keyword('Webshell')
print()
kb.list_golden_signals()
kb.stats()
```

---

## 🧪 七、今日实验：编写完整技战法

### 实验目标
选择3个护网常见场景，编写完整技战法并归档

### 实验步骤

```
1️⃣ 选择3个场景
   ☑ 场景1：钓鱼邮件+凭据窃取
   ☑ 场景2：内网横向移动
   ☑ 场景3：数据外传检测

2️⃣ 按五要素逐项编写
   ☑ 适用场景
   ☑ 攻击手法（标注ATT&CK ID）
   ☑ 检测方法（写具体规则语法！）
   ☑ 处置流程（分步骤）
   ☑ 防护建议

3️⃣ 提炼黄金指标
   ☑ 每个技战法至少找1个Golden Signal

4️⃣ 归档到知识库
   ☑ 统一命名
   ☑ 添加标签
   ☑ 建立检索索引
```

---

## 📝 八、今日测验

**Q1：一份完整技战法的核心要素包括哪些？**
- A. 工具清单
- B. 场景+攻击手法+检测方法+处置流程+防护建议  ✅
- C. 人员名单
- D. 预算清单

> 五大要素缺一不可：攻击怎么做、我怎么发现、我怎么处置、我怎么预防。

**Q2：技战法中检测规则应该如何描述？**
- A. 口头描述
- B. 给出具体语法（SIEM规则/Suricata规则/Yara规则）  ✅
- C. 不需要
- D. 只写思路

> 技战法的价值在于"可落地"，必须给出能直接使用的具体规则语法。

**Q3：ATT&CK映射在技战法中的作用是什么？**
- A. 没用
- B. 提供标准化的攻击技术分类，方便跨组织共享和理解  ✅
- C. 增加篇幅
- D. 装饰

> ATT&CK为技战法提供了"通用语言"，让不同组织的人能用统一术语交流。

**Q4：Goldic Signal（黄金指标）的核心特征是？**
- A. 所有告警
- B. 高度可靠、极低误报率，发现即可认定为攻击  ✅
- C. 很多告警
- D. 随机信号

> Golden Signal几乎不存在误报，触发即确认有问题。如"蜜罐被访问"。

**Q5：技战法体系化沉淀最大的意义是什么？**
- A. 个人收藏
- B. 将个人经验转化为组织能力，可传承可复用  ✅
- C. 应付检查
- D. 没意义

> 技战法沉淀让一次攻击的经验可以应用于以后无数次类似攻击。一人遇袭，全队免疫。

---

## 📚 九、课后资源

| 资源 | 链接 | 说明 |
|------|------|------|
| MITRE ATT&CK | attack.mitre.org | 攻击技术标准框架 |
| ATT&CK Navigator | mitre-attack.github.io/attack-navigator | 可视化映射工具 |
| 公开威胁情报 | otx.alienvault.com | 开源威胁情报 |

---

## 🧠 十、专家锦囊

> **赵安全说：** 技战法不是一次性工作。技战法库需要持续维护：①每次护网后更新新的攻击手法 ②定期Review检测规则有效性 ③组织团队学习最新技战法 ④用红蓝对抗验证技战法。技战法库的"活"比"大"更重要。

---

📅 **Day 21 完成！** 今天你学会了把攻防经验沉淀为技战法——让你的经验不随人员流动而流失！
