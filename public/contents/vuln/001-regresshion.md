# CVE-2024-6387 regreSSHion：OpenSSH 服务端 RCE 漏洞全解

> **📘 文档定位**：CISP 考试 漏洞分析 高级专题 | 难度：⭐⭐⭐⭐⭐ | 预计阅读：30 分钟
>
> 全面解析 CVE-2024-6387 regreSSHion 漏洞的发现背景、信号竞争条件原理、EXP 利用技术、影响范围及修复方案，是理解 OpenSSH 安全机制和竞态漏洞的经典案例。

---

## 导航目录

- [一、漏洞概述](#一漏洞概述)
- [二、漏洞原理深度分析](#二漏洞原理深度分析)
- [三、EXP 利用技术](#三exp-利用技术)
- [四、影响范围与检测](#四影响范围与检测)
- [五、修复与加固方案](#五修复与加固方案)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 📋 目录

1. [漏洞概述](#一漏洞概述)
2. [漏洞原理](#二漏洞原理)
3. [影响范围判断](#三影响范围)
4. [漏洞复现](#四漏洞复现)
5. [EXP 开发](#五exp开发)
6. [漏洞检测](#六漏洞检测)
7. [修复方案](#七修复方案)
8. [完整案例：企业应急响应](#八完整案例)

---

## 一、漏洞概述

```
CVE-2024-6387 (regreSSHion) — 2024年7月1日公开

漏洞名称: OpenSSH 信号竞争条件远程代码执行
CVSS: 8.1 (High)
影响: OpenSSH 8.5p1 - 9.7p1 (部分版本)
利用条件:
  ✓ 开启SSH服务(默认)
  ✓ glibc-based Linux
  ✓ 攻击需要约6-8小时的持续尝试
  
"regreSSHion" = regression + SSH
→ 2006年修复的漏洞 CVE-2006-5051 在2020年回归!

安全意义:
  这是 OpenSSH 近年来最严重的安全漏洞
  允许未认证的攻击者以 root 执行任意代码
  2024年最危险漏洞之一!
```

---

## 二、漏洞原理

### 2.1 技术细节

```
漏洞位置: sshd 的 SIGALRM 信号处理

攻击流程:
  ① 攻击者连接SSH → 但在认证完成前断开
  ② sshd fork 出子进程处理连接
  ③ 子进程设置 alarm(LoginGraceTime) → 超时后发送 SIGALRM
  ④ 攻击者在 SIGALRM 即将触发时精确计时
  ⑤ 再次发起连接 → 触发竞争条件
  ⑥ SIGALRM 处理函数调用了不安全的函数
  ⑦ → 可能执行攻击者控制的代码
  ⑧ → 以 root 身份执行 (sshd 以 root 运行)

利用难度:
  ✦ 需要精确的时序控制(微秒级)
  ✦ 需要约10,000次尝试(6-8小时)
  ✦ Lab环境成功率约50%
  ✦ 云端/快速网络成功率更高
```

### 2.2 影响版本

```bash
# 检查 OpenSSH 版本
ssh -V
# 或:
dpkg -l | grep openssh-server
rpm -q openssh-server

# 受影响版本:
OpenSSH < 4.4p1                    # 原始漏洞(CVE-2006-5051)
OpenSSH 8.5p1 - 9.7p1              # 回归版本(CVE-2024-6387)
OpenSSH 4.4p1 - 8.4p1              # 不受影响(修复保持)
OpenSSH ≥ 9.8p1                    # 不受影响(已修复)

# 关键! 需要 glibc
# 非glibc系统(musl libc/Alpine)不受影响!
ldd /usr/sbin/sshd | grep libc
# → libc.so.6 → glibc → 受影响
# → libc.musl → 不受影响
```

---

## 三、影响范围

```
中国影响:
  ✦ CentOS 7: 不受影响 (7.4p1)
  ✦ CentOS 8 Stream: 受影响 (≥8.5p1)
  ✦ Ubuntu 22.04: 受影响 (8.9p1)
  ✦ Ubuntu 24.04: 受影响 (9.6p1)
  ✦ Debian 12: 受影响 (9.2p1)
  ✦ RHEL 9: 受影响 (8.7p1)
  ✦ Kali 2024: 受影响 (9.6p1)
  
注意: 各发行版的 Openssh 版本可能与上游不同
→ 务必用 ssh -V 检查实际版本!
```

---

## 四、漏洞复现

### 4.1 环境搭建

```bash
# Docker 搭建脆弱环境
docker run -d --name vuln-ssh -p 2222:22 ubuntu:22.04
docker exec -it vuln-ssh bash

# 安装受影响的 OpenSSH
apt update && apt install -y openssh-server
# 版本: 8.9p1-3ubuntu0.10 (Ubuntu 22.04 默认)

# 配置
sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
echo 'root:password' | chpasswd
service ssh restart

# 验证版本
ssh -V  # OpenSSH_8.9p1
```

### 4.2 编译运行 Exploit

```bash
# 下载公开EXP (GitHub)
git clone https://github.com/7etsuo/regreSSHion
cd regreSSHion
make

# 运行攻击 (需要root权限,因为需要精确时钟控制)
./regresshion root 127.0.0.1 2222

# 输出:
# [*] Target: 127.0.0.1:2222
# [*] OpenSSH version: 8.9p1
# [*] glibc detected
# [*] Starting race condition attack...
# [*] Attempt: 1000/10000
# [*] Attempt: 2000/10000
# ...
# [+] RCE achieved after 7342 attempts! (4.2 hours)
# # id
# uid=0(root) gid=0(root)
```

---

## 五、EXP 开发

### 工作原理

```c
// 简化版原理 (实际EXP更复杂)

// 1. 创建大量连接 → 触发 race condition
for (int i = 0; i < 10000; i++) {
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    connect(sock, &target, sizeof(target));
    
    // 2. 在 LoginGraceTime 即将到期时断开
    usleep(LOGIN_GRACE_TIME * 1000000 - 100);
    close(sock);
    
    // 3. 立即发起新连接 → 尝试竞争
    // 旧连接的 SIGALRM 处理可能还在进行
    // 新连接的数据可能污染旧连接的内存
    // → 可能触发任意代码执行
}
```

---

## 六、漏洞检测

### 自动化检测

```bash
# 1. 检查 OpenSSH 版本
ssh -V 2>&1 | grep -oP 'OpenSSH_\K[0-9.]+'

# 2. 检查是否 glibc
ldd /usr/sbin/sshd | grep -c "libc.so"

# 3. 一键检测脚本
#!/bin/bash
VERSION=$(ssh -V 2>&1 | grep -oP 'OpenSSH_\K[0-9.]+p[0-9]+')
MAJOR=$(echo $VERSION | cut -d. -f1 | sed 's/p.*//')
MINOR=$(echo $VERSION | cut -d. -f2)

IS_GLIBC=$(ldd /usr/sbin/sshd 2>/dev/null | grep -c "libc.so.6")

if [ "$IS_GLIBC" -gt 0 ]; then
    if [ "$MAJOR" -eq 8 ] && [ "$MINOR" -ge 5 ]; then
        echo "⚠️ VULNERABLE: OpenSSH $VERSION + glibc"
    elif [ "$MAJOR" -eq 9 ] && [ "$MINOR" -le 7 ]; then
        echo "⚠️ VULNERABLE: OpenSSH $VERSION + glibc"
    else
        echo "✅ NOT vulnerable: OpenSSH $VERSION (out of range)"
    fi
else
    echo "✅ NOT vulnerable: Not glibc-based"
fi

# Nuclei 检测
nuclei -t cves/2024/CVE-2024-6387.yaml -u target.com
```

### 全网扫描 (Shodan)

```bash
# Shodan 搜索中国受影响的主机
shodan search 'product:"OpenSSH" port:22 country:"CN"' --fields ip_str,port,org
```

---

## 七、修复方案

```bash
# 1. 升级 OpenSSH (推荐)
# Ubuntu/Debian:
apt update && apt install --only-upgrade openssh-server

# CentOS/RHEL:
yum update openssh-server

# 或编译最新版:
wget https://cdn.openbsd.org/pub/OpenBSD/OpenSSH/portable/openssh-9.8p1.tar.gz
tar xzf openssh-9.8p1.tar.gz
cd openssh-9.8p1 && ./configure && make && make install

# 2. 临时缓解 (如无法立即升级)
# 减少LoginGraceTime (减少攻击窗口)
sed -i 's/^#LoginGraceTime.*/LoginGraceTime 30/' /etc/ssh/sshd_config
systemctl restart sshd

# 3. 网络层限制
# 仅允许白名单IP访问SSH
iptables -A INPUT -p tcp --dport 22 -s 10.0.0.0/8 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j DROP

# 4. fail2ban (防暴力但在这种攻击中效果有限)
apt install fail2ban
```

---

## 八、完整案例

```
某企业 300 台服务器 OpenSSH regreSSHion 应急

发现:
  2024-07-01 07:00: CVE-2024-6387 公开

应急 (当天上午):
  T+1h: 确认影响 — 扫描全网:
    ssh_version_scan.sh > report.csv
    → 187台 Ubuntu 22.04 (受影响的 8.9p1)
    → 83台 CentOS 7 (不受影响的 7.4p1)
    → 30台 其他(musl libc,不受影响)

  T+3h: 升级方案:
    测试环境验证升级 → OK
    制定生产升级计划 (分批次)

  T+6h: 升级执行:
    非核心系统 (120台) → 立即升级
    核心系统 (67台) → 当晚升级

  T+24h: 全部升级完成 + 验证

损失: 无 (在漏洞被大规模利用前完成修复)

关键经验:
  ✓ CVSS 8.1 高危 → 不容忽视
  ✓ 187台意味着至少187个可能入口
  ✓ 抢在攻击者之前 → 先防御后攻击
```

---

## ✅ Checklist

- [ ] 扫描全网 OpenSSH 版本
- [ ] 确认是否 glibc
- [ ] 受影响主机清单
- [ ] 升级到 9.8p1+
- [ ] 或设置 LoginGraceTime=30
- [ ] 网络层限制 SSH 访问源
