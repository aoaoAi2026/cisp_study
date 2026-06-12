# 漏洞复现环境搭建

## 1. 常用靶场平台概览

| 平台 | 特点 | 适用场景 |
|------|------|---------|
| **Vulhub** | 基于 Docker Compose 的一键部署，涵盖大量 CVE / 组件 | 批量复现经典 Nday |
| **Vulfocus** | 同样基于 Docker，带 Web 管理界面 | 团队环境 / CTF |
| **DVWA** | PHP/MySQL 经典入门靶场，涵盖 OWASP Top 10 | 新手训练 |
| **Pikachu** | PHP 国产靶场，覆盖常见 Web 漏洞 + 业务逻辑 | 中文友好 / 逻辑漏洞 |
| **BWAPP** | PHP + MySQL，含 100+ 漏洞场景 | 系统教学 |
| **WebGoat** | Java，OWASP 官方教学 | Java 生态 / OWASP 教学 |
| **Bugku** | 在线综合靶场 | CTF 训练 |
| **Root-Me / Hack The Box** | 在线挑战型靶场 | 进阶技巧 / OSCP 风格 |

## 2. Docker 环境准备

### 2.1 安装 Docker 与 Docker Compose

```bash
# Ubuntu / Debian
curl -fsSL https://get.docker.com | bash
sudo usermod -aG docker $USER

# CentOS / RHEL
yum install -y yum-utils device-mapper-persistent-data lvm2
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install -y docker-ce docker-ce-cli containerd.io
systemctl enable --now docker

# Docker Compose (v2 作为插件，随 docker-ce 包安装)
docker compose version
```

### 2.2 配置镜像加速

```bash
# /etc/docker/daemon.json
{
  "registry-mirrors": [
    "https://mirror.gcr.io",
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ],
  "insecure-registries": []
}

systemctl restart docker
```

## 3. Vulhub 部署

### 3.1 克隆与启动

```bash
git clone https://github.com/vulhub/vulhub.git
cd vulhub

# 浏览目录结构
ls
# activemq/  apereo-cas/  cgit/  coldfusion/  confluence/  couchdb/
# discuz/    django/      docker/  drupal/      elasticsearch/  ...

# 举例：启动 ThinkPHP 5.x RCE
cd thinkphp/5-rce
docker compose up -d

# 查看服务端口
docker compose ps
# 通常在 8080 / 80 / 8983 等端口
```

### 3.2 常用 Vulhub 目录速查

| 组件 | 目录 | 对应漏洞 |
|------|------|---------|
| Shiro 反序列化 | `shiro/CVE-2016-4437` | 默认密钥反序列化 |
| ThinkPHP RCE | `thinkphp/5-rce` | 5.0.23 RCE |
| Confluence OGNL | `confluence/CVE-2022-26134` | 未授权 RCE |
| WebLogic | `weblogic/CVE-2017-10271` | XMLDecoder RCE |
| S2-045 | `struts2/s2-045` | Struts2 RCE |
| Spring4Shell | `spring/CVE-2022-22965` | Spring Core RCE |
| Log4j | `log4j/CVE-2021-44228` | Log4Shell RCE |
| Drupal | `drupal/CVE-2018-7600` | Drupalgeddon2 RCE |

### 3.3 使用流程

```bash
# 进入对应 CVE 目录
cd vulhub/confluence/CVE-2022-26134

# 启动环境（首次拉取镜像需要较长时间）
docker compose up -d

# 验证服务启动
docker compose ps
# NAME                ...  STATUS              PORTS
# cve-2022-26134      ...  Up 45 seconds       0.0.0.0:8090->8090/tcp

# 浏览器访问 http://127.0.0.1:8090/

# 使用完毕后关闭
docker compose down

# 清除全部容器与卷（释放空间）
docker compose down -v
```

## 4. DVWA 部署

```bash
# 方式 1：vulhub 官方
cd vulhub/dvwa
docker compose up -d
# 访问 http://127.0.0.1:8081/
# 默认账号 admin / password

# 方式 2：官方 Docker 镜像
docker run -d -p 80:80 vulnerables/web-application-dvwa
# 访问 http://127.0.0.1/

# 方式 3：手动源码部署
git clone https://github.com/digininja/DVWA.git
cp DVWA/config/config.inc.php.dist DVWA/config/config.inc.php
# 修改数据库连接信息，使用 Apache + PHP + MySQL
```

## 5. Pikachu 部署

```bash
# 方式 1：GitHub 官方源码
git clone https://github.com/zhuifengshaonianLanzhe/pikachu.git
# 放到 Apache + PHP 根目录，修改 inc/config.inc.php 配置数据库
# 浏览器访问 http://127.0.0.1/pikachu/install.php 初始化

# 方式 2：Docker 镜像
docker run -d -p 80:80 area39/pikachu
```

## 6. BWAPP 部署

```bash
# Docker 一键启动
docker run -d -p 80:80 raesene/bwapp
# 浏览器访问 http://127.0.0.1/bWAPP/install.php
# 默认账号 bee / bug
```

## 7. 独立 Docker 靶场示例

```bash
# WebGoat
docker run -d -p 8080:8080 webgoat/webgoat-8.0
# 访问 http://127.0.0.1:8080/WebGoat

# SQLi-labs (SQL 注入训练)
docker run -d -p 8080:80 acgpiano/sqli-labs
# 访问 http://127.0.0.1:8080/

# upload-labs (文件上传训练)
git clone https://github.com/c0ny1/upload-labs.git
cd upload-labs
docker compose up -d
```

## 8. 网络隔离与安全建议

1. **单独虚拟网络**：

```bash
docker network create --internal attack-net
# 将靶场容器加入 --network attack-net，防止被外网扫描
```

2. **宿主机防火墙**：

```bash
# 仅允许本机访问
ufw allow in on lo to any port 8080
ufw enable
```

3. **数据持久化**：

```bash
# 如果需要保留数据库 / 配置，显式命名 volume
docker compose down       # 保留 volume
docker compose down -v    # 删除卷
```

4. **镜像更新**：

```bash
git -C vulhub pull
docker compose pull && docker compose up -d
```

## 9. 本地 Windows 靶场环境

在 Windows 上推荐使用 Docker Desktop + WSL2，或直接使用集成包：

- **PHPTStudy / phpStudy**：快速搭建 Apache+PHP+MySQL；
- **XAMPP**：跨平台 Apache 环境；
- **Windows Docker Desktop**：与 Linux 命令一致。

## 10. 复现前的清单

- [ ] 确认漏洞影响版本与靶场版本一致（`docker compose ps` + 查看容器内文件）
- [ ] 阅读对应 PoC / README，明确请求路径与方法
- [ ] 在浏览器手动验证可访问目标页面
- [ ] 使用 Burp Suite 代理观察实际响应
- [ ] 测试失败时：先排查容器日志 `docker compose logs`
- [ ] 记录复现结果（浏览器截图、请求文本、HTTP 文件），便于回顾
