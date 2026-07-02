# 搭建WebGoat靶场过程及遇见的问题

> 本文档存放于 docs/labs 目录中

## 一、搭建过程

### 1.1 靶场说明
WebGoat + WebWolf 配套靶场（OWASP 官方安全教学靶场）

### 1.2 环境信息
- 操作系统：Kali Linux
- IP 地址：192.168.108.128
- 容器运行时：Docker
- 端口映射：
  - WebGoat：宿主机 `8083` → 容器 `8080`
  - WebWolf：宿主机 `9091` → 容器 `9090`

### 1.3 搭建步骤

1. **拉取 Docker 镜像**
   ```bash
   docker pull webgoat/webgoat:latest
   ```
   镜像各层下载成功。期间发现 Maven Aliyun 仓库对应 webgoat-server 2023.8 版本返回 404（版本不匹配），但官方 Docker Hub 镜像本身是完整可用的，不受影响。

2. **后台 nohup 启动容器（自动重启）**
   ```bash
   nohup docker run -d \
     --name webgoat \
     --restart unless-stopped \
     -p 8083:8080 \
     -p 9091:9090 \
     webgoat/webgoat:latest \
     > /tmp/webgoat.log 2>&1 &
   ```

3. **验证启动**
   ```bash
   # 等待 30~60 秒让 Java 服务启动
   sleep 60
   curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8083/WebGoat/
   curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:9091/WebWolf/
   # 预期均返回 200 或 302（跳转登录）
   ```

---

## 二、遇见的问题及解决方案

### 问题 1：Docker Hub bWAPP 镜像拉取超时（与 WebGoat 无关的并行问题）

**现象**：
在尝试同时拉取多个靶场镜像时，某 bWAPP 第三方 Docker Hub 镜像出现拉取超时。

**原因**：
该问题与 WebGoat 本身无关，是另一靶场镜像的网络问题。WebGoat 镜像 `webgoat/webgoat:latest` 本身拉取正常。

**解决方案**：
跳过该 bWAPP 镜像（改用源码方式部署 bWAPP，详见《搭建bWAPP靶场过程及遇见的问题.md》），WebGoat 继续正常部署。

---

### 问题 2：Maven Aliyun webgoat-server 2023.8 版本返回 404

**现象**：
在查阅相关构建文档时发现，Maven Aliyun 镜像仓库中 `webgoat-server 2023.8` 版本返回 404。

**原因**：
版本号不匹配 / Aliyun 镜像同步滞后。

**影响**：
无影响。本次使用的是 Docker Hub 官方预构建镜像 `webgoat/webgoat:latest`，无需本地 Maven 构建，因此该问题不影响部署和使用。

---

## 三、访问地址与验证截图

### 访问地址
```
# WebGoat 主靶场
http://192.168.108.128:8083/WebGoat/

# WebWolf（配套 SSRF / 邮件接收等辅助靶场）
http://192.168.108.128:9091/WebWolf/
```

### 验证截图位置
截图存放于项目 `docs/labs/screenshots/webgoat/` 目录下（如不存在请手动创建并补充截图）：
- `webgoat-login.png`：WebGoat 登录 / 注册页面截图
- `webgoat-dashboard.png`：登录后首页 / 课程列表截图
- `webwolf-home.png`：WebWolf 首页截图
- `docker-ps.png`：`docker ps` 显示 webgoat 容器运行中截图
