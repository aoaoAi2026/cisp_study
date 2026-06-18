# Snort 入侵检测系统完全指南

> 分类：工具指南 | 难度：进阶 | 阅读时间：约50分钟

## 概述

Snort 是世界上最著名的开源入侵检测/防御系统（IDS/IPS），由 Martin Roesch 于 1998 年创建，现由 Cisco 维护。它能对网络流量进行实时分析，根据预定义的规则匹配攻击模式、恶意活动和异常流量，并按策略生成告警或阻断连接。Snort 有三大核心功能：数据包嗅探器（Packet Sniffer）、数据包记录器（Packet Logger）、网络入侵检测系统（NIDS）。

**核心特性**：
- 基于规则的检测引擎
- 支持协议分析和内容匹配
- 3万+ 社区规则（Snort Community Rules / Cisco Talos）
- 三种部署模式（嗅探/记录/IDS）
- IPS 内联模式（Snort Inline）
- 高性能多线程（Snort 3）
- Barnyard2 数据库输出集成

## 核心知识点

- Snort 规则语法详解
- 部署模式与架构
- Snort 2 vs Snort 3
- 规则管理与更新
- 自定义规则编写
- 日志分析与告警处理
- 与 SIEM 集成

---

## 一、安装

### 1.1 Ubuntu/Debian（Snort 3 推荐）

```bash
# 安装依赖
sudo apt update
sudo apt install -y build-essential autotools-dev libdumbnet-dev \
  libluajit-5.1-dev libpcap-dev zlib1g-dev pkg-config libhwloc-dev \
  cmake liblzma-dev openssl libssl-dev cpputest libsqlite3-dev \
  libtool uuid-dev git autoconf bison flex libcmocka-dev \
  libnetfilter-queue-dev libunwind-dev libmnl-dev ethtool

# 安装 DAQ（数据采集库）
cd /tmp
git clone https://github.com/snort3/libdaq.git
cd libdaq
./bootstrap
./configure
make && sudo make install

# 安装 Snort 3
cd /tmp
git clone https://github.com/snort3/snort3.git
cd snort3
./configure_cmake.sh --prefix=/usr/local/snort
cd build
make -j$(nproc) && sudo make install

# 验证
sudo ldconfig
/usr/local/snort/bin/snort -V

# 创建目录结构
sudo mkdir -p /etc/snort/rules /etc/snort/logs /etc/snort/so_rules
sudo touch /etc/snort/rules/local.rules /etc/snort/rules/white_list.rules /etc/snort/rules/black_list.rules
```

### 1.2 Kali Linux（Snort 2）

```bash
sudo apt install snort -y
# 安装时配置：填写网络接口和子网范围
sudo snort -V
```

### 1.3 Snort 2 快速安装

```bash
# 从 apt
sudo apt install snort -y

# 配置
sudo dpkg-reconfigure snort
# 按提示设置网络接口、本地网络范围
```

---

## 二、Snort 规则语法

### 2.1 规则结构

```
<规则动作> <协议> <源IP> <源端口> <方向> <目标IP> <目标端口> (<规则选项>)

# 示例
alert tcp any any -> 192.168.1.0/24 80 (
  msg:"SQL Injection Attempt";
  content:"union select"; nocase;
  sid:1000001; rev:1;
)
```

### 2.2 规则动作

| 动作 | 说明 |
|:---|:---|
| **alert** | 生成告警并记录数据包 |
| **log** | 仅记录数据包 |
| **pass** | 忽略匹配的数据包 |
| **drop** | 阻断并记录（IPS模式）|
| **reject** | 阻断+发送 TCP RST 或 ICMP |
| **sdrop** | 静默阻断（IPS模式）|

### 2.3 规则选项详解

```snort
# 内容匹配
content:"GET";                          # 基本的二进制/文本匹配
content:"admin"; nocase;               # 不区分大小写
content:"|0D 0A|";                     # 十六进制匹配
content:"GET"; depth:4;                # 仅在 payload 前4字节匹配
content:"/etc/passwd"; offset:10;      # 偏移10字节后匹配
content:"GET"; distance:0;             # 紧接上一个 content 之后

# 正则表达式
pcre:"/password\s*=\s*\w+/i";         # PCRE模式
pcre:"/eval\s*\(/i";

# HTTP特定
http_uri;      # 匹配 URI 部分
http_header;   # 匹配 HTTP 头部
http_client_body; # 匹配 HTTP 请求体

# 流控制
flow:to_server,established;    # 已建立的服务器方向流
flow:from_server,established;  # 已建立的客户端方向流

# 字节测试
byte_test:4,>,1024,0;          # 偏移0的4字节 > 1024

# IP/TCP选项
ttl:<10; id:12345; tos:0x10;
flags:S; flags:PA; seq:0;
ack:0; window:55808;

# 统计
threshold:type threshold, count 5, seconds 60, track by_src;
# 同一来源60秒内超过5次→告警

# 元数据
msg:"描述信息";
reference:url,https://cve.mitre.org/cgi-bin/cvename.cgi?name=2024-XXXX;
classtype:web-application-attack;
priority:1;
sid:1000001; rev:1;
```

---

## 三、实战规则示例

### 3.1 Web 攻击检测

```snort
# SQL 注入检测
alert tcp any any -> $HOME_NET 80 (
  msg:"SQL Injection - UNION SELECT";
  flow:to_server,established;
  content:"UNION"; nocase;
  content:"SELECT"; nocase; distance:0;
  classtype:web-application-attack;
  sid:1000010; rev:1;
)

# XSS 检测
alert tcp any any -> $HOME_NET 80 (
  msg:"XSS Attack - Script Tag";
  flow:to_server,established;
  content:"<script>"; nocase;
  classtype:web-application-attack;
  priority:2;
  sid:1000011; rev:1;
)

# 目录遍历
alert tcp any any -> $HOME_NET 80 (
  msg:"Directory Traversal Attempt";
  flow:to_server,established;
  content:"../"; depth:5;
  content:"etc/passwd"; nocase; distance:0;
  classtype:attempted-recon;
  sid:1000012; rev:1;
)
```

### 3.2 端口扫描检测

```snort
# TCP 端口扫描检测
alert tcp any any -> $HOME_NET any (
  msg:"Port Scan Detected";
  flags:S;
  threshold:type threshold, track by_src, count 10, seconds 30;
  classtype:attempted-recon;
  sid:1000020; rev:1;
)
```

### 3.3 Shell 命令检测

```snort
# 反弹 Shell
alert tcp $HOME_NET any -> any any (
  msg:"Reverse Shell - /bin/sh";
  content:"/bin/sh"; nocase;
  content:"nc "; nocase; distance:0;
  classtype:trojan-activity;
  sid:1000030; rev:1;
)

# Cobalt Strike Beacon
alert tcp any any -> any any (
  msg:"Cobalt Strike Beacon - GET /.../";
  flow:to_server,established;
  content:"GET "; depth:4;
  content:"/.../"; distance:0; within:10;
  content:"Mozilla/5.0"; distance:0;
  classtype:trojan-activity;
  sid:1000031; rev:1;
)
```

---

## 四、部署模式

### 4.1 嗅探器模式

```bash
# 类似 tcpdump 输出
sudo snort -v -i eth0    # TCP/IP头
sudo snort -vd           # 含数据链路层
sudo snort -vde          # 含数据链路层+应用层
```

### 4.2 数据包记录器模式

```bash
# 记录流量到文件
sudo snort -l /var/log/snort -i eth0 --pcap-dir=/tmp/snort_logs

# 使用 BPF 过滤
sudo snort -l /var/log/snort -i eth0 'tcp port 80'
```

### 4.3 NIDS 模式

```bash
# 完整 IDS 配置
sudo snort -c /etc/snort/snort.conf -i eth0

# Snort 3
sudo /usr/local/snort/bin/snort \
  -c /usr/local/snort/etc/snort/snort.lua \
  -i eth0 \
  -R /etc/snort/rules/local.rules \
  -l /var/log/snort
```

### 4.4 IPS 内联模式

```bash
# 需要两个网卡（网桥模式）
sudo snort -Q -c /etc/snort/snort.conf \
  --daq afpacket -i eth0:eth1

# -Q: 内联模式
# --daq afpacket: 使用 AF_PACKET 数据采集模块
# eth0:eth1: 网桥的输入和输出接口
```

---

## 五、配置管理

### 5.1 Snort 2 配置（snort.conf）

```bash
# 关键配置项
var HOME_NET 192.168.1.0/24       # 受保护的网络
var EXTERNAL_NET !$HOME_NET        # 外部网络
var HTTP_SERVERS $HOME_NET         # Web 服务器
var RULE_PATH /etc/snort/rules

# 预处理器
preprocessor sfportscan: proto { all } memcap { 10000000 }
preprocessor http_inspect: global iis_unicode_map unicode.map
preprocessor stream5_global: track_tcp yes

# 输出
output alert_fast: snort_alerts.log
output alert_full: snort_full_alerts.log
output log_tcpdump: snort_tcpdump.log
```

### 5.2 Snort 3 配置（snort.lua）

```lua
HOME_NET = '192.168.1.0/24'
EXTERNAL_NET = '!$HOME_NET'

ips = {
    rules = '/etc/snort/rules/local.rules',
    include = '/etc/snort/rules/',
    enable_builtin_rules = true,
}

alerts = {
    alert_fast = {
        file = true,
        limit = 1000
    },
    alert_full = {
        file = true,
    }
}
```

---

## 六、日志分析

```bash
# 查看告警
tail -f /var/log/snort/alert
grep "Priority: 1" /var/log/snort/alert

# 按SID统计告警
cat /var/log/snort/alert | grep "\[\*\*\]" | sort | uniq -c | sort -rn

# 提取源IP统计
grep -oP '\d+\.\d+\.\d+\.\d+' /var/log/snort/alert | sort | uniq -c | sort -rn

# 用 Barnyard2 导入数据库
barnyard2 -c /etc/snort/barnyard2.conf \
  -d /var/log/snort \
  -f snort.log \
  -w /var/log/snort/barnyard2.waldo
```

---

## 七、规则更新

```bash
# PulledPork 规则管理
sudo apt install pulledpork -y

# 配置 PulledPork
sudo vim /etc/snort/pulledpork.conf
# 设置 Oinkcode（从 Snort.org 注册获得）

# 自动更新
sudo pulledpork.pl -c /etc/snort/pulledpork.conf -P

# Snort 3 内置更新
sudo /usr/local/snort/bin/snort --create-pidfile
```

---

## 八、速查卡

```
Sniff模式:    snort -v -i eth0
NIDS模式:     snort -c snort.conf -i eth0
IPS模式:      snort -Q -c snort.conf --daq afpacket -i eth0:eth1
自定义规则:   /etc/snort/rules/local.rules
测试规则:     snort -T -c snort.conf
查看规则:     cat /etc/snort/rules/
更新规则:     pulledpork.pl -c pulledpork.conf -P
告警日志:     /var/log/snort/alert

规则语法:
  alert tcp any any -> $HOME_NET 80 (msg:"..."; content:"..."; sid:1;)
```

---

> 📖 本文为"网安百宝箱"课程配套读物。
> 参考：Snort 官方 https://www.snort.org/
> 更新于 2026-06-18
