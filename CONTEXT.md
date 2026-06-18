# CISP 网络安全学习平台

## 项目标识

- **名称**: CISP Study Platform (cisp-study)
- **类型**: 全栈 Web 学习系统（单体仓库）
- **目标用户**: CISP 备考学员、网络安全爱好者

## 领域术语

| 术语 | 定义 |
|------|------|
| **Day / 天数** | 学习路径中的单日课程单元，按顺序解锁 |
| **Plan / 计划** | 四个专项学习计划：基础 (Basic)、渗透 (Penetration)、防御 (Defense)、AI安全 (AI) |
| **Cyber Day** | Cyber 专项计划中的每日课程 |
| **XP / 经验值** | 游戏化激励点数，累积升级 |
| **Streak / 连续打卡** | 连续学习天数，中断归零 |
| **Badge / 徽章** | 达成里程碑后解锁的成就标识 |
| **Lab / 实验** | 交互式安全实验模块（XSS、SQL注入、CTF 等） |
| **Confetti** | 完成课程/测验后的撒花庆祝动画 |
| **Past Paper / 真题** | CISP 历年考试真题 |
| **Mock Exam / 模拟考试** | 限时模拟考试模式 |
| **Pomodoro / 番茄钟** | 25 分钟专注学习计时器 |

## 技术栈

| 层 | 技术 |
|----|------|
| 前端框架 | React 18 + TypeScript + Vite |
| 路由 | react-router-dom v6 (BrowserRouter) |
| 样式 | Tailwind CSS v3 |
| 动画 | framer-motion |
| 代码编辑器 | Monaco Editor (@monaco-editor/react) |
| 状态管理 | Zustand v5 (userStore / learningStore / achievementStore) |
| Python 运行 | Pyodide（浏览器端 WASM） |
| 图表 | recharts |
| 图标 | lucide-react |
| 后端 | Express + SQLite（backend/ 目录） |
| 移动端 | Capacitor（android/ 目录） |

## 项目结构

```
cisp/
├── src/
│   ├── data/          # 扁平化 TS 数据文件（课程、题库、资源）
│   ├── pages/         # 21 个功能页面（内联组件）
│   ├── components/    # 通用组件
│   ├── store/         # Zustand stores
│   ├── hooks/         # 自定义 hooks
│   └── types/         # TypeScript 类型
├── backend/           # Express + SQLite
├── public/            # Markdown 内容文件（按计划分目录）
├── android/           # Capacitor 安卓打包
├── docs/              # 项目文档 + ADR
│   ├── agents/        # AI Agent 配置
│   ├── architecture/  # 架构文档
│   ├── backend/       # 后端 API 文档
│   ├── design-ideas/  # 未来设计构想（非当前实现）
│   ├── labs/          # 实验环境文档
│   └── setup/         # 环境配置文档
└── scripts/           # 辅助脚本
    └── _archive/      # 历史脚本归档
```

## 关键设计决策

- **数据层扁平化**: 每个计划模块的数据集中在单个 `.ts` 文件内，避免深层嵌套
- **顺序解锁**: 课程按天数依次解锁，不可跳课
- **localStorage 持久化**: 大部分状态存于 localStorage，后端仅处理用户认证和社区功能
- **Python 浏览器端执行**: 通过 Pyodide (WASM) 运行，无需后端沙箱
