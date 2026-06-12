# 等保三级高风险项 Top 20 深度整改指南

---

## 📋 目录

1. [高风险判定标准](#一判定标准)
2. [物理环境 (3项)](#二物理环境)
3. [通信网络 (3项)](#三通信网络)
4. [区域边界 (3项)](#四区域边界)
5. [计算环境 (7项) ★最核心](#五计算环境)
6. [管理中心 (2项)](#六管理中心)
7. [管理制度 (2项)](#七管理制度)
8. [完整整改实施计划](#八整改计划)

---

## 一、判定标准

```
高风险项 = 一票否决！不修复 = 测评肯定不通过

判定逻辑:
  ✦ 该控制点完全不满足
  ✦ 直接导致系统被轻易攻破
  ✦ 导致大量敏感数据可被窃取
  ✦ 导致核心业务中断

整改策略:
  高风险项 → 必须清零
  中风险项 → 尽量满足(影响最终得分)
  低风险项 → 可测评后持续改进
```

---

## 二、物理环境

### 高风险 1: 机房无限入控制

**场景**: 任何人可以自由进出机房，无可追溯记录

**整改方案**:
```
□ 安装电子门禁系统(刷卡+密码/PIN)
□ 门禁记录保存 ≥90天
□ 部署视频监控(保存≥90天录像)
□ 访客登记制度(申请表+陪同+记录)

低成本方案(预算<5000元):
  □ 安装指纹/密码门锁(如小米指纹锁企业版)
  □ 安装1-2个网络摄像头+NAS存储
  □ 纸质进出登记本(应急最低要求)
```

### 高风险 2: 无视频监控或保存不足

**整改**: 部署网络摄像头 + NVR/NAS 存储 ≥90天

---

## 三、通信网络

### 高风险 3: 远程运维无加密

**场景**: 管理员通过 Telnet(23) 明文远程登录服务器

**检测方法**:
```bash
# 检查是否开了Telnet
netstat -tlnp | grep :23
systemctl status telnet 2>/dev/null

# 检查SSH配置
grep "^Protocol" /etc/ssh/sshd_config  # 应该=2
grep "^PermitRootLogin" /etc/ssh/sshd_config  # 应该=no
```

**整改方案**:
```bash
# 1. 关闭 Telnet
systemctl stop telnet.socket 2>/dev/null
systemctl disable telnet.socket 2>/dev/null

# 2. 强化 SSH
cat >> /etc/ssh/sshd_config << 'EOF'
Protocol 2
PermitRootLogin no
PasswordAuthentication yes
MaxAuthTries 5
ClientAliveInterval 300
ClientAliveCountMax 0
EOF
systemctl reload sshd

# 3. 生产环境 → 增加堡垒机(mTLS)
# SSH密钥认证替代密码
# 或堡垒机通过SSH密钥连接到服务器
```

### 高风险 4: 核心数据库直接暴露公网

**检测**:
```bash
# 从外网扫描自己的公网IP
nmap -p 3306,5432,1433,27017,6379 <外网IP>

# 如果有任何返回 open → 需要整改!
```

**整改**:
```bash
# 1. 云安全组规则收紧
# 入站: 仅允许内网IP段访问3306

# 2. 自建IDC: 防火墙规则
iptables -A INPUT -p tcp --dport 3306 -s 10.0.0.0/8 -j ACCEPT
iptables -A INPUT -p tcp --dport 3306 -j DROP

# 3. 数据库配置
# MySQL: bind-address = 127.0.0.1 (仅监听本地)
# 应用 → 本地连接 → 不暴露网络端口
```

---

## 四、区域边界

### 高风险 5: 未部署边界防火墙 / 策略全放通

**检测**:
```bash
# 检查防火墙是否存在
iptables -L -n 2>/dev/null || echo "No iptables!"

# 如果策略是 ACCEPT all → 危险
iptables -L INPUT | head -5
# Chain INPUT (policy ACCEPT) → 全放通!
```

**整改**:
```bash
# 默认拒绝 → 按需放行
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# 放行业务端口
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -s 10.0.40.0/24 -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 持久化
iptables-save > /etc/iptables/rules.v4
```

---

## 五、计算环境 ★核心

### 高风险 6: 弱口令/默认口令

**场景**: root/123456, admin/admin123, sa/P@ssw0rd

**检测**:
```bash
# Linux 检查空密码
awk -F: '($2==""){print $1}' /etc/shadow

# 测试常见弱口令
hydra -l root -P top100.txt ssh://localhost
```

**整改**:
```bash
# 密码策略配置
sed -i 's/^PASS_MAX_DAYS.*/PASS_MAX_DAYS 90/' /etc/login.defs
sed -i 's/^PASS_MIN_DAYS.*/PASS_MIN_DAYS 1/' /etc/login.defs
sed -i 's/^PASS_MIN_LEN.*/PASS_MIN_LEN 12/' /etc/login.defs

# 密码复杂度(需要pam_pwquality)
# /etc/security/pwquality.conf
minlen = 12
minclass = 3  # 大写、小写、数字、符号 至少3类
maxrepeat = 3

# 强制修改弱口令用户的密码
passwd root  # 输入新密码: 至少12位+3类字符
passwd <user>
```

### 高风险 7: 登录失败无锁定

**检测**:
```bash
grep pam_faillock /etc/pam.d/system-auth
# 如果没有 → 可以暴力破解!
```

**整改**:
```bash
# /etc/pam.d/system-auth 添加:
auth required pam_faillock.so preauth silent audit deny=5 unlock_time=1800
auth required pam_faillock.so authfail audit deny=5 unlock_time=1800
account required pam_faillock.so
# deny=5: 5次失败后锁定
# unlock_time=1800: 锁定30分钟
```

### 高风险 8: 审计日志未开启 ★最常见高风险

**检测**:
```bash
# Linux
systemctl is-active auditd  # 应该是 active
ausearch -m USER_LOGIN | head  # 能查到记录

# Windows
auditpol /get /category:* | findstr "Success"
```

**整改**:
```bash
# Linux auditd
systemctl enable auditd && systemctl start auditd

# 等保三级审计规则
cat > /etc/audit/rules.d/djbh.rules << 'EOF'
-a always,exit -F arch=b64 -S execve -k exec
-a always,exit -F arch=b32 -S execve -k exec
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/sudoers -p wa -k sudoers
-w /etc/ssh/sshd_config -p wa -k sshd
-w /var/log/lastlog -p wa -k logins
EOF
augenrules --load

# 日志大小配置
# /etc/audit/auditd.conf
max_log_file = 100     # 最大100MB/文件
num_logs = 20          # 保留20个轮转
```

### 高风险 9: 日志留存不足6个月

**整改**: 日志集中到 SIEM / 日志审计系统 → 热数据30天 + 归档365天

### 高风险 10: 无防病毒软件

**检测**:
```bash
# Linux
which clamscan && freshclam --version  # 安装+病毒库更新

# Windows
Get-MpComputerStatus | Select AntivirusEnabled
```

**整改**:
```bash
# Linux
yum install -y clamav clamav-update
freshclam  # 更新病毒库
# 计划任务: 每周扫描
echo "0 3 * * 0 root clamscan -r /home" >> /etc/crontab

# Windows
# 确认 Windows Defender 开启
Set-MpPreference -DisableRealtimeMonitoring $false
```

### 高风险 11: 重要数据未加密存储

**检测**: 数据库中身份证/手机号/密码字段是否明文?

**整改**:
```php
// 应用层加密
$encrypted = openssl_encrypt($id_card, 'AES-256-CBC', $key, 0, $iv);
$decrypted = openssl_decrypt($encrypted, 'AES-256-CBC', $key, 0, $iv);

// 密码: bcrypt(不可逆)
$hash = password_hash($password, PASSWORD_BCRYPT);
```

### 高风险 12: 无备份/从不测试恢复

**整改**:
```
□ 核心数据库: 每日全量备份 + binlog实时
□ 文件服务器: 每日增量 + 每周全量
□ 备份异地存放(不同机房/云)
□ 每季度执行1次恢复演练(记录留存)
□ 备份数据加密(AES-256)
```

---

## 六、管理中心

### 高风险 13: 未部署堡垒机

**整改**: 部署堡垒机(开源: JumpServer/Teleport, 商业: 齐治/安恒)

### 高风险 14: 三员未分离

**整改**: 创建独立的系统管理员/安全管理员/审计管理员账户

---

## 七、管理制度

```
高风险 15: 无成文管理制度

必须的8大类文件:
□ 网络安全管理总纲
□ 密码安全管理制度
□ 访问控制管理制度
□ 备份与恢复管理制度
□ 应急管理制度(含预案)
□ 人员安全管理制度
□ 审计管理制度
□ 供应商安全管理制度
```

---

## 八、整改计划

```
Week 1: 紧急(0成本)
  □ 修改所有弱口令 ✓
  □ 开启审计日志 ✓
  □ 开启防火墙 ✓
  □ 安装杀毒软件 ✓

Week 2-3: 高优先级(低费用)
  □ 部署堡垒机
  □ 配置日志集中(SIEM)
  □ 加密敏感数据

Month 2: 中优先级
  □ 门禁系统
  □ 编写管理制度文件
  □ 备份系统验证

Month 3: 测评
  □ 自评
  □ 正式测评
```
