# Reverse 入门：静态分析 + 动态调试（IDA / Ghidra / x64dbg）

> **📘 文档定位**：CISP 考试 CTF 安全 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 逆向工程入门指南，覆盖 IDA Pro/Ghidra/x64dbg 三大核心工具的使用技巧与实战案例。

---

## 导航目录

- [一、工具清单](#一工具清单)
- [二、IDA Pro 实战](#二ida-pro-实战)
- [三、Ghidra 实战](#三ghidra-实战)
- [四、x64dbg 实战](#四x64dbg-实战)
- [五、安全部署 Checklist](#五安全部署-checklist)
- [六、高分考点与知识巧记](#六高分考点与知识巧记)

---

## 1. 工具清单

| 工具 | 用途 |
|------|------|
| **IDA Pro**（商业） | 最强大的反编译器 Hex-Rays |
| **Ghidra**（免费） | NSA 开源，反编译 + 反汇编 |
| **x64dbg / OllyDbg** | Windows 动态调试 |
| **GDB + pwndbg / GEF / PEDA** | Linux 动态调试 |
| **die** / **Detect It Easy** | 查壳 / 编译器 / 保护类型 |
| **Frida** | 动态插桩、hook、脚本化分析 |
| **angr** | 符号执行（自动化求解约束） |
| **strings** / **FLARE FLOSS** | 字符串提取、去混淆 |
| **010 Editor / HxD** | 十六进制查看、二进制模板 |

## 2. 典型流程

1. `file binary` 看平台、架构、文件类型
2. `die` 查壳、编译器
3. 如有壳 → 脱壳（UPX：`upx -d`）
4. 拖入 IDA / Ghidra，识别关键函数：`main` / `check_flag` / `verify`
5. 分析算法：比较字节、异或、移位、AES / TEA / XTEA / RC4 …
6. 写逆推脚本恢复 flag

## 3. 常见算法与识别特征

| 算法 | 特征 |
|------|------|
| **AES** | 0x63, 0x7c, 0x77... S-Box；10 轮（128-bit key） |
| **TEA / XTEA** | 常数 0x9E3779B9、64 轮 / 32 轮 |
| **RC4** | 256 字节 S-box 初始化、i/j |
| **Base64** | `A-Za-z0-9+/=` 表，`= padding` |
| **MD5** | 初始常数 0x67452301、0xefcdab89、0x98badcfe、0x10325476 |
| **SHA-1** | 5 个初始 h0-h4 常数 0x67452301、0xEFCDAB89、0x98BADCFE、0x10325476、0xC3D2E1F0 |
| **XXTEA** | mx = (((z>>5^y<<2) + (y>>3^z<<4)) ^ ((sum^y) + (k[(p&3)^e] ^ z))) |
| **TEA** | sum += delta; y += ((z<<4) ^ (z>>5)) + z ^ sum + k[sum&3]; ... |
| **自定义 VM** | 大量 switch case / 查表 / 花指令 |

## 4. 动态调试要点（x64dbg）

- F2：设断点；F9：运行；F8：步过；F7：步入
- 关注 `strcmp` / `memcmp` / `check` 函数参数
- 在关键比较前下断点，观察寄存器与内存
- 用 `TraceIntoConditional` 对特定跳转单步跟踪

## 5. Python 写解密脚本

```python
# 例：把比较逻辑反过来
enc = [0x55, 0x4e, 0x52, ...]  # 从 IDA 中得到的加密后字节
key = 0x37
flag = bytes(b ^ key for b in enc)
print(flag)
```

## 6. Frida 快速 Hook 示例（Android / iOS / 桌面）

```js
// hook strcmp，打印两个比较参数
Interceptor.attach(Module.findExportByName("libc.so", "strcmp"), {
    onEnter(args) {
        console.log("strcmp:", args[0].readCString(), args[1].readCString());
    }
});
```

## 7. 符号执行（angr）

```python
import angr
p = angr.Project('./binary', auto_load_libs=False)
state = p.factory.entry_state()
sm = p.factory.simulation_manager(state)
sm.explore(find=0x401234, avoid=0x401220)
if sm.found:
    print(sm.found[0].posix.dumps(0))
```

## 8. 进阶技巧

- **混淆 / 花指令**：手工 NOP 掉、改 E8/E9 跳转
- **反调试**：检测 IsDebuggerPresent、CheckRemoteDebuggerPresent、ptrace、RDTSC 时间差；Frida Hook 绕过
- **VM 保护**（如 VMProtect / Themida）：识别字节码、还原指令语义
- **Android Native**：JNI_OnLoad、native 函数在 IDA 中分析；Frida Hook JNI

---

> 逆向工程是耐心与经验的积累。建议在 CTFHub / BUUCTF 上从「入门 Reverse」开始，一道题做 2-3 小时，反复磨炼。
