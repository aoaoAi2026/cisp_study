# 搭建Vulhub靶场平台过程及遇见的问题

> 本文档存放于 docs/labs 目录中

## 一、搭建过程

### 1.1 平台说明
Vulhub：开源漏洞环境集合，包含 200+ 个漏洞环境，均通过 Docker Compose 一键启动。

### 1.2 现状（已运行的 Vulhub 容器）
Docker 中已正常运行 4 个 Vulhub 官方镜像容器：

| 序号 | 漏洞环境 | 镜像来源 | 宿主机端口 | 状态 |
|------|---------|---------|-----------|------|
| 1 | Tomcat CVE-2017-12615（PUT 上传 RCE） | vulhub 官方镜像 | 8080 | 运行中 |
| 2 | ThinkPHP 5 RCE | vulhub 官方镜像 | 8081 | 运行中 |
| 3 | Struts2 S2-045 RCE | vulhub 官方镜像 | 8082 | 运行中 |
| 4 | Upload-Labs（c0ny1/upload-labs:latest） | 第三方镜像 | 8084 | 运行中 |

Docker Compose 版本：v2.40（可用）

### 1.3 尝试获取 Vulhub Git 仓库的步骤

1. **GitHub.com 直连（失败）**
   ```bash
   git clone https://github.com/vulhub/vulhub.git /opt/vulhub
   ```
   结果：GitHub.com 443 端口连接超时（国内网络出口问题）。

2. **githubfast.com 镜像（失败）**
   ```bash
   git clone https://githubfast.com/vulhub/vulhub.git /opt/vulhub
   ```
   结果：fetch-pack 阶段 EOF，连接中断。

3. **Gitee mirrors/vulhub（失败）**
   ```bash
   git clone https://gitee.com/mirrors/vulhub.git /opt/vulhub
   ```
   结果：仓库体积约 1.3GB，下载速度极慢，超过 300s 阈值后超时终止。

4. **ghproxy 代理镜像（失败）**
   ```bash
   git clone https://ghproxy.com/https://github.com/vulhub/vulhub.git /opt/vulhub
   ```
   结果：同样因仓库过大、带宽不足，下载速度持续 KB/s 级别，无法在合理时间内完成。

### 1.4 临时可用结论
- Vulhub 作为**容器平台级**基础设施：Docker Engine 已在运行，Compose v2.40 可用，4 个核心镜像容器运行正常。
- 用户可进入已有的 Vulhub 单个漏洞目录，使用 `docker compose up -d` 启动对应环境（若仓库文件已存在）。
- Vulhub Git 仓库本身（1.3GB 全量文件）因体积过大+国内网络限制，暂未完整落盘，需后续单独离线下载或选择低峰期尝试。

---

## 二、遇见的问题及解决方案

### 核心问题：Vulhub Git 仓库 1.3GB 过大，国内镜像加速仍超 300s 阈值

**现象**：
- GitHub.com 直连：443 连接超时
- githubfast.com：fetch-pack EOF
- Gitee mirrors：下载 >300s 被超时中断
- ghproxy：速度 KB/s 级别，无法完成

**原因**：
1. Vulhub 仓库包含 200+ 漏洞环境的 Dockerfile、docker-compose.yml、EXP 脚本等，累计体积约 **1.3GB**
2. 国内出口带宽有限，各镜像站对大仓库的克隆均存在瓶颈
3. 300s 超时阈值对 1.3GB 文件来说过于紧张

**解决方案 / 缓解措施**：
1. **核心 Docker 镜像优先**：目前已跑的 4 个核心容器（8080/8081/8082/8084）已可正常使用，覆盖常见中间件漏洞场景
2. **后续建议**：
   - 夜间 / 低峰期重试 git clone
   - 或使用 `git clone --depth=1` 浅克隆（仅最新 commit，体积大幅缩小）
   - 或从国内网盘 / 离线介质获取 Vulhub 仓库压缩包
   - 单个漏洞环境可直接 `docker pull` 对应镜像 + 手写 docker-compose.yml 启动，无需完整仓库

---

## 三、访问地址与验证截图

### 已运行的 4 个环境访问地址
```
# Tomcat CVE-2017-12615
http://192.168.108.128:8080/

# ThinkPHP 5 RCE
http://192.168.108.128:8081/

# Struts2 S2-045
http://192.168.108.128:8082/

# Upload-Labs
http://192.168.108.128:8084/
```

### 验证截图位置
截图存放于项目 `docs/labs/screenshots/vulhub/` 目录下（如不存在请手动创建并补充截图）：
- `docker-ps-4-containers.png`：`docker ps` 显示 4 个 Vulhub 容器 UP 状态截图
- `tomcat-8080.png`：Tomcat CVE-2017-12615 首页截图
- `thinkphp-8081.png`：ThinkPHP 5 RCE 测试页面截图
- `struts2-8082.png`：Struts2 S2-045 首页截图
- `git-clone-timeout.png`：git clone 超时报错截图（可选）
