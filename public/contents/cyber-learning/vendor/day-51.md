# DAY 51 · 新华三 H3C SecPath 防火墙 —— 政企安全主力

> **产品**：SecPath NGFW（F1000中小企业 / F5000大中型 / F10000数据中心）
> **学习目标**：了解H3C在政企安全市场的定位、掌握SecPath防火墙产品体系、理解H3C"网络+安全"一体化优势
> **背景**：中国政企网络双寡头之一（H3C + 华为）
> **核心对比**：H3C vs 华为 vs 深信服 —— H3C教育/医疗强，华为运营商/金融强，深信服企业强
> **验收**：了解H3C政企市场定位、理解SecPath产品分级

---

## 一、开篇概述：政企网络的"半壁江山"

### 1.1 H3C是谁？

新华三集团（H3C）是中国网络设备市场的"双寡头"之一，与华为共同占据了中国政企网络市场的大部分份额。如果说华为是中国网络设备的"一哥"，那H3C就是紧追不舍的"二哥"。

H3C的历史有点复杂但非常有意思：

```
H3C的历史沿革：

2003年：华为与美国3Com公司合资成立华为3Com（H3C的前身）
  └─ 华为出技术，3Com出海外渠道

2006年：3Com收购华为持有的全部股份，H3C成为3Com全资子公司
  └─ 开始独立发展

2010年：HP收购3Com，H3C成为HP子公司
  └─ 获得HP的全球渠道和品牌背书

2015年：紫光集团收购HP持有的H3C 51%股份，"新华三"成立
  └─ 正式回归中资控股

2016年至今：新华三在政企市场快速发展
  └─ 交换机/路由器/WLAN市场份额稳居前二
  └─ 安全产品线（SecPath）快速发展
```

这段历史解释了H3C的一个独特优势：**它既有华为的技术基因（早期源自华为），又有国际化的视野和经验（经历过3Com和HP时代），同时还是中资控股（紫光集团）**。

### 1.2 H3C在安全市场的定位

```
H3C的安全市场策略：

"网络+安全"一体化
  ├─ 核心逻辑：客户买了H3C的网络设备，自然也会考虑H3C的安全设备
  ├─ 就像你买了iPhone，自然更倾向于买AirPods（生态绑定）
  └─ H3C在中国政企网络市场有巨大的存量客户

市场侧重：
  ├─ 教育行业：⭐⭐⭐⭐⭐ (高校校园网几乎被H3C和华为瓜分)
  ├─ 医疗行业：⭐⭐⭐⭐⭐ (医院信息化建设主力)
  ├─ 政府行业：⭐⭐⭐⭐ (电子政务外网等)
  ├─ 企业市场：⭐⭐⭐ (大企业园区网)
  ├─ 金融行业：⭐⭐⭐ (不如山石/深信服)
  └─ 运营商：⭐⭐⭐ (不如华为/中兴)
```

### 1.3 本日学习路线

```
H3C安全产品体系 → SecPath防火墙分级 → 核心功能详解 → 网络+安全一体化 → 竞品对比 → 实操实验 → 验收
```

---

## 二、H3C安全产品体系

### 2.1 全景图

```
┌─────────────────────────────────────────────────────────────────┐
│                    H3C安全产品体系（Comware平台）                   │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│   边界安全    │   检测与审计   │   安全管理     │   安全接入           │
├──────────────┼──────────────┼──────────────┼────────────────────┤
│              │              │              │                    │
│ SecPath      │ SecPath      │ SecCenter     │ SecPath            │
│ NGFW         │ IPS          │ 安全管理平台   │ ACG                │
│ 下一代防火墙  │ 入侵防御      │              │ 应用控制网关        │
│              │              │              │                    │
│ SecPath      │ SecPath      │ SecCenter     │ iMC                │
│ WAF          │ ADC          │ 态势感知      │ 智能管理平台        │
│ Web应用防火墙 │ 应用交付      │              │ (含安全组件)        │
│              │              │              │                    │
│ SecPath      │ SecPath      │ SecPath       │ EAD                │
│ VPN          │ AVG          │ 堡垒机        │ 终端准入控制        │
│ VPN网关      │ 防病毒网关    │              │                    │
│              │              │              │                    │
│ SecBlade     │              │              │                    │
│ 安全插卡      │              │              │                    │
│ (交换机集成)  │              │              │                    │
└──────────────┴──────────────┴──────────────┴────────────────────┘
```

### 2.2 Comware —— H3C的"灵魂"操作系统

H3C的所有网络和安全产品都运行在同一个操作系统上——**Comware**（简称Comware，意为"Communication Software"）。

```
Comware的特点：

1. 统一平台
   ├─ 所有H3C设备（交换机、路由器、防火墙、WLAN）运行同一操作系统
   ├─ 命令行界面（CLI）完全一致
   ├─ 网络工程师学一次，所有设备都会配
   └─ 这也是H3C"网络+安全"一体化的基础

2. 模块化架构
   ├─ Comware采用模块化设计
   ├─ 不同产品加载不同的功能模块
   ├─ 交换机加载交换模块，防火墙加载安全模块
   └─ 内核一致，功能可按需组合

3. 丰富的网络协议支持
   ├─ 路由协议：OSPF、BGP、IS-IS、RIP、静态路由
   ├─ 交换协议：STP、VLAN、Trunk、LACP
   ├─ MPLS、VXLAN、EVPN等数据中心网络协议
   └─ H3C防火墙本质上是一台"带安全功能的路由器"

4. 配置风格
   ├─ 类Cisco的命令行风格
   ├─ 熟悉Cisco/H3C/华为命令的工程师可以快速上手
   └─ 配置逻辑清晰，层次分明
```

---

## 三、SecPath NGFW 产品分级详解

### 3.1 产品分级逻辑

H3C的SecPath防火墙按照性能和适用场景分为三个主要系列：

```
┌─────────────────────────────────────────────────────────────┐
│                  SecPath NGFW 产品分级                        │
├───────────────┬───────────────┬───────────────┬─────────────┤
│   F1000系列    │   F5000系列    │   F10000系列   │  vFW系列    │
│   中小企业      │   大中型企业    │   数据中心      │  虚拟化     │
├───────────────┼───────────────┼───────────────┼─────────────┤
│               │               │               │             │
│ 防火墙吞吐：    │ 防火墙吞吐：    │ 防火墙吞吐：    │ 按需分配     │
│ 1-40 Gbps    │ 20-200 Gbps  │ 200+ Gbps    │             │
│               │               │               │             │
│ 并发连接：      │ 并发连接：      │ 并发连接：      │ 按需分配     │
│ 50万-500万    │ 500万-5000万  │ 5000万-2亿    │             │
│               │               │               │             │
│ 新建连接速率：   │ 新建连接速率：   │ 新建连接速率：   │             │
│ 1万-10万/秒   │ 10万-50万/秒  │ 50万-200万/秒 │             │
│               │               │               │             │
│ 适用场景：      │ 适用场景：      │ 适用场景：      │ 适用场景：    │
│ 分支/门店      │ 企业总部        │ 数据中心出口    │ 云环境       │
│ 中小学校       │ 大学校园网      │ 大型园区核心    │ 多租户       │
│ 小型医院       │ 三级医院        │ 运营商IDC      │ 测试环境     │
│ 政府委办局     │ 省级政府        │ 省级运营商      │ 分支虚拟化   │
└───────────────┴───────────────┴───────────────┴─────────────┘
```

### 3.2 F1000系列 —— 中小企业的"入门之选"

```
F1000系列定位：中小型组织的边界防火墙

典型型号：
  F1000-AI-10：桌面级，适合小型办事处（吞吐1Gbps）
  F1000-AI-20：1U设备，适合中小企业总部（吞吐5Gbps）
  F1000-AI-30：1U设备，适合中型企业（吞吐10Gbps）
  F1000-AI-55：1U设备，适合中型企业多出口（吞吐20Gbps）
  F1000-AI-75：1U设备，适合大型分支（吞吐40Gbps）

典型部署场景：
  某中学的校园网出口：
  
    ISP 1 (电信)    ISP 2 (联通)
        │              │
        └──────┬───────┘
               │
        ┌──────┴──────┐
        │  F1000-AI-30 │
        │  (双链路负载均衡)│
        └──────┬──────┘
               │
        ┌──────┴──────┐
        │   核心交换机  │
        └──────┬──────┘
         ┌─────┼─────┐
         ▼     ▼     ▼
       教学楼  办公楼  宿舍
```

### 3.3 F5000系列 —— 大中型组织的"主力军"

```
F5000系列定位：大中型企业和机构的边界与核心安全

典型型号：
  F5000-AI-20：2U设备，适合大型企业总部（吞吐40Gbps）
  F5000-AI-40：2U设备，适合大型园区（吞吐100Gbps）
  F5000-AI-60：4U设备，适合超大型企业（吞吐200Gbps）

技术特点：
  ├─ 支持硬件冗余（双电源、双主控）
  ├─ 支持接口扩展（可插拔接口卡）
  ├─ 支持安全业务模块（IPS/AV/ACG插卡）
  └─ 支持40GE/100GE高速接口

典型部署场景：
  某三甲医院的网络安全架构：
  
    Internet ──→ 抗DDoS ──→ F5000-AI-40(HA) ──→ 核心交换
                                  │
                  ┌───────────────┼───────────────┐
                  │               │               │
                 HIS系统        PACS影像       互联网区
              (核心业务)      (医学影像)      (办公上网)
                  │               │               │
              F1000-AI-30    F1000-AI-20    F1000-AI-20
              (内网隔离)     (内网隔离)     (上网行为管理)
```

### 3.4 F10000系列 —— 数据中心的"旗舰"

```
F10000系列定位：超大规模数据中心和运营商核心

典型型号：
  F10000-AI-50：框式设备，数据中心出口（吞吐400Gbps）
  F10000-AI-80：框式设备，运营商核心（吞吐800Gbps+）

技术特点：
  ├─ 机框式架构（类似大型路由器）
  ├─ 主控板+交换网板+业务板的模块化设计
  ├─ 控制平面与数据平面完全分离
  ├─ 支持100GE/400GE高速接口
  ├─ 硬件级冗余（主控1+1、交换网1+1、电源N+1）
  └─ 支持多框集群（多台设备虚拟为一台）

典型部署场景：
  某省电子政务外网安全平台：
  
    国家电子政务外网 ──→ F10000-AI-50 ──→ 省级核心路由
                             │
            ┌────────────────┼────────────────┐
            │                │                │
       地市政务网        省级委办局        互联网出口
       F5000-AI-40     F5000-AI-40     F5000-AI-60
```

---

## 四、SecPath NGFW 核心功能

### 4.1 安全策略（Security Policy）

H3C SecPath的安全策略体系与其他NGFW类似，但由于Comware的网络基因，它在策略管理上更加灵活：

```
# H3C SecPath 安全策略配置

# 第一步：定义安全域
security-zone name trust
  import interface GigabitEthernet1/0/1
  import interface GigabitEthernet1/0/2

security-zone name untrust
  import interface GigabitEthernet1/0/3

security-zone name dmz
  import interface GigabitEthernet1/0/4

# 第二步：定义地址对象组
object-group ip address internal-net
  network subnet 10.1.1.0 255.255.255.0
  network subnet 10.1.2.0 255.255.255.0

object-group ip address dmz-servers
  network host 172.16.1.10
  network host 172.16.1.20

# 第三步：定义服务对象组
object-group service web-services
  service tcp destination eq 80
  service tcp destination eq 443

# 第四步：创建安全策略
security-policy ip
  rule 10 name internal-to-internet
    action pass
    source-zone trust
    destination-zone untrust
    source-ip internal-net
    destination-ip any
    service web-services
    service dns
    logging enable
    application-detection enable
    ips apply policy default-ips

  rule 20 name internet-to-dmz
    action pass
    source-zone untrust
    destination-zone dmz
    source-ip any
    destination-ip dmz-servers
    service web-services
    logging enable
    ips apply policy web-protection

  rule 9999 name default-deny
    action deny
    logging enable
```

### 4.2 NAT功能

H3C的NAT功能继承了其路由器的强大基因，支持各种复杂的NAT场景：

```
# 基础源NAT（内网上网）
nat policy
  rule name office-snat
    source-zone trust
    destination-zone untrust
    source-ip internal-net
    action source-nat easy-ip    # 使用出接口IP做SNAT

# 地址池NAT（多个公网IP）
nat address-group 1
  address 203.0.113.10 203.0.113.20

nat policy
  rule name office-snat-pool
    source-zone trust
    destination-zone untrust
    source-ip internal-net
    action source-nat address-group 1

# 目的NAT（端口映射）
nat server protocol tcp global 203.0.113.5 80 inside 172.16.1.10 80
nat server protocol tcp global 203.0.113.5 443 inside 172.16.1.10 443

# NAT Server（一对一映射）
nat static mapping
  global-ip 203.0.113.6
  inside-ip 172.16.1.20

# NAT日志（合规要求）
nat log enable
nat log flow-active 30    # 每30分钟记录活跃NAT会话
```

### 4.3 VPN功能

作为网络设备厂商，H3C的VPN功能非常强大：

```
# IPSec VPN 配置（站点到站点）

# IKE Proposal
ike proposal 1
  encryption-algorithm aes-cbc-256
  authentication-algorithm sha256
  dh group14

# IKE Peer
ike peer branch
  proposal 1
  pre-shared-key cipher YourSecureKey@2024!
  remote-address 203.0.113.10

# IPSec Proposal
ipsec proposal 1
  encapsulation-mode tunnel
  transform esp
  esp encryption-algorithm aes-cbc-256
  esp authentication-algorithm sha256

# IPSec Policy
ipsec policy branch-policy 10 isakmp
  proposal 1
  ike-peer branch
  security acl 3000

# ACL 定义感兴趣流
acl advanced 3000
  rule 0 permit ip source 10.1.0.0 0.0.255.255 destination 192.168.1.0 0.0.0.255

# 应用到接口
interface GigabitEthernet1/0/3
  ipsec apply policy branch-policy

# SSL VPN 配置
sslvpn gateway gateway1
  ip address 203.0.113.1
  port 4430

sslvpn context context1
  gateway gateway1
  ip-tunnel interface SSLVPN-AC1
  ip-tunnel address-pool sslvpn-pool
  policy-group policy1
    filter ip-tunnel acl 3001
    ip-tunnel access-route ip-route-list route1

# L2TP VPN 配置
l2tp-group 1
  tunnel name LNS
  allow l2tp virtual-template 1
```

### 4.4 应用识别与URL过滤

```
# 应用识别（APR - Application Recognition）
application-detection enable

# URL过滤
url-filter policy url-policy1
  # 白名单（允许访问的URL类别）
  category business-and-economy action permit
  category search-engines action permit
  category web-based-email action permit
  
  # 黑名单（禁止访问的URL类别）
  category adult-and-pornography action deny
  category gambling action deny
  category violence-and-hate action deny
  category illegal-drugs action deny
  
  # 自定义URL
  url www.example-blocked.com action deny
  
  # 默认动作
  default-action permit
  logging enable

# 在安全策略中引用URL过滤
security-policy ip
  rule 30 name office-internet-filter
    action pass
    source-zone trust
    destination-zone untrust
    source-ip internal-net
    url-filter apply policy url-policy1
```

### 4.5 高可用（HA）

```
# H3C SecPath HA配置（主备模式）

# 主墙配置
session synchronization enable
session synchronization dns http

# HA配置
high-availability group 1
  # 配置HA接口（心跳线+数据同步）
  bind interface GigabitEthernet1/0/5  # 心跳接口
  bind interface GigabitEthernet1/0/6  # 数据同步接口
  
  # 优先级（数值越大越优先）
  priority 200
  
  # 抢占模式
  preemption enable
  preemption delay 300  # 5分钟后才抢占
  
  # 监控接口（任一down触发切换）
  track interface GigabitEthernet1/0/1
  track interface GigabitEthernet1/0/2
  track interface GigabitEthernet1/0/3

# 备墙配置（除priority外与主墙相同）
high-availability group 1
  bind interface GigabitEthernet1/0/5
  bind interface GigabitEthernet1/0/6
  priority 100  # 备墙优先级较低
  preemption enable
  preemption delay 300
  track interface GigabitEthernet1/0/1
  track interface GigabitEthernet1/0/2
  track interface GigabitEthernet1/0/3
```

---

## 五、"网络+安全"一体化优势

### 5.1 什么是"网络+安全"一体化？

这是H3C最核心的竞争策略。它不是简单地把网络设备和安全设备放在一起卖，而是从产品设计层面就考虑了协同：

```
传统方案（异构）：
  路由器（厂商A）+ 交换机（厂商A）+ 防火墙（厂商B）
  
  问题：
  ├─ 配置语言不同（学两套命令行）
  ├─ 管理平台不同（登录两个管理系统）
  ├─ 策略协同困难（网络策略和安全策略容易冲突）
  ├─ 排错复杂（出问题时不知道是哪层的问题）
  └─ 采购和维保复杂（和多个厂商打交道）

H3C一体化方案：
  路由器 + 交换机 + 防火墙 = 全部H3C + 全部Comware
  
  优势：
  ├─ 统一CLI（配置语言一致）
  ├─ 统一管理平台（iMC智能管理中心）
  ├─ 策略协同（网络和安全策略自动协调）
  ├─ 排错简单（iMC可以端到端可视化）
  └─ 采购和维保简单（只和一个厂商打交道）
```

### 5.2 典型一体化场景

#### 场景1：校园网"入网即安全"

```
某大学的校园网安全架构（H3C全系列）：

学生终端 ──→ H3C接入交换机 ──→ H3C核心交换机 ──→ H3C SecPath NGFW ──→ Internet
                │                      │
                │                      │
            iMC平台自动检测：       SecCenter监控：
            ├─ 终端是否合规？       ├─ 流量是否异常？
            ├─ 杀毒软件是否安装？   ├─ 是否有攻击？
            ├─ 系统补丁是否最新？   ├─ 带宽使用情况？
            └─ 不合规 → 自动隔离   └─ 异常 → 自动告警

流程：
1. 学生连接校园网
2. 接入交换机通过802.1X认证学生身份
3. iMC EAD检查终端合规性
4. 合规 → 放行到核心网络
5. 核心交换机根据用户角色下发VLAN和ACL
6. SecPath NGFW对出网流量进行安全检测
7. SecCenter统一监控和展示

→ 全流程自动化，H3C设备之间无缝协同
```

#### 场景2：医院"内外网融合安全"

```
某三甲医院的H3C全系列安全架构：

外网用户访问医院官网：
  Internet → SecPath NGFW → SecPath WAF → Web服务器

医生远程访问HIS系统：
  医生终端 → SSL VPN → SecPath NGFW → 核心交换机 → HIS服务器
  ├─ iMC验证医生身份（LDAP/AD集成）
  ├─ EAD检查终端合规性
  └─ SecPath NGFW做访问控制

院内科室互访：
  门诊终端 → H3C接入交换机 → H3C核心交换机 → 住院部服务器
  ├─ 核心交换机根据用户角色做VLAN隔离
  └─ SecPath NGFW做东西向流量控制

→ 内外网融合访问，安全策略一致，管理平台统一
```

### 5.3 iMC智能管理平台

iMC（Intelligent Management Center）是H3C的统一管理平台，是实现"网络+安全"一体化的关键：

```
iMC的核心能力：

1. 统一设备管理
   ├─ 管理所有H3C设备（交换机、路由器、防火墙、WLAN、安全设备）
   ├─ 自动发现拓扑
   ├─ 配置备份和恢复
   └─ 固件批量升级

2. 统一策略管理
   ├─ 网络策略（VLAN、ACL、QoS）
   ├─ 安全策略（防火墙规则、NAT、VPN）
   └─ 策略冲突检测

3. 统一监控告警
   ├─ 设备性能监控（CPU、内存、流量）
   ├─ 链路质量监控（延迟、丢包、抖动）
   ├─ 安全事件监控（攻击告警、异常流量）
   └─ 自定义告警规则

4. 统一报表分析
   ├─ 网络流量报表
   ├─ 安全事件报表
   ├─ 合规审计报表
   └─ 自定义报表

5. 终端准入控制（EAD）
   ├─ 终端身份认证（802.1X、Portal、MAC）
   ├─ 终端安全合规检查（补丁、杀毒、软件）
   └─ 不合规终端自动隔离和修复
```

---

## 六、H3C vs 华为 vs 深信服 —— 三角对比

### 6.1 三者的市场定位

```
         H3C                     华为                   深信服
         ────                    ────                   ────
基因：    网络设备                   网络设备                 安全/应用交付
         (源自华为)                (全球通信巨头)           (上网行为管理起家)

核心优势：教育/医疗行业深耕        运营商/金融/大企业        企业级安全方案
         网络+安全一体化           端到端ICT方案            应用层安全

安全产品：SecPath全系列            HiSec全系列             下一代防火墙
         (中规中矩)               (自研芯片/芯片级)        (应用识别最强)

目标客户：高校/医院/政府           运营商/金融/大企业        各类企业
         网络存量客户             全球500强                中小企业

价格定位：中等                     中高                      中低
```

### 6.2 行业覆盖对比

```
行业         H3C       华为      深信服     说明
────         ───       ────     ────      ────
教育        ⭐⭐⭐⭐⭐  ⭐⭐⭐⭐   ⭐⭐⭐     H3C教育行业第一
医疗        ⭐⭐⭐⭐⭐  ⭐⭐⭐⭐   ⭐⭐⭐     H3C医疗行业领先
政府        ⭐⭐⭐⭐    ⭐⭐⭐⭐   ⭐⭐⭐⭐   势均力敌
企业        ⭐⭐⭐      ⭐⭐⭐     ⭐⭐⭐⭐⭐ 深信服企业市场最强
金融        ⭐⭐⭐      ⭐⭐⭐⭐   ⭐⭐⭐⭐   华为/深信服更强
运营商      ⭐⭐⭐      ⭐⭐⭐⭐⭐ ⭐⭐      华为运营商垄断地位
互联网      ⭐⭐        ⭐⭐⭐     ⭐⭐⭐⭐   深信服更适合
```

### 6.3 选型建议

```
选择H3C，如果：
  ✓ 你是教育行业（高校/中小学/教育局）
  ✓ 你是医疗行业（医院/卫健委）
  ✓ 你已经使用了大量H3C网络设备（交换机/路由器/WLAN）
  ✓ 你需要"网络+安全"一体化方案
  ✓ 你对iMC统一管理有需求
  ✓ 你是政府电子政务外网项目

选择华为，如果：
  ✓ 你是运营商（移动/电信/联通）
  ✓ 你是大型金融机构（银行总行/保险公司）
  ✓ 你需要端到端的ICT方案（网络+安全+服务器+存储）
  ✓ 你对自主可控有最高要求（自研芯片）
  ✓ 你有全球化部署需求

选择深信服，如果：
  ✓ 你是一般企业（制造/零售/地产/物流）
  ✓ 你对应用层安全有高要求
  ✓ 你需要上网行为管理
  ✓ 你预算有限但需要完整的方案
  ✓ 你需要快速部署和简单的运维
```

---

## 七、实操实验

### 实验1：SecPath基础安全策略配置

**场景**：为某高校配置SecPath防火墙的基础安全策略。

```
# 网络拓扑：
# trust区（校内网络）：10.1.0.0/16
# dmz区（对外服务）：172.16.1.0/24
# untrust区（互联网）：any
# 管理区：10.100.1.0/24

# 需求：
# 1. 校内网络可以访问互联网（HTTP/HTTPS/DNS）
# 2. 互联网可以访问DMZ区的门户网站（172.16.1.10:80/443）
# 3. 管理区可以SSH管理所有设备
# 4. 校内网络不能访问DMZ区（除非明确允许）
# 5. 限制P2P下载和在线视频

# 配置步骤：

# Step 1: 配置接口和安全域
interface GigabitEthernet1/0/1
  ip address 10.1.0.1 255.255.0.0
  security-zone name trust

interface GigabitEthernet1/0/2
  ip address 172.16.1.1 255.255.255.0
  security-zone name dmz

interface GigabitEthernet1/0/3
  ip address 203.0.113.1 255.255.255.0
  security-zone name untrust

# Step 2: 定义对象组
object-group ip address campus-net
  network subnet 10.1.0.0 255.255.0.0

object-group ip address admin-net
  network subnet 10.100.1.0 255.255.255.0

object-group ip address web-server
  network host 172.16.1.10

# Step 3: 配置安全策略
security-policy ip
  # 需求1: 校内访问互联网
  rule 10 name campus-to-internet
    action pass
    source-zone trust
    destination-zone untrust
    source-ip campus-net
    destination-ip any
    service http
    service https
    service dns
    application-detection enable
    # 禁止P2P和视频（需求5）
    application app bittorrent action deny
    application app thunder action deny
    application app youku action deny
    application app iqiyi action deny
    logging enable

  # 需求2: 互联网访问门户网站
  rule 20 name internet-to-portal
    action pass
    source-zone untrust
    destination-zone dmz
    source-ip any
    destination-ip web-server
    service http
    service https
    ips apply policy web-protection
    logging enable

  # 需求3: 管理区SSH管理
  rule 30 name admin-ssh
    action pass
    source-zone trust
    destination-zone trust
    destination-zone dmz
    source-ip admin-net
    destination-ip any
    service ssh
    logging enable

  # 需求4和默认拒绝
  rule 9999 name default-deny
    action deny
    logging enable

# Step 4: 配置NAT
nat policy
  rule name campus-snat
    source-zone trust
    destination-zone untrust
    source-ip campus-net
    action source-nat easy-ip

# 配置DNAT（门户网站）
nat server protocol tcp global 203.0.113.1 80 inside 172.16.1.10 80
nat server protocol tcp global 203.0.113.1 443 inside 172.16.1.10 443
```

### 实验2：iMC统一管理配置

**场景**：将SecPath防火墙添加到iMC管理平台。

```
# Step 1: 在防火墙上配置SNMP（允许iMC监控）
snmp-agent
snmp-agent community read public
snmp-agent community write private
snmp-agent sys-info version v2c v3
snmp-agent trap enable

# Step 2: 在防火墙上配置NetStream/NetFlow（流量分析）
netstream enable
interface GigabitEthernet1/0/3
  netstream inbound
  netstream outbound

netstream export host 10.100.1.100 9996  # iMC服务器

# Step 3: 在iMC上添加设备
# 登录iMC Web界面 → 资源管理 → 添加设备
# 设备IP: 10.100.1.1 (防火墙管理IP)
# SNMP版本: v2c
# 读团体字: public
# 写团体字: private
# Telnet/SSH: 启用（用于配置管理）

# Step 4: 验证
# iMC应该能够：
# - 看到防火墙的运行状态（CPU/内存/接口流量）
# - 接收防火墙的告警（接口down、攻击事件等）
# - 对防火墙进行配置备份
# - 生成防火墙的流量报表
```

### 实验3：校园网安全方案设计

**场景**：为某高校设计一套基于H3C产品的完整安全方案。

```
┌─────────────────────────────────────────────────────────┐
│                某高校H3C安全方案                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  互联网出口（电信+联通+教育网，三链路）                    │
│           │                                             │
│    ┌──────┴──────────────────────┐                     │
│    │  SecPath F5000-AI-40 (HA)   │                     │
│    │  - 防火墙+IPS+ACG            │                     │
│    │  - 链路负载均衡              │                     │
│    └──────────────┬──────────────┘                     │
│                   │                                     │
│    ┌──────────────┴──────────────┐                     │
│    │     H3C S10500 核心交换机    │                     │
│    └──┬────────┬────────┬───────┘                     │
│       │        │        │                               │
│  ┌────┴──┐ ┌───┴───┐ ┌─┴──────┐                       │
│  │教学楼 │ │办公楼  │ │数据中心 │                       │
│  │接入交换│ │接入交换│ │        │                       │
│  │       │ │       │ │SecPath │                       │
│  │       │ │       │ │WAF     │                       │
│  │       │ │       │ │(网站   │                       │
│  │       │ │       │ │ 防护)  │                       │
│  └───────┘ └───────┘ └────────┘                       │
│                                                         │
│  iMC统一管理平台:                                        │
│  ├─ 设备管理（所有H3C设备）                              │
│  ├─ EAD终端准入（学生和教职工终端）                      │
│  ├─ SecCenter安全分析（流量和威胁监控）                  │
│  └─ 报表系统（合规审计）                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 八、知识扩展

### 8.1 中国网络设备市场格局

```
中国网络设备市场（交换机/路由器/WLAN）：

第一梯队（双寡头）：
  ├─ 华为：市场份额 ~35-40%
  └─ H3C：市场份额 ~30-35%
  → 两家合计占70%+的市场

第二梯队：
  ├─ 锐捷：教育/医疗市场较强
  ├─ 中兴：运营商市场有一定份额
  └─ 思科：外企/金融行业仍有存量

安全设备市场的差异：
  ├─ 网络设备市场份额高 ≠ 安全设备市场份额高
  ├─ H3C在网络设备市场的份额远高于安全设备市场
  └─ 但"网络+安全"一体化的策略正在帮助H3C提升安全市场份额
```

### 8.2 SecPath vs HiSec vs NGFW 的技术路线

```
H3C SecPath：                     华为 HiSec：                     深信服 NGFW：
─────────────────                ─────────────────               ─────────────────
硬件：x86 + FPGA加速               硬件：自研安全芯片                 硬件：x86服务器
OS：Comware                       OS：VRP（通用路由平台）           OS：定制Linux
网络能力：⭐⭐⭐⭐⭐              网络能力：⭐⭐⭐⭐⭐             网络能力：⭐⭐⭐
安全能力：⭐⭐⭐⭐                安全能力：⭐⭐⭐⭐               安全能力：⭐⭐⭐⭐⭐
核心优势：网络+安全一体            核心优势：自主可控+端到端          核心优势：应用识别+易用性
适用：教育/医疗/政府              适用：运营商/金融/大企业           适用：各类企业
```

---

## 九、本日验收

### 概念理解题

1. H3C SecPath防火墙分为哪三个主要系列？各自适用于什么场景？

2. 什么是Comware？它如何支撑H3C的"网络+安全"一体化战略？

3. iMC智能管理平台有哪些核心能力？

### 对比分析题

4. 请制作一张详细对比表，比较H3C、华为、深信服在以下维度的差异：
   - 市场定位
   - 核心技术优势
   - 目标行业
   - 安全产品特点
   - 价格定位

5. 某高校正在规划校园网安全升级，目前已有大量H3C网络设备（交换机/路由器/WLAN）。请设计一个基于H3C产品的安全方案，并说明选择H3C的理由。

### 配置题

6. 请写出H3C SecPath防火墙的以下配置命令：
   - 配置一个安全策略，允许内网10.1.1.0/24访问互联网的HTTP/HTTPS/DNS
   - 配置DNAT，将公网IP的443端口映射到内网172.16.1.10的443端口
   - 配置IPSec VPN的基本参数

### 综合思考题

7. "网络+安全"一体化是H3C的核心策略。请分析这种策略的优势和潜在风险。在什么情况下，企业应该选择"网络+安全"一体化方案？在什么情况下应该分开采购？

---

## 十、答案与解析

### 概念理解题答案

**题1答案：**
- F1000系列：中小企业，防火墙吞吐1-40Gbps，适合分支/门店/中小学
- F5000系列：大中型企业，防火墙吞吐20-200Gbps，适合企业总部/大学/三甲医院
- F10000系列：数据中心，防火墙吞吐200+Gbps，适合超大规模数据中心/运营商核心

**题2答案：**
Comware是H3C的统一网络操作系统，运行在所有H3C设备上（交换机、路由器、防火墙、WLAN）。它通过以下方式支撑"网络+安全"一体化：
1. 统一CLI：所有设备的配置命令一致
2. 统一管理：iMC可以管理所有H3C设备
3. 策略协同：网络和安全策略可以在同一平台协调
4. 排错便利：端到端可视化，快速定位问题

**题3答案：**
iMC的核心能力：
1. 统一设备管理（自动发现拓扑、配置备份、固件升级）
2. 统一策略管理（网络策略+安全策略、冲突检测）
3. 统一监控告警（性能监控、链路质量、安全事件）
4. 统一报表分析（流量报表、安全报表、合规报表）
5. 终端准入控制EAD（身份认证、合规检查、自动隔离）

### 对比分析题答案

**题4答案：** 见第六章的详细对比表。

**题5答案：**
推荐H3C方案的理由：
1. 存量兼容：已有大量H3C网络设备，增加H3C安全设备可以实现无缝集成
2. 统一管理：iMC可以统一管理所有网络和安全设备
3. 运维简化：一套CLI、一个管理平台，降低运维复杂度
4. 行业经验：H3C在高校市场有大量案例和最佳实践
5. 性价比：相比华为，H3C通常有更好的性价比

### 配置题答案

**题6答案：** 见第四章和实验1的完整配置示例。

### 综合思考题答案

**题7答案：**
"网络+安全"一体化的优势：
- 统一管理，运维成本低
- 策略协同，安全性更高
- 排错简单，问题定位快
- 采购简单，一个厂商搞定

潜在风险：
- 单一厂商依赖（Vendor Lock-in）
- 安全能力可能不如专业安全厂商
- 议价能力下降

应该选择一体化方案的场景：
- 安全需求不特别复杂的中型组织
- 已有大量同一厂商网络设备的组织
- 运维团队规模较小的组织

应该分开采购的场景：
- 安全需求特别复杂的组织（金融、运营商）
- 对安全有特殊要求的组织（军工、涉密单位）
- 有专业安全团队、能做多厂商集成的大型组织

---

> **今日小结**：H3C作为中国政企网络市场的双寡头之一，以"网络+安全"一体化策略在安全市场快速崛起。SecPath防火墙产品线覆盖从中小企业到超大规模数据中心的所有场景，Comware统一操作系统和iMC统一管理平台是其核心竞争力。在教育、医疗、政府行业，H3C的"网络+安全"一体化方案具有明显的竞争优势。

> **明日预告**：DAY 52 · H3C SecCenter态势感知 & 第二层总结 —— 我们将完成H3C产品体系的学习，并对第二层七厂商23产品进行全景回顾，总结第一层vs第二层的选型逻辑。
