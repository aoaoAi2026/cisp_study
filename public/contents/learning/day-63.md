# Day 63：第九周总结与测验

> **所属周**：Week 9 — 物理安全 · **主题**：物理安全体系回顾

---

## 📑 目录

1. [知识地图](#一知识地图)
2. [每日精华回顾](#二每日精华回顾)
3. [核心数字速记](#三核心数字速记)
4. [模拟测验（10题）](#四模拟测验10题)
5. [进度与下周](#五进度与下周)

---

## 一、知识地图

```
物理安全 = 第一道防线

  Day 57 — 分层模型 (6层同心圆)
  Day 58 — 门禁控制 (卡片+生物识别+Mantrap)
  Day 59 — 环境安全 (消防+电力+TEMPEST)
  Day 60 — 数据中心 (Tier I-IV + GB 50174)
  Day 61 — 容灾备份 (3-2-1 + Cold/Warm/Hot)
  Day 62 — 监控系统 (CCTV + 入侵报警 + BMS)
```

---

## 二、每日精华回顾

**Day 57**：6层同心圆防护 + 4级安全区域  
**Day 58**：Wiegand→OSDP升级 + 防尾随Mantrap + 访客管理  
**Day 59**：Novec 1230灭火 + 双触发机制 + TEMPEST红黑分离  
**Day 60**：Tier I-IV + N+1/2N冗余 + 等保2.0物理10项  
**Day 61**：3-2-1备份 + Cold/Warm/Hot/Mirrored + RTO/RPO  
**Day 62**：CCTV参数 + 双鉴探测器 + PSIM融合平台  

---

## 三、核心数字速记

```
Tier I   99.671% → 年宕28.8h
Tier II  99.741% → 年宕22h
Tier III 99.982% → 年宕1.6h
Tier IV  99.995% → 年宕0.4h

备份：3份 + 2种介质 + 1份异地
UPS：在线式零切换，离线式有间隙
机房门禁：至少双重认证(卡+生物识别)
机房灭火：Novec 1230 / FM-200
气体灭火：双触发(两探测器+30秒倒计时)
```

---

## 四、模拟测验（10题）

**1. TIA-942中哪一级数据中心支持在线维护而不中断IT运行？**  
A. Tier I  B. Tier II  C. Tier III  D. Tier IV

<details><summary>答案</summary>**C** — Tier III支持并发维护(Concurrently Maintainable)。</details>

---

**2. 3-2-1备份原则中的"1"指什么？**  
A. 1个备份管理员  B. 1份异地备份  C. 每天1次备份  D. 1种备份类型

<details><summary>答案</summary>**B** — 至少1份备份存储在异地。</details>

---

**3. Mantrap的主要作用是？**  
A. 检测火灾  B. 防止尾随  C. 温度控制  D. 电磁屏蔽

<details><summary>答案</summary>**B** — Mantrap（互锁门）一次只允许一人通过，防止尾随进入。</details>

---

**4. 机房灭火最适合使用哪种灭火剂？**  
A. 水喷淋  B. 干粉  C. CO₂  D. Novec 1230

<details><summary>答案</summary>**D** — Novec 1230不导电、无残留、更环保。</details>

---

**5. RTO代表什么？**  
A. 恢复时间目标  B. 恢复点目标  C. 冗余测试周期  D. 远程终端操作

<details><summary>答案</summary>**A** — RTO = Recovery Time Objective，恢复业务所需的最大时间。</details>

---

**6. Hot Site和Cold Site的主要区别？**  
A. 颜色不同  B. Hot实时可用(分钟恢复)，Cold需要部署(天/周)  C. Cold比Hot贵  D. 没有区别

<details><summary>答案</summary>**B** — Hot Site有实时数据同步，故障后分钟级恢复。</details>

---

**7. TEMPEST主要防护什么风险？**  
A. 火灾  B. 电磁泄露导致信息泄露  C. 洪水  D. 电力中断

<details><summary>答案</summary>**B** — TEMPEST防止通过电磁辐射方式泄露敏感信息。</details>

---

**8-10. 判断题**

**8. 等保2.0第三级要求物理安全包含10项控制。** ✅  
**9. WORM备份介质可以被修改。** ❌ (Write Once Read Many = 不可修改)  
**10. 双鉴探测器降低误报率。** ✅

---

## 五、进度与下周

```
✅ Week 9：物理安全 (Day 57-63)  ████████ 完成
⬜ Week 10：安全工程 (Day 64-70)  ░░░░░░░░ 待学习

总进度：63/84 (75%)
```

> **下周**：安全工程——风险评估、威胁建模、安全架构设计、SDL、代码审计。

---

> **下一步**：Day 64 安全评估概述——风险评估方法论与工具。
