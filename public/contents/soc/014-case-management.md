# 安全事件工单与案例管理：TheHive / Cortex 实战

> **📘 文档定位**：CISP 考试 安全运营 核心 | 难度：⭐⭐⭐ | 预计阅读：22 分钟
>
> 系统讲解安全事件工单管理系统（TheHive/Cortex）的部署与使用，覆盖事件创建/任务分配/可观测性分析/案例归档的全流程。

---

## 导航目录

- [一、事件管理平台概述](#一事件管理平台概述)
- [二、TheHive 部署与配置](#二thehive-部署与配置)
- [三、Cortex 分析器使用](#三cortex-分析器使用)
- [四、工单流转流程](#四工单流转流程)
- [五、案例管理与归档](#五案例管理与归档)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、TheHive 部署

```yaml
# docker-compose.yml
services:
  thehive:
    image: strangebee/thehive:5.2
    ports:
      - "9000:9000"
    environment:
      THP_SECRET: "your-secret-at-least-16-chars"
    command: --cortex-port 9001 --cortex-key ${CORTEX_KEY}
    volumes:
      - thehive-data:/etc/thehive
    depends_on:
      - cassandra
      
  cassandra:
    image: cassandra:4
    environment:
      CASSANDRA_CLUSTER_NAME: "TheHive"
    volumes:
      - cassandra-data:/var/lib/cassandra

  cortex:
    image: thehiveproject/cortex:3.1
    ports:
      - "9001:9001"
    environment:
      JOB_DIRECTORY: /tmp/cortex-jobs
    volumes:
      - cortex-data:/var/lib/cortex
    depends_on:
      - elasticsearch
```

---

## 二、工单生命周期

```
事件工单状态机：

  新建(New) → 分配中(Assigned) → 调查中(InProgress) → 
    处置中(Containment) → 验证中(Verification) → 
    已解决(Resolved) → 复盘(Reviewed) → 关闭(Closed)

工单字段：
  必填：标题/描述/严重度/影响系统/TLP标记
  自动关联：源告警/源IP/受影响主机/用户
  时间线自动记录：每个操作(时间+操作人+动作)
```

---

## 三、Cortex 分析器

```yaml
# 启用分析器
# Cortex Web UI → Organization → Analyzers → Enable

高频分析器：
  VirusTotal_GetReport_3_0:
    - 查询文件Hash/IP/域名的VT报告
    
  AbuseIPDB_GetReport_1_0:
    - IP信誉查询
    
  DNSDB_NameHistory_1_0:
    - DNS历史记录查询
    
  Shodan_Info_1_0:
    - IP资产信息
    
  EmailRep_GetReport_1_0:
    - 邮箱信誉查询

# TheHive中一键触发分析
# Case → Observables → 选中IP/Hash/域名 → Run Analyzers
```

---

## 四、与 Shuffle SOAR 联动

```
自动化案例管理闭环：

 SIEM告警 → Shuffle Playbook触发 →
   ① 自动创建TheHive Case
   ② 自动触发Cortex分析器(VT/AbuseIPDB等)
   ③ 分析结果写入Case
   ④ 根据结果自动分级
   ⑤ 通知分析师(企业微信/Slack)
   ⑥ 分析师处理 → Case关闭 → 复盘

缩MTTR效果：从告警→Case创建 从30分钟→10秒
```

---

## 五、Checklist

- [ ] TheHive + Cortex + Cassandra 部署
- [ ] Cortex分析器配置(VT/AbuseIPDB/DNSDB等)
- [ ] 工单状态机+自动化流转
- [ ] SIEM/EDR告警→自动创建Case
- [ ] 工单统计报表(开门/关闭/处理时长)
