# 云上资产安全治理：CMDB / 暴露面 / 影子资产

---

## 一、云上资产安全面临的三大难题

云上资产具有"弹性、分布式、易被遗忘"三个特征，导致传统基于台账的资产管理方式完全失效：

1. **数量爆炸**：一个中等规模企业在云上可能有数千 VM、数万个对象存储桶、数十个 VPC
2. **影子资产**：研发为了方便创建的资源（EC2/S3/RDS 实例）没有进入正式 CMDB
3. **暴露面失控**：公网 IP 开放 22/3389 端口、S3 桶误设为 public、RDS 实例绑定公网

## 二、统一 CMDB 建设要点

CMDB 应至少覆盖以下维度，并支持"云原生 API 自动采集 + 人工标注"双模式：

| 资产类型 | 必录字段 | 采集方式 |
|---------|---------|---------|
| 云主机 | 实例 ID、VPC、安全组、公网 IP、标签、归属业务 | AWS CLI / 阿里云 SDK |
| 数据库 | 引擎版本、公网开关、备份策略、加密状态 | CloudTrail / ActionTrail |
| 对象存储 | 桶名、ACL、Policy、加密状态、日志配置 | SDK 轮询 |
| 负载均衡 | 监听器配置、后端服务、TLS 版本 | API 采集 |
| 域名 / 证书 | 过期时间、CA、算法、CN/SAN | CT Log + DNS 查询 |

```bash
# 批量列出阿里云所有 ECS 公网 IP
aliyun ecs DescribeInstances --RegionId cn-hangzhou \
  | jq '.Instances.Instance[] | {Id:.InstanceId, IP:.PublicIpAddress.IpAddress[0], SG:.SecurityGroupIds.SecurityGroupId}'

# 列出 AWS 所有 S3 桶并检查是否 Public
aws s3api list-buckets --query "Buckets[].Name" --output text | \
  xargs -I {} aws s3api get-bucket-acl --bucket {}
```

## 三、暴露面收敛与风险量化

### 3.1 端口暴露面扫描

```bash
# 用 masscan + nmap 扫描公网暴露端口
masscan 10.0.0.0/16 -p22,80,443,3306,3389,6379,8080,9200 --rate 5000 -oL exposure.txt

# 针对云上资产做自动化指纹识别
nuclei -l targets.txt -t cves/ -t exposed-tokens/ -o nuclei-report.html
```

### 3.2 典型"高风险暴露面"清单

| 场景 | 风险等级 | 处置建议 |
|------|---------|---------|
| SSH(22) / RDP(3389) 开放 0.0.0.0/0 | 严重 | 收敛到办公网出口 IP + 堡垒机 |
| Redis(6379) / MongoDB(27017) 无认证公网 | 严重 | 关闭公网 + 启用 TLS 认证 |
| ElasticSearch(9200) 未启用安全插件 | 高危 | 启用 x-pack，白名单访问 |
| S3 / OSS 桶公开可读 | 高危 | 强制 Block Public Access |
| 数据库实例绑定公网 | 高危 | 改内网访问 + VPN 通道 |
| K8s API Server / kubelet 未鉴权 | 严重 | 强制 x509 或 RBAC |

## 四、影子资产与匿名资源发现

影子资产产生的常见原因：

- 研发使用个人 AK/SK 创建资源，未走公司流程
- 临时测试环境忘记销毁（尤其按量付费实例）
- Terraform `taint` 失败导致资源"孤儿化"
- 跨账号/跨 Region 迁移后遗漏旧资源

### 4.1 发现手段

```bash
# 1. 对比 CMDB 台账 vs 云上实时资源
# 2. 检查成本账单中"异常"资源（未纳入预算的费用）
# 3. 无标签/标签缺失的资源（Tag Enforcement）

# AWS 标签合规检查
aws resourcegroupstaggingapi get-resources \
  --query 'ResourceTagMappingList[?!not_null(Tags[?Key==`Owner`])]'

# 阿里云未打标签资源扫描
aliyun tag GetResources --ResourceTypeArns acs:ecs:*:*:instance/* \
  | jq '.Resources[] | select(.Tags==null)'
```

### 4.2 标签治理最佳实践

推荐强制打以下 6 个标签：

| Tag Key | 示例 | 用途 |
|---------|------|------|
| `Owner` | zhangsan@corp.com | 责任到人 |
| `Business` | payment / order | 业务归属 |
| `Environment` | prod / stage / dev | 环境分层 |
| `CostCenter` | CC-10086 | 成本分摊 |
| `Confidentiality` | public / internal / secret | 数据分级 |
| `Compliance` | gdpr / djbh / pci | 合规标记 |

## 五、攻击面收敛自动化

```yaml
# 推荐自动化治理流程（用 Cloud Custodian / 云管家）
policies:
  - name: stop-unused-ec2
    resource: aws.ec2
    filters:
      - type: offhour
        weekends: true
    actions:
      - stop

  - name: block-public-s3
    resource: aws.s3
    filters:
      - type: check-public-block
    actions:
      - type: set-public-block

  - name: quarantine-compromised-sg
    resource: aws.security-group
    filters:
      - type: ingress
        Cidr:
          value: "0.0.0.0/0"
        Ports: [22, 3389]
    actions:
      - type: remove-permissions
```

## 六、治理 CheckList

- [ ] CMDB 完成首轮盘点，覆盖率 ≥ 95%
- [ ] 资源强制打 6 个标准标签，CI/CD 阻断未打标签部署
- [ ] 每日自动扫描公网暴露面，异常资源 1 小时内告警
- [ ] S3 / OSS 桶开启 Block Public Access
- [ ] 数据库、缓存、消息队列禁止绑定公网 IP
- [ ] 定期（每季度）清理未使用/标签缺失的影子资产
- [ ] 成本账单接入异常检测（费用突增 30% 以上告警）
