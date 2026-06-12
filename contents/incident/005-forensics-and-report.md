# 事件取证与报告撰写实战

---

## 一、取证基本原则

```
1. 最小化对原始系统的修改 (Don't Touch The Evidence)
   - 不直接 rm 可疑文件 (先复制, 后分析)
   - 不在原主机上安装新工具 (风险: 修改时间戳、引入新证据)
   - 不重启 (保留内存 / 网络状态)
   - 只读方式挂载被取证磁盘 (或写拦截器)

2. 证据链完整 (Chain of Custody)
   - 每一次证据的获取 / 复制 / 转移 / 分析, 必须有记录
   - 谁、何时、做了什么、为什么
   - 电子证据 hash (SHA-256) 记录, 用于证明未篡改

3. 先做内存、再做磁盘 (内存数据是唯一的 "活证据", 关机即失)
   - 内存 → 磁盘 → 网络流量 → 日志 → 云端
```

## 二、取证顺序

```
  1) 内存镜像:   DumpIt / FTK Imager / LiME (Linux)
  2) 网络状态:   内存快照时刻的 ss/netstat/arp -a/route
  3) 易失数据:   ps/进程树、open files、剪贴板
  4) 磁盘镜像:   dd/FTK/ddrescue
  5) 文件级收集: /etc/passwd, /var/log, bash_history, Web 根目录
  6) 日志收集:   本地 syslog / 集中式 SIEM 拉取历史
  7) 云证据:     AWS CloudTrail / 阿里云 ActionTrail / O365 / GCP Audit Logs
  8) 周边:       邮件头 (邮件钓鱼)、VPN 网关、WAF、Proxy、DHCP、DNS
```

## 三、Windows 取证工具与命令

### 3.1 内存镜像

```powershell
# 1) DumpIt (Magnet Forensics, 免费)
#    管理员 cmd → DumpIt.exe /f c:\evidence\mem.raw /t /n
#    输出 mem.raw + mem.raw.sha256

# 2) FTK Imager (GUI)
#    File → Capture Memory → 选择路径 → Capture

# 3) Redline / Mandiant Memoryze

# 分析 (离线, 不要在原机做分析):
#    - Volatility 3 (开源)
#    - volatility -f mem.raw --profile=Win10x64_19041 pslist
#    - plugins: pslist/pstree/filescan/handles/cmdline/svcscan/hivelist
#    - 目标: 找到可疑进程 / 隐藏进程 / 注入 DLL / 可疑 cmdline
```

### 3.2 磁盘镜像与 hash

```powershell
# 用 FTK Imager: File → Create Disk Image → Physical Drive → 选物理盘 → 输出 E01/raw
# 用 dd / ddrescue (适用于 Linux/WinPE)
# dd if=\\.\PhysicalDrive0 of=\\.\PhysicalDrive1\evidence.dd bs=64k

# 计算 hash
Get-FileHash -Algorithm SHA256 C:\evidence\mem.raw
Get-FileHash -Algorithm MD5    C:\evidence\disk.dd

# 注意: hash 必须在取证完成后立即计算, 并写入书面记录
```

### 3.3 事件日志提取 (离线分析)

```powershell
# 导出所有 Event Logs (需管理员)
wevtutil epl Security C:\evidence\security.evtx
wevtutil epl System   C:\evidence\system.evtx
wevtutil epl Application C:\evidence\app.evtx
wevtutil epl "Microsoft-Windows-Sysmon/Operational" C:\evidence\sysmon.evtx
wevtutil epl "Microsoft-Windows-PowerShell/Operational" C:\evidence\ps.evtx

# EVTX 解析 (离线分析工具)
#   - ELK (Filebeat + Elasticsearch + Kibana)
#   - Windows Event Log Explorer
#   - Python-evtx + pandas (本地分析)
#   - Eric Zimmerman's Evtx Explorer (EZ Tools)

# 常见事件 ID 速查
#    4624 登录成功      4625 登录失败      4672 特殊权限登录
#    4698 创建计划任务   4700 启用计划任务  4699 删除计划任务
#    4720 创建账号      4726 删除账号      4732 加入本地组
#    4688 进程创建      4689 进程结束
#    5140 网络共享访问   5145 共享目录检查
#    7045 服务安装 (PSEXEC 会出现)
#    104  日志被清除    Sysmon 1 进程创建 / 3 网络 / 11 文件创建
```

### 3.4 Prefetch / Amcache / Shimcache (程序执行历史)

```
Prefetch:   C:\Windows\Prefetch\*.pf  (最近程序执行)
Amcache:    C:\Windows\AppCompat\Programs\Amcache.hve  (应用程序运行历史)
Shimcache:  HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\AppCompatCache
UsnJrnl:    C:\$Extend\$UsnJrnl:$J  (NTFS 变更日志)
Recent Files: C:\Users\<user>\AppData\Roaming\Microsoft\Windows\Recent

分析工具:
  - AppCompatCacheParser (Eric Zimmerman)
  - AmcacheParser (Eric Zimmerman)
  - USN-Journal-Parser
  - MFTECmd (解析 $MFT, 还原目录结构与文件时间戳)
```

### 3.5 浏览器历史 / 下载 / Cookie (钓鱼入口)

```
Chrome:   %LocalAppData%\Google\Chrome\User Data\Default\History (SQLite)
Edge:     %LocalAppData%\Microsoft\Edge\User Data\Default\History
IE:       %LocalAppData%\Microsoft\Windows\WebCache\WebCacheV*.dat
Firefox:  %AppData%\Mozilla\Firefox\Profiles\<profile>\places.sqlite

工具: BrowsingHistoryView (NirSoft) / Hindsight (Chrome)
重点: 攻击者下载程序的来源页面 / 钓鱼 URL / 首次访问时间
```

## 四、Linux 取证工具与命令

### 4.1 内存镜像

```bash
# LiME (Linux Memory Extractor) - 作为内核模块插入, 捕获内存
# insmod lime.ko "path=/tmp/mem.raw format=raw"
# 分析: Volatility 3 + Linux 插件

# Alternatives: fmem / /dev/crash (BSD) / dd if=/dev/mem
```

### 4.2 磁盘镜像

```bash
# 前提: 源盘只读挂载或通过写阻断器
# 目标: 生成一个 hash 可验证的完整镜像

# dd (最基础)
dd if=/dev/sda of=/mnt/usb/sda.dd bs=4k conv=noerror,sync
# 计算 hash (在取证时和归档时各算一次)
sha256sum /dev/sda > /mnt/usb/sda.sha256

# ddrescue (支持坏扇区)
ddrescue -f /dev/sda /mnt/usb/sda.dd /mnt/usb/sda.log

# 逻辑盘 (只抓特定目录, 保留元数据)
#    rsync -aHAX --numeric-ids / /mnt/usb/system/
#    或用 find + tar, 保留 atime/mtime/ctime:
tar --acls --selinux --xattrs -cvpf /mnt/usb/backup.tar /etc /var/log /root /home
```

### 4.3 易失数据收集 (在关机前做)

```bash
# 1) 进程快照 (在断网前立即)
ps auxf > /evidence/ps_$(date +%s).txt
ps -eLf > /evidence/ps_threads_$(date +%s).txt

# 2) 网络状态 (立即, 重启即失)
ss -antlp > /evidence/ss_listen_$(date +%s).txt
ss -antp > /evidence/ss_established_$(date +%s).txt
netstat -antlp > /evidence/netstat_$(date +%s).txt
arp -a > /evidence/arp_$(date +%s).txt
ip route > /evidence/route_$(date +%s).txt
ip -6 route >> /evidence/route_$(date +%s).txt
cat /etc/resolv.conf > /evidence/resolv_$(date +%s).txt

# 3) 打开文件 / 文件描述符
lsof -Pn > /evidence/lsof_$(date +%s).txt
ls -la /proc/*/fd 2>/dev/null > /evidence/fd_$(date +%s).txt

# 4) 挂载点
mount > /evidence/mount_$(date +%s).txt

# 5) 内核模块 / rootkit 线索
lsmod > /evidence/lsmod_$(date +%s).txt

# 6) /proc 快照 (尽可能保留)
for f in /proc/*/cmdline; do
    echo "== $f =="; cat "$f" | tr '\0' ' '; echo
done > /evidence/cmdline_$(date +%s).txt
```

### 4.4 日志收集

```bash
# 1) /var/log 打包
tar czf /evidence/var_log_$(date +%s).tar.gz /var/log --preserve-permissions 2>/dev/null

# 2) journald 二进制日志
journalctl --all --output=export > /evidence/journald_$(date +%s).log
# 用 journalctl --file=... 重放

# 3) 认证审计
cp -a /var/log/auth.log /var/log/secure /var/log/faillog /var/log/btmp* /var/log/wtmp* /evidence/ 2>/dev/null

# 4) last/lastb 输出存档
last > /evidence/last_$(date +%s).txt
lastb > /evidence/lastb_$(date +%s).txt 2>/dev/null
lastlog > /evidence/lastlog_$(date +%s).txt
```

## 五、取证分析思路 (时间轴重建)

```
目标: 重建 "入侵者何时进来 → 做了什么 → 何时加密/退出" 的完整链

Step 1. 确定 T0 (首次入侵时间)
   - 看 Web 日志: 第一个访问可疑 shell 的时间
   - 看邮件: 钓鱼邮件被打开时间 / 附件运行时间
   - 看 RDP/SSH: 第一次成功登录时间 (反向看谁被盗凭据)
   - 看进程/服务: 可疑服务的安装时间 (事件 ID 7045)

Step 2. 重建攻击者行为 (按时间顺序)
   - 横向扫描: SMB/NBNS/445/139 日志、事件 ID 5140 访问共享
   - 凭据窃取: lsass dump / mimikatz / sekurlsa (Sysmon 1 / 10)
   - 权限维持: Run/RunOnce 写入、计划任务、服务安装、WMI 事件订阅
   - 数据收集: 敏感文件读取、大量读取 (MFT / UsnJrnl)
   - 数据外传: 大文件 POST / FTP / 7z.exe 打包上传 (事件 ID 1 + 网络)
   - 加密操作: 大量文件 write (UsnJrnl) + 加密进程高 CPU

Step 3. 识别影响面
   - 哪些主机被入侵 (C2 同一域名/IP)
   - 哪些账号被攻陷 (同一账号在多机登录)
   - 哪些业务系统被访问 (SIEM + 应用日志)
   - 哪些数据被窃取 (DLP / 邮件网关 / 文件日志)

Step 4. 整理证据列表, 标注来源 + hash
   - 内存镜像: 2 份 hash (取证时 + 归档时)
   - 磁盘镜像: 同上
   - 日志: 原始日志 + 筛选后的 CSV
   - 网络包: pcap + VT 扫描报告
   - 屏幕截图 / 勒索信图片 / 终端截图

Step 5. 撰写报告 (见第六节)
```

## 六、事件报告模板

```
【事件报告】XX 公司 XX 事件
报告编号: INC-2025-00XX          报告日期: YYYY-MM-DD
报告级别: 机密 / 内部公开         版本: v1.0

1. 事件概述
   - 事件类型: 勒索病毒 / Web 入侵 / 数据泄露 / 钓鱼 / 内部违规
   - 发现时间: YYYY-MM-DD HH:mm (北京时间)
   - 发现方式: 内部告警 / 用户举报 / 外部通报 / 主动扫描
   - 影响业务: XX 系统 / XX 业务线 / XX 区域
   - 评估严重级别: 一般 / 严重 / 紧急 (根据数据量、业务影响、合规风险)

2. 事件时间轴 (Timeline)
   T0 YYYY-MM-DD HH:mm   攻击者首次成功登录 / 首次 WebShell 上传
   T1 YYYY-MM-DD HH:mm   横向扫描 / 凭据窃取
   T2 YYYY-MM-DD HH:mm   持久化 (账号 / 计划任务 / 服务)
   T3 YYYY-MM-DD HH:mm   开始加密 / 数据外泄
   T4 YYYY-MM-DD HH:mm   被发现 / 触发告警
   T5 YYYY-MM-DD HH:mm   开始隔离 / 断网
   T6 YYYY-MM-DD HH:mm   开始恢复
   T7 YYYY-MM-DD HH:mm   业务完全恢复

3. 攻击路径与技术细节
   - 入侵入口 (具体漏洞 / 钓鱼邮件附件名 / 密码被盗方式)
   - 攻击链 (MITRE ATT&CK 映射: Initial Access → Execution → Persistence → ...)
   - 使用的工具与 TTPs (Mimikatz / Cobalt Strike / PsExec / 7z / WinSCP ...)
   - 所用 IOC (IP / Domain / URL / Hash / YARA)

4. 影响评估
   - 受感染主机数 / 服务器数
   - 受影响账号数 (员工 / 客户)
   - 数据泄露量 (GB 数、敏感字段类型)
   - 业务中断时长
   - 财务影响估算 (赎金、应急成本、恢复成本、罚款风险)
   - 合规影响 (GDPR / PIPL / 等保 / 行业监管)

5. 已采取措施
   - 隔离 (主机 / VLAN / 账号)
   - 漏洞修复 (补丁 / 配置变更)
   - 凭据重置 (账号 / API Key / SSH Key)
   - 备份恢复 (路径、时间点)
   - IOC 推送 (WAF / EDR / SIEM / DNS)

6. 根因分析 (5-Why)
   Why1 → 为什么被入侵? (补丁缺失 / 弱密码 / 邮件钓鱼)
   Why2 → 为什么会出现该情况? (变更流程漏洞 / 安全意识薄弱)
   Why3 → 为什么没提前发现? (告警规则缺失 / 监控覆盖率低)
   Why4 → 为什么没及时阻止? (MTTR 大 / 权限过大)
   Why5 → 如何避免再次发生? (管理 + 技术双维度)

7. 后续整改计划 (Action Items)
   # | 整改项 | 责任人 | 预计完成日期 | 状态
   ---|--------|--------|-------------|-------
   1 | 紧急补丁所有受影响系统 | Infra Team | YYYY-MM-DD | Not Started
   2 | 启用 MFA 全公司 | Identity Team | YYYY-MM-DD | Not Started
   3 | 加强邮件网关: 禁止宏附件 | Email Sec | YYYY-MM-DD | ...
   4 | EDR 部署到所有服务器 / 终端 | SecOps | ...
   5 | 安全意识培训 + 季度钓鱼模拟 | HR + Sec | ...

8. 证据清单 (附 hash)
   - /evidence/mem.raw (SHA256: xxx)
   - /evidence/disk.dd (SHA256: xxx)
   - /evidence/evtx/*.evtx (打包 hash)
   - /evidence/logs/ (SIEM 导出 CSV)
   - 屏幕截图 / 勒索信照片

9. 附录
   - 攻击链拓扑图
   - IOC 列表 (供全公司防护设备使用)
   - 参与人员 (Incident Commander / 技术负责人 / 法务 / 公关 / HR)
   - 变更记录 (此报告的修改历史)

报告人: _____________ 日期: _____________
审批: ______________ 日期: _____________
```

## 七、事件后复盘会议要点

```
每次事件必须开一次 ≥ 1 小时的复盘 (Post-Mortem):

  1. 事实重述: 谁、在什么时候、发生了什么 (不讨论责任归属)
  2. 做得好的地方: 哪些响应动作有效 (例如: 快速隔离, EDR 第一时间告警)
  3. 可改进点: 哪些流程 / 工具 / 权限 / 监控缺失
  4. 根本原因: 技术 + 流程 + 组织三层根因
  5. 行动项清单 (SMART 原则): 明确责任人 / 截止日期 / 验收标准
  6. SOP 更新: 根据新发现修订应急手册与 playbook
  7. KPI 度量: MTTD / MTTR / 故障时间 / 告警误报率
  8. 经验分享: 给其他业务线的 lessons learned

会议产出:
  - Post-Mortem 报告 (面向管理层)
  - 行动项跟踪列表 (需纳入 OKR 跟踪)
  - 新版应急 SOP
  - 对全员的安全意识更新
```

## 八、CheckList

- [ ] **证据链保护**: 所有证据文件计算 SHA-256 hash, 书面记录移交时间、经手人
- [ ] **内存取证**: 已 dump 内存, hash 存档 (关机前)
- [ ] **磁盘取证**: 已 dd/FTK 全量镜像, hash 存档, 离线分析
- [ ] **事件日志**: Windows EVTX / Linux syslog + journald / Web access.log
- [ ] **网络流量**: pcap 抓包 (有条件时), 至少保留 NetFlow
- [ ] **系统状态**: ps / ss / lsof / mount / dmesg (Linux) 或等效输出
- [ ] **时间轴**: 从 T0 → T7 完整重建, 标注每个节点的证据来源
- [ ] **IOC 列表**: IP / Domain / URL / Hash / YARA rule + 说明
- [ ] **报告**: 按模板撰写, 含技术细节、影响评估、整改计划、证据清单
- [ ] **合规上报**: 根据行业监管 (PCI / HIPAA / PIPL / GDPR / 等保), 在规定时限内完成上报
- [ ] **复盘会议**: 事件结束 7 天内完成 Post-Mortem, 产出 Action Items
- [ ] **证据保存**: 至少 180 天 (或按行业要求, 如金融 5 年), 安全、加密保存
