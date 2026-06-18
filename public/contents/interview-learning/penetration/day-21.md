# Day 21：Kerberos协议深度攻击
> [委派面试核心] 非约束委派/约束委派/RBCD/SpoolSample
## 核心知识点
### Q: Kerberos协议深度攻击：委派+Tickets
非约束委派攻击：控制非约束委派服务器→诱导DC访问(SpoolSample打印机服务触发器)→DC的TGT缓存被dump→做成金票。约束委派绕过：配置了S4U2Self+协议转换的服务→用Rubeus s4u /impersonateuser:Administrator→获取DC的ST→S4U2Proxy跳到任意服务。RBCD攻击：控制能修改目标机器msDS-AllowedToActOnBehalfOfOtherIdentity属性的账户→添加自己的机器账户→获取管理员ST
## 面试陷阱
- 委派攻击需要特定条件→讲清楚每种委派的前提条件比列举攻击更重要
- 非约束委派是最危险的但也是最容易被发现的→红队和蓝队都知

## 今日检测
1. 用Rubeus做S4U攻击→理解S4U2Self和S4U2Proxy的票据差异
2. 分析域控的委派配置→Get-ADComputer -Filter {TrustedForDelegation -eq $true}
