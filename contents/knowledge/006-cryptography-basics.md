# 密码学基础：对称、非对称、哈希与常用协议

密码学是信息安全的数学基石——HTTPS、SSH、VPN、数字签名、电子货币、端到端加密消息，全部依赖密码学。本文把常见概念（对称加密、非对称加密、哈希、HMAC、数字签名、TLS、SSH）串成一份可随时回顾的速查指南。

## 一、古典 vs 现代密码学

- **古典密码**：凯撒、维吉尼亚、栅栏、单表/多表替换；以字符为单位、依赖保密性算法本身。
- **现代密码学**：遵循 Kerckhoffs 原则——"算法公开，密钥保密"。安全性依赖密钥空间与数学问题的计算困难度。

现代密码学按功能分为三大支：

| 功能 | 典型算法 | 目标 |
| --- | --- | --- |
| 对称加密（Symmetric） | AES、ChaCha20、DES、3DES、RC4 | 机密性（加解密） |
| 非对称加密（Asymmetric / PKC） | RSA、ECC、ElGamal | 密钥交换 / 公钥加密 / 签名 |
| 哈希函数（Hash） | MD5、SHA-1、SHA-2、SHA-3、BLAKE3 | 完整性、摘要、指纹 |

再加上**消息认证码（MAC/HMAC）**与**数字签名（RSA-PSS、ECDSA、EdDSA）**，就能提供认证与不可否认性。

## 二、对称加密

- 同一密钥（Secret Key）用于加解密，速度快、适合大量数据；
- 密钥分发是核心问题；
- 分两类：
  - **分组密码（Block Cipher）**：按固定长度（如 128-bit）处理数据；典型：AES、DES、3DES、SM4；
  - **流密码（Stream Cipher）**：按位/字节加密；典型：ChaCha20、RC4、AES-CTR 可看作"用分组密码构造的流密码"。

### 2.1 工作模式（以 AES 为例）

- **ECB**：最简单，但相同明文块得到相同密文块，不安全，**禁用**；
- **CBC**：链式反馈，需要 IV（初始向量）；常见但需选安全随机 IV、避免 padding oracle；
- **CFB / OFB**：把分组密码当流密码用；
- **CTR**：计数器模式，天然并行化，IV/计数器不可重用；
- **GCM / CCM / ChaCha20-Poly1305**：**AEAD（认证加密）**，同时提供机密性 + 完整性 + 认证，现代首选。

### 2.2 填充（Padding）

- 当明文长度不是块长度的整数倍时需要填充；
- **PKCS#7 / PKCS#5**：最常见，填 `k` 个字节 `k`；
- **Zero padding**：简单但存在歧义；
- 攻击：Padding Oracle（CBC 模式下可逐字节解密，使用 AEAD 可避免）。

### 2.3 密钥长度推荐

- AES-128 / AES-256：安全；推荐 AES-128（256 的密钥长度并非线性"更安全"，主要考虑合规/后量子）；
- DES / 3DES：已不推荐；
- RC4：已被大量攻击废弃，避免使用；
- 块密码 + AEAD 是现代加密的标准选择（TLS 1.3 的 `TLS_AES_128_GCM_SHA256`、`TLS_CHACHA20_POLY1305_SHA256`）。

## 三、非对称加密 / 公钥密码学

- 使用**密钥对（公钥 + 私钥）**；
- 公钥可公开；私钥必须保密；
- 应用场景：
  - **公钥加密**：用对方公钥加密，只有对方私钥能解密（如 RSA-OAEP、ECIES）；
  - **数字签名**：用自己私钥签名，任何人可用公钥验证（如 RSA-PSS、ECDSA、EdDSA）；
  - **密钥协商**：双方在不安全信道上协商出一个共享秘密（Diffie-Hellman、ECDH）。

### 3.1 RSA

- 数学基础：大整数分解难题（Factorization Problem）；
- 加密：`c = m^e mod n`，解密 `m = c^d mod n`；
- 签名：`s = m^d mod n`，验证 `m = s^e mod n`（需哈希 + padding，如 PKCS#1 v1.5、PSS）；
- 推荐密钥长度：2048 bits 起步，4096 bits 更稳妥；
- 注意：原始 RSA（教科书式）不安全，必须配合随机 padding（OAEP/PSS）；直接使用"RSA 加密长明文"性能差，实际协议都用 RSA + 对称会话密钥。

### 3.2 ECC（椭圆曲线密码学）

- 数学基础：椭圆曲线上离散对数问题（ECDLP）；
- 更短密钥达到同等级安全：`P-256 ≈ RSA 3072`、`P-384 ≈ RSA 7680`；
- 常用曲线：NIST P-256 / P-384 / P-521、Curve25519 / X25519（密钥交换）、Ed25519（签名）；
- EdDSA（Ed25519）确定性签名，性能好、实现简单，SSH、TLS 1.3 广泛采用。

### 3.3 Diffie-Hellman（DH / ECDH）

- 双方各自生成私钥 `a/b`，并交换 `g^a mod p` 与 `g^b mod p`，各自得到相同的 `g^(ab) mod p`；
- 攻击者只能看到 `g^a, g^b`，但难以计算 `g^(ab)`（离散对数难题）；
- 现代 TLS 普遍使用 ECDHE（Ephemeral ECDH），每会话生成新的临时密钥对，提供前向安全（Forward Secrecy）。

## 四、哈希函数

- 把任意长度输入压缩为固定长度输出（Digest / Hash）；
- 性质：单向性、抗碰撞（collision resistance）、抗原像（preimage resistance）、抗第二原像；
- 常见：
  - MD5（128-bit）：**已不安全**，存在碰撞；
  - SHA-1（160-bit）：**已不安全**，存在选择前缀碰撞；
  - SHA-2：SHA-224/256/384/512，安全主流；
  - SHA-3：Keccak 家族，与 SHA-2 数学结构不同，可作备份；
  - BLAKE2/BLAKE3：高性能、安全性强，常作为工程替代。
- 应用：文件完整性校验、密码存储（加盐 + 慢速哈希）、数字签名、HMAC、区块链。

## 五、消息认证 / 数字签名

### 5.1 MAC / HMAC

- 仅加密不足以保证"消息未被篡改"，需要认证；
- **MAC**：用密钥 + 消息生成固定长度标签；
- **HMAC**：基于哈希的 MAC，`HMAC(K, m) = H((K⊕opad) ‖ H((K⊕ipad) ‖ m))`；
- 常见：`HMAC-SHA256`、`HMAC-SHA512`；
- AEAD（GCM/ChaCha20-Poly1305）可一次得到"机密性+认证"，工程上更推荐。

### 5.2 数字签名

- 用签名者私钥对消息哈希进行"签名"，任何拥有公钥的人都可验证；
- 算法：RSA-PKCS#1 v1.5、RSA-PSS、DSA、ECDSA、EdDSA（Ed25519）；
- 应用：TLS 证书签名、代码签名、文档签名、SSH 主机/用户认证、区块链交易。

## 六、密码学在真实协议中的用法

### 6.1 TLS（HTTPS）

- 简化视角：**非对称加密用于握手与身份认证，对称加密用于批量数据，哈希/HMAC 用于完整性**；
- 以 TLS 1.3（ECDHE + AES-128-GCM + SHA256）为例：
  1. 客户端发送随机数、支持的套件、密钥协商公钥（ECDH ephemeral）；
  2. 服务器回应随机数、自己的 ECDH 公钥、证书（含签名公钥）、用证书私钥签名握手消息；
  3. 双方验证证书链，计算共享密钥 → 派生会话密钥；
  4. 应用数据使用 AES-GCM 或 ChaCha20-Poly1305（AEAD）加密；
- 前向安全：握手使用 ECDHE（临时密钥），即使长期证书私钥泄漏，历史会话也不可解密。

### 6.2 SSH

- 客户端与服务器经 Diffie-Hellman（或 ECDH）协商会话密钥；
- 服务器用主机私钥对协商消息签名，客户端比对 `known_hosts` 中的公钥；
- 用户认证：password / publickey（客户端用私钥签名一段挑战）；
- 对称加密会话数据：`aes256-gcm@openssh.com`、`chacha20-poly1305@openssh.com` 等。

### 6.3 密码存储（应用层）

- **不要**：明文存、只做 MD5/SHA-256（无盐）；
- **推荐**：使用专门的"慢哈希 + 自适应"算法：
  - **bcrypt**（基于 Blowfish，可调 cost，默认加盐）；
  - **scrypt**（内存困难函数，抗 GPU）；
  - **Argon2**（PHC 比赛获胜者，参数 m/t/p 可调节并行度与内存）；
  - **PBKDF2**（HMAC + 迭代，需要选择足够大迭代次数）；
- 要点：随机 salt、足够高迭代/内存参数、版本字段便于迁移。

## 七、常见误用与陷阱

| 错误做法 | 问题 | 正确做法 |
| --- | --- | --- |
| ECB 模式 | 相同明文块 → 相同密文块，模式可见 | 使用 CBC/CTR/GCM/ChaCha20 |
| 固定/可预测 IV（CBC 模式） | 允许选择明文攻击，破坏语义安全 | 每次加密使用加密安全的随机 IV |
| 不做认证（仅加密） | 密文可被篡改，padding oracle 等攻击 | 使用 AEAD（GCM/CCM/ChaCha20-Poly1305）或加密 + HMAC |
| 弱随机数生成 | 密钥/IV/nonce 被猜测导致完全攻破 | 使用系统 CSPRNG（`/dev/urandom`、`BCryptGenRandom`、`getrandom`） |
| AES-GCM 重用 nonce | 同一密钥 + 同一 nonce 会泄露认证密钥与明文异或 | 随机 96-bit nonce，或使用 counter，**保证永不重复** |
| 把 RSA 直接加密长明文 | 速度慢、长度受密钥长度限制 | 加密随机会话密钥（对称密钥），再用对称密钥加密数据 |
| 使用 MD5/SHA-1 做签名哈希 | 存在碰撞攻击，可伪造签名 | 使用 SHA-256 / SHA-512 |
| 把密码直接做 SHA-256 存库 | 可彩虹表/字典攻击；可被 GPU 暴力破解 | 使用 bcrypt/scrypt/Argon2/PBKDF2 + salt |
| 自定义加密协议 / 自研算法 | 难以抵御高级攻击，几乎必错 | 使用经过同行评审的标准协议与库（OpenSSL、libsodium、BoringSSL、crypto/tls 等） |

## 八、侧信道与后量子

- **侧信道攻击**：通过运行时间（timing）、功耗、电磁辐射、缓存行为推断密钥；
- 防御：恒定时间算法、常量时间比较、掩码、信任硬件（TPM、HSM、Secure Enclave）；
- **后量子密码学（PQC）**：RSA/ECC 面对大型量子计算机可被破解（Shor 算法）；NIST 已标准化 CRYSTALS-Kyber、CRYSTALS-Dilithium、Falcon、SPHINCS+ 等抗量子算法；TLS 1.3 已开始试验性部署 Kyber。

## 九、工程选型建议

- **新协议优先 TLS 1.3**，支持的套件仅保留 AEAD + 前向安全；
- **密钥交换**：X25519（ECDH）优于 RSA 密钥传输；
- **对称加密**：AES-128-GCM 或 ChaCha20-Poly1305；
- **数字签名**：Ed25519 / ECDSA P-256 / RSA-PSS 2048+；
- **密码哈希**：Argon2id > scrypt > bcrypt > PBKDF2-HMAC-SHA256；
- **随机数**：永远使用系统 CSPRNG；
- **不要自己设计协议**：复用已审计的 TLS、WireGuard、Signal 协议等；
- **密钥管理**：使用 KMS、HSM、Vault、Azure Key Vault、AWS KMS 等，避免把密钥放进代码与配置文件。

## 十、学习建议

1. 《深入浅出密码学》（Understanding Cryptography）或《现代密码学：原理与协议》作为入门；
2. 亲手用 Python/Crypto 库实现：AES-GCM 加解密、Ed25519 签名、bcrypt 密码哈希、HMAC 验证；
3. 用 `openssl s_client` / `openssl speed` 对比不同算法与套件；
4. 阅读 TLS 1.3 RFC 8446、NIST SP 800-52r2 等权威文档；
5. 跟踪 CVE（如 Heartbleed、ROCA、Curveball、Terrapin 等），理解真实协议漏洞是如何被发现与修复的。

密码学本身并不神秘，但误用和错误实现却是安全事故的重灾区。作为安全从业者，我们并不需要去发明密码学，但要能识别"正确用法"和"常见陷阱"——这正是基本功所在。
