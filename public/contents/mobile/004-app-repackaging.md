# APP 重打包与二次打包检测防护

> **📘 文档定位**：CISP 考试 移动安全 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 系统讲解 APP 重打包/二次打包的攻击原理、检测技术（签名校验/DEX校验/资源校验）及防护方案，覆盖 Android/iOS 双平台。

---

## 导航目录

- [一、重打包攻击原理](#一重打包攻击原理)
- [二、签名校验机制](#二签名校验机制)
- [三、完整性检测技术](#三完整性检测技术)
- [四、二次打包检测工具](#四二次打包检测工具)
- [五、防护加固方案](#五防护加固方案)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、重打包原理与攻击场景

**重打包（Repackaging）**是指攻击者：
1. **解包**（反编译）目标 APK/IPA
2. **插入恶意代码**（广告 SDK、恶意扣费、数据窃取、远控 RAT）
3. **重新签名**并以"正版"名义上传到第三方应用市场

### 1.1 典型场景

| 攻击 | 说明 | 影响 |
|------|------|------|
| 盗版分发 | 付费 APP 去除签名校验 + 重打包免费下载 | 收入损失 |
| 广告替换 | 替换原 APP 的广告 SDK 为攻击者账号 | 广告收益被窃取 |
| 后门植入 | 注入 RAT/窃密代码，偷账号/支付密码 | 用户隐私泄露 |
| 仿冒银行/支付 | 伪造 APP，诱导用户输入真实账号密码 | 钓鱼 + 资金损失 |

## 二、Android 重打包全流程（攻击者视角）

```bash
# Step 1: 解包
apktool d original.apk -o unpacked/

# Step 2: 修改 / 植入
#    - AndroidManifest.xml: 增加权限 (READ_SMS, SEND_SMS, INTERNET)
#    - smali/com/victim/app/MainActivity.smali: 在 onCreate 插入调用恶意类
#    - lib/libmal.so: 放入恶意 so
#    - res/values/strings.xml: 修改支付回调地址

# Step 3: 重打包
apktool b unpacked/ -o repackaged.apk

# Step 4: 签名 (用攻击者自己的 key)
zipalign -v -p 4 repackaged.apk aligned.apk
apksigner sign --ks attacker.jks --ks-key-alias attacker --key-pass pass:123456 \
    --ks-pass pass:123456 aligned.apk
apksigner verify --verbose aligned.apk
```

### 2.1 Smali 注入示例（Java 层植入）

```smali
# 在 onCreate 的末尾插入：启动恶意服务
# Original:
#   invoke-virtual {p0, v0}, Lcom/victim/app/MainActivity;->setContentView(I)V
# 插入 →

new-instance v0, Landroid/content/Intent;
invoke-direct {v0, p0, Lcom/attacker/MalService;-><init>}
invoke-virtual {p0, v0}, Lcom/victim/app/MainActivity;->startService(Landroid/content/Intent;)Landroid/content/ComponentName;
```

### 2.2 Native 层植入

```c
// 攻击者把 libmal.so 放进 lib/arm64-v8a/
// 并在 smali 里插入 System.loadLibrary("mal")
// 或通过 PT_GNU_STACK + DT_NEEDED 方式让加载器自动加载
```

## 三、iOS IPA 重打包

```bash
# Step 1: 砸壳 (dumpdecrypted / frida-ios-dump / clutch)
#   从已越狱设备上的正版 APP 提取未加密 Mach-O
frida-ios-dump -l          # 列出可砸壳 APP
frida-ios-dump com.victim.app

# Step 2: 解包 Payload
unzip victim.ipa
# Step 3: 注入 FridaGadget 或恶意 Framework
# Step 4: 重新签名 (codesign + entitlements)
# Step 5: 打包成 IPA，通过 AppSync / TestFlight / 企业证书分发
```

## 四、重打包检测技术（APP 自保护）

### 4.1 签名校验（最基础）

```java
// 在 Application.onCreate 或 JNI_OnLoad 中检查签名
PackageInfo info = getPackageManager().getPackageInfo(getPackageName(),
    PackageManager.GET_SIGNATURES);
byte[] cert = info.signatures[0].toByteArray();
MessageDigest md = MessageDigest.getInstance("SHA-256");
byte[] fingerprint = md.digest(cert);
if (!Arrays.equals(fingerprint, EXPECTED_SHA256)) {
    // 签名不一致，退出或擦除数据
    android.os.Process.killProcess(android.os.Process.myPid());
}
```

**问题**：攻击者可以在 smali 中直接 patch 掉这段逻辑。需要：
- 把校验下沉到 Native（.so）层
- 对校验函数本身做完整性检查（Checksum 自校验）
- 多处交叉校验，A 点检查 B 点，B 点检查 C 点
- 延迟 / 异步校验，不要集中在启动函数

### 4.2 完整性校验（APK 摘要）

1. **DEX 文件摘要**：启动时对 `classes.dex` 做 SHA-256 与服务器下发值比对
2. **资源文件摘要**：对关键 `AndroidManifest.xml` / `resources.arsc` 做 hash
3. **APK 整体签名**：`apksigner verify` 本身可由服务器挑战-响应式校验

### 4.3 渠道包识别（防内部渠道包外流）

```
# 渠道包常用写入方式：
#  1) META-INF/<channel> 空文件
#  2) AndroidManifest.xml <meta-data android:name="CHANNEL" android:value="baidu"/>
#  3) Walle/VasDolly 写入 APK Signing Block
#  APP 启动时读取 → 上传至服务器 → 异常渠道（official / internal）需告警
```

## 五、反反编译与反 Hook

| 手段 | 实现 | 绕过 |
|------|------|------|
| 字符串加密 | 把签名指纹 / 关键类名加密后运行时解密 | Frida 打印解密后的内存字符串 |
| Dex 加壳 | 爱加密、梆梆、360、腾讯乐固：把核心 Dex 加密，运行时动态加载 | FART / Unpacker dump 内存 Dex |
| Control Flow Flattening (CFF) | OLLVM 把直线代码改成 switch 状态机 | 反混淆脚本 (obfuscator-llvm deflat) |
| 虚拟机 / VMP | 关键函数转成自定义字节码（Ali 梆梆 VMP） | 指令还原 + 模拟执行 |
| 进程 / 线程保护 | `pthread_atfork` + `ptrace(PTRACE_TRACEME)` 检测 Frida | Frida anti-anti-debug 脚本 |
| 网络层签名校验 | 关键请求附带 APP 签名 / 完整性摘要（client attestation） | Frida hook 返回结果 |

## 六、服务端侧的重打包检测（推荐）

纯客户端防护无法完全阻挡加固攻击者。**关键业务必须服务端做校验**：

```
# 服务端 Attestation 流程

1. APP 启动时生成随机数 R
2. 调用 getPackageInfo().signatures 计算签名摘要 S = SHA256(cert)
3. 将 (S + R + 设备指纹 + time_t) 用内置公私钥签名，上传至服务端
4. 服务端：
   - 验证 S 是否在"合法签名白名单"中
   - 验证时间戳不超过 60s，R 不重复（防重放）
   - 校验设备指纹是否异常（同一设备突然切换多个渠道）
5. 服务端下发受保护 token，其他接口必须携带 token 才能调用
```

## 七、上线前自查清单

- [ ] 主包 signature 摘要白名单化（不接受任何其他签名的包）
- [ ] 关键业务（登录、支付、提现）启用服务端 Attestation
- [ ] Native (.so) 层做完整性、反调试、反 Frida 检测
- [ ] 不要把服务端 API key / 签名密钥明文放在 assets / res
- [ ] 使用 Android V2/V3 签名（支持 APK Signing Block 检测）
- [ ] 应用商店渠道包差异化处理（META-INF 写入渠道信息）
- [ ] 建立"发现重打包 APP → 取证 → 投诉下架"运营流程
- [ ] 定期在主流第三方市场搜本公司关键词，主动监控仿冒 APP
- [ ] iOS 端使用 App Attest（iOS 14+）做服务端设备/APP 完整性校验
- [ ] 用户登录通知 + 设备指纹异常告警，让用户能识别非官方客户端
