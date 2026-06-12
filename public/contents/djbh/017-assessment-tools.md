# 等保测评工具实战：漏洞扫描 + 基线核查 + 渗透测试

---

## 一、测评工具全景

```
等保三级测评常用工具：

漏洞扫描：
  ├── Nessus Professional（商业）
  ├── OpenVAS / Greenbone（开源）
  ├── 绿盟 RSAS（国产商业）
  ├── 安恒明鉴（国产商业）
  └── 奇安信网神（国产商业）

基线核查：
  ├── CIS Benchmark + 手工脚本
  ├── OpenSCAP（Linux扫描）
  ├── Microsoft Security Compliance Toolkit（Windows）
  ├── 等保工具箱（各省测评机构定制）
  └── 自研基线核查脚本

Web扫描：
  ├── Burp Suite Pro
  ├── AWVS (Acunetix)
  ├── AppScan
  └── Nuclei

渗透测试：
  ├── Metasploit
  ├── sqlmap
  ├── Nmap
  └── Hydra / Medusa
```

---

## 二、漏洞扫描实战

### 2.1 Nessus 配置

```bash
# Nessus 部署
# 下载: https://www.tenable.com/downloads/nessus
dpkg -i Nessus-10.x.x-ubuntu1404_amd64.deb
systemctl start nessusd

# 访问 https://localhost:8834
# 配置扫描策略

# 扫描策略建议（等保三级）：
# 1. Basic Network Scan — 全端口+全插件
# 2. 扫描范围：所有被测评IP
# 3. 认证扫描（配置SSH/Windows凭据 → 更深度检测）
# 4. 避开业务高峰期（凌晨/周末）
```

### 2.2 OpenVAS 配置

```bash
# Docker 部署
docker run -d -p 9392:9392 \
  -e PASSWORD="admin" \
  -v openvas_data:/data \
  --name openvas \
  mikesplain/openvas

# 访问 https://localhost:9392
# 默认账号: admin / admin

# 等保扫描项：
# ✓ "Full and fast" 模板
# ✓ 扫描对象 → 所有被测评IP
# ✓ 开启"考虑为生产环境"
```

### 2.3 漏洞扫描结果判定

```
等保测评中漏洞严重度与扣分的关系：

Critical (≥9.0): → 高风险项！可能导致整改不通过
High (7.0-8.9): → 扣分项，必须限期修复
Medium (4.0-6.9): → 扣分项，建议修复
Low (<4.0): → 记录，可不修复

扫描结果解读（等保三级）：
  ✗ 任意≥1个Critical漏洞 → 一票否决（高风险项）
  ✗ ≥5个High漏洞 → 严重扣分
  ✓ 0 Critical + <5 High → 合格
```

---

## 三、基线核查实战

### 3.1 Windows 基线检查脚本

```powershell
# Windows 等保基线快速检查脚本
# 保存为 baseline_check.ps1

Write-Host "=== 等保三级 Windows 基线检查 ===" -ForegroundColor Yellow

# 1. 密码策略
Write-Host "`n[1] 密码策略:" -ForegroundColor Cyan
net accounts | Select-String "密码长度|密码最长|密码最短|锁定阈值|锁定持续时间"

# 2. 账户状态
Write-Host "`n[2] 账户状态:" -ForegroundColor Cyan
Get-LocalUser | Where-Object {$_.Enabled -eq $true} | Select Name, Enabled
# 检查Guest是否禁用
$guest = Get-LocalUser -Name "Guest" -ErrorAction SilentlyContinue
if ($guest.Enabled) { Write-Host "⚠️ Guest账户未禁用!" -ForegroundColor Red }

# 3. 防火墙状态
Write-Host "`n[3] 防火墙:" -ForegroundColor Cyan
Get-NetFirewallProfile | Select Name, Enabled

# 4. 审计策略
Write-Host "`n[4] 审计策略:" -ForegroundColor Cyan
auditpol /get /category:*

# 5. 共享目录
Write-Host "`n[5] 共享目录:" -ForegroundColor Cyan
Get-SmbShare | Select Name, Path

# 6. 服务状态
Write-Host "`n[6] 不必要服务:" -ForegroundColor Cyan
# 等保要求关闭的服务
$unwanted = @("Telnet", "RemoteRegistry", "SimpleTCP")
foreach ($s in $unwanted) {
    $svc = Get-Service -Name $s -ErrorAction SilentlyContinue
    if ($svc -and $svc.Status -eq "Running") {
        Write-Host "⚠️ $s 正在运行!" -ForegroundColor Red
    }
}

# 7. 安装的安全补丁
Write-Host "`n[7] 最近安装的补丁 (近30天):" -ForegroundColor Cyan
Get-HotFix | Where-Object {$_.InstalledOn -gt (Get-Date).AddDays(-30)} | Select HotFixID, InstalledOn

Write-Host "`n=== 检查完成 ===" -ForegroundColor Green
```

### 3.2 Linux 基线检查脚本

```bash
#!/bin/bash
# Linux 等保基线快速检查脚本

echo "=== 等保三级 Linux 基线检查 ==="

# 1. 密码策略
echo -e "\n[1] 密码策略:"
grep -E "^PASS_MAX_DAYS|^PASS_MIN_DAYS|^PASS_MIN_LEN|^PASS_WARN_AGE" /etc/login.defs

# 2. 登录失败锁定
echo -e "\n[2] 登录失败锁定:"
grep pam_faillock /etc/pam.d/system-auth /etc/pam.d/password-auth 2>/dev/null

# 3. SSH 安全配置
echo -e "\n[3] SSH安全:"
echo "  PermitRootLogin: $(grep '^PermitRootLogin' /etc/ssh/sshd_config)"
echo "  PasswordAuth: $(grep '^PasswordAuthentication' /etc/ssh/sshd_config)"
echo "  Protocol: $(grep '^Protocol' /etc/ssh/sshd_config)"

# 4. 审计服务
echo -e "\n[4] auditd 状态:"
systemctl is-active auditd

# 5. 防火墙状态
echo -e "\n[5] 防火墙:"
if command -v firewall-cmd &>/dev/null; then
    firewall-cmd --state
    firewall-cmd --list-all
fi

# 6. 不必要的服务
echo -e "\n[6] 检查不必要的服务:"
for svc in telnet rsh rexec tftp; do
    systemctl is-active $svc 2>/dev/null && echo "⚠️ $svc 正在运行!"
done

# 7. SUID 文件
echo -e "\n[7] SUID文件 (可能有提权风险):"
find / -perm -4000 -type f 2>/dev/null | grep -v proc

# 8. 开放端口
echo -e "\n[8] 监听端口:"
ss -tlnp

echo -e "\n=== 检查完成 ==="
```

### 3.3 CIS Benchmark 工具

```bash
# Linux — Lynis（自动化安全审计）
apt install lynis
lynis audit system

# Windows — CIS Benchmark 手工对照检查
# 下载: https://www.cisecurity.org/cis-benchmarks/
# 选择对应OS版本 → 逐条对照检查

# OpenSCAP — Linux SCAP标准扫描
yum install openscap-scanner scap-security-guide
oscap xccdf eval \
  --profile xccdf_org.ssgproject.content_profile_cis \
  --results scan-results.xml \
  --report scan-report.html \
  /usr/share/xml/scap/ssg/content/ssg-rhel8-ds.xml
```

---

## 四、渗透测试工具

### 4.1 基础渗透工具链

```bash
# Nmap 服务与漏洞探测
nmap -sV -sC -p- --script vuln 192.168.1.100
# -sV: 服务版本探测
# -sC: 默认脚本
# -p-: 扫描全部65535端口
# --script vuln: 漏洞检测脚本

# 弱口令检测
# SSH
hydra -l root -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.100
# Web登录
hydra -l admin -P /usr/share/wordlists/rockyou.txt \
  192.168.1.100 http-post-form "/login.php:user=^USER^&pass=^PASS^:F=error"

# SQL注入检测
sqlmap -u "http://192.168.1.100/page.php?id=1" --batch --level=3

# Web目录扫描
dirsearch -u http://192.168.1.100 -e php,asp,jsp,bak,zip

# 漏洞利用（仅授权测试）
msfconsole
use exploit/multi/http/struts2_code_exec_showcase
set RHOSTS 192.168.1.100
run
```

---

## 五、测评结果判定

### 5.1 符合度计算

```
测评结果四档：

符合 (Conformity)：
  测评项完全满足要求
  → 得分 100%

部分符合 (Partial)：
  测评项大部分满足，存在较小不足
  → 得分 50-80%

不符合 (Non-Conformity)：
  测评项不满足要求，存在严重缺失
  → 得分 0-50%

不适用 (Not Applicable)：
  测评项与系统无关（需说明理由）
  → 不参与评分

最终得分 = Σ(每项得分 × 权重) / Σ(适用项权重)

综合得分 ≥ 70分 → 基本通过
综合得分 < 70分 → 不通过
存在高风险项 → 一票不通过
```

---

## 六、Checklist

- [ ] 漏洞扫描工具部署+策略配置
- [ ] 全量系统漏洞扫描（≥1次/季度）
- [ ] 高危漏洞修复后复扫验证
- [ ] 操作系统基线核查脚本准备就绪
- [ ] CIS Benchmark / 等保基线逐项检查
- [ ] 弱口令全面排查
- [ ] 渗透测试执行（授权范围内）
- [ ] 测评工具运行环境准备（测试机/跳板机）
- [ ] 扫描结果整理归档
