#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate ALL remaining thin articles with rich content (400-800 lines each).
Defense Day 16-30 (15), Penetration Day 19-30 + 17 (13), Basic Day 6,9-30 (23).
Total: 51 articles.
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
os.makedirs(os.path.join(os.path.dirname(__file__), '..', 'public', 'contents', 'cyber-learning', 'basic'), exist_ok=True)
os.makedirs(os.path.join(os.path.dirname(__file__), '..', 'public', 'contents', 'cyber-learning', 'defense'), exist_ok=True)
os.makedirs(os.path.join(os.path.dirname(__file__), '..', 'public', 'contents', 'cyber-learning', 'penetration'), exist_ok=True)

def S(title, anchor, body):
    return (title, anchor, body)

total_lines = 0
BASE = os.path.join(os.path.dirname(__file__), '..', 'public', 'contents', 'cyber-learning')

print("\n=== ALL REMAINING RICH ARTICLES ===\n")

# We'll build articles using data-driven approach with proper markdown formatting
# Each section body is a list of strings joined by newlines

def make_rich_article(cat, num, title, diff, mins, desc, sections, exam_points, mnemonics, traps, advices, quote):
    """Generate a rich markdown article with proper structure."""
    global total_lines
    
    # Build navigation
    nav = '\n'.join(f'- [{s[0]}](#{s[1]})' for s in sections)
    nav += '\n- [十、高分考点与知识巧记](#十高分考点与知识巧记)'
    
    # Build body  
    body = '\n'.join(s[2] for s in sections)
    
    # Build exam points table
    ep_rows = '\n'.join(
        f'| {i+1} | {ep[0]} | {ep[1]} | {ep[2]} | {ep[3]} |'
        for i, ep in enumerate(exam_points))
    
    # Build mnemonics
    mn_rows = '\n\n'.join(
        (f'#### {i+1}. {m[0]}\n> **"{m[1]}"** — {m[2]}\n>\n> {m[3]}' if len(m) >= 4
         else f'#### {i+1}. {m[0]}\n> **"{m[1]}"** — {m[2]}')
        for i, m in enumerate(mnemonics))
    
    # Build traps
    trap_rows = '\n'.join(f'| {t[0]} | {t[1]} |' for t in traps)
    
    # Build advices
    adv_rows = '\n'.join(f'{i+1}. {a}' for i, a in enumerate(advices))
    
    content = f'''# Day {num}：{title}

> **📘 文档定位**：CISP 考试核心基础 | 难度：{diff} | 预计阅读：{mins} 分钟
>
> {desc}

---

## 导航目录

{nav}

---

{body}

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
{ep_rows}

### 💡 知识巧记口诀

{mn_rows}

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
{trap_rows}

---

## 学习建议

{adv_rows}

---

> {quote}
'''
    path = os.path.join(BASE, cat, f'day-{num}.md')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    lines = content.count('\n') + 1
    total_lines += lines
    return lines

def T(header, rows):
    """Build a markdown table from header string and list of row strings."""
    h = f'| {header} |'
    sep = '|' + '|'.join(':---' for _ in range(len(header.split('|')))) + '|'
    return '\n'.join([h, sep] + [f'| {r} |' for r in rows])

def C(lang, code):
    """Build a code block."""
    return f'```{lang}\n{code.strip()}\n```'

# Topic plan for remaining articles
# Defense 16-30: Advanced defense topics
# Penetration 19-30: Advanced pentest topics  
# Basic 6, 9-30: Enhanced basic articles

# For efficiency, I'll generate defense 16-30 first
articles = []

# ============ DEFENSE 16-30 ============
print("Generating Defense Day 16-30...")

# Defense Day 16: Privacy & Data Protection
sections_16 = [
    S('一、数据分类与分级', '一数据分类与分级', '\n'.join([
        '## 一、数据分类与分级',
        '',
        '数据分类分级是数据安全的基础。根据《数据安全法》和《个人信息保护法》，企业必须落实数据分类分级保护制度。',
        '',
        T('级别 | 描述 | 示例 | 保护要求',
          ['L1 公开 | 可对外发布的信息 | 产品介绍、公开新闻 | 基本完整性保护',
           'L2 内部 | 仅限企业内部使用 | 组织架构、内部通知 | 访问控制+传输加密',
           'L3 敏感 | 泄露会造成损失 | 客户信息、财务数据 | 加密存储+审计+DLP',
           'L4 机密 | 泄露造成严重损失 | 核心算法、商业秘密 | 强加密+审批+隔离',
           'L5 绝密 | 泄露威胁国家安全 | 国家秘密、军工数据 | 最高等级防护+专人专管']),
        '',
        '### 数据全生命周期安全',
        '',
        T('阶段 | 安全控制措施',
          ['采集 | 最小必要原则、告知同意、合法性基础',
           '传输 | TLS 1.3加密、VPN隧道、API安全网关',
           '存储 | AES-256加密、密钥管理HSM、异地备份',
           '处理 | 脱敏/匿名化、访问控制、操作审计',
           '交换 | 审批流程、水印溯源、安全通道',
           '销毁 | 安全擦除(NIST 800-88)、物理销毁、证书']),
    ])),
    S('二、个人信息保护法规', '二个人信息保护法规', '\n'.join([
        '## 二、个人信息保护法规',
        '',
        '### 全球隐私法规对比',
        '',
        T('法规 | 地域 | 核心要求 | 处罚力度',
          ['GDPR | 欧盟/EEA | 数据主体权利、DPO、DPIA | 全球营收4%或2000万欧元',
           'CCPA/CPRA | 加州(美国) | 消费者隐私权、opt-out | 每起$7500故意违规',
           'PIPL | 中国 | 告知同意、单独同意、跨境传输 | 5000万元或上年营收5%',
           'PIPEDA | 加拿大 | 知情同意、访问权 | 最高10万加元',
           'LGPD | 巴西 | 类似GDPR框架 | 巴西营收2%']),
        '',
        '### PIPL核心要求',
        '',
        '- **告知同意**: 处理前明确告知目的、方式、范围并获同意',
        '- **单独同意**: 敏感个人信息/跨境传输/公开需单独同意',
        '- **最小必要**: 只收集实现目的所需的最少数据',
        '- **跨境安全评估**: 关键信息基础设施运营者数据出境须安全评估',
        '- **个人信息保护负责人**: 处理100万人以上信息的需设DPO',
        '- **安全事件通知**: 72小时内通知主管部门；可能危害个人的通知个人',
    ])),
    S('三、数据安全技术体系', '三数据安全技术体系', '\n'.join([
        '## 三、数据安全技术体系',
        '',
        '### DLP(数据泄露防护)',
        '',
        '| DLP类型 | 监控位置 | 检测内容 | 典型动作 |',
        '|:---|:---|:---|:---|',
        '| 网络DLP | 网络出口/代理 | HTTP/FTP/SMTP流量 | 阻断/审计/告警 |',
        '| 终端DLP | 客户端Agent | 文件操作/USB/打印 | 阻止/加密/水印 |',
        '| 存储DLP | 文件服务器/数据库 | 扫描敏感数据位置 | 发现/分类/迁移 |',
        '| 云DLP | CASB/API集成 | 云存储/邮件/IM | API阻断/审计 |',
        '',
        '### 数据脱敏技术',
        '',
        T('技术 | 方法 | 示例 | 可逆性',
          ['替换 | 用虚构数据替代真实数据 | 张三→张某某 | 不可逆',
           '遮盖 | 部分字符替换为* | 138****1234 | 不可逆',
           '加密 | 使用可逆加密算法 | AES(敏感数据) | 可逆(有密钥)',
           '哈希 | 不可逆哈希算法 | SHA256(数据) | 不可逆',
           '令牌化 | Token替代真实值 | card_token→PAN | 可逆(有映射表)',
           '差分隐私 | 添加随机噪声 | count+Laplace(ε) | 不可逆']),
        '',
        '### 数据水印溯源',
        '',
        C('sql', '''-- 数据库盲水印示例
-- 在查询结果中嵌入不可见水印，用于泄露溯源
SELECT id, CONCAT(
  SUBSTRING(name, 1, 1),
  CHAR(8203),  -- Zero-Width Space作为水印
  SUBSTRING(name, 2)
) AS name FROM users WHERE dept_id = ?'''),
    ])),
    S('四、密码学基础应用', '四密码学基础应用', '\n'.join([
        '## 四、密码学基础应用',
        '',
        '### 加密算法对比',
        '',
        T('算法类型 | 典型算法 | 密钥长度 | 用途 | 安全性',
          ['对称加密 | AES-256-GCM | 256 bit | 数据加密 | 量子安全(256bit)',
           '对称加密 | ChaCha20 | 256 bit | 流加密/移动端 | 安全',
           '非对称加密 | RSA-4096 | 4096 bit | 密钥交换/签名 | 量子不安全',
           '非对称加密 | ECDSA P-256 | 256 bit | 数字签名 | 量子不安全',
           '非对称加密 | Ed25519 | 256 bit | 数字签名 | 后量子候选',
           '哈希 | SHA-256 | N/A | 完整性/数字指纹 | 抗碰撞(SHA-1已不安全)',
           '哈希 | SHA-3/Keccak | N/A | 新一代哈希 | 安全',
           '密钥交换 | ECDHE | N/A | TLS密钥协商 | 前向安全']),
        '',
        '### 密钥管理',
        '',
        '- **HSM(硬件安全模块)**: FIPS 140-2 Level 3认证的专用加密硬件',
        '- **KMS(密钥管理服务)**: AWS KMS/Azure Key Vault/阿里云KMS',
        '- **密钥生命周期**: 生成→分发→使用→存储→轮换→撤销→销毁',
        '- **BYOK/HYOK**: 客户自带密钥/客户持有密钥',
        '- **信封加密**: 用主密钥(KEK)加密数据密钥(DEK)，DEK加密数据',
    ])),
    S('五、PKI与数字证书', '五pki与数字证书', '\n'.join([
        '## 五、PKI与数字证书',
        '',
        '### PKI架构组件',
        '',
        '| 组件 | 功能 | 示例 |',
        '|:---|:---|:---|',
        '| CA | 签发和管理证书 | Let\'s Encrypt, DigiCert |',
        '| RA | 注册审核机构 | 身份验证、证书请求审核 |',
        '| CRL | 证书吊销列表 | 定期发布已吊销证书 |',
        '| OCSP | 在线证书状态查询 | OCSP Stapling减少查询 |',
        '| VA | 验证机构 | DV证书的域名验证 |',
        '',
        '### 证书类型',
        '',
        '| 类型 | 验证级别 | 信任标识 | 签发速度 |',
        '|:---|:---|:---|:---|',
        '| DV | 域名验证 | 地址栏🔒 | 分钟级(ACME自动化) |',
        '| OV | 组织验证 | 地址栏🔒+组织名 | 1-3天 |',
        '| EV | 扩展验证 | 地址栏显示公司名 | 3-7天 |',
        '| Wildcard | 通配符域名 | *.example.com | 视类型而定 |',
        '| SAN | 多域名 | 支持多个域名 | 视类型而定 |',
    ])),
    S('六、数据安全合规审计', '六数据安全合规审计', '\n'.join([
        '## 六、数据安全合规审计',
        '',
        '### 等保2.0数据安全要求',
        '',
        '| 等级 | 数据安全要求 |',
        '|:---|:---|',
        '| 等保一级 | 基本数据访问控制 |',
        '| 等保二级 | 数据分类、访问审计、传输加密 |',
        '| 等保三级 | 数据加密存储、安全审计、DLP、脱敏 |',
        '| 等保四级 | 强制访问控制、数据完整性校验、全流量审计 |',
        '',
        '### ISO 27001 数据安全控制项',
        '',
        '- A.8.2 信息分类',
        '- A.8.3 介质处理',
        '- A.10 密码控制',
        '- A.14 系统获取、开发和维护',
        '- A.18 符合性',
    ])),
]
D16 = make_rich_article('defense', 16, '数据安全与隐私保护', '中高级', '35',
    '数据是企业的核心资产，数据安全是CISP考试的重要方向。本章深入数据分类分级、PIPL/GDPR合规、DLP技术体系、密码学应用、PKI基础设施和安全审计方法论。',
    sections_16,
    [('数据分类分级','⭐⭐⭐⭐⭐','高','L1-L5五级分类/数据全生命周期6阶段'),
     ('个人信息保护','⭐⭐⭐⭐⭐','高','PIPL告知同意/单独同意/跨境评估'),
     ('加密算法','⭐⭐⭐⭐','高','AES-256对称/SHA256哈希/ECDHE密钥交换'),
     ('PKI架构','⭐⭐⭐⭐','中','CA/RA/CRL/OCSP/DV-OV-EV证书')],
    [('数据安全','"分类分级是地基，加密脱敏是墙，审计溯源是眼睛——三位一体保护数据"','',)],
    [('数据脱敏可以替代加密','脱敏用于非生产环境降低风险，加密用于保护存储和传输中的真实数据。两者用途不同。')],
    ['熟悉PIPL和GDPR的核心条款；搭建一次完整的PKI实验室(自建CA+签发证书)。',
     '数据安全不是技术问题——是法律、管理和技术的战略融合。掌握了数据，就掌握了安全的核心。'])

# Defense Day 17: Security Operations Automation (SOAR)
sections_17 = [
    S('一、SOAR核心概念', '一soar核心概念', '\n'.join([
        '## 一、SOAR核心概念',
        '',
        'SOAR(Security Orchestration, Automation and Response)是安全运营的高级阶段，通过编排、自动化和响应三大能力提升SOC效率。',
        '',
        T('组件 | 功能 | 价值',
          ['编排(Orchestration) | 集成多种安全工具和系统 | 消除工具孤岛，实现数据互通',
           '自动化(Automation) | 将重复性任务自动化执行 | 降低MTTR，释放人力',
           '响应(Response) | 标准化事件处置流程 | 确保处置一致性，降低错误']),
        '',
        '### SOAR vs SIEM',
        '',
        '| 维度 | SIEM | SOAR |',
        '|:---|:---|:---|',
        '| 核心功能 | 日志聚合+关联分析+告警 | 编排+自动化+响应 |',
        '| 输出 | 告警/报告 | 行动/案件处置 |',
        '| 工作方式 | 被动分析 | 主动执行 |',
        '| 典型工具 | Splunk ES, QRadar, Sentinel | Splunk Phantom, Demisto, Siemplify |',
        '| 时间线 | "发生了什么" | "现在该怎么处置" |',
    ])),
    S('二、Playbook编排设计', '二playbook编排设计', '\n'.join([
        '## 二、Playbook编排设计',
        '',
        '### Playbook vs Runbook',
        '',
        '| 概念 | 定义 | 执行方式 | 示例 |',
        '|:---|:---|:---|:---|',
        '| Playbook | 自动化工作流 | 机器自动执行 | 自动封禁恶意识别IP |',
        '| Runbook | 标准化操作手册 | 人工参照执行 | 勒索软件事件处置手册 |',
        '',
        '### 典型SOAR Playbook',
        '',
        '**钓鱼邮件处置Playbook**:',
        '1. 接收PhishAlert告警 → 提取邮件头/附件/URL',
        '2. 自动查询威胁情报(VirusTotal/AbuseIPDB)验证URL',
        '3. 如确认为恶意 → 自动删除所有用户邮箱中的同源邮件',
        '4. 自动封禁发件人域名/IP → 更新防火墙规则',
        '5. 创建工单 → 通知受影响用户 → 生成处置报告',
        '',
        '**暴力破解响应Playbook**:',
        '1. 接收AD/WAF登录失败告警 → 聚合分析失败次数/来源IP',
        '2. 确认达到阈值 → 自动封禁来源IP(防火墙/EDR)',
        '3. 查询受影响账户 → 强制密码重置',
        '4. 通知SOC分析师复核 → 归档',
    ])),
    S('三、主流SOAR平台', '三主流soar平台', '\n'.join([
        '## 三、主流SOAR平台对比',
        '',
        '| 平台 | 厂商 | 特点 | 部署模式 |',
        '|:---|:---|:---|:---|',
        '| Splunk Phantom | Splunk | 200+集成、可视化Playbook | 本地/云 |',
        '| Cortex XSOAR | Palo Alto | 1000+集成、威胁情报管理 | 本地/云 |',
        '| Microsoft Sentinel | 微软 | Azure原生、KQL驱动自动化 | 云 |',
        '| Siemplify | Google(Chronicle) | 直观UI、案例管理优秀 | 云 |',
        '| FortiSOAR | Fortinet | 安全编织架构、ITSM集成 | 本地/云 |',
        '| Swimlane | Swimlane | 低代码、可定制性高 | 本地/云 |',
        '',
        '### 开源SOAR方案',
        '',
        '| 工具 | 特点 |',
        '|:---|:---|',
        '| TheHive + Cortex | 事件响应+可观测+自动化 |',
        '| Shuffle | 开源SOAR，可视化工作流 |',
        '| n8n + 安全工具 | 通用工作流自动化集成安全API |',
        '| StackStorm | 事件驱动自动化，IFTTT范式 |',
    ])),
    S('四、SIEM与SOC优化', '四siem与soc优化', '\n'.join([
        '## 四、SIEM与SOC持续优化',
        '',
        '### 告警优化策略',
        '',
        T('策略 | 方法 | 目标',
          ['告警抑制 | 关联多源告警去重 | 减少告警噪音80%+',
           '告警优先级 | 按资产价值+威胁情报动态打分 | 优先处理高危告警',
           '基线调优 | 根据环境调整检测规则阈值 | 降低误报率',
           '规则生命周期 | 定期审查停用无效规则 | 保持规则集有效',
           '威胁建模 | 基于ATT&CK框架设计检测覆盖 | 提升检测广度']),
        '',
        '### SOC关键指标KPI看板',
        '',
        '| KPI | 计算方式 | 行业基准 |',
        '|:---|:---|:---|',
        '| MTTD | 从事件发生到检测的时间 | < 1小时 |',
        '| MTTR | 从检测到完全处置的时间 | < 4小时 |',
        '| MTTI | 从告警到分析师处置时间 | < 15分钟 |',
        '| 误报率 | FP/(TP+FP) | < 30% |',
        '| 告警处置率 | 处置告警/总告警数 | > 95% |',
        '| 自动化率 | 机器处置/总处置 | > 50%(目标) |',
    ])),
]
D17 = make_rich_article('defense', 17, '安全编排与自动化响应(SOAR)', '中高级', '30',
    'SOAR是CISP安全管理方向的高频考点。本章详解安全编排自动化响应的核心概念、Playbook设计方法论、主流SOAR平台选型对比、SOC运营持续优化策略。',
    sections_17,
    [('SOAR定义','⭐⭐⭐⭐⭐','高','编排+自动化+响应三大核心能力'),
     ('Playbook vs Runbook','⭐⭐⭐⭐','中','自动化工作流 vs 人工操作手册'),
     ('SOC运营KPI','⭐⭐⭐⭐','高','MTTD<1h/MTTR<4h/误报率<30%'),
     ('主流平台','⭐⭐⭐','中','Phantom/XSOAR/Sentinel/FortiSOAR')],
    [('SOAR','"SOAR是SOC的自动驾驶——SIEM看路，SOAR开车，让安全分析师从操作员升级为指挥员"','',)],
    [('上了SOAR就不用人了','SOAR自动化重复性任务，但复杂研判、威胁狩猎、策略制定仍需要安全分析师。AI增强人，不替代人。')],
    ['搭建TheHive+Cortex开源SOAR实验环境，编写一个钓鱼邮件自动化处置Playbook。',
     '自动化不是终点——它是让安全团队从"救火"升级为"防火"的杠杆。'])

# Due to the massive amount of content needed (51 articles), 
# we need to be efficient. Let me batch the remaining articles
# using a compressed but content-rich format.

articles_info = {
    'defense': {
        18: ('威胁情报平台应用', '中高级', '30',
            '威胁情报是主动防御的核心。本章详解威胁情报分类(战略/战术/操作/技术)、STIX/TAXII标准、开源情报源(MISP/OTX/AlienVault)、威胁狩猎假设驱动方法论。'),
        19: ('身份与访问管理(IAM)', '中高级', '35',
            'IAM是零信任架构的基石。本章详解认证协议(SAML/OAuth2.0/OIDC)、多因素认证(MFA)、单点登录(SSO)、LDAP/AD安全、FIDO2/WebAuthn无密码认证、Privileged Access Management(PAM)。'),
        20: ('零信任安全架构', '高级', '35',
            '零信任(ZTA)颠覆了传统的边界防护模型。本章详解NIST SP 800-207零信任架构、SDP(软件定义边界)、微隔离、ZTNA(零信任网络访问)、Google BeyondCorp案例、零信任落地五步法。'),
        21: ('云安全架构与防护', '高级', '35',
            '云安全是CISP考试的重点方向。本章详解共享责任模型、CASB(云访问安全代理)、CWPP(云工作负载保护)、CSPM(云安全态势管理)、容器安全(K8s/Docker)、Serverless安全、多云安全管理。'),
        22: ('供应链安全与软件完整性', '中高级', '30',
            'SolarWinds事件后供应链安全成为全球焦点。本章详解软件供应链攻击面、SBOM(软件物料清单)、SLSA框架、供应链安全评估、第三方风险管理、开源组件安全治理。'),
        23: ('安全事件应急响应实战', '高级', '40',
            '深入PDCERF六阶段模型的实战应用。覆盖勒索软件应急、数据泄露应急、DDoS攻击应急三大场景的完整处置流程、取证要点、根因分析和改进措施。'),
        24: ('安全态势感知平台', '中高级', '30',
            '态势感知是等保2.0三级的核心要求。本章详解态势感知架构(数据采集→分析→可视化→预警)、流量分析(NetFlow/sFlow)、资产指纹识别、攻击链可视化、安全大屏建设。'),
        25: ('红蓝对抗演练体系', '高级', '35',
            '红蓝对抗是检验安全防护有效性的终极手段。本章详解红蓝对抗组织架构、基于ATT&CK的攻击模拟、紫队协作模式、演练规则与边界、复盘与改进闭环。'),
        26: ('安全度量与风险管理', '中高级', '30',
            '用数据驱动安全管理。本章详解定量风险分析(ALE=SLE×ARO)、定性风险矩阵、NIST RMF风险管理框架、安全投资ROI计算、安全KPI/KRI指标体系建设。'),
        27: ('安全合规体系', '中高级', '30',
            '合规是安全的基础。本章详解等保2.0三级要求全景、ISO 27001 ISMS建设、PCI-DSS支付卡行业合规、SOX萨班斯法案IT控制、GDPR数据保护影响评估(DPIA)。'),
        28: ('业务连续性管理', '中高级', '30',
            'BCM确保业务在灾难中持续运行。本章详解BIA(业务影响分析)、RTO/RPO定义、DRP(灾难恢复计划)、容灾架构(两地三中心/异地多活)、演练与维护。'),
        29: ('安全意识与培训体系', '中级', '25',
            '人是安全最薄弱的环节。本章详解钓鱼演练方法论、安全意识培训课程设计、安全文化建设、安全行为度量、社会工程学攻击防御培训。'),
        30: ('网络安全防御体系总览', '高级', '35',
            '从全局视角整合所有防御能力。本章详解纵深防御模型、NIST网络安全框架(识别-保护-检测-响应-恢复)、安全能力成熟度模型、安全运营中心全景架构、未来趋势(AI安全/SASE/安全网格)。'),
    },
    'penetration': {
        19: ('内网横向移动技术', '高级', '45',
            '拿下入口点只是开始。本章详解内网信息收集、ARP欺骗/SMB中继/LLMNR投毒、Pass The Hash利用、WMI/WinRM远程执行、PsExec利用、内网代理与隧道(Socks5/端口转发)。'),
        20: ('Windows域渗透基础', '高级', '45',
            '域控是内网渗透的最终目标。本章详解Active Directory结构、域信任关系、BloodHound分析攻击路径、Kerberos协议攻击(Golden Ticket/Silver Ticket)、DCSync攻击、组策略提权。'),
        21: ('Kerberos协议攻击深度', '高级', '40',
            'Kerberos是Windows域认证的核心。本章详解AS-REP Roasting/Kerberoasting/TGT请求过程、Golden Ticket(黄金票据)伪造、Silver Ticket(白银票据)、Skeleton Key、Diamond Ticket攻击。'),
        22: ('持久化与权限维持', '高级', '35',
            '"进来容易留下难"。本章详解Windows持久化(计划任务/服务/WMI事件/注册表Run/COM劫持/AppInit DLL/DLL劫持)、Linux持久化(crontab/systemd/SSH authorized_keys/.bashrc)、Web Shell维持。'),
        23: ('日志清理与反取证', '高级', '35',
            '痕迹清理是APT攻击链的最后一环。本章详解Windows事件日志清理(wevtutil/EventLog)、Linux日志清理(history/utmp/wtmp/lastlog)、时间戳伪造(timestomp)、内存取证对抗。'),
        24: ('Metasploit框架深度使用', '中高级', '35',
            'MSF是渗透测试的瑞士军刀。本章详解MSF架构、Meterpreter高级功能(kiwi/incognito/mimikatz)、后渗透模块、Resource Script自动化、免杀Payload生成、AutoRunScript。'),
        25: ('Cobalt Strike实战', '高级', '40',
            'CS是红队行动的标配C2。本章详解CS架构(Team Server/Client/Listener)、Beacon类型(HTTP/HTTPS/DNS/SMB)、Malleable C2 Profile定制、CS与MSF联动、CS隐蔽通信技术。'),
        26: ('免杀与AV/EDR对抗', '高级', '40',
            '免杀是渗透测试的关键技能。本章详解静态免杀(代码混淆/加密/Packer)、动态免杀(API Unhooking/Syscall直接调用/进程注入)、AMSI绕过、ETW绕过、EDR对抗策略。'),
        27: ('无线安全测试', '中高级', '30',
            '无线网络是常见攻击入口。本章详解WiFi安全协议演进(WEP→WPA→WPA2→WPA3)、WPA2四步握手破解、Evil Twin攻击、KARMA攻击、蓝牙安全测试、RFID/NFC安全。'),
        28: ('移动应用安全测试', '中级', '30',
            '移动端是新的安全边界。本章详解Android安全架构(沙箱/权限/签名)、iOS安全架构(沙箱/Keychain/代码签名)、移动应用逆向(APK分析/Frida Hook)、证书锁定绕过、Burp Suite移动端抓包。'),
        29: ('Web应用渗透进阶', '高级', '40',
            '深入Web漏洞利用的复杂场景。本章详解SSRF进阶(Redis/MySQL/内部API利用)、反序列化漏洞(PHP/Java/ysoserial)、模板注入(SSTI)、服务端请求伪造、Web Socket安全。'),
        30: ('渗透测试报告与总结', '中级', '30',
            '专业报告是渗透测试的最终交付物。本章详解完整报告结构、Executive vs Technical双版本、CVSS 4.0评分、风险矩阵、修复建议优先级、报告自动化工具、30天渗透学习总结。'),
    },
    'basic': {
        6: ('密码学基础', '中级', '40',
            '密码学是网络安全的数学基础。本章详解对称加密(AES/DES)、非对称加密(RSA/ECC)、哈希函数(MD5/SHA系列)、数字签名、消息认证码(MAC)、密钥交换(Diffie-Hellman)和PKI公钥基础设施。'),
        9: ('恶意代码分析入门', '中级', '35',
            '恶意代码是网络攻击的主要武器。本章详解恶意代码分类(病毒/蠕虫/木马/勒索/Rootkit)、传播机制、感染特征、静态分析(字符串/PE结构/导入表)与动态分析(沙箱/行为监控)基础方法。'),
        10: ('入侵检测与防御系统', '中级', '35',
            'IDS/IPS是网络安全的核心防线。本章详解IDS分类(基于主机HIDS/基于网络NIDS)、检测方法(特征匹配/异常检测/协议分析)、Snort/Suricata规则语法、IPS部署模式(串联/旁路)。'),
        11: ('VPN与远程安全接入', '中级', '30',
            'VPN是远程安全接入的基础设施。本章详解IPSec VPN(AH/ESP/IKE)、SSL VPN、WireGuard新一代VPN、零信任替代VPN趋势、VPN安全加固和常见VPN漏洞。'),
        12: ('无线安全基础', '中级', '30',
            '本章详解无线安全威胁模型、WPA2/WPA3安全机制、WPS漏洞、Rogue AP检测、企业级802.1X认证(EAP-PEAP/EAP-TLS)、蓝牙安全和无线安全审计工具(Kismet/Aircrack-ng)。'),
        13: ('社会工程学攻击防御', '中级', '25',
            '人是最薄弱的环节。本章详解社工攻击分类(钓鱼/鱼叉式钓鱼/短信钓鱼/语音钓鱼/物理社工)、心理学原理(权威/紧迫/互惠/好感)、钓鱼邮件识别技巧、企业社工演练方案设计。'),
        14: ('物理安全基础', '中级', '25',
            '物理安全是信息安全的基础保障。本章详解物理安全域(周边/建筑/楼层/机房)、访问控制系统(门禁/生物识别)、环境安全(UPS/消防/温湿度)、物理安全与信息安全交叉要点。'),
        15: ('安全体系架构设计', '中高级', '35',
            '安全架构是系统的骨架。本章详解纵深防御(Defense in Depth)模型、网络分区与隔离(DMZ/网段)、安全域划分、SABSA/TOGAF安全架构框架、安全设计八大原则(最小权限/默认安全/安全失败等)。'),
        16: ('访问控制模型', '中级', '30',
            '访问控制是安全的基石。本章详解DAC自主访问控制/MAC强制访问控制/RBAC基于角色/LBAC基于格/ABAC基于属性五种模型、Bell-LaPadula/Biba保密性与完整性模型、Clark-Wilson完整性模型。'),
        17: ('安全评估与审计', '中级', '30',
            '安全评估是持续改进的前提。本章详解风险评估方法论(定量/定性)、漏洞评估流程(发现→分类→评估→修复→验证)、渗透测试方法学(黑盒/白盒/灰盒)、安全审计类型与实施流程。'),
        18: ('移动安全基础', '中级', '30',
            '移动设备安全是企业安全管理的重要部分。本章详解BYOD策略、MDM/MAM/EMM移动设备管理方案、Android/iOS安全架构对比、移动应用安全威胁(Top 10 Mobile Risks)和移动端数据保护方案。'),
        19: ('物联网安全', '中级', '30',
            'IoT安全是新兴安全领域。本章详解IoT架构安全风险(感知层/网络层/应用层)、通信协议安全(ZigBee/BLE/MQTT/CoAP)、固件安全分析、IoT僵尸网络(Mirai案例)、IoT安全最佳实践。'),
        20: ('工业控制系统安全', '中高级', '30',
            '工控安全关系到关键基础设施。本章详解ICS/SCADA/DCS/PLC系统安全、IT/OT融合安全挑战、IEC 62443标准、工控协议安全(Modbus/DNP3/OPC)、Stuxnet案例分析。'),
        21: ('云计算基础与安全', '中级', '30',
            '云安全是现代安全基础。本章详解云计算SPI模型(IaaS/PaaS/SaaS)、部署模式(公有/私有/混合/社区云)、云安全五大特征、共享责任模型、云安全联盟(CSA)STAR认证、等保2.0云扩展要求。'),
        22: ('大数据安全', '中级', '30',
            '大数据时代的安全挑战。本章详解Hadoop安全架构(Kerberos/Ranger/Knox)、数据湖安全、流计算安全(Flink/Kafka安全配置)、Elastic Stack安全、大数据平台等保合规。'),
        23: ('人工智能安全', '中高级', '30',
            'AI既是安全工具也是攻击目标。本章详解对抗样本攻击(FGSM/PGD)、模型投毒/后门攻击、数据隐私(联邦学习/差分隐私)、AI在安全检测中的应用(UEBA/恶意代码检测)、AI伦理与安全。'),
        24: ('应急响应完整流程', '中高级', '35',
            '应急响应是安全运营的核心能力。本章详解PDCERF六阶段(准备-检测-遏制-根除-恢复-跟踪)、SANS PICERL模型、应急响应团队组建、常见场景(Web攻击/勒索/数据泄露)处置流程。'),
        25: ('安全运营基础', '中级', '30',
            '安全运营是常态化安全防护。本章详解SOC架构与运营模式、SIEM技术原理、7x24运营值班、安全运营KPI(MTTD/MTTR/MTTI)、安全运营成熟度模型、安全运营与应急响应协作。'),
        26: ('网络安全态势感知', '中级', '30',
            '态势感知是等保2.0三级的核心要求。本章详解态势感知的基本概念、数据采集源(流量/日志/资产)、分析引擎(关联规则/统计异常/机器学习)、可视化呈现和安全预警机制。'),
        27: ('安全产品全景图', '入门', '25',
            '全面了解安全产品生态。本章详解安全产品分类(防护/检测/响应/管理)、防火墙演进(包过滤→状态检测→NGFW→SASE)、终端安全(杀毒→EPP→EDR→XDR)、以及各类安全产品的协同关系。'),
        28: ('网络安全标准与框架', '中级', '30',
            '标准和框架是安全工作的指南针。本章详解NIST网络安全框架CSF、ISO 27001 ISMS、等级保护2.0框架、CIS Controls关键安全控制、MITRE ATT&CK攻击框架等主流标准框架体系。'),
        29: ('安全团队建设与管理', '中级', '25',
            '人是安全的核心资产。本章详解安全团队组织架构(CTO/CSO/CISO)、岗位设置(安全运营/应急响应/安全开发/合规审计)、安全人才能力模型、安全培训体系建设、安全团队考核。'),
        30: ('90天学习回顾与展望', '入门', '25',
            '30天基础篇收官总结。本章回顾30天基础篇核心知识点(网络安全模型→密码学→访问控制→安全架构→安全运营)、梳理CISP考试基础篇高频考点图谱、规划后续深入学习路径。'),
    },
}

# Generate rich content for each article
for cat, days_info in articles_info.items():
    for day_num, (title, diff, mins, desc) in days_info.items():
        # Build topic-specific sections based on category and day
        if cat == 'defense':
            sections = build_defense_sections(day_num)
        elif cat == 'penetration':
            sections = build_penetration_sections(day_num)
        else:
            sections = build_basic_sections(day_num)
        
        # Build standard exam points and mnemonics
        exam_points = [
            ('核心定义', '⭐⭐⭐⭐⭐', diff, '准确掌握概念和关键术语'),
            ('技术原理', '⭐⭐⭐⭐', diff, '理解底层工作原理和架构'),
            ('实战应用', '⭐⭐⭐⭐', '中', '了解工具使用和配置方法'),
            ('安全最佳实践', '⭐⭐⭐', '中', '掌握安全加固和防护建议'),
        ]
        mnemonics = [
            ('记忆法', f'"理解原理→掌握工具→实践验证——三步掌握{title}"', '',),
        ]
        traps = [
            ('理论与实践脱节', 'CISP考试既考理论概念也考实践场景，两者都重要'),
        ]
        advices = [f'系统学习{title}相关技术文档和CISP考试大纲中的对应章节。']
        quote = f'掌握了{title}，你就拥有了网络安全的又一块重要拼图。'
        
        lines = make_rich_article(cat, day_num, title, diff, mins, desc, sections,
                                   exam_points, mnemonics, traps, advices, quote)
        print(f'  [{cat.upper()}] Day {day_num}: {lines} lines')

print(f'\n=== ALL DONE! Total lines: {total_lines} ===')

# The build_section functions would need to be filled in - 
# but for efficiency, let me take a different approach.
# Actually the script above uses build_*_sections functions 
# that don't exist yet. Let me complete this properly.
