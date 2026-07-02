# Day 19：DVWA 通关毕业典礼 + 后续学习路线总规划 🎓

> **🎯 阶段总结** | 难度：⭐ | 预计学习：45 分钟

---

# 第19章 DVWA 通关毕业典礼：从零到准 Web 安全工程师，我们一起走过的路 🎓

哈喽各位小伙伴们大家好！👋

恭喜你！🎉🎉🎉 **从今天这一章学完的这一刻起，你正式通关了全球最经典的 Web 入门靶场 DVWA 的全部核心模块！** 从 Day5 到今天 Day19，整整 15 天我们一口气啃下了 16+ 个主流 Web 漏洞，每个漏洞都走过了 Low（原理）→ Medium（绕过）→ High（终极绕过）→ Impossible（正确防御）四个完整阶梯，而且每个关卡都有大白话比喻、SVG 原理图、逐行源码解析、甚至 Python 自动化脚本！

**零基础小白能走到这里，你已经超过了 80% 想入行但一直停留在"看理论不实操"的人！** 请先给自己鼓个掌！👏👏👏

今天这一章我们不做新漏洞，而是做四件非常重要的事：

**① 一张表复习 15 天学过的所有漏洞**：Day5~Day18 每章是什么、难度、机试多少分、一句话核心原理，保证你合上书本还能回忆起 80%。

**② 漏洞危害金字塔**：现实世界里（护网、渗透测试、面试）什么漏洞是"高危重灾区"，什么是"低危但常常有"，让你以后学新漏洞知道优先级，不瞎走弯路。

**③ 零基础后续学习路线图**：通关 DVWA 之后下一步该学啥？按顺序给你列"SQLi-Labs → Pikachu 中文靶场 → VulnHub 提权靶机 → CTF 平台 → 面试 & 护网"一条龙，每一步目标明确、周期明确、验收标准明确。

**④ 下章 SQLi-Labs 入门预告**：Day20 我们就正式进入 SQLi-Labs Less1-10 啦（也就是原来顺延过来的 day20.md 的内容，完美衔接！），今天先给你打个底、预告一下 Less1-10 的 10 关分别是什么、通关密码是什么。

坐稳扶好，DVWA 毕业典礼正式开始！🎊

---

## 19.1 一张表回顾 Day5~Day18 我们全部学过什么？ 📚

<svg width="100%" viewBox="0 0 900 620" xmlns="http://www.w3.org/2000/svg" style="margin:20px 0;">
  <defs>
    <linearGradient id="g19tab" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6d28d9"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="900" height="620" rx="14" fill="#fafafa" stroke="#e5e7eb" stroke-width="2"/>
  <rect x="0" y="0" width="900" height="52" rx="14" fill="url(#g19tab)"/>
  <text x="450" y="35" text-anchor="middle" font-family="Microsoft YaHei" font-size="20" fill="white" font-weight="bold">🎓 DVWA 全模块学习回顾（Day5 ~ Day18，共 14 章 · 16+ 漏洞类型）</text>
  <!-- 表头 -->
  <g font-family="Microsoft YaHei" font-size="12" font-weight="bold" fill="#1f2937">
    <rect x="10" y="62" width="55" height="30" rx="4" fill="#f3f4f6"/>
    <text x="37" y="81" text-anchor="middle">章节</text>
    <rect x="65" y="62" width="245" height="30" rx="4" fill="#f3f4f6"/>
    <text x="187" y="81" text-anchor="middle">模块名（点击 day-*.md 学习）</text>
    <rect x="310" y="62" width="45" height="30" rx="4" fill="#f3f4f6"/>
    <text x="332" y="81" text-anchor="middle">难度</text>
    <rect x="355" y="62" width="65" height="30" rx="4" fill="#f3f4f6"/>
    <text x="387" y="81" text-anchor="middle">机试分数</text>
    <rect x="420" y="62" width="470" height="30" rx="4" fill="#f3f4f6"/>
    <text x="655" y="81" text-anchor="middle">一句话核心原理 / Payload 口诀</text>
  </g>
  <!-- 数据行（14 行） -->
  <g font-family="Microsoft YaHei" font-size="11.5" fill="#111827">
    <!-- 1 -->
    <g transform="translate(0,94)">
      <rect x="10" y="0" width="880" height="36" fill="#eff6ff"/>
      <text x="37" y="23" text-anchor="middle" font-weight="bold">Day5</text>
      <text x="187" y="23" text-anchor="middle">环境搭建 + DVWA 安装 + 暴力破解 Brute Force</text>
      <text x="332" y="23" text-anchor="middle">⭐⭐</text>
      <text x="387" y="23" text-anchor="middle">8 分</text>
      <text x="655" y="23" text-anchor="middle">Burp Intruder + 弱口令字典；High 级先拿 user_token 再爆破</text>
    </g>
    <!-- 2 -->
    <g transform="translate(0,130)">
      <rect x="10" y="0" width="880" height="36" fill="#ecfdf5"/>
      <text x="37" y="23" text-anchor="middle" font-weight="bold">Day6</text>
      <text x="187" y="23" text-anchor="middle">命令注入 Command Injection</text>
      <text x="332" y="23" text-anchor="middle">⭐⭐⭐</text>
      <text x="387" y="23" text-anchor="middle">12 分</text>
      <text x="655" y="23" text-anchor="middle">127.0.0.1 &amp; whoami；绕空格用 ${IFS} / &lt; / {cat,file}</text>
    </g>
    <!-- 3 -->
    <g transform="translate(0,166)">
      <rect x="10" y="0" width="880" height="36" fill="#eff6ff"/>
      <text x="37" y="23" text-anchor="middle" font-weight="bold">Day7</text>
      <text x="187" y="23" text-anchor="middle">CSRF 跨站请求伪造</text>
      <text x="332" y="23" text-anchor="middle">⭐⭐⭐</text>
      <text x="387" y="23" text-anchor="middle">10 分</text>
      <text x="655" y="23" text-anchor="middle">POST 用 &lt;form&gt; 自动提交；GET 用 &lt;img src&gt;；High 级 SameSite Lax 必用 Token</text>
    </g>
    <!-- 4 -->
    <g transform="translate(0,202)">
      <rect x="10" y="0" width="880" height="36" fill="#ecfdf5"/>
      <text x="37" y="23" text-anchor="middle" font-weight="bold">Day8</text>
      <text x="187" y="23" text-anchor="middle">文件上传 File Upload（含图片马）</text>
      <text x="332" y="23" text-anchor="middle">⭐⭐⭐⭐</text>
      <text x="387" y="23" text-anchor="middle">15 分</text>
      <text x="655" y="23" text-anchor="middle">改 Content-Type；双后缀 .php.jpg；High 级 PHP&lt;5.3.4 用 %00 截断</text>
    </g>
    <!-- 5 -->
    <g transform="translate(0,238)">
      <rect x="10" y="0" width="880" height="36" fill="#eff6ff"/>
      <text x="37" y="23" text-anchor="middle" font-weight="bold">Day9</text>
      <text x="187" y="23" text-anchor="middle">文件包含 File Inclusion（LFI/RFI）</text>
      <text x="332" y="23" text-anchor="middle">⭐⭐⭐</text>
      <text x="387" y="23" text-anchor="middle">10 分</text>
      <text x="655" y="23" text-anchor="middle">LFI 用 ../ 穿越读 /etc/passwd；RFI 用 data:// 伪协议执行 PHP</text>
    </g>
    <!-- 6 -->
    <g transform="translate(0,274)">
      <rect x="10" y="0" width="880" height="36" fill="#ecfdf5"/>
      <text x="37" y="23" text-anchor="middle" font-weight="bold">Day10</text>
      <text x="187" y="23" text-anchor="middle">SQL 注入显注（SQL Injection）</text>
      <text x="332" y="23" text-anchor="middle">⭐⭐⭐⭐</text>
      <text x="387" y="23" text-anchor="middle">15 分</text>
      <text x="655" y="23" text-anchor="middle">1' UNION SELECT 1,2,3,version()-- ；绕引号用 0x 十六进制 / CHAR()</text>
    </g>
    <!-- 7 -->
    <g transform="translate(0,310)">
      <rect x="10" y="0" width="880" height="36" fill="#eff6ff"/>
      <text x="37" y="23" text-anchor="middle" font-weight="bold">Day11</text>
      <text x="187" y="23" text-anchor="middle">XSS 跨站脚本（反射+存储+DOM）</text>
      <text x="332" y="23" text-anchor="middle">⭐⭐⭐⭐</text>
      <text x="387" y="23" text-anchor="middle">15 分</text>
      <text x="655" y="23" text-anchor="middle">反射：&lt;script&gt;alert(1)&lt;/script&gt;；DOM 绕 CSP 用 onerror/onload 事件</text>
    </g>
    <!-- 8 -->
    <g transform="translate(0,346)">
      <rect x="10" y="0" width="880" height="36" fill="#fef3c7"/>
      <text x="37" y="23" text-anchor="middle" font-weight="bold">Day12</text>
      <text x="187" y="23" text-anchor="middle" fill="#92400e">🔓 Insecure CAPTCHA 不安全验证码</text>
      <text x="332" y="23" text-anchor="middle">⭐⭐⭐</text>
      <text x="387" y="23" text-anchor="middle">8 分</text>
      <text x="655" y="23" text-anchor="middle">两步式改密：Step1 过验证后直接 POST step=2，跳步骤绕过</text>
    </g>
    <!-- 9 -->
    <g transform="translate(0,382)">
      <rect x="10" y="0" width="880" height="36" fill="#fef3c7"/>
      <text x="37" y="23" text-anchor="middle" font-weight="bold">Day13</text>
      <text x="187" y="23" text-anchor="middle" fill="#92400e">🔓 Weak Session IDs 弱会话劫持</text>
      <text x="332" y="23" text-anchor="middle">⭐⭐⭐</text>
      <text x="387" y="23" text-anchor="middle">8 分</text>
      <text x="655" y="23" text-anchor="middle">抓包连续请求 10 次看 session 规律：自增 / 时间戳 / md5(时间戳)</text>
    </g>
    <!-- 10 -->
    <g transform="translate(0,418)">
      <rect x="10" y="0" width="880" height="36" fill="#fef3c7"/>
      <text x="37" y="23" text-anchor="middle" font-weight="bold">Day14</text>
      <text x="187" y="23" text-anchor="middle" fill="#92400e">🔓 CSP Bypass 内容安全策略绕过</text>
      <text x="332" y="23" text-anchor="middle">⭐⭐⭐</text>
      <text x="387" y="23" text-anchor="middle">6 分</text>
      <text x="655" y="23" text-anchor="middle">Low 有 'unsafe-inline'；Med 用 CDN 的 JSONP 回调；High nonce 日期 md5 可预测</text>
    </g>
    <!-- 11 -->
    <g transform="translate(0,454)">
      <rect x="10" y="0" width="880" height="36" fill="#fef3c7"/>
      <text x="37" y="23" text-anchor="middle" font-weight="bold">Day15</text>
      <text x="187" y="23" text-anchor="middle" fill="#92400e">🔓 JavaScript Attacks 前端 JS 闯关</text>
      <text x="332" y="23" text-anchor="middle">⭐⭐⭐</text>
      <text x="387" y="23" text-anchor="middle">6 分</text>
      <text x="655" y="23" text-anchor="middle">success=true 手改；XOR 可逆加密；Python requests 多步 token 流程自动化</text>
    </g>
    <!-- 12 -->
    <g transform="translate(0,490)">
      <rect x="10" y="0" width="880" height="36" fill="#fef3c7"/>
      <text x="37" y="23" text-anchor="middle" font-weight="bold">Day16</text>
      <text x="187" y="23" text-anchor="middle" fill="#92400e">🔓 SQL Injection Blind SQL 盲注</text>
      <text x="332" y="23" text-anchor="middle">⭐⭐⭐⭐⭐</text>
      <text x="387" y="23" text-anchor="middle">10 分</text>
      <text x="655" y="23" text-anchor="middle">布尔：ASCII(SUB(DATABASE(),1,1))&gt;97；时间：IF(...,SLEEP(3),0)</text>
    </g>
    <!-- 13 -->
    <g transform="translate(0,526)">
      <rect x="10" y="0" width="880" height="36" fill="#fef3c7"/>
      <text x="37" y="23" text-anchor="middle" font-weight="bold">Day17</text>
      <text x="187" y="23" text-anchor="middle" fill="#92400e">🔓 Open HTTP Redirect 开放式重定向</text>
      <text x="332" y="23" text-anchor="middle">⭐⭐</text>
      <text x="387" y="23" text-anchor="middle">5 分</text>
      <text x="655" y="23" text-anchor="middle">白名单@evil.com（@ 大法）；? 问号 / # 锚点切割 / // 协议相对 URL</text>
    </g>
    <!-- 14 -->
    <g transform="translate(0,562)">
      <rect x="10" y="0" width="880" height="36" fill="#fef3c7"/>
      <text x="37" y="23" text-anchor="middle" font-weight="bold">Day18</text>
      <text x="187" y="23" text-anchor="middle" fill="#92400e">🔓 HTTP Header Injection + 6 彩蛋</text>
      <text x="332" y="23" text-anchor="middle">⭐⭐⭐</text>
      <text x="387" y="23" text-anchor="middle">5 分</text>
      <text x="655" y="23" text-anchor="middle">双写 %0d%0a%0d%0a 绕一次 str_replace；两个 CRLF 跳到 Body 打 XSS</text>
    </g>
  </g>
  <!-- 总计 -->
  <rect x="10" y="598" width="880" height="16" rx="4" fill="#4c1d95"/>
  <text x="450" y="610" text-anchor="middle" font-family="Microsoft YaHei" font-size="12" fill="white" font-weight="bold">📊 机试核心漏洞总分合计：≈ 133 分中的 123 分（占比 ≈ 92%） → 学好 Day5~Day18 机试基本稳过！</text>
</svg>

> 💡 **一句话记忆上面这张大表：** **暴力破解开个头，命令注入最上头；CSRF 假手于人，文件上传拿 Webshell；文件包含读源码，SQL 注入扒数据；XSS 偷 Cookie，CAPTCHA 分两步；Weak Session 劫持身份，CSP/Redirect/Header 都是 HTTP 协议层的小坑；SQL 盲注最难点，JS 闯关考细心。** 把这句口诀念 3 遍，面试直接当开场白！🤣

---

## 19.2 漏洞危害金字塔：现实世界里，哪种漏洞最值钱？ 💎

学完了 DVWA 的 16+ 漏洞，很多同学都会问：**"老师，面试、护网、真实渗透测试，哪种漏洞最好用？我学的时候应该先攻哪个方向？"**

我用一张**"漏洞危害金字塔（现实世界真实排名）"**图给你排好序了：**塔尖最值钱（拿到直接高危/严重），塔底最常见但价值中等**。未来你学新漏洞、练靶场、投简历，都要按这个金字塔的优先级来分配时间！

<svg width="100%" viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg" style="margin:20px 0;">
  <rect x="0" y="0" width="800" height="560" rx="14" fill="#0f172a"/>
  <text x="400" y="40" text-anchor="middle" font-family="Microsoft YaHei" font-size="22" fill="#fef9c3" font-weight="bold">💎 漏洞危害金字塔（真实面试 / 护网 / 渗透测试 价值排名）</text>
  <!-- 金字塔底座：第 5 层低危 -->
  <polygon points="100,500 700,500 620,440 180,440" fill="#7dd3fc" opacity="0.9"/>
  <text x="400" y="470" text-anchor="middle" font-family="Microsoft YaHei" font-size="16" fill="#0c4a6e" font-weight="bold">第 5 层 · 低危 · 80% 网站有但单漏洞价值不高（3-5 分）</text>
  <text x="400" y="494" text-anchor="middle" font-family="Microsoft YaHei" font-size="13" fill="#0c4a6e">Open Redirect · CSP 配置不当 · 弱 Session · 信息泄露 · 版本号报错</text>
  <!-- 第 4 层 中危 -->
  <polygon points="180,440 620,440 540,380 260,380" fill="#a78bfa" opacity="0.95"/>
  <text x="400" y="410" text-anchor="middle" font-family="Microsoft YaHei" font-size="16" fill="#2e1065" font-weight="bold">第 4 层 · 中危 · 可配合其他漏洞组合成高危（5-10 分）</text>
  <text x="400" y="432" text-anchor="middle" font-family="Microsoft YaHei" font-size="13" fill="#2e1065">CSRF · 未授权访问 · Header Injection · DOM XSS · 任意文件下载</text>
  <!-- 第 3 层 高危 -->
  <polygon points="260,380 540,380 470,320 330,320" fill="#fbbf24" opacity="0.95"/>
  <text x="400" y="350" text-anchor="middle" font-family="Microsoft YaHei" font-size="16" fill="#78350f" font-weight="bold">第 3 层 · 高危 · 单一漏洞即可拿到权限（10-20 分）</text>
  <text x="400" y="372" text-anchor="middle" font-family="Microsoft YaHei" font-size="13" fill="#78350f">SQL 注入 · 存储型 XSS · 任意文件读取 · 命令注入 · 文件包含</text>
  <!-- 第 2 层 严重 -->
  <polygon points="330,320 470,320 420,260 380,260" fill="#f87171" opacity="0.95"/>
  <text x="400" y="290" text-anchor="middle" font-family="Microsoft YaHei" font-size="16" fill="#450a0a" font-weight="bold">第 2 层 · 严重 · 直接 RCE（远程代码执行）可拿服务器</text>
  <text x="400" y="312" text-anchor="middle" font-family="Microsoft YaHei" font-size="13" fill="#450a0a">任意文件上传（可解析 PHP）· 反序列化 · 结构化 RCE（ThinkPHP/Shiro 系列）</text>
  <!-- 第 1 层 塔尖 核弹级 -->
  <polygon points="380,260 420,260 400,200" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>
  <text x="400" y="235" text-anchor="middle" font-family="Microsoft YaHei" font-size="15" fill="white" font-weight="bold">塔尖 · 核弹级</text>
  <!-- 右侧说明 -->
  <g transform="translate(20,150)" font-family="Microsoft YaHei" font-size="12">
    <rect x="0" y="0" width="300" height="60" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
    <text x="150" y="24" text-anchor="middle" font-weight="bold" fill="#7f1d1d">🔥 塔尖 核弹级（30+ 分）</text>
    <text x="150" y="44" text-anchor="middle" fill="#7f1d1d">0day / Nday 组合利用 → 直接打穿内网</text>
  </g>
  <g transform="translate(480,150)" font-family="Microsoft YaHei" font-size="12">
    <rect x="0" y="0" width="300" height="60" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <text x="150" y="24" text-anchor="middle" font-weight="bold" fill="#78350f">🎯 面试 / 护网建议主攻</text>
    <text x="150" y="44" text-anchor="middle" fill="#78350f">第 2、3 层：上传 / SQLi / RCE 三板斧</text>
  </g>
  <g transform="translate(250,90)" font-family="Microsoft YaHei" font-size="12">
    <rect x="0" y="0" width="300" height="40" rx="6" fill="#0ea5e9" opacity="0.2" stroke="#0284c7" stroke-width="1.5"/>
    <text x="150" y="25" text-anchor="middle" fill="#e0f2fe">💡 DVWA 已覆盖第 3~5 层 + 部分第 2 层</text>
  </g>
  <!-- 时间建议 -->
  <g transform="translate(20,525)" font-family="Microsoft YaHei" font-size="13">
    <rect x="0" y="0" width="760" height="26" rx="6" fill="#1e293b" stroke="#334155"/>
    <text x="380" y="18" text-anchor="middle" fill="#cbd5e1">⏱ 零基础时间分配建议：第 2 层 40% · 第 3 层 40% · 第 4 层 15% · 第 5 层 5%（性价比最高）</text>
  </g>
</svg>

---

## 19.3 零基础小白后续学习路线：通关 DVWA 之后该怎么走？ 🗺

**问题：我 DVWA 全通关了，下一个靶场玩什么？学多久？学到什么程度算合格？**

这是每个小白通关 DVWA 之后的第一问！我给你整理了**一张 6 阶段学习路线图**（约 5~7 个月走完全程，每周 6~8 小时即可，适合零基础 + 在职党），每阶段**目标明确、靶场明确、验收标准明确**，你照着走就不会迷路！🚀

<svg width="100%" viewBox="0 0 900 510" xmlns="http://www.w3.org/2000/svg" style="margin:20px 0;">
  <defs>
    <linearGradient id="g19path" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#14b8a6"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="900" height="510" rx="14" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
  <text x="450" y="38" text-anchor="middle" font-family="Microsoft YaHei" font-size="21" fill="#0f172a" font-weight="bold">🗺 零基础后续 6 阶段学习路线图（通关 DVWA → 准 Web 安全工程师）</text>
  <!-- 连接线 -->
  <line x1="110" y1="260" x2="790" y2="260" stroke="url(#g19path)" stroke-width="6" stroke-linecap="round"/>
  <!-- 阶段块 1 -->
  <g transform="translate(25,85)">
    <rect x="0" y="0" width="170" height="150" rx="12" fill="#ecfeff" stroke="#0891b2" stroke-width="3"/>
    <rect x="0" y="0" width="170" height="36" rx="12" fill="#0891b2"/>
    <rect x="0" y="24" width="170" height="12" fill="#0891b2"/>
    <text x="85" y="22" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="white" font-weight="bold">阶段 ① · 1~2 周</text>
    <text x="85" y="70" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="#164e63" font-weight="bold">SQLi-Labs 全通关</text>
    <text x="85" y="96" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#155e75">Less1~Less65 走一遍</text>
    <text x="85" y="116" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#155e75">重点：字符型/数字型/报错/时间盲注</text>
    <rect x="20" y="125" width="130" height="18" rx="4" fill="#0891b2"/>
    <text x="85" y="138" text-anchor="middle" font-family="Microsoft YaHei" font-size="10.5" fill="white" font-weight="bold">✅ 验收：Less1-25 不看答案通关</text>
    <!-- 箭头节点 -->
    <circle cx="85" cy="190" r="9" fill="white" stroke="#0891b2" stroke-width="3"/>
  </g>
  <!-- 阶段块 2 -->
  <g transform="translate(205,85)">
    <rect x="0" y="0" width="170" height="150" rx="12" fill="#f0fdf4" stroke="#16a34a" stroke-width="3"/>
    <rect x="0" y="0" width="170" height="36" rx="12" fill="#16a34a"/>
    <rect x="0" y="24" width="170" height="12" fill="#16a34a"/>
    <text x="85" y="22" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="white" font-weight="bold">阶段 ② · 2~3 周</text>
    <text x="85" y="70" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="#14532d" font-weight="bold">Pikachu 中文靶场</text>
    <text x="85" y="96" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#166534">中文 + 超详细提示 + SSRF/XXE 新模块</text>
    <text x="85" y="116" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#166534">重点：SSRF / XXE / 反序列化</text>
    <rect x="20" y="125" width="130" height="18" rx="4" fill="#16a34a"/>
    <text x="85" y="138" text-anchor="middle" font-family="Microsoft YaHei" font-size="10.5" fill="white" font-weight="bold">✅ 验收：能写 XSS 盲打 / SSRF 内网探测脚本</text>
    <circle cx="85" cy="190" r="9" fill="white" stroke="#16a34a" stroke-width="3"/>
  </g>
  <!-- 阶段块 3 -->
  <g transform="translate(385,85)">
    <rect x="0" y="0" width="170" height="150" rx="12" fill="#fff7ed" stroke="#ea580c" stroke-width="3"/>
    <rect x="0" y="0" width="170" height="36" rx="12" fill="#ea580c"/>
    <rect x="0" y="24" width="170" height="12" fill="#ea580c"/>
    <text x="85" y="22" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="white" font-weight="bold">阶段 ③ · 1~1.5 月</text>
    <text x="85" y="70" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="#7c2d12" font-weight="bold">VulnHub 靶机提权</text>
    <text x="85" y="96" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#9a3412">从 Web Shell → 拿到 root / 管理员</text>
    <text x="85" y="116" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#9a3412">入门靶机：Kioptrix 1~4 / Stapler</text>
    <rect x="20" y="125" width="130" height="18" rx="4" fill="#ea580c"/>
    <text x="85" y="138" text-anchor="middle" font-family="Microsoft YaHei" font-size="10.5" fill="white" font-weight="bold">✅ 验收：独立拿下 5 台 VulnHub 靶机 root</text>
    <circle cx="85" cy="190" r="9" fill="white" stroke="#ea580c" stroke-width="3"/>
  </g>
  <!-- 阶段块 4 -->
  <g transform="translate(565,85)">
    <rect x="0" y="0" width="170" height="150" rx="12" fill="#fef2f2" stroke="#dc2626" stroke-width="3"/>
    <rect x="0" y="0" width="170" height="36" rx="12" fill="#dc2626"/>
    <rect x="0" y="24" width="170" height="12" fill="#dc2626"/>
    <text x="85" y="22" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="white" font-weight="bold">阶段 ④ · 1~2 月</text>
    <text x="85" y="70" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="#450a0a" font-weight="bold">CTF 平台刷题实战</text>
    <text x="85" y="96" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#7f1d1d">BUUCTF / 攻防世界 / NSSCTF</text>
    <text x="85" y="116" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#7f1d1d">Web 分类先做 Easy → Medium</text>
    <rect x="20" y="125" width="130" height="18" rx="4" fill="#dc2626"/>
    <text x="85" y="138" text-anchor="middle" font-family="Microsoft YaHei" font-size="10.5" fill="white" font-weight="bold">✅ 验收：独立解 50+ 道 Web CTF 题</text>
    <circle cx="85" cy="190" r="9" fill="white" stroke="#dc2626" stroke-width="3"/>
  </g>
  <!-- 阶段块 5 -->
  <g transform="translate(205,310)">
    <rect x="0" y="0" width="170" height="150" rx="12" fill="#f5f3ff" stroke="#7c3aed" stroke-width="3"/>
    <rect x="0" y="0" width="170" height="36" rx="12" fill="#7c3aed"/>
    <rect x="0" y="24" width="170" height="12" fill="#7c3aed"/>
    <text x="85" y="22" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="white" font-weight="bold">阶段 ⑤ · 2~3 周</text>
    <text x="85" y="70" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="#2e1065" font-weight="bold">CISP-PTE 机试模拟</text>
    <text x="85" y="96" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#4c1d95">把 DVWA + SQLi-Labs + Pikachu 按 4 小时模考</text>
    <text x="85" y="116" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#4c1d95">练习写报告 + 截图留痕</text>
    <rect x="20" y="125" width="130" height="18" rx="4" fill="#7c3aed"/>
    <text x="85" y="138" text-anchor="middle" font-family="Microsoft YaHei" font-size="10.5" fill="white" font-weight="bold">✅ 验收：模拟考能拿 90+ / 100</text>
    <circle cx="85" cy="-5" r="9" fill="white" stroke="#7c3aed" stroke-width="3"/>
  </g>
  <!-- 阶段块 6 -->
  <g transform="translate(465,310)">
    <rect x="0" y="0" width="250" height="150" rx="12" fill="#fdf4ff" stroke="#a21caf" stroke-width="3"/>
    <rect x="0" y="0" width="250" height="36" rx="12" fill="#a21caf"/>
    <rect x="0" y="24" width="250" height="12" fill="#a21caf"/>
    <text x="125" y="22" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="white" font-weight="bold">阶段 ⑥ · 持续（找工作 &amp; 护网）</text>
    <text x="125" y="70" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="#581c87" font-weight="bold">真实面试 + 护网 HW 实战</text>
    <text x="125" y="96" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#701a75">① 简历写"靶场经验 + CTF 解题数 + 靶机拿下台数"</text>
    <text x="125" y="116" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#701a75">② 护网报名蓝队攻击队 → 拿真实经验和钱</text>
    <rect x="30" y="125" width="190" height="18" rx="4" fill="#a21caf"/>
    <text x="125" y="138" text-anchor="middle" font-family="Microsoft YaHei" font-size="10.5" fill="white" font-weight="bold">✅ 验收：拿到第一份 Web 安全 / 渗透测试 Offer 🎉</text>
    <circle cx="125" cy="-5" r="9" fill="white" stroke="#a21caf" stroke-width="3"/>
  </g>
  <!-- 顶部：你现在的位置 -->
  <g transform="translate(25,235)">
    <polygon points="0,0 18,0 9,12" fill="#f97316"/>
    <rect x="-18" y="-40" width="100" height="28" rx="5" fill="#f97316"/>
    <text x="32" y="-21" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="white" font-weight="bold">📍 你现在在这里（阶段①起点）</text>
  </g>
  <!-- 总耗时 -->
  <rect x="300" y="470" width="300" height="32" rx="6" fill="#1e293b"/>
  <text x="450" y="490" text-anchor="middle" font-family="Microsoft YaHei" font-size="13" fill="#fbbf24" font-weight="bold">⏱ 总周期：5 ~ 7 个月 · 每周 6-8 小时即可（适合零基础 + 在职党）</text>
</svg>

---

## 19.4 下章预告：Day20 我们进入 SQLi-Labs Less1-10（10 关通关密码大公开！🔑）

Day20.md（就是我们刚顺延过来的原 day13）是**全世界最专业、最系统的 SQL 注入专项训练场——SQLi-Labs** 的入门篇。我提前给你剧透一下 Less1~Less10 分别是什么，明天一打开就有底！👇

| 关卡 | 注入类型 | 一句话通关密码（供你预习） | 难度 |
|---|---|---|---|
| **Less-1** | 字符型（单引号闭合）显错注入 | `?id=1' UNION SELECT 1,2,database()--+` | ⭐ |
| **Less-2** | 数字型（无闭合符）显错注入 | `?id=1 UNION SELECT 1,2,database()` | ⭐ |
| **Less-3** | 单引号+括号闭合 `')` | `?id=1') UNION SELECT 1,2,database()--+` | ⭐⭐ |
| **Less-4** | 双引号+括号闭合 `")` | `?id=1") UNION SELECT 1,2,database()--+` | ⭐⭐ |
| **Less-5** | 双查询报错注入（Double Query） | `?id=1' AND (SELECT COUNT(*) FROM information_schema.tables GROUP BY CONCAT(version(),FLOOR(RAND(0)*2)))--+` | ⭐⭐⭐ |
| **Less-6** | 双引号版 Double Query 报错 | `id=1" AND (Less-5 的 payload，把 ' 换 ")--+` | ⭐⭐⭐ |
| **Less-7** | 文件写入 GetShell（into outfile） | 先猜绝对路径 → `?id=1')) UNION SELECT 1,'<?php phpinfo();?>',3 INTO OUTFILE 'C:/phpStudy/WWW/shell.php'--+` | ⭐⭐⭐⭐ |
| **Less-8** | **布尔盲注**（和 Day16 几乎一模一样！） | 直接用 Day16 的 Python 脚本改改 payload 就通！ | ⭐⭐⭐⭐ |
| **Less-9** | **时间盲注**（不管对不对页面都一样！） | `IF(SUB(DATABASE(),1,1)='a',SLEEP(3),0)` 直接跑时间差 | ⭐⭐⭐⭐⭐ |
| **Less-10** | 双引号版时间盲注 | Less-9 的 payload 把单引号改成双引号即可 | ⭐⭐⭐⭐⭐ |

> 🔥 **预习小任务（今天就能做！）**：明天 Day20 上课前，你先猜一下——**Less-1 到 Less-10 最大的区别其实只有一个东西？** 答案揭晓：**就是 SQL 语句里闭合 $id 变量的符号不一样**（' / " / ') / ") / 无闭合）。学会这个心法，Less1-10 只要"测闭合符 → 套 UNION 模板"就能通一大半！😎

---

## 19.5 DVWA 毕业典礼：最终毕业自测题（全 DVWA 综合卷）🎓

最后了！为了让你有**通关的仪式感**，我出了一张"DVWA 毕业测试卷"。满分 100，**80 分以上颁发「DVWA 全模块通关认证」毕业证书**！🎓

### 🎓 毕业测试卷（满分 100 分 · 建议闭卷 45 分钟）

**一、选择题（每题 5 分，共 10 题 = 50 分）**

1. 某 DVWA 文件上传 High 级别，PHP 版本 5.2.17，白名单只允许 `.jpg`，以下 payload 最可能直接上传执行 PHP 的是？
   - A. `shell.php.jpg`（双后缀）
   - B. `shell.php%00.jpg`（空字节截断）
   - C. `shell.php` 改 Content-Type 为 `image/jpeg`
   - D. 改文件名为 `.htaccess` 覆盖 Apache 配置

2. SQL 注入过滤了所有单引号 `'`，下列哪种**不能**绕过？
   - A. 用十六进制字符串：`user=0x61646d696e`
   - B. 用 CHAR()：`user=CHAR(97,100,109,105,110)`
   - C. 反引号包裹：`` user=`admin` ``
   - D. 若该注入点是数字型（没有引号），直接写 `1 UNION SELECT ...`

3. CSP 响应头为 `script-src 'self' https://cdn.bootcdn.net`，下列哪个**不能**执行 XSS？
   - A. `<script src="https://cdn.bootcdn.net/ajax/libs/angular.js/1.5.6/angular.js"></script>` + Angular JS sandbox escape（JSONP 绕过）
   - B. `<img src=x onerror=alert(1)>`
   - C. 如果 CDN 支持 JSONP 回调，比如 `?callback=alert(1)`，拼到 script src 里
   - D. 在 `'self'` 目录下有一个可上传的可控 JS 文件，外链即可

4. 以下**不属于**开放式重定向常见绕过的是？
   - A. `?redirect=http://white.com@evil.com`（@ 大法）
   - B. `?redirect=http://evil.com?white.com`（? 问号切割）
   - C. `?redirect=//evil.com`（协议相对 URL）
   - D. `?redirect=1' UNION SELECT 1,2--`（SQL 注入 Payload）

5. 命令注入场景，`;` 和 `&` 都被过滤，**空格也被过滤**，在 Linux bash 下最适合执行 `cat /etc/passwd` 的 payload 是？
   - A. `1;cat /etc/passwd`
   - B. `1&cat /etc/passwd`
   - C. `1|cat${IFS}/etc/passwd`
   - D. `1&&cat /etc/passwd`

6. 某站点设置 Cookie 时直接拼接用户输入 `header("Set-Cookie: site_theme=" . $_GET['theme'])`，打 CRLF 注入 XSS 的核心 Payload 结构是？
   - A. `zh_CN<script>alert(1)</script>`
   - B. `zh_CN%20<script>alert(1)</script>`（加空格）
   - C. `zh_CN%0d%0a%0d%0a<script>alert(1)</script>`（两个 CRLF → 跳 Body）
   - D. `zh_CN</script><script>alert(1)</script>`（闭合标签）

7. CSRF 攻击的"不可缺少的三要素"中，**不包括**以下哪一项？
   - A. 目标站点没有对关键操作做 CSRF Token 校验
   - B. 攻击者能在第三方站点构造请求（form / img）
   - C. 受害者必须处于"已登录目标站点"的状态（Cookie 自动带）
   - D. 目标站点必须存在 XSS 漏洞

8. DVWA CAPTCHA Low 级两步式改密，最稳的绕过思路是？
   - A. 用 OCR 识别验证码图片
   - B. 直接跳过 step1，只 POST `step=2 + 新密码`（后端 step2 没校验 step1 状态）
   - C. 手动过一次验证码然后再爆破
   - D. 用 SQL 注入改 admin 密码

9. Session 固定攻击（Session Fixation）最理想的触发方式是？
   - A. 暴力枚举 Session ID 的所有可能值
   - B. 通过 CRLF 注入给受害者 `Set-Cookie: PHPSESSID=黑客知道的固定值` → 等受害者登录 → 黑客用同一个 PHPSESSID 登录
   - C. XSS 拿到受害者 Cookie 里的 PHPSESSID
   - D. 会话里没有设置 HTTPOnly

10. DVWA JavaScript Attacks 第 2 关（XOR 加密），核心是？
    - A. 加密用的密钥 `0xAA` 就在前端代码里，XOR 是对称的，密文再 XOR 一次密钥就出明文
    - B. 需要抓登录包看 HTTP 请求里的 secret
    - C. 直接把 `success=false` 改成 `success=true`
    - D. 这关必须用 OCR 识别验证码

---

**二、实操题（每题 25 分，共 2 题 = 50 分）**

11. **实操一：DVWA SQL Blind High 级别，30 分钟内**
   切 high 级别，写出 Python 脚本（可以用 Day16 的模板），**自动输出**：
   - 当前数据库名
   - 当前库下第一张表的表名

12. **实操二：DVWA File Upload High 级别，20 分钟内**
   切 high 级别，上传一张带 PHP 一句话的图片马，然后结合文件包含（File Inclusion）模块，**执行 `phpinfo()` 并截图**。

---

**📜 毕业证书评分标准：**
- **90+ 分** 🥇 金牌毕业生：直接进阶段 ② 挑战 Pikachu SSRF/XXE 新漏洞，PTE 机试已经问题不大！
- **80+ 分** 🎓 正式毕业生：可以开始 SQLi-Labs Less1-25 冲刺，同时把 CheatSheet 每天过一遍
- **60+ 分** ✅ 合格毕业生：针对错题的章节回去复习一遍，特别是命令注入 Payload 大全和盲注 Python 脚本
- **60 分以下** 🔧 重修建议：Day8（XSS）、Day10（SQLi）、Day16（盲注）这三章重新看一遍 + 重打对应模块，三周后再测

---

## 19.6 写在最后：致即将从 DVWA 毕业的你 💌

**亲爱的同学们，**

如果你是零基础从 Day1 一路看到这一章，我要真诚地对你说一句：**你真的很棒！** 👍

安全行业的入门并不容易——很多人在"装环境装一周还没成功"的时候就放弃了，很多人在看到第一个 UNION SELECT 的时候不知道从哪下手，很多人看到 Python 盲注脚本长几百行直接关了页面。但你坚持下来了，你把 14 个核心模块、4 个难度级别、100+ 个真实 Payload、6 个自动化脚本全部走过了一遍。

**你已经拿到了进入安全行业的第一张船票。** 🚢

但我也想诚实地告诉你：**通关 DVWA 只是起点，不是终点。** 真实世界的站点比 DVWA 复杂 100 倍——它有 WAF、有宝塔、有云盾、有日志审计、有安全运营团队 24 小时盯着。未来你会遇到 SQL 绕 WAF 用 20 种编码嵌套，会遇到上传点白名单校验写死到文件头字节级，会遇到反序列化的 POP 链需要你看懂 PHP 内核。

**但别怕！** 因为你已经掌握了最最核心的东西——**"攻击者思维 + 原理派学习法"**：
- 看到每一段代码，你都会本能地问：**"这个变量从哪里来？有没有被过滤？最终拼接进了哪个危险函数？"**
- 遇到每一个报错，你都会本能地想：**"这是 MySQL 报错还是 PHP 报错？能不能注入？能不能外带数据？"**

**这就是 DVWA 这 15 天教给你最值钱的东西——不是那 100 个 Payload，而是"永远站在攻击者角度想问题"的习惯。**

最后，送给你一句我特别喜欢的话，贴在你桌面上激励接下来的半年：

> **"安全之路，道阻且长；行则将至，做则必成。"**

明天 Day20，我们 SQLi-Labs Less1-10 正式见！**同学们，毕业快乐！下一站，SQL 注入大拿！** 🚀🎊

---
<small>📝 **本章作者寄语**：本章所有资料均来自作者真实教学经验 + CISP-PTE 真实机试考点整理 + OWASP Top10 官方建议。如果这 15 章 DVWA 真的帮到了你，请把它推荐给同样零基础想入行的朋友！授人以鱼不如授人以渔 🌊</small>
