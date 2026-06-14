# SIEM 日志管理与关联分析实战

> **📘 文档定位**：CISP 考试 安全运营 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 系统讲解 SIEM 平台的日志管理、关联分析规则编写、告警处理流程及 Splunk/ELK 实战配置，是安全运营人员必备的核心技能。

---

## 导航目录

- [一、SIEM 平台架构](#一siem-平台架构)
- [二、日志采集与范式化](#二日志采集与范式化)
- [三、关联分析规则](#三关联分析规则)
- [四、告警管理流程](#四告警管理流程)
- [五、Splunk/ELK 实战](#五splunkelk-实战)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 📋 目录

1. [SIEM 核心原理](#一siem-核心原理)
2. [数据流水线架构](#二数据流水线)
3. [ELK 生产级部署](#三elk-部署)
4. [日志范式化 (ECS)](#四日志范式化)
5. [关键日志源接入配置](#五日志源接入)
6. [关联分析规则编写](#六关联分析规则)
7. [告警质量优化](#七告警质量优化)
8. [Splunk 实战对比](#八splunk-实战)
9. [日志保留与合规](#九日志保留)
10. [完整案例：从零搭建 ELK SIEM](#十完整案例)
11. [排错指南](#十一排错指南)

---

## 一、SIEM 核心原理

### 1.1 SIEM = SEM + SIM + 关联分析

```
SEM (Security Event Management) = 实时告警 + 事件响应
SIM (Security Information Management) = 日志管理 + 合规报告
关联分析 = 跨日志源的关联规则引擎

数据流:
  日志源 → 采集层 → 缓冲层 → 处理层 → 存储层 → 分析层 → 可视化
    ↓        ↓        ↓        ↓        ↓        ↓        ↓
  服务器   Filebeat  Kafka   Logstash   ES集群   Sigma/    Kibana
  防火墙   Winlogbeat Redis  Fluentd  OpenSearch KQL/SPL  Grafana
```

### 1.2 核心组件选型

| 组件 | 开源首选 | 商业首选 | 说明 |
|------|---------|---------|------|
| 采集 | Filebeat | Cribl | 轻量、可靠 |
| 缓冲 | Kafka | Confluent | 削峰填谷 |
| 处理 | Logstash | Cribl Stream | ETL+富化 |
| 存储 | Elasticsearch | Splunk Indexer | 全文搜索 |
| 分析 | ElastAlert/Wazuh | Splunk ES | 规则引擎 |
| 可视化 | Kibana | Splunk Dashboard | 大屏+报表 |

---

## 二、数据流水线架构

### 2.1 生产级架构

```
┌──────────┐   ┌──────────┐   ┌──────────┐
│ 日志源     │   │ 日志源     │   │ 日志源     │
│ Linux     │   │ Windows  │   │ Network  │
└────┬─────┘   └────┬─────┘   └────┬─────┘
     │ Filebeat      │ Winlogbeat   │ Syslog
     ▼               ▼              ▼
┌─────────────────────────────────────────┐
│            Kafka Cluster (3节点)         │
│   Topic: logs-syslog                     │
│   Topic: logs-win-event                  │
│   Topic: logs-network                    │
│   Topic: logs-app                        │
└────────────────┬────────────────────────┘
                 │ Consumer Group
                 ▼
┌─────────────────────────────────────────┐
│         Logstash Pipeline (3节点)        │
│   ├── Input: Kafka                       │
│   ├── Filter: grok + mutate + geoip      │
│   ├── Output: Elasticsearch              │
│   └── Dead Letter Queue: S3/Filesystem    │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│      Elasticsearch Cluster (3+节点)      │
│   Hot (SSD): 7天                         │
│   Warm (HDD): 30天                        │
│   Cold (S3): 90天                         │
│   Frozen (S3): 365天                      │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│              Kibana (2节点)              │
│   ├── Discover (日志搜索)                 │
│   ├── Security → Alerts (告警规则)        │
│   ├── Dashboard (安全大屏)                │
│   └── Reporting (合规报告)                │
└─────────────────────────────────────────┘
```

### 2.2 容量规划

```
日志量估算公式:
  EPS (Events Per Second) = 日志源数量 × 每源EPS

典型EPS:
  Linux 服务器:    50-200 EPS
  Windows 服务器:  100-500 EPS
  防火墙:          500-5000 EPS
  Web 服务器:      100-1000 EPS
  DNS:             50-500 EPS
  交换机:          10-100 EPS

存储估算:
  每条日志平均大小: ~1KB
  日存储 = EPS × 86400 × 1KB
  
  例: 10000 EPS → 864GB/天

ES 集群规格建议:
  EPS        节点数    每节点CPU  每节点内存  存储
  < 5000     3        8核       32GB       SSD 2TB×3
  5k-20k     5        16核      64GB       SSD 4TB×5
  20k-50k    10       16核      128GB      SSD 4TB×10
```

---

## 三、ELK 部署

### 3.1 Docker Compose 快速部署

```yaml
# docker-compose.yml — 生产最小化部署
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.0
    container_name: es01
    environment:
      - node.name=es01
      - cluster.name=soc-es-cluster
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms4g -Xmx4g"
      - xpack.security.enabled=true
      - ELASTIC_PASSWORD=${ES_PASSWORD}
    volumes:
      - es-data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
    ulimits:
      memlock: {soft: -1, hard: -1}
      nofile: {soft: 65536, hard: 65536}

  kibana:
    image: docker.elastic.co/kibana/kibana:8.12.0
    container_name: kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://es01:9200
      - ELASTICSEARCH_USERNAME=elastic
      - ELASTICSEARCH_PASSWORD=${ES_PASSWORD}
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

  logstash:
    image: docker.elastic.co/logstash/logstash:8.12.0
    container_name: logstash
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
      - ./logstash/config/logstash.yml:/usr/share/logstash/config/logstash.yml
    ports:
      - "5044:5044"   # Beats input
      - "5514:5514/udp" # Syslog UDP
      - "6514:6514"     # Syslog TCP+TLS
    depends_on:
      - elasticsearch

volumes:
  es-data:
```

### 3.2 Logstash Pipeline 配置

```ruby
# logstash/pipeline/syslog.conf
input {
  beats {
    port => 5044
    ssl => true
    ssl_certificate => "/etc/logstash/certs/logstash.crt"
    ssl_key => "/etc/logstash/certs/logstash.key"
  }
  syslog {
    port => 5514
  }
  tcp {
    port => 6514
    ssl_enable => true
    ssl_cert => "/etc/logstash/certs/logstash.crt"
    ssl_key => "/etc/logstash/certs/logstash.key"
    codec => json_lines
  }
}

filter {
  # ===== 字段映射到 ECS =====
  mutate {
    rename => {
      "src_ip" => "[source][ip]"
      "dst_ip" => "[destination][ip]"
      "src_port" => "[source][port]"
      "dst_port" => "[destination][port]"
      "hostname" => "[host][name]"
    }
  }
  
  # ===== GeoIP 富化 =====
  geoip {
    source => "[source][ip]"
    target => "[source][geo]"
  }
  
  # ===== 添加本机信息 =====
  mutate {
    add_field => {
      "[event][ingested]" => "%{@timestamp}"
      "[observer][hostname]" => "logstash-01"
    }
  }
  
  # ===== 丢弃调试日志 =====
  if [loglevel] == "DEBUG" {
    drop {}
  }
}

output {
  elasticsearch {
    hosts => ["https://es01:9200"]
    user => "elastic"
    password => "${ES_PASSWORD}"
    ssl => true
    ssl_certificate_verification => false
    index => "logs-%{+YYYY.MM.dd}"
    document_id => "%{[@metadata][fingerprint]}"
    manage_template => true
  }
  
  # 失败队列
  dead_letter_queue {
    path => "/usr/share/logstash/data/dead_letter_queue"
    max_bytes => "1024mb"
  }
}
```

### 3.3 ILM 索引生命周期

```json
// 创建 ILM Policy
PUT _ilm/policy/soc-logs-policy
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_primary_shard_size": "50gb",
            "max_age": "1d"
          }
        }
      },
      "warm": {
        "min_age": "7d",
        "actions": {
          "shrink": { "number_of_shards": 1 },
          "forcemerge": { "max_num_segments": 1 }
        }
      },
      "cold": {
        "min_age": "30d",
        "actions": {
          "searchable_snapshot": {
            "snapshot_repository": "soc-backups"
          }
        }
      },
      "delete": {
        "min_age": "365d",
        "actions": { "delete": {} }
      }
    }
  }
}

// 应用 Policy 到索引模板
PUT _index_template/soc-logs-template
{
  "index_patterns": ["logs-*"],
  "template": {
    "settings": {
      "index.lifecycle.name": "soc-logs-policy",
      "index.lifecycle.rollover_alias": "logs"
    }
  }
}
```

---

## 四、日志范式化 (ECS)

```
ECS (Elastic Common Schema) 核心字段映射：

时间类:
  @timestamp              → 事件发生时间
  event.created           → 日志采集时间
  event.ingested          → 写入ES时间

主机类:
  host.name               → 主机名
  host.ip                 → 主机IP
  host.os.family          → windows/linux
  host.os.version         → 操作系统版本

用户类:
  user.name               → 用户名
  user.domain             → 域
  user.email              → 邮箱

网络类:
  source.ip               → 源IP
  source.port             → 源端口
  destination.ip          → 目标IP
  destination.port        → 目标端口
  network.protocol        → TCP/UDP/HTTP
  network.direction       → inbound/outbound

事件类:
  event.category          → authentication/network/process
  event.type              → start/end/info/error
  event.action            → user-login/file-delete
  event.outcome           → success/failure/unknown

进程类:
  process.pid             → 进程ID
  process.name            → 进程名
  process.command_line    → 命令行
  process.parent.name     → 父进程名

文件类:
  file.path               → 文件路径
  file.name               → 文件名
  file.size               → 文件大小

DNS 类:
  dns.question.name       → 查询域名
  dns.question.type       → A/AAAA/MX/TXT
  dns.response_code       → NOERROR/NXDOMAIN
```

---

## 五、日志源接入

### 5.1 Linux 服务器

```yaml
# /etc/filebeat/filebeat.yml
filebeat.inputs:
  - type: filestream
    id: syslog
    paths:
      - /var/log/syslog
      - /var/log/messages
    tags: ["syslog", "linux"]

  - type: filestream
    id: auth
    paths:
      - /var/log/auth.log
      - /var/log/secure
    tags: ["auth", "linux"]

  - type: filestream
    id: audit
    paths:
      - /var/log/audit/audit.log
    tags: ["audit", "linux"]

output.logstash:
  hosts: ["logstash:5044"]
  ssl.certificate_authorities: ["/etc/filebeat/certs/ca.crt"]
  ssl.certificate: "/etc/filebeat/certs/filebeat.crt"
  ssl.key: "/etc/filebeat/certs/filebeat.key"
```

### 5.2 Windows 服务器

```yaml
# C:\Program Files\Winlogbeat\winlogbeat.yml
winlogbeat.event_logs:
  - name: Security
    level: critical,error,warning,information
    event_id: 
      - 4624,4625,4634,4647,4648    # 登录事件
      - 4720,4722,4723,4724,4725,4726  # 账户管理
      - 4672,4673,4674               # 特权使用
      - 4688,4689                    # 进程创建/终止
      - 4768,4769,4770,4771          # Kerberos
      - 5140,5145                    # SMB共享访问

  - name: System
  - name: Application
  - name: Microsoft-Windows-Sysmon/Operational
  - name: Microsoft-Windows-PowerShell/Operational

output.logstash:
  hosts: ["logstash:5044"]
```

### 5.3 防火墙/FortiGate

```bash
# FortiGate CLI 配置
config log syslogd setting
  set status enable
  set server "10.0.40.10"
  set port 6514
  set mode reliable
  set facility local7
  set format default
end
```

---

## 六、关联分析规则

### 6.1 Wazuh 规则示例

```xml
<!-- /var/ossec/etc/rules/local_rules.xml -->

<group name="soc_bruteforce,">
  <!-- 暴力破解检测: 5次失败/2分钟 -->
  <rule id="100200" level="10" frequency="5" timeframe="120">
    <if_matched_sid>5710</if_matched_sid>
    <same_source_ip />
    <description>SSH Bruteforce: 5 failed logins in 120s</description>
    <group>authentication_failed,</group>
    <mitre>
      <id>T1110</id>
      <tactic>Credential Access</tactic>
    </mitre>
  </rule>
  
  <!-- 暴力破解成功 -->
  <rule id="100201" level="12">
    <if_sid>100200</if_sid>
    <if_matched_sid>5715</if_matched_sid>
    <same_source_ip />
    <description>SSH Bruteforce Success after failed attempts</description>
  </rule>
</group>
```

### 6.2 ElastAlert 规则

```yaml
# elastalert_rules/ssh_bruteforce.yaml
name: SSH Bruteforce
type: frequency
index: logs-*
num_events: 10
timeframe:
  minutes: 5

filter:
  - term:
      event.category: "authentication"
  - term:
      event.outcome: "failure"
  - term:
      event.type: "start"

query_key: source.ip
realert:
  minutes: 30

alert:
  - "email"
  - "thehive"

email:
  - "soc@company.com"

thehive:
  url: "http://thehive:9000"
  api_key: "${THEHIVE_KEY}"
```

### 6.3 Elastic KQL 关联查询

```kql
// 横向移动检测：同一用户短时间内登录多台主机
event.category : "authentication"
AND event.outcome : "success"
AND event.type : "start"
AND NOT user.name : ("SYSTEM", "NETWORK SERVICE")
| stats 
    count_distinct(host.name) as distinct_hosts,
    values(host.name) as host_list
  BY user.name, source.ip
| where distinct_hosts > 5
| sort distinct_hosts desc

// 可疑父子进程链
event.category : "process"
AND process.parent.name : ("winword.exe", "excel.exe", "outlook.exe")
AND process.name : ("powershell.exe", "cmd.exe", "wscript.exe", "mshta.exe")
| table @timestamp, host.name, process.parent.name, process.name, process.command_line
| sort @timestamp desc
```

---

## 七、告警质量优化

```
告警质量度量：

True Positive Rate (真阳性率):
  真正攻击 / 总告警
  目标: > 60%

False Positive Rate (误报率):
  误报 / 总告警  
  目标: < 15%

告警优化周期:
  每月: 审计所有规则的命中率和误报率
  规则优化:
    TPR < 30% → 调整或下线
    FPR > 50% → 加过滤条件或下线
    新规则 → 上线1个月内设为 "仅告警不升级"

白名单管理:
  运维IP段 → 不产生低级别告警
  安全扫描器IP → 白名单
  测试环境 → 降低告警级别
```

---

## 八、Splunk 实战

```
Splunk SPL vs Elastic KQL 对比：

搜索语法:
  Splunk:   index=main sourcetype=linux_secure "Failed password"
  Elastic:  index:main AND event.dataset:linux_secure AND
            event.outcome:failure

统计:
  Splunk:   | stats count by src_ip
  Elastic:  | stats count() by source.ip

时间图表:
  Splunk:   | timechart span=1h count
  Elastic:  | date_histogram field=@timestamp interval=1h

关联:
  Splunk:   | transaction src_ip maxspan=5m
  Elastic:  (使用 Painless 脚本或多层 stats 实现)
```

---

## 九、日志保留与合规

```
等保三级日志要求：
  ✦ 日志保留 ≥ 6 个月
  ✦ 审计日志不可删除/不可篡改
  ✦ 日志进程保护（杀不死/自动拉起）

日志完整性保护方案：
  1. 应用层: 日志文件加 HMAC-SM3 校验值链
  2. 传输层: mTLS 加密传输
  3. 存储层: ES 索引只读 + 快照到 WORM 存储 (S3 Object Lock)

合规证明：
  ✓ 日志采集覆盖率报表
  ✓ 日志保留时长证明
  ✓ 日志完整性校验报告
```

---

## ✅ Checklist

- [ ] ES 集群部署（≥3节点）
- [ ] Logstash 处理管道配置
- [ ] 核心日志源全量接入
- [ ] 日志范式化 (ECS)
- [ ] 基础检测规则部署（≥50条）
- [ ] 告警质量审计（月度）
- [ ] ILM 索引生命周期配置
- [ ] 日志完整性保护
- [ ] 合规报告自动生成
