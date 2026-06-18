# Day 8：邮件安全与反钓鱼
> [邮件安全面试核心] SPF/DKIM/DMARC/钓鱼攻击/钓鱼代理/邮件安全架构
## 核心知识点
### Q: 邮件安全的三驾马车SPF/DKIM/DMARC分别解决什么问题？
SPF(Sender Policy Framework)：DNS TXT记录声明哪些IP可以代表你的域名发邮件→收件方验证来源IP→解决发信人伪造。如`v=spf1 ip4:192.0.2.0/24 include:_spf.google.com ~all`
DKIM(DomainKeys Identified Mail)：用私钥给邮件签名→收件方用DNS公钥验证签名→确保邮件内容未被篡改
DMARC(Domain-based Message Authentication)：告诉收件方SPF和DKIM都失败时怎么处理(reject/quarantine/none)→并接收聚合报告→形成闭环

面试加分：SPF的~all(软拒绝)和-all(硬拒绝)的区别——~all只是标记但不拒绝。-all才能真正防伪造但可能误伤正常转发。三者缺一不可
### Q: 钓鱼邮件攻击有哪些常见类型？如何防御？
钓鱼类型：①凭证钓鱼(假登录页面→窃取密码+MFA code实时转发) ②恶意附件(Office宏/PDF JS/ISO镜像绕过Mark-of-the-Web) ③鱼叉式钓鱼(定向攻击，精心构造社交工程) ④Business Email Compromise(冒充CEO/CFO要求转账) ⑤QR码钓鱼(Quishing→诱导扫码到钓鱼站)

防御方案：SPF/DKIM/DMARC防止域名伪造、邮件网关(Proofpoint/Mimecast)沙箱引爆、URL重写+点击时实时检测、DMARC报告监控、安全意识培训+钓鱼演练(KnowBe4)、MFA+Security Key(U2F)防凭证窃取
### Q: 反向代理钓鱼(Evilginx/Modlishka)如何绕过MFA？怎么防？
原理：攻击者在用户和目标网站之间做中间人→用户在真实网站登录(包括MFA验证)→代理捕获Session Cookie→用Cookie冒充用户绕过MFA

防御：①FIDO2/WebAuthn Security Key→绑定了域名的凭证不会跨域传递(代理的域名是evil.com不是google.com) ②检测TLS证书不一致 ③浏览器安全策略(浏览器应显示钓鱼域而非真实域) ④用户教育——不要点击邮件中的链接、检查浏览器地址栏
### Q: 企业邮件安全架构应该怎么设计？
四层邮件安全：
L1-边界过滤：SPF/DKIM/DMARC验证发件方→灰名单Greylisting→黑名单RBL→反病毒引擎
L2-内容分析：沙箱引爆(附件深度分析)→URL重写+实时检测→自然语言处理检测BEC邮件
L3-内部监控：异常邮件规则(大量外发/深夜发信/CEO名字冒充)→DLP数据防泄露→邮件审计归档
L4-用户端：Phish Alert Button一键上报→安全意识培训→模拟钓鱼演练→MFA+Security Key
## 面试陷阱
- SPF的~all和-all混淆——~all不拒绝只标记，大部分企业用~all避免误伤
- 认为DMARC开了就万事大吉——p=none等于没开(只报告不拒绝)，p=reject才真正防止伪造
- 忘了邮件安全的用户端——再好的网关也挡不住用户点击，安全意识培训+钓鱼演练是必须项

## 今日检测
1. 检查你域名的SPF/DKIM/DMARC配置→用mxtoolbox.com验证
2. 用swaks发送伪造邮件测试SPF状态
3. 部署GoPhish做一次内部钓鱼演练
