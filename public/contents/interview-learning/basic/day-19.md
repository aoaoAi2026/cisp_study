# Day 19：物联网安全
> 🎯 面试目标：掌握IoT安全面试核心考点——攻击面分析/协议安全/固件安全，能流畅回答IoT相关的技术面试题
## 核心知识点
### Q: IoT设备有哪些主要攻击面？请按层次梳理
**四层攻击面**：

1. **硬件层**：JTAG/SWD调试口可读取Flash和修改内存；UART串口常输出debug日志含WiFi密码；SPI Flash可用编程器直接dump固件（即使有读保护也可用电压毛刺绕过）
2. **固件层**：binwalk解包→分析/etc/shadow中的哈希、硬编码API Key、后门账户、未签名的OTA升级包
3. **通信层**：ZigBee/Z-Wave/BLE配对过程可嗅探→ZigBee默认信任中心Link Key（5A:69:67:42:65:65:41:6C:6C:69:61:6E…ZigBeeAlliance09）全网已知；MQTT未开TLS→用户名密码明文
4. **云端/APP层**：API认证缺陷（JWT未验证签名→修改payload中userid可越权控制他人设备）；APP逆向→jadx提取硬编码密钥→调用云API

**加分项**：能举例CVE-2020-6007（Philips Hue灯泡通过ZigBee固件漏洞被远程控制→蠕虫传播）、CVE-2019-…系列
### Q: 如何对智能家居设备做安全测试？描述完整流程
**IoT测试五步法**：

1. **信息收集**：FCC ID查射频参数→拆机看芯片型号(SOC datasheet)→识别UART波特率(常见115200/57600)→APP抓包分析API
2. **固件提取**：官网下载/OTA抓包(拦截update.bin)→`binwalk -Me firmware.bin`解包→分析squashfs-root下的/etc/passwd、启动脚本、www/cgi-bin
3. **通信分析**：Ubertooth/HackRF抓BLE配对→Wireshark分析GATT→重放攻击测试（特征值写入）
4. **Web/API测试**：设备Web管理界面→Burp扫描→测试认证绕过/MQTT注入；APP逆向→抓包分析证书固定(Certificate Pinning)
5. **硬件攻击**：UART连接→尝试uboot中断→进入single mode；JTAG→OpenOCD连接→dump内存
### Q: MQTT协议在IoT中有哪些安全问题？
MQTT(Message Queuing Telemetry Transport)是IoT最常用消息协议，默认端口1883。安全缺陷：

1. **明文传输**：未开TLS时用户名密码+消息内容全部明文→`tcpdump -i eth0 port 1883`可嗅探。必须强制TLS(8883端口)
2. **认证薄弱**：clientId可预测(username_001, username_002)导致遍历；允许匿名连接
3. **Topic权限未隔离**：设备subscribe了`#`通配符可收到所有消息；`device/+/control`被恶意设备利用
4. **Broker暴露公网**：Mosquitto默认无ACL→Shodan搜`port:1883`可找到大量敞开的MQTT服务
5. **遗嘱消息滥用**：LWT(Last Will Testament)可被用来植入恶意指令

**防御**：TLS+客户端证书认证、ACL限制Topic、仅内网监听、开启审计日志
### Q: 固件分析中binwalk的关键参数和实战技巧
核心命令：`binwalk -Me firmware.bin`
- `-e`：自动提取squashfs/jffs2/cramfs等文件系统
- `-M`：递归扫描提取出的文件
- `-A`：自动识别CPU架构(ARM/MIPS/x86)

实战流程：解包后在`_firmware.bin.extracted/squashfs-root/`中→`grep -r "password\|secret\|key\|admin" .`→找硬编码凭据；`strings /usr/sbin/* | grep "dropbear\|ssh\|telnet"`→找后门服务；`find . -name "*.cgi" -o -name "*.lua"`→分析Web CGI逻辑

面试加分：能提到Firmwalker自动化固件审计脚本→自动提取密码/证书/后门/弱配置等
### Q: CVE-2020-9054(Zyxel NAS硬编码后门)对IoT安全合规的启示
漏洞本质：Zyxel NAS设备固件中硬编码超级管理员账户`zyfwp:PrOw!aN_fXp`，通过Web管理口即可获取root权限(CVE-2020-9054)。启示：
1. **CWE-798(硬编码凭据)** 必须进SDLC检查清单——安全需求阶段就应禁止
2. **SBOM(软件物料清单)** 对于IoT设备合规越来越重要——FDA/US Gov已强制要求医疗IoT设备提供SBOM
3. **FCC/CE认证** 将逐步纳入网络安全要求(NIST IR 8259系列)
4. **供应链审计**：设备厂商的固件可能来自ODM，安全责任归属不清晰
## 面试陷阱
- ⚠️ 只谈理论不谈实操——IoT安全面试官通常做过实际项目，能判断你是否真的拆过设备。准备好回答'JTAG的SWDIO一般是GPIO几号引脚'这类实操问题
- ⚠️ 忽略供应链风险——芯片选型阶段的安全（如某MCU的Secure Boot有已知绕过）也属于IoT安全范畴
- ⚠️ 把IoT安全等同于Web安全——虽然Web界面是攻击面之一，但固件(UBoot/TrustZone)和硬件(Side-Channel)是IoT独特部分

## 今日检测
1. 用Wireshark安装MQTT插件→分析MQTT CONNECT报文的认证字段
2. 下载TP-Link/D-Link的公开固件→用binwalk解包→找到/etc/passwd和启动脚本中的后门服务
3. 整理一份'IoT安全面试30秒自我介绍'：你做过什么项目/用过什么工具/发现过什么漏洞
