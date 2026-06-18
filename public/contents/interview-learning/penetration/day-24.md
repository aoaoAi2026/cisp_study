# Day 24：Metasploit框架深度
> [MSF面试核心] exploit/payload/post/autoroute/socks
## 核心知识点
### Q: Metasploit框架的深度使用
核心模块类型：exploit(利用漏洞)→payload(执行载荷，如meterpreter_reverse_tcp)→auxiliary(扫描/DoS/嗅探)→post(后渗透，如hashdump/enum_logged_on_users)→encoder(编码绕过AV)

MSF高级用法：autoroute(添加被控主机路由→通过session打内网)→socks_proxy(开SOCKS代理→proxychains用外部工具)。resource script(批量自动化).rc文件→一条命令执行整个渗透流程
面试说：MSF在护网演练中因特征太明显容易被EDR秒杀→实际红队更依赖Cobalt Strike和C2 Custom Framework
## 面试陷阱
- MSF的默认payload特征在EDR中秒杀→自定制payload是必修课
- 护网演练中MSF的成功率持续下降→理解为什么比会用更重要

## 今日检测
1. 用MSF的resource script写一个自动化渗透流程(扫描→利用→后渗透)
2. 尝试用msfvenom生成免杀payload→放在VirusTotal上测查杀率
