# DAY 28 · 绿盟WAF Web应用防火墙

> **绿盟科技** | WAF = Web Application Firewall | 三种部署模式全覆盖
> 学习时长：约3-4小时 | 难度：中级 | 实战环境：Docker + Nginx + ModSecurity

---

## 一、开篇概述：为什么传统防火墙挡不住Web攻击？

### 1.1 用大楼安保比喻理解

想象一栋办公大楼的安保体系：

```
传统防火墙（网络防火墙）= 大楼门禁系统
├── 检查进入大楼的人（IP地址）
├── 检查去哪个楼层（端口号）
├── 但不检查具体做什么（应用层内容）
└── 规则："8楼只有财务部员工能去"

WAF（Web应用防火墙）= 每个房间门口的安检员
├── 检查你带进房间的每件东西（HTTP请求内容）
├── 检查你填写的表格（POST参数）
├── 检查你带的"包裹"是否有问题（恶意payload）
└── 规则："表格里不能包含SQL语句"
```

**核心区别：** 网络防火墙看的是"谁、去哪"，WAF看的是"做什么、带了什么"。

### 1.2 为什么需要WAF？

```sql
-- 这段SQL注入能穿过网络防火墙吗？
GET /products?id=1 UNION SELECT username,password FROM users HTTP/1.1
Host: shop.example.com

-- 网络防火墙看到的：
-- 来源IP: 1.2.3.4 → 目标IP: 5.6.7.8 → 目标端口: 443 (HTTPS)
-- 判断：合法！放行！

-- WAF看到的：
-- URL参数里有 "UNION SELECT username,password FROM users"
-- 判断：这是SQL注入攻击！拦截！
```

**结论：** 传统防火墙工作在OSI第3-4层（IP+端口），而Web攻击发生在第7层（HTTP协议内容）。必须要有第7层的防护设备——这就是WAF。

### 1.3 一组关于Web安全的数据

| 数据 | 来源 |
|------|------|
| 75%的网络攻击目标为Web应用 | Gartner |
| OWASP Top 10中注入攻击连续多年排名第一 | OWASP |
| 平均每个Web应用有22个漏洞 | Veracode |
| WAF可阻止90%以上的自动化Web攻击 | Forrester |
| 数据泄露平均成本435万美元 | IBM/Ponemon |

### 1.4 今日学习地图

```
WAF基础概念 ──→ 三种部署模式详解 ──→ WAF+NIPS联动
      │                │                    │
      ├─ OWASP Top 10  ├─ 反向代理模式       ├─ 纵深防御概念
      ├─ WAF检测技术   ├─ 透明代理模式       ├─ WAF负责Web层
      ├─ 正/负向模型   ├─ 旁路检测模式       └─ NIPS负责网络层
      └─ WAF局限       └─ 模式对比选型
                              │
                        厂商对比：
                  绿盟WAF vs 长亭雷池 vs 安恒明御
                              │
                        实操实验：
                  Docker部署ModSecurity+Nginx
                  编写自定义WAF规则
```

---

## 二、WAF核心技术深度解析

### 2.1 WAF检测技术栈

```
WAF引擎 = 多种检测技术的组合

第一层：协议合规检查
├── HTTP协议格式是否合法
├── 请求方法是否允许（GET/POST/HEAD...）
├── Content-Type与内容是否匹配
├── URL/Header长度是否超限
└── 字符编码是否合法

第二层：特征匹配（黑名单/负向模型）
├── SQL注入特征：union select, ' or 1=1, drop table
├── XSS特征：<script>, javascript:, onerror=
├── 命令注入：; cat /etc/passwd, | whoami
├── 路径遍历：../../../etc/passwd
├── 文件包含：?file=php://input
└── SSRF特征：?url=http://169.254.169.254

第三层：行为分析（白名单/正向模型）
├── URL白名单：只允许访问已定义的API
├── 参数白名单：每个参数只接受特定类型
├── 速率控制：单IP访问频率限制
├── 会话跟踪：用户行为序列分析
└── 异常检测：偏离正常行为模式

第四层：语义分析
├── SQL语法分析：检测是否是真实SQL注入
├── JS语法分析：检测XSS payload能否执行
├── 编码解码：递归解码URL编码/Base64/Hex
└── 上下文感知：理解参数在HTML/JS/SQL中的位置
```

### 2.2 正向模型 vs 负向模型

这是理解WAF的核心理念：

```
负向模型（黑名单）：
  "我知道什么是坏的，拒绝所有坏的"
  
  优点：部署简单，通用性强
  缺点：无法防御未知攻击（0-day），需要持续更新规则
  
  类比：机场安检禁止携带刀具、液体、打火机...
        但如果有新型危险品不在列表里呢？

正向模型（白名单）：
  "我只允许已知的好的请求，其他全部拒绝"
  
  优点：可以防御未知攻击，误报可控
  缺点：部署复杂，需要学习业务，业务变更需要更新模型
  
  类比：只有持工作证的人才能进入办公区
        没证件的一律不让进
```

**实际WAF的混合策略：**

```
最佳实践：正向+负向混合

┌────────────────────────────────────────────┐
│              HTTP请求到达                    │
└──────────────────┬─────────────────────────┘
                   ▼
         ┌─────────────────┐
         │ ① 正向模型先过滤  │ ← 先做白名单检查
         │  "只允许这些URL"  │    不符合白名单的直接拒绝
         └────────┬────────┘
                  │ 通过白名单
                  ▼
         ┌─────────────────┐
         │ ② 负向模型再检测  │ ← 再做黑名单检查
         │  "检查已知攻击"   │    匹配黑名单的拒绝
         └────────┬────────┘
                  │ 通过黑名单
                  ▼
         ┌─────────────────┐
         │ ③ 行为分析       │ ← 最后做行为检测
         │  "频率/模式异常？"│    异常行为触发验证码
         └────────┬────────┘
                  │ 全部通过
                  ▼
              放行到后端
```

### 2.3 常见Web攻击与WAF防御

#### SQL注入防御

```
攻击请求：
GET /user?id=1' OR '1'='1 HTTP/1.1

WAF检测：
1. 参数id的值包含单引号(') → 可疑
2. 包含 "OR" 关键字 → 高度可疑
3. 包含 "'1'='1'" SQL恒真条件 → 确认攻击
4. 动作：拦截！返回403

日志记录：
[ALERT] SQL Injection attempt from 192.168.1.100
  Parameter: id
  Payload: 1' OR '1'='1
  Rule: SQL Injection - Tautology Detection (ID: 950901)
  Action: Blocked
```

#### XSS防御

```
攻击请求：
GET /search?q=<script>alert(document.cookie)</script> HTTP/1.1

WAF检测：
1. 参数q包含 <script> 标签 → XSS特征
2. 包含 alert(document.cookie) → 窃取Cookie
3. 确认攻击
4. 动作：拦截！返回403
```

#### 命令注入防御

```
攻击请求：
POST /ping HTTP/1.1
Content-Type: application/x-www-form-urlencoded

host=127.0.0.1; cat /etc/passwd

WAF检测：
1. host参数包含分号(;) → 命令分隔符
2. 包含 "cat /etc/passwd" → 文件读取命令
3. 确认攻击
4. 动作：拦截！
```

### 2.4 WAF的局限性

**WAF不是万能药：**

```
WAF的盲区：
├── 加密流量：HTTPS加密后WAF无法检测内容
│   └── 解决：WAF做SSL终结（解密→检测→重新加密）
│
├── 业务逻辑漏洞：WAF无法理解业务逻辑
│   例：商品价格=-100元 → WAF看不出问题
│   └── 解决：需要业务层面的校验
│
├── 0-day攻击：规则库没有的新攻击手法
│   └── 解决：正向模型+行为分析+AI
│
├── 编码绕过：攻击者使用各种编码绕过检测
│   例：<script> → %3Cscript%3E → \x3Cscript\x3E
│   └── 解决：递归解码+归一化
│
└── 性能开销：WAF检测会增加延迟
    └── 解决：硬件加速+规则优化+分级检测
```

---

## 三、绿盟WAF三种部署模式详解

### 3.1 模式一：反向代理模式

```
用户浏览器                  绿盟WAF(反向代理)              后端Web服务器
┌──────────┐              ┌──────────────────┐            ┌──────────┐
│          │   HTTPS      │  VIP: 1.2.3.4    │   HTTP     │          │
│  客户端   │ ───────────→ │  解密→检测→重加密  │ ─────────→ │ Web服务器 │
│          │ ←─────────── │  (SSL终结)        │ ←───────── │ 10.0.0.5 │
└──────────┘              └──────────────────┘            └──────────┘

工作原理：
1. DNS将域名解析到WAF的VIP
2. 用户以为在和Web服务器通信，实际在和WAF通信
3. WAF解密HTTPS，检测请求内容
4. 检测通过的请求转发给后端Web服务器（可以是HTTP）
5. 后端响应返回给WAF，WAF再加密发送给用户

配置示例（Nginx反向代理 + WAF）：
```

```nginx
# /etc/nginx/sites-available/webapp.conf
# 绿盟WAF反向代理模式配置示意

upstream backend_servers {
    # 后端真实Web服务器
    server 10.0.0.5:8080 weight=1 max_fails=3 fail_timeout=30s;
    server 10.0.0.6:8080 weight=1 max_fails=3 fail_timeout=30s;
    # 健康检查
    keepalive 32;
}

server {
    listen 443 ssl http2;
    server_name www.example.com;

    # SSL证书配置（WAF持有证书）
    ssl_certificate     /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 启用WAF模块
    modsecurity on;
    modsecurity_rules_file /etc/nginx/modsecurity/main.conf;

    location / {
        # 请求转发到后端
        proxy_pass http://backend_servers;
        
        # 传递原始客户端信息
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时配置
        proxy_connect_timeout 10s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # 缓冲配置
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }
    
    # 健康检查端点（不经过WAF检测）
    location /health {
        modsecurity off;
        proxy_pass http://backend_servers;
    }
}
```

**反向代理模式总结：**

| 维度 | 评价 |
|------|------|
| 部署难度 | 中等（需修改DNS指向） |
| 防护效果 | 最佳（所有流量必经WAF） |
| SSL处理 | WAF终结SSL，可检测加密流量 |
| 性能影响 | 有（SSL加解密+WAF检测） |
| 网络改动 | 需要（DNS指向WAF） |
| 适用场景 | 绝大多数Web应用场景 |

### 3.2 模式二：透明代理模式

```
用户浏览器                  绿盟WAF(透明代理)              后端Web服务器
┌──────────┐              ┌──────────────────┐            ┌──────────┐
│          │              │  二层透明转发     │            │          │
│  客户端   │ ───────────→ │  检测→放行/阻断   │ ─────────→ │ Web服务器 │
│          │ ←─────────── │  (不修改IP/MAC)   │ ←───────── │          │
└──────────┘              └──────────────────┘            └──────────┘

工作原理：
1. WAF串联在网络路径上，像一个"透明桥"
2. 用户以为直接和Web服务器通信（IP不变）
3. WAF在二层透明转发，三层以上检测内容
4. 不需要修改DNS或网络配置
5. 不需要持有SSL证书（直接透传）

配置要点：
- WAF配置为桥接模式（Bridge Mode）
- 网络接口设置为混杂模式
- 配置端口镜像或物理串联
```

**透明代理模式总结：**

| 维度 | 评价 |
|------|------|
| 部署难度 | 低（物理串联即可，不需改DNS） |
| 防护效果 | 好（所有流量经过，但无法检测加密流量） |
| SSL处理 | 不终结SSL，无法检测加密攻击 |
| 性能影响 | 低（无SSL加解密开销） |
| 网络改动 | 需要物理线路调整 |
| 适用场景 | 内网Web应用、不需要解密HTTPS的场景 |

### 3.3 模式三：旁路检测模式

```
用户浏览器                                             后端Web服务器
┌──────────┐              ┌──────────────────┐         ┌──────────┐
│          │  正常流量    │                  │         │          │
│  客户端   │ ────────────────────────────────────────→ │ Web服务器 │
│          │              │   端口镜像/分光    │         │          │
└──────────┘              │       ↓           │         └──────────┘
                          │   绿盟WAF(旁路)   │
                          │   检测但不阻断     │
                          │   告警+日志       │
                          └──────────────────┘

工作原理：
1. 交换机将流量镜像一份给WAF
2. WAF分析镜像流量，检测攻击
3. 发现攻击 → 仅告警，不阻断（因为不在主路径上）
4. 如果联动：WAF告警 → 通知防火墙/IPS → 防火墙阻断

旁路检测 + TCP Reset阻断：
1. WAF检测到攻击
2. WAF伪造TCP RST包发送给客户端和服务器
3. 连接被强制断开
4. 效果有限（RST包可能到达太晚）
```

**旁路检测模式总结：**

| 维度 | 评价 |
|------|------|
| 部署难度 | 最低（只需端口镜像） |
| 防护效果 | 弱（仅检测告警，不主动阻断） |
| 性能影响 | 无（不在主路径上） |
| 单点故障 | 无（旁路不影响业务） |
| 适用场景 | 监控审计、无法串行部署的场景、初期评估 |

### 3.4 三种部署模式对比总结

| 维度 | 反向代理 | 透明代理 | 旁路检测 |
|------|---------|---------|---------|
| 部署难度 | ★★★ | ★★ | ★ |
| 防护效果 | ★★★★★ | ★★★★ | ★★ |
| SSL检测 | 支持 | 不支持 | 不支持 |
| 性能影响 | 中 | 低 | 无 |
| 单点故障 | 有(需HA) | 有(需Bypass) | 无 |
| 网络改动 | DNS指向 | 物理串联 | 端口镜像 |
| 阻断能力 | 实时阻断 | 实时阻断 | 仅告警 |
| 最佳场景 | 互联网Web应用 | 内网Web应用 | 监控/审计 |

### 3.5 高可用方案

```
反向代理模式HA：

            ┌──────────┐
            │   LVS/   │ ← 四层负载均衡（主备）
            │ Keepalived│
            └────┬─────┘
                 │
        ┌────────┼────────┐
        ▼                 ▼
   ┌─────────┐       ┌─────────┐
   │ WAF-A   │       │ WAF-B   │  ← WAF主主/主备
   │ Active  │ ←───→ │ Standby │
   └────┬────┘       └────┬────┘
        │                 │
        └────────┬────────┘
                 ▼
          后端Web服务器

透明代理模式HA：
  配置硬件Bypass模块：
  - WAF正常时：流量经过WAF检测
  - WAF故障/断电时：物理继电器闭合，流量直通
  - 类似"短路保护"
```

---

## 四、WAF + NIPS 纵深防御联动

### 4.1 为什么单一设备不够？

```
攻击者的视角：
  "我要攻击这个网站，前面有WAF..."
  "我先扫描一下，看WAF规则有没有盲区..."
  "找到了！WAF没检测这种编码方式..."
  "绕过了！"

但如果后面还有NIPS呢？
  "绕过了WAF，但NIPS发现这个IP的行为模式异常..."
  "NIPS把这个IP加入了黑名单，所有流量都被阻断了..."
  "攻击失败！"
```

### 4.2 WAF和NIPS的分工

```
纵深防御模型：

互联网
  │
  ▼
┌──────────────────────────────────────────────┐
│ 第一层：NIPS (网络层防护)                      │
│ 职责：IP信誉、DDoS防护、端口扫描检测、          │
│       网络协议异常、暴力破解检测                │
│ 如果发现网络层攻击 → 直接阻断                  │
└──────────────────┬───────────────────────────┘
                   │ 通过网络层检查
                   ▼
┌──────────────────────────────────────────────┐
│ 第二层：WAF (应用层防护)                       │
│ 职责：SQL注入、XSS、CSRF、文件上传、           │
│       Web漏洞利用、敏感信息泄露                │
│ 如果发现Web层攻击 → 拦截请求                   │
└──────────────────┬───────────────────────────┘
                   │ 通过应用层检查
                   ▼
              后端Web服务器
```

### 4.3 WAF和NIPS的联动机制

```
场景1：NIPS发现攻击 → 通知WAF加强防护

NIPS检测到某IP正在进行端口扫描和漏洞探测
  → NIPS通过API通知WAF
  → WAF将该IP加入高风险名单
  → WAF对该IP的请求启用更严格的检测规则
  → WAF对该IP启用验证码挑战

场景2：WAF发现攻击 → 通知NIPS进行网络层阻断

WAF检测到某IP持续发送SQL注入payload
  → WAF通过Syslog/API通知NIPS
  → NIPS在IP层直接阻断该IP的所有流量
  → 该IP连TCP连接都无法建立

场景3：联合分析 → 发现高级威胁

NIPS发现异常DNS查询（DGA域名生成算法特征）
WAF发现该IP尝试访问WebShell路径
  → 联动分析：该主机可能已被植入后门
  → 自动隔离该IP
  → 触发应急响应流程
```

### 4.4 联动配置示例（概念模型）

```yaml
# WAF-NIPS联动策略配置（概念示例）
# 绿盟WAF + 绿盟NIPS联动

linkage_policy:
  # 联动通道配置
  channel:
    type: syslog_or_api
    protocol: tcp
    encryption: tls
    heartbeat_interval: 5s

  # NIPS → WAF 联动规则
  nips_to_waf:
    - trigger: port_scan_detected
      action: elevate_ip_risk_level
      params:
        risk_level: high
        duration: 3600  # 1小时
      description: "当NIPS检测到端口扫描，WAF提升该IP风险等级"

    - trigger: brute_force_detected
      action: block_ip_on_waf
      params:
        block_duration: 1800  # 30分钟
      description: "当NIPS检测到暴力破解，WAF直接阻断该IP"

    - trigger: malware_c2_detected
      action: quarantine_ip
      params:
        block_duration: 86400  # 24小时
      description: "当NIPS检测到C&C通信，隔离该IP"

  # WAF → NIPS 联动规则
  waf_to_nips:
    - trigger: sql_injection_repeated
      threshold: 5  # 同一IP 5次SQL注入尝试
      window: 60    # 在60秒内
      action: block_ip_on_nips
      params:
        block_duration: 3600
      description: "WAF发现持续SQL注入，通知NIPS网络层阻断"

    - trigger: webshell_access
      action: block_ip_on_nips_and_alert
      params:
        severity: critical
        notify: security_team
      description: "检测到WebShell访问，立即阻断并告警"
```

---

## 五、绿盟WAF vs 长亭雷池 vs 安恒明御

### 5.1 三款产品定位对比

| 维度 | 绿盟WAF | 长亭雷池(SafeLine) | 安恒明御WAF |
|------|---------|-------------------|------------|
| 公司定位 | 综合安全厂商 | AI+安全创新公司 | 综合安全厂商 |
| WAF产品定位 | 企业级全功能WAF | 语义分析智能WAF | 综合Web安全网关 |
| 核心检测技术 | 规则匹配+行为分析 | 语义分析+机器学习 | 规则匹配+威胁情报 |
| 部署模式 | 三种模式全覆盖 | 反向代理为主 | 反向代理+透明代理 |
| 规则更新 | 定期+紧急更新 | 实时云端更新 | 定期更新 |
| 信创适配 | 全面 | 部分 | 全面 |
| 等保合规 | 完善 | 基础 | 完善 |

### 5.2 核心技术差异

**绿盟WAF核心优势：规则全面**

```
绿盟WAF特点：
├── 20年安全积累，规则库庞大
├── 规则覆盖广：OWASP Top 10全覆盖+中国特有攻击
├── 误报率经过大量客户调优
├── 与绿盟其他产品(ADS/NIPS/RSAS)深度联动
├── 支持等保/分保/密评合规
└── 完善的售后和技术支持体系

适合场景：传统企业、政府、金融、运营商
```

**长亭雷池核心优势：语义更准**

```
雷池(SafeLine)特点：
├── 基于SQL/JS语法解析，而非正则匹配
├── 能理解代码语义：区分真正的注入和正常输入
├── 误报率极低（语义分析的天然优势）
├── 部署简单（Docker一键部署）
├── 开源社区版可用
└── AI驱动的检测模型

适合场景：互联网公司、技术团队、追求低误报
```

**安恒明御WAF核心优势：威胁情报**

```
安恒明御WAF特点：
├── 集成安恒威胁情报平台
├── 云端大数据分析支撑
├── 与AiLPHA大数据平台联动
├── 支持大数据安全分析
└── 深耕政府/公安行业

适合场景：政府、公安、大数据安全场景
```

### 5.3 选型建议决策树

```
是否需要信创/国产化适配？
├── 是 → 绿盟WAF 或 安恒明御
└── 否 → 继续判断

是否需要极低误报率？
├── 是 → 长亭雷池（语义分析天然低误报）
└── 否 → 继续判断

是否需要与其他安全产品联动？
├── 是，已有绿盟产品 → 绿盟WAF（生态联动）
├── 是，已有安恒产品 → 安恒明御（生态联动）
└── 否 → 继续判断

预算情况？
├── 充足 → 绿盟WAF（功能最全面）
├── 中等 → 长亭雷池（性价比高）
└── 有限 → 长亭雷池社区版 / ModSecurity开源

是否需要等保合规？
├── 是 → 绿盟WAF 或 安恒明御（合规支持更好）
└── 否 → 都可以
```

---

## 六、实操实验：Docker部署ModSecurity + Nginx WAF

### 6.1 实验环境准备

```bash
# 确认环境
docker --version
docker-compose --version

# 创建实验目录
mkdir -p ~/waf-lab
cd ~/waf-lab
```

### 6.2 部署ModSecurity + Nginx

```bash
# === 方法一：使用官方OWASP ModSecurity镜像 ===

# 1. 拉取镜像
docker pull owasp/modsecurity-crs:nginx

# 2. 创建配置目录
mkdir -p nginx-config modsecurity-config

# 3. 创建Nginx配置
cat > nginx-config/default.conf << 'EOF'
server {
    listen 80;
    server_name localhost;

    # 启用ModSecurity
    modsecurity on;
    modsecurity_rules_file /etc/modsecurity.d/modsecurity.conf;

    location / {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# 4. 创建后端测试服务（有漏洞的Web应用）
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # WAF层（ModSecurity + Nginx）
  waf:
    image: owasp/modsecurity-crs:nginx
    container_name: waf-nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx-config/default.conf:/etc/nginx/conf.d/default.conf
    environment:
      - BACKEND=http://backend:8080
      - PARANOIA=1           # 偏执级别：1-4，越高越严格
      - ANOMALY_INBOUND=5    # 入站异常阈值（达到即阻断）
      - ANOMALY_OUTBOUND=4   # 出站异常阈值
    depends_on:
      - backend
    restart: unless-stopped

  # 后端漏洞应用（DVWA）
  backend:
    image: vulnerables/web-dvwa
    container_name: dvwa-backend
    ports:
      - "8080:80"
    environment:
      - MYSQL_PASS=password
    restart: unless-stopped
EOF

# 5. 启动环境
docker-compose up -d

# 6. 查看日志
docker-compose logs -f waf
```

### 6.3 测试WAF防护效果

```bash
# === 测试1：正常请求（应该通过） ===
curl -v http://localhost/
# 预期：200 OK，正常返回DVWA页面

# === 测试2：SQL注入攻击（应该被拦截） ===
curl -v "http://localhost/vulnerabilities/sqli/?id=1' OR '1'='1&Submit=Submit"
# 预期：403 Forbidden

# === 测试3：XSS攻击（应该被拦截） ===
curl -v "http://localhost/vulnerabilities/xss_r/?name=<script>alert(1)</script>"
# 预期：403 Forbidden

# === 测试4：路径遍历（应该被拦截） ===
curl -v "http://localhost/../../../etc/passwd"
# 预期：403 Forbidden

# === 测试5：命令注入（应该被拦截） ===
curl -v -X POST "http://localhost/" -d "cmd=;cat /etc/passwd"
# 预期：403 Forbidden
```

### 6.4 查看WAF日志

```bash
# 查看ModSecurity审计日志
docker exec waf-nginx cat /var/log/modsecurity/audit.log

# 查看Nginx错误日志（ModSecurity阻断记录在这里）
docker exec waf-nginx cat /var/log/nginx/error.log

# 查看Nginx访问日志
docker exec waf-nginx cat /var/log/nginx/access.log

# 实时监控WAF拦截
docker exec waf-nginx tail -f /var/log/nginx/error.log | grep ModSecurity
```

### 6.5 编写自定义WAF规则

```bash
# 创建自定义规则文件
cat > modsecurity-config/custom-rules.conf << 'EOF'
# === 自定义ModSecurity规则 ===

# 规则1：封禁特定IP
SecRule REMOTE_ADDR "^192\.168\.1\.100$" \
    "id:100001,\
    phase:1,\
    deny,\
    status:403,\
    msg:'IP is blocked by custom rule',\
    logdata:'Blocked IP: %{REMOTE_ADDR}'"

# 规则2：封禁特定User-Agent
SecRule REQUEST_HEADERS:User-Agent "sqlmap|nikto|acunetix|nessus" \
    "id:100002,\
    phase:1,\
    deny,\
    status:403,\
    msg:'Scanning tool detected',\
    logdata:'Matched User-Agent: %{MATCHED_VAR}'"

# 规则3：限制请求速率（每IP每秒最多10个请求）
SecAction \
    "id:100003,\
    phase:1,\
    nolog,\
    pass,\
    setvar:ip.requests=+1,\
    expirevar:ip.requests=1"

SecRule IP:REQUESTS "@gt 10" \
    "id:100004,\
    phase:1,\
    deny,\
    status:429,\
    msg:'Rate limit exceeded',\
    setvar:ip.requests=0"

# 规则4：拦截敏感文件访问
SecRule REQUEST_FILENAME "\.(bak|swp|old|backup|sql|tar\.gz)$" \
    "id:100005,\
    phase:2,\
    deny,\
    status:403,\
    msg:'Sensitive file access attempt'"

# 规则5：检测特定攻击模式（中国特产攻击）
SecRule ARGS "select%20" \
    "id:100006,\
    phase:2,\
    deny,\
    status:403,\
    msg:'URL-encoded SQL injection attempt',\
    logdata:'URL-encoded payload: %{MATCHED_VAR}'"

# 规则6：允许特定URL绕过WAF（白名单）
SecRule REQUEST_FILENAME "^/health$" \
    "id:100007,\
    phase:1,\
    pass,\
    ctl:ruleEngine=Off,\
    msg:'Health check endpoint - WAF bypass'"

# 规则7：请求体大小限制（防止大payload攻击）
SecRule REQUEST_BODY_LENGTH "@gt 1048576" \
    "id:100008,\
    phase:2,\
    deny,\
    status:413,\
    msg:'Request body too large'"

# 规则8：检测Admin路径暴力访问
SecRule REQUEST_FILENAME "@rx /admin" \
    "id:100009,\
    phase:2,\
    chain,\
    msg:'Unauthorized admin access attempt'"
    SecRule REMOTE_ADDR "!@ipMatch 10.0.0.0/8,192.168.0.0/16"

EOF

# 在docker-compose中挂载自定义规则
# 修改docker-compose.yml，添加：
#   volumes:
#     - ./modsecurity-config/custom-rules.conf:/etc/modsecurity.d/custom-rules.conf
```

### 6.6 攻击绕过WAF技术（理解攻击者思维）

```
绕过技术1：大小写变换
  原始：<script>alert(1)</script>
  绕过：<ScRiPt>alert(1)</ScRiPt>
  防御：不区分大小写匹配

绕过技术2：编码绕过
  原始：' OR 1=1--
  绕过：%27%20OR%201%3D1--
  防御：先URL解码再检测

绕过技术3：双重编码
  原始：' OR 1=1--
  绕过：%2527%2520OR%25201%253D1--
  防御：递归解码直到不再变化

绕过技术4：注释混淆
  原始：UNION SELECT
  绕过：UN/**/ION SEL/**/ECT
  防御：去除注释后再检测

绕过技术5：换行绕过
  原始：<script>alert(1)</script>
  绕过：<script>%0aalert(1)%0a</script>
  防御：规范化空白字符

绕过技术6：等价函数替换
  原始：alert(1)
  绕过：prompt(1) 或 confirm(1) 或 eval('alert(1)')
  防御：覆盖所有等价函数

绕过技术7：分块传输编码
  HTTP请求使用Transfer-Encoding: chunked
  将payload分散到多个chunk中
  防御：重组完整请求后再检测
```

### 6.7 WAF调优：降低误报

```bash
# === 误报分析流程 ===

# 1. 收集被拦截的请求
docker exec waf-nginx grep "ModSecurity" /var/log/nginx/error.log > blocked_requests.log

# 2. 分析拦截规则分布
cat blocked_requests.log | grep -oP 'id "\d+"' | sort | uniq -c | sort -rn

# 3. 找到误报最多的规则，在测试环境调整

# 4. 常见调优操作：

# 调优1：降低偏执级别
# PARANOIA=1: 只启用最关键规则（最少误报）
# PARANOIA=2: 标准级别
# PARANOIA=3: 增强级别（可能有误报）
# PARANOIA=4: 最严格（误报多）

# 调优2：提高异常阈值
# ANOMALY_INBOUND=5: 默认
# ANOMALY_INBOUND=10: 更宽松（减少误报）

# 调优3：白名单排除
# 对特定的正常业务请求排除检测
SecRule REQUEST_FILENAME "^/api/callback$" \
    "id:200001,\
    phase:1,\
    pass,\
    ctl:ruleRemoveById=941000-942999"
```

---

## 七、绿盟WAF产品特色功能

### 7.1 智能学习模式

```
绿盟WAF智能学习流程：

Phase 1: 学习期（1-2周）
├── 自动分析正常业务流量
├── 学习URL结构、参数类型、参数值范围
├── 建立正向安全模型（白名单）
└── 此期间不阻断，只记录

Phase 2: 混合期（1周）
├── 基于学习结果启用部分白名单规则
├── 对于不符合模型的请求告警但不阻断
├── 人工审核告警，调整模型
└── 逐步过渡

Phase 3: 防护期
├── 全面启用正向+负向模型
├── 不符合模型的请求直接阻断
├── 持续学习和调整
└── 定期人工复核
```

### 7.2 虚拟补丁

```
虚拟补丁 = 在WAF层面修复应用漏洞，无需修改代码

场景：
  发现Web应用存在Struts2漏洞(CVE-2017-5638)
  但开发团队需要2周才能发布修复版本
  
  → WAF立即下发虚拟补丁：
  SecRule REQUEST_HEADERS:Content-Type "multipart/form-data" \
      "chain,\
      id:300001,\
      msg:'Struts2 CVE-2017-5638 Virtual Patch'"
  SecRule ARGS "@rx %{(#|\\\\)" \
      "deny,status:403"

  → 攻击者利用漏洞 → WAF拦截 → 保护生效
  → 2周后代码修复 → 可移除虚拟补丁（或保留作纵深防御）
```

### 7.3 业务安全防护

```
除了传统Web攻击，绿盟WAF还支持：

├── 爬虫管理
│   ├── 搜索引擎爬虫白名单
│   ├── 恶意爬虫检测（价格抓取、内容盗用）
│   └── 爬虫速率限制
│
├── API安全
│   ├── API Schema验证
│   ├── 异常API调用检测
│   └── API速率限制
│
├── 账户安全
│   ├── 撞库检测（同一密码尝试多个账号）
│   ├── 扫号检测（同一IP尝试多个账号）
│   └── 暴力破解防护
│
└── 数据安全
    ├── 敏感信息泄露检测（身份证、手机号、银行卡）
    ├── 响应内容过滤
    └── 数据脱敏
```

---

## 八、验收练习

### 8.1 基础题

1. **WAF和传统网络防火墙的核心区别是什么？它们分别工作在哪一层？**

2. **绿盟WAF支持哪三种部署模式？简述每种模式的工作原理和适用场景。**

3. **什么是正向安全模型（白名单）和负向安全模型（黑名单）？各有什么优缺点？**

4. **WAF + NIPS联动如何实现纵深防御？它们各自负责哪一层？**

5. **绿盟WAF相比长亭雷池和安恒明御的核心优势和差异是什么？**

### 8.2 进阶题

6. **一个电商网站使用了WAF反向代理模式，但用户反映访问变慢了。可能的原因有哪些？如何优化？**

7. **攻击者使用了"双重URL编码"来绕过WAF。请解释这种攻击手法，以及WAF应该如何防御。**

8. **设计一个WAF+NIPS联动的攻击响应方案：当检测到持续的SQL注入攻击时，WAF和NIPS各应该采取什么动作？**

9. **什么是虚拟补丁？在什么场景下使用虚拟补丁比直接修复代码更合适？**

10. **比较绿盟WAF的三种部署模式在以下场景中的选择：a)银行网银系统 b)公司内部OA系统 c)新上线的初创公司网站**

### 8.3 实操题

11. **使用Docker部署ModSecurity + Nginx作为WAF，搭建DVWA作为后端，验证WAF对SQL注入、XSS、命令注入的防护效果。**

12. **编写至少3条自定义ModSecurity规则，并验证其效果。**

13. **尝试使用编码绕过技术（URL编码、大小写变换、注释插入）绕过WAF规则，并思考如何改进规则来防御这些绕过。**

---

## 九、知识扩展

### 9.1 WAF技术的未来趋势

**1. 云原生WAF (Cloud-Native WAF)**
- 无需部署硬件或软件
- DNS解析指向WAF服务（类似CDN）
- 代表：Cloudflare WAF、AWS WAF、阿里云WAF

**2. AI驱动的WAF**
- 机器学习模型替代传统规则
- 自动学习正常行为，识别异常
- 降低误报率，提升0-day检测能力

**3. RASP (Runtime Application Self-Protection)**
- WAF是"外部防护"，RASP是"内部防护"
- RASP嵌入应用运行时，在应用内部检测攻击
- WAF + RASP = 内外兼修

**4. WAAP (Web Application and API Protection)**
- WAF的进化版
- 集成WAF + API安全 + Bot管理 + DDoS防护
- 一站式Web安全平台

### 9.2 开源WAF方案汇总

| 方案 | 类型 | 特点 |
|------|------|------|
| ModSecurity | WAF引擎 | 最成熟的开源WAF，规则丰富 |
| Coraza | WAF引擎 | Go语言实现，性能更好 |
| NAXSI | WAF引擎 | 基于白名单的WAF |
| SafeLine CE | 完整WAF | 长亭雷池社区版，语义分析 |
| OpenResty + lua-resty-waf | WAF引擎 | 基于OpenResty的WAF |
| AWS WAF | 云WAF | AWS原生WAF服务 |

### 9.3 推荐阅读

- OWASP ModSecurity Core Rule Set: https://coreruleset.org
- OWASP WAF Evaluation Criteria: https://owasp.org/www-project-waf-evaluation-criteria/
- ModSecurity Reference Manual: https://github.com/owasp-modsecurity/ModSecurity/wiki/Reference-Manual-(v3.x)

---

## 十、常见问题解答 (FAQ)

**Q1: 部署WAF后网站访问变慢了怎么办？**
A: 1)检查SSL终结性能，考虑使用硬件加速；2)优化WAF规则，移除不必要的检测；3)配置白名单，对静态资源等跳过检测；4)升级WAF硬件或增加节点。

**Q2: WAF能防0-day攻击吗？**
A: 基于黑名单的WAF不能，但基于白名单（正向模型）的WAF可以防住部分0-day。此外，行为分析和AI驱动的WAF也有一定的0-day检测能力。

**Q3: HTTPS网站部署WAF后需要把SSL证书给WAF吗？**
A: 反向代理模式下需要（WAF做SSL终结）。透明代理和旁路模式下不需要。证书管理是反向代理模式的一个重要运维工作。

**Q4: 为什么WAF有时候会误拦正常请求？**
A: 因为正常业务数据中可能包含类似攻击的特征。比如用户在论坛发帖讨论SQL语句、开发者提交的代码中包含<script>标签。这需要WAF调优——添加白名单规则。

**Q5: 绿盟WAF和ModSecurity是什么关系？**
A: 没有直接关系。ModSecurity是开源WAF引擎，绿盟WAF是自研的商业产品。但它们的核心检测思路是相通的。ModSecurity是学习WAF原理的绝佳工具。

**Q6: 旁路模式的WAF真的有用吗？只能检测不能阻断？**
A: 有用，但作用有限。主要用于：1)初期评估（上线前观察效果）；2)合规审计（需要WAF日志但不想影响业务）；3)配合其他设备联动阻断。如果目标是"防护"，应该选择反向代理或透明代理模式。

---

## 十一、今日总结

### 核心收获

| 知识点 | 一句话总结 |
|--------|-----------|
| WAF定位 | 第7层防火墙，检测HTTP/HTTPS应用层攻击 |
| 三种部署模式 | 反向代理(最佳)/透明代理(简单)/旁路(监控) |
| 纵深防御 | WAF(Web层)+NIPS(网络层)=分层防护 |
| 厂商对比 | 绿盟规则全/长亭语义准/安恒情报强 |
| 核心防御技术 | 协议检查→特征匹配→行为分析→语义分析 |

### 思考题

> 假设你是一家互联网金融公司的安全工程师。公司有一个核心交易系统，日交易额过亿。你需要设计Web安全防护方案。请综合考虑以下因素：1)零停机要求；2)HTTPS加密流量；3)API接口为主；4)需要满足等保三级。设计完整的WAF部署方案，包括部署模式选择、HA设计、SSL处理策略、与NIPS的联动方案。

---

> **明日预告**：DAY 29 · 绿盟NIPS/IDS & UTS统一威胁管理。我们将深入学习入侵检测和入侵防御的区别，使用Suricata进行实战部署，并一览绿盟完整产品线全景图。

