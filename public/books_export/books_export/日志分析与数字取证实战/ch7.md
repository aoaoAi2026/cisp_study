# 第七章 网络取证

> 第7章 | 50页

7.1 网络取证概述

网络取证是对网络流量进行捕获、记录和分析，以发现网络攻击、重建通信过程、提取证据的技术。

网络取证数据来源：
- 全流量存储
- NetFlow/sFlow/IPFIX
- 防火墙日志
- IDS/IPS告警
- 代理服务器日志
- DNS日志

7.2 流量捕获与存储

- 端口镜像（SPAN/RSPAN/ERSPAN）
- 网络分流器（TAP）
- 捕获工具：Wireshark、tcpdump、dumpcap
- 存储方案：大容量存储、分布式存储

7.3 Wireshark流量分析

Wireshark常用功能：
- 过滤器：显示过滤器、捕获过滤器
- 协议解析：深度解析各种协议
- 流追踪：TCP流、UDP流
- 统计分析：端点统计、会话统计
- 导出对象：HTTP对象、FTP对象

常用过滤表达式：
- 按IP：ip.addr == 192.168.1.1
- 按端口：tcp.port == 80
- 按协议：http、dns、ftp
- 按内容：http.request.uri contains \"admin\"

7.4 常见攻击流量特征

端口扫描：
- 短时间内大量SYN包
- 目的端口分散
- 源IP单一或少数

暴力破解：
- 大量认证失败响应
- 同一账号多次尝试
- 同一IP多次尝试

Web攻击：
- SQL注入特征字符
- XSS特征字符
- 异常URL编码

C2通信：
- 周期性通信
- 异常端口
- 加密流量但证书异常
- DNS隧道特征

7.5 网络取证工具

- Wireshark：图形化网络协议分析器
- NetworkMiner：网络取证分析工具
- Xplico：网络流量分析工具
- Moloch：大规模流量捕获与分析
- Suricata + eve.json：流量告警分析
