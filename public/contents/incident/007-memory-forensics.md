# 内存取证实战：Volatility 3 从入门到精通

---

## 一、为什么需要内存取证

```
磁盘取证 vs 内存取证：
  磁盘：文件残留、删除恢复、时间戳分析
  内存：运行中的进程、网络连接、加密密钥、注入代码、Rootkit

关键数据在内存中：
  ✓ 正在运行的恶意进程（可能无文件落地）
  ✓ 网络连接（C2通信信息）
  ✓ 注入的恶意代码（进程镂空/反射DLL）
  ✓ 注册表缓存（持久化痕迹）
  ✓ 用户凭据（LSASS内存中的Hash/Kerberos票据）
  ✓ 加密容器密码/密钥
  ✓ Rootkit隐藏的内容（磁盘上看不到）
```

---

## 二、内存镜像采集

### 2.1 Windows 采集

```bash
# WinPMEM (Rekall项目) — 推荐
winpmem.exe -o memory.raw        # 原始格式
winpmem.exe -o memory.aff4       # AFF4格式（含元数据）

# DumpIt (Magnet Forensics)
DumpIt.exe  # 一键导出

# FTK Imager
# GUI工具，支持内存+磁盘同时采集

# 注意：
# ⚠️ 采集时可能触动恶意软件检测
# ⚠️ 采集工具本身占用内存 → 可能覆盖证据
# ⚠️ 优先通过网络采集（如Velociraptor远程采集）
```

### 2.2 Linux 采集

```bash
# LiME (Linux Memory Extractor) — ★强烈推荐
# 编译内核模块
git clone https://github.com/504ensicsLabs/LiME.git
cd LiME/src && make

# 加载模块采集
insmod lime.ko "path=/tmp/memory.lime format=lime"

# 或通过TCP发送到取证服务器
insmod lime.ko "path=tcp:192.168.1.100:4444 format=lime"

# /dev/mem (旧版Linux)
dd if=/dev/mem of=memory.raw bs=1M
# ⚠️ /dev/mem在较新内核已限制访问范围

# /proc/kcore (ELF格式内核内存)
dd if=/proc/kcore of=kcore.dump bs=1M
```

---

## 三、Volatility 3 核心插件

```bash
# 安装
pip install volatility3

# Volatility 3 vs Volatility 2:
# v3: Python 3, 插件式架构, 自动识别OS, 无需profile
# v2: Python 2, profile方式, 被v3取代

# ====== 基础信息 ======
vol -f memory.raw windows.info          # OS版本/时间
vol -f memory.raw windows.pslist        # 进程列表
vol -f memory.raw windows.psscan        # 深度扫描（含隐藏进程）
vol -f memory.raw windows.pstree        # 进程树

# ====== 恶意代码检测 ======
vol -f memory.raw windows.malfind       # 恶意代码检测(VAD标记异常)
vol -f memory.raw windows.vadinfo       # VAD区域分析
vol -f memory.raw windows.ldrmodules    # DLL加载验证(检测DLL Hollowing)

# ====== 网络分析 ======
vol -f memory.raw windows.netscan       # 网络连接+监听端口
vol -f memory.raw windows.netstat       # 网络连接(旧版)

# ====== 凭据提取 ======
vol -f memory.raw windows.hashdump      # NTLM Hash(从SAM/缓存)
vol -f memory.raw windows.lsadump       # LSA Secrets
vol -f memory.raw windows.kerberos      # Kerberos票据

# ====== 文件与注册表 ======
vol -f memory.raw windows.filescan      # 文件对象扫描
vol -f memory.raw windows.dumpfiles     # 提取文件
vol -f memory.raw windows.registry.hivelist  # 注册表Hive列表
vol -f memory.raw windows.registry.printkey --key "Software\Microsoft\Windows\CurrentVersion\Run"

# ====== 命令行历史 ======
vol -f memory.raw windows.cmdline       # 进程命令行
vol -f memory.raw windows.consoles      # 控制台历史

# ====== 进程Dump ======
vol -f memory.raw windows.dumpfiles --pid 1234  # Dump进程内存
vol -f memory.raw windows.memmap --pid 1234 --dump  # Dump完整进程
```

---

## 四、典型场景

### 场景1：检测无文件恶意软件

```bash
# 1. 扫描异常进程
vol -f memory.raw windows.psscan
# 对比 pslist（看是否有隐藏进程）

# 2. 可疑进程深度分析
vol -f memory.raw windows.malfind --pid 5678
# 查找PAGE_EXECUTE_READWRITE权限的内存区域(正常程序不应当有)

# 3. 查看可疑进程注入的DLL
vol -f memory.raw windows.dlllist --pid 5678
# 查找路径异常的DLL(无签名/在Temp目录)

# 4. 提取注入代码
vol -f memory.raw windows.vadinfo --pid 5678 --dump
vol -f memory.raw windows.memmap --pid 5678 --dump
# 提取后 → strings | VirusTotal
```

### 场景2：分析C2通信

```bash
# 1. 查看所有网络连接
vol -f memory.raw windows.netscan

# 2. 找异常连接
#  • 非标准端口(非80/443/53)
#  • 连接到非业务相关国家IP
#  • 短周期心跳(每60秒连接一次)

# 3. 将可疑进程dump出来
vol -f memory.raw windows.memmap --pid <可疑PID> --dump
# 用strings/IDA分析提取C2域名/IP/加密密钥
```

---

## 五、Checklist

- [ ] 内存采集工具就绪（WinPMEM/LiME）
- [ ] 采集时使用写保护器（磁盘取证时）
- [ ] 优先通过网络采集（减少对目标系统影响）
- [ ] Volatility 3 安装+插件熟悉
- [ ] 标准分析流程：进程→网络→DLL→凭据→注册表
- [ ] 内存镜像哈希记录（SHA256）
- [ ] 分析结果入证物链
