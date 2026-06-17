# Day 13：WAF高级规则与绕过防护
## 你的Web"看门保安"可能被太多人骗过了

---

> 🎯 **今日目标**  
> 掌握WAF绕过手法 · 理解高级规则编写 · 学习WAF性能优化

---

## 📖 一、WAF是什么？——网站的"安检门"

WAF（Web应用防火墙）= 网站的专属保安：

```
正常用户：  "你好，我想看看产品"
WAF：        "没问题，请进"

攻击者：    "我想在你们的数据库里搞点破坏"  ← SQL注入
WAF：        "🚫 检测到SQL注入攻击，拒绝访问！"

攻击者：    "<script>偷Cookie</script>"  ← XSS
WAF：        "🚫 检测到XSS攻击，拒绝访问！"

攻击者：    "../../etc/passwd"  ← 路径遍历
WAF：        "🚫 路径遍历攻击，拒绝！"
```

**但问题是：攻击者会不断寻找绕过后门的方法！** 这就像安检门——一开始只能检测到金属，后来有人找到办法把枪拆成零件分开放……

---

## 📖 二、WAF是怎么被绕过的？——攻击者的"骗术大全"

### 🎭 绕过手法1：大小写混用

```
WAF规则：检测 "union select"（SQL注入特征）

攻击者绕过：
  Union SeLect         → WAF：这词不在黑名单里？放行！
  uNiOn sElEcT         → WAF：也不是黑名单？放行！

SQL数据库：大小写不敏感，UnIoN sElEcT 和 union select 一样执行！
```

### 🎭 绕过手法2：注释插入

```sql
正常注入：  ' UNION SELECT password FROM users--

WAF：       "UNION SELECT" → 在黑名单！拒绝！

绕过注入：  ' UN/**/ION SEL/**/ECT password FROM users--

WAF看到：   UN 和 ION 被注释隔开了 → 不认识 → 放行！
SQL看到：   注释被忽略 → UNION SELECT → 执行！
```

### 🎭 绕过手法3：双重URL编码

```
正常：      ' OR '1'='1

WAF检测：   看到单引号 → 可疑！拒绝！

绕过：      %25%32%37+OR+%25%32%37+1%25%32%37%3D%25%32%37+1

解释：      %25 = % 符号
            %32%37 = '
            所以 %25%32%37 → %%32%37 → %27 → '  ！

WAF：       没看到单引号，都是%XX → 放行！
Web服务器： 解码后 → ' OR '1'='1 → SQL注入了！
```

### 🎭 绕过手法4：分块传输编码（Chunked Transfer）

```
正常HTTP请求：
  POST /login HTTP/1.1
  Content-Length: 30
  username=admin&password=123

分块传输：
  POST /login HTTP/1.1
  Transfer-Encoding: chunked
  
  5
  usern
  5
  ame=a
  6
  dmin' OR 1=1--

WAF看到： 每次只看到一小块 → 拼不起来 → 判断"无害" → 放行！
服务器：   把小块拼起来 → 哦不，是SQL注入！
```

### 🎭 绕过手法5：HTTP参数污染

```
正常请求：  /search?q=hello

攻击请求：  /search?q=hello&q=SELECT * FROM users

不同服务器对重复参数的处理：
  Apache：    取第一个 → q=hello → 安全
  Tomcat：    取第一个 → q=hello → 安全
  IIS/ASP：   取最后一个 → q=SELECT * FROM users → 危险！

→ 如果WAF和服务器对重复参数的理解不一致，就会被绕过！
```

---

## 📖 三、高级WAF规则——从"识字"到"懂意思"

### 🧠 基于语义分析的规则

传统WAF只看"关键词"，高级WAF尝试"理解"语义：

```
普通WAF规则：
  IF 请求里有 "UNION SELECT" → 拦截
  问题：正常业务也可能会用到这两个词

语义分析WAF：
  解析SQL语句的语法树
  IF 这是一个合法的查询语句 → 放行
  IF 这个查询想从users表拿password → 拦截
```

### 📊 基于行为的规则

```
不再只看单次请求，而是看行为模式：

1️⃣ 频率检测：
  同一个IP在1秒内发来50个类似SQL注入的请求
  → 不管单次是否拦截成功，直接将IP加入黑名单

2️⃣ 请求序列分析：
  第1个请求：扫描目录 (探测漏洞)
  第2个请求：尝试注入 (寻找注入点)  
  第3个请求：构造Payload (执行注入)
  → 虽然单个请求可能绕过WAF，但行为序列暴露了攻击意图

3️⃣ 机器学习异常检测：
  学习正常的业务流量模式
  → 任何偏离"正常模式"的请求都报警
```

---

## 📖 四、WAF部署的三种模式

| 模式 | 工作原理 | 优点 | 缺点 |
|------|----------|------|------|
| **透明代理** | 像网桥一样串在网络里，对应用无感知 | 不改网络，部署快 | 功能受限 |
| **反向代理** | 替代Web服务器对外提供端口 | 功能完整，能做SSL卸载 | 要改DNS/网络 |
| **嵌入式** | 作为Web服务器的模块（如ModSecurity+Apache） | 性能好，集成度高 | 耦合度高，维护复杂 |

### 护网推荐的WAF部署架构

```
互联网用户
    │
    ▼
DDoS高防（第一层）
    │
    ▼
云WAF（第二层——大规模规则库）
    │
    ▼
本地WAF（第三层——业务定制规则）
    │
    ▼
Web服务器 + RASP（第四层——运行时防护）
```

---

## 📖 五、护网期间WAF最佳实践

```
⚔️ 战前准备（护网前7天）：
  1. WAF规则升级到最新版
  2. 添加虚拟补丁（针对最近的高危漏洞）
  3. 业务白名单配置（避免误拦正常业务）
  4. 压测验证性能（别让WAF成为瓶颈）
  5. 配置告警通知（WAF日志实时推送到SIEM）

🛡️ 战时策略（护网期间）：
  1. 防护级别：最高（严格模式）
  2. 自动封禁：开启（攻击IP自动封禁X分钟）
  3. 虚拟补丁：全部开启
  4. 实时监控：WAF日志每分钟检查一次
  5. 弹性扩容：准备好应对DDoS流量

📊 每日检查清单：
  □ WAF有没有误拦正常业务？
  □ 有没有新的攻击手法出现？
  □ 拦截量趋势（上升还是下降？）
  □ WAF自身CPU/内存是否正常？
```

---

## 💻 六、动手试试：WAF绕过检测器

```python
# WAF绕过手法自动检测
import re

class WAFBypassDetector:
    def __init__(self):
        self.bypass_attempts = []
    
    def analyze_request(self, request_url, request_body=''):
        """分析请求中是否存在WAF绕过手法"""
        
        full_request = request_url + ' ' + request_body
        
        # 检测1：双重URL编码
        if '%25' in full_request:
            # %25 = % → 二次解码后可能有攻击payload
            self.bypass_attempts.append({
                'technique': '双重URL编码',
                'risk': '🔴',
                'explanation': '请求包含%25(%的编码)，可能用于二次解码绕过WAF'
            })
        
        # 检测2：大小写混用（SQL关键字）
        mixed_case_patterns = [
            (r'(?i)uni(?i)on.*sel(?i)ect', 'UNION SELECT大小写混用'),
            (r'(?i)sel(?i)ect.*fr(?i)om', 'SELECT FROM大小写混用'),
            (r'(?i)or(?i)d(?i)er.*b(?i)y', 'ORDER BY大小写混用'),
        ]
        for pattern, desc in mixed_case_patterns:
            if re.search(pattern, full_request):
                # 检查是否真的是大小写混用（不是全大写也不是全小写）
                matched = re.search(pattern, full_request).group()
                if matched != matched.lower() and matched != matched.upper():
                    self.bypass_attempts.append({
                        'technique': f'大小写混用 - {desc}',
                        'risk': '🟠',
                        'explanation': f'"{matched}"使用了大小写混用来绕过WAF'
                    })
        
        # 检测3：SQL注释插入
        if re.search(r'/\*.*\*/', full_request):
            comment_injection = re.findall(r'/\*.*?\*/', full_request)
            for comment in comment_injection:
                if len(comment) < 20:  # 短注释可能是注入的一部分
                    self.bypass_attempts.append({
                        'technique': 'SQL注释插入绕过',
                        'risk': '🔴',
                        'explanation': f'发现可疑短注释: {comment}'
                    })
        
        # 检测4：分块传输编码
        if 'chunked' in full_request.lower() or 'transfer-encoding' in full_request.lower():
            self.bypass_attempts.append({
                'technique': '分块传输编码',
                'risk': '🟠',
                'explanation': '使用chunked Transfer-Encoding可能用于分块绕过WAF'
            })
    
    def report(self):
        """输出检测报告"""
        if not self.bypass_attempts:
            print('✅ 未检测到WAF绕过手法')
            return
        
        print('=== 🛡️ WAF绕过检测报告 ===\n')
        for i, attempt in enumerate(self.bypass_attempts, 1):
            print(f'{i}. {attempt["risk"]} [{attempt["technique"]}]')
            print(f'   {attempt["explanation"]}\n')
        
        print(f'📊 总计检测到 {len(self.bypass_attempts)} 种可能的绕过手法')

# === 测试 ===
detector = WAFBypassDetector()

# 模拟攻击请求
detector.analyze_request('/search?q=UNion/**/SeLECT+*+FROM+users')
detector.analyze_request('/product?id=%25%32%37+or+1=1')
detector.analyze_request('/', 'POST /login\r\nTransfer-Encoding: chunked')

detector.report()
```

---

## 🧪 七、今日实验：WAF攻防对抗

### 实验目标
配置WAF规则并尝试绕过，体验攻防博弈

### 实验步骤

```
1️⃣ 部署ModSecurity + CRS规则集
   docker run -d -p 80:80 owasp/modsecurity-crs

2️⃣ 用SQLMap尝试注入（被拦截）
   sqlmap -u "http://localhost?id=1"
   → 应该被WAF拦截

3️⃣ 尝试绕过WAF
   ☑ 用 --tamper=space2comment 绕过
   ☑ 用 --tamper=charencode 绕过
   ☑ 写自己的tamper脚本

4️⃣ 蓝队视角：加强防护
   ☑ 编写自定义规则拦截绕过手法
   ☑ 添加行为分析规则（频率限制）
   ☑ 添加IP自动封禁

5️⃣ 再次攻击验证新规则是否生效
```

---

## 📝 八、今日测验

**Q1：以下哪种WAF绕过技术利用了HTTP协议特性？**
- A. SQL注入
- B. 分块传输编码  ✅
- C. XSS
- D. CSRF

> 分块传输将HTTP请求体分块发送，WAF可能只能看到不完整的片段。

**Q2：WAF虚拟补丁的主要作用是什么？**
- A. 修复系统漏洞
- B. 在WAF层面临时防护未修复的漏洞  ✅
- C. 更新操作系统
- D. 升级WAF版本

> 在官方补丁发布和应用前，虚拟补丁在WAF层阻止对漏洞的攻击，争取修复时间。

**Q3：护网期间WAF应该使用什么防护级别？**
- A. 最低
- B. 最高防护级别+自动封禁  ✅
- C. 关闭
- D. 保持不变

> 护网期间应使用最严格模式，宁可误拦几笔正常业务，也绝不放过一个攻击。

**Q4：双重URL编码绕过WAF的原理是什么？**
- A. 更快
- B. WAF解码一次后没发现攻击特征，但服务器解码两次后出现攻击payload  ✅
- C. 加密
- D. 压缩

> %25解码后是%，%27解码后是'。双重编码 = 编码后再编码，WAF通常只解码一次。

**Q5：WAF正则表达式性能问题最常见的原因是？**
- A. 规则太多
- B. 正则回溯爆炸（如(a+)+b式的灾难性回溯）  ✅
- C. 网络慢
- D. 内存小

> 某些正则表达式在匹配失败时会产生指数级回溯，严重消耗CPU。

---

## 📚 九、课后资源

| 资源 | 链接 | 说明 |
|------|------|------|
| Awesome-WAF | github.com/0xInfection/Awesome-WAF | WAF绕过技术大全 |
| ModSecurity | github.com/SpiderLabs/ModSecurity | 开源WAF引擎 |
| HTTP请求走私 | portswigger.net/web-security/request-smuggling | 高级绕过技术 |

---

## 🧠 十、专家锦囊

> **赵安全说：** WAF规则要跟着业务走。很多人抄网上的WAF规则就完了，这是不够的。每个业务有自己的URL结构、参数特征，WAF规则要针对性定制。先花一周时间学习业务正常流量是什么样的，再编写白名单+黑名单结合的规则。

---

📅 **Day 13 完成！** 今天你学会了WAF的高级攻防——知道攻击者怎么绕过，才知道怎么防得更牢！
