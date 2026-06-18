# Nessus 企业级漏洞扫描器完全指南

> 分类：工具指南 | 难度：进阶 | 阅读时间：约45分钟

## 概述

Nessus 是 Tenable 公司开发的企业级漏洞评估工具，也是全球部署最广泛的漏洞扫描器之一。它内置超过 180,000 个漏洞检测插件，覆盖操作系统、网络设备、Web 应用、数据库、云基础设施、容器等各个领域。Nessus 能够自动化发现安全漏洞、配置错误、合规偏差和恶意软件感染，是漏洞管理计划（Vulnerability Management Program）的核心引擎。

**版本说明**：
- **Nessus Essentials**（免费）：16个IP限制，基础功能
- **Nessus Professional**（$3,990+/年）：无IP限制，所有功能
- **Tenable.sc**（企业版）：多扫描器管理、持续监控
- **Tenable.io**（云端）：SaaS 漏洞管理平台

## 核心知识点

- Nessus 的安装、激活与基础配置
- 扫描策略（Policy）的创建与定制
- 扫描模板选择：基础网络扫描、Web 应用扫描、合规审计等
- 扫描结果解读：CVSS 评分、修复建议、证据详情
- 合规审计：CIS Benchmark、PCI DSS、HIPAA 等
- 报告生成：自定义报告模板
- Nessus REST API 自动化
- 与 Nmap、Metasploit 的联动

---

## 一、安装

### 1.1 Linux 安装

```bash
# Debian/Ubuntu/Kali
wget https://www.tenable.com/downloads/api/v1/public/pages/nessus/downloads/.../download?i_agree_to_tenable_license_agreement=true
# 或从官网下载 .deb 包
sudo dpkg -i Nessus-10.x.x-ubuntu_amd64.deb

# 启动服务
sudo systemctl start nessusd
sudo systemctl enable nessusd

# 检查状态
sudo systemctl status nessusd
```

### 1.2 激活

```bash
# 访问 Web 界面
# https://localhost:8834

# 注册获取激活码
# https://www.tenable.com/products/nessus/activation-code

# 或命令行激活
sudo /opt/nessus/sbin/nessuscli fetch --register YOUR_CODE

# 等待插件下载完成（首次需30分钟+）
sudo /opt/nessus/sbin/nessuscli update --all
```

### 1.3 验证

```bash
# 检查版本和插件数
sudo /opt/nessus/sbin/nessuscli fix --list

# 查看服务端口
sudo netstat -tlnp | grep 8834
```

---

## 二、Web 界面操作

### 2.1 扫描模板选择

| 模板类型 | 适用场景 | 说明 |
|:---|:---|:---|
| **Basic Network Scan** | 通用网络扫描 | 最常用，覆盖主机/端口/服务/漏洞 |
| **Advanced Scan** | 自定义扫描 | 完全自定义参数 |
| **Advanced Dynamic Scan** | Web 应用动态扫描 | DAST 扫描 |
| **Web Application Tests** | Web 应用专项 | 含 SQLi、XSS 等 |
| **Malware Scan** | 恶意软件扫描 | 检测恶意软件和僵尸网络 |
| **Mobile Device Scan** | 移动设备扫描 | MDM 集成 |
| **PCI DSS Audit** | PCI DSS 合规审计 | PCI 合规要求 |
| **CIS Benchmark Audit** | CIS 基准审计 | 操作系统/服务安全基线 |
| **Credentialed Patch Audit** | 补丁审计 | 含认证的细粒度补丁检测 |

### 2.2 创建基础扫描

```
My Scans → New Scan → Basic Network Scan

Settings 基础配置：
  Name：自定义扫描名称
  Targets：IP/域名/范围（如 192.168.1.0/24, server1.example.com）
  
Discovery（发现）：
  Host Discovery：开启
  Port Scanning：Common ports 或 All ports
  Service Discovery：探测所有端口上的服务

Assessment（评估）：
  Scan Type：Default（或 Custom）
  Web Applications：是否需要 Web 扫描
  
Report（报告）：
  选择报告详细程度

Advanced（高级）：
  Max concurrent checks：扫描并发数
  Stop scanning hosts that become unresponsive
```

### 2.3 认证扫描（Credentialed Scan）

认证扫描能登录到目标系统内部，进行更深度的检测（如已安装补丁、注册表配置、本地文件权限等）。

```
Credentials 配置：
  Windows：
    Authentication method: Password
    Username: Administrator
    Password: xxxx
    Domain: CORP

  Linux：
    Authentication method: Password
    Username: root
    Password: xxxx
    Elevate privileges with: sudo/su

  SSH Private Key：
    Upload SSH private key + passphrase

  Database：
    Oracle / MySQL / MSSQL / PostgreSQL 认证
```

---

## 三、扫描结果分析

### 3.1 漏洞严重等级

| 等级 | CVSS 评分 | 颜色 | 含义 | 处理建议 |
|:---|:---|:---|:---|:---|
| **Critical** | 9.0-10.0 | 深红 | 严重漏洞，可远程利用 | 立即修复（24小时内）|
| **High** | 7.0-8.9 | 红色 | 高危漏洞 | 尽快修复（1周内）|
| **Medium** | 4.0-6.9 | 橙色 | 中危漏洞 | 按计划修复 |
| **Low** | 0.1-3.9 | 绿色 | 低危漏洞 | 可延后修复 |
| **Info** | N/A | 蓝色 | 信息发现 | 辅助分析 |

### 3.2 漏洞详情页

每个漏洞报告包含：
- **Description**：漏洞描述和背景
- **Solution**：修复方案
- **See Also**：参考链接（CVE、MSKB、Vendor Advisory）
- **Output**：插件输出的实际证据
- **Plugin Details**：插件 ID、发布日期、修改日期、CVSS 向量
- **Risk Information**：CVSS v3 评分、风险因素
- **Vulnerability Information**：CVE/CVSS/CPE/Exploit Available/BIA

### 3.3 结果过滤与分析

```
按主机过滤：选择特定 IP
按漏洞过滤：仅看 Critical/High
按插件过滤：输入 Plugin ID（如 51192 - MS17-010）
按端口过滤：仅 445 端口的漏洞
利用可用性：仅显示有公开 Exploit 的漏洞（Exploit Available = Yes）
```

---

## 四、合规审计

### 4.1 CIS Benchmark 审计

```
Policies → New Policy → Advanced Scan

Compliance 部分：
  选择 "CIS Benchmark" → 选择对应操作系统版本
  - CIS Microsoft Windows Server 2019 v2.0.0
  - CIS Red Hat Enterprise Linux 8 v2.0.0
  - CIS Ubuntu Linux 20.04 LTS v2.0.0
  - CIS Kubernetes Benchmark v1.6.1

  扫描结果标记：
  - PASSED / FAILED / WARNING / MANUAL
  
  生成合规报告：
  Report → Compliance Report → 选择模板
```

### 4.2 其他合规标准

```
PCI DSS：      PCI DSS v3.2.1 / v4.0
HIPAA：        HIPAA/HITECH Compliance
NIST：         NIST SP 800-53 / CSF
ISO：          ISO 27001
SOC 2：        SOC 2 Type II Audit
```

---

## 五、报告生成

### 5.1 报告类型

| 报告类型 | 格式 | 用途 |
|:---|:---|:---|
| Executive Summary | PDF/HTML | 管理层汇报（概览+趋势）|
| Custom Report | PDF/HTML/CSV | 自定义内容 |
| Nessus 格式 | .nessus | 导入其他 Nessus 实例/MSF |
| HTML Report | HTML | Web 方式分享 |
| CSV Export | CSV | Excel 二次分析 |
| Compliance Report | PDF | 合规审计专用 |

### 5.2 报告定制

```
Reports → Custom → Customize：
  选择包含的章节：
  - Host Summary
  - Vulnerability Summary  
  - Detailed Results (with evidence)
  - Remediation Plan
  - Compliance Summary
  添加企业 Logo 和 Header
```

---

## 六、Nessus API 自动化

```bash
# 获取 API Token
# Settings → API Keys → Generate

# 使用 API 创建扫描
curl -X POST https://localhost:8834/scans \
  -H "X-ApiKeys: accessKey=xxx;secretKey=yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "uuid": "template-uuid-for-basic-network-scan",
    "settings": {
      "name": "API_Test_Scan",
      "text_targets": "192.168.1.0/24"
    }
  }'

# 获取扫描状态
curl -X GET https://localhost:8834/scans \
  -H "X-ApiKeys: accessKey=xxx;secretKey=yyy"

# 导出报告
curl -X POST https://localhost:8834/scans/{scan_id}/export \
  -H "X-ApiKeys: accessKey=xxx;secretKey=yyy" \
  -H "Content-Type: application/json" \
  -d '{"format": "nessus"}'
```

---

## 七、与外部工具联动

### 7.1 Nmap → Nessus

```bash
# Nmap 先检活和端口发现
nmap -sS -sV -oX nmap_scan.xml 192.168.1.0/24

# Nessus 导入 Nmap 结果
# Scans → New Scan → Advanced Scan
# Settings → 导入 Nmap XML → 仅扫描 Nmap 发现的主机
```

### 7.2 Nessus → Metasploit

```bash
# Nessus 导出 .nessus 文件
# Metasploit 导入
msf6 > db_import scan.nessus
msf6 > vulns
msf6 > services

# 根据 Nessus 发现的漏洞搜索 Exploit
msf6 > search cve:2017-0144   # MS17-010
```

---

## 八、扫描策略最佳实践

```
1. 非业务时段扫描（午夜/周末）
2. 先轻量后深度：Host Discovery → Port Scan → Full Assessment
3. 生产环境：仅 passive + safe checks
4. 测试环境：可以开启 DoS/exploit 验证
5. 扫描前确认授权范围
6. 首次扫描后分析结果，调整下次扫描策略
7. 保持插件库更新（每日自动更新）
```

---

## 九、速查卡

```
默认端口:        https://localhost:8834
激活:           sudo nessuscli fetch --register CODE
更新插件:       sudo nessuscli update --all
查看状态:       sudo systemctl status nessusd
API Token:      Settings → API Keys → Generate
报告导出:       Scans → Report → 选择格式

常见模板:
  Basic Network Scan    → 通用扫描
  Advanced Scan         → 自定义
  Web Application Tests → Web专项
  Credentialed Patch Audit → 补丁审计
  PCI DSS Audit         → PCI合规
```

---

## 实战场景扩展

### 场景六：PCI DSS 合规扫描

```
1. 创建扫描策略：
   Policies → New Policy → PCI DSS Template
2. 配置合规检查项：
   - SSL/TLS 配置
   - 默认凭据
   - 已知漏洞
   - 配置错误
3. 运行扫描
4. 导出 PCI DSS 报告：
   Scans → 选择扫描 → Report → PCI DSS
```

### 场景七：Web 应用专项扫描

```
1. 策略：Web Application Tests
2. 扫描设置：
   - Scan web applications: Yes
   - Crawl depth: 5
   - Max pages: 1000
3. 认证配置：
   - 添加 HTTP Basic/Form/NTLM 认证
   - 配置 session tracking
4. 运行后优先处理 OWASP Top 10 相关漏洞
```

### 场景八：凭证扫描（Credentialed Scan）

```
1. 添加凭据：
   Scan → Credentials → Add
   - Windows: Administrator 账号密码
   - Linux: root 或 sudo SSH 密钥
2. 启用插件：
   - Patch audit
   - Compliance checks (CIS Benchmark)
   - Local security checks
3. 优势：
   - 更准确的版本检测（访问已安装软件列表）
   - 发现本地提权路径
   - 补丁缺失检测
```

### 场景九：API 自动化扫描

```python
# Python 调用 Nessus API
import requests
import json
import time

NESSUS_URL = "https://nessus.local:8834"
ACCESS_KEY = "YOUR_KEY"
SECRET_KEY = "YOUR_SECRET"

session = requests.Session()
session.verify = False

# 启动扫描
def launch_scan(target, policy_id):
    resp = session.post(f"{NESSUS_URL}/scans", json={
        "uuid": policy_id,
        "settings": {
            "name": f"Scan_{target}",
            "text_targets": target
        }
    })
    return resp.json()['scan']['id']

# 等待扫描完成
def wait_for_scan(scan_id):
    while True:
        resp = session.get(f"{NESSUS_URL}/scans/{scan_id}")
        status = resp.json()['info']['status']
        if status == 'completed':
            return True
        time.sleep(30)

# 导出报告
def export_report(scan_id, format='html'):
    resp = session.post(f"{NESSUS_URL}/scans/{scan_id}/export", json={
        "format": format
    })
    file_id = resp.json()['file']
    # ... download file
```

### 场景十：定时漏洞管理流程

```
1. 月度扫描计划：
   - 外网资产：每月1次（来自外部视角）
   - 内网资产：每季度1次（含凭证扫描）
   - 新上线系统：部署前强制扫描

2. 结果处理：
   - Critical/High: 14天内修复
   - Medium: 30天内修复
   - Low: 纳入下周期规划

3. 趋势分析：
   - 对比本月vs上月漏洞数量
   - 统计漏洞平均修复时间（MTTR）
```

---

## 常见问题排查

| 问题 | 原因 | 解决方案 |
|:---|:---|:---|
| 扫描极慢 | 网络延迟/目标无响应 | 调整 max_checks 和 max_hosts |
| 大量误报 | 签名过于激进 | 使用凭证扫描减少误报 |
| 目标离线 | 防火墙/网络策略 | 验证可达性，配置防火墙白名单 |
| 插件过期 | 未更新 | `nessuscli update` 或 Web UI |
| Web 端口 8834 无法访问 | 服务未启动 | `systemctl start nessusd` |
| 内存不足 | 扫描目标过多 | 分批扫描，降低并发 |
| 许可证过期 | Professional 收费 | 续期或转用免费版（16 IP）|

---

## Nessus vs OpenVAS vs Qualys 对比

| 特性 | Nessus Professional | OpenVAS | Qualys |
|:---|:---|:---|:---|
| 价格 | $3,390+/年 | 免费 | $2,995+/年 |
| 扫描 IP 限制 | 无限制 | 无限制 | 按资产计 |
| 漏洞签名 | 180,000+ | 50,000+ | 200,000+ |
| 合规扫描 | 强大 | 基础 | 极强 |
| 云部署 | 仅自建 | 仅自建 | SaaS |
| 学习曲线 | 低 | 中 | 中 |
| 适合场景 | 中小企业/顾问 | 预算有限/教育 | 大型企业 |

---

> 📖 本文为"网安百宝箱"课程配套读物。更新于 2026-06-18
