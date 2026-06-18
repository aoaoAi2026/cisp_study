# Day 14：Windows权限提升
> [Windows提权面试核心] 服务权限/Token窃取/UAC绕过/AlwaysInstallElevated/内核漏洞
## 核心知识点
### Q: Windows低权限Shell的标准提权检查流程
三层检查：
L1-30秒(自动)：whoami /priv→看SeImpersonate/SeAssignPrimaryToken。whoami /groups→是否在Administrators组
L2-1分钟(工具)：winPEAS.bat/PowerUp.ps1(Invoke-AllChecks)→自动扫描所有提权向量
L3-5分钟(手动)：sc query(服务权限)、icacls(路径ACL)、reg query(AlwaysInstallElevated/UAC)、cmdkey /list(缓存凭据)、netstat -ano(仅localhost监听的内部服务)

面试加分：说不会只看技术能提权就立刻提→先评估对业务的影响和检测风险
### Q: Potato家族提权的原理和演变
核心：有SeImpersonatePrivilege→调用ImpersonateNamedPipeClient()→模拟连接到攻击者命名管道的高权限客户端→窃取Token
演变：Hot Potato(2016,NBNS欺骗)→Rotten Potato(2017,DCOM)→Juicy Potato(2018,更可靠CLSID)→PrintSpoofer(2020,CVE-2020-1048,打印机RPC)→GodPotato(2020,DCOM+Impersonation)

面试要点：Potato需要SeImpersonate+创建命名管道+欺骗SYSTEM进程连接管道
### Q: UAC绕过的五种常用手法
核心：利用自动提升的白名单程序。①注册表劫持(DLL Hijacking)→高权限进程加载攻击者的DLL ②COM对象劫持→替换COM DLL路径 ③IFileOperation自动提升COM接口→复制/执行文件 ④Fodhelper绕过(修改其注册表键→启动时执行命令) ⑤Eventvwr绕过(劫持mmc.exe的注册表键)

防弹：UAC不是安全边界(Microsoft官方确认)→它的设计目标是提醒而非防御
### Q: Windows内核漏洞提权的实用方法
以CVE-2021-1732(Win32k提权)为例：确认版本在受影响范围→下载exp→上传→执行。注意事项：内核exp不稳定→可能蓝屏→生产环境禁用！
原则：优先使用服务权限/Token窃取/Potato类等稳定方法→内核漏洞提权作为最后手段。面试时展示你在不同环境下选择不同提权路径的判断力
## 面试陷阱
- 拿到SYSTEM不是终点——面试要讲完整攻击链：提权→pass the hash→横向移动→数据窃取
- 有SeImpersonate不代表一定能提权→还需要命名管道+欺骗SYSTEM连接
- 打好所有补丁不等于安全——配置错误(ACL/AlwaysInstallElevated/服务权限)不需漏洞也可提权

## 今日检测
1. Windows虚拟机运行winPEAS→分析输出中的潜在提权路径
2. PrintSpoofer测试提权(合法环境)
3. 手写DLL劫持POC→Process Monitor分析高权限进程DLL搜索顺序
