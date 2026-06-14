# IoT 设备安全与固件分析实战

> **📘 文档定位**：CISP 考试 IoT 安全核心内容 | 难度：⭐⭐⭐⭐ | 预计阅读：22 分钟
> IoT 设备安全涉及硬件、固件、通信、云端四层攻击面。本文从固件提取、漏洞分析到安全加固，系统梳理 IoT 设备安全攻防实战。

---

## 导航目录
- [一、IoT 攻击面全景](#一iot-攻击面全景)

```
IoT 设备攻击面（OWASP IoT Top 10 映射）：

  1. 弱口令/硬编码凭据
  2. 不安全的网络服务（Telnet/SSH/FTP暴露）
  3. 不安全的生态接口（云端API/移动APP/后端API）
  4. 缺乏安全更新机制
  5. 使用不安全的第三方组件
  6. 隐私保护不足
  7. 不安全的数据传输与存储
  8. 缺乏设备管理
  9. 不安全默认配置
  10. 缺乏物理加固
```

---

## 二、硬件接口攻击

### 2.1 常见调试接口

```
UART (通用异步收发器) — 最常用调试接口
  ├── 引脚定义：VCC, GND, TX, RX
  ├── 波特率常见：115200, 9600, 57600
  ├── 连接方式：USB-TTL转换器(CH340/CP2102/FT232)
  └── 获得：串口Shell → 查看引导日志 → 可能获得root权限

JTAG (联合测试行动组) — 芯片级调试接口
  ├── 引脚：TDI, TDO, TMS, TCK, TRST
  ├── 能力：读写内存/寄存器 → 提取固件 → 调试运行中程序
  └── 工具：JTAGulator(引脚识别), OpenOCD, J-Link

SPI/I2C Flash — 直接读取存储芯片
  ├── 工具：Flashrom, CH341A编程器
  ├── 夹子连接：无需焊接，直接夹住Flash芯片读取
  └── 获得：完整固件镜像
```

### 2.2 UART 连接示例

```bash
# 使用 minicom/screen 连接 UART
# 1. 识别引脚(万用表)
#    VCC = 3.3V/5V
#    GND = 0V
#    TX  = 电压波动(发送时)
#    RX  = 电压波动(接收时)

# 2. 连接USB-TTL
#    设备 TX → 转换器 RX
#    设备 RX → 转换器 TX
#    设备 GND → 转换器 GND
#    ⚠️ 不要连接 VCC！

# 3. 连接
screen /dev/ttyUSB0 115200

# 4. 观察引导日志
# 可能出现：
#   - U-Boot 提示 → 中断引导 → 获得U-Boot Shell
#   - 内核启动 → 自动登录 root shell
#   - Login: 提示 → 尝试弱口令 (root/admin/ubnt/默认密码)
```

---

## 三、固件分析工具链

### 3.1 固件提取

```bash
# 1. 从设备提取
# SPI Flash → CH341A + flashrom
flashrom -p ch341a_spi -r firmware.bin

# 2. 从厂商网站下载
# 厂商支持页面 → 固件升级包(.bin/.img/.zip)

# 3. 从OTA抓包获取
# 中间人代理抓取固件下载URL
```

### 3.2 Binwalk 固件解包

```bash
# 安装
sudo apt install binwalk

# 分析固件
binwalk firmware.bin

# 输出示例：
# DECIMAL    HEXADECIMAL  DESCRIPTION
# 0          0x0          uImage header
# 64         0x40         LZMA compressed data
# 1048576    0x100000     Squashfs filesystem

# 自动提取所有可识别内容
binwalk -e firmware.bin
# 自动解压到 _firmware.bin.extracted/ 目录

# 提取指定偏移
binwalk -D 'squashfs:raw' -e firmware.bin

# 递归提取
binwalk -Me firmware.bin
```

### 3.3 固件分析框架

```bash
# FACT (Firmware Analysis and Comparison Tool)
# 自动化固件分析平台
git clone https://github.com/fkie-cad/FACT_core.git
docker-compose up

# firmware-mod-kit (FMK)
# 解包+修改+重新打包固件
git clone https://github.com/rampageX/firmware-mod-kit.git

# EMBA (Embedded Analyzer)
# 全面的嵌入式固件安全分析
git clone https://github.com/e-m-b-a/emba.git
sudo ./emba -f firmware.bin -l ./emba_logs

# EMBA 自动检查清单：
# - 弱口令检测
# - 硬编码密钥/凭据
# - 已知CVE (版本对比)
# - 不安全配置（telnet/ftp/无密码root）
# - 后门/调试服务
# - 二进制加固 (NX/PIE/Stack Canary/RELRO)
```

### 3.4 静态分析实战

```bash
# 1. 寻找硬编码凭据
grep -rni "password" ./_firmware.extracted/
grep -rni "secret" ./_firmware.extracted/
grep -rni "api_key" ./_firmware.extracted/
grep -rni "BEGIN RSA PRIVATE KEY" ./_firmware.extracted/

# 2. 寻找启动脚本中的漏洞
cat etc/init.d/*
cat etc/rc.d/*
# 关注：启动时执行的命令，是否使用不安全的文件权限

# 3. 分析二进制文件
file bin/busybox
readelf -a bin/busybox
# 检查编译选项安全：
# RELRO:  Full   ✓ (GOT保护)
# Stack:  Canary ✓ (栈溢出检测)
# NX:     Enable ✓ (数据段不可执行)
# PIE:    Enable ✓ (地址随机化)

# 4. 查找脆弱服务
grep -r "telnetd" ./etc/
grep -r "ftpd" ./etc/
# 是否开启了Telnet/FTP？是否需要密码？默认密码是什么？
```

---

## 四、IoT 安全标准

### 4.1 ETSI EN 303 645

```
ETSI EN 303 645 — 消费级IoT产品网络安全标准
(欧盟，也是全球首个消费IoT安全标准)

13条核心要求：
  1. 无通用默认密码 (每个设备唯一密码)
  2. 漏洞披露管理 (厂商需提供报告渠道)
  3. 软件更新保障 (明确更新策略和期限)
  4. 安全存储敏感安全参数 (HSM/TEE)
  5. 安全通信 (加密+证书)
  6. 最小暴露攻击面 (关闭不需要的服务)
  7. 软件完整性 (安全启动链)
  8. 个人数据保护
  9. 系统弹性 (正常运行+DoS抵抗)
  10. 检测通讯数据 (网络遥测)
  11. 用户数据删除 (工厂重置完全清除)
  12. 安装维护简便
  13. 验证输入数据
```

### 4.2 GB/T 37044 系列

```
GB/T 37044-2018: 物联网安全 基本安全要求
  ├── 感知层安全 (传感器/执行器)
  ├── 网络层安全 (传输加密)
  ├── 应用层安全 (认证/授权/审计)
  └── 数据安全 (存储加密/脱敏)

最新的物联网相关国标：
  GB/T 37044 系列
  GB/T 37024 物联网网关安全
  GB/T 36951 物联网感知终端安全
```

---

## 五、Checklist

- [ ] IoT设备资产盘点（品牌/型号/固件版本）
- [ ] 修改出厂默认密码（每设备唯一强密码）
- [ ] 关闭不需要的服务（Telnet/FTP/UPnP/调试接口）
- [ ] 网络隔离（IoT设备独立VLAN）
- [ ] 固件版本监控与更新
- [ ] IoT设备固件安全扫描（EMBA/FACT自动化）
- [ ] 硬编码凭据检测（固件中搜索）
- [ ] 通信加密（TLS/mTLS）
- [ ] IoT设备准入控制（NAC/802.1X）
- [ ] 供应商安全评估（采购前安全要求）
- [ ] IoT设备退役安全擦除

---

## 高分考点与知识巧记

> 🔑 **高分考点**：IoT 固件安全考点集中在固件提取方法、常见漏洞类型、安全加固措施。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| 固件提取 | ⭐⭐⭐⭐ | UART/JTAG/SPI Flash 读取/网络下载 |
| 固件分析 | ⭐⭐⭐ | binwalk 解包、静态分析、动态模拟(FIRMADYNE) |
| 常见漏洞 | ⭐⭐⭐⭐ | 硬编码密钥、未加密通信、弱口令、调试接口未关闭 |

> 💡 **知识巧记**：固件分析三步记"提解分"——提取固件、解包分析、漏洞挖掘。IoT 安全四层记"硬固通云"——硬件、固件、通信、云端。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| UART/JTAG | 调试接口是固件提取的常见入口 | "关闭串口即可防提取" ❌ |
| 硬编码密钥 | IoT 设备最常见漏洞之一 | "固件加密就安全" ❌ |

### 知识巧记口诀

> **IoT 固件安全口诀**：
> 硬固通云四层防，UART JTAG 提取忙。
> binwalk 解包找密钥，硬编码漏洞最常见。
