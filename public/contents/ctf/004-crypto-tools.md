# Crypto 常用工具与算法速查（RSA / AES / ECC / LFSR）

> **📘 文档定位**：CISP 考试 CTF 安全 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 系统整理 CTF 密码学常用工具与算法速查，覆盖 RSA/AES/ECC/LFSR 经典密码体制的攻击方法与 SageMath/Python 解题脚本。

---

## 导航目录

- [一、常用工具](#一常用工具)
- [二、RSA 攻击速查](#二rsa-攻击速查)
- [三、AES/DES 攻击速查](#三aesdes-攻击速查)
- [四、ECC 攻击速查](#四ecc-攻击速查)
- [五、LFSR/流密码速查](#五lfsr流密码速查)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 1. 常用工具

| 工具 | 用途 |
|------|------|
| **SageMath** | 数论、代数、格（Lattice）计算（最常用） |
| **gmpy2** | Python 大整数运算、模逆、iroot |
| **PyCryptodome** | AES / RSA / ECC / PKCS 标准实现 |
| **RsaCtfTool** | 自动枚举多种 RSA 弱密钥攻击 |
| **yafu** | 整数分解 |
| **msieve** | 数域筛分解 |
| **z3-solver** | 约束求解器（解方程、CRC 反推等） |
| **CyberChef** | 在线：Base16/32/64、Vigenère、XOR、编解码 |
| **factordb.com** | 在线分解已知 n |

## 2. 经典密码 / 编码速查

| 类型 | 说明 |
|------|------|
| **凯撒 / Rot13 / Rot47** | 字母位移；CyberChef 直接 |
| **Vigenère** | 多表替换；Kasiski 检测 / 重合指数解密钥 |
| **栅栏密码 / Rail Fence** | 几何型换位；行数 W、方向两种 |
| **Atbash / Bacon / Morse** | 经典题 |
| **Base 族** | Base16/32/32hex/64/85/91 + Base58（比特币） |
| **XXEncode / UUEncode** | 早期编码 |
| **Brainfuck / Ook / JSFuck** | esoteric 语言（工具在线解） |

## 3. XOR / 单字节加密

```python
cipher = bytes.fromhex('1f30303b3c3e3b3c3b')
# 爆破单字节 key
for k in range(256):
    m = bytes(b ^ k for b in cipher)
    if b'flag' in m.lower():
        print(k, m)
```

## 4. RSA 基础与常见题型

```python
# 基本运算：c = m^e mod n；m = c^d mod n
from Crypto.Util.number import getPrime, inverse, bytes_to_long, long_to_bytes
p, q = getPrime(512), getPrime(512)
n = p * q
phi = (p - 1) * (q - 1)
e = 65537
d = inverse(e, phi)
m = bytes_to_long(b"flag{...}")
c = pow(m, e, n)
assert long_to_bytes(pow(c, d, n)) == b"flag{...}"
```

### 4.1 低加密指数攻击（e=3, c = m^3）

```python
# 当 m^3 < n 时，c = m^3，直接开立方
import gmpy2
m, exact = gmpy2.iroot(c, 3)
assert exact
```

### 4.2 共模攻击（同 n，不同 e1/e2）

```python
# 条件：两个加密相同 m，同一 n，不同 e1/e2，且 gcd(e1,e2)=1
# ae1 + be2 = 1 (扩展欧几里得)
# c1^a * c2^b mod n = m
from math import gcd
g, a, b = pow(e1, -1, e2), ...  # 或用 extended_gcd
m = (pow(c1, a, n) * pow(c2, b, n)) % n
```

### 4.3 Wiener's Attack（d 太小，d < n^0.25）

用连分数展开 `e/n` 得到候选 `k/d`，再验证。

### 4.4 已知 p+q / p-q / p 的高位

用 SageMath / 二次方程求解

### 4.5 低解密指数 Boneh-Durfee

条件：`d < n^0.292`，使用格攻击。

### 4.6 n 相近的两用户（Fermat 分解）

```python
# n = a^2 - b^2 且 a 接近 sqrt(n)
import gmpy2
a = gmpy2.isqrt(n) + 1
while True:
    b2 = a * a - n
    b = gmpy2.isqrt(b2)
    if b * b == b2:
        p, q = a - b, a + b
        break
    a += 1
```

### 4.7 Coppersmith（已知 m 的高位 / 共享高位差分 / 多项式小根）

SageMath 的 `small_roots` 方法。

## 5. AES / 对称密码速查

### 5.1 ECB（最薄弱，分组独立）

- 相同明文分组 → 相同密文分组（可肉眼分辨图像等）
- 字节反转：密文某字节反转 → 明文对应字节反转

### 5.2 CBC（Cipher Block Chaining）

- 翻转 IV 可控制第一分组明文；翻转 C[i] 对应下一分组相同偏移
- **Padding Oracle**：服务器返回「Padding 错误」，可逐字节解密
- **工具**：`python-paddingoracle`、`pwn.ipynb` 自行脚本

### 5.3 CTR / OFB / CFB

- 流密码模式，无 padding；IV 重用 → 可差分计算明文

### 5.4 GCM

- 认证加密（AEAD），nonce 重用可泄漏认证密钥

## 6. 哈希攻击

- **长度扩展攻击**（Hash Length Extension）：SHA-1/SHA-256/SHA-512/MD5
  - 工具：`hash_extender`、`hlextend`（Python）
- **MD5 碰撞**：`hashclash`、`fastcoll`
- **SHA-1 碰撞**：`sha1collisiondetection`

## 7. 格密码（Lattice）入门概念

- LLL / BKZ 算法规约短向量
- Coppersmith、NTRU、LWE、Ring-LWE 均是格相关
- **SageMath** 提供 `M.LLL()`、`M.BKZ()`、`small_roots` 工具

## 8. 常用脚本示例（RSA 自动求解）

```python
# 简化：用 RsaCtfTool 一键解
python3 RsaCtfTool.py --createpub -n N -e E --uncipher C
```

---

> 做 crypto 题目的基本习惯：先判断算法 → 列出已知变量 → 查常见漏洞模式 → 用 SageMath + 脚本求解。多练习，积累感觉。
