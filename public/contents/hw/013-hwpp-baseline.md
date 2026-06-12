# 重要系统 HWPP 白名单与基线加固指南

**HWPP（Host Whitelist / Host-based Whitelist Policy，主机白名单策略）** 是护网中保护"核心主机"的终极防线之一：只允许被信任的进程 / 脚本 / 程序运行，其它任何东西（包括红队上传的 WebShell、木马、挖矿程序）都会被系统**拦截或阻断**。本文从**"主机白名单 + 应用白名单 + 服务端口白名单 + 账号权限最小化"**四个维度给出护网实战加固建议。

## 1. 什么是 HWPP / 主机白名单？

通俗来说，HWPP 就是：**这台机器上只能跑我允许它跑的东西**。具体实现通常有：

| 技术 | 用途 | 适用系统 |
|------|------|----------|
| **应用控制（AppLocker / WDAC）** | 基于路径 / 发布者 / 哈希的白名单 | Windows 专业版/企业版 |
| **软件限制策略（SRP）** | 早期 Windows 方案，功能有限 | 旧版 Windows |
| **SELinux / AppArmor** | Linux 内核级强制访问控制 | Linux（发行版自带） |
| **第三方 HIPS / EDR** | 主机入侵防护系统，自带白名单 | 跨平台（商用为主） |
| **自定义脚本白名单** | 用 auditd + bash wrapper | Linux，灵活但需维护 |

### 1.1 白名单 vs 黑名单

| 方式 | 优点 | 缺点 |
|------|------|------|
| 白名单（默认拒绝） | 安全性高，0day / 未知木马天然被拦截 | 维护成本高、上线前要充分测试 |
| 黑名单（默认允许） | 维护简单、对业务无冲击 | 只能防已知威胁，对新攻击无效 |

> **护网建议**：对**核心系统 / 关键服务器 / 数据库服务器**坚决采用**白名单策略**；对普通办公终端可保留黑名单模式。

## 2. Windows 主机白名单实施（AppLocker / WDAC）

### 2.1 应用程序白名单

```powershell
# 1) 准备阶段：在"干净"的目标主机上收集当前已安装程序路径
#    推荐使用 "默认规则 + 业务路径白名单" 的组合方案
$Paths = @(
    "C:\Windows\*",
    "C:\Program Files\*",
    "C:\Program Files (x86)\*",
    "D:\MyApp\bin\*",
    "D:\BizService\release\*"
)

# 2) 通过组策略（gpedit.msc）或 MDM / Intune 开启 AppLocker
#    - 可执行文件：默认允许 Windows/Program Files 下的文件；其它默认拒绝
#    - 脚本：默认允许已签名脚本；其它默认拒绝
#    - Windows Installer：允许签名和受信任发布者
#    - DLL 规则（影响较大，建议先在测试机开启）
#    - 封装应用（Packaged app）：允许系统自带

# 3) 收集业务应用哈希（路径白名单不可靠时，使用发布者/哈希）
Get-AppLockerFileInformation -Directory "D:\MyApp\bin" -FileType Exe, Script -Recurse
```

### 2.2 账号与登录加固

```powershell
# 禁止本地 Administrator 远程登录
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa" -Name "LimitBlankPasswordUse" -Type DWord -Value 1

# 配置：只允许"运维组 + 业务组"通过 RDP 登录
# 通过"本地安全策略 → 本地策略 → 用户权限分配 → 允许通过远程桌面服务登录"配置

# 审计：开启登录成功/失败审计（需在 secpol.msc 或 GPO 配置）
# auditpol /set /category:"Logon/Logoff" /failure:enable /success:enable
auditpol /set /subcategory:"Logon" /failure:enable /success:enable
```

### 2.3 Windows 服务 / 端口白名单

```text
Windows 防火墙（推荐以白名单方式配置）：

入站规则：
  允许：业务端口 TCP 443（来自 WAF / 负载均衡器地址段）
  允许：运维端口 TCP 22/3389（来自堡垒机地址段 + 需 MFA）
  允许：ICMP（来自运维监控地址段）
  默认：阻止其它所有入站

出站规则（更严格可选）：
  允许：访问 AD 域控 / DNS / NTP / 补丁服务器
  允许：访问业务依赖（数据库 / 消息队列 / 缓存）
  阻止：直接访问公网（有代理 / NAT 的情况下）
  默认：阻止其它所有出站
```

## 3. Linux 主机白名单实施（SELinux / AppArmor + auditd）

### 3.1 服务 / 端口白名单

```bash
# 使用 ufw 或 iptables/nftables 配置严格入站规则
ufw default deny incoming
ufw default allow outgoing

# 允许业务端口来自 WAF 地址段
ufw allow in from 10.0.1.0/24 to any port 443 proto tcp
ufw allow in from 10.0.1.0/24 to any port 80  proto tcp

# 允许 SSH 仅来自堡垒机
ufw allow in from 10.0.9.25/32 to any port 22 proto tcp

# 允许本地回环
ufw allow in on lo
ufw enable
```

### 3.2 SSH / 账号加固

```bash
# 1) 禁止 root 远程登录 + 禁止密码登录
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config
systemctl restart sshd

# 2) 仅允许运维组 SSH 登录（配合 AllowGroups 效果更好）
# echo "AllowGroups ops" >> /etc/ssh/sshd_config

# 3) 使用 fail2ban 封禁爆破源
apt-get install -y fail2ban
cat > /etc/fail2ban/jail.local <<EOF
[sshd]
enabled  = true
bantime  = 86400
findtime = 600
maxretry = 5
EOF
systemctl enable --now fail2ban
```

### 3.3 SELinux / AppArmor 强制模式

```bash
# CentOS/RHEL 建议：SELinux=enforcing
# 检查状态
getenforce

# 若当前为 Permissive，先在 Permissive 观察一段时间，收集 denials
# /var/log/audit/audit.log 或 dmesg 中可看到被拒绝的访问
# 确认没有业务被拦截后，再切换到 Enforcing
sed -i 's/SELINUX=permissive/SELINUX=enforcing/' /etc/selinux/config
# 重启生效（生产务必在维护窗口操作）

# Ubuntu/Debian 建议：AppArmor
systemctl status apparmor
aa-status  # 查看当前 enforce 的 profile
```

### 3.4 关键目录的执行权限限制

```bash
# 把上传目录 / 临时目录 / Web 根目录挂载为 noexec（如条件允许）
# /etc/fstab 示例：
# /dev/mapper/vg_tmp-lv_tmp  /tmp   ext4  defaults,noexec,nosuid,nodev  0 0
# /dev/mapper/vg_var-lv_var  /var   ext4  defaults,noexec,nosuid         0 2

# 对于 Tomcat / Nginx 上传目录：
# chown root:root /data/web/upload
# chmod 755 /data/web/upload
# mount --bind -o noexec,nosuid,nodev /data/web/upload /data/web/upload
```

## 4. 中间件 / 应用层面白名单

### 4.1 Nginx 接口白名单（护网常用）

```nginx
# /etc/nginx/conf.d/whitelist.conf
# 只允许内网网段访问管理接口

location /admin/ {
    allow 10.0.0.0/8;
    allow 172.16.0.0/12;
    allow 192.168.0.0/16;
    deny  all;

    proxy_pass http://backend_admin;
}

# 对外 API 限制方法 + Referer（简单有效）
location /api/ {
    if ($request_method !~ ^(GET|POST|HEAD|OPTIONS)$ ) { return 405; }
    proxy_pass http://backend_api;
}
```

### 4.2 数据库层面最小权限

```sql
-- 业务账号只允许指定 IP 访问 + 只能操作业务库 + 只有必要权限
CREATE USER 'biz_app'@'10.0.2.%' IDENTIFIED BY 'Strong-P@ss!';
GRANT SELECT, INSERT, UPDATE, DELETE ON biz_db.* TO 'biz_app'@'10.0.2.%';
FLUSH PRIVILEGES;

-- 限制 root 只能本地登录
-- UPDATE mysql.user SET Host='localhost' WHERE User='root';
-- FLUSH PRIVILEGES;

-- 审计：记录高风险操作（DROP / TRUNCATE / outfile / grant）
-- （依赖数据库审计插件或数据库审计系统）
```

## 5. 护网前 HWPP 上线的"正确姿势"

| 步骤 | 内容 | 时长建议 |
|------|------|----------|
| 1) 资产盘点 | 核心系统清单、依赖关系、访问链路 | 1 周 |
| 2) 业务行为采集 | 收集运行的进程、脚本、访问端口、对外依赖 | 1~2 周 |
| 3) 审计模式试运行 | HWPP 切换到"观察/审计模式"，收集被拦截项 | 1~2 周 |
| 4) 白名单修正 | 人工 + 自动化补充合法业务路径/哈希 | 1 周 |
| 5) 生产切换 | 选择业务低峰切换到"强制模式"，密切观察 48 小时 | 维护窗口 |
| 6) 常态化运营 | 业务变更时同步更新白名单；每月复核 | 持续 |

### 5.1 上线风险控制

- **先测试，再生产**：绝对不能"第一天就全部强制"。
- **有预案、能回滚**：HWPP 策略本身要可切换、可一键关闭。
- **有白名单例外流程**：业务紧急上线时要有授权通道可以临时放行。
- **有应急联系人**：HWPP 拦截影响业务时，能 10 分钟内找到负责人处置。

## 6. 一份"护网前 HWPP Checklist"

- [ ] 所有核心服务器已启用主机防火墙（Windows Firewall / Linux iptables/nftables）
- [ ] 入站规则为"默认拒绝 + 白名单端口"，无 ANY-ANY 规则
- [ ] SSH / RDP 只允许来自堡垒机 / 管理网段
- [ ] SSH 禁用密码登录、禁用 root 远程登录
- [ ] 启用 fail2ban / Windows 账户锁定策略
- [ ] 应用白名单（AppLocker / SELinux / AppArmor）至少已在审计模式运行 1 周
- [ ] Tomcat / Nginx / 数据库账号启用最小权限
- [ ] Web 管理接口 / 数据库 / 缓存服务不对外网暴露
- [ ] MFA 已覆盖 VPN / 堡垒机 / OA / 核心系统
- [ ] 业务白名单例外流程 + 应急联系人清单已就位

## 7. 总结

HWPP 不是"装个工具就完事"，而是**资产清单 × 白名单策略 × 上线流程 × 日常运营**的组合拳。它的防护价值来自：

- **默认拒绝**：未知攻击天然被拦截
- **最小权限**：攻击者即使拿到一个账号，也无法随意执行程序
- **可审计**：任何被拦截的行为都会被记录，为溯源与复盘提供素材

在护网实战中，**已完成 HWPP 白名单加固的核心系统**，通常是最后才被红队"啃下"的硬骨头 —— 甚至全程不被攻破。这正是 HWPP 的真实价值。
