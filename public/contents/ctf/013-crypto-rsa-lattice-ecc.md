# CTF 密码学常见题型与解题思路：RSA / 格（Lattice）/ ECC

## 1. 密码学 CTF 题总体分类

| 大类 | 典型考点 | 工具 |
|------|---------|------|
| RSA | 低加密指数、共模攻击、Wiener、Pohlig-Hellman、已知明文部分、Boneh-Durfee | SageMath、yafu、msieve、RsaCtfTool |
| 对称密码 | ECB/CBC 字节翻转、Padding Oracle、AES CTR nonce reuse、RC4 弱密钥 | PyCryptodome、sage |
| ECC | Invalid curve attack、Invalid point、Pohlig-Hellman、离散对数、SageMath `discrete_log` | SageMath、`ecc_tools` |
| 格（Lattice） | LLL/BKZ、Closest Vector Problem（CVP）、NTRU、基于格的密码分析 | SageMath、fpyll、lattice-estimator |
| 经典密码 | Caesar / Vigenere / Hill / Rail Fence / Bacon / Affine | CyberChef、quipqiup |
| 哈希 | 长度扩展攻击、MD5 碰撞、彩虹表 | hashpump、hashcat |
| 其他 | Shamir 密钥分割、中国剩余定理（CRT）、椭圆曲线配对（Weil/Tate） | SageMath |

## 2. RSA 速查

### 2.1 RSA 基础

```
公钥: n = p * q, e
私钥: d = e^{-1} mod φ(n)
加密: c = m^e mod n
解密: m = c^d mod n
```

### 2.2 低加密指数攻击（e=3，且 m^3 < n）

```python
# m = c 的整数三次方根
from gmpy2 import iroot
m, exact = iroot(c, 3)
if exact:
    print(long_to_bytes(m))
```

### 2.3 共模攻击（Same n，不同 e1/e2）

```python
# e1 和 e2 互素 → gcd(e1, e2) = 1
# 根据贝祖定理，存在 a, b 使 a*e1 + b*e2 = 1
# 则 m = c1^a * c2^b mod n
from Crypto.Util.number import inverse
from math import gcd

g, a, b = extended_gcd(e1, e2)  # 扩展欧几里得
if g != 1:
    raise Exception("gcd != 1")
m = pow(c1, a, n) * pow(c2, b, n) % n
```

### 2.4 Wiener Attack（d 过小）

```sage
# e/n 的连分数展开得到 d
sage: cf = continued_fraction(e / n)
sage: for k, d in zip(cf.convergents(), cf.convergents()):
....:     if k == 0: continue
....:     phi = (e*d - 1) // k
....:     # 验证 phi 合理性
....:     # 解方程 x^2 - (n - phi + 1)*x + n = 0
```

### 2.5 RsaCtfTool 自动化

```bash
# 安装
git clone https://github.com/RsaCtfTool/RsaCtfTool
cd RsaCtfTool && pip3 install -r requirements.txt

# 使用
python3 RsaCtfTool.py --publickey pubkey.pem --uncipher ciphertext
python3 RsaCtfTool.py -n 1234... -e 65537 --uncipherfile enc.bin

# 攻击类型：wiener, primefac, prime_nth, londoad, smallq, etc.
```

### 2.6 常见 RSA 题型清单

| 题型 | 判断条件 | 攻击方法 |
|------|---------|---------|
| 低加密指数 | e = 3/5/7/17 | iroot(c, e) / Coppersmith |
| 低解密指数 | d < n^0.292 | Wiener / Boneh-Durfee |
| 共模攻击 | 两个公钥相同 n | 扩展欧几里得求贝祖系数 |
| 低加密指数广播 | 相同明文 m 用不同 n 加密 | CRT |
| 相近素数 p ≈ q | |n - p*q| 很小 | Fermat 分解 |
| p 和 q 有某种结构 | p = f(x), q = g(x) | Coppersmith / SageMath polynomial |
| 已知部分明文 | 已知 m 的高位 / 低位 | Coppersmith small roots |
| 大 e（e 接近 n）| | Wiener 对偶（d 小 → e 大） |

## 3. 格（Lattice）入门

### 3.1 格定义

```
L = { a1*v1 + a2*v2 + ... + an*vn | ai ∈ Z }
其中 v1, v2, ..., vn 为 R^n 中的线性无关基向量
```

### 3.2 LLL/BKZ 算法（SageMath 内置）

```sage
# LLL 格基约化
M = matrix(ZZ, [[1, 2, 3], [4, 5, 6], [7, 8, 10]])
B = M.LLL()
print(B)

# BKZ（更强的约化算法）
B2 = M.BKZ(block_size=10)
```

### 3.3 题型：背包密码（Merkle-Hellman）

```sage
# 给定 a = [a1, a2, ..., an] 和 c
# 寻找 x_i ∈ {0, 1} 使 sum(x_i * a_i) = c
# 使用格方法求解：构造 Lattice 后 CVP
```

### 3.4 题型：Coppersmith 法（基于 LLL 的小根求解）

```sage
# 已知 p 的高位部分 p_high，求 p 的低位
# p = p_high * 2^k + low
# 在 Z[x] 上解方程 p_high*2^k + x ≡ 0 (mod p)
# 使用 Coppersmith small_roots
R.<x> = PolynomialRing(Zmod(n))
f = (p_high * 2^k + x)
roots = f.small_roots(X=2^k, beta=0.4)
for r in roots:
    p = int(p_high * 2^k + r)
    if n % p == 0:
        print("p =", p)
        break
```

### 3.5 题型：Hidden Number Problem（HNP）

```
已知 ti, a*ti + bi (mod p) 的高位 → 恢复 a, b
典型出现在 DSA/ECDSA nonce 泄露、PRNG 预测
```

```sage
# 构造格并使用 LLL 求最短向量 (SVP)
# 然后对每个候选 a 还原 b
```

### 3.6 基于格的 CTF 资源

- **RsaCtfTool**：很多格相关攻击已集成
- **sagetex / fpylll**：SageMath 原生强大
- **lattice-estimator**：评估格攻击成本（估算）
- **awesome-ctf-crypto**：GitHub 总结

## 4. ECC 速查

### 4.1 ECC 基本运算（SageMath）

```sage
# 定义椭圆曲线 y^2 = x^3 + a*x + b (mod p)
p = 0xffffffff...  # 例如 secp256k1
a = 0
b = 7
E = EllipticCurve(GF(p), [a, b])
print(E.order())

# 定义点
G = E(0x79be667ef9dcbbac55a06295ce870b07..., 0x483ada7726a3c4655da4fbfc0e1108a8...)
Q = k * G  # 标量乘法

# 已知 G, Q，求 k（ECDLP）
k = discrete_log(Q, G, E.order(), operation='+')
```

### 4.2 ECC 薄弱场景

| 场景 | 利用方法 |
|------|---------|
| 群阶为光滑数（Pohlig-Hellman） | 中国剩余定理分解离散对数 |
| 无效曲线攻击（Invalid Curve） | 让服务器在弱曲线上计算，泄露私钥 |
| 异常点攻击（Singular Curve） | 退化为乘法群 → 普通 DLP |
| Smart's Attack（迹为 1 的曲线） | 映射到加法群 → 平凡 DLP |
| MOV 攻击 / FR 攻击（低嵌入度） | 映射到有限域乘法群 → 指数级求解 |
| 小群阶 | baby-step giant-step / Pollard rho |

### 4.3 Pohlig-Hellman + CRT（ECC 版）

```sage
n = E.order()
factors = factor(n)  # 得到 p1^e1 * p2^e2 * ...
# 对每个因子 pi^ei 求解 ki = k mod pi^ei
# 再用 CRT 合并得到 k
```

### 4.4 Invalid Curve Attack 思路

```
攻击者发送 (x, y) 不在曲线上的点
服务器误用弱曲线计算，返回 Q = k * P（弱曲线）
弱曲线阶光滑 → 用 Pohlig-Hellman 恢复 k（private key 的部分信息）
多次攻击后通过 CRT 得到完整私钥
```

## 5. 对称密码速查

### 5.1 Padding Oracle Attack

```python
# CBC 模式：密文分组 C[i] 与前一个 C[i-1] 异或后解密
# 服务器泄露"padding 是否有效"即可逐字节解密
# 工具：padbuster, python-paddingoracle
from paddingoracle import BadPaddingException, PaddingOracle

class MyOracle(PaddingOracle):
    def oracle(self, data, **kwargs):
        # 向服务器发送 data，根据响应判断 padding 是否正确
        r = requests.post(url, data=data, timeout=5)
        if 'padding error' in r.text.lower():
            raise BadPaddingException()
        return True

oracle = MyOracle()
plaintext = oracle.decrypt(iv + ciphertext, blocksize=16)
```

### 5.2 AES CTR nonce reuse

```
相同 nonce + key 下：
C1 = P1 XOR stream
C2 = P2 XOR stream
→ P1 XOR P2 = C1 XOR C2
若已知任一 P1，则可以恢复任意 P2
```

## 6. 哈希长度扩展攻击

```python
# 已知 hash(key || msg)，在不知道 key 的情况下构造 hash(key || msg || padding || append)
# 工具：hashpumpy、hash_extender
import hashpumpy
new_hash, new_msg = hashpumpy.hashpump(
    known_hash,
    known_msg,
    append_data=b";id",
    key_length=16
)
print(new_msg.hex())
print(new_hash)
```

## 7. 综合实战流程（Crypto 题解题 SOP）

```
Step 1  读题：看给出的参数和加密方式
  ├─ RSA: n, e, c
  ├─ ECC: curve params, P, Q, c
  └─ 对称: ciphertext + 算法 + key/iv/nonce

Step 2  判断薄弱点（RSA 为例）
  ├─ n 是否可以分解？（factordb、yafu、msieve）
  ├─ e 是否很小 / 很大？
  ├─ 是否有共模？
  └─ 是否给了多组密文？

Step 3  选择工具与脚本
  ├─ 先试 RsaCtfTool 自动
  └─ 不行再手写 SageMath / Python

Step 4  调试：打印中间变量，判断是否有"关键条件"

Step 5  得到明文 → bytes → 提取 flag
```

## 8. 关键工具清单

```bash
# 数值计算
apt-get install yafu msieve factordb-cli

# Python 库
pip install pycryptodome gmpy2 sage

# SageMath（推荐在 WSL/Docker 中使用）
# https://www.sagemath.org/

# 常用在线工具
#  - factordb.com（分解 n）
#  - quipqiup.com（经典密码）
#  - CyberChef（万能工具）
#  - dcode.fr（各类密码）
```

## 9. 实战示例：一个典型 RSA 题目

```python
# 题目给的参数
n = 123456789...  # 一个较大整数
e = 65537
c = 987654321...

# 解题
# 1) 先分解 n（用 factordb / yafu / msieve）
p = ...
q = ...
assert p * q == n

# 2) 计算 φ(n) = (p-1)(q-1)
phi = (p - 1) * (q - 1)

# 3) 求 d = e^{-1} mod φ(n)
from Crypto.Util.number import inverse
d = inverse(e, phi)

# 4) 解密 m = c^d mod n
m = pow(c, d, n)

# 5) 转成字符串
from Crypto.Util.number import long_to_bytes
plaintext = long_to_bytes(m)
print(plaintext)
# b'flag{RSA_1s_34sy_1f_n_1s_sm4ll}'
```

> CTF 密码学的关键是"**数学直觉 + 工具熟练度**"。题目一般经过精心构造，存在特定弱点（小 e、光滑阶、低嵌入度等）。反复练习 + 熟悉 SageMath 是取得高分的必经之路。
