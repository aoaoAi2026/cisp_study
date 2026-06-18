# Day 3：Windows安全基础

> 🎯 面试目标：掌握Windows安全的核心概念，包括认证机制、权限体系、安全日志和常见加固措施

## 知识速览

### 核心概念
- **SAM与域认证**：本地账户密码哈希存储在SAM文件中（%SystemRoot%\System32\config\SAM），域环境下使用Kerberos协议进行身份认证，NTLM逐步被淘汰但仍存在降级攻击风险
- **Windows权限体系**：基于ACL的自主访问控制（DAC），每个对象（文件/注册表/进程）都有安全描述符，包含SID、DACL、SACL。面试要能解释SID、ACE、ACL的关系
- **UAC与完整性级别**：从Vista引入的用户账户控制，进程运行在低/中/高/系统四个完整性级别，用于限制恶意代码的横向影响

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| Windows中如何实现最小权限原则？ | 通过ACL精确控制每个用户对资源的访问权限，使用Active Directory的OU和组策略进行批量管理，日常使用非管理员账户，需要提权时使用runas或UAC确认。服务账户使用托管服务账户(gMSA)自动管理密码 |
| Kerberos和NTLM的区别？ | Kerberos是三方认证（客户端+KDC+服务端），使用票据机制，支持双向认证和委派；NTLM是挑战-响应机制，易受Pass-the-Hash攻击。Windows域默认优先使用Kerberos，但很多攻击场景利用NTLM降级 |
| 如何发现Windows系统被入侵？ | 重点检查：安全事件日志（4624/4625登录事件、4672特殊权限分配）、计划任务、启动项、新增账户、进程和服务列表异常。实用工具：Sysinternals套件（Process Explorer、Autoruns）、PowerShell日志、Event Log分析 |

### 技术细节

**Windows登录类型（事件ID 4625中的LogonType）：**
| Type | 描述 | 安全关注点 |
|------|------|-----------|
| 2 | 交互式登录（本地） | 物理安全 |
| 3 | 网络登录（SMB/NetBIOS） | Pass-the-Hash |
| 4 | 批处理登录（计划任务） | 持久化手段 |
| 5 | 服务登录 | 权限过高 |
| 7 | 解锁 | 配合Type 2分析 |
| 10 | 远程交互式（RDP） | 暴力破解 |

**Windows加固要点（面试话术模板）：**
```
1. 账户安全：
   - 禁用Guest账户，重命名Administrator
   - 密码策略：长度≥12位，复杂度开启，90天更换
   - 账户锁定策略：5次失败锁定30分钟

2. 系统加固：
   - 关闭不必要的服务（Telnet、Print Spooler等）
   - 启用Windows Defender + AppLocker
   - 及时安装安全更新（WSUS管理）

3. 日志与审计：
   - 开启进程创建日志（4688）和命令行日志
   - 开启PowerShell日志（ScriptBlock Logging）
   - 日志集中转发至SIEM

4. 网络安全：
   - Windows Defender Firewall默认入站拒绝
   - 禁用SMBv1，启用SMB签名
   - 启用LDAP签名和LDAPS
```

## 常见陷阱
- ⚠️ "Windows防火墙能防住所有攻击吗"——不能，Windows防火墙主要是基于端口和程序的过滤，不具备应用层检测能力。面试官可能借此考察对安全分层防御的理解
- ⚠️ 面试中说"我们用管理员账户跑服务"是严重减分项——每个服务应用独立的最小权限账户运行，面试官会据此判断你的安全意识

## 今日检测
1. 在自己的Windows上打开事件查看器，找到最近5条4624登录事件
2. 用icacls命令查看并解释一个系统文件的ACL
3. 列出Windows域环境中防止Pass-the-Hash攻击的5项措施
