# 蜜罐部署实战：HFish / T-Pot 选型与部署

> **📘 文档定位**：CISP 考试 护网行动 核心 | 难度：⭐⭐⭐ | 预计阅读：25 分钟
>
> 系统讲解护网中蜜罐的部署策略与实战，覆盖 HFish/T-Pot 选型对比、部署配置、诱饵设计及反制溯源技巧。

---

## 导航目录

- [一、蜜罐技术概述](#一蜜罐技术概述)
- [二、HFish 部署实战](#二hfish-部署实战)
- [三、T-Pot 部署实战](#三t-pot-部署实战)
- [四、诱饵设计与布置](#四诱饵设计与布置)
- [五、反制与溯源](#五反制与溯源)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 📋 目录

1. [蜜罐类型选择](#一蜜罐类型)
2. [T-Pot 多蜜罐平台](#二t-pot)
3. [HFish 企业级蜜罐](#三hfish)
4. [蜜罐策略设计](#四策略设计)
5. [蜜罐告警联动 SIEM](#五告警联动)
6. [HoneyToken 欺骗防御](#六honeytoken)
7. [完整案例：护网发现内网横向](#七完整案例)

---

## 一、蜜罐类型

```
低交互蜜罐:
  模拟服务端口响应 (SSH/FTP/HTTP 等)
  优势: 部署简单、无风险
  劣势: 容易被识破
  代表: Cowrie(SSH)、Dionaea(恶意软件捕获)

中交互蜜罐:
  模拟完整服务 + 部分操作系统
  优势: 可捕获更多攻击行为
  代表: Cowrie(增强版)

高交互蜜罐:
  真实操作系统 + 真实服务
  优势: 完全不会被识破
  劣势: 被攻破后可能成为跳板 → 需严格隔离
```

---

## 二、T-Pot

```bash
# T-Pot = 20+蜜罐一体化 + ELK可视化
# GitHub: https://github.com/telekom-security/tpotce

# 快速部署
git clone https://github.com/telekom-security/tpotce
cd tpotce/iso/installer/
./install.sh --type=user

# 访问: https://<IP>:64297 (管理面板)
# 默认: 首次登录设置密码

# 内置蜜罐:
# Cowrie:       SSH/Telnet蜜罐 → 捕获爆破、命令执行
# Dionaea:      捕获恶意软件样本 → 自动提交到VirusTotal
# Elasticpot:   Elasticsearch蜜罐
# Conpot:       ICS/SCADA蜜罐(工业协议)
# Honeytrap:    智能蜜罐 → 自动识别协议
# Mailoney:     SMTP蜜罐
# RDPY:         RDP蜜罐

# 查看攻击面板:
# https://<IP>:64297 → Kibana → T-Pot Dashboard
# → 实时攻击地图 → 攻击者IP/国家/攻击类型
```

---

## 三、HFish

```bash
# HFish = 国产企业级蜜罐 (免费社区版)
# https://hfish.net

# Docker 部署
docker run -d --name hfish \
  -p 4433:4433 -p 4434:4434 \
  -v /data/hfish:/usr/share/hfish \
  threatbook/hfish-server:latest

# 管理端: https://<IP>:4433/web
# 首次: admin / admin (强制改密码)

# 支持的蜜罐服务:
# SSH/SFTP/RDP/MySQL/Redis/HTTP/FTP/VNC/Elasticsearch
# 邮件蜜罐/OA门户蜜罐/VPN蜜罐
# 自定义Web蜜罐(克隆企业登录页)
```

### HFish 部署实战

```bash
# 1. 部署管理端
docker-compose up -d

# 2. 添加蜜罐节点
# Web UI → 节点管理 → 添加节点
# 选择要部署的服务
✓ SSH蜜罐 (端口 22) → 检测SSH爆破
✓ MySQL蜜罐 (端口 3306) → 检测数据库攻击
✓ Redis蜜罐 (端口 6379) → 检测未授权访问
✓ HTTP蜜罐 (端口 8080) → 检测Web扫描
✓ RDP蜜罐 (端口 3389) → 检测RDP爆破

# 3. 启动节点
# 节点上安装agent → 自动连接管理端

# 4. 查看效果
# 攻击列表 → 实时查看攻击者IP/工具/行为
# 攻击地图 → 可视化
```

---

## 四、策略设计

```
部署位置策略:

外网 (DMZ):
  部署 1-2 个 SSH/HTTP 蜜罐
  目的: 捕获互联网扫描器 → 早期预警

内网 (每个关键子网):
  每个/24子网部署 1 个蜜罐
  伪装: 文件服务器/数据库/打印机
  目的: 检测横向移动 ← ★护网核心!

云上 (每个VPC):
  伪装: K8s API/数据库/S3端点

隔离策略:
  ✓ 蜜罐独立 VLAN
  ✓ 蜜罐出站流量严格限制(防止成为跳板!)
  ✓ 防火墙: 蜜罐不能访问真实业务网络
  ✓ 蜜罐告警 → 即时通知SOC

诱饵设计:
  ✦ 名称伪装: 与真实服务器命名相似
    真实: DB-PROD-01 → 蜜罐: DB-PROD-03
  ✦ 假凭证: 内置弱口令
    admin/admin123 → 诱导攻击者尝试
  ✦ 假文件: "员工薪资.xlsx"、"网络拓扑.vsd"
    → 诱导攻击者下载
  ✦ 假AK/SK (AWS/阿里云)
    → 追踪攻击者的云资源探测
```

---

## 五、告警联动

```python
# HFish Webhook → SIEM / 企业微信

# HFish 配置 → 告警通知 → Webhook URL
WEBHOOK_URL = "https://hooks/siem"

import requests, json

def send_to_siem(alert):
    """将蜜罐告警发送到 SIEM"""
    event = {
        "@timestamp": alert['time'],
        "event.category": "honeypot",
        "event.type": alert['type'],         # ssh_login/redis_cmd/http_scan
        "source.ip": alert['attacker_ip'],
        "source.port": alert['attacker_port'],
        "destination.ip": alert['honeypot_ip'],
        "destination.port": alert['honeypot_port'],
        "honeypot.service": alert['service'],
        "honeypot.payload": alert['payload'][:500],  # 攻击payload
    }
    requests.post(WEBHOOK_URL, json=event)

# 企业微信通知
def send_wechat(msg):
    requests.post("https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=XXX",
        json={"msgtype":"text","text":{"content":msg}})

# 高价值告警 → 即时通知
if alert['type'] == 'redis_cmd' and 'config set dir' in alert['payload']:
    send_wechat(f"⚠️ Redis攻击! IP:{alert['attacker_ip']}")
```

---

## 六、HoneyToken

```
HoneyToken (蜜标) = 在真实环境中埋入"诱饵"

类型:
  ✦ AD假用户 → 域内创建假用户账户
    → 一旦登录 → 高置信度攻击告警
  ✦ 数据库假表 → 创建 admin_users 假表
    → 一旦访问 → SQL注入/data dump被触发
  ✦ 文件假凭证 → 文件服务器放"密码.txt"
    → 一旦打开 → 内网文件扫描被触发
  ✦ 代码假AK/SK → 代码仓库放假密钥
    → 一旦使用 → CloudTrail告警

实施:
  AD假用户:
    New-ADUser -Name "svc_backup_test" -SamAccountName "svc_backup_test"
    → 账号监控: 一旦登录 → SIEM告警

  文件:
    echo "password: fake_admin_2026" > /shared/IT/密码.txt
    → 使用 auditd 监控文件访问
```

---

## 七、完整案例

```
某金融企业护网 — 内网蜜罐发现横向移动

Day 5: 蜜罐告警
  HFish 告警: 内网主机 10.0.5.88 正在扫描蜜罐 22端口
  蜜罐IP: 10.0.5.100 (伪装为文件服务器)

分析:
  ① 攻击源: 10.0.5.88 (市场部工作站)
  ② 行为: SSH 爆破 + 登录尝试
     尝试账号: root/admin/oracle → 蜜罐接受并记录
  ③ 判定: 攻击者已入侵 10.0.5.88 → 正在内网横向!

响应:
  ✓ 立即隔离 10.0.5.88
  ✓ 排查: 发现该主机通过钓鱼邮件被控
  ✓ C2: 45.xxx.xxx.xxx (已封禁)
  ✓ 攻击者尚未成功横向到其他主机 (蜜罐是最先被扫描的!)

成果:
  ✦ 蜜罐成功发现横向移动 (其他安全产品未检测到扫描行为)
  ✦ 攻击者被限制在单台主机
  ✦ 护网加分: 主动发现 + 快速响应

教训:
  ✓ 蜜罐必须部署在每个关键子网
  ✓ 蜜罐告警 + SIEM 联动至关重要
```

---

## ✅ 蜜罐部署 Checklist

- [ ] 外网蜜罐部署(T-Pot/HFish)
- [ ] 内网每子网 ≥1 蜜罐
- [ ] 蜜罐 VLAN 隔离
- [ ] 蜜罐出站限制(防跳板)
- [ ] 蜜罐 → SIEM 告警联动
- [ ] 企业微信/钉钉即时通知
- [ ] HoneyToken 部署
- [ ] 蜜罐定期维护(更新蜜罐软件)
