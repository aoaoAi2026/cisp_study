# Day 42 · 安恒玄武盾 & 阶段总结

> **学习阶段**：第二层 — 安恒信息  
> **学习时长**：约 90 分钟  
> **难度等级**：中级  
> **前置知识**：安恒全线产品（Day 40-41）、云安全基础概念  
> **学习目标**：了解安恒玄武盾云防护、掌握安恒云一站式安全方案、理解安恒"专而精"定位、完成安恒全产品线回顾与总结  

---

## 目录

1. [开篇：安恒的云端布局](#1-开篇安恒的云端布局)
2. [云安全市场背景](#2-云安全市场背景)
3. [玄武盾产品概述](#3-玄武盾产品概述)
4. [玄武盾核心架构](#4-玄武盾核心架构)
5. [云WAF功能详解](#5-云waf功能详解)
6. [DDoS云清洗详解](#6-ddos云清洗详解)
7. [CDN加速与安全一体化](#7-cdn加速与安全一体化)
8. [玄武盾 vs 传统硬件WAF](#8-玄武盾-vs-传统硬件waf)
9. [安恒云安全一站式方案](#9-安恒云安全一站式方案)
10. [安恒全产品线回顾](#10-安恒全产品线回顾)
11. [安恒信息：专而精的定位分析](#11-安恒信息专而精的定位分析)
12. [安恒 vs 第一层厂商对比总结](#12-安恒-vs-第一层厂商对比总结)
13. [第二层厂商学习进度回顾](#13-第二层厂商学习进度回顾)
14. [实操实验：搭建开源云WAF](#14-实操实验搭建开源云waf)
15. [实验一：Nginx反向代理WAF](#15-实验一nginx反向代理waf)
16. [实验二：配置DDoS防护策略](#16-实验二配置ddos防护策略)
17. [实验三：搭建CDN+WAF一体化防护](#17-实验三搭建cdnwaf一体化防护)
18. [验收练习](#18-验收练习)
19. [今日总结](#19-今日总结)

---

## 1. 开篇：安恒的云端布局

在前两天的学习中，我们深入了解了安恒信息的Web安全（明御WAF）和数据安全（DAS、堡垒机）产品。这些都是传统意义上的"盒子"产品——部署在企业自己的机房里。

但今天的IT环境已经发生了巨大变化：越来越多的企业把业务迁移到云端，传统的硬件盒子部署方式面临挑战。安恒信息很早就意识到了这个趋势，推出了**玄武盾**——一个SaaS化的云端安全防护平台。

> 如果说明御WAF是企业门口的自建保安亭，那玄武盾就是**云端的安保公司**——你不需要自己建保安亭，不需要自己雇保安，安保公司在你门口设置了检查站，所有来访者都要先经过云端检查站，安全的才放行到你门口。

---

## 2. 云安全市场背景

### 2.1 企业上云的安全挑战

```
传统安全部署 vs 云上安全挑战：

传统环境：
┌──────────┐     ┌──────────┐     ┌──────────┐
│  防火墙   │────→│   WAF    │────→│ Web服务器 │
│ (硬件盒子) │     │ (硬件盒子) │     │ (物理机)  │
└──────────┘     └──────────┘     └──────────┘
优势：设备在本地，完全可控
劣势：需要采购、部署、维护，成本高

云环境：
┌──────────┐
│  Web应用  │  ← 部署在云端，没有物理机房
└──────────┘
挑战：
1. 无法部署硬件安全设备
2. 云服务商的安全能力有限
3. 多Region部署，安全策略难统一
4. 弹性扩缩容，传统安全设备跟不上
```

### 2.2 云安全解决方案的演进

```
第一代：搬盒子上云
→ 在云上部署虚拟化安全设备（虚拟WAF/虚拟防火墙）
→ 问题：需要自己管理、性能受限、成本高

第二代：云原生安全
→ 云服务商提供原生安全服务（AWS WAF/Azure WAF等）
→ 问题：只能保护该云平台上的资源，多云环境不适用

第三代：SaaS化安全（玄武盾的定位）
→ 安全以SaaS服务形式提供
→ 优势：不依赖特定云平台、无需部署维护、按需付费
→ 代表：Cloudflare、Akamai、安恒玄武盾
```

---

## 3. 玄武盾产品概述

### 3.1 什么是玄武盾？

**玄武盾**是安恒信息推出的**云安全防护SaaS平台**，集成了云WAF、DDoS防护、CDN加速三大核心功能。

> "玄武"在中国传统文化中是北方之神，代表龟蛇合体，象征坚固的防御。"玄武盾"这个名字寓意**坚不可摧的云防护**。

### 3.2 玄武盾的三大核心能力

```
┌─────────────────────────────────────────────────────────────┐
│                     玄武盾 云安全平台                         │
│                                                             │
│  ┌─────────────────┐  ┌─────────────┐  ┌────────────────┐  │
│  │    云WAF         │  │  DDoS云清洗  │  │   CDN加速      │  │
│  │  (Web应用防护)    │  │  (流量清洗)  │  │  (内容分发)    │  │
│  ├─────────────────┤  ├─────────────┤  ├────────────────┤  │
│  │ · SQL注入防护    │  │ · 网络层DDoS │  │ · 静态内容缓存  │  │
│  │ · XSS防护       │  │ · 应用层DDoS │  │ · 智能路由      │  │
│  │ · CC攻击防护    │  │ · DNS防护    │  │ · SSL加速      │  │
│  │ · Bot管理       │  │ · 大流量清洗  │  │ · 图片优化      │  │
│  │ · API安全       │  │ · 协议清洗    │  │ · HTTP/2      │  │
│  │ · 0day虚拟补丁  │  │ · 智能识别    │  │ · 边缘计算      │  │
│  └─────────────────┘  └─────────────┘  └────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              统一管理与态势展示                       │   │
│  │  · 多站点统一管理  · 实时攻击态势  · 智能报表        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 玄武盾的工作原理

```
用户访问流程：

用户 → DNS解析（指向玄武盾）→ 玄武盾节点 → 安全检测 → 源站

详细流程：
┌──────┐
│ 用户  │
└──┬───┘
   │ 1. 访问 www.example.com
   ▼
┌──────────┐
│ DNS解析   │  ← 域名被解析到玄武盾的IP（而非源站IP）
└────┬─────┘
     │
     ▼
┌──────────────┐
│ 玄武盾节点     │
│              │
│ 2. WAF检测    │  ← 检查SQL注入、XSS、CC等攻击
│ 3. DDoS检测   │  ← 检查是否为DDoS攻击流量
│ 4. Bot检测    │  ← 检查是否为恶意Bot
│ 5. 缓存检查   │  ← 检查是否有缓存内容可直接返回
└──────┬───────┘
       │
       │ 6. 合法请求 → 回源
       ▼
┌──────────────┐
│ 源站(Web服务器)│  ← 只有通过所有安全检测的请求才能到达
└──────────────┘
```

> 关键点：用户的流量先经过玄武盾，被"洗干净"后才到达你的源站。攻击流量在云端就被拦截了，根本到不了你的服务器。

---

## 4. 玄武盾核心架构

### 4.1 全球分布式节点架构

```
┌─────────────────────────────────────────────────────────────┐
│                    玄武盾全球节点分布                          │
│                                                             │
│              ┌──────────┐                                   │
│              │ 欧洲节点   │                                   │
│              │ 法兰克福   │                                   │
│              └─────┬────┘                                   │
│                    │                                        │
│   ┌──────────┐    │    ┌──────────┐    ┌──────────┐        │
│   │ 北美节点   │────┼────│ 亚洲节点   │────│ 亚太节点   │       │
│   │ 硅谷      │         │ 北京/上海  │    │ 新加坡     │       │
│   └──────────┘         │ 广州/深圳  │    └──────────┘       │
│                        │ 香港      │                        │
│                        └─────┬────┘                        │
│                              │                              │
│                         ┌────▼────┐                        │
│                         │ 源站     │                        │
│                         │ (隐藏IP) │                        │
│                         └─────────┘                        │
│                                                             │
│   关键设计：                                                │
│   · 用户访问最近的节点（降低延迟）                           │
│   · 所有节点共享安全策略和缓存                               │
│   · 源站IP完全隐藏，攻击者无法直接攻击源站                   │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 玄武盾的技术栈

```
┌─────────────────────────────────────────────────────────────┐
│                    玄武盾技术架构                             │
│                                                             │
│  接入层（Edge Layer）                                       │
│  ├── Anycast网络（用户自动路由到最近节点）                   │
│  ├── 四层负载均衡（LVS/DPDK）                               │
│  └── SSL/TLS卸载（硬件加速）                                │
│                                                             │
│  安全层（Security Layer）                                   │
│  ├── WAF引擎（规则引擎 + ML引擎）                            │
│  ├── DDoS清洗（流量分析 + 黑洞路由）                         │
│  ├── Bot管理（行为分析 + JS挑战）                            │
│  └── 速率限制（多维度限流）                                  │
│                                                             │
│  加速层（Acceleration Layer）                               │
│  ├── 内容缓存（静态资源CDN）                                │
│  ├── 智能路由（最优回源路径）                               │
│  ├── 协议优化（HTTP/2, QUIC, TLS 1.3）                     │
│  └── 内容压缩（Brotli/Gzip）                               │
│                                                             │
│  管理层（Management Layer）                                 │
│  ├── 统一配置管理                                           │
│  ├── 实时日志分析                                           │
│  ├── 态势大屏                                               │
│  └── API/自动化对接                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. 云WAF功能详解

### 5.1 云WAF vs 硬件WAF

玄武盾的云WAF功能，本质上就是把明御WAF的能力搬到了云端，但做了一些适应云环境的优化：

```
云WAF的特点：

优势：
✓ 无需部署硬件：开通服务即可使用
✓ 弹性扩展：流量增长自动扩容
✓ 全球防护：攻击从全球节点清洗
✓ 零维护：安恒负责规则更新和系统维护
✓ 隐藏源站IP：攻击者无法绕过WAF直接攻击源站

劣势：
✗ 延迟略高：流量需经过云端节点（通常增加5-20ms）
✗ 数据经过第三方：敏感数据经过安恒云端
✗ SSL证书管理：需要在云端配置SSL证书
✗ 定制化受限：不如硬件WAF灵活
```

### 5.2 云WAF的安全策略

玄武盾的云WAF继承了明御WAF的检测引擎，并针对云端场景做了增强：

```
云WAF策略体系：

1. Web攻击防护
   ├── OWASP Top 10全覆盖
   ├── SQL注入、XSS、CSRF、SSRF
   ├── 命令注入、代码注入
   ├── 文件包含、目录遍历
   └── 敏感信息泄露

2. CC攻击防护
   ├── 频率限制（QPS/并发连接）
   ├── 智能人机识别（JS挑战/验证码）
   ├── IP信誉库
   └── 区域访问控制

3. Bot管理
   ├── 搜索引擎白名单（Googlebot/Baiduspider等）
   ├── 恶意Bot识别
   ├── 自定义Bot规则
   └── Bot行为分析

4. 0day防护
   ├── 虚拟补丁
   ├── 异常行为检测
   └── 威胁情报联动

5. 业务安全
   ├── 防撞库（登录接口保护）
   ├── 防刷票/防薅羊毛
   ├── 防短信轰炸
   └── API滥用防护
```

---

## 6. DDoS云清洗详解

### 6.1 DDoS攻击的类型

玄武盾需要防护的DDoS攻击分为多个层次：

```
DDoS攻击层次与防护：

┌─────────────────────────────────────────────────────────────┐
│ Layer 7 应用层                                              │
│ ├── HTTP Flood（大量HTTP请求）                               │
│ ├── Slowloris（慢速HTTP连接耗尽）                            │
│ ├── DNS Query Flood（DNS查询洪水）                          │
│ └── 防护方式：WAF + 速率限制 + 挑战验证                     │
├─────────────────────────────────────────────────────────────┤
│ Layer 4 传输层                                              │
│ ├── SYN Flood（TCP握手洪水）                                │
│ ├── ACK Flood                                              │
│ ├── UDP Flood                                              │
│ └── 防护方式：SYN Cookie + 连接跟踪 + 流量清洗              │
├─────────────────────────────────────────────────────────────┤
│ Layer 3 网络层                                              │
│ ├── ICMP Flood（Ping洪水）                                  │
│ ├── IP分片攻击                                             │
│ └── 防护方式：流量限速 + 黑洞路由                           │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 DDoS云清洗流程

```
DDoS攻击清洗流程：

正常流量 + 攻击流量
        │
        ▼
┌──────────────┐
│  流量检测     │  ← 实时分析流量特征
│  · 包速率    │
│  · 带宽      │
│  · 协议分布   │
│  · 源IP分布   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  异常判断     │  ← 超过基线阈值？
└──────┬───────┘
       │
   ┌───▼───┐
   │ 正常？  │──Yes──→ 直接放行到源站
   └───┬───┘
       │ No
       ▼
┌──────────────┐
│  流量清洗     │  ← 进入清洗中心
│  · 过滤攻击包 │
│  · 限速      │
│  · 丢弃      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  回注正常流量 │  ← 清洗后的干净流量发回源站
└──────────────┘

关键指标：
- 清洗能力：玄武盾支持Tbps级别的DDoS清洗
- 检测时间：秒级检测
- 清洗延迟：毫秒级
```

### 6.3 玄武盾的DDoS防护策略

```
策略配置示例：

# 基础DDoS防护策略
策略名称：default_ddos_protection
触发条件：
  - 入向流量 > 基线流量的 200%
  - 或 包速率 > 基线包速率的 300%
动作：
  - 自动启动流量清洗
  - 通知管理员
  - 记录攻击日志

# HTTP Flood防护
策略名称：http_flood_protection
触发条件：
  - 单IP QPS > 100
  - 或 总QPS > 正常峰值的 300%
动作：
  - 触发JS挑战
  - 超过阈值2倍：验证码
  - 超过阈值5倍：临时封禁

# DNS防护
策略名称：dns_protection
触发条件：
  - DNS QPS > 基线 500%
  - 或 非正常域名查询比例 > 50%
动作：
  - 限速DNS请求
  - 丢弃非白名单域名查询
```

---

## 7. CDN加速与安全一体化

### 7.1 为什么安全要和CDN结合？

玄武盾将CDN和安全结合在一起，这不仅仅是一个产品包装策略，而是有技术上的合理性：

```
CDN + 安全 = 天然最佳组合

原因1：部署位置相同
CDN节点和WAF节点都需要部署在用户和源站之间
→ 同一个节点同时做CDN和WAF，不增加延迟

原因2：流量都经过
CDN需要接收所有用户请求，WAF也需要检查所有请求
→ 同一份流量，两个目的，不增加开销

原因3：缓存可以减轻攻击
静态资源被CDN缓存后，CC攻击打不到源站
→ 缓存本身就是一种DDoS防护手段

原因4：源站隐藏
CDN天然隐藏源站IP，WAF也需要隐藏源站IP
→ 双重隐藏，攻击者更难找到源站
```

### 7.2 玄武盾的CDN功能

```
玄武盾CDN功能：

1. 静态内容加速
   ├── 图片、CSS、JS等静态文件缓存
   ├── 支持自定义缓存规则
   ├── 缓存预热和缓存刷新
   └── 智能压缩（Brotli/Gzip）

2. 动态内容加速
   ├── 智能路由（选择最优回源路径）
   ├── 链路优化（减少TCP握手和TLS握手次数）
   ├── 协议优化（HTTP/2、QUIC）
   └── 连接复用（减少回源连接数）

3. 安全加速
   ├── SSL/TLS证书管理（免费证书或上传自有证书）
   ├── HTTPS强制跳转
   ├── HSTS（HTTP Strict Transport Security）
   └── 安全HTTP头注入

4. 边缘计算（Edge Computing）
   ├── 边缘重定向
   ├── 边缘A/B测试
   ├── 边缘认证（JWT验证等）
   └── 自定义Worker脚本
```

---

## 8. 玄武盾 vs 传统硬件WAF

### 8.1 全面对比

| 对比维度 | 玄武盾（云WAF） | 明御WAF（硬件） |
|----------|----------------|-----------------|
| **部署方式** | SaaS，DNS指向即可 | 硬件部署在机房 |
| **部署时间** | 分钟级（改DNS） | 小时级到天级 |
| **初始成本** | 按需付费，低 | 硬件采购成本高 |
| **维护成本** | 厂商维护，零 | 需要专人维护 |
| **扩容方式** | 自动弹性扩容 | 需要购买新设备 |
| **DDoS防护** | Tbps级清洗 | 受限于硬件性能 |
| **全球加速** | 全球节点CDN | 无CDN能力 |
| **源站隐藏** | ✅ 天然隐藏 | ❌ 需要额外配置 |
| **延迟** | 增加5-20ms | 增加<1ms |
| **定制化** | 受限 | 高度可定制 |
| **数据隐私** | 流量经过云端 | 流量不出企业 |
| **SSL管理** | 证书上传到云端 | 本地管理 |
| **适用场景** | 中小企业/互联网业务 | 大型企业/合规要求高 |

### 8.2 选择指南

```
选择玄武盾（云WAF）的情况：
✓ 业务部署在云端
✓ 没有专职安全运维团队
✓ 预算有限，不想采购硬件
✓ 需要DDoS防护能力
✓ 需要全球加速
✓ 业务在多个云平台

选择明御WAF（硬件）的情况：
✓ 业务部署在本地机房
✓ 对延迟极度敏感（<1ms）
✓ 有合规要求，数据不能出企业
✓ 需要深度定制化
✓ 已有专职安全运维团队

最佳实践：两者结合
玄武盾做外层防护（DDoS+CDN+基础WAF）
明御WAF做内层精防护（深度检测+定制策略）
形成"云端粗筛 + 本地精检"的双层防护体系
```

---

## 9. 安恒云安全一站式方案

### 9.1 混合云安全架构

安恒信息的完整安全方案支持混合云环境：

```
┌─────────────────────────────────────────────────────────────┐
│              安恒混合云安全一站式方案                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   云端防护层                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐      │   │
│  │  │ 玄武盾    │  │ 云WAF    │  │ 云DDoS清洗    │      │   │
│  │  │ (SaaS)   │  │ (SaaS)   │  │ (SaaS)       │      │   │
│  │  └──────────┘  └──────────┘  └──────────────┘      │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │                   本地防护层                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐      │   │
│  │  │ 明御WAF  │  │ 明御DAS  │  │ 堡垒机        │      │   │
│  │  │ (硬件)   │  │ (硬件)   │  │ (硬件)       │      │   │
│  │  └──────────┘  └──────────┘  └──────────────┘      │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │                   分析决策层                          │   │
│  │  ┌──────────────────────────────────────────┐      │   │
│  │  │            AiLPHA 态势感知                 │      │   │
│  │  │  · 汇总云端+本地所有安全数据               │      │   │
│  │  │  · AI分析 + UEBA + 威胁狩猎               │      │   │
│  │  │  · 统一告警 + 统一策略下发                │      │   │
│  │  └──────────────────────────────────────────┘      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 典型方案组合

| 场景 | 产品组合 | 说明 |
|------|----------|------|
| **初创企业** | 玄武盾 | 零硬件投入，快速上线 |
| **中型企业** | 玄武盾 + 明御DAS + 堡垒机 | 云端防护+本地数据审计 |
| **大型企业** | 玄武盾 + 明御WAF + DAS + 堡垒机 + AiLPHA | 全栈安全方案 |
| **金融行业** | 明御WAF + DAS + 堡垒机 + 数据库加密 + AiLPHA | 全硬件方案，满足合规 |
| **电商平台** | 玄武盾 + 明御WAF + DAS + AiLPHA | 抗DDoS+防数据泄露 |

---

## 10. 安恒全产品线回顾

经过三天的学习（Day 40-42），我们已经全面了解了安恒信息的产品线。下面做一个系统回顾：

### 10.1 产品矩阵总览

```
安恒信息产品矩阵

Web安全（起家之本）             数据安全（增长引擎）
┌─────────────────┐           ┌─────────────────┐
│ 明御WAF ★★★★★   │           │ 明御DAS ★★★★★   │
│ · ML白名单建模   │           │ · 旁路零影响     │
│ · 三重引擎协同   │           │ · 智能SQL解析    │
│ · Bot/API/CC    │           │ · 三层关联审计    │
├─────────────────┤           ├─────────────────┤
│ 玄武盾 ★★★★     │           │ 堡垒机 ★★★★★    │
│ · 云WAF SaaS    │           │ · 统一入口       │
│ · DDoS云清洗    │           │ · 高危指令拦截    │
│ · CDN加速      │           │ · 会话录像       │
└─────────────────┘           ├─────────────────┤
                              │ AiGuard ★★★     │
安全管理（AI大脑）              │ · 数据安全治理   │
┌─────────────────┐           │ · 分类分级       │
│ AiLPHA ★★★★★   │           ├─────────────────┤
│ · UEBA行为分析   │           │ 数据库加密 ★★★  │
│ · 告警降噪       │           │ 数据脱敏 ★★★    │
│ · 威胁狩猎       │           └─────────────────┘
├─────────────────┤
│ 漏洞扫描 ★★★    │           云安全
└─────────────────┘           ┌─────────────────┐
                              │ 云安全资源池 ★★★ │
                              │ 云WAF ★★★★      │
                              └─────────────────┘
```

### 10.2 产品成熟度评估

| 产品 | 成熟度 | 市场地位 | 核心竞争力 |
|------|--------|----------|-----------|
| 明御WAF | ★★★★★ | 国内前三 | ML白名单建模引擎 |
| 明御DAS | ★★★★★ | 国内前二 | 旁路零影响+三层关联 |
| 堡垒机 | ★★★★★ | 国内前三 | 高危指令智能拦截 |
| AiLPHA | ★★★★☆ | 国内前五 | AI+UEBA行为分析 |
| 玄武盾 | ★★★★☆ | 国内前五 | WAF+DDoS+CDN一体化 |
| 漏洞扫描 | ★★★☆☆ | 国内前十 | 与AiLPHA联动 |

---

## 11. 安恒信息：专而精的定位分析

### 11.1 "专科医院"定位详解

经过三天的学习，安恒信息的"专而精"定位已经非常清晰：

```
安恒 = 网络安全行业的"专科医院"

如果把安全需求比作疾病：

综合医院（第一层厂商）        专科医院（安恒信息）
┌────────────────────┐      ┌────────────────────┐
│ 深信服              │      │ 安恒信息            │
│ · 感冒也能看        │      │ · 只看Web安全      │
│ · 骨折也能看        │      │ · 只看数据安全      │
│ · 心脏也能看        │      │ · 但看的最好       │
│ · 但都不是最好的    │      │ · 国内顶级水平     │
└────────────────────┘      └────────────────────┘

专而精的优势：
1. 技术深度：在Web安全和数据安全两个领域做到极致
2. 资源聚焦：不像综合厂商那样分散资源在10+条产品线
3. 行业口碑：在金融、政府等数据密集行业有深厚积累
4. 人才密度：Web安全专家集中

专而精的劣势：
1. 产品线窄：无法提供"全家桶"一站式方案
2. 客户覆盖面：更适合Web/数据密集型客户
3. 生态依赖：需要和其他厂商产品配合
```

### 11.2 安恒的三大差异化优势总结

```
差异化优势一：Web安全专家
├── 2007年成立，2008年发布WAF，深耕Web安全15年+
├── 对HTTP/HTTPS协议的理解业界领先
├── ML学习引擎在WAF中的应用是行业首创
└── 明御WAF在金融行业市占率第一

差异化优势二：数据安全新贵
├── 从Web安全自然延伸到数据安全
├── DAS数据库审计产品技术领先（旁路零影响+三层关联）
├── 堡垒机在运维安全领域口碑极好
└── 形成了"Web→应用→数据库→运维"的完整数据安全链

差异化优势三：AI先行者
├── 2015年推出AiLPHA，行业最早引入AI分析
├── UEBA行为分析技术成熟
├── AI与WAF的深度结合（ML引擎）
└── AI驱动的告警降噪效果显著（100,000→20）
```

---

## 12. 安恒 vs 第一层厂商对比总结

### 12.1 定位对比

| 维度 | 第一层厂商（深信服/奇安信/华为） | 安恒信息 |
|------|-------------------------------|----------|
| **定位** | 综合安全厂商 | 专项安全专家 |
| **产品线** | 10+条，覆盖全面 | 聚焦Web+数据安全 |
| **技术深度** | 每项80-85分 | 核心产品95分+ |
| **技术广度** | 95分 | 70分 |
| **客户画像** | 需要一站式方案的企业 | Web/数据密集型行业 |
| **销售策略** | 全家桶打包 | 单品突破 |
| **类比** | 综合医院 | 专科医院 |
| **一句话** | "什么都有" | "专而精" |

### 12.2 互补关系

安恒信息和第一层厂商不是竞争关系，而是**互补关系**：

```
互补场景示例：

场景：大型金融企业安全建设
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  深信服/奇安信提供：             安恒信息提供：               │
│  · 防火墙/IPS                   · 明御WAF（Web应用层）       │
│  · 终端安全/EDR                 · 明御DAS（数据库层）        │
│  · 上网行为管理                 · 堡垒机（运维层）          │
│  · VPN/零信任                   · AiLPHA（分析层）          │
│  · 安全服务                     · 玄武盾（云端层）          │
│                                                             │
│  两者结合 = 完整的纵深防御体系                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 13. 第二层厂商学习进度回顾

### 13.1 已学内容回顾

到现在为止，第二层厂商已经学习了：

```
第二层厂商学习进度（Day 37-42）

Day 37-38：启明星辰
├── Day 37：天阗IDS/IPS
└── Day 38：天清WAF

Day 39：启明星辰
└── 泰合SOC & 产品总结（老三家对比）

Day 40-42：安恒信息
├── Day 40：明御WAF & AiLPHA态势感知
├── Day 41：明御DAS & 堡垒机 & 漏洞扫描
└── Day 42：玄武盾 & 阶段总结 ← 今天

接下来：Day 43-44：长亭科技
├── Day 43：雷池WAF语义引擎深度解析
└── Day 44：洞鉴Xray & 谛听欺骗防御 & 牧云CWPP
```

### 13.2 知识地图

```
第二层厂商知识地图

                    ┌─────────────┐
                    │  第二层厂商   │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
  ┌─────▼─────┐     ┌─────▼─────┐     ┌─────▼─────┐
  │ 启明星辰   │     │ 安恒信息   │     │ 长亭科技   │
  │ (老三家)   │     │ (专科医院) │     │ (CTF冠军) │
  └─────┬─────┘     └─────┬─────┘     └─────┬─────┘
        │                  │                  │
   ┌────┼────┐        ┌────┼────┐        ┌────┼────┐
   │    │    │        │    │    │        │    │    │
  IDS  WAF  SOC      WAF  DAS 堡垒机    WAF 扫描 欺骗
  IPS                          玄武盾         CWPP
                              AiLPHA
```

---

## 14. 实操实验：搭建开源云WAF

### 14.1 实验目标

使用开源工具模拟玄武盾的核心功能：
- Nginx反向代理作为云WAF入口
- ModSecurity作为WAF引擎
- Nginx缓存作为CDN模拟
- Fail2ban/自定义脚本作为DDoS防护

### 14.2 实验架构

```
模拟架构：

用户 → [Nginx反向代理 + ModSecurity WAF + 缓存] → 后端Web应用
       ↑                                            ↑
       └── 模拟玄武盾节点                            └── 模拟源站
```

---

## 15. 实验一：Nginx反向代理WAF

### 步骤1：环境准备

```bash
mkdir -p ~/cloud-waf-lab
cd ~/cloud-waf-lab

# docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # 模拟玄武盾节点（WAF + CDN）
  waf-node:
    image: owasp/modsecurity-crs:nginx
    container_name: cloud-waf
    ports:
      - "80:80"
      - "443:443"
    environment:
      - PARANOIA=1
      - ANOMALY_INBOUND=5
      - BACKEND=http://origin-server:80
    volumes:
      - ./waf/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./waf/custom-rules.conf:/etc/modsecurity.d/owasp-crs/rules/custom-rules.conf
      - ./waf/cache:/var/cache/nginx
    networks:
      - cloud-net
    depends_on:
      - origin-server

  # 模拟源站
  origin-server:
    image: nginx:alpine
    container_name: cloud-origin
    volumes:
      - ./origin/html:/usr/share/nginx/html
      - ./origin/nginx.conf:/etc/nginx/conf.d/default.conf
    networks:
      - cloud-net

networks:
  cloud-net:
    driver: bridge
EOF
```

### 步骤2：配置WAF节点

```bash
mkdir -p ~/cloud-waf-lab/waf/cache
mkdir -p ~/cloud-waf-lab/origin/html

# WAF节点Nginx配置（模拟玄武盾前端）
cat > ~/cloud-waf-lab/waf/nginx.conf << 'EOF'
# 限流配置（DDoS防护模拟）
limit_req_zone $binary_remote_addr zone=perip:10m rate=10r/s;
limit_req_zone $server_name zone=perserver:10m rate=1000r/s;
limit_conn_zone $binary_remote_addr zone=perconn:10m;

# 缓存配置（CDN模拟）
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=cdn_cache:100m max_size=1g inactive=60m;

server {
    listen 80;
    server_name localhost;
    
    # ModSecurity WAF
    modsecurity on;
    modsecurity_rules_file /etc/modsecurity.d/owasp-crs/rules/custom-rules.conf;
    
    # DDoS防护：IP级别限流
    limit_req zone=perip burst=20 nodelay;
    limit_conn perconn 10;
    
    # 安全响应头（玄武盾会注入）
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-WAF-Node "cloud-waf-01" always;  # 模拟玄武盾节点标识
    
    # 拦截已知攻击工具
    if ($http_user_agent ~* "(sqlmap|nikto|nmap|acunetix|burpsuite)") {
        return 403;
    }
    
    # 拦截特定路径
    location ~* /(wp-admin|phpmyadmin|\.git|\.env|\.svn) {
        return 403;
    }
    
    location / {
        # ModSecurity WAF检测
        ModSecurityEnabled on;
        ModSecurityConfig modsecurity.conf;
        
        # 代理到源站
        proxy_pass http://origin-server:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-WAF-Node "cloud-waf-01";
        
        # CDN缓存配置
        proxy_cache cdn_cache;
        proxy_cache_valid 200 10m;
        proxy_cache_valid 404 1m;
        proxy_cache_key "$scheme$request_method$host$request_uri";
        proxy_cache_bypass $http_pragma $http_authorization;
        add_header X-Cache-Status $upstream_cache_status;
    }
    
    # 静态文件缓存（CDN功能）
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf)$ {
        proxy_pass http://origin-server:80;
        proxy_cache cdn_cache;
        proxy_cache_valid 200 60m;
        proxy_cache_valid 404 1m;
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header X-Cache-Status $upstream_cache_status;
    }
}
EOF

# WAF自定义规则
cat > ~/cloud-waf-lab/waf/custom-rules.conf << 'EOF'
SecRuleEngine On

# SQL注入检测
SecRule ARGS "@rx (?i)(\bselect\b.*\bfrom\b|\bunion\b.*\bselect\b|\b1\s*=\s*1|\bOR\s+['\"]?\d['\"]?\s*=\s*['\"]?\d)" \
    "id:200001,phase:2,deny,status:403,msg:'Cloud WAF: SQL Injection Detected',severity:CRITICAL"

# XSS检测
SecRule ARGS "@rx (?i)(<script[^>]*>.*?</script>|onerror\s*=|onload\s*=|javascript\s*:)" \
    "id:200002,phase:2,deny,status:403,msg:'Cloud WAF: XSS Detected',severity:CRITICAL"

# 命令注入检测
SecRule ARGS "@rx (?i)(\bcat\s+/etc/passwd\b|\b/bin/bash\b|\bcmd\.exe\b|\bwget\s+http|\bcurl\s+http)" \
    "id:200003,phase:2,deny,status:403,msg:'Cloud WAF: Command Injection Detected',severity:CRITICAL"

# CC攻击防护 - 请求频率
SecRule IP:REQUEST_RATE "@gt 100" \
    "id:200004,phase:1,deny,status:429,msg:'Cloud WAF: Rate Limit Exceeded',severity:WARNING"

# 记录所有拦截
SecRule REQUEST_URI ".*" \
    "id:200005,phase:5,pass,log,msg:'Request processed by Cloud WAF'"
EOF
```

### 步骤3：配置源站

```bash
# 源站Nginx配置
cat > ~/cloud-waf-lab/origin/nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    
    # 源站应该只接受来自WAF节点的请求
    # 在生产环境中，这里应该配置IP白名单
    
    location / {
        try_files $uri $uri/ =404;
        add_header X-Origin-Server "origin-01";
    }
}
EOF

# 源站Web内容
cat > ~/cloud-waf-lab/origin/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>受玄武盾保护的网站</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .shield { color: #2ecc71; font-size: 48px; }
        h1 { color: #2c3e50; }
    </style>
</head>
<body>
    <div class="shield">🛡️</div>
    <h1>欢迎访问受保护网站</h1>
    <p>本网站由<strong>玄武盾（模拟）</strong>提供安全防护</p>
    <p>所有流量经过：云WAF检测 → DDoS清洗 → CDN加速</p>
    <hr>
    <h2>测试链接：</h2>
    <ul>
        <li><a href="/search?q=test">搜索测试</a></li>
        <li><a href="/api/users">API接口</a></li>
        <li><a href="/login">登录页面</a></li>
    </ul>
</body>
</html>
EOF
```

### 步骤4：启动并测试

```bash
cd ~/cloud-waf-lab
docker-compose up -d

# 等待服务启动
sleep 15

# 测试正常访问
echo "=== 正常访问测试 ==="
curl -I http://localhost/
echo ""

# 测试WAF拦截
echo "=== SQL注入拦截测试 ==="
curl -I "http://localhost/search?q=test'+OR+'1'='1"
echo ""

echo "=== XSS拦截测试 ==="
curl -I "http://localhost/search?q=<script>alert(1)</script>"
echo ""

# 测试CDN缓存
echo "=== CDN缓存测试 ==="
curl -I http://localhost/index.html 2>&1 | grep -i x-cache
```

---

## 16. 实验二：配置DDoS防护策略

### 步骤1：编写DDoS防护脚本

```bash
cat > ~/cloud-waf-lab/ddos_protection.py << 'PYEOF'
#!/usr/bin/env python3
"""
DDoS云清洗模拟器
模拟玄武盾的DDoS防护功能
"""

import time
import random
from collections import defaultdict, deque
from datetime import datetime, timedelta

class CloudDDoSProtection:
    """云DDoS防护系统"""
    
    def __init__(self):
        # 流量统计
        self.ip_stats = defaultdict(lambda: {
            'request_times': deque(maxlen=1000),
            'total_requests': 0,
            'blocked': False,
            'blocked_until': None,
            'challenge_level': 0
        })
        
        # 防护阈值
        self.thresholds = {
            'qps_per_ip': 50,          # 单IP QPS阈值
            'qps_total': 10000,        # 总QPS阈值
            'concurrent_per_ip': 20,   # 单IP并发连接
            'burst_ratio': 5,          # 突发流量倍数
        }
        
        # 清洗统计
        self.cleaning_stats = {
            'total_packets': 0,
            'clean_packets': 0,
            'attack_packets': 0,
            'blocked_ips': set()
        }
        
        # 正常流量基线
        self.baseline_qps = 100  # 模拟正常QPS基线
    
    def process_request(self, ip, request_type):
        """处理单个请求"""
        now = datetime.now()
        stats = self.ip_stats[ip]
        
        # 检查是否在封禁期
        if stats['blocked']:
            if stats['blocked_until'] and now < stats['blocked_until']:
                self.cleaning_stats['attack_packets'] += 1
                return {'action': 'BLOCK', 'reason': 'IP被封禁中'}
            else:
                stats['blocked'] = False
        
        # 记录请求时间
        stats['request_times'].append(now)
        stats['total_requests'] += 1
        self.cleaning_stats['total_packets'] += 1
        
        # 计算当前QPS
        current_qps = self._calculate_qps(stats)
        
        # DDoS检测
        if current_qps > self.thresholds['qps_per_ip'] * self.thresholds['burst_ratio']:
            # 突发流量 - 直接拦截
            stats['blocked'] = True
            stats['blocked_until'] = now + timedelta(minutes=10)
            self.cleaning_stats['blocked_ips'].add(ip)
            self.cleaning_stats['attack_packets'] += 1
            return {'action': 'BLOCK', 'reason': f'DDoS攻击检测: QPS={current_qps}', 'level': 'CRITICAL'}
        
        elif current_qps > self.thresholds['qps_per_ip']:
            # 超过阈值 - 触发挑战
            stats['challenge_level'] += 1
            
            if stats['challenge_level'] > 3:
                # 连续触发 - 临时封禁
                stats['blocked'] = True
                stats['blocked_until'] = now + timedelta(minutes=5)
                self.cleaning_stats['blocked_ips'].add(ip)
                self.cleaning_stats['attack_packets'] += 1
                return {'action': 'BLOCK', 'reason': f'持续超阈值: QPS={current_qps}', 'level': 'HIGH'}
            
            if stats['challenge_level'] == 1:
                return {'action': 'CHALLENGE', 'reason': 'JS挑战', 'level': 'MEDIUM'}
            else:
                return {'action': 'CAPTCHA', 'reason': '验证码验证', 'level': 'MEDIUM'}
        
        else:
            # 正常流量
            stats['challenge_level'] = max(0, stats['challenge_level'] - 0.1)
            self.cleaning_stats['clean_packets'] += 1
            return {'action': 'PASS', 'reason': '正常流量', 'level': 'LOW'}
    
    def _calculate_qps(self, stats):
        """计算当前QPS"""
        now = datetime.now()
        one_second_ago = now - timedelta(seconds=1)
        
        recent_requests = sum(1 for t in stats['request_times'] if t > one_second_ago)
        return recent_requests
    
    def get_cleaning_report(self):
        """生成清洗报告"""
        total = self.cleaning_stats['total_packets']
        clean = self.cleaning_stats['clean_packets']
        attack = self.cleaning_stats['attack_packets']
        
        print("\n" + "=" * 60)
        print("  玄武盾 DDoS清洗报告")
        print("=" * 60)
        print(f"  总流量包数: {total}")
        print(f"  正常流量: {clean} ({clean/total*100:.1f}%)" if total > 0 else "  正常流量: 0")
        print(f"  攻击流量: {attack} ({attack/total*100:.1f}%)" if total > 0 else "  攻击流量: 0")
        print(f"  封禁IP数: {len(self.cleaning_stats['blocked_ips'])}")
        print(f"  清洗效率: 成功拦截{attack}个攻击包" if attack > 0 else "  清洗效率: 无攻击")
        print("=" * 60)


def simulate_ddos_attack():
    """模拟DDoS攻击场景"""
    protector = CloudDDoSProtection()
    
    normal_ips = [f"192.168.1.{i}" for i in range(1, 11)]  # 10个正常用户
    attack_ips = [f"10.0.0.{i}" for i in range(1, 6)]      # 5个攻击者
    
    print("=" * 60)
    print("  模拟玄武盾DDoS防护")
    print("=" * 60)
    print(f"  正常用户IP: {len(normal_ips)}个")
    print(f"  攻击者IP: {len(attack_ips)}个")
    print(f"  模拟时长: 30秒\n")
    
    # 模拟30秒的流量
    for second in range(30):
        # 正常用户：每秒1-5个请求
        for ip in normal_ips:
            num_requests = random.randint(1, 5)
            for _ in range(num_requests):
                result = protector.process_request(ip, 'GET /index.html')
        
        # 攻击者：每秒20-100个请求（DDoS攻击）
        for ip in attack_ips:
            num_requests = random.randint(20, 100)
            for _ in range(num_requests):
                result = protector.process_request(ip, 'GET /')
                if result['action'] == 'BLOCK':
                    if random.random() < 0.05:  # 只打印5%的拦截日志
                        print(f"  [{second}s] 🚫 {ip} - {result['reason']}")
        
        if second % 10 == 0 and second > 0:
            protector.get_cleaning_report()
        
        time.sleep(0.1)  # 模拟时间流逝
    
    # 最终报告
    protector.get_cleaning_report()


if __name__ == "__main__":
    simulate_ddos_attack()
PYEOF

python3 ~/cloud-waf-lab/ddos_protection.py
```

---

## 17. 实验三：搭建CDN+WAF一体化防护

### 步骤1：完整的防护测试脚本

```bash
cat > ~/cloud-waf-lab/full_test.sh << 'SCRIPT'
#!/bin/bash

WAF_URL="http://localhost"
PASS=0
FAIL=0
TOTAL=0

echo "========================================"
echo "  玄武盾完整功能测试"
echo "========================================"
echo ""

# 测试函数
run_test() {
    local name="$1"
    local expected_code="$2"
    local curl_cmd="$3"
    
    ((TOTAL++))
    
    http_code=$(eval "$curl_cmd" 2>/dev/null)
    
    if [ "$http_code" == "$expected_code" ]; then
        echo "  ✅ $name (返回 $http_code)"
        ((PASS++))
    else
        echo "  ❌ $name (返回 $http_code, 预期 $expected_code)"
        ((FAIL++))
    fi
}

echo "--- 正常访问测试 ---"
run_test "首页访问" "200" "curl -s -o /dev/null -w '%{http_code}' $WAF_URL/"
run_test "搜索正常参数" "200" "curl -s -o /dev/null -w '%{http_code}' '$WAF_URL/search?q=hello'"

echo ""
echo "--- WAF攻击拦截测试 ---"
run_test "SQL注入-OR语句" "403" "curl -s -o /dev/null -w '%{http_code}' \"$WAF_URL/search?q=test'+OR+'1'='1\""
run_test "SQL注入-UNION" "403" "curl -s -o /dev/null -w '%{http_code}' \"$WAF_URL/search?q=test'+UNION+SELECT\""
run_test "XSS-script标签" "403" "curl -s -o /dev/null -w '%{http_code}' \"$WAF_URL/search?q=<script>alert(1)</script>\""
run_test "命令注入" "403" "curl -s -o /dev/null -w '%{http_code}' \"$WAF_URL/search?q=;cat+/etc/passwd\""

echo ""
echo "--- 扫描器拦截测试 ---"
run_test "sqlmap UA" "403" "curl -s -o /dev/null -w '%{http_code}' -H 'User-Agent: sqlmap/1.0' $WAF_URL/"
run_test "nikto UA" "403" "curl -s -o /dev/null -w '%{http_code}' -H 'User-Agent: nikto' $WAF_URL/"

echo ""
echo "--- CDN缓存测试 ---"
run_test "CDN缓存命中" "200" "curl -s -o /dev/null -w '%{http_code}' $WAF_URL/index.html"

echo ""
echo "--- 安全响应头测试 ---"
echo "  安全响应头检查:"
curl -sI $WAF_URL/ 2>&1 | grep -E "(X-Content-Type-Options|X-Frame-Options|X-XSS-Protection|X-WAF-Node)"

echo ""
echo "========================================"
echo "  测试完成: $PASS/$TOTAL 通过, $FAIL 失败"
echo "========================================"
SCRIPT

chmod +x ~/cloud-waf-lab/full_test.sh
cd ~/cloud-waf-lab
./full_test.sh
```

---

## 18. 验收练习

### 基础题（必答）

**Q1：玄武盾的三大核心功能是什么？它们为什么要整合在一起？**

<details>
<summary>点击查看答案</summary>

三大核心功能：云WAF、DDoS云清洗、CDN加速。

整合原因：
1. 部署位置相同（都在用户和源站之间）
2. 流量都经过（同一份流量复用）
3. CDN缓存本身就是DDoS防护手段
4. 源站隐藏（CDN和WAF都需要隐藏源站IP）

</details>

**Q2：玄武盾（云WAF）和明御WAF（硬件WAF）有什么区别？各自适合什么场景？**

<details>
<summary>点击查看答案</summary>

| 维度 | 玄武盾 | 明御WAF |
|------|--------|---------|
| 部署 | SaaS，DNS指向 | 硬件部署 |
| 成本 | 按需付费 | 一次性采购 |
| DDoS | Tbps级清洗 | 受硬件限制 |
| 延迟 | +5-20ms | +<1ms |
| 定制化 | 受限 | 灵活 |

玄武盾适合：中小企业、云上业务、需要DDoS防护
明御WAF适合：大型企业、合规要求高、低延迟要求

</details>

**Q3：安恒信息的三大差异化优势是什么？**

<details>
<summary>点击查看答案</summary>

1. Web安全专家：15年+深耕，ML学习引擎行业领先
2. 数据安全新贵：DAS旁路零影响+三层关联审计，形成完整数据安全链
3. AI先行者：2015年推出AiLPHA，UEBA+告警降噪技术成熟

</details>

### 进阶题（选答）

**Q4：安恒信息为什么被称为"专科医院"？这种定位的优缺点是什么？**

<details>
<summary>点击查看答案</summary>

定位原因：安恒专注于Web安全和数据安全两个领域，不像深信服/奇安信那样做10+条产品线。

优点：技术深度极高，在核心领域做到95分+；资源聚焦，不分散；行业口碑好。

缺点：产品线窄，无法提供"全家桶"一站式方案；需要和其他厂商产品配合使用。

</details>

**Q5：玄武盾如何实现DDoS防护？描述防护层级。**

<details>
<summary>点击查看答案</summary>

防护层级（从外到内）：
1. 网络层（L3/L4）：SYN Cookie、流量限速、黑洞路由
2. 应用层（L7）：HTTP Flood检测、速率限制、挑战验证
3. 智能识别：IP信誉、行为分析、设备指纹
4. 清洗流程：检测→判断→清洗→回注

</details>

---

## 19. 今日总结

### 核心收获

今天，我们完成了安恒信息最后一款重要产品（玄武盾）的学习，并进行了全产品线回顾：

**1. 玄武盾**
- 云安全SaaS平台 = 云WAF + DDoS清洗 + CDN加速
- 核心价值：无需硬件部署、弹性扩展、源站隐藏
- 与明御WAF互补：云端粗筛 + 本地精检

**2. 安恒全产品线回顾**
- Web安全：明御WAF + 玄武盾
- 数据安全：明御DAS + 堡垒机 + 数据库加密 + 数据脱敏
- AI分析：AiLPHA态势感知
- 形成了"Web→数据→AI"三位一体的产品矩阵

**3. 安恒定位总结**
- 专而精的"专科医院"
- 三大差异化：Web安全专家 + 数据安全新贵 + AI先行者
- 与第一层厂商是互补关系

### 记忆口诀

```
安恒三日全回顾：
第一天学明御WAF，ML引擎是法宝
第二天学DAS和堡垒，旁路审计零影响
第三天学玄武盾，云端防护一站齐
Web安全起家早，数据安全延伸妙
AI大脑AiLPHA，专而精是护城河
```

### 下一步

明天（Day 43），我们将进入长亭科技的学习，深入了解雷池WAF的SQL语义分析引擎——这是WAF领域的另一个技术巅峰。

---

> **今日格言**：最好的安全防护，是你根本不知道它的存在——就像玄武盾，攻击者在云端就被挡住了，而你的网站依然正常服务。

> **扩展思考**：如果你是CTO，你会选择采购安恒的明御WAF硬件还是订阅玄武盾云服务？请从成本、安全、性能三个维度分析。
