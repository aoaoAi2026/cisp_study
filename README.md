# CISP 学习平台

面向 CISP（注册信息安全专业人员）备考与网络安全实战训练的混合项目，集学习路径管理、题库练习、Docker 靶场和移动端打包于一体。

## 项目定位

本项目并非单一前端站点，而是一个 **学习平台 + 本地训练环境控制台** 的组合体：

- **学习侧**：提供 30 天 / 90 天分阶段网络安全学习路径，覆盖 CISP 考试大纲知识点
- **练习侧**：内置题库、历年真题、模拟考试、闪卡复习
- **实战侧**：通过 Docker Compose 管理本地靶场容器（Juice Shop、WebGoat、DVWA、bWAPP）
- **移动侧**：基于 Capacitor 打包为 Android APK，可在手机上离线学习

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18、TypeScript、Vite 6、React Router 7、Zustand、Tailwind CSS 3 |
| 图表 | Recharts |
| 编辑器 | Monaco Editor（`@monaco-editor/react`） |
| Markdown | react-markdown |
| 动画 | Framer Motion |
| 图标 | Lucide React |
| 后端 | Express 4、JWT（jsonwebtoken）、bcryptjs、dotenv |
| 数据存储 | JSON 文件（`backend/data/database.json`） |
| 靶场 | Docker Compose（Juice Shop / WebGoat / DVWA / bWAPP） |
| 移动端 | Capacitor 8 Android |

## 目录结构

```text
cisp/
├── src/                        # 前端源码
│   ├── api/client.ts           # API 客户端封装（fetch + JWT）
│   ├── components/             # 通用组件（Layout、Card、ProgressRing 等）
│   ├── data/                   # 静态学习内容数据（题库、大纲、真题等）
│   ├── pages/                  # 页面组件（19 个页面）
│   ├── store/                  # Zustand 状态管理
│   ├── App.tsx                 # 根组件 + 路由定义
│   ├── main.tsx                # 入口
│   └── index.css               # 全局样式（Tailwind）
├── backend/                    # Express 后端
│   ├── routes/                 # 路由（auth / progress / labs）
│   ├── middleware/auth.js      # JWT 鉴权中间件
│   ├── lib/dockerLabs.js       # Docker 靶场控制
│   ├── db.js                   # JSON 数据库封装
│   ├── data/database.json      # 运行时数据文件（用户、进度、成绩）
│   ├── server.js               # 入口（一体化服务：API + 静态文件）
│   └── .env / .env.example     # 环境变量
├── android/                    # Capacitor Android 工程
├── scripts/                    # 辅助脚本
│   ├── start-app.bat           # Windows 一键启动
│   └── build-apk.bat           # APK 构建
├── docs/                       # 项目文档
│   ├── README.md               # 文档导航
│   ├── setup/environment.md    # 环境说明
│   ├── architecture/overview.md# 架构总览
│   ├── backend/api.md          # 接口文档
│   └── labs/docker-labs.md     # 靶场说明
├── docker-compose.yml          # 靶场容器编排
├── capacitor.config.ts         # Capacitor 配置
├── vite.config.ts              # Vite 配置（代理 + HMR）
└── package.json                # 前端依赖
```

## 快速启动

### 前置要求

- Node.js >= 18
- npm >= 9
- （可选）Docker Desktop — 运行靶场容器时需要

### 1. 安装依赖

```bash
# 前端依赖（项目根目录）
npm install

# 后端依赖
cd backend
npm install
```

### 2. 配置后端环境变量

```bash
cd backend
cp .env.example .env
```

编辑 `.env`，至少修改 `JWT_SECRET`：

```env
PORT=3003
JWT_SECRET=替换为一个强随机字符串
```

> ⚠️ **重要**：前端开发代理固定指向 `http://localhost:3003`（见 `vite.config.ts`）。如果后端 `.env` 未配置或 PORT 不是 3003，请求将无法正确代理。后端未加载 `.env` 时会回退到 `3002`，这是最容易踩坑的配置差异。

### 3. 启动服务

```bash
# 启动后端（端口 3003）
cd backend
npm run dev

# 另开终端，启动前端（端口 5173）
npm run dev
```

- 前端开发地址：`http://localhost:5173`
- 后端健康检查：`http://localhost:3003/api/health`

### 4. Windows 一键启动

```bat
scripts\start-app.bat
```

脚本会自动检查 Node.js、安装缺失依赖、依次启动后端和前端。

## 靶场容器

通过 Docker Compose 管理 4 个 Web 安全训练靶场：

| 靶场 | 地址 | 难度 | 默认凭据 |
|------|------|------|----------|
| OWASP Juice Shop | `http://localhost:3000` | 简单 | `admin@juice-sh.op` / `admin123` |
| OWASP WebGoat | `http://localhost:8080/WebGoat` | 中等 | `guest` / `guest` |
| DVWA | `http://localhost:8081` | 简单 | `admin` / `password` |
| bWAPP | `http://localhost:8082` | 中等 | `bee` / `bug` |

启动前请确保：
- Docker Desktop 已安装并运行
- 端口 `3000`、`8080`、`8081`、`8082` 未被占用
- 靶场仅在本地环境使用，**切勿暴露到公网**

详细说明见 [靶场说明文档](docs/labs/docker-labs.md)。

## APK 打包

```bat
scripts\build-apk.bat
```

脚本依次执行：
1. 前端构建（`npm run build`）
2. Capacitor 同步（`npx cap sync`）
3. Gradle 打包（`gradlew assembleRelease`）

产物路径：`android/app/build/outputs/apk/release/*.apk`

> **注意**：APK 模式下数据存储在手机本地（localStorage），换设备或卸载后数据不保留。需要 Android SDK 和 Gradle 环境。

## 已知注意事项

1. **前端代理与后端端口必须一致**：`vite.config.ts` 中 `/api` 代理目标写死为 `http://localhost:3003`，后端 `server.js` 默认端口为 `process.env.PORT || 3002`。如果不配置 `.env` 中的 `PORT=3003`，代理请求会打到错误的端口。
2. **数据存储是本地 JSON 文件**（`backend/data/database.json`），不适合并发访问，不可用于生产环境。
3. **JWT 存储在浏览器 `localStorage`**，仅适用于本地学习场景，存在 XSS 风险。
4. **靶场容器安全边界**：所有靶场容器均包含已知漏洞，只能在本地隔离网络（`cisp-lab-network`）中运行，严禁暴露到公网。
5. **Docker 靶场启停通过 `powershell` 执行**（`backend/lib/dockerLabs.js`），在非 Windows 环境需自行适配为 `bash`。
6. **生产模式**：后端 `server.js` 本身已支持一体化部署（API + 静态文件服务），构建前端后直接 `node backend/server.js` 即可通过后端端口访问完整应用。

## 文档索引

- [文档导航](docs/README.md) — 全部文档入口
- [环境说明](docs/setup/environment.md) — 前后端启动、端口关系、Docker 依赖、Android 打包前置
- [架构总览](docs/architecture/overview.md) — 前端、后端、JSON 存储、Docker 靶场、Capacitor 关系
- [接口文档](docs/backend/api.md) — 认证、进度、靶场接口及返回结构
- [靶场说明](docs/labs/docker-labs.md) — 容器列表、启动方式、排障建议、安全边界

## 常用命令

```bash
# 前端开发
npm run dev              # 启动 Vite 开发服务器（5173）
npm run build            # 生产构建
npm run check            # TypeScript 类型检查
npm run lint             # ESLint 检查
npm run preview          # 预览生产构建

# 后端
cd backend && npm run dev   # 启动后端（3003）
```
