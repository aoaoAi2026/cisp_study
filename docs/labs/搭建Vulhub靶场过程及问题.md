# 搭建 Vulhub 靶场过程及问题（超详细·通俗易懂版）

> 📌 一句话简介：**Vulhub 是一个基于 Docker 的「漏洞环境一键合集」**，你只需要进入某个漏洞目录敲一句 `docker-compose up -d`，一个对应的 CVE 漏洞靶场就起来了，不用手动装 Apache、Tomcat、PHP 版本。
>
> Kali VM 里 Vulhub 部署完成后，共 **170 个漏洞环境**可随时启动/停止。
>
> 🌐 当前已成功启动的示例靶场：`http://192.168.108.128:8080/`（Tomcat CVE-2017-12615 PUT RCE）

---

## 一、准备工作

### 1.1 环境信息

| 项目 | 值 |
|------|-----|
| 靶机 OS | Kali GNU/Linux Rolling 2026.1 |
| 靶机 IP | 192.168.108.128 |
| SSH 账号 | kail / kail |
| 可用磁盘 | 75G 总量 / 还剩 53G（够用） |
| 内存 | 7.7GB（Docker 容器同时跑 5-10 个毫无压力） |

### 1.2 你需要先装好的（Kali 自带，但默认没开）

- ✅ **SSH 服务**：Kali 默认不开 SSH，需要手动 `sudo apt install openssh-server && sudo systemctl enable ssh --now`
- ✅ **Docker 引擎**：Kali 2026 默认就装了 Docker（没装就 `sudo apt install docker.io`）
- ✅ **docker-compose**：Vulhub 的每个漏洞环境都有一个 `docker-compose.yml`，必须要
- ✅ **Git**：克隆 Vulhub 源码用

---

## 二、实际搭建步骤（按时间顺序）

### 第 1 步：把当前用户加入 docker 组（重要！）

Docker 默认只有 root 能玩。每次都加 `sudo` 很麻烦。

```bash
# 把 kail 加入 docker 用户组
sudo usermod -aG docker kail

# 👉 然后记得「重新登录一次 SSH 或重启 Shell」才能生效
# 临时替代： newgrp docker    （当前 shell 立即生效）
```

💡 **检查方法**：直接敲 `docker ps`，不报错就是 OK；如果还报「permission denied」，重新登录 SSH 再来。

---

### 第 2 步：安装 docker-compose

Kali 源里直接有包，一条命令：

```bash
sudo apt update -y
sudo apt install -y docker-compose

# 验证版本
docker-compose --version
# 成功输出：Docker Compose version v2.x.x
```

---

### 第 3 步：配置 Docker 镜像加速器（🔥 最关键的一步）

这一步是整个搭建过程中 **花时间最多、坑最多** 的地方。原因：**2024 年之后国内几乎所有「老牌」Docker 镜像加速器（阿里云个人版、腾讯云旧版、ustc 旧版……）都失效了**，直接访问 Docker Hub 官方 registry-1.docker.io 又会超时。

#### ❌ 第一次踩坑：用默认的阿里云镜像加速器

Kali 默认的 `/etc/docker/daemon.json` 里有：
```json
"registry-mirrors": ["https://vhnkf0mo.mirror.aliyuncs.com"]
```

结果：
```
403 Forbidden
```
→ 阿里云加速器现在要「登录个人账号后才给专属地址」，旧地址都报废了。

#### ❌ 第二次踩坑：换用 ustc / nju / 腾讯云 老镜像源

把 `daemon.json` 改成：
```json
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://docker.mirrors.ustc.edu.cn",
    "https://docker.nju.edu.cn"
  ]
}
```
重启 Docker 之后拉取 `vulhub/tomcat:8.5.19`：
- 南大 nju：返回 **403 Forbidden**（不对 vulhub 项目镜像做缓存了）
- ustc & 腾讯：**超时** → 最后 fallback 到 `registry-1.docker.io/v2/` 继续超时，全失败 😅

#### ✅ 最终成功：用「DaoCloud 公共镜像代理」+ 一批新的社区镜像源

重写 `/etc/docker/daemon.json`：

```json
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.1ms.run",
    "https://docker.registry.cyou",
    "https://hub.rat.dev",
    "https://docker.proxy.ustclug.org",
    "https://mirror.ccs.tencentyun.com"
  ],
  "dns": ["223.5.5.5", "114.114.114.114", "8.8.8.8"],
  "ipv6": false,
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "max-concurrent-downloads": 8
}
```

然后重启 Docker：
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
sleep 5
sudo systemctl status docker --no-pager | head   # 必须看到 active (running)
```

再验证镜像源：
```bash
sudo docker info 2>/dev/null | grep -A 10 "Registry Mirrors"
# 能看到上面加的 6 个 URL，就 OK
```

💡 **以后镜像又失效了怎么办？** 继续把更前面的镜像 URL 换成最新的社区代理镜像（Vulhub 官方文档、GitHub Gist、Docker 论坛里会有人持续更新最新可用的镜像代理）。

---

### 第 4 步：克隆 Vulhub 源码

同样因为 GitHub 在国内偶尔抽风，**推荐用 Gitee 镜像**（速度快 10 倍）：

```bash
# 推荐 Gitee（又快又稳）
cd ~
git clone --depth 1 https://gitee.com/vulhub/vulhub.git ~/vulhub

# ❌ GitHub 备用（经常 Recv failure: Connection was reset）
# git clone --depth 1 https://github.com/vulhub/vulhub.git
```

成功提示：
```
正克隆到 '/home/kail/vulhub'...
```

检查：
```bash
du -sh ~/vulhub                              # 应该在 ~120MB 左右
find ~/vulhub -name docker-compose.yml | wc -l   # 输出 170 = 170 个漏洞环境
```

---

### 第 5 步：启动第一个漏洞环境（Tomcat CVE-2017-12615）

选这个的原因：① 学习资料里提过它 ② 体积小、启动快 ③ 复现直观（PUT 上传 jsp 一句话木马）。

```bash
cd ~/vulhub/tomcat/CVE-2017-12615

# 启动（第一次会拉取 vulhub/tomcat:8.5.19 镜像，大概需要 5~10 分钟，取决于网络）
echo "kail" | sudo -S docker-compose up -d
```

#### ⏳ 第一次等待时间较长时怎么看进度？

开另一个终端看：
```bash
# 看当前容器状态
sudo docker ps
# 预期看到：cve-2017-12615-tomcat-1   Up 几秒   0.0.0.0:8080->8080/tcp

# 看启动日志
cd ~/vulhub/tomcat/CVE-2017-12615
sudo docker-compose logs --tail=30
```

#### ✅ 验证是否真的成功：

```bash
# 方式 1：curl 本机
curl -s -o /dev/null -w "HTTP_CODE=%{http_code}\n" http://127.0.0.1:8080/
# => HTTP_CODE=200 就是成功！

# 方式 2：宿主机 Windows 浏览器打开（同网段）
# 👉 http://192.168.108.128:8080/
#    应该看到 Tomcat 可爱的黄色小猫咪首页 🐱
```

---

## 三、以后 Vulhub 的日常使用方法

### 3.1 常用命令速记（这 4 条够用 99% 场景）

| 你想做什么 | 命令（先 `cd ~/vulhub/组件/漏洞ID/`） |
|------------|--------------------------------------|
| 启动一个漏洞环境 | `sudo docker-compose up -d` |
| 停止当前漏洞环境 | `sudo docker-compose down` |
| 连数据卷一并清除（重置数据库/文件） | `sudo docker-compose down -v` |
| 查看所有正在跑的漏洞容器 | `sudo docker ps` |

### 3.2 推荐入门 Top 10（全部 `~/vulhub/` 下存在）

```
✅ tomcat/CVE-2017-12615     Tomcat PUT RCE（已作为示例启动！）
✅ thinkphp/5-rce            ThinkPHP 5 全版本 RCE
✅ struts2/s2-045            Struts2 OGNL RCE（经典！）
✅ weblogic/CVE-2017-10271   WebLogic XMLDecoder RCE
✅ redis/4-unacc             Redis 未授权写公钥/RCE
✅ nginx/insecure-config     Nginx 配置漏洞合集（解析、穿越）
✅ php/CVE-2019-11043        PHP-FPM 远程代码执行
✅ mysql/CVE-2012-2122       MySQL 认证绕过
✅ flask/ssti                Flask 模板注入 SSTI
✅ drupal/CVE-2018-7600      Drupalgeddon 2 RCE
```

👉 启动方法都是一样的：
```bash
cd ~/vulhub/struts2/s2-045
sudo docker-compose up -d
```
然后用 `sudo docker ps` 看端口映射，浏览器打开 `http://192.168.108.128:<端口号>` 就 OK 啦。

---

## 四、搭建过程中遇到的问题 & 解决方案总表（避坑指南）

| # | 遇到的问题 | 现象/报错 | 解决方案 |
|---|-----------|----------|----------|
| 1 | SSH 连不上 Kali | `ECONNREFUSED 192.168.108.128:22` | Kali 默认没开 ssh。Kali 终端里 `sudo apt install -y openssh-server && sudo systemctl enable ssh --now` |
| 2 | Docker 每次都要 sudo | `permission denied while trying to connect to Docker daemon socket` | `sudo usermod -aG docker kail`，**重登 SSH**。嫌每次重登麻烦：`sudo -v` 缓存凭据 15 分钟 |
| 3 | 阿里云加速器返回 **403 Forbidden** | `unexpected status from HEAD request to https://vhnkf0mo.mirror.aliyuncs.com/v2/... 403 Forbidden` | 阿里云旧的「匿名公共加速器」全部作废。换用本文的 DaoCloud / 1ms.run / rat.dev 等一批新公共镜像代理 |
| 4 | 官方 Docker Hub 超时 | `Get "https://registry-1.docker.io/v2/": net/http: request canceled while waiting for connection` | 国内访问 Docker Hub 官方经常抽风，继续多加几个镜像源到 `registry-mirrors` 列表里 |
| 5 | Git 克隆 GitHub 失败 | `fatal: 无法访问 'https://github.com/vulhub/vulhub.git/'：Recv failure：连接被对端重置` | 改用 Gitee：`git clone https://gitee.com/vulhub/vulhub.git`，同样是官方最新同步的镜像 |
| 6 | Windows PowerShell 传 bash 命令多层转义乱套 | `$(date +%s)` 被 PowerShell 当成自己的子表达式；JSON 中的引号/冒号解析失败 | 写成本地 `.sh` 脚本文件，用 base64 打包后传过去再解码执行（本项目用的方法），彻底避开跨平台转义 |
| 7 | Vulhub 容器启动了但 curl 返回 `000` | HTTP 返回码 000 = 连不上端口 | ① 等 10~30 秒让 Web 服务真正起来 ② `docker ps` 看端口映射是否和 docker-compose.yml 一致 ③ `ss -tlnp` 确认宿主机监听 |

---

## 五、最终成果

- ✅ Vulhub 源码在：**`/home/kail/vulhub/`**（大小 120MB）
- ✅ 漏洞环境总数：**170 个**
- ✅ Docker 镜像拉取能力：正常（docker.m.daocloud.io 等 6 个加速器工作中）
- ✅ 示例靶场：**Tomcat CVE-2017-12615 已启动并可访问**
  - 👉 地址：http://192.168.108.128:8080/
  - 停止：`cd ~/vulhub/tomcat/CVE-2017-12615 && sudo docker-compose down`

🎉 **Vulhub 搭建完成！** 后面你复现任何一个 CVE，都是 cd 目录 → docker-compose up -d，1 分钟搞定。
