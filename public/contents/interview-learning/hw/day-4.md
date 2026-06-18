# Day 4：流量分析入门

> 🎯 面试目标：掌握流量分析的基本方法和工具，能够从pcap/Wireshark中识别常见攻击流量特征

## 知识速览

### 核心概念
- **流量分析三层次**：统计层（流量大小、连接数、端口分布）→ 协议层（HTTP/DNS/SMB等协议异常）→ 载荷层（payload中的攻击特征）
- **Wireshark核心技能**：过滤表达式（display filter）、追踪流（Follow TCP/HTTP Stream）、统计工具（Statistics菜单）、导出对象（Export Objects）
- **全流量留存**：护网期间建议留存全流量（pcap），用于事后溯源和证据固定。至少要留NetFlow/sFlow做流量元数据记录
- **流量基线**：正常情况下的流量模式（峰值时段、主要协议比例、常见外连目标），偏离基线即为异常

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| Wireshark中如何快速定位SQL注入攻击流量？ | 使用过滤表达式：`http.request.uri matches "union|select|'or|information_schema"` 或 `http contains "UNION SELECT"`。更高效的方法是先用`http.request`过滤所有HTTP请求，再逐条查看可疑的URI参数 |
| 如何从流量中识别C2通信？ | C2通信特征：①心跳包——固定间隔（如每60秒）的短连接；②非标准端口通信（如80端口跑非HTTP协议）；③加密流量到可疑IP（JA3指纹异常）；④DNS隧道（大量TXT/MX查询到异常域名）。用Wireshark的IO Graph观察连接周期性 |
| 发现一台内网主机大量外发数据，你如何分析？ | ①先用`ip.src==可疑IP`过滤该主机的所有流量；②Statistics→Conversations看和哪些外部IP通信、流量大小；③Follow TCP Stream看具体传输内容；④确认是否为数据渗出——对比正常业务流量基线 |

### 技术细节

**Wireshark常用过滤表达式速查：**
```
# HTTP请求过滤
http.request
http.request.method == "POST"
http.request.uri contains "login"

# IP过滤
ip.src == 192.168.1.100
ip.dst == 10.0.0.0/8
!(ip.src == 192.168.0.0/16)   # 排除内网IP

# TCP异常检测
tcp.flags.syn == 1 && tcp.flags.ack == 0   # SYN扫描
tcp.analysis.retransmission                  # 重传（可能丢包或被阻断）
tcp.analysis.flags                           # 异常TCP标志组合

# 攻击特征检测
http contains "<script>"
http contains "cmd.exe"
dns.qry.name contains "malicious"
```

## 常见陷阱
- ⚠️ "我看到告警就去抓包看"——告警+流量交叉验证才有效。只看告警可能被误导，只看流量效率太低。正确做法：告警驱动→提取关键字段（源IP/目标/时间）→精确过滤流量→验证
- ⚠️ 面试时只提Wireshark不提tcpdump——生产环境服务器通常没有GUI，tcpdump是必备技能。面试中体现你了解命令行抓包：`tcpdump -i eth0 -w capture.pcap host 192.168.1.1`

## 今日检测
1. 打开Wireshark，用过滤表达式找出所有HTTP POST请求
2. 尝试追踪一条完整的TCP流，识别三次握手和四次挥手
3. 练习tcpdump命令：抓取指定主机的80端口流量并保存为pcap文件
