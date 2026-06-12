# SOC 安全运营中心从零建设指南

> 📅 2026-06-12 | 🎯 精通 | ⏱ 25 min | 分类：安全运营/SOC

## 📋 提纲

1. SOC 建设前置分析：自建 vs 托管 vs 混合
2. SOC 六层技术架构设计
3. 人员编制与三班倒排班方案
4. 工具链选型与预算估算
5. Tier 1-3 告警处理流程设计
6. 日志源接入规划
7. 建设里程碑与验收标准
8. 排错指南与常见踩坑
9. 真实案例：某金融企业 SOC 建设全记录

---

## 1. SOC 建设前置分析

### 1.1 建设模式决策矩阵

在做任何技术选型前，先回答三个问题：

| 维度 | 自建 SOC | MSSP 托管 | 混合 SOC |
|------|---------|-----------|----------|
| 初始投入 | 150-500 万 | 30-80 万/年 | 80-200 万 |
| 团队规模 | 8-20 人 | 0-2 人 | 3-8 人 |
| 响应时间 | 可控 | 合同约束 | 分层 |
| 数据主权 | 完全控制 | 共享风险 | 部分共享 |
| 定制能力 | 高 | 低 | 中 |
| 适合规模 | 大型企业 | 中小企业 | 中型企业 |
| 护网支撑 | 最佳 | 一般 | 良好 |

**决策公式**：
```python
def soc_mode_decision(assets, budget, compliance_level, hw_participation):
    score = 0
    score += 2 if assets > 5000 else (1 if assets > 1000 else 0)
    score += 2 if budget > 5000000 else (1 if budget > 1000000 else 0)
    score += 2 if compliance_level in ['level3', 'level4'] else 0
    score += 2 if hw_participation else 0

    if score >= 6: return "自建SOC"
    elif score >= 3: return "混合SOC"
    else: return "MSSP托管"
```

### 1.2 等保与合规驱动

等保三级强制要求（GB/T 22239-2019）：
- **安全区域边界** 8.1.3.2：入侵防范 → 需部署 IPS/NDR
- **安全计算环境** 8.1.4.3：入侵防范 → 需部署 HIDS/EDR
- **安全管理中心** 8.1.8：集中管控 → 需部署 SOC/态势感知平台
- **安全审计** 8.1.4.5：日志审计 → 日志保存 ≥ 6 个月

这意味着：**过等保三级 = 至少要有一个基础 SOC**。

---

## 2. SOC 六层技术架构

```
┌─────────────────────────────────────────────────────────┐
│ 第6层 - 可视化与决策层                                    │
│ Grafana / Kibana Dashboard / 大屏展示 / 管理驾驶舱          │
├─────────────────────────────────────────────────────────┤
│ 第5层 - 编排与自动化层 (SOAR)                              │
│ Shuffle / n8n / StackStorm / Siemplify                   │
│ Playbook引擎 / 工单系统(TheHive) / 通知(钉钉/飞书/企业微信)    │
├─────────────────────────────────────────────────────────┤
│ 第4层 - 分析与检测层 (SIEM + UEBA)                         │
│ Elastic Stack / Splunk / Wazuh + Elastic ML              │
│ Sigma规则引擎 / 关联分析 / 异常检测 / 威胁情报联动            │
├─────────────────────────────────────────────────────────┤
│ 第3层 - 采集与范式化层                                     │
│ Logstash / Filebeat / Fluentd / Vector / Cribl           │
│ ECS字段映射 / 日志富化(GeoIP/资产/威胁情报)                  │
├─────────────────────────────────────────────────────────┤
│ 第2层 - 探针与数据源层                                     │
│ EDR(Wazuh) / HIDS(osquery) / NDR(Zeek/Suricata)          │
│ 蜜罐(T-Pot/HFish) / 漏洞扫描(Nessus/Nuclei) / CSPM         │
├─────────────────────────────────────────────────────────┤
│ 第1层 - 被保护资产层                                       │
│ 服务器 / 网络设备 / 安全设备 / 应用 / 数据库 / 云资源 / 终端   │
└─────────────────────────────────────────────────────────┘
```

### 2.1 开源 SOC 技术栈（零 license 费用）

```yaml
# docker-compose.yml - 开源 SOC 一键部署
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=true
      - ELASTIC_PASSWORD=${ES_PASSWORD}
      - "ES_JAVA_OPTS=-Xms4g -Xmx4g"
    volumes:
      - es_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
    restart: always

  kibana:
    image: docker.elastic.co/kibana/kibana:8.12.0
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
      - ELASTICSEARCH_USERNAME=elastic
      - ELASTICSEARCH_PASSWORD=${ES_PASSWORD}
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
    restart: always

  logstash:
    image: docker.elastic.co/logstash/logstash:8.12.0
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
      - ./logstash/config/logstash.yml:/usr/share/logstash/config/logstash.yml
    ports:
      - "5044:5044"   # Beats input
      - "5140:5140/udp" # Syslog
    depends_on:
      - elasticsearch
    restart: always

  wazuh-manager:
    image: wazuh/wazuh-manager:4.7.3
    environment:
      - INDEXER_URL=https://wazuh-indexer:9200
      - INDEXER_USERNAME=admin
      - INDEXER_PASSWORD=${WAZUH_PASSWORD}
    ports:
      - "1514:1514/udp"
      - "1515:1515"
      - "55000:55000"
    restart: always

  wazuh-indexer:
    image: wazuh/wazuh-indexer:4.7.3
    environment:
      - "OPENSEARCH_JAVA_OPTS=-Xms2g -Xmx2g"
    ports:
      - "9201:9200"
    restart: always

  wazuh-dashboard:
    image: wazuh/wazuh-dashboard:4.7.3
    ports:
      - "5602:5601"
    environment:
      - INDEXER_URL=https://wazuh-indexer:9200
    depends_on:
      - wazuh-indexer
    restart: always

  # 蜜罐平台
  tpot:
    image: dtagdevsec/tpot:latest
    network_mode: host
    privileged: true
    restart: always

  # 事件管理
  thehive:
    image: strangebee/thehive:5.2
    ports:
      - "9000:9000"
    depends_on:
      - cassandra
      - elasticsearch
    restart: always

  cassandra:
    image: cassandra:4
    environment:
      - CASSANDRA_CLUSTER_NAME=TheHive
    volumes:
      - cassandra_data:/var/lib/cassandra
    restart: always

  # SOAR
  shuffle:
    image: ghcr.io/shuffle/shuffle-backend:latest
    ports:
      - "3001:3001"
    restart: always

  # 漏洞管理
  defectdojo:
    image: defectdojo/defectdojo-django:latest
    ports:
      - "8080:8080"
    environment:
      - DD_DATABASE_URL=postgresql://defectdojo:defectdojo@postgres:5432/defectdojo
    depends_on:
      - postgres
    restart: always

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=defectdojo
      - POSTGRES_USER=defectdojo
      - POSTGRES_PASSWORD=defectdojo
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  es_data:
  cassandra_data:
  pg_data:
```

### 2.2 Logstash 日志范式化配置

```ruby
# logstash/pipeline/01-input.conf
input {
  beats {
    port => 5044
  }
  tcp {
    port => 5140
    type => "syslog"
    codec => "json"
  }
  kafka {
    bootstrap_servers => "kafka:9092"
    topics => ["security-events"]
    codec => "json"
  }
}

# logstash/pipeline/02-filter.conf
filter {
  # GeoIP 富化
  if [source_ip] {
    geoip {
      source => "source_ip"
      target => "geoip"
    }
  }

  # 威胁情报匹配
  if [source_ip] or [destination_ip] {
    translate {
      field => "source_ip"
      destination => "threat_intel"
      dictionary_path => "/etc/logstash/threat_intel.yml"
      fallback => "unknown"
    }
  }

  # 资产信息富化
  if [host][hostname] {
    translate {
      field => "[host][hostname]"
      destination => "asset_info"
      dictionary_path => "/etc/logstash/asset_db.yml"
    }
  }

  # ECS 字段映射
  mutate {
    rename => {
      "src_ip" => "[source][ip]"
      "dst_ip" => "[destination][ip]"
      "src_port" => "[source][port]"
      "dst_port" => "[destination][port]"
    }
  }

  # 时间戳标准化
  date {
    match => ["timestamp", "ISO8601", "UNIX", "UNIX_MS"]
    target => "@timestamp"
  }
}

# logstash/pipeline/03-output.conf
output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    user => "elastic"
    password => "${ES_PASSWORD}"
    index => "logs-%{+YYYY.MM.dd}"
    template => "/etc/logstash/ecs-template.json"
    template_name => "ecs"
  }
}
```

---

## 3. 人员编制与排班

### 3.1 自建 SOC 最小人员配置

```python
# SOC 人力计算器
def soc_headcount(monitored_assets, daily_alert_volume, hw_mode=False):
    # 基础配置
    tier1_ratio = daily_alert_volume / 200  # 每200告警需1个T1
    tier2_ratio = monitored_assets / 1000    # 每1000资产需1个T2
    tier3_ratio = 0.2  # 固定1个T3

    tier1 = max(4, int(tier1_ratio))  # 最少4人满足7x24
    tier2 = max(2, int(tier2_ratio))
    tier3 = max(1, int(tier3_ratio))

    manager = 1
    threat_hunter = 1
    soar_engineer = 1 if monitored_assets > 2000 else 0

    total = tier1 + tier2 + tier3 + manager + threat_hunter + soar_engineer

    if hw_mode:
        total *= 1.5  # 护网期间增加50%人力

    return {
        "Tier1_分析师": tier1,
        "Tier2_高级分析师": tier2,
        "Tier3_应急专家": tier3,
        "SOC经理": manager,
        "威胁猎人": threat_hunter,
        "SOAR工程师": soar_engineer,
        "合计": total
    }

# 示例：3000资产，日告警500条
result = soc_headcount(3000, 500)
# Tier1:5人, Tier2:3人, Tier3:1人, 经理:1人, 猎人:1人, SOAR:1人 = 12人
```

### 3.2 7x24 三班倒排班表

```sql
-- SOC 排班数据库表设计
CREATE TABLE soc_shifts (
    id SERIAL PRIMARY KEY,
    shift_type VARCHAR(20),    -- 'morning','afternoon','night'
    start_time TIME,
    end_time TIME,
    analyst_id INT,
    date DATE,
    is_primary BOOLEAN DEFAULT true,  -- 主班 vs 备班
    created_at TIMESTAMP DEFAULT NOW()
);

-- 一周排班示例
INSERT INTO soc_shifts VALUES
-- 周一
(1,'morning','08:00','16:00',101,'2026-06-12',true),
(2,'afternoon','16:00','00:00',102,'2026-06-12',true),
(3,'night','00:00','08:00',103,'2026-06-12',true),
-- 备班（在家待命）
(4,'backup','08:00','08:00',104,'2026-06-12',false);

-- 排班要求：
-- 1. 每人连续夜班不超过2天
-- 2. 夜班后强制休息24小时
-- 3. 每班至少1名T2分析师
-- 4. T3专家7x24电话待命（不排固定班）
```

---

## 4. 工具链选型与预算

| 层级 | 开源方案 | 商业方案 | 年成本(开源) | 年成本(商业) |
|------|---------|---------|-------------|-------------|
| SIEM | Elastic + Wazuh | Splunk / QRadar | ¥0 (自运维) | ¥50-200万 |
| EDR | Wazuh + osquery | CrowdStrike / SentinelOne | ¥0 | ¥30-80万 |
| NDR | Zeek + Suricata | Darktrace / Vectra | ¥0 | ¥50-150万 |
| SOAR | Shuffle + n8n | Splunk SOAR / XSOAR | ¥0 | ¥30-100万 |
| 蜜罐 | T-Pot / HFish | Attivo / Illusive | ¥0 | ¥20-60万 |
| 漏洞管理 | DefectDojo + OpenVAS | Tenable / Qualys | ¥0 | ¥20-50万 |
| 工单 | TheHive | ServiceNow SecOps | ¥0 | ¥20-50万 |
| 威胁情报 | MISP + OTX | Recorded Future | ¥0 | ¥30-80万 |

**开源方案总成本**：服务器 10-20 万（硬件）+ 3-5 人运维 = 约 60-100 万/年  
**商业方案总成本**：license 150-500 万 + 2-3 人运维 = 约 200-600 万/年

---

## 5. Tier 1-3 告警处理流程

### 5.1 告警处理 SOP

```
告警产生 → 自动分级 → Tier1 初筛 → 判定
                                    ├── 误报 → 关闭 + 调优规则
                                    ├── 已知攻击(已拦截) → 关闭 + 记录
                                    ├── 低危事件 → Tier1 处置 + 关闭
                                    ├── 中危事件 → 升级 Tier2
                                    └── 高危事件 → 直接升级 Tier3 + 启动应急
```

### 5.2 Tier 1 分析师操作手册

```python
#!/usr/bin/env python3
"""
Tier1 告警分析自动化脚本 - 减少80%手动操作
用法: python3 tier1_triage.py --alert-id ALERT-2026-001
"""

import requests
import json
from datetime import datetime, timedelta

class Tier1Triage:
    def __init__(self, elastic_url, thehive_url, api_key):
        self.es = elastic_url
        self.thehive = thehive_url
        self.api_key = api_key

    def enrich_alert(self, alert):
        """自动化告警富化：无需手动查询10个系统"""
        enriched = alert.copy()

        # 1. 查询资产信息
        asset = self.query_asset_db(alert['source_ip'])
        enriched['asset'] = asset

        # 2. 威胁情报查询
        threat = self.query_threat_intel(alert['source_ip'])
        enriched['threat_intel'] = threat

        # 3. 关联历史告警（同IP/同告警类型）
        history = self.query_es(f"""
            alert_type:"{alert['alert_type']}"
            AND (source_ip:"{alert['source_ip']}"
            OR hostname:"{alert.get('hostname','')}")
            AND @timestamp:[now-7d TO now]
        """)
        enriched['similar_alerts_7d'] = len(history)

        # 4. geoip信息
        if alert.get('source_ip'):
            enriched['geoip'] = self.geoip_lookup(alert['source_ip'])

        # 5. 自动判定
        enriched['auto_verdict'] = self.auto_verdict(enriched)

        return enriched

    def auto_verdict(self, enriched_alert):
        """自动判定：减少Tier1 80%的手工判定工作"""
        score = 0
        reasons = []

        # 加分项（可疑）
        if enriched_alert.get('threat_intel', {}).get('malicious'):
            score += 40
            reasons.append("威胁情报命中")

        if enriched_alert.get('geoip', {}).get('country') in ['RU','KP','IR']:
            score += 20
            reasons.append("高风险国家IP")

        if enriched_alert.get('similar_alerts_7d', 0) > 10:
            score += 15
            reasons.append("7天内同类告警频繁")

        # 减分项（正常）
        if enriched_alert.get('asset', {}).get('is_dev'):
            score -= 30
            reasons.append("开发环境")

        if enriched_alert.get('asset', {}).get('whitelisted'):
            score -= 50
            reasons.append("白名单资产")

        # 判定
        if score >= 60:
            return {"level": "P1", "action": "立即升级Tier3", "reasons": reasons}
        elif score >= 30:
            return {"level": "P2", "action": "升级Tier2分析", "reasons": reasons}
        elif score >= 10:
            return {"level": "P3", "action": "Tier1处置", "reasons": reasons}
        else:
            return {"level": "P4", "action": "低优先级/误报", "reasons": reasons}

    def query_es(self, query_string):
        """查询 ES 获取关联告警"""
        resp = requests.post(
            f"{self.es}/logs-*/_search",
            headers={"Authorization": f"ApiKey {self.api_key}"},
            json={
                "query": {"query_string": {"query": query_string}},
                "size": 100
            }
        )
        return resp.json().get('hits', {}).get('hits', [])

    def query_asset_db(self, ip):
        return {"asset_name": "web-server-01", "department": "IT", "is_dev": False, "whitelisted": False}

    def query_threat_intel(self, ip):
        resp = requests.get(f"https://otx.alienvault.com/api/v1/indicators/IPv4/{ip}/general")
        data = resp.json()
        return {"malicious": data.get('pulse_info', {}).get('count', 0) > 0}

    def geoip_lookup(self, ip):
        resp = requests.get(f"http://ip-api.com/json/{ip}")
        return resp.json()

    def create_thehive_case(self, enriched_alert):
        """自动创建 TheHive 工单"""
        case = {
            "title": f"[{enriched_alert['auto_verdict']['level']}] {enriched_alert['alert_type']}",
            "description": json.dumps(enriched_alert, indent=2, ensure_ascii=False),
            "severity": {"P1":4,"P2":3,"P3":2,"P4":1}[enriched_alert['auto_verdict']['level']],
            "tags": enriched_alert.get('tags', []),
            "tlp": 2,  # Amber
            "pap": 2
        }
        resp = requests.post(
            f"{self.thehive}/api/case",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json=case
        )
        return resp.json()


# 使用示例
if __name__ == "__main__":
    triage = Tier1Triage(
        elastic_url="http://elasticsearch:9200",
        thehive_url="http://thehive:9000",
        api_key="your-api-key"
    )

    test_alert = {
        "alert_type": "Suspicious_Outbound_Connection",
        "source_ip": "192.168.1.100",
        "destination_ip": "45.33.32.156",
        "destination_port": 443,
        "process_name": "powershell.exe",
        "hostname": "WIN-DC01"
    }

    enriched = triage.enrich_alert(test_alert)
    print(json.dumps(enriched, indent=2, ensure_ascii=False))

    if enriched['auto_verdict']['level'] in ['P1','P2']:
        case = triage.create_thehive_case(enriched)
        print(f"✅ 已创建工单: {case.get('id')}")
```

### 5.3 Tier 1 → Tier 3 升级标准

| 升级条件 | 目标 | SLA |
|---------|------|-----|
| 告警确认真阳性 + 攻击成功 | Tier2 | 15 min |
| 内网横向移动迹象 | Tier2 | 10 min |
| 数据外传迹象 | Tier3 | 5 min |
| EDR检测到恶意软件执行 | Tier2 | 10 min |
| 特权账号异常登录 | Tier2 | 15 min |
| 勒索软件特征 | Tier3 | 立即 |
| 域控异常行为 | Tier3 | 立即 |

---

## 6. 建设里程碑

```mermaid
gantt
    title SOC建设路线图 (6个月)
    dateFormat  YYYY-MM-DD
    section 基础设施
    服务器采购上架      :done,    s1, 2026-01-01, 14d
    Elastic集群部署      :done,    s2, after s1, 7d
    Wazuh Manager部署    :active,  s3, after s2, 7d

    section 日志接入
    网络设备日志(Syslog)  :crit,    l1, after s3, 14d
    安全设备日志          :         l2, after s3, 14d
    服务器日志(Win/Linux) :         l3, after s3, 21d
    应用日志+数据库日志    :         l4, after l3, 21d

    section 检测能力
    Sigma 规则部署       :         r1, after l1, 14d
    Wazuh 规则定制        :         r2, after l2, 14d
    关联分析规则          :         r3, after r1, 21d
    UEBA基线建立          :         r4, after l3, 30d

    section 运营体系
    Tier1培训上岗         :         t1, after r1, 14d
    SOP文档编写           :         t2, after r1, 30d
    SOAR Playbook开发     :         t3, after r3, 30d
    护网专项加固           :         t4, after t1, 30d
```

---

## 7. 排错指南

### 7.1 ES 集群性能问题

```bash
# 问题：ES查询慢
# 排查步骤
# 1. 检查索引状态
curl -s 'http://elasticsearch:9200/_cat/indices?v&s=store.size:desc' | head -20

# 2. 检查慢查询
curl -s 'http://elasticsearch:9200/_nodes/hot_threads?threads=3' | python3 -m json.tool

# 3. 检查JVM内存
curl -s 'http://elasticsearch:9200/_nodes/stats/jvm?pretty' | grep -A5 "heap_used_percent"

# 4. 常见解决方案
# - 增加JVM堆内存: -Xms8g -Xmx8g
# - 关闭不必要的索引刷新间隔: index.refresh_interval=30s
# - 设置索引生命周期: 热数据3天→温数据30天→冷数据90天→删除
```

### 7.2 Logstash 丢日志

```yaml
# logstash.yml 关键配置
pipeline.workers: 4          # 根据CPU核心数
pipeline.batch.size: 500     # 每批处理条数
pipeline.batch.delay: 50     # 批次延迟(ms)
queue.type: persisted        # 持久化队列——防丢日志关键!
queue.max_bytes: 4gb         # 队列最大4GB
dead_letter_queue.enable: true  # 死信队列——处理失败的日志进入这里
```

### 7.3 Wazuh Agent 掉线

```bash
# 常见原因与修复
# 问题1: Agent 心跳超时
# 修复: Wazuh Manager 配置
echo 'agents_disconnection_time=30m' >> /var/ossec/etc/ossec.conf

# 问题2: Agent密钥过期
# 修复: 重新注册
/var/ossec/bin/manage_agents -r <AGENT_ID>
/var/ossec/bin/manage_agents -a <AGENT_IP> -n <AGENT_NAME>

# 问题3: 防火墙阻断1514/1515端口
# 修复: 
firewall-cmd --add-port=1514/udp --permanent
firewall-cmd --add-port=1515/tcp --permanent

# 监控脚本
#!/bin/bash
# check_agents.sh - 检查agent在线率
TOTAL=$(/var/ossec/bin/agent_control -l | wc -l)
ACTIVE=$(/var/ossec/bin/agent_control -l | grep Active | wc -l)
echo "Agent在线率: $ACTIVE/$TOTAL"
if [ $(echo "$ACTIVE/$TOTAL < 0.9" | bc) -eq 1 ]; then
    echo "⚠️ 在线率低于90%，需排查!"
fi
```

---

## 8. 真实案例：某金融企业 SOC 建设

**背景**：3000+ 服务器，10000+ 终端，通过等保三级 + 护网参演单位

**第一阶段（1-2月）**：
- 部署 Elastic 集群（3节点，128G内存/节点）
- Wazuh Manager 高可用（2节点 + keepalived VIP）
- 接入核心日志：防火墙 × 20、交换机 × 50、Windows DC、Linux 核心服务器

**遇到的问题**：
1. **ES写入性能瓶颈**：高峰 30万 events/秒 → ES 写入延迟 30s
   - 解决：增加 hot-warm-cold 分层 + 关闭 `_source` 对非关键字段
2. **告警风暴**：部署初期日告警 50000+ 条，Tier1 直接崩溃
   - 解决：告警聚合（同IP/同类型5分钟内合并1条）+ 动态阈值
3. **Agent 部署阻力**：业务部门担心影响性能
   - 解决：先用 osquery（轻量只读）建立信任，1个月后推广 Wazuh

**运行数据（6个月后）**：
- 日均入库：2TB
- 告警降噪率：从 50000 → 500 条/天（降噪 99%）
- 平均检测时间(MTTD)：8分钟
- 平均响应时间(MTTR)：45分钟
- 误报率：< 5%

---

## ✅ 建设 Checklist

- [ ] 明确建设模式（自建/MSSP/混合）
- [ ] 预算审批通过（含3年TCO）
- [ ] 服务器采购上架（最少3节点）
- [ ] ES 集群部署 + 调优
- [ ] Wazuh Manager 部署 + Agent 推送
- [ ] 日志源清单确认（最少覆盖网络+安全+服务器三层）
- [ ] Logstash pipeline 配置 + ECS 映射
- [ ] Sigma 规则集导入（基础300+规则）
- [ ] Kibana Dashboard 创建
- [ ] Tier1 人员招聘/培训（最少4人）
- [ ] 排班表确认（7x24三班倒）
- [ ] SOP 文档编写（Tier1/2/3操作手册）
- [ ] TheHive 工单系统部署
- [ ] Shuffle SOAR 部署 + Top5 Playbook
- [ ] 告警通知渠道（钉钉/飞书/企业微信/短信）
- [ ] 护网专项规则部署
- [ ] 首次红蓝对抗演练（验证SOC有效性）
- [ ] 正式上线运营

---

> 📚 延伸阅读：SOC/002-SIEM规则编写深度 | SOC/003-SOAR自动化实战 | SOC/009-EDR/HIDS运营实战
