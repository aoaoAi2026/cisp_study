# Day 18：移动安全基础

> 🎯 面试目标：掌握移动安全威胁模型(iOS/Android)、应用逆向基础、移动端渗透测试面试考点

## 知识速览

### 核心概念
- **iOS安全架构**：安全启动链(Boot ROM→LLB→iBoot→Kernel)、Secure Enclave(独立安全协处理器)、沙盒机制(每个应用独立容器)、代码签名强制(非签名代码无法运行)
- **Android安全架构**：应用沙盒(Linux UID隔离)、权限系统(安装时→运行时权限)、SELinux强制访问控制、Google Play Protect(应用扫描)、SafetyNet/Play Integrity(设备完整性)
- **移动端OWASP Top 10**：不安全的数据存储(M1)、不安全的通信(M3)、不安全的认证(M4)、代码完整性不足(M8)、客户端注入(M7)等
- **iOS/Android越狱/Root检测绕过**：Magisk(Zygisk隐藏Root)、Objection/Frida绕过检测、SSL Pinning绕过、重打包注入
- **移动应用渗透测试流程**：静态分析(JADX/APKTool/Ghidra)→动态分析(Frida/Objection/Burp Suite代理)→流量分析(Charles/mitmproxy)→数据存储分析(iMazing/keychain-dump)

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| iOS和Android的安全模型本质区别？ | iOS是'封闭花园'模型：硬件+系统一体化、应用商店严格审核、强制代码签名、隐私权限严格控制。Android是'开放市场'模型：OEM可定制、第三方应用商店、权限更细粒度但用户可随意授权。安全角度：iOS的封闭性提供更强的默认安全性，Android的开放性使攻击面更大但提供了更灵活的安全控制。 |
| 如何绕过一个Android应用的SSL Pinning？ | 四种方法：1)Frida脚本——编写hook绕过OkHttp/TrustManager的证书校验 2)Objection——'android sslpinning disable'一键绕过多种SSL Pinning实现 3)修改APK——用apktool反编译→删除pinning配置→重打包签名 4)Xposed模块——JustTrustMe/TrustMeAlready模块全局绕过。面试补充：防御侧应使用证书绑定+证书透明性(CT)双重验证。 |
| Android的运行时权限模型和iOS的权限模型有什么不同？ | Android：安装时不需同意全部权限→使用时弹窗请求(用户可单独拒绝某些权限)→用户可以随时在设置中撤销。iOS：首次使用时弹窗请求→三种选项'允许一次/使用期间/永不允许'→更严格的隐私提示(如'应用想跟踪你在其他公司的App和网站中的活动')。iOS 14+新增'大致位置'选项降低了位置隐私风险。 |
| 移动端不安全数据存储常见的问题和检测方法？ | 常见问题：1)SharedPreferences/NSUserDefaults存明文密码 2)SQLite数据库无加密 3)WebView缓存敏感数据 4)剪贴板未清理 5)日志输出敏感信息。检测方法：adb shell + find/data/data查找、MobSF静态扫描、iMazing导出iOS沙盒检查、手动查看应用目录下的plist/xml/db文件。 |
| iOS Keychain vs Android Keystore 的设计差异？ | 相同点：都是硬件级安全存储(Hardware-backed)、用于存密钥/证书/敏感小数据、应用间隔离。差异：iOS Keychain访问控制更细(可设kSecAccessibleWhenUnlocked/kSecAccessibleAfterFirstUnlock等)、组共享(Keychain Groups)、支持iCloud同步。Android Keystore通过KeyGenParameterSpec设置目的+认证要求(如要求用户最近30秒内认证过)。 |

### 技术细节
**Android逆向分析完整工具链**：
```bash
# 1. 获取APK
adb shell pm list packages                    # 查看包名
adb shell pm path com.target.app               # 找APK路径
adb pull /data/app/.../base.apk                # 提取APK

# 2. 反编译
apktool d target.apk -o decompiled              # 资源+Smali代码
jadx-gui target.apk                            # Java伪代码(推荐)

# 3. 动态插桩
frida -U -l hook.js -f com.target.app          # Frida Hook
objection -g com.target.app explore             # Objection交互

# 4. 流量分析
adb shell settings put global http_proxy :8080  # 设置代理
burpsuite + 安装Burp CA证书到系统信任库
```
**MobSF(移动安全框架)一键自动化扫描**，覆盖OWASP Mobile Top 10 + 恶意软件检测 + API分析。

## 常见陷阱
- ⚠️ 忽略混淆不是安全——代码混淆(ProGuard/R8)只能增加逆向难度，不能作为主要安全措施
- ⚠️ 只测客户端不测后端——移动端安全的核心仍在API安全，客户端逆向可暴露API端点和认证逻辑
- ⚠️ 过度依赖Root/越狱检测——这些是客户端检测，有经验的攻击者都能绕过，服务端应做独立的安全验证

## 今日检测
1. 下载一个你常用的App APK，用JADX反编译，分析它的权限声明和API端点
2. 用MobSF扫描一个本地测试APK，解读安全报告
3. 搭建Frida+Burp Suite环境，尝试对你自己的测试应用做一次流量拦截分析
