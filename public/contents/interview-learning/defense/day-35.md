# Day 35：云安全与零信任面试专题 — 面试真题冲刺

> 🔥 今日目标：刷完 20 道面试真题，正确率 > 80%

## 真题集

### 第1题
**题目**：什么是云安全责任共担模型？举例说明AWS的责任边界

<details>
<summary>查看答案</summary>

**标准答案**：云厂商负责'云的安全'(物理/网络/虚拟化层)，客户负责'云中的安全'(操作系统/应用/数据/身份/Customer Data)。具体：AWS负责全球基础设施+EC2物理服务器+网络→客户负责EC2内OS补丁、应用防火墙、数据加密、IAM配置。一句总结：如果你能配置它，那你负责保护它。

**加分点**：提及'责任共担'的变体——SaaS(客户只负责数据+身份)、PaaS(客户负责应用+数据)、IaaS(客户几乎全负责)，以及对应的不同安全控制重点。

**常见错误**：把所有安全责任都推给云厂商——'我用了云所以安全是AWS的事'是大忌。

</details>

### 第2题
**题目**：CASB(云访问安全代理)的四种部署模式和核心功能？

<details>
<summary>查看答案</summary>

**标准答案**：四种模式：1)API模式(直接调用SaaS API扫描数据、审计权限——最常用) 2)正向代理(客户端→CASB→云，SSL解密查看内容) 3)反向代理(云→CASB→客户端，实时DLP) 4)多模式组合。核心功能：影子IT发现、DLP数据防泄密、UEBA异常行为检测、合规性报告、自适应访问控制。

**加分点**：实际案例：某公司用CASB发现市场部在免费版Dropbox存了客户数据→迁移到企业版+DLP策略+加密。

**常见错误**：认为CASB可以替代IDP/SSO——CASB是应用层安全，IDP是身份层，两者互补。

</details>

### 第3题
**题目**：云上IAM最佳实践？什么是最小权限的自动化实现？

<details>
<summary>查看答案</summary>

**标准答案**：六大实践：1)不用Root Account日常操作 2)IAM Role替代长期Access Key(临时凭证) 3)权限边界(Permission Boundary)限制最大权限 4)SCP(Service Control Policy)组织级兜底 5)IAM Access Analyzer自动化最小权限建议 6)定期Access Review(如每个季度审查所有IAM用户)。自动化：AWS IAM Access Analyzer基于CloudTrail日志分析实际使用的权限→生成只包含已用权限的策略→一键应用。

**加分点**：提及Terraform/CloudFormation IaC管理IAM → 代码审查确保权限变更可控。

**常见错误**：长期使用Access Key而不用STS临时凭证 → 密钥泄露风险极高。

</details>

### 第4题
**题目**：容器安全的核心挑战和解决方案？

<details>
<summary>查看答案</summary>

**标准答案**：四大挑战：1)镜像安全(基础镜像含已知漏洞)→镜像扫描(Trivy/Clair)+签名验证(Cosign) 2)运行时安全(容器逃逸/提权)→Falco(运行时异常检测)+非root运行+只读文件系统 3)编排层安全(K8s RBAC过宽/etcd暴露)→Pod Security Standards(restricted)+Network Policy微分段 4)供应链安全(恶意镜像/依赖污染)→SBOM(SPDX/CycloneDX)+SLSA框架。

**加分点**：K8s CIS Benchmark合规检查工具(kube-bench)，演讲时能展示对CNCF安全生态的了解。

**常见错误**：镜像扫描完不修→扫描报告沦为摆设。必须建立'Critical/High漏洞阻断CI/CD流水线'的机制。

</details>

### 第5题
**题目**：如何设计一个云原生SIEM方案？

<details>
<summary>查看答案</summary>

**标准答案**：三层采集：控制面(CloudTrail/Azure Monitor)→资源日志(ALB Logs/VPC Flow Logs/GuardDuty)→应用日志(K8s audit+Pod log)。管道：CloudWatch/Kafka→Fluentd→S3(热存储)+Glacier(冷存储)。分析引擎：Athena(即席查询)+ElastAlert(实时告警)+自定义Python Lambda(结合威胁情报)。关键考虑：云日志的量级(每天TB级)→成本优化(智能分层+S3生命周期)，以及多账号环境的日志聚合(通过AWS Organizations集中到Security Account)。

**加分点**：提及OpenSearch(云版ELK)和Detective的可视化调查能力，以及CloudTrail Lake的SQL查询。

**常见错误**：采集了所有日志但不设置告警规则→日志湖变成日志沼泽。

</details>

### 第6题
**题目**：Kubernetes RBAC和Network Policy的关系？怎么做到纵深防御？

<details>
<summary>查看答案</summary>

**标准答案**：RBAC(主体能做什么)限制API操作(如谁可以创建Pod/读Secret)，Network Policy(负载能跟谁通信)限制Pod间的东西向流量。纵深防御=RBAC(防止恶意操作)+Network Policy(即使容器被控也限制横向移动)+Pod Security Standards(防止特权容器)+OPA/Gatekeeper(策略即代码)。攻击场景：即使攻击者获得了某个Pod的Shell→RBAC限制不能创建新Pod→Network Policy限制只能访问同一个namespace→不能访问kube-system和数据库。

**加分点**：提及Cilium(eBPF替代iptables实现Network Policy)和Tetragon(实时安全可观察性)。

**常见错误**：默认允许所有Pod间通信→一旦一个Pod被控，整个集群都是平的。

</details>

### 第7题
**题目**：WAF和RASP的区别？分别解决什么问题？

<details>
<summary>查看答案</summary>

**标准答案**：WAF(Web应用防火墙)在网络层/应用层检测和阻断攻击：SQL注入、XSS、CSRF等。RASP(运行时应用自我保护)嵌入应用进程内部：监控函数调用(如Runtime.exec/sql查询)→检测到恶意调用时在应用层阻断。关键区别：WAF看流量模式(可能被编码/加密绕过)，RASP看代码执行行为(更精确但增加性能开销)。趋势：WAF+RASP组合——WAF处理已知攻击，RASP处理WAF绕过的0day/高级攻击。

**加分点**：实战部署：AWS WAF+Lambda自定义规则→覆盖OWASP Top 10→Fine Tuning降低误报。RASP用开源如OpenRASP/商业如Contrast Security。

**常见错误**：RASP部署到生产前没做充分性能测试→对延迟敏感的API可能增加20-30ms开销。

</details>

### 第8题
**题目**：怎么检测云上加密货币挖矿行为？

<details>
<summary>查看答案</summary>

**标准答案**：三个信号源：1)CloudTrail(异常EC2实例创建/实例类型变更→GPU类型G4/P3/P4的出现) 2)VPC Flow Logs/GuardDuty(连接已知矿池域名/Stratum协议端口:4444/3333/14444) 3)资源指标(CPU持续100%/GPU占用异常/网络出流量远大于入流量)。自动化响应：GuardDuty+CryptoCurrency Finding→触发Lambda→隔离实例(移除安全组+保留磁盘做取证)→通知SOC+生成工单。

**加分点**：提及AWS Config自动修复规则(auto-remediation)和Terraform GuardDuty Delegated Administrator跨账号部署。

**常见错误**：仅依赖CPU指标(挖矿程序可能限制CPU使用率、用GPU挖矿时CPU不高)。

</details>

### 第9题
**题目**：云上数据保护的核心技术栈和分类分级方案？

<details>
<summary>查看答案</summary>

**标准答案**：三层保护：识别(Macie/Data Discovery扫描S3/RDS发现PII→自动分类分级)→保护(KMS/CloudHSM加密+强制HTTPS+S3默认加密+Macie自动应用Bucket Policy)→监控(CloudTrail Data Events记录对象级访问+Macie告警公开桶+DLP检测外泄)。分类分级：公开→内部→机密→绝密，每级对应不同的加密和访问控制要求。

**加分点**：提及S3 Object Lambda(动态数据处理→访问时自动脱敏PII)，展示对云原生隐私计算的了解。

**常见错误**：只加密不管理密钥→KMS key policy设太宽(所有IAM用户都能解密)→等同于没加密。

</details>

### 第10题
**题目**：谈谈你对零信任在云上落地的理解

<details>
<summary>查看答案</summary>

**标准答案**：零信任三大支柱在云上的实现：1)身份(IAM+SSO+MFA+Cognito+Condition Keys基于标签/IP/时间的动态权限) 2)设备(超出云范畴，但可集成MDM设备状态的SAML断言) 3)网络(不再依赖VPC/子网作为信任边界→每个资源独立安全组→API Gateway私有端点→VPC Lattice服务网格)。核心：AWS PrivateLink+Endpoint Policies→S3/DynamoDB等不需要经过公网→限制只能从特定VPC端点访问。

**加分点**：提及AWS Verified Access(类似BeyondCorp的零信任远程接入)+AWS IAM Roles Anywhere(非AWS工作负载也能用IAM)。

**常见错误**：把所有资源放一个VPC就觉得'内网安全了'→不符合零信任精神——内部流量也要加密(mTLS)。

</details>

---

**面试策略提示**：答题时注意 STAR 法则（情境-任务-行动-结果），先给主干结论再展开细节。
