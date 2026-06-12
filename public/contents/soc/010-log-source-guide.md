# 安全日志源全接入指南：50+ 日志源配置模板

---

## 一、日志源优先级矩阵

```
P0 (必须接入 — 缺则盲区)：
  ✓ 域控/AD — 认证+权限变更
  ✓ 防火墙/IPS — 网络边界
  ✓ EDR/XDR — 端点事件
  ✓ DNS — 威胁检测+隧道发现
  ✓ VPN/ZTNA — 远程访问审计
  ✓ 云审计日志(CloudTrail等)

P1 (强烈推荐)：
  ✓ Web服务器(Nginx/Apache/IIS)
  ✓ 邮件网关(O365/Exchange)
  ✓ DHCP — IP-设备关联
  ✓ 堡垒机 — 运维操作审计
  ✓ 数据库审计 — 数据访问
  ✓ Linux syslog(auth/secure)

P2 (锦上添花)：
  ✓ 文件服务器访问
  ✓ 打印机
  ✓ 应用自定义日志
  ✓ IoT设备
```

---

## 二、网络设备日志接入

```bash
# Cisco IOS
(config)# logging host 192.168.100.10 transport tcp port 514
(config)# logging trap informational
(config)# logging facility local7
(config)# service timestamps log datetime localtime show-timezone

# H3C
info-center loghost 192.168.100.10 port 514
info-center source default loghost level informational

# FortiGate (Syslog TLS推荐)
config log syslogd setting
  set status enable
  set server 192.168.100.10
  set port 6514
  set mode reliable
  set enc-algorithm high
end
```

---

## 三、服务器日志接入

```bash
# Linux Rsyslog
# /etc/rsyslog.d/50-remote.conf
*.* @@192.168.100.10:514       # TCP, 生产推荐
 
# TLS加密传输 (必须!)
$DefaultNetstreamDriver gtls
$ActionSendStreamDriverMode 1
$ActionSendStreamDriverAuthMode x509/name
$DefaultNetstreamDriverCAFile /etc/rsyslog.d/ca.pem
```

```yaml
# Windows → Winlogbeat
winlogbeat.event_logs:
  - name: Security
    level: critical, error, warning, information
  - name: System
  - name: Application
  - name: Microsoft-Windows-Sysmon/Operational
  - name: Microsoft-Windows-PowerShell/Operational

output.elasticsearch:
  hosts: ["https://192.168.100.10:9200"]
  username: "winlogbeat_writer"
  password: "${ES_PASSWORD}"
  ssl.verification_mode: certificate
```

---

## 四、安全设备日志接入

```bash
# 防火墙 Syslog → SIEM（通用配置）
# FortiGate/PaloAlto/CheckPoint → 均支持标准Syslog
# WAF (ModSecurity)
SecAuditEngine RelevantOnly
SecAuditLogType Concurrent
SecAuditLog "|/usr/bin/logger -t modsec -p local5.info"

# Suricata IDS → eve.json → Filebeat
# /etc/suricata/suricata.yaml
outputs:
  - eve-log:
      enabled: yes
      filetype: regular
      filename: eve.json
      types:
        - alert
        - http
        - dns
        - tls
        - flow
```

---

## 五、云服务日志接入

```bash
# AWS CloudTrail → S3 → SIEM
aws cloudtrail create-trail \
  --name soc-trail \
  --s3-bucket-name soc-logs-bucket \
  --enable-log-file-validation \
  --is-multi-region-trail

# AWS CloudWatch Logs → Lambda → SIEM
# 将 CloudWatch Logs 通过 Lambda 转发到 SIEM

# Azure 诊断设置
# Azure Portal → 资源 → 诊断设置 → 
# 发送到 Log Analytics Workspace / Event Hub
```

---

## 六、日志质量度量

```
日志质量三维指标：

完整性（是否少采了）：
  ✦ 资产覆盖率：已采集日志的资产/总资产 > 95%
  ✦ 数据类型覆盖率：已接入的日志类型/应接入 > 90%

准确性（是否采对了）：
  ✦ 时间准确率：NTP同步率 > 99%
  ✦ 字段解析率：成功解析的日志/总日志 > 95%
  ✦ 字段完整率：预期字段有值的比例

时效性（是否及时）：
  ✦ 延迟：事件发生→SIEM可见 < 60秒
  ✦ 丢失率：< 0.5%（网络/存储不可靠导致）
  ✦ 积压：消息队列积压 < 1000条
```
