# Day 78 - 模拟考试一（全真模拟测试）

> **考试说明**：本套模拟试卷共100道单选题，涵盖CISP考试全部知识域，考试时间120分钟，满分100分，60分合格。请闭卷作答后对照答案自评。

---

## 📋 目录导航

| 题号范围 | 知识域 | 分值 |
|---------|--------|------|
| 1-10 | 信息安全基础 | 10分 |
| 11-20 | 国家秘密保护与法律法规 | 10分 |
| 21-30 | 访问控制与身份认证 | 10分 |
| 31-40 | 安全运维与应急响应 | 10分 |
| 41-50 | 漏洞与攻击技术 | 10分 |
| 51-60 | 密码学 | 10分 |
| 61-70 | 网络安全 | 10分 |
| 71-80 | 应用安全 | 10分 |
| 81-85 | 物理安全 | 5分 |
| 86-90 | 安全工程与风险管理 | 5分 |
| 91-100 | 业务安全与数据隐私 | 10分 |

---

## 第一部分：信息安全基础（第1-10题）

**1. 信息安全的三要素CIA分别指什么？**
- A. 保密性、完整性、可用性
- B. 认证性、完整性、可用性
- C. 机密性、完整性、认证性
- D. 保密性、可追溯性、可用性

<details>
<summary>点击查看答案</summary>

**正确答案：A**

CIA三要素：Confidentiality（机密性）、Integrity（完整性）、Availability（可用性）。这是信息安全最基本的概念，必须牢记。
</details>

**2. 以下哪项不属于信息安全的属性？**
- A. 机密性
- B. 完整性
- C. 不可否认性
- D. 可扩展性

<details>
<summary>点击查看答案</summary>

**正确答案：D**

信息安全的经典属性包括：机密性、完整性、可用性、认证性、不可否认性（可追溯性）。可扩展性属于系统设计属性，非安全属性。
</details>

**3. "纵深防御"（Defense in Depth）的核心思想是？**
- A. 在单一层面部署最强防护
- B. 多层安全控制协同防护
- C. 只依赖防火墙保护
- D. 将所有安全资源集中在外围

<details>
<summary>点击查看答案</summary>

**正确答案：B**

纵深防御源于军事策略，在信息安全中指通过多层、多维度的安全控制，使得攻击者突破一层防护后仍面临其他层的防御，从而提高系统的整体安全性。
</details>

**4. 信息安全中的"最小权限原则"是指？**
- A. 给用户分配尽可能少的权限
- B. 用户只能获得完成工作所必需的最小权限
- C. 管理员拥有所有权限
- D. 所有用户权限相同

<details>
<summary>点击查看答案</summary>

**正确答案：B**

最小权限原则（Least Privilege）要求每个主体（用户/进程）只能获得完成其任务所必需的最小权限集合，不多也不少。
</details>

**5. "深度防御"与"最小权限"的关系是？**
- A. 相互矛盾
- B. 前者强调层数，后者强调范围，两者互补
- C. 完全相同
- D. 互不相关

<details>
<summary>点击查看答案</summary>

**正确答案：B**

纵深防御关注安全控制的"层数"（垂直维度），最小权限关注权限的"范围"（水平维度）。两者结合形成矩阵式安全防护体系。
</details>

**6. 信息安全管理体系（ISMS）的国际标准是？**
- A. ISO 9001
- B. ISO/IEC 27001
- C. ISO 14001
- D. ISO 20000

<details>
<summary>点击查看答案</summary>

**正确答案：B**

ISO/IEC 27001是信息安全管理体系（ISMS）的国际标准，基于PDCA循环。ISO 9001是质量管理，14001是环境管理，20000是IT服务管理。
</details>

**7. PDCA循环中，"P"代表什么？**
- A. Protect
- B. Plan
- C. Process
- D. Practice

<details>
<summary>点击查看答案</summary>

**正确答案：B**

PDCA = Plan（策划）→ Do（实施）→ Check（检查）→ Act（改进），是ISMS的核心方法论。
</details>

**8. 信息安全策略的三个层次从高到低依次是？**
- A. 标准→策略→流程
- B. 策略→标准→流程
- C. 流程→标准→策略
- D. 策略→流程→标准

<details>
<summary>点击查看答案</summary>

**正确答案：B**

安全策略层次：策略（Policy，战略层，回答"做什么"）→ 标准（Standard，战术层，回答"做到什么程度"）→ 流程（Procedure，操作层，回答"怎么做"）。
</details>

**9. "安全是过程，不是产品"这句名言出自谁？**
- A. Whitfield Diffie
- B. Bruce Schneier
- C. Ron Rivest
- D. Kevin Mitnick

<details>
<summary>点击查看答案</summary>

**正确答案：B**

Bruce Schneier是著名安全专家，强调信息安全是一个持续的管理过程，不能依靠购买一两个产品就一劳永逸。
</details>

**10. 以下哪种属于主动攻击？**
- A. 窃听网络通信
- B. 流量分析
- C. 篡改数据包
- D. 辐射截获

<details>
<summary>点击查看答案</summary>

**正确答案：C**

主动攻击包括：篡改、伪造、重放、拒绝服务等。被动攻击包括：窃听、流量分析、电磁辐射截获等。篡改属于典型的主动攻击。
</details>

---

## 第二部分：国家秘密保护与法律法规（第11-20题）

**11. 《中华人民共和国网络安全法》正式施行日期是？**
- A. 2016年11月7日
- B. 2017年6月1日
- C. 2018年1月1日
- D. 2017年1月1日

<details>
<summary>点击查看答案</summary>

**正确答案：B**

《网络安全法》于2016年11月7日由全国人大常委会通过，2017年6月1日正式施行。
</details>

**12. 网络安全等级保护制度中，等保最低级别是？**
- A. 第一级
- B. 第二级
- C. 第三级
- D. 第五级

<details>
<summary>点击查看答案</summary>

**正确答案：A**

等级保护分为五个级别：
- 第一级：自主保护（最低）
- 第二级：指导保护
- 第三级：监督保护（最常见的企业级别）
- 第四级：强制保护
- 第五级：专控保护（最高，涉及国家安全）
</details>

**13. 《个人信息保护法》中规定的个人信息处理基本原则不包括？**
- A. 合法、正当、必要
- B. 公开透明
- C. 最小必要
- D. 利益最大化

<details>
<summary>点击查看答案</summary>

**正确答案：D**

《个保法》强调的处理原则包括：合法正当必要、诚信、目的明确、最小必要、公开透明、质量保证、责任与安全等。利益最大化不是法律原则。
</details>

**14. CII（关键信息基础设施）的保护由哪个部门统筹协调？**
- A. 工业和信息化部
- B. 国家网信部门
- C. 公安部
- D. 国家安全部

<details>
<summary>点击查看答案</summary>

**正确答案：B**

根据《网络安全法》和《关键信息基础设施安全保护条例》，国家网信部门负责统筹协调CII安全保护工作。
</details>

**15. 《数据安全法》规定，国家建立数据分类分级保护制度，核心是？**
- A. 统一管理所有数据
- B. 按数据重要程度采取不同保护措施
- C. 对所有数据采用最严格保护
- D. 只保护国家秘密数据

<details>
<summary>点击查看答案</summary>

**正确答案：B**

数据分类分级制度要求根据数据在经济社会发展中的重要程度，以及一旦遭到篡改、破坏、泄露或非法利用造成的危害程度，对数据实行分类分级保护。
</details>

**16. 等保2.0（GB/T 22239-2019）相比等保1.0，新增了哪方面的要求？**
- A. 物理安全
- B. 可信计算
- C. 网络安全
- D. 主机安全

<details>
<summary>点击查看答案</summary>

**正确答案：B**

等保2.0在传统安全要求基础上，新增了可信计算、云计算安全、移动互联安全、物联网安全、工业控制系统安全等方面的要求。
</details>

**17. 《网络安全审查办法》规定，关键信息基础设施运营者采购网络产品和服务，影响或可能影响国家安全的，应当进行？**
- A. 内部评审
- B. 网络安全审查
- C. 市场调研
- D. 财务审计

<details>
<summary>点击查看答案</summary>

**正确答案：B**

《网络安全审查办法》明确要求CII运营者在采购可能影响国家安全的网络产品和服务时，必须向网络安全审查办公室申报审查。
</details>

**18. 以下哪种行为属于《刑法》第285条规定的"非法侵入计算机信息系统罪"？**
- A. 未经授权访问公司内部OA系统
- B. 违反国家规定侵入国家事务、国防建设、尖端科技领域的计算机信息系统
- C. 在论坛上发帖谩骂
- D. 使用公司电脑玩游戏

<details>
<summary>点击查看答案</summary>

**正确答案：B**

《刑法》第285条专门针对侵入国家事务、国防建设、尖端科学技术领域计算机信息系统的行为，属于行为犯，一经侵入即构成犯罪。
</details>

**19. 个人信息处理者处理敏感个人信息应当取得个人的？**
- A. 默示同意
- B. 单独同意
- C. 推定同意
- D. 事后同意

<details>
<summary>点击查看答案</summary>

**正确答案：B**

《个保法》规定，处理敏感个人信息（如生物识别、医疗健康、金融账户、行踪轨迹等）应当取得个人的单独同意，不能与其他信息混在一起获取同意。
</details>

**20. 数据出境安全评估中，以下哪种情况不需要申报安全评估？**
- A. 数据处理者向境外提供重要数据
- B. 关键信息基础设施运营者向境外提供个人信息
- C. 处理100万人以上个人信息的数据处理者向境外提供个人信息
- D. 向境外提供已脱敏且无法复原的统计数据

<details>
<summary>点击查看答案</summary>

**正确答案：D**

已脱敏且无法复原的匿名化数据，不再属于个人信息或重要数据的范畴，不需要申报数据出境安全评估。
</details>

---

## 第三部分：访问控制与身份认证（第21-30题）

**21. 以下哪种访问控制模型最适合需要严格保密等级划分的军事机构？**
- A. DAC（自主访问控制）
- B. MAC（强制访问控制）
- C. RBAC（基于角色的访问控制）
- D. ABAC（基于属性的访问控制）

<details>
<summary>点击查看答案</summary>

**正确答案：B**

MAC基于安全标签进行访问控制，不允许用户自行改变权限，适用于军事和政府机构等对保密等级要求极高的场景。BLP模型是MAC的典型实现。
</details>

**22. BLP模型的两个核心属性是？**
- A. 最小权限和职责分离
- B. 不上读和不下写
- C. 上读和下写
- D. 读保护和写保护

<details>
<summary>点击查看答案</summary>

**正确答案：B**

BLP模型的"不上读、不下写"：
- 不上读（No Read Up）：低密级主体不能读取高密级客体（保证机密性）
- 不下写（No Write Down）：高密级主体不能向低密级客体写入（防止信息向下泄露）
</details>

**23. RBAC模型中，权限与什么直接关联？**
- A. 用户
- B. 角色
- C. 组
- D. 部门

<details>
<summary>点击查看答案</summary>

**正确答案：B**

RBAC的核心思想：权限不直接授予用户，而是授予角色；用户通过被分配角色来获得权限。这简化了权限管理，尤其适用于大型组织。
</details>

**24. SSO（单点登录）的核心优势是什么？**
- A. 增加安全性
- B. 用户只需一次认证即可访问多个系统
- C. 减少服务器数量
- D. 加密通信

<details>
<summary>点击查看答案</summary>

**正确答案：B**

SSO允许用户在一个系统中登录后，无需再次输入凭证即可访问其他关联系统。优势是用户体验好，但也增加了单点故障风险。
</details>

**25. 以下哪种认证方式属于"你是谁"的因素？**
- A. 密码
- B. 指纹
- C. 智能卡
- D. 短信验证码

<details>
<summary>点击查看答案</summary>

**正确答案：B**

多因素认证的三类因素：
- 你知道什么（Knowledge）：密码、PIN等
- 你有什么（Possession）：智能卡、Token、手机等
- 你是谁（Inherence）：指纹、虹膜、人脸等生物特征
</details>

**26. Kerberos认证协议中，AS代表什么？**
- A. Application Server
- B. Authentication Server
- C. Access Service
- D. Audit System

<details>
<summary>点击查看答案</summary>

**正确答案：B**

Kerberos协议包含三个主要组件：
- AS（Authentication Server）：认证服务器，验证用户身份
- TGS（Ticket Granting Server）：票据授予服务器，颁发服务票据
- SS（Service Server）：应用服务器
</details>

**27. OAuth 2.0定义了四种授权模式，对于纯Web前端应用（SPA），推荐使用哪种？**
- A. 授权码模式 + PKCE
- B. 密码模式
- C. 客户端凭证模式
- D. 隐式模式

<details>
<summary>点击查看答案</summary>

**正确答案：A**

对于SPA等公开客户端，OAuth 2.0最佳实践推荐使用授权码模式 + PKCE（Proof Key for Code Exchange），以替代不安全的隐式模式。
</details>

**28. 以下哪项属于双因素认证（2FA）的正确组合？**
- A. 密码 + PIN
- B. 密码 + 指纹
- C. 指纹 + 面部
- D. 智能卡 + 手机

<details>
<summary>点击查看答案</summary>

**正确答案：B**

双因素认证要求使用两种不同类别的因素。密码（知识因素）+ 指纹（生物因素）是正确的组合。密码+PIN属于同一类（知识），指纹+面部也属于同一类（生物）。
</details>

**29. 访问控制中的"职责分离"（SoD）主要用于防范？**
- A. 外部攻击
- B. 内部欺诈
- C. DDoS攻击
- D. 零日漏洞

<details>
<summary>点击查看答案</summary>

**正确答案：B**

职责分离确保没有任何一个人能独立完成一项关键或敏感操作的全过程（如付款的申请和审批由不同人执行），是防范内部欺诈的重要控制手段。
</details>

**30. 零信任架构的核心原则是？**
- A. 信任但验证
- B. 永不信任，始终验证
- C. 内网无条件信任
- D. 边界防护为主

<details>
<summary>点击查看答案</summary>

**正确答案：B**

零信任（Zero Trust）核心：Never Trust, Always Verify。不信任任何来源（即使是内网），每次访问都必须进行身份验证和授权。
</details>

---

## 第四部分：安全运维与应急响应（第31-40题）

**31. 应急响应流程（PICERL）中，"I"代表什么？**
- A. Information
- B. Identification
- C. Inspection
- D. Instruction

<details>
<summary>点击查看答案</summary>

**正确答案：B**

PICERL六步应急响应流程：
- P：Preparation（准备）
- I：Identification（检测与识别）
- C：Containment（遏制）
- E：Eradication（根除）
- R：Recovery（恢复）
- L：Lessons Learned（总结经验教训）
</details>

**32. 安全事件分级中，最高级别通常定义为？**
- A. 一般事件
- B. 较大事件
- C. 重大事件
- D. 特别重大事件

<details>
<summary>点击查看答案</summary>

**正确答案：D**

安全事件通常分为四级：一般（IV级）、较大（III级）、重大（II级）、特别重大（I级）。
</details>

**33. SIEM系统的三个核心功能是？**
- A. 加密、解密、签名
- B. 日志收集、关联分析、告警
- C. 备份、恢复、归档
- D. 扫描、修复、验证

<details>
<summary>点击查看答案</summary>

**正确答案：B**

SIEM（安全信息与事件管理）的主要功能：
1. 日志收集与聚合（Log Collection）
2. 关联分析（Correlation Analysis）
3. 实时告警与报告（Alerting & Reporting）
</details>

**34. RTO和RPO分别衡量的是什么？**
- A. 安全性和可靠性
- B. 恢复时间目标和恢复点目标
- C. 风险和成本
- D. 响应速度和准确率

<details>
<summary>点击查看答案</summary>

**正确答案：B**

- RTO（Recovery Time Objective）：恢复时间目标，业务中断后最多允许中断多长时间
- RPO（Recovery Point Objective）：恢复点目标，最多允许丢失多长时间的数据

RTO管"能停多久"，RPO管"能丢多少"。
</details>

**35. 以下关于日志管理的描述，哪项是正确的？**
- A. 日志只用于事后审计
- B. 日志需要保证完整性和防篡改
- C. 日志存储不需要考虑容量规划
- D. 日志可以随意删除

<details>
<summary>点击查看答案</summary>

**正确答案：B**

日志是安全事件调查的重要证据，必须保证完整性（不可被篡改）和不可否认性。日志管理需要：完整性保护、加密传输、容量规划、定期审计、保留期管理。
</details>

**36. 灾备中心的三个级别从低到高是？**
- A. 热站 → 温站 → 冷站
- B. 冷站 → 温站 → 热站
- C. 热站 → 冷站 → 温站
- D. 温站 → 冷站 → 热站

<details>
<summary>点击查看答案</summary>

**正确答案：B**

- 冷站（Cold Site）：只有物理空间和基础设施，需要自己带设备
- 温站（Warm Site）：有部分设备和数据，需要一定时间准备
- 热站（Hot Site）：完全冗余的运行环境，可以快速切换

恢复时间：冷站 > 温站 > 热站（冷站最慢，热站最快）
成本：冷站 < 温站 < 热站
</details>

**37. 安全运维中，"变更管理"的关键环节包括？**
- A. 随意变更
- B. 申请→评估→审批→实施→验证
- C. 直接在生产环境修改
- D. 不需要记录

<details>
<summary>点击查看答案</summary>

**正确答案：B**

规范的变更管理流程：变更申请 → 变更评估（风险评估+影响分析）→ 变更审批 → 变更实施（需要回滚方案）→ 变更验证 → 文档更新。多数安全事故源于未受控的变更。
</details>

**38. NIST SP 800-61中定义的应急响应生命周期有多少个阶段？**
- A. 3
- B. 4
- C. 5
- D. 6

<details>
<summary>点击查看答案</summary>

**正确答案：B**

NIST SP 800-61定义了4阶段应急响应：
1. Preparation（准备）
2. Detection and Analysis（检测与分析）
3. Containment, Eradication, and Recovery（遏制、根除和恢复）
4. Post-Incident Activity（事后活动）

与PICERL 6步的对应：PICERL更细化，将遏制、根除、恢复拆分为独立步骤。
</details>

**39. BCP（业务连续性计划）与DRP（灾备恢复计划）的区别是？**
- A. 完全相同
- B. BCP关注业务运营持续，DRP关注IT系统恢复
- C. BCP只涉及IT，DRP涉及全业务
- D. BCP是DRP的一部分

<details>
<summary>点击查看答案</summary>

**正确答案：B**

- BCP（Business Continuity Plan）：业务连续性计划，关注灾难发生时如何保障关键业务持续运营，涵盖IT、人员、设施、供应链等
- DRP（Disaster Recovery Plan）：灾备恢复计划，更侧重IT基础设施和系统的恢复，是BCP的IT子集
</details>

**40. 事件响应中，"遏制"（Containment）阶段的首要目标是？**
- A. 找到攻击源并反击
- B. 阻止损害进一步扩大
- C. 立即恢复系统
- D. 通知媒体

<details>
<summary>点击查看答案</summary>

**正确答案：B**

遏制的首要目标是"止损"，防止事件影响范围继续扩大。常见措施：断开网络连接、禁用受影响账户、隔离受感染系统、暂停相关服务等。
</details>

---

## 第五部分：漏洞与攻击技术（第41-50题）

**41. CVSS 3.1的评分范围是多少？**
- A. 0.0 - 5.0
- B. 0.0 - 10.0
- C. 1.0 - 10.0
- D. 0.0 - 100.0

<details>
<summary>点击查看答案</summary>

**正确答案：B**

CVSS评分范围 0.0-10.0，分为：
- 0.0：无风险
- 0.1-3.9：低危
- 4.0-6.9：中危
- 7.0-8.9：高危
- 9.0-10.0：严重（Critical）
</details>

**42. CVE是以下哪个的缩写？**
- A. Common Vulnerability Enumeration
- B. Common Vulnerabilities and Exposures
- C. Critical Vulnerability Exploit
- D. Common Virus Engine

<details>
<summary>点击查看答案</summary>

**正确答案：B**

CVE（Common Vulnerabilities and Exposures）是由MITRE维护的公共漏洞和暴露字典，为每个已知漏洞分配唯一编号，如CVE-2024-XXXX。
</details>

**43. SQL注入中，"1' OR '1'='1"属于哪种类型的注入？**
- A. 布尔盲注
- B. 时间盲注
- C. 联合查询注入
- D. 始终为真的条件注入

<details>
<summary>点击查看答案</summary>

**正确答案：D**

`1' OR '1'='1` 构造了一个永真条件，使WHERE子句始终为真，常用来绕过登录认证或返回所有数据。这是最基础的SQL注入类型。
</details>

**44. XSS攻击的三种主要类型是？**
- A. 反射型、存储型、DOM型
- B. 文件型、内存型、网络型
- C. 输入型、输出型、混合型
- D. 客户端型、服务端型、数据库型

<details>
<summary>点击查看答案</summary>

**正确答案：A**

三种XSS：
- 反射型（Reflected）：恶意脚本在URL参数中，服务端反射回页面
- 存储型（Stored）：恶意脚本存储在数据库/文件中，所有访问者受影响
- DOM型（DOM-based）：纯客户端，通过修改DOM触发，不经过服务端
</details>

**45. CSRF攻击利用的是什么？**
- A. 服务器漏洞
- B. 用户已登录的身份凭证
- C. 网络漏洞
- D. 数据库漏洞

<details>
<summary>点击查看答案</summary>

**正确答案：B**

CSRF（跨站请求伪造）利用用户已经在目标网站登录的身份状态（Cookie自动携带），诱导用户点击攻击者页面时，"借用"用户身份发起恶意请求。
</details>

**46. Stuxnet攻击的目标是什么？**
- A. 银行系统
- B. 伊朗核设施的离心机
- C. 社交网络
- D. 电商平台

<details>
<summary>点击查看答案</summary>

**正确答案：B**

Stuxnet（震网病毒）是世界上首个被发现的针对工业控制系统的恶意软件，2010年发现，目标直指伊朗纳坦兹核设施的西门子PLC控制器，使离心机异常运转并损坏。
</details>

**47. APT攻击的典型特征不包括？**
- A. 长期持续性潜伏
- B. 高度定向
- C. 快速大规模传播
- D. 资源丰富的攻击组织

<details>
<summary>点击查看答案</summary>

**正确答案：C**

APT（高级持续性威胁）特征：
- A（Advanced）：高级的技术和工具
- P（Persistent）：长期持续渗透和潜伏
- T（Threat）：有组织的威胁
快速大规模传播是蠕虫/病毒的特征，非APT特征。APT讲究"慢、准、隐"。
</details>

**48. 端口扫描中，SYN扫描（半开扫描）的优点是什么？**
- A. 不会被检测到
- B. 速度快且不易被记录
- C. 可以穿透防火墙
- D. 不需要root权限

<details>
<summary>点击查看答案</summary>

**正确答案：B**

SYN扫描只发送SYN包，如果收到SYN-ACK则端口开放，但不完成三次握手（不发ACK），因此不会在应用层日志中留下完整连接记录，相对隐蔽。Nmap默认使用SYN扫描。
</details>

**49. DDoS攻击中，反射放大攻击利用什么协议最为典型？**
- A. TCP
- B. HTTP
- C. DNS/NTP
- D. ICMP

<details>
<summary>点击查看答案</summary>

**正确答案：C**

DNS和NTP是典型的反射放大攻击协议：
- DNS请求约60字节，响应可达4000+字节，放大系数约60x
- NTP的monlist命令放大系数可达500x+
攻击者伪造受害者IP发送小请求，服务器返回大响应给受害者。
</details>

**50. OWASP Top 10（2021版）排名第一的风险是？**
- A. SQL注入
- B. 失效的访问控制
- C. 加密失败
- D. 跨站脚本

<details>
<summary>点击查看答案</summary>

**正确答案：B**

OWASP Top 10 2021版：
1. A01:2021 - 失效的访问控制（Broken Access Control）
2. A02:2021 - 加密失败（Cryptographic Failures）
3. A03:2021 - 注入（Injection，含SQL注入）
4. A04:2021 - 不安全设计

失效的访问控制从2017版第五名跃升至2021版第一名。
</details>

---

## 第六部分：密码学（第51-60题）

**51. AES的分组长度是多少？**
- A. 64位
- B. 128位
- C. 256位
- D. 可变

<details>
<summary>点击查看答案</summary>

**正确答案：B**

AES是固定128位（16字节）分组长度的加密算法，支持128/192/256位三种密钥长度。AES加密轮数分别为10/12/14轮。
</details>

**52. 非对称加密算法的典型应用场景不包括？**
- A. 数字签名
- B. 密钥交换
- C. 大数据量文件加密
- D. 身份认证

<details>
<summary>点击查看答案</summary>

**正确答案：C**

非对称加密（如RSA）计算开销大，不适合加密大量数据。实际应用中使用混合加密：非对称加密交换对称密钥，对称加密（AES等）加密数据。
</details>

**53. RSA算法的安全性基于什么数学难题？**
- A. 离散对数问题
- B. 大整数因子分解
- C. 椭圆曲线离散对数
- D. 背包问题

<details>
<summary>点击查看答案</summary>

**正确答案：B**

- RSA：基于大整数因子分解的困难性
- DH/DSA/ElGamal：基于离散对数问题
- ECC/ECDSA/ECDH：基于椭圆曲线离散对数问题
</details>

**54. 数字签名的功能不包括？**
- A. 数据完整性验证
- B. 身份认证
- C. 不可否认性
- D. 数据机密性

<details>
<summary>点击查看答案</summary>

**正确答案：D**

数字签名的功能：
- ✅ 完整性：数据未被篡改
- ✅ 认证：确定签名者身份
- ✅ 不可否认性：签名者不能抵赖
- ❌ 机密性：签名不能加密数据（加密是另一项功能）
</details>

**55. SHA-256的输出长度是多少位？**
- A. 128
- B. 160
- C. 256
- D. 512

<details>
<summary>点击查看答案</summary>

**正确答案：C**

SHA-2系列输出长度：
- SHA-224：224位
- SHA-256：256位
- SHA-384：384位
- SHA-512：512位
SHA-1输出160位（已不推荐使用），MD5输出128位（已破解）。
</details>

**56. 以下哪种加密模式不需要初始化向量（IV）？**
- A. CBC
- B. CTR
- C. ECB
- D. GCM

<details>
<summary>点击查看答案</summary>

**正确答案：C**

ECB（电子密码本模式）直接将明文分组独立加密，不需要IV。但由于相同明文块产生相同密文块，安全性最差，不推荐使用。CBC、CTR、GCM都需要IV/Nonce。
</details>

**57. PKI体系的核心组件中，负责签发数字证书的机构是？**
- A. RA（注册机构）
- B. CA（证书颁发机构）
- C. VA（验证机构）
- D. CRL服务器

<details>
<summary>点击查看答案</summary>

**正确答案：B**

- CA（Certificate Authority）：证书颁发机构，签发和管理证书
- RA（Registration Authority）：注册机构，验证申请人身份
- CRL（Certificate Revocation List）：证书吊销列表
- OCSP（Online Certificate Status Protocol）：在线证书状态查询
</details>

**58. Diffie-Hellman密钥交换解决了什么问题？**
- A. 如何安全地在不安全信道传输数据
- B. 如何在不安全信道安全协商共享密钥
- C. 如何加密文件
- D. 如何验证身份

<details>
<summary>点击查看答案</summary>

**正确答案：B**

DH密钥交换允许通信双方在不安全的信道上，协商出一个只有双方知道的共享秘密密钥。DH本身不提供身份认证（容易遭受中间人攻击），需要结合数字证书使用。
</details>

**59. 量子计算对以下哪种密码体制威胁最大？**
- A. 对称密码
- B. 基于大整数分解和离散对数的公钥密码
- C. 哈希函数
- D. 一次一密

<details>
<summary>点击查看答案</summary>

**正确答案：B**

Shor算法可以在量子计算机上高效解决大整数分解和离散对数问题，直接威胁RSA、DSA、ECDSA等主流公钥密码。而Grover算法对对称密码和哈希的影响相对可控（搜索复杂度减半，密钥加倍即可）。
</details>

**60. 一次一密（OTP）被认为是完美安全的，其条件包括？**
- A. 密钥任意产生
- B. 密钥真随机、至少与明文等长、只用一次
- C. 密钥由系统自动生成
- D. 密钥短于明文

<details>
<summary>点击查看答案</summary>

**正确答案：B**

一次一密实现完美安全的三个必要条件：
1. 密钥必须是真随机的（不能是伪随机）
2. 密钥长度 ≥ 明文长度
3. 密钥不能以任何形式重用

任何一条不满足，安全性即降级。
</details>

---

## 第七部分：网络安全（第61-70题）

**61. OSI模型中，哪一层负责端到端的可靠数据传输？**
- A. 网络层
- B. 传输层
- C. 会话层
- D. 应用层

<details>
<summary>点击查看答案</summary>

**正确答案：B**

传输层（TCP/UDP）负责端到端的可靠/不可靠数据传输。网络层（IP）负责路由寻址（主机到主机）。
</details>

**62. ARP欺骗攻击的原理是？**
- A. 修改DNS记录
- B. 伪造ARP响应，将IP映射到攻击者MAC地址
- C. 修改路由表
- D. 发送大量数据包

<details>
<summary>点击查看答案</summary>

**正确答案：B**

ARP欺骗（ARP Spoofing）：攻击者向局域网发送伪造的ARP响应，声称某个IP地址（如图中网关）对应的MAC地址是攻击者的MAC。此后发往目标IP的流量都会被送到攻击者机器，实现中间人攻击。
</details>

**63. 防火墙的三种典型类型按出现时间排序是？**
- A. 包过滤→状态检测→应用代理
- B. 包过滤→应用代理→状态检测
- C. 状态检测→包过滤→应用代理
- D. 应用代理→包过滤→状态检测

<details>
<summary>点击查看答案</summary>

**正确答案：B**

防火墙演进：
- 第一代：包过滤防火墙（检查IP头/端口）
- 第二代：应用代理/电路级网关
- 第三代：状态检测防火墙（跟踪连接状态）
- 第四代：深度包检测（DPI/应用层识别）
- 下一代防火墙（NGFW）：集成IPS、应用识别、威胁情报
</details>

**64. IPsec中，AH协议和ESP协议的主要区别是？**
- A. AH加密，ESP认证
- B. AH提供完整性+认证，ESP提供加密+可选认证
- C. 功能完全相同
- D. AH用于IPv6，ESP用于IPv4

<details>
<summary>点击查看答案</summary>

**正确答案：B**

- AH（Authentication Header）：只提供完整性校验和来源认证，不加密
- ESP（Encapsulating Security Payload）：提供加密，可选认证（推荐使用）
现代部署中ESP更常用，AH基本被淘汰。
</details>

**65. WPA3相比WPA2的最大安全改进是？**
- A. 使用更长的密码
- B. SAE（等距同时认证）替代PSK四次握手
- C. 支持更多设备
- D. 更快的速度

<details>
<summary>点击查看答案</summary>

**正确答案：B**

WPA3引入SAE（Simultaneous Authentication of Equals，又称Dragonfly），替代WPA2中脆弱的四次握手，能够抵抗离线字典攻击，即使使用弱密码也不会被暴力破解。
</details>

**66. VLAN在安全方面的主要作用是？**
- A. 加快网络速度
- B. 逻辑隔离广播域，控制东西向流量
- C. 加密网络通信
- D. 替代防火墙

<details>
<summary>点击查看答案</summary>

**正确答案：B**

VLAN（虚拟局域网）将物理网络划分为多个逻辑子网，实现广播域隔离。在安全方面，VLAN可以控制东西向流量（同一数据中心内不同系统间的流量），结合ACL实现微隔离。
</details>

**67. DNS劫持的常见形式不包括？**
- A. 修改本地hosts文件
- B. 篡改DNS服务器记录
- C. 中间人伪造DNS响应
- D. 使用HTTPS加密DNS

<details>
<summary>点击查看答案</summary>

**正确答案：D**

DNS劫持的常见形式：
- 本地Hosts篡改
- DNS缓存投毒
- DNS服务器入侵篡改记录
- 中间人伪造DNS响应
- 路由器DNS设置篡改

HTTPS加密DNS（DoH/DoT）恰恰是防范DNS劫持的措施。
</details>

**68. NGFW（下一代防火墙）与传统防火墙的不同在于？**
- A. 速度更慢
- B. 集成应用识别、IPS、威胁情报
- C. 只能做包过滤
- D. 不需要规则配置

<details>
<summary>点击查看答案</summary>

**正确答案：B**

NGFW在传统防火墙基础上集成：
- 应用识别与控制（精细到应用级别）
- 入侵防御系统（IPS）
- 威胁情报联动
- 用户身份感知
- SSL/TLS解密检查
</details>

**69. BGP劫持属于哪一层的攻击？**
- A. 物理层
- B. 网络层/应用层路由协议
- C. 会话层
- D. 传输层

<details>
<summary>点击查看答案</summary>

**正确答案：B**

BGP（边界网关协议）是互联网的核心路由协议。BGP劫持指通过伪造BGP通告，将本不属于自己的IP前缀路由引向攻击者网络，可能导致大规模流量劫持或中断。
</details>

**70. 纵深防御在网络层面的典型体现是？**
- A. 只部署一道防火墙
- B. 边界防火墙 + 内网分段 + 主机防火墙 + 应用层安全控制
- C. 只依赖IDS
- D. 使用单一安全产品

<details>
<summary>点击查看答案</summary>

**正确答案：B**

网络纵深防御示例：
- 第一层：边界防火墙/NGFW
- 第二层：DMZ区隔离
- 第三层：内网VLAN分段 + 内部防火墙
- 第四层：主机防火墙（iptables/Windows Firewall）
- 第五层：应用安全网关/WAF
</details>

---

## 第八部分：应用安全（第71-80题）

**71. SQL注入防护的最有效措施是？**
- A. 使用WAF过滤
- B. 使用参数化查询/预编译语句
- C. 限制输入长度
- D. 使用HTTPS

<details>
<summary>点击查看答案</summary>

**正确答案：B**

参数化查询（Parameterized Queries）是防御SQL注入的根本方法，将SQL结构与数据分离，使攻击者无法改变SQL语义。WAF只是辅助，可能被绕过。
</details>

**72. CSP（内容安全策略）主要用于防御哪种攻击？**
- A. SQL注入
- B. XSS和数据注入攻击
- C. DDoS
- D. 暴力破解

<details>
<summary>点击查看答案</summary>

**正确答案：B**

CSP通过HTTP响应头 `Content-Security-Policy` 告诉浏览器哪些来源的脚本/样式/图片等资源是合法的，有效防御XSS、Clickjacking等客户端注入攻击。
</details>

**73. SSRF（服务器端请求伪造）攻击的典型危害不包括？**
- A. 扫描内网端口
- B. 访问内部敏感服务
- C. 窃取元数据（云环境）
- D. 直接控制客户端浏览器

<details>
<summary>点击查看答案</summary>

**正确答案：D**

SSRF利用服务端发起请求，主要危害：
- 内网探测与端口扫描
- 访问内部API/服务
- 读取云环境元数据（如AWS `169.254.169.254`）
- 绕过访问控制

控制客户端浏览器是XSS的范畴，与SSRF无关。
</details>

**74. 文件上传漏洞的防护措施中，最可靠的是？**
- A. 仅检查文件扩展名
- B. 仅检查Content-Type头
- C. 检查文件扩展名 + Content-Type + 文件魔术数字 + 内容扫描 + 隔离存储
- D. 前端JS验证

<details>
<summary>点击查看答案</summary>

**正确答案：C**

文件上传安全需要多层防范：
1. 后端验证文件扩展名白名单
2. 检查Content-Type（不可单独依赖）
3. 验证文件魔术数字
4. 内容扫描（防图片马等）
5. 重命名文件（防路径遍历）
6. 隔离存储（非Web可执行目录）

任何单一验证都可被绕过。
</details>

**75. 安全开发生命周期（SDL/SDLC）中，安全需求分析应在哪个阶段进行？**
- A. 编码阶段
- B. 测试阶段
- C. 需求与设计阶段
- D. 运维阶段

<details>
<summary>点击查看答案</summary>

**正确答案：C**

安全左移（Shift Left）：安全活动应尽早介入。SDL强调在需求和设计阶段就进行威胁建模、安全需求分析，而非等到测试或上线后再"打补丁"。
</details>

**76. 以下哪种不是常见的身份认证绕过方式？**
- A. SQL注入绕过登录
- B. 修改Cookie中的身份标识
- C. JWT算法混淆攻击
- D. 使用更强的哈希算法

<details>
<summary>点击查看答案</summary>

**正确答案：D**

使用更强的哈希算法（如bcrypt、Argon2）是安全措施而非攻击方式。常见的认证绕过包括：SQL注入永真条件、Cookie篡改、JWT `alg:none` 攻击、暴力破解、会话固定等。
</details>

**77. Clickjacking（点击劫持）攻击可以通过以下哪种方式防御？**
- A. SQL注入防护
- B. X-Frame-Options 或 CSP frame-ancestors
- C. 输入过滤
- D. HTTPS

<details>
<summary>点击查看答案</summary>

**正确答案：B**

防御Clickjacking：
- `X-Frame-Options: DENY` 或 `SAMEORIGIN`
- `Content-Security-Policy: frame-ancestors 'self'`
两种方式都是告诉浏览器不允许页面被嵌入iframe中。
</details>

**78. 安全测试中，SAST和DAST的区别是？**
- A. SAST测试运行的应用，DAST测试源代码
- B. SAST测试源代码（白盒），DAST测试运行应用（黑盒）
- C. 两者完全相同
- D. SAST手动测试，DAST自动测试

<details>
<summary>点击查看答案</summary>

**正确答案：B**

- SAST（Static Application Security Testing）：白盒测试，分析源代码，不需要运行应用
- DAST（Dynamic Application Security Testing）：黑盒测试，对运行中的应用进行动态扫描
- IAST（Interactive）：结合两者优势，在应用运行时通过插桩分析
</details>

**79. 威胁建模中，STRIDE模型的"E"代表什么？**
- A. Encryption
- B. Elevation of Privilege
- C. Escalation
- D. Execution

<details>
<summary>点击查看答案</summary>

**正确答案：B**

STRIDE威胁分类：
- S：Spoofing（假冒身份）
- T：Tampering（篡改数据）
- R：Repudiation（否认/抵赖）
- I：Information Disclosure（信息泄露）
- D：Denial of Service（拒绝服务）
- E：Elevation of Privilege（权限提升）
</details>

**80. DevSecOps的核心思想是？**
- A. 开发完成后再做安全测试
- B. 将安全融入DevOps全流程
- C. 安全人员独立工作
- D. 取消安全审查

<details>
<summary>点击查看答案</summary>

**正确答案：B**

DevSecOps = Development + Security + Operations，强调"安全即代码"（Security as Code），将安全自动化测试、合规检查、漏洞扫描等融入CI/CD流水线的每个环节。
</details>

---

## 第九部分：物理安全（第81-85题）

**81. 数据中心的TIA-942标准定义了几个等级？**
- A. 2个
- B. 3个
- C. 4个
- D. 5个

<details>
<summary>点击查看答案</summary>

**正确答案：C**

TIA-942定义了4个等级：
- Tier I：基本容量，单一供电路径，可用性99.671%
- Tier II：冗余组件，单一供电路径，可用性99.741%
- Tier III：可并行维护，多供电路径，可用性99.982%
- Tier IV：容错，多供电路径，可用性99.995%
</details>

**82. 灭火系统中，对于数据中心最不推荐使用的是？**
- A. FM200（七氟丙烷）
- B. IG-541（惰性气体）
- C. 水喷淋系统
- D. NOVEC 1230

<details>
<summary>点击查看答案</summary>

**正确答案：C**

数据中心应使用气体灭火系统，避免水喷淋损坏电子设备。常见气体灭火剂：FM200（七氟丙烷）、IG-541（氮氩混合）、NOVEC 1230（氟化酮）。水喷淋可能导致设备短路二次损坏。
</details>

**83. TEMPEST防护主要针对什么威胁？**
- A. 网络攻击
- B. 电磁辐射泄露
- C. 物理入侵
- D. 社会工程学

<details>
<summary>点击查看答案</summary>

**正确答案：B**

TEMPEST是美国军方项目代号，研究防止电子设备通过电磁辐射泄露信息。防护手段包括：电磁屏蔽、红黑分离、滤波、屏蔽电缆等。
</details>

**84. 物理访问控制中，防尾随（Anti-tailgating）的最有效设备是？**
- A. 普通门禁卡
- B. 安防闸门（Mantrap）
- C. 密码锁
- D. 钥匙

<details>
<summary>点击查看答案</summary>

**正确答案：B**

安防闸门（Mantrap/安全旋转门/互锁门）可以确保一次只允许一个人进入，有效防止尾随。普通门禁卡无法阻止跟进去的人。
</details>

**85. 3-2-1备份策略中，"3"代表什么？**
- A. 3份数据副本
- B. 每3天备份一次
- C. 3种加密方式
- D. 3个管理员

<details>
<summary>点击查看答案</summary>

**正确答案：A**

3-2-1备份策略：
- 3：至少保留3份数据副本（1份主数据 + 2份备份）
- 2：使用2种不同存储介质
- 1：至少1份离线/异地备份（防勒索软件）
</details>

---

## 第十部分：安全工程与风险管理（第86-90题）

**86. 风险计算中，SLE（单次损失预期）的计算公式是？**
- A. SLE = ARO × ALE
- B. SLE = AV × EF
- C. SLE = ALE ÷ ARO
- D. SLE = EF × ARO

<details>
<summary>点击查看答案</summary>

**正确答案：B**

风险量化公式：
- SLE = AV（资产价值）× EF（暴露因子/损失比例）
- ALE = SLE × ARO（年发生率）
例如：AV=100万，EF=40%，SLE=40万；ARO=0.5次/年，ALE=20万/年。
</details>

**87. 风险处置策略不包括？**
- A. 风险规避
- B. 风险转移
- C. 风险忽略
- D. 风险缓解

<details>
<summary>点击查看答案</summary>

**正确答案：C**

四种风险处置策略：
1. 规避（Avoidance）：消除风险源，不做这件事
2. 转移（Transfer）：买保险、外包给第三方
3. 缓解（Mitigation）：实施安全控制降低风险
4. 接受（Acceptance）：风险在可接受范围内，不做额外处理
"忽略"不是正确的处置策略，接受是在知情情况下的选择。
</details>

**88. 渗透测试中，灰盒测试的特征是？**
- A. 测试者无任何内部信息
- B. 测试者拥有部分内部信息
- C. 测试者拥有全部信息
- D. 不进行测试

<details>
<summary>点击查看答案</summary>

**正确答案：B**

- 黑盒：无内部信息，模拟外部攻击者
- 白盒：有全部信息（代码、架构、配置等），效率最高
- 灰盒：有部分信息（如测试账号、API文档），模拟有部分权限的内部人
</details>

**89. 代码审计中，"Source"和"Sink"分别指什么？**
- A. Source=代码开头，Sink=代码结尾
- B. Source=不受信任的输入点，Sink=危险函数调用点
- C. Source=数据库，Sink=浏览器
- D. Source=安全函数，Sink=危险函数

<details>
<summary>点击查看答案</summary>

**正确答案：B**

污点分析术语：
- Source（源）：不受信任的数据输入点，如 `$_GET['id']`、`request.getParameter()`
- Sink（汇）：危险函数/操作点，如 `mysql_query()`、`Runtime.exec()`
- 审计核心：追踪数据从Source到Sink的路径，检查是否经过有效净化
</details>

**90. NIST 800-30风险管理框架的步骤顺序是？**
- A. 评估→响应→监控→架构
- B. 准备→分类→选择→实施→评估→授权→监控
- C. 扫描→修复→验证
- D. 设计→开发→测试→上线

<details>
<summary>点击查看答案</summary>

**正确答案：B**

NIST SP 800-37 RMF七个步骤：
1. Prepare（准备）
2. Categorize（分类）
3. Select（选择控制措施）
4. Implement（实施）
5. Assess（评估）
6. Authorize（授权）
7. Monitor（持续监控）
</details>

---

## 第十一部分：业务安全与数据隐私（第91-100题）

**91. GDPR中，"数据主体"指的是？**
- A. 数据处理者
- B. 数据控制者
- C. 数据所关联的自然人
- D. 监管机构

<details>
<summary>点击查看答案</summary>

**正确答案：C**

数据主体（Data Subject）指个人信息所标识或关联的自然人。数据处理者（Processor）和控制者（Controller）是处理数据的组织。
</details>

**92. 数据脱敏中，动态脱敏与静态脱敏的区别是？**
- A. 动态脱敏处理存储数据，静态脱敏处理查询结果
- B. 动态脱敏实时改写查询结果，静态脱敏修改存储的数据
- C. 完全相同
- D. 动态脱敏用于备份，静态脱敏用于生产

<details>
<summary>点击查看答案</summary>

**正确答案：B**

- 静态脱敏（SDM）：对存储数据直接修改，用于测试环境、开发环境
- 动态脱敏（DDM）：不修改存储数据，在查询时实时改写结果，用于生产环境
- 动态脱敏更灵活但性能开销大，静态脱敏适合离线场景
</details>

**93. DLP（数据防泄漏）系统的三大核心功能是？**
- A. 加密、备份、恢复
- B. 发现、监控、防护
- C. 扫描、清除、重建
- D. 收集、分析、展示

<details>
<summary>点击查看答案</summary>

**正确答案：B**

DLP三大功能：
- 发现（Discover）：识别和分类敏感数据的位置
- 监控（Monitor）：实时监控数据流动和使用
- 防护（Protect）：阻止违规数据传输（阻断邮件外发、USB拷贝等）
</details>

**94. 跨境数据传输评估中，"重要数据"的定义依据是什么？**
- A. 企业自己定义
- B. 国家有关法律法规和标准
- C. 任意定义
- D. 国际标准

<details>
<summary>点击查看答案</summary>

**正确答案：B**

重要数据的定义依据《数据安全法》及相关行业标准，需要参考国家和行业主管部门发布的"重要数据目录"，不同类型数据依据不同部门的标准。
</details>

**95. PIA（隐私影响评估）应当在什么阶段开展？**
- A. 系统上线后
- B. 数据处理活动开始前
- C. 发生数据泄露后
- D. 不需要

<details>
<summary>点击查看答案</summary>

**正确答案：B**

PIA（Privacy Impact Assessment）应在数据处理活动开始前或新项目启动前开展，评估数据处理活动对个人隐私的潜在影响。这是隐私保护"事前预防"的重要手段。
</details>

**96. 同态加密的主要应用场景是？**
- A. 文件存储
- B. 在不暴露明文的情况下进行数据计算
- C. 网络传输
- D. 身份认证

<details>
<summary>点击查看答案</summary>

**正确答案：B**

同态加密允许在密文上直接进行计算，计算结果解密后与明文计算的结果相同。典型应用：云环境中数据可用不可见——用户可以提交加密数据给云服务计算，云服务无法看到原始数据。
</details>

**97. 数据处理的最小必要原则要求？**
- A. 收集尽可能多的数据
- B. 只收集与处理目的直接相关且必需的数据
- C. 随意收集数据
- D. 收集后可以用于任何目的

<details>
<summary>点击查看答案</summary>

**正确答案：B**

最小必要原则包含：
- 数据收集范围最小（够用即可，不多收集）
- 处理频率最低
- 保存期限最短（到期删除/匿名化）
- 访问权限最小
</details>

**98. 数据治理框架DAMA-DMBOK将数据管理分为多少个知识领域？**
- A. 5个
- B. 10个
- C. 11个
- D. 20个

<details>
<summary>点击查看答案</summary>

**正确答案：C**

DAMA-DMBOK定义了11个数据管理知识领域：
数据治理、数据架构、数据建模与设计、数据存储与操作、数据安全、数据集成与互操作、文件和内容管理、参考与主数据、数据仓库与BI、元数据、数据质量管理。
</details>

**99. 差分隐私的核心技术手段是？**
- A. 加密所有数据
- B. 向查询结果添加经过校准的随机噪声
- C. 删除所有数据
- D. 禁止所有数据访问

<details>
<summary>点击查看答案</summary>

**正确答案：B**

差分隐私通过向查询结果中添加精心校准的随机噪声（如拉普拉斯噪声），使得攻击者无法从统计查询结果中推断出任何具体个体的信息。Apple和Google都使用此技术进行用户数据收集。
</details>

**100. K-匿名（K-anonymity）要求数据集中每条记录至少与多少条记录在准标识符上不可区分？**
- A. 0条
- B. 1条
- C. K-1条
- D. 任意条

<details>
<summary>点击查看答案</summary>

**正确答案：C**

K-匿名要求数据集中每条记录在准标识符属性组合上至少有K-1条其他记录与之相同，即形成至少K条记录的等价类。例如K=5，每条记录至少与4条其他记录在准标识符上无法区分。
</details>

---

## 📊 CISP考试速查表

| 知识域 | 核心考点 | 高频题数 |
|--------|---------|---------|
| 信息安全基础 | CIA三要素、纵深防御、最小权限、ISO 27001 | 10 |
| 法律法规 | 网安法、等保、个保法、数据安全法、CII保护 | 10 |
| 访问控制 | BLP模型、RBAC、MFA、SSO、Kerberos、OAuth | 10 |
| 应急响应 | PICERL、SIEM、RTO/RPO、BCP/DRP、变更管理 | 10 |
| 攻击技术 | CVSS/CVE、SQLi/XSS/CSRF/SSRF、DDoS、APT、OWASP | 10 |
| 密码学 | AES/RSA/ECC、SHA、数字签名、PKI、DH | 10 |
| 网络安全 | ARP/DNS/BGP、防火墙、IDS/IPS/VPN、WPA3、VLAN | 10 |
| 应用安全 | 参数化查询、CSP、SDL、SAST/DAST、STRIDE | 10 |
| 物理安全 | TIA-942、气体灭火、TEMPEST、Mantrap | 5 |
| 风险管理 | SLE/ALE、NIST RMF、渗透测试、代码审计 | 5 |
| 数据隐私 | GDPR/PIPL、脱敏、DLP、同态加密、差分隐私 | 10 |

---

## 🎯 重点知识与常见陷阱

> **⚠️ 易错提醒**
> - CIA中的C是**Confidentiality**（机密性），不是Confidence
> - BLP模型是"不上读、不下写"（保证机密性），Biba模型是"不下读、不上写"（保证完整性）——两者容易记反
> - 数字签名**不提供机密性**（需要加密来实现）
> - AH**不提供加密**，ESP提供加密
> - 等保**五级**，TIA-942数据中心**四级**，不要混淆
> - P**D**CA：D是**Do**（实施），不是Design

> **💡 CISP考试特点**
> - 100道单选题，每题1分
> - 特别注意"**不包括**"、"**错误**的是"等否定式提问
> - 法律法规类题目需要关注最新的施行日期和修订
> - 很多题目考察的是**最正确/最适合**而非唯一正确

---

## ✅ 学习自检清单

- [ ] 能否准确回答CIA三要素及其含义？
- [ ] 是否清楚等保的五个级别及对应要求？
- [ ] 能否区分BLP模型（机密性）和Biba模型（完整性）？
- [ ] 是否理解PICERL应急响应六步流程？
- [ ] 能否计算SLE、ALE？
- [ ] 是否掌握AES/SHA/RSA的核心参数？
- [ ] 能否区分反射型/存储型/DOM型XSS？
- [ ] 是否了解OWASP Top 10 2021的前三名？
- [ ] 能否区分SAST/DAST/IAST？
- [ ] 是否理解数据脱敏的SDM和DDM区别？

> **📝 评分标准**：答对60题及以上为通过。如果本次得分低于70分，建议重点复习错题对应知识域再进入Day 79。
