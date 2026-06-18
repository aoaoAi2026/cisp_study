# Day 24：应急响应完整流程
> 🎯 面试目标：掌握应急响应面试全部考点——PDCERF六阶段/入侵排查命令/内存取证/勒索响应
## 核心知识点
### Q: 检测到一台服务器被Ransomware加密了，你的应急响应步骤是什么？
**按PDCERF拆解——黄金7分钟动作**：

**0分钟(确认)**：确认文件扩展名/勒索信/CPU IO冲高是否真的被加密
**1分钟(遏制-隔离)**：不关机！先拔网线或防火墙限制出站→停止横向扩散到NAS/共享存储
**2分钟(取证)**：`ps aux; netstat -antp`截图→`tcpdump -i eth0 -w capture.pcap`抓C2通信→EDR导出进程树
**3分钟(确认入口)**：最近被登录账号？VPN异常登录？RDP爆破(Event ID 4625)？钓鱼邮件附件？
**5分钟(通知)**：安全负责人+受影响业务方+合规部门
**1小时(根除)**：查NoMoreRansom是否有解密工具→无则准备从备份恢复
**事后(复盘)**：三问：怎么进来的(Root Cause)/为什么没拦住(Detection Gap)/下次怎么避免(Remediation)
### Q: 如何排查Linux服务器是否被植入Rootkit？
多维度交叉验证(不能只信一个工具)：

1. **进程**：`ps aux` vs `/proc/`目录对比→ps看不到但/proc下有→被hook隐藏。`pstree -p`找名字奇怪的进程
2. **网络**：`ss -tlnp` vs `cat /proc/net/tcp`对比→ss被篡改的证据。外部nmap扫描vs内部netstat对比
3. **文件完整性**：`rpm -Va`(CentOS)/`dpkg --verify`(Debian)→验证包安装文件的完整性
4. **内核模块**：`lsmod` vs `/proc/modules`对比→隐藏的内核模块
5. **专用工具**：chkrootkit/rkhunter→怀疑高级rootkit→内存镜像+Volatility分析

**关键原则**：用已知干净的静态编译BusyBox替换系统的ls/ps/netstat等命令再做排查
### Q: Windows应急响应中，你最常关注的10个Event ID和理由
| Event ID | 含义 | 关注理由 |
|----------|------|----------|
| 4624 | 登录成功 | Logon Type 3(网络)/10(远程)是重点 |
| 4625 | 登录失败 | 短时间大量出现=暴力破解 |
| 4672 | 特权分配 | 管理员权限分配→Token窃取或UAC绕过 |
| 4688 | 进程创建 | cmd/powershell→异常父子进程关系 |
| 4697 | 服务安装 | sc/psexec安装后门服务 |
| 5140 | 网络共享访问 | IPC$/C$访问→横向移动信号 |
| 5156 | WFP网络连接允许 | 非标准端口出站→C2心跳 |
| 1102 | 审计日志清除 | 攻击者掩盖痕迹 |
| 4104 | PowerShell脚本块 | 记录完整PS脚本→即使用-enc也能解码 |

**加分**：Sysmon的Event ID 1(进程+命令行)/3(网络连接)/7(DLL加载)/11(文件创建)→比Windows自带日志更详细
### Q: 应急响应中如何进行内存取证？
**黄金法则**：优先获取内存→再磁盘→最后才关机。内存是一切活动的实时快照！

**采集**：Windows→DumpIt/WinPmem/FTK Imager。Linux→LiME。macOS→osxpmem

**Volatility3分析**：
1. `vol -f mem.dump windows.info`→OS版本
2. `vol -f mem.dump windows.pslist/pstree`→进程树，找异常父子进程
3. `vol -f mem.dump windows.netscan`→网络连接→C2通信
4. `vol -f mem.dump windows.cmdline`→进程命令行→攻击者执行了什么
5. `vol -f mem.dump windows.malfind`→Malfind注入检测
6. `vol -f mem.dump windows.dlllist --pid <PID>`→DLL加载列表→找未签名/路径怪异的
7. `vol -f mem.dump windows.memmap --pid <PID> --dump`→dump进程空间做逆向
### Q: 如何判断一起安全事件应该上报给监管机构？
依据《网络安全法》和《数据安全法》：

①是否涉及个人信息泄露→达到一定数量需24-72小时内上报网信办
②是否涉及关键信息基础设施(CII)遭到破坏或功能丧失→需通报主管部门
③是否可能导致国家安全和社会公共利益受到危害

**内部判断标准**：受影响系统范围(核心还是非核心)/涉及数据类型和量级(个人信息量级)/攻击者能力和动机(APT/经济动机/破坏)/是否已公开或已被媒体关注。建议：有疑问时先通知法务/合规部门评估
## 面试陷阱
- ⚠️ '先把服务器关机'——最经典的面试错误回答。关机=内存丢失=无法追踪攻击来源。先取证再关机！
- ⚠️ 说'我们有备份不用担心'——Ransomware攻击者通常先潜伏几周再加密→策略之一就是先破坏备份。问清楚如何验证备份完整性和离线可恢复性
- ⚠️ 只关注技术排查忽略沟通——应急响应中「向上通报的时机」「对外沟通策略」也是重要扣分点

## 今日检测
1. 安装Volatility3→下载公开恶意软件内存镜像→做一次完整分析练习
2. 在测试Windows上开启Sysmon+Winlogbeat→模拟攻击→用Event ID追踪全过程
3. 写一份勒索软件应急响应「口袋卡片」(10条以内checklist)
