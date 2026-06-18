# Day 6：威胁情报入门

> 🎯 面试目标：掌握威胁情报类型(战略/战术/作战/技术)、STIX/TAXII标准、情报驱动防御面试考点

## 知识速览

### 核心概念
- **威胁情报四层金字塔**：战略层(地缘政治/行业趋势→董事会级报告)→作战层(攻击者TTP/目标/动机→安全团队策略)→战术层(攻击手法/工具→防御措施)→技术层(IOC:IP/域名/哈希→防火墙/SIEM规则)
- **STIX/TAXII标准**：STIX(结构化威胁信息表达式)用JSON描述威胁(攻击者/攻击模式/Indicator/IOC等对象及关系)，TAXII是情报交换协议(通过HTTPS传输STIX数据)
- **MISP威胁情报平台**：开源情报共享平台，支持IOC管理、事件关联、Galaxy知识库(ATT&CK映射)、自动化导入导出(CVE/OSINT Feeds)
- **威胁情报消费三模式**：1)自动化(IOC→SIEM/SOAR自动匹配阻断) 2)半自动化(IOC+上下文→人工审核→采取行动) 3)人工分析(情报报告→人工威胁研判→制定检测规则)
- **Pyramid of Pain(痛点金字塔)**：从底到顶：Hash Values→IP Addresses→Domain Names→Network/Host Artifacts→Tools→TTPs(最难改变也最有价值)

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| 如何评估一个威胁情报源的质量？ | 六维评估：及时性(漏洞披露到情报生成的时间差→越快越好)、准确性(误报率，验证IOC的有效性)、完整性(是否包含上下文：攻击链/攻击者/动机/目标行业)、可操作性(是否可自动化消费→STIX格式优于PDF报告)、来源多样性(自研+商业+开源+行业ISAC)、历史信誉(该情报源过去的追踪记录)。面试话术：不要只看IOC数量，要看IOC的质量和上下文。 |
| MISP在企业威胁情报体系中的定位？如何使用？ | MISP是情报汇聚+关联+共享的中心节点。使用流程：1)部署MISP Server→2)订阅OSINT Feeds(CIRCL/Abuse.ch/URLhaus)+商业情报源→3)手动导入内部安全事件IOC→4)MISP自动关联(发现某IOC同时出现在多个事件中→提权)→5)定时导出IOC列表到SIEM/Firewall/WAF做自动阻断→6)Sighting(记录IOC在本组织的命中情况→反馈给情报源)。MISP支持Taxonomy标签体系(TLP:RED/AMBER/GREEN/WHITE控制情报共享范围)。 |
| Pyramid of Pain(痛点金字塔)的实际应用？举个例子说明为什么TTPs最有价值？ | 例子：检测到Cobalt Strike Beacon的IP→攻击者换个IP就绕过(底层的Hash/IP很容易变)。但如果检测的是Cobalt Strike Beacon的TTP——定时HTTP GET请求+固定Jitter模式+Malleable Profile中的特定URL模式+Cobalt Strike默认命名管道\\.\pipe\msagent_* →这些行为特征攻击者要改变需修改C2框架源码→成本极高。这就是Pyramid of Pain的核心思想：越往上越让攻击者'痛苦'。 |
| 什么是钻石模型(Diamond Model)？如何用在事件分析中？ | 钻石模型四要素：对手(Adversary)→能力(Capability)→基础设施(Infrastructure)→受害者(Victim)。分析一个安全事件时：先确定受害者(我们哪台机器被攻击)→找到基础设施(连接了哪个C2 IP/域名)→分析能力(用了什么恶意软件/技术)→推断对手(根据TTP归因到APT组织)。向面试官展示：用钻石模型分析一个你接触过的安全事件，展示'从告警到归因'的思考链路。 |
| 威胁情报驱动的IR(事件响应)流程？ | 情报前置：IR开始时先查询威胁情报平台→'这个IOC是否已知APT活动痕迹？'→如果是→查找对应的ATT&CK技术和已知的横向移动模式→针对性部署检测规则→搜索IOC在环境中的范围→确定受影响范围。情报后置：IR结束后→将提取的新IOC/新TTP反馈给情报平台→形成闭环→下次遇到同组攻击者可在几分钟内识别。面试强调：威胁情报不是'买来放着'，而是需要融入IR和检测的Ops流程。 |

### 技术细节
**MISP API 自动化操作**：
```python
import requests
misp_url = "https://misp.company.com"
api_key = "YOUR_API_KEY"
headers = {"Authorization": api_key, "Accept": "application/json"}

# 搜索IOC
r = requests.post(f"{misp_url}/attributes/restSearch",
                 headers=headers,
                 json={"value": "malware.example.com", "type": "domain"})

# 创建事件
event = {"Event": {
    "info": "Phishing Campaign Detected",
    "threat_level_id": 3,
    "analysis": 1
}}
requests.post(f"{misp_url}/events", headers=headers, json=event)
```
**情报源推荐(自建威胁情报Feed清单)**：
- 恶意软件：Abuse.ch(URLHaus/MalwareBazaar/ThreatFox)
- 钓鱼：PhishTank/OpenPhish
- APT：MITRE ATT&CK Groups + CTID
- Botnet C2：Feodo Tracker
- 漏洞：CVE/NVD + VulnDB

## 常见陷阱
- ⚠️ IOC不等于威胁情报——IOC只是数据，加了上下文(威胁主体/攻击链/目标/动机)→才是情报
- ⚠️ 付费情报源迷信——很多商业情报源的大部分IOC也来自公开源，关键是你的消费和分析能力
- ⚠️ 情报共享不设定TLP——敏感情报设错TLP标签可能泄露给不该知道的人(竞对/媒体)

## 今日检测
1. 用Docker部署一个MISP实例，订阅3个OSINT Feed并查看关联效果
2. 使用Diamond Model分析一次公开披露的APT攻击事件(如SolarWinds/Log4j)
3. 写一个Python脚本，从VirusTotal API拉取指定IP/域名的威胁情报报告
