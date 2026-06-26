# 第2章 Kali Linux渗透测试系统

## 2.1 Kali Linux概述

Kali Linux是基于Debian的Linux发行版，专为数字取证和渗透测试而设计。它由Offensive Security公司维护和开发，前身是BackTrack Linux。Kali Linux预装了数百个渗透测试工具，涵盖了信息收集、漏洞分析、漏洞利用、权限维持、无线攻击、逆向工程等各个领域，是网络安全从业者必备的工具平台。

### 2.1.1 Kali Linux的特点

- **预装工具丰富**：包含600+个渗透测试工具，涵盖各个安全领域
- **开源免费**：完全开源，用户可以自由下载、使用和修改
- **多平台支持**：支持x86、x86_64、ARM等多种架构
- **定制化程度高**：可以根据需要自定义工具集和系统配置
- **社区活跃**：拥有庞大的用户社区和丰富的学习资源
- **定期更新**：工具和系统定期更新，保持最新状态

### 2.1.2 系统硬件要求

| 配置类型 | 最低要求 | 推荐配置 |
|---------|---------|---------|
| CPU | 1GHz双核 | 2GHz四核及以上 |
| 内存 | 2GB | 8GB及以上 |
| 硬盘空间 | 20GB | 50GB及以上（SSD推荐） |
| 显卡 | 支持3D加速 | 独立显卡（GPU破解推荐） |
| 网络 | 有线网卡 | 无线网卡（支持监控模式） |

---

## 2.2 Kali Linux下载与安装

### 2.2.1 【通用】官方下载

> **适用系统**：Windows / Linux / macOS

**步骤1：访问官方网站**

打开浏览器访问Kali Linux官方网站：https://www.kali.org/get-kali/

> **截图位置**：浏览器地址栏显示上述URL，页面顶部应有Kali Linux Logo

**步骤2：选择下载类型**

页面提供多种下载版本：

| 版本类型 | 说明 | 适用场景 |
|---------|------|---------|
| **Kali Linux Installer** | 标准安装版 | 全新安装到物理机或虚拟机 |
| **Kali Linux Live** | Live版，可引导 | 体验、应急启动、取证 |
| **Kali Linux NetInstaller** | 网络安装版 | 最小化ISO，网络下载包 |
| **Kali Linux Virtual Machines** | 虚拟机镜像 | VMware/VirtualBox直接导入 |
| **Kali Linux ARM** | ARM架构版 | 树莓派、手机、平板 |

> **截图位置**：页面中央应有版本选择卡片列表

**步骤3：选择安装程序类型（以Installer为例）**

点击 "Kali Linux Installer Images" 进入下载页面。

可选版本：
- **Installer**（推荐新手）：完整安装，60GB+空间
- **Installer & Guest Tools**（含VMware/VirtualBox增强工具）
- **Weekly Build**（周更版本，工具最新）

> **截图位置**：页面应有 "Installer Images" 标题，下方列出不同版本的下载链接

**步骤4：选择架构和下载方式**

- 架构：选择 **AMD64**（64位）或 ARM64
- 下载方式：
  - 直接下载（较慢）
  - Torrent下载（推荐，需要迅雷等下载工具或磁力链接）

**步骤5：下载链接示例**

```
# 完整版ISO（2024.1）
https://cdimage.kali.org/kali-2024.1/kali-linux-2024.1-installer-amd64.iso

# 每周更新版
https://cdimage.kali.org/kali-weekly/kali-linux-weekly-installer-amd64.iso

# 虚拟机镜像（含增强工具）
https://cdimage.kali.org/kali-2024.1/kali-linux-2024.1-vmware-amd64.7z
```

**步骤6：验证下载完整性（推荐）**

> **截图位置**：官网下载页面底部应有 SHA256 校验和

```bash
# Windows PowerShell 验证
Get-FileHash .\kali-linux-2024.1-installer-amd64.iso -Algorithm SHA256

# 预期输出示例：
# Algorithm  Hash
# ---------  ----
# SHA256     1a2b3c4d5e6f...（64位十六进制字符串）

# Linux/macOS 验证
sha256sum kali-linux-2024.1-installer-amd64.iso

# 预期输出示例：
# 1a2b3c4d5e6f...  kali-linux-2024.1-installer-amd64.iso

# 对比官网提供的SHA256值
# 访问：https://docs.kali.org/introduction/download-official-kali-linux-image
# 确认计算出的哈希值与页面上的值一致
```

> **提示**：如果哈希值不匹配，说明文件损坏或被篡改，请重新下载。

---

### 2.2.2 【Windows】VMware Workstation 配置

> **适用系统**：Windows（需要 VMware Workstation Pro/Fusion）

#### 准备工作

```
【VMware 17.x 操作界面】

确认已安装 VMware Workstation 17.x
下载地址：https://www.vmware.com/products/workstation-pro.html
```

**步骤1：创建新虚拟机**

```
操作：文件 → 新建虚拟机（或按 Ctrl+N）
```

> **截图位置**：VMware菜单栏 → "文件" 菜单 → "新建虚拟机"

**步骤2：选择配置类型**

```
弹出"新建虚拟机向导"
选择：自定义(高级) → 下一步
```

> **截图位置**：向导第一步 "新建虚拟机向导" 对话框

**步骤3：选择硬件兼容性**

```
硬件版本：Workstation 17.x（推荐）
→ 下一步
```

> **注意**：如果使用旧版VMware，选择对应版本（16.x/15.x等）

**步骤4：安装客户机操作系统**

```
选择：稍后安装操作系统 → 下一步
```

> **原因**：先配置硬件，再挂载ISO安装

**步骤5：选择客户机操作系统**

```
客户机操作系统：Linux
版本：Ubuntu 64位 → 下一步
```

> **注意**：Kali基于Debian，Ubuntu选项兼容性最好。如果有Debian选项可选Debian 64位。

**步骤6：命名虚拟机**

```
虚拟机名称：Kali-Linux-2024.1
安装位置：D:\VMs\Kali（点击"浏览"选择）
→ 下一步
```

> **建议**：使用SSD，保留足够空间（至少60GB）

> **截图位置**：显示虚拟机名称和存储路径的输入框

**步骤7：处理器配置**

```
处理器数量：1
每个处理器的核心数量：2（推荐共2核）
→ 下一步
```

> **验证**：按 Ctrl+Shift+Esc 打开任务管理器，确认物理机有足够核心

**步骤8：虚拟机内存**

```
内存大小：4096 MB（推荐，最少2048MB）
→ 下一步
```

> **截图位置**：内存滑块，可直接输入数值

**步骤9：网络类型**

```
选择：使用网络地址转换(NAT) → 下一步
```

> **说明**：NAT模式虚拟机可访问外网，外部无法直接访问虚拟机，保护虚拟机安全

**步骤10：I/O控制器类型**

```
选择：LSI Logic（推荐）→ 下一步
```

**步骤11：虚拟磁盘类型**

```
选择：SCSI → 下一步
```

**步骤12：选择磁盘**

```
选择：创建新虚拟磁盘 → 下一步
```

**步骤13：指定磁盘容量**

```
最大磁盘大小：80 GB（推荐，Kali占用较大）
勾选：将虚拟磁盘拆分成多个文件 → 下一步
```

> **说明**：分开存储方便移动虚拟机

**步骤14：指定磁盘文件**

```
磁盘文件名：Kali-Linux-2024.1.vmdk
→ 下一步
```

**步骤15：完成虚拟机创建**

```
点击：完成
```

> **可选**：勾选"创建后开启此虚拟机"立即启动

**步骤16：编辑虚拟机设置（挂载ISO）**

```
在VMware主界面选中Kali虚拟机
右键 → 编辑设置（或点击"编辑虚拟机设置"按钮）
```

> **截图位置**：虚拟机设置对话框

**步骤17：挂载ISO镜像**

```
硬件标签页：
→ CD/DVD (IDE) → 使用ISO映像文件 → 浏览
→ 选择下载的 kali-linux-xxx-installer-amd64.iso
→ 确定
```

> **截图位置**：CD/DVD设置面板，显示"使用ISO映像文件"和浏览按钮

**步骤18：启动安装**

```
点击：开启此虚拟机
VMware会自动从ISO启动
```

---

### 2.2.3 【通用】VirtualBox 配置

> **适用系统**：Windows / Linux / macOS

#### 准备工作

```
【VirtualBox 7.0 操作界面】

确认已安装 VirtualBox
下载地址：https://www.virtualbox.org/wiki/Downloads

推荐版本：VirtualBox 7.0.x 或更高
```

**步骤1：新建虚拟机**

```
点击：新建 按钮（或菜单 机器 → 新建）
```

> **截图位置**：VirtualBox主界面，左上角"新建"按钮

**步骤2：名称和系统**

```
名称：Kali-Linux-2024
资料夹：D:\VMs\VirtualBox\Kali（或 Linux 的 ~/VirtualBox/Kali）
类型：Linux
版本：Debian (64-bit) → 下一步
```

> **截图位置**：新建虚拟机向导第一步

**步骤3：内存大小**

```
内存大小：4096 MB
→ 下一步
```

> **截图位置**：内存分配滑块

**步骤4：硬盘**

```
选择：现在创建虚拟硬盘 → 创建
```

**步骤5：硬盘文件类型**

```
选择：VDI (VirtualBox磁盘映像) → 下一步
```

**步骤6：存储方式**

```
选择：动态分配 → 下一步
```

> **优点**：用多少占多少空间

**步骤7：文件位置和大小**

```
位置：默认或点击文件夹图标选择
大小：80 GB → 创建
```

> **截图位置**：显示文件位置和大小输入框

**步骤8：配置虚拟机**

```
选中Kali虚拟机 → 设置（齿轮图标）
```

> **截图位置**：VirtualBox主界面，选中的虚拟机高亮显示

**步骤9：系统配置**

```
系统 → 主板：
  启动顺序：取消勾选"软盘"，勾选"光驱"、"硬盘"
  扩展特性：勾选"启用IO APIC"

系统 → 处理器：
  处理器数量：2
  扩展特性：勾选"启用PAE/NX"
```

> **截图位置**：系统设置面板，有"主板"和"处理器"两个标签页

**步骤10：网络配置**

```
网络 → 适配器1：
  启用网络适配器：勾选
  连接方式：NAT
  高级 → 混杂模式：拒绝
```

> **截图位置**：网络设置面板

**步骤11：挂载ISO**

```
存储 → 控制器:IDE：
  点击"没有盘片"图标（右侧）
  选择"选择磁盘文件"
  浏览找到 kali-linux-xxx-installer-amd64.iso → 打开
```

> **截图位置**：存储设置面板，显示控制器:IDE和"没有盘片"

**步骤12：启动安装**

```
点击：启动 按钮（绿色箭头）
```

> **截图位置**：VirtualBox主界面，选中的虚拟机右侧有"启动"按钮

---

### 2.2.4 【通用】Kali Linux 系统安装（图形化）

> **适用系统**：Windows（VMware/VirtualBox）/ Linux（VMware/VirtualBox/物理机）

#### Kali安装程序详细步骤

**步骤1：启动选择**

```
出现 Kali GNU/Linux 启动菜单
默认选择：Graphical install（图形安装）
→ 按 Enter
```

> **截图位置**：黑色背景的GRUB启动菜单，显示多个选项

> **说明**：如果选择"Install"则是文本安装，图形安装更直观

**步骤2：选择语言**

```
选择语言：中文（简体）→ 继续
```

> **截图位置**：语言选择下拉列表

> **注意**：英文环境更稳定，但中文更易理解。初学者可选中文。

**步骤3：选择区域**

```
你的区域：中国 → 继续
```

**步骤4：配置键盘**

```
键盘布局：汉语 → 继续
```

> **备选**：选择"美式英语"（推荐，更稳定）

**步骤5：网络自动配置**

```
等待 DHCP 获取IP地址...
如果使用NAT，会自动获取 192.168.x.x 网段IP
→ 继续
```

> **预期输出**：底部显示 "正在配置网络..."

**步骤6：设置主机名**

```
主机名：kali → 继续
```

> **说明**：这个名字会显示在命令行提示符，如 `kali@kali:~$`

**步骤7：设置域名（可选）**

```
域名：留空 → 继续
```

> **说明**：个人/家庭学习环境通常不需要域名

**步骤8：设置普通用户**

```
完整用户名：kali user → 继续
用户名：kaliuser → 继续
密码：Kali@2024! → 继续（输入两次确认）
```

> **注意**：Kali 2020.1及以后版本默认使用普通用户，root密码与此相同

> **预期输出**：
> ```
> 正在设置用户...
> 请为此用户选择密码：
> ```

**步骤9：磁盘分区**

```
选择：向导 - 使用整个磁盘 → 继续
选择磁盘：选择 "SCSI3 (0,0,0) (sda)" → 继续
分区方案：选择 "将所有文件放在同一个分区中(推荐新手)" → 继续
查看分区设置 → 继续
选择：结束分区设定并将修改写入磁盘 → 继续
```

> **截图位置**：分区方案选择界面

> **说明**：新手建议选第一个选项

**步骤10：确认分区写入**

```
弹出警告："是否将改动写入磁盘？"
选择：是 → 继续
```

> **警告**：此操作会格式化磁盘，请确保已备份重要数据

**步骤11：等待安装**

```
进度条显示：
正在安装基本系统...
正在复制文件...
正在安装GRUB启动引导器...
```

> **预期输出**：
> ```
> [ !! ] 安装程序未能完成
> ```
> （错误提示，需检查）

> **预计时间**：10-20分钟

**步骤12：安装GRUB**

```
选择：是 安装GRUB引导程序 → 继续
选择安装位置：/dev/sda（引导驱动器）→ 继续
```

> **截图位置**：GRUB安装位置选择界面

**步骤13：完成安装**

```
安装完成提示
选择：继续 重启虚拟机
```

> **预期输出**：屏幕显示 "系统将在重启后准备就绪"

**步骤14：首次登录**

```
重启后出现登录界面
用户名：kaliuser（或你设置的用户名）
密码：Kali@2024!（你设置的密码）
登录后进入桌面环境（默认Xfce）
```

> **截图位置**：登录界面，显示用户名输入框和密码输入框

> **桌面环境**：默认使用Xfce轻量级桌面，占用资源少

**步骤15：打开终端验证**

```
按 Ctrl+Alt+T 打开终端
或点击左上角应用程序菜单 → 附件 → 终端

# 检查系统信息
cat /etc/os-release

# 预期输出：
# NAME="Kali GNU/Linux"
# VERSION="2024.1"
# ID=kali
# PRETTY_NAME="Kali GNU/Linux"
# VERSION_ID="2024.1"
```

---

## 2.3 初始设置与配置

### 2.3.1 【通用】配置国内镜像源

> **适用系统**：Windows（VMware/VirtualBox）/ Linux

**步骤1：备份原文件**

```bash
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
```

> **预期输出**：（无输出表示成功）

**步骤2：查看当前源配置**

```bash
cat /etc/apt/sources.list
```

> **预期输出**：
> ```
> deb http://http.kali.org/kali kali-rolling main non-free contrib
> deb-src http://http.kali.org/kali kali-rolling main non-free contrib
> ```

**步骤3：编辑源列表**

```bash
sudo vim /etc/apt/sources.list
```

> **vim操作**：按 `i` 进入编辑模式，按 `Esc` 退出编辑模式，输入 `:wq` 保存退出

**步骤4：替换为国内镜像源**

> **说明**：删除原有内容，添加以下镜像源（任选其一）

```bash
# 阿里云镜像源（推荐）
deb https://mirrors.aliyun.com/kali kali-rolling main non-free contrib
deb-src https://mirrors.aliyun.com/kali kali-rolling main non-free contrib

# 中科大镜像源
deb https://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib
deb-src https://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib

# 腾讯云镜像源
deb https://mirrors.cloud.tencent.com/kali kali-rolling main non-free contrib
deb-src https://mirrors.cloud.tencent.com/kali kali-rolling main non-free contrib

# 清华镜像源
deb https://mirrors.tuna.tsinghua.edu.cn/kali kali-rolling main contrib non-free
deb-src https://mirrors.tuna.tsinghua.edu.cn/kali kali-rolling main contrib non-free
```

**步骤5：保存并退出**

```
vim操作：按 Esc，输入 :wq，回车
```

**步骤6：更新软件包列表**

```bash
sudo apt update
```

> **预期输出**：
> ```
> 获取:1 https://mirrors.aliyun.com/kali kali-rolling InRelease [30.5 kB]
> 获取:2 https://mirrors.aliyun.com/kali kali-rolling/main amd64 Packages [18.6 MB]
> ...
> 命中:6 https://mirrors.aliyun.com/kali kali-rolling/contrib amd64 Packages
> 正在读取软件包列表... 完成
> ```

**步骤7：如遇签名错误，执行以下命令**

```bash
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys ED654F4208A06F98
sudo apt update
```

> **预期输出**：
> ```
> Executing: /tmp/apt-key-gpghome.xxx/gpg.asc [--keyserver keyserver.ubuntu.com]...
> gpg: key ED654F4208A06F98: public key imported
> gpg: Total number processed: 1
> gpg:               imported: 1
> ```

### 2.3.2 【通用】系统更新

```bash
# 更新软件包列表
sudo apt update

# 更新已安装的软件包
sudo apt upgrade -y

# 全面系统更新（包括内核等）
sudo apt dist-upgrade -y

# 清理不需要的包
sudo apt autoremove -y
sudo apt clean
```

> **预期输出**：
> ```
> 正在读取软件包列表... 完成
> 正在分析软件包的依赖关系树... 完成
> 正在读取状态信息... 完成
> 升级了 0 个软件包，新安装了 0 个软件包，要卸载 0 个软件包，有 0 个软件包未被升级。
> ```

> **提示**：系统更新可能需要较长时间，建议在网络状况良好时进行

### 2.3.3 【通用】安装中文环境

#### 安装中文字体

```bash
sudo apt install -y fonts-wqy-microhei fonts-wqy-zenhei xfonts-intl-chinese
```

> **预期输出**：
> ```
> 正在设置 fonts-wqy-zenhei (0.9.45-6) ...
> 正在设置 fonts-wqy-microhei (0.2.0-beta-3) ...
> ```

#### 安装中文输入法

```bash
sudo apt install -y fcitx fcitx-googlepinyin fcitx-table-wbpy
```

> **预期输出**：
> ```
> 正在设置 fcitx (1:4.2.9.7-1) ...
> 正在设置 fcitx-googlepinyin (2.1.0-2) ...
> 正在设置 fcitx-table-wbpy (1.0.0-0.2) ...
> ```

#### 配置输入法环境变量

```bash
echo 'export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"' >> ~/.profile
```

#### 启动输入法配置

```bash
im-config -n fcitx
```

> **弹窗**：首次运行会弹出对话框，选择 "fcitx" → 确定

#### 重启系统

```bash
sudo reboot
```

> **重启后**：按 Ctrl+空格 切换输入法

### 2.3.4 【通用】安装虚拟机增强工具

#### VMware 安装 open-vm-tools

```bash
sudo apt update
sudo apt install -y open-vm-tools open-vm-tools-desktop
```

> **预期输出**：
> ```
> 正在设置 open-vm-tools (2:12.3.5-1) ...
> 正在设置 open-vm-tools-desktop (2:12.3.5-1) ...
> ```

> **完成后重启**：
```bash
sudo reboot
```

#### VirtualBox 安装增强功能

```bash
sudo apt install -y virtualbox-guest-utils virtualbox-guest-x11 virtualbox-guest-dkms
```

> **预期输出**：
> ```
> 正在设置 virtualbox-guest-utils (7.0.12-1) ...
> 正在设置 virtualbox-guest-x11 (7.0.12-1) ...
> 正在设置 virtualbox-guest-dkms (7.0.12-1) ...
> ```

> **完成后重启**：
```bash
sudo reboot
```

#### 验证安装

```bash
# VMware 查看工具版本
vmware-toolbox-cmd -v

# 预期输出：
# 12.3.5 (build-22589665)

# VirtualBox 查看工具版本
VBoxControl --version

# 预期输出：
# Oracle VM VirtualBox Guest Additions Command Line Utilities 7.0.12
```

---

## 2.4 Kali Linux 工具分类详解

### 2.4.1 【通用】信息收集（Information Gathering）

> **用途**：收集目标网络的IP地址、端口、服务版本、子域名、邮箱等信息

| 工具名称 | 功能说明 | 基本用法 |
|---------|---------|---------|
| nmap | 端口扫描和网络探测 | `nmap -sV 192.168.1.1` |
| zenmap | nmap图形界面 | 图形化操作 |
| amass | 子域名枚举 | `amass enum -d target.com` |
| theHarvester | 邮件/域名收集 | `theHarvester -d target.com -b google` |
| sublist3r | 子域名爆破 | `sublist3r -d target.com` |
| maltego | 可视化情报收集 | 图形界面操作 |
| recon-ng | Web侦察框架 | `recon-ng` |
| spiderfoot | 自动化侦察 | `spiderfoot -l 127.0.0.1:5000` |
| spof | DNS记录查询 | `spof target.com` |
| dnsenum | DNS枚举 | `dnsenum target.com` |
| fierce | DNS扫描 | `fierce --domain target.com` |
| masscan | 高速端口扫描 | `masscan 192.168.1.0/24 -p0-65535` |

**nmap 使用示例**：

```bash
# 基本扫描
nmap 192.168.1.1

# 预期输出：
# Starting Nmap 7.94 ( https://nmap.org )
# Nmap scan report for 192.168.1.1
# Host is up (0.0010s latency).
# PORT     STATE  SERVICE
# 22/tcp   open   ssh
# 80/tcp   open   http
# 443/tcp  open   https

# 版本检测扫描
nmap -sV 192.168.1.1

# 预期输出：
# PORT     STATE  SERVICE  VERSION
# 22/tcp   open   ssh      OpenSSH 8.4
# 80/tcp   open   http     Apache httpd 2.4.51
```

### 2.4.2 【通用】漏洞分析（Vulnerability Analysis）

> **用途**：分析系统、应用程序中的已知漏洞

| 工具名称 | 功能说明 | 基本用法 |
|---------|---------|---------|
| nikto | Web服务器扫描器 | `nikto -h http://target.com` |
| wpscan | WordPress漏洞扫描 | `wpscan --url http://target.com` |
| joomscan | Joomla漏洞扫描 | `joomscan -u http://target.com` |
| droopescan | Drupal/Silverstripe扫描 | `droopescan scan Drupal -u http://target.com` |
| cmsmap | CMS识别和扫描 | `cmsmap http://target.com` |
| unix-privesc-check | Linux提权检查 | `unix-privesc-check standard` |
| linux-exploit-suggester | Linux漏洞检测 | `linux-exploit-suggester.sh` |
| searchsploit | Exploit-DB搜索 | `searchsploit apache 2.4` |

**searchsploit 使用示例**：

```bash
# 搜索漏洞
searchsploit apache 2.4

# 预期输出：
# Exploit Title                                  | Path
# -----------------------------------------------|----------------------------------
# Apache 2.4.49 - Path Traversal RCE             | linux/remote/xxxxx.py
# Apache 2.4.50 - Path Traversal RCE (RFE)       | linux/remote/xxxxx.py

# 查看漏洞详情
searchsploit -x linux/remote/xxxxx.py
```

### 2.4.3 【通用】Web应用分析（Web Application Analysis）

> **用途**：测试Web应用程序的安全漏洞

| 工具名称 | 功能说明 | 基本用法 |
|---------|---------|---------|
| burpsuite | Web代理 | 图形界面，监听8080端口 |
| sqlmap | SQL注入工具 | `sqlmap -u "http://target.com/?id=1"` |
| commix | 命令注入检测 | `commix -u "http://target.com/exec?cmd=1"` |
| XSStrike | XSS检测 | `python xsstrike.py -u http://target.com` |
| wfuzz | Web模糊测试 | `wfuzz -c -z file,wordlist.txt -u http://target.com/FUZZ` |
| dirbuster | 目录爆破（GUI） | 图形界面操作 |
| gobuster | 目录/子域名爆破 | `gobuster dir -u http://target.com -w wordlist.txt` |
| nikto | Web服务器扫描 | `nikto -h http://target.com` |
| whatweb | Web指纹识别 | `whatweb http://target.com` |
| wpscan | WordPress扫描 | `wpscan --url http://target.com` |
| joomscan | Joomla扫描 | `joomscan -u http://target.com` |
| cewl | 词频生成 | `cewl http://target.com -w wordlist.txt` |
| cutycapt | 网页截图 | `cutycapt --url=http://target.com --out=screenshot.png` |
| sslyze | SSL分析 | `sslyze target.com` |
| tlssled | TLS分析 | `tlssled target.com 443` |

**sqlmap 使用示例**：

```bash
# 检测SQL注入
sqlmap -u "http://target.com/page.php?id=1"

# 预期输出：
# [INFO] testing connection to the target URL
# [INFO] checking if the target is protected by some kind of WAF/IPS
# [INFO] testing if the target URL is stable
# [INFO] parameter "id" might be injectable

# 获取数据库
sqlmap -u "http://target.com/page.php?id=1" --dbs

# 预期输出：
# available databases [2]:
# [*] information_schema
# [*] target_db
```

### 2.4.4 【通用】密码攻击（Password Attacks）

> **用途**：破解密码、生成字典、测试认证机制

| 工具名称 | 功能说明 | 基本用法 |
|---------|---------|---------|
| hydra | 在线密码破解 | `hydra -l admin -P pass.txt ssh://target.com` |
| hashcat | GPU密码破解 | `hashcat -m 0 hash.txt wordlist.txt` |
| john | John the Ripper离线破解 | `john hash.txt` |
| cewl | 词表生成 | `cewl http://target.com -w wordlist.txt` |
| crunch | 密码字典生成 | `crunch 8 8 -t @@@@%%%% -o pass.txt` |
| medusa | 并行网络认证破解 | `medusa -u admin -P pass.txt -h target.com -M ssh` |
| ncrack | 协议破解 | `ncrack -p 22 -U users.txt -P pass.txt target.com` |

**crunch 使用示例**：

```bash
# 生成8位纯数字密码
crunch 8 8 0123456789 -o pass.txt

# 预期输出：
# Crunch will generate 100000000 lines
# Saving dictionary to pass.txt

# 生成指定字符集密码
crunch 6 6 -f /usr/share/crunch/charset.lst mixalpha -o pass.txt
```

### 2.4.5 【通用】无线攻击（Wireless Attacks）

> **用途**：测试WiFi网络安全性

| 工具名称 | 功能说明 | 基本用法 |
|---------|---------|---------|
| aircrack-ng | 无线破解套件 | `aircrack-ng capture.cap -w wordlist.txt` |
| airodump-ng | 握手包捕获 | `airodump-ng wlan0mon` |
| aireplay-ng | 注入攻击 | `aireplay-ng -9 wlan0mon` |
| airmon-ng | 监听模式 | `airmon-ng start wlan0` |
| cowpatty | WPA握手验证 | `cowpatty -r capture.cap -f wordlist.txt` |
| wifite | 自动化无线攻击 | `wifite` |

**airmon-ng 使用示例**：

```bash
# 查看无线网卡
iwconfig

# 预期输出：
# wlan0     IEEE 802.11  ESSID:off/any
#           Mode:Managed  Access Point: Not-Associated

# 开启监听模式
sudo airmon-ng start wlan0

# 预期输出：
# PHY     Interface       Driver      Chipset
# phy0    wlan0           iwlwifi     Intel Corporation
# (monitor mode enabled on mon0)

# 扫描WiFi网络
sudo airodump-ng mon0

# 预期输出：
# CH  1 ][ Elapsed: 12 s ][ 2024-01-01 12:00
#  BSSID              PWR  Beacons    #Data, #/s  CH   MB   ENC CIPHER AUTH ESSID
#  AA:BB:CC:DD:EE:FF -45    123        45    0    6   540 WPA2 CCMP   PSK  MyWiFi
```

### 2.4.6 【通用】漏洞利用（Exploitation Tools）

> **用途**：利用已知漏洞获取系统访问权限

| 工具名称 | 功能说明 | 基本用法 |
|---------|---------|---------|
| metasploit | 渗透测试框架 | `msfconsole` |
| searchsploit | Exploit-DB搜索 | `searchsploit` |
| BeEF | 浏览器攻击框架 | `beef-xss` |
| msfvenom | Payload生成器 | `msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=IP LPORT=4444 -f elf > shell.elf` |

**msfconsole 使用示例**：

```bash
# 启动Metasploit
msfconsole

# 预期输出：
#                                              
#     .:okOOOkdc'           'cdkOOOko:.
#   .xOOOOOOOOOOOOc       cOOOOOOOOOOOOOx.
#   .OOOOOOOOOOOOOOOOOOOOcOOOOOOOOOOOOOOO.
#   .dOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO.
#   .dOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO.
#          [msfconsole]

# 搜索漏洞模块
search exploit/linux/smb

# 预期输出：
#   #  Name                                      Disclosure Date  Rank     Check  Description
#   0  exploit/linux/smb/samba_trans2open     2003-04-01       good     Yes    Samba trans2open Overflow
```

---

## 2.5 常见问题与解决方案

### 2.5.1 【通用】安装问题

**Q1：安装时黑屏或无法启动图形界面？**

**A：** 可能是显卡兼容性问题。尝试以下解决方案：

```
解决方案：
1. 在启动菜单选择 "Install" 而非 "Graphical install"（文本模式更稳定）
2. VMware：编辑虚拟机设置 → 显示器 → 取消勾选 "加速3D图形"
3. VirtualBox：虚拟机设置 → 显示 → 启用3D加速（禁用）
4. 安装后在GRUB启动参数添加 nomodeset
   - 启动时按 E 编辑启动参数
   - 在 linux 行尾添加 nomodeset
   - 按 F10 启动
```

> **截图位置**：VMware虚拟机设置 → 显示器面板

---

**Q2：安装过程中网络配置失败？**

**A：** 检查以下几点：

```bash
# 1. 检查虚拟机网络设置
# VMware：虚拟机 → 设置 → 网络适配器 → NAT模式
# VirtualBox：虚拟机设置 → 网络 → NAT

# 2. 检查主机网络是否正常
ping www.google.com

# 3. 手动配置网络（如果自动获取失败）
sudo dhclient eth0
# 或
sudo ifconfig eth0 up
sudo dhclient eth0

# 4. 如果仍无法连接，选择"现在不配置网络"
# 安装完成后再配置
```

---

**Q3：磁盘空间不足？**

**A：** 按以下步骤扩展或清理：

```bash
# 查看磁盘使用情况
df -h

# 预期输出：
# 文件系统        大小  已用  可用 已用% 挂载点
# /dev/sda1       80G   75G   5G    94%  /

# 清理不必要的包
sudo apt clean
sudo apt autoremove -y

# 清理日志文件
sudo journalctl --vacuum-size=100M

# 扩展虚拟磁盘（需关机后操作）
# VMware：虚拟机设置 → 硬盘 → 扩展
# VirtualBox：VBoxManage modifymedium diskname.vdi --resize 120000
```

---

### 2.5.2 【通用】更新问题

**Q1：apt update 失败，显示 404 错误？**

**A：** 可能是软件源配置问题：

```bash
# 1. 检查源配置
cat /etc/apt/sources.list

# 2. 确认使用正确的Kali版本代号
# 应为 kali-rolling（非具体版本号）

# 3. 重新配置源（使用阿里云源）
sudo vim /etc/apt/sources.list

# 删除原有内容，添加：
deb https://mirrors.aliyun.com/kali kali-rolling main non-free contrib
deb-src https://mirrors.aliyun.com/kali kali-rolling main non-free contrib

# 4. 更新
sudo apt update
```

---

**Q2：GPG密钥错误？**

**A：** 导入正确的GPG密钥：

```bash
# 方法1：使用wget导入
wget https://archive.kali.org/archive-key.asc
sudo apt-key add archive-key.asc

# 方法2：使用apt-key直接导入
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys ED654F4208A06F98

# 验证
sudo apt update
```

---

**Q3：更新过程中空间不足？**

**A：** 清理系统释放空间：

```bash
# 清理apt缓存
sudo apt clean
sudo apt autoremove -y

# 清理旧内核（保留当前版本）
dpkg --list | grep linux-image
sudo apt remove linux-image-5.x.x-xxx-generic

# 清理日志
sudo journalctl --vacuum-size=100M

# 清理用户缓存
rm -rf ~/.cache/*
```

---

### 2.5.3 【通用】虚拟机工具问题

**Q1：虚拟机运行卡顿？**

**A：** 按以下方法优化：

```bash
# 1. 增加虚拟机内存（建议4GB以上）
# VMware：虚拟机 → 设置 → 内存 → 4096 MB
# VirtualBox：虚拟机 → 设置 → 系统 → 内存 → 4096 MB

# 2. 增加CPU核心数
# VMware：虚拟机 → 设置 → 处理器 → 2个处理器，每个2核
# VirtualBox：虚拟机 → 设置 → 系统 → 处理器 → 2个

# 3. 使用SSD存储虚拟机文件

# 4. 禁用不必要的动画效果
#Xfce：设置 → 外观 → 样式 → 简单
# 终端：编辑 → 首选项 → 取消动画

# 5. 安装虚拟机增强工具
sudo apt install -y open-vm-tools-desktop   # VMware
sudo apt install -y virtualbox-guest-x11   # VirtualBox

# 6. 重启
sudo reboot
```

---

**Q2：无法与主机复制粘贴？**

**A：** 检查并修复：

```bash
# 1. 确认已安装增强工具
# VMware
sudo apt install -y open-vm-tools-desktop

# VirtualBox
sudo apt install -y virtualbox-guest-utils virtualbox-guest-x11

# 2. 重启虚拟机
sudo reboot

# 3. 检查服务状态
# VMware
systemctl status open-vm-tools

# 预期输出：
# ● open-vm-tools.service - Open VM Tools (Guest)
#    Loaded: loaded (/lib/systemd/system/open-vm-tools.service)
#    Active: active (running)

# 4. 如仍无效，检查VMware/VirtualBox版本是否过旧
vmware-toolbox-cmd -v
VBoxControl --version
```

---

**Q3：共享文件夹不显示？**

**A：** 手动挂载共享文件夹：

```bash
# 1. 先在VMware/VirtualBox中配置共享文件夹
# VMware：虚拟机 → 设置 → 选项 → 共享文件夹 → 添加
# VirtualBox：虚拟机 → 设置 → 共享文件夹 → 添加

# 2. 检查挂载点
ls /mnt/hgfs/

# 3. 如果为空，手动挂载
# VMware
sudo mkdir -p /mnt/hgfs
sudo mount -t fuse.vmhgfs-fuse .host:/ /mnt/hgfs -o allow_other

# VirtualBox
sudo mkdir -p /mnt/vboxsf
sudo mount -t vboxsf share_name /mnt/vboxsf

# 4. 设置开机自动挂载
sudo vim /etc/fstab

# VMware 添加：
.host:/ /mnt/hgfs fuse.vmhgfs-fuse allow_other 0 0

# VirtualBox 添加：
share_name /mnt/vboxsf vboxsf defaults 0 0
```

---

**Q4：网络连接正常但无法上网？**

**A：** 检查DNS配置：

```bash
# 1. 检查网络接口
ip addr

# 预期输出：
# 2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP
#     inet 192.168.1.100/24 brd 192.168.1.255 scope global dynamic eth0

# 2. 测试DNS
ping -c 3 8.8.8.8    # 测试外网IP
ping -c 3 www.google.com  # 测试DNS解析

# 3. 如DNS失败，手动配置
sudo vim /etc/resolv.conf

# 添加：
nameserver 8.8.8.8
nameserver 114.114.114.114

# 4. 重启网络
sudo systemctl restart networking
```

---

### 2.5.4 【通用】工具使用问题

**Q1：Metasploit 数据库连接失败？**

**A：** 初始化Metasploit数据库：

```bash
# 1. 初始化数据库
sudo msfdb init

# 预期输出：
# [+] Starting database
# [+] Creating database user 'msf'
# [+] Creating databases 'msf'
# [+] Creating database 'msf_test'
# [+] Creating configuration
# [+] Starting database

# 2. 启动msfconsole
msfconsole -q

# 3. 检查数据库状态
db_status

# 预期输出：
# [*] postgresql selected, no connection
# 或
# [*] postgresql connected to 'msf'
```

---

**Q2：Burp Suite 无法启动？**

**A：** 确保Java环境正确：

```bash
# 1. 检查Java版本
java -version

# 预期输出：
# openjdk version "17.0.x" x.x.x
# OpenJDK Runtime Environment (build xxx)

# 2. 如未安装，安装JDK
sudo apt install -y default-jdk

# 3. 启动Burp Suite
burpsuite

# 或在菜单：应用程序 → Web应用程序分析 → Burp Suite
```

---

**Q3：nmap 扫描需要root权限？**

**A：** 部分扫描类型需要root权限：

```bash
# 普通扫描（不需要root）
nmap 192.168.1.1

# 需要root的高级扫描
sudo nmap -sS 192.168.1.1       # SYN扫描
sudo nmap -sU 192.168.1.1      # UDP扫描
sudo nmap --script vuln 192.168.1.1  # 漏洞扫描

# 或者使用不需要root的扫描类型
nmap -sT 192.168.1.1           # TCP连接扫描
nmap -sV 192.168.1.1            # 版本检测
```

---

## 2.6 本章小结

本章详细介绍了Kali Linux渗透测试系统的下载、安装、配置和使用方法，主要内容包括：

1. **Kali Linux概述**：了解Kali的特点、用途和系统要求
2. **下载与安装**：
   - 【通用】官方下载和ISO验证
   - 【Windows】VMware虚拟机配置
   - 【通用】VirtualBox虚拟机配置
   - 【通用】Kali Linux图形化安装步骤
3. **初始设置**：
   - 【通用】配置国内镜像源
   - 【通用】系统更新
   - 【通用】安装中文环境和输入法
   - 【通用】安装虚拟机增强工具
4. **工具分类详解**：
   - 信息收集、漏洞分析、Web应用分析
   - 密码攻击、无线攻击、漏洞利用
5. **常见问题与解决方案**：
   - 安装问题、更新问题
   - 虚拟机工具问题、工具使用问题

掌握Kali Linux是网络安全学习的基础，建议读者按照本章步骤完成系统安装和配置，并在后续学习中逐步熟悉各类工具的使用。
