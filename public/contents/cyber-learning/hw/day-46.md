---
title: "Day 46: 公开攻击流量样本分析（Day 1）——流量分析四步法"
day: 46
difficulty: "中级"
category: "cyber-learning"
---

# Day 46: 公开攻击流量样本分析（Day 1）——流量分析四步法

## 今日目标

1. 理解什么是PCAP流量样本以及为什么要分析它
2. 学会用Wireshark打开和分析PCAP文件
3. 从真实攻击流量中提取攻击特征和IOC


---

## 为什么分析公开攻击流量样本？

在VulHub和DVWA上，你分析的流量是"自己攻击自己"——你知道攻击会发生什么。
但真实的攻击流量完全不同：你不知道攻击者用了什么工具、什么Payload、从哪里来。
公开的PCAP样本来自真实的攻防实战、CTF比赛或安全研究者的分享，
它们让你体验到"未知中寻找线索"的感觉——这才是蓝队日常工作的真实状态。

今天的PCAP样本来源推荐（公开免费的）：
- malware-traffic-analysis.net：定期发布恶意流量分析挑战
- PacketTotal：PCAP样本搜索引擎
- CTF流量分析题目：各大CTF比赛的Network类别


---

## Wireshark分析标准流程

### 第一步：了解全局

打开PCAP文件后，先不要急着深入分析。先用 Statistics 菜单了解概况：
1. Statistics -> Summary：查看文件基本信息（大小、包数、时间范围）
2. Statistics -> Protocol Hierarchy：看协议分布（HTTP最多？DNS最多？TCP连接异常多？）
3. Statistics -> Conversations：看通信对（源IP-目标IP的通信量排行）
4. Statistics -> Endpoints：看IP端点统计（哪个IP发送/接收了最多数据？）

这一步的目的是：形成对流量样本的"第一印象"。
就像医生先看体温和血压，而不是直接开刀。

### 第二步：发现异常

在全局了解之后，寻找"不太对劲"的地方：
- 大量请求到同一个少见的端口（如4444、8080、7001）-> 可能是C2通信
- 外网IP向内网IP发送了大量数据 -> 可能数据正在被窃取
- 出现了不常见协议（如IRC、Telnet、SMB）-> 可能是横向移动
- DNS请求非常频繁且域名很长很奇怪 -> 可能是DNS隧道
- HTTP请求中有大量 base64 编码的数据 -> 可能是编码后的Payload

### 第三步：聚焦分析

发现异常点后，使用Wireshark的过滤功能深入：

过滤特定IP的流量：
```
ip.addr == 192.168.1.100
ip.src == 10.0.0.1 && ip.dst == 203.0.113.5
```

过滤特定协议和端口：
```
http || https          # 只看Web流量
tcp.port == 4444       # 只看4444端口的通信
dns                   # 只看DNS请求
```

Wireshark常用高级过滤：
```
http.request.method == "POST"     # 只看POST请求
http contains "password"          # 搜索包含password的HTTP内容
tcp.flags.syn == 1 && tcp.flags.ack == 0  # 只看SYN包（连接发起）
```

### 第四步：提取证据

找到攻击流量后，需要保存证据：
1. File -> Export Specified Packets：导出筛选出的攻击包
2. 使用 Follow -> TCP Stream：查看完整的TCP会话内容
3. 使用 Follow -> HTTP Stream：查看完整的HTTP请求和响应
4. 截图关键证据（请求Payload、响应内容、时间戳）


---

## 典型攻击流量的特征模式

### 模式1：端口扫描流量

特征：短时间内（<10秒）同一源IP向同一目标IP的多个端口发送SYN包
Wireshark识别方法：
1. 过滤 tcp.flags.syn == 1 && tcp.flags.ack == 0
2. 看目标端口是否大量变化（1, 2, 3, 4...递增或跳跃）
3. 如果SYN包数量>100且目标端口不重复 -> 几乎可以确定是扫描
4. 进一步判断：如果是递增扫描是nmap，如果是跳跃扫描可能被随机化了

蓝队响应：端口扫描 = 攻击者的"敲门"行为，有人在调查你的资产。
记录源IP + 扫描时间 + 扫描范围，封IP的同时要做好"可能要迎接下一波攻击"的准备。

### 模式2：SQL注入攻击流量

特征：HTTP请求参数中包含 SQL 关键字
Wireshark识别方法：
1. 过滤 http.request
2. 在请求中搜索 UNION SELECT、' OR 1=1、-- 等关键字
3. 关注返回包中是否有数据库错误信息（MySQL error、ORA-、column...not found 等）
4. 如果有数据库错误回显 -> 注入成功！紧急处置

典型流量识别练习：试着在Wireshark中搜索以下模式
```
http contains "UNION SELECT"
http contains "OR 1=1"
http contains "information_schema"
```


---

## 动手任务

1. 从malware-traffic-analysis.net下载一个公开的PCAP样本
2. 用Wireshark的四步分析法分析该样本
3. 识别出至少一种攻击行为并写出分析报告
4. 提取攻击中的IOC（IP、域名、Payload特征）
5. 总结该攻击的检测规则建议


---

## 今日检查清单

- [ ] 了解Wireshark四步分析法的每一步
- [ ] 能用Wireshark过滤器筛选特定IP/协议/端口
- [ ] 能识别端口扫描流量的特征
- [ ] 能识别SQL注入攻击流量的特征
- [ ] 下载了一个公开PCAP样本并开始分析

---

## 实战思维训练

### 5秒判断法

每天给自己看一条日志，5秒内回答三个问题：
1. 这是攻击吗？（是/否/不确定）
2. 如果是攻击，是什么类型？
3. 我应该做什么？（忽略/记录/告警/升级）

每天坚持练10条，一周后你的判断速度会翻倍。

### 攻击路径推演法

看到可疑日志后在心中推演攻击者下一步：
- SQL注入 -> 下一步会尝试 UNION SELECT 查数据
- Webshell上传 -> 下一步会访问shell执行命令
- 端口扫描 -> 下一步会对开放服务做漏洞利用

提前想到攻击者的下一步，你就能先发制人。

---

## 蓝队面试自测

**Q1: 描述一次完整的Web攻击检测流程**
A: 收到告警 -> 查看ELK日志确认 -> 分析Payload -> 判断类型 -> 确认攻击是否成功 -> 处置 -> 写报告。

**Q2: IDS和IPS的区别？**
A: IDS只检测不阻断（摄像头），IPS检测并阻断（门禁）。

**Q3: ATT&CK框架对蓝队的价值？**
A: 告诉我们攻击者"会做什么"和"怎么做"，蓝队据此在对应战术阶段设置检测点。

**Q4: 告警太多怎么处理？**
A: 分级处理——P0立即、P1今日内、P2周汇总，然后优化规则减少误报。

---

## 学习节奏建议

你已接近一半的课程。很多人学网络安全坚持不了50天，你已经超过了他们。

常见瓶颈：
1. **学了后面忘前面** -> 每天花5分钟快速浏览前一天笔记
2. **实操跟不上理论** -> 把环境搭建当作第一优先级
3. **内容太多记不住** -> 优先记住检测特征和处置流程，命令可查文档

> 你已经比80%半途而废的人走得更远。继续坚持，你就是那20%。

---

## IOC提取与威胁情报

### 什么是IOC？
IOC（Indicators of Compromise，失陷指标）是用来识别恶意活动的证据。
常见的IOC类型：
- IP地址：攻击者的源IP
- 域名：C2服务器的域名
- URL：恶意软件下载地址
- 文件哈希：恶意文件的MD5/SHA256
- 注册表键值：恶意软件修改的注册表
- 文件路径：恶意文件存放的路径

### 从PCAP中提取IOC的方法

1. **IP类IOC**：查看 Statistics -> Endpoints，找出通信量异常的IP
2. **域名类IOC**：过滤 dns，查看解析的域名，关注长域名、随机字符串域名
3. **URL类IOC**：过滤 http.request，查看请求的URL路径
4. **Payload特征**：从HTTP/TCP流中提取恶意Payload的独特字符串

### IOC使用场景
- 提取IOC后录入威胁情报平台（TIP）
- 在SIEM/WAF/IDS中加入IOC黑名单
- 与其他组织共享IOC实现联防联控
- 用于攻击溯源和攻击者画像

## 常见误判提醒

分析PCAP时避免以下新手错误：
1. 不要把正常的管理流量当作攻击（如SNMP、ICMP监控）
2. 不要把扫描器友好探测当作攻击（如Shodan的常规扫描）
3. 不要只看请求不看响应（响应才告诉你攻击是否成功）
4. 不要忽略时间维度（凌晨的异常比白天更值得关注）

---

> **明日预告**：继续前进，每一步都算数。
---

## 实战思维训练：流量分析的"肌肉记忆"

### 给你一段流量，你的第一反应应该是什么？

记住这个口诀：**先全局后局部，先统计后细节，先协议后内容**。

具体来说：
1. 打开PCAP -> 先看 Statistics -> Summary 了解概况（时间范围、包数、大小）
2. 再看 Statistics -> Protocol Hierarchy 了解协议分布
3. 再看 Statistics -> Conversations 找出通信最多的IP对
4. 最后才聚焦到具体的数据包内容

很多新手一打开PCAP就钻到具体包里去分析，就像进了森林只看树叶不看地图。
先有全局观，才能知道哪些"树叶"需要仔细看。

### 每日流量分析"10分钟练习"

每天花10分钟，用Wireshark抓自己电脑的流量：
1. 打开Wireshark，选正在用的网卡，开始抓包
2. 过滤 http 或 dns，看看你在浏览什么、解析了什么域名
3. 过滤 ip.dst == 你公司某服务器的IP，看看通信内容
4. 观察正常的流量长什么样，这样你才能识别异常的流量

> 蓝队的核心能力之一：知道"正常"才能发现"异常"。

### 常见攻击流量速查表

| 攻击类型 | 协议层 | Wireshark过滤 | 判断依据 |
|:---|:---|:---|:---|
| 端口扫描 | TCP | tcp.flags.syn==1 && tcp.flags.ack==0 | 大量SYN到不同端口 |
| SQL注入 | HTTP | http contains "UNION SELECT" | 请求中含SQL关键字 |
| XSS攻击 | HTTP | http contains "<script>" | 请求中含HTML/JS标签 |
| 目录爆破 | HTTP | http.response.code==404 | 大量404+不同URI+同一源IP |
| DNS隧道 | DNS | dns.qry.name matches "[a-z0-9]{30,}" | 超长子域名 |
| C2心跳 | HTTP | http.request 按时间排序 | 周期性请求+周期性响应 |
| 文件上传 | HTTP | http.request.method==POST && http contains "multipart" | POST+文件内容 |
| 反弹Shell | TCP | 非标准端口+长连接+交互数据 | 异常端口的交互式TCP |

---

## 知识串联网络

### 今天的内容在整个蓝队知识体系中的位置

你在Day 46-48学的是蓝队四大核心能力之一：**流量分析**。

蓝队四大核心能力：
1. **日志分析**（Day 8-10, 36-37）——从日志中发现异常
2. **流量分析**（Day 7, 46-48）——从网络包中发现异常
3. **告警研判**（Day 18-20, 39）——判断异常的真伪和严重性
4. **应急响应**（Day 22-24, 后续）——处置和恢复

流量分析 = 日志分析的"底层来源"。很多日志本质上是对流量的记录。
掌握了流量分析，你看日志会更有"底"——你知道日志后面是什么网络包。

### 工具依赖关系

```
Wireshark(流量分析) ──→ ELK(日志分析) ──→ 告警研判 ──→ 应急响应
       ↓                      ↓
   理解攻击原理           理解业务行为
       ↓                      ↓
   写检测规则             优化告警规则
```

你的学习路径：先用Wireshark看懂攻击流量 -> 在ELK中查找对应的日志 -> 理解告警为什么触发 -> 改进检测规则。

---

## 蓝队面试高频题（流量分析方向）

**Q1: 给你一个PCAP文件，你怎么分析？**

标准回答流程：
1. 先用Statistics了解全局（时间范围、包数、协议分布、通信对）
2. 用过滤器聚焦可疑流量（异常端口、异常IP、异常协议）
3. Follow TCP/HTTP Stream查看完整会话内容
4. 提取关键证据（Payload、IOC、时间线）
5. 还原攻击路径，输出分析报告

面试官想听到的是你有方法论，不是瞎看。

**Q2: 怎么区分正常扫描和恶意扫描？**

正常扫描（如搜索引擎爬虫、Shodan）：
- User-Agent真实（Googlebot、Shodan等知名标识）
- IP可查到归属（如Google的IP段）
- 行为收敛（只访问常见端口、请求间隔均匀）

恶意扫描：
- User-Agent伪造或缺失
- IP来自不常见的地区（或VPS/代理IP）
- 行为激进（大量404、多种攻击Payload混在一起）
- 扫描后有后续攻击行为（漏洞利用）

**Q3: C2通信有哪些检测方法？**

1. 时间维度：周期性心跳（间隔固定，如每30秒一次）
2. 内容维度：请求/响应数据经过编码或加密
3. 连接维度：长连接（TCP连接持续数小时）或短连接但极高频
4. 域名维度：连接域名注册时间短、域名随机（DGA特征）
5. 证书维度：TLS证书自签名或异常

最可靠的是综合2个以上维度判断——单一维度容易误判。

**Q4: 遇到HTTPS加密流量怎么分析？**

HTTPS加密后看不到内容，但仍然可以分析：
1. TLS握手信息：SNI（域名）、JA3指纹（客户端特征）
2. 连接元数据：连接时间、包大小、频率、时长
3. DNS解析记录：在TLS连接之前通常有DNS请求，可以看到域名
4. 如果有SSL KEY LOG文件，Wireshark可以解密（仅限测试环境）
5. 企业内部可以部署SSL解密设备（需合规审批）

---

## 学习进度里程碑

你已经快完成50天课程了！停下来回顾一下：

**你已掌握的技能：**
- Day 1-7：网络基础 + 抓包分析
- Day 8-28：日志分析 + 工具使用 + 攻击识别 + 应急响应
- Day 29-40：Web漏洞检测 + 工具实操 + 靶场训练
- Day 41-48：漏洞复现 + 流量分析 + 报告撰写

**接下来你需要掌握的：**
- Day 49-60：等保合规 + 资产排查 + 模拟值守 + 面试准备
- Day 61-90：进阶攻击检测 + 高级防御技术
- Day 91-120：高级攻防 + 体系建设

**你现在相当于什么水平？**
- 已完成内容相当于一名"初级蓝队工程师"的知识储备
- 如果去面试护网值守岗位，你的基础已经够了
- 但实操经验还需要在真实工作中积累

---

## 自我激励

> 回想Day 1的时候，你可能连Wireshark都没打开过。
> 现在你能分析PCAP、还原攻击链、写检测报告。
> 这就是坚持的力量。
>
> 接下来的内容会让你从"初级"走向"高级"。
> 每一个坚持到今天的人，都值得为自己骄傲。

---

## 流量分析进阶资源

### 推荐的公开PCAP样本网站

- **malware-traffic-analysis.net**（最强推荐）：每季度发布恶意流量分析挑战，附详细解析
- **PacketTotal.com**：PCAP搜索引擎，可以搜索特定恶意软件家族的流量
- **NETRESEC的公开PCAP**：多个安全会议的演练PCAP
- **Wireshark官方SampleCaptures**：包含各种协议的正常和恶意样本
- **contagiodump.blogspot.com**：恶意软件和流量样本博客

### 开源流量分析工具延伸

- **Zeek（原名Bro）**：网络安全监控框架，自动解析协议生成日志
- **Suricata**：IDS/IPS引擎，可用规则检测攻击
- **TShark**：Wireshark的命令行版本，适合批量分析
- **NetworkMiner**：从PCAP中提取文件、证书、凭证等
- **CapTipper**：Web流量分析专用工具，可还原Web会话

### 蓝队用Wireshark的10个效率技巧

1. Ctrl+F -> String -> 搜索Payload关键字
2. 右键包 -> Follow -> TCP Stream 看完整会话
3. Statistics -> HTTP -> Requests 导出所有HTTP请求列表
4. File -> Export Objects -> HTTP 提取所有传输的文件
5. 右键列 -> Apply as Column 添加自定义列（如tcp.srcport）
6. Edit -> Preferences -> Appearance -> Columns 定制列显示
7. Analyze -> Display Filter Macros 创建常用过滤器快捷方式
8. Statistics -> IO Graph 绘制流量趋势图
9. Telephony -> VoIP Calls（如果不是VoIP可以忽略）
10. 把分析流程保存为Profile：Edit -> Configuration Profiles -> New

### Wireshark常用过滤表达式速查

```
# 按IP
ip.addr == 192.168.1.1           # 所有涉及该IP的包
ip.src == 10.0.0.1               # 源IP是...
ip.dst != 192.168.0.0/16         # 目标IP不在内网段

# 按TCP
tcp.port == 80                   # 源或目标端口80
tcp.srcport == 443               # 源端口443
tcp.flags.syn == 1               # SYN包
tcp.analysis.flags               # 有TCP分析标记的包

# 按HTTP
http.host contains "example"     # Host头包含...
http.user_agent contains "curl"  # UA包含curl
http.request.uri contains "admin" # URI包含admin
http.response.code > 399         # 响应码>=400的错误

# 按DNS
dns.qry.name == "evil.com"       # 查询特定域名
dns.qry.name matches ".*evil.*"  # 正则匹配域名
dns.flags.response == 0          # 只看查询（不看响应）

# 组合
http && ip.src == 10.0.0.5       # 某IP的HTTP流量
!(dns || arp || icmp)            # 排除噪音协议
```

---

> **明日预告**：坚持就是胜利，明天继续。

---

## 今日额外思考

流量分析不是一次性技能。每次分析PCAP，你都在积累"攻击模式库存"。
分析过10个不同的PCAP后，你会发现自己一眼就能认出SQL注入流量、
一眼就能识别C2心跳——这就是"肌肉记忆"。

### 学习建议

- 每周至少分析1个新的PCAP样本
- 每次分析后写一篇简短的报告
- 把发现的新IOC录入自己的威胁情报库
- 与其他安全爱好者交流分析心得

### 核心口诀

"先全局后局部，先统计后细节，先协议后内容"——牢记这个口诀，
分析任何未知流量都不会迷失方向。

> 继续坚持，半程即将到达。你做的每一分努力都在为你未来的安全职业生涯铺路。

---

## 蓝队日常工具实战汇总

### Nmap快速扫描速查

```
# 快速扫描常用端口
nmap -F target

# 扫描全部65535个端口
nmap -p- target

# 服务版本探测
nmap -sV target

# 操作系统探测
nmap -O target

# 综合扫描（版本+OS+脚本）
nmap -A target

# 躲避防火墙（分段包）
nmap -f target

# 慢速扫描（降低检测风险）
nmap -T2 target
```

### Wireshark显示过滤 vs 捕获过滤

| 类型 | 用法 | 场景 |
|:---|:---|:---|
| 显示过滤 | 抓完包后过滤显示 | 分析已有PCAP |
| 捕获过滤 | 只抓符合条件的数据包 | 实时监控/抓包时减少数据量 |

常用捕获过滤：`port 80 or port 443` `host 192.168.1.1` `not arp`

### BurpSuite蓝队使用要点

蓝队用BurpSuite不攻击，而是：
1. **Proxy模块**：观察正常和异常的HTTP请求差异
2. **Repeater模块**：手动重放可疑请求观察服务器响应
3. **Decoder模块**：解码攻击Payload中的编码内容
4. **Intruder模块**：测试WAF规则是否被正确触发

### 安全日志关键字速查

在ELK中搜索这些关键字快速定位攻击：
- `UNION SELECT` / `OR 1=1` / `information_schema` -> SQL注入
- `<script>` / `onerror=` / `javascript:` -> XSS攻击
- `../` / `..\\` / `passwd` / `shadow` -> 目录遍历/文件包含
- `cmd.exe` / `/bin/bash` / `whoami` / `id` -> 命令执行/Webshell
- `eval(` / `base64_decode` / `system(` -> PHP代码执行

### 蓝队日常巡检脚本示例

```python
# 简单端口监控脚本
import socket
import time

SERVICES = {
    'web': ('10.0.0.1', 80),
    'api': ('10.0.0.2', 8080),
    'db': ('10.0.0.3', 3306),
}

def check_port(name, host, port):
    try:
        s = socket.socket()
        s.settimeout(3)
        s.connect((host, port))
        s.close()
        return True
    except:
        return False

while True:
    for name, (host, port) in SERVICES.items():
        status = "UP" if check_port(name, host, port) else "DOWN!"
        print(f"[{time.strftime('%H:%M:%S')}] {name}({host}:{port}) -> {status}")
    time.sleep(60)
```

### 总结

把今天学的工具链串联起来：
Nmap发现资产 -> Wireshark分析流量 -> BurpSuite验证Web请求 -> ELK检索日志
这就是蓝队日常工作的标准工具链。

每天学一点，每天进步一点。120天后，这些工具就像你的左手右手一样熟练。