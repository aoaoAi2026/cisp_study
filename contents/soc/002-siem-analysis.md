# SIEM 日志管理与关联分析实战

---

## 一、SIEM 核心原理

```
SIEM = SEM(安全管理) + SIM(信息管理) + 关联分析

数据流水线：
  日志源 → Log Shippers → 消息队列 → 范式化/富化 → 索引存储 → 关联分析 → 告警/可视化

关键技术组件：
  1. 日志采集：Filebeat/Winlogbeat/Syslog-NG/NXLog
  2. 消息缓冲：Kafka/Redis/Pulsar
  3. 日志解析：Logstash/Fluentd/Vector/自定义Parser
  4. 索引存储：Elasticsearch/OpenSearch
  5. 分析引擎：Elastic Security(ES|QL+KQL+Sigma)
  6. 可视化：Kibana/Grafana
```

---

## 二、日志源接入

### 2.1 必选日志源

```
安全运营核心日志源（优先级排序）：

P0 (必须有):
  ✓ 防火墙/IPS日志 → 网络攻击检测 (非syslog)
  ✓ AD/Domain Controller → 认证事件(成功/失败)
  ✓ EDR/XDR → 端点事件(进程/文件/网络/注册表)
  ✓ DNS 日志 → C2/隧道/DGA检测

P1 (强烈推荐):
  ✓ Web服务器 (Nginx/Apache) → URL访问/WAF
  ✓ 邮件网关 → 钓鱼邮件/恶意附件
  ✓ VPN/ZTNA → 远程访问审计
  ✓ 云服务 (AWS CloudTrail/Azure Monitor) → 云活动审计
  ✓ DHCP → 设备连网追踪

P2 (锦上添花):
  ✓ 数据库审计日志 (Oracle/MySQL/PG)
  ✓ 打印服务器
  ✓ 文件服务器访问
  ✓ 应用程序自定义日志
```

### 2.2 Syslog 配置示例

```bash
# Rsyslog 集中发送 (Linux)
# /etc/rsyslog.d/50-forward.conf
*.* @192.168.1.200:514   # UDP
# 或
*.* @@192.168.1.200:514  # TCP (推荐)

# 增加TLS加密传输 (生产环境必须)
$DefaultNetstreamDriver gtls
$ActionSendStreamDriverMode 1
$ActionSendStreamDriverAuthMode x509/name
$ActionSendStreamDriverPermittedPeer logserver.example.com
```

```xml
<!-- Windows Event Forwarding → Winlogbeat -->
<!-- winlogbeat.yml -->
winlogbeat.event_logs:
  - name: Security
    ignore_older: 72h
  - name: System
  - name: Application
  
output.elasticsearch:
  hosts: ["https://elasticsearch:9200"]
  ssl.certificate_authorities: ["certs/ca.crt"]
  ssl.certificate: "certs/winlogbeat.crt"
  ssl.key: "certs/winlogbeat.key"
```

---

## 三、日志范式化

### 3.1 ECS (Elastic Common Schema)

```
ECS = Elastic推出的统一日志格式标准

核心字段：
  @timestamp       → 事件时间
  event.kind       → event/alert/metric
  event.category   → authentication/network/process/file...
  event.type       → start/end/creation/deletion...
  event.outcome    → success/failure/unknown
  
  user.name        → 操作用户
  user.domain      → 域
  source.ip        → 源IP
  source.port      → 源端口
  destination.ip   → 目的IP
  destination.port → 目的端口
  
  process.name     → 进程名
  process.command_line → 命令行
  file.path        → 文件路径
  network.protocol → TCP/UDP/HTTP...
  url.original     → 完整URL
  dns.question.name → DNS查询域名
  
  rule.id          → 触发的SIEM规则ID
  rule.name        → 规则名称

优势：不同来源的日志字段统一 → 跨设备关联分析
```

### 3.2 Logstash 解析器

```ruby
# Logstash 解析 FortiGate 防火墙日志
filter {
  grok {
    match => {
      "message" => [
        "%{FORTIGATE_LOG}"  # 自定义Grok模式
      ]
    }
  }
  
  # 字段映射到ECS
  mutate {
    rename => {
      "srcip"  => "[source][ip]"
      "dstip"  => "[destination][ip]"
      "srcport" => "[source][port]"
      "dstport" => "[destination][port]"
      "action"  => "[event][action]"
    }
  }
  
  # 富化：GeoIP
  geoip {
    source => "[source][ip]"
    target => "[source][geo]"
  }
  
  # 富化：威胁情报(检查IP是否已知恶意)
  translate {
    field       => "[source][ip]"
    destination => "[source][threat]"
    dictionary_path => "/etc/logstash/threat_ip.yml"
  }
}
```

---

## 四、关联分析规则

### 4.1 Sigma 规则

```yaml
# Sigma 规则示例 1：检测Mimikatz执行
title: Suspicious Mimikatz Execution
id: 5f0c03b1-3e94-4c4b-96b9-1a7c4f2c4c7d
status: stable
description: Detects Mimikatz commands
logsource:
  product: windows
  category: process_creation
detection:
  selection:
    CommandLine|contains:
      - 'mimikatz'
      - 'sekurlsa::logonpasswords'
      - 'lsadump::sam'
      - 'lsadump::secrets'
      - 'lsadump::cache'
  condition: selection
level: critical
tags:
  - attack.t1003
  - attack.credential_access

# Sigma 规则示例 2：检测可疑DNS查询(DGA)
title: Suspicious DNS Query - Potential DGA
id: dns-002
description: High entropy DNS queries suggesting DGA
logsource:
  category: dns
detection:
  selection:
    dns.question.name|re: '^[a-z0-9]{20,}\.(com|net|org|info)$'
  timeframe: 10m
  condition: selection | count() > 50
level: high
```

### 4.2 Elastic KQL 查询

```kql
// 检测横向移动 — 单用户短时间多主机RDP/WinRM
event.category : "authentication" 
AND event.outcome : "success"
AND event.type : "start"
AND source.ip : * 
| stats count_distinct(host.name) as hosts BY user.name
| where hosts > 5

// 检测数据外泄 — 非工作时间大流量出站
event.category : "network"
AND network.direction : "outbound"
AND NOT destination.ip : 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
AND @timestamp >= now-1h
AND @timestamp.hour >= 22 OR @timestamp.hour <= 6
| stats sum(network.bytes) as total_bytes BY source.ip
| where total_bytes > 1073741824  // >1GB
```

---

## 五、主流产品对比

| 产品 | 搜索语言 | 特色 | 说明 |
|------|---------|------|------|
| **Splunk** | SPL | 搜索能力最强 | 按数据量计费(贵) |
| **ELK** | KQL / ES|QL | 开源灵活 | 自建运维成本高 |
| **Wazuh** | Rules XML | SIEM+XDR一体 | 开源、易入门 |
| **MS Sentinel** | KQL | Azure原生 | 云原生、微软生态 |
| **QRadar** | Ariel | IBM生态 | 大企业、复杂部署 |
| **奇安信天眼** | 自定义 | 国产适配 | 威胁情报强 |
| **深信服SIP** | 自定义 | 一体化 | 全网态势感知 |

---

## 六、Checklist

- [ ] 核心日志源全量接入(P0级)
- [ ] 日志范式化(统一到ECS或自定义Schema)
- [ ] 日志传输加密(Syslog-TLS/Kafka-TLS/Beats-TLS)
- [ ] 日志保留策略(热数据30天/温数据90天/冷数据≥365天)
- [ ] 基线规则部署(Sigma规则集导入)
- [ ] 关联分析规则编写(至少覆盖ATT&CK Top 20技术)
- [ ] 告警降噪(合并+白名单+动态阈值)
- [ ] 日志质量监控(采集延迟/丢失率/解析错误率)
- [ ] 规则定期审核(≥季度)
- [ ] 数据生命周期管理(索引轮转/归档/删除)
