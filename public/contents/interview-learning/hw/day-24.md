# Day 24：内网攻击检测
> [内网检测面试核心] 横向移动/Lateral Movement/Pass-the-Hash检测
## 核心知识点
### Q: 内网攻击检测的关键信号
横向移动检测五信号：
①PsExec→目标机的$ADMIN共享被访问(Event 5140)+PsExec服务创建(Event 7045/4697)→服务名常见PSEXESVC
②WMI执行→wmiprvse.exe加载了异常子进程→或WMI持久化(Event 5861, WMI活动)
③PowerShell Remoting→winrm服务启动→目标机的wsmprovhost进程
④Pass-the-Hash→Event 4624 LogonType=3+LogonProcess=NtLmSsp+AuthPkg=NTLM+不含域名的用户名→这些是PTH的特征
⑤RDP→Event 4624 LogonType=10→关注非工作时间+异常IP
## 面试陷阱
- 检测不是目的——目的是快速响应和持续改进规则
- 规则不是一次性写完就完了——需要基于新攻击手法的变化持续更新
- 实战护网中最高的评价是没出安全事件→不是因为你运气好而是因为你的检测和防御到位

## 今日检测
1. 在实际环境中实践本Day的核心检测技术
2. 用ATT&CK框架映射你的检测覆盖→找到覆盖盲区
3. 将本Day的知识点写成一条Splunk/ELK检测规则
