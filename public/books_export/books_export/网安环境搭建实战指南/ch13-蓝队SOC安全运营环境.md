# 第十三章 蓝队SOC安全运营环境

## 13.1 环境概述

安全运营中心（Security Operations Center, SOC）是企业安全防护体系的核心组成部分。蓝队负责监控、检测、分析和响应网络安全事件，保护企业信息系统免受攻击。搭建一个完善的SOC环境，是学习和实践安全运营技术的基础。

本章将介绍蓝队SOC环境所需的各类工具和平台的搭建方法，包括日志收集、流量分析、入侵检测、SIEM平台等内容。

### 13.1.1 SOC环境架构

典型的SOC环境包含以下组件：

| 组件 | 作用 | 推荐工具 |
|------|------|----------|
| 日志收集 | 收集各类系统和应用日志 | Logstash、Filebeat、Fluentd |
| 日志存储 | 存储和索引日志数据 | Elasticsearch、Splunk |
| 日志分析 | 可视化分析和查询 | Kibana、Grafana |
| 入侵检测 | 网络流量入侵检测 | Suricata、Snort |
| 主机入侵检测 | 主机层面的入侵检测 | Wazuh、OSSEC |
| SIEM平台 | 安全信息与事件管理 | ELK Stack、Security Onion |
| 威胁情报 | 威胁情报数据集成 | MISP、OpenCTI |

### 13.1.2 系统要求

| 组件 | 最低配置 | 推荐配置 |
|------|----------|----------|
| Elasticsearch | 4核8GB | 8核16GB |
| Logstash | 2核4GB | 4核8GB |
| Kibana | 2核4GB | 4核8GB |
| Suricata | 2核4GB | 4核8GB |
| Wazuh Server | 4核8GB | 8核16GB |
| Security Onion | 4核8GB | 8核32GB |

---

## 13.2 ELK Stack 安装配置

### 13.2.1 ELK Stack 介绍

ELK Stack是由Elasticsearch、Logstash、Kibana三个开源工具组成的日志分析平台：

- **Elasticsearch**：分布式搜索和分析引擎，用于存储和索引日志数据
- **Logstash**：数据收集处理引擎，用于收集、过滤和转换日志
- **Kibana**：数据可视化平台，提供Web界面进行日志查询和分析
- **Beats**：轻量级数据采集器（Filebeat、Metricbeat等）

### 13.2.2 环境准备

**系统要求：**
- 操作系统：Ubuntu 20.04/22.04 LTS 或 CentOS 7/8
- Java：OpenJDK 11 或更高版本
- 内存：至少8GB
- 磁盘：至少100GB可用空间

---

### 13.2.3 Elasticsearch 安装

---

#### 【Linux环境】方式一：APT仓库安装

**步骤1：系统更新**

> 操作位置：Linux终端（Ubuntu/Debian）

```bash
# 更新软件包列表
sudo apt update

# 升级已安装软件包
sudo apt upgrade -y
```

**预期输出：**
```
Reading package lists... Done
Building dependency tree... Done
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
```

---

**步骤2：安装Java 11**

> 操作位置：Linux终端

```bash
# 安装OpenJDK 11
sudo apt install -y openjdk-11-jdk

# 验证Java安装
java -version
```

**预期输出：**
```
openjdk version "11.0.20" 2023-07-18
OpenJDK Runtime Environment (build 11.0.20+8-post-Ubuntu-1ubuntu22.04) for hotspot (Tiered VM).
```

---

**步骤3：配置系统参数**

> 操作位置：Linux终端

```bash
# 增加最大文件描述符
echo "elasticsearch  -  nofile  65536" | sudo tee -a /etc/security/limits.conf

# 增加最大进程数
echo "elasticsearch  -  nproc   4096" | sudo tee -a /etc/security/limits.conf

# 增加虚拟内存
echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf

# 使配置生效
sudo sysctl -p

# 关闭交换分区（生产环境推荐）
sudo swapoff -a

# 注释掉fstab中的swap条目
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
```

**预期输出：**
```
vm.max_map_count = 262144
```

---

**步骤4：添加Elasticsearch仓库**

> 操作位置：Linux终端

```bash
# 导入Elasticsearch GPG密钥
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg

# 添加Elasticsearch APT仓库
echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic.list

# 更新软件包列表
sudo apt update
```

**预期输出：**
```
Get:1 https://artifacts.elastic.co/packages/8.x/apt stable InRelease [6,274 B]
Reading package lists... Done
```

---

**步骤5：安装Elasticsearch**

> 操作位置：Linux终端

```bash
# 安装Elasticsearch
sudo apt install -y elasticsearch
```

**预期输出：**
```
Setting up elasticsearch ... Done
```

---

**步骤6：配置Elasticsearch**

> 操作位置：Linux终端，使用nano编辑器

```bash
# 编辑Elasticsearch配置文件
sudo nano /etc/elasticsearch/elasticsearch.yml
```

配置文件主要修改内容：

```yaml
# 集群名称
cluster.name: soc-cluster

# 节点名称
node.name: node-1

# 数据存储路径
path.data: /var/lib/elasticsearch

# 日志路径
path.logs: /var/log/elasticsearch

# 绑定地址（0.0.0.0允许外部访问）
network.host: 0.0.0.0

# HTTP端口
http.port: 9200

# 单节点模式
discovery.type: single-node

# 安全设置（学习环境关闭，生产环境建议启用）
xpack.security.enabled: false
xpack.security.enrollment.enabled: false
```

> 按 `Ctrl+O` 保存，`Ctrl+X` 退出nano编辑器

---

**步骤7：启动Elasticsearch**

> 操作位置：Linux终端

```bash
# 启动Elasticsearch服务
sudo systemctl start elasticsearch

# 设置开机自启
sudo systemctl enable elasticsearch

# 检查服务状态
sudo systemctl status elasticsearch
```

**预期输出：**
```
● elasticsearch.service - Elasticsearch
   Loaded: loaded (/lib/systemd/system/elasticsearch.service; enabled)
   Active: active (running) since ...
```

---

**步骤8：验证安装**

> 操作位置：Linux终端

```bash
# 测试Elasticsearch连接
curl http://localhost:9200
```

**预期输出：**
```json
{
  "name" : "node-1",
  "cluster_name" : "soc-cluster",
  "cluster_uuid" : "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "version" : {
    "number" : "8.x.x",
    "build_flavor" : "default",
    "build_type" : "deb",
    "build_hash" : "xxxxxxxxxx",
    "build_date" : "2023-xx-xxTxx:xx:xx.xxxZ",
    "build_snapshot" : false,
    "lucene_version" : "9.x.x",
    "minimum_wire_compatibility_version" : "7.17.0",
    "minimum_index_compatibility_version" : "7.17.0"
  },
  "tagline" : "You Know, for Search"
}
```

---

#### 【Docker环境】方式二：Docker Compose安装（推荐）

**步骤1：安装Docker和Docker Compose**

> 操作位置：Linux终端

```bash
# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装Docker Compose
sudo apt install -y docker-compose

# 将当前用户加入docker组（避免每次sudo）
sudo usermod -aG docker $USER

# 验证安装
docker --version
docker-compose --version
```

**预期输出：**
```
Docker version 24.x.x, build xxxxxxx
docker-compose version x.x.x, build xxxxxxx
```

---

**步骤2：创建ELK目录和配置**

> 操作位置：Linux终端

```bash
# 创建ELK目录
mkdir -p ~/elk && cd ~/elk

# 创建docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms2g -Xmx2g"
    volumes:
      - esdata:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
      - "9300:9300"
    restart: unless-stopped
    mem_limit: 4g
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:9200/_cluster/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 5

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    container_name: logstash
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
      - ./logs:/var/log/logs
    ports:
      - "5044:5044"
      - "9600:9600"
    environment:
      - "LS_JAVA_OPTS=-Xms512m -Xmx512m"
    restart: unless-stopped
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    container_name: kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    restart: unless-stopped
    depends_on:
      - elasticsearch
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:5601/api/status || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 5

volumes:
  esdata:
    driver: local
EOF
```

---

**步骤3：创建Logstash配置**

> 操作位置：Linux终端，~/elk目录

```bash
# 创建Logstash配置目录
mkdir -p logstash/pipeline logs

# 创建Logstash pipeline配置
cat > logstash/pipeline/logstash.conf << 'EOF'
input {
  beats {
    port => 5044
  }
  tcp {
    port => 5000
    codec => json_lines
  }
  syslog {
    port => 5514
    type => "syslog"
  }
}

filter {
  if [type] == "syslog" {
    grok {
      match => { "message" => "%{SYSLOGTIMESTAMP:syslog_timestamp} %{SYSLOGHOST:syslog_hostname} %{DATA:syslog_program}(?:\[%{POSINT:syslog_pid}\])?: %{GREEDYDATA:syslog_message}" }
    }
    date {
      match => [ "syslog_timestamp", "MMM  d HH:mm:ss", "MMM dd HH:mm:ss" ]
    }
  }
  
  if [fields][log_type] == "apache" {
    grok {
      match => { "message" => "%{COMBINEDAPACHELOG}" }
    }
    date {
      match => [ "timestamp", "dd/MMM/yyyy:HH:mm:ss Z" ]
    }
  }
  
  if [fields][log_type] == "ssh" {
    grok {
      match => { "message" => "%{SYSLOGTIMESTAMP:syslog_timestamp} %{SYSLOGHOST:syslog_hostname} %{DATA:syslog_program}(?:\[%{POSINT:syslog_pid}\])?: %{DATA:syslog_message}" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "logs-%{+YYYY.MM.dd}"
  }
  stdout { codec => rubydebug }
}
EOF
```

---

**步骤4：启动ELK Stack**

> 操作位置：Linux终端，~/elk目录

```bash
# 启动所有服务（后台运行）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

**预期输出：**
```
NAME                COMMAND                  SERVICE             STATUS              PORTS
elasticsearch      "/bin/tini -- /usr/l…"   elasticsearch       running             0.0.0.0:9200->9200/tcp, 0.0.0.0:9300->9300/tcp
kibana              "/bin/tini -- /bin/…"    kibana             running             0.0.0.0:5601->5601/tcp
logstash           "/usr/local/bin/dock…"   logstash           running             0.0.0.0:5044->5044/tcp, 0.0.0.0:9600->9600/tcp
```

---

**步骤5：验证ELK Stack**

> 操作位置：浏览器

```
# 验证Elasticsearch
浏览器访问：http://localhost:9200

# 验证Kibana
浏览器访问：http://localhost:5601
```

> **注意**：首次启动Kibana需要等待Elasticsearch完全就绪，可能需要1-2分钟。

---

### 13.2.4 Logstash 安装

#### 【Linux环境】APT安装

**步骤1：安装Logstash**

> 操作位置：Linux终端

```bash
# 安装Logstash
sudo apt install -y logstash

# 验证安装
logstash --version
```

**预期输出：**
```
logstash 8.x.x
```

---

**步骤2：配置Logstash管道**

> 操作位置：Linux终端

```bash
# 创建管道配置文件
sudo nano /etc/logstash/conf.d/syslog.conf
```

配置内容：

```ruby
input {
  beats {
    port => 5044
  }
  
  syslog {
    port => 5514
    type => "syslog"
  }
}

filter {
  if [type] == "syslog" {
    grok {
      match => { "message" => "%{SYSLOGTIMESTAMP:syslog_timestamp} %{SYSLOGHOST:syslog_hostname} %{DATA:syslog_program}(?:\[%{POSINT:syslog_pid}\])?: %{GREEDYDATA:syslog_message}" }
    }
    
    date {
      match => [ "syslog_timestamp", "MMM  d HH:mm:ss", "MMM dd HH:mm:ss" ]
    }
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "%{[@metadata][beat]}-%{+YYYY.MM.dd}"
  }
  
  stdout {
    codec => rubydebug
  }
}
```

---

**步骤3：启动Logstash**

> 操作位置：Linux终端

```bash
# 启动Logstash服务
sudo systemctl start logstash

# 设置开机自启
sudo systemctl enable logstash

# 查看状态
sudo systemctl status logstash
```

---

### 13.2.5 Kibana 安装

#### 【Linux环境】APT安装

**步骤1：安装Kibana**

> 操作位置：Linux终端

```bash
# 安装Kibana
sudo apt install -y kibana

# 验证安装
kibana --version
```

---

**步骤2：配置Kibana**

> 操作位置：Linux终端

```bash
# 编辑Kibana配置文件
sudo nano /etc/kibana/kibana.yml
```

配置文件主要内容：

```yaml
# 服务端口
server.port: 5601

# 监听地址（0.0.0.0允许外部访问）
server.host: "0.0.0.0"

# 服务器名称
server.name: "soc-kibana"

# Elasticsearch地址
elasticsearch.hosts: ["http://localhost:9200"]

# 日志路径
logging.dest: /var/log/kibana/kibana.log

# 国际化设置（可选）
i18n.locale: "zh-CN"
```

---

**步骤3：启动Kibana**

> 操作位置：Linux终端

```bash
# 启动Kibana服务
sudo systemctl start kibana

# 设置开机自启
sudo systemctl enable kibana

# 查看状态
sudo systemctl status kibana
```

---

**步骤4：访问Kibana**

> 操作位置：浏览器

```
浏览器访问：http://服务器IP:5601
```

---

### 13.2.6 Filebeat 安装

Filebeat是轻量级日志采集器，安装在需要收集日志的服务器上。

#### 【Linux环境】APT安装

**步骤1：安装Filebeat**

> 操作位置：Linux终端

```bash
# 安装Filebeat
sudo apt install -y filebeat

# 验证安装
filebeat --version
```

---

**步骤2：配置Filebeat**

> 操作位置：Linux终端

```bash
# 编辑Filebeat配置文件
sudo nano /etc/filebeat/filebeat.yml
```

配置示例：

```yaml
filebeat.inputs:
# 系统日志收集
- type: filestream
  enabled: true
  paths:
    - /var/log/*.log
    - /var/log/syslog
    - /var/log/auth.log
  fields:
    log_type: system

# Apache日志收集
- type: log
  enabled: true
  paths:
    - /var/log/apache2/access.log
  fields:
    log_type: apache

# Nginx日志收集
- type: log
  enabled: true
  paths:
    - /var/log/nginx/access.log
  fields:
    log_type: nginx

# 输出到Logstash
output.logstash:
  hosts: ["LOGSTASH_IP:5044"]

# 启用系统模块
filebeat.modules:
  - system
  - apache
  - nginx

# 处理器
processors:
  - add_host_metadata:
      when.not.contains.tags: forwarded
  - add_cloud_metadata: ~
  - add_docker_metadata: ~
  - add_kubernetes_metadata: ~
```

---

**步骤3：启用Filebeat模块**

> 操作位置：Linux终端

```bash
# 查看可用模块
filebeat modules list

# 启用系统模块
sudo filebeat modules enable system

# 启用Nginx模块（如果安装了Nginx）
sudo filebeat modules enable nginx

# 启用Apache模块（如果安装了Apache）
sudo filebeat modules enable apache

# 配置系统模块
sudo nano /etc/filebeat/modules.d/system.yml
```

---

**步骤4：启动Filebeat**

> 操作位置：Linux终端

```bash
# 启动Filebeat服务
sudo systemctl start filebeat

# 设置开机自启
sudo systemctl enable filebeat

# 查看状态
sudo systemctl status filebeat

# 测试配置
sudo filebeat test config -c /etc/filebeat/filebeat.yml
```

---

### 13.2.7 常见问题

#### 【通用】常见问题排查

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| Elasticsearch启动失败 | 内存不足或虚拟内存不够 | 增加内存，或执行 `sudo sysctl -w vm.max_map_count=262144` |
| Elasticsearch启动失败 | 已存在运行中的实例 | 执行 `sudo systemctl stop elasticsearch` 或检查端口占用 |
| Kibana无法连接ES | 网络不通或ES未启动 | 检查防火墙，执行 `curl http://localhost:9200` 确认ES运行 |
| Kibana访问空白页 | 浏览器缓存或Cookie问题 | 清除浏览器缓存或使用隐私模式访问 |
| Logstash配置错误 | 配置文件语法错误 | 使用 `/usr/share/logstash/bin/logstash --config.test_and_exit -f /etc/logstash/conf.d/xxx.conf` 验证 |
| Filebeat不发送日志 | 配置错误或权限问题 | 检查配置文件，查看日志 `/var/log/filebeat/filebeat` |
| Docker容器无法启动 | 端口被占用或内存不足 | 检查 `docker-compose ps` 和宿主机端口占用 |
| 容器内无法解析主机名 | Docker网络配置问题 | 检查docker-compose.yml中的网络配置 |
| 磁盘空间不足 | Elasticsearch数据过大 | 配置索引生命周期管理或增加磁盘空间 |

---

**端口检查命令：**

```bash
# 检查端口占用
sudo netstat -tlnp | grep 9200
sudo netstat -tlnp | grep 5601
sudo netstat -tlnp | grep 5044

# 或使用ss命令
sudo ss -tlnp | grep 9200
```

---

**日志查看命令：**

```bash
# Elasticsearch日志
sudo tail -f /var/log/elasticsearch/soc-cluster.log

# Kibana日志
sudo tail -f /var/log/kibana/kibana.log

# Logstash日志
sudo tail -f /var/log/logstash/logstash-plain.log

# Docker容器日志
docker-compose logs -f elasticsearch
docker-compose logs -f kibana
docker-compose logs -f logstash
```

---

## 13.3 Security Onion 安装

### 13.3.1 Security Onion 介绍

Security Onion是一个基于Ubuntu的开源安全监控平台，集成了多种安全工具：

- **网络监控**：Suricata、Zeek、Snort
- **日志管理**：Elasticsearch、Logstash、Kibana
- **威胁狩猎**：CyberChef、NetworkMiner
- **分析工具**：CapME、Sguil、Squert
- **主机监控**：Wazuh

### 13.3.2 系统要求

| 项目 | 最低要求 | 推荐配置 |
|------|----------|----------|
| CPU | 4核 | 8核以上 |
| 内存 | 8GB | 16GB以上 |
| 硬盘 | 200GB | 500GB以上 |
| 网卡 | 2块 | 2块以上 |
| 系统 | Ubuntu 20.04/22.04 | Ubuntu 22.04 LTS |

### 13.3.3 安装步骤

---

#### 【Linux环境】ISO镜像安装

**步骤1：下载Security Onion镜像**

> 操作位置：浏览器

```
访问：https://blog.securityonion.net/p/downloading-so-image.html
下载最新的Security Onion ISO镜像
```

---

**步骤2：制作启动盘**

> 操作位置：Windows/Linux电脑

```bash
# Linux下使用dd制作启动盘
sudo dd if=securityonion-xxx.iso of=/dev/sdX bs=4M status=progress

# Windows下使用Rufus或BalenaEtcher制作启动盘
```

---

**步骤3：安装基础Ubuntu系统**

> 操作位置：目标服务器

```
1. 从ISO启动服务器
2. 选择"Install Ubuntu Server"
3. 选择语言和键盘布局
4. 配置网络（管理网口建议使用静态IP）
5. 创建管理员用户（不要使用root）
6. 安装SSH服务
7. 等待安装完成并重启
```

---

**步骤4：更新系统**

> 操作位置：Linux终端（已安装的Ubuntu）

```bash
# 系统更新
sudo apt update && sudo apt upgrade -y

# 安装基础工具
sudo apt install -y curl git vim
```

---

**步骤5：下载并运行安装脚本**

> 操作位置：Linux终端

```bash
# 下载Security Onion安装脚本
git clone https://github.com/Security-Onion-Solutions/securityonion
cd securityonion

# 运行网络配置脚本
sudo bash so-setup-network
```

---

**步骤6：安装向导配置**

> 操作位置：终端交互界面

```
安装类型选择：
┌─────────────────────────────────────┐
│ Please select your installation type │
├─────────────────────────────────────┤
│ 1. EVAL - Evaluation mode (single node) │
│ 2. IMPORT - Import mode               │
│ 3. SEARCH - Search node               │
│ 4. FORWARD - Forward node             │
│ 5. RECEIVER - Receiver node           │
│ 6. STORAGE - Storage node              │
│ 7. STANDALONE - Standalone mode       │
└─────────────────────────────────────┘
选择: 1 (EVAL模式适合学习)

网络接口配置：
- 管理接口：用于Web访问和管理
- 监控接口：用于流量监听（需要配置为混杂模式）

主机名配置：
- 请输入主机名（例如：securityonion）

网络配置：
- IP地址、子网掩码、网关、DNS
```

---

**步骤7：等待安装完成**

> 操作位置：Linux终端

```bash
# 查看所有服务状态
sudo so-status

# 查看安装日志
sudo tail -f /root/so-setup.log
```

---

### 13.3.4 访问Web界面

> 操作位置：浏览器

```
访问地址：https://服务器IP
默认用户名：admin@securityonion.local
密码：安装时设置的密码
```

---

### 13.3.5 基本使用

**查看告警：**

> 操作位置：Security Onion Console Web界面

```
1. 登录Security Onion Console
2. 点击左侧菜单"Alerts"
3. 查看Suricata和其他工具产生的告警
4. 可以点击告警查看详情
```

**流量分析：**

> 操作位置：Security Onion Console Web界面

```
1. 点击左侧菜单"PCAP"
2. 选择要分析的流量时间范围
3. 点击"CapME"进行深度分析
4. 可以下载PCAP文件进行本地分析
```

**日志查询：**

> 操作位置：Security Onion Console Web界面

```
1. 点击左侧菜单"Dashboards"
2. 选择对应的仪表盘
3. 使用Kibana进行日志查询
4. 可以创建自定义仪表盘
```

---

### 13.3.6 常见问题

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| 安装失败 | 系统资源不足 | 增加内存和磁盘空间，参考系统要求 |
| 服务启动失败 | 配置错误 | 运行 `sudo so-status` 检查，查看对应日志 |
| 无法访问Web界面 | 防火墙或网络配置 | 检查防火墙规则 `sudo ufw status`，检查网络配置 |
| 监控接口无流量 | 接口未正确配置或未启用混杂模式 | 检查接口配置 `sudo so-allow`，确认网卡设为混杂模式 |
| 告警不显示 | Elasticsearch未正确连接 | 检查 `sudo so-status` 中elasticsearch状态 |

---

## 13.4 Suricata IDS/IPS 安装

### 13.4.1 Suricata 介绍

Suricata是一个高性能的开源网络入侵检测/防御系统（IDS/IPS），支持：

- 多线程引擎，高性能
- 协议分析（HTTP、DNS、TLS、FTP等）
- 规则匹配（兼容Snort规则）
- 流量记录（PCAP）
- 输出多种格式（EVE JSON、fast.log等）

---

### 13.4.2 安装Suricata

#### 【Linux环境】方式一：APT安装（Ubuntu）

**步骤1：添加PPA仓库**

> 操作位置：Linux终端（Ubuntu）

```bash
# 添加Suricata稳定版PPA
sudo add-apt-repository ppa:oisf/suricata-stable

# 更新软件包列表
sudo apt update
```

**预期输出：**
```
gpg: keyring `/etc/apt/trusted.gpg.d/oisf-suricata-stable.gpg' created
gpg: failed to start the dirmngr '/usr/bin/dirmngr': Not found
...
You are about to add the following PPA:
  Suricata IDS/IPS stable branch
...
```

---

**步骤2：安装Suricata**

> 操作位置：Linux终端

```bash
# 安装Suricata
sudo apt install -y suricata

# 验证安装
suricata --version
```

**预期输出：**
```
Suricata 7.x.x
```

---

#### 【Linux环境】方式二：源码编译安装

**步骤1：安装编译依赖**

> 操作位置：Linux终端

```bash
# 安装依赖包
sudo apt install -y \
    libpcre3 libpcre3-dbg libpcre3-dev \
    build-essential autoconf automake libtool \
    libpcap-dev libnet1-dev libyaml-0-2 libyaml-dev \
    zlib1g zlib1g-dev libcap-ng-dev libcap-ng0 \
    make libmagic-dev libjansson-dev libjansson4 \
    pkg-config python3-yaml rustc cargo
```

---

**步骤2：下载并编译源码**

> 操作位置：Linux终端

```bash
# 下载Suricata源码
wget https://www.openinfosecfoundation.org/download/suricata-7.0.0.tar.gz

# 解压
tar xzf suricata-7.0.0.tar.gz
cd suricata-7.0.0

# 配置编译选项
./configure --prefix=/usr --sysconfdir=/etc --localstatedir=/var

# 编译（多线程加速）
make -j$(nproc)

# 安装
sudo make install

# 安装配置文件
sudo make install-conf
```

---

### 13.4.3 配置Suricata

#### 【Linux环境】配置文件编辑

**步骤1：编辑主要配置文件**

> 操作位置：Linux终端

```bash
# 编辑Suricata配置文件
sudo nano /etc/suricata/suricata.yaml
```

主要配置项：

```yaml
# 网络接口配置（AF-Packet模式）
af-packet:
  - interface: eth0
    cluster-id: 99
    cluster-type: cluster_flow
    defrag: yes
    use-mmap: yes

# 检测模式
mode: af-packet

# 网络变量
vars:
  address-groups:
    HOME_NET: "[192.168.0.0/16,10.0.0.0/8,172.16.0.0/12]"
    EXTERNAL_NET: "any"
    HTTP_SERVERS: "$HOME_NET"
    SMTP_SERVERS: "$HOME_NET"
    SQL_SERVERS: "$HOME_NET"
    DNS_SERVERS: "$HOME_NET"

# 规则路径
default-rule-path: /var/lib/suricata/rules
rule-files:
  - suricata.rules

# 输出配置
outputs:
  # 快速日志
  - fast:
      enabled: yes
      filename: fast.log
      append: yes
  
  # EVE JSON日志（推荐）
  - eve-log:
      enabled: yes
      filetype: regular
      filename: eve.json
      types:
        - alert
        - http
        - dns
        - tls
        - flow
        - ssh
        - smtp
```

---

### 13.4.4 规则配置

#### 【Linux环境】规则管理

**步骤1：更新规则**

> 操作位置：Linux终端

```bash
# 使用suricata-update更新规则
sudo suricata-update

# 查看可用规则源
sudo suricata-update list-sources

# 启用Emerging Threats规则
sudo suricata-update enable-source et/open

# 执行更新
sudo suricata-update
```

**预期输出：**
```
Update process complete.
```

---

**步骤2：创建自定义规则**

> 操作位置：Linux终端

```bash
# 创建自定义规则文件
sudo nano /etc/suricata/rules/custom.rules
```

自定义规则示例：

```
# 检测SQL注入尝试
alert tcp any any -> $HOME_NET 80 (msg:"WEB-ATTACKS SQL injection attempt"; flow:to_server,established; content:"union select"; nocase; http_uri; sid:1000001; rev:1;)

# 检测XSS尝试
alert tcp any any -> $HOME_NET 80 (msg:"WEB-ATTACKS XSS attempt"; flow:to_server,established; content:"<script>"; nocase; http_uri; sid:1000002; rev:1;)

# 检测端口扫描
alert tcp any any -> $HOME_NET [1-1024] (msg:"SCAN Port scan detected"; flags:S,12; detection_filter:track by_src, count 10, seconds 5; sid:1000003; rev:1;)

# 检测SSH暴力破解
alert ssh any any -> $HOME_NET 22 (msg:"SSH brute force attempt"; flow:to_server,established; ssh.failed_login; sid:1000004; rev:1;)

# 检测ICMP洪泛
alert icmp any any -> $HOME_NET any (msg:"ICMP flood detected"; itype:8; threshold:type both, track by_src, count 100, seconds 1; sid:1000005; rev:1;)
```

---

**步骤3：在配置中启用自定义规则**

> 操作位置：Linux终端

```bash
# 编辑配置文件
sudo nano /etc/suricata/suricata.yaml
```

在 `rule-files` 部分添加：

```yaml
rule-files:
  - suricata.rules
  - /etc/suricata/rules/custom.rules
```

---

### 13.4.5 启动Suricata

#### 【Linux环境】服务管理

**步骤1：配置网卡为混杂模式**

> 操作位置：Linux终端

```bash
# 查看网卡名称
ip -a

# 启用网卡混杂模式
sudo ip link set eth0 promisc on

# 确认混杂模式已启用
ip link show eth0 | grep PROMISC
```

**预期输出：**
```
UP BROADCAST RUNNING PROMISC MULTICAST  MTU:1500  Metric:1
```

---

**步骤2：测试配置**

> 操作位置：Linux终端

```bash
# 测试配置文件
sudo suricata -T -c /etc/suricata/suricata.yaml -v
```

**预期输出：**
```
Suricata configuration test is successful.
```

---

**步骤3：启动Suricata**

> 操作位置：Linux终端

```bash
# 启动服务
sudo systemctl start suricata

# 设置开机自启
sudo systemctl enable suricata

# 查看状态
sudo systemctl status suricata
```

---

### 13.4.6 IPS模式配置

#### 【Linux环境】NFQUEUE模式

**步骤1：配置NFQUEUE**

> 操作位置：Linux终端

```bash
# 编辑Suricata配置，将af-packet改为nfqueue
sudo nano /etc/suricata/suricata.yaml
```

修改为：

```yaml
nfq:
  mode: accept
  repeat-mark: 1
  repeat-mark-range: 1-1
```

---

**步骤2：配置iptables**

> 操作位置：Linux终端

```bash
# 清除现有iptables规则
sudo iptables -F
sudo iptables -X

# 将流量转发到NFQUEUE
sudo iptables -I INPUT -j NFQUEUE
sudo iptables -I OUTPUT -j NFQUEUE
sudo iptables -I FORWARD -j NFQUEUE

# 或者仅转发特定端口
sudo iptables -I INPUT -p tcp --dport 80 -j NFQUEUE
sudo iptables -I OUTPUT -p tcp --sport 80 -j NFQUEUE
```

---

**步骤3：启动IPS模式**

> 操作位置：Linux终端

```bash
# 启动Suricata（IPS模式）
sudo suricata -c /etc/suricata/suricata.yaml -q 0 -v
```

---

### 13.4.7 日志查看

#### 【Linux环境】日志分析

**步骤1：查看告警日志**

> 操作位置：Linux终端

```bash
# 查看快速告警日志
sudo tail -f /var/log/suricata/fast.log

# 查看格式化的告警
sudo tail -f /var/log/suricata/fast.log | sudo more
```

**预期输出示例：**
```
06/05/2024-10:30:15.123456  [**] [1:1000001:1] WEB-ATTACKS SQL injection attempt [**] [Classification: Attempted Information Leak] [Priority: 2] {TCP} 192.168.1.100:54321 -> 192.168.1.200:80
```

---

**步骤2：查看EVE JSON日志**

> 操作位置：Linux终端

```bash
# 实时查看EVE日志（格式化输出）
sudo tail -f /var/log/suricata/eve.json | jq .

# 查看所有告警类型的日志
sudo tail -f /var/log/suricata/eve.json | jq 'select(.event_type=="alert")'

# 查看HTTP日志
sudo tail -f /var/log/suricata/eve.json | jq 'select(.event_type=="http")'
```

---

**步骤3：查看统计信息**

> 操作位置：Linux终端

```bash
# 使用suricatasc查看统计
sudo suricatasc -c "stats"
```

**预期输出：**
```json
{
  "uptime": 12345,
  "decoder": {...},
  "capture": {...},
  "detect": {...}
}
```

---

### 13.4.8 常见问题

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| Suricata启动失败 | 配置文件错误 | 使用 `sudo suricata -T -c /etc/suricata/suricata.yaml` 测试配置 |
| 无告警产生 | 规则未加载或无流量 | 检查规则文件是否存在，确认网卡是否启用混杂模式 |
| 性能问题 | 流量过大或规则过多 | 优化规则，减少规则数量，或增加硬件资源 |
| 误报过多 | 规则过于敏感 | 调优规则，添加白名单，调整规则优先级 |
| NFQUEUE模式不工作 | iptables未正确配置 | 检查 `sudo iptables -L -n` 确认NFQUEUE规则存在 |
| 规则更新失败 | 权限或网络问题 | 使用 `sudo suricata-update` 检查错误信息 |

---

**常用命令汇总：**

```bash
# 测试配置
sudo suricata -T -c /etc/suricata/suricata.yaml -v

# 前台运行（调试模式）
sudo suricata -c /etc/suricata/suricata.yaml -i eth0 -v

# 查看服务状态
sudo systemctl status suricata

# 重启服务
sudo systemctl restart suricata

# 重新加载规则（需suricatasc）
sudo suricatasc -c reload-rules

# 查看实时统计
sudo suricatasc -c stats
```

---

## 13.5 Wazuh HIDS 搭建

### 13.5.1 Wazuh 介绍

Wazuh是一个开源的主机入侵检测系统（HIDS），提供：

- 日志分析和入侵检测
- 文件完整性监控（FIM）
- 漏洞检测
- 合规性监控（PCI DSS、GDPR等）
- 安全编排和自动化响应（SOAR）
- 容器安全监控

### 13.5.2 Wazuh 架构

Wazuh由以下组件组成：

| 组件 | 作用 |
|------|------|
| Wazuh Agent | 安装在被监控主机上，收集数据 |
| Wazuh Server | 分析数据，生成告警 |
| Wazuh Indexer | 存储和索引数据（基于Elasticsearch） |
| Wazuh Dashboard | Web管理界面（基于Kibana） |

---

### 13.5.3 安装 Wazuh Server

#### 【Docker环境】方式一：Docker Compose安装（推荐）

**步骤1：下载Wazuh Docker配置**

> 操作位置：Linux终端

```bash
# 克隆Wazuh Docker仓库
git clone https://github.com/wazuh/wazuh-docker.git

# 进入单节点配置目录
cd wazuh-docker/single-node

# 查看目录内容
ls -la
```

---

**步骤2：修改管理员密码**

> 操作位置：Linux终端，wazuh-docker/single-node目录

```bash
# 编辑docker-compose.yml
nano docker-compose.yml
```

找到并修改以下环境变量：

```yaml
# Elasticsearch密码
- ELASTIC_PASSWORD=YourSecurePassword123

# Wazuh Dashboard密码
- INDEXER_PASSWORD=YourSecurePassword123
- DASHBOARD_PASSWORD=YourSecurePassword123
```

---

**步骤3：启动Wazuh**

> 操作位置：Linux终端，wazuh-docker/single-node目录

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

**预期输出：**
```
NAME                COMMAND                  SERVICE             STATUS              PORTS
wazuh.indexer       "/bin/tini -- /usr/l…"   indexer             running             9200/tcp
wazuh.manager       "/bin/tini -- /usr/l…"   manager             running             1514/tcp, 1515/tcp, 514/tcp
wazuh.dashboard     "/bin/tini -- /bin/…"    dashboard           running             0.0.0.0:443->5601/tcp
```

---

**步骤4：访问Wazuh Dashboard**

> 操作位置：浏览器

```
浏览器访问：https://localhost
默认用户名：admin
默认密码：YourSecurePassword123（你设置的密码）
```

> **注意**：使用HTTPS访问，首次访问需要确认安全提示

---

#### 【Linux环境】方式二：APT仓库安装

**步骤1：添加Wazuh仓库**

> 操作位置：Linux终端

```bash
# 导入GPG密钥
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | gpg --no-default-keyring --keyring gnupg-ring:/usr/share/keyrings/wazuh.gpg --import && chmod 644 /usr/share/keyrings/wazuh.gpg

# 添加APT仓库
echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | sudo tee -a /etc/apt/sources.list.d/wazuh.list

# 更新软件包列表
sudo apt update
```

---

**步骤2：安装Wazuh Manager**

> 操作位置：Linux终端

```bash
# 安装Wazuh Manager
sudo apt install -y wazuh-manager

# 启动服务
sudo systemctl start wazuh-manager
sudo systemctl enable wazuh-manager

# 查看状态
sudo systemctl status wazuh-manager
```

---

**步骤3：安装并配置Filebeat**

> 操作位置：Linux终端

```bash
# 安装Filebeat
sudo apt install -y filebeat

# 下载Wazuh Filebeat配置
sudo curl -so /etc/filebeat/filebeat.yml https://packages.wazuh.com/4.5/tpl/wazuh-filebeat-0.2.template.yaml

# 编辑Filebeat配置
sudo nano /etc/filebeat/filebeat.yml
```

配置内容：

```yaml
output.elasticsearch:
  hosts: ["127.0.0.1:9200"]
  protocol: https
  username: "admin"
  password: "password"
  ssl.certificate_authorities:
    - /etc/filebeat/certs/root-ca.pem
```

---

**步骤4：安装Wazuh Indexer**

> 操作位置：Linux终端

```bash
# 安装Wazuh Indexer
sudo apt install -y wazuh-indexer

# 编辑配置
sudo nano /etc/wazuh-indexer/opensearch.yml

# 启动服务
sudo systemctl start wazuh-indexer
sudo systemctl enable wazuh-indexer
```

---

**步骤5：安装Wazuh Dashboard**

> 操作位置：Linux终端

```bash
# 安装Wazuh Dashboard
sudo apt install -y wazuh-dashboard

# 编辑配置
sudo nano /etc/wazuh-dashboard/opensearch_dashboards.yml

# 启动服务
sudo systemctl start wazuh-dashboard
sudo systemctl enable wazuh-dashboard
```

---

### 13.5.4 安装 Wazuh Agent

#### 【Linux环境】Agent安装

**步骤1：添加仓库（如果尚未添加）**

> 操作位置：Linux终端

```bash
# 导入GPG密钥
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | gpg --no-default-keyring --keyring gnupg-ring:/usr/share/keyrings/wazuh.gpg --import && chmod 644 /usr/share/keyrings/wazuh.gpg

# 添加APT仓库
echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | sudo tee -a /etc/apt/sources.list.d/wazuh.list

# 更新软件包列表
sudo apt update
```

---

**步骤2：安装Agent并配置**

> 操作位置：Linux终端

```bash
# 安装Agent（指定Manager地址）
sudo WAZUH_MANAGER="192.168.1.100" apt install -y wazuh-agent

# 或编辑配置文件
sudo nano /var/ossec/etc/ossec.conf
```

配置文件主要部分：

```xml
<ossec_config>
  <client>
    <server>
      <address>192.168.1.100</address>
      <port>1514</port>
      <protocol>udp</protocol>
    </server>
  </client>
</ossec_config>
```

---

**步骤3：启动Agent**

> 操作位置：Linux终端

```bash
# 启动服务
sudo systemctl start wazuh-agent
sudo systemctl enable wazuh-agent

# 查看状态
sudo systemctl status wazuh-agent

# 测试连接
sudo /var/ossec/bin/agent_control -l
```

---

#### 【Windows环境】Agent安装

**步骤1：下载安装包**

> 操作位置：Windows浏览器

```
访问：https://packages.wazuh.com/4.x/windows/wazuh-agent-4.5.0-1.msi
下载最新版本的Wazuh Agent MSI安装包
```

---

**步骤2：命令行安装**

> 操作位置：Windows PowerShell（管理员）

```powershell
# 安装Wazuh Agent（修改WAZUH_MANAGER为实际服务器IP）
msiexec.exe /i wazuh-agent-4.5.0-1.msi /quiet WAZUH_MANAGER="192.168.1.100" WAZUH_AGENT_GROUP="default"

# 或使用以下命令（安装后自动启动）
msiexec.exe /i wazuh-agent-4.5.0-1.msi /qn WAZUH_MANAGER="192.168.1.100"
```

---

**步骤3：启动Agent服务**

> 操作位置：Windows PowerShell（管理员）

```powershell
# 启动Wazuh Agent服务
Start-Service Wazuh

# 设置服务自动启动
Set-Service Wazuh -StartupType Automatic

# 查看服务状态
Get-Service Wazuh

# 查看运行状态
sc query Wazuh
```

---

**步骤4：验证Agent连接**

> 操作位置：Linux终端（Wazuh Manager）

```bash
# 在Manager上查看已连接的Agent
sudo /var/ossec/bin/agent_control -l

# 查看活跃Agent
sudo /var/ossec/bin/agent_control -lc
```

**预期输出：**
```
CCOSS HNR WAZUH
ID: 000 Name: localhost.localdomain (manager)
ID: 001 Name: WIN10-CLIENT IP: 192.168.1.101 Active
```

---

### 13.5.5 Wazuh 基本配置

#### 【通用】文件完整性监控配置

**步骤1：编辑Agent配置**

> 操作位置：Linux终端（Wazuh Agent）

```bash
# 编辑配置文件
sudo nano /var/ossec/etc/ossec.conf
```

配置示例：

```xml
<syscheck>
  <disabled>no</disabled>
  <frequency>43200</frequency>
  <scan_on_start>yes</scan_on_start>
  
  <!-- 监控关键目录 -->
  <directories check_all="yes">/etc</directories>
  <directories check_all="yes">/usr/bin</directories>
  <directories check_all="yes">/usr/sbin</directories>
  <directories check_all="yes">/bin</directories>
  <directories check_all="yes">/sbin</directories>
  
  <!-- 忽略文件 -->
  <ignore>/etc/mtab</ignore>
  <ignore>/etc/hosts.deny</ignore>
  <ignore>/etc/mail/statistics</ignore>
  
  <!-- 告警新文件 -->
  <alert_new_files>yes</alert_new_files>
  
  <!-- 文件大小限制 -->
  <max_files_size>100MB</max_files_size>
</syscheck>
```

---

**Rootkit检测配置：**

```xml
<rootcheck>
  <disabled>no</disabled>
  <check_files>yes</check_files>
  <check_trojans>yes</check_trojans>
  <check_dev>yes</check_dev>
  <check_sys>yes</check_sys>
  <check_pids>yes</check_pids>
  <check_ports>yes</check_ports>
  <check_if>yes</check_if>
  
  <!-- 恶意软件检测 -->
  <rootkit_files>/var/ossec/etc/shared/rootkit_files.txt</rootkit_files>
  <rootkit_trojans>/var/ossec/etc/shared/rootkit_trojans.txt</rootkit_trojans>
</rootcheck>
```

---

**步骤2：重启Agent生效**

> 操作位置：Linux终端

```bash
# 重启Agent
sudo systemctl restart wazuh-agent

# 或使用ossec-control
sudo /var/ossec/bin/ossec-control restart
```

---

### 13.5.6 访问 Wazuh Dashboard

> 操作位置：浏览器

```
访问地址：https://服务器IP
默认用户名：admin
默认密码：安装时设置的密码
```

---

### 13.5.7 常见问题

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| Agent不在线 | 网络不通或配置错误 | 检查网络，确认Manager IP正确，开放1514/UDP端口 |
| Agent注册失败 | 密钥不匹配或防火墙 | 在Manager上执行 `sudo /var/ossec/bin/manage_agents` 管理Agent |
| 无告警产生 | 规则未加载或配置错误 | 查看Manager日志 `/var/ossec/logs/ossec.log`，检查配置 |
| Dashboard无法访问 | 服务未启动或端口被占用 | 检查服务状态 `sudo systemctl status wazuh-dashboard` |
| FIM不工作 | syscheck配置错误 | 检查ossec.conf中syscheck配置，确认路径存在 |
| Docker容器启动失败 | 端口冲突或资源不足 | 检查端口占用 `netstat -tlnp`，确保有足够内存 |

---

**常用命令：**

```bash
# Manager上查看Agent状态
sudo /var/ossec/bin/agent_control -l

# Manager上重启服务
sudo systemctl restart wazuh-manager

# Agent上查看日志
sudo tail -f /var/ossec/logs/ossec.log

# Agent上检查配置
sudo /var/ossec/bin/ossec-logtest

# Agent上手动注册
sudo /var/ossec/bin/agent-auth -m <Manager-IP>
```

---

## 13.6 SIEM平台配置

### 13.6.1 SIEM介绍

SIEM（Security Information and Event Management）安全信息与事件管理系统，整合了日志管理、事件关联、告警分析等功能。

### 13.6.2 日志源配置

#### 【Windows环境】Windows日志收集

**步骤1：安装Windows Agent（参考13.5.4节）**

> 操作位置：Windows服务器

在Windows服务器上安装Wazuh Agent或Winlogbeat

---

**步骤2：安装Sysmon增强日志（可选）**

> 操作位置：Windows服务器

```powershell
# 下载Sysmon
# 访问 https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon

# 创建配置文件 sysmonconfig.xml
# 参考 https://github.com/SwiftOnSecurity/sysmon-config

# 安装Sysmon（管理员 PowerShell）
.\Sysmon64.exe -accepteula -i sysmonconfig.xml

# 查看Sysmon状态
.\Sysmon64.exe -c
```

---

#### 【Linux环境】Linux日志收集

**步骤1：配置rsyslog**

> 操作位置：Linux终端

```bash
# 编辑rsyslog配置
sudo nano /etc/rsyslog.conf
```

添加：

```
# 将本地日志转发到SIEM
*.* @@SIEM_SERVER:514
```

---

**步骤2：安装并配置auditd**

> 操作位置：Linux终端

```bash
# 安装auditd
sudo apt install -y auditd

# 配置审计规则
sudo nano /etc/audit/rules.d/audit.rules
```

添加规则：

```
# 监控/etc/passwd修改
-w /etc/passwd -p wa -k identity

# 监控/etc/shadow访问
-w /etc/shadow -p r -k identity

# 监控命令执行
-a always,exit -F arch=b64 -S execve -k execution
```

---

**步骤3：启动服务**

> 操作位置：Linux终端

```bash
# 重启rsyslog
sudo systemctl restart rsyslog

# 启动auditd
sudo systemctl start auditd
sudo systemctl enable auditd
```

---

### 13.6.3 告警规则配置

#### 【通用】Elasticsearch Watcher配置

**步骤1：创建Watcher告警**

> 操作位置：Kibana Dev Tools

```bash
# 创建告警watcher
PUT _watcher/watch/brute_force_alert
{
  "trigger": {
    "schedule": {
      "interval": "5m"
    }
  },
  "input": {
    "search": {
      "request": {
        "indices": ["filebeat-*", "wazuh-alerts-*"],
        "body": {
          "size": 0,
          "query": {
            "bool": {
              "must": [
                {
                  "match": {
                    "event.action": "failed_login"
                  }
                },
                {
                  "range": {
                    "@timestamp": {
                      "gte": "now-5m"
                    }
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_ip": {
              "terms": {
                "field": "source.ip",
                "size": 10
              }
            }
          }
        }
      }
    }
  },
  "condition": {
    "compare": {
      "ctx.payload.hits.total": {
        "gt": 10
      }
    }
  },
  "actions": {
    "log_alert": {
      "logging": {
        "text": "Brute force attack detected: {{ctx.payload.hits.total}} failed logins in the last 5 minutes from {{#ctx.payload.aggregations.by_ip.buckets}}{{key}} ({{doc_count}}), {{/ctx.payload.aggregations.by_ip.buckets}}"
      }
    },
    "send_email": {
      "email": {
        "to": "admin@example.com",
        "subject": "Security Alert: Brute force attack detected",
        "body": "Multiple failed login attempts detected. Check the SIEM for details."
      }
    }
  }
}
```

---

### 13.6.4 关联分析配置

#### 【通用】检测暴力破解攻击

```
规则条件：
1. 同一IP在5分钟内出现超过10次登录失败
2. 触发高优先级告警
3. 自动封禁IP（可选，需要联动防火墙）

检测逻辑：
- 收集SSH、FTP、HTTP等认证日志
- 统计失败次数
- 当次数超过阈值时触发告警
```

#### 【通用】检测数据外泄

```
规则条件：
1. 用户下载超过100MB文件
2. 同时出现异常登录地点
3. 触发告警并通知管理员

检测逻辑：
- 监控网络流量和文件访问
- 关联用户行为和位置信息
- 异常时触发告警
```

---

## 13.7 安全监控大屏

### 13.7.1 Grafana 安装

#### 【Linux环境】APT安装

**步骤1：安装Grafana**

> 操作位置：Linux终端

```bash
# 安装依赖
sudo apt install -y apt-transport-https software-properties-common wget

# 添加Grafana GPG密钥
wget -q -O /usr/share/keyrings/grafana.key https://apt.grafana.com/gpg.key

# 添加APT仓库
echo "deb [signed-by=/usr/share/keyrings/grafana.key] https://apt.grafana.com stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list

# 更新并安装
sudo apt update
sudo apt install -y grafana
```

---

**步骤2：启动Grafana**

> 操作位置：Linux终端

```bash
# 启动服务
sudo systemctl start grafana-server
sudo systemctl enable grafana-server

# 查看状态
sudo systemctl status grafana-server
```

---

#### 【Docker环境】Docker安装

**步骤1：启动Grafana**

> 操作位置：Linux终端

```bash
# 启动Grafana容器
docker run -d --name=grafana \
  -p 3000:3000 \
  -e GF_SECURITY_ADMIN_PASSWORD=admin \
  -e GF_SECURITY_ADMIN_USER=admin \
  -v grafana-data:/var/lib/grafana \
  grafana/grafana:latest

# 查看状态
docker ps | grep grafana
```

---

### 13.7.2 配置数据源

**步骤1：添加数据源**

> 操作位置：浏览器，Grafana Web界面

```
1. 访问 http://服务器IP:3000
2. 使用 admin/admin 登录（首次登录需修改密码）
3. 点击左侧菜单"Configuration" → "Data Sources"
4. 点击"Add data source"
5. 选择"Elasticsearch"
6. 配置连接信息：
   - URL: http://localhost:9200
   - Index name: logs-*
   - Time field: @timestamp
7. 点击"Save & test"
```

---

### 13.7.3 安全仪表盘配置

**常用仪表盘配置：**

| 仪表盘 | 内容 | 数据源 |
|--------|------|--------|
| 安全事件概览 | 总告警数、趋势图 | Elasticsearch |
| 告警趋势图 | 按时间统计告警 | Elasticsearch |
| TOP攻击源 | 攻击IP排名 | Elasticsearch |
| 受影响资产 | 资产告警统计 | Elasticsearch |
| 漏洞分布 | 漏洞类型分布 | Wazuh |
| 合规性状态 | PCI DSS等合规状态 | Wazuh |

---

## 13.8 SOC运营最佳实践

### 13.8.1 流程建立

- **告警分级标准**：高危、中危、低危
- **事件响应流程**：发现→确认→分析→处置→恢复→总结
- **升级机制**：低级别分析师→高级分析师→应急响应团队
- **报告模板**：日报、周报、月报

### 13.8.2 人员分工

| 角色 | 职责 |
|------|------|
| 一级分析师 | 告警初筛、事件分类、初步响应 |
| 二级分析师 | 事件分析、深度调查、取证 |
| 三级分析师 | 高级分析、威胁狩猎、APT分析 |
| 应急响应团队 | 事件处置、溯源、恢复 |

### 13.8.3 持续改进

- **定期复盘**：每周/月复盘安全事件
- **规则优化**：根据误报/漏报调整规则
- **威胁情报更新**：定期更新威胁情报源
- **红蓝对抗**：定期进行攻防演练

---

## 13.9 常见问题汇总

### 【通用】环境问题

| 问题 | 解决方案 |
|------|----------|
| Elasticsearch内存不足 | 修改`ES_JAVA_OPTS=-Xms2g -Xmx2g`，增加虚拟机内存 |
| Kibana无法启动 | 等待ES完全启动后重试，检查内存和磁盘空间 |
| 端口被占用 | 使用`netstat -tlnp`检查端口占用，杀掉冲突进程 |
| 容器无法pull镜像 | 检查Docker配置，或使用国内镜像加速器 |

### 【Docker环境】特定问题

| 问题 | 解决方案 |
|------|----------|
| Elasticsearch容器启动失败 | 检查内存限制，Linux下执行`sysctl -w vm.max_map_count=262144` |
| Kibana连接ES超时 | 等待ES完全启动（health status变为green），检查网络 |
| 数据卷权限问题 | 删除容器和数据卷重新创建，或修改本地目录权限 |
| docker-compose版本问题 | 更新到最新版本`apt install docker-compose` |

### 【Linux环境】特定问题

| 问题 | 解决方案 |
|------|----------|
| apt安装失败 | 检查网络连接，更换镜像源 |
| 服务启动失败 | 查看systemctl status和服务日志 |
| 磁盘空间不足 | 清理日志，删除旧数据，扩大磁盘 |

---

## 13.10 本章小结

本章介绍了蓝队SOC安全运营环境的搭建，包括：

1. **ELK Stack**：完整的日志收集、存储、分析平台
2. **Security Onion**：集成化的安全监控平台
3. **Suricata**：网络入侵检测/防御系统
4. **Wazuh**：主机入侵检测系统
5. **Grafana**：可视化监控大屏

通过本章的学习，您将掌握SOC环境的核心组件搭建，为安全运营工作打下坚实基础。
