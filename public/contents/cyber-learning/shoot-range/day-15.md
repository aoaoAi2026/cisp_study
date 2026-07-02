# Day 15：DVWA实战-JavaScript Attacks 前端 JS 闯关

> **🎯 靶场实战** | 难度：⭐⭐ | 预计学习：60 分钟

---

# 第15章 DVWA实战：JavaScript Attacks 前端 JS 闯关 🧩

哈喽各位小伙伴们大家好！👋 欢迎来到第15章！

不知不觉，咱们已经把 DVWA 的"四大金刚"（Insecure CAPTCHA、Weak Session IDs、CSP Bypass）都拿下啦！有没有觉得自己的"前端安全嗅觉"越来越灵敏了？😎 今天这一章，我们要攻克 DVWA 里一个非常有意思、又特别能锻炼"安全思维"的模块——**JavaScript Attacks（JS 攻击 / 前端闯关）**。

这个模块和别的模块不一样！之前的模块都是 Low/Medium/High/Impossible 四个级别考"同一个漏洞的四种防护强度"；但 JS 模块呢？它是**一个页面里藏着 4 个独立的小关卡（Tab）**，每一关都是一个**纯前端/前后端结合的小谜题**，考察的是你对 HTML、JavaScript、浏览器工作原理的理解深度——就像是"浏览器版本的密室逃脱"🔐，每一关给你一个提示，要你在前端页面里"找线索、解谜题、拿到通关密码"。

听起来是不是很好玩？🤩 这四关分别是：

| 关卡 | 考点 | 大白话翻译 |
|---|---|---|
| **第 1 关** | **信任前端变量 success** | 页面靠一个 `var success = false` 判断你有没有通关，改一下就过了 = "老师把答案写在试卷背面，你直接抄就行" |
| **第 2 关** | **前端加密算法可逆** | 前端 JS 把你的输入做了一层"加密"，但加密算法完全公开，你反向解密就过了 = "学校把密码本放在讲台上，你自己翻就能解码密文" |
| **第 3 关** | **Token 一次性使用（防刷新）** | 每次提交后 Token 就失效，看起来很厉害，但是我们可以"每次提交前先刷新页面偷新 Token" |
| **第 4 关** | **前端逻辑重放攻击** | 后端校验"顺序不能乱"，但每一步的令牌都在前端返回给你，我们一步一步把令牌全偷出来就能按顺序重放 |

每一关我都会带着大家走：**① 先模拟"正常玩家怎么玩" → ② 打开 F12 开发者工具"找线索" → ③ 思考"漏洞在哪" → ④ 亲手通关 → ⑤ 最后把前端源码和后端源码扒出来逐行解析**，零基础的小伙伴也完全能跟上！

坐稳扶好，咱们的"前端密室逃脱"开始啦！🚪✨

---

## 15.1 前置知识：为什么前端的任何东西都"不能信"？

### 15.1.1 生活比喻：考试"开卷考" vs "闭卷考" 📝

在正式闯关之前，我们先花 3 分钟搞懂一个贯穿整个 Web 安全的**宇宙级真理**——

> **🔴 铁律：前端（浏览器端）所有东西都是用户可控、用户可见、用户可篡改的，绝对不能把"校验逻辑"或"敏感数据"放在前端！**

用生活中的"考试"做比喻，一下子就懂了：

```
📖 闭卷考试（= 前端不可信的正确模式）
├── 题目写在试卷上（= 浏览器渲染 HTML/CSS/JS）
├── 你在草稿纸上答题（= 浏览器里用户输入数据）
├── 草稿纸写好后，把答案抄到答题卡上（= 浏览器把用户输入打包成 HTTP 请求发给服务器）
└── 老师批改答题卡（= 服务器端真正做校验，判断对不对）
      ↑ 老师是权威，答案是否正确由老师说了算

📖 开卷考试 + 老师把标准答案写在讲台桌上（= 前端校验的错误模式！）
├── 你在草稿纸上答题（= 浏览器里用户输入）
├── 草稿纸上还附了一个"自动批改小机器"（= 前端 JS 校验逻辑，比如 success 变量）
├── 机器先判断你写的对不对，对了才让你交卷（= 前端校验成功才发请求）
└── 但你可以直接把机器里的"判定逻辑"改了！（= F12 打开控制台，改 success=true）
      ↑ 你自己当裁判，当然是怎么改都对！
```

**划重点！⭐** 前端 JS 代码是要**下载到用户电脑上执行**的，相当于你把"裁判"送到了考生家里——考生想怎么改裁判就怎么改裁判。所以前端校验唯一的作用，是"减少正常用户的误操作、提升用户体验"，绝对不能当安全防护用！

下面这张 SVG 图帮你把"前端不可信"的原理刻进脑子里👇

<svg width="100%" viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" style="margin:20px 0;">
  <defs>
    <linearGradient id="g15a" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e0f2fe"/>
      <stop offset="100%" stop-color="#bae6fd"/>
    </linearGradient>
    <linearGradient id="g15b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fef3c7"/>
      <stop offset="100%" stop-color="#fde68a"/>
    </linearGradient>
  </defs>
  <!-- 左侧：用户电脑（浏览器） -->
  <rect x="20" y="20" width="380" height="470" rx="16" fill="url(#g15a)" stroke="#0284c7" stroke-width="2.5"/>
  <text x="210" y="55" text-anchor="middle" font-family="Microsoft YaHei" font-size="20" font-weight="bold" fill="#075985">💻 用户电脑（浏览器）= 考生家</text>
  <!-- 浏览器窗口 -->
  <rect x="50" y="80" width="320" height="260" rx="10" fill="white" stroke="#475569" stroke-width="2"/>
  <rect x="50" y="80" width="320" height="32" rx="10" fill="#cbd5e1"/>
  <rect x="65" y="89" width="60" height="14" rx="4" fill="#ef4444"/>
  <rect x="132" y="89" width="210" height="14" rx="4" fill="#f8fafc"/>
  <text x="148" y="100" text-anchor="start" font-family="Consolas" font-size="10" fill="#475569">http://dvwa/vulnerabilities/javascript/</text>
  <text x="70" y="145" font-family="Microsoft YaHei" font-size="16" fill="#1e293b" font-weight="bold">📝 HTML 页面内容</text>
  <text x="70" y="175" font-family="Consolas" font-size="13" fill="#0f172a">function checkAnswer() {</text>
  <text x="88" y="195" font-family="Consolas" font-size="13" fill="#0f172a">  var success = <tspan fill="#dc2626" font-weight="bold">false</tspan>;</text>
  <text x="88" y="215" font-family="Consolas" font-size="13" fill="#0f172a">  if (input == "正确答案") {</text>
  <text x="106" y="235" font-family="Consolas" font-size="13" fill="#0f172a">    success = true;</text>
  <text x="88" y="255" font-family="Consolas" font-size="13" fill="#0f172a">  }</text>
  <text x="88" y="275" font-family="Consolas" font-size="13" fill="#0f172a">  return success;</text>
  <text x="70" y="295" font-family="Consolas" font-size="13" fill="#0f172a">}</text>
  <!-- F12 控制台 -->
  <rect x="50" y="360" width="320" height="110" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>
  <text x="65" y="385" font-family="Consolas" font-size="13" fill="#4ade80">▶ Console</text>
  <text x="65" y="410" font-family="Consolas" font-size="13" fill="#e2e8f0">> window.success = <tspan fill="#4ade80" font-weight="bold">true</tspan></text>
  <text x="65" y="432" font-family="Consolas" font-size="12" fill="#94a3b8">← true   // 考生改了裁判的判卷逻辑！</text>
  <text x="65" y="454" font-family="Consolas" font-size="12" fill="#f87171">⚠️ 前端所有变量都是透明且可改的！</text>
  <!-- 右侧：服务器 -->
  <rect x="500" y="20" width="380" height="470" rx="16" fill="#fef2f2" stroke="#dc2626" stroke-width="2.5"/>
  <text x="690" y="55" text-anchor="middle" font-family="Microsoft YaHei" font-size="20" font-weight="bold" fill="#991b1b">🖥️ 服务器 = 老师办公室</text>
  <rect x="530" y="90" width="320" height="200" rx="10" fill="white" stroke="#7f1d1d" stroke-width="2"/>
  <text x="690" y="125" text-anchor="middle" font-family="Microsoft YaHei" font-size="18" fill="#7f1d1d" font-weight="bold">✅ 这里的逻辑才是权威</text>
  <text x="545" y="160" font-family="Consolas" font-size="13" fill="#0f172a">if ($_POST['token'] !== session_token()) {</text>
  <text x="560" y="182" font-family="Consolas" font-size="13" fill="#b91c1c">  reject(); // 服务器重新校验</text>
  <text x="545" y="204" font-family="Consolas" font-size="13" fill="#0f172a">}</text>
  <text x="545" y="230" font-family="Consolas" font-size="13" fill="#0f172a">if (password != db_password()) {</text>
  <text x="560" y="252" font-family="Consolas" font-size="13" fill="#b91c1c">  reject(); // 服务器端密码校验</text>
  <text x="545" y="274" font-family="Consolas" font-size="13" fill="#0f172a">}</text>
  <!-- 中间箭头：请求 -->
  <g transform="translate(405, 250)">
    <path d="M0 0 L85 0" stroke="#0ea5e9" stroke-width="3" marker-end="url(#arr15a)"/>
    <path d="M85 -30 L0 -30" stroke="#f97316" stroke-width="3" marker-end="url(#arr15b)"/>
  </g>
  <defs>
    <marker id="arr15a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#0ea5e9"/></marker>
    <marker id="arr15b" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M10 0 L0 5 L10 10 z" fill="#f97316"/></marker>
  </defs>
  <text x="445" y="242" font-family="Microsoft YaHei" font-size="12" fill="#0369a1" text-anchor="middle">请求① 用户输入</text>
  <text x="445" y="212" font-family="Microsoft YaHei" font-size="12" fill="#c2410c" text-anchor="middle">响应② 结果</text>
  <!-- 底部总结 -->
  <rect x="20" y="500" width="860" height="18" rx="6" fill="url(#g15b)"/>
  <text x="450" y="513" text-anchor="middle" font-family="Microsoft YaHei" font-size="13" font-weight="bold" fill="#92400e">🔑 铁律：前端校验 = 防君子不防小人；安全校验必须在服务器端做！</text>
</svg>

### 15.1.2 闯关预备技能：F12 开发者工具的 4 个必须会用的面板

今天闯关的全程都要用到 F12（Chrome/Edge 里按 F12，或者 Ctrl+Shift+I），在动手之前我们先把"工具刀"磨利：

| 面板 | 快捷键 | 在这一章里我们用来干嘛？ |
|---|---|---|
| **Elements（元素面板）** | `Ctrl+Shift+C` 选元素 | 看 DOM 结构里隐藏的 `<input type="hidden">`、改 `success` 变量的值 |
| **Console（控制台）** | Esc（在其他面板打开时） | 敲 JS 代码、直接调用页面里的加密函数、打印变量 |
| **Sources（源代码面板）** | Ctrl+P 搜文件 | 找到 DVWA 给我们的 JS 加密算法源码、下断点调试、看调用栈 |
| **Network（网络面板）** | F5 刷新后就能看到 | 抓每一关的请求/响应，看有没有隐藏的参数、有没有 Token 返回 |

**小技巧：** 在 Sources 面板里，按 Ctrl+Shift+F（全局搜索），搜 "success"、"token"、"answer"、"md5"、"sha256" 这些关键词，经常能直接定位到通关密码！

好，工具介绍完毕，下面我们正式开始闯关！🔥

---

## 15.2 正式闯关：第 1 关 —— 信任前端变量 success

### 15.2.1 正常玩家视角：看看第一关长啥样 👀

打开 DVWA → 左侧菜单选 **JavaScript** → 你会看到页面上面有 4 个 Tab：**View Source / 1 / 2 / 3 / 4**（有的版本是 Tab "JavaScript / 2 / 3 / 4"）。我们先点 **Tab "1"** 进入第一关。

<svg width="100%" viewBox="0 0 880 540" xmlns="http://www.w3.org/2000/svg" style="margin:18px 0;">
  <rect x="0" y="0" width="880" height="540" rx="14" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
  <!-- 地址栏 -->
  <rect x="20" y="20" width="840" height="44" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
  <circle cx="40" cy="42" r="7" fill="#ef4444"/>
  <circle cx="58" cy="42" r="7" fill="#eab308"/>
  <circle cx="76" cy="42" r="7" fill="#22c55e"/>
  <rect x="100" y="30" width="740" height="24" rx="6" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="115" y="47" font-family="Consolas" font-size="13" fill="#0f172a">http://192.168.56.102/dvwa/vulnerabilities/javascript/#tab1</text>
  <!-- Tab 栏 -->
  <g transform="translate(20, 85)">
    <rect x="0" y="0" width="130" height="40" rx="6" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
    <text x="65" y="26" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" fill="#0284c7" font-weight="bold">📑 View Source</text>
    <rect x="140" y="0" width="80" height="40" rx="6" fill="#0ea5e9" stroke="#0284c7" stroke-width="2"/>
    <text x="180" y="26" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" fill="white" font-weight="bold">🎯 第1关</text>
    <rect x="230" y="0" width="80" height="40" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="270" y="26" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" fill="#475569">🧩 第2关</text>
    <rect x="320" y="0" width="80" height="40" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="360" y="26" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" fill="#475569">🔑 第3关</text>
    <rect x="410" y="0" width="80" height="40" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="450" y="26" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" fill="#475569">🎮 第4关</text>
  </g>
  <!-- 第1关内容 -->
  <rect x="20" y="145" width="840" height="370" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="50" y="185" font-family="Microsoft YaHei" font-size="20" font-weight="bold" fill="#0f172a">🏁 关卡 1 / 4：修改 success 变量</text>
  <text x="50" y="215" font-family="Microsoft YaHei" font-size="14" fill="#475569">题目描述：请输入正确的通关口令，点击"Submit"进行验证。</text>
  <!-- 表单 -->
  <rect x="50" y="240" width="780" height="110" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-dasharray="4 3"/>
  <text x="70" y="278" font-family="Microsoft YaHei" font-size="15" fill="#0f172a" font-weight="bold">通关口令：</text>
  <rect x="170" y="258" width="400" height="36" rx="6" fill="white" stroke="#94a3b8" stroke-width="2"/>
  <text x="185" y="282" font-family="Consolas" font-size="14" fill="#94a3b8">  （我在这里随便输入了一个 "admin"）</text>
  <rect x="590" y="258" width="220" height="36" rx="6" fill="#2563eb" stroke="#1e40af" stroke-width="2"/>
  <text x="700" y="282" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" fill="white" font-weight="bold">🚀 Submit 提交</text>
  <text x="70" y="325" font-family="Microsoft YaHei" font-size="14" fill="#dc2626" font-weight="bold">❌ 错误提示：Wrong! Try again.（密码错了）</text>
  <!-- 源码片段 -->
  <rect x="50" y="370" width="780" height="120" rx="10" fill="#0f172a" stroke="#1e293b"/>
  <text x="68" y="398" font-family="Consolas" font-size="13" fill="#fbbf24">// 页面内嵌的 JS 代码（你在 Elements / Sources 里就能看到）</text>
  <text x="68" y="422" font-family="Consolas" font-size="14" fill="#e2e8f0">var <tspan fill="#38bdf8">success</tspan> = <tspan fill="#f87171" font-weight="bold">false</tspan>;</text>
  <text x="68" y="446" font-family="Consolas" font-size="14" fill="#e2e8f0">function <tspan fill="#86efac">submitAnswer</tspan>() {</text>
  <text x="88" y="468" font-family="Consolas" font-size="14" fill="#e2e8f0">  return <tspan fill="#38bdf8">success</tspan>; <tspan fill="#fbbf24">// 只看这个变量！！</tspan></text>
  <text x="68" y="486" font-family="Consolas" font-size="14" fill="#e2e8f0">}</text>
</svg>

**正常玩家的思路：** 我得先找到答案到底是什么——是猜密码？是看注释？还是有别的线索？正常人可能要瞎试半天，但是我们懂安全的小伙伴一看代码就秒懂：**代码里根本没校验你输入了啥！就看 `success` 这个变量是不是 `true`！**😆

### 15.2.2 漏洞原理：我自己就是考官，我说对就是对！🤣

这个漏洞的本质一句话就能概括：

> **后端 / 前端逻辑把"是否通关"的判断权交给了一个"前端全局变量 success"，而这个变量是用户可以随便改的！**

就像你考试的时候，考卷最后一行写着：
```
if (你的答案 == 正确答案) { success = true; }
交卷的时候只看 success 变量值，不看你写了啥答案。
```
那我还写个屁的答案啊？直接改 success=true 交卷不就完事了？🤣🤣🤣

### 15.2.3 分步实操：3 秒通关第一关 ⚡

<svg width="100%" viewBox="0 0 900 560" xmlns="http://www.w3.org/2000/svg" style="margin:20px 0;">
  <defs>
    <linearGradient id="g15c" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ecfdf5"/>
      <stop offset="100%" stop-color="#d1fae5"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="900" height="560" rx="16" fill="url(#g15c)" stroke="#10b981" stroke-width="2.5"/>
  <text x="450" y="40" text-anchor="middle" font-family="Microsoft YaHei" font-size="22" fill="#065f46" font-weight="bold">📚 第1关通关 3 步走（3秒搞定！）</text>
  <!-- 步骤1 -->
  <g transform="translate(30, 70)">
    <rect x="0" y="0" width="270" height="460" rx="12" fill="white" stroke="#059669" stroke-width="2"/>
    <rect x="0" y="0" width="270" height="50" rx="12" fill="#10b981"/>
    <rect x="0" y="38" width="270" height="12" fill="#10b981"/>
    <text x="135" y="33" text-anchor="middle" font-family="Microsoft YaHei" font-size="20" font-weight="bold" fill="white">① 打开控制台</text>
    <circle cx="30" cy="100" r="22" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
    <text x="30" y="107" text-anchor="middle" font-family="Consolas" font-size="20" font-weight="bold" fill="#fbbf24">F12</text>
    <text x="20" y="145" font-family="Microsoft YaHei" font-size="14" fill="#0f172a">在 DVWA 页面上按</text>
    <text x="20" y="168" font-family="Microsoft YaHei" font-size="14" font-weight="bold" fill="#dc2626">F12 键</text>
    <text x="20" y="195" font-family="Microsoft YaHei" font-size="14" fill="#0f172a">（或 Ctrl+Shift+I）</text>
    <text x="20" y="225" font-family="Microsoft YaHei" font-size="14" fill="#0f172a">打开开发者工具，</text>
    <text x="20" y="248" font-family="Microsoft YaHei" font-size="14" fill="#0f172a">顶部点 "Console" 面板。</text>
    <rect x="20" y="275" width="230" height="160" rx="8" fill="#0f172a" stroke="#334155"/>
    <text x="35" y="302" font-family="Consolas" font-size="12" fill="#4ade80">▶ Console  ░  Sources ░  Network</text>
    <text x="35" y="340" font-family="Consolas" font-size="12" fill="#fbbf24">// 光标在闪烁，准备输入</text>
    <rect x="35" y="360" width="200" height="22" rx="4" fill="#1e293b" stroke="#475569"/>
    <text x="45" y="376" font-family="Consolas" font-size="11" fill="#94a3b8">></text>
  </g>
  <!-- 步骤2 -->
  <g transform="translate(315, 70)">
    <rect x="0" y="0" width="270" height="460" rx="12" fill="white" stroke="#059669" stroke-width="2"/>
    <rect x="0" y="0" width="270" height="50" rx="12" fill="#059669"/>
    <rect x="0" y="38" width="270" height="12" fill="#059669"/>
    <text x="135" y="33" text-anchor="middle" font-family="Microsoft YaHei" font-size="20" font-weight="bold" fill="white">② 改 success=true</text>
    <rect x="20" y="85" width="230" height="130" rx="8" fill="#0f172a" stroke="#334155"/>
    <text x="35" y="112" font-family="Consolas" font-size="12" fill="#e2e8f0">> <tspan fill="#38bdf8">window.success</tspan> = <tspan fill="#4ade80" font-weight="bold">true</tspan>;</text>
    <text x="35" y="135" font-family="Consolas" font-size="11" fill="#94a3b8">← <tspan fill="#4ade80">true</tspan>    // Chrome 提示已赋值</text>
    <text x="35" y="165" font-family="Consolas" font-size="12" fill="#e2e8f0">> <tspan fill="#38bdf8">window.success</tspan></text>
    <text x="35" y="188" font-family="Consolas" font-size="11" fill="#94a3b8">← <tspan fill="#4ade80">true</tspan>    // 验证一下，确实是 true</text>
    <text x="20" y="240" font-family="Microsoft YaHei" font-size="14" fill="#0f172a">按回车执行，然后输</text>
    <text x="20" y="263" font-family="Microsoft YaHei" font-size="14" fill="#0f172a">入"window.success"再</text>
    <text x="20" y="286" font-family="Microsoft YaHei" font-size="14" fill="#0f172a">回车，确认变量值。</text>
    <rect x="20" y="315" width="230" height="125" rx="8" fill="#fef3c7" stroke="#d97706"/>
    <text x="35" y="345" font-family="Microsoft YaHei" font-size="14" fill="#92400e" font-weight="bold">💡 小知识</text>
    <text x="35" y="370" font-family="Microsoft YaHei" font-size="12" fill="#78350f">为什么要加 window.？</text>
    <text x="35" y="392" font-family="Microsoft YaHei" font-size="12" fill="#78350f">因为全局变量都挂在</text>
    <text x="35" y="414" font-family="Microsoft YaHei" font-size="12" fill="#78350f">window 对象上，写上</text>
    <text x="35" y="436" font-family="Microsoft YaHei" font-size="12" fill="#78350f">确保是全局那个。</text>
  </g>
  <!-- 步骤3 -->
  <g transform="translate(600, 70)">
    <rect x="0" y="0" width="270" height="460" rx="12" fill="white" stroke="#059669" stroke-width="2"/>
    <rect x="0" y="0" width="270" height="50" rx="12" fill="#047857"/>
    <rect x="0" y="38" width="270" height="12" fill="#047857"/>
    <text x="135" y="33" text-anchor="middle" font-family="Microsoft YaHei" font-size="20" font-weight="bold" fill="white">③ 点 Submit 通关</text>
    <rect x="20" y="80" width="230" height="200" rx="10" fill="white" stroke="#10b981" stroke-width="2"/>
    <text x="40" y="115" font-family="Microsoft YaHei" font-size="14" fill="#0f172a" font-weight="bold">通关口令：</text>
    <rect x="40" y="128" width="190" height="34" rx="5" fill="#fef9c3" stroke="#ca8a04"/>
    <text x="55" y="150" font-family="Microsoft YaHei" font-size="12" fill="#854d0e">（空的都行，不校验！）</text>
    <rect x="40" y="185" width="190" height="38" rx="8" fill="#22c55e" stroke="#166534" stroke-width="2"/>
    <text x="135" y="210" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" fill="white" font-weight="bold">👉 点 Submit</text>
    <rect x="40" y="245" width="190" height="25" rx="5" fill="#dcfce7"/>
    <text x="135" y="263" text-anchor="middle" font-family="Microsoft YaHei" font-size="13" fill="#166534" font-weight="bold">🎉 成功！Well done!</text>
    <rect x="20" y="300" width="230" height="140" rx="10" fill="#f0fdfa" stroke="#14b8a6"/>
    <text x="35" y="328" font-family="Microsoft YaHei" font-size="15" fill="#115e59" font-weight="bold">🏆 通关奖励</text>
    <text x="35" y="356" font-family="Microsoft YaHei" font-size="13" fill="#0f766e">获得一个 4 位通关码</text>
    <rect x="35" y="370" width="200" height="40" rx="6" fill="#0f172a"/>
    <text x="135" y="396" text-anchor="middle" font-family="Consolas" font-size="18" fill="#fbbf24" font-weight="bold">XXXX</text>
    <text x="35" y="428" font-family="Microsoft YaHei" font-size="12" fill="#134e4a">保存好！最后通关用！</text>
  </g>
  <!-- 底部总结 -->
  <rect x="30" y="545" width="840" height="12" rx="6" fill="#10b981"/>
</svg>

操作步骤总结（真的就 3 步，比泡方便面还简单）：

1. **按 F12 → Console 面板**
2. **输入 `window.success = true;` → 回车**
3. **回到页面，随便填个啥，点 Submit**

然后你就会看到 "Well done! You have successfully executed this attack..." 的成功提示，并且拿到第 1 关的 **4 位通关码（比如 "9876" 这种）**。这个通关码千万别丢！四关全通关后要拼成完整密码。😉

### 15.2.4 源码逐行解析：为什么"改个变量就能过"？

下面我们点页面顶部的 **"View Source"** Tab，看看 DVWA 给我们的前端 + 后端源码长啥样👇

**前端 JavaScript 部分（简化后）：**
```html
<script>
var success = false;                 // ① 全局变量，初始 false
function generate() {                // ② 页面加载时会调用（把口令加密混淆一下）
  // ... 省略一串字符串拼接，最后把答案算出来存在一个变量里
  success = (document.getElementById('answer').value == 答案);
}
function checkAnswer() {             // ③ 点击 Submit 时调用
  return success;                    // ⚠️ 漏洞就在这！！
}                                    // 只看 success，不重新算一遍！
</script>
```

**漏洞核心分析：**
- ① 处定义的 `success` 是**全局变量**，挂在 `window.success` 上，所以我们能在 Console 里直接改
- ② 处 `generate()` 只有在页面加载 + 表单 blur 等事件才会重新计算，**Submit 时并没有调用 `generate()`**
- ③ 处 `checkAnswer()` 直接返回 `success` 的值——**Submit 时根本没校验 answer 输入框里写的是什么！**
- 所以你 Console 里 `success=true` 一改，`checkAnswer()` 就老老实实返回 true，后端就认为你过了

**修复建议（Impossible 级别的正确写法）：**
```html
<script>
function checkAnswer() {
  // ✅ 正确：每次提交时都重新计算正确答案，再和输入做严格比较
  var correctAnswer = generateCorrectAnswer();  // 用纯函数本地算，不存全局状态
  var userAnswer = document.getElementById('answer').value;
  // 比较后直接返回布尔值，不让外部有机会改
  return (userAnswer === correctAnswer);
}
</script>
```

不过即便这样写也**只能提升门槛**，因为前端代码都是用户可见的，`generateCorrectAnswer()` 的算法用户照样能看、照样能手动算答案。**真正的正确做法是：把答案的校验放在后端！** 比如下面这样：

```php
<?php
// 后端 PHP（正确做法）
$correct = "正确答案存在服务器 session 或数据库里";
if ($_POST['answer'] === $correct) {
    echo "通关！";     // 服务器说了算！
} else {
    echo "Wrong!";
}
?>
```

---

## 15.3 正式闯关：第 2 关 —— 前端加密算法可逆

恭喜通过第一关！🎉 现在我们点 **Tab "2"** 来到第二关。

### 15.3.1 正常玩家视角：密码被加密了？ 🤔

第二关的页面和第一关长得差不多，也是"输入通关口令 + Submit"。但是！当你在 Elements 面板里看 JS 代码时，会发现这次的代码"聪明多了"——这次 `success` 不直接判断了，而是**先把你输入的口令，用一段前端 JS 算法加密成一串密文，再把密文和页面里内嵌的"正确密文"做比较**。

听起来是不是很有道理？"我把明文答案藏起来，只给你看密文和加密函数，你猜不到明文答案是什么！"—— 开发者是这么想的。但是，这个想法忽略了一个致命事实：

> **加密算法也在前端 JS 里啊！你给了我加密函数，我就不能反着写一个解密函数吗？？** 🤣🤣🤣

### 15.3.2 漏洞原理：给我加密函数，我就能"反推"答案 🔓

这一关的漏洞本质就是：

> **前端加密 ≠ 安全。如果加密算法（包括密钥、S盒、移位规则等）都暴露给用户，那这个加密就只是"增加了解题的步骤"，根本不是安全防护。**

用生活比喻：
```
你写密信：我给你一个密码本（= 前端加密算法 JS 代码）
          + 一封已经写好的密信（= 页面里硬编码的"正确密文"）
          → 我让你"你自己写一封密信，要和我这封一模一样"
```
正常人的思路是：我要知道原文，才能加密得到密文；
但是聪明人的思路是：**你把密码本给我了，我直接反着翻密码本，从密文把原文解出来不就行了？**

<svg width="100%" viewBox="0 0 860 460" xmlns="http://www.w3.org/2000/svg" style="margin:20px 0;">
  <defs>
    <linearGradient id="g15d" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#eff6ff"/>
      <stop offset="100%" stop-color="#dbeafe"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="860" height="460" rx="16" fill="url(#g15d)" stroke="#2563eb" stroke-width="2.5"/>
  <text x="430" y="45" text-anchor="middle" font-family="Microsoft YaHei" font-size="22" fill="#1e3a8a" font-weight="bold">🔓 第2关漏洞原理：加密函数公开 = 解密函数我自己写</text>
  <!-- 开发者视角 -->
  <g transform="translate(40, 85)">
    <rect x="0" y="0" width="250" height="330" rx="12" fill="white" stroke="#1d4ed8" stroke-width="2"/>
    <rect x="0" y="0" width="250" height="40" rx="12" fill="#1d4ed8"/>
    <rect x="0" y="30" width="250" height="10" fill="#1d4ed8"/>
    <text x="125" y="28" text-anchor="middle" font-family="Microsoft YaHei" font-size="16" font-weight="bold" fill="white">👨‍💻 天真的开发者想的</text>
    <rect x="20" y="60" width="210" height="40" rx="6" fill="#dbeafe" stroke="#3b82f6"/>
    <text x="125" y="86" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="#1e3a8a" font-weight="bold">📦 加密算法（公开）</text>
    <text x="30" y="130" font-family="Microsoft YaHei" font-size="14" fill="#0f172a">function encode(str) {</text>
    <text x="45" y="155" font-family="Consolas" font-size="12" fill="#0f172a">  // 做一堆移位+替换</text>
    <text x="45" y="178" font-family="Consolas" font-size="12" fill="#0f172a">  return rot13(str);</text>
    <text x="30" y="200" font-family="Microsoft YaHei" font-size="14" fill="#0f172a">}</text>
    <rect x="20" y="215" width="210" height="40" rx="6" fill="#fee2e2" stroke="#dc2626"/>
    <text x="125" y="241" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="#991b1b" font-weight="bold">🔒 正确密文（也公开）</text>
    <text x="30" y="285" font-family="Consolas" font-size="13" fill="#0f172a">var target = "Qnex Ebg13";</text>
    <rect x="20" y="300" width="210" height="20" rx="4" fill="#fef3c7"/>
    <text x="125" y="315" text-anchor="middle" font-family="Microsoft YaHei" font-size="12" fill="#92400e">❌ 错误假设：用户没法解码</text>
  </g>
  <!-- 中间箭头 -->
  <g transform="translate(310, 225)">
    <path d="M0 0 L60 0" stroke="#6366f1" stroke-width="3" marker-end="url(#arr15c)"/>
    <path d="M60 -35 L0 -35" stroke="#ec4899" stroke-width="3" marker-end="url(#arr15d)"/>
    <text x="30" y="-42" text-anchor="middle" font-family="Microsoft YaHei" font-size="12" fill="#be185d">加密(公开)</text>
    <text x="30" y="18" text-anchor="middle" font-family="Microsoft YaHei" font-size="12" fill="#4338ca">我自己算解密！</text>
  </g>
  <defs>
    <marker id="arr15c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#6366f1"/></marker>
    <marker id="arr15d" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M10 0 L0 5 L10 10 z" fill="#ec4899"/></marker>
  </defs>
  <!-- 黑客视角 -->
  <g transform="translate(390, 85)">
    <rect x="0" y="0" width="250" height="330" rx="12" fill="white" stroke="#db2777" stroke-width="2"/>
    <rect x="0" y="0" width="250" height="40" rx="12" fill="#db2777"/>
    <rect x="0" y="30" width="250" height="10" fill="#db2777"/>
    <text x="125" y="28" text-anchor="middle" font-family="Microsoft YaHei" font-size="16" font-weight="bold" fill="white">🎩 攻击者实际会做的</text>
    <rect x="20" y="60" width="210" height="60" rx="6" fill="#fdf2f8" stroke="#ec4899"/>
    <text x="125" y="85" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="#9d174d" font-weight="bold">🔓 我自己写解密函数</text>
    <text x="30" y="110" font-family="Consolas" font-size="12" fill="#0f172a">decode = encode; // 因为ROT13是对合的</text>
    <rect x="20" y="135" width="210" height="40" rx="6" fill="#d1fae5" stroke="#059669"/>
    <text x="125" y="161" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="#065f46" font-weight="bold">✅ 从密文反解明文</text>
    <text x="30" y="210" font-family="Consolas" font-size="13" fill="#0f172a">> decode("Qnex Ebg13")</text>
    <text x="30" y="238" font-family="Consolas" font-size="14" fill="#059669" font-weight="bold">← "Dark Rot13"  ← 答案就是它！</text>
    <rect x="20" y="260" width="210" height="55" rx="6" fill="#ecfdf5" stroke="#10b981"/>
    <text x="125" y="285" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="#065f46" font-weight="bold">🎯 输入答案，提交通过</text>
    <text x="125" y="305" text-anchor="middle" font-family="Microsoft YaHei" font-size="12" fill="#064e3b">在输入框填 "Dark Rot13"</text>
  </g>
  <!-- 右侧真实 DVWA 算法 -->
  <g transform="translate(660, 85)">
    <rect x="0" y="0" width="180" height="330" rx="12" fill="white" stroke="#7c3aed" stroke-width="2"/>
    <rect x="0" y="0" width="180" height="40" rx="12" fill="#7c3aed"/>
    <rect x="0" y="30" width="180" height="10" fill="#7c3aed"/>
    <text x="90" y="28" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" font-weight="bold" fill="white">💡 DVWA 真实算法</text>
    <text x="15" y="70" font-family="Consolas" font-size="11" fill="#0f172a">// charCodeAt()+位运算</text>
    <text x="15" y="92" font-family="Consolas" font-size="11" fill="#0f172a">a = s.split("");</text>
    <text x="15" y="114" font-family="Consolas" font-size="11" fill="#0f172a">a[i] = (a[i].charCodeAt()</text>
    <text x="15" y="134" font-family="Consolas" font-size="11" fill="#0f172a">           ^ 0xAA).toString(16)</text>
    <text x="15" y="156" font-family="Consolas" font-size="11" fill="#0f172a">           .padStart(2,'0');</text>
    <rect x="15" y="175" width="150" height="32" rx="4" fill="#ede9fe"/>
    <text x="90" y="196" text-anchor="middle" font-family="Microsoft YaHei" font-size="12" fill="#6d28d9" font-weight="bold">解密：xor 回去就行！</text>
    <text x="15" y="235" font-family="Consolas" font-size="11" fill="#0f172a">target = "6a545a...";</text>
    <text x="15" y="257" font-family="Consolas" font-size="11" fill="#0f172a">for (i=0;i<len;i+=2) {</text>
    <text x="22" y="277" font-family="Consolas" font-size="11" fill="#0f172a">  c = parseInt(substr,16)</text>
    <text x="22" y="297" font-family="Consolas" font-size="11" fill="#0f172a">  ^ 0xAA → String.fromCharCode</text>
    <text x="15" y="318" font-family="Consolas" font-size="11" fill="#059669">} → 得到明文答案</text>
  </g>
</svg>

### 15.3.3 分步实操：5 步解出第二关答案 🔑

**第 1 步：F12 → Sources，找到加密算法**

在 Sources 面板里，按 **Ctrl+Shift+F** 全局搜索关键字：`charCodeAt`、`fromCharCode`、`toString(16)`、`split("")`、`XOR`、`^=` —— DVWA 的 JS 模块第二关的算法，几乎全是"字符串逐字符 → 取 ASCII 码 → 做异或/移位 → 转成 16 进制字符串拼接"这种套路。你一定能搜到类似这样的代码块：

```javascript
function rotString(toEncode) {
  // ① 输入字符串转成数组
  var inputArray = toEncode.split("");
  var output = "";
  for (i = 0; i < inputArray.length; i++) {
    // ② 每个字符取 ASCII 码
    var charCode = inputArray[i].charCodeAt();
    // ③ 和 0xAA（十进制 170）做异或
    charCode = (charCode ^ 0xAA);
    // ④ 转成两位的十六进制字符串
    output += charCode.toString(16).padStart(2, "0");
  }
  return output;
}
```

**第 2 步：在 Console 里把这段加密函数复制出来，存成一个变量**

直接在 Console 里粘贴，回车，你就拥有和 DVWA 一模一样的加密函数了。

**第 3 步：在 Elements 里找到"正确密文 target"**

继续搜关键词 `var target`、`let hash`、`correct ==`、`encoded ==`，你会在代码里找到类似这一行：

```javascript
var correctAnswer = "7e5c5a524f";    // 这是我随便举的例子，你玩的时候是具体的一串 16 进制
```

**第 4 步：自己写一个"解密函数"（反着加密函数跑一遍就行）**

```javascript
// 因为加密 = 字符 → ASCII → XOR 0xAA → 16进制
// 所以解密 = 2位16进制 → 整数 → XOR 0xAA → 字符（XOR 是对合运算，加解密一样！）
function decryptString(targetHex) {
  var result = "";
  for (var i = 0; i < targetHex.length; i += 2) {
    var twoHex = targetHex.substr(i, 2);          // 每次取两位 16 进制
    var intVal = parseInt(twoHex, 16);            // 转成整数
    var xorBack = intVal ^ 0xAA;                  // 再 XOR 0xAA 回到原始 ASCII
    result += String.fromCharCode(xorBack);       // 整数转字符
  }
  return result;
}

// 调用：
decryptString("7e5c5a524f");   // → 回车就得到明文答案！比如 "abcde"
```

**第 5 步：回到页面，把明文答案输入进去 → 点 Submit → 拿到第 2 关通关码！** 🎉

### 15.3.4 源码逐行解析 + 修复建议

**为什么会有这个漏洞？** 开发者想当然地以为"我把算法写得复杂点，用户就看不懂了"。但 Web 安全里有个铁律：

> **Security through obscurity（靠隐蔽实现安全）= 永远不安全。** 只要算法是公开的（前端代码必然公开），攻击者只需要比你多 5 分钟的耐心，就能把算法反过来写一遍。

**Impossible 级别修复思路：**
```php
<?php
session_start();
// ✅ 正确做法：
// 1. 通关口令只存在服务器 Session 里，前端看不到
// 2. 前端只负责把用户输入 POST 过来
// 3. 后端 $_POST['answer'] 和 $_SESSION['correct'] 做严格 === 比较
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (hash_equals($_SESSION['level2_answer'], $_POST['answer'])) {
        echo "通关！第2关密码 = XXXX";
    } else {
        echo "Wrong!";
    }
}
?>
```

---

## 15.4 正式闯关：第 3 关 —— 一次性 Token（防刷新）

通关 1/2！已经一半啦！💪 现在切到 **Tab "3"** 第三关。

### 15.4.1 正常玩家视角：哎呀，我刷新后答案就失效了？？ 😮

第三关和前两关有个**关键区别**——当你抓包（Network 面板）看请求时，会发现**每次加载页面，后端返回的 HTML 里都会带一个新的、唯一的 `<input type="hidden" name="user_token" value="一串随机字符串">`**，并且后端会校验：**这个 user_token 是不是刚才发给你的那个？用过一次就作废了！**

```html
<!-- 第三关的表单里多了这一行，每次 F5 刷新 value 都不一样！ -->
<input type="hidden" name="user_token" value="a3f8b2c1d4e5f6...">
```

正常玩家如果用 Burp 的 Repeater 去重放请求，会发现第二次就会返回 "Invalid token" 错误——开发者这次很得意："我加一次性 Token 了！你不能改一次 success 就刷 100 次通关了！"🤓

### 15.4.2 漏洞原理：Token 每次都在 HTML 里返回给我了啊？？ 🤷‍♂️

但开发者还是忘了一件事——**每一次加载新页面，后端都会把新 Token 先给我（在响应 HTML 里）。那我每次提交前先 GET 一下新页面拿个 Token，不就完事了？** 这就好比：

> 门卫大爷："我每次只发一张进门卡，用过就作废，你没法代别人进门！"
> 我："哦，那我每次进门前，先去您窗口领一张新卡不就行了？窗口 24 小时开放，想领几张领几张..."

**🤦 门卫大爷当场无语。**

<svg width="100%" viewBox="0 0 880 430" xmlns="http://www.w3.org/2000/svg" style="margin:18px 0;">
  <rect x="0" y="0" width="880" height="430" rx="14" fill="#fefce8" stroke="#eab308" stroke-width="2.5"/>
  <text x="440" y="45" text-anchor="middle" font-family="Microsoft YaHei" font-size="22" fill="#854d0e" font-weight="bold">🎟️ 第3关漏洞原理：一次性 Token ≠ 防自动化，只要每次你都先给我新卡</text>
  <!-- 正常玩家视角 -->
  <g transform="translate(40, 80)">
    <rect x="0" y="0" width="250" height="310" rx="12" fill="white" stroke="#ca8a04" stroke-width="2"/>
    <rect x="0" y="0" width="250" height="40" rx="12" fill="#eab308"/>
    <rect x="0" y="30" width="250" height="10" fill="#eab308"/>
    <text x="125" y="28" text-anchor="middle" font-family="Microsoft YaHei" font-size="16" font-weight="bold" fill="white">😤 普通玩家操作（以为稳了）</text>
    <text x="20" y="75" font-family="Microsoft YaHei" font-size="14" fill="#0f172a">第1次：浏览器 GET /tab3</text>
    <text x="20" y="98" font-family="Microsoft YaHei" font-size="14" fill="#0f172a">  ← 返回 Token = AAAA</text>
    <text x="20" y="126" font-family="Microsoft YaHei" font-size="14" fill="#0f172a">第2次：POST 提交，带 AAAA</text>
    <text x="20" y="149" font-family="Microsoft YaHei" font-size="14" fill="#16a34a">  ✓ 成功！Token AAAA 作废</text>
    <text x="20" y="182" font-family="Microsoft YaHei" font-size="14" fill="#0f172a">第3次：Burp Repeater 重发</text>
    <text x="20" y="205" font-family="Microsoft YaHei" font-size="14" fill="#0f172a">  POST 里还是老 Token AAAA</text>
    <text x="20" y="233" font-family="Microsoft YaHei" font-size="14" fill="#dc2626" font-weight="bold">  ✗ 失败！Invalid token</text>
    <rect x="20" y="258" width="210" height="40" rx="6" fill="#fef3c7" stroke="#d97706"/>
    <text x="125" y="275" text-anchor="middle" font-family="Microsoft YaHei" font-size="12" fill="#92400e" font-weight="bold">开发者心想：嘿嘿自动化搞不定了吧</text>
  </g>
  <!-- 中间 vs -->
  <text x="440" y="245" text-anchor="middle" font-family="Microsoft YaHei" font-size="36" fill="#dc2626" font-weight="bold">VS</text>
  <!-- 聪明攻击者 -->
  <g transform="translate(590, 80)">
    <rect x="0" y="0" width="250" height="310" rx="12" fill="white" stroke="#16a34a" stroke-width="2"/>
    <rect x="0" y="0" width="250" height="40" rx="12" fill="#16a34a"/>
    <rect x="0" y="30" width="250" height="10" fill="#16a34a"/>
    <text x="125" y="28" text-anchor="middle" font-family="Microsoft YaHei" font-size="16" font-weight="bold" fill="white">🎩 聪明攻击者做法</text>
    <text x="20" y="75" font-family="Microsoft YaHei" font-size="14" fill="#0f172a" font-weight="bold">循环 100 次：</text>
    <text x="20" y="100" font-family="Microsoft YaHei" font-size="14" fill="#0f172a">① GET /tab3 拿页面</text>
    <text x="35" y="123" font-family="Microsoft YaHei" font-size="14" fill="#7c3aed">  ← 新 Token = BBBB ✨</text>
    <text x="20" y="148" font-family="Microsoft YaHei" font-size="14" fill="#0f172a">② 正则从 HTML 里扣出 BBBB</text>
    <rect x="20" y="160" width="210" height="30" rx="4" fill="#ecfdf5"/>
    <text x="125" y="180" text-anchor="middle" font-family="Consolas" font-size="12" fill="#065f46">user_token=BBBB</text>
    <text x="20" y="210" font-family="Microsoft YaHei" font-size="14" fill="#0f172a">③ POST 答案+BBBB 提交</text>
    <text x="20" y="235" font-family="Microsoft YaHei" font-size="14" fill="#16a34a" font-weight="bold">  ✓ 永远成功！！</text>
    <rect x="20" y="258" width="210" height="40" rx="6" fill="#d1fae5" stroke="#059669"/>
    <text x="125" y="275" text-anchor="middle" font-family="Microsoft YaHei" font-size="12" fill="#064e3b" font-weight="bold">只要每次领新卡，怎么刷都行</text>
  </g>
</svg>

### 15.4.3 分步实操：手动通关 + 自动化脚本思路

**手动通关（2 次请求搞定）：**
1. **先 F5 刷新第三关页面** → F12 → Network 面板，找到最新的 `GET /vulnerabilities/javascript/` 响应 → 在响应 HTML 里搜索 `user_token` → 复制最新的 Token 值（比如 `BBBB`）
2. **回到页面，填入通关答案（通关答案可以用第 2 关的思路反解出来）** → 点 Submit 之前，F12 → Elements → 找到 `<input type="hidden" name="user_token">` 这一行 → **双击 value 里的值改成刚复制的 BBBB** → 再点 Submit → 成功！

**进阶：用 Python 脚本自动化（可选，学了就牛逼）：**
```python
# 第3关自动化示例（和我们第18章讲的 CRLF 脚本是同一种思路）
import requests, re

URL = "http://192.168.56.102/dvwa/vulnerabilities/javascript/"
cookies = {"PHPSESSID": "abc123", "security": "low"}

# 循环 100 次，每次先 GET 新 Token，再 POST
for i in range(100):
    # ① GET 拿 HTML，正则提取 user_token
    html = requests.get(URL, cookies=cookies).text
    user_token = re.search(r'name="user_token"\s+value="([0-9a-f]+)"', html).group(1)
    # ② POST 提交答案 + 新 Token
    data = {"answer": "明文答案", "user_token": user_token, "Submit": "Submit"}
    resp = requests.post(URL, cookies=cookies, data=data)
    if "Well done" in resp.text:
        print(f"第{i+1}次通关成功！user_token={user_token}")
```

**修复建议（Impossible 级）：**
```php
<?php
session_start();
// ✅ 正确姿势：
// ① Token 还是要存在 session 里 + 一次一换（这个开发者做对了）
// ② 但是！要做"访问频率限制 Rate Limit"：同一个 IP / 同一个 session，
//    1 分钟内只能请求 3 次，超过就封禁！（这个是关键！）
if ($_SESSION['last_request_time'] && time() - $_SESSION['last_request_time'] < 3) {
    die("请求太快了！歇一会儿再试");  // 每次请求最小间隔 3 秒
}
$_SESSION['last_request_time'] = time();
// ③ 加验证码 / 行为校验（和我们 Day12 学的 Impossible 级 CAPTCHA 联动）
```

---

## 15.5 正式闯关：第 4 关 —— 前端逻辑重放攻击

最后一关啦！🎉 切到 **Tab "4"**。

### 15.5.1 正常玩家视角：哇这次要"一步一步按顺序做任务"？！

第 4 关的页面和前三关完全不一样，它不再是"输入口令 → 点 Submit"了，而是一个类似"任务链"的系统：

```
📋 第4关任务列表（必须从上到下按顺序做！）
├─ 步骤 1：点"开始挑战"按钮 → 返回一个 token_1
├─ 步骤 2：带着 token_1 点"任务A完成" → 返回 token_2
├─ 步骤 3：带着 token_2 点"任务B完成" → 返回 token_3
├─ 步骤 4：带着 token_3 点"最终提交"  → 通关！
└─ 任何一步顺序错了 / token 对不上 → 直接失败，从头来
```

正常玩家要老老实实点 4 次按钮，而且得按顺序来。开发者心想："这次我把逻辑拆成多步，每一步都校验上一步的 Token，你没法一步到位了吧？"

### 15.5.2 漏洞原理：每一步的 Token 都在响应里返回给我啊？？ 🤦‍♀️

漏洞本质其实和第 3 关一模一样，只是**增加了步数**：

> 你给我的流程是：Step1→Token1→Step2→Token2→Step3→Token3→Step4→通关。
> 但问题是，**每一步的响应里你都把下一步的 Token 明明白白返回给我了呀！** 那我就老老实实按你给的顺序，用脚本一步一步请求不就行了？

用生活比喻：
```
你去行政大楼办 4 个章：
  1号窗口：提交资料 → 拿到盖了章的表 1
  2号窗口：看你有没有表 1 → 给你盖表 2
  3号窗口：看你有没有表 2 → 给你盖表 3
  4号窗口：看你有没有表 3 → 给你最终通过
```
开发者以为"你必须一个一个窗口走"，但实际上每个窗口都 24 小时开门、无限排队、而且你可以用机器人一秒跑完全部 4 个窗口——那"多步"就只是麻烦了一点，根本不是安全防护！

### 15.5.3 分步实操：脚本化跑完 4 步 + 手动版演示

**手动版（Network 面板里一步一步抠 Token）：**
1. 点"开始挑战" → Network 面板里看响应，从 HTML/JSON 里抠出 `token_1`（或者看页面里隐藏的 input）
2. 把 `token_1` 填进步骤 2 的表单（Elements 里改 value），点"任务A完成" → 拿到 `token_2`
3. 同样流程，用 `token_2` 换 `token_3`，再用 `token_3` 换最终通关
4. 拿到第 4 关通关码！

**自动化版（Python requests 重放，推荐写法）：**
```python
import requests, re
from bs4 import BeautifulSoup

URL = "http://192.168.56.102/dvwa/vulnerabilities/javascript/"
cookies = {"PHPSESSID": "xxxx", "security": "low"}
s = requests.Session()
s.cookies.update(cookies)

def get_token(html, name):
    """从 HTML 里抠 name=xxx 的 input hidden 的 value"""
    m = re.search(rf'name="{name}"\s+value="([0-9a-f]+)"', html)
    return m.group(1) if m else None

# Step 1：GET 初始页面，拿 step1_token
html = s.get(URL + "#tab4").text
step1 = get_token(html, "step1_token")
print(f"[*] Step1 token = {step1}")

# Step 2：POST step1，拿 step2_token
resp = s.post(URL, data={"step": "1", "step1_token": step1})
step2 = get_token(resp.text, "step2_token")
print(f"[*] Step2 token = {step2}")

# Step 3：POST step2，拿 step3_token
resp = s.post(URL, data={"step": "2", "step2_token": step2})
step3 = get_token(resp.text, "step3_token")
print(f"[*] Step3 token = {step3}")

# Step 4：POST step3，最终通关
resp = s.post(URL, data={"step": "3", "step3_token": step3})
if "第4关通关码" in resp.text:
    print("🎉 第4关通关成功！")
```

**修复建议（Impossible 级）：**
```php
<?php
// ✅ 真正安全的"多步骤流程"写法：
// ① 每一步 Token 的生成 = 服务器 Session 内部状态机推进，前端根本拿不到"下一步 Token"
// ② 每一步的业务数据全在后端存着，前端只是一个按钮触发
// ③ Rate Limit + 服务器端做"当前用户走到第几步了"的状态校验
//   （而不是信任前端传来的 step=1 这种参数！）
if ($_SESSION['current_step'] !== 2) {
    die("顺序错误！");  // 后端自己记住 current_step，不信前端的 step 参数
}
```

---

## 15.6 四关通关码汇总 + 最终总通关 ✨

四关全部打完之后，你会拿到 **4 个 4 位的通关码**（假设分别是 WXYZ、ABCD、1234、5678）。最后在"View Source"旁边那个"All Done"按钮（或者最后的提交框）里，把 4 个通关码**按顺序拼接成一个完整的 16 位密码**（WXYZABCD12345678），提交就会弹出最终的"恭喜！JavaScript Attacks 全通关！"。

<svg width="100%" viewBox="0 0 860 320" xmlns="http://www.w3.org/2000/svg" style="margin:20px 0;">
  <defs>
    <linearGradient id="g15e" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fef3c7"/>
      <stop offset="100%" stop-color="#fde68a"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="860" height="320" rx="16" fill="url(#g15e)" stroke="#d97706" stroke-width="2.5"/>
  <text x="430" y="45" text-anchor="middle" font-family="Microsoft YaHei" font-size="22" fill="#92400e" font-weight="bold">🏆 四关通关码汇总 + 总通关流程</text>
  <!-- 4 个通关码卡片 -->
  <g transform="translate(50, 85)">
    <rect x="0" y="0" width="170" height="170" rx="14" fill="white" stroke="#f59e0b" stroke-width="2.5"/>
    <rect x="0" y="0" width="170" height="40" rx="14" fill="#f59e0b"/>
    <rect x="0" y="30" width="170" height="10" fill="#f59e0b"/>
    <text x="85" y="28" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" font-weight="bold" fill="white">关卡 1 通关码</text>
    <rect x="15" y="65" width="140" height="80" rx="8" fill="#0f172a"/>
    <text x="85" y="113" text-anchor="middle" font-family="Consolas" font-size="24" fill="#fbbf24" font-weight="bold">9876</text>
  </g>
  <g transform="translate(240, 85)">
    <rect x="0" y="0" width="170" height="170" rx="14" fill="white" stroke="#10b981" stroke-width="2.5"/>
    <rect x="0" y="0" width="170" height="40" rx="14" fill="#10b981"/>
    <rect x="0" y="30" width="170" height="10" fill="#10b981"/>
    <text x="85" y="28" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" font-weight="bold" fill="white">关卡 2 通关码</text>
    <rect x="15" y="65" width="140" height="80" rx="8" fill="#0f172a"/>
    <text x="85" y="113" text-anchor="middle" font-family="Consolas" font-size="24" fill="#34d399" font-weight="bold">4321</text>
  </g>
  <g transform="translate(430, 85)">
    <rect x="0" y="0" width="170" height="170" rx="14" fill="white" stroke="#6366f1" stroke-width="2.5"/>
    <rect x="0" y="0" width="170" height="40" rx="14" fill="#6366f1"/>
    <rect x="0" y="30" width="170" height="10" fill="#6366f1"/>
    <text x="85" y="28" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" font-weight="bold" fill="white">关卡 3 通关码</text>
    <rect x="15" y="65" width="140" height="80" rx="8" fill="#0f172a"/>
    <text x="85" y="113" text-anchor="middle" font-family="Consolas" font-size="24" fill="#a5b4fc" font-weight="bold">ABCD</text>
  </g>
  <g transform="translate(620, 85)">
    <rect x="0" y="0" width="170" height="170" rx="14" fill="white" stroke="#ec4899" stroke-width="2.5"/>
    <rect x="0" y="0" width="170" height="40" rx="14" fill="#ec4899"/>
    <rect x="0" y="30" width="170" height="10" fill="#ec4899"/>
    <text x="85" y="28" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" font-weight="bold" fill="white">关卡 4 通关码</text>
    <rect x="15" y="65" width="140" height="80" rx="8" fill="#0f172a"/>
    <text x="85" y="113" text-anchor="middle" font-family="Consolas" font-size="24" fill="#f9a8d4" font-weight="bold">WXYZ</text>
  </g>
  <!-- 箭头拼接 -->
  <g transform="translate(50, 275)">
    <path d="M85 -10 L430 -10" stroke="#b45309" stroke-width="3" marker-end="url(#arr15e)"/>
    <path d="M775 -10 L810 -10" stroke="#b45309" stroke-width="3" marker-end="url(#arr15e)"/>
    <text x="430" y="0" text-anchor="middle" font-family="Microsoft YaHei" font-size="16" fill="#78350f" font-weight="bold">按顺序拼接 → 总通关密码 = 98764321ABCDWXYZ</text>
  </g>
  <defs>
    <marker id="arr15e" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#b45309"/></marker>
  </defs>
</svg>

---

## 15.7 本章小结 + 四道真题自测 📝

### 🎯 本章核心知识点（背下来面试直接加分）

| 关卡 | 漏洞核心 | 修复方法 |
|---|---|---|
| 第 1 关 | 信任前端变量 `success`，提交时不重新校验 | 校验逻辑放后端；每次提交重新计算 |
| 第 2 关 | 前端加密算法 + 密文都公开，可逆推答案 | 答案校验只在后端做（session / DB） |
| 第 3 关 | 一次性 Token 但无 Rate Limit，每次都能领新的 | Token + Rate Limit（频率限制）+ 验证码 |
| 第 4 关 | 多步流程的 Token 全在前端可见，可脚本化重放 | 后端用 Session 状态机推进，Token 不暴露给前端 |

### 🧠 4 道课后自测题（答案在下一章 Day16 的开头公布）

**题 1（单选）** 以下关于前端校验的说法，**哪一个是正确的**？
- A. 前端用 MD5 把密码加密后再发 = 传输安全
- B. 前端加了一次性 Token = 可以防自动化爆破
- C. 前端校验只能防误操作，绝对不能当安全防护
- D. 前端把 success 变量用 const 声明就不能被改了

**题 2（思考）** 第 2 关我们用 XOR 0xAA 举例，如果加密算法是"AES-256 + 前端硬编码密钥"，这种做法安全吗？为什么？

**题 3（实操）** 打开你自己的 DVWA JavaScript 第 3 关，用 Burp Suite 的 **Macro（宏）** 功能实现"每次重放请求时自动更新 user_token"（提示：Project options → Sessions → Session Handling Rules → Add）。

**题 4（场景）** 假设你要开发一个"短信验证码发送"功能，要求防止短信轰炸机（别人写脚本一秒发 1000 条短信）。结合 Day12 的 CAPTCHA + Day15 的第 3 关知识，你会设计哪 3 层防护？

---

🎉 **第15章 JavaScript Attacks 闯关全部完成！** 现在你已经掌握了"前端任何东西都不能信"的正确姿势，下次再看到"前端校验通过就放行"的页面，你肯定会邪魅一笑："呵呵，F12 打开，我们来玩玩。"😎

下一章 **Day 16：SQL Injection (Blind) SQL 盲注独立模块** 会带大家把 DVWA 里的"盲注"单独拎出来，从布尔盲注到时间盲注，四个级别一把梭，把盲注的感觉彻底练熟——因为下下一章开始就要进 SQLi-Labs 的海洋了，盲注是你必须具备的游泳技能！💪

就酱，我们 Day16 见！🚀
