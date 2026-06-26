# 第六章 防火墙与WAF安全配置

## 6.1 防火墙安全概述

防火墙是网络安全的第一道防线，负责在不同安全区域之间进行访问控制。WAF（Web应用防火墙）则专门保护Web应用免受应用层攻击。

### 6.1.1 防火墙的分类与部署

**防火墙分类：**
```
按技术分类：
├── 包过滤防火墙（Packet Filtering）
│   └── 基于IP/端口/协议，速度快，功能简单
├── 状态检测防火墙（Stateful Inspection）
│   └── 维护会话状态，主流技术
├── 应用层网关/代理防火墙（Proxy）
│   └── 代理连接，安全性高，性能损耗大
└── 下一代防火墙（NGFW）
    ├── 集成IPS、应用识别、用户识别
    ├── 深度包检测（DPI）
    └── 威胁情报联动

按形态分类：
├── 硬件防火墙：性能高，独立设备
├── 软件防火墙：主机层面，灵活
└── 云防火墙：云原生，弹性伸缩
```

**典型部署架构：**
```
     Internet
        │
    ┌───▼───┐
    │边界防火墙│ ← 南北向流量过滤
    └───┬───┘
        │
    ┌───▼───┐
    │ DMZ区  │ ← Web服务器、邮件服务器
    └───┬───┘
        │
    ┌───▼───┐
    │内网防火墙│ ← 东西向流量控制
    └───┬───┘
        │
    ┌───▼───┐
    │ 核心区  │ ← 数据库、核心业务
    └───────┘
```

### 6.1.2 防火墙安全原则

1. **默认拒绝原则**：默认拒绝所有，只放行必要的
2. **最小权限原则**：只开放必须的端口和服务
3. **纵深防御原则**：多层防护，不依赖单一设备
4. **白名单优先**：能用白名单就不用黑名单
5. **可审计原则**：所有规则变更有记录、有审批
6. **定期清理原则**：定期审查规则，清理过期无用规则

## 6.2 防火墙基础配置

### 6.2.1 安全区域划分

**华为USG防火墙配置示例：**
```
# 安全区域配置
firewall zone trust
 set priority 85
 add interface GigabitEthernet0/0/1
quit

firewall zone untrust
 set priority 5
 add interface GigabitEthernet0/0/0
quit

firewall zone dmz
 set priority 50
 add interface GigabitEthernet0/0/2
quit

# 查看安全区域
display firewall zone
```

** Palo Alto 防火墙安全区域：**
```
# 配置安全区域
set zone network trust layer3
set zone network untrust layer3
set zone network dmz layer3

# 接口加入区域
set network interface ethernet1/1 layer3 zone trust
set network interface ethernet1/2 layer3 zone untrust
set network interface ethernet1/3 layer3 zone dmz
```

### 6.2.2 安全策略配置

**华为USG安全策略：**
```
# 安全策略默认动作（拒绝所有）
firewall default packet-filter deny

# 地址对象配置
ip address-set Trust_Net type object
 address 10.1.1.0 mask 24
quit

ip address-set DMZ_Web type object
 address 172.16.1.10 mask 32
quit

ip address-set Any_Internet type object
 address 0.0.0.0 mask 0
quit

# 服务对象配置
ip service-set Web_Service type object
 service protocol tcp source-port 0-65535 destination-port 80
 service protocol tcp source-port 0-65535 destination-port 443
quit

ip service-set SSH_Service type object
 service protocol tcp source-port 0-65535 destination-port 22
quit

# 安全策略配置
security-policy
 rule name Allow_Trust_to_DMZ_Web
  source-zone trust
  destination-zone dmz
  source-address address-set Trust_Net
  destination-address address-set DMZ_Web
  service address-set Web_Service
  action permit
  description "允许内网访问DMZ Web服务器"

 rule name Allow_Untrust_to_DMZ_Web
  source-zone untrust
  destination-zone dmz
  source-address address-set Any_Internet
  destination-address address-set DMZ_Web
  service address-set Web_Service
  action permit
  description "允许公网访问DMZ Web服务"

 rule name Allow_Trust_Internet_HTTP
  source-zone trust
  destination-zone untrust
  source-address address-set Trust_Net
  destination-address address-set Any_Internet
  service protocol tcp destination-port 80
  service protocol tcp destination-port 443
  service protocol udp destination-port 53
  action permit
  description "允许内网访问互联网HTTP/HTTPS/DNS"

 rule name Deny_All
  source-zone any
  destination-zone any
  source-address any
  destination-address any
  service any
  action deny
  description "默认拒绝所有"
quit
```

**Palo Alto 安全策略：**
```
# 地址对象
set address Trust_Net 10.1.1.0/24
set address DMZ_Web 172.16.1.10/32

# 服务对象
set service HTTP protocol tcp port 80
set service HTTPS protocol tcp port 443

# 安全策略
set rulebase security rules "Allow Trust to DMZ Web" \
    from trust to dmz \
    source Trust_Net \
    destination DMZ_Web \
    application [ http https ssl ] \
    service application-default \
    action allow \
    log-end yes

set rulebase security rules "Default Deny" \
    from any to any \
    source any destination any \
    application any \
    service any \
    action deny \
    log-end yes
```

### 6.2.3 NAT配置

**源NAT（SNAT）- 内网访问互联网：**
```
# 华为USG配置PAT
nat-policy
 rule name SNAT_Trust_Internet
  source-zone trust
  destination-zone untrust
  source-address address-set Trust_Net
  action source-nat easy-ip
  description "内网访问互联网源NAT"
quit
```

**目的NAT（DNAT）- 公网访问内网服务：**
```
# 华为USG配置目的NAT
nat server Web_Server protocol tcp global 202.100.1.1 www inside 172.16.1.10 www
nat server Web_Server_SSL protocol tcp global 202.100.1.1 443 inside 172.16.1.10 443

# Palo Alto 目的NAT
set rulebase nat rules "DNAT Web" \
    from untrust to untrust \
    destination 202.100.1.1 \
    service [ http https ] \
    translate-to "destination-translation" translated-address DMZ_Web \
    type static-ip
```

## 6.3 防火墙高级安全功能

### 6.3.1 入侵防御系统（IPS）

```
# 华为USG IPS配置
# 启用IPS
ips enable

# IPS配置文件
ips profile name IPS_Protect
 signature-set name High_Attack
  severity high
  action block
 signature-set name Medium_Alert
  severity medium
  action alert
quit

# 在安全策略中调用IPS
security-policy
 rule name Allow_Untrust_to_DMZ_Web
  ips profile IPS_Protect
quit
```

**Palo Alto 威胁防护：**
```
# 威胁防护配置文件
set profiles vulnerability "Strict_Protection" \
    severity critical action block-ip \
    severity high action block-ip \
    severity medium action reset-both \
    severity low action alert \
    severity informational action alert

# 在安全策略中调用
set rulebase security rules "Web Policy" \
    profile-setting vulnerability "Strict_Protection" \
    profile-setting spyware "Strict_Protection" \
    profile-setting virus "Strict_Protection"
```

### 6.3.2 应用控制

```
#  Palo Alto 应用过滤
set profiles app-filter "Block High Risk Apps"
set profiles app-filter "Block High Risk Apps" category [ "peer-to-peer" "games" "social-networking" ] risk [ 4 5 ] action deny

# 安全策略中引用
set rulebase security rules "Block High Risk Apps" \
    from trust to untrust \
    source any destination any \
    application any \
    service application-default \
    action deny \
    application-filter "Block High Risk Apps"
```

### 6.3.3 URL过滤

```
# 华为USG URL过滤配置
url-filter enable

url-filter category Pre-defined
 category "Social Networking" action block
 category "Gambling" action block
 category "Malware" action block
 category "Phishing" action block
quit

# Palo Alto URL过滤
set profiles url-filtering "URL_Filter" \
    site-access [ social-networking gambling malware phishing ] action block

# 自定义URL类别
set profiles custom-url-category "Blocked_Sites"
set profiles custom-url-category "Blocked_Sites" list [ *.example.com *.test.com ]
```

### 6.3.4 防病毒

```
# 华为USG 防病毒配置
av-profile default
 protocol http action block
 protocol https action block
 protocol ftp action block
 protocol smtp action block
quit

# 安全策略中调用
security-policy
 rule name Allow_Untrust_to_DMZ_Web
  av-profile default
quit
```

## 6.4 防火墙管理安全

### 6.4.1 管理安全配置

```
# 管理接口安全
# 1. 使用带外管理接口管理
# 2. 限制管理IP地址

# 华为USG管理ACL
acl number 2000
 rule permit source 10.1.1.0 0.0.0.255
 rule permit source 10.1.100.0 0.0.0.255
 rule deny source any
quit

# 应用到管理接口
interface GigabitEthernet0/0/0
 service-manage enable
 service-manage http permit
 service-manage https permit
 service-manage ssh permit
quit

# 或全局管理过滤
ssh server acl 2000
http acl 2000
https acl 2000
```

### 6.4.2 日志与审计

```
# 日志配置
info-center enable
info-center loghost 10.1.1.200 facility local7
info-center source default channel 2 log level informational

# 安全策略日志
security-policy
 rule name Allow_Trust_Internet_HTTP
  log session-end
quit

# 日志服务器配置（Syslog）
# 确保所有管理操作、安全策略匹配、威胁检测都有日志
```

### 6.4.3 配置备份与变更管理

```
# 定期备份配置
# 华为USG自动备份
schedule backup configuration ftp server 10.1.1.200 username backup password cipher password

# 变更审批流程
# 1. 提交变更申请
# 2. 安全审核
# 3. 测试环境验证
# 4. 生产环境变更
# 5. 验证与记录
```

## 6.5 WAF安全配置

### 6.5.1 WAF概述

Web应用防火墙（Web Application Firewall）专门保护Web应用，防护OWASP Top 10等应用层攻击：

```
WAF防护范围：
├── SQL注入攻击
├── XSS跨站脚本攻击
├── CSRF跨站请求伪造
├── 命令注入
├── 文件包含漏洞
├── 文件上传漏洞
├── 目录遍历
├── CC攻击/HTTP Flood
├── 爬虫/自动化扫描
└── 敏感信息泄露
```

**WAF部署模式：**
```
部署模式：
├── 透明网桥模式
│   └── 透明部署，不改变网络拓扑
├── 反向代理模式
│   └── 流量经过WAF代理转发
└── 旁路镜像模式
    └── 只检测不阻断，用于监控审计
```

### 6.5.2 WAF基础配置

**ModSecurity（开源WAF）+ Nginx 配置：**
```nginx
# 安装ModSecurity
# Ubuntu/Debian
# apt install libmodsecurity3 modsecurity-crs nginx-modsecurity

# 启用ModSecurity
modsecurity on;
modsecurity_rules_file /etc/nginx/modsec/main.conf;

# main.conf 配置
Include /usr/share/modsecurity-crs/crs-setup.conf
Include /usr/share/modsecurity-crs/rules/*.conf

# 站点配置
server {
    listen 443 ssl;
    server_name www.example.com;
    root /var/www/html;

    # WAF规则引擎
    modsecurity on;
    modsecurity_rules_file /etc/nginx/modsec/site.conf;

    # 自定义规则
    modsecurity_rules '
        SecRuleEngine On
        SecRequestBodyAccess On
        SecResponseBodyAccess On
        SecAuditEngine RelevantOnly
        SecAuditLog /var/log/nginx/modsec_audit.log
        SecDebugLog /var/log/nginx/modsec_debug.log
        SecDebugLogLevel 0
    ';

    location / {
        try_files $uri $uri/ =404;
    }
}
```

**WAF核心规则集（CRS）配置：**
```
# /etc/modsecurity/crs/crs-setup.conf

# 执行模式：DetectionOnly=只检测, On=拦截
SecAction "id:900000,\
    phase:1,\
    nolog,\
    pass,\
    t:none,\
    setvar:tx.paranoia_level=2"

# 异常评分阈值
SecAction "id:900100,\
    phase:1,\
    nolog,\
    pass,\
    t:none,\
    setvar:tx.critical_anomaly_score=5,\
    setvar:tx.error_anomaly_score=4,\
    setvar:tx.warning_anomaly_score=3,\
    setvar:tx.notice_anomaly_score=2"

# 支持的HTTP方法
SecAction "id:900200,\
    phase:1,\
    nolog,\
    pass,\
    t:none,\
    setvar:'tx.allowed_methods=GET HEAD POST OPTIONS PUT DELETE PATCH'"

# 允许的内容类型
SecAction "id:900300,\
    phase:1,\
    nolog,\
    pass,\
    t:none,\
    setvar:'tx.allowed_request_content_type=application/x-www-form-urlencoded|multipart/form-data|text/xml|application/xml|application/x-amf|application/json|application/octet-stream|application/csp-report|application/xss-auditor-report|text/plain'"
```

### 6.5.3 WAF防护规则

**SQL注入防护规则示例：**
```
# ModSecurity SQL注入检测规则
SecRule ARGS "@rx (?i:(?:(?:s(?:t(?:d(?:dev(_pop|_samp)?)?|r(?:_to_date|cmp))|u(?:b(?:str(_index)?|string_index)|m(_timestamp|d))|e(?:c(?:_to_time|ond)|ssion_user|t)|c(?:o(?:n(?:v(ert_)?|cat(_ws)?|nection_id)|(?:mp|lumn)_name)|h(?:ar_length|ar_set)|e(?:il|ll))|y(?:ear(?:week)?|md)|q(?:uo|rt)e?)|b(?:in(?:ary)?|enchmark|etween|lue)|l(?:i(?:mit|ke)|pad|trim|ocate|ower)|r(?:e(?:g(?:exp|replace)|p(?:lace|eat)|verse)|ound|pad|trim)|i(?:n(?:sert|str|terval|str)|f(?:null)?|snull)|d(?:a(?:te(?:_add|_sub|_format|_diff)?|tabase)|esc|istinct|iv)|u(?:p(?:datexml|er)?|n(?:ix_timestamp|ion)|case)|m(?:i(?:n|d)|a(?:ster|x|ke_set)|d5)|o(?:c(?:t|urrent_date)|racle|ld_password)|n(?:ull|ame_const|ow)|p(?:ower|assword|osition)|a(?:scii|vg|ddtime)|t(?:r(?:im|uncate)|o(?:_days|base64)|imestampdiff)|w(?:eek|here)|f(?:ield|ind_in_set)|h(?:ex|aving)|g(?:roup_concat|et_lock)|v(?:ersion|ar)|lo(?:ad_file|cate)|ex(?:tractvalue|p)|sl(?:eep|ow))\s*\()" \
    "id:942100,\
    phase:2,\
    block,\
    msg:'SQL Injection Attack',\
    severity:CRITICAL,\
    logdata:'Matched Data: %{MATCHED_VAR_NAME} found within %{MATCHED_VAR}',\
    tag:'application-multi',\
    tag:'language-multi',\
    tag:'platform-multi',\
    tag:'attack-sqli',\
    t:none,t:utf8toUnicode,t:urlDecodeUni,t:htmlEntityDecode,t:jsDecode,t:cssDecode,t:removeNulls,\
    setvar:tx.sql_injection_score=+%{tx.critical_anomaly_score},\
    setvar:tx.anomaly_score=+%{tx.critical_anomaly_score},\
    setvar:tx.%{rule.id}-WEB_ATTACK/SQLI-%{matched_var_name}=%{matched_var}"
```

**XSS防护规则示例：**
```
# XSS检测基础规则
SecRule ARGS "@rx <[^\w<>]*(?:[^<>\"'\s]*:)?[^\w<>]*(?:\W*?s\W*?c\W*?r\W*?i\W*?p\W*?t|on\w+\s*=|style\s*=|data\s*:)" \
    "id:941110,\
    phase:2,\
    block,\
    msg:'XSS Attack Detected via script tag',\
    severity:CRITICAL,\
    tag:'application-multi',\
    tag:'language-multi',\
    tag:'platform-multi',\
    tag:'attack-xss',\
    t:none,t:utf8toUnicode,t:urlDecodeUni,t:htmlEntityDecode,t:jsDecode,t:cssDecode,t:lowercase,\
    setvar:tx.xss_score=+%{tx.critical_anomaly_score},\
    setvar:tx.anomaly_score=+%{tx.critical_anomaly_score}"
```

### 6.5.4 CC攻击防护

```nginx
# Nginx 限流配置
# 连接数限制
limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

# 请求频率限制
limit_req_zone $binary_remote_addr zone=req_limit:10m rate=10r/s;

# 带宽限制
limit_rate 500k;

server {
    # 连接限制
    limit_conn conn_limit 10;
    
    # 请求频率限制（突发100，超过延迟处理）
    limit_req zone=req_limit burst=100 nodelay;
    
    # 针对特定页面更严格的限制
    location /login {
        limit_req zone=req_limit burst=5 nodelay;
        limit_conn conn_limit 2;
    }
    
    # 针对API的限流
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
    }
}
```

**ModSecurity CC防护：**
```
# IP频率限制
SecRule IP:REQ_COUNT "@gt 60" \
    "id:1001,\
    phase:1,\
    deny,\
    status:429,\
    msg:'Rate limit exceeded',\
    setvar:ip.req_count=+1,\
    expirevar:ip.req_count=60"

# 基于User-Agent的异常访问检测
SecRule REQUEST_HEADERS:User-Agent "^$" \
    "id:1002,\
    phase:1,\
    deny,\
    status:403,\
    msg:'Empty User-Agent blocked'"

# 爬虫检测与限制
SecRule REQUEST_HEADERS:User-Agent "@pmFromFile crawlers.txt" \
    "id:1003,\
    phase:1,\
    pass,\
    setvar:ip.crawler=1"
```

### 6.5.5 白名单与误报处理

```
# WAF白名单配置

# 1. IP白名单（信任的IP跳过检测）
SecRule REMOTE_ADDR "@ipMatch 192.168.1.0/24,10.0.0.100" \
    "id:100001,\
    phase:1,\
    pass,\
    nolog,\
    ctl:ruleEngine=DetectionOnly"

# 2. URL白名单（特定路径跳过检测）
SecRule REQUEST_URI "@streq /api/health" \
    "id:100002,\
    phase:1,\
    pass,\
    nolog,\
    ctl:ruleRemoveById=942100"

# 3. 参数白名单（特定参数跳过某类检测）
SecRule ARGS:content "@rx .*" \
    "id:100003,\
    phase:2,\
    pass,\
    nolog,\
    ctl:ruleRemoveTargetById=941110;ARGS:content"

# 4. 移除特定规则（误报太多的规则）
SecRuleRemoveById 942100 941110
```

## 6.6 防火墙规则优化

### 6.6.1 规则优化原则

```
防火墙规则优化原则：

1. 规则顺序优化
   ├── 高命中规则放前面
   ├── 拒绝规则放前面
   └── 最具体的规则放前面

2. 规则合并
   ├── 相同源/目的的规则合并
   ├── 相同服务的规则合并
   └── 使用地址组/服务组

3. 清理无效规则
   ├── 删除命中数为0的规则
   ├── 删除过期的规则
   ├── 合并冗余规则
   └── 修正过宽的规则

4. 性能优化
   ├── 减少规则数量
   ├── 使用对象组
   ├── 合理利用硬件加速
   └── 避免日志过多
```

### 6.6.2 规则审计

```
# 定期审计清单

每月审计：
- 查看所有规则的命中数
- 标记命中数为0的规则
- 检查规则注释是否完整
- 验证规则是否仍在有效期

每季度审计：
- 逐条审查所有规则
- 删除确认无用的规则
- 合并相似规则
- 调整规则顺序
- 检查权限变更

每年审计：
- 全面的规则梳理
- 安全策略重新评估
- 与业务方确认需求
- 生成审计报告
```

## 6.7 加固检查清单

```
防火墙与WAF加固检查清单：

□ 防火墙基础安全
  □ 默认拒绝策略已配置
  □ 安全区域划分合理
  □ 管理接口独立/带外管理
  □ 管理访问有IP白名单
  □ 强密码+多因素认证
  □ 固件版本为最新稳定版
  □ 无用接口已关闭
  □ SNMPv3已配置

□ 安全策略
  □ 遵循最小权限原则
  □ 所有规则有明确注释
  □ 规则按优先级排序
  □ 定期清理无用规则
  □ 有规则变更审批流程
  □ 有规则命中统计

□ 高级防护
  □ IPS入侵防御已启用
  □ 防病毒已启用
  □ 应用控制已配置
  □ URL过滤已配置
  □ 威胁情报已对接

□ WAF安全
  □ WAF部署在Web应用前面
  □ 规则引擎启用拦截模式
  □ OWASP Top 10防护已覆盖
  □ CC攻击防护已配置
  □ 爬虫防护已启用
  □ 规则定期更新
  □ 误报已处理优化

□ 日志与监控
  □ 所有管理操作有日志
  □ 安全策略命中有日志
  □ 威胁检测有告警
  □ 日志集中存储
  □ 定期日志审计
  □ 配置定期备份
```

## 6.8 本章小结

本章详细介绍了防火墙与WAF的安全配置：

1. **防火墙基础**：安全区域、安全策略、NAT配置
2. **高级功能**：IPS入侵防御、应用控制、URL过滤、防病毒
3. **管理安全**：管理接口安全、日志审计、变更管理
4. **WAF配置**：ModSecurity规则、OWASP Top 10防护
5. **CC防护**：限流配置、频率限制、爬虫防护
6. **规则优化**：优化原则、定期审计、清理维护

下一章将学习Web服务器安全加固。

---

**实战作业：**
1. 部署ModSecurity+OWASP CRS，测试防护效果
2. 编写一个针对SQL注入的自定义WAF规则
3. 对你管理的防火墙规则做一次全面审计
