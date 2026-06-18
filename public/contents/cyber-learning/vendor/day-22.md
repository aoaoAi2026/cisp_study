---
day: 22
title: 华为HiSec USG（下）——策略与实战
phase: 厂商产品学习
difficulty: ⭐⭐⭐ 进阶
---

# Day 22：华为HiSec USG（下）——策略与实战

> **阶段**：厂商产品学习 · 华为 | **难度**：⭐⭐⭐ 进阶 | **课时**：6-8小时

---

## 📋 今日学习目标

1. 掌握USG防火墙的CLI命令行策略配置
2. 学习华为安全区域概念（Trust/Untrust/DMZ/Local）
3. 理解USG→HiSec Insight(SIEM)→CIS(态势)的联动体系
4. 在eNSP模拟器中完成USG基本策略配置

---

## 📖 核心知识讲解

### 一、华为安全区域模型

华为防火墙安全区域的基础概念：

```
华为安全区域模型：

┌─────────────────────────────────────────────────────────────┐
│                     Huawei USG 安全区域                        │
│                                                              │
│                         ┌─────────┐                          │
│                         │  Local  │ ← 防火墙自己             │
│                         │ (本地区) │   管理接口/回环口        │
│                         └────┬────┘                          │
│                              │                               │
│    ┌─────────┐         ┌────┴────┐         ┌─────────┐      │
│    │  Trust  │ ←─────→ │  DMZ    │ ←─────→ │ Untrust │      │
│    │ (信任区) │         │ (隔离区) │         │(非信任区)│      │
│    │ 内网    │         │ 对外服务 │         │ 互联网   │      │
│    └─────────┘         └─────────┘         └─────────┘      │
│                                                              │
│  默认安全策略：                                               │
│  · Trust → Untrust：允许（内网可以访问互联网）                │
│  · Untrust → Trust：禁止（互联网不能访问内网）                │
│  · Trust → DMZ：允许（内网可以访问DMZ服务器）                 │
│  · Untrust → DMZ：需配置（互联网访问DMZ需明确放行）           │
│  · DMZ → Trust：禁止（DMZ不能主动访问内网）                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 二、CLI命令行策略配置

与深信服AF（主推Web界面）不同，华为USG支持强大的CLI命令行，这让网络工程师可以用统一的方式管理网络设备和安全设备。

#### 2.1 基础接口配置

```
<USG> system-view                      # 进入系统视图
[USG] sysname USG6600-01              # 设置设备名称

# 配置接口IP
[USG6600-01] interface GigabitEthernet 0/0/0
[USG6600-01-GigabitEthernet0/0/0] ip address 202.96.1.1 24
[USG6600-01-GigabitEthernet0/0/0] description WAN-Interface
[USG6600-01-GigabitEthernet0/0/0] quit

# 配置内网接口
[USG6600-01] interface GigabitEthernet 0/0/1
[USG6600-01-GigabitEthernet0/0/1] ip address 192.168.1.1 24
[USG6600-01-GigabitEthernet0/0/1] description LAN-Interface
[USG6600-01-GigabitEthernet0/0/1] quit
```

#### 2.2 安全区域配置

```
# 将接口加入安全区域
[USG6600-01] firewall zone untrust
[USG6600-01-zone-untrust] add interface GigabitEthernet 0/0/0
[USG6600-01-zone-untrust] quit

[USG6600-01] firewall zone trust
[USG6600-01-zone-trust] add interface GigabitEthernet 0/0/1
[USG6600-01-zone-trust] quit
```

#### 2.3 安全策略配置

```
# 策略1：允许内网访问互联网（出站）
[USG6600-01] security-policy
[USG6600-01-policy-security] rule name Trust-to-Untrust
[USG6600-01-policy-security-rule-Trust-to-Untrust] source-zone trust
[USG6600-01-policy-security-rule-Trust-to-Untrust] destination-zone untrust
[USG6600-01-policy-security-rule-Trust-to-Untrust] source-address 192.168.1.0 24
[USG6600-01-policy-security-rule-Trust-to-Untrust] action permit
[USG6600-01-policy-security-rule-Trust-to-Untrust] quit

# 策略2：允许互联网访问DMZ的Web服务器（入站，需NAT Server）
[USG6600-01-policy-security] rule name Untrust-to-DMZ-Web
[USG6600-01-policy-security-rule-Untrust-to-DMZ-Web] source-zone untrust
[USG6600-01-policy-security-rule-Untrust-to-DMZ-Web] destination-zone dmz
[USG6600-01-policy-security-rule-Untrust-to-DMZ-Web] destination-address 10.1.1.50 32
[USG6600-01-policy-security-rule-Untrust-to-DMZ-Web] service http
[USG6600-01-policy-security-rule-Untrust-to-DMZ-Web] service https
[USG6600-01-policy-security-rule-Untrust-to-DMZ-Web] action permit
[USG6600-01-policy-security-rule-Untrust-to-DMZ-Web] quit

# 策略3：配置NAT Server（端口映射）
[USG6600-01] nat server WebServer protocol tcp global 202.96.1.1 80 inside 10.1.1.50 80

# 策略4：配置威胁防护Profile
[USG6600-01] profile type ips name IPS-Default
[USG6600-01-profile-ips-IPS-Default] signature-set all
[USG6600-01-profile-ips-IPS-Default] action alert
[USG6600-01-profile-ips-IPS-Default] quit
```

### 三、华为安全联动体系

USG防火墙不是孤立的，它融入华为的安全生态：

```
华为安全产品协同：

┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  USG防火墙 ──→ HiSec Insight(态势感知) ──→ CIS(态势呈现)         │
│      │                │                       │                  │
│      │ 发送日志       │ 分析+关联              │ 大屏展示         │
│      │ 和告警         │                        │                  │
│      ▼                ▼                       ▼                  │
│  ┌────────┐    ┌─────────────┐      ┌─────────────┐             │
│  │ 流量日志│    │ AI行为分析   │      │ 攻击地图     │             │
│  │ 威胁日志│    │ 关联分析     │      │ 告警列表     │             │
│  │ 系统日志│    │ 威胁告警     │      │ 趋势图表     │             │
│  └────────┘    └─────────────┘      └─────────────┘             │
│                                                                  │
│  SecoManager（策略集中管理）                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 统一管理多台USG的策略                                       │    │
│  │ · 一条策略，自动下发到所有防火墙                             │    │
│  │ · 策略冲突检测                                             │    │
│  │ · 策略优化建议                                             │    │
│  │ · 策略合规审计                                             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 四、华为vs其他防火墙的CLI配置对比

| 配置项 | 华为USG CLI | 深信服AF Web | Cisco ASA CLI |
|:---|:---|:---|:---|
| 接口IP | `ip address x.x.x.x mask` | Web界面输入 | `ip address x.x.x.x mask` |
| 安全策略 | `security-policy rule name` | Web可视化拖拽 | `access-list` + `access-group` |
| NAT | `nat server ...` 或 `nat policy` | Web NAT配置页 | `nat (inside,outside)` |
| 查看配置 | `display current-config` | Web界面查看 | `show running-config` |
| 保存配置 | `save` | Web保存按钮 | `write memory` |

---

## 🔧 动手实操

### 实验：eNSP搭建华为网络环境

```
eNSP实验拓扑：

┌─────────┐     ┌──────────┐     ┌─────────┐
│  PC-1   │────→│  USG     │────→│  PC-2   │
│ 内网用户 │     │  防火墙   │     │ 模拟外网 │
│ 192.168│     │          │     │ 202.96.│
│  .1.100 │     │ GE0/0/1  │     │  .1.100 │
│         │     │ Trust区  │     │         │
└─────────┘     │ GE0/0/0  │     └─────────┘
                │ Untrust区│
                └──────────┘

实验任务：
1. 拖入两个PC和一个USG6000V防火墙
2. 配置GE0/0/0接口IP为202.96.1.1/24（Untrust区）
3. 配置GE0/0/1接口IP为192.168.1.1/24（Trust区）
4. 配置安全策略允许Trust→Untrust
5. 配置NAT策略实现内网上网
6. 测试PC-1 ping PC-2
7. 查看安全策略命中计数：display security-policy statistics
```

---

## 📝 知识速查表

### 华为CLI常用命令

| 命令 | 作用 | 示例 |
|:---|:---|:---|
| `system-view` | 进入系统视图 | `<USG> system-view` |
| `interface` | 进入接口配置 | `interface GE0/0/0` |
| `firewall zone` | 配置安全区域 | `firewall zone trust` |
| `security-policy` | 配置安全策略 | `security-policy` |
| `nat server` | NAT映射 | `nat server web protocol tcp...` |
| `display` | 查看配置/状态 | `display current-config` |
| `save` | 保存配置 | `save` |

### 华为安全区域速查

| 区域 | 默认通信规则 | 典型用途 | 安全等级 |
|:---|:---|:---|:---:|
| Trust | 可以访问Untrust和DMZ | 内网办公区 | 高(85) |
| Untrust | 不能主动访问Trust和DMZ | 互联网/外网 | 低(5) |
| DMZ | 不能主动访问Trust | 对外服务器区 | 中(50) |
| Local | 防火墙自身 | 管理口 | 最高(100) |

---

## ✅ 今日验收标准

- [ ] 理解华为四类安全区域（Trust/Untrust/DMZ/Local）及其默认通信规则
- [ ] 能用CLI命令配置基本的接口和安全策略
- [ ] 能配置NAT Server实现端口映射
- [ ] 在eNSP中完成USG防火墙基本实验
- [ ] 理解USG→HiSec Insight→CIS→SecoManager的联动体系

---

---

## 🔬 深度实战：eNSP模拟器完整实验指南

### 实验1：eNSP安装与基础拓扑搭建

eNSP（Enterprise Network Simulation Platform）是华为官方的网络模拟器，可以虚拟运行华为路由器、交换机和防火墙。

```bash
# eNSP安装步骤（Windows环境）：
# 0. 下载地址：https://support.huawei.com/enterprise/zh/tool/ensp
# 1. 先安装依赖：WinPcap、Wireshark、VirtualBox
# 2. 安装eNSP主程序
# 3. 首次运行需要注册设备（拖入设备时会自动提示）

# 验证安装：
# 打开eNSP → 新建拓扑 → 拖入USG6000V → 右键启动
# 如果能正常启动，说明安装成功
```

### 实验2：完整三区分离实验拓扑

```
eNSP实验拓扑（三区分离+双防火墙）：

                      Internet (模拟)
                          │
                   ┌──────┴──────┐
                   │   Cloud     │ ← eNSP虚拟网卡桥接到真实网络
                   └──────┬──────┘
                          │ 202.96.1.254/24
                          │
                   ┌──────┴──────┐
                   │  USG6600-01 │ ← 主防火墙
                   │  主NGFW     │
                   │ GE0/0/0:202.96.1.1/24 (Untrust)
                   │ GE0/0/1:192.168.1.1/24 (Trust)
                   │ GE0/0/2:10.1.1.1/24 (DMZ)
                   └──────┬──────┘
                          │
                   ┌──────┴──────┐
                   │  S5700-01   │ ← 核心交换机
                   │  VLAN 10: Trust区
                   │  VLAN 20: DMZ区
                   └──┬───┬───┬──┘
                      │   │   │
          ┌───────────┘   │   └───────────┐
          ▼               ▼               ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │  PC-1    │   │  PC-2    │   │  Server  │
    │ Trust区  │   │ Trust区  │   │  DMZ区   │
    │.1.100    │   │.1.200    │   │.1.50     │
    └──────────┘   └──────────┘   └──────────┘
```

### 实验3：USG完整CLI配置脚本（可直接复制到eNSP）

```
# ============================================
# 华为USG6000V 完整安全配置脚本
# 场景：三区分离 + NAT + IPS + 安全策略
# ============================================

# 1. 基础配置
system-view
sysname USG-Main
#
# 2. 接口配置
interface GigabitEthernet 0/0/0
 description TO-INTERNET
 ip address 202.96.1.1 255.255.255.0
 quit
#
interface GigabitEthernet 0/0/1
 description TO-TRUST
 ip address 192.168.1.1 255.255.255.0
 quit
#
interface GigabitEthernet 0/0/2
 description TO-DMZ
 ip address 10.1.1.1 255.255.255.0
 quit
#
# 3. 安全区域配置
firewall zone untrust
 set priority 5
 add interface GigabitEthernet 0/0/0
 quit
#
firewall zone trust
 set priority 85
 add interface GigabitEthernet 0/0/1
 quit
#
firewall zone dmz
 set priority 50
 add interface GigabitEthernet 0/0/2
 quit
#
# 4. 默认路由（指向互联网）
ip route-static 0.0.0.0 0.0.0.0 202.96.1.254
#
# 5. NAT地址池配置
nat address-group 1 202.96.1.10 202.96.1.20
#
# 6. NAT策略（内网上网）
nat-policy
 rule name Trust-NAT-Internet
  source-zone trust
  destination-zone untrust
  source-address 192.168.1.0 mask 255.255.255.0
  action source-nat address-group 1
  quit
#
# 7. NAT Server（对外发布DMZ服务）
nat server Web-Server protocol tcp global 202.96.1.1 80 inside 10.1.1.50 80
nat server Web-Server-SSL protocol tcp global 202.96.1.1 443 inside 10.1.1.50 443
#
# 8. 安全策略配置
security-policy
#
# 8.1 允许内网上网（含安全检测）
 rule name Trust-to-Untrust
  source-zone trust
  destination-zone untrust
  source-address 192.168.1.0 mask 255.255.255.0
  profile ips IPS-Default
  profile av AV-Default
  action permit
  quit
#
# 8.2 允许互联网访问DMZ Web服务
 rule name Untrust-to-DMZ-Web
  source-zone untrust
  destination-zone dmz
  destination-address 10.1.1.50 mask 255.255.255.255
  service http
  service https
  profile ips IPS-Default
  action permit
  quit
#
# 8.3 允许IT管理员从内网管理DMZ服务器
 rule name Trust-to-DMZ-Admin
  source-zone trust
  destination-zone dmz
  source-address 192.168.1.100 mask 255.255.255.255
  destination-address 10.1.1.0 mask 255.255.255.0
  service ssh
  service ping
  action permit
  quit
#
# 8.4 默认拒绝所有其他流量（最后一条）
 rule name Default-Deny
  action deny
  quit
#
quit  # 退出security-policy视图
#
# 9. IPS Profile配置
profile type ips name IPS-Default
 description "Default IPS Protection"
 signature-set all
 action alert
 quit
#
# 10. AV Profile配置
profile type av name AV-Default
 description "Default Antivirus Protection"
 action alert
 quit
#
# 11. 保存配置
save
y
```

### 实验4：验证与排错命令集

```
# 验证接口状态
display interface brief

# 验证安全区域
display firewall zone

# 验证安全策略（查看命中计数）
display security-policy statistics
# 重要！通过命中计数判断策略是否生效

# 验证NAT会话
display nat session all

# 验证NAT Server
display nat server

# 验证路由表
display ip routing-table

# 实时查看日志
display logbuffer

# 抓包诊断（在接口上抓包）
# 进入诊断视图
diagnose
firewall session table
# 可以看到当前所有会话

# 测试连通性
ping -a 192.168.1.1 202.96.1.254  # 防火墙ping外网
ping -a 192.168.1.100 10.1.1.50   # 内网PC ping DMZ服务器

# 策略追踪（检查某条流量匹配了哪些策略）
display security-policy match source-ip 192.168.1.100 destination-ip 10.1.1.50
```

---

## 📚 专题扩展：华为防火墙高可用性（HA）配置

在实际生产环境中，单台防火墙是不可接受的。华为USG支持多种高可用方案：

### 方案1：双机热备（Active-Standby）

```
双机热备拓扑：

          Internet
              │
        ┌─────┴─────┐
        │  交换机    │
        └──┬─────┬──┘
           │     │
    ┌──────┴┐   ┌└──────┐
    │ USG-1 │←─→│ USG-2 │ ← 心跳线（直连或通过交换机）
    │ Active│   │Standby│
    └──────┬┘   └┬──────┘
           │     │
        ┌──┴─────┴──┐
        │  核心交换  │
        └───────────┘

关键CLI配置（USG-1，Master）：
[USG-1] hrp enable
[USG-1] hrp interface GigabitEthernet 0/0/3  # 配置心跳口
[USG-1] hrp mirror session enable             # 会话同步

查看HA状态：
[USG-1] display hrp state
# 输出示例：
# Role: active, peer: standby
# Running priority: 45000, peer: 40000
# Backup channel status: connected
```

### 方案2：双活（Active-Active，需要负载均衡器）

```
双活拓扑：

          Internet
              │
        ┌─────┴─────┐
        │ 负载均衡器 │ ← F5/A10/深信服AD
        └──┬─────┬──┘
           │     │
    ┌──────┴┐   ┌└──────┐
    │ USG-1 │   │ USG-2 │ ← 两台同时处理流量
    │ Active│   │ Active│
    └──────┬┘   └┬──────┘
           │     │
        ┌──┴─────┴──┐
        │  核心交换  │
        └───────────┘
```

---

## 🛡️ 专题扩展：华为USG安全策略高级场景

### 场景1：基于用户的安全策略（与AD域联动）

```
需求：财务部员工可以访问财务系统，其他部门不能访问

前提：USG已与Active Directory集成

[USG] security-policy
[USG-policy-security] rule name Finance-to-FinSys
# 源：财务部AD组
[USG-policy-security-rule-Finance-to-FinSys] source-zone trust
[USG-policy-security-rule-Finance-to-FinSys] user user-group "CN=Finance,OU=Groups,DC=company,DC=com"
# 目的：财务系统
[USG-policy-security-rule-Finance-to-FinSys] destination-zone dmz
[USG-policy-security-rule-Finance-to-FinSys] destination-address 10.1.1.100 mask 32
[USG-policy-security-rule-Finance-to-FinSys] action permit
```

### 场景2：基于时间的访问控制

```
需求：工作时间（9:00-18:00）允许上网，其余时间禁止

[USG] time-range Work-Hours
[USG-time-range-Work-Hours] period-range 09:00:00 to 18:00:00 daily
[USG-time-range-Work-Hours] quit

[USG] security-policy
[USG-policy-security] rule name Trust-Untrust-WorkHours
 source-zone trust
 destination-zone untrust
 time-range Work-Hours   # 只在工作时间生效
 action permit
 quit
```

### 场景3：地域IP封禁

```
需求：封禁来自特定国家的流量（如俄罗斯、朝鲜等高风险地区）

[USG] geo-location country-list BlockList
[USG-geo-location] country RU   # 俄罗斯
[USG-geo-location] country KP   # 朝鲜
[USG-geo-location] quit

[USG] security-policy
[USG-policy-security] rule name Block-HighRisk-Country
 source-zone untrust
 source-address geo-location country-list BlockList
 destination-zone dmz
 action deny
 quit
```

### 场景4：IPS定制化防护

```
需求：Web服务器只开启Web相关IPS签名，减少误报和性能开销

[USG] profile type ips name WebServer-IPS
 signature-set name "Server Web"
 signature-set name "Server IIS"
 signature-set name "Server Apache"
 signature-set name "Attack SQL Injection"
 signature-set name "Attack XSS"
 # 排除不需要的签名
 signature-set除外 name "Server DNS"
 signature-set除外 name "Server Mail"
 action block    # 对匹配的签名执行阻断
 quit

# 在安全策略中应用
[USG-policy-security-rule-Untrust-to-DMZ-Web] profile ips WebServer-IPS
```

---

## 🔧 专题扩展：故障排查实战指南

### 故障1：内网上不了网

```
排查步骤（从近到远）：

1. 检查PC网络配置
   PC> ipconfig
   → 确认IP地址、子网掩码、默认网关是否正确

2. 检查能否ping通防火墙内网口
   PC> ping 192.168.1.1
   → 如果不通：检查物理连接、VLAN配置

3. 检查防火墙能否ping通外网
   [USG] ping -a 202.96.1.1 8.8.8.8
   → 如果不通：检查路由、NAT配置

4. 检查安全策略
   [USG] display security-policy statistics
   → 查看Trust-to-Untrust策略是否有命中计数
   → 如果命中计数为0：说明策略没有匹配到流量

5. 检查NAT策略
   [USG] display nat-policy
   → 确认NAT地址池配置正确

6. 实时诊断
   [USG] diagnose
   [USG-diagnose] firewall session table
   → 查看是否有NAT会话建立
```

### 故障2：外网访问不了DMZ的Web服务器

```
排查步骤：

1. 检查NAT Server配置
   [USG] display nat server
   → 确认公网IP、端口、内网IP、端口映射正确的

2. 检查安全策略
   [USG] display security-policy statistics
   → 查看Untrust-to-DMZ策略命中计数

3. 测试从防火墙直接访问DMZ服务器
   [USG] ping -a 10.1.1.1 10.1.1.50
   → 确认DMZ服务器可达

4. 检查DMZ服务器防火墙
   在DMZ服务器上检查：
   - Windows防火墙是否放行80/443端口
   - Web服务（IIS/Apache/Nginx）是否正常运行

5. 外网测试端口是否开放
   在外网用telnet测试：
   telnet 202.96.1.1 80
   → 如果通但无法访问：Web服务问题
   → 如果不通：NAT或安全策略问题
```

### 故障3：策略配置了但不生效

```
常见原因和解决：

1. 策略顺序问题
   [USG] display security-policy
   → 策略自上而下匹配，第一条匹配即生效
   → 如果上面有一条更宽泛的deny策略，下面的permit不会生效

2. Profile未提交
   [USG] display this  # 在当前视图检查配置
   → 确认profile配置后执行了quit提交

3. 安全区域错误
   → 检查接口是否加入了正确的安全区域
   [USG] display firewall zone

4. IP地址在网络拓扑中不匹配
   → 用display security-policy match验证
```

---

## 📝 知识速查表（扩展）

### 华为CLI命令全集（安全方向）

| 功能分类 | 命令 | 说明 |
|:---|:---|:---|
| **系统** | `system-view` | 进入系统视图 |
| **系统** | `display current-config` | 查看当前配置 |
| **系统** | `save` | 保存配置 |
| **系统** | `reset saved-config` | 清除已保存配置 |
| **接口** | `display interface brief` | 查看接口状态 |
| **接口** | `display ip interface brief` | 查看接口IP |
| **路由** | `display ip routing-table` | 查看路由表 |
| **安全区域** | `display firewall zone` | 查看安全区域 |
| **安全策略** | `display security-policy` | 查看所有安全策略 |
| **安全策略** | `display security-policy statistics` | 查看策略命中计数 |
| **NAT** | `display nat session all` | 查看所有NAT会话 |
| **NAT** | `display nat server` | 查看NAT Server |
| **IPS** | `display ips signature` | 查看IPS签名 |
| **会话** | `display firewall session table` | 查看防火墙会话表 |
| **日志** | `display logbuffer` | 查看日志缓冲区 |
| **HA** | `display hrp state` | 查看双机热备状态 |
| **诊断** | `diagnose` | 进入诊断视图 |

### 华为vs深信服管理方式对比

| 对比维度 | 华为USG | 深信服AF |
|:---|:---|:---|
| 主要管理方式 | CLI（命令行） | Web（图形界面） |
| 配置语言 | 华为VRP系统命令 | Web表单/拖拽 |
| 学习曲线 | 较高（需学CLI） | 较低（图形化） |
| 批量操作 | CLI脚本一键导入 | 需逐页配置 |
| 网络工程师友好度 | ⭐⭐⭐⭐⭐（熟悉的语法） | ⭐⭐⭐（新学一套逻辑） |
| 新手上手速度 | ⭐⭐（需要CLI基础） | ⭐⭐⭐⭐（所见即所得） |
| 版本管理 | 配置文件文本diff | Web配置备份 |
| 自动化能力 | Ansible/Python脚本 | API支持但使用较少 |

---

## 💡 常见误区（扩展）

### 误区4："华为CLI太难，用Web界面就行了"
✅ Web界面只能完成80%的操作，高级功能（如Troubleshooting、性能调优、批量配置）必须用CLI。在运营商和金融行业，CLI是必须掌握的技能。

### 误区5："安全区域配置完就能互相通信"
✅ 华为USG默认禁止区域间通信（除了Trust→Untrust），必须显式配置安全策略放行。这是"默认拒绝"原则的体现，比深信服默认允许安全。

### 误区6："eNSP模拟器只是学习工具，不能用于生产"
✅ eNSP确实是学习工具，但你在eNSP上配置的CLI命令和在生产环境真机上完全一样。eNSP是你"无成本"掌握华为CLI的利器。

---

## ✅ 今日验收标准（附加）

- [ ] 在eNSP中完成三区分离完整实验
- [ ] 能用CLI配置至少10条安全策略并验证命中计数
- [ ] 能诊断"内网上不了网"的5步排查流程
- [ ] 理解华为USG双机热备的工作原理
- [ ] 掌握至少20条常用CLI命令

---

> 🎯 **Day 22 关键收获**：华为USG的CLI配置对网络工程师非常友好——用管理交换机/路由器的方式管理防火墙。Trust/Untrust/DMZ/Local四区模型清晰简洁。华为安全不是孤立的防火墙，而是融入HiSec Insight（检测）、CIS（展示）、SecoManager（管理）的完整生态体系。如果你的网络基础设施是华为全家桶，安全选华为是最自然最顺畅的选择。今天重点掌握了CLI命令配置、eNSP实验环境和真实排错能力。

---

## 🧪 华为安全生态工具补充

### HiSec Insight高级用法
```
流探针部署方案：
核心交换机SPAN → HiSec Insight探针 → HiSec Insight平台
├─ 检测能力：
│  ├─ C&C通信检测（机器学习+DGA域名识别）
│  ├─ 隐蔽隧道检测（DNS/ICMP/HTTP隧道）
│  ├─ 异常流量基线偏离告警
│  └─ 与防火墙联动：下发ACL自动阻断
└─ 可视化：
   ├─ 攻击链还原（Kill Chain可视化）
   ├─ 攻击者画像（IP/工具/手法汇总）
   └─ 受影响资产拓扑图
```

### SecoManager统一策略管理
```
多台USG统一管控：
SecoManager → 查看所有USG的策略状态
           → 统一推送安全策略模板
           → 批量升级特征库/固件
           → 统一配置备份和审计
适用场景：集团多分支机构统一安全管理
```

### 华为防火墙常用CLI命令速查（扩展30条）
| 命令 | 功能 |
|:---|:---|
| `display firewall session table` | 查看会话表 |
| `display security-policy rule all` | 查看所有安全策略 |
| `display zone` | 查看安全区域配置 |
| `reset firewall session table` | 清空会话表（慎用！） |
| `display ip routing-table` | 查看路由表 |
| `display nat session all` | 查看NAT会话 |
| `display logbuffer` | 查看本地日志缓冲 |
| `terminal monitor` | 开启终端实时日志显示 |
| `display firewall defend ip-sweep` | 查看IP扫描防御统计 |
| `display firewall defend port-scan` | 查看端口扫描防御统计 |
| `display firewall statistics` | 查看防火墙统计信息 |

### 华为HiSec安全体系选型5要素
```
选华为安全的5个充分条件（满足>3个即可考虑）：
1. 网络基础设施全华为 → NATIVE衔接零门槛
2. 团队习惯华为CLI → 无需额外学习
3. 需要统一网管平台 → SecoManager一管到底
4. 信创国产化需求 → 华为全系自主可控
5. 有HiSec Insight需求 → 生态联动价值最大化
```

### 华为安全学习小结
华为安全 = 自研芯片(NP) + 四区模型(Trust/Untrust/DMZ/Local) + CLI亲和力 + 华为生态深度集成

---

---
