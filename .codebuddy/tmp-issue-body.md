## Problem Statement

学习路径模块包含两条路线（CISP 认证学习和网络安全学习），存在以下实际痛点：

1. **习题库逻辑重复**：两个 Daily 页面各自内联了完整的测验交互逻辑（单选/多选/判断/填空、提交、计分、答案解析），代码约 150 行 x 2，但行为完全一致
2. **错题集逻辑重复**：网络安全路线有错题本功能（记录错题 + 连续答对 3 次移除），CISP 路线没有 — 这个功能两条路线都应该有
3. **巨型数据文件**：`src/data/learningData.ts` 约 439KB，包含 90 天全部数据（标题、目标、内容、测验）内联在一个文件里，维护困难

## Solution

抽离两个可复用的 Hook，拆分大型数据文件。三条原则：
- 只改真正值得复用的部分（习题、错题）
- 两条路线数据模型保持独立，互不干扰
- 每次 commit 后项目可正常运行

## Commits

### 1. 创建 useQuiz hook

在 `src/hooks/useQuiz.ts` 创建，封装：
- 当前题目索引管理（currentIndex, goNext）
- 用户答案状态（单选/多选/判断/填空）
- 判分逻辑（isCorrect）
- 答案显示/隐藏（showAnswer）
- 对外的答题回调（answer, selectMultiple）

### 2. CISP DailyLearning 改用 useQuiz

删除 `DailyLearning.tsx` 中内联的测验状态和逻辑（quizAnswers、quizSubmitted、handleQuizSubmit、选项渲染中的判分逻辑），替换为 useQuiz hook。验证测验功能正常。

### 3. 网络安全 CyberDailyLearning 改用 useQuiz

删除 `CyberDailyLearning.tsx` 中内联的测验状态和逻辑，替换为 useQuiz hook。验证测验功能正常。

### 4. 创建 useWrongQuestionBook hook

在 `src/hooks/useWrongQuestionBook.ts` 创建，封装：
- 错题记录（questionId + planId + 连续答对次数）
- 答对时 consecutiveCorrect + 1，答错时重置为 0
- 连续答对 3 次自动移除
- 持久化到 localStorage
- 导出：wrongQuestions 列表、recordAnswer(questionKey, isCorrect) 方法

### 5. CISP DailyLearning 接入错题集

在 DailyLearning.tsx 的测验提交逻辑中，调用 useWrongQuestionBook 的 recordAnswer。在页面中展示错题本入口。

### 6. 网络安全 CyberDailyLearning 改用 useWrongQuestionBook

将网络安全原有的内联错题逻辑替换为 useWrongQuestionBook hook。

### 7. 创建 hooks 统一导出

`src/hooks/index.ts` 导出 useQuiz 和 useWrongQuestionBook。

### 8. 拆分 learningData.ts 类型与工具函数保留

`src/data/learningData.ts` 只保留接口定义和类型导出。

### 9. 创建 weeks 数据文件

`src/data/learning/week1.ts` ~ `week12.ts`，每文件包含对应 7 天的数据。weekThemes 也拆分到独立文件。

### 10. 创建 weeks 聚合导出

`src/data/learning/index.ts` 聚合所有周数据并重新导出 learningData 数组和 weekThemes，保持外部 import 路径兼容。

### 11. 更新所有引用

确保 LearningPath.tsx、DailyLearning.tsx、CyberLearningMain.tsx 等文件从新的导入路径获取数据，功能不变。

### 12. 为 useQuiz 编写测试

测试覆盖：单选/多选/判断/填空四种题型、答案状态切换、计分准确性、下一题导航。

### 13. 为 useWrongQuestionBook 编写测试

测试覆盖：首次答错记录、连续答对计数递增、连续答对 3 次自动移除、答错重置计数。

## Decision Document

- **不统一数据模型** — LearningDay 和 CyberDay 保持独立，各自演进
- **不合并 Store** — learningStore（CISP）和网络安全进度各自管理
- **不抽笔记/MD加载/番茄钟 hook** — 这些不是当前痛点，保持现状
- **useQuiz 输入** — 接受 QuizQuestion[] 数组，不关心数据来源（CISP 还是网安）
- **useWrongQuestionBook 存储** — 两个路线共用一个 localStorage key，错题跨路线有意义
- **learningData 拆分策略** — 按自然周拆分，每文件约 35KB，而非按天（避免 90 个文件）
- **保持外部导入不变** — `src/data/learning/index.ts` 重新导出完整数组，现有 import 可平滑迁移

## Testing Decisions

- 只测试 useQuiz 和 useWrongQuestionBook 两个 hook 的纯逻辑
- 使用 React Testing Library 的 renderHook
- 不测试 UI 渲染、动画、路由导航
- 好测试的标准：只测外部行为（给定题目 -> 用户答题 -> 返回结果），不测内部实现细节

## Out of Scope

- 不修改路由结构
- 不修改 UI 样式、Tailwind 类名、framer-motion 动画
- 不修改 Pomodoro、ProgressRing、Sidebar、TopNav 等共享组件
- 不修改 achievementStore 成就系统
- 不修改 CISP 笔记功能（仍保留在组件内）
- 不修改网络安全进度存储方式（可后续单独处理）
- 不统一两条路线的数据模型

## Further Notes

- learningData.ts 拆分后，通过聚合文件 `src/data/learning/index.ts` 可以让改动最小化
- 拆分过程中注意 learningData 被 CyberLearningMain.tsx 也引用了（仅用于统计），确保导出不变