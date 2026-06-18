# Day 5：日志审计基础

> 🎯 面试目标：掌握日志审计的核心方法，能够使用grep/awk/sed从海量日志中快速提取安全事件线索

## 知识速览

### 核心概念
- **日志三剑客**：grep（搜索过滤）、awk（列处理与统计）、sed（流编辑替换），是蓝队分析日志的基础工具
- **关键日志源**：Linux系统日志（/var/log/secure、/var/log/messages）、Web服务器日志（access.log、error.log）、Windows事件日志（安全日志、系统日志）、数据库日志
- **日志留存要求**：护网期间日志至少保留180天，关键系统日志建议保留1年以上。日志完整性直接影响溯源能力
- **日志标准化**：不同设备的日志格式不同，需要用SIEM做范式化（normalization）统一字段，才能做跨设备关联分析

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| 给你一个100GB的Web日志，如何找出SQL注入攻击？ | 先用zgrep（支持压缩）或grep配合正则表达式搜索SQL注入关键字：`grep -iE "(union.*select|select.*from|' OR |information_schema)" access.log`。再按源IP聚合统计：`awk '{print $1}' | sort | uniq -c | sort -rn`，找到攻击频率最高的IP。最后对该IP的所有请求做深度分析 |
| SSH暴力破解如何从日志中发现？ | 查看/var/log/secure：`grep "Failed password" /var/log/secure | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head`。如果在1分钟内同一IP出现>10次失败，基本确认为暴力破解。如果同一IP在连续失败后突然出现"Accepted"，则可能已被攻破 |
| Windows安全日志中如何识别异常登录？ | 关注事件ID：4624（登录成功）、4625（登录失败）、4672（特殊权限分配）。异常模式：非工作时间的4624、Logon Type 10（远程交互）来自陌生IP、同一账户短时间内大量4625。用wevtutil或PowerShell导出分析 |

### 技术细节

**日志分析常用命令模板：**
```bash
# 1. 统计访问量Top 10的IP
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# 2. 查找所有返回500状态码的请求（服务器错误——可能是注入成功）
grep ' 500 ' access.log | awk '{print $1, $7}' | sort | uniq -c | sort -rn

# 3. 统计每分钟请求量（检测扫描行为）
awk '{print $4}' access.log | cut -d: -f2,3 | sort | uniq -c | sort -rn

# 4. SSH暴破检测
grep "Failed password" /var/log/secure | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | awk '$1>10'

# 5. 查找Webshell访问（常见文件名特征）
grep -iE "\.(php|jsp|asp|aspx)\b" access.log | grep -v "index\|login\|home"
```

## 常见陷阱
- ⚠️ "grep一下日志就是审计了"——日志审计需要多维度交叉分析：时间线+源IP+目标+攻击类型+响应状态。单维度grep只能找到线索，不能形成结论
- ⚠️ 日志时间戳不一致导致分析混乱——不同设备可能使用不同时区、不同时间格式。分析前先确认所有日志已统一为UTC或本地时间

## 今日检测
1. 找一段真实的Web日志（或自己生成），用grep+awk+sort组合找出访问最多的5个IP
2. 编写一条命令：检测/var/log/secure中暴力破解SSH的IP，并自动生成封禁列表
3. 统计一个access.log中各HTTP状态码的分布（200/301/404/500等），判断是否有异常
