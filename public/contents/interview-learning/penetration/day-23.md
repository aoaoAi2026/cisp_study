# Day 23：日志清理与反取证
> [反取证面试核心] Windows/Linux日志清理/SIEM远程日志
## 核心知识点
### Q: 日志清理与反取证的基础知识
Windows清理：wevtutil cl→清除事件日志(Event ID 1102因此被记录)。删除Prefetch文件(.pf)和Recent文档、清理注册表MRU(Most Recently Used)、禁用或暂停Sysmon/tripwire
Linux清理：unset HISTFILE; rm ~/.bash_history; ln -s /dev/null ~/.bash_history。删除/var/log/*中的关键日志(auth.log/syslog)。注意：如果日志同时写入了远程SIEM→本地清理无用→反取证必须考虑中央日志系统
面试金句：真正高级的APT不会大规模清日志→因为清日志本身就是一种告警(Event ID 1102)。他们会有选择性地删除几条关键事件≤在噪音中消失
## 面试陷阱
- 日志清空本身就是告警(1102)→真正的APT选择性删除而非全清
- 远程SIEM下的本地清无效→反取证必须考虑日志的存储方式

## 今日检测
1. 在测试机执行wevtutil cl查看Event 1102是否被记录
2. 配置Winlogbeat转发到远程ELK→测试本地清日志后SIEM是否还留着
