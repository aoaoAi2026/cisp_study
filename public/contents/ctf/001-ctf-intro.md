# CTF 新手入门：五大方向介绍与学习路径

> **📘 文档定位**：CTF 竞赛入门基础 | 难度：⭐⭐ | 预计阅读：25 分钟
> 本文系统介绍 CTF 五大核心方向（Web/Pwn/Reverse/Crypto/Misc）及完整学习路线，是 CTF 新手入门的必读指南。

---

## 导航目录

- [一、CTF 概述](#一ctf-概述)
- [二、Web 方向](#二web-方向)
- [三、Pwn 方向](#三pwn-方向)
- [四、Reverse 方向](#四reverse-方向)
- [五、Crypto 方向](#五crypto-方向)
- [六、Misc 方向](#六misc-方向)
- [七、学习路线与资源](#七学习路线与资源)
- [八、高分考点与知识巧记](#八高分考点与知识巧记)

---

## 一、CTF 概述

### 1.1 什么是 CTF

```
CTF (Capture The Flag) = 夺旗赛

核心理念：在模拟环境中解决安全挑战，获取"Flag"作为解题凭证
```

### 1.2 三大赛制

| 赛制 | 模式 | 特点 | 适用场景 |
|:---|:---|:---|:---|
| **Jeopardy（解题模式）** | 各方向独立解题，提交 Flag 得分 | 最常见，门槛低 | 国内 CTF 主流 |
| **AWD（攻防模式）** | 每队维护服务器，攻击别人 + 修补自己 | 对抗性强 | 护网风格，实战模拟 |
| **King of the Hill** | 抢占并维护"山头"，持续控制得分 | 持久对抗 | 高级别赛事 |

> **🔑 高分考点**：Jeopardy 是入门最佳选择，AWD 是企业安全建设最直接相关的赛制。

### 1.3 CTF 五大方向对比

| 方向 | 英文名 | 核心内容 | 难度入门级 | 工具依赖度 |
|:---|:---|:---|:---:|:---:|
| Web | Web Security | Web 安全漏洞利用 | ⭐⭐ | 中 |
| Pwn | Binary Exploitation | 二进制漏洞利用（溢出/堆/格式化字符串） | ⭐⭐⭐⭐ | 高 |
| Reverse | Reverse Engineering | 逆向工程（脱壳/算法/混淆） | ⭐⭐⭐ | 高 |
| Crypto | Cryptography | 密码学（加解密/数学） | ⭐⭐⭐ | 中 |
| Misc | Miscellaneous | 杂项（隐写/取证/流量分析） | ⭐⭐ | 中 |

---

## 二、Web 方向

### 2.1 技能体系

```
Web 安全技能树：

基础层：HTTP 协议、Cookie/Session、HTML/JS/PHP 基础
注入层：SQL 注入、命令注入、XSS、文件上传、文件包含
进阶层：反序列化（PHP/Java）、SSRF、XXE、SSTI
高级层：JWT、OAuth、GraphQL 安全、原型链污染
```

### 2.2 入门题目示例

```php
// 经典题: PHP 弱类型比较
if (isset($_GET['a']) && isset($_GET['b'])) {
    if ($_GET['a'] != $_GET['b'] && md5($_GET['a']) == md5($_GET['b'])) {
        echo "flag{xxxx}";
    }
}
// 解法: ?a=240610708&b=QNKCDZO
// md5 都是 0e 开头 → PHP 松散比较 → 0==0 → true
```

```sql
-- SQL注入 — UNION查询
-- ?id=1 → 正常
-- ?id=1' → 报错 → 注入点
-- ?id=-1 UNION SELECT 1,database(),3 -- - → 爆数据库
-- ?id=-1 UNION SELECT 1,group_concat(table_name),3 FROM information_schema.tables WHERE table_schema=database() -- -
```

```python
# SSTI (模板注入)
# Flask/Jinja2: {{config}}  → 泄露配置
# {{''.__class__.__mro__[1].__subclasses__()}} → RCE
```

> **💡 知识巧记**：Web 安全学习口诀："先学注入和上传，再搞序列化与请求伪造，模板注入放最后。"

**推荐靶场**: BUUCTF, CTFHub, XCTF 攻防世界, PortSwigger Web Academy

---

## 三、Pwn 方向

### 3.1 技能体系

```
Pwn 技能树：

前置知识：C 语言、汇编（x86/x64）、Linux 基础
基础漏洞：栈溢出（Stack Overflow）、Canary 绕过
核心技能：ROP（Return-Oriented Programming）、格式化字符串漏洞
高级技能：Heap 利用（Use-After-Free、Fastbin、Tcache）
```

### 3.2 pwntools 基础模板

```python
from pwn import *

# 连接远程
# r = remote('ctf.example.com', 10001)
# 本地调试
r = process('./pwn')

# 接收数据
r.recvuntil(b'Input: ')

# 构造 Payload
payload = b'A' * 40          # 填充
payload += p64(0x401234)     # 返回地址(ROP gadget)

# 发送
r.sendline(payload)

# 交互模式
r.interactive()
```

### 3.3 入门练习路径

```
checksec 检查保护:
  Arch: amd64
  RELRO: Partial RELRO
  Stack: No canary found    ← 无Canary → 可栈溢出
  NX: NX enabled
  PIE: No PIE               ← 地址固定 → 容易利用

经典入门平台:
  pwnable.kr → fd, collision, bof
  pwnable.tw → start, orw
  pwn.college → 系统课程(ASU 大学)
```

> **🔑 高分考点**：checksec 输出解读是 Pwn 题的第一步，必须熟练掌握各保护机制的含义。

---

## 四、Reverse 方向

### 4.1 技能体系与工具链

```
Reverse 技能树：

基础：汇编（x86/x64）、C/C++ 阅读能力
静态分析：IDA Pro（F5 反编译）/ Ghidra（免费替代）
动态调试：x64dbg（Windows）/ GDB + pwndbg（Linux）
进阶：加密算法识别（AES/RC4/XOR/Base64）、反混淆/脱壳
```

```bash
# 静态分析
IDA Pro / Ghidra  → 反编译 + 伪代码

# 动态调试
x64dbg (Windows)  → 动态追踪
GDB + pwndbg/gef  → Linux 调试

# 文件分析
file crackme.exe          # 文件类型
strings crackme.exe       # 搜索字符串
binwalk crackme.exe       # 固件分析
detect-it-easy            # 查壳
```

> **💡 知识巧记**："逆向三步走：file 查类型 → strings 找线索 → IDA 反编译分析逻辑。"

**入门推荐**: crackmes.one, reversing.kr

---

## 五、Crypto 方向

### 5.1 核心概念

```python
# 经典 RSA 加密
from Crypto.Util.number import *

p = getPrime(512)
q = getPrime(512)
n = p * q
e = 65537
c = pow(flag, e, n)

# 攻击方式:
# 1. 如果 n 可分解:
#    factordb.com → 分解 n → 得到 p,q → 解密

# 2. 低加密指数攻击(e=3):
#    c = m^3 mod n, 如果 m^3 < n → c = m^3
#    → m = c^(1/3) (整数开方)

# 3. 共模攻击(同一 m, 不同 e):
#    c1 = m^e1 mod n, c2 = m^e2 mod n
#    if gcd(e1,e2)==1 → 可恢复 m
```

### 5.2 常见攻击速查

| 条件 | 攻击方法 | 工具 |
|:---|:---|:---|
| n 可分解 | 分解 n → p,q → 解密 | factordb / yafu |
| e=3 且 m³<n | 小 e 攻击: c 开 3 次方 | Python gmpy2 |
| 同一 m, 不同 e | 共模攻击 | Python |
| e 很大, d 很小 | Wiener 攻击 | RsaCtfTool |
| p,q 相近 | Fermat 分解 | RsaCtfTool |

> **🔑 高分考点**：RSA 常见攻击类型必须熟记，CTF 中 80% 的 Crypto 题都涉及 RSA。

**入门推荐**: CryptoHack, cryptopals.com

---

## 六、Misc 方向

### 6.1 五大子领域

```
Misc 方向全景：

图片隐写:
  steghide extract -sf image.jpg         # 提取隐藏数据
  zsteg image.png                         # LSB 隐写
  binwalk -e image.jpg                    # 文件拼接

流量分析:
  Wireshark → Follow TCP Stream
  tshark -r capture.pcap -Y "http"        # 过滤 HTTP
  binwalk -e capture.pcap                 # 提取传输文件

压缩包:
  fcrackzip -b -u -c a -l 1-6 flag.zip   # 爆破密码
  zip2john → hashcat                      # 密码爆破

取证:
  volatility -f memory.dump imageinfo     # 内存分析
  foremost -i disk.img -o output/         # 文件恢复
```

---

## 七、学习路线与资源

### 7.1 三阶段学习路径

```
Phase 1 (1-2月): 基础 + 各方向入门
  → Linux 命令、Python 脚本、网络基础
  → 每个方向做 20 道入门题
  → 确定 1-2 个主方向

Phase 2 (3-6月): 主方向深入
  → 主方向刷 100+ 题
  → 参加线上赛(CTFtime)
  → 赛后复现 + 写 WP

Phase 3 (6-12月): 战队 + 进阶
  → 加入战队、稳定参赛
  → 学习高级技术
  → 出题/分享
```

### 7.2 推荐平台

| 平台 | 类型 | 特点 |
|:---|:---|:---|
| CTFtime.org | 全球 CTF 日历 | 赛程追踪、队伍排名 |
| CTFHub | 国内练习 | 分类清晰、在线环境 |
| BUUCTF | 国内练习 | 历年真题复现 |
| NSSCTF | 国内练习 | 新题更新快 |
| XCTF 联赛 | 国内大赛 | 顶级赛事 |

---

## 安全部署 Checklist

- [ ] Linux/Python/Git 基础环境搭建
- [ ] 各方向入门题各 20 道
- [ ] pwntools/IDA/Ghidra 熟练使用
- [ ] CTFtime 注册并关注赛事
- [ ] 参加至少 1 场线上赛
- [ ] 赛后复现并撰写 WP
- [ ] 建立个人工具库和脚本库

## 高分考点与知识巧记

### 高分考点速查表

| 序号 | 考点 | 频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | CTF 三大赛制 | ⭐⭐⭐ | ⭐ | Jeopardy/AWD/King of the Hill |
| 2 | 五大方向划分 | ⭐⭐⭐ | ⭐ | Web/Pwn/Reverse/Crypto/Misc |
| 3 | PHP 弱类型比较 | ⭐⭐⭐⭐ | ⭐⭐ | 0e 开头 MD5 松散比较 |
| 4 | SQL 注入基础 | ⭐⭐⭐⭐ | ⭐⭐ | UNION SELECT + information_schema |
| 5 | checksec 保护解读 | ⭐⭐⭐ | ⭐⭐⭐ | Canary/NX/PIE/RELRO |
| 6 | RSA 基本攻击 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 分解/小e/共模/Wiener |

### 知识巧记口诀

> 🎵 CTF 入门要记牢，五大方向不能少。Web 漏洞先学好，Pwn 要汇编基础牢。Reverse 逆向耐心找，Crypto 数学不能少。Misc 隐写工具多，三阶段学习步步高。

---
