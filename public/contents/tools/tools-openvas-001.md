# OpenVAS 开源漏洞管理系统完全指南

> 分类：工具指南 | 难度：进阶 | 阅读时间：约45分钟

## 概述

OpenVAS（Open Vulnerability Assessment System）是 Greenbone Networks 维护的开源漏洞管理解决方案，是 Nessus 最强大的开源替代品。它由 Greenbone Vulnerability Management（GVM）框架驱动，包含超过 50,000 个网络漏洞测试（NVT），每日更新。OpenVAS 完全免费开源，是企业安全团队进行漏洞管理的理想之选——尤其是对预算有限但对安全要求高的组织。

**核心组件**：
- **gvmd**：Greenbone Vulnerability Management Daemon（管理守护进程）
- **openvas-scanner**：核心扫描引擎（执行 NVTs）
- **gsad**：Greenbone Security Assistant（Web 管理界面）
- **ospd-openvas**：Open Scanner Protocol 包装器
- **notus-scanner**：新一代漏洞扫描引擎（GVM 22+）
- **feed**: 漏洞测试数据源（NVT Feed）

## 核心知识点

- OpenVAS/GVM 的安装与初始化
- 扫描配置：Target、Task、Scan Config
- 结果分析与报告生成
- 定时扫描与告警配置
- OpenVAS vs Nessus 对比
- GMP（Greenbone Management Protocol）API

---

## 一、安装

### 1.1 Kali Linux（预装）

```bash
# Kali 预装，直接使用
sudo gvm-setup              # 首次初始化（需要 30 分钟+）
sudo gvm-start              # 启动所有服务

# 访问 Web 界面
# https://127.0.0.1:9392
# 默认账号：admin
# 密码：通过 sudo gvmd --user=admin --new-password=yourpass 设置
```

### 1.2 Docker 安装（推荐！）

```bash
# 最简单的方式
docker run -d -p 9392:9392 \
  -e PASSWORD="your_admin_password" \
  -v openvas_data:/data \
  --name openvas \
  greenbone/openvas-scanner

# 等待约20分钟初始化Feed数据
docker logs -f openvas
# 看到 "GSAD starting..." 即可访问 https://localhost:9392

# 或使用 docker-compose
# 参考：https://greenbone.github.io/docs/latest/22.4/container/
```

### 1.3 Ubuntu 源码安装

```bash
sudo apt install gvm -y
sudo gvm-setup

# 验证
sudo gvm-check-setup
# 期望输出: "It seems like your GVM installation is OK."
```

---

## 二、Web 界面操作

### 2.1 创建扫描任务（Task）

```
Scans → Tasks → 左上角 新建图标

1. 创建 Target：
   - Name: "Internal Network Scan"
   - Hosts: 192.168.1.0/24
   - Port List: All TCP and UDP
   - Credentials: (可选) SSH/SMB 认证

2. 创建 Task：
   - Name: "Weekly Internal Scan"
   - Scan Targets: 选择上面创建的 Target
   - Scanner: OpenVAS Default
   - Scan Config: Full and fast（推荐）
   - Schedule: (可选) 设置定时

3. 启动扫描：
   Tasks → 点击 "▶" 开始
```

### 2.2 Scan Config 扫描配置选择

| 配置名称 | 说明 | 耗时 |
|:---|:---|:---|
| **Full and fast** | 完整但优化的扫描（推荐）| 中等 |
| **Full and fast ultimate** | 最全面的快速扫描 | 中等-长 |
| **Full and very deep** | 极深度扫描（含大量测试）| 很长 |
| **Full and very deep ultimate** | 终极深度扫描 | 极长 |
| **Base** | 基础扫描 | 短 |
| **Discovery** | 仅主机/服务发现 | 很短 |
| **Host Discovery** | 仅 Ping/端口探测 | 极短 |
| **System Discovery** | 系统识别 | 短 |

---

## 三、结果分析

### 3.1 漏洞严重程度

| 等级 | CVSS | 颜色 |
|:---|:---|:---|
| High | ≥ 7.0 | 红色 |
| Medium | 4.0-6.9 | 橙色 |
| Low | < 4.0 | 黄色 |
| Log | N/A | 蓝色 |
| False Positive | N/A | 白色（手动标记）|

### 3.2 结果页面

```
Scans → Results → 按 CVSS/Family/Host 过滤

每个漏洞详情包含：
- Summary：漏洞概述
- Detection Result：检测到的具体证据
- Solution：修复方案
- References：CVE、URL、产品公告
- CVSS：CVSS v2 / v3 向量和评分
- QoD（Quality of Detection）：检测质量（0-100%）
```

### 3.3 报告生成

```
Scans → Reports → 选择报告 → 下载

支持格式：
- Anonymous XML（标准开放格式）
- PDF（正式报告）
- HTML（Web 查看）
- CSV Results（Excel 分析）
- CPE（通用平台枚举）
- ITG（德国 BSI IT-Grundschutz 合规）
```

---

## 四、计划任务（Schedule）

```
Configuration → Schedules → 新建

定时扫描配置：
- Name："Weekly Full Scan"
- First Time：开始时间
- Period：86400（每天）
- Duration：0（无限制）
- Recurrence：Weekly → Monday 02:00

多计划配合：
日扫描：Base 配置（快速，检测新上线服务的漏洞）
周扫描：Full and fast（中等深度）
月扫描：Full and very deep（全量深度扫描）
```

---

## 五、告警配置（Alerts）

```
Configuration → Alerts → 新建

告警方式：
- Email：扫描完成后邮件通知
- HTTP Get：Webhook
- SMB / SCP：保存报告到文件服务器
- Syslog：发送到 SIEM

告警条件：
- Severity at least：High（仅高危以上）
- Filter：按主机、漏洞类型过滤
- Report Format：PDF/CSV/HTML
```

---

## 六、OpenVAS vs Nessus 对比

| 特性 | OpenVAS | Nessus Professional |
|:---|:---|:---|
| 价格 | 免费开源 | $3,990+/年 |
| NVT/插件数量 | 50,000+ | 180,000+ |
| 更新频率 | 每日 | 每日 |
| Web 界面 | Greenbone Security Assistant | Nessus Web UI |
| 扫描速度 | 中等（逐测试执行）| 快（优化执行）|
| 合规审计 | 有限 | PCI/DISA/HIPAA/NIST 等 |
| 报告 | PDF/HTML/XML/CSV | 丰富模板 |
| API | GMP Protocol | REST API + GMP |
| 用户名 | Linux（需 root 或 docker）| 轻量部署 |

---

## 七、命令行操作

```bash
# 管理命令
sudo gvm-start          # 启动所有服务
sudo gvm-stop           # 停止所有服务
sudo gvm-check-setup    # 检查安装状态
sudo gvm-feed-update    # 更新 NVT Feed

# 密码管理
sudo gvmd --user=admin --new-password=NewPassword123

# 创建新用户
sudo gvmd --create-user=newuser --password=pass123

# 查看 Feed 状态
sudo gvmd --get-feeds
```

---

## 八、速查卡

```
安装(Kali):          sudo gvm-setup
启动:                sudo gvm-start
Web界面:             https://localhost:9392
默认账号:            admin
修改密码:            sudo gvmd --user=admin --new-password=PASS
检查状态:            sudo gvm-check-setup
更新Feed:            sudo gvm-feed-update

Docker一键部署:
  docker run -d -p 9392:9392 -e PASSWORD="pass" greenbone/openvas-scanner

扫描配置推荐:        Full and fast
端口策略推荐:        All TCP and Nmap top 100 UDP

GMP默认端口:         9390
GSAD(Web)端口:       9392
```

---

## 实战场景扩展

### 场景五：内网完整资产扫描

```bash
# 1. 创建目标列表
# Targets → New Target → Import file
targets.txt:
192.168.1.0/24
192.168.2.0/24

# 2. 创建扫描任务
# Scans → Tasks → New Task
# - 选择目标列表
# - 选择扫描配置：Full and fast
# - 选择调度器（如适用）

# 3. 查看结果
# Scans → Results
# 按 CVSS 排序：7.0+ → Critical/High 优先处理
```

### 场景六：CVE 专项扫描

```
方法：
1. Scans → Tasks → New Task
2. 添加目标
3. Edit Scan Configuration → 在 Family/单个 NVT 中：
   - 定位到特定 CVE 相关的 NVT
   - 或使用 Filter：name ~ "CVE-2024"
4. 运行 → 只有相关 CVE 检查会执行

# 或通过命令行导出特定 CVE 结果
gvm-cli --gmp-username admin --gmp-password pass socket \
  --xml "<get_results filter='name~CVE-2024'/>"
```

### 场景七：合规扫描

```
OpenVAS 内置合规策略（SCAP）：
1. Configuration → Scan Configs
2. 选择带 "SCAP" 或 "Compliance" 的配置
3. 支持的合规框架：
   - CIS Benchmark（部分）
   - IT-Grundschutz
   - PCI DSS（部分支持）

局限性：
- OpenVAS 的合规能力不如 Nessus/Qualys 全面
- 商业合规需求建议考虑 Greenbone Enterprise
```

### 场景八：脚本化调度

```bash
# 用 gvm-cli 自动化扫描
# 创建目标
gvm-cli --gmp-username admin --gmp-password pass socket \
  --xml "<create_target><name>Web_Servers</name><hosts>10.0.0.1,10.0.0.2</hosts></create_target>"

# 启动扫描
gvm-cli socket --xml "<create_task><name>Daily_Scan</name><target id='TARGET_ID'/><config id='CONFIG_ID'/></create_task>"

# 查看结果
gvm-cli socket --xml "<get_results filter='severity>7.0'/>"

# 导出报告
gvm-cli socket --xml "<get_reports filter='task_id=TASK_ID'/>"
```

### 场景九：误报处理

```
1. 确认误报：
   - 查看漏洞详情 → 阅读 Detection Method
   - 对比 Nessus/Nuclei 结果交叉验证
   - 手动验证（如：curl 测试 XSS payload）

2. 覆盖误报：
   # 通过 Web UI
   Results → 选中漏洞 → Override → 选择原因（False Positive）

   # 或通过 GMP
   <override>
     <nvt oid="NVT_OID"/>
     <text>False positive - confirmed by manual testing</text>
     <new_threat>None</new_threat>
   </override>
```

### 场景十：生成合规报告

```
报告模板选择：
1. IT-Grundschutz 报告（德国 BSI 标准）
2. NIST SP 800-53 映射报告
3. ISO 27001 Annex A 映射报告
4. 自定义报告（选择漏洞分类、排除已处理项）
```

---

## 常见问题排查

| 问题 | 原因 | 解决方案 |
|:---|:---|:---|
| Feed 更新失败 | 网络/NTP 时间 | 同步 NTP，检查代理配置 |
| 扫描不启动 | scanner 未连接 | `gvmd --get-scanners` 确认 |
| 扫描卡住 | 目标无响应 | 调整 Hosts ordering + timeout |
| Web UI 无法访问 | gsad 配置问题 | 检查监听端口和允许来源 |
| 内存不足 | PostgreSQL 内存大 | 增加 swap，定期 vacuum |
| 扫描速度慢 | NVTs 数量多 | 使用精简配置，减少端口范围 |
| Redis 连接失败 | 服务未启动 | `systemctl start redis` |
| 误报率高 | 签名激进 | 使用凭证扫描减少误报 |

---

## OpenVAS vs Nessus 完整对比

| 特性 | OpenVAS/Greenbone | Nessus Professional |
|:---|:---|:---|
| 漏洞检测数 | 50,000+ | 180,000+ |
| 更新频率 | 每日（社区Feed有延迟）| 每日 |
| 报告模板 | 10+ | 100+ |
| 合规扫描 | 基础 | 全面 |
| 仪表板 | 基础 | 丰富交互式 |
| API | GMP/XML | REST API |
| 适合规模 | 小中型 | 中大型 |
| 价格 | 免费（社区版）| $3,390+/年 |
| 推荐场景 | 学习、预算有限 | 企业、合规审计 |

---

---

## 一、安装（补充：Greenbone Community Edition）

### 1.1 Docker 部署（推荐，最简单）

```bash
# 拉取官方 Docker Compose
curl -f -L https://greenbone.github.io/docs/latest/_static/docker-compose.yml -o docker-compose.yml
docker compose pull
docker compose up -d

# 等待初始化完成（2-5分钟）
docker compose logs -f gvmd

# 默认凭据
# 用户名: admin
# 密码: admin（首次登录需修改）

# Web UI 地址: https://localhost:9392
```

### 1.2 Kali Linux 包安装

```bash
sudo apt update
sudo apt install openvas -y

# Kali 2023+ 也可以使用 gvm
sudo apt install gvm -y
sudo gvm-setup
# 设置会下载所有 NVTs（可能需要1-2小时）
# 自动配置 PostgreSQL 和 Redis

sudo gvm-start
# Web: https://127.0.0.1:9392
```

### 1.3 从源码编译（自主控制）

```bash
# 安装依赖
sudo apt install -y \
  cmake pkg-config libglib2.0-dev libgpgme-dev libgnutls28-dev \
  uuid-dev libssh-gcrypt-dev libhiredis-dev libxml2-dev libpcap-dev \
  libnet1-dev libpaho-mqtt-dev libldap2-dev libradcli-dev \
  postgresql postgresql-contrib postgresql-server-dev-all \
  graphviz doxygen xsltproc rsync

# 编译 gvm-libs
git clone https://github.com/greenbone/gvm-libs.git
cd gvm-libs && mkdir build && cd build
cmake .. && make -j$(nproc) && sudo make install

# 类似流程编译 gvmd, gsad, openvas-scanner, ospd-openvas
```

---

## 二、核心架构深入

```
┌──────────────────────────────────────────┐
│            Greenbone 架构                 │
├──────────────────────────────────────────┤
│  gsad (Greenbone Security Assistant)     │
│  └─ Web UI (端口 9392)                   │
│                                          │
│  gvmd (Greenbone Vulnerability Manager)  │
│  └─ 任务调度、结果存储、报告生成         │
│  └─ PostgreSQL 数据库                    │
│                                          │
│  ospd-openvas (Scanner Wrapper)          │
│  └─ 与 openvas-scanner 通信              │
│  └─ OSP 协议 (端口 9390)                 │
│                                          │
│  openvas-scanner                         │
│  └─ 实际执行扫描的引擎                   │
│  └─ Redis 存储临时数据                   │
│                                          │
│  Feed Service (greenbone-feed-sync)      │
│  └─ 每日更新 NVT/SCAP/CERT               │
└──────────────────────────────────────────┘
```

### 2.1 数据库与存储

```bash
# PostgreSQL 表结构
sudo -u postgres psql -d gvmd
\dt   # 查看所有表
# 主要表: results, nvts, tasks, targets, reports

# 常用维护
# 清理旧结果
sudo -u postgres psql -d gvmd -c "DELETE FROM results WHERE date < NOW() - INTERVAL '90 days';"
# 清理后需要 vacuum
sudo -u postgres psql -d gvmd -c "VACUUM FULL;"
```

---

## 三、高级配置优化

### 3.1 性能调优

```
配置位置: Administration → Scanner → Edit

关键参数:
- max_checks: 10（同时执行的最大 NVT 数量）
- max_hosts: 20（同时扫描的最大主机数）
- scan_network_timeout: 5（网络超时 5秒）
- optimize_test: yes（跳过未安装服务的检测）

建议：
- 内网高速网络: max_checks=10, max_hosts=30
- 低带宽/VPN: max_checks=4, max_hosts=10
- NIC 性能足够时可适当增加
```

### 3.2 自定义 NVT（网络漏洞测试）

```c
// 简单 NVT 示例：检查特定端口开放
// 存放在 /var/lib/openvas/plugins/ 下

if(description)
{
  script_oid("1.3.6.1.4.1.25623.1.0.900001");
  script_name("Custom Port Check");
  script_description("Checks if custom application port is open");
  script_category(ACT_GATHER_INFO);
  script_family("General");
  script_copyright("Custom");
  exit(0);
}

port = 8888;
if(get_port_state(port))
{
  soc = open_sock_tcp(port);
  if(soc)
  {
    banner = recv_line(socket:soc, length:1024);
    security_note(port:port, data:"Service: " + banner);
    close(soc);
  }
}
```

### 3.3 扫描调度自动化

```bash
# 通过 GMP 自动化
# Shell 脚本示例
#!/bin/bash
TARGET="192.168.1.0/24"
CONFIG="Full and fast"
TASK_NAME="Auto_Scan_$(date +%Y%m%d)"

gvm-cli --gmp-username admin --gmp-password pass socket \
  --xml "<create_target><name>$TASK_NAME</name><hosts>$TARGET</hosts></create_target>"

# 每周一凌晨2点
# crontab: 0 2 * * 1 /usr/local/bin/auto_scan.sh
```

---

## 四、报告解读

### 4.1 理解 CVSS 评分

```
CVSS v3.1 评分分解:
┌────────────┬──────────┬─────────────────┐
│ 严重程度    │ CVSS分数  │ 示例漏洞          │
├────────────┼──────────┼─────────────────┤
│ None       │ 0.0      │ -                │
│ Low        │ 0.1-3.9  │ 信息泄露         │
│ Medium     │ 4.0-6.9  │ XSS, CSRF        │
│ High       │ 7.0-8.9  │ SQL注入, RCE     │
│ Critical   │ 9.0-10.0 │ 易利用的RCE      │
└────────────┴──────────┴─────────────────┘

CVSS 向量解读示例:
CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H (9.8)
AV:N  = 攻击向量：网络
AC:L  = 攻击复杂度：低
PR:N  = 所需权限：无
UI:N  = 用户交互：不需要
S:U   = 影响范围：不变
C:H   = 机密性影响：高
I:H   = 完整性影响：高
A:H   = 可用性影响：高
```

### 4.2 QoD (Quality of Detection) 解读

```
QoD 类型:
- 99%: Exploit → 已实际验证可利用
- 97%: Remote Active → 远程主动确认（如banner匹配）
- 95%: Remote App → 远程应用指纹
- 80%: Remote Analysis → 分析推断
- 75%: Remote Unreliable → 不可靠推断
- 70%: Package → 本地包版本
- 50%: General Note → 通用建议
```

---

---

## 五、常见扫描场景清单

### 场景1：内网资产发现扫描
```
目的：快速发现内网所有开放端口和服务
配置：Discovery + 通用端口
端口：1-1000 TCP
时间：约 30 分钟/256 IP
输出：资产清单（IP、开放端口、服务横幅）
```

### 场景2：完整漏洞评估
```
配置：Full and fast
端口：All TCP + Top 100 UDP
并发：max_hosts=20, max_checks=10
时间：2-6 小时/C 类网段
输出：漏洞列表 + 修复建议
```

### 场景3：CVE 应急响应扫描
```
配置：自定义 → 仅启用特定 NVT 族
例如：仅"Web Application Abuses" 或筛选 CVE-2024
时间：15 分钟/目标
输出：仅相关 CVE 的检测结果
```

### 场景4：合规基线扫描
```
配置：IT-Grundschutz / PCI DSS 模板
端口：标准服务端口
时间：1-2 小时/目标
输出：合规报告（含不合规项和修复建议）
```

### 场景5：渗透测试前信息收集
```
配置：Information gathering 为主
端口：Top 1000 TCP
强度：Light
时间：10 分钟/目标
目的：确认目标技术栈、开放服务、初步漏洞判断
```

---

## 六、自定义扫描配置

### 6.1 创建配置模板

```
1. Configuration → Scan Configs → New Config
2. 基础配置：选择一个预设模板
3. Family 选择：
   - 取消不需要的 Family（提升速度）
   - 选择特定的 CVE Family
4. NVT 级别选择：
   - 单个 NVT 启用/禁用
   - 调整超时和重试参数
5. 保存为自定义模板
```

### 6.2 性能调优参数

```
max_checks: 同时执行的最大 NVT 任务数
  内网高速：10-15
  低带宽/VPN: 4-6
  单目标深度扫描: 20

max_hosts: 同时扫描的最大主机数
  高性能扫描器: 30-40
  普通 VM: 10-20
  资源受限: 5-10

network_scan_timeout: 网络扫描超时
  内网: 3-5 秒
  广域网: 10-15 秒
```

---

## 七、结果处理工作流

```
扫描完成
  ↓
筛选：CVSS ≥ 7.0 → 优先处理
  ↓
验证：排除误报（手动验证/交叉确认）
  ↓
分类：按资产/业务系统分组
  ↓
分配：Critical/High → 立即修复（< 14天）
       Medium → 计划修复（< 30天）
       Low → 下次迭代
  ↓
跟踪：工单系统（Jira/ServiceNow）
  ↓
复测：修复后重新扫描 → 确认修复效果
```

---

## 八、与其他工具集成

```
OpenVAS → 发现漏洞 → 导出 CSV/XML
  ↓
导入 Metasploit → 利用已知漏洞验证
  ↓
导入 Python 脚本 → 自定义风险计算
  ↓
导入 SIEM (Splunk/ELK) → 安全运营监控
  ↓
导入 DefectDojo → 漏洞管理生命周期
```

---

> 📖 本文为"网安百宝箱"课程配套读物。更新于 2026-06-18
