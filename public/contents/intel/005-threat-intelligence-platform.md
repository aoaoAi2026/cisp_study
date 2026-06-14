# 威胁情报平台 (TIP) 部署与使用实战

> **📘 文档定位**：CISP 考试安全运营技术内容 | 难度：⭐⭐⭐ | 预计阅读：18 分钟
> TIP 是威胁情报的中央管理枢纽。本文从平台架构、情报聚合到自动化响应，系统梳理 TIP 的部署与运营实践。

---

## 导航目录
- [一、威胁情报平台 (TIP) 的角色](#一威胁情报平台-tip-的角色)

```
  传统问题:
    - 多个情报源 (VT / OTX / AbuseIPDB / 360 / ThreatBook ...), 每个格式不一
    - 缺乏统一管理: 同一条 IOC 在多个源重复出现, 无法去重 / 合并 / 评级
    - 缺乏上下文: 只知道 IP 是恶意, 不知道属于哪个家族 / 何时首次出现 / 关联攻击
    - 缺乏自动化: 无法自动推送到 WAF / 防火墙 / EDR / SIEM

  TIP 解决的问题:
    1. 汇聚 (Aggregation): 从多个 Feed 拉取情报
    2. 清洗 (Normalization): 统一格式 (STIX 2.x / JSON) + 去重 + 合并
    3. 富集 (Enrichment): 补充 IP WHOIS / DNS / ASN / 地理位置 / 样本信息
    4. 分级 (Scoring): 计算 Severity / Confidence / TLP 颜色标签
    5. 管理 (Management): 工作流 / TTL / 白名单 / 分析师协作
    6. 分发 (Distribution): API / STIX/TAXII / Kafka / 文件导出
    7. 可视化 (Visualization): 仪表盘 / 地图 / 拓扑
    8. 与防护设备联动: WAF / Firewall / EDR / SIEM / SOAR / DNS
```

## 二、主流 TIP 产品对比

### 2.1 开源 TIP

| 项目 | 语言 | 特点 | 适用场景 |
|------|------|------|---------|
| **MISP (Malware Information Sharing Platform)** | PHP | 社区最大、事件驱动、支持 IOC 图像化关联 | 企业 / 行业 ISAC 情报共享 |
| **OpenCTI** | Node.js + GraphQL | 现代 UI、STIX 2.x 原生、强大可视化与数据模型 | 企业内部威胁情报中心 |
| **TheHive + Cortex** | Scala / React | 安全事件响应平台, 搭配 Cortex 做自动化分析 | 安全运营中心 (SOC) |
| **Yeti** | Python | 简洁, 适合中小团队 | 中型企业 |
| **IntelMQ** | Python | 面向 ISP / CERT, 大规模 IOC 管道处理 | 运营商 / CERT |

### 2.2 商业 TIP

| 厂商 | 产品 | 特点 |
|------|------|------|
| **Recorded Future** | Intelligence Cloud | 大规模 OSINT + 暗网 + 技术情报, AI 驱动评分 |
| **Anomali** | Anomali Match / Lens | STIX/TAXII 原生, 与 SIEM 集成好 |
| **ThreatQuotient** | ThreatQ | 灵活数据模型, 支持自定义对象 |
| **TruSTAR** | (now part of Splunk) | 情报门户 + 案例管理 |
| **Micro Focus** | ArcSight Intelligence | 与 ESM / Fortify 生态结合 |
| **Splunk** | Enterprise Security (ES) + Intelligence Management | SIEM 内置情报模块 |
| **微步在线** | OneDNS / Threat Intelligence | 国内领先, 适合国内客户 |
| **360** | 威胁情报中心 | 国内 APT 研究 + 商业化情报 |
| **奇安信** | 威胁情报平台 | 国内政企客户广泛使用 |

## 三、MISP 快速部署与使用

```bash
# 1. 使用 Docker 快速部署 (推荐)
git clone https://github.com/MISP/MISP.git
cd MISP
docker-compose up -d
# 默认: http://localhost:8080  账号: admin@admin.test / admin

# 2. 或使用官方 VM Image (OVA)
#    https://www.misp-project.org/download/

# 3. 添加 Feeds (情报源)
#    MISP UI → Sync Actions → List Feeds → Add Feed
#    推荐免费 Feed:
#      • abuse.ch Feeds (URLhaus / MalwareBazaar / ThreatFox)
#      • CIRCL OSINT Feed
#      • OTX AlienVault (需 API Key)
#      • Cybercrime Tracker
#      • 360 Netlab / ThreatBook (国内厂商, API)
```

### MISP 数据模型

```
  Event (事件)
    ├─ Attribute (属性, 即 IOC)
    │    ├─ IP / Domain / URL / Hash / yara / sigma / filename
    │    ├─ to_ids (是否推送到 IDS)
    │    ├─ Category (Payload delivery / Artifact dropped / ...)
    │    └─ Tag (tlp:white/green/amber/red) / 攻击家族 / APT 代号
    ├─ Object (对象, 组合多个属性, 如 file, network-connection)
    ├─ Galaxy (星系, 结构化知识库, 如 mitre-attack / ransomware / threat-actor)
    └─ Tag / Taxonomy (MITRE ATT&CK / Kill Chain / CIRCL)
```

### MISP 实战：创建一个事件

```bash
# 1. 登录 MISP UI → Event Actions → Add Event
# 2. 填写: Date / Org / Distribution / Threat Level / Analysis Status
# 3. 添加 Attribute (IOC):
#    - Type: ip-dst / domain / md5 / sha256 / url / yara
#    - Category: Network activity / Artifact dropped / Payload delivery ...
#    - to_ids: Yes (希望推送到防护设备)
#    - Comment: C2 for LockBit 3.0

# 4. 关联 Galaxy: MITRE ATT&CK → T1071 Application Layer Protocol

# 5. 添加 Tag: tlp:amber / kill-chain:c2 / ransomware:lockbit

# 6. 发布事件 (Publish Event)
#    → 事件变为所有同步组织可见
```

## 四、OpenCTI 快速部署

```bash
# 基于 Docker 的 OpenCTI 部署
git clone https://github.com/OpenCTI-Platform/opencti.git
cd opencti/docker
cp .env.sample .env
# 修改 .env 中密码 / 密钥
docker-compose up -d

# 默认: http://localhost:4000  账号: admin@opencti.io / admin

# 添加 Connector (连接器, 负责拉取外部情报)
# OpenCTI 已内置 100+ 连接器:
#   • AlienVault OTX
#   • VirusTotal Livehunt
#   • MITRE ATT&CK (自动导入矩阵)
#   • AbuseIPDB
#   • MISP (MISP → OpenCTI 双向同步)
#   • URLhaus / MalwareBazaar
#   • Tanium / Splunk / Elastic
```

## 五、情报清洗与评分 (Enrichment + Scoring)

### 5.1 典型清洗流程

```
  Step 1. 标准化:
    - 所有 IP 标准化 (去掉端口 / 去除空格)
    - 所有域名小写 + 去除协议头
    - 所有 URL 规范化 (小写 / 去 session 参数)
    - 所有 Hash 转小写, 按类型分 sha256/sha1/md5

  Step 2. 去重:
    - 同 indicator 合并, 保留最早出现日期 / 最高严重度
    - 合并来源 (source1, source2 ...)

  Step 3. 白名单过滤 (Whitelist / False Positive Filter):
    - 内部 IP 段 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
    - 公司自有域名 / 常用 CDN
    - 已知合法软件签名 (Microsoft / Google / Apple)
    - 高信誉 Alexa Top 1M
    - 误报历史库 (False Positive DB)

  Step 4. 富集 (Enrichment):
    - IP → GeoIP / ASN / ISP / Reverse DNS / WHOIS
    - Domain → DNS A/AAAA/MX/NS / WHOIS / 注册商 / 历史
    - URL → 最终 URL (追踪跳转) / 页面截图 / 页面内容
    - Hash → VT 多引擎扫描结果 / 文件名 / 首次出现日期
    - File → 文件类型 / 数字签名 / PE 元数据

  Step 5. 评分 (Scoring):
    - Severity (严重度): Critical / High / Medium / Low
    - Confidence (置信度): High / Medium / Low (来自 source 评分 + 历史命中率)
    - TLP 颜色: RED / AMBER / GREEN / WHITE
    - 计算方式示例:
        score = base_score(source_reliability) * attack_type_weight * age_factor
        - 越新 → 分数越高 (衰减因子)
        - 来源越多 → 分数越高
        - 攻击者越知名 (APT / 勒索软件活跃 C2) → 分数越高
```

## 六、情报分发：推送到防护设备

### 6.1 架构模式

```
  ┌──────────┐   Pull/API   ┌──────────┐   Push/API   ┌─────────────┐
  │ 情报源     │◀─────────────│  TIP 平台  │────────────▶│ WAF / FW / EDR │
  │ (Feeds)   │              │ (MISP/OpenCTI)│            │ / SIEM / DNS  │
  └──────────┘               └──────────┘              └─────────────┘
                                   │
                                   ▼  (STIX/TAXII / Kafka / Redis / File)
                          ┌─────────────────────┐
                          │  ETL 管道 (Python/Go) │
                          └─────────────────────┘
```

### 6.2 具体推送实现示例

```bash
# 1. MISP → 导出 CSV (每日自动)
curl -H "Authorization: <API_KEY>" \
  "https://misp.example.com/events/csv/download/1/false/false/ip-dst/" \
  -o malicious_ips.csv

# 2. MISP → STIX/TAXII (给其他 TIP 平台消费)
#    MISP 内置 taxii-server

# 3. MISP → WAF (如 Cloudflare / ModSecurity)
#    Python 脚本: 拉取 MISP events → 生成 IP Set / Rule Set → POST 到 WAF API

# 4. MISP → SIEM (Splunk/Elastic)
#    Splunk: TA-misp (MISP Add-on for Splunk)
#    Elastic: Filebeat + MISP module / Elastic Security Intelligence

# 5. MISP → DNS (Pi-hole / Blocky / Bind RPZ)
#    脚本将域名黑名单转化为 RPZ 区域文件 / hosts 格式

# 6. MISP → EDR
#    调用 EDR API (CrowdStrike / SentinelOne / 火绒 / 360) 上传 Hash 黑名单
```

## 七、威胁情报运营 (Threat Intelligence Operations)

```
  角色分工:
    • 情报分析师 (TI Analyst): 处理原始情报 / 写报告 / 验证 IOC / TTP 分析
    • SOC 分析师 (L1/L2/L3): 消费情报 (查 IOC / 看报告)
    • 红队 / 渗透测试: 消费情报 (模拟 APT TTP)
    • 管理层: 看 KPI / 威胁态势报告

  日常工作流 (典型):
    Step 1. 早晨 30 分钟: 审阅当日新事件 (MISP / VT / 厂商邮件)
    Step 2. 验证可疑 IOC: 在沙箱 / 隔离机验证样本真实性
    Step 3. 评分 / 打标签 / 发布
    Step 4. 将高置信度 IOC 推送到生产环境阻断
    Step 5. 定期 (每周): 汇总 APT 报告简报发送业务线
    Step 6. 每月: 威胁评估报告 + 防御建议
    Step 7. 季度: 红蓝对抗 (模拟 APT TTP)

  KPI (关键指标):
    • 每日新增 IOC 数量
    • IOC 命中率 (SIEM / EDR 触发次数)
    • 误报率 (False Positive Rate)
    • 响应时间 (IOC 发现 → 推送阻断)
    • 报告产量 (每周 / 每月威胁简报)
    • 威胁覆盖度 (ATT&CK 矩阵覆盖百分比)
```

## 八、情报质量评估与维护

```
  问题: 情报源质量差异大, 需持续评估与淘汰

  评估维度:
    1. 准确度 (Precision): 提交的 IOC 真正恶意的比例
    2. 召回率 (Recall): 已知威胁中被该源覆盖的比例
    3. 新鲜度 (Freshness): 新 IOC 更新频率与延迟
    4. 独特性 (Uniqueness): 该源独有的情报价值
    5. 信噪比 (SNR): 真实情报 vs 噪声比例

  运营策略:
    • 定期 review 每个 feed 的命中率 / 误报率
    • 停用连续 3 个月质量不佳的 feed
    • 逐步引入高质量商业源 (替代低质量免费源)
    • 建立内部白名单, 自动排除常见误报
```

## 九、CheckList

- [ ] 企业已部署至少一套 TIP (MISP 或 OpenCTI 或商业产品)
- [ ] 已接入 3+ 情报源 (1 国内 + 1 海外 + 1 社区)
- [ ] 已建立情报清洗 / 去重 / 白名单 / 评分管道
- [ ] 已推送到 3+ 防护设备 (WAF / FW / EDR / SIEM / DNS)
- [ ] 有专人 (至少 1 名) 负责情报运营与质量评估
- [ ] 每周输出威胁简报, 每月输出月度威胁评估
- [ ] 威胁情报已被整合进 SOC 流程 (告警关联 / 自动响应)
- [ ] 定期评估情报源质量, 淘汰低质量源, 引入新源
- [ ] 参与行业 ISAC / CERT, 与同行共享高质量情报
- [ ] 建立与红队 / 蓝队的反馈闭环 (实战检验情报有效性)

---

## 高分考点与知识巧记

> 🔑 **高分考点**：TIP 考点集中在平台功能、MISP 开源平台、情报生命周期。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| TIP 六步流程 | ⭐⭐⭐⭐ | 聚合→去重→富化→分析→分发→响应 |
| MISP | ⭐⭐⭐⭐ | 最流行的开源威胁情报平台 |
| 情报生命周期 | ⭐⭐⭐ | 规划→收集→处理→分析→分发→反馈 |

> 💡 **知识巧记**：TIP 六步记"聚去富分分发响"。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| MISP vs 商业 TIP | MISP 开源免费，商业 TIP 附带情报源 | "MISP 自带威胁情报" ❌ |
| 情报消费 | TIP→SIEM/SOAR/EDR 自动化联动 | "收集了就完事" ❌ |

### 知识巧记口诀

> **TIP 口诀**：
> 六步聚去富分分发响，MISP 开源最流行。
> 情报生命周期规划收处析分反，自动化消费联动强。
