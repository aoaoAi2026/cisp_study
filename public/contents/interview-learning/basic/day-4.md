# Day 4：Linux安全基础

> 🎯 面试目标：掌握Linux安全机制核心，包括文件权限模型、PAM认证框架、iptables防火墙和系统审计

## 知识速览

### 核心概念
- **Linux文件权限模型**：所有者-所属组-其他（ugo）三层权限，读(r=4)/写(w=2)/执行(x=1)三位八进制。SUID/SGID/Sticky Bit是面试中的进阶考点。ACL扩展权限（setfacl/getfacl）提供更细粒度的控制
- **PAM（可插拔认证模块）**：Linux认证的核心框架，在/etc/pam.d/目录下配置，支持多种认证方式组合。面试常见问题：如何配置密码复杂度、如何限制root登录、如何集成LDAP认证
- **SELinux与AppArmor**：强制访问控制（MAC）的实现。SELinux使用标签策略，AppArmor基于路径。面试重点是DAC与MAC的区别，以及SELinux三种模式（Enforcing/Permissive/Disabled）

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| 如何加固一台Linux服务器？ | 从五个维度：账户安全（禁用root SSH登录、sudo审计）、网络（iptables/nftables最小开放、SSH改端口+密钥认证）、文件系统（/tmp noexec、关键文件chattr +i）、日志（rsyslog+auditd）、更新（自动安全更新或定期补丁） |
| chmod 4755是什么意思？安全风险是什么？ | 4开头是SUID位，文件执行时以文件所有者权限运行。755是所有者rwx、组和其他rx。如果这个文件是/bin/passwd则正常，但如果SUID文件存在缓冲区溢出漏洞，攻击者可提权到root。面试可补充：find / -perm -4000找所有SUID文件 |
| iptables的表和链是什么？ | iptables有5个表（filter/nat/mangle/raw/security）和5个链（PREROUTING/INPUT/FORWARD/OUTPUT/POSTROUTING）。最常用的是filter表的INPUT链。面试建议画图说明数据包流转路径 |

### 技术细节

**Linux文件权限数字速查：**
```
-rwxr-xr-x  →  0755  （常见可执行文件）
-rw-r--r--  →  0644  （常见普通文件）
-rw-------  →  0600  （敏感配置文件，如SSH私钥）
drwx------  →  0700  （用户主目录推荐）
```

**iptables基础命令模板：**
```bash
# 查看当前规则
iptables -L -n -v

# 允许已建立的连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 允许SSH（22端口）
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 允许HTTP/HTTPS
iptables -A INPUT -p tcp -m multiport --dports 80,443 -j ACCEPT

# 默认拒绝入站
iptables -P INPUT DROP

# 防止SYN Flood（限制每秒SYN包数量）
iptables -A INPUT -p tcp --syn -m limit --limit 1/s -j ACCEPT
```

**审计关键配置（auditd）：**
```bash
# 监控/etc/passwd的修改
auditctl -w /etc/passwd -p wa -k passwd_changes

# 监控sudo使用
auditctl -w /var/log/sudo.log -p wa -k sudo_access

# 监控/bin/su的执行
auditctl -w /bin/su -p x -k su_usage
```

## 常见陷阱
- ⚠️ 面试说"我们用root账户跑应用"——这是大忌。必须强调使用非root用户运行服务，结合systemd的User=指令或sudo进行最小权限管理
- ⚠️ "iptables和firewalld有什么区别"——firewalld是iptables的前端管理工具，使用zone和service概念简化配置。不要把它们当成两套完全不同的防火墙

## 今日检测
1. 解释ls -l输出中每一列的含义，并指出哪一列是链接计数
2. 写一条iptables规则，只允许来自192.168.1.0/24的SSH连接
3. 列举3种检测Linux系统被入侵的方法
