---
outline: deep
---

# 附录C：常见端口对照表

> **难度等级：📋 参考**
>
> **预计学习时间：30分钟**

---

## 📖 本附录概述

::: tip 附录内容
本附录整理了渗透测试中最常见的100+个端口及其对应的服务、用途和安全风险，方便在端口扫描后快速判断目标暴露面和攻击面。
:::

---

## 一、端口基础知识

> **生活类比：一栋大楼里的"房间号"**
>
> 把一台服务器想象成一栋大楼，IP地址就是这栋楼的**门牌号**（比如"科技路88号"），而端口号就是大楼里每个**房间的编号**。
>
> 你敲哪个房间的门，就进入哪个房间，见到房间里的人（对应的服务程序）：
> - 敲 `80` 号房间 → Web服务开门：给你看网页
> - 敲 `22` 号房间 → SSH服务开门：让你远程管理
> - 敲 `3306` 号房间 → MySQL数据库开门：让你操作数据
>
> **端口扫描的本质**：黑客在楼道里挨个敲门，看看哪些房间有人应答。有人答应的，就知道里面有什么"人"（服务），然后想办法搞定这个人。
>
> ```
> IP地址 = 大楼门牌号（找对楼）
> 端口号 = 房间编号（找对人）
> 协议 = 你和房间里的人"用什么语言"交流（TCP靠握手/UDP直接喊）
> ```

### 端口分类
- **周知端口（Well-Known Ports）**：0-1023，标准服务使用
- **注册端口（Registered Ports）**：1024-49151，厂商注册使用
- **动态/私有端口**：49152-65535，临时端口

### 协议类型
- **TCP**：面向连接，可靠传输（HTTP、FTP、SSH等）
- **UDP**：无连接，快速传输（DNS、SNMP、DHCP等）

---

## 二、Web服务相关端口

> **类比：Web服务端口 = 大楼的"前台大厅"**
>
> Web端口是服务器对外展示的"门面"，就像商场的一楼大厅——任何人都能进来逛逛。也正因为"敞开大门"，攻击面最大。
>
> 想象一下：
> - **80/443端口** = 商场正门（HTTP/HTTPS），人人都能进，所以小偷也最容易混进来
> - **8080/8443** = 商场侧门（备用端口），和正门一样的功能，但管理后台往往走这里
> - **7001/7002（WebLogic）** = 奢侈品专卖店大门，但门锁有漏洞（反序列化），不用钥匙就能进
> - **9200（Elasticsearch）** = 公司档案室大门，没锁的话谁都能翻看所有文件
> - **2375（Docker API）** = 机房的万能遥控器接口，没锁的话谁都能远程控制你的服务器
> - **6379（Redis）** = 一个没上锁的保险柜，里面可以放东西，黑客可以往里塞"定时炸弹"（写SSH公钥）
>
> **核心原理：Web端口之所以危险，不是端口本身的问题，而是端口后面跑的"服务"有问题。服务就像接待员，如果这个接待员傻乎乎的（有漏洞），别人说什么就做什么，那就完蛋了。**

| 端口 | 协议 | 服务名称 | 常见用途 | 安全风险 |
|------|------|---------|---------|---------|
| 80 | TCP | HTTP | Web网站、Web应用 | SQL注入、XSS、文件上传、目录遍历等 |
| 443 | TCP | HTTPS (HTTP over SSL/TLS) | 加密的Web服务 | SSL漏洞、心脏出血、证书配置错误 |
| 8080 | TCP | HTTP-Proxy / Tomcat | Web代理、Tomcat默认端口 | 与80端口相同，Tomcat管理后台漏洞 |
| 8443 | TCP | HTTPS-Alt / Tomcat SSL | Tomcat SSL默认端口 | 与443相同，Tomcat管理后台 |
| 8000 | TCP | HTTP-Alt / iRDMI | 常见备用HTTP端口、iDRAC远程管理 | Web漏洞、管理后台弱口令 |
| 8001 | TCP | HTTP-Alt | 备用HTTP端口 | Web漏洞 |
| 81 | TCP | HTTP-Alt | 备用HTTP端口 | Web漏洞、管理后台 |
| 82 | TCP | HTTP-Alt | 备用HTTP端口 | Web漏洞 |
| 8888 | TCP | HTTP-Alt | 宝塔面板、常见备用端口 | 宝塔面板弱口令、Web漏洞 |
| 7001 | TCP | WebLogic | WebLogic默认端口 | WebLogic反序列化（CVE-2016-3510等） |
| 7002 | TCP | WebLogic SSL | WebLogic SSL端口 | 同7001 |
| 9001 | TCP | WebSphere / Tor | WebSphere管理端口 | WebSphere漏洞、Tor节点 |
| 9090 | TCP | WebSphere Admin | WebSphere管理控制台 | 管理后台弱口令、WebSphere漏洞 |
| 4848 | TCP | GlassFish Admin | GlassFish管理端口 | GlassFish弱口令、认证绕过 |
| 8081 | TCP | HTTP-Alt / JBoss | JBoss管理端口 | JBoss反序列化、未授权访问 |
| 9999 | TCP | JBoss / Trinoo | JBoss、分布式拒绝服务工具 | JBoss漏洞、DDoS木马 |
| 1352 | TCP | Lotus Notes/Domino | Lotus Domino邮件和Web服务 | Domino漏洞、弱口令 |
| 3000 | TCP | Node.js / Grafana | Node.js应用、Grafana | 默认口令、Node.js应用漏洞 |
| 5000 | TCP | Flask / UPnP | Flask应用、UPnP服务 | Flask调试模式、UPnP漏洞 |
| 2375 | TCP | Docker API | Docker远程API | 未授权访问导致远程代码执行 |
| 2379 | TCP | etcd | Kubernetes etcd | 未授权访问导致信息泄露 |
| 6443 | TCP | Kubernetes API | Kubernetes API Server | 未授权访问、K8s漏洞 |
| 10250 | TCP | Kubelet | Kubernetes Kubelet API | 未授权访问导致命令执行 |
| 8083 | TCP | InfluxDB | InfluxDB HTTP API | 未授权访问、数据泄露 |
| 8086 | TCP | InfluxDB | InfluxDB API | 未授权访问、数据泄露 |
| 9200 | TCP | Elasticsearch | Elasticsearch REST API | 未授权访问、数据泄露、RCE |
| 9300 | TCP | Elasticsearch | Elasticsearch传输协议 | 未授权访问、数据泄露 |
| 5601 | TCP | Kibana | Kibana Web界面 | 未授权访问、Kibana漏洞 |
| 5672 | TCP | RabbitMQ | RabbitMQ消息队列 | 弱口令、未授权访问 |
| 15672 | TCP | RabbitMQ | RabbitMQ管理界面 | 弱口令、管理后台漏洞 |
| 6379 | TCP | Redis | Redis数据库 | 未授权访问导致RCE |
| 11211 | TCP/UDP | Memcached | Memcached缓存 | 未授权访问、DDoS反射 |

---

## 三、数据库相关端口

> **类比：数据库端口 = 大楼的"保险库"**
>
> 如果说Web端口是商场大厅，那数据库端口就是商场的**地下金库**——里面存着最值钱的东西：用户数据、交易记录、密码、商业机密。
>
> **为什么数据库端口这么危险？** 因为：
> - **3306（MySQL）**、**1433（MSSQL）**：金库正门，如果密码是"123456"（弱口令），那就等于门没锁
> - **6379（Redis）**：这个金库比较特殊——**默认就没锁**！Redis设计时假设它在内网使用，所以默认不需要密码。但如果运维不小心把它暴露到公网，等于把金库搬到马路上了
> - **27017（MongoDB）**：和Redis类似，早期版本默认无认证，大量MongoDB数据泄露事件都因为这个
> - **1521（Oracle）**：甲骨文金库，锁很复杂但锁芯有漏洞（TNS漏洞），高手可以绕过锁直接开
>
> **本质理解**：数据库端口最大的两个威胁来源——**弱口令**（管理员偷懒用简单密码）和**未授权访问**（软件默认没开认证）。这是配置问题，不是软件Bug，但造成的危害比漏洞还大。

| 端口 | 协议 | 服务名称 | 常见用途 | 安全风险 |
|------|------|---------|---------|---------|
| 3306 | TCP | MySQL | MySQL数据库 | 弱口令爆破、未授权访问、SQL注入 |
| 1433 | TCP | MS SQL Server | Microsoft SQL Server | 弱口令、SQL注入、xp_cmdshell提权 |
| 1434 | UDP | MS SQL Monitor | SQL Server Browser服务 | 信息泄露、拒绝服务 |
| 1521 | TCP | Oracle TNS Listener | Oracle数据库 | 弱口令、TNS漏洞、权限提升 |
| 2483 | TCP | Oracle DB | Oracle数据库（明文） | 同1521 |
| 2484 | TCP | Oracle DB SSL | Oracle数据库（加密） | 同1521 |
| 5432 | TCP | PostgreSQL | PostgreSQL数据库 | 弱口令、未授权访问、SQL注入 |
| 5984 | TCP | CouchDB | CouchDB数据库 | 未授权访问、CVE-2017-12635 |
| 27017 | TCP | MongoDB | MongoDB数据库 | 未授权访问导致数据泄露 |
| 27018 | TCP | MongoDB | MongoDB分片 | 同27017 |
| 6379 | TCP | Redis | Redis数据库 | 未授权访问、写SSH密钥、主从复制RCE |
| 11211 | UDP | Memcached | Memcached缓存服务 | 未授权访问、DDoS放大攻击 |
| 9200 | TCP | Elasticsearch | Elasticsearch搜索引擎 | 未授权访问、Groovy脚本RCE |
| 873 | TCP | Rsync | 文件同步服务 | 未授权访问导致文件泄露 |
| 3690 | TCP | SVN | Subversion版本控制 | 源码泄露、弱口令 |
| 33060 | TCP | MySQL X | MySQL X Protocol | MySQL 8.0新协议，风险同3306 |
| 50000 | TCP | SAP DB | SAP数据库 | SAP漏洞、弱口令 |
| 50001 | TCP | SAP DB | SAP数据库 | SAP漏洞 |
| 40000 | TCP | Firebird | Firebird数据库 | 弱口令、缓冲区溢出 |
| 2638 | TCP | Sybase SQL Anywhere | Sybase数据库 | 弱口令、提权漏洞 |

---

## 四、远程管理端口

> **类比：远程管理端口 = 大楼的"管理员通道"**
>
> 这些端口不是给普通访客用的，是给**管理员**用的。就像大楼的后门、电梯控制室、监控室——普通人不应该进去。
>
> **一旦进去了意味着什么？** 拿到远程管理权限 = 拿到了整台服务器的"遥控器"。能装软件、能看文件、能改配置——等同于完全控制。
>
> | 端口 | 类比 | 为什么进去就"无敌"了 |
> |------|------|---------------------|
> | **22（SSH）** | 大楼管理员的万能门禁卡 | 进去了能执行任何命令 |
> | **3389（RDP）** | 远程桌面——直接坐到了管理员电脑前 | 能看到桌面、能操作鼠标键盘 |
> | **23（Telnet）** | 同上，但所有对话是**明文广播**（路人都能偷听） | 极其危险，密码在路上裸奔 |
> | **5900（VNC）** | 远程屏幕共享——直接看管理员屏幕 | 能看到桌面操作 |
> | **5985（WinRM）** | Windows的远程"遥控器" | PowerShell远程执行任意命令 |
>
> **核心风险**：弱口令爆破 + 漏洞利用（如蓝洞CVE-2019-0708）。特别是3389，几乎是黑客的"头号目标"——进去就能远程桌面，太香了。

| 端口 | 协议 | 服务名称 | 常见用途 | 安全风险 |
|------|------|---------|---------|---------|
| 22 | TCP | SSH | 远程登录管理 | 弱口令爆破、密钥泄露、0day漏洞 |
| 23 | TCP | Telnet | 远程登录（明文） | 明文传输密码、嗅探攻击 |
| 3389 | TCP | RDP | Windows远程桌面 | 弱口令、蓝洞(CVE-2019-0708)、暴力破解 |
| 5985 | TCP | WinRM | Windows远程管理 | 弱口令、哈希传递、远程执行 |
| 5986 | TCP | WinRM SSL | 加密WinRM | 同5985 |
| 5900 | TCP | VNC | VNC远程桌面 | 弱口令、认证绕过漏洞 |
| 5901 | TCP | VNC | VNC显示:1 | 同5900 |
| 5902 | TCP | VNC | VNC显示:2 | 同5900 |
| 21 | TCP | FTP | 文件传输（控制端口） | 弱口令、匿名登录、嗅探密码 |
| 20 | TCP | FTP Data | FTP数据端口 | 主动模式FTP数据传输 |
| 69 | UDP | TFTP | 简单文件传输 | 未授权访问、文件泄露 |
| 115 | TCP | SFTP | 安全文件传输 | SSH的文件传输子系统 |
| 990 | TCP | FTPS | FTP over SSL | 加密FTP |
| 2222 | TCP | SSH-Alt | 备用SSH端口 | 同22 |
| 22222 | TCP | SSH-Alt | 备用SSH端口 | 同22 |
| 1311 | TCP | Dell OpenManage | Dell服务器管理 | 弱口令、Dell管理漏洞 |
| 4786 | TCP | Cisco Smart Install | Cisco交换机管理 | 未授权访问、配置泄露 |
| 8291 | TCP | Winbox | MikroTik路由器管理 | Winbox漏洞(CVE-2018-14847) |
| 8443 | TCP | HTTPS-Alt | 各种管理面板 | 管理后台弱口令 |
| 10000 | TCP | Webmin | Webmin管理面板 | 弱口令、Webmin漏洞 |
| 1238 | TCP | PC-Anywhere | Symantec远程控制 | 弱口令、缓冲区溢出 |
| 5631 | TCP | pcAnywhere | pcAnywhere数据端口 | 同1238 |
| 3389 | UDP | RDP UDP | RDP UDP传输 | 同TCP 3389 |
| 4899 | TCP | Radmin | Radmin远程控制 | 弱口令、Radamin漏洞 |
| 623 | UDP | IPMI | 智能平台管理接口 | Cipher 0漏洞、弱口令 |
| 5900 | UDP | VNC | VNC UDP | 同TCP 5900 |

---

## 五、文件共享端口

> **类比：文件共享端口 = 公司内部的文件传递窗口**
>
> 这些端口让不同电脑之间能互相传文件、共享文件夹。本来是方便内部协作的，但如果暴露到外面或被黑客进了内网——等于打开了公司所有文件柜。
>
> **重点理解445端口（SMB）为什么是"核弹级"高危端口**：
> - SMB = Windows文件共享协议 = 公司内部的"文件传递通道"
> - **永恒之蓝（MS17-010）**：SMB协议本身的漏洞，不需要密码，只要445端口开着就能打进去。2017年WannaCry勒索病毒就是用这个漏洞，几天内感染了全球几十万台电脑
> - 即便没有永恒之蓝，如果有弱口令，也可以通过SMB在内网**横向移动**（从一台机器跳到另一台）
> - **为什么内网渗透中445如此重要**：因为Windows域环境大量依赖SMB，关了它很多正常功能都用不了
>
> **一句话：445是内网渗透的"高速公路"——打下来一台，通过445就能打到一片。**

| 端口 | 协议 | 服务名称 | 常见用途 | 安全风险 |
|------|------|---------|---------|---------|
| 21 | TCP | FTP | 文件传输协议 | 弱口令、匿名登录、嗅探 |
| 22 | TCP | SSH/SFTP | SSH文件传输 | 弱口令、密钥泄露 |
| 139 | TCP | NetBIOS | NetBIOS会话服务 | SMB漏洞、信息泄露、永恒之蓝 |
| 445 | TCP | SMB | Server Message Block | MS17-010(永恒之蓝)、SMB Relay |
| 137 | UDP | NetBIOS Name | NetBIOS名称服务 | 信息泄露、NBNS毒化 |
| 138 | UDP | NetBIOS Datagram | NetBIOS数据报 | 信息泄露 |
| 2049 | TCP/UDP | NFS | 网络文件系统 | 未授权挂载、文件泄露 |
| 111 | TCP/UDP | RPCbind | RPC端口映射 | NFS/NIS相关、信息泄露 |
| 2049 | UDP | NFS | NFS UDP | 同TCP 2049 |
| 445 | UDP | SMB | SMB over UDP | 同TCP 445 |
| 873 | TCP | Rsync | 远程文件同步 | 未授权访问、文件泄露 |
| 548 | TCP | AFP | Apple文件协议 | Mac文件共享漏洞 |
| 427 | UDP | SLP | 服务定位协议 | 信息泄露、DDoS |
| 161 | UDP | SNMP | 简单网络管理协议 | 默认community字符串、信息泄露 |
| 162 | UDP | SNMP Trap | SNMP陷阱端口 | SNMP陷阱信息 |
| 995 | TCP | POP3S | 加密POP3 | 加密邮件接收 |
| 993 | TCP | IMAPS | 加密IMAP | 加密邮件接收 |

---

## 六、邮件服务端口

> **类比：邮件端口 = 公司的"收发室"**
>
> 这些端口处理邮件的发送和接收。对红队来说，邮件端口有特殊价值：
> - **用户枚举**：通过SMTP的VRFY命令，可以验证某个邮箱是否存在（相当于拿到了员工名单）
> - **邮件伪造**：如果SPF/DKIM配置不当，可以伪造发件人——这正是钓鱼攻击的核心技术
> - **信息泄露**：弱口令可以登录别人邮箱，看到所有往来邮件（商业机密、密码重置邮件等）
>
> **对渗透测试的实际意义**：发现邮件端口后，第一件事是**枚举用户**（收集员工邮箱列表），这些邮箱就是后续钓鱼攻击的目标清单。

| 端口 | 协议 | 服务名称 | 常见用途 | 安全风险 |
|------|------|---------|---------|---------|
| 25 | TCP | SMTP | 简单邮件传输协议 | 邮件中继、用户枚举、SMTP注入 |
| 465 | TCP | SMTPS | SMTP over SSL | 加密SMTP（隐式TLS） |
| 587 | TCP | SMTP Submission | 邮件提交端口 | 加密SMTP（显式TLS） |
| 110 | TCP | POP3 | 邮局协议v3 | 弱口令、邮件内容泄露 |
| 995 | TCP | POP3S | POP3 over SSL | 加密POP3 |
| 143 | TCP | IMAP | 互联网邮件访问协议 | 弱口令、邮件内容泄露 |
| 993 | TCP | IMAPS | IMAP over SSL | 加密IMAP |
| 109 | TCP | POP2 | 邮局协议v2 | 旧版POP，很少用 |
| 106 | TCP | POP3 PW | POP3密码服务 | 密码修改，漏洞风险 |
| 2525 | TCP | SMTP Alt | 备用SMTP端口 | 同25 |
| 119 | TCP | NNTP | 网络新闻传输协议 | 新闻组，信息泄露 |
| 563 | TCP | NNTPS | NNTP over SSL | 加密新闻组 |
| 1080 | TCP | SOCKS Proxy | SOCKS代理 | 代理滥用、匿名攻击 |

---

## 七、DNS服务端口

> **类比：DNS端口 = 大楼的"导航台/问询处"**
>
> DNS就像互联网的"电话簿"——你把域名（比如 www.baidu.com）告诉它，它告诉你对应的IP地址（比如 110.242.68.66）。
>
> **对红队的价值**：
> - **DNS域传送漏洞**：如果DNS服务器配置不当，你可以一次性获取目标所有的子域名记录——相当于拿到了整个公司的"内部电话簿"，省去大量子域名爆破时间
> - **DNS隧道**：在内网渗透中，如果其他端口被封了，可以通过DNS协议（53端口）传数据——因为DNS是基础服务，防火墙一般不会封，所以常被用作"秘密通道"
> - **DNSLog外带数据**：在命令执行无回显时，可以通过DNS请求把数据"偷偷带出来"——比如让目标服务器执行 `ping 窃取的数据.你的域名.com`，你在DNS服务器上看日志就能拿到数据

| 端口 | 协议 | 服务名称 | 常见用途 | 安全风险 |
|------|------|---------|---------|---------|
| 53 | TCP/UDP | DNS | 域名系统 | DNS域传送、DNS劫持、DNS缓存投毒 |
| 53 | UDP | DNS | DNS查询 | 主要用于查询，DDoS放大攻击 |
| 53 | TCP | DNS | DNS区域传输 | 主要用于域传送和大响应 |
| 953 | TCP | DNS RDNCTL | BIND远程控制 | 未授权访问、DNS配置篡改 |
| 5353 | UDP | mDNS | 组播DNS | 本地网络设备发现，信息泄露 |
| 5355 | UDP | LLMNR | 链路本地多播名称解析 | Responder毒化、哈希捕获 |

---

## 八、其他常用端口

> **这个表可以当"字典"用——扫到不认识的高位端口？来这查。**
>
> 下面几个特别值得记住的"冷门但重要"的端口：
> - **88（Kerberos）**：域认证端口，有它说明目标大概率是域控或域内机器。可以尝试AS-REP Roasting、Kerberoasting攻击
> - **389（LDAP）**：活动目录的"通讯录"协议，未授权访问可以枚举域内所有用户、计算机、组
> - **135（MS RPC）**：Windows RPC服务，配合445使用，很多横向移动技术依赖它
> - **1099（Java RMI）**：Java远程方法调用，未授权访问可直接反序列化RCE
> - **2049（NFS）**：网络文件系统，如果配置不当可以未授权挂载别人的硬盘（直接看别人文件）
> - **123（NTP）**：网络时间协议，UDP反射放大攻击的"弹药"（流量放大倍数可达几百倍）

| 端口 | 协议 | 服务名称 | 常见用途 | 安全风险 |
|------|------|---------|---------|---------|
| 7 | TCP/UDP | Echo | 回显服务 | 拒绝服务攻击 |
| 9 | TCP/UDP | Discard | 丢弃服务 | DDoS反射攻击 |
| 13 | TCP/UDP | Daytime | 日期时间服务 | DDoS反射攻击 |
| 17 | TCP/UDP | QOTD | 每日引言 | DDoS反射攻击 |
| 19 | TCP/UDP | Chargen | 字符生成器 | DDoS放大攻击 |
| 25 | TCP | SMTP | 邮件传输 | 见邮件服务 |
| 37 | TCP/UDP | Time | 时间服务 | DDoS反射 |
| 43 | TCP | WHOIS | 域名查询 | 信息泄露 |
| 53 | TCP/UDP | DNS | 域名解析 | 见DNS服务 |
| 67 | UDP | DHCP Server | DHCP服务器 | DHCP欺骗 |
| 68 | UDP | DHCP Client | DHCP客户端 | DHCP攻击 |
| 69 | UDP | TFTP | 简单文件传输 | 未授权访问 |
| 79 | TCP | Finger | Finger服务 | 用户信息泄露 |
| 80 | TCP | HTTP | Web服务 | 见Web服务 |
| 88 | TCP/UDP | Kerberos | Kerberos认证 | 域控端口，AS-REP Roasting、Kerberoasting |
| 110 | TCP | POP3 | 邮件接收 | 见邮件服务 |
| 111 | TCP/UDP | RPCbind | RPC端口映射 | NFS相关 |
| 113 | TCP | Ident | 身份识别协议 | 信息泄露 |
| 119 | TCP | NNTP | 新闻组 | 信息泄露 |
| 123 | UDP | NTP | 网络时间协议 | DDoS放大攻击、NTP劫持 |
| 135 | TCP/UDP | MS RPC | Microsoft RPC | DCOM/RPC漏洞、MS08-067 |
| 137-139 | TCP/UDP | NetBIOS | NetBIOS服务 | 见文件共享 |
| 143 | TCP | IMAP | 邮件接收 | 见邮件服务 |
| 161 | UDP | SNMP | 简单网络管理 | 默认public/community字符串 |
| 162 | UDP | SNMP Trap | SNMP陷阱 | 告警信息 |
| 179 | TCP | BGP | 边界网关协议 | BGP劫持 |
| 389 | TCP/UDP | LDAP | 轻量目录访问协议 | 域控端口、LDAP注入、未授权访问 |
| 443 | TCP | HTTPS | 加密Web | 见Web服务 |
| 445 | TCP | SMB | 文件共享 | 见文件共享 |
| 465 | TCP | SMTPS | 加密SMTP | 见邮件服务 |
| 512 | TCP | Rexec | 远程执行 | 弱口令、明文传输 |
| 513 | TCP | Rlogin | 远程登录 | 信任关系欺骗 |
| 514 | TCP | Rsh | Remote Shell | 远程命令执行 |
| 514 | UDP | Syslog | 系统日志 | 日志篡改、信息泄露 |
| 515 | TCP | LPD | 打印服务 | 打印机漏洞 |
| 520 | UDP | RIP | 路由信息协议 | 路由欺骗 |
| 554 | TCP/UDP | RTSP | 实时流协议 | 摄像头、视频监控漏洞 |
| 631 | TCP | IPP | Internet打印协议 | CUPS打印服务漏洞 |
| 636 | TCP | LDAPS | LDAP over SSL | 加密LDAP |
| 873 | TCP | Rsync | 文件同步 | 见文件共享 |
| 993 | TCP | IMAPS | 加密IMAP | 见邮件服务 |
| 995 | TCP | POP3S | 加密POP3 | 见邮件服务 |
| 1080 | TCP | SOCKS | SOCKS代理 | 代理滥用 |
| 1099 | TCP | RMI Registry | Java RMI注册 | Java反序列化RCE |
| 1433 | TCP | MS SQL | SQL Server | 见数据库 |
| 1521 | TCP | Oracle | Oracle数据库 | 见数据库 |
| 1723 | TCP | PPTP | VPN PPTP | PPTP漏洞、弱口令 |
| 2049 | TCP/UDP | NFS | 网络文件系统 | 见文件共享 |
| 2082 | TCP | cPanel | cPanel管理 | 弱口令、cPanel漏洞 |
| 2083 | TCP | cPanel SSL | 加密cPanel | 同上 |
| 2222 | TCP | SSH Alt | 备用SSH | 同22 |
| 3128 | TCP | Squid Proxy | Squid代理 | 代理滥用、Squid漏洞 |
| 3306 | TCP | MySQL | MySQL数据库 | 见数据库 |
| 3389 | TCP | RDP | 远程桌面 | 见远程管理 |
| 3690 | TCP | SVN | Subversion | 源码泄露 |
| 4444 | TCP | Metasploit | MSF默认监听端口 | 木马后门常用端口 |
| 4899 | TCP | Radmin | Radmin远程控制 | 见远程管理 |
| 5432 | TCP | PostgreSQL | PostgreSQL | 见数据库 |
| 5900 | TCP | VNC | VNC远程桌面 | 见远程管理 |
| 5985 | TCP | WinRM | Windows远程管理 | 见远程管理 |
| 6379 | TCP | Redis | Redis缓存 | 见数据库 |
| 6667 | TCP | IRC | 互联网中继聊天 | IRC Bot、僵尸网络 |
| 7001 | TCP | WebLogic | WebLogic | 见Web服务 |
| 8000 | TCP | HTTP Alt | 备用HTTP | 见Web服务 |
| 8080 | TCP | HTTP Proxy | 代理/Tomcat | 见Web服务 |
| 8443 | TCP | HTTPS Alt | 备用HTTPS | 见Web服务 |
| 8888 | TCP | HTTP Alt | 宝塔面板等 | 见Web服务 |
| 9090 | TCP | WebSphere | WebSphere管理 | 见Web服务 |
| 9200 | TCP | Elasticsearch | ES搜索 | 见Web服务 |
| 9418 | TCP | Git | Git协议 | Git信息泄露 |
| 11211 | UDP | Memcached | 缓存服务 | 见数据库 |
| 27017 | TCP | MongoDB | MongoDB | 见数据库 |
| 50070 | TCP | Hadoop NN | Hadoop NameNode | 未授权访问、命令执行 |
| 50030 | TCP | Hadoop JT | Hadoop JobTracker | 未授权访问、命令执行 |
| 61616 | TCP | ActiveMQ | ActiveMQ消息队列 | 反序列化、弱口令 |
| 8161 | TCP | ActiveMQ | ActiveMQ管理界面 | 弱口令、管理后台漏洞 |

---

## 九、高风险端口速查

> **类比理解：豪宅里哪些房间最值钱、最容易进？**
>
> 把目标服务器想象成一座豪宅，端口就是每个房间。有些房间（高风险端口）比其他房间更容易"赚钱"：
>
> | 端口 | 房间类比 | 为什么值钱 |
> |------|---------|-----------|
> | **445 (SMB)** | 保险柜（永恒之蓝就是万能钥匙） | 能直接拿到文件、执行代码 |
> | **3389 (RDP)** | 主人卧室 | 进去了就能控制整台电脑 |
> | **6379 (Redis)** | 没上锁的珠宝柜 | 默认无密码，直接进去拿东西 |
> | **22 (SSH)** | 正门密码锁 | 弱密码（123456）可以直接进 |
> | **1433 (MSSQL)** | 账房 | 拿到数据库就拿到了核心数据 |
>
> **为什么风险高？** 这些房间要么门锁太弱（弱口令），要么根本没锁（未授权访问），要么锁有漏洞（如永恒之蓝）。黑客最爱敲的就是这些门。

以下端口如果暴露在公网，需要特别注意，风险较高：

| 优先级 | 端口 | 服务 | 风险说明 |
|--------|------|------|---------|
| 🔴 极高 | 445 | SMB | 永恒之蓝、SMB Relay，勒索软件最爱 |
| 🔴 极高 | 3389 | RDP | 弱口令爆破、蓝洞漏洞 |
| 🔴 极高 | 1433 | MSSQL | 弱口令、xp_cmdshell提权 |
| 🔴 极高 | 6379 | Redis | 未授权访问，可直接RCE |
| 🔴 极高 | 27017 | MongoDB | 未授权访问，数据泄露 |
| 🟠 高 | 22 | SSH | 弱口令爆破 |
| 🟠 高 | 21 | FTP | 弱口令、匿名登录 |
| 🟠 高 | 23 | Telnet | 明文传输，嗅探密码 |
| 🟠 高 | 9200 | Elasticsearch | 未授权访问、RCE |
| 🟠 高 | 7001 | WebLogic | 反序列化RCE |
| 🟠 高 | 8080 | Tomcat | 管理后台弱口令 |
| 🟠 高 | 1521 | Oracle | 弱口令、TNS漏洞 |
| 🟠 高 | 1099 | Java RMI | 反序列化RCE |
| 🟡 中 | 3306 | MySQL | 弱口令、SQL注入 |
| 🟡 中 | 5432 | PostgreSQL | 弱口令 |
| 🟡 中 | 5900 | VNC | 弱口令 |
| 🟡 中 | 2049 | NFS | 未授权挂载 |
| 🟡 中 | 873 | Rsync | 未授权访问 |
| 🟡 中 | 161 | SNMP | 默认community字符串 |
| 🟡 中 | 389 | LDAP | 未授权访问、LDAP注入 |

---

## 十、端口扫描建议

> **类比：侦察兵的分工——"侦察三步走"**
>
> 端口扫描就像侦察兵在夜晚侦察一座敌军堡垒。你不能拿着手电筒一个窗户一个窗户照（那样会被岗哨发现）。
>
> | 扫描策略 | 侦察兵类比 | 为什么这么做 |
> |---------|-----------|-------------|
> | **先快后慢**（Masscan→Nmap） | 先派无人机快速掠过拍照，再派侦察兵到重点窗户仔细看 | 全端口65535个，快速扫描找活口，再用Nmap精细识别 |
> | **先TCP后UDP** | 先查朝外的窗户（TCP），再查内部通风口（UDP） | TCP端口更多更常见，UDP扫描又慢又不准 |
> | **服务版本识别** | 看清楚了是炊事班还是弹药库 | 知道服务类型和版本才能找对应漏洞 |
> | **脚本扫描** | 用探测器检验窗户有没有破绽 | Nmap脚本能自动检测常见漏洞 |

### 扫描策略
1. **先快后慢**：先用Masscan快速扫全端口，再用Nmap详细扫
2. **先TCP后UDP**：TCP端口更多、更常见，UDP慢但也要扫
3. **服务版本识别**：扫完端口一定要扫服务版本，方便找对应漏洞
4. **脚本扫描**：对重点端口使用Nmap脚本进行漏洞检测

### 常用扫描命令
```bash
# 快速存活探测
nmap -sn 192.168.1.0/24

# 全端口TCP扫描
nmap -sS -p- -T4 192.168.1.1

# 服务版本+脚本扫描
nmap -sV -sC -p 80,443,3306,445 192.168.1.1

# UDP扫描（常用端口）
nmap -sU --top-ports 100 192.168.1.1

# 综合扫描（推荐）
nmap -A -T4 -p- 192.168.1.1
```

---

## 🔗 相关链接

- [⬅️ 上一章：---](/redteam/day111-appendix-附录B-常用命令速查表)
- [➡️ 下一章：---](/redteam/day113-appendix-附录D-常见漏洞编号对照表)
- [📖 返回全书目录](/redteam/day118-toc-全书目录)
