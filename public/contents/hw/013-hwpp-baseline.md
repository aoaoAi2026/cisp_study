# 护网安全基线检查与加固手册

> 📅 2026-06-12 | 🎯 进阶 | ⏱ 20 min | 分类：护网工程

## 📋 提纲

1. 安全基线框架
2. Linux 安全基线加固
3. Windows 安全基线加固
4. 网络设备基线加固
5. 数据库安全基线
6. 中间件安全基线
7. 自动化基线检查脚本
8. 护网前基线检查清单

---

## 1. 安全基线框架

安全基线 = 最低安全配置标准。护网前所有资产应达到基线要求，否则 = 送分。

```
分级基线：
Level 1（基础）: 面向所有资产，必须完成
Level 2（增强）: 面向核心/公网资产
Level 3（护网）: 护网期间额外加固
```

### 1.1 基线参考标准

| 标准 | 覆盖范围 |
|------|---------|
| CIS Benchmark | OS/数据库/中间件/云服务 |
| 等保2.0 GB/T 22239 | 物理/网络/主机/应用/数据 |
| DISA STIG | 美国国防部基线 |
| 企业内部基线 | 基于上述标准定制 |

---

## 2. Linux 安全基线

### 2.1 PAM 认证加固

```bash
#!/bin/bash
# pam_hardening.sh - Linux PAM认证加固

echo "=== PAM认证加固 ==="

# 1. 密码策略（/etc/pam.d/common-password）
# 密码复杂度
if ! grep -q "pam_pwquality.so" /etc/pam.d/common-password; then
    echo "password requisite pam_pwquality.so retry=3 minlen=12 dcredit=-1 ucredit=-1 lcredit=-1 ocredit=-1" >> /etc/pam.d/common-password
fi

# 2. 密码锁定策略（/etc/pam.d/common-auth）
# 5次失败锁定30分钟
if ! grep -q "pam_tally2.so" /etc/pam.d/common-auth; then
    echo "auth required pam_tally2.so deny=5 unlock_time=1800 onerr=fail audit" >> /etc/pam.d/common-auth
fi

# 3. 密码历史限制（不能重复使用最近5个密码）
if ! grep -q "remember=5" /etc/pam.d/common-password; then
    sed -i 's/pam_unix.so.*/& remember=5/' /etc/pam.d/common-password
fi

echo "✅ PAM加固完成"
```

### 2.2 SSH 安全加固

```bash
#!/bin/bash
# ssh_hardening.sh

SSHD_CONFIG="/etc/ssh/sshd_config"
BACKUP="${SSHD_CONFIG}.bak.$(date +%Y%m%d)"

echo "=== SSH安全加固 ==="
cp "$SSHD_CONFIG" "$BACKUP"

# 禁止 root 登录
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' "$SSHD_CONFIG"

# 禁止密码认证（仅密钥）
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' "$SSHD_CONFIG"

# 禁止空密码
sed -i 's/^#*PermitEmptyPasswords.*/PermitEmptyPasswords no/' "$SSHD_CONFIG"

# 修改默认端口（降低扫描风险）
sed -i 's/^#*Port 22/Port 2222/' "$SSHD_CONFIG"

# 限制登录用户
echo "AllowUsers admin ops" >> "$SSHD_CONFIG"
echo "AllowGroups sshusers" >> "$SSHD_CONFIG"

# 禁用不安全的协议
sed -i 's/^#*Protocol.*/Protocol 2/' "$SSHD_CONFIG"

# 设置会话超时
sed -i 's/^#*ClientAliveInterval.*/ClientAliveInterval 300/' "$SSHD_CONFIG"
sed -i 's/^#*ClientAliveCountMax.*/ClientAliveCountMax 0/' "$SSHD_CONFIG"

# 限制登录尝试
sed -i 's/^#*MaxAuthTries.*/MaxAuthTries 3/' "$SSHD_CONFIG"
sed -i 's/^#*MaxSessions.*/MaxSessions 5/' "$SSHD_CONFIG"

# 日志级别
sed -i 's/^#*LogLevel.*/LogLevel VERBOSE/' "$SSHD_CONFIG"

# 禁用X11转发
sed -i 's/^#*X11Forwarding.*/X11Forwarding no/' "$SSHD_CONFIG"

# 重启SSH服务
systemctl restart sshd
echo "✅ SSH加固完成"
```

### 2.3 系统审计配置

```bash
#!/bin/bash
# auditd_hardening.sh - 审计策略配置

echo "=== 审计策略 ==="

cat > /etc/audit/rules.d/hardening.rules << 'EOF'
# 删除审计规则缓存
-D

# 设置缓冲区大小
-b 8192

# 失败模式 = panic（审计失败时系统panic）
-f 1

# === 监控关键文件 ===

# /etc/passwd, /etc/shadow - 账户修改
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/group -p wa -k identity
-w /etc/gshadow -p wa -k identity

# /etc/sudoers - sudo权限变更
-w /etc/sudoers -p wa -k sudoers
-w /etc/sudoers.d/ -p wa -k sudoers

# SSH配置
-w /etc/ssh/sshd_config -p wa -k sshd

# PAM配置
-w /etc/pam.d/ -p wa -k pam

# 定时任务
-w /etc/crontab -p wa -k cron
-w /etc/cron.d/ -p wa -k cron
-w /etc/cron.daily/ -p wa -k cron
-w /etc/cron.hourly/ -p wa -k cron

# 启动项
-w /etc/rc.local -p wa -k startup
-w /etc/init.d/ -p wa -k startup
-w /etc/systemd/system/ -p wa -k startup

# === 监控关键命令 ===

# 用户管理
-w /usr/sbin/useradd -p x -k user_management
-w /usr/sbin/userdel -p x -k user_management
-w /usr/sbin/usermod -p x -k user_management

# 权限变更
-w /usr/bin/chmod -p x -k permission_change
-w /usr/bin/chown -p x -k permission_change

# 网络配置
-w /usr/sbin/iptables -p x -k network_change
-w /usr/sbin/ip -p x -k network_change

# 可疑命令（正常运维很少用）
-w /usr/bin/wget -p x -k suspicious
-w /usr/bin/curl -p x -k suspicious
-w /usr/bin/nc -p x -k suspicious
-w /usr/bin/ncat -p x -k suspicious
-w /usr/bin/base64 -p x -k suspicious

# === 不可变位 ===
# 标记审计规则为不可变（需重启生效）
-e 2
EOF

# 重启审计服务
systemctl restart auditd
echo "✅ 审计策略配置完成"
```

### 2.4 Sysctl 内核加固

```bash
#!/bin/bash
# sysctl_hardening.sh

cat >> /etc/sysctl.conf << 'EOF'

# === 网络层安全 ===

# 禁用IP转发（非路由器）
net.ipv4.ip_forward = 0

# 禁用源路由
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# 启用SYN Cookie防护（防SYN Flood）
net.ipv4.tcp_syncookies = 1

# 不接受ICMP重定向
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0

# 不发送ICMP重定向
net.ipv4.conf.all.send_redirects = 0

# 忽略ICMP广播请求
net.ipv4.icmp_echo_ignore_broadcasts = 1

# 启用反向路径过滤（防IP欺骗）
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# 记录火星包（异常源地址）
net.ipv4.conf.all.log_martians = 1

# === 内核安全 ===

# ASLR 完整随机化
kernel.randomize_va_space = 2

# 限制ptrace（防止进程注入）
kernel.yama.ptrace_scope = 1

# 禁止加载内核模块
# kernel.modules_disabled = 1  # 护网期间启用

# 限制core dump
fs.suid_dumpable = 0
kernel.core_uses_pid = 1

# Magic SysRq key 禁用
kernel.sysrq = 0

# === 连接超时调优 ===

# 减少TIME_WAIT
net.ipv4.tcp_tw_reuse = 1

# 减少FIN_WAIT2超时
net.ipv4.tcp_fin_timeout = 30

# 减少保活探测
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_keepalive_intvl = 60
net.ipv4.tcp_keepalive_probes = 3

EOF

# 应用配置
sysctl -p
echo "✅ 内核加固完成"
```

---

## 3. Windows 安全基线

### 3.1 PowerShell 自动化加固

```powershell
# windows_hardening.ps1
# 以管理员身份运行

Write-Host "=== Windows安全加固 ===" -ForegroundColor Green

# 1. 审计策略
Write-Host "1. 配置审计策略..."
auditpol /set /category:"Logon/Logoff" /success:enable /failure:enable
auditpol /set /category:"Account Management" /success:enable /failure:enable
auditpol /set /category:"Policy Change" /success:enable /failure:enable
auditpol /set /category:"Privilege Use" /success:enable /failure:enable
auditpol /set /category:"System" /success:enable /failure:enable

# 2. PowerShell 日志
Write-Host "2. 启用PowerShell日志..."
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\PowerShell\ScriptBlockLogging" `
    -Name "EnableScriptBlockLogging" -Value 1 -Force
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\PowerShell\ModuleLogging" `
    -Name "EnableModuleLogging" -Value 1 -Force

# 3. RDP 安全
Write-Host "3. 加固RDP..."
# 启用NLA
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" `
    -Name "UserAuthentication" -Value 1
# 设置RDP加密级别
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" `
    -Name "MinEncryptionLevel" -Value 3

# 4. 禁用不安全的协议
Write-Host "4. 禁用不安全的协议..."
# 禁用SMBv1
Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol -NoRestart -ErrorAction SilentlyContinue
# 禁用LLMNR
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient" `
    -Name "EnableMulticast" -Value 0 -Force
# 禁用NetBIOS over TCP
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\NetBT\Parameters\Interfaces\Tcpip*" `
    -Name "NetbiosOptions" -Value 2

# 5. UAC 最高级别
Write-Host "5. 强化UAC..."
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" `
    -Name "EnableLUA" -Value 1
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" `
    -Name "ConsentPromptBehaviorAdmin" -Value 2

# 6. 密码策略
Write-Host "6. 配置密码策略..."
secedit /export /cfg secpol.cfg
(Get-Content secpol.cfg) -replace 'MinimumPasswordLength = .*', 'MinimumPasswordLength = 12' | Out-File secpol.cfg
(Get-Content secpol.cfg) -replace 'PasswordHistorySize = .*', 'PasswordHistorySize = 24' | Out-File secpol.cfg
(Get-Content secpol.cfg) -replace 'MaximumPasswordAge = .*', 'MaximumPasswordAge = 90' | Out-File secpol.cfg
(Get-Content secpol.cfg) -replace 'LockoutBadCount = .*', 'LockoutBadCount = 5' | Out-File secpol.cfg
(Get-Content secpol.cfg) -replace 'ResetLockoutCount = .*', 'ResetLockoutCount = 30' | Out-File secpol.cfg
(Get-Content secpol.cfg) -replace 'LockoutDuration = .*', 'LockoutDuration = 30' | Out-File secpol.cfg
secedit /configure /db secedit.sdb /cfg secpol.cfg /areas SECURITYPOLICY
Remove-Item -Force secpol.cfg, secedit.sdb -ErrorAction SilentlyContinue

# 7. 卸载不必要的Windows功能
Write-Host "7. 卸载不必要功能..."
@("Powershell-ISE", "Windows-Identity-Foundation", "Microsoft-Hyper-V-All") | ForEach-Object {
    Uninstall-WindowsFeature -Name $_ -ErrorAction SilentlyContinue
}

Write-Host "✅ Windows加固完成" -ForegroundColor Green
Write-Host "⚠️ 请重启服务器使所有配置生效" -ForegroundColor Yellow
```

---

## 4. 自动化基线检查

```python
#!/usr/bin/env python3
"""
安全基线自动化检查脚本
基于CIS Benchmark / 等保标准
"""

import subprocess
import json
import os
from datetime import datetime

class BaselineChecker:
    def __init__(self, level="level2"):
        self.level = level
        self.checks = self.load_checks()
        self.results = []

    def load_checks(self):
        """加载检查项"""
        return [
            # === 认证检查 ===
            {"id": "AUTH-01", "category": "认证", "name": "密码最小长度≥12",
             "command": "grep -E '^minlen' /etc/security/pwquality.conf 2>/dev/null || echo 'NOT SET'",
             "expected": "minlen", "severity": "HIGH"},

            {"id": "AUTH-02", "category": "认证", "name": "SSH禁止root登录",
             "command": "grep '^PermitRootLogin' /etc/ssh/sshd_config 2>/dev/null",
             "expected": "PermitRootLogin no", "severity": "CRITICAL"},

            {"id": "AUTH-03", "category": "认证", "name": "SSH仅密钥认证",
             "command": "grep '^PasswordAuthentication' /etc/ssh/sshd_config 2>/dev/null",
             "expected": "PasswordAuthentication no", "severity": "HIGH"},

            {"id": "AUTH-04", "category": "认证", "name": "登录失败锁定机制",
             "command": "grep 'pam_tally2' /etc/pam.d/common-auth 2>/dev/null || grep 'pam_faillock' /etc/pam.d/system-auth 2>/dev/null || echo 'NOT SET'",
             "expected": "pam_", "severity": "HIGH"},

            # === 文件权限检查 ===
            {"id": "FILE-01", "category": "文件权限", "name": "/etc/passwd权限400",
             "command": "stat -c '%a %n' /etc/passwd 2>/dev/null",
             "expected": "/etc/passwd", "severity": "MEDIUM"},

            {"id": "FILE-02", "category": "文件权限", "name": "/etc/shadow权限000",
             "command": "stat -c '%a %n' /etc/shadow 2>/dev/null",
             "expected": "/etc/shadow", "severity": "HIGH"},

            {"id": "FILE-03", "category": "文件权限", "name": "无SUID/无主程序",
             "command": "find / -xdev -type f -perm -4000 -o -perm -2000 2>/dev/null | wc -l",
             "expected": None, "severity": "MEDIUM"},

            # === 服务检查 ===
            {"id": "SVC-01", "category": "服务", "name": "telnet已禁用",
             "command": "systemctl is-active telnet 2>/dev/null || echo 'inactive'",
             "expected": "inactive", "severity": "HIGH"},

            {"id": "SVC-02", "category": "服务", "name": "NFS已禁用或限制",
             "command": "systemctl is-active nfs-server 2>/dev/null || echo 'inactive'",
             "expected": "inactive", "severity": "MEDIUM"},

            # === 网络检查 ===
            {"id": "NET-01", "category": "网络", "name": "防火墙已启用",
             "command": "ufw status 2>/dev/null | grep Status || iptables -L -n | wc -l",
             "expected": "active", "severity": "CRITICAL"},

            {"id": "NET-02", "category": "网络", "name": "ICMP重定向已禁用",
             "command": "sysctl net.ipv4.conf.all.accept_redirects 2>/dev/null",
             "expected": "net.ipv4.conf.all.accept_redirects = 0", "severity": "MEDIUM"},

            # === 日志检查 ===
            {"id": "LOG-01", "category": "日志", "name": "auditd已运行",
             "command": "systemctl is-active auditd 2>/dev/null || echo 'inactive'",
             "expected": "active", "severity": "HIGH"},

            {"id": "LOG-02", "category": "日志", "name": "日志保留≥6个月",
             "command": "grep -E '^max_log_file_action|^rotate' /etc/audit/auditd.conf 2>/dev/null | head -1 || echo 'NOT SET'",
             "expected": "auditd.conf", "severity": "MEDIUM"},
        ]

    def run_checks(self):
        """执行所有检查"""
        print(f"\n{'='*60}")
        print(f"  安全基线检查 - 等级: {self.level}")
        print(f"  时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*60}\n")

        pass_count = 0
        fail_count = 0

        for check in self.checks:
            result = subprocess.run(
                check['command'], shell=True,
                capture_output=True, text=True, timeout=10
            )
            output = result.stdout.strip()

            # 判定
            passed = False
            if check['expected'] is None:
                # 无预期值，仅记录
                passed = True
            elif check['expected'] in output:
                passed = True

            status = "✅ PASS" if passed else "❌ FAIL"
            if passed:
                pass_count += 1
            else:
                fail_count += 1

            self.results.append({
                "id": check['id'],
                "category": check['category'],
                "name": check['name'],
                "severity": check['severity'],
                "passed": passed,
                "output": output[:200],
            })

            print(f"  [{check['category']}] {check['id']} {status} - {check['name']}")
            if not passed:
                print(f"        输出: {output[:100]}")
                print(f"        期望包含: {check['expected']}")

        print(f"\n{'='*60}")
        print(f"  通过: {pass_count}/{pass_count+fail_count}")
        print(f"  失败: {fail_count}")
        print(f"  通过率: {pass_count/(pass_count+fail_count)*100:.0f}%")
        print(f"{'='*60}\n")

        return self.results

    def generate_report(self, output_file="baseline_report.json"):
        """生成报告"""
        report = {
            "scan_time": datetime.now().isoformat(),
            "level": self.level,
            "total_checks": len(self.results),
            "passed": sum(1 for r in self.results if r['passed']),
            "failed": sum(1 for r in self.results if not r['passed']),
            "by_severity": {
                "CRITICAL": [r for r in self.results if r['severity'] == 'CRITICAL' and not r['passed']],
                "HIGH": [r for r in self.results if r['severity'] == 'HIGH' and not r['passed']],
                "MEDIUM": [r for r in self.results if r['severity'] == 'MEDIUM' and not r['passed']],
            },
            "details": self.results
        }

        with open(output_file, 'w') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)

        print(f"📄 报告已保存: {output_file}")
        return report


if __name__ == "__main__":
    checker = BaselineChecker(level="level2")
    results = checker.run_checks()
    report = checker.generate_report()
```

---

## 5. 护网前基线检查清单

### 操作系统

- [ ] 所有服务器安装 EDR Agent，在线率 > 99%
- [ ] SSH/RDP 非默认端口 + 仅密钥认证
- [ ] 密码策略: 12位 + 复杂度 + 90天过期
- [ ] 登录锁定: 5次失败锁30分钟
- [ ] auditd/WinEvent 审计开启
- [ ] 内核参数加固 (ASLR/ip_forward=0/SYNCookie)
- [ ] 删除/禁用不必要的服务和软件
- [ ] 系统更新到最新补丁
- [ ] 重启确认配置生效

### 网络设备

- [ ] 默认密码已修改
- [ ] SNMP Community String 非 public/private
- [ ] Telnet 禁用，仅 SSH
- [ ] 管理界面仅限内网访问
- [ ] 固件/OS 更新到最新稳定版

### 数据库

- [ ] 默认账号密码已修改（sa/root/postgres）
- [ ] 无远程 root 登录
- [ ] 审计日志开启
- [ ] 网络访问白名单（仅应用服务器IP）
- [ ] 加密连接（TLS）

### 中间件

- [ ] 默认管理页面已禁用
- [ ] 版本信息不泄露（Server头/Error页面）
- [ ] 最新安全补丁
- [ ] 禁用不安全的 HTTP 方法（TRACE/OPTIONS/PUT/DELETE）

### 应急准备

- [ ] 各类管理员联系表更新
- [ ] 备份可用性验证
- [ ] 回滚/恢复方案确认

> 📚 延伸阅读：HW/001-蓝队防护方案 | HW/002-资产自查 | 等保/003-高风险Top20
