# Day 41：TLS/SSL协议深度解析

> **所属周**：Week 6 — 加密技术 · **主题**：TLS协议、握手流程与安全配置

---

## 📑 目录

1. [TLS协议演进历史](#一tls协议演进历史)
2. [TLS 1.3握手流程详解](#二tls-13握手流程详解)
3. [TLS 1.2 vs TLS 1.3全面对比](#三tls-12-vs-tls-13全面对比)
4. [加密套件深度解析](#四加密套件深度解析)
5. [TLS常见攻击与防御](#五tls常见攻击与防御)
6. [证书验证流程](#六证书验证流程)
7. [TLS 1.3性能优化](#七tls-13性能优化)
8. [安全配置最佳实践](#八安全配置最佳实践)
9. [CISP考试速查](#cisp考试速查)
10. [自检清单](#自检清单)

---

## 一、TLS协议演进历史

### 1.1 演化时间线

```
1994: SSL 1.0 — 内部开发，从未发布（安全漏洞太多）
1995: SSL 2.0 — 首次发布，很快被发现多个严重漏洞
1996: SSL 3.0 — 完全重写，奠定现代TLS基础
1999: TLS 1.0 — SSL 3.0的标准化升级（RFC 2246）
2006: TLS 1.1 — 新增对CBC攻击的防护（RFC 4346）
2008: TLS 1.2 — 支持AEAD、SHA-256（RFC 5246）
2018: TLS 1.3 — 简化握手、前向保密强制（RFC 8446）

禁用时间线：
  ✓ SSL 2.0 → 2011年禁用（RFC 6176）
  ✓ SSL 3.0 → 2015年禁用（RFC 7568, POODLE）
  ✓ TLS 1.0 → 2020年禁用（PCI DSS/Browser）
  ✓ TLS 1.1 → 2020年禁用（PCI DSS/Browser）
```

### 1.2 协议层结构

```
┌──────────────────────────────────────────┐
│          Application Layer (HTTP)        │  ← 应用数据
├──────────────────────────────────────────┤
│          Handshake │ Alert │ CCS         │  ← TLS子协议
├──────────────────────────────────────────┤
│          Record Protocol                 │  ← TLS记录层
├──────────────────────────────────────────┤
│          TCP (可靠传输)                   │  ← 传输层
└──────────────────────────────────────────┘

TLS子协议说明：
  · Handshake：密钥协商和身份认证
  · Change Cipher Spec (CCS)：通知切换加密状态（TLS 1.3中废除）
  · Alert：错误和警告通知
  · Application Data：加密传输应用数据
```

---

## 二、TLS 1.3握手流程详解

### 2.1 完整握手（1-RTT）

```
Client                                           Server
  │                                               │
  │──── ClientHello ────────────────────────────→│
  │     · 支持的加密套件                            │
  │     · key_share (ECDHE公钥)                    │
  │     · 支持的签名算法                            │
  │     · PSK扩展（可选）                          │
  │                                               │
  │←─── ServerHello ────────────────────────────│
  │     · 选定的加密套件                            │
  │     · key_share (ECDHE公钥)                    │
  │     {EncryptedExtensions}                     │
  │     {Certificate}          ← 加密！            │
  │     {CertificateVerify}                        │
  │     {Finished}                                │
  │                                               │
  │──── {Finished} ─────────────────────────────→│
  │     {Application Data}                        │
  │                                               │
  │←─── {Application Data} ────────────────────│
  │                                               │

总RTT: 1 (vs TLS 1.2 的 2-RTT)
握手消息数: 4 (vs TLS 1.2 的 6-7)
```

### 2.2 0-RTT恢复握手

```
TLS 1.3的0-RTT（早期数据）特性：

前提：客户端和服务器之前建立过连接，拥有PSK

Client                                           Server
  │                                               │
  │──── ClientHello (PSK+key_share) ────────────→ │
  │──── {Early Application Data} ───────────────→ │  ← 0-RTT!
  │                                               │
  │←─── {ServerHello + EncryptedExtensions...} ── │
  │←─── {Finished + Application Data} ──────────  │
  │                                               │
  │──── {Finished} ─────────────────────────────→ │

优势：首包即可发送应用数据
风险：0-RTT数据有重放攻击风险（幂等操作必须做防护）
```

---

## 三、TLS 1.2 vs TLS 1.3全面对比

### 3.1 核心差异

| 特性 | TLS 1.2 | TLS 1.3 |
|------|---------|---------|
| **握手RTT** | 2-RTT | 1-RTT（0-RTT可选） |
| **密钥交换** | 非强制 | 仅支持DHE/ECDHE |
| **前向保密** | 可选 | 强制 |
| **加密套件** | 300+组合 | 5种核心套件 |
| **握手加密** | 明文握手 | ServerHello之后全加密 |
| **对称算法** | CBC/CTR/GCM | 仅AEAD（GCM/CCM/Poly1305） |
| **静态RSA** | 支持 | 移除 |
| **SHA-1** | 允许 | 移除 |
| **压缩** | 支持 | 移除（CRIME攻击） |
| **重协商** | 支持 | 移除 |
| **Change Cipher Spec** | 需要 | 保留仅为了兼容 |

### 3.2 TLS 1.3五大加密套件

```
TLS_AES_128_GCM_SHA256          ← 最常用（硬件加速）
TLS_AES_256_GCM_SHA384          ← 高安全要求
TLS_CHACHA20_POLY1305_SHA256    ← 移动/嵌入式设备优先
TLS_AES_128_CCM_SHA256          ← 物联网
TLS_AES_128_CCM_8_SHA256         ← 8字节认证标签（物联网短包）

历史对比：TLS 1.2有300+种组合，大部分不安全！
```

---

## 四、加密套件深度解析

### 4.1 TLS 1.2套件命名

```
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
│    │     │    │    │     │    │     │
│    │     │    │    │     │    │     └─ HMAC/SHA算法
│    │     │    │    │     │    └─ 加密模式
│    │     │    │    │     └─ 对称加密算法
│    │     │    │    └─ 加密模式（可选）
│    │     │    └─ 对称加密算法
│    │     └─ 证书认证算法
│    └─ 密钥交换算法
└─ 协议版本

解读：
  ECDHE = 短暂椭圆曲线DH密钥交换（前向保密）
  RSA   = 使用RSA证书进行身份认证
  AES_128_GCM = AES-128 GCM模式对称加密
  SHA256 = SHA-256 HMAC伪随机函数
```

### 4.2 加密套件安全评级

```
推荐（2024）：
  ✅ TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
  ✅ TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
  ✅ TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256
  ✅ TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
  ✅ TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384

禁止使用：
  ❌ 任何包含 NULL 的套件
  ❌ 任何包含 EXPORT 的套件
  ❌ 任何包含 DES, 3DES, RC4 的套件
  ❌ 任何包含 MD5 的套件
  ❌ 任何 CBC 模式套件（Lucky13风险）
  ❌ 任何 RSA 密钥交换套件（无前向保密）
  ❌ 任何静态 DH 套件
```

---

## 五、TLS常见攻击与防御

### 5.1 攻击全景

```
┌──────────────┬──────────┬──────────────────────────────┐
│    攻击      │   年份   │           防御               │
├──────────────┼──────────┼──────────────────────────────┤
│ BEAST        │   2011   │ TLS 1.1+ 或 非CBC套件       │
│ CRIME        │   2012   │ 禁用TLS压缩                  │
│ BREACH       │   2013   │ 禁用HTTP压缩 + CSRF防护      │
│ Lucky13      │   2013   │ 禁用CBC模式                  │
│ POODLE       │   2014   │ 禁用SSLv3                    │
│ FREAK        │   2015   │ 禁用EXPORT套件               │
│ Logjam       │   2015   │ 使用≥2048位DH                │
│ DROWN        │   2016   │ 禁用SSLv2、禁用RSA密钥重用    │
│ Sweet32      │   2016   │ 禁用64位分组密码(3DES)        │
│ ROBOT        │   2017   │ 禁用RSA-PKCS#1 v1.5          │
│ Zombie POODLE│   2019   │ 使用TLS 1.3                  │
│ ALPACA       │   2021   │ 严格SNI检查、ALPN强制        │
└──────────────┴──────────┴──────────────────────────────┘
```

### 5.2 DROWN攻击详解

```
DROWN (2016) — CVE-2016-0800

攻击条件：
  1. 服务器同时支持TLS和SSLv2（同一RSA密钥）
  2. SSLv2支持EXPORT级加密（40位）

攻击流程：
  1. 攻击者捕获目标TLS连接
  2. 利用同一RSA密钥的SSLv2服务器
  3. 发送特制SSLv2握手 → 获得服务器RSA密钥相关信息
  4. 经过平均2^50次SSLv2连接 → 恢复RSA私钥
  5. 解密之前捕获的TLS会话

影响：约33%的HTTPS服务器受影响
```

### 5.3 FREAK攻击

```
FREAK (2015) — 出口级加密降级攻击

背景：1990年代美国出口限制，RSA密钥最长512位

攻击原理：
  1. MITM拦截ClientHello，篡改为只支持EXPORT套件
  2. 服务器使用≤512位RSA密钥
  3. 攻击者分布式计算破解512位RSA
  4. 解密所有后续流量

防御：
  ✅ 禁用所有EXPORT加密套件
  ✅ 客户端拒绝512位RSA
```

---

## 六、证书验证流程

### 6.1 完整验证链

```
浏览器验证TLS证书的10个步骤：

① 证书是否在有效期内？
② 证书是否已被吊销？（OCSP/CRL检查）
③ 颁发者CA是否是受信任的？
④ 证书链是否完整？（叶→中间CA→根CA）
⑤ 证书签名验证是否通过？
⑥ 证书域名是否与访问域名匹配？
⑦ 密钥用法扩展是否正确？（digitalSignature/keyEncipherment）
⑧ 扩展密钥用法是否正确？（serverAuth）
⑨ 基本约束是否正确？（CA:FALSE/TRUE）
⑩ CT SCT是否满足要求？（Chrome要求≥2个）

任何一个检查失败 → 证书不被信任
```

### 6.2 HSTS与安全预加载

```
HSTS (HTTP Strict Transport Security)：

响应头：
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

作用：
  max-age：浏览器强制HTTPS的时间（秒）
  includeSubDomains：所有子域名也强制HTTPS
  preload：允许加入浏览器的HSTS预加载列表

HSTS预加载列表：
  → 浏览器内置的仅HTTPS域名清单
  → 首次访问就是HTTPS，永不降级
  → 提交地址：https://hstspreload.org/
  → Google, Facebook, PayPal等均在列表中
```

---

## 七、TLS 1.3性能优化

### 7.1 性能提升原因

```
TLS 1.3性能优于TLS 1.2的原因：

① 减少RTT：
   TLS 1.2: ClientHello → ServerHello+Certs → ClientKeyExchange+Finished → 2-RTT
   TLS 1.3: ClientHello(key_share) → ServerHello+Certs+Finished → 1-RTT

② 简化握手：
   减少消息数量，服务器可提前发送证书

③ 0-RTT恢复：
   支持会话恢复的0-RTT模式，连接即发送数据

④ 更好的加密算法：
   仅支持AEAD，硬件加速广泛支持

实际性能：
  握手时间：TLS 1.2平均300ms → TLS 1.3平均100ms
  首次连接：减少约1个RTT（取决于网络延迟）
```

---

## 八、安全配置最佳实践

### 8.1 Nginx TLS安全配置

```nginx
# 强制TLS 1.2+，禁用过时协议
ssl_protocols TLSv1.2 TLSv1.3;

# 推荐加密套件（Mozilla Intermediate）
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:
            ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:
            ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;

# 服务器选择套件顺序
ssl_prefer_server_ciphers on;

# 启用HSTS
add_header Strict-Transport-Security "max-age=63072000" always;

# DH参数 ≥ 2048位
ssl_dhparam /etc/nginx/dhparam.pem;

# 启用OCSP Stapling
ssl_stapling on;
ssl_stapling_verify on;

# 会话缓存
ssl_session_cache shared:SSL:50m;
ssl_session_timeout 1d;
ssl_session_tickets off;  # TLS 1.3建议关闭ticket以强制前向保密
```

### 8.2 配置检查工具

| 工具 | 用途 |
|------|------|
| **Qualys SSL Labs** | 在线TLS配置评分 |
| **testssl.sh** | 命令行TLS全面检测 |
| **sslscan** | 快速扫描支持的套件 |
| **Mozilla SSL Config Generator** | 自动生成安全配置 |
| **cipherscan** | 分析服务器加密套件 |

### 8.3 安全评分基线

```
Qualys SSL Labs评分标准：

  A+   → HSTS + 全部绿色（推荐目标）
  A    → 无HSTS或弱DH
  B    → 支持RC4、3DES或弱DH
  C    → 支持SSLv3
  F    → 易受已知攻击、证书过期

目标：至少达到A级，争取A+
```

---

## 九、CISP考试速查

### 关键知识点

| 考点 | 记忆要点 |
|------|---------|
| TLS最新版本 | "TLS 1.3 (RFC 8446, 2018)" |
| TLS 1.3最大改进 | "1-RTT握手 + 仅AEAD + 强制前向保密" |
| ECDHE的含义 | "短暂椭圆曲线DH → 前向保密" |
| DROWN攻击关键 | "同一RSA密钥 + SSLv2 = 私钥恢复" |
| HSTS响应头 | "max-age + includeSubDomains + preload" |
| CT要求 | "Chrome要求≥2个SCT" |
| 推荐套件判断 | "有ECDHE、有GCM/CHACHA20、无CBC/RC4/DES" |

### 常见陷阱

1. **"TLS证书安全=整个连接安全"** → 证书只是身份认证，还需要正确的加密套件
2. **"用了HTTPS就不会被中间人"** → 需要配合HSTS、证书钉扎
3. **"所有加密套件都一样安全"** → 很多套件已知存在漏洞
4. **"TLS 1.2足够安全不需要升级"** → TLS 1.3消除了多个攻击面

---

## 十、自检清单

- [ ] 知道TLS 1.3相比TLS 1.2的三大核心改进吗？
- [ ] 能解释TLS 1.3的1-RTT握手流程吗？
- [ ] 哪些加密套件应该被禁止使用？
- [ ] DROWN攻击利用了协议栈中的哪一层漏洞？
- [ ] HSTS的三个参数分别是什么意思？
- [ ] 浏览器验证证书的10个步骤大概是什么？
- [ ] 知道至少5种TLS攻击及其防御方法吗？
- [ ] Nginx安全配置关键点掌握了哪些？

---

> **下一步**：Day 42 第六周总结与测验，全面回顾密码学知识体系并检验学习成果。
