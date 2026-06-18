# Day 22：应急响应实战
> [IR实战面试核心] 真实案例复盘/Linux入侵排查/内存取证
## 核心知识点
### Q: Linux入侵排查的核心命令和检查点
三管齐下：
用户检查：last -i/lastb登录审计、/etc/passwd寻找UID=0的非root、grep :0 /etc/passwd
进程检查：ps aux找异常进程、pstree -p分析进程树、lsof -p PID看进程打开的文件/网络/管道
网络检查：ss -tlnp vs /proc/net/tcp对比、netstat -antp找异常外联IP
文件检查：find / -perm -4000找SUID、crontab -l + /etc/crontab + /var/spool/cron检查定时任务后门
工具：rkhunter/chkrootkit→如果怀疑高级rootkit→内存镜像+Volatility分析
## 面试陷阱
- 面试讲防御不能只列举工具→要讲解决问题的思路和度量效果的方法
- 安全不只是技术合规——向管理层讲安全投入的ROI是高级工程师的核心能力
- 每个防御措施都讨论它防不了什么→展示对防御边界的清醒认知

## 今日检测
1. 将这个Day的核心概念用2分钟口述一遍(自录音)
2. 搜索对应的知名安全事件或CVE案例→准备1个面试可以用的实例
3. 找一篇该领域的行业报告(Gartner/Forrester/SANS)→提炼3个面试论据
