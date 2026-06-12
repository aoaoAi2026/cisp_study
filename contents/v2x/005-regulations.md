# UN R155 / R156 法规与 CSMS/SUMS 合规

---

## 一、UN R155 网络安全法规

### 1.1 法规范围

```
UN R155 (UN Regulation No.155):
  Cybersecurity and Cybersecurity Management System
  (网络安全与网络安全管理体系)

适用范围(UNECE成员国)：
  欧盟、日本、韩国、澳大利亚等 60+国家
  → 2022年7月: 新车型必须通过
  → 2024年7月: 所有新车必须通过

CSMS (Cybersecurity Management System) 证书：
  ✦ 厂商(OEM)必须建立符合R155要求的CSMS
  ✦ CSMS需要覆盖车辆全生命周期:
    设计 → 开发 → 生产 → 售后 → 报废
  ✦ 证书有效期: ≤3年(需续证)
```

### 1.2 CSMS 七项要求

```
R155 第7章规定CSMS必须满足：

1. 组织管理
   高管层负责网络安全
   独立的安全团队/角色
   供应商安全管理

2. 风险管理
   车辆类型全生命周期风险识别
   威胁分析与风险评估(TARA)

3. 安全设计与测试
   安全需求规格
   安全测试(渗透测试/模糊测试/源代码审计)
   安全验证与确认

4. 安全事件响应
   安全事件监测(车辆+云端)
   24/7事件响应能力
   漏洞披露与修复流程

5. 安全更新管理
   通过OTA修复安全漏洞
   软件更新安全(签名+加密)

6. 供应链安全
   供应商安全要求(合同约束)
   供应商安全能力评估
   开源组件管理

7. 持续监测
   车辆运行安全状态监测(VSOC)
   新威胁情报采集
   持续风险评估
```

---

## 二、TARA 威胁分析与风险评估

### 2.1 TARA 方法论 (ISO/SAE 21434)

```
ISO/SAE 21434 定义TARA流程：

Step 1: 资产识别 (Item Definition)
  定义分析的"Item"(如: ADAS功能)
  边界定义、功能描述、系统架构

Step 2: 威胁识别 (Threat Identification)
  使用STRIDE模型:
    Spoofing (欺骗)
    Tampering (篡改)
    Repudiation (否认)
    Information Disclosure (信息泄露)
    Denial of Service (拒绝服务)
    Elevation of Privilege (提权)

Step 3: 损害场景 (Damage Scenario)
  威胁→安全属性→损害场景
  例: CAN消息篡改→功能安全→车辆失控(人员伤亡)
  损害严重度：S0(无伤害) ~ S3(致命)

Step 4: 攻击路径 (Attack Path)
  攻击可行性(Ease of Attack):
    需要什么样的专业知识？(Expert/Layman)
    需要多长的攻击时间？(Days/Weeks/Months)
    需要什么设备？(标准/专业/定制)
    需要多少知识？(公开/受限/机密)

Step 5: 风险等级 (Risk Value)
  Risk = Impact × Feasibility
  High/Medium/Low/None
  → High: 必须采取措施
  → Low: 可接受

Step 6: 处置决策 (Risk Treatment)
  Eliminate: 消除风险(改变设计)
  Mitigate: 减轻风险(安全措施)
  Transfer: 转移风险(保险/供应商合同)
  Accept: 接受风险(评估+高层批准)
```

---

## 三、UN R156 软件更新法规

```
R156 (SUMS = Software Update Management System):

要求：
  1. 软件更新安全：校验签名+加密+防篡改
  2. 更新不影响安全功能(尤其是ASIL功能)
  3. 更新后系统完整性验证
  4. 用户被告知更新后安全变化
  5. OTA更新必须可靠(更新过程中不允许车辆不可控)
  6. 更新记录可审计(何时更新了什么)
  7. RXSWIN (Regulation X Software Identification Number)
     → 每辆车有可查询的软件版本号
```

---

## 四、中国道路车辆安全法规

```
GB/T 43258-2023 (对标R155国内版):
  《汽车整车信息安全技术要求》

关键要求：
  - 信息安全体系(类似CSMS)
  - 车辆网络安全设计
  - 密码技术应用(国密SM系列)
  - 数据安全(车内/车外数据)
  - 安全测试要求

实施时间表：
  2024: 标准发布
  2025-2026: 新车型逐步实施
  2027: 预计所有新车型强制执行

出口欧洲的中国车企：
  需要同时满足：
    - 国内：GB/T 43258 + 工信部入网
    - 欧洲：UN R155 CSMS + UN R156 SUMS
    - GDPR：车辆数据(德国VDA/法国CNIL指南)
```

---

## 五、合规方案路径

```
车企合规路径：

Phase 1: 差距分析
  ├── CSMS现状评估
  ├── TARA能力评估
  └── 供应商管理评估

Phase 2: 体系建设
  ├── CSMS组织架构+流程文件
  ├── TARA方法论导入
  ├── 安全开发流程(Secure SDL)
  └── VSOC建设(车辆安全运营中心)

Phase 3: 认证准备
  ├── 选择认证机构(UTAC/VCA/TÜV)
  ├── 提交CSMS申请材料
  ├── 认证审核(文件审核+现场审核)
  └── 整改+复评+取证

Phase 4: 持续合规
  ├── 新车开发 → 嵌入TARA
  ├── 已售车辆 → VSOC监测
  ├── 年度审计 → CSMS有效性
  └── 续证 → 每3年
```

---

## 六、Checklist

- [ ] CSMS体系建设(对标R155第7章)
- [ ] TARA方法论建立(ISO 21434)
- [ ] 车型TARA执行(每个新车型)
- [ ] 安全运维(VSOC)建设
- [ ] 漏洞披露与修复流程
- [ ] 供应商网络安全要求
- [ ] 认证机构选择与审核
- [ ] GB/T 43258国内合规对标
- [ ] SUMS软件更新管理体系(R156)
- [ ] 年度CSMS有效性审计
