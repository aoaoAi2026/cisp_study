# 安全日志源全接入指南：50+日志源配置模板

> **📘 文档定位**：CISP 考试 安全运营 核心 | 难度：⭐⭐⭐ | 预计阅读：25 分钟
>
> 系统整理 50+ 安全日志源的接入配置模板，覆盖网络设备/安全设备/服务器/应用/云服务/数据库等全品类日志源。

---

## 导航目录

- [一、日志源分类体系](#一日志源分类体系)
- [二、网络设备日志接入](#二网络设备日志接入)
- [三、安全设备日志接入](#三安全设备日志接入)
- [四、服务器与应用日志接入](#四服务器与应用日志接入)
- [五、云服务日志接入](#五云服务日志接入)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

> 📅 2026-06-12 | 🎯 进阶 | ⏱ 20 min | 分类：安全运营/SOC

## 📋 提纲

1. 日志源分类体系
2. 网络设备日志接入
3. 安全设备日志接入
4. 操作系统日志接入
5. 应用/数据库日志接入
6. 云服务日志接入
7. 日志范式化（ECS）
8. 日志质量度量

---

## 1. 日志源分类

### 1.1 必须接入的日志

| 类别 | 日志源 | 优先级 | 接入方式 |
|------|--------|--------|---------|
| 网络 | 防火墙/路由器/交换机 | P0 | Syslog UDP 514 |
| 安全 | IPS/WAF/IDS | P0 | Syslog |
| 身份 | AD/LDAP/VPN | P0 | WinEvent/Syslog |
| 终端 | EDR/HIDS/AV | P0 | Agent/API |
| 应用 | Web/DB/Middleware | P1 | Filebeat/Syslog |
| 云 | CloudTrail/操作审计 | P1 | API/S3 |

---

## 2. 网络设备日志

### 2.1 华为防火墙 Syslog 配置

```
# 华为USG6000 系列
info-center enable
info-center loghost 10.0.0.50 facility local5
info-center source default channel loghost log level warning

# 关键日志：
# - 策略命中（允许/拒绝）
# - IPS/AV检测事件
# - VPN 建立/断开
# - 管理员登录
```

### 2.2 Cisco 设备

```
# Cisco IOS
logging host 10.0.0.50 transport udp port 514
logging trap notifications
logging source-interface Loopback0

# Cisco ASA
logging enable
logging host inside 10.0.0.50
logging trap informational
```

### 2.3 Logstash 接收配置

```ruby
# logstash/pipeline/network.conf
input {
  syslog {
    port => 514
    type => "syslog"
    tags => ["network"]
  }
}

filter {
  if [type] == "syslog" {
    # 华为防火墙解析
    if [message] =~ /%%/ {
      grok {
        match => { "message" => "%{SYSLOGTIMESTAMP:timestamp} %{HOSTNAME:hostname} %%01%{DATA:module}/%{INT:level}/%{DATA:description}" }
      }
    }
    
    # Cisco ASA 解析
    if [message] =~ /%ASA-/ {
      grok {
        match => { "message" => "%{CISCO_TAGGED_SYSLOG}" }
      }
    }

    # GeoIP 富化
    if [src_ip] {
      geoip { source => "src_ip" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "network-%{+YYYY.MM.dd}"
  }
}
```

---

## 3. Windows 事件日志

### 3.1 Winlogbeat 部署

```yaml
# winlogbeat.yml
winlogbeat.event_logs:
  - name: Security
    ignore_older: 72h
    
  - name: System
    ignore_older: 72h
    
  - name: Application
    
  # PowerShell 日志
  - name: Microsoft-Windows-PowerShell/Operational

  # Sysmon
  - name: Microsoft-Windows-Sysmon/Operational

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
  index: "windows-%{+YYYY.MM.dd}"

# 关键事件ID：
# Security:
#   4624 - 登录成功
#   4625 - 登录失败
#   4648 - 显式凭据登录
#   4672 - 特殊权限登录
#   4688 - 进程创建
#   4720 - 用户创建
#   5140 - 网络共享访问
#
# Sysmon:
#   1 - 进程创建
#   3 - 网络连接
#   7 - 镜像加载(DLL)
#   8 - 线程创建
#   10 - 进程访问
#   11 - 文件创建
```

### 3.2 关键事件ID速查

| EventID | 日志 | 含义 | 使用场景 |
|---------|------|------|---------|
| 4624 | Security | 登录成功 | 检测异常登录 |
| 4625 | Security | 登录失败 | 暴力破解检测 |
| 4688 | Security | 进程创建 | 可疑进程检测 |
| 4720 | Security | 用户创建 | 后门账户检测 |
| 4769 | Security | Kerberos TGS | Kerberoasting检测 |
| 1102 | Security | 审计日志清空 | 攻击者清日志 |
| 7045 | System | 服务安装 | 持久化检测 |
| 4698 | TaskScheduler | 计划任务 | 持久化检测 |

---

## 4. Linux 日志

### 4.1 Filebeat 配置

```yaml
# filebeat.yml
filebeat.inputs:
  # 系统日志
  - type: filestream
    paths:
      - /var/log/syslog
      - /var/log/messages
      - /var/log/secure
      - /var/log/auth.log

  # 服务日志
  - type: filestream
    paths:
      - /var/log/nginx/access.log
      - /var/log/apache2/access.log

  # 自定义日志
  - type: filestream
    paths:
      - /var/ossec/logs/alerts/alerts.json
    json.keys_under_root: true

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
  index: "linux-%{+YYYY.MM.dd}"
```

---

## 5. 云服务日志

### 5.1 阿里云操作审计

```python
#!/usr/bin/env python3
"""阿里云 ActionTrail 日志采集"""

import json
from aliyunsdkcore.client import AcsClient
from aliyunsdkactiontrail.request.v20171204 import LookupEventsRequest

def collect_actiontrail():
    client = AcsClient('AK', 'SK', 'cn-hangzhou')

    request = LookupEventsRequest.LookupEventsRequest()
    request.set_StartTime("2026-06-12T00:00:00Z")
    request.set_EndTime("2026-06-12T23:59:59Z")

    response = client.do_action_with_exception(request)
    events = json.loads(response)['Events']

    # 推送到ES
    for event in events:
        push_to_es({
            "@timestamp": event['eventTime'],
            "cloud": {"provider": "aliyun"},
            "event": {
                "action": event['eventName'],
                "source": event.get('sourceIpAddress', ''),
                "user": event.get('userIdentity', {}).get('userName', ''),
            },
            "raw": event
        })

def push_to_es(doc):
    import requests
    requests.post(
        "http://elasticsearch:9200/cloudtrail-aliyun/_doc",
        json=doc
    )
```

### 5.2 AWS CloudTrail

```bash
# 使用 Filebeat AWS Module
filebeat modules enable aws
filebeat setup

# filebeat.yml
filebeat.modules:
  - module: aws
    cloudtrail:
      enabled: true
      var.queue_url: https://sqs.region.amazonaws.com/account/queue
      var.credential_profile_name: security
```

---

## 6. ECS 日志范式化

```json
{
  "@timestamp": "2026-06-12T14:30:00Z",
  "event": {
    "action": "authentication_success",
    "category": "authentication",
    "type": "start",
    "outcome": "success"
  },
  "source": {
    "ip": "192.168.1.100",
    "port": 54321,
    "geo": {"country_name": "China", "city_name": "Beijing"}
  },
  "destination": {
    "ip": "10.0.0.50",
    "port": 22
  },
  "user": {"name": "admin", "domain": "CORP"},
  "host": {"name": "web-server-01", "os": {"family": "linux"}},
  "network": {"protocol": "tcp", "bytes": 1234}
}
```

---

## 7. 日志质量度量

```python
def measure_log_quality(es_logs, expected_fields):
    """度量日志质量"""
    total = len(es_logs)
    metrics = {}

    for field in expected_fields:
        present = sum(1 for log in es_logs if has_field(log, field))
        metrics[f"{field}_completeness"] = f"{present/total*100:.1f}%" if total else "N/A"

    # 时效性：日志产生时间 vs 到达ES时间
    delays = [(log['@timestamp'] - log.get('event.created', log['@timestamp'])) for log in es_logs]
    metrics['avg_delay_ms'] = sum(abs(d.total_seconds()) for d in delays) / max(len(delays), 1)

    return metrics
```

---

## ✅ 日志接入 Checklist

- [ ] 网络设备：防火墙/交换机 Syslog 接入
- [ ] 安全设备：IPS/WAF 日志接入
- [ ] Windows：Winlogbeat 安全日志+Sysmon
- [ ] Linux：Filebeat 系统日志+审计
- [ ] 云：CloudTrail/操作审计 接入
- [ ] 日志范式化 (ECS) 验证
- [ ] 日志质量：完整性/准确性/时效性 ≥ 95%

> 📚 延伸阅读：SOC/001-SOC建设 | SOC/002-SIEM分析 | HW/002-资产自查
