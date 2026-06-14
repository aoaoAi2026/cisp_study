# IOC (Indicators of Compromise) 与情报来源实战

> **📘 文档定位**：CISP 考试威胁情报技术内容 | 难度：⭐⭐⭐ | 预计阅读：18 分钟
> IOC 是威胁检测与响应的基础。本文从 IOC 类型、情报来源到 MISP/OpenCTI 平台，系统梳理威胁情报的采集与利用。

---

## 导航目录
- [一、IOC 是什么?](#一ioc-是什么)

```
IOC = Indicators of Compromise (妥协指示器)
  - 描述 "攻击者在目标系统中留下的数字痕迹"
  - 类型: IP / Domain / URL / Hash / YARA / JA3 / 路径 / 注册表键 ...

TTP = Tactics, Techniques, and Procedures (战术/技术/流程)
  - 描述 "攻击者如何组织一次完整的攻击" (比 IOC 更持久, 更难规避)

IOC 适合快速阻断已知威胁
TTP 适合防御新型 / 变种攻击 (结合行为分析)
```

## 二、IOC 类型速查

| 类型 | 示例 | 使用方法 |
|------|------|---------|
| **IP 地址** | `185.220.101.34` | 防火墙 / WAF / DNS 黑名单 |
| **域名** | `evil-update[.]com` | DNS Sinkhole / 邮件网关 / Hosts |
| **URL** | `hxxps://evil.com/malware.exe` | 代理 / 网关 / EDR |
| **Hash (MD5/SHA-1/SHA-256)** | `f1c8d3a3...` | EDR / 沙箱 / 文件完整性监控 |
| **文件名 / 路径** | `C:\Windows\System32\evil.dll` | HIPS / 文件监控 |
| **注册表键** | `HKCU\Software\Microsoft\Windows\CurrentVersion\Run\Evil` | HIPS / 基线扫描 |
| **YARA 规则** | 恶意代码字节模式 / 字符串特征 | EDR / 内存扫描 / 文件扫描 |
| **JA3/JA3S 指纹** | TLS Client Hello 摘要 | 识别 C2 通信家族 |
| **CVE 编号** | `CVE-2024-xxxx` | 补丁管理 / 漏洞扫描 |
| **ASN / 自治系统号** | `AS4134` (中国电信骨干) | 阻断已知恶意 ASN |
| **JA3/JA3S** | TLS 客户端指纹 | 识别恶意软件家族 |
| **Email 地址 / 发件人** | `phish@evil.com` | 邮件网关黑白名单 |
| **Mutex / 命名管道** | `\BaseNamedObjects\{GUID}` | 行为检测 |

## 三、开源 / 社区情报来源

### 3.1 经典来源 (免费)

```
  1. VirusTotal                    https://www.virustotal.com
     - 文件 / URL / IP 多引擎扫描 + 社区评论
     - API Key 可用于自动化

  2. AbuseIPDB                     https://www.abuseipdb.com
     - 社区提交的恶意 IP (僵尸网络 / 暴力破解 / 垃圾邮件)

  3. OTX (Open Threat Exchange)   https://otx.alienvault.com
     - AlienVault 社区, 可订阅 Pulse (特定攻击事件 IOC 集合)
     - API 可拉取

  4. MISP (Malware Information Sharing Platform)
     - https://www.misp-project.org
     - 开源威胁情报共享平台
     - 支持事件 / 关联 / 可视化, 企业内部威胁情报中心

  5. MITRE ATT&CK                 https://attack.mitre.org
     - 全球通用的攻击技术/战术知识库
     - 映射到组织检测能力

  6. Emerging Threats / Proofpoint ET Open Rules
     - https://rules.emergingthreats.net
     - Snort / Suricata 开源 IDS 规则

  7. URLhaus / MalwareBazaar       https://urlhaus.abuse.ch
                                    https://bazaar.abuse.ch
     - Abuse.ch 项目, 恶意 URL / 样本共享

  8. ThreatFox                     https://threatfox.abuse.ch
     - IOC 共享平台 (IP/Domain/URL/Hash)
     - API 可拉取

  9. Binary Defense / banlist      https://www.binarydefense.com
     - IP 黑名单 (自动更新 + 免费)

 10. PhishReport                   https://phish.report
     - 钓鱼网站提交与共享
```

### 3.2 国内厂商 (部分免费)

```
  1. 微步在线 (ThreatBook)        https://x.threatbook.cn
     - 威胁情报社区, 提供查询与 API

  2. 360 Netlab                    https://netlab.360.com
     - 公开研究与 IOC 下载

  3. 奇安信威胁情报中心            https://ti.qianxin.com
     - 威胁情报报告与 IOC 订阅

  4. 天际友盟 (MercuryU)           https://www.mercurymedia.com
     - 商业威胁情报平台

  5. 安全客 (AnQuanKe)             https://www.anquanke.com
     - 安全资讯聚合 + 研究报告

  6. CNCERT / 国家信息安全漏洞共享平台 (CNVD)
     - 国家级漏洞与威胁预警
```

### 3.3 海外厂商 (商业 / 部分免费)

```
  FireEye / Mandiant (Now Trellix)  → APT 报告 + IOC
  CrowdStrike                        → Falcon Intelligence
  Recorded Future                    → 情报即服务
  Flashpoint                         → 暗网情报
  Sixgill / IntSights / KELA        → 暗网/威胁情报
  SentinelLabs (SentinelOne)        → 研究报告
  Kaspersky / ESET / Trend Micro    → 威胁报告
```

## 四、IOC 格式与标准

### 4.1 STIX / TAXII

```
  STIX = Structured Threat Information Expression (结构化威胁情报表达)
  TAXII = Trusted Automated Exchange of Intelligence Information (可信自动化情报交换)
  - 目前主流版本 STIX 2.x (JSON)
  - 常用工具: stix2 (Python) / OpenCTI

  示例 (STIX 2.x):
    {
      "type": "indicator",
      "id": "indicator--a740531e-63e5-4be5-8c65-1a8f2f3a5c9d",
      "pattern": "[ipv4-addr:value = '185.220.101.34']",
      "valid_from": "2025-01-01T00:00:00Z",
      "labels": ["malicious-activity"]
    }
```

### 4.2 CSV / JSON 文本格式 (最常用)

```
  常见 CSV 字段:
    indicator,type,source,reported_date,ttl_days,confidence,description, tags
    185.220.101.34,ipv4,abuseipdb,2025-09-01,30,high,"Mirai C2",botnet
    evil.com,domain,threatbook,2025-09-01,60,high,"Phishing",phishing

  常见 JSON 格式 (CrowdStrike / Mandiant):
    {
      "type": "indicator",
      "value": "f1c8d3a3...",
      "malware_family": "TrickBot",
      "confidence": 90,
      "ttl": "2025-12-31"
    }
```

## 五、IOC 自动化管道实战

### 5.1 经典架构

```
  ┌────────────────────┐     ┌─────────────────────┐     ┌────────────────────┐
  │ IOC 来源 (Feed)    │────▶│ 清洗 / 去重 / 合并   │────▶│ 推送到防护设备    │
  │ VirusTotal / OTX   │     │ (ETL Pipeline)       │     │ WAF / Firewall    │
  │ AbuseIPDB          │     │                       │     │ EDR / XDR         │
  │ ThreatFox          │     │ • 去重 (Dedupe)        │     │ SIEM / SOAR       │
  │ 自定义情报          │     │ • 格式统一 (STIX/CSV)  │     │ DNS Sinkhole      │
  └────────────────────┘     │ • TTL 过期管理         │     │ 邮件网关          │
                              │ • 误报过滤 (Whitelist)  │     └────────────────────┘
                              └───────────────────────┘
                                        │
                                        ▼
                              存储到威胁情报平台 (TIP)
                              OpenCTI / MISP / 商业 TIP
```

### 5.2 示例脚本 (拉取 + 推送到 SIEM)

```bash
# 拉取 AbuseIPDB 最近 30 天报告次数 ≥ 10 的 IP
curl -s -G "https://api.abuseipdb.com/api/v2/blacklist" \
  -H "Key: YOUR_API_KEY" \
  -H "Accept: application/json" \
  -d "confidenceMinimum=90&limit=10000" \
  | jq -r '.data[].ipAddress' > abuseipdb_blacklist.txt

# 推送到 Suricata / snort / WAF
# 导入到 SIEM (Splunk / Elastic) via API
```

## 六、情报分级与应用策略

```
  Confidence (置信度):
    High (80-100)  → 直接阻断 (C2 IP / 已知恶意域名)
    Medium (40-80) → 告警 + 人工分析 (可疑 IP / 可疑域名)
    Low (0-40)     → 仅记录 / 辅助分析 (灰产 / 历史黑名单)

  Severity (严重度):
    Critical → 已知 APT C2 / 正在使用的 0day
    High     → 勒索 C2 / 银行木马 C2
    Medium   → 广告软件 / 低危 C2
    Low      → 扫描器 / 僵尸网络节点

  策略建议:
    - High + High → 立即阻断
    - High + Low → 监控 + 人工
    - Low + High → 延迟阻断
    - Low + Low → 仅记录, 不阻断
```

## 七、IOC 生命周期管理 (TTL)

```
  问题: 很多 IOC 有效期很短 (C2 域名 / IP 几小时后可能已更换)
  解决:
    - IP / Domain: 默认 30-90 天 TTL
    - URL: 默认 7-30 天
    - Hash: 永久 (除非误报)
    - YARA: 长期, 随样本更新

  自动化:
    - 每日拉取新 IOC, 补充进黑名单
    - 定期清理过期 IOC, 减少误报
    - 误报管理: 维护白名单 (Whitelist), 自动排除内部 IP、常用域名
```

## 八、实战：在组织内部落地

```
  Step 1. 订阅威胁情报源 (至少 3 家: 1 家国内 + 1 家海外 + 1 家社区)
  Step 2. 部署 TIP (威胁情报平台): MISP / OpenCTI / 商业 TIP
  Step 3. 建立 IOC 清洗 / 去重 / TTL 管理管道 (Python / Logstash)
  Step 4. 推送到安全设备:
    - WAF / Firewall (动态黑名单)
    - EDR / XDR (Hash 黑名单)
    - SIEM (告警关联)
    - DNS (Sinkhole)
    - SOAR (自动化响应: 阻断 IP → 通知管理员)
  Step 5. 建立威胁情报分析团队 (TIA):
    - 每日 APT / 勒索报告摘要
    - 每周 IOC 质量评估
    - 针对本行业的 TTP 规则
  Step 6. 红蓝对抗:
    - 用已知 APT 的 IOC / TTP 模拟攻击, 检验是否能被检测
```

## 九、CheckList

- [ ] 订阅 ≥ 3 家高质量威胁情报源 (国内 + 海外 + 社区)
- [ ] 部署 TIP (MISP / OpenCTI / 商业 TIP), 自动入库
- [ ] 建立 IOC ETL 管道: 清洗 / 去重 / 白名单过滤 / TTL 管理
- [ ] 推送到所有关键防护设备: WAF / FW / EDR / SIEM / DNS
- [ ] 建立情报分析团队 (或外包 MDR), 做 IOC → TTP 分析
- [ ] 定期订阅 APT / 勒索研究报告, 映射到 ATT&CK
- [ ] 定期清洗过期 IOC, 减少误报
- [ ] 建立情报反馈闭环: 内部发现的 IOC 也回馈给情报社区
- [ ] 红蓝对抗中使用最新公开 APT TTP, 验证防御有效性
- [ ] 与 CERT / 行业 ISAC 保持信息共享

---

## 高分考点与知识巧记

> 🔑 **高分考点**：IOC 考点集中在 IOC 类型分类、情报来源、STIX/TAXII 标准。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| IOC 类型 | ⭐⭐⭐⭐⭐ | IP/域名/URL/文件Hash/邮箱/注册表 |
| 情报金字塔 | ⭐⭐⭐⭐ | Hash→IP→域名→工具→TTPs，越往上价值越高 |
| STIX/TAXII | ⭐⭐⭐⭐ | STIX 情报描述标准(JSON)，TAXII 传输协议 |

> 💡 **知识巧记**：IOC 五类记"网域件箱表"，情报金字塔记"哈 I 域工 T"。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| IOC 有效期 | IP/域名短，TTPs 长 | "所有 IOC 永久有效" ❌ |
| STIX 2.x | 基于 JSON，替代 XML 旧版 | "STIX 只能用 XML" ❌ |

### 知识巧记口诀

> **IOC 情报口诀**：
> 网域件箱表五类 IOC，金字塔哈 I 域工 T。
> STIX 描述 TAXII 传输，TTPs 持久价值高。
