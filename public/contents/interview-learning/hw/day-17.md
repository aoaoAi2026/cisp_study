# Day 17：入侵检测规则编写
> [IDS规则面试核心] Snort/Suricata规则语法/检测工程/Sigma
## 核心知识点
### Q: Snort/Suricata规则的核心语法
alert tcp $EXTERNAL_NET any -> $HOME_NET $HTTP_PORTS (msg:'SQL Injection Attempt'; flow:to_server,established; content:'union'; nocase; content:'select'; nocase; distance:0; within:30; classtype:web-application-attack; sid:1000001; rev:1;)

关键字段：content(匹配内容)、nocase(不区分大小写)、distance(从上个匹配之后多少字节开始)、within(在多少字节内必须匹配)、flow(定向+状态)
Sigma规则->翻译到SIEM查询，面试能讲Sigma体现你懂检测工程化
## 面试陷阱
- 检测不是目的——目的是快速响应和持续改进规则
- 规则不是一次性写完就完了——需要基于新攻击手法的变化持续更新
- 实战护网中最高的评价是没出安全事件→不是因为你运气好而是因为你的检测和防御到位

## 今日检测
1. 在实际环境中实践本Day的核心检测技术
2. 用ATT&CK框架映射你的检测覆盖→找到覆盖盲区
3. 将本Day的知识点写成一条Splunk/ELK检测规则
