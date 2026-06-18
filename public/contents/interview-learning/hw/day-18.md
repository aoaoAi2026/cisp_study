# Day 18：SIEM告警分析
> [SIEM分析面试核心] 告警研判/Splunk SPL/ELK KQL/关联规则
## 核心知识点
### Q: Splunk SPL的常用安全分析查询
搜索暴力破解：index=auth sourcetype=WinEventLog:Security EventCode=4625 | stats count by Account_Name,Source_Network_Address | where count > 10 | sort -count
搜索进程创建：index=sysmon EventCode=1 ParentImage=*word.exe Image=*powershell.exe → 异常父进程(Word启动PowerShell=宏攻击)
搜索横向移动：EventCode=4624 Logon_Type=3 AND Account_Name!=*$ → 非机器账户的网络登录→关注来源IP
## 面试陷阱
- 检测不是目的——目的是快速响应和持续改进规则
- 规则不是一次性写完就完了——需要基于新攻击手法的变化持续更新
- 实战护网中最高的评价是没出安全事件→不是因为你运气好而是因为你的检测和防御到位

## 今日检测
1. 在实际环境中实践本Day的核心检测技术
2. 用ATT&CK框架映射你的检测覆盖→找到覆盖盲区
3. 将本Day的知识点写成一条Splunk/ELK检测规则
