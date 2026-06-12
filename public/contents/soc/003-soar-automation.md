# SOAR 安全编排自动化与响应

---

## 一、SOAR 核心三件套

```
SOAR = Security Orchestration, Automation and Response

三大核心能力：

1. 剧本 (Playbook)
   安全事件的标准化响应流程
   例：钓鱼邮件 → 
     ① 提取邮件中的URL/附件
     ② 沙箱检测 → 恶意? 
     ③ 搜索其他用户是否收到同一邮件
     ④ 自动删除所有相关邮件
     ⑤ 更新威胁情报库
     ⑥ 创建工单+通知管理员

2. 集成 (Integration)
   连接各类安全工具：
     防火墙/Palo Alto → IP封禁
     EDR/CrowdStrike → 终端隔离
     邮件/O365/Gmail → 邮件删除
     SIEM/QRadar → 获取告警上下文
     威胁情报/VT/OTX → 信誉查询
     工单/Jira/ServiceNow → 创建Ticket
     通知/Slack/企业微信 → 即时通知

3. 案例管理 (Case Management)
   将相关告警、资产、IOC、操作统一呈现
   事件时间线可视化
   调查过程记录(证据链)
```

---

## 二、常见自动化场景

### 场景1: 钓鱼邮件自动化处置

```
触发条件：用户上报/邮件网关告警

Playbook 流程：
  Step 1: 提取邮件(发件人/主题/正文/URL/附件)
  Step 2: 邮件头分析(SPF/DKIM/DMARC检查)
  Step 3: URL分析(VirusTotal/URLscan.io/沙箱)
  Step 4: 附件分析(沙箱引爆/静态扫描)
  Step 5: 搜索扩散范围
    查询邮件网关："同一发件人还发给了谁？"
  Step 6: 自动处置(仅确认恶意后)
    删除所有收件人邮箱中的该邮件
    将发件人域名加入禁止列表
    将URL/IP加入防火墙黑名单
    通知受影响用户
  Step 7: 创建案例+存入情报库

MTTR 缩减：手动3-4小时 → 自动化<5分钟
```

### 场景2: EDR告警自动取证

```
触发条件：EDR检测到可疑进程执行

Playbook 流程：
  Step 1: 获取进程详细信息
    进程名/命令行/PID/Parent PID/用户/启动时间
  Step 2: 文件采集
    将进程可执行文件上传到沙箱
    计算MD5/SHA256
  Step 3: 网络连接分析
    查询SIEM：该主机过去1小时的网络连接
    查询DNS日志：解析了哪些域名
  Step 4: 关联分析
    同一父进程是否在其他主机也执行？
    同一IP其他主机是否也连接？
  Step 5: 情报查询
    查询VirusTotal → 可执行文件Hash
    查询AbuseIPDB → 连接的IP
  Step 6: 自动决策
    IF 情报确认恶意 → 自动隔离主机 → 通知L2分析师
    IF 情报不明确 → 提交给L1分析师手动决策
```

### 场景3: 暴力破解自动封禁

```
触发条件：SIEM检测到SSH/RDP暴力破解

Playbook 流程：
  Step 1: 识别攻击源IP和攻击目标
  Step 2: 确认攻击不是误报(排除内部扫描/运维操作)
  Step 3: 查询攻击源IP威胁情报
  Step 4: 自动封禁攻击源IP (防火墙/安全组)
  Step 5: 检查该攻击源是否已攻击其他主机
  Step 6: 封禁有效期设24小时(自动过期)
  Step 7: 通知当值安全分析师

注意：仅封禁明确恶意IP，避免误伤合法用户
```

---

## 三、开源 SOAR 方案

### 3.1 Shuffle (开源)

```
Shuffle = 开源的SOAR平台(基于Go语言)
https://github.com/Shuffle/Shuffle

特点：
  - 拖拽式工作流设计
  - 100+ 预置App集成
  - 支持自定义Python/JS节点
  - 自带TheHive/Cortex集成
  - 支持定时触发/Webhook触发/API触发

部署：
  git clone https://github.com/Shuffle/Shuffle
  cd Shuffle
  docker-compose up -d
  
  访问 http://localhost:3001
```

### 3.2 n8n (通用工作流 + 安全集成)

```yaml
# n8n 安全自动化工作流示例
nodes:
  - type: webhook
    id: alert-trigger
    
  - type: http-request
    id: vt-check
    config:
      url: "https://www.virustotal.com/api/v3/files/{{hash}}"
      headers:
        x-apikey: "{{$env.VT_API_KEY}}"
        
  - type: if
    id: is-malicious
    config:
      condition: "{{$node.vt-check.json.data.attributes.last_analysis_stats.malicious > 5}}"
      
  - type: http-request
    id: block-ip
    config:
      url: "https://firewall-api/block"
      method: POST
      body:
        ip: "{{$json.source_ip}}"
```

### 3.3 TheHive + Cortex

```
TheHive (案例管理) + Cortex (分析引擎)：
  - TheHive: 事件案例管理、协作、追踪
  - Cortex: 可观测性分析(100+分析器)
  - Cortex分析器示例：
    VirusTotal_GetReport → 查文件/IP/URL信誉
    AbuseIPDB_GetReport → IP信誉
    DNSDB_NameHistory → 域名历史
    EmailRep_GetReport → 邮箱信誉
    Shodan_GetInfo → IP资产信息
```

---

## 四、MTTD/MTTR 量化方法

```
MTTD (Mean Time to Detect) — 平均检测时间
  = (所有事件的(检测时间 - 入侵时间)) / 事件数

MTTR (Mean Time to Respond) — 平均响应时间
  = (所有事件的(解决时间 - 检测时间)) / 事件数

SOAR 对MTTR的影响（行业数据）：
  钓鱼邮件响应: 4小时 → 5分钟 (↓98%)
  暴力破解封禁: 1小时 → 30秒
  恶意软件处置: 8小时 → 30分钟
  告警调查: 30分钟 → 3分钟(自动取证+情报查询)
```

---

## 五、Checklist

- [ ] 选择SOAR平台(商业/开源)
- [ ] 梳理高频手动操作(优先自动化)
- [ ] 编写P0场景Playbook(钓鱼/恶意软件/暴力破解)
- [ ] 集成安全工具(防火墙/EDR/邮件/SIEM/情报)
- [ ] Playbook测试(先在测试环境跑通)
- [ ] 灰度上线(部分告警自动化)
- [ ] 效果评估(MTTD/MTTR变化)
- [ ] 持续扩展自动化场景
- [ ] 自动化风险控制(误封处理/回滚机制)
