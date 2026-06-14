# PLC/DCS 攻击技术与防御

> **📘 文档定位**：CISP 考试工控安全进阶内容 | 难度：⭐⭐⭐⭐ | 预计阅读：20 分钟
> PLC/DCS 是工业控制系统的核心执行单元。本文从攻击面分析、常见攻击手法到纵深防御策略，系统梳理 PLC/DCS 安全攻防要点。

---

## 导航目录
- [一、PLC 攻击面分析](#一plc-攻击面分析)

### 1.1 PLC 脆弱性全景

```
PLC（可编程逻辑控制器）攻击面：

1. 物理访问
   ├── 串口(RS-232/RS-485)调试接口
   ├── USB/存储卡接口
   ├── 以太网接口
   └── DIP开关（模式切换 RUN/STOP/PROG）

2. 网络协议
   ├── S7comm (西门子) — TCP端口102
   ├── Modbus TCP — TCP端口502
   ├── EtherNet/IP (罗克韦尔) — TCP/UDP 44818
   ├── Profinet (西门子) — 多种端口
   └── OPC/OPC-UA

3. 工程软件
   ├── TIA Portal (西门子)
   ├── RSLogix/Studio 5000 (罗克韦尔)
   ├── EcoStruxure Control Expert (施耐德)
   └── 工程站入侵 → PLC访问

4. 固件
   ├── 固件更新未签名验证
   ├── 固件回滚到漏洞版本
   └── 隐藏功能/后门

5. 逻辑与数据
   ├── 梯形图逻辑篡改
   ├── 数据块/寄存器篡改
   └── 变量表符号攻击
```

### 1.2 PLC 运行周期

```
PLC 扫描周期(Scan Cycle):
  1. 读取输入 (Read Inputs)        → 获取传感器状态
  2. 执行程序 (Execute Program)    → 运行梯形图/结构化文本
  3. 诊断检查 (Diagnostics)        → 自诊断
  4. 写入输出 (Write Outputs)       → 控制执行器
  5. 通信处理 (Communication)       → 处理HMI/SCADA请求

攻击窗口：
  在步骤2-3之间篡改数据 → 影响物理过程
  修改步骤1/4的映射 → I/O欺骗
```

---

## 二、S7comm 协议安全

### 2.1 S7comm 协议结构

```
西门子 S7comm (S7 Communication) 协议：

S7comm-PLUS (新版, S7-1200/1500):
  - 加密认证(部分)
  - 反重放保护(序列号)

S7comm (旧版, S7-300/400): 
  - 明文传输
  - 无认证
  - 无完整性校验
  
攻击者在网络可达条件下可以：
  ✓ 读取CPU状态 (RUN/STOP)
  ✓ 读取/写入数据块(DB)
  ✓ 读取/写入内存
  ✓ 启动/停止CPU
  ✓ 下载固件/程序

关键协议数据单元：
  - Job/ACK机制 (每个操作需要ACK确认)
  - Function Code: 0x00 CPU服务, 0x05 写入变量
```

### 2.2 S7comm 攻击演示

```python
# Snap7 库操作西门子PLC（仅授权测试）
import snap7
from snap7.util import get_bool, set_bool

# 连接PLC
client = snap7.client.Client()
client.connect('192.168.1.10', 0, 1)  # Rack 0, Slot 1

# 读取CPU状态
cpu_state = client.get_cpu_state()
print(f"CPU State: {cpu_state}")  # S7CpuStatusRun / S7CpuStatusStop

# 读取数据块
db_number = 1
data = client.db_read(db_number, 0, 100)  # DB1, offset 0, 100 bytes

# 写入数据块（篡改运行参数）
client.db_write(db_number, 0, malicious_data)

# 启动/停止CPU
client.plc_stop()    # ⚠️ 停止生产！
client.plc_cold_start()

client.disconnect()

# 防御措施：
# 1. 启用S7comm-PLUS（加密+认证）
# 2. 工程站到PLC之间的网络微隔离
# 3. Modbus/S7comm DPI检测异常操作
```

### 2.3 PLC 固件恶意修改

```
PLC Rootkit 概念（CrashOverride / Triton 使用）：

传统PLC恶意软件：修改梯形图逻辑 → 容易被发现
PLC Rootkit：修改PLC固件 → 极为隐蔽

Rootkit功能：
  1. 拦截读请求 → 返回虚假的正常逻辑
  2. 拦截写请求 → 表面上接受修改但实际不执行
  3. 真正的恶意逻辑在固件层执行 → 扫描周期内注入恶意操作
  4. 固件签名绕过 → 固件完整性校验失效

检测方法：
  1. 物理输出对比（HMI显示 vs 实际物理输出）
  2. 固件哈希校验（与厂商提供值对比）
  3. 扫描周期时间异常检测（Rootkit通常增加扫描时间）
  4. 物理过程基线偏离检测
```

---

## 三、工控 IDS/IPS

### 3.1 Modbus DPI 示例

```
Modbus TCP 协议 DPI 检测点：

1. 功能码白名单
   允许：0x01(读线圈), 0x03(读保持寄存器), 0x04(读输入寄存器)
   告警：0x05(写单个线圈), 0x06(写单个寄存器), 0x0F(写多个线圈)
   阻断：0x08(诊断, 可能导致信息泄露)

2. 地址范围检查
   只允许访问已授权的寄存器地址范围
   例：PLC1 只允许 Modbus 地址 40001-40100
       访问 40101+ → 告警/阻断

3. 速率限制
   单个IP每秒不超过N个Modbus请求(异常扫描行为)

4. 协议违规检测
   - Transaction ID重用
   - 异常长的PDU
   - 非法功能码

# Zeek/Bro Modbus 分析器规则示例
# modbus.zeek
event modbus_write_single_register_request(c: connection, 
    headers: ModbusHeaders, address: count, value: count)
{
    if (address !in allowed_addresses[c$id$orig_h]) {
        NOTICE([$note=Modbus_Unauthorized_Write,
                $msg=fmt("Unauthorized Modbus write to address %d", address),
                $conn=c]);
    }
}
```

### 3.2 物理过程IDS

```
传统网络IDS只能检测异常流量，不能检测物理过程异常。

物理过程IDS原理：
  1. 建立正常工作状态模型(温度/压力/流量/转速等)
  2. 实时监测物理变量是否偏离模型预期
  3. 结合网络事件判断是否遭受攻击

示例：
  阀门X正常压力: 3.2 - 3.8 bar
  当前显示: 3.5 bar → 正常
  同时网络检测到: s7comm.write(ValveX_Register, 0) → 攻击！
  → 虽然网络层发现了写入操作，物理过程IDS提供第二层验证
```

---

## 四、Checklist

- [ ] PLC固件版本盘点(含S7comm/S7comm-PLUS)
- [ ] PLC通信网络VLAN隔离（每个生产区域独立VLAN）
- [ ] 启用PLC认证机制（S7comm-PLUS / OPC-UA Secure）
- [ ] 工控协议DPI部署（Modbus/S7comm/EtherNet/IP）
- [ ] 物理访问管控（机柜锁+USB端口禁用）
- [ ] 工程站应用白名单+集中管理
- [ ] PLC程序定期哈希校验
- [ ] PLC固件完整性校验（与厂商提供HASH对比）
- [ ] 物理过程基线建立与异常检测
- [ ] PLC STOP/RUN状态变更告警
- [ ] PLC固件/程序下载操作审计+审批

---

## 高分考点与知识巧记

> 🔑 **高分考点**：PLC 安全考点集中在攻击面识别、固件安全、梯形逻辑攻击。考试侧重理解 PLC 的脆弱性和防护措施。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| PLC 攻击面 | ⭐⭐⭐⭐ | 网络端口、工程软件、固件更新、物理接口 |
| 固件安全 | ⭐⭐⭐ | 签名验证、加密存储、安全启动 |
| 纵深防御 | ⭐⭐⭐ | 网络隔离+访问控制+审计监控 |

> 💡 **知识巧记**：PLC 四重防护记"网访固审"——网络隔离、访问控制、固件签名、操作审计。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| PLC 默认密码 | 多数 PLC 出厂无认证或弱口令 | "PLC 默认就安全" ❌ |
| 固件更新 | 需验证签名+离线环境测试 | "PLC 固件可在线直接更新" ❌ |

### 知识巧记口诀

> **PLC 安全口诀**：
> 四重防护网访固审，网络隔离第一关。
> 固件签名防篡改，操作审计全留痕。
