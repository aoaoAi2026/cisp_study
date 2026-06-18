import os
def add(d,text):
    f=f'day-{d}.md'
    old=open(f,'r',encoding='utf-8').read()
    open(f,'w',encoding='utf-8').write(old.rstrip('\n')+'\n\n'+text+'\n')
    lc=len(open(f,'r',encoding='utf-8').read().split('\n'))
    print(f'Day {d}: {lc} lines')

tiny='''---
## 📌 今日回顾

- 写出今天学到的3个核心知识点
- 写出今天没完全理解的1个概念（明天一定搞清楚）
- 更新你的命令速查手册：今天新增了___条命令/规则

> 坚持的力量：每天积累一点点，120天后回头看，你会感谢现在坚持的自己。'''

for d in [13,14,27]:
    add(d,tiny)

big29='''---
## 🛠️ ATT&CK实用工具链

以下是蓝队工作中与ATT&CK相关的实用工具链：

1. ATT&CK Navigator (attack.mitre.org) - 可视化检测覆盖度
2. Atomic Red Team (github.com/redcanaryco/atomic-red-team) - 模拟ATT&CK技术的测试框架
3. Sigma Rules (github.com/SigmaHQ/sigma) - 通用SIEM检测规则格式
4. MITRE CALDERA (github.com/mitre/caldera) - 自动化对抗模拟平台
5. ATT&CK-to-Navigator Scripts - 将检测规则导出为Navigator兼容格式

### Atomic Red Team 快速入门

安装后执行一个简单的ATT&CK技术模拟（T1059.001 PowerShell执行）：
```
Invoke-AtomicTest T1059.001 -ShowDetails
Invoke-AtomicTest T1059.001 -CheckPrereqs
Invoke-AtomicTest T1059.001
```
执行后在你的EDR/SIEM中查看是否产生了对应告警 —— 这就是检测覆盖度的实战验证。

### Sigma规则示例

以ATT&CK T1003.001（LSASS凭据dump）为例：
```
title: LSASS Memory Dump
status: experimental
tags:
  - attack.t1003.001
  - attack.credential_access
logsource:
  product: windows
  category: process_creation
detection:
  selection:
    Image|endswith: 'taskmgr.exe'
    CommandLine|contains: 'lsass'
  condition: selection
level: high
```
> 你现在已经知道ATT&CK是什么和为什么要用，下一步是怎么用 —— 用上述工具链把理论变成实践。'''

add(29,big29)

big30='''---
## 🛠️ SQL注入检测自动化工具链

### 开源SQL注入检测工具
1. libinjection - 轻量级SQL注入检测库，ModSecurity内置
2. sqlmap - 蓝队用于授权测试验证漏洞和了解攻击特征
3. jSQL Injection - Java图形化SQL注入工具
4. SQLi Detector Plugin - BurpSuite的SQL注入检测插件

### 自动化日志检测脚本（Python）
```python
import re, sys
from collections import defaultdict

patterns = {
    "UNION SELECT": r"(?i)union.*select",
    "Info Schema": r"(?i)information_schema",
    "Time Blind": r"(?i)(sleep\\(|benchmark\\(|pg_sleep\\(|waitfor\s+delay)",
    "Outfile": r"(?i)into\s+(outfile|dumpfile)",
    "Boolean Blind": r"(?i)(and\s+1=1|and\s+1=2|or\s+1=1)",
}

def analyze(filepath):
    results = defaultdict(list)
    with open(filepath) as f:
        for i, line in enumerate(f, 1):
            for name, pattern in patterns.items():
                if re.search(pattern, line):
                    results[name].append((i, line.strip()[:200]))
    return results

if __name__ == "__main__":
    logfile = sys.argv[1]
    findings = analyze(logfile)
    for atype, instances in sorted(findings.items()):
        print(f"[{atype}] {len(instances)} occurrences")
        for line_no, content in instances[:3]:
            print(f"  Line {line_no}: {content}")
        print()
```

### 蓝队SQL注入检测SOP
```
[发现SQL注入告警]
1. 确认告警来源（WAF/IDS/SIEM）
2. 提取关键信息：
   - 源IP地址 / 目标URL / 攻击payload / 时间戳 / 响应码
3. 威胁情报核验：VirusTotal/微步在线查询源IP
4. 日志深度分析：
   - 提取该IP全部请求记录
   - 分析参数变化模式（人手工/自动化工具）
   - 查看是否有成功的注入（200+大响应体/数据回显）
5. 处置决策树：
   - 已被WAF拦截 → P3，记录+加入监控
   - 疑似自动化扫描 → P2，封IP+通知
   - 确认注入成功+数据泄露 → P0，隔离+应急
   - 确认为误报 → 标记+白名单优化
6. 记录与闭环：研判过程/证据截图/处置动作/修复建议
```
> 目标：看到一条SQL注入告警 → 大脑自动执行这6个步骤 → 3分钟内做出正确决策。'''

add(30,big30)
print("\nAll 5 done!")
