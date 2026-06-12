# Burp Suite 高级利用技巧

## 1. Burp Suite 模块总览

Burp Suite 是 Web 安全从业者最常使用的工具集。下面是其核心模块与高级用法：

| 模块 | 功能 | 高级用法 |
|------|------|---------|
| **Proxy** | HTTP / HTTPS 拦截与修改 | 匹配替换 / 自动加 Header / 双向 TLS |
| **Repeater** | 手动重放与调试请求 | 分组管理 / 标签页 / 自动更新目标 Cookie |
| **Intruder** | 自动化暴力 / 枚举 / 批量请求 | Sniper / Pitchfork / Clusterbomb / grep / recursive grep |
| **Scanner (Burp Pro)** | 主动 / 被动扫描 | 自定义扫描规则 / 自定义插入点 / Bambda 过滤器 |
| **Extender** | Python / Java / Ruby 插件 | 自定义插件 / 自动化流程 / 第三方扩展市场 |
| **Decoder** | Base64 / URL / Hex / Unicode 等编解码 | 多层编解码链 / 智能识别 |
| **Comparer** | 对比请求 / 响应差异 | IDOR / 越权场景下对比两个角色响应 |
| **Sequencer** | Token 随机性分析 | Session / CSRF Token 熵值评估 |
| **Macro / Session Rules** | 自动处理登录态 / Token | 每次请求前先更新会话状态 / 自动更新 CSRF Token |
| **Project options** | 任务配置、TLS、Cookie 策略 | 自定义 TLS 证书 / SOCKS 代理链 / Upstream Proxy |

## 2. 主动扫描与自定义规则

### 2.1 主动扫描深度配置

```
Target → Scope → Include in scope: https://target.com/
Target → 选中目标右键 → Actively scan this host
Scanner → Options：
  - Attack insertion points (注入点)：URL 参数、Body、Cookie、XML 属性、JSON
  - Active scanning engine (主动扫描引擎)：线程数、超时、最大链接
  - Issues reported (报告问题类型)：可勾选重点关注类别
```

### 2.2 自定义插入点

在 Repeater 中选中要模糊测试的位置，右键 → `Send to Intruder`，在 Intruder 中 `Positions` 标签页使用 `Add §` 手动标注插入点。对于复杂的 JSON / XML / GraphQL 请求非常有用。

```
POST /api/v1/user HTTP/1.1
Host: target.com
Content-Type: application/json

{"uid": §1001§, "action": "view"}
```

### 2.3 自定义 Payload

Intruder → Payloads → Payload type 可选：

```
- Simple list        : 纯字典
- Runtime file       : 大字典文件（按行读取，不占内存）
- Numbers            : 数字范围（1-100, 递增）
- Dates              : 日期枚举
- Character frobber  : 逐字符翻转 / 模糊测试
- Character blocks   : 大块字符填充
- Bit flipper        : 位翻转
- Username generator : 基于常见姓名生成字典
- Copy other payload : 复用已定义 payload
```

### 2.4 Bambda / 自定义匹配

Burp 2023+ 引入 Bambda（Java 风格 lambda 表达式）可以细粒度控制 payload 编码、匹配、URL 解析等行为：

```java
// Payload 处理：将字典中每一行做 base64
return java.util.Base64.getEncoder().encodeToString(payload.getBytes());

// 插入点判断：排除 CSRF Token
return !insertionPoint.getName().equals("csrf_token");
```

## 3. Macro 与 Session 规则

### 3.1 场景：CSRF Token 自动更新

当应用每次请求返回不同 CSRF Token 时，Intruder 会在第一次成功后失败。解决方案：

1. 在 Proxy 记录一次正常的首页请求，得到含有 CSRF Token 的响应；
2. `Settings → Sessions → Session handling rules → Add`：
   - Rule actions → Add → Run a macro；
   - Macro editor → Add → 选择刚才的首页请求；
   - Configure item → Custom parameter locations in response → 高亮选中 Token 值；
   - 保存，设置 scope：对 Intruder / Scanner / Repeater 生效；
3. 再发 Intruder 请求时，每次攻击前都会先运行 Macro 抓取新 Token。

### 3.2 场景：自动登录保持会话

```
Rule: "Auto-login on 403"
Action 1: Check current response is 403 / redirect to login
Action 2: Run macro (submit login form with valid credentials)
Action 3: Update cookie jar
Action 4: Re-issue the original request with new cookies
Scope: https://target.com/*
```

## 4. Burp Extender（插件开发）

### 4.1 安装 BApp

```
Extender → BApp Store → 搜索并安装常用插件：
- Autorize           ：自动化越权测试（A/B 角色对比）
- Param Miner        ：自动发现隐藏参数
- JWT Editor         ：JWT 修改 / 签名伪造
- HTTP Request Smuggler：HTTP 走私扫描
- JSON Web Tokens    ：JWT 检测
- Active Scan++      ：增强主动扫描 payload
- CO2                ：SQLMap / Shell / Cookie 工具集合
- Wsdler             ：SOAP Web Service 解析
```

### 4.2 简单插件结构（Python / jython）

```python
from burp import IBurpExtender, IHttpListener

class BurpExtender(IBurpExtender, IHttpListener):
    def registerExtenderCallbacks(self, callbacks):
        self._callbacks = callbacks
        self._helpers = callbacks.getHelpers()
        callbacks.setExtensionName("My Logger")
        callbacks.registerHttpListener(self)

    def processHttpMessage(self, toolFlag, messageIsRequest, messageInfo):
        if not messageIsRequest:
            # 打印响应长度
            resp = messageInfo.getResponse()
            print("Response length:", len(resp))
```

### 4.3 自定义 Scanner 检查（扩展 IScannerCheck）

```python
from burp import IScannerCheck, IScanIssue

class CustomScanCheck(IScannerCheck):
    def doPassiveScan(self, baseRequestResponse):
        # 被动分析：检查 Response 是否含 "password" 明文
        body = self._helpers.bytesToString(baseRequestResponse.getResponse()).lower()
        if "password" in body:
            return [CustomIssue(baseRequestResponse)]
        return None

    def doActiveScan(self, baseRequestResponse, insertionPoint):
        return None
```

## 5. 隐藏功能与进阶技巧

### 5.1 搜索整个项目历史

```
HTTP history → Filter → Search by regex:
"api_secret|apikey|access_token|BEGIN RSA|-----BEGIN"
用于快速在流量中发现密钥、凭证。
```

### 5.2 高亮与注释

```
在 HTTP history / Proxy history 中右键 → Add comment / Highlight
配合颜色区分：红色=高危、橙色=中危、黄色=信息点、绿色=已复核。
```

### 5.3 自定义 TLS 与双向认证

```
Settings → Network → TLS → Client TLS certificates → Add
提交目标要求的 .p12 / .pem 客户端证书，测试 HTTPS 双向认证场景。
```

### 5.4 Upstream Proxy 链

```
Settings → Network → Connections → Upstream proxy servers
添加规则：
Destination host: *.internal.company.com
Proxy host: internal-proxy
Port: 8080
```

### 5.5 在 Repeater 中快速修改 Content-Type

```
右键 → Change request method (GET ↔ POST)
右键 → Change body encoding (URL-encoded ↔ JSON ↔ XML ↔ multipart)
快速验证服务端解析差异，发现 WAF 绕过点。
```

## 6. 与其它工具链协同

### 6.1 导出流量给 sqlmap / Xray

```bash
# 1) 在 Burp 中：Project options → Misc → Logging → Requests/Responses 导出
# 2) 在 sqlmap 中使用
sqlmap -l burp.log --batch

# 3) 也可以把目标请求复制为 cURL：在 Repeater 中右键 → Copy as curl command
curl -X POST 'https://target.com/login' ...
```

### 6.2 配合 Nuclei / ffuf / dirsearch 做联动

```bash
# 使用 Burp 代理 + 其它工具
nuclei -u https://target.com -proxy http://127.0.0.1:8080
ffuf -w list.txt -u https://target.com/FUZZ -x http://127.0.0.1:8080
```

## 7. 使用建议

1. **建项目文件**：每个目标保存为独立 `.burp` 项目，避免历史混在一起；
2. **设置 Scope**：严格定义 Scope，避免扫描误伤；
3. **自定义字典**：在 Intruder Payload Sets 中加入公司内部账号字典、常见接口路径；
4. **插件精而简**：只装常用插件，过多插件拖慢速度且不稳定；
5. **定期备份**：Burp 项目文件可压缩备份，历史记录对复现漏洞至关重要。
