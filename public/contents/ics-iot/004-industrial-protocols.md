# 工控协议安全分析：Modbus / DNP3 / OPC-UA

> **📘 文档定位**：CISP 考试工控安全技术内容 | 难度：⭐⭐⭐⭐ | 预计阅读：22 分钟
> Modbus/DNP3/OPC-UA 是工业控制领域三大核心协议。本文从协议原理、安全缺陷、攻击手段到防护加固，系统分析工控协议安全。

---

## 导航目录
- [一、三大协议概览](#一三大协议概览)

| 协议 | 应用领域 | 通信模式 | 传输层 | 安全特性 |
|------|---------|---------|--------|---------|
| **Modbus TCP** | 通用工业、楼宇控制 | 请求/响应 | TCP 502 | 无 |
| **DNP3** | 电力/水处理SCADA | 请求/响应+非请求 | TCP 20000 | DNP3-SA(安全认证) |
| **OPC-UA** | 跨平台工业集成 | 客户端/服务器+发布/订阅 | TCP 4840 | 内置安全模型 |

---

## 二、Modbus TCP 深度分析

### 2.1 协议结构

```
Modbus TCP 帧 (ADU = MBAP Header + PDU):

MBAP Header (7 bytes):
  Transaction ID (2B)  — 事务标识，请求与响应匹配
  Protocol ID    (2B)  — 固定 0x0000
  Length         (2B)  — 后续字节数
  Unit ID        (1B)  — 从站地址(网关场景)

PDU (功能码 + 数据):

常见功能码：
  0x01  Read Coils              (读取开关量输出)
  0x02  Read Discrete Inputs    (读取开关量输入)
  0x03  Read Holding Registers  (读取保持寄存器) ← 最常用
  0x04  Read Input Registers    (读取输入寄存器)
  0x05  Write Single Coil       (写单个线圈)
  0x06  Write Single Register   (写单个寄存器)
  0x0F  Write Multiple Coils    (写多个线圈)
  0x10  Write Multiple Registers(写多个寄存器)
  0x17  Read/Write Multiple Registers (读写组合)

危险功能码：
  0x05, 0x06, 0x0F, 0x10 — 写操作！
  0x08  Diagnostic — 信息泄露！
```

### 2.2 Modbus Wireshark 分析

```
Wireshark过滤器：
  modbus && ip.src == 192.168.1.100

典型的Modbus流量分析：
  0x03 读取保持寄存器 地址40001 长度10 → 
    → 正常：周期性读取（每秒）
    → 可疑：突发大量读取（扫描行为）

  0x10 写入多个寄存器 地址40020 长度5 →
    → 正常：设定值调整（如温度设定点）
    → 可疑：写入非预期地址（攻击者在篡改运行参数）

Write Storm 检测：
  每秒写入操作 >10次 (正常运维通常<1次/秒)
  → 可能是攻击者在快速修改大量寄存器
```

### 2.3 Modbus 安全增强

```
Modbus Security (草案) — 在Modbus TCP基础上增加TLS：
  - TCP端口改为 802 (modbus-security)
  - 强制TLS 1.2+加密
  - X.509证书认证（客户端+服务器双向认证）
  - 角色基于的访问控制 (RBAC)

过渡方案（现有设备通常不支持Modbus Security）：
  1. Modbus TCP → Modbus/TCP Gateway → Modbus Security上行
  2. 网段隔离：Modbus设备在独立VLAN，通过工业防火墙代理访问
  3. Modbus IPsec VPN隧道
```

---

## 三、DNP3 协议

### 3.1 协议特点

```
DNP3 (Distributed Network Protocol 3) — IEEE 1815标准

电力SCADA领域标准协议（北美及中国电力行业广泛使用）

关键特性：
  - 支持时间戳标记（事件序列SOE：Sequence of Events）
  - 非请求响应 (Unsolicited Response)：RTU主动上报告警
  - 数据分类：静态数据 / 事件数据 / 冻结数据
  - 支持数据质量标志 (Online/Restart/Overrange等)
  - 支持文件操作

DNP3-SA (Secure Authentication v5, IEEE 1815-2012)：
  - 基于挑战-响应机制
  - 使用HMAC-SHA256保护关键操作(写/配置/重启)
  - 不加密数据（仅认证），保持实时性
```

### 3.2 DNP3 安全实践

```
DNP3-SA 部署要点：
  1. 对所有写操作启用SA认证(Critical功能码)
  2. 配置Aggressive Mode：每个请求都挑战(安全性最高)
  3. 预置共享密钥(PSK) → 定期轮换
  4. SA会话定期重新认证

攻击面：
  - 非SA模式 → 可伪造任意DNP3操作
  - 重放攻击 → SA序列号机制防御
  - 中间人 → SA聚合MAC防御
```

---

## 四、OPC-UA 安全分析

### 4.1 OPC-UA 安全模型

```
OPC-UA (Unified Architecture) — IEC 62541

层次结构：
  OPC-UA Application Layer
    ↑ 安全通道 (Secure Channel) — 加密+签名
  OPC-UA Communication Stack — TCP / HTTPS / WebSocket

安全模式(Security Mode)：
  None          — 无安全（明文+无签名）
  Sign          — 仅签名（只验证完整性，不加密）
  SignAndEncrypt — 签名+加密（推荐）

安全策略(Security Policy)：
  None              — 不安全
  Basic128Rsa15     — 已废弃
  Basic256          — 已废弃
  Basic256Sha256    — 兼容
  Aes128Sha256RsaOaep — ★推荐
  Aes256Sha256RsaPss  — 最高安全

OPC-UA 安全要点：
  ✓ 应用层认证（X.509证书 + 用户名/密码/Kerberos）
  ✓ 安全通道加密（TLS级别）
  ✓ 审计日志（登录/登出/操作/配置变更）
  ✓ 用户/角色细粒度授权（哪个用户可以读哪个变量）
```

### 4.2 OPC-UA 证书管理

```
OPC-UA 证书体系：
  1. Application Instance Certificate (应用实例证书)
     标识OPC-UA服务器/客户端的身份
     必须由CA签名(或自签名但需手动信任)

  2. HTTPS/TLS 证书
     保护安全通道通信
     可与应用实例证书共用

证书信任管理：
  服务器：维护受信任客户端证书列表
  客户端：维护受信任服务器证书列表

首次连接 → 证书不受信任 → 管理员手动批准 → 加入信任列表

证书过期风险：
  OPC-UA应用拥有"自己的"证书 → 过期后通信完全中断
  需要：证书过期前 ≥30天自动提醒 + 自动/手动更新流程
```

---

## 五、协议模糊测试

```bash
# Boofuzz — 最流行的协议模糊测试框架
pip install boofuzz

# 工控协议模糊测试工具
# ISF (Industrial Security Framework)
# ISF专门针对工控协议的Fuzz工具

# Modbus TCP Fuzz 示例
# 使用boofuzz编写简单的Modbus Fuzz脚本
# 变异点：Transaction ID, Unit ID, 功能码, 数据长度, 数据体

# 目标：
# 1. 发现协议解析漏洞
# 2. 发现缓冲区溢出
# 3. 发现拒绝服务条件
# ⚠️ 仅在测试环境/授权渗透测试中使用！
```

```
模糊测试安全注意事项：
  - 禁止在对生产系统进行模糊测试（可能导致停机/设备损坏）
  - 在隔离的测试沙箱中进行
  - 使用硬件模拟器(类似西门子PLCSIM)或真实PLC测试台
  - 监控PLC故障指示灯和系统日志
  - 准备紧急恢复方案
```

---

## 六、Checklist

- [ ] 工控协议清单盘点（Modbus/DNP3/OPC-UA/S7comm/EtherNet/IP等）
- [ ] Modbus/OPC-UA端口安全（502/4840仅允许受信IP访问）
- [ ] DNP3-SA安全认证启用（关键写操作）
- [ ] OPC-UA启用 SignAndEncrypt + Aes256Sha256RsaPss
- [ ] OPC-UA证书生命周期管理
- [ ] 工控协议DPI/IDS规则覆盖
- [ ] 定期协议模糊测试（测试环境）
- [ ] 协议安全基线（允许的功能码/寄存器范围）
- [ ] 工控协议流量日志全量采集（≥90天）

---

## 高分考点与知识巧记

> 🔑 **高分考点**：工控协议安全考点集中在三大协议的对比、安全缺陷、防护方案。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| Modbus 安全 | ⭐⭐⭐⭐ | 无认证/无加密，地址码+功能码明文 |
| DNP3 安全 | ⭐⭐⭐ | 支持安全认证(SAv5/SAv6)，但多数未启用 |
| OPC-UA 安全 | ⭐⭐⭐⭐ | 内置安全模型，支持签名+加密+认证 |

> 💡 **知识巧记**：三协议安全记"Modbus 裸、DNP3 可选、OPC-UA 内置"——Modbus 无安全机制、DNP3 有安全认证但未普及、OPC-UA 原生安全。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| Modbus TCP | 502 端口，完全无安全机制 | "Modbus TCP 支持 TLS" ❌ |
| OPC-UA | 内置安全，推荐工控协议首选 | "OPC-UA 和 Modbus 安全级别相同" ❌ |

### 知识巧记口诀

> **工控协议安全口诀**：
> Modbus 裸奔无防护，DNP3 认证未普及。
> OPC-UA 安全内置，签名加密认证齐。
