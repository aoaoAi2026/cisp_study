# 云账户安全：AK/SK 泄漏、RAM 权限与 IAM 最佳实践

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
