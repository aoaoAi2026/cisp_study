
# 第72章 红队基础设施建设

> **难度等级**：🟠 高等  
> **预计学习时间**：6小时  
> **前置知识**：第57-59章（Cobalt Strike）、第70-71章（护网与作战流程）  
> **学习目标**：掌握红队基础设施的规划、搭建和维护，能够构建隐蔽、稳定、可快速恢复的攻击基础设施

---

## 72.1 红队基础设施概述（C2/钓鱼/重定向/域名）

> **核心类比：打仗之前先修好后勤基地**
>
> 红队基础设施就好比特种部队的**前线后勤基地**。你不能让士兵扛着所有弹药上战场——那样既重又容易暴露。
>
> 把整个基础设施想象成一座看不见的堡垒：
>
> | 层级 | 角色 | 类比 | 如果被端了会怎样 |
> |------|------|------|----------------|
> | **匿名层** | 你的隐身衣 | VPN+代理→你的真实IP | 溯源到真实身份 |
> | **支撑层** | 后勤仓库 | 工具仓库+数据存储 | 丢装备+丢数据 |
> | **C2层** | 指挥部 | 核心Team Server | 所有Beacon失联 |
> | **重定向层** | 传达室/中转站 | Redirector+CDN | 中转站被打掉(可快速重建) |
> | **入口层** | 招募点 | 钓鱼服务器+Payload下载 | 外部入口被堵 |
>
> **基础设施设计的黄金规则**：
> 1. **最贵的那层(C2)要藏得最深**——暴露的永远只能是"传达室"
> 2. **每一层都能单独替换**——打掉一层，换个IP/域名继续干
> 3. **从不直接暴露**——目标看到的永远是CDN IP、重定向IP，永远看不到C2的真实地址

### 72.1.1 什么是红队基础设施

**红队基础设施**是指红队在进行攻击行动时所需的全部后台系统，包括C2服务器、钓鱼服务器、重定向器、域名、VPS等。

可以把它理解成红队的"后勤基地"——前线的攻击手需要武器、弹药、通信、补给，这些都由基础设施提供。

### 72.1.2 基础设施的重要性

> "工欲善其事，必先利其器。"

基础设施的好坏直接影响红队行动的成败：

| 好的基础设施 | 差的基础设施 |
|-------------|-------------|
| C2稳定不掉线 | 经常掉线，丢失权限 |
| 流量隐蔽，不易被发现 | 流量特征明显，很快被封 |
| 被发现后能快速恢复 | 一被封锁就全军覆没 |
| 可支撑长时间行动 | 几天就撑不住了 |
| OPSEC好，难以溯源 | 容易被溯源到真实身份 |

### 72.1.3 完整的基础设施架构

```
┌─────────────────────────────────────────────────────┐
│              红队基础设施架构                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  【入口层】                                          │
│   ├── 钓鱼域名 + 钓鱼服务器                          │
│   ├── Payload下载服务器                              │
│   └── 短链接服务                                     │
│                                                     │
│  【重定向层】                                        │
│   ├── CDN（Cloudflare/AWS CloudFront）              │
│   ├── 反向代理（Nginx/Apache）                      │
│   ├── 重定向VPS（多台，不同IP段）                    │
│   └── 域前置（Domain Fronting）                     │
│                                                     │
│  【C2层】                                            │
│   ├── 主C2服务器（Cobalt Strike Team Server）       │
│   ├── 备用C2服务器                                   │
│   ├── DNS C2服务器                                   │
│   └── 多Listener配置                                 │
│                                                     │
│  【支撑层】                                          │
│   ├── 代理服务器（SOCKS/HTTP代理）                   │
│   ├── 数据存储服务器                                 │
│   ├── 工具仓库                                       │
│   └── 日志和监控                                     │
│                                                     │
│  【匿名层】                                          │
│   ├── VPN多层代理                                    │
│   ├── Tor网络                                       │
│   └── 匿名VPS                                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 72.1.4 基础设施设计原则

1. **隐蔽性**：所有组件都要做好隐匿，避免被发现和溯源
2. **冗余性**：关键组件要有备份，单点故障不影响整体
3. **模块化**：各组件解耦，方便替换和扩展
4. **可快速重建**：被封锁后能快速重建
5. **OPSEC优先**：操作安全是第一位的

---

## 72.2 C2服务器规划与部署

### 72.2.1 C2服务器的作用

C2（Command and Control）服务器是红队的"指挥中心"：
- 接收被控端的连接
- 下发指令和Payload
- 接收回传的数据
- 管理多个会话

### 72.2.2 C2服务器选择

**C2框架对比：**

| 框架 | 特点 | 适用场景 |
|------|------|----------|
| **Cobalt Strike** | 功能强大，生态丰富，商业软件 | 护网主力C2 |
| **Metasploit** | 开源免费，功能全面 | 辅助C2 |
| **Sliver** | 开源，Go编写，现代化 | 替代CS |
| **Mythic** | 模块化设计，Web管理 | 高级需求 |
| **Havoc** | 开源，免杀好 | 新兴选择 |

### 72.2.3 Cobalt Strike Team Server部署

```bash
# 1. 准备VPS
#   - 海外VPS（推荐）
#   - Ubuntu 20.04/22.04
#   - 至少2核4G
#   - 独立IP

# 2. 安装Java环境
apt update
apt install -y openjdk-11-jdk

# 3. 部署Cobalt Strike
#   上传到VPS
tar -xzf cobaltstrike.tar.gz
cd cobaltstrike

# 4. 配置Malleable C2 Profile
#   伪装成正常Web流量
#   修改默认特征
#   配置证书

# 5. 启动Team Server
./teamserver <VPS_IP> <Password> <Profile> <KillDate>

# 示例：
./teamserver 1.2.3.4 MyPassword amazon.profile 2024-12-31
# 参数说明：
#   1.2.3.4 - VPS的IP
#   MyPassword - 团队密码
#   amazon.profile - Malleable C2配置文件
#   2024-12-31 - 过期日期
```

### 72.2.4 Malleable C2 Profile配置

Malleable C2 Profile是Cobalt Strike的流量伪装配置，可以让C2通信看起来像正常的Web流量。

**示例Profile（伪装成Amazon）：**

```
# amazon.profile

set sample_name "Amazon C2";
set sleeptime "30000";        # 30秒通信一次
set jitter "20";              # 20%抖动
set useragent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

http-get {
    set uri "/s/ref=nb_sb_noss_1/field-keywords=books";

    client {
        metadata {
            base64url;
            prepend "session-token=";
            header "Cookie";
        }
    }

    server {
        header "Server" "Server";
        header "x-amz-id-1" "1THW3HFCAJSAMBRM2X8";

        output {
            print;
        }
    }
}

http-post {
    set uri "/gp/yourstore/home";

    client {
        metadata {
            base64url;
            prepend "session-token=";
            header "Cookie";
        }

        output {
            print;
        }
    }

    server {
        header "Server" "Server";
        output {
            print;
        }
    }
}
```

### 72.2.5 Listener配置

**多种Listener配合使用：**

```bash
# 1. HTTP/HTTPS Listener（主力）
#   用途：常规Beacon通信
#   注意：必须用HTTPS

# 2. DNS Listener（备用）
#   用途：当HTTP被封时使用
#   特点：通过DNS隧道通信，更难封堵

# 3. SMB Listener（内网）
#   用途：内网横向移动
#   特点：通过SMB命名管道通信，不走网络

# 4. TCP Listener（内网）
#   用途：内网反向连接
#   特点：内网中使用，不走外网
```

### 72.2.6 多C2架构

不要只依赖一台C2，要有多台：

```
架构一：主备模式
  主C2 ←→ 备用C2
  主C2故障时切换到备用C2

架构二：分区域模式
  C2-A（处理A区目标）
  C2-B（处理B区目标）
  C2-C（处理C区目标）
  互不干扰，一个被封不影响其他

架构三：分层模式
  一级C2（直接接收Beacon）
  二级C2（通过一级跳转）
  三级C2（真实控制端）
  多层跳转，难以溯源
```

---

## 72.3 重定向服务器（Redirector）

### 72.3.1 什么是重定向服务器

**重定向器（Redirector）**是一台位于C2服务器前面的中间服务器，它的作用是：
- 接收Beacon的连接
- 转发给真正的C2服务器
- 隐藏真实C2的IP

```
Beacon → 重定向器 → C2服务器
         （公开的）   （隐藏的）
```

**为什么要用重定向器：**
1. **保护C2**：即使重定向器被发现和封锁，C2不受影响
2. **快速切换**：重定向器被封了，换一个就行，C2不用动
3. **增加溯源难度**：攻击者→重定向器→C2，多一层跳板
4. **流量分发**：多个重定向器可以做负载均衡

### 72.3.2 重定向器的实现方式

#### 方式一：Nginx反向代理

```nginx
# /etc/nginx/conf.d/redirector.conf

# HTTPS反向代理
server {
    listen 443 ssl;
    server_name cdn.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass https://real-c2-server:443;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# DNS重定向（如果用DNS C2）
# 需要额外配置DNS转发
```

#### 方式二：Socat端口转发

```bash
# 简单的端口转发
# 将重定向器的443端口转发到C2的443端口
socat TCP4-LISTEN:443,fork TCP4:real-c2-ip:443

# 后台运行
nohup socat TCP4-LISTEN:443,fork TCP4:real-c2-ip:443 &

# 设置开机自启
# 写入systemd服务
```

#### 方式三：iptables NAT转发

```bash
# 使用iptables做DNAT
# 开启IP转发
echo 1 > /proc/sys/net/ipv4/ip_forward

# DNAT规则：将443端口的流量转发到C2
iptables -t nat -A PREROUTING -p tcp --dport 443 -j DNAT --to-destination real-c2-ip:443

# SNAT规则：让返回流量经过本机
iptables -t nat -A POSTROUTING -p tcp -d real-c2-ip --dport 443 -j SNAT --to-source redirector-ip
```

#### 方式四：Apache mod_proxy

```apache
# /etc/apache2/sites-available/redirector.conf

<VirtualHost *:443>
    ServerName cdn.example.com
    
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
    
    ProxyPreserveHost On
    ProxyPass / https://real-c2-server/
    ProxyPassReverse / https://real-c2-server/
</VirtualHost>
```

### 72.3.3 重定向器的管理

> **运维类比：管理一群临时联络点**
>
> 重定向器就像你在城市不同角落租的快餐铺子——一个被封了，客人可以转到另一个：
> - 每个铺子独立，互不影响
> - 新租一个很快（部署脚本）
> - 客人只知道这个铺子的地址，不知道你真正的仓库

**多个重定向器管理：**

```bash
# 部署多个重定向器
# 不同IP段、不同地区
redirector-1: 1.2.3.4 (美国)
redirector-2: 5.6.7.8 (欧洲)
redirector-3: 9.10.11.12 (亚洲)

# 在Cobalt Strike中配置多个重定向器
# Beacon配置中填写重定向器地址
# 一个被封了还有其他可以用的

# 自动化部署脚本
# 使用Ansible批量部署
# 一条命令就能部署新的重定向器
```

**重定向器的域名绑定：**

```
域名解析配置：
  cdn1.example.com → redirector-1 (1.2.3.4)
  cdn2.example.com → redirector-2 (5.6.7.8)
  cdn3.example.com → redirector-3 (9.10.11.12)

Beacon连接：
  连接 cdn1/cdn2/cdn3 → 到重定向器 → 转发到C2
```

---

## 72.4 域名与CDN规划

### 72.4.1 域名策略

**域名分类：**

| 类型 | 用途 | 要求 |
|------|------|------|
| **C2域名** | C2通信 | 信誉好、看起来正常 |
| **钓鱼域名** | 钓鱼网站 | 和目标相似 |
| **Payload域名** | 下载Payload | 信誉好、HTTPS |
| **重定向域名** | 重定向器 | 信誉好、多域名 |
| **短链接域名** | 短链接服务 | 信誉好 |

**域名选择原则：**

1. **信誉好**：域名没有黑历史，不在任何黑名单上
2. **看起来正常**：像正常的商业网站
3. **有历史**：注册时间越长越好（老域名信誉高）
4. **分类多**：不同用途用不同域名，不要一个域名干所有事
5. **有备份**：准备多个备用域名

**域名"养"的技巧：**

```bash
# 新注册的域名信誉低，需要"养"

# 1. 注册后先搭一个正常网站
#   放一些正常的内容
#   让搜索引擎收录

# 2. 配置完整的DNS记录
#   A记录、MX记录、SPF、DKIM等
#   看起来像正规域名

# 3. 申请SSL证书
#   Let's Encrypt免费证书
#   有HTTPS更可信

# 4. 保持一段时间
#   至少"养"1-2个月再使用
#   时间越长信誉越高

# 5. 域名隐私保护
#   开启WHOIS隐私
#   隐藏注册人信息
```

### 72.4.2 CDN利用

**CDN的作用：**
- 隐藏C2真实IP
- 增加溯源难度
- 提高稳定性
- 分散流量

**常用CDN服务：**

| CDN服务 | 特点 | 推荐指数 |
|---------|------|----------|
| **Cloudflare** | 免费、易用、全球节点 | ⭐⭐⭐⭐⭐ |
| **AWS CloudFront** | 付费、稳定、可域名前置 | ⭐⭐⭐⭐ |
| **Azure CDN** | 付费、稳定 | ⭐⭐⭐⭐ |
| **Fastly** | 付费、快速 | ⭐⭐⭐ |

**Cloudflare配置：**

```bash
# 1. 注册Cloudflare账号
# 2. 添加域名
# 3. 修改域名NS到Cloudflare
# 4. 添加DNS记录

# DNS配置：
#   cdn.example.com → C2_IP（通过Cloudflare代理）
#   开启代理（橙色云朵）

# SSL/TLS设置：
#   模式：Full
#   开启Always Use HTTPS
#   开启HTTP/2

# 安全设置：
#   开启Bot Fight Mode
#   配置WAF规则（允许特定流量）

# 注意：
#   Cloudflare免费版只代理特定端口
#   HTTP: 80, 8080, 8880, 2052, 2082, 2086, 2095
#   HTTPS: 443, 2053, 2083, 2087, 2096, 8443
```

### 72.4.3 域名前置（Domain Fronting）

**什么是域名前置：**
域名前置是一种利用CDN/云服务来隐藏真实C2域名的技术。

**原理：**
```
Beacon连接：
  HTTPS请求 → CDN
  Host头: legit-domain.com（合法域名）
  实际请求路径: 转发到 c2-domain.com（C2域名）

CDN看到Host头是合法域名，放行
但实际上流量被转发到了C2
```

**效果：**
- 网络层面看到的只是连接到CDN
- Host头显示的是合法域名
- 真实C2域名被隐藏
- 难以检测和封堵

**注意：** 许多CDN服务商已经修补了域名前置，但某些场景仍然可用。

---

## 72.5 VPS与云服务器选择（国内外/配置/线路）

### 72.5.1 VPS选择考虑因素

| 因素 | 说明 | 重要性 |
|------|------|--------|
| **地理位置** | 不同地区，法律和线路不同 | 高 |
| **匿名性** | 是否支持加密货币支付 | 高 |
| **稳定性** | 服务是否稳定 | 高 |
| **带宽** | 够不够用 | 中 |
| **IP信誉** | IP是否干净 | 高 |
| **价格** | 性价比 | 中 |
| **API支持** | 是否支持自动创建/销毁 | 中 |

### 72.5.2 VPS供应商推荐

**匿名性好的VPS：**
```
推荐特征：
  - 支持加密货币支付（比特币/门罗币）
  - 不要求实名认证
  - 不记录详细日志
  - 尊重隐私

常见选择：
  - Vultr（支持加密货币，全球节点）
  - DigitalOcean（需要信用卡）
  - Linode/Akamai
  - AWS（可以用预付卡）
  - 一些小众的隐私VPS服务商
```

**不同用途的VPS选择：**

| 用途 | 地区 | 配置 | 数量 |
|------|------|------|------|
| C2服务器 | 海外 | 2核4G | 1-2台 |
| 重定向器 | 多地区 | 1核1G | 3-5台 |
| 钓鱼服务器 | 海外 | 1核1G | 1-2台 |
| 代理服务器 | 灵活 | 1核1G | 2-3台 |
| 数据存储 | 海外 | 2核4G+大硬盘 | 1台 |

### 72.5.3 VPS安全加固

```bash
# 1. 修改SSH端口
# 编辑/etc/ssh/sshd_config
Port 22222

# 2. 禁止root直接登录
PermitRootLogin no

# 3. 使用密钥登录
PasswordAuthentication no

# 4. 配置防火墙
ufw default deny incoming
ufw allow 22222/tcp    # SSH
ufw allow 443/tcp      # C2
ufw enable

# 5. 安装fail2ban
apt install fail2ban
# 防止暴力破解

# 6. 禁用不必要的服务
systemctl disable apache2
systemctl disable mysql

# 7. 定期更新
apt update && apt upgrade -y

# 8. 配置日志
# 确保操作日志被记录
# 但也要注意定期清理
```

---

## 72.6 流量隐藏与匿名性（Tor/代理/VPN）

### 72.6.1 多层代理架构

```
红队操作者
    ↓ VPN（第一层）
    ↓ 代理服务器1（第二层）
    ↓ 代理服务器2（第三层）
    ↓ Tor网络（第四层，可选）
    ↓
    目标

特点：
  - 多层跳板，难以溯源
  - 每层在不同地区
  - 每层使用不同协议
  - 一层被追查，还有其他层
```

### 72.6.2 代理工具

**proxychains：**

```bash
# 安装
apt install proxychains4

# 配置 /etc/proxychains4.conf
# 多层代理链
socks5  proxy1_ip 1080
socks5  proxy2_ip 1080
http    proxy3_ip 8080

# 使用
proxychains4 nmap -sT target_ip
proxychains4 curl https://target.com
```

**SSH隧道：**

```bash
# SSH动态端口转发（SOCKS代理）
ssh -D 1080 user@proxy_server

# SSH本地端口转发
ssh -L 8080:target:80 user@proxy_server

# SSH远程端口转发
ssh -R 9090:localhost:80 user@proxy_server
```

**frp/chisel内网代理：**

```bash
# frp配置
# 服务端（frps）
[common]
bind_port = 7000

# 客户端（frpc）
[common]
server_addr = vps_ip
server_port = 7000

[socks5]
type = tcp
remote_port = 1080
plugin = socks5
```

### 72.6.3 流量加密

**确保所有通信都加密：**

1. **C2通信加密**：使用HTTPS/TLS
2. **代理通信加密**：SSH隧道、Stunnel
3. **数据传输加密**：SCP/SFTP
4. **即时通信加密**：Signal、加密聊天工具

---

## 72.7 钓鱼服务器与邮件服务器

### 72.7.1 钓鱼服务器搭建

```bash
# 1. 部署Gophish
# 下载并解压
unzip gophish.zip
cd gophish

# 修改配置 config.json
{
    "admin_server": {
        "listen_url": "127.0.0.1:3333"
    },
    "phish_server": {
        "listen_url": "0.0.0.0:443",
        "use_tls": true,
        "cert_path": "cert.pem",
        "key_path": "key.pem"
    }
}

# 启动
./gophish

# 2. 配置SSL证书
# 使用Let's Encrypt
certbot certonly --standalone -d phishing-domain.com

# 3. 配置防火墙
ufw allow 443/tcp
```

### 72.7.2 邮件服务器搭建

```bash
# 方式一：自建邮件服务器
# 安装Postfix
apt install postfix

# 配置 /etc/postfix/main.cf
myhostname = mail.phishing-domain.com
mydomain = phishing-domain.com
myorigin = $mydomain
inet_interfaces = all
mydestination = $myhostname, localhost.$mydomain, localhost

# 配置SPF记录
# DNS添加TXT记录
phishing-domain.com. IN TXT "v=spf1 ip4:vps_ip -all"

# 配置DKIM
apt install opendkim
# 生成密钥
opendkim-genkey -s mail -d phishing-domain.com
# 添加DNS记录

# 方式二：使用邮件发送服务
# SendGrid、Mailgun、AWS SES
# 优势：IP信誉好，送达率高
# 注意：需要注册账号，可能留痕
```

---

## 72.8 数据存储与安全（加密/备份/销毁）

### 72.8.1 数据存储安全

**数据分类：**
- 凭据数据：账号、密码、Hash
- 目标数据：获取的敏感信息
- 操作日志：所有操作的记录
- 工具和Payload：攻击工具

**安全存储措施：**

```bash
# 1. 磁盘加密
# 使用LUKS加密整个磁盘
cryptsetup luksFormat /dev/sdb
cryptsetup luksOpen /dev/sdb encrypted_data
mkfs.ext4 /dev/mapper/encrypted_data

# 2. 文件加密
# 使用GPG加密敏感文件
gpg -c passwords.txt

# 3. 数据库加密
# 使用加密数据库存储凭据
# 如KeePass、1Password

# 4. 访问控制
# 严格限制数据访问权限
# 只有授权人员才能访问
```

### 72.8.2 数据备份

```bash
# 定期备份重要数据
# 加密后备份到不同位置

# 备份脚本示例
#!/bin/bash
DATE=$(date +%Y%m%d)
tar -czf /backup/data_$DATE.tar.gz /data/
gpg -c /backup/data_$DATE.tar.gz
rm /backup/data_$DATE.tar.gz
# 上传到另一台服务器
scp /backup/data_$DATE.tar.gz.gpg user@backup-server:/backup/
```

### 72.8.3 数据销毁

**护网结束后，必须安全销毁所有数据：**

```bash
# 1. 安全删除文件
shred -vfz -n 5 /data/passwords.txt
# 或
wipe -rfi /data/

# 2. 加密分区销毁
cryptsetup luksErase /dev/sdb

# 3. 服务器销毁
# 删除所有数据
shred -vfz -n 3 /dev/sda
# 然后重装系统或销毁VPS

# 4. 域名注销
# 护网结束后注销使用的域名

# 5. VPS销毁
# 删除所有VPS实例
# 确保数据不可恢复
```

---

## 72.9 基础设施监控与维护

### 72.9.1 监控内容

```bash
# 1. C2服务器状态
#   - CPU/内存使用率
#   - 网络流量
#   - Beacon连接数
#   - 服务是否正常

# 2. 重定向器状态
#   - 是否在线
#   - 转发是否正常
#   - 流量是否异常

# 3. 域名状态
#   - DNS解析是否正常
#   - SSL证书是否过期
#   - 域名是否被标记

# 4. 安全状态
#   - 是否有异常登录
#   - 是否被扫描或攻击
#   - IP是否被列入黑名单
```

### 72.9.2 监控工具

```bash
# 简单的监控脚本
#!/bin/bash
# check_infra.sh

# 检查C2是否在线
if ! curl -sk https://c2-domain.com/check; then
    echo "[ALERT] C2 Server Down!"
    # 发送告警
fi

# 检查重定向器
for ip in "1.2.3.4" "5.6.7.8" "9.10.11.12"; do
    if ! ping -c 1 $ip > /dev/null 2>&1; then
        echo "[ALERT] Redirector $ip Down!"
    fi
done

# 检查域名解析
if ! dig +short c2-domain.com > /dev/null; then
    echo "[ALERT] DNS Resolution Failed!"
fi
```

---

## 72.10 应急处置（C2被发现后的处理）

### 72.10.1 应急响应流程

```
C2被发现/封锁
    ↓
第一步：评估影响
    ├── 哪些Beacon掉线了？
    ├── 哪些主机受影响？
    └── 蓝队掌握了多少信息？
    ↓
第二步：快速切换
    ├── 启用备用C2
    ├── 切换重定向器
    ├── 更新Beacon配置
    └── 恢复连接
    ↓
第三步：分析原因
    ├── 为什么被发现？
    ├── 是流量特征还是IP被标记？
    └── 蓝队是怎么发现的？
    ↓
第四步：改进措施
    ├── 修改C2 Profile
    ├── 更换域名和IP
    ├── 调整通信频率
    └── 加强隐蔽性
```

### 72.10.2 快速切换方案

```bash
# 1. 准备好备用基础设施
#   备用C2（已部署，待命）
#   备用域名（已养好）
#   备用重定向器（已配置）

# 2. 快速切换步骤
#   a. 在Cobalt Strike中添加新的Listener
#   b. 通过还在线的Beacon下发新配置
#   c. Beacon切换到新的C2地址
#   d. 验证连接是否正常

# 3. 自动化切换
#   使用Aggressor Script自动化
#   一键切换C2配置
```

### 72.10.3 被溯源后的处理

```
如果被溯源到真实身份：
    1. 立即停止所有操作
    2. 评估泄露范围
    3. 销毁所有基础设施
    4. 向组织方报告
    5. 配合调查
    6. 总结教训
```

---

## 72.11 红队武器库建设（工具/脚本/Payload/EXP）

### 72.11.1 武器库分类

```
红队武器库
│
├── 信息收集类
│   ├── 子域名收集工具
│   ├── 端口扫描工具
│   ├── 指纹识别工具
│   ├── OSINT工具
│   └── 漏洞扫描工具
│
├── 漏洞利用类
│   ├── Web漏洞利用
│   ├── 中间件漏洞利用
│   ├── 系统漏洞利用
│   └── 自研EXP
│
├── 后渗透类
│   ├── 提权工具
│   ├── 凭据获取工具
│   ├── 横向移动工具
│   ├── 代理转发工具
│   └── 权限维持工具
│
├── 免杀类
│   ├── Shellcode加密工具
│   ├── 加载器
│   ├── 混淆工具
│   └── 各类免杀脚本
│
├── 钓鱼类
│   ├── 钓鱼页面模板
│   ├── 宏病毒模板
│   ├── 钓鱼管理平台
│   └── 社工素材库
│
└── 辅助类
    ├── 代理工具
    ├── 编码解码工具
    ├── 流量分析工具
    └── 报告生成工具
```

### 72.11.2 武器库管理

**版本管理：**
```bash
# 使用Git管理武器库（私有仓库）
git init weapon-library
git add .
git commit -m "Update tools"
git push origin main

# 标签管理
git tag v2024.1
git tag v2024.2
```

**分类管理：**
```
weapon-library/
├── 01-recon/          # 信息收集
├── 02-exploit/        # 漏洞利用
├── 03-post/           # 后渗透
├── 04-av-evasion/     # 免杀
├── 05-phishing/       # 钓鱼
├── 06-utils/          # 辅助工具
├── 07-payloads/       # Payload
├── 08-profiles/       # C2 Profile
├── 09-docs/           # 使用文档
└── README.md
```

---

## 72.12 基础设施自动化建设

### 72.12.1 为什么需要自动化

- **快速部署**：几分钟内部署完整基础设施
- **一致性**：避免手动配置的差异和错误
- **可重复**：需要时随时重建
- **可销毁**：用完即毁，安全可靠

### 72.12.2 自动化工具

**Terraform（基础设施即代码）：**

```hcl
# main.tf - 部署VPS和DNS

# 创建VPS
resource "vultr_instance" "c2_server" {
    name = "c2-server"
    region = "us-east-1"
    plan = "vc2-2c-4gb"
    os_id = 387  # Ubuntu 22.04
}

# 创建重定向器
resource "vultr_instance" "redirector" {
    count = 3
    name = "redirector-${count.index}"
    region = "us-east-1"
    plan = "vc2-1c-1gb"
    os_id = 387
}

# 配置DNS
resource "cloudflare_record" "c2" {
    zone_id = var.cloudflare_zone_id
    name = "cdn"
    value = vultr_instance.redirector[0].main_ip
    type = "A"
    proxied = true
}
```

**Ansible（配置管理）：**

```yaml
# playbook.yml - 配置重定向器

- name: Configure Redirector
  hosts: redirectors
  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present
        update_cache: yes
    
    - name: Configure Nginx reverse proxy
      template:
        src: redirector.conf.j2
        dest: /etc/nginx/conf.d/redirector.conf
    
    - name: Install SSL certificate
      shell: certbot certonly --nginx -d {{ domain }} --non-interactive
    
    - name: Start Nginx
      service:
        name: nginx
        state: started
        enabled: yes
```

### 72.12.3 一键部署脚本

```bash
#!/bin/bash
# deploy_infra.sh - 一键部署基础设施

# 1. 创建VPS
echo "[*] Creating VPS instances..."
terraform apply -auto-approve

# 2. 配置服务器
echo "[*] Configuring servers..."
ansible-playbook -i hosts playbook.yml

# 3. 配置DNS
echo "[*] Configuring DNS..."
python3 configure_dns.py

# 4. 部署C2
echo "[*] Deploying C2..."
ansible-playbook -i hosts c2_deploy.yml

# 5. 验证
echo "[*] Verifying infrastructure..."
./verify_infra.sh

echo "[+] Infrastructure deployed successfully!"
```

---

## 📚 案例1：一套完整的红队基础设施搭建

### 案例概述

搭建一套包含C2、重定向器、CDN、钓鱼服务器的完整基础设施。

### 架构设计

```
                    Cloudflare CDN
                    /      |      \
              Redir-1   Redir-2   Redir-3
              (US)      (EU)      (ASIA)
                    \      |      /
                    C2 Server（隐藏）
                    
钓鱼服务器 ← 独立VPS
邮件服务器 ← 独立VPS
```

### 域名规划

```
主C2域名：cdn-update.com（已养3个月）
备用域名：cdn-check.net（已养2个月）
钓鱼域名：office365-verify.com
短链接域名：short-link.io
```

### 部署步骤

```bash
# Step 1: 购买域名和VPS
#   3个域名 + 5台VPS（1 C2 + 3重定向器 + 1钓鱼）

# Step 2: 配置DNS
#   所有域名通过Cloudflare管理
#   开启CDN代理

# Step 3: 部署C2
#   安装Cobalt Strike
#   配置Malleable C2 Profile
#   配置HTTPS Listener

# Step 4: 部署重定向器
#   3台VPS分别配置Nginx反向代理
#   转发到C2服务器
#   配置SSL证书

# Step 5: 部署钓鱼服务器
#   安装Gophish
#   配置SSL
#   准备钓鱼模板

# Step 6: 配置邮件服务器
#   安装Postfix
#   配置SPF/DKIM

# Step 7: 安全加固
#   所有服务器加固
#   配置防火墙
#   配置监控

# Step 8: 测试验证
#   测试C2连通性
#   测试重定向器
#   测试钓鱼功能
#   测试免杀效果
```

### 最终配置清单

```
✅ C2服务器：1台（2核4G，海外）
✅ 重定向器：3台（1核1G，不同地区）
✅ 钓鱼服务器：1台（1核1G）
✅ 域名：3个（已养2-3个月）
✅ CDN：Cloudflare（免费版）
✅ SSL证书：Let's Encrypt
✅ C2 Profile：已配置
✅ 防火墙：已配置
✅ 监控：已配置
✅ 备用方案：已准备
```

---

## 📚 案例2：CDN隐藏C2实战

### 配置过程

```bash
# 1. 域名添加到Cloudflare
#   修改NS记录指向Cloudflare

# 2. DNS配置
#   cdn.example.com → C2_IP（开启代理）

# 3. Cobalt Strike配置
#   Listener的Host设为 cdn.example.com
#   端口设为CDN支持的端口（443）

# 4. Beacon生成
#   连接地址：cdn.example.com
#   端口：443
#   协议：HTTPS

# 效果：
#   Beacon连接 cdn.example.com:443
#   → Cloudflare CDN
#   → 转发到C2真实IP
#   蓝队只能看到连接到Cloudflare的流量
#   看不到C2真实IP
```

---

## 📚 案例3：域名前置技术应用

```bash
# 原理：
#   利用CDN的SNI和Host头不一致
#   SNI: 高信誉域名（如microsoft.com）
#   Host: C2域名

# Cobalt Strike配置：
#   在Profile中配置
http-config {
    set "Host" "cdn.example.com";
    # 实际连接的SNI是另一个高信誉域名
}

# 效果：
#   网络层面：看到连接到高信誉域名
#   CDN层面：根据Host头转发到C2
#   蓝队：难以检测
```

---

## 📚 案例4：多C2负载均衡架构

```
                    DNS轮询
                   /    |    \
              C2-1   C2-2   C2-3
              |       |       |
           Beacon  Beacon  Beacon

配置：
  DNS: cdn.example.com → C2-1, C2-2, C2-3
  Beacon: 连接 cdn.example.com
  DNS轮询自动分配到不同C2

优势：
  - 分散负载
  - 一个C2挂了不影响其他
  - 更难被完全封堵
```

---

## 📚 案例5：基础设施被发现后的应急处置

### 场景

护网第5天，蓝队发现了C2域名并封锁。

### 应急处理

```bash
# 1. 评估影响
#   - 确认哪些Beacon掉线
#   - 确认蓝队掌握了多少信息
#   - 评估是否被溯源

# 2. 快速切换
#   a. 启用备用C2域名
#   b. 修改DNS指向备用重定向器
#   c. 通过还在线的Beacon下发新配置

# 在Cobalt Strike中：
#   添加新的Listener（新域名）
#   通过Beacon执行：
beacon> cdn-beacon new-domain.com

# 3. 加固
#   修改C2 Profile特征
#   降低通信频率
#   更换SSL证书

# 4. 恢复
#   确认所有Beacon重新上线
#   继续行动
```

---

## ✏️ 习题（20道）

### 一、选择题（10道）

1. 红队基础设施中，重定向器的主要作用是什么？
   - A. 加速网络连接
   - B. 隐藏C2服务器真实IP
   - C. 存储数据
   - D. 发送钓鱼邮件

2. 以下哪种方式可以有效隐藏C2服务器的真实IP？
   - A. 使用HTTP明文通信
   - B. 使用CDN代理
   - C. 使用默认端口
   - D. 不配置SSL

3. Malleable C2 Profile的作用是什么？
   - A. 加密通信内容
   - B. 伪装C2流量为正常Web流量
   - C. 加速通信
   - D. 管理Beacon

4. 护网结束后，应该如何处理基础设施数据？
   - A. 保留备用
   - B. 安全销毁所有数据
   - C. 卖给其他团队
   - D. 公开存档

5. 域名"养"的目的是什么？
   - A. 让域名更值钱
   - B. 提高域名信誉，降低被检测概率
   - C. 增加域名流量
   - D. 没有特殊目的

6. 红队为什么要准备多个重定向器？
   - A. 为了好看
   - B. 一个被封了还有备用的
   - C. 为了得分
   - D. 没有必要

7. C2被发现后，红队首先应该做什么？
   - A. 立即撤退
   - B. 评估影响，然后快速切换
   - C. 攻击蓝队
   - D. 删除所有数据

8. 以下哪个不是基础设施自动化的好处？
   - A. 快速部署
   - B. 一致性
   - C. 可重复
   - D. 降低成本

9. Cloudflare CDN免费版代理的HTTPS端口包括哪些？
   - A. 任意端口
   - B. 443, 2053, 2083等特定端口
   - C. 只有443
   - D. 只有80

10. 红队武器库应该包含哪些内容？
    - A. 只有攻击工具
    - B. 信息收集、漏洞利用、后渗透、免杀、钓鱼等全套工具
    - C. 只有免杀工具
    - D. 只有钓鱼工具

### 二、填空题（5道）

1. 红队基础设施架构通常包括入口层、________、C2层、________和匿名层。

2. 重定向器的常见实现方式包括Nginx反向代理、________和________。

3. C2被封锁后，红队的应急响应流程包括评估影响、________、________和改进措施。

4. 域名前置技术利用了CDN的________和________不一致来隐藏真实C2域名。

5. 红队武器库管理应该包括分类管理、________和________。

### 三、简答题（3道）

1. 请描述一套完整的红队基础设施包含哪些组件，以及各组件的作用。

2. 为什么要使用CDN来隐藏C2？CDN隐藏C2的原理是什么？有什么局限性？

3. 红队基础设施的安全管理包括哪些方面？护网结束后应该如何处理基础设施和数据？

### 四、实操题（2道）

1. **重定向器搭建**
   - 使用Nginx搭建一个反向代理重定向器
   - 配置SSL证书
   - 测试转发功能
   - 配置防火墙规则

2. **基础设施规划**
   - 假设你要参加一次2周的护网行动
   - 目标是5000人的企业
   - 请规划你的基础设施：
     - 需要多少台VPS？各做什么用？
     - 需要多少个域名？如何分类？
     - 如何配置CDN和重定向？
     - 如何应对C2被发现的紧急情况？

---

**注意：** 本章内容仅用于授权的安全测试和教学研究。所有基础设施搭建和使用必须在合法授权的前提下进行。未经授权的网络攻击是严重的违法行为！

