# 第二章 SOC技术架构

> 第2章 | 55页

2.1 SOC技术架构分层

- 数据采集层：日志、流量、终端数据采集
- 数据处理层：清洗、归一化、存储
- 检测分析层：SIEM、UEBA、威胁情报
- 响应处置层：SOAR、工单、自动化
- 展示呈现层：态势感知、报表、可视化

2.2 数据采集架构

- 日志采集：Syslog、Agent、API、文件采集
- 流量采集：镜像流量、NetFlow、探针
- 终端采集：EDR Agent、HIDS
- 云环境采集：云API、云日志服务

2.3 SIEM平台架构

- 采集层：各类日志采集器
- 处理层：日志解析、归一化、富化
- 存储层：全文检索、时序数据库
- 分析层：关联规则、异常检测、威胁情报
- 展示层：Dashboard、报表、告警

2.4 主流SIEM产品

商业产品：
- Splunk Enterprise Security
- IBM QRadar
- ArcSight
- 奇安信NGSOC
- 深信服SIP
- 绿盟SAS

开源方案：
- ELK Stack（Elasticsearch + Logstash + Kibana）
- Graylog
- Apache Metron

2.5 SOAR架构

- 剧本（Playbook）：编排工作流
- 应用（App）：第三方系统集成
- 案例（Case）：事件管理
- 指标（Metric）：度量指标
