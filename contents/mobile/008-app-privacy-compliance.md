# 移动端 APP 隐私合规检测实战

---

## 一、隐私合规的法律框架

| 法规 | 生效日期 | 核心要求 |
|------|---------|---------|
| 《个人信息保护法》(PIPL) | 2021-11-01 | 最小必要、告知同意、目的限定、跨境传输、敏感个人信息特别保护 |
| 《网络安全法》 | 2017-06-01 | 个人信息收集合法正当必要，不得泄露/篡改/破坏 |
| 《数据安全法》 | 2021-09-01 | 数据分类分级、重要数据保护、跨境数据安全评估 |
| GB/T 35273《个人信息安全规范》 | 2020-10-01 | 个人信息全生命周期安全指引 |
| 《App 违法违规收集使用个人信息行为认定方法》 | 2019-11-28 | 8 类常见违规行为认定 |
| 《常见类型移动互联网应用程序必要个人信息范围》 | 2021-03-12 | 39 类 APP 必要个人信息范围（即"最小信息"清单） |
| iOS App Store 审核指南 | 持续更新 | 数据分类、隐私标签 Privacy Manifest、ATT 弹窗、跟踪披露 |
| Google Play User Data Policy | 持续更新 | 数据披露、安全下载声明、SDK 列表 |

## 二、PIPL 下的 8 大违规场景

| 违规类型 | 典型表现 |
|---------|---------|
| ① 未经同意收集 | APP 启动 / 注册页立即申请定位、通讯录、相机 |
| ② 强制捆绑授权 | 不授权就退出 / 无法使用基础功能 |
| ③ 超范围收集 | 天气 APP 申请通讯录权限 |
| ④ 明文传输 / 存储 | token、密码、聊天记录明文保存在 SD 卡 |
| ⑤ 过度索取权限 | 一次性申请 N 个权限，未按需申请 |
| ⑥ 隐私政策不清晰 | 未说明收集了什么、目的是什么、保存多久 |
| ⑦ 第三方 SDK 偷偷上报 | 集成的广告/统计 SDK 收集 IMEI/MAC/精确位置 |
| ⑧ 境外数据传输未评估 | 把中国用户数据传给境外服务器（AWS / Firebase 等）|

## 三、隐私政策文本审计

```bash
# 1) 解析隐私政策
#    - 位置: APP 内"我的→设置→隐私政策"，或服务端静态 URL
#    - 格式: HTML / PDF / 长文本

# 2) 检查点:
#    ✓ 是否明确列出"收集了哪些个人信息"
#    ✓ 是否区分"必要信息 / 可选信息"
#    ✓ 是否说明每一项的"收集目的"
#    ✓ 是否明确保存期限（不得"永久保存"）
#    ✓ 是否提供注销账号、删除信息的入口
#    ✓ 是否列出第三方 SDK 及其收集的信息
#    ✓ 是否有 15 工作日响应投诉的联系方式
#    ✓ 是否在首次启动时弹窗"同意 / 不同意"，不同意能否正常使用基础功能
```

## 四、权限声明与实际调用审计

### 4.1 声明的权限（静态）

```bash
# Android:
aapt dump badging app.apk | grep -iE "uses-permission|permission"
# 输出: uses-permission: name='android.permission.ACCESS_FINE_LOCATION'

# iOS:
plutil -p Payload/MyApp.app/Info.plist | grep -iE "(NS[A-Z]+UsageDescription|Usage)"
# 输出: "NSLocationWhenInUseUsageDescription" = "需要位置信息以便为您推荐附近商品"
```

### 4.2 实际调用的权限（动态）

```bash
# Android 方案 A:
#   运行时 + logcat 过滤权限相关日志
adb shell setprop log.tag.PackageManager VERBOSE
adb logcat | grep -iE "(permission|ACCESS_FINE_LOCATION|READ_CONTACTS|CAMERA)"

# Android 方案 B:
#   集成 Privacy Inspector / DexPilot 自动化记录每次权限申请

# iOS 方案:
#   objection run "ios plist cat" 查看 Info.plist 声明
#   frida hook 相关 API (CNCopyCurrentNetworkInfo, [CLLocationManager startUpdatingLocation])
```

## 五、敏感 API 调用清单

### 5.1 Android 敏感 API

| API | 风险 |
|-----|------|
| `TelephonyManager.getDeviceId()` / `getImei()` | IMEI 属于个人信息，Android 10+ 禁止普通 APP 获取 |
| `WifiInfo.getMacAddress()` | MAC 地址属于个人信息 |
| `LocationManager.requestLocationUpdates` | 精确定位属于敏感 |
| `ContentResolver.query(ContactsContract.Contacts.CONTENT_URI)` | 通讯录读取 |
| `SmsManager.sendTextMessage` | 发短信（常被木马滥用）|
| `ClipboardManager.getPrimaryClip` | 静默读取剪贴板，iOS 14+ / Android 12+ 有系统提示 |
| `MediaRecorder.start()` / `Camera.open()` | 录音 / 摄像 |
| `AdvertisingIdClient.getAdvertisingIdInfo()` | 广告标识符（IDFA/AAID），必须用户同意 |

```javascript
// Frida 脚本：监控敏感 API 调用
Java.perform(function () {
    const TM = Java.use("android.telephony.TelephonyManager");
    TM.getDeviceId.overload().implementation = function () {
        console.log("[!] getDeviceId() called.\n" +
            Java.use("android.util.Log").getStackTraceString(
                Java.use("java.lang.Throwable").$new()));
        return this.getDeviceId();
    };
});
```

### 5.2 iOS 敏感 API

| API | 风险 |
|-----|------|
| `[CLLocationManager startUpdatingLocation]` | 精确定位 |
| `CNContactStore ...` | 通讯录 |
| `[AVCaptureSession startRunning]` | 摄像头/麦克风 |
| `ASIdentifierManager advertisingIdentifier` | IDFA |
| `UIPasteboard generalPasteboard` | 剪贴板 |
| `[UIDevice identifierForVendor]` | 设备标识符（IDFV） |

## 六、第三方 SDK 合规审查

**常见高风险 SDK 类型**：广告（穿山甲/优量汇/AdMob）、统计（友盟/TalkingData/Firebase Analytics）、推送（JPush/极光/个推）、支付（支付宝/微信支付）、地图（高德/百度）、IM（融云/环信）。

```bash
# 1) 列出 APK 中所有第三方 SDK
#    - 反编译后看包名路径: com.umeng / com.tencent.bugly / com.alibaba.sdk
#    - 看 AndroidManifest.xml receiver/service/provider
#    - 看 build.gradle 的依赖清单

# 2) 针对每个 SDK 审查:
#    a) 是否在隐私政策中列出 + 说明收集的信息
#    b) 是否仅在"用户同意"之后才初始化
#    c) 是否使用了最新版本（老版本常收集 IMEI/MAC）
#    d) 是否支持关闭个性化推荐 / 数据删除

# 3) 实际抓取 SDK 上报数据包
#    Burp 抓包 + 过滤 sdk / track / log / upload 关键词
#    观察是否有: imei= / mac= / idfa= / android_id= / lat=,lng= / phone=
```

## 七、数据存储与传输

```bash
# 1) 本地存储审计 (Android):
adb shell run-as com.victim.app
find /data/data/com.victim.app/ -type f \( -name "*.xml" -o -name "*.db" -o -name "*.json" -o -name "*.txt" \)
sqlite3 databases/*.db ".dump" | grep -iE "(phone|mobile|name|idCard|email|token|password)"

# 2) 传输层:
#    - 全部接口是否 HTTPS (TLS 1.2+)
#    - 敏感参数（手机号、身份证、密码）是否二次加密后传输
#    - 有没有 debug 接口打印 token/密码 (logcat / frida)

# 3) 日志审计:
adb logcat | grep -iE "(IMEI|idfa|password|token|userInfo|phone|json)"
# 不得在日志中打印个人信息 / 敏感 token
```

## 八、合规整改 Checklist

- [ ] 隐私政策完整、清晰、可访问；首次启动弹出"同意/不同意"，不同意可正常使用基础功能
- [ ] 不强制捆绑授权（不得"不同意授权就退出 APP"）
- [ ] 按必要最小原则申请权限，按需申请而非一次性申请
- [ ] 权限使用需符合《必要个人信息范围》（39 类 APP 指南）
- [ ] Android 10+ 禁止获取 IMEI / MAC；使用 Android ID + 重置机制
- [ ] iOS 14+ IDFA 须经 App Tracking Transparency 弹窗授权
- [ ] 日志中不包含个人信息 / 密码 / token
- [ ] 本地 SharedPreferences / Documents / keychain 不保存明文密码或身份证号
- [ ] 所有敏感数据传输 HTTPS，token 短期有效
- [ ] 列出所有第三方 SDK，并在隐私政策中披露
- [ ] 提供账号注销入口、数据删除入口、投诉联系方式
- [ ] 提供个性化广告关闭开关
- [ ] 跨境数据传输前做安全评估（若有）
- [ ] 建立数据生命周期管理（收集→使用→保存→删除）
- [ ] 每半年做一次隐私合规自查，保留合规审计记录
