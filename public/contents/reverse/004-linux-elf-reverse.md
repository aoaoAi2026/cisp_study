# Linux ELF 逆向：从入口点到 GOT/PLT 劫持实战

> **📘 文档定位**：CISP 考试逆向工程基础内容 | 难度：⭐⭐⭐⭐ | 预计阅读：22 分钟
> ELF 是 Linux 生态最主流的可执行文件格式。本文从文件结构到 GOT/PLT 劫持，系统梳理 ELF 逆向与二进制利用基础。

---

## 导航目录
- [一、ELF 文件结构概览](#一elf-文件结构概览)

ELF 从静态视角分为若干 Section（段），从运行视角又分为若干 Segment（程序段）：

| Section | 作用 |
| --- | --- |
| `.text` | 可执行代码 |
| `.rodata` | 只读数据（如字符串常量） |
| `.data` | 已初始化的读写数据 |
| `.bss` | 未初始化的全局变量（不占磁盘空间，运行时置零） |
| `.plt` | Procedure Linkage Table，动态链接的"跳板"代码 |
| `.got` / `.got.plt` | Global Offset Table，保存动态符号的真实地址 |
| `.dynamic` | 动态链接所需元信息 |
| `.dynsym` / `.dynstr` | 动态符号表与字符串表 |
| `.rel.plt` / `.rela.plt` | PLT 项的重定位记录 |

使用 `readelf -S file` 可以查看所有 section；`readelf -l file` 查看 program header。

## 二、从加载到执行

内核通过 `execve` 系统调用加载 ELF 时大致流程：

1. 读取 ELF header（`EHDR`），确认文件类型（ET_EXEC/ET_DYN/ET_REL/ET_CORE）。
2. 根据 program headers 把各 Segment 映射到进程地址空间。
3. 若为动态链接（`.interp` 段存在），由解释器（ld-linux.so）负责解析依赖并完成重定位。
4. 最终跳转到 `e_entry` 指向的入口点（通常是 `_start`，不是 `main`）。

> `_start` 是 glibc 的真实入口，它会初始化 libc、调用 `__libc_start_main`，最终才调用我们编写的 `main`。

## 三、GOT / PLT 与延迟绑定

当调用一个外部函数（如 `printf`）时：

- **PLT** 是一小段 stub 代码，每条 PLT 项对应一次跳转。
- **GOT** 是一个地址表，保存函数真实地址。PLT 第一次执行时会通过 GOT 跳转到解析代码（`ld.so` 的动态解析器），解析后把真实地址写回 GOT。
- 后续调用直接通过 GOT 跳转到真实函数。

基本流程：

```
call printf@plt          ->  进入 PLT 第 N 项
                           ->  jmp [printf@got]（第一次跳回 PLT 的 push+jmp）
                           ->  push 重定位项索引
                           ->  jmp _dl_runtime_resolve
                           -> 解析 printf 真实地址并写回 GOT
第二次 call printf@plt    ->  jmp [printf@got]（已经是真实地址）
```

这就是 **延迟绑定（Lazy Binding）** 的核心思想。

## 四、常见保护机制与对利用的影响

| 保护 | 含义 | 影响 |
| --- | --- | --- |
| NX/DEP | 栈/数据段默认不可执行 | 必须用 ROP/ret2libc 而非直接栈上 shellcode |
| ASLR | 栈/堆/共享库/mmap 地址随机 | 需要泄漏 libc 基址才能构造 ret2libc |
| Stack Canary | 栈上放置随机"哨兵值"，被覆盖时触发 __stack_chk_fail | 需要 canary 泄漏或绕过 |
| RELRO（Partial/Full） | 把 GOT 标记为只读（Full RELRO 会把整个 GOT 置只读） | Full RELRO 下无法 GOT hijack，只能通过其他思路 |
| PIE | 可执行文件本身也被随机加载 | 需额外泄漏程序镜像基址 |
| Fortify Source | 对 `sprintf` 等危险函数做编译期替换/检查 | 减少格式化字符串、栈溢出的可利用性 |

用 `checksec --file=./binary` 可快速检查以上保护状态。

## 五、经典利用链思路

### 5.1 格式化字符串漏洞（Format String）

当 `printf(user_input)` 出现时，攻击者可通过 `%x`、`%s`、`%n` 等格式符：

- 泄漏栈上数据（包括 canary、libc 返回地址、程序指针等）；
- 通过 `%n` 对任意地址写入有限值；
- Partial RELRO 下直接把 `printf@got` 改写为 `system` 的地址，实现"一次利用达成代码执行"。

### 5.2 栈溢出 + ret2libc

1. 通过溢出覆盖返回地址；
2. 借助 `puts@plt` 泄漏 `puts@got`，得到 libc 基址；
3. 再次进入 `main`，利用已知基址调用 `system("/bin/sh")`。
4. 在 PIE 开启时，需要先泄漏程序镜像基址，再重复上述过程。

### 5.3 栈溢出 + ROP

当 libc 难以直接调用时，用若干 `gadget`（以 ret 结尾的小指令片段）构造 ROP 链：

- 构造 `execve("/bin/sh", NULL, NULL)`；
- 或调用 `mprotect(addr, len, PROT_READ|PROT_WRITE|PROT_EXEC)` 让某段内存可执行，再跳到 shellcode。

### 5.4 GOT Hijack（GOT 劫持）

当存在"可控写入"漏洞时：

- Partial RELRO 下 `.got.plt` 可写，直接把 `atoi@got` 等高频调用改为 `system`；
- Full RELRO 下需要借助其他对象（例如栈、堆上的函数指针）完成劫持。

### 5.5 Heap 利用（PTMalloc）

- UAF（Use-After-Free）、Double Free、Chunk Overlap 等；
- 通过篡改 tcache/fastbin 的 fd/bk 指针实现"任意分配"（arbitrary alloc）；
- 把 fake chunk 分配到 `__free_hook`、`__malloc_hook`、`atoi@got` 等关键位置。

## 六、工具与调试流程

| 工具 | 典型用法 |
| --- | --- |
| `file` | 查看 ELF 类型与架构 |
| `readelf` | 查看 Section/Segment/Symbol/Dynamic |
| `objdump` | 反汇编 `.text`、查看 PLT/GOT |
| `checksec` | 检查保护机制 |
| `IDA Pro/Ghidra` | 静态反汇编与反编译（F5） |
| `pwndbg/peda/gef` | gdb 增强脚本，堆调试、回溯、libc 泄漏便捷 |
| `pwntools` | Python 的 CTF 框架，构造 exploit 与 IO 交互 |
| `one_gadget` | 查找 `execve("/bin/sh", NULL, NULL)` 现成 gadget |
| `ROPgadget` | 自动搜索 ROP gadget |
| `qiling` / `angr` | 模拟执行与符号执行，适合复杂利用链 |

典型调试流程：

1. `gdb ./binary` → `b main` → `r`；
2. 用 `cyclic` 生成 pattern 定位溢出偏移；
3. 查看 `puts@got`、`printf@got` 等地址；
4. 构造 payload，配合 `pwnlib` 在 pwntools 里完成交互；
5. 验证 shell/flag。

## 七、实战建议

- **关注版本**：不同 glibc 版本（2.23/2.27/2.31/2.34）的 tcache、largebin、`__free_hook` 行为差异明显；要与题目提供 libc 版本一致。
- **善用 F5**：Ghidra/IDA 的反编译能快速还原复杂逻辑，配合手动对照汇编修正。
- **脚本化利用**：pwntools 的 `ELF`、`ROP`、`process`/`remote` 是核心，模板化能大幅缩短 exploit 编写时间。
- **练习 + 总结**：Hack The Box、pwn.college、BUUCTF 的 pwn 题都是优秀素材，每道题都尝试总结"漏洞类型 + 利用链 + 保护绕过方式"。

## 八、学习路径

1. 基础：理解 ELF 结构、`readelf`/`objdump` 使用；
2. 栈溢出：无保护 → NX → Canary → PIE → ASLR 逐层挑战；
3. 格式化字符串：泄漏/写入/GOT 劫持；
4. 堆利用：UAF、Double Free、Tcache poisoning、House of …；
5. Kernel Pwn：KASLR、SMEP/SMAP、KPTI、modprobe_path 等。

ELF 逆向与二进制漏洞利用是一场"与系统机制对话"的修行。把每个保护机制的原理与绕过方式"模块化"理解，再通过实战把它们组合起来，就能形成可复用的攻防思维。

---

## 高分考点与知识巧记

> 🔑 **高分考点**：ELF 逆向考点集中在文件结构、GOT/PLT 机制、保护机制(PIE/RELRO/NX)。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| GOT/PLT | ⭐⭐⭐⭐⭐ | PLT 跳板→GOT 真实地址，延迟绑定(lazy binding) |
| 保护机制 | ⭐⭐⭐⭐ | PIE(地址随机化)、RELRO(GOT 只读)、NX(栈不可执行)、Stack Canary |
| ELF 结构 | ⭐⭐⭐ | ELF Header + Program Header + Section Header |

> 💡 **知识巧记**：GOT/PLT 记"PLT 跳板 GOT 真址"，保护机制记"PIE 随 RELRO 固 NX 禁 Canary 检"。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| Full RELRO | GOT 完全只读，无法 GOT 覆写 | "Partial RELRO 也防 GOT 覆写" ❌ |
| PIE bypass | 需要先泄露基址才能 ROP | "PIE 下直接 ret2libc 可行" ❌ |

### 知识巧记口诀

> **ELF 逆向口诀**：
> PLT 跳板 GOT 真址，延迟绑定首次解析。
> PIE 随 RELRO 固 NX 禁，Canary 栈保护溢出检。
