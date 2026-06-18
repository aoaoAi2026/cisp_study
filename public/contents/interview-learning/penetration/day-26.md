# Day 26：无线安全测试
> [无线安全面试核心] WPA2破解/WPA3/Evil Twin/蓝牙
## 核心知识点
### Q: 无线安全测试的核心技术
Wi-Fi安全：WPA2-PSK破解→抓取四次握手包(airodump-ng+deauth强制断开用户重连)→aircrack-ng/hashcat -m 22000爆破。WPA3的Dragonblood漏洞(CVE-2019-9494)→降级攻击+侧信道。WPS PIN暴力(pixiewps)→8位PIN可在线秒破。Evil Twin(伪造同名AP诱导用户连接→捕获密码)
蓝牙：BlueBorne(2017)→无需配对的远程RCE、BLE GATT特征值窃听/篡改
面试亮点：能讲清楚抓WPA握手的原理(为什么需要Deauth)而不是只会用工具
## 面试陷阱
- WPA3并非绝对安全→Dragonblood降级攻击依然有效
- 无线安全测试前必须获得授权→非法WiFi嗅探/Cracking是违法行为

## 今日检测
1. 在测试环境(获得授权后)用aircrack-ng破解WPA2→理解抓握手原理
2. 用bettercap做WiFi探测→建立周围WiFi资产清单
