# Day 70：第十周总结与测验

> **所属周**：Week 10 — 安全工程 · **主题**：安全工程体系回顾与测验

---

## 一、知识地图

```
安全工程知识体系：

  Day 64 — 风险评估 (SLE/ALE/NIST SP 800-30)
  Day 65 — 威胁建模 (STRIDE/攻击树/DFD)
  Day 66 — 安全架构 (纵深防御/零信任/八原则)
  Day 67 — 安全SDLC (SDL/SAMM/SAST/DAST)
  Day 68 — 代码审计 (Source→Sink追踪)
```

---

## 二、核心公式与数字

```
SLE = AV × EF (单一损失期望 = 资产价值 × 暴露因子)
ALE = SLE × ARO (年度损失期望 = SLE × 年度发生率)
Risk = Threat × Vulnerability × Asset

STRIDE = 6类威胁 (Spoofing/Tampering/Repudiation/Info/DoS/Elevation)

八原则：最小权限、默认拒绝、纵深防御、安全默认值、
         失败安全、经济性机制、最小公共化、开放设计
```

---

## 三、模拟测验（10题）

**1. 单一损失期望(SLE)的计算公式是？**
A. AV + EF  B. AV × EF  C. AV − EF  D. SLE不涉及AV

<details><summary>答案</summary>**B** — SLE = 资产价值(AV) × 暴露因子(EF)。</details>

---

**2. STRIDE中的"E"代表什么？**
A. Encryption  B. Elevation of Privilege  C. Error  D. External

<details><summary>答案</summary>**B** — Elevation of Privilege(权限提升)。</details>

---

**3. 安全设计八原则中，"失败安全"的含义是？**
A. 系统永不失败  B. 出错时倾向于拒绝而非放行  C. 不做错误处理  D. 记录错误日志

<details><summary>答案</summary>**B** — 失败安全原则要求在出错时倾向于安全状态（拒绝访问）。</details>

---

**4. SAST属于什么类型的测试？**
A. 黑盒动态测试  B. 白盒静态分析  C. 渗透测试  D. 模糊测试

<details><summary>答案</summary>**B** — SAST是静态分析，不运行代码。</details>

---

**5. 攻击树中AND节点表示什么？**
A. 任一子目标即可  B. 所有子目标都必须完成  C. 不是攻击路径  D. 最优路径

<details><summary>答案</summary>**B** — AND节点要求所有子目标都完成才能达到父目标。</details>

---

**6-10. 判断题**

**6. Kerckhoffs原理主张安全应依赖算法保密性。** ❌ （依赖密钥保密，不依赖算法保密）

**7. 纵深防御是最好的安全架构策略。** ✅

**8. 滥用案例是从攻击者视角描述系统可能被如何攻击。** ✅

**9. IAST需要运行应用进行测试。** ✅

**10. 代码审计中Source是漏洞被触发的位置。** ❌ （Source是不受信任的输入源，Sink才是危险操作位置）

---

## 四、学习进度

```
✅ Week 1-10 完成  ████████████████ 70/84 (83%)
⬜ Week 11-12  待  ░░ 14/84 剩余
```

---

> **下一步**：Day 71 隐私保护——数据隐私法规与保护技术。
