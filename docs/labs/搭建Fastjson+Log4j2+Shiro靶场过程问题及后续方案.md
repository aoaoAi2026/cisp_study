# 搭建Fastjson + Log4j2 + Shiro + Nginx 靶场过程问题及后续方案

> 本文档存放于 docs/labs 目录中
>
> 覆盖靶场：Day100 Fastjson、Day101 Log4j2 CVE-2021-44228、Day102 Shiro CVE-2016-4437、Day103 Nginx 解析漏洞

---

## 一、当前问题概述

### 1.1 问题根因
Vulhub Git 仓库（包含 Fastjson、Log4j2、Shiro、Nginx 等 200+ 漏洞环境的 Docker Compose 配置）总大小约 **1.3GB**，因国内网络出口带宽限制，从 GitHub.com / githubfast.com / Gitee mirrors / ghproxy 等任一渠道 clone 均超过 **300s 超时阈值**，未能完整落盘到 `/opt/vulhub/`。

### 1.2 当前可用基础
- Docker Engine 正常运行
- Docker Compose v2.40 可用
- 已有 4 个 Vulhub 独立镜像容器运行中（8080/8081/8082/8084），证明 Docker 镜像层拉取本身无问题
- **关键结论**：无需等待 1.3GB 全仓库 clone 完成，4 个靶场均可通过 `docker pull` 对应镜像 + 手写 `docker-compose.yml` 单独启动

---

## 二、Vulhub 仓库完整时的标准启动方式（参考）

待 Vulhub 仓库完整落盘后，标准一键启动命令如下（留作未来参考）：

```bash
# 假设 Vulhub 仓库完整位于 /opt/vulhub/

# ── Fastjson 1.2.24 RCE ──────────────────────────────────────
cd /opt/vulhub/fastjson/1.2.24-rce
docker compose up -d
# 访问 http://<Kali-IP>:8090

# ── Fastjson 1.2.47 RCE ──────────────────────────────────────
cd /opt/vulhub/fastjson/1.2.47-rce
docker compose up -d

# ── Log4j2 CVE-2021-44228 ────────────────────────────────────
cd /opt/vulhub/log4j/CVE-2021-44228
docker compose up -d
# 访问 http://<Kali-IP>:8983（Solr 面板）

# ── Shiro 反序列化 CVE-2016-4437 ─────────────────────────────
cd /opt/vulhub/shiro/CVE-2016-4437
docker compose up -d
# 访问 http://<Kali-IP>:8080

# ── Nginx 解析漏洞（nginx_parsing_vulnerability） ─────────────
cd /opt/vulhub/nginx/nginx_parsing_vulnerability
docker compose up -d
# 访问 http://<Kali-IP>:8080/uploadfiles/

# ── Nginx 配置错误（insecure-configuration） ──────────────────
cd /opt/vulhub/nginx/insecure-configuration
docker compose up -d
```

> 说明：各环境端口以实际 `docker-compose.yml` 中 `ports` 映射为准，若与现有 8080/8081/8082/8083/8084/9091 冲突需调整。

---

## 三、无需 Vulhub 仓库的「独立 Docker 启动方案」（推荐优先执行）

以下方案绕过 Vulhub 仓库依赖，直接使用 Docker Hub 官方镜像 + 手写 Compose 文件启动。

### 方案 A：Fastjson 反序列化靶场（手动 Compose）

```bash
# 1. 创建目录
sudo mkdir -p /opt/labs-manual/fastjson
cd /opt/labs-manual/fastjson

# 2. 手写 docker-compose.yml（以 1.2.24-rce 为例）
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  fastjson:
    image: vulhub/fastjson:1.2.24
    container_name: fastjson-1.2.24
    restart: unless-stopped
    ports:
      - "8090:8080"
EOF

# 3. 启动
docker compose up -d

# 4. 验证
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8090/
# 预期 200
```

**备用：若 vulhub/fastjson 镜像拉取慢，可直接用 Tomcat + 自行部署 WAR**（参见下方第五节 Tomcat 弱口令 + WAR 上传通用方式，8080 已在跑的 Tomcat CVE-2017-12615 容器也可复用）。

---

### 方案 B：Log4j2 CVE-2021-44228（Solr 靶场）

```bash
sudo mkdir -p /opt/labs-manual/log4j
cd /opt/labs-manual/log4j

cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  solr-log4j:
    image: vulhub/solr:8.11.0
    container_name: solr-log4j-cve-2021-44228
    restart: unless-stopped
    ports:
      - "8983:8983"
    command: ["solr-precreate", "mycore"]
EOF

docker compose up -d

# Solr 启动较慢，等待 90 秒
sleep 90
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8983/solr/
# 预期 200/302
```

---

### 方案 C：Shiro 反序列化 CVE-2016-4437

```bash
sudo mkdir -p /opt/labs-manual/shiro
cd /opt/labs-manual/shiro

cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  shiro:
    image: vulhub/shiro:1.2.4
    container_name: shiro-cve-2016-4437
    restart: unless-stopped
    ports:
      - "8091:8080"
EOF

docker compose up -d

sleep 30
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8091/
# 预期 200/302
```

---

### 方案 D：Nginx 解析漏洞（nginx_parsing_vulnerability）

```bash
sudo mkdir -p /opt/labs-manual/nginx-parsing
cd /opt/labs-manual/nginx-parsing

cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  nginx-parsing:
    image: vulhub/nginx:192.168.108-parsing   # 镜像名按实际 vulhub 名称调整
    container_name: nginx-parsing-vuln
    restart: unless-stopped
    ports:
      - "8092:80"
EOF

# ── 若上面镜像名不对，使用通用 Nginx + PHP 环境手动构造：
# image: php:7.2-fpm + image: nginx:1.15.3 两容器组合
# Nginx 配置中 cgi.fix_pathinfo=1 且 SCRIPT_FILENAME 未正确判断文件存在 → 解析漏洞

docker compose up -d
```

> Nginx 解析漏洞若镜像名不确定，推荐优先复用下方第五节的「通用 Tomcat WAR 部署」方式，或直接用已跑的 8080 Tomcat 做同类型 Java 中间件测试替代。

---

### 方案一键总览（端口规划）

| 靶场 | 独立容器端口 | 镜像名（示例） | 占用状态 |
|------|-------------|---------------|---------|
| Fastjson 1.2.24 RCE | 8090 → 容器 8080 | vulhub/fastjson:1.2.24 | 未启动 |
| Log4j2 CVE-2021-44228 (Solr) | 8983 → 容器 8983 | vulhub/solr:8.11.0 | 未启动 |
| Shiro CVE-2016-4437 | 8091 → 容器 8080 | vulhub/shiro:1.2.4 | 未启动 |
| Nginx 解析漏洞 | 8092 → 容器 80 | vulhub/nginx 系 | 未启动 |

以上端口 8090 / 8091 / 8092 / 8983 均未被现有靶场占用，可直接使用。

---

## 四、「docker pull 单独镜像 + docker run」最简启动版（无需 Compose）

若连 `docker-compose.yml` 也不想写，直接单条命令：

```bash
# Fastjson
docker run -d --name fastjson-1.2.24 --restart unless-stopped -p 8090:8080 vulhub/fastjson:1.2.24

# Log4j2 Solr
docker run -d --name solr-log4j --restart unless-stopped -p 8983:8983 vulhub/solr:8.11.0 solr-precreate mycore

# Shiro
docker run -d --name shiro-cve-2016-4437 --restart unless-stopped -p 8091:8080 vulhub/shiro:1.2.4
```

---

## 五、通用替代方案：Tomcat 弱口令 + WAR 上传部署（已跑的 8080 可复用）

### 5.1 适用场景
- Fastjson、Shiro、Log4j2 等 Java 反序列化靶场本质都是「Java Web 应用 + 存在漏洞的依赖库」
- 若专用镜像拉取失败，**可统一打包成 WAR 上传至已在跑的 Tomcat 8080 容器**（Tomcat CVE-2017-12615 当前已运行于 http://192.168.108.128:8080/）

### 5.2 部署步骤
1. 本地（或 Windows 端）用 Maven/Gradle 构建含漏洞依赖的 Web 应用 WAR 包（如引入 fastjson-1.2.24.jar 作为 WEB-INF/lib 依赖，提供测试用 Controller）
2. 通过 Tomcat Manager App 默认弱口令（或 CVE-2017-12615 PUT 方法）上传 WAR
3. Tomcat 自动解压部署，访问对应 Context Path 即可

### 5.3 示例：Fastjson WAR 部署
```
项目结构:
  fastjson-webapp.war
    └─ WEB-INF/
         ├─ web.xml
         └─ lib/
              └─ fastjson-1.2.24.jar
    └─ test.jsp           # 调用 JSON.parseObject(request.getParameter("data"))
```
部署后访问：
```
http://192.168.108.128:8080/fastjson-webapp/test.jsp?data=<payload>
```

---

## 六、后续落地计划（建议执行顺序）

| 步骤 | 内容 | 耗时估计 | 优先级 |
|------|------|---------|--------|
| 1 | 直接 docker run 启动 Fastjson 8090 | 5 分钟（镜像拉取视网速） | P0 |
| 2 | docker run 启动 Shiro 8091 | 5 分钟 | P0 |
| 3 | docker run 启动 Solr(Log4j2) 8983 | 10 分钟 + 90s 等待 | P1 |
| 4 | Nginx 解析漏洞手动写 Nginx+PHP 双容器或用现成 Nginx 靶场 | 20 分钟 | P1 |
| 5 | 夜间低峰期 `git clone --depth=1 https://githubfast.com/vulhub/vulhub.git` 浅克隆 | 2~4 小时 | P2 |

---

## 七、验证截图位置（启动后请补齐）

截图存放于项目 `docs/labs/screenshots/` 子目录：
- `fastjson/8090-page.png`：Fastjson 8090 端口首页截图
- `log4j/8983-solr.png`：Solr 8983 面板截图
- `shiro/8091-login.png`：Shiro 登录页截图
- `nginx/8092-phpinfo.png`：Nginx 解析漏洞 phpinfo 截图
- `docker-ps-fastjson-shiro-log4j.png`：`docker ps` 新 3~4 个容器 UP 状态
