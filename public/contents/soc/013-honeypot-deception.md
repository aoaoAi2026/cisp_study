# 蜜罐与欺骗防御实战：从部署到反制

> 📅 2026-06-12 | 🎯 进阶 | ⏱ 20 min | 分类：安全运营/SOC

## 📋 提纲

1. 蜜罐体系架构
2. T-Pot 多蜜罐平台部署
3. HFish 企业级蜜罐
4. 蜜罐策略设计
5. 蜜标与Honeytoken
6. 蜜罐数据与SIEM联动
7. 蜜罐反制与溯源

---

## 1. 蜜罐体系架构

### 1.1 三层蜜罐部署

```
外网层（诱捕扫描器）:
├─ Cowrie (SSH/Telnet蜜罐)
├─ Dionaea (SMB/HTTP/FTP/MSSQL/MySQL蜜罐)
├─ Glastopf (Web蜜罐)
├─ Honeytrap (高级蜜罐)
└─ Elasticpot (Elasticsearch蜜罐)

DMZ层（诱捕已进入的攻击者）:
├─ Conpot (ICS/SCADA蜜罐)
├─ Snare/Tanner (Web蜜罐增强)
└─ 自定义Web蜜罐（模拟内部系统）

内网层（检测横向移动）:
├─ RDPy (RDP蜜罐)
├─ Honeysap (SAP蜜罐)
├─ GasPot (加油站监控蜜罐)
└─ 自定义服务蜜罐（假AD/假文件服务器/假数据库）
```

### 1.2 蜜罐交互级别

| 级别 | 描述 | 风险 | 收获 |
|------|------|------|------|
| 低交互 | 模拟服务Banner，不提供真实功能 | 几乎零风险 | IP/扫描工具指纹 |
| 中交互 | 模拟完整协议交互 | 低风险 | 攻击流量/工具/命令 |
| 高交互 | 真实操作系统/服务 | 隔离要求高 | 完整攻击链/恶意样本 |

---

## 2. T-Pot 部署

```bash
#!/bin/bash
# T-Pot 部署 - Ubuntu 20.04/22.04

# 1. 系统要求
# - 最小 8GB RAM, 128GB SSD
# - 独立网段（不能与生产环境同网段）
# - 独立公网IP（用于吸引攻击）

# 2. 安装 T-Pot
git clone https://github.com/telekom-security/tpotce
cd tpotce/iso/installer/

# 标准安装
./install.sh --type=standard

# 或仅蜜罐不装ELK
./install.sh --type=hive

# 3. 选择蜜罐类型
# T-Pot 默认包含的蜜罐：
# - Cowrie (SSH/Telnet)
# - Dionaea (多协议)
# - Honeytrap (高级)
# - Conpot (ICS)
# - Elasticpot
# - Rdpy
# - Mailoney
# - Glutton

# 4. 配置
cat > /opt/tpot/etc/tpot.yml << 'EOF'
version: '3.8'
services:
  # 基本蜜罐都包含在T-Pot中
  # 自定义配置在 custom 目录

  # 添加自定义蜜罐
  custom-web-honeypot:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./custom-web:/usr/share/nginx/html
EOF

# 5. 启动
systemctl start tpot
```

### 2.1 T-Pot Web管理界面

```
https://<tpot-ip>:64297 - T-Pot Web界面
  ├─ Kibana - 蜜罐数据分析
  ├─ Attack Map - 攻击者实时地图  
  ├─ Spiderfoot - 威胁情报自动化
  └─ CyberChef - 数据解码
```

---

## 3. HFish 企业级蜜罐

HFish 是国内使用最广泛的开源蜜罐系统。

```yaml
# docker-compose-hfish.yml
version: '3.8'
services:
  hfish-server:
    image: threatbook/hfish-server:latest
    container_name: hfish-server
    ports:
      - "4433:4433"  # Web管理界面
      - "4434:4434"  # 节点通信
    restart: always
    volumes:
      - hfish_data:/usr/share/hfish

  hfish-client-1:
    image: threatbook/hfish-client:latest
    network_mode: "host"  # 蜜罐需要host模式监听端口
    depends_on:
      - hfish-server
    environment:
      - HFISH_SERVER=192.168.1.100:4434
    restart: always

volumes:
  hfish_data:
```

### 3.1 HFish 支持的服务蜜罐

```
SSH蜜罐    - 记录攻击者执行的命令
Redis蜜罐  - 记录攻击者写入的数据
MySQL蜜罐  - 记录攻击者执行的SQL
HTTP蜜罐   - 记录攻击请求详情
FTP蜜罐    - 记录文件操作
Telnet蜜罐 - 记录命令历史
Memcache蜜罐 - 记录请求
Elasticsearch蜜罐 - 记录查询
VNC蜜罐    - 记录远程桌面操作
RDP蜜罐    - 记录远程桌面操作
SMB蜜罐    - 记录文件共享操作
```

---

## 4. 蜜罐策略设计

### 4.1 部署位置选择

```python
#!/usr/bin/env python3
"""蜜罐部署位置计算器"""

def calculate_honeypot_placement(network_topology):
    recommendations = []

    # 1. 外网入口：在所有公网IP段部署
    for public_subnet in network_topology.get('public_subnets', []):
        recommendations.append({
            "location": public_subnet,
            "purpose": "捕获外网扫描和攻击",
            "types": ["Cowrie", "Dionaea", "Glastopf"],
            "ports": [22, 445, 3389, 3306, 6379, 8080, 8443],
            "realistic": False  # 不需要看起来很真实
        })

    # 2. DMZ：混在真实服务中
    for dmz_subnet in network_topology.get('dmz_subnets', []):
        recommendations.append({
            "location": dmz_subnet,
            "purpose": "捕获已突破边界的攻击者",
            "types": ["Conpot", "自定义Web蜜罐", "FTP蜜罐"],
            "ports": [21, 80, 443, 8080],
            "realistic": True  # 要模拟真实服务
        })

    # 3. 内网段：部署检测横向移动
    for internal_subnet in network_topology.get('internal_subnets', []):
        recommendations.append({
            "location": internal_subnet,
            "purpose": "检测内网横向移动",
            "types": ["Cowrie", "Honeycred", "SMB蜜罐", "RDP蜜罐"],
            "ports": [445, 3389, 22, 1433],
            "realistic": True,
            "honey_credentials": True  # 部署假凭证
        })

    return recommendations

# 蜜罐数量经验公式
# 外网：每100个真实IP部署1-3个蜜罐
# 内网：每1000台真实主机部署2-5个蜜罐
# 关键网段（财务/HR）：至少1个蜜罐
```

### 4.2 蜜罐服务伪装

```python
# 让蜜罐看起来像真实服务器
FAKE_BANNERS = {
    "SSH": "SSH-2.0-OpenSSH_7.4",
    "MySQL": "5.7.33-0ubuntu0.16.04.1",
    "Apache": "Apache/2.4.41 (Ubuntu)",
    "Nginx": "nginx/1.18.0",
    "Redis": "redis_version:6.0.9",
    "PostgreSQL": "PostgreSQL 12.6",
    "Elasticsearch": "7.10.2",
}

# 随机化版本（避免所有蜜罐同一版本被识别）
import random
def randomize_banner(service):
    if service == "SSH":
        versions = ["6.6.1p1", "7.2p2", "7.4", "7.6p1", "8.0", "8.2p1"]
        return f"SSH-2.0-OpenSSH_{random.choice(versions)}"
    elif service == "Nginx":
        versions = ["1.14.0", "1.16.1", "1.18.0", "1.20.1"]
        return f"nginx/{random.choice(versions)}"
```

---

## 5. 蜜标与 Honeytoken

### 5.1 文件蜜标部署

```bash
#!/bin/bash
# deploy_file_honeytokens.sh

HONEY_DIRS=(
    "/opt/backup"
    "/home/admin/secret_projects"
    "/var/www/admin"
    "/srv/data/finance"
)

# 生成蜜标文件
for dir in "${HONEY_DIRS[@]}"; do
    mkdir -p "$dir"

    # 1. 假凭证文件
    cat > "$dir/credentials.txt" << 'EOF'
=== 内部系统凭证 ===
生产数据库: db-prod.internal
  用户: admin
  密码: P@ssw0rd_DB_2026
  ⚠️ 此凭证仅在内部网络有效
EOF

    # 2. 嵌入蜜标的假文件
    cat > "$dir/employee_salary_2026.xlsx" << 'EOF'
（蜜标文件 - 包含嵌入的Canary Token）
任何访问/拷贝此文件的行为将被记录
EOF

    # 3. 假的AWS凭证
    cat > "$dir/aws_credentials.txt" << 'EOF'
[default]
aws_access_key_id = AKIAHONEYTOKEN1234
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/FAKEKEYEXAMPLE
region = us-east-1
EOF

    # 4. 设置inotify监控
    inotifywait -m -r -e access,modify,open "$dir" --format '%T %w%f %e' --timefmt '%Y-%m-%d %H:%M:%S' \
        >> /var/log/honeytoken/access.log &
done

echo "✅ 蜜标文件已部署"
```

### 5.2 Canary Token 邮件蜜标

```python
#!/usr/bin/env python3
"""生成邮件蜜标 - 当攻击者查看/转发邮件时触发告警"""

import requests

def create_email_canary_token(note="财务部-敏感邮件蜜标"):
    # 使用 CanaryTokens.org 生成
    resp = requests.post(
        "https://canarytokens.org/generate",
        data={
            "type": "email",
            "memo": note,
            "email": "honeytoken-alert@company.com",
        }
    )
    # 返回的是一段HTML，当邮件被打开时会触发DNS/HTTP回调
    return resp.text
```

---

## 6. 蜜罐数据与 SIEM 联动

```python
#!/usr/bin/env python3
"""蜜罐告警 → SIEM → SOAR 联动"""

import json
import requests
from datetime import datetime

class HoneypotToSIEM:
    def __init__(self, es_url, thehive_url):
        self.es = es_url
        self.thehive = thehive_url

    def process_honeypot_alert(self, alert):
        """处理蜜罐告警"""
        attacker_ip = alert.get('attacker_ip', '')

        # 1. 丰富告警信息
        enriched = self.enrich(alert)

        # 2. 自动判定威胁等级
        threat_level = self.assess_threat(enriched)

        # 3. 推送ES（SIEM）
        self.push_to_es(enriched)

        # 4. 创建TheHive工单（高危）
        if threat_level >= 3:
            case = self.create_case(enriched)

        # 5. 自动封禁（已知恶意IP）
        if enriched.get('known_malicious') and enriched.get('interaction_count', 0) > 3:
            self.auto_block(attacker_ip)

        # 6. 触发SOAR剧本
        self.trigger_soar_playbook(enriched, threat_level)

        return enriched

    def enrich(self, alert):
        """丰富蜜罐告警信息"""
        attacker_ip = alert['attacker_ip']

        enriched = alert.copy()

        # IP信息
        geo = self.geoip(attacker_ip)
        enriched['geo'] = geo

        # 威胁情报
        threat = self.threat_intel(attacker_ip)
        enriched['threat_intel'] = threat
        enriched['known_malicious'] = threat.get('score', 0) > 50

        # 历史交互统计
        history = self.query_es(f"attacker_ip:{attacker_ip}")
        enriched['interaction_count'] = len(history)
        enriched['first_seen'] = history[0].get('@timestamp') if history else None

        return enriched

    def assess_threat(self, enriched):
        """评估威胁等级 1-5"""
        score = 0

        # 交互深度
        if enriched.get('commands_executed', 0) > 10:
            score += 3
        elif enriched.get('commands_executed', 0) > 0:
            score += 1

        # 恶意软件下载
        if enriched.get('malware_downloaded'):
            score += 3

        # 已知恶意
        if enriched.get('known_malicious'):
            score += 2

        # 外网蜜罐
        if enriched.get('honeypot_location') == 'external':
            score += 1
        elif enriched.get('honeypot_location') == 'internal':
            score += 3  # 内网蜜罐触发 = 已突破边界

        return min(score, 5)

    def auto_block(self, ip):
        """自动封禁"""
        import subprocess
        subprocess.run([
            "iptables", "-A", "INPUT", "-s", ip, "-j", "DROP",
            "-m", "comment", "--comment", f"Honeypot_Block_{datetime.now().strftime('%Y%m%d')}"
        ])

        # 同时加入Wazuh CDB黑名单
        with open("/var/ossec/etc/lists/blocklist", "a") as f:
            f.write(f"{ip}\n")

    def geoip(self, ip):
        try:
            resp = requests.get(f"http://ip-api.com/json/{ip}", timeout=5)
            return resp.json()
        except:
            return {}

    def threat_intel(self, ip):
        try:
            resp = requests.get(
                f"https://otx.alienvault.com/api/v1/indicators/IPv4/{ip}/general",
                timeout=10
            )
            data = resp.json()
            pulses = data.get('pulse_info', {}).get('count', 0)
            return {"score": min(pulses * 10, 100)}
        except:
            return {"score": 0}

    def query_es(self, query):
        return []

    def create_case(self, enriched):
        resp = requests.post(
            f"{self.thehive}/api/case",
            json={
                "title": f"[蜜罐] {enriched.get('honeypot_name')} - {enriched.get('attacker_ip')}",
                "description": json.dumps(enriched, indent=2),
                "severity": enriched.get('threat_level', 3),
                "tags": ["honeypot", "auto-detected"],
                "tlp": 2
            }
        )
        return resp.json()

    def trigger_soar_playbook(self, enriched, threat_level):
        """触发SOAR自动处理"""
        if threat_level >= 4:
            # 高危：启动应急响应剧本
            playbook = "honeypot_critical_response"
        elif threat_level >= 2:
            # 中危：启动信息收集剧本
            playbook = "honeypot_enrichment"
        else:
            return

        requests.post(
            "http://shuffle:5001/api/v1/workflows/execute",
            json={
                "workflow_name": playbook,
                "arguments": enriched
            }
        )


if __name__ == "__main__":
    processor = HoneypotToSIEM(
        es_url="http://elasticsearch:9200",
        thehive_url="http://thehive:9000"
    )

    # 模拟蜜罐告警
    alert = {
        "honeypot_name": "SSH-Cowrie-01",
        "honeypot_location": "external",
        "attacker_ip": "185.220.101.34",
        "timestamp": datetime.now().isoformat(),
        "service": "SSH",
        "username_attempted": "root",
        "password_attempted": "admin123",
        "commands_executed": 15,
        "malware_downloaded": False,
        "session_duration": 180,
    }

    result = processor.process_honeypot_alert(alert)
    print(json.dumps(result, indent=2, ensure_ascii=False))
```

---

## 7. 排错与注意事项

| 问题 | 原因 | 解决 |
|------|------|------|
| 蜜罐长期无攻击 | 部署位置流量少 | 在公网IP段部署 |
| 蜜罐被识别 | Banner/行为太假 | 随机化Banner，增加交互深度 |
| 内网蜜罐无触发 | 部署位置不对 | 部署在AD/文件服务器子网 |
| 蜜罐IP被封禁 | 被加入黑名单 | 定期更换蜜罐IP |
| 蜜罐资源耗尽 | 恶意流量过大 | 限制并发连接 |

---

## ✅ 蜜罐部署 Checklist

- [ ] T-Pot/HFish 平台部署
- [ ] 外网/DMZ/内网三层蜜罐
- [ ] 蜜标文件部署（含inotify监控）
- [ ] Canary Token 邮件部署
- [ ] 蜜罐 → SIEM 数据流转通
- [ ] 蜜罐 → SOAR 自动响应
- [ ] 蜜罐告警分级与工单集成
- [ ] 假凭证(Honeycred)部署
- [ ] 蜜罐隔离验证（不能访问生产网）
- [ ] 护网前蜜罐收网演练

> 📚 延伸阅读：HW/003-红蓝对抗反制 | HW/008-溯源反制 | SOC/001-SOC建设
