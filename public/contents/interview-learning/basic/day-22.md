# Day 22：大数据安全
> 🎯 面试目标：掌握大数据安全面试核心——Kerberos/Ranger权限管理/数据脱敏/差分隐私/数据湖治理
## 核心知识点
### Q: Hadoop集群的安全架构如何设计？Kerberos+Ranger的协作流程
**Hadoop安全架构三层**：

1. **网络层**：集群节点放私有VLAN→只有Gateway/Edge Node双网卡→Kerberos仅对外暴露
2. **认证层(Kerberos)**：用户kinit→获取TGT→访问HDFS时用TGT换Service Ticket→NameNode验证→放行。Keytab文件必须400权限
3. **授权层(Ranger)**：Ranger Admin创建Service和Policy→Plugin拉取Policy到本地缓存(低延迟)→支持基于Tag的动态授权(先打标签PII→再按标签授权)

**外部用户接入(KNOX)**：Knox Gateway→LDAP/Kerberos认证→转发→Ranger二次授权
### Q: 请解释"差分隐私"的原理，并给出一个实际应用场景
差分隐私(Differential Privacy)核心：对数据库查询结果添加可控的随机噪声(拉普拉斯/高斯分布)，确保任何外部观察者无法判断特定个体的数据是否在数据集中。

**数学本质(ε-差分隐私)**：Pr[M(D1)∈S] ≤ e^ε × Pr[M(D2)∈S]。ε越小隐私越强。

**实际场景——医疗统计**：统计某疾病平均住院天数，不加噪=15.3天(可能推断张三是否在数据集中)→加噪声后返回15.3±随机扰动→攻击者无法区分"15天"和"16天"

**面试亮点**：Apple从iOS10起用差分隐私收集键盘预测/Emoji建议/健康数据→不上传原始数据，上传加噪后的统计摘要
### Q: Kafka在安全场景中的作用和自身安全配置
Kafka在安全领域广泛用于SIEM日志管道+威胁检测实时流处理。

**Kafka自身安全配置**：
- 认证：推荐mTLS双向证书→SASL/SCRAM→SASL/PLAIN(不安全)
- 授权：ACL控制→`kafka-acls --add --allow-principal User:app --operation Read --topic security-events`
- 加密：TLS加密(security.protocol=SSL)+磁盘加密
- 网络：仅内网监听(listeners=INTERNAL://host:9092)→外部通过REST Proxy

**安全场景实战**：Kafka←Logstash推送原始日志→Flink实时关联分析(5分钟内同IP多次登录失败)→存入ES→Kibana展示
### Q: 大数据平台如何做到"可用不可见"的数据共享？
四种方案：

1. **联邦学习(Federated Learning)**：原始数据不出本地→各方在本地训练→仅上传梯度→中央聚合。Google Gboard用此训练键盘预测
2. **安全多方计算(SMPC)**：多方各自私有输入→加密协议(混淆电路/秘密共享)协同计算→结果可见但中间输入不可见
3. **可信执行环境(TEE)**：Intel SGX/AMD SEV→CPU内加密Enclave→数据仅在Enclave内解密。蚂蚁Occlum/Google Asylo
4. **数据沙箱(Clean Room)**：甲方提供脱敏数据→乙方在沙箱分析→结果审核后才能带出。Databricks/AWS Clean Rooms
### Q: 传统数据库审计和大数据审计有何不同？
传统审计(Database Audit)是表级别：`AUDIT SELECT ON hr.employees BY ACCESS`。大数据审计需覆盖HDFS文件级+表级+列级+行级。

Ranger审计插件能记录到具体用户/时间/IP/访问的HDFS路径/Hive列。更重要是需结合Atlas/Apache Griffin做数据血缘追踪——敏感字段从哪里来→经过哪些ETL转换→被谁访问。这是大数据审计区别于传统审计的关键维度
## 面试陷阱
- ⚠️ Kerberos跨域信任配置容易被攻击——Hadoop的`[domain_realm]`配置错误可能导致域间信任被滥用
- ⚠️ Kafka offset存储本身无认证——如果ZooKeeper无ACL，可读取consumer group消费进度推断业务信息
- ⚠️ Hive的UDF可执行任意代码——Java UDF可调用Runtime.exec()，必须有沙箱机制

## 今日检测
1. 搭建本地Hadoop单节点→配置Kerberos认证→用kinit+klist验证
2. 用Apache Ranger创建一条Policy：限制某用户只读HDFS `/user/hr/salary`
3. 阅读《数据安全法》中数据处理者义务条款→提炼3个面试论据
