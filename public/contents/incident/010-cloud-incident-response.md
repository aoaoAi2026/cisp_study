# 云环境安全事件应急响应

---

## 一、云环境应急的特殊性

```
云 vs 传统IDC应急差异：

传统：物理断网 → 拔网线/交换机ACL
云：安全组隔离 / VPC流日志 / IAM策略紧急收紧

传统：磁盘取证 → 物理硬盘镜像
云：EBS快照取证(AWS) / 云硬盘快照(阿里云)

传统：日志来源有限
云：CloudTrail/ActionTrail全量API审计 → 攻击者每一步都被记录
```

---

## 二、AK/SK 泄露应急

```
云上最常见的安全事件 = 凭证泄露

检测信号：
  • CloudTrail中出现了非预期的CreateInstance操作
  • API调用来自非业务IP/海外IP
  • 异常大量API调用

响应流程：
Step 1: 立即禁用泄露的AK/SK
  AWS: "aws iam update-access-key --access-key-id AKIAXXX --status Inactive"
  阿里云: "aliyun ram UpdateAccessKey --UserAccessKeyId xxx --Status Inactive"

Step 2: 审计已执行的操作
  → CloudTrail查询该AK的所有操作记录
  → 排查：是否创建了新实例/修改了安全组/导出了数据？

Step 3: 收回被修改的配置
  → 删除攻击者创建的资源
  → 恢复被修改的安全组规则/IAM策略

Step 4: 轮换所有可能泄漏的凭证
  → 创建新AK，更新所有应用 → 删除旧AK
```

---

## 三、恶意挖矿应急

```
云主机被植入挖矿程序是最常见的安全事件之一

检测：
  • CPU持续100%
  • 云监控/CloudWatch CPU告警
  • 进程列表出现异常进程（名称伪装如[syslogd]）
  • 连接矿池IP（可通过威胁情报匹配）

响应：
  ① 隔离主机（安全组拒绝所有出站）
  ② 快照取证（保留下一步分析的证据）
  ③ 终止挖矿进程 + 计划任务
  ④ 加固入口（SSH弱口令？Web漏洞？API凭证泄露？）
  ⑤ 同安全组/VPC内其他主机排查
```

---

## 四、云取证要点

```bash
# AWS CloudTrail 查询示例
# 查询某时间段某用户的所有操作
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=Username,AttributeValue=compromised_user \
  --start-time 2026-01-01T00:00:00Z \
  --end-time 2026-01-02T00:00:00Z \
  --max-results 50

# 阿里云 ActionTrail 查询
aliyun actiontrail LookupEvents \
  --Request "{\"LookupAttribute\":[{\"Key\":\"EventName\",\"Value\":\"RunInstances\"}]}"
```

```
云取证清单：
□ CloudTrail/ActionTrail 日志导出
□ VPC流日志(Flow Logs)
□ 受影响EC2/ECS的EBS快照/云硬盘快照
□ 安全组/IAM策略变更历史
□ S3/OSS 访问日志
□ 数据库审计日志(RDS/Redis等)
```

---

## 五、Checklist

- [ ] AK/SK泄露应急SOP
- [ ] 恶意挖矿检测与清除流程
- [ ] 云日志全量开启(CloudTrail/ActionTrail/VPC Flow)
- [ ] 云资源快照取证流程
- [ ] 云安全组应急隔离策略模板
- [ ] 与云厂商安全团队联络接口
