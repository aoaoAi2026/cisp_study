# 态势感知平台建设与运营

> 📅 2026-06-12 | 🎯 精通 | ⏱ 20 min | 分类：安全运营/SOC

## 📋 提纲

1. 态势感知平台核心能力
2. 架构设计
3. 资产态势感知
4. 攻击态势感知
5. 漏洞态势感知
6. 护网态势大屏
7. 实时告警Dashboard
8. Grafana 实战配置

---

## 1. 态势感知平台核心能力

态势感知的"感知"是分层的：

```
第一层：看见（Visibility）
  - 有多少资产？哪些在线？
  - 有多少攻击？从哪里来？
  - 有多少漏洞？修了多少？

第二层：理解（Comprehension）
  - 攻击是否成功？
  - 哪些资产最危险？
  - 攻击趋势如何变化？

第三层：预测（Projection）
  - 下一步攻击可能在哪？
  - 哪些没修复的漏洞会被打？
  - 需要加强哪个防线？
```

### 1.1 四大态势维度

| 维度 | 核心指标 | 数据源 |
|------|---------|--------|
| 资产态势 | 总数/新增/离线/风险分布 | CMDB + 扫描器 |
| 攻击态势 | 攻击量/类型/来源/趋势 | 防火墙/IPS/WAF/SIEM |
| 漏洞态势 | 漏洞总数/高危/修复率/趋势 | 漏洞扫描器 |
| 威胁态势 | IOC命中/APT关联/情报质量 | 威胁情报平台 |

---

## 2. 架构设计

```
数据采集层
├─ 防火墙日志(Syslog)
├─ IPS/IDS日志
├─ WAF日志
├─ EDR日志
├─ 漏洞扫描结果
├─ 威胁情报
├─ CMDB资产数据
└─ DNS/代理日志

        ↓ Kafka / Logstash

数据处理层
├─ 流处理(Flink/Spark Streaming)
├─ 实时聚合(Elasticsearch)
├─ 关联分析
└─ 威胁情报匹配

        ↓

数据存储层
├─ Elasticsearch (热数据 7天)
├─ HDFS/MinIO (温数据 90天)  
└─ S3/COS (冷数据 365天)

        ↓

可视化层
├─ Grafana Dashboard
├─ Kibana Canvas
├─ 大屏展示 (WebSocket实时推送)
└─ 定时报表 (PDF/邮件)
```

---

## 3. 资产态势

### 3.1 资产API开发

```python
#!/usr/bin/env python3
"""
资产态势API - 实时资产状态
"""

from fastapi import FastAPI, Query
from elasticsearch import AsyncElasticsearch
from datetime import datetime, timedelta
import asyncio

app = FastAPI()
es = AsyncElasticsearch(['http://elasticsearch:9200'])

@app.get("/api/situation/assets")
async def get_asset_situation():
    """获取资产态势总览"""
    now = datetime.utcnow()

    # 1. 总资产数
    total = await es.count(index="assets")

    # 2. 在线资产数（最近1小时有心跳的EDR Agent）
    online = await es.count(index="logs-edr*", body={
        "query": {
            "bool": {
                "must": [
                    {"term": {"event.action": "agent_heartbeat"}},
                    {"range": {"@timestamp": {"gte": "now-1h"}}}
                ]
            }
        }
    })

    # 3. 按操作系统分布
    os_distribution = await es.search(index="assets", body={
        "size": 0,
        "aggs": {
            "by_os": {
                "terms": {"field": "asset.os.keyword", "size": 10}
            }
        }
    })

    # 4. 按业务系统分布
    business_distribution = await es.search(index="assets", body={
        "size": 0,
        "aggs": {
            "by_business": {
                "terms": {"field": "asset.business.keyword", "size": 20}
            }
        }
    })

    # 5. 风险资产（有高危漏洞且暴露在公网）
    high_risk = await es.count(index="assets", body={
        "query": {
            "bool": {
                "must": [
                    {"term": {"asset.is_public": True}},
                    {"range": {"vulnerability.critical_count": {"gte": 1}}}
                ]
            }
        }
    })

    # 6. 最近变更
    recent_changes = await es.search(index="asset-changes*", body={
        "size": 10,
        "sort": [{"@timestamp": "desc"}],
        "query": {"range": {"@timestamp": {"gte": "now-24h"}}}
    })

    return {
        "timestamp": now.isoformat(),
        "asset_overview": {
            "total": total.get('count', 0),
            "online": online.get('count', 0),
            "offline": total.get('count', 0) - online.get('count', 0),
            "online_rate": f"{online.get('count',0)/max(total.get('count',1),1)*100:.1f}%",
            "high_risk_public": high_risk.get('count', 0)
        },
        "os_distribution": {
            bucket['key']: bucket['doc_count']
            for bucket in os_distribution['aggregations']['by_os']['buckets']
        },
        "business_distribution": {
            bucket['key']: bucket['doc_count']
            for bucket in business_distribution['aggregations']['by_business']['buckets']
        },
        "recent_changes": [
            {
                "asset": hit['_source'].get('asset', {}).get('name'),
                "change_type": hit['_source'].get('change_type'),
                "timestamp": hit['_source'].get('@timestamp')
            }
            for hit in recent_changes.get('hits', {}).get('hits', [])
        ]
    }
```

---

## 4. 攻击态势

### 4.1 攻击态势 API

```python
@app.get("/api/situation/attacks")
async def get_attack_situation(
    hours: int = Query(24, description="统计时间范围(小时)")
):
    """获取攻击态势"""
    now = datetime.utcnow()

    # 1. 攻击趋势（按小时）
    attack_trend = await es.search(index="logs-firewall*,logs-ips*,logs-waf*", body={
        "size": 0,
        "query": {
            "bool": {
                "must": [
                    {"term": {"event.category": "intrusion_detection"}},
                    {"range": {"@timestamp": {"gte": f"now-{hours}h"}}}
                ]
            }
        },
        "aggs": {
            "by_hour": {
                "date_histogram": {
                    "field": "@timestamp",
                    "fixed_interval": "1h"
                },
                "aggs": {
                    "by_severity": {
                        "terms": {"field": "event.severity"}
                    }
                }
            }
        }
    })

    # 2. 攻击来源 Top 20（按国家）
    attack_source_country = await es.search(index="logs-firewall*,logs-ips*", body={
        "size": 0,
        "query": {"range": {"@timestamp": {"gte": f"now-{hours}h"}}},
        "aggs": {
            "by_country": {
                "terms": {"field": "source.geo.country_name", "size": 20}
            }
        }
    })

    # 3. 攻击IP Top 20
    attack_source_ip = await es.search(index="logs-firewall*,logs-ips*", body={
        "size": 0,
        "query": {"range": {"@timestamp": {"gte": f"now-{hours}h"}}},
        "aggs": {
            "by_ip": {
                "terms": {"field": "source.ip", "size": 20}
            }
        }
    })

    # 4. 攻击类型分布
    attack_type_distribution = await es.search(index="logs-ips*,logs-waf*", body={
        "size": 0,
        "query": {"range": {"@timestamp": {"gte": f"now-{hours}h"}}},
        "aggs": {
            "by_type": {
                "terms": {"field": "rule.category", "size": 15}
            }
        }
    })

    # 5. 被攻击资产 Top 10
    targeted_assets = await es.search(index="logs-firewall*,logs-ips*", body={
        "size": 0,
        "query": {"range": {"@timestamp": {"gte": f"now-{hours}h"}}},
        "aggs": {
            "by_asset": {
                "terms": {"field": "destination.ip", "size": 10},
                "aggs": {
                    "unique_sources": {
                        "cardinality": {"field": "source.ip"}
                    }
                }
            }
        }
    })

    # 6. 攻击成功率（被拦截 vs 通过）
    block_stats = await es.search(index="logs-firewall*,logs-ips*", body={
        "size": 0,
        "query": {"range": {"@timestamp": {"gte": f"now-{hours}h"}}},
        "aggs": {
            "by_action": {
                "terms": {"field": "event.action"}
            }
        }
    })

    return {
        "timestamp": now.isoformat(),
        "time_range": f"{hours}h",
        "attack_trend": [
            {
                "hour": bucket['key_as_string'],
                "count": bucket['doc_count'],
                "by_severity": {
                    s['key']: s['doc_count']
                    for s in bucket.get('by_severity', {}).get('buckets', [])
                }
            }
            for bucket in attack_trend['aggregations']['by_hour']['buckets']
        ],
        "top_source_countries": {
            bucket['key']: bucket['doc_count']
            for bucket in attack_source_country['aggregations']['by_country']['buckets']
        },
        "top_attack_ips": {
            bucket['key']: bucket['doc_count']
            for bucket in attack_source_ip['aggregations']['by_ip']['buckets']
        },
        "attack_types": {
            bucket['key']: bucket['doc_count']
            for bucket in attack_type_distribution['aggregations']['by_type']['buckets']
        },
        "most_targeted_assets": [
            {
                "ip": bucket['key'],
                "attacks": bucket['doc_count'],
                "unique_attackers": bucket['unique_sources']['value']
            }
            for bucket in targeted_assets['aggregations']['by_asset']['buckets']
        ],
        "block_stats": {
            bucket['key']: bucket['doc_count']
            for bucket in block_stats['aggregations']['by_action']['buckets']
        }
    }
```

---

## 5. Grafana 实战配置

### 5.1 ES 数据源配置

```yaml
# grafana/datasources/elasticsearch.yml
apiVersion: 1
datasources:
  - name: Elasticsearch-Security
    type: elasticsearch
    access: proxy
    url: http://elasticsearch:9200
    database: "logs-*"
    jsonData:
      timeField: "@timestamp"
      esVersion: 8.0.0
      maxConcurrentShardRequests: 5
    editable: false
```

### 5.2 Dashboard JSON 示例 - 攻击态势

```json
{
  "dashboard": {
    "title": "护网攻击态势总览",
    "panels": [
      {
        "title": "攻击趋势（24h）",
        "type": "graph",
        "targets": [{
          "refId": "A",
          "bucketAggs": [{
            "type": "date_histogram",
            "field": "@timestamp",
            "id": "2"
          }],
          "metrics": [{"type": "count", "id": "1"}],
          "query": "event.category:intrusion_detection"
        }]
      },
      {
        "title": "攻击来源 Top 10",
        "type": "piechart",
        "targets": [{
          "refId": "B",
          "bucketAggs": [{
            "type": "terms",
            "field": "source.geo.country_name",
            "size": "10"
          }],
          "metrics": [{"type": "count"}]
        }]
      },
      {
        "title": "实时攻击地图",
        "type": "geomap",
        "targets": [{
          "refId": "C",
          "bucketAggs": [{
            "type": "geohash_grid",
            "field": "source.geo.location",
            "precision": 3
          }],
          "metrics": [{"type": "count"}]
        }]
      },
      {
        "title": "被攻击资产 Top 10",
        "type": "table",
        "targets": [{
          "refId": "D",
          "bucketAggs": [{
            "type": "terms",
            "field": "destination.ip",
            "size": "10",
            "order": {"_count": "desc"}
          }],
          "metrics": [
            {"type": "count", "id": "1"},
            {"type": "cardinality", "field": "source.ip", "id": "2"}
          ]
        }]
      }
    ]
  }
}
```

---

## 6. 护网态势大屏

### 6.1 大屏指标设计

```
左上区域：攻击态势总览
├─ 实时攻击数（折线图：红=高危/黄=中危/蓝=低危）
├─ 攻击来源地图（世界地图热力图）
└─ 24h攻击趋势（柱状图）

右上区域：防护状态
├─ 防火墙拦截数
├─ IPS阻断数
├─ WAF拦截数
├─ EDR处置数
└─ SOAR自动处置率

中央区域：实时告警流
├─ P1事件列表（滚动）
├─ 最近处置记录
└─ 封禁IP队列

左下区域：资产健康
├─ Agent在线率
├─ 漏洞修复进度（饼图：已修复/修复中/未修复）
└─ 高危资产列表

右下区域：值班信息
├─ 当前值班班组
├─ 当班Tier3专家
├─ 护网倒计时
└─ 指挥部最新指令
```

### 6.2 WebSocket 实时推送

```python
#!/usr/bin/env python3
"""
态势感知WebSocket实时推送
"""

import asyncio
import websockets
import json
from elasticsearch import AsyncElasticsearch

connected_clients = set()
es = AsyncElasticsearch(['http://elasticsearch:9200'])

async def broadcast_situation():
    """每5秒推送一次态势数据"""
    while True:
        if connected_clients:
            # 采集实时数据
            data = {
                "type": "situation_update",
                "timestamp": datetime.utcnow().isoformat(),
                "attacks_5min": await get_attack_count_last_5min(),
                "blocked_ips_5min": await get_block_count_last_5min(),
                "active_p1_incidents": await get_active_p1_count(),
                "agent_online_rate": await get_agent_online_rate(),
                "alert_queue_length": await get_alert_queue_length(),
            }

            # 推送给所有连接的大屏
            message = json.dumps(data, ensure_ascii=False)
            await asyncio.gather(*[
                client.send(message)
                for client in connected_clients
            ])

        await asyncio.sleep(5)

async def get_attack_count_last_5min():
    resp = await es.count(index="logs-*", body={
        "query": {
            "bool": {
                "must": [
                    {"term": {"event.category": "intrusion_detection"}},
                    {"range": {"@timestamp": {"gte": "now-5m"}}}
                ]
            }
        }
    })
    return resp['count']

async def get_block_count_last_5min():
    resp = await es.count(index="logs-firewall*", body={
        "query": {
            "bool": {
                "must": [
                    {"term": {"event.action": "blocked"}},
                    {"range": {"@timestamp": {"gte": "now-5m"}}}
                ]
            }
        }
    })
    return resp['count']

async def get_active_p1_count():
    resp = await es.count(index="incidents", body={
        "query": {
            "bool": {
                "must": [
                    {"term": {"severity": 4}},  # P1
                    {"term": {"status": "open"}}
                ]
            }
        }
    })
    return resp['count']

async def get_agent_online_rate():
    total = await es.count(index="agents")
    online = await es.count(index="agents", body={
        "query": {
            "bool": {
                "must": [
                    {"term": {"status": "active"}},
                    {"range": {"last_seen": {"gte": "now-5m"}}}
                ]
            }
        }
    })
    total_count = total.get('count', 0)
    online_count = online.get('count', 0)
    return f"{online_count/max(total_count,1)*100:.1f}%"

async def get_alert_queue_length():
    resp = await es.count(index="alerts", body={
        "query": {
            "bool": {
                "must": [
                    {"term": {"status": "pending"}}
                ]
            }
        }
    })
    return resp['count']

async def handler(websocket, path):
    connected_clients.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        connected_clients.remove(websocket)

async def main():
    async with websockets.serve(handler, "0.0.0.0", 8765):
        await broadcast_situation()

if __name__ == "__main__":
    asyncio.run(main())
```

---

## 7. 排错与优化

| 问题 | 原因 | 解决 |
|------|------|------|
| 大屏数据延迟 > 30s | ES查询慢 | 预聚合数据到汇总索引 + 增加refresh_interval |
| WebSocket断连 | 网络抖动 | 前端实现自动重连 + 心跳机制 |
| 地图数据不准 | GeoIP库过期 | 定期更新MaxMind GeoLite2 |
| 大屏崩溃 | 浏览器内存溢出 | 限制数据点数 + 使用Canvas而非DOM |

---

## ✅ Checklist

- [ ] 数据源接入（防火墙/IPS/WAF/EDR/漏洞扫描/TI）
- [ ] ES索引设计（按时间滚动）
- [ ] 态势API开发
- [ ] Grafana数据源配置
- [ ] 核心Dashboard（攻击/资产/漏洞/威胁）
- [ ] 护网大屏设计
- [ ] WebSocket实时推送
- [ ] 大屏硬件部署
- [ ] 定时报表（日/周/月）
- [ ] 告警通知集成

> 📚 延伸阅读：SOC/001-SOC建设 | SOC/002-SIEM分析 | HW/004-值班方案
