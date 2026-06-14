# 国密算法 SM2/SM3/SM4 技术详解与编程实战

> **📘 文档定位**：CISP 考试核心基础 | 难度：⭐⭐⭐⭐⭐ | 预计阅读：35 分钟
>
> SM2/SM3/SM4 是中国自主研发的商用密码算法体系，分别对应公钥密码、哈希和对称加密。本文从算法原理、参数对比到 GmSSL 编程实战，全面覆盖国密算法的技术细节和应用场景，是密评合规的技术基础。

---

## 导航目录

- [一、算法对比总览](#一算法对比总览)
- [二、SM2 椭圆曲线公钥密码](#二sm2-椭圆曲线公钥密码)
- [三、SM3 密码杂凑算法](#三sm3-密码杂凑算法)
- [四、SM4 分组密码](#四sm4-分组密码)
- [五、国密算法选型建议](#五国密算法选型建议)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、算法对比总览

| 算法 | 类型 | 对标国际 | 密钥/输出长度 | 标准 |
|:---|:---|:---|:---|:---|
| **SM2** | 椭圆曲线公钥密码 | ECC (P-256) | 私钥256bit, 公钥512bit(未压缩) | GB/T 32918 |
| **SM3** | 密码杂凑(哈希) | SHA-256 | 杂凑值256bit | GB/T 32905 |
| **SM4** | 分组密码 | AES-128 | 密钥128bit, 分组128bit | GB/T 32907 |
| **SM9** | 标识密码 | IBE | 私钥256bit | GB/T 38635 |
| **ZUC** | 流密码(序列密码) | SNOW 3G | 密钥128bit | 4G/5G空口加密 |

### 1.1 国密算法 vs 国际算法对照

```
密码功能对标关系：
  公钥加密/签名：SM2 ←→ RSA/ECC(ECDSA)
  哈希/杂凑：    SM3 ←→ SHA-256
  对称加密：     SM4 ←→ AES-128
  标识密码：     SM9 ←→ IBE (Boneh-Franklin)
  流密码：       ZUC ←→ SNOW 3G

核心差异：
  SM2 基于国密专用椭圆曲线（不同于NIST P-256）
  SM3 消息扩展更复杂（132字 vs SHA-256的64字）
  SM4 采用32轮Feistel结构（AES-128仅10轮SPN结构）
```

> **🔑 高分考点**：SM2→公钥（签名/加密/密钥交换），SM3→哈希（256位输出），SM4→对称加密（128位密钥）。密评中必须使用国密算法，不可使用国际算法替代。

---

## 二、SM2 椭圆曲线公钥密码

### 2.1 曲线参数

```
SM2 推荐曲线参数 (GB/T 32918.5-2017)：
  椭圆曲线方程：y² = x³ + ax + b (mod p)

  素数p (256位):
    p = FFFFFFFE FFFFFFFF FFFFFFFF FFFFFFFF 
        FFFFFFFF 00000000 FFFFFFFF FFFFFFFF

  系数a = FFFFFFFE FFFFFFFF FFFFFFFF FFFFFFFF 
          FFFFFFFF 00000000 FFFFFFFF FFFFFFFC

  系数b = 28E9FA9E 9D9F5E34 4D5A9E4B CF6509A7 
          F39789F5 15AB8F92 DDBCBD41 4D940E93

  基点G (未压缩):
    Gx = 32C4AE2C 1F198119 5F990446 6A39C994 
         8FE30BBF F2660BE1 715A4589 334C74C7
    Gy = BC3736A2 F4F6779C 59BDCEE3 6B692153 
         D0A9877C C62A4740 02DF32E5 2139F0A0

  阶n = FFFFFFFE FFFFFFFF FFFFFFFF FFFFFFFF 
        7203DF6B 21C6052B 53BBF409 39D54123
```

### 2.2 SM2 三种功能

```
SM2 提供三种密码功能：

1. SM2 数字签名
   → 算法：SM2签名算法 (基于SM3+椭圆曲线)
   → 原理：类似ECDSA，但使用SM3作为哈希
   → 签名结果：(r, s) 各32字节

2. SM2 密钥交换
   → 算法：SM2密钥交换协议
   → 原理：类似ECDH，双方各自产生临时密钥对
   → 结果：128字节共享密钥 + 双方确认

3. SM2 公钥加密
   → 算法：SM2加密算法
   → 原理：基于椭圆曲线的公钥加密
   → 密文结构：C1(公钥点) + C2(密文) + C3(SM3哈希)
```

### 2.3 SM2 编程实战 (GmSSL)

```bash
# 安装 GmSSL (开源国密工具包)
git clone https://github.com/guanzhi/GmSSL.git
cd GmSSL && mkdir build && cd build
cmake .. && make && sudo make install

# GmSSL 3.x 命令 (注意版本差异)
```

```bash
# 1. 生成SM2密钥对
gmssl sm2keygen -pass 1234 -out sm2key.pem
# 生成：私钥(加密保护) + 公钥

# 导出公钥
gmssl sm2keygen -pass 1234 -in sm2key.pem -out sm2pub.pem -pubout

# 2. SM2 签名
echo "待签名数据" > data.txt
gmssl sm2sign -key sm2key.pem -pass 1234 -in data.txt -out data.sig

# 3. SM2 验签
gmssl sm2verify -pubkey sm2pub.pem -in data.txt -sig data.sig
# → Verification Success (or Failure)

# 4. SM2 加密
echo "机密数据" > secret.txt
gmssl sm2encrypt -pubkey sm2pub.pem -in secret.txt -out secret.enc

# 5. SM2 解密
gmssl sm2decrypt -key sm2key.pem -pass 1234 -in secret.enc -out secret.dec

# 6. SM3 哈希
gmssl sm3 data.txt
# → SM3(data.txt) = 一串64字符十六进制

# 7. SM4 对称加密
gmssl sm4 -key 0123456789ABCDEFFEDCBA9876543210 -in data.txt -out data.sm4

# 8. SM4 解密
gmssl sm4 -d -key 0123456789ABCDEFFEDCBA9876543210 -in data.sm4 -out data.dec
```

```python
# Python GmSSL 绑定 (gmssl-pyx)
# pip install gmssl

from gmssl import sm2, sm3, sm4, func

# SM2 密钥生成
sm2_crypt = sm2.CryptSM2(
    private_key="00B9AB0B828FF68872F21A837FC303668428DEA11DCD1B24429D0C99E24EED83D5",
    public_key="B9C9A6E04E9C91F7BA880429273747D7EF5DDEB0BB2FF6317EB00BEF331A8308"
              "1A6994B8993F3C2A9AF0C2B1A2B7ECF6324B6F6F91DC4C9BFB7ECBD1B77A4A",
)

# SM2 加密/解密
ciphertext = sm2_crypt.encrypt(b"hello sm2")
plaintext = sm2_crypt.decrypt(ciphertext)

# SM3 哈希
hash_value = sm3.sm3_hash(func.bytes_to_list(b"hello sm3"))

# SM4 加密/解密
key = b'0123456789ABCDEFFEDCBA9876543210'  # 16字节
iv = b'0123456789ABCDEFFEDCBA9876543210'   # 16字节
sm4_crypt = sm4.CryptSM4()
sm4_crypt.set_key(key, sm4.SM4_ENCRYPT)
cipher = sm4_crypt.crypt_cbc(iv, b'hello sm4' * 4)  # 需要16倍数
```

---

## 三、SM3 密码杂凑算法

### 3.1 SM3 特点

```
SM3 (GB/T 32905-2016)：

结构：Merkle-Damgård迭代结构
输入：任意长度消息
输出：256位(32字节)杂凑值
分组长度：512位(64字节)
迭代轮数：64轮

与SHA-256对比：
┌──────────┬──────────┬──────────┐
│          │ SM3      │ SHA-256  │
├──────────┼──────────┼──────────┤
│ 输出长度  │ 256位    │ 256位    │
│ 消息分组  │ 512位    │ 512位    │
│ 轮数      │ 64轮     │ 64轮     │
│ 压缩函数  │ 不同设计  │ 不同设计  │
│ 抗碰撞性  │ ≥128位   │ ≥128位   │
│ 消息扩展  │ 132字     │ 64字      │
└──────────┴──────────┴──────────┘

SM3 消息扩展更复杂(额外扩展)，增加了安全强度。
```

### 3.2 SM3 应用

```
SM3 应用场景：
  ✦ SM2签名中的哈希（代替SHA-256）
  ✦ HMAC-SM3 (消息认证码)
    → 替代 HMAC-SHA256
    → 密评中用于完整性保护
  ✦ PBKDF2-SM3 (密钥派生)
  ✦ 数字证书/CRL中的签名哈希
  
HMAC-SM3 结构：
  HMAC-SM3(K, m) = SM3((K⊕opad) || SM3((K⊕ipad) || m))
  (与HMAC-SHA256相同的构造，只是哈希函数替换为SM3)
```

> **💡 知识巧记**：SM3与SHA-256输出都是256位，但SM3消息扩展132字 > SHA-256的64字，安全冗余更高。

---

## 四、SM4 分组密码

### 4.1 SM4 算法

```
SM4 (GB/T 32907-2016)：

参数：
  分组长度：128位 (16字节) ← 与AES相同
  密钥长度：128位 (16字节) ← 与AES-128相同
  迭代轮数：32轮 (AES-128为10轮)
  
轮结构：
  - 32轮Feistel迭代结构
  - S盒(8进8出)非线性变换
  - 线性变换(循环移位+XOR)

工作模式：
  ECB  — 电子密码本 (不推荐单独使用)
  CBC  — 密码块链接 (需要IV)
  CTR  — 计数器模式 (流密码化)
  GCM  — 认证加密 (类似AES-GCM-SM3)

SM4 安全性：
  - 目前无已知的有效破解方法
  - 线性/差分分析攻击需要 2^100+ 已知明文(不现实)
  - 128位密钥穷举不可行
```

### 4.2 SM4 vs AES 深度对比

| 维度 | SM4 | AES-128 |
|:---|:---|:---|
| 结构 | Feistel网络 (32轮) | SPN结构 (10轮) |
| S盒 | 8×8（国密设计） | 8×8（Rijndael设计） |
| 密钥扩展 | 32轮子密钥 | 11轮子密钥（含初始） |
| 硬件加速 | ARMv8 SM4指令 / 鲲鹏 | Intel AES-NI / ARMv8 AES |
| 标准化 | GB/T 32907 | FIPS 197 |
| 密评要求 | 必须 | 不满足（需替换为国密） |

### 4.3 SM4 GCM 认证加密

```c
// SM4-GCM 模式 (类似AES-GCM)
// GmSSL 3.0支持

# GmSSL command:
echo "明文数据" > plaintext.txt
# SM4-GCM 加密 (认证加密)
gmssl sm4_gcm -encrypt \
  -key 0123456789ABCDEFFEDCBA9876543210 \
  -iv 000000000000000000000000 \
  -aad "附加认证数据" \
  -in plaintext.txt \
  -out ciphertext.bin \
  -tag auth_tag.bin
```

---

## 五、国密算法选型建议

```
场景 → 算法选择：

数据传输加密：
  通信链路 → TLCP(国密TLS) → SM2+SM4+SM3
  内网API调用 → SM4-GCM (认证加密)
  文件传输 → SM4-CBC + HMAC-SM3

数据存储加密：
  数据库字段加密 → SM4 (确定性/CBC/CTR模式)
  文件加密 → SM4-GCM
  密钥加密 → SM2 (公钥加密对称密钥)

身份认证：
  用户登录 → SM3 (密码哈希) / SM2数字证书
  双向认证 → TLCP (SM2双证书认证)
  关键操作 → SM2数字签名(不可否认)

完整性保护：
  日志完整性 → HMAC-SM3链
  配置完整性 → SM2数字签名
  固件完整性 → SM3哈希 + SM2签名
```

### 5.1 性能对比参考

| 操作 | SM2/SM3/SM4 | RSA-2048/SHA-256/AES-128 |
|:---|:---|:---|
| 签名速度 | 约2000次/秒 | RSA约500次/秒 |
| 验签速度 | 约1000次/秒 | RSA约20000次/秒 |
| 哈希速度 | 约200MB/s | 约300MB/s |
| 对称加密 | 约500MB/s（无硬件加速） | 约2GB/s（AES-NI加速） |

---

## 六、安全部署 Checklist

- [ ] 国密算法选型(SM2/SM3/SM4)与使用场景确定
- [ ] GmSSL或国密版OpenSSL编译部署
- [ ] SM2密钥对生成与证书签发
- [ ] SM4对称密钥管理方案
- [ ] 应用程序国密算法集成
- [ ] 性能测试(SM4 vs AES / SM2 vs RSA)
- [ ] 算法交叉验证(不同国密实现间互操作)
- [ ] 密钥生命周期管理

---

## 七、高分考点与知识巧记

### 高分考点速查表

| 序号 | 考点 | 频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | SM2三种功能 | ⭐⭐⭐⭐⭐ | ⭐⭐ | 数字签名、密钥交换、公钥加密 |
| 2 | SM3输出长度 | ⭐⭐⭐⭐ | ⭐ | 256位（32字节） |
| 3 | SM4密钥和分组长度 | ⭐⭐⭐⭐ | ⭐ | 均为128位（16字节） |
| 4 | SM4迭代轮数 | ⭐⭐⭐ | ⭐⭐ | 32轮（AES-128为10轮） |
| 5 | SM3 vs SHA-256差异 | ⭐⭐⭐ | ⭐⭐ | SM3消息扩展132字 vs SHA-256的64字 |
| 6 | 国密算法对标国际 | ⭐⭐⭐⭐⭐ | ⭐⭐ | SM2→ECC, SM3→SHA-256, SM4→AES-128 |
| 7 | SM2曲线名称 | ⭐⭐⭐ | ⭐ | SM2专用椭圆曲线（非NIST P-256） |

### 知识巧记口诀

> 🎵 **国密三剑客**："SM2公钥三功能（签、换、加），SM3哈希256，SM4对称128"
>
> 🎵 **算法对标记**："二对ECC，三对SHA，四对AES"——SM2对标ECC，SM3对标SHA-256，SM4对标AES-128
>
> 🎵 **SM4特征**："128位双胞胎，32轮跑完全"——密钥和分组都是128位，32轮Feistel结构

---

## 学习建议

1. 🖥️ 安装GmSSL，动手执行SM2签名/验签、SM3哈希、SM4加解密
2. 📊 用Python gmssl库编写加解密Demo，理解API调用方式
3. 📖 阅读GB/T 32918（SM2）、GB/T 32905（SM3）、GB/T 32907（SM4）标准原文
4. 🔬 对比国密算法与国际算法的性能差异

---

> **国密算法是密码合规的技术基石。从"会用"到"用好"，需要深入理解算法原理和适用场景。**
