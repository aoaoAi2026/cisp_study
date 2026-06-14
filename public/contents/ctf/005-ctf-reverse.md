# Reverse 入门：静态分析 + 动态调试

> **📘 文档定位**：CISP 考试 CTF 安全 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 系统讲解 CTF Reverse 方向的入门知识：IDA Pro/Ghidra 静态分析、x64dbg 动态调试、常见算法识别及脱壳技术。

---

## 导航目录

- [一、逆向基础概念](#一逆向基础概念)
- [二、静态分析实战](#二静态分析实战)
- [三、动态调试实战](#三动态调试实战)
- [四、常见算法识别](#四常见算法识别)
- [五、脱壳技术入门](#五脱壳技术入门)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、工具链

```
静态分析: IDA Pro(F5反编译) / Ghidra(免费)
动态调试: x64dbg(Win) / GDB+pwndbg(Linux) / OllyDbg(Win旧版)
基础工具: strings / file / binwalk / Detect It Easy
```

---

## 二、静态分析

```bash
# 基础信息
file crackme.exe        # 文件类型
strings crackme.exe     # 搜索字符串(常直接找到flag)
binwalk crackme.exe     # 检查是否有嵌入数据

# IDA Pro 流程
# ① 加载文件 → 自动分析
# ② F5 → 伪C代码
# ③ 找到 main 函数
# ④ 分析逻辑: 加密/比较/反调试
# ⑤ 提取关键算法 → 逆运算

# Ghidra (免费替代)
# File → Import → 自动分析 → 反编译
```

---

## 三、常见逆向题型

### 1. 简单密码检查

```c
// IDA 反编译结果
int check(char *input) {
    char key[] = "flag{th1s_is_3asy}";
    return strcmp(input, key);
}
// → 直接拿到 flag!
```

### 2. 异或加密

```python
# IDA 看到的伪代码:
encrypted = [0x12, 0x34, 0x56, ...]  # 硬编码数组
for i in range(len(encrypted)):
    encrypted[i] ^= 0x5A  # XOR
    print(chr(encrypted[i]), end='')
# → flag出来了
```

### 3. 动态生成

```
使用GDB/x64dbg动态调试 → 运行到cmp指令 → 查看寄存器/内存中的正确密码

GDB:
  break *main+0x100     # 在比较处下断点
  run
  x/s $rdi              # 查看我的输入
  x/s $rsi              # 查看正确的密码!
```

---

## 四、脱壳基础

```bash
# 查壳
Detect It Easy crackme.exe
# UPX 0.89.6 - 1.02

# UPX 脱壳
upx -d crackme.exe
# → 无壳版本

# 手动脱壳(ESP定律):
# x64dbg → 找到 pushad → 
# F9运行 → 在ESP处下硬件断点 → 
# F9 → 停在popad后 → 附近就是 OEP

# ASPack/ASProtect → 类似ESP定律
# VMProtect → 极难,需要分析VM Handler
```
