# 多因素认证(MFA)与无密码认证技术

---

## 一、MFA 认证因素分类

```
三大认证因素（结合两个以上 = MFA）：

  知识因素 (Something You Know)  — 密码/PIN/安全问题
  持有因素 (Something You Have)  — 手机/安全密钥/智能卡
  固有因素 (Something You Are)   — 指纹/人脸/虹膜/声纹

认证强度排序：
  密码 < SMS OTP < TOTP < Push通知 < FIDO2安全密钥
```

---

## 二、TOTP 时间同步一次性密码

### 2.1 原理 (RFC 6238)

```
TOTP = HOTP(K, T)
       HOTP基于HMAC-SHA-1的一次性密码
       T = (当前Unix时间 - T0) / 时间步长 (通常30秒)

算法：
  1. 共享密钥 K (Base32编码，QR码分发)
  2. Counter = floor((current_time - T0) / time_step)
  3. HMAC-SHA-1(K, Counter) → 20字节摘要
  4. 动态截断(Dynamic Truncation) → 31位整数 → mod 10^6 → 6位OTP

常见应用：
  Google Authenticator, Microsoft Authenticator, Authy, FreeOTP
  Bitwarden, 1Password (内置TOTP生成)

TOTP 安全注意事项：
  ✓ 密钥安全存储（Secure Element / TEE）
  ✗ 不支持防钓鱼（用户可能将OTP输入钓鱼网站）
  ✗ 时间不同步问题（需要NTP准确）
```

### 2.2 TOTP 部署要点

```python
import pyotp
import qrcode

# 生成密钥（服务端存储）
secret = pyotp.random_base32()  # e.g., "JBSWY3DPEHPK3PXP"

# 生成供给用户的URI
totp = pyotp.TOTP(secret)
uri = totp.provisioning_uri(
    name="zhangsan@example.com", 
    issuer_name="MyCompany"
)
# otpauth://totp/MyCompany:zhangsan@example.com?secret=JBSWY3DPEHPK3PXP&issuer=MyCompany

# 生成二维码
qr = qrcode.make(uri)
qr.save("mfa_qr.png")

# 验证OTP
user_otp = input("Enter OTP: ")
if totp.verify(user_otp, valid_window=1):  # ±1窗口（共90秒容错）
    print("验证通过")
    # 防重放：记录已使用的OTP，同窗口内不可重复使用
else:
    print("OTP无效")
```

---

## 三、FIDO2 / WebAuthn 无密码认证

### 3.1 核心架构

```
FIDO2 = WebAuthn (W3C标准浏览器API) + CTAP (客户端到认证器协议, Client to Authenticator Protocol)

认证流程（注册 Register）：
  1. RP(依赖方)发送注册挑战给浏览器
  2. 浏览器通过CTAP与认证器通信
  3. 用户验证（触摸YubiKey/指纹/输PIN）
  4. 认证器生成公私钥对（私钥不出认证器）
  5. 公钥+签名返回RP存储

认证流程（登录 Authenticate）：
  1. RP发送登录挑战
  2. 浏览器请求认证器用私钥签名挑战
  3. 用户验证（触摸/指纹/PIN）
  4. RP用存储的公钥验证签名

防钓鱼原理：
  密钥对绑定到RP的Origin(rpId)
  认证器只对注册时绑定的域名生成有效签名
  钓鱼网站（不同域名）无法获得有效签名
  → TLS+Origin绑定 = 钓鱼免疫
```

### 3.2 WebAuthn 密钥类型

```
Passkey (通行密钥)：
  - 基于FIDO2的多设备同步凭证
  - Apple/Google/Microsoft生态同步（iCloud Keychain/Google Password Manager/Windows Hello）
  - 手机扫描PC上的QR码完成跨设备认证
  - 用户无需记忆密码

平台认证器 (Platform Authenticator)：
  - Windows Hello, Touch ID, Face ID, Android Biometric
  - 仅在当前设备可用

跨平台认证器 (Cross-Platform / Roaming Authenticator)：
  - USB/NFC/蓝牙硬件安全密钥
  - YubiKey, Google Titan, Feitian, Thetis
  - 可在多设备间使用（物理携带）
```

### 3.3 WebAuthn 代码示例

```javascript
// 注册 (Registration / Attestation)
const publicKeyCredentialCreationOptions = {
  challenge: Uint8Array.from(randomBytes, c => c.charCodeAt(0)),
  rp: {
    name: "My Company",
    id: "example.com"  // RP ID
  },
  user: {
    id: Uint8Array.from(userId, c => c.charCodeAt(0)),
    name: "zhangsan@example.com",
    displayName: "Zhang San"
  },
  pubKeyCredParams: [
    { type: "public-key", alg: -7 },   // ES256
    { type: "public-key", alg: -257 }  // RS256
  ],
  authenticatorSelection: {
    authenticatorAttachment: "platform",  // 平台认证器
    userVerification: "required",          // 要求用户验证
    residentKey: "required"               // 可发现凭证(Passkey)
  },
  timeout: 60000,
  attestation: "none"  // 不需要认证器证明
};

const credential = await navigator.credentials.create({
  publicKey: publicKeyCredentialCreationOptions
});

// 验证 (Authentication / Assertion)
const publicKeyCredentialRequestOptions = {
  challenge: Uint8Array.from(randomBytes, c => c.charCodeAt(0)),
  rpId: "example.com",
  allowCredentials: [],  // 空 = 允许用户选择任意Passkey (discoverable credential)
  userVerification: "required",
  timeout: 60000
};

const assertion = await navigator.credentials.get({
  publicKey: publicKeyCredentialRequestOptions
});
```

```go
// 服务端验证 (Go + go-webauthn)
import "github.com/go-webauthn/webauthn"

// 验证注册响应
parsedCredential, err := webAuthn.CreateCredential(
    user,
    sessionData,
    parsedResponse,
)

// 验证认证响应
parsedCredential, err := webAuthn.ValidateLogin(
    user,
    sessionData,
    parsedResponse,
)
```

---

## 四、MFA 方案选型对比

| 方案 | 安全等级 | 用户体验 | 防钓鱼 | 成本 | 适用场景 |
|------|---------|---------|--------|------|---------|
| **SMS OTP** | 低 (SIM劫持风险) | 好 | ✗ | 低 | 低敏感系统/过渡方案 |
| **TOTP** | 中 | 中 | ✗ | 极低 | 内部系统/开发者 |
| **Push通知** | 中-高 | 好 | ✓ (号码匹配) | 中 | 企业级(Okta/Duo) |
| **FIDO2安全密钥** | 最高 | 中 (需携带) | ✓ | 高 (硬件成本) | 高管/特权账户/关基 |
| **Passkey** | 高 | 最好 | ✓ | 无硬件成本 | 大众用户/消费者 |
| **生物特征** | 中-高 | 最好 | 部分 | 中 | 移动App/Windows Hello |

---

## 五、MFA 部署策略

```
分层策略：
  L1 - 低风险系统（内部Wiki/公告板）
    → 密码 + 可选MFA

  L2 - 普通业务系统（报销/OA/HR）
    → 密码 + TOTP/Push MFA

  L3 - 关键业务 + 远程接入
    → 密码 + FIDO2/Passkey + 设备信任

  L4 - 特权账户 + 关基系统
    → FIDO2硬件密钥 + 操作审批(4 Eyes) + 会话审计

降级与备份：
  - 丢失MFA设备 → 管理员重置 + 身份验证（HR确认/视频核身）
  - 备份码（恢复码）→ 一次性使用
  - 双MFA注册（手机+安全密钥各一个）
```

---

## 六、Checklist

- [ ] 全范围强制MFA（不能只覆盖一部分用户）
- [ ] Passkey/FIDO2优先于短信/TOTP
- [ ] 管理员/特权账户使用硬件安全密钥
- [ ] 提供至少两种MFA方式（主+备份）
- [ ] MFA重置流程安全设计（防社会工程）
- [ ] 条件访问策略（异地/新设备触发MFA）
- [ ] 淘汰SMS OTP（至少对敏感系统）
- [ ] MFA注册/解除日志审计
- [ ] FIDO2 RP ID绑定正确域名（放通子域）
- [ ] 定期MFA安全评估与红队测试
