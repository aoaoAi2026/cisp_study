# SOAR 安全编排自动化与响应实战

> **📘 文档定位**：CISP 考试 安全运营 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：30 分钟
>
> 系统讲解 SOAR（安全编排自动化与响应）平台的架构、Playbook 编写、事件响应自动化及与 SIEM/EDR/威胁情报的集成方案。

---

## 导航目录

- [一、SOAR 平台架构](#一soar-平台架构)
- [二、Playbook 编写实战](#二playbook-编写实战)
- [三、事件响应自动化](#三事件响应自动化)
- [四、SIEM/EDR/TI 集成](#四siemedrti-集成)
- [五、SOAR 运营度量](#五soar-运营度量)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

> 📅 2026-06-12 | 🎯 精通 | ⏱ 25 min | 分类：安全运营/SOC

## 📋 提纲

1. SOAR 概念与价值：为什么需要编排
2. 开源 SOAR 三剑客对比（Shuffle / n8n / StackStorm）
3. Shuffle 完整部署与架构
4. Playbook 开发实战：钓鱼邮件自动处置
5. Playbook 开发实战：暴力破解自动封禁
6. Playbook 开发实战：EDR 告警自动取证
7. 与 TheHive / Wazuh / MISP 集成
8. 排错指南与性能优化
9. 生产环境运维 Checklist

---

## 1. SOAR 概念与价值

### 1.1 无 SOAR 的 SOC（痛苦循环）

```
告警 → Tier1 登录 SIEM 查看 → 登录 EDR 查看主机 → 登录威胁情报平台查询
→ 复制粘贴到 Excel → 登录防火墙封禁 IP → 创建工单 → 发邮件通知
→ 记录处置结果 → 下一个告警（重复上面所有步骤）

一个告警平均耗时：15-30 分钟
Tier1 日处理告警上限：20-40 条
```

### 1.2 有 SOAR 的 SOC（自动化循环）

```
告警 → Shuffle 自动触发 Workflow → 自动查询 SIEM + EDR + 威胁情报
→ 自动判定(误报/真阳) → 自动封禁 IP → 自动创建工单 → 自动发通知
→ Tier1 只需确认/修正结果

一个告警平均耗时：2-5 分钟（Tier1 介入）
Tier1 日处理告警上限：100-200 条
```

**ROI 计算**：
```python
# SOAR 投资回报计算
def soar_roi(monthly_alerts, avg_manual_minutes, avg_auto_minutes, hourly_rate):
    manual_hours_per_month = (monthly_alerts * avg_manual_minutes) / 60
    auto_hours_per_month = (monthly_alerts * avg_auto_minutes) / 60
    saved_hours = manual_hours_per_month - auto_hours_per_month
    saved_cost_per_month = saved_hours * hourly_rate
    return {
        "节省工时/月": saved_hours,
        "节省成本/月": saved_cost_per_month,
        "节省成本/年": saved_cost_per_month * 12
    }

# 示例：月告警5000，手工15分钟，自动3分钟，时薪100
result = soar_roi(5000, 15, 3, 100)
# 节省工时: 1000小时/月, 节省成本: 10万/月, 120万/年
```

---

## 2. 开源 SOAR 三剑客对比

| 特性 | Shuffle | n8n | StackStorm |
|------|---------|-----|------------|
| 部署难度 | ⭐⭐ 简单 | ⭐ 最简单 | ⭐⭐⭐ 中等 |
| Web UI | ✅ 优秀 | ✅ 最佳 | ⚠️ 一般 |
| 安全集成 | ✅ 丰富(100+) | ⚠️ 需自建 | ✅ 丰富 |
| Python 支持 | ✅ 原生 | ⚠️ Code节点 | ✅ 原生 |
| 社区规模 | 中等 | 大(通用自动化) | 大(DevOps) |
| 适合场景 | **安全专用** | 通用+安全 | DevOps+安全 |
| API 触发 | ✅ | ✅ | ✅ |
| 定时任务 | ✅ | ✅ | ✅ |
| 并行执行 | ✅ | ✅ | ✅ |
| 错误处理 | ✅ 重试+回滚 | ✅ | ✅ |

推荐：**Shuffle 做安全 Playbook 主引擎 + TheHive 做案例管理 + n8n 做辅助自动化（通知/报表等）**

---

## 3. Shuffle 部署与架构

```yaml
# docker-compose-shuffle.yml
version: '3.8'
services:
  # Shuffle 后端
  shuffle-backend:
    image: ghcr.io/shuffle/shuffle-backend:1.4.0
    container_name: shuffle-backend
    ports:
      - "5001:5001"
    environment:
      - SHUFFLE_OPENSEARCH_URL=https://opensearch:9200
      - SHUFFLE_OPENSEARCH_USERNAME=admin
      - SHUFFLE_OPENSEARCH_PASSWORD=${OPENSEARCH_PASSWORD}
      - SHUFFLE_OPENSEARCH_SKIPSSL_VERIFY=true
      - SHUFFLE_FILE_LOCATION=/app/shuffle-files
      - SHUFFLE_DEFAULT_EXECUTION_ARG=shuffle-tools_1.0.0
      - SHUFFLE_SWARM_CONFIG=run
      - SHUFFLE_LOGS_DISABLED=false
      - SHUFFLE_GRAYLOG_DISABLED=true
      - AUTH_SECRET=${SHUFFLE_AUTH_SECRET}
      - SHUFFLE_STATS_DISABLED=true
    volumes:
      - shuffle_files:/app/shuffle-files:rw
      - /var/run/docker.sock:/var/run/docker.sock  # 用于启动Worker容器
    restart: always

  # Shuffle 前端
  shuffle-frontend:
    image: ghcr.io/shuffle/shuffle-frontend:1.4.0
    container_name: shuffle-frontend
    ports:
      - "3443:3443"
      - "3001:3001"
    environment:
      - BACKEND_HOSTNAME=http://shuffle-backend:5001
    depends_on:
      - shuffle-backend
    restart: always

  # Orborus (Worker 管理)
  shuffle-orborus:
    image: ghcr.io/shuffle/shuffle-orborus:1.4.0
    container_name: shuffle-orborus
    environment:
      - SHUFFLE_OPENSEARCH_URL=https://opensearch:9200
      - SHUFFLE_OPENSEARCH_USERNAME=admin
      - SHUFFLE_OPENSEARCH_PASSWORD=${OPENSEARCH_PASSWORD}
      - SHUFFLE_OPENSEARCH_SKIPSSL_VERIFY=true
      - ORG_ID=${SHUFFLE_ORG_ID}
      - BASE_URL=http://shuffle-backend:5001
      - SHUFFLE_SWARM_NETWORK_NAME=shuffle_swarm
      - DOCKER_HOST=unix:///var/run/docker.sock
      - SHUFFLE_WORKER_IMAGE=ghcr.io/shuffle/shuffle-worker:1.4.0
      - CLEANUP=true
      - HTTP_PROXY=
      - SHUFFLE_SCALE_REPLICAS=5
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    depends_on:
      - shuffle-backend
    restart: always

  # OpenSearch (存储)
  opensearch:
    image: opensearchproject/opensearch:2.11.0
    container_name: opensearch
    environment:
      - discovery.type=single-node
      - plugins.security.disabled=true
      - "OPENSEARCH_JAVA_OPTS=-Xms2g -Xmx2g"
    ports:
      - "9200:9200"
    restart: always

volumes:
  shuffle_files:
```

---

## 4. Playbook 实战：钓鱼邮件自动处置

这是 SOC 最高频的自动化场景。

```python
#!/usr/bin/env python3
"""
Shuffle Custom App: 钓鱼邮件自动处置
部署方式: Shuffle → Apps → Create New App → 粘贴此代码
"""

import requests
import json
import base64
import hashlib
from datetime import datetime

class PhishingAutoResponse:
    def __init__(self, config):
        self.thehive_url = config.get('thehive_url', 'http://thehive:9000')
        self.thehive_api = config.get('thehive_api_key')
        self.wazuh_url = config.get('wazuh_url', 'http://wazuh:55000')
        self.wazuh_user = config.get('wazuh_user', 'wazuh')
        self.wazuh_pass = config.get('wazuh_pass')
        self.misp_url = config.get('misp_url')
        self.misp_api = config.get('misp_api_key')
        self.firewall_url = config.get('firewall_url')
        self.firewall_token = config.get('firewall_token')
        self.smtp_config = config.get('smtp', {})

    def execute(self, alert):
        """主入口：接收SIEM告警，自动处置"""
        results = []

        # Step 1: 解析告警，提取关键信息
        parsed = self.parse_phishing_alert(alert)
        results.append({"step": "解析告警", "status": "success", "data": parsed})

        # Step 2: 提取邮件附件/URL
        indicators = self.extract_indicators(parsed)
        results.append({"step": "提取IOC", "status": "success", "data": indicators})

        # Step 3: 多引擎检测 URL
        url_results = self.check_urls(indicators.get('urls', []))
        results.append({"step": "URL检测", "status": "success", "data": url_results})

        # Step 4: 多引擎检测附件 Hash
        hash_results = self.check_hashes(indicators.get('hashes', []))
        results.append({"step": "Hash检测", "status": "success", "data": hash_results})

        # Step 5: 判定钓鱼确认
        is_phishing = self.verdict(url_results, hash_results)
        results.append({"step": "判定", "verdict": "钓鱼邮件" if is_phishing else "低风险"})

        # Step 6: 自动处置
        if is_phishing:
            # 6.1 从邮件网关撤回邮件
            self.recall_email(parsed.get('message_id'))
            results.append({"step": "邮件撤回", "status": "done"})

            # 6.2 封禁发件人域名/IP
            self.block_sender(parsed.get('sender_domain'), parsed.get('sender_ip'))
            results.append({"step": "封禁发件人", "status": "done"})

            # 6.3 检查是否有员工点击了链接/下载了附件
            clicked_users = self.check_user_clicks(indicators.get('urls', []))
            if clicked_users:
                self.isolate_endpoints(clicked_users)
                results.append({"step": "终端隔离", "status": "done", "users": clicked_users})

            # 6.4 清理所有用户邮箱中的同一钓鱼邮件
            self.purge_malicious_email(parsed.get('subject'), parsed.get('sender'))
            results.append({"step": "全网清除", "status": "done"})

        # Step 7: 创建 TheHive 案例
        case = self.create_thehive_case(parsed, indicators, is_phishing, results)
        results.append({"step": "创建工单", "case_id": case.get('id')})

        # Step 8: 发送通知
        self.send_notification(parsed, is_phishing, case.get('id'))

        return {"status": "completed", "is_phishing": is_phishing, "steps": results}

    def parse_phishing_alert(self, alert):
        """解析SIEM告警，提取结构化信息"""
        return {
            "alert_id": alert.get('_id'),
            "timestamp": alert.get('@timestamp'),
            "subject": alert.get('email_subject', ''),
            "sender": alert.get('email_from', ''),
            "sender_domain": alert.get('email_from', '').split('@')[-1] if '@' in alert.get('email_from', '') else '',
            "sender_ip": alert.get('source_ip', ''),
            "recipients": alert.get('email_to', []),
            "message_id": alert.get('email_message_id', ''),
            "raw_body": alert.get('email_body', ''),
            "attachment_names": alert.get('attachment_names', []),
            "urls_in_body": alert.get('urls_in_email', []),
            "has_spf_pass": alert.get('spf_result', 'fail'),
            "has_dkim_pass": alert.get('dkim_result', 'fail'),
            "has_dmarc_pass": alert.get('dmarc_result', 'fail'),
        }

    def extract_indicators(self, parsed):
        """提取 IOC"""
        indicators = {"urls": [], "hashes": [], "ips": [], "domains": []}

        # 提取URL
        import re
        url_pattern = re.compile(r'https?://[^\s<>"\']+')
        indicators['urls'] = list(set(
            parsed.get('urls_in_body', []) +
            re.findall(url_pattern, parsed.get('raw_body', ''))
        ))

        # 提取发件人IP和域名
        if parsed.get('sender_ip'):
            indicators['ips'].append(parsed['sender_ip'])
        if parsed.get('sender_domain'):
            indicators['domains'].append(parsed['sender_domain'])

        # 查询附件Hash（从沙箱或邮件网关API获取）
        # 这里简化处理
        for attachment in parsed.get('attachment_names', []):
            indicators['hashes'].append({
                "filename": attachment,
                "sha256": self.get_attachment_hash(parsed['message_id'], attachment)
            })

        return indicators

    def check_urls(self, urls):
        """多引擎 URL 检测"""
        results = {}
        for url in urls[:10]:  # 限制10个URL，避免API过载
            # VirusTotal
            vt_result = self.check_virustotal_url(url)
            # URLScan.io
            urlscan_result = self.check_urlscan(url)
            # 自建沙箱
            sandbox_result = self.check_sandbox(url)

            results[url] = {
                "virustotal": vt_result,
                "urlscan": urlscan_result,
                "sandbox": sandbox_result,
                "malicious_score": sum([
                    vt_result.get('positives', 0) * 3,
                    10 if urlscan_result.get('malicious') else 0,
                    10 if sandbox_result.get('malicious') else 0
                ])
            }
        return results

    def check_hashes(self, hashes):
        """多引擎 Hash 检测"""
        results = {}
        for h in hashes[:5]:
            sha256 = h.get('sha256', '')
            filename = h.get('filename', 'unknown')

            # VirusTotal Hash查询
            vt_result = self.check_virustotal_hash(sha256)
            # MISP查询
            misp_result = self.search_misp(sha256)

            results[filename] = {
                "sha256": sha256,
                "virustotal": vt_result,
                "misp": misp_result,
                "malicious": vt_result.get('positives', 0) > 3
            }
        return results

    def verdict(self, url_results, hash_results):
        """综合判定"""
        score = 0

        # URL判定
        for url, result in url_results.items():
            score += result.get('malicious_score', 0)

        # 附件判定
        for filename, result in hash_results.items():
            if result.get('malicious'):
                score += 30

        # 邮件头判定（SPF/DKIM/DMARC）
        # (在parse_phishing_alert中已提取)

        return score >= 30  # 阈值30分判定为钓鱼

    def check_virustotal_url(self, url):
        """VirusTotal URL检测"""
        try:
            # VT API v3
            url_id = base64.urlsafe_b64encode(url.encode()).decode().strip('=')
            resp = requests.get(
                f"https://www.virustotal.com/api/v3/urls/{url_id}",
                headers={"x-apikey": self.config.get('vt_api_key')}
            )
            data = resp.json()
            stats = data.get('data', {}).get('attributes', {}).get('last_analysis_stats', {})
            return {
                "malicious": stats.get('malicious', 0),
                "suspicious": stats.get('suspicious', 0),
                "positives": stats.get('malicious', 0) + stats.get('suspicious', 0),
                "total": sum(stats.values())
            }
        except Exception as e:
            return {"error": str(e), "positives": 0}

    def check_urlscan(self, url):
        """URLScan.io 扫描"""
        try:
            resp = requests.post(
                "https://urlscan.io/api/v1/scan/",
                headers={"API-Key": self.config.get('urlscan_api_key')},
                json={"url": url, "visibility": "public"}
            )
            return resp.json()
        except:
            return {"malicious": False}

    def check_sandbox(self, url):
        """提交到内部沙箱"""
        return {"malicious": False}

    def check_virustotal_hash(self, sha256):
        """VT Hash查询"""
        try:
            resp = requests.get(
                f"https://www.virustotal.com/api/v3/files/{sha256}",
                headers={"x-apikey": self.config.get('vt_api_key')}
            )
            data = resp.json()
            stats = data.get('data', {}).get('attributes', {}).get('last_analysis_stats', {})
            return {
                "malicious": stats.get('malicious', 0),
                "positives": stats.get('malicious', 0),
                "total": sum(stats.values())
            }
        except:
            return {"positives": 0}

    def search_misp(self, sha256):
        """MISP 威胁情报查询"""
        try:
            resp = requests.post(
                f"{self.misp_url}/attributes/restSearch",
                headers={"Authorization": self.misp_api},
                json={"returnFormat": "json", "value": sha256, "type": "sha256"}
            )
            events = resp.json().get('response', {}).get('Attribute', [])
            return {"found": len(events) > 0, "events": len(events)}
        except:
            return {"found": False}

    def recall_email(self, message_id):
        """通过邮件网关API撤回邮件（Microsoft 365 / Google Workspace）"""
        # Microsoft 365: Search-Mailbox + Delete
        # 示例：使用 Graph API
        try:
            resp = requests.post(
                f"https://graph.microsoft.com/v1.0/security/actions/emailActions",
                headers={"Authorization": f"Bearer {self.config.get('msgraph_token')}"},
                json={
                    "actionType": "softDelete",
                    "messageId": message_id
                }
            )
            return resp.status_code == 200
        except:
            return False

    def block_sender(self, domain, ip):
        """自动封禁发件人"""
        # 防火墙封禁IP
        if ip:
            requests.post(
                f"{self.firewall_url}/api/v2/cmdb/firewall/address",
                headers={"Authorization": f"Bearer {self.firewall_token}"},
                json={
                    "name": f"BLOCK_PHISH_{ip}",
                    "subnet": f"{ip}/32",
                    "comment": f"钓鱼邮件发件人IP - {datetime.now().isoformat()}"
                }
            )
        # 邮件网关封禁域名
        if domain:
            requests.post(
                f"https://graph.microsoft.com/v1.0/security/tiIndicators",
                headers={"Authorization": f"Bearer {self.config.get('msgraph_token')}"},
                json={
                    "action": "block",
                    "domainName": domain,
                    "description": f"钓鱼邮件发件人域名 - {datetime.now().isoformat()}"
                }
            )

    def check_user_clicks(self, urls):
        """查询代理/EDR日志：哪些员工访问了钓鱼URL"""
        # 通过 EDR/代理日志查询
        es_query = {
            "query": {
                "bool": {
                    "must": [
                        {"terms": {"url.original": urls}},
                        {"range": {"@timestamp": {"gte": "now-24h"}}}
                    ]
                }
            },
            "size": 100,
            "_source": ["host.name", "user.name", "url.original"]
        }

        try:
            resp = requests.post(
                f"{self.config.get('es_url')}/proxy-logs-*/_search",
                json=es_query
            )
            hits = resp.json().get('hits', {}).get('hits', [])
            users = list(set(h['_source'].get('user',{}).get('name','') for h in hits))
            return users
        except:
            return []

    def isolate_endpoints(self, users):
        """隔离点击了钓鱼链接的用户终端"""
        for user in users:
            # Wazuh active response 隔离
            agent_id = self.get_wazuh_agent_by_user(user)
            if agent_id:
                requests.put(
                    f"{self.wazuh_url}/active-response/{agent_id}",
                    headers={"Authorization": f"Bearer {self.wazuh_token}"},
                    json={
                        "command": "firewall-drop",
                        "arguments": ["block_network"],
                        "alert": {"data": {"srcip": "any"}}
                    }
                )

    def purge_malicious_email(self, subject, sender):
        """全网清理恶意邮件"""
        # Microsoft 365: Search and Purge
        purge_request = {
            "searchQuery": f"subject:'{subject}' AND from:'{sender}'",
            "action": "SoftDelete"
        }
        requests.post(
            f"https://graph.microsoft.com/v1.0/security/actions/purgeEmailActions",
            headers={"Authorization": f"Bearer {self.config.get('msgraph_token')}"},
            json=purge_request
        )

    def create_thehive_case(self, parsed, indicators, is_phishing, results):
        """创建 TheHive 案例"""
        case = {
            "title": f"[{'钓鱼' if is_phishing else '可疑'}] {parsed.get('subject','无主题')}",
            "description": f"""
## 邮件信息
- 发件人: {parsed.get('sender')}
- 主题: {parsed.get('subject')}
- 收件人数: {len(parsed.get('recipients',[]))}
- SPF: {parsed.get('has_spf_pass')} | DKIM: {parsed.get('has_dkim_pass')} | DMARC: {parsed.get('has_dmarc_pass')}

## 检测结果
- URL检测: {json.dumps(indicators.get('urls',[]), indent=2, ensure_ascii=False)}
- 附件Hash: {json.dumps(indicators.get('hashes',[]), indent=2, ensure_ascii=False)}

## 自动处置
{json.dumps([s for s in results if s.get('step') not in ['解析告警','提取IOC','URL检测','Hash检测','判定']], indent=2, ensure_ascii=False)}
            """.strip(),
            "severity": 3 if is_phishing else 2,
            "tlp": 2,  # Amber
            "pap": 2,   # Amber
            "tags": ["phishing", "auto-response", "SOAR"]
        }

        resp = requests.post(
            f"{self.thehive_url}/api/case",
            headers={"Authorization": f"Bearer {self.thehive_api}"},
            json=case
        )
        return resp.json()

    def send_notification(self, parsed, is_phishing, case_id):
        """发送钉钉/飞书/企业微信通知"""
        if is_phishing:
            message = f"""
🚨 **钓鱼邮件告警 - 已自动处置**
> 发件人: {parsed.get('sender')}
> 主题: {parsed.get('subject')}
> 判定: 确认钓鱼 ✅
> 已执行: 撤回邮件 | 封禁发件人 | 全网清除
> 工单: [{case_id}]({self.thehive_url}/cases/{case_id})
            """.strip()

            # 钉钉通知
            requests.post(
                self.config.get('dingtalk_webhook'),
                json={"msgtype": "markdown", "markdown": {"title": "钓鱼邮件告警", "text": message}}
            )


# Shuffle App 入口
def shuffle_execute(alert, config):
    handler = PhishingAutoResponse(config)
    return handler.execute(alert)
```

---

## 5. Playbook 实战：暴力破解自动封禁

```python
#!/usr/bin/env python3
"""
Shuffle App: 暴力破解自动封禁 + 自动溯源
"""

class BruteForceAutoBlock:
    def __init__(self, config):
        self.config = config
        self.threshold_map = {
            "SSH": {"attempts": 20, "window_minutes": 5, "block_hours": 24},
            "RDP": {"attempts": 10, "window_minutes": 5, "block_hours": 48},
            "VPN":  {"attempts": 15, "window_minutes": 10, "block_hours": 12},
            "Web Login": {"attempts": 30, "window_minutes": 10, "block_hours": 6},
        }

    def execute(self, alert):
        service = alert.get('service', 'SSH')
        source_ip = alert.get('source_ip', '')
        target_host = alert.get('target_host', '')
        attempts = self.count_recent_attempts(source_ip, service)

        threshold = self.threshold_map.get(service, {"attempts": 20, "window_minutes": 5, "block_hours": 24})

        if attempts >= threshold['attempts']:
            # 1. 查询威胁情报——这个IP是否是已知恶意IP
            is_known_malicious = self.check_threat_intel(source_ip)

            # 2. 检查是否是内部IP（误封风险）
            is_internal = self.is_internal_ip(source_ip)
            if is_internal:
                # 内部IP不封，但创建高优先级工单
                self.create_incident("internal_bruteforce", source_ip, target_host)
                return {"action": "create_incident", "reason": "内部IP异常行为"}

            # 3. 自动封禁
            block_result = self.block_ip(source_ip, threshold['block_hours'])
            
            # 4. 如果该IP有成功登录记录，立即溯源
            successful_logins = self.check_successful_logins(source_ip, target_host)
            if successful_logins:
                self.initiate_incident_response(source_ip, target_host, successful_logins)

            # 5. 创建工单
            case_id = self.create_case(source_ip, service, target_host, attempts, threshold['block_hours'])

            return {
                "action": "blocked",
                "ip": source_ip,
                "attempts": attempts,
                "block_hours": threshold['block_hours'],
                "known_malicious": is_known_malicious,
                "case_id": case_id
            }

        return {"action": "monitor", "attempts": attempts, "threshold": threshold['attempts']}

    def count_recent_attempts(self, source_ip, service):
        """查询 ES 统计最近N分钟内同一IP的失败登录次数"""
        window = self.threshold_map.get(service, {}).get('window_minutes', 5)
        query = {
            "query": {
                "bool": {
                    "must": [
                        {"term": {"source.ip": source_ip}},
                        {"term": {"event.action": "authentication_failure"}},
                        {"term": {"service.type": service.lower()}},
                        {"range": {"@timestamp": {"gte": f"now-{window}m"}}}
                    ]
                }
            }
        }
        resp = requests.post(f"{self.config['es_url']}/auth-logs-*/_count", json=query)
        return resp.json().get('count', 0)

    def check_threat_intel(self, ip):
        """查询多个威胁情报源"""
        # AlienVault OTX
        otx = requests.get(f"https://otx.alienvault.com/api/v1/indicators/IPv4/{ip}/general")
        otx_pulses = len(otx.json().get('pulse_info', {}).get('pulses', []))

        # AbuseIPDB
        abuse = requests.get(
            f"https://api.abuseipdb.com/api/v2/check?ipAddress={ip}",
            headers={"Key": self.config['abuseipdb_key']}
        )
        abuse_score = abuse.json().get('data', {}).get('abuseConfidenceScore', 0)

        # 汇总判定
        return {
            "otx_pulses": otx_pulses,
            "abuseipdb_score": abuse_score,
            "is_malicious": otx_pulses > 5 or abuse_score > 80
        }

    def is_internal_ip(self, ip):
        """判断是否为内网IP"""
        import ipaddress
        try:
            addr = ipaddress.ip_address(ip)
            return addr.is_private
        except:
            return False

    def block_ip(self, ip, hours):
        """调用多种方式封禁IP"""
        results = []

        # 1. iptables 封禁（Linux 服务器）
        for host in self.get_affected_hosts(ip):
            cmd = f"iptables -A INPUT -s {ip} -j DROP -m comment --comment 'SOAR_AUTO_BLOCK_{hours}h'"
            self.ssh_execute(host, cmd)
            results.append(f"iptables_blocked_on_{host}")

        # 2. 防火墙 API 封禁
        resp = requests.post(
            f"{self.config['firewall_url']}/api/v2/cmdb/firewall/address",
            headers={"Authorization": f"Bearer {self.config['firewall_token']}"},
            json={
                "name": f"SOAR_BLOCK_{ip}",
                "subnet": f"{ip}/32",
                "comment": f"暴力破解自动封禁 {hours}小时",
                "associated-interface": "wan"
            }
        )
        results.append("firewall_blocked")

        # 3. 加入防火墙黑名单组 + 策略
        requests.post(
            f"{self.config['firewall_url']}/api/v2/cmdb/firewall/addrgrp/SOAR_BLOCKLIST/member",
            headers={"Authorization": f"Bearer {self.config['firewall_token']}"},
            json={"name": f"SOAR_BLOCK_{ip}"}
        )
        results.append("added_to_blocklist_group")

        # 4. 设置自动解封定时任务
        self.schedule_unblock(ip, hours)

        return results

    def schedule_unblock(self, ip, hours):
        """设置 N 小时后自动解封"""
        # 使用 Shuffle 的 Scheduler 功能
        # 或使用 Redis 的 EXPIRE
        import redis
        r = redis.Redis(host=self.config.get('redis_host', 'redis'))
        r.setex(f"soar:unblock:{ip}", hours * 3600, "pending")
        # 定时任务会扫描这个key，到期后执行解封

    def check_successful_logins(self, source_ip, target_host):
        """检查攻击IP是否有成功登录"""
        query = {
            "query": {
                "bool": {
                    "must": [
                        {"term": {"source.ip": source_ip}},
                        {"term": {"event.action": "authentication_success"}},
                        {"range": {"@timestamp": {"gte": "now-24h"}}}
                    ]
                }
            }
        }
        resp = requests.post(f"{self.config['es_url']}/auth-logs-*/_search", json=query)
        hits = resp.json().get('hits', {}).get('hits', [])
        return [{"user": h['_source'].get('user',{}).get('name',''), 
                 "time": h['_source'].get('@timestamp',''),
                 "host": h['_source'].get('host',{}).get('name','')} 
                for h in hits]

    def initiate_incident_response(self, source_ip, target_host, successful_logins):
        """如果攻击成功，启动应急响应"""
        # 通知 Tier3
        users = list(set(l['user'] for l in successful_logins))
        message = f"""
🔴 **暴力破解成功告警 - 启动应急**
> 攻击IP: {source_ip}
> 目标主机: {target_host}
> 成功登录账号: {', '.join(users)}
> 成功登录时间: {', '.join(l['time'] for l in successful_logins[:3])}
> 已自动封禁攻击IP
> **请立即排查这些账号是否有异常操作！**
        """.strip()
        
        requests.post(self.config['dingtalk_webhook'], 
                      json={"msgtype": "markdown", "markdown": {"title": "紧急:暴力破解成功", "text": message}})

    def create_case(self, ip, service, target, attempts, block_hours):
        """创建工单"""
        resp = requests.post(
            f"{self.config['thehive_url']}/api/case",
            headers={"Authorization": f"Bearer {self.config['thehive_api']}"},
            json={
                "title": f"[自动封禁] {service}暴力破解 - {ip}",
                "description": f"来源IP: {ip}\n尝试次数: {attempts}\n目标: {target}\n封禁时长: {block_hours}h",
                "severity": 3,
                "tlp": 2,
                "tags": ["bruteforce", "auto-block", "SOAR"]
            }
        )
        return resp.json().get('id')


def shuffle_execute(alert, config):
    return BruteForceAutoBlock(config).execute(alert)
```

---

## 6. 与安全工具集成参考

| 集成目标 | 方向 | 用途 |
|---------|------|------|
| TheHive | 读写 | 创建/更新/关闭工单 |
| Wazuh | 读写 | 查询Agent状态/触发Active Response |
| MISP | 读写 | 查询/上传 IOC |
| Elasticsearch | 只读 | 关联查询/统计分析 |
| VirusTotal | 只读 | URL/Hash/IP 检测 |
| AbuseIPDB | 只读 | IP 信誉查询 |
| Microsoft Graph | 读写 | 邮件撤回/清除/用户操作 |
| 防火墙API | 读写 | IP封禁/解封 |
| 钉钉/飞书/企微 | 只写 | 告警通知 |
| LDAP/AD | 只读 | 用户信息查询 |

---

## 7. 排错指南

```bash
# 问题1: Shuffle Workflow 执行卡住
# 检查 Orborus 是否正常运行
docker logs shuffle-orborus --tail 50

# 检查是否有僵尸 Worker
docker ps -a --filter "name=shuffle-worker" --filter "status=exited"
# 清理僵尸Worker
docker container prune -f

# 问题2: App 执行超时
# 在 Shuffle App 设置中增加 timeout
# Workflow Settings → Timeout → 300 (秒)

# 问题3: 回调通知不工作
# 检查 TheHive webhook 是否正确配置
curl -X GET http://thehive:9000/api/webhook \
  -H "Authorization: Bearer $THEHIVE_API_KEY"

# 问题4: Worker 内存溢出
# 限制 Worker 资源
# 在 Shuffle Orborus 环境变量中：
SHUFFLE_WORKER_MEMORY=512m
SHUFFLE_WORKER_CPU=1.0
```

---

## ✅ 上线 Checklist

- [ ] Shuffle 集群部署（Backend + Frontend + Orborus）
- [ ] OpenSearch 存储后端配置
- [ ] TheHive 集成（API Key + Webhook）
- [ ] Wazuh API 集成
- [ ] 钓鱼邮件处置 Playbook 测试通过
- [ ] 暴力破解封禁 Playbook 测试通过
- [ ] EDR 告警取证 Playbook 开发完成
- [ ] 通知渠道（钉钉/飞书）配置
- [ ] 防火墙/邮件网关 API 权限开通
- [ ] 灰度运行 1 周（人工复核模式）
- [ ] 误操作统计（封禁错误IP / 撤回正常邮件）
- [ ] 全自动模式切换
- [ ] 监控告警：Playbook 失败率 > 5% 通知

> 📚 延伸阅读：SOC/001-SOC建设指南 | SOC/015-Top10 Playbook模板 | HW/007-蜜罐部署
