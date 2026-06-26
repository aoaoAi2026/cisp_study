# 第十八章 DNS服务器安全

## 18.1 DNS服务概述

### 18.1.1 DNS的作用与重要性

DNS（Domain Name System）是互联网的基础设施之一，负责将域名解析为IP地址。DNS服务的安全直接影响整个网络的安全性。

**DNS面临的安全威胁**

1. **DNS欺骗（DNS Spoofing）**
   - 攻击者伪造DNS响应，将用户导向恶意站点
   - 中间人攻击的一种形式

2. **DNS放大攻击**
   - 利用DNS响应远大于请求的特性
   - 进行DDoS攻击

3. **DNS隧道（DNS Tunneling）**
   - 利用DNS协议传输非DNS流量
   - 常用于绕过防火墙

4. **缓存投毒（Cache Poisoning）**
   - 向DNS缓存中注入虚假记录
   - 影响所有使用该缓存的用户

5. **区域传输泄露**
   - 未经授权的区域传输
   - 导致DNS记录外泄

### 18.1.2 常用DNS服务器软件

- **BIND**：最广泛使用的DNS服务器，ISC维护
- **PowerDNS**：高性能，支持多种后端
- **CoreDNS**：云原生DNS服务器，Kubernetes默认
- **Dnsmasq**：轻量级DNS/DHCP服务器
- **Unbound**：安全导向的DNS解析器

## 18.2 BIND DNS安全配置

### 18.2.1 BIND安装与基本配置

```bash
# 安装BIND（CentOS）
yum install bind bind-utils -y

# 安装BIND（Ubuntu）
apt install bind9 bind9-utils bind9-doc -y

# 主配置文件
# CentOS: /etc/named.conf
# Ubuntu: /etc/bind/named.conf.options

# 基本安全配置示例
cat > /etc/named.conf << 'EOF'
options {
    // 监听地址
    listen-on port 53 { 127.0.0.1; 10.0.0.1; };
    listen-on-v6 port 53 { ::1; };
    
    // 允许查询的网段
    allow-query { 10.0.0.0/24; localhost; };
    
    // 允许区域传输的服务器
    allow-transfer { none; };
    
    // 递归查询限制
    allow-recursion { 10.0.0.0/24; localhost; };
    
    // 关闭版本信息
    version "not disclosed";
    
    // 安全选项
    dnssec-validation yes;
    auth-nxdomain no;
    
    // 日志配置
    logging {
        channel default_log {
            file "/var/log/named/default.log" versions 5 size 10m;
            severity info;
            print-time yes;
            print-category yes;
        };
        category security { security_log; };
        category queries { default_log; };
    };
    
    // 其他设置
    directory "/var/named";
    pid-file "/run/named/named.pid";
    max-cache-size 256M;
};
EOF

# 创建日志目录
mkdir -p /var/log/named
chown named:named /var/log/named

# 测试配置
named-checkconf

# 启动服务
systemctl enable named
systemctl start named

# 检查状态
systemctl status named
```

### 18.2.2 BIND ACL访问控制

```bash
# 定义ACL
cat >> /etc/named.conf << 'EOF'

acl "internal" {
    10.0.0.0/8;
    172.16.0.0/12;
    192.168.0.0/16;
};

acl "partner" {
    203.0.113.0/24;
    198.51.100.0/24;
};

acl " blacklist" {
    192.0.2.0/24;
    198.51.100.0/24;
};
EOF

# 使用ACL
# 编辑options块
allow-query { internal; };
allow-recursion { internal; };
blackhole { blacklist; };
```

### 18.2.3 BIND Views配置（智能DNS）

```bash
# 配置内部和外部视图
cat > /etc/named.conf << 'EOF'
# 外部视图（对公网）
view "external" {
    match-clients { any; };
    
    zone "example.com" {
        type master;
        file "external/example.com.zone";
        allow-query { any; };
        allow-transfer { none; };
    };
    
    // 递归查询对外部关闭
    recursion no;
};

# 内部视图
view "internal" {
    match-clients { 10.0.0.0/8; localhost; };
    
    // 包含所有内部区域
    zone "internal.example.com" {
        type master;
        file "internal/internal.example.com.zone";
    };
    
    // 递归查询
    recursion yes;
    allow-recursion { internal; 10.0.0.0/8; };
};
EOF
```

## 18.3 DNSSEC配置

### 18.3.1 DNSSEC原理

DNSSEC通过数字签名确保DNS数据的完整性和真实性，防止DNS欺骗攻击。

**DNSSEC关键概念**

- **KSK（Key Signing Key）**：用于签名ZSK的密钥
- **ZSK（Zone Signing Key）**：用于签名区域数据的密钥
- **DS记录**：在父区域发布的DNSKEY摘要
- **RRSIG**：资源的数字签名

### 18.3.2 配置DNSSEC

```bash
# 1. 生成签名密钥
cd /var/named
dnssec-keygen -a RSASHA256 -b 2048 -n ZONE example.com
dnssec-keygen -f KSK -a RSASHA256 -b 4096 -n ZONE example.com

# 查看生成的密钥
ls -la K*

# 2. 在区域文件中启用签名
# 编辑zone文件，添加$INCLUDE指令
$INCLUDE Kexample.com.+008+12345.key
$INCLUDE Kexample.com.+008+12345.private

# 3. 签名区域
dnssec-signzone -A -3 $(head -c 16 /dev/urandom | xxd -p) -N increment -o example.com -t example.com.zone

# 生成signed区域文件
ls -la *.signed

# 4. 更新named.conf使用签名区域
zone "example.com" {
    type master;
    file "example.com.zone.signed";
    allow-query { any; };
};

# 5. 配置DNSKEY查询
# 添加信任锚点
cat >> /etc/named.conf << 'EOF'
managed-keys {
    "." initial-key 257 3 8 "AwEAAd...";  // 根KSK
};
EOF

# 6. 验证DNSSEC
dig +dnssec @localhost ns.example.com
```

## 18.4 DNS流量控制与防攻击

### 18.4.1 防止DNS放大攻击

```bash
# 在防火墙配置
# 限制入站DNS流量
iptables -A INPUT -p udp --dport 53 -m hashlimit \
    --hashlimit-above 50/sec --hashlimit-burst 100 \
    --hashlimit-mode srcip --hashlimit-name dns_rate_limit \
    -j DROP

# 限制DNS响应大小
# 在named.conf中
max-udp-size 1024;
max-cache-udp-size 1024;
```

### 18.4.2 防止DNS隧道

```bash
# 1. 监控异常DNS查询
# 创建监控脚本
cat > /usr/local/bin/dns_tunnel_check.sh << 'EOF'
#!/bin/bash
# DNS隧道检测脚本

LOG_FILE="/var/log/named/query.log"
ALERT_THRESHOLD=1000

# 统计单个IP的查询频率
awk '{print $4}' $LOG_FILE | cut -d# -f1 | sort | uniq -c | \
    sort -rn | head -20 > /tmp/dns_query_stats.txt

# 检测异常
while read count ip; do
    if [ $count -gt $ALERT_THRESHOLD ]; then
        echo "警告: IP $ip 查询频率异常 ($count)" | \
            mail -s "DNS隧道告警" admin@example.com
    fi
done < /tmp/dns_query_stats.txt

# 检测长域名（可能是隧道）
awk '/ length [0-9]+$/ {print $4, $NF}' $LOG_FILE | \
    awk '{if ($NF > 100) print $0}' > /tmp/long_domains.txt

if [ -s /tmp/long_domains.txt ]; then
    echo "检测到异常长域名查询" | \
        mail -s "DNS异常告警" admin@example.com
fi
EOF

chmod +x /usr/local/bin/dns_tunnel_check.sh

# 添加到crontab
echo "*/5 * * * * /usr/local/bin/dns_tunnel_check.sh" >> /etc/crontab

# 2. 限制查询类型
# 在named.conf中
allow-query-cache { internal; };
```

### 18.4.3 防止缓存投毒

```bash
# 1. 启用响应随机化
# 使用源端口随机化
# 编辑 /etc/sysctl.conf
net.ipv4.ip_local_port_range = 32768 60999

# 2. 禁用EDNS0客户端子网
# 在named.conf中
edition-options {
    no-edns0;
};

# 3. 限制NXDOMAIN速率
# 在named.conf中
rate-limit {
    responses-per-second 10;
    window 5;
};
```

## 18.5 私有DNS服务器配置

### 18.5.1 Dnsmasq轻量级DNS

```bash
# 安装Dnsmasq
yum install dnsmasq -y    # CentOS
apt install dnsmasq -y    # Ubuntu

# 配置Dnsmasq
cat > /etc/dnsmasq.conf << 'EOF'
# 监听地址
listen-address=127.0.0.1,10.0.0.1

# 缓存大小
cache-size=10000

# 不读取/etc/resolv.conf
no-resolv

# 上游DNS服务器
server=8.8.8.8
server=8.8.4.4
server=223.5.5.5

# 内部域
address=/internal.example.com/10.0.0.10
address=/db.internal.example.com/10.0.0.20

# 安全选项
bogus-priv
filterwin2k
no-resolv
no-poll
stop-dns-rebind
rebind-localhost-ok

# 日志
log-queries
log-facility=/var/log/dnsmasq.log
EOF

# 启动服务
systemctl enable dnsmasq
systemctl start dnsmasq

# 测试
dig @127.0.0.1 internal.example.com
```

### 18.5.2 CoreDNS云原生DNS

```bash
# 下载CoreDNS
wget https://github.com/coredns/coredns/releases/download/v1.11.0/coredns_1.11.0_linux_amd64.tgz
tar -xzf coredns_1.11.0_linux_amd64.tgz
mv coredns /usr/local/bin/

# 创建Corefile配置
cat > /etc/coredns/Corefile << 'EOF'
. {
    # 缓存
    cache 30
    
    # 上游DNS
    forward . 8.8.8.8 8.8.4.4 223.5.5.5
    
    # 日志
    log
    
    # 安全
    security {
        invalid . { block }
    }
    
    # 监听
    bind 10.0.0.1
    
    # 自动Hosts
    hosts {
        10.0.0.10 internal.example.com
        10.0.0.20 db.internal.example.com
        fallthrough
    }
}
EOF

# 创建systemd服务
cat > /etc/systemd/system/coredns.service << 'EOF'
[Unit]
Description=CoreDNS DNS Server
After=network.target

[Service]
ExecStart=/usr/local/bin/coredns -conf /etc/coredns/Corefile
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# 启动服务
systemctl daemon-reload
systemctl enable coredns
systemctl start coredns
```

## 18.6 DNS安全检查清单

| 检查项 | 检查方法 | 安全标准 |
|--------|---------|---------|
| 版本隐藏 | `dig @server version.bind txt chaos` | 无信息泄露 |
| 递归查询 | `dig @server google.com` | 仅内部网络 |
| 区域传输 | `dig @server axfr example.com` | 已禁止 |
| DNSSEC | `dig +dnssec @server ns.example.com` | 已启用 |
| ACL配置 | `grep allow-query named.conf` | 已配置 |
| 日志审计 | `tail /var/log/named/query.log` | 已启用 |
| 缓存投毒防护 | `grep randomize-case named.conf` | 已启用 |
| 版本号 | `grep version named.conf` | 已隐藏 |
| 端口范围 | `sysctl net.ipv4.ip_local_port_range` | 已优化 |
| 限速配置 | `grep rate-limit named.conf` | 已配置 |

## 18.7 实战案例：DNS服务器被攻击应急响应

### 18.7.1 案例背景

某公司DNS服务器遭受DNS放大攻击，同时发现异常的区域传输请求。

### 18.7.2 应急响应过程

```bash
# 1. 发现异常
# 查看DNS日志
tail -f /var/log/named/query.log

# 发现大量来自不同IP的ANY查询
grep "ANY" /var/log/named/query.log | awk '{print $4}' | sort | uniq -c | sort -rn | head

# 2. 紧急遏制
# 临时关闭递归查询
cat >> /etc/named.conf << 'EOF'
options {
    // 临时关闭递归
    recursion no;
};
EOF

named-checkconf && systemctl reload named

# 3. 配置限速
cat > /etc/named.rfc1918 << 'EOF'
zone "10.in-addr.arpa" { type delegation-only; };
zone "16.172.in-addr.arpa" { type delegation-only; };
// ... 其他私有地址段
EOF

# 在named.conf中添加
response-rate-limit {
    first 10 10;
    then 5 10;
    ttl 10s;
};

# 4. 恢复服务
systemctl reload named

# 5. 分析攻击来源
# 统计攻击流量
awk '/UDP.*53.*ANY/ {print $4}' /var/log/named/query.log | \
    cut -d# -f1 | sort | uniq -c | sort -rn | head > /tmp/attack_stats.txt

# 6. 添加防火墙规则
while read count ip; do
    iptables -A INPUT -p udp --dport 53 -s $ip -m hashlimit \
        --hashlimit 10/s --hashlimit-burst 20 -j ACCEPT
    iptables -A INPUT -p udp --dport 53 -s $ip -j DROP
done < /tmp/attack_stats.txt

# 7. 配置自动防御
cat > /usr/local/bin/dns_ddos_defense.sh << 'EOF'
#!/bin/bash
# DNS DDoS防御脚本

LOG="/var/log/named/query.log"
BLOCK_THRESHOLD=100
BLOCK_TIME=3600

# 统计最近1分钟的查询
awk -v threshold=$BLOCK_THRESHOLD '
    BEGIN { now = systime() }
    {
        cmd = "date -d \""$1" "$2"\" +%s"
        cmd | getline query_time
        close(cmd)
        if (now - query_time < 60) {
            count[$4]++
        }
    }
    END {
        for (ip in count) {
            if (count[ip] > threshold) {
                system("iptables -I INPUT -p udp --dport 53 -s "ip" -j DROP")
                print "Blocked:", ip, "count:", count[ip]
            }
        }
    }
' $LOG
EOF

chmod +x /usr/local/bin/dns_ddos_defense.sh
```

### 18.7.3 后续加固

```bash
# 1. 启用Anycast分散流量
# 配置多个DNS服务器在不同的地理位置

# 2. 启用BGP Flowspec
# 与ISP协作过滤恶意流量

# 3. 部署DNS防火墙
# 使用DNS防火墙服务如Cloudflare DNS Protection

# 4. 配置anycast
# 使用Anycast让多个节点响应同一个IP

# 5. 定期审计
# 配置日志分析系统
```

## 18.8 本章小结

DNS服务器安全是Linux系统安全的重要组成部分。本章介绍了：

- **DNS安全威胁**：DNS欺骗、DNS放大攻击、DNS隧道、缓存投毒等
- **BIND安全配置**：ACL控制、视图配置、日志审计
- **DNSSEC配置**：数字签名、密钥管理、验证配置
- **DNS防攻击**：流量控制、限速、防隧道
- **私有DNS服务器**：Dnsmasq、CoreDNS的部署配置
- **安全检查清单**：DNS安全配置检查标准
- **实战案例**：DNS服务器被攻击后的应急响应和加固

通过合理的DNS安全配置，可以有效防止DNS相关的安全威胁，保障网络基础设施的安全。
