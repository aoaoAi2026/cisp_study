# MITRE ATT&CK 攻防矩阵护网实战应用

> 📅 2026-06-12 | 🎯 精通 | ⏱ 25 min | 分类：护网工程

## 📋 提纲

1. ATT&CK 框架在护网中的定位
2. 攻击链还原与 ATT&CK Mapping
3. 基于 ATT&CK 的检测覆盖率分析
4. 护网红队常用 TTP 清单
5. 蓝队对应检测规则映射
6. ATT&CK Navigator 实战
7. 自动化 ATT&CK 映射工具

---

## 1. ATT&CK 框架在护网中的定位

### 1.1 蓝队用法

```
护网前：ATT&CK覆盖度分析 → 找出检测盲区 → 优先补充检测
护网中：攻击链Mapping → 理解攻击者意图 → 预测下一步
护网后：TTP覆盖复盘 → 漏检原因分析 → 规则补充
```

### 1.2 红队视角（知己知彼）

护网中红队最常用的 Top 15 技术：

| 排名 | Technique ID | 技术名称 | 阶段 | 检测难度 |
|------|-------------|---------|------|---------|
| 1 | T1059.001 | PowerShell | 执行 | ⭐⭐ |
| 2 | T1566.001 | 鱼叉附件 | 初始访问 | ⭐⭐⭐ |
| 3 | T1003.001 | LSASS Dump | 凭据访问 | ⭐⭐ |
| 4 | T1055.001 | 进程注入 | 防御规避 | ⭐⭐⭐ |
| 5 | T1021.002 | SMB横向移动 | 横向移动 | ⭐⭐ |
| 6 | T1558.003 | Kerberoasting | 凭据访问 | ⭐ |
| 7 | T1547.001 | Run Key持久化 | 持久化 | ⭐ |
| 8 | T1070.004 | 文件删除 | 防御规避 | ⭐⭐⭐ |
| 9 | T1562.001 | 禁用安全工具 | 防御规避 | ⭐⭐ |
| 10| T1090.001 | 内网代理 | C2 | ⭐⭐ |
| 11| T1048.003 | 非标端口外联 | 外泄 | ⭐⭐ |
| 12| T1486 | 数据加密勒索 | 影响 | ⭐ |
| 13| T1136.001 | 创建本地账号 | 持久化 | ⭐ |
| 14| T1190 | 公网应用漏洞 | 初始访问 | ⭐⭐ |
| 15| T1572 | DNS隧道 | C2 | ⭐⭐⭐ |

---

## 2. 攻击链还原与 Mapping

### 2.1 自动化攻击链还原

```python
#!/usr/bin/env python3
"""
ATT&CK 攻击链自动还原器
从SIEM告警/EDR事件中自动提取TTP并还原攻击链
"""

import json
import requests
from datetime import datetime, timedelta
from collections import defaultdict

class AttackChainReconstructor:
    # TTP 检测规则映射：检测到的事件 → ATT&CK Technique
    DETECTION_TO_TTP = {
        # 初始访问
        "external_exploit_attempt": "T1190",
        "phishing_email_detected": "T1566.001",
        "vpn_bruteforce_success": "T1078",
        "external_rdp_connection": "T1021.001",

        # 执行
        "powershell_encoded_command": "T1059.001",
        "cmd_execution": "T1059.003",
        "wmi_execution": "T1047",
        "scheduled_task_created": "T1053.005",
        "service_created": "T1543.003",

        # 持久化
        "run_key_added": "T1547.001",
        "wmi_subscription_created": "T1546.003",
        "new_local_user_created": "T1136.001",
        "startup_folder_modified": "T1547.001",

        # 权限提升
        "uac_bypass": "T1548.002",
        "token_manipulation": "T1134",
        "printspooler_exploit": "T1068",
        "service_permission_abuse": "T1574.002",

        # 防御规避
        "defender_disabled": "T1562.001",
        "firewall_rule_modified": "T1562.004",
        "process_injection": "T1055.001",
        "file_deletion_evidence": "T1070.004",
        "timestomp": "T1070.006",
        "disable_logging": "T1562.002",

        # 凭据访问
        "lsass_memory_access": "T1003.001",
        "sam_dump": "T1003.002",
        "ntds_dump": "T1003.003",
        "kerberoasting": "T1558.003",
        "asrep_roasting": "T1558.004",
        "dll_side_loading": "T1574.002",

        # 发现
        "network_scan": "T1046",
        "system_info_collection": "T1082",
        "account_discovery": "T1087",
        "domain_trust_discovery": "T1482",
        "file_directory_discovery": "T1083",

        # 横向移动
        "smb_admin_share": "T1021.002",
        "wmi_lateral": "T1047",
        "psexec": "T1569.002",
        "rdp_lateral": "T1021.001",
        "winrm_lateral": "T1021.006",
        "dcom_lateral": "T1021.003",

        # 收集
        "archive_collection": "T1560.001",
        "email_collection": "T1114",
        "clipboard_data": "T1115",
        "screen_capture": "T1113",
        "keylogging": "T1056.001",

        # C2
        "dns_tunneling": "T1572",
        "http_beacon": "T1071.001",
        "https_beacon": "T1071.001",
        "proxy_usage": "T1090.001",
        "web_service_c2": "T1102",

        # 外泄
        "data_exfiltration_dns": "T1048.001",
        "data_exfiltration_http": "T1048.002",
        "data_exfiltration_cloud": "T1567.002",
    }

    TACTIC_MAP = {
        "T1190": "Initial Access", "T1566": "Initial Access", "T1078": "Initial Access",
        "T1059": "Execution", "T1047": "Execution", "T1053": "Execution", "T1543": "Execution",
        "T1547": "Persistence", "T1546": "Persistence", "T1136": "Persistence",
        "T1548": "Privilege Escalation", "T1134": "Privilege Escalation", "T1068": "Privilege Escalation",
        "T1562": "Defense Evasion", "T1055": "Defense Evasion", "T1070": "Defense Evasion",
        "T1003": "Credential Access", "T1558": "Credential Access",
        "T1046": "Discovery", "T1082": "Discovery", "T1087": "Discovery",
        "T1021": "Lateral Movement", "T1569": "Lateral Movement",
        "T1560": "Collection", "T1114": "Collection",
        "T1572": "Command and Control", "T1071": "Command and Control", "T1090": "Command and Control",
        "T1048": "Exfiltration", "T1567": "Exfiltration",
    }

    def __init__(self, es_url):
        self.es = es_url

    def reconstruct_from_incident(self, incident_id):
        """
        从单个安全事件还原攻击链
        
        输入: TheHive/SIEM 事件ID
        输出: MITRE ATT&CK 攻击链
        """
        # 1. 获取事件相关的主机名和IP
        incident = self.get_incident(incident_id)
        if not incident:
            return None

        hosts = incident.get('affected_hosts', [])
        timeframe = incident.get('timeframe', {})  # {start, end}

        # 2. 查询这些主机上在时间窗口内的所有安全事件
        events = self.query_es_security_events(hosts, timeframe)

        # 3. 将事件映射为 TTP
        ttps = self.map_events_to_ttps(events)

        # 4. 按时间排序并构建攻击链
        timeline = self.build_timeline(ttps)

        # 5. 生成报告
        return self.generate_report(incident, timeline)

    def map_events_to_ttps(self, events):
        """将安全事件映射为ATT&CK Technique"""
        ttps = []

        for event in events:
            event_type = event.get('event_type', '')
            ttp_id = None

            # 直接匹配
            if event_type in self.DETECTION_TO_TTP:
                ttp_id = self.DETECTION_TO_TTP[event_type]
            else:
                # 模糊匹配
                ttp_id = self.fuzzy_match(event)

            if ttp_id:
                tactic = self.get_tactic(ttp_id)
                ttps.append({
                    "technique_id": ttp_id,
                    "tactic": tactic,
                    "timestamp": event.get('@timestamp', ''),
                    "host": event.get('host', {}).get('name', ''),
                    "source_event": event_type,
                    "details": event.get('details', ''),
                    "confidence": "HIGH" if event_type in self.DETECTION_TO_TTP else "MEDIUM"
                })

        return ttps

    def fuzzy_match(self, event):
        """模糊匹配：根据事件中的字段推测TTP"""
        process_cmdline = event.get('process', {}).get('command_line', '').lower()

        # 进程命令行特征匹配
        if 'mimikatz' in process_cmdline:
            return 'T1003.001'
        if 'procdump' in process_cmdline and 'lsass' in process_cmdline:
            return 'T1003.001'
        if 'bloodhound' in process_cmdline:
            return 'T1482'
        if 'ntds' in process_cmdline and 'dump' in process_cmdline:
            return 'T1003.003'
        if 'schtasks' in process_cmdline and '/create' in process_cmdline:
            return 'T1053.005'
        if 'net use' in process_cmdline and '\\\\' in process_cmdline:
            return 'T1021.002'
        if 'psexec' in process_cmdline:
            return 'T1569.002'
        if 'certutil' in process_cmdline and ('urlcache' in process_cmdline or 'split' in process_cmdline):
            return 'T1105'
        if 'bitsadmin' in process_cmdline and 'transfer' in process_cmdline:
            return 'T1197'
        if 'net user' in process_cmdline and '/add' in process_cmdline:
            return 'T1136.001'

        return None

    def get_tactic(self, technique_id):
        """根据Technique ID获取Tactic"""
        for prefix, tactic in self.TACTIC_MAP.items():
            if technique_id.startswith(prefix):
                return tactic
        return "Unknown"

    def build_timeline(self, ttps):
        """构建时间线"""
        # 去重（同一Technique在同一主机上只保留首次出现）
        seen = set()
        unique_ttps = []
        for ttp in sorted(ttps, key=lambda x: x['timestamp']):
            key = f"{ttp['technique_id']}_{ttp['host']}"
            if key not in seen:
                seen.add(key)
                unique_ttps.append(ttp)

        # 按MITRE攻击战术顺序排列
        tactic_order = [
            "Initial Access", "Execution", "Persistence",
            "Privilege Escalation", "Defense Evasion",
            "Credential Access", "Discovery",
            "Lateral Movement", "Collection",
            "Command and Control", "Exfiltration", "Impact"
        ]

        ordered = []
        for tactic in tactic_order:
            tactic_ttps = [t for t in unique_ttps if t['tactic'] == tactic]
            ordered.extend(tactic_ttps)

        return ordered

    def generate_report(self, incident, timeline):
        """生成ATT&CK攻击链报告"""
        # 按Tactic分组统计
        tactic_summary = defaultdict(list)
        for ttp in timeline:
            tactic_summary[ttp['tactic']].append(ttp)

        report = {
            "incident_id": incident.get('id'),
            "incident_name": incident.get('title'),
            "generated_at": datetime.now().isoformat(),
            "attack_chain": timeline,
            "tactic_summary": {
                tactic: {
                    "count": len(ttps),
                    "techniques": list(set(t['technique_id'] for t in ttps))
                }
                for tactic, ttps in tactic_summary.items()
            },
            "coverage_analysis": self.analyze_coverage(timeline),
            "recommendations": self.generate_recommendations(timeline)
        }
        return report

    def analyze_coverage(self, timeline):
        """分析检测覆盖情况"""
        all_techniques = set(t['technique_id'] for t in timeline)
        detected_by_siem = sum(1 for t in timeline if t['confidence'] == 'HIGH')
        missed = sum(1 for t in timeline if t['confidence'] == 'MEDIUM')

        return {
            "total_techniques_used": len(all_techniques),
            "detected_by_automated_rules": detected_by_siem,
            "detected_by_manual_analysis": missed,
            "detection_gaps": [
                t for t in timeline
                if t['confidence'] == 'MEDIUM'
            ]
        }

    def generate_recommendations(self, timeline):
        """生成检测规则补充建议"""
        gaps = [t for t in timeline if t['confidence'] == 'MEDIUM']
        recs = []

        for gap in gaps:
            recs.append({
                "technique_id": gap['technique_id'],
                "tactic": gap['tactic'],
                "recommendation": f"添加针对 {gap['technique_id']} 的Sigma检测规则",
                "data_sources_needed": self.suggest_data_sources(gap['technique_id'])
            })

        return recs

    def suggest_data_sources(self, technique_id):
        """根据Technique ID建议需要的日志源"""
        sources = {
            'T1003.001': ['Sysmon Event 10 (ProcessAccess)', 'Windows Event 4663'],
            'T1059.001': ['Sysmon Event 1 (ProcessCreation)', 'PowerShell Transcript Logging'],
            'T1021.002': ['Sysmon Event 3 (NetworkConnection)', 'Windows Event 5140'],
            'T1558.003': ['Windows Event 4769', 'Windows Event 4768'],
            'T1572': ['DNS Query Logs', 'Zeek dns.log'],
            'T1053.005': ['Windows Event 4698', 'Sysmon Event 1'],
            'T1136.001': ['Windows Event 4720', 'Windows Event 4722'],
            'T1562.001': ['Sysmon Event 1', 'Windows Event 1102'],
        }
        return sources.get(technique_id, ['通用日志源'])

    def get_incident(self, incident_id):
        """从TheHive获取事件详情"""
        return {
            "id": incident_id,
            "title": f"事件-{incident_id}",
            "affected_hosts": ["HOST01", "HOST02"],
            "timeframe": {"start": "2026-06-12T00:00:00", "end": "2026-06-12T23:59:59"}
        }

    def query_es_security_events(self, hosts, timeframe):
        return []


# 使用示例
if __name__ == "__main__":
    reconstructor = AttackChainReconstructor("http://es:9200")
    report = reconstructor.reconstruct_from_incident("INC-2026-0612-001")
    print(json.dumps(report, indent=2, ensure_ascii=False))
```

---

## 3. 检测覆盖率分析

### 3.1 ATT&CK Navigator 自动化

```python
#!/usr/bin/env python3
"""
ATT&CK Navigator 热力图生成器
根据现有检测规则，生成覆盖度热力图
"""

import json
import yaml
import requests

class ATTACKCoverageHeatmap:
    def __init__(self, mitre_data_url):
        """加载MITRE ATT&CK数据"""
        data = requests.get(mitre_data_url).json()
        self.techniques = {}
        for obj in data['objects']:
            if obj['type'] == 'attack-pattern':
                tech_id = obj['external_references'][0]['external_id']
                self.techniques[tech_id] = {
                    "name": obj['name'],
                    "tactics": [p['phase_name'] for p in obj.get('kill_chain_phases', [])],
                    "platforms": obj.get('x_mitre_platforms', []),
                }

    def load_sigma_rules(self, rules_dir):
        """加载现有Sigma规则，提取覆盖的Technique"""
        import glob
        covered = {}

        for rule_file in glob.glob(f"{rules_dir}/**/*.yml", recursive=True):
            try:
                with open(rule_file, 'r') as f:
                    rule = yaml.safe_load(f)

                tags = rule.get('tags', [])
                for tag in tags:
                    if tag.startswith('attack.t'):
                        tech_id = tag.replace('attack.', '').upper()
                        if tech_id not in covered:
                            covered[tech_id] = {"rules": [], "rule_count": 0}
                        covered[tech_id]['rules'].append({
                            "title": rule.get('title', ''),
                            "level": rule.get('level', ''),
                            "status": rule.get('status', '')
                        })
                        covered[tech_id]['rule_count'] += 1
            except:
                pass

        return covered

    def generate_navigator_json(self, covered, output_file="attack_coverage.json"):
        """生成ATT&CK Navigator JSON"""
        navigator = {
            "name": "检测覆盖率热力图",
            "versions": {
                "attack": "14",
                "navigator": "4.9.0",
                "layer": "4.5"
            },
            "domain": "enterprise-attack",
            "description": "蓝队检测覆盖度分析",
            "filters": {"platforms": ["Windows", "Linux", "macOS"]},
            "sorting": 0,
            "layout": {
                "layout": "side",
                "aggregateFunction": "average",
                "showID": True,
                "showName": True
            },
            "hideDisabled": False,
            "techniques": [],
            "gradient": {
                "colors": [
                    "#ff6666",  # 红色 - 无覆盖
                    "#ffe766",  # 黄色 - 部分覆盖（1条规则）
                    "#8ec843",  # 绿色 - 良好覆盖（2+条规则）
                ],
                "minValue": 0,
                "maxValue": 2
            },
            "legendItems": [
                {"label": "无检测", "color": "#ff6666"},
                {"label": "部分检测(1条规则)", "color": "#ffe766"},
                {"label": "良好检测(2+条规则)", "color": "#8ec843"},
            ]
        }

        for tech_id, tech_info in self.techniques.items():
            coverage = covered.get(tech_id, {})
            rule_count = coverage.get('rule_count', 0)

            entry = {
                "techniqueID": tech_id,
                "tactic": tech_info['tactics'][0] if tech_info['tactics'] else '',
                "score": min(rule_count, 2),  # 0-2分
                "color": "",
                "comment": "",
                "enabled": True,
                "metadata": [],
                "links": [],
                "showSubtechniques": True
            }

            if rule_count == 0:
                entry['comment'] = f"⚠️ 无检测覆盖 - {tech_info['name']}"
            elif rule_count == 1:
                entry['comment'] = f"检测覆盖: {coverage['rules'][0]['title']}"
            else:
                entry['comment'] = f"检测覆盖: {rule_count}条规则"

            navigator['techniques'].append(entry)

        with open(output_file, 'w') as f:
            json.dump(navigator, f, indent=2)

        return navigator

    def generate_gap_report(self, covered):
        """生成检测盲区报告"""
        gaps = []
        for tech_id, tech_info in self.techniques.items():
            if tech_id not in covered:
                gaps.append({
                    "technique_id": tech_id,
                    "name": tech_info['name'],
                    "tactics": tech_info['tactics'],
                    "platforms": tech_info['platforms'],
                    "priority": self.calculate_gap_priority(tech_id, tech_info['tactics'])
                })

        # 按优先级排序
        gaps.sort(key=lambda x: x['priority'], reverse=True)
        return gaps

    def calculate_gap_priority(self, tech_id, tactics):
        """计算检测盲区优先级"""
        score = 0

        # 初始访问/执行/凭据访问 = 最高优先级
        high_priority_tactics = [
            'initial-access', 'execution', 'credential-access',
            'defense-evasion', 'lateral-movement'
        ]
        for tactic in tactics:
            if tactic in high_priority_tactics:
                score += 10

        # Windows平台 + 5分（最常见目标）
        if 'Windows' in self.techniques.get(tech_id, {}).get('platforms', []):
            score += 5

        return score


if __name__ == "__main__":
    heatmap = ATTACKCoverageHeatmap(
        "https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json"
    )

    covered = heatmap.load_sigma_rules("/opt/sigma/rules")
    heatmap.generate_navigator_json(covered)

    gaps = heatmap.generate_gap_report(covered)
    print(f"检测盲区: {len(gaps)} 个Technique")
    for gap in gaps[:10]:
        print(f"  [{''.join(gap['tactics'])}] {gap['technique_id']}: {gap['name']} (优先级:{gap['priority']})")
```

---

## 4. 护网检测盲区 Top 10

根据实战经验，护网中最容易漏检的 10 个技术：

| 排名 | Technique | 为什么容易漏检 | 建议数据源 |
|------|-----------|--------------|-----------|
| 1 | T1562.002 禁用Windows日志 | 攻击者先关日志，后续再无告警 | Wazuh Agent连续在线检查 |
| 2 | T1572 DNS隧道 | DNS流量通常不被深度检测 | Zeek dns.log + 熵值分析 |
| 3 | T1090.001 内网代理 | 代理流量混淆在正常HTTP中 | 非标准端口HTTP + JA3指纹 |
| 4 | T1070.004 文件删除 | 删除后无证据 | Sysmon FileDelete事件 |
| 5 | T1556.003 Kerberos Ticket | 合法票据难以区分 | 非工作时间TGT使用 |
| 6 | T1021.001 RDP横向 | RDP加密流量难以检测 | Windows Event 4776 + 源IP分析 |
| 7 | T1567.002 云存储外泄 | 使用合法云服务(阿里云OSS等) | 代理日志 + 流量大小异常 |
| 8 | T1613 云资源发现 | 云API调用不在传统SIEM范围 | CloudTrail/操作审计日志 |
| 9 | T1020 自动化外泄 | 分段传输，单次流量小 | NetFlow累计流量分析 |
| 10| T1210 BlueKeep等远程漏洞 | 旧系统漏洞扫描不覆盖 | 全量漏洞扫描 + 资产发现 |

---

## 5. 排错与优化

| 问题 | 解决 |
|------|------|
| Navigator热力图不更新 | 重新运行生成脚本，检查MITRE数据源版本 |
| 规则TTP标记不全 | Sigma规则中tags必须包含 `attack.tXXXX`格式 |
| 检测覆盖度过低（<30%） | 优先补高优先级盲区 |
| 护网期间TTP快速变化 | 每次交班更新Navigator热力图 |

---

## ✅ ATT&CK Mapping Checklist

- [ ] 护网前 ATT&CK 覆盖率分析（目标 > 50%）
- [ ] 高优先级盲区补充检测规则
- [ ] 攻击链还原模板准备（含PS脚本）
- [ ] Navigator 热力图部署
- [ ] 护网中每日更新 TTP 覆盖
- [ ] 每起 P1 事件攻击链 Mapping
- [ ] 护网后 TTP 复盘 + 规则补充

> 📚 延伸阅读：SOC/004-威胁狩猎 | SOC/008-SIEM规则编写 | HW/001-蓝队防护方案
