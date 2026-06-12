# iOS APP 安全测试：越狱环境 + IPA 分析

---

## 一、iOS 安全测试环境搭建

### 1.1 测试设备选择

| 设备 | 系统版本 | 越狱工具 | 备注 |
|------|---------|---------|------|
| iPhone 8 / X | iOS 14.0 - 15.7.1 | checkra1n | 硬件级 bootrom 漏洞，稳定越狱 |
| iPhone X - 13 | iOS 14.0 - 16.5 | Taurine / palera1n | 支持 iOS 15-16，非完美越狱 |
| 模拟器 | 任意版本 | 无需越狱 | 适合静态分析 + 轻量动态调试 |

### 1.2 越狱后核心安装包（Cydia / Sileo）

```
- OpenSSH              # SSH 连入手机
- Frida Server         # 动态插桩必备
- adv-cmds / file-cmds # ps, file, lsof 等调试工具
- Cycript              # 老牌 runtime 探索
- class-dump / dyld    # 头文件提取
- SSL Kill Switch 2    # 全局禁用证书校验
- AppSync Unified      # 安装自签名 IPA
- FLEX / RocketBootstrap  # 运行时调试 UI
```

## 二、IPA 包结构与静态分析

```
Payload/
└── MyApp.app/
    ├── MyApp                  ← Mach-O 主二进制 (核心)
    ├── Info.plist             ← 配置、权限、URL Scheme、LSApplicationQueriesSchemes
    ├── embedded.mobileprovision ← 描述文件（含证书、Entitlements）
    ├── Frameworks/            ← 动态库与系统框架
    ├── Assets.car / Base.lproj/ ← 资源、本地化字符串
    ├── GoogleService-Info.plist / google-services.json ← 常含密钥
    └── *.log / *.json / *.sqlite ← 资源文件中可能存在敏感信息
```

### 2.1 Mach-O 静态分析

```bash
# 1) 解包 IPA
unzip app.ipa -d app_extracted

# 2) 查看 Mach-O 基础信息
file app_extracted/Payload/MyApp.app/MyApp
# MyApp: Mach-O 64-bit executable arm64

# 3) 查看架构、段、符号、动态库
otool -l app_extracted/Payload/MyApp.app/MyApp | head -100
otool -L app_extracted/Payload/MyApp.app/MyApp   # 依赖的动态库

# 4) strings 搜索敏感信息
strings -a app_extracted/Payload/MyApp.app/MyApp \
  | grep -iE "(https?://|api_key|AKIA|LTAI|token|secret|Bearer|Bearer\s+)"

# 5) class-dump / Swift 类结构
class-dump -H app_extracted/Payload/MyApp.app/MyApp -o headers/
# (Swift 类使用 `swift demangle` 或 jtool2)

# 6) 查看 entitlements（权限）
jtool2 --ent app_extracted/Payload/MyApp.app/MyApp
# 关注: com.apple.security.network.client, NSAllowsArbitraryLoads, get-task-allow
```

### 2.2 Info.plist 高危配置

| 项 | 风险 | 推荐值 |
|----|------|--------|
| `NSAllowsArbitraryLoads = true` | 允许明文 HTTP | false 并显式声明白名单 |
| `UIFileSharingEnabled = true` | iTunes 共享可读取整个 Documents 目录 | false |
| `NSSupportsOpeningDocumentsInPlace = true` | Files.app 可见 Documents | false |
| `NSExceptionDomains` 含 `NSIncludesSubdomains + NSThirdPartyExceptionAllowsInsecureHTTPLoads` | 域下明文 HTTP | 仅必要时开启 |
| URL Scheme 含 `tel://` / `sms://` 且无校验 | 可能被恶意 APP 调用拨打电话 | 加白名单 |

## 三、动态测试：Frida + objection

```bash
# 1) 启动 APP 并注入 Frida（需越狱手机运行 frida-server）
frida-ps -U                  # 列出 USB 连接设备上的进程
frida -U -f com.victim.app   # 以 spawn 模式附加（能拦截 application:didFinishLaunchingWithOptions）

# 2) objection 一键启动（最推荐）
objection --gadget com.victim.app explore
# 进入交互式 shell：
#   ios hooking list classes          → 列出所有类
#   ios hooking search classes Login  → 搜索含 Login 的类
#   ios hooking watch class LoginVC   → 监控该类所有方法调用
#   ios nsuserdefaults get            → 打印 NSUserDefaults
#   ios bundles                      → 查看资源包、沙盒路径
#   ios keychain dump                 → 查看 keychain 存储的密码
#   ios sslpinning disable            → 禁用证书校验
```

### 3.1 经典 Frida Hook 脚本

```javascript
// Hook +[NSURLRequest requestWithURL:cachePolicy:timeoutInterval:]
// 看所有发起的 HTTP 请求（绕过 Alamofire / URLSession 抽象）
const { NSURLRequest } = ObjC.classes;

Interceptor.attach(
    NSURLRequest['+ requestWithURL:cachePolicy:timeoutInterval:'].implementation,
    {
        onEnter(args) {
            const url = new ObjC.Object(args[2]);
            console.log('[HTTP REQUEST]', url.toString());
        }
    }
);

// Hook kSecItemAdd / kSecItemCopyMatching 查看 keychain 读写
const kSec = Module.findExportByName('Security', 'SecItemAdd');
Interceptor.attach(kSec, { onEnter(args) { console.log(hexdump(args[1])); }});
```

### 3.2 绕过证书 Pinning

```bash
# 方案 A: SSL Kill Switch 2（Cydia 包）
#   自动 hook `NSURLSession` / `Security.framework` 所有校验点

# 方案 B: objection 运行时禁用
objection -g com.victim.app run "ios sslpinning disable --quiet"

# 方案 C: Frida 脚本（codeshare.frida.re/@snooze6/ios10-ssl-bypass）
frida -U -f com.victim.app -l ios-ssl-bypass.js
```

## 四、关键数据存储安全

```bash
# 沙盒路径（iOS 8+）
#   App 自身：/var/mobile/Containers/Data/Application/<UUID>/
#   共享组：  /var/mobile/Containers/Shared/AppGroup/<UUID>/

# 1) 读取 Documents / Library / tmp 目录
ssh root@<iphone-ip>
cd /var/mobile/Containers/Data/Application/
ls                                  # 找目标应用 UUID
cat <UUID>/Documents/*.json
sqlite3 <UUID>/Library/Application\ Support/*.db ".dump"

# 2) plist 解析（NSUserDefaults）
plutil -convert xml1 -o - <UUID>/Library/Preferences/com.victim.app.plist

# 3) Keychain（越狱后可直接读取）
#    objection: ios keychain dump
#    或：keychain-dumper
#    关注: 账号密码、OAuth token、biometry context、加密密钥
```

## 五、WebView 与深层链接测试

```swift
// ① universal link / URL scheme：被其它 APP / 网页唤起
// Info.plist: CFBundleURLSchemes = ["myapp"]
// 测试打开：myapp://deeplink?redirect=file:///etc/passwd

// ② WKWebView 漏洞点：
let webView = WKWebView()
webView.configuration.preferences.javaScriptEnabled = true  // 常开
// ❌ 危险：JavaScript 能调用原生 (JavaScriptBridge/WKWebViewJavascriptBridge)
// ❌ 危险：file:// URL 加载本地 HTML 后通过 JS 读沙盒
// ❌ 危险：allowsBackForwardNavigationGestures + 未校验 origin

// ③ ITMS-91034 / NSAppTransportSecurity
```

## 六、越狱 / 调试检测对抗

| 检测手段 | 绕过方法 |
|---------|---------|
| `access("/bin/sh", F_OK)` / `access("/Applications/Cydia.app")` | Frida hook `access` 或 rename Cydia |
| `getenv("DYLD_INSERT_LIBRARIES")` | 以 spawn 模式启动 + Frida 擦除 |
| `ptrace(PTRACE_DENY_ATTACH, 0, 0, 0)` | 反反调试 ptrace hook（Frida 脚本） |
| `sysctl CTL_KERN/KERN_PROC → check p_flag` | Hook `sysctl` |
| `exit(0)` / `abort()` 在检测到越狱 | Frida 替换 exit / `Intercept.replace('exit', x => {})` |

## 七、iOS 安全基线（PIPL 与隐私合规）

- 权限弹窗：首次申请时才弹窗，禁止"打开即申请全部权限"
- 剪贴板读取：iOS 14+ 系统会提示 APP 读取剪贴板，敏感业务禁止默认读取
- 采集 IDFA / IDFV：须用户同意 ATT 弹窗
- 网络传输：默认 ATS (App Transport Security)；禁止第三方 SDK 单独明文上报
- 设备指纹：不得采集 IMEI / MAC 地址；使用 SDK 提供的 `DeviceCheck` 或 App Tracking Transparency

## 八、CheckList

- [ ] Info.plist 检查：ATS / NSAllowsArbitraryLoads / URL Schemes / UIFileSharingEnabled
- [ ] Mach-O 扫描：strings 找密钥 / 内网地址 / API token
- [ ] 依赖第三方库版本：含已知 CVE 的 SDK 需升级
- [ ] Frida / objection 动态运行：关键方法调用链、登录/支付流程
- [ ] 沙盒数据：NSUserDefaults / Documents / SQLite / keychain 是否明文
- [ ] 证书 pinning 是否存在且可绕过
- [ ] WebView：JS 可调用原生方法、file:// 协议风险
- [ ] URL Scheme / Universal Link 传入参数校验
- [ ] 越狱、反调试、模拟器检测状态与绕过测试
- [ ] 隐私合规：权限声明、SDK 上报、IDFA / 剪贴板 / 位置信息采集
