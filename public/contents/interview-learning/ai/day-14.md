# Day 14：数据处理Pipeline总结
> [Pipeline面试核心] Kafka/Flink/热温冷分层/规模设计
## 核心知识点
### Q: 数据处理Pipeline的总结和面试要点
安全数据处理Pipeline：采集(Kafka) → 解析/范式化(Logstash/Fluentd) → 富化(GeoIP/威胁情报/资产) → 存储(S3/HDFS) → 分析(SIEM/ML)

面试中你能展示的Pipeline思维：①理解数据从产生到分析的完整链路 ②能指出哪个环节是性能瓶颈(往往是解析阶段的正则→优化为grok pattern) ③知道Pipeline各环节的可靠性设计(日志丢失?格式变化?延迟?)
### Q: 怎么设计一个能处理日均TB级安全日志的Pipeline？
分治策略：
1. 边缘预处理：在Agent端先过滤(丢弃已知的噪音日志)→只发有价值的日志→减少传输量
2. Kafka分区：按时间或源IP做partition→Flink/Spark并行消费→提升处理吞吐
3. 热/温/冷分层：最近7天数据在ES(快速查询)→30天前归档到S3(低成本)→一年前数据用Athena/BigQuery按需查询
4. Schema on Read vs Schema on Write：先存原始JSON→查询时再定义Schema→灵活但查询慢→未来按需做ETL物化为Parquet
## 面试陷阱
- ML方法是手段不是目的——面试要讲你用ML解决了什么安全问题，不是炫耀模型有多复杂
- 模型效果评估不能只看Accuracy——安全领域的Accuracy因为数据极度不平衡(99.9%正常)而基本没有意义→要看Precision/Recall/F1特别是Recall
- 面试被问ML的局限性时→坦诚讨论训练数据过时/对抗演化/模型解释性三大挑战→展示你理解技术边界

## 今日检测
1. 将本Day的核心方法用Python实现一个简化的Demo(如自己写的Z-score异常检测)
2. 找一个相关的安全数据(CICIDS/Malware-traffic-analysis)→实践本Day的方法
3. 把本Day知识点整理成一个30秒的面试口述(录音自听)
