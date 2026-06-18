# Day 20：应急响应基础
> [IR基础面试核心] 响应流程/取证基础/遏制策略/沟通模板
## 核心知识点
### Q: 应急响应的基础工具包清单
必带工具：写保护USB+数字取证(Forensic Image采集工具FTK Imager/WinPmem)+内存采集(DumpIt)+网络抓包(tcpdump/Wireshark)+日志收集(Sysinternals/autoruns)+进程分析(Process Explorer/Hacker)

事先准备：加密通信频道(Signal/Matrix)、联系人清单(安全负责人+业务Owner+网管+法务)、标准取证流程Checklist(避免手忙脚乱)
## 面试陷阱
- 检测不是目的——目的是快速响应和持续改进规则
- 规则不是一次性写完就完了——需要基于新攻击手法的变化持续更新
- 实战护网中最高的评价是没出安全事件→不是因为你运气好而是因为你的检测和防御到位

## 今日检测
1. 在实际环境中实践本Day的核心检测技术
2. 用ATT&CK框架映射你的检测覆盖→找到覆盖盲区
3. 将本Day的知识点写成一条Splunk/ELK检测规则
