# 蜜罐与欺骗防御实战

---

## 一、蜜罐类型选择

```
按交互深度：
  低交互：模拟服务端口响应(SSH/FTP/HTTP)，简单易部署
    → T-Pot, Honeyd, Cowrie
  
  中交互：模拟完整服务+有限操作系统
    → Cowrie SSH, Dionaea
  
  高交互：真实操作系统+真实服务
    → 高价值，但也高风险(被攻破后可能成为跳板)

按部署目的：
  外网蜜罐：吸引互联网攻击者
  内网蜜罐：检测横向移动，护网核心
  云蜜罐：检测云环境入侵
```

---

## 二、T-Pot 多蜜罐平台部署

```bash
# T-Pot = 20+蜜罐一体化平台 + ELK可视化
# https://github.com/telekom-security/tpotce

# 快速部署 (Ubuntu 22.04)
git clone https://github.com/telekom-security/tpotce
cd tpotce/iso/installer/
./install.sh --type=user

# 选择蜜罐类型：
# Standard: Cowrie/Dionaea/Elasticpot/Honeypy等
# 访问 https://<IP>:64297 查看攻击面板

# 内置蜜罐：
# Cowrie    — SSH/Telnet蜜罐
# Dionaea   — 捕获恶意软件样本(Windows服务)
# Elasticpot — Elasticsearch蜜罐
# Conpot     — ICS/SCADA蜜罐
# Honeytrap  — 蜜罐管理器(自动识别协议)
# Mailoney   — SMTP蜜罐
```

---

## 三、HFish 企业蜜罐

```bash
# HFish — 国产企业级蜜罐（免费社区版）
# https://hfish.net

# Docker 部署
docker run -d --name hfish \
  -p 4433:4433 -p 4434:4434 \
  -v /data/hfish:/usr/share/hfish \
  threatbook/hfish-server:latest

# 管理端：https://<IP>:4433/web

# 支持的蜜罐服务：
# SSH/SFTP/RDP/MySQL/Redis/HTTP/FTP/VNC/Elasticsearch/IoT
# 邮件蜜罐/OA门户蜜罐/VPN蜜罐
```

---

## 四、蜜罐策略设计

```
部署位置策略：
  外网：
    DMZ区部署1-2个SSH/HTTP蜜罐
    诱捕互联网扫描器
    
  内网：
    每子网部署1个蜜罐
    伪装为：文件服务器/数据库/打印机
    目的：检测横向移动 ← ★护网核心

  云上：
    VPC内每个子网1个蜜罐
    伪装为：K8s API/云数据库

诱饵设计：
  ✦ 名称伪装：命名与真实服务器相似
    (如真实为WEB-01, 蜜罐为WEB-03)
  ✦ 虚假凭证：蜜罐内置假密码/假AK/SK
  ✦ 假文件："员工薪酬.xlsx", "网络拓扑图.vsd"

隔离策略：
  ✦ 蜜罐独立VLAN
  ✦ 蜜罐出站流量 STRICT限制(防止成为跳板)
  ✦ 防火墙规则：不能访问真实业务网络
```

---

## 五、欺骗防御进阶

```
HoneyToken (蜜标)：
  在真实环境中埋入"诱饵"：
    ✦ Active Directory中创建假用户
    ✦ 文件服务器放"密码.txt"
    ✦ 数据库中建假表"admin_users"
    ✦ 代码仓库中放假AK/SK
  → 一旦被访问 → 高置信度攻击告警

欺骗防御平台：
  TrapX, Illusive Networks, Attivo (商业)
  Canarytokens (免费) — https://canarytokens.org
```

---

## 六、Checklist

- [ ] 外网蜜罐部署(T-Pot/HFish)
- [ ] 内网蜜罐部署(每关键子网≥1个)
- [ ] 蜜罐告警→SIEM联动
- [ ] 蜜罐VLAN隔离(防成为跳板)
- [ ] HoneyToken部署(AD假用户/数据库假表)
- [ ] 蜜罐维护(定期更新/日志轮转)
