# IDA Pro & Ghidra 逆向分析入门：从二进制到伪代码

> 分类：逆向工程 | 难度：精通 | 阅读时间：约30分钟

## 概述

IDA Pro 和 Ghidra 是逆向工程领域最核心的两款静态分析工具。IDA Pro 是商业软件中的标杆，Ghidra 则是 NSA 开源的强力替代方案。本文将带你掌握静态逆向分析的核心工作流：从加载二进制文件、识别函数边界，到分析关键逻辑和定位漏洞。

## 核心知识点

- 静态分析 vs 动态分析的区别和适用场景
- IDA Pro 的核心窗口：反汇编视图、函数列表、字符串列表、交叉引用
- Ghidra 的项目管理与代码浏览器
- 函数识别与交叉引用（XREF）追踪
- 常见安全相关函数的识别
- 反编译伪代码的阅读技巧
- Patch 与逆向修改

## 正文

### 一、工具选择

| 特性 | IDA Pro | Ghidra |
|------|---------|--------|
| 价格 | 高（Freeware 有限） | 完全免费开源 |
| 反编译质量 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 调试器 | 内置 + 远程 | 支持但不如 IDA |
| 脚本扩展 | IDAPython | Java/Python |
| 协作分析 | 需 IDA Team | 内置协作服务器 |
| 学习曲线 | 陡峭 | 中等 |

**建议**：日常逆向学习用 Ghidra 即可；专业漏洞分析建议 IDA Pro。

### 二、IDA Pro 核心窗口

#### 2.1 加载二进制文件

```
File → Open → 选择目标文件
- 选择文件格式（PE/ELF/Mach-O）
- 选择处理器架构（x86/x64/ARM/MIPS）
- 让 IDA 自动分析，等待进度条完成
```

#### 2.2 反汇编视图（核心工作区）

```
.text:00401000  push    ebp
.text:00401001  mov     ebp, esp
.text:00401003  sub     esp, 40h
.text:00401006  call    sub_401050
```

- **图形模式（Space 键切换）**：显示控制流图，直观展示分支和循环
- **文本模式**：传统线性反汇编，适合搜索和批量操作

#### 2.3 核心快捷键

| 快捷键 | 功能 |
|------|------|
| Space | 图形/文本视图切换 |
| G | 跳转到指定地址 |
| X | 查看交叉引用（谁调用了这个函数/使用了这个数据） |
| N | 重命名函数/变量 |
| ; | 添加注释 |
| : | 添加常规注释 |
| F5 | 反编译为伪代码（Hex-Rays） |
| Ctrl+E | 导出数据 |
| Alt+T | 搜索文本 |
| Alt+B | 搜索二进制 |

### 三、Ghidra 快速上手

```bash
# 下载解压后启动
./ghidraRun

# 或 Windows 上
ghidraRun.bat
```

**工作流程**：
1. 创建 Project → Import File → 双击打开
2. 分析选项默认即可，等待分析完成
3. Window → Decompile 打开反编译窗口

**Ghidra 优势**：
- "Listing" 窗口同时显示汇编和反编译结果
- 内置反编译器无需额外付费
- 支持协作分析（多人在同一项目工作）
- 强大的脚本管理器（Python/Java）

### 四、逆向分析核心技能

#### 4.1 定位关键函数

**入口点出发**：
```
_start → __libc_start_main → main
```

**字符串定位法**（最常用的技巧）：
1. View → Open subviews → Strings
2. 搜索关键字符串（如 "password incorrect"）
3. 点击 X 交叉引用追踪到使用该字符串的函数
4. 从该函数开始分析逻辑

**导入函数追踪法**：
1. Imports 窗口查看导入的 API
2. 关注 `strcmp`、`memcpy`、`sprintf`、`recv`、`send` 等
3. 交叉引用追踪调用者

#### 4.2 常见安全相关函数

```c
// 危险函数 —— 缓冲区溢出
strcpy(dest, src)     // 无长度检查
gets(buffer)          // 从不使用！
sprintf(buf, fmt, ..)  // 格式化字符串 + 溢出

// 危险函数 —— 命令注入
system(user_input)    // 直接拼接用户输入
popen(cmd, "r")
execve(path, args)

// 可疑 —— 权限提升
setuid(0)
seteuid(0)
chmod("/etc/shadow", 0777)
```

在 IDA 中，这些调用应在函数边界明确标注危险等级。

#### 4.3 阅读反编译伪代码

```c
// IDA Hex-Rays 输出示例
int __cdecl main(int argc, const char **argv) {
  char v4[64]; // [esp+0h] [ebp-44h]
  
  printf("Enter password: ");
  gets(v4);  // ← 典型缓冲区溢出
  if ( !strcmp(v4, "secret") ) {
    puts("Access granted!");
    return 0;
  }
  puts("Access denied!");
  return 1;
}
```

**阅读技巧**：
- 先看函数签名和局部变量声明
- 追踪用户输入的数据流
- 检查所有 `memcpy`/`strcpy` 的源和目的缓冲区大小
- 关注 `if` 条件能否被输入控制

#### 4.4 交叉引用（XREF）——逆向分析的灵魂

```
类型：
- Code XREF：代码对地址的引用（调用、跳转）
- Data XREF：数据对地址的引用（指针、偏移）

实战流程：
1. 找到可疑字符串 "you win!"
2. XREF 追踪 → 定位到 win_func
3. win_func 的 Code XREF → 发现 flag_ok → test 判断
4. 逆推 flag_ok 的设置条件 → 找到认证逻辑
5. 分析认证逻辑 → 找出漏洞或正确输入
```

### 五、Patch 与修改

```python
# IDAPython Patch 示例
ida_bytes.patch_byte(0x401050, 0x90)  # NOP 掉一个调用
ida_bytes.patch_byte(0x401051, 0x90)
ida_bytes.patch_word(0x401060, 0xEB)  # 无条件跳转

# 保存修改
# Edit → Patch program → Apply patches to input file
```

**常见 Patch 场景**：
- 将条件跳转 `JZ` 改为无条件跳转 `JMP`（绕过认证）
- NOP 掉反调试检测
- 修改硬编码密钥

### 六、学习路径推荐

```
Level 1: CrackMe → 找到隐藏在二进制中的密码
Level 2: 缓冲区溢出练习 → 分析漏洞 + 构造 Exploit
Level 3: 恶意软件分析 → 提取 C2 地址、加密算法
Level 4: 固件提取与分析 → IoT 设备逆向
Level 5: 内核驱动分析 → Rootkit 检测与对抗
```

**推荐练习平台**：
- Crackmes.one
- Root-me.org
- pwnable.tw
- CTF 逆向题目

---

> 📖 本文为"网安百宝箱"课程配套读物。
> 参考：IDA Pro Book 2nd Edition, Ghidra 官方文档 https://ghidra-sre.org/
> 更新于 2026-06-18
