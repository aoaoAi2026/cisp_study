# Day 6：网络流量采集与分析

> 🎯 面试目标：掌握网络流量采集技术、数据包分析方法和流量特征的面试考点

## 知识速览

### 核心概念
- **PCAP/PCAPNG**：网络数据包捕获的标准格式，PCAPNG是新一代格式支持多接口 & 注释
- **流量采集点**：SPAN端口（交换机镜像）、TAP（网络分路器）、NetFlow/sFlow/IPFIX（流量统计）
- **全量vs采样**：全量捕获适合深度分析和取证（存储成本高）；NetFlow采样适合趋势分析（存储成本低）

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| tcpdump和Wireshark有什么区别 | tcpdump是命令行工具（适合服务器/脚本/大数据量），Wireshark是GUI分析工具（适合交互分析/协议解码）。两者底层都基于libpcap。面试策略：说你会先用tcpdump抓包，然后用Wireshark分析 |
| NetFlow和全量抓包怎么用 | NetFlow只记录流元数据（五元组+字节数+时间），适合流量趋势分析和异常检测（如DDoS检测），存储成本低但不能做payload分析。全量抓包可以做payload检查和协议分析，但存储成本极高。实战中是互补关系 |
| 如何检测加密流量中的异常 | 多维度检测：1)TLS握手元数据（JA3/JARM指纹）2)流量统计特征（包长分布、间隔时间）3)DNS查询模式（SNI泄露域名）4)连接频率和beaconing检测。不需要解密内容也能做异常检测 |

### 技术细节
常用流量采集命令：
- `tcpdump -i eth0 -w capture.pcap port 443` - 抓取HTTPS流量
- `tshark -r capture.pcap -Y http.request` - 过滤HTTP请求
- `netsh trace start capture=yes` - Windows抓包

流量分析的面试准备：能用ATT&CK的Command and Control战术映射C2通信特征

## 常见陷阱
- ⚠️ 认为加密流量无法分析——加密隐藏了内容但元数据仍然可见：连接时间、频率、包大小分布、TLS指纹等都可以做异常检测
- ⚠️ 过度依赖自动化工具而忽视手工分析——机器能识别已知模式，但APT和新攻击需要人工分析发现异常

## 今日检测
1. 用tcpdump捕获自己浏览器的HTTPS流量，用Wireshark分析TLS握手过程
2. 写一个BPF过滤表达式，只捕获去往特定IP且端口为443的SYN包
3. 解释JA3指纹的原理，及其在C2通信检测中的应用
