# 架构总览

CISP 学习平台的系统架构、模块职责与数据流说明。

## 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                         浏览器 / WebView                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                 React SPA (Vite 构建)                   │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │  │
│  │  │  Pages   │  │  Store   │  │   API Client        │  │  │
│  │  │ (19页)   │  │ (Zustand)│  │   (fetch + JWT)     │  │  │
│  │  └──────────┘  └──────────┘  └─────────┬──────────┘  │  │
│  │                                         │              │  │
│  │  ┌──────────────────────────────────────┘              │  │
│  │  │  /api/* → Vite Proxy → http://localhost:3003       │  │
│  └──┼────────────────────────────────────────────────────┘  │
│     │                                                        │
└─────┼────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express 后端 (server.js)                    │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Auth Router │  │Progress Router│  │   Labs Router    │  │
│  │  /api/auth/* │  │/api/progress/*│  │   /api/labs/*    │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                 │                    │             │
│  ┌──────┴─────────────────┴────────────────────┴─────────┐  │
│  │                    db.js (JSON 封装)                    │  │
│  │              backend/data/database.json                │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          lib/dockerLabs.js (Docker 控制)              │   │
│  │        powershell → docker-compose up/down            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │     静态文件服务 (express.static)                      │   │
│  │     dist/ → 生产模式一体化部署                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 模块说明

### 前端（React SPA）

| 层级 | 目录 | 职责 |
|------|------|------|
| 页面 | `src/pages/` | 19 个页面组件，每个对应一个路由 |
| 组件 | `src/components/` | 可复用 UI 组件（Layout、Card、ProgressRing、Pomodoro 等） |
| 状态管理 | `src/store/` | Zustand stores：`userStore`、`learningStore`、`achievementStore`、`communityStore` |
| 数据 | `src/data/` | 静态学习内容：题库、大纲、真题、工具站点、30/90 天学习计划 |
| API | `src/api/client.ts` | 基于 fetch 的 HTTP 客户端，自动附加 JWT Bearer Token |
| 路由 | `src/App.tsx` | React Router 路由定义，除 `/login` 外均需登录 |

#### 路由表

| 路径 | 页面 | 说明 |
|------|------|------|
| `/login` | AuthPage | 登录/注册（无需认证） |
| `/` | Dashboard | 仪表盘首页 |
| `/learning` | LearningPath | 学习路径总览 |
| `/learning/:dayId` | DailyLearning | 每日学习详情 |
| `/cyber-learning` | CyberLearningMain | 网络安全学习主页 |
| `/cyber-learning/:planId` | CyberDailyLearning | 网络安全每日学习 |
| `/lab` | CodeLab | 代码实验室 |
| `/lab-environment` | LabEnvironment | 靶场环境管理 |
| `/flashcards` | Flashcards | 闪卡复习 |
| `/quiz` | QuizCenter | 测验中心 |
| `/outline` | ExamOutline | 考试大纲 |
| `/past-papers` | PastPapers | 历年真题 |
| `/mock-exam` | MockExam | 模拟考试 |
| `/study-tips` | StudyTips | 学习技巧 |
| `/tool-sites` | ToolSites | 工具站点 |
| `/achievements` | Achievements | 成就系统 |
| `/community` | Community | 社区交流 |
| `/profile` | Profile | 个人中心 |

### 后端（Express）

| 模块 | 文件 | 职责 |
|------|------|------|
| 入口 | `server.js` | 启动服务、注册中间件、挂载路由、静态文件托管 |
| 认证路由 | `routes/auth.js` | 注册、登录、获取当前用户 |
| 进度路由 | `routes/progress.js` | 学习进度 CRUD、偏好设置、数据重置 |
| 靶场路由 | `routes/labs.js` | 容器列表、启停、状态查询、工具命令参考 |
| 鉴权中间件 | `middleware/auth.js` | JWT 验证，保护 `/api/progress/*` |
| 数据库 | `db.js` | JSON 文件读写封装，内存缓存 + 原子写入 |
| 靶场控制 | `lib/dockerLabs.js` | 通过 docker-compose 管理容器生命周期 |

### 数据存储（JSON）

文件：`backend/data/database.json`

```json
{
  "users": [
    {
      "id": 1,
      "username": "string",
      "email": "string | null",
      "password_hash": "bcrypt hash",
      "created_at": "ISO 8601"
    }
  ],
  "progress": [
    {
      "userId": 1,
      "dayId": "day-1",
      "completedAt": "ISO 8601",
      "quizScore": "number | null"
    }
  ],
  "labs": [
    {
      "userId": 1,
      "labId": "juice-shop",
      "completedAt": "ISO 8601"
    }
  ],
  "quiz": [
    {
      "userId": 1,
      "quizId": "string",
      "score": "number",
      "completedAt": "ISO 8601"
    }
  ],
  "preferences": {
    "1": {
      "current_day": 1,
      "mode": "full | intensive",
      "last_study_date": "YYYY-MM-DD"
    }
  }
}
```

> ⚠️ 该文件为单机 JSON 存储，不支持并发访问，不适合生产环境。写入采用「写临时文件 + rename」的原子策略，避免写入中断导致数据损坏。

### Docker 靶场

```
┌─────────────────────────────────────────┐
│              cisp-lab-network            │
│          (bridge, 宿主机隔离)             │
│                                          │
│  ┌────────────┐  ┌──────────────────┐   │
│  │ juice-shop │  │     webgoat      │   │
│  │  :3000     │  │  :8080 / :9090   │   │
│  └────────────┘  └──────────────────┘   │
│  ┌────────────┐  ┌──────────────────┐   │
│  │    dvwa    │  │      bwapp       │   │
│  │   :8081    │  │      :8082       │   │
│  └────────────┘  └──────────────────┘   │
└─────────────────────────────────────────┘
```

后端通过 `lib/dockerLabs.js` 调用 `docker-compose` 命令管理容器。当前实现依赖 Windows PowerShell，在 macOS / Linux 上需适配 shell 语法。

### Capacitor 移动端

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│  React SPA   │ ──→ │  capacitor.config │ ──→ │  Android APK │
│  (dist/)     │     │  webDir: dist     │     │  WebView 容器 │
└──────────────┘     └──────────────────┘     └──────────────┘
```

- App ID：`com.cisp.learning`
- 前端构建产物 `dist/` 作为 WebView 内容
- APK 模式下无后端，数据全量存储在 localStorage

## 数据流

### 用户认证流程

```
用户 → AuthPage → POST /api/auth/login → server.js → routes/auth.js
                                                         │
                                                    db.findUserByUsername()
                                                         │
                                                    bcrypt.compareSync()
                                                         │
                                                    jwt.sign() → token
                                                         │
用户 ← { token, user } ←────────────────────────────────┘
       │
       └→ localStorage.setItem('cisp_token', token)
       └→ 后续请求自动附加 Authorization: Bearer <token>
```

### 学习进度同步流程

```
用户完成学习 → DailyLearning → api.completeDay(dayId, score)
                                    │
                              POST /api/progress/day/:dayId/complete
                                    │
                              middleware/auth.js (JWT 验证)
                                    │
                              routes/progress.js
                                    │
                              db.markDayComplete() → database.json
                              db.setPreferences()  → database.json
```

### 靶场容器控制流程

```
用户点击启动 → LabEnvironment → api.startLab(containerId)
                                    │
                              POST /api/labs/start/:containerId
                                    │
                              lib/dockerLabs.js
                                    │
                              exec('docker-compose up -d {id}')
                                    │
                              容器启动 → 状态返回前端
```
