---
outline: deep
---

# 附录A：红队常用工具速查表

> **难度等级：📋 参考**
>
> **预计学习时间：30分钟**

---

## 📖 本附录概述

::: tip 附录内容
本附录按功能分类整理了红队实战中最常用的100+款工具，每款工具包含功能说明、适用场景、常用命令和难度等级，方便快速查阅和选用。
:::

---

## 一、工具分类总览

| 分类 | 工具数量 | 核心用途 | 入门优先级 |
|------|---------|---------|-----------|
| 信息收集类 | 20+ | 侦察、探测、指纹识别 | ⭐⭐⭐⭐⭐ |
| Web渗透类 | 15+ | Web漏洞探测与利用 | ⭐⭐⭐⭐⭐ |
| 漏洞利用类 | 10+ | 漏洞验证与利用 | ⭐⭐⭐⭐ |
| 后渗透类 | 20+ | 提权、凭据、持久化 | ⭐⭐⭐⭐ |
| 横向移动类 | 10+ | 内网横向、域渗透 | ⭐⭐⭐⭐ |
| 免杀类 | 10+ | 绕过杀毒与检测 | ⭐⭐⭐ |
| 钓鱼类 | 10+ | 社工、钓鱼、水坑 | ⭐⭐⭐ |
| 辅助类 | 10+ | 编码、加密、数据处理 | ⭐⭐⭐⭐ |

---

## 二、信息收集类（20+工具）

| 序号 | 工具名称 | 功能 | 适用场景 | 常用命令 | 难度 |
|------|---------|------|---------|---------|------|
| 1 | Nmap | 端口扫描、服务识别、OS探测 | 端口扫描、信息收集 | `nmap -sS -sV -p- target` | ⭐ |
| 2 | Masscan | 高速端口扫描 | 大范围端口扫描 | `masscan -p1-65535 10.0.0.0/8 --rate=10000` | ⭐⭐ |
| 3 | Naabu | Go语言端口扫描 | 快速端口扫描 | `naabu -host target.com -p 80,443,8080` | ⭐ |
| 4 | Dirsearch | Web目录扫描 | 目录/文件探测 | `dirsearch -u http://target -w dict.txt` | ⭐ |
| 5 | Gobuster | 目录/子域名爆破 | 目录、DNS、VHost爆破 | `gobuster dir -u url -w wordlist` | ⭐ |
| 6 | FFuF | 高速Web模糊测试 | 目录、参数、子域名Fuzz | `ffuf -w wordlist -u http://target/FUZZ` | ⭐⭐ |
| 7 | subfinder | 被动子域名枚举 | 子域名收集 | `subfinder -d target.com` | ⭐ |
| 8 | Amass | 主动+被动子域名收集 | 深度子域名枚举 | `amass enum -d target.com` | ⭐⭐ |
| 9 | OneForAll | 子域名收集工具集 | 子域名批量收集 | `python3 oneforall.py --target target.com run` | ⭐⭐ |
| 10 | httpx | HTTP存活探测 | 批量URL存活检测 | `cat urls.txt \| httpx -title -status-code` | ⭐ |
| 11 | WhatWeb | Web指纹识别 | CMS/中间件识别 | `whatweb http://target.com` | ⭐ |
| 12 | Wappalyzer | 浏览器指纹插件 | 快速识别技术栈 | 浏览器插件 | ⭐ |
| 13 | Finger | 综合指纹识别 | Web指纹识别 | `python3 finger.py -u http://target` | ⭐⭐ |
| 14 | FOFA | 网络空间搜索引擎 | 批量资产收集 | `domain="target.com"` | ⭐⭐ |
| 15 | Shodan | 全球网络空间搜索 | 全球资产搜索 | `port:3389 country:CN` | ⭐⭐ |
| 16 | ZoomEye | 钟馗之眼 | 网络空间搜索 | `app:"Apache"` | ⭐⭐ |
| 17 | 360-Quake | 360空间测绘 | 资产测绘 | `app:"thinkphp"` | ⭐⭐ |
| 18 | theHarvester | OSINT信息收集 | 邮箱、子域名收集 | `theHarvester -d target.com -b all` | ⭐⭐ |
| 19 | Sublist3r | 子域名枚举 | 子域名收集 | `sublist3r -d target.com` | ⭐⭐ |
| 20 | dnsenum | DNS信息枚举 | DNS信息收集 | `dnsenum target.com` | ⭐⭐ |

---

## 三、Web渗透类（15+工具）

| 序号 | 工具名称 | 功能 | 适用场景 | 常用命令 | 难度 |
|------|---------|------|---------|---------|------|
| 1 | Burp Suite | Web渗透测试平台 | 抓包、改包、扫描、爆破 | 图形界面操作 | ⭐⭐ |
| 2 | sqlmap | 自动化SQL注入 | SQL注入检测与利用 | `sqlmap -u "url?id=1" --dbs` | ⭐⭐ |
| 3 | XSStrike | XSS扫描与利用 | XSS漏洞检测 | `python xsstrike.py -u "url?q=test"` | ⭐⭐ |
| 4 | XSS平台 | XSS利用平台 | Cookie窃取、键盘记录 | 网页操作 | ⭐⭐ |
| 5 | 蚁剑AntSword | Webshell管理 | WebShell连接管理 | 图形界面 | ⭐⭐ |
| 6 | 冰蝎Behinder | 加密Webshell | 加密通信Webshell | 图形界面 | ⭐⭐⭐ |
| 7 | 哥斯拉Godzilla | 高级Webshell | 后渗透Webshell | 图形界面 | ⭐⭐⭐ |
| 8 | wfuzz | Web模糊测试 | 目录、参数爆破 | `wfuzz -w dict -u url/FUZZ` | ⭐⭐ |
| 9 | Nikto | Web漏洞扫描器 | Web服务器漏洞扫描 | `nikto -h http://target` | ⭐⭐ |
| 10 | AWVS | Web漏洞扫描器 | 自动化Web漏洞扫描 | 图形界面 | ⭐⭐ |
| 11 | AppScan | Web安全扫描 | 企业级Web扫描 | 图形界面 | ⭐⭐ |
| 12 | Xray | 漏洞扫描器 | 主动/被动扫描 | `xray webscan --url http://target` | ⭐⭐ |
| 13 | Nuclei | 基于模板的扫描 | PoC批量验证 | `nuclei -u http://target -t cves/` | ⭐⭐ |
| 14 | Cansina | Web内容发现 | 隐藏内容探测 | `cansina -u url -p dict.txt` | ⭐⭐ |
| 15 | Commix | 命令注入工具 | 命令注入检测与利用 | `commix -u "url?id=1"` | ⭐⭐ |

---

## 四、漏洞利用类（10+工具）

| 序号 | 工具名称 | 功能 | 适用场景 | 常用命令 | 难度 |
|------|---------|------|---------|---------|------|
| 1 | Metasploit | 渗透测试框架 | 漏洞利用、后渗透 | `msfconsole` | ⭐⭐⭐ |
| 2 | Cobalt Strike | 红队作战平台 | C2、后渗透、横向移动 | 图形界面 | ⭐⭐⭐⭐ |
| 3 | Empire | PowerShell后期利用 | Windows后渗透 | `./empire` | ⭐⭐⭐ |
| 4 | Covenant | .NET C2框架 | 红队C2操作 | 图形界面 | ⭐⭐⭐⭐ |
| 5 | Sliver | 开源C2框架 | 轻量级C2 | `sliver` | ⭐⭐⭐ |
| 6 | Pupy | 跨平台RAT | 远控、后渗透 | `pupy` | ⭐⭐⭐ |
| 7 | Searchsploit | Exploit搜索 | 漏洞利用代码查找 | `searchsploit struts2` | ⭐ |
| 8 | Exploit-DB | 漏洞利用数据库 | 查找POC/EXP | 网站搜索 | ⭐ |
| 9 | Vulhub | 漏洞环境集合 | 漏洞环境搭建 | `docker-compose up -d` | ⭐⭐ |
| 10 | VulApps | 漏洞应用集合 | 快速搭建漏洞环境 | Docker部署 | ⭐⭐ |
| 11 | PoCBox | PoC验证框架 | 批量漏洞验证 | 图形界面 | ⭐⭐ |

---

## 五、后渗透类（20+工具）

| 序号 | 工具名称 | 功能 | 适用场景 | 常用命令 | 难度 |
|------|---------|------|---------|---------|------|
| 1 | Mimikatz | Windows凭据提取 | 密码、哈希、票据抓取 | `privilege::debug` `sekurlsa::logonpasswords` | ⭐⭐⭐ |
| 2 | LaZagne | 密码提取工具 | 各种软件密码提取 | `laZagne.exe all` | ⭐⭐ |
| 3 | Mimipenguin | Linux密码提取 | Linux桌面密码抓取 | `mimipenguin` | ⭐⭐ |
| 4 | BloodHound | AD域攻击路径分析 | 域内攻击路径可视化 | `bloodhound` | ⭐⭐⭐⭐ |
| 5 | PowerView | PowerShell域信息收集 | 域内信息枚举 | `Get-NetUser` `Get-NetComputer` | ⭐⭐⭐ |
| 6 | PowerUp | PowerShell提权脚本 | Windows提权辅助 | `Invoke-AllChecks` | ⭐⭐⭐ |
| 7 | Sherlock | 本地提权漏洞检测 | Windows提权漏洞检测 | `Find-AllVulns` | ⭐⭐⭐ |
| 8 | Watson | 提权漏洞检测 | Windows KBs检测 | `watson.exe` | ⭐⭐⭐ |
| 9 | LinPEAS | Linux提权枚举 | Linux权限提升辅助 | `./linpeas.sh` | ⭐⭐⭐ |
| 10 | WinPEAS | Windows提权枚举 | Windows权限提升辅助 | `winpeas.exe` | ⭐⭐⭐ |
| 11 | PSexec | 远程命令执行 | Windows远程执行 | `psexec \\target cmd` | ⭐⭐ |
| 12 | WCE | Windows凭据编辑器 | 哈希操作、会话传递 | `wce -l` | ⭐⭐⭐ |
| 13 | Incognito | 令牌窃取工具 | 令牌模拟与窃取 | `incognito.exe list_tokens -u` | ⭐⭐⭐ |
| 14 | RottenPotato | Rotten Potato提权 | Service Account提权 | `RottenPotato.exe -p cmd.exe` | ⭐⭐⭐ |
| 15 | JuicyPotato | 烂土豆提权 | 服务账号提权 | `JuicyPotato.exe -t * -p cmd.exe` | ⭐⭐⭐ |
| 16 | PrintSpoofer | 打印机服务提权 | Service to System | `PrintSpoofer.exe -i -c cmd` | ⭐⭐⭐ |
| 17 | ShadowCopy | 卷影拷贝 | NTDS.dit提取 | `vssadmin create shadow` | ⭐⭐⭐ |
| 18 | DCSync | 域控同步攻击 | 域内哈希转储 | Mimikatz/Impacket实现 | ⭐⭐⭐⭐ |
| 19 | Rubeus | Kerberos票据工具 | 票据操作、请求、传递 | `Rubeus.exe asktgt` | ⭐⭐⭐⭐ |
| 20 | Mimikatz DCSync | 域控数据同步 | 导出所有域用户哈希 | `lsadump::dcsync` | ⭐⭐⭐⭐ |

---

## 六、横向移动类（10+工具）

| 序号 | 工具名称 | 功能 | 适用场景 | 常用命令 | 难度 |
|------|---------|------|---------|---------|------|
| 1 | Impacket | 网络协议工具集 | SMB/WMI/远程执行 | `psexec.py` `wmiexec.py` | ⭐⭐⭐ |
| 2 | CrackMapExec | 内网渗透瑞士军刀 | 批量检测、密码喷洒 | `cme smb 192.168.1.0/24` | ⭐⭐⭐ |
| 3 | PsExec (Sysinternals) | 远程执行工具 | Windows远程命令执行 | `psexec \\host cmd` | ⭐⭐ |
| 4 | Wmic | WMI命令行 | WMI远程命令执行 | `wmic /node:host process call create "cmd"` | ⭐⭐ |
| 5 | WinRS | WinRM远程Shell | WinRM远程执行 | `winrs -r:host cmd` | ⭐⭐ |
| 6 | pth-toolkit | 哈希传递工具集 | 各种协议的PtH | `pth-winexe -U user%hash //host cmd` | ⭐⭐⭐ |
| 7 | Responder | LLMNR/NBT-NS毒化 | 内网哈希捕获 | `responder -I eth0 -wrf` | ⭐⭐⭐ |
| 8 | mitm6 | IPv6 DNS攻击 | IPv6中间人攻击 | `mitm6 -d domain.local` | ⭐⭐⭐⭐ |
| 9 | Evil-WinRM | WinRM Shell工具 | WinRM远程Shell | `evil-winrm -i host -u user -H hash` | ⭐⭐ |
| 10 | SharpHound | BloodHound数据采集 | 域内数据收集 | `SharpHound.exe -c all` | ⭐⭐⭐ |
| 11 | ADExplorer | AD活动目录浏览 | 离线浏览AD数据 | 图形界面 | ⭐⭐⭐ |
| 12 | NetExec | CME继任者 | 内网横向移动 | `netexec smb hosts.txt` | ⭐⭐⭐ |

---

## 七、免杀类（10+工具）

| 序号 | 工具名称 | 功能 | 适用场景 | 常用命令 | 难度 |
|------|---------|------|---------|---------|------|
| 1 | Veil | 免杀框架 | Payload免杀生成 | `veil -t Evasion` | ⭐⭐⭐ |
| 2 | TheFatRat | 免杀工具集 | 后门生成与免杀 | `fatrat` | ⭐⭐⭐ |
| 3 | MSFVenom | Payload生成器 | Shellcode/Payload生成 | `msfvenom -p ... -f ...` | ⭐⭐ |
| 4 | Donut | Shellcode生成器 | .NET EXE/DLL转Shellcode | `donut -i payload.exe` | ⭐⭐⭐ |
| 5 | ScareCrow | EDR绕过加载器 | Shellcode加载器免杀 | `scarecrow -I payload.bin` | ⭐⭐⭐⭐ |
| 6 | Hell's Gate | 直接系统调用 | 绕过用户态Hook | 代码集成 | ⭐⭐⭐⭐ |
| 7 | Cobalt Strike Artifact Kit | CS免杀套件 | 自定义Beacon生成 | 图形界面/脚本 | ⭐⭐⭐⭐ |
| 8 | Aviator | 免杀生成器 | 多语言免杀生成 | `aviator -f raw payload.bin` | ⭐⭐⭐ |
| 9 | PyFuscation | PowerShell混淆 | PS脚本混淆免杀 | `python PyFuscation.py -f script.ps1` | ⭐⭐⭐ |
| 10 | Invoke-Obfuscation | PS混淆工具 | PowerShell脚本混淆 | `Invoke-Obfuscation` | ⭐⭐⭐ |
| 11 | xencrypt | PowerShell加密工具 | PS脚本加密免杀 | `Invoke-Xencrypt` | ⭐⭐⭐ |

> 💡 **深入理解：工具分类背后的渗透测试哲学——"侦察兵、工兵、爆破手、扫荡队"**
>
> 工具速查表不只是"列出工具"，你应该从更高维度理解每一种工具
> 在整个攻击链中的位置。用军事行动来类比：
>
> ```
> 信息收集类 = 侦察兵（先摸清敌情）
>   → Nmap = 哨兵，看敌营有几个门、什么守军
>   → Dirsearch = 侦察机，低空飞过去看有没有隐蔽入口
>   → FOFA/Shodan = 卫星侦察，全球搜索目标资产
>
> Web渗透类 = 工兵（打通突破口）
>   → Burp Suite = 工程指挥部，协调所有Web攻击
>   → sqlmap = 爆破工具，精确炸开数据库入口
>   → 蚁剑/冰蝎 = 门锁破解器，打开后直通后台
>
> 漏洞利用类 = 爆破手（炸开城墙）
>   → Metasploit = 军火库，各种弹头选一个发射
>   → Cobalt Strike = 总攻指挥部，协调所有作战单元
>
> 后渗透类 = 扫荡队（占领后巩固控制）
>   → Mimikatz = 情报分析，从俘虏口中获取密码
>   → BloodHound = 地图绘制，画出整个敌占区的关系网
>
> 横向移动类 = 特种部队（深入敌后）
>   → Impacket/PsExec = 特战小分队，渗透到其他敌方阵地
>
> 免杀类 = 伪装技术（隐形斗篷）
>   → Veil/ScareCrow = 迷彩服，让敌人的雷达扫不到你
> ```
>
> 理解了这个类比，你就知道什么时候该用什么类型的工具，
> 也理解了为什么渗透测试是"按流程走"而不是"一把梭"。

---

## 八、钓鱼类（10+工具）

| 序号 | 工具名称 | 功能 | 适用场景 | 常用命令 | 难度 |
|------|---------|------|---------|---------|------|
| 1 | Gophish | 钓鱼框架 | 钓鱼邮件演练 | 图形界面 | ⭐⭐ |
| 2 | SET | 社会工程学工具包 | 多类型钓鱼攻击 | `setoolkit` | ⭐⭐ |
| 3 | Evilginx2 | 中间人钓鱼 | 凭证钓鱼、会话劫持 | `evilginx2` | ⭐⭐⭐ |
| 4 | Modlishka | 反向代理钓鱼 | 凭证窃取 | `modlishka` | ⭐⭐⭐ |
| 5 | King Phisher | 钓鱼邮件工具 | 钓鱼活动管理 | 图形界面 | ⭐⭐ |
| 6 | SocialFish | 钓鱼工具 | 社交媒体钓鱼 | `python socialfish.py` | ⭐⭐ |
| 7 | HiddenEye | 钓鱼工具集 | 多平台钓鱼页面 | `python3 HiddenEye.py` | ⭐⭐ |
| 8 | BlackEye | 网页钓鱼 | 克隆网站钓鱼 | `bash blackeye.sh` | ⭐⭐ |
| 9 | Phishing Frenzy | Ruby钓鱼框架 | 企业级钓鱼演练 | Web界面 | ⭐⭐⭐ |
| 10 | GoPhish | 开源钓鱼平台 | 企业钓鱼测试 | 图形界面 | ⭐⭐ |
| 11 | Zphisher | 自动化钓鱼工具 | 多模板钓鱼 | `bash zphisher.sh` | ⭐⭐ |

---

## 九、辅助类（10+工具）

| 序号 | 工具名称 | 功能 | 适用场景 | 常用命令 | 难度 |
|------|---------|------|---------|---------|------|
| 1 | CyberChef | 网络瑞士军刀 | 编解码、加密解密 | Web界面操作 | ⭐ |
| 2 | Wireshark | 网络抓包分析 | 流量分析、协议分析 | 图形界面 | ⭐⭐ |
| 3 | Tcpdump | 命令行抓包 | 服务器抓包 | `tcpdump -i eth0 -w file.pcap` | ⭐⭐ |
| 4 | Stegsolve | 图片隐写分析 | CTF杂项、隐写分析 | 图形界面 | ⭐⭐ |
| 5 | binwalk | 文件分析提取 | 固件分析、文件提取 | `binwalk -e file.bin` | ⭐⭐ |
| 6 | foremost | 文件恢复工具 | 从数据中恢复文件 | `foremost -i file.bin` | ⭐⭐ |
| 7 | Hashcat | 密码哈希破解 | 高速哈希破解 | `hashcat -m 1000 hash.txt dict.txt` | ⭐⭐⭐ |
| 8 | John the Ripper | 密码破解工具 | 多种哈希破解 | `john --wordlist=dict.txt hash.txt` | ⭐⭐⭐ |
| 9 | Hydra | 网络认证爆破 | 多协议密码爆破 | `hydra -l user -P dict.txt ftp://host` | ⭐⭐ |
| 10 | Medusa | 并行网络认证爆破 | 多服务爆破 | `medusa -h host -u user -P dict.txt -M ssh` | ⭐⭐ |
| 11 | Chisel | 快速隧道工具 | 端口转发、Socks代理 | `chisel server/client` | ⭐⭐ |
| 12 | frp | 反向代理工具 | 内网穿透 | `frpc / frps` | ⭐⭐ |
| 13 | EarthWorm | 内网穿透工具 | 多层内网代理 | `ew -s ssocksd -l 1080` | ⭐⭐ |
| 14 | nps | 轻量级内网穿透 | TCP/UDP/HTTP代理 | `nps / npc` | ⭐⭐ |
| 15 | proxychains | 代理链工具 | 命令行走代理 | `proxychains nmap target` | ⭐⭐ |

---

## 十、工具学习优先级推荐

### 第一优先级（入门必学）
这些工具是入门阶段必须掌握的：
1. **Nmap** - 端口扫描基础
2. **Burp Suite** - Web渗透核心
3. **sqlmap** - SQL注入必备
4. **Dirsearch / Gobuster** - 目录扫描
5. **Metasploit** - 渗透框架入门
6. **CyberChef** - 编码转换
7. **Mimikatz** - 凭据提取入门
8. **蚁剑** - Webshell管理

### 第二优先级（进阶必学）
掌握这些工具可以进入进阶阶段：
1. **Impacket套件** - 内网渗透核心
2. **CrackMapExec** - 内网批量工具
3. **BloodHound** - 域渗透必备
4. **frp / Chisel** - 隧道代理
5. **PowerShell工具集** - Windows后渗透
6. **Nuclei / Xray** - 批量漏洞扫描
7. **Hashcat / John** - 密码破解
8. **LinPEAS / WinPEAS** - 提权辅助

### 第三优先级（高手必学）
这些是红队高手的武器：
1. **Cobalt Strike** - 红队核心平台
2. **免杀工具链** - 绕过EDR
3. **钓鱼工具** - 社工攻击
4. **Covenant / Empire / Sliver** - 其他C2框架
5. **Rubeus / Mimikatz高级用法** - Kerberos攻击
6. **自定义脚本/工具开发** - 武器库建设

---

## 十一、工具搭配使用建议

### 信息收集组合拳
```
subfinder → httpx → Nmap → WhatWeb → Dirsearch
  ↓           ↓        ↓       ↓         ↓
子域名    存活检测   端口扫描   指纹识别   目录扫描
```

### Web渗透标准流程
```
Burp Proxy → Burp Repeater → sqlmap/XSS工具 → 蚁剑/冰蝎
   ↓              ↓                ↓              ↓
 抓包         手动测试        漏洞利用      后渗透
```

### 内网渗透标准流程
```
信息收集 → 凭据获取 → 横向移动 → 权限提升 → 权限维持
  ↓          ↓          ↓          ↓          ↓
Nmap/     Mimikatz/   PsExec/    Rotten/   计划任务/
CME       Impacket    WMI       Potato    服务/注册表
```

### 域渗透标准流程
```
域信息收集 → Kerberos攻击 → 哈希传递 → 横向移动 → DC Sync → 域管权限
    ↓            ↓            ↓          ↓         ↓         ↓
 BloodHound   Rubeus/     Impacket/   CME/    Mimikatz/
 +SharpHound  Impacket    CME         PsExec  secretsdump
```

---

## 十二、工具速查索引

### 按场景查找

| 我想做什么 | 首选工具 | 备选工具 |
|-----------|---------|---------|
| 扫端口 | Nmap | Masscan、Naabu |
| 扫目录 | Dirsearch | Gobuster、FFuF |
| 找子域名 | subfinder | Amass、OneForAll |
| Web抓包改包 | Burp Suite | Zap、Fiddler |
| SQL注入 | sqlmap | 手工注入 |
| 管理Webshell | 蚁剑 | 冰蝎、哥斯拉 |
| 漏洞利用 | Metasploit | Cobalt Strike |
| 抓密码哈希 | Mimikatz | LaZagne |
| 域渗透分析 | BloodHound | PowerView |
| 哈希传递 | Impacket | CrackMapExec |
| 内网代理 | Chisel | frp、EW |
| 端口转发 | Chisel | socat、netsh |
| 提权辅助 | WinPEAS/LinPEAS | PowerUp/Sherlock |
| 密码破解 | Hashcat | John the Ripper |
| 编解码转换 | CyberChef | Burp Decoder |

---

## 🔗 相关链接

- [⬅️ 上一章：---](/redteam/day109-target-靶场常见问题FAQ)
- [➡️ 下一章：---](/redteam/day111-appendix-附录B-常用命令速查表)
- [📖 返回全书目录](/redteam/day118-toc-全书目录)
