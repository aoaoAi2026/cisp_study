# Crypto 常用工具与算法速查

---

## 📋 目录

1. [RSA 攻击大全](#一rsa)
2. [Base 家族](#二base)
3. [古典密码](#三古典密码)
4. [现代加密](#四现代加密)
5. [CTF 工具链](#五工具链)

---

## 一、RSA

### 攻击矩阵

| 条件 | 攻击方法 | 工具 |
|------|---------|------|
| n可分解 | 分解n→p,q→解密 | factordb/yafu |
| e=3且m³<n | 小e攻击: c开3次方 | Python gmpy2 |
| 同一m,不同e | 共模攻击 | Python |
| e很大,d很小 | Wiener攻击 | RsaCtfTool |
| p,q相近 | Fermat分解 | RsaCtfTool |
| 多组n有公因子 | gcd求公因子 | Python |
| 已知p高位 | Coppersmith | SageMath |

```python
from Crypto.Util.number import *
from gmpy2 import *

# 基础RSA解密
c = 111111
e = 65537
p = 123456789
q = 987654321
n = p * q
phi = (p-1) * (q-1)
d = invert(e, phi)
m = pow(c, d, n)
print(long_to_bytes(m))

# 低加密指数攻击 (e=3)
# m = iroot(c, 3)[0]  # 如果m³ < n

# 共模攻击
# e1,e2 互质 → 存在s1×e1 + s2×e2 = 1
g, s1, s2 = gcdext(e1, e2)
m = pow(c1,s1,n) * pow(c2,s2,n) % n

# Wiener攻击
# 使用 RsaCtfTool:
# python3 RsaCtfTool.py -n <N> -e <E> --attack wiener
```

---

## 二、Base

```python
import base64

# Base64
base64.b64encode(b'flag')    # b'ZmxhZw=='
base64.b64decode(b'ZmxhZw==') # b'flag'

# Base32
base64.b32encode(b'flag')

# Base85 (ASCII85)
base64.a85encode(b'flag')

# 自定义Base64表(CTF常见)
# 如果字母表被交换了:
custom_table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
# (顺序打乱)
```

---

## 三、古典密码

```
凯撒密码:  每个字母移位固定值 → 26种可能,直接爆破
维吉尼亚:  多表替换,需要密钥
栅栏密码:  按行排列→按列读取
培根密码:  A=AAAAA B=AAAAB ...
摩斯密码:  .- 组合
猪圈密码:  图形符号
当铺密码:  数字对应汉字笔画数
与佛论禅:  中文佛经编码(CTF常见)
Quoted-Printable: =E5=AF=86=E7=A0=81
```

```bash
# CyberChef 在线工具: https://gchq.github.io/CyberChef/
# 支持: Magic(自动识别编码) / 各种加密解密 / 编码转换
```

---

## 四、现代加密

```python
# AES
from Crypto.Cipher import AES
key = b'16bytes_key!!!!'  # 16/24/32 bytes
cipher = AES.new(key, AES.MODE_ECB)
ciphertext = cipher.encrypt(pad(plaintext))
plaintext = unpad(cipher.decrypt(ciphertext))

# DES
from Crypto.Cipher import DES
key = b'8bytes!!'
cipher = DES.new(key, DES.MODE_ECB)

# XOR (CTF常见)
def xor(a, b):
    return bytes([x ^ y for x, y in zip(a, b)])

# 已知明文攻击: 如果知道部分明文→可恢复密钥
# key = xor(ciphertext, plaintext)
```

---

## 五、工具链

```bash
# RsaCtfTool — RSA万能工具
git clone https://github.com/RsaCtfTool/RsaCtfTool
python3 RsaCtfTool.py -n <N> -e <E> --uncipher <C>

# SageMath — 数学计算
# Coppersmith攻击: small_roots()

# z3 — 约束求解器
from z3 import *
s = Solver()
x = Int('x')
s.add(x > 0, x < 100)
s.check()
print(s.model())

# CyberChef
# https://gchq.github.io/CyberChef/

# dcode.fr — 在线识别密码类型

# factordb.com — 大数分解
# yafu — 本地大数分解
yafu "factor(12345678901234567890)"
```

---

## ✅ Crypto 速查

- [ ] Base64/32/16/85
- [ ] RSA: 分解/小e/共模/Wiener
- [ ] 古典: 凯撒/维吉尼亚/栅栏
- [ ] AES/DES/XOR
- [ ] CyberChef/RsaCtfTool/SageMath
