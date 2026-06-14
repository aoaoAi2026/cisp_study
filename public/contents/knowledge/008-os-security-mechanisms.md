# 操作系统安全机制深入

> **📘 文档定位**：CISP 考试核心基础 | 难度：⭐⭐⭐⭐⭐ | 预计阅读：35 分钟
> 操作系统是现代信息系统的基石，其安全机制是纵深防御的第一道防线。本章深入剖析 ASLR、DEP/NX、沙箱、Stack Canary、CFG/CET 五大核心保护机制的底层原理，是 CISP 考试中"软件安全"与"系统安全"板块的必考内容。

---

## 导航目录
- [一、ASLR / KASLR 地址空间随机化](#一aslr--kaslr-地址空间随机化)
- [二、DEP / NX 数据执行保护](#二dep--nx-数据执行保护)
- [三、沙箱机制](#三沙箱机制)
- [四、Stack Canary / Stack Protector](#四stack-canary--stack-protector)
- [五、CFG / CET 控制流完整性](#五cfg--cet-控制流完整性)
- [六、RELRO / PIE 补充保护](#六relro--pie-补充保护)
- [七、安全部署 Checklist](#七安全部署-checklist)
- [八、高分考点与知识巧记](#八高分考点与知识巧记)

---

## 一、ASLR / KASLR 地址空间随机化

### 1.1 为什么需要地址随机化？

```
┌─────────────────────────────────────────────────────────────┐
│              无 ASLR 时：攻击者的天堂                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  传统内存布局（固定地址）：                                    │
│                                                             │
│  0xFFFFFFFF ┌──────────┐                                    │
│             │  栈 (Stack)  │ ← 固定地址 0xBFFFxxxx           │
│             ├──────────┤                                    │
│             │     ↓     │                                    │
│             │    ...    │                                    │
│             │     ↑     │                                    │
│             ├──────────┤                                    │
│             │  堆 (Heap)   │ ← 固定地址 0x0804xxxx           │
│             ├──────────┤                                    │
│             │  数据段    │                                    │
│             ├──────────┤                                    │
│             │  代码段    │ ← 固定地址 0x08048000             │
│  0x00000000 └──────────┘                                    │
│                                                             │
│  攻击者只需一次分析 → 写出硬编码地址的 Exploit                  │
│  → 同一 Exploit 可攻击所有同类系统！                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**ASLR 的核心思想**：每次程序加载时，随机化堆、栈、共享库的基地址，使得攻击者无法预测内存布局，从而无法编写通用的利用代码。

### 1.2 ASLR 工作层次

```
┌─────────────────────────────────────────────────────────────┐
│                  ASLR 随机化层次                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  等级 0 (关闭):                                               │
│    randomize_va_space = 0                                    │
│    → 所有地址固定，攻击者天堂                                  │
│    → 仅用于调试，生产环境绝对禁止                              │
│                                                             │
│  等级 1 (部分随机化):                                         │
│    randomize_va_space = 1                                    │
│    → 栈 + 共享库地址随机化                                    │
│    → 堆地址仍固定                                            │
│    → 较少使用                                                │
│                                                             │
│  ★ 等级 2 (完全随机化) ← Linux 默认:                          │
│    randomize_va_space = 2                                    │
│    → 栈 + 堆 + 共享库 + mmap 全部随机化                       │
│    → 代码段(PIE 编译后)也可随机化                             │
│    → 攻击者几乎无法预测任何地址                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

```bash
# === ASLR 配置与检查 ===

# 查看当前 ASLR 状态
cat /proc/sys/kernel/randomize_va_space
# 输出 2 → 完全随机化（推荐）

# 临时修改（重启失效）
echo 2 > /proc/sys/kernel/randomize_va_space

# 永久修改
echo "kernel.randomize_va_space = 2" >> /etc/sysctl.conf
sysctl -p

# 检查某个进程的 ASLR 状态
cat /proc/<PID>/maps
# 观察每次启动时地址是否变化

# 检查二进制是否支持 PIE（位置无关可执行文件）
readelf -h /path/to/binary | grep Type
# Type: DYN (Position-Independent Executable) ← 支持 ASLR
# Type: EXEC (Executable file)              ← 不支持 ASLR

# 或用 checksec 工具
checksec --file=/path/to/binary
```

### 1.3 KASLR（内核地址随机化）

> **🔑 高分考点**：KASLR 和 ASLR 的区别是常考点。

```
KASLR (Kernel ASLR) — 保护内核自身：

原理：
  每次系统启动时，内核代码和数据在物理内存中的加载地址随机化
  → 内核基址偏移量在 0~512MB 范围内随机
  → 攻击者即使有内核漏洞，也不知道内核函数地址
  → ROP/JOP 攻击难度大幅提升

启动参数控制：
  nokaslr  → 关闭 KASLR（仅调试用，生产绝对禁止！）
  默认开启 → 无需显式指定

检查：
  cat /proc/cmdline | grep -o "nokaslr"
  # 有输出 → KASLR 关闭！危险！

  # 验证是否真的在随机化（每次重启看 /proc/kallsyms）
  cat /proc/kallsyms | head -5
  # 注意：root 权限下 /proc/kallsyms 会显示真实地址
  # 普通用户只能看到 0（内核保护机制 kptr_restrict）

绕过技术：
  - 信息泄露：先泄露一个内核地址，推算出基址
  - 侧信道攻击：通过时间/缓存差异推断地址
  - 物理内存攻击：DMA/Rogue Memory 直接读写
```

### 1.4 Windows ASLR

```
Windows ASLR (Vista 起引入)：

注册表配置：
  HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management
  → MoveImages → 控制 DLL 随机化

PowerShell 查询：
  Get-ProcessMitigation -System
  # 查看系统级 ASLR 策略

特点：
  → 每次重启随机化（而非每次加载）
  → 支持自下而上随机化（Bottom-up ASLR）
  → 支持高熵 ASLR（64 位系统）
```

> **💡 知识巧记**：ASLR 三个层级——**0 关闭、1 栈库、2 全随**。KASLR 保护内核，nokaslr 绝对不能出现在生产环境！

---

## 二、DEP / NX 数据执行保护

### 2.1 核心原理

```
┌─────────────────────────────────────────────────────────────┐
│                 DEP/NX 位的工作原理                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  传统内存保护：                                               │
│    只有"读/写"权限位 → 数据区域可读可写可执行！                │
│    → 攻击者将 Shellcode 写入栈/堆 → 跳转执行 → 成功！         │
│                                                             │
│  DEP/NX 新增 "执行" 权限位：                                  │
│    ┌─────────────┬─────┬─────┬─────┐                        │
│    │ 内存区域     │ 读  │ 写  │ 执行 │                        │
│    ├─────────────┼─────┼─────┼─────┤                        │
│    │ 代码段 (.text)│  ✓  │  ✗  │  ✓  │  ← 唯一可执行区域     │
│    │ 栈 (Stack)   │  ✓  │  ✓  │  ✗  │  ← NX 位保护          │
│    │ 堆 (Heap)    │  ✓  │  ✓  │  ✗  │  ← NX 位保护          │
│    │ 数据段 (.data)│  ✓  │  ✓  │  ✗  │  ← NX 位保护          │
│    └─────────────┴─────┴─────┴─────┘                        │
│                                                             │
│  效果：攻击者注入的 Shellcode 在栈/堆上 → 无法执行 → 崩溃     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 不同平台的实现

| 平台 | 技术名称 | 实现方式 |
|:---|:---|:---|
| **Linux** | NX (No-eXecute) / XD (eXecute Disable) | 硬件 NX 位（x86-64）+ Exec Shield（软件） |
| **Windows** | DEP (Data Execution Prevention) | 硬件强制 DEP + 软件 DEP（SafeSEH） |
| **macOS** | W^X (Write XOR Execute) | 内存页不允许同时可写可执行 |
| **iOS/Android** | W^X + Code Signing | 只允许签名代码执行 |

```bash
# === Linux NX 检查 ===

# 检查 CPU 硬件支持
cat /proc/cpuinfo | grep -o nx
# 有 nx 输出 → 硬件支持

# 检查进程的内存映射权限
cat /proc/<PID>/maps
# 输出示例：
# 7ffd12345000-7ffd12366000 rw-p ... [stack]  ← rw-p = 可读可写，不可执行！
# 555555554000-555555555000 r-xp ... .text     ← r-xp = 可读可执行（代码段）

# 注意权限标志：
# r = 读, w = 写, x = 执行, p/s = 私有/共享
```

```powershell
# === Windows DEP 检查 ===

# 查看系统 DEP 状态
wmic OS Get DataExecutionPrevention_Available
wmic OS Get DataExecutionPrevention_SupportPolicy
# 2 = OptOut（默认开启，可排除）
# 3 = OptIn（仅关键系统组件）

# PowerShell
Get-ProcessMitigation -System | Select-Object DEP
```

### 2.3 DEP/NX 的绕过技术 — ROP

> **🔑 高分考点（必考）**：DEP/NX 不能防御 ROP 攻击，因为 ROP 不执行注入的代码！

```
DEP/NX 的本质限制：
  → 只能防止"在数据区执行代码"
  → 不能防止"复用已有的代码片段"

ROP (Return-Oriented Programming) 原理：

  正常函数返回：
    函数执行完毕 → ret → 跳转到返回地址继续执行

  ROP 利用：
    栈溢出覆盖返回地址 → 指向已有代码中的 "gadget"
    → gadget 执行完 → ret → 下一个 gadget
    → 像串珠子一样串起 gadgets → 实现任意功能

  示例 gadget 链（伪代码）：
    [Gadget 1: pop rax; ret]        ← 将值弹入 rax
    [值: 59]                         ← execve 系统调用号
    [Gadget 2: pop rdi; ret]        ← 将值弹入 rdi
    [值: "/bin/sh" 的地址]           ← 第一个参数
    [Gadget 3: pop rsi; ret]        ← 将值弹入 rsi
    [值: 0]                          ← 第二个参数
    [Gadget 4: syscall; ret]        ← 执行系统调用
    → 效果：execve("/bin/sh", 0, 0) → 获得 Shell！

  ★ 关键：ROP 不执行注入的新代码，而是复用已有的合法代码
  → DEP/NX 无法防御！
```

### 2.4 防御 ROP 的技术演进

```
对抗 ROP 的多层防御：

★ CFG (Control Flow Guard) — Windows:
  编译时记录所有合法的间接调用目标
  运行时：间接调用前 → 检查目标地址是否在合法列表中
  → 不在 → 终止进程
  → 破坏 ROP 链的跳转

★ CET (Control-flow Enforcement Technology) — Intel:
  硬件级保护，11代 Core 起支持
  两种机制：
    IBT (Indirect Branch Tracking):
      间接跳转目标必须是以 ENDBRANCH 指令开始
      → 跳转到 gadget 中间位置 → 触发异常
    
    Shadow Stack:
      硬件维护一个独立的"影子栈"
      存放返回地址的副本
      ret 时对比普通栈和影子栈的返回地址
      → 不匹配 → 触发异常
      → 彻底防御 ROP！

★ PAC (Pointer Authentication) — ARM (Apple M系列):
  指针签名：用密钥对指针值进行哈希签名
  → 篡改指针 → 签名验证失败 → 崩溃
  → ROP/JOP 难以构建 gadget 链
```

> **💡 知识巧记**：DEP/NX 防注入（不让你写代码），CFG/CET 防复用（不让你跳着用）。NX 是数据不可执行，ROP 是借刀杀人，CET Shadow Stack 是终极方案。

---

## 三、沙箱机制

### 3.1 沙箱的核心理念

```
什么是沙箱？
  → 为程序提供一个受限的执行环境
  → 程序在沙箱内可以为所欲为
  → 但无法影响沙箱外的系统

沙箱 ≠ 隔离 ≠ 虚拟化
  这三个概念层次不同：
  ┌──────────────────────────────────┐
  │  虚拟化 (VM)  — 硬件级隔离       │  ← 最强隔离
  │  沙箱 (Sandbox) — 系统调用级限制  │  ← 中等隔离
  │  容器 (Container) — 进程级隔离    │  ← 较弱隔离
  └──────────────────────────────────┘
```

### 3.2 Linux seccomp

> **🔑 高分考点**：seccomp 是 Linux 沙箱的核心，Docker 等容器技术依赖它。

```
seccomp (Secure Computing Mode)：

模式 1 — SECCOMP_SET_MODE_STRICT (严格模式)：
  进程只能使用 4 个系统调用：
    read(), write(), _exit(), sigreturn()
  → 任何其他系统调用 → 进程被 SIGKILL 杀死
  → 限制太严，实用性低

★ 模式 2 — SECCOMP_SET_MODE_FILTER (过滤模式)：
  使用 BPF (Berkeley Packet Filter) 语法定义规则
  → 白名单/黑名单系统调用
  → 可根据参数进行细粒度控制

  BPF 过滤规则示例逻辑：
    允许: read, write, open, close, mmap, mprotect...
    禁止: execve, fork, ptrace, mount, reboot...
    → 既保证程序正常运行，又限制危险操作
```

```bash
# === seccomp 检查 ===

# 查看进程的 seccomp 状态
cat /proc/<PID>/status | grep Seccomp
# 0 = 禁用
# 1 = STRICT 模式
# 2 = FILTER 模式 ← Docker 容器默认

# 查看 Docker 容器的 seccomp 配置
docker inspect <container> | jq '.[0].HostConfig.SecurityOpt'

# 运行容器时指定 seccomp profile
docker run --security-opt seccomp=/path/to/profile.json ...
```

### 3.3 容器不是真正的沙箱

> **⚠️ 考试陷阱**：Docker 容器不是安全沙箱！这几乎是 CISP 考试的必考点。

```
为什么容器不是真正的沙箱？

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  容器隔离技术：                                               │
│    ┌──────────┐ ┌──────────┐ ┌──────────┐                  │
│    │ 容器 A    │ │ 容器 B    │ │ 容器 C    │                  │
│    │ (namesp)  │ │ (namesp)  │ │ (namesp)  │                  │
│    └──────────┘ └──────────┘ └──────────┘                  │
│    ┌──────────────────────────────────────┐                │
│    │        共享同一个 Linux 内核           │                │
│    └──────────────────────────────────────┘                │
│    ┌──────────────────────────────────────┐                │
│    │              硬件                     │                │
│    └──────────────────────────────────────┘                │
│                                                             │
│  容器 = Namespace (视图隔离) + cgroup (资源限制)             │
│        + Capabilities (权限限制) + seccomp (系统调用过滤)    │
│                                                             │
│  致命缺陷：共享内核！                                         │
│    内核漏洞 → 容器 A 利用 → 控制整个宿主机 → 容器 B、C 全部沦陷│
│    → 这就是"容器逃逸"                                        │
│                                                             │
│  真实案例：                                                   │
│    CVE-2016-5195 (DirtyCow) — 内核写时复制漏洞               │
│    CVE-2022-0847 (DirtyPipe) — 管道覆写漏洞                  │
│    → 容器内低权限用户可利用内核漏洞提权到 root                 │
│    → 继而访问宿主机文件系统、其他容器数据                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.4 真正的沙箱方案

| 方案 | 隔离级别 | 原理 | 适用场景 |
|:---|:---|:---|:---|
| **Windows Sandbox** | 硬件虚拟化 | Hyper-V 完全隔离 | 临时/不可信程序运行 |
| **WDAG** (Windows Defender Application Guard) | 硬件虚拟化 | Edge 浏览器在 Hyper-V 中运行 | 浏览不可信网站 |
| **Firecracker** (AWS Lambda) | 轻量虚拟机 | KVM + 极简 Guest OS | 无服务器计算 |
| **gVisor** (Google) | 用户态内核 | 在用户态实现 Linux 内核接口 | 容器安全增强 |
| **Kata Containers** | 轻量虚拟机 | 每个容器独立内核 | 强隔离容器 |
| **Qubes OS** | 虚拟化 | 不同任务在不同 VM 中运行 | 极高安全需求 |

```
Windows Sandbox 特点：
  → 基于 Hyper-V 硬件虚拟化
  → 每次启动全新、干净的环境
  → 关闭后所有数据销毁，不留痕迹
  → 与宿主机完全隔离
  → 这才是"真正的沙箱"

Docker 容器安全加固方案（如果必须用容器）：
  → 不以 root 运行（USER 指令）
  → 只读根文件系统（--read-only）
  → 禁用特权模式（no --privileged）
  → 限制 Capabilities（--cap-drop=ALL --cap-add=NET_BIND_SERVICE）
  → 自定义 seccomp profile
  → AppArmor/SELinux 强制访问控制
  → 使用无发行版基础镜像（distroless）
```

> **💡 知识巧记**：容器是"软隔离"（共享内核），沙箱是"硬隔离"（独立内核/虚拟化）。Docker ≠ 沙箱，内核漏洞 = 全盘沦陷！

---

## 四、Stack Canary / Stack Protector

### 4.1 栈溢出的经典利用

```
栈溢出的攻击原理（复习）：

正常栈帧布局：
  ┌─────────────────┐  高地址
  │   函数参数       │
  ├─────────────────┤
  │   返回地址       │  ← 攻击目标！覆盖此值可劫持控制流
  ├─────────────────┤
  │   旧 EBP/RBP     │
  ├─────────────────┤
  │   局部变量       │  ← 缓冲区在此
  │   char buf[64]   │  ← 向高地址增长（溢出方向 →）
  └─────────────────┘  低地址

  如果 buf 接收超过 64 字节的数据：
  → 溢出覆盖局部变量、EBP、返回地址
  → 控制返回地址 → 跳转到攻击者控制的地址
```

### 4.2 Stack Canary 工作原理

> **🔑 高分考点（必考）**：Canary 的工作原理和三种类型是常考题。

```
┌─────────────────────────────────────────────────────────────┐
│              Stack Canary (栈金丝雀) 保护机制                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  保护后的栈帧布局：                                           │
│  ┌─────────────────┐  高地址                                │
│  │   函数参数       │                                        │
│  ├─────────────────┤                                        │
│  │   返回地址       │                                        │
│  ├─────────────────┤                                        │
│  │   旧 EBP/RBP     │                                        │
│  ├─────────────────┤                                        │
│  │ ★ Stack Canary  │  ← 随机值，在局部变量和返回地址之间      │
│  ├─────────────────┤                                        │
│  │   局部变量       │                                        │
│  │   char buf[64]   │                                        │
│  └─────────────────┘  低地址                                │
│                                                             │
│  保护流程：                                                   │
│    函数入口 → 从 TLS/随机源读取 Canary → 放入栈上             │
│    函数返回前 → 检查栈上的 Canary 是否与原始值一致             │
│    → 一致：安全返回                                           │
│    → 不一致：检测到栈溢出 → __stack_chk_fail() → 程序终止     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 三种 Canary 类型

| 类型 | Canary 值 | 安全性 | 说明 |
|:---|:---|:---:|:---|
| **Terminator Canary** | `0x000aff0d` | ⭐⭐ | 包含 NULL、CR、LF 等字符串终止符，阻止 strcpy 类函数继续复制 |
| **Random Canary** | 随机值 | ⭐⭐⭐⭐ | 从 /dev/urandom 获取，存在 TLS 中，每次进程启动重新生成 |
| **Random XOR Canary** | 随机值 XOR 部分栈数据 | ⭐⭐⭐⭐⭐ | 最强保护，防止 Canary 本身被信息泄露攻击 |

### 4.4 编译选项与检测

```bash
# === GCC 栈保护编译选项 ===

# 基础保护：仅保护有 ≥8 字节缓冲区的函数
gcc -fstack-protector program.c -o program

# 强保护：保护有数组/地址操作的函数（★ 现代 Linux 发行版默认）
gcc -fstack-protector-strong program.c -o program

# 全部保护：所有函数都加 Canary（性能开销大）
gcc -fstack-protector-all program.c -o program

# 禁用保护（危险！仅调试用）
gcc -fno-stack-protector program.c -o program

# === 检查二进制安全属性 ===
checksec --file=/path/to/binary
# 输出示例：
# RELRO:    Full RELRO
# STACK CANARY: Canary found     ← 有栈保护
# NX:       NX enabled           ← 数据不可执行
# PIE:      PIE enabled          ← 地址随机化
```

### 4.5 Canary 的绕过技术

```
常见绕过手法（了解即可，说明 Canary 不是万能的）：

1. 信息泄露：
   先读取 Canary 值（通过格式化字符串漏洞等）
   → 溢出时在正确位置填入原始 Canary 值
   → 保护失效

2. 逐字节爆破（Fork 服务器）：
   fork() 子进程继承父进程的 Canary
   → 逐字节尝试，根据是否崩溃判断是否正确
   → 256×8=2048 次尝试可恢复 64 位 Canary

3. 直接覆盖数据指针：
   不覆盖返回地址，而是覆盖函数指针/数据指针
   → Canary 不保护局部变量
   
4. 覆盖栈外的关键数据：
   攻击不在栈上的数据（堆、BSS 段等）
   → Canary 不保护这些区域
```

---

## 五、CFG / CET 控制流完整性

### 5.1 控制流劫持的本质

```
所有代码执行攻击的共同模式：
  → 劫持程序的控制流（修改跳转目标）
  → 将执行导向攻击者选定的地址

劫持手段：
  → 栈溢出 → 覆盖返回地址
  → 堆溢出 → 覆盖函数指针/vtable 指针
  → Use-After-Free → 控制已释放的内存内容
  → 格式化字符串 → 任意地址写入

CFG/CET 的思路：
  不阻止漏洞本身，而是阻止漏洞被成功利用
  → 程序可以崩溃（安全失败），但不能被劫持执行任意代码
```

### 5.2 Windows CFG (Control Flow Guard)

```
CFG 工作原理：

编译时：
  编译器识别所有"间接调用的合法目标"
  → 生成一个位图 (bitmap)，标记所有合法目标地址
  → 嵌入到可执行文件中

运行时：
  每次间接调用前（call rax / jmp rbx 等）
  → 插入检查代码：_guard_check_icall(target)
  → 查询位图：目标地址是否是合法调用目标？
  → 是 → 正常执行
  → 否 → 触发异常 → 进程终止

优势：
  → 精确控制间接跳转目标
  → 性能开销小（位图查询 O(1)）
  → 显著提高 ROP/JOP 攻击难度

局限：
  → 不能保护直接调用
  → 不能保护返回地址（需要 CET Shadow Stack）
  → 编译时必须启用（/guard:cf）
```

### 5.3 Intel CET (Control-flow Enforcement Technology)

> **🔑 高分考点**：CET 的两大支柱——IBT 和 Shadow Stack。

```
CET 的两大支柱：

★ 1. IBT (Indirect Branch Tracking) — 间接分支跟踪：
   原理：
     所有合法的间接跳转目标必须以 ENDBRANCH 指令开头
     运行时：jmp/call 到新地址 → CPU 检查第一个指令是否是 ENDBRANCH
     → 是 → 合法跳转，正常执行
     → 否 → #CP 异常（Control-flow Protection Fault）
   
   效果：
     ROP gadget 通常在指令中间开始 → 没有 ENDBRANCH → 被阻止！
     JOP gadget 也是跳到函数中间 → 没有 ENDBRANCH → 被阻止！

★ 2. Shadow Stack — 影子栈：
   原理：
     CPU 维护一个独立的、操作系统无法直接访问的"影子栈"
     函数调用 (call) → 返回地址同时压入普通栈和影子栈
     函数返回 (ret) → CPU 对比普通栈和影子栈的返回地址
     → 一致：正常返回
     → 不一致：触发 #CP 异常
   
   效果：
     栈溢出覆盖了普通栈的返回地址
     → 但影子栈的返回地址无法被覆盖
     → ret 时检测到不匹配 → 攻击被阻止！

硬件要求：
   Intel 11 代 Core (Tiger Lake) 起支持
   AMD Zen 3 起支持 (Shadow Stack)
   Windows 10 20H1+ / Linux 5.18+ 支持
```

> **💡 知识巧记**：CET = IBT（进门检查）+ Shadow Stack（出门验证）。IBT 防跳转劫持，Shadow Stack 防返回劫持。双剑合璧，ROP/JOP 几乎不可能！

---

## 六、RELRO / PIE 补充保护

### 6.1 RELRO (Relocation Read-Only)

```
ELF 文件的重定位过程：
  动态链接时，某些符号地址需要在加载时"重定位"
  → GOT (Global Offset Table) 存放重定位后的函数地址
  → PLT (Procedure Linkage Table) 作为跳板调用这些函数

攻击面 — GOT 覆写：
  如果有任意地址写漏洞 → 覆盖 GOT 中的函数地址
  → 下次调用该函数 → 跳转到攻击者控制的地址
  → 例如：覆盖 free@GOT 为 system@PLT → free(ptr) 变成 system(ptr)

RELRO 的保护级别：

  1. No RELRO:
     GOT 完全可写，没有任何保护

  2. Partial RELRO:
     GOT 的非 PLT 部分只读
     PLT 相关的 GOT 条目仍然可写（按需重定位）
     → 默认选项

  ★ 3. Full RELRO:
     所有重定位在加载时完成
     → 整个 GOT 标记为只读
     → 任何 GOT 覆写尝试 → Segfault
     → 最强保护，有轻微启动延迟

编译选项：
  gcc -Wl,-z,relro,-z,now program.c -o program
  # -z relro = 开启 RELRO
  # -z now   = 立即重定位（Full RELRO 的关键）
```

### 6.2 PIE (Position-Independent Executable)

```
PIE 与 ASLR 的关系：
  ASLR 负责"随机化" → PIE 让程序"能被随机化"
  
  非 PIE 程序：
    代码段地址固定（如 0x400000）
    → 即使开启了 ASLR，代码段仍在固定位置
    → 攻击者可以直接使用程序中的 gadget（ROP）
  
  PIE 程序：
    代码段位置可以随机化
    → 攻击者必须先泄露代码地址
    → 增加利用难度

编译选项：
  gcc -fPIE -pie program.c -o program
  
检查：
  readelf -h program | grep Type
  # Type: DYN (Position-Independent Executable file) ← PIE
  # Type: EXEC (Executable file)                   ← 非 PIE
```

---

## 七、安全部署 Checklist

| 序号 | 检查项 | 状态 | 命令/方法 |
|:---:|:---|:---:|:---|
| 1 | ASLR 完全随机化 | ☐ | `cat /proc/sys/kernel/randomize_va_space` → 应为 2 |
| 2 | KASLR 开启 | ☐ | `cat /proc/cmdline` → 不应含 nokaslr |
| 3 | NX/DEP 启用 | ☐ | `cat /proc/cpuinfo \| grep nx` |
| 4 | Stack Canary 编译 | ☐ | `checksec --file=binary` |
| 5 | Full RELRO | ☐ | `checksec --file=binary` |
| 6 | PIE 编译 | ☐ | `readelf -h binary \| grep DYN` |
| 7 | CFG 启用 (Windows) | ☐ | `/guard:cf` 编译选项 |
| 8 | seccomp 容器启用 | ☐ | `cat /proc/<PID>/status \| grep Seccomp` → 2 |
| 9 | SELinux/AppArmor 启用 | ☐ | `getenforce` / `aa-status` |
| 10 | 容器不以 root 运行 | ☐ | `docker inspect \| grep User` |

---

## 八、高分考点与知识巧记

### 📊 高分考点速查表

| 序号 | 考点名称 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | ASLR 三个级别 | ⭐⭐⭐⭐⭐ | ⭐⭐ | 0=关闭, 1=栈+库, 2=全部(堆栈库) |
| 2 | ASLR vs KASLR | ⭐⭐⭐⭐ | ⭐⭐⭐ | ASLR 保护用户态，KASLR 保护内核地址 |
| 3 | DEP/NX 原理 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 标记数据页不可执行，防 Shellcode 注入 |
| 4 | ROP 绕过 NX | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ROP 不注入代码，复用已有 gadgets |
| 5 | Stack Canary 三种类型 | ⭐⭐⭐⭐ | ⭐⭐⭐ | Terminator/Random/Random XOR |
| 6 | Canary 放置位置 | ⭐⭐⭐ | ⭐⭐ | 在局部变量和返回地址之间 |
| 7 | Docker ≠ 沙箱 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 共享内核，内核漏洞=容器逃逸 |
| 8 | seccomp 两种模式 | ⭐⭐⭐ | ⭐⭐⭐ | STRICT(4个系统调用) / FILTER(BPF规则) |
| 9 | CET 两大支柱 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | IBT(间接分支跟踪) + Shadow Stack(影子栈) |
| 10 | Full RELRO 特点 | ⭐⭐⭐ | ⭐⭐⭐ | 加载时完成重定位，GOT 只读 |
| 11 | PIE 的作用 | ⭐⭐⭐ | ⭐⭐ | 使代码段地址可随机化，配合 ASLR |
| 12 | Windows Sandbox 隔离 | ⭐⭐⭐ | ⭐⭐ | 基于 Hyper-V 硬件虚拟化，真正隔离 |

### 🎵 知识巧记口诀

```
ASLR 地址随机化：
  零关一栈二全随
  用户 ASLR，内核 KASLR
  nokaslr 是禁区，生产环境绝不行

DEP/NX 防注入：
  数据页不可执行
  栈堆区写不运行
  ROP 借刀来杀人
  CET 影子栈断后路

Stack Canary 金丝雀：
  变量返回夹中间
  函数退出验真身
  若被篡改即终止
  编译强保护最安全

容器不是沙箱：
  容器共享一内核
  逃逸漏洞全沦陷
  真正沙箱靠虚拟
  Hyper-V 隔离才放心

CET 终极防御：
  IBT 管进门——检查目标有标签
  Shadow Stack 管出门——返回地址验副本
  双管齐下防劫持
  十一代酷睿始支持
```

### ⚠️ 考试陷阱提醒

| 序号 | 常见错误理解 | 正确理解 |
|:---:|:---|:---|
| 1 | "DEP/NX 能防所有溢出攻击" | ❌ ROP 可绕过，CET Shadow Stack 才能防 ROP |
| 2 | "ASLR=2 就能完全防止攻击" | ❌ 结合信息泄露仍可能被绕过，需配合 PIE+Full RELRO |
| 3 | "Docker 是安全沙箱" | ❌ 共享内核，有内核漏洞即可逃逸 |
| 4 | "Canary 能防所有栈溢出" | ❌ 信息泄露可绕过 Canary，不防数据指针覆盖 |
| 5 | "seccomp STRICT 模式最常用" | ❌ STRICT 太严（仅4个调用），FILTER 模式更实用 |
| 6 | "Stack Canary 在函数参数前面" | ❌ 在局部变量和返回地址之间（夹在中间） |
| 7 | "CET 只需要 IBT" | ❌ IBT 防间接跳转，Shadow Stack 防返回劫持，两者互补 |
| 8 | "KASLR 用 randomize_va_space 控制" | ❌ KASLR 是内核启动参数，ASLR 是 /proc/sys 参数 |
| 9 | "PIE 和 ASLR 是同一回事" | ❌ PIE 让代码"能被随机化"，ASLR 执行"随机化"动作 |
| 10 | "Full RELRO 没有缺点" | 有轻微启动延迟（需加载时完成所有重定位） |
