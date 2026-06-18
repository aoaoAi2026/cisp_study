# -*- coding: utf-8 -*-
"""Second-round supplement + full content generator for all 120 days.
Strategy: Supplement existing files where possible, generate full content for skeleton files."""
import os
OUT = os.path.dirname(os.path.abspath(__file__))

def phase_info(d):
    if d <= 60: return ('第一阶段','第一阶段 u00b7 初级蓝队夯实')
    elif d <= 90: return ('第二阶段','第二阶段 u00b7 中级蓝队进阶')
    return ('第三阶段','第三阶段 u00b7 高级蓝队升华')

def gen_table(headers, rows):
    h = '| ' + ' | '.join(headers) + ' |'
    s = '|' + '|'.join([':---' for _ in headers]) + '|'
    r = '\n'.join('| ' + ' | '.join(str(c) for c in row) + ' |' for row in rows)
    return h + '\n' + s + '\n' + r + '\n'

# ====== SECOND ROUND SUPPLEMENTS for thin files that need more ======

def supplement_file(day, extra):
    fname = os.path.join(OUT, f'day-{day}.md')
    if not os.path.exists(fname): return 0
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    orig = content.count('\n')
    new_content = content.rstrip('\n') + '\n' + extra + '\n'
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return new_content.count('\n') - orig

# Extra content for the thinner files (Days 2, 4, 6, 8 etc)
EXTRA_ROUND2 = {
    2: r'''

---

## 🎓 进阶理解：UDP协议——TCP的"弟弟"也要认识

虽然TCP是蓝队最关注的协议，但UDP同样重要：

| 维度 | TCP | UDP |
|:---|:---|:---|
| 连接 | 有连接（三次握手） | 无连接（直接发） |
| 可靠性 | 确认重传机制 | 不确认，丢了就丢了 |
| 速度 | 较慢（握手开销） | 快（无握手开销） |
| 数据顺序 | 严格有序 | 不保证顺序 |
| 典型应用 | HTTP/SSH/邮件 | DNS/视频/游戏/VoIP |
| 蓝队关注 | 暴破、扫描、C2回连 | DNS隧道、UDP Flood |

**蓝队必须知道的UDP攻击场景：**

1. **DNS隧道**：攻击者把数据编码在DNS查询中通过UDP 53端口传出。因为大多数防火墙放行UDP 53（DNS必需），所以这是最常见的C2隐蔽通道。
   检测：DNS查询中出现异常长的域名（>52字符）、同一域名高频查询、TXT记录查询暴增。

2. **UDP Flood DDoS**：攻击者发送海量UDP包（通常伪造源IP），占满目标带宽。因为UDP无连接，源IP可以任意伪造。
   检测：入站UDP流量突增超过基线5倍以上 → 可能是UDP Flood。

3. **NTP/DNS放大攻击**：攻击者伪造受害者IP向NTP/DNS服务器发小请求，服务器回几十倍大的响应→间接DDoS。
   检测：来自53端口（DNS）或123端口（NTP）的大量入站流量（正常应该是出站请求入站响应很快）。

---

## 🏋️ 挑战题：独立完成一次完整的流量分析

用Wireshark抓取你访问baidu.com的完整流量，然后回答以下问题：

1. 浏览器第一个发的包是什么协议？（答案：DNS查询 baidu.com）
2. 第一个TCP连接的目标端口是多少？（答案：443，因为baidu走HTTPS）
3. 页面加载过程中产生了多少个TCP连接？
4. 有没有TCP重传？如果有，说明网络可能有丢包
5. 用 Statistics → Protocol Hierarchy 看看各协议占比

如果能独立完成以上5步，说明你已经具备了基础的流量分析思维。
''',

    4: r'''

---

## 🎓 进阶命令：这些你可能每天都用到

除了15个基础命令，以下是蓝队日常最高频的进阶命令：

**find——"从整个系统中找出符合条件的文件"**
```bash
# 蓝队最常用场景：查找攻击者留下的文件
find / -name "*.php" -mtime -1        # 最近一天内修改的PHP文件（找webshell）
find / -name "*.php" -mtime -1        # -mtime -1 = 最近24小时修改
find /tmp -type f -mmin -60           # /tmp下最近60分钟的文件（攻击者常藏文件在/tmp）
find / -user www-data -type f 2>/dev/null   # 找出所有属于Web用户的文件
find / -perm -4000 -type f 2>/dev/null      # 找出所有SUID文件（可能被提权利用）
```

**which / whereis——"这个命令在哪？"**
```bash
which nc        # 找nc（netcat）的路径 → 如果服务器不该有nc却存在→可疑！
which python3   # 确定Python在哪个位置
```

**wc——"统计行数/字数"**
```bash
wc -l access.log            # 日志有多少行
grep " 404 " access.log | wc -l   # 有多少条404记录
```

**sort 和 uniq——"排序和去重"（必须和管道配合）**
```bash
# 排序
cat ips.txt | sort          # 按字母排序
cat ips.txt | sort -n       # 按数字排序
cat ips.txt | sort -u       # 排序+去重
# 去重计数
cat ips.txt | sort | uniq -c        # 统计每个IP出现次数
cat ips.txt | sort | uniq -c | sort -rn  # 按次数降序排列
```

**history——"你之前敲过什么命令？"**
```bash
history         # 看自己敲过的命令
history | grep ssh   # 找SSH相关操作
# 蓝队场景：检查可疑用户的历史命令→看他登录后做了什么
cat /home/可疑用户/.bash_history
```

**find + grep 组合——文件内容的大搜捕**
```bash
# 在所有.log文件中搜索 "error"
find /var/log -name "*.log" -exec grep -l "error" {} \;
# 在所有PHP文件中搜索 base64_decode（很多webshell用它混淆代码）
find /var/www -name "*.php" -exec grep -l "base64_decode" {} \;
```

> **记重点**：`find / -name` 找文件名，`grep -r` 找文件内容，`find + grep` 组合是在整个服务器搜webshell的经典手法。
''',

    6: r'''

---

## 🎓 Windows蓝队利器：SysInternals工具套件

Windows自带工具够用，但微软官方出品的 SysInternals 套件才是蓝队真正的"瑞士军刀"。以下是蓝队最常用的5个：

**1. Process Explorer（procexp.exe）——任务管理器的"爸爸"**
- 以树状图显示所有进程的父子关系（谁启动了谁）
- 右键进程→"Check VirusTotal"→直接在线查毒
- 双击进程→查看TCP/IP连接→知道每个进程连了哪些IP
- **蓝队用它**：找出伪装成系统进程的恶意程序（svchost.exe的父进程必须是services.exe，否则是假的）

**2. Autoruns（autoruns.exe）——"你到底有多少开机启动项？"**
- 比msconfig强大100倍的启动项查看工具
- 列出所有开机自动运行的位置：注册表Run键、服务、计划任务、浏览器插件、驱动...
- **蓝队用它**：找出攻击者设置的所有持久化手段（恶意软件最喜欢藏在 Autoruns 中列出的某个角落）

**3. TCPView（tcpview.exe）——"你的电脑在和谁聊天？"**
- 实时显示所有TCP/UDP连接+对应的进程名
- 比 `netstat -ano` 直观100倍，带图形界面
- **蓝队用它**：一眼看出有没有不认识的进程在和陌生IP通信

**4. Process Monitor（procmon.exe）——"一切操作的录像机"**
- 实时记录系统中所有进程的文件读写、注册表修改、网络连接操作
- 输出量极大（每秒几万条），必须配合过滤
- **蓝队用它**：追踪某个可疑进程到底在干什么——读了什么文件、写入了什么、连了哪里

**5. Strings（strings.exe）——"从乱码中提取可读内容"**
- 从任意二进制文件中提取可读字符串（ASCII/Unicode）
- **蓝队用它**：分析可疑exe/dll文件 → 提取里面的URL、IP地址、命令、加密密钥等线索

---

## 🏋️ Windows挑战实操

1. **下载SysInternals**：https://learn.microsoft.com/en-us/sysinternals/downloads/
2. **Process Explorer练习**：打开procexp.exe → 找到svchost.exe → 看它的父进程是不是services.exe
3. **Autoruns练习**：打开autoruns.exe → 查看"Logon"标签 → 看看有多少程序跟着开机一起启动
4. **TCPView练习**：打开tcpview.exe → 观察哪些程序在主动连接外部IP
5. **事件查看器进阶**：安全日志→筛选当前日志→事件ID输入4625→看看最近有哪些登录失败尝试

> ⚠️ **注意**：SysInternals工具是微软官方出品的合法工具，但也是攻击者最常使用的工具之一（尤其是procexp/procmon用于信息收集）。蓝队要学会使用它，也要学会在应急排查时识别它被攻击者留下的痕迹。
''',

    7: r'''

---

## 🎓 建立你的"蓝队知识库"——信息管理的艺术

你知道120天的学习会产生海量知识点。如果不用系统化的方式管理，很快就会遗忘和混乱。以下是建立个人知识库的最佳实践：

**推荐的知识库结构：**

```
蓝队知识库/
├── 01-网络协议/
│   ├── OSI七层与TCPIP.md
│   ├── HTTP协议详解.md
│   └── 常见端口速查.md
├── 02-操作系统/
│   ├── Linux命令速查.md
│   ├── Windows事件ID速查.md
│   └── 应急排查清单.md
├── 03-日志分析/
│   ├── Nginx日志字段说明.md
│   ├── 日志分析命令大全.md
│   └── 攻击日志特征库.md
├── 04-安全设备/
│   ├── 防火墙基础.md
│   ├── WAF拦截原理.md
│   └── IDS规则编写.md
├── 05-告警研判/
│   ├── 告警研判SOP.md
│   ├── 常见误报分类.md
│   └── 真实告警案例.md
├── 06-攻击识别/
│   ├── SQL注入特征.md
│   ├── XSS攻击特征.md
│   └── 扫描行为识别.md
├── 07-应急响应/
│   ├── 应急响应流程.md
│   ├── Windows应急清单.md
│   └── Linux应急清单.md
├── 08-面试准备/
│   ├── 高频面试题汇总.md
│   └── 个人简历优化.md
└── 99-碎片笔记/
    └── (每天学到的零散知识点)
```

**每天学完后花5分钟做的事情：**
1. 把今天学到的1个新概念写进对应分类的笔记中
2. 标注一个"今天最有用的比喻或技巧"
3. 写下1个"还没完全理解，需要之后回看"的知识点

**为什么这很重要？**
面试官在面试时最怕两种人：一种是"什么都说不出来"，一种是"问一个问题他能扯到天边收不回来"。建立知识库就是建立你的"面试回答结构"——每个知识点有位置、有逻辑、有条理。
''',

    8: r'''

---

## 🎓 进阶过滤：Wireshark统计分析实战

除了前面学的Statistics菜单，还有几个对蓝队特别有用的分析功能：

**1. Display Filter Macros（显示过滤器宏）**
如果你经常用同一个复杂的过滤器，可以保存为宏：
```
Analyze → Display Filter Macros → 新建
名称: syn_scan
表达式: tcp.flags.syn == 1 and tcp.flags.ack == 0 and not tcp.port == 443
```
以后过滤栏直接输入 `${syn_scan}` 就行。

**2. Time Column（时间列）**
Wireshark默认显示"距第一个包的秒数"。但蓝队需要看真实时间：
```
View → Time Display Format → Date and Time of Day
```
这样可以看出攻击发生的真实时间，而不是相对时间。

**3. Coloring Rules（着色规则）**
给不同类型的包上不同颜色，一目了然：
```
View → Coloring Rules
比如设置 TCP RST 包为红色 → tcp.flags.reset == 1
SYN 包为黄色 → tcp.flags.syn == 1 && tcp.flags.ack == 0
```
护网值守时，红色包一出现你就知道有异常。

**4. Expert Information（专家信息）**
Wireshark内置的自动分析功能：
```
Analyze → Expert Information
```
会汇总所有协议异常——重传、乱序、校验错误、可疑行为。虽然不是100%准确，但能帮你快速定位问题。

---

## 🏋️ Wireshark高级挑战

1. **着色练习**：设置3个自定义着色规则 → SYN包黄色、RST包红色、DNS查询蓝色 → 抓包后一眼看出流量组成
2. **时间分析**：切到真实时间模式 → 抓取5分钟的常规上网流量 → 在IO Graph中画出流量曲线 → 标注出浏览网页和看视频的不同流量特征
3. **协议识别挑战**：找一段包含多种协议（HTTP/DNS/TLS/ICMP）的pcap，用 Protocol Hierarchy 统计各协议占的流量比例
''',
}

def apply_all_supplements():
    for day, extra in EXTRA_ROUND2.items():
        added = supplement_file(day, extra)
        fname = os.path.join(OUT, f'day-{day}.md')
        lines = len(open(fname, 'r', encoding='utf-8').readlines())
        print(f'Day {day:2d}: +{added} lines (total {lines})')

if __name__ == '__main__':
    apply_all_supplements()
