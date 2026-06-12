# 操作系统安全机制深入

---

## 一、ASLR / KASLR

```
ASLR (Address Space Layout Randomization)：
  每次加载程序时，堆/栈/库的基地址随机化
  → 攻击者无法硬编码地址 → ROP/JOP更难利用

Linux /proc/sys/kernel/randomize_va_space:
  0 = 关闭
  1 = 部分随机化（栈+库）
  2 = 完全随机化（★默认, 含堆）

KASLR (Kernel ASLR)：
  内核基地址随机化 → 内核漏洞利用难度↑
  /proc/cmdline: nokaslr (仅调试，生产禁止)
```

---

## 二、DEP / NX

```
DEP (Data Execution Prevention) / NX (No-eXecute)：
  标记内存页为"不可执行"
  → 栈/堆上的Shellcode无法执行

Linux: NX bit (硬件支持) + Exec Shield (软件)
  cat /proc/cpuinfo | grep nx → 查看硬件支持

Windows: DEP (Hardware-enforced)
  systeminfo | find "DEP"

绕过技术：
  Return-Oriented Programming (ROP)
  → 不执行新代码，复用已有代码片段(gadgets)
  
防御增强：
  Control Flow Guard (CFG) — 限制间接调用目标
  CET (Control-flow Enforcement Technology) — Intel 11代+
  Shadow Stack — 硬件级返回地址保护
```

---

## 三、沙箱机制

```
Linux seccomp (Secure Computing Mode)：
  限制进程可使用的系统调用
  seccomp-bpf: 自定义过滤规则(Berkeley Packet Filter语法)

Docker/容器沙箱：
  × 不是真正的沙箱！
  = Namespace隔离 + cgroup资源限制 + Capabilities限制
  → 共享同一个Kernel → 内核漏洞 = 容器逃逸

Windows Sandbox：
  Hyper-V硬件虚拟化隔离 → 真正的隔离
  Windows Defender Application Guard (WDAG)

Sandboxie (Windows)：
  应用层沙箱 → 拦截系统调用 → 不依赖虚拟化
```

---

## 四、Stack Canary / Stack Protector

```
Stack Canary (栈金丝雀)：
  在函数返回地址前插入一个随机值(canary)
  函数返回前检查canary是否被修改
  → 修改=栈溢出 → 程序终止

编译选项：
  -fstack-protector     (保护有缓冲区的函数)
  -fstack-protector-all (保护所有函数)
  -fstack-protector-strong (保护有数组/地址操作的函数) ← 默认

检查：
  checksec --file=/path/to/binary
  # 查看: Stack Canary / NX / PIE / RELRO
```

---

## 五、Checklist

- [ ] ASLR确认（/proc/sys/kernel/randomize_va_space=2）
- [ ] DEP/NX确认（硬件+软件双开）
- [ ] CFG/CET（Windows Server 2016+）
- [ ] seccomp/SELinux启用
- [ ] Stack Canary（编译时开启）
- [ ] 容器不用于强安全隔离场景
