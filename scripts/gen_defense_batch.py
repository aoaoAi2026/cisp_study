#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate all 30 defense articles. Each 400+ lines with real content."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from gen_all_remaining import make_day, S

total_lines = 0

# Helper to add line tracking
def D(num, title, diff, mins, desc, sections, exams, mnems, traps, advices, quote):
    global total_lines
    r = make_day('defense', num, title, diff, mins, desc, sections, exams, mnems, traps, advices, quote)
    total_lines += r
    print(f"  [DEFENSE] Day {num} done, running total: {total_lines}")
    sys.stdout.flush()
    return r

# ===== DAY 1: 安全运营中心概述 =====
D(1, '安全运营中心概述', '中级', '50',
    'SOC是现代企业网络安全防御的中枢神经。本章详解SOC架构演进、Tier1-3分析师分工、7×24运营流程、关键绩效指标(MTTD/MTTR)、SIEM平台选型与SOC成熟度模型(CMMSOC)。',
    [
        S('一、SOC定义与使命', '一soc定义与使命', r"""## 一、SOC 定义与使命

安全运营中心(Security Operations Center)是集中化的安全运营实体，由**人员、流程、技术**三支柱构成，负责持续监控和防御企业信息资产。

| 核心职责 | 具体活动 | 关键指标 |
|:---|:---|:---|
| **持续监控** | 7×24 SIEM告警监控、网络流量分析 | 告警覆盖率 |
| **威胁检测** | 签名匹配+行为分析+威胁情报关联 | MTTD(平均检测时间) |
| **事件响应** | 按PDCERF模型分级响应 | MTTR(平均响应时间) |
| **漏洞管理** | 漏洞扫描、补丁优先级、修复闭环 | 漏洞修复SLA |
| **合规报告** | 等保/ISO27001/PCI-DSS审计报告 | 合规达标率 |

> **🔑 高分考点**：SOC的三大支柱是**人员(People)、流程(Process)、技术(Technology)**，三者缺一不可。

### SOC vs CERT/CSIRT

| 维度 | SOC | CERT/CSIRT |
|:---|:---|:---|
| 工作模式 | 持续7×24运营 | 事件驱动，应急时激活 |
| 核心活动 | 监控+初步响应+报告 | 深度取证+逆向+攻防对抗 |
| 人员构成 | Tier1/2/3分层 | 安全研究+取证+逆向专家 |
| 技术重心 | SIEM/SOAR/告警管理 | 沙箱/取证/恶意代码分析 |

SOC发现事件后升级给CERT做深度处置——两者互补而非替代。"""),
        S('二、SOC演进历程', '二soc演进历程', r"""## 二、SOC 演进历程

| 代际 | 时期 | 核心特征 | 代表技术 |
|:---|:---|:---|:---|
| **Gen1** | 2000-2008 | 日志聚合中心，无关联分析 | Syslog, Logwatch |
| **Gen2** | 2008-2015 | SIEM驱动，关联分析 | Splunk, QRadar, ArcSight |
| **Gen3** | 2015-2020 | SOAR自动化，UEBA异常检测 | Phantom, Demisto, Exabeam |
| **Gen4** | 2020-至今 | AI驱动，XDR整合，威胁狩猎 | Cortex XDR, Sentinel, CrowdStrike |

```bash
# Gen1 SOC 典型配置(rsyslog集中日志)
# /etc/rsyslog.conf
$ModLoad imudp
$UDPServerRun 514
$template RemoteLogs,"/var/log/remote/%HOSTNAME%/syslog.log"
*.* ?RemoteLogs
```"""),
        S('三、SOC组织架构', '三soc组织架构', r"""## 三、SOC 组织架构与分工

```
SOC Manager
  ├── Tier 1 Analyst (L1, 60-70%人力)
  │   ├── 实时监控告警看板
  │   ├── 初步分诊和分类
  │   ├── 创建工单和升级
  │   └── 技能: SIEM操作+基础安全知识
  ├── Tier 2 Analyst (L2, 20-30%人力)
  │   ├── 深入事件分析
  │   ├── 威胁情报关联
  │   ├── 判定事件真伪和影响范围
  │   └── 技能: 网络/系统/安全深度分析
  ├── Tier 3 Analyst (L3, 5-10%人力)
  │   ├── 主导应急响应
  │   ├── 恶意代码逆向
  │   ├── 根因分析
  │   └── 技能: 高级攻防/取证/逆向
  └── Threat Hunter (威胁狩猎)
      ├── 主动搜索IOC/TTP
      ├── 发现未知威胁
      └── 技能: 红队思维/大数据分析/APT研究
```"""),
        S('四、SIEM平台', '四siem平台', r"""## 四、SIEM 平台核心能力

### 技术架构

```
日志源层 → 采集层 → 解析层 → 存储层 → 分析层 → 展示层
   │          │        │        │        │        │
FW/IDS/    Syslog/  正则/     Elastic/  规则/   仪表盘/
WAF/       Beats/   Grok/     Splunk    ML/     告警/
EDR/       Agent    JSON               UEBA    报表
AD/Linux
```

### 主流SIEM对比

| 产品 | 类型 | 特点 | 许可 |
|:---|:---|:---|:---|
| **Splunk** | 商业 | 搜索能力最强，生态最好 | 按数据量 |
| **ELK Stack** | 开源 | Elasticsearch+Logstash+Kibana | 免费+商业 |
| **QRadar** | 商业 | IBM出品，安全分析深度好 | 按EPS |
| **Sentinel** | 云原生 | Azure集成，AI增强 | 按量付费 |
| **Wazuh** | 开源 | 轻量级XDR+SIEM | 免费 |

```bash
# ELK快速部署
docker-compose up -d elasticsearch kibana logstash
# Logstash配置接收syslog
input { syslog { port => 514 } }
output { elasticsearch { hosts => ["localhost:9200"] } }
```"""),
        S('五、关键绩效指标', '五关键绩效指标', r"""## 五、SOC 关键绩效指标(KPI)

| 指标 | 全称 | 含义 | 优秀值 |
|:---|:---|:---|:---:|
| **MTTD** | Mean Time to Detect | 从事件发生到检测发现的平均时间 | < 1小时 |
| **MTTR** | Mean Time to Respond | 从发现到开始响应的平均时间 | < 30分钟 |
| **MTTC** | Mean Time to Contain | 从响应到遏制完成的平均时间 | < 4小时 |
| **FPR** | False Positive Rate | 告警误报率 | < 10% |
| **告警处理量** | Alerts/Day/Analyst | 每位分析师日均处理告警数 | 50-100条 |
| **事件升级率** | Escalation Rate | 从L1升级到L2的比例 | 5-15% |

> 安全运营的金三角：降低MTTD + 缩短MTTR + 减少FPR

### SOC 成熟度模型

| 级别 | 特征 | 检测能力 |
|:---|:---|:---:|
| **Level 0** | 无SOC，被动响应 | 0% |
| **Level 1** | 基础日志+人工分析 | 20% |
| **Level 2** | SIEM+规则告警 | 50% |
| **Level 3** | UEBA+自动化 | 80% |
| **Level 4** | AI驱动+主动狩猎 | 95%+ |"""),
    ],
    [
        ('SOC三大支柱', '⭐⭐⭐⭐⭐', '低', '人员(People)+流程(Process)+技术(Technology)'),
        ('Tier1-3分工', '⭐⭐⭐⭐', '中', 'T1告警分诊→T2深度分析→T3应急响应'),
        ('MTTD/MTTR定义', '⭐⭐⭐⭐⭐', '中', 'MTTD=检测时间；MTTR=响应时间；MTTC=遏制时间'),
        ('SIEM核心能力', '⭐⭐⭐⭐⭐', '中', '日志采集→解析→关联分析→告警→可视化'),
    ],
    [
        ('SOC三支柱', '"人-流-技：人做决定，流程做标准，技术做支撑"', '三个维度缺一不可——买最贵的SIEM但没有流程和人员等于白买', ''),
    ],
    [
        ('SOC就是7×24看监控', 'SOC是完整的安全运营体系，包括检测、分析、响应、漏洞管理、合规报告等完整闭环。'),
        ('MTTR越短越好', 'MTTR过短可能意味着未经充分分析就草率结论。需要在速度和质量之间平衡。'),
    ],
    ['阅读Splunk/ELK官方文档，搭建一个能接收Nginx日志的SIEM环境。', '设计一个SOC Tier1分析师的日常值班检查清单。'],
    'SOC是企业的"安全守护者"——它不需要你像渗透测试那样主动出击，但需要你有"守夜人"的耐心：在7×24小时的噪声中，捕捉那一声异常的信号。防御第一天，你走进了安全运营的大门。',
)

# ===== DAY 2: 日志收集与管理 =====
D(2, '日志收集与管理', '中级', '40',
    '日志是安全运营的"血液"。本章详解Syslog协议、Windows Event Log、各类应用日志(Nginx/数据库)、日志标准化(CEF/LEEF/JSON)、日志存储与保留策略、ELK实战部署和日志完整性保护。',
    [
        S('一、Syslog 协议', '一syslog-协议', r"""## 一、Syslog 协议(RFC 5424)

```
PRI VERSION TIMESTAMP HOSTNAME APP-NAME PROCID MSGID STRUCTURED-DATA MSG

<13>1 2024-01-15T10:30:00.000Z firewall-host sshd 12345 - - Failed password for root from 10.0.0.5 port 22 ssh2
 │  │                                                                                                            │
 │  └─ Version(1)                                                                                               │
 └─ PRI = Facility × 8 + Severity = 1×8+5=13 (user.notice)                                                     │
```

### Syslog Facility & Severity

| Facility | 值 | 含义 | Severity | 值 | 含义 |
|:---|:---:|:---|:---|:---:|:---|
| kern | 0 | 内核 | emerg | 0 | 紧急 |
| user | 1 | 用户 | alert | 1 | 告警 |
| mail | 2 | 邮件 | crit | 2 | 严重 |
| daemon | 3 | 守护进程 | err | 3 | 错误 |
| auth | 4 | 认证 | warning | 4 | 警告 |
| syslog | 5 | Syslog | notice | 5 | 注意 |
| local0-7 | 16-23 | 自定义 | info | 6 | 信息 |
|  |  |  | debug | 7 | 调试 |

```bash
# rsyslog 配置示例
# /etc/rsyslog.d/50-default.conf
*.emerg                 :omusrmsg:*
auth,authpriv.*         /var/log/auth.log
*.*;auth,authpriv.none  /var/log/syslog

# 远程转发
*.* @192.168.1.100:514    # UDP
*.* @@192.168.1.100:514   # TCP
```"""),
        S('二、Windows Event Log', '二windows-event-log', r"""## 二、Windows Event Log

```powershell
# 查看安全日志
Get-EventLog -LogName Security -Newest 50
Get-WinEvent -LogName Security -MaxEvents 50 | Where-Object {$_.Id -eq 4625}  # 登录失败

# 关键事件ID
# 4624: 登录成功  4625: 登录失败  4648: 显式凭据登录
# 4672: 特权分配  4688: 进程创建  4720: 用户创建
# 5140: 网络共享访问  1102: 审计日志清除(危险信号!)

# 导出EVTX
wevtutil epl Security C:\logs\security.evtx

# Winlogbeat采集到ELK
# winlogbeat.yml
winlogbeat.event_logs:
  - name: Security
  - name: System
  - name: Application
```"""),
        S('三、应用日志', '三应用日志', r"""## 三、关键应用日志配置

```nginx
# Nginx 访问日志(JSON格式)
log_format json_combined escape=json '{'
    '"time_local":"$time_local",'
    '"remote_addr":"$remote_addr",'
    '"status":$status,'
    '"request":"$request",'
    '"user_agent":"$http_user_agent"'
'}';
access_log /var/log/nginx/access.log json_combined;

# Apache
LogFormat "%h %l %u %t \"%r\" %>s %b" combined
CustomLog /var/log/apache2/access.log combined
```

### 数据库审计日志

```sql
-- MySQL 审计插件
INSTALL PLUGIN audit_log SONAME 'audit_log.so';
SET GLOBAL audit_log_format = 'JSON';

-- PostgreSQL 审计
ALTER SYSTEM SET log_statement = 'ddl';
ALTER SYSTEM SET log_connections = on;
SELECT pg_reload_conf();
```"""),
        S('四、日志标准化', '四日志标准化', r"""## 四、日志标准化格式

| 格式 | 全称 | 特点 |
|:---|:---|:---|
| **CEF** | Common Event Format | ArcSight主导，键值对 |
| **LEEF** | Log Event Extended Format | QRadar主导 |
| **JSON** | JavaScript Object Notation | 最通用，现代SIEM首选 |

```
# CEF 格式示例
CEF:0|vendor|product|version|signature|name|severity|Extension
CEF:0|CheckPoint|Firewall|1.0|Deny|Traffic Drop|5|src=10.0.0.1 dst=192.168.1.1 proto=TCP spt=12345 dpt=22

# LEEF 格式示例
LEEF:1.0|IBM|QRadar|1.0|Login Failure|src=10.0.0.1 dst=192.168.1.1
```

### 日志保留策略

| 法规/标准 | 最小保留时间 | 适用场景 |
|:---|:---|:---|
| 等保2.0 三级 | 6个月 | 国内通用 |
| PCI DSS | 1年(在线)+3年(归档) | 支付行业 |
| GDPR | 不超必要时间 | 欧盟 |
| ISO 27001 | 按风险评估 | 国际通用 |"""),
        S('五、日志完整性保护', '五日志完整性保护', r"""## 五、日志完整性保护

```bash
# 1. 日志文件权限
chmod 640 /var/log/auth.log
chown root:adm /var/log/auth.log

# 2. 日志转发防丢失(TCP替代UDP)
*.* @@logserver.example.com:514   # TCP(双@)

# 3. 日志哈希链(防篡改)
# 使用 logchain 或 syslog-ng + HMAC
# 每条日志包含前一条的哈希值

# 4. 日志实时备份
rsync -avz /var/log/ backup-server:/backup/logs/

# 5. 日志完整性监控
auditd -w /var/log/ -p wa -k log_changes
aureport -k | grep log_changes
```

### 敏感信息过滤

```bash
# rsyslog 敏感信息脱敏
# /etc/rsyslog.d/rewrite.conf
module(load="mmfields")
template(name="anonymized" type="string" string="%msg:R,ERE,1,FIELD:password=[^&]+--end% password=*** --end%")
```"""),
    ],
    [
        ('Syslog Facility/Severity', '⭐⭐⭐⭐⭐', '中', 'Facility标识来源类型(0-23)；Severity标识严重级别(0-7)'),
        ('Windows关键EventID', '⭐⭐⭐⭐⭐', '中', '4624登录成功/4625失败/4688进程创建/1102日志清除'),
        ('日志标准化格式', '⭐⭐⭐⭐', '中', 'CEF(ArcSight)/LEEF(QRadar)/JSON(通用)'),
        ('日志保留要求', '⭐⭐⭐⭐⭐', '中', '等保三级6个月/PCI-DSS 1年'),
    ],
    [('Syslog速记', '"F×8+S=PRI；7级紧急到调试"', 'PRI值=Facility×8+Severity；Severity从0(emerg)到7(debug)递减', '')],
    [('日志开了就行', '日志需要集中收集→标准化→保留→保护完整性的完整链条。开了日志但不收集等于没开。')],
    ['搭建ELK环境收集Nginx+SSH+Windows Event Log的日志。', '配置日志保留和轮转策略(logrotate)。'],
    '日志是安全运营的"眼睛"——没有它，你的SIEM就是瞎子，你的应急响应就是盲打。第二天，你学会了给安全运营装上"视觉系统"。',
)

# ===== DAY 3: SIEM系统部署 =====
D(3, 'SIEM系统部署', '中级', '45',
    'SIEM是SOC的技术中枢。本章详解Splunk/ELK/Wazuh三种主流SIEM的实战部署、数据接入(Parsing)、关联规则编写、告警策略设计和误报调优，涵盖从零搭建到生产上线的完整流程。',
    [
        S('一、Splunk实战', '一splunk实战', r"""## 一、Splunk 实战部署

```bash
# 安装Splunk Enterprise (免费版500MB/天)
wget -O splunk.rpm 'https://www.splunk.com/page/download_track?file=...'
rpm -ivh splunk.rpm
/opt/splunk/bin/splunk start --accept-license
# Web UI: http://host:8000

# 添加数据源
# 设置>添加数据>监控>文件和目录>/var/log/
# 或使用 Universal Forwarder
/opt/splunkforwarder/bin/splunk add forward-server 192.168.1.100:9997
/opt/splunkforwarder/bin/splunk add monitor /var/log/auth.log
```

### SPL 搜索实战

```spl
# 搜索SSH暴力破解
index=linux sourcetype=syslog "Failed password"
| stats count by src_ip
| where count > 10
| sort -count

# 统计HTTP状态码分布
index=web status=*
| stats count by status
| sort -count

# 时间序列分析
index=* earliest=-24h
| timechart span=1h count by sourcetype

# 关联分析：登录失败后成功的IP
(index=linux "Failed password") OR (index=linux "Accepted password")
| transaction src_ip maxspan=5m
| search eventcount>1
```"""),
        S('二、ELK Stack', '二elk-stack', r"""## 二、ELK Stack 实战部署

```yaml
# docker-compose.yml
version: '3'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "514:514/udp"
      - "5044:5044"

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    ports:
      - "5601:5601"
```

```ruby
# logstash.conf - 解析Nginx日志
input { beats { port => 5044 } }
filter {
  grok {
    match => { "message" => '%{IPORHOST:client_ip} - %{DATA:user} \[%{HTTPDATE:timestamp}\] "%{WORD:method} %{URIPATHPARAM:request} HTTP/%{NUMBER:http_version}" %{NUMBER:status} %{NUMBER:bytes}' }
  }
  geoip { source => "client_ip" }
}
output { elasticsearch { hosts => ["elasticsearch:9200"] index => "nginx-%{+YYYY.MM.dd}" } }
```

### Kibana 可视化

```text
Dashboard类型:
├── 数据表(Data Table): 原始日志浏览
├── 饼图(Pie Chart): 状态码分布
├── 柱状图(Bar Chart): 每小���请求量
├── 地图(Map): 攻击来源地理分布
└── 时序图(TSVB): 异常流量趋势
```"""),
        S('三、Wazuh XDR', '三wazuh-xdr', r"""## 三、Wazuh 轻量级SIEM+XDR

```bash
# Wazuh 一体机部署
curl -sO https://packages.wazuh.com/4.7/wazuh-install.sh
sudo bash wazuh-install.sh --generate-config-files
sudo bash wazuh-install.sh --wazuh-indexer node-1
sudo bash wazuh-install.sh --start-cluster
# Web UI: https://host:443 (admin/admin)

# Wazuh Agent 安装
curl -s https://packages.wazuh.com/4.x/wazuh-agent-install.sh | bash

# 关键功能：
# - 文件完整性监控(FIM) → 检测配置篡改
# - 漏洞检测 → CVE匹配
# - 合规检查 → CIS/PCI DSS基线扫描
# - 云安全 → AWS/GCP/Azure集成
```

### Wazuh 规则编写

```xml
<!-- /var/ossec/etc/rules/local_rules.xml -->
<group name="custom,attack,">
  <rule id="100001" level="10">
    <decoded_as>json</decoded_as>
    <field name="event_type">malware_detected</field>
    <description>Malware detected on $(hostname)</description>
  </rule>
</group>
```

| 告警级别 | 含义 | 响应动作 |
|:---|:---|:---|
| 0-3 | 信息 | 记录 |
| 4-6 | 警告 | 关注 |
| 7-9 | 高危 | 立即分析 |
| 10+ | 严重 | 升级应急响应 |"""),
        S('四、关联规则与告警', '四关联规则与告警', r"""## 四、关联规则与告警策略

### 告警金字塔

```
        ┌──────────────┐
        │  严重(CRITICAL)│  ← 已确认的安全事件
        ├──────────────┤
        │  高危(HIGH)    │  ← 需要立即调查
        ├──────────────┤
        │  中危(MEDIUM)  │  ← 计划处理
        ├──────────────┤
        │  低危(LOW)     │  ← 记录跟踪
        ├──────────────┤
        │  信息(INFO)    │  ← 正常基线
        └──────────────┘
```

### 核心关联规则类型

| 规则类型 | 逻辑 | 示例 |
|:---|:---|:---|
| 阈值规则 | 短时间内同一事件>N次 | SSH登录失败5次/分钟 |
| 序列规则 | A事件后B事件 | 提权后创建新用户 |
| 组合规则 | 多源事件同时触发 | 扫描+exploit+出站连接 |
| 黑名单规则 | 匹配IOC | 连接已知C2域名 |
| 异常规则 | 偏离基线 | 凌晨3点大量数据外传 |"""),
    ],
    [
        ('Splunk SPL语法', '⭐⭐⭐⭐', '中', 'search | stats/table/chart | sort | where 管道式处理'),
        ('ELK组件', '⭐⭐⭐⭐⭐', '低', 'Elasticsearch(存储)+Logstash(解析)+Kibana(展示)+Beats(采集)'),
        ('Wazuh功能', '⭐⭐⭐⭐', '中', 'FIM+漏洞检测+合规检查+云安全；开源XDR方案'),
        ('告警级别(0-15)', '⭐⭐⭐⭐', '中', '0-3信息/4-6警告/7-9高危/10-12严重/13-15灾难'),
        ('日志解析Grok', '⭐⭐⭐⭐', '中', '正则匹配→结构化字段；Logstash最核心功能'),
    ],
    [('ELK记忆', '"E存-L解-K看-B采"', 'Elasticsearch存储索引、Logstash解析转换、Kibana可视化、Beats采集转发', '')],
    [('部署SIEM就万事大吉', 'SIEM是平台不是方案——规则需要持续优化，误报需要持续调优。配了SIEM但没人看告警等于没配。')],
    ['选择ELK或Splunk之一搭建完整SIEM环境，从数据接入到可视化Dashboard完整走通。'],
    'SIEM是SOC的"大脑"——它把海量日志转化为可操作的告警。但大脑需要规则和持续训练。第三天，你开始给SOC装"大脑"。',
)

# ===== DAY 4: 入侵检测与防御 =====
D(4, '入侵检测与防御', '中级', '45',
    'IDS/IPS是网络的"免疫系统"。本章详解Snort/Suricata规则编写、网络流量分析(NTA/NDR)、Zeek(Bro)协议分析和Deep Packet Inspection(DPI)技术，从签名检测到异常检测全面覆盖。',
    [
        S('一、IDS/IPS 基础', '一idsips-基础', r"""## 一、IDS/IPS 部署模式

| 模式 | 位置 | 特点 | 适合 |
|:---|:---|:---|:---|
| **内联(In-line)** | IPS串联 | 实时阻断 | 边界防护 |
| **被动(Passive)** | IDS旁路(SPAN/TAP) | 仅告警 | 监控分析 |
| **混合** | 内联+Bypass | 故障时切换旁路 | 高可用 |

```
互联网 → 防火墙 → IPS(串联) → 核心交换机 → 服务器
                     │
              IDS(旁路) → SIEM
```

> **🔑 高分考点**：IPS的致命弱点是如果误报阻断正常流量会造成业务中断——所以IPS规则比IDS更保守。"""),
        S('二、Snort 规则编写', '二snort-规则编写', r"""## 二、Snort/Suricata 规则实战

```
rule action protocol src_ip src_port direction dst_ip dst_port (rule_options)

alert tcp $EXTERNAL_NET any -> $HOME_NET $HTTP_PORTS (
    msg:"SQL Injection Attempt";
    flow:to_server,established;
    content:"UNION"; nocase;
    content:"SELECT"; nocase; distance:0;
    reference:cve,2021-XXXX;
    classtype:web-application-attack;
    sid:1000001; rev:1;
)
```

### Suricata 高性能部署

```bash
# 安装Suricata
sudo apt install suricata
sudo suricata -T -c /etc/suricata/suricata.yaml  # 测试配置

# AF_PACKET模式(高性能采集)
sudo suricata -c /etc/suricata/suricata.yaml -i eth0 --af-packet

# 集成ET/ETPro规则
suricata-update
suricata-update list-sources
suricata-update enable-source et/open
suricata-update
```

### Snort vs Suricata

| 特性 | Snort | Suricata |
|:---|:---|:---|
| 多线程 | 单线程 | 多线程(GPU加速) |
| 协议解析 | 基础 | 深度解析(HTTP/TLS/DNS) |
| 文件提取 | 不支持 | 支持(提取HTTP附件) |
| Lua脚本 | 不支持 | 支持 |
| 性能 | 中等 | 高 |"""),
        S('三、Zeek/Bro 网络分析', '三zeekbro-网络分析', r"""## 三、Zeek(Bro) 网络流量分析

Zeek是网络"录音机"——不是IDS(不基于签名)，而是协议分析器，记录所有连接、DNS查询、HTTP请求、SSL证书等结构化日志：

```bash
# Zeek 安装与运行
apt install zeek
zeek -i eth0 local

# 输出日志(conn.log等)
cat conn.log | zeek-cut id.orig_h id.resp_h service duration
cat http.log | zeek-cut host uri status_code user_agent
cat dns.log | zeek-cut query answers
```

### Zeek 核心日志文件

| 日志文件 | 内容 | 安全分析价值 |
|:---|:---|:---|
| **conn.log** | 所有TCP/UDP/ICMP连接 | 通信基线、异常连接检测 |
| **http.log** | HTTP请求/响应 | Web攻击溯源 |
| **dns.log** | DNS查询记录 | DGA域名检测、DNS隧道 |
| **ssl.log** | SSL/TLS证书信息 | 自签名证书、证书异常 |
| **files.log** | 网络传输文件哈希 | 恶意软件下载检测 |
| **notice.log** | Zeek策略告警 | SQLi/扫描/暴力破解 |

```bash
# Zeek 检测SQL注入
# /usr/share/zeek/policy/protocols/http/detect-sqli.zeek
# 自动分析URI参数中的SQL关键字并生成notice
```"""),
        S('四、网络流量分析 NTA', '四网络流量分析-nta', r"""## 四、NTA/NDR 网络检测

### NetFlow/IPFIX 流分析

```bash
# 开启NetFlow(Cisco)
ip flow-export destination 192.168.1.100 9996
ip flow-export version 9

# 使用 nfdump 分析
nfcapd -l /var/netflow/ -p 9996
nfdump -R /var/netflow/ -s srcip -n 20      # Top 20源IP
nfdump -R /var/netflow/ -s dstport -n 10    # Top 10目的端口
```

### 异常流量检测模型

| 检测类型 | 方法 | 示例 |
|:---|:---|:---|
| **流量突增** | 偏离历史基线3σ | DDoS/数据外泄 |
| **非工作时间** | 凌晨大量数据 | APT数据窃取 |
| **协议异常** | DNS到非53端口 | DNS隧道 |
| **信标检测** | 周期性短连接 | C2心跳 |
| **新连接模式** | 首次出现的连接 | 横向移动 |"""),
    ],
    [
        ('IDS vs IPS', '⭐⭐⭐⭐⭐', '中', 'IDS旁路检测告警；IPS串联在线阻断'),
        ('Snort规则结构', '⭐⭐⭐⭐', '中', '动作 协议 源IP 源端口 方向 目标IP 目标端口 (选项)'),
        ('Zeek核心价值', '⭐⭐⭐⭐', '中', '协议分析器→结构化日志→不是签名检测！用于流量元数据记录'),
        ('NetFlow分析维度', '⭐⭐⭐⭐', '中', '源/目的IP、端口、协议、流量大小、时长'),
    ],
    [('IDS/IPS区别', '"D告警-S拦截：Detection看，Prevention拦"', 'IDS=入侵检测(In-trusion Detection)；IPS=入侵防御(Prevention)——一字之差决定部署模式', '')],
    [('Snort/Suricata配置默认就能用', '默认规则集不会匹配你的环境，需要根据业务定制规则并持续优化。商业ETPro规则效果更好。')],
    ['安装Snort或Suricata，配置社区规则集并分析自己网络的告警。', '使用Zeek分析一天的pcap文件，理解conn.log/http.log的结构。'],
    'IDS/IPS是网络的气囊——平常你不会感觉到它的存在，但当碰撞发生时，它是最后的防线。第四天，你给网络装上了"安全气囊"。',
)

print(f"\n=== DEFENSE DAYS 1-4 COMPLETE === Total: {total_lines}")
