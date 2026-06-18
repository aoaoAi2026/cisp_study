# Volatility 内存取证框架完全指南

> 分类：工具指南 | 难度：精通 | 阅读时间：约45分钟

## 概述

Volatility 是全球最强大的开源内存取证框架，由 Volatility Foundation 维护。它能够从内存转储（Memory Dump）中提取进程列表、网络连接、注册表信息、恶意代码痕迹、加密密钥、用户凭据等关键取证信息。无论是蓝队的应急响应与恶意代码分析，还是红队的内网凭据提取，Volatility 都是内存分析领域无可替代的工具。

**版本重要变化**：
- **Volatility 2**：Python 2，插件生态丰富（已过时但社区资源多）
- **Volatility 3**：Python 3 重写，全新架构，官方推荐（当前标准）
- 两者命令语法完全不同，本文聚焦 Volatility 3

## 核心知识点

- 内存镜像获取工具（WinPmem、LiME、AVML、Belkasoft、FTK Imager）
- 分析 Profile 自动识别（Vol3 无需手动指定）
- windows.info、windows.pslist、windows.netscan 等核心插件
- 进程注入、DLL 劫持、Hollowing 检测
- 恶意代码行为分析流程
- 注册表与凭据提取
- 与 YARA 规则的联动

---

## 一、安装

```bash
# Python 3 安装（推荐）
pip install volatility3

# 或从源码
git clone https://github.com/volatilityfoundation/volatility3.git
cd volatility3
pip install -r requirements.txt
python vol.py -h

# Volatility 2（如需要旧版）
git clone https://github.com/volatilityfoundation/volatility.git
cd volatility
python2 vol.py -h

# 验证安装
python vol.py -h
python vol.py windows.info
```

---

## 二、内存镜像获取

### 2.1 Windows 内存获取

| 工具 | 说明 |
|:---|:---|
| **WinPmem** | Velociraptor 出品，推荐 |
| **DumpIt** | 一键式 exe 工具 |
| **FTK Imager** | GUI，商业取证标准 |
| **Belkasoft RAM Capturer** | 轻量免安装 |
| **Magnet RAM Capture** | 免费 GUI |
| **VMware Snapshot** | 直接 .vmem 文件 |

```bash
# WinPmem 采集
winpmem.exe -o memory.raw

# DumpIt（Windows）
DumpIt.exe → 输入 y → 生成 .raw 文件
```

### 2.2 Linux 内存获取

```bash
# LiME (Linux Memory Extractor)
# 编译 LiME 内核模块
git clone https://github.com/504ensicsLabs/LiME.git
cd LiME/src
make
insmod lime-*.ko "path=/tmp/memory.lime format=lime"

# AVML（微软开源，推荐）
./avml /tmp/memory.lime
```

### 2.3 macOS 内存获取

```bash
# osxpmem
./osxpmem.app/osxpmem -o memory.raw
```

---

## 三、Volatility 3 核心插件

### 3.1 系统信息

```bash
# 系统基本信息
python vol.py -f memory.raw windows.info

# 输出示例：
# Kernel Base: 0xf80002800000
# NT BuildLab: 19041.1.amd64fre.vb_release.191206-1406
# Is64Bit: True
# NtMajorVersion: 10
```

### 3.2 进程分析

```bash
# 进程列表（pslist）
python vol.py -f memory.raw windows.pslist

# 进程树（父子关系，检测异常进程链）
python vol.py -f memory.raw windows.pstree

# 进程命令行（cmdline）
python vol.py -f memory.raw windows.cmdline --pid 1234

# 进程环境变量
python vol.py -f memory.raw windows.envars --pid 1234

# 检测隐藏/无链接进程
python vol.py -f memory.raw windows.psscan

# DLL 列表
python vol.py -f memory.raw windows.dlllist --pid 1234

# 检测进程空洞（Hollowing）
python vol.py -f memory.raw windows.malfind --pid 1234

# VAD 信息
python vol.py -f memory.raw windows.vadinfo --pid 1234
```

### 3.3 网络分析

```bash
# 网络连接（netstat）
python vol.py -f memory.raw windows.netscan

# 查看特定进程的网络连接
python vol.py -f memory.raw windows.netscan | grep "1234"
```

### 3.4 文件与注册表

```bash
# 文件扫描
python vol.py -f memory.raw windows.filescan | grep "\.exe"

# 注册表 Hive 列表
python vol.py -f memory.raw windows.registry.hivelist

# 读取注册表键值
python vol.py -f memory.raw windows.registry.printkey \
    --key "ControlSet001\Services"

# 用户 Assist（程序执行历史）
python vol.py -f memory.raw windows.registry.userassist
```

### 3.5 凭据提取

```bash
# 哈希转储
python vol.py -f memory.raw windows.hashdump

# LSASS（凭据）
python vol.py -f memory.raw windows.lsadump

# 缓存凭据
python vol.py -f memory.raw windows.cachedump
```

### 3.6 恶意代码检测集成

```bash
# 使用 malfind 检测注入
python vol.py -f memory.raw windows.malfind

# 结合 YARA 规则扫描内存
python vol.py -f memory.raw windows.vadyarascan \
    --pid 1234 \
    --yara-file /path/to/malware_rules.yar

# 检测 SSDT Hook
python vol.py -f memory.raw windows.ssdt
```

---

## 四、应急响应标准流程

```
第1步 - 确认镜像基本信息：
  windows.info → 确认 OS 版本、架构

第2步 - 进程初筛：
  windows.pstree → 查看进程树
  关注可疑进程：异常父进程、随机名称、无数字签名

第3步 - 网络连接：
  windows.netscan → 找到可疑外联 IP/端口

第4步 - 恶意代码检测：
  windows.malfind → 检测代码注入、Hollowing
  windows.dlllist → 异常 DLL（如系统目录外的 DLL）

第5步 - 凭据检查：
  windows.hashdump → Hash 是否被导出痕迹
  windows.lsadump → LSASS 是否被访问

第6步 - 持久化检查：
  windows.registry.printkey → 启动项、计划任务、服务

第7步 - 输出报告：
  grep/awk 过滤关键信息供后续分析
```

---

## 五、Volatility 2 vs 3 命令对照

| 功能 | Volatility 2 | Volatility 3 |
|:---|:---|:---|
| 进程列表 | `vol.py --profile=... pslist` | `vol.py windows.pslist` |
| 进程树 | `vol.py --profile=... pstree` | `vol.py windows.pstree` |
| 网络连接 | `vol.py --profile=... netscan` | `vol.py windows.netscan` |
| Hashdump | `vol.py --profile=... hashdump` | `vol.py windows.hashdump` |
| 代码注入 | `vol.py --profile=... malfind` | `vol.py windows.malfind` |
| DLL列表 | `vol.py --profile=... dlllist` | `vol.py windows.dlllist` |
| 文件扫描 | `vol.py --profile=... filescan` | `vol.py windows.filescan` |

---

## 六、速查卡

```
安装:             pip install volatility3
基础信息:         windows.info
进程列表:         windows.pslist
进程树:           windows.pstree
命令行:           windows.cmdline
网络连接:         windows.netscan
Hash破解:         windows.hashdump
代码注入检测:     windows.malfind
DLL列表:          windows.dlllist
注册表Hive:       windows.registry.hivelist
程序执行历史:     windows.registry.userassist
文件扫描:         windows.filescan
YARA扫描:         windows.vadyarascan --yara-file rules.yar

WinPmem采集:      winpmem.exe -o memory.raw
LiME采集(Linux):  insmod lime.ko path=/tmp/mem.lime format=lime
AVML采集(Linux):  ./avml memory.lime
```

---

## 实战场景扩展

### 场景五：恶意进程分析

```bash
# 列出所有进程
python vol.py -f memory.dump windows.psscan --profile=Win10x64

# 查找可疑进程（隐藏进程 = psscan结果 - pslist结果）
python vol.py -f memory.dump windows.psscan > psscan.txt
python vol.py -f memory.dump windows.pslist > pslist.txt
diff psscan.txt pslist.txt | grep "^<"  # psscan有但pslist没有的=隐藏

# 查看进程命令行
python vol.py -f memory.dump windows.cmdline --pid 1234

# 转储可疑进程
python vol.py -f memory.dump windows.dumpfiles --pid 1234

# 检查进程注入（VAD分析）
python vol.py -f memory.dump windows.vadinfo --pid 1234 | \
  grep -E "PAGE_EXECUTE_READWRITE|Mapped File"
```

### 场景六：Rootkit 检测

```bash
# SSDT Hook 检测
python vol.py -f memory.dump windows.ssdt --profile=Win7x64
# 对比干净系统的 SSDT 表

# IDT Hook 检测
python vol.py -f memory.dump windows.idt

# 驱动模块检测（IRP Hook）
python vol.py -f memory.dump windows.modules
python vol.py -f memory.dump windows.driverscan

# 查找隐藏驱动
python vol.py -f memory.dump windows.modscan > modscan.txt
python vol.py -f memory.dump windows.modules > modules.txt
diff modules.txt modscan.txt | grep "^<"
```

### 场景七：凭据提取

```bash
# 提取缓存的凭据
python vol.py -f memory.dump windows.hashdump

# 提取 LSA Secrets
python vol.py -f memory.dump windows.lsadump

# Volatility3 方式
python vol.py -f memory.dump windows.hashdump.Hashdump
python vol.py -f memory.dump windows.lsadump.Lsadump

# 搜索内存中的明文密码
python vol.py -f memory.dump windows.strings | \
  grep -iE "password|passwd|pwd" | grep -v "Invalid\|impossible"
```

### 场景八：注册表分析

```bash
# Volatility 3
python vol.py -f memory.dump windows.registry.hivelist

# 查看 Run/RunOnce 持久化
python vol.py -f memory.dump windows.registry.printkey \
  --key "Microsoft\Windows\CurrentVersion\Run"

# 查看服务注册
python vol.py -f memory.dump windows.registry.printkey \
  --key "ControlSet001\Services"

# 查看 USB 设备历史
python vol.py -f memory.dump windows.registry.printkey \
  --key "ControlSet001\Enum\USBSTOR"
```

### 场景九：网络连接分析

```bash
# 活动网络连接
python vol.py -f memory.dump windows.netscan

# 检测 C2 连接：检查异常端口/外连 IP
python vol.py -f memory.dump windows.netscan | \
  grep -E ":(4444|8080|1337|31337)"  # 常见 C2 端口

# 关联进程与网络连接
python vol.py -f memory.dump windows.netscan > netscan.txt
python vol.py -f memory.dump windows.pstree > pstree.txt
# 交叉对比 PID
```

### 场景十：时间线重建

```bash
# MFT 时间戳（Volatility 3）
python vol.py -f memory.dump windows.mftscan.MFTScan

# 进程创建时间
python vol.py -f memory.dump windows.psscan | \
  awk '{print $3, $4, $1, $2}' | sort

# 综合时间线（timeliner）
python vol.py -f memory.dump windows.timeliner --output=body > timeline.txt
mactime -b timeline.txt -d > report.csv
```

---

## Volatility 2 vs 3 对比

| 特性 | Volatility 2 | Volatility 3 |
|:---|:---|:---|
| 语言 | Python 2 | Python 3 |
| 架构 | 单体插件 | 模块化框架 |
| Profile | 需要 --profile | 自动检测 |
| 速度 | 较快 | 中等 |
| 内存占用 | 较低 | 较高 |
| 符号表 | 内置 | ISF 格式 |
| 扩展性 | 手动添加 | 插件系统 |
| 推荐 | 旧版 Windows | 新版 + 跨平台 |

---

---

## 一、安装（补充平台）

### Windows
```powershell
# 使用 Python 3
pip install volatility3

# 或从源码
git clone https://github.com/volatilityfoundation/volatility3.git
cd volatility3
pip install -r requirements.txt
python vol.py --help
```

### macOS
```bash
brew install volatility
# 或
pip3 install volatility3
```

### 内存采集工具

```bash
# === Windows ===
# WinPmem（推荐，由 Volatility 团队开发）
winpmem.exe -o memory.raw

# DumpIt（简单易用）
DumpIt.exe

# FTK Imager（GUI，适合非CLI用户）
# File → Create Disk Image → Physical Drive → RAW (dd)

# === Linux ===
# LiME（Linux Memory Extractor）
sudo insmod lime.ko "path=/tmp/mem.lime format=lime"

# AVML（Microsoft 开发的轻量采集工具）
./avml memory.lime

# fmem（旧方法，需要内核编译）
sudo dd if=/dev/fmem of=memory.dump

# === macOS ===
sudo osxpmem -o memory.raw
# 或
sudo /usr/bin/coredumpctl dump
```

---

## 二、Volatility 2 常用命令补充

```bash
# 镜像信息（Vol2 需要指定 profile）
python vol.py -f memory.dump imageinfo

# 推荐 profile（根据 imageinfo 输出选择）
python vol.py -f memory.dump --profile=Win7SP1x64 pslist

# === 进程分析 ===
python vol.py -f memory.dump --profile=Win7SP1x64 psscan      # 物理扫描
python vol.py -f memory.dump --profile=Win7SP1x64 pstree      # 进程树
python vol.py -f memory.dump --profile=Win7SP1x64 cmdline     # 命令行参数
python vol.py -f memory.dump --profile=Win7SP1x64 handles     # 句柄
python vol.py -f memory.dump --profile=Win7SP1x64 dlllist     # DLL列表
python vol.py -f memory.dump --profile=Win7SP1x64 malfind     # 恶意代码检测

# === 网络 ===
python vol.py -f memory.dump --profile=Win7SP1x64 netscan     # 网络连接
python vol.py -f memory.dump --profile=Win7SP1x64 connscan    # TCP连接

# === 文件系统 ===
python vol.py -f memory.dump --profile=Win7SP1x64 filescan    # 文件对象
python vol.py -f memory.dump --profile=Win7SP1x64 mftparser   # MFT解析

# === 注册表 ===
python vol.py -f memory.dump --profile=Win7SP1x64 hivelist    # 注册表单元
python vol.py -f memory.dump --profile=Win7SP1x64 printkey    # 读取注册表键

# === 凭据 ===
python vol.py -f memory.dump --profile=Win7SP1x64 hashdump    # 哈希导出
python vol.py -f memory.dump --profile=Win7SP1x64 lsadump     # LSA凭据

# === Rootkit检测 ===
python vol.py -f memory.dump --profile=Win7SP1x64 ssdt        # SSDT表
python vol.py -f memory.dump --profile=Win7SP1x64 driverscan  # 驱动扫描
python vol.py -f memory.dump --profile=Win7SP1x64 apihooks    # API钩子
```

---

## 三、Volatility 3 命令速查

```bash
# 进程
python vol.py -f memory.dump windows.pslist
python vol.py -f memory.dump windows.psscan
python vol.py -f memory.dump windows.pstree
python vol.py -f memory.dump windows.cmdline

# 网络
python vol.py -f memory.dump windows.netscan

# 文件
python vol.py -f memory.dump windows.filescan
python vol.py -f memory.dump windows.mftscan.MFTScan
python vol.py -f memory.dump windows.dumpfiles --pid PID

# 注册表
python vol.py -f memory.dump windows.registry.hivelist
python vol.py -f memory.dump windows.registry.printkey

# 凭据
python vol.py -f memory.dump windows.hashdump.Hashdump
python vol.py -f memory.dump windows.lsadump.Lsadump

# 恶意代码
python vol.py -f memory.dump windows.malfind
python vol.py -f memory.dump windows.vadinfo

# Linux 内存
python vol.py -f memory.lime linux.pslist
python vol.py -f memory.lime linux.check_syscall

# macOS 内存
python vol.py -f memory.raw mac.pslist
```

---

## 四、常见取证场景工作流

### 工作流1：勒索软件事件响应

```
1. 采集内存 → AVML / WinPmem
2. 进程树分析 → pstree
   - 找到异常进程（如随机名.exe）
3. 网络连接 → netscan
   - 确认C2通信或数据外传
4. 文件扫描 → filescan + dumpfiles
   - 提取赎金记录
5. 命令行 → cmdline
   - 查看勒索软件的执行参数
6. 注册表 → printkey Run/RunOnce
   - 检查持久化机制
```

### 工作流2：内网横向移动调查

```
1. 进程识别 → pstree → 找到 PowerShell/cmd.exe 异常启动
2. 网络连接 → netscan → 检查 445/SMB、5985/WinRM 连接
3. 凭据转储检测 → lsadump → 识别 LSASS 访问
4. 计划任务 → 注册表检查 Task Scheduler
5. WMI 检测 → 事件日志转储分析
```

### 工作流3：Linux 服务器入侵溯源

```
1. pslist → 识别未知进程
2. check_syscall → 检测系统调用表修改
3. bash → 恢复 bash 历史命令
4. check_proc_maps → 检测进程注入
5. lsof → 恢复打开的文件
6. ifconfig → 检查网络配置
```

---

## 五、内存取证工具链整合

```
采集:  AVML/WinPmem/LiME → memory.dump
      ↓
分析:  Volatility → 进程/网络/文件/注册表
      ↓
签名:  YARA → 扫描进程内存(恶意代码特征)
      ↓
报告:  MISP/ELK → 威胁情报关联
```

---

---

## 六、Volatility 3 新特性

### 6.1 自动化 Profile 检测

```bash
# Volatility 3 自动识别 OS 版本（不需要 --profile）
python vol.py -f memory.dump windows.info
# 输出：
# Major/Minor: 10.0.19041
# Is64Bit: True
# NtBuildLab: 19041.vb_release.191206-1406

# 列出所有可用插件
python vol.py -f memory.dump windows.
python vol.py -f memory.dump linux.
python vol.py -f memory.dump mac.

# 符号表（ISF 格式）
python vol.py -f memory.dump isfinfo
```

### 6.2 多层操作系统支持

```bash
# Windows 插件
windows.pslist windows.psscan windows.netscan windows.filescan
windows.cmdline windows.malfind windows.hashdump windows.lsadump
windows.registry.hivelist windows.registry.printkey

# Linux 插件
linux.pslist linux.check_syscall linux.proc_maps linux.elfs
linux.bash linux.lsof linux.check_idt linux.tty_check

# macOS 插件
mac.pslist mac.proc_maps mac.netstat mac.lsmod mac.ifconfig
```

---

## 七、高级分析技巧

### 7.1 进程注入检测

```bash
# 检测已知注入方式
python vol.py -f memory.dump windows.malfind
# 检查 VAD (Virtual Address Descriptor) 权限异常

# 手动检测步骤：
# 1. 列出所有进程
# 2. 分析每个进程的 VAD
python vol.py -f memory.dump windows.vadinfo --pid <PID> --output=dot > vad.dot
# 可视化 VAD 树

# 3. 寻找 RWX 权限的内存区域（高危）
python vol.py -f memory.dump windows.vadinfo | grep "PAGE_EXECUTE_READWRITE"
```

### 7.2 时间线重建

```bash
# 多源时间戳合并
# 1. 进程创建时间
python vol.py -f memory.dump windows.psscan | awk '{print $3, $4, "PROCESS", $1, $2}'

# 2. MFT 时间戳
python vol.py -f memory.dump windows.mftscan.MFTScan --output body > mft_body.txt

# 3. 注册表最后写入时间
python vol.py -f memory.dump windows.registry.hivelist

# 4. 网络连接建立时间
# Volatility 2: connscan 输出中的时间
# Volatility 3: netscan 中的 Created 时间
```

### 7.3 内核模块分析

```bash
# Windows 驱动分析
python vol.py -f memory.dump windows.modules
python vol.py -f memory.dump windows.driverscan

# 检查无签名驱动（可疑）
python vol.py -f memory.dump windows.modules | grep -v "Microsoft\|Verified"

# Linux 内核模块
python vol.py -f memory.lime linux.lsmod
python vol.py -f memory.lime linux.check_modules

# 检查隐藏的内核模块
# 对比 lsmod 和扫描结果
```

---

## 八、实操练习

```
练习1：分析勒索软件感染的内存
1. 采集感染后的内存镜像
2. 用 pstree 查看进程关系
3. 用 cmdline 查看启动参数
4. 用 netscan 查找 C2 连接
5. 用 filescan 找到勒索信文件

练习2：模拟内网横向移动调查
1. 找到 wmiexec/psexec 痕迹
2. 分析异常的父子进程关系
3. 提取传输到目标的文件

练习3：凭据提取演练
1. 创建一个包含密码的内存镜像
2. 用 hashdump 提取 NTLM 哈希
3. 用 lsadump 提取 LSA 凭据
4. 搜索内存中的明文密码
```

---

> 📖 本文为"网安百宝箱"课程配套读物。更新于 2026-06-18
