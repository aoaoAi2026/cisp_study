# 等保三级安全区域边界与通信网络安全配置实战

> **📘 文档定位**：CISP 考试 等保测评 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 系统讲解等保三级安全区域边界与通信网络的安全配置要求，覆盖边界防护/访问控制/入侵防范/安全审计/通信加密等关键领域。

---

## 导航目录

- [一、安全区域边界要求](#一安全区域边界要求)
- [二、通信网络安全要求](#二通信网络安全要求)
- [三、边界防护设备配置](#三边界防护设备配置)
- [四、访问控制策略设计](#四访问控制策略设计)
- [五、入侵检测与防范](#五入侵检测与防范)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、安全区域边界要求

```
GB/T 22239-2019 8.1.3 安全区域边界（三级）：

8.1.3.1 边界防护
  → 区域边界部署访问控制设备（防火墙/网闸）
  → 划分安全区域（Internet区/DMZ区/应用区/数据区/管理区）

8.1.3.2 访问控制
  → 基于会话状态/应用协议的细粒度访问控制
  → 进出网络的数据流默认拒绝
  → 访问控制规则最小化

8.1.3.3 入侵防范
  → 在网络边界检测/防止/限制外部发起的攻击
  → 主动阻断（IPS入侵防御）

8.1.3.4 恶意代码防范
  → 网络边界检测和清除恶意代码

8.1.3.5 安全审计
  → 边界设备日志审计
```

---

## 二、防火墙策略配置

### 2.1 安全域划分

```
等保三级推荐网络架构：

  Internet
    │
  [外层防火墙]
    │
  ├── DMZ区 (Web/Nginx/反向代理) — VLAN 10
  │      │
  ├── [WAF] (Web应用防火墙)
  │      │
  └── [内层防火墙]
         │
         ├── 应用区 (APP/API/中间件) — VLAN 20
         ├── 数据区 (DB/Cache/MQ) — VLAN 30
         └── 管理区 (堡垒机/监控/日志) — VLAN 40

关键原则：
  Internet → DMZ: 仅HTTPS(443)
  DMZ → 应用区: 仅应用端口(8080等)
  应用区 → 数据区: 仅数据库端口(3306/5432等)
  管理区 → 各区域: 仅管理端口(SSH/RDP等)
  数据区 → Internet: 默认禁止(Deny All)
  服务器间通信: 按需放行（最小化）
```

### 2.2 iptables 策略示例

```bash
#!/bin/bash
# Linux iptables 等保三级防火墙策略

# 默认策略 - 拒绝所有
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# 允许本地回环
iptables -A INPUT -i lo -j ACCEPT

# 允许已建立的连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 允许管理区访问SSH
iptables -A INPUT -s 10.0.40.0/24 -p tcp --dport 22 -j ACCEPT

# 允许应用区访问数据库（MySQL）
iptables -A INPUT -s 10.0.20.0/24 -p tcp --dport 3306 -j ACCEPT

# 允许监控采集（SNMP/Zabbix Agent）
iptables -A INPUT -s 10.0.40.0/24 -p udp --dport 161 -j ACCEPT
iptables -A INPUT -s 10.0.40.0/24 -p tcp --dport 10050 -j ACCEPT

# 日志审计（Syslog接收）
iptables -A INPUT -s 10.0.40.0/24 -p tcp --dport 514 -j ACCEPT

# 记录被丢弃的包
iptables -A INPUT -j LOG --log-prefix "IPTABLES-DROP: "

# 持久化
iptables-save > /etc/sysconfig/iptables
```

### 2.3 Cisco/H3C 设备配置

```
! Cisco 防火墙策略示例

! 定义网络对象
object-group network DMZ
  network-object 10.0.10.0 255.255.255.0
object-group network APP
  network-object 10.0.20.0 255.255.255.0
object-group network DB
  network-object 10.0.30.0 255.255.255.0
object-group network MGMT
  network-object 10.0.40.0 255.255.255.0

! 定义服务对象
object-group service WEB-PORTS
  service-object tcp eq 80
  service-object tcp eq 443

! 访问控制列表
access-list OUTSIDE-IN extended permit tcp any object-group DMZ object-group WEB-PORTS
access-list OUTSIDE-IN extended deny ip any any log

access-list DMZ-APP extended permit tcp object-group DMZ object-group APP eq 8080
access-list DMZ-APP extended deny ip any any log

access-list APP-DB extended permit tcp object-group APP object-group DB eq 3306
access-list APP-DB extended deny ip any any log

! 应用ACL到接口
access-group OUTSIDE-IN in interface outside
```

---

## 三、IPS / IDS 部署

### 3.1 Suricata 开源IPS

```bash
# Ubuntu/Debian 安装 Suricata
apt install suricata -y

# 配置监控网卡
# /etc/suricata/suricata.yaml
# 修改: HOME_NET: "[10.0.0.0/8]"
# 修改: EXTERNAL_NET: "!$HOME_NET"
# af-packet: - interface: eth0

# 启用IPS模式 (NFQUEUE)
iptables -I FORWARD -j NFQUEUE --queue-num 0
suricata -c /etc/suricata/suricata.yaml -q 0

# 更新规则
suricata-update
suricata-update enable-source emerging-threats
suricata-update

# 检查规则命中
grep '"event_type":"alert"' /var/log/suricata/eve.json | tail -20
```

### 3.2 Snort 部署

```bash
# Snort 3.0 部署
apt install snort -y

# 配置
# /etc/snort/snort.lua
# HOME_NET = '10.0.0.0/8'
# EXTERNAL_NET = '!$HOME_NET'

# 测试配置
snort -c /etc/snort/snort.lua --daq-dir /usr/lib/daq -i eth0 -T

# 运行 IDS 模式
snort -c /etc/snort/snort.lua -i eth0 -A console
```

---

## 四、WAF 部署

### 4.1 ModSecurity + Nginx

```bash
# 编译 ModSecurity
git clone https://github.com/SpiderLabs/ModSecurity
cd ModSecurity
./configure && make && make install

# 编译 ModSecurity-nginx connector
git clone https://github.com/SpiderLabs/ModSecurity-nginx
# 重新编译 Nginx 加入 ModSecurity 模块

# Nginx 配置
# nginx.conf
load_module modules/ngx_http_modsecurity_module.so;

http {
    modsecurity on;
    modsecurity_rules_file /etc/nginx/modsec/main.conf;
    
    server {
        location / {
            proxy_pass http://backend;
        }
    }
}

# OWASP Core Rule Set (CRS)
git clone https://github.com/coreruleset/coreruleset
cp coreruleset/rules/*.conf /etc/nginx/modsec/rules/

# 等保要求:
# - SQL注入检测
# - XSS检测
# - 文件包含检测
# - 命令注入检测
# - 协议违规检测
```

### 4.2 WAF 策略要点

```
等保三级 WAF 必须配置的防护策略：

□ SQL注入防护 — 阻断SQL注入payload
□ XSS防护 — 阻断跨站脚本payload
□ 文件上传控制 — 限制上传文件类型/大小
□ 敏感信息泄露 — 阻断报错信息中的敏感内容
□ HTTP协议合规 — 阻止非标准HTTP请求
□ CC攻击防护 — 限制访问频率
□ 爬虫防护 — 阻止恶意爬虫
□ IP黑白名单 — 基于IP的访问控制

日志要求：
  WAF全量日志 → 发送到日志审计系统
  告警日志 → 实时通知安全管理员
```

---

## 五、通信网络安全

### 5.1 VPN 远程接入安全

```
等保要求：
  "应采用密码技术保证通信过程中数据的完整性、保密性"

远程运维接入方案：

方案A：SSL VPN
  ├── OpenVPN (开源)
  ├── WireGuard (开源，性能最优)
  └── 商业: 深信服SSL VPN/天融信VPN

方案B：IPsec VPN
  ├── StrongSwan (开源IPsec)
  └── 商业: 华为/华三IPsec VPN

安全要求：
  ✓ 双因素认证 (密码 + OTP/证书)
  ✓ 加密算法: AES-256-GCM (国际) / SM4-GCM (国密)
  ✓ 完整性: SHA-256 / SM3
  ✓ 日志记录: 连接/断开/流量/操作
```

### 5.2 WireGuard 配置示例

```bash
# 服务端
# /etc/wireguard/wg0.conf
[Interface]
PrivateKey = <server_private_key>
Address = 10.0.50.1/24
ListenPort = 51820

[Peer]
PublicKey = <client_public_key>
AllowedIPs = 10.0.50.2/32, 10.0.20.0/24  # 限制可访问的内网范围

# 客户端
[Interface]
PrivateKey = <client_private_key>
Address = 10.0.50.2/24

[Peer]
PublicKey = <server_public_key>
Endpoint = vpn.company.com:51820
AllowedIPs = 10.0.20.0/24  # 仅路由内网流量，不劫持全部流量
PersistentKeepalive = 25
```

---

## 六、网络安全审计

### 6.1 网络设备日志配置

```
! Cisco 设备 Syslog 配置
logging host 10.0.40.10 transport tcp port 514
logging trap informational
logging facility local7
service timestamps log datetime localtime

! 审计关键事件：
! - 管理员登录/登出
! - 配置变更
! - ACL命中/拒绝
! - 接口Up/Down
```

### 6.2 流量审计

```bash
# NetFlow / sFlow 流量采集
# nfdump 分析 NetFlow 数据
nfdump -R /var/netflow -s srcip -n 10  # Top 10 流量来源
nfdump -R /var/netflow -s dstport       # 最常用端口

# 异常检测：非工作时间大流量、异常端口访问、异常国家IP
```

---

## 七、Checklist

- [ ] 区域边界防火墙部署+策略配置
- [ ] 安全区域划分（DMZ/APP/DB/MGMT隔离）
- [ ] 访问控制规则最小化（默认拒绝）
- [ ] IDS/IPS部署(Suricata/Snort)
- [ ] WAF部署(ModSecurity/商业WAF)
- [ ] VPN远程接入双因素认证
- [ ] 通信加密（TLS/SSH/WireGuard）
- [ ] 网络设备日志→集中日志审计
- [ ] 流量异常检测基线
- [ ] 定期防火墙策略审计(≥季度)
