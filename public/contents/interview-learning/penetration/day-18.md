# Day 18：Cobalt Strike深度实战
> [CS面试核心] Beacon通信/DNS隧道/Malleable C2/隐蔽对抗
## 核心知识点
### Q: Cobalt Strike Beacon的通信协议和隐蔽性
HTTP/HTTPS Beacon：GET取任务+POST回传→心跳间隔(3-60s)+Jitter(0-50%)→伪装正常Web流量→但频率规律可能被ML检测
DNS Beacon：TXT/MX查询编码传送→隐蔽性高(DNS通常不被HTTPS中间人检查)→但速度慢(一次查询最多几十字节)
SMB Beacon：Named Pipe内网转发→不出互联网→需已有Internet入口做跳板。Malleable C2 Profile是核心→自定义HTTP头/URI/证书/UA伪装业务流量
## 面试陷阱
- CS不是钓鱼工具→Beacon是后渗透操作平台
- Malleable C2决定隐蔽程度→默认profile极易被检测
- DNS Beacon慢→设计隐蔽通信需权衡速度和隐蔽

## 今日检测
1. 搭建CS测试环境→配置自定义Malleable C2 Profile→验证流量特征
2. 分析CS的HTTP Beacon流量(Wireshark)→找检测特征点
