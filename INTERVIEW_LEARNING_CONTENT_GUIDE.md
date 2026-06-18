# 面试突击学习 — 内容添加指导

## 一、总览

面试突击学习 (`/interview-learning`) 含 **5 个子模块**，按照「前段速览复习 + 后端实战冲刺」模式：

| 阶段 | 天数 | 定位 |
|------|------|------|
| **复习速览** | 30 天 | 把 cyber-learning 对应模块全量压缩重学一遍 |
| **实战冲刺** | 15 天 | 纯刷题 + 攻防实验 + 面试模拟，不停歇 |
| **合计** | 45 天/模块 | 5 模块共 225 天 |

> 当前代码实现为 26+14=40 天，建议按本指南调整为 30+15=45 天以获得更充分的面试准备。

---

## 二、5 个子模块一览

| planId | 名称 | 难度 | 数据文件 | 补充源（复习天素材） |
|--------|------|------|----------|---------------------|
| `basic` | 网络安全基础·面试突击 | 入门 | `src/data/interviewBasic.ts` | cyber-learning/basic |
| `penetration` | 渗透测试·面试突击 | 进阶 | `src/data/interviewPenetration.ts` | cyber-learning/penetration |
| `defense` | 安全防御·面试突击 | 高级 | `src/data/interviewDefense.ts` | cyber-learning/defense |
| `ai` | AI安全·面试突击 | 高级 | `src/data/interviewAi.ts` | cyber-learning/ai |
| `hw` | 护网工程·面试突击 | 进阶 | `src/data/interviewHw.ts` | cyber-learning/hw |

每个模块对应岗位方向：
- **basic** → 安全运营、安全分析、安全合规
- **penetration** → 渗透测试、红队、漏洞挖掘
- **defense** → 安全防御、SOC分析、应急响应
- **ai** → AI安全、模型安全、对抗攻击
- **hw** → 护网蓝队、溯源反制、安全加固

---

## 三、需要创建的目录结构

在 `public/contents/` 下创建 `interview-learning/`，内建 5 个子目录：

```
public/contents/interview-learning/
├── basic/
│   ├── day-1.md
│   ├── day-2.md
│   ├── ...
│   ├── day-30.md       ← 复习速览结束
│   ├── day-31.md       ← 实战冲刺开始
│   ├── ...
│   └── day-45.md
├── penetration/
│   ├── day-1.md
│   ├── ...
│   └── day-45.md
├── defense/
│   ├── day-1.md
│   ├── ...
│   └── day-45.md
├── ai/
│   ├── day-1.md
│   ├── ...
│   └── day-45.md
└── hw/
    ├── day-1.md
    ├── ...
    └── day-45.md
```

代码中加载路径为：`/contents/interview-learning/${planId}/day-${currentDay}.md`
若 404，自动 fallback 到 `day.content`（TS 数据中内嵌内容）。

---

## 四、日内容模板

### 4.1 复习速览天（Day 1–30）

每天复习 cyber-learning 对应模块的原始内容，压缩提炼为「面试能用上的核心知识点」。

```markdown
# Day {N}：{标题}

> 🎯 面试目标：{这一天的核心面试考察点，用一句话说清楚}

## 知识速览

### 核心概念
- **{概念1}**：{一句话解释，能直接说给面试官听}
- **{概念2}**：{一句话解释}
- **{概念3}**：{一句话解释}

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| {问题1} | {精炼回答，3句话以内} |
| {问题2} | {精炼回答} |
| {问题3} | {精炼回答} |

### 技术细节
{关键技术点展开讲解，代码示例、命令行、配置片段等}

## 常见陷阱
- ⚠️ {新手容易答错的第一点}
- ⚠️ {面试官追问容易露馅的地方}

## 今日检测
1. {自测问题1}
2. {自测问题2}
3. {自测问题3}
```

**复习天内容来源**：对应 `public/contents/cyber-learning/{planId}/` 下同主题的 md 文件，提取核心知识点，压缩成「面试能用的」。

---

### 4.2 实战冲刺天（Day 31–45）

**重点：纯刷题 + 攻防实验，不讲课，只实战。**

#### A. 刷题型（Day 31–36，每隔一天一套题）

```markdown
# Day {N}：{专题名称} — 面试真题冲刺

> 🔥 今日目标：刷完 {X} 道面试真题，正确率 > 80%

## 真题集

### 第1题
**题目**：{面试题正文}

<details>
<summary>查看答案</summary>

**标准答案**：{答案}
**加分点**：{额外加分回答}
**常见错误**：{面试官会扣分的回答}

</details>

### 第2题
...
（共 10–15 题）

## 复盘清单
- [ ] 答错的题重新过一遍
- [ ] 不确定的概念查资料确认
- [ ] 把标准答案用自己的话复述一遍
```

#### B. 攻防实验型（Day 37–42，穿插）

```markdown
# Day {N}：{实验专题} — 攻防实操

> 🧪 今日目标：完成 {X} 个实验，理解攻防原理

## 实验环境
- 环境：{Kali/DVWA/Vulhub/Docker 靶场名称}
- 启动命令：`docker run -d -p 80:80 {image}`

## 实验步骤

### 实验1：{实验名}
1. {步骤1}
2. {步骤2}
3. {步骤3}

**预期结果**：{描述}
**面试中怎么讲**：{把实验过程转化为面试话术}

### 实验2：{实验名}
...

## 实验总结
- 今天学到的新技巧：
- 踩坑记录：
- 面试可以吹的点：
```

#### C. 模拟面试型（Day 43–45）

```markdown
# Day {N}：全真模拟面试

> 🎤 今日目标：完成一次 30 分钟全真模拟面试

## 面试流程

### 第1轮：自我介绍（2分钟）
准备一段 2 分钟的安全工程师自我介绍，包含：
- 技术栈
- 项目经验亮点
- 为什么适合这个岗位

### 第2轮：技术问答（20分钟）
{列出 15–20 道深度追问，模拟面试官的连环追问节奏}

### 第3轮：场景设计（8分钟）
{给出一个真实安全场景，考察综合分析能力}

## 面试评分卡
| 维度 | 得分 | 改进点 |
|------|------|--------|
| 基础扎实度 | /10 | |
| 表达清晰度 | /10 | |
| 实战经验 | /10 | |
| 问题分析 | /10 | |
```

---

## 五、与 TypeScript 数据文件的协作

每个模块已有 `src/data/interview*.ts` 数据文件，其中 `days` 数组存储了：
- `content`：内嵌 Markdown（当前实际渲染的内容）
- `quiz`：题目数组
- `keyPoints`：考点列表
- `codeExamples`：代码示例
- `resources`：学习资源

**优先级规则**：
1. 代码尝试 fetch `/contents/interview-learning/${planId}/day-${N}.md`
2. 若文件存在 → 渲染独立 md 文件内容
3. 若 404 → 降级渲染 `day.content`（TS 内嵌内容）

**建议策略**：先把 md 文件建好放内容，再逐步把 `day.content` 替换为 md 文件的简短摘要或直接留空，让 md 文件成为唯一数据源。

---

## 六、优先级建议

| 优先级 | 模块 | 理由 |
|--------|------|------|
| 🔴 P0 | basic | 基础面广，适用最多岗位，先建立基准模板 |
| 🟡 P1 | penetration | 渗透岗位面试高频 |
| 🟡 P1 | defense | 防守岗位面试高频 |
| 🟢 P2 | hw | 护网专项需求 |
| 🟢 P2 | ai | AI 安全新兴方向 |

**每模块建议顺序**：
1. 先建 Day 1–30 复习天（内容从 cyber-learning 提炼，生成速度快）
2. 再建 Day 31–45 实战天（需要编写大量题目和实验步骤，最耗时）
3. 最后 Day 43–45 模拟面试（需要综合前面全部内容）

---

## 七、文件命名规范

- 文件名格式：`day-{N}.md`（N 为 1–45，无前导零）
- 编码：**UTF-8，无 BOM**
- 路径格式（Linux 风格斜杠）：`public/contents/interview-learning/basic/day-1.md`
- 图片：放在 `public/contents/interview-learning/{planId}/images/` 下，md 中引用为 `images/xxx.png`

---

## 八、快速启动清单

- [ ] 在 `public/contents/` 下新建 `interview-learning/` 目录
- [ ] 建 5 个子目录：`basic/` `penetration/` `defense/` `ai/` `hw/`
- [ ] 先为 `basic` 模块创建 Day 1 作为模板：`day-1.md`
- [ ] 浏览器打开 `http://localhost:6776/interview-learning/basic` 确认加载正常
- [ ] 按优先级逐个补齐各模块的 md 文件
- [ ] （可选）调整 `src/data/interviewBasic.ts` 中 `totalDays` 从 40 改为 45
- [ ] （可选）调整 `mergeEvenly()` 参数从 26 改为 30，后14天扩展为后15天
