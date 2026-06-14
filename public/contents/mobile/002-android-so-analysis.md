# Android SO 层分析与 Native 库逆向

> **📘 文档定位**：CISP 考试 移动安全 高级 | 难度：⭐⭐⭐⭐⭐ | 预计阅读：30 分钟
>
> 深入讲解 Android Native 层（SO 库）的逆向分析技术，覆盖 ARM/ARM64 汇编基础、JNI 函数分析、加密算法还原及反调试绕过。

---

## 导航目录

- [一、Native 层基础](#一native-层基础)
- [二、SO 文件结构分析](#二so-文件结构分析)
- [三、JNI 函数逆向](#三jni-函数逆向)
- [四、加密算法还原](#四加密算法还原)
- [五、反调试与绕过](#五反调试与绕过)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、为什么要分析 Native（.so）层？

现代 APP 把核心逻辑、加解密、防调试、支付校验、协议签名等下沉到 **C/C++ 层**以对抗 Java 层逆向。一个典型 APP 结构如下：

```
APK
 ├── classes.dex / classes2.dex ... (Java/Kotlin 层，易反编译)
 └── lib/
     ├── armeabi-v7a/libcore.so    ← 重点关注 (32 位 ARM)
     ├── arm64-v8a/libcore.so      ← 重点关注 (64 位 ARM)
     ├── x86/libcore.so
     └── libjiagu.so / libchaqu.so ← 加壳/壳的 so
```

## 二、Native 层核心工作流

| 阶段 | 目标 | 关键工具 |
|------|------|---------|
| 加载分析 | JNI_OnLoad / JNI_OnUnload 入口、动态注册 | IDA Pro / Ghidra / radare2 |
| 函数定位 | Java_ 前缀函数、JNIEnv 调用、字符串交叉引用 | strings / grep / frida-trace |
| 符号修复 | 未 strip 的符号表 vs 加壳后符号清洗 | nm / objdump / IDA 分析 |
| 算法还原 | AES/RSA/SM4 常量、S-box、魔数（A3/A8 等） | FindCrypt2 / Karta / 人工比对 |
| 动态验证 | Frida 直接 hook native 函数，观察入参出参 | Frida / objection / frida-trace |

## 三、基础：JNI 调用约定

```c
// Java 层声明 native 函数
public native String signData(String data);   // ← Java 层调用入口
static { System.loadLibrary("core"); }

// C++ 层两种注册方式
// ① 静态注册：函数名严格对应 Java_<package>_<class>_<method>
JNIEXPORT jstring JNICALL
Java_com_victim_app_MainActivity_signData(JNIEnv *env, jobject thiz, jstring data) {
    const char *p = (*env)->GetStringUTFChars(env, data, 0);
    ...
}

// ② 动态注册（更常见，函数名在符号表中不直接暴露）
JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *reserved) {
    JNIEnv *env;
    (*vm)->GetEnv(vm, (void**)&env, JNI_VERSION_1_6);
    JNINativeMethod methods[] = {
        {"signData", "(Ljava/lang/String;)Ljava/lang/String;", (void*)nativeSign}
    };
    (*env)->RegisterNatives(env, "com/victim/app/MainActivity", methods, 1);
    return JNI_VERSION_1_6;
}
```

### 3.1 识别动态注册关键：strings + IDA 交叉引用

```bash
# 1) 粗看 so 中的字符串
strings libcore.so | grep -iE "(sign|token|aes|rsa|key|secret|http|api)"

# 2) 看 JNI 方法签名（关键点！）
strings libcore.so | grep -E "^\(.*\).*$"   # 类似 (Ljava/lang/String;)Ljava/lang/String;

# 3) 在 IDA 中定位 JNI_OnLoad，定位 RegisterNatives 调用
#    从 RegisterNatives 的第三个参数 (methods 数组) 反查函数地址
```

## 四、ARM64 汇编基础（实战最小子集）

ARM64（AArch64）是当前主流架构。理解以下关键要点足以开始：

```
# 参数传递：x0-x7 对应函数前 8 个参数，x0 也存返回值
# x29 = FP (帧指针), x30 = LR (链接寄存器, 保存返回地址)
# sp = 栈指针, pc = 程序计数器

# 典型函数 prologue / epilogue
sub  sp, sp, #0x30        ; 开辟栈空间
stp  x29, x30, [sp, #0x20]; 保存 FP/LR
mov  x29, sp              ; 设置新 FP

... 函数体 ...

ldp  x29, x30, [sp, #0x20]; 恢复 FP/LR
add  sp, sp, #0x30        ; 恢复栈
ret                        ; 返回 (跳转到 LR)

# 系统调用：svc #0 / 常见 blr <寄存器>（间接跳转 = Hook 目标）
# 常见 libc 调用: malloc / free / strcpy / strcmp / memcmp / strlen
# OpenSSL / BoringSSL 调用: EVP_CipherInit_ex / EVP_EncryptUpdate / RSA_sign
```

## 五、逆向实战：还原一个加密函数

```c
// Java 层: native byte[] encrypt(byte[] data, byte[] key)
// sig: "([B[B)[B"

// Step 1: 在 IDA/Ghidra 中找到 nativeEncrypt
// Step 2: 识别算法常量
//   - 0x67452301, 0xEFCDAB89...  = MD5
//   - 0x6a09e667, 0xbb67ae85...  = SHA-256
//   - 0x517CC1B7, 0x2F855A29...  = SM4
// Step 3: 识别 IV / Key 位置（常来自 .data.rel.ro / 运行时动态构造）
// Step 4: 用 Frida hook 打印入参 / 出参，辅助验证
```

### 5.1 Frida 打印 Native 函数参数

```javascript
// frida -U -f com.victim.app -l hook.js --no-pause
const libso = Module.findBaseAddress('libcore.so');
console.log('libcore.so base =', libso);

// 假设经 IDA 分析，加密函数在 base + 0x12345
const encryptFn = new NativeFunction(libso.add(0x12345), 'pointer',
    ['pointer', 'pointer', 'int', 'pointer', 'int']);

Interceptor.attach(libso.add(0x12345), {
    onEnter(args) {
        console.log('[+] encrypt called:');
        console.log('    plain =', hexdump(args[2], { length: args[3].toInt32() }));
        console.log('    key   =', hexdump(args[4], { length: 16 }));
    },
    onLeave(retval) {
        console.log('[+] ciphertext len =', retval[1]);
        console.log(hexdump(retval[0], { length: retval[1] }));
    }
});
```

## 六、Trace 系统库调用识别算法

```bash
# frida-trace 粗定位 OpenSSL / BoringSSL 调用
frida-trace -U -f com.victim.app \
  -i "EVP_*" -i "AES_*" -i "RSA_*" -i "HMAC_*" -i "SHA256_*"

# 结合 -O <offset> 对自建函数做 trace，观察其调用链
# 输出会实时显示函数调用及参数（字符串/二进制）
```

## 七、加壳后的 so 对抗

当 so 本身被 UPX / 自定义壳加密时：

1. **动态 dump**：Frida `Process.enumerateModules()` + `Module#enumerateRanges('r-x')` 把运行时解密后的代码段内存 dump 出来
2. **内存断点调试**：IDA Remote GDB / lldb 附加，在 mprotect / dlopen 处断下，在解密后 dump
3. **linker 命名空间隔离**（Android 7+）：被壳用的库通过 `android_dlopen_ext` + 自定义 namespace 加载，需用 frida `Module.load` 绕开

```javascript
// Frida 脚本：把目标 so 所有内存段 dump 到 /sdcard/dump/
const m = Process.getModuleByName('libsecret.so');
m.enumerateRanges('r--').forEach(range => {
    const data = range.base.readByteArray(range.size);
    const f = new File(`/sdcard/dump/${range.base}.bin`, 'wb');
    f.write(data); f.flush(); f.close();
});
```

## 八、实战 CheckList

- [ ] 分析 JNI_OnLoad，找到所有 RegisterNatives
- [ ] 用 `strings` 搜关键字（sign、aes、key、URL、API）
- [ ] 用 IDA/Ghidra 查看 .so 字符串引用表，反向追溯函数
- [ ] 使用 FindCrypt2 插件定位 AES/MD5/SHA 常量
- [ ] 用 Frida / frida-trace 打印入参/出参
- [ ] 识别是否使用了自定义混淆的加密（字节码 VM / 自定义 S-box）
- [ ] 判断是否存在反调试（ptrace / ptrace_mutex / tracerpid）
- [ ] so 段权限是否 RWX 同时出现（暗示动态自修改代码）
- [ ] 判断是否使用了系统 key store vs 硬编码 key
- [ ] 验证加密算法能否离线复现（Python + Crypto 库）
