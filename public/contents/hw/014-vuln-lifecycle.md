# 漏洞全生命周期管理与护网修复实战

> 📅 2026-06-12 | 🎯 进阶 | ⏱ 20 min | 分类：护网工程

## 📋 提纲

1. 漏洞全生命周期管理框架
2. 漏洞发现（扫描/众测/情报）
3. 漏洞评估（CVSS/EPSS/资产价值）
4. 修复排期与SLA
5. 修复验证
6. 护网前漏洞大扫除

---

## 1. 漏洞全生命周期框架

```
发现 → 评估 → 排期 → 修复 → 验证 → 关闭 → 回顾
  ↑                                                │
  └──────────────── 持续扫描 ──────────────────────┘

PDCA闭环：
Plan：  确定扫描范围+频率+标准
Do：    执行扫描 → 评估风险 → 分配修复
Check： 验证修复 → 追踪SLA → 统计指标
Act：   优化流程 → 调整策略 → 更新基线
```

---

## 2. 漏洞发现

### 2.1 多层次扫描

```python
#!/usr/bin/env python3
"""自动化漏洞扫描调度器"""

import subprocess
import json
from datetime import datetime

class VulnScanScheduler:
    def __init__(self):
        self.scans = {
            "daily": {
                "targets": "web_assets.txt",
                "tools": ["nuclei", "nikto"],
                "schedule": "02:00"
            },
            "weekly": {
                "targets": "all_servers.txt",
                "tools": ["nessus", "openvas"],
                "schedule": "Sun 03:00"
            },
            "monthly": {
                "targets": "all_assets.txt",
                "tools": ["nessus_full", "nuclei_full"],
                "schedule": "1st 03:00"
            },
            "emergency": {
                # 新CVE爆发时的紧急扫描
                "trigger": "critical_cve_published",
                "targets": "all_affected.txt",
                "tools": ["nuclei_cve_specific"]
            }
        }

    def run_nuclei(self, targets_file, severity="critical,high"):
        """运行Nuclei扫描"""
        cmd = [
            "nuclei",
            "-l", targets_file,
            "-severity", severity,
            "-stats",
            "-json",
            "-o", f"nuclei_result_{datetime.now().strftime('%Y%m%d')}.json",
            "-rate-limit", "150",
            "-timeout", "10",
        ]
        subprocess.run(cmd, timeout=3600)

    def run_nessus(self, targets_file):
        """Nessus API 扫描"""
        import requests
        # 创建扫描任务
        resp = requests.post(
            "https://nessus:8834/scans",
            json={
                "uuid": "template-uuid-basic-network-scan",
                "settings": {
                    "name": f"weekly_scan_{datetime.now().strftime('%Y%m%d')}",
                    "text_targets": open(targets_file).read(),
                    "launch": "ON_DEMAND"
                }
            }
        )
        scan_id = resp.json()['scan']['id']

        # 启动扫描
        requests.post(f"https://nessus:8834/scans/{scan_id}/launch")
        return scan_id

    def run_emergency_scan(self, cve_id, affected_products):
        """新CVE爆发时的紧急扫描"""
        # 1. 识别受影响资产
        affected = self.find_affected_assets(affected_products)

        # 2. 下载CVE专用Nuclei模板
        subprocess.run(["nuclei", "-update-templates"])

        # 3. 执行紧急扫描
        self.run_nuclei(
            targets_file=affected,
            severity="all",
        )

    def find_affected_assets(self, products):
        """从CMDB查找受影响资产"""
        # 查询ES: 资产软件/版本匹配受影响的产品
        return "emergency_targets.txt"
```

### 2.2 护网前漏洞大扫除

```bash
#!/bin/bash
# hw_pre_vuln_sweep.sh - 护网前漏洞大扫除

echo "=== 护网前漏洞大扫除 ==="
echo "时间: $(date)"
echo ""

# Step 1: 全量资产扫描
echo "Step 1: 全量Nmap扫描..."
nmap -sV -sC -p- --open -iL all_assets.txt -oA nmap_full_scan

# Step 2: Web资产专项扫描
echo "Step 2: Nuclei Web扫描..."
nuclei -l web_assets.txt \
    -severity critical,high,medium \
    -rate-limit 200 \
    -timeout 10 \
    -json -o nuclei_web_result.json

# Step 3: 公网资产Nessus深度扫描
echo "Step 3: Nessus扫描公网资产..."

# Step 4: 汇总高危漏洞
echo "Step 4: 汇总高危漏洞..."
python3 << 'EOF'
import json

# 读取Nuclei结果
with open('nuclei_web_result.json') as f:
    nuclei_results = [json.loads(line) for line in f]

critical = [r for r in nuclei_results if r.get('info',{}).get('severity') == 'critical']
high = [r for r in nuclei_results if r.get('info',{}).get('severity') == 'high']

print(f"Critical: {len(critical)}")
print(f"High: {len(high)}")

# 生成修复清单
with open('hw_vuln_fix_list.txt', 'w') as f:
    f.write("=== 护网前必须修复 ===\n\n")
    f.write("## Critical ({})\n".format(len(critical)))
    for vuln in critical:
        f.write(f"- [{vuln['template-id']}] {vuln['matched-at']}\n")
        f.write(f"  {vuln['info'].get('name','')}\n")
    f.write("\n## High ({})\n".format(len(high)))
    for vuln in high:
        f.write(f"- [{vuln['template-id']}] {vuln['matched-at']}\n")

print("✅ 修复清单已生成: hw_vuln_fix_list.txt")
EOF

echo ""
echo "✅ 漏洞大扫除完成"
```

---

## 3. 漏洞评估

### 3.1 CVSS + EPSS 双重评分

```python
def evaluate_vulnerability(vuln, asset_value):
    """综合漏洞评估"""
    cvss_score = vuln.get('cvss', 0)       # 0-10
    epss_score = vuln.get('epss', 0)        # 0-1 (被利用概率)

    # 资产价值 (1-5)
    asset_weight = {
        5: 1.5,  # 核心资产（域控/核心DB/支付系统）
        4: 1.2,  # 重要资产（Exchange/文件服务器）
        3: 1.0,  # 一般资产
        2: 0.7,  # 非重要资产
        1: 0.3,  # 低价值资产
    }.get(asset_value, 1.0)

    # 综合风险分 = CVSS × EPSS × 资产价值
    epss_weighted = epss_score * 100  # EPSS转0-100
    risk_score = (cvss_score * 10) * (epss_weighted if epss_weighted > 0 else 5) * asset_weight / 100

    # 风险等级
    if risk_score >= 80:
        level = "CRITICAL"
        sla = "24小时"
    elif risk_score >= 50:
        level = "HIGH"
        sla = "7天"
    elif risk_score >= 20:
        level = "MEDIUM"
        sla = "30天"
    else:
        level = "LOW"
        sla = "90天"

    return {
        "cvss": cvss_score,
        "epss": epss_score,
        "asset_value": asset_value,
        "risk_score": round(risk_score, 1),
        "level": level,
        "sla": sla
    }
```

---

## 4. 修复SLA制度

| 风险等级 | 公网资产SLA | 内网关键资产SLA | 内网一般资产SLA |
|---------|-----------|--------------|--------------|
| CRITICAL | **24小时** | 48小时 | 7天 |
| HIGH | **7天** | 14天 | 30天 |
| MEDIUM | 30天 | 60天 | 90天 |
| LOW | 90天 | 180天 | 下一版本 |

### 4.1 修复跟踪

```python
class VulnFixTracker:
    def __init__(self):
        self.fixes = []

    def add_fix(self, vuln_id, asset, sla_hours):
        self.fixes.append({
            "vuln_id": vuln_id,
            "asset": asset,
            "sla_hours": sla_hours,
            "assigned_to": None,
            "status": "pending",
            "created_at": datetime.now(),
            "deadline": datetime.now() + timedelta(hours=sla_hours),
            "completed_at": None
        })

    def get_overdue(self):
        return [f for f in self.fixes
                if f['status'] != 'completed'
                and datetime.now() > f['deadline']]

    def send_sla_reminder(self):
        overdue = self.get_overdue()
        if overdue:
            for fix in overdue:
                hours_overdue = (datetime.now() - fix['deadline']).total_seconds() / 3600
                severity = "🔴" if hours_overdue > 24 else "🟡"
                print(f"{severity} 超期{hours_overdue:.0f}h: {fix['vuln_id']} on {fix['asset']}")

    def generate_metrics(self):
        total = len(self.fixes)
        completed = sum(1 for f in self.fixes if f['status'] == 'completed')
        on_time = sum(1 for f in self.fixes
                     if f['status'] == 'completed'
                     and f['completed_at'] <= f['deadline'])
        overdue = len(self.get_overdue())

        return {
            "修复率": f"{completed/total*100:.0f}%" if total else "N/A",
            "按时修复率": f"{on_time/max(completed,1)*100:.0f}%",
            "当前超期": overdue,
            "平均修复时间": self.avg_fix_time()
        }
```

---

## 5. 修复验证

```python
def verify_fix(vuln_id, asset, original_finding):
    """验证漏洞是否真的修复了"""
    # 1. 重新扫描
    result = re_scan(asset, vuln_id)

    # 2. 对比原始发现
    if result['vulnerable']:
        return {"status": "FAILED", "reason": "漏洞仍然存在"}

    # 3. 检查补丁/配置
    if result.get('patch_version'):
        return {"status": "VERIFIED", "patch": result['patch_version']}

    # 4. 手动验证（Web漏洞）
    if 'web' in result.get('type', ''):
        return manual_verify(asset, vuln_id, original_finding)

    return {"status": "VERIFIED"}
```

---

## ✅ 漏洞管理 Checklist

- [ ] 全量资产扫描（Nmap+Nuclei+Nessus）
- [ ] 高危漏洞清单确认
- [ ] CVSS+EPSS+资产价值综合评估
- [ ] SLA制度确认+跟踪系统部署
- [ ] Critical/High漏洞修复
- [ ] 修复后验证扫描
- [ ] 护网前确认0个Critical未修复

> 📚 延伸阅读：HW/001-蓝队方案 | HW/002-资产自查 | SOC/011-漏洞运营
