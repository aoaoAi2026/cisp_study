# Day 25：免杀与AV/EDR对抗
> [免杀面试核心] 静态免杀/动态免杀/syscall/API Unhooking
## 核心知识点
### Q: 免杀与AV/EDR对抗的核心技术
免杀二八法则：80%被检测是因为静态特征(文件中已有已知恶意代码Hash)→20%是动态行为。静态免杀：代码混淆(变量名重命名/控制流平坦化/字符串加密)、壳/加壳(UPX/Themida→也可能被反壳检测)、多态代码(每次生成不同的二进制)
动态免杀：API Unhooking(恢复被EDR Hook的ntdll.dll函数→绕过用户态检测)、Process Injection→注入到白名单进程(svchost/explorer→白进程做黑事)、syscall直接调用(绕开ntdll Hook)
## 面试陷阱
- 静态免杀是入门→动态免杀(syscall/ppid spoofing)才是主战场
- 免杀不是一次性→AV每天更新特征→需要持续优化载荷

## 今日检测
1. 学习syscall直接调用的原理(hell's gate/halos gate)
2. 尝试对简单Shellcode做异或编码→检查免杀效果
