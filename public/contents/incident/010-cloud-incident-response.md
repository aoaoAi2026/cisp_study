# 应急响应之云环境安全事件处置实战

---

## 📋 目录

1. [云应急 vs 传统IDC](#一云应急概述)
2. [AK/SK 泄露应急](#二aksk泄露)
3. [恶意挖矿应急](#三恶意挖矿)
4. [云资源劫持](#四资源劫持)
5. [云取证技术](#五云取证)
6. [AWS/阿里云/腾讯云应急对比](#六三云对比)
7. [完整案例](#七完整案例)

---

## 一、云应急概述

### 1.1 云 vs 传统IDC差异

```
传统IDC应急:
  ✦ 断网 = 拔网线 / 交换机ACL
  ✦ 取证 = 物理硬盘镜像
  ✦ 日志 = 服务器本地日志

云环境应急:
  ✦ 断网 = 安全组修改 / VPC隔离
  ✦ 取证 = EBS快照 / 云硬盘快照
  ✦ 日志 = CloudTrail / ActionTrail (全API审计)
  ✦ 优势: 攻击者每一步API调用都被记录!
  ✦ 优势: 快照秒级创建(无需停机)
```

### 1.2 云应急工具箱

```
AWS:      aws CLI / CloudTrail / GuardDuty / Security Hub
阿里云:   aliyun CLI / ActionTrail / 云安全中心
腾讯云:   tccli / 操作审计 / 主机安全(云镜)
通用:     Prowler / ScoutSuite / Cloudsplaining (云安全扫描)
```

---

## 二、AK/SK 泄露

### 2.1 发现 AK/SK 泄露

```
泄露渠道:
  ✦ GitHub 公开仓库(最常见!)
  ✦ 前端 JS 代码中
  ✦ 配置文件(.env / config.js)上传
  ✦ 员工钓鱼/社工
  ✦ 第三方服务配置

检测方法:
  ① GitHub 监控: "company.com" filename:.env
  ② CloudTrail: 异常的 API 调用来自新IP
  ③ GuardDuty: Stealth:PenTest/IAMUser/AnomalousBehavior
```

### 2.2 应急响应流程

```bash
# AWS AK/SK 泄露应急

# Step 1: 立即禁用泄露的 AK (30秒)
aws iam update-access-key \
  --access-key-id AKIAXXXXXXXXXXXXXXXX \
  --status Inactive

# Step 2: 审计已发生的操作 (10分钟)
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=AccessKeyId,AttributeValue=AKIAXXX \
  --start-time 2026-06-15T00:00:00Z \
  --end-time 2026-06-15T23:59:59Z \
  --max-results 50

# Step 3: 检查攻击者创建的资源
aws ec2 describe-instances --filters "Name=instance-state-name,Values=running" \
  --query 'Reservations[*].Instances[?LaunchTime>=`2026-06-15T00:00:00Z`]'

# Step 4: 删除恶意资源
aws ec2 terminate-instances --instance-ids i-xxx

# Step 5: 收回被修改的安全组规则
aws ec2 revoke-security-group-ingress \
  --group-id sg-xxx \
  --protocol tcp --port 22 --cidr 0.0.0.0/0

# Step 6: 轮换所有凭据
aws iam create-access-key --user-name zhangsan
# 更新应用 → 删除旧 AK
aws iam delete-access-key --user-name zhangsan --access-key-id AKIAXXX
```

```bash
# 阿里云 AK/SK 泄露应急

# 1. 禁用 AK
aliyun ram UpdateAccessKey --UserAccessKeyId <AK_ID> --Status Inactive

# 2. 查询操作历史
aliyun actiontrail LookupEvents \
  --Request "{\"LookupAttribute\":[{\"Key\":\"AccessKeyId\",\"Value\":\"<AK_ID>\"}]}"

# 3. 检查异常创建的ECS
aliyun ecs DescribeInstances --RegionId cn-hangzhou |
  jq '.Instances.Instance[] | select(.CreationTime > "2026-06-15")'

# 4. 删除攻击者创建的资源
aliyun ecs DeleteInstance --InstanceId i-xxx --Force true
```

### 2.3 预防 AK/SK 泄露

```bash
# 1. 使用 IAM Role 而非长期 AK (推荐)
# EC2/ECS → 绑定 IAM Role → 自动获取临时凭证

# 2. 启用 AK 自动轮换
# AWS: IAM → Access Advisor → 查看最后使用时间
# 超 90 天未使用的 AK → 禁用

# 3. GitHub 密钥扫描
# GitHub Advanced Security → Secret scanning
# 或: git-secrets, gitleaks 加入 pre-commit hook

# 4. 最小权限原则
# AK 对应的 IAM User/Role 仅授予必要的权限
# 生产环境: 禁止创建 Delete/Stop/Terminate 权限
```

---

## 三、恶意挖矿

### 3.1 发现挖矿

```
检测信号:
  ✦ CPU 持续 100%
  ✦ 云监控/CloudWatch CPU 告警
  ✦ 进程列表出现陌生进程
  ✦ 出站连接到矿池 IP
  ✦ 异常高额的云账单!

矿池特征端口:
  3333, 4444, 5555, 7777, 14444, 14433
  stratum+tcp://pool.xxx.com:4444
```

### 3.2 处置流程

```bash
# Step 1: 创建快照(取证)
# AWS:
aws ec2 create-snapshot --volume-id vol-xxx \
  --description "Forensic snapshot - cryptomining"
# 阿里云:
aliyun ecs CreateSnapshot --DiskId d-xxx --SnapshotName "forensic"

# Step 2: 隔离主机(保留文件系统用于分析)
# 安全组 拒绝所有出站
aws ec2 revoke-security-group-egress \
  --group-id sg-xxx --protocol -1 --port -1 --cidr 0.0.0.0/0

# Step 3: 登录排查
ssh ec2-user@<IP>
top -b -n1 | head -20             # CPU占用
ps auxf | grep -E "100|[0-9]{2}\.[0-9]"  # 高CPU进程
netstat -antp | grep ESTAB       # 网络连接

# Step 4: 清除
kill -9 <PID>
rm -rf /tmp/.cache/
crontab -r  # 清理计划任务
find / -user root -mtime -1 -type f 2>/dev/null  # 最近创建的文件

# Step 5: 溯源入口
# 检查 SSH 日志: /var/log/secure
grep "Accepted" /var/log/secure | tail -20
# 检查 CloudTrail/ActionTrail

# Step 6: 加固
# 修改密码 + SSH 密钥
# 安全组恢复 + 最小化
```

---

## 四、资源劫持

```
云资源劫持类型:
  ✦ 创建大量 EC2 挖矿(最常见)
  ✦ 创建 Lambda 函数(盗用计算资源)
  ✦ 开放 S3 桶(数据泄露)
  ✦ 修改安全组(开放后门端口)
  ✦ 创建 IAM 用户(持久化)

排查命令:
  # 检查新创建的 EC2
  aws ec2 describe-instances --filters Name=instance-state-name,Values=running |
    jq '.Reservations[].Instances[] | {Id:.InstanceId, Time:.LaunchTime, Type:.InstanceType}'
  
  # 检查新创建的 IAM 用户
  aws iam list-users --query 'Users[?CreateDate>=`2026-06-15`]'
  
  # 检查公开的 S3 桶
  aws s3api list-buckets --query 'Buckets[].Name' |
    xargs -I {} aws s3api get-public-access-block --bucket {} 2>/dev/null
```

---

## 五、云取证

### 5.1 取证工具链

```bash
# 1. CloudTrail 日志导出
aws cloudtrail lookup-events > trail_events.json

# 2. VPC Flow Logs 分析
aws ec2 describe-flow-logs

# 3. EBS 快照取证
aws ec2 create-snapshot --volume-id vol-xxx
# → 从快照创建新卷 → 挂载到取证实例 → 分析

# 4. 内存取证(EC2)
# EC2 不支持直接内存 dump → 使用 LiME
# 通过 SSM Run Command 或 SSH:
insmod lime.ko "path=/tmp/memory.lime format=lime"

# 5. S3 访问日志
aws s3api get-bucket-logging --bucket xxx

# 6. 安全组变更历史
aws ec2 describe-security-group-rules --filters Name=group-id,Values=sg-xxx
```

### 5.2 时间线构建

```
云取证时间线 = 整合多个日志源:

1. CloudTrail (API调用记录)
   时间戳 + 操作 + 用户/AK + 源IP + 结果

2. VPC Flow Logs (网络流量)
   时间戳 + 源IP:端口 + 目标IP:端口 + 字节数

3. EBS 快照 (文件系统)
   文件修改时间 + 进程执行

4. 安全组变更日志
   谁 + 什么时间 + 修改了什么规则

→ plaso/log2timeline 构建统一时间线
```

---

## 六、三云对比

| 操作 | AWS | 阿里云 | 腾讯云 |
|------|-----|--------|--------|
| 禁用AK | `aws iam update-access-key` | `aliyun ram UpdateAccessKey` | `tccli cam UpdateAccessKey` |
| 审计日志 | CloudTrail | ActionTrail | 操作审计 CloudAudit |
| ECS快照 | `aws ec2 create-snapshot` | `aliyun ecs CreateSnapshot` | `tccli cbs CreateSnapshot` |
| 隔离主机 | 安全组deny所有 | 安全组deny所有 | 安全组deny所有 |
| 主机安全 | GuardDuty | 云安全中心 | 主机安全(云镜) |

---

## 七、完整案例

```
案例: AWS AK 泄露 → 挖矿 → 处置

Day 1 18:00: 发现
  CFO: "这个月的AWS账单怎么多了$8,000?"
  → 安全团队查 CloudTrail

Day 1 18:15: 定位
  CloudTrail 显示 AK: AKIAXXX 在过去72小时:
  ✦ 创建 15 台 g4dn.xlarge GPU 实例! (挖矿)
  ✦ 每天费用 ≈ $2,000+
  ✦ 源IP: 45.xxx.xxx.xxx (海外VPS)

Day 1 18:16: 遏制
  ✓ 禁用 AK → aws iam update-access-key --status Inactive
  ✓ 终止15台挖矿实例

Day 1 18:20: 排查泄露源
  ✓ GitHub 搜索: "AKIAXXX" → 命中!
  → 前端开发 3 天前将 .env 文件提交到 GitHub
  → AK/SK 明文暴露

Day 1 18:30: 审计
  ✓ CloudTrail 审计该AK的所有历史操作
  → 确认仅创建了GPU实例(挖矿)
  → 未访问 S3/数据库(幸运!)

Day 1 19:00: 恢复
  ✓ 轮换所有AK
  ✓ 清理GitHub commit (git filter-branch)
  ✓ 增加 git-secrets pre-commit hook
  ✓ IAM 培训(禁止提交凭证到代码)

损失: $8,000 直接费用 + 5小时应急时间
教训: .env 必须加入 .gitignore
```

---

## ✅ 云应急 Checklist

- [ ] 禁用泄露的 AK/SK (30秒内)
- [ ] CloudTrail/ActionTrail 审计
- [ ] 删除攻击者创建的资源
- [ ] 快照取证(保留证据)
- [ ] 轮换所有凭据
- [ ] 安全组恢复
- [ ] Github 密钥扫描
- [ ] 加强 IAM 策略(最小权限+MFA)
