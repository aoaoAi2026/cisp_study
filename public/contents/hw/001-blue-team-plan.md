# HW行动（护网）蓝队防御实施方案

> **📘 文档定位**：CISP 考试 护网行动 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：30 分钟
>
> 系统讲解护网行动中蓝队防御的完整实施方案，覆盖防御体系搭建/监控策略/应急响应/溯源反制/复盘改进全流程。

---

## 导航目录

- [一、蓝队防御体系设计](#一蓝队防御体系设计)
- [二、资产梳理与攻击面收敛](#二资产梳理与攻击面收敛)
- [三、监控与检测策略](#三监控与检测策略)
- [四、应急响应流程](#四应急响应流程)
- [五、溯源与反制](#五溯源与反制)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 📋 目录

1. [HW 行动概述](#一hw-行动概述)
2. [蓝队组织架构](#二蓝队组织架构)
3. [战前准备（T-30天）](#三战前准备)
4. [资产梳理与风险自查](#四资产梳理与风险自查)
5. [网络纵深防御加固](#五网络纵深防御加固)
6. [主机安全加固](#六主机安全加固)
7. [应用与数据安全加固](#七应用与数据安全加固)
8. [监控与告警体系搭建](#八监控与告警体系)
9. [战时值守（7×24）](#九战时值守)
10. [应急响应 SOP](#十应急响应-sop)
11. [溯源反制](#十一溯源反制)
12. [战后复盘](#十二战后复盘)
13. [完整案例：某金融机构蓝队实战](#十三完整案例)
14. [排错与应急指南](#十四排错与应急指南)

---

## 一、HW 行动概述

### 1.1 什么是 HW

```
HW（护网行动）= 国家级网络安全实战演练

红队（攻击方）：
  由监管机构组织的专业安全团队
  模拟真实 APT 攻击
  目标：突破防御 → 获取核心系统/数据权限

蓝队（防守方）：
  企业自身的安全团队
  目标：阻止攻击 → 及时发现 → 快速响应 → 溯源反制

规则：
  ✦ 红队只能在规定时间窗口内攻击
  ✦ 红队不能用 DDoS / 物理入侵
  ✦ 蓝队被攻破核心系统 = 扣分
  ✦ 蓝队成功溯源反制 = 加分
```

### 1.2 蓝队核心目标

```
战术目标（短期）：
  □ 核心系统不沦陷
  □ 敏感数据不被窃取
  □ 攻击行为能被及时发现（<30分钟）
  □ 安全事件能快速响应（<1小时）

战略目标（长期）：
  □ 发现安全体系短板
  □ 建立常态化安全运营能力
  □ 提升安全团队实战能力
  □ 通过护网检验安全投资效果
```

---

## 二、蓝队组织架构

```
护网蓝队指挥部：

  ┌─────────────────────────────────┐
  │        总指挥（CSO/安全负责人）    │
  │  决策 + 资源协调 + 对外沟通        │
  └────────────┬────────────────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
┌───────┐ ┌───────┐ ┌───────┐
│监测组  │ │研判组  │ │处置组  │
│7×24   │ │Tier2  │ │Tier3  │
│告警监控│ │深度分析│ │应急响应│
│初步分流│ │攻击链  │ │系统恢复│
│P1速报 │ │还原    │ │策略调整│
└───────┘ └───────┘ └───────┘
    │          │          │
    └──────────┼──────────┘
               ▼
        ┌─────────────┐
        │  情报支撑组   │
        │  威胁情报     │
        │  工具开发     │
        │  日志保障     │
        └─────────────┘

人员配置（中型企业）：
  - 总指挥: 1人（CSO/安全总监）
  - 监测组: 4-6人（Tier1分析员，4班3运转）
  - 研判组: 2-3人（Tier2，日班+备班）
  - 处置组: 2-3人（Tier3，应急+加固）
  - 情报组: 1-2人
  - 共计: 10-15人
```

---

## 三、战前准备（T-30 天）

### 3.1 倒计时计划

```
T-30 天: 启动准备
  □ 成立蓝队指挥部
  □ 确定人员名单+排班表
  □ 盘点安全产品授权（确保未过期）
  □ 联系安全厂商获取护网专用支持

T-21 天: 资产与基线
  □ 全量资产盘点（IP/域名/端口/服务/组件）
  □ 关闭不必要的端口和服务
  □ 修改所有默认口令
  □ 收紧防火墙策略（默认拒绝→白名单放行）

T-14 天: 加固与扫描
  □ 全量漏洞扫描 → 修复高危漏洞
  □ 系统安全基线加固
  □ WAF/IPS规则更新+策略收紧
  □ 补丁更新（关键补丁）
  □ 弱口令全面排查

T-7 天: 监控与演练
  □ SIEM规则优化（护网专项规则上线）
  □ EDR策略从检测模式→阻断模式
  □ 蜜罐部署+测试
  □ 应急演练（至少1次桌面推演）

T-3 天: 冻结与验证
  □ 变更冻结（护网期间不再做变更）
  □ 最终安全检查扫描
  □ 备份验证（关键系统备份可恢复性确认）
  □ 应急联系方式核验

T-0 天: 开战
  □ 全员到岗 → 7×24 值守启动
  □ 告警规则确认
  □ 首次态势汇报
```

---

## 四、资产梳理与风险自查

### 4.1 资产全量清单

```bash
# ===== 1. 外网资产发现 =====
# 使用 FOFA/Shodan 搜索自身暴露面
# FOFA: domain="company.com" || cert="company.com"
# 对比自身资产清单 → 找出"影子资产"

# ===== 2. 端口扫描（内网）=====
nmap -sS -T4 -p- 10.0.0.0/16 -oA full_port_scan

# 找出对外开放的端口:
grep "open" full_port_scan.nmap | awk '{print $1,$3}' | sort -u

# ===== 3. Web 资产扫描 =====
# 子域名枚举
subfinder -d company.com -o subs.txt
# 存活检测
cat subs.txt | httpx -title -status-code -wc -o alive_web.txt

# ===== 4. 高危资产识别 =====
# 重点关注：
#  - 直接暴露出公网的管理后台
#  - 开放 22/3389/3306/6379 等端口的外网IP
#  - 存在已知漏洞的旧版本服务
```

### 4.2 风险自查清单

```
护网战前风险自查（高风险 = 不整改就危险）：

□ 外网暴露面
  ✦ 公网可访问的管理后台（/admin /manager /console）
  ✦ 公网开放的 SSH/RDP/数据库端口
  ✦ 测试环境暴露到公网
  → 行动：全部通过 VPN 访问，关闭不必要的公网端口

□ 弱口令
  ✦ 系统管理账户（admin / root / Administrator）
  ✦ 数据库账户（root / sa / postgres）
  ✦ 网络设备（admin / enable）
  → 行动：全量排查，强制修改 + 密码策略

□ 漏洞
  ✦ 高危漏洞（Critical + High）
  ✦ 已知在野利用的漏洞（CISA KEV 清单）
  → 行动：护网前必须全部修复

□ 配置问题
  ✦ 防火墙策略过于宽松（any to any）
  ✦ 未开启日志审计
  ✦ 未配置自动锁定策略
  → 行动：收紧配置，开启审计
```

---

## 五、网络纵深防御加固

### 5.1 边界防火墙策略

```bash
# 防火墙策略收紧（从默认允许 → 默认拒绝）

# 1. 外网入站 → 白名单
# 仅允许：HTTPS(443) → Web服务器
#          VPN端口 → VPN网关
#          CDN回源IP → Web服务器（如果用CDN）

# 2. DMZ → 内网 → 严格限制
# 仅允许：Web服务器(10.0.10.x) → 应用服务器(10.0.20.x):8080
#         应用服务器(10.0.20.x) → 数据库(10.0.30.x):3306

# 3. 内网 → 外网 → 限制出站
# 禁止服务器直接访问外网（需要更新→走WSUS/代理）
# 仅允许必要的出站（NTP/DNS/安全更新）

# iptables 示例（Linux 服务器出站限制）
iptables -A OUTPUT -d 10.0.0.0/8 -j ACCEPT    # 内网
iptables -A OUTPUT -d 192.168.0.0/16 -j ACCEPT
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT  # DNS
iptables -A OUTPUT -p udp --dport 123 -j ACCEPT # NTP
iptables -A OUTPUT -j DROP  # 其他出站全部拒绝
```

### 5.2 DNS 安全

```bash
# DNS 安全加固（防止 C2 通信 and DNS 隧道）

# 1. 服务器 DNS 配置强制指向内部 DNS
# /etc/resolv.conf
nameserver 10.0.1.10  # 内部 DNS
nameserver 10.0.1.11  # 内部 DNS 备

# 2. 边界防火墙限制 DNS 出站
# 仅允许内部 DNS 服务器(10.0.1.10-11)的 DNS 出站
# 拒绝其他所有主机的 53 端口出站

# 3. DNS 日志监控
# 配置 DNS 服务器记录所有查询日志
# Bind: 
#   logging { channel query_log { file "/var/log/named/queries.log"; }; 
#             category queries { query_log; }; };
```

---

## 六、主机安全加固

### 6.1 Windows 加固

```powershell
# === Windows 护网加固脚本 ===
# 以管理员权限运行

Write-Host "=== 护网 Windows 主机加固 ===" -ForegroundColor Yellow

# 1. 密码策略
net accounts /minpwlen:12 /maxpwage:90 /minpwage:1 /uniquepw:10
net accounts /lockoutthreshold:5 /lockoutduration:30 /lockoutwindow:30
Write-Host "[√] 密码策略已加固" -ForegroundColor Green

# 2. 禁用 Guest 账户
net user Guest /active:no
Write-Host "[√] Guest 已禁用" -ForegroundColor Green

# 3. 启用 Windows Defender 实时保护
Set-MpPreference -DisableRealtimeMonitoring $false
Write-Host "[√] Defender 实时保护已启用" -ForegroundColor Green

# 4. 启用高级审计策略
auditpol /set /category:"账户登录" /success:enable /failure:enable
auditpol /set /category:"账户管理" /success:enable /failure:enable
auditpol /set /category:"登录/注销" /success:enable /failure:enable
auditpol /set /category:"对象访问" /success:enable
auditpol /set /category:"策略更改" /success:enable
auditpol /set /category:"特权使用" /success:enable /failure:enable
Write-Host "[√] 高级审计策略已启用" -ForegroundColor Green

# 5. 启用 PowerShell 约束模式
# 护网期间可选: Set-ExecutionPolicy Restricted
# 或启用 PS ScriptBlock Logging:
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\PowerShell\ScriptBlockLogging" -Force
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\PowerShell\ScriptBlockLogging" -Name "EnableScriptBlockLogging" -Value 1
Write-Host "[√] PowerShell 日志已启用" -ForegroundColor Green

# 6. 关闭不必要的服务
$unwanted = @("Telnet", "RemoteRegistry", "SSDP Discovery", "UPnP Device Host")
foreach ($svc in $unwanted) {
    Stop-Service $svc -Force -ErrorAction SilentlyContinue
    Set-Service $svc -StartupType Disabled -ErrorAction SilentlyContinue
}
Write-Host "[√] 不必要服务已关闭" -ForegroundColor Green

# 7. RDP 安全
# 修改 RDP 端口（可选）
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" -Name "PortNumber" -Value 33891
# 启用 NLA（网络级认证）
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" -Name "UserAuthentication" -Value 1
Write-Host "[√] RDP 安全已加固" -ForegroundColor Green

Write-Host "`n=== 加固完成 ===" -ForegroundColor Green
```

### 6.2 Linux 加固

```bash
#!/bin/bash
# === Linux 护网加固脚本 ===
set -e

echo "=== 护网 Linux 主机加固 ==="

# 1. 密码策略
sed -i 's/^PASS_MAX_DAYS.*/PASS_MAX_DAYS 90/' /etc/login.defs
sed -i 's/^PASS_MIN_DAYS.*/PASS_MIN_DAYS 1/' /etc/login.defs
sed -i 's/^PASS_MIN_LEN.*/PASS_MIN_LEN 12/' /etc/login.defs
sed -i 's/^PASS_WARN_AGE.*/PASS_WARN_AGE 7/' /etc/login.defs
echo "[√] 密码策略已加固"

# 2. SSH 加固
cat >> /etc/ssh/sshd_config << 'EOF'
PermitRootLogin no
PasswordAuthentication yes
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 0
AllowUsers adminuser
EOF
systemctl reload sshd
echo "[√] SSH 已加固"

# 3. 审计日志
systemctl enable auditd && systemctl start auditd 2>/dev/null
cat > /etc/audit/rules.d/hw.rules << 'EOF'
-a always,exit -F arch=b64 -S execve -k exec
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/sudoers -p wa -k sudoers
-w /etc/ssh/sshd_config -p wa -k sshd
EOF
augenrules --load 2>/dev/null
echo "[√] 审计日志已启用"

# 4. 防火墙
if command -v firewall-cmd &>/dev/null; then
    firewall-cmd --permanent --remove-service=ftp
    firewall-cmd --permanent --remove-service=telnet
    firewall-cmd --reload
fi
echo "[√] 防火墙已加固"

# 5. 关闭不必要服务
for svc in telnet rsh rexec tftp vsftpd; do
    systemctl stop $svc 2>/dev/null
    systemctl disable $svc 2>/dev/null
done
echo "[√] 不必要服务已关闭"

# 6. 检查 SUID 文件
find / -perm -4000 -type f -ls 2>/dev/null > /var/log/suid_audit.log
echo "[√] SUID 审计完成"

# 7. 历史命令审计
echo 'export HISTTIMEFORMAT="%F %T "' >> /etc/profile
echo 'readonly HISTTIMEFORMAT' >> /etc/profile
echo "[√] 历史命令审计已配置"

echo -e "\n=== 加固完成 ==="
```

---

## 七、应用与数据安全加固

### 7.1 Web 应用加固

```nginx
# Nginx 安全配置
server {
    listen 443 ssl http2;
    server_name oa.company.com;

    # TLS 配置（仅允许 TLS 1.2+）
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self'" always;
    add_header Strict-Transport-Security "max-age=31536000" always;

    # 限制请求
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_conn_zone $binary_remote_addr zone=addr:10m;

    location / {
        limit_req zone=api burst=20 nodelay;
        limit_conn addr 10;
        proxy_pass http://backend:8080;
    }

    # 禁止访问敏感路径
    location ~ /\.(git|svn|env) { deny all; return 404; }
    location ~ /(phpinfo|info)\.php { deny all; return 404; }
    
    # 禁止 IP 直接访问（防止扫描器绕过域名）
    if ($host !~ ^(oa\.company\.com)$) {
        return 444;
    }
}
```

---

## 八、监控与告警体系

### 8.1 护网专项告警规则

```yaml
# Sigma 规则 — 护网专项检测
title: HW - Suspicious PowerShell Encoded Command
id: hw-001
status: experimental
description: 护网期间检测 PowerShell 编码执行
logsource:
  product: windows
  category: process_creation
detection:
  selection:
    Image|endswith: '\powershell.exe'
    CommandLine|contains|any:
      - '-EncodedCommand'
      - '-enc '
      - ' -e '
  condition: selection
level: critical
tags:
  - attack.execution
  - attack.t1059.001
---
title: HW - Cobalt Strike Beacon Detection
id: hw-002
description: 通过 JA3 指纹检测 Cobalt Strike Beacon
logsource:
  category: network_connection
detection:
  selection:
    Initiated: 'true'
    DestinationPort: 443
    # 检测 48小时以上的长连接
  timeframe: 48h
  condition: selection | count() by SourceIp > 1
level: high
---
title: HW - Lateral Movement via PsExec
id: hw-003
logsource:
  product: windows
  service: sysmon
detection:
  selection:
    EventID: 1
    Image|endswith: '\PsExec.exe'
  condition: selection
level: critical
```

---

## 九、战时值守

### 9.1 排班表

```
护网 7×24 排班表（14天示例）：

班次  时间        主值      备值      交接时间
─────────────────────────────────────────────
早班  08:00-14:00  张三      李四      13:45
中班  14:00-20:00  王五      赵六      19:45
前夜  20:00-02:00  钱七      孙八      01:45
后夜  02:00-08:00  周九      吴十      07:45

值班纪律：
  ✦ 提前15分钟到岗交接
  ✦ 值班期间不得离开监控屏幕超过5分钟
  ✦ 吃饭轮流（保证至少1人在监控屏前）
  ✦ 手机保持畅通（设置护网专用通知铃声）
  ✦ 禁止饮酒、禁止熬夜后疲劳值班
```

### 9.2 交接班记录

```markdown
# 护网交接班记录

日期：2026-06-16
班次：早班（08:00-14:00）
交班人：张三
接班人：王五

## 当班情况
- 告警总数：45条
- 已处理：42条
- 处理中：3条（详见案例 HW-2026-0616-003）
- 误报：15条
- 已封禁IP：3个

## 重要事件
- 10:23 发现疑似 SQL 注入攻击（IP: 8.8.8.8）→ 已封禁
- 11:45 蜜罐触发告警（内网 10.0.5.88 扫描蜜罐 22端口）→ 待接班人跟进

## 待办事项
- [ ] 跟进蜜罐告警 HW-2026-0616-003
- [ ] 更新 WAF 规则（新发现的攻击特征）

交班人签字：张三
接班人签字：王五
```

---

## 十、应急响应 SOP

### 10.1 四类核心事件响应

```
事件1: 外网Web入侵（Webshell/后门）
  ① 立即隔离受影响服务器（安全组拒绝所有入站）
  ② 取证保留（服务器快照/Web日志备份）
  ③ 排查Webshell（D盾/河马扫描）
  ④ 确定入侵路径（分析Web日志→找漏洞入口）
  ⑤ 修复漏洞+加固
  ⑥ 上报护网指挥部

事件2: 内网横向移动（发现异常内网连接）
  ① 确认攻击源IP和目标
  ② 隔离攻击源主机
  ③ 排查受影响范围（同一源IP还连了谁？）
  ④ 重置受影响凭据
  ⑤ 加强内网检测规则

事件3: 数据外泄
  ① 阻断外泄通道（防火墙封禁出站IP）
  ② 隔离外泄源主机
  ③ 评估外泄数据范围和量级
  ④ 通知法务+管理层
  ⑤ 证据固定（流量包+日志）

事件4: 勒索软件
  ① 立即物理断网（拔网线/防火墙隔离）
  ② 排查加密范围
  ③ 从备份恢复（如有）
  ④ 样本分析（判断勒索家族）
  ⑤ 全网排查加固
```

---

## 十一、溯源反制

```bash
# 溯源分析技术

# 1. 攻击IP分析
whois 攻击IP
curl https://ipinfo.io/攻击IP/json
# 获取：ASN、归属地、ISP 运营商

# 2. 恶意域名分析
# 查询域名注册信息
whois evil-domain.com
# 查询域名解析历史（DNSDB）
# 查询域名关联（VirusTotal）

# 3. 攻击者指纹收集
# Web日志中的 User-Agent、屏幕分辨率、语言等
# 蜜罐中记录的攻击者操作习惯（命令/工具/打字速度）
# 沙箱中获取的恶意软件样本特征

# 4. 反制技术（⚠️ 需法律授权！）
# - 蜜标文件嵌入追踪像素
# - 反向渗透（仅在有法律授权情况下）
# - Canarytoken 嵌入假凭证追踪攻击者
```

---

## 十二、战后复盘

```
护网结束后 1 周内完成复盘报告：

1. 整体评估
   - 防御成功率
   - 攻击发现平均时间
   - 核心系统是否沦陷

2. 攻击链分析
   - 红队使用的主要攻击路径
   - 被绕过的安全措施
   - 最有效的防御手段

3. 不足与改进
   - 技术短板（缺什么产品/能力）
   - 流程短板（响应慢/沟通不畅）
   - 人员短板（技能不足/排班不合理）

4. 行动计划
   - 短期（1-3月）：优先补齐短板
   - 中期（6月）：完善安全体系
   - 长期（1年）：安全能力建设
```

---

## 十三、完整案例：某金融蓝队实战

```
企业：某中型金融机构（员工3000人）
系统：核心交易+OA+邮件+网银
护网时长：14天

战前准备（T-30）：
  □ 资产清查 → 发现7个"影子资产"（已遗忘的测试系统暴露公网）
  □ 漏洞扫描 → 修复12个高危漏洞
  □ 弱口令排查 → 修改47个弱口令
  □ 安全加固 → 全量Windows/Linux执行加固脚本
  □ 蜜罐部署 → 部署8个内网蜜罐

战时（Day 1-14）：
  观测到攻击尝试：2371次
  成功拦截：2362次
  需响应的安全事件：9起
  
  关键事件：
    Day 3: 红队通过钓鱼邮件获取1个员工VPN密码
      → 蓝队30分钟内发现异常登录（凌晨3点+境外IP）
      → 立即禁用该账号+MFA挑战
      → 红队放弃该入口
    
    Day 7: 红队利用OA系统SQL注入尝试拖库
      → WAF+IPS自动阻断
      → 蓝队溯源攻击IP → 发现系红队VPS
      → 联系云服务商获取VPS注册信息 → 成功溯源（+分）
    
    Day 11: 红队尝试DNS隧道C2
      → DNS日志异常检测发现
      → 第一时间阻断+封禁解析域名

最终结果：蓝队成功防御，核心系统未沦陷，溯源+2分
```

---

## ✅ 蓝队防御 Checklist

**战前准备**
- [ ] 成立指挥部 + 排班表
- [ ] 资产全量盘点（外网+内网）
- [ ] 高危漏洞修复 + 补丁更新
- [ ] 弱口令全面排查
- [ ] 安全加固（OS/DB/网络设备）
- [ ] EDR/WAF/IPS策略收紧
- [ ] 蜜罐部署（内网+外网）
- [ ] 应急演练（≥1次桌面推演）

**战时值守**
- [ ] 7×24 双人值班
- [ ] SIEM/EDR 告警实时监控
- [ ] WAF 日志实时分析
- [ ] 每小时安全态势汇报
- [ ] 异常即时处置（15分钟内响应）

**战后闭环**
- [ ] 攻击事件复盘
- [ ] 防御有效性评估
- [ ] 安全短板清单
- [ ] 改进计划时间表
