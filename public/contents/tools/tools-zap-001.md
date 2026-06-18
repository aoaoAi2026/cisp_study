# OWASP ZAP Web 应用安全扫描器完全指南

> 分类：工具指南 | 难度：进阶 | 阅读时间：约40分钟

## 概述

OWASP Zed Attack Proxy（ZAP）是全球最流行的免费开源 Web 应用安全扫描器，由 OWASP 基金会维护。它设计为"为不同经验层次的人服务的安全工具"——既适合安全新手学习 Web 安全，也适合专业渗透测试员的日常使用。ZAP 提供了与 Burp Suite 类似的核心功能（代理拦截、扫描器、爬虫、Fuzz 引擎），但完全免费，并拥有强大的 REST API、脚本生态和 CI/CD 集成能力。

**版本**：ZAP Weekly / ZAP Stable / ZAP Docker

## 核心知识点

- 快速扫描 vs 手动渗透模式
- 自动化扫描：Spider（爬虫）+ Ajax Spider + Active Scan
- Context 与 Scope 配置
- Scripts（脚本）扩展能力
- REST API 自动化
- ZAP vs Burp Suite 对比
- CI/CD 集成（ZAProxy）

---

## 一、安装

```bash
# Kali Linux（预装）
zaproxy &

# Debian/Ubuntu
sudo apt install zaproxy -y

# macOS
brew install --cask owasp-zap

# Docker
docker pull owasp/zap2docker-stable
docker run -it owasp/zap2docker-stable zap.sh -cmd -quickurl http://target.com

# 启动
# Linux: zaproxy
# macOS: 从 Application 启动
# Windows: 下载 .exe 安装包
```

---

## 二、核心使用模式

### 2.1 自动扫描（最快上手）

```
1. 启动 ZAP
2. 点击 "Automated Scan"
3. 输入目标 URL
4. 选择 "Use traditional spider" 或 "Use Ajax spider"
5. 点击 "Attack" → ZAP 自动爬取 + 扫描
6. 查看 Alerts 面板 → 按风险等级排序的漏洞列表
```

### 2.2 手动探索（Manual Explore）

```
1. 点击 "Manual Explore"
2. 输入目标 URL
3. 浏览器通过 ZAP 代理（localhost:8080）访问
4. ZAP 自动记录所有流量（Sites 面板）
5. 手动浏览所有功能后，右键目标 → "Attack" → "Active Scan"
```

### 2.3 代理浏览器配置

```
代理设置：
- 地址：localhost
- 端口：8080
- SSL：导入 ZAP 的根证书

证书安装：
1. ZAP → Tools → Options → Dynamic SSL Certificate → Save
2. 浏览器 → 证书管理 → 导入保存的证书
3. Firefox 需单独导入，Chrome/Edge 使用系统证书
```

---

## 三、核心面板

### 3.1 Sites（站点树）

```
Sites 面板显示所有访问过的 URL，按域分组：
- 绿色节点：已爬取
- 红色旗帜：发现漏洞
- 右键 → Attack → Active Scan：对选中节点主动扫描
- 右键 → Include in Context：加入测试范围
```

### 3.2 Alerts（告警/漏洞）

漏洞等级：
- High（高危）：红色
- Medium（中危）：橙色
- Low（低危）：黄色
- Informational（信息）：蓝色

每个告警包含：
- 漏洞名称、CWE 编号
- 风险描述和影响
- 修复方案
- 请求/响应证据
- 相关 URL 列表

### 3.3 Active Scan vs Passive Scan

| 特性 | Active Scan | Passive Scan |
|:---|:---|:---|
| 主动攻击 | ✅ 发送恶意 Payload | ❌ 仅观察流量 |
| 发现的漏洞 | SQLi, XSS, RCE, 路径遍历等 | 信息泄露, Cookie 安全, Header 缺陷 |
| 对目标影响 | 可能较大（修改数据） | 完全无影响 |
| 适用场景 | 测试/预发布环境 | 所有环境（含生产） |

---

## 四、Scripts 脚本引擎

### 4.1 脚本类型

| 类型 | 说明 | 用途 |
|:---|:---|:---|
| Active Rules | 主动扫描规则 | 自定义漏洞检测 |
| Passive Rules | 被动扫描规则 | HTTP 响应分析 |
| HTTP Sender | HTTP 请求修改器 | 自动添加/修改请求头 |
| Proxy | 代理脚本 | 流量拦截和修改 |
| Authentication | 认证处理 | 自动处理登录/注销 |
| Session Management | 会话管理 | Cookie/Token 管理 |
| Fuzzer HTTP Processor | Fuzz 处理器 | Fuzz 过程中的处理 |

### 4.2 JavaScript 脚本示例

```javascript
// Passive Scan 脚本：检测响应中是否包含 Server 头
function scan(helper, msg, src) {
    var headers = msg.getResponseHeader();
    if (headers.getHeader("Server") !== null) {
        helper.newAlert()
            .setName("Server Header Disclosure")
            .setRisk(1) // 0=Info, 1=Low, 2=Medium, 3=High
            .setConfidence(2) // 0=False Positive, 1=Low, 2=Medium, 3=High
            .setDescription("Server header reveals web server type/version")
            .setSolution("Remove or obfuscate Server header")
            .raise();
    }
}
```

---

## 五、Context 配置

```
Context 是 ZAP 的核心概念，定义了测试范围和参数：

创建 Context：
1. 右键目标 → Include in Context → New Context
2. Context 配置：
   - Include in Context: URL 正则
   - Exclude from Context: 排除的 URL
   - Authentication: 登录方式
   - Session Management: Cookie/Token 管理
   - Authorization: 用户角色
   - Users: 测试用户列表
   - Forced User: 强制用户模式
   - Technology: 目标技术栈
   - Structure: URL 结构参数
```

---

## 六、REST API 与自动化

```bash
# ZAP API 默认端口 8080
# API Key 在 Tools → Options → API 中查看

# 启动 ZAP 并开始扫描（命令行模式）
zap.sh -cmd -quickurl http://target.com -quickprogress

# 使用 API
curl "http://localhost:8080/JSON/ascan/view/status/?apikey=YOUR_KEY"

# 通过 API 开始扫描
curl "http://localhost:8080/JSON/spider/action/scan/?apikey=KEY&url=http://target.com"

# 容器化 CI/CD 扫描
docker run -t owasp/zap2docker-stable zap-full-scan.py \
    -t http://target.com \
    -r scan_report.html
```

---

## 七、ZAP vs Burp Suite

| 特性 | OWASP ZAP | Burp Suite Pro |
|:---|:---|:---|
| 价格 | 免费 | $449/年 |
| 主动扫描 | ✅ | ✅ |
| 被动扫描 | ✅ | ✅ |
| 代理拦截 | ✅ | ✅ |
| Repeater 式工具 | ✅（Requester）| ✅ |
| Fuzz 引擎 | ✅ | ✅（Intruder）|
| REST API | ✅ | ✅ |
| 脚本扩展 | ✅ (JS/Python/Groovy/Ruby) | ✅ (Java/Python via Extender) |
| CI/CD 集成 | ✅（官方支持）| ✅（企业版）|
| 社区活跃度 | 高 | 非常高 |
| Scanner 漏洞覆盖率 | 中高 | 高 |
| 易用性 | 中 | 中 |

---

## 八、实战场景

### 场景一：CI/CD 管道集成

```bash
# GitHub Actions 示例
docker run -v $(pwd):/zap/wrk owasp/zap2docker-stable zap-baseline.py \
    -t https://staging.example.com \
    -r baseline_report.html
# 基线扫描（不主动攻击，仅被动分析）→ 返回 HTML 报告
```

### 场景二：手动渗透测试标准化

```
1. Context 设置（限定测试范围）
2. Manual Explore（浏览器手动操作所有功能）
3. Spider + Ajax Spider（自动爬虫）
4. Passive Scan（自动进行）
5. Active Scan（对关键端点）
6. Report 导出
```

---

## 九、速查卡

```
快速启动：       zaproxy &
快速扫描：       打开 → Automated Scan → 输入 URL
手动探索：       打开 → Manual Explore → 输入 URL
代理端口：       默认 8080
API 端口：       默认 8080
Docker：         docker pull owasp/zap2docker-stable
Docker扫描：     docker run owasp/zap2docker-stable zap-baseline.py -t URL
脚本位置：       Tools → Scripts → 右键 New Script
市场：          Tools → Marketplace → 安装插件
```

---

## 实战场景扩展

### 场景五：REST API 自动化扫描

```bash
# OpenAPI/Swagger 导入
# 1. Import → Import an OpenAPI definition
# 2. 选择 swagger.json URL 或文件
# 3. ZAP 自动生成 API 请求并扫描

# 命令行方式
zap-cli -p 8090 openapi import https://api.target.com/swagger.json
zap-cli -p 8090 active-scan https://api.target.com

# ZAP API 扫描脚本
docker run -v $(pwd):/zap/wrk owasp/zap2docker-stable \
  zap-api-scan.py -t https://api.target.com/swagger.json \
  -f openapi -r zap_report.html
```

### 场景六：AJAX Spider——单页应用（SPA）爬取

```
步骤：
1. 设置代理，用浏览器访问 SPA 应用
2. ZAP → AJAX Spider
3. 配置：
   - 浏览器选择 Firefox/Chrome
   - 勾选 "Click Default Elements Only"
   - 如需要完整爬取，关闭此选项
4. 在浏览器中进行操作，ZAP 记录所有 XHR/fetch 请求
5. 等待 AJAX Spider 完成后运行 Active Scan
```

### 场景七：认证扫描脚本化

```python
# ZAP Python 脚本（Scripts → Script Type: Authentication）
from org.zaproxy.zap.authentication import AuthenticationHelper

def authenticate(helper, paramsValues, credentials):
    # 获取登录页面
    login_url = paramsValues.get("loginUrl")
    login_msg = helper.prepareMessage()
    login_msg.getRequestHeader().setURI(URI(login_url, True))
    
    # 发送登录请求
    login_msg.getRequestBody().setBody(
        f"username={credentials.getParam('username')}&"
        f"password={credentials.getParam('password')}"
    )
    
    helper.sendAndReceive(login_msg)
    
    # 验证登录成功
    return login_msg.getResponseHeader().getStatusCode() == 302
```

### 场景八：CI/CD 管道集成

```yaml
# GitHub Actions ZAP 扫描
name: ZAP Security Scan
on: [push]
jobs:
  zap-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run ZAP Baseline Scan
        run: |
          docker run -v $(pwd):/zap/wrk owasp/zap2docker-stable \
            zap-baseline.py -t https://staging.example.com \
            -g gen.conf -r zap_report.html
      - name: Check Alerts
        run: |
          # 如果有高危告警则失败
          python check_zap_alerts.py zap_report.html
```

### 场景九：被动扫描 + WebSocket

```
1. 配置 ZAP 代理（默认 localhost:8080）
2. 浏览器设置代理并导入 ZAP CA 证书
3. 浏览器访问目标网站，正常浏览操作
4. ZAP 在后台进行被动扫描：
   - 检查 Header 安全设置
   - 信息泄露检测
   - Cookie 属性检测
5. WebSocket 支持：
   - ZAP 自动检测 WebSocket 连接
   - 记录所有 WebSocket 消息
   - 可进行 WebSocket Fuzzing
```

### 场景十：Fuzzing 与定制 Payload

```
1. 选择需要 Fuzz 的请求
2. 右键 → Attack → Fuzz
3. 选择需要替换的参数
4. 添加 Payload：
   - 文件列表（如 SQL injection payloads）
   - 正则生成器
   - 数字范围
   - 脚本生成（JavaScript/Zest/Groovy）
5. 点击 Start Fuzzer
6. 观察响应代码/大小/时间差异
7. 用过滤器排除 404 等正常响应

Fuzzer 脚本示例（JavaScript）：
// 生成递增值
var i = 1;
function getPayload() {
    return String(i++);
}
```

---

## ZAP vs Burp Suite 完整对比

| 特性 | OWASP ZAP | Burp Suite Pro |
|:---|:---|:---|
| 价格 | 完全免费 | $449/年 |
| 开源 | ✅ | ❌ |
| 主动扫描 | ✅ | ✅ |
| 被动扫描 | ✅ | ✅ |
| AJAX Spider | ✅ | ❌（需 BApp）|
| API 扫描 | ✅（OpenAPI/SOAP）| ✅ |
| 插件市场 | ✅ | ✅ |
| CI/CD 集成 | ✅（Docker 原生）| ✅（REST API）|
| 脚本语言 | Python/JS/Zest/Groovy | Java/Python(Jython) |
| WebSocket | ✅ | ✅ |
| 报告格式 | HTML/XML/JSON/Markdown | HTML/XML |
| 学习曲线 | 中等 | 中高 |
| 社区支持 | 极强 | 极强 |
| 推荐场景 | 开源/CI/CD/教育 | 专业渗透测试 |

---

## 常见问题排查

| 问题 | 原因 | 解决方案 |
|:---|:---|:---|
| 浏览器 HTTPS 报错 | 未导入 ZAP CA 证书 | 访问 http://zap 下载并导入证书 |
| AJAX Spider 不工作 | 浏览器配置错误 | 安装对应浏览器+驱动 |
| 扫描非常慢 | 目标响应慢 | 减少 Active Scan Strength |
| 误报多 | 规则激进 | 调整 Alert Thresholds |
| API 端口冲突 | 8080 被占用 | `zap.sh -port 8090` |
| Docker 扫描失败 | 网络隔离 | 使用 `--network host` |

---

---

## 一、安装

### 1.1 各平台安装

```bash
# Kali Linux（预装）
sudo apt install zaproxy -y

# Ubuntu/Debian
sudo snap install zaproxy --classic

# macOS
brew install --cask owasp-zap

# Windows
# 下载安装包：https://www.zaproxy.org/download/
# 或 Chocolatey: choco install zap

# Docker（推荐用于 CI/CD）
docker pull owasp/zap2docker-stable

# 验证
zap.sh -version
```

### 1.2 Docker 模式

```bash
# 基础扫描
docker run -v $(pwd):/zap/wrk owasp/zap2docker-stable \
  zap-baseline.py -t https://target.com -r report.html

# API 扫描
docker run -v $(pwd):/zap/wrk owasp/zap2docker-stable \
  zap-api-scan.py -t https://target.com/swagger.json \
  -f openapi -r api_report.html

# 完整扫描
docker run -v $(pwd):/zap/wrk owasp/zap2docker-stable \
  zap-full-scan.py -t https://target.com -r full_report.html

# 交互模式（守护进程）
docker run -d -p 8080:8080 -p 8090:8090 -v $(pwd):/zap/wrk \
  owasp/zap2docker-stable zap.sh -daemon -host 0.0.0.0 \
  -port 8080 -config api.addrs.addr.name=.* \
  -config api.addrs.addr.regex=true \
  -config api.disablekey=true
```

---

## 二、核心功能模块详解

### 2.1 Context（上下文）

```
1. 创建 Context：
   Sites → 右键目标域名 → Include in Context → New Context

2. Context 包含：
   - Include URLs: 测试范围
   - Exclude URLs: 排除路径（如 /logout）
   - Authentication: 认证方式
   - Session Management: 会话管理
   - Users: 测试用户（用于权限测试）
   - Technology: 技术栈标记
   - Structure: URL 结构定义
```

### 2.2 Authentication（认证）

```
支持类型：
1. Manual Authentication
   - 浏览器操作手动登录
   
2. HTTP/NTLM Authentication
   - hostname, realm, port
   - 用户名和密码

3. Form-Based Authentication
   - 登录 URL
   - 请求参数
   - 成功/失败判断正则

4. Script-Based Authentication
   - 自定义认证脚本（Python/JS）
   - 兼容 OAuth2.0/JWT/SSO

5. JSON-Based Authentication
   - JSON POST 登录
```

### 2.3 Session Management

```
方法：
1. Cookie-based Session Management
   - 自动检测 Set-Cookie
   
2. HTTP Auth Session Management
   - Authorization Header

3. Script-based Session Management
   - 自定义会话跟踪
```

---

## 三、扫描策略与严重度

### 3.1 主动扫描策略

| 策略 | 检查数 | 速度 | 适用场景 |
|:---|:---:|:---:|:---|
| **Light** | ~100项 | 快 | 快速检测 |
| **Default** | ~500项 | 中 | CI/CD |
| **Poke** | ~800项 | 慢 | 深度测试 |
| **Insane** | ~1200项 | 极慢 | 完整审计 |
| **Custom** | 自定义 | 可控 | 专项测试 |

### 3.2 Alert 严重度分级

| 级别 | 颜色 | 说明 | 示例 |
|:---|:---|:---|:---|
| High | 🔴 | 可导致系统破坏 | SQL注入、命令注入 |
| Medium | 🟠 | 暴露敏感信息 | XSS、目录遍历 |
| Low | 🟡 | 配置问题 | Cookie无Secure标记 |
| Informational | 🔵 | 信息提示 | 技术栈指纹 |

### 3.3 被动扫描规则清单

```
自动检测项目：
- 不安全 Cookie 属性（HttpOnly/Secure/SameSite）
- 信息泄露（服务器版本、框架指纹）
- Content Security Policy 缺失或配置错误
- 混合内容（HTTPS 页面含 HTTP 资源）
- X-Frame-Options 缺失
- X-Content-Type-Options 缺失
- Referrer-Policy 配置
- 调试信息泄露（Stacktrace、SQL错误）
```

---

## 四、Scripts 脚本引擎

### 4.1 脚本类型

```
Passive Rules:    被动扫描规则
Active Rules:     主动扫描规则
Authentication:   认证脚本
Session:          会话管理
HTTP Sender:      HTTP请求/响应拦截
Proxy:            代理拦截
WebSocket:        WebSocket处理
Stand Alone:      独立脚本
```

### 4.2 Python 示例：自定义被动扫描器

```python
# Script Type: Passive Rules
from org.zaproxy.zap.extension.pscan import PluginPassiveScanner
from net.htmlparser.jericho import Source

def appliesToHistoryType(historyType):
    return historyType == 6  # HTTP response

def scan(helper, msg, src):
    # 检查响应是否包含 'password' 单词
    body = msg.getResponseBody().toString()
    if 'password' in body.lower():
        helper.newAlert()
            .setName("Response contains 'password'")
            .setRisk(3)  # 3 = Low
            .setConfidence(2)  # 2 = Medium
            .setDescription("Response body may contain sensitive info")
            .setMessage(msg)
            .raise()
    return None
```

### 4.3 JavaScript 示例：HTTP Sender

```javascript
// 给所有请求添加自定义 Header
function sendingRequest(msg, initiator, helper) {
    msg.getRequestHeader().setHeader(
        "X-Scanner-ID", "ZAP-Scan-" + Date.now()
    );
}
function responseReceived(msg, initiator, helper) {
    // 分析响应
}
```

---

## 五、ZAP 与 Burp Suite 联动

```
场景：利用 ZAP 的免费自动化 + Burp 的手工分析能力

流程：
1. ZAP 被动模式 + 浏览器代理 (8080)
2. ZAP → 生成扫描报告（自动化漏洞发现）
3. ZAP → Export URLs → 导入 Burp
4. Burp → 手工验证和深入测试
5. Burp → Repeater 手工构造攻击请求
```

---

---

## 六、Add-ons 与 Marketplace

### 6.1 推荐插件

| 插件 | 功能 | 安装方式 |
|:---|:---|:---|
| **Community Scripts** | 社区共享的脚本集合 | Marketplace |
| **Fuzzer (Code Dx)** | 更强大的 Fuzzing | Marketplace |
| **Selenium** | Selenium 集成 | Marketplace |
| **Retire.js** | JavaScript 库漏洞 | Marketplace |
| **Wappalyzer** | 技术栈识别 | Marketplace |
| **Custom Payloads** | 自定义载荷管理 | Marketplace |
| **Export Report Plus** | 增强报告导出 | Marketplace |
| **Python Scripting** | Python 脚本引擎 | 默认 |

### 6.2 安装与管理

```
Tools → Marketplace → Browse:
1. 选择需要安装的插件
2. 点击 Install
3. 重启 ZAP

更新：
Tools → Marketplace → Check for Updates

卸载：
Tools → Marketplace → Installed → 选择 → Uninstall
```

---

## 七、ZAP 常用 API 调用

### 7.1 REST API 示例

```bash
# 基础信息
curl http://localhost:8090/JSON/core/view/version/

# 启动主动扫描
curl "http://localhost:8090/JSON/ascan/action/scan/?url=https://target.com"

# 查看扫描状态
curl "http://localhost:8090/JSON/ascan/view/status/"

# 获取告警
curl "http://localhost:8090/JSON/core/view/alerts/"

# 导出 HTML 报告
curl "http://localhost:8090/OTHER/core/other/htmlreport/" > report.html
```

### 7.2 Python API 封装

```python
from zapv2 import ZAPv2
import time

zap = ZAPv2(proxies={'http': 'http://localhost:8090', 'https': 'http://localhost:8090'})

target = 'https://example.com'

# Spider 爬取
print("Starting Spider...")
zap.spider.scan(target)
while int(zap.spider.status()) < 100:
    print(f"Spider progress: {zap.spider.status()}%")
    time.sleep(5)

# 主动扫描
print("Starting Active Scan...")
zap.ascan.scan(target)
while int(zap.ascan.status()) < 100:
    print(f"Scan progress: {zap.ascan.status()}%")
    time.sleep(5)

# 导出告警
alerts = zap.core.alerts()
for alert in alerts:
    print(f"[{alert['risk']}] {alert['alert']}: {alert['url']}")
```

---

## 八、常见漏洞检测示例

### 8.1 SQL 注入检测

```
ZAP 检测 SQL 注入流程：
1. 识别注入点（URL参数、POST body、Cookie）
2. 注入测试 payload（' " -- # 等）
3. 检测数据库错误信息
4. 时间盲注检测（benchmark/sleep）
5. 如果发现 → 告警：[High] SQL Injection
```

### 8.2 XSS 检测

```
检测流程：
1. 在每个输入点插入 <zapxss> 标记
2. 在响应中搜索 <zapxss>
3. 确认注入位置（HTML body/attribute/JS context）
4. 构造 PoC payload
5. 分类：Reflected / Stored / DOM-based
```

---

## 九、ZAP vs Burp Suite 决策树

```
你是：
├─ 初学者 / 学生？ → ZAP（免费、社区活跃）
├─ 预算有限？ → ZAP（完全免费）
├─ 需要 CI/CD 集成？ → ZAP（Docker 原生）
├─ 专业渗透测试？ → Burp Pro
├─ 需要扩展性？ → Burp Pro（更成熟的插件生态）
├─ 开源要求？ → ZAP
└─ 两者结合？ → ZAP 自动化 + Burp Repeater 手工验证
```

---

## 十、安全合规

1. **授权扫描**：确认有书面授权
2. **扫描范围**：Context 正确配置 Scope
3. **数据保护**：ZAP 本地存储可能含敏感数据
4. **Docker 安全**：`--network host` 可能暴露服务
5. **速率控制**：生产环境主动扫描可能影响服务
6. **结果保密**：扫描报告含漏洞详情，妥善保管

---

> 📖 本文为"网安百宝箱"课程配套读物。更新于 2026-06-18
