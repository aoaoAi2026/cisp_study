
## 4.18 ELK日志平台深入

### 4.18.1 ELK架构详解

ELK Stack是Elasticsearch、Logstash、Kibana三个开源软件的组合，是目前最流行的日志集中化管理和分析平台。Elasticsearch是一个分布式搜索引擎，负责存储和索引日志数据；Logstash是数据收集处理管道，负责从各种来源采集日志、进行过滤转换后输出到Elasticsearch；Kibana是可视化界面，提供了丰富的图表、仪表盘和搜索功能。

后来，Elastic公司又推出了Beats系列轻量级数据采集器，包括Filebeat（日志文件采集）、Metricbeat（指标采集）、Packetbeat（网络数据采集）、Winlogbeat（Windows事件日志）等，形成了更完整的ELK技术栈（也称为Elastic Stack）。Beats相比Logstash更加轻量，资源占用更少，适合在端点设备上部署。

```
ELK架构数据流：

  [日志源]      [采集层]       [处理层]       [存储索引层]    [可视化层]
  ────────      ────────       ────────       ────────────    ────────
  应用日志 ──→  Filebeat ──→  Logstash ──→  Elasticsearch ─→  Kibana
  系统日志 ──→               (过滤/转换)     (分布式存储)     (搜索/图表)
  网络设备 ──→
  数据库   ──→
  云平台   ──→

  可选组件：
  - Beats：轻量级采集器（替代或补充Logstash采集）
  - Kafka：消息队列（缓冲层，削峰填谷）
  - Redis：缓存/消息队列（轻量级缓冲）
```

**各组件核心功能：**

1. **Elasticsearch**：
   - 分布式RESTful搜索引擎，基于Lucene
   - 近实时（NRT）的索引和搜索
   - 水平扩展，支持PB级数据
   - 丰富的查询DSL（Domain Specific Language）
   - 聚合分析能力

2. **Logstash**：
   - 数据收集处理引擎
   - 支持200+输入插件（文件、syslog、kafka、数据库等）
   - 强大的过滤能力（grok模式匹配、date解析、mutate转换等）
   - 多种输出目标（Elasticsearch、文件、消息队列等）

3. **Kibana**：
   - Elasticsearch的数据可视化界面
   - 多种图表类型（折线图、柱状图、饼图、热力图等）
   - 仪表盘（Dashboard）自定义组合
   - Discover：交互式日志搜索
   - Dev Tools：API调试工具
   - Alerting：告警功能（商业版）

4. **Beats系列**：
   - Filebeat：日志文件采集
   - Metricbeat：系统和服务指标
   - Packetbeat：网络数据包分析
   - Winlogbeat：Windows事件日志
   - Auditbeat：审计数据
   - Heartbeat：可用性监控

```bash
# ELK版本兼容性说明
# 建议三个组件使用相同的主版本号
# 例如：Elasticsearch 7.17.0 + Logstash 7.17.0 + Kibana 7.17.0

# 查看各组件版本
/usr/share/elasticsearch/bin/elasticsearch --version
/usr/share/logstash/bin/logstash --version
/usr/share/kibana/bin/kibana --version
```

### 4.18.2 部署概览

ELK Stack有多种部署方式，从单机单节点到分布式集群，根据数据量和可用性要求选择合适的架构。对于中小规模环境（每天几GB到几十GB日志），单机部署即可满足需求；对于大规模生产环境，建议采用集群部署，至少3个Elasticsearch节点以保证高可用。

部署方式包括：直接安装二进制包、使用Docker容器、使用Kubernetes编排、以及使用Elastic Cloud托管服务。Docker部署方式快速便捷，适合开发测试环境；生产环境建议使用RPM/DEB包或Ansible自动化部署，便于管理和维护。

```bash
# ========== 单机部署（Docker Compose）==========
# 适合快速测试和中小规模环境

# 创建docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - esdata:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
      - "9300:9300"
    networks:
      - elk

  logstash:
    image: docker.elastic.co/logstash/logstash:7.17.0
    container_name: logstash
    volumes:
      - ./logstash/config:/usr/share/logstash/config
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    ports:
      - "5044:5044"
      - "514:514/udp"
      - "9600:9600"
    environment:
      - "LS_JAVA_OPTS=-Xms256m -Xmx256m"
    networks:
      - elk
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:7.17.0
    container_name: kibana
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    networks:
      - elk
    depends_on:
      - elasticsearch

volumes:
  esdata:
    driver: local

networks:
  elk:
    driver: bridge
EOF

# 启动ELK Stack
docker-compose up -d

# 查看状态
docker-compose ps

# 验证Elasticsearch
curl http://localhost:9200

# 访问Kibana
# 浏览器打开 http://localhost:5601
```

```bash
# ========== RPM/DEB包部署（CentOS示例）==========
# 适合生产环境

# 1. 安装Java
yum install -y java-11-openjdk

# 2. 导入Elastic GPG密钥
rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch

# 3. 添加YUM源
cat > /etc/yum.repos.d/elasticsearch.repo << 'EOF'
[elasticsearch]
name=Elasticsearch repository for 7.x packages
baseurl=https://artifacts.elastic.co/packages/7.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=1
autorefresh=1
type=rpm-md
EOF

# 4. 安装Elasticsearch
yum install -y elasticsearch

# 配置Elasticsearch
cat > /etc/elasticsearch/elasticsearch.yml << 'EOF'
cluster.name: security-cluster
node.name: node-1
path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch
network.host: 0.0.0.0
http.port: 9200
discovery.type: single-node
# 生产环境配置集群发现
# discovery.seed_hosts: ["node1", "node2", "node3"]
# cluster.initial_master_nodes: ["node1", "node2", "node3"]
EOF

# 启动并设置开机自启
systemctl enable elasticsearch
systemctl start elasticsearch

# 5. 安装Logstash
yum install -y logstash

# 6. 安装Kibana
yum install -y kibana

cat > /etc/kibana/kibana.yml << 'EOF'
server.port: 5601
server.host: "0.0.0.0"
elasticsearch.hosts: ["http://localhost:9200"]
EOF

systemctl enable kibana
systemctl start kibana

# 7. 安装Filebeat（在被监控服务器上）
yum install -y filebeat
```

```bash
# ========== Logstash配置示例 ==========
# /etc/logstash/conf.d/linux-logs.conf

input {
  # 接收Filebeat发送的日志
  beats {
    port => 5044
    host => "0.0.0.0"
  }
  
  # 接收syslog（UDP）
  syslog {
    port => 514
    type => "syslog"
  }
  
  # 接收syslog（TCP）
  tcp {
    port => 514
    type => "syslog-tcp"
  }
}

filter {
  # Linux系统日志解析
  if [type] == "syslog" {
    grok {
      match => {
        "message" => "%{SYSLOGTIMESTAMP:syslog_timestamp} %{SYSLOGHOST:syslog_hostname} %{DATA:syslog_program}(?:\[%{POSINT:syslog_pid}\])?: %{GREEDYDATA:syslog_message}"
      }
    }
    
    date {
      match => ["syslog_timestamp", "MMM  d HH:mm:ss", "MMM dd HH:mm:ss"]
      target => "@timestamp"
    }
  }
  
  # Nginx访问日志解析
  if [fields][log_type] == "nginx-access" {
    grok {
      match => {
        "message" => '%{IPORHOST:client_ip} %{DATA:ident} %{DATA:auth} \[%{HTTPDATE:timestamp}\] "%{WORD:method} %{URIPATHPARAM:request} HTTP/%{NUMBER:http_version}" %{INT:status} %{INT:body_bytes_sent} "%{DATA:referer}" "%{DATA:user_agent}"'
      }
    }
    
    date {
      match => ["timestamp", "dd/MMM/yyyy:HH:mm:ss Z"]
      target => "@timestamp"
    }
    
    mutate {
      convert => {
        "status" => "integer"
        "body_bytes_sent" => "integer"
      }
    }
  }
  
  # SSH登录日志提取
  if "sshd" in [program] {
    if [message] =~ /Failed password/ {
      grok {
        match => {
          "message" => "Failed password for %{DATA:user} from %{IP:src_ip} port %{INT:src_port}"
        }
      }
      mutate {
        add_field => { "event_type" => "auth_failure" }
      }
    }
    
    if [message] =~ /Accepted/ {
      grok {
        match => {
          "message" => "Accepted %{WORD:auth_method} for %{DATA:user} from %{IP:src_ip} port %{INT:src_port}"
        }
      }
      mutate {
        add_field => { "event_type" => "auth_success" }
      }
    }
  }
}

output {
  # 输出到Elasticsearch
  elasticsearch {
    hosts => ["http://localhost:9200"]
    index => "%{[@metadata][beat]}-%{+YYYY.MM.dd}"
    # 安全日志单独索引
    if [type] == "syslog" {
      index => "syslog-%{+YYYY.MM.dd}"
    }
    if [fields][log_type] == "nginx-access" {
      index => "nginx-access-%{+YYYY.MM.dd}"
    }
  }
  
  # 调试输出（生产环境注释掉）
  # stdout {
  #   codec => rubydebug
  # }
}
```

```bash
# ========== Filebeat配置示例 ==========
# /etc/filebeat/filebeat.yml

filebeat.inputs:
  # 系统日志
  - type: log
    enabled: true
    paths:
      - /var/log/syslog
      - /var/log/messages
    fields:
      log_type: system
    fields_under_root: true

  # 认证日志
  - type: log
    enabled: true
    paths:
      - /var/log/auth.log
      - /var/log/secure
    fields:
      log_type: auth
    fields_under_root: true

  # 审计日志
  - type: log
    enabled: true
    paths:
      - /var/log/audit/audit.log
    fields:
      log_type: audit
    fields_under_root: true
    multiline.pattern: '^type='
    multiline.negate: true
    multiline.match: after

  # Nginx访问日志
  - type: log
    enabled: true
    paths:
      - /var/log/nginx/access.log
    fields:
      log_type: nginx-access
    fields_under_root: true

  # Nginx错误日志
  - type: log
    enabled: true
    paths:
      - /var/log/nginx/error.log
    fields:
      log_type: nginx-error
    fields_under_root: true

# 输出到Logstash
output.logstash:
  hosts: ["logstash.example.com:5044"]
  
  # 启用SSL/TLS
  # ssl.certificate_authorities: ["/etc/pki/root/ca.pem"]
  # ssl.certificate: "/etc/pki/client/cert.pem"
  # ssl.key: "/etc/pki/client/cert.key"

# 输出到Elasticsearch（无Logstash场景）
# output.elasticsearch:
#   hosts: ["elasticsearch.example.com:9200"]
#   protocol: "https"
#   username: "elastic"
#   password: "changeme"

# 启用Filebeat模块（可选）
filebeat.config.modules:
  path: ${path.config}/modules.d/*.yml
  reload.enabled: false

# 启用system模块
# filebeat modules enable system
# filebeat modules enable nginx
# filebeat modules enable auditd

# 日志级别
logging.level: info
logging.to_files: true
logging.files:
  path: /var/log/filebeat
  name: filebeat
  keepfiles: 7
```

### 4.18.3 应用场景

ELK Stack在安全领域有广泛的应用场景，从日志集中管理到安全事件分析，从合规审计到威胁检测，都可以通过ELK Stack来实现。其强大的搜索和聚合能力使得安全分析师可以快速从海量日志中挖掘出有价值的安全信息。

常见的安全应用场景包括：安全信息与事件管理（SIEM）、用户行为分析（UEBA）、威胁情报整合、合规性报告自动化、以及安全运营中心（SOC）的日常监控。结合Elastic的机器学习功能（商业版），还可以实现异常检测和预测性分析。

```bash
# ========== 场景1: 安全事件监控仪表盘 ==========
# Kibana中创建的常用安全可视化

# 1. 认证失败次数趋势图（折线图）
# 索引模式: syslog-* 或 filebeat-*
# 聚合: Count
# 分桶: Date Histogram (@timestamp)
# 过滤器: event_type: "auth_failure" 或 message: "Failed password"

# 2. TOP攻击来源IP（水平柱状图）
# 聚合: Count
# 分桶: Terms (src_ip), Size: 10, Order: Descending
# 过滤器: event_type: "auth_failure"

# 3. 攻击目标用户名分布（饼图）
# 聚合: Count
# 分桶: Terms (user.keyword)
# 过滤器: event_type: "auth_failure"

# 4. 最近安全事件列表（数据表）
# 列: @timestamp, hostname, program, message, src_ip
# 按时间倒序
# 过滤器: level:(error OR critical OR alert)

# 5. HTTP状态码分布（饼图）
# 索引: nginx-access-*
# 聚合: Count
# 分桶: Terms (status)

# 6. 访问量TOP URL（柱状图）
# 聚合: Count
# 分桶: Terms (request.keyword), Size: 20

# 7. 4xx/5xx错误率趋势图
# 聚合: Count
# 分桶: Date Histogram (@timestamp)
# 过滤器: status:[400 TO 599]

# ========== 场景2: 威胁检测查询示例 ==========

# 在Kibana的Discover或Dev Tools中执行

# 1. 查找暴力破解的IP（5分钟内失败>10次）
# 这需要结合Elasticsearch的聚合查询
GET /syslog-*/_search
{
  "size": 0,
  "query": {
    "bool": {
      "must": [
        { "match": { "message": "Failed password" } },
        { "range": { "@timestamp": { "gte": "now-1h" } } }
      ]
    }
  },
  "aggs": {
    "by_ip": {
      "terms": {
        "field": "src_ip",
        "min_doc_count": 50,
        "size": 20
      },
      "aggs": {
        "by_user": {
          "terms": {
            "field": "user.keyword",
            "size": 10
          }
        }
      }
    }
  }
}

# 2. 查找同一IP多次尝试不同用户名（用户名枚举）
GET /syslog-*/_search
{
  "size": 0,
  "query": {
    "match": { "message": "Invalid user" }
  },
  "aggs": {
    "by_ip": {
      "terms": { "field": "src_ip", "size": 10 },
      "aggs": {
        "unique_users": {
          "cardinality": { "field": "user.keyword" }
        },
        "users": {
          "terms": { "field": "user.keyword", "size": 20 }
        }
      }
    }
  }
}

# 3. 查找Web攻击特征
GET /nginx-access-*/_search
{
  "query": {
    "bool": {
      "must": [
        { "range": { "@timestamp": { "gte": "now-24h" } } }
      ],
      "should": [
        { "regexp": { "request.keyword": ".*union.*select.*" } },
        { "regexp": { "request.keyword": ".*<script.*" } },
        { "regexp": { "request.keyword": ".*\.\./.*" } },
        { "match": { "user_agent": "sqlmap" } },
        { "match": { "user_agent": "nikto" } }
      ],
      "minimum_should_match": 1
    }
  },
  "sort": [
    { "@timestamp": "desc" }
  ],
  "size": 100
}
```

```bash
# ========== 场景3: 合规审计报告 ==========

# PCI-DSS、HIPAA等合规要求的日志审计
# 使用Kibana的Reporting功能生成报告

# 1. 用户活动审计报告
# - 所有用户登录/登出事件
# - 特权用户操作记录
# - 失败的认证尝试
# - 账户创建/删除/修改

# 2. 数据访问审计报告
# - 敏感文件访问记录
# - 数据库查询记录
# - 数据导出操作

# 3. 系统变更审计
# - 配置文件修改
# - 软件安装/卸载
# - 系统服务变更
# - 网络配置变更

# 4. 审计跟踪完整性
# - 日志文件完整性校验
# - 审计日志访问记录
# - 日志保留周期验证

# ========== 场景4: 安全事件响应 ==========

# 当发生安全事件时，使用ELK快速溯源

# 1. 定位受影响主机
# 搜索特定IP或恶意软件相关的日志

# 2. 时间线重建
# 通过@timestamp排序，重建攻击时间线

# 3. 横向移动检测
# 查找攻击源IP访问过的其他主机

# 4. 数据泄露评估
# 统计异常的数据传输量
# 查找可疑的外发连接

# 使用KQL（Kibana Query Language）快速查询示例：
# 
# 查找特定IP的所有活动：
# src_ip: "192.168.1.100"
# 
# 查找最近1小时的错误：
# level:error and @timestamp > now-1h
# 
# 查找SSH登录失败：
# program:sshd and message:"Failed password"
# 
# 组合条件：
# program:nginx and status:404 and @timestamp:[now-24h to now]
```

## 4.19 日志集中化管理进阶

### 4.19.1 syslog集中服务器高可用搭建

日志集中服务器是企业日志管理架构的核心组件，一旦发生故障，将导致日志丢失，影响安全监控和事件响应。因此，生产环境必须确保日志服务器的高可用性。常见的高可用方案包括：主备模式（Active-Standby）、双活模式（Active-Active）、以及基于负载均衡的集群模式。

主备模式通过Keepalived或Pacemaker等高可用软件实现VIP漂移，主节点故障时VIP自动切换到备节点。这种方案架构简单，易于维护，但备节点资源利用率低。双活模式下所有节点都同时处理流量，通过负载均衡器分发，资源利用率高，但架构更复杂，需要考虑数据一致性问题。

```bash
# ========== 方案1: Keepalived + rsyslog 主备模式 ==========

# 安装Keepalived
yum install keepalived   # CentOS
apt-get install keepalived  # Debian/Ubuntu

# 主节点配置 /etc/keepalived/keepalived.conf
cat > /etc/keepalived/keepalived.conf << 'EOF'
! Configuration File for keepalived

global_defs {
    notification_email {
        admin@example.com
    }
    notification_email_from keepalived@log-master
    smtp_server 127.0.0.1
    smtp_connect_timeout 30
    router_id LOG_MASTER
}

# 检测rsyslog进程的脚本
vrrp_script chk_rsyslog {
    script "/usr/bin/killall -0 rsyslogd"
    interval 2
    weight -20
}

vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 100
    advert_int 1
    nopreempt
    
    authentication {
        auth_type PASS
        auth_pass secret123
    }
    
    virtual_ipaddress {
        10.0.0.100/24
    }
    
    track_script {
        chk_rsyslog
    }
    
    # 主节点切换时的通知脚本
    notify_master "/etc/keepalived/notify.sh master"
    notify_backup "/etc/keepalived/notify.sh backup"
    notify_fault "/etc/keepalived/notify.sh fault"
}
EOF

# 备节点配置
# state BACKUP
# priority 90
# 其他配置相同

# 通知脚本
cat > /etc/keepalived/notify.sh << 'EOF'
#!/bin/bash
TYPE=$1
HOSTNAME=$(hostname)
DATE=$(date '+%Y-%m-%d %H:%M:%S')

logger -t keepalived "Keepalived state changed to $TYPE on $HOSTNAME"

# 发送邮件通知
echo "Keepalived on $HOSTNAME changed to $TYPE at $DATE" | \
    mail -s "Keepalived Alert: $TYPE" admin@example.com
EOF
chmod +x /etc/keepalived/notify.sh

# 启用并启动
systemctl enable keepalived
systemctl start keepalived

# 验证VIP
ip addr show eth0
```

```bash
# ========== 方案2: 负载均衡 + rsyslog集群 ==========
# 使用Nginx或HAProxy做TCP负载均衡

# HAProxy配置示例
# /etc/haproxy/haproxy.cfg

cat > /etc/haproxy/haproxy.cfg << 'EOF'
global
    log /dev/log local0
    log /dev/log local1 notice
    chroot /var/lib/haproxy
    stats socket /run/haproxy/admin.sock mode 660 level admin
    stats timeout 30s
    user haproxy
    group haproxy
    daemon

defaults
    log     global
    mode    tcp
    option  tcplog
    option  dontlognull
    timeout connect 5s
    timeout client  12h
    timeout server  12h

# 统计页面
listen stats
    bind *:8404
    stats enable
    stats uri /stats
    stats auth admin:password123

# Syslog TCP负载均衡
listen syslog-tcp
    bind *:514
    mode tcp
    balance roundrobin
    option tcp-check
    server log-node1 10.0.0.101:514 check inter 5000 rise 2 fall 3
    server log-node2 10.0.0.102:514 check inter 5000 rise 2 fall 3
    server log-node3 10.0.0.103:514 check inter 5000 rise 2 fall 3

# Syslog UDP负载均衡（使用balance-rr模块）
# 注意：HAProxy对UDP的支持有限，可以考虑使用IPVS或DNS轮询

# TLS Syslog
listen syslog-tls
    bind *:6514 ssl crt /etc/haproxy/certs/log-server.pem
    mode tcp
    balance roundrobin
    server log-node1 10.0.0.101:6514 check ssl verify none
    server log-node2 10.0.0.102:6514 check ssl verify none
EOF

systemctl restart haproxy
```

```bash
# ========== 方案3: 日志存储高可用 ==========
# 使用GlusterFS或NFS共享存储

# GlusterFS分布式存储方案
# 在所有日志节点上安装GlusterFS
yum install centos-release-gluster
yum install glusterfs-server

# 初始化集群（在node1上执行）
gluster peer probe log-node2
gluster peer probe log-node3

# 创建分布式复制卷
gluster volume create log-vol replica 3 \
    log-node1:/data/gluster/logs \
    log-node2:/data/gluster/logs \
    log-node3:/data/gluster/logs

gluster volume start log-vol

# 挂载到日志目录
mount -t glusterfs log-node1:/log-vol /var/log/remote

# 写入fstab
echo "log-node1:/log-vol /var/log/remote glusterfs defaults,_netdev 0 0" >> /etc/fstab
```

### 4.19.2 多设备日志收集方案

现代企业IT环境包含多种类型的设备和系统，包括Linux服务器、Windows服务器、网络设备（交换机、路由器、防火墙）、安全设备（IDS/IPS、WAF）、数据库、中间件、云服务等。每种设备的日志格式和传输方式都不同，需要统一的日志收集方案来管理。

设计多设备日志收集方案时，需要考虑以下因素：日志传输协议（UDP/TCP/TLS）、日志格式标准化、日志量预估、设备数量和地理分布、以及安全合规要求。推荐采用分层架构：边缘采集层（设备/Agent）→ 汇聚层（中继服务器）→ 核心层（中央日志集群）。

```bash
# ========== 1. Linux/Unix服务器日志收集 ==========
# 使用rsyslog或syslog-ng转发

# 标准化配置脚本
cat > /etc/rsyslog.d/99-forward.conf << 'EOF'
# 统一转发模板
$template RFC5424Format,"<%PRI%>1 %timegenerated:::date-rfc3339% %HOSTNAME% %syslogtag%%msg:::sp-if-no-1st-sp%%msg:::drop-last-lf%\n"

# 转发到中央日志服务器（主备）
*.* @@log-vip.example.com:514;RFC5424Format

# 本地磁盘队列（网络故障时缓冲）
$WorkDirectory /var/spool/rsyslog
$ActionQueueType LinkedList
$ActionQueueFileName forward_queue
$ActionQueueMaxDiskSpace 5g
$ActionQueueSaveOnShutdown on
$ActionResumeRetryCount -1
EOF

systemctl restart rsyslog

# ========== 2. Windows服务器日志收集 ==========
# 使用NXLog或Winlogbeat

# NXLog配置示例 (Windows)
# C:\Program Files\nxlog\conf\nxlog.conf
cat > nxlog.conf << 'EOF'
define ROOT C:\Program Files\nxlog

Moduledir %ROOT%\modules
CacheDir %ROOT%\data
Pidfile %ROOT%\data\nxlog.pid
SpoolDir %ROOT%\data
LogFile %ROOT%\data\nxlog.log

# 输入模块：Windows事件日志
<Input eventlog>
    Module      im_msvistalog
    Query       <QueryList>\
                    <Query Id="0">\
                        <Select Path="Security">*</Select>\
                        <Select Path="System">*</Select>\
                        <Select Path="Application">*</Select>\
                    </Query>\
                </QueryList>
</Input>

# 转换为JSON格式
<Output out>
    Module      om_ssl
    Host        log-server.example.com
    Port        6514
    CAFile      %ROOT%\cert\ca.pem
    CertFile    %ROOT%\cert\client.pem
    CertKeyFile %ROOT%\cert\client-key.pem
    Exec        to_json();
</Output>

<Route 1>
    Path        eventlog => out
</Route>
EOF

# ========== 3. 网络设备日志收集 ==========
# 交换机、路由器、防火墙等通常支持syslog

# Cisco设备配置示例：
# logging host 10.0.0.100
# logging trap informational
# logging source-interface Vlan1
# service timestamps log datetime msec localtime show-timezone

# Juniper设备配置示例：
# set system syslog host 10.0.0.100 any info
# set system syslog host 10.0.0.100 facility-override local0

# 华为设备配置示例：
# info-center enable
# info-center loghost 10.0.0.100 facility local0
# info-center source default channel loghost log level informational

# 在rsyslog服务器端按设备类型分类
# /etc/rsyslog.d/10-network-devices.conf

# 按IP段区分设备类型
if $fromhost-ip startswith '10.0.1.' then {
    action(type="omfile" file="/var/log/network/switch/%fromhost-ip%.log")
    stop
}

if $fromhost-ip startswith '10.0.2.' then {
    action(type="omfile" file="/var/log/network/firewall/%fromhost-ip%.log")
    stop
}

if $fromhost-ip startswith '10.0.3.' then {
    action(type="omfile" file="/var/log/network/router/%fromhost-ip%.log")
    stop
}
```

```bash
# ========== 4. 安全设备日志收集 ==========
# IDS/IPS、WAF、杀毒软件、漏洞扫描器等

# Snort/Suricata IDS日志
# /etc/suricata/suricata.yaml 中配置
# outputs:
#   - syslog:
#       enabled: yes
#       facility: local5
#       priority: info
#       level: 3

# OSSEC HIDS日志转发
# /var/ossec/etc/ossec.conf
# <syslog_output>
#   <server>10.0.0.100</server>
#   <port>514</port>
#   <level>3</level>
# </syslog_output>

# 启用syslog输出
# /var/ossec/bin/ossec-control enable client-syslog

# ========== 5. 应用日志收集 ==========
# Java应用（Log4j）：
# log4j.appender.SYSLOG=org.apache.log4j.net.SyslogAppender
# log4j.appender.SYSLOG.syslogHost=log-server.example.com
# log4j.appender.SYSLOG.facility=LOCAL4
# log4j.appender.SYSLOG.layout=org.apache.log4j.PatternLayout

# Nginx日志转发：
# 使用Filebeat或rsyslog的imfile模块

# rsyslog imfile模块读取Nginx日志
# /etc/rsyslog.d/nginx.conf
module(load="imfile" PollingInterval="10")

input(type="imfile"
    File="/var/log/nginx/access.log"
    Tag="nginx-access"
    Facility="local6"
    Severity="info"
    PersistStateInterval="1000"
)

input(type="imfile"
    File="/var/log/nginx/error.log"
    Tag="nginx-error"
    Facility="local6"
    Severity="error"
)

# ========== 6. 数据库日志收集 ==========
# MySQL审计日志
# MySQL Enterprise Audit或MariaDB Audit Plugin

# 配置MariaDB审计插件
# INSTALL PLUGIN server_audit SONAME 'server_audit.so';
# SET GLOBAL server_audit_logging=ON;
# SET GLOBAL server_audit_events='CONNECT,QUERY,TABLE';
# SET GLOBAL server_audit_output_type='syslog';
# SET GLOBAL server_audit_syslog_facility='LOG_LOCAL7';

# PostgreSQL日志
# postgresql.conf中配置：
# log_destination = 'syslog'
# syslog_facility = 'LOCAL3'
# syslog_ident = 'postgres'
```

### 4.19.3 日志存储规划

日志存储规划是日志集中化管理的重要组成部分，直接影响系统性能、成本和合规性。规划时需要综合考虑日志增长量、保留周期、查询性能、备份策略、以及存储成本等因素。合理的存储规划应该是分层的：热数据（近期，频繁查询）使用高速存储，冷数据（远期，偶尔查询）使用低成本存储。

日志量估算公式：每日日志总量 = 设备数量 × 单设备日均日志量。单台Linux服务器通常每天产生几百MB到几GB日志，Web服务器根据访问量可能从几百MB到几十GB不等。建议按预估峰值的1.5-2倍来规划存储容量，预留足够的缓冲空间。

```bash
# ========== 存储分层策略 ==========
#
# 热存储（Hot）：最近7-30天
# - SSD或高性能SAS盘
# - 用于日常查询和实时监控
# - 全索引，查询速度快
#
# 温存储（Warm）：30-90天
# - 大容量SAS盘
# - 用于定期审计和调查
# - 部分索引，查询速度中等
#
# 冷存储（Cold）：90天-1年
# - SATA盘或对象存储
# - 用于合规归档和历史追溯
# - 低索引或无索引，查询速度慢
#
# 归档存储（Archive）：1年以上
# - 磁带库或云归档存储
# - 仅用于合规保留
# - 不可直接查询，需要先恢复

# ========== 容量估算示例 ==========
#
# 假设：
# - 100台Linux服务器，每台每天500MB日志
# - 20台Web服务器，每台每天2GB日志
# - 10台网络设备，每台每天100MB日志
# - 保留期：90天在线 + 365天归档
#
# 计算：
# 日增总量 = (100 × 0.5) + (20 × 2) + (10 × 0.1) = 50 + 40 + 1 = 91 GB/天
# 90天在线存储 = 91 × 90 = 8190 GB ≈ 8 TB
# 365天归档存储 = 91 × 365 = 33215 GB ≈ 33 TB
#
# 考虑压缩（通常压缩比3:1到10:1）：
# 90天在线（不压缩，保证查询性能）：8 TB
# 365天归档（压缩）：33 TB / 5 = 6.6 TB
# 总存储需求 ≈ 15 TB（含RAID和冗余）

# ========== Elasticsearch索引生命周期管理（ILM）==========
# 自动管理索引的生命周期

# 创建ILM策略
PUT _ilm/policy/logs_policy
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_size": "50GB",
            "max_age": "7d"
          }
        }
      },
      "warm": {
        "min_age": "7d",
        "actions": {
          "shrink": {
            "number_of_shards": 1
          },
          "forcemerge": {
            "max_num_segments": 1
          }
        }
      },
      "cold": {
        "min_age": "30d",
        "actions": {
          "freeze": {}
        }
      },
      "delete": {
        "min_age": "90d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}

# 应用ILM策略到索引模板
PUT _template/logs_template
{
  "index_patterns": ["logs-*"],
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1,
    "index.lifecycle.name": "logs_policy",
    "index.lifecycle.rollover_alias": "logs"
  }
}
```

```bash
# ========== 备份策略 ==========

# 1. 本地备份（快速恢复）
# 每天备份前一天的日志文件
cat > /etc/cron.daily/log-backup << 'EOF'
#!/bin/bash
# 日志本地备份

BACKUP_DIR="/data/log-backup"
DATE=$(date +%Y%m%d)
RETENTION=30

mkdir -p "$BACKUP_DIR/$DATE"

# 备份昨天的日志（轮转后的）
find /var/log -name "*.gz" -mtime -1 -exec cp {} "$BACKUP_DIR/$DATE/" \;
find /var/log -name "*.1" -mtime -1 -exec cp {} "$BACKUP_DIR/$DATE/" \;

# 生成校验和
cd "$BACKUP_DIR/$DATE" && sha256sum * > SHA256SUMS

# 清理过期备份
find "$BACKUP_DIR" -type d -mtime +$RETENTION -exec rm -rf {} \;

logger -t log-backup "Log backup completed: $DATE"
EOF
chmod +x /etc/cron.daily/log-backup

# 2. 异地备份（灾难恢复）
# 使用rsync同步到远程服务器
cat > /etc/cron.daily/log-remote-backup << 'EOF'
#!/bin/bash
REMOTE_SERVER="backup-server.example.com"
REMOTE_DIR="/data/log-backups/$(hostname)"

# 使用rsync增量同步
rsync -avz --delete \
    /var/log/ \
    "$REMOTE_SERVER:$REMOTE_DIR/"

logger -t log-backup "Remote log backup completed"
EOF
chmod +x /etc/cron.daily/log-remote-backup

# 3. 云备份（长期归档）
# 使用AWS S3、阿里云OSS等对象存储
# s3cmd sync /var/log/ s3://my-log-archive/$(hostname)/
# 或使用aws-cli
# aws s3 sync /var/log/ s3://my-log-archive/$(hostname)/ --storage-class GLACIER
```

## 4.20 安全事件日志分析

### 4.20.1 登录失败分析脚本

登录失败是最常见的安全事件之一，可能是暴力破解攻击、密码喷洒攻击、或正常的用户输错密码。通过自动化脚本分析登录失败日志，可以快速识别攻击行为，及时采取防护措施。一个好的登录失败分析脚本应该能够统计失败次数、识别攻击来源、检测攻击模式、并在达到阈值时发出告警。

脚本的核心逻辑包括：从日志中提取所有失败登录记录、按IP地址和用户名统计失败次数、与阈值进行比较、生成分析报告、以及触发告警机制。此外，脚本还应该支持排除白名单IP、检测异常模式（如用户名枚举）、以及与防火墙联动自动封禁攻击IP。

```bash
#!/bin/bash
# filename: ssh-brute-force-detector.sh
# SSH暴力破解检测脚本
# 功能：分析认证日志，检测暴力破解攻击，自动封禁攻击IP

# 配置
AUTH_LOG="/var/log/auth.log"
SECURE_LOG="/var/log/secure"
WHITELIST_FILE="/etc/security/ssh-whitelist.txt"
FAILED_THRESHOLD=20          # 单IP失败次数阈值
USER_THRESHOLD=10           # 单IP尝试不同用户名数量阈值（用户名枚举）
BAN_DURATION=3600           # 封禁时长（秒）
REPORT_FILE="/var/log/security/brute-force-report-$(date +%Y%m%d).txt"
LOCK_FILE="/var/run/brute-force-detector.pid"

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 确保只有一个实例运行
if [ -f "$LOCK_FILE" ] && kill -0 $(cat "$LOCK_FILE") 2>/dev/null; then
    echo "脚本已在运行中，PID: $(cat $LOCK_FILE)"
    exit 1
fi
echo $$ > "$LOCK_FILE"
trap 'rm -f $LOCK_FILE' EXIT

# 检测日志文件位置
if [ -f "$AUTH_LOG" ]; then
    LOG_FILE="$AUTH_LOG"
elif [ -f "$SECURE_LOG" ]; then
    LOG_FILE="$SECURE_LOG"
else
    echo "错误：找不到认证日志文件"
    exit 1
fi

# 创建白名单文件（如果不存在）
if [ ! -f "$WHITELIST_FILE" ]; then
    cat > "$WHITELIST_FILE" << 'EOF'
# SSH登录白名单 - 每行一个IP或网段
# 示例：
# 127.0.0.1
# 10.0.0.0/8
# 192.168.1.100
127.0.0.1
EOF
fi

# 创建输出目录
mkdir -p /var/log/security

# ========== 函数定义 ==========

# 检查IP是否在白名单中
is_whitelisted() {
    local ip="$1"
    local result=1  # 默认不在白名单
    
    while IFS= read -r line; do
        # 跳过空行和注释
        [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
        
        # 去除首尾空白
        line=$(echo "$line" | xargs)
        
        # 检查是否是CIDR网段
        if [[ "$line" == */* ]]; then
            # 使用ip命令检查是否在网段内
            if ip route get "$ip" from "$ip" 2>/dev/null | grep -q "$line"; then
                result=0
                break
            fi
        else
            # 精确匹配
            if [ "$ip" = "$line" ]; then
                result=0
                break
            fi
        fi
    done < "$WHITELIST_FILE"
    
    return $result
}

# 使用iptables封禁IP
ban_ip() {
    local ip="$1"
    local reason="$2"
    
    # 检查是否已封禁
    if iptables -L INPUT -n | grep -q "$ip"; then
        return 1
    fi
    
    # 添加到iptables
    iptables -A INPUT -s "$ip" -j DROP
    iptables -A OUTPUT -d "$ip" -j DROP
    
    logger -t brute-force-detector "Banned IP: $ip, reason: $reason"
    
    # 设置定时解除（使用at命令）
    if command -v at &>/dev/null; then
        echo "iptables -D INPUT -s $ip -j DROP; iptables -D OUTPUT -d $ip -j DROP; logger -t brute-force-detector 'Unbanned IP: $ip'" | \
            at now + ${BAN_DURATION}s 2>/dev/null
    fi
    
    return 0
}

# 发送告警
send_alert() {
    local ip="$1"
    local count="$2"
    local type="$3"
    
    local subject="[安全告警] SSH暴力破解检测 - $ip"
    local body="检测到SSH暴力破解攻击：
    
攻击IP: $ip
攻击类型: $type
失败次数: $count
检测时间: $(date)
日志文件: $LOG_FILE

最近的失败记录：
$(grep "$ip" "$LOG_FILE" | grep "Failed" | tail -10)

该IP已被自动封禁 ${BAN_DURATION} 秒。
"
    
    # 邮件告警（需要配置邮件服务）
    # echo "$body" | mail -s "$subject" admin@example.com
    
    # 记录到告警日志
    echo "$(date '+%Y-%m-%d %H:%M:%S') ALERT: $type from $ip ($count failures)" >> /var/log/security/alerts.log
    
    # 控制台输出
    echo -e "${RED}告警：检测到$type攻击${NC}"
    echo "攻击IP: $ip"
    echo "失败次数: $count"
}

# ========== 主分析逻辑 ==========

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}SSH暴力破解检测分析${NC}"
echo -e "${GREEN}========================================${NC}"
echo "分析时间: $(date)"
echo "日志文件: $LOG_FILE"
echo ""

# 1. 提取所有失败登录IP及次数
echo -e "${YELLOW}【1. 失败登录TOP20 IP】${NC}"
echo "----------------------------------------"

declare -A ip_count
declare -A ip_users

# 提取失败登录记录
while IFS= read -r line; do
    # 提取IP（支持不同的日志格式）
    ip=$(echo "$line" | grep -oP 'from \K[\d.]+' | head -1)
    user=$(echo "$line" | grep -oP 'for \K[^ ]+' | head -1)
    
    if [ -n "$ip" ] && [ -n "$user" ]; then
        # 计数
        ip_count["$ip"]=$(( ${ip_count["$ip"]:-0} + 1 ))
        
        # 记录尝试的用户名（去重）
        if [[ ! "${ip_users[$ip]}" =~ "${user};" ]]; then
            ip_users["$ip"]="${ip_users[$ip]}${user};"
        fi
    fi
done < <(grep "Failed password" "$LOG_FILE")

# 排序输出
for ip in "${!ip_count[@]}"; do
    echo "${ip_count[$ip]} $ip (尝试用户: $(echo "${ip_users[$ip]}" | tr ';' '\n' | grep -v '^$' | wc -l)个)"
done | sort -rn | head -20 | while read count ip rest; do
    if [ "$count" -ge "$FAILED_THRESHOLD" ]; then
        echo -e "${RED}$count $ip $rest ⚠ 超过阈值${NC}"
    else
        echo "$count $ip $rest"
    fi
done

echo ""

# 2. 检测暴力破解并封禁
echo -e "${YELLOW}【2. 暴力破解检测结果】${NC}"
echo "----------------------------------------"

found_threat=0
for ip in "${!ip_count[@]}"; do
    count=${ip_count[$ip]}
    user_count=$(echo "${ip_users[$ip]}" | tr ';' '\n' | grep -v '^$' | wc -l)
    
    # 跳过白名单
    if is_whitelisted "$ip"; then
        continue
    fi
    
    # 检测暴力破解（同一用户名多次失败）
    if [ "$count" -ge "$FAILED_THRESHOLD" ]; then
        echo -e "${RED}检测到暴力破解：$ip ($count 次失败)${NC}"
        ban_ip "$ip" "brute_force"
        send_alert "$ip" "$count" "SSH暴力破解"
        found_threat=1
    fi
    
    # 检测用户名枚举（多次尝试不同用户名）
    if [ "$user_count" -ge "$USER_THRESHOLD" ]; then
        echo -e "${RED}检测到用户名枚举：$ip (尝试 $user_count 个用户)${NC}"
        ban_ip "$ip" "user_enumeration"
        send_alert "$ip" "$count" "用户名枚举攻击"
        found_threat=1
    fi
done

if [ "$found_threat" -eq 0 ]; then
    echo -e "${GREEN}未检测到超过阈值的暴力破解尝试${NC}"
fi

echo ""

# 3. 无效用户尝试（用户名枚举特征）
echo -e "${YELLOW}【3. 无效用户尝试TOP10】${NC}"
echo "----------------------------------------"

grep "Invalid user" "$LOG_FILE" | \
    awk '{print $(NF-2)}' | \
    sort | uniq -c | sort -rn | head -10

echo ""

# 4. 最常被攻击的用户名
echo -e "${YELLOW}【4. 被攻击TOP10用户名】${NC}"
echo "----------------------------------------"

grep "Failed password" "$LOG_FILE" | \
    awk '{print $9}' | \
    sort | uniq -c | sort -rn | head -10

echo ""

# 5. 攻击时间分布
echo -e "${YELLOW}【5. 攻击时间分布】${NC}"
echo "----------------------------------------"

grep "Failed password" "$LOG_FILE" | \
    awk '{print $3}' | cut -d: -f1 | \
    sort | uniq -c | sort -k2 -n | \
    awk '{printf "%s:00  %3d  %s\n", $2, $1, str_rep("█", $1/5)}' 2>/dev/null || \
    awk '{printf "%s:00  %3d次\n", $2, $1}'

echo ""

# 6. 已封禁的IP
echo -e "${YELLOW}【6. 当前封禁IP列表】${NC}"
echo "----------------------------------------"

iptables -L INPUT -n --line-numbers | grep DROP | head -20

echo ""
echo -e "${GREEN}分析完成${NC}"

# 保存报告
{
    echo "SSH暴力破解检测报告"
    echo "生成时间: $(date)"
    echo "日志文件: $LOG_FILE"
    echo ""
    echo "失败登录TOP20 IP:"
    for ip in "${!ip_count[@]}"; do
        echo "${ip_count[$ip]} $ip"
    done | sort -rn | head -20
} > "$REPORT_FILE"

exit 0
```

### 4.20.2 异常访问检测

异常访问检测是安全监控的重要组成部分，通过建立正常行为基线，识别偏离基线的异常行为。异常访问的类型包括：时间异常（非正常工作时间访问）、频率异常（访问频率远高于正常）、来源异常（从未出现过的IP或地区）、行为异常（访问路径异常）等。

实现异常检测的方法有多种：基于规则的检测（如白名单/黑名单）、基于统计的检测（如偏离平均值3倍标准差）、基于机器学习的检测（如聚类、孤立森林）。对于大多数企业，基于规则和统计的方法已经能够发现大部分明显的异常行为，且实现成本较低。

```bash
#!/bin/bash
# filename: abnormal-access-detector.sh
# 异常访问检测脚本
# 检测异常登录、异常文件访问、异常命令执行等

# 配置
AUTH_LOG="/var/log/auth.log"
AUDIT_LOG="/var/log/audit/audit.log"
BASELINE_FILE="/var/log/security/baseline.txt"
ALERT_LOG="/var/log/security/abnormal-alerts.log"
WORK_START_HOUR=8
WORK_END_HOUR=20

mkdir -p /var/log/security

# ========== 函数定义 ==========

log_alert() {
    local level="$1"
    local category="$2"
    local message="$3"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] [$category] $message" >> "$ALERT_LOG"
    echo "[$level] $message"
}

# 检测是否为工作时间
is_work_hour() {
    local hour=$(date +%H)
    if [ "$hour" -ge "$WORK_START_HOUR" ] && [ "$hour" -lt "$WORK_END_HOUR" ]; then
        return 0  # 工作时间
    else
        return 1  # 非工作时间
    fi
}

# ========== 1. 时间异常登录检测 ==========

echo "===== 1. 非工作时间登录检测 ====="

if ! is_work_hour; then
    recent_logins=$(grep "Accepted" "$AUTH_LOG" | tail -5)
    if [ -n "$recent_logins" ]; then
        log_alert "WARNING" "time_anomaly" "非工作时间检测到登录活动"
        echo "$recent_logins" | while read line; do
            user=$(echo "$line" | awk '{print $9}')
            ip=$(echo "$line" | awk '{print $(NF-3)}')
            log_alert "INFO" "time_anomaly" "用户 $user 从 $ip 登录（非工作时间）"
        done
    fi
fi

# 凌晨登录统计
midnight_logins=$(grep "Accepted" "$AUTH_LOG" | awk -F'[ :]' '$3 >= 0 && $3 < 6' | wc -l)
if [ "$midnight_logins" -gt 0 ]; then
    log_alert "WARNING" "time_anomaly" "凌晨(0-6点)有 $midnight_logins 次登录"
fi

echo ""

# ========== 2. 新IP登录检测 ==========

echo "===== 2. 新IP登录检测 ====="

# 提取历史登录IP作为基线（前30天）
if [ -f "$BASELINE_FILE" ]; then
    # 提取最近的成功登录IP
    recent_ips=$(grep "Accepted" "$AUTH_LOG" | grep -oP 'from \K[\d.]+' | sort -u)
    
    for ip in $recent_ips; do
        if ! grep -q "$ip" "$BASELINE_FILE"; then
            # 找到对应的登录信息
            login_info=$(grep "Accepted.*$ip" "$AUTH_LOG" | tail -1)
            user=$(echo "$login_info" | awk '{print $9}')
            log_alert "WARNING" "new_ip" "新IP登录: 用户 $user 从 $ip 首次登录"
        fi
    done
else
    # 首次运行，创建基线
    echo "首次运行，创建基线文件..."
    grep "Accepted" "$AUTH_LOG" | grep -oP 'from \K[\d.]+' | sort -u > "$BASELINE_FILE"
    echo "已记录 $(wc -l < $BASELINE_FILE) 个历史登录IP"
fi

echo ""

# ========== 3. 失败率异常检测 ==========

echo "===== 3. 登录失败率检测 ====="

total_accepted=$(grep -c "Accepted" "$AUTH_LOG")
total_failed=$(grep -c "Failed password" "$AUTH_LOG")

if [ "$total_accepted" -gt 0 ]; then
    failure_rate=$(echo "scale=2; $total_failed * 100 / ($total_accepted + $total_failed)" | bc)
    echo "登录成功率: $total_accepted, 失败率: $total_failed, 失败率: ${failure_rate}%"
    
    # 失败率超过30%视为异常
    if (( $(echo "$failure_rate > 30" | bc -l) )); then
        log_alert "CRITICAL" "high_failure_rate" "登录失败率异常: ${failure_rate}%"
    fi
fi

echo ""

# ========== 4. 异常命令检测 ==========

echo "===== 4. 异常命令执行检测 ====="

if [ -f "$AUDIT_LOG" ]; then
    # 检测危险命令执行
    dangerous_cmds=("nc" "netcat" "nmap" "tcpdump" "wireshark" "john" "hashcat" "hydra")
    
    for cmd in "${dangerous_cmds[@]}"; do
        count=$(grep -c "exe=.$cmd" "$AUDIT_LOG" 2>/dev/null || grep -c "$cmd" "$AUDIT_LOG" 2>/dev/null)
        if [ "$count" -gt 0 ]; then
            log_alert "WARNING" "dangerous_command" "检测到危险命令执行: $cmd ($count 次)"
        fi
    done
    
    # 检测特权提升
    sudo_count=$(grep -c "sudo" "$AUTH_LOG")
    su_count=$(grep -c " su:" "$AUTH_LOG")
    echo "sudo执行次数: $sudo_count, su执行次数: $su_count"
fi

echo ""

# ========== 5. 文件异常修改检测 ==========

echo "===== 5. 关键文件修改检测 ====="

critical_files=(
    "/etc/passwd"
    "/etc/shadow"
    "/etc/sudoers"
    "/etc/ssh/sshd_config"
    "/etc/crontab"
)

for file in "${critical_files[@]}"; do
    if [ -f "$AUDIT_LOG" ]; then
        changes=$(grep -c "$file" "$AUDIT_LOG" 2>/dev/null || echo 0)
    else
        # 用mtime检查
        changes=$(find "$file" -mtime -1 2>/dev/null | wc -l)
    fi
    
    if [ "$changes" -gt 0 ]; then
        log_alert "INFO" "file_change" "关键文件 $file 有 $changes 次修改记录"
    fi
done

echo ""

# ========== 6. 异常出站连接检测 ==========

echo "===== 6. 异常出站连接检测 ====="

# 检查连接到高危端口的出站连接
high_risk_ports=("22" "3389" "4444" "5555" "6666" "7777" "8888" "9999")

for port in "${high_risk_ports[@]}"; do
    connections=$(ss -tnp | grep ":$port " | grep -v "LISTEN" | wc -l)
    if [ "$connections" -gt 0 ]; then
        log_alert "WARNING" "suspicious_connection" "检测到 $connections 个到端口 $port 的出站连接"
        ss -tnp | grep ":$port " | grep -v "LISTEN"
    fi
done

echo ""
echo "检测完成，告警日志: $ALERT_LOG"
```

### 4.20.3 攻击特征识别方法

攻击特征识别是指从日志中提取已知攻击的特征模式，从而快速识别攻击行为。每种攻击类型都有其独特的日志特征，掌握这些特征是进行有效日志分析的基础。常见的攻击类型包括：暴力破解、SQL注入、XSS跨站脚本、目录遍历、命令注入、Webshell上传、DDoS攻击等。

特征识别的方法主要有：关键字匹配（最简单但误报率高）、正则表达式匹配（更精确但编写复杂）、特征码匹配（如IDS规则）、以及行为分析（基于多个事件的关联分析）。实际应用中通常采用多种方法结合的方式，提高检测准确率的同时降低误报率。

```bash
# ========== 攻击特征识别速查表 ==========

# 1. SSH暴力破解
# 特征：短时间内大量Failed password
# 日志位置：/var/log/auth.log 或 /var/log/secure
# 特征模式：
grep "Failed password" /var/log/auth.log
grep "Invalid user" /var/log/auth.log

# 检测方法：
# - 同一IP在10分钟内失败>20次
# - 同一IP尝试超过10个不同用户名
# - 失败率持续高于30%

# ----------------------------------------

# 2. SQL注入攻击
# 特征：URL或POST参数中包含SQL语法
# 日志位置：Web服务器访问日志
# 常见特征：
# - UNION SELECT
# - OR 1=1
# - DROP TABLE
# - -- (SQL注释)
# - ' or '
# - ;--
# - CHAR()
# - CONCAT()
# - INTO OUTFILE

# 检测脚本
grep -iE "(union.*select|select.*from|insert.*into|drop.*table|or 1=1|'\s*or\s*'|--)" \
    /var/log/nginx/access.log

# 更全面的检测（包含URL编码）
grep -iE "(union%20select|%27%20or%20|%20or%201=1|drop%20table|--)" \
    /var/log/nginx/access.log

# ----------------------------------------

# 3. XSS跨站脚本攻击
# 特征：URL参数中包含script标签或JavaScript代码
# 常见特征：
# - <script
# - javascript:
# - onerror=
# - onload=
# - alert(
# - document.cookie
# - <img src=
# - eval(
# - <iframe

grep -iE "(<script|javascript:|onerror=|onload=|alert\(|document\.cookie|<img.*src=)" \
    /var/log/nginx/access.log

# URL编码形式
grep -iE "(%3Cscript|javascript%3A|onerror%3D|alert%28)" \
    /var/log/nginx/access.log

# ----------------------------------------

# 4. 目录遍历攻击
# 特征：路径中包含 ../ 或 ..\
# 常见特征：
# - ../
# - ..\
# - %2e%2e%2f (URL编码)
# - %2e%2e/
# - ....//
# - /etc/passwd
# - /windows/win.ini

grep -E "(\.\./|\.\.\\\\|%2e%2e%2f|%2e%2e/|etc/passwd|win\.ini)" \
    /var/log/nginx/access.log

# ----------------------------------------

# 5. 命令注入攻击
# 特征：参数中包含系统命令
# 常见特征：
# - ; ls
# - | id
# - && whoami
# - `command`
# - $(command)
# - /bin/sh
# - cmd.exe
# - php eval
# - system(
# - exec(

grep -iE "(;\s*ls|;\s*cat|;\s*whoami|\|\s*id|&&\s*|`.*`|\$\(.*\)|system\(|exec\(|shell_exec\()" \
    /var/log/nginx/access.log

# ----------------------------------------

# 6. Webshell上传与访问
# 特征：可疑的PHP/ASP/JSP文件访问，POST到上传目录
# 常见特征：
# - 上传目录中的.php文件
# - eval(), assert()
# - cmd= parameter
# - 异常的User-Agent
# - POST到可疑文件

# 检测可疑文件访问
grep "POST.*uploads/.*\.php" /var/log/nginx/access.log
grep "uploads.*\.php.*200" /var/log/nginx/access.log

# 检测cmd参数
grep -i "cmd=" /var/log/nginx/access.log
grep -i "?cmd=" /var/log/nginx/access.log

# ----------------------------------------

# 7. 扫描器探测
# 特征：大量404错误，特定的User-Agent，规律的请求频率
# 常见扫描器特征：
# - sqlmap
# - nmap
# - nikto
# - dirb
# - burp
# - wpscan
# - acunetix
# - nessus
# - masscan
# - zgrab

grep -iE "(sqlmap|nmap|nikto|dirb|burp|wpscan|acunetix|nessus|masscan|zgrab)" \
    /var/log/nginx/access.log

# 大量404检测（同一IP在短时间内大量404）
awk '$9 == 404 {count[$1]++} END {for (ip in count) if (count[ip]>50) print count[ip], ip}' \
    /var/log/nginx/access.log | sort -rn

# ----------------------------------------

# 8. DDoS攻击
# 特征：短时间内大量请求，少数IP占大量请求
# 检测方法：

# 按IP统计请求数（TOP20）
awk '{count[$1]++} END {for (ip in count) print count[ip], ip}' \
    /var/log/nginx/access.log | sort -rn | head -20

# 按秒统计请求数（检测突发流量）
awk '{print substr($4, 2, 20)}' /var/log/nginx/access.log | \
    uniq -c | sort -rn | head -10

# SYN洪水检测（需要内核日志或网络监控）
grep -i "syncookie" /var/log/kern.log
netstat -s | grep "SYNs to LISTEN"

# ----------------------------------------

# 9. 暴力破解FTP
# 日志位置: /var/log/vsftpd.log 或 /var/log/auth.log
grep -i "FAIL LOGIN" /var/log/vsftpd.log
grep "vsftpd.*authentication failure" /var/log/auth.log

# ----------------------------------------

# 10. 密码喷洒攻击
# 特征：多个用户名，相同密码，较低的单次失败率
# 检测方法：
# 统计尝试过的不同用户名数量，若IP尝试用户数>10且每个用户失败次数少

grep "Failed password" /var/log/auth.log | \
    awk '{ip=$(NF-3); user=$9; users[ip]=users[ip]" "user; count[ip]++}
    END {for (ip in count) {
        n=split(users[ip], arr, " ");
        if (n > 10) print count[ip], n, ip
    }}' | sort -rn

# ----------------------------------------

# 11. 横向移动检测
# 特征：一台内网主机成功登录多台其他主机
# 需要集中日志才能检测

# 在中央日志服务器上执行：
# 查找同一源IP登录多台目标主机的情况
grep "Accepted" /var/log/remote/*/auth.log | \
    awk '{
        src_ip = $(NF-3);
        dst_host = FILENAME;
        gsub(/.*\//, "", dst_host);
        gsub(/-auth.*/, "", dst_host);
        if (!seen[src_ip,dst_host]++) {
            hosts[src_ip] = hosts[src_ip]" "dst_host;
            count[src_ip]++;
        }
    } END {
        for (ip in count)
            if (count[ip] > 3)
                print count[ip], ip, hosts[ip]
    }' | sort -rn

# ----------------------------------------

# 12. 数据泄露检测
# 特征：异常大的下载，异常出站流量
# 检测方法：

# 找出大响应
awk '$10 > 1048576' /var/log/nginx/access.log | tail -20  # >1MB的响应

# 按IP统计下载量
awk '{bytes[$1] += $10} END {for (ip in bytes) printf "%.2f MB %s\n", bytes[ip]/1024/1024, ip}' \
    /var/log/nginx/access.log | sort -rn | head -20

# 非工作时间大量数据传输
awk -F'[ :]' '$3 >= 22 || $3 < 6 {sum += $10; count++} 
    END {printf "夜间数据量: %.2f MB, 请求数: %d\n", sum/1024/1024, count}' \
    /var/log/nginx/access.log
```
