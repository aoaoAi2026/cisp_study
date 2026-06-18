# Nmap 从入门到精通：端口扫描的瑞士军刀

> 分类：工具指南 | 难度：入门→精通 | 阅读时间：约60分钟

## 概述

Nmap（Network Mapper）是安全从业者最常用的开源工具之一，由 Gordon Lyon（Fyodor）于 1997 年创建，至今已发展超过 25 年。它能完成主机发现、端口扫描、服务版本探测、操作系统识别、NSE 脚本扫描等一系列任务。无论是渗透测试的"信息收集"阶段，还是蓝队的安全巡检和资产管理，Nmap 都是不可或缺的第一把利器。

Nmap 的核心优势在于：
- **准确性高**：内置数千条服务指纹，TCP/IP 协议栈指纹识别业界最准
- **灵活性极强**：6 种端口扫描技术、10+ 主机发现方式、600+ NSE 脚本
- **生态丰富**：输出支持 XML/Grepable/标准文本，可与 Metasploit、Nessus 等无缝联动
- **跨平台**：Linux/Windows/macOS 全支持，源码编译或包管理器安装

## 核心知识点

- Nmap 的六种基本扫描类型：TCP SYN(-sS)、TCP Connect(-sT)、UDP(-sU)、TCP ACK(-sA)、TCP Window(-sW)、TCP Maimon(-sM)
- 主机发现技术（-sn, -Pn, -PS, -PA, -PU, -PY, -PE, -PP, -PM）
- 服务版本探测（-sV）与操作系统识别（-O, --osscan-guess）
- NSE 脚本引擎的 15 个分类与实战应用
- 扫描速度控制（-T0 ~ -T5）与防火墙/IDS 规避技术
- 输出格式（-oN, -oX, -oG, -oA）与 ndiff 结果对比
- Zenmap 图形化界面使用

---

## 一、安装与环境配置

### 1.1 Linux 安装

```bash
# Debian/Ubuntu/Kali
sudo apt update && sudo apt install nmap -y

# RHEL/CentOS/Fedora
sudo yum install nmap -y          # CentOS 7
sudo dnf install nmap -y          # Fedora / CentOS 8+

# Arch Linux
sudo pacman -S nmap

# 从源码编译（获取最新版本）
wget https://nmap.org/dist/nmap-7.95.tar.bz2
tar xjf nmap-7.95.tar.bz2
cd nmap-7.95
./configure
make
sudo make install
```

### 1.2 Windows 安装

```
1. 访问 https://nmap.org/download.html
2. 下载 nmap-7.95-setup.exe
3. 安装时勾选 "Install Npcap"（Windows 抓包驱动，替代已停止维护的 WinPcap）
4. 安装完成后重启终端，nmap 命令即可用
5. 可选：勾选安装 Zenmap（图形界面）
```

### 1.3 macOS 安装

```bash
# Homebrew（推荐）
brew install nmap

# 或下载 .dmg 安装包
# https://nmap.org/download.html#macosx
```

### 1.4 验证安装

```bash
nmap --version
# 期望输出：Nmap version 7.95 ( https://nmap.org )
# 确认 OpenSSL、Npcap/WinPcap、libpcre 等组件正常

# 测试基本功能
nmap -sn 127.0.0.1
# 应返回 "Host is up"
```

---

## 二、端口扫描技术详解

Nmap 提供 6 种核心扫描技术，每种适用于不同的网络环境和隐蔽需求。

### 2.1 TCP SYN 扫描（-sS，默认特权扫描）

```bash
nmap -sS 192.168.1.1
```

**工作原理**：
1. Nmap 发送 TCP SYN 包到目标端口
2. 收到 SYN-ACK → 端口开放（open）→ 立即发送 RST 重置连接（不完成三次握手）
3. 收到 RST → 端口关闭（closed）
4. 无响应/ICMP 不可达 → 端口被过滤（filtered）

**特点**：
- 速度快（不需完成握手）
- 相对隐蔽（不建立完整连接，目标应用层无感知）
- 需要 root/Administrator 权限（构造原始套接字）
- 默认扫描 1000 个最常用端口

**适用场景**：几乎所有渗透测试场景，是最常用的扫描类型

### 2.2 TCP Connect 扫描（-sT，非特权扫描）

```bash
nmap -sT 192.168.1.1
```

**工作原理**：
1. 调用系统 `connect()` 系统调用，完成完整的三次握手
2. 连接成功后立即关闭（通过 RST）

**特点**：
- 不需要 root 权限，普通用户可用
- 会在目标应用日志中留下连接记录
- 比 SYN 扫描稍慢（需完成握手）

**适用场景**：没有 root 权限时使用；通过 SOCKS 代理扫描时

### 2.3 UDP 扫描（-sU）

```bash
nmap -sU 192.168.1.1
```

**工作原理**：
1. 发送空 UDP 包（或特定协议的探测包）到目标端口
2. 收到 UDP 响应 → 端口开放
3. 收到 ICMP Port Unreachable → 端口关闭
4. 无响应（超时）→ 端口开放|被过滤（open|filtered）

**特点**：
- 扫描速度慢（必须等待 ICMP 超时，通常 1-2 秒/端口）
- UDP 端口常被忽视，但 DNS(53)、SNMP(161)、NTP(123)、TFTP(69) 等 UDP 服务可能成为突破口
- 建议同时使用 `-sV` 进行服务版本探测以提高准确率

**常用 UDP 端口清单**：

| 端口 | 服务 | 安全关注点 |
|:---|:---|:---|
| 53 | DNS | DNS 隧道、域传送漏洞 |
| 67/68 | DHCP | DHCP 欺骗、中间人攻击 |
| 69 | TFTP | 匿名文件传输、配置泄露 |
| 123 | NTP | NTP 放大攻击（DDoS） |
| 137/138 | NetBIOS | Windows 信息泄露、名称投毒 |
| 161/162 | SNMP | 弱 community string（public/private）|
| 500 | IKE/IPsec | VPN 指纹识别、弱加密 |
| 514 | Syslog | 日志注入、信息泄露 |
| 520 | RIP | 路由协议攻击 |
| 1900 | SSDP | UPnP 漏洞利用 |
| 5353 | mDNS | 本地网络信息泄露 |

### 2.4 TCP ACK 扫描（-sA）

```bash
nmap -sA 192.168.1.1
```

**用途**：探测防火墙规则，判断端口是被过滤还是未过滤，而非判断端口开放状态。

**工作原理**：
1. 发送仅设置 ACK 标志的 TCP 包
2. 收到 RST → 未过滤（unfiltered，端口可达，但无法判断开/关）
3. 无响应/ICMP 不可达 → 过滤（filtered，被防火墙阻挡）

```bash
# 常见用法：测绘防火墙规则范围
nmap -sA -p 1-1000 192.168.1.1
```

### 2.5 TCP Window 扫描（-sW）

```bash
nmap -sW 192.168.1.1
```

利用某些系统的 TCP 窗口大小差异判断端口状态（如 AIX、FreeBSD 等）。收到 RST 包时检查 TCP Window 字段：非零窗口值可能表示开放端口。

### 2.6 TCP Maimon 扫描（-sM）

```bash
nmap -sM 192.168.1.1
```

发送 FIN/ACK 探测包，以 Uriel Maimon 命名。主要用于探测某些 BSD 系统。

### 2.7 端口指定技巧

```bash
# 扫描指定端口
nmap -p 80,443,8080,8443 192.168.1.1

# 端口范围
nmap -p 1-1000 192.168.1.1

# 扫描所有 65535 个端口
nmap -p- 192.168.1.1

# 按协议分别指定
nmap -p T:80,443,U:53,161 192.168.1.1

# 排除某些端口
nmap -p 1-1000 --exclude-ports 22,25,110 192.168.1.1

# Top N 端口（默认 Top 1000）
nmap --top-ports 100 192.168.1.1     # 常用 Top 100
nmap --top-ports 2000 192.168.1.1    # 扩展 Top 2000

# 快速扫描（仅 Top 100）
nmap -F 192.168.1.1
```

---

## 三、主机发现技术

在实际扫描前，Nmap 需要先判断哪些主机在线（存活）。这些技术统称为"主机发现"（Host Discovery）或"Ping 扫描"。

### 3.1 完整主机发现技术对照表

| 参数 | 技术名称 | 发送内容 | 开放主机响应 | 权限要求 |
|:---|:---|:---|:---|:---|
| `-PE` | ICMP Echo | ICMP Echo Request | ICMP Echo Reply | root |
| `-PP` | ICMP Timestamp | ICMP Timestamp Request | ICMP Timestamp Reply | root |
| `-PM` | ICMP Netmask | ICMP Address Mask Request | ICMP Address Mask Reply | root |
| `-PS<port>` | TCP SYN Ping | TCP SYN 到指定端口 | SYN-ACK 或 RST | root |
| `-PA<port>` | TCP ACK Ping | TCP ACK 到指定端口 | RST | root |
| `-PU<port>` | UDP Ping | UDP 包到指定端口 | ICMP Port Unreachable | 普通用户 |
| `-PY<port>` | SCTP INIT Ping | SCTP INIT 到指定端口 | INIT-ACK 或 ABORT | root |
| `-PO<proto>` | IP Protocol Ping | 原始 IP 协议包 | 对应协议响应 | root |
| `-PR` | ARP Ping | ARP Request | ARP Reply | root |
| `--traceroute` | 路由追踪 | TCP/UDP/ICMP 组合 | 路径信息 | root |

### 3.2 主机发现实战场景

```bash
# 场景1：内网快速存活扫描（默认）-sn 使用 ICMP Echo + TCP SYN 443 + TCP ACK 80 + ICMP Timestamp
nmap -sn 192.168.1.0/24

# 场景2：外网扫描（对方封 ICMP，改用常用端口）
nmap -sn -PS80,443,22,25,53 -PA80,443 10.0.0.0/24

# 场景3：跳过主机发现，假设所有 IP 在线（防火墙阻挡所有探测时）
nmap -Pn 192.168.1.0/24

# 场景4：仅 ARP 扫描（局域网最可靠，因为 ARP 通常不被过滤）
nmap -sn -PR 192.168.1.0/24

# 场景5：结合多种探测方式提高准确率
nmap -sn -PE -PS80,443 -PA80,443 -PU161 192.168.1.0/24

# 场景6：从文件读取目标列表
nmap -sn -iL targets.txt

# 场景7：排除某些主机
nmap -sn 192.168.1.0/24 --exclude 192.168.1.1,192.168.1.254
```

---

## 四、服务版本探测（-sV）

`-sV` 通过发送特定探测包到开放端口，匹配响应与内置的数千条服务指纹，精确识别服务名称、版本和附加信息。

### 4.1 基础用法

```bash
# 基础版本探测
nmap -sV 192.168.1.1

# 指定探测强度（0-9，默认 7）
nmap -sV --version-intensity 9 192.168.1.1   # 最高精度（所有探测）
nmap -sV --version-intensity 3 192.168.1.1   # 轻量级（仅 NULL 探测和少数常见探测）

# 轻量模式（等价于 --version-intensity 2，仅 NULL 探测）
nmap -sV --version-light 192.168.1.1

# 全量探测（等价于 --version-intensity 9）
nmap -sV --version-all 192.168.1.1

# 显示 RPC 扫描探测结果（用于识别 NFS、NIS 等）
nmap -sV --version-trace 192.168.1.1
```

### 4.2 版本探测工作原理

Nmap 的服务检测分为三个阶段：

**阶段一：NULL 探测**
- 建立连接后等待服务 Banner
- 许多服务会主动发送 Banner（如 SSH、FTP、SMTP）
- 匹配内置指纹库

**阶段二：专用探测**
- 根据端口号选择对应协议的标准探测包
- 例如 80 端口发送 `GET / HTTP/1.0\r\n\r\n`
- 例如 22 端口发送 `SSH-2.0-Nmap-Scan\r\n`

**阶段三：汇总与匹配**
- 将各阶段响应与 nmap-service-probes 数据库比对
- 使用正则和软匹配（softmatch）提高识别率

### 4.3 实战示例

```bash
# 全套扫描：端口 + 版本 + OS（最常用组合）
nmap -sS -sV -O 192.168.1.1

# 激进扫描模式（-A 包含 -sS -sV -O --traceroute）
nmap -A 192.168.1.1

# 仅对特定端口做版本探测
nmap -sV -p 22,80,443,3306,8080 192.168.1.1

# 批量扫描并保存结果
nmap -sV -oA scan_results 192.168.1.0/24
```

---

## 五、操作系统识别（-O）

### 5.1 基础用法

```bash
# 基础 OS 识别
nmap -O 192.168.1.1

# 激进识别（当默认匹配不确定时继续猜测）
nmap -O --osscan-guess 192.168.1.1

# 限制 OS 识别目标（仅对指定目标做 OS 探测）
nmap -O --osscan-limit 192.168.1.0/24

# 组合用法
nmap -O --osscan-guess --max-os-tries 5 192.168.1.1
```

### 5.2 OS 识别原理

Nmap 向目标发送一系列精心构造的 TCP、UDP 和 ICMP 探测包，分析：

| 探测类型 | 分析内容 | 说明 |
|:---|:---|:---|
| TCP ISN 采样 | 初始序列号生成规律 | 不同 OS 使用不同的 PRNG 算法 |
| TCP 选项 | 支持选项及顺序 | MSS、Window Scale、SACK、Timestamp |
| IP ID 采样 | IP 分片 ID 生成方式 | 递增/随机/归零 |
| TCP 初始窗口大小 | SYN-ACK 的 Window Size | Windows/Linux/macOS 窗口不同 |
| ICMP 错误消息 | 引用原包长度 | 不同 OS 引用不同长度的原始数据 |
| TCP RST 数据 | RST 包是否携带数据 | Windows 常带数据，Linux 不带 |

### 5.3 OS 识别输出解读

```
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.9
Network Distance: 1 hop
```

**关键字段**：
- `Device type`：设备大类（general purpose、router、firewall、printer 等）
- `Running`：操作系统类别
- `OS CPE`：CPE 格式的精确标识
- `OS details`：详细版本范围
- `Network Distance`：网络跳数

---

## 六、NSE 脚本引擎（核心武器）

NSE（Nmap Scripting Engine）是 Nmap 最强大的特性，使用 Lua 语言编写脚本，内置 600+ 脚本。

### 6.1 NSE 脚本分类总览

| 分类 | 数量 | 说明 | 典型脚本 |
|:---|:---:|:---|:---|
| `safe` | ~120 | 安全无害，不会造成破坏 | `http-title`, `ssh-hostkey` |
| `default` | ~50 | 默认执行的脚本（-sC） | `http-default-accounts` |
| `discovery` | ~80 | 信息发现 | `dns-brute`, `snmp-info` |
| `version` | ~100 | 版本增强探测 | `http-trane-info` |
| `vuln` | ~60 | 漏洞检测 | `smb-vuln-ms17-010`, `http-sql-injection` |
| `exploit` | ~40 | 漏洞利用 | `http-shellshock`, `smb-vuln-ms17-010` |
| `auth` | ~40 | 认证绕过/测试 | `ssh-auth-methods`, `ftp-anon` |
| `broadcast` | ~20 | 广播发现 | `broadcast-dhcp-discover` |
| `brute` | ~50 | 暴力破解 | `ftp-brute`, `http-brute` |
| `dos` | ~30 | 拒绝服务（慎用）| `http-slowloris`, `dns-fuzz` |
| `external` | ~20 | 依赖外部服务 | `whois-domain`, `dns-ip-geolocation` |
| `fuzzer` | ~15 | 模糊测试 | `dns-fuzz`, `http-form-fuzzer` |
| `intrusive` | ~80 | 侵入性探测 | `http-enum`, `smb-enum-shares` |
| `malware` | ~15 | 恶意软件检测 | `http-google-malware` |

### 6.2 NSE 实战命令大全

```bash
# === 信息收集 ===

# 默认安全脚本（-sC 等价于 --script=default）
nmap -sC 192.168.1.1

# 全量漏洞扫描（常用！）
nmap --script vuln 192.168.1.1

# HTTP 服务全面枚举
nmap --script "http-*" -p 80,443,8080 192.168.1.1
nmap --script http-enum,http-headers,http-methods,http-title -p 80 192.168.1.1

# SMB 枚举
nmap --script smb-enum-shares,smb-enum-users,smb-os-discovery -p 445 192.168.1.1

# === 漏洞检测 ===

# 扫描永恒之蓝（MS17-010）
nmap --script smb-vuln-ms17-010 -p 445 192.168.1.0/24

# Heartbleed 检测
nmap --script ssl-heartbleed -p 443 192.168.1.1

# Shellshock 检测
nmap --script http-shellshock --script-args uri=/cgi-bin/test.cgi 192.168.1.1

# HTTP SQL 注入检测
nmap --script http-sql-injection -p 80 192.168.1.1

# SSL/TLS 加密套件分析
nmap --script ssl-enum-ciphers -p 443 192.168.1.1

# === 认证测试 ===

# 匿名 FTP 检测
nmap --script ftp-anon -p 21 192.168.1.1

# SSH 认证方式探测
nmap --script ssh-auth-methods -p 22 192.168.1.1

# 弱口令爆破（慎用，可能锁账号）
nmap --script ftp-brute -p 21 192.168.1.1
nmap --script ssh-brute -p 22 192.168.1.1

# === 安全评估 ===

# HTTP 安全头检查
nmap --script http-security-headers -p 443 192.168.1.1

# HTTP 慢速攻击检测
nmap --script http-slowloris-check -p 80 192.168.1.1

# DNS 域传送漏洞检测
nmap --script dns-zone-transfer --script-args dns-zone-transfer.domain=example.com -p 53 192.168.1.1
```

### 6.3 通配符选择脚本

```bash
# 使用通配符匹配
nmap --script "smb-*" 192.168.1.1                # 所有 SMB 相关脚本
nmap --script "http-* and not http-brute" 192.168.1.1  # HTTP 脚本但排除暴力破解

# 布尔表达式
nmap --script "default or safe" 192.168.1.1
nmap --script "default and safe and not intrusive" 192.168.1.1
nmap --script "(vuln or exploit) and not dos" 192.168.1.1

# 按目录匹配
nmap --script "/usr/share/nmap/scripts/http-*.nse" 192.168.1.1
```

### 6.4 NSE 脚本参数传递

```bash
# 传递参数给脚本（--script-args）
nmap --script http-sql-injection \
     --script-args "http-sql-injection.url=/login.php,http-sql-injection.param=user" \
     -p 80 192.168.1.1

# 从文件加载多组参数
nmap --script http-brute --script-args-file brute-args.txt 192.168.1.1

# 使用数据库输出（如将 SQL 注入结果导入 Metasploit 数据库）
nmap --script vuln --script-args vulns.showall -oX scan.xml 192.168.1.1
```

### 6.5 更新和调试 NSE 脚本

```bash
# 更新 NSE 脚本数据库
sudo nmap --script-updatedb

# 查看脚本帮助
nmap --script-help http-sql-injection
nmap --script-help "smb-*"

# 调试模式（--script-trace）
nmap --script http-sql-injection --script-trace -p 80 192.168.1.1
```

---

## 七、扫描速度与时序控制

### 7.1 时序模板详解

| 模板 | 名称 | 扫描延迟 | 并行度 | 超时 | 适用场景 |
|:---|:---|:---|:---|:---|:---|
| `-T0` | Paranoid | 5 分钟 | 串行 | 极长 | 极端隐蔽，IDS 规避 |
| `-T1` | Sneaky | 15 秒 | 串行 | 长 | IDS 规避，谨慎扫描 |
| `-T2` | Polite | 0.4 秒 | 低 | 中 | 跨 WAN 扫描，减少带宽占用 |
| `-T3` | Normal | 默认 | 默认 | 默认 | 默认值，多数场景适用 |
| `-T4` | Aggressive | 10ms | 高 | 短 | 高速互联网/内网，假定可靠网络 |
| `-T5` | Insane | 5ms | 极高 | 极短 | 局域网，可能丢包 |

### 7.2 细粒度时序控制

```bash
# 控制最小/最大并行度
nmap --min-parallelism 10 --max-parallelism 100 192.168.1.1

# 控制探测超时
nmap --min-rtt-timeout 50ms --max-rtt-timeout 500ms 192.168.1.1

# 控制探测间隔
nmap --min-rate 100 --max-rate 500 192.168.1.0/24   # 每秒发包数
nmap --scan-delay 1s 192.168.1.1                      # 探测间隔

# 控制主机超时（放弃慢速主机）
nmap --host-timeout 5m 192.168.1.0/24

# 控制 DNS 解析
nmap -n 192.168.1.0/24             # 不做 DNS 解析（加速）
nmap -R 192.168.1.0/24             # 总是做 DNS 解析（即使主机不活跃）
nmap --dns-servers 8.8.8.8,8.8.4.4 192.168.1.1  # 指定 DNS 服务器
```

---

## 八、防火墙与 IDS/IPS 规避技术

### 8.1 规避技术全景

| 技术 | 参数 | 原理 | 效果 |
|:---|:---|:---|:---|
| 分片 | `-f` | 将 TCP 头拆分为多个小 IP 分片 | 绕过简单包过滤防火墙 |
| 双分片 | `-ff` | 进一步拆分 | 更隐蔽 |
| 指定 MTU | `--mtu 16` | 自定义分片大小（8 的倍数）| 针对特定防火墙 |
| 诱饵扫描 | `-D RND:10` | 伪造源 IP，混合真实扫描 | 隐藏真实扫描源 |
| 源端口欺骗 | `--source-port 53` | 伪装为常用服务端口 | 绕过端口过滤规则 |
| 随机扫描顺序 | `--randomize-hosts` | 打乱目标顺序 | 躲避基于时间序列的检测 |
| 修改数据长度 | `--data-length 100` | 在包末尾附加随机数据 | 改变包特征，绕过签名检测 |
| IP 欺骗 | `-S 10.0.0.5` | 伪造源 IP | 需要配合其他技术获取结果 |
| MAC 欺骗 | `--spoof-mac 00:11:22:33:44:55` | 伪造 MAC 地址 | 绕过 MAC 过滤 |
| 错误校验和 | `--badsum` | 使用错误的 TCP/UDP 校验和 | 测试防火墙/IDS 是否校验 |
| TTL 控制 | `--ttl 64` | 设置自定义 TTL 值 | 模拟不同操作系统 |
| Proxy 代理 | `--proxies http://127.0.0.1:8080` | SOCKS4/HTTP 代理 | 隐藏真实 IP |

### 8.2 实战规避组合

```bash
# 组合1：基础隐蔽扫描
nmap -sS -T2 -f --data-length 50 -n -Pn 目标IP

# 组合2：中等隐蔽（绕过大多数IDS）
nmap -sS -T2 -f --data-length 30 --randomize-hosts --spoof-mac 0 -n 目标IP

# 组合3：极端隐蔽（适合渗透测试）
nmap -sS -T1 -f --mtu 24 --data-length 50 --randomize-hosts \
     --scan-delay 5s --max-retries 1 -n -Pn 目标IP

# 组合4：诱饵扫描（隐藏真实IP）
nmap -sS -D RND:5,ME -n 目标IP     # ME 代表真实 IP，其余 5 个是随机诱饵

# 组合5：源端口绕过防火墙
nmap -sS --source-port 53 -Pn 目标IP       # 伪装为 DNS 应答
nmap -sS --source-port 80 -Pn 目标IP       # 伪装为 HTTP 响应
nmap -sS --source-port 443 -Pn 目标IP      # 伪装为 HTTPS 响应
```

### 8.3 重要注意事项

> ⚠️ **法律与合规警告**：上述规避技术仅应在授权的渗透测试中使用。未经授权的扫描本身即可能构成违法，使用规避手段会加重法律责任。务必遵守《网络安全法》及相关法规，始终在获得书面授权后进行测试。

---

## 九、输出格式与结果分析

### 9.1 四种输出格式

```bash
# 标准文本输出（人类阅读）
nmap -oN scan_results.txt 192.168.1.1

# XML 输出（程序解析，Metasploit/nessus 可导入）
nmap -oX scan_results.xml 192.168.1.1

# Grepable 输出（便于 grep/awk/sed 处理）
nmap -oG scan_results.gnmap 192.168.1.1

# 三种格式同时输出
nmap -oA scan_results 192.168.1.1
# 生成 scan_results.nmap / scan_results.xml / scan_results.gnmap

# 追加模式（而非覆盖）
nmap -oN scan_results.txt --append-output 192.168.1.2
```

### 9.2 Grepable 格式实战

```bash
# 扫描子网并提取开放 80 端口的主机
nmap -p 80 -oG - 192.168.1.0/24 | grep "80/open" | awk '{print $2}'

# 批量扫描并统计
nmap -oG scan.gnmap 192.168.1.0/24
grep "open" scan.gnmap | awk '{print $2, $NF}' | sort

# 提取所有开放端口的主机
grep "Ports:" scan.gnmap | awk -F'\t' '{print $2, $5}'
```

### 9.3 ndiff 结果对比

```bash
# 安装 ndiff（随 Nmap 一同安装）
# Debian: apt install ndiff

# 对比两次扫描结果
nmap -oA scan_before 192.168.1.0/24
# ... 一段时间后 ...
nmap -oA scan_after 192.168.1.0/24
ndiff scan_before.xml scan_after.xml
```

ndiff 输出示例：
```
+192.168.1.100: Host is up. New ports open: 8080/tcp
-192.168.1.50: Host seems down. Port 22/tcp was open
```

### 9.4 实时监控输出

```bash
# 详细输出（-v, -vv, -vvv）
nmap -vv -sS 192.168.1.1

# 显示发包/收包率
nmap --stats-every 5s 192.168.1.0/24

# 显示包发送/接收
nmap --packet-trace 192.168.1.1

# 显示扫描进度
nmap -d 192.168.1.1       # 调试级别1
nmap -d2 192.168.1.1      # 调试级别2
```

---

## 十、实战场景

### 场景一：内网全面资产测绘

```bash
# 步骤1：快速发现存活主机
nmap -sn -T4 192.168.1.0/24 -oA step1_hosts

# 步骤2：对存活主机做全端口扫描
grep "Up" step1_hosts.gnmap | awk '{print $2}' > alive_hosts.txt
nmap -p- -T4 -iL alive_hosts.txt -oA step2_ports

# 步骤3：对开放端口做版本探测 + OS 识别
nmap -sV -O -T4 -iL alive_hosts.txt -oA step3_details

# 步骤4：NSE 漏洞扫描
nmap --script vuln -iL alive_hosts.txt -oA step4_vulns
```

### 场景二：Web 应用渗透前信息收集

```bash
# 步骤1：Web 端口扫描（覆盖常见 Web 端口）
nmap -p 80,81,443,8000,8080,8081,8443,8888,9090,9443,10000 -T4 -sV 目标IP -oA web_ports

# 步骤2：HTTP 服务枚举
nmap --script "http-* and safe" -p 80,443,8080 目标IP -oA web_http

# 步骤3：识别 WAF/CDN
nmap --script http-waf-detect,http-waf-fingerprint -p 80,443 目标IP

# 步骤4：Web 漏洞初筛
nmap --script http-sql-injection,http-stored-xss,http-csrf,http-shellshock \
     -p 80,443 目标IP -oA web_vulns
```

### 场景三：Windows 域环境侦查

```bash
# 步骤1：SMB/NetBIOS/WinRM/RDP 枚举
nmap -p 135,139,445,3389,5985,5986 -sV -T4 192.168.1.0/24 -oA win_ports

# 步骤2：SMB 漏洞深度扫描
nmap --script smb-vuln-ms17-010,smb-vuln-ms08-067,smb-vuln-ms10-054,smb-vuln-ms10-061 \
     -p 445 192.168.1.0/24 -oA win_smb_vuln

# 步骤3：SMB 信息枚举
nmap --script smb-enum-shares,smb-enum-users,smb-enum-domains,smb-enum-groups,smb-enum-sessions \
     -p 445 192.168.1.0/24 -oA win_smb_enum

# 步骤4：MSRPC 服务探测
nmap --script msrpc-enum -p 135 192.168.1.0/24
```

### 场景四：数据库服务安全评估

```bash
# MySQL
nmap -p 3306 --script mysql-enum,mysql-info,mysql-vuln-cve2012-2122 目标IP

# PostgreSQL
nmap -p 5432 --script pgsql-brute 目标IP

# MSSQL
nmap -p 1433,1434 --script ms-sql-info,ms-sql-config,ms-sql-hasdbaccess 目标IP

# MongoDB
nmap -p 27017,27018 --script mongodb-info,mongodb-databases,mongodb-brute 目标IP

# Redis
nmap -p 6379 --script redis-info,redis-brute 目标IP
```

### 场景五：VPN 与远程服务评估

```bash
# IPsec/IKE 枚举
nmap -sU -p 500,4500 --script ike-version 目标IP

# SSL VPN 检测
nmap -p 443,8443,10443 --script ssl-enum-ciphers,ssl-cert,ssl-known-key 目标IP

# OpenVPN 检测
nmap -sU -p 1194 --script openvpn-detect 目标IP

# SSH 安全评估
nmap -p 22 --script ssh2-enum-algos,ssh-auth-methods,ssh-publickey-acceptance,ssh-brute 目标IP

# RDP 评估
nmap -p 3389 --script rdp-enum-encryption,rdp-ntlm-info,rdp-vuln-ms12-020 目标IP
```

### 场景六：邮件服务器安全评估

```bash
# SMTP 枚举
nmap -p 25,465,587 --script smtp-commands,smtp-enum-users,smtp-open-relay,smtp-brute 目标IP

# POP3/IMAP
nmap -p 110,143,993,995 --script pop3-capabilities,imap-capabilities 目标IP
```

### 场景七：IoT 与嵌入式设备

```bash
# UPnP 发现
nmap -p 1900 --script upnp-info -sU 192.168.1.0/24

# mDNS/Bonjour
nmap -p 5353 --script mdns-discovery 192.168.1.0/24

# Telnet（IoT 常见）
nmap -p 23 --script telnet-encryption,telnet-brute 192.168.1.0/24

# Modbus（工控协议）
nmap -p 502 --script modbus-discover 192.168.1.0/24
```

### 场景八：CDN 穿透与源站发现

```bash
# 尝试发现真实 IP
nmap --script http-cdn-detection -p 80,443 目标域名

# DNS 历史记录辅助
nmap --script dns-brute --script-args dns-brute.domain=example.com -p 53 8.8.8.8
```

---

## 十一、与其他工具的联动

### 11.1 Nmap → Metasploit

```bash
# 导出 XML 给 Metasploit
nmap -sV -oX scan.xml 192.168.1.0/24

# 在 Metasploit 中导入
msf6 > db_import scan.xml
msf6 > hosts
msf6 > services
msf6 > vulns
```

### 11.2 Nmap → Nessus

```bash
# 先做端口扫描，再针对性导入 Nessus
nmap -sV -oX nmap_scan.xml 目标IP
# Nessus → 新建扫描 → Advanced Scan → 导入 Nmap XML
```

### 11.3 Nmap 与自定义脚本集成

```python
# Python 调用 Nmap（python-nmap 库）
import nmap3
nmap = nmap3.Nmap()
results = nmap.scan_top_ports("192.168.1.1")
for host in results:
    for port in results[host]['ports']:
        print(f"{host}:{port['portid']} - {port['state']} - {port['service']['name']}")
```

```bash
# Bash 脚本：自动扫描并邮件通知
#!/bin/bash
TARGET="192.168.1.0/24"
nmap -sV -oX scan.xml $TARGET
NEW_OPEN=$(ndiff prev_scan.xml scan.xml | grep "+")
if [ -n "$NEW_OPEN" ]; then
    echo "$NEW_OPEN" | mail -s "[Alert] New Ports Open" admin@company.com
fi
mv scan.xml prev_scan.xml
```

---

## 十二、常见问题与排错

### 12.1 权限问题

| 问题 | 现象 | 解决方案 |
|:---|:---|:---|
| 非 root 执行 -sS | `You requested a scan type which requires root privileges.` | 使用 `sudo` 或改用 `-sT` |
| Win10 Npcap 未安装 | `dnet: Failed to open device` | 安装 Npcap（非 WinPcap）|
| macOS 权限 | 抓包无数据 | 系统偏好设置 → 安全与隐私 → 允许 Nmap |

### 12.2 扫描速度问题

| 问题 | 可能原因 | 解决方案 |
|:---|:---|:---|
| UDP 扫描极慢 | 等待 ICMP 超时 | `--host-timeout 10m`，仅扫关键 UDP 端口 |
| DNS 解析卡顿 | 反向 DNS 解析慢 | 使用 `-n` 禁用 DNS |
| 防火墙丢包 | 探测包被丢弃 | 使用 `-Pn`，降低超时阈值 |

### 12.3 结果不准确

| 问题 | 原因 | 解决 |
|:---|:---|:---|
| 端口误报 closed | 防火墙返回 RST | 使用多技术交叉验证 `-sS -sA -sW` |
| OS 识别错误 | 样本不足 | `--osscan-guess`，尝试不同端口 |
| 服务版本未知 | 指纹库未覆盖 | 上报到 Nmap 社区 |
| open|filtered 不确定 | UDP/特殊探测无响应 | 使用其他工具（如 `nc -u`）辅助确认 |

---

## 十三、练习与自测

1. **基础练习**：对内网 192.168.1.0/24 做完整的端口扫描，识别出所有 Web 服务、数据库服务和远程管理端口
2. **NSE 练习**：使用 vuln 系列脚本扫描靶机，找到 MS17-010 漏洞并手工验证
3. **规避练习**：在防火墙后方的靶机上，尝试不同的规避技术组合（-f, --data-length, --source-port），对比结果差异
4. **脚本编写**：编写一个简单的 NSE 脚本，检测 HTTP 响应头中是否包含 `Server` 字段
5. **自动化**：写一个 Bash 脚本，每日定时扫描关键 IP，当出现新端口时自动告警

---

## 十四、速查卡

```
快速扫描：        nmap -F 目标
全端口：          nmap -p- 目标
存活扫描：        nmap -sn 192.168.1.0/24
全套扫描：        nmap -A 目标
漏洞扫描：        nmap --script vuln 目标
跳过 Ping：       nmap -Pn 目标
SYN 扫描：        nmap -sS 目标
UDP 扫描：        nmap -sU 目标
版本 + OS：       nmap -sV -O 目标
从文件扫描：      nmap -iL targets.txt
保存结果：        nmap -oA result 目标
内网快速：        nmap -T4 -F 192.168.1.0/24
规避防火墙：      nmap -f -D RND:5 --data-length 30 目标
脚本帮助：        nmap --script-help "http-*"
```

---

> 📖 本文为"网安百宝箱"课程配套读物，如需更多学习资料请访问 [Resources](/resources)。
> 参考：Nmap 官方文档 https://nmap.org/book/man.html | NSE 脚本文档 https://nmap.org/nsedoc/
> 更新于 2026-06-18
