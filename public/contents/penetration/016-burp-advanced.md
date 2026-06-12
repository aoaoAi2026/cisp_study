# Burp Suite 高级利用技巧与插件实战

---

## 📋 目录

1. [基础配置优化](#一基础配置)
2. [Intruder 高级攻击模式](#二intruder)
3. [Repeater 高效技巧](#三repeater)
4. [Macro + Session 自动化认证](#四session认证)
5. [核心插件推荐](#五核心插件)
6. [BApp 扩展开发](#六扩展开发)
7. [完整案例](#七完整案例)

---

## 一、基础配置

### 1.1 代理配置

```
浏览器代理: 127.0.0.1:8080
Firefox: about:preferences → Network Settings
Chrome: 设置 → 系统 → 代理设置

HTTPS 证书安装:
  Burp → Proxy → Options → Import/Export CA Certificate
  → 导出 cert → 导入浏览器 → 信任为根证书

上游代理(配合 Xray/Nuclei):
  Burp → User Options → Upstream Proxy
  → 127.0.0.1:7777 → Xray 被动扫描
```

### 1.2 性能优化

```
无用的Target Scope设置:
  → Target → Scope → 添加目标域名/IP
  → 勾选 "Use advanced scope control"
  → Proxy → Options → "And URL is in target scope"

关闭不必要的日志:
  → Proxy → Options → 减少 "Response Modification"
  → Logger → 关闭非必要捕获
```

---

## 二、Intruder 高级模式

### 2.1 Cluster Bomb — 多参数Fuzz

```
场景: 登录接口爆破 username + password

Attack Type: Cluster bomb
Position 1: username=§admin§
Position 2: password=§password123§

Payload Set 1: admin,root,user,test
Payload Set 2: (加载密码字典)
→ 尝试所有组合: 10 usernames × 10000 passwords = 100000次
```

### 2.2 Pitchfork — 配对参数

```
Attack Type: Pitchfork
Position 1: user_id=§1§
Position 2: order_id=§1000§

Payload Set 1: 1,2,3,4,5...
Payload Set 2: 1000,1001,1002,1003...
→ 每次取两组Payload的同位置: (1,1000), (2,1001)...
→ 用于IDOR遍历
```

### 2.3 Battering Ram — 同值插入

```
Attack Type: Battering ram
同时注入多个位置 = 同一个值

用于发现反射型XSS等
```

### 2.4 Grep 精准匹配

```
Intruder → Options → Grep - Match
添加:
  "Welcome"          → 登录成功
  "Invalid"          → 登录失败
  "error"            → 错误
  "token"            → 提取Token

Grep - Extract:
  正则提取: "token":"([^"]+)"
  → 后续请求中使用
```

---

## 三、Repeater 技巧

### 3.1 快捷键

```
Ctrl+R     → 发送到 Repeater
Ctrl+Space → 重新发送请求
Ctrl+↑/↓   → 切换请求历史
Go 按钮    → 发送当前请求

Repeater → 右键 → "Send to Intruder" / "Send to Scanner"
```

### 3.2 Request 右键菜单

```
右键菜单:
  Change request method → GET↔POST 快速切换
  Copy as curl command  → 复制为 curl 命令
  Engagement tools → 
    Search → 搜索响应内容
    Find comments → 提取HTML/JS注释
    Find scripts → 提取JS文件
```

---

## 四、Session 认证自动化

### 4.1 Macro 配置

```
场景: 每次会话过期需要重新登录获取Token

Project Options → Sessions → Macros:
  Add → 录制登录过程:
    ① GET /login → 提取CSRF Token
    ② POST /login → 提取 Session Cookie
    ③ 验证登录成功

Session Handling Rules:
  Add → Rule Actions → "Run a macro"
  → 选择刚才录制的Macro
  → Scope: 所有需要认证的工具(Scanner/Intruder/Repeater)
```

### 4.2 Cookie Jar

```
Project Options → Sessions → Cookie Jar
→ Burp 自动管理 Cookie
→ Proxy 的响应中 Set-Cookie → 自动更新
→ 后续请求自动携带最新 Cookie
```

---

## 五、核心插件

### 5.1 Turbo Intruder

```
比原生Intruder快100倍

使用: 右键 → Extensions → Turbo Intruder → Send to Turbo Intruder

脚本示例:
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint,
                           concurrentConnections=30,
                           requestsPerConnection=100,
                           pipeline=False)
    
    for word in open('/usr/share/wordlists/rockyou.txt'):
        engine.queue(target.req, word.rstrip())

def handleResponse(req, interesting):
    if 'Welcome' in req.response:
        table.add(req)
```

### 5.2 AutoRepeater

```
自动替换请求中的值(如替换JSESSIONID/Cookie)
BApp Store → 搜索 AutoRepeater → Install

用途: 用低权限Token替换高权限Token → 检测越权
```

### 5.3 Logger++

```
增强版日志查看器
BApp Store → Logger++ → Install

功能:
  ✦ 高级过滤(按状态码/域名/MIME类型/关键词)
  ✦ 导出为 CSV/JSON
  ✦ 请求历史搜索
```

### 5.4 Hackvertor

```
编码/解码工具箱
BApp Store → Hackvertor → Install

支持:
  - Base64/URL/Hex/HTML实体
  - AES/DES/RSA 加解密
  - 自定义Tag扩展
```

---

## 六、扩展开发

### 6.1 Python 扩展示例

```python
# Burp Extension - 自动添加Auth Header
from burp import IBurpExtender, IHttpListener

class BurpExtender(IBurpExtender, IHttpListener):
    def registerExtenderCallbacks(self, callbacks):
        self._callbacks = callbacks
        self._helpers = callbacks.getHelpers()
        callbacks.setExtensionName("Auto Auth")
        callbacks.registerHttpListener(self)
        print("[+] Auto Auth loaded")
    
    def processHttpMessage(self, toolFlag, messageIsRequest, messageInfo):
        if messageIsRequest:
            request = messageInfo.getRequest()
            analyzedRequest = self._helpers.analyzeRequest(request)
            headers = analyzedRequest.getHeaders()
            
            # 添加认证头
            new_headers = list(headers)
            new_headers.append("Authorization: Bearer eyJhbGciOi...")
            
            body = request[analyzedRequest.getBodyOffset():]
            new_request = self._helpers.buildHttpMessage(new_headers, body)
            messageInfo.setRequest(new_request)
```

---

## 七、完整案例

### SQL注入全过程 (Burp工作流)

```
Step 1: 发现注入点
  Proxy → 浏览 https://xxx.com/product.php?id=1
  → HTTP History → 找到该请求 → Send to Repeater

Step 2: 确认注入
  Repeater: id=1' → 500错误
  Repeater: id=1'+AND+1=1--+ → 200 ✓
  → SQL注入确认！

Step 3: Intruder 爆破列数
  Send to Intruder → Position: id=1'+ORDER+BY+§1§--+
  Payload: 1-30
  → 第3列报错 → 共2列

Step 4: Union注入
  Repeater: id=-1'+UNION+SELECT+1,2--+
  → 第2列回显

Step 5: 获取数据
  Send to Intruder → Payload位置标记
  → 爆库/爆表/爆列/爆数据

Step 6: 保存状态
  Project Options → Save State → 下次打开继续
```

---

## ✅ Checklist

- [ ] HTTPS证书安装
- [ ] Scope 目标范围设置
- [ ] Intruder Cluster Bomb/Battering Ram熟练
- [ ] Session Macro录制(自动登录)
- [ ] Turbo Intruder安装
- [ ] AutoRepeater安装(越权检测)
- [ ] Hackvertor/Logger++安装
- [ ] 保存项目状态(.burp文件)
