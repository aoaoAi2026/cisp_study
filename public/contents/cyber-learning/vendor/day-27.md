# DAY 27 · 绿盟RSAS漏洞扫描器——漏洞管理实战

> **绿盟科技** | 远程安全评估系统(RSAS) | 20+年漏洞管理经验
> 学习时长：约3-4小时 | 难度：中级 | 实战环境：Docker + Kali Linux

---

## 一、开篇概述：漏洞管理——安全建设的基石

### 1.1 用体检类比理解漏洞管理

想象你每年都做一次全面体检。体检的流程是：

```
预约体检 → 各项检查(抽血/CT/B超) → 拿到报告 → 发现异常指标
→ 医生建议治疗 → 开始治疗 → 复查确认康复 → 定期随访
```

**漏洞管理就是IT系统的"定期体检"：**

```
资产发现 → 漏洞扫描 → 生成报告 → 风险评估 → 制定修复计划
→ 实施修复 → 复扫验证 → 持续监控
```

如果一个人从不体检，小病拖成大病才去医院——很多企业也是这样对待自己的IT系统，等被黑客入侵了才发现"原来这里有个漏洞"。

### 1.2 一组让人不安的数字

| 数据 | 来源 |
|------|------|
| 2023年披露CVE漏洞超过29,000个 | NVD |
| 平均修复一个漏洞需要60天 | Ponemon Institute |
| 60%的数据泄露源于未修补的已知漏洞 | Verizon DBIR |
| Log4j漏洞(CVE-2021-44228)影响全球93%的云环境 | 各大安全机构 |
| 漏洞在被披露后15分钟内开始被大规模扫描利用 | Palo Alto Networks |

**关键洞察：** 大多数成功的网络攻击，利用的不是零日漏洞(0-day)，而是几年前就已经有补丁的已知漏洞。攻击者赌的就是——"你还没打补丁"。

### 1.3 绿盟RSAS的市场地位

绿盟RSAS是国内漏洞扫描器市场的"老牌劲旅"：

- 1999年发布第一版，是国内最早的漏洞扫描产品之一
- 漏洞库超过20万条，覆盖CVE/CNVD/CNNVD
- 支持等保2.0、分保、密码测评等合规扫描
- 在金融、运营商、政府行业市占率领先

### 1.4 今日学习地图

```
漏洞管理概述 ──→ RSAS产品架构 ──→ 漏洞扫描全流程
      │                │                 │
      ├─ 六阶段模型     ├─ 扫描引擎      ├─ 资产发现
      ├─ CVSS评分       ├─ 漏洞库        ├─ 策略配置
      ├─ 优先级矩阵     ├─ 报表系统      ├─ 扫描执行
      └─ 合规要求       └─ 管理中心      └─ 报告解读
                                              │
                                        实操实验：
                                   Docker部署OpenVAS
                                   对靶机完整扫描
                                   生成漏洞报告
```

---

## 二、漏洞管理六阶段深度解析

### 2.1 阶段一：资产发现 (Asset Discovery)

**核心问题：** 你连自己有什么资产都不知道，怎么保护它们？

```
企业常见"资产盲区"：
├── 离职员工留下的测试服务器（没人管但还在运行）
├── 运维为了方便开的临时端口（事后忘了关）
├── 外包开发留下的后门账号（项目结束但账号还在）
├── 影子IT：业务部门自己买的云服务（IT部门不知道）
└── 过期的SSL证书（没人记得续期）
```

**资产发现要做的事：**

```bash
# 1. IP扫描：发现存活主机
nmap -sn 192.168.1.0/24

# 2. 端口扫描：发现开放服务
nmap -sV -p- 192.168.1.100

# 3. 服务识别：确认运行的应用和版本
nmap -sV --version-intensity 9 192.168.1.100

# 4. 操作系统识别
nmap -O 192.168.1.100

# 5. Web资产发现：发现Web应用
# 子域名枚举
ffuf -w wordlist.txt -u http://target.com -H "Host: FUZZ.target.com"
# 目录扫描
dirb http://target.com /usr/share/wordlists/dirb/common.txt
```

**RSAS的资产发现能力：**
- 自动网段扫描
- 被动流量分析发现资产
- 与CMDB对接，自动同步资产清单
- 资产分组管理（按部门/业务/重要性）

### 2.2 阶段二：漏洞扫描 (Vulnerability Scanning)

**扫描不是什么"一键操作"：**

漏洞扫描不是装个扫描器，点一下"开始扫描"就完事了。专业的漏洞扫描包括：

```
扫描前准备：
├── 确定扫描范围：哪些IP？哪些端口？什么时间段？
├── 选择扫描策略：全量扫描 vs 增量扫描 vs 专项扫描
├── 配置认证扫描：提供SSH/Windows凭据以深入扫描
├── 设置扫描窗口：业务低峰期（凌晨2-5点）
└── 通知相关人员：扫描可能导致服务异常

扫描执行：
├── 端口扫描：发现开放端口和服务
├── 服务识别：确认应用类型和版本
├── 漏洞检测：发送检测payload，验证漏洞是否存在
├── 弱口令检测：尝试常见弱口令
├── 配置合规检查：检查安全配置是否符合基线
└── Web应用扫描：检测SQL注入、XSS等Web漏洞
```

**扫描技术的分类：**

| 技术类型 | 说明 | 风险 | 准确率 |
|---------|------|------|--------|
| 基于版本匹配 | 根据服务版本号匹配已知漏洞 | 低 | 中(可能误报) |
| 基于PoC验证 | 发送payload验证漏洞是否真实存在 | 中 | 高 |
| 基于行为检测 | 观察目标对特定输入的反应 | 中 | 高 |
| 配置合规检查 | 检查配置文件是否符合安全标准 | 低 | 高 |
| 弱口令爆破 | 尝试常见用户名/密码组合 | 高 | 高(但可能锁账号) |

### 2.3 阶段三：风险评估 (Risk Assessment)

**不是所有漏洞都同等重要。**

评估一个漏洞的风险需要考虑三个维度：

```
风险 = CVSS评分 × 资产价值 × 利用难度

CVSS评分 (漏洞本身的严重性)
    ├── 0.1-3.9: 低危 (Low)
    ├── 4.0-6.9: 中危 (Medium)
    ├── 7.0-8.9: 高危 (High)
    └── 9.0-10.0: 严重 (Critical)

资产价值 (被影响的资产有多重要)
    ├── 核心资产: 数据库服务器、核心业务系统
    ├── 重要资产: Web服务器、应用服务器
    ├── 一般资产: 测试服务器、开发环境
    └── 低价值: 打印机、IP电话

利用难度 (攻击者利用这个漏洞有多难)
    ├── 极低: 互联网可直接访问、有公开exp、无需认证
    ├── 低: 内网可访问、需要简单认证
    ├── 中: 需要特定条件、有技术门槛
    └── 高: 需要多种条件配合、利用复杂
```

**RSAS的优先级矩阵：**

```
                    资产价值
                核心    重要    一般    低
CVSS  严重     [P0]    [P0]    [P1]    [P2]
      高危     [P0]    [P1]    [P1]    [P2]
      中危     [P1]    [P1]    [P2]    [P3]
      低危     [P2]    [P2]    [P3]    [P3]

P0 = 24小时内修复    P1 = 1周内修复
P2 = 1月内修复      P3 = 下一周期修复
```

**实例说明：**

```
漏洞A：核心数据库的Struts2 RCE (CVSS 10.0)
  → 10.0 × 核心资产 × 极低利用难度 = P0 → 立即修复！

漏洞B：打印机Web界面的信息泄露 (CVSS 4.0)
  → 4.0 × 低价值 × 中利用难度 = P3 → 有空再修

漏洞C：Web服务器的心血漏洞(Heartbleed) (CVSS 7.5)
  → 7.5 × 重要资产 × 低利用难度 = P1 → 本周内修复
```

### 2.4 阶段四：修复计划 (Remediation Planning)

**修复的优先级不等于修复的顺序！**

制定修复计划还需要考虑：
- **修复依赖**：A漏洞的修复可能需要先修复B（如系统升级）
- **业务窗口**：核心系统只能在特定时间维护
- **修复风险**：打补丁可能导致业务中断
- **临时缓解**：在正式修复前能否用其他方式缓解

```
修复策略选择：

1. 打补丁 (最佳)
   适用：有官方补丁、可以重启服务
   示例：升级OpenSSL修复Heartbleed

2. 配置缓解 (临时)
   适用：不能立即打补丁、需要保持业务连续性
   示例：WAF规则拦截、禁用受影响功能、限制访问IP

3. 隔离 (应急)
   适用：高危漏洞但无法修复
   示例：将受影响系统从网络隔离、断开互联网连接

4. 接受风险 (最后手段)
   适用：修复成本远超风险、利用条件极苛刻
   示例：需要物理接触才能利用的漏洞
```

### 2.5 阶段五：修复验证 (Remediation Verification)

**修复≠修好了。**

```
验证步骤：
1. 确认补丁已成功安装
   rpm -qa | grep openssl  # 查看版本
   
2. 复扫验证：用扫描器重新扫描
   确认之前的漏洞不再报出

3. 功能验证：确认业务功能正常
   执行冒烟测试，确认核心功能OK

4. 回归验证：确认没引入新问题
   补丁是否影响了其他组件？
```

### 2.6 阶段六：持续监控 (Continuous Monitoring)

```
持续监控体系：
├── 定期扫描：每月一次全量扫描
├── 增量扫描：新系统上线前必须扫描
├── 漏洞预警：关注CVE/CNVD新漏洞通告
├── 威胁情报：订阅漏洞利用情报
├── 资产变更：新资产自动加入扫描范围
└── 合规审计：定期检查扫描覆盖率
```

---

## 三、CVSS 3.1 评分体系深度解析

### 3.1 CVSS是什么？

**CVSS = Common Vulnerability Scoring System（通用漏洞评分系统）**

它是一个标准化的漏洞严重性评估框架，让全世界的安全研究人员用同一把"尺子"来衡量漏洞。

### 3.2 CVSS 3.1 评分公式

```
CVSS Score = 基础分(Base) + 时间分(Temporal) + 环境分(Environmental)

基础分 (Base Score): 漏洞本身的固有特性
    ├── 攻击向量 (AV): 网络(N)/相邻(A)/本地(L)/物理(P)
    ├── 攻击复杂度 (AC): 低(L)/高(H)
    ├── 所需权限 (PR): 无(N)/低(L)/高(H)
    ├── 用户交互 (UI): 无(N)/需要(R)
    ├── 范围 (S): 不变(U)/改变(C)
    ├── 机密性影响 (C): 无(N)/低(L)/高(H)
    ├── 完整性影响 (I): 无(N)/低(L)/高(H)
    └── 可用性影响 (A): 无(N)/低(L)/高(H)
```

### 3.3 用具体漏洞实例理解CVSS

**实例1：Log4j RCE (CVE-2021-44228) — CVSS 10.0**

```
攻击向量(AV): 网络(N) — 可以通过互联网远程攻击
攻击复杂度(AC): 低(L)  — 只需发送一个特制字符串
所需权限(PR): 无(N)   — 不需要登录
用户交互(UI): 无(N)   — 不需要用户点击
范围(S): 改变(C)      — 可从应用层跳到系统层
机密性影响(C): 高(H)   — 可读取任意文件
完整性影响(I): 高(H)   — 可执行任意代码
可用性影响(A): 高(H)   — 可导致服务崩溃

向量字符串: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H
得分: 10.0 (最高！)
```

**实例2：某Web应用反射型XSS — CVSS 6.1**

```
攻击向量(AV): 网络(N) — 可通过网络攻击
攻击复杂度(AC): 低(L)  — 不需要特殊技术
所需权限(PR): 无(N)   — 不需要登录
用户交互(UI): 需要(R) — 需要诱导用户点击链接
范围(S): 改变(C)      — 影响浏览器安全域
机密性影响(C): 低(L)   — 可读取Cookie
完整性影响(I): 低(L)   — 可修改页面内容
可用性影响(A): 无(N)   — 不影响服务器

向量字符串: CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N
得分: 6.1 (中危)
```

**实例3：Linux内核本地提权 — CVSS 7.8**

```
攻击向量(AV): 本地(L) — 需要先在目标系统上执行代码
攻击复杂度(AC): 低(L)  — PoC简单
所需权限(PR): 低(L)   — 需要普通用户权限
用户交互(UI): 无(N)   — 不需要交互
范围(S): 不变(U)      — 在同一安全域内
机密性影响(C): 高(H)   — 提权后可读任意文件
完整性影响(I): 高(H)   — 提权后可修改任意文件
可用性影响(A): 高(H)   — 提权后可关闭系统

向量字符串: CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H
得分: 7.8 (高危)
```

### 3.4 时间分和环境分

**时间分 (Temporal Score)：** 随时间变化的因素
- 利用代码成熟度 (E): 未证明(U)/PoC(P)/功能代码(F)/高(H)
- 修复措施 (RL): 官方补丁(O)/临时补丁(T)/变通方案(W)/不可用(U)
- 报告置信度 (RC): 未知(U)/合理(R)/确认(C)

**环境分 (Environmental Score)：** 根据具体环境调整
- 修改基础分指标：根据实际环境影响调整C/I/A
- 安全需求 (CR/IR/AR): 对机密性/完整性/可用性的重视程度

```
实际案例：
同一个漏洞在不同环境下评分可能不同：

漏洞：Web应用信息泄露(CVSS基础分 5.3)
  普通企业官网：风险较低，评分4.0
  银行核心系统：风险极高，评分8.0（因为机密性要求极高）
```

---

## 四、绿盟RSAS产品架构

### 4.1 RSAS整体架构

```
┌──────────────────────────────────────────────────────┐
│                    管理控制台(Web)                      │
│   用户管理 │ 策略配置 │ 任务调度 │ 报告查看 │ 资产管理   │
└────────────────────────┬─────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────┐
│                    核心引擎层                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ 端口扫描  │  │ 服务识别  │  │ 漏洞检测  │            │
│  │  引擎     │  │  引擎     │  │  引擎     │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Web扫描  │  │ 弱口令    │  │ 合规检查  │            │
│  │  引擎     │  │  检测     │  │  引擎     │            │
│  └──────────┘  └──────────┘  └──────────┘            │
└────────────────────────┬─────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────┐
│                    数据层                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ 漏洞库   │  │ 知识库   │  │ 扫描结果  │            │
│  │ 20万+条  │  │ 修复建议  │  │  数据库   │            │
│  └──────────┘  └──────────┘  └──────────┘            │
└──────────────────────────────────────────────────────┘
```

### 4.2 RSAS核心功能

**1. 多协议资产发现**
- ICMP/TCP/UDP主机发现
- ARP发现（同网段）
- NetBIOS/SMB发现（Windows网络）
- SNMP发现（网络设备）

**2. 全类型漏洞检测**
- 系统漏洞：Windows/Linux/Unix/网络设备
- 应用漏洞：Web服务器/数据库/中间件
- Web漏洞：OWASP Top 10全覆盖
- 弱口令：支持30+种协议/服务的弱口令检测

**3. 合规扫描**
- 等保2.0（GB/T 22239-2019）
- 分保（涉密信息系统）
- 密码测评（GM/T 0054）
- CIS Benchmark
- 自定义合规基线

**4. 报表系统**
- 综合报表：漏洞概览+趋势分析
- 技术报表：详细漏洞列表+修复建议
- 合规报表：对标等保/分保要求
- 对比报表：修复前后对比

---

## 五、漏洞扫描策略配置

### 5.1 扫描策略的核心参数

```
扫描策略 = 扫描范围 × 扫描深度 × 扫描强度 × 扫描窗口

扫描范围：
├── 全量扫描：所有资产、所有端口、所有漏洞
├── 增量扫描：仅扫描新增/变更的资产
├── 专项扫描：仅扫描特定漏洞（如Log4j专项排查）
└── 合规扫描：仅扫描合规相关的配置

扫描深度：
├── 快速扫描：仅常用端口 + 版本匹配（30分钟）
├── 标准扫描：全端口 + 基础检测（2小时）
├── 深度扫描：全端口 + PoC验证 + Web爬虫（6小时+）
└── 极深扫描：以上全部 + 暴力破解（可能数天）

扫描强度（发包速率）：
├── 低速：每秒10个包，几乎不影响业务
├── 中速：每秒50个包，轻微影响
├── 高速：每秒200个包，可能影响业务
└── 极速：最大速率，可能造成拒绝服务
```

### 5.2 认证扫描 vs 非认证扫描

**这是一个巨大的差异！**

```
非认证扫描（没有凭据）：
  只能从外部观察 → 看到版本号 → 猜测是否有漏洞
  准确率：约60-70%
  误报率高：可能报告"疑似漏洞"
  
  类比：医生隔着衣服看你 → "你看起来可能有问题"

认证扫描（提供SSH/Windows凭据）：
  登录系统内部 → 检查补丁状态 → 检查配置文件 → 检查注册表
  准确率：约95%+
  误报率低：确认漏洞是否真实存在
  
  类比：医生做了CT/血液检查 → "你的确有问题，具体是..."
```

**配置认证扫描示例：**

```bash
# SSH认证扫描（Linux）
# 创建专用扫描账号
sudo useradd -m scanner
sudo usermod -aG sudo scanner

# 配置sudo权限（仅允许读取，不允许修改）
echo "scanner ALL=(ALL) NOPASSWD: /usr/bin/cat, /usr/bin/find, /usr/bin/rpm, /usr/bin/dpkg" >> /etc/sudoers

# 配置SSH密钥认证
sudo -u scanner ssh-keygen -t rsa
```

### 5.3 扫描窗口选择

```
最佳扫描时间：
├── 每日：凌晨 02:00 - 05:00（业务低峰期）
├── 每周：周日凌晨（周末低峰期）
├── 每月：每月第一个周末（月度全量扫描）
└── 避开：业务高峰期、促销活动、系统维护窗口

大系统扫描策略：
├── 分组扫描：将资产分成N组，不同日期扫描不同组
├── 分时段：同一网段分时段扫描（如先扫前128个IP，再扫后128个）
├── 限速扫描：限制扫描速率，减少对网络的影响
└── 暂停恢复：支持暂停→恢复，跨多个窗口完成一次扫描
```

---

## 六、实操实验：Docker部署OpenVAS完整指南

OpenVAS（Open Vulnerability Assessment System）是Greenbone公司的开源漏洞扫描器，可以看作是绿盟RSAS的开源替代品，适合学习和实验。

### 6.1 环境准备

```bash
# === 系统要求 ===
# 操作系统: Ubuntu 20.04/22.04 或 Debian 11+
# 内存: 至少4GB（推荐8GB）
# 磁盘: 至少20GB可用空间
# Docker: 已安装

# 检查Docker状态
docker --version
docker ps

# 检查系统资源
free -h
df -h
```

### 6.2 安装Docker（如果还没装）

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
# 重新登录使权限生效

# 验证安装
docker run hello-world
```

### 6.3 部署OpenVAS

```bash
# === 方案一：使用官方greenbone社区镜像（推荐） ===

# 1. 拉取镜像
docker pull greenbone/openvas-scanner:latest

# 或者使用完整社区版
docker pull immauss/openvas:latest

# 2. 创建持久化目录
mkdir -p ~/openvas-data
sudo chown -R 1000:1000 ~/openvas-data

# 3. 启动OpenVAS容器
docker run -d \
  --name openvas \
  -p 443:443 \
  -p 9390:9390 \
  -p 9392:9392 \
  -v ~/openvas-data:/data \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e PASSWORD="admin123" \
  immauss/openvas:latest

# 4. 查看启动日志（首次启动需要下载漏洞库，可能需要30-60分钟！）
docker logs -f openvas

# 5. 等待看到类似以下日志表示启动完成：
# "OpenVAS is ready"
# 或 "gsad service started"

# 6. 检查服务状态
docker exec openvas bash -c "gvm-check-setup"
```

```bash
# === 方案二：使用docker-compose（更灵活） ===

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  openvas:
    image: immauss/openvas:latest
    container_name: openvas
    ports:
      - "443:443"      # Web管理界面(GSA)
      - "9390:9390"    # GVM管理协议
      - "9392:9392"    # OpenVAS扫描协议
    volumes:
      - ./openvas-data:/data
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - PASSWORD=admin123        # Web界面登录密码
      - USERNAME=admin           # Web界面登录用户名
      - RELAYHOST=localhost      # 邮件中继
      - SMTPPORT=25
      - AUTO_UPDATE=true         # 自动更新漏洞库
      - SKIPSYNC=false
      - TIMEOUT=900
    restart: unless-stopped
    shm_size: '2gb'
EOF

# 启动
docker-compose up -d

# 查看日志
docker-compose logs -f
```

```bash
# === 方案三：从源码部署（高级用户，完整控制） ===

# 1. 安装依赖
sudo apt install -y \
  build-essential cmake pkg-config \
  libglib2.0-dev libgpgme-dev libgnutls28-dev \
  uuid-dev libssh-gcrypt-dev libhiredis-dev \
  libxml2-dev libpcap-dev libnet1-dev \
  libpaho-mqtt-dev libldap2-dev

# 2. 添加GVM源
sudo add-apt-repository ppa:mrazavi/gvm
sudo apt update

# 3. 安装GVM（新版OpenVAS已改名GVM）
sudo apt install -y gvm

# 4. 初始化设置
sudo gvm-setup
# 这个过程会很慢，需要下载大量数据

# 5. 检查安装
sudo gvm-check-setup

# 6. 设置管理员密码
sudo runuser -u _gvm -- gvmd --user=admin --new-password=admin123
```

### 6.4 访问OpenVAS Web界面

```bash
# 1. 确认容器运行
docker ps | grep openvas

# 2. 获取访问地址
# 如果是本地Docker
echo "访问地址: https://localhost"
# 如果是远程服务器
echo "访问地址: https://$(hostname -I | awk '{print $1}')"

# 3. 登录凭据
# 用户名: admin
# 密码: admin123（你在启动时设置的）

# 4. 浏览器访问（忽略SSL证书警告）
# https://localhost
```

### 6.5 配置第一个扫描任务

**步骤一：创建目标(Target)**

```
Web界面操作：
1. 登录后 → Configuration → Targets
2. 点击左上角星标图标(新建)
3. 填写：
   - Name: MyTestTarget
   - Hosts: 192.168.56.102 (你的靶机IP)
   - Port List: All IANA assigned TCP
   - Alive Test: Scan Config Default
4. 点击 Save
```

**步骤二：创建扫描任务(Task)**

```
1. Scans → Tasks
2. 点击星标图标(新建)
3. 填写：
   - Name: FirstScan
   - Scan Targets: MyTestTarget
   - Scanner: OpenVAS Default
   - Scan Config: Full and fast
   - Schedule: (留空，手动启动)
4. 点击 Create
```

**步骤三：启动扫描**

```
1. 在Tasks列表中找到FirstScan
2. 点击右侧的播放按钮(▶ Start)
3. 状态会从"New" → "Requested" → "Running"
4. 等待扫描完成（取决于目标复杂度和扫描深度）
```

### 6.6 查看扫描报告

```
1. Scans → Reports
2. 找到FirstScan的报告
3. 点击报告名称查看详情

报告内容包括：
├── 漏洞总数和按严重性分类
├── 每个漏洞的详细信息：
│   ├── CVE编号
│   ├── CVSS评分
│   ├── 漏洞描述
│   ├── 影响的资产
│   ├── 检测方法
│   └── 修复建议
├── 操作系统识别
├── 开放端口和服务
└── SSL/TLS信息
```

### 6.7 下载报告

```
报告导出格式：
1. PDF：适合给领导看，图表丰富
2. HTML：适合技术人员查看
3. XML：适合程序化处理
4. CSV：适合导入Excel分析

操作：在报告页面 → 点击下载图标 → 选择格式
```

### 6.8 命令行操作OpenVAS

```bash
# 使用gvm-cli命令行工具（在容器内）
docker exec -it openvas bash

# 查看扫描配置
gvm-cli --gmp-username admin --gmp-password admin123 socket --xml "<get_configs/>"

# 创建目标
gvm-cli --gmp-username admin --gmp-password admin123 socket --xml "
<create_target>
  <name>cmdline_target</name>
  <hosts>192.168.56.102</hosts>
  <port_list id='33d0cd82-57c6-11e1-8ed1-406186ea4fc5'/>
</create_target>"

# 创建任务
gvm-cli --gmp-username admin --gmp-password admin123 socket --xml "
<create_task>
  <name>cmdline_scan</name>
  <config id='daba56c8-73ec-11df-a475-002264764cea'/>
  <target id='TARGET_ID_HERE'/>
  <scanner id='08b69003-5fc2-4037-a479-93b440211c73'/>
</create_task>"

# 启动任务
gvm-cli --gmp-username admin --gmp-password admin123 socket --xml "
<start_task task_id='TASK_ID_HERE'/>"

# 获取报告
gvm-cli --gmp-username admin --gmp-password admin123 socket --xml "
<get_reports report_id='REPORT_ID_HERE'/>"
```

### 6.9 OpenVAS故障排查

```bash
# 1. 检查容器状态
docker ps -a | grep openvas

# 2. 查看日志
docker logs openvas --tail 100

# 3. 检查服务状态
docker exec openvas bash -c "
  systemctl status ospd-openvas || true
  systemctl status gvmd || true
  systemctl status gsad || true
"

# 4. 检查端口监听
docker exec openvas netstat -tlnp

# 5. 重启服务
docker exec openvas bash -c "
  gvm-stop
  gvm-start
"

# 6. 更新漏洞库
docker exec openvas bash -c "
  greenbone-feed-sync --type GVMD_DATA
  greenbone-feed-sync --type SCAP
  greenbone-feed-sync --type CERT
"

# 7. 如果容器无法启动，重新创建
docker stop openvas
docker rm openvas
# 然后重新运行docker run命令

# 8. 检查磁盘空间（漏洞库很大！）
df -h ~/openvas-data
```

---

## 七、漏洞分析实战

### 7.1 理解扫描结果

**一个典型的漏洞扫描结果：**

```
漏洞名称: OpenSSH User Enumeration Vulnerability
CVE编号: CVE-2018-15473
CVSS评分: 5.3 (Medium)
影响资产: 192.168.56.102:22 (SSH)
漏洞描述:
  OpenSSH 7.7及之前版本存在用户枚举漏洞。
  攻击者可以通过分析服务器对不同用户名的响应时间差异，
  来枚举系统上存在的有效用户名。

检测结果: 确认存在 (Authenticated check)
  SSH Banner: SSH-2.0-OpenSSH_7.6p1 Ubuntu-4ubuntu0.3

修复建议:
  1. 升级OpenSSH到7.8或更高版本
     sudo apt update && sudo apt install openssh-server
  2. 或配置fail2ban限制SSH连接尝试
  3. 禁用基于密码的SSH认证，仅使用密钥认证

参考链接:
  - https://nvd.nist.gov/vuln/detail/CVE-2018-15473
  - https://ubuntu.com/security/CVE-2018-15473
```

### 7.2 使用Python解析扫描结果

```python
#!/usr/bin/env python3
"""解析OpenVAS XML报告并生成汇总"""

import xml.etree.ElementTree as ET
from collections import Counter
import sys

def parse_openvas_report(xml_file):
    """解析OpenVAS报告"""
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    # OpenVAS XML报告结构
    # <report>
    #   <report>
    #     <results>
    #       <result>
    #         <severity>10.0</severity>
    #         <name>漏洞名称</name>
    #         <host>目标IP</host>
    #         <description>描述</description>
    #       </result>
    
    results = []
    severity_counter = Counter()
    host_vulns = {}
    
    for result in root.iter('result'):
        severity = float(result.find('severity').text or 0)
        name = result.find('name').text
        host = result.find('host').text
        
        vuln = {
            'severity': severity,
            'name': name,
            'host': host,
            'level': classify_severity(severity)
        }
        results.append(vuln)
        
        # 统计
        severity_counter[vuln['level']] += 1
        if host not in host_vulns:
            host_vulns[host] = []
        host_vulns[host].append(vuln)
    
    return results, severity_counter, host_vulns

def classify_severity(score):
    """分类CVSS评分"""
    if score >= 9.0:
        return 'Critical'
    elif score >= 7.0:
        return 'High'
    elif score >= 4.0:
        return 'Medium'
    elif score > 0:
        return 'Low'
    else:
        return 'Info'

def print_summary(results, severity_counter, host_vulns):
    """打印汇总报告"""
    print("=" * 60)
    print("漏洞扫描报告汇总")
    print("=" * 60)
    print(f"\n总漏洞数: {len(results)}")
    print(f"\n按严重性分布:")
    for level in ['Critical', 'High', 'Medium', 'Low', 'Info']:
        count = severity_counter.get(level, 0)
        bar = '█' * (count // 2) if count > 0 else ''
        print(f"  {level:10s}: {count:4d} {bar}")
    
    print(f"\n按主机分布:")
    for host, vulns in host_vulns.items():
        print(f"  {host}: {len(vulns)} 个漏洞")
    
    print(f"\nTop 10 最严重漏洞:")
    sorted_results = sorted(results, key=lambda x: x['severity'], reverse=True)
    for i, vuln in enumerate(sorted_results[:10], 1):
        print(f"  {i}. [{vuln['level']}] {vuln['host']} - {vuln['name']}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("用法: python3 parse_report.py <report.xml>")
        sys.exit(1)
    
    results, counter, host_vulns = parse_openvas_report(sys.argv[1])
    print_summary(results, counter, host_vulns)
```

---

## 八、绿盟RSAS vs 开源方案对比

| 维度 | 绿盟RSAS | OpenVAS/GVM | Nessus | Nexpose |
|------|---------|-------------|--------|---------|
| 类型 | 商业 | 开源免费 | 商业(免费版受限) | 商业 |
| 漏洞库 | 20万+ | 10万+ | 18万+ | 15万+ |
| 合规扫描 | 强(等保/分保/密评) | 弱(需定制) | 中 | 中 |
| 中文支持 | 原生 | 社区翻译 | 无 | 无 |
| 报表 | 专业中文报表 | 基础报表 | 专业英文报表 | 专业英文报表 |
| 信创适配 | 全面 | 部分 | 无 | 无 |
| 售后服务 | 7x24技术支持 | 社区支持 | 商业支持 | 商业支持 |
| 价格 | 按资产数 | 免费 | 免费(16IP)/付费 | 按资产数 |
| 适用场景 | 国内企业/政府 | 学习/小企业 | 国际企业 | 国际企业 |

---

## 九、验收练习

### 9.1 基础题

1. **漏洞管理的六个阶段分别是什么？请简述每阶段的核心工作。**

2. **CVSS 3.1评分体系包含哪三个维度的分数？基础分包含哪些指标？**

3. **认证扫描和非认证扫描的区别是什么？为什么认证扫描更准确？**

4. **写出Log4j漏洞(CVE-2021-44228)的CVSS向量字符串，并解释为什么它是10.0分。**

5. **绿盟RSAS主要支持哪些合规扫描标准？**

### 9.2 进阶题

6. **一个CVSS 5.0的漏洞在什么情况下应该被优先修复（高于一个CVSS 9.0的漏洞）？请用优先级矩阵解释。**

7. **设计一个大型企业（5000+资产）的漏洞扫描策略，包括扫描频率、分组策略、窗口选择。**

8. **如果扫描器报告了一个"高危漏洞"，但运维团队说"已经打了补丁"，你应该怎么做？**

9. **比较绿盟RSAS和OpenVAS的优缺点，在什么场景下应该选择哪一个？**

10. **解释为什么"大多数成功攻击利用的是已知漏洞而非0-day"，这对漏洞管理策略有什么指导意义？**

### 9.3 实操题

11. **使用Docker部署OpenVAS，创建一个扫描任务，对一台靶机完成完整扫描，并导出PDF报告。**

12. **编写一个Python脚本，解析OpenVAS的XML报告，生成按CVSS评分排序的漏洞清单，并输出Top 20最严重漏洞。**

13. **用Nmap手动验证OpenVAS报告中的3个漏洞，判断是否为误报。**

---

## 十、知识扩展

### 10.1 漏洞管理的未来趋势

**1. 攻击面管理 (ASM - Attack Surface Management)**
- 不只是扫描已知资产，而是持续发现"你不知道的资产"
- 包括：影子IT、云资产、第三方服务、域名、证书
- 代表产品：Censys、Shodan、RiskIQ

**2. 漏洞优先级技术 (VPT - Vulnerability Prioritization Technology)**
- 传统：仅按CVSS评分排序
- 现代：结合威胁情报、资产重要性、利用可能性
- 机器学习辅助：预测哪些漏洞最可能被利用

**3. 自动化修复 (Automated Remediation)**
- SOAR编排自动化修复流程
- 自动创建工单、自动打补丁、自动验证
- 减少人工介入时间

### 10.2 漏洞管理标准框架

| 框架 | 组织 | 适用场景 |
|------|------|---------|
| CVE | MITRE | 漏洞标识 |
| CVSS | FIRST | 漏洞评分 |
| CWE | MITRE | 弱点分类 |
| CPE | NIST | 产品命名 |
| OWASP Top 10 | OWASP | Web应用漏洞 |
| CIS Controls | CIS | 安全基线 |

### 10.3 推荐资源

- NVD (National Vulnerability Database): https://nvd.nist.gov
- CNVD (国家信息安全漏洞共享平台): https://www.cnvd.org.cn
- CVE Details: https://www.cvedetails.com
- Exploit-DB: https://www.exploit-db.com
- Greenbone Community: https://community.greenbone.net

---

## 十一、常见问题解答 (FAQ)

**Q1: 漏洞扫描会不会影响业务系统？**
A: 会的，尤其是在高强度扫描时。漏洞扫描本质上是"模拟攻击"，会向目标发送大量探测包。建议在业务低峰期进行，使用限速策略，并从非关键系统开始扫描。

**Q2: 扫描出1000个漏洞，该先修哪个？**
A: 不是按CVSS从高到低修！应该按优先级矩阵（CVSS × 资产价值 × 利用难度）来确定。互联网暴露的核心系统高危漏洞 = 立即修复；内网测试环境的低危漏洞 = 可以等。

**Q3: 为什么同一漏洞不同扫描器评分不一样？**
A: 每个扫描器对CVSS的理解和实现不同，有些扫描器还会根据自身威胁情报调整评分。RSAS会结合国内实际情况（如CNVD评分）进行调整。

**Q4: 扫描器说是高危，但我觉得没什么影响，可以不管吗？**
A: 需要分析具体情况。但如果漏洞确实存在，建议至少采取缓解措施（如WAF规则、网络隔离），而不是完全不管。黑客的思维是"只要有一个漏洞就行"。

**Q5: OpenVAS和Nessus有什么关系？**
A: Nessus曾经是开源的，2005年闭源商业化。OpenVAS是Nessus闭源后从最后一个开源版本fork出来的项目，可以理解为Nessus的"开源精神继承者"。

**Q6: 绿盟RSAS的漏洞库更新频率是多少？**
A: 商业版一般每周更新，重大漏洞（如Log4j）会在24小时内发布紧急更新。这也是商业版相比开源版的核心优势之一——响应速度。

---

## 十二、今日总结

### 核心收获

| 知识点 | 一句话总结 |
|--------|-----------|
| 漏洞管理六阶段 | 发现→扫描→评估→计划→验证→监控，形成闭环 |
| CVSS评分 | 基础分×时间分×环境分，标准化漏洞严重性 |
| 优先级矩阵 | CVSS×资产价值×利用难度，不只按分数排序 |
| 认证vs非认证 | 有无凭据的扫描准确率差异巨大(60% vs 95%) |
| 绿盟RSAS | 国内漏洞管理老牌产品，合规扫描是核心优势 |
| OpenVAS | 开源替代方案，适合学习和中小企业 |

### 思考题

> 假设你是一家银行的漏洞管理负责人。扫描发现一台核心交易服务器的OpenSSL版本过旧，存在Heartbleed漏洞(CVSS 7.5)。但这台服务器7×24小时运行，不能随意重启。你会如何处理？请设计完整的处理方案，包括临时缓解措施、正式修复计划、业务连续性保障和回滚方案。

---

> **明日预告**：DAY 28 · 绿盟WAF Web应用防火墙。我们将学习三种WAF部署模式（反向代理/透明代理/旁路检测），理解WAF+NIPS的纵深防御联动，并对比绿盟WAF vs 长亭雷池 vs 安恒明御。

