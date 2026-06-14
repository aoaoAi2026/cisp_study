# 红蓝对抗中蓝队溯源反制实战

> **📘 文档定位**：CISP 考试 护网行动 高级 | 难度：⭐⭐⭐⭐⭐ | 预计阅读：30 分钟
>
> 深入讲解红蓝对抗中蓝队的溯源反制实战技术，覆盖 IP 溯源/样本分析/社交工程反制/法律威慑等完整反制链。

---

## 导航目录

- [一、溯源反制概述](#一溯源反制概述)
- [二、IP 溯源技术](#二ip-溯源技术)
- [三、样本分析与溯源](#三样本分析与溯源)
- [四、社交工程反制](#四社交工程反制)
- [五、反制工具链](#五反制工具链)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

> 📅 2026-06-12 | 🎯 精通 | ⏱ 25 min | 分类：护网工程

## 📋 提纲

1. 溯源反制的法律边界与红线
2. 溯源技术体系：从IP到身份
3. 被动溯源：日志分析 + 威胁情报
4. 主动反制：蜜罐与陷阱技术
5. 社交溯源：社工反制手法
6. 反制工具链
7. 完整溯源案例
8. 排错与注意事项

---

## 1. 法律边界与红线

### ⚠️ 绝对禁止

```
❌ 攻击红队/攻击者的个人设备
❌ 植入恶意软件进行反制
❌ 侵入攻击者的C2服务器
❌ 对第三方服务进行攻击（即使看到攻击者用了）
❌ 公开攻击者的个人信息（"人肉"）
```

### ✅ 允许的操作

```
✅ 在自有资产上部署蜜罐/蜜标
✅ 分析攻击流量和工具（被动分析）
✅ 通过公开渠道查询攻击IP/域名信息
✅ 通过威胁情报平台共享IOC
✅ 在自有资产上部署反制脚本（修改攻击者上传的文件）
✅ 向公安机关/CNCERT 报告
```

**原则**：所有反制操作必须在自己控制的资产上进行，绝不越界。

---

## 2. 溯源技术体系

```
溯源路径: IP → 域名/ASN → 攻击基础设施 → 攻击组织 → 攻击者身份

第一层（技术）：IP归属、ASN、域名Whois、SSL证书、JS特征
第二层（行为）：攻击手法、TTP、工具偏好、时间规律
第三层（身份）：社交账号、GitHub、论坛ID、历史攻击记录
```

---

## 3. 被动溯源

### 3.1 攻击IP分析自动化

```python
#!/usr/bin/env python3
"""
攻击IP溯源信息聚合器
用法: python3 ip_tracer.py --ip 45.33.32.156
"""

import requests
import json
import whois
import socket
from datetime import datetime

class IPTracer:
    def __init__(self):
        self.results = {}

    def trace(self, ip):
        """完整溯源一个IP"""
        print(f"\n{'='*50}")
        print(f"🔍 开始溯源 IP: {ip}")
        print(f"{'='*50}")

        # 1. 基础信息
        self.geo_info(ip)
        self.asn_info(ip)
        self.reverse_dns(ip)

        # 2. 威胁情报
        self.abuseipdb(ip)
        self.alienvault_otx(ip)
        self.virustotal(ip)

        # 3. 关联信息
        self.related_domains(ip)
        self.ssl_certificates(ip)
        self.shodan_info(ip)

        # 4. 攻击基础设施分析
        self.analyze_infrastructure(ip)

        return self.results

    def geo_info(self, ip):
        """GeoIP 查询"""
        try:
            resp = requests.get(f"http://ip-api.com/json/{ip}?fields=66846719")
            data = resp.json()
            self.results['geo'] = {
                "country": data.get('country', 'N/A'),
                "region": data.get('regionName', 'N/A'),
                "city": data.get('city', 'N/A'),
                "isp": data.get('isp', 'N/A'),
                "org": data.get('org', 'N/A'),
                "as": data.get('as', 'N/A'),
                "lat": data.get('lat', 0),
                "lon": data.get('lon', 0),
                "is_proxy": data.get('proxy', False),
                "is_hosting": data.get('hosting', False)
            }
            print(f"📍 地理位置: {self.results['geo']['country']} / {self.results['geo']['city']}")
            print(f"   ISP: {self.results['geo']['isp']}")
            print(f"   代理/VPN: {'是⚠️' if self.results['geo']['is_proxy'] else '否'}")
            print(f"   托管/云: {'是⚠️' if self.results['geo']['is_hosting'] else '否'}")
        except Exception as e:
            self.results['geo'] = {"error": str(e)}

    def asn_info(self, ip):
        """ASN 查询"""
        try:
            resp = requests.get(f"https://api.bgpview.io/ip/{ip}")
            data = resp.json()
            prefixes = data.get('data', {}).get('prefixes', [])
            if prefixes:
                p = prefixes[0]
                self.results['asn'] = {
                    "asn": p.get('asn', {}).get('asn', 'N/A'),
                    "name": p.get('asn', {}).get('name', 'N/A'),
                    "prefix": p.get('prefix', 'N/A'),
                    "country": p.get('asn', {}).get('country_code', 'N/A')
                }
                print(f"🌐 ASN: {self.results['asn']['asn']} - {self.results['asn']['name']}")
                print(f"   IP段: {self.results['asn']['prefix']}")
        except Exception as e:
            self.results['asn'] = {"error": str(e)}

    def reverse_dns(self, ip):
        """反向DNS查询"""
        try:
            hostname = socket.gethostbyaddr(ip)[0]
            self.results['rdns'] = hostname
            print(f"🔤 反向DNS: {hostname}")
        except:
            self.results['rdns'] = "无PTR记录"

    def abuseipdb(self, ip):
        """AbuseIPDB 查询"""
        try:
            resp = requests.get(
                f"https://api.abuseipdb.com/api/v2/check?ipAddress={ip}&maxAgeInDays=90",
                headers={"Key": self.api_keys.get('abuseipdb', ''), "Accept": "application/json"}
            )
            data = resp.json().get('data', {})
            self.results['abuseipdb'] = {
                "score": data.get('abuseConfidenceScore', 0),
                "total_reports": data.get('totalReports', 0),
                "last_reported": data.get('lastReportedAt', 'N/A'),
                "usage_type": data.get('usageType', 'N/A'),
                "domain": data.get('domain', 'N/A')
            }
            print(f"⚠️ AbuseIPDB: 信誉分 {self.results['abuseipdb']['score']}/100")
            print(f"   举报次数: {self.results['abuseipdb']['total_reports']}")
        except:
            self.results['abuseipdb'] = {"error": "查询失败"}

    def alienvault_otx(self, ip):
        """AlienVault OTX 查询"""
        try:
            resp = requests.get(
                f"https://otx.alienvault.com/api/v1/indicators/IPv4/{ip}/general"
            )
            data = resp.json()
            pulses = data.get('pulse_info', {}).get('pulses', [])
            self.results['otx'] = {
                "pulse_count": len(pulses),
                "threat_tags": list(set(tag for p in pulses for tag in p.get('tags', []))),
                "recent_pulses": [
                    {"name": p['name'], "created": p['created'], "author": p.get('author_name', 'N/A')}
                    for p in pulses[:5]
                ]
            }
            print(f"🦠 OTX: {self.results['otx']['pulse_count']} 个威胁情报")
            if self.results['otx']['threat_tags']:
                print(f"   标签: {', '.join(self.results['otx']['threat_tags'][:10])}")
        except:
            self.results['otx'] = {"error": "查询失败"}

    def virustotal(self, ip):
        """VirusTotal IP查询"""
        try:
            resp = requests.get(
                f"https://www.virustotal.com/api/v3/ip_addresses/{ip}",
                headers={"x-apikey": self.api_keys.get('vt', '')}
            )
            data = resp.json()
            stats = data.get('data', {}).get('attributes', {}).get('last_analysis_stats', {})
            self.results['virustotal'] = {
                "malicious": stats.get('malicious', 0),
                "suspicious": stats.get('suspicious', 0),
                "harmless": stats.get('harmless', 0),
            }
            print(f"🦠 VT: {self.results['virustotal']['malicious']}个引擎标记恶意")
        except:
            self.results['virustotal'] = {"error": "查询失败"}

    def related_domains(self, ip):
        """关联域名查询"""
        try:
            resp = requests.get(f"https://api.bgpview.io/ip/{ip}")
            data = resp.json()
            # 使用 SecurityTrails / DNSlytics 等
            # 这里用简化实现
            self.results['domains'] = data.get('data', {}).get('prefixes', [{}])[0].get('asn', {}).get('name', '无关联域名')
        except:
            self.results['domains'] = "查询失败"

    def ssl_certificates(self, ip):
        """SSL证书查询（通过 crt.sh）"""
        try:
            resp = requests.get(f"https://crt.sh/?q={ip}&output=json", timeout=10)
            certs = resp.json()
            domains = set()
            for cert in certs[:50]:
                name = cert.get('name_value', '')
                for d in name.split('\n'):
                    domains.add(d.strip())
            self.results['ssl_certs'] = {
                "cert_count": len(certs),
                "domains": list(domains)[:20]
            }
            print(f"🔒 SSL证书: {len(certs)} 个证书, {len(domains)} 个关联域名")
        except:
            self.results['ssl_certs'] = {"error": "查询失败或超时"}

    def shodan_info(self, ip):
        """Shodan 查询"""
        try:
            resp = requests.get(
                f"https://api.shodan.io/shodan/host/{ip}?key={self.api_keys.get('shodan', '')}"
            )
            data = resp.json()
            self.results['shodan'] = {
                "ports": data.get('ports', []),
                "org": data.get('org', 'N/A'),
                "os": data.get('os', 'N/A'),
                "vulns": list(data.get('vulns', []))[:10],
                "services": [
                    {"port": s['port'], "product": s.get('product', 'N/A')}
                    for s in data.get('data', [])[:10]
                ]
            }
            print(f"🔎 Shodan: 开放端口 {len(self.results['shodan']['ports'])}")
            if self.results['shodan']['vulns']:
                print(f"   已知漏洞: {', '.join(self.results['shodan']['vulns'][:5])}")
        except:
            self.results['shodan'] = {"error": "查询失败或需要API key"}

    def analyze_infrastructure(self, ip):
        """攻击基础设施分析"""
        geo = self.results.get('geo', {})
        asn = self.results.get('asn', {})

        risk_level = "LOW"
        risk_reasons = []

        # 风险判断
        if geo.get('country') in ['RU', 'KP', 'IR', '未知']:
            risk_level = "HIGH"
            risk_reasons.append("高风险国家")

        if geo.get('is_proxy') or geo.get('is_hosting'):
            risk_level = max(risk_level, "MEDIUM")
            risk_reasons.append("代理/VPN/云主机")

        abuse_score = self.results.get('abuseipdb', {}).get('score', 0)
        if abuse_score > 80:
            risk_level = "HIGH"
            risk_reasons.append(f"高恶意信誉分({abuse_score})")

        otx_pulses = self.results.get('otx', {}).get('pulse_count', 0)
        if otx_pulses > 10:
            risk_level = "HIGH"
            risk_reasons.append(f"多次威胁情报报告({otx_pulses})")

        self.results['infrastructure_analysis'] = {
            "risk_level": risk_level,
            "risk_reasons": risk_reasons,
            "likely_type": self._guess_attacker_type(geo, asn)
        }

        print(f"\n🔴 风险评估: {risk_level}")
        for reason in risk_reasons:
            print(f"   - {reason}")
        print(f"👤 攻击者类型推测: {self.results['infrastructure_analysis']['likely_type']}")

    def _guess_attacker_type(self, geo, asn):
        """根据IP特征推测攻击者类型"""
        if geo.get('is_proxy'):
            return "可能使用代理 — 真实身份难以确认"
        if geo.get('org', '').lower() in ['tencent', 'alibaba', 'huawei cloud', 'aws', 'azure', 'google cloud', 'digital ocean', 'vultr', 'linode']:
            return "来自云主机/VPS — 可能为跳板机或扫描器"
        if any(kw in (asn.get('name', '') or '').lower() for kw in ['vpn', 'proxy', 'hosting', 'dedicated']):
            return "来自托管/代理服务 — 可能为跳板"
        return "普通ISP用户 — 可能为真实IP"


# 使用示例
if __name__ == "__main__":
    tracer = IPTracer()
    tracer.api_keys = {
        "abuseipdb": "your-api-key",
        "vt": "your-vt-key",
        "shodan": "your-shodan-key"
    }
    result = tracer.trace("45.33.32.156")
    # 保存结果
    with open("iptrace_result.json", "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
```

### 3.2 攻击样本分析

```bash
#!/bin/bash
# malware_triage.sh - 恶意样本快速分析

SAMPLE=$1
echo "🔬 分析样本: $SAMPLE"
echo "================================"

# 1. 基础信息
echo -n "📏 文件大小: "
stat -c%s "$SAMPLE"
echo -n "🔐 SHA256: "
sha256sum "$SAMPLE" | cut -d' ' -f1
echo -n "🔐 MD5: "
md5sum "$SAMPLE" | cut -d' ' -f1

# 2. 文件类型
echo "📦 文件类型:"
file "$SAMPLE"

# 3. 字符串提取
echo "🔤 提取可疑字符串:"
strings "$SAMPLE" | grep -iE '(http|https|\.com|\.cn|\.net|cmd|powershell|base64|\.exe|\.dll|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' | sort -u | head -20

# 4. PE分析(如果是PE文件)
if file "$SAMPLE" | grep -qi "PE32"; then
    echo "📊 PE信息:"
    # 编译时间
    python3 -c "
import pefile
pe = pefile.PE('$SAMPLE')
print(f'编译时间: {pe.FILE_HEADER.TimeDateStamp}')
print(f'入口点: {hex(pe.OPTIONAL_HEADER.AddressOfEntryPoint)}')
print(f'区段数: {pe.FILE_HEADER.NumberOfSections}')
# 导入表
for entry in pe.DIRECTORY_ENTRY_IMPORT:
    print(f'导入DLL: {entry.dll.decode()}')
    for imp in entry.imports[:5]:
        print(f'  - {imp.name.decode() if imp.name else \"ordinal:\"+str(imp.ordinal)}')
" 2>/dev/null
fi

# 5. 快速YARA扫描
echo "🦠 YARA扫描:"
yara /opt/yara-rules/index.yar "$SAMPLE" 2>/dev/null | head -10
```

---

## 4. 主动反制：蜜罐与陷阱

### 4.1 Web 蜜标（Honeytoken）

```python
#!/usr/bin/env python3
"""
Web 蜜标系统 - 隐藏在 Web 应用中的陷阱文件/目录
当攻击者访问/下载时告警并记录
"""

from flask import Flask, request, send_file, jsonify
import time
import json
from datetime import datetime

app = Flask(__name__)

# 诱饵文件配置
HONEYFILES = {
    "/backup/database_backup_2026.sql": {
        "type": "fake_database_dump",
        "description": "伪造的数据库备份文件",
        "trigger_action": "攻击者尝试下载数据库",
        "severity": "HIGH"
    },
    "/admin/config.php.bak": {
        "type": "fake_config_backup",
        "description": "伪造的配置文件备份",
        "trigger_action": "攻击者尝试获取配置信息",
        "severity": "MEDIUM"
    },
    "/api/internal/user_list": {
        "type": "fake_api_endpoint",
        "description": "伪造的内部API接口",
        "trigger_action": "攻击者尝试获取用户列表",
        "severity": "HIGH"
    },
    "/.git/config": {
        "type": "git_leak",
        "description": "伪造的.git泄露",
        "trigger_action": "攻击者尝试获取源码信息",
        "severity": "MEDIUM"
    }
}

def alert_honeytoken(path, client_ip, user_agent, headers):
    """蜜标触发告警"""
    honeyfile_info = HONEYFILES.get(path, {})
    alert = {
        "alert_type": "Honeytoken触发",
        "severity": honeyfile_info.get('severity', 'MEDIUM'),
        "timestamp": datetime.now().isoformat(),
        "triggered_path": path,
        "description": honeyfile_info.get('description', '未知蜜标'),
        "action": honeyfile_info.get('trigger_action', ''),
        "attacker_ip": client_ip,
        "user_agent": user_agent,
        "headers": dict(headers),
        "cookies": dict(request.cookies),
        "method": request.method
    }

    # 1. 记录到攻击日志
    with open("/var/log/honeytoken/alerts.jsonl", "a") as f:
        f.write(json.dumps(alert, ensure_ascii=False) + "\n")

    # 2. 发送SIEM告警
    send_to_siem(alert)

    # 3. 钉钉通知
    send_dingtalk(alert)

    # 4. 自动封禁IP
    auto_block_ip(client_ip)

    return alert


@app.route('/backup/database_backup_2026.sql')
def fake_db_backup():
    """伪造的数据库备份 - 蜜标"""
    alert = alert_honeytoken(
        '/backup/database_backup_2026.sql',
        request.remote_addr,
        request.headers.get('User-Agent', ''),
        request.headers
    )

    # 返回虚假数据（看起来像真实备份，引导攻击者以为是真实数据）
    fake_sql = b"""-- MySQL dump 10.13
-- Host: localhost    Database: internal_erp
-- Server version 5.7.38

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
-- 看起来是真实数据库备份，实际是伪造数据
...（此处省略伪造SQL内容）
"""
    return fake_sql, 200, {'Content-Type': 'application/octet-stream'}


@app.route('/admin/config.php.bak')
def fake_config():
    """伪造的配置文件备份"""
    alert = alert_honeytoken(
        '/admin/config.php.bak',
        request.remote_addr,
        request.headers.get('User-Agent', ''),
        request.headers
    )

    fake_config = b"""<?php
// Database Configuration - INTERNAL USE ONLY
$db_host = '192.168.100.50';  // 这些IP都是虚假的蜜罐地址
$db_user = 'app_user';
$db_pass = 'P@ssw0rd_2026_Secure';
$db_name = 'erp_production';

// API Keys
$aws_access_key = 'AKIAIOSFODNN7FAKE';
$aws_secret_key = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';

// Redis Configuration
$redis_host = '192.168.100.51';
$redis_port = 6379;
$redis_password = 'Redis_Secure_2026';
?>
"""
    return fake_config, 200


@app.route('/api/internal/user_list')
def fake_user_list():
    """伪造的用户列表API"""
    alert = alert_honeytoken(
        '/api/internal/user_list',
        request.remote_addr,
        request.headers.get('User-Agent', ''),
        request.headers
    )

    fake_users = {
        "status": "success",
        "data": [
            {"id": 1, "username": "admin", "email": "admin@company-fake.com", "role": "superadmin"},
            {"id": 2, "username": "zhangsan", "email": "zhangsan@company-fake.com", "role": "user"},
            {"id": 3, "username": "lisi", "email": "lisi@company-fake.com", "role": "user"},
        ],
        "total": 3
    }
    return jsonify(fake_users)


@app.route('/<path:path>')
def catch_all(path):
    """捕获其他对蜜标路径的访问"""
    for honeypath in HONEYFILES:
        if path.startswith(honeypath.lstrip('/')):
            alert = alert_honeytoken(
                f"/{path}",
                request.remote_addr,
                request.headers.get('User-Agent', ''),
                request.headers
            )
            return jsonify({"status": "error", "message": "Not found"}), 404

    return jsonify({"status": "ok"}), 200


def send_to_siem(alert):
    """发送到SIEM (Elasticsearch)"""
    import requests
    requests.post(
        "http://elasticsearch:9200/honeytoken-alerts/_doc",
        json=alert
    )

def send_dingtalk(alert):
    """发送钉钉通知"""
    import requests
    message = f"""🚨 **蜜标触发告警**
> 路径: `{alert['triggered_path']}`
> IP: `{alert['attacker_ip']}`
> 类型: {alert['type']}
> 动作: {alert['action']}
> 时间: {alert['timestamp']}
> User-Agent: {alert['user_agent']}"""
    requests.post("YOUR_DINGTALK_WEBHOOK", json={
        "msgtype": "markdown",
        "markdown": {"title": "蜜标告警", "text": message}
    })

def auto_block_ip(ip):
    """自动封禁触发蜜标的IP"""
    import subprocess
    subprocess.run([
        "iptables", "-A", "INPUT", "-s", ip,
        "-j", "DROP",
        "-m", "comment", "--comment", f"HoneyToken_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    ])
    # 同时记录到永久黑名单
    with open("/etc/honeytoken/blocklist.txt", "a") as f:
        f.write(f"{ip} #{datetime.now().isoformat()}\n")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
```

### 4.2 SSH 蜜罐增强版

```python
#!/usr/bin/env python3
"""
SSH蜜罐 - 记录攻击者的所有操作
基于 Cowrie 扩展，捕获攻击者执行的命令
"""

import paramiko
import socket
import threading
import time
import json
from datetime import datetime

class SSHHoneypot(paramiko.ServerInterface):
    def __init__(self):
        self.event = threading.Event()
        self.commands = []
        self.client_ip = ""

    def check_channel_request(self, kind, chanid):
        if kind == 'session':
            return paramiko.OPEN_SUCCEEDED
        return paramiko.OPEN_FAILED_ADMINISTRATIVELY_PROHIBITED

    def check_channel_pty_request(self, channel, term, width, height, pixelwidth, pixelheight, modes):
        return True

    def check_channel_shell_request(self, channel):
        self.event.set()
        return True

    def check_channel_exec_request(self, channel, command):
        """记录攻击者执行的命令"""
        cmd = command.decode('utf-8', errors='ignore')
        timestamp = datetime.now().isoformat()

        self.commands.append({
            "timestamp": timestamp,
            "command": cmd,
            "ip": self.client_ip
        })

        log_entry = {
            "type": "ssh_honeypot_command",
            "timestamp": timestamp,
            "attacker_ip": self.client_ip,
            "command": cmd
        }
        print(json.dumps(log_entry, ensure_ascii=False))

        # 分析命令
        self.analyze_command(cmd)

        # 返回虚假输出
        if cmd.startswith('ls'):
            channel.send(b"Desktop  Documents  Downloads  secret_data\n")
        elif cmd.startswith('cat'):
            channel.send(b"This is fake file content\n")
        elif cmd.startswith('wget') or cmd.startswith('curl'):
            # 让攻击者下载我们的更多蜜标
            channel.send(b"Downloading... 100% complete\n")
        elif cmd.startswith('whoami'):
            channel.send(b"root\n")
        elif cmd.startswith('id'):
            channel.send(b"uid=0(root) gid=0(root) groups=0(root)\n")
        elif cmd.startswith('uname'):
            channel.send(b"Linux honeypot 5.15.0-generic #1-Ubuntu SMP x86_64 GNU/Linux\n")
        elif cmd.startswith('exit'):
            channel.send(b"logout\n")
            channel.close()
        else:
            channel.send(f"bash: {cmd.split()[0]}: command not found\n".encode())

        channel.send(b"$ ")
        return True

    def analyze_command(self, cmd):
        """分析攻击者命令，识别攻击意图"""
        intents = []

        # 下载恶意文件
        if cmd.startswith('wget ') or cmd.startswith('curl '):
            url = cmd.split()[1] if len(cmd.split()) > 1 else ''
            intents.append({
                "intent": "download_malware",
                "url": url,
                "severity": "HIGH"
            })

        # 信息收集
        if cmd in ['whoami', 'id', 'uname -a', 'cat /etc/passwd', 'ifconfig', 'ip addr']:
            intents.append({
                "intent": "reconnaissance",
                "command": cmd,
                "severity": "MEDIUM"
            })

        # 横向移动准备
        if 'ssh' in cmd or 'scp' in cmd:
            intents.append({
                "intent": "lateral_movement",
                "command": cmd,
                "severity": "HIGH"
            })

        if intents:
            alert = {
                "type": "ssh_honeypot_threat_detected",
                "attacker_ip": self.client_ip,
                "intents": intents,
                "command": cmd,
                "timestamp": datetime.now().isoformat()
            }
            # 发送告警
            self.send_alert(alert)

    def send_alert(self, alert):
        """发送告警到SIEM"""
        import requests
        try:
            requests.post(
                "http://elasticsearch:9200/ssh-honeypot-alerts/_doc",
                json=alert,
                timeout=2
            )
        except:
            pass


def start_honeypot(port=2222):
    """启动SSH蜜罐"""
    host_key = paramiko.RSAKey.generate(2048)

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind(('0.0.0.0', port))
    sock.listen(100)

    print(f"🐝 SSH蜜罐启动在端口 {port}")

    while True:
        client, addr = sock.accept()
        print(f"🍯 新的连接: {addr[0]}:{addr[1]}")

        try:
            transport = paramiko.Transport(client)
            transport.add_server_key(host_key)

            server = SSHHoneypot()
            server.client_ip = addr[0]

            transport.start_server(server=server)
            channel = transport.accept(20)

            if channel is None:
                continue

            channel.send(b"Welcome to Ubuntu 22.04.2 LTS (GNU/Linux 5.15.0-generic x86_64)\n\n")
            channel.send(b"$ ")

            server.event.wait(10)
            channel.close()

        except Exception as e:
            print(f"错误: {e}")
        finally:
            try:
                transport.close()
            except:
                pass


if __name__ == "__main__":
    start_honeypot()
```

---

## 5. 社交溯源

### 5.1 攻击者身份关联技术

| 溯源维度 | 方法 | 工具 |
|---------|------|------|
| SSL证书 | 通过证书的Common Name/Organization追溯 | crt.sh / Censys |
| JS指纹 | 攻击工具中的JS特征与其他站点关联 | JARM / JA3指纹 |
| Whois | 域名的历史Whois信息 | DomainTools / WhoisXML |
| 邮件头 | 钓鱼邮件的真实发件IP/User-Agent | MXToolbox |
| GitHub | 代码特征、API Key、注释风格 | GitHub Code Search |
| 论坛/Telegram | TTP特征、ID/头像、语言风格 | Google Dork |
| 社工库 | IP关联的社交账号 | （仅限公安机关使用） |

---

## 6. 完整溯源案例

**背景**：护网第5天，蜜罐捕获到攻击者通过SSH登录后在下载恶意文件。

**溯源过程**：

```
Step 1: IP溯源
├─ 攻击IP: 185.220.xxx.xxx
├─ GeoIP: 德国 / 柏林
├─ ISP: DigitalOcean
├─ ASN: AS14061
└─ 判定: VPS跳板，非真实IP

Step 2: 恶意文件分析
├─ 攻击者通过 wget 下载了 http://evil-example.com/payload.sh
├─ payload.sh 解Base64后为 Cobalt Strike Beacon
├─ C2域名: api-update.security-check.net
└─ C2 IP: 45.33.32.156

Step 3: 攻击基础设施分析
├─ 域名: security-check.net
├─ 注册时间: 2026-05-01 (护网前1个月)
├─ 注册商: Namecheap
├─ SSL证书: Let's Encrypt (api-update.security-check.net)
├─ 同IP关联域名:
│   ├─ update-cdn.security-check.net
│   └─ dns-tunnel.security-check.net
├─ C2服务器开放端口: 443, 8080, 8443
└─ C2服务器上也运行着一个WordPress站点（用于伪装）

Step 4: 攻击者身份推测
├─ 攻击手法: Cobalt Strike + DNS隧道 + procdump LSASS
├─ TTP特征: 使用CloudFlare Worker隐藏C2 / Let's Encrypt证书 / Namecheap域名
├─ 目标选择: 金融行业 / 偏好攻击Exchange
└─ 与已知APT组织匹配度: 中等(与APT29有部分TTP重合，但不能确认)

Step 5: 溯源报告
└─ IOC已同步MISP → 情报共享
└─ C2服务器信息已报送CNCERT
```

---

## 7. 排错与注意事项

| 问题 | 解决 |
|------|------|
| 溯源到的IP是Tor/代理 | 记录即可，不要进一步追踪（Tor节点 = 死胡同） |
| 攻击者使用Cloudflare CDN | 先查真实IP：DNS历史 → SecurityTrails → 其他子域名 |
| 蜜罐被识别（攻击者秒退） | 增加环境真实性（模拟真实文件/进程/定时任务） |
| 反制操作误伤正常用户 | 蜜标路径不要设置得太"诱人"，只放在攻击者会扫描的地方 |
| 溯源报告被用于追责 | 遵守公司规定，溯源数据仅供安全防护参考 |

---

## ✅ 溯源手册 Checklist

- [ ] 确认攻击IOC（IP/域名/Hash）
- [ ] GeoIP + ASN查询
- [ ] 威胁情报查询（OTX/AbuseIPDB/VT）
- [ ] 域名Whois/注册信息
- [ ] SSL证书关联查询
- [ ] 攻击工具分析（样本triage）
- [ ] C2基础设施映射
- [ ] TTP提取 + ATT&CK Mapping
- [ ] 编写溯源报告
- [ ] IOC提交MISP/情报共享
- [ ] 如严重：报送公安机关/CNCERT
- [ ] 更新黑名单规则

> 📚 延伸阅读：HW/003-红蓝对抗反制 | HW/007-蜜罐部署 | Intel/001-APT组织分析
