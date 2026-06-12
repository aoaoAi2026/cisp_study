# APP 加壳与脱壳：一代壳/二代壳/VMP

---

## 一、加壳技术演进

| 代 | 代表 | 原理 | 难度 |
|----|------|------|------|
| 一代壳（Dynamic Loading） | 早期 360、爱加密、梆梆第一代 | `classes.dex` 加密 → 壳 Dex 启动时解密到内存加载 | 入门级 |
| 二代壳（不落地 Dex） | 梆梆、爱加密、腾讯乐固新版 | dex2oat 不生成 OAT 文件，运行时动态加载解密后的 dex，不落地 | 进阶级 |
| 三代壳 / VMP（指令虚拟化） | Ali VMP、梆梆加固 VMP、腾讯御安全 VMP | 关键函数 Dalvik/Dex 字节码转为自定义字节码，由自实现虚拟机解释执行 | 专家级 |

## 二、一代壳：典型结构与脱壳

### 2.1 APK 加壳后的典型文件结构

```
APK
├── AndroidManifest.xml       # 壳的 Application（被替换）
├── classes.dex               # 壳的 Dex (很小，几 KB~几百 KB)
├── assets/
│   └── jiagu / libjiagu.so   # 壳的 Native 组件 + 加密后的源 dex
│   └── classes.jar.enc       # 加密的源 Dex
└── lib/
    ├── libjiagu.so           # 加载解密 + dex 加载器
    └── libbaup.so            # 反调试 / 反 Frida
```

### 2.2 一代壳脱壳原理

1. **壳启动**：Application.attachBaseContext 执行壳代码
2. **加载源 dex**：读取 `assets/classes.jar.enc`，调用自定义解密函数
3. **动态加载**：通过 `DexClassLoader` 把解密后的 dex 替换加载
4. **控制权转移**：调用真实 APP 的 Application

```bash
# 脱壳工具（一代壳）
# 1) FART (脱壳神器，基于 ART 运行时主动调用类初始化，触发 dump)
#    原理：hook art::DexFile::OpenCommon，dump 所有 dex

# 2) Youpk (基于主动调用 + dumpDexFile)
#    GitHub: https://github.com/youlors/Youpk

# 3) Xposed / LSPosed 模块：DumpMaster, DexHunter

# 实战命令（以 FART 为例）：
#  - 刷入包含 FART 补丁的 AOSP 或 Magisk 模块
#  - 启动目标 APP，观察 /sdcard/fart/<pkg>/ 下生成的 dex
#  - 合并多个 dex 文件（dex-merge）：
./dexmerger /sdcard/fart/com.victim.app/ all_in_one.dex

# 4) 用 jadx 打开合并后的 dex 查看源码
jadx-gui all_in_one.dex
```

## 三、二代壳：in-memory Dex

**与一代壳的区别**：
- 解密后的 dex 不落地为文件
- 使用 `art::DexFile::OpenMemory`（内存中直接解析 dex）
- 对 `adb pull /data/app/.../base.apk` 后静态分析更困难

### 3.1 脱壳思路

```c
// hook art::DexFile::OpenMemory(const char* base, size_t size, ...)
// 每次壳调用该 API 加载 dex，把 base/size 捕获后 dump 内存
//
// hook 位置（随 ART 版本变化）:
//   Android 8:  _ZN3art7DexFile9OpenMemoryEPKvmRKNS_7
//   Android 9+: _ZN3art7DexFile9OpenMemoryERKNS_13MemMap...
//
// 简单识别:
adb shell su -c "grep -r OpenMemory /system/lib/libart.so"
```

```javascript
// Frida 脚本: hook DexFile::OpenMemory，dump 每个 dex
const symbols = Module.enumerateSymbols('libart.so');
const openMemory = symbols.find(s => s.name.includes('DexFile') && s.name.includes('OpenMemory'));
Interceptor.attach(openMemory.address, {
    onEnter(args) {
        this.base = args[0];
        this.size = args[1].toInt32();
    },
    onLeave(retval) {
        if (this.size > 0x1000) {
            const data = this.base.readByteArray(this.size);
            const f = new File(`/sdcard/dump/dex_${Date.now()}.dex`, 'wb');
            f.write(data); f.flush(); f.close();
            console.log('[+] dump', this.size, 'bytes');
        }
    }
});
```

### 3.2 补充：hook DexClassLoader / PathClassLoader

```javascript
Java.perform(function () {
    const DCL = Java.use('dalvik.system.DexClassLoader');
    DCL.$init.overload('java.lang.String', 'java.lang.String', 'java.lang.String', 'java.lang.ClassLoader').implementation = function (dexPath, odex, lib, parent) {
        console.log('[DexClassLoader]', dexPath);
        return this.$init(dexPath, odex, lib, parent);
    };
});
```

## 四、VMP（指令虚拟化）对抗

VMP 把 Java/DEX 字节码编译成自定义字节码，执行时由自实现 VM 解释。

```
原始 DEX 字节码:
  21 00 0A 00           (instance-of v0, v10, Ljava/lang/String;)
  39 00 03 00 00 00      (packed-switch v0, ...)

VMP 转换后 (自定义字节码, 对 DEX 分析器不可见):
  [壳代码段] 执行到 [VMP handler]
      VMP handler 解释 [自定义字节码] → 等价行为执行
      → 但 jadx 看到的只是"调用 native 函数"，看不到内部逻辑
```

### 4.1 VMP 识别方法

1. **jadx 打开后**：大量关键函数体只剩 `native-method` 或只有几行调用 native
2. **APK 内出现** `libxxxVMP.so` / `libvmp.so` / `dex2vmp` 之类的库
3. **符号分析**：`strings libVMP.so | grep -iE "(vmp|vm|handler|interpret|execute)"`
4. **dex 方法标志位**：`access_flags = 0x100 | 0x0100 = native` + 方法体为空或极简

### 4.2 VMP 还原思路（目前没有 100% 自动化方案）

**Step 1: 记录 VM handler 表**
- Frida hook `VMP_Execute(PC, ctx)` 之类入口
- 打印每个 opcode 的 handler 地址、实际行为

**Step 2: 模式匹配**
- 记录每种 opcode 对应执行的行为（a=b+c、a=b、if a==b 等）
- 用脚本把 opcode → Dalvik opcode 映射表恢复

**Step 3: 动态记录 + 反编译**
- 让 APP 在完整路径下运行一遍，记录 VMP 执行过的所有字节码
- 还原回 Dalvik 字节码，重新组装成合法 dex
- 仍需人工验证大量边界情况

### 4.3 工具推荐

- **VMP Analyzer (社区脚本)**：对特定壳（爱加密/梆梆）做半自动还原
- **Unicorn Engine**：模拟 VMP 指令执行
- **angr**：符号执行，辅助逻辑还原
- **人工 IDA 分析**：最后兜底手段

## 五、反调试与对抗

加壳后壳本身包含的防护手段：

| 手段 | 原理 | 绕过 |
|------|------|------|
| `ptrace(PTRACE_TRACEME)` | 防止 gdb/lldb 附加 | `ptrace` hook / Frida `Interceptor.replace('ptrace', nop)` |
| `/proc/self/status` `TracerPid` | 检查是否被 Trace | `fopen` hook / `read` hook |
| `inotify` 监视自身 so 被修改 | 防止 patch | hook `inotify_add_watch` / 读写 /proc |
| 线程自检测 (busy-waiting) | 检测指令执行时间（Trace 会变慢） | `clock_gettime` hook / 单步过滤 |
| Frida 特征检测 (`frida-agent`, D-Bus, frida-helper) | 识别调试环境 | 使用 frida 改名 / `Spawn` 模式 + 改名 |
| SELinux 限制 ptrace | 只能 trace 同 uid 进程 | Root + Magisk permissive |

## 六、加固选型建议

| 场景 | 推荐方案 |
|------|---------|
| 金融 / 银行 / 支付 | VMP + 源码混淆 + 加壳 + 服务端 attestation + 代码审计 |
| 一般电商 / 社交 | 一代壳 + ProGuard/R8 + 签名校验 + SSL Pinning |
| 安全敏感类 | 自研壳（可隐藏厂商特征）+ 定期更换密钥 / 方案 |
| 对启动速度要求高 | 二代壳（比一代启动更快）|

## 七、CheckList

- [ ] 判断 APK 是否被加壳（文件大小、classes.dex 太小、壳壳特征字符串）
- [ ] 识别壳厂商（爱加密/梆梆/360/腾讯乐固）
- [ ] 采用 FART / Youpk 等工具尝试脱壳（一代 / 二代壳）
- [ ] 合并多个脱壳后的 dex 文件，用 jadx 分析
- [ ] 识别是否使用了 VMP（方法体只剩 native 调用）
- [ ] 针对 VMP 做动态指令记录与还原（结合 Frida / Unicorn）
- [ ] 测试 SSL Pinning / Root 检测 / 反调试 可绕过性
- [ ] 壳自身是否有漏洞（解密函数暴露、密钥写死在 so 中）
- [ ] 最终还原源码做完整代码审计（敏感信息、逻辑漏洞、越权）
- [ ] 所有脱壳过程需在受控测试设备上进行，不得用于非法用途
