# 第十七章 VPN与网络隧道安全

## 17.1 VPN技术概述

### 17.1.1 VPN的基本概念

VPN（Virtual Private Network，虚拟专用网络）是一种在公共网络上建立加密通道的技术，通过公网实现远程访问内部网络资源。VPN的核心价值在于：

- **数据加密传输**：防止数据在传输过程中被窃听或篡改
- **身份认证**：确保只有授权用户才能连接VPN
- **IP地址伪装**：隐藏用户真实IP，保护用户隐私
- **网络扩展**：让远程用户像本地一样访问内网资源

### 17.1.2 VPN的类型

**按协议分类**

1. **PPTP（Point-to-Point Tunneling Protocol）**
   - 最古老的VPN协议
   - 基于GRE隧道，安全性较低
   - 已不推荐使用

2. **L2TP/IPsec（Layer 2 Tunneling Protocol）**
   - 结合L2TP和IPsec的优点
   - 支持双因素认证
   - 跨平台支持好

3. **OpenVPN**
   - 基于SSL/TLS的开源方案
   - 支持多种操作系统
   - 灵活性高，安全性好

4. **IPsec（Internet Protocol Security）**
   - 网络层VPN协议
   - 分为传输模式和隧道模式
   - 通常与L2TP结合使用

5. **WireGuard**
   - 新一代VPN协议
   - 基于现代加密算法
   - 性能优异，代码简洁

**按应用场景分类**

- **远程访问VPN**：个人远程办公
- **站点到站点VPN**：企业分支互联
- **SSL VPN**：基于浏览器的远程访问

## 17.2 WireGuard部署与配置

### 17.2.1 WireGuard简介

WireGuard是一种现代化的VPN协议，具有以下特点：

- **简洁代码**：只有约4000行代码，审计容易
- **高性能**：基于Linux内核，吞吐量高
- **安全加密**：使用Curve25519、ChaCha20、Poly1305等现代加密算法
- **快速连接**：连接建立时间短，切换网络更稳定

### 17.2.2 WireGuard服务端配置

```bash
# 安装WireGuard（CentOS 8+）
dnf install epel-release -y
dnf install wireguard-tools -y

# 安装WireGuard（Ubuntu）
apt update
apt install wireguard -y

# 生成密钥对
cd /etc/wireguard
umask 077

# 生成服务器密钥
wg genkey > server_private.key
wg pubkey < server_private.key > server_public.key

# 生成客户端密钥
wg genkey > client1_private.key
wg pubkey < client1_private.key > client1_public.key

# 服务器配置文件
cat > wg0.conf << 'EOF'
[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = <SERVER_PRIVATE_KEY>
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# 客户端配置
[Peer]
PublicKey = <CLIENT1_PUBLIC_KEY>
AllowedIPs = 10.0.0.2/32

[Peer]
PublicKey = <CLIENT2_PUBLIC_KEY>
AllowedIPs = 10.0.0.3/32
EOF

# 设置权限
chmod 600 wg0.conf server_private.key client1_private.key

# 启用IP转发
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p

# 配置防火墙
firewall-cmd --permanent --add-port=51820/udp
firewall-cmd --permanent --add-masquerade
firewall-cmd --reload

# 启动WireGuard
systemctl enable wg-quick@wg0
systemctl start wg-quick@wg0

# 查看状态
wg show
```

### 17.2.3 WireGuard客户端配置

```bash
# 客户端配置文件（Linux/Windows/macOS通用）
cat > wg0.conf << 'EOF'
[Interface]
Address = 10.0.0.2/24
PrivateKey = <CLIENT_PRIVATE_KEY>
DNS = 8.8.8.8

[Peer]
PublicKey = <SERVER_PUBLIC_KEY>
Endpoint = vpn.example.com:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
EOF

# Windows客户端使用UI工具配置
# 下载地址：https://www.wireguard.com/install/

# macOS客户端：App Store下载WireGuard
```

### 17.2.4 WireGuard安全加固

```bash
# 1. 限制WireGuard端口访问
iptables -A INPUT -p udp --dport 51820 -s 10.0.0.0/24 -j ACCEPT
iptables -A INPUT -p udp --dport 51820 -j DROP

# 2. 限制客户端可访问的网络
# 在服务器配置中使用 AllowedIPs 限制
# 例如：只允许客户端访问内网10.10.0.0/16
[Peer]
AllowedIPs = 10.10.0.0/16

# 3. 定期轮换密钥
# 定期更新密钥对并重新分发

# 4. 启用日志审计
# 配置rsyslog记录WireGuard连接日志
```

## 17.3 OpenVPN部署与配置

### 17.3.1 OpenVPN服务端配置

```bash
# 安装OpenVPN
yum install openvpn easy-rsa -y    # CentOS
apt install openvpn easy-rsa -y    # Ubuntu

# 创建PKI证书基础设施
make-cadir /etc/openvpn/easy-rsa
cd /etc/openvpn/easy-rsa

# 初始化PKI
./easyrsa init-pki
./easyrsa build-ca

# 生成服务器证书
./easyrsa gen-req server nopass
./easyrsa sign server server

# 生成Diffie-Hellman参数
./easyrsa gen-dh
dh.pem

# 生成TLS密钥
openvpn --genkey --secret /etc/openvpn/ta.key

# 服务器配置文件
cat > /etc/openvpn/server.conf << 'EOF'
port 1194
proto udp
dev tun
ca /etc/openvpn/easy-rsa/pki/ca.crt
cert /etc/openvpn/easy-rsa/pki/issued/server.crt
key /etc/openvpn/easy-rsa/pki/private/server.key
dh /etc/openvpn/easy-rsa/pki/dh.pem
tls-auth /etc/openvpn/ta.key 0
server 10.8.0.0 255.255.255.0
ifconfig-pool-persist ipp.txt
push "redirect-gateway def1 bypass-dhcp"
push "dhcp-option DNS 8.8.8.8"
push "dhcp-option DNS 8.8.4.4"
keepalive 10 120
cipher AES-256-CBC
auth SHA256
user openvpn
group openvpn
persist-key
persist-tun
status openvpn-status.log
log-append openvpn.log
verb 3
EOF

# 创建OpenVPN用户
./easyrsa gen-req client1 nopass
./easyrsa sign client client1

# 导出客户端配置
cat > /etc/openvpn/client-common.txt << 'EOF'
client
dev tun
proto udp
remote vpn.example.com 1194
resolv-retry infinite
nobind
user openvpn
group openvpn
persist-key
persist-tun
remote-cert-tls server
cipher AES-256-CBC
auth SHA256
verb 3
<ca>
$(cat pki/ca.crt)
</ca>
<cert>
$(cat pki/issued/client1.crt)
</cert>
<key>
$(cat pki/private/client1.key)
</key>
<tls-auth>
$(cat ta.key)
</tls-auth>
key-direction 1
EOF

# 启动OpenVPN
systemctl enable openvpn@server
systemctl start openvpn@server
```

### 17.3.2 OpenVPN安全加固

```bash
# 1. 启用证书吊销检查
# 创建吊销列表
./easyrsa revoke client1
./easyrsa gen-crl

# 在服务器配置中添加：
crl-verify /etc/openvpn/easy-rsa/pki/crl.pem

# 2. 限制客户端访问
# 使用client-config-dir限制客户端IP
mkdir -p /etc/openvpn/ccd
echo "ifconfig-push 10.8.0.10 255.255.255.0" > /etc/openvpn/ccd/client1

# 3. 启用2FA双因素认证
# 安装openvpn-plugin-auth-pam
# 在配置中添加：
plugin /usr/lib/openvpn/plugins/openvpn-plugin-auth-pam.so login

# 4. 日志审计
# 配置详细的连接日志
verb 4
log-append /var/log/openvpn.log

# 5. 限制并发连接数
# 在ccd中配置：
iroute 10.8.0.10 255.255.255.255 client1
```

## 17.4 IPsec VPN配置

### 17.4.1 IPsec简介

IPsec是网络层的安全协议套件，提供数据加密、完整性校验和身份认证。

**两种工作模式**

1. **传输模式（Transport Mode）**
   - 只加密数据载荷
   - 保留原始IP头
   - 适用于主机到主机的连接

2. **隧道模式（Tunnel Mode）**
   - 加密整个原始IP包
   - 添加新的IP头
   - 适用于网关到网关或网关到主机

**两个协议**

1. **AH（Authentication Header）**
   - 提供数据完整性校验
   - 不加密数据
   - 校验IP头部分字段

2. **ESP（Encapsulating Security Payload）**
   - 提供数据加密
   - 可选完整性校验
   - 更常用

### 17.4.2 StrongSwan配置

```bash
# 安装StrongSwan
yum install strongswan -y    # CentOS
apt install strongswan strongswan-pki -y    # Ubuntu

# 生成证书
cd /etc/strongswan/ipsec.d

# 创建CA证书
ipsec pki --gen --type rsa --size 4096 --outform pem > private/strongswanKey.pem
ipsec pki --pub --type rsa --in private/strongswanKey.pem --outform pem > cacerts/strongswanCert.pem

# 创建服务器证书
ipsec pki --gen --type rsa --size 2048 --outform pem > private/vpnServerKey.pem
ipsec pki --pub --type rsa --in private/vpnServerKey.pem --outform pem > certs/vpnServerCert.pem
ipsec pki --issue --cacert cacerts/strongswanCert.pem --cakey private/strongswanKey.pem \
    --in certs/vpnServerCert.pem --outform pem --lifetime 365 \
    --dn "C=CN, O=MyOrg, CN=vpn.example.com" > certs/vpnServerCert.pem

# 服务器配置文件
cat > /etc/strongswan/swanctl/swanctl.conf << 'EOF'
connections {
    gateway2gateway {
        version = 2
        mobike = no
        proposals = aes256-sha256-modp2048
        rekey_time = 1h
        
        local {
            auth = pubkey
            certs = vpnServerCert.pem
            id = vpn.example.com
        }
        
        remote {
            auth = pubkey
            id = remote.example.com
        }
        
        children {
            net2net {
                mode = tunnel
                rekey_time = 1h
                proposals = aes256-sha256-modp2048
                local_ts = 10.0.0.0/24
                remote_ts = 192.168.1.0/24
            }
        }
    }
}

secrets {
    rsa-key {
        id = vpn.example.com
        file = /etc/strongswan/ipsec.d/private/vpnServerKey.pem
    }
}
EOF

# IPsec配置文件
cat > /etc/ipsec.conf << 'EOF'
config setup
    charondebug = "all"
    uniqueids = never

include /etc/strongswan/swanctl/swanctl.conf
EOF

# 启动服务
systemctl enable strongswan
systemctl start strongswan

# 检查状态
strongswan status
```

## 17.5 网络隧道技术

### 17.5.1 SSH隧道

SSH隧道是利用SSH协议建立加密通道的技术，常用于安全访问内部服务。

**本地端口转发**

```bash
# 格式：ssh -L local_port:destination:dest_port user@ssh_server
# 示例：通过跳板机访问内网MySQL
ssh -L 3307:192.168.1.100:3306 user@jumpserver.example.com

# 访问本地3307端口，实际连接内网192.168.1.100:3306
mysql -h 127.0.0.1 -P 3307 -u dbuser -p
```

**远程端口转发**

```bash
# 格式：ssh -R remote_port:destination:dest_port user@ssh_server
# 示例：将内网服务暴露给远程服务器
ssh -R 8080:internal-web:80 user@vpn.example.com

# 远程服务器访问8080端口，实际连接到内网web服务器的80端口
```

**动态端口转发（SOCKS代理）**

```bash
# 格式：ssh -D local_socks_port user@ssh_server
# 示例：建立SOCKS5代理
ssh -D 1080 user@vpn.example.com

# 配置浏览器或应用程序使用127.0.0.1:1080 SOCKS代理
```

### 17.5.2 SSH隧道安全加固

```bash
# 1. 禁用网关端口
# 编辑 /etc/ssh/sshd_config
GatewayPorts no

# 2. 限制用户可以使用隧道
# 在sshd_config中
AllowTcpForwarding no        # 完全禁用
AllowTcpForwarding yes       # 仅允许本地转发
PermitRootLogin no

# 3. 使用force_command限制
Match User tunneluser
    AllowTcpForwarding remote
    ForceCommand /bin/false

# 4. 审计隧道使用
# 在/etc/rsyslog.conf添加
auth.*;authpriv.*;daemon.* /var/log/ssh_tunnel.log

# 5. 监控活动隧道
watch -n 5 "ss -tlnp | grep ssh"
```

### 17.5.3 GRE隧道

GRE（Generic Routing Encapsulation）是Cisco开发的隧道协议，用于建立点对点隧道。

```bash
# 创建GRE隧道（需要IP转发启用）
ip tunnel add gre1 mode gre remote 203.0.113.50 local 192.168.1.1 ttl 255
ip addr add 10.0.0.1/30 dev gre1
ip link set gre1 up

# 配置路由
ip route add 192.168.2.0/24 dev gre1

# 查看隧道状态
ip tunnel show
ip addr show gre1

# 删除隧道
ip link set gre1 down
ip tunnel del gre1
```

## 17.6 VPN安全检查清单

| 检查项 | 检查方法 | 安全标准 |
|--------|---------|---------|
| 加密算法 | `wg show` / `openvpn --show-tls` | ChaCha20/AES-256 |
| 证书有效期 | `openssl x509 -in cert.pem -noout -dates` | 未过期 |
| 端口访问 | `iptables -L -n` | 限制源IP |
| 密钥权限 | `ls -l server_private.key` | 600 |
| 日志审计 | `tail /var/log/openvpn.log` | 已启用 |
| 协议版本 | 检查配置文件 | WireGuard/OpenVPN |
| 双因素认证 | 检查VPN配置 | 已启用 |
| 客户端隔离 | 检查路由配置 | 已配置 |
| IP转发 | `sysctl net.ipv4.ip_forward` | 按需启用 |
| 防火墙规则 | `iptables -L -n` | 限制访问 |

## 17.7 实战案例：企业VPN安全加固

### 17.7.1 案例背景

某公司使用PPTP VPN，存在安全隐患：
- 使用默认端口1723
- 只用PAP认证（明文密码）
- 无日志审计
- 密钥未定期更换

### 17.7.2 加固方案

**第一阶段：评估与规划**

```bash
# 1. 评估当前VPN配置
cat /etc/pptpd/pptpd.conf
cat /etc/ppp/chap-secrets

# 2. 备份当前配置
mkdir /root/vpn_backup_$(date +%Y%m%d)
cp -r /etc/pptpd /root/vpn_backup_$(date +%Y%m%d)/
cp -r /etc/ppp /root/vpn_backup_$(date +%Y%m%d)/
```

**第二阶段：迁移到WireGuard**

```bash
# 1. 安装WireGuard
dnf install wireguard-tools -y

# 2. 生成新密钥对
cd /etc/wireguard
wg genkey > server_private
wg pubkey < server_private > server_public

# 3. 配置WireGuard（见17.2节）

# 4. 配置防火墙
firewall-cmd --permanent --add-port=51820/udp
firewall-cmd --permanent --add-masquerade
firewall-cmd --reload

# 5. 测试连接
wg show
```

**第三阶段：用户迁移**

```bash
# 为每个用户生成密钥对
cd /etc/wireguard/clients
wg genkey > user1_private
wg pubkey < user1_private > user1_public

# 在服务器添加用户
wg set wg0 peer $(cat /etc/wireguard/clients/user1_public) allowed-ips 10.0.0.2/32

# 下发配置文件给用户
```

**第四阶段：验证与监控**

```bash
# 1. 验证连接
wg show

# 2. 设置日志监控
cat > /etc/logrotate.d/wireguard << 'EOF'
/var/log/wireguard.log {
    daily
    rotate 7
    missingok
    notifempty
    compress
    postrotate
        systemctl reload wireguard > /dev/null 2>&1 || true
    endscript
}
EOF

# 3. 设置连接监控告警
cat > /usr/local/bin/vpn_monitor.sh << 'EOF'
#!/bin/bash
# VPN连接监控脚本

active_conns=$(wg show | grep -c "peer")
threshold=50

if [ $active_conns -gt $threshold ]; then
    echo "警告: 当前连接数 $active_conns 超过阈值 $threshold" | \
        mail -s "VPN连接告警" admin@example.com
fi

# 记录日志
echo "$(date): $active_conns active connections" >> /var/log/vpn_monitor.log
EOF

chmod +x /usr/local/bin/vpn_monitor.sh

# 添加到crontab
echo "*/5 * * * * /usr/local/bin/vpn_monitor.sh" >> /etc/crontab
```

## 17.8 本章小结

VPN与网络隧道安全是Linux安全加固的重要组成部分。本章介绍了：

- **VPN技术概述**：PPTP、L2TP/IPsec、OpenVPN、WireGuard、IPsec等协议
- **WireGuard部署**：高性能现代VPN协议的部署和配置
- **OpenVPN部署**：开源SSL VPN的部署和安全加固
- **IPsec VPN配置**：使用StrongSwan建立站点间VPN
- **网络隧道技术**：SSH隧道、GRE隧道的配置和安全加固
- **安全检查清单**：VPN安全配置检查标准
- **实战案例**：企业VPN从PPTP迁移到WireGuard的完整过程

通过合理使用VPN和网络隧道技术，可以安全地实现远程访问和网络互联，保护数据传输安全。
