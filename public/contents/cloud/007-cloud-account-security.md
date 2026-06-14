# 云账户安全：AK/SK 泄漏、RAM 权限与 IAM 最佳实践

> **📘 文档定位**：CISP 考试云安全核心内容 | 难度：⭐⭐⭐⭐ | 预计阅读：22 分钟
> AK/SK 泄漏是云上安全第一风险。本文从十大泄漏路径、应急处置 SOP、最小权限实践到 MFA 强制策略，全面覆盖云账户安全攻防要点。

---

## 导航目录
- [一、云账户风险全景](#一云账户风险全景)
- [二、AK/SK 泄漏的十大高危路径](#二aksk-泄漏的十大高危路径)
- [三、最小权限原则落地](#三最小权限原则落地)
- [四、MFA 与登录安全](#四mfa-与登录安全)
- [五、长期治理机制](#五长期治理机制)
- [六、账户安全 CheckList](#六账户安全-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、云账户风险全景

云上账户体系有三类典型角色：

| 角色 | 认证方式 | 风险点 |
|------|---------|-------|
| Root Account 主账号 | 密码 + MFA | 一旦泄露全盘失控 |
| RAM / IAM 子账号 | 密码 + 控制台 MFA | 弱口令、共享账号、权限过大 |
| AccessKey / AccessKeySecret | AK/SK 对 | 代码/配置/日志硬编码、CI 环境变量暴露 |

## 二、AK/SK 泄漏的十大高危路径

### 2.1 典型泄漏场景

1. **代码硬编码**：`access_key = "LTAI****************"` 提交至 Git
2. **配置文件残留**：`.env`、`application-prod.yml`、`terraform.tfvars`
3. **CI/CD 日志**：`echo $AWS_SECRET_ACCESS_KEY` 写入 stdout 并公开
4. **Docker 镜像层**：`COPY .env .` 导致镜像 layer 中可提取
5. **本地凭据文件**：`~/.aws/credentials`、`~/.aliyun/config.json` 在多设备共享
6. **工单 / 聊天记录**：工程师为了"快"，通过 IM 直接粘贴密钥
7. **前端 JS bundle**：构建时把服务端 AK/SK 错误打包进前端
8. **Public S3 / OSS 桶**：把带密钥的 `backup.tar.gz` 传到公开可读的桶
9. **离线设备**：离职员工笔记本未回收，磁盘残留密钥
10. **内网系统 / 文档**：Confluence / Notion 贴了生产 AK/SK

### 2.2 快速扫描工具

```bash
# 1. gitleaks - 扫描 Git 历史 + 当前代码
gitleaks detect --source ./my-repo -v

# 2. trufflehog - 主动校验 AK/SK 是否仍有效
trufflehog filesystem ./ --no-update

# 3. 扫描本地磁盘
find /home -type f \( -name "*.env" -o -name "*.yml" -o -name "credentials" \) \
  | xargs grep -lE "(AKIA|LTAI|secret|access_key|AccessKey)"

# 4. 阿里云 AK 泄漏自助检测
aliyun sts GetCallerIdentity    # 能成功说明 AK 有效且未被吊销
```

### 2.3 应急处置 SOP

```bash
# 发现 AK 泄漏后的黄金 15 分钟动作：
# 1. 立即禁用对应 AccessKey（控制台 / CLI / API）
aliyun ram UpdateAccessKey --UserName alice \
  --UserAccessKeyId LTAIxxxxx --Status Inactive

# 2. 查询该 AK 过去 24 小时操作审计日志
aliyun actiontrail LookupEvents \
  --StartTime "2025-01-10T00:00:00Z" \
  --EndTime   "2025-01-10T23:59:59Z" \
  --AccessKeyId LTAIxxxxx

# 3. 评估影响面：是否创建/删除了资源、是否下载了数据
# 4. 轮换所有被该 AK 可能接触的密钥（KMS、数据库密码等）
# 5. 强制所有子账号重置密码 + 强制开启 MFA
```

## 三、最小权限原则落地

### 3.1 权限分级策略

```yaml
# ❌ 反模式：给工程师 AdministratorAccess
# ✅ 正确：按角色授予精细化权限
roles:
  - name: DevReadOnly
    policies: [ReadOnlyAccess]
    target: 研发（只读看日志和指标）

  - name: DevOpsDeployer
    policies: [ECSFullAccess, SLBReadOnly, RDSReadOnly]
    target: 部署流水线 / CD

  - name: DBOperator
    policies: [RDSFullAccess, KMS-RotateOnly]
    target: DBA

  - name: SecurityAuditor
    policies: [ActionTrailReadOnly, SecurityCenterReadOnly]
    target: 安全审计团队
```

### 3.2 AWS IAM 策略最佳实践

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3WriteByPrefixOnly",
      "Effect": "Allow",
      "Action": ["s3:PutObject"],
      "Resource": ["arn:aws:s3:::my-app-backup/${aws:username}/*"]
    },
    {
      "Sid": "DenyIfNoMFA",
      "Effect": "Deny",
      "NotAction": ["iam:CreateVirtualMFADevice", "iam:EnableMFADevice"],
      "Resource": "*",
      "Condition": {
        "BoolIfExists": {"aws:MultiFactorAuthPresent": "false"}
      }
    }
  ]
}
```

### 3.3 阿里云 RAM 最佳实践

```bash
# 1. 开启 SCP 级组织管控（阿里云 Control Policy）
# 2. 禁止子账号直接创建长期 AK/SK，强制用 STS 临时 token
aliyun sts AssumeRole \
  --RoleArn acs:ram::123456789012:role/deployer-role \
  --RoleSessionName ci-deploy \
  --DurationSeconds 900   # 仅 15 分钟有效

# 3. 用 RAM Policy Simulator 仿真越权访问
aliyun ram SimulatePrincipalPolicy \
  --PolicySourceArn acs:ram::123456789012:user/alice \
  --ActionNames ecs:DeleteInstance \
  --ResourceOwnerAccount 123456789012
```

## 四、MFA 与登录安全

- **必须强制**：主账号、生产环境所有子账号、特权角色
- **推荐方案**：TOTP（Google Authenticator / 1Password）或硬件密钥（YubiKey / FIDO2）
- **辅助机制**：异地登录告警、非常用设备告警、登录 IP 白名单

```bash
# AWS 强制所有 IAM 用户启用 MFA（通过 SCP）
{
  "Sid": "DenyAllExceptMFAEnabled",
  "Effect": "Deny",
  "NotAction": [
    "iam:CreateVirtualMFADevice",
    "iam:EnableMFADevice",
    "iam:GetUser",
    "iam:ListMFADevices"
  ],
  "Resource": "*",
  "Condition": {"Bool": {"aws:MultiFactorAuthPresent": "false"}}
}
```

## 五、长期治理机制

| 机制 | 频率 | 目标 |
|------|------|------|
| 密钥自动轮换 | 每 90 天 | STS token 优先；长期 key 强制过期 |
| 闲置子账号清理 | 每 30 天 | 90 天未登录自动禁用 |
| 权限审计与收缩 | 每季度 | 根据 CloudTrail 操作日志收缩未使用的权限 |
| GitHub 公仓推送防护 | 实时 | push-protection + secret scanning |
| 跨账号角色信任链审计 | 每半年 | 检查 AssumeRole 是否信任了外部账号 |

## 六、账户安全 CheckList

- [ ] 主账号启用硬件 MFA，禁用控制台长期密码登录
- [ ] 所有 RAM / IAM 用户开启 MFA，未启用者自动禁用
- [ ] 使用角色（Role）+ STS 临时凭证，杜绝生产环境长期 AK/SK
- [ ] 代码仓库启用 gitleaks + secret-scanning pre-commit 钩子
- [ ] CI 环境变量不允许 echo / print 输出，日志中屏蔽敏感字段
- [ ] 所有 AccessKey 绑定 IP / VPC 条件策略，限制使用范围
- [ ] 开启操作审计 ActionTrail / CloudTrail，并异地留存 ≥ 180 天
- [ ] 建立 AK 泄漏应急 SOP，平均响应时间 ≤ 15 分钟

---

## 七、高分考点与知识巧记

> 🔑 **高分考点**：云账户安全是 CISP 考试的重中之重。AK/SK 泄漏路径、最小权限策略、MFA 强制机制、STS 临时凭证是四大核心考点。考试常以场景题出现——"代码仓库中发现硬编码的 AK，应如何处理？"

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| AK/SK 泄漏路径 | ⭐⭐⭐⭐⭐ | 代码硬编码、配置文件、CI 日志、Docker 镜像层、前端 JS bundle |
| 应急处置 SOP | ⭐⭐⭐⭐ | 立即禁用 → 查审计日志 → 评估影响 → 轮换密钥 → 强制 MFA |
| 最小权限原则 | ⭐⭐⭐⭐ | 按角色分权，STS 临时凭证替代长期 AK/SK |
| MFA 强制 | ⭐⭐⭐⭐ | 主账号 + 所有生产子账号必须开启，SCP 级强制 |
| IAM Policy 最佳实践 | ⭐⭐⭐ | Deny + Condition（IP/VPC/MFA），精确到资源级 |

> 💡 **知识巧记**：AK/SK 泄漏十大路径记"码配日镜像前工离内"——代码、配置、日志、镜像、前端、工单、聊天、设备、内网系统。应急五步记"禁查评换强"——禁用 AK、查审计、评估影响、轮换密钥、强制 MFA。最小权限三原则：角色分权、STS 临时、Condition 限域。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| Root 账号管理 | 禁用控制台密码，仅硬件 MFA，日常不用 | "Root 账号用于日常运维" ❌ |
| AK vs STS | STS 临时凭证 15min-12h 有效，杜绝长期 AK | "长期 AK 只要定期轮换就安全" ❌ |
| MFA 强制 | SCP 级 Deny 无 MFA 的所有操作 | "MFA 只是推荐，非强制" ❌ |
| gitleaks | 扫描 Git 历史 + 当前代码中的密钥 | "只扫当前版本即可" ❌ |
| CloudTrail | 操作审计保留 ≥ 180 天，异地存储 | "本地保留即可" ❌ |

### 知识巧记口诀

> **云账户安全口诀**：
> 主号 MFA 必须硬，日常运维不用它。
> AK/SK 禁硬编码，gitleaks 提交前查。
> STS 临时替长钥，角色分权最小化。
> 发现泄漏十五分，禁查评换强制 MFA。
> CloudTrail 审计异地存，Condition 限域保全家。
