# 威胁狩猎方法论与实战

> 📅 2026-06-12 | 🎯 精通 | ⏱ 25 min | 分类：安全运营/SOC

## 📋 提纲

1. 威胁狩猎概念与 PEAK 框架
2. 狩猎假设构建方法论
3. 数据源准备
4. 六大经典狩猎场景
5. 完整狩猎流程与工具链
6. 真实案例：APT 组织狩猎过程
7. 排错指南
8. 狩猎成熟度评估

---

## 1. 威胁狩猎概念

### 1.1 什么是威胁狩猎

威胁狩猎不是等告警——是**主动在环境中寻找已规避了安全检测的攻击行为**。

```
传统检测:  攻击 → 触发规则 → 告警 → 响应（被动）
威胁狩猎:  假设 → 查询数据 → 发现异常 → 验证 → 处置（主动）
```

**核心假设**：攻击者已经在网络里，但现有检测没发现。狩猎就是去找他们的藏身之处。

### 1.2 PEAK 狩猎框架

PEAK（Preparation-Execution-Analysis-Knowledge）由 David Bianco 提出，是当前最主流的狩猎框架。

```
阶段1: PREPARATION（准备）
├─ 确定狩猎目标/范围
├─ 构建狩猎假设
├─ 准备数据源和工具
└─ 制定时间窗口

阶段2: EXECUTION（执行）  
├─ 执行查询/分析
├─ 数据可视化
├─ 异常模式识别
└─ 假设验证

阶段3: ANALYSIS（分析）
├─ 确认发现是否真实威胁
├─ 攻击范围评估
├─ 根因分析(RCA)
└─ 影响面评估

阶段4: KNOWLEDGE（沉淀）
├─ 编写狩猎报告
├─ 创建检测规则（Sigma）
├─ 更新狩猎假设库
└─ 分享发现(IOC/TTP)
```

---

## 2. 狩猎假设构建

### 2.1 基于 ATT&CK 的假设构建

```python
#!/usr/bin/env python3
"""
狩猎假设生成器 - 基于 MITRE ATT&CK + 环境资产自动生成狩猎目标
"""

class HuntHypothesisGenerator:
    def __init__(self, mitre_data_url="https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json"):
        self.techniques = self.load_mitre_techniques(mitre_data_url)
        self.asset_inventory = {}  # {asset_type: count}
        self.existing_detections = []  # 已有检测覆盖的Technique ID

    def load_mitre_techniques(self, url):
        """加载 MITRE ATT&CK 数据"""
        import requests
        data = requests.get(url).json()
        techniques = {}
        for obj in data['objects']:
            if obj['type'] == 'attack-pattern':
                techniques[obj['external_references'][0]['external_id']] = {
                    "name": obj['name'],
                    "description": obj.get('description', '')[:200],
                    "platforms": obj.get('x_mitre_platforms', []),
                    "data_sources": obj.get('x_mitre_data_sources', []),
                    "detection": obj.get('x_mitre_detection', '')
                }
        return techniques

    def generate_hypotheses(self, environment_profile):
        """
        基于环境特征自动生成狩猎假设
        environment_profile = {
            "os_distribution": {"windows": 0.7, "linux": 0.25, "macos": 0.05},
            "has_ad": True,
            "has_cloud": True,
            "has_containers": True,
            "critical_apps": ["exchange", "sharepoint", "jenkins"],
            "existing_detections": ["T1059", "T1003", "T1055"],
        }
        """
        hypotheses = []

        # 1. 横向移动假设（如果已有AD且检测覆盖不完整）
        lateral_ttps = {
            "T1550": "使用替代身份验证材料（Pass-the-Hash/Ticket）",
            "T1021.002": "SMB/Windows Admin Shares 横向移动",
            "T1021.004": "SSH 横向移动",
            "T1563.002": "RDP 会话劫持",
            "T1210": "利用远程服务漏洞横向移动"
        }

        if environment_profile.get('has_ad'):
            for ttp_id, description in lateral_ttps.items():
                if ttp_id not in environment_profile.get('existing_detections', []):
                    hypotheses.append({
                        "category": "横向移动",
                        "technique_id": ttp_id,
                        "hypothesis": f"攻击者可能通过{self.techniques.get(ttp_id,{}).get('name',ttp_id)}在内网横向移动",
                        "data_sources": self.techniques.get(ttp_id, {}).get('data_sources', []),
                        "priority": "HIGH" if 'PASS' in description else "MEDIUM"
                    })

        # 2. 持久化假设
        persistence_ttps = {
            "T1547.001": "注册表 Run Key 持久化",
            "T1053.005": "计划任务持久化",
            "T1546.003": "WMI 事件订阅持久化",
            "T1136.001": "创建本地账号",
            "T1543.003": "Windows Service 持久化"
        }
        for ttp_id, description in persistence_ttps.items():
            if ttp_id not in environment_profile.get('existing_detections', []):
                hypotheses.append({
                    "category": "持久化",
                    "technique_id": ttp_id,
                    "hypothesis": f"已入侵的攻击者可能已植入{description}",
                    "data_sources": self.techniques.get(ttp_id, {}).get('data_sources', []),
                    "priority": "HIGH"
                })

        # 3. 数据外泄假设
        exfil_ttps = {
            "T1041": "通过 C2 Channel 外泄数据",
            "T1048.003": "通过非标准端口外泄",
            "T1567.002": "通过云存储服务外泄数据",
            "T1020": "自动化数据外泄"
        }
        for ttp_id, description in exfil_ttps.items():
            if ttp_id not in environment_profile.get('existing_detections', []):
                hypotheses.append({
                    "category": "数据外泄",
                    "technique_id": ttp_id,
                    "hypothesis": f"攻击者可能正在尝试通过{description}外传数据",
                    "data_sources": ["network_flow", "proxy_logs", "dns_logs"],
                    "priority": "HIGH"
                })

        # 4. 云/容器方向（如果有云环境）
        if environment_profile.get('has_cloud'):
            cloud_ttps = {
                "T1525": "云实例元数据服务利用（IMDS）",
                "T1078.004": "云账号凭据使用",
                "T1613": "容器和云资源发现",
                "T1610": "容器逃逸"
            }
            for ttp_id, description in cloud_ttps.items():
                if ttp_id not in environment_profile.get('existing_detections', []):
                    hypotheses.append({
                        "category": "云/容器安全",
                        "technique_id": ttp_id,
                        "hypothesis": f"攻击者可能在云/容器环境中的{description}",
                        "data_sources": ["cloud_audit_logs", "container_logs"],
                        "priority": "MEDIUM"
                    })

        return sorted(hypotheses, key=lambda x: {"HIGH": 0, "MEDIUM": 1, "LOW": 2}[x['priority']])


# 使用示例
generator = HuntHypothesisGenerator()
env = {
    "os_distribution": {"windows": 0.8, "linux": 0.2},
    "has_ad": True,
    "has_cloud": True,
    "has_containers": False,
    "critical_apps": ["exchange", "sharepoint"],
    "existing_detections": ["T1059", "T1003", "T1055", "T1041", "T1021.002"]
}
hypotheses = generator.generate_hypotheses(env)
for i, h in enumerate(hypotheses[:10], 1):
    print(f"{i}. [{h['priority']}] {h['category']}: {h['hypothesis']}")
```

---

## 3. 六大经典狩猎场景

### 场景1：检测 PowerShell 无文件攻击（T1059.001）

**假设**：攻击者使用 PowerShell 下载并内存执行恶意代码，绕过了基于磁盘的 AV。

```sql
-- Elastic KQL 狩猎查询
-- 查找 PowerShell 创建网络连接但未写入磁盘的行为

event.provider:"Microsoft-Windows-Sysmon" 
AND event.code:3                          -- Sysmon Network Connection
AND process.name:"powershell.exe"
AND NOT destination.port:(80,443,53)        -- 排除正常网络
AND file.creation_time:null                  -- 未写入文件（内存执行）
```

```python
# 结果分析脚本
#!/usr/bin/env python3
"""分析 PowerShell 可疑网络连接"""
import json

def analyze_ps_network(hits):
    suspicious = []
    for hit in hits:
        src = hit['_source']
        dest_ip = src.get('destination', {}).get('ip', '')
        dest_port = src.get('destination', {}).get('port', 0)
        cmdline = src.get('process', {}).get('command_line', '')

        # 标注可疑指标
        score = 0
        indicators = []

        # 非标准端口
        if dest_port not in [80, 443, 53, 8080, 8443]:
            score += 3
            indicators.append(f"非标准端口:{dest_port}")

        # 包含下载指令
        download_keywords = ['downloadstring', 'downloadfile', 'invoke-webrequest', 'iwr', 'invoke-restmethod', 'net.webclient', 'frombase64string']
        for kw in download_keywords:
            if kw.lower() in cmdline.lower():
                score += 5
                indicators.append(f"下载关键词:{kw}")
                break

        # Base64 编码命令
        if '-enc' in cmdline.lower() or '-encodedcommand' in cmdline.lower():
            score += 8
            indicators.append("Base64编码命令")

        # 隐藏窗口
        if '-windowstyle hidden' in cmdline.lower() or '-w hidden' in cmdline.lower():
            score += 3
            indicators.append("隐藏窗口")

        if score >= 8:
            suspicious.append({
                "host": src.get('host', {}).get('name', ''),
                "dest_ip": dest_ip,
                "dest_port": dest_port,
                "cmdline": cmdline[:200],
                "score": score,
                "indicators": indicators,
                "timestamp": src.get('@timestamp', '')
            })

    return suspicious
```

### 场景2：Kerberoasting 攻击检测（T1558.003）

**假设**：攻击者在请求大量服务票据（TGS），准备离线破解。

```sql
-- Elastic KQL - Windows Event ID 4769
-- 查找短时间内大量 Kerberos 服务票据请求

event.code:4769
AND winlog.event_data.TicketEncryptionType:"0x17"   -- RC4-HMAC（弱加密，可破解）
AND NOT winlog.event_data.ServiceName:"*$"          -- 排除计算机账号
```

```python
# 分析脚本
def analyze_kerberoasting(events, threshold=10, window_minutes=5):
    """
    检测 Kerberoasting：同一用户在短时间内请求大量不同类型服务票据
    """
    from collections import defaultdict
    from datetime import datetime, timedelta

    user_requests = defaultdict(list)

    for event in events:
        src = event['_source']
        user = src.get('winlog', {}).get('event_data', {}).get('TargetUserName', '')
        service = src.get('winlog', {}).get('event_data', {}).get('ServiceName', '')
        enc_type = src.get('winlog', {}).get('event_data', {}).get('TicketEncryptionType', '')
        timestamp = src.get('@timestamp', '')

        user_requests[user].append({
            "service": service,
            "encryption": enc_type,
            "time": timestamp
        })

    alerts = []
    for user, requests in user_requests.items():
        # 按时间窗口分组
        requests.sort(key=lambda x: x['time'])
        for i in range(len(requests)):
            window_start = requests[i]['time']
            window_requests = [
                r for r in requests[i:]
                if (datetime.fromisoformat(r['time']) - datetime.fromisoformat(window_start)).seconds < window_minutes * 60
            ]
            unique_services = set(r['service'] for r in window_requests)

            if len(unique_services) >= threshold:
                rc4_count = sum(1 for r in window_requests if '0x17' in r['encryption'])
                alerts.append({
                    "user": user,
                    "unique_services": len(unique_services),
                    "total_requests": len(window_requests),
                    "rc4_encrypted": rc4_count,
                    "risk": "HIGH" if rc4_count > 5 else "MEDIUM",
                    "time_window": f"{window_start} 至 {requests[min(i+len(window_requests)-1, len(requests)-1)]['time']}"
                })
                break

    return alerts
```

### 场景3：DNS 隧道检测（T1572）

**假设**：攻击者利用 DNS 查询绕过防火墙建立 C2 通道。

```python
#!/usr/bin/env python3
"""DNS 隧道检测"""

def detect_dns_tunneling(dns_logs, threshold_length=52, threshold_entropy=3.5, threshold_queries=100):
    """
    检测DNS隧道特征：
    1. 查询域名长度异常（>52字符）
    2. 子域名熵值高（随机字符）
    3. 短时间大量查询
    4. TXT/MX 类型查询（常用于隧道）
    """
    import math
    from collections import Counter, defaultdict

    def entropy(s):
        """计算字符串熵值"""
        if not s:
            return 0
        counter = Counter(s)
        length = len(s)
        return -sum(count/length * math.log2(count/length) for count in counter.values())

    suspicious_queries = []
    client_stats = defaultdict(lambda: {"count": 0, "suspicious": 0, "total_bytes": 0, "query_types": set()})

    for log in dns_logs:
        src = log['_source']
        query = src.get('dns', {}).get('question', {}).get('name', '')
        query_type = src.get('dns', {}).get('question', {}).get('type', '')
        client_ip = src.get('source', {}).get('ip', '')
        timestamp = src.get('@timestamp', '')

        # 提取子域名
        parts = query.rstrip('.').split('.')
        subdomain = '.'.join(parts[:-2]) if len(parts) >= 3 else ''

        client_stats[client_ip]["count"] += 1
        client_stats[client_ip]["query_types"].add(query_type)

        # 检测指标
        flags = []

        # 1. 长度异常
        if len(subdomain) > threshold_length:
            flags.append(f"长域名:{len(subdomain)}字符")

        # 2. 熵值异常
        ent = entropy(subdomain)
        if ent > threshold_entropy:
            flags.append(f"高熵值:{ent:.2f}")

        # 3. TXT 查询（常用于DNS隧道）
        if query_type == 'TXT':
            flags.append("TXT类型查询")

        # 4. MX 查询（非邮件服务器频繁查询）
        if query_type == 'MX':
            flags.append("MX类型查询")

        # 5. 查询域名包含Base64特征
        import re
        if re.match(r'^[A-Za-z0-9+/=]{20,}$', subdomain):
            flags.append("疑似Base64编码")

        if flags:
            client_stats[client_ip]["suspicious"] += 1
            client_stats[client_ip]["total_bytes"] += len(query)
            suspicious_queries.append({
                "client_ip": client_ip,
                "query": query,
                "type": query_type,
                "entropy": round(ent, 2),
                "flags": flags,
                "timestamp": timestamp
            })

    # 汇总客户端统计
    alerts = []
    for ip, stats in client_stats.items():
        if stats["suspicious"] >= 10 and stats["count"] >= threshold_queries:
            alerts.append({
                "client_ip": ip,
                "total_queries": stats["count"],
                "suspicious_queries": stats["suspicious"],
                "suspicious_ratio": f"{stats['suspicious']/stats['count']*100:.1f}%",
                "total_bytes": stats["total_bytes"],
                "query_types": list(stats["query_types"]),
                "risk": "HIGH" if stats["suspicious"] > 50 else "MEDIUM"
            })

    return alerts
```

### 场景4：凭证转储检测（T1003）

**假设**：攻击者使用 Mimikatz / procdump 转储 LSASS 进程内存。

```sql
-- Elastic KQL - 检测 LSASS 内存访问
-- Sysmon Event ID 10 (ProcessAccess)

event.code:10
AND winlog.event_data.TargetImage:*lsass.exe
AND winlog.event_data.GrantedAccess:*0x1*
AND NOT process.name:(*MsMpEng.exe* OR *taskhostw.exe* OR *svchost.exe*)
AND NOT winlog.event_data.SourceImage:*\windows\system32\*

-- 过滤掉正常进程后，任何非系统进程访问LSASS = 高可疑
```

```python
def detect_credential_dumping(process_access_events):
    """检测 LSASS 凭证转储"""
    alerts = []
    known_legitimate = [
        'MsMpEng.exe',    # Windows Defender
        'taskhostw.exe',  # Task Host
        'svchost.exe',    # Service Host
        'WerFault.exe',   # Windows Error Reporting
        'vmms.exe',       # Hyper-V
        'vmtoolsd.exe',   # VMware Tools
    ]

    for event in process_access_events:
        src = event['_source']
        source_process = src.get('process', {}).get('name', '')
        source_cmdline = src.get('process', {}).get('command_line', '')
        target_process = src.get('winlog', {}).get('event_data', {}).get('TargetImage', '')
        granted_access = src.get('winlog', {}).get('event_data', {}).get('GrantedAccess', '')

        if 'lsass.exe' not in target_process:
            continue

        if any(legit.lower() in source_process.lower() for legit in known_legitimate):
            continue

        # 检查访问权限是否包含 PROCESS_VM_READ (0x0010)
        access_int = int(granted_access, 16) if granted_access.startswith('0x') else 0
        has_vm_read = bool(access_int & 0x0010)

        alerts.append({
            "host": src.get('host', {}).get('name', ''),
            "source_process": source_process,
            "cmdline": source_cmdline[:200],
            "granted_access": granted_access,
            "has_vm_read": has_vm_read,
            "risk": "HIGH" if has_vm_read else "MEDIUM",
            "timestamp": src.get('@timestamp', '')
        })

    return alerts
```

### 场景5：计划任务持久化检测（T1053.005）

```python
def detect_scheduled_task_persistence(task_events):
    """
    检测可疑计划任务：
    1. 通过 schtasks 创建的隐藏任务
    2. 执行路径在 Temp/AppData
    3. 以 SYSTEM 权限运行且无触发器约束
    """
    alerts = []

    suspicious_paths = [
        '$env:temp', '%temp%', '\\appdata\\', '\\programdata\\',
        '\\users\\public\\', '\\windows\\temp\\'
    ]

    for event in task_events:
        src = event['_source']
        task_name = src.get('winlog', {}).get('event_data', {}).get('TaskName', '')
        task_command = src.get('winlog', {}).get('event_data', {}).get('Command', '')
        task_author = src.get('winlog', {}).get('event_data', {}).get('Author', '')
        task_trigger = src.get('winlog', {}).get('event_data', {}).get('Triggers', '')
        task_user = src.get('winlog', {}).get('event_data', {}).get('UserId', '')

        score = 0
        flags = []

        # 1. 路径可疑
        command_lower = task_command.lower()
        for sp in suspicious_paths:
            if sp in command_lower:
                score += 5
                flags.append(f"可疑路径:{sp}")
                break

        # 2. 随机名任务
        import re
        if re.match(r'^[A-Za-z0-9]{8,}$', task_name):
            score += 3
            flags.append("随机任务名")

        # 3. SYSTEM 权限
        if 'SYSTEM' in task_user:
            score += 2

        # 4. 编码命令
        if '-enc' in command_lower or '-e ' in command_lower:
            score += 8
            flags.append("Base64编码命令")

        # 5. 下载命令
        download_kws = ['downloadstring', 'downloadfile', '.downloadfile(', 'iwr ', 'invoke-webrequest', 'wget ']
        if any(kw in command_lower for kw in download_kws):
            score += 8
            flags.append("远程下载")

        if score >= 6:
            alerts.append({
                "task_name": task_name,
                "command": task_command[:300],
                "user": task_user,
                "score": score,
                "flags": flags,
                "risk": "HIGH" if score >= 12 else "MEDIUM",
                "host": src.get('host', {}).get('name', '')
            })

    return alerts
```

### 场景6：C2 Beacon 检测

```python
def detect_c2_beacon(netflow_data, threshold_jitter=2, threshold_interval=3600):
    """
    检测C2 Beacon特征：
    1. 固定间隔的心跳连接
    2. 每次连接传输数据量相近
    3. 目标IP无明显DNS解析记录（硬编码C2 IP）
    """
    from datetime import datetime
    from collections import defaultdict

    client_connections = defaultdict(list)

    for flow in netflow_data:
        src = flow['_source']
        client_ip = src.get('source', {}).get('ip', '')
        server_ip = src.get('destination', {}).get('ip', '')
        server_port = src.get('destination', {}).get('port', 0)
        bytes_sent = src.get('network', {}).get('bytes', 0)
        timestamp = src.get('@timestamp', '')

        # 过滤掉常见正常连接
        if server_port in [80, 443, 53, 22, 123, 3389]:
            continue

        key = f"{client_ip}->{server_ip}:{server_port}"
        client_connections[key].append({
            "bytes_sent": bytes_sent,
            "timestamp": timestamp
        })

    beacons = []
    for conn_key, flows in client_connections.items():
        if len(flows) < 10:  # 至少10次连接
            continue

        # 排序并计算间隔
        flows.sort(key=lambda x: x['timestamp'])
        intervals = []
        bytes_list = []

        for i in range(1, min(len(flows), 50)):
            t1 = datetime.fromisoformat(flows[i-1]['timestamp'])
            t2 = datetime.fromisoformat(flows[i]['timestamp'])
            intervals.append((t2 - t1).total_seconds())
            bytes_list.append(flows[i]['bytes_sent'])

        if not intervals:
            continue

        # 计算间隔的标准差（越小越规律 = 越可疑）
        import statistics
        avg_interval = statistics.mean(intervals)
        std_interval = statistics.stdev(intervals) if len(intervals) > 1 else 0
        avg_bytes = statistics.mean(bytes_list)
        std_bytes = statistics.stdev(bytes_list) if len(bytes_list) > 1 else 0

        # Beacon评分
        score = 0
        flags = []

        # 规律性
        if std_interval < threshold_jitter:
            score += 8
            flags.append(f"心跳抖动:{std_interval:.1f}s")

        # 间隔时间在合理范围（30s - 24h）
        if 30 < avg_interval < 86400:
            score += 3
            flags.append(f"心跳间隔:{avg_interval:.0f}s")

        # 流量稳定（每次传输量相近）
        if avg_bytes > 0 and std_bytes / avg_bytes < 0.3:
            score += 5
            flags.append(f"流量稳定:{avg_bytes:.0f}±{std_bytes:.0f}bytes")

        if score >= 8:
            beacons.append({
                "connection": conn_key,
                "flows_count": len(flows),
                "avg_interval_seconds": round(avg_interval),
                "interval_jitter": round(std_interval, 1),
                "avg_bytes": round(avg_bytes),
                "bytes_jitter_ratio": round(std_bytes / avg_bytes if avg_bytes > 0 else 0, 2),
                "score": score,
                "flags": flags,
                "risk": "HIGH" if score >= 13 else "MEDIUM"
            })

    return sorted(beacons, key=lambda x: x['score'], reverse=True)
```

---

## 4. 完整狩猎流程

### Day 1-2：准备阶段
1. 确定本次狩猎主题（横向移动/持久化/数据外泄/C2通信）
2. 阅读 MITRE ATT&CK 相关 Techniqu
3. 构建 3-5 个狩猎假设
4. 确认数据源可用性（ES 索引/时间范围）
5. 准备 Jupyter Notebook 分析环境

### Day 3-5：执行阶段
1. 执行 ES 查询，获取原始数据
2. 使用 Python/Pandas 进行数据清洗和聚合
3. 运行上述检测脚本
4. 可疑发现 → 人工验证

### Day 6-7：分析阶段
1. 确认发现是否为真实威胁
2. 如果确认：追溯攻击入口（初始访问方式）
3. 评估影响范围（受影响资产/账号/数据）
4. 启动应急响应

### Day 8-10：沉淀阶段
1. 编写狩猎报告
2. 创建 Sigma 检测规则
3. 提交 IOC 到 MISP/威胁情报平台
4. 更新安全策略/EDR规则

---

## 5. 工具链

| 工具 | 用途 |
|------|------|
| Jupyter Notebook | 狩猎分析环境 |
| Elasticsearch + Kibana | 数据查询与可视化 |
| Python (pandas, numpy) | 数据分析 |
| Sysmon (SwiftOnSecurity 配置) | Windows 终端检测 |
| osquery | Linux/macOS 终端检测 |
| Zeek | 网络流量分析 |
| Sigma CLI | 检测规则管理 |
| MITRE ATT&CK Navigator | TTP 覆盖分析 |
| VSCode + REST Client | ES API 调试 |

---

## 6. 真实案例：检测某 APT 组织

**背景**：在某次护网期间，常规告警未发现异常，但威胁情报显示某 APT 组织近期活跃。

**狩猎假设**：假定该组织已通过鱼叉邮件获取初始访问，正在使用 PowerShell 进行内存驻留。

**过程**：
1. 查询过去 14 天所有 PowerShell 执行记录（596432 条）
2. 过滤出包含网络连接的进程（3421 条）
3. 过滤出连接非 80/443 端口的行为（234 条）
4. 过滤出 Base64 编码命令（12 条）
5. 人工分析 12 条 → 发现 2 条异常

**发现**：
- 一台开发测试服务器的 PowerShell 在凌晨 3 点向境外 IP 建立连接
- 命令解 Base64 后为 Cobalt Strike Beacon
- 溯源确认入口：该服务器的 Jenkins 存在 CVE-2022-20612 漏洞
- 攻击者在环境内驻留 11 天未被发现

**处置**：
- 隔离服务器
- 回溯 11 天的 Beacon 活动
- 检出 3 台被横向移动的服务器
- 清除持久化机制（计划任务 × 2）
- 创建 4 条 Sigma 规则

---

## 7. 排错指南

```bash
# 问题1: ES查询超时
# 解决: 增加 timeout + 缩小时间窗口
GET /logs-*/_search?timeout=120s
{
  "query": { ... },
  "timeout": "120s"
}

# 问题2: Jupyter 内存不足分析大数据集
# 解决: 使用 scroll API 分批读取
from elasticsearch import Elasticsearch
es = Elasticsearch(['http://elasticsearch:9200'])

page = es.search(
    index='logs-*',
    scroll='5m',
    size=10000,
    body={"query": {"match_all": {}}}
)
sid = page['_scroll_id']
total = page['hits']['total']['value']
processed = 0

while processed < total:
    page = es.scroll(scroll_id=sid, scroll='5m')
    # 处理这一批数据
    processed += len(page['hits']['hits'])
```

---

## ✅ 狩猎 Checklist

- [ ] 确定本次狩猎主题和时间窗口
- [ ] 构建 3-5 个具体狩猎假设
- [ ] 确认 ES 数据源可用性
- [ ] 准备 Jupyter 分析环境
- [ ] 执行初始查询（大范围过滤）
- [ ] 数据清洗（去重/范式化/去噪）
- [ ] 运行专业检测脚本
- [ ] 可疑发现人工核验
- [ ] 确认威胁：评估影响范围 → 启动应急
- [ ] 无发现：更新狩猎假设 → 下一主题
- [ ] 编写狩猎报告 + Sigma 规则
- [ ] 团队分享：Lunch & Learn

> 📚 延伸阅读：SOC/002-SIEM规则编写 | SOC/005-态势感知 | HW/015-ATT&CK攻防矩阵
