# Pwn 入门：栈溢出 / Canary / NX / ASLR / PIE / RELRO

## 1. 保护机制速览

在 Linux 下编译的 ELF，通常会开启以下保护：

| 保护 | 作用 | checksec 字段 |
|------|------|-------------|
| **RELRO** | 防止 GOT 被写（GOT 是函数真实地址表） | Partial / Full |
| **Stack Canary** | 栈上放一个随机 Cookie，函数返回前校验，失败崩溃 | Canary |
| **NX / DEP** | 栈不可执行（shellcode 不可直接跑） | NX |
| **PIE** | 代码段 / 数据段 基址随机 | PIE |
| **ASLR** | 系统级地址随机（堆、栈、libc） | 由系统决定 |
| **Fortify Source** | 替换危险函数（`sprintf` → `__sprintf_chk`） | FORTIFY |

**使用 `checksec` / `checksec --file=./binary` 查看保护。**

## 2. 基础栈溢出（无任何保护）

```c
void vuln() {
    char buf[0x20];
    read(0, buf, 0x100);  // 缓冲区 0x20，可写入 0x100，溢出覆盖返回地址
}
```

**目标**：覆盖返回地址（`$eip` / `$rip`）到 shellcode / 后门函数。

**Exploit**（pwntools）：

```python
from pwn import *
context.arch = 'amd64'
p = process('./binary')

# 后门函数地址（无 PIE 时是固定值）
backdoor = 0x401142
offset = 0x20 + 8   # buf 大小 + saved rbp
payload = b'A' * offset + p64(backdoor)

p.sendline(payload)
p.interactive()
```

## 3. 开启 NX（栈不可执行）→ ret2text / ret2shellcode / ret2libc

- **ret2text**：跳程序中已有的 `system("/bin/sh")` 后门
- **ret2shellcode**：有可执行内存段（如 mmap、bss 可执行），写入 shellcode 跳转
- **ret2libc**：调用 libc 的 `system` + 参数 `/bin/sh`
  - 需要泄露出 libc 的某个函数真实地址（如 `puts`、`printf`），从而计算基址
  - 再构造 `rdi = "/bin/sh"`，`call system`

**ret2libc 基本流程（64-bit）**

1. 泄露出 `puts@got` 的真实地址
2. 计算 libc 基址：`libc.address = puts_real - libc.sym['puts']`
3. 找到 `system` / `'/bin/sh'` 的地址
4. 再次进入溢出，控制 `rdi = '/bin/sh'`，调用 system

**64-bit 参数传递：rdi, rsi, rdx, rcx, r8, r9**
**ROP Gadget：`ROPgadget --binary ./binary` 找 ret / pop rdi;ret**

## 4. 开启 Canary（栈保护）

**绕过思路**

- 泄漏 Canary（格式化字符串漏洞 / 逐字节爆破）
- 栈迁移（Stack Pivot）：控制 ebp / rbp，把栈迁移到已知可控地址
- TLS 中读 Canary（特定条件）

**典型格式化字符串泄漏 Canary**

```
printf("%p.%p.%p.%p...")  # 在 Canary 位于栈上某个偏移时，可通过 %n$p 读出
```

## 5. 开启 PIE（代码段随机）

需先泄露出某个函数的真实地址（例如通过格式化字符串 / 部分泄露出 GOT 指针），用其减去相对偏移，算出 PIE 基址，才能计算其他 gadget 地址。

## 6. RELRO 与 GOT

- **Partial RELRO**：GOT 可写 → 可通过漏洞改写 `atoi` 的 GOT 为 `system`，再触发 `atoi("/bin/sh")`
- **Full RELRO**：GOT 只读，只能通过 rop 或 one gadget

## 7. 格式化字符串漏洞

```c
char buf[0x100];
read(0, buf, 0x100);
printf(buf);  // 攻击者可控 format string
```

**能力**：泄漏任意地址内容（`%s`）、泄漏栈上值（`%x %p`）、写入任意地址 4 字节（`%n` / `%hn` / `%hhn`）

## 8. 常用 Gadget & 工具

```bash
# 找 gadget
ROPgadget --binary ./binary | grep "pop rdi"
one_gadget ./libc.so.6

# ROP 工具
ROPgadget
ropper
rp++
pwntools 自带 ROP 构造

# 调试
gdb + pwndbg/GEF/PEDA
pattern create / pattern search
```

## 9. 快速入门练习建议

1. 做 `pwnable.kr / pwnable.tw / ctfhub.com` 的入门题
2. 按照「无保护 → NX → Canary → PIE → Full RELRO → heap」顺序
3. 熟悉 `pwntools`（process、remote、ELF、ROP、context）
4. 写 10+ 道栈溢出题后，进入堆题练习

---

> 建议环境：Ubuntu 20.04/22.04 + Python 3 + pwntools + pwndbg + glibc-all-in-one（便于切 libc 版本）
