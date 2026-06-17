# 代码健康报告 —— 巨石文件问题分析

> 生成日期：2026-06-16  
> 项目：CISP 网络安全学习平台

---

## 1. 问题总览

项目中存在多份超过 1000 行的"巨石文件"，数据层和页面层均有涉及。一旦修改这类文件，容易牵一发而动全身，增加引入 bug 的风险，也降低了代码可维护性。

---

## 2. 数据层问题文件

### 2.1 极度严重（自动生成、超大体积）

| 文件 | 大小 | 估计行数 | 问题描述 |
|---|---|---|---|
| `src/data/cyberAiExtended.ts` | 1.16 MB | ~22,000 | AI安全第31-168天全量数据，自动生成。若误操作几乎无法人工恢复 |
| `src/data/cyberAiSupplement.ts` | 562 KB | ~11,000 | AI安全补充数据（quiz / codeExamples / resources），自动生成 |

**风险**：
- TypeScript 编译耗时显著增加
- 编辑器打开/搜索/替换极为缓慢
- 一旦误删或格式损坏，手工修复近乎不可能
- 即使不修改，每次 `tsc` 都会遍历这些巨型 AST

**建议**：
- 考虑改为按需懒加载（运行时 fetch 或动态 import 对应天数的子文件）
- 或将数据拆分为基础文件 + 按天/按模块的增量文件，按需拼接

---

### 2.2 高度严重（职责混杂、手工维护）

| 文件 | 大小 | 行数 | 问题描述 |
|---|---|---|---|
| `src/data/learningData.ts` | 488 KB | 5,085 | 单一文件混合了**接口定义**、**实验定义（~1900行）**、**全部学习日数据（~2970行）**三种职责 |
| `src/data/cyberPenetration.ts` | 232 KB | ~4,500 | 渗透测试30天学习计划全量数据 |
| `src/data/cyberAi.ts` | 222 KB | ~4,200 | AI安全30天学习计划全量数据 |
| `src/data/securityScripts.ts` | 213 KB | ~4,000 | 全部安全脚本仓库数据 |
| `src/data/cyberDefense.ts` | 171 KB | ~3,300 | 安全防御30天学习计划 |
| `src/data/cyberBasic.ts` | 147 KB | ~2,800 | 基础安全30天学习计划 + 部分公共类型 |
| `src/data/cybersecurityData.ts` | 130 KB | ~2,500 | 网络安全通用数据 |
| `src/data/pastPapers.ts` | 116 KB | ~2,200 | 历年真题 |
| `src/data/resourceData.ts` | 113 KB | ~2,200 | 学习资源数据 |
| `src/data/emergencyResponse.ts` | 86 KB | ~1,700 | 应急响应场景 |
| `src/data/cyberBasicSupplement.ts` | 85 KB | ~1,600 | 基础学习补充数据 |
| `src/data/toolSites.ts` | 56 KB | ~1,100 | 工具站点数据 |

**典型问题示例 —— `learningData.ts`**：

```
┌──────────────────────────────────────┐
│  learningData.ts (5,085 行)           │
├──────────────────────────────────────┤
│  接口定义 (CodeExample, QuizQuestion, │  ← 改接口 = 全文件要重检
│   LabTool, LearningDay, Experiment...) │
├──────────────────────────────────────┤
│  weekThemes (12周主题)                 │
├──────────────────────────────────────┤
│  experiments (~1,900行)               │  ← 大量实验定义
├──────────────────────────────────────┤
│  dayExpertNotes (~120行)              │
├──────────────────────────────────────┤
│  allDays (~2,970行)                   │  ← 全部学习日数据
└──────────────────────────────────────┘
```

改一个接口类型定义 -> 整个 5000 行文件中所有引用都要兼容。改一个实验 = 可能破坏其他实验的引用链。

---

## 3. 页面层问题文件

### 3.1 高度严重

| 文件 | 行数 | 问题描述 |
|---|---|---|
| `src/pages/CodeLab.tsx` | 2,290 | **6个Tab面板全部在一个组件中**（总览/代码实验/靶场实战/脚本仓库/法律法规/应急处理），每个Tab都有独立的筛选、搜索、编辑器、交互逻辑 |
| `src/pages/CodeRunner.tsx` | ~1,500 | 代码运行器页面，逻辑+渲染庞大 |
| `src/pages/MockExam.tsx` | ~1,300 | 模拟考试全部逻辑在单文件中 |
| `src/pages/CyberDailyLearning.tsx` | 1,421 | 每日学习页，功能丰富：课程内容、代码编辑器、编程练习、四种题型测验、笔记、番茄钟 |
| `src/pages/LabEnvironment.tsx` | ~1,200 | 靶场环境页 |

**典型问题示例 —— `CodeLab.tsx`**：

```
┌───────────────────────────────────────┐
│  CodeLab.tsx (2,290 行)                │
├───────────────────────────────────────┤
│  导入 + 常量 (96行)                    │
│  状态声明 (~40行, 20+ 个 useState)      │
│  Pyodide 初始化 (~50行, 2个运行时)      │
│  代码执行逻辑 (~90行)                   │
│  JSX 渲染 (~1,990行)                   │
│    ├── Dashboard Tab (总览)            │  ← 改一个Tab可能影响其他Tab的状态
│    ├── Experiments Tab (代码实验)       │
│    ├── Range Tab (靶场实战)            │
│    ├── Scripts Tab (脚本仓库)           │
│    ├── Laws Tab (法律法规)              │
│    └── Emergency Tab (应急处理)         │
└───────────────────────────────────────┘
```

**风险**：
- 20+ 个 `useState` 共享同一个闭包，任何一个状态更新都可能触发其他Tab的重渲染
- 修改一个Tab的筛选/搜索逻辑，可能污染其他Tab的全局状态
- 6个Tab的独立功能强耦合在单个 `return` 中，合并冲突概率极高

---

## 4. 风险等级汇总

| 严重等级 | 文件数 | 总代码量（估算） | 主要风险 |
|---|---|---|---|
| 🔴 极高 | 2 | ~33,000 行 | 自动生成数据过大，编译/加载慢，误操作无法恢复 |
| 🟠 高 | 7 | ~20,500 行 | 职责混杂，修改一处可能影响全局 |
| 🟡 中高 | 3 | ~5,200 行 | 页面组件过大，功能耦合 |

---

## 5. 详细修改方案

---

### 方案 A：拆分 `CodeLab.tsx`（P0）

#### 现状分析

| 区域 | 行范围 | 职责 | 可独立程度 |
|---|---|---|---|
| 导入 + 常量 | 1-96 | ~50个图标、categoryIcons、experimentCategories | ✅ 各 Tab 按需引用 |
| 组件状态 | 98-143 | 20+ 个 useState | ❌ 全耦合在主组件 |
| Pyodide 初始化 | 157-203 | 两组 Pyodide 运行时（实验用 + 脚本用） | ✅ 可抽为独立 hook |
| 代码执行函数 | 205-294 | `runExperimentCode`、`runScriptCode`、过滤函数 | ✅ 逻辑独立 |
| Dashboard Tab | ~396-440 | 统计卡片 + 快捷入口 | ✅ 完全独立 |
| Experiments Tab | ~441-970 | 分类筛选 + 搜索 + 实验列表 + Monaco 编辑器 | ✅ 完全独立 |
| Range Tab | ~971-1390 | 靶场实战模块 | ✅ 完全独立 |
| Scripts Tab | ~1391-1690 | 安全脚本仓库 | ✅ 完全独立 |
| Laws Tab | ~1691-1990 | 法律法规浏览 + 测验 | ✅ 完全独立 |
| Emergency Tab | ~1991-2287 | 应急处理演练 | ✅ 完全独立 |

#### 目标结构

```
src/pages/codeLab/
├── index.tsx                 ← 主路由组件（~150行）
├── tabs/
│   ├── DashboardTab.tsx      ← 总览面板（~60行）
│   ├── ExperimentsTab.tsx    ← 代码实验面板（~530行）
│   ├── RangeTab.tsx          ← 靶场实战面板（~420行）
│   ├── ScriptsTab.tsx        ← 脚本仓库面板（~300行）
│   ├── LawsTab.tsx           ← 法律法规面板（~300行）
│   └── EmergencyTab.tsx      ← 应急处理面板（~300行）
├── hooks/
│   ├── usePyodide.ts         ← 通用 Pyodide 初始化 hook
│   └── useExperimentRunner.ts ← 实验代码执行 hook
├── constants.ts              ← 常量（experimentCategories、categoryIcons、difficultyColors）
└── types.ts                  ← 共享类型定义
```

#### 每一步的具体操作

**第 1 步：抽取 `constants.ts`**（~50行）

将以下内容从 `CodeLab.tsx` 移到 `codeLab/constants.ts`：

```ts
// difficultyColors, experimentCategories, categoryIcons
```

`CodeLab.tsx` 内部改为 `import { ... } from '../codeLab/constants'`。

**第 2 步：抽取 `usePyodide.ts`**（~60行）

将现有的 `initPyodide` 和 `initScriptPyodide` 两个函数合并为一个通用 hook：

```ts
// hooks/usePyodide.ts
export function usePyodide() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const pyodideRef = useRef<any>(null);

  const init = useCallback(async () => {
    // ... 现有逻辑
  }, []);
  
  return { pyodideRef, pyodideReady, pyodideLoading, init };
}
```

使用方式：`const { init: initPyodide, ... } = usePyodide();`
由于两个 Tab（Experiments 和 Scripts）共用相同的 Pyodide 加载逻辑，可以共享同一个实例或在调用处各自实例化。

**第 3 步：抽取 `DashboardTab.tsx`**（~60行）

```
Props: { onNavigate: (tab: string) => void }
```

将 Dashboard Tab 的 JSX（统计卡片 + 快捷入口）完整剪切过去。

**第 4 步：抽取 `ExperimentsTab.tsx`**（~530行）

```
Props: {
  experiments: Experiment[];
  completedLabs: string[];
  onComplete: (labId: string) => void;
  pyodideReady: boolean;
  pyodideLoading: boolean;
  onRunCode: (expId: string, code: string) => void;
  runningCode: string | null;
  codeOutputs: Record<string, string>;
  codeEditorContent: Record<string, string>;
  onCodeChange: (expId: string, code: string) => void;
  showHint: Record<string, boolean>;
  onToggleHint: (expId: string) => void;
  experimentPassed: Record<string, boolean>;
}
```

内部包含：分类筛选下拉、搜索框、实验卡片列表、Monaco 编辑器、输出面板。

**第 5 步：依次抽取其余 Tab 组件**

| Tab | Props 数 | 特殊依赖 |
|---|---|---|
| `RangeTab` | ~7 | `securityScripts`、`scriptCategories` |
| `ScriptsTab` | ~6 | `securityScripts`、`scriptCategories`、Pyodide |
| `LawsTab` | ~6 | `laws`、`lawCategories` |
| `EmergencyTab` | ~5 | `emergencyScenarios` |

**第 6 步：精简 `index.tsx`（主组件）**

主组件只保留：
- Tab 状态 `activeTab`
- 各 Tab 共享的全局状态（experimentPassed 等）
- Tab 切换 UI
- 条件渲染各子组件

最终主组件预计 **~150 行**，减少 **93%**。

#### 效果

- 修改某个Tab的UI/逻辑，各 Tab 独立文件互不影响
- 每个子组件可以独立测试
- Git 合并冲突范围从 2290 行缩小到 ~150 行
- Props 接口即文档，清晰定义了每个Tab的依赖

---

### 方案 B：拆分 `learningData.ts`（P1）

#### 现状分析

```
learningData.ts (5,085行)
├── 行 1-64    接口定义（6个interface）
├── 行 66-79   weekThemes（12周主题）
├── 行 81-1985 experiments（~1900行，交互式实验定义）
├── 行 1986-2109 dayExpertNotes（~120行）
├── 行 2110-5083 allDays（~2970行，全部学习日数据）
└── 行 5084     export default
```

#### 目标结构

```
src/data/
├── types/
│   └── learning.ts              ← CodeExample, QuizQuestion, LabTool,
│                                   LabEnvironment, ExpertNote, LearningDay,
│                                   Experiment 共6个接口（~64行）
├── weekThemes.ts                ← weekThemes 常量（~14行）
├── experiments.ts               ← experiments 数组（~1900行）
├── dayExpertNotes.ts            ← dayExpertNotes 对象（~120行）
├── learningDays/
│   ├── index.ts                 ← 合并导出 allDays
│   ├── week01.ts                ← 第1周（信息安全基础）
│   ├── week02.ts                ← 第2周（信息安全法规）
│   ├── week03.ts                ← 第3周（访问控制）
│   ├── week04.ts                ← 第4周（安全运营）
│   ├── week05.ts                ← 第5周（漏洞与攻击）
│   ├── week06.ts                ← 第6周（加密技术）
│   ├── week07.ts                ← 第7周（网络安全）
│   ├── week08.ts                ← 第8周（应用安全）
│   ├── week09.ts                ← 第9周（物理安全）
│   ├── week10.ts                ← 第10周（安全工程）
│   ├── week11.ts                ← 第11周（业务安全）
│   └── week12.ts                ← 第12周（模拟考试）
└── learningData.ts              ← 向后兼容：re-export 所有内容
```

#### 每一步的具体操作

**第 1 步：新建 `src/data/types/learning.ts`**

```ts
// 直接剪切 learningData.ts 行的 1-64
export interface CodeExample { ... }
export interface QuizQuestion { ... }
export interface LabTool { ... }
export interface LabEnvironment { ... }
export interface ExpertNote { ... }
export interface LearningDay { ... }
export interface Experiment { ... }
```

**第 2 步：新建 `src/data/weekThemes.ts`** 和 **`src/data/dayExpertNotes.ts`**

```ts
// weekThemes.ts - 剪切行 66-79
import type { ... } from './types/learning';  // 如果类型需要
export const weekThemes = [...];

// dayExpertNotes.ts - 剪切行 1986-2109
export const dayExpertNotes: Record<number, ExpertNote[]> = { ... };
```

**第 3 步：新建 `src/data/experiments.ts`**

```ts
import type { Experiment } from './types/learning';

export const experiments: Experiment[] = [
  // ... 剪切行 81-1985，约1900行
];
```

**第 4 步：按周拆分 `allDays`**

根据 `weekThemes` 中的12周划分（每行 LearningDay 都有 `week: number`），将 `allDays` 数组按 `week` 字段分组：

```ts
// learningDays/week01.ts
import type { LearningDay } from '../types/learning';

export const week01Days: LearningDay[] = [
  // { ... day: 1, week: 1, ... },
  // { ... day: 2, week: 1, ... },
  // ...
];
```

**第 5 步：新建 `src/data/learningDays/index.ts`** 作为聚合器

```ts
import { week01Days } from './week01';
import { week02Days } from './week02';
// ... 全部12周

export const allDays = [
  ...week01Days,
  ...week02Days,
  // ...
];
```

**第 6 步：更新 `src/data/learningData.ts`**

保持为向后兼容的 re-export 文件，所有现有引用无需修改：

```ts
export type { CodeExample, QuizQuestion, LabTool, LabEnvironment, ExpertNote, LearningDay, Experiment } from './types/learning';
export { weekThemes } from './weekThemes';
export { experiments } from './experiments';
export { dayExpertNotes } from './dayExpertNotes';
export { allDays } from './learningDays';

// 保持默认导出
import { allDays } from './learningDays';
export default allDays;
```

#### 效果

- 修改接口定义只影响 `types/learning.ts`（64行）
- 修改某个实验只需要打开 `experiments.ts`（1900行，比原来少60%）
- 按周编辑学习日数据，每周一个文件，各自独立
- 以 `week12.ts`（模拟考试）为例，修改时完全不会碰到基础知识数据

---

### 方案 C：拆分 `CyberDailyLearning.tsx`（P1）

#### 现状分析

| 区域 | 行范围 | 行数 | 抽取方案 |
|---|---|---|---|
| `planColor()` 函数 | 71-140 | ~70行 | → 独立工具文件 `src/utils/planColors.ts` |
| 测验区域 JSX | ~1091-1270 | ~180行 | → 独立组件 `<QuizPanel />` |
| 代码编辑器区域 | ~821-945 | ~125行 | → 独立组件 `<CodePlayground />` |
| 游戏化面板 | ~535-636 | ~100行 | → 独立组件 `<GamificationPanel />` |
| 课程内容区 | ~638-778 | ~140行 | → 独立组件 `<LessonContent />` |
| 数据合并逻辑 | 188-216 | ~30行 | → 独立 hook `useMergedDay()` |

#### 每一步的具体操作

**第 1 步：抽取 `src/utils/planColors.ts`**

```ts
export const planColor = (planId: string) => {
  // 直接剪切 current lines 71-140
  // 返回 { main, bg, border, bgLight, ... }
};
```

**第 2 步：抽取 `useMergedDay` hook**

```ts
// hooks/useMergedDay.ts
export function useMergedDay(plan, currentDay, planId, planSupplements) {
  return useMemo(() => {
    // 剪切 current lines 188-216 的逻辑
  }, [plan, currentDay, planId]);
}
```

**第 3 步：抽取测验组件 `<CyberQuiz />`**

```tsx
// components/CyberQuiz.tsx
interface CyberQuizProps {
  quiz: ReturnType<typeof useQuizPractice>;
  wrongQuestionBook: ReturnType<typeof useWrongQuestionBook>;
  timer: number;
  timerRunning: boolean;
  onStartTimer: () => void;
  onStopTimer: () => void;
  onAnswer: (index: number) => void;
  planColor: ReturnType<typeof planColor>;
}
```

将当前 1091-1270 行的 4 种题型（单选/多选/判断/填空）的 JSX 移入此组件。

**第 4 步：抽取代码编辑器 `<CodePlayground />`**

```tsx
// components/CodePlayground.tsx
interface CodePlaygroundProps {
  codeExample: string;
  editorCode: string;
  onCodeChange: (code: string) => void;
  language: string;
  codeOutput: string;
  codeRunning: boolean;
  onRun: () => void;
  planColor: ReturnType<typeof planColor>;
}
```

**第 5 步：主组件精简**

主组件 `CyberDailyLearning.tsx` 预计从 1421 行缩减到 ~500 行，主要负责：
- 日期导航（上一天/下一天）
- 数据加载与合并
- 组装子组件

#### 效果

- 测验模块可独立测试和修改题型逻辑
- 颜色主题可全局复用
- 代码编辑器可跨页面使用

---

### 方案 D：学习计划数据文件拆分（P1）

#### 目标

对 `cyberPenetration.ts`（~4500行）、`cyberAi.ts`（~4200行）、`cyberDefense.ts`（~3300行）、`cyberBasic.ts`（~2800行）进行统一拆分。

#### 拆分策略

每个计划文件当前结构：

```
cyberXxx.ts
├── XxxDay 类型定义
├── xxxPlan 对象 { planId, title, days: CyberDay[] }
│   ├── day 1-10  （前10天）
│   ├── day 11-20 （中10天）
│   └── day 21-30 （后10天）
```

改造为：

```
src/data/plans/
├── types.ts                          ← 公共类型（CyberDay, QuizQuestion 等）
├── basic/
│   ├── index.ts                      ← re-export: cyberBasicPlan
│   ├── part1.ts                      ← day 1-10
│   ├── part2.ts                      ← day 11-20
│   ├── part3.ts                      ← day 21-30
│   └── supplement.ts                 ← 补充数据
├── penetration/
│   ├── index.ts
│   ├── part1.ts
│   ├── part2.ts
│   ├── part3.ts
│   └── supplement.ts
├── defense/
│   ├── index.ts
│   ├── part1.ts
│   ├── part2.ts
│   ├── part3.ts
│   └── supplement.ts
└── ai/
    ├── index.ts
    ├── part1.ts
    ├── part2.ts
    ├── part3.ts
    └── supplement.ts
```

#### 具体操作（以 `cyberPenetration.ts` 为例）

**第 1 步**：创建 `src/data/plans/types.ts`，提取公共接口

```ts
export interface CyberDay {
  day: number;
  week: number;
  title: string;
  objectives: string[];
  topics: string[];
  content: string;
  quiz: QuizQuestion[];
  codeExamples?: CodeExample[];
  resources?: string[];
  recommendedTools?: LabTool[];
}

export interface CyberLearningPlan {
  planId: string;
  title: string;
  description: string;
  days: CyberDay[];
}
```

**第 2 步**：按 10 天一组拆分 days 数据

```ts
// penetration/part1.ts
import type { CyberDay } from '../types';
export const penPart1: CyberDay[] = [ /* day 1-10 */ ];

// penetration/part2.ts
export const penPart2: CyberDay[] = [ /* day 11-20 */ ];

// penetration/part3.ts
export const penPart3: CyberDay[] = [ /* day 21-30 */ ];
```

**第 3 步**：创建聚合文件

```ts
// penetration/index.ts
import type { CyberLearningPlan } from '../types';
import { penPart1 } from './part1';
import { penPart2 } from './part2';
import { penPart3 } from './part3';

export const cyberPenetrationPlan: CyberLearningPlan = {
  planId: 'penetration',
  title: '渗透测试',
  description: '...',
  days: [...penPart1, ...penPart2, ...penPart3],
};
```

**第 4 步**：向后兼容

```ts
// src/data/cyberPenetration.ts（保留原文件作为 re-export）
export { cyberPenetrationPlan } from './plans/penetration';
```

#### 效果

- 修改第 15 天内容，只打开 `part2.ts`（~1000行），无需碰 `part1.ts` 和 `part3.ts`
- 类型定义集中在 `plans/types.ts`，4个计划共享一套接口
- 补充数据（supplement）独立管理

---

### 方案 E：巨型自动生成文件处理（P2）

#### 目标文件

| 文件 | 大小 | 行数 | 
|---|---|---|
| `src/data/cyberAiExtended.ts` | 1.16 MB | ~22,000 |
| `src/data/cyberAiSupplement.ts` | 562 KB | ~11,000 |

#### 推荐方案：迁移为分片 JSON + 懒加载

**改造路径**：

```
# 当前
src/data/cyberAiExtended.ts (直接 import, 编译时全部打包)

# 改造后
public/data/cyberAi/
├── index.json              ← { totalDays: 168, files: [...] }
├── day-031.json            ← AI第31天数据
├── day-032.json
├── ...
└── day-168.json            ← AI第168天数据
```

**第 1 步**：编写转换脚本，将 TS 数组按天输出为独立 JSON 文件

```python
# tools/split_ai_data.py
import json, os

# 读取 cyberAiExtended.ts，解析为 JSON 对象
# 按 day 字段拆分为独立文件
# 输出到 public/data/cyberAi/
```

**第 2 步**：在组件中使用动态加载

```ts
// hooks/useCyberAiDay.ts
export function useCyberAiDay(dayNumber: number) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/data/cyberAi/day-${String(dayNumber).padStart(3, '0')}.json`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [dayNumber]);

  return { data, loading };
}
```

**第 3 步**：同样的逻辑应用于 `cyberAiSupplement.ts`

#### 备选方案：IndexedDB 缓存 + 按需请求

如果用户可能离线使用，可以：
1. 首次访问时从服务端拉取所需天数 JSON
2. 存入 IndexedDB（利用 `src/data/LocalStorageDB.ts`）
3. 后续访问直接从 IndexedDB 读取

#### 效果

- 首屏加载体积从 1.7MB 降低为按天加载（每天 ~6KB）
- 源码目录不再包含超大型 TS 文件
- 数据修改只需重新生成对应 JSON，不触碰任何 TS 代码

---

### 方案 F：其他数据文件的渐进优化（P2）

以下文件虽然符合"大数据文件"标准，但结构相对单一（纯数组/对象），优先级可放低：

| 文件 | 当前行数 | 建议 |
|---|---|---|
| `securityScripts.ts` | ~4,000 | 新增脚本可继续维持在单文件，达到 8000 行时重新评估 |
| `cybersecurityData.ts` | ~2,500 | 按子主题拆分（加密/网络/系统 各一个文件） |
| `pastPapers.ts` | ~2,200 | 按年份拆分（2023/2024/2025 各一个文件） |
| `resourceData.ts` | ~2,200 | 按资源类型拆分（书籍/视频/工具 各一个文件） |
| `emergencyResponse.ts` | ~1,700 | 按事件类型拆分（勒索/漏洞/崩溃 各一个文件） |

---

## 6. 实施清单（推荐顺序）

| 顺序 | 方案 | 文件 | 当前行数 → 目标 | 预估工时 | 风险 |
|---|---|---|---|---|---|
| 1 | A-1 | 抽取 `codeLab/constants.ts` | +50行 | 30分钟 | 低 |
| 2 | A-2 | 抽取 `codeLab/hooks/usePyodide.ts` | +60行 | 1小时 | 低 |
| 3 | A-3~6 | 抽取6个Tab子组件 + 精简主组件 | 2290→150 | 4小时 | 中 |
| 4 | B-1~2 | 抽取类型 + weekThemes + dayExpertNotes | +200行 | 1小时 | 低 |
| 5 | B-3 | 抽取 `experiments.ts` | +1900行 | 30分钟 | 低 |
| 6 | B-4~6 | 拆分12周学习日 + 向后兼容 | +3000行 | 2小时 | 中 |
| 7 | C | 拆分 `CyberDailyLearning.tsx` | 1421→500 | 3小时 | 中 |
| 8 | D | 拆分4个学习计划数据文件 | 各~3500→~300 | 4小时 | 中 |
| 9 | E | 迁移巨型自动生成文件为 JSON 懒加载 | 33000→0(TS) | 4小时 | 高 |
| 10 | F | 渐进优化其余数据文件 | 可选 | 按需 | 低 |

**预计总工时**：约 20 小时（分阶段进行，每阶段完成后即可验证无回归）

---

## 7. 统计数据一览

| 指标 | 数值 |
|---|---|
| 总 `.ts` 数据文件 | 20 个 |
| 超过 1000 行的数据文件 | 16 个（80%） |
| 超过 3000 行的数据文件 | 6 个（30%） |
| 超过 10000 行的数据文件 | 2 个（10%，均为自动生成） |
| 总 `.tsx` 页面文件 | ~12 个 |
| 超过 1000 行的页面文件 | 5 个（42%） |

---

*如需对上述任一文件制定详细拆分方案，可继续沟通。*
