# 等保三级 Windows / Linux 安全计算环境加固清单

---

## 一、Windows Server 加固清单

### 1.1 身份鉴别

```powershell
# 1. 密码策略
secedit /export /cfg c:\secpol.cfg
# 密码长度最小值: 8位
# 密码最长使用期限: 90天
# 密码最短使用期限: 1天
# 强制密码历史: 5个记住
# 密码必须符合复杂性要求: 启用

# 一键配置
net accounts /minpwlen:8 /maxpwage:90 /minpwage:1 /uniquepw:5

# 2. 账户锁定策略
# 账户锁定阈值: 5次无效登录
# 账户锁定时间: 30分钟
# 重置锁定计数器: 30分钟
net accounts /lockoutthreshold:5 /lockoutduration:30 /lockoutwindow:30

# 3. 重命名Administrator (等保要求)
Rename-LocalUser -Name "Administrator" -NewName "SecAdmin"
# 禁用Guest账户
Disable-LocalUser -Name "Guest"

# 4. 屏幕保护密码保护 + 超时 (15分钟)
# gpedit.msc → 用户配置 → 管理模板 → 控制面板 → 个性化
# "启用屏幕保护程序" → 已启用
# "密码保护屏幕保护程序" → 已启用
# "屏幕保护程序超时" → 900秒
```

### 1.2 访问控制

```powershell
# 1. 关闭默认共享 (IPC$/ADMIN$/C$/D$)
# 注册表: HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters
# AutoShareServer = 0 (DWORD)
# AutoShareWks = 0 (DWORD)

# 2. 共享文件夹权限审查
Get-SmbShare | ForEach-Object {
    Write-Host "Share: $($_.Name)"
    Get-SmbShareAccess -Name $_.Name
}
# → 确保不存在Everyone可写的共享

# 3. 禁止空会话枚举
# HKLM\SYSTEM\CurrentControlSet\Control\Lsa
# RestrictAnonymous = 1
```

### 1.3 安全审计

```powershell
# 1. 启用高级审计策略
auditpol /set /category:"账户登录" /success:enable /failure:enable
auditpol /set /category:"账户管理" /success:enable /failure:enable
auditpol /set /category:"登录/注销" /success:enable /failure:enable
auditpol /set /category:"对象访问" /success:enable
auditpol /set /category:"策略更改" /success:enable
auditpol /set /category:"特权使用" /success:enable /failure:enable

# 2. 查看当前审计策略
auditpol /get /category:*

# 3. 设置日志大小 (安全日志 ≥ 1GB)
wevtutil sl Security /ms:1073741824
wevtutil sl System /ms:524288000
wevtutil sl Application /ms:524288000

# 4. 发送Windows事件日志到SIEM
# 使用 Winlogbeat 或 Windows Event Forwarding (WEF)
```

### 1.4 入侵防范

```powershell
# 1. 关闭不必要的服务
Stop-Service -Name "Telnet" -Force
Set-Service -Name "Telnet" -StartupType Disabled

Stop-Service -Name "RemoteRegistry" -Force  
Set-Service -Name "RemoteRegistry" -StartupType Disabled

# 2. 关闭自动播放
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\policies\Explorer" -Name "NoDriveTypeAutoRun" -Value 0xFF -Type DWord

# 3. 启用来宾账户限制
# HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters
# SmbServerNameHardeningLevel = 1

# 4. Windows Defender 状态检查
Get-MpComputerStatus | Select AntivirusEnabled, RealTimeProtectionEnabled

# 5. Windows Update 配置
# 至少配置为自动下载并通知安装
```

### 1.5 恶意代码防范

```powershell
# Windows Defender (或第三方EDR) 必须运行
# 病毒库更新: 每日自动
# 全盘扫描: ≥1次/周 (计划任务)

# 配置计划扫描任务
$Action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-Command "Start-MpScan -ScanType FullScan"'
$Trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 3am
Register-ScheduledTask -TaskName "WeeklyVirusScan" -Action $Action -Trigger $Trigger
```

---

## 二、Linux 加固清单

### 2.1 身份鉴别

```bash
# 1. 密码策略
# /etc/login.defs
PASS_MAX_DAYS   90      # 密码最长使用期限
PASS_MIN_DAYS   1       # 密码最短使用期限
PASS_MIN_LEN    8       # 最小长度
PASS_WARN_AGE   7       # 过期前7天警告

# 2. 密码复杂度
# /etc/security/pwquality.conf (RHEL/CentOS)
minlen = 8
minclass = 3            # 至少3类字符(大写/小写/数字/特殊)
maxrepeat = 3           # 最多连续重复3次

# 3. 登录失败锁定
# /etc/pam.d/system-auth 添加
auth required pam_faillock.so preauth silent audit deny=5 unlock_time=1800
auth required pam_faillock.so authfail audit deny=5 unlock_time=1800
# deny=5: 5次失败后锁定
# unlock_time=1800: 锁定30分钟

# 4. 禁止Root远程登录
sed -i 's/^#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl reload sshd

# 5. SSH超时
echo "ClientAliveInterval 300" >> /etc/ssh/sshd_config
echo "ClientAliveCountMax 0" >> /etc/ssh/sshd_config
# 300秒无操作 → 自动断开

# 6. Shell超时
echo "export TMOUT=900" >> /etc/profile  # 15分钟自动退出
```

### 2.2 安全审计

```bash
# 1. 安装并启动 auditd
yum install audit -y
systemctl enable auditd
systemctl start auditd

# 2. 等保三级审计规则
# /etc/audit/rules.d/audit.rules
# 监控关键文件访问
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/sudoers -p wa -k sudoers
-w /etc/ssh/sshd_config -p wa -k sshd_config

# 监控命令执行
-a always,exit -F arch=b64 -S execve -k command_exec

# 监控登录事件
-w /var/log/lastlog -p wa -k logins
-w /var/run/faillock -p wa -k logins

# 监控用户/组变更
-w /etc/group -p wa -k identity
-w /etc/gshadow -p wa -k identity

# 3. 加载规则
augenrules --load

# 4. 审计日志不可删除配置
# /etc/audit/auditd.conf
max_log_file = 100       # 单个日志文件最大100MB
num_logs = 20            # 保留20个轮转文件(约2GB)
space_left_action = email # 空间不足时发邮件告警
```

### 2.3 入侵防范

```bash
# 1. 关闭不必要的服务
systemctl disable telnet
systemctl disable rsh
systemctl disable rexec
systemctl disable tftp

# 2. 检查对外开放端口
ss -tlnp
# 仅保留业务必需的端口
# 关闭不必要的监听端口对应的服务

# 3. 防火墙规则
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
# → 白名单模式：仅开放必要端口

# 4. 检查SETUID文件
find / -perm /4000 -type f -ls 2>/dev/null
# 审查是否有异常的SUID文件（可能为后门）

# 5. 检查历史命令
cat /home/*/.bash_history | grep -E 'wget|curl|nc|bash -i'
```

### 2.4 恶意代码防范

```bash
# 安装 ClamAV (开源杀毒)
yum install clamav clamav-update -y
freshclam          # 更新病毒库
clamscan -r /home  # 扫描用户目录

# 配置定期扫描 (crontab)
# 0 3 * * 0 clamscan -r /home --log=/var/log/clamav/weekly.log
```

### 2.5 SELinux / AppArmor

```bash
# 确认SELinux启用 (Enforcing模式)
getenforce
# → Enforcing

# 如未启用：
sed -i 's/SELINUX=disabled/SELINUX=enforcing/' /etc/selinux/config
# → 需重启生效（修改前先测试业务是否兼容)

# Ubuntu: AppArmor
aa-status
```

---

## 三、数据库加固

```sql
-- MySQL 等保三级加固

-- 1. 删除匿名用户
DELETE FROM mysql.user WHERE User='';

-- 2. 禁止root远程登录
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');

-- 3. 开启审计日志
SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'TABLE';  -- 存入mysql.general_log表

-- 4. 密码复杂度插件
INSTALL PLUGIN validate_password SONAME 'validate_password.so';
SET GLOBAL validate_password.length = 8;
SET GLOBAL validate_password.policy = 'MEDIUM';

-- 5. 加密连接
-- my.cnf:
-- [mysqld]
-- require_secure_transport = ON
-- ssl_ca = /etc/mysql/certs/ca.pem
-- ssl_cert = /etc/mysql/certs/server-cert.pem
-- ssl_key = /etc/mysql/certs/server-key.pem

-- 6. 登录失败处理 (MySQL 8.0+)
ALTER USER 'appuser'@'%' FAILED_LOGIN_ATTEMPTS 5 PASSWORD_LOCK_TIME 30;

FLUSH PRIVILEGES;
```

---

## 四、Checklist

- [ ] 操作系统密码策略配置完成
- [ ] 账户锁定策略配置完成
- [ ] 审计日志开启(auditd/Advanced Audit)
- [ ] 防火墙规则最小化
- [ ] 不必要服务关闭
- [ ] SSH/RDP安全加固
- [ ] 杀毒软件安装+定期扫描
- [ ] 安全补丁更新
- [ ] SELinux/AppArmor启用
- [ ] 数据库审计+加密连接+登录锁定
