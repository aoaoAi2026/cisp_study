
---

## 6.17 SSH密钥高级管理

### 6.17.1 密钥类型深度对比

SSH密钥算法的选择直接关系到安全性和性能。目前主流的非对称加密算法包括RSA、ECDSA和Ed25519，它们在密钥长度、计算性能、安全性和兼容性方面各有特点。

**RSA算法**是最早被广泛应用的公钥加密算法，基于大数分解难题。RSA的优点是兼容性最好，几乎所有SSH客户端和服务器都支持。但其缺点也很明显：为了达到足够的安全性，需要使用很长的密钥。目前普遍认为2048位的RSA密钥已不再安全，建议至少使用3072位，高安全要求环境应使用4096位。更长的密钥意味着更慢的密钥交换速度和更高的计算开销。

**ECDSA（椭圆曲线数字签名算法）**基于椭圆曲线离散对数问题，相比RSA能以更短的密钥提供相同的安全强度。例如，256位的ECDSA密钥大约相当于3072位RSA的安全强度。ECDSA的性能优势明显，计算速度快、密钥体积小。但ECDSA也存在一些争议：不同曲线的实现质量参差不齐，NIST标准曲线曾受到后门质疑，且对随机数生成器的质量要求极高，弱随机数可能导致私钥泄露。

**Ed25519**是基于Edwards曲线的现代签名算法，属于EdDSA家族。它是目前推荐的首选算法，具有多项优势：安全性高（256位密钥提供约3072位RSA的安全强度）、计算速度快（签名和验证速度都优于RSA和ECDSA）、对侧信道攻击抵抗力强、密钥尺寸小。Ed25519的设计完全公开透明，没有可疑的参数选择，因此获得了密码学界的广泛信任。

```bash
# 不同类型密钥生成对比

# Ed25519 - 推荐首选
ssh-keygen -t ed25519 -a 100 -f ~/.ssh/id_ed25519 -C "admin@server"

# RSA 4096位 - 兼容旧系统
ssh-keygen -t rsa -b 4096 -a 100 -f ~/.ssh/id_rsa -C "admin@server"

# ECDSA P-521 - 椭圆曲线最高安全级别
ssh-keygen -t ecdsa -b 521 -f ~/.ssh/id_ecdsa -C "admin@server"

# 查看密钥指纹和类型
ssh-keygen -lf ~/.ssh/id_ed25519
ssh-keygen -lf ~/.ssh/id_rsa
ssh-keygen -lf ~/.ssh/id_ecdsa

# 查看密钥详细信息
ssh-keygen -l -v -f ~/.ssh/id_ed25519.pub
```

密钥算法安全强度对比表：

| 算法 | 密钥长度 | 等效RSA强度 | 速度 | 兼容性 | 推荐度 |
|------|----------|------------|------|--------|--------|
| Ed25519 | 256位 | ~3072位 | 极快 | 好（OpenSSH 6.5+） | ⭐⭐⭐⭐⭐ |
| ECDSA P-256 | 256位 | ~3072位 | 快 | 好 | ⭐⭐⭐⭐ |
| ECDSA P-384 | 384位 | ~7680位 | 中 | 好 | ⭐⭐⭐⭐ |
| ECDSA P-521 | 521位 | ~15360位 | 慢 | 好 | ⭐⭐⭐⭐ |
| RSA | 2048位 | 2048位 | 慢 | 极好 | ⭐⭐（不推荐） |
| RSA | 3072位 | 3072位 | 很慢 | 极好 | ⭐⭐⭐ |
| RSA | 4096位 | 4096位 | 极慢 | 极好 | ⭐⭐⭐⭐ |
| DSA | 1024位 | ~1024位 | 中 | 好 | ⭐（禁用） |

### 6.17.2 ssh-agent密钥代理深度配置

ssh-agent是OpenSSH提供的密钥管理工具，它可以将私钥解密后保存在内存中，使用户在连接多个服务器时无需重复输入私钥密码。正确配置ssh-agent不仅能提高便利性，还能增强安全性。

**ssh-agent的工作原理**：agent作为后台守护进程运行，持有解密后的私钥。当SSH客户端需要进行公钥认证时，它不直接读取私钥文件，而是通过Unix域套接字与agent通信，请求agent代为执行签名操作。这样私钥材料永远不会离开agent进程的内存空间，降低了私钥被窃取的风险。

**安全注意事项**：虽然ssh-agent带来了便利，但也存在安全风险。如果攻击者获取了agent的套接字路径，就可以通过agent进行认证转发，假冒用户身份登录其他服务器。因此，必须谨慎使用agent转发功能（ForwardAgent），只在可信的跳板机上启用，并设置合理的超时时间。

```bash
# 启动ssh-agent的正确方式

# 方式1：在当前shell启动（推荐用于脚本）
eval "$(ssh-agent -s)"
echo $SSH_AGENT_PID
echo $SSH_AUTH_SOCK

# 方式2：使用keychain管理（更持久）
# 安装keychain
apt-get install keychain
yum install keychain

# 在~/.bashrc中添加
cat >> ~/.bashrc << 'EOF'
# SSH Agent管理
if [ -x /usr/bin/keychain ]; then
    keychain --eval --agents ssh id_ed25519 id_rsa
    . ~/.keychain/$HOSTNAME-sh
fi
EOF

# 方式3：systemd用户服务管理
mkdir -p ~/.config/systemd/user
cat > ~/.config/systemd/user/ssh-agent.service << 'EOF'
[Unit]
Description=SSH Key Agent

[Service]
Type=simple
Environment=SSH_AUTH_SOCK=%t/ssh-agent.socket
ExecStart=/usr/bin/ssh-agent -D -a $SSH_AUTH_SOCK

[Install]
WantedBy=default.target
EOF

systemctl --user enable --now ssh-agent
echo 'export SSH_AUTH_SOCK="$XDG_RUNTIME_DIR/ssh-agent.socket"' >> ~/.bashrc
```

```bash
# ssh-agent高级用法

# 添加密钥并设置生命周期（1小时后自动过期）
ssh-add -t 3600 ~/.ssh/id_ed25519

# 添加密钥时要求每次使用前确认
ssh-add -c ~/.ssh/id_ed25519

# 查看已加载的密钥指纹
ssh-add -l

# 查看已加载的完整公钥
ssh-add -L

# 删除特定密钥
ssh-add -d ~/.ssh/id_ed25519

# 清空所有密钥
ssh-add -D

# 锁定agent（需要密码解锁）
ssh-add -x

# 解锁agent
ssh-add -X

# 测试agent是否正常工作
ssh -T git@github.com
```

### 6.17.3 SSH密钥证书认证原理详解

SSH证书认证（SSH Certificate Authentication）是OpenSSH提供的一种高级认证机制，它通过引入证书颁发机构（CA）来解决大规模环境下公钥管理的难题。与传统的authorized_keys方式不同，证书认证不需要在每个服务器上预先部署用户公钥，大大简化了密钥管理。

**证书认证的核心概念**：
1. **CA密钥对**：由可信的证书颁发机构持有，用于签发用户证书和主机证书
2. **用户证书**：由CA签发，证明某个公钥属于特定用户，包含用户名、有效期、权限等信息
3. **主机证书**：由CA签发，证明服务器的身份，解决首次连接的信任问题
4. **Principal**：证书中的主体标识，决定用户可以以哪个账号登录

**证书认证的优势**：
- **集中管理**：不需要在每台服务器上维护authorized_keys
- **有效期控制**：证书可以设置过期时间，实现临时访问授权
- **细粒度授权**：通过principal和扩展选项控制访问权限
- **可撤销性**：可以通过证书撤销列表（CRL）吊销泄露的证书
- **主机认证**：解决了首次连接TOFU（Trust On First Use）的安全问题

```bash
# SSH证书认证完整配置流程

# ========== 第一步：创建CA密钥对 ==========
# 在安全的离线机器上生成CA密钥
mkdir -p /etc/ssh/ca
ssh-keygen -t ed25519 -f /etc/ssh/ca/ssh_ca -C "SSH Certificate Authority"
chmod 600 /etc/ssh/ca/ssh_ca
chmod 644 /etc/ssh/ca/ssh_ca.pub

# ========== 第二步：配置服务器信任CA ==========
# 将CA公钥复制到目标服务器
scp /etc/ssh/ca/ssh_ca.pub root@server:/etc/ssh/

# 在服务器上配置sshd_config
cat >> /etc/ssh/sshd_config << 'EOF'

# 信任的用户CA公钥
TrustedUserCAKeys /etc/ssh/ssh_ca.pub

# 可选：配置授权principal文件
AuthorizedPrincipalsFile /etc/ssh/auth_principals/%u
EOF

# 创建principal目录
mkdir -p /etc/ssh/auth_principals

# 为admin用户配置允许的principal
echo "admin" > /etc/ssh/auth_principals/admin
echo "deploy" >> /etc/ssh/auth_principals/admin

# 重启SSH服务
systemctl restart sshd

# ========== 第三步：签发用户证书 ==========
# 用户生成自己的密钥对
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -C "user@client"

# CA签发用户证书
ssh-keygen -s /etc/ssh/ca/ssh_ca \
    -I "user-$(date +%Y%m%d)" \
    -n admin,deploy \
    -V +30d \
    -z 1001 \
    ~/.ssh/id_ed25519.pub

# 参数说明：
# -s CA私钥路径
# -I 证书标识符（用于审计追踪）
# -n 证书principal（逗号分隔，对应用户名）
# -V 有效期（+30d表示30天后过期）
# -z 证书序列号

# 查看证书内容
ssh-keygen -L -f ~/.ssh/id_ed25519-cert.pub

# ========== 第四步：用户使用证书登录 ==========
# 证书文件会自动被ssh读取（与私钥同目录且命名为*-cert.pub）
ssh admin@server

# 或者显式指定证书
ssh -o CertificateFile=~/.ssh/id_ed25519-cert.pub -i ~/.ssh/id_ed25519 admin@server
```

```bash
# 主机证书配置（解决首次连接信任问题）

# 签发生成主机证书
ssh-keygen -s /etc/ssh/ca/ssh_ca -h \
    -I "server-host-$(hostname)" \
    -n server.example.com,server \
    -V +52w \
    /etc/ssh/ssh_host_ed25519_key.pub

# 在服务器上配置主机证书
echo "HostCertificate /etc/ssh/ssh_host_ed25519_key-cert.pub" >> /etc/ssh/sshd_config
systemctl restart sshd

# 客户端配置信任CA
echo "@cert-authority *.example.com $(cat /etc/ssh/ca/ssh_ca.pub)" >> ~/.ssh/known_hosts

# 现在连接服务器时不会再提示指纹确认
ssh admin@server.example.com
```

```bash
# 证书撤销列表（CRL）配置

# 创建KRL（Key Revocation List）文件
ssh-keygen -k -f /etc/ssh/revoked_keys.krl

# 撤销特定序列号的证书
ssh-keygen -k -f /etc/ssh/revoked_keys.krl -z 1001 -s /etc/ssh/ca/ssh_ca.pub

# 或撤销特定密钥
ssh-keygen -k -f /etc/ssh/revoked_keys.krl -s /etc/ssh/ca/ssh_ca.pub /path/to/revoked-key.pub

# 在sshd_config中配置
echo "RevokedKeys /etc/ssh/revoked_keys.krl" >> /etc/ssh/sshd_config
systemctl restart sshd

# 查看KRL内容
ssh-keygen -Q -f /etc/ssh/revoked_keys.krl ~/.ssh/id_ed25519-cert.pub
```

---

## 6.18 SSH堡垒机/跳板机高级配置

### 6.18.1 Jump Server架构原理

堡垒机（Jump Server/Bastion Host）是企业网络安全架构中的重要组成部分，它作为唯一的远程访问入口，所有对内部服务器的SSH连接都必须经过堡垒机转发。这种架构将攻击面集中到单一节点，便于实施严格的访问控制和全面的审计监控。

**堡垒机的核心作用**：
1. **访问收敛**：所有SSH流量都通过单一入口，减少暴露面
2. **集中认证**：在堡垒机上统一实施认证策略（密钥、2FA、证书等）
3. **权限控制**：基于用户角色控制可访问的内部服务器范围
4. **审计记录**：记录所有会话操作，便于安全审计和事后溯源
5. **账号管理**：统一管理运维账号，避免在每台服务器上单独配置

**典型部署架构**：
- 用户 → 互联网 → 防火墙 → 堡垒机 → 内网交换机 → 目标服务器
- 堡垒机部署在DMZ区域或独立的管理网段
- 内部服务器只允许来自堡垒机IP的SSH连接

**安全设计原则**：
- 堡垒机本身必须经过最严格的安全加固
- 禁用密码登录，强制使用密钥+多因素认证
- 启用详细的日志和会话录制
- 定期审计堡垒机访问日志
- 限制堡垒机可访问的内网资源

```bash
# 堡垒机安全加固配置

# /etc/ssh/sshd_config - 堡垒机专用配置
cat > /etc/ssh/sshd_config.d/bastion.conf << 'EOF'
# 堡垒机基础安全
Port 2222
Protocol 2
ListenAddress 0.0.0.0

# 主机密钥
HostKey /etc/ssh/ssh_host_ed25519_key
HostKey /etc/ssh/ssh_host_rsa_key

# 认证策略
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
ChallengeResponseAuthentication yes
AuthenticationMethods publickey,keyboard-interactive
MaxAuthTries 3
LoginGraceTime 60

# 用户和组控制
AllowGroups bastion-users

# 转发控制（堡垒机需要允许转发）
AllowTcpForwarding yes
AllowAgentForwarding no
X11Forwarding no
PermitTunnel no
GatewayPorts no

# 会话安全
ClientAliveInterval 300
ClientAliveCountMax 2
MaxSessions 5
MaxStartups 10:30:50

# 日志审计
LogLevel VERBOSE
SyslogFacility AUTHPRIV

# Banner
Banner /etc/ssh/bastion-banner
EOF

# 堡垒机登录横幅
cat > /etc/ssh/bastion-banner << 'EOF'
========================================================================
                    堡垒机 - 授权访问 ONLY
========================================================================
  本系统为企业内部运维堡垒机，所有操作均被记录和审计。
  未经授权的访问将受到法律追究。
  如有问题请联系安全团队：security@company.com
========================================================================
EOF

systemctl restart sshd
```

### 6.18.2 ProxyCommand与ProxyJump深度配置

SSH提供了多种方式通过跳板机连接内部服务器，最常用的是ProxyJump和ProxyCommand。ProxyJump是OpenSSH 7.3+引入的简化语法，底层仍然使用ProxyCommand机制。

**ProxyCommand工作原理**：ProxyCommand指定一个命令，SSH客户端会执行这个命令并通过其标准输入输出与目标服务器通信。常用的ProxyCommand命令是`ssh -W %h:%p bastion`，它表示在跳板机上建立一个到目标主机和端口的转发通道。

**ProxyJump vs ProxyCommand**：
- ProxyJump语法更简洁，可读性更好
- ProxyCommand更灵活，可以嵌套复杂的转发逻辑
- ProxyJump可以看作ProxyCommand的语法糖
- 多层跳转时，ProxyJump使用逗号分隔，更直观

```bash
# 客户端跳板机配置详解

# ~/.ssh/config

# ===== 基础跳板机配置 =====
Host bastion
    HostName bastion.example.com
    User admin
    Port 2222
    IdentityFile ~/.ssh/bastion_ed25519
    ForwardAgent no
    # 启用压缩加速跳板机连接
    Compression yes
    # 保持连接
    ServerAliveInterval 60
    ServerAliveCountMax 3

# ===== 单级跳板（ProxyJump方式）=====
Host internal-*
    HostName %h.internal.example.com
    User deploy
    IdentityFile ~/.ssh/internal_ed25519
    ProxyJump bastion
    # 不要在目标主机上启用agent转发
    ForwardAgent no

# ===== 单级跳板（ProxyCommand方式）=====
Host internal2-*
    HostName %h.internal.example.com
    User deploy
    IdentityFile ~/.ssh/internal_ed25519
    ProxyCommand ssh -W %h:%p bastion

# ===== 多级跳板（两层跳板）=====
Host dmz-bastion
    HostName dmz-bastion.example.com
    User admin
    Port 2222
    IdentityFile ~/.ssh/dmz_bastion_key

Host internal-bastion
    HostName internal-bastion.corp.local
    User admin
    IdentityFile ~/.ssh/internal_bastion_key
    ProxyJump dmz-bastion

Host prod-*
    HostName %h.corp.local
    User deploy
    IdentityFile ~/.ssh/prod_key
    ProxyJump internal-bastion

# ===== 动态端口转发（SOCKS代理）=====
# 通过堡垒机建立SOCKS代理
Host bastion-socks
    HostName bastion.example.com
    User admin
    Port 2222
    IdentityFile ~/.ssh/bastion_ed25519
    DynamicForward 1080
    # 仅本地监听
    GatewayPorts no
    # 后台运行
    # -f -N
```

```bash
# 命令行直接使用跳板机

# 使用ProxyJump（推荐）
ssh -J bastion.example.com admin@internal-server.local

# 多级跳板
ssh -J bastion1.example.com,bastion2.internal.com admin@target.local

# 指定不同端口的跳板
ssh -J admin@bastion.example.com:2222 admin@internal-server.local

# 使用ProxyCommand
ssh -o ProxyCommand="ssh -W %h:%p bastion.example.com" admin@internal-server.local

# SCP通过跳板机传输文件
scp -o ProxyJump=bastion localfile.txt admin@internal-server:/path/

# 使用scp的-J选项（新版OpenSSH）
scp -J bastion.example.com localfile.txt admin@internal-server:/path/

# rsync通过跳板机
rsync -avz -e "ssh -J bastion.example.com" localdir/ admin@internal-server:/remotedir/
```

### 6.18.3 端口转发安全注意事项

SSH端口转发是一个强大的功能，可以将任意TCP流量通过SSH加密隧道传输。但如果配置不当，端口转发也可能成为安全风险，被攻击者用来绕过网络边界访问内部资源。

**端口转发的三种类型**：
1. **本地转发（-L）**：将本地端口映射到远程服务器的端口
2. **远程转发（-R）**：将远程服务器的端口映射到本地端口
3. **动态转发（-D）**：创建SOCKS代理，动态转发任意端口

**安全风险点**：
- **GatewayPorts**：如果启用，远程转发端口会监听在所有网络接口上，外部用户也能访问
- **无认证转发**：转发端口本身不进行认证，任何能连接到端口的人都能访问内部服务
- **横向移动**：攻击者获取一台服务器权限后，可通过端口转发访问更多内部资源
- **绕过防火墙**：出站SSH连接通常被允许，攻击者可建立反向隧道绕过入站限制

```bash
# 安全的端口转发配置

# ========== 服务器端限制 ==========
# /etc/ssh/sshd_config
cat >> /etc/ssh/sshd_config.d/forwarding.conf << 'EOF'
# 禁用所有转发（高安全环境）
# DisableForwarding yes

# 精细控制转发权限
AllowTcpForwarding yes
# 仅允许本地转发，禁止远程转发
# AllowTcpForwarding local

# 禁止网关端口（远程转发只绑定到localhost）
GatewayPorts no

# 禁用X11转发
X11Forwarding no

# 禁用agent转发
AllowAgentForwarding no

# 禁用隧道设备
PermitTunnel no
EOF

systemctl restart sshd

# ========== 本地转发安全示例 ==========
# 安全的本地转发：仅绑定到localhost
ssh -L 127.0.0.1:3306:127.0.0.1:3306 user@db-server

# 不安全的写法：绑定到所有接口（默认行为）
# ssh -L 3306:localhost:3306 user@db-server  # 不推荐

# ========== 远程转发安全示例 ==========
# 安全的远程转发：远程只绑定到localhost
ssh -R 127.0.0.1:8080:127.0.0.1:80 user@remote-server

# 不安全的写法：配合GatewayPorts yes会暴露到公网
# ssh -R 8080:localhost:80 user@remote-server

# ========== 动态转发安全示例 ==========
# 安全的SOCKS代理：仅本地访问
ssh -D 127.0.0.1:1080 user@bastion

# 使用SOCKS代理访问内部网站
# curl --socks5-hostname 127.0.0.1:1080 http://internal-site.corp/
```

```bash
# authorized_keys中限制转发（针对单个密钥）

# ~/.ssh/authorized_keys

# 禁止该密钥使用任何转发
no-port-forwarding,no-agent-forwarding,no-X11-forwarding ssh-ed25519 AAA... user@limited

# 只允许特定的转发
permitopen="db.internal:3306",permitopen="web.internal:443" ssh-ed25519 AAA... user@db-access

# 完整的受限密钥示例
from="192.168.1.0/24",no-port-forwarding,no-agent-forwarding,no-X11-forwarding,no-pty,command="/usr/local/bin/backup-script.sh" ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... backup@automation

# 查看当前连接的转发情况
# 在服务器上查看
netstat -tlnp | grep sshd
ss -tlnp | grep sshd

# 查看SSH会话的转发
lsof -i -n -P | grep sshd
```

---

## 6.19 SSH多因素认证高级配置

### 6.19.1 Google Authenticator深度配置

Google Authenticator使用基于时间的一次性密码（TOTP，Time-based One-Time Password）算法，是最常用的双因素认证方案之一。TOTP基于共享密钥和当前时间生成6位数字验证码，每30秒更新一次。

**TOTP工作原理**：
1. 服务器和用户设备共享一个密钥（Secret Key）
2. 双方都使用当前时间戳（通常以30秒为步长）作为输入
3. 使用HMAC-SHA1算法计算哈希值
4. 从哈希值中提取6位数字作为动态验证码
5. 服务器验证用户输入的验证码是否匹配

**安全特性**：
- 动态性：验证码每30秒变化一次，单次有效
- 时间同步：服务器和客户端时间必须大致同步（通常允许±1步长偏差）
- 共享密钥：密钥必须安全存储，泄露将导致2FA失效
- 紧急备用码：初始配置时生成一组备用码，用于设备丢失时紧急登录

```bash
# Google Authenticator完整配置

# ========== 安装 ==========
# Debian/Ubuntu
apt-get update
apt-get install -y libpam-google-authenticator

# CentOS/RHEL (需要EPEL源)
yum install -y epel-release
yum install -y google-authenticator

# ========== 用户配置 ==========
# 为每个需要2FA的用户执行
su - username
google-authenticator

# 交互式配置选项说明：
# Do you want authentication tokens to be time-based (y/n) y
#   - 选择基于时间的TOTP（推荐）
# Do you want me to update your "~/.google_authenticator" file? (y/n) y
#   - 将配置写入用户目录
# Do you want to disallow multiple uses of the same authentication token? (y/n) y
#   - 禁止重复使用同一验证码（防止重放攻击）
# By default, tokens are good for 30 seconds... (y/n) n
#   - 默认30秒有效期，通常不需要延长
# Do you want to enable rate-limiting? (y/n) y
#   - 启用速率限制，防止暴力破解

# ========== 非交互式配置 ==========
# 自动化部署时使用
su - username -c 'google-authenticator -t -d -f -r 3 -R 30 -w 3 -s ~/.google_authenticator'
# 参数说明：
# -t : 使用TOTP（基于时间）
# -d : 禁止重复使用
# -f : 强制覆盖配置文件
# -r 3 -R 30 : 30秒内最多3次尝试
# -w 3 : 允许前后各1步时间偏差（共3个窗口）
# -s : 指定配置文件路径
```

```bash
# PAM配置详解

# /etc/pam.d/sshd

# 方案1：所有用户都需要2FA
# 在文件顶部添加：
auth required pam_google_authenticator.so nullok
# nullok表示未配置2FA的用户仍可登录（过渡期使用）
# 移除nullok则强制所有用户必须配置2FA

# 方案2：密钥认证后再需要2FA（最安全）
# /etc/ssh/sshd_config
AuthenticationMethods publickey,keyboard-interactive
# 这样用户必须同时拥有正确的私钥和2FA验证码

# 方案3：针对特定组启用2FA
# /etc/pam.d/sshd
auth [success=done default=ignore] pam_succeed_if.so user notingroup 2fa-users
auth required pam_google_authenticator.so

# 方案4：排除特定用户
auth [success=1 default=ignore] pam_succeed_if.so user in root:service-account
auth required pam_google_authenticator.so

# ========== 完整PAM配置示例 ==========
cat > /etc/pam.d/sshd << 'EOF'
# Standard Un*x authentication.
# @include common-auth  # 注释掉密码认证，如果只使用密钥+2FA

# Google Authenticator 2FA
auth required pam_google_authenticator.so nullok echo_verification_code

# Standard Un*x account and session
@include common-account
@include common-session
@include common-password
EOF

# ========== SSH配置 ==========
cat >> /etc/ssh/sshd_config.d/2fa.conf << 'EOF'
# 启用挑战响应认证（Google Authenticator需要）
ChallengeResponseAuthentication yes
UsePAM yes

# 认证方法组合
# 公钥 + 2FA（推荐，密码完全禁用）
AuthenticationMethods publickey,keyboard-interactive

# 或者：密码 + 2FA
# AuthenticationMethods password,keyboard-interactive

# 或者：公钥 或 密码+2FA
# AuthenticationMethods publickey password,keyboard-interactive
EOF

systemctl restart sshd
```

```bash
# Google Authenticator管理工具

# 查看用户配置文件
cat ~/.google_authenticator
# 第一行是密钥，后面是配置选项和备用码

# 查看备用码（紧急使用）
grep -A10 'scratch' ~/.google_authenticator
# 或在初始化时保存的紧急码

# 重新生成配置（会使旧密钥失效）
# google-authenticator -f

# 备份用户2FA配置
cp ~/.google_authenticator ~/.google_authenticator.backup

# 管理员重置用户2FA
# 删除用户配置，用户需要重新初始化
rm -f /home/username/.google_authenticator
# 下次登录时（如果配置了nullok）用户可正常登录，然后重新配置
```

### 6.19.2 PAM模块深入理解

PAM（Pluggable Authentication Modules，可插拔认证模块）是Linux系统的统一认证框架，它将认证机制与应用程序解耦，通过配置文件灵活组合不同的认证方式。SSH通过PAM可以集成多种认证方案。

**PAM的四种管理类型**：
1. **auth（认证）**：验证用户身份，如密码验证、2FA验证
2. **account（账户）**：检查账户是否允许访问，如账户过期、访问时间限制
3. **password（密码）**：管理密码修改，如密码强度检查
4. **session（会话）**：会话开始和结束时的操作，如挂载目录、记录日志

**PAM控制标志**：
- `required`：必须通过，失败后继续执行其他模块，最终返回失败
- `requisite`：必须通过，失败后立即返回失败
- `sufficient`：如果通过则直接返回成功，失败则继续
- `optional`：可选，结果不影响最终成败（除非是唯一模块）

```bash
# PAM配置详解

# 查看SSH的PAM配置
cat /etc/pam.d/sshd

# PAM模块常用路径
ls /lib/x86_64-linux-gnu/security/    # Debian/Ubuntu
ls /usr/lib64/security/               # CentOS/RHEL

# 常用PAM模块：
# pam_unix.so          - 传统Unix密码认证
# pam_google_authenticator.so - Google Authenticator
# pam_yubico.so        - YubiKey认证
# pam_succeed_if.so    - 条件判断
# pam_exec.so          - 执行外部脚本
# pam_tally2.so / pam_faillock.so - 登录失败锁定
# pam_access.so        - 访问控制
# pam_motd.so          - 显示登录消息
# pam_limits.so        - 资源限制
```

```bash
# 高级PAM配置示例

# ========== 登录失败锁定 ==========
# /etc/pam.d/sshd
# 添加到auth部分
auth required pam_faillock.so preauth silent audit deny=5 unlock_time=900
auth sufficient pam_unix.so
auth [default=die] pam_faillock.so authfail audit deny=5 unlock_time=900
auth required pam_faillock.so authsucc audit deny=5 unlock_time=900

# 查看失败次数
faillock --user username
faillock --user username --reset

# ========== 访问时间限制 ==========
# /etc/security/time.conf
# 限制sshd服务的访问时间
# sshd;*;admin;Wk0800-1800
# sshd;*;deploy;Al0000-2400

# ========== 基于时间的访问控制 ==========
# 使用pam_exec实现更灵活的控制
cat > /usr/local/bin/check-time.sh << 'EOF'
#!/bin/bash
# 只允许工作时间登录（周一到周五 9:00-18:00）
DAY=$(date +%u)
HOUR=$(date +%H)
if [ "$DAY" -ge 1 ] && [ "$DAY" -le 5 ] && [ "$HOUR" -ge 9 ] && [ "$HOUR" -lt 18 ]; then
    exit 0
fi
# 管理员组不受限制
if groups "$PAM_USER" | grep -q "\badmin\b"; then
    exit 0
fi
exit 1
EOF
chmod +x /usr/local/bin/check-time.sh

# /etc/pam.d/sshd 添加：
# account required pam_exec.so /usr/local/bin/check-time.sh
```

### 6.19.3 硬件密钥YubiKey配置

YubiKey是Yubico公司生产的硬件安全密钥，支持多种认证协议，包括U2F、FIDO2/WebAuthn、OTP、PIV、OpenPGP等。使用YubiKey进行SSH认证可以提供极高的安全性，因为私钥存储在硬件中，永远不会被导出。

**YubiKey的认证方式**：
1. **Yubico OTP**：YubiKey专用的一次性密码，需要连接YubiCloud验证
2. **U2F/FIDO2**：通用双因素认证标准，可与SSH集成
3. **PIV智能卡**：将SSH密钥存储在YubiKey的智能卡中
4. **OpenPGP**：将GPG密钥存储在YubiKey中，可用于SSH认证

**硬件密钥的优势**：
- 防窃取：私钥无法从硬件中导出
- 防钓鱼：U2F/FIDO2内置网站绑定，防止钓鱼网站欺骗
- 无需电池：依靠USB供电，随身携带
- 多协议支持：一个设备支持多种认证方式

```bash
# YubiKey SSH认证配置（PIV方式）

# ========== 安装工具 ==========
# Debian/Ubuntu
apt-get install -y yubico-piv-tool opensc-pkcs11 libpam-yubico

# CentOS/RHEL
yum install -y yubico-piv-tool opensc pam_yubico

# ========== 生成密钥并导入YubiKey ==========
# 生成RSA密钥对
yubico-piv-tool -s 9a -a generate -o public.pem

# 生成自签名证书（或使用CA签发）
yubico-piv-tool -a verify-pin -a selfsign-certificate -s 9a \
    -S "/CN=SSH Key/" -i public.pem -o cert.pem

# 导入证书到YubiKey
yubico-piv-tool -a import-certificate -s 9a -i cert.pem

# 验证
yubico-piv-tool -a status

# ========== 配置SSH使用YubiKey ==========
# 提取公钥
ssh-keygen -D /usr/lib/x86_64-linux-gnu/opensc-pkcs11.so -e
# 或
pkcs11-tool --read-object --type pubkey --id 9a --output-file pubkey.der
ssh-keygen -i -m PKCS8 -f pubkey.der

# 将公钥添加到服务器的authorized_keys

# 客户端连接时指定PKCS#11库
ssh -I /usr/lib/x86_64-linux-gnu/opensc-pkcs11.so user@server

# 或在~/.ssh/config中配置
Host yk-*
    PKCS11Provider /usr/lib/x86_64-linux-gnu/opensc-pkcs11.so
    User admin
```

```bash
# YubiKey OTP方式配置（PAM集成）

# ========== 获取YubiKey ID ==========
# 访问 https://upgrade.yubico.com/getapikey/ 获取API密钥
# 或使用YubiKey Manager

# 每个YubiKey有一个唯一的12位ID（modhex编码）
# 插入YubiKey后长按按钮输出的OTP前12位就是ID

# ========== 配置PAM ==========
# /etc/pam.d/sshd
auth required pam_yubico.so id=12345 key=your_api_key authfile=/etc/ssh/yubikey_mappings

# 创建用户映射文件
cat > /etc/ssh/yubikey_mappings << 'EOF'
admin:ccccccabcdef
admin:ccccccghijkl
deploy:ccccccmnopqr
EOF
chmod 600 /etc/ssh/yubikey_mappings

# 说明：一个用户可以绑定多个YubiKey（每行一个）

# ========== SSH配置 ==========
cat >> /etc/ssh/sshd_config.d/yubikey.conf << 'EOF'
ChallengeResponseAuthentication yes
UsePAM yes
AuthenticationMethods publickey,keyboard-interactive
EOF

systemctl restart sshd
```

```bash
# FIDO2/U2F方式（OpenSSH 8.2+支持）

# 生成FIDO2驻留密钥
ssh-keygen -t ed25519-sk -O resident -f ~/.ssh/id_ed25519_sk

# 参数说明：
# -t ed25519-sk 或 ecdsa-sk : FIDO2密钥类型
# -O resident : 密钥存储在安全密钥中（可发现凭据）
# -O application=ssh:自定义标识 : 设置应用标识
# -O verify-required : 需要用户验证（指纹/密码）

# 生成非驻留密钥（私钥在本地，YubiKey只用于签名）
ssh-keygen -t ed25519-sk -f ~/.ssh/id_ed25519_sk

# 将公钥部署到服务器
ssh-copy-id -i ~/.ssh/id_ed25519_sk.pub user@server

# 使用FIDO2密钥登录
ssh -i ~/.ssh/id_ed25519_sk user@server

# 从YubiKey加载驻留密钥
ssh-keygen -K
# 会从安全密钥中导出所有驻留密钥到~/.ssh/
```

---

## 6.20 chroot监狱配置

### 6.20.1 chroot监狱原理

chroot（change root）是Unix/Linux系统中的一种机制，它可以将进程及其子进程的根目录限制在文件系统的特定目录下。在SSH中使用chroot监狱，可以限制用户只能访问指定的目录树，防止用户浏览整个文件系统，提高系统安全性。

**chroot的安全原理**：
- 改变进程的根目录视角，使其无法访问上级目录
- 被限制的进程无法访问chroot监狱外的文件
- 即使进程被攻破，攻击者也只能访问有限的文件

**chroot的局限性**：
- 需要root权限才能设置chroot
- chroot不是完全安全的，有经验的攻击者可能在特定条件下逃逸
- 需要在监狱内提供必要的系统文件（设备节点、库文件等）
- 对于SFTP场景，OpenSSH的internal-sftp配合ChrootDirectory是更简单的方案

```bash
# 手动构建chroot监狱

# ========== 创建监狱目录结构 ==========
CHROOT_DIR=/opt/chroot
mkdir -p $CHROOT_DIR
mkdir -p $CHROOT_DIR/{bin,lib,lib64,etc,dev,home,usr/bin,usr/lib}

# ========== 创建设备文件 ==========
mknod -m 666 $CHROOT_DIR/dev/null c 1 3
mknod -m 666 $CHROOT_DIR/dev/zero c 1 5
mknod -m 666 $CHROOT_DIR/dev/random c 1 8
mknod -m 666 $CHROOT_DIR/dev/urandom c 1 9
mknod -m 666 $CHROOT_DIR/dev/tty c 5 0

# ========== 复制必要的命令 ==========
# 复制bash
cp /bin/bash $CHROOT_DIR/bin/
# 复制ls
cp /bin/ls $CHROOT_DIR/bin/
# 复制cat
cp /bin/cat $CHROOT_DIR/bin/

# ========== 复制依赖库 ==========
# 查找二进制文件的依赖库
ldd /bin/bash
ldd /bin/ls
ldd /bin/cat

# 复制所有依赖库（以bash为例）
cp /lib/x86_64-linux-gnu/libtinfo.so.* $CHROOT_DIR/lib/ 2>/dev/null
cp /lib/x86_64-linux-gnu/libdl.so.* $CHROOT_DIR/lib/ 2>/dev/null
cp /lib/x86_64-linux-gnu/libc.so.* $CHROOT_DIR/lib/ 2>/dev/null
cp /lib64/ld-linux-x86-64.so.* $CHROOT_DIR/lib64/ 2>/dev/null

# 自动复制依赖库的脚本
copy_libs() {
    binary=$1
    chroot_dir=$2
    ldd "$binary" | grep -o '/[^ ]*' | while read lib; do
        lib_dir=$(dirname "$lib")
        mkdir -p "${chroot_dir}${lib_dir}"
        cp "$lib" "${chroot_dir}${lib}"
    done
}

copy_libs /bin/bash $CHROOT_DIR
copy_libs /bin/ls $CHROOT_DIR
copy_libs /bin/cat $CHROOT_DIR

# ========== 创建用户 ==========
useradd -m -d /home/restricted -s /bin/bash restricted-user

# 设置密码
passwd restricted-user

# ========== 测试chroot ==========
chroot $CHROOT_DIR /bin/bash
```

### 6.20.2 jailkit工具安装使用

jailkit是一套专门用于构建和管理chroot监狱的工具集，它可以自动化地创建监狱环境、复制必要的程序和库、管理监狱内的用户。相比手动配置，jailkit更加便捷和可靠。

**jailkit的主要组件**：
- `jk_init`：初始化监狱，创建目录结构和必要文件
- `jk_jailuser`：将用户移入监狱
- `jk_addjailsw`：向监狱中添加程序及其依赖
- `jk_check`：检查监狱配置的安全性
- `jk_lsh`：监狱的登录shell

**jailkit的优势**：
- 自动化处理依赖库复制
- 提供安全的监狱用户管理
- 包含多种预定义的环境配置（shell、sftp、git等）
- 自动设置正确的权限和所有权

```bash
# jailkit安装和配置

# ========== 安装jailkit ==========
# Debian/Ubuntu
apt-get install -y jailkit

# CentOS/RHEL (需要EPEL)
yum install -y epel-release
yum install -y jailkit

# 源码安装（最新版本）
# wget https://olivier.sessink.nl/jailkit/jailkit-2.23.tar.gz
# tar xzf jailkit-2.23.tar.gz
# cd jailkit-2.23
# ./configure
# make
# make install

# ========== 初始化监狱 ==========
CHROOT_DIR=/opt/jail
mkdir -p $CHROOT_DIR

# 初始化基础环境
jk_init -j $CHROOT_DIR netbasics
jk_init -j $CHROOT_DIR shell

# 可用的预定义环境：
# netbasics - 基本网络工具
# shell - 基本shell环境
# sftp - SFTP环境
# scp - SCP环境
# git - Git服务
# ssh - SSH相关
# editors - 编辑器
# utils - 系统工具
# xauth - X11认证

# 查看可用的配置
ls /etc/jailkit/

# ========== 添加更多程序 ==========
# 添加特定命令到监狱
jk_addjailsw $CHROOT_DIR -P /usr/bin/vim
jk_addjailsw $CHROOT_DIR -P /usr/bin/less
jk_addjailsw $CHROOT_DIR -P /bin/grep

# 添加整个目录的程序
jk_addjailsw $CHROOT_DIR -d /bin
jk_addjailsw $CHROOT_DIR -d /usr/bin

# 检查监狱
jk_check $CHROOT_DIR

# ========== 创建监狱用户 ==========
# 创建系统用户
useradd -m jailed-user
passwd jailed-user

# 将用户移入监狱
jk_jailuser -m -j $CHROOT_DIR jailed-user

# 选项说明：
# -m : 移动用户主目录到监狱内
# -j <路径> : 监狱目录
# -s <shell> : 指定shell

# 查看用户配置
grep jailed-user /etc/passwd
# shell会变成/usr/sbin/jk_lsh

# ========== 配置jk_lsh ==========
# 监狱用户的shell配置
cat $CHROOT_DIR/etc/passwd
cat $CHROOT_DIR/etc/group

# jk_lsh配置文件
cat $CHROOT_DIR/etc/jailkit/jk_lsh.ini

# 修改用户可执行的命令
cat > $CHROOT_DIR/etc/jailkit/jk_lsh.ini << 'EOF'
[jailed-user]
paths = /usr/bin, /bin, /usr/lib
executables = /bin/bash, /bin/ls, /bin/cat, /usr/bin/vim
allow_word_expansion = 1
EOF
```

```bash
# jailkit高级配置

# ========== SSH配置监狱用户 ==========
cat >> /etc/ssh/sshd_config.d/jail.conf << 'EOF'
Match Group jailed
    ChrootDirectory /opt/jail
    ForceCommand /usr/sbin/jk_lsh
    AllowTcpForwarding no
    X11Forwarding no
EOF

systemctl restart sshd

# ========== 监狱内用户管理 ==========
# 在监狱内创建额外用户
jk_jailuser -j $CHROOT_DIR another-user

# 删除监狱用户
userdel jailed-user
rm -rf $CHROOT_DIR/home/jailed-user

# ========== 限制SFTP用户 ==========
# 创建纯SFTP监狱
CHROOT_SFTP=/opt/sftp-jail
mkdir -p $CHROOT_SFTP
jk_init -j $CHROOT_SFTP sftp

# 创建SFTP用户
useradd -M -d /sftp -s /usr/lib/openssh/sftp-server sftpuser
passwd sftpuser
jk_jailuser -m -j $CHROOT_SFTP -s /usr/lib/openssh/sftp-server sftpuser

# ========== 监狱安全检查 ==========
# 运行安全检查
jk_check -v $CHROOT_DIR

# 常见安全问题：
# 1. 监狱根目录不能被监狱用户写入
# 2. 监狱内的setuid程序应被移除或限制
# 3. 设备文件应控制在最小范围
# 4. 监狱内的配置文件不应包含敏感信息
```

### 6.20.3 SFTP chroot配置

SFTP chroot是OpenSSH提供的一种简单有效的方式，用于限制SFTP用户只能访问特定目录。与jailkit不同，OpenSSH内置的SFTP chroot不需要复制系统文件，因为使用的是`internal-sftp`子系统。

**SFTP chroot的要求**：
- ChrootDirectory指定的目录及其所有上级目录必须是root所有
- 目录权限不能是组或其他用户可写的
- 使用ForceCommand internal-sftp强制使用内置SFTP服务器
- 用户必须有chroot目录下某个子目录的写入权限

**配置步骤**：
1. 创建chroot根目录（root所有，权限755）
2. 在chroot根目录下创建用户可写的子目录
3. 配置sshd_config的Match块
4. 创建用户并设置正确的主目录

```bash
# SFTP chroot完整配置

# ========== 目录结构规划 ==========
# /srv/sftp/          - chroot根目录（root:root, 755）
#   ├── uploads/      - 公共上传目录（root:sftpusers, 775）
#   └── user1/        - user1的目录（user1:sftpusers, 700）
#   └── user2/        - user2的目录（user2:sftpusers, 700）

# ========== 创建目录结构 ==========
# chroot根目录（必须root所有，不能组可写）
mkdir -p /srv/sftp
chown root:root /srv/sftp
chmod 755 /srv/sftp

# 创建用户组
groupadd sftpusers

# 公共上传目录
mkdir -p /srv/sftp/uploads
chown root:sftpusers /srv/sftp/uploads
chmod 775 /srv/sftp/uploads

# ========== 为用户创建独立目录 ==========
# 创建用户1
useradd -M -d /sftp -s /usr/sbin/nologin sftpuser1
usermod -aG sftpusers sftpuser1
passwd sftpuser1

# 创建用户1的个人目录
mkdir -p /srv/sftp/sftpuser1
chown sftpuser1:sftpusers /srv/sftp/sftpuser1
chmod 700 /srv/sftp/sftpuser1

# 创建用户2
useradd -M -d /sftp -s /usr/sbin/nologin sftpuser2
usermod -aG sftpusers sftpuser2
passwd sftpuser2

mkdir -p /srv/sftp/sftpuser2
chown sftpuser2:sftpusers /srv/sftp/sftpuser2
chmod 700 /srv/sftp/sftpuser2

# ========== 配置sshd_config ==========
cat >> /etc/ssh/sshd_config.d/sftp-chroot.conf << 'EOF'
# SFTP chroot配置
Match Group sftpusers
    # 强制使用内置SFTP服务器
    ForceCommand internal-sftp
    # chroot目录（%h表示用户主目录，这里用固定路径）
    ChrootDirectory /srv/sftp
    # 禁用端口转发
    AllowTcpForwarding no
    X11Forwarding no
    PermitTunnel no
    # 禁用.ssh目录（使用密码或其他认证方式）
    # AuthorizedKeysFile none
    # 启用审计日志
    LogLevel VERBOSE
EOF

# 注意：ChrootDirectory指定的目录必须是root所有，且不能组可写

systemctl restart sshd
```

```bash
# SFTP chroot高级配置

# ========== 使用密钥认证 ==========
# 由于chroot后用户无法访问~/.ssh，需要特殊配置

# 方法1：将authorized_keys放在chroot外的集中位置
mkdir -p /etc/ssh/sftp-keys
chmod 700 /etc/ssh/sftp-keys

# 为每个用户创建授权密钥文件
# /etc/ssh/sftp-keys/sftpuser1
ssh-keygen -t ed25519 -f /tmp/sftpuser1_key -N "" -C "sftpuser1"
cat /tmp/sftpuser1_key.pub > /etc/ssh/sftp-keys/sftpuser1
chmod 600 /etc/ssh/sftp-keys/sftpuser1

# 配置sshd_config
cat >> /etc/ssh/sshd_config.d/sftp-chroot.conf << 'EOF'
Match Group sftpusers
    ForceCommand internal-sftp
    ChrootDirectory /srv/sftp
    AllowTcpForwarding no
    X11Forwarding no
    PubkeyAuthentication yes
    AuthorizedKeysFile /etc/ssh/sftp-keys/%u
EOF

systemctl restart sshd

# ========== 每个用户独立chroot ==========
# 配置方式：ChrootDirectory /srv/sftp/%u
# 注意每个用户的chroot目录都必须是root所有

mkdir -p /srv/sftp/{user1,user2}/upload
chown root:root /srv/sftp/user1 /srv/sftp/user2
chmod 755 /srv/sftp/user1 /srv/sftp/user2
chown user1:sftpusers /srv/sftp/user1/upload
chown user2:sftpusers /srv/sftp/user2/upload

cat >> /etc/ssh/sshd_config.d/sftp-chroot.conf << 'EOF'
Match Group sftpusers
    ForceCommand internal-sftp
    ChrootDirectory /srv/sftp/%u
    AllowTcpForwarding no
    X11Forwarding no
EOF

systemctl restart sshd

# ========== 测试SFTP连接 ==========
# 测试SFTP登录
sftp -P 22 sftpuser1@server

# 列出文件
sftp> ls
sftp> cd sftpuser1
sftp> put localfile.txt
sftp> get remotefile.txt

# 测试是否能跳出chroot
sftp> cd /
sftp> cd ..
sftp> ls /etc    # 应该失败
```

---

## 6.21 SSH审计与监控

### 6.21.1 SSH日志详细分析

SSH日志是安全审计和问题排查的重要依据。OpenSSH的日志记录了所有连接尝试、认证结果、会话操作等关键信息。通过分析SSH日志，可以发现攻击行为、异常登录和潜在的安全问题。

**SSH日志位置**：
- Debian/Ubuntu：`/var/log/auth.log`
- CentOS/RHEL：`/var/log/secure`
- systemd journal：`journalctl -u sshd`

**重要的日志事件类型**：
1. **连接建立**：`Connection from <ip> port <port>`
2. **认证成功**：`Accepted publickey/password for <user> from <ip>`
3. **认证失败**：`Failed password/publickey for <user> from <ip>`
4. **无效用户**：`Invalid user <user> from <ip>`
5. **断开连接**：`Disconnected from user <user> <ip>`
6. **会话开始**：`pam_unix(sshd:session): session opened`

```bash
# SSH日志分析命令

# ========== 基本查看 ==========
# 查看实时SSH日志
tail -f /var/log/auth.log | grep sshd
# 或
journalctl -u sshd -f

# 查看最近的登录记录
last -a
lastb -a  # 失败的登录

# ========== 认证成功分析 ==========
# 查看成功的SSH登录
grep "Accepted" /var/log/auth.log
grep "Accepted publickey" /var/log/auth.log
grep "Accepted password" /var/log/auth.log

# 统计成功登录的用户
grep "Accepted" /var/log/auth.log | awk '{print $9}' | sort | uniq -c | sort -nr

# 统计成功登录的来源IP
grep "Accepted" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -nr

# ========== 认证失败分析 ==========
# 查看所有失败尝试
grep "Failed" /var/log/auth.log

# 查看密码失败
grep "Failed password" /var/log/auth.log

# 查看无效用户尝试
grep "Invalid user" /var/log/auth.log

# 统计攻击来源IP Top 10
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head -10

# 统计被攻击的用户名 Top 10
grep "Failed password" /var/log/auth.log | awk -F'for ' '{print $2}' | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# ========== 会话审计 ==========
# 查看会话开始和结束
grep -E "session opened|session closed" /var/log/auth.log

# 查看特定用户的会话
grep "session opened for user admin" /var/log/auth.log

# 查看会话持续时间（需配合last命令）
last -F admin
```

```bash
# 高级日志分析脚本

cat > /usr/local/bin/ssh-audit.sh << 'SCRIPT_EOF'
#!/bin/bash
# SSH日志审计脚本

LOG_FILE="/var/log/auth.log"
echo "=========================================="
echo "       SSH 安全审计报告"
echo "生成时间: $(date)"
echo "=========================================="
echo ""

# 1. 总览
echo "1. 登录统计"
echo "------------------------------------------"
TOTAL_SUCCESS=$(grep -c "Accepted" $LOG_FILE 2>/dev/null || echo 0)
TOTAL_FAILED=$(grep -c "Failed password" $LOG_FILE 2>/dev/null || echo 0)
TOTAL_INVALID=$(grep -c "Invalid user" $LOG_FILE 2>/dev/null || echo 0)
echo "成功登录次数: $TOTAL_SUCCESS"
echo "失败登录次数: $TOTAL_FAILED"
echo "无效用户尝试: $TOTAL_INVALID"
echo ""

# 2. 成功登录用户排行
echo "2. 成功登录用户 Top 10"
echo "------------------------------------------"
grep "Accepted" $LOG_FILE 2>/dev/null | awk '{print $9}' | sort | uniq -c | sort -rn | head -10
echo ""

# 3. 攻击来源IP排行
echo "3. 失败登录来源IP Top 10"
echo "------------------------------------------"
grep "Failed password" $LOG_FILE 2>/dev/null | awk '{print $11}' | sort | uniq -c | sort -rn | head -10
echo ""

# 4. 最常被攻击的用户名
echo "4. 最常被攻击的用户名 Top 10"
echo "------------------------------------------"
grep "Failed password" $LOG_FILE 2>/dev/null | \
    sed 's/.*Failed password for //' | \
    sed 's/ from .*//' | \
    sort | uniq -c | sort -rn | head -10
echo ""

# 5. 最近的成功登录
echo "5. 最近10次成功登录"
echo "------------------------------------------"
grep "Accepted" $LOG_FILE 2>/dev/null | tail -10
echo ""

# 6. 异常检测（短时间大量失败）
echo "6. 异常行为检测"
echo "------------------------------------------"
# 查找5分钟内失败超过10次的IP
awk '/Failed password/ {
    split($2, t, ":");
    minute = t[1] ":" t[2];
    key = $1 " " minute " " $11;
    count[key]++;
}
END {
    for (k in count) {
        if (count[k] > 10) {
            print k, count[k], "次失败"
        }
    }
}' $LOG_FILE 2>/dev/null | head -10
echo ""

echo "=========================================="
SCRIPT_EOF
chmod +x /usr/local/bin/ssh-audit.sh

# 运行审计报告
/usr/local/bin/ssh-audit.sh
```

### 6.21.2 会话录制script工具

script是一个简单但强大的终端会话录制工具，它可以记录用户在终端中的所有输入输出。配合SSH使用，可以实现完整的操作审计，记录用户在服务器上执行的每一条命令。

**script的工作原理**：
- script启动一个新的shell进程
- 它将所有终端输入输出复制到指定的文件中
- 使用scriptreplay可以回放录制的会话
- 支持时间信息文件，可以精确还原输入速度

**使用场景**：
- 安全审计：记录运维人员的所有操作
- 问题排查：复现用户遇到的问题
- 合规要求：满足等保等法规的审计要求
- 教学演示：录制教程供他人学习

```bash
# script命令基础使用

# ========== 基本录制 ==========
# 录制会话到文件
script session.log

# 执行一些命令
ls -la
whoami
date

# 退出录制
exit

# 查看录制内容
cat session.log

# ========== 带时间戳录制 ==========
# 录制时同时记录时间信息
script -t 2> session.time session.log

# 或使用--timing参数（新版）
script --timing=session.time session.log

# 回放会话
scriptreplay session.time session.log

# 调整回放速度（2倍速）
scriptreplay -d 2 session.time session.log

# 慢速回放（0.5倍速）
scriptreplay -d 0.5 session.time session.log
```

```bash
# SSH会话自动录制配置

# ========== 方法1：通过.bashrc自动录制 ==========
# 在用户的.bashrc中添加

cat >> /etc/skel/.bashrc << 'EOF'

# SSH会话自动录制
if [ -n "$SSH_CONNECTION" ] && [ -z "$SCRIPT_RECORDING" ]; then
    export SCRIPT_RECORDING=1
    LOG_DIR="/var/log/sessions"
    LOG_FILE="$LOG_DIR/$(whoami)-$(date +%Y%m%d-%H%M%S)-$$.log"
    TIME_FILE="$LOG_DIR/$(whoami)-$(date +%Y%m%d-%H%M%S)-$$.time"
    mkdir -p "$LOG_DIR"
    chmod 733 "$LOG_DIR"
    echo "会话已录制: $LOG_FILE"
    exec script -q -t 2> "$TIME_FILE" "$LOG_FILE"
fi
EOF

# 创建会话日志目录
mkdir -p /var/log/sessions
chmod 733 /var/log/sessions
chmod +t /var/log/sessions

# ========== 方法2：通过PAM强制录制 ==========
# 使用pam_script或pam_exec

cat > /usr/local/bin/record-session.sh << 'EOF'
#!/bin/bash
if [ "$PAM_TYPE" = "open_session" ] && [ -n "$PAM_USER" ]; then
    LOG_DIR="/var/log/sessions"
    mkdir -p "$LOG_DIR"
    LOG_FILE="$LOG_DIR/${PAM_USER}-$(date +%Y%m%d-%H%M%S)-${PPID}.log"
    echo "$(date) - Session started for $PAM_USER from $PAM_RHOST" >> "$LOG_FILE"
fi
exit 0
EOF
chmod +x /usr/local/bin/record-session.sh

# ========== 方法3：使用ForceCommand ==========
# /etc/ssh/sshd_config
# Match Group audited
#     ForceCommand script -q -t 2>/var/log/sessions/$USER-$(date +%Y%m%d-%H%M%S).time /var/log/sessions/$USER-$(date +%Y%m%d-%H%M%S).log
```

```bash
# 会话录制管理

# ========== 查看所有会话记录 ==========
ls -la /var/log/sessions/

# 按用户查看
ls -la /var/log/sessions/ | grep admin

# 按日期查看
ls -la /var/log/sessions/ | grep "$(date +%Y%m%d)"

# ========== 会话回放 ==========
# 查看某个会话的内容
cat /var/log/sessions/admin-20260625-103000-12345.log

# 回放会话
scriptreplay /var/log/sessions/admin-20260625-103000-12345.time \
             /var/log/sessions/admin-20260625-103000-12345.log

# 搜索会话中的特定命令
grep "rm -rf" /var/log/sessions/*.log
grep "sudo" /var/log/sessions/admin-*.log

# ========== 日志轮转 ==========
# 配置logrotate管理会话日志
cat > /etc/logrotate.d/ssh-sessions << 'EOF'
/var/log/sessions/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 root root
    maxage 30
}
EOF

# ========== 更专业的工具：tlog ==========
# tlog是专门为日志记录设计的终端I/O记录器

# 安装
apt-get install tlog
yum install tlog

# 配置用户使用tlog-shell
usermod -s /usr/bin/tlog-rec-shell username

# 配置tlog
cat > /etc/tlog/tlog-rec.conf << 'EOF'
{
    "version": "2",
    "rec": {
        "file": "/var/log/tlog/%u-%Y%m%d-%H%M%S.%pid.log",
        "syslog": true,
        "latency": 10,
        "payload": 2048
    }
}
EOF

# 使用tlog-play回放
tlog-play -r file --file-path=/var/log/tlog/user-20260625-103000.12345.log
```

### 6.21.3 实时监控脚本示例

实时监控SSH活动可以及时发现异常行为和攻击尝试。通过脚本实时分析日志和系统状态，可以在攻击发生时立即发出警报。

**实时监控的关键指标**：
- 新的SSH连接建立
- 失败的登录尝试
- root用户登录
- 异常时间的登录
- 大量失败尝试（暴力破解）
- 新用户创建或权限变更

```bash
# SSH实时监控脚本

cat > /usr/local/bin/ssh-monitor.sh << 'SCRIPT_EOF'
#!/bin/bash
# SSH实时监控脚本

LOG_FILE="/var/log/auth.log"
ALERT_EMAIL="admin@example.com"
FAILED_THRESHOLD=10       # 单IP失败次数阈值
BLOCK_DURATION=3600      # 封禁时间（秒）

# 记录失败IP的计数
declare -A failed_ips
declare -A blocked_ips

echo "[$(date)] SSH监控启动..."
echo "监控日志文件: $LOG_FILE"
echo "失败阈值: $FAILED_THRESHOLD 次"
echo "----------------------------------------"

# 实时跟踪日志
tail -fn0 "$LOG_FILE" | while read line; do
    # 检测失败的登录
    if echo "$line" | grep -q "Failed password"; then
        IP=$(echo "$line" | grep -oE '([0-9]{1,3}\.){3}[0-9]{1,3}' | head -1)
        USER=$(echo "$line" | sed 's/.*Failed password for //' | sed 's/ from .*//')
        
        if [ -n "$IP" ]; then
            # 增加计数
            if [ -z "${failed_ips[$IP]}" ]; then
                failed_ips[$IP]=1
            else
                failed_ips[$IP]=$((failed_ips[$IP] + 1))
            fi
            
            COUNT=${failed_ips[$IP]}
            echo "[$(date "+%H:%M:%S")] 失败尝试: $USER@$IP (第 $COUNT 次)"
            
            # 超过阈值则报警并封禁
            if [ "$COUNT" -ge "$FAILED_THRESHOLD" ] && [ -z "${blocked_ips[$IP]}" ]; then
                blocked_ips[$IP]=1
                echo "[$(date "+%H:%M:%S")] 警告: $IP 失败次数超过阈值 ($COUNT 次)，正在封禁..."
                
                # 使用iptables封禁
                iptables -I INPUT -s "$IP" -j DROP 2>/dev/null
                
                # 发送邮件警报
                echo "SSH暴力破解攻击检测!
来源IP: $IP
目标用户: $USER
失败次数: $COUNT
已自动封禁IP" | mail -s "【安全警报】SSH暴力破解攻击" "$ALERT_EMAIL" 2>/dev/null
            fi
        fi
    fi
    
    # 检测成功登录
    if echo "$line" | grep -q "Accepted"; then
        IP=$(echo "$line" | grep -oE '([0-9]{1,3}\.){3}[0-9]{1,3}' | head -1)
        USER=$(echo "$line" | grep -oP 'for \K[^ ]+')
        METHOD=$(echo "$line" | grep -oP 'Accepted \K[^ ]+')
        
        echo "[$(date "+%H:%M:%S")] 成功登录: $USER@$IP ($METHOD)"
        
        # root登录特别提醒
        if [ "$USER" = "root" ]; then
            echo "[$(date "+%H:%M:%S")] 警告: ROOT用户从 $IP 登录!"
        fi
    fi
    
    # 检测无效用户
    if echo "$line" | grep -q "Invalid user"; then
        IP=$(echo "$line" | grep -oE '([0-9]{1,3}\.){3}[0-9]{1,3}' | head -1)
        USER=$(echo "$line" | sed 's/.*Invalid user //' | sed 's/ from .*//')
        echo "[$(date "+%H:%M:%S")] 无效用户尝试: $USER from $IP"
    fi
done
SCRIPT_EOF
chmod +x /usr/local/bin/ssh-monitor.sh
```

```bash
# 当前活动会话监控

cat > /usr/local/bin/ssh-who.sh << 'SCRIPT_EOF'
#!/bin/bash
# SSH活动会话监控

echo "=========================================="
echo "       当前SSH活动会话"
echo "时间: $(date)"
echo "=========================================="
echo ""

# 使用who命令
echo "1. 登录用户（who）:"
echo "------------------------------------------"
who -u
echo ""

# 使用w命令（更详细）
echo "2. 用户活动（w）:"
echo "------------------------------------------"
w
echo ""

# 查看sshd进程
echo "3. SSH进程树:"
echo "------------------------------------------"
ps auxf | grep -E "sshd|bash" | grep -v grep
echo ""

# 查看网络连接
echo "4. SSH网络连接:"
echo "------------------------------------------"
ss -tnp | grep :22
echo ""

# 查看最近登录
echo "5. 最近登录记录:"
echo "------------------------------------------"
last -a -10
echo ""

echo "=========================================="
SCRIPT_EOF
chmod +x /usr/local/bin/ssh-who.sh
```

```bash
# 使用auditd进行细粒度审计

# 安装auditd
apt-get install auditd
yum install audit

# 添加SSH相关审计规则
cat > /etc/audit/rules.d/ssh.rules << 'EOF'
# 监控sshd配置文件变更
-w /etc/ssh/sshd_config -p wa -k sshd_config
-w /etc/ssh/ssh_config -p wa -k ssh_config
-w /etc/ssh/ -p wa -k ssh_configs

# 监控authorized_keys变更
-w /root/.ssh/ -p wa -k root_ssh
-w /home/ -p rw -k user_ssh

# 监控认证相关文件
-w /etc/passwd -p wa -k passwd
-w /etc/shadow -p wa -k shadow
-w /etc/group -p wa -k group

# 监控PAM配置
-w /etc/pam.d/ -p wa -k pam

# 监控认证日志
-w /var/log/auth.log -p wa -k auth_log
-w /var/log/secure -p wa -k auth_log
EOF

# 重启auditd
systemctl restart auditd

# 查看审计日志
ausearch -k sshd_config -i
ausearch -m USER_AUTH -i
ausearch -ui 0 -m USER_LOGIN -i  # root登录事件

# 生成审计报告
aureport --auth
aureport --login
aureport -k sshd_config
```

---

## 6.22 SSH攻击检测与防御

### 6.22.1 fail2ban高级配置

fail2ban是最常用的SSH暴力破解防御工具，它通过监控日志文件，检测到多次失败尝试后自动更新防火墙规则封禁攻击者IP。除了基本的SSH防护，fail2ban还可以配置更高级的防护策略。

**fail2ban的工作原理**：
1. 监控指定的日志文件（如/var/log/auth.log）
2. 使用正则表达式匹配失败的登录尝试
3. 在规定时间窗口内，失败次数超过阈值则触发动作
4. 执行封禁动作（iptables、ip6tables、firewalld等）
5. 封禁时间到期后自动解封

**高级配置要点**：
- 自定义过滤器，检测更多攻击模式
- 配置渐进式封禁（累犯加重处罚）
- 设置白名单IP
- 集成邮件通知
- 使用ipset提高性能（大量IP时）

```bash
# fail2ban高级配置

# ========== 主配置文件说明 ==========
# 注意：不要直接修改jail.conf，而是创建jail.local覆盖

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
# 忽略的IP（白名单）
ignoreip = 127.0.0.1/8 ::1 192.168.1.0/24 10.0.0.0/8 172.16.0.0/12

# 封禁时长（秒）- 默认1小时
bantime = 3600

# 检测时间窗口（秒）
findtime = 600

# 最大失败次数
maxretry = 5

# 后端日志监控方式
backend = systemd

# 动作
banaction = iptables-multiport

# 邮件通知配置
destemail = admin@example.com
sender = fail2ban@server.example.com
mta = sendmail

# ========== SSH防护 ==========
[sshd]
enabled = true
port = ssh,2222
filter = sshd
logpath = %(sshd_log)s
backend = %(sshd_backend)s
maxretry = 3
bantime = 86400
findtime = 600

# 启用邮件通知
# action = %(action_mwl)s

# ========== 渐进式封禁（累犯）==========
[sshd-recidive]
enabled = true
filter = recidive
logpath = /var/log/fail2ban.log
bantime = 604800  # 7天
findtime = 86400   # 1天内
maxretry = 3       # 3次被封则升级
banaction = iptables-allports

# ========== DDoS防护（需要大量连接）==========
[sshd-ddos]
enabled = true
port = ssh
filter = sshd-ddos
logpath = %(sshd_log)s
maxretry = 50
findtime = 10
bantime = 7200
EOF

systemctl restart fail2ban
```

```bash
# 自定义fail2ban过滤器

# ========== 增强的SSH过滤器 ==========
cat > /etc/fail2ban/filter.d/sshd-advanced.conf << 'EOF'
[Definition]

# 失败登录模式
failregex = ^%(__prefix_line)sFailed (?:password|publickey) for .* from <HOST>(?: port \d*)?(?: ssh\d*)?$
            ^%(__prefix_line)sROOT LOGIN REFUSED.* FROM <HOST>$
            ^%(__prefix_line)s[iI](?:llegal|nvalid) user .* from <HOST>$
            ^%(__prefix_line)sUser .+ from <HOST> not allowed because not listed in AllowUsers$
            ^%(__prefix_line)sUser .+ from <HOST> not allowed because listed in DenyUsers$
            ^%(__prefix_line)sUser .+ from <HOST> not allowed because not in any group$
            ^%(__prefix_line)srefused connect from \S+ \(<HOST>\)$
            ^%(__prefix_line)sReceived disconnect from <HOST>.*: \d+:.+ [Pp]eer.*[Uu]ser.*[Nn]ot [Ff]ound
            ^%(__prefix_line)sDisconnected from invalid user .* <HOST> .* [preauth]

# 忽略的模式
ignoreregex = 

[Init]
maxlines = 5
EOF

# 在jail.local中启用
cat >> /etc/fail2ban/jail.local << 'EOF'
[sshd-advanced]
enabled = true
port = ssh
filter = sshd-advanced
logpath = %(sshd_log)s
maxretry = 3
bantime = 86400
EOF

systemctl restart fail2ban
```

```bash
# fail2ban常用管理命令

# 查看状态
fail2ban-client status
fail2ban-client status sshd

# 查看被封禁的IP
fail2ban-client status sshd | grep "Banned IP list"
fail2ban-client banned

# 手动封禁IP
fail2ban-client set sshd banip 192.168.1.100

# 手动解封IP
fail2ban-client set sshd unbanip 192.168.1.100

# 解封所有IP
fail2ban-client unban --all

# 查看日志
tail -f /var/log/fail2ban.log

# 测试过滤器
fail2ban-regex /var/log/auth.log /etc/fail2ban/filter.d/sshd.conf

# 重载配置
fail2ban-client reload

# 查看统计
fail2ban-client stats
fail2ban-client stats sshd
```

### 6.22.2 端口敲门knockd原理与配置

端口敲门（Port Knocking）是一种通过特定顺序的连接请求来动态打开防火墙端口的安全技术。用户需要按照预设的顺序"敲门"（向一系列端口发送SYN包），防火墙才会打开SSH端口允许连接。

**端口敲门的原理**：
1. 防火墙默认关闭SSH端口，外部无法探测到
2. 用户使用客户端按特定顺序向不同端口发送连接请求
3. 敲门守护进程（knockd）监控网络流量，检测敲门序列
4. 序列正确则动态添加防火墙规则，开放用户IP的SSH访问
5. 一段时间后自动关闭端口

**端口敲门的优缺点**：
- 优点：隐藏服务端口、减少攻击面、简单的额外安全层
- 缺点：安全通过隐匿实现、可被嗅探、增加复杂度、配置不当可能锁死自己

```bash
# knockd安装与配置

# ========== 安装 ==========
# Debian/Ubuntu
apt-get install -y knockd

# CentOS/RHEL (需要EPEL)
yum install -y epel-release
yum install -y knockd

# ========== 配置knockd ==========
cat > /etc/knockd.conf << 'EOF'
[options]
    UseSyslog
    Interface = eth0
    LogLevel = info

# 开门序列
[openSSH]
    sequence    = 7000,8000,9000
    seq_timeout = 15
    command     = /sbin/iptables -I INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
    tcpflags    = syn

# 关门序列
[closeSSH]
    sequence    = 9000,8000,7000
    seq_timeout = 15
    command     = /sbin/iptables -D INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
    tcpflags    = syn

# 只允许一次敲门（可选，更安全）
[openSSHOnce]
    sequence    = 1111,2222,3333
    seq_timeout = 10
    command     = /sbin/iptables -I INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
    cmd_timeout = 30
    stop_command = /sbin/iptables -D INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
    tcpflags = syn
EOF

# ========== 启用knockd ==========
# Debian/Ubuntu
sed -i 's/START_KNOCKD=0/START_KNOCKD=1/' /etc/default/knockd
# 或编辑 /etc/default/knockd

systemctl enable knockd
systemctl start knockd

# ========== 防火墙配置 ==========
# 确保默认拒绝SSH，且knockd的规则能插入正确位置
# 先设置默认策略
iptables -P INPUT DROP
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
# 注意：不要在默认链中开放22端口，由knockd动态添加

# 保存iptables规则
iptables-save > /etc/iptables/rules.v4
```

```bash
# 端口敲门客户端使用

# ========== 使用knock客户端 ==========
# 安装客户端
apt-get install knockd   # 服务器端和客户端在同一个包

# 敲门打开SSH
knock -v server.example.com 7000 8000 9000

# 连接SSH
ssh user@server.example.com

# 使用完后敲门关闭
knock -v server.example.com 9000 8000 7000

# ========== 使用其他工具敲门 ==========
# 使用nmap
nmap -p 7000 --host_timeout 100 --max_retries 0 server.example.com
nmap -p 8000 --host_timeout 100 --max_retries 0 server.example.com
nmap -p 9000 --host_timeout 100 --max_retries 0 server.example.com

# 使用nc/netcat
nc -w 1 server.example.com 7000 < /dev/null
nc -w 1 server.example.com 8000 < /dev/null
nc -w 1 server.example.com 9000 < /dev/null

# 使用bash
for port in 7000 8000 9000; do
    timeout 1 bash -c "echo > /dev/tcp/server.example.com/$port" 2>/dev/null
done

# ========== SSH自动敲门脚本 ==========
cat > ~/ssh-knock.sh << 'EOF'
#!/bin/bash
SERVER=$1
PORT1=7000
PORT2=8000
PORT3=9000

echo "正在敲门..."
for port in $PORT1 $PORT2 $PORT3; do
    timeout 1 bash -c "echo > /dev/tcp/$SERVER/$port" 2>/dev/null
    sleep 0.2
done

echo "等待端口打开..."
sleep 1

echo "连接SSH..."
shift
ssh "$@" user@$SERVER
EOF
chmod +x ~/ssh-knock.sh

# 使用
# ~/ssh-knock.sh server.example.com
```

```bash
# 更安全的端口敲门方案

# ========== 使用复杂序列 ==========
# 更多端口、随机顺序、混合TCP/UDP
cat > /etc/knockd.conf << 'EOF'
[options]
    UseSyslog
    Interface = eth0

[openSSH]
    sequence    = 12345,23456,34567,45678,56789
    seq_timeout = 10
    command     = /sbin/iptables -I INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
    tcpflags    = syn
    cmd_timeout = 300
    stop_command = /sbin/iptables -D INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
EOF

# ========== 使用fwknop（更高级的方案）==========
# fwknop使用加密的SPA（Single Packet Authorization）数据包
# 比传统端口敲门更安全，因为数据包是加密的且只需要一个包

# 安装
apt-get install fwknop-server
yum install fwknop

# 生成密钥
fwknop -k --gen-keys

# 服务器配置
cat > /etc/fwknop/fwknopd.conf << 'EOF'
PCAP_INTF                   eth0;
PCAP_FILTER                 udp port 62201;
ENABLE_IPT_FORWARDING       N;
ENABLE_TCP_SERVER           N;
FWKNOP_RUN_DIR              /var/run/fwknop;
FWKNOP_PID_FILE             $FWKNOP_RUN_DIR/fwknopd.pid;
GPG_HOME_DIR                /root/.gnupg;
DISABLE_NAT                 Y;
IPT_INPUT_ACCESS            ACCEPT;
EOF

# 访问配置
cat > /etc/fwknop/access.conf << 'EOF'
SOURCE          ANY
KEY_BASE64      YourBase64KeyHere
HMAC_KEY_BASE64 YourHmacKeyHere
OPEN_PORTS      tcp/22
FW_ACCESS_TIMEOUT 300
EOF

systemctl start fwknop-server

# 客户端使用
fwknop -A tcp/22 -a -D server.example.com
ssh user@server.example.com
```

### 6.22.3 SSH蜜罐简介

SSH蜜罐（SSH Honeypot）是一种安全工具，它模拟真实的SSH服务，诱使攻击者进行攻击，从而记录攻击者的行为和方法。蜜罐可以帮助我们了解攻击手段、收集攻击样本、提前发现威胁。

**SSH蜜罐的类型**：
1. **低交互蜜罐**：只模拟基本的SSH登录界面，不提供真实shell，安全性高但收集信息有限
2. **高交互蜜罐**：提供完整的shell环境（通常在虚拟机或容器中），能收集更丰富的攻击数据，但风险更高
3. **中等交互蜜罐**：介于两者之间，提供有限的命令交互

**常用的SSH蜜罐工具**：
- Kippo / Cowrie：最流行的SSH蜜罐，基于Python
- dionaea：多功能蜜罐，支持多种协议
- glastopf：Web蜜罐，也支持SSH
- ssh-honeypot：轻量级SSH蜜罐

```bash
# Cowrie SSH蜜罐部署

# ========== 安装Cowrie ==========
# Cowrie是Kippo的维护分支，一个中等交互的SSH蜜罐

# 安装依赖
apt-get install -y git python3-virtualenv libssl-dev libffi-dev build-essential

# 创建专用用户
useradd -m -d /opt/cowrie -s /bin/bash cowrie

# 切换用户并安装
su - cowrie
git clone https://github.com/cowrie/cowrie
cd cowrie
virtualenv --python=python3 cowrie-env
source cowrie-env/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 复制配置文件
cp etc/cowrie.cfg.dist etc/cowrie.cfg

# ========== 配置Cowrie ==========
cat > ~/cowrie/etc/cowrie.cfg << 'EOF'
[honeypot]
# 监听的端口（建议使用非特权端口，然后用iptables转发）
listen_endpoints = tcp:2222:interface=0.0.0.0

# 模拟的服务器版本
version = SSH-2.0-OpenSSH_8.4p1 Debian-5+deb11u1

# 主机名
hostname = webserver01

# 传感器名称（用于日志标识）
sensor_name = cowrie-webserver01

# 输出目录
log_path = log/
download_path = dl/
data_path = data/

# 文件系统布局
filesystem_file = data/fs.pickle

# 交互设置
interactive = true

# 最大会话时间（秒）
max_tries = 5
auth_timeout = 120

[output_jsonlog]
enabled = true
logfile = log/cowrie.json

[output_textlog]
enabled = true
logfile = log/cowrie.log
EOF

# ========== 启动Cowrie ==========
# 切换到cowrie用户
su - cowrie
cd cowrie
source cowrie-env/bin/activate
bin/cowrie start

# 查看状态
bin/cowrie status

# 查看日志
tail -f log/cowrie.log
```

```bash
# 蜜罐网络配置

# ========== 端口重定向 ==========
# 将22端口的流量转发到蜜罐的2222端口
# 注意：真实的SSH要先改到其他端口（如22222）

# 重定向规则
iptables -t nat -A PREROUTING -p tcp --dport 22 -j REDIRECT --to-port 2222

# 允许本地访问真实SSH
iptables -t nat -A PREROUTING -i lo -p tcp --dport 22 -j ACCEPT

# 或者只允许特定IP访问真实SSH
# iptables -t nat -A PREROUTING -s 192.168.1.100 -p tcp --dport 22 -j REDIRECT --to-port 22222
# iptables -t nat -A PREROUTING -p tcp --dport 22 -j REDIRECT --to-port 2222

# ========== 使用fail2ban保护蜜罐 ==========
# 防止蜜罐被用于攻击其他机器

# ========== 分析蜜罐日志 ==========
# 查看连接的IP
grep "New connection:" /opt/cowrie/cowrie/log/cowrie.log | awk '{print $6}' | sort | uniq -c | sort -rn | head -20

# 查看尝试的用户名密码
grep "login attempt" /opt/cowrie/cowrie/log/cowrie.log | awk -F'[' '{print $4}' | sort | uniq -c | sort -rn | head -20

# 查看攻击者执行的命令
grep "Command found:" /opt/cowrie/cowrie/log/cowrie.log | head -50

# 查看下载的恶意文件
ls -la /opt/cowrie/cowrie/dl/

# 使用jq分析JSON日志
apt-get install jq
cat /opt/cowrie/cowrie/log/cowrie.json | jq -r '. | select(.eventid=="cowrie.login") | "\(.username)/\(.password)"' | sort | uniq -c | sort -rn | head -20
```

---

## 6.23 sshd_config完整安全配置示例

### 6.23.1 生产级完整配置文件

以下是一个生产环境级别的完整sshd_config安全配置，包含详细的中文注释。这份配置综合了本章介绍的各种安全最佳实践。

```bash
# /etc/ssh/sshd_config
# SSH服务器安全配置 - 生产环境版
# 适用系统：Debian 11+ / Ubuntu 20.04+ / CentOS 8+
# 最后更新：2026-06-25

# ============================================================
# 1. 基础网络配置
# ============================================================

# 监听端口（修改默认22端口，减少自动化扫描）
Port 2222

# 监听地址（建议绑定到特定网卡，不要监听0.0.0.0）
# ListenAddress 192.168.1.100
# ListenAddress 10.0.0.1
# 同时监听IPv4和IPv6
ListenAddress 0.0.0.0
ListenAddress ::

# SSH协议版本（必须使用2，v1已不安全）
Protocol 2

# ============================================================
# 2. 主机密钥配置
# ============================================================

# 主机密钥文件（按优先级排序，优先使用Ed25519）
HostKey /etc/ssh/ssh_host_ed25519_key
HostKey /etc/ssh/ssh_host_rsa_key
# ECDSA可选，根据安全策略决定
# HostKey /etc/ssh/ssh_host_ecdsa_key

# 密钥重新生成限制（传输一定数据后重新协商密钥）
RekeyLimit 1G 1h

# ============================================================
# 3. 加密算法配置
# ============================================================

# 对称加密算法（优先使用AEAD算法）
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr

# 消息认证码算法（优先使用ETM模式）
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,hmac-sha2-512,hmac-sha2-256

# 密钥交换算法
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512

# 主机密钥算法
HostKeyAlgorithms ssh-ed25519,rsa-sha2-512,rsa-sha2-256

# 允许的公钥类型
PubkeyAcceptedAlgorithms ssh-ed25519,rsa-sha2-512,rsa-sha2-256

# ============================================================
# 4. 日志与审计
# ============================================================

# 日志设施
SyslogFacility AUTHPRIV

# 日志级别（VERBOSE记录公钥指纹，便于审计）
LogLevel VERBOSE

# ============================================================
# 5. 认证配置
# ============================================================

# 登录宽限期（用户必须在此时间内完成认证，否则断开）
LoginGraceTime 60

# 最大认证尝试次数
MaxAuthTries 3

# 最大会话数
MaxSessions 10

# 最大未认证连接数（防止DoS）
# 格式：start:rate:full
# 当达到start个连接时，开始以rate的概率拒绝
# 达到full个连接时，全部拒绝
MaxStartups 10:30:50

# 禁止root登录（建议设置为no，使用普通用户+sudo）
PermitRootLogin no

# 严格模式（检查用户目录和配置文件权限）
StrictModes yes

# 允许空密码（必须禁用）
PermitEmptyPasswords no

# ============================================================
# 6. 公钥认证
# ============================================================

# 启用公钥认证
PubkeyAuthentication yes

# 授权密钥文件路径
AuthorizedKeysFile .ssh/authorized_keys

# 证书认证（可选，使用CA证书时配置）
# TrustedUserCAKeys /etc/ssh/trusted-ca.pub
# RevokedKeys /etc/ssh/revoked_keys.krl
# AuthorizedPrincipalsFile /etc/ssh/auth_principals/%u

# ============================================================
# 7. 密码认证
# ============================================================

# 禁用密码认证（推荐使用公钥认证）
PasswordAuthentication no

# 挑战响应认证（用于2FA，如Google Authenticator）
# 若不使用2FA则设为no
ChallengeResponseAuthentication yes

# 键盘交互认证（PAM使用）
KbdInteractiveAuthentication yes

# 认证方法（按需配置）
# 仅公钥
# AuthenticationMethods publickey

# 公钥 + 2FA（最安全）
AuthenticationMethods publickey,keyboard-interactive

# ============================================================
# 8. PAM与访问控制
# ============================================================

# 启用PAM
UsePAM yes

# 允许的用户（白名单，优先于AllowGroups）
AllowUsers admin deploy ci-cd

# 允许的组（白名单）
# AllowGroups sudo developers

# 拒绝的用户（黑名单）
DenyUsers guest test nobody

# 拒绝的组（黑名单）
# DenyGroups suspicious

# 忽略.rhosts文件
IgnoreRhosts yes

# 主机认证（.rhosts和shosts）
HostbasedAuthentication no

# 忽略用户known_hosts中的主机认证
IgnoreUserKnownHosts no

# ============================================================
# 9. 转发与隧道
# ============================================================

# 允许TCP转发（根据需要设置，堡垒机可能需要）
AllowTcpForwarding no

# 允许Agent转发（通常禁止，除非跳板机有特殊需求）
AllowAgentForwarding no

# 允许X11转发（通常禁止）
X11Forwarding no
X11DisplayOffset 10
X11UseLocalhost yes

# 网关端口（远程转发是否监听所有接口，必须禁止）
GatewayPorts no

# 允许隧道设备（通常禁止）
PermitTunnel no

# 完全禁用所有转发（高安全环境）
# DisableForwarding yes

# ============================================================
# 10. 会话保活与超时
# ============================================================

# 客户端存活检测间隔（秒）
ClientAliveInterval 300

# 客户端存活检测最大次数（2次无响应则断开）
ClientAliveCountMax 2

# TCP保活（检测死连接）
TCPKeepAlive yes

# ============================================================
# 11. 子系统与命令
# ============================================================

# SFTP子系统（使用内部实现，支持chroot）
Subsystem sftp internal-sftp

# 强制命令（可选，匹配特定用户时使用）
# ForceCommand internal-sftp

# 允许的环境变量
AcceptEnv LANG LC_*

# ============================================================
# 12. 其他设置
# ============================================================

# 显示MOTD
PrintMotd no

# 显示上次登录信息
PrintLastLog yes

# 登录横幅
Banner /etc/ssh/banner

# 用户PID文件
PidFile /run/sshd.pid

# 最大启动的并发进程数
MaxStartups 10:30:50

# 权限分离
UsePrivilegeSeparation sandbox

# 压缩（仅认证后，节省带宽但增加CPU开销）
Compression delayed

# ============================================================
# 13. Match块（特定用户/组/地址的特殊配置）
# ============================================================

# 管理员组允许转发
Match Group admin
    AllowTcpForwarding yes
    AllowAgentForwarding no
    X11Forwarding no

# SFTP用户组 - chroot配置
Match Group sftpusers
    ChrootDirectory /srv/sftp/%u
    ForceCommand internal-sftp
    AllowTcpForwarding no
    X11Forwarding no
    PasswordAuthentication yes

# 从本地网络登录允许密码（过渡期使用）
# Match Address 192.168.1.0/24
#     PasswordAuthentication yes
#     MaxAuthTries 5

# 包含其他配置文件（如果有）
Include /etc/ssh/sshd_config.d/*.conf
```

### 6.23.2 配置验证与测试

```bash
# 配置文件验证

# 检查配置文件语法
sshd -t

# 详细检查并显示有效配置
sshd -T

# 检查特定端口/地址的配置
sshd -t -f /etc/ssh/sshd_config

# 查看所有生效的配置项
sshd -T | sort

# 查看特定配置项
sshd -T | grep -i permitrootlogin
sshd -T | grep -i ciphers
sshd -T | grep -i passwordauthentication

# 配置修改后平滑重启（不中断现有连接）
systemctl reload sshd
# 或
kill -HUP $(cat /run/sshd.pid)

# 配置修改后完全重启（会断开所有连接，谨慎操作）
systemctl restart sshd
```

```bash
# 安全测试工具

# 使用ssh-audit工具进行安全评估
# 安装
pip install ssh-audit
# 或
apt-get install ssh-audit

# 运行审计
ssh-audit localhost:2222
ssh-audit -p 2222 user@server.example.com

# 只显示警告和错误
ssh-audit -l warn localhost:2222

# 生成JSON报告
ssh-audit -j localhost:2222 > ssh-audit-report.json

# 使用nmap脚本测试
nmap --script ssh2-enum-algos -p 2222 localhost
nmap --script ssh-hostkey -p 2222 localhost
nmap --script ssh-auth-methods -p 2222 localhost

# 测试暴力破解防护
# hydra -l testuser -P /usr/share/wordlists/rockyou.txt -t 4 ssh://localhost:2222
# 注意：只在自己的服务器上测试！
```

---

## 6.24 SSH客户端安全配置

### 6.24.1 ~/.ssh/config安全配置

SSH客户端配置文件`~/.ssh/config`不仅可以提高便利性，还能增强安全性。通过合理配置，可以限制代理转发、强制密钥验证、指定安全算法等。

**客户端安全配置要点**：
- 禁用不必要的转发（Agent转发、X11转发、端口转发）
- 启用严格的主机密钥检查
- 为不同主机使用不同的密钥
- 限制认证尝试次数
- 配置合理的超时
- 使用强加密算法

```bash
# ~/.ssh/config 安全配置示例

# ============================================================
# 全局默认配置（对所有主机生效）
# ============================================================
Host *
    # 安全基本设置
    Protocol 2
    Port 22
    
    # 认证设置
    # 优先使用公钥认证
    PubkeyAuthentication yes
    PasswordAuthentication no
    ChallengeResponseAuthentication no
    KbdInteractiveAuthentication no
    
    # 最大密码提示次数
    NumberOfPasswordPrompts 2
    
    # 只使用指定的身份文件，防止密钥泄露
    # （当有很多密钥时，避免服务器记录过多失败尝试）
    IdentitiesOnly yes
    
    # 主机密钥验证
    # 首次连接时询问（默认）
    StrictHostKeyChecking ask
    # 严格模式：known_hosts中没有的主机直接拒绝
    # StrictHostKeyChecking yes
    # 接受新主机但不自动添加（建议）
    # StrictHostKeyChecking accept-new
    
    # known_hosts文件
    UserKnownHostsFile ~/.ssh/known_hosts
    
    # 转发控制（默认全部禁用）
    ForwardAgent no
    ForwardX11 no
    ForwardX11Trusted no
    AllowTcpForwarding no
    GatewayPorts no
    PermitLocalCommand no
    
    # 连接设置
    ConnectTimeout 10
    ConnectionAttempts 1
    ServerAliveInterval 300
    ServerAliveCountMax 2
    TCPKeepAlive yes
    
    # 加密算法（客户端偏好）
    Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr
    MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,hmac-sha2-512,hmac-sha2-256
    KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org
    HostKeyAlgorithms ssh-ed25519,rsa-sha2-512,rsa-sha2-256
    
    # 压缩
    Compression no
    
    # 日志级别
    LogLevel INFO

# ============================================================
# 个人服务器配置
# ============================================================
Host myserver
    HostName 192.168.1.100
    User admin
    Port 22
    IdentityFile ~/.ssh/personal_ed25519
    IdentitiesOnly yes

# ============================================================
# 工作环境配置
# ============================================================
Host work-*
    HostName %h.company.com
    User employee
    Port 2222
    IdentityFile ~/.ssh/work_ed25519
    IdentitiesOnly yes
    ForwardAgent no
    Compression yes

# ============================================================
# 跳板机配置
# ============================================================
Host bastion
    HostName bastion.company.com
    User admin
    Port 2222
    IdentityFile ~/.ssh/bastion_ed25519
    IdentitiesOnly yes
    # 跳板机上可以启用agent转发（但要谨慎）
    ForwardAgent yes
    # 连接保持
    ServerAliveInterval 60
    ServerAliveCountMax 10
    Compression yes

# 通过跳板机访问的内部服务器
Host internal-*
    HostName %h.internal.company.com
    User deploy
    IdentityFile ~/.ssh/internal_ed25519
    IdentitiesOnly yes
    ProxyJump bastion
    ForwardAgent no

# ============================================================
# GitHub/GitLab等代码托管平台
# ============================================================
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_ed25519
    IdentitiesOnly yes
    ForwardAgent no
    StrictHostKeyChecking yes

Host gitlab.com
    HostName gitlab.com
    User git
    IdentityFile ~/.ssh/gitlab_ed25519
    IdentitiesOnly yes
    ForwardAgent no

# ============================================================
# 本地虚拟机
# ============================================================
Host vm-*
    HostName 192.168.122.%h
    User vagrant
    Port 22
    IdentityFile ~/.ssh/vagrant_key
    IdentitiesOnly yes
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
    PasswordAuthentication no
```

### 6.24.2 known_hosts管理

known_hosts文件记录了用户连接过的SSH服务器的主机密钥指纹，用于验证服务器身份，防止中间人攻击。正确管理known_hosts是SSH客户端安全的重要部分。

**known_hosts的工作方式**：
1. 首次连接服务器时，SSH会显示服务器指纹，用户确认后添加到known_hosts
2. 后续连接时，SSH会比对当前服务器的指纹与known_hosts中的记录
3. 如果不匹配，SSH会发出警告并拒绝连接（防止中间人攻击）

**安全风险**：
- TOFU（Trust On First Use）问题：首次连接时无法验证指纹真伪
- 主机密钥泄露或更换后需要手动更新
- known_hosts文件本身可能泄露用户连接过的服务器列表

```bash
# known_hosts管理

# ========== 查看known_hosts ==========
cat ~/.ssh/known_hosts

# 查看条目数量
wc -l ~/.ssh/known_hosts

# ========== 手动添加主机密钥 ==========
# 获取主机公钥
ssh-keyscan -H server.example.com >> ~/.ssh/known_hosts

# 获取特定类型的密钥
ssh-keyscan -t ed25519 server.example.com

# 获取所有类型
ssh-keyscan -t ed25519,rsa,ecdsa server.example.com

# -H 参数表示哈希化主机名（推荐，保护隐私）

# ========== 验证主机指纹 ==========
# 查看当前known_hosts中的指纹
ssh-keygen -F server.example.com
ssh-keygen -F server.example.com -l  # 显示指纹

# 检查服务器当前的指纹
ssh-keyscan server.example.com | ssh-keygen -lf -

# 对比两个指纹是否一致

# ========== 删除主机条目 ==========
# 删除指定主机
ssh-keygen -R server.example.com
ssh-keygen -R 192.168.1.100

# ========== 哈希化known_hosts ==========
# 将所有主机名和地址哈希化（保护隐私）
ssh-keygen -H -f ~/.ssh/known_hosts

# 哈希化后，无法直接看出是哪台主机
# 但SSH仍然能正常匹配

# ========== 证书认证时的known_hosts ==========
# 使用CA证书时，添加CA公钥（@cert-authority）
echo "@cert-authority *.example.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5..." >> ~/.ssh/known_hosts

# 这样所有example.com的主机都会被自动信任
# 前提是它们的主机证书由该CA签发

# ========== 系统级known_hosts ==========
# 全局known_hosts文件
cat /etc/ssh/ssh_known_hosts

# 管理员可以预配置可信主机
ssh-keyscan -H server1.example.com server2.example.com >> /etc/ssh/ssh_known_hosts
```

```bash
# known_hosts安全最佳实践

# 1. 验证首次连接的指纹
# 通过安全渠道（如电话、内部文档）确认指纹
ssh -o FingerprintHash=sha256 server.example.com
# 或
ssh-keygen -l -f /etc/ssh/ssh_host_ed25519_key.pub  # 在服务器上运行

# 2. 定期清理known_hosts
# 移除不再使用的主机条目
ssh-keygen -R old-server.example.com

# 3. 针对不同环境使用不同的known_hosts
# 在~/.ssh/config中配置
Host prod-*
    UserKnownHostsFile ~/.ssh/known_hosts_prod
    StrictHostKeyChecking yes

Host dev-*
    UserKnownHostsFile ~/.ssh/known_hosts_dev
    StrictHostKeyChecking accept-new

# 4. 禁用主机IP/主机名泄露
# 使用HashKnownHosts yes
cat >> ~/.ssh/config << 'EOF'
Host *
    HashKnownHosts yes
EOF

# 5. 备份known_hosts
cp ~/.ssh/known_hosts ~/.ssh/known_hosts.backup
```

### 6.24.3 ssh_config系统级硬化

除了用户级的`~/.ssh/config`，还有系统级的SSH客户端配置文件`/etc/ssh/ssh_config`，它对所有用户生效。管理员可以通过系统级配置强制所有用户遵循安全策略。

```bash
# /etc/ssh/ssh_config - 系统级客户端安全配置
# 对所有用户的SSH客户端生效

# 全局默认配置
Host *
    # 协议版本
    Protocol 2
    
    # 默认端口
    Port 22
    
    # 认证顺序
    PreferredAuthentications publickey,keyboard-interactive,password
    
    # 主机密钥检查
    # 使用accept-new：接受新主机但不接受已存在主机的密钥变更
    StrictHostKeyChecking accept-new
    
    # 哈希化known_hosts
    HashKnownHosts yes
    
    # 禁用agent转发（默认）
    ForwardAgent no
    
    # 禁用X11转发
    ForwardX11 no
    ForwardX11Trusted no
    
    # 禁用TCP转发（默认）
    AllowTcpForwarding no
    
    # 禁用本地命令执行
    PermitLocalCommand no
    
    # 连接超时
    ConnectTimeout 30
    ConnectionAttempts 1
    
    # 保活设置
    ServerAliveInterval 300
    ServerAliveCountMax 2
    
    # 加密算法
    Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr
    MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,hmac-sha2-512,hmac-sha2-256
    KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512
    HostKeyAlgorithms ssh-ed25519,rsa-sha2-512,rsa-sha2-256
    
    # 系统级known_hosts
    GlobalKnownHostsFile /etc/ssh/ssh_known_hosts /etc/ssh/ssh_known_hosts2
    
    # 禁用环境变量传递
    SendEnv LANG LC_*
    # 或完全禁用
    # SendEnv none
    
    # 压缩
    Compression no
    
    # 日志
    LogLevel INFO

# 内部网络主机可放宽限制
Host *.internal.example.com 10.* 192.168.*
    StrictHostKeyChecking accept-new
    PasswordAuthentication yes
    ConnectTimeout 10

# 包含其他配置文件
Include /etc/ssh/ssh_config.d/*.conf
```

```bash
# 客户端安全验证

# 测试客户端配置
ssh -G server.example.com | head -50

# 查看特定配置项
ssh -G server.example.com | grep -i forwardagent
ssh -G server.example.com | grep -i ciphers
ssh -G server.example.com | grep -i stricthostkey

# 测试连接的详细过程
ssh -v user@server
# 更详细
ssh -vv user@server
# 最详细
ssh -vvv user@server

# 测试认证方法
ssh -o PreferredAuthentications=publickey -o ConnectTimeout=5 user@server
ssh -o PreferredAuthentications=password -o ConnectTimeout=5 user@server

# SSH密钥权限检查脚本
cat > /usr/local/bin/ssh-perm-check.sh << 'EOF'
#!/bin/bash
echo "检查SSH密钥权限..."

# 检查.ssh目录
if [ -d ~/.ssh ]; then
    PERM=$(stat -c "%a" ~/.ssh)
    if [ "$PERM" != "700" ]; then
        echo "警告: ~/.ssh 权限是 $PERM，应为 700"
    else
        echo "OK: ~/.ssh 权限正确"
    fi
fi

# 检查私钥文件
for key in ~/.ssh/id_* ~/.ssh/*_key; do
    if [ -f "$key" ] && [[ ! "$key" =~ \.pub$ ]]; then
        PERM=$(stat -c "%a" "$key")
        if [ "$PERM" != "600" ]; then
            echo "警告: $key 权限是 $PERM，应为 600"
        else
            echo "OK: $key 权限正确"
        fi
    fi
done

# 检查authorized_keys
if [ -f ~/.ssh/authorized_keys ]; then
    PERM=$(stat -c "%a" ~/.ssh/authorized_keys)
    if [ "$PERM" != "600" ]; then
        echo "警告: authorized_keys 权限是 $PERM，应为 600"
    else
        echo "OK: authorized_keys 权限正确"
    fi
fi

echo "检查完成。"
EOF
chmod +x /usr/local/bin/ssh-perm-check.sh
```

---

## 6.25 完整实战案例：SSH暴力破解攻击应急响应

### 6.25.1 案例背景

**事件描述**：
某公司运维人员在周一早上发现一台公网Web服务器（203.0.113.45）SSH登录异常缓慢，检查日志后发现大量失败的登录尝试，确认正在遭受SSH暴力破解攻击。

**服务器信息**：
- 操作系统：Ubuntu 22.04 LTS
- SSH端口：默认22端口
- 认证方式：密码认证（尚未配置密钥）
- 防火墙：仅开放了80、443、22端口
- fail2ban：未安装

**安全团队接到报告后，立即启动应急响应流程。**

### 6.25.2 应急响应第一步：发现与评估

```bash
# ========== 1. 确认攻击状态 ==========

# 登录服务器（如果还能登进去）
# 如果22端口被打爆，可以通过控制台登录

# 查看实时登录失败
tail -f /var/log/auth.log | grep "Failed password"

# 统计攻击规模
# 总失败次数
grep "Failed password" /var/log/auth.log | wc -l

# 攻击来源IP Top 20
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head -20

# 被尝试的用户名 Top 20
grep "Failed password" /var/log/auth.log | \
    sed 's/.*Failed password for //' | sed 's/ from .*//' | \
    sort | uniq -c | sort -rn | head -20

# 攻击开始时间
grep "Failed password" /var/log/auth.log | head -1

# 攻击时间分布（按小时统计）
grep "Failed password" /var/log/auth.log | awk '{print $1, $2, substr($3,1,2)}' | sort | uniq -c

# ========== 2. 检查是否有成功入侵 ==========

# 查看成功登录记录
grep "Accepted" /var/log/auth.log

# 查看最近成功登录
last -a -20

# 检查当前在线用户
w
who

# 查看异常进程
ps auxf

# 检查rootkit/后门
# 检查常见后门端口
netstat -tulpn
ss -tulpn

# 检查计划任务
crontab -l
ls -la /etc/cron.*
ls -la /var/spool/cron/crontabs/

# 检查异常用户
cat /etc/passwd
awk -F: '$3==0 {print $1}' /etc/passwd  # 检查UID为0的用户

# 检查最近修改的敏感文件
find /etc -mtime -1 -type f 2>/dev/null | head -20
find /root -mtime -1 -type f 2>/dev/null
```

### 6.25.3 应急响应第二步：紧急遏制

```bash
# ========== 1. 立即封禁攻击IP ==========

# 方法A：快速封禁Top攻击IP（手动）
# 获取失败次数超过100的IP并封禁
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | \
    awk '$1 > 100 {print $2}' | while read ip; do
    echo "封禁IP: $ip"
    iptables -I INPUT -s "$ip" -j DROP
done

# 方法B：按网段封禁（攻击来自特定网段时）
# 提取/24网段，失败超过500次则封禁整个网段
grep "Failed password" /var/log/auth.log | awk '{print $11}' | \
    cut -d. -f1-3 | sort | uniq -c | sort -rn | awk '$1 > 500 {print $2".0/24"}' | \
    while read subnet; do
    echo "封禁网段: $subnet"
    iptables -I INPUT -s "$subnet" -j DROP
done

# 查看已封禁的IP
iptables -L INPUT -n -v | head -30

# ========== 2. 临时强化SSH配置 ==========

# 备份当前配置
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d-%H%M%S)

# 修改配置加强限制
cat > /etc/ssh/sshd_config.d/emergency.conf << 'EOF'
# 紧急加固配置
MaxAuthTries 2
LoginGraceTime 30
MaxStartups 5:50:10
PermitRootLogin no
# 临时限制只允许特定IP登录（如果有固定管理IP）
# AllowUsers admin@192.168.1.0/24
EOF

# 重载配置（不中断现有连接）
systemctl reload sshd

# ========== 3. 安装并配置fail2ban ==========
apt-get update
apt-get install -y fail2ban

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
ignoreip = 127.0.0.1/8 ::1
bantime = 86400
findtime = 600
maxretry = 3
backend = systemd

[sshd]
enabled = true
port = ssh
filter = sshd
maxretry = 3
bantime = 604800
findtime = 600
EOF

systemctl enable fail2ban
systemctl start fail2ban

# 验证
fail2ban-client status sshd
```

### 6.25.4 应急响应第三步：根除与恢复

```bash
# ========== 1. 部署密钥认证 ==========

# 在本地生成密钥（管理员在自己电脑上操作）
ssh-keygen -t ed25519 -a 100 -f ~/.ssh/server_admin_ed25519 -C "admin@company.com"

# 将公钥传输到服务器（通过当前SSH会话或控制台）
# 在服务器上操作
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 添加公钥到authorized_keys
cat >> ~/.ssh/authorized_keys << 'EOF'
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... admin@company.com
EOF

chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/*

# 测试密钥登录（保持当前会话不要断开，开新窗口测试）
# ssh -i ~/.ssh/server_admin_ed25519 admin@server

# 确认密钥登录成功后，禁用密码认证
cat >> /etc/ssh/sshd_config.d/security.conf << 'EOF'
# 禁用密码认证
PasswordAuthentication no
ChallengeResponseAuthentication no
KbdInteractiveAuthentication no
# 启用公钥认证
PubkeyAuthentication yes
EOF

systemctl reload sshd

# ========== 2. 修改SSH端口 ==========
# 修改SSH端口为非标准端口
cat >> /etc/ssh/sshd_config.d/security.conf << 'EOF'
Port 22222
EOF

# firewall放行新端口
ufw allow 22222/tcp
# 或 iptables
iptables -I INPUT -p tcp --dport 22222 -j ACCEPT

# 重启SSH（注意：会断开当前连接）
systemctl restart sshd

# 测试新端口连接
# ssh -p 22222 -i ~/.ssh/server_admin_ed25519 admin@server

# 确认新端口可用后，关闭旧端口
ufw delete allow 22/tcp
# 或 iptables -D INPUT -p tcp --dport 22 -j ACCEPT

# ========== 3. 配置双因素认证 ==========
apt-get install -y libpam-google-authenticator

# 为管理员配置2FA
su - admin
google-authenticator -t -d -f -r 3 -R 30 -w 3
exit

# 配置PAM
cat > /etc/pam.d/sshd << 'EOF'
# Google Authenticator
auth required pam_google_authenticator.so nullok

# Standard Un*x account and session
@include common-account
@include common-session
@include common-password
EOF

# 配置SSH
cat >> /etc/ssh/sshd_config.d/2fa.conf << 'EOF'
ChallengeResponseAuthentication yes
UsePAM yes
AuthenticationMethods publickey,keyboard-interactive
EOF

systemctl reload sshd
```

### 6.25.5 应急响应第四步：加固与预防

```bash
# ========== 1. 全面安全加固 ==========

# 更新系统
apt-get update && apt-get upgrade -y

# 安装必要的安全工具
apt-get install -y auditd rkhunter chkrootkit

# 配置auditd监控SSH
cat > /etc/audit/rules.d/ssh.rules << 'EOF'
-w /etc/ssh/ -p wa -k ssh_config
-w /var/log/auth.log -p wa -k auth_log
-w /etc/passwd -p wa -k user_changes
-w /etc/shadow -p wa -k shadow_changes
EOF

systemctl restart auditd

# 配置日志轮转
cat > /etc/logrotate.d/ssh-audit << 'EOF'
/var/log/auth.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
}
EOF

# ========== 2. 防火墙强化 ==========
# 使用ufw配置防火墙
ufw default deny incoming
ufw default allow outgoing
ufw allow 22222/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# 限制SSH连接速率（防止暴力破解）
iptables -A INPUT -p tcp --dport 22222 -m state --state NEW -m recent --set
iptables -A INPUT -p tcp --dport 22222 -m state --state NEW -m recent --update --seconds 60 --hitcount 10 -j DROP

# ========== 3. 配置集中日志 ==========
# 将日志发送到集中日志服务器
# /etc/rsyslog.d/remote.conf
# *.* @@logserver.example.com:514

# ========== 4. 用户管理加固 ==========
# 检查所有用户
awk -F: '$7 ~ /bash|sh/ {print $1}' /etc/passwd

# 禁用不需要的用户
# usermod -s /usr/sbin/nologin username

# 配置密码策略（如果还使用密码的话）
# /etc/security/pwquality.conf
# minlen = 12
# dcredit = -1
# ucredit = -1
# ocredit = -1
# lcredit = -1

# ========== 5. 定期安全检查脚本 ==========
cat > /usr/local/bin/weekly-security-check.sh << 'EOF'
#!/bin/bash
REPORT="/var/log/security-report-$(date +%Y%m%d).txt"

echo "=== 每周安全检查报告 - $(date) ===" > "$REPORT"
echo "" >> "$REPORT"

echo "1. SSH失败登录Top10 IP:" >> "$REPORT"
grep "Failed password" /var/log/auth.log | awk '{print $11}' | \
    sort | uniq -c | sort -rn | head -10 >> "$REPORT"
echo "" >> "$REPORT"

echo "2. 成功登录记录:" >> "$REPORT"
last -a -20 >> "$REPORT"
echo "" >> "$REPORT"

echo "3. Fail2ban状态:" >> "$REPORT"
fail2ban-client status sshd >> "$REPORT"
echo "" >> "$REPORT"

echo "4. 系统更新状态:" >> "$REPORT"
apt list --upgradable 2>/dev/null | wc -l >> "$REPORT"
echo "" >> "$REPORT"

# 发送邮件（需配置邮件服务）
# mail -s "每周安全报告" admin@example.com < "$REPORT"
EOF
chmod +x /usr/local/bin/weekly-security-check.sh

# 添加到crontab
(crontab -l 2>/dev/null; echo "0 3 * * 0 /usr/local/bin/weekly-security-check.sh") | crontab -
```

### 6.25.6 应急响应第五步：总结与改进

**事件总结报告**：

1. **事件概况**
   - 事件类型：SSH暴力破解攻击
   - 受影响服务器：Web服务器（203.0.113.45）
   - 攻击持续时间：约36小时
   - 总失败尝试：约45,000次
   - 攻击来源：主要来自3个IP段

2. **入侵评估**
   - 是否成功入侵：否（未发现成功登录记录）
   - 数据泄露：无
   - 系统损坏：无
   - 业务影响：SSH登录变慢，无业务中断

3. **根本原因**
   - SSH使用默认22端口
   - 使用密码认证，未启用密钥认证
   - 未安装fail2ban等防护工具
   - 防火墙规则过于宽松

4. **改进措施**
   - 短期：修改SSH端口、部署密钥认证、安装fail2ban
   - 中期：配置双因素认证、跳板机访问、集中日志
   - 长期：建立安全基线、定期安全审计、安全意识培训

---

## 6.26 SSH安全加固检查清单

### 6.26.1 基础安全检查清单

| 检查项 | 要求 | 状态 | 备注 |
|--------|------|------|------|
| **协议与版本** | | | |
| SSH协议版本 | 仅使用SSHv2 | ☐ | Protocol 2 |
| OpenSSH版本 | 最新稳定版 | ☐ | 定期更新 |
| **端口与网络** | | | |
| SSH端口 | 修改默认22端口 | ☐ | 建议使用1024以上端口 |
| 监听地址 | 绑定指定网卡 | ☐ | 不监听0.0.0.0 |
| 防火墙限制 | 限制来源IP | ☐ | 只允许可信网络访问 |
| **认证安全** | | | |
| root登录 | 禁用 | ☐ | PermitRootLogin no |
| 密码认证 | 禁用 | ☐ | 使用密钥认证 |
| 公钥认证 | 启用 | ☐ | PubkeyAuthentication yes |
| 空密码 | 禁用 | ☐ | PermitEmptyPasswords no |
| 最大尝试次数 | ≤5次 | ☐ | MaxAuthTries 3 |
| 登录宽限期 | ≤60秒 | ☐ | LoginGraceTime 60 |
| 双因素认证 | 重要系统启用 | ☐ | Google Authenticator等 |
| **访问控制** | | | |
| AllowUsers/AllowGroups | 配置白名单 | ☐ | 只允许必要用户 |
| DenyUsers/DenyGroups | 配置黑名单 | ☐ | 禁止已知危险用户 |
| 用户最小权限 | 按需授权 | ☐ | 不滥用root |
| **加密算法** | | | |
| Ciphers | 仅安全算法 | ☐ | 禁用弱算法 |
| MACs | 仅安全算法 | ☐ | 优先ETM模式 |
| KexAlgorithms | 仅安全算法 | ☐ | 优先curve25519 |
| 主机密钥 | Ed25519优先 | ☐ | 禁用DSA |
| **转发与隧道** | | | |
| Agent转发 | 禁用 | ☐ | 除非必要 |
| X11转发 | 禁用 | ☐ | X11Forwarding no |
| TCP转发 | 按需启用 | ☐ | 默认禁用 |
| 网关端口 | 禁用 | ☐ | GatewayPorts no |
| **会话安全** | | | |
| 空闲超时 | 启用 | ☐ | ClientAliveInterval 300 |
| 存活检测次数 | 2-3次 | ☐ | ClientAliveCountMax 2 |
| 最大会话数 | 限制 | ☐ | MaxSessions 10 |
| **日志与审计** | | | |
| 日志级别 | VERBOSE | ☐ | 便于审计 |
| 日志轮转 | 配置 | ☐ | 保留至少90天 |
| 会话录制 | 重要系统启用 | ☐ | script或tlog |
| 定期审计 | 执行 | ☐ | 每周/每月 |
| **防护工具** | | | |
| fail2ban | 安装配置 | ☐ | 自动封禁攻击IP |
| 端口敲门 | 可选 | ☐ | 隐藏SSH端口 |
| 入侵检测 | 可选 | ☐ | aide/rkhunter |

### 6.26.2 快速检查脚本

```bash
#!/bin/bash
# SSH安全加固检查脚本 - 快速版

echo "=========================================="
echo "    SSH安全加固检查清单"
echo "    检查时间: $(date)"
echo "=========================================="
echo ""

PASS=0
FAIL=0
WARN=0
TOTAL=0

check() {
    local desc="$1"
    local result="$2"
    local severity="${3:-warn}"
    TOTAL=$((TOTAL + 1))
    
    if [ "$result" = "pass" ]; then
        echo "  [✓] PASS: $desc"
        PASS=$((PASS + 1))
    elif [ "$result" = "fail" ]; then
        echo "  [✗] FAIL: $desc"
        FAIL=$((FAIL + 1))
    else
        echo "  [!] WARN: $desc"
        WARN=$((WARN + 1))
    fi
}

SSHD_CONFIG="/etc/ssh/sshd_config"

echo "1. 基础安全配置"
echo "------------------------------------------"

# 检查协议版本
if grep -q "^Protocol 2" "$SSHD_CONFIG"; then
    check "SSH协议v2" "pass"
else
    check "SSH协议v2" "fail"
fi

# 检查root登录
if grep -q "^PermitRootLogin no" "$SSHD_CONFIG"; then
    check "禁止root登录" "pass"
else
    check "禁止root登录" "fail"
fi

# 检查密码认证
if grep -q "^PasswordAuthentication no" "$SSHD_CONFIG"; then
    check "禁用密码认证" "pass"
else
    check "禁用密码认证" "warn"
fi

# 检查空密码
if grep -q "^PermitEmptyPasswords no" "$SSHD_CONFIG"; then
    check "禁止空密码" "pass"
else
    check "禁止空密码" "fail"
fi

# 检查公钥认证
if grep -q "^PubkeyAuthentication yes" "$SSHD_CONFIG"; then
    check "启用公钥认证" "pass"
else
    check "启用公钥认证" "warn"
fi

# 检查最大尝试次数
MAX_AUTH=$(grep "^MaxAuthTries" "$SSHD_CONFIG" | awk '{print $2}')
if [ -n "$MAX_AUTH" ] && [ "$MAX_AUTH" -le 5 ]; then
    check "最大认证尝试次数 ≤5 ($MAX_AUTH)" "pass"
else
    check "最大认证尝试次数" "warn"
fi

echo ""
echo "2. 加密算法"
echo "------------------------------------------"

# 检查Ciphers
if grep -q "^Ciphers" "$SSHD_CONFIG"; then
    CIPHERS=$(grep "^Ciphers" "$SSHD_CONFIG")
    if echo "$CIPHERS" | grep -q "chacha20-poly1305"; then
        check "Ciphers配置包含强算法" "pass"
    else
        check "Ciphers配置" "warn"
    fi
else
    check "自定义Ciphers配置" "warn"
fi

# 检查KexAlgorithms
if grep -q "^KexAlgorithms" "$SSHD_CONFIG"; then
    check "配置密钥交换算法" "pass"
else
    check "配置密钥交换算法" "warn"
fi

echo ""
echo "3. 访问控制"
echo "------------------------------------------"

# 检查AllowUsers/AllowGroups
if grep -q "^AllowUsers\|^AllowGroups" "$SSHD_CONFIG"; then
    check "配置用户/组白名单" "pass"
else
    check "配置用户/组白名单" "warn"
fi

# 检查fail2ban
if systemctl is-active --quiet fail2ban 2>/dev/null; then
    check "fail2ban运行中" "pass"
else
    check "fail2ban未运行" "fail"
fi

echo ""
echo "4. 转发与隧道"
echo "------------------------------------------"

# X11转发
if grep -q "^X11Forwarding no" "$SSHD_CONFIG"; then
    check "禁用X11转发" "pass"
else
    check "禁用X11转发" "warn"
fi

echo ""
echo "5. 日志与审计"
echo "------------------------------------------"

# 检查日志级别
if grep -q "^LogLevel VERBOSE" "$SSHD_CONFIG"; then
    check "日志级别VERBOSE" "pass"
else
    check "日志级别" "warn"
fi

# 检查登录横幅
if grep -q "^Banner" "$SSHD_CONFIG"; then
    check "配置登录Banner" "pass"
else
    check "配置登录Banner" "warn"
fi

echo ""
echo "=========================================="
echo "检查结果汇总"
echo "------------------------------------------"
echo "总检查项: $TOTAL"
echo "通过: $PASS"
echo "警告: $WARN"
echo "失败: $FAIL"
echo "=========================================="

# 根据结果返回退出码
if [ "$FAIL" -gt 0 ]; then
    exit 2
elif [ "$WARN" -gt 0 ]; then
    exit 1
else
    exit 0
fi
```

### 6.26.3 企业级安全检查清单（进阶版）

| 分类 | 检查项 | 标准要求 | 验证方法 |
|------|--------|----------|----------|
| **身份认证** | | | |
| | 禁用root远程登录 | PermitRootLogin no | sshd -T \| grep permitrootlogin |
| | 公钥认证 | PubkeyAuthentication yes | sshd -T \| grep pubkeyauthentication |
| | 禁用密码认证 | PasswordAuthentication no | sshd -T \| grep passwordauthentication |
| | 双因素认证 | 重要系统必须启用 | 检查PAM配置 |
| | 登录失败锁定 | 5次失败锁定15分钟 | 检查pam_faillock |
| | 账户有效期 | 临时账户设置有效期 | chage -l username |
| **访问控制** | | | |
| | 用户白名单 | AllowUsers/AllowGroups | sshd -T \| grep allowusers |
| | 来源IP限制 | 防火墙+sshd配置 | iptables -L / ufw status |
| | 堡垒机访问 | 仅允许堡垒机IP访问 | 检查防火墙规则 |
| | sudo权限控制 | 最小权限原则 | cat /etc/sudoers |
| **加密安全** | | | |
| | SSH协议版本 | 仅v2 | sshd -T \| grep protocol |
| | 加密算法 | 仅允许强算法 | sshd -T \| grep ciphers |
| | 密钥交换算法 | curve25519优先 | sshd -T \| grep kexalgorithms |
| | MAC算法 | ETM模式优先 | sshd -T \| grep macs |
| | 主机密钥类型 | Ed25519+RSA | ls -la /etc/ssh/ssh_host_* |
| **会话安全** | | | |
| | 空闲超时 | 5分钟无操作断开 | sshd -T \| grep clientalive |
| | 最大会话数 | 限制并发会话 | sshd -T \| grep maxsessions |
| | 最大认证尝试 | ≤3次 | sshd -T \| grep maxauthtries |
| | 登录宽限期 | ≤60秒 | sshd -T \| grep logingracetime |
| **转发控制** | | | |
| | Agent转发 | 禁用 | sshd -T \| grep allowagentforwarding |
| | X11转发 | 禁用 | sshd -T \| grep x11forwarding |
| | TCP转发 | 按需启用 | sshd -T \| grep allowtcpforwarding |
| | 网关端口 | 禁用 | sshd -T \| grep gatewayports |
| | 隧道设备 | 禁用 | sshd -T \| grep permittunnel |
| **审计监控** | | | |
| | 日志级别 | VERBOSE | sshd -T \| grep loglevel |
| | 日志保留 | ≥90天 | /etc/logrotate.d/ |
| | 会话录制 | 重要系统启用 | 检查script/tlog配置 |
| | 集中日志 | 发送到日志服务器 | /etc/rsyslog.conf |
| | 安全监控 | fail2ban/IDS | systemctl status fail2ban |
| | 定期审计 | 每周/每月 | 检查审计记录 |
| **系统加固** | | | |
| | 端口修改 | 非默认端口 | sshd -T \| grep port |
| | 监听地址 | 指定网卡 | sshd -T \| grep listenaddress |
| | 文件权限 | 严格权限检查 | sshd -T \| grep strictmodes |
| | 空密码 | 禁用 | sshd -T \| grep permitemptypasswords |
| | .rhosts | 忽略 | sshd -T \| grep ignorerhosts |
| | 主机认证 | 禁用 | sshd -T \| grep hostbasedauthentication |
| **密钥管理** | | | |
| | 密钥算法 | Ed25519优先 | ssh-keygen -t ed25519 |
| | 密钥长度 | RSA≥3072位 | ssh-keygen -lf key.pub |
| | 私钥密码 | 必须设置 | 检查私钥是否加密 |
| | 密钥轮换 | 定期更换 | 检查密钥创建时间 |
| | 密钥撤销 | 有撤销机制 | 检查CRL/KRL |
| | 证书认证 | 大规模环境使用 | TrustedUserCAKeys |

### 6.26.4 检查清单使用指南

```bash
# ========== 使用方法 ==========

# 1. 每月定期执行检查脚本
/usr/local/bin/ssh-security-check.sh

# 2. 将检查结果纳入安全审计流程
# 添加到月度安全报告中

# 3. 新服务器部署后必须通过检查清单
# 不通过不允许上线

# ========== 评分标准 ==========
# 优秀（90分以上）：所有关键项通过，警告项≤3个
# 良好（80-89分）：所有关键项通过，警告项≤5个
# 合格（70-79分）：无失败项，警告项≤10个
# 不合格（<70分）：有失败项或警告项过多

# ========== 关键项（必须通过）==========
# 1. 禁止root登录
# 2. 禁用密码认证（或启用2FA）
# 3. 禁用空密码
# 4. SSHv2协议
# 5. fail2ban运行中
# 6. 防火墙限制访问

# ========== 自动化检查示例 ==========
cat > /usr/local/bin/ssh-security-score.sh << 'EOF'
#!/bin/bash
# SSH安全评分脚本

SSHD_CONFIG="/etc/ssh/sshd_config"
SCORE=100
CRITICAL_FAIL=0

echo "SSH安全评分系统"
echo "================"

# 关键项检查
echo ""
echo "关键项检查（每项-20分，失败则不及格）："

check_critical() {
    local desc="$1"
    local cmd="$2"
    if eval "$cmd" > /dev/null 2>&1; then
        echo "  [✓] $desc"
    else
        echo "  [✗] $desc (-20分)"
        SCORE=$((SCORE - 20))
        CRITICAL_FAIL=$((CRITICAL_FAIL + 1))
    fi
}

check_critical "禁止root登录" "grep -q '^PermitRootLogin no' $SSHD_CONFIG"
check_critical "禁用空密码" "grep -q '^PermitEmptyPasswords no' $SSHD_CONFIG"
check_critical "SSHv2协议" "grep -q '^Protocol 2' $SSHD_CONFIG"
check_critical "fail2ban运行" "systemctl is-active --quiet fail2ban"

# 一般项检查
echo ""
echo "一般项检查（每项-5分）："

check_normal() {
    local desc="$1"
    local cmd="$2"
    if eval "$cmd" > /dev/null 2>&1; then
        echo "  [✓] $desc"
    else
        echo "  [!] $desc (-5分)"
        SCORE=$((SCORE - 5))
    fi
}

check_normal "禁用密码认证" "grep -q '^PasswordAuthentication no' $SSHD_CONFIG"
check_normal "启用公钥认证" "grep -q '^PubkeyAuthentication yes' $SSHD_CONFIG"
check_normal "配置强加密算法" "grep -q '^Ciphers.*chacha20' $SSHD_CONFIG"
check_normal "禁用X11转发" "grep -q '^X11Forwarding no' $SSHD_CONFIG"
check_normal "配置用户白名单" "grep -q '^AllowUsers\|^AllowGroups' $SSHD_CONFIG"
check_normal "修改默认端口" "! grep -q '^Port 22$' $SSHD_CONFIG"
check_normal "配置空闲超时" "grep -q '^ClientAliveInterval' $SSHD_CONFIG"
check_normal "日志级别VERBOSE" "grep -q '^LogLevel VERBOSE' $SSHD_CONFIG"

echo ""
echo "================"
echo "安全评分: $SCORE / 100"

if [ "$CRITICAL_FAIL" -gt 0 ]; then
    echo "评级: 不合格（关键项失败）"
    exit 2
elif [ "$SCORE" -ge 90 ]; then
    echo "评级: 优秀"
elif [ "$SCORE" -ge 80 ]; then
    echo "评级: 良好"
elif [ "$SCORE" -ge 70 ]; then
    echo "评级: 合格"
else
    echo "评级: 不合格"
    exit 1
fi
EOF
chmod +x /usr/local/bin/ssh-security-score.sh

# 运行评分
/usr/local/bin/ssh-security-score.sh
```

---

## 6.27 小结

本章详细介绍了SSH安全配置的各个方面，从基础的协议原理到高级的攻击防御技术。

**核心要点回顾**：

1. **SSH密钥管理**：Ed25519是目前推荐的密钥算法，兼具安全性和性能优势。ssh-agent可以安全地管理密钥，但要谨慎使用agent转发功能。SSH证书认证适合大规模环境，通过CA集中管理密钥生命周期。

2. **堡垒机架构**：堡垒机是企业SSH安全的重要架构，通过收敛访问入口、集中认证和审计来提升整体安全性。ProxyJump和ProxyCommand是实现跳板机访问的两种主要方式。

3. **多因素认证**：双因素认证可以有效防止凭证泄露带来的风险。Google Authenticator是最常用的软件方案，YubiKey等硬件密钥提供更高的安全性。

4. **chroot监狱**：通过限制用户的文件系统访问范围，chroot可以降低账户被攻破后的影响范围。SFTP chroot是最简单实用的场景。

5. **审计与监控**：详细的日志和会话录制是事后溯源的重要依据。fail2ban等工具可以自动检测和防御暴力破解攻击。

6. **攻击防御**：多层防御体系包括防火墙、fail2ban、端口敲门、蜜罐等技术。组合使用可以大大降低被攻击的风险。

7. **客户端安全**：SSH客户端配置同样重要，合理的配置可以防止密钥泄露、主机欺骗等风险。

SSH安全是一个持续的过程，需要定期审计、及时更新配置、关注安全公告。建立完善的SSH安全策略和流程，比任何单一技术都更重要。