# 取证分析实战：流量包分析 + 内存取证解题攻略

> **📘 文档定位**：CISP 考试 CTF 安全 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 取证分析深度实战，覆盖 PCAP 流量包分析技巧、Volatility 内存取证插件使用及常见 CTF 取证题型的解题思路。

---

## 导航目录

- [一、取证分析总体框架](#一取证分析总体框架)
- [二、PCAP 流量分析技巧](#二pcap-流量分析技巧)
- [三、内存取证插件使用](#三内存取证插件使用)
- [四、常见题型解题思路](#四常见题型解题思路)
- [五、安全部署 Checklist](#五安全部署-checklist)
- [六、高分考点与知识巧记](#六高分考点与知识巧记)

---

## 1. 取证分析题目的总体框架

CTF 取证（Forensics）题目通常围绕以下四类场景：

| 分类 | 典型题型 | 核心工具 |
|------|---------|---------|
| 流量分析（PCAP） | HTTP/HTTPS/USB/DNS/ICMP | Wireshark、tshark、NetworkMiner、Scapy |
| 内存取证（Memory Forensics） | Windows/Linux 内存镜像 | Volatility 2/3、Redline |
| 文件隐写 | 图片/音频/压缩包/文档 | binwalk、foremost、steghide、zsteg、exiftool |
| 日志/磁盘取证 | Windows event、Linux bash_history、磁盘镜像 | Autopsy、FTK、7z、strings |

**关键思维模式**：CTF 取证 = **数据还原 + 隐写检测 + 时间线重建 + flag 抽取**

## 2. 流量包（PCAP）分析

### 2.1 初始分析清单

拿到一个 .pcap / .pcapng 文件后，第一步：

```bash
# 1. 基础信息
file capture.pcap                         # 文件类型
capinfos capture.pcap                       # 统计信息（时间、包数、字节数）
tshark -r capture.pcap -q -z io,phs        # 协议分层统计
tshark -r capture.pcap -q -z conv,tcp      # TCP 会话统计
tshark -r capture.pcap -q -z conv,udp      # UDP 会话统计

# 2. 打开 Wireshark，过滤关键协议
# http.request.method == "POST"
# http contains "flag"
# dns.qry.name contains "flag"
# ftp-data
# usb.device_address == 2 && usb.transfer_type == 1  # USB 键盘/鼠标
# icmp.type == 8                           # ICMP Echo (ping)
# tcp.stream eq 0                          # 追踪某个 TCP 流
```

### 2.2 典型协议分析

```bash
# 1) HTTP：提取所有 HTTP 请求/响应中的文件
tshark -r capture.pcap -Y "http.request or http.response" -T fields -e http.request.uri -e http.host

# 导出 HTTP 对象
# Wireshark → File → Export Objects → HTTP

# 2) DNS：查找可疑域名（DNS Tunnel、DNS exfiltration）
tshark -r capture.pcap -T fields -e dns.qry.name -Y "dns.flags.response == 0" | sort -u

# 3) TLS：导出会话密钥后解密 HTTPS（需要 SSLKEYLOGFILE 或主密钥）
# tshark -r capture.pcap -Y "tls.handshake.type == 1"

# 4) FTP：提取 FTP data 流
# tshark -r capture.pcap -Y "ftp-data" -w ftp-data.pcap

# 5) USB：还原键盘输入
# 键盘 HID 报告描述符中，按键位映射：
#   Usage Page (0x07) = Keyboard
tshark -r capture.pcap -T fields -e usb.capdata -Y "usb.transfer_type == 1" \
    | python3 usb_keyboard_decode.py
```

### 2.3 USB 键盘流量还原脚本

```python
# usb_keyboard_decode.py - 根据 USB HID 报告数据还原按键
key_map = {
    0x04: 'a', 0x05: 'b', 0x06: 'c', 0x07: 'd', 0x08: 'e',
    0x09: 'f', 0x0a: 'g', 0x0b: 'h', 0x0c: 'i', 0x0d: 'j',
    0x0e: 'k', 0x0f: 'l', 0x10: 'm', 0x11: 'n', 0x12: 'o',
    0x13: 'p', 0x14: 'q', 0x15: 'r', 0x16: 's', 0x17: 't',
    0x18: 'u', 0x19: 'v', 0x1a: 'w', 0x1b: 'x', 0x1c: 'y',
    0x1d: 'z', 0x1e: '1', 0x1f: '2', 0x20: '3', 0x21: '4',
    0x22: '5', 0x23: '6', 0x24: '7', 0x25: '8', 0x26: '9',
    0x27: '0', 0x28: '[ENTER]', 0x2c: ' ', 0x2d: '-', 0x2e: '=',
    0x2f: '[', 0x30: ']', 0x33: ';', 0x34: '\'', 0x36: ',', 0x37: '.',
}
shift_map = {
    0x1e: '!', 0x1f: '@', 0x20: '#', 0x21: '$', 0x22: '%',
    0x23: '^', 0x24: '&', 0x25: '*', 0x26: '(', 0x27: ')',
    0x2d: '_', 0x2e: '+', 0x2f: '{', 0x30: '}', 0x33: ':',
    0x34: '"', 0x36: '<', 0x37: '>',
}

import sys
for line in sys.stdin:
    data = line.strip().replace(':', '')
    if not data: continue
    modifier = int(data[:2], 16)
    keycode = int(data[4:6], 16) if len(data) >= 6 else 0
    if keycode == 0: continue
    shifted = (modifier & 0x22) != 0  # Left/Right Shift
    if shifted and keycode in shift_map:
        sys.stdout.write(shift_map[keycode])
    elif keycode in key_map:
        ch = key_map[keycode]
        sys.stdout.write(ch.upper() if shifted and ch.isalpha() else ch)
```

### 2.4 ICMP/DNS/HTTP 隐蔽通道

- **ICMP 隐蔽通道**：data 字段中携带 flag/木马通信。过滤 `icmp` 并检查 data
- **DNS 隐蔽通道**：子域名中携带 base64/hex，如 `aGVsbG8.attacker.com`
- **HTTP 隐蔽通道**：Cookie、User-Agent、X-Forwarded-For 等头部注入 flag

```bash
# DNS 子域名提取 base64
tshark -r capture.pcap -T fields -e dns.qry.name -Y "dns" \
    | grep -E "^[a-zA-Z0-9+/=]+\." \
    | sed 's/\..*//' | sort -u | base64 -d
```

## 3. 内存取证（Volatility 实战）

### 3.1 Volatility 2/3 基础命令

```bash
# 识别操作系统
volatility -f memdump.raw imageinfo
volatility3 -f memdump.raw windows.info.Info

# 进程列表
volatility -f memdump.raw pslist
volatility -f memdump.raw pstree
volatility -f memdump.raw psscan          # 查找隐藏进程

# 网络连接
volatility -f memdump.raw connscan
volatility -f memdump.raw netscan         # 综合网络信息

# 命令行 / 环境变量
volatility -f memdump.raw cmdline
volatility -f memdump.raw envars

# 文件 / 注册表
volatility -f memdump.raw filescan
volatility -f memdump.raw hivescan
volatility -f memdump.raw hashdump

# 提取 / dump
volatility -f memdump.raw procdump -D out -p 1234
volatility -f memdump.raw memdump -D out -p 1234
volatility -f memdump.raw dumpfiles -D out --summary=files.txt
```

### 3.2 典型取证思维流程

```
Step 1  imageinfo → 判断 Win7SP1x64 / Win10 / Linux
Step 2  pslist / pstree → 发现可疑进程（notepad、cmd、powershell、陌生进程名）
Step 3  cmdline → 看可疑命令行参数是否含 flag
Step 4  filescan / dumpfiles → 提取 flag.txt / .zip / .png 等
Step 5  memdump procdump → strings 搜 "flag{"
Step 6  hashdump → 如需 hashcat 爆破
Step 7  hivelist + printkey → 看注册表关键位置
Step 8  screenshots / mimikatz → 登录凭证
```

### 3.3 从内存 dump 中搜 flag

```bash
# 从整个内存镜像直接字符串搜索
strings -e l memdump.raw | grep -iE "flag|ctf|key|secret"
strings -n 8 memdump.raw | grep -i "flag{"

# 从某个进程 dump 中搜
volatility -f memdump.raw procdump -D out -p 1234
strings out/executable.1234.exe | grep -i flag
```

### 3.4 Linux 内存取证（LiME + volatility3）

```bash
# 靶机上用 LiME 采集内存
insmod lime.ko "path=/tmp/mem.lime format=lime"

# volatility3 分析
volatility3 -f mem.lime linux.pslist.PsList
volatility3 -f mem.lime linux.bash.Bash
volatility3 -f mem.lime linux.check_afinfo.Check_afinfo
```

## 4. 文件隐写配合取证

| 工具 | 场景 | 典型用法 |
|------|------|---------|
| `file` / `binwalk` / `foremost` | 文件识别、解包 | `binwalk -e flag.png` |
| `strings` | 字符串搜索 | `strings flag.png \| grep -i flag` |
| `exiftool` | 元数据（EXIF） | `exiftool flag.jpg` |
| `steghide` | JPEG 隐写 | `steghide extract -sf flag.jpg -p password` |
| `zsteg` | PNG 各个通道隐写 | `zsteg flag.png` |
| `stegsolve` | 图片平面/通道分析 | 图形界面工具 |
| `outguess` / `steghide` | JPEG 高频隐写 | `outguess -r flag.jpg out.txt` |
| `CyberChef` | 在线工具，支持多种编码/解码 | 在线浏览器版 |

## 5. 实战示例解析

### 5.1 示例一：HTTP 流量中藏 flag

```
场景描述：capture.pcap 中包含一次 Web 登录和文件下载。目标是从 HTTP body 中提取一个被 base64 编码的 flag。

解题流程：
1) Wireshark 打开 capture.pcap
2) File → Export Objects → HTTP
3) 发现可疑文件 "data.bin"，大小 1024 字节
4) binwalk data.bin → 发现含 ZIP 归档
5) foremost 解压 → flag.txt → cat flag.txt
   flag{HTTP_h1dd3n_f1l3_1n_pc4p}
```

### 5.2 示例二：USB 键盘输入还原

```
场景描述：capture.pcap 是 USB 流量，目标还原键盘输入。

解题流程：
1) tshark -r capture.pcap -T fields -e usb.capdata -Y "usb.transfer_type == 1"
2) 将十六进制数据逐行还原为按键（上面的 Python 脚本）
3) 输出形如：f l a g { U S B _ k e y b o a r d }
   flag{USB_keyboard_1s_e4sy}
```

### 5.3 示例三：内存镜像提取 flag

```
场景描述：memdump.raw 是 Win7SP1x64 内存镜像，notepad 打开过 flag.txt。

解题流程：
1) volatility -f memdump.raw imageinfo  → Win7SP1x64
2) pslist → 发现 notepad.exe (PID 2314)
3) cmdline → "C:\\Windows\\system32\\NOTEPAD.EXE" "C:\\Users\\admin\\Desktop\\flag.txt"
4) memdump -D out -p 2314 → 导出进程内存
5) strings out/2314.dmp | grep -i "flag{" → flag{n0tep4d_1n_m3m0ry}
```

## 6. 解题思路总结

| 题目类型 | 先试什么 | 再试什么 | 最后一招 |
|---------|---------|---------|---------|
| 图片隐写 | file、binwalk、exiftool | zsteg、stegsolve | steghide + 密码爆破 |
| 流量分析 | 协议统计、HTTP 导出对象 | USB/DNS/ICMP 分析 | TLS 解密 + 流量还原 |
| 内存取证 | imageinfo、pslist、cmdline | filescan、procdump | memdump + strings |
| 文件取证 | file、binwalk、foremost | strings | 磁盘镜像 Autopsy |

> 取证分析是 CTF 中最考验"耐心 + 工具熟练度"的方向。建立**工具链 + 解题 checklist**，反复练习不同题目，形成"看到文件就知道该怎么操作"的直觉是制胜关键。
