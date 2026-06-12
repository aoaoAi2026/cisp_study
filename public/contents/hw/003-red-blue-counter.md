# HW 红队攻击路径研判与反制思路

> 本文总结护网期间红队典型攻击路径与蓝队对应研判、反制、溯源思路。

## 1. 典型攻击路径（Kill Chain）

```
[1 侦察]         [2 武器化]         [3 投递]         [4 利用]         [5 安装]         [6 命令控制]         [7 行动]
  信息收集       构造 Payload         钓鱼邮件        漏洞利用          植入后门           C2 通信              横向 / 窃取
  子域名枚举     Office 宏 / LNK      鱼叉式钓鱼      外部 RCE          Webshell          加密信道             数据外泄
  端口扫描       Malicious Doc        水坑攻击        SQL 注入          计划任务           Domain Fronting     横向移动
  Shodan/Fofa    HTML Smuggling       社工附件        反序列化          服务持久化        合法工具滥用         凭据导出
```

## 2. 外网打点阶段的研判

### 2.1 扫描行为识别

- 短时间内来自同一源 IP 对大量端口 / 路径的访问
- 特征扫描工具 UA：`Nmap Scripting Engine`、`masscan`、`sqlmap`、`Nikto`、`DirBuster`、`GoBuster`
- 告警中出现 `/actuator`、`/druid`、`/manager/html`、`/.git`、`/phpMyAdmin`、`/console` 等敏感路径访问

**反制动作**：源 IP / ASN 封禁；WAF 规则 + 威胁情报联动。

### 2.2 漏洞利用识别（常见）

| 利用动作 | 特征 | 处置建议 |
|---------|------|---------|
| Log4j2 JNDI 注入 | `${jndi:ldap://...}` 出现在日志 / 头 | 临时过滤 + 升级 |
| Shiro 反序列化 | `rememberMe=xxx...` Cookie 长密文 | 升级 + 监控该 Cookie 长度 |
| Spring Boot Actuator 暴露 | `/actuator/env`, `/actuator/jolokia` | 禁用或鉴权 |
| SQL 注入 | `' or 1=1--`, `union select` | WAF + 代码修复 |
| 文件上传绕过 | `.php5`, `.phtml`, `test.asp;.jpg` | 后缀白名单 + 目录不可执行 |
| XXE | `<!ENTITY xxe SYSTEM "file:///..."` | 禁用外部实体解析 |

## 3. 钓鱼邮件阶段的研判

### 3.1 钓鱼邮件典型特征

- 发件人域名仿冒（`huawei-pay.com` 之类）
- 内容有紧迫感：「您的账号将于 24 小时内停用」
- 附件为 `.docm` / `.xlsb` / `.lnk` / `.iso` / `.zip` 内带宏
- 链接指向仿冒登录页（域名字符极小差异）

### 3.2 钓鱼事件处置

1. 邮件网关紧急加黑名单（发件域名、附件哈希）
2. 对已投递的同类邮件使用搜索工具回收
3. 检查已点击/下载用户的终端 ED R 告警
4. 提取恶意域名/IP 供防火墙与 DNS 过滤
5. 留存邮件样本并溯源投递链

## 4. 内网横向与域渗透阶段的研判

### 4.1 常见工具与行为特征

| 工具/行为 | 特征 |
|----------|------|
| Mimikatz | `sekurlsa`、`kerberos::golden`、调试权限提升 |
| PsExec / wmiexec | 目标 445/135 端口、随机命名服务、UNC 路径 |
| Cobalt Strike | 异常外联、特定心跳流量、SMB beacon 命名管道 |
| Impacket / CrackMapExec | SMB/RDP/WMI 批量访问、大量 4625/4672 事件 |
| BloodHound / SharpHound | LDAP 大量查询、`BloodHound.exe` 进程 |
| Kerberoasting | 大量 Kerberos TGS_REQ（RC4_HMAC_MD5）4769 事件 |
| Pass-the-Hash | 4624 事件 LogonType=9（NewCredentials）+ 明确为 NTLM |

### 4.2 Windows 事件日志重点关注

| 事件 ID | 含义 |
|---------|------|
| 4624 | 登录成功 |
| 4625 | 登录失败（爆破） |
| 4672 | 特权登录 |
| 4698 / 4699 / 4700 / 4701 / 4702 | 计划任务创建/删除/更改 |
| 4720 / 4722 / 4728 | 用户创建/启用/加入组（新建账号） |
| 4768 / 4769 / 4771 | Kerberos AS/TGS 票据请求（Kerberoasting） |
| 5140 | 网络共享访问 |
| 7045 | 新服务安装 |

### 4.3 Linux 主机重点关注

- `/var/log/auth.log`、`/var/log/secure` 异常登录
- `ps` 中出现可疑进程名、反向 shell（`bash -i >& /dev/tcp/...`）
- `/etc/cron*`、`/etc/rc.local`、`/root/.bashrc` 新增条目
- SUID 二进制变化
- `/tmp`、`/dev/shm` 目录下的 ELF / `.so` 文件
- SSH known_hosts / authorized_keys 变化

## 5. 反制与溯源

### 5.1 反制动作清单

- **立即阻断**：源 IP / 攻击 IP 在边界防火墙和 WAF 上封禁
- **C2 阻断**：C2 域名/IP 在 DNS、代理、防火墙黑名单
- **主机隔离**：ED R 网络隔离被攻陷主机
- **账号处置**：被爆破/被盗账号强制登出、重置密码、MFA
- **漏洞修复**：修复被利用漏洞，升级相关组件
- **Webshell 清理**：按时间/路径/特征批量搜索并清除
- **持久化清理**：计划任务、服务、启动项、计划任务脚本

### 5.2 溯源（Forensics）要点

1. **保存证据链**：抓包、日志、进程快照、内存镜像（如有条件）
2. **确定入侵入口**：对比日志时间戳、会话链，还原入侵入口
3. **攻击者画像**：使用的工具集、TTPs（战术/技术/流程）、可能来源（根据情报归因）
4. **影响范围评估**：横向访问到了哪些系统，哪些数据可能外泄
5. **撰写报告**：事件工单 + 复盘报告 + 整改建议

### 5.3 典型溯源命令（Linux）

```bash
# 查看最近登录
last -a | head -n 50
# 查看失败登录
grep 'Failed password' /var/log/auth.log | head -n 50
# 查看 cron 变化
ls -latr /etc/cron* /var/spool/cron/*
# 查看进程树
ps auxf
# 查看最近修改的可执行文件
find / -type f \( -name "*.sh" -o -perm /111 \) -newer /etc/passwd 2>/dev/null | head -30
# 查看 ssh key
cat /root/.ssh/authorized_keys
```

### 5.4 典型溯源命令（Windows）

```powershell
# 最近登录事件
Get-WinEvent -FilterHashtable @{LogName='Security';ID=4624,4625} -MaxEvents 50 | Format-List
# 计划任务
schtasks /query /fo list /v
# 服务
Get-Service | Where-Object {$_.Status -eq 'Running'}
# 启动项
wmic startup list full
# 最近安装程序
Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* | Select-Object DisplayName,InstallDate | Format-Table -AutoSize
```

## 6. 蓝队工具链速查

| 分类 | 工具 |
|------|------|
| 日志采集 | ELK、Splunk、Graylog、Filebeat |
| 主机监控 | ED R、OSquery、Wazuh、OSSEC |
| 流量分析 | Zeek、Suricata、tcpdump、Wireshark |
| 威胁情报 | 微步、奇安信、360、AbuseIPDB、VirusTotal |
| 取证分析 | FTK、Autopsy、Volatility（内存） |
| 漏洞扫描 | Nessus、Nuclei、Xray、AWVS、Goby |

---

> 再次强调：所有反制与溯源操作必须在**本单位授权与法律框架内**进行，切勿越权对第三方资产发起主动探测或攻击。
