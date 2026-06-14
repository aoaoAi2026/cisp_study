# SIEM 规则编写深度实战

> **📘 文档定位**：CISP 考试 安全运营 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：30 分钟
>
> 深入讲解 SIEM 检测规则的工程化编写方法论，覆盖 Sigma 规则转换、关联规则设计、误报优化、ATT&CK 映射及规则生命周期管理。

---

## 导航目录

- [一、SIEM 规则基础](#一siem-规则基础)
- [二、Sigma 规则体系](#二sigma-规则体系)
- [三、关联规则设计](#三关联规则设计)
- [四、误报优化策略](#四误报优化策略)
- [五、规则生命周期管理](#五规则生命周期管理)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

> 📅 2026-06-12 | 🎯 精通 | ⏱ 25 min | 分类：安全运营/SOC

## 📋 提纲

1. 检测规则体系概述（Sigma/Splunk/Elastic/Wazuh）
2. Sigma 规则从入门到生产
3. 高价值检测场景 Top 15
4. 规则测试与误报评估
5. 护网增强规则集
6. 规则生命周期管理
7. 排错与调优
8. 完整案例：从事件到规则

---

## 1. 检测规则体系

```
攻击事件 → 分析TTP → 编写Sigma规则 → sigmac转换 →
├─ Elastic KQL规则
├─ Splunk SPL规则
├─ Wazuh规则
└─ Sentinel规则

→ 部署规则 → 测试 → 调优 → 生产

关键原则:
1. 每条规则必须有明确的检测目标（ATT&CK Technique）
2. 规则必须有误报率评估
3. 规则必须经过测试数据验证
4. 规则必须有维护人和时效期
```

---

## 2. Sigma 规则编写

### 2.1 规则结构

```yaml
title: 检测通过Certutil下载恶意文件
id: 6e4424ai-92d2-42c3-a235-b8d9a2e4f84a
status: stable
description: |
  检测攻击者使用Certutil.exe下载恶意文件的行为。
  Certutil是Windows内置的证书管理工具，常被滥用下载文件以绕过应用白名单。
references:
  - https://attack.mitre.org/techniques/T1105/
  - https://lolbas-project.github.io/lolbas/Binaries/Certutil/
author: SOC Team
date: 2026-06-12
modified: 2026-06-12
tags:
  - attack.t1105          # Ingress Tool Transfer
  - attack.command_and_control
  - detection.emerging_threats
logsource:
  category: process_creation
  product: windows
detection:
  selection_certutil:
    - Image|endswith: '\certutil.exe'
    - OriginalFileName: 'CertUtil.exe'

  selection_download_flags:
    CommandLine|contains:
      - '-urlcache'
      - '-split'
      - '-f '
      - 'http://'
      - 'https://'

  # 排除已知的正常使用
  filter_legitimate:
    CommandLine|contains:
      - '-verifyctl'
      - '-verifystore'
      - '-dump'

  condition: selection_certutil and selection_download_flags and not filter_legitimate

falsepositives:
  - 管理员使用certutil下载证书
  - 自动化脚本中的正常certutil调用
level: high
```

### 2.2 20+ 高价值检测规则

**规则1：检测 Kerberoasting 攻击**

```yaml
title: 检测Kerberoasting攻击
id: kerberoasting-001
status: stable
description: 检测攻击者请求大量TGS票据进行离线破解
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4769
    TicketEncryptionType: '0x17'  # RC4-HMAC
  filter_known:
    ServiceName|endswith: '$'  # 排除计算机账号
  timeframe: 5m
  condition: selection and not filter_known | count() by TargetUserName > 10
level: high
tags:
  - attack.t1558.003
```

**规则2：检测 LSASS 凭证转储**

```yaml
title: 检测通过Sysmon的LSASS访问
id: lsass-access-001
status: stable
logsource:
  product: windows
  service: sysmon
detection:
  selection:
    EventID: 10  # ProcessAccess
    TargetImage|endswith: '\lsass.exe'
    GrantedAccess|contains: '0x1'
  filter_known:
    SourceImage|contains:
      - '\MsMpEng.exe'
      - '\taskhostw.exe'
      - '\svchost.exe'
      - '\WerFault.exe'
      - '\vmms.exe'
      - '\vmtoolsd.exe'
  condition: selection and not filter_known
level: high
tags:
  - attack.t1003.001
```

**规则3：检测 WMI 持久化**

```yaml
title: 检测WMI事件订阅持久化
id: wmi-persistence-001
status: stable
logsource:
  product: windows
  service: sysmon
detection:
  selection:
    EventID: 19  # WmiEventFilter
  selection2:
    EventID: 20  # WmiEventConsumer
  selection3:
    EventID: 21  # WmiEventConsumerToFilter
  condition: selection or selection2 or selection3
  timeframe: 5m
level: high
tags:
  - attack.t1546.003
```

**规则4：检测 PowerShell 编码命令**

```yaml
title: 检测Base64编码的PowerShell命令
id: ps-encoded-001
status: stable
logsource:
  product: windows
  service: sysmon
detection:
  selection:
    EventID: 1
    Image|endswith: '\powershell.exe'
    CommandLine|contains:
      - '-enc '
      - '-EncodedCommand '
      - '-e '
  filter_known:
    CommandLine|contains:
      - 'Update-Help'
      - 'Get-Help'
  condition: selection and not filter_known
level: medium
tags:
  - attack.t1059.001
```

**规则5：检测可疑计划任务**

```yaml
title: 检测创建可疑计划任务
id: schtask-suspicious-001
status: stable
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4698
  suspicious_path:
    TaskContent|contains:
      - '$env:temp'
      - '%temp%'
      - '\\appdata\\local\\temp'
      - '\\programdata\\'
      - '\\users\\public\\'
  suspicious_command:
    TaskContent|contains:
      - 'powershell'
      - 'wscript'
      - 'cscript'
      - 'mshta'
      - 'rundll32'
      - 'regsvr32'
  condition: selection and (suspicious_path or suspicious_command)
level: medium
tags:
  - attack.t1053.005
```

**规则6：DNS 隧道检测**

```yaml
title: 检测DNS隧道（大数据量查询）
id: dns-tunnel-001
status: experimental
logsource:
  category: dns
  product: windows
detection:
  selection:
    dns_query_type: 'TXT'
    dns_query_length: '>52'
  condition: selection
  timeframe: 10m
  aggregation: count() by source_ip > 50
level: high
tags:
  - attack.t1572
```

### 2.3 Sigma → Elastic KQL 转换

```bash
# 安装sigmac
pip install sigmatools

# 转换: Sigma → Elastic KQL
sigmac -t elastalert -c winlogbeat rules/windows/process_creation/rule.yml

# 转换: Sigma → Splunk SPL
sigmac -t splunk -c splunk-windows rules/windows/process_creation/rule.yml

# 转换: Sigma → Wazuh
sigmac -t wazuh rules/windows/process_creation/rule.yml

# 批量转换
for rule in rules/windows/process_creation/*.yml; do
    sigmac -t elastalert -c winlogbeat "$rule" >> elastalert_rules.yaml
done
```

转换后 Elastic KQL 示例：

```json
{
  "query": {
    "bool": {
      "must": [
        {"term": {"winlog.event_id": 1}},
        {"term": {"process.executable": "powershell.exe"}},
        {
          "query_string": {
            "query": "process.command_line: (*-enc* OR *-EncodedCommand* OR *-e *) AND NOT process.command_line: (*Update-Help* OR *Get-Help*)"
          }
        }
      ]
    }
  }
}
```

---

## 3. 规则测试与误报评估

```python
#!/usr/bin/env python3
"""
Sigma规则测试与误报率评估工具
用法: python3 rule_tester.py --rule rules/ps-encoded.yml --es-index logs-*
"""

import yaml
import json
import requests
from datetime import datetime, timedelta

class SigmaRuleTester:
    def __init__(self, es_url, es_api_key):
        self.es = es_url
        self.api_key = es_api_key

    def load_rule(self, rule_file):
        """加载Sigma规则"""
        with open(rule_file, 'r') as f:
            return yaml.safe_load(f)

    def to_es_query(self, sigma_rule):
        """Sigma规则 → ES查询（简化映射）"""
        query = {"bool": {"must": [], "filter": [], "must_not": []}}

        detection = sigma_rule.get('detection', {})

        for key, value in detection.items():
            if key == 'condition':
                continue

            if key.startswith('filter_') or key.startswith('exclude_'):
                # 排除条件
                if isinstance(value, dict):
                    for field, val in value.items():
                        field_es = self._map_field(field)
                        if isinstance(val, list):
                            query['bool']['must_not'].append({
                                "query_string": {
                                    "query": " OR ".join(f'{field_es}:({v})' for v in val)
                                }
                            })
                continue

            # 检测条件
            if isinstance(value, dict):
                for field, val in value.items():
                    field_es = self._map_field(field)
                    if isinstance(val, list):
                        query['bool']['must'].append({
                            "query_string": {
                                "query": " OR ".join(f'{field_es}:({v})' for v in val)
                            }
                        })
                    elif '|endswith' in str(val):
                        endswith_val = val.split("'")[1] if "'" in str(val) else val
                        query['bool']['must'].append({
                            "query_string": {
                                "query": f'{field_es}:*{endswith_val.lstrip("\\")}'
                            }
                        })

        return query

    def _map_field(self, sigma_field):
        """Sigma字段名 → ES字段名映射"""
        mapping = {
            'EventID': 'winlog.event_id',
            'Image': 'process.executable',
            'CommandLine': 'process.command_line',
            'TargetImage': 'winlog.event_data.TargetImage',
            'GrantedAccess': 'winlog.event_data.GrantedAccess',
            'ServiceName': 'winlog.event_data.ServiceName',
            'TicketEncryptionType': 'winlog.event_data.TicketEncryptionType',
            'SourceImage': 'winlog.event_data.SourceImage',
            'TaskContent': 'winlog.event_data.TaskContent',
            'dns_query_type': 'dns.question.type',
            'dns_query_length': 'dns.question.registered_domain.length',
        }
        return mapping.get(sigma_field, sigma_field.replace('|endswith', ''))

    def test_against_live_data(self, rule_file, index_pattern, time_range_hours=24):
        """在真实数据上测试规则"""
        rule = self.load_rule(rule_file)
        query = self.to_es_query(rule)

        # 添加时间范围
        query['bool']['filter'].append({
            "range": {
                "@timestamp": {"gte": f"now-{time_range_hours}h"}
            }
        })

        es_query = {
            "query": query,
            "size": 50,
            "sort": [{"@timestamp": "desc"}]
        }

        print(f"🔍 测试规则: {rule.get('title')}")
        print(f"📊 ES查询:\n{json.dumps(es_query, indent=2)}\n")

        resp = requests.post(
            f"{self.es}/{index_pattern}/_search",
            headers={"Authorization": f"ApiKey {self.api_key}"},
            json=es_query
        )
        hits = resp.json().get('hits', {}).get('hits', [])
        total = resp.json().get('hits', {}).get('total', {}).get('value', 0)

        # 分析结果
        print(f"📈 匹配事件数: {total}")
        fp_rate = self.estimate_false_positive(hits)
        print(f"⚠️ 预计误报率: {fp_rate:.1%}")

        return {
            "rule": rule.get('title'),
            "total_hits": total,
            "false_positive_rate": fp_rate,
            "sample_hits": hits[:5]
        }

    def estimate_false_positive(self, hits):
        """快速误报评估（基于已知正常模式）"""
        if not hits:
            return 0.0

        fp_indicators = 0
        for hit in hits:
            src = hit.get('_source', {})
            process = src.get('process', {})
            cmdline = process.get('command_line', '').lower()
            executable = process.get('executable', '').lower()

            # 正常进程标识
            normal_patterns = [
                'windows update', 'windows defender', 'antivirus',
                'crowdstrike', 'sentinelone', 'carbon black',
                'sccm', 'intune', 'jamf', 'microsoft intune',
                'scheduled task', 'task scheduler',
                'sql server', 'exchange server', 'sharepoint',
                'jenkins', 'gitlab', 'github actions',
            ]

            for pattern in normal_patterns:
                if pattern in cmdline or pattern in executable:
                    fp_indicators += 1
                    break

        return fp_indicators / len(hits)


if __name__ == "__main__":
    tester = SigmaRuleTester(
        es_url="http://elasticsearch:9200",
        es_api_key="your-api-key"
    )

    result = tester.test_against_live_data(
        "rules/ps-encoded.yml",
        "logs-windows*",
        time_range_hours=72
    )
    print(json.dumps(result, indent=2, ensure_ascii=False))
```

---

## 4. 护网增强规则集

护网期间，切换到增强规则集以提升检测灵敏度：

```yaml
# hw_enhanced_rules.yml
# 护网期间启用的增强规则
rules:

# 规则EH01: 所有来自境外IP的外联告警提升1级
- id: hw-eh01
  title: 护网-境外IP连接告警增强
  condition: destination_ip.geo.country NOT IN ('CN') AND NOT destination_ip.is_private
  action: severity += 1

# 规则EH02: 非工作时间（22:00-06:00）任何管理操作
- id: hw-eh02
  title: 护网-非工作时间管理操作
  condition: event.type IN ('user_login','process_start','file_created') AND hour_of_day IN (0,1,2,3,4,5,22,23)
  action: raise_alert

# 规则EH03: 新增本地用户
- id: hw-eh03
  title: 护网-新增本地用户
  condition: event_id:4720 OR (net.exe AND "user /add")
  action: immediate_block

# 规则EH04: 禁用/删除安全产品
- id: hw-eh04
  title: 护网-篡改安全产品
  condition: process.name:("net.exe","sc.exe","taskkill.exe") AND process.command_line:* (defender OR antivirus OR edr OR falcon OR crowdstrike)
  action: emergency_escalation

# 规则EH05: RDP在外网IP连接
- id: hw-eh05
  title: 护网-外网RDP连接
  condition: destination.port:3389 AND NOT source.ip.is_private AND NOT source.ip IN whitelist
  action: alert + auto_block
```

---

## 5. 规则生命周期管理

```
创建 → 测试(灰度) → 调优(降低FP) → 生产 → 定期回顾 → 退役

规则状态：
- experimental: 实验性规则，仅在测试环境
- test: 生产中静默运行（不告警，只记录）
- stable: 生产规则，出告警
- deprecated: 即将退役（有更好的替代规则）
- retired: 已退役

每季度回顾：
- < 5条触发/季度 → 考虑退役或合并
- > 100条触发/季度 + 误报率 > 20% → 需调优
```

```python
# 规则生命周期管理
class RuleLifecycle:
    def quarterly_review(self, rule_id):
        stats = self.get_rule_stats(rule_id, days=90)
        decision = "keep"

        if stats['total_triggers'] < 5:
            decision = "考虑退役 - 触发太少"
        elif stats['false_positive_rate'] > 0.2 and stats['total_triggers'] > 100:
            decision = "需要调优 - 误报率过高"
        elif stats['true_positives'] == 0:
            decision = "考虑退役 - 无真阳性"

        return decision
```

---

## 6. 排错与调优

| 问题 | 排查方法 | 解决方法 |
|------|---------|---------|
| 规则不触发 | 查ES索引是否有对应数据 | 确认日志源覆盖 + 字段映射正确 |
| 误报太多 | 导出告警样本分析 | 增加排除条件 + 白名单 |
| 漏检 | 红蓝对抗验证 | 调整阈值 + 增加新检测维度 |
| 规则影响ES性能 | 检查慢查询日志 | 优化查询 + 添加索引分片 |
| 跨规则冲突 | 审计规则逻辑 | 规则合并 + 优先级排序 |

---

## ✅ 规则编写 Checklist

- [ ] 明确检测目标（ATT&CK Technique）
- [ ] 编写Sigma规则（YAML格式）
- [ ] 映射ELK/Splunk/Wazuh字段
- [ ] 本地测试数据验证
- [ ] ES实时数据测试（静默模式）
- [ ] 误报率评估（< 5%才上生产）
- [ ] 规则文档（描述/参考/误报场景）
- [ ] 部署到生产（状态:stable）
- [ ] 加入监控Dashboard
- [ ] 季度回顾

> 📚 延伸阅读：SOC/001-SOC建设 | SOC/004-威胁狩猎 | HW/015-ATT&CK攻防矩阵
