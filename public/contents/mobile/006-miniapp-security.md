# 小程序安全：微信/支付宝小程序渗透

---

## 一、小程序运行机制

### 1.1 小程序架构（以微信小程序为例）

```
┌───────────────────────────┐     ┌───────────────────────────┐
│  微信/支付宝 APP (WebView) │     │   小程序开发者后端          │
│  ┌────────┐   ┌────────┐   │     │                           │
│  │ 逻辑层 │   │ 渲染层 │   │ ───▶│  https://api.example.com/ │
│  │(JS Core)│   │(WebView)│   │     │                           │
│  └────────┘   └────────┘   │     └───────────────────────────┘
│       ▲             ▲       │
│       │  wx. API   │        │
│   本地存储 + 设备能力      │
└───────────────────────────┘
```

**小程序的关键特征**：

- 运行于微信/支付宝自带的 JS 引擎（微信 = V8/JSC，支付宝 = Nebula）
- 有独立域名白名单（`request合法域名`），未在白名单内无法请求
- 有本地存储 `wx.setStorageSync / wx.getStorageSync`
- 有设备能力 API：扫码、定位、摄像头、麦克风、相册、蓝牙、通讯录
- 前端代码在客户端执行，**可以被反编译**

## 二、小程序源码获取与反编译

### 2.1 源码所在路径

```
# Android
#  微信: /sdcard/Android/data/com.tencent.mm/MicroMsg/<user_id>/appbrand/pkg/*.wxapkg
#  支付宝: /sdcard/Android/data/com.eg.android.AlipayGphone/files/nebulaInstalledApps/<appid>/*.tar

# iOS
#  微信: /var/mobile/Containers/Data/Application/<UUID>/Documents/<user_id>/WeCloud/applet/<appid>/*.wxapkg
```

### 2.2 解包工具链

```bash
# 方案 1: 开源脚本（wxapkgs 系列）
#   https://github.com/xuedingmiaojun/wxappUnpacker
git clone https://github.com/xuedingmiaojun/wxappUnpacker
cd wxappUnpacker && npm install
node wuWxapkg.py /path/to/target.wxapkg   # 生成源码目录

# 方案 2: 最新版本 wxapkg 加密处理
#  - 微信从 7.x 开始对 wxapkg 使用 V2 格式，按不同包名密钥 XOR/AES
#  - 需要额外破解工具（社区脚本 + frida hook 导出密钥）
```

### 2.3 解包后目录结构

```
./
├── app.js / app.json / app.wxss          ← 全局入口与样式
├── pages/
│   ├── index/
│   │   ├── index.js                      ← 业务逻辑（JS）
│   │   ├── index.wxml                    ← 结构 (类似 HTML)
│   │   ├── index.wxss                    ← 样式
│   │   └── index.json                    ← 页面配置
│   └── login/login.js                    ← 登录相关页面
├── components/                           ← 自定义组件
├── utils/                                ← 通用工具（含加解密）
├── project.config.json                   ← 项目配置
└── sitemap.json
```

## 三、小程序静态代码审计要点

### 3.1 硬编码敏感信息

```javascript
// ❌ 常见错误：AK/SK / Token / key 写死在 JS
const appKey = 'AKIA******************';
const appSecret = 'abc123def456ghi789';
const AES_IV = '0123456789abcdef';
const SERVER_URL = 'http://10.1.2.3/internal-api/';

// ✅ 正确：使用微信登录态 + 服务器签发 session
//   wx.login → code → 后端换 session_key + openid
```

```bash
# 扫描脚本：
grep -rnE "(appKey|appSecret|access_key|accessKeyId|apiKey|AKIA|LTAI|pass|Bearer|eyJ|AES|key=|token)" ./src/
```

### 3.2 登录态 / session_key 使用

```javascript
// 微信流程：wx.login() 获取 code → 发送到服务器
//             服务器用 code 换 openid + session_key
// ❌ 错误: 把 session_key 下发给客户端或用其做对称加密后返给客户端

// 正确方案:
//   1. 服务端保存 session_key (不回传)
//   2. 下发自定义 token（jwt 或随机字符串）
//   3. 敏感数据在服务端解密后返回
wx.login({
    success(res) {
        wx.request({
            url: 'https://api.example.com/login',
            data: { code: res.code },
            success(r) { wx.setStorageSync('token', r.data.token); }
        });
    }
});
```

### 3.3 request 白名单配置（`app.json`）

```json
{
  "requestDomain": ["https://api.example.com", "https://*.oss-cn-hangzhou.aliyuncs.com"],
  "uploadFileDomain": ["https://api.example.com"],
  "downloadFileDomain": ["https://cdn.example.com"],
  "webviewDomain": ["https://docs.example.com"]
}
```

**审计要点**：
- 若白名单含 `https://*.oss-cn-hangzhou.aliyuncs.com` → 任何用户桶都可请求，风险
- 若白名单域名是 `https://example.herokuapp.com` → 攻击者也能申请同域
- webview 白名单域名的 URL 可能被注入 `javascript:` scheme

### 3.4 WebView 风险（小程序内嵌 H5）

```javascript
// web-view 打开外部链接
<web-view src="https://third.example.com/?redirect=xxx"></web-view>

// ❌ 风险: redirect 参数未校验，导致打开攻击者页面
//    攻击者: https://third.example.com/?redirect=https://evil.com/phish
// ✅ 正确: 严格白名单 + URL 仅允许指定前缀
```

## 四、动态测试与抓包

```bash
# 1) 手机 Wifi 代理到 Burp Suite
# 2) 安装 Burp CA 证书到系统证书目录（Android 7+ 需要系统级）
# 3) 打开小程序，抓包观察所有请求：
#    - 登录 / 注册 / 获取用户信息
#    - 下单 / 支付 / 退款
#    - 上传 / 下载
#    - wx.request 接口参数

# 4) 常见参数名:
#    token / sessionId / openid / unionid / user_id / sign / timestamp / nonce
# 5) 常见漏洞:
#    - 越权: /order?id=123 → 修改 id 看他人订单
#    - 水平越权: token 不变，把 uid 改成他人
#    - 支付逻辑漏洞: amount 可修改 / 状态可重复提交
#    - SQL 注入: order?keyword=test' UNION SELECT...
```

## 五、敏感权限与隐私合规

| API | 敏感能力 | 合规要求 |
|-----|---------|---------|
| `wx.getLocation` | 定位 | 首次调用前必须弹窗申请；隐私政策要声明 |
| `wx.chooseImage / wx.chooseMedia` | 相册/相机 | 仅在需要时申请 |
| `wx.makePhoneCall` | 拨打电话 | 禁止在用户无感知时调用 |
| `wx.getUserProfile` | 微信昵称/头像 | 必须用户主动点击触发 |
| `wx.getPhoneNumber` | 手机号 | 必须明确场景 + 用户点击触发 |
| `wx.getClipboardData` | 剪贴板 | 禁止静默读取；小程序/APP 间剪贴板互通风险 |

```javascript
// ❌ 违规示例：进入页面自动读剪贴板
onShow() {
  wx.getClipboardData({ success: d => this.parseInviteCode(d.data) });
}
// ✅ 合规：用户主动点击按钮后读取
onReadInviteCode() {
  wx.getClipboardData({ ... });
}
```

## 六、常见 TOP 漏洞清单

1. **硬编码密钥 / Token** 放在 JS → 直接反编译就能提取
2. **接口未做鉴权**：前端校验 → 攻击者改请求即可绕过
3. **越权（水平 / 垂直）**：`?id=123` 改成任意 id 即可读他人数据
4. **支付漏洞**：amount / total_fee 未做服务端二次校验
5. **URL Scheme 劫持**：小程序跳 H5 再跳第三方 APP，参数未校验
6. **越权登录**：`openid` 作为唯一身份，可通过自定义 APP 伪造
7. **敏感信息明文传输**（小程序默认 HTTPS，但自建接口可能混用 HTTP）
8. **云函数暴露**：微信云开发 `wx.cloud.callFunction` 可能缺少权限校验

## 七、加固建议

- **代码混淆**：uglifyjs / terser 压缩 + 标识符乱序
- **微信小程序官方方案**：`project.config.json` 中 `minified=true`
- **服务端校验**：所有关键业务（下单、支付、提现）必须服务端二次校验
- **Token 过期制**：短期有效（30 分钟内）+ 刷新机制
- **频率限制**：登录 / 支付 / 短信 必须 rate limit + 人机验证
- **WebView 白名单**：严格限制跳转域
- **权限最小化**：仅在需要时调用敏感 API
- **监控告警**：接口异常访问（同一 token 多 IP / 同一 IP 多账号）

## 八、CheckList

- [ ] wxapkg 包已解压并获取源码
- [ ] 源码搜索硬编码 AK/SK / Token / URL / AES Key
- [ ] `app.json` 域名白名单是否过宽（是否包含泛域名）
- [ ] `request` 接口调用服务端做了权限校验
- [ ] 越权测试: 把 id / uid 替换他人，验证是否可访问
- [ ] 支付逻辑: 修改 amount / total_fee，观察服务端是否拒绝
- [ ] 登录态 token 是否短期有效 / 服务端可控
- [ ] 敏感权限（定位 / 相册 / 摄像头 / 手机号）调用时机是否合规
- [ ] 剪贴板读取是否在用户主动操作后触发
- [ ] web-view 跳转 URL 白名单是否严格
