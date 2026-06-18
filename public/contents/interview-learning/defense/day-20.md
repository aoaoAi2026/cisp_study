# Day 20：云安全架构与治理
> [云安全面试核心] CSPM/CWPP/CNAPP/云安全矩阵
## 核心知识点
### Q: CSPM、CWPP、CNAPP三者的关系和各自职责
CSPM(Cloud Security Posture Management)：云配置安全→检查S3是否公开、安全组是否0.0.0.0/0、IAM是否过度授权。工具：Prisma Cloud/Wiz/ScoutSuite
CWPP(Cloud Workload Protection Platform)：工作负载(VM/容器/Serverless)的安全→运行时威胁检测+漏洞管理+合规检查
CNAPP(Cloud Native Application Protection Platform)：CSPM+CWPP的整合→从代码到云端的全生命周期安全。Gartner定义的云安全终极形态
## 面试陷阱
- 面试讲防御不能只列举工具→要讲解决问题的思路和度量效果的方法
- 安全不只是技术合规——向管理层讲安全投入的ROI是高级工程师的核心能力
- 每个防御措施都讨论它防不了什么→展示对防御边界的清醒认知

## 今日检测
1. 将这个Day的核心概念用2分钟口述一遍(自录音)
2. 搜索对应的知名安全事件或CVE案例→准备1个面试可以用的实例
3. 找一篇该领域的行业报告(Gartner/Forrester/SANS)→提炼3个面试论据
