# Day 26：横向移动检测
> [横向移动检测面试核心] PsExec/WMI/PowerShell Remoting/SMB检测
## 核心知识点
### Q: 横向移动检测的完整方案
网络层面：NetFlow分析→内网东西向流量的偏离度→1台主机1小时内向>20台目标发起SMB(445)或WinRM(5985/5986)连接=>横向移动
端点层面：EDR/Sysmon→Event 1进程创建(不以svchost作父进程的PsExec)/Event 3网络连接(SMB到多IP)/Event 7 DLL加载(异常路径的netapi32.dll=可能是利用SMB漏洞的工具)
AD层面：Event 4768(TGT请求)的频率异常→Kerberoasting/AS-REP Roasting作为横向前置步骤
## 面试陷阱
- 检测不是目的——目的是快速响应和持续改进规则
- 规则不是一次性写完就完了——需要基于新攻击手法的变化持续更新
- 实战护网中最高的评价是没出安全事件→不是因为你运气好而是因为你的检测和防御到位

## 今日检测
1. 在实际环境中实践本Day的核心检测技术
2. 用ATT&CK框架映射你的检测覆盖→找到覆盖盲区
3. 将本Day的知识点写成一条Splunk/ELK检测规则
