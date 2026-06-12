# 靶场说明

CISP 学习平台 Docker 靶场容器的完整说明，包含容器列表、启动方式、排障建议和安全边界。

## 容器列表

通过 `docker-compose.yml` 管理，所有容器运行在独立 bridge 网络 `cisp-lab-network` 中。

| 容器 | 镜像 | 内部端口 | 宿主机端口 | 难度 | 默认凭据 |
|------|------|----------|------------|------|----------|
| OWASP Juice Shop | `bkimminich/juice-shop:latest` | 3000 | 3000 | 简单 | `admin@juice-sh.op` / `admin123` |
| OWASP WebGoat | `webgoat/webgoat:latest` | 8080 | 8080 | 中等 | `guest` / `guest` |
| DVWA | `vulnerables/web-dvwa:latest` | 80 | 8081 | 简单 | `admin` / `password` |
| bWAPP | `raesene/bwapp:latest` | 80 | 8082 | 中等 | `bee` / `bug` |

### 各靶场特点

**OWASP Juice Shop**
- 现代化的 Node.js Web 应用，模拟电商网站
- 覆盖：SQL 注入、XSS、CSRF、文件上传、认证绕过、API 安全
- 自带记分板（Score Board），适合初学者

**OWASP WebGoat**
- OWASP 官方 Java 教学平台
- 分章节教学，每章包含理论讲解 + 动手练习
- 覆盖：认证漏洞、会话管理、访问控制、JWT 安全、密码学

**DVWA（Damn Vulnerable Web Application）**
- PHP 编写的经典靶场
- 可调节安全级别（Low / Medium / High / Impossible）
- 覆盖：暴力破解、命令注入、CSRF、文件包含、SQL 注入、XSS

**bWAPP（Buggy Web Application）**
- 包含 100+ 种 Web 漏洞的综合平台
- 覆盖 OWASP Top 10 全部类别
- 漏洞种类最丰富

## 启动方式

### 方式一：前端页面控制（推荐）

1. 确保 Docker Desktop 正在运行
2. 打开前端 → 进入"靶场环境"页面（`/lab-environment`）
3. 点击对应容器的"启动"按钮
4. 等待 30 秒后点击链接访问

### 方式二：命令行手动操作

```bash
# 启动所有容器
docker-compose up -d

# 启动单个容器
docker-compose up -d juice-shop

# 停止所有容器
docker-compose stop

# 停止单个容器
docker-compose stop juice-shop

# 查看容器状态
docker-compose ps

# 查看容器日志
docker-compose logs juice-shop
```

### 方式三：后端 API 调用

```bash
# 启动 Juice Shop
curl -X POST http://localhost:3003/api/labs/start/juice-shop

# 查看所有容器状态
curl http://localhost:3003/api/labs/list

# 停止 Juice Shop
curl -X POST http://localhost:3003/api/labs/stop/juice-shop
```

## 容器命名规则

所有容器名称均带 `cisp-` 前缀，方便与其他 Docker 容器区分：

- `cisp-juice-shop`
- `cisp-webgoat`
- `cisp-dvwa`
- `cisp-bwapp`

## 首次启动注意事项

1. **镜像拉取耗时**：WebGoat 镜像约 1.5GB，首次 `docker-compose up` 需等待较长时间
2. **DVWA 初始化**：DVWA 首次启动后需访问 `http://localhost:8081/setup.php` 创建数据库
3. **WebGoat 启动慢**：Java 应用启动需要 30-60 秒，健康检查通过后方可访问
4. **bWAPP 初始化**：bWAPP 首次访问可能需要执行安装步骤

## 排障建议

### 容器无法启动

```bash
# 检查 Docker 是否运行
docker info

# 检查端口是否被占用
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :8081
netstat -ano | findstr :8082

# 查看容器日志
docker logs cisp-juice-shop
```

### 前端无法连接后端 API

确认 `backend/.env` 中 `PORT=3003`，且后端已启动。前端代理只转发到 `localhost:3003`。

### Docker 命令报错 "docker-compose: command not found"

新版 Docker Desktop 使用 `docker compose`（空格）代替 `docker-compose`（连字符）。如果后端 `lib/dockerLabs.js` 报错，可能需要将命令改为 `docker compose`。

### 靶场页面访问超时

- 确认容器已启动：`docker ps | findstr cisp`
- 部分靶场（WebGoat、bWAPP）启动后需要等待服务就绪
- 检查防火墙是否拦截了对应端口

### DVWA 无法连接数据库

访问 `http://localhost:8081/setup.php`，点击 "Create/Reset Database" 按钮初始化。

### Windows 专有问题

`backend/lib/dockerLabs.js` 中容器启停通过 `powershell` 执行。如果遇到路径相关问题：

```powershell
# 手动测试
cd e:\internal_safe\cisp1\cisp
docker-compose up -d juice-shop
```

## 安全边界

> ⚠️ **重要警告**

1. **所有靶场容器均包含真实的安全漏洞**，专为本地学习设计
2. **严禁将靶场暴露到公网**，容器端口不应被路由器端口转发
3. 容器运行在独立 bridge 网络 `cisp-lab-network` 中，与宿主机网络隔离
4. 建议仅在本地开发环境中使用，不要部署到云服务器
5. 学习结束后及时停止容器：`docker-compose stop`
6. 这些靶场中的攻击技术**仅用于合法的安全测试和学习**，不得用于未授权的渗透测试

### 网络隔离验证

```bash
# 确认网络存在
docker network ls | findstr cisp-lab-network

# 查看网络中的容器
docker network inspect cisp-lab-network
```

## 资源清理

```bash
# 停止并删除所有靶场容器
docker-compose down

# 同时删除镜像（释放磁盘空间）
docker-compose down --rmi all

# 删除网络
docker network rm cisp-lab-network
```
