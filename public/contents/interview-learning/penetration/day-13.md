# Day 13：Kerberos协议攻击
> [Kerberos面试核心] AS-REP Roasting/Kerberoasting/黄金票据/白银票据/委派攻击
## 核心知识点
### Q: Kerberoasting攻击原理和防御
原理：任何域用户都可请求Service Ticket(ST)→ST用服务账户NTLM哈希加密→攻击者获取加密票据后离线用hashcat爆破(hashcat -m 13100)。条件：只需域用户权限+服务账户有弱密码
防御：①服务账户用30位+强密码或gMSA(Group Managed Service Account)自动管理 ②定期审计SPN账户密码复杂度 ③服务账户不加入域管组 ④监控Event ID 4769的大量ST请求
### Q: 黄金票据vs白银票据的核心区别
金票：需KRBTGT Hash→可伪造任意TGT→可请求任意服务→全能。TGT最长10年→极难检测(协议层全是合法的)
银票：仅需目标服务机器账户Hash→伪造特定服务ST→KDC不参与→对目标服务来说完全合法但域控上无TGS_REQ记录(日志空白就是告警信号)
检测金票：KRBTGT的PWDLastSet异常、TGT有效期超域策略。检测银票：AP_REQ到但域控无TGS_REQ
### Q: AD域三次委派的安全风险
非约束委派：服务器可冒充任何访问它的用户→如果域控访问此服务器→攻击者dump域控TGT做金票。利用SpoolSample诱骗域控访问
约束委派：只能委派到指定SPN→但如果配了S4U2Self+协议转换→攻击者可用S4U2Self以Administrator身份获取ST→再S4U2Proxy跳到目标服务
基于资源的约束委派(RBCD)：修改目标的msDS-AllowedToActOnBehalfOfOtherIdentity→添加攻击者的机器账户→获取管理员ST
### Q: AS-REP Roasting的原理和条件
条件：目标用户设为不要求Kerberos预认证→KDC不验证身份直接返回AS_REP→AS_REP含用户密码哈希加密的TGT→攻击者离线爆破。`GetNPUsers.py domain/ -usersfile users.txt -format hashcat`
## 面试陷阱
- Kerberoasting和AS-REP Roasting搞混——前者需域用户权限(b爆破服务账户密码)，后者不需权限(但用户必须开不要求预认证)
- 防御Kerberos攻击靠定期更换KRBTGT密码两次(间隔>最大票据生存期)→面试提到这个比只说打补丁显得更懂
- 忽略AD CS攻击(ESC1-ESC8)——证书服务也是Kerberos相关的重要攻击面

## 今日检测
1. 用Rubeus做Kerberoasting→hashcat爆破弱密码服务账户
2. BloodHound分析域委派关系→画攻击路径图
3. Mimikatz生成金票→注入→验证能否访问域控
