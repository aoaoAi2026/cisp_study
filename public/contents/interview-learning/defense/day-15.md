# Day 15：灾备与业务连续性(BCP/DRP)
> [BCP/DRP面试核心] BIA业务影响分析/RTO与RPO/灾备演练
## 核心知识点
### Q: BCP(业务连续性计划)和DRP(灾难恢复计划)的区别
BCP：整体业务连续性→确保关键业务流程灾难期间以可接受水平运行。包括业务影响分析(BIA)→识别关键流程和RTO/RPO
DRP：IT系统层面的灾难恢复→如何恢复IT基础设施和应用。RTO(Recovery Time Objective)可容忍停机时间、RPO(Recovery Point Objective)可容忍数据丢失量

面试举例：RPO=1小时→每小时做一次备份→最多丢失1小时数据。RTO=4小时→灾难发生后4小时内恢复业务。金融交易系统RTO可达分钟级，某些内部系统RTO可能是48小时
## 面试陷阱
- RTO和RPO搞混→RTO是恢复时间(Time),RPO是数据丢失量(Point)
- BCP不光有IT→业务部门/公关/法务都有BCP责任

## 今日检测
1. 为自己的组织做一个简化的BIA→列出3个最关键业务流程→估算各自的RTO和RPO
2. 调研AWS/Azure的灾难恢复服务→总结3种DR架构(Backup&Restore/Pilot Light/Warm Standby)
