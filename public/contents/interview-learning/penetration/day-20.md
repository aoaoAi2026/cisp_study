# Day 20：Windows域渗透基础
> [域渗透面试核心] NTDS.dit/KRBTGT/LLMNR毒化/SMB Relay
## 核心知识点
### Q: Windows域渗透的基础知识体系
AD域核心概念：Domain Controller(域控/KDC)。NTDS.dit(域数据库，存所有用户哈希)。KRBTGT(域Kerberos密钥分发中心账户→拿到它的Hash=拿到金票工厂)。SYSVOL(域共享策略目录→可能泄露密码/脚本)

基础攻击：LLMNR/NBT-NS毒化(Responder→监听广播查询→伪造响应→捕获Net-NTLMv2 Hash→hashcat爆破)。SMB Relay(将捕获的Net-NTLMv2中继到其他机器→如果目标未开启SMB签名→以该用户身份执行命令)
## 面试陷阱
- LLMNR/NBT-NS毒化需要内网Responder→MAC flooding不一定能成
- 域渗透不是从0开始的→需要先有一个域账户(低权限也行)

## 今日检测
1. 搭建测试域→用BloodHound做域信息收集(SharpHound collector)
2. 用Responder做LLMNR毒化→捕获Net-NTLMv2→hashcat测试爆破
