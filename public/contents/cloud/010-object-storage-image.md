# 对象存储桶泄漏风险与镜像安全加固

---

## 一、对象存储桶泄漏风险全景

**对象存储（S3 / OSS / COS / OBS）是当前云上数据泄漏的 No.1 载体**，原因在于：

1. **ACL / Policy 配置极容易出错**——JSON Policy 语法复杂，一个 `Principal: "*"` 就公开
2. **列表扫描门槛极低**——工具多、无需登录即可枚举
3. **桶名可预测**——`company-backup-2025`、`company-secret`、`company-static` 等
4. **跨账号/跨 Region 桶策略不易审计**——云上资产分散，安全团队常漏看

## 二、典型泄漏案例与原理

### 2.1 三类经典错误

```json
// ① 直接公开读写（最危险）
{
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",         // ❌ 所有人
    "Action": ["s3:GetObject", "s3:PutObject"],
    "Resource": "arn:aws:s3:::my-company/*"
  }]
}

// ② 列表可枚举（能列出桶内所有对象 Key）
{
  "Effect": "Allow",
  "Principal": "*",
  "Action": "s3:ListBucket",
  "Resource": "arn:aws:s3:::my-company"
}

// ③ "只有我们 VPC 能访问"——但 VPC ID 写错，意外写成公开
{ "Effect":"Allow","Principal":"*",
  "Condition":{"StringNotEquals":{"aws:SourceVpc":"vpc-OOPS-WRONG-ID"}} }
```

### 2.2 自动化扫描工具

```bash
# 1) 找公开 bucket
s3scanner scan --bucket-list potential_names.txt

# 2) grayhatwarfare / bucket-stream 实时监控新创建的桶
# 3) 自定义扫描逻辑（结合 AWS Organizations 内部账号）
for b in $(aws s3 ls | awk '{print $3}'); do
  status=$(aws s3api get-bucket-acl --bucket $b 2>&1)
  if echo "$status" | grep -q "AllUsers"; then
    echo "[!] PUBLIC: $b"
  fi
done
```

## 三、桶安全加固七步法

| 步骤 | 动作 | 工具 / 命令 |
|------|------|------------|
| ① | 强制关闭 Public Access | `aws s3api put-public-access-block` |
| ② | 默认拒绝 HTTP 明文访问 | Policy 中加 `aws:SecureTransport=false → Deny` |
| ③ | 启用服务端加密 SSE-KMS | 桶级别默认开启 AES256 / KMS |
| ④ | 禁止跨账号 / 匿名访问 | 使用 AWS SCP / 阿里云 Control Policy |
| ⑤ | 开启访问日志 + 审计 | 日志写入独立"审计桶"，保留 180 天 |
| ⑥ | 对象级别 Object Lock（WORM） | 对备份归档启用"一次写入，多次读取" |
| ⑦ | 版本控制 + 删除保护 | `versioning=Enabled` + MFA Delete |

### 3.1 强制 TLS Policy 示例

```json
{
  "Id": "ForceHTTPS",
  "Statement": [{
    "Sid": "DenyPlainHTTP",
    "Effect": "Deny",
    "Principal": "*",
    "Action": "s3:*",
    "Resource": ["arn:aws:s3:::my-secure-bucket", "arn:aws:s3:::my-secure-bucket/*"],
    "Condition": {"Bool": {"aws:SecureTransport": "false"}}
  }]
}
```

### 3.2 阿里云 OSS 等效加固

```bash
# 禁止匿名访问：在 Policy 中拒绝 Principal=*
aliyun oss put-bucket-acl oss://my-bucket private

# 开启 HTTPS 强制 + 防盗链 Referer
aliyun oss put-referer oss://my-bucket \
  --AllowEmptyReferer false \
  --Referer "https://*.corp.com"

# 开启访问日志
aliyun oss put-bucket-logging oss://my-bucket \
  --TargetBucket my-bucket-logs --TargetPrefix access/
```

## 四、容器镜像供应链安全

容器镜像与对象存储本质是相似问题——**信任边界**：如果构建、上传、拉取链路中的任何一环被污染，运行的 Pod 即不可信。

### 4.1 六步镜像安全基线

```
  源码构建 ──▶ 依赖扫描 ──▶ 镜像构建 ──▶ 镜像签名 ──▶ 准入校验 ──▶ 运行监控
     │             │             │            │            │            │
     │             │             │            │            │            │
   Git 安全     Snyk/OSV     Trivy CVE    Cosign        Kyverno      Falco / Tracee
                                 │                         │
                                 └──── image scan 结果 ────┘
```

### 4.2 镜像仓库配置要点

```bash
# ① 不可变 tag（防止 tag 被覆盖）
aws ecr put-image-tag-mutability \
  --repository-name my-app --image-tag-mutability IMMUTABLE

# ② 开启 image scan on push
aws ecr put-image-scanning-configuration \
  --repository-name my-app --image-scanning-configuration scanOnPush=true

# ③ K8s 节点使用 IAM Roles for Service Accounts (IRSA)
#    杜绝节点级 EC2 Instance Profile 拥有过大 ECR pull 权限
```

### 4.3 K8s 准入控制拒绝未签名镜像（Kyverno）

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-image-signature
spec:
  validationFailureAction: enforce
  rules:
    - name: check-signer
      match: { resources: { kinds: ["Pod"] } }
      verifyImages:
        - image: "registry.corp.com/*"
          key: |-
            -----BEGIN PUBLIC KEY-----
            MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE...
            -----END PUBLIC KEY-----
```

## 五、敏感文件扫描与应急

```bash
# 1. 扫描所有公开桶中的敏感文件
gitleaks detect --source ./s3-snapshot/ -v
trufflehog filesystem ./s3-snapshot/

# 2. 典型敏感后缀白名单化（只允许白名单类型公开）
#    允许公开的：.css / .js / .png / .jpg / .svg / .woff / .pdf（公开文档）
#    绝对不能公开：.env / .pem / .key / .sql / .bak / .zip / 身份证-护照扫描件

# 3. 应急处置 SOP（发现桶泄漏后）
#    ① 立即把桶 ACL 切为 Private
#    ② 评估已下载的对象规模（查看 access log）
#    ③ 涉及密钥：立即轮换所有泄露的密钥
#    ④ 涉及 PII / 敏感业务数据：启动数据泄露响应流程
#    ⑤ 后续 72 小时持续监控该桶访问日志
```

## 六、CheckList

- [ ] 所有生产桶默认强制开启 Block Public Access
- [ ] 桶 Policy 配置 Deny 非 HTTPS 访问
- [ ] 生产数据桶启用 SSE-KMS + Bucket Key
- [ ] 关键桶开启 Object Lock（WORM）保护归档
- [ ] 每日自动扫描公有桶 + 敏感文件，1 小时内告警
- [ ] 镜像仓库开启 scan-on-push + 不可变 tag + cosign 签名
- [ ] K8s 集群部署 Kyverno 或 OPA Gatekeeper 拒绝未签名镜像运行
- [ ] 桶访问日志写入独立"审计账号"桶，保留 ≥ 180 天
- [ ] 每季度至少执行一次"模拟红蓝对抗"——尝试在公司外网访问公司桶，验证防护效果
