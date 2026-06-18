# Day 18：威胁情报平台应用
> [威胁情报面试核心] STIX/TAXII/MISP/威胁情报生命周期
## 核心知识点
### Q: 威胁情报的STIX/TAXII标准和MISP平台
STIX(Structured Threat Information eXpression)：JSON格式标准化威胁描述→包含威胁行为者/攻击模式(IOCs)/TTPs/应对措施
TAXII：交换协议→通过HTTPS在组织之间共享STIX数据
MISP(Malware Information Sharing Platform)：开源威胁情报平台→导入/管理/共享IOC和威胁事件→集成STIX

面试亮点：情报分三层→战略(APT趋势报告)、战术(TTP/攻击手法)、运营(IOC/具体IP/域名/Hash)→不同层受众不同(管理层/安全分析师/SIEM)
## 面试陷阱
- 面试讲防御不能只列举工具→要讲解决问题的思路和度量效果的方法
- 安全不只是技术合规——向管理层讲安全投入的ROI是高级工程师的核心能力
- 每个防御措施都讨论它防不了什么→展示对防御边界的清醒认知

## 今日检测
1. 将这个Day的核心概念用2分钟口述一遍(自录音)
2. 搜索对应的知名安全事件或CVE案例→准备1个面试可以用的实例
3. 找一篇该领域的行业报告(Gartner/Forrester/SANS)→提炼3个面试论据
