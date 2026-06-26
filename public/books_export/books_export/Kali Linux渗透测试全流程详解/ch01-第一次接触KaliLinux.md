# 第一章 第一次接触Kali Linux——从安装到第一次扫描

> 第1章 | 预计学习时间：3小时 | 难度：⭐

---

## 📖 写在前面的话

如果你是第一次接触网络安全，第一次听说"Kali Linux"，心里肯定有很多疑问：

> "Kali Linux是什么？和Windows有啥区别？"
> "学这个有啥用？能当黑客吗？"
> "我电脑水平一般，能学会吗？"
> "会不会违法啊？"

别着急，这一章我们就从最基础的讲起，一步步带你走进Kali的世界。

### 这一章你能学到什么

```
✅ 知道Kali Linux是什么，能用来干嘛
✅ 学会在虚拟机里安装Kali（不会搞坏你的电脑）
✅ 熟悉Kali的桌面环境
✅ 学会第一个命令：nmap端口扫描
✅ 用DVWA搭建第一个练习靶机
✅ 完成人生第一次"合法黑客"练习
```

### 你需要准备什么

- 一台能正常上网的电脑（Windows/Mac都行）
- 至少8G内存（4G也能凑合用，但会比较卡）
- 至少50G硬盘空间
- 一颗充满好奇的心❤️

---

## 1.1 Kali Linux到底是个啥？

### 1.1.1 用大白话解释Kali

想象一下，你家里有一套工具箱：

```
普通工具箱里有：
├── 螺丝刀 → 拧螺丝
├── 扳手 → 拧螺母
├── 锤子 → 敲钉子
└── 钳子 → 剪电线

Kali Linux这个"工具箱"里有：
├── Nmap → 扫描别人电脑开了哪些端口
├── Burp Suite → 测试网站有没有漏洞
├── SQLMap → 自动检测SQL注入
├── Metasploit → 利用漏洞搞事情
├── Hashcat → 破解密码
├── Aircrack-ng → 破解WiFi
└── ... 还有600多个工具！
```

**一句话总结：Kali Linux就是一个预装了600多个安全工具的操作系统。**

### 1.1.2 Kali和Windows有啥不一样

| 对比项 | Windows | Kali Linux |
|--------|---------|-----------|
| 界面 | 大家都熟悉的桌面 | 类似Windows的桌面（其实也挺好上手） |
| 用途 | 日常办公、打游戏、看视频 | 安全测试、渗透测试、学习黑客技术 |
| 软件 | exe安装包 | apt install 命令安装 |
| 用户权限 | 默认管理员权限 | 默认普通用户，干啥都要输密码 |
| 病毒 | 容易中病毒 | 病毒比较少（因为用的人少） |
| 价格 | 要钱 | 完全免费！ |

### 1.1.3 学了Kali能干啥

```
正当用途（推荐）：
✅ 网络安全工程师 → 保护公司网络不被黑
✅ 渗透测试工程师 → 合法测试系统安全性
✅ 安全研究员 → 发现新漏洞
✅ CTF选手 → 参加网络安全比赛拿奖
✅ 网警 → 打击网络犯罪

⚠️  非法用途（千万别碰）：
❌ 黑进别人网站偷数据
❌ 破解别人WiFi蹭网
❌ 盗号、诈骗
❌ 搞破坏、勒索
❌ 任何未经授权的测试
```

> 🚨 **重要警告**：学习Kali是为了保护网络安全，不是用来搞破坏的！
> 你只能在**自己搭建的环境**里练习，或者**获得明确书面授权**后才能测试。
> 随便攻击别人的系统是犯法的，会坐牢的！

### 1.1.4 Kali的历史小故事

Kali不是凭空冒出来的，它有个"前辈"叫BackTrack（简称BT）。

```
2006年 → BackTrack 1.0 诞生
   ↓
2010年 → BackTrack 5 R3（最经典的版本）
   ↓
2013年 → 团队重组，改名叫Kali Linux 1.0
   ↓
2015年 → Kali 2.0 大更新
   ↓
2017年 → 改成滚动更新（随时都是最新版）
   ↓
现在 → Kali 2024.x，持续更新中...
```

Kali是由一家叫**Offensive Security**的公司维护的，他们家还出了个很有名的认证叫**OSCP**（Offensive Security Certified Professional），考过的人都挺牛的。

---

## 1.2 准备工作：安装虚拟机

### 1.2.1 为什么要用虚拟机

新手最常问的问题：

> "我直接把Kali装在电脑上行不行？"

**强烈不建议！** 原因有三个：

```
原因1：怕搞坏系统
   学习的时候难免瞎折腾，
   搞坏了虚拟机直接删了重装，
   物理机搞坏了就麻烦了。

原因2：方便做实验
   后面我们要搭靶机练习，
   虚拟机里可以同时开好几台机器，
   一台当攻击机，几台当靶机。

原因3：快照功能太香了
   玩坏了？恢复快照就行！
   不用每次都重装系统。
```

### 1.2.2 选VMware还是VirtualBox

两款常用的虚拟机软件，选哪个都行：

| 对比项 | VMware Workstation | VirtualBox |
|--------|-------------------|------------|
| 谁做的 | 威睿（VMware公司） | Oracle（甲骨文） |
| 价格 | Player版免费，Pro版要钱 | 完全免费 |
| 性能 | 稍好一些 | 也够用 |
| 易用性 | 简单，对新手友好 | 也简单 |
| 推荐度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**新手建议用VMware Workstation Player**，免费版就够用了。

### 1.2.3 手把手安装VMware

```
第一步：下载VMware
   打开浏览器 → 搜 "VMware Workstation Player"
   → 去官网下载最新版
   → 文件大概150MB左右

第二步：安装VMware
   双击下载的exe文件
   → 一路点"下一步"
   → 接受协议
   → 选择安装路径（建议别装C盘）
   → 取消"启动时检查产品更新"
   → 点击"安装"
   → 等几分钟，装完点"完成"

第三步：启动VMware
   桌面上会有个VMware的图标
   双击打开它
   → 选择"我希望试用VMware Workstation 17"
   → 点"继续"
   → 点"完成"
```

> 💡 **小提示**：VMware Player是免费的，只是有些高级功能用不了，
> 对我们学习来说完全够用了。

### 1.2.4 下载Kali Linux镜像

```
第一步：打开Kali官网
   浏览器访问：https://www.kali.org/get-kali/
   （或者直接搜 "Kali Linux download"）

第二步：选择下载版本
   页面上会有好几个选项：
   ├── Bare Metal → 装物理机用的
   ├── Virtual Machines → 虚拟机镜像（推荐新手用这个！）
   ├── Cloud → 云服务器用的
   └── Mobile → 手机用的

   ✅ 新手选 "Virtual Machines"
   → 然后选 VMware 的版本
   → 下载 64位 的

第三步：开始下载
   文件大概 4-5GB，耐心等一会儿
   下载完是个 .7z 的压缩包
```

> 💡 **为什么推荐虚拟机镜像版？**
> 因为它是已经装好系统的虚拟机文件，
> 你下载完直接导入就能用，
> 省掉了安装系统的麻烦，
> 对新手太友好了！

### 1.2.5 导入Kali虚拟机

```
第一步：解压下载的压缩包
   右键 .7z 文件 → 用WinRAR或7-Zip解压
   → 解压到一个你找得到的文件夹
   → 比如 D:\Kali_Linux\

第二步：打开VMware
   启动VMware Workstation Player
   → 点 "打开虚拟机"
   → 找到刚才解压的文件夹
   → 选择里面的 .vmx 文件
   → 点"打开"

第三步：启动虚拟机
   左边会出现 Kali-Linux-202x.x-vmware-amd64
   → 点一下它
   → 点右边的 "播放虚拟机"
   → 第一次启动可能会问你
     "这个虚拟机是你复制的还是移动的？"
   → 选 "我已复制该虚拟机"（一定要选这个！）
   → 然后等着它开机...
```

> 📝 **注意**：第一次启动可能要等几分钟，别着急。
> 如果弹出来"VMware Tools"啥的，不用管，点确定就行。

---

## 1.3 第一次进入Kali系统

### 1.3.1 登录系统

等一会儿，你会看到登录界面：

```
┌─────────────────────────────────┐
│                                 │
│        KALI  LINUX              │
│                                 │
│   ┌───────────────────────┐     │
│   │  用户名: kali         │     │
│   │  密码:   ••••         │     │
│   │                       │     │
│   │       [ 登录 ]        │     │
│   └───────────────────────┘     │
│                                 │
│  默认账号：kali / kali          │
└─────────────────────────────────┘
```

```
默认用户名：kali
默认密码：kali
```

输入密码，点登录，就能进系统啦！

> 💡 **小贴士**：虚拟机里鼠标移进去就被"抓住"了，
> 想回到真实电脑，按一下 `Ctrl + Alt` 键就能释放鼠标。

### 1.3.2 认识Kali桌面

登录成功后，你会看到Kali的桌面，大概长这样：

```
┌──────────────────────────────────────────────────────────┐
│  Applications │ Places │              │ 音量 │ 电源 │    │ ← 顶部菜单栏
├──────────────┴────────┴──────────────┴──────┴──────┴────┤
│                                                          │
│                                                          │
│    🖥️   📁   🌐   📝   🛡️                               │ ← 桌面图标
│    Home  Files Web   Terminal                           │
│                                                          │
│                                                          │
│                                                          │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  ► kali  │  第1个工作区  │  第2个  │  第3个  │ 时间日期  │ ← 底部任务栏
└──────────────────────────────────────────────────────────┘
```

我们来逐个认识一下：

**1. 左上角的 Applications 菜单**
```
点一下 Applications，会展开菜单：
├── 01 - Information Gathering  （信息收集工具）
├── 02 - Vulnerability Analysis  （漏洞分析工具）
├── 03 - Web Application Analysis  （Web应用分析）
├── 04 - Database Assessment  （数据库评估）
├── 05 - Password Attacks  （密码攻击）
├── 06 - Wireless Attacks  （无线攻击）
├── 07 - Reverse Engineering  （逆向工程）
├── 08 - Exploitation Tools  （漏洞利用工具）
├── 09 - Sniffing & Spoofing  （嗅探与欺骗）
├── 10 - Post Exploitation  （后渗透）
├── 11 - Forensics  （取证工具）
├── 12 - Reporting Tools  （报告工具）
├── 13 - Social Engineering Tools  （社会工程学工具）
├── System Tools  （系统工具）
├── Settings  （设置）
└── ...
```

> 哇，600多个工具，看着就头大是不是？
> 别慌，我们先从最常用的几个学起，
> 大部分工具你可能一辈子都用不上...

**2. 终端（Terminal）—— 黑客的标配**

```
在Kali里，大部分操作都是在终端里敲命令完成的，
不是因为装X，而是因为：
  ① 命令行比图形界面快多了
  ② 很多工具根本没有图形界面
  ③ 写脚本自动化的时候命令行太香了
```

打开终端的方法：
- 方法1：点左边任务栏的那个黑色小图标 🖥️
- 方法2：按快捷键 `Ctrl + Alt + T`（记住这个，常用！）
- 方法3：桌面右键 → Open Terminal Here

打开终端后，你会看到这样的提示符：

```
kali@kali:~$
│    │    │
│    │    └── ~ 表示在用户家目录（/home/kali）
│    └────── kali 是主机名
└─────────── kali 是当前用户名
```

### 1.3.3 你的第一个Linux命令

别紧张，我们先敲几个最简单的命令热热身。

```bash
# 命令1：看看当前在哪个目录
kali@kali:~$ pwd
/home/kali
# 解释：pwd = print working directory，打印当前目录

# 命令2：看看当前目录下有啥
kali@kali:~$ ls
Desktop  Documents  Downloads  Music  Pictures  Public  Templates  Videos
# 解释：ls = list，列出文件和文件夹

# 命令3：进入桌面目录
kali@kali:~$ cd Desktop
kali@kali:~/Desktop$ 
# 解释：cd = change directory，切换目录
# 注意看提示符变了，最后变成 ~/Desktop$ 了

# 命令4：回到上一级目录
kali@kali:~/Desktop$ cd ..
kali@kali:~$
# 解释：.. 表示上一级目录

# 命令5：清屏
kali@kali:~$ clear
# 或者按快捷键 Ctrl + L
```

> 🎮 **小练习**：
> 1. 打开终端
> 2. 输入 `ls` 看看有哪些文件
> 3. 输入 `cd Documents` 进入文档目录
> 4. 输入 `pwd` 看看当前路径
> 5. 输入 `cd ..` 回到家目录
> 6. 按 `Ctrl+L` 清屏
> 
> 是不是挺简单的？😎

### 1.3.4 改个密码吧！

默认密码是kali，太简单了，我们先改个密码。

```bash
# 在终端输入：
kali@kali:~$ passwd
Changing password for kali.
Current password: kali        ← 输入旧密码（kali），输入的时候不显示星号，正常现象
New password: 你的新密码       ← 输入新密码，要复杂点哦
Retype new password: 再输一遍   ← 再输一遍确认
passwd: password updated successfully
```

> 💡 小知识：Linux输入密码的时候屏幕上什么都不显示，
> 不是卡了，就是这样设计的，为了安全。
> 你放心输就行，输完按回车。

### 1.3.5 更新一下系统

Kali是滚动更新的，我们来更新一下，确保工具都是最新的。

```bash
# 第一步：更新软件源列表
kali@kali:~$ sudo apt update
[sudo] password for kali: 你的密码    ← 输入你的密码
# 解释：sudo = superuser do，用管理员权限运行
#       apt = Advanced Package Tool，Kali的软件包管理器
#       update = 更新软件列表（不是更新软件哦！）

# 等它跑完，会显示：
# Fetched xx kB in xs (xx kB/s)
# Reading package lists... Done

# 第二步：升级已安装的软件
kali@kali:~$ sudo apt upgrade
# 它会问你：Do you want to continue? [Y/n]
# 输入 y 然后回车
# 然后就是漫长的等待...
# （第一次更新可能要很久，取决于你的网速）
```

> ☕ **提示**：第一次更新可能要几十分钟，去喝杯水歇会儿吧。
> 更新完如果提示内核更新了，重启一下虚拟机。

---

## 1.4 你的第一个黑客工具：Nmap端口扫描

### 1.4.1 Nmap是干啥的

用大白话讲：

```
Nmap = Network Mapper（网络地图绘制器）

它能帮你干这些事：
  ├─ 看看目标网络里有哪些机器在线
  ├─ 看看某台机器开了哪些端口
  ├─ 看看每个端口跑的是什么服务、什么版本
  ├─ 甚至能猜出对方用的什么操作系统
  └─ 还能扫漏洞（配合脚本）
```

打个比方：
- 你家小区有很多住户，每家都有门牌号（IP地址）
- 每家门口有好几个信箱，有的开着有的关着（端口）
- Nmap就是帮你挨家挨户看：哪家有人，门口有哪些信箱开着

### 1.4.2 先搞懂什么是端口

很多新手第一次接触"端口"这个概念，会有点懵。别急，我给你解释：

```
想象一下，你的电脑是一栋大楼：
   - 大楼的地址就是 IP地址（比如 192.168.1.100）
   - 大楼里有很多房间，每个房间有个房间号，这就是端口号
   - 每个房间住着不同的服务：
        22号房间 → SSH服务（远程登录）
        80号房间 → HTTP服务（网站）
        443号房间 → HTTPS服务（加密的网站）
        3306号房间 → MySQL数据库
        3389号房间 → 远程桌面（Windows）
        ... 一共有 65535 个端口号 ...

端口有两种状态：
  ✅ 开着（Open）→ 这个服务在运行，外面能连进去
  ❌ 关着（Closed）→ 这个服务没开，连不上
```

### 1.4.3 第一次用Nmap

别急着扫别人，我们先扫自己试试！

```bash
# 先看看我们自己的IP地址
kali@kali:~$ ip addr
# 或者
kali@kali:~$ ifconfig

# 你会看到一堆信息，找 inet 开头的：
# 比如：inet 192.168.1.100/24
# 这个 192.168.1.100 就是你虚拟机的IP地址
```

> 📝 **记下你自己的IP地址**，后面练习要用。

好，现在我们来扫一下自己：

```bash
# 最简单的扫描：扫一下目标开了哪些端口
kali@kali:~$ nmap 192.168.1.100
# 把IP换成你自己的

# 你会看到类似这样的结果：
Starting Nmap 7.94 ( https://nmap.org ) at 2024-xx-xx xx:xx CST
Nmap scan report for 192.168.1.100
Host is up (0.000010s latency).
Not shown: 998 closed tcp ports (conn-refused)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http

Nmap done: 1 IP address (1 host up) scanned in 0.12 seconds
```

我们来解读一下这个结果：

```
Starting Nmap 7.94...
    ↓
Nmap开始扫描了，版本是7.94

Host is up (0.000010s latency).
    ↓
目标主机是开着的，延迟0.00001秒（扫自己当然快）

Not shown: 998 closed tcp ports
    ↓
扫了1000个常用端口，有998个是关的

PORT     STATE SERVICE
22/tcp   open  ssh      ← 22端口开着，是SSH服务
80/tcp   open  http     ← 80端口开着，是HTTP服务
    ↓
2个端口开着
```

### 1.4.4 Nmap常用参数详解

Nmap功能非常强大，参数也特别多，我们先记几个最常用的：

#### 参数1：-sV 探测服务版本

```bash
# 看看服务具体是什么版本
kali@kali:~$ nmap -sV 192.168.1.100

# 结果会变成这样：
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.4p1 Debian 5 (protocol 2.0)
80/tcp   open  http    Apache httpd 2.4.46 ((Debian))
```

你看，连具体版本号都扫出来了！
- SSH是 OpenSSH 8.4p1
- Web服务是 Apache 2.4.46

> 🔍 **为什么要知道版本号？**
> 因为不同版本有不同的漏洞，
> 知道了版本就能去查有没有已知漏洞可以利用。

#### 参数2：-p 指定端口

```bash
# 只扫22和80端口
kali@kali:~$ nmap -p 22,80 192.168.1.100

# 扫1到100端口
kali@kali:~$ nmap -p 1-100 192.168.1.100

# 扫全部端口（65535个，会比较慢）
kali@kali:~$ nmap -p- 192.168.1.100
```

#### 参数3：-sS SYN半开扫描（隐身模式）

```bash
# 更隐蔽的扫描方式，不容易被日志记录
kali@kali:~$ sudo nmap -sS 192.168.1.100
# 这个需要管理员权限，所以要加sudo
```

#### 参数4：-O 探测操作系统

```bash
# 猜猜对方是什么操作系统
kali@kali:~$ sudo nmap -O 192.168.1.100

# 结果会有一堆猜测，比如：
# Running: Linux 5.x
# OS CPE: cpe:/o:linux:linux_kernel:5.10
```

#### 参数5：-A 全面扫描（一键全家桶）

```bash
# 把常用的都扫了：端口、版本、操作系统、脚本
kali@kali:~$ sudo nmap -A 192.168.1.100
# 这个扫描最全，但也最慢，最容易被发现
```

#### 参数6：-T 速度调节

```bash
# 扫描速度从慢到快：-T0 到 -T5
# -T0 蜗牛速度，非常隐蔽（几乎不会被发现）
# -T1 很慢
# -T2 礼貌模式
# -T3 默认速度（推荐新手用这个）
# -T4 比较快（练习的时候用这个）
# -T5 疯狂速度（容易被封，容易漏报）

# 练习的时候推荐用 -T4
kali@kali:~$ nmap -T4 192.168.1.100
```

### 1.4.5 Nmap使用小技巧

```
技巧1：扫一个网段
# 看看整个局域网里有哪些机器在线
nmap 192.168.1.0/24

技巧2：从文件读目标
# 把要扫的IP写在targets.txt里，每行一个
nmap -iL targets.txt

技巧3：只看存活主机
# 只ping一下，不扫端口，看看哪些机器开着
nmap -sn 192.168.1.0/24

技巧4：保存扫描结果
# 保存成普通文本
nmap -oN result.txt 192.168.1.100

# 保存成XML（方便导入其他工具）
nmap -oX result.xml 192.168.1.100

# 所有格式都保存一份
nmap -oA result 192.168.1.100
```

---

## 1.5 搭建第一个练习靶机：DVWA

光讲理论不练等于没学，我们来搭个靶机来练练手。

### 1.5.1 啥是靶机？

```
靶机 = 故意做成有漏洞的机器，专门给你练习用的。

就像射击训练要有靶子一样，
学黑客技术也得有"靶子"给你打，
总不能去打真实的网站吧？那是违法的！

DVWA就是一个很有名的Web靶机，
它里面故意留了各种Web漏洞，
专门让新手练习的。
```

### 1.5.2 安装前的准备

DVWA是个Web应用，需要Web服务器（Apache）、PHP、数据库（MySQL）。
Kali里都有，我们只需要配置一下。

```bash
# 第一步：启动Apache和MySQL
kali@kali:~$ sudo service apache2 start
kali@kali:~$ sudo service mysql start

# 检查一下启动成功没
kali@kali:~$ sudo service apache2 status
# 看到 active (running) 就是启动成功了

kali@kali:~$ sudo service mysql status
# 同样看到 active (running) 就对了
```

### 1.5.3 下载并安装DVWA

```bash
# 第二步：进入网站根目录
kali@kali:~$ cd /var/www/html/

# 第三步：下载DVWA
kali@kali:/var/www/html$ sudo git clone https://github.com/digininja/DVWA.git
# 如果连不上GitHub，试试Gitee镜像：
# sudo git clone https://gitee.com/mirrors/DVWA.git

# 下载完看看
kali@kali:/var/www/html$ ls
DVWA  index.html
```

好，下载完了，接下来配置数据库：

```bash
# 第四步：登录MySQL
kali@kali:/var/www/html$ sudo mysql -u root

# 你会进到MySQL的命令行，提示符变成 MariaDB [(none)]>

# 第五步：创建数据库和用户
MariaDB [(none)]> create database dvwa;
Query OK, 1 row affected (0.001 sec)

MariaDB [(none)]> create user 'dvwa'@'localhost' identified by 'p@ssw0rd';
Query OK, 0 rows affected (0.001 sec)

MariaDB [(none)]> grant all privileges on dvwa.* to 'dvwa'@'localhost';
Query OK, 0 rows affected (0.001 sec)

MariaDB [(none)]> flush privileges;
Query OK, 0 rows affected (0.001 sec)

MariaDB [(none)]> exit
Bye

# 回到终端了
```

接下来配置DVWA：

```bash
# 第六步：复制配置文件
kali@kali:/var/www/html$ cd DVWA/config/
kali@kali:/var/www/html/DVWA/config$ sudo cp config.inc.php.dist config.inc.php

# 第七步：修改配置文件
kali@kali:/var/www/html/DVWA/config$ sudo nano config.inc.php

# 找到这几行，确保是这样的：
# $_DVWA[ 'db_server' ]   = '127.0.0.1';
# $_DVWA[ 'db_database' ] = 'dvwa';
# $_DVWA[ 'db_user' ]     = 'dvwa';
# $_DVWA[ 'db_password' ] = 'p@ssw0rd';

# 改完按 Ctrl+O 保存，回车确认，然后 Ctrl+X 退出
```

最后设置一下权限：

```bash
# 第八步：设置目录权限
kali@kali:/var/www/html/DVWA$ sudo chmod -R 777 hackable/
kali@kali:/var/www/html/DVWA$ sudo chmod 777 config/
```

### 1.5.4 初始化DVWA

打开Kali里的浏览器（左上角的地球图标），访问：
```
http://127.0.0.1/DVWA/
```

你会看到安装页面：

```
┌─────────────────────────────────────┐
│        DVWA Setup                   │
│                                     │
│   检查项...                         │
│   PHP function allow_url_include: ✗  ← 红叉是因为没开
│   ...                               │
│                                     │
│   [ Create / Reset Database ]       │
└─────────────────────────────────────┘
```

点一下 **[ Create / Reset Database ]** 按钮，
等一下，它会自动跳转到登录页面。

```
登录页面：
用户名：admin
密码：password
```

登录成功！你就能看到DVWA的主界面了 🎉

### 1.5.5 调整难度

DVWA有四个难度级别：

```
左侧菜单 → DVWA Security

Security Level: [ Low    ▼]
                 Medium
                 High
                 Impossible

Submit
```

- **Low**：完全没防御，新手练手用
- **Medium**：有简单防护，练绕过技术
- **High**：防护比较全，有点难度
- **Impossible**：基本没漏洞，用来参考怎么写安全代码

**新手先从 Low 难度开始！**

---

## 1.6 实战：用Nmap扫描你的靶机

现在我们有靶机了，来真刀真枪练一把！

### 1.6.1 准备工作

先确认两个事情：

```bash
# 1. 确认靶机IP（就是你Kali自己的IP）
kali@kali:~$ ip addr show eth0
# 记下那个 inet 后面的地址，比如 192.168.1.100

# 2. 确认Apache开着
kali@kali:~$ sudo service apache2 status
# 要看到 active (running)
```

### 1.6.2 第一次扫描

```bash
# 来个全端口扫描 + 版本探测
kali@kali:~$ nmap -sV -p- -T4 192.168.1.100
# 把IP换成你自己的

# 耐心等一会儿，全端口扫描要几分钟
```

扫描完了，你应该能看到类似这样的结果：

```
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.4p1 Debian 5
80/tcp   open  http    Apache httpd 2.4.46 ((Debian))
3306/tcp open  mysql   MySQL 5.5.5-10.3.29-MariaDB
```

**解读：**
- 22端口开着 → SSH服务，可以远程登录
- 80端口开着 → Apache网站，DVWA就在这上面
- 3306端口开着 → MySQL数据库

### 1.6.3 用浏览器访问你的靶机

打开浏览器，访问：
```
http://你的IP/DVWA/
```

比如：
```
http://192.168.1.100/DVWA/
```

用 admin / password 登录进去，看看左边的菜单：

```
DVWA左侧菜单：
├── Instructions   ← 说明
├── Setup          ← 安装/重置
├── Brute Force    ← 暴力破解（练密码爆破）
├── Command Injection ← 命令注入
├── CSRF           ← 跨站请求伪造
├── File Inclusion ← 文件包含
├── File Upload    ← 文件上传
├── SQL Injection  ← SQL注入（重点！）
├── SQL Injection (Blind) ← SQL盲注
├── XSS (Reflected) ← 反射型XSS
├── XSS (Stored)   ← 存储型XSS
└── ...
```

哇，这么多漏洞可以练！后面的章节我们会一个一个学。

---

## 1.7 新手常踩的坑

### 坑1：命令敲错了不知道咋回事

```
症状：
  输入命令后报 "command not found"

原因：
  ① 命令拼错了（ls 写成 l s 了）
  ② 大小写不对（Linux区分大小写！）
  ③ 那个工具没装

解决：
  仔细看一下命令，一个字母一个字母对一遍。
  刚开始学敲错很正常，多练就熟了。
```

### 坑2：权限不够

```
症状：
  Permission denied 或者 让你输入密码

原因：
  这个操作需要管理员权限

解决：
  在命令前面加 sudo
  比如：sudo nmap -sS 192.168.1.1
```

### 坑3：虚拟机连不上网

```
症状：
  apt update 失败，浏览器打不开网页

原因：
  虚拟机网络模式不对

解决：
  VMware里：
  虚拟机 → 设置 → 网络适配器
  → 选 "NAT模式" 或者 "桥接模式"
  → 确定后重启网络服务
  sudo service networking restart
```

### 坑4：不知道怎么停止程序

```
症状：
  程序跑起来了，不知道怎么停

解决：
  按 Ctrl + C 终止当前程序
  （这个超常用，一定要记住！）
```

### 坑5：越学越焦虑，感觉学不完

```
症状：
  看到600多个工具就头大
  觉得自己啥都不会

解决：
  别慌！没人能把600个工具都学会。
  常用的也就二三十个，先把Nmap、Burp、SQLMap这几个学透，
  其他的遇到了再查。
  学习是个循序渐进的过程，别急。
```

---

## 1.8 本章总结

恭喜你！学完第一章，你已经：

```
✅ 知道了Kali Linux是什么
✅ 成功在虚拟机里装上了Kali
✅ 会用几个基础Linux命令
✅ 会用Nmap进行端口扫描
✅ 搭好了DVWA练习靶机
✅ 完成了第一次扫描练习
```

你已经入门啦！🎉

### 关键知识点回顾

| 知识点 | 说明 |
|--------|------|
| Kali Linux | 预装600+安全工具的Linux系统 |
| 虚拟机 | 用来练习，不会搞坏真实电脑 |
| 终端 | 黑客的标配，大部分操作在这完成 |
| sudo | 用管理员权限运行 |
| Nmap | 端口扫描工具，网络安全必备 |
| DVWA | 专门练手的漏洞靶机 |

### 课后练习

```
练习1（必做）：
  用Nmap扫描你自己的Kali，
  看看开了哪些端口，分别是什么服务。

练习2（必做）：
  进入DVWA，把难度设为Low，
  每个点进去看看长啥样（不用会利用）。

练习3（选做）：
  扫一下你家路由器的IP（通常是192.168.1.1或192.168.0.1），
  看看开了哪些端口。
  ⚠️  注意：这是你自己家的设备，随便扫没事，别扫别人家的！

练习4（选做）：
  改一下Kali的壁纸和主题，让它变成你喜欢的样子。
  （右键桌面 → 桌面设置）
```

---

## 下一章预告

下一章我们会学**信息收集**——怎么在不被发现的情况下，尽可能多地了解目标。

会学到：
- 怎么找目标的子域名
- 怎么找目标的邮箱和人员信息
- 怎么用Google语法搜索敏感信息
- 怎么用各种工具收集情报

我们下章见！👋

---

> 💡 **本章小彩蛋**
> 
> 在终端输入这个命令试试：
> ```bash
> nc towel.blinkenlights.nl 23
> ```
> 按 `Ctrl + ]` 然后输入 `quit` 退出。
> 看看是什么惊喜~
