# 勒索病毒应急处置与恢复实战

---

## 一、勒索病毒的典型生命周期

```
Step 1. 投递 (Delivery)
  钓鱼邮件附件 (.docm, .js, .hta, .iso, .lnk)
  漏洞利用 (RCE, SMB EternalBlue CVE-2017-0144, Log4j, Exchange)
  弱口令 / 已知凭据横向

Step 2. 执行 (Execution)
  Office 宏 / HTA / Powershell / cmd.exe / mshta / regsvr32 / rundll32
  行为: 解密主程序 → 读取系统信息 → 上报 C2

Step 3. 持久化 (Persistence)
  Run/RunOnce 注册表 / 计划任务 / 服务 / WMI 事件订阅 / 计划任务 at/schtasks

Step 4. 权限提升 (Privilege Escalation)
  本地提权漏洞 (CVE-2021-40449, CVE-2023-36802 等) 或系统弱配置

Step 5. 防御规避 (Defense Evasion)
  关闭 / 卸载 AV/EDR (net stop / sc config / powershell disable-defender)
  停止/清除 VSS 快照 (vssadmin delete shadows /all / quiet)
  禁用 Windows Defender / Realtime Monitoring
  关闭 Windows Update / 阻止打补丁

Step 6. 凭证窃取 (Credential Access)
  Mimikatz / sekurlsa::logonpasswords / Procdump lsass / samdump
  窃取 NTLM hash, 做 pass-the-hash 横向

Step 7. 横向 (Lateral Movement)
  \\C$ / \\ADMIN$ + PsExec / wmic / winrs / at / schtasks / WMIC

Step 8. 数据采集 (Collection)
  遍历本地 + 网络共享所有磁盘, 收集 .doc, .docx, .xls, .pdf, .jpg, .bak, .mdf, .vhdx

Step 9. 影响 (Impact)
  加密文件, 添加文件扩展名 (.locky, .wannacry, .phobos, .conti, .clop, .play, .blackcat)
  修改桌面壁纸 + README 勒索信
  可选: 双重勒索 - 先泄露敏感数据再加密, 或仅泄露 (exfiltration)

Step 10. C2 通信
  与 C2 服务器通信, 获取密钥、上传主机信息、下载新模块
```

## 二、应急响应黄金流程 (发现勒索后)

### 2.1 第一分钟: 隔离 (Stop the Bleeding)

```
  发现主机被加密 → 立即:
  1) 物理断网 (拔掉网线 / 禁用 Wi-Fi) - 阻止横向扩散
  2) 隔离网段 (VLAN / 防火墙阻断该网段到其它所有网段)
  3) 不关机 / 不重启 - 保留内存取证
  4) 禁用 AD 中被入侵的账号
  5) 通知 SOC / CISO / 法务 (合规要求)
```

### 2.2 第一小时: 范围评估

```
  扫描所有主机:
  - 查看共享存储 (NAS/SMB/DFS) 是否被加密
  - 查看备份服务器 (尤其 Veeam / Commvault / 快照) 是否被删除
  - 查看邮件服务器 / 数据库服务器是否感染
  - 确认加密文件扩展名 (判断家族: .locky, .conti, .clop, .phobos, .play, .blackcat 等)
  - 提取勒索信 README.txt, 读取 ONION 地址 / BTC/Eth 钱包
  - 关联同一 C2 的其他主机
```

### 2.3 第一至四小时: 根源定位

```
  1) 分析第一台被感染主机的入侵入口
     - 邮件 / 附件 / RDP 弱口令 / Exchange 漏洞 / VPN 凭据
  2) 收集样本 (加密器主程序) → 上传到沙箱 + virustotal
  3) 判断家族: 根据扩展名 / 勒索信格式 / IOC 比对
  4) 寻找攻击者的"后门" (webshell / 计划任务 / 新建账号)
  5) 拉取 SIEM / EDR 日志, 重建时间轴 (T0-Tn)
```

### 2.4 处置与恢复

```
  Step A: 清除恶意模块
    - 结束加密进程 / 删除主程序 / 禁用可疑服务 / 计划任务
    - 结束可疑的 PSExec / wmic / cmd.exe 子进程
    - 修复被篡改的注册表项 (Run/RunOnce/Image File Execution Options)

  Step B: 清理凭据
    - 所有被入侵主机的本地管理员密码、服务账号密码全部重置
    - krbtgt 账号密码重置 2 次 (消除 Golden Ticket)
    - 撤销所有被泄的 AD 凭据, 强制所有会话登出

  Step C: 修复漏洞 (根本原因)
    - 打补丁 (Exchange / 操作系统 / VMware / VPN 软件)
    - 禁用不必要协议 (SMBv1, NTLMv1)
    - 限制 RDP / SSH 来源, 启用 MFA
    - LAPS 部署 (本地管理员密码随机化)

  Step D: 数据恢复 (优先路径)
    1) 离线备份恢复 (首选, 最干净)
    2) VSS 快照恢复 (vssadmin list shadows, 若攻击者未删除)
    3) 解密工具 (针对部分老家族, 见 nomoreransom.org)
    4) 第三方解密 / 谈判 (法律 + 管理层决策, 不推荐)
    5) 绝不要在原机上恢复, 应在干净主机 + 干净网络中恢复

  Step E: 回切验证
    - 逐台恢复, 逐个验证文件完整性
    - 运行 AV Full Scan + EDR Full Scan 后再上线
    - 增加 7 天密切观察期, 关注可疑行为
```

## 三、Windows 勒索现场排查命令

```powershell
# 1. 停止可疑进程 (先取证, 再清理)
#    先用 tasklist / Get-Process 确认进程名, 再停止
tasklist | findstr /i "powershell cmd mshta rundll32"
Get-Process | Where-Object {$_.Path -like "*temp*" -or $_.Company -eq ""} | Format-Table Id, Name, Path

# 2. 检查 VSS 快照 (攻击者常执行: vssadmin delete shadows /all /quiet)
vssadmin list shadows
# 若 snapshots 被删除, 基本断定为勒索或攻击者预处理

# 3. 防勒索防护状态
Get-MpComputerStatus       # 查看 Defender Real-Time/OnAccess 是否启用
Get-MpPreference | Select DisableRealtimeMonitoring, DisableBehaviorMonitoring, DisableIOAVProtection, ExclusionPath

# 4. 勒索信 / 新创建文件 (7 天内)
Get-ChildItem -Path C:\Users, C:\, D:\ -Recurse -ErrorAction SilentlyContinue -Include
    "README*", "DECRYPT*", "HOW_TO*", "*.hta", "*.iso", "*.lnk" |
    Where LastWriteTime -gt (Get-Date).AddDays(-7) |
    Select FullName, LastWriteTime, Length

# 5. 最近修改的 Office / 数据库文件 (被加密的文件 = 最近 write)
Get-ChildItem -Path C:\ -Recurse -Include *.docx,*.xlsx,*.pdf,*.mdf,*.bak -ErrorAction SilentlyContinue |
    Where {$_.LastWriteTime -gt (Get-Date).AddHours(-6)} | Select FullName, LastWriteTime

# 6. 可疑启动项
wmic startup get Caption, Command, User, Location
Get-CimInstance Win32_StartupCommand
# 以及常见 Run 注册表 (见 Windows 入侵排查章节)

# 7. 最近执行的 Powershell (事件 ID 4104)
Get-WinEvent -LogName Microsoft-Windows-PowerShell/Operational |
    Where-Object {$_.Id -eq 4104} | Select -First 20 | Format-List TimeCreated, Message

# 8. 可疑计划任务 (勒索常用 schtasks /Create 部署)
schtasks /query /fo LIST /v | findstr /i "powershell cmd.exe mshta rundll32"
Get-ScheduledTask | Where TaskName -match "Update|WinUpdate|AutoUpdate|Microsoft.*Update" | Select TaskName, Author, State
```

## 四、Linux 勒索现场排查命令

```bash
# 1. 可疑进程 (高 CPU / 异常路径)
ps auxf | head -50
ls -la /proc/*/exe 2>/dev/null | grep deleted  # 自我删除的进程 (典型木马特征)

# 2. 加密/解密相关可疑程序
ps aux | grep -iE "encrypt|crypt|ransom|bitpay|lock"
ls -lat /tmp/
ls -lat /dev/shm/
ls -lat /var/tmp/

# 3. 定时任务与持久化
crontab -l
cat /etc/crontab
ls -la /etc/cron.d/
cat /etc/rc.local
systemctl list-units --type=service --state=running | head -40

# 4. 勒索信文件
find / -iname "*readme*" -o -iname "*ransom*" -o -iname "*decrypt*" 2>/dev/null | head -20
find / -name "*.locky" -o -name "*.phobos" -o -name "*.conti" 2>/dev/null | head -20

# 5. 网络连接 C2
ss -antp | grep ESTAB
# 关注: 443/8080/8443/80 等, 且 Remote Address 不在公司白名单中
# 用 whois <IP> / virustotal 查看是否已知恶意 IP

# 6. VSS 等效 (Linux: LVM snapshots / Timeshift)
ls -la /mnt/
ls -la /backup/
ls -la /timeshift/ 2>/dev/null
# 检查 NFS / SMB 共享是否被加密
# 确认 NAS / 备份存储挂载点是否未被加密 (若被加密, 需离线备份恢复)
```

## 五、常见勒索家族特征速查

| 家族 | 典型扩展名 | 备注 |
|------|-----------|------|
| **LockBit** | `.lockbit` / `.locky` / `.abcd` | 速度快, 有双重勒索模式, 有泄漏网站 |
| **Conti** | `.conti` / `.readme` | 已解散, 变种多, 历史影响大 |
| **Clop** | `.Clop` / `.Cl0p` | 主要攻击企业, 勒索金额极高 |
| **Play** | `.play` / `ReadMe.[random].txt` | 近年活跃, 多为针对性攻击 |
| **BlackCat / ALPHV** | `.alphv` / `.blackcat` | RaaS 模式, 提供泄露数据门户 |
| **WannaCry** | `.WNCRY` | 2017 年全球爆发, 利用 EternalBlue |
| **REvil/Sodinokibi** | `.random` + `readme.txt` | 曾被多国联合打击 |
| **Phobos** | `.phobos` / `id-[id]-[email]` | 通过 RDP 弱口令入侵 |
| **Ryuk** | `.ryk` / `.ryuk` | 高针对性, 攻击医院、政府 |
| **Bazar** | 一般无统一扩展名 | TrickBot 演进, 多向量投递 |

快速识别工具: https://www.nomoreransom.org/ (上传勒索信, 识别家族 + 是否有公开解密工具)

## 六、数据恢复策略优先级

```
Priority 1. 离线 / 空气隔离 (Air-Gapped) 备份
     - 物理隔离的磁带 / 离线硬盘, 未被加密
     - 最干净、最安全

Priority 2. VSS / LVM / VMware 快照
     - vssadmin list shadows / vshadow / vmotion 快照
     - 攻击者会尝试 `vssadmin delete shadows /all`, 若未执行完可恢复

Priority 3. 第三方备份系统 (Veeam / Commvault / Veritas)
     - 备份存储必须单独账号 + 独立网络, 防被勒索横向删除

Priority 4. 3-2-1 原则 (行业推荐)
     - 3 份数据 / 2 种介质 / 1 份离线

Priority 5. 公开解密工具 (nomoreransom.org)
     - 部分家族公开了主密钥或有白帽研究出解密器
     - 如: WannaCry (kill switch), Shade/Troldesh, Nemucod 等

Priority 6. 法律 + 谈判 (最后选项)
     - 需公司高层 + 法务 + 执法机构共同决策
     - FBI / 当地警方建议: 一般不建议支付赎金
     - 支付不保证能恢复所有数据, 且助长攻击
```

## 七、预防加固清单 (事后必须落实)

```
防御分层:
  1. 邮件网关: 禁止宏, 禁止 .exe/.js/.hta/.vbs/.iso 附件, DMARC/SPF/DKIM
  2. 端点防护: EDR + 应用白名单 (AppLocker/WDAC) + UAC 默认拒绝
  3. 网络隔离: 服务器/研发/财务/VIP 各成独立 VLAN, 东西向 ACL
  4. 权限最小化: LAPS (本地管理员密码随机化), Protected Users, Credential Guard
  5. 补丁管理: Windows Update for Business + 紧急补丁 24h
  6. 备份: 3-2-1-1-0 原则 (额外 1 份离线, 0 错误)
  7. 审计: Sysmon + 集中 SIEM, 7×24 监控
  8. 演练: 每年至少一次桌面演练 + 红蓝对抗
  9. 培训: 季度钓鱼模拟 + 安全意识培训
 10. 应急: 预写 SOP, 联系人列表 (厂商/执法/公关/法务/保险)

加固细节 (Windows):
  - 禁用 SMBv1
  - 禁用 NTLMv1, 强制 Kerberos / LDAP Sign
  - UAC: "以管理员身份批准" 提示
  - 禁止 Office 宏: `HKEY_CURRENT_USER\Software\Microsoft\Office\*\*\Security\VbaWarnings` = 4
  - Windows Defender Application Guard 隔离浏览
  - Credential Guard / Remote Credential Guard
  - LAPS 部署本地管理员密码随机
  - Protected Users 组 (金票/银票防护)
  - BitLocker (避免被加密者勒索) + 定期备份恢复密钥
  - 禁用 PowerShell 2.0; Set-ExecutionPolicy RemoteSigned
  - 开启 Windows Defender Application Control (WDAC)
  - 开启攻击面减少规则 (ASR rules)

加固细节 (Linux):
  - SSH 只允许 key 登录, 禁用密码; 登录白名单 IP
  - fail2ban 阻止暴力破解
  - 限制 sudo 权限 (最小化 wheel 组)
  - auditd / rkhunter / aide (文件完整性监控)
  - 关键目录 /etc / /var/log / /root 做文件变更监控
  - 禁用 root 远程登录
  - /tmp /dev/shm noexec,nosuid,nodev
  - 最小化安装, 仅必要服务运行
  - Yara / ClamAV 扫描所有上传/下载文件
  - 定时备份, 备份介质独立
```

## 八、事件后的 KPI / 度量

```
  MTTD (Mean Time to Detect)               从入侵到发现时间 (目标: <1h)
  MTTR (Mean Time to Respond)              从发现到隔离时间 (目标: <30min)
  MTTR (Mean Time to Recover)              从隔离到恢复业务时间 (按业务 RTO)
  加密文件数量 / 总文件数                  受感染比例
  业务中断时长                              影响面评估
  可恢复数据比例                           备份验证指标
  二次入侵事件数                           加固有效性衡量
```

## 九、CheckList

- [ ] **第一时间**: 拔掉网线 / 禁用网卡, 阻止横向, 不重启
- [ ] 确认感染家族 (勒索信 / 文件扩展名)
- [ ] 范围评估: 检查所有共享存储 / 备份 / 其它服务器是否加密
- [ ] 保留内存/磁盘/流量取证 (DumpIt + FTK + tcpdump)
- [ ] 查找入侵入口 (邮件附件 / RDP 弱口令 / Exchange / VPN 漏洞)
- [ ] 识别所有持久化方式 (Run/RunOnce/服务/计划任务/WMI/Startup)
- [ ] 重置所有被入侵账号密码 (含 krbtgt 两次重置)
- [ ] 禁用/清除可疑计划任务、服务、驱动
- [ ] 修复已知漏洞、打补丁
- [ ] 从干净备份恢复 (若有), 不直接在被感染机器恢复
- [ ] 7×24 加强监控, 观察是否二次入侵
- [ ] 更新 IOC 列表 (IP / Domain / Hash / YARA) 到所有防护设备
- [ ] 形成事件报告 (时间轴 / 攻击链 / 影响 / 整改项)
- [ ] 季度复盘演练 (桌面推演 + 红蓝对抗)
