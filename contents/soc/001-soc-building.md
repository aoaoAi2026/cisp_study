# SOC 安全运营中心建设指南

---

## 一、SOC 是什么

```
SOC (Security Operations Center) 核心定位：
  安全运营中心 = 人员 + 流程 + 技术平台的有机整合
  目标：持续监控、检测、响应安全威胁

NIST CSF 视角：
  SOC = 实施 Identify/Protect/Detect/Respond/Recover 的运营中心

现代 SOC 演进：
  传统 SOC (2010s) → SIEM告警 → 人工分析 → 手动响应
  现代 SOC (2020s) → 大数据分析 → SOAR自动化 → 威胁狩猎
  SOC 3.0 (2025+) → AI驱动 → XDR融合 → ASM(攻击面管理)
```

---

## 二、SOC 建设五阶段

### Phase 1: 规划与设计 (1-2个月)

```
关键决策：
  1. 自建 vs 托管(MSSP)
     自建SOC: 数据敏感度高，定制化需求强 → 成本高
     MSSP: 快速上线，共享SOC → 成本低
     混合: 核心自建 + 7x24外包 → 主流选择

  2. SOC 规模估算
     EPS(EPS=Events Per Second) → 分析人员和平台
     小型: <1,000 EPS → 2-5人
     中型: 1,000-10,000 EPS → 10-20人
     大型: >10,000 EPS → 30+人

  3. SOC 成熟度目标
     L1 初始: 被动响应告警
     L2 主动: 威胁检测+流程化响应
     L3 优化: SOAR自动化+威胁狩猎
```

### Phase 2: 平台选型 (1-2个月)

| 维度 | Splunk ES | Elastic Security | Wazuh | Microsoft Sentinel | QRadar |
|------|-----------|-----------------|-------|-------------------|--------|
| 部署 | 自建/云 | 自建/云 | 自建 | 云原生 | 自建/云 |
| 数据量 | 按量付费 | 免费+订阅 | 开源 | 按量付费 | 按量付费 |
| 关联分析 | SPL语言 | ES|QL+Sigma | 规则 | KQL | Ariel |
| SOAR | Splunk SOAR | 集成 | TheHive | Logic Apps | Resilient |
| 学习曲线 | 高 | 中 | 低 | 中 | 高 |
| 适合规模 | 中大型 | 中小大型 | 小型 | Azure生态 | 中大型 |

```
选择建议：
  - 预算有限 → ELK + Wazuh (开源)
  - 中型+云 → Elastic Cloud / Splunk
  - Azure全家桶 → Sentinel
  - 国产化 → 奇安信天眼/深信服SIP/安恒AiLPHA
```

### Phase 3: 流程设计 (1个月)

```
SOC核心流程：

1. 告警分级与处理
   P1 (严重): 正在发生的攻击/数据泄露 → 15分钟内响应
   P2 (高): 确认的攻击指标/恶意软件 → 1小时内
   P3 (中): 可疑行为/策略违规 → 4小时内
   P4 (低): 信息性告警 → 24小时内

2. 事件响应流程 (IR Playbook)
   告警触发 → 分类分级 → 
   初步分析(谁/什么/何时/何地/如何) → 告警升级标准 →
   遏制(断网/隔离主机/禁用账户) → 根除(清除/加固) →
   恢复(验证/回滚/补丁) → 复盘(Lessons Learned)

3. 告警调度(Escalation)
   L1(Tier 1): 告警筛选+初步确认 → 
   L2(Tier 2): 深度分析+事件响应 →
   L3(Tier 3): 威胁狩猎+高级取证+规则优化

4. 工单管理
   告警→创建工单(Ticket)→指派→处理→关闭→分析复盘
```

### Phase 4: 人员组织 (持续)

```
SOC 分析师梯队：

Tier 1 (初级分析师, 60%):
  - 监控仪表盘
  - 告警分流/筛选
  - 执行标准化Playbook
  - 技能：网络基础+SIEM操作+安全常识

Tier 2 (高级分析师, 25%):
  - 深度事件分析
  - 威胁研判与取证
  - 编写SIEM规则
  - 技能：日志分析+网络取证+恶意代码分析

Tier 3 (专家/威胁猎人, 10%):
  - 威胁狩猎(Hunting)
  - 攻击链推演
  - 高级取证
  - 技能：逆向工程+APT分析+自定义检测工具

SOC Manager (5%):
  - 指标监管+流程优化+培训规划+对外报告
```

### Phase 5: 持续优化 (持续)

```
持续优化循环 (PDCA):
  Plan: 检测规则审核 → 新威胁情报导入 → 场景扩展
  Do: 新规则上线 → 新数据源接入 → 新自动化Playbook
  Check: 告警质量(KPI) → 漏报分析 → PIR复盘
  Act: 规则调整 → 流程优化 → 工具升级

关键优化方法：
  - 告警降噪: 每天10000+告警 → 目标是100-200可处理告警
  - 告警合并: 同一主机/用户/攻击源 → 聚合成一个事件
  - 规则优化: 基于实际效果删除低质量规则
```

---

## 三、开源 SOC 搭建示例

### 3.1 ELK + Wazuh + TheHive

```yaml
# docker-compose.yml 示例
version: '3'
services:
  # Elasticsearch
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"

  # Kibana
  kibana:
    image: docker.elastic.co/kibana/kibana:8.12.0
    ports:
      - "5601:5601"

  # Wazuh Manager
  wazuh-manager:
    image: wazuh/wazuh-manager:4.7.0
    ports:
      - "1514:1514/udp"   # Agent通信
      - "1515:1515"        # Agent注册
      - "55000:55000"      # API
  
  # Wazuh Agent (部署在所有终端/服务器)
  # curl -s https://packages.wazuh.com/4.x/wazuh-install.sh | bash
  # 配置 ossec.conf → manager_ip = wazuh-manager 地址

  # TheHive (事件响应平台)
  thehive:
    image: strangebee/thehive:5.2
    ports:
      - "9000:9000"
    environment:
      - THP_SECRET=mysecretkey1234567890123456

  # Cortex (分析引擎)
  cortex:
    image: thehiveproject/cortex:3.1
    ports:
      - "9001:9001"
```

### 3.2 Wazuh 检测规则

```xml
<!-- 自定义Wazuh规则示例 -->
<!-- /var/ossec/etc/rules/local_rules.xml -->

<group name="custom_attacks,">
  <!-- 检测SQL注入尝试 -->
  <rule id="100001" level="10">
    <decoded_as>json</decoded_as>
    <field name="url">\.\./\.\./</field>
    <description>Directory Traversal detected</description>
  </rule>
  
  <!-- 检测暴力破解 -->
  <rule id="100002" level="10" frequency="5" timeframe="120">
    <if_matched_sid>5710</if_matched_sid>
    <same_source_ip />
    <description>SSH Bruteforce: 5 failed logins in 120s</description>
  </rule>
  
  <!-- 检测可疑PowerShell -->
  <rule id="100003" level="8">
    <field name="win.eventdata.commandLine">\.DownloadString|\.DownloadFile|IEX|Invoke-Expression</field>
    <description>Suspicious PowerShell download cradle</description>
  </rule>
</group>
```

---

## 四、Checklist

- [ ] SOC定位确认(自建/托管/混合)
- [ ] SIEM平台选型
- [ ] 数据源接入(防火墙/EDR/AD/云/应用/DNS/DHCP)
- [ ] 初始检测规则部署
- [ ] 告警分级处理流程
- [ ] 分析师排班表(7x24)
- [ ] 事件响应Playbooks
- [ ] SOAR场景自动化
- [ ] 工单系统集成
- [ ] 安全大屏/日报/周报
- [ ] 定期优化(告警降噪+规则调优)
- [ ] 红蓝对抗验证(检测有效性)
