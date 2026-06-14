# Day 42：第六周总结与测验

> **所属周**：Week 6 — 加密技术 · **主题**：密码学知识体系全面回顾与模拟测验

---

## 📑 目录

1. [第六周知识地图](#一第六周知识地图)
2. [每日精华回顾](#二每日精华回顾)
3. [核心对比表汇总](#三核心对比表汇总)
4. [关键数字记忆](#四关键数字记忆)
5. [模拟测验（20题）](#五模拟测验20题)
6. [CISP专题强化](#六cisp专题强化)
7. [常见混淆辨析](#七常见混淆辨析)
8. [下周预览](#八下周预览)
9. [学习进度检查](#九学习进度检查)

---

## 一、第六周知识地图

```
                    ┌─────────────────────────┐
                    │     密码学知识体系       │
                    └───────────┬─────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
    ┌─────▼─────┐       ┌──────▼──────┐      ┌───────▼───────┐
    │ 对称加密   │       │ 非对称加密   │      │  哈希函数      │
    │ (Day 32/36)│       │ (Day 33/37) │      │  (Day 34/38)  │
    ├───────────┤       ├─────────────┤      ├───────────────┤
    │· AES      │       │· RSA        │      │· SHA-256     │
    │· DES/3DES │       │· ECC        │      │· SM3         │
    │· SM4      │       │· DH/ECDH    │      │· MD5 (退役)  │
    │· 工作模式  │       │· 签名/加密   │      │· 生日攻击    │
    └─────┬─────┘       └──────┬──────┘      └───────┬───────┘
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │    PKI体系 (Day 35/40) │
                    ├───────────────────────┤
                    │· CA/RA/CRL/OCSP       │
                    │· X.509证书结构         │
                    │· 密钥生命周期          │
                    │· Certificate Transparency│
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │    TLS/SSL (Day 41)    │
                    ├───────────────────────┤
                    │· TLS 1.2 vs TLS 1.3   │
                    │· 握手流程              │
                    │· 加密套件安全分析       │
                    │· 常见攻击(DROWN等)     │
                    └───────────────────────┘
```

---

## 二、每日精华回顾

### Day 32：对称加密算法详解
```
核心掌握：
  · AES-128/192/256的分组大小(128位)和密钥长度
  · 5种工作模式：ECB(不推荐)/CBC/CTR/GCM(推荐)/CFB
  · GCM = CTR + GMAC = 加密+认证 (AEAD)
  · SM4：中国国密对称算法
```

### Day 33：非对称加密算法详解
```
核心掌握：
  · RSA安全性 = 大数分解困难性
  · ECC优势：256位ECC ≈ 3072位RSA安全强度
  · 公钥加密 → 用接收方公钥
  · 数字签名 → 用发送方私钥
  · DH/ECDHE → 密钥协商，提供前向保密
```

### Day 34：哈希函数深入
```
核心掌握：
  · 哈希三大安全属性：抗原像性、抗第二原像性、抗碰撞性
  · MD5(128位)和SHA-1(160位)已不安全
  · 生日攻击复杂度：O(2^(n/2))
  · 密码存储演化：明文→Hash→Hash+Salt→Slow Hash→Argon2id
```

### Day 35：数字签名与PKI体系
```
核心掌握：
  · 数字签名流程：Hash→私钥签名→公钥验证
  · PKI五要素：CA/RA/CRL/OCSP/密钥管理
  · X.509证书：版本号、序列号、颁发者、有效期、主体、公钥、扩展
  · 信任模型：层级(Root CA)、网状(PGP)、桥接
```

### Day 36：分组密码工作模式与实战
```
核心掌握：
  · ECB致命缺陷：相同明文→相同密文（企鹅效应）
  · CBC填充Oracle攻击 → Encrypt-then-MAC 或迁移GCM
  · CTR Nonce重用 → Two-time pad → 密钥流抵消
  · AEAD是现代推荐的唯一选择
```

### Day 37：非对称加密的攻击与防御
```
核心掌握：
  · 共模攻击：相同n共享导致全部私钥泄露
  · Sony PS3：ECDSA随机数k重用 → 私钥恢复
  · ROCA漏洞：弱素数生成 → 7.5亿设备受影响
  · 侧信道：计时攻击、功耗分析、故障注入
  · 量子威胁：Shor算法 → 后量子密码(Kyber等)
```

### Day 38：哈希函数的攻防实战
```
核心掌握：
  · 长度扩展攻击：H(secret||msg) → 可计算H(secret||msg||padding||extra)
  · 防御：HMAC（双哈希隔离）或 SHA-3
  · HMAC公式：H(K⊕opad || H(K⊕ipad || m))
  · 彩虹表对加盐哈希无效
  · Merkle树：O(log n)验证，区块链基础
```

### Day 39：数字签名与PKI部署实战
```
核心掌握：
  · CT三组件：Log + Monitor + Auditor
  · 证书钉扎：必须含backup pin
  · ACME：HTTP-01(放文件) / DNS-01(加TXT记录)
  · CAA记录：限制谁能签发域名证书
  · 国密：SM2签名 + SM3哈希 + SM4加密
```

### Day 40：PKI体系架构
```
核心掌握：
  · CP vs CPS：证书策略 vs 认证业务说明
  · 密钥生命周期：生成→分发→存储→使用→轮换→归档→销毁
  · HSM安全等级：FIPS 140-2 Level 1-4
  · CT：Merkle Tree Hash验证
```

### Day 41：TLS/SSL协议深度解析
```
核心掌握：
  · TLS 1.3 → 1-RTT握手 + 仅AEAD + 强制前向保密
  · DROWN攻击 → 同密钥SSLv2 → 私钥恢复
  · HSTS → max-age + includeSubDomains + preload
  · 禁用的：NULL、EXPORT、DES、RC4、MD5、CBC、静态RSA
  · 套件判断：有ECDHE + 有GCM/CHACHA = 安全
```

---

## 三、核心对比表汇总

### 加密体系对比

| 特性 | 对称加密 | 非对称加密 | 哈希函数 |
|------|---------|-----------|---------|
| 密钥数量 | 1个（共享） | 2个（公钥+私钥） | 0个（无密钥） |
| 速度 | 快 | 慢（100-1000倍） | 快 |
| 主要用途 | 数据加密 | 密钥交换、签名 | 完整性、密码存储 |
| 代表算法 | AES-256-GCM | RSA-3072, ECC-P256 | SHA-256, SM3 |
| 是否可逆 | 是（解密） | 是（解密/验证） | 否（单向） |

### 算法安全基线

| 算法类别 | 当前推荐 | 已淘汰 | 后继者 |
|---------|---------|--------|--------|
| 对称加密 | AES-256-GCM | DES, 3DES, RC4 | ChaCha20-Poly1305 |
| 非对称加密 | ECC P-256 | RSA-1024 | 后量子Kyber |
| 哈希 | SHA-256/SHA-3 | MD5, SHA-1 | BLAKE3 |
| 密码存储 | Argon2id | MD5/SHA1(pass) | - |
| 签名 | Ed25519, ECDSA | RSA-PKCS#1v1.5 | Dilithium |

---

## 四、关键数字记忆

```
┌─────────────────────────────────────────────────────────┐
│                Week 6 必记数字                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  · AES分組大小：128位（16字节）                          │
│  · AES-256密钥：256位                                    │
│  · SHA-256输出：256位                                    │
│  · SHA-1输出：160位                                      │
│  · MD5输出：128位                                        │
│  · SM3输出：256位                                        │
│                                                         │
│  · ECC P-256安全强度：128位（≈RSA 3072位）              │
│                                                         │
│  · DES密钥：56位（已破）                                  │
│  · 3DES有效密钥：112位（已弱）                            │
│                                                         │
│  · GCM推荐Nonce：96位（12字节）                          │
│  · GCM推荐Tag：128位                                     │
│                                                         │
│  · 生日攻击复杂度：O(2^(n/2))                           │
│  · SHA-1碰撞复杂度：约2^63（已实现）                     │
│                                                         │
│  · RSA常见e值：65537 (2^16+1)                           │
│  · X.509证书版本：v3                                     │
│                                                         │
│  · TLS 1.3标准年份：2018 (RFC 8446)                     │
│  · HSTS默认max-age：31536000 (1年)                      │
│                                                         │
│  · Let's Encrypt证书有效期：90天                        │
│  · Chrome要求SCT数量：≥2                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 五、模拟测验（20题）

### 📝 单选题

**1. AES-256-GCM中，"GCM"提供的关键特性是什么？**

A. 仅加密数据
B. 加密并认证数据（AEAD）
C. 仅认证数据
D. 密钥交换

<details><summary>答案</summary>

**B** — GCM（Galois/Counter Mode）是AEAD模式，同时提供数据加密和完整性认证。
</details>

---

**2. ECC P-256的安全强度与哪个RSA密钥相当？**

A. RSA-1024
B. RSA-2048
C. RSA-3072
D. RSA-4096

<details><summary>答案</summary>

**C** — ECC P-256提供128位安全强度，相当于RSA-3072。
</details>

---

**3. 以下哪种模式不应在任何生产环境使用？**

A. GCM
B. CBC
C. CTR
D. ECB

<details><summary>答案</summary>

**D** — ECB模式因"相同明文→相同密文"的致命弱点不应在任何场景使用。
</details>

---

**4. SHA-256面对生日攻击时的安全强度约为多少位？**

A. 256位
B. 128位
C. 64位
D. 512位

<details><summary>答案</summary>

**B** — 生日攻击将碰撞复杂度从O(2^n)降为O(2^(n/2))，即约128位。
</details>

---

**5. 当前密码存储最推荐使用的算法是？**

A. MD5
B. SHA-256 + Salt
C. bcrypt
D. Argon2id

<details><summary>答案</summary>

**D** — Argon2id是2015年密码哈希竞赛的获胜者，具有可调内存、时间和并行参数，是当前最推荐的选择。
</details>

---

**6. TLS 1.3相比TLS 1.2的重大变化不包括？**

A. 握手从2-RTT减少到1-RTT
B. 强制前向保密
C. 支持更多加密套件
D. 移除静态RSA密钥交换

<details><summary>答案</summary>

**C** — TLS 1.3大幅减少了加密套件数量，从300+减少到5个核心套件。
</details>

---

**7. DROWN攻击利用了协议栈中的哪种漏洞？**

A. TLS 1.3的0-RTT模式
B. 同一RSA密钥在SSLv2中的复用
C. DH参数过短
D. CBC填充方式

<details><summary>答案</summary>

**B** — DROWN利用服务器在TLS和SSLv2中使用相同RSA密钥，通过攻击SSLv2来恢复TLS会话密钥。
</details>

---

**8. 数字签名中，哪种密钥用于签名操作？**

A. 接收方公钥
B. 发送方私钥
C. 双方共享密钥
D. 发送方公钥

<details><summary>答案</summary>

**B** — 数字签名使用发送方私钥进行签名，接收方用发送方公钥验证。
</details>

---

**9. HMAC的公式为？**

A. H(Key || Message)
B. H(Message || Key)
C. H((K⊕opad) || H((K⊕ipad) || m))
D. H(K⊕(Message))

<details><summary>答案</summary>

**C** — HMAC使用双重哈希隔离密钥，防止长度扩展攻击等。
</details>

---

**10. CT（Certificate Transparency）的三个核心组件是？**

A. CA, RA, CRL
B. Log, Monitor, Auditor
C. Issuer, Subject, Policy
D. DNS, HTTP, SMTP

<details><summary>答案</summary>

**B** — CT的核心组件是证书日志(Log)、监控器(Monitor)和审计器(Auditor)。
</details>

---

### 📝 判断题

**11. SCRYPT比bcrypt更好地抵抗GPU/ASIC攻击，因为它需要大量内存。**
<details><summary>答案</summary>✅ 正确 — scrypt设计为内存困难函数，但Argon2id是更新的推荐方案。</details>

**12. GCM模式下，对于同一密钥，Nonce绝对不可重复使用。**
<details><summary>答案</summary>✅ 正确 — Nonce重用会恢复认证密钥，完全破坏安全性。</details>

**13. 长度为256位的ECDSA密钥与长度为256位的AES密钥提供相同的安全强度。**
<details><summary>答案</summary>❌ 错误 — ECC 256位提供128位安全强度（需对抗离散对数），AES 256位提供256位安全强度（需对抗暴力搜索）。</details>

**14. 国密SM2可用于数字签名和密钥交换。**
<details><summary>答案</summary>✅ 正确 — SM2是椭圆曲线公钥密码算法，支持数字签名、密钥交换和公钥加密。</details>

**15. HSTS的预加载(preload)列表是由各网站自行维护的本地列表。**
<details><summary>答案</summary>❌ 错误 — HSTS预加载列表是浏览器内置的、由Google维护的全局列表，网站需主动提交申请。</details>

---

### 📝 案例分析题

**16-17. RSA共模攻击场景：**

Alice与Bob使用相同的n但不同的e（e_A=3, e_B=5），一条相同的明文m被分别加密发送给两人。攻击者截获了C_A=m³ mod n和C_B=m⁵ mod n。如何恢复m？

<details><summary>答案</summary>

由于gcd(3,5)=1，根据扩展欧几里得算法找到x,y使3x+5y=1：
x=2, y=-1（因为3×2+5×(-1)=1）

m = C_A² × C_B^(-1) mod n = (m³)² × (m⁵)^(-1) = m^6 × m^(-5) = m¹ mod n

核心原因：相同明文用不同e加密，且gcd(e1,e2)=1时可恢复。**防御：永远不要对相同明文使用不同公钥加密！添加随机填充（OAEP）。**
</details>

---

**18. 长度扩展攻击场景：**

某应用使用H(secret||message)验证API请求。攻击者截获了一个有效请求：message1="user=alice&action=view"，对应MAC=H(secret||message1)。如何伪造MAC？

<details><summary>答案</summary>

利用Merkle-Damgård结构的长度扩展特性：
1. 以原MAC值作为内部状态
2. 继续计算`&action=delete&target=admin`的哈希
3. 得到新MAC'=H(secret||message1||padding||appended)
4. 发送message1+padding+appended的消息 + MAC'
5. 服务器验证通过

**防御：使用HMAC替代简单H(secret||message)。**
</details>

---

**19. CBC填充Oracle攻击排查：**

你收到报告称公司API可能存在填充Oracle漏洞。列出3个关键排查指标。

<details><summary>答案</summary>

1. **错误信息差异**：验证"填充错误"和"MAC错误"是否返回不同的错误响应/状态码
2. **响应时间差异**：填充错误和MAC错误的响应时间是否有可观察差异（时序侧信道）
3. **加密结构检查**：确认是否使用Encrypt-then-MAC（正确顺序）还是MAC-then-Encrypt

**修复建议**：迁移到GCM等AEAD模式，或确保统一错误响应+恒定时间比较。
</details>

---

**20. TLS配置安全审查：**

检查以下Nginx配置，找出所有安全问题：

```nginx
ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA:AES128-GCM-SHA256:DES-CBC3-SHA;
ssl_prefer_server_ciphers off;
```

<details><summary>答案</summary>

发现4个安全问题：

1. **TLSv1 和 TLSv1.1 不安全**：应仅保留 TLSv1.2 TLSv1.3
2. **ECDHE-RSA-AES128-SHA**：使用SHA-1的HMAC，已被不推荐
3. **AES128-GCM-SHA256**：使用静态RSA密钥交换，无前向保密
4. **DES-CBC3-SHA**：3DES-CBC，已知Sweet32攻击脆弱
5. **ssl_prefer_server_ciphers off**：客户端可能选择弱套件

**修正**：
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-CHACHA20-POLY1305;
ssl_prefer_server_ciphers on;
```
</details>

---

## 六、CISP专题强化

### 密码学在CISP考试中的位置

```
CISP知识域覆盖："信息安全技术"知识域中的密码学部分

考试常见题型：
  1. 选择题：给定场景选择正确的加密算法
  2. 判断题：密码学概念辨析
  3. 场景题：安全通信方案设计

高频考查：
  ✅ CIA三要素与密码学的对应关系
  ✅ 对称加密 vs 非对称加密的使用场景
  ✅ 数字签名的安全属性
  ✅ PKI体系的构成与运行
  ✅ TLS协议的安全机制
  ✅ 密码算法的安全强度比较
```

### 答题技巧

```
密码学选择题 "3步法"：

Step 1：识别场景 → 加密数据？密钥交换？数字签名？完整性？
Step 2：匹配算法 → 对称(AES) / 非对称(RSA/ECC) / 哈希(SHA)
Step 3：检查强度 → 密钥长度是否足够？模式是否安全？

例：银行交易需要同时保证机密性和完整性 → GCM (AEAD)
例：保护移动App通信且设备性能有限 → ECC + ChaCha20-Poly1305
例：中国场景 → SM系列（SM2/SM3/SM4）
```

---

## 七、常见混淆辨析

| 容易混淆的概念 | 辨析 |
|-------------|------|
| **加密 vs 签名** | 加密：用接收方公钥，保护机密性；签名：用发送方私钥，保护完整性和不可否认性 |
| **GCM vs CBC** | GCM是AEAD（加密+认证+关联数据），CBC仅加密 |
| **IV vs Nonce** | IV用于CBC等需要不可预测性；Nonce用于CTR/GCM仅需唯一性 |
| **SHA-256 vs AES-256** | SHA-256是哈希（单向，256位输出）；AES-256是对称加密（可逆，256位密钥） |
| **ECDHE vs ECDH** | 多了个E（Ephemeral）= 每次会话生成新密钥 → 前向保密 |
| **DH vs ECDH** | DH基于模幂运算；ECDH基于椭圆曲线，相同安全强度下密钥更短 |
| **CRL vs OCSP** | CRL是定期更新的吊销列表；OCSP是实时在线查询 |
| **SAML vs OAuth vs OIDC** | SAML是认证+授权(XML)；OAuth授权；OIDC在OAuth上增加认证(JWT) |

---

## 八、下周预览

### Week 7：网络安全

```
Day 43 → 网络协议安全（TCP/IP协议栈安全分析）
Day 44 → 防火墙技术（状态检测、应用代理、NGFW）
Day 45 → 入侵检测系统（IDS/IPS、Snort/Suricata）
Day 46 → VPN技术（IPsec、SSL VPN、WireGuard）
Day 47 → 无线网络安全（WPA3、802.1X、Rogue AP）
Day 48 → 网络分段（VLAN、零信任微分段）
Day 49 → 第七周总结与测验
```

---

## 九、学习进度检查

```
✅ Week 1：信息安全基础 (Day 1-7)           ████████ 完成
✅ Week 2：信息安全法规 (Day 8-14)          ████████ 完成
✅ Week 3：访问控制 (Day 15-21)              ████████ 完成
✅ Week 4：安全运营 (Day 22-28)              ████████ 完成
✅ Week 5：漏洞与攻击 (Day 29-35)            ████████ 完成
✅ Week 6：加密技术 (Day 36-42)              ████████ 完成
⬜ Week 7：网络安全 (Day 43-49)              ░░░░░░░░ 待学习
⬜ Week 8：应用安全 (Day 50-56)              ░░░░░░░░ 待学习
⬜ Week 9：物理安全 (Day 57-63)              ░░░░░░░░ 待学习
⬜ Week 10：安全工程 (Day 64-70)             ░░░░░░░░ 待学习
⬜ Week 11：业务安全 (Day 71-77)             ░░░░░░░░ 待学习
⬜ Week 12：模拟考试 (Day 78-84)             ░░░░░░░░ 待学习

────────────────────────────────────────────
总体进度：42/84 (50%)
```

---

> **🎯 Week 6完成！** 密码学是信息安全的核心技术支撑。继续前进，下周将学习网络安全——防火墙、IDS/IPS、VPN和无线安全等关键网络防护技术。
