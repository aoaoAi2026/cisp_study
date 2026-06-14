# Frida Hook 实战：Android/iOS 动态插桩

> **📘 文档定位**：CISP 考试 移动安全 高级 | 难度：⭐⭐⭐⭐ | 预计阅读：30 分钟
>
> 系统讲解 Frida 动态插桩框架在 Android/iOS 平台的使用，覆盖 Java/Native Hook、SSL Pinning Bypass、加密函数追踪及 objection 高级用法。

---

## 导航目录

- [一、Frida 基础架构](#一frida-基础架构)
- [二、Java 层 Hook](#二java-层-hook)
- [三、Native 层 Hook](#三native-层-hook)
- [四、SSL Pinning Bypass](#四ssl-pinning-bypass)
- [五、objection 高级用法](#五objection-高级用法)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、Frida 是什么

**Frida** 是一个跨平台的**动态插桩（Dynamic Instrumentation）**框架，允许把 JavaScript 脚本注入到目标进程，在运行时修改其行为。是移动安全测试的"瑞士军刀"。

```
  [Frida CLI]         [Frida Server (手机端)]
       │  USB/TCP  │
       └─────adb──────┘
                    ┌────────────────────────────┐
                    │ 目标 APP 进程              │
                    │  - v8 引擎 (Frida 注入)    │
                    │  - JavaScript <-> Native   │
                    │  - 读写内存 / hook 函数    │
                    └────────────────────────────┘
```

## 二、环境安装

```bash
# 1) 安装主机端 CLI
pip install frida-tools
frida --version     # 16.x.x

# 2) 手机端安装 frida-server
#    Android: https://github.com/frida/frida/releases
#    下载对应架构 frida-server-16.x.x-android-arm64.xz
#    → push 到 /data/local/tmp/frida-server, chmod +x
#    → adb shell su -c "/data/local/tmp/frida-server &"

#    iOS (越狱):
#    Cydia 添加源 https://build.frida.re → 安装 Frida
#    或 dpkg -i frida_16.x.x_iphoneos-arm.deb

# 3) 验证
adb forward tcp:27042 tcp:27042
frida-ps -U            # 列出 USB 设备上的进程
frida-ps -Ua           # 列出应用 + PID + 包名
```

## 三、Frida 核心 API 速查

### 3.1 Java 层 Hook（Android）

```javascript
// 运行 frida -U -f com.victim.app -l script.js --no-pause

Java.perform(function () {
    // 1) hook 某个类的某个方法
    const Login = Java.use("com.victim.app.LoginActivity");
    Login.login.implementation = function (user, pass) {
        console.log("[*] login called:", user, pass);
        return this.login(user, "fake_password_to_bypass");  // 修改入参
    };

    // 2) hook 重载方法 (签名不同)
    const Crypto = Java.use("com.victim.app.Crypto");
    Crypto.encrypt.overload('java.lang.String', '[B').implementation = function (a, b) {
        console.log("[encrypt] key=" + a + ", data=" + bytesToHex(b));
        return this.encrypt(a, b);
    };

    // 3) 访问私有字段 (需要 reflect 或 class wrapper)
    const User = Java.use("com.victim.app.User");
    const userObj = User.$new.overload().call(this);
    userObj.mToken.value = "stolen_token";   // .value 访问字段

    // 4) 打印堆栈，定位调用者
    console.log(Java.use("android.util.Log").getStackTraceString(
        Java.use("java.lang.Throwable").$new()
    ));
});

// 辅助: byte[] → hex string
function bytesToHex(arr) {
    return arr ? [...arr].map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('') : '';
}
```

### 3.2 Native 层 Hook

```javascript
// 1) Hook libc 的 open 看 APP 打开了哪些文件
const openPtr = Module.findExportByName("libc.so", "open");
Interceptor.attach(openPtr, {
    onEnter(args) {
        this.path = args[0].readCString();
    },
    onLeave(ret) {
        if (this.path.includes("token"))
            console.log(`[open] ${this.path} -> fd=${ret.toInt32()}`);
    }
});

// 2) Hook OpenSSL SSL_read / SSL_write 自动抓明文流量
const sslRead = Module.findExportByName("libssl.so", "SSL_read");
Interceptor.attach(sslRead, {
    onEnter(args) { this.buf = args[1]; this.size = args[2]; },
    onLeave(ret) {
        if (ret.toInt32() > 0) {
            console.log(hexdump(this.buf, { length: ret.toInt32(), ansi: true }));
        }
    }
});

// 3) 创建 NativeFunction 直接调用内部函数
const base = Module.findBaseAddress("libcore.so");
const decryptFn = new NativeFunction(base.add(0x12345), 'void',
    ['pointer', 'int', 'pointer']);  // 需 IDA 分析签名
const out = Memory.alloc(1024);
decryptFn(Memory.allocUtf8String("ciphertext"), 32, out);
console.log(hexdump(out, { length: 64 }));
```

### 3.3 iOS ObjC 层 Hook

```javascript
const { UIApplication } = ObjC.classes;

// Hook application:didFinishLaunchingWithOptions:
Interceptor.attach(
    UIApplication['- application:didFinishLaunchingWithOptions:'].implementation,
    {
        onEnter(args) {
            const app = new ObjC.Object(args[2]);
            console.log("[*] App launched:", app.bundleIdentifier());
        }
    }
);

// 打印所有 NSUserDefaults 写入
const defaults = ObjC.classes.NSUserDefaults;
['setObject:forKey:', 'setString:forKey:'].forEach(sel => {
    Interceptor.attach(defaults['+' + sel].implementation, {
        onEnter(args) { console.log(`[defaults] ${sel}: key=${new ObjC.Object(args[3])}`); }
    });
});
```

## 四、实战：绕过 SSL Pinning

```javascript
// Universal Android SSL Pinning Bypass
// 来源: https://codeshare.frida.re/@akabe1/frida-multiple-unpinning/
// 原理: 批量 hook javax/net/ssl/TrustManager, X509TrustManager,
//       okhttp3 CertificatePinner, Conscrypt, Android 7+ NetworkSecurityConfig
Java.perform(function () {
    const X509TrustManager = Java.use('javax.net.ssl.X509TrustManager');
    const TrustManager = Java.registerClass({
        name: 'com.Frida.TrustManager',
        implements: [X509TrustManager],
        methods: {
            checkClientTrusted(chain, authType) {},
            checkServerTrusted(chain, authType) {},
            getAcceptedIssuers() { return []; }
        }
    });

    const SSLContext = Java.use('javax.net.ssl.SSLContext');
    const tm = [TrustManager.$new()];
    const ctx = SSLContext.getInstance('TLS');
    ctx.init(null, tm, null);
    // 替换全局 SSLContext（需结合 hook TrustManagerFactory 等其他点）
});
```

```bash
# iOS 端简单绕过
# 1) 安装 Cydia 插件 "SSL Kill Switch 2"
# 2) 或使用 codeshare 脚本：
frida -U -f com.victim.app --codeshare snooze6/ios10-ssl-bypass
```

## 五、实战：绕过 Root / 反调试

```javascript
// 1) Hook strstr / strcmp 使 APP 无法检测 "su", "magisk", "frida" 等关键词
const strstr = Module.findExportByName("libc.so", "strstr");
Interceptor.replace(strstr, new NativeCallback((a, b) => {
    const hay = Memory.readCString(a), needle = Memory.readCString(b);
    if (needle.includes("su") || needle.includes("magisk") || needle.includes("frida"))
        return ptr(0); // 返回 NULL 表示没找到
    return strstr(a, b);  // 正常匹配
}, 'pointer', ['pointer', 'pointer']));

// 2) Hook ptrace 阻止 PTRACE_TRACEME / PTRACE_ATTACH
const ptrace = Module.findExportByName("libc.so", "ptrace");
Interceptor.replace(ptrace, new NativeCallback(() => 0, 'int',
    ['int', 'int', 'pointer', 'pointer']));

// 3) Hook access() 让 /system/bin/su 看起来不存在
const access = Module.findExportByName("libc.so", "access");
Interceptor.attach(access, {
    onEnter(args) {
        const p = args[0].readCString();
        if (p && p.includes("su")) args[0] = Memory.allocUtf8String("/nonexistent");
    }
});
```

## 六、objection：基于 Frida 的可视化工具

objection 可以无需手写脚本完成常用测试：

```bash
# 1. 启动交互式 shell
objection -g com.victim.app explore

# 2. 常用命令
# android hooking search classes crypto
# android hooking watch class com.victim.app.Crypto
# android hooking generate simple com.victim.app.Crypto  # 生成整个类的 hook 模板
# android keystore list
# android keystore watch
# android sslpinning disable
# memory list modules --max-size 4096  # 列出已加载模块
# root disable                          # 模拟 unroot
# shell exec whoami                     # 在 app 沙盒里执行命令
```

## 七、高级：frida-trace 自动追踪函数

```bash
# 追踪所有 Java crypto 操作
frida-trace -U -f com.victim.app \
  -i "Java_*" -i "*AES*" -i "*RSA*" -i "*HMAC*" -i "*EVP*"

# 追踪 JNI 调用 (RegisterNatives 处断下，查看动态注册的方法)
frida-trace -U -f com.victim.app -i "RegisterNatives"

# 追踪网络相关系统调用
frida-trace -U -f com.victim.app -i "connect" -i "sendto" -i "recvfrom"
```

## 八、CheckList

- [ ] 成功附加目标 APP（root/越狱环境、或使用 patchapk）
- [ ] 掌握基础 Java / ObjC Hook 脚本结构
- [ ] Native 层能 hook libc.so / libssl.so 关键函数
- [ ] 可以绕过 SSL Pinning (Burp 抓到明文 HTTPS 流量)
- [ ] 可以绕过 Root / 反调试 / 模拟器检测
- [ ] 能打印敏感方法参数（登录/加解密/接口调用）
- [ ] 会用 frida-trace 自动追踪函数调用
- [ ] objection 能快速交互式探索 APP
- [ ] 会写自定义 NativeFunction 调用内部加密函数
- [ ] 掌握把 Frida 脚本整合到自动化工具（Frida-rpc）
