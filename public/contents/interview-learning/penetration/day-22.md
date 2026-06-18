# Day 22：持久化与权限维持
> [持久化面试核心] 注册表/WMI/计划任务/LSA/DLL劫持
## 核心知识点
### Q: 持久化与权限维持的常见技术
Windows持久化：注册表Run键(HKLM/HKCU\..\Run)、计划任务(schtasks /create)、WMI事件订阅(Event Consumer→系统启动时触发)、服务安装(sc create)、DLL劫持(替换应用加载的DLL)、LSA Authentication Package(加载恶意DLL到lsass.exe)
Linux持久化：Crontab、SSH Key追加、PAM后门、LD_PRELOAD Rootkit(/etc/ld.so.preload)、内核模块Rootkit
面试强调：红队看多样性，蓝队看覆盖率→你能检测出几种？
## 面试陷阱
- 持久化的最终目的是重连→但每次重连都是一次新的告警机会
- 有些持久化方式需要高权限(服务安装/LSA)→低权限时有限选择

## 今日检测
1. 在测试Windows上实现3种不同的持久化方法→写检测规则找它们
2. 用Autoruns检查持久化痕迹→对比你实现的三种
