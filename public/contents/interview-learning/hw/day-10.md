# Day 10：漏洞扫描与验证
> [漏洞扫描面试核心] Nessus/OpenVAS/误报处理/SCA/SBOM
## 核心知识点
### Q: 漏洞扫描的原理和主流工具
漏洞扫描器工作原理：①资产发现(ICMP/TCP探测) ②端口扫描(服务识别) ③版本检测(banner/特征匹配) ④漏洞匹配(CVE库映射到检测脚本/NASL) ⑤验证测试(发送专用PoC→看响应是否证明漏洞存在)

主流工具：Nessus(商业，最广泛)/OpenVAS(开源，Nessus的前身)/Nexpose(Rapid7)/Qualys(云端SaaS)。Web专用：AWVS/AppScan/Burp Scanner

面试区分：Network Scanner(Nessus/OpenVAS)扫操作系统和网络设备漏洞，Web Scanner(AWVS/Burp)扫Web应用漏洞，两者互补。有经验的面试官会追问扫描调度策略——生产环境什么时候扫描、扫前需要什么审批
### Q: 漏洞扫描的常见误报和如何降低
漏洞扫描误报来源：①版本号匹配(端口Banner显示nginx/1.18但实际已打补丁→扫描器只看版本号) ②环境差异(测试环境的漏洞在生产环境已修复但扫描器不知道) ③配置差异(nginx实际已通过配置修复了CVE但扫描器只检测版本号)

降低误报的方法：①认证扫描(给扫描器凭据)→检验补丁安装情况而非只猜版本 ②漏洞验证→扫描器不仅要匹配版本还要发送Payload确认漏洞真的存在 ③和业务Owner确认→配置已修补、实际不受影响

关键：扫描只是发现Potential Issue，不一定每个都要修——安全团队要区分真正的风险和被误报的假风险
### Q: OWASP Dependency-Check和SCA(软件组成分析)有什么关系？
SCA(Software Composition Analysis)检查你的应用依赖了哪些第三方组件→这些组件是否有已知CVE。OWASP Dependency-Check是最广泛的开源SCA工具(Java/.NET/Python/Node.js都支持)。

面试考点：①为什么会出Log4Shell(CVE-2021-44228)——就是SCA没做到位，大量企业不知道依赖了有漏洞的Log4j版本 ②SBOM(Software Bill of Materials)→CycloneDX/SPDX标准格式——美国联邦政府已强制供应商提供SBOM ③SCA不只检查直接依赖→还要检查间接依赖(依赖的依赖)→Dependency-Check的这个能力叫transitive dependency分析
## 面试陷阱
- 不要说只跑Nessus就够了——扫描需要适当提前通知业务方(避免误报告警海啸)
- SBOM不只是工程师的事——法务和合规团队也关心第三方组件的开源许可证合规

## 今日检测
1. 在靶机环境(MetaSploitable2)用Nessus/OpenVAS做全端口+全漏洞扫描→分析报告
2. 用OWASP Dependency-Check扫描一个Java/Node项目→看依赖树的CVE
