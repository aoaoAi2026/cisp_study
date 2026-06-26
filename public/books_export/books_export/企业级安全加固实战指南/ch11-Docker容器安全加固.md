# 第十一章 Docker容器安全加固

## 11.1 容器安全概述

容器化部署已成为现代应用的主流方式，但容器安全也带来了新的挑战。Docker作为最流行的容器 runtime，其安全加固至关重要。

### 11.1.1 容器安全风险

```
容器安全风险全景：
┌──────────────────────────────────────────────┐
│ 宿主机层面风险                               │
│ ├── Docker daemon配置不安全                  │
│ ├── Docker Socket权限过大                    │
│ ├── 内核漏洞影响容器                         │
│ └── 资源隔离不充分                           │
├──────────────────────────────────────────────┤
│ 镜像层面风险                                 │
│ ├── 镜像包含漏洞                             │
│ ├── 镜像包含恶意软件                         │
│ ├── 敏感信息泄露（密钥、密码）               │
│ ├── 镜像来源不可信                           │
│ └── 镜像过大，攻击面大                       │
├──────────────────────────────────────────────┤
│ 容器运行时风险                               │
│ ├── 容器特权模式运行                         │
│ ├── 挂载敏感宿主目录                         │
│ ├── 网络模式不安全                           │
│ ├── 资源未限制导致DoS                        │
│ ├── 容器逃逸                                 │
│ └── 横向移动                                 │
├──────────────────────────────────────────────┤
│ 编排层面风险                                 │
│ ├── API未授权访问                            │
│ ├── Secret管理不当                           │
│ ├── RBAC权限过大                             │
│ └── 配置错误                                 │
└──────────────────────────────────────────────┘
```

### 11.1.2 容器安全分层模型

```
容器安全七层模型：

第7层：应用安全
├── 应用代码安全
├── 依赖库安全
└── 运行时防护

第6层：容器安全
├── 非root用户运行
├── 只读文件系统
├── 资源限制
└── 安全能力限制

第5层：镜像安全
├── 镜像来源可信
├── 镜像漏洞扫描
├── 镜像签名验证
└── 最小化镜像

第4层：Runtime安全
├── Docker daemon安全
├── seccomp/AppArmor
└── cgroups隔离

第3层：宿主机安全
├── 内核安全加固
├── 系统最小化
└── 主机防护

第2层：网络安全
├── 网络隔离
├── 网络策略
└── TLS加密

第1层：编排安全
├── RBAC权限控制
├── Secret管理
└── 审计日志
```

## 11.2 Docker daemon安全

### 11.2.1 daemon配置加固

```json
// /etc/docker/daemon.json
{
    "icc": false,
    "userns-remap": "default",
    "live-restore": true,
    "userland-proxy": false,
    "no-new-privileges": true,
    "authorization-plugins": [],
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    },
    "storage-driver": "overlay2",
    "storage-opts": [
        "overlay2.override_kernel_check=true"
    ],
    "default-ulimits": {
        "nofile": {
            "Name": "nofile",
            "Hard": 64000,
            "Soft": 64000
        },
        "nproc": {
            "Name": "nproc",
            "Hard": 2048,
            "Soft": 2048
        }
    },
    "seccomp-profile": "/etc/docker/seccomp.json",
    "init": true,
    "oom-score-adjust": -500
}
```

```bash
# 配置说明：
# icc: false - 禁用容器间通信（默认启用，建议禁用）
# userns-remap - 用户命名空间重映射（将容器root映射为宿主机普通用户）
# live-restore - 容器在daemon重启时继续运行
# no-new-privileges - 禁止容器内进程获得新权限
# default-ulimits - 默认资源限制

# 重启Docker使配置生效
systemctl restart docker
```

### 11.2.2 Docker API安全

```bash
# 1. 不要监听TCP端口（默认Unix socket更安全）
# 危险配置：-H tcp://0.0.0.0:2375
# 安全配置：-H unix:///var/run/docker.sock

# 2. 如果必须启用远程API，使用TLS加密和客户端认证
# 生成证书（见后面证书管理章节）
# 配置：
# "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2376"],
# "tls": true,
# "tlscacert": "/etc/docker/ssl/ca.pem",
# "tlscert": "/etc/docker/ssl/server-cert.pem",
# "tlskey": "/etc/docker/ssl/server-key.pem",
# "tlsverify": true

# 3. Docker Socket权限
ls -la /var/run/docker.sock
# 应该是：srw-rw---- 1 root docker
# 只有docker组的用户能访问

# 4. 限制docker组用户
# 只信任的用户加入docker组
gpasswd -a trusted_user docker

# 5. 防火墙保护Docker API端口（如果启用了）
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" port port=2376 protocol=tcp accept'
firewall-cmd --reload
```

### 11.2.3 用户命名空间

```bash
# 启用用户命名空间重映射
# 将容器内的root用户映射到宿主机的非特权用户

# 1. 在daemon.json中启用
# "userns-remap": "default"

# 2. 自定义映射用户
# 创建dockremap用户
useradd -r -s /sbin/nologin dockremap

# 配置subuid和subgid
echo "dockremap:100000:65536" >> /etc/subuid
echo "dockremap:100000:65536" >> /etc/subgid

# daemon.json配置
# "userns-remap": "dockremap"

# 3. 验证
systemctl restart docker
docker info | grep "userns"

# 启动一个测试容器
docker run -d --name test-ns nginx
# 查看宿主机上的进程用户
ps aux | grep nginx
# 应该显示为dockremap用户（UID 100000+）
```

## 11.3 容器运行安全

### 11.3.1 运行时安全最佳实践

```bash
# ❌ 错误的运行方式
docker run -d --name bad-container \
    --privileged \
    --network=host \
    -v /:/host \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -u root \
    nginx

# ✅ 安全的运行方式
docker run -d --name good-container \
    --read-only \
    --tmpfs /tmp \
    --tmpfs /run \
    --user 1000:1000 \
    --cap-drop all \
    --cap-add NET_BIND_SERVICE \
    --security-opt no-new-privileges:true \
    --security-opt seccomp=default \
    --security-opt apparmor=docker-default \
    --memory=512m \
    --cpus=1 \
    --pids-limit=200 \
    --restart=on-failure:5 \
    --network=bridge \
    --name web-app \
    nginx:alpine
```

### 11.3.2 资源限制

```bash
# 内存限制
docker run -d \
    --memory=512m \
    --memory-swap=512m \
    --memory-reservation=384m \
    --oom-kill-disable \
    nginx

# 参数说明：
# --memory: 硬限制，最大可用内存
# --memory-swap: 内存+交换分区总限制（设为与memory相同表示禁用swap）
# --memory-reservation: 软限制，内存压力下尝试限制
# --oom-kill-disable: 禁止OOM杀死容器（谨慎使用）

# CPU限制
docker run -d \
    --cpus=1 \
    --cpuset-cpus=0,1 \
    --cpu-shares=1024 \
    nginx

# 参数说明：
# --cpus: 使用多少个CPU核心
# --cpuset-cpus: 绑定到哪些CPU核心
# --cpu-shares: CPU相对权重（默认1024）

# 进程数限制（防fork炸弹）
docker run -d \
    --pids-limit=200 \
    nginx

# 磁盘限制（需要devicemapper或特定存储驱动支持）
docker run -d \
    --storage-opt size=10G \
    nginx
```

### 11.3.3 内核能力限制

```bash
# 所有能力列表
# man 7 capabilities

# 丢弃所有能力，只添加需要的
docker run -d \
    --cap-drop all \
    --cap-add NET_BIND_SERVICE \
    --cap-add SETUID \
    --cap-add SETGID \
    nginx

# 常用的能力：
# NET_BIND_SERVICE - 绑定到1024以下端口
# SETUID - 设置UID
# SETGID - 设置GID
# CHOWN - 修改文件所有者
# DAC_OVERRIDE - 绕过文件权限检查
# SYS_ADMIN - 广泛的系统管理权限（危险！）
# NET_ADMIN - 网络管理（危险！）
# SYS_PTRACE - 进程跟踪（危险！）

# 检查容器的能力
docker inspect container_name | grep -A 20 CapAdd
docker inspect container_name | grep -A 20 CapDrop

# 查看容器内进程的能力
docker exec -it container_name bash -c 'cat /proc/1/status | grep Cap'
```

### 11.3.4 只读文件系统

```bash
# 只读根文件系统 + tmpfs临时目录
docker run -d \
    --read-only \
    --tmpfs /tmp:rw,noexec,nosuid,size=64m \
    --tmpfs /run:rw,noexec,nosuid,size=64m \
    --tmpfs /var/cache/nginx:rw,nosuid,size=100m \
    nginx

# 参数说明：
# --read-only: 根文件系统只读
# --tmpfs: 挂载临时文件系统（重启后清空）
# rw: 可读写
# noexec: 禁止执行
# nosuid: 禁止setuid
# size: 大小限制

# 使用volume持久化数据
docker run -d \
    --read-only \
    -v app-data:/data \
    --tmpfs /tmp \
    myapp:latest
```

### 11.3.5 非root用户运行

```dockerfile
# Dockerfile中创建非root用户
FROM alpine:latest

# 创建应用用户
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 创建工作目录并设置权限
WORKDIR /app
RUN chown -R appuser:appgroup /app

# 切换到非root用户
USER appuser

# 复制应用文件
COPY --chown=appuser:appgroup . .

# 容器启动命令
CMD ["./myapp"]
```

```bash
# 运行时指定用户
docker run -d \
    --user 1000:1000 \
    myapp:latest

# 检查容器运行用户
docker exec container_name whoami
docker exec container_name id
```

## 11.4 Docker镜像安全

### 11.4.1 最小化镜像

```dockerfile
# ❌ 不好的做法：使用大基础镜像，安装多余包
FROM ubuntu:latest
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    curl \
    wget \
    vim \
    net-tools
COPY . /app
RUN pip install -r requirements.txt
CMD ["python3", "app.py"]

# ✅ 好的做法：多阶段构建 + 最小基础镜像
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.11-alpine
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH

# 非root用户
RUN adduser -D appuser
USER appuser

CMD ["python", "app.py"]
```

### 11.4.2 镜像漏洞扫描

```bash
# Trivy - 简单易用的镜像漏洞扫描器
# 安装
wget https://github.com/aquasecurity/trivy/releases/download/v0.45.0/trivy_0.45.0_Linux-64bit.deb
dpkg -i trivy_0.45.0_Linux-64bit.deb

# 扫描镜像
trivy image nginx:alpine

# 仅显示高危漏洞
trivy image --severity HIGH,CRITICAL nginx:alpine

# 生成HTML报告
trivy image --format html --output report.html nginx:alpine

# CI/CD中使用（失败时返回非0）
trivy image --exit-code 1 --severity CRITICAL myapp:latest

# Docker Scout (Docker官方)
docker scout cves myapp:latest

# Anchore
anchore-cli image add myapp:latest
anchore-cli image vuln myapp:latest all
```

### 11.4.3 镜像签名与验证

```bash
# Docker Content Trust (DCT)
# 启用镜像签名验证
export DOCKER_CONTENT_TRUST=1

# 拉取签名的镜像
docker pull nginx:alpine

# 禁用（临时）
docker pull --disable-content-trust nginx:alpine

# 签名推送镜像
docker trust key generate mykey
docker trust signer add --key mykey.pub myrepo myregistry.com/myrepo
docker push myregistry.com/myrepo:latest

# Cosign (Sigstore项目)
# 安装Cosign
go install github.com/sigstore/cosign/cmd/cosign@latest

# 生成密钥对
cosign generate-key-pair

# 签名镜像
cosign sign --key cosign.key myregistry.com/myimage:latest

# 验证镜像
cosign verify --key cosign.pub myregistry.com/myimage:latest
```

### 11.4.4 敏感信息保护

```dockerfile
# ❌ 错误：在Dockerfile中硬编码密码
FROM python:3.11
ENV DB_PASSWORD=mysecretpassword
ENV API_KEY=abc123secret
COPY . /app
CMD ["python", "app.py"]

# ✅ 正确：使用构建参数（不保留在最终镜像中）
FROM python:3.11
ARG BUILD_TOKEN
RUN curl -H "Authorization: Bearer $BUILD_TOKEN" https://example.com/resource
COPY . /app
CMD ["python", "app.py"]

# 构建时传入（不会出现在镜像历史中）
# docker build --build-arg BUILD_TOKEN=secret_token -t myapp .

# ✅ 运行时传入环境变量
docker run -d \
    -e DB_PASSWORD=mysecretpassword \
    -e API_KEY=abc123secret \
    myapp:latest

# ✅ 更好：使用Docker Secrets（Swarm模式）
# docker secret create db_password ./password_file
# docker service create --name myapp --secret db_password myapp:latest

# 检查镜像历史中的敏感信息
docker history myapp:latest
docker inspect myapp:latest | grep -i env
```

## 11.5 网络安全

### 11.5.1 网络模式选择

```bash
# 网络模式对比：

# 1. bridge（默认，推荐）
# 容器在独立的网络命名空间，通过网桥通信
docker run -d --network bridge nginx

# 2. host（不推荐，共享宿主机网络）
# 危险！容器可以访问宿主机所有网络
# docker run -d --network host nginx

# 3. none（无网络，最安全）
# 适用于不需要网络的容器
docker run -d --network none nginx

# 4. container（共享另一个容器的网络）
docker run -d --name web nginx
docker run -d --network container:web sidecar

# 5. 自定义网络（推荐）
docker network create --driver bridge my-network
docker run -d --network my-network --name app1 nginx
docker run -d --network my-network --name app2 nginx
```

### 11.5.2 自定义网络隔离

```bash
# 创建自定义网络
docker network create \
    --driver bridge \
    --subnet 172.20.0.0/16 \
    --gateway 172.20.0.1 \
    --opt com.docker.network.bridge.name=br-web \
    --opt com.docker.network.bridge.enable_icc=false \
    web-network

# 参数说明：
# --opt com.docker.network.bridge.enable_icc=false
# 禁用容器间通信（icc: inter-container communication）

# 不同网络的容器默认隔离
docker network create front-network
docker network create back-network

# 前端容器只在front-network
docker run -d --name web-front --network front-network nginx

# 后端容器只在back-network
docker run -d --name db-back --network back-network mysql

# 应用容器连接两个网络
docker run -d --name app-server \
    --network front-network \
    myapp:latest

docker network connect back-network app-server
```

### 11.5.3 端口映射安全

```bash
# ❌ 危险：绑定到所有接口（0.0.0.0）
docker run -d -p 0.0.0.0:3306:3306 mysql

# ✅ 安全：绑定到127.0.0.1
docker run -d -p 127.0.0.1:3306:3306 mysql

# ✅ 绑定到特定网卡
docker run -d -p 192.168.1.100:8080:80 nginx

# 查看端口映射
docker port container_name

# 防火墙限制Docker端口
# Docker会自动修改iptables，注意顺序
# 建议使用DOCKER-USER链
iptables -I DOCKER-USER -i eth0 -s 192.168.1.0/24 -j ACCEPT
iptables -I DOCKER-USER -i eth0 -j DROP
```

## 11.6 Docker Compose安全

```yaml
# docker-compose.yml 安全配置示例
version: '3.8'

services:
  web:
    image: nginx:alpine
    restart: on-failure:5
    
    # 用户
    user: "1000:1000"
    
    # 只读文件系统
    read_only: true
    tmpfs:
      - /tmp
      - /run
      - /var/cache/nginx
    
    # 资源限制
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
        reservations:
          cpus: '0.25'
          memory: 128M
    
    # 安全配置
    security_opt:
      - no-new-privileges:true
      - seccomp=default
      - apparmor=docker-default
    
    # 能力
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    
    # 网络
    networks:
      - front-network
    
    # 端口
    ports:
      - "127.0.0.1:8080:80"
    
    # 健康检查
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  db:
    image: mysql:8.0
    restart: unless-stopped
    
    # 环境变量（从.env文件读取）
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    
    # 卷
    volumes:
      - db-data:/var/lib/mysql
    
    # 网络
    networks:
      - back-network
    
    # 不暴露端口
    expose:
      - "3306"
    
    # 资源限制
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M

networks:
  front-network:
    driver: bridge
    internal: false  # 可访问外网
  back-network:
    driver: bridge
    internal: true   # 纯内部网络，不能访问外网

volumes:
  db-data:
    driver: local
```

## 11.7 Docker Bench for Security

```bash
# Docker官方安全审计脚本
# 下载运行
git clone https://github.com/docker/docker-bench-security.git
cd docker-bench-security
sudo sh docker-bench-security.sh

# 输出包含：
# - Host Configuration
# - Docker daemon configuration
# - Docker daemon configuration files
# - Container Images and Build File
# - Container Runtime
# - Docker Security Operations
# - Docker Swarm Configuration
# - Docker Enterprise Configuration

# 常见检查项：
# 1. 宿主机配置
# 2. Docker daemon配置
# 3. 镜像和Dockerfile
# 4. 容器运行时
# 5. 安全运维
# 6. Swarm配置
```

## 11.8 加固检查清单

```
Docker容器安全加固检查清单：

□ Docker daemon安全
  □ 禁用TCP远程API（或启用TLS+客户端认证）
  □ Unix Socket权限正确（660）
  □ 用户命名空间重映射已启用
  □ 容器间通信(icc)已禁用
  □ no-new-privileges已启用
  □ live-restore已启用
  □ 默认ulimit已配置
  □ 日志驱动已配置（带大小限制）

□ 容器运行安全
  □ 非root用户运行
  □ 只读文件系统
  □ 内存限制已配置
  □ CPU限制已配置
  □ 进程数限制已配置
  □ 特权模式未使用
  □ --cap-drop all + 按需添加
  □ seccomp配置已启用
  □ AppArmor/SELinux已启用
  □ 不挂载宿主根目录
  □ 不挂载Docker Socket

□ 镜像安全
  □ 基础镜像来自可信源
  □ 镜像漏洞扫描通过
  □ 镜像签名验证
  □ 最小化镜像（Alpine/slim）
  □ 多阶段构建
  □ 无硬编码密钥密码
  □ 不用latest标签
  □ 定期更新基础镜像

□ 网络安全
  □ 使用自定义网桥网络
  □ 不同服务网络隔离
  □ 端口映射绑定127.0.0.1/内网IP
  □ 不使用host网络
  □ 容器间通信禁用（icc=false）
  □ 内部网络使用internal: true
  □ 防火墙DOCKER-USER链配置

□ 数据安全
  □ 敏感数据用环境变量/Secrets
  □ 不在Dockerfile中硬编码密码
  □ 数据卷权限正确
  □ 敏感卷加密
  □ 备份策略

□ 日志与审计
  □ 容器日志已收集
  □ 日志大小限制
  □ Docker daemon日志开启
  □ 操作审计
  □ 异常告警

□ 宿主机安全
  □ 宿主机最小化安装
  □ 宿主机定期打补丁
  □ 内核安全加固
  □ 宿主机防火墙
  □ 入侵检测/防病毒
```

## 11.9 本章小结

本章全面介绍了Docker容器安全加固：

1. **daemon安全**：配置加固、API安全、用户命名空间
2. **容器运行安全**：资源限制、能力限制、只读文件系统、非root用户
3. **镜像安全**：最小化镜像、漏洞扫描、签名验证、敏感信息保护
4. **网络安全**：网络模式、网络隔离、端口映射安全
5. **Docker Compose**：完整的安全配置示例
6. **安全审计**：Docker Bench for Security检查

下一章将学习Kubernetes集群安全加固。

---

**实战作业：**
1. 运行Docker Bench for Security检查你的环境
2. 将一个应用改造为非root+只读文件系统运行
3. 使用Trivy扫描你常用的镜像，看看有多少漏洞
