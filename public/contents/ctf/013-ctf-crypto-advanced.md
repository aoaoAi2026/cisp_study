# CTF 密码学常见题型与解题思路

---

## RSA

```python
# 已知 p,q,e,c → 解密
from Crypto.Util.number import *
d = inverse(e, (p-1)*(q-1))
m = pow(c, d, p*q)
print(long_to_bytes(m))

# 已知 n,e,dp,c → CRT解密
# 已知 p 高位 → Coppersmith(SageMath)
# Sage: small_roots()

# n相同, e不同, 明文相同 → 共模攻击
g, s1, s2 = xgcd(e1, e2)  # Sage
m = pow(c1,s1,n) * pow(c2,s2,n) % n
```

---

## Lattice(格密码)

```python
# SageMath 格基规约
M = Matrix(ZZ, [[...]])  # 构造格
B = M.LLL()  # LLL规约
# 短向量 → 可能包含 flag

# 背包密码(Knapsack)
# 超递增序列 → 容易解密
# 非超递增 → LLL 规约
```

---

## 常见攻击速查表

| 密码 | 条件 | 攻击 |
|------|------|------|
| RSA | e=3, m³<n | 直接开方 |
| RSA | d < n^0.25 | Wiener |
| RSA | p,q 相近 | Fermat/平方差 |
| RSA | 多组n, gcd≠1 | 公因子攻击 |
| ECC | 阶光滑 | Pohlig-Hellman |
| ElGamal | 参数弱 | 离散对数 |
| 分组密码 | ECB模式 | 字节翻转/重放 |
| LCG | 已知连续值 | 恢复参数 |
| Shamir | 门限不足 | 无解 :) |
