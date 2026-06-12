# 自动驾驶安全：功能安全与预期功能安全

---

## 一、功能安全 (ISO 26262)

### 1.1 ASIL 等级

```
ISO 26262 道路车辆功能安全

ASIL (Automotive Safety Integrity Level) 四级：

ASIL A (最低):
  故障可能导致轻微伤害
  例：仪表盘显示错误

ASIL B:
  故障可能导致中度伤害(通常不需要医疗)
  例：导航系统错误

ASIL C:
  故障可能导致严重伤害(需要医疗)
  例：自适应巡航控制

ASIL D (最高):
  故障可能导致致命伤害(Life-threatening)
  例：刹车系统/转向系统/电池管理系统

ASIL 判定矩阵：
         Controllability (可控性)
          C1(好)  C2(一般)  C3(差)
Severity ┌──────┬──────┬──────┐
S1(轻)    │ QM   │ A    │ B    │
S2(中)    │ A    │ B    │ C    │
S3(重/致命)│ B    │ C    │ D    │
         └──────┴──────┴──────┘

QM (Quality Management): 不需要功能安全
```

### 1.2 功能安全开发流程

```
ISO 26262 V模型：

概念阶段：
  相关项定义 → HARA(危害分析与风险评估) → 安全目标 + ASIL等级

系统级：
  技术安全需求(TSR) → 系统架构设计 → 安全分析(FTA/FMEA)

硬件级：
  硬件安全需求 → 硬件设计 → 硬件安全分析(FMEDA)
  安全指标：
    - SPFM (Single Point Fault Metric ≈单点故障覆盖率)
      ASIL B: ≥90%, ASIL C: ≥97%, ASIL D: ≥99%
    - LFM (Latent Fault Metric ≈潜在故障覆盖率)
      ASIL B: ≥60%, ASIL C: ≥80%, ASIL D: ≥90%

软件级：
  软件安全需求 → 软件架构 → 单元设计 → 编码 → 测试
  关键机制：
    - ECC/EDC内存保护
    - 软件冗余(锁步/双核校验)
    - 故障反应(安全状态：Safe State)
```

---

## 二、预期功能安全 (SOTIF)

### 2.1 ISO 21448 核心概念

```
ISO 21448 (2022):
  Safety Of The Intended Functionality (SOTIF)

功能安全 vs 预期功能安全：

  功能安全(ISO 26262)：系统故障导致的风险
    "系统坏了，怎么办？" → 硬件故障/软件Bug
    例：刹车ECU死机

  预期功能安全(ISO 21448) ★：系统正常但功能不足导致的风险
    "系统没坏，但能力不够，怎么办？" → 传感器局限/AI误判
    例：摄像头在逆光下"看不见"行人 → 不是故障，是能力不足

SOTIF 四个区域：
  Zone 1: 已知安全(Known Safe)
  Zone 2: 已知不安全(Known Unsafe) → ★必须消除/缓解
  Zone 3: 未知不安全(Unknown Unsafe) → ★最大风险！探索→转为Zone 2
  Zone 4: 未知安全(Unknown Safe)

SOTIF 目标：
  缩小Zone 2和Zone 3 → 扩大Zone 1
```

### 2.2 感知系统安全

```
自动驾驶感知传感器安全风险：

摄像头 (Camera):
  ├── 强光致盲(逆光/大灯直射 → 全白/全黑 → 检测失败)
  ├── 对抗样本(物理世界)→ 路牌贴纸 → 误识别
  ├── 恶劣天气(雨/雪/雾/沙尘 → 可见度骤降)
  └── 投影攻击(激光投影虚假行人/车辆？潜在威胁)

激光雷达 (LiDAR):
  ├── 传感器欺骗: 向LiDAR发射虚假激光脉冲 → 制造"幽灵障碍物"
  ├── 致盲攻击: 强激光照射 → 传感器过载 → 暂时失效
  └── 反射欺骗: 高反光物体 → 误判距离

毫米波雷达 (Radar):
  ├── 干扰攻击: 发射同频段信号 → 噪声淹没真实回波
  ├── 欺骗攻击: 延迟/放大回波 → 伪造目标距离/速度
  └── 雨/雾衰减: 毫米波在恶劣天气中衰减

多传感器融合：
  优点：单一传感器被攻击 ≠ 整体失效(如果融合逻辑健壮)
  风险：如果攻击方式同时对多个传感器有效(跨传感器攻击)
```

### 2.3 GPS/定位攻击

```
GPS欺骗与防御：

GPS欺骗 (Spoofing)：
  攻击者发射比真实GPS信号更强的虚假信号
  → 受害者接收器"锁定"虚假信号
  → 位置被任意控制

简易GPS欺骗器(SDR实现)：
  HackRF One + GPS-SDR-SIM
  → 成本<500美元

防御：
  - 多星座融合(GPS+BDS+GLONASS+Galileo → 4个系统同时被欺骗难)
  - IMU惯性导航(短期定位不依赖GPS)
  - 信号认证(新GPS L1C民用信号含Chimera认证)
  - 相对定位(V2X+环境特征匹配)
  - 地图匹配(车辆不可能在河/建筑物中)
```

---

## 三、Fail-Operational 设计

```
L3+自动驾驶需要 Fail-Operational：

L2(ADAS): Fail-Safe → 故障 → 驾驶员接管(驾驶员在环)
L3: Fault-Tolerant → 故障 → 系统保持功能一段时间 → 驾驶员接管
L4/L5: Fail-Operational → 故障 → 系统继续安全运行至Minimal Risk Condition

Fail-Operational实现方式：

1. 硬件冗余
   - 双份主控芯片(锁步/主备)
   - 双份供电系统
   - 双份通信总线

2. 功能降级
   - 感知失效 → 降速(≤60km/h) → 靠边停车
   - 定位失效 → 切换到IMU+轮速计+地图

3. 安全状态
   Minimal Risk Condition (MRC):
   识别故障 → 执行MRC策略 → 
   打双闪灯 → 减速/变道 → 安全停靠 → 报警/AI客服
```

---

## 四、Checklist

- [ ] ASIL等级分配(HARA分析)
- [ ] 安全架构设计(冗余+容错+降级)
- [ ] SOTIF风险分析(传感器局限场景)
- [ ] 感知安全(防欺骗/对抗/干扰)
- [ ] GPS定位安全(多星座+IMU+地图)
- [ ] Fail-Operational设计
- [ ] 安全验证(仿真测试/封闭场地/公开道路)
- [ ] 安全案例(Safety Case)编制
