---
day: 36
title: ELK Stack部署与基础使用
phase: 第一阶段 · 初级蓝队夯实
difficulty: ⭐⭐⭐ 中等
---

# Day 36：ELK Stack部署与基础使用

> **阶段**：第一阶段 · 初级蓝队夯实 | **难度**：⭐⭐⭐ 中等 | **课时**：2-3小时

---

## 学习目标

1. 理解 ELK（Elasticsearch + Logstash + Kibana）的核心概念和各自角色
2. 使用 Docker Compose 快速部署 ELK 单节点环境
3. 掌握 Filebeat 日志采集配置
4. 学会在 Kibana 中创建索引模式并搜索日志
5. 能编写简单的 Kibana 查询语句（KQL）来发现安全事件
6. 理解 ELK 在蓝队安全监控中的核心地位

---


---

## 一、ELK 是什么——蓝队的安全监控大脑

简单说：ELK 是一个日志集中管理平台。传统方式下，每台服务器有各自的日志文件，
出了问题要逐台登录查看——效率极低。ELK 把所有日志汇聚到一个地方，
让你能像搜索 Google 一样搜索日志。

三个核心组件：
- Elasticsearch：日志的仓库（存储 + 搜索引擎）
  -> 相当于图书馆的书架，存放下所有日志并提供快速搜索能力
- Logstash：日志的搬运工（采集 + 转换）
  -> 相当于快递员，从各台服务器收集日志，整理后送入 ES
- Kibana：日志的展示窗口（可视化 + 查询界面）
  -> 相当于图书馆的检索终端，你可以搜索、画图、做 Dashboard

加上 Filebeat（轻量级日志采集器）后，完整的日志管道是：
服务器日志 -> Filebeat 采集 -> Logstash 处理 -> Elasticsearch 存储 -> Kibana 展示

ELK 解决了蓝队的三大痛点：
痛点 1：日志太分散
  没有 ELK：登录 20 台服务器 -> 各自 grep -> 手动汇总
  有了 ELK：在 Kibana 输入一行搜索 -> 1 秒出结果

痛点 2：日志格式不统一
  Apache/MySQL/SSH/Windows Event Log 各有各的格式
  Logstash 可以统一解析和标准化

痛点 3：无法关联分析
  Web 日志说有人攻击 -> 系统日志说有人登录 -> 是同一件事吗？
  ELK 可以用时间线+IP 把跨系统的日志关联起来


---

## 二、Docker 快速部署 ELK

推荐使用 Docker Compose 一键部署（5 分钟搞定）：

```yaml
# docker-compose.yml
version: '3'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.0
    environment:
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms1g -Xmx1g
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:7.17.0
    ports:
      - "5044:5044"
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf

  kibana:
    image: docker.elastic.co/kibana/kibana:7.17.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200

volumes:
  es_data:
```

```bash
# 启动 ELK
docker-compose up -d

# 检查所有服务是否正常运行
docker-compose ps

# 访问 Kibana：http://localhost:5601
```

常见问题：
- ES 启动失败 -> 检查主机内存（ES 至少需要 2GB 可用内存）
- ES 需要调整 vm.max_map_count：sudo sysctl -w vm.max_map_count=262144


---

## 三、Filebeat 配置——把 Nginx 日志送入 ELK

Filebeat 是一个非常轻量的日志采集器，部署在每台要采集日志的服务器上。

```yaml
# filebeat.yml
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /var/log/nginx/access.log
  fields:
    log_type: nginx_access
  fields_under_root: true

output.logstash:
  hosts: ["localhost:5044"]
```

启动 Filebeat：
```bash
# 下载并安装 Filebeat
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.17.0-linux-x86_64.tar.gz
tar xzvf filebeat-7.17.0-linux-x86_64.tar.gz
cd filebeat-7.17.0-linux-x86_64

# 测试配置
./filebeat test config

# 启动
./filebeat -e
```

验证数据是否进入 ELK：
1. 打开 Kibana -> Management -> Stack Management -> Index Patterns
2. 创建索引模式：filebeat-*
3. 选择时间字段：@timestamp
4. 转到 Discover -> 你应该能看到 Nginx 访问日志了！


---

## 四、Kibana 查询实战——蓝队日志搜索技巧

基本搜索语法（KQL - Kibana Query Language）：

```
# 精确匹配
log_type: "nginx_access"

# 模糊搜索（在所有字段中搜索）
"404"

# 组合查询
response: 200 AND method: "POST"

# 排除查询
NOT response: 200

# 范围查询
response: >=400 AND response: <500

# 通配符
uri: "/api/*"

# IP 查询（查找特定 IP 的所有请求）
client_ip: "192.168.1.100"
```

蓝队实战搜索场景：

场景 1：查找 SQL 注入攻击
```
uri: "*UNION*" OR uri: "*SLEEP*" OR uri: "*select*"
```

场景 2：查找扫描探测
```
response: 404 AND NOT uri: "*.css" AND NOT uri: "*.js"
```

场景 3：查找爆破行为
```
uri: "*login*" AND method: "POST" AND response: 401
```

场景 4：查找 Webshell 访问
```
uri: "*.php" AND response: 200 AND NOT uri: "index.php"
```


---

## 五、蓝队 ELK 监控 Dashboard 设计

一个好的 Dashboard 让威胁一目了然。以下是蓝队必建的几个面板：

1. 请求量时间线（Traffic Volume Timeline）
   - 折线图：显示每分钟请求量
   - 异常判断：突然的尖峰 = 可能是攻击/扫描

2. TOP 请求来源 IP（Top Source IPs）
   - 柱状图：请求量最多的 IP
   - 异常判断：某个 IP 远高于其他 = 可能是扫描器

3. HTTP 状态码分布（Status Code Distribution）
   - 饼图：2xx/3xx/4xx/5xx 的比例
   - 异常判断：4xx/5xx 比例突然升高 = 探测/攻击

4. 响应时间分布（Response Time Distribution）
   - 柱状图：按时间范围的响应时间
   - 异常判断：大量超长响应 = 可能是时间盲注

5. 404 错误趋势
   - 折线图：每分钟的 404 错误数
   - 异常判断：404 暴增 = 目录/文件扫描


---

## 六、面试高频问答

Q: 说说 ELK 三个组件各自的作用？

A:
- Elasticsearch：日志的搜索引擎 + 存储。接收 JSON 格式的数据，
  建立倒排索引，提供近乎实时的全文搜索。是整个 ELK 的核心。
- Logstash：日志采集和处理管道。从各种来源（文件/TCP/Syslog）
  接收日志，进行过滤/解析/格式化，然后输出到 ES。
- Kibana：数据可视化界面。提供搜索、图表、Dashboard 功能，
  是蓝队与 ELK 交互的主要窗口。

Q: Filebeat 和 Logstash 有什么不同？为什么两个都用？

A: Filebeat 是轻量级的日志转发器（几 MB 内存），只做一件事：
读取日志文件并发送。Logstash 是重量级的日志处理器（几百 MB 内存），
能做复杂的过滤、解析、格式化、富化。

推荐架构：Filebeat 部署在每台服务器上（轻量） -> Logstash 集中部署
（做复杂处理） -> Elasticsearch 存储。这样不会在每台服务器上
占用大量资源。


---

## 七、案例分析

背景：某公司部署 ELK 后第二天，在 Kibana Dashboard 上发现凌晨 3 点
请求量异常飙升。正常夜间流量约 50 请求/分钟，该时间段达到 500+ 请求/分钟。

排查过程：
1. 在 Kibana Discover 中过滤该时间段的日志
2. 使用 KQL：@timestamp >= "2024-01-15T03:00:00" AND @timestamp <= "2024-01-15T04:00:00"
3. 添加 TOP 5 IP 统计 -> 发现 45.xx.xx.xx 发出了 3000+ 请求
4. 搜索该 IP 的请求内容 -> uri:"*UNION*" -> 发现 SQLMap 攻击
5. 确认 WAF 日志 -> 确认攻击已被拦截

结论：ELK 让安全团队在第二天的例行检查中就发现了夜间攻击。
如果没有 ELK，这次攻击可能要几周后才被发现。

---

## 实操任务

1. 使用 Docker Compose 部署 ELK（ES + Logstash + Kibana）
2. 配置 Filebeat 采集本机 Nginx 或 Apache 的访问日志
3. 在 Kibana 中创建索引模式并验证日志是否正常流入
4. 使用 KQL 搜索：查找所有 404 错误、查找特定 IP 的流量、查找 POST 请求
5. 创建 3 个蓝队 Dashboard 面板（请求量时间线、TOP IP、状态码分布）
6. 模拟一次 Web 攻击，在 Kibana 中找到对应的攻击日志
---

## 验收标准

- [ ] ELK 三节点成功部署，各服务正常运行
- [ ] Filebeat 配置正确，日志成功流入 ES
- [ ] 能在 Kibana Discover 中搜索和过滤日志
- [ ] 能编写至少 5 条 KQL 查询语句
- [ ] 创建了至少 2 个实用的 Dashboard 面板
- [ ] 能说出 ELK 各组件的作用和日志流转过程
---

## 今日小结

ELK 是蓝队安全监控的基础设施——它把分散的日志汇聚成统一的可视化平台，让安全分析师能像用 Google 一样搜索和分析安全事件。
记住日志管道：Filebeat 采集 -> Logstash 处理 -> ES 存储 -> Kibana 展示。ELK 的部署只是第一步，真正的价值在于用好它做安全分析。
## 延伸阅读

1. Elastic 官方文档：https://www.elastic.co/guide/
2. 搜索 ELK security monitoring 了解更多蓝队用法
---

> **明日预告**：Day 37 — 弱口令与端口暴露风险排查实操。

---

## 补充：ELK 数据管道深入理解

### Logstash 的三大处理阶段

Logstash 的数据处理分为 input -> filter -> output 三个阶段：

1. Input（输入）：确定从哪接收日志
   - file：从文件读取
   - beats：从 Filebeat 接收
   - syslog：接收 Syslog 协议的数据
   - tcp/udp：直接监听端口接收
   - stdin：从标准输入读取（调试用）

2. Filter（过滤）：对日志进行处理和转换
   常用 filter 插件：
   - grok：用正则表达式解析非结构化日志
   - date：解析并设置时间戳
   - mutate：重命名/删除/修改字段
   - geoip：根据 IP 添加地理位置信息
   - useragent：解析 User-Agent 字段

3. Output（输出）：决定把处理后的数据发到哪里
   - elasticsearch：发送到 ES（最常用）
   - file：写入文件
   - stdout：打印到控制台（调试用）
   - kafka：发送到 Kafka 消息队列

### Logstash Grok 解析实战

Grok 是 Logstash 最强大的功能，能把任意格式的日志解析成结构化数据：

```
# Nginx 日志原始格式：
192.168.1.1 - - [15/Jan/2024:03:14:22 +0800] "GET /api/user?id=1 HTTP/1.1" 200 1234

# Grok 模式：
%{IP:client_ip} - - \[%{HTTPDATE:timestamp}\] "%{WORD:method} %{URIPATHPARAM:request} HTTP/%{NUMBER:http_version}" %{NUMBER:response} %{NUMBER:bytes}

# 解析后的 JSON：
{
  "client_ip": "192.168.1.1",
  "timestamp": "15/Jan/2024:03:14:22 +0800",
  "method": "GET",
  "request": "/api/user?id=1",
  "http_version": "1.1",
  "response": 200,
  "bytes": 1234
}
```

Grok 常用模式速查：
- %{IP}：IP 地址
- %{WORD}：单词（不含空格）
- %{NUMBER}：数字
- %{NOTSPACE}：不含空格的字符串
- %{GREEDYDATA}：剩余所有内容
- %{TIMESTAMP_ISO8601}：ISO 8601 时间戳
- %{DATA}：任意数据（非贪婪匹配）

### ELK 性能优化小贴士

1. ES 内存分配：不超过物理内存的 50%（留一半给系统缓存）
2. 索引生命周期管理（ILM）：自动按时间滚动索引
   - hot（热）：最近 1 天的数据，使用 SSD
   - warm（温）：1-7 天的数据，减少副本
   - cold（冷）：7-30 天的数据，压缩存储
   - delete：30 天以上的自动删除
3. 合理设置分片数：每分片不超过 50GB
4. 关闭不需要的字段索引（mapping 中设置 index: false）
5. 使用 Bulk API 批量写入而非单条写入

---

## 蓝队 ELK 使用技巧

### 快速发现攻击的小技巧

在 Kibana Discover 中保存这些常用的搜索，下次一键调用：

搜索 1：SQL 注入检测
```
uri: *UNION* OR uri: *SLEEP* OR uri: *select* OR uri: *information_schema*
```

搜索 2：XSS 检测
```
uri: *<script* OR uri: *onerror* OR uri: *javascript:*
```

搜索 3：命令注入检测
```
uri: *whoami* OR uri: */etc/passwd* OR uri: *cat *
```

搜索 4：目录扫描检测
```
response: 404 AND NOT uri: *.css AND NOT uri: *.js AND NOT uri: *.png
```

搜索 5：异常状态码（可能是成功的攻击）
```
response: 500 OR response: 502 OR response: 503
```

把这些搜索保存为 Saved Search -> 右键 -> Save -> 命名 -> 
下次在 Dashboard 中直接使用，效率提升 10 倍！

### ELK 告警配置

ELK 不仅能搜索日志，还能主动告警：
1. Kibana -> Alerting -> Create Rule
2. 选择索引模式，设置查询条件（如 response >= 500）
3. 设置阈值（如 1 分钟内超过 10 次就触发）
4. 配置通知方式（邮件/Slack/Webhook）
5. 蓝队注意：告警不要设得太敏感，否则告警风暴会让你崩溃

---

## ELK 杩愮淮鎺掗敊鎸囧崡

### 甯歌闂 1锛欵S 闆嗙兢鐘舵€佸彉 Red
鍘熷洜锛氭湁涓诲垎鐗囨湭鍒嗛厤
瑙ｅ喅锛欸ET _cluster/allocation/explain 鏌ョ湅鍘熷洜 -> 閫氬父鏄鐩樻弧浜嗘垨鑺傜偣绂荤嚎

### 甯歌闂 2锛欿ibana 鏄剧ず No results found
鍙兘鍘熷洜锛歕n- 绱㈠紩妯″紡鐨勬椂闂磋繃婊よ寖鍥翠笉瀵?-> 璋冨ぇ鏃堕棿绐楀彛
- 瀛楁鍚嶅啓閿欎簡 -> 鍦?Discover 涓睍寮€涓€鏉℃棩蹇楃‘璁ゅ瓧娈靛悕
- 鏁版嵁杩樻病鍒?ES -> 妫€鏌?Filebeat/Logstash 鏄惁姝ｅ父鍙戦€乗n
### 甯歌闂 3锛欵S 鍐呭瓨婧㈠嚭
- 妫€鏌?ES_JAVA_OPTS 涓殑 -Xms -Xmx 璁剧疆
- 纭繚涓嶈秴杩囩墿鐞嗗唴瀛樼殑 50%
- 鍏抽棴涓嶅繀瑕佺殑绱㈠紩瀛楁
- 鍑忓皯鍒嗙墖鏁伴噺

---

## 钃濋槦 ELK 瀹炴垬妫€鏌ユ竻鍗昞n
浣跨敤 ELK 杩涜鏃ュ父瀹夊叏妫€鏌ョ殑鏍囧噯娴佺▼锛歕n
1. 鏃╀笂 9:00锛氭墦寮€ Kibana Dashboard锛屾壂涓€鐪兼槰鏅氱殑娴侀噺瓒嬪娍
   - 鍏虫敞锛氬噷鏅ㄦ湁鏃犲紓甯告祦閲忓皷宄般€佸ぇ閲?4xx/5xx 閿欒

2. 杩囨护鏈€杩?24 灏忔椂鐨勫紓甯镐簨浠讹細
   - status_code >= 500 鐨勮姹俓n   - 鏉ヨ嚜澧冨 IP 鐨勭鐞嗗悗鍙拌闂甛n   - 闈炲伐浣滄椂闂寸殑绠＄悊鎿嶄綔
   - 澶ч噺鐩稿悓鐨勯敊璇姹傦紙鍙兘鏄壂鎻忓櫒锛塡n
3. 瀵瑰彲鐤?IP 娣卞害鍒嗘瀽锛歕n   - 鏌ョ湅璇?IP 鎵€鏈夌殑璇锋眰鍘嗗彶
   - 鍒嗘瀽璇锋眰鐨?URL 妯″紡鍜屽弬鏁癨n   - 鍒ゆ柇鏄鎶ャ€佹壂鎻忓櫒杩樻槸瀹氬悜鏀诲嚮

4. 缂栧啓鏃ユ姤锛歕n   - 浠婃棩鍙戠幇鐨勫紓甯告暟閲忓拰绫诲瀷
   - 宸叉嫤鎴殑楂樺嵄鏀诲嚮姒傝堪
   - 闇€瑕佺户缁窡韪殑鍙枒琛屼负

---

## 宸ュ叿閾惧姣擻n
| 宸ュ叿 | 鍔熻兘瀹氫綅 | 瀛︿範鏇茬嚎 | ELK 鏇夸唬鍏崇郴 ||:---|:---|:---|:---|| ELK | 閫氱敤鏃ュ織骞冲彴 | 涓?| - || Splunk | 鍟嗕笟鏃ュ織骞冲彴 | 浣?| 鍟嗕笟鏇夸唬鍝?|| Graylog | 鏃ュ織绠＄悊 | 浣?| 杞婚噺鏇夸唬鍝?|| Grafana + Loki | 杞婚噺鏃ュ織鏂规 | 涓?| 鏇撮€傚悎鐩戞帶鍦烘櫙 || Wazuh(SIEM) | 瀹夊叏涓撶敤 | 楂?| ELK + 瀹夊叏瑙勫垯 = Wazuh 鐨勬晥鏋?|

---

## ELK + 安全监控实战场景

### 场景：用 ELK 发现暴力破解

1. 在 Kibana 中搜索：uri:*login* AND method:POST AND response:401
2. 按 IP 聚合：Add filter -> Visualize -> Data Table
3. 发现某个 IP 在 1 分钟内发送了 50+ 次登录请求 -> 暴力破解无疑
4. 处置：将该 IP 加入防火墙黑名单，通知相关用户修改密码

### 场景：用 ELK 发现扫描器

1. 搜索：response:404 AND NOT uri:*.css AND NOT uri:*.js
2. 按 IP 聚合 -> 发现某个 IP 触发了 500+ 次 404
3. 查看该 IP 的请求路径 -> 路径呈现典型的目录扫描模式
   (/admin/, /wp-admin/, /phpmyadmin/, /.env, /config.php...)
4. 确认：发现扫描器 -> 将 IP 拉黑 + 检查是否扫描到了敏感路径

### 蓝队 ELK 效率提升技巧

1. 创建 Saved Search 模板（SQL注入/XSS/扫描/爆破各一个）
2. 每天早上上班第一件事：打开 5 个 Saved Search 快速过一遍昨晚的告警
3. 对高频误报创建单独的 Dashboard 面板，定期清理优化
4. 分享好用的 KQL 查询语句给团队，建立团队查询库
5. 每周导出告警统计报告，展示 ELK 的价值给领导看

---

## ELK日常运维速查口诀

ELK三板斧：Filebeat采集 -> Logstash清洗 -> Elasticsearch存储。
排查问题先看管道：采集端没数据查filebeat日志，数据不完整查logstash grok匹配，
查不到数据看索引模板。Kibana Discover页面是你的日志显微镜，用好时间筛选和字段过滤事半功倍。

## 蓝队用ELK的核心思维

不是所有日志都需要存ES。蓝队用ELK的精髓在于：**采集安全相关的日志，建立安全视图**。
比如Web日志要保留 attack_detected 标记字段，系统日志要关注 auth_failure 事件，
流量日志重点看非业务端口的访问。

## 性能优化要点

- ES分片数：单节点建议1-3个分片，太多分片浪费资源
- 索引生命周期：热数据3天 -> 温数据30天 -> 冷数据90天 -> 删除
- Refresh间隔：安全场景可设30s（默认1s太浪费）
- 字段映射：不需要搜索的字段设 enabled: false

> 明日预告：Day 37 — 弱口令与端口暴露风险排查实操。ELK帮你存好日志后，
> 下一步就要对日志中的高危信号做排查了。
