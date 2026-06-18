# 环境说明

CISP 学习平台的完整环境依赖、端口关系、启动流程和打包前置要求。

## 基础环境

### 必需

| 工具 | 最低版本 | 用途 |
|------|----------|------|
| Node.js | >= 18 | 前端构建 + 后端运行 |
| npm | >= 9 | 包管理（随 Node.js 自带） |

### 可选

| 工具 | 最低版本 | 用途 |
|------|----------|------|
| Docker Desktop | 最新稳定版 | 运行靶场容器 |
| Android Studio | Hedgehog+ | APK 打包（需 SDK 34+） |
| JDK | 17 | Gradle 构建 APK |
| Git | 任意版本 | 版本管理 |

## 端口分配

项目运行时会占用以下端口，请确保它们未被其他程序使用：

| 端口 | 服务 | 说明 |
|------|------|------|
| `5173` | Vite 开发服务器 | 前端 HMR + 热更新 |
| `3003` | Express 后端 API | 需在 `backend/.env` 中配置 `PORT=3003` |
| `3000` | OWASP Juice Shop | Docker 靶场容器 |
| `8080` | OWASP WebGoat | Docker 靶场容器 |
| `8081` | DVWA | Docker 靶场容器 |
| `8082` | bWAPP | Docker 靶场容器 |
| `9090` | WebGoat 管理端口 | Docker 内部通信 |

### 端口关系与代理链路

```
浏览器 → http://localhost:5173 (Vite 前端)
              │
              ├─ /api/* ──→ http://localhost:3003 (Express 后端)
              │                  │
              │                  ├─ /api/health
              │                  ├─ /api/auth/*
              │                  ├─ /api/progress/*
              │                  └─ /api/labs/*
              │
              └─ 其他路径 → Vite 静态服务 (React SPA)
```

> ⚠️ **关键配置差异**：前端代理目标在 `vite.config.ts` 中写死为 `http://localhost:3003`。而后端 `server.js` 的默认端口是 `process.env.PORT || 3002`。如果不配置 `.env` 文件或其中未设置 `PORT=3003`，后端将监听 3002，前端代理请求将全部失败。

## 依赖安装

### 前端

```bash
# 在 cisp/ 根目录执行
npm install
```

主要依赖：React 18、React Router 7、Zustand、Tailwind CSS、Recharts、Framer Motion、Monaco Editor。

### 后端

```bash
cd backend
npm install
```

主要依赖：Express 4、jsonwebtoken、bcryptjs、cors、dotenv。

## 环境变量配置

### 后端 `.env`

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件：

```env
PORT=3003
JWT_SECRET=替换为一个强随机字符串
```

| 变量 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `PORT` | 否 | `3002` | 后端监听端口。**必须与 `vite.config.ts` 代理目标一致（3003）** |
| `JWT_SECRET` | 是 | 内置 fallback | JWT 签名密钥，生产环境必须替换为强随机字符串 |

> `DB_PATH` 变量曾出现在历史 `.env` 中，但当前代码未使用，数据文件路径硬编码为 `backend/data/database.json`。

### 前端无需 `.env`

前端配置集中在 `vite.config.ts` 中，主要是开发服务器端口（5173）和 API 代理目标（3003）。

## 启动流程

### 开发模式

```bash
# 终端 1：启动后端
cd backend
npm run dev
# → 输出：CISP 服务已启动（前端+后端一体化）
# → 监听端口：http://localhost:3003

# 终端 2：启动前端
npm run dev
# → Vite 开发服务器：http://localhost:5173
```

### Windows 一键启动

```powershell
# 终端1: 启动后端
cd backend
npm start

# 终端2: 启动前端
npm run dev
```

手动启动步骤：
1. 确保 Node.js 已安装
2. 安装依赖: `npm install && cd backend && npm install`
3. 在一个终端启动后端: `cd backend && npm start`
4. 在另一个终端启动前端: `npm run dev`

### 生产模式（一体化部署）

后端 `server.js` 已支持 API + 静态文件一体化服务：

```bash
# 1. 构建前端
npm run build

# 2. 启动后端（自动托管 dist/）
cd backend
npm run dev
# → 访问 http://localhost:3003 即可使用完整应用
```

## Docker 环境

### 安装

- Windows / macOS：安装 [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Linux：安装 Docker Engine + Docker Compose

### 验证

```bash
docker --version
docker-compose --version
```

### 靶场网络

所有靶场容器运行在独立的 bridge 网络 `cisp-lab-network` 中，与宿主机网络隔离。

### 已知限制

- 后端 `lib/dockerLabs.js` 中的容器启停命令通过 `powershell` 执行，**仅支持 Windows**
- 在 macOS / Linux 上需修改 `execPromise` 中的命令为对应的 shell 语法
- 部分靶场镜像较大（如 WebGoat > 1GB），首次拉取需较长时间

## Android 打包前置

### 必需环境

| 组件 | 说明 |
|------|------|
| Android Studio | 提供 SDK Manager 和模拟器 |
| Android SDK 34+ | `compileSdkVersion` 要求 |
| JDK 17 | Gradle 8.x 要求 |
| Gradle | 通过 `android/gradlew` 自动下载 |

### 环境变量（Windows）

通常 Android Studio 会自动配置，如需手动设置：

```
ANDROID_HOME=C:\Users\<用户名>\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
```

### 打包步骤

```bat
scripts\build-apk.bat
```

详细流程：
1. `npm run build` — 前端生产构建 → `dist/`
2. `npx cap sync` — 同步 Web 资源到 `android/`
3. `gradlew assembleRelease` — Gradle 构建 release APK

### 注意事项

- APK 模式下无后端服务，所有数据存储在手机 localStorage
- 换设备或卸载应用后数据不保留
- 首次构建需下载 Gradle 和 Android 依赖，耗时较长
- 需要有效的 `android/local.properties` 指向正确的 SDK 路径

## 常见问题

### Q: 前端页面能打开但 API 请求全部失败

检查 `backend/.env` 中 `PORT` 是否为 `3003`。如果未配置，后端会回退到 `3002`，与前端代理目标不一致。

### Q: 端口被占用

```bash
# Windows 查看端口占用
netstat -ano | findstr :3003

# 修改后端端口（需同步修改 vite.config.ts 代理目标）
```

### Q: Docker 靶场启动失败

参见 [靶场说明文档](../labs/docker-labs.md) 的排障建议章节。

### Q: APK 构建失败

- 检查 `android/local.properties` 中 SDK 路径是否正确
- 确认 JDK 版本为 17（`java -version`）
- 首次构建建议在 Android Studio 中打开 `android/` 目录同步一次
