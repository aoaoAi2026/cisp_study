# 第7章 Vulhub漏洞环境搭建

## 7.1 Vulhub简介

Vulhub是一个基于Docker和Docker-compose的漏洞环境集合，它为网络安全从业者和爱好者提供了一个简单易用的漏洞练习平台。Vulhub项目包含了大量常见的Web应用、中间件、数据库等漏洞环境，每个漏洞环境都有独立的docker-compose.yml配置文件，使用者只需一条命令即可启动一个完整的漏洞环境。

### 7.1.1 Vulhub的特点

- **一键启动**：每个漏洞环境都有对应的docker-compose.yml文件，使用docker-compose up -d即可启动
- **环境隔离**：基于Docker容器技术，各个漏洞环境相互隔离，互不影响
- **丰富的漏洞库**：包含数百个常见漏洞环境，涵盖Web应用、中间件、数据库、CMS等多种类型
- **持续更新**：社区活跃，漏洞环境持续更新，紧跟最新漏洞趋势
- **学习友好**：每个漏洞环境都有详细的说明文档，包含漏洞原理、利用方法等

### 7.1.2 适用人群

- 网络安全初学者：快速搭建漏洞环境，进行漏洞学习和实践
- 渗透测试工程师：练习渗透测试技巧，验证漏洞利用方法
- 安全研究人员：研究漏洞原理，开发漏洞检测工具
- CTF选手：练习CTF常见题型，提升解题能力

---

## 7.2 【通用】环境准备 - Docker安装

### 步骤1：检查Docker是否已安装

**操作位置**：终端 / PowerShell

**执行命令**：

```bash
# 检查Docker版本
docker --version

# 检查docker-compose版本
docker-compose --version
```

**预期输出**：

```
Docker version 24.0.x, build xxxxx
docker-compose version v2.20.x, build xxxxx
```

如果未安装，请根据操作系统选择对应的安装方式。

---

### 步骤2：【Linux环境】安装Docker（Ubuntu/Debian）

**操作位置**：Linux终端

**执行命令**：

```bash
# 更新系统包
sudo apt update

# 安装必要依赖
sudo apt install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common

# 添加Docker官方GPG密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 添加Docker软件源
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# 启动Docker服务
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
sudo docker --version
```

**预期输出**：

```
Docker version 24.0.x, build xxxxx
```

---

### 步骤3：【Linux环境】安装Docker（CentOS/RHEL）

**操作位置**：Linux终端

**执行命令**：

```bash
# 安装必要依赖
sudo yum install -y yum-utils

# 添加Docker软件源
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装Docker
sudo yum install -y docker-ce docker-ce-cli containerd.io

# 启动Docker服务
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
sudo docker --version
```

**预期输出**：

```
Docker version 24.0.x, build xxxxx
```

---

### 步骤4：【Windows环境】安装Docker Desktop

**操作位置**：Windows系统

**执行操作**：

1. **启用WSL 2**（Windows Subsystem for Linux）：
   ```powershell
   # 以管理员身份打开PowerShell
   wsl --install
   ```

2. **下载Docker Desktop**：
   - 访问 https://www.docker.com/products/docker-desktop/
   - 下载Windows版本的Docker Desktop安装程序

3. **安装Docker Desktop**：
   - 运行下载的安装程序
   - 确保勾选"Use WSL 2 instead of Hyper-V"选项
   - 按向导完成安装

4. **启动Docker Desktop**：
   - 从开始菜单启动Docker Desktop
   - 等待Docker引擎启动完成（托盘图标显示绿色）

5. **验证安装**：
   ```powershell
   # 打开PowerShell
   docker --version
   docker-compose --version
   ```

**预期输出**：

```
Docker version 24.0.x, build xxxxx
docker-compose version v2.20.x, build xxxxx
```

---

### 步骤5：【Linux环境】配置Docker镜像加速

**操作位置**：Linux终端

**执行命令**：

```bash
# 创建Docker配置目录
sudo mkdir -p /etc/docker

# 配置镜像加速器
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.ccs.tencentyun.com"
  ]
}
EOF

# 重启Docker服务
sudo systemctl daemon-reload
sudo systemctl restart docker

# 验证配置
docker info | grep -A 10 "Registry Mirrors"
```

**预期输出**：

```
  Registry Mirrors:
    https://docker.mirrors.ustc.edu.cn/
    https://hub-mirror.c.163.com/
    https://mirror.ccs.tencentyun.com/
```

---

### 步骤6：【Linux环境】将用户加入docker组

**操作位置**：Linux终端

**执行命令**：

```bash
# 将当前用户加入docker组
sudo usermod -aG docker $USER

# 使配置生效
newgrp docker

# 验证（不需要sudo）
docker ps
```

**预期输出**：

```
CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
```

---

### 步骤7：验证Docker安装

**操作位置**：终端 / PowerShell

**执行命令**：

```bash
# 运行测试容器
sudo docker run hello-world

# 列出容器
sudo docker ps -a
```

**预期输出**：

```
Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```

---

## 7.3 【通用】下载Vulhub项目

### 步骤1：下载Vulhub源码

**操作位置**：终端

**执行命令**：

```bash
# 创建目录并进入
sudo mkdir -p /opt/vulhub
cd /opt/vulhub

# 方法1：使用Git克隆（推荐）
sudo git clone https://github.com/vulhub/vulhub.git .

# 方法2：使用Gitee镜像（国内加速）
# sudo git clone https://gitee.com/pocyy/vulhub.git .

# 方法3：下载ZIP包
# sudo wget https://github.com/vulhub/vulhub/archive/refs/heads/master.zip
# sudo unzip master.zip
# sudo mv vulhub-master/* .
```

**预期输出**：

```
Cloning into '.'...
remote: Enumerating objects: 100% (XX/XX), done.
Receiving objects: 100% (XX/XX), XX.XX MiB | XX.XX MiB/s, done.
```

---

### 步骤2：查看Vulhub目录结构

**操作位置**：终端

**执行命令**：

```bash
cd /opt/vulhub
ls -la

# 查看漏洞分类目录
ls -la | head -30
```

**预期输出**：

```
total XX
drwxr-xr-x   XX  XX .
drwxr-xr-x   XX  XX ..
drwxr-xr-x   XX  XX activemq/
drwxr-xr-x   XX  XX apache-tomcat/
drwxr-xr-x   XX  XX confluence/
drwxr-xr-x   XX  XX couchdb/
drwxr-xr-x   XX  XX drupal/
drwxr-xr-x   XX  XX elasticsearch/
drwxr-xr-x   XX  XX fastjson/
drwxr-xr-x   XX  XX flink/
drwxr-xr-x   XX  XX ghostscript/
drwxr-xr-x   XX  XX gitlab/
drwxr-xr-x   XX  XX jackson/
drwxr-xr-x   XX  XX jboss/
drwxr-xr-x   XX  XX jenkins/
drwxr-xr-x   XX  XX joomla/
drwxr-xr-x   XX  XX kibana/
drwxr-xr-x   XX  XX laravel/
drwxr-xr-x   XX  XX log4j/
...
```

---

## 7.4 【Docker】启动漏洞环境

### 7.4.1 启动环境的基本流程

**操作位置**：终端

**执行命令**：

```bash
# 进入漏洞目录
cd /opt/vulhub/[漏洞名称]/[漏洞编号]

# 查看README文档（了解漏洞详情）
cat README.md

# 启动环境
sudo docker-compose up -d

# 查看容器状态
sudo docker-compose ps

# 查看容器日志（如启动失败）
sudo docker-compose logs
```

---

### 7.4.2 Struts2 S2-045漏洞环境

**操作位置**：终端

**执行命令**：

```bash
# 进入漏洞目录
cd /opt/vulhub/struts2/s2-045

# 查看README
cat README.md

# 启动环境
sudo docker-compose up -d

# 查看状态
sudo docker-compose ps
```

**预期输出**：

```
NAME         IMAGE               COMMAND                  SERVICE   CREATED        STATUS          PORTS
struts2      vulhub/struts2:2.3   "docker-entrypoint…"    app      XX seconds ago Up XX seconds   0.0.0.0:8080->8080/tcp
```

**访问地址**：`http://your-ip:8080`

---

### 7.4.3 ThinkPHP 5.x远程代码执行漏洞

**操作位置**：终端

**执行命令**：

```bash
# 进入漏洞目录
cd /opt/vulhub/thinkphp/5-rce

# 启动环境
sudo docker-compose up -d

# 查看状态
sudo docker-compose ps
```

**预期输出**：

```
NAME       IMAGE                 COMMAND                  SERVICE   CREATED        STATUS          PORTS
thinkphp   vulhub/thinkphp:5    "docker-entrypoint…"     app      XX seconds ago Up XX seconds   0.0.0.0:8080->8080/tcp
```

**访问地址**：`http://your-ip:8080`

**验证漏洞**：

```bash
# 访问首页
curl http://localhost:8080

# 执行phpinfo测试
curl http://localhost:8080/?s=index/\think\app/invokefunction&function=phpinfo
```

---

### 7.4.4 Redis未授权访问漏洞

**操作位置**：终端

**执行命令**：

```bash
# 进入漏洞目录
cd /opt/vulhub/redis/4-unacc

# 启动环境
sudo docker-compose up -d

# 查看状态
sudo docker-compose ps
```

**预期输出**：

```
NAME    IMAGE         COMMAND                  SERVICE   CREATED        STATUS          PORTS
redis   redis:4      "docker-entrypoint…"    redis    XX seconds ago Up XX seconds   0.0.0.0:6379->6379/tcp
```

**测试连接**：

```bash
# 直接连接Redis（无需密码）
redis-cli

# 或使用docker exec
sudo docker exec -it vulhub-redis-4-unacc-1 redis-cli

# 执行测试命令
redis-cli ping
```

**预期输出**：

```
PONG
```

---

### 7.4.5 Drupal CVE-2018-7600漏洞

**操作位置**：终端

**执行命令**：

```bash
# 进入漏洞目录
cd /opt/vulhub/drupal/CVE-2018-7600

# 启动环境
sudo docker-compose up -d

# 查看状态
sudo docker-compose ps
```

**预期输出**：

```
NAME     IMAGE                  COMMAND                  SERVICE   CREATED        STATUS          PORTS
drupal   vulhub/drupal:8.5    "docker-entrypoint…"    app      XX seconds ago Up XX seconds   0.0.0.0:8080->80/tcp
```

**访问地址**：`http://your-ip:8080`

---

### 7.4.6 Log4j CVE-2021-44228漏洞（Log4Shell）

**操作位置**：终端

**执行命令**：

```bash
# 进入漏洞目录
cd /opt/vulhub/log4j/CVE-2021-44228

# 启动环境
sudo docker-compose up -d

# 查看状态
sudo docker-compose ps
```

**预期输出**：

```
NAME      IMAGE              COMMAND                  SERVICE   CREATED        STATUS          PORTS
log4j     vulhub/log4j:2    "java -jar app.jar…"    app      XX seconds ago Up XX seconds   0.0.0.0:8983->8983/tcp
```

**访问地址**：`http://your-ip:8983`

---

### 7.4.7 停止漏洞环境

**操作位置**：终端

**执行命令**：

```bash
# 进入漏洞目录
cd /opt/vulhub/[漏洞名称]/[漏洞编号]

# 停止并删除容器
sudo docker-compose down

# 如果想删除镜像（释放空间）
sudo docker-compose down --rmi all
```

**预期输出**：

```
Stopping app ... done
Removing app ... done
Network vulhub_default removed
```

---

## 7.5 【Docker】Vulhub常用漏洞环境分类

### 7.5.1 Web服务器漏洞

| 漏洞名称 | CVE | 路径 | 端口 | 说明 |
|----------|-----|------|------|------|
| Apache Struts2 S2-045 | CVE-2017-5638 | struts2/s2-045 | 8080 | Jakarta Multipart解析器OGNL注入 |
| Apache Struts2 S2-057 | CVE-2018-11776 | struts2/s2-057 | 8080 | 命名空间OGNL注入 |
| Nginx解析漏洞 | - | nginx/nginx_parsing_vulnerability | 80 | Nginx文件解析漏洞 |
| Nginx CVE-2013-4547 | CVE-2013-4547 | nginx/CVE-2013-4547 | 80 | 路径截断解析漏洞 |
| Tomcat PUT上传 | CVE-2017-12615 | tomcat/CVE-2017-12615 | 8080 | PUT方法上传任意文件 |
| Tomcat弱口令 | - | tomcat/tomcat8 | 8080 | Manager应用弱口令 |

---

### 7.5.2 CMS漏洞

| 漏洞名称 | CVE | 路径 | 端口 | 说明 |
|----------|-----|------|------|------|
| WordPress 4.6 RCE | CVE-2016-10033 | wordpress/pwnscriptum | 8080 | PHPMailer命令注入 |
| Drupal 7 SQL注入 | CVE-2014-3704 | drupal/CVE-2014-3704 | 8080 | Drupalgeddon1 |
| Drupal 8 RCE | CVE-2018-7600 | drupal/CVE-2018-7600 | 8080 | Drupalgeddon2 |
| Joomla SQL注入 | CVE-2017-8917 | joomla/3.7.0-sql | 8080 | 组件过滤不严 |

---

### 7.5.3 数据库漏洞

| 漏洞名称 | CVE | 路径 | 端口 | 说明 |
|----------|-----|------|------|------|
| Redis未授权访问 | - | redis/4-unacc | 6379 | 无密码认证 |
| MongoDB未授权访问 | - | mongodb/2.6.8-unacc | 27017 | 默认无认证 |
| Elasticsearch RCE | CVE-2015-1427 | elasticsearch/CVE-2015-1427 | 9200 | Groovy脚本RCE |
| MySQL UDF提权 | - | mysql/UDF | 3306 | 用户自定义函数 |

---

### 7.5.4 Java组件漏洞

| 漏洞名称 | CVE | 路径 | 端口 | 说明 |
|----------|-----|------|------|------|
| Shiro RCE | CVE-2016-4437 | shiro/CVE-2016-4437 | 8080 | Apache Shiro反序列化 |
| Fastjson 1.2.24 RCE | - | fastjson/1.2.24-rce | 8090 | Fastjson反序列化 |
| Fastjson 1.2.47 RCE | - | fastjson/1.2.47-rce | 8090 | autotype绕过 |
| Jackson反序列化 | - | jackson/CVE-2019-12384 | 8080 | JNDI注入 |
| Log4j Log4Shell | CVE-2021-44228 | log4j/CVE-2021-44228 | 8983 | JNDI注入RCE |

---

### 7.5.5 开发框架漏洞

| 漏洞名称 | CVE | 路径 | 端口 | 说明 |
|----------|-----|------|------|------|
| ThinkPHP 2.x RCE | - | thinkphp/2-rce | 8080 | 框架RCE |
| ThinkPHP 5.x RCE | - | thinkphp/5-rce | 8080 | 路由RCE |
| Spring RCE | CVE-2022-22965 | spring/CVE-2022-22965 | 8080 | Spring4Shell |
| Flask SSTI | - | flask/ssti | 8000 | Jinja2模板注入 |

---

## 7.6 【Docker】Vulhub常用命令

### 启动/停止命令

```bash
# 启动环境
cd /opt/vulhub/[漏洞目录]
sudo docker-compose up -d

# 停止环境
sudo docker-compose down

# 停止并删除镜像
sudo docker-compose down --rmi all

# 重启环境
sudo docker-compose restart

# 查看日志
sudo docker-compose logs -f
```

---

### 查看命令

```bash
# 查看运行中的容器
sudo docker ps

# 查看所有容器（包括已停止）
sudo docker ps -a

# 查看容器详细信息
sudo docker inspect [容器名]

# 进入容器内部
sudo docker exec -it [容器名] /bin/bash

# 查看镜像
sudo docker images
```

---

### 清理命令

```bash
# 删除已停止的容器
sudo docker container prune

# 删除未使用的镜像
sudo docker image prune

# 删除所有未使用的Docker资源
sudo docker system prune

# 完全清理（包括卷）
sudo docker system prune -a --volumes
```

---

### 批量操作

```bash
# 批量启动所有Vulhub容器（不推荐，同时运行太多）
cd /opt/vulhub
for dir in */*/; do
    cd "$dir"
    sudo docker-compose up -d
    cd /opt/vulhub
done

# 一键清理所有Vulhub容器
sudo docker ps -a --filter "name=vulhub" -q | xargs -r sudo docker rm -f

# 查看Vulhub占用的资源
sudo docker stats $(sudo docker ps -a --filter "name=vulhub" -q)
```

---

## 7.7 【Docker】自定义漏洞环境

### 修改端口映射

**操作位置**：终端

**执行命令**：

```bash
# 编辑docker-compose.yml
cd /opt/vulhub/[漏洞目录]
sudo nano docker-compose.yml
```

**修改示例**：

```yaml
services:
  app:
    image: vulhub/struts2:2.3
    ports:
      - "8888:8080"  # 左边是宿主机端口，右边是容器端口
```

---

### 修改环境变量

**操作位置**：终端

**执行命令**：

```bash
# 编辑docker-compose.yml
sudo nano docker-compose.yml
```

**修改示例**：

```yaml
services:
  app:
    image: vulhub/wordpress:4.6
    environment:
      - WORDPRESS_DB_HOST=db:3306
      - WORDPRESS_DB_USER=root
      - WORDPRESS_DB_PASSWORD=custom_password
      - WORDPRESS_DB_NAME=wordpress
```

---

### 资源限制

**操作位置**：终端

**执行命令**：

```bash
# 编辑docker-compose.yml
sudo nano docker-compose.yml
```

**添加资源限制**：

```yaml
services:
  app:
    image: vulhub/struts2:2.3
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

---

## 7.8 【Docker】离线环境使用Vulhub

### 步骤1：在有网络的环境中下载镜像

**操作位置**：有网络的Linux终端

**执行命令**：

```bash
cd /opt/vulhub/wordpress/pwnscriptum

# 下载所有需要的镜像
sudo docker-compose pull
```

---

### 步骤2：保存镜像为tar文件

**操作位置**：有网络的Linux终端

**执行命令**：

```bash
# 保存镜像
cd /opt/vulhub/wordpress/pwnscriptum
sudo docker save -o wordpress.tar vulhub/wordpress:4.6 mysql:5.5

# 压缩（节省空间）
tar -cvf wordpress.tar.gz wordpress.tar
```

---

### 步骤3：在离线环境中加载镜像

**操作位置**：离线环境的Linux终端

**执行命令**：

```bash
# 传输tar文件到离线环境
# scp wordpress.tar.gz user@offline-server:/opt/

# 加载镜像
sudo docker load -i wordpress.tar.gz
```

---

## 7.9 【常见问题】Vulhub安装与使用问题

### 7.9.1 Docker问题

---

**问题1：Docker服务启动失败**

**可能原因**：
- Docker配置文件错误
- 系统资源不足
- 端口被占用

**解决方法**：

```bash
# 查看Docker状态
sudo systemctl status docker

# 查看Docker日志
sudo journalctl -u docker -f

# 检查配置文件
sudo cat /etc/docker/daemon.json
```

---

**问题2：Docker镜像拉取失败**

**可能原因**：
- 网络连接问题
- Docker Hub访问受限
- 镜像名称错误

**解决方法**：

```bash
# 检查网络
ping -c 4 google.com

# 配置镜像加速器（参考7.2.5节）

# 重试拉取
sudo docker pull [镜像名]

# 使用代理
export https_proxy=http://proxy:8080
export http_proxy=http://proxy:8080
sudo docker pull [镜像名]
```

---

**问题3：端口被占用**

**错误信息**：`Bind for 0.0.0.0:8080 failed: port is already allocated`

**解决方法**：

```bash
# 查看端口占用
sudo netstat -tulpn | grep 8080
# 或
sudo lsof -i :8080

# 停止占用端口的进程
sudo kill -9 <PID>

# 或修改docker-compose.yml使用其他端口
```

---

### 7.9.2 Vulhub问题

---

**问题4：docker-compose命令找不到**

**解决方法**：

```bash
# 检查docker-compose是否安装
which docker-compose

# 如果没有安装
sudo apt install docker-compose

# 或手动下载
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证
docker-compose --version
```

---

**问题5：容器启动后无法访问**

**可能原因**：
- 容器未正常启动
- 防火墙阻止
- 服务启动需要时间

**解决方法**：

```bash
# 检查容器状态
sudo docker-compose ps

# 查看容器日志
sudo docker-compose logs

# 检查防火墙
sudo ufw status
sudo ufw allow 8080/tcp

# 等待服务完全启动
sleep 30
```

---

**问题6：数据库连接失败**

**可能原因**：
- 数据库服务未完全启动
- 环境变量配置错误
- 网络问题

**解决方法**：

```bash
# 查看数据库日志
sudo docker-compose logs db

# 检查连接配置
cat docker-compose.yml | grep -A 5 environment

# 等待数据库完全启动
sudo docker-compose down
sudo docker-compose up -d
sleep 60
```

---

### 7.9.3 性能问题

---

**问题7：Docker占用磁盘空间过大**

**解决方法**：

```bash
# 查看Docker磁盘使用
sudo docker system df

# 清理未使用的资源
sudo docker system prune -a

# 删除特定镜像
sudo docker rmi [镜像ID]

# 清理所有未使用的卷
sudo docker volume prune
```

---

**问题8：容器运行缓慢或卡顿**

**可能原因**：
- 系统资源不足
- 容器数量过多
- Docker配置不当

**解决方法**：

```bash
# 查看系统资源
top
# 或
htop

# 限制容器资源（编辑docker-compose.yml）
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M

# 关闭不需要的容器
sudo docker-compose down

# 增加Docker可用内存（Docker Desktop设置中）
```

---

### 7.9.4 权限问题

---

**问题9：权限不足（Permission denied）**

**解决方法**：

```bash
# 方法1：将用户加入docker组
sudo usermod -aG docker $USER
newgrp docker

# 方法2：使用sudo运行docker命令
sudo docker [命令]

# 方法3：修改Docker socket权限
sudo chmod 666 /var/run/docker.sock
```

---

**问题10：无法创建文件或目录**

**解决方法**：

```bash
# 检查目录权限
ls -la /opt/vulhub/

# 修改目录所有者
sudo chown -R $(whoami):docker /opt/vulhub/

# 或使用sudo
sudo chmod -R 777 /opt/vulhub/
```

---

## 7.10 【通用】安全注意事项

### 使用建议

1. **不要在生产环境使用**：Vulhub中的环境都存在漏洞，仅供学习研究
2. **仅限本地或内网使用**：建议在本地虚拟机或专用测试网络中使用
3. **使用完毕及时关闭**：用完漏洞环境后及时停止，避免被他人利用
4. **遵守法律法规**：使用Vulhub进行学习时，必须遵守当地法律法规

---

### 学习建议

1. **从简单漏洞开始**：如SQL注入、XSS等基础漏洞
2. **理解漏洞原理**：不要只关注利用工具，要深入理解漏洞原因
3. **阅读README文档**：每个漏洞环境都有详细说明
4. **动手实践**：安全是实践性很强的学科，必须亲手操作
5. **做好笔记**：记录漏洞原理、利用方法、修复方案等

---

## 7.11 本章小结

本章详细介绍了Vulhub漏洞环境的搭建和使用方法：

### 搭建步骤总结

1. **安装Docker**：根据操作系统选择对应的安装方式
2. **配置镜像加速**：提升镜像拉取速度
3. **下载Vulhub**：Git克隆或下载ZIP包
4. **启动漏洞环境**：使用docker-compose up -d一键启动

### 常用漏洞环境

| 分类 | 漏洞名称 | 命令 |
|------|----------|------|
| Web服务器 | Struts2 S2-045 | cd struts2/s2-045 && docker-compose up -d |
| 开发框架 | ThinkPHP 5 RCE | cd thinkphp/5-rce && docker-compose up -d |
| 数据库 | Redis未授权 | cd redis/4-unacc && docker-compose up -d |
| CMS | Drupal CVE-2018-7600 | cd drupal/CVE-2018-7600 && docker-compose up -d |
| Java组件 | Log4j Log4Shell | cd log4j/CVE-2021-44228 && docker-compose up -d |

### 常用命令

```bash
# 启动环境
docker-compose up -d

# 停止环境
docker-compose down

# 查看日志
docker-compose logs -f

# 进入容器
docker exec -it [容器名] /bin/bash
```

通过Vulhub，可以快速搭建各种漏洞环境进行学习和渗透测试练习。建议读者按照本章步骤搭建环境，亲手操作加深理解。
