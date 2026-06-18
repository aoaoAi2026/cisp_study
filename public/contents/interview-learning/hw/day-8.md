# Day 8：护网工具链入门

> 🎯 面试目标：掌握护网场景常用工具链(Nmap/Wireshark/Sysinternals/ELK/Velociraptor)及面试操作考核

## 知识速览

### 核心概念
- **Nmap高级用法**：TCP SYN扫描(-sS，半开放不建立完整TCP连接)、Version Detection(-sV，识别服务版本)、OS Fingerprinting(-O，操作系统识别)、NSE脚本引擎(--script vuln，漏洞扫描)、Timing模板(-T0~T5，扫描速度) 
- **Wireshark分析五步法**：第1步Statistics→Protocol Hierarchy(流量协议分布)→第2步过滤(ip.addr/host=目标IP)→第3步Follow TCP Stream(跟踪TCP流看会话内容)→第4步Expert Info(查看Wireshark自动标记的异常)→第5步IO Graph(流量时间图发现突增/突降)
- **Sysinternals三件套**：Process Explorer(替代任务管理器→查看进程树+Sysinternals验证签名状态)、Process Monitor(实时监控文件/注册表/网络)→Autoruns(启动项/服务/驱动/计划任务综合查看)
- **Velociraptor**：开源端点可见性+DFIR平台，通过VQL(Velociraptor Query Language)实时查询端点信息→Hunt for Artifacts(搜索IOC)→自动采集→集中分析Dashboard，比传统EDR更灵活
- **ELK日志分析流程**：Filebeat采集→Logstash解析(Grok正则提取字段→GeoIP/UserAgent等enrichment)→Elasticsearch索引→Kibana可视化(Discover搜索+Visualize图表+Dashboard联动)

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| 护网行动中最常用的Nmap扫描命令和输出解读？ | 标准护网四扫描：1)存活扫描 `nmap -sn 10.0.0.0/24`(快速发现存活主机→护网的第一步全资产发现) 2)全端口扫描 `nmap -p- -T4 --open <target>`(排查非标准端口上的隐蔽服务→如SSH开在2222端口) 3)版本探测 `nmap -sV --version-intensity 5 -p <open_ports>`(识别服务的精确版本→是否含已知漏洞) 4)漏洞扫描 `nmap --script vuln <target>`(常见漏洞自动检测→但不能替代专业漏洞扫描器)。输出重点解读：open(端口开放有服务)→filtered(被防火墙过滤)→closed(端口可达但无服务)。 |
| 如何用Wireshark快速定位一个网络性能问题？ | 快速四步定位：1)Statistics→IO Graph→查看有没有规律的流量突发(每5分钟一个高峰→可能是定时任务或C2心跳) 2)Statistics→TCP StreamGraph→Round-Trip-Time(高RTT→网络延迟丢包)→Throughput(低吞吐→带宽瓶颈) 3)过滤`tcp.analysis.retransmission`→TCP重传(大量重传→网络质量差/拥塞) 4)过滤`tcp.analysis.zero_window`→TCP零窗口(接收方缓冲区满→应用层处理慢)。面试展示：不只说'用Wireshark抓包'，要说'我在护网中遇到XX问题→用Wireshark的XX功能→定位到XX原因→解决的问题'。 |
| Sysinternals在应急响应中的使用场景？ | 场景1：发现CPU100%→Process Explorer查看→smss.exe启动了异常的cmd.exe→子进程有powershell下载C2脚本→确认恶意 场景2：杀软报毒但找不到文件→Process Monitor过滤Path→发现文件创建后立即被删除→设置Include过滤器追踪完整操作序列 场景3：怀疑持久化机制→Autoruns检查→发现计划任务+注册表Run键+WMI Event Consumer→全部删除实现彻底清除。Sysinternals相比商业EDR的优势：零依赖、免安装、直接运行、高度透明。 |
| Velociraptor如何做一次威胁狩猎(Threat Hunting)？ | 狩猎假设：'我怀疑有机器中了信息窃取木马→它应该会在短时间内访问大量文件(.doc/.xls/.pdf)→产生大量文件读操作'。VQL查询：`SELECT * FROM parse_evtx(filename='C:/Windows/System32/winevt/Logs/Security.evtx') WHERE EventID=4663 AND (ObjectName LIKE '%.doc%' OR ObjectName LIKE '%.xls%') GROUP BY SubjectUserName` → 找出短时间内读了大量文档文件的用户→交叉对应用户登录的计算机→进一步深查那台机器的进程+网络连接。强调：威胁狩猎不是告警驱动的被动响应，而是主动假设检验。 |
| ELK中的Grok解析正则为什么重要？举一个护网日志解析的例子 | 原始日志是没有结构的纯文本，Grok将非结构化文本转为结构化JSON字段→之后才能做字段级别的查询/聚合/可视化。护网经典Grok例子：解析Cisco ASA防火墙日志→`%{CISCO_TAGGED_SYSLOG} %{GREEDYDATA:cisco_message}`→解析出src_ip/dst_ip/action/rule等字段→聚合为'今天被阻断最多的10个源IP'→快速定位攻击者。没有好的Grok解析=没有好的检测=在日志大海里捞针。 |

### 技术细节
**护网工具链集成脚本**：
```bash
#!/bin/bash
# 一键主机信息采集(HW_Collect.sh)

echo "=== System Info ===" > /tmp/hw_collect.txt
systeminfo >> /tmp/hw_collect.txt
echo "=== Network Connections ===" >> /tmp/hw_collect.txt
netstat -anob >> /tmp/hw_collect.txt
echo "=== Scheduled Tasks ===" >> /tmp/hw_collect.txt
schtasks /query /fo LIST /v >> /tmp/hw_collect.txt
echo "=== Running Processes ===" >> /tmp/hw_collect.txt
tasklist /v >> /tmp/hw_collect.txt
echo "=== Services ===" >> /tmp/hw_collect.txt
sc queryex type=service state=all >> /tmp/hw_collect.txt
```
**Wireshark 显示过滤器备忘(护网高频)**：
- `http.request or http.response` → 只显示HTTP流量
- `dns.qry.name contains "malware"` → DNS请求中的恶意域名
- `tcp.flags.syn==1 and tcp.flags.ack==0` → 只显示SYN扫描
- `ip.src==10.0.0.0/8 and ip.dst!=10.0.0.0/8` → 内网到外网的流量(可能C2)

## 常见陷阱
- ⚠️ Nmap扫描过于激进——`-T5`极速扫描和全端口扫描可能触发目标IDS/IPS并导致自己被封禁，护网期间不可用
- ⚠️ Wireshark只抓不看——抓了半天包只看统计信息就关掉，忽视了Follow Stream里的具体内容和行为
- ⚠️ ELK只搭不管——Elasticsearch单节点无备份+索引无生命周期→三周后磁盘满+数据丢失

## 今日检测
1. 用Wireshark抓取一次完整的HTTP会话(打开网页)，用Follow HTTP Stream重放会话内容
2. 安装Velociraptor Server+Client，写一个VQL查询列出所有自启动项的哈希值
3. 用ELK(或Docker版本的ELK)搭建日志分析环境，导入一份sample防火墙日志并用Grok解析
