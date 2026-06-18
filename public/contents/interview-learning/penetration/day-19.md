# Day 19：内网横向移动技术
> [横向移动面试核心] PsExec/WMI/WinRM/SMB/RDP多武器
## 核心知识点
### Q: 内网横向移动技术的完整武器库
PsExec(通过ADMIN$共享+SCM服务控制)→上传服务exe→启动→执行命令。WMI(Windows Management Instrumentation)→远程创建进程。PowerShell Remoting(WinRM/5985)→Enter-PSSession。SMB横向→用被控机器的凭据访问其他机器的C$/ADMIN$。RDP→mstsc /v:target。SSH(Windows 10 1809+自带OpenSSH Server)

面试亮点：横向移动不是只用一种方法——不同环境不同方法，SMB被监控→换WMI，WMI被监控→换WinRM。讲出多方法+能测出哪种当前可用才是实战思维
## 面试陷阱
- 讲横向移动不只列工具→每种方法在不同环境的效果不同→展示你的判断力
- 未授权横向移动在生产环境可能触发告警→讲清楚你的风险意识

## 今日检测
1. 测试环境用PsExec/WMI/PowerShell Remoting横向移动→理解各自网络包区别
2. Wireshark抓包分析三种横向移动的网络特征
