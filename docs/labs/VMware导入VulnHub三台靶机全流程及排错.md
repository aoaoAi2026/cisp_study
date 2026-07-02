# VMware 导入 VulnHub 三台虚拟机靶机全流程及排错（Jangow + Kioptrix + DC-1）

> 📌 **一句话简介**：VulnHub 是全世界最大的「渗透测试虚拟机靶场」仓库，里面几百台官方封装好的虚拟机，每台就是一个真实的小服务器（有真实的内核、真实的 Apache/MySQL、真实的漏洞）。你把它们导入 VMware 后，用 Kali 去「黑」它，以此练习完整渗透流程：**信息收集 → 漏洞扫描 → 漏洞利用 → 提权 → 拿 Flag**。
>
> 课程 Day32-35 与 Day39 指定了三台入门级 VulnHub 靶机：
> - 🏷️ Day32-34：**Jangow 1.0.1**（入门经典，内核漏洞 / CMS 组合拳）
> - 🏷️ Day35 ：**Kioptrix L1**（SMB 服务漏洞经典入门）
> - 🏷️ Day39 ：**DC-1**（Drupal CVE-2018-7600 Drupalgeddon 2 RCE 入门）

---

## 一、前提准备

### 1.1 你的环境（默认）

| 项目 | 值 |
|------|-----|
| **VM 软件** | VMware Workstation Pro（推荐 16/17，Player 版也行） |
| **Windows 宿主机 IP**（VMware NAT 默认网关）| 192.168.108.1 / 24 |
| **Kali 你自己的攻击机 IP** | 192.168.108.128 / 24（NAT 模式）|
| **VMware NAT 子网** | 192.168.108.0/24（这三台靶机和 Kali 要在同一个 NAT 网段里！⭐）|

### 1.2 ⭐ 重中之重：三台靶机都要设为「NAT 模式」

很多人第一次玩 VulnHub 踩的最大坑：**导入后默认把靶机网络设成「桥接模式」或「Host-Only」**，结果 Kali（192.168.108.128）根本扫不到靶机！

**统一做法：** 三台靶机导入后 → 右键虚拟机 → `Settings` → `Network Adapter` → 勾 **NAT**（和你的 Kali 一模一样）。

这样三台靶机启动后，DHCP 会自动拿到 `192.168.108.x` 段的 IP，Kali 用 nmap 扫一下就能发现。

---

## 二、三台靶机下载地址（官方 + 国内镜像）

每台 VulnHub 虚拟机都能从官方 vulnhub.com 免费下载，但官方 SourceForge/Google Drive 国内速度慢。下面每台都给了：
- 🏠 官方下载地址（首选）
- 🇨🇳 国内镜像（百度网盘/夸克/教育网，非官方但速度快，校验 MD5 一致）
- 📥 文件格式（.zip / .7z / .ova / .rar）

下载解压后，**每个靶机文件夹里一定有一个 `.vmdk` 或 `.vmdk` + `.vmx` 文件**（VMware 能识别）。

### 2.1 🎯 Jangow 1.0.1（Day32-34 入门）

| 项目 | 信息 |
|------|------|
| **官方页** | https://www.vulnhub.com/entry/jangow-101,754/ |
| **官方下载 (VulnHub)** | `https://download.vulnhub.com/jangow/jangow-v1.0.1.7z` |
| **大小** | 约 **570MB** |
| **解压后格式** | `.vmdk` + `.vmx`（VMware 直接打开 `.vmx` 就行） |
| **MD5 校验** | 官方给 `f402ac7e42e9c2ef5d0e7e96b2f86f34`（下载完校验以防损坏）|
| **难度** | ⭐⭐ 入门 |
| **预计考点** | ① Web 目录爆破 → 发现 CMS/bwapp ② 命令注入拿 shell ③ 内核漏洞提权 Dirty COW 或 overlayfs |

### 2.2 🎯 Kioptrix L1（Level 1，Day35 入门）

| 项目 | 信息 |
|------|------|
| **官方页** | https://www.vulnhub.com/entry/kioptrix-level-1-1,22/ |
| **官方下载 (VulnHub)** | `https://download.vulnhub.com/kioptrix/Kioptrix_Level_1.rar` |
| **大小** | 约 **260MB** |
| **解压后格式** | `.vmdk` 磁盘文件（注意：Kioptrix 官方给的格式是 VMware ESX，需要「转换」一下才能在 Workstation 用，下面「导入步骤」详细说） |
| **MD5 校验** | 官方给 `b132e510dab97ec7c61a1b7962994fbf` |
| **难度** | ⭐ 入门（经典 SMB 入门靶机） |
| **预计考点** | ① nmap 扫端口发现 139/445 NetBIOS/SMB ② 用 `enum4linux` 枚举 ③ 用 `searchsploit Samba trans2open` 或 `ms17_010` 类似 EXP 直接拿 root shell |

### 2.3 🎯 DC-1（Day39，Drupal 内核漏洞入门）

| 项目 | 信息 |
|------|------|
| **官方页** | https://www.vulnhub.com/entry/dc-1,292/ |
| **官方下载 (VulnHub)** | `https://download.vulnhub.com/dc/DC-1.zip` |
| **大小** | 约 **700MB** |
| **解压后格式** | `.ova` 单个文件（VMware `File → Open` 选 ova 就行） |
| **MD5 校验** | 官方给 `c2b0ba4fcddce41ff2878b07e6393109e` |
| **难度** | ⭐⭐ 入门 |
| **预计考点** | ① nmap 发现 80 端口 Drupal 7.x ② `droopescan` 或浏览器读 CHANGELOG.txt 知版本 ③ Drupalgeddon 2 (CVE-2018-7600) RCE 拿 shell ④ `find / -perm -4000` 找 suid 提权 |

### 2.4 🇨🇳 国内镜像汇总（官方下不动的话，这里看）

- **吾爱破解论坛**：搜「VulnHub 合集」常有人打包
- **B站 UP 主专栏**：很多 CTF/VulnHub UP 主会把常用 20 台靶机打包放网盘
- **教育网镜像**：如清华大学开源站、南大镜像偶尔会有 VulnHub 合集
- ⚠️ **重要**：**一定要跟官方 MD5 校验值一致！** 不然你花 2 小时导入一个损坏镜像，开机蓝屏就白等了。

---

## 三、通用导入流程（三台都通用）

### 第 1 步：解压 + 校验 MD5

- `.7z` 文件：Windows 用 **7-Zip**（免费）解压
- `.zip` / `.rar`：**7-Zip** 或 WinRAR 都行
- `.ova`：不用解压，OVF 就是虚拟机打包格式，VMware 直接 Import

**校验 MD5（推荐）**：
```powershell
# Windows PowerShell 5 自带命令（对下载的压缩包校验）
Get-FileHash -Algorithm MD5 .\jangow-v1.0.1.7z
# 结果和官方给的 f402ac7e42e9c2ef5d0e7e96b2f86f34 比对
```

### 第 2 步：导入 VMware Workstation

#### 情况 A：解压后有 `.vmx` 文件（如 Jangow）
```
VMware → File → Open → 选 「jangow 1.0.1.vmx」
→ 弹框问「I moved it」还是「I copied it」→ 选 「I copied it」⭐（生成新的 UUID 和 MAC 地址，防止三台靶机 MAC 冲突）
→ 启动！
```

#### 情况 B：只有 `.ova` 文件（如 DC-1）
```
VMware → File → Open → 选「DC-1.ova」
→ 弹出导入向导，给虚拟机起个名（如 DC-1），选保存位置
→ 勾选「Retain Format」（保留原格式就行，转换反而慢）
→ 等 1-2 分钟导入完成 → 开机
```

#### 情况 C：只有一堆 `.vmdk`，没有 .vmx（Kioptrix L1 常见）

Kioptrix 是最早一批 VulnHub 靶机，给的格式是 ESX 导出的，Workstation 不能直接开。手动新建 VM：

```
VMware → File → New Virtual Machine
  → Typical（典型）
  → I will install the operating system later
  → Guest OS: Linux → Version: Ubuntu 64-bit / Other Linux 2.6.x（随便选，内核都差不多）
  → Name: Kioptrix L1
  → Disk: Do not convert → Use an existing virtual disk → 选你解压出来的「Kioptrix.vmdk」
  → Finish！
```

### 第 3 步：⭐⭐⭐ 改「网络适配器」为 NAT（必须！否则 Kali 扫不到）

**每台靶机都要做这 3 项设置（重要程度：💯）**：
```
虚拟机 → 右键 → Settings → Hardware → Network Adapter
  → 勾 ✅ NAT（不是 Bridged，不是 Host-Only！）
  → Device status：✅ Connect at power on
  → 勾 ✅ Notify me if a network cable is unplugged（可选，但方便看网络状态）
OK → Save
```

### 第 4 步：开机 + 打第一个快照（黄金快照）

开机后等 **1-2 分钟**，等 Linux 系统里的网络服务、SSH、Web 服务全部启动。然后：
```
VMware → VM → Snapshot → Take Snapshot
名字：「初次启动·干净」 + 打勾
```
💡 **为啥要打快照？**
- VulnHub 每台你打穿之后，系统就被你改乱了（删了文件、改了密码、安了后门），第二天想重新练「干净环境」时，恢复快照就能 10 秒回到出厂状态。
- 你提权失败把内核弄崩了（Kioptrix L1 的某些 SMB EXP 会崩系统）→ 恢复快照重来。
- **每一台至少打 1 个快照，强烈建议！**

### 第 5 步：Kali 扫网段，找到靶机 IP

靶机启动后，**从 Kali SSH 终端**扫描 NAT 网段：
```bash
# 方法 1：nmap 快速 ping 扫（推荐，最快 20 秒）
nmap -sn 192.168.108.0/24 -oG - | grep "Up"
# 输出里除了 1（网关）、128（Kali 自己）、2（DHCP 服务）之外的，就是靶机

# 方法 2：arp-scan（MAC 层扫描，有的靶机禁 ping 时用）
sudo arp-scan --localnet 2>/dev/null | grep -v "MAC"

# 方法 3：配合靶机自己在 VMware Console 看 Login Banner
# 有些靶机会在 VMware 黑框框登录界面直接显示 IP：比如「CentOS release 6.5 IP: 192.168.108.130」
```

找到 IP 后记下来，后面就是 Kali 渗透流程了（你课程里 Day32-35、Day39 详细讲）。

---

## 四、三台靶机「开机后 5 分钟快速自检」

如果你扫了半天没找到靶机 IP，按下面排：

### Jangow 1.0.1
- VM 黑框框里如果看到 `Ubuntu 16.04 LTS jangow tty1 login:` → 系统起来了 ✅
- `nmap -sn 192.168.108.0/24` 应该多出一个 `192.168.108.13x` 左右的 IP
- 用浏览器打开那个 IP：`http://192.168.108.13X/` → 应该看到 Apache2 Ubuntu 默认页（然后爆破目录找站点）
- 如果长时间黑屏：VMware → VM → Power → Reset（软重启）

### Kioptrix L1
- 黑框框出现：`Kioptrix login:` → 系统起来了 ✅
- `nmap -sV -p139,445 192.168.108.0/24` 扫 Samba 服务（Kioptrix 标靶就是 SMB 漏洞）
- **常见坑**：开不了机，提示「Virtual disk is not a valid VMware virtual disk」→ 用「情况 C：新建 VM 挂老 vmdk」方式，或者把 VMware 改成「IDE 磁盘」（默认 SCSI 在老系统里没驱动）
- 如果 Kioptrix 进去就是 kernel panic（内核崩溃）：一般是磁盘模式不对，尝试 Settings → Hard Disk → Advanced → Virtual Device Node → 选 IDE 0:0

### DC-1
- DC-1 导入 OVA 最稳，一般不会出问题
- 黑框里出现：`DC-1 login:` → 系统起来了 ✅
- nmap 扫 80 端口：`nmap -sT -p80 192.168.108.0/24`
- 打开 IP 能看到 Drupal 的「Powered by Drupal」蓝色登录框 → 正常 ✅

---

## 五、高频问题 & 排错表（收藏好）

| # | 问题 | 现象 | 解决方法 |
|---|------|------|----------|
| 1 | ⭐ **Kali nmap 扫不到靶机 IP** | nmap 只扫到网关和自己 | ① 检查靶机 Network Adapter 是否是 **NAT** 模式 ② 等靶机开机 2 分钟让网络起 ③ VMware → VM → Settings → Network Adapter → 先 Disconnected 再 Connect（模拟拔插网线）④ 不行就重启靶机 |
| 2 | 提示「This virtual machine may have been moved or copied」 | 开机第一个弹窗 | 永远选 **「I Copied It」**，生成新 MAC/UUID（防止 IP 冲突）|
| 3 | **MAC 地址冲突**：三台靶机启动后 IP 总是同一个 | arp-scan 发现 2 台同一个 IP | 每台单独：VM → Settings → Network Adapter → Advanced → Generate 重新生成 MAC，然后重启机器 |
| 4 | VMware 开机黑屏停在「Press any key to start GRUB…」然后卡住 | 等 10 分钟都不动 | ① 快照恢复 ② 不行就关机 → VM → Settings → Display → Accelerate 3D graphics 取消掉（老系统不兼容 3D 加速）|
| 5 | Kioptrix 「Kernel panic」蓝屏 | 黑框一片红色 panic | 硬盘控制器从 SCSI 改 **IDE**：Settings → Hard Disk → Advanced → Virtual Device Node: IDE 0:0；也可能 RAM 太少，加 512MB |
| 6 | Kioptrix 启动后网络连不上，`ifconfig` 只看到 lo | eth0 没有 DHCP 拿到 IP | 登录 root（默认密码空）→ 手动 `dhclient eth0` 或 `ifconfig eth0 up && dhclient eth0` |
| 7 | Jangow/DC-1 系统起来了，但 80 端口 curl 失败 | nmap 80 端口 filtered | 等 2-3 分钟再试（Apache + Drupal 启动慢）；或靶机 VMware 登录后 `systemctl status apache2` 看服务有没有起 |
| 8 | 压缩包解压失败「Unknown format」| 7-Zip 解压 .7z 报文件格式错误 | 下载损坏了！重新下载（最好换个镜像源）+ 用 MD5 校验 |
| 9 | .ova 导入时报错「Failed to deploy OVF package: manifest line 1」| | OVA 文件损坏，重新下载；或用 7-Zip 解压 OVA（其实就是个 tar），手动创建 VM + 挂 vmdk |
| 10 | **靶机启动后一 ping 就断（Windows Defender 拦）**| Windows 上 VMware NAT 的出站/入站规则被 Defender 防火墙挡了 | Windows 搜索「Windows Defender Firewall」→「允许应用通过防火墙」→ 把 VMware Workstation、VMware NAT Service 打勾（私网 + 公网都打）|
| 11 | 共享文件夹/复制粘贴不好使 | | VulnHub 靶机一般没装 VMware-Tools（故意的），别装！装了反而可能改变靶机状态。渗透就用 Kali 纯网络方式打。 |
| 12 | OVA 导入磁盘格式「IDE / SCSI」冲突 | 导入很慢/失败 | Advanced → Disk Mode → 勾「Independent - Persistent」；或导入后手动删原有 vmdk，再新建挂（同 Kioptrix 情况 C）|
| 13 | VMware 提示「至少需要 10GB 磁盘空余」| 你 C 盘满了 | 把虚拟机保存路径改到 D 盘（非系统盘）；Jangow 570MB + Kioptrix 260MB + DC-1 700MB ≈ 解压后占用 15GB 左右 |

---

## 六、推荐的 VMware 资源设置（每台）

三台靶机性能要求不高，照着下表给就行（别给太多浪费你 Windows 资源）：

| 设置项 | Jangow | Kioptrix L1 | DC-1 |
|--------|--------|-------------|------|
| 内存 (RAM) | 1024 MB (1GB) | 512 MB (够了，老系统) | 1536 MB (Drupal 要一点) |
| CPU 核心数 | 1 核 | 1 核 | 2 核 (跑 Drupal 并发多点) |
| 硬盘 | 原有 vmdk (不用改) | 原有 vmdk | 原有 vmdk |
| CD/DVD | 移除 | 移除 | 移除 |
| USB | 移除 | 移除 | 移除 |
| 声卡 Printer 等外设 | 全部移除 | 全部移除 | 全部移除 |
| Network | ⭐ NAT ⭐ | ⭐ NAT ⭐ | ⭐ NAT ⭐ |

💡 **记得把三台的 MAC 地址都「随机生成」一次**（Settings → Network Adapter → Advanced → Generate），防止 DHCP 分配 IP 冲突。

---

## 七、最终成果清单 Checklist

导入完三台后，依次打勾确认：

```
导入 + 开机 + 打快照 自检 Checklist

[ ] Jangow 1.0.1
    [ ] VMware 能打开 .vmx（或新建挂 vmdk）
    [ ] Network Adapter = NAT
    [ ] 黑框里看到 jangow login: 正常
    [ ] Kali nmap -sn 扫得到 IP（记下）
    [ ] Snapshot: Jangow-Init 打好 ✅
    [ ] 浏览器访问 IP 能看到 Apache 默认页

[ ] Kioptrix L1
    [ ] VMware 新建 VM + 挂 vmdk (IDE 模式)
    [ ] Network Adapter = NAT
    [ ] 黑框里看到 Kioptrix login: 正常
    [ ] Kali nmap -p139,445 扫得到 SMB 端口
    [ ] Snapshot: KioptrixL1-Init 打好 ✅

[ ] DC-1
    [ ] File → Open 导入 DC-1.ova 成功
    [ ] Network Adapter = NAT
    [ ] 黑框里看到 DC-1 login: 正常
    [ ] Kali nmap -p80 扫得到
    [ ] 浏览器访问 IP 能看到 Drupal 蓝色登录框
    [ ] Snapshot: DC1-Init 打好 ✅
```

🎉 三台全部打勾后，你的 **VulnHub 入门三件套** 就准备好了！后面课程 Day32-Day35、Day39 渗透流程就按讲义来 Kali 上执行就行。祝你拿 Flag 顺利！🦾
