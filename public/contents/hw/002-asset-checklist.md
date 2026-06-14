# 护网资产自查与攻击面收敛指南

> **📘 文档定位**：CISP 考试 护网行动 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：25 分钟
>
> 系统讲解护网行动前的资产自查与攻击面收敛方法论，覆盖资产发现/暴露面梳理/漏洞优先级/攻击面缩减策略。

---

## 导航目录

- [一、资产自查方法论](#一资产自查方法论)
- [二、攻击面发现与梳理](#二攻击面发现与梳理)
- [三、漏洞优先级评估](#三漏洞优先级评估)
- [四、攻击面收敛策略](#四攻击面收敛策略)
- [五、安全部署 Checklist](#五安全部署-checklist)
- [六、高分考点与知识巧记](#六高分考点与知识巧记)

---

> 📅 2026-06-12 | 🎯 进阶 | ⏱ 20 min | 分类：护网工程

## 📋 提纲

1. 资产自查方法论
2. 公网资产梳理
3. 内网资产盘点
4. 攻击面收敛策略
5. 高危资产识别
6. 自动化资产发现脚本
7. 护网前资产 Checklist

---

## 1. 资产自查方法论

护网第一课：**你知道自己有多少资产暴露在外面吗？**

```
经验法则：你"以为"的资产数 × 2 = 攻击者能发现的资产数 × 1.5 = 实际存在的资产数

常见盲区：
- 开发环境暴露在公网
- 测试服务器忘记关闭
- 离职员工留下的公网服务
- 第三方供应商的系统
- Docker容器映射的公网端口
- 内部DNS记录泄漏
- 子公司/收购公司的资产
```

### 1.1 资产四象限

```
高 ▍
    ▍  象限1：高价值+公网     象限2：高价值+内网
    ▍  最优先！立即收敛       需重点监控
    ▍  
资产  ▍  ──────────────────────
价值  ▍  象限3：低价值+公网     象限4：低价值+内网
    ▍  尽快收敛             按需处理
    ▍
低 ▍
    └─────────────────────────
     公网              内网
           暴露面
```

---

## 2. 公网资产梳理

### 2.1 被动信息收集

```python
#!/usr/bin/env python3
"""
资产发现工具集 - 被动收集
不需要主动扫描目标，利用公开数据源
"""

import requests
import json
import socket
import dns.resolver
import whois
from concurrent.futures import ThreadPoolExecutor

class PassiveAssetDiscovery:
    def __init__(self, domain):
        self.domain = domain
        self.assets = {
            "subdomains": set(),
            "ips": set(),
            "ip_ranges": set(),
            "emails": set(),
            "technologies": {},
            "certificates": [],
            "open_services": [],
        }

    def run_all(self):
        """执行所有被动收集"""
        discoveries = [
            self.find_subdomains_crtsh,
            self.find_subdomains_certspotter,
            self.find_subdomains_securitytrails,
            self.find_subdomains_alienvault,
            self.dns_resolution,
            self.whois_lookup,
            self.find_ip_ranges,
            self.shodan_lookup,
            self.find_technologies,
        ]

        with ThreadPoolExecutor(max_workers=5) as executor:
            list(executor.map(lambda f: f(), discoveries))

        return self.assets

    def find_subdomains_crtsh(self):
        """从 crt.sh 获取子域名（SSL证书透明度日志）"""
        print(f"🔍 crt.sh: 查询 {self.domain} 的证书...")
        try:
            resp = requests.get(
                f"https://crt.sh/?q=%.{self.domain}&output=json",
                timeout=30
            )
            for entry in resp.json():
                name = entry.get('name_value', '')
                for sub in name.split('\n'):
                    sub = sub.strip().lstrip('*.')
                    if self.domain in sub:
                        self.assets['subdomains'].add(sub)
            print(f"  crt.sh: 发现 {len([s for s in self.assets['subdomains'] if self.domain in s])} 个子域名")
        except Exception as e:
            print(f"  crt.sh: 错误 - {e}")

    def find_subdomains_certspotter(self):
        """CertSpotter API"""
        try:
            resp = requests.get(
                f"https://api.certspotter.com/v1/issuances",
                params={"domain": self.domain, "expand": "dns_names"},
                timeout=15
            )
            for entry in resp.json():
                for dns_name in entry.get('dns_names', []):
                    if self.domain in dns_name:
                        self.assets['subdomains'].add(dns_name)
        except:
            pass

    def find_subdomains_securitytrails(self):
        """SecurityTrails API"""
        try:
            resp = requests.get(
                f"https://api.securitytrails.com/v1/domain/{self.domain}/subdomains",
                headers={"APIKEY": self.config.get('securitytrails_key', '')},
                timeout=15
            )
            for sub in resp.json().get('subdomains', []):
                self.assets['subdomains'].add(f"{sub}.{self.domain}")
        except:
            pass

    def find_subdomains_alienvault(self):
        """AlienVault OTX"""
        try:
            resp = requests.get(
                f"https://otx.alienvault.com/api/v1/indicators/domain/{self.domain}/passive_dns",
                timeout=15
            )
            for entry in resp.json().get('passive_dns', []):
                hostname = entry.get('hostname', '')
                if self.domain in hostname:
                    self.assets['subdomains'].add(hostname)
        except:
            pass

    def dns_resolution(self):
        """对所有发现子域名做DNS解析"""
        print(f"🌐 DNS解析: {len(self.assets['subdomains'])} 个子域名...")
        for sub in list(self.assets['subdomains']):
            try:
                answers = dns.resolver.resolve(sub, 'A')
                for rdata in answers:
                    ip = str(rdata)
                    self.assets['ips'].add(ip)
            except:
                pass

    def whois_lookup(self):
        """Whois 查询"""
        try:
            w = whois.whois(self.domain)
            self.assets['whois'] = {
                "registrar": w.registrar,
                "creation_date": str(w.creation_date),
                "expiration_date": str(w.expiration_date),
                "name_servers": w.name_servers,
                "emails": w.emails if w.emails else []
            }
            if w.emails:
                self.assets['emails'].update(w.emails)
        except:
            pass

    def find_ip_ranges(self):
        """根据ASN查找IP段"""
        for ip in list(self.assets['ips']):
            try:
                resp = requests.get(f"https://api.bgpview.io/ip/{ip}", timeout=10)
                prefixes = resp.json().get('data', {}).get('prefixes', [])
                for p in prefixes:
                    self.assets['ip_ranges'].add(p.get('prefix', ''))
            except:
                pass

    def shodan_lookup(self):
        """Shodan查询"""
        for ip in list(self.assets['ips'])[:50]:  # 限制50个IP
            try:
                resp = requests.get(
                    f"https://api.shodan.io/shodan/host/{ip}",
                    params={"key": self.config.get('shodan_key', '')},
                    timeout=10
                )
                data = resp.json()
                for service in data.get('data', []):
                    self.assets['open_services'].append({
                        "ip": ip,
                        "port": service['port'],
                        "service": service.get('product', ''),
                        "version": service.get('version', ''),
                        "banner": service.get('data', '')[:100]
                    })
            except:
                pass

    def find_technologies(self):
        """检测Web技术栈"""
        for sub in list(self.assets['subdomains'])[:30]:
            try:
                url = f"https://{sub}"
                resp = requests.get(url, timeout=5, verify=False, allow_redirects=True)

                # 从响应头推断技术
                server = resp.headers.get('Server', '')
                x_powered = resp.headers.get('X-Powered-By', '')

                if server:
                    self.assets['technologies'][sub] = {"server": server}
                if x_powered:
                    self.assets['technologies'].setdefault(sub, {})['powered_by'] = x_powered
            except:
                pass

    def generate_report(self):
        """生成资产报告"""
        report = f"""
# 资产发现报告: {self.domain}

## 概要
- 发现子域名: {len(self.assets['subdomains'])}
- 解析IP: {len(self.assets['ips'])}
- IP段: {len(self.assets['ip_ranges'])}
- 开放服务: {len(self.assets['open_services'])}

## 子域名列表
{chr(10).join(f'- {s}' for s in sorted(self.assets['subdomains']))}

## IP地址列表
{chr(10).join(f'- {ip}' for ip in sorted(self.assets['ips']))}

## 开放服务
{chr(10).join(f'- {s[\"ip\"]}:{s[\"port\"]} ({s.get(\"service\",\"\")} {s.get(\"version\",\"\")})' for s in self.assets['open_services'])}

## 建议行动
1. 确认所有公网子域名是否必要
2. 关闭非必要的开放端口
3. 对必要的公网服务进行安全加固
4. 添加所有公网IP到漏洞扫描范围
        """.strip()
        return report


if __name__ == "__main__":
    import urllib3
    urllib3.disable_warnings()

    discovery = PassiveAssetDiscovery("company.com")
    discovery.config = {}  # 填入API keys
    assets = discovery.run_all()
    print(discovery.generate_report())
```

---

## 3. 攻击面收敛

### 3.1 收敛优先级矩阵

| 优先级 | 资产类型 | 行动 |
|--------|---------|------|
| P0 | 已EOL的对外系统（如旧版Exchange/WebLogic） | 立即下线或隔离 |
| P0 | 开发/测试环境暴露公网 | 立即移除公网访问 |
| P1 | 管理后台暴露公网 | 加IP白名单或VPN访问 |
| P1 | 数据库端口暴露公网（3306/5432/1433/6379） | 立即关闭 |
| P1 | RDP/SSH暴露公网 | 改端口+仅密钥+IP白名单 |
| P2 | 不必要的HTTP方法 | 禁用 TRACE/OPTIONS/PUT/DELETE |
| P2 | 版本信息泄露 | 隐藏Server头/X-Powered-By |
| P3 | 冗余的子域名 | DNS清理 |

### 3.2 端口收敛

```bash
#!/bin/bash
# port_audit.sh - 检查对外暴露的端口

echo "=== 对外暴露端口审计 ==="

# 1. 从防火墙获取NAT/端口映射规则
# (示例: 华为USG防火墙)
echo "防火墙NAT规则:"
display nat server

# 2. 从云平台获取安全组规则
# (示例: 阿里云)
echo "阿里云安全组:"
aliyun ecs DescribeSecurityGroupAttribute --SecurityGroupId sg-xxx

# 3. 逐端口风险评估
declare -A PORT_RISK=(
    ["22"]="SSH - 确保仅密钥认证+非默认端口"
    ["3389"]="RDP - 确定必须公网吗？建议VPN"
    ["3306"]="MySQL - 极其危险！应立即关闭"
    ["5432"]="PostgreSQL - 极其危险！应立即关闭"
    ["1433"]="MSSQL - 极其危险！应立即关闭"
    ["6379"]="Redis - 极其危险！应立即关闭"
    ["27017"]="MongoDB - 极其危险！应立即关闭"
    ["9200"]="Elasticsearch - 极其危险！应立即关闭"
    ["5601"]="Kibana - 加认证或关闭"
    ["8080"]="Web应用 - 确认认证+WAF"
    ["8443"]="Web应用HTTPS - 确认认证+WAF"
    ["9090"]="Prometheus - 加认证"
    ["3000"]="Grafana - 加认证"
)

echo "端口风险评估:"
# 实际应读取防火墙/安全组配置
for port in "${!PORT_RISK[@]}"; do
    echo "  $port: ${PORT_RISK[$port]}"
done
```

### 3.3 信息泄露收敛

```bash
#!/bin/bash
# info_leak_check.sh - 信息泄露检查

DOMAIN="$1"

echo "=== 信息泄露检查 ==="

# 1. 检查 Server 头
echo "1. HTTP响应头检查"
for sub in www api mail oa; do
    url="https://$sub.$DOMAIN"
    server=$(curl -sI "$url" 2>/dev/null | grep -i "server:" | head -1)
    powered=$(curl -sI "$url" 2>/dev/null | grep -i "x-powered-by:" | head -1)
    if [ -n "$server" ]; then
        echo "  ⚠️ $sub: $server"
    fi
    if [ -n "$powered" ]; then
        echo "  ⚠️ $sub: $powered"
    fi
done

# 2. 检查 robots.txt 泄漏
echo "2. Robots.txt 检查"
for sub in www api; do
    robots=$(curl -sk "https://$sub.$DOMAIN/robots.txt" 2>/dev/null)
    if echo "$robots" | grep -qi "disallow"; then
        echo "  ⚠️ $sub: robots.txt包含敏感路径"
        echo "$robots" | grep -i "disallow" | head -10
    fi
done

# 3. 检查 .git 泄漏
echo "3. .git 泄漏检查"
for sub in www admin; do
    status=$(curl -sk -o /dev/null -w "%{http_code}" "https://$sub.$DOMAIN/.git/HEAD" 2>/dev/null)
    if [ "$status" = "200" ]; then
        echo "  🔴 $sub: .git目录可访问！源码可能泄漏！"
    fi
done

# 4. 检查错误页面信息泄漏
echo "4. 错误页面检查"
for sub in www api; do
    # 发送一个明显错误的请求
    error_page=$(curl -sk "https://$sub.$DOMAIN/../../etc/passwd" 2>/dev/null)
    if echo "$error_page" | grep -qi "exception\|stack trace\|at com\.\|at org\."; then
        echo "  🔴 $sub: 错误页面包含异常堆栈信息！"
    fi
done

echo "✅ 信息泄露检查完成"
```

---

## 4. 高危资产识别

```python
#!/usr/bin/env python3
"""高危资产自动识别"""

HIGH_RISK_SERVICES = {
    # (端口, 服务) → 风险等级
    (22, 'SSH'): ('CRITICAL', '确保仅密钥认证+非默认端口+IP白名单'),
    (3389, 'RDP'): ('CRITICAL', '禁用公网RDP，使用VPN'),
    (3306, 'MySQL'): ('CRITICAL', '立即关闭公网访问'),
    (6379, 'Redis'): ('CRITICAL', '立即关闭+设置密码'),
    (27017, 'MongoDB'): ('CRITICAL', '立即关闭+认证'),
    (9200, 'Elasticsearch'): ('CRITICAL', '立即关闭+认证'),
    (5601, 'Kibana'): ('HIGH', '加认证或VPN访问'),
    (8080, 'Jenkins'): ('HIGH', '确保认证+最新版本'),
    (9090, 'Prometheus'): ('MEDIUM', '加认证'),
}

HIGH_RISK_TECHNOLOGIES = {
    'WebLogic': ('CRITICAL', '高价值漏洞目标'),
    'JBoss': ('CRITICAL', '高价值漏洞目标'),
    'Struts2': ('CRITICAL', '历史高危漏洞频发'),
    'Shiro': ('HIGH', '反序列化漏洞'),
    'Fastjson': ('HIGH', '反序列化漏洞'),
    'Tomcat': ('MEDIUM', '确保最新版本'),
    'Nginx': ('LOW', '保持更新'),
}

def identify_high_risk_assets(assets):
    """识别高危资产"""
    risks = []

    for service in assets.get('open_services', []):
        port = service['port']
        svc = service.get('service', '')
        risk = HIGH_RISK_SERVICES.get((port, svc))
        if risk:
            risks.append({
                "ip": service['ip'],
                "port": port,
                "service": svc,
                "risk_level": risk[0],
                "recommendation": risk[1]
            })

    for sub, tech in assets.get('technologies', {}).items():
        for tech_name, risk in HIGH_RISK_TECHNOLOGIES.items():
            if tech_name.lower() in str(tech).lower():
                risks.append({
                    "asset": sub,
                    "technology": tech_name,
                    "risk_level": risk[0],
                    "recommendation": risk[1]
                })

    return sorted(risks, key=lambda x: {'CRITICAL':0,'HIGH':1,'MEDIUM':2,'LOW':3}[x['risk_level']])
```

---

## 5. 护网前资产 Checklist

### 公网资产
- [ ] 全网域名枚举（子域名+API域名+测试域名）
- [ ] 所有公网IP清单
- [ ] 所有公网端口/服务清单
- [ ] 关闭非必要公网服务
- [ ] 数据库端口确认无公网暴露
- [ ] 管理后台加认证+IP白名单
- [ ] 开发/测试环境移除公网访问

### 信息泄露
- [ ] Server/X-Powered-By 头隐藏
- [ ] 错误页面无堆栈信息
- [ ] .git/.svn/.DS_Store 不可访问
- [ ] 备份文件（.bak/.old/.zip/.tar.gz）不可访问
- [ ] 管理界面路径非默认

### 云资产
- [ ] 云控制台 MFA 强制启用
- [ ] IAM 权限最小化（删掉 *:* 权限）
- [ ] AK/SK 未硬编码在前端代码
- [ ] S3/OSS Bucket 非公开
- [ ] 安全组规则审计（0.0.0.0/0 最小化）

### 第三方/供应链
- [ ] 第三方接口/API 清单
- [ ] 供应商VPN/远程通道审计
- [ ] CDN节点/WAF配置确认
- [ ] DNS服务商安全

> 📚 延伸阅读：HW/001-蓝队防护方案 | HW/013-安全基线 | Cloud/001-云安全架构
