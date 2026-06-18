# DAY 45 · 山石网科 StoneOS 防火墙 —— 边界安全

> **产品定位**：StoneOS NGFW（自研安全芯片，金融行业首选）
> **学习目标**：了解山石网科NGFW产品线、掌握StoneOS操作管理和策略配置、理解山石金融行业市占率优势
> **核心对比**：山石 vs 深信服 —— 山石偏传统网络防火墙，深信服偏应用层安全
> **行业地位**：金融市场 ⭐⭐⭐⭐⭐

---

## 一、开篇概述：边界安全的"瑞士军刀"

想象一下，你是一家银行的安全负责人。每天有数以百万计的交易请求穿过你的网络边界，有来自分行的专线流量、有来自手机银行的互联网流量、有来自第三方支付机构的API调用。你需要一扇"智能门"——它不能只是简单地说"允许"或"拒绝"，而是要能识别出：这个看似正常的HTTPS请求，是否在试图利用某个已知漏洞？这个来自"合法"IP的流量，是否已经被僵尸网络控制？

这就是**山石网科 StoneOS NGFW**要做的事情。

山石网科（Hillstone Networks）成立于2006年，总部位于北京，是中国边界安全领域的标杆企业。它的名字"山石"寓意着"坚如磐石"——这在金融行业尤为重要，因为银行的边界安全系统不允许有一秒钟的宕机。山石在银行、证券、保险三大金融子行业的市场占有率长期排名第一，这不是靠营销吹出来的，而是靠"稳"字打下来的。

### 1.1 为什么金融行业偏爱山石？

用一个简单的比喻来理解：

| 维度 | 山石网科（传统NGFW路线） | 深信服（应用安全路线） |
|------|--------------------------|--------------------------|
| 核心能力 | 网络层L3-L4深度包检测 | 应用层L7内容识别 |
| 硬件架构 | 自研安全芯片（硬件加速） | x86通用服务器 |
| 稳定性 | 电信级99.999%可用 | 企业级99.9%可用 |
| 适用场景 | 银行核心网络边界、数据中心出口 | 企业上网行为管理、VPN远程办公 |
| 类比 | 银行金库的钢筋混凝土大门 | 智能门禁系统（人脸识别+刷卡） |

山石的逻辑是："在银行核心边界，你不需要花里胡哨的应用识别，你需要的是在高吞吐下稳定地、精确地执行ACL策略，同时具备基本的入侵防御能力。"山石自研的安全芯片可以在硬件层面处理报文转发和会话匹配，这就好比用专用的高速公路收费站的ETC通道，而不是让每个包都去排人工窗口。

### 1.2 本日学习路线

```
产品定位与市场 → StoneOS架构深入 → 核心功能详解 → 策略配置实战 → 高可用部署 → 对比分析 → 验收练习
```

---

## 二、StoneOS NGFW 产品线全景

山石网科的NGFW产品线按照性能分级，覆盖从中小企业到超大规模数据中心的所有场景：

### 2.1 产品型号分级

```
┌─────────────────────────────────────────────────────────────┐
│                    山石NGFW产品线                              │
├─────────────┬──────────────┬──────────────┬─────────────────┤
│   A系列     │   E系列       │   T系列       │   X系列          │
│   桌面级     │   边缘/分支    │   中高端       │   数据中心旗舰    │
├─────────────┼──────────────┼──────────────┼─────────────────┤
│ 防火墙吞吐   │ 防火墙吞吐     │ 防火墙吞吐     │ 防火墙吞吐        │
│ 1-3 Gbps   │ 2-20 Gbps    │ 10-120 Gbps  │ 200+ Gbps       │
├─────────────┼──────────────┼──────────────┼─────────────────┤
│ 适用：       │ 适用：        │ 适用：         │ 适用：            │
│ 小型办事处    │ 中型企业总部   │ 大型企业        │ 银行数据中心       │
│ 零售门店     │ 分支互联      │ 省级分行        │ 运营商核心网       │
│ 远程站点     │ 园区出口      │ 地市级数据中心    │ 云数据中心         │
└─────────────┴──────────────┴──────────────┴─────────────────┘
```

### 2.2 核心硬件优势：自研安全芯片

这是山石最引以为傲的技术壁垒。让我们先理解为什么需要专用芯片：

**通用x86架构的问题：**
```
互联网流量 → 网卡 → PCIe总线 → CPU → 内存 → CPU处理 → 内存 → PCIe总线 → 网卡 → 内网
                 ↑                    ↑
              瓶颈点1              瓶颈点2
         （PCIe带宽限制）      （CPU上下文切换）
```

当流量达到几十Gbps时，x86 CPU会频繁在"处理网络包"和"处理其他任务"之间切换（上下文切换），导致延迟抖动。金融行业的交易系统对这种抖动是零容忍的——一笔交易延迟超过1ms就可能造成价格滑点。

**山石自研芯片架构：**
```
互联网流量 → 安全芯片（硬件转发引擎）→ 内网
                ↓（仅将未知/可疑流量上送）
              CPU（深度检测）
```

安全芯片内部集成了：
- **硬件级会话匹配引擎**：可以同时维护数千万并发会话，每个会话的查找时间是纳秒级的
- **硬件级模式匹配引擎**：直接在芯片上做正则匹配（IPS特征库匹配），不需要CPU参与
- **硬件级加解密引擎**：IPSec/SSL VPN的加解密在芯片上完成

用一个形象的比喻：x86方案就像让一个大学教授（CPU）去收费站一个一个地收钱找零；自研芯片方案就是在每条车道上装了ETC，只有遇到异常车辆时才通知教授来处理。

### 2.3 典型部署场景

#### 场景一：银行数据中心边界
```
      Internet
         │
    ┌────┴────┐
    │ 抗DDoS设备 │  ← 清洗大流量攻击
    └────┬────┘
         │
    ┌────┴────┐
    │ 山石X系列  │  ← NGFW主力（HA双机热备）
    │ (主) (备) │
    └────┬────┘
         │
    ┌────┴────┐
    │ 核心交换机 │
    └────┬────┘
         │
    ┌────┴─────────────┐
    │ 网银区 │ 核心交易区 │ 办公区
    └────────┴──────────┴──────┘
```

#### 场景二：总分互联（SD-WAN场景）
```
              总行数据中心
          ┌───────┴───────┐
          │   山石T系列     │
          │  (VPN Hub)    │
          └───┬───┬───┬───┘
        IPSec │   │   │ IPSec
      ┌───────┘   │   └───────┐
      ▼           ▼           ▼
   省分行A     省分行B      省分行C
 (山石E系列)  (山石E系列)   (山石E系列)
```

---

## 三、StoneOS 操作系统深度解析

StoneOS是山石网科自主研发的网络安全操作系统，是整个NGFW的灵魂。它不是一个普通的Linux发行版，而是从内核层面为包处理做了深度定制的实时操作系统。

### 3.1 StoneOS架构分层

```
┌──────────────────────────────────────────────┐
│              CLI / WebUI / REST API           │  管理平面
├──────────────────────────────────────────────┤
│  路由引擎  │  VPN引擎  │  策略引擎  │  日志引擎  │  控制平面
├──────────────────────────────────────────────┤
│          StoneOS 安全内核（实时调度）           │  内核平面
├──────────────────────────────────────────────┤
│ 硬件转发引擎 │ IPS引擎  │ AV引擎 │ 加解密引擎   │  数据平面
├──────────────────────────────────────────────┤
│              自研安全芯片 + FPGA               │  硬件平面
└──────────────────────────────────────────────┘
```

### 3.2 关键设计理念：控制平面与数据平面分离

这是StoneOS最重要的架构特点。在传统防火墙中，如果管理界面上有人正在导出大量日志，可能会影响到数据包的转发。StoneOS将两者物理隔离：

- **管理平面（Control Plane）**：运行在x86 CPU上，负责CLI、WebUI、日志、报表、路由协议（OSPF/BGP）
- **数据平面（Data Plane）**：运行在自研安全芯片上，负责包转发、NAT、会话匹配、IPS检测

这意味着即使管理员正在全速导出100GB的日志文件，数据平面的包转发延迟也不会受到任何影响。在金融行业，这个特性就是"钱"——一次交易延迟故障可能造成的损失远超防火墙本身的成本。

### 3.3 StoneOS会话管理机制

StoneOS的会话表是整个防火墙最核心的数据结构。每一条通过防火墙的连接都会在会话表中建立一条记录。

**会话表结构（简化版）：**
```
┌────────┬──────────┬──────────┬──────────┬──────────┬────────────┬──────────┐
│ Src IP │ Src Port │ Dst IP   │ Dst Port │ Protocol │ NAT IP/Port│ State    │
├────────┼──────────┼──────────┼──────────┼──────────┼────────────┼──────────┤
│10.1.1.5│ 54321    │202.96.1.1│ 443      │ TCP      │1.2.3.4:1234│ ESTAB    │
│10.1.1.6│ 54322    │8.8.8.8   │ 53       │ UDP      │1.2.3.4:1235│ -        │
└────────┴──────────┴──────────┴──────────┴──────────┴────────────┴──────────┘
```

### 3.4 包处理流程（Step by Step）

让我们追踪一个从内网访问外网Web服务器的HTTP请求包在StoneOS中的完整旅程：

```
Step 1: 包到达入口网卡
  ↓
Step 2: 硬件芯片做MAC地址校验（是否是发给我的？）
  ↓ (如果不是，直接丢弃)
Step 3: 会话表查询（Hash查找，纳秒级）
  ↓
  ├── 命中已有会话 → 直接转发（快速路径，Fast Path）
  │     └── 更新会话超时时间
  │
  └── 未命中会话（新连接首包）→ 进入慢速路径（Slow Path）
       ↓
Step 4: 安全策略匹配（从上到下顺序匹配策略列表）
  ├── 策略1: from trust to untrust, src 10.1.1.0/24, dst any, service HTTP → PERMIT
  └── 默认策略: any any any any → DENY
       ↓
Step 5: 如果策略动作为PERMIT
  ├── 执行NAT（SNAT/DNAT）
  ├── IPS检测（匹配入侵特征库）
  ├── AV检测（如果开启）
  ├── URL过滤（如果开启）
  └── 创建会话表项 → 转发包
       ↓
Step 6: 后续包走快速路径（直接查会话表，跳过策略匹配）
```

这就是NGFW"首包慢，后续包快"的原理。一个好的防火墙设计，99.9%以上的包都应该走快速路径。

---

## 四、核心功能详解

### 4.1 安全策略（Security Policy）

安全策略是NGFW最基础也是最核心的功能。StoneOS的策略模型可以概括为：

```
策略 = 匹配条件 + 动作 + 安全配置文件
```

#### 4.1.1 策略匹配条件

StoneOS支持的匹配条件非常丰富：

| 匹配维度 | 说明 | 示例 |
|----------|------|------|
| 源安全域 | 流量来源区域 | trust, untrust, dmz |
| 目的安全域 | 流量目的区域 | trust, untrust, dmz |
| 源IP地址 | 源地址对象 | 10.1.1.0/24 |
| 目的IP地址 | 目的地址对象 | 202.96.1.0/24 |
| 用户 | 用户/用户组 | 张三, 财务部 |
| 应用 | 应用识别 | HTTP, SQL, WeChat |
| 服务 | 端口/协议 | TCP/443, UDP/53 |
| 时间 | 时间段 | 工作日9:00-18:00 |

#### 4.1.2 安全域（Security Zone）

安全域是StoneOS中最基础的概念之一，它是一个逻辑容器，用于将接口分组并定义信任级别。

```
           Internet (untrust 安全域，信任级别: 5)
                │
        ┌───────┴───────┐
        │   山石 NGFW    │
        └───┬───┬───┬───┘
            │   │   │
     ┌──────┘   │   └──────┐
     ▼          ▼          ▼
  trust      dmz        vpn-hub
(信任:100) (信任:50)   (信任:75)
 内网办公    对外服务区    分支互联
```

安全域的信任级别决定了默认行为：
- 高信任→低信任（如trust→untrust）：通常允许
- 低信任→高信任（如untrust→trust）：通常拒绝，需要明确策略放行
- 同级别（如dmz→dmz）：默认拒绝

#### 4.1.3 策略配置实战

以下是一套典型企业防火墙策略的StoneOS CLI配置示例：

```
# ===== 第一步：定义地址对象 =====
config
  address "internal-net"
    ip 10.1.1.0/24
    description "内网办公网段"
  exit
  address "internal-server"
    ip 10.1.2.0/24
    description "内网服务器区"
  exit
  address "dmz-web"
    ip 172.16.1.0/24
    description "DMZ Web服务器区"
  exit
  address "dmz-db"
    ip 172.16.2.0/24
    description "DMZ 数据库区"
  exit
exit

# ===== 第二步：定义服务对象 =====
config
  service "web-services"
    protocol tcp
    port 80
    port 443
  exit
  service "db-services"
    protocol tcp
    port 3306
    port 1433
    port 1521
  exit
exit

# ===== 第三步：创建安全策略 =====
config
  # 策略1: 允许内网访问互联网（HTTP/HTTPS）
  policy 1
    name "internal-to-internet"
    from trust
    to untrust
    source "internal-net"
    destination any
    service "web-services"
    action permit
    log enable
    profile ips default-ips-profile
  exit
  
  # 策略2: 允许互联网访问DMZ Web服务器
  policy 2
    name "internet-to-dmz-web"
    from untrust
    to dmz
    source any
    destination "dmz-web"
    service "web-services"
    action permit
    log enable
    profile ips web-server-protection
    profile av default-av-profile
  exit
  
  # 策略3: 允许DMZ Web访问DMZ数据库（但禁止访问内网）
  policy 3
    name "dmz-web-to-dmz-db"
    from dmz
    to dmz
    source "dmz-web"
    destination "dmz-db"
    service "db-services"
    action permit
    log enable
  exit
  
  # 策略4: 默认拒绝所有（系统隐式规则，无需配置）
  # 任何未匹配到上述策略的流量将被丢弃
exit
```

### 4.2 NAT（网络地址转换）

StoneOS支持丰富的NAT模式，是金融行业最关注的功能之一。

#### 4.2.1 NAT类型对比

| NAT类型 | 说明 | 适用场景 | 示例 |
|---------|------|----------|------|
| 源NAT (SNAT) | 内网访问外网时转换源IP | 内网上网 | 10.1.1.5→1.2.3.4 |
| 目的NAT (DNAT) | 外网访问内网时转换目的IP | 端口映射 | 1.2.3.4:80→10.1.2.5:8080 |
| 静态NAT | 一对一IP映射 | 服务器公网映射 | 10.1.2.5↔1.2.3.5 |
| NAT Server | 带端口的一对一映射 | DMZ服务器 | 1.2.3.4:443→10.1.2.5:443 |
| NAT64 | IPv6到IPv4转换 | IPv6过渡 | 2001:db8::1→10.1.1.1 |

#### 4.2.2 金融行业的NAT特殊需求

银行的数据中心出口通常有以下特殊NAT需求：

```
# 场景：银行需要对外提供网银服务，但真实服务器在内网
# 需求1：将公网IP的443端口映射到内网服务器集群的VIP
config
  nat server "web-banking"
    interface ethernet0/1
    protocol tcp
    external-ip 202.96.1.100
    external-port 443
    internal-ip 10.1.2.50  # 服务器负载均衡VIP
    internal-port 443
  exit
exit

# 需求2：内网办公区上网，但不同部门使用不同的公网IP出口
# （合规要求：不同业务系统的流量需要有不同的审计标识）
config
  # 为财务部创建独立的SNAT地址池
  nat pool "finance-snat-pool"
    ip 202.96.1.10 202.96.1.15
  exit
  # 为普通办公创建SNAT地址池
  nat pool "office-snat-pool"
    ip 202.96.1.20 202.96.1.50
  exit
exit
```

#### 4.2.3 NAT排错思路

NAT问题是防火墙最常见的故障类型之一。以下是StoneOS的NAT排错检查清单：

```
□ 检查会话表：show session src-ip 10.1.1.5
  确认NAT转换后的IP和端口是否正确

□ 检查NAT策略：show nat policy
  确认NAT规则是否匹配到了期望的流量

□ 检查路由：show route
  确认回包路由是否可达（NAT后的IP需要有回程路由）

□ 检查安全策略：show policy
  即使NAT正确，安全策略也必须允许

□ 检查ARP：show arp
  确认NAT使用的公网IP在出口网段中是否正常解析ARP

□ 常见问题1：NAT回流（Hairpin NAT）
  内网用户通过公网IP访问内网服务器时需要特殊配置
  config
    nat hairpin enable
  exit

□ 常见问题2：SIP/H.323等协议
  这些协议在应用层携带IP地址信息，需要ALG配合
  config
    alg sip enable
    alg h323 enable
  exit
```

### 4.3 IPS（入侵防御系统）

StoneOS的IPS功能可以在网络层检测并阻断已知的攻击流量。

#### 4.3.1 IPS检测原理

```
网络流量 → 协议解码（HTTP/SMTP/FTP...）
                ↓
          应用层数据提取
                ↓
          正则匹配引擎（匹配数千条签名规则）
                ↓
        ┌───────┴───────┐
        │  匹配到签名？   │
        └───┬───────┬───┘
         是 ↓       ↓ 否
      ┌───────┐  放行
      │ 动作？  │
      └───┬───┘
    ┌─────┼─────┐
    ▼     ▼     ▼
  阻断   告警  隔离
```

#### 4.3.2 IPS签名示例

StoneOS的IPS签名库包含了数以万计的签名规则。每条签名的基本结构如下：

```
# 签名ID: 12345
# 名称: SQL Injection - UNION SELECT Detection
# 严重级别: Critical
# 协议: HTTP
# 匹配模式: /UNION\s+SELECT\s+.*FROM/i
# 动作: Block
# 描述: 检测HTTP请求中是否包含SQL注入的UNION SELECT语句

# 签名ID: 12346
# 名称: Apache Struts2 S2-045 Remote Code Execution
# 严重级别: Critical
# 协议: HTTP
# 匹配模式: Content-Type头包含 "%{(#nike="multipart/form-data")"
# CVE: CVE-2017-5638
# 动作: Block
```

#### 4.3.3 IPS Profile配置

StoneOS支持为不同业务创建不同的IPS Profile，实现差异化的防护策略：

```
# 为Web服务器创建严格的IPS策略
config
  ips profile "web-server-protection"
    description "Web服务器IPS防护"
    # 启用所有Critical和High级别的签名
    severity critical action block
    severity high action block
    severity medium action alert
    severity low action alert
    # 针对Web应用的签名集
    signature-set "web-server"
    signature-set "web-activex"
    signature-set "web-browser"
    signature-set "server-apache"
    signature-set "server-iis"
    signature-set "server-tomcat"
    # 排除某些误报率高的签名
    exception signature 12345
    exception signature 23456
  exit
exit

# 为数据库服务器创建IPS策略
config
  ips profile "db-server-protection"
    description "数据库服务器IPS防护"
    severity critical action block
    severity high action block
    severity medium action alert
    # 数据库相关的签名集
    signature-set "database-mysql"
    signature-set "database-oracle"
    signature-set "database-mssql"
  exit
exit
```

### 4.4 应用识别（App-ID）

这是NGFW区别于传统防火墙的关键功能。传统防火墙只能看到"TCP/443端口"，而NGFW能识别出"这是微信视频通话的流量"。

#### 4.4.1 应用识别技术栈

```
Layer 1: 端口匹配
  └→ 如 TCP/80 → 可能是HTTP（但不可靠，很多人用80端口跑其他协议）
  
Layer 2: 协议解码
  └→ 解析协议头部，如HTTP Method、Host头等

Layer 3: 应用签名匹配
  └→ 匹配应用层数据中的特征字符串

Layer 4: 行为分析
  └→ 分析连接模式：连接频率、包大小分布、协议序列
     例如：微信视频通话的特征是长时间UDP流+固定间隔的小包（心跳）

Layer 5: SSL/TLS指纹
  └→ 通过Client Hello中的密码套件、SNI、证书信息识别应用
     例如：即使看不到加密内容，也能通过SNI=*.weixin.qq.com判断是微信
```

#### 4.4.2 基于应用的策略配置

```
# 场景：允许内网访问互联网，但禁止P2P下载和在线视频
config
  policy 10
    name "internal-internet-allow"
    from trust
    to untrust
    source "internal-net"
    destination any
    
    # 允许常见的办公应用
    application "web-browsing"
    application "ssl"
    application "office365"
    application "wechat"      # 允许微信文字聊天
    application "dingtalk"
    application "email"
    
    # 禁止非办公应用
    application "wechat-video"    action deny   # 禁止微信视频通话
    application "bittorrent"      action deny   # 禁止BT下载
    application "thunder"         action deny   # 禁止迅雷
    application "youku"           action deny   # 禁止优酷
    application "iqiyi"           action deny   # 禁止爱奇艺
    application "youtube"         action deny   # 禁止YouTube
    application "tiktok"          action deny   # 禁止抖音
    
    action permit
    log enable
  exit
exit
```

### 4.5 VPN（虚拟专用网络）

山石在VPN领域也是强项，支持IPSec VPN和SSL VPN两种主要模式。

#### 4.5.1 IPSec VPN配置（站点到站点）

```
# ===== 总部侧配置（山石T系列）=====
# 第一步：配置IKE Proposal（阶段1参数协商）
config
  ike proposal "ike-prop-branch"
    encryption aes-256
    authentication sha256
    dh-group 14
    lifetime 86400
  exit

  # 第二步：配置IKE Policy
  ike policy "ike-policy-branch"
    proposal "ike-prop-branch"
    pre-shared-key "YourSecureKey@2024!"
    peer 203.0.113.10  # 分支防火墙公网IP
    local 202.96.1.1    # 总部防火墙公网IP
  exit

  # 第三步：配置IPSec Proposal（阶段2参数）
  ipsec proposal "ipsec-prop-branch"
    protocol esp
    encryption aes-256
    authentication sha256
    pfs dh-group 14
    lifetime 3600
  exit

  # 第四步：配置IPSec Policy
  ipsec policy "ipsec-policy-branch"
    proposal "ipsec-prop-branch"
    ike-policy "ike-policy-branch"
    src-address "10.1.0.0/16"       # 总部内网
    dst-address "192.168.1.0/24"    # 分支内网
    action tunnel
  exit

  # 第五步：应用到接口
  interface ethernet0/0
    ipsec policy "ipsec-policy-branch"
  exit
exit

# ===== 分支侧配置（山石E系列）=====
# 配置与总部对称，注意源目地址互换
config
  ike proposal "ike-prop-headquarter"
    encryption aes-256
    authentication sha256
    dh-group 14
    lifetime 86400
  exit

  ike policy "ike-policy-headquarter"
    proposal "ike-prop-headquarter"
    pre-shared-key "YourSecureKey@2024!"
    peer 202.96.1.1     # 总部防火墙公网IP
    local 203.0.113.10  # 分支防火墙公网IP
  exit

  ipsec proposal "ipsec-prop-headquarter"
    protocol esp
    encryption aes-256
    authentication sha256
    pfs dh-group 14
    lifetime 3600
  exit

  ipsec policy "ipsec-policy-headquarter"
    proposal "ipsec-prop-headquarter"
    ike-policy "ike-policy-headquarter"
    src-address "192.168.1.0/24"   # 分支内网
    dst-address "10.1.0.0/16"      # 总部内网
    action tunnel
  exit

  interface ethernet0/0
    ipsec policy "ipsec-policy-headquarter"
  exit
exit
```

#### 4.5.2 IPSec VPN排错流程

```
# 检查IKE SA（阶段1是否建立成功）
show ike sa
# 期望看到：State = ESTABLISHED

# 检查IPSec SA（阶段2是否建立成功）
show ipsec sa
# 期望看到：有加密/解密字节计数在增长

# 如果IKE SA一直处于INIT状态：
# 1. 检查两端公网IP是否可达：ping对方公网IP
# 2. 检查预共享密钥是否一致
# 3. 检查IKE参数是否匹配（加密算法、认证算法、DH组）
# 4. 检查UDP 500和4500端口是否被中间设备拦截

# 如果IKE建立成功但IPSec SA失败：
# 1. 检查IPSec参数是否匹配
# 2. 检查感兴趣流（源目地址）是否正确
# 3. 检查安全策略是否允许隧道流量

# 如果IPSec SA建立但流量不通：
# 1. 检查路由是否正确（是否有到对端内网的路由）
# 2. 检查NAT是否影响了VPN流量（VPN流量通常需要bypass NAT）
# 3. 检查安全策略是否允许隧道流量
# 4. 检查MTU问题（IPSec会增加包头开销，可能需要调整MSS）
```

---

## 五、高可用部署（HA）

对于金融行业，防火墙的高可用是刚性需求。StoneOS支持多种HA模式。

### 5.1 Active-Passive（主备模式）

这是金融行业最常用的模式：

```
          Internet
          │     │
     ┌────┴─────┴────┐
     │   上行交换机    │
     └──┬─────────┬──┘
        │         │
   ┌────┴──┐  ┌──┴────┐
   │ 主墙   │  │ 备墙   │
   │Active │  │Passive│
   └───┬───┘  └──┬────┘
       │  心跳线  │
       └────┬────┘
            │
     ┌──────┴──────┐
     │  下行交换机   │
     └──────┬──────┘
            │
         内网
```

### 5.2 HA配置

```
# ===== 主墙配置 =====
config
  ha
    mode active-passive
    group-id 1
    priority 200  # 主墙优先级更高
    
    # 心跳接口
    ha-link interface ethernet0/3
    
    # 监控接口（任一接口down触发切换）
    monitor interface ethernet0/0
    monitor interface ethernet0/1
    
    # 会话同步
    session-sync enable
    
    # 抢占模式（主墙恢复后自动切回）
    preempt enable
    preempt-delay 300  # 延迟5分钟再切回（避免频繁切换）
  exit
exit

# ===== 备墙配置 =====
config
  ha
    mode active-passive
    group-id 1
    priority 100  # 备墙优先级较低
    ha-link interface ethernet0/3
    monitor interface ethernet0/0
    monitor interface ethernet0/1
    session-sync enable
  exit
exit
```

### 5.3 HA关键指标

| 指标 | 说明 | 山石典型值 |
|------|------|------------|
| 故障检测时间 | 从故障发生到被对端感知 | < 1秒 |
| 切换时间 | 从故障检测到备墙接管流量 | < 3秒 |
| 会话保持 | 切换后已有会话是否保持 | 是（会话同步） |
| 配置同步 | 主备配置是否自动同步 | 是 |

---

## 六、日志与报表

### 6.1 日志类型

StoneOS支持以下日志类型：

```
流量日志（Traffic Log）
  ├─ 记录每条被策略允许/拒绝的会话
  ├─ 包含：源IP、目的IP、源端口、目的端口、协议、应用、动作、字节数
  └─ 用于：安全审计、流量分析、合规报告

威胁日志（Threat Log）
  ├─ 记录IPS/AV/URL过滤等安全引擎检测到的威胁
  ├─ 包含：威胁名称、严重级别、攻击源、攻击目标、动作
  └─ 用于：安全事件响应、攻击溯源

系统日志（System Log）
  ├─ 记录设备自身的运行状态
  ├─ 包含：管理员登录、配置变更、接口状态变化、HA切换
  └─ 用于：运维监控、变更审计

审计日志（Audit Log）
  ├─ 记录所有管理操作
  ├─ 包含：谁、什么时间、从哪个IP、执行了什么命令
  └─ 用于：合规审计（等保三级明确要求）
```

### 6.2 日志配置与发送

```
# 配置Syslog服务器
config
  syslog
    server 10.1.3.100
      facility local0
      port 514
      protocol udp
      # 发送哪些类型的日志
      log-type traffic enable
      log-type threat enable
      log-type system enable
      log-type audit enable
    exit
  exit
exit

# 配置日志存储（本地硬盘）
config
  log
    disk
      enable
      max-size 100GB
      # 日志保留策略
      retention
        traffic 90 days
        threat 180 days
        system 365 days
        audit 365 days
      exit
    exit
  exit
exit
```

---

## 七、实操实验

### 实验1：基础策略配置

**场景**：某企业有三层网络架构，需要配置如下安全策略：

```
网络拓扑：
  - trust区（内网办公）：10.1.1.0/24
  - dmz区（对外服务）：172.16.1.0/24
  - untrust区（互联网）：any

需求：
  1. 内网办公区可以访问互联网（HTTP/HTTPS/DNS）
  2. 互联网可以访问DMZ区的Web服务器（172.16.1.10:80/443）
  3. DMZ区的Web服务器可以访问内网数据库（10.1.2.10:3306）
  4. 内网办公区可以SSH管理DMZ区服务器（172.16.1.0/24:22）
  5. 禁止内网访问互联网的非标准端口
  6. 所有策略都要记录日志
```

**配置步骤：**

```
# Step 1: 定义地址对象
config
  address "office-net"
    ip 10.1.1.0/24
  exit
  address "db-server"
    ip 10.1.2.10/32
  exit
  address "dmz-web-server"
    ip 172.16.1.10/32
  exit
  address "dmz-net"
    ip 172.16.1.0/24
  exit
exit

# Step 2: 定义服务对象
config
  service "web-ports"
    protocol tcp
    port 80
    port 443
  exit
  service "internet-basic"
    protocol tcp
    port 80
    port 443
    protocol udp
    port 53
  exit
exit

# Step 3: 配置安全策略（按顺序）
config
  # 需求1: 内网上网
  policy 10
    name "office-to-internet"
    from trust to untrust
    source "office-net"
    destination any
    service "internet-basic"
    action permit
    log enable
  exit

  # 需求2: 互联网访问DMZ Web
  policy 20
    name "internet-to-dmz-web"
    from untrust to dmz
    source any
    destination "dmz-web-server"
    service "web-ports"
    action permit
    log enable
    profile ips "web-server-protection"
  exit

  # 需求3: DMZ Web访问数据库
  policy 30
    name "dmz-web-to-db"
    from dmz to trust
    source "dmz-web-server"
    destination "db-server"
    service tcp/3306
    action permit
    log enable
  exit

  # 需求4: 内网管理DMZ
  policy 40
    name "office-ssh-to-dmz"
    from trust to dmz
    source "office-net"
    destination "dmz-net"
    service tcp/22
    action permit
    log enable
  exit

  # 需求5和6: 隐式默认拒绝（系统自动处理）
exit
```

### 实验2：NAT配置实验

**场景**：公司有一个公网IP段 202.96.1.0/28（16个IP），需要：

```
需求：
  1. 内网办公区（10.1.1.0/24）通过地址池 202.96.1.5-202.96.1.10 SNAT上网
  2. 内网服务器区（10.1.2.0/24）使用固定IP 202.96.1.2 SNAT上网
  3. 将DMZ的Web服务器（172.16.1.10）通过DNAT映射到202.96.1.3:80
  4. 将DMZ的邮件服务器（172.16.1.20）通过DNAT映射到202.96.1.3:25
```

```
# 需求1: 办公区SNAT地址池
config
  nat pool "office-snat"
    ip 202.96.1.5 202.96.1.10
  exit
  nat rule "office-snat-rule"
    from trust to untrust
    source "office-net"
    destination any
    action source-nat pool "office-snat"
  exit

  # 需求2: 服务器区固定SNAT
  nat rule "server-snat-rule"
    from trust to untrust
    source "server-net"
    destination any
    action source-nat ip 202.96.1.2
  exit

  # 需求3: Web服务器DNAT
  nat server "web-server"
    interface ethernet0/1
    protocol tcp
    external-ip 202.96.1.3
    external-port 80
    internal-ip 172.16.1.10
    internal-port 80
  exit

  # 需求4: 邮件服务器DNAT
  nat server "mail-server"
    interface ethernet0/1
    protocol tcp
    external-ip 202.96.1.3
    external-port 25
    internal-ip 172.16.1.20
    internal-port 25
  exit
exit
```

### 实验3：故障模拟与排错

```
# 场景：用户反馈无法访问DMZ的Web服务器

# 排错步骤：
# Step 1: 从防火墙ping Web服务器，确认网络连通性
ping 172.16.1.10
# 期望：能ping通

# Step 2: 检查安全策略是否允许
show policy from untrust to dmz
# 期望：能看到匹配"internet-to-dmz-web"的策略

# Step 3: 检查DNAT是否配置正确
show nat server
# 期望：能看到web-server的DNAT配置

# Step 4: 检查会话表
show session dst-ip 172.16.1.10
# 期望：能看到来自外网的访问会话

# Step 5: 如果没有会话记录，检查是否被IPS拦截
show ips event dst-ip 172.16.1.10
# 期望：查看是否有IPS阻断记录

# Step 6: 如果IPS有阻断记录但误判，创建例外
config
  ips exception
    dst-ip 172.16.1.10
    signature-id 12345  # 误判的签名ID
  exit
exit

# Step 7: 实时查看日志，帮助定位问题
# 开启终端监控（类似tail -f）
show log traffic dst-ip 172.16.1.10 real-time
```

---

## 八、山石网科 vs 深信服：深度对比

这是网络安全选型中最常见的对比之一。两者虽然都叫"NGFW"，但设计理念和适用场景差异很大。

### 8.1 技术路线对比

```
山石网科技术路线：
  传统防火墙基因 → 叠加NGFW功能 → 保持硬件转发优势
  ┌──────────────────────────────────────────┐
  │ 核心信念：                                  │
  │ "防火墙首先必须是一台好的防火墙"              │
  │ → 稳定、高性能、低延迟是第一位              │
  │ → 安全功能是锦上添花，但不能影响转发性能      │
  └──────────────────────────────────────────┘

深信服技术路线：
  应用交付/上网行为管理基因 → 叠加防火墙功能 → 应用层识别优势
  ┌──────────────────────────────────────────┐
  │ 核心信念：                                  │
  │ "防火墙应该理解应用，而不只是理解网络"        │
  │ → 应用识别、内容过滤是第一位                │
  │ → 网络转发是基础能力，但不追求极致性能        │
  └──────────────────────────────────────────┘
```

### 8.2 关键维度打分

| 维度 | 山石网科 | 深信服 | 说明 |
|------|----------|--------|------|
| 网络层性能 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 山石自研芯片，深信服x86 |
| 应用识别 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 深信服起家就是做应用识别的 |
| 稳定性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 山石金融级，深信服企业级 |
| VPN能力 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 山石IPSec/SSL均强 |
| IPS能力 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 不相上下 |
| 内容安全 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 深信服URL过滤/数据防泄漏强 |
| 易用性 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 深信服WebUI更友好 |
| 价格 | ⭐⭐⭐ | ⭐⭐⭐⭐ | 山石略贵（硬件芯片成本） |
| 生态 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 深信服产品矩阵更广 |

### 8.3 选型建议

```
选择山石网科，如果：
  ✓ 你是金融行业（银行/证券/保险）
  ✓ 对网络延迟有严格要求（交易系统）
  ✓ 需要处理大吞吐量（>10Gbps）
  ✓ 需要电信级稳定性（99.999%）
  ✓ 网络拓扑复杂（多出口、多VPN、多安全域）
  ✓ 对合规审计有严格要求

选择深信服，如果：
  ✓ 你是一般企业（制造业/零售/教育）
  ✓ 对应用层安全要求高（上网行为管理）
  ✓ 需要一体化方案（防火墙+上网行为+VPN+EDR）
  ✓ 对部署便捷性要求高
  ✓ 有移动办公/远程办公需求
  ✓ 预算有限，追求性价比
```

---

## 九、金融行业选型深度分析

### 9.1 金融行业对防火墙的特殊要求

银行的网络安全与普通企业有本质区别。以下是金融行业特有的要求：

```
1. 监管合规
   ├─ 《商业银行信息科技风险管理指引》
   ├─ 等保三级（核心系统必须达到）
   ├─ PCI-DSS（如果有卡支付业务）
   └─ 银监会/证监会/保监会各自的行业监管要求

2. 性能要求
   ├─ 核心交易系统的网络延迟必须 < 1ms
   ├─ 防火墙不能成为瓶颈（吞吐量 > 实际峰值的2倍）
   └─ 会话并发数必须支持峰值交易量

3. 可靠性要求
   ├─ 可用性 ≥ 99.999%（年停机时间 < 5.26分钟）
   ├─ HA切换时间 < 3秒
   └─ 支持在线升级（不能因升级导致停机）

4. 审计要求
   ├─ 所有策略变更必须可追溯
   ├─ 日志保留 ≥ 180天（等保三级要求）
   └─ 支持与SIEM/SOC平台对接
```

### 9.2 山石在金融行业的典型案例架构

```
┌─────────────────────────────────────────────────────┐
│                   某商业银行安全架构                     │
├─────────────────────────────────────────────────────┤
│                                                       │
│   Internet ──→ 抗DDoS ──→ 山石X系列(HA) ──→ 核心交换  │
│                              │                        │
│                    ┌─────────┼─────────┐              │
│                    │         │         │              │
│                  网银区    核心交易区  办公区            │
│                    │         │         │              │
│              山石T系列  山石T系列  山石E系列             │
│              (HA)      (HA)      (HA)                 │
│                    │         │         │              │
│                 服务器     服务器    办公终端            │
│                                                       │
│  外联区：                                              │
│  银联专线 ──→ 山石E系列 ──→ 核心交换                    │
│  人行专线 ──→ 山石E系列 ──→ 核心交换                    │
│  第三方支付 ──→ 山石E系列 ──→ 核心交换                   │
│                                                       │
│  分支行互联：                                           │
│  总行山石T系列 ──→ IPSec VPN ──→ 各分行山石E系列         │
│                                                       │
│  统一管理平台：                                         │
│  山石HSM安全管理平台（集中管理所有防火墙）                │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### 9.3 金融合规策略配置示例

```
# 等保三级对防火墙的要求之一：访问控制粒度到端口级
# 以下配置满足"最小权限原则"

# 定义不同业务的安全级别
config
  # 核心交易区：最高安全级别
  zone "core-trading"
    security-level 100
    description "核心交易系统区域"
  exit

  # 网银区：高安全级别
  zone "web-banking"
    security-level 90
    description "网上银行服务区域"
  exit

  # 办公区：中安全级别
  zone "office"
    security-level 50
    description "办公区域"
  exit

  # 互联网：最低安全级别
  zone "internet"
    security-level 5
    description "互联网区域"
  exit

  # 策略：核心交易区与网银区之间的访问
  # 只允许特定端口、特定IP之间的通信
  policy 100
    name "core-trading-to-web-banking"
    from "core-trading"
    to "web-banking"
    source "trading-app-server"      # 只有交易应用服务器
    destination "banking-api-server"  # 只有网银API服务器
    service "tcp-8080"                # 只有业务端口8080
    application "http"                # 只允许HTTP协议
    action permit
    log enable
    # 所有匹配此策略的流量都要经过IPS检测
    profile ips "financial-strict-protection"
  exit

  # 合规审计要求：拒绝的流量也要记录日志
  policy 9999
    name "default-deny-logging"
    from any to any
    source any
    destination any
    service any
    action deny
    log enable  # 等保三级要求记录所有拒绝的访问
  exit
exit
```

---

## 十、知识扩展

### 10.1 防火墙技术的演进历史

```
第一代：包过滤防火墙（1988-）
  └─ 只能基于IP/端口做简单的允许/拒绝
  └─ 不关心连接状态，不知道这个包属于哪个连接
  └─ 代表：Cisco ACL

第二代：状态检测防火墙（1995-）
  └─ 维护会话表，知道哪些包属于已建立的连接
  └─ 首包需要匹配策略，后续包直接查会话表
  └─ 代表：Check Point, 早期山石

第三代：应用层防火墙/代理防火墙（2000-）
  └─ 能够理解HTTP/SMTP/FTP等协议
  └─ 可以做深度内容过滤
  └─ 代表：Blue Coat（代理型）

第四代：下一代防火墙NGFW（2009-）
  └─ Gartner在2009年提出NGFW概念
  └─ 融合：传统防火墙 + IPS + 应用识别
  └─ 代表：Palo Alto, 山石, 深信服

第五代：云原生防火墙/防火墙即服务（2018-）
  └─ 虚拟化/容器化部署
  └─ 支持云环境的弹性伸缩
  └─ 代表：云防火墙（阿里云/腾讯云/AWS Network Firewall）
```

### 10.2 防火墙选型的常见误区

```
误区1: "吞吐量越大越好"
  真相：99%的企业实际流量远低于标称吞吐量。更重要的是：
  - 小包性能（64字节小包的吞吐量通常远低于1518字节大包）
  - 开启IPS/AV后的性能衰减
  - 并发会话数（比吞吐量更容易成为瓶颈）

误区2: "功能越多越好"
  真相：每个开启的功能都会消耗性能。
  安全是在"风险"和"成本"之间找平衡，不是功能越多越安全。
  一个只开启必要功能的简洁策略，比一个复杂但维护不善的策略更安全。

误区3: "国产的比国外的差"
  真相：在网络层防火墙这个领域，国产防火墙（山石、深信服、H3C）
  的性能已经完全不输国外产品，而且在合规、本地化服务方面有明显优势。

误区4: "买了防火墙就安全了"
  真相：防火墙只是安全体系的其中一环。一个完整的安全体系需要：
  防火墙(NGFW) + WAF + IPS + EDR + SIEM + 渗透测试 + 安全培训
  防火墙解决的是"边界安全"，但80%的攻击来自内部或被加密绕过。
```

### 10.3 推荐学习资源

```
官方资源：
  - 山石网科官网文档中心：产品手册、配置指南、最佳实践
  - 山石网科技术社区：案例分享、技术问答

认证体系：
  - HCSA（Hillstone Certified Security Associate）：初级认证
  - HCSP（Hillstone Certified Security Professional）：专业级认证
  - HCSE（Hillstone Certified Security Expert）：专家级认证

实践建议：
  - EVE-NG/GNS3搭建虚拟实验环境
  - 山石提供虚拟化版本用于学习和测试
  - 关注金融行业的实际案例和监管要求
```

---

## 十一、本日验收

### 概念理解题

1. 山石网科为什么在金融行业市占率高？请从硬件架构和稳定性两个角度分析。

2. StoneOS的"控制平面与数据平面分离"设计有什么好处？在什么场景下这个设计特别重要？

3. NGFW的"首包慢，后续包快"是什么意思？背后的原理是什么？

### 配置实操题

4. 请写出以下场景的StoneOS配置命令：
   - 内网10.1.1.0/24允许访问互联网的HTTP/HTTPS/DNS
   - 互联网允许访问DMZ区172.16.1.10的80和443端口
   - 内网管理员10.1.1.100可以通过SSH管理DMZ区所有服务器

5. 某银行需要配置IPSec VPN连接总部和分行，请写出两端的IKE和IPSec关键参数（不需要完整配置，列出必须一致的参数即可）。

### 对比分析题

6. 请制作一张对比表格，比较山石网科和深信服在以下维度的差异：
   - 硬件架构
   - 核心优势
   - 适用场景
   - 金融行业适用性
   - 价格区间

7. 一个电商企业和一个银行，对防火墙的需求有什么不同？你会分别推荐哪个品牌？

### 综合思考题

8. 某银行的核心交易系统最近出现间歇性网络延迟，怀疑是防火墙性能瓶颈。作为安全工程师，你应该如何排查？请列出排查步骤和使用的命令。

---

## 十二、答案与解析

### 概念理解题答案

**题1答案：**
山石网科在金融行业市占率高的核心原因：

1. **硬件架构优势**：山石使用自研安全芯片而非通用x86架构。安全芯片可以在硬件层面处理报文转发和会话匹配，延迟是纳秒级的。对于金融交易系统来说，每增加1ms延迟都可能造成价格滑点。x86架构的CPU存在上下文切换开销，在高负载下延迟会抖动。

2. **稳定性优势**：金融行业要求99.999%的可用性（年停机时间<5.26分钟）。山石从设计之初就以电信级稳定性为目标，控制平面和数据平面分离确保管理操作不影响转发，HA切换时间<3秒。这些指标是经过大量金融机构生产环境验证的。

**题2答案：**
控制平面与数据平面分离的好处：
- **性能隔离**：管理操作（如导出日志、生成报表）不会影响数据包转发性能
- **安全隔离**：即使管理平面被攻击（如WebUI漏洞），数据平面仍然可以正常工作
- **独立扩展**：两个平面可以独立升级和维护

特别重要的场景：金融行业的生产环境。在进行安全审计时，审计人员可能需要导出大量历史日志，如果没有平面分离，这个操作可能导致交易延迟增加。

**题3答案：**
"首包慢，后续包快"是NGFW会话管理的核心机制：
- **首包（慢路径）**：需要经过完整的策略匹配流程（匹配安全域、地址、服务、应用、IPS检测等），创建会话表项
- **后续包（快路径）**：直接查会话表（Hash查找，纳秒级），跳过所有策略匹配

一个HTTP请求通常包含几十到几百个包，只有第一个包走慢路径，后续99%+的包都走快路径。这就是为什么即使策略很复杂，整体转发性能仍然很高的原因。

### 配置实操题答案

**题4答案：**
```
config
  address "office-net" ip 10.1.1.0/24
  address "dmz-web" ip 172.16.1.10/32
  address "dmz-net" ip 172.16.1.0/24
  address "admin-host" ip 10.1.1.100/32
  
  service "web" protocol tcp port 80 port 443
  service "internet" protocol tcp port 80 port 443; protocol udp port 53

  policy 10 name "office-internet" from trust to untrust
    source "office-net" destination any service "internet" action permit log enable

  policy 20 name "internet-dmz-web" from untrust to dmz
    source any destination "dmz-web" service "web" action permit log enable

  policy 30 name "admin-ssh-dmz" from trust to dmz
    source "admin-host" destination "dmz-net" service tcp/22 action permit log enable
exit
```

**题5答案：**
IPSec VPN两端必须一致的参数：
- IKE阶段1：加密算法(aes-256)、认证算法(sha256)、DH组(14)、预共享密钥
- IPSec阶段2：ESP加密算法(aes-256)、ESP认证算法(sha256)、PFS DH组(14)
- 感兴趣流（源目地址，注意两端是镜像关系）

### 对比分析题答案

**题6答案：** 见上文第八章的完整对比表。

**题7答案：**
- **电商企业**：更关注应用层安全（防止Web攻击、CC攻击、数据泄露），需要WAF能力，对网络层延迟要求相对宽松。推荐深信服（应用识别强）或直接使用云WAF。
- **银行**：更关注网络层稳定性和合规性，需要严格的访问控制、完整的审计日志、99.999%的可用性。推荐山石网科（金融行业验证过的稳定性）。

### 综合思考题答案

**题8答案：**
排查步骤：
1. 检查防火墙CPU和内存使用率：`show cpu`、`show memory`
2. 检查会话表大小：`show session count`（是否接近最大并发会话数）
3. 检查接口带宽利用率：`show interface ethernet0/0`
4. 检查是否有大量丢包：`show interface ethernet0/0 statistics`
5. 检查IPS/AV引擎是否造成延迟：`show ips statistics`
6. 实时查看日志：`show log system real-time`
7. 检查是否有异常流量：按源IP/目的IP统计TOP N流量
8. 如果确认是性能瓶颈，考虑：升级硬件、优化策略（减少不必要的IPS检测）、增加带宽、使用bypass功能

---

> **今日小结**：山石网科是边界安全领域的"专业选手"，以自研安全芯片和金融行业深度积累为核心竞争力。与深信服相比，山石更像"钢筋混凝土大门"——厚重、稳定、可靠；深信服更像"智能门禁系统"——灵活、智能、功能丰富。理解两者的差异，是安全选型的基本功。

> **明日预告**：DAY 46 · 山石网科云鉴威胁检测与阶段总结 —— 我们将了解山石在云安全领域的产品布局，并对第一层和第二层的学习进行阶段性回顾。
