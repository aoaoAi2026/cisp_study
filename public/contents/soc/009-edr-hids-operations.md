# EDR / HIDS 部署与运营实战：Wazuh + osquery 深度

> **📘 文档定位**：CISP 考试 安全运营 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：30 分钟
>
> 深入讲解 EDR/HIDS 的部署架构与运营实战，覆盖 Wazuh + osquery 的配置管理、规则编写、告警响应及 Agent 运维管理。

---

## 导航目录

- [一、EDR/HIDS 架构](#一edrhids-架构)
- [二、Wazuh 部署与配置](#二wazuh-部署与配置)
- [三、osquery 深度使用](#三osquery-深度使用)
- [四、检测规则编写](#四检测规则编写)
- [五、告警响应与运维](#五告警响应与运维)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

> 📅 2026-06-12 | 🎯 精通 | ⏱ 25 min | 分类：安全运营/SOC

## 📋 提纲

1. EDR/HIDS 选型与架构
2. Wazuh 集群部署
3. Agent 大规模部署
4. 自定义检测规则
5. osquery 集成
6. 告警响应联动
7. 护网期间 EDR 增强
8. 排错与调优

---

## 1. EDR/HIDS 选型

### 1.1 方案对比

| 方案 | 类型 | 成本 | Windows | Linux | macOS | 云原生 |
|------|------|------|---------|-------|-------|--------|
| Wazuh | 开源HIDS | 免费 | ✅ | ✅ | ✅ | ✅ |
| osquery | 开源HIDS | 免费 | ✅ | ✅ | ✅ | ⚠️ |
| CrowdStrike | 商业EDR | $$$$ | ✅ | ✅ | ✅ | ✅ |
| SentinelOne | 商业EDR | $$$$ | ✅ | ✅ | ✅ | ✅ |
| Elastic Defend | 开源EDR | 免费* | ✅ | ✅ | ✅ | ✅ |

推荐：Wazuh（检测+响应）+ osquery（资产+合规查询）= 完整开源HIDS栈

### 1.2 Wazuh 架构

```
Wazuh Agent (每台主机)
  ├─ 文件完整性监控(FIM)
  ├─ 日志采集
  ├─ 漏洞检测
  ├─ 命令审计
  ├─ 进程监控
  └─ Active Response（主动响应）

      ↓ (加密通道)

Wazuh Server (Manager)
  ├─ Analysis Engine（分析引擎）
  ├─ Ruleset（规则引擎）
  └─ Decoder（解码器）

      ↓

Wazuh Indexer (OpenSearch)
  └─ Wazuh Dashboard (可视化)
```

---

## 2. Wazuh 集群部署

```yaml
# docker-compose-wazuh.yml
version: '3.8'

services:
  wazuh-manager-master:
    image: wazuh/wazuh-manager:4.7.3
    hostname: wazuh-manager-master
    restart: always
    environment:
      - INDEXER_URL=https://wazuh-indexer:9200
      - INDEXER_USERNAME=admin
      - INDEXER_PASSWORD=${WAZUH_PASS}
      - FILEBEAT_SSL_VERIFICATION_MODE=certificate
      - SSL_CERTIFICATE_AUTHORITIES=/etc/ssl/root-ca.pem
    ports:
      - "1514:1514/udp"    # Agent通信
      - "1515:1515/tcp"     # Agent注册
      - "1516:1516/tcp"     # Agent注册(SSL)
      - "55000:55000/tcp"   # API
    volumes:
      - wazuh_api_config:/var/ossec/api/configuration
      - wazuh_etc:/var/ossec/etc
      - wazuh_logs:/var/ossec/logs
      - wazuh_queue:/var/ossec/queue
      - wazuh_var_multigroups:/var/ossec/var/multigroups
      - wazuh_integrations:/var/ossec/integrations
      - wazuh_active_response:/var/ossec/active-response
      - wazuh_agentless:/var/ossec/agentless
      - wazuh_wodles:/var/ossec/wodles
      - filebeat_etc:/etc/filebeat
      - filebeat_var:/var/lib/filebeat
      - /etc/ssl/root-ca.pem:/etc/ssl/root-ca.pem

  wazuh-manager-worker:
    image: wazuh/wazuh-manager:4.7.3
    hostname: wazuh-manager-worker
    restart: always
    environment:
      - INDEXER_URL=https://wazuh-indexer:9200
      - INDEXER_USERNAME=admin
      - INDEXER_PASSWORD=${WAZUH_PASS}
      - JOIN_MANAGER_MASTER=wazuh-manager-master
      - JOIN_TYPE=worker
    depends_on:
      - wazuh-manager-master

  wazuh-indexer:
    image: wazuh/wazuh-indexer:4.7.3
    hostname: wazuh-indexer
    restart: always
    ports:
      - "9200:9200"
    environment:
      - "OPENSEARCH_JAVA_OPTS=-Xms4g -Xmx4g"
      - "DISABLE_SECURITY_PLUGIN=true"
    volumes:
      - wazuh_indexer_data:/var/lib/wazuh-indexer

  wazuh-dashboard:
    image: wazuh/wazuh-dashboard:4.7.3
    hostname: wazuh-dashboard
    restart: always
    ports:
      - "5601:5601"
    environment:
      - INDEXER_URL=https://wazuh-indexer:9200
      - DASHBOARD_USERNAME=kibanaserver
      - DASHBOARD_PASSWORD=${WAZUH_PASS}
      - WAZUH_API_URL=https://wazuh-manager-master:55000
    depends_on:
      - wazuh-indexer

  # Nginx 前端负载均衡（多Manager时）
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
      - "1514:1514/udp"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - wazuh-manager-master
      - wazuh-manager-worker

volumes:
  wazuh_api_config:
  wazuh_etc:
  wazuh_logs:
  wazuh_queue:
  wazuh_var_multigroups:
  wazuh_integrations:
  wazuh_active_response:
  wazuh_agentless:
  wazuh_wodles:
  filebeat_etc:
  filebeat_var:
  wazuh_indexer_data:
```

---

## 3. Agent 大规模部署

### 3.1 自动化部署脚本

```bash
#!/bin/bash
# wazuh_agent_deploy.sh - 批量部署Wazuh Agent
# 支持通过SSH/Ansible批量部署

MANAGER_IP="10.0.0.50"
AGENT_GROUP="production"
WAZUH_VERSION="4.7.3"
HOSTS_FILE="$1"

deploy_linux() {
    local host=$1
    echo "📦 部署 $host (Linux)..."

    ssh root@$host "bash -s" << ENDSSH
# 检测OS
if [ -f /etc/redhat-release ]; then
    # CentOS/RHEL
    rpm --import https://packages.wazuh.com/key/GPG-KEY-WAZUH
    cat > /etc/yum.repos.d/wazuh.repo << EOF
[wazuh]
gpgcheck=1
gpgkey=https://packages.wazuh.com/key/GPG-KEY-WAZUH
enabled=1
name=Wazuh \$releasever
baseurl=https://packages.wazuh.com/4.x/yum/
protect=1
EOF
    yum install -y wazuh-agent-${WAZUH_VERSION}

elif [ -f /etc/debian_version ]; then
    # Debian/Ubuntu
    curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | apt-key add -
    echo "deb https://packages.wazuh.com/4.x/apt/ stable main" > /etc/apt/sources.list.d/wazuh.list
    apt-get update
    apt-get install -y wazuh-agent=${WAZUH_VERSION}-1
fi

# 配置Manager地址
sed -i "s/MANAGER_IP/${MANAGER_IP}/" /var/ossec/etc/ossec.conf

# 注册Agent
/var/ossec/bin/agent-auth -m ${MANAGER_IP} -G ${AGENT_GROUP}

# 启动Agent
systemctl enable wazuh-agent
systemctl start wazuh-agent

echo "✅ 部署完成"
ENDSSH
}

deploy_windows() {
    local host=$1
    echo "📦 部署 $host (Windows)..."

    # 使用WinRM远程执行
    powershell -Command "
Invoke-Command -ComputerName $host -ScriptBlock {
    \$url = 'https://packages.wazuh.com/4.x/windows/wazuh-agent-${WAZUH_VERSION}-1.msi'
    \$out = \"C:\Windows\Temp\wazuh-agent.msi\"
    Invoke-WebRequest -Uri \$url -OutFile \$out

    Start-Process msiexec.exe -Wait -ArgumentList \"/i \$out /qn WAZUH_MANAGER=\\\"${MANAGER_IP}\\\" WAZUH_REGISTRATION_SERVER=\\\"${MANAGER_IP}\\\" WAZUH_AGENT_GROUP=\\\"${AGENT_GROUP}\\\"\"
    Remove-Item \$out
}
"
}

# 并行部署
export -f deploy_linux deploy_windows
export MANAGER_IP AGENT_GROUP WAZUH_VERSION

cat "$HOSTS_FILE" | xargs -P 10 -I {} bash -c '
    if ping -c 1 -W 2 {} >/dev/null 2>&1; then
        # 检测OS类型
        if ssh -o ConnectTimeout=3 root@{} "uname" 2>/dev/null | grep -q Linux; then
            deploy_linux {}
        else
            deploy_windows {}
        fi
    else
        echo "❌ {} 不可达"
    fi
'

echo "✅ 批量部署完成"
```

### 3.2 Agent 健康监控脚本

```python
#!/usr/bin/env python3
"""Wazuh Agent 健康监控"""

import requests
import json

WAZUH_API = "https://wazuh-manager:55000"
WAZUH_USER = "wazuh"
WAZUH_PASS = "your-password"

def get_token():
    resp = requests.post(
        f"{WAZUH_API}/security/user/authenticate",
        auth=(WAZUH_USER, WAZUH_PASS),
        verify=False
    )
    return resp.json()['data']['token']

TOKEN = get_token()

def get_agent_status():
    """获取所有Agent状态"""
    resp = requests.get(
        f"{WAZUH_API}/agents",
        headers={"Authorization": f"Bearer {TOKEN}"},
        params={"limit": 5000},
        verify=False
    )
    agents = resp.json()['data']['affected_items']

    active = [a for a in agents if a['status'] == 'active']
    disconnected = [a for a in agents if a['status'] == 'disconnected']
    never_connected = [a for a in agents if a['status'] == 'never_connected']

    return {
        "total": len(agents),
        "active": len(active),
        "disconnected": len(disconnected),
        "never_connected": len(never_connected),
        "online_rate": f"{len(active)/max(len(agents),1)*100:.1f}%",
        "problem_agents": [
            {"name": a['name'], "status": a['status'], "last_keepalive": a.get('last_keepalive', 'N/A')}
            for a in disconnected + never_connected[:20]
        ]
    }

def get_agent_alerts(agent_id, hours=24):
    """获取指定Agent的近期告警"""
    resp = requests.get(
        f"{WAZUH_API}/agents/{agent_id}/stats/events",
        headers={"Authorization": f"Bearer {TOKEN}"},
        verify=False
    )
    return resp.json()

def restart_unhealthy_agents():
    """自动重启不健康的Agent"""
    status = get_agent_status()
    for agent in status['problem_agents']:
        if agent['status'] == 'disconnected':
            print(f"🔄 重启Agent: {agent['name']}")

            # 通过Active Response触发Agent重启
            requests.put(
                f"{WAZUH_API}/active-response",
                headers={"Authorization": f"Bearer {TOKEN}"},
                json={
                    "command": "restart-wazuh",
                    "arguments": [],
                    "alert": {
                        "data": {"srcip": "any"}
                    },
                    "agents_list": [agent['id']]
                },
                verify=False
            )

if __name__ == "__main__":
    status = get_agent_status()
    print(f"Agent在线率: {status['online_rate']}")

    if float(status['online_rate'].replace('%','')) < 95:
        print("⚠️ 在线率低于95%，启动自动修复...")
        restart_unhealthy_agents()
```

---

## 4. 自定义检测规则

### 4.1 Wazuh 规则语法

```xml
<!-- /var/ossec/etc/rules/local_rules.xml -->

<group name="custom,critical_process_stop,">
  <!-- 检测安全产品被停止 -->
  <rule id="100001" level="14">
    <decoded_as>windows_eventchannel</decoded_as>
    <description>安全产品服务被停止</description>
    <match>EventID: 7036</match>
    <regex>\.*(Defender|CrowdStrike|SentinelOne|Carbon Black|Wazuh)\.*stopped</regex>
    <options>no_full_log</options>
    <group>defense_evasion,T1562.001,</group>
  </rule>
</group>

<group name="custom,suspicious_process,">
  <!-- 检测 mimikatz -->
  <rule id="100002" level="15">
    <decoded_as>sysmon_event1</decoded_as>
    <description>Mimikatz 检测</description>
    <match>mimikatz</match>
    <options>no_full_log</options>
    <group>credential_access,T1003,</group>
  </rule>

  <!-- 检测 PowerShell 编码命令 -->
  <rule id="100003" level="12">
    <decoded_as>sysmon_event1</decoded_as>
    <description>PowerShell Base64编码命令</description>
    <field name="win.system.image">\.*powershell\.exe</field>
    <regex>-e\w{2,}\s+\w{20,}|-EncodedCommand\s+\w{20,}</regex>
    <options>no_full_log</options>
  </rule>

  <!-- 检测 certutil 下载 -->
  <rule id="100004" level="13">
    <decoded_as>sysmon_event1</decoded_as>
    <description>Certutil.exe URL缓存下载</description>
    <match>certutil</match>
    <regex>-urlcache|-split</regex>
    <options>no_full_log</options>
    <group>command_and_control,T1105,</group>
  </rule>
</group>

<group name="custom,lateral_movement,">
  <!-- 检测 PsExec -->
  <rule id="100005" level="14">
    <decoded_as>sysmon_event1</decoded_as>
    <description>PsExec 远程执行</description>
    <regex>PSEXESVC\.exe|PsExec\.exe</regex>
    <options>no_full_log</options>
    <group>lateral_movement,T1569.002,</group>
  </rule>
</group>
```

### 4.2 CDB List（IP/域名黑名单）

```
# /var/ossec/etc/lists/suspicious-ips
# 威胁情报IP黑名单
45.33.32.156:malicious_c2
185.220.101.34:tor_exit_node
23.129.64.100:malicious_scanner

# 用法：在规则中引用
# <list field="srcip" lookup="address_match_key">etc/lists/suspicious-ips</list>
```

### 4.3 Active Response 自动响应

```xml
<!-- /var/ossec/etc/ossec.conf - Active Response 配置 -->
<ossec_config>
  <active-response>
    <!-- 暴力破解自动封禁 -->
    <command>firewall-drop</command>
    <location>local</location>
    <rules_id>5710,5712,5716</rules_id>  <!-- SSH/WordPress 暴力破解规则 -->
    <timeout>1800</timeout>  <!-- 30分钟 -->
  </active-response>

  <active-response>
    <!-- 恶意IP自动封禁 -->
    <command>firewall-drop</command>
    <location>local</location>
    <rules_id>100005,100002</rules_id>  <!-- 自定义高危规则 -->
    <timeout>86400</timeout>  <!-- 24小时 -->
  </active-response>
</ossec_config>
```

---

## 5. osquery 集成

### 5.1 osquery 部署

```bash
# Fleet Manager 管理 osquery
docker run -d \
  --name fleet \
  -p 8080:8080 \
  -e FLEET_MYSQL_ADDRESS=mysql:3306 \
  -e FLEET_MYSQL_DATABASE=fleet \
  -e FLEET_MYSQL_USERNAME=fleet \
  -e FLEET_MYSQL_PASSWORD=password \
  fleetdm/fleet:latest

# 安装 osquery Agent
# Linux
curl -L https://github.com/osquery/osquery/releases/download/5.12.0/osquery_5.12.0-1.linux_x86_64.tar.gz | tar xz
osqueryd --enroll_secret_path=/etc/osquery/secret \
         --tls_server_certs=/etc/osquery/certs/fleet.pem \
         --tls_hostname=fleet.company.com \
         --host_identifier=hostname \
         --enroll_tls_endpoint=/api/v1/osquery/enroll

# Windows
# 使用 osquery MSI + Fleet 配置
```

### 5.2 护网专用 osquery 查询

```sql
-- 日常检查
-- 1. 检查SMBv1状态
SELECT * FROM services WHERE name = 'LanmanServer';
-- 在返回的start_type中检查是否有SMB1相关

-- 2. 查找最近1小时内创建的文件（可疑WebShell）
SELECT path, size, mtime, ctime, sha256
FROM file
WHERE path LIKE 'C:\inetpub\wwwroot\%'
  AND ctime > datetime('now', '-1 hours')
  AND size > 0;

-- 3. 检查监听端口（找异常端口）
SELECT DISTINCT process.name, listening.port, process.pid
FROM processes AS process
JOIN listening_ports AS listening ON process.pid = listening.pid
WHERE listening.port NOT IN (80, 443, 22, 3389, 3306, 5432)
  AND listening.address NOT LIKE '127.0.0%';

-- 4. 检查计划任务（找持久化）
SELECT name, action, enabled, last_run_time
FROM scheduled_tasks
WHERE enabled = 1
  AND (action LIKE '%temp%'
       OR action LIKE '%appdata%');

-- 5. 检查自启动项
SELECT name, source, path
FROM startup_items;

-- 6. 检查本地用户（找新增账号）
SELECT username, description, uid, directory
FROM users
WHERE directory NOT LIKE '/var/empty%';
```

---

## 6. 护网期间 EDR 增强

```yaml
# 护网Wazuh配置增强
hw_enhancement:
  # 1. 监控频率提升
  syscheck:
    frequency: 3600           # FIM检查从12h → 1h
    directories:
      - /etc: realtime        # 关键目录实时监控
      - /var/www: realtime
      - C:\inetpub: realtime

  # 2. 命令审计开启
  command_audit:
    enable: true
    log_all_commands: true

  # 3. Active Response 更激进
  active_response:
    auto_block_threshold: 3   # 3次告警 → 自动封禁
    block_duration: 86400     # 护网期间封禁24h

  # 4. 告警阈值降低
  alert_threshold:
    failed_login_before_block: 5  # 5次失败 → 告警（日常10次）
    port_scan_threshold: 20       # 20个端口 → 告警（日常50个）
```

---

## 7. 排错指南

| 问题 | 排查 | 解决 |
|------|------|------|
| Agent离线 | `/var/ossec/logs/ossec.log` | 检查网络/Manager可达/Agent密钥过期 |
| 规则不触发 | Wazuh Analysis log | `wazuh-logtest` 测试规则 |
| FIM不报文件变更 | Syscheck配置 | 检查配置路径/directories/nodiff |
| Manager OOM | ES/OS内存 | 增加JVM堆内存+清理旧索引 |
| Agent注册失败 | Manager端口 | 检查1515端口+防火墙+Agent密钥 |

---

## ✅ EDR运营 Checklist

- [ ] Wazuh Manager集群部署完成
- [ ] Agent全量部署（目标>99%在线率）
- [ ] 自定义规则部署（至少20条）
- [ ] CDB威胁情报列表更新
- [ ] Active Response配置测试
- [ ] osquery Fleet部署
- [ ] 护网增强配置切换
- [ ] Agent健康自动监控+告警

> 📚 延伸阅读：SOC/001-SOC建设 | SOC/002-SIEM分析 | HW/001-蓝队防护方案
