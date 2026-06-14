# T-Box/IVI/OTA 三大件安全分析

> **📘 文档定位**：CISP 考试 V2X 安全核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 聚焦智能网联汽车三大核心部件——T-Box（远程通信终端）、IVI（车载信息娱乐系统）、OTA（空中升级）的安全威胁与防护方案，覆盖通信链路、固件安全、权限控制等关键攻击面。

---

## 导航目录

- [一、T-Box (远程通信终端)](#一t-box-远程通信终端)
- [二、IVI (车载信息娱乐系统)](#二ivi-车载信息娱乐系统)
- [三、OTA (空中升级)](#三ota-空中升级)
- [四、三大件协同安全架构](#四三大件协同安全架构)
- [五、安全部署 Checklist](#五安全部署-checklist)
- [六、高分考点与知识巧记](#六高分考点与知识巧记)

---

## 一、T-Box (远程通信终端)

### 1.1 T-Box 架构与攻击面

```
T-Box = Telematics Box = 车与云端通信的"咽喉"

典型组成：
  MCU (主控芯片) + 4G/5G Modem + GPS模块 + CAN收发器 + eSIM

功能：
  ├── 车联网服务(远程解锁/启动/空调/充电管理)
  ├── SOS紧急呼叫(eCall)
  ├── 车辆定位/追踪(GPS/BDS)
  ├── 数据采集(车速/里程/故障码)
  └── OTA更新下载

攻击面：
  1. 蜂窝网络侧(公网可达！)
     - AT指令注入
     - 基带(Modem)漏洞
     - SMS注入攻击
  2. CAN侧
     - T-Box通常接入关键CAN总线(动力/车身)
     - 攻破T-Box → CAN写入权限
  3. 固件侧
     - UART/JTAG调试接口
     - 固件提取→逆向→发现密钥/漏洞
     - OTA更新包篡改
  4. eSIM/UICC
     - SIM卡克隆/密钥提取
```

### 1.2 T-Box 远程攻击链

```
典型T-Box远程攻击(Jeep/特斯拉等案例总结)：

Step 1: 发现公网可达的T-Box
  通过Shodan/Censys搜索特定端口/特征
  或通过TSP平台API漏洞发现车辆VIN

Step 2: 利用远程漏洞
  基带漏洞(如Qualcomm MSM漏洞)
  AT指令注入: 发送特殊SMS触发AT+命令
  T-Box固件TCP服务栈溢出

Step 3: 获取T-Box系统权限
  Root/System shell
  → 控制4G通信+GPS+存储

Step 4: CAN注入
  T-Box内部MCU ↔ CAN收发器
  向CAN总线发送任意消息
  → 控制雨刷/灯光/仪表盘/发动机...

关键防御：
  - T-Box到CAN的网关严格隔离+消息白名单
  - 蜂窝侧防火墙(仅允许到TSP平台的出站连接)
  - 不允许公网直接入站到T-Box
  - T-Box安全启动+固件签名验证
```

---

## 二、IVI (车载信息娱乐系统)

### 2.1 IVI 安全风险

```
IVI操作系统分布：
  Android Automotive OS (谷歌) — 主机厂定制
  Linux/QNX — 高端/传统OEM
  AGL (Automotive Grade Linux) — 开源车载
  华为鸿蒙 — 问界/阿维塔

Android IVI 安全风险：
  1. 应用商店安全审核不足(恶意APP)
  2. ADB调试接口未关闭(USB—ADB→root)
  3. 系统组件漏洞未及时修复
  4. WebView/浏览器漏洞(渲染引擎→沙箱逃逸)
  5. 权限过度授予(三方APP可访问CAN接口)

IVI关键隔离：
  ┌──────────────┐
  │   IVI QM     │ ← 非安全相关(质量控制)
  │  (Android)   │
  └──────┬───────┘
         │ Ethernet (安全隔离)
  ┌──────▼───────┐
  │   网关 ASIL  │ ← 安全相关
  │   (QNX/RTOS) │
  └──────┬───────┘
         │
  ┌──────▼───────┐
  │ 动力域CAN总线 │
  └──────────────┘

◆ 网关必须确保IVI无法直接写入关键CAN帧
◆ 仅允许安全的服务调用(SOME/IP访问控制)
```

### 2.2 IVI 安全加固

```bash
# Android IVI 安全配置检查清单

# 1. 检查ADB状态
adb devices
# 如果ADB启用 → ⚠️ 立即禁用
# settings put global adb_enabled 0

# 2. 检查未签名的App
adb shell pm list packages -3
# 检查是否有未知来源App(Settings → Security → Unknown Sources)

# 3. 检查过度权限Apps
adb shell dumpsys package | grep "permission"
# 关注：WRITE_SECURE_SETTINGS, ACCESS_FINE_LOCATION,
#        ACCESS_Vehicle_Bus (车企自定义)

# 4. 检查USB配置
adb shell getprop sys.usb.config
# 不应包含 adb 字符串
```

---

## 三、OTA 远程升级安全

### 3.1 OTA 架构

```
车辆OTA升级流程：

云OTA服务器 → [TLS加密] → T-Box下载更新包 → 
验证签名 → 通知网关 → 各ECU进入升级模式 → 
分发更新包 → ECU验证→ 安装→ 验证成功→ 
上报升级结果

SOTA (Software OTA): 应用层软件升级(IVI App/地图等)
FOTA (Firmware OTA): ECU固件升级(发动机/变速箱等)

OTA安全七要素：
  1. 更新包签名 — OEM私钥签名，车辆公钥验证
  2. 更新包加密 — SM4/AES加密(防逆向)
  3. 安全通道 — TLS 1.2+双向证书传输
  4. 版本防回滚 — 防止降级到有漏洞的旧版本
  5. 完整性校验 — 传输结束→完整包SHA256校验
  6. 安装前验证 — ECU验证签名→确认→安装→运行
  7. 异常回滚 — 升级失败→自动回滚到上一版本
```

### 3.2 OTA 攻击与防御

```
OTA攻击方式：
  1. 中间人攻击 → 替换更新包
     → 防御：TLS双向证书认证 + 证书固定(Cert Pinning)

  2. 更新服务器入侵 → 分发恶意更新
     → 防御：代码签名(即使服务器被攻破，无法伪造签名)
     → 防御：多重签名(需多人审批签名才能发布)

  3. 版本回滚攻击 → 降级到漏洞版本
     → 防御：安全存储中记录当前版本号(单增)
     → 防御：防回滚计数器(Rollback Counter)

  4. 更新包逆向分析 → 提取密钥/发现新漏洞
     → 防御：代码混淆 + 白盒加密
     → 防御：HSM存储密钥(不可提取)
```

---

## 四、HSM/TEE 安全硬件

```
车载硬件安全模块 (Automotive HSM):

符合 EVITA 标准 (E-safety Vehicle Intrusion Protected Applications):
  EVITA-Full: 高性能HSM (网关/ADAS域控制器)
  EVITA-Medium: 中性能HSM (T-Box/IVI)
  EVITA-Light: 轻量级HSM (传感器/小型ECU)

HSM提供的硬件安全功能：
  ├── 安全密钥存储(不可提取私钥)
  ├── 硬件SM2/SM4/SM3加速
  ├── 真随机数生成(TRNG)
  ├── 安全启动(验证签名链)
  ├── 安全计数器(防回滚)
  └── 安全诊断(认证的设备才能诊断)

常见车载芯片HSM：
  NXP S32G (ARM Cortex-M7 HSM核)
  Infineon Aurix TC3xx (HSM内置)
  Renesas RH850 (ICU-S = HSM)
```

---

## 五、Checklist

- [ ] T-Box固件安全性审查
- [ ] T-Box蜂窝侧最小权限(仅出站白名单)
- [ ] T-Box→CAN网关消息白名单
- [ ] IVI硬件安全隔离(与动力域)
- [ ] OTA全链路安全(TLS+签名+加密+防回滚)
- [ ] 代码签名私钥硬件HSM保护
- [ ] ADB调试接口禁用(量产车)
- [ ] 应用白名单(IVI只允许OEM签名的App)
- [ ] HSM安全启动链验证

---

## 六、高分考点与知识巧记

### 高分考点速查表

| 序号 | 考点 | 频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | T-Box 攻击面与防护 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 蜂窝/APN/TLS/固件/诊断五面，最小权限+白名单 |
| 2 | IVI 安全隔离 | ⭐⭐⭐⭐ | ⭐⭐⭐ | IVI 不得直连动力 CAN，需通过网关隔离 |
| 3 | OTA 安全全链路 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | TLS+代码签名+加密+防回滚四重保障 |
| 4 | HSM/EVITA 标准 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | EVITA-Full/Medium/Light 三级，安全启动+密钥存储 |
| 5 | OTA 回滚攻击防御 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 版本号单增+防回滚计数器+安全存储 |
| 6 | ADB 调试接口风险 | ⭐⭐⭐ | ⭐⭐ | 量产车必须禁用 ADB，开发车需认证后开启 |

### 知识巧记口诀

> 🎵 **T-Box 三防线**："固件签名链路锁，消息白名单把关严"
>
> 🎵 **OTA 安全四步走**："加密传输签名验，防滚计数版本增"
>
> 🎵 **三大件安全记**："TBox 门卫严、IVI 隔离全、OTA 链路安"

---

### 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "OTA 加密就够了" | ❌ 还需代码签名防篡改+防回滚机制，三者缺一不可 |
| "IVI 直连 CAN 没问题" | ❌ IVI 是最大攻击面之一，必须通过网关隔离，只允许白名单消息 |
| "HSM 是可选的" | ❌ 关键 ECU 必须部署 HSM 做安全启动和密钥保护，EVITA 标准是行业基线 |

---

> **T-Box/IVI/OTA 是智能网联汽车的"三大命门"——一个被攻破，全车可能失控。安全设计必须从芯片级（HSM）做起。**
