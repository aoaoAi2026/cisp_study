# Day 17：令牌窃取与Token提权
> [Token面试核心] Access Token/Impersonation/Potato家族/SeImpersonate
## 核心知识点
### Q: Windows Access Token/Potato家族提权
Primary Token(进程创建时分配控制安全上下文)+Impersonation Token(线程临时模拟其他用户)。关键权限SeImpersonatePrivilege
Potato家族：Hot Potato(NBNS)→Rotten Potato(DCOM BITS)→Juicy Potato(可靠CLSID)→PrintSpoofer(打印机RPC CVE-2020-1048)→GodPotato
原理：有SeImpersonate→创建命名管道→欺骗SYSTEM进程连接→ImpersonateNamedPipeClient()→窃取SYSTEM Token
## 面试陷阱
- 有SeImpersonate不一定能提权→还需能创建命名管道+欺骗SYSTEM连接
- Token窃取不是万能→Win10 1809+某些Service Account仍有此漏洞

## 今日检测
1. 在Windows测试机用whoami /priv检查→如有SeImpersonate→PrintSpoofer测试
2. 用Process Explorer观察Token→理解Primary vs Impersonation的区别
