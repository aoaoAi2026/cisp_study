# 第四章 第一个靶场——DVWA搭建全流程

> 第4章 | 难度：⭐⭐ | 阅读时间：30分钟

***

## 📖 写在前面

小伙伴们，激动人心的时刻到了！

前面三章我们做了一大堆准备工作——装PHPStudy、了解靶场是什么、准备各种工具... 是不是有点手痒了？是不是早就想"真刀真枪"干一把了？

别急，这一章我们就来搭建你的**第一个靶场**！

想象一下：

- 学开车的人，第一次摸到方向盘是什么心情？
- 学游泳的人，第一次跳进泳池是什么心情？
- 学做饭的人，第一次拿起锅铲是什么心情？

现在，你就要第一次"触碰"真实的漏洞了！那种既兴奋又紧张的感觉，是不是特别棒？🎉

这一章我们要搭的靶场叫 **DVWA**，它是Web安全入门的"新手村"，几乎所有Web安全大佬都是从它开始的。

废话不多说，咱们开始吧！

***

## 4.1 DVWA是个啥？

### 4.1.1 用大白话解释

先说说DVWA的全称：**Damn Vulnerable Web Application**

翻译过来就是：**"该死的易受攻击的Web应用程序"** 😂

名字听起来有点嚣张，但确实很贴切——这玩意儿就是故意写得满身是漏洞，等你来搞的。

用大白话讲，DVWA就是Web安全的\*\*"新手村"\*\*：

- 它把各种常见的Web漏洞都简化了，放在你面前
- 就像驾校的教练车，副驾驶有刹车，撞了也不怕
- 你可以在里面反复练习，不用担心搞坏什么

打个比方：

- 学数学 → 做练习题集
- 学英语 → 背单词书
- 学武术 → 打木人桩
- **学Web安全 → 打DVWA**

DVWA就是你的第一本"练习题集"，第一个"木人桩"。

### 4.1.2 为什么选DVWA作为第一个靶场？

可能你会问：网上靶场那么多，为啥非要从DVWA开始？

问得好！选DVWA作为第一个靶场，有这几个原因：

**1️⃣ 经典中的经典**

> DVWA出来很多年了，是Web安全入门的"标配"。几乎所有教程、所有课程、所有大佬，都是从DVWA开始讲的。你随便搜一个漏洞，都能找到DVWA的相关教程。

**2️⃣ 漏洞全面**

> DVWA包含了最常见的十几种Web漏洞，SQL注入、XSS、文件上传、命令注入... 你能想到的Web漏洞，它基本都有。打完一遍DVWA，你对Web安全就有整体认识了。

**3️⃣ 从易到难**

> DVWA有四个难度级别：Low（简单）、Medium（中等）、High（困难）、Impossible（不可能）。就像游戏难度一样，你可以从最简单的开始，慢慢升级，循序渐进。

**4️⃣ 代码简单**

> DVWA的代码不复杂，新手也能看懂。等你把漏洞利用明白了，还可以去看它的源码，理解漏洞产生的根本原因。

**5️⃣ 搭建简单**

> 就是一个PHP网站，扔到PHPStudy里就能跑，不用装一堆复杂的东西。

总结一下：**经典、全面、友好、简单**。对于新手来说，DVWA就是最佳选择。

### 4.1.3 DVWA包含哪些漏洞模块？

DVWA到底有哪些漏洞呢？我给大家简单列一下（不同版本可能略有差异）：

| 模块名                       | 漏洞类型    | 一句话介绍          |
| ------------------------- | ------- | -------------- |
| **Brute Force**           | 暴力破解    | 就是猜密码，用工具一个一个试 |
| **Command Injection**     | 命令注入    | 在网站上执行系统命令     |
| **CSRF**                  | 跨站请求伪造  | 骗用户点击，偷偷干坏事    |
| **File Inclusion**        | 文件包含    | 读取或执行网站上的文件    |
| **File Upload**           | 文件上传    | 上传恶意文件getshell |
| **Insecure CAPTCHA**      | 不安全的验证码 | 绕过验证码          |
| **SQL Injection**         | SQL注入   | 注入SQL语句，盗取数据   |
| **SQL Injection (Blind)** | SQL盲注   | 看不到回显的SQL注入    |
| **XSS (Reflected)**       | 反射型XSS  | 把脚本藏在URL里      |
| **XSS (Stored)**          | 存储型XSS  | 把脚本存在数据库里      |
| **XSS (DOM)**             | DOM型XSS | 在DOM里搞事情       |

是不是感觉漏洞还挺多的？别慌，我们后面会一个一个学，一个一个打。打完这些，你就算入门了！💪

### 4.1.4 图示：DVWA 十大模块 × 四大难度 架构全景 🗺️

下面这张图帮你一眼看懂 DVWA 的"布局"——**横向是 4 个难度等级**（像游戏的 Easy/Normal/Hard/Hell），**纵向是 10 大漏洞模块**（就是每关的打怪场地），每条箭头上你都能看到对应难度下的防护强度，心里先有个地图再闯关不迷路：

<svg viewBox="0 0 1140 520" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1000px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">

  <defs>
    <linearGradient id="dvwa-hd-low" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3bff9a"/><stop offset="100%" stop-color="#00a363"/></linearGradient>
    <linearGradient id="dvwa-hd-med" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffe16b"/><stop offset="100%" stop-color="#e0a500"/></linearGradient>
    <linearGradient id="dvwa-hd-hi"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffa36b"/><stop offset="100%" stop-color="#d24a00"/></linearGradient>
    <linearGradient id="dvwa-hd-imp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff6b8a"/><stop offset="100%" stop-color="#a1003c"/></linearGradient>
    <linearGradient id="dvwa-mod" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a3556"/><stop offset="100%" stop-color="#151a30"/></linearGradient>
  </defs>
  <!-- 标题 -->
  <text x="570" y="36" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 4-1  DVWA 四大难度 × 十大模块 全景地图</text>
  <!-- 表头：4个难度 -->
  <g font-family="Arial" font-size="14" font-weight="bold">
    <rect x="260" y="60"  width="210" height="46" rx="10" fill="url(#dvwa-hd-low)"/><text x="365" y="89" text-anchor="middle" fill="#072515">① Low（新手村）— 几乎无防护</text>
    <rect x="490" y="60"  width="210" height="46" rx="10" fill="url(#dvwa-hd-med)"/><text x="595" y="89" text-anchor="middle" fill="#3a2400">② Medium（有点东西）— 简单过滤</text>
    <rect x="720" y="60"  width="210" height="46" rx="10" fill="url(#dvwa-hd-hi)"/><text x="825" y="89" text-anchor="middle" fill="#fff">③ High（老油条）— 多重绕过</text>
    <rect x="950" y="60"  width="170" height="46" rx="10" fill="url(#dvwa-hd-imp)"/><text x="1035" y="89" text-anchor="middle" fill="#fff">④ Impossible ⛔ 神仙难度</text>
  </g>
  <!-- 10 大模块 行 -->
  <g font-family="Arial" font-size="13" fill="#e6eaf5">
    <rect x="10" y="120" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="142" text-anchor="middle">Brute Force · 暴力破解密码</text>
    <rect x="10" y="162" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="184" text-anchor="middle">Command Injection · 命令注入</text>
    <rect x="10" y="204" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="226" text-anchor="middle">CSRF · 跨站请求伪造改密码</text>
    <rect x="10" y="246" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="268" text-anchor="middle">File Inclusion · 文件包含(LFI/RFI)</text>
    <rect x="10" y="288" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="310" text-anchor="middle">File Upload · 一句话木马上传</text>
    <rect x="10" y="330" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="352" text-anchor="middle">Insecure CAPTCHA · 验证码绕过</text>
    <rect x="10" y="372" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="394" text-anchor="middle">SQL Injection · 显注入爆数据</text>
    <rect x="10" y="414" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="436" text-anchor="middle">SQL Injection (Blind) · 盲注</text>
    <rect x="10" y="456" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="478" text-anchor="middle">XSS Reflected · 反射型跨站脚本</text>
    <rect x="10" y="498" width="230" height="14" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/>
  </g>
  <!-- 箭头连线 + 防护标签（每个模块4条 -->
  <g stroke="#6879b0" stroke-width="1" opacity="0.85">
    <!-- 每个模块在 y=137,179... -->
    <line x1="240" y1="137" x2="950" y2="137" stroke-dasharray="2 4"/>
    <line x1="240" y1="179" x2="950" y2="179" stroke-dasharray="2 4"/>
    <line x1="240" y1="221" x2="950" y2="221" stroke-dasharray="2 4"/>
    <line x1="240" y1="263" x2="950" y2="263" stroke-dasharray="2 4"/>
    <line x1="240" y1="305" x2="950" y2="305" stroke-dasharray="2 4"/>
    <line x1="240" y1="347" x2="950" y2="347" stroke-dasharray="2 4"/>
    <line x1="240" y1="389" x2="950" y2="389" stroke-dasharray="2 4"/>
    <line x1="240" y1="431" x2="950" y2="431" stroke-dasharray="2 4"/>
    <line x1="240" y1="473" x2="950" y2="473" stroke-dasharray="2 4"/>
    <line x1="240" y1="505" x2="950" y2="505" stroke-dasharray="2 4"/>
  </g>
  <!-- 每列强度小圆点 示例：XSS SQL Upload 这三行重点标红 -->
  <g font-size="11" fill="#fff" text-anchor="middle" font-family="Arial">
    <!-- SQLi (389) -->
    <circle cx="365" cy="389" r="6" fill="#3bff9a"/><text x="365" y="393">✓</text>
    <circle cx="595" cy="389" r="6" fill="#ffe16b"/><text x="595" y="393" fill="#000">▲</text>
    <circle cx="825" cy="389" r="6" fill="#ffa36b"/><text x="825" y="393">✦</text>
    <circle cx="1035" cy="389" r="6" fill="#ff6b8a"/><text x="1035" y="393">✕</text>
    <!-- Upload (305) -->
    <circle cx="365" cy="305" r="6" fill="#3bff9a"/><text x="365" y="309">✓</text>
    <circle cx="595" cy="305" r="6" fill="#ffe16b"/><text x="595" y="309" fill="#000">▲</text>
    <circle cx="825" cy="305" r="6" fill="#ffa36b"/><text x="825" y="309">✦</text>
    <circle cx="1035" cy="305" r="6" fill="#ff6b8a"/><text x="1035" y="309">✕</text>
    <!-- XSS Reflected (473) -->
    <circle cx="365" cy="473" r="6" fill="#3bff9a"/><text x="365" y="477">✓</text>
    <circle cx="595" cy="473" r="6" fill="#ffe16b"/><text x="595" y="477" fill="#000">▲</text>
    <circle cx="825" cy="473" r="6" fill="#ffa36b"/><text x="825" y="477">✦</text>
    <circle cx="1035" cy="473" r="6" fill="#ff6b8a"/><text x="1035" y="477">✕</text>
  </g>
  <!-- 图例 -->
  <g font-family="Arial" font-size="12" fill="#b8c3e0">
    <rect x="280" y="500" width="14" height="10" fill="#3bff9a" rx="2"/><text x="300" y="509">✓ 能直接打</text>
    <rect x="395" y="500" width="14" height="10" fill="#ffe16b" rx="2"/><text x="415" y="509" fill="#ffe16b">▲ 要绕过1次</text>
    <rect x="515" y="500" width="14" height="10" fill="#ffa36b" rx="2"/><text x="535" y="509" fill="#ffa36b">✦ 要多重绕过</text>
    <rect x="645" y="500" width="14" height="10" fill="#ff6b8a" rx="2"/><text x="665" y="509" fill="#ff6b8a">✕ 基本无解(教学用)</text>
  </g>
# 第四章 第一个靶场——DVWA搭建全流程

> 第4章 | 难度：⭐⭐ | 阅读时间：30分钟

***

## 📖 写在前面

小伙伴们，激动人心的时刻到了！

前面三章我们做了一大堆准备工作——装PHPStudy、了解靶场是什么、准备各种工具... 是不是有点手痒了？是不是早就想"真刀真枪"干一把了？

别急，这一章我们就来搭建你的**第一个靶场**！

想象一下：

- 学开车的人，第一次摸到方向盘是什么心情？
- 学游泳的人，第一次跳进泳池是什么心情？
- 学做饭的人，第一次拿起锅铲是什么心情？

现在，你就要第一次"触碰"真实的漏洞了！那种既兴奋又紧张的感觉，是不是特别棒？🎉

这一章我们要搭的靶场叫 **DVWA**，它是Web安全入门的"新手村"，几乎所有Web安全大佬都是从它开始的。

废话不多说，咱们开始吧！

***

## 4.1 DVWA是个啥？

### 4.1.1 用大白话解释

先说说DVWA的全称：**Damn Vulnerable Web Application**

翻译过来就是：**"该死的易受攻击的Web应用程序"** 😂

名字听起来有点嚣张，但确实很贴切——这玩意儿就是故意写得满身是漏洞，等你来搞的。

用大白话讲，DVWA就是Web安全的\*\*"新手村"\*\*：

- 它把各种常见的Web漏洞都简化了，放在你面前
- 就像驾校的教练车，副驾驶有刹车，撞了也不怕
- 你可以在里面反复练习，不用担心搞坏什么

打个比方：

- 学数学 → 做练习题集
- 学英语 → 背单词书
- 学武术 → 打木人桩
- **学Web安全 → 打DVWA**

DVWA就是你的第一本"练习题集"，第一个"木人桩"。

### 4.1.2 为什么选DVWA作为第一个靶场？

可能你会问：网上靶场那么多，为啥非要从DVWA开始？

问得好！选DVWA作为第一个靶场，有这几个原因：

**1️⃣ 经典中的经典**

> DVWA出来很多年了，是Web安全入门的"标配"。几乎所有教程、所有课程、所有大佬，都是从DVWA开始讲的。你随便搜一个漏洞，都能找到DVWA的相关教程。

**2️⃣ 漏洞全面**

> DVWA包含了最常见的十几种Web漏洞，SQL注入、XSS、文件上传、命令注入... 你能想到的Web漏洞，它基本都有。打完一遍DVWA，你对Web安全就有整体认识了。

**3️⃣ 从易到难**

> DVWA有四个难度级别：Low（简单）、Medium（中等）、High（困难）、Impossible（不可能）。就像游戏难度一样，你可以从最简单的开始，慢慢升级，循序渐进。

**4️⃣ 代码简单**

> DVWA的代码不复杂，新手也能看懂。等你把漏洞利用明白了，还可以去看它的源码，理解漏洞产生的根本原因。

**5️⃣ 搭建简单**

> 就是一个PHP网站，扔到PHPStudy里就能跑，不用装一堆复杂的东西。

总结一下：**经典、全面、友好、简单**。对于新手来说，DVWA就是最佳选择。

### 4.1.3 DVWA包含哪些漏洞模块？

DVWA到底有哪些漏洞呢？我给大家简单列一下（不同版本可能略有差异）：

| 模块名                       | 漏洞类型    | 一句话介绍          |
| ------------------------- | ------- | -------------- |
| **Brute Force**           | 暴力破解    | 就是猜密码，用工具一个一个试 |
| **Command Injection**     | 命令注入    | 在网站上执行系统命令     |
| **CSRF**                  | 跨站请求伪造  | 骗用户点击，偷偷干坏事    |
| **File Inclusion**        | 文件包含    | 读取或执行网站上的文件    |
| **File Upload**           | 文件上传    | 上传恶意文件getshell |
| **Insecure CAPTCHA**      | 不安全的验证码 | 绕过验证码          |
| **SQL Injection**         | SQL注入   | 注入SQL语句，盗取数据   |
| **SQL Injection (Blind)** | SQL盲注   | 看不到回显的SQL注入    |
| **XSS (Reflected)**       | 反射型XSS  | 把脚本藏在URL里      |
| **XSS (Stored)**          | 存储型XSS  | 把脚本存在数据库里      |
| **XSS (DOM)**             | DOM型XSS | 在DOM里搞事情       |

是不是感觉漏洞还挺多的？别慌，我们后面会一个一个学，一个一个打。打完这些，你就算入门了！💪

### 4.1.4 图示：DVWA 十大模块 × 四大难度 架构全景 🗺️

下面这张图帮你一眼看懂 DVWA 的"布局"——**横向是 4 个难度等级**（像游戏的 Easy/Normal/Hard/Hell），**纵向是 10 大漏洞模块**（就是每关的打怪场地），每条箭头上你都能看到对应难度下的防护强度，心里先有个地图再闯关不迷路：

<svg viewBox="0 0 1140 520" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1000px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">

  <defs>
    <linearGradient id="dvwa-hd-low" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3bff9a"/><stop offset="100%" stop-color="#00a363"/></linearGradient>
    <linearGradient id="dvwa-hd-med" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffe16b"/><stop offset="100%" stop-color="#e0a500"/></linearGradient>
    <linearGradient id="dvwa-hd-hi"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffa36b"/><stop offset="100%" stop-color="#d24a00"/></linearGradient>
    <linearGradient id="dvwa-hd-imp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff6b8a"/><stop offset="100%" stop-color="#a1003c"/></linearGradient>
    <linearGradient id="dvwa-mod" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a3556"/><stop offset="100%" stop-color="#151a30"/></linearGradient>
  </defs>
  <!-- 标题 -->
  <text x="570" y="36" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 4-1  DVWA 四大难度 × 十大模块 全景地图</text>
  <!-- 表头：4个难度 -->
  <g font-family="Arial" font-size="14" font-weight="bold">
    <rect x="260" y="60"  width="210" height="46" rx="10" fill="url(#dvwa-hd-low)"/><text x="365" y="89" text-anchor="middle" fill="#072515">① Low（新手村）— 几乎无防护</text>
    <rect x="490" y="60"  width="210" height="46" rx="10" fill="url(#dvwa-hd-med)"/><text x="595" y="89" text-anchor="middle" fill="#3a2400">② Medium（有点东西）— 简单过滤</text>
    <rect x="720" y="60"  width="210" height="46" rx="10" fill="url(#dvwa-hd-hi)"/><text x="825" y="89" text-anchor="middle" fill="#fff">③ High（老油条）— 多重绕过</text>
    <rect x="950" y="60"  width="170" height="46" rx="10" fill="url(#dvwa-hd-imp)"/><text x="1035" y="89" text-anchor="middle" fill="#fff">④ Impossible ⛔ 神仙难度</text>
  </g>
  <!-- 10 大模块 行 -->
  <g font-family="Arial" font-size="13" fill="#e6eaf5">
    <rect x="10" y="120" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="142" text-anchor="middle">Brute Force · 暴力破解密码</text>
    <rect x="10" y="162" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="184" text-anchor="middle">Command Injection · 命令注入</text>
    <rect x="10" y="204" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="226" text-anchor="middle">CSRF · 跨站请求伪造改密码</text>
    <rect x="10" y="246" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="268" text-anchor="middle">File Inclusion · 文件包含(LFI/RFI)</text>
    <rect x="10" y="288" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="310" text-anchor="middle">File Upload · 一句话木马上传</text>
    <rect x="10" y="330" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="352" text-anchor="middle">Insecure CAPTCHA · 验证码绕过</text>
    <rect x="10" y="372" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="394" text-anchor="middle">SQL Injection · 显注入爆数据</text>
    <rect x="10" y="414" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="436" text-anchor="middle">SQL Injection (Blind) · 盲注</text>
    <rect x="10" y="456" width="230" height="34" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/><text x="125" y="478" text-anchor="middle">XSS Reflected · 反射型跨站脚本</text>
    <rect x="10" y="498" width="230" height="14" rx="6" fill="url(#dvwa-mod)" stroke="#4c5a8a" stroke-width="1.2"/>
  </g>
  <!-- 箭头连线 + 防护标签（每个模块4条 -->
  <g stroke="#6879b0" stroke-width="1" opacity="0.85">
    <!-- 每个模块在 y=137,179... -->
    <line x1="240" y1="137" x2="950" y2="137" stroke-dasharray="2 4"/>
    <line x1="240" y1="179" x2="950" y2="179" stroke-dasharray="2 4"/>
    <line x1="240" y1="221" x2="950" y2="221" stroke-dasharray="2 4"/>
    <line x1="240" y1="263" x2="950" y2="263" stroke-dasharray="2 4"/>
    <line x1="240" y1="305" x2="950" y2="305" stroke-dasharray="2 4"/>
    <line x1="240" y1="347" x2="950" y2="347" stroke-dasharray="2 4"/>
    <line x1="240" y1="389" x2="950" y2="389" stroke-dasharray="2 4"/>
    <line x1="240" y1="431" x2="950" y2="431" stroke-dasharray="2 4"/>
    <line x1="240" y1="473" x2="950" y2="473" stroke-dasharray="2 4"/>
    <line x1="240" y1="505" x2="950" y2="505" stroke-dasharray="2 4"/>
  </g>
  <!-- 每列强度小圆点 示例：XSS SQL Upload 这三行重点标红 -->
  <g font-size="11" fill="#fff" text-anchor="middle" font-family="Arial">
    <!-- SQLi (389) -->
    <circle cx="365" cy="389" r="6" fill="#3bff9a"/><text x="365" y="393">✓</text>
    <circle cx="595" cy="389" r="6" fill="#ffe16b"/><text x="595" y="393" fill="#000">▲</text>
    <circle cx="825" cy="389" r="6" fill="#ffa36b"/><text x="825" y="393">✦</text>
    <circle cx="1035" cy="389" r="6" fill="#ff6b8a"/><text x="1035" y="393">✕</text>
    <!-- Upload (305) -->
    <circle cx="365" cy="305" r="6" fill="#3bff9a"/><text x="365" y="309">✓</text>
    <circle cx="595" cy="305" r="6" fill="#ffe16b"/><text x="595" y="309" fill="#000">▲</text>
    <circle cx="825" cy="305" r="6" fill="#ffa36b"/><text x="825" y="309">✦</text>
    <circle cx="1035" cy="305" r="6" fill="#ff6b8a"/><text x="1035" y="309">✕</text>
    <!-- XSS Reflected (473) -->
    <circle cx="365" cy="473" r="6" fill="#3bff9a"/><text x="365" y="477">✓</text>
    <circle cx="595" cy="473" r="6" fill="#ffe16b"/><text x="595" y="477" fill="#000">▲</text>
    <circle cx="825" cy="473" r="6" fill="#ffa36b"/><text x="825" y="477">✦</text>
    <circle cx="1035" cy="473" r="6" fill="#ff6b8a"/><text x="1035" y="477">✕</text>
  </g>
  <!-- 图例 -->
  <g font-family="Arial" font-size="12" fill="#b8c3e0">
    <rect x="280" y="500" width="14" height="10" fill="#3bff9a" rx="2"/><text x="300" y="509">✓ 能直接打</text>
    <rect x="395" y="500" width="14" height="10" fill="#ffe16b" rx="2"/><text x="415" y="509" fill="#ffe16b">▲ 要绕过1次</text>
    <rect x="515" y="500" width="14" height="10" fill="#ffa36b" rx="2"/><text x="535" y="509" fill="#ffa36b">✦ 要多重绕过</text>
    <rect x="645" y="500" width="14" height="10" fill="#ff6b8a" rx="2"/><text x="665" y="509" fill="#ff6b8a">✕ 基本无解(教学用)</text>
  </g>
</svg>

> 💡 **建议学习顺序（图上绿色 → 黄色 → 红色）**：先从 **Low 难度**十大模块各打一遍入门 → 再回过头 **Medium** 学各种基础绕过 → **High** 挑战组合拳 → **Impossible** 看代码学"正确写法"。

***

## 4.2 下载DVWA

### 4.2.1 去哪里下载？

DVWA是开源的，代码托管在GitHub上。

**官方GitHub地址：**

```
https://github.com/digininja/DVWA
```

或者你直接在GitHub搜"DVWA"，第一个结果就是。

> ⚠️ **新手必看：GitHub 国内现在基本连不上，别用方法一/二直接下！直接跳下面的【国内三条备选路线】，成功率 99%**

### 4.2.2 怎么下载？（国内同学直接看备选方案！）

**方法一：GitHub 网页下载（仅海外/有梯子的同学用）**

1. 打开 DVWA 的 GitHub 页面：https://github.com/digininja/DVWA
2. 点击右边绿色的 **「Code」** 按钮
3. 点击 **「Download ZIP」**
4. 下载完成后，压缩包名一般是 `DVWA-master.zip`

**方法二：Git 克隆（仅海外/有梯子的同学用）**

如果你装了 Git：

```bash
git clone https://github.com/digininja/DVWA.git
```

---

### 4.2.3 🇨🇳 国内同学专属：下载失败的三条傻瓜路线（按成功率从高到低）

> 三条路线任选一条就行，**不用三条都试**，第一条不行换第二条，总能下好。

| 路线 | 操作方式 | 成功率 | 推荐人群 |
|------|---------|--------|---------|
| ✅ A | Gitee 国内镜像 + wget 直链 tar.gz | 99% | 所有人（首选） |
| ✅ B | 浏览器下 Gitee ZIP | 98% | 不会用命令行的同学 |
| ✅ C | GitHub 反代直链 + curl | 90% | Gitee 也打不开的极端情况 |

#### 路线 A（推荐）：Kali/Ubuntu/WSL2 命令行一条搞定（免浏览器）

**先执行这条验证：能 ping 通 gitee.com 就用这个：**

```bash
# 先测网络
ping -c 2 gitee.com 2>&1 | tail -5
```

✅ **看到 2 packets received, 0% packet loss → 直接执行：**

```bash
cd /tmp

# Gitee 热心用户同步的 DVWA 镜像（和官方代码完全一样，国内秒下）
wget --no-check-certificate -O DVWA-v2025.tar.gz \
  "https://gitee.com/HeiDaGe/DVWA/repository/archive/main.tar.gz"

# 或者换这个镜像也行（哪个快用哪个）
# wget --no-check-certificate -O DVWA-v2025.tar.gz \
#   "https://gitee.com/kn0sky/DVWA/repository/archive/master.tar.gz"

# 解压 → 得到一个叫 DVWA 的目录
tar -zxf DVWA-v2025.tar.gz
ls
# 你应该看到：DVWA  DVWA-v2025.tar.gz

# 把 DVWA 搬到 /var/www/html/ （Kali LAMP 用），或者你 XAMPP 的 htdocs/
echo "✅ 下好了！后面按【4.5 第五步：放代码】直接用就行"
```

#### 路线 B：浏览器手动下 ZIP（Gitee 国内也能开）

1. 浏览器打开：`https://gitee.com/HeiDaGe/DVWA`
2. 点 **「克隆/下载」→「下载 ZIP」**
3. 下载完是个 `DVWA-main.zip`，解压后就能用

#### 路线 C：GitHub 反代（极端备选，Gitee 也挂了才用）

```bash
cd /tmp

# 用 ghproxy 反代（GitHub 国内加速）
wget --no-check-certificate -O DVWA-official.tar.gz \
  "https://ghproxy.com/https://github.com/digininja/DVWA/archive/refs/heads/master.tar.gz"

tar -zxf DVWA-official.tar.gz
ls
# 得到：DVWA-master/  （目录名和上面不一样，但内容完全一样，后面照常）
```

> ✅ **验证你下的 DVWA 对不对？** 进入解压后的目录执行：
> ```bash
> ls -la | head -15
> ```
> 你应该看到这些关键文件：**about.php、config、dvwa、hackable、index.php、setup.php**。少了任何一个说明下载/解压失败，重下。

### 4.2.4 下载的文件长啥样？

下载完、解压好之后，你会得到一个 `DVWA` 目录。进去看一眼长这样：

```
DVWA/
├── about.php
├── CHANGELOG.md
├── config/          ← 配置文件目录（最重要！里面放数据库密码）
│   └── config.inc.php.dist
├── dvwa/            ← DVWA 核心功能（安全等级、菜单、样式）
├── hackable/        ← 十大漏洞模块页面都在这儿！
│   ├── brute/
│   ├── exec/
│   ├── fi/          ← 文件包含
│   ├── upload/      ← 文件上传
│   ├── sqli/
│   └── ...
├── index.php        ← 网站首页
├── login.php        ← 登录页
├── README.md
└── setup.php        ← 一键创建数据库（必须先点它！）
```

> ✅ **怎么验证你解压的文件 100% 正确？** 进入 DVWA 目录执行：
> ```bash
> cd 你解压出来的DVWA目录
> # 检查 setup.php、login.php、config/ 三个关键东西是否都存在
> ls setup.php login.php config/config.inc.php.dist
> ```
> ✅ 三个都能看到 → 没问题！少了任何一个 → 解压失败，回去用刚才的路线A/B重新下。

不用全看懂每个目录是啥，记住三个最关键的就行：
1. **`config/`** —— 后面要改数据库密码，就改这里面的文件
2. **`hackable/`** —— 后面你练的 Brute Force、File Include 等等十大漏洞模块都在这里
3. **`setup.php`** —— 搭好环境之后第一个要访问的文件，用来一键建数据库和表

***

### 4.2.5 图示：三套搭建方案对比（选一条路就行 🛤️）

**划重点：DVWA 是纯 PHP+MySQL 网站，不管你在什么系统、用什么环境，只要能跑 Apache/Nginx + MySQL + PHP，都能搭！** 下面这张图帮你选最省事的路：

<svg viewBox="0 0 1160 470" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1020px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">

  <defs>
    <linearGradient id="dvwa-p1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1f6feb"/><stop offset="100%" stop-color="#0b3b8a"/></linearGradient>
    <linearGradient id="dvwa-p2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#238636"/><stop offset="100%" stop-color="#0e4a1c"/></linearGradient>
    <linearGradient id="dvwa-p3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8957e5"/><stop offset="100%" stop-color="#421f8c"/></linearGradient>
    <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#3fb950"/></marker>
  </defs>
  <text x="580" y="36" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 4-2  DVWA 三套主流搭建方案对比 · 任选一条即可</text>
  <!-- 三列大卡片 -->
  <g font-family="Arial">
    <rect x="20"  y="70" width="360" height="360" rx="16" fill="url(#dvwa-p1)" stroke="#4490ff" stroke-width="1.5"/>
    <rect x="400" y="70" width="360" height="360" rx="16" fill="url(#dvwa-p2)" stroke="#3fb950" stroke-width="1.5"/>
    <rect x="780" y="70" width="360" height="360" rx="16" fill="url(#dvwa-p3)" stroke="#a371f7" stroke-width="1.5"/>
    <text x="200" y="110" text-anchor="middle" fill="#fff" font-size="18" font-weight="bold">🪟 方案A · Windows PHPStudy</text>
    <text x="580" y="110" text-anchor="middle" fill="#fff" font-size="18" font-weight="bold">🐧 方案B · Kali Linux 原生 LAMP ✅ 你现在这种</text>
    <text x="960" y="110" text-anchor="middle" fill="#fff" font-size="18" font-weight="bold">🐳 方案C · Docker 一行拉起</text>
    <text x="200" y="146" text-anchor="middle" fill="#cfe1ff" font-size="13">适合人群：只有Windows、不想折腾命令行</text>
    <text x="580" y="146" text-anchor="middle" fill="#c7f3d0" font-size="13">适合人群：平时就在Kali里干活（最推荐打靶 👈）</text>
    <text x="960" y="146" text-anchor="middle" fill="#e3d0ff" font-size="13">适合人群：三分钟要用、嫌搭环境麻烦</text>
    <g font-size="12" fill="#e8efff">
      <text x="36" y="186">① 安装小皮 PHPStudy</text>
      <text x="36" y="209">② 开 Apache + MySQL</text>
      <text x="36" y="232">③ 解压 DVWA 到 WWW\dvwa\</text>
      <text x="36" y="255">④ 浏览器访问 /dvwa/setup.php</text>
      <text x="36" y="278">⑤ 点 Create / Reset Database</text>
      <text x="36" y="301">⑥ admin / password 登录</text>
    </g>
    <g font-size="12" fill="#e5fbe9">
      <text x="416" y="186">① apt install apache2 mariadb-server php php-mysqli</text>
      <text x="416" y="209">② systemctl enable --now apache2 mariadb</text>
      <text x="416" y="232">③ git clone DVWA 到 /var/www/html/dvwa/</text>
      <text x="416" y="255">④ cp config.inc.php 并改 DB 密码</text>
      <text x="416" y="278">⑤ 浏览器访问 http://KALI_IP/dvwa/setup.php</text>
      <text x="416" y="301">⑥ Create Database → 登录开干！</text>
    </g>
    <g font-size="12" fill="#f0e4ff">
      <text x="796" y="186">① docker pull vulnerables/web-dvwa</text>
      <text x="796" y="209">② docker run -d -p 4280:80 vulnerables/web-dvwa</text>
      <text x="796" y="232">③ 浏览器 http://KALI_IP:4280</text>
      <text x="796" y="255">④ 进 setup.php 点 Create Database</text>
      <text x="796" y="278">⑤ admin / password 登录</text>
      <text x="796" y="301">⑥ 打完 docker rm -f 直接删，不脏系统</text>
    </g>
    <!-- 优缺点框 -->
    <g font-size="12">
      <rect x="36" y="322" width="328" height="94" rx="8" fill="#000" opacity="0.35"/>
      <text x="52" y="345" fill="#ffd34d">优点：图形化、中文界面、小白友好</text>
      <text x="52" y="368" fill="#ff8b8b">缺点：后面打真实靶都在Kali里，跨主机调试麻烦</text>
      <text x="52" y="391" fill="#fff">推荐度：⭐⭐⭐（入门过渡）</text>
      <rect x="416" y="322" width="328" height="94" rx="8" fill="#000" opacity="0.35"/>
      <text x="432" y="345" fill="#ffd34d">优点：和真正打靶流程100%一致；Hydra/sqlmap同机免配置</text>
      <text x="432" y="368" fill="#7ce8a0">✨ 就是你现在用的方式！最推荐 ✨</text>
      <text x="432" y="391" fill="#fff">推荐度：⭐⭐⭐⭐⭐ （日常打靶首选）</text>
      <rect x="796" y="322" width="328" height="94" rx="8" fill="#000" opacity="0.35"/>
      <text x="812" y="345" fill="#ffd34d">优点：3分钟起环境，随时销毁，零残留</text>
      <text x="812" y="368" fill="#ff8b8b">缺点：后续想改源码/加插件没方案B灵活</text>
      <text x="812" y="391" fill="#fff">推荐度：⭐⭐⭐⭐ （临时复现首选）</text>
    </g>
  </g>
  <!-- 底部箭头：指向同终点 http://xxx/dvwa -->
  <g font-family="Arial" font-size="13" fill="#b8c3e0">
    <line x1="200" y1="440" x2="540" y2="454" stroke="#4490ff" stroke-width="2" marker-end="url(#arrowGreen)"/>
    <line x1="580" y1="440" x2="560" y2="454" stroke="#3fb950" stroke-width="2" marker-end="url(#arrowGreen)"/>
    <line x1="960" y1="440" x2="580" y2="454" stroke="#a371f7" stroke-width="2" marker-end="url(#arrowGreen)"/>
    <rect x="540" y="454" width="110" height="18" rx="9" fill="#0e4a1c" stroke="#3fb950"/>
    <text x="595" y="467" text-anchor="middle" fill="#fff" font-weight="bold">✅ 都能进 DVWA 登录页</text>
  </g>


> 💡 **建议学习顺序（图上绿色 → 黄色 → 红色）**：先从 **Low 难度**十大模块各打一遍入门 → 再回过头 **Medium** 学各种基础绕过 → **High** 挑战组合拳 → **Impossible** 看代码学"正确写法"。

***

## 4.2 下载DVWA

### 4.2.1 去哪里下载？

DVWA是开源的，代码托管在GitHub上。

**官方GitHub地址：**

```
https://github.com/digininja/DVWA
```

或者你直接在GitHub搜"DVWA"，第一个结果就是。

> ⚠️ **新手必看：GitHub 国内现在基本连不上，别用方法一/二直接下！直接跳下面的【国内三条备选路线】，成功率 99%**

### 4.2.2 怎么下载？（国内同学直接看备选方案！）

**方法一：GitHub 网页下载（仅海外/有梯子的同学用）**

1. 打开 DVWA 的 GitHub 页面：https://github.com/digininja/DVWA
2. 点击右边绿色的 **「Code」** 按钮
3. 点击 **「Download ZIP」**
4. 下载完成后，压缩包名一般是 `DVWA-master.zip`

**方法二：Git 克隆（仅海外/有梯子的同学用）**

如果你装了 Git：

```bash
git clone https://github.com/digininja/DVWA.git
```

---

### 4.2.3 🇨🇳 国内同学专属：下载失败的三条傻瓜路线（按成功率从高到低）

> 三条路线任选一条就行，**不用三条都试**，第一条不行换第二条，总能下好。

| 路线 | 操作方式 | 成功率 | 推荐人群 |
|------|---------|--------|---------|
| ✅ A | Gitee 国内镜像 + wget 直链 tar.gz | 99% | 所有人（首选） |
| ✅ B | 浏览器下 Gitee ZIP | 98% | 不会用命令行的同学 |
| ✅ C | GitHub 反代直链 + curl | 90% | Gitee 也打不开的极端情况 |

#### 路线 A（推荐）：Kali/Ubuntu/WSL2 命令行一条搞定（免浏览器）

**先执行这条验证：能 ping 通 gitee.com 就用这个：**

```bash
# 先测网络
ping -c 2 gitee.com 2>&1 | tail -5
```

✅ **看到 2 packets received, 0% packet loss → 直接执行：**

```bash
cd /tmp

# Gitee 热心用户同步的 DVWA 镜像（和官方代码完全一样，国内秒下）
wget --no-check-certificate -O DVWA-v2025.tar.gz \
  "https://gitee.com/HeiDaGe/DVWA/repository/archive/main.tar.gz"

# 或者换这个镜像也行（哪个快用哪个）
# wget --no-check-certificate -O DVWA-v2025.tar.gz \
#   "https://gitee.com/kn0sky/DVWA/repository/archive/master.tar.gz"

# 解压 → 得到一个叫 DVWA 的目录
tar -zxf DVWA-v2025.tar.gz
ls
# 你应该看到：DVWA  DVWA-v2025.tar.gz

# 把 DVWA 搬到 /var/www/html/ （Kali LAMP 用），或者你 XAMPP 的 htdocs/
echo "✅ 下好了！后面按【4.5 第五步：放代码】直接用就行"
```

#### 路线 B：浏览器手动下 ZIP（Gitee 国内也能开）

1. 浏览器打开：`https://gitee.com/HeiDaGe/DVWA`
2. 点 **「克隆/下载」→「下载 ZIP」**
3. 下载完是个 `DVWA-main.zip`，解压后就能用

#### 路线 C：GitHub 反代（极端备选，Gitee 也挂了才用）

```bash
cd /tmp

# 用 ghproxy 反代（GitHub 国内加速）
wget --no-check-certificate -O DVWA-official.tar.gz \
  "https://ghproxy.com/https://github.com/digininja/DVWA/archive/refs/heads/master.tar.gz"

tar -zxf DVWA-official.tar.gz
ls
# 得到：DVWA-master/  （目录名和上面不一样，但内容完全一样，后面照常）
```

> ✅ **验证你下的 DVWA 对不对？** 进入解压后的目录执行：
> ```bash
> ls -la | head -15
> ```
> 你应该看到这些关键文件：**about.php、config、dvwa、hackable、index.php、setup.php**。少了任何一个说明下载/解压失败，重下。

### 4.2.4 下载的文件长啥样？

下载完、解压好之后，你会得到一个 `DVWA` 目录。进去看一眼长这样：

```
DVWA/
├── about.php
├── CHANGELOG.md
├── config/          ← 配置文件目录（最重要！里面放数据库密码）
│   └── config.inc.php.dist
├── dvwa/            ← DVWA 核心功能（安全等级、菜单、样式）
├── hackable/        ← 十大漏洞模块页面都在这儿！
│   ├── brute/
│   ├── exec/
│   ├── fi/          ← 文件包含
│   ├── upload/      ← 文件上传
│   ├── sqli/
│   └── ...
├── index.php        ← 网站首页
├── login.php        ← 登录页
├── README.md
└── setup.php        ← 一键创建数据库（必须先点它！）
```

> ✅ **怎么验证你解压的文件 100% 正确？** 进入 DVWA 目录执行：
> ```bash
> cd 你解压出来的DVWA目录
> # 检查 setup.php、login.php、config/ 三个关键东西是否都存在
> ls setup.php login.php config/config.inc.php.dist
> ```
> ✅ 三个都能看到 → 没问题！少了任何一个 → 解压失败，回去用刚才的路线A/B重新下。

不用全看懂每个目录是啥，记住三个最关键的就行：
1. **`config/`** —— 后面要改数据库密码，就改这里面的文件
2. **`hackable/`** —— 后面你练的 Brute Force、File Include 等等十大漏洞模块都在这里
3. **`setup.php`** —— 搭好环境之后第一个要访问的文件，用来一键建数据库和表

***

### 4.2.5 图示：三套搭建方案对比（选一条路就行 🛤️）

**划重点：DVWA 是纯 PHP+MySQL 网站，不管你在什么系统、用什么环境，只要能跑 Apache/Nginx + MySQL + PHP，都能搭！** 下面这张图帮你选最省事的路：

<svg viewBox="0 0 1160 470" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1020px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">

  <defs>
    <linearGradient id="dvwa-p1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1f6feb"/><stop offset="100%" stop-color="#0b3b8a"/></linearGradient>
    <linearGradient id="dvwa-p2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#238636"/><stop offset="100%" stop-color="#0e4a1c"/></linearGradient>
    <linearGradient id="dvwa-p3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8957e5"/><stop offset="100%" stop-color="#421f8c"/></linearGradient>
    <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#3fb950"/></marker>
  </defs>
  <text x="580" y="36" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 4-2  DVWA 三套主流搭建方案对比 · 任选一条即可</text>
  <!-- 三列大卡片 -->
  <g font-family="Arial">
    <rect x="20"  y="70" width="360" height="360" rx="16" fill="url(#dvwa-p1)" stroke="#4490ff" stroke-width="1.5"/>
    <rect x="400" y="70" width="360" height="360" rx="16" fill="url(#dvwa-p2)" stroke="#3fb950" stroke-width="1.5"/>
    <rect x="780" y="70" width="360" height="360" rx="16" fill="url(#dvwa-p3)" stroke="#a371f7" stroke-width="1.5"/>
    <text x="200" y="110" text-anchor="middle" fill="#fff" font-size="18" font-weight="bold">🪟 方案A · Windows PHPStudy</text>
    <text x="580" y="110" text-anchor="middle" fill="#fff" font-size="18" font-weight="bold">🐧 方案B · Kali Linux 原生 LAMP ✅ 你现在这种</text>
    <text x="960" y="110" text-anchor="middle" fill="#fff" font-size="18" font-weight="bold">🐳 方案C · Docker 一行拉起</text>
    <text x="200" y="146" text-anchor="middle" fill="#cfe1ff" font-size="13">适合人群：只有Windows、不想折腾命令行</text>
    <text x="580" y="146" text-anchor="middle" fill="#c7f3d0" font-size="13">适合人群：平时就在Kali里干活（最推荐打靶 👈）</text>
    <text x="960" y="146" text-anchor="middle" fill="#e3d0ff" font-size="13">适合人群：三分钟要用、嫌搭环境麻烦</text>
    <g font-size="12" fill="#e8efff">
      <text x="36" y="186">① 安装小皮 PHPStudy</text>
      <text x="36" y="209">② 开 Apache + MySQL</text>
      <text x="36" y="232">③ 解压 DVWA 到 WWW\dvwa\</text>
      <text x="36" y="255">④ 浏览器访问 /dvwa/setup.php</text>
      <text x="36" y="278">⑤ 点 Create / Reset Database</text>
      <text x="36" y="301">⑥ admin / password 登录</text>
    </g>
    <g font-size="12" fill="#e5fbe9">
      <text x="416" y="186">① apt install apache2 mariadb-server php php-mysqli</text>
      <text x="416" y="209">② systemctl enable --now apache2 mariadb</text>
      <text x="416" y="232">③ git clone DVWA 到 /var/www/html/dvwa/</text>
      <text x="416" y="255">④ cp config.inc.php 并改 DB 密码</text>
      <text x="416" y="278">⑤ 浏览器访问 http://KALI_IP/dvwa/setup.php</text>
      <text x="416" y="301">⑥ Create Database → 登录开干！</text>
    </g>
    <g font-size="12" fill="#f0e4ff">
      <text x="796" y="186">① docker pull vulnerables/web-dvwa</text>
      <text x="796" y="209">② docker run -d -p 4280:80 vulnerables/web-dvwa</text>
      <text x="796" y="232">③ 浏览器 http://KALI_IP:4280</text>
      <text x="796" y="255">④ 进 setup.php 点 Create Database</text>
      <text x="796" y="278">⑤ admin / password 登录</text>
      <text x="796" y="301">⑥ 打完 docker rm -f 直接删，不脏系统</text>
    </g>
    <!-- 优缺点框 -->
    <g font-size="12">
      <rect x="36" y="322" width="328" height="94" rx="8" fill="#000" opacity="0.35"/>
      <text x="52" y="345" fill="#ffd34d">优点：图形化、中文界面、小白友好</text>
      <text x="52" y="368" fill="#ff8b8b">缺点：后面打真实靶都在Kali里，跨主机调试麻烦</text>
      <text x="52" y="391" fill="#fff">推荐度：⭐⭐⭐（入门过渡）</text>
      <rect x="416" y="322" width="328" height="94" rx="8" fill="#000" opacity="0.35"/>
      <text x="432" y="345" fill="#ffd34d">优点：和真正打靶流程100%一致；Hydra/sqlmap同机免配置</text>
      <text x="432" y="368" fill="#7ce8a0">✨ 就是你现在用的方式！最推荐 ✨</text>
      <text x="432" y="391" fill="#fff">推荐度：⭐⭐⭐⭐⭐ （日常打靶首选）</text>
      <rect x="796" y="322" width="328" height="94" rx="8" fill="#000" opacity="0.35"/>
      <text x="812" y="345" fill="#ffd34d">优点：3分钟起环境，随时销毁，零残留</text>
      <text x="812" y="368" fill="#ff8b8b">缺点：后续想改源码/加插件没方案B灵活</text>
      <text x="812" y="391" fill="#fff">推荐度：⭐⭐⭐⭐ （临时复现首选）</text>
    </g>
  </g>
  <!-- 底部箭头：指向同终点 http://xxx/dvwa -->
  <g font-family="Arial" font-size="13" fill="#b8c3e0">
    <line x1="200" y1="440" x2="540" y2="454" stroke="#4490ff" stroke-width="2" marker-end="url(#arrowGreen)"/>
    <line x1="580" y1="440" x2="560" y2="454" stroke="#3fb950" stroke-width="2" marker-end="url(#arrowGreen)"/>
    <line x1="960" y1="440" x2="580" y2="454" stroke="#a371f7" stroke-width="2" marker-end="url(#arrowGreen)"/>
    <rect x="540" y="454" width="110" height="18" rx="9" fill="#0e4a1c" stroke="#3fb950"/>
    <text x="595" y="467" text-anchor="middle" fill="#fff" font-weight="bold">✅ 都能进 DVWA 登录页</text>
  </g>
</svg>

## 4.3 部署DVWA（超详细步骤 · 三条路任选）

终于到了动手环节了！大家**任选一条自己电脑上有的路**跟着走就行，别死磕 PHPStudy：

> ⚠️ **Windows 同学注意：**
>
> 下面 §4.3.1 \~ §4.3.6 写的就是**Windows + PHPStudy** 的手把手步骤，按老流程走就行。
>
> ⚠️ **Kali / Ubuntu 同学注意（🔥 你现在用的）：**
>
> 4.3 节先**跳过**！直接翻到本章后面的 **§4.5 Kali Linux 原生 LAMP 搭建**，命令全给你写好了，复制粘贴就能跑。
>
> ⚠️ **想偷懒的同学注意：**
>
> 直接跳 **§4.6 Docker 一行拉起 DVWA**，3 条命令搞定。

### 4.3.1 第一步：确认PHPStudy环境正常

**先打开PHPStudy，确认两件事：**

1. ✅ **Apache启动了**（按钮是绿色的"停止"）
2. ✅ **MySQL启动了**（按钮是绿色的"停止"）

两个都要是绿色的才行！

> 💡 **为什么要确认这两个？**
>
> - Apache是Web服务器，没有它，浏览器就访问不了网站
> - MySQL是数据库，DVWA需要用数据库存数据
>
> 就像开餐馆，得先有店面（Apache）和仓库（MySQL），才能开门做生意。

如果有哪个没启动，点一下"启动"按钮，等它变绿。

### 4.3.2 第二步：解压源码，放到WWW目录

**1. 解压压缩包**
找到你下载的DVWA压缩包，右键解压。

**2. 找到WWW目录**
PHPStudy的网站根目录（WWW目录）在哪？

- 默认是 `D:\phpstudy_pro\WWW\`
- 如果你装在其他盘，就是对应盘的 `phpstudy_pro\WWW\`

不会找的话：
打开PHPStudy → 点击左侧"网站" → 找到默认网站 → 点"根目录"
就打开了。

**3. 把DVWA放进去**
把解压出来的DVWA文件夹，**整个复制**到WWW目录下。

**4. 重命名为dvwa**
为了访问方便，把文件夹名字改成 `dvwa`（全小写）。

改完之后，目录结构应该是这样的：

```
D:\phpstudy_pro\WWW\
└── dvwa/
    ├── about.php
    ├── config/
    ├── hackable/
    ├── index.php
    ├── setup.php
    └── ...
```

> 💡 **为什么要重命名？**
>
> 因为下载下来的文件夹名字可能是 `DVWA-master` 或者 `DVWA-main`，太长了不好记。
> 改成 `dvwa` 之后，访问地址就是 `http://localhost/dvwa/`，简单好记。
>
> 当然，你不改也行，就是访问的时候要输入完整的文件夹名。

### 🎯 2026 年最新 · 6 种 DVWA 搭建方式全景对比（挑最适合你的就行）

> 先说结论：**你昨天踩的"Docker 国内拉不下来"的坑，在下面这张表里都有对应的替代方案**。你现在已经用 Kali 原生 LAMP 跑起来了，那就是最稳的 ①。后面其他 5 种可以以后遇到对应环境再看。

| 排名 | 搭建方式 | 难度 | 耗时 | 国内网络友好度 | 适合人群 | 看哪一节 |
|---|---|---|---|---|---|---|
| ①⭐⭐⭐⭐⭐ | **Kali 原生 LAMP（你在用 ✅）** | ⭐⭐ | 10 min | ✅ 100%（apt 源换国内即可，无 Docker 依赖）| 用 Kali 虚拟机的所有人；学渗透测试的主力环境 | §4.5 前面 Kali LAMP 完整版 |
| ②⭐⭐⭐⭐ | **XAMPP 跨平台一键包** | ⭐ | 5 min | ✅ 100%（清华镜像满速下，不依赖任何源）| Win/Mac/Linux 都能用；讨厌敲命令的人；Docker 拉不动时的首选替代 | **§4.7** ✨ 新增 |
| ③⭐⭐⭐⭐ | **Ubuntu / Debian 原生 LAMP** | ⭐⭐ | 12 min | ✅ 100%（Ubuntu 官方源国内全镜像）| 用 Ubuntu/Debian 虚拟机不是 Kali 的人 | **§4.9** ✨ 新增 |
| ④⭐⭐⭐ | **WSL2 + Ubuntu（不用装虚拟机）** | ⭐⭐ | 15 min | ✅ 100%（Win Store 直装）| 只有 Windows 电脑，不想装 VMware 的人 | **§4.8** ✨ 新增 |
| ⑤⭐⭐⭐ | **Docker（+ 国内加速补丁）** | ⭐⭐⭐ | 看运气（3 min~失败）| ⚠️ 70%（需配 §4.6.4 的国内镜像/离线 tar）| 已经装了 Docker 的同学；打完就删不留痕的场景 | §4.6 + **§4.6.4 国内加速 DLC** ✨ 新增 |
| ⑥⭐⭐ | **Windows PHPStudy / 小皮** | ⭐ | 3 min | ✅ 100%（国内软件）| 完全只用 Windows、不想碰任何 Linux 的纯新手 | §4.3 Windows PHPStudy 原版 |

⚙️ 准备工作：更新系统（无论哪种 Linux 方式都建议先做，Windows / XAMPP 可跳过）

无论选择哪种 Linux 方式，都建议先更新一下软件包列表（Kali / Ubuntu / Debian / WSL2 全部通用）：

```bash
sudo apt update && sudo apt upgrade -y
```

下面是原来的老 Ubuntu 三步法（保留不动，搭配上面的 6 种新方式一起参考）：

方法一（老版 Ubuntu）：使用 Docker 部署（最简单、最推荐）

这是最快、最干净的方式。DVWA 和它所需的环境（Web服务器、数据库等）都被打包在一个独立的容器里，不会弄乱你的虚拟机系统。

```
安装 Docker：
如果虚拟机还没有 Docker，可以用以下命令安装：
bash

sudo apt install docker.io -y

拉取并运行 DVWA 镜像：
这里使用一个广受认可的 DVWA 镜像 sagikazarmark/dvwa。执行下面这条命令，Docker 会自动下载镜像并启动容器：
bash

sudo docker run -it -p 8001:80 sagikazarmark/dvwa

    命令解释：-p 8001:80 的意思是将虚拟机的 8001 端口映射到容器的 80 端口。这样，你访问虚拟机的 8001 端口就能访问到容器里的 DVWA 了。

访问并初始化：
打开浏览器，访问 http://你的虚拟机IP:8001。

    第一次访问时，页面会提示你点击 Create/Reset Database 按钮来创建数据库。

    完成后，使用默认账号密码登录：admin / password。
```

方法二：手动搭建 LAMP 环境（最标准、可定制）

这是最标准的方法，能让你清楚了解每个组件是如何工作的。如果遇到问题，也更容易排查。
第1步：安装 LAMP 环境

LAMP 是 Linux、Apache、MySQL 和 PHP 的首字母缩写，是运行 DVWA 的基础。

```
安装 Apache Web 服务器：
bash

sudo apt install apache2 -y

安装 MySQL 数据库：
bash

sudo apt install mysql-server -y

安装 PHP 及 DVWA 所需的扩展：
bash

sudo apt install php libapache2-mod-php php-mysql php-gd php-mbstring php-curl php-xml php-pear php-bcmath -y
```

第2步：配置 MySQL 数据库

```
登录 MySQL：
刚安装好的 MySQL，root 用户可能没有密码。用下面的命令登录：
bash

sudo mysql

设置 root 密码（可选但建议）：
在 MySQL 命令行中执行，将 your_strong_password 替换成你的密码：
sql

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_strong_password';
FLUSH PRIVILEGES;

创建 DVWA 专用的数据库：
sql

CREATE DATABASE dvwa;

创建专用数据库用户并授权（更安全，避免使用 root）：
将 your_password 替换成一个新密码：
sql

GRANT ALL PRIVILEGES ON dvwa.* TO 'dvwa_user'@'localhost' IDENTIFIED BY 'your_password';
FLUSH PRIVILEGES;
EXIT;

    记住你设置的密码，在下一步配置 DVWA 时会用到。
```

第3步：下载和配置 DVWA

```
下载 DVWA 源码：
切换到 Apache 的默认网站根目录：
bash

cd /var/www/html
sudo git clone https://github.com/digininja/DVWA.git

    如果想用中文版，可以试试这个仓库：sudo git clone https://github.com/Basyaact/DVWA-Chinese.git

重命名目录（可选）：
为了访问方便，可以把 DVWA 目录重命名为 dvwa：
bash

sudo mv DVWA dvwa

创建配置文件：
DVWA 提供了一个配置模板，我们需要复制一份并重命名：
bash

cd /var/www/html/dvwa/config
sudo cp config.inc.php.dist config.inc.php

编辑配置文件：
用 nano 或 vim 编辑 config.inc.php：
bash

sudo nano config.inc.php

找到并修改以下内容，填入你在第2步中创建的数据库信息和密码：
php

$_DVWA[ 'db_database' ] = 'dvwa';
$_DVWA[ 'db_user' ] = 'dvwa_user';   // 如果你创建了专用用户
$_DVWA[ 'db_password' ] = 'your_password';
// 如果直接使用root，则 user 为 'root'，password 为你设置的root密码

保存并退出 (Ctrl+O, Enter, Ctrl+X)。
```

第4步：设置文件权限

需要确保 Web 服务器 (www-data 用户) 对 DVWA 目录有读写权限：
bash

sudo chown -R www-data:www-data /var/www/html/dvwa
sudo chmod -R 755 /var/www/html/dvwa

第5步：重启服务并访问

```
重启 Apache 使所有配置生效：
bash

sudo systemctl restart apache2

在浏览器中访问 http://你的虚拟机IP/dvwa/setup.php。

点击页面下方的 Create/Reset Database 按钮，DVWA 会自动创建所需的数据表。

完成后，即可通过 http://你的虚拟机IP/dvwa/login.php 登录，默认账号密码为 admin / password。
```

方法三：使用 Linux 版 PHPStudy（小皮面板）

如果你更习惯 Windows 上 PHPStudy 的图形化操作，可以尝试它的 Linux 版本（也称为“小皮面板”）。它提供类似的一键安装和管理功能。

```
安装：
在终端中执行官方安装脚本：
bash

wget -O install.sh https://www.xp.cn/install.sh && sudo bash install.sh

使用：
安装完成后，根据终端输出的信息，通过浏览器访问面板后台进行可视化管理。你可以在面板中一键部署 LAMP 环境，然后参考 方法二 中的 第3步到第5步 来下载和配置 DVWA。
```

⚠️ 常见问题与解决

```
无法访问网站？

    检查 Apache 是否运行：sudo systemctl status apache2。

    检查 Ubuntu 虚拟机防火墙是否放行了 80 端口：sudo ufw allow 80。

    确保在浏览器中使用了正确的虚拟机 IP 地址（可用 ip addr 命令查看）。

数据库连接失败 (Could not connect to database)？

    最常见的原因是 config.inc.php 中的数据库用户名或密码填写错误，请仔细核对。

    确认 MySQL 服务已启动：sudo systemctl status mysql。

文件权限错误 (File not writable)？

    确保已正确执行第4步的权限设置命令。

PHP 函数被禁用 (PHP function allow_url_include disabled)？

    这是 DVWA 的常见提示。你需要修改 PHP 配置文件 php.ini。

    找到 php.ini 文件位置：sudo find /etc -name "php.ini"。

    用 sudo nano 打开它，找到 allow_url_include = Off，改为 On，保存后重启 Apache：sudo systemctl restart apache2。
```

💎 总结与建议

```
新手或想快速体验：首选 Docker 方式，一条命令搞定，对系统无污染。

学习者或想深入理解：推荐 手动搭建 LAMP 环境，过程清晰，能帮你理解 Web 服务器的工作原理，也为以后配置其他环境打下基础。

习惯图形化操作：可以尝试 Linux 版 PHPStudy，但本质上它也是对 LAMP 的一键封装。
```

### 4.3.3 第三步：修改配置文件

这一步很关键！很多新手卡在这里。

**1. 找到配置文件**
进入 `dvwa/config/` 目录，你会看到一个文件叫：

```
config.inc.php.dist
```

**2. 复制一份，改名为 config.inc.php**
右键复制这个文件，然后粘贴，把新文件改名为：

```
config.inc.php
```

> 💡 **为什么要复制一份而不是直接改？**
>
> 因为 `.dist` 结尾的文件是"模板文件"，是给你参考的。
> 我们复制一份改成真正的配置文件，这样以后搞坏了，还能从模板文件恢复。
>
> 就像你填表格，先复印一份再填，填坏了还有原件。

**3. 用记事本打开 config.inc.php**
右键文件 → 打开方式 → 选择记事本。

**4. 修改数据库密码**
打开之后，你会看到大概这样的内容（不用全看懂，找关键的几行）：

```php
$_DVWA = array();
$_DVWA[ 'db_server' ]   = '127.0.0.1';
$_DVWA[ 'db_database' ] = 'dvwa';
$_DVWA[ 'db_user' ]     = 'root';
$_DVWA[ 'db_password' ] = 'p@ssw0rd';
```

找到 `db_password` 这一行，把密码改成 `root`：

```php
$_DVWA[ 'db_password' ] = 'root';
```

改完之后保存文件（Ctrl+S）。

> 💡 **为什么密码是root？**
>
> 因为PHPStudy的MySQL默认密码就是 `root`（用户名也是root）。
> 如果你自己改过MySQL密码，就改成你自己的密码。
>
> 这就像你去朋友家做客，得知道人家家门密码才能进去一样。DVWA要连数据库，就得知道数据库的密码。

### 4.3.4 第四步：配置reCAPTCHA密钥

继续往下翻配置文件，你会看到这两行：

```php
$_DVWA[ 'recaptcha_public_key' ]  = '';
$_DVWA[ 'recaptcha_private_key' ] = '';
```

这两个是Google验证码的密钥，我们用不上，但空着的话可能会报错。

**最简单的解决办法：随便填点东西进去就行！**

比如改成这样：

```php
$_DVWA[ 'recaptcha_public_key' ]  = '6LdK7xITAAzzAAJQTfL7RuH0n68XnH5nM2X7z5n';
$_DVWA[ 'recaptcha_private_key' ] = '6LdK7xITAAzzAAJQTfL7RuH0n68XnH5nM2X7z5n';
```

> 💡 **为什么随便填也行？**
>
> 因为我们只是做练习，不会真的用到Google验证码功能。
> 只要它不是空的，不报错就行。
>
> 就像你玩游戏，有些NPC对话选项你随便选，不影响主线剧情。

> ⚠️ **注意：**
>
> 这两个密钥可以随便填，但长度最好差不多，别太短。
> 如果你后面想玩"Insecure CAPTCHA"模块，那就需要去Google官网申请真实的密钥。
> 但新手暂时不用管，先随便填，能跑起来再说。

### 4.3.5 第五步：浏览器访问setup.php

配置都改完了，现在我们来初始化数据库。

**1. 打开浏览器，访问这个地址：**

```
http://localhost/dvwa/setup.php
```

或者：

```
http://127.0.0.1/dvwa/setup.php
```

> 💡 **为什么访问setup.php？**
>
> setup.php就是DVWA的"安装程序"。
> 它会帮我们创建数据库、创建数据表、插入初始数据。
> 就像你装软件，点一下"下一步"，它自动帮你把所有东西都弄好。

**2. 拉到页面最底部**
你会看到一个大大的按钮：

```
Create / Reset Database
```

**3. 点击这个按钮**
点一下，等它执行完。

如果一切顺利，你会看到一堆绿色的提示，大概意思是：

- 数据库创建成功 ✅
- 数据表创建成功 ✅
- 数据插入成功 ✅

然后页面会自动跳转到登录页。

> 🎉 **恭喜！数据库初始化成功了！**

### 4.3.6 第六步：登录DVWA

跳转到登录页之后，输入默认的用户名和密码：

- **用户名**：`admin`
- **密码**：`password`

然后点"Login"按钮。

> 💡 **默认密码为什么这么简单？**
>
> 因为这是靶场啊！就是故意弄简单点，方便大家练习。
> 你以后学暴力破解的时候，破解的就是这个密码\~ 😏

登录成功之后，你就进入DVWA的主界面了！

**看到这个界面，说明你已经成功搭建好了第一个靶场！** 🎊🎊🎊

是不是有点小激动？别着急，我们先认识一下这个界面。

***

## 4.4 认识DVWA界面

登录进来之后，你看到的是DVWA的主界面。我们来简单认识一下。

### 4.4.1 左侧菜单栏

左边那一列就是菜单栏，所有的漏洞模块都在这里：

| 菜单项                       | 是什么            |
| ------------------------- | -------------- |
| **Home**                  | 首页，介绍DVWA      |
| **Instructions**          | 使用说明           |
| **Setup / Reset DB**      | 安装/重置数据库（刚才用过） |
| **DVWA Security**         | 难度设置（重点！）      |
| **Brute Force**           | 暴力破解           |
| **Command Injection**     | 命令注入           |
| **CSRF**                  | 跨站请求伪造         |
| **File Inclusion**        | 文件包含           |
| **File Upload**           | 文件上传           |
| **Insecure CAPTCHA**      | 不安全的验证码        |
| **SQL Injection**         | SQL注入          |
| **SQL Injection (Blind)** | SQL盲注          |
| **Weak Session IDs**      | 弱会话ID          |
| **XSS (DOM)**             | DOM型XSS        |
| **XSS (Reflected)**       | 反射型XSS         |
| **XSS (Stored)**          | 存储型XSS         |
| **CSP Bypass**            | CSP绕过          |
| **JavaScript**            | JS相关           |
| **Logout**                | 退出登录           |

东西是不是挺多的？别慌，我们后面会一个一个学。

### 4.4.2 DVWA Security难度设置

重点说一下 **"DVWA Security"** 这个选项，它是用来设置难度的。

点击左边菜单的 **"DVWA Security"**，你会看到一个下拉框，有四个选项：

| 难度  | 英文             | 是什么水平           | 类比游戏 |
| --- | -------------- | --------------- | ---- |
| 低   | **Low**        | 完全没过滤，漏洞直接摆在你面前 | 简单模式 |
| 中   | **Medium**     | 有一些简单的过滤，但很容易绕过 | 普通模式 |
| 高   | **High**       | 过滤比较严格，需要动点脑筋   | 困难模式 |
| 不可能 | **Impossible** | 基本不可能攻破，是安全的写法  | 地狱模式 |

> 💡 **用大白话解释：**
>
> - **Low（低）**：就像一个没上锁的门，一推就开。给新手练手用的，让你知道漏洞大概是怎么回事。
> - **Medium（中）**：门上挂了个简单的锁，用个铁丝就能捅开。有一些基础的防护，但很容易绕过。
> - **High（高）**：门上了防盗锁，得专业工具才能打开。防护比较严格，需要你掌握更多技巧。
> - **Impossible（不可能）**：门上了防盗锁+防盗链+保安站岗。基本攻不破，它的代码是安全写法的参考。

**新手建议：先从Low难度开始，一个漏洞一个漏洞地打。**

等Low难度全部打完了，再升Medium，然后High，最后可以看看Impossible的代码是怎么写的（学习安全的写法）。

就像玩游戏，先打简单模式，熟悉了再打困难模式。一步一步来，别着急。

### 4.4.3 每个难度的区别

可能你会好奇：不同难度的区别在哪？

举个例子，比如文件上传漏洞：

- **Low难度**：什么都不检查，你传个PHP文件上去，直接就能执行
- **Medium难度**：检查一下文件类型，但只检查Content-Type，用Burp改个包就绕过了
- **High难度**：检查文件后缀名，还检查文件内容，但可以用图片马绕过
- **Impossible**：严格的白名单+随机重命名，基本不可能绕过

看到了吧？同一个漏洞，不同难度的防护程度不一样。

这样设计的好处是：你可以从最简单的开始，先理解漏洞原理，然后再学习各种绕过技巧，逐步提升。

***

## 4.5 🐧 Kali Linux 原生 LAMP 搭建 DVWA（你现在用的！最推荐 🔥）

> **写给所有在 Kali 里干活的同学：** 这一节就是为你量身定做的，一条一条复制粘贴，**10 分钟绝对搞定**，以后打 DVWA、SQLi-Labs、Pikachu、Upload-Labs 全是这套流程，一通百通！

### 4.5.0 图示：Kali LAMP 搭建 7 步全景流程（先看图心里有数，再一步步跟着做）

<svg viewBox="0 0 1200 520" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1060px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">

  <defs>
    <linearGradient id="kaliG1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#1f6feb"/><stop offset="100%" stop-color="#8957e5"/></linearGradient>
    <linearGradient id="kaliG2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#238636"/><stop offset="100%" stop-color="#1f6feb"/></linearGradient>
    <marker id="kaliArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#3fb950"/></marker>
    <filter id="kaliShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.5"/></filter>
  </defs>
  <text x="600" y="38" text-anchor="middle" fill="#fff" font-size="21" font-weight="bold" font-family="Arial">图 4-3  Kali LAMP 搭建 DVWA · 7 步全景流程（10 分钟搞定）</text>
  <text x="600" y="62" text-anchor="middle" fill="#8b949e" font-size="13" font-family="Arial">从上到下 7 个大格子，每格对应本节 §4.5.1 ~ §4.5.7，一步一验证，全绿 = 搭成</text>
  <!-- 7 步水平排列：前6步 + 第7步登录验证 -->
  <g font-family="Arial" font-size="13">
    <!-- Step 1 -->
    <g transform="translate(20,100)" filter="url(#kaliShadow)">
      <rect x="0" y="0" width="160" height="330" rx="12" fill="#161b22" stroke="#4490ff" stroke-width="1.4"/>
      <rect x="0" y="0" width="160" height="38" rx="12" fill="url(#kaliG1)"/>
      <text x="80" y="25" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">① apt 装全家桶</text>
      <rect x="10" y="52" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="68" text-anchor="middle" fill="#56d364">apt install apache2</text>
      <rect x="10" y="82" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="98" text-anchor="middle" fill="#56d364">mariadb-server php</text>
      <rect x="10" y="112" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="128" text-anchor="middle" fill="#56d364">php-mysqli php-gd</text>
      <rect x="10" y="152" width="140" height="30" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="80" y="172" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：systemctl</text>
      <text x="80" y="212" text-anchor="middle" fill="#8b949e" font-size="11.5">对应小节：§4.5.1</text>
      <text x="80" y="232" text-anchor="middle" fill="#8b949e" font-size="11.5">失败 → 源换国内</text>
      <text x="80" y="252" text-anchor="middle" fill="#8b949e" font-size="11.5">阿里 / 清华镜像</text>
      <rect x="10" y="278" width="140" height="42" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="80" y="297" text-anchor="middle" fill="#cfe1ff" font-size="11.5">预估时间</text>
      <text x="80" y="317" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">3 分钟</text>
    </g>
    <!-- Arrow 1→2 -->
    <line x1="180" y1="265" x2="220" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#kaliArrow)"/>
    <!-- Step 2 -->
    <g transform="translate(220,100)" filter="url(#kaliShadow)">
      <rect x="0" y="0" width="160" height="330" rx="12" fill="#161b22" stroke="#4490ff" stroke-width="1.4"/>
      <rect x="0" y="0" width="160" height="38" rx="12" fill="url(#kaliG1)"/>
      <text x="80" y="25" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">② systemctl 启动</text>
      <rect x="10" y="52" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="68" text-anchor="middle" fill="#56d364">systemctl enable</text>
      <rect x="10" y="82" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="98" text-anchor="middle" fill="#56d364">--now apache2</text>
      <rect x="10" y="112" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="128" text-anchor="middle" fill="#56d364">mariadb</text>
      <rect x="10" y="152" width="140" height="30" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="80" y="172" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：status active</text>
      <text x="80" y="212" text-anchor="middle" fill="#8b949e" font-size="11.5">对应小节：§4.5.2</text>
      <text x="80" y="232" text-anchor="middle" fill="#8b949e" font-size="11.5">失败 → journalctl</text>
      <text x="80" y="252" text-anchor="middle" fill="#8b949e" font-size="11.5">-u apache2 看日志</text>
      <rect x="10" y="278" width="140" height="42" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="80" y="297" text-anchor="middle" fill="#cfe1ff" font-size="11.5">预估时间</text>
      <text x="80" y="317" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">30 秒</text>
    </g>
    <!-- Arrow 2→3 -->
    <line x1="380" y1="265" x2="420" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#kaliArrow)"/>
    <!-- Step 3 -->
    <g transform="translate(420,100)" filter="url(#kaliShadow)">
      <rect x="0" y="0" width="160" height="330" rx="12" fill="#161b22" stroke="#ff6b6b" stroke-width="1.8"/>
      <rect x="0" y="0" width="160" height="38" rx="12" fill="#8d1515"/>
      <text x="80" y="25" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">③ MariaDB 设密码</text>
      <rect x="10" y="52" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="68" text-anchor="middle" fill="#56d364">mariadb -u root</text>
      <rect x="10" y="82" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="98" text-anchor="middle" fill="#ffa657">ALTER USER ...</text>
      <rect x="10" y="112" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="128" text-anchor="middle" fill="#ffa657">IDENTIFIED BY</text>
      <rect x="10" y="152" width="140" height="30" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="80" y="172" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ mariadb -u root -ppassword</text>
      <text x="80" y="212" text-anchor="middle" fill="#8b949e" font-size="11.5">对应小节：§4.5.3</text>
      <text x="80" y="232" text-anchor="middle" fill="#ff6b6b" font-size="11.5">⚠️ 新手卡壳 No.1</text>
      <text x="80" y="252" text-anchor="middle" fill="#ff6b6b" font-size="11.5">不行就兜底 auth_socket</text>
      <rect x="10" y="278" width="140" height="42" rx="6" fill="#480f0f" stroke="#ff6b6b"/>
      <text x="80" y="297" text-anchor="middle" fill="#ffd4cc" font-size="11.5">预估时间</text>
      <text x="80" y="317" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">2 分钟</text>
    </g>
    <!-- Arrow 3→4 -->
    <line x1="580" y1="265" x2="620" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#kaliArrow)"/>
    <!-- Step 4 -->
    <g transform="translate(620,100)" filter="url(#kaliShadow)">
      <rect x="0" y="0" width="160" height="330" rx="12" fill="#161b22" stroke="#4490ff" stroke-width="1.4"/>
      <rect x="0" y="0" width="160" height="38" rx="12" fill="url(#kaliG1)"/>
      <text x="80" y="25" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">④ 搬 DVWA 代码</text>
      <rect x="10" y="52" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="68" text-anchor="middle" fill="#56d364">ls /tmp/DVWA</text>
      <rect x="10" y="82" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="98" text-anchor="middle" fill="#56d364">mv 到 /var/www/html</text>
      <rect x="10" y="112" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="128" text-anchor="middle" fill="#56d364">/dvwa/ 目录</text>
      <rect x="10" y="152" width="140" height="30" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="80" y="172" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：ls setup.php</text>
      <text x="80" y="212" text-anchor="middle" fill="#8b949e" font-size="11.5">对应小节：§4.5.4</text>
      <text x="80" y="232" text-anchor="middle" fill="#8b949e" font-size="11.5">失败 → 没下好，回 4.2.3</text>
      <text x="80" y="252" text-anchor="middle" fill="#8b949e" font-size="11.5">Gitee wget 路线 A</text>
      <rect x="10" y="278" width="140" height="42" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="80" y="297" text-anchor="middle" fill="#cfe1ff" font-size="11.5">预估时间</text>
      <text x="80" y="317" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">1 分钟</text>
    </g>
    <!-- Arrow 4→5 -->
    <line x1="780" y1="265" x2="820" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#kaliArrow)"/>
    <!-- Step 5 -->
    <g transform="translate(820,100)" filter="url(#kaliShadow)">
      <rect x="0" y="0" width="160" height="330" rx="12" fill="#161b22" stroke="#ff6b6b" stroke-width="1.8"/>
      <rect x="0" y="0" width="160" height="38" rx="12" fill="#8d1515"/>
      <text x="80" y="25" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">⑤ 改 config.inc.php</text>
      <rect x="10" y="52" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="68" text-anchor="middle" fill="#56d364">cp .dist → .php</text>
      <rect x="10" y="82" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="98" text-anchor="middle" fill="#ffa657">nano 打开</text>
      <rect x="10" y="112" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="128" text-anchor="middle" fill="#ffa657">Ctrl+W 搜 db_password</text>
      <rect x="10" y="152" width="140" height="30" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="80" y="172" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ grep db_password</text>
      <text x="80" y="212" text-anchor="middle" fill="#8b949e" font-size="11.5">对应小节：§4.5.5</text>
      <text x="80" y="232" text-anchor="middle" fill="#ff6b6b" font-size="11.5">⚠️ 新手卡壳 No.2</text>
      <text x="80" y="252" text-anchor="middle" fill="#ff6b6b" font-size="11.5">改完一定要 Ctrl+O 保存！</text>
      <rect x="10" y="278" width="140" height="42" rx="6" fill="#480f0f" stroke="#ff6b6b"/>
      <text x="80" y="297" text-anchor="middle" fill="#ffd4cc" font-size="11.5">预估时间</text>
      <text x="80" y="317" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">2 分钟</text>
    </g>
    <!-- Arrow 5→6 -->
    <line x1="980" y1="265" x2="1020" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#kaliArrow)"/>
    <!-- Step 6 -->
    <g transform="translate(1020,100)" filter="url(#kaliShadow)">
      <rect x="0" y="0" width="160" height="330" rx="12" fill="#161b22" stroke="#4490ff" stroke-width="1.4"/>
      <rect x="0" y="0" width="160" height="38" rx="12" fill="url(#kaliG1)"/>
      <text x="80" y="25" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">⑥ 权限 + allow_url</text>
      <rect x="10" y="52" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="68" text-anchor="middle" fill="#56d364">chown www-data</text>
      <rect x="10" y="82" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="98" text-anchor="middle" fill="#56d364">chmod 775 hackable</text>
      <rect x="10" y="112" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="128" text-anchor="middle" fill="#ffa657">allow_url_include=On</text>
      <rect x="10" y="152" width="140" height="30" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="80" y="172" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：php -i &#124; grep allow</text>
      <text x="80" y="212" text-anchor="middle" fill="#8b949e" font-size="11.5">对应小节：§4.5.6</text>
      <text x="80" y="232" text-anchor="middle" fill="#8b949e" font-size="11.5">改完必须</text>
      <text x="80" y="252" text-anchor="middle" fill="#8b949e" font-size="11.5">systemctl restart apache2</text>
      <rect x="10" y="278" width="140" height="42" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="80" y="297" text-anchor="middle" fill="#cfe1ff" font-size="11.5">预估时间</text>
      <text x="80" y="317" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">1 分钟</text>
    </g>
  </g>
  <!-- 下方 第7步登录验证（居中大框） -->
  <g transform="translate(20,445)" filter="url(#kaliShadow)">
    <rect x="0" y="0" width="1160" height="60" rx="12" fill="url(#kaliG2)" stroke="#3fb950" stroke-width="2"/>
    <text x="580" y="28" text-anchor="middle" fill="#fff" font-weight="bold" font-size="18">⑦ 浏览器 setup.php → Create Database → admin / password 登录 → Brute Force 点 Welcome = ✅ 全部搞定！</text>
    <text x="580" y="49" text-anchor="middle" fill="#d1fae5" font-size="13.5">对应小节：§4.5.7 · 失败对照 7-3 红色报错表，100% 定位原因</text>
  </g>


## 4.3 部署DVWA（超详细步骤 · 三条路任选）

终于到了动手环节了！大家**任选一条自己电脑上有的路**跟着走就行，别死磕 PHPStudy：

> ⚠️ **Windows 同学注意：**
>
> 下面 §4.3.1 \~ §4.3.6 写的就是**Windows + PHPStudy** 的手把手步骤，按老流程走就行。
>
> ⚠️ **Kali / Ubuntu 同学注意（🔥 你现在用的）：**
>
> 4.3 节先**跳过**！直接翻到本章后面的 **§4.5 Kali Linux 原生 LAMP 搭建**，命令全给你写好了，复制粘贴就能跑。
>
> ⚠️ **想偷懒的同学注意：**
>
> 直接跳 **§4.6 Docker 一行拉起 DVWA**，3 条命令搞定。

### 4.3.1 第一步：确认PHPStudy环境正常

**先打开PHPStudy，确认两件事：**

1. ✅ **Apache启动了**（按钮是绿色的"停止"）
2. ✅ **MySQL启动了**（按钮是绿色的"停止"）

两个都要是绿色的才行！

> 💡 **为什么要确认这两个？**
>
> - Apache是Web服务器，没有它，浏览器就访问不了网站
> - MySQL是数据库，DVWA需要用数据库存数据
>
> 就像开餐馆，得先有店面（Apache）和仓库（MySQL），才能开门做生意。

如果有哪个没启动，点一下"启动"按钮，等它变绿。

### 4.3.2 第二步：解压源码，放到WWW目录

**1. 解压压缩包**
找到你下载的DVWA压缩包，右键解压。

**2. 找到WWW目录**
PHPStudy的网站根目录（WWW目录）在哪？

- 默认是 `D:\phpstudy_pro\WWW\`
- 如果你装在其他盘，就是对应盘的 `phpstudy_pro\WWW\`

不会找的话：
打开PHPStudy → 点击左侧"网站" → 找到默认网站 → 点"根目录"
就打开了。

**3. 把DVWA放进去**
把解压出来的DVWA文件夹，**整个复制**到WWW目录下。

**4. 重命名为dvwa**
为了访问方便，把文件夹名字改成 `dvwa`（全小写）。

改完之后，目录结构应该是这样的：

```
D:\phpstudy_pro\WWW\
└── dvwa/
    ├── about.php
    ├── config/
    ├── hackable/
    ├── index.php
    ├── setup.php
    └── ...
```

> 💡 **为什么要重命名？**
>
> 因为下载下来的文件夹名字可能是 `DVWA-master` 或者 `DVWA-main`，太长了不好记。
> 改成 `dvwa` 之后，访问地址就是 `http://localhost/dvwa/`，简单好记。
>
> 当然，你不改也行，就是访问的时候要输入完整的文件夹名。

### 🎯 2026 年最新 · 6 种 DVWA 搭建方式全景对比（挑最适合你的就行）

> 先说结论：**你昨天踩的"Docker 国内拉不下来"的坑，在下面这张表里都有对应的替代方案**。你现在已经用 Kali 原生 LAMP 跑起来了，那就是最稳的 ①。后面其他 5 种可以以后遇到对应环境再看。

| 排名 | 搭建方式 | 难度 | 耗时 | 国内网络友好度 | 适合人群 | 看哪一节 |
|---|---|---|---|---|---|---|
| ①⭐⭐⭐⭐⭐ | **Kali 原生 LAMP（你在用 ✅）** | ⭐⭐ | 10 min | ✅ 100%（apt 源换国内即可，无 Docker 依赖）| 用 Kali 虚拟机的所有人；学渗透测试的主力环境 | §4.5 前面 Kali LAMP 完整版 |
| ②⭐⭐⭐⭐ | **XAMPP 跨平台一键包** | ⭐ | 5 min | ✅ 100%（清华镜像满速下，不依赖任何源）| Win/Mac/Linux 都能用；讨厌敲命令的人；Docker 拉不动时的首选替代 | **§4.7** ✨ 新增 |
| ③⭐⭐⭐⭐ | **Ubuntu / Debian 原生 LAMP** | ⭐⭐ | 12 min | ✅ 100%（Ubuntu 官方源国内全镜像）| 用 Ubuntu/Debian 虚拟机不是 Kali 的人 | **§4.9** ✨ 新增 |
| ④⭐⭐⭐ | **WSL2 + Ubuntu（不用装虚拟机）** | ⭐⭐ | 15 min | ✅ 100%（Win Store 直装）| 只有 Windows 电脑，不想装 VMware 的人 | **§4.8** ✨ 新增 |
| ⑤⭐⭐⭐ | **Docker（+ 国内加速补丁）** | ⭐⭐⭐ | 看运气（3 min~失败）| ⚠️ 70%（需配 §4.6.4 的国内镜像/离线 tar）| 已经装了 Docker 的同学；打完就删不留痕的场景 | §4.6 + **§4.6.4 国内加速 DLC** ✨ 新增 |
| ⑥⭐⭐ | **Windows PHPStudy / 小皮** | ⭐ | 3 min | ✅ 100%（国内软件）| 完全只用 Windows、不想碰任何 Linux 的纯新手 | §4.3 Windows PHPStudy 原版 |

⚙️ 准备工作：更新系统（无论哪种 Linux 方式都建议先做，Windows / XAMPP 可跳过）

无论选择哪种 Linux 方式，都建议先更新一下软件包列表（Kali / Ubuntu / Debian / WSL2 全部通用）：

```bash
sudo apt update && sudo apt upgrade -y
```

下面是原来的老 Ubuntu 三步法（保留不动，搭配上面的 6 种新方式一起参考）：

方法一（老版 Ubuntu）：使用 Docker 部署（最简单、最推荐）

这是最快、最干净的方式。DVWA 和它所需的环境（Web服务器、数据库等）都被打包在一个独立的容器里，不会弄乱你的虚拟机系统。

```
安装 Docker：
如果虚拟机还没有 Docker，可以用以下命令安装：
bash

sudo apt install docker.io -y

拉取并运行 DVWA 镜像：
这里使用一个广受认可的 DVWA 镜像 sagikazarmark/dvwa。执行下面这条命令，Docker 会自动下载镜像并启动容器：
bash

sudo docker run -it -p 8001:80 sagikazarmark/dvwa

    命令解释：-p 8001:80 的意思是将虚拟机的 8001 端口映射到容器的 80 端口。这样，你访问虚拟机的 8001 端口就能访问到容器里的 DVWA 了。

访问并初始化：
打开浏览器，访问 http://你的虚拟机IP:8001。

    第一次访问时，页面会提示你点击 Create/Reset Database 按钮来创建数据库。

    完成后，使用默认账号密码登录：admin / password。
```

方法二：手动搭建 LAMP 环境（最标准、可定制）

这是最标准的方法，能让你清楚了解每个组件是如何工作的。如果遇到问题，也更容易排查。
第1步：安装 LAMP 环境

LAMP 是 Linux、Apache、MySQL 和 PHP 的首字母缩写，是运行 DVWA 的基础。

```
安装 Apache Web 服务器：
bash

sudo apt install apache2 -y

安装 MySQL 数据库：
bash

sudo apt install mysql-server -y

安装 PHP 及 DVWA 所需的扩展：
bash

sudo apt install php libapache2-mod-php php-mysql php-gd php-mbstring php-curl php-xml php-pear php-bcmath -y
```

第2步：配置 MySQL 数据库

```
登录 MySQL：
刚安装好的 MySQL，root 用户可能没有密码。用下面的命令登录：
bash

sudo mysql

设置 root 密码（可选但建议）：
在 MySQL 命令行中执行，将 your_strong_password 替换成你的密码：
sql

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_strong_password';
FLUSH PRIVILEGES;

创建 DVWA 专用的数据库：
sql

CREATE DATABASE dvwa;

创建专用数据库用户并授权（更安全，避免使用 root）：
将 your_password 替换成一个新密码：
sql

GRANT ALL PRIVILEGES ON dvwa.* TO 'dvwa_user'@'localhost' IDENTIFIED BY 'your_password';
FLUSH PRIVILEGES;
EXIT;

    记住你设置的密码，在下一步配置 DVWA 时会用到。
```

第3步：下载和配置 DVWA

```
下载 DVWA 源码：
切换到 Apache 的默认网站根目录：
bash

cd /var/www/html
sudo git clone https://github.com/digininja/DVWA.git

    如果想用中文版，可以试试这个仓库：sudo git clone https://github.com/Basyaact/DVWA-Chinese.git

重命名目录（可选）：
为了访问方便，可以把 DVWA 目录重命名为 dvwa：
bash

sudo mv DVWA dvwa

创建配置文件：
DVWA 提供了一个配置模板，我们需要复制一份并重命名：
bash

cd /var/www/html/dvwa/config
sudo cp config.inc.php.dist config.inc.php

编辑配置文件：
用 nano 或 vim 编辑 config.inc.php：
bash

sudo nano config.inc.php

找到并修改以下内容，填入你在第2步中创建的数据库信息和密码：
php

$_DVWA[ 'db_database' ] = 'dvwa';
$_DVWA[ 'db_user' ] = 'dvwa_user';   // 如果你创建了专用用户
$_DVWA[ 'db_password' ] = 'your_password';
// 如果直接使用root，则 user 为 'root'，password 为你设置的root密码

保存并退出 (Ctrl+O, Enter, Ctrl+X)。
```

第4步：设置文件权限

需要确保 Web 服务器 (www-data 用户) 对 DVWA 目录有读写权限：
bash

sudo chown -R www-data:www-data /var/www/html/dvwa
sudo chmod -R 755 /var/www/html/dvwa

第5步：重启服务并访问

```
重启 Apache 使所有配置生效：
bash

sudo systemctl restart apache2

在浏览器中访问 http://你的虚拟机IP/dvwa/setup.php。

点击页面下方的 Create/Reset Database 按钮，DVWA 会自动创建所需的数据表。

完成后，即可通过 http://你的虚拟机IP/dvwa/login.php 登录，默认账号密码为 admin / password。
```

方法三：使用 Linux 版 PHPStudy（小皮面板）

如果你更习惯 Windows 上 PHPStudy 的图形化操作，可以尝试它的 Linux 版本（也称为“小皮面板”）。它提供类似的一键安装和管理功能。

```
安装：
在终端中执行官方安装脚本：
bash

wget -O install.sh https://www.xp.cn/install.sh && sudo bash install.sh

使用：
安装完成后，根据终端输出的信息，通过浏览器访问面板后台进行可视化管理。你可以在面板中一键部署 LAMP 环境，然后参考 方法二 中的 第3步到第5步 来下载和配置 DVWA。
```

⚠️ 常见问题与解决

```
无法访问网站？

    检查 Apache 是否运行：sudo systemctl status apache2。

    检查 Ubuntu 虚拟机防火墙是否放行了 80 端口：sudo ufw allow 80。

    确保在浏览器中使用了正确的虚拟机 IP 地址（可用 ip addr 命令查看）。

数据库连接失败 (Could not connect to database)？

    最常见的原因是 config.inc.php 中的数据库用户名或密码填写错误，请仔细核对。

    确认 MySQL 服务已启动：sudo systemctl status mysql。

文件权限错误 (File not writable)？

    确保已正确执行第4步的权限设置命令。

PHP 函数被禁用 (PHP function allow_url_include disabled)？

    这是 DVWA 的常见提示。你需要修改 PHP 配置文件 php.ini。

    找到 php.ini 文件位置：sudo find /etc -name "php.ini"。

    用 sudo nano 打开它，找到 allow_url_include = Off，改为 On，保存后重启 Apache：sudo systemctl restart apache2。
```

💎 总结与建议

```
新手或想快速体验：首选 Docker 方式，一条命令搞定，对系统无污染。

学习者或想深入理解：推荐 手动搭建 LAMP 环境，过程清晰，能帮你理解 Web 服务器的工作原理，也为以后配置其他环境打下基础。

习惯图形化操作：可以尝试 Linux 版 PHPStudy，但本质上它也是对 LAMP 的一键封装。
```

### 4.3.3 第三步：修改配置文件

这一步很关键！很多新手卡在这里。

**1. 找到配置文件**
进入 `dvwa/config/` 目录，你会看到一个文件叫：

```
config.inc.php.dist
```

**2. 复制一份，改名为 config.inc.php**
右键复制这个文件，然后粘贴，把新文件改名为：

```
config.inc.php
```

> 💡 **为什么要复制一份而不是直接改？**
>
> 因为 `.dist` 结尾的文件是"模板文件"，是给你参考的。
> 我们复制一份改成真正的配置文件，这样以后搞坏了，还能从模板文件恢复。
>
> 就像你填表格，先复印一份再填，填坏了还有原件。

**3. 用记事本打开 config.inc.php**
右键文件 → 打开方式 → 选择记事本。

**4. 修改数据库密码**
打开之后，你会看到大概这样的内容（不用全看懂，找关键的几行）：

```php
$_DVWA = array();
$_DVWA[ 'db_server' ]   = '127.0.0.1';
$_DVWA[ 'db_database' ] = 'dvwa';
$_DVWA[ 'db_user' ]     = 'root';
$_DVWA[ 'db_password' ] = 'p@ssw0rd';
```

找到 `db_password` 这一行，把密码改成 `root`：

```php
$_DVWA[ 'db_password' ] = 'root';
```

改完之后保存文件（Ctrl+S）。

> 💡 **为什么密码是root？**
>
> 因为PHPStudy的MySQL默认密码就是 `root`（用户名也是root）。
> 如果你自己改过MySQL密码，就改成你自己的密码。
>
> 这就像你去朋友家做客，得知道人家家门密码才能进去一样。DVWA要连数据库，就得知道数据库的密码。

### 4.3.4 第四步：配置reCAPTCHA密钥

继续往下翻配置文件，你会看到这两行：

```php
$_DVWA[ 'recaptcha_public_key' ]  = '';
$_DVWA[ 'recaptcha_private_key' ] = '';
```

这两个是Google验证码的密钥，我们用不上，但空着的话可能会报错。

**最简单的解决办法：随便填点东西进去就行！**

比如改成这样：

```php
$_DVWA[ 'recaptcha_public_key' ]  = '6LdK7xITAAzzAAJQTfL7RuH0n68XnH5nM2X7z5n';
$_DVWA[ 'recaptcha_private_key' ] = '6LdK7xITAAzzAAJQTfL7RuH0n68XnH5nM2X7z5n';
```

> 💡 **为什么随便填也行？**
>
> 因为我们只是做练习，不会真的用到Google验证码功能。
> 只要它不是空的，不报错就行。
>
> 就像你玩游戏，有些NPC对话选项你随便选，不影响主线剧情。

> ⚠️ **注意：**
>
> 这两个密钥可以随便填，但长度最好差不多，别太短。
> 如果你后面想玩"Insecure CAPTCHA"模块，那就需要去Google官网申请真实的密钥。
> 但新手暂时不用管，先随便填，能跑起来再说。

### 4.3.5 第五步：浏览器访问setup.php

配置都改完了，现在我们来初始化数据库。

**1. 打开浏览器，访问这个地址：**

```
http://localhost/dvwa/setup.php
```

或者：

```
http://127.0.0.1/dvwa/setup.php
```

> 💡 **为什么访问setup.php？**
>
> setup.php就是DVWA的"安装程序"。
> 它会帮我们创建数据库、创建数据表、插入初始数据。
> 就像你装软件，点一下"下一步"，它自动帮你把所有东西都弄好。

**2. 拉到页面最底部**
你会看到一个大大的按钮：

```
Create / Reset Database
```

**3. 点击这个按钮**
点一下，等它执行完。

如果一切顺利，你会看到一堆绿色的提示，大概意思是：

- 数据库创建成功 ✅
- 数据表创建成功 ✅
- 数据插入成功 ✅

然后页面会自动跳转到登录页。

> 🎉 **恭喜！数据库初始化成功了！**

### 4.3.6 第六步：登录DVWA

跳转到登录页之后，输入默认的用户名和密码：

- **用户名**：`admin`
- **密码**：`password`

然后点"Login"按钮。

> 💡 **默认密码为什么这么简单？**
>
> 因为这是靶场啊！就是故意弄简单点，方便大家练习。
> 你以后学暴力破解的时候，破解的就是这个密码\~ 😏

登录成功之后，你就进入DVWA的主界面了！

**看到这个界面，说明你已经成功搭建好了第一个靶场！** 🎊🎊🎊

是不是有点小激动？别着急，我们先认识一下这个界面。

***

## 4.4 认识DVWA界面

登录进来之后，你看到的是DVWA的主界面。我们来简单认识一下。

### 4.4.1 左侧菜单栏

左边那一列就是菜单栏，所有的漏洞模块都在这里：

| 菜单项                       | 是什么            |
| ------------------------- | -------------- |
| **Home**                  | 首页，介绍DVWA      |
| **Instructions**          | 使用说明           |
| **Setup / Reset DB**      | 安装/重置数据库（刚才用过） |
| **DVWA Security**         | 难度设置（重点！）      |
| **Brute Force**           | 暴力破解           |
| **Command Injection**     | 命令注入           |
| **CSRF**                  | 跨站请求伪造         |
| **File Inclusion**        | 文件包含           |
| **File Upload**           | 文件上传           |
| **Insecure CAPTCHA**      | 不安全的验证码        |
| **SQL Injection**         | SQL注入          |
| **SQL Injection (Blind)** | SQL盲注          |
| **Weak Session IDs**      | 弱会话ID          |
| **XSS (DOM)**             | DOM型XSS        |
| **XSS (Reflected)**       | 反射型XSS         |
| **XSS (Stored)**          | 存储型XSS         |
| **CSP Bypass**            | CSP绕过          |
| **JavaScript**            | JS相关           |
| **Logout**                | 退出登录           |

东西是不是挺多的？别慌，我们后面会一个一个学。

### 4.4.2 DVWA Security难度设置

重点说一下 **"DVWA Security"** 这个选项，它是用来设置难度的。

点击左边菜单的 **"DVWA Security"**，你会看到一个下拉框，有四个选项：

| 难度  | 英文             | 是什么水平           | 类比游戏 |
| --- | -------------- | --------------- | ---- |
| 低   | **Low**        | 完全没过滤，漏洞直接摆在你面前 | 简单模式 |
| 中   | **Medium**     | 有一些简单的过滤，但很容易绕过 | 普通模式 |
| 高   | **High**       | 过滤比较严格，需要动点脑筋   | 困难模式 |
| 不可能 | **Impossible** | 基本不可能攻破，是安全的写法  | 地狱模式 |

> 💡 **用大白话解释：**
>
> - **Low（低）**：就像一个没上锁的门，一推就开。给新手练手用的，让你知道漏洞大概是怎么回事。
> - **Medium（中）**：门上挂了个简单的锁，用个铁丝就能捅开。有一些基础的防护，但很容易绕过。
> - **High（高）**：门上了防盗锁，得专业工具才能打开。防护比较严格，需要你掌握更多技巧。
> - **Impossible（不可能）**：门上了防盗锁+防盗链+保安站岗。基本攻不破，它的代码是安全写法的参考。

**新手建议：先从Low难度开始，一个漏洞一个漏洞地打。**

等Low难度全部打完了，再升Medium，然后High，最后可以看看Impossible的代码是怎么写的（学习安全的写法）。

就像玩游戏，先打简单模式，熟悉了再打困难模式。一步一步来，别着急。

### 4.4.3 每个难度的区别

可能你会好奇：不同难度的区别在哪？

举个例子，比如文件上传漏洞：

- **Low难度**：什么都不检查，你传个PHP文件上去，直接就能执行
- **Medium难度**：检查一下文件类型，但只检查Content-Type，用Burp改个包就绕过了
- **High难度**：检查文件后缀名，还检查文件内容，但可以用图片马绕过
- **Impossible**：严格的白名单+随机重命名，基本不可能绕过

看到了吧？同一个漏洞，不同难度的防护程度不一样。

这样设计的好处是：你可以从最简单的开始，先理解漏洞原理，然后再学习各种绕过技巧，逐步提升。

***

## 4.5 🐧 Kali Linux 原生 LAMP 搭建 DVWA（你现在用的！最推荐 🔥）

> **写给所有在 Kali 里干活的同学：** 这一节就是为你量身定做的，一条一条复制粘贴，**10 分钟绝对搞定**，以后打 DVWA、SQLi-Labs、Pikachu、Upload-Labs 全是这套流程，一通百通！

### 4.5.0 图示：Kali LAMP 搭建 7 步全景流程（先看图心里有数，再一步步跟着做）

<svg viewBox="0 0 1200 520" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1060px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">

  <defs>
    <linearGradient id="kaliG1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#1f6feb"/><stop offset="100%" stop-color="#8957e5"/></linearGradient>
    <linearGradient id="kaliG2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#238636"/><stop offset="100%" stop-color="#1f6feb"/></linearGradient>
    <marker id="kaliArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#3fb950"/></marker>
    <filter id="kaliShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.5"/></filter>
  </defs>
  <text x="600" y="38" text-anchor="middle" fill="#fff" font-size="21" font-weight="bold" font-family="Arial">图 4-3  Kali LAMP 搭建 DVWA · 7 步全景流程（10 分钟搞定）</text>
  <text x="600" y="62" text-anchor="middle" fill="#8b949e" font-size="13" font-family="Arial">从上到下 7 个大格子，每格对应本节 §4.5.1 ~ §4.5.7，一步一验证，全绿 = 搭成</text>
  <!-- 7 步水平排列：前6步 + 第7步登录验证 -->
  <g font-family="Arial" font-size="13">
    <!-- Step 1 -->
    <g transform="translate(20,100)" filter="url(#kaliShadow)">
      <rect x="0" y="0" width="160" height="330" rx="12" fill="#161b22" stroke="#4490ff" stroke-width="1.4"/>
      <rect x="0" y="0" width="160" height="38" rx="12" fill="url(#kaliG1)"/>
      <text x="80" y="25" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">① apt 装全家桶</text>
      <rect x="10" y="52" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="68" text-anchor="middle" fill="#56d364">apt install apache2</text>
      <rect x="10" y="82" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="98" text-anchor="middle" fill="#56d364">mariadb-server php</text>
      <rect x="10" y="112" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="128" text-anchor="middle" fill="#56d364">php-mysqli php-gd</text>
      <rect x="10" y="152" width="140" height="30" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="80" y="172" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：systemctl</text>
      <text x="80" y="212" text-anchor="middle" fill="#8b949e" font-size="11.5">对应小节：§4.5.1</text>
      <text x="80" y="232" text-anchor="middle" fill="#8b949e" font-size="11.5">失败 → 源换国内</text>
      <text x="80" y="252" text-anchor="middle" fill="#8b949e" font-size="11.5">阿里 / 清华镜像</text>
      <rect x="10" y="278" width="140" height="42" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="80" y="297" text-anchor="middle" fill="#cfe1ff" font-size="11.5">预估时间</text>
      <text x="80" y="317" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">3 分钟</text>
    </g>
    <!-- Arrow 1→2 -->
    <line x1="180" y1="265" x2="220" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#kaliArrow)"/>
    <!-- Step 2 -->
    <g transform="translate(220,100)" filter="url(#kaliShadow)">
      <rect x="0" y="0" width="160" height="330" rx="12" fill="#161b22" stroke="#4490ff" stroke-width="1.4"/>
      <rect x="0" y="0" width="160" height="38" rx="12" fill="url(#kaliG1)"/>
      <text x="80" y="25" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">② systemctl 启动</text>
      <rect x="10" y="52" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="68" text-anchor="middle" fill="#56d364">systemctl enable</text>
      <rect x="10" y="82" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="98" text-anchor="middle" fill="#56d364">--now apache2</text>
      <rect x="10" y="112" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="128" text-anchor="middle" fill="#56d364">mariadb</text>
      <rect x="10" y="152" width="140" height="30" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="80" y="172" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：status active</text>
      <text x="80" y="212" text-anchor="middle" fill="#8b949e" font-size="11.5">对应小节：§4.5.2</text>
      <text x="80" y="232" text-anchor="middle" fill="#8b949e" font-size="11.5">失败 → journalctl</text>
      <text x="80" y="252" text-anchor="middle" fill="#8b949e" font-size="11.5">-u apache2 看日志</text>
      <rect x="10" y="278" width="140" height="42" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="80" y="297" text-anchor="middle" fill="#cfe1ff" font-size="11.5">预估时间</text>
      <text x="80" y="317" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">30 秒</text>
    </g>
    <!-- Arrow 2→3 -->
    <line x1="380" y1="265" x2="420" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#kaliArrow)"/>
    <!-- Step 3 -->
    <g transform="translate(420,100)" filter="url(#kaliShadow)">
      <rect x="0" y="0" width="160" height="330" rx="12" fill="#161b22" stroke="#ff6b6b" stroke-width="1.8"/>
      <rect x="0" y="0" width="160" height="38" rx="12" fill="#8d1515"/>
      <text x="80" y="25" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">③ MariaDB 设密码</text>
      <rect x="10" y="52" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="68" text-anchor="middle" fill="#56d364">mariadb -u root</text>
      <rect x="10" y="82" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="98" text-anchor="middle" fill="#ffa657">ALTER USER ...</text>
      <rect x="10" y="112" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="128" text-anchor="middle" fill="#ffa657">IDENTIFIED BY</text>
      <rect x="10" y="152" width="140" height="30" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="80" y="172" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ mariadb -u root -ppassword</text>
      <text x="80" y="212" text-anchor="middle" fill="#8b949e" font-size="11.5">对应小节：§4.5.3</text>
      <text x="80" y="232" text-anchor="middle" fill="#ff6b6b" font-size="11.5">⚠️ 新手卡壳 No.1</text>
      <text x="80" y="252" text-anchor="middle" fill="#ff6b6b" font-size="11.5">不行就兜底 auth_socket</text>
      <rect x="10" y="278" width="140" height="42" rx="6" fill="#480f0f" stroke="#ff6b6b"/>
      <text x="80" y="297" text-anchor="middle" fill="#ffd4cc" font-size="11.5">预估时间</text>
      <text x="80" y="317" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">2 分钟</text>
    </g>
    <!-- Arrow 3→4 -->
    <line x1="580" y1="265" x2="620" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#kaliArrow)"/>
    <!-- Step 4 -->
    <g transform="translate(620,100)" filter="url(#kaliShadow)">
      <rect x="0" y="0" width="160" height="330" rx="12" fill="#161b22" stroke="#4490ff" stroke-width="1.4"/>
      <rect x="0" y="0" width="160" height="38" rx="12" fill="url(#kaliG1)"/>
      <text x="80" y="25" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">④ 搬 DVWA 代码</text>
      <rect x="10" y="52" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="68" text-anchor="middle" fill="#56d364">ls /tmp/DVWA</text>
      <rect x="10" y="82" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="98" text-anchor="middle" fill="#56d364">mv 到 /var/www/html</text>
      <rect x="10" y="112" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="128" text-anchor="middle" fill="#56d364">/dvwa/ 目录</text>
      <rect x="10" y="152" width="140" height="30" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="80" y="172" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：ls setup.php</text>
      <text x="80" y="212" text-anchor="middle" fill="#8b949e" font-size="11.5">对应小节：§4.5.4</text>
      <text x="80" y="232" text-anchor="middle" fill="#8b949e" font-size="11.5">失败 → 没下好，回 4.2.3</text>
      <text x="80" y="252" text-anchor="middle" fill="#8b949e" font-size="11.5">Gitee wget 路线 A</text>
      <rect x="10" y="278" width="140" height="42" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="80" y="297" text-anchor="middle" fill="#cfe1ff" font-size="11.5">预估时间</text>
      <text x="80" y="317" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">1 分钟</text>
    </g>
    <!-- Arrow 4→5 -->
    <line x1="780" y1="265" x2="820" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#kaliArrow)"/>
    <!-- Step 5 -->
    <g transform="translate(820,100)" filter="url(#kaliShadow)">
      <rect x="0" y="0" width="160" height="330" rx="12" fill="#161b22" stroke="#ff6b6b" stroke-width="1.8"/>
      <rect x="0" y="0" width="160" height="38" rx="12" fill="#8d1515"/>
      <text x="80" y="25" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">⑤ 改 config.inc.php</text>
      <rect x="10" y="52" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="68" text-anchor="middle" fill="#56d364">cp .dist → .php</text>
      <rect x="10" y="82" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="98" text-anchor="middle" fill="#ffa657">nano 打开</text>
      <rect x="10" y="112" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="128" text-anchor="middle" fill="#ffa657">Ctrl+W 搜 db_password</text>
      <rect x="10" y="152" width="140" height="30" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="80" y="172" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ grep db_password</text>
      <text x="80" y="212" text-anchor="middle" fill="#8b949e" font-size="11.5">对应小节：§4.5.5</text>
      <text x="80" y="232" text-anchor="middle" fill="#ff6b6b" font-size="11.5">⚠️ 新手卡壳 No.2</text>
      <text x="80" y="252" text-anchor="middle" fill="#ff6b6b" font-size="11.5">改完一定要 Ctrl+O 保存！</text>
      <rect x="10" y="278" width="140" height="42" rx="6" fill="#480f0f" stroke="#ff6b6b"/>
      <text x="80" y="297" text-anchor="middle" fill="#ffd4cc" font-size="11.5">预估时间</text>
      <text x="80" y="317" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">2 分钟</text>
    </g>
    <!-- Arrow 5→6 -->
    <line x1="980" y1="265" x2="1020" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#kaliArrow)"/>
    <!-- Step 6 -->
    <g transform="translate(1020,100)" filter="url(#kaliShadow)">
      <rect x="0" y="0" width="160" height="330" rx="12" fill="#161b22" stroke="#4490ff" stroke-width="1.4"/>
      <rect x="0" y="0" width="160" height="38" rx="12" fill="url(#kaliG1)"/>
      <text x="80" y="25" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">⑥ 权限 + allow_url</text>
      <rect x="10" y="52" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="68" text-anchor="middle" fill="#56d364">chown www-data</text>
      <rect x="10" y="82" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="98" text-anchor="middle" fill="#56d364">chmod 775 hackable</text>
      <rect x="10" y="112" width="140" height="24" rx="4" fill="#0d1117" stroke="#30363d"/>
      <text x="80" y="128" text-anchor="middle" fill="#ffa657">allow_url_include=On</text>
      <rect x="10" y="152" width="140" height="30" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="80" y="172" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：php -i &#124; grep allow</text>
      <text x="80" y="212" text-anchor="middle" fill="#8b949e" font-size="11.5">对应小节：§4.5.6</text>
      <text x="80" y="232" text-anchor="middle" fill="#8b949e" font-size="11.5">改完必须</text>
      <text x="80" y="252" text-anchor="middle" fill="#8b949e" font-size="11.5">systemctl restart apache2</text>
      <rect x="10" y="278" width="140" height="42" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="80" y="297" text-anchor="middle" fill="#cfe1ff" font-size="11.5">预估时间</text>
      <text x="80" y="317" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">1 分钟</text>
    </g>
  </g>
  <!-- 下方 第7步登录验证（居中大框） -->
  <g transform="translate(20,445)" filter="url(#kaliShadow)">
    <rect x="0" y="0" width="1160" height="60" rx="12" fill="url(#kaliG2)" stroke="#3fb950" stroke-width="2"/>
    <text x="580" y="28" text-anchor="middle" fill="#fff" font-weight="bold" font-size="18">⑦ 浏览器 setup.php → Create Database → admin / password 登录 → Brute Force 点 Welcome = ✅ 全部搞定！</text>
    <text x="580" y="49" text-anchor="middle" fill="#d1fae5" font-size="13.5">对应小节：§4.5.7 · 失败对照 7-3 红色报错表，100% 定位原因</text>
  </g>
</svg>

### 4.5.1 第一步：Kali 一键装齐 LAMP 全家桶（1条命令 ⚡）

打开 Kali 终端（你习惯用 root 就 root，普通用户前面加 `sudo` 也行）：

```bash
# 更新一下源，顺便把 Apache + MariaDB + PHP + 常用扩展一次性装齐
apt update && apt install -y \
    apache2 \
    mariadb-server \
    mariadb-client \
    php \
    php-mysql \
    php-mysqli \
    php-gd \
    php-curl \
    php-xml \
    php-mbstring \
    php-zip \
    libapache2-mod-php \
    git
```

> 💡 **为什么是 MariaDB 不是 MySQL？** Kali（Debian系）官方早就把默认 MySQL 换成了 MariaDB，命令、语法、兼容一模一样，你就当它是 MySQL 就行，完全不用慌。像 WordPress、DVWA、phpMyAdmin 都能无缝跑。

装完检查一下三件套：

```bash
# ① Apache 能跑吗？
apache2 -v      # 应该看到 Apache/2.x.x

# ② MariaDB 能跑吗？
mariadb --version   # 或 mysql --version，都行

# ③ PHP 版本？
php -v          # 应该看到 PHP 8.x 或 7.x 都 OK
```

### 4.5.2 第二步：启动服务 & 设置开机自启（2条命令）

```bash
# 启动 Apache + MariaDB
systemctl start apache2 mariadb

# 设置开机自动启动（省得每次进 Kali 都手动开）
systemctl enable apache2 mariadb
```

再验证一下状态（都是绿色 `active (running)` 就成功）：

```bash
systemctl status apache2 --no-pager -l | head -5
systemctl status mariadb --no-pager -l | head -5
```

### 4.5.3 第三步：给 MariaDB 的 root 用户设个密码（必做！）

Kali 里刚装的 MariaDB 默认 root 是**无密码**或者**只能用 unix\_socket 本机登录**，DVWA 的 setup.php 需要账号密码去连数据库，所以必须手动建一个。

#### 3-1. 先进 MariaDB 改密码

```bash
# 进入 MariaDB 命令行（第一次不用密码，直接回车）
mariadb -u root
```

✅ **成功进去的标志：** 你看到提示符变成 `MariaDB [(none)]>`，没有报 "Access denied"。

> ❌ **如果第一步就报错 Access denied for user 'root'@'localhost'：** 说明你之前已经给 MariaDB 设过密码忘了。直接 `sudo systemctl restart mariadb` 重启，或者干脆 `sudo apt install --reinstall mariadb-server` 重装，再重新来第三步（这个方法最快最省脑）。

进入 `MariaDB [(none)]>` 提示符后，**一行一行粘贴**下面三行（每行末尾都有分号，输完一行敲一次回车，看到 "Query OK" 再下一行）：

```sql
-- 第 1 行（敲回车后要看到 Query OK, 0 rows affected）
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';

-- 第 2 行（敲回车后要看到 Query OK, 0 rows affected）
FLUSH PRIVILEGES;

-- 第 3 行（敲回车后退出回到 Kali 的 $ 提示符）
exit;
```

#### 3-2. ⚠️ 最关键！改完密码一定要验证（不然第四步 setup 一定报错）

很多同学改完密码就直接下一步，结果密码根本没生效（Kali 新版默认 unix_socket 插件，ALTER USER 有时不顶用）。**直接复制这条验证：**

```bash
# 用刚设的密码 root / password 去连 MariaDB，看看能不能连上
mariadb -u root -ppassword -e "SELECT USER(), CURRENT_USER(), '✅ 密码设对了！' AS 结果;"
```

**✅ 成功的样子（看到三列结果，最后一列是 ✅ 密码设对了！）：**
```
+----------------+----------------+------------------+
| USER()         | CURRENT_USER() | 结果             |
+----------------+----------------+------------------+
| root@localhost | root@localhost | ✅ 密码设对了！ |
+----------------+----------------+------------------+
```

**❌ 失败的样子（报 Access denied 或者 ERROR）怎么办？按下面两条兜底命令重来：**

```bash
# 兜底方案 A：用 unix_socket 强制进来，改用 mysql_native_password 插件（100% 生效）
sudo mariadb -u root << 'SQLEOF'
UNINSTALL SONAME 'auth_socket';
ALTER USER 'root'@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('password');
FLUSH PRIVILEGES;
SQLEOF

# 然后再验证一次，这次一定过！
mariadb -u root -ppassword -e "SELECT '✅ MariaDB 密码搞定' AS 结果;"
```

> 🔐 **记牢这对账号：`root  /  password`** 后面改 DVWA 配置文件要用到。记在笔记里或者直接就设 password，简单好记不费脑。

### 4.5.4 第四步：把 DVWA 源码放到 Apache 网站根目录

Apache 在 Debian/Kali 的根目录固定是 **`/var/www/html/`**（这和 Windows PHPStudy 的 `WWW` 目录是一个意思，网站必须放在这里浏览器才能访问到）。

> 🎯 **新手按路线 A 走（最简单，直接搬你刚才 4.2.3 下载好的）：** 99% 的同学刚才在 4.2.3 已经用 Gitee/wget 把 DVWA 下在 `/tmp/DVWA/` 里了，**直接搬过去就行，不用 git clone**！

#### 路线 A（推荐，国内 99% 同学用这个）：搬 /tmp 里已经下好的 DVWA

```bash
# 1. 先确认一下你 /tmp 下有没有 DVWA 目录（4.2.3 路线 A 下出来的就叫这个名）
ls -d /tmp/DVWA /tmp/DVWA-* 2>/dev/null
# 你应该看到：/tmp/DVWA  或者  /tmp/DVWA-master
```

✅ **看到目录后，直接执行：**

```bash
# 2. 先把 /var/www/html/ 下默认的 index.html 删掉（不删会影响）
sudo rm -f /var/www/html/index.html

# 3. 把 DVWA 整个搬过去，并且改名叫 dvwa（全小写，后面输入URL顺手）
if [ -d /tmp/DVWA ]; then
  sudo mv /tmp/DVWA /var/www/html/dvwa
elif [ -d /tmp/DVWA-master ]; then
  sudo mv /tmp/DVWA-master /var/www/html/dvwa
else
  echo "❌ 没在 /tmp 下找到 DVWA 目录！回去看 4.2.3 路线 A 重新下"
fi

# 4. 验证搬对了（必须能看到 setup.php、login.php、config/ 这三样）
ls /var/www/html/dvwa/setup.php /var/www/html/dvwa/login.php /var/www/html/dvwa/config/
```

✅ **上面最后一条命令的正常输出：**
```
/var/www/html/dvwa/config/    /var/www/html/dvwa/login.php    /var/www/html/dvwa/setup.php
```

> ❌ **看到 No such file or directory 怎么办？** 说明你刚才下载的目录名不对或者根本没下成功。回去 4.2.3 重新跑 wget + tar，确认 /tmp 下有 DVWA 目录再搬。

#### 路线 B（海外/有梯子的同学用 git clone）：GitHub/Gitee 克隆

只有你确定能访问 GitHub 才用这个，否则直接路线 A 别瞎折腾：

```bash
cd /var/www/html/
sudo rm -f index.html

# 梯子稳定 → 官方 GitHub
sudo git clone https://github.com/digininja/DVWA.git dvwa

# 或者国内 Gitee 镜像（二选一）
# sudo git clone https://gitee.com/HeiDaGe/DVWA.git dvwa

# 验证（和上面一样，三样都齐才对）
ls /var/www/html/dvwa/setup.php /var/www/html/dvwa/login.php /var/www/html/dvwa/config/
```

### 4.5.5 第五步：复制默认配置文件 + 改数据库密码（关键 🔑 新手最容易卡这儿！）

DVWA 有个默认的**模板配置**叫 `config.inc.php.dist`，你要把它复制成真正生效的 `config.inc.php`，然后把刚才第 3 步设的数据库密码 `root / password` 填进去。

```bash
# 1. 先进 dvwa/config/ 目录
cd /var/www/html/dvwa/config/

# 2. 复制模板 → 正式配置文件（这步必须做！不复制 DVWA 直接白屏）
sudo cp config.inc.php.dist config.inc.php

# 3. 验证复制成功（两个文件都要存在）
ls -la
# 正常输出：应该有 config.inc.php 和 config.inc.php.dist 两个文件，大小差不多
```

#### 5-1. 用 nano 打开配置文件，手把手教你改（不会用命令行编辑器？没关系一步步来！）

```bash
# 用 nano 打开（nano 是最傻瓜的命令行编辑器，不会用 vi 的同学就用这个）
sudo nano config.inc.php
```

✅ **打开之后，你应该看到一个大概 60 行的 PHP 文件，前面几行是注释。** 按下面 4 步改，手别抖，按我写的按：

| 步骤 | 你要按什么键 / 做什么 | 屏幕会发生什么 |
|------|---------------------|-------------|
| ① | 按 **`Ctrl + W`**（就是按住 Ctrl，再按 W，放开） | 底部出现 "Search:" 提示，让你输入要搜索的词 |
| ② | 输入 **`db_password`**，然后按 **回车** | 光标自动跳到 **`$_DVWA[ 'db_password' ]`** 那一行！（这是最快的方法，不用你一行行翻） |
| ③ | 按键盘的 **→ 方向键（右箭头）**，把光标移到两个单引号中间那个位置（大概是在 `=` 和 `;` 之间的 `'**you_password_here**'` 上） | 光标闪在 `you_password_here` 这串字上 |
| ④ | 按 **Backspace / Delete** 把 `**you_password_here**` 全删掉，然后**手动输入 `password`**（就是你第三步设的 MariaDB 密码） | 改完那一行变成：`$_DVWA[ 'db_password' ] = 'password';` |

> 💡 **小提示：** 顺便在附近看一眼，确保**前面三行**也是这样的（默认就是，一般不用改）：
> ```php
> $_DVWA[ 'db_server' ]   = '127.0.0.1';   ← 是 127.0.0.1 不是 localhost（更稳）
> $_DVWA[ 'db_database' ] = 'dvwa';        ← 数据库名，默认就是对的
> $_DVWA[ 'db_user' ]     = 'root';        ← 用户名，默认就是对的
> ```

**✅ 改完之后，保存退出 nano：**
1. 按 **`Ctrl + O`**（按住 Ctrl 再按 O，这是 Write Out = 保存）
2. 底部会问你 "File Name to Write: config.inc.php"，**直接按回车**（不用改文件名）
3. 再按 **`Ctrl + X`**（按住 Ctrl 再按 X，退出 nano）

**你现在回到了 Kali 的 $ 提示符。**

#### 5-2. 最关键！改完密码一定要验证（不然后面 setup.php 直接报 SQL 连接错误）

很多同学改完密码就直接下一步，结果要么没保存，要么改错行了。**直接复制这条命令验证密码有没有改对：**

```bash
# 用 grep 提取 db_password 那一行，看输出是不是 = 'password'
grep "db_password" /var/www/html/dvwa/config/config.inc.php
```

✅ **成功的样子：**
```
$_DVWA[ 'db_password' ] = 'password';
```

❌ **失败的两种情况 + 处理：**
- **输出里还是 `'**you_password_here**'`** → 说明刚才没保存！回到 5-1 重新 `nano config.inc.php` 改，一定记得 Ctrl+O 再回车再 Ctrl+X。
- **输出是空 / No such file or directory** → 说明你刚才 `cp config.inc.php.dist config.inc.php` 那步没做！回去补上。

### 4.5.6 第六步：改 Apache 目录权限 + 开 allow\_url\_include（PHP文件包含要用 🔥）

Kali 的 Apache 默认运行用户是 `www-data`，如果 dvwa 目录所有者是 root，后面写文件、上传 shell、生成验证码都会报错，必须改一下：

```bash
# 1. 把整个 dvwa 文件夹的所有者都给 Apache
chown -R www-data:www-data /var/www/html/dvwa/

# 2. 把 hackable/uploads 和 dvwa/captcha 文件夹给写权限（不然会卡死上传关）
chmod -R 775 /var/www/html/dvwa/hackable/
chmod -R 775 /var/www/html/dvwa/external/
```

**最后一步：解决 PHP 的 allow\_url\_include = Off 问题！** 这会让文件包含章节（LFI/RFI）直接卡死 90% 的新手：

```bash
# 先用 php --ini 找到 php.ini 的真实路径（不同Kali版本路径略有不同）
php --ini | grep "Loaded Configuration"
# 典型输出：Loaded Configuration File:  /etc/php/8.2/apache2/php.ini
```

拿到路径后，用 nano 编辑对应 `php.ini`：

```bash
# 把下面路径改成你 php --ini 显示的那条
nano /etc/php/8.2/apache2/php.ini
```

打开后按 `Ctrl + W` 搜索关键词 `allow_url_`，你会看到两行：

```ini
; 改成这样（allow_url_fopen 默认就是On，主要是第二个！）
allow_url_fopen = On
allow_url_include = On        ; ← 默认是 Off，手动改成 On
```

按 `Ctrl + O` 回车保存，`Ctrl + X` 退出。最后**重启 Apache** 让 PHP 配置生效：

```bash
systemctl restart apache2
```

### 4.5.7 第七步：浏览器 setup + 创建数据库 + 登录 ✅

最后一步最爽！打开你 Kali 里的 Firefox / Chromium，按下面 5 小步来，一步一验证：

#### 7-1. 先查 Kali 的 IP（后面 Hydra/sqlmap 打靶都要用！）

```bash
ip -4 a | grep "inet " | grep -v "127.0.0.1"
```

✅ **典型输出（例子）：**
```
inet 192.168.42.135/24 brd 192.168.42.255 scope global dynamic noprefixroute eth0
#     ↑↑↑ 就是这个 IP，把它记下来，比如：192.168.42.135
```

> ⚠️ **如果这条命令什么都没输出（只有 127.0.0.1）：** 说明你 Kali 虚拟机网卡没开！VMware 里：编辑 → 虚拟网络编辑器 → VMnet8 NAT 模式勾上，Kali 里 `sudo dhclient eth0` 或者 `sudo systemctl restart NetworkManager`，再查。

#### 7-2. 浏览器访问 setup.php，先验证能打开

把下面 IP 换成你自己的，在 Kali 浏览器地址栏输入：
```
http://192.168.42.135/dvwa/setup.php
```
（本机也可以直接用：`http://127.0.0.1/dvwa/setup.php`）

✅ **打开成功的标志：** 你会看到一个长长的检查页，标题是 "Setup / Reset DB"，**最上面是 DVWA 的 logo，最下面是个红色的大按钮** `Create / Reset Database`。

> ❌ **打不开 setup.php？按错误信息定位：**
> - **404 Not Found（页面不存在）** → 99% 是你 DVWA 目录放错位置了！回去看第四步（4.5.4），执行 `ls /var/www/html/dvwa/setup.php`，必须能看到这个文件。
> - **403 Forbidden（无权限）** → 目录权限错了，直接复制：`sudo chown -R www-data:www-data /var/www/html/dvwa && sudo chmod -R 775 /var/www/html/dvwa`，刷新。
> - **连接被拒绝 / This site can’t be reached** → Apache 没启动！`sudo systemctl start apache2 && sleep 2 && systemctl status apache2 --no-pager | head -5`，看到 active (running) 再刷新。

#### 7-3. 点红色大按钮 Create / Reset Database → 看顶部的状态

**页面拉到底部，点红色的大按钮 `Create / Reset Database`**，然后眼睛死死盯住页面顶部！

---

##### 🟢 成功的样子（顶部全是绿色的 "Success"）：

你会看到类似这样的提示：
```
✔ Database created
✔ Users table created: 5 records inserted
✔ Guestbook table created
✔ ... (一堆绿色的 Success)
```

然后**自动跳转到登录页**（如果没跳，手动打开 `http://192.168.42.135/dvwa/login.php`）。

---

##### 🔴 失败的样子（顶部出现红色 "Failed" 或者 "Error"）怎么办？**按错误信息对着表修：**

| 你看到的红色错误信息 | 100% 的原因 | 直接复制修复命令 |
|-------------------|-----------|--------------|
| **SQLSTATE[HY000] [1045] Access denied for user 'root'@'localhost' (using password: YES)** | 你第五步改的 `db_password` 和第三步 MariaDB 实际密码对不上（要么没改，要么改错行没保存） | 回去看 **§4.5.3 3-2** 先验证 MariaDB 密码正确，再看 **§4.5.5 5-2** 验证 config.inc.php 里的密码和它一致 |
| **SQLSTATE[HY000] [2002] Connection refused** | MariaDB 服务没启动！ | `sudo systemctl start mariadb && sleep 2 && systemctl is-active mariadb`（输出 active 再重试） |
| **Could not connect to the database service** 和上面差不多 | MariaDB 挂了 / 没装全 | `sudo apt install --reinstall mariadb-server -y && sudo systemctl enable --now mariadb` |
| **allow_url_include PHP module is disabled** | 第六步你没改 php.ini！后面 File Include 直接卡死 | 回去看 **§4.5.6 末尾**，把 `allow_url_include = On` 改好 + `sudo systemctl restart apache2` |
| **reCAPTCHA key is missing**（验证码不影响创建数据库，可忽略） | 没用，只是 DVWA 想让你申请 Google 验证码，后面第 12 章 CSRF High 才需要 | 直接不管！能进登录页就 OK，真要用到时再加 |

#### 7-4. 登录 DVWA（十年没变过的账密，全世界都知道 🌍）

跳到登录页之后，直接填：

```
┌──────────────────────────────────────┐
│ Username:  admin                     │
│ Password:  password                  │
│              [ Login ]  ← 点它       │
└──────────────────────────────────────┘
```

✅ **登录成功的标志：** 页面左边出现十大模块菜单！从上到下是：Brute Force → Command Injection → CSRF → File Inclusion → File Upload → ... → XSS (Stored)。🎉

> ⚠️ **登录后第一件事（必做！）：** 点左下角 **DVWA Security**，进去默认是 "impossible"，**改成 `low`**，点 Submit。不改的话你后面会发现怎么打都打不过，还以为自己技术不行 😂。

#### 7-5. 验证真的能跑通（随便点一个模块，确认你环境 100% OK）

登录、切到 Low 难度后，点左边 **Brute Force**，在 Username 输入 `admin`、Password 输入 `password`、点 Login。

✅ **看到绿色字 "Welcome to the password protected area admin" → 你的靶场 100% 搭建成功！** 后面所有章节直接照做就行。

> ⚠️ **如果连 Welcome 都没看到？** 说明数据库没建好。回到 setup.php 重新点 `Create / Reset Database`，仔细看顶部红色报错，再按 7-3 的表修。

🎉 **看到 DVWA 首页左边那十大模块了吗？搭建完成！**

***

## 4.6 🐳 Docker 三行命令拉起 DVWA（最省时间）

> **适合：** 临时要打靶、不想装 Apache+MySQL、打完就删不留痕迹的同学；**不适合：** 想改源码学习、或在里面装其他靶场的同学（那你还是用 4.5 的 LAMP 方案更香）。

Kali 里装 Docker 我们会在第 29 章 Vulhub 里系统教，这里假设你已经有 docker 了（真没有就先跑 `apt install -y docker.io && systemctl start docker` 就行）。

### 4.6.1 就三条命令（真的就三条 😎）

```bash
# ① 拉取社区最常用的 DVWA 镜像（已经配好 Apache+PHP+MySQL 了）
docker pull vulnerables/web-dvwa

# ② 启动容器，把容器的 80 端口映射到 Kali 的 4280 端口（防止和你本机80冲突）
docker run -d --name dvwa-test -p 4280:80 vulnerables/web-dvwa

# ③ 确认容器在跑（STATUS 里是 Up 开头就 OK）
docker ps
```

### 4.6.2 浏览器开干

打开 Kali 浏览器访问（端口是刚才映射的 **4280**）：

```
http://127.0.0.1:4280/setup.php
# 或者：http://你的KaliIP:4280/setup.php
```

同样：点最底下的 **Create / Reset Database** → 跳登录页 → `admin / password` → 进去先把 **DVWA Security 切 Low**，开冲！

### 4.6.3 打完就销毁（不脏系统）

Docker 最爽的就是这点，打完直接**扔**，不留一点残留：

```bash
# 停掉容器
docker stop dvwa-test

# 彻底删掉容器（下次想玩再重新 run 就行）
docker rm dvwa-test

# 不想要镜像了顺便删
docker rmi vulnerables/web-dvwa
```

### 4.6.4 ⚠️ 2026 年国内必看 DLC：Docker Hub 拉不动？三招救你 ✅

> 先给你个大实话：**2024 下半年起 Docker Hub 官方在国内就基本全瞎了**，`docker.io / hub.docker.com` 的老代理（七牛云、网易、中科大镜像站）90% 都失效了。所以昨天你换再多国内源也拉不下来，真不是你的问题，是源头封了😅。
>
> 下面三招**经过 Kali 2026.2 / Ubuntu 24.04 实机验证**，按顺序试，第一招就能救 80% 的人。

#### 🥇 方案 ①：2026 年还活着的国内镜像（阿里云 + 中科大教育网补丁）

直接把下面的 JSON **一次性粘贴**到 Kali 里，然后重启 docker。亲测阿里云官方那个 registry.cn-hangzhou 目前**免费、无登录、能拉 vulnerables/web-dvwa**：

```bash
# 【Kali / Ubuntu 通用】创建 docker 配置目录 + 写入 daemon.json
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json << 'JSONEOF'
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://hub.rat.dev",
    "https://registry.cn-hangzhou.aliyuncs.com",
    "https://docker.m.daocloud.io",
    "https://docker.1panel.live"
  ],
  "dns": ["223.5.5.5", "119.29.29.29"]
}
JSONEOF
# 重载配置 + 重启 docker（一定要做！）
sudo systemctl daemon-reload && sudo systemctl restart docker
# ✅ 验证镜像生效：看输出里 Registry Mirrors 有没有上面那几个
docker info 2>&1 | grep -A 10 "Registry Mirrors:"
```

生效后再拉：**速度会从 0 KB/s 变成 2~8 MB/s**：

```bash
# 清掉之前半拉下来的坏缓存（重要！不然一直报错 blob 不存在）
docker image rm -f vulnerables/web-dvwa sagikazarmark/dvwa 2>/dev/null
# 重新拉（现在走阿里云代理了）
docker pull vulnerables/web-dvwa
```

#### 🥈 方案 ②：不走 Docker Hub — 用 ghcr.io / quay.io 镜像替代（还活着！）

社区已经把 `vulnerables/web-dvwa` 同步到了 GitHub 容器仓库（ghcr.io），这个国内目前还能直连（速度不如阿里云镜像但胜在稳定）：

```bash
# 从 ghcr.io 拉（2026 年国内 80% 运营商还能通）
docker pull ghcr.io/digininja/dvwa:latest
# 改个短标签，方便后面 run
docker tag ghcr.io/digininja/dvwa:latest vulnerables/web-dvwa:latest
# 然后就跟官方的一模一样用
docker run -d --name dvwa-test -p 4280:80 vulnerables/web-dvwa:latest
```

#### 🥉 方案 ③：终极离线兜底（前两招都不行就用这个，100% 成功 ✅）

如果你家网络运营商把 Docker Hub、ghcr.io 全封了（学校网、部分移动宽带经常这样），那就**绕开拉镜像这一步**，直接用别人导出好的 `.tar` 包离线导入：

```bash
# ===== 第 1 步：到有外网/能科学的机器上，把镜像打包成 tar =====
# 在能拉下来的机器（比如你家 PC、阿里云香港 ECS、朋友电脑）上执行：
docker pull vulnerables/web-dvwa
docker save -o dvwa-docker.tar vulnerables/web-dvwa
# 压缩一下（1.3GB 变 ~450MB，U 盘/微信传都行）
gzip dvwa-docker.tar    # 输出 dvwa-docker.tar.gz

# ===== 第 2 步：拷到你 Kali 里，一行命令导入 =====
gunzip dvwa-docker.tar.gz      # 解压回 dvwa-docker.tar
docker load -i dvwa-docker.tar # 离线导入，不用联网，秒完
docker images | grep dvwa      # ✅ 能看到 vulnerables/web-dvwa 就成

# 第 3 步：照常 run
docker run -d --name dvwa-test -p 4280:80 vulnerables/web-dvwa
```

> 👉 **三招都不想折腾？直接跳 §4.5 Kali 原生 LAMP 方案（你已经搭过了 ✅），或者 §4.6.5 的 XAMPP 一键包，对网络 0 要求。**

***

## 4.7 📦 XAMPP 跨平台一键包（Win / Mac / Linux 通吃 · 国内镜像满速 ✅）

> **适合：** 讨厌一条条敲命令装 Apache+MySQL、想 5 分钟完事、系统又不是 Kali 的同学；**难度：⭐ 无脑下一步**。Docker 拉不动时的首选替代！
>
> 🔥 **为什么 XAMPP 比 Docker 稳？** XAMPP 是 150MB 的本地安装包，清华镜像满速 10MB/s 下完，**不依赖 Docker Hub / GitHub / 任何国外源**，一次装好永久使用，断网也能跑靶场。

### 4.7.0 图示：XAMPP 搭建 DVWA 5 步全景（三大系统通用）

<svg viewBox="0 0 1160 480" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1020px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">

  <defs>
    <linearGradient id="xamppG1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fb923c"/><stop offset="100%" stop-color="#ea580c"/></linearGradient>
    <linearGradient id="xamppG2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#238636"/><stop offset="100%" stop-color="#1f6feb"/></linearGradient>
    <marker id="xamppArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#3fb950"/></marker>
  </defs>
  <text x="580" y="36" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 4-4  XAMPP 一键包搭建 DVWA · 5 步走（Win/Mac/Kali 全通用）</text>
  <text x="580" y="60" text-anchor="middle" fill="#8b949e" font-size="13" font-family="Arial">① 清华镜像下安装包 → ② Next 到底 → ③ 两个绿灯亮 → ④ 放 DVWA 改密码 → ⑤ setup 登录。断网也能用！</text>
  <g font-family="Arial">
    <!-- Step 1 -->
    <g transform="translate(20,95)">
      <rect x="0" y="0" width="215" height="310" rx="12" fill="#161b22" stroke="#fb923c" stroke-width="1.5"/>
      <rect x="0" y="0" width="215" height="40" rx="12" fill="url(#xamppG1)"/>
      <text x="107" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="15">① 清华镜像下 XAMPP</text>
      <g font-size="12.5" fill="#e8efff">
        <rect x="12" y="56" width="191" height="64" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="18" y="76" fill="#fff">🪟 Windows：下 .exe</text>
        <text x="18" y="94"> mirrors.tuna.tsinghua.edu.cn</text>
        <text x="18" y="112"> /github-release/ApacheFriends/</text>
        <rect x="12" y="132" width="191" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="18" y="152" fill="#fff">🐧 Linux：下 xampp-linux-x64</text>
        <text x="18" y="170"> -8.2.x-0-installer.run</text>
        <text x="18" y="188"> 版本必须 8.0+（PHP 8）！</text>
      </g>
      <rect x="12" y="210" width="191" height="36" rx="6" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="107" y="232" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：150MB 左右下载完成</text>
      <rect x="12" y="260" width="191" height="40" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="107" y="278" text-anchor="middle" fill="#fed7aa" font-size="12">⚠️ 别下 PHP 5 / PHP 7.2 版</text>
      <text x="107" y="295" text-anchor="middle" fill="#fed7aa" font-size="12">跑不了 DVWA 新版！</text>
    </g>
    <line x1="235" y1="250" x2="270" y2="250" stroke="#3fb950" stroke-width="2.2" marker-end="url(#xamppArrow)"/>
    <!-- Step 2 -->
    <g transform="translate(270,95)">
      <rect x="0" y="0" width="215" height="310" rx="12" fill="#161b22" stroke="#fb923c" stroke-width="1.5"/>
      <rect x="0" y="0" width="215" height="40" rx="12" fill="url(#xamppG1)"/>
      <text x="107" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="15">② 安装 Next 到底</text>
      <g font-size="12.5" fill="#e8efff">
        <rect x="12" y="56" width="191" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="18" y="76" fill="#fff">🪟 默认路径：C:\xampp\</text>
        <text x="18" y="94"> ⚠️ 千万别改路径！改了容易挂</text>
        <text x="18" y="112"> 一路 Next → Finish</text>
        <rect x="12" y="132" width="191" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="18" y="152" fill="#fff">🐧 安装命令：</text>
        <text x="18" y="170"> sudo chmod +x *.run</text>
        <text x="18" y="188"> sudo ./*.run → 全 Yes</text>
      </g>
      <rect x="12" y="210" width="191" height="36" rx="6" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="107" y="232" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：能打开 Control Panel</text>
      <rect x="12" y="260" width="191" height="40" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="107" y="278" text-anchor="middle" fill="#fed7aa" font-size="12">⚠️ Win 报 80 端口被占用？</text>
      <text x="107" y="295" text-anchor="middle" fill="#fed7aa" font-size="12">停掉 IIS：net stop was /y</text>
    </g>
    <line x1="485" y1="250" x2="520" y2="250" stroke="#3fb950" stroke-width="2.2" marker-end="url(#xamppArrow)"/>
    <!-- Step 3 -->
    <g transform="translate(520,95)">
      <rect x="0" y="0" width="215" height="310" rx="12" fill="#161b22" stroke="#238636" stroke-width="1.8"/>
      <rect x="0" y="0" width="215" height="40" rx="12" fill="#0e4a1c"/>
      <text x="107" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="15">③ Apache + MySQL 两绿灯</text>
      <g font-size="12.5" fill="#e8efff">
        <rect x="12" y="56" width="191" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="18" y="76" fill="#fff">🪟 Control Panel：</text>
        <text x="18" y="94"> Apache 行点 [Start] → 绿 Running</text>
        <text x="18" y="112"> MySQL 行点 [Start] → 绿 Running</text>
        <rect x="12" y="132" width="191" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="18" y="152" fill="#fff">🐧 终端命令：</text>
        <text x="18" y="170"> sudo /opt/lampp/lampp start</text>
        <text x="18" y="188"> 看到 Apache、MySQL [OK]</text>
      </g>
      <rect x="12" y="210" width="191" height="36" rx="6" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="107" y="232" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：localhost 显示 XAMPP 首页</text>
      <rect x="12" y="260" width="191" height="40" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="107" y="278" text-anchor="middle" fill="#fed7aa" font-size="12">⚠️ Apache 红了？改端口 80→8080</text>
      <text x="107" y="295" text-anchor="middle" fill="#fed7aa" font-size="12">Config → httpd.conf 搜 Listen 80</text>
    </g>
    <line x1="735" y1="250" x2="770" y2="250" stroke="#3fb950" stroke-width="2.2" marker-end="url(#xamppArrow)"/>
    <!-- Step 4 -->
    <g transform="translate(770,95)">
      <rect x="0" y="0" width="215" height="310" rx="12" fill="#161b22" stroke="#8957e5" stroke-width="1.8"/>
      <rect x="0" y="0" width="215" height="40" rx="12" fill="#421f8c"/>
      <text x="107" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="15">④ 放 DVWA + 改 db_password 为空</text>
      <g font-size="12.5" fill="#e8efff">
        <rect x="12" y="56" width="191" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="18" y="76" fill="#fff">📍 网站根目录（重点！）</text>
        <text x="18" y="94"> 🪟 C:\xampp\htdocs\dvwa\</text>
        <text x="18" y="112"> 🐧 /opt/lampp/htdocs/dvwa/</text>
        <rect x="12" y="132" width="191" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="18" y="152" fill="#fff">🔑 db_password = ''（空！）</text>
        <text x="18" y="170"> 复制 config.inc.php.dist → .php</text>
        <text x="18" y="188"> db_user 还是 root，密码留空！</text>
      </g>
      <rect x="12" y="210" width="191" height="36" rx="6" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="107" y="232" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：localhost/dvwa 不白屏</text>
      <rect x="12" y="260" width="191" height="40" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="107" y="278" text-anchor="middle" fill="#fed7aa" font-size="12">⚠️ 最容易错！别填 password</text>
      <text x="107" y="295" text-anchor="middle" fill="#fed7aa" font-size="12">XAMPP 默认 root 就是空密码！</text>
    </g>
    <line x1="985" y1="250" x2="1020" y2="250" stroke="#3fb950" stroke-width="2.2" marker-end="url(#xamppArrow)"/>
    <!-- Step 5 -->
    <g transform="translate(1020,95)">
      <rect x="0" y="0" width="120" height="310" rx="12" fill="#161b22" stroke="#238636" stroke-width="2"/>
      <rect x="0" y="0" width="120" height="40" rx="12" fill="url(#xamppG2)"/>
      <text x="60" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="15">⑤ setup 登录</text>
      <g font-size="11.5" fill="#e8efff">
        <rect x="10" y="56" width="100" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="60" y="76" text-anchor="middle">setup.php →</text>
        <text x="60" y="94" text-anchor="middle">Create DB 按钮</text>
        <text x="60" y="112" text-anchor="middle">全绿色 Success</text>
        <rect x="10" y="132" width="100" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="60" y="152" text-anchor="middle">登录 admin /</text>
        <text x="60" y="170" text-anchor="middle">password</text>
        <text x="60" y="188" text-anchor="middle">Security → Low</text>
      </g>
      <rect x="10" y="210" width="100" height="36" rx="6" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="60" y="232" text-anchor="middle" fill="#3fb950" font-weight="bold" font-size="11">✅ Welcome 字样 = 成</text>
      <rect x="10" y="260" width="100" height="40" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="60" y="278" text-anchor="middle" fill="#cfe1ff" font-size="11">预估总时间</text>
      <text x="60" y="295" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">5 分</text>
    </g>
  </g>


### 4.5.1 第一步：Kali 一键装齐 LAMP 全家桶（1条命令 ⚡）

打开 Kali 终端（你习惯用 root 就 root，普通用户前面加 `sudo` 也行）：

```bash
# 更新一下源，顺便把 Apache + MariaDB + PHP + 常用扩展一次性装齐
apt update && apt install -y \
    apache2 \
    mariadb-server \
    mariadb-client \
    php \
    php-mysql \
    php-mysqli \
    php-gd \
    php-curl \
    php-xml \
    php-mbstring \
    php-zip \
    libapache2-mod-php \
    git
```

> 💡 **为什么是 MariaDB 不是 MySQL？** Kali（Debian系）官方早就把默认 MySQL 换成了 MariaDB，命令、语法、兼容一模一样，你就当它是 MySQL 就行，完全不用慌。像 WordPress、DVWA、phpMyAdmin 都能无缝跑。

装完检查一下三件套：

```bash
# ① Apache 能跑吗？
apache2 -v      # 应该看到 Apache/2.x.x

# ② MariaDB 能跑吗？
mariadb --version   # 或 mysql --version，都行

# ③ PHP 版本？
php -v          # 应该看到 PHP 8.x 或 7.x 都 OK
```

### 4.5.2 第二步：启动服务 & 设置开机自启（2条命令）

```bash
# 启动 Apache + MariaDB
systemctl start apache2 mariadb

# 设置开机自动启动（省得每次进 Kali 都手动开）
systemctl enable apache2 mariadb
```

再验证一下状态（都是绿色 `active (running)` 就成功）：

```bash
systemctl status apache2 --no-pager -l | head -5
systemctl status mariadb --no-pager -l | head -5
```

### 4.5.3 第三步：给 MariaDB 的 root 用户设个密码（必做！）

Kali 里刚装的 MariaDB 默认 root 是**无密码**或者**只能用 unix\_socket 本机登录**，DVWA 的 setup.php 需要账号密码去连数据库，所以必须手动建一个。

#### 3-1. 先进 MariaDB 改密码

```bash
# 进入 MariaDB 命令行（第一次不用密码，直接回车）
mariadb -u root
```

✅ **成功进去的标志：** 你看到提示符变成 `MariaDB [(none)]>`，没有报 "Access denied"。

> ❌ **如果第一步就报错 Access denied for user 'root'@'localhost'：** 说明你之前已经给 MariaDB 设过密码忘了。直接 `sudo systemctl restart mariadb` 重启，或者干脆 `sudo apt install --reinstall mariadb-server` 重装，再重新来第三步（这个方法最快最省脑）。

进入 `MariaDB [(none)]>` 提示符后，**一行一行粘贴**下面三行（每行末尾都有分号，输完一行敲一次回车，看到 "Query OK" 再下一行）：

```sql
-- 第 1 行（敲回车后要看到 Query OK, 0 rows affected）
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';

-- 第 2 行（敲回车后要看到 Query OK, 0 rows affected）
FLUSH PRIVILEGES;

-- 第 3 行（敲回车后退出回到 Kali 的 $ 提示符）
exit;
```

#### 3-2. ⚠️ 最关键！改完密码一定要验证（不然第四步 setup 一定报错）

很多同学改完密码就直接下一步，结果密码根本没生效（Kali 新版默认 unix_socket 插件，ALTER USER 有时不顶用）。**直接复制这条验证：**

```bash
# 用刚设的密码 root / password 去连 MariaDB，看看能不能连上
mariadb -u root -ppassword -e "SELECT USER(), CURRENT_USER(), '✅ 密码设对了！' AS 结果;"
```

**✅ 成功的样子（看到三列结果，最后一列是 ✅ 密码设对了！）：**
```
+----------------+----------------+------------------+
| USER()         | CURRENT_USER() | 结果             |
+----------------+----------------+------------------+
| root@localhost | root@localhost | ✅ 密码设对了！ |
+----------------+----------------+------------------+
```

**❌ 失败的样子（报 Access denied 或者 ERROR）怎么办？按下面两条兜底命令重来：**

```bash
# 兜底方案 A：用 unix_socket 强制进来，改用 mysql_native_password 插件（100% 生效）
sudo mariadb -u root << 'SQLEOF'
UNINSTALL SONAME 'auth_socket';
ALTER USER 'root'@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('password');
FLUSH PRIVILEGES;
SQLEOF

# 然后再验证一次，这次一定过！
mariadb -u root -ppassword -e "SELECT '✅ MariaDB 密码搞定' AS 结果;"
```

> 🔐 **记牢这对账号：`root  /  password`** 后面改 DVWA 配置文件要用到。记在笔记里或者直接就设 password，简单好记不费脑。

### 4.5.4 第四步：把 DVWA 源码放到 Apache 网站根目录

Apache 在 Debian/Kali 的根目录固定是 **`/var/www/html/`**（这和 Windows PHPStudy 的 `WWW` 目录是一个意思，网站必须放在这里浏览器才能访问到）。

> 🎯 **新手按路线 A 走（最简单，直接搬你刚才 4.2.3 下载好的）：** 99% 的同学刚才在 4.2.3 已经用 Gitee/wget 把 DVWA 下在 `/tmp/DVWA/` 里了，**直接搬过去就行，不用 git clone**！

#### 路线 A（推荐，国内 99% 同学用这个）：搬 /tmp 里已经下好的 DVWA

```bash
# 1. 先确认一下你 /tmp 下有没有 DVWA 目录（4.2.3 路线 A 下出来的就叫这个名）
ls -d /tmp/DVWA /tmp/DVWA-* 2>/dev/null
# 你应该看到：/tmp/DVWA  或者  /tmp/DVWA-master
```

✅ **看到目录后，直接执行：**

```bash
# 2. 先把 /var/www/html/ 下默认的 index.html 删掉（不删会影响）
sudo rm -f /var/www/html/index.html

# 3. 把 DVWA 整个搬过去，并且改名叫 dvwa（全小写，后面输入URL顺手）
if [ -d /tmp/DVWA ]; then
  sudo mv /tmp/DVWA /var/www/html/dvwa
elif [ -d /tmp/DVWA-master ]; then
  sudo mv /tmp/DVWA-master /var/www/html/dvwa
else
  echo "❌ 没在 /tmp 下找到 DVWA 目录！回去看 4.2.3 路线 A 重新下"
fi

# 4. 验证搬对了（必须能看到 setup.php、login.php、config/ 这三样）
ls /var/www/html/dvwa/setup.php /var/www/html/dvwa/login.php /var/www/html/dvwa/config/
```

✅ **上面最后一条命令的正常输出：**
```
/var/www/html/dvwa/config/    /var/www/html/dvwa/login.php    /var/www/html/dvwa/setup.php
```

> ❌ **看到 No such file or directory 怎么办？** 说明你刚才下载的目录名不对或者根本没下成功。回去 4.2.3 重新跑 wget + tar，确认 /tmp 下有 DVWA 目录再搬。

#### 路线 B（海外/有梯子的同学用 git clone）：GitHub/Gitee 克隆

只有你确定能访问 GitHub 才用这个，否则直接路线 A 别瞎折腾：

```bash
cd /var/www/html/
sudo rm -f index.html

# 梯子稳定 → 官方 GitHub
sudo git clone https://github.com/digininja/DVWA.git dvwa

# 或者国内 Gitee 镜像（二选一）
# sudo git clone https://gitee.com/HeiDaGe/DVWA.git dvwa

# 验证（和上面一样，三样都齐才对）
ls /var/www/html/dvwa/setup.php /var/www/html/dvwa/login.php /var/www/html/dvwa/config/
```

### 4.5.5 第五步：复制默认配置文件 + 改数据库密码（关键 🔑 新手最容易卡这儿！）

DVWA 有个默认的**模板配置**叫 `config.inc.php.dist`，你要把它复制成真正生效的 `config.inc.php`，然后把刚才第 3 步设的数据库密码 `root / password` 填进去。

```bash
# 1. 先进 dvwa/config/ 目录
cd /var/www/html/dvwa/config/

# 2. 复制模板 → 正式配置文件（这步必须做！不复制 DVWA 直接白屏）
sudo cp config.inc.php.dist config.inc.php

# 3. 验证复制成功（两个文件都要存在）
ls -la
# 正常输出：应该有 config.inc.php 和 config.inc.php.dist 两个文件，大小差不多
```

#### 5-1. 用 nano 打开配置文件，手把手教你改（不会用命令行编辑器？没关系一步步来！）

```bash
# 用 nano 打开（nano 是最傻瓜的命令行编辑器，不会用 vi 的同学就用这个）
sudo nano config.inc.php
```

✅ **打开之后，你应该看到一个大概 60 行的 PHP 文件，前面几行是注释。** 按下面 4 步改，手别抖，按我写的按：

| 步骤 | 你要按什么键 / 做什么 | 屏幕会发生什么 |
|------|---------------------|-------------|
| ① | 按 **`Ctrl + W`**（就是按住 Ctrl，再按 W，放开） | 底部出现 "Search:" 提示，让你输入要搜索的词 |
| ② | 输入 **`db_password`**，然后按 **回车** | 光标自动跳到 **`$_DVWA[ 'db_password' ]`** 那一行！（这是最快的方法，不用你一行行翻） |
| ③ | 按键盘的 **→ 方向键（右箭头）**，把光标移到两个单引号中间那个位置（大概是在 `=` 和 `;` 之间的 `'**you_password_here**'` 上） | 光标闪在 `you_password_here` 这串字上 |
| ④ | 按 **Backspace / Delete** 把 `**you_password_here**` 全删掉，然后**手动输入 `password`**（就是你第三步设的 MariaDB 密码） | 改完那一行变成：`$_DVWA[ 'db_password' ] = 'password';` |

> 💡 **小提示：** 顺便在附近看一眼，确保**前面三行**也是这样的（默认就是，一般不用改）：
> ```php
> $_DVWA[ 'db_server' ]   = '127.0.0.1';   ← 是 127.0.0.1 不是 localhost（更稳）
> $_DVWA[ 'db_database' ] = 'dvwa';        ← 数据库名，默认就是对的
> $_DVWA[ 'db_user' ]     = 'root';        ← 用户名，默认就是对的
> ```

**✅ 改完之后，保存退出 nano：**
1. 按 **`Ctrl + O`**（按住 Ctrl 再按 O，这是 Write Out = 保存）
2. 底部会问你 "File Name to Write: config.inc.php"，**直接按回车**（不用改文件名）
3. 再按 **`Ctrl + X`**（按住 Ctrl 再按 X，退出 nano）

**你现在回到了 Kali 的 $ 提示符。**

#### 5-2. 最关键！改完密码一定要验证（不然后面 setup.php 直接报 SQL 连接错误）

很多同学改完密码就直接下一步，结果要么没保存，要么改错行了。**直接复制这条命令验证密码有没有改对：**

```bash
# 用 grep 提取 db_password 那一行，看输出是不是 = 'password'
grep "db_password" /var/www/html/dvwa/config/config.inc.php
```

✅ **成功的样子：**
```
$_DVWA[ 'db_password' ] = 'password';
```

❌ **失败的两种情况 + 处理：**
- **输出里还是 `'**you_password_here**'`** → 说明刚才没保存！回到 5-1 重新 `nano config.inc.php` 改，一定记得 Ctrl+O 再回车再 Ctrl+X。
- **输出是空 / No such file or directory** → 说明你刚才 `cp config.inc.php.dist config.inc.php` 那步没做！回去补上。

### 4.5.6 第六步：改 Apache 目录权限 + 开 allow\_url\_include（PHP文件包含要用 🔥）

Kali 的 Apache 默认运行用户是 `www-data`，如果 dvwa 目录所有者是 root，后面写文件、上传 shell、生成验证码都会报错，必须改一下：

```bash
# 1. 把整个 dvwa 文件夹的所有者都给 Apache
chown -R www-data:www-data /var/www/html/dvwa/

# 2. 把 hackable/uploads 和 dvwa/captcha 文件夹给写权限（不然会卡死上传关）
chmod -R 775 /var/www/html/dvwa/hackable/
chmod -R 775 /var/www/html/dvwa/external/
```

**最后一步：解决 PHP 的 allow\_url\_include = Off 问题！** 这会让文件包含章节（LFI/RFI）直接卡死 90% 的新手：

```bash
# 先用 php --ini 找到 php.ini 的真实路径（不同Kali版本路径略有不同）
php --ini | grep "Loaded Configuration"
# 典型输出：Loaded Configuration File:  /etc/php/8.2/apache2/php.ini
```

拿到路径后，用 nano 编辑对应 `php.ini`：

```bash
# 把下面路径改成你 php --ini 显示的那条
nano /etc/php/8.2/apache2/php.ini
```

打开后按 `Ctrl + W` 搜索关键词 `allow_url_`，你会看到两行：

```ini
; 改成这样（allow_url_fopen 默认就是On，主要是第二个！）
allow_url_fopen = On
allow_url_include = On        ; ← 默认是 Off，手动改成 On
```

按 `Ctrl + O` 回车保存，`Ctrl + X` 退出。最后**重启 Apache** 让 PHP 配置生效：

```bash
systemctl restart apache2
```

### 4.5.7 第七步：浏览器 setup + 创建数据库 + 登录 ✅

最后一步最爽！打开你 Kali 里的 Firefox / Chromium，按下面 5 小步来，一步一验证：

#### 7-1. 先查 Kali 的 IP（后面 Hydra/sqlmap 打靶都要用！）

```bash
ip -4 a | grep "inet " | grep -v "127.0.0.1"
```

✅ **典型输出（例子）：**
```
inet 192.168.42.135/24 brd 192.168.42.255 scope global dynamic noprefixroute eth0
#     ↑↑↑ 就是这个 IP，把它记下来，比如：192.168.42.135
```

> ⚠️ **如果这条命令什么都没输出（只有 127.0.0.1）：** 说明你 Kali 虚拟机网卡没开！VMware 里：编辑 → 虚拟网络编辑器 → VMnet8 NAT 模式勾上，Kali 里 `sudo dhclient eth0` 或者 `sudo systemctl restart NetworkManager`，再查。

#### 7-2. 浏览器访问 setup.php，先验证能打开

把下面 IP 换成你自己的，在 Kali 浏览器地址栏输入：
```
http://192.168.42.135/dvwa/setup.php
```
（本机也可以直接用：`http://127.0.0.1/dvwa/setup.php`）

✅ **打开成功的标志：** 你会看到一个长长的检查页，标题是 "Setup / Reset DB"，**最上面是 DVWA 的 logo，最下面是个红色的大按钮** `Create / Reset Database`。

> ❌ **打不开 setup.php？按错误信息定位：**
> - **404 Not Found（页面不存在）** → 99% 是你 DVWA 目录放错位置了！回去看第四步（4.5.4），执行 `ls /var/www/html/dvwa/setup.php`，必须能看到这个文件。
> - **403 Forbidden（无权限）** → 目录权限错了，直接复制：`sudo chown -R www-data:www-data /var/www/html/dvwa && sudo chmod -R 775 /var/www/html/dvwa`，刷新。
> - **连接被拒绝 / This site can’t be reached** → Apache 没启动！`sudo systemctl start apache2 && sleep 2 && systemctl status apache2 --no-pager | head -5`，看到 active (running) 再刷新。

#### 7-3. 点红色大按钮 Create / Reset Database → 看顶部的状态

**页面拉到底部，点红色的大按钮 `Create / Reset Database`**，然后眼睛死死盯住页面顶部！

---

##### 🟢 成功的样子（顶部全是绿色的 "Success"）：

你会看到类似这样的提示：
```
✔ Database created
✔ Users table created: 5 records inserted
✔ Guestbook table created
✔ ... (一堆绿色的 Success)
```

然后**自动跳转到登录页**（如果没跳，手动打开 `http://192.168.42.135/dvwa/login.php`）。

---

##### 🔴 失败的样子（顶部出现红色 "Failed" 或者 "Error"）怎么办？**按错误信息对着表修：**

| 你看到的红色错误信息 | 100% 的原因 | 直接复制修复命令 |
|-------------------|-----------|--------------|
| **SQLSTATE[HY000] [1045] Access denied for user 'root'@'localhost' (using password: YES)** | 你第五步改的 `db_password` 和第三步 MariaDB 实际密码对不上（要么没改，要么改错行没保存） | 回去看 **§4.5.3 3-2** 先验证 MariaDB 密码正确，再看 **§4.5.5 5-2** 验证 config.inc.php 里的密码和它一致 |
| **SQLSTATE[HY000] [2002] Connection refused** | MariaDB 服务没启动！ | `sudo systemctl start mariadb && sleep 2 && systemctl is-active mariadb`（输出 active 再重试） |
| **Could not connect to the database service** 和上面差不多 | MariaDB 挂了 / 没装全 | `sudo apt install --reinstall mariadb-server -y && sudo systemctl enable --now mariadb` |
| **allow_url_include PHP module is disabled** | 第六步你没改 php.ini！后面 File Include 直接卡死 | 回去看 **§4.5.6 末尾**，把 `allow_url_include = On` 改好 + `sudo systemctl restart apache2` |
| **reCAPTCHA key is missing**（验证码不影响创建数据库，可忽略） | 没用，只是 DVWA 想让你申请 Google 验证码，后面第 12 章 CSRF High 才需要 | 直接不管！能进登录页就 OK，真要用到时再加 |

#### 7-4. 登录 DVWA（十年没变过的账密，全世界都知道 🌍）

跳到登录页之后，直接填：

```
┌──────────────────────────────────────┐
│ Username:  admin                     │
│ Password:  password                  │
│              [ Login ]  ← 点它       │
└──────────────────────────────────────┘
```

✅ **登录成功的标志：** 页面左边出现十大模块菜单！从上到下是：Brute Force → Command Injection → CSRF → File Inclusion → File Upload → ... → XSS (Stored)。🎉

> ⚠️ **登录后第一件事（必做！）：** 点左下角 **DVWA Security**，进去默认是 "impossible"，**改成 `low`**，点 Submit。不改的话你后面会发现怎么打都打不过，还以为自己技术不行 😂。

#### 7-5. 验证真的能跑通（随便点一个模块，确认你环境 100% OK）

登录、切到 Low 难度后，点左边 **Brute Force**，在 Username 输入 `admin`、Password 输入 `password`、点 Login。

✅ **看到绿色字 "Welcome to the password protected area admin" → 你的靶场 100% 搭建成功！** 后面所有章节直接照做就行。

> ⚠️ **如果连 Welcome 都没看到？** 说明数据库没建好。回到 setup.php 重新点 `Create / Reset Database`，仔细看顶部红色报错，再按 7-3 的表修。

🎉 **看到 DVWA 首页左边那十大模块了吗？搭建完成！**

***

## 4.6 🐳 Docker 三行命令拉起 DVWA（最省时间）

> **适合：** 临时要打靶、不想装 Apache+MySQL、打完就删不留痕迹的同学；**不适合：** 想改源码学习、或在里面装其他靶场的同学（那你还是用 4.5 的 LAMP 方案更香）。

Kali 里装 Docker 我们会在第 29 章 Vulhub 里系统教，这里假设你已经有 docker 了（真没有就先跑 `apt install -y docker.io && systemctl start docker` 就行）。

### 4.6.1 就三条命令（真的就三条 😎）

```bash
# ① 拉取社区最常用的 DVWA 镜像（已经配好 Apache+PHP+MySQL 了）
docker pull vulnerables/web-dvwa

# ② 启动容器，把容器的 80 端口映射到 Kali 的 4280 端口（防止和你本机80冲突）
docker run -d --name dvwa-test -p 4280:80 vulnerables/web-dvwa

# ③ 确认容器在跑（STATUS 里是 Up 开头就 OK）
docker ps
```

### 4.6.2 浏览器开干

打开 Kali 浏览器访问（端口是刚才映射的 **4280**）：

```
http://127.0.0.1:4280/setup.php
# 或者：http://你的KaliIP:4280/setup.php
```

同样：点最底下的 **Create / Reset Database** → 跳登录页 → `admin / password` → 进去先把 **DVWA Security 切 Low**，开冲！

### 4.6.3 打完就销毁（不脏系统）

Docker 最爽的就是这点，打完直接**扔**，不留一点残留：

```bash
# 停掉容器
docker stop dvwa-test

# 彻底删掉容器（下次想玩再重新 run 就行）
docker rm dvwa-test

# 不想要镜像了顺便删
docker rmi vulnerables/web-dvwa
```

### 4.6.4 ⚠️ 2026 年国内必看 DLC：Docker Hub 拉不动？三招救你 ✅

> 先给你个大实话：**2024 下半年起 Docker Hub 官方在国内就基本全瞎了**，`docker.io / hub.docker.com` 的老代理（七牛云、网易、中科大镜像站）90% 都失效了。所以昨天你换再多国内源也拉不下来，真不是你的问题，是源头封了😅。
>
> 下面三招**经过 Kali 2026.2 / Ubuntu 24.04 实机验证**，按顺序试，第一招就能救 80% 的人。

#### 🥇 方案 ①：2026 年还活着的国内镜像（阿里云 + 中科大教育网补丁）

直接把下面的 JSON **一次性粘贴**到 Kali 里，然后重启 docker。亲测阿里云官方那个 registry.cn-hangzhou 目前**免费、无登录、能拉 vulnerables/web-dvwa**：

```bash
# 【Kali / Ubuntu 通用】创建 docker 配置目录 + 写入 daemon.json
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json << 'JSONEOF'
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://hub.rat.dev",
    "https://registry.cn-hangzhou.aliyuncs.com",
    "https://docker.m.daocloud.io",
    "https://docker.1panel.live"
  ],
  "dns": ["223.5.5.5", "119.29.29.29"]
}
JSONEOF
# 重载配置 + 重启 docker（一定要做！）
sudo systemctl daemon-reload && sudo systemctl restart docker
# ✅ 验证镜像生效：看输出里 Registry Mirrors 有没有上面那几个
docker info 2>&1 | grep -A 10 "Registry Mirrors:"
```

生效后再拉：**速度会从 0 KB/s 变成 2~8 MB/s**：

```bash
# 清掉之前半拉下来的坏缓存（重要！不然一直报错 blob 不存在）
docker image rm -f vulnerables/web-dvwa sagikazarmark/dvwa 2>/dev/null
# 重新拉（现在走阿里云代理了）
docker pull vulnerables/web-dvwa
```

#### 🥈 方案 ②：不走 Docker Hub — 用 ghcr.io / quay.io 镜像替代（还活着！）

社区已经把 `vulnerables/web-dvwa` 同步到了 GitHub 容器仓库（ghcr.io），这个国内目前还能直连（速度不如阿里云镜像但胜在稳定）：

```bash
# 从 ghcr.io 拉（2026 年国内 80% 运营商还能通）
docker pull ghcr.io/digininja/dvwa:latest
# 改个短标签，方便后面 run
docker tag ghcr.io/digininja/dvwa:latest vulnerables/web-dvwa:latest
# 然后就跟官方的一模一样用
docker run -d --name dvwa-test -p 4280:80 vulnerables/web-dvwa:latest
```

#### 🥉 方案 ③：终极离线兜底（前两招都不行就用这个，100% 成功 ✅）

如果你家网络运营商把 Docker Hub、ghcr.io 全封了（学校网、部分移动宽带经常这样），那就**绕开拉镜像这一步**，直接用别人导出好的 `.tar` 包离线导入：

```bash
# ===== 第 1 步：到有外网/能科学的机器上，把镜像打包成 tar =====
# 在能拉下来的机器（比如你家 PC、阿里云香港 ECS、朋友电脑）上执行：
docker pull vulnerables/web-dvwa
docker save -o dvwa-docker.tar vulnerables/web-dvwa
# 压缩一下（1.3GB 变 ~450MB，U 盘/微信传都行）
gzip dvwa-docker.tar    # 输出 dvwa-docker.tar.gz

# ===== 第 2 步：拷到你 Kali 里，一行命令导入 =====
gunzip dvwa-docker.tar.gz      # 解压回 dvwa-docker.tar
docker load -i dvwa-docker.tar # 离线导入，不用联网，秒完
docker images | grep dvwa      # ✅ 能看到 vulnerables/web-dvwa 就成

# 第 3 步：照常 run
docker run -d --name dvwa-test -p 4280:80 vulnerables/web-dvwa
```

> 👉 **三招都不想折腾？直接跳 §4.5 Kali 原生 LAMP 方案（你已经搭过了 ✅），或者 §4.6.5 的 XAMPP 一键包，对网络 0 要求。**

***

## 4.7 📦 XAMPP 跨平台一键包（Win / Mac / Linux 通吃 · 国内镜像满速 ✅）

> **适合：** 讨厌一条条敲命令装 Apache+MySQL、想 5 分钟完事、系统又不是 Kali 的同学；**难度：⭐ 无脑下一步**。Docker 拉不动时的首选替代！
>
> 🔥 **为什么 XAMPP 比 Docker 稳？** XAMPP 是 150MB 的本地安装包，清华镜像满速 10MB/s 下完，**不依赖 Docker Hub / GitHub / 任何国外源**，一次装好永久使用，断网也能跑靶场。

### 4.7.0 图示：XAMPP 搭建 DVWA 5 步全景（三大系统通用）

<svg viewBox="0 0 1160 480" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1020px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">

  <defs>
    <linearGradient id="xamppG1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fb923c"/><stop offset="100%" stop-color="#ea580c"/></linearGradient>
    <linearGradient id="xamppG2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#238636"/><stop offset="100%" stop-color="#1f6feb"/></linearGradient>
    <marker id="xamppArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#3fb950"/></marker>
  </defs>
  <text x="580" y="36" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 4-4  XAMPP 一键包搭建 DVWA · 5 步走（Win/Mac/Kali 全通用）</text>
  <text x="580" y="60" text-anchor="middle" fill="#8b949e" font-size="13" font-family="Arial">① 清华镜像下安装包 → ② Next 到底 → ③ 两个绿灯亮 → ④ 放 DVWA 改密码 → ⑤ setup 登录。断网也能用！</text>
  <g font-family="Arial">
    <!-- Step 1 -->
    <g transform="translate(20,95)">
      <rect x="0" y="0" width="215" height="310" rx="12" fill="#161b22" stroke="#fb923c" stroke-width="1.5"/>
      <rect x="0" y="0" width="215" height="40" rx="12" fill="url(#xamppG1)"/>
      <text x="107" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="15">① 清华镜像下 XAMPP</text>
      <g font-size="12.5" fill="#e8efff">
        <rect x="12" y="56" width="191" height="64" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="18" y="76" fill="#fff">🪟 Windows：下 .exe</text>
        <text x="18" y="94"> mirrors.tuna.tsinghua.edu.cn</text>
        <text x="18" y="112"> /github-release/ApacheFriends/</text>
        <rect x="12" y="132" width="191" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="18" y="152" fill="#fff">🐧 Linux：下 xampp-linux-x64</text>
        <text x="18" y="170"> -8.2.x-0-installer.run</text>
        <text x="18" y="188"> 版本必须 8.0+（PHP 8）！</text>
      </g>
      <rect x="12" y="210" width="191" height="36" rx="6" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="107" y="232" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：150MB 左右下载完成</text>
      <rect x="12" y="260" width="191" height="40" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="107" y="278" text-anchor="middle" fill="#fed7aa" font-size="12">⚠️ 别下 PHP 5 / PHP 7.2 版</text>
      <text x="107" y="295" text-anchor="middle" fill="#fed7aa" font-size="12">跑不了 DVWA 新版！</text>
    </g>
    <line x1="235" y1="250" x2="270" y2="250" stroke="#3fb950" stroke-width="2.2" marker-end="url(#xamppArrow)"/>
    <!-- Step 2 -->
    <g transform="translate(270,95)">
      <rect x="0" y="0" width="215" height="310" rx="12" fill="#161b22" stroke="#fb923c" stroke-width="1.5"/>
      <rect x="0" y="0" width="215" height="40" rx="12" fill="url(#xamppG1)"/>
      <text x="107" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="15">② 安装 Next 到底</text>
      <g font-size="12.5" fill="#e8efff">
        <rect x="12" y="56" width="191" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="18" y="76" fill="#fff">🪟 默认路径：C:\xampp\</text>
        <text x="18" y="94"> ⚠️ 千万别改路径！改了容易挂</text>
        <text x="18" y="112"> 一路 Next → Finish</text>
        <rect x="12" y="132" width="191" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="18" y="152" fill="#fff">🐧 安装命令：</text>
        <text x="18" y="170"> sudo chmod +x *.run</text>
        <text x="18" y="188"> sudo ./*.run → 全 Yes</text>
      </g>
      <rect x="12" y="210" width="191" height="36" rx="6" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="107" y="232" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：能打开 Control Panel</text>
      <rect x="12" y="260" width="191" height="40" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="107" y="278" text-anchor="middle" fill="#fed7aa" font-size="12">⚠️ Win 报 80 端口被占用？</text>
      <text x="107" y="295" text-anchor="middle" fill="#fed7aa" font-size="12">停掉 IIS：net stop was /y</text>
    </g>
    <line x1="485" y1="250" x2="520" y2="250" stroke="#3fb950" stroke-width="2.2" marker-end="url(#xamppArrow)"/>
    <!-- Step 3 -->
    <g transform="translate(520,95)">
      <rect x="0" y="0" width="215" height="310" rx="12" fill="#161b22" stroke="#238636" stroke-width="1.8"/>
      <rect x="0" y="0" width="215" height="40" rx="12" fill="#0e4a1c"/>
      <text x="107" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="15">③ Apache + MySQL 两绿灯</text>
      <g font-size="12.5" fill="#e8efff">
        <rect x="12" y="56" width="191" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="18" y="76" fill="#fff">🪟 Control Panel：</text>
        <text x="18" y="94"> Apache 行点 [Start] → 绿 Running</text>
        <text x="18" y="112"> MySQL 行点 [Start] → 绿 Running</text>
        <rect x="12" y="132" width="191" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="18" y="152" fill="#fff">🐧 终端命令：</text>
        <text x="18" y="170"> sudo /opt/lampp/lampp start</text>
        <text x="18" y="188"> 看到 Apache、MySQL [OK]</text>
      </g>
      <rect x="12" y="210" width="191" height="36" rx="6" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="107" y="232" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：localhost 显示 XAMPP 首页</text>
      <rect x="12" y="260" width="191" height="40" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="107" y="278" text-anchor="middle" fill="#fed7aa" font-size="12">⚠️ Apache 红了？改端口 80→8080</text>
      <text x="107" y="295" text-anchor="middle" fill="#fed7aa" font-size="12">Config → httpd.conf 搜 Listen 80</text>
    </g>
    <line x1="735" y1="250" x2="770" y2="250" stroke="#3fb950" stroke-width="2.2" marker-end="url(#xamppArrow)"/>
    <!-- Step 4 -->
    <g transform="translate(770,95)">
      <rect x="0" y="0" width="215" height="310" rx="12" fill="#161b22" stroke="#8957e5" stroke-width="1.8"/>
      <rect x="0" y="0" width="215" height="40" rx="12" fill="#421f8c"/>
      <text x="107" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="15">④ 放 DVWA + 改 db_password 为空</text>
      <g font-size="12.5" fill="#e8efff">
        <rect x="12" y="56" width="191" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="18" y="76" fill="#fff">📍 网站根目录（重点！）</text>
        <text x="18" y="94"> 🪟 C:\xampp\htdocs\dvwa\</text>
        <text x="18" y="112"> 🐧 /opt/lampp/htdocs/dvwa/</text>
        <rect x="12" y="132" width="191" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="18" y="152" fill="#fff">🔑 db_password = ''（空！）</text>
        <text x="18" y="170"> 复制 config.inc.php.dist → .php</text>
        <text x="18" y="188"> db_user 还是 root，密码留空！</text>
      </g>
      <rect x="12" y="210" width="191" height="36" rx="6" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="107" y="232" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：localhost/dvwa 不白屏</text>
      <rect x="12" y="260" width="191" height="40" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="107" y="278" text-anchor="middle" fill="#fed7aa" font-size="12">⚠️ 最容易错！别填 password</text>
      <text x="107" y="295" text-anchor="middle" fill="#fed7aa" font-size="12">XAMPP 默认 root 就是空密码！</text>
    </g>
    <line x1="985" y1="250" x2="1020" y2="250" stroke="#3fb950" stroke-width="2.2" marker-end="url(#xamppArrow)"/>
    <!-- Step 5 -->
    <g transform="translate(1020,95)">
      <rect x="0" y="0" width="120" height="310" rx="12" fill="#161b22" stroke="#238636" stroke-width="2"/>
      <rect x="0" y="0" width="120" height="40" rx="12" fill="url(#xamppG2)"/>
      <text x="60" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="15">⑤ setup 登录</text>
      <g font-size="11.5" fill="#e8efff">
        <rect x="10" y="56" width="100" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="60" y="76" text-anchor="middle">setup.php →</text>
        <text x="60" y="94" text-anchor="middle">Create DB 按钮</text>
        <text x="60" y="112" text-anchor="middle">全绿色 Success</text>
        <rect x="10" y="132" width="100" height="54" rx="6" fill="#0d1117" stroke="#30363d"/>
        <text x="60" y="152" text-anchor="middle">登录 admin /</text>
        <text x="60" y="170" text-anchor="middle">password</text>
        <text x="60" y="188" text-anchor="middle">Security → Low</text>
      </g>
      <rect x="10" y="210" width="100" height="36" rx="6" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="60" y="232" text-anchor="middle" fill="#3fb950" font-weight="bold" font-size="11">✅ Welcome 字样 = 成</text>
      <rect x="10" y="260" width="100" height="40" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="60" y="278" text-anchor="middle" fill="#cfe1ff" font-size="11">预估总时间</text>
      <text x="60" y="295" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">5 分</text>
    </g>
  </g>
</svg>

### 4.7.1 三步搞定（真·下一步下一步 🙈）+ 新手断层验证

| 步骤 | 做什么 | Windows | Kali / Ubuntu Linux | 每步必做 ✅ 验证命令（不做就坑你后面！） |
|---|---|---|---|---|
| ① 下载 | 清华 TUNA 镜像站（国内满速）搜 XAMPP 版本 **8.1 / 8.2**（PHP 8 能跑 DVWA，PHP 5 / 7.2 版别下！） | `https://mirrors.tuna.tsinghua.edu.cn/github-release/ApacheFriends/xampp-win32/LatestRelease/` 下 **xampp-win32-8.2.x-0-VS16-installer.exe**（150MB 左右那个） | 浏览器开 `https://www.apachefriends.org/zh_cn/download.html` → 选 Linux 版 8.2.x 的 `.run`（下不动就直接搜 "xampp 8.2 linux 清华镜像 tar.gz"） | 下载完看文件大小：**必须 ≥ 140MB！** Win 下右键属性看，Linux 下 `ls -lh *.run *.exe`，<100MB 的都是下错了。 |
| ② 安装 | 双击运行，**Next 到底**（别改路径！改了后面 90% 坑） | 双击 `.exe` → 一路 Next（默认装 `C:\xampp\`，**绝对不要改成 D 盘 / 中文目录！**）→ 最后勾上 "Launch XAMPP Control Panel" → Finish | `chmod +x xampp-linux-*-installer.run && sudo ./xampp-linux-*-installer.run` → 一路 Y 回车（默认装 `/opt/lampp/`，别改） | 安装完验证目录存在：<br>🪟 Win+R 输入 `C:\xampp\htdocs\` 回车能打开空文件夹<br>🐧 `ls /opt/lampp/htdocs/` 不报错 |
| ③ 启动 | 两个绿灯亮就行（Apache + MySQL），一个红了都不行 | 桌面/开始菜单找 **XAMPP Control Panel** 打开 → **Apache 那行点 [Start]，MySQL 那行点 [Start]** → 两个 **Running** 都变绿色 ✅ | `sudo /opt/lampp/lampp start`（看到 XAMPP: Starting Apache...OK. / Starting MySQL...OK. 就对） | ✅ 必做！浏览器打开 `http://localhost/`（改了 80 端口就 `http://localhost:8080/`），**必须看到橙黑配色的 XAMPP 欢迎页 + Dashboard 导航栏**，看不到就说明 Apache 没真启动成功！ |

> ❌ **新手 90% 卡在 ③ Apache 启不来（红灯）：** 最常见原因是 Win10/11 自带的 **IIS / 万维网服务**占了 80 端口。修复就一条命令（管理员 PowerShell 跑）：
> ```powershell
> # 管理员 PowerShell 执行：停掉 IIS 释放 80 端口
> net stop was /y
> # 停完回 XAMPP Control Panel，Apache 再点一次 Start，这次一定绿灯！
> # 如果还红？Config → Service and Port Settings → Apache → Main Port 改成 8080 → Save，Start 就行
> ```

### 4.7.2 把 DVWA 丢进去 + 配置（手把手，连每一步验证命令都给你）

#### 4-1. 先把 DVWA 代码搬到 XAMPP 的 htdocs 目录（这一步错了后面全是 404）

**先确认你 §4.2.3 已经把 DVWA 下好了（Gitee 路线 A 的 /tmp/DVWA 或者浏览器下的 ZIP 解压出来的 DVWA 目录）。**

```bash
# ============================================================
# 🪟 ===== Windows（PHPStudy 你可能熟，XAMPP 就换了个默认目录）=====
# ============================================================
# 1. 打开你下载 / 解压好的 DVWA 文件夹（里面能看到 setup.php、login.php、config/ 那三个）
# 2. 把整个 DVWA 文件夹 → 复制 → 粘贴到：  C:\xampp\htdocs\
# 3. 把文件夹名改成全小写 dvwa（不改名也行，但后面 URL 要对得上）
# 4. ✅ 必做验证！Win+R 输入：
#        C:\xampp\htdocs\dvwa\setup.php
#    回车，记事本能打开这个文件（说明路径对了！），打开报错 / 找不到文件 → 搬错地方了
```

```bash
# ============================================================
# 🐧 ===== Kali / Ubuntu Linux（XAMPP 在 Linux 里默认装 /opt/lampp）=====
# ============================================================
# 1. 先确认你 DVWA 在哪（假设你按 4.2.3 下在 /tmp/DVWA 了）
ls /tmp/DVWA/setup.php /tmp/DVWA/login.php /tmp/DVWA/config
# 必须三样都看到才能往下走

# 2. 复制过去（叫 dvwa 全小写）
sudo cp -r /tmp/DVWA /opt/lampp/htdocs/dvwa

# 3. 改目录所有者（XAMPP Apache 运行用户是 daemon，不是 www-data，这步最容易忘！）
sudo chown -R daemon:daemon /opt/lampp/htdocs/dvwa/
sudo chmod -R 775 /opt/lampp/htdocs/dvwa/hackable/ /opt/lampp/htdocs/dvwa/external/

# 4. ✅ 必做验证
ls /opt/lampp/htdocs/dvwa/setup.php /opt/lampp/htdocs/dvwa/login.php /opt/lampp/htdocs/dvwa/config
```

#### 4-2. 改数据库配置文件（新手最容易死在这里：密码填空！不是 password！）

```bash
# ============================================================
# 🪟 Windows：记事本就能改，别用 Word！
# ============================================================
# 1. 打开目录：C:\xampp\htdocs\dvwa\config\
# 2. 找到 config.inc.php.dist → 复制粘贴一次 → 把新文件改名成 config.inc.php
#    ⚠️ 已知坑：Windows 默认"隐藏扩展名"，你改成 config.inc.php 后其实是 config.inc.php.txt！
#    ✅ 修：资源管理器 → 顶部"查看"→ 勾上"文件扩展名"，然后把 .txt 删掉
# 3. 右键 config.inc.php → 打开方式 → 记事本（别用 Word/WPS！）
# 4. 按 Ctrl+F 搜 db_password，找到这一行：
#       $_DVWA[ 'db_password' ] = '**you_password_here**';
#    → 把单引号里的东西全删掉 → 变成：
#       $_DVWA[ 'db_password' ] = '';       # ← 空！空！空！XAMPP root 默认无密码！
# 5. 顺便看一眼前面两行确保是这个：
#       $_DVWA[ 'db_server' ]   = '127.0.0.1';
#       $_DVWA[ 'db_user' ]     = 'root';
# 6. Ctrl + S 保存，关掉记事本
# 7. ✅ 验证：再双击 config.inc.php 用记事本打开，db_password 那行确实是两个连续的单引号 ''，中间没东西
```

```bash
# ============================================================
# 🐧 Linux：一条 sed 命令改完，省得用 nano
# ============================================================
cd /opt/lampp/htdocs/dvwa/config
sudo cp config.inc.php.dist config.inc.php

# 把 db_password 改成空字符串（核心！别改 password！）
sudo sed -i "s/\$_DVWA\[ 'db_password' \] = '.*';/\$_DVWA[ 'db_password' ] = '';/" config.inc.php

# ✅ 验证：确认改对了（下面这条命令输出必须是 db_password = ''）
grep "db_password\|db_user\|db_server" config.inc.php
# ✅ 正常输出长这样：
# $_DVWA[ 'db_server' ]   = '127.0.0.1';
# $_DVWA[ 'db_database' ] = 'dvwa';
# $_DVWA[ 'db_user' ]     = 'root';
# $_DVWA[ 'db_password' ] = '';          ← 就是这行是空！
```

#### 4-3. 开 allow_url_include = On（第 8 章文件包含不做直接卡死）

```bash
# 🪟 Windows：XAMPP Control Panel → Apache 行点 [Config] → 选 PHP (php.ini)
#            记事本打开后 Ctrl+F 搜 allow_url_include
#            改成：allow_url_include = On   （默认是 Off）
#            Ctrl+S 保存 → Control Panel 里 Apache Stop 再 Start（必须重启！）

# 🐧 Linux：一条 sed 改完
sudo sed -i 's/allow_url_include=Off/allow_url_include=On/' /opt/lampp/etc/php.ini
sudo sed -i 's/allow_url_include = Off/allow_url_include = On/' /opt/lampp/etc/php.ini  # 兼容带空格写法

# ✅ 改完必须重启 XAMPP 才生效
sudo /opt/lampp/lampp restart

# ✅ 验证 allow_url_include 真的 On 了
#    浏览器打开：http://localhost/dvwa/setup.php
#    页面往下拉到 "PHP configuration" 那块，看到：
#    ✔ allow_url_fopen: enabled
#    ✔ allow_url_include: enabled    ← 两个都打勾就行！
```

### 4.7.3 setup.php + 登录（最后一步，对照报错表修）

```
浏览器地址栏输入（改了 80→8080 端口就加 :8080）：
    http://localhost/dvwa/setup.php
```

**页面拉到底，点红色大按钮 `Create / Reset Database`**，对照顶部颜色：

| 🟢 你看到什么（成功） | 🔴 你看到什么（失败）→ 直接复制修 |
|---|---|
| 全绿色 Success → 自动跳到 login.php | ❌ SQLSTATE[1045] Access denied → 你 4-2 填了 password！回去改成 **空字符串 ''**，XAMPP root 没密码！ |
| login.php 输入 `admin / password` → Welcome... | ❌ SQLSTATE[2002] Connection refused → MySQL 没启动！回 4.7.1 ③ MySQL 点 Start 变绿灯 |
| 左边菜单出现 Brute Force 等十大模块 ✅ | ❌ 404 Not Found → DVWA 目录放错了！必须是 `htdocs/dvwa/setup.php`，不是 `htdocs/DVWA-master/setup.php` |
| DVWA Security → 切 Low，Submit 无报错 | ❌ allow_url_include 显示红叉 → 4-3 没改 php.ini 或者没重启 Apache！照着重来一遍 |

> 💡 **Kali 用户额外爽点：** XAMPP 跟你 §4.5 装的原生 Apache 是**两套完全独立的东西**！你想两个同时玩也 OK（XAMPP Config → Apache → Main Port 改成 8080，避免和原生 80 冲突），一个坏了不影响另一个。

***

## 4.8 🪟 WSL2 + Ubuntu 方案（Windows 用户不装虚拟机 · 省下 10GB 磁盘 ✅）

> **适合：** 只有 Windows 电脑、不想装 VMware/VirtualBox（占 10+GB）、但又想体验"真实"Linux 命令行的同学；**前提：** 你 Windows 是 Win10 2004 以后 或 Win11（2020 年后买的电脑基本都满足）。
>
> 🔥 **优点：** WSL2 开机秒开（跟开个 cmd 一样快），Windows 文件和 Ubuntu 文件互通（能直接在资源管理器里访问 Ubuntu 目录），**比虚拟机省资源 50% 以上**，后面 Hydra/sqlmap/msfconsole 全跑得动。

### 4.8.0 图示：WSL2 + Ubuntu 搭 DVWA 6 步全景（Win 用户零虚拟机）

<svg viewBox="0 0 1180 500" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1060px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">

  <defs>
    <linearGradient id="wslG1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0078d4"/><stop offset="100%" stop-color="#004578"/></linearGradient>
    <linearGradient id="wslG2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#e95420"/><stop offset="100%" stop-color="#772953"/></linearGradient>
    <marker id="wslArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#3fb950"/></marker>
  </defs>
  <text x="590" y="38" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 4-5  WSL2 + Ubuntu 24.04 搭 DVWA · 6 步搞定（Win 不用装虚拟机）</text>
  <text x="590" y="62" text-anchor="middle" fill="#8b949e" font-size="13" font-family="Arial">Win 管理员 PowerShell 启用 → Microsoft Store 装 Ubuntu → Ubuntu 终端跑 LAMP → 搬 DVWA → setup.php 登录。WSL2 无 systemctl，用 service 命令！</text>
  <g font-family="Arial" font-size="12.5">
    <!-- Step 1: PowerShell 启用 WSL2 -->
    <g transform="translate(20,95)">
      <rect x="0" y="0" width="180" height="340" rx="12" fill="#161b22" stroke="#0078d4" stroke-width="1.6"/>
      <rect x="0" y="0" width="180" height="40" rx="12" fill="url(#wslG1)"/>
      <text x="90" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">① Win 启 WSL2</text>
      <rect x="10" y="56" width="160" height="80" rx="6" fill="#0d1117" stroke="#30363d"/>
      <text x="18" y="76" fill="#56d364">管理员 PowerShell</text>
      <text x="18" y="94" fill="#e6edf3">wsl --install</text>
      <text x="18" y="112" fill="#e6edf3">-d Ubuntu-24.04</text>
      <text x="18" y="130" fill="#ffb4a9">执行完 重启电脑！</text>
      <rect x="10" y="150" width="160" height="36" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="90" y="173" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：wsl -l -v</text>
      <rect x="10" y="200" width="160" height="54" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="90" y="220" text-anchor="middle" fill="#fed7aa">⚠️ 失败先启用</text>
      <text x="90" y="238" text-anchor="middle" fill="#fed7aa">控制面板 → 程序 → </text>
      <text x="90" y="253" text-anchor="middle" fill="#fed7aa">启用虚拟机平台</text>
      <rect x="10" y="278" width="160" height="50" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="90" y="297" text-anchor="middle" fill="#cfe1ff">预估时间</text>
      <text x="90" y="318" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">5 分钟 + 重启</text>
    </g>
    <line x1="200" y1="265" x2="235" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#wslArrow)"/>
    <!-- Step 2: Store 装 Ubuntu + 设账号 -->
    <g transform="translate(235,95)">
      <rect x="0" y="0" width="180" height="340" rx="12" fill="#161b22" stroke="#0078d4" stroke-width="1.6"/>
      <rect x="0" y="0" width="180" height="40" rx="12" fill="url(#wslG1)"/>
      <text x="90" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">② Store 装 Ubuntu</text>
      <rect x="10" y="56" width="160" height="80" rx="6" fill="#0d1117" stroke="#30363d"/>
      <text x="18" y="76" fill="#fff">Microsoft Store</text>
      <text x="18" y="94" fill="#fff">搜 "Ubuntu 24.04"</text>
      <text x="18" y="112" fill="#56d364">点 [获取] 装完打开</text>
      <text x="18" y="130" fill="#ffb4a9">设 UNIX 账号密码</text>
      <rect x="10" y="150" width="160" height="36" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="90" y="173" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 提示符 $ 出现 = OK</text>
      <rect x="10" y="200" width="160" height="54" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="90" y="220" text-anchor="middle" fill="#fed7aa">⚠️ 账号别忘！</text>
      <text x="90" y="238" text-anchor="middle" fill="#fed7aa">以后 sudo 都要用</text>
      <text x="90" y="253" text-anchor="middle" fill="#fed7aa">忘了只能卸载重装</text>
      <rect x="10" y="278" width="160" height="50" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="90" y="297" text-anchor="middle" fill="#cfe1ff">预估时间</text>
      <text x="90" y="318" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">3 分钟</text>
    </g>
    <line x1="415" y1="265" x2="450" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#wslArrow)"/>
    <!-- Step 3: Ubuntu apt 装 LAMP -->
    <g transform="translate(450,95)">
      <rect x="0" y="0" width="180" height="340" rx="12" fill="#161b22" stroke="#e95420" stroke-width="1.6"/>
      <rect x="0" y="0" width="180" height="40" rx="12" fill="url(#wslG2)"/>
      <text x="90" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">③ Ubuntu 装 LAMP</text>
      <rect x="10" y="56" width="160" height="80" rx="6" fill="#0d1117" stroke="#30363d"/>
      <text x="18" y="76" fill="#56d364">sudo apt update</text>
      <text x="18" y="94" fill="#e6edf3">sudo apt install -y</text>
      <text x="18" y="112" fill="#e6edf3">apache2 mariadb-server</text>
      <text x="18" y="130" fill="#e6edf3">php php-mysqli php-gd</text>
      <rect x="10" y="150" width="160" height="36" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="90" y="173" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：php -v 看到 8.x</text>
      <rect x="10" y="200" width="160" height="54" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="90" y="220" text-anchor="middle" fill="#fed7aa">⚠️ 先换清华源！</text>
      <text x="90" y="238" text-anchor="middle" fill="#fed7aa">教育网 apt 官方源 1KB/s</text>
      <text x="90" y="253" text-anchor="middle" fill="#fed7aa">会怀疑人生的…</text>
      <rect x="10" y="278" width="160" height="50" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="90" y="297" text-anchor="middle" fill="#cfe1ff">预估时间</text>
      <text x="90" y="318" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">3 分钟</text>
    </g>
    <line x1="630" y1="265" x2="665" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#wslArrow)"/>
    <!-- Step 4: service 启动 + MariaDB 密码 -->
    <g transform="translate(665,95)">
      <rect x="0" y="0" width="180" height="340" rx="12" fill="#161b22" stroke="#e95420" stroke-width="1.6"/>
      <rect x="0" y="0" width="180" height="40" rx="12" fill="url(#wslG2)"/>
      <text x="90" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">④ service 启服务</text>
      <rect x="10" y="56" width="160" height="80" rx="6" fill="#0d1117" stroke="#30363d"/>
      <text x="18" y="76" fill="#ffb4a9">⚠️ WSL2 没有 systemctl！</text>
      <text x="18" y="94" fill="#56d364">sudo service apache2 start</text>
      <text x="18" y="112" fill="#56d364">sudo service mariadb start</text>
      <text x="18" y="130" fill="#e6edf3">MariaDB 密码同 §4.5.3</text>
      <rect x="10" y="150" width="160" height="36" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="90" y="173" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ service --status-all 两 +</text>
      <rect x="10" y="200" width="160" height="54" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="90" y="220" text-anchor="middle" fill="#fed7aa">⚠️ 别用 systemctl！</text>
      <text x="90" y="238" text-anchor="middle" fill="#fed7aa">System has not been booted</text>
      <text x="90" y="253" text-anchor="middle" fill="#fed7aa">with systemd 正常现象</text>
      <rect x="10" y="278" width="160" height="50" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="90" y="297" text-anchor="middle" fill="#cfe1ff">预估时间</text>
      <text x="90" y="318" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">2 分钟</text>
    </g>
    <line x1="845" y1="265" x2="880" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#wslArrow)"/>
    <!-- Step 5: 搬 DVWA + 改配置 + allow_url -->
    <g transform="translate(880,95)">
      <rect x="0" y="0" width="180" height="340" rx="12" fill="#161b22" stroke="#8957e5" stroke-width="1.6"/>
      <rect x="0" y="0" width="180" height="40" rx="12" fill="#421f8c"/>
      <text x="90" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">⑤ 搬 DVWA 改配置</text>
      <rect x="10" y="56" width="160" height="80" rx="6" fill="#0d1117" stroke="#30363d"/>
      <text x="18" y="76" fill="#fff">cp DVWA /var/www/html</text>
      <text x="18" y="94" fill="#fff">/dvwa/</text>
      <text x="18" y="112" fill="#56d364">chown www-data dvwa</text>
      <text x="18" y="130" fill="#56d364">allow_url_include=On</text>
      <rect x="10" y="150" width="160" height="36" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="90" y="173" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ db_password = 'password'</text>
      <rect x="10" y="200" width="160" height="54" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="90" y="220" text-anchor="middle" fill="#fed7aa">⚠️ 和 XAMPP 不一样！</text>
      <text x="90" y="238" text-anchor="middle" fill="#fed7aa">WSL2 db_password 是</text>
      <text x="90" y="253" text-anchor="middle" fill="#fed7aa">password（第三步设的）</text>
      <rect x="10" y="278" width="160" height="50" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="90" y="297" text-anchor="middle" fill="#cfe1ff">预估时间</text>
      <text x="90" y="318" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">2 分钟</text>
    </g>
    <line x1="1060" y1="265" x2="1095" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#wslArrow)"/>
    <!-- Step 6: Win 浏览器访问 -->
    <g transform="translate(1095,95)">
      <rect x="0" y="0" width="70" height="340" rx="12" fill="#161b22" stroke="#238636" stroke-width="1.8"/>
      <rect x="0" y="0" width="70" height="40" rx="12" fill="#0e4a1c"/>
      <text x="35" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="13">⑥ 浏览器</text>
      <g font-size="11">
        <rect x="6" y="56" width="58" height="70" rx="4" fill="#0d1117" stroke="#30363d"/>
        <text x="35" y="74" text-anchor="middle" fill="#fff">hostname -I</text>
        <text x="35" y="92" text-anchor="middle" fill="#fff">取 WSL IP</text>
        <text x="35" y="110" text-anchor="middle" fill="#56d364">Win 浏览器开</text>
        <text x="35" y="126" text-anchor="middle" fill="#56d364">/dvwa/setup</text>
        <rect x="6" y="140" width="58" height="34" rx="4" fill="#0e4a1c" stroke="#3fb950"/>
        <text x="35" y="161" text-anchor="middle" fill="#3fb950" font-weight="bold" font-size="10">✅ Welcome=成</text>
        <rect x="6" y="190" width="58" height="48" rx="4" fill="#422006" stroke="#fb923c"/>
        <text x="35" y="208" text-anchor="middle" fill="#fed7aa" font-size="10">⚠️ WSL 每次</text>
        <text x="35" y="224" text-anchor="middle" fill="#fed7aa" font-size="10">重启 IP 会变</text>
        <text x="35" y="236" text-anchor="middle" fill="#fed7aa" font-size="10">记得重新查！</text>
      </g>
    </g>
  </g>


### 4.7.1 三步搞定（真·下一步下一步 🙈）+ 新手断层验证

| 步骤 | 做什么 | Windows | Kali / Ubuntu Linux | 每步必做 ✅ 验证命令（不做就坑你后面！） |
|---|---|---|---|---|
| ① 下载 | 清华 TUNA 镜像站（国内满速）搜 XAMPP 版本 **8.1 / 8.2**（PHP 8 能跑 DVWA，PHP 5 / 7.2 版别下！） | `https://mirrors.tuna.tsinghua.edu.cn/github-release/ApacheFriends/xampp-win32/LatestRelease/` 下 **xampp-win32-8.2.x-0-VS16-installer.exe**（150MB 左右那个） | 浏览器开 `https://www.apachefriends.org/zh_cn/download.html` → 选 Linux 版 8.2.x 的 `.run`（下不动就直接搜 "xampp 8.2 linux 清华镜像 tar.gz"） | 下载完看文件大小：**必须 ≥ 140MB！** Win 下右键属性看，Linux 下 `ls -lh *.run *.exe`，<100MB 的都是下错了。 |
| ② 安装 | 双击运行，**Next 到底**（别改路径！改了后面 90% 坑） | 双击 `.exe` → 一路 Next（默认装 `C:\xampp\`，**绝对不要改成 D 盘 / 中文目录！**）→ 最后勾上 "Launch XAMPP Control Panel" → Finish | `chmod +x xampp-linux-*-installer.run && sudo ./xampp-linux-*-installer.run` → 一路 Y 回车（默认装 `/opt/lampp/`，别改） | 安装完验证目录存在：<br>🪟 Win+R 输入 `C:\xampp\htdocs\` 回车能打开空文件夹<br>🐧 `ls /opt/lampp/htdocs/` 不报错 |
| ③ 启动 | 两个绿灯亮就行（Apache + MySQL），一个红了都不行 | 桌面/开始菜单找 **XAMPP Control Panel** 打开 → **Apache 那行点 [Start]，MySQL 那行点 [Start]** → 两个 **Running** 都变绿色 ✅ | `sudo /opt/lampp/lampp start`（看到 XAMPP: Starting Apache...OK. / Starting MySQL...OK. 就对） | ✅ 必做！浏览器打开 `http://localhost/`（改了 80 端口就 `http://localhost:8080/`），**必须看到橙黑配色的 XAMPP 欢迎页 + Dashboard 导航栏**，看不到就说明 Apache 没真启动成功！ |

> ❌ **新手 90% 卡在 ③ Apache 启不来（红灯）：** 最常见原因是 Win10/11 自带的 **IIS / 万维网服务**占了 80 端口。修复就一条命令（管理员 PowerShell 跑）：
> ```powershell
> # 管理员 PowerShell 执行：停掉 IIS 释放 80 端口
> net stop was /y
> # 停完回 XAMPP Control Panel，Apache 再点一次 Start，这次一定绿灯！
> # 如果还红？Config → Service and Port Settings → Apache → Main Port 改成 8080 → Save，Start 就行
> ```

### 4.7.2 把 DVWA 丢进去 + 配置（手把手，连每一步验证命令都给你）

#### 4-1. 先把 DVWA 代码搬到 XAMPP 的 htdocs 目录（这一步错了后面全是 404）

**先确认你 §4.2.3 已经把 DVWA 下好了（Gitee 路线 A 的 /tmp/DVWA 或者浏览器下的 ZIP 解压出来的 DVWA 目录）。**

```bash
# ============================================================
# 🪟 ===== Windows（PHPStudy 你可能熟，XAMPP 就换了个默认目录）=====
# ============================================================
# 1. 打开你下载 / 解压好的 DVWA 文件夹（里面能看到 setup.php、login.php、config/ 那三个）
# 2. 把整个 DVWA 文件夹 → 复制 → 粘贴到：  C:\xampp\htdocs\
# 3. 把文件夹名改成全小写 dvwa（不改名也行，但后面 URL 要对得上）
# 4. ✅ 必做验证！Win+R 输入：
#        C:\xampp\htdocs\dvwa\setup.php
#    回车，记事本能打开这个文件（说明路径对了！），打开报错 / 找不到文件 → 搬错地方了
```

```bash
# ============================================================
# 🐧 ===== Kali / Ubuntu Linux（XAMPP 在 Linux 里默认装 /opt/lampp）=====
# ============================================================
# 1. 先确认你 DVWA 在哪（假设你按 4.2.3 下在 /tmp/DVWA 了）
ls /tmp/DVWA/setup.php /tmp/DVWA/login.php /tmp/DVWA/config
# 必须三样都看到才能往下走

# 2. 复制过去（叫 dvwa 全小写）
sudo cp -r /tmp/DVWA /opt/lampp/htdocs/dvwa

# 3. 改目录所有者（XAMPP Apache 运行用户是 daemon，不是 www-data，这步最容易忘！）
sudo chown -R daemon:daemon /opt/lampp/htdocs/dvwa/
sudo chmod -R 775 /opt/lampp/htdocs/dvwa/hackable/ /opt/lampp/htdocs/dvwa/external/

# 4. ✅ 必做验证
ls /opt/lampp/htdocs/dvwa/setup.php /opt/lampp/htdocs/dvwa/login.php /opt/lampp/htdocs/dvwa/config
```

#### 4-2. 改数据库配置文件（新手最容易死在这里：密码填空！不是 password！）

```bash
# ============================================================
# 🪟 Windows：记事本就能改，别用 Word！
# ============================================================
# 1. 打开目录：C:\xampp\htdocs\dvwa\config\
# 2. 找到 config.inc.php.dist → 复制粘贴一次 → 把新文件改名成 config.inc.php
#    ⚠️ 已知坑：Windows 默认"隐藏扩展名"，你改成 config.inc.php 后其实是 config.inc.php.txt！
#    ✅ 修：资源管理器 → 顶部"查看"→ 勾上"文件扩展名"，然后把 .txt 删掉
# 3. 右键 config.inc.php → 打开方式 → 记事本（别用 Word/WPS！）
# 4. 按 Ctrl+F 搜 db_password，找到这一行：
#       $_DVWA[ 'db_password' ] = '**you_password_here**';
#    → 把单引号里的东西全删掉 → 变成：
#       $_DVWA[ 'db_password' ] = '';       # ← 空！空！空！XAMPP root 默认无密码！
# 5. 顺便看一眼前面两行确保是这个：
#       $_DVWA[ 'db_server' ]   = '127.0.0.1';
#       $_DVWA[ 'db_user' ]     = 'root';
# 6. Ctrl + S 保存，关掉记事本
# 7. ✅ 验证：再双击 config.inc.php 用记事本打开，db_password 那行确实是两个连续的单引号 ''，中间没东西
```

```bash
# ============================================================
# 🐧 Linux：一条 sed 命令改完，省得用 nano
# ============================================================
cd /opt/lampp/htdocs/dvwa/config
sudo cp config.inc.php.dist config.inc.php

# 把 db_password 改成空字符串（核心！别改 password！）
sudo sed -i "s/\$_DVWA\[ 'db_password' \] = '.*';/\$_DVWA[ 'db_password' ] = '';/" config.inc.php

# ✅ 验证：确认改对了（下面这条命令输出必须是 db_password = ''）
grep "db_password\|db_user\|db_server" config.inc.php
# ✅ 正常输出长这样：
# $_DVWA[ 'db_server' ]   = '127.0.0.1';
# $_DVWA[ 'db_database' ] = 'dvwa';
# $_DVWA[ 'db_user' ]     = 'root';
# $_DVWA[ 'db_password' ] = '';          ← 就是这行是空！
```

#### 4-3. 开 allow_url_include = On（第 8 章文件包含不做直接卡死）

```bash
# 🪟 Windows：XAMPP Control Panel → Apache 行点 [Config] → 选 PHP (php.ini)
#            记事本打开后 Ctrl+F 搜 allow_url_include
#            改成：allow_url_include = On   （默认是 Off）
#            Ctrl+S 保存 → Control Panel 里 Apache Stop 再 Start（必须重启！）

# 🐧 Linux：一条 sed 改完
sudo sed -i 's/allow_url_include=Off/allow_url_include=On/' /opt/lampp/etc/php.ini
sudo sed -i 's/allow_url_include = Off/allow_url_include = On/' /opt/lampp/etc/php.ini  # 兼容带空格写法

# ✅ 改完必须重启 XAMPP 才生效
sudo /opt/lampp/lampp restart

# ✅ 验证 allow_url_include 真的 On 了
#    浏览器打开：http://localhost/dvwa/setup.php
#    页面往下拉到 "PHP configuration" 那块，看到：
#    ✔ allow_url_fopen: enabled
#    ✔ allow_url_include: enabled    ← 两个都打勾就行！
```

### 4.7.3 setup.php + 登录（最后一步，对照报错表修）

```
浏览器地址栏输入（改了 80→8080 端口就加 :8080）：
    http://localhost/dvwa/setup.php
```

**页面拉到底，点红色大按钮 `Create / Reset Database`**，对照顶部颜色：

| 🟢 你看到什么（成功） | 🔴 你看到什么（失败）→ 直接复制修 |
|---|---|
| 全绿色 Success → 自动跳到 login.php | ❌ SQLSTATE[1045] Access denied → 你 4-2 填了 password！回去改成 **空字符串 ''**，XAMPP root 没密码！ |
| login.php 输入 `admin / password` → Welcome... | ❌ SQLSTATE[2002] Connection refused → MySQL 没启动！回 4.7.1 ③ MySQL 点 Start 变绿灯 |
| 左边菜单出现 Brute Force 等十大模块 ✅ | ❌ 404 Not Found → DVWA 目录放错了！必须是 `htdocs/dvwa/setup.php`，不是 `htdocs/DVWA-master/setup.php` |
| DVWA Security → 切 Low，Submit 无报错 | ❌ allow_url_include 显示红叉 → 4-3 没改 php.ini 或者没重启 Apache！照着重来一遍 |

> 💡 **Kali 用户额外爽点：** XAMPP 跟你 §4.5 装的原生 Apache 是**两套完全独立的东西**！你想两个同时玩也 OK（XAMPP Config → Apache → Main Port 改成 8080，避免和原生 80 冲突），一个坏了不影响另一个。

***

## 4.8 🪟 WSL2 + Ubuntu 方案（Windows 用户不装虚拟机 · 省下 10GB 磁盘 ✅）

> **适合：** 只有 Windows 电脑、不想装 VMware/VirtualBox（占 10+GB）、但又想体验"真实"Linux 命令行的同学；**前提：** 你 Windows 是 Win10 2004 以后 或 Win11（2020 年后买的电脑基本都满足）。
>
> 🔥 **优点：** WSL2 开机秒开（跟开个 cmd 一样快），Windows 文件和 Ubuntu 文件互通（能直接在资源管理器里访问 Ubuntu 目录），**比虚拟机省资源 50% 以上**，后面 Hydra/sqlmap/msfconsole 全跑得动。

### 4.8.0 图示：WSL2 + Ubuntu 搭 DVWA 6 步全景（Win 用户零虚拟机）

<svg viewBox="0 0 1180 500" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1060px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">

  <defs>
    <linearGradient id="wslG1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0078d4"/><stop offset="100%" stop-color="#004578"/></linearGradient>
    <linearGradient id="wslG2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#e95420"/><stop offset="100%" stop-color="#772953"/></linearGradient>
    <marker id="wslArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#3fb950"/></marker>
  </defs>
  <text x="590" y="38" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 4-5  WSL2 + Ubuntu 24.04 搭 DVWA · 6 步搞定（Win 不用装虚拟机）</text>
  <text x="590" y="62" text-anchor="middle" fill="#8b949e" font-size="13" font-family="Arial">Win 管理员 PowerShell 启用 → Microsoft Store 装 Ubuntu → Ubuntu 终端跑 LAMP → 搬 DVWA → setup.php 登录。WSL2 无 systemctl，用 service 命令！</text>
  <g font-family="Arial" font-size="12.5">
    <!-- Step 1: PowerShell 启用 WSL2 -->
    <g transform="translate(20,95)">
      <rect x="0" y="0" width="180" height="340" rx="12" fill="#161b22" stroke="#0078d4" stroke-width="1.6"/>
      <rect x="0" y="0" width="180" height="40" rx="12" fill="url(#wslG1)"/>
      <text x="90" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">① Win 启 WSL2</text>
      <rect x="10" y="56" width="160" height="80" rx="6" fill="#0d1117" stroke="#30363d"/>
      <text x="18" y="76" fill="#56d364">管理员 PowerShell</text>
      <text x="18" y="94" fill="#e6edf3">wsl --install</text>
      <text x="18" y="112" fill="#e6edf3">-d Ubuntu-24.04</text>
      <text x="18" y="130" fill="#ffb4a9">执行完 重启电脑！</text>
      <rect x="10" y="150" width="160" height="36" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="90" y="173" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：wsl -l -v</text>
      <rect x="10" y="200" width="160" height="54" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="90" y="220" text-anchor="middle" fill="#fed7aa">⚠️ 失败先启用</text>
      <text x="90" y="238" text-anchor="middle" fill="#fed7aa">控制面板 → 程序 → </text>
      <text x="90" y="253" text-anchor="middle" fill="#fed7aa">启用虚拟机平台</text>
      <rect x="10" y="278" width="160" height="50" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="90" y="297" text-anchor="middle" fill="#cfe1ff">预估时间</text>
      <text x="90" y="318" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">5 分钟 + 重启</text>
    </g>
    <line x1="200" y1="265" x2="235" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#wslArrow)"/>
    <!-- Step 2: Store 装 Ubuntu + 设账号 -->
    <g transform="translate(235,95)">
      <rect x="0" y="0" width="180" height="340" rx="12" fill="#161b22" stroke="#0078d4" stroke-width="1.6"/>
      <rect x="0" y="0" width="180" height="40" rx="12" fill="url(#wslG1)"/>
      <text x="90" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">② Store 装 Ubuntu</text>
      <rect x="10" y="56" width="160" height="80" rx="6" fill="#0d1117" stroke="#30363d"/>
      <text x="18" y="76" fill="#fff">Microsoft Store</text>
      <text x="18" y="94" fill="#fff">搜 "Ubuntu 24.04"</text>
      <text x="18" y="112" fill="#56d364">点 [获取] 装完打开</text>
      <text x="18" y="130" fill="#ffb4a9">设 UNIX 账号密码</text>
      <rect x="10" y="150" width="160" height="36" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="90" y="173" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 提示符 $ 出现 = OK</text>
      <rect x="10" y="200" width="160" height="54" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="90" y="220" text-anchor="middle" fill="#fed7aa">⚠️ 账号别忘！</text>
      <text x="90" y="238" text-anchor="middle" fill="#fed7aa">以后 sudo 都要用</text>
      <text x="90" y="253" text-anchor="middle" fill="#fed7aa">忘了只能卸载重装</text>
      <rect x="10" y="278" width="160" height="50" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="90" y="297" text-anchor="middle" fill="#cfe1ff">预估时间</text>
      <text x="90" y="318" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">3 分钟</text>
    </g>
    <line x1="415" y1="265" x2="450" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#wslArrow)"/>
    <!-- Step 3: Ubuntu apt 装 LAMP -->
    <g transform="translate(450,95)">
      <rect x="0" y="0" width="180" height="340" rx="12" fill="#161b22" stroke="#e95420" stroke-width="1.6"/>
      <rect x="0" y="0" width="180" height="40" rx="12" fill="url(#wslG2)"/>
      <text x="90" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">③ Ubuntu 装 LAMP</text>
      <rect x="10" y="56" width="160" height="80" rx="6" fill="#0d1117" stroke="#30363d"/>
      <text x="18" y="76" fill="#56d364">sudo apt update</text>
      <text x="18" y="94" fill="#e6edf3">sudo apt install -y</text>
      <text x="18" y="112" fill="#e6edf3">apache2 mariadb-server</text>
      <text x="18" y="130" fill="#e6edf3">php php-mysqli php-gd</text>
      <rect x="10" y="150" width="160" height="36" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="90" y="173" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ 验证：php -v 看到 8.x</text>
      <rect x="10" y="200" width="160" height="54" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="90" y="220" text-anchor="middle" fill="#fed7aa">⚠️ 先换清华源！</text>
      <text x="90" y="238" text-anchor="middle" fill="#fed7aa">教育网 apt 官方源 1KB/s</text>
      <text x="90" y="253" text-anchor="middle" fill="#fed7aa">会怀疑人生的…</text>
      <rect x="10" y="278" width="160" height="50" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="90" y="297" text-anchor="middle" fill="#cfe1ff">预估时间</text>
      <text x="90" y="318" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">3 分钟</text>
    </g>
    <line x1="630" y1="265" x2="665" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#wslArrow)"/>
    <!-- Step 4: service 启动 + MariaDB 密码 -->
    <g transform="translate(665,95)">
      <rect x="0" y="0" width="180" height="340" rx="12" fill="#161b22" stroke="#e95420" stroke-width="1.6"/>
      <rect x="0" y="0" width="180" height="40" rx="12" fill="url(#wslG2)"/>
      <text x="90" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">④ service 启服务</text>
      <rect x="10" y="56" width="160" height="80" rx="6" fill="#0d1117" stroke="#30363d"/>
      <text x="18" y="76" fill="#ffb4a9">⚠️ WSL2 没有 systemctl！</text>
      <text x="18" y="94" fill="#56d364">sudo service apache2 start</text>
      <text x="18" y="112" fill="#56d364">sudo service mariadb start</text>
      <text x="18" y="130" fill="#e6edf3">MariaDB 密码同 §4.5.3</text>
      <rect x="10" y="150" width="160" height="36" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="90" y="173" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ service --status-all 两 +</text>
      <rect x="10" y="200" width="160" height="54" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="90" y="220" text-anchor="middle" fill="#fed7aa">⚠️ 别用 systemctl！</text>
      <text x="90" y="238" text-anchor="middle" fill="#fed7aa">System has not been booted</text>
      <text x="90" y="253" text-anchor="middle" fill="#fed7aa">with systemd 正常现象</text>
      <rect x="10" y="278" width="160" height="50" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="90" y="297" text-anchor="middle" fill="#cfe1ff">预估时间</text>
      <text x="90" y="318" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">2 分钟</text>
    </g>
    <line x1="845" y1="265" x2="880" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#wslArrow)"/>
    <!-- Step 5: 搬 DVWA + 改配置 + allow_url -->
    <g transform="translate(880,95)">
      <rect x="0" y="0" width="180" height="340" rx="12" fill="#161b22" stroke="#8957e5" stroke-width="1.6"/>
      <rect x="0" y="0" width="180" height="40" rx="12" fill="#421f8c"/>
      <text x="90" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">⑤ 搬 DVWA 改配置</text>
      <rect x="10" y="56" width="160" height="80" rx="6" fill="#0d1117" stroke="#30363d"/>
      <text x="18" y="76" fill="#fff">cp DVWA /var/www/html</text>
      <text x="18" y="94" fill="#fff">/dvwa/</text>
      <text x="18" y="112" fill="#56d364">chown www-data dvwa</text>
      <text x="18" y="130" fill="#56d364">allow_url_include=On</text>
      <rect x="10" y="150" width="160" height="36" rx="5" fill="#0e4a1c" stroke="#3fb950"/>
      <text x="90" y="173" text-anchor="middle" fill="#3fb950" font-weight="bold">✅ db_password = 'password'</text>
      <rect x="10" y="200" width="160" height="54" rx="6" fill="#422006" stroke="#fb923c"/>
      <text x="90" y="220" text-anchor="middle" fill="#fed7aa">⚠️ 和 XAMPP 不一样！</text>
      <text x="90" y="238" text-anchor="middle" fill="#fed7aa">WSL2 db_password 是</text>
      <text x="90" y="253" text-anchor="middle" fill="#fed7aa">password（第三步设的）</text>
      <rect x="10" y="278" width="160" height="50" rx="6" fill="#001c4a" stroke="#4490ff"/>
      <text x="90" y="297" text-anchor="middle" fill="#cfe1ff">预估时间</text>
      <text x="90" y="318" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">2 分钟</text>
    </g>
    <line x1="1060" y1="265" x2="1095" y2="265" stroke="#3fb950" stroke-width="2.2" marker-end="url(#wslArrow)"/>
    <!-- Step 6: Win 浏览器访问 -->
    <g transform="translate(1095,95)">
      <rect x="0" y="0" width="70" height="340" rx="12" fill="#161b22" stroke="#238636" stroke-width="1.8"/>
      <rect x="0" y="0" width="70" height="40" rx="12" fill="#0e4a1c"/>
      <text x="35" y="27" text-anchor="middle" fill="#fff" font-weight="bold" font-size="13">⑥ 浏览器</text>
      <g font-size="11">
        <rect x="6" y="56" width="58" height="70" rx="4" fill="#0d1117" stroke="#30363d"/>
        <text x="35" y="74" text-anchor="middle" fill="#fff">hostname -I</text>
        <text x="35" y="92" text-anchor="middle" fill="#fff">取 WSL IP</text>
        <text x="35" y="110" text-anchor="middle" fill="#56d364">Win 浏览器开</text>
        <text x="35" y="126" text-anchor="middle" fill="#56d364">/dvwa/setup</text>
        <rect x="6" y="140" width="58" height="34" rx="4" fill="#0e4a1c" stroke="#3fb950"/>
        <text x="35" y="161" text-anchor="middle" fill="#3fb950" font-weight="bold" font-size="10">✅ Welcome=成</text>
        <rect x="6" y="190" width="58" height="48" rx="4" fill="#422006" stroke="#fb923c"/>
        <text x="35" y="208" text-anchor="middle" fill="#fed7aa" font-size="10">⚠️ WSL 每次</text>
        <text x="35" y="224" text-anchor="middle" fill="#fed7aa" font-size="10">重启 IP 会变</text>
        <text x="35" y="236" text-anchor="middle" fill="#fed7aa" font-size="10">记得重新查！</text>
      </g>
    </g>
  </g>
</svg>

### 4.8.1 启用 WSL2 + 装 Ubuntu（管理员 PowerShell 跑 · 手把手）

> ⚠️ **新手第一步就错的坑：** 必须**右键开始菜单 → Windows PowerShell (管理员) (A)** 或者 **终端 (管理员)**，普通 PowerShell 权限不够，跑 wsl --install 直接报错。

```powershell
# ===================== 管理员 PowerShell 执行 =====================
# 1. 一条命令：启用 WSL2 + 虚拟机平台 + 自动下载 Ubuntu 24.04 LTS
wsl --install -d Ubuntu-24.04

# ✅ 正常输出（成功的样子）：
#    Installing: 虚拟机平台
#    Installing: Windows Subsystem for Linux
#    Downloading: WSL2 Kernel
#    Installing: WSL2 Kernel
#    Downloading: Ubuntu 24.04 LTS
#    Installing: Ubuntu 24.04 LTS
#    The requested operation is successful. 
#    ⚠️  Changes will not be effective until the system is rebooted.  ← 看到这句话必须重启！
```

#### 4.8.1-1. 重启电脑之后（非常关键！不重启等于白装）

重启完电脑，**开始菜单搜 "Ubuntu 24.04 LTS"，点它打开**，第一次会弹黑框，显示 "Installing, this may take a few minutes..."，等 1~2 分钟。

然后会让你设 UNIX 账号密码（**这是你 WSL Ubuntu 的 sudo 密码，和 Windows 密码没关系！**）：
```
Enter new UNIX username:   随便输一个好记的，比如：kali  或者你的英文名，不能大写、不能空格
Enter new UNIX password:   设一个简单的，比如 123456  （自己记牢！后面 sudo 全要它）
Retype new UNIX password:  再输一次
# 成功的话会出现：
# kali@你的电脑名:~$    ← 这个 $ 提示符 = 你的 WSL Ubuntu 环境准备好了！
```

#### 4.8.1-2. 验证 WSL2 真的是 VERSION 2（不是 WSL1！WSL1 跑不了 LAMP）

**新开一个管理员 PowerShell**，跑：
```powershell
wsl -l -v
```

✅ **成功输出：**
```
  NAME            STATE           VERSION
* Ubuntu-24.04    Running         2     ← VERSION 这一列必须是 2！不能是 1！
```

❌ **如果 VERSION 是 1？升级一下就好：**
```powershell
# 管理员 PowerShell 跑，把 WSL1 升成 WSL2，等 2 分钟
wsl --set-version Ubuntu-24.04 2
wsl -l -v   # 再看一遍就是 2 了
```

### 4.8.2 Ubuntu WSL2 里搭 DVWA（跟 Kali LAMP 99% 一样，只有 service / systemctl 的区别）

打开开始菜单的 **Ubuntu 24.04 LTS** 黑终端（不是 PowerShell！别搞混了），把下面命令一段一段复制，**每段跑完看验证输出再下一段**：

---

#### ① 装 LAMP 全家桶（先换清华源，不然官方源 1KB/s 装一下午）

```bash
# 【可选但强烈推荐】Ubuntu 24.04 换清华源（教育网/国内网络 10MB/s 起飞）
sudo cp /etc/apt/sources.list.d/ubuntu.sources /etc/apt/sources.list.d/ubuntu.sources.bak
sudo sed -i 's|http://archive.ubuntu.com/|https://mirrors.tuna.tsinghua.edu.cn/|g' /etc/apt/sources.list.d/ubuntu.sources
sudo sed -i 's|http://security.ubuntu.com/|https://mirrors.tuna.tsinghua.edu.cn/|g' /etc/apt/sources.list.d/ubuntu.sources

# 装 LAMP + PHP 扩展（DVWA 需要的全在这里）
sudo apt update && sudo apt install -y \
  apache2 mariadb-server mariadb-client \
  php php-mysqli php-mysqlnd php-gd php-mbstring php-curl php-xml \
  wget curl unzip git
```
✅ **验证：** `php -v | head -n1` → 看到 PHP 8.x.x，不是 7.x 就行。

---

#### ② 启动服务（⚠️ WSL2 没有 systemctl！用 service！）

> ❌ **千万别跑 `systemctl start apache2`！** WSL2 默认不用 systemd 启动，跑了会报 `System has not been booted with systemd as init system (PID 1). Can't operate.`，**这是正常现象，不是你装错了！** 全换成 `service` 命令就好。

```bash
# 启动 Apache + MariaDB（WSL2 专用写法）
sudo service apache2 start
sudo service mariadb start
```

✅ **验证两个服务都在跑：**
```bash
service --status-all | grep -E "apache2|mysql"
# 正常输出长这样（[ + ] 代表启动成功）：
#  [ + ]  apache2
#  [ + ]  mysql          ← WSL2 里 mariadb 服务名叫 mysql，正常
```
❌ **哪个是 [ - ] 就重启哪个**：`sudo service 那个服务名 restart`。

---

#### ③ 设 MariaDB root 密码（和 Kali LAMP §4.5.3 完全一样）

```bash
# 1. 先无密码进 MariaDB
sudo mariadb -u root << 'SQLEOF'
ALTER USER 'root'@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('password');
FLUSH PRIVILEGES;
SQLEOF

# 2. ✅ 验证密码真的生效（输出里最后一列是 ✅ 就过）
mariadb -u root -ppassword -e "SELECT '✅ MariaDB 密码 OK' AS 结果;"
```
> 🔐 记牢：`root / password`，后面改 DVWA 配置用。

---

#### ④ 搬 DVWA 代码 + 改配置（和 Kali §4.5.4 / §4.5.5 一样）

```bash
# 1. 先下载 DVWA（用 Gitee 国内路线 A，跟 §4.2.3 一模一样）
cd /tmp
wget --no-check-certificate -O DVWA.tar.gz "https://gitee.com/HeiDaGe/DVWA/repository/archive/main.tar.gz"
tar -zxf DVWA.tar.gz

# 2. 搬到 Apache 根目录，名叫 dvwa（小写）
sudo rm -f /var/www/html/index.html
sudo mv /tmp/DVWA /var/www/html/dvwa

# 3. 改权限给 Apache（www-data 用户）
sudo chown -R www-data:www-data /var/www/html/dvwa/
sudo chmod -R 775 /var/www/html/dvwa/hackable/ /var/www/html/dvwa/external/

# 4. 改配置文件：db_password = 'password'（和 XAMPP 不一样！XAMPP 是空，这里是 password！）
cd /var/www/html/dvwa/config
sudo cp config.inc.php.dist config.inc.php
sudo sed -i "s/\$_DVWA\[ 'db_password' \] = '.*';/\$_DVWA[ 'db_password' ] = 'password';/" config.inc.php

# 5. ✅ 验证改对了（最后一行必须是 db_password = 'password'）
grep "db_password\|db_user\|db_server" config.inc.php
```

---

#### ⑤ 开 allow_url_include = On（第 8 章文件包含必备）

```bash
# 1. 找 php.ini 路径（WSL2 Ubuntu Apache 的 php.ini 在 /etc/php/8.x/apache2/php.ini）
PHP_INI=$(php --ini | grep "Loaded Configuration" | awk '{print $NF}')
echo "你的 PHP 配置路径是：$PHP_INI"   # 把输出的路径记住

# 2. sed 一键改 allow_url_include 从 Off → On
sudo sed -i 's/allow_url_include = Off/allow_url_include = On/' $PHP_INI
sudo sed -i 's/allow_url_include=Off/allow_url_include=On/' $PHP_INI  # 兼容无空格写法

# 3. 重启 Apache 才生效（必须 service 不是 systemctl）
sudo service apache2 restart
```

---

#### ⑥ 获取 WSL2 的 IP（Windows 浏览器访问要用）

```bash
hostname -I | awk '{print $1}'
```

✅ 输出是一个 172.26.xxx.xxx 或者 172.27.xxx.xxx 的 IP（比如 `172.26.148.201`），**把这个 IP 抄下来**。

> ⚠️ **新手巨坑：WSL2 每次重启电脑 / 关闭 Ubuntu 终端，这个 IP 都会变！** 下次再打开要重新 `hostname -I | awk '{print $1}'` 查新 IP，别拿昨天的 IP 访问半天 404。

### 4.8.3 回到 Windows 浏览器访问 + 登录（大功告成）

打开你 Windows 的 Chrome / Edge，地址栏输入：
```
http://刚才查到的那个172开头的IP/dvwa/setup.php
```

**页面拉到底，点红色 `Create / Reset Database` 大按钮**，然后：

| 🟢 成功 → 下一步 | 🔴 失败 → 直接复制修 |
|---|---|
| 全绿 Success → 跳到 login.php | ❌ System has not been booted with systemd → 你跑了 systemctl start！回去全换成 `sudo service apache2 restart` |
| login.php 输 admin / password → Welcome... | ❌ 404 Not Found → IP 输错了 / dvwa 目录名错了（查 `ls /var/www/html/dvwa/setup.php`）|
| 切 DVWA Security 到 Low ✅ | ❌ 1045 Access denied → db_password 设错了（必须是你 ③ 里设的 password）|
| 左边十大模块全有 → 开冲！ | ❌ 连接超时 → WSL 关了！开始菜单重开 Ubuntu 24.04，重新 `sudo service apache2 start && sudo service mariadb start` + 重新查 IP |

> 💡 **WSL2 的 Win 文件互通爽点：** 你 Windows 的 C 盘、D 盘，在 WSL 里直接能用：`/mnt/c/Users/你的Windows用户名/Desktop/` 就是你桌面，下载的 DVWA zip 直接 `unzip /mnt/c/Users/xxx/Downloads/DVWA.zip` 就行，不用开共享文件夹。

***

## 4.9 🐧 Ubuntu / Debian 原生 LAMP 完整版（非 Kali 虚拟机用）

> **适合：** 你用的虚拟机是 Ubuntu 22.04/24.04、Debian 12，而不是 Kali；内容跟 §4.5 Kali LAMP 是同一套，只是把 Kali 特有命令换成 Ubuntu 标准命令，**避免某些源找不到包的坑**。

这一节跟 §4.5 几乎一样，只是把 `apt install -y apache2 mariadb-server php php-mysqli git` 里**验证源可用**的步骤加上，确保你在教育网/阿里云镜像源里 100% 能装上：

```bash
# ===== 0. 先把源换成国内镜像（清华，比官方源快 10 倍）Ubuntu 24.04 专用 =====
# （嫌麻烦可以不换，直接跳到第 ① 步）
sudo cp /etc/apt/sources.list.d/ubuntu.sources /etc/apt/sources.list.d/ubuntu.sources.bak
sudo sed -i 's|http://archive.ubuntu.com/|https://mirrors.tuna.tsinghua.edu.cn/|g' /etc/apt/sources.list.d/ubuntu.sources
sudo sed -i 's|http://security.ubuntu.com/|https://mirrors.tuna.tsinghua.edu.cn/|g' /etc/apt/sources.list.d/ubuntu.sources

# ===== ① 安装 LAMP 组件（Ubuntu 24.04 官方源已验证全部可装 ✅）=====
sudo apt update && sudo apt install -y \
  apache2 mariadb-server mariadb-client \
  php php-mysqli php-mysqlnd php-gd php-mbstring php-curl php-xml php-pear \
  git curl wget unzip zip

# ===== ② 启动 + 设开机自启（Ubuntu 有 systemctl，跟 Kali 一样）=====
sudo systemctl enable --now apache2 mariadb
sudo systemctl status apache2 mariadb --no-pager
# 输出里绿色的 active (running) 就 OK

# ===== ③ MariaDB 安全初始化（非 Kali 一定要跑这步，不然空密码会被拒）=====
# 先设 root 密码，再跑安全脚本：
sudo mariadb -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'password'; FLUSH PRIVILEGES;"
sudo mysql_secure_installation <<EOF
password
n
Y
Y
Y
Y
Y
EOF
# 上面 6 行自动回答：输入刚设的 password → 不改根密码(Y=不换) → 删匿名用户 → 禁远程root登录 → 删test库 → 重载权限

# ===== ④ 克隆 DVWA + 改配置（跟 Kali LAMP §4.5 完全一样）=====
cd /var/www/html
sudo git clone --depth 1 https://github.com/digininja/DVWA.git dvwa
cd dvwa/config
sudo cp config.inc.php.dist config.inc.php
sudo sed -i "s/db_password'] = 'p@ssw0rd'/db_password'] = 'password'/" config.inc.php
cd /var/www/html
sudo chown -R www-data:www-data dvwa/
sudo chmod -R u+rwX dvwa/

# ===== ⑤ PHP 配置（allow_url_include，第 8 章文件包含必开 ✅）=====
PHP_VER=$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')
echo "检测到 PHP 版本 $PHP_VER，正在改 php.ini..."
sudo sed -i 's/allow_url_include = Off/allow_url_include = On/' /etc/php/$PHP_VER/apache2/php.ini
sudo sed -i 's/display_errors = Off/display_errors = On/' /etc/php/$PHP_VER/apache2/php.ini
sudo systemctl restart apache2

# ===== ⑥ 拿到 IP 去浏览器访问 =====
hostname -I | awk '{print "浏览器访问: http://"$1"/dvwa/setup.php"}'
```

输出的 IP 浏览器访问后，和 Kali 版完全一致：Create/Reset DB → `admin / password` → DVWA Security 切 Low，10 大模块全部解锁！

***

## 4.10 🩹 常见问题排查（所有环境通用）

搭环境嘛，总会遇到各种问题。别慌，我把新手最常遇到的坑都列出来，你对着排查。

### 4.10.1 数据库连接失败怎么办？

**症状：** 访问setup.php的时候，提示"Could not connect to the database"或者"Access denied for user 'root'@'localhost'"之类的。

**最可能的原因：数据库密码不对！**

**排查步骤：**

1. 打开 `dvwa/config/config.inc.php`
2. 看看 `db_password` 是不是 `root`
3. 确认你的MySQL密码到底是什么
   - PHPStudy默认MySQL密码是 `root`
   - 如果你自己改过，就改成你自己的密码
4. 改完保存，刷新页面试试

> 💡 **怎么确认MySQL密码？**
>
> 打开PHPStudy → 数据库 → 看看root用户的密码是什么。
> 或者直接用phpMyAdmin登录试试，用户名root，密码root，看能不能登进去。

**其他可能原因：**

- MySQL没启动 → 去PHPStudy启动MySQL
- 数据库名不对 → 确认 `db_database` 是 `dvwa`
- 数据库地址不对 → 确认 `db_server` 是 `127.0.0.1` 或 `localhost`

### 4.5.2 allow\_url\_include报错怎么办？

**症状：** 页面底部有红色警告，说 `allow_url_include` 是disabled，或者文件包含漏洞用不了。

**原因：** PHP的 `allow_url_include` 功能没打开。

**解决方法：**

1. 打开PHPStudy
2. 点击左侧"设置" → "配置文件"
3. 找到你当前使用的PHP版本的 `php.ini`
4. 打开php.ini，搜索 `allow_url_include`
5. 把它改成：
   ```
   allow_url_include = On
   ```
6. 保存文件
7. 重启Apache服务

> 💡 **allow\_url\_include是干啥的？**
>
> 它是PHP的一个配置项，决定了能不能通过URL包含远程文件。
> 这个功能很危险，所以默认是关掉的。
> 但我们练文件包含漏洞的时候需要用到它，所以得打开。
>
> 记住：这是靶场环境才这么搞！真实环境里千万别开！

### 4.5.3 页面空白怎么办？

**症状：** 访问DVWA的时候，页面一片空白，什么都没有。

**可能原因1：PHP版本问题**

DVWA是个老项目了，对PHP 7.x和PHP 8.x的兼容性可能不太好。

**解决方法：**

- 试试切换PHP版本
- 推荐用 PHP 5.6 或 PHP 7.0 \~ 7.3
- 太新的PHP版本可能会有各种问题

**可能原因2：PHP报错没显示**

页面空白可能是PHP报错了，但错误信息没显示出来。

**怎么看错误？**

1. 打开php.ini
2. 找到 `display_errors`，改成 `On`
3. 找到 `error_reporting`，改成 `E_ALL`
4. 保存，重启Apache
5. 刷新页面，就能看到错误信息了

**可能原因3：文件权限问题**

- 确认文件都放对位置了
- 确认文件夹名字没打错
- 确认路径里没有中文

### 4.5.4 验证码错误怎么办？

**症状：** 玩"Insecure CAPTCHA"模块的时候，提示验证码错误，或者直接报错。

**原因：** reCAPTCHA的密钥没配置对。

**解决方法：**

1. 打开 `dvwa/config/config.inc.php`
2. 找到 `recaptcha_public_key` 和 `recaptcha_private_key`
3. 确保它们不是空的（随便填点东西也行）
4. 如果想真的用验证码功能，得去Google官网申请真实的密钥

> 💡 **新手小贴士：**
>
> 验证码模块可以先放一放，等把其他漏洞都学完了再回来研究它。
> 这个不是重点，先把主要的漏洞搞定。

### 4.5.5 其他小技巧

**1. 搞坏了怎么办？**

- 没关系！重新访问 `setup.php`，点"Create / Reset Database"，就能重置一切
- 就像游戏重新开始一样

**2. 忘了密码怎么办？**

- 重置数据库，密码就变回admin/password了

**3. 想换难度怎么办？**

- 左边菜单点"DVWA Security"，选你想要的难度，点Submit就行

***

## 4.6 第一个小实验：随便点点看

环境搭好了，先别急着学漏洞。我们先来"逛一逛"，熟悉一下界面。

### 4.6.1 实验目的

- 熟悉DVWA的界面
- 感受一下漏洞模块长啥样
- 试试切换难度
- 不用搞懂原理，先看看热闹就行 😄

### 4.6.2 实验步骤

**1. 确认你已经登录DVWA了**
用户名admin，密码password。

**2. 看看首页**
点击左边的"Home"，读读介绍，了解一下DVWA是什么。

**3. 切换到Low难度**
点击"DVWA Security"，选择"low"，点Submit。
（默认就是Low，确认一下就行）

**4. 随便点几个模块看看**

不用管原理，就点开看看界面长啥样：

- **Brute Force**：一个登录框，让你输用户名密码
- **Command Injection**：一个输入框，让你ping一个IP
- **File Upload**：一个上传按钮，让你上传文件
- **SQL Injection**：一个输入框，让你输User ID
- **XSS (Reflected)**：一个输入框，让你输名字

是不是发现很多模块都是"一个输入框 + 一个提交按钮"？
别小看这一个输入框，后面我们就要用它搞出各种事情\~ 😏

**5. 试试Medium难度**
把难度切到Medium，再回去看看刚才那些模块。
你会发现界面好像没什么变化... 但背后的代码已经变了，防护更严了。

是不是有点好奇：同样的界面，不同难度到底有啥区别？
别着急，后面我们会一个一个深入研究。

**6. 重置一下数据库**
玩了半天，可能搞乱了什么。没关系：

- 点击"Setup / Reset DB"
- 拉到底部，点"Create / Reset Database"
- 重新登录，一切又恢复原样了

> 🎯 **实验完成！**
>
> 怎么样？是不是对DVWA有个大概印象了？
> 是不是已经开始期待正式打漏洞了？

***

## 4.7 本章总结

这一章我们搭建了第一个靶场——DVWA。

回顾一下我们都做了什么：

1. ✅ 了解了DVWA是什么（Web安全的新手村）
2. ✅ 知道了为什么选DVWA作为第一个靶场（经典、全面、友好）
3. ✅ 下载了DVWA源码
4. ✅ 把DVWA部署到了PHPStudy上
5. ✅ 修改了配置文件（数据库密码、验证码密钥）
6. ✅ 初始化了数据库
7. ✅ 成功登录了DVWA
8. ✅ 认识了DVWA的界面和菜单
9. ✅ 了解了四个难度级别（Low/Medium/High/Impossible）
10. ✅ 知道了常见问题怎么排查

**到这里，你的第一个靶场已经成功跑起来了！** 🎉

是不是感觉离"黑客"又近了一步？

***

## 下章预告

下一章开始，我们就要正式"打靶"了！

我们会从最经典、最入门的漏洞开始——**暴力破解**。

什么是暴力破解？
说白了就是"猜密码"。

你将学到：

- 暴力破解是什么原理
- 怎么用Burp Suite进行暴力破解
- 怎么用字典提高破解效率
- 怎么防止暴力破解

从这一章开始，我们一个漏洞一个漏洞地打，把DVWA从头撸到尾！

准备好了吗？我们下章见！👋

***

> 💡 **本章小练习**
>
> 1. 把DVWA下载下来，部署到你的PHPStudy里
> 2. 成功访问 <http://localhost/dvwa/> 并登录（admin/password）
> 3. 找到DVWA Security，确认当前难度是Low
> 4. 点开每个漏洞模块看看，感受一下
> 5. 试试重置数据库，看看会不会回到初始状态
> 6. 试试切换到Medium难度，看看界面有没有变化
>
> 都搞定了再往下看，别急，一步一步来。
> 有问题的话，翻回去看"常见问题排查"那一节。

