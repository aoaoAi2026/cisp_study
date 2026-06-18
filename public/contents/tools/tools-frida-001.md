# Frida 动态插桩框架完全指南

> 分类：工具指南 | 难度：精通 | 阅读时间：约45分钟

## 概述

Frida 是一个跨平台的动态插桩（Dynamic Instrumentation）框架，由 Ole André V. Ravnås 开发。它允许你将 JavaScript 代码片段注入到正在运行的进程中，Hook 函数调用、修改参数和返回值、跟踪程序行为。Frida 被广泛应用于移动安全（Android/iOS Hook）、逆向工程、漏洞研究、恶意代码分析和 CTF 解题。

**核心能力**：
- **Hook 任意函数**：拦截函数调用，修改参数和返回值
- **内存操作**：读写进程内存
- **Trace 跟踪**：跟踪 API 调用序列
- **RPC（远程过程调用）**：Python 脚本与注入的 JS 通信
- **Stalker**：代码覆盖率追踪（指令级）
- **跨平台**：Windows / Linux / macOS / iOS / Android / QNX

## 核心知识点

- Frida 工具链：frida、frida-tools、frida-server
- JavaScript Hook 基础
- Android App Hook 实战（绕过 SSL Pinning、修改逻辑）
- iOS App Hook 实战（越狱环境 + 免越狱）
- objection：基于 Frida 的自动化安全评估工具
- Frida Gadget：免 Root 注入方案
- 常见 Hook 模式（加密函数、认证函数、反调试绕过）

---

## 一、安装

### 1.1 PC 端工具安装

```bash
# Python 包安装
pip install frida-tools
pip install objection           # 基于 Frida 的自动化工具

# 验证安装
frida --version
frida-ps -U                    # 列出 USB 连接的设备进程

# 更新
pip install --upgrade frida-tools
```

### 1.2 Android 端 frida-server

```bash
# 1. 下载 frida-server（与 PC 端 frida 版本一致）
# https://github.com/frida/frida/releases
# 文件：frida-server-16.x.x-android-arm64.xz

# 2. 解压并推送到设备
xz -d frida-server-16.x.x-android-arm64.xz
adb push frida-server-16.x.x-android-arm64 /data/local/tmp/
adb shell chmod 755 /data/local/tmp/frida-server-16.x.x-android-arm64

# 3. 以 Root 运行
adb shell
su
/data/local/tmp/frida-server-16.x.x-android-arm64 &

# 4. 验证连接
frida-ps -U
```

---

## 二、Frida CLI 工具

### 2.1 基础命令

```bash
# 列出进程
frida-ps -U              # USB 连接的设备
frida-ps -Uai            # 仅显示正在运行的应用
frida-ps -R              # 远程设备

# 附加到进程
frida -U -n 进程名        # 按名称附加
frida -U -p PID           # 按 PID 附加
frida -U -f com.app.name  # 启动并附加（Spawn模式）
frida -U -f com.app.name --no-pause  # 启动不暂停

# 加载脚本
frida -U -n 进程名 -l script.js
frida -U -f com.app.name -l hook.js --no-pause

# 交互模式（REPL）
frida -U -n 进程名
# 进入后可以直接输入 JavaScript 代码
```

### 2.2 frida-trace 动态跟踪

```bash
# 跟踪所有 open() 调用
frida-trace -U -n 进程名 -i "open"

# 跟踪某模块的所有函数
frida-trace -U -n 进程名 -I "libssl.so"

# 跟踪某模块的函数子集
frida-trace -U -n 进程名 -i "libssl*!SSL_*"

# 生成 Handler 模板
frida-trace -U -n 进程名 -i "open" 
# 自动生成 __handlers__/libc.so/open.js
# 可在其中添加自定义逻辑
```

---

## 三、JavaScript Hook 基础

### 3.1 Hook Java 方法（Android）

```javascript
// 基础 Hook 模板
Java.perform(function() {
    // 获取类
    var TargetClass = Java.use("com.example.app.TargetClass");
    
    // Hook 静态方法
    TargetClass.methodName.implementation = function(arg1, arg2) {
        console.log("[*] Method called with:", arg1, arg2);
        var result = this.methodName(arg1, arg2);
        console.log("[*] Original result:", result);
        return result;
    };
    
    // Hook 实例方法（需要先获取实例）
    // Hook 构造函数 + 方法
    TargetClass.$init.overload('java.lang.String').implementation = function(str) {
        console.log("[*] Constructor called with:", str);
        return this.$init(str);
    };
});
```

### 3.2 Hook Native 函数（C/C++）

```javascript
// Hook libc 的 open 函数
var openPtr = Module.findExportByName("libc.so", "open");
var open = new NativeFunction(openPtr, 'int', ['pointer', 'int']);

Interceptor.attach(openPtr, {
    onEnter: function(args) {
        var path = Memory.readUtf8String(args[0]);
        console.log("[*] open() called with path:", path);
    },
    onLeave: function(retval) {
        console.log("[*] open() returned:", retval.toInt32());
    }
});
```

### 3.3 修改返回值

```javascript
// Hook 返回 false 的函数改为返回 true
Java.perform(function() {
    var CheckClass = Java.use("com.app.security.RootCheck");
    CheckClass.isRooted.implementation = function() {
        console.log("[*] isRooted() called → returning false");
        return false; // 总是返回 false
    };
});
```

### 3.4 Hook 加密函数

```javascript
// Hook AES 加密函数
Java.perform(function() {
    var Cipher = Java.use("javax.crypto.Cipher");
    
    Cipher.init.overload('int', 'java.security.Key').implementation = function(mode, key) {
        console.log("[*] Cipher.init()");
        console.log("    Mode:", mode);
        console.log("    Key:", bytesToHex(key.getEncoded()));
        return this.init(mode, key);
    };
    
    Cipher.doFinal.overload('[B').implementation = function(input) {
        console.log("[*] Cipher.doFinal()");
        console.log("    Input:", bytesToHex(input));
        var result = this.doFinal(input);
        console.log("    Output:", bytesToHex(result));
        return result;
    };
});
```

---

## 四、Android Hook 实战

### 4.1 绕过 SSL Pinning

```bash
# 使用 objection（一键绕过）
objection -g com.target.app explore -s "android sslpinning disable"

# 使用 Frida 脚本（universal-android-ssl-pinning-bypass）
frida -U -f com.target.app -l frida-android-ssl-pinning.js --no-pause

# Universal SSL Pinning Bypass 脚本
# https://codeshare.frida.re/@pcipolloni/universal-android-ssl-pinning-bypass-with-frida/
```

### 4.2 绕过 Root 检测

```bash
# objection 一键
objection -g com.target.app explore -s "android root disable"

# 手动 Hook
```

### 4.3 查看 Activity / 启动隐藏 Activity

```bash
objection -g com.target.app explore

# 查看所有 Activity
android hooking list activities

# 启动 Activity
android intent launch_activity com.target.HiddenActivity
```

### 4.4 动态修改应用逻辑

```javascript
// 示例：游戏金币修改
Java.perform(function() {
    var GameData = Java.use("com.game.GameData");
    GameData.getCoins.implementation = function() {
        console.log("[*] getCoins() hijacked → returning 999999");
        return 999999;
    };
});
```

---

## 五、iOS Hook 实战

### 5.1 越狱环境

```bash
# Cydia 安装 Frida
# 添加源：https://build.frida.re
# 安装 Frida

# 从 PC 连接
frida -U -n 应用名
frida -U -f com.app.bundle
```

### 5.2 免越狱方案（Frida Gadget）

```
1. 解压 IPA 文件
2. 将 FridaGadget.dylib 放入 .app 目录
3. 修改 Mach-O 二进制，添加对 FridaGadget 的依赖
4. 重签名并安装（通过 Xcode/Sideloadly）
5. 启动应用后 Frida 自动注入
```

### 5.3 iOS Hook 示例

```javascript
// Hook Objective-C 方法
var hook = ObjC.classes.ClassName["- methodName:"];
Interceptor.attach(hook.implementation, {
    onEnter: function(args) {
        console.log("Method called with:", ObjC.Object(args[2]));
    }
});

// Hook Swift 方法（需要知道 mangled name）
```

---

## 六、objection 自动化工具

```bash
# 启动 objection 交互式会话
objection -g com.target.app explore

# 常用命令
android hooking list classes          # 列出所有类
android hooking list class_methods CLS # 列出类的方法
android hooking watch class CLS       # 监控类的所有调用
android heap search instances CLS     # 堆中搜索实例
android clipboard monitor             # 监控剪贴板
android keystore list                 # 列出密钥库
android sslpinning disable            # SSL Pinning 绕过
android root disable                  # Root 检测绕过

# 文件系统操作
env                                    # 查看环境
ls /data/data/com.target.app/          # 浏览应用目录
file download /path/file               # 下载文件
```

---

## 七、Frida 脚本共享平台

```bash
# codeshare.frida.re
# 大量共享脚本：
# - SSL Pinning Bypass
# - Root Detection Bypass
# - Anti-Debug Bypass
# - 各种加密 Hook

# 加载共享脚本
frida -U --codeshare pcipolloni/universal-android-ssl-pinning-bypass-with-frida -f com.app
```

---

## 八、安全防护建议

| 建议 | 说明 |
|:---|:---|
| 检测 Frida 端口 | 检查 27042 端口是否在监听 |
| 检测 Frida Server | 检查进程名/特征文件/D-Bus |
| 代码混淆 | 使 Hook 定位困难 |
| 完整性校验 | 检测 .so 文件是否被修改 |
| 反调试 | 检测 ptrace 等调试特征 |
| 多处互检 | 多线程互相检查是否被 Hook |

---

## 九、速查卡

```
安装：           pip install frida-tools
验证：           frida --version
列出进程：       frida-ps -U
启动并Hook：     frida -U -f com.app -l hook.js --no-pause
附加进程：       frida -U -n APP_NAME
跟踪函数：       frida-trace -U -n APP -i "open"
Objection：      objection -g com.app explore
SSL绕过：        objection → android sslpinning disable
Root绕过：       objection → android root disable

Frida Server下载: https://github.com/frida/frida/releases
Android路径:     /data/local/tmp/frida-server
常用端口:        27042 (默认), 27043 (CLI)
```

---

## 实战场景扩展

### 场景五：Android HTTPS 证书固定绕过

```bash
# 使用 Objection 一键绕过
objection -g com.target.app explore
[android sslpinning disable]

# 或自写 Frida 脚本
frida -U -l ssl_bypass.js -f com.target.app
```

```javascript
// ssl_bypass.js
Java.perform(function() {
    var TrustManagerImpl = Java.use('com.android.org.conscrypt.TrustManagerImpl');
    TrustManagerImpl.verifyChain.implementation = function() {
        console.log("[*] SSL Pinning Bypassed");
        return null;
    };
});
```

### 场景六：Root 检测绕过

```javascript
// root_bypass.js
Java.perform(function() {
    // 绕过常见 root 检测方式
    var Runtime = Java.use('java.lang.Runtime');
    Runtime.exec.overload('java.lang.String').implementation = function(cmd) {
        if (cmd.includes('su') || cmd.includes('which')) {
            console.log("[*] Blocked: " + cmd);
            return null;
        }
        return this.exec(cmd);
    };
    
    // 绕过文件存在检测
    var File = Java.use('java.io.File');
    File.exists.implementation = function() {
        var path = this.getPath();
        if (path.includes('su') || path.includes('magisk')) {
            console.log("[*] Fake: " + path + " does not exist");
            return false;
        }
        return this.exists();
    };
});
```

### 场景七：加密算法 Hook——AES 密钥提取

```javascript
// aes_hook.js
Java.perform(function() {
    var Cipher = Java.use('javax.crypto.Cipher');
    Cipher.init.overload('int', 'java.security.Key').implementation = function(mode, key) {
        console.log("[*] AES Key: " + bytesToHex(key.getEncoded()));
        console.log("[*] Mode: " + (mode == 1 ? "ENCRYPT" : "DECRYPT"));
        return this.init(mode, key);
    };
    
    Cipher.doFinal.overload('[B').implementation = function(input) {
        var result = this.doFinal(input);
        console.log("[*] Input: " + bytesToHex(input));
        console.log("[*] Output: " + bytesToHex(result));
        return result;
    };
});

function bytesToHex(bytes) {
    return Array.from(new Uint8Array(bytes))
        .map(b => b.toString(16).padStart(2, '0')).join('');
}
```

### 场景八：iOS 越狱检测绕过

```javascript
// ios_jb_bypass.js
if (ObjC.available) {
    var NSFileManager = ObjC.classes.NSFileManager.defaultManager();
    var original = NSFileManager['- fileExistsAtPath:'].implementation;
    
    Interceptor.attach(original, {
        onEnter: function(args) {
            var path = ObjC.Object(args[2]).toString();
            if (path.includes("/Applications/Cydia.app") ||
                path.includes("/bin/bash") ||
                path.includes("/usr/sbin/sshd")) {
                console.log("[*] JB file check: " + path);
                this.fake = true;
            }
        },
        onLeave: function(retval) {
            if (this.fake) {
                retval.replace(ptr(0)); // return false
            }
        }
    });
}
```

### 场景九：动态调试 Android——修改运行时变量

```javascript
// modify_value.js
Java.perform(function() {
    var MainActivity = Java.use('com.target.app.MainActivity');
    
    // 修改方法返回值
    MainActivity.isVip.implementation = function() {
        console.log("[*] isVip called, returning true");
        return true;
    };
    
    // 修改字段值
    Java.choose('com.target.app.User', {
        onMatch: function(instance) {
            instance._coins.value = 999999;
            console.log("[*] Coins set to 999999");
        },
        onComplete: function() {}
    });
});
```

### 场景十：Native 层 Hook

```javascript
// native_hook.js
// Hook Native 函数 (libc.so)
var openPtr = Module.findExportByName("libc.so", "open");
Interceptor.attach(openPtr, {
    onEnter: function(args) {
        var path = Memory.readUtf8String(args[0]);
        console.log("[*] open(" + path + ")");
        
        // 重定向文件访问
        if (path.includes("/proc/cpuinfo")) {
            args[0] = Memory.allocUtf8String("/data/local/tmp/fake_cpuinfo");
        }
    },
    onLeave: function(retval) {
        console.log("[*] open returned: " + retval);
    }
});
```

---

## 高级 RPC 调用

```python
# Python 脚本调用 Frida
import frida, sys

def on_message(message, data):
    print(f"[{message['type']}] {message}")

# 连接
device = frida.get_usb_device()
session = device.attach("com.target.app")

# 加载脚本
with open("hook.js", "r") as f:
    script = session.create_script(f.read())
script.on("message", on_message)
script.load()

# 调用 JavaScript 中导出的 RPC 函数
api = script.exports
result = api.decrypt_data(bytes.fromhex("deadbeef"))
print(f"Decrypted: {result.hex()}")

sys.stdin.read()
```

---

## 常见问题排查

| 问题 | 原因 | 解决方案 |
|:---|:---|:---|
| `Failed to spawn` | 应用名错误 | `frida-ps -Uai` 确认 package name |
| `Permission denied` | frida-server 权限问题 | `chmod 755 frida-server` |
| 连接超时 | ADB 端口转发未配置 | `adb forward tcp:27042 tcp:27042` |
| `Process not found` | 进程已退出 | 使用 `-f` 强制启动或 `-n` 按名附加 |
| Hook 不生效 | 类或方法名错误 | 用 `objection` 或 `jadx` 确认符号 |
| 应用崩溃 | Hook 代码错误 | 加 try-catch 保护脚本 |
| 检测到 Frida | 应用有反 Frida 检测 | 使用重命名版 frida-server |

---

---

## 环境搭建补充

### Android 全套配置

```bash
# 1. 确认设备已 root
adb shell su -c "id"
# uid=0(root) 即为 root

# 2. 下载对应架构的 frida-server
# https://github.com/frida/frida/releases
# Android: frida-server-16.x.x-android-arm64.xz (arm64)
#          frida-server-16.x.x-android-arm.xz   (arm)
#          frida-server-16.x.x-android-x86_64.xz (x86_64 模拟器)

# 3. 推送到设备
adb push frida-server-16.x.x-android-arm64 /data/local/tmp/frida-server
adb shell chmod 755 /data/local/tmp/frida-server

# 4. 启动
adb shell /data/local/tmp/frida-server -D &
# -D: daemon 模式

# 5. 验证
frida-ps -Uai                        # 列出设备上所有应用
# -U: USB 设备
# -a: 仅应用
# -i: 包含已安装但未运行的应用
```

### iOS 全套配置

```bash
# 需要越狱设备
# 1. 添加 Cydia 源: https://build.frida.re
# 2. 安装 Frida for iOS
# 3. 或手动安装 deb 包

# 验证
frida-ps -U
```

### Frida 工具集

```bash
# Frida CLI 工具
frida-ps           # 进程列表
frida-trace        # 函数追踪
frida-ls-devices   # 列出设备
frida-kill         # 终止进程
frida-discover     # 发现内部函数

# 第三方工具
# objection: 基于 Frida 的高级工具
pip install objection

# Frida CodeShare: 社区脚本库
# https://codeshare.frida.re/
# 直接加载在线脚本
frida --codeshare owasp-mstg/uncrackable1 -U -f com.example.app
```

---

## 高级 Frida API 参考

```javascript
// Java 层 Hook（Android）
Java.perform(function() {
    // 获取类
    var MyClass = Java.use('com.example.MyClass');
    
    // Hook 方法
    MyClass.myMethod.implementation = function(arg1, arg2) {
        console.log("myMethod called with: " + arg1 + ", " + arg2);
        var result = this.myMethod(arg1, arg2);
        console.log("myMethod returned: " + result);
        return result;
    };
    
    // Hook 构造函数
    MyClass.$init.overload('java.lang.String').implementation = function(name) {
        console.log("Instance created with name: " + name);
        return this.$init(name);
    };
    
    // 枚举已加载的类
    Java.enumerateLoadedClasses({
        onMatch: function(className) {
            if (className.includes('target')) {
                console.log("Found: " + className);
            }
        },
        onComplete: function() {}
    });
});

// Native 层 Hook（跨平台）
var openPtr = Module.findExportByName("libc.so", "open");
Interceptor.attach(openPtr, {
    onEnter: function(args) {
        this.path = Memory.readUtf8String(args[0]);
        console.log("open(" + this.path + ")");
    },
    onLeave: function(retval) {
        console.log("  → fd: " + retval);
    }
});

// iOS Objective-C Hook
if (ObjC.available) {
    var MyClass = ObjC.classes.MyClass;
    var method = MyClass['- myMethod:'];
    Interceptor.attach(method.implementation, {
        onEnter: function(args) {
            var arg = new ObjC.Object(args[2]);
            console.log("myMethod called with: " + arg);
        }
    });
}
```

---

## 常见 Hook 模板

### SSL Pinning 绕过（标准版）

```javascript
// Android - 绕过 TrustManager
Java.perform(function() {
    var TrustManagerImpl = Java.use('com.android.org.conscrypt.TrustManagerImpl');
    TrustManagerImpl.verifyChain.implementation = function() {
        console.log("[*] Certificate pinning bypassed");
        return null; // 不抛出异常
    };
});

// Android - 绕过 OkHttp
Java.perform(function() {
    var CertificatePinner = Java.use('okhttp3.CertificatePinner');
    CertificatePinner.check.overload('java.lang.String', 'java.util.List')
        .implementation = function(hostname, peerCertificates) {
            console.log("[*] OkHttp pinning bypassed: " + hostname);
            return;
        };
});
```

### 反调试绕过

```javascript
// 绕过 ptrace 检测
var ptracePtr = Module.findExportByName("libc.so", "ptrace");
Interceptor.replace(ptracePtr, new NativeCallback(function(request, ...args) {
    if (request == 0) { // PTRACE_TRACEME
        console.log("[*] ptrace(PTRACE_TRACEME) blocked");
        return 0; // 伪装成功
    }
    return 0;
}, 'int', ['int', '...'])));
```

---

> 📖 本文为"网安百宝箱"课程配套读物。更新于 2026-06-18
