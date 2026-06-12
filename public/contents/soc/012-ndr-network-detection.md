# NDR 网络检测与响应：Zeek / Suricata / NetFlow 实战

---

## 一、NDR 三层体系

```
网络检测与响应(NDR) = 协议分析 + 特征检测 + 流量统计

Layer 1: Zeek (协议分析)
  深度协议解析(HTTP/DNS/SSL/SMB/Kerberos/Modbus等)
  记录连接元数据(conn.log/dns.log/http.log...)
  文件提取+Hash计算

Layer 2: Suricata (特征检测)
  基于规则的IDS/IPS
  支持Emerging Threats/Suricata规则集
  IPS模式(内联阻断) or IDS模式(旁路检测)

Layer 3: NetFlow/sFlow (流量统计)
  元数据：5元组+字节数+包数
  大流量趋势分析
  异常检测基线
```

---

## 二、Zeek 实战

```bash
# 安装
apt install zeek

# 实时监控网卡
zeek -i eth0 local

# 读取PCAP
zeek -r capture.pcap

# 输出日志 (默认在/usr/local/zeek/logs/current/)
# conn.log    — 所有TCP/UDP/ICMP连接
# dns.log     — DNS查询和响应
# http.log    — HTTP请求和响应
# ssl.log     — SSL/TLS握手信息(证书/SNI/JA3指纹)
# smb.log     — SMB连接和文件操作
# kerberos.log — Kerberos认证票据
```

```zeek
# 自定义Zeek脚本 — 检测DNS隧道
# /usr/local/zeek/share/zeek/site/dns-tunnel.zeek

event dns_request(c: connection, msg: dns_msg, query: string, qtype: count, qclass: count)
{
    # 检测超长DNS查询(可能是DNS隧道)
    if (|query| > 50) {
        NOTICE([$note=Weird::DNS_Tunnel,
                $msg=fmt("Long DNS query: %s (%d bytes)", query, |query|),
                $conn=c]);
    }
    
    # 检测高熵域名(DGA)
    local entropy = calculate_entropy(query);
    if (entropy > 4.0) {
        NOTICE([$note=Weird::DGA_Domain,
                $msg=fmt("High entropy DNS: %s (%.2f)", query, entropy),
                $conn=c]);
    }
}

# 文件提取 — 从HTTP流量中提取传输的文件
event file_sniff(f: fa_file, meta: fa_metadata)
{
    if (meta$mime_type == "application/x-dosexec") {
        Files::add_analyzer(f, Files::ANALYZER_MD5);
        Files::add_analyzer(f, Files::ANALYZER_SHA256);
    }
}
```

---

## 三、Suricata IPS 部署

```bash
# 安装
add-apt-repository ppa:oisf/suricata-stable
apt update && apt install suricata

# 配置 IPS 模式（NFQUEUE）
# /etc/suricata/suricata.yaml
af-packet:
  - interface: eth0
    cluster-id: 99
    cluster-type: cluster_flow
    defrag: yes

# 启用规则源
suricata-update
suricata-update enable-source et/open
suricata-update enable-source oisf/trafficid

# IPS模式（内联，NFQUEUE）
iptables -I FORWARD -j NFQUEUE --queue-num 0
suricata -c /etc/suricata/suricata.yaml -q 0

# 监控告警
tail -f /var/log/suricata/fast.log
jq '.alert' /var/log/suricata/eve.json | tail -20
```

---

## 四、NetFlow C2 Beacon 检测

```bash
# 使用 SiLK (System for Internet-Level Knowledge) 分析NetFlow

# 检测周期性Beacon
rwfilter --start-date=2026/09/01 \
         --proto=6 --bytes=40-200 \
         --pass=stdout | rwstats --fields=sip,dip --top

# 检测数据外泄（大流量出站）
rwfilter --start-date=2026/09/01 \
         --bytes=1000000000- --pass=stdout | rwstats

# 使用 elastiflow (NetFlow→Elasticsearch)
# 自动检测：长连接/周期性连接/异常大流量/扫描行为
```

---

## 五、Checklist

- [ ] Zeek 部署+核心协议日志
- [ ] Suricata IPS规则集更新+调优
- [ ] NetFlow/sFlow 采集+ElastiFlow分析
- [ ] NDR告警与SIEM联动
- [ ] 流量基线建立(正常状态建模)
