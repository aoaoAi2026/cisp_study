# Day 21：云计算基础与安全
> 🎯 面试目标：掌握云安全面试高频题——共享责任模型/IAM/容器安全/云原生攻击面
## 核心知识点
### Q: 解释云安全中的"共享责任模型"，并举例说明可能的责任不清漏洞
共享责任模型(Shared Responsibility Model)核心：云厂商负责"云的安全"(Security OF the Cloud)，用户负责"云中的安全"(Security IN the Cloud)。

**典型责任不清漏洞**：
1. **S3桶公开(最经典)**：用户以为S3默认私有→但Block Public Access不是默认开启→Capital One 2019年1亿用户数据泄露的根因
2. **RDS快照公开共享**：设置为public→任何人可用你的快照启动DB实例
3. **安全组0.0.0.0/0开放22/3389**：暴力破解和0day漏洞不关心你有密钥
4. **IAM密钥泄露**：代码仓库意外commit了AccessKey→被扫描机器人抓取→创建EC2挖矿

**面试金句**：云厂商永远不会替你管好IAM和S3权限，用ScoutSuite/Prowler检查你"应做但没做"的配置
### Q: Docker/K8s容器安全有哪些面试必问点？
**Docker安全**：①不以root运行→`USER 1000` ②只读根文件系统→`--read-only` ③限制Capabilities→`--cap-drop=ALL --cap-add=NET_BIND_SERVICE` ④镜像扫描→Trivy/Clair找CVE ⑤资源限制→`--memory=512m --cpus=1`

**K8s安全(CIS Benchmark关键点)**：①RBAC最小权限→不允许cluster-admin绑定default SA ②Pod Security Standards→禁止privileged/hostNetwork ③NetworkPolicy→入站白名单 ④Secret etcd加密→不用base64当加密 ⑤准入控制→OPA/Gatekeeper拒绝不安全配置

**面试亮点**：提到`kube-bench`/`kube-hunter`/`Falco`这些工具说明你做过K8s安全实践
### Q: 什么是云原生攻击链？攻击者如何从公网打到内网？
**云原生攻击链7步**：
1. 初始访问：Web SSRF→169.254.169.254/IMDSv1获取IAM临时凭证
2. 信息收集：`aws sts get-caller-identity`确认权限→`aws ec2 describe-instances`枚举资源
3. 权限提升：IAM Role链Assume→Lambda函数中有Admin权限被利用
4. 横向移动：SSRF入侵VPC内EKS的kubelet→拿到kubeconfig控制Pod
5. 凭据访问：Lambda环境变量/env→ECS Task Definition→Secrets Manager
6. 数据收集：S3批量下载→RDS dump→DynamoDB scan
7. 持久化：创建新IAM用户→跨账号信任→Lambda定时触发器反弹shell

**面试加分**：Capital One SSRF通过IMDS获取S3的IAM Role→强调IMDSv2强制PUT获取Token是核心防御
### Q: 云架构中的"纵深防御"如何实现？给一个三层示例
**三层纵深防御(Web上云为例)**：

**L1-边缘**：CloudFront+WAF→过滤SQL注入/XSS/DDoS→ALB TLS终结→仅443入站
**L2-网络**：ALB在Public Subnet→Web/App在Private Subnet→DB在最内层→出站只放3306→DB无公网IP
**L3-身份与数据**：Web容器用指定Role读S3→数据库密码从Secrets Manager获取(自动轮换)→CloudTrail记录API→GuardDuty异常检测→自动隔离被入侵EC2

**加分项**：HashiCorp Vault管理动态DB凭据(租约到期回收)+ Lambda自动响应GuardDuty
### Q: 什么是IMDS(实例元数据服务)？IMDSv1和IMDSv2的区别？
IMDS(169.254.169.254)是AWS实例获取临时凭证和配置的内部端点，仅限实例内部访问。

**IMDSv1**：只需GET请求就能拿到IAM Role临时凭证→SSRF可直接利用
**IMDSv2**：先PUT获取Token(需X-aws-ec2-metadata-token-ttl-seconds头)→再GET带Token→SSRF攻击者通常只能发GET(不能带自定义Header)

**面试必知**：2024年起AWS新账号默认强制IMDSv2，但老账号可能还是v1。`MetadataNoToken` CloudWatch指标可监控仍有v1请求的实例
## 面试陷阱
- ⚠️ S3公开桶的四种'公开'混淆——Block Public Access(桶级)/Bucket Policy(策略级)/ACL(对象级)/Object URL(直接访问)→面试官可能每种都问
- ⚠️ Security Group和NACL的区别——SG有状态+实例级，NACL无状态+子网级→搞混暴露基础不牢
- ⚠️ 把KMS「密钥管理」和「加密」混为一谈——KMS不存数据，只做密钥管理和加解密API调用

## 今日检测
1. 用AWS CLI `aws sts get-caller-identity`确认当前身份→`aws s3 ls`列桶→用ScoutSuite扫描你的AWS测试账号
2. 手动发送IMDSv1和IMDSv2请求：`curl http://169.254.169.254/latest/meta-data/iam/security-credentials/` →对比差异
3. 用Trivy扫描Docker镜像：`trivy image nginx:latest`
