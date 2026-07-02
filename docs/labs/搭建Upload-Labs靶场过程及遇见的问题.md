# 搭建Upload-Labs靶场过程及遇见的问题

> 本文档存放于 docs/labs 目录中

## 一、搭建过程

### 1.1 靶场来源
Docker Hub 官方镜像：`c0ny1/upload-labs:latest`

### 1.2 环境信息
- 操作系统：Kali Linux
- IP 地址：192.168.108.128
- 容器运行时：Docker
- 宿主机端口映射：`8084 → 容器 80`

### 1.3 搭建步骤

1. **拉取 Docker 镜像**
   ```bash
   docker pull c0ny1/upload-labs:latest
   ```

2. **启动容器（后台运行，自动重启）**
   ```bash
   docker run -d \
     --name upload-labs \
     --restart unless-stopped \
     -p 8084:80 \
     c0ny1/upload-labs:latest
   ```

3. **验证服务**
   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8084
   # 预期输出：200
   ```
   返回 HTTP 200 → 验证成功。

---

## 二、遇见的问题及解决方案

无。本次搭建过程顺利，Docker Hub 镜像拉取正常，容器启动一次成功，无报错。

---

## 三、访问地址与验证截图

### 访问地址
```
http://192.168.108.128:8084/
```

### 验证截图位置
截图存放于项目 `docs/labs/screenshots/upload-labs/` 目录下（如不存在请手动创建并补充截图）：
- `homepage-200.png`：Upload-Labs 首页截图（HTTP 200）
- `docker-ps.png`：`docker ps` 命令显示 upload-labs 容器 UP 状态截图
