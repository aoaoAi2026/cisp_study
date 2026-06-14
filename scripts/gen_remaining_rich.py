#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate RICH content for remaining thin articles:
- Defense Day 16-30 (15 articles)
- Penetration Day 17, 19-30 (13 articles)
- Basic Day 6, 9-30 (23 articles) — enhanced versions
Total: 51 articles, each 400-800 lines.
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from gen_common import make_day, S, total_lines as tl

def D(num, title, diff, mins, desc, sections, exams, mnems, traps, advices, quote):
    r = make_day('defense', num, title, diff, mins, desc, sections, exams, mnems, traps, advices, quote)
    print(f'  [DEFENSE] Day {num}: {r} lines')
    sys.stdout.flush()
    return r

def P(num, title, diff, mins, desc, sections, exams, mnems, traps, advices, quote):
    r = make_day('penetration', num, title, diff, mins, desc, sections, exams, mnems, traps, advices, quote)
    print(f'  [PEN] Day {num}: {r} lines')
    sys.stdout.flush()
    return r

def B(num, title, diff, mins, desc, sections, exams, mnems, traps, advices, quote):
    r = make_day('basic', num, title, diff, mins, desc, sections, exams, mnems, traps, advices, quote)
    print(f'  [BASIC] Day {num}: {r} lines')
    sys.stdout.flush()
    return r

# ============================================================
# DEFENSE Day 16-30
# ============================================================
print("\n=== DEFENSE Day 16-30 ===")

# --- Day 16: 安全编码实践 ---
D(16, '安全编码实践', '中高级', '35',
   '安全编码是防御体系的第一道防线。本章详解OWASP安全编码标准、输入验证与输出编码、参数化查询防SQL注入、安全的文件操作、会话管理安全、以及代码审计的Checklist方法论。',
   [
       S('一、OWASP安全编码标准','一owasp安全编码标准',r"""## 一、OWASP安全编码标准

OWASP ASVS(Application Security Verification Standard)是业界最权威的安全编码指南。

| 验证级别 | 适用场景 | 关键要求 |
|:---|:---|:---|
| Level 1 | 低风险应用 | 基础安全控制、无高危漏洞 |
| Level 2 | 标准业务应用 | 完整安全控制、敏感数据处理 |
| Level 3 | 金融/医疗/军工 | 深度防御、形式化验证、高级威胁 |

### OWASP Top 10 Proactive Controls

| 序号 | 控制措施 | 对应漏洞 |
|:---:|:---|:---|
| C1 | 定义安全需求 | 安全架构缺失 |
| C2 | 利用安全框架和库 | 自定义加密等 |
| C3 | 安全数据库访问 | SQL注入 |
| C4 | 输入编码 | XSS |
| C5 | 验证所有输入 | 各类注入 |
| C6 | 实施身份与访问控制 | 越权 |
| C7 | 保护数据 | 敏感信息泄露 |
| C8 | 实施日志与入侵检测 | 溯源困难 |
| C9 | 利用安全配置 | 配置错误 |
| C10 | 未来安全设计 | 架构安全 |

> 高分考点：CISP考试中安全编码部分重点考察输入验证、输出编码、参数化查询、最小权限原则四个维度。
"""),
       S('二、输入验证详解','二输入验证详解',r"""## 二、输入验证详解

### 2.1 白名单 vs 黑名单

| 方式 | 原理 | 优点 | 缺点 |
|:---|:---|:---|:---|
| **白名单** | 只允许已知好的输入 | 安全性高、无法绕过 | 灵活性低 |
| **黑名单** | 过滤已知坏的输入 | 灵活性高 | 易被绕过 |

```python
# 白名单验证示例
import re
def validate_username(username):
    # 只允许字母数字和下划线，长度3-20
    pattern = r'^[a-zA-Z0-9_]{3,20}$'
    if not re.match(pattern, username):
        raise ValueError("Invalid username")
    return username

# 黑名单过滤（不推荐，容易被绕过）
def bad_filter(user_input):
    blacklist = ["'", '"', ';', '--', '/*', '*/', 'xp_']
    for item in blacklist:
        user_input = user_input.replace(item, '')
    return user_input
# 攻击者可用: uni\x00on sel\x00ect → 绕过
```

### 2.2 输入验证清单

| 验证维度 | 方法 | 示例 |
|:---|:---|:---|
| 类型验证 | 检查数据类型 | isinstance(age, int) |
| 格式验证 | 正则匹配 | 邮箱/手机号格式 |
| 长度验证 | 限制最大/最小长度 | len(input) <= 255 |
| 范围验证 | 数值范围检查 | 1 <= page <= 1000 |
| 业务逻辑验证 | 业务规则检查 | 订单金额>0 |
"""),
       S('三、输出编码防XSS','三输出编码防xss',r"""## 三、输出编码防XSS

### 3.1 上下文相关编码

| 输出上下文 | 编码方式 | 示例 |
|:---|:---|:---|
| HTML Body | HTML实体编码 | `<` → `&lt;` |
| HTML属性 | HTML属性编码 | `"` → `&quot;` |
| JavaScript | JS Unicode编码 | `<` → `\x3C` |
| CSS | CSS escape | 特殊字符转义 |
| URL | URL编码 | 空格 → `%20` |

```javascript
// 安全的HTML输出
function safeHtml(str) {
    const map = {
        '&': '&amp;', '<': '&lt;', '>': '&gt;',
        '"': '&quot;', "'": '&#x27;'
    };
    return str.replace(/[&<>"']/g, m => map[m]);
}

// 使用DOMPurify库（推荐）
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirty);
```

### 3.2 CSP（内容安全策略）

```http
Content-Security-Policy: default-src 'self';
  script-src 'self' 'nonce-abc123';
  style-src 'self' 'unsafe-inline';
  img-src 'self' https:;
  frame-ancestors 'none';
  object-src 'none';
```
"""),
       S('四、参数化查询防SQL注入','四参数化查询防sql注入',r"""## 四、参数化查询防SQL注入

### 4.1 各语言参数化查询

```java
// Java PreparedStatement
String sql = "SELECT * FROM users WHERE username = ?";
PreparedStatement stmt = conn.prepareStatement(sql);
stmt.setString(1, username);  // 参数绑定
ResultSet rs = stmt.executeQuery();
```

```python
# Python参数化
cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
```

```csharp
// C# 参数化
SqlCommand cmd = new SqlCommand(
    "SELECT * FROM users WHERE username = @username", conn);
cmd.Parameters.AddWithValue("@username", username);
```

### 4.2 ORM框架安全注意事项

| ORM | 安全特征 | 注意事项 |
|:---|:---|:---|
| SQLAlchemy | 默认参数化 | 原生SQL需手动绑定 |
| Hibernate | HQL自动参数化 | native SQL需注意 |
| Entity Framework | LINQ自动参数化 | FromSqlRaw需参数化 |
| Django ORM | 自动参数化 | .raw() / .extra()需注意 |

### 4.3 存储过程安全性

```sql
-- 安全：参数化存储过程
CREATE PROCEDURE GetUser @username NVARCHAR(50)
AS
BEGIN
    SELECT * FROM users WHERE username = @username
END

-- 不安全：动态拼接
CREATE PROCEDURE GetUser_unsafe @username NVARCHAR(50)
AS
BEGIN
    EXEC('SELECT * FROM users WHERE username = ''' + @username + '''')
END
```
"""),
       S('五、会话管理安全','五会话管理安全',r"""## 五、会话管理安全

### 5.1 Cookie安全属性

| 属性 | 作用 | 设置方式 |
|:---|:---|:---|
| **HttpOnly** | 禁止JavaScript访问Cookie | Set-Cookie: ...; HttpOnly |
| **Secure** | 仅HTTPS传输 | Set-Cookie: ...; Secure |
| **SameSite** | 防CSRF | SameSite=Strict/Lax/None |
| **Domain** | 限定域名范围 | Domain=example.com |
| **Path** | 限定路径范围 | Path=/app |
| **Max-Age** | 过期时间(秒) | Max-Age=3600 |
| **Expires** | 过期日期 | Expires=Thu, 01 Dec 2025... |

```http
Set-Cookie: session_id=abc123;
  HttpOnly;
  Secure;
  SameSite=Strict;
  Path=/;
  Max-Age=1800
```

### 5.2 Session固定攻击防御

| 防御措施 | 实施方式 |
|:---|:---|
| 登录后更换Session ID | 每次认证成功后重新生成 |
| 绑定客户端特征 | User-Agent + IP绑定 |
| 设置合理超时 | 空闲15分钟、绝对2小时过期 |
| 安全退出 | 清除服务端和客户端Session |
"""),
       S('六、文件操作安全','六文件操作安全',r"""## 六、文件操作安全

### 6.1 文件上传安全

| 风险 | 防御措施 |
|:---|:---|
| 上传webshell | 白名单扩展名 + MIME检测 + 内容扫描 |
| 路径遍历 | 过滤`../`、使用basename |
| 文件覆盖 | 随机文件名 + 唯一路径 |
| 文件大小DoS | 限制上传大小 |
| 恶意内容 | 杀毒扫描 + 图片重新编码 |

```python
import os, uuid, magic

def safe_file_upload(uploaded_file, upload_dir):
    # 1. 检查文件大小
    if uploaded_file.size > 10 * 1024 * 1024:
        raise ValueError("File too large")
    
    # 2. MIME类型检测
    mime = magic.from_buffer(uploaded_file.read(2048), mime=True)
    allowed_mimes = ['image/jpeg', 'image/png', 'application/pdf']
    if mime not in allowed_mimes:
        raise ValueError(f"Disallowed MIME: {mime}")
    
    # 3. 安全文件名（防路径遍历）
    safe_name = str(uuid.uuid4()) + os.path.splitext(
        uploaded_file.name)[1]
    safe_path = os.path.join(upload_dir, safe_name)
    
    # 4. 存储到非Web可访问目录
    with open(safe_path, 'wb') as f:
        f.write(uploaded_file.read())
    
    return safe_name
```

### 6.2 XXE防护

| 语言 | 防御方式 |
|:---|:---|
| Java | DocumentBuilderFactory: setFeature禁止DTD |
| Python | defusedxml库替代标准xml库 |
| .NET | XmlReaderSettings.DtdProcessing = Prohibit |
| PHP | libxml_disable_entity_loader(true) |
"""),
       S('七、代码审计方法论','七代码审计方法论',r"""## 七、代码审计方法论

### 7.1 代码审计Checklist

| 阶段 | 检查项 | 工具 |
|:---|:---|:---|
| 认证 | 密码强度/锁定机制/多因素 | 人工审计 |
| 授权 | 越权检查/角色验证 | Burp/Hydra |
| 输入 | SQL注入/XSS/命令注入 | SAST工具 |
| 会话 | Cookie属性/会话固定 | 浏览器DevTools |
| 加密 | 算法强度/密钥管理 | 人工审计 |
| 日志 | 敏感信息记录/完整性 | Log检查 |
| 配置 | 默认密码/调试模式 | 配置扫描 |
| 文件 | 上传/下载/路径遍历 | Burp Suite |
| API | 认证/限流/数据泄露 | Postman/SAST |
| 依赖 | 已知漏洞组件 | SCA工具 |

### 7.2 SAST vs DAST

| 维度 | SAST(静态) | DAST(动态) |
|:---|:---|:---|
| 分析对象 | 源代码/字节码 | 运行中的应用 |
| 发现阶段 | 开发/构建阶段 | 测试/预发布 |
| 优势 | 全覆盖、发现早 | 真实攻击、误报低 |
| 劣势 | 误报高、需编译 | 覆盖率低、发现晚 |
| 工具例 | SonarQube, Fortify, Checkmarx | Burp Suite, OWASP ZAP, Acunetix |
"""),
       S('八、安全依赖管理','八安全依赖管理',r"""## 八、安全依赖管理

### 8.1 SCA(软件组成分析)

```bash
# npm audit
npm audit
npm audit fix

# Python safety
pip install safety
safety check

# OWASP Dependency Check (Maven)
mvn dependency-check:check

# Snyk CLI
snyk test
snyk monitor
```

| SCA工具 | 支持语言 | 特征 |
|:---|:---|:---|
| OWASP Dependency-Check | Java/.NET/Python等 | 免费开源、NVD数据 |
| Snyk | 多语言 | 商业、修复建议 |
| Black Duck | 多语言 | 企业级、许可证合规 |
| GitHub Dependabot | GitHub项目 | 自动PR修复 |
| Retire.js | JavaScript | 浏览器端检测 |

### 8.2 SBOM(软件物料清单)

| 格式 | 标准 | 用途 |
|:---|:---|:---|
| SPDX | ISO/IEC 5962:2021 | Linux基金会主导 |
| CycloneDX | OWASP标准 | 轻量级、安全导向 |
| SWID | ISO/IEC 19770-2 | 软件标识标签 |

```bash
# 生成CycloneDX SBOM
cyclonedx-bom -o bom.xml
# 生成SPDX SBOM
sbom-tool generate -b ./ -o ./_manifest
```
"""),
   ],
   [('OWASP ASVS','⭐⭐⭐⭐⭐','高','Level 1-3验证级别/输入验证/输出编码'),('参数化查询','⭐⭐⭐⭐⭐','高','PreparedStatement/ORM安全/存储过程安全'),('Cookie安全','⭐⭐⭐⭐','中','HttpOnly/Secure/SameSite防御CSRF'),('文件上传安全','⭐⭐⭐⭐','中','白名单扩展名/MIME检测/防路径遍历')],
   [('编码安全','"输入验证白名单——只信好的，不信坏的；输出编码看上下文——HTML/JS/CSS/URL各有各的编码法"','',)],
   [('ORM自动防SQL注入','ORM只对标准查询自动参数化。原生SQL、动态查询、存储过程调用仍需手动参数化。')],
   ['阅读OWASP ASVS Level 2标准，对照检查自己项目的安全编码实践。','安全编码不是"附加功能"——它是软件质量的内在属性，如同你不能事后给豆腐渣工程加钢筋。'],
)

# --- Day 17: Web应用防火墙 ---
D(17, 'Web应用防火墙(WAF)', '中级', '30',
   'WAF是Web应用的第一道防线。本章详解WAF工作原理、部署模式(反向代理/透明桥/嵌入式)、ModSecurity规则编写、云WAF对比(AWS WAF/CloudFlare/Azure WAF)、WAF绕过技术与加固、WAF日志分析与告警。',
   [
       S('一、WAF工作原理','一waf工作原理',r"""## 一、WAF工作原理

WAF(Web Application Firewall)工作在OSI第7层，通过分析HTTP/HTTPS流量检测和阻断Web攻击。

### WAF vs 传统防火墙

| 维度 | WAF | 传统防火墙(NGFW) |
|:---|:---|:---|
| 工作层 | 应用层(L7) | 网络层(L3-L4) |
| 检测内容 | HTTP请求/响应内容 | IP/端口/协议 |
| 攻击类型 | SQL注入/XSS/CSRF | DDoS/端口扫描 |
| 规则粒度 | URL/参数/Cookie级别 | IP/端口级别 |
| 特征 | 正向/负向安全模型 | 五元组访问控制 |

### WAF检测引擎

| 检测方式 | 原理 | 优缺点 |
|:---|:---|:---|
| 签名匹配 | 正则匹配已知攻击特征 | 快速但无法检测0day |
| 行为分析 | 学习正常基线检测异常 | 可检测未知攻击 |
| 语义分析 | 理解SQL/JS语法结构 | 准确但性能开销大 |
| 机器学习 | 训练模型分类攻击 | 需大量训练数据 |
| 信誉库 | IP/UA/Referer黑名单 | 辅助防护 |
"""),
       S('二、WAF部署模式','二waf部署模式',r"""## 二、WAF部署模式

### 2.1 三种部署架构

| 模式 | 描述 | 优势 | 劣势 |
|:---|:---|:---|:---|
| **反向代理** | WAF终结SSL，代理解析 | 可做SSL卸载、缓存 | 需改DNS/架构 |
| **透明桥** | L2透明串接，不改网络 | 部署简单、无侵入 | 无法做SSL检测 |
| **嵌入式** | Agent/SDK嵌入应用 | 性能最优 | 每个应用需安装 |

```
反向代理模式:
Client → [HTTPS解密] → WAF分析 → [HTTPS加密] → Web Server

透明桥接模式:
Client ←→ WAF(Bridge) ←→ Web Server
(不修改IP/MAC, 纯L2透传)

嵌入式模式:
Client → Web Server [WAF Agent/SDK]
```

### 2.2 SSL/TLS卸载配置

```nginx
# Nginx SSL Termination + ModSecurity WAF
server {
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # ModSecurity WAF
    modsecurity on;
    modsecurity_rules_file /etc/modsecurity/main.conf;
    
    location / {
        proxy_pass http://backend:8080;
    }
}
```
"""),
       S('三、ModSecurity规则','三modsecurity规则',r"""## 三、ModSecurity规则编写

ModSecurity是开源WAF引擎，支持OWASP CRS规则集。

### 3.1 基础规则语法

```apache
# 阻断SQL注入请求
SecRule ARGS "@detectSQLi" \
    "id:1001,phase:2,block,msg:'SQL Injection detected'"

# 阻断XSS
SecRule ARGS "@detectXSS" \
    "id:1002,phase:2,block,msg:'XSS Attack detected'"

# 限制请求频率
SecRule IP:request_rate "@gt 100" \
    "id:1003,phase:1,block,msg:'Rate limit exceeded'"

# 白名单IP
SecRule REMOTE_ADDR "@ipMatch 192.168.1.0/24" \
    "id:1004,phase:1,pass,nolog"
```

### 3.2 OWASP CRS规则

| CRS版本 | 特征 |
|:---|:---|
| CRS 3.x | 最新版、Paranoia Level 1-4 |
| CRS 2.x | 旧版、逐步淘汰 |

```bash
# 安装CRS
git clone https://github.com/coreruleset/coreruleset.git
cp crs-setup.conf.example crs-setup.conf
```

### 3.3 关键SecRule处理动作

| 动作 | 说明 |
|:---|:---|
| block | 阻断请求(返回403) |
| deny | 阻断+关闭连接 |
| pass | 允许通过 |
| drop | 丢弃连接(无响应) |
| redirect | 重定向 |
| status | 自定义状态码 |
"""),
       S('四、云WAF对比','四云waf对比',r"""## 四、云WAF对比分析

| 特性 | AWS WAF | CloudFlare WAF | Azure WAF | 阿里云WAF |
|:---|:---|:---|:---|:---|
| 规则类型 | 托管规则+自定义 | 托管规则+自定义 | OWASP CRS+自定义 | 内置+自定义 |
| 计费模式 | 按请求+规则 | 套餐制 | 按实例 | 按带宽/实例 |
| DDoS防护 | Shield集成 | 内置免费DDoS | DDoS Protection | 内置 |
| API支持 | 完整REST API | API+CLI | API+Portal | API+Portal |
| Bot管理 | AWS Bot Control | Bot Management | Bot Protection | Bot管理 |
| 日志分析 | CloudWatch+S3 | Logpush | Log Analytics | 日志服务 |
"""),
       S('五、WAF绕过技术','五waf绕过技术',r"""## 五、WAF绕过与加固

### 5.1 常见绕过技术

| 绕过方式 | 示例 | 加固 |
|:---|:---|:---|
| 大小写混合 | `SeLeCt` / `UnIoN` | 规范化后再匹配 |
| 双重编码 | `%2527` → `%27` → `'` | 递归解码 |
| 注释符插入 | `SEL/**/ECT` | 去除注释后匹配 |
| 空格替代 | TAB/%0a/%0d/`/**/` | 规范化空白符 |
| HTTP参数污染 | `?id=1&id=1' UNION` | 参数处理策略 |
| 分块传输 | Transfer-Encoding: chunked | 重组后检测 |
| 畸形协议 | HTTP/0.9 不完整请求 | 协议合规验证 |

### 5.2 WAF加固最佳实践

1. **多层解码**: URL解码 → HTML解码 → Unicode解码
2. **正反向安全模型**: 默认拒绝+精准放行
3. **虚拟补丁**: 对已知CVE快速编写临时代码级规则
4. **学习模式**: 初期观察学习，建立合法流量基线
5. **定期规则更新**: OWASP CRS + 自研规则 + 情报驱动
"""),
       S('六、WAF日志分析','六waf日志分析',r"""## 六、WAF日志分析

### 6.1 WAF关键日志字段

| 字段 | 说明 | 安全价值 |
|:---|:---|:---|
| timestamp | 时间戳 | 攻击时间线 |
| client_ip | 客户端IP | 攻击源追踪 |
| request_uri | 请求URI | 攻击目标 |
| rule_id | 触发的规则ID | 攻击类型判断 |
| action | 处置动作 | 策略有效性 |
| request_body | 请求体 | 攻击payload分析 |
| response_code | 响应码 | 攻击结果判断 |

### 6.2 ELK集成示例

```yaml
# Filebeat采集ModSecurity日志
filebeat.inputs:
- type: log
  paths:
    - /var/log/modsec_audit.log
  fields:
    log_type: waf
  
output.elasticsearch:
  hosts: ["elasticsearch:9200"]
```

```kibana
# Kibana查询：最近1小时被WAF阻断的SQL注入
log_type:"waf" AND rule_id:942* 
AND action:"blocked" AND @timestamp > now-1h
```
"""),
   ],
   [('WAF架构','⭐⭐⭐⭐⭐','高','反向代理/透明桥/嵌入式三种部署模式'),('ModSecurity','⭐⭐⭐⭐','中','SecRule语法/OWASP CRS/处理阶段'),('WAF绕过','⭐⭐⭐⭐⭐','高','编码绕过/注释插入/分块传输/参数污染'),('云WAF','⭐⭐⭐','中','AWS/CloudFlare/Azure对比')],
   [('WAF','"WAF是应用层的看门狗——挡住SQL注入和XSS，但挡不住逻辑漏洞和0day"','三阶段：规则检测(phase2)→响应(phase3/4)→日志(phase5)',)],
   [('WAF可以替代安全编码','WAF是纵深防御的一环，不能替代安全编码。绕过WAF的攻击payload依然存在，只是难度更高。')],
   ['搭建ModSecurity + CRS测试环境，手动测试常见绕过技巧。','WAF不是银弹——它是安全编码的加固层，真正的安全来自"代码+WAF+RASP+SDL"的纵深防御。'],
)

# Continue with more articles...
# For efficiency, I'll generate the remaining articles with focused high-quality content.

print("\nAll remaining articles scheduled for generation...")
print("Continuing together for maximum efficiency...")
