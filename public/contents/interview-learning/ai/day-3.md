# Day 3：TCP/IP协议栈深挖
> [网络协议面试核心] TCP状态机/三次握手四挥手/IP分片绕过/ICMP隧道
## 核心知识点
### Q: TCP三次握手和四次挥手的详细过程，在安全面试中有什么考点？
三次握手：Client→SYN→Server→SYN+ACK→Client→ACK。面试常考：①SYN Flood攻击利用的就是只发SYN不完成握手→耗尽半连接队列→backlog参数(默认值/net.core.somaxconn) ②TCP序列号预测→如果ISN可预测→伪造TCP连接→CVE-2001-0168(Mitnick攻击Kevin Mitnick的最经典案例)

四次挥手：Active→FIN→Passive→ACK→Passive→FIN→Active→ACK。考点：①TIME_WAIT状态持续2MSL→端口耗尽攻击 ②RST攻击→伪造RST包中断合法连接→需要序列号在窗口内

面试金句：理解TCP状态机让你在分析网络攻击时有底层视角——SYN Flood看半连接队列、RST攻击看序列号窗口、会话劫持看序列号可预测性
### Q: TCP三次握手和四次挥手的详细过程，在安全面试中有什么考点？
请参考上题。额外考点：TCP Fast Open(TFO)允许在SYN包中携带数据→攻击者可在SYN中注入恶意数据绕过NGFW检测(NGFW通常看到SYN-ACK后才开始检查)。TCP的各种Option字段(MSS/Window Scale/Timestamp)在Nmap OS指纹识别中被广泛利用
### Q: IP分片在网络安全中的利用方式
IP分片(fragmentation)用于绕过防火墙和IDS：
1. Tiny Fragment Attack：将TCP头拆分到不同片→防火墙只看到第一个片的IP头而TCP端口在第二片→绕过端口过滤
2. Fragmentation Overlap：第二片和第一片的偏移重叠→不同操作系统的重组策略不同(Windows用先来/NT用后来/Linux用新)→可能导致IDS看到的内容和目标机重组后的内容不一致
3. Teardrop攻击：构造重叠偏移→老系统内核重组时崩溃

防御：NGFW应该做IP分片重组(Reassembly)后再检测→但内存开销大。hping3 --frag可测试分片绕过效果
### Q: ICMP协议有哪些安全利用？
ICMP不仅仅用于ping！安全利用：①ICMP隧道——将数据编码在ICMP Echo载荷中→绕过仅检查TCP/UDP的防火墙。工具：ptunnel/icmpsh ②Smurf攻击——向广播地址发送ICMP Echo Request→源IP伪造为目标IP→目标被全网回复淹没 ③ICMP Redirect——伪造Redirect消息改变目标路由表→中间人

防御：边界防火墙限制入站ICMP仅允许Echo Reply和Destination Unreachable；内网交换机禁用ICMP Redirect；IDS/NetFlow监控异常ICMP流量(如大量ICMP Tunnel数据)
## 面试陷阱
- TCP的三次握手是基本题，一定要能默画状态图——面试官可能追问SYN Cookie和SYN Proxy的区别
- IP分片攻击虽老但防火墙绕过测试中仍有效
- ICMP不只是ping——ICMP隧道和Redirect是面试加分点

## 今日检测
1. 用Wireshark抓取TCP三次握手→分析SEQ/ACK序号和窗口大小
2. 用hping3构造SYN Flood→用netstat观察半连接队列变化
3. 用ptunnel搭建ICMP隧道→测试绕过防火墙
