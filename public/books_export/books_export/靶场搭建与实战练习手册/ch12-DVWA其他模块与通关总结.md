# 第12章 DVWA其他模块与通关总结 🎯

## 开篇引入：打完收工？先别急着走！🤗

哈喽各位小伙伴！欢迎来到第12章！🎉

不知不觉，我们已经把DVWA里最核心的几个大漏洞都学完了——从暴力破解、命令注入、CSRF，到文件包含、文件上传、SQL注入，再到上一章的XSS，是不是感觉收获满满？就像打游戏通关了一个又一个Boss一样，超有成就感对不对？😎

但是呢，DVWA作为一个"专业靶场"，它的内容可不止这些！在左侧的菜单栏里，你可能还注意到了一些奇奇怪怪的模块，比如什么CAPTCHA、CSP、JavaScript之类的。这些模块虽然不如前面那几个"大牌"，但也是Web安全里非常重要的知识点，咱们可不能错过！

打个比方 🍔：

你去吃汉堡套餐，前面的大漏洞就像汉堡、薯条、可乐这些"主菜"，必须得吃。但是套餐里还有番茄酱、餐巾纸、小玩具这些"小东西"，虽然不是主食，但也很有用——番茄酱能让薯条更好吃，餐巾纸能擦手，小玩具能让你开心。

这一章里，我们就把DVWA里剩下的这些"小模块"快速过一遍，每个都给你讲明白是干啥的、怎么玩的。然后呢，我们再一起做个"通关总结"，聊聊从Low级别一路打到High级别，我们到底学到了啥，以后该怎么继续学习。

准备好了吗？让我们开始最后的"扫尾工作"，然后给DVWA之旅画上一个圆满的句号！💪

---

### 📍 全模块 · 三平台访问地址总表（一张表存好，以后随查随用 📚）

下面这张表把前面 10 个模块 + 本章 5 个小模块的 **Windows PHPStudy / Kali LAMP / Docker 三平台 URL** 一次性汇总，存进收藏夹，下次学其他靶场（Pikachu、Upload-Labs）还能对比参照：

| 章节 模块名 | 菜单路径 | 🪟 Windows PHPStudy | 🐧 **Kali LAMP（你在用 ✅）** | 🐳 Docker（端口 4280 · 拉不动换 ch04 §4.5/§4.7 ✅） |
|---|---|---|---|---|
| ⑤ 暴力破解 Brute Force | Left Menu | `http://localhost/dvwa/vulnerabilities/brute/` | `http://KALI_IP/dvwa/vulnerabilities/brute/` | `http://KALI_IP:4280/vulnerabilities/brute/` |
| ⑥ 命令注入 Command Inject | Left Menu | `http://localhost/dvwa/vulnerabilities/exec/` | `http://KALI_IP/dvwa/vulnerabilities/exec/` | `http://KALI_IP:4280/vulnerabilities/exec/` |
| ⑦ CSRF 跨站请求伪造 | Left Menu | `http://localhost/dvwa/vulnerabilities/csrf/` | `http://KALI_IP/dvwa/vulnerabilities/csrf/` | `http://KALI_IP:4280/vulnerabilities/csrf/` |
| ⑧ 文件包含 File Inclusion | Left Menu | `http://localhost/dvwa/vulnerabilities/fi/` | `http://KALI_IP/dvwa/vulnerabilities/fi/` | `http://KALI_IP:4280/vulnerabilities/fi/` |
| ⑨ 文件上传 File Upload | Left Menu | `http://localhost/dvwa/vulnerabilities/upload/` | `http://KALI_IP/dvwa/vulnerabilities/upload/` | `http://KALI_IP:4280/vulnerabilities/upload/` |
| ⑩ SQL 注入 (显注) | Left Menu | `http://localhost/dvwa/vulnerabilities/sqli/` | `http://KALI_IP/dvwa/vulnerabilities/sqli/` | `http://KALI_IP:4280/vulnerabilities/sqli/` |
| ⑩+ SQL 盲注 Blind | Left Menu | `http://localhost/dvwa/vulnerabilities/sqli_blind/` | `http://KALI_IP/dvwa/vulnerabilities/sqli_blind/` | `http://KALI_IP:4280/vulnerabilities/sqli_blind/` |
| ⑪ 反射型 XSS (R) | Left Menu | `http://localhost/dvwa/vulnerabilities/xss_r/` | `http://KALI_IP/dvwa/vulnerabilities/xss_r/` | `http://KALI_IP:4280/vulnerabilities/xss_r/` |
| ⑪ 存储型 XSS (S) | Left Menu | `http://localhost/dvwa/vulnerabilities/xss_s/` | `http://KALI_IP/dvwa/vulnerabilities/xss_s/` | `http://KALI_IP:4280/vulnerabilities/xss_s/` |
| ⑪ DOM 型 XSS (D) | Left Menu | `http://localhost/dvwa/vulnerabilities/xss_d/` | `http://KALI_IP/dvwa/vulnerabilities/xss_d/` | `http://KALI_IP:4280/vulnerabilities/xss_d/` |
| ⑫ CAPTCHA / CSP 等 | 剩余全部 | `http://localhost/dvwa/` → 左侧菜单 | `http://KALI_IP/dvwa/` → 左侧菜单 | `http://KALI_IP:4280/` → 左侧菜单 |
| 难度切换 DVWA Security | 左下角 | `http://localhost/dvwa/security.php` | `http://KALI_IP/dvwa/security.php` | `http://KALI_IP:4280/security.php` |
| 一键重置数据库 Setup | 左侧菜单 | `http://localhost/dvwa/setup.php` | `http://KALI_IP/dvwa/setup.php` | `http://KALI_IP:4280/setup.php` |

> 💡 **Kali 同学专用一行 IP 查询：** `KALI_IP=$(ip -4 a | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d/ -f1) ; echo "你的Kali IP是: $KALI_IP"`

---

### 🗺️ 图 12-1 DVWA 学习总路线图（4 难度 × 16 模块 × 3 平台 · 闯关顺序推荐）

这张图是你整个 DVWA 学习阶段的"高德地图导航"🗺️：**蓝色路径（入门 1 周）→ 黄色路径（进阶 2 周）→ 橙色路径（高级 2 周）→ 红色终点（源码审计）**。跟着箭头走，学完你对 Web 漏洞的理解就完整了。图里同时标出 **Kali LAMP 原生 / Docker 容器 / Windows PHPStudy** 三种环境各自最适合的阶段：

<svg viewBox="0 0 1160 620" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1020px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">

  <defs>
    <linearGradient id="road-blue" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#1f6feb"/><stop offset="100%" stop-color="#0b3b8a"/></linearGradient>
    <linearGradient id="road-yellow" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#e0a500"/><stop offset="100%" stop-color="#8a5a00"/></linearGradient>
    <linearGradient id="road-orange" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#d24a00"/><stop offset="100%" stop-color="#802800"/></linearGradient>
    <linearGradient id="road-red" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#a1003c"/><stop offset="100%" stop-color="#5c0020"/></linearGradient>
    <linearGradient id="env-tag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a3556"/><stop offset="100%" stop-color="#151a30"/></linearGradient>
    <marker id="road-ar" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#ffe16b"/></marker>
    <marker id="road-ar2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#ffa36b"/></marker>
    <marker id="road-ar3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#ff6b8a"/></marker>
  </defs>
  <text x="580" y="34" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 12-1  DVWA 闯关总路线图 · 从 Low 新手村 到 Impossible 源码审计 · 4 阶段 16 模块</text>
  <!-- 顶部：三环境徽章 -->
  <g font-family="Arial" font-size="13">
    <rect x="40" y="54" width="260" height="44" rx="11" fill="url(#env-tag)" stroke="#4490ff" stroke-width="1.3"/>
    <text x="170" y="82" text-anchor="middle" fill="#cfe1ff" font-weight="bold">🪟 Windows PHPStudy · 过渡用（推荐度 ⭐⭐⭐）</text>
    <rect x="320" y="54" width="480" height="44" rx="11" fill="url(#env-tag)" stroke="#3fb950" stroke-width="1.6"/>
    <text x="560" y="82" text-anchor="middle" fill="#c7f3d0" font-weight="bold">🐧 Kali Linux 原生 LAMP · 全程推荐 ✅ 你现在用的就是这个！（⭐⭐⭐⭐⭐）</text>
    <rect x="820" y="54" width="300" height="44" rx="11" fill="url(#env-tag)" stroke="#a371f7" stroke-width="1.3"/>
    <text x="970" y="82" text-anchor="middle" fill="#e3d0ff" font-weight="bold">🐳 Docker 一行拉起 · 临时复现最爱（⭐⭐⭐⭐）</text>
  </g>
  <!-- 阶段一：入门 蓝色 -->
  <g font-family="Arial">
    <rect x="20" y="118" width="1120" height="108" rx="14" fill="url(#road-blue)" stroke="#4490ff" stroke-width="1.5"/>
    <text x="40" y="144" fill="#fff" font-weight="bold" font-size="15">🎓 阶段一：Low 难度 · 新手村（1 周 · 先把 8 个大模块各打一遍）</text>
    <g font-size="12.5" fill="#e6efff">
      <rect x="40"  y="158" width="126" height="56" rx="8" fill="#001c4a" stroke="#4490ff"/><text x="103" y="182" text-anchor="middle" font-weight="bold">⑤ Brute Force</text><text x="103" y="202" text-anchor="middle">hydra / burp · 字典爆破</text>
      <line x1="166" y1="186" x2="190" y2="186" stroke="#4490ff" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="192" y="158" width="126" height="56" rx="8" fill="#001c4a" stroke="#4490ff"/><text x="255" y="182" text-anchor="middle" font-weight="bold">⑥ Cmd Injection</text><text x="255" y="202" text-anchor="middle">; &#124; &amp;&amp; · 管道连符</text>
      <line x1="318" y1="186" x2="342" y2="186" stroke="#4490ff" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="344" y="158" width="126" height="56" rx="8" fill="#001c4a" stroke="#4490ff"/><text x="407" y="182" text-anchor="middle" font-weight="bold">⑦ CSRF</text><text x="407" y="202" text-anchor="middle">借刀杀人 · 改密码</text>
      <line x1="470" y1="186" x2="494" y2="186" stroke="#4490ff" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="496" y="158" width="126" height="56" rx="8" fill="#001c4a" stroke="#4490ff"/><text x="559" y="182" text-anchor="middle" font-weight="bold">⑧ File Include</text><text x="559" y="202" text-anchor="middle">php://filter · LFI/RFI</text>
      <line x1="622" y1="186" x2="646" y2="186" stroke="#4490ff" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="648" y="158" width="126" height="56" rx="8" fill="#001c4a" stroke="#4490ff"/><text x="711" y="182" text-anchor="middle" font-weight="bold">⑨ File Upload</text><text x="711" y="202" text-anchor="middle">图片马 · Weevely shell</text>
      <line x1="774" y1="186" x2="798" y2="186" stroke="#4490ff" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="800" y="158" width="126" height="56" rx="8" fill="#001c4a" stroke="#4490ff"/><text x="863" y="182" text-anchor="middle" font-weight="bold">⑩ SQL Inject</text><text x="863" y="202" text-anchor="middle">order by · union select</text>
      <line x1="926" y1="186" x2="950" y2="186" stroke="#4490ff" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="952" y="158" width="176" height="56" rx="8" fill="#001c4a" stroke="#4490ff"/><text x="1040" y="182" text-anchor="middle" font-weight="bold">⑪ XSS (R+S+D) 三种</text><text x="1040" y="202" text-anchor="middle">img onerror · script · #锚点</text>
    </g>
  </g>
  <!-- 阶段二：进阶 黄色 -->
  <g font-family="Arial">
    <rect x="20" y="244" width="1120" height="108" rx="14" fill="url(#road-yellow)" stroke="#ffe16b" stroke-width="1.5"/>
    <text x="40" y="270" fill="#fff" font-weight="bold" font-size="15">🔐 阶段二：Medium 难度 · 第一次绕过（2 周 · 学会每种漏洞基础绕过姿势）</text>
    <g font-size="12.5" fill="#fff3c2">
      <rect x="40"  y="284" width="170" height="56" rx="8" fill="#3a2a00" stroke="#ffe16b"/><text x="125" y="308" text-anchor="middle" font-weight="bold">绕过1：strip_tags / str_replace</text><text x="125" y="328" text-anchor="middle">大小写 · 双写 · &lt;img&gt; 其他标签</text>
      <line x1="210" y1="312" x2="240" y2="312" stroke="#ffe16b" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="242" y="284" width="170" height="56" rx="8" fill="#3a2a00" stroke="#ffe16b"/><text x="327" y="308" text-anchor="middle" font-weight="bold">绕过2：mysql_real_escape</text><text x="327" y="328" text-anchor="middle">宽字节 · 二次注入 · ORDER BY</text>
      <line x1="412" y1="312" x2="442" y2="312" stroke="#ffe16b" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="444" y="284" width="170" height="56" rx="8" fill="#3a2a00" stroke="#ffe16b"/><text x="529" y="308" text-anchor="middle" font-weight="bold">绕过3：Content-Type</text><text x="529" y="328" text-anchor="middle">Burp 修改 Content-Type 头</text>
      <line x1="614" y1="312" x2="644" y2="312" stroke="#ffe16b" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="646" y="284" width="170" height="56" rx="8" fill="#3a2a00" stroke="#ffe16b"/><text x="731" y="308" text-anchor="middle" font-weight="bold">绕过4：黑名单后缀</text><text x="731" y="328" text-anchor="middle">.php5 .phtml .htaccess %00截断</text>
      <line x1="816" y1="312" x2="846" y2="312" stroke="#ffe16b" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="848" y="284" width="280" height="56" rx="8" fill="#3a2a00" stroke="#ffe16b"/><text x="988" y="308" text-anchor="middle" font-weight="bold">🔥 Kali 实操：Burp Intruder / sqlmap / Hydra</text><text x="988" y="328" text-anchor="middle">每个工具至少手动跑 3 次，烂熟于心</text>
    </g>
  </g>
  <!-- 阶段三：高级 橙色 -->
  <g font-family="Arial">
    <rect x="20" y="370" width="1120" height="108" rx="14" fill="url(#road-orange)" stroke="#ffa36b" stroke-width="1.5"/>
    <text x="40" y="396" fill="#fff" font-weight="bold" font-size="15">🚀 阶段三：High 难度 · 组合拳挑战（2 周 · 多步绕过 + Token + 文件内容检测）</text>
    <g font-size="12.5" fill="#ffe6d0">
      <rect x="40"  y="410" width="210" height="56" rx="8" fill="#4a1800" stroke="#ffa36b"/><text x="145" y="434" text-anchor="middle" font-weight="bold">High 1：user_token 机制</text><text x="145" y="454" text-anchor="middle">Burp Pitchfork + Grep-Extract</text>
      <line x1="250" y1="438" x2="280" y2="438" stroke="#ffa36b" stroke-width="1.6" marker-end="url(#road-ar2)"/>
      <rect x="282" y="410" width="210" height="56" rx="8" fill="#4a1800" stroke="#ffa36b"/><text x="387" y="434" text-anchor="middle" font-weight="bold">High 2：图片二次渲染</text><text x="387" y="454" text-anchor="middle">copy 命令 + php://filter + 文件包含上传</text>
      <line x1="492" y1="438" x2="522" y2="438" stroke="#ffa36b" stroke-width="1.6" marker-end="url(#road-ar2)"/>
      <rect x="524" y="410" width="210" height="56" rx="8" fill="#4a1800" stroke="#ffa36b"/><text x="629" y="434" text-anchor="middle" font-weight="bold">High 3：SQL 盲注 布尔/时间</text><text x="629" y="454" text-anchor="middle">substring(ascii(mid(...))) · sqlmap --level 3</text>
      <line x1="734" y1="438" x2="764" y2="438" stroke="#ffa36b" stroke-width="1.6" marker-end="url(#road-ar2)"/>
      <rect x="766" y="410" width="362" height="56" rx="8" fill="#4a1800" stroke="#ffa36b"/><text x="947" y="434" text-anchor="middle" font-weight="bold">🐧 Kali 全家桶联动：sqlmap -r request.txt + Burp + BeEF</text><text x="947" y="454" text-anchor="middle">请求保存为 txt，用 sqlmap 读包跑 / Beef 挂僵尸 XSS 组合</text>
    </g>
  </g>
  <!-- 阶段四：终点 红色 -->
  <g font-family="Arial">
    <rect x="20" y="496" width="1120" height="108" rx="14" fill="url(#road-red)" stroke="#ff6b8a" stroke-width="1.5"/>
    <text x="40" y="522" fill="#fff" font-weight="bold" font-size="15">🏆 阶段四：Impossible 难度 + 小模块扫尾 · 源码审计（1 周 · 学正确写法，彻底理解漏洞根因）</text>
    <g font-size="12.5" fill="#ffd7df">
      <rect x="40"  y="536" width="180" height="56" rx="8" fill="#400016" stroke="#ff6b8a"/><text x="130" y="560" text-anchor="middle" font-weight="bold">Imp 1：PDO / htmlspecialchars</text><text x="130" y="580" text-anchor="middle">白名单 · 输出编码 · 预编译</text>
      <line x1="220" y1="564" x2="250" y2="564" stroke="#ff6b8a" stroke-width="1.6" marker-end="url(#road-ar3)"/>
      <rect x="252" y="536" width="180" height="56" rx="8" fill="#400016" stroke="#ff6b8a"/><text x="342" y="560" text-anchor="middle" font-weight="bold">Imp 2：CSRF Token</text><text x="342" y="580" text-anchor="middle">checkToken · 生成-校验双保险</text>
      <line x1="432" y1="564" x2="462" y2="564" stroke="#ff6b8a" stroke-width="1.6" marker-end="url(#road-ar3)"/>
      <rect x="464" y="536" width="180" height="56" rx="8" fill="#400016" stroke="#ff6b8a"/><text x="554" y="560" text-anchor="middle" font-weight="bold">Imp 3：锁定/验证码/哈希</text><text x="554" y="580" text-anchor="middle">password_hash · 3次锁15分</text>
      <line x1="644" y1="564" x2="674" y2="564" stroke="#ff6b8a" stroke-width="1.6" marker-end="url(#road-ar3)"/>
      <rect x="676" y="536" width="180" height="56" rx="8" fill="#400016" stroke="#ff6b8a"/><text x="766" y="560" text-anchor="middle" font-weight="bold">其他小模块通关</text><text x="766" y="580" text-anchor="middle">CAPTCHA · CSP · SessionID · JS</text>
      <line x1="856" y1="564" x2="886" y2="564" stroke="#ff6b8a" stroke-width="1.6" marker-end="url(#road-ar3)"/>
      <rect x="888" y="536" width="240" height="56" rx="8" fill="#200" stroke="#3fb950" stroke-width="2"/>
      <text x="1008" y="558" text-anchor="middle" fill="#9effa0" font-weight="bold" font-size="14">🎓✅ DVWA 通关！下一站：</text>
      <text x="1008" y="580" text-anchor="middle" fill="#9effa0" font-size="13">SQLi-Labs → Upload-Labs → Pikachu → 靶机提权</text>
    </g>
  </g>
# 第12章 DVWA其他模块与通关总结 🎯

## 开篇引入：打完收工？先别急着走！🤗

哈喽各位小伙伴！欢迎来到第12章！🎉

不知不觉，我们已经把DVWA里最核心的几个大漏洞都学完了——从暴力破解、命令注入、CSRF，到文件包含、文件上传、SQL注入，再到上一章的XSS，是不是感觉收获满满？就像打游戏通关了一个又一个Boss一样，超有成就感对不对？😎

但是呢，DVWA作为一个"专业靶场"，它的内容可不止这些！在左侧的菜单栏里，你可能还注意到了一些奇奇怪怪的模块，比如什么CAPTCHA、CSP、JavaScript之类的。这些模块虽然不如前面那几个"大牌"，但也是Web安全里非常重要的知识点，咱们可不能错过！

打个比方 🍔：

你去吃汉堡套餐，前面的大漏洞就像汉堡、薯条、可乐这些"主菜"，必须得吃。但是套餐里还有番茄酱、餐巾纸、小玩具这些"小东西"，虽然不是主食，但也很有用——番茄酱能让薯条更好吃，餐巾纸能擦手，小玩具能让你开心。

这一章里，我们就把DVWA里剩下的这些"小模块"快速过一遍，每个都给你讲明白是干啥的、怎么玩的。然后呢，我们再一起做个"通关总结"，聊聊从Low级别一路打到High级别，我们到底学到了啥，以后该怎么继续学习。

准备好了吗？让我们开始最后的"扫尾工作"，然后给DVWA之旅画上一个圆满的句号！💪

---

### 📍 全模块 · 三平台访问地址总表（一张表存好，以后随查随用 📚）

下面这张表把前面 10 个模块 + 本章 5 个小模块的 **Windows PHPStudy / Kali LAMP / Docker 三平台 URL** 一次性汇总，存进收藏夹，下次学其他靶场（Pikachu、Upload-Labs）还能对比参照：

| 章节 模块名 | 菜单路径 | 🪟 Windows PHPStudy | 🐧 **Kali LAMP（你在用 ✅）** | 🐳 Docker（端口 4280 · 拉不动换 ch04 §4.5/§4.7 ✅） |
|---|---|---|---|---|
| ⑤ 暴力破解 Brute Force | Left Menu | `http://localhost/dvwa/vulnerabilities/brute/` | `http://KALI_IP/dvwa/vulnerabilities/brute/` | `http://KALI_IP:4280/vulnerabilities/brute/` |
| ⑥ 命令注入 Command Inject | Left Menu | `http://localhost/dvwa/vulnerabilities/exec/` | `http://KALI_IP/dvwa/vulnerabilities/exec/` | `http://KALI_IP:4280/vulnerabilities/exec/` |
| ⑦ CSRF 跨站请求伪造 | Left Menu | `http://localhost/dvwa/vulnerabilities/csrf/` | `http://KALI_IP/dvwa/vulnerabilities/csrf/` | `http://KALI_IP:4280/vulnerabilities/csrf/` |
| ⑧ 文件包含 File Inclusion | Left Menu | `http://localhost/dvwa/vulnerabilities/fi/` | `http://KALI_IP/dvwa/vulnerabilities/fi/` | `http://KALI_IP:4280/vulnerabilities/fi/` |
| ⑨ 文件上传 File Upload | Left Menu | `http://localhost/dvwa/vulnerabilities/upload/` | `http://KALI_IP/dvwa/vulnerabilities/upload/` | `http://KALI_IP:4280/vulnerabilities/upload/` |
| ⑩ SQL 注入 (显注) | Left Menu | `http://localhost/dvwa/vulnerabilities/sqli/` | `http://KALI_IP/dvwa/vulnerabilities/sqli/` | `http://KALI_IP:4280/vulnerabilities/sqli/` |
| ⑩+ SQL 盲注 Blind | Left Menu | `http://localhost/dvwa/vulnerabilities/sqli_blind/` | `http://KALI_IP/dvwa/vulnerabilities/sqli_blind/` | `http://KALI_IP:4280/vulnerabilities/sqli_blind/` |
| ⑪ 反射型 XSS (R) | Left Menu | `http://localhost/dvwa/vulnerabilities/xss_r/` | `http://KALI_IP/dvwa/vulnerabilities/xss_r/` | `http://KALI_IP:4280/vulnerabilities/xss_r/` |
| ⑪ 存储型 XSS (S) | Left Menu | `http://localhost/dvwa/vulnerabilities/xss_s/` | `http://KALI_IP/dvwa/vulnerabilities/xss_s/` | `http://KALI_IP:4280/vulnerabilities/xss_s/` |
| ⑪ DOM 型 XSS (D) | Left Menu | `http://localhost/dvwa/vulnerabilities/xss_d/` | `http://KALI_IP/dvwa/vulnerabilities/xss_d/` | `http://KALI_IP:4280/vulnerabilities/xss_d/` |
| ⑫ CAPTCHA / CSP 等 | 剩余全部 | `http://localhost/dvwa/` → 左侧菜单 | `http://KALI_IP/dvwa/` → 左侧菜单 | `http://KALI_IP:4280/` → 左侧菜单 |
| 难度切换 DVWA Security | 左下角 | `http://localhost/dvwa/security.php` | `http://KALI_IP/dvwa/security.php` | `http://KALI_IP:4280/security.php` |
| 一键重置数据库 Setup | 左侧菜单 | `http://localhost/dvwa/setup.php` | `http://KALI_IP/dvwa/setup.php` | `http://KALI_IP:4280/setup.php` |

> 💡 **Kali 同学专用一行 IP 查询：** `KALI_IP=$(ip -4 a | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d/ -f1) ; echo "你的Kali IP是: $KALI_IP"`

---

### 🗺️ 图 12-1 DVWA 学习总路线图（4 难度 × 16 模块 × 3 平台 · 闯关顺序推荐）

这张图是你整个 DVWA 学习阶段的"高德地图导航"🗺️：**蓝色路径（入门 1 周）→ 黄色路径（进阶 2 周）→ 橙色路径（高级 2 周）→ 红色终点（源码审计）**。跟着箭头走，学完你对 Web 漏洞的理解就完整了。图里同时标出 **Kali LAMP 原生 / Docker 容器 / Windows PHPStudy** 三种环境各自最适合的阶段：

<svg viewBox="0 0 1160 620" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1020px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">

  <defs>
    <linearGradient id="road-blue" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#1f6feb"/><stop offset="100%" stop-color="#0b3b8a"/></linearGradient>
    <linearGradient id="road-yellow" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#e0a500"/><stop offset="100%" stop-color="#8a5a00"/></linearGradient>
    <linearGradient id="road-orange" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#d24a00"/><stop offset="100%" stop-color="#802800"/></linearGradient>
    <linearGradient id="road-red" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#a1003c"/><stop offset="100%" stop-color="#5c0020"/></linearGradient>
    <linearGradient id="env-tag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a3556"/><stop offset="100%" stop-color="#151a30"/></linearGradient>
    <marker id="road-ar" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#ffe16b"/></marker>
    <marker id="road-ar2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#ffa36b"/></marker>
    <marker id="road-ar3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#ff6b8a"/></marker>
  </defs>
  <text x="580" y="34" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 12-1  DVWA 闯关总路线图 · 从 Low 新手村 到 Impossible 源码审计 · 4 阶段 16 模块</text>
  <!-- 顶部：三环境徽章 -->
  <g font-family="Arial" font-size="13">
    <rect x="40" y="54" width="260" height="44" rx="11" fill="url(#env-tag)" stroke="#4490ff" stroke-width="1.3"/>
    <text x="170" y="82" text-anchor="middle" fill="#cfe1ff" font-weight="bold">🪟 Windows PHPStudy · 过渡用（推荐度 ⭐⭐⭐）</text>
    <rect x="320" y="54" width="480" height="44" rx="11" fill="url(#env-tag)" stroke="#3fb950" stroke-width="1.6"/>
    <text x="560" y="82" text-anchor="middle" fill="#c7f3d0" font-weight="bold">🐧 Kali Linux 原生 LAMP · 全程推荐 ✅ 你现在用的就是这个！（⭐⭐⭐⭐⭐）</text>
    <rect x="820" y="54" width="300" height="44" rx="11" fill="url(#env-tag)" stroke="#a371f7" stroke-width="1.3"/>
    <text x="970" y="82" text-anchor="middle" fill="#e3d0ff" font-weight="bold">🐳 Docker 一行拉起 · 临时复现最爱（⭐⭐⭐⭐）</text>
  </g>
  <!-- 阶段一：入门 蓝色 -->
  <g font-family="Arial">
    <rect x="20" y="118" width="1120" height="108" rx="14" fill="url(#road-blue)" stroke="#4490ff" stroke-width="1.5"/>
    <text x="40" y="144" fill="#fff" font-weight="bold" font-size="15">🎓 阶段一：Low 难度 · 新手村（1 周 · 先把 8 个大模块各打一遍）</text>
    <g font-size="12.5" fill="#e6efff">
      <rect x="40"  y="158" width="126" height="56" rx="8" fill="#001c4a" stroke="#4490ff"/><text x="103" y="182" text-anchor="middle" font-weight="bold">⑤ Brute Force</text><text x="103" y="202" text-anchor="middle">hydra / burp · 字典爆破</text>
      <line x1="166" y1="186" x2="190" y2="186" stroke="#4490ff" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="192" y="158" width="126" height="56" rx="8" fill="#001c4a" stroke="#4490ff"/><text x="255" y="182" text-anchor="middle" font-weight="bold">⑥ Cmd Injection</text><text x="255" y="202" text-anchor="middle">; &#124; &amp;&amp; · 管道连符</text>
      <line x1="318" y1="186" x2="342" y2="186" stroke="#4490ff" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="344" y="158" width="126" height="56" rx="8" fill="#001c4a" stroke="#4490ff"/><text x="407" y="182" text-anchor="middle" font-weight="bold">⑦ CSRF</text><text x="407" y="202" text-anchor="middle">借刀杀人 · 改密码</text>
      <line x1="470" y1="186" x2="494" y2="186" stroke="#4490ff" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="496" y="158" width="126" height="56" rx="8" fill="#001c4a" stroke="#4490ff"/><text x="559" y="182" text-anchor="middle" font-weight="bold">⑧ File Include</text><text x="559" y="202" text-anchor="middle">php://filter · LFI/RFI</text>
      <line x1="622" y1="186" x2="646" y2="186" stroke="#4490ff" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="648" y="158" width="126" height="56" rx="8" fill="#001c4a" stroke="#4490ff"/><text x="711" y="182" text-anchor="middle" font-weight="bold">⑨ File Upload</text><text x="711" y="202" text-anchor="middle">图片马 · Weevely shell</text>
      <line x1="774" y1="186" x2="798" y2="186" stroke="#4490ff" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="800" y="158" width="126" height="56" rx="8" fill="#001c4a" stroke="#4490ff"/><text x="863" y="182" text-anchor="middle" font-weight="bold">⑩ SQL Inject</text><text x="863" y="202" text-anchor="middle">order by · union select</text>
      <line x1="926" y1="186" x2="950" y2="186" stroke="#4490ff" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="952" y="158" width="176" height="56" rx="8" fill="#001c4a" stroke="#4490ff"/><text x="1040" y="182" text-anchor="middle" font-weight="bold">⑪ XSS (R+S+D) 三种</text><text x="1040" y="202" text-anchor="middle">img onerror · script · #锚点</text>
    </g>
  </g>
  <!-- 阶段二：进阶 黄色 -->
  <g font-family="Arial">
    <rect x="20" y="244" width="1120" height="108" rx="14" fill="url(#road-yellow)" stroke="#ffe16b" stroke-width="1.5"/>
    <text x="40" y="270" fill="#fff" font-weight="bold" font-size="15">🔐 阶段二：Medium 难度 · 第一次绕过（2 周 · 学会每种漏洞基础绕过姿势）</text>
    <g font-size="12.5" fill="#fff3c2">
      <rect x="40"  y="284" width="170" height="56" rx="8" fill="#3a2a00" stroke="#ffe16b"/><text x="125" y="308" text-anchor="middle" font-weight="bold">绕过1：strip_tags / str_replace</text><text x="125" y="328" text-anchor="middle">大小写 · 双写 · &lt;img&gt; 其他标签</text>
      <line x1="210" y1="312" x2="240" y2="312" stroke="#ffe16b" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="242" y="284" width="170" height="56" rx="8" fill="#3a2a00" stroke="#ffe16b"/><text x="327" y="308" text-anchor="middle" font-weight="bold">绕过2：mysql_real_escape</text><text x="327" y="328" text-anchor="middle">宽字节 · 二次注入 · ORDER BY</text>
      <line x1="412" y1="312" x2="442" y2="312" stroke="#ffe16b" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="444" y="284" width="170" height="56" rx="8" fill="#3a2a00" stroke="#ffe16b"/><text x="529" y="308" text-anchor="middle" font-weight="bold">绕过3：Content-Type</text><text x="529" y="328" text-anchor="middle">Burp 修改 Content-Type 头</text>
      <line x1="614" y1="312" x2="644" y2="312" stroke="#ffe16b" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="646" y="284" width="170" height="56" rx="8" fill="#3a2a00" stroke="#ffe16b"/><text x="731" y="308" text-anchor="middle" font-weight="bold">绕过4：黑名单后缀</text><text x="731" y="328" text-anchor="middle">.php5 .phtml .htaccess %00截断</text>
      <line x1="816" y1="312" x2="846" y2="312" stroke="#ffe16b" stroke-width="1.6" marker-end="url(#road-ar)"/>
      <rect x="848" y="284" width="280" height="56" rx="8" fill="#3a2a00" stroke="#ffe16b"/><text x="988" y="308" text-anchor="middle" font-weight="bold">🔥 Kali 实操：Burp Intruder / sqlmap / Hydra</text><text x="988" y="328" text-anchor="middle">每个工具至少手动跑 3 次，烂熟于心</text>
    </g>
  </g>
  <!-- 阶段三：高级 橙色 -->
  <g font-family="Arial">
    <rect x="20" y="370" width="1120" height="108" rx="14" fill="url(#road-orange)" stroke="#ffa36b" stroke-width="1.5"/>
    <text x="40" y="396" fill="#fff" font-weight="bold" font-size="15">🚀 阶段三：High 难度 · 组合拳挑战（2 周 · 多步绕过 + Token + 文件内容检测）</text>
    <g font-size="12.5" fill="#ffe6d0">
      <rect x="40"  y="410" width="210" height="56" rx="8" fill="#4a1800" stroke="#ffa36b"/><text x="145" y="434" text-anchor="middle" font-weight="bold">High 1：user_token 机制</text><text x="145" y="454" text-anchor="middle">Burp Pitchfork + Grep-Extract</text>
      <line x1="250" y1="438" x2="280" y2="438" stroke="#ffa36b" stroke-width="1.6" marker-end="url(#road-ar2)"/>
      <rect x="282" y="410" width="210" height="56" rx="8" fill="#4a1800" stroke="#ffa36b"/><text x="387" y="434" text-anchor="middle" font-weight="bold">High 2：图片二次渲染</text><text x="387" y="454" text-anchor="middle">copy 命令 + php://filter + 文件包含上传</text>
      <line x1="492" y1="438" x2="522" y2="438" stroke="#ffa36b" stroke-width="1.6" marker-end="url(#road-ar2)"/>
      <rect x="524" y="410" width="210" height="56" rx="8" fill="#4a1800" stroke="#ffa36b"/><text x="629" y="434" text-anchor="middle" font-weight="bold">High 3：SQL 盲注 布尔/时间</text><text x="629" y="454" text-anchor="middle">substring(ascii(mid(...))) · sqlmap --level 3</text>
      <line x1="734" y1="438" x2="764" y2="438" stroke="#ffa36b" stroke-width="1.6" marker-end="url(#road-ar2)"/>
      <rect x="766" y="410" width="362" height="56" rx="8" fill="#4a1800" stroke="#ffa36b"/><text x="947" y="434" text-anchor="middle" font-weight="bold">🐧 Kali 全家桶联动：sqlmap -r request.txt + Burp + BeEF</text><text x="947" y="454" text-anchor="middle">请求保存为 txt，用 sqlmap 读包跑 / Beef 挂僵尸 XSS 组合</text>
    </g>
  </g>
  <!-- 阶段四：终点 红色 -->
  <g font-family="Arial">
    <rect x="20" y="496" width="1120" height="108" rx="14" fill="url(#road-red)" stroke="#ff6b8a" stroke-width="1.5"/>
    <text x="40" y="522" fill="#fff" font-weight="bold" font-size="15">🏆 阶段四：Impossible 难度 + 小模块扫尾 · 源码审计（1 周 · 学正确写法，彻底理解漏洞根因）</text>
    <g font-size="12.5" fill="#ffd7df">
      <rect x="40"  y="536" width="180" height="56" rx="8" fill="#400016" stroke="#ff6b8a"/><text x="130" y="560" text-anchor="middle" font-weight="bold">Imp 1：PDO / htmlspecialchars</text><text x="130" y="580" text-anchor="middle">白名单 · 输出编码 · 预编译</text>
      <line x1="220" y1="564" x2="250" y2="564" stroke="#ff6b8a" stroke-width="1.6" marker-end="url(#road-ar3)"/>
      <rect x="252" y="536" width="180" height="56" rx="8" fill="#400016" stroke="#ff6b8a"/><text x="342" y="560" text-anchor="middle" font-weight="bold">Imp 2：CSRF Token</text><text x="342" y="580" text-anchor="middle">checkToken · 生成-校验双保险</text>
      <line x1="432" y1="564" x2="462" y2="564" stroke="#ff6b8a" stroke-width="1.6" marker-end="url(#road-ar3)"/>
      <rect x="464" y="536" width="180" height="56" rx="8" fill="#400016" stroke="#ff6b8a"/><text x="554" y="560" text-anchor="middle" font-weight="bold">Imp 3：锁定/验证码/哈希</text><text x="554" y="580" text-anchor="middle">password_hash · 3次锁15分</text>
      <line x1="644" y1="564" x2="674" y2="564" stroke="#ff6b8a" stroke-width="1.6" marker-end="url(#road-ar3)"/>
      <rect x="676" y="536" width="180" height="56" rx="8" fill="#400016" stroke="#ff6b8a"/><text x="766" y="560" text-anchor="middle" font-weight="bold">其他小模块通关</text><text x="766" y="580" text-anchor="middle">CAPTCHA · CSP · SessionID · JS</text>
      <line x1="856" y1="564" x2="886" y2="564" stroke="#ff6b8a" stroke-width="1.6" marker-end="url(#road-ar3)"/>
      <rect x="888" y="536" width="240" height="56" rx="8" fill="#200" stroke="#3fb950" stroke-width="2"/>
      <text x="1008" y="558" text-anchor="middle" fill="#9effa0" font-weight="bold" font-size="14">🎓✅ DVWA 通关！下一站：</text>
      <text x="1008" y="580" text-anchor="middle" fill="#9effa0" font-size="13">SQLi-Labs → Upload-Labs → Pikachu → 靶机提权</text>
    </g>
  </g>
</svg>

---

### 🔥 Kali / Docker 同学 · 通关后必做清单（6 条 checklist ✅ 勾完才算真毕业 🎓）

1. **✅ 已用 Kali Hydra 爆破 Brute Force Low/Medium/High**（`hydra -l admin -P rockyou.txt ... http-form-get` 三条命令都跑过）
2. **✅ 已用 Kali sqlmap 爆破 SQL 注入显注 + 盲注**（`sqlmap -u URL --cookie=... --dump -D dvwa -T users` + `--technique BST` 盲注都跑过）
3. **✅ 已用 Weevely / 图片马 组合完成 File Upload + File Include Getshell**（`weevely generate / weevely http://KALI_IP/dvwa/hackable/uploads/xxx.php` 成功连接）
4. **✅ 已用 BeEF 完成存储型 XSS 僵尸控制**（留言板注入 `<script src=hook.js>`，BeEF 面板能看到 victim 上线，做过截图 / Cookie 窃取）
5. **✅ 已对比过三种环境：Windows PHPStudy、Kali LAMP、Docker web-dvwa**（知道各自优缺点；以后其他靶场 90% 用 Kali LAMP 或 Docker）
6. **✅ 已完成 1 次 "环境搭坏了就重置" 演练**（`docker rm -f dvwa-test && docker run ...` 或 访问 `/setup.php` 一键重置 DB，不慌不忙）

> 🐳 **Docker 版一键重置（就这 2 行）：**
> ```bash
> docker rm -f dvwa-test
> docker run -d --name dvwa-test -p 4280:80 vulnerables/web-dvwa
> ```
> 🐧 **Kali LAMP 版一键重置数据库（2 行）：**
> ```bash
> mariadb -u root -ppassword -e "DROP DATABASE IF EXISTS dvwa;"
> curl -sS "http://127.0.0.1/dvwa/setup.php" -d "create_db=Create+%2F+Reset+Database" | grep -E "Success|Failed"
> ```

---

## DVWA其他模块快速通关 ⚡

前面的大模块我们都讲得很细，这一章的这些小模块我们就"快速通关"，每个都讲清楚原理，但不会像前面那样深入到每个级别的每一行代码。毕竟咱们的目标是"了解全貌"，而不是"死磕细节"。

就像旅游一样，著名景点我们慢慢逛，小景点就拍照打卡，到此一游！📸

### 一、Insecure CAPTCHA（不安全的验证码）🤖

#### 什么是验证码？为什么要有验证码？

首先，我们得搞明白：**CAPTCHA（验证码）到底是个啥？**

CAPTCHA的全称很长，叫"Completely Automated Public Turing test to tell Computers and Humans Apart"，翻译过来就是"全自动区分计算机和人类的图灵测试"。名字是不是很绕？没关系，大白话讲就是：

> **验证码就是用来区分"你是人还是机器人"的东西。**

生活例子 🎫：

你有没有去过那种热门的网红餐厅？饭点的时候人特别多，门口排大队。这时候餐厅可能会搞个"取号机"，你取个号，叫到你了才能进去。

但是如果有人搞了一堆机器人来取号，把号都占满了，真正的顾客反而吃不上饭了，那怎么办？餐厅就得想办法确认"取号的是真人还是机器人"。

验证码干的就是这个活儿！网站用验证码来防止：
- 机器人批量注册账号 📱
- 机器人暴力破解密码 🔐
- 机器人刷屏发广告 📢
- 机器人刷票、刷赞 👍

总之，验证码就是"防机器人"的一道门槛。常见的验证码有：
- 图片验证码（歪歪扭扭的文字）🖼️
- 滑动验证码（拖动滑块拼图片）🎚️
- 点选验证码（点击图中的特定物体）👆
- 短信验证码（给你手机发验证码）📩

那为啥叫"Insecure CAPTCHA"（不安全的验证码）呢？因为如果验证码设计得有问题，不但防不住机器人，反而会被人轻易绕过，那就等于白装了！

#### Low级别：验证码可以重复用？

Low级别的验证码有多菜呢？这么说吧——它就像小区门口的保安，你今天拿了个门禁卡进去了，第二天这张卡还能用，第三天还能用...用一万次都没问题！

**问题出在哪？** 验证码验证通过之后，没有"销毁"这个验证码。也就是说，同一个验证码可以反复使用。

打个比方 🎟️：

你去电影院看电影，买了一张票。正常情况下，检票员撕了票根之后，这张票就作废了，你不能再用它看第二场。

但是如果检票员不撕票根呢？你看完第一场，拿着这张票又去看第二场，第三场...看一天都没人管！这就Low级别的问题——**一次性验证码变成了"永久有效"。**

**怎么绕过？** 很简单：
1. 先手动过一次验证码，拿到验证通过的状态
2. 然后用Burp Suite抓包，把请求反复发
3. 因为验证码没过期，所以每次都能通过

是不是很离谱？但现实中真的有网站犯这种低级错误！😅

#### Medium级别：稍微强了一点，但还是不够

Medium级别比Low级别稍微好一点——它会检查验证码是不是"正确"的，但是验证逻辑还是有问题。比如可能验证码只在"第一次提交"的时候检查，后面就不检查了；或者客户端验证完了，服务器端就不验证了。

打个比方 🎫：

这次电影院改进了——每张票只能用一次。但是呢，检票员只在入口处检票，你进去之后，可以从厕所的窗户爬出来再进去一次，检票员根本不管。

Medium级别的问题通常是：**验证逻辑不完整，有漏洞可钻。**

#### High级别：更复杂，但依然可能有问题

High级别的验证码就比较像回事了——每次刷新页面都会生成新的验证码，用一次就作废，服务器端也会验证。

但是！就算是这样，也不代表绝对安全。比如：
- 验证码图片太简单，OCR软件能自动识别 🔍
- 验证码的生成有规律，可以预测 🎲
- 验证逻辑有bug，可以绕过

打个比方 🎫：

电影院的检票系统更严了，票是实名制的，一人一票，进场刷身份证。但是呢，检票员只看身份证是不是真的，不看身份证上的照片和本人像不像——那你拿着别人的身份证也能进去！

所以说，安全这事儿，真是道高一尺魔高一丈啊！👻

---

### 二、Weak Session IDs（弱会话ID）🆔

#### Session是什么？用户的"身份证号"

在讲弱会话ID之前，我们得先搞明白：**Session（会话）是个啥？Session ID又是个啥？**

生活例子 🏨：

你去住酒店，到前台办理入住。前台看了你的身份证，给了你一张房卡。你拿着这张房卡，就能开房门、用电梯、去健身房...只要在酒店里，这张房卡就是你的"身份证明"。

你不用每次开房门都掏身份证，只要出示房卡就行。退房的时候，你把房卡还给前台，这张房卡就作废了。

**Session就是你住酒店的这段时间，Session ID就是你的房卡号！**

放到网站里也是一样的：
- 你输入用户名密码登录网站 ✅
- 服务器验证通过后，给你创建一个"会话（Session）"
- 服务器给你一个"会话ID（Session ID）"，存在你的浏览器的Cookie里 🍪
- 之后你访问网站的任何页面，只要带上这个Session ID，服务器就知道"哦，是你啊"，不用你再输密码了
- 你退出登录的时候，服务器销毁这个Session，Session ID就作废了

是不是很好理解？Session ID就是你在网站上的"临时身份证号"！

#### Session ID泄露了会怎么样？会话劫持！

那你可能会问：Session ID这玩意儿重要吗？被别人知道了会咋样？

答案是：**非常重要！被别人知道了，你的账号就等于送人了！**

生活例子 🏨：

你住酒店，房卡不小心丢了，被坏人捡到了。坏人拿着你的房卡，就能直接进你的房间，用你的东西，喝你房间里的矿泉水...前台根本分不清他是不是真的住客，因为他有房卡啊！

网站里也是一样的：
- 如果攻击者拿到了你的Session ID
- 他就可以把自己浏览器里的Session ID改成你的
- 然后服务器就会把他当成你
- 他就能用你的账号干任何事情——发帖、转账、改密码...

这就叫**会话劫持（Session Hijacking）**，也叫"Cookie劫持"，因为Session ID通常存在Cookie里。

#### 什么样的Session ID是"弱"的？

那什么样的Session ID是不安全的呢？很简单——**能被猜到的，就是弱的！**

如果Session ID是随机的一大串乱码，比如 `a3f8b2x9c1d4e7f6...`，那攻击者根本猜不到，就很安全。

但如果Session ID是有规律的，比如：
- `1, 2, 3, 4, 5...` （递增数字）
- `20260625120000` （时间戳）
- `user1, user2, user3...` （用户名+数字）

那攻击者随便猜猜就能猜到别人的Session ID，然后就能冒充别人登录了！

#### Low级别：纯数字递增，猜就完了！

Low级别的Session ID有多弱呢？这么说吧——你第一次登录，Session ID是1；第二次登录，Session ID是2；第三次是3...就这么往上加！

这就好比酒店的房卡号是1、2、3、4...你拿着1号房卡，试试2号，哎？也能打开！再试3号，也能打开！整个酒店的房间你都能随便进！🏨😱

**怎么攻击？** 太简单了：
1. 你自己登录一下，看看你的Session ID是啥，比如是100
2. 那你试试99、98、97...
3. 试到一个有效的，你就成功劫持了别人的会话！

#### Medium级别：用时间戳，也能猜到

Medium级别学聪明了，不用递增数字了，改用时间戳了。比如你2026年6月25日12点整登录的，Session ID可能就是 `20260625120000` 这样的格式。

但是时间戳这玩意儿，也是有规律的啊！比如你知道某个用户大概是几点登录的，你就能在那个时间范围内猜，也能猜中！

打个比方 🎫：

酒店改进了房卡编号方式，不用1、2、3了，改用"入住时间"当房卡号。比如你下午2点15分入住的，房卡号就是 `1415`。

但是呢，如果我知道你大概是下午2点多入住的，我就从1400试到1430，一共才30个，很快就能试出来！

#### High级别：更复杂，但可能还是有规律

High级别的Session ID就更复杂了，可能是"用户名+时间戳+随机数"拼起来的，或者用了更复杂的算法。

但是只要它不是"真随机"生成的，理论上就有被猜到的可能。比如随机数的种子是固定的，那生成的"随机数"其实也是有规律的。

**真正安全的Session ID应该是什么样的？** 应该是：
- 足够长（至少32位）📏
- 完全随机（没有任何规律）🎲
- 用加密安全的随机数生成器生成 🔐
- 定期过期、定期更换 ⏰

这样攻击者就算想猜，也根本无从下手！

---

### 三、CSP Bypass（内容安全策略绕过）🛡️

#### CSP是什么？防御XSS的"金钟罩"

CSP的全称是**Content Security Policy**（内容安全策略）。听名字就很厉害对不对？它是干啥的呢？

大白话讲：**CSP就是网站给浏览器定的"规矩"——这个页面只能加载哪些资源，不能加载哪些资源。**

我们上一章学过XSS，攻击者可以往页面里插恶意脚本。那CSP就是用来防XSS的——就算攻击者成功插入了脚本，如果CSP规定"不准执行外部来源的脚本"，那浏览器也不会执行这段恶意代码！

生活例子 🏢：

你公司的大楼有个门禁系统，规定"只有本公司员工才能进"。门口的保安手里有一份"白名单"，只有在名单上的人才能进去，其他人一律拦在外面。

CSP就是这个门禁系统，它告诉浏览器：
- 只能从这个域名加载JavaScript 📜
- 只能从那个域名加载图片 🖼️
- 只能从某某地方加载字体 🅰️
- 不准执行内联的脚本 ❌
- 不准用eval()这种危险函数 ❌

这样一来，就算攻击者往页面里插了 `<script>alert('xss')</script>`，浏览器一看："哦，CSP说不准执行内联脚本"，然后就不执行了。XSS攻击就失败了！

是不是很厉害？CSP就像给网站穿了一件"防弹衣"！🦺

#### 但是！CSP配置不好也能绕过

CSP虽然厉害，但它有个前提——**你得配置对了才行！** 如果配置得有问题，那这件"防弹衣"就到处是破洞，根本防不住子弹。

就像你公司的门禁系统，如果保安只看"是不是人"，不管是不是本公司的，那谁都能进，门禁等于白装！

#### Low级别：轻轻松松绕过去

Low级别的CSP配置得有多烂呢？比如它可能只限制了"脚本必须从某个域名加载"，但是那个域名本身就有漏洞，或者它允许了一些不安全的写法。

举个例子，CSP里写了 `script-src 'unsafe-inline'`，那意思就是"允许内联脚本"——那攻击者直接插内联脚本就行了，CSP等于没设防！

或者CSP里允许从某个CDN加载脚本，但是那个CDN上可以上传任意文件，那攻击者就把恶意脚本传到那个CDN上，然后引用它，照样能执行！

打个比方 🏢：

公司门禁说"只有戴工牌的人才能进"。但是工牌谁都能做，淘宝上10块钱一个，那这个门禁有啥用？

---

### 四、JavaScript攻击 💻

#### 客户端验证：只在浏览器里检查，靠不住！

JavaScript攻击是什么意思呢？简单说就是——**网站把验证逻辑写在前端的JS里，以为这样就安全了，其实根本靠不住！**

什么是"客户端验证"？举个例子：
- 你注册账号，密码要求至少8位
- 你输入了6位密码，还没点提交呢，页面上就弹出个提示："密码太短了！"
- 这个提示就是JavaScript在你浏览器里检查的，根本没传到服务器

那这有什么问题呢？问题大了！**前端验证只能用来"提升用户体验"，绝对不能用来做安全校验！**

生活例子 🎓：

你考试的时候，老师让你自己改卷子，自己打分。你说你会考多少分？肯定是满分啊！😆

客户端JS验证就是这么回事——验证逻辑在你自己的浏览器里，你想怎么改就怎么改。你把"密码至少8位"改成"密码至少1位"，不就行了？

#### 怎么绕过客户端JS验证？

绕过的方法多了去了，随便说几个：

**方法一：直接改JS代码 ✏️**
- 按F12打开开发者工具
- 找到验证用的JS代码
- 直接把验证逻辑改掉或者删掉
- 然后你想输啥就输啥

**方法二：禁用JavaScript 🚫**
- 浏览器设置里把JavaScript关掉
- 然后JS验证就完全失效了
- 你直接提交就行

**方法三：用Burp Suite改包 📦**
- 先输入正常的内容，通过JS验证
- 抓包，把请求里的内容改成恶意的
- 然后发给服务器
- 服务器那边没验证的话，就中招了

打个比方 🚪：

酒店的房门装了个指纹锁，看着很高端。但是这个锁只装在门内侧，外面根本没锁——你从外面直接一推就开了！

前端JS验证就是这个"只装在里面的锁"——它只能防"听话的用户"，对于懂点技术的攻击者来说，形同虚设！

所以记住这句话：**所有的客户端验证都是不可信的，服务器端必须再验证一遍！**

---

### 五、其他模块：简单认识一下 📋

DVWA里还有几个更小的模块，我们就更快速地带过一下，你知道有这么个东西就行。以后遇到了再深入研究！

#### 1. Open HTTP Redirect（开放式重定向）

**什么是开放式重定向？**
网站有个跳转功能，比如 `jump.php?url=https://www.baidu.com`，访问这个地址就会跳转到百度。

但是如果网站没有检查 `url` 参数是不是"自己人"，那攻击者就可以构造这样的链接：
`jump.php?url=https://www.diaoyu.com`

用户一看，域名是正规网站的域名啊，应该没问题，点了！结果一跳就跳到钓鱼网站去了...

生活例子 🚌：

你在公交站等车，来了一辆公交车，车头写着"去往火车站"。你放心地上车了，结果车开着开着，把你拉到了一个陌生的地方——原来终点站的牌子被人改了！

开放式重定向就是这样——你信任的是前面的域名，但最后跳转到哪，全是后面的参数说了算。

#### 2. HTTP Header Injection（HTTP头注入）

**什么是HTTP头注入？**
我们上网的时候，浏览器和服务器之间会传"HTTP头"，里面有各种信息，比如User-Agent（你用的什么浏览器）、Cookie、Referer（你从哪个页面来的）等等。

如果网站把用户输入的内容直接放到HTTP头里，那攻击者就可以注入一些特殊的字符，篡改HTTP头的内容，甚至注入新的HTTP头。

生活例子 ✉️：

你寄一封信，信封上写着收件人地址。但是如果邮局只看"第一行写的是收件人地址"，不检查你写了几行。那你就可以在收件人地址下面再写一行"麻烦把这封信拆开看看，里面有100块钱，归你了"——邮局的人还以为是邮局的规定呢！

#### 3. Blin SQL Injection（盲注）

这个其实还是SQL注入，只不过是"盲注"——你看不到数据库返回的具体数据，只能通过页面的变化（比如正常显示还是报错）来判断你的SQL语句对不对。

就像你在一个黑屋子里找东西，你看不见东西在哪，但是你可以用手摸，摸一下就知道"哦，这是墙"、"哦，这是桌子"。盲注就是靠"摸"来一点点"摸"出数据库里的数据。

这个我们后面在SQLi-Labs里会详细讲，这里先知道有这么个东西就行！

---

## DVWA通关心得与经验分享 🎓

好啦，DVWA的所有模块我们都过了一遍了！从最开始的暴力破解，到现在的各种小模块，一路走来，是不是感觉自己变强了？💪

在进入下一个阶段之前，我们先停下来，总结一下——我们到底学到了什么？这些漏洞背后，有没有什么共同的规律？

### 一、漏洞的本质：信任了不可信的输入！🤔

你有没有发现，我们学的这些漏洞，虽然名字不一样，表现形式不一样，但本质上都是一回事？

- **SQL注入**：你输入的SQL语句被执行了 → 信任了用户输入
- **XSS**：你输入的脚本被执行了 → 信任了用户输入
- **命令注入**：你输入的系统命令被执行了 → 信任了用户输入
- **文件包含**：你输入的文件名被包含了 → 信任了用户输入
- **文件上传**：你上传的文件被保存了 → 信任了用户输入
- **CSRF**：攻击者伪造的请求被当成用户的了 → 信任了请求来源

发现了吗？所有这些漏洞的根源，都是一句话：

> **程序信任了不该信任的东西——也就是用户的输入！**

生活例子 🏠：

你家的大门，本来应该只给有钥匙的家人开。但是如果你"信任"所有敲门的人，谁敲门你都开，那坏人不就直接进来了？

程序也是一样的——用户的输入就是"敲门的人"，你不能谁敲门都开门，你得检查检查这人是谁，有没有恶意。

**记住：永远不要信任用户的输入！** 这句话是Web安全的第一真理，你记一辈子都不会错！📌

### 二、防御的本质：不信任任何用户输入！🛡️

既然漏洞的本质是"信任了不可信的输入"，那防御的本质就很简单了——**不信任任何用户输入！**

怎么个"不信任"法呢？主要有几招：

#### 1. 过滤：把"坏东西"拦在外面 🚧

用户输入的内容，你得检查检查，把危险的字符、危险的关键词都过滤掉。就像机场的安检，你带的包里有刀有枪，直接给你扣下来。

但是！**过滤是个技术活**，不是随便写写就行的。比如你想过滤 `<script>` 标签，攻击者可以用 `<Script>`、`<scr<script>ipt>` 各种变形绕过你。

所以过滤有个名字，叫"黑名单"——我列一个"坏人名单"，名单上的都不让进。

#### 2. 白名单：只让"好人"进来 ✅

比黑名单更靠谱的，是"白名单"——我列一个"好人名单"，只有名单上的才能进，其他的一律不让进。

比如用户输入"性别"，只能是"男"或"女"，其他的都不接受。再比如文件上传，只允许传jpg、png格式的图片，其他的都拒绝。

白名单为啥比黑名单靠谱？因为：
- 黑名单：坏人太多了，你列不完，总会漏掉几个 😫
- 白名单：好人就那几个，我都列出来，不是好人的全滚蛋 😎

打个比方 🏢：

黑名单就像公司门口的保安，手里拿着一张"通缉犯名单"，只要不是通缉犯都能进。问题是，通缉犯那么多，你列得完吗？

白名单就像公司门口的保安，手里拿着一张"员工名单"，只有在名单上的才能进。虽然也可能有外人混进来，但总体安全多了！

**记住：能使用白名单的地方，一定要用白名单！白名单才是王道！** 👑

#### 3. 转义：把"坏人"变成"好人" 🔄

有些时候，用户输入的内容你必须得用，不能直接拒了。那怎么办？你可以"转义"一下——把那些有特殊含义的字符，变成普通的字符。

比如在HTML里，`<` 和 `>` 是标签的符号，有特殊含义。你把它们变成 `&lt;` 和 `&gt;`，它们就变成普通字符了，不会被当成标签解析。

这就好比——你知道来的人可能是坏人，但你又不能不让他进来，那你就把他的手脚都绑上，让他干不了坏事。😆

---

### 三、从Low到High，我们看到了什么？📈

不知道你有没有注意到，DVWA的四个级别（Low、Medium、High、Impossible），其实就是"程序员防御水平不断提升"的过程：

- **Low级别**：完全没防御，裸奔，漏洞一大堆 😇
- **Medium级别**：有防御意识了，但写得很烂，轻易就能绕过 😅
- **High级别**：防御写得像模像样了，但可能还有漏洞可钻 🤔
- **Impossible级别**：防御基本到位了，很难打下来 ✅

这个过程，其实就是真实世界里网站安全水平的缩影！有的网站就像Low级别，漏洞百出；有的像Medium，防了但没防住；有的像High，挺安全但可能还有0day；极少数能做到Impossible级别，基本无懈可击。

**那我们学这些级别的意义是什么呢？**
- 学Low级别：了解漏洞最原始的样子，理解原理
- 学Medium级别：知道常见的"不靠谱防御"有哪些，怎么绕过
- 学High级别：学习更高级的绕过技巧
- 学Impossible级别：学习正确的防御方法应该怎么写

所以，别光顾着"打通关"，每个级别都好好看看源代码，想想：
- 这个级别是怎么防御的？
- 我是怎么绕过的？
- 它的防御哪里有问题？
- 如果让我写，我会怎么写？

这样你才是真的"学会了"，而不是"记住了几个payload"。💡

---

### 四、安全是一个整体，不是靠某一个措施 🧱

还有一个很重要的心得：**安全是一个系统工程，不是靠某一个措施就能搞定的。**

什么意思呢？比如你防XSS，你不能只靠CSP，你还得：
- 对用户输入做过滤/转义
- 对输出内容做编码
- 设置HttpOnly Cookie（防止Cookie被偷）
- 设置CSP
- ...

好几层防御叠在一起，就算某一层被绕过了，还有下一层挡着。这就叫"纵深防御"。

生活例子 🏰：

古代的城堡，防御工事不是只有一道墙，而是有好几层：
- 最外面有护城河
- 然后是外墙
- 然后是内墙
- 然后是城门楼
- 最后还有城堡主塔

敌人攻破了一道防线，还有下一道。你想打到最里面，难度大了去了！

网站安全也是一样的——不要指望"一招鲜吃遍天"，得多层防护叠加，才能真正安全。

---

## 新手学习建议 📚

聊完了心得，咱们再说说"新手该怎么学"。很多刚入门的小伙伴容易走弯路，我给大家提几个建议，都是过来人的经验之谈，希望能帮到你！😊

### 一、一定要动手打，别光看！👋

这是最重要的一条，没有之一！

很多小伙伴喜欢"看教程"、"看视频"，看的时候觉得"哦，我懂了"、"这么简单啊"，但是一到自己动手，就各种报错、各种不会。

为啥？因为**看和做完全是两码事！** 就像你看别人游泳，看100遍你也不会游，你得自己下水去扑腾，喝几口水，才能学会。

打个比方 🍳：

你看美食博主做蛋糕，步骤都记下来了：打鸡蛋、加面粉、放烤箱...感觉挺简单啊。但是真让你自己做，你可能打鸡蛋把蛋壳打进去了，面粉放多了，烤箱温度设错了...最后做出来的东西跟石头一样硬。🤣

安全学习也是一样的——必须动手！每一个漏洞，你都得自己亲手打一遍，看着payload在你手里执行成功了，你才是真的学会了。

**记住：看10遍教程，不如亲手打1遍！**

### 二、从Low到High，循序渐进 📶

很多小伙伴一上来就想打High级别、打Impossible级别，觉得"打低级的没意思"。千万别这样！

学习就像爬楼梯，你得一步一步来。你连Low级别都没搞明白，直接去打High级别，那肯定是一脸懵，打击自信心。

正确的顺序是：
1. 先打Low级别，理解漏洞原理 ✅
2. 再打Medium级别，了解基础的绕过
3. 再打High级别，学习更高级的技巧
4. 最后看Impossible级别，学习正确的防御方法

一步一个脚印，稳扎稳打，这样基础才扎实。

打个比方 🎮：

你玩RPG游戏，刚满级就想去打最终Boss，那肯定被Boss一巴掌拍死。你得先从小怪打起，慢慢升级，攒装备，练技术，最后才能去挑战Boss。

### 三、不要只记payload，要理解原理！🧠

很多新手喜欢"背payload"——这个漏洞用这个payload，那个漏洞用那个payload，背了一大堆。但是稍微变个环境，就不会了。

为啥？因为**你只记住了"怎么做"，没搞明白"为什么"。**

就像学数学，你背了一堆公式，但是不知道公式是怎么来的，题目稍微变个形，你就不会做了。

正确的学习方法是：
- 这个漏洞的原理是什么？
- 为什么会产生这个漏洞？
- 这个payload为什么能成功？
- 它的每一部分是什么意思？

把这些搞懂了，就算环境变了，你也能根据原理调整payload，举一反三。

**记住：payload是死的，原理是活的。理解了原理，你自己就能写出payload！**

### 四、每学一个漏洞，都想想怎么防御 🛡️

很多人学安全，只学"怎么攻击"，不学"怎么防御"。这是不对的！

你想想，你学攻击是为了啥？最终不还是为了防御吗？你知道怎么攻击，才能知道怎么防啊！

而且，理解了防御方法，反过来也能帮你更好地理解攻击——你知道对方是怎么防的，你就知道该怎么绕。

所以，每学一个漏洞，都问问自己：
- 如果我是程序员，我会怎么防这个漏洞？
- 官方推荐的防御方法是什么？
- 常见的防御误区有哪些？

攻防一体，你才能学得更透彻！⚔️🛡️

### 五、打好基础再用工具，先手工，再工具！🔧

现在网上各种自动化工具满天飞，SQLMap啊、Burp Suite啊、XSS平台啊...新手一看，哇，这么厉害！输入个网址自动就出漏洞了？那我还学啥原理，直接用工具不就行了？

大错特错！❌

工具只是"辅助"，它不能代替你的思考。如果你连原理都不懂，工具跑出来结果你都看不懂——它说有漏洞，你知道为啥有吗？怎么利用？危害有多大？怎么修复？

而且，真实环境里，很多漏洞是工具扫不出来的，得靠人工去发现。你只会用工具，那你就只是个"工具人"，成不了真正的高手。

正确的顺序是：
1. 先手工打，理解每一步的原理 ✋
2. 手工打熟练了，再用工具提高效率 🔧
3. 工具只是"加速器"，不是"替代品"

打个比方 🏃：

你想跑得快，你得先学会跑步，把腿脚练结实了，然后再考虑穿什么运动鞋能更快。你连路都不会走，给你一双跑鞋你也跑不起来啊！

### 六、多做笔记，好记性不如烂笔头 📝

安全的知识点又多又杂，今天学的东西，过几天可能就忘了。所以一定要多做笔记！

记什么呢？
- 每个漏洞的原理
- 每个漏洞的利用方法
- 每个漏洞的防御方法
- 你踩过的坑
- 你遇到的奇葩问题
- 你的心得体会

笔记不用写得多么工整，自己能看懂就行。以后遇到类似的问题，翻一翻笔记，很快就能想起来。

而且，写笔记的过程本身就是一个"梳理思路"的过程——你能把一个东西讲清楚写下来，说明你是真的懂了。

---

## DVWA之后学什么？🚀

DVWA打完了，是不是感觉"无敌是多么寂寞"？哈哈，别骄傲，DVWA只是入门级的靶场，后面的路还长着呢！🏃‍♂️

给大家推荐几个后续学习的方向，你可以根据自己的情况选择：

### 一、SQL注入不熟练？去SQLi-Labs练！💉

如果你觉得SQL注入还没练够，那一定要去打**SQLi-Labs**！

SQLi-Labs是专门练SQL注入的靶场，一共有70多关，各种类型的SQL注入都有——基于报错的、基于时间的盲注、堆叠注入、二次注入、宽字节注入...只有你想不到，没有它没有的！

打完SQLi-Labs，你的SQL注入水平绝对会有质的飞跃！到时候再看其他注入，都是小意思！😎

（悄悄告诉你，我们下一章就会讲SQLi-Labs，敬请期待！🤫）

### 二、文件上传不熟练？去Upload-Labs练！📤

如果你觉得文件上传还没玩够，那一定要去打**Upload-Labs**！

Upload-Labs是专门练文件上传的靶场，一共有20多关，各种文件上传的绕过姿势都有——前端验证绕过、MIME类型绕过、黑名单绕过、.htaccess绕过、00截断、图片马...

打完Upload-Labs，你会发现——原来文件上传有这么多玩法！🕺

### 三、想练综合能力？去打Pikachu！🎯

如果你觉得单个漏洞都练得差不多了，想试试"综合一点"的靶场，那推荐你打**Pikachu**（皮卡丘）靶场。

Pikachu也是一个国产的Web安全靶场，里面包含了各种常见的漏洞，还有一些"综合漏洞场景"，更贴近真实环境。而且靶场的界面很可爱，名字也很萌，打起来心情都好！🐹

### 四、想打完整靶机？去VulnHub！🖥️

如果你觉得Web漏洞玩腻了，想试试"完整的一台服务器"是什么感觉，那推荐你去**VulnHub**！

VulnHub是一个网站，上面有各种各样的"靶机镜像"——就是一台装好了漏洞的虚拟机，你下载下来，用VMware或者VirtualBox打开，然后就可以开始"渗透测试"了——从信息收集、漏洞发现、漏洞利用，到提权、拿flag，一套完整的流程。

这就不是单个的Web漏洞了，而是一整台服务器，更有挑战性！当然，难度也更大，适合有一定基础之后再玩。

### 五、还有这些靶场也不错！🌟

除了上面说的这些，还有很多优秀的靶场，比如：
- **BWAPP**：另一个老牌Web靶场，漏洞类型也很多
- **WebGoat**：OWASP官方出的靶场，很经典
- **Root-Me**：法国的一个CTF平台，有很多挑战题
- **Bugku**：国内的CTF平台，适合新手
- **攻防世界**：国内的CTF平台，题目质量不错

总之，靶场多的是，就怕你不练！💪

---

## 本章总结 + 下章预告 🎉

### 本章总结 📋

这一章的内容就到这里啦！我们来简单总结一下：

1. **其他模块快速通关**：
   - **Insecure CAPTCHA**（不安全的验证码）：验证码设计有问题，可以被绕过
   - **Weak Session IDs**（弱会话ID）：Session ID有规律，攻击者可以猜到，从而冒充用户登录
   - **CSP Bypass**（内容安全策略绕过）：CSP配置不当，可以被绕过
   - **JavaScript攻击**：客户端验证不可信，想怎么改就怎么改
   - **其他模块**：开放式重定向、HTTP头注入、盲注...简单了解一下

2. **通关心得**：
   - 漏洞的本质：信任了不可信的输入
   - 防御的本质：不信任任何用户输入
   - 白名单比黑名单靠谱
   - 安全是一个整体，需要纵深防御

3. **新手学习建议**：
   - 一定要动手打，别光看
   - 从Low到High，循序渐进
   - 理解原理，不要死记payload
   - 攻防一体，学习防御
   - 先手工，后工具
   - 多做笔记

4. **后续学习方向**：
   - SQL注入 → SQLi-Labs
   - 文件上传 → Upload-Labs
   - 综合能力 → Pikachu
   - 完整靶机 → VulnHub

怎么样？这一章的内容是不是很充实？虽然DVWA打完了，但是我们的安全之旅才刚刚开始！🌅

### 下章预告 📢

下一章，我们将进入一个全新的靶场——**SQLi-Labs**！

SQLi-Labs是SQL注入的"专项训练场"，一共有70多关，从最简单的入门级到最难的高阶玩法，应有尽有。如果你想把SQL注入练到炉火纯青的地步，那SQLi-Labs绝对是你的不二之选！

准备好了吗？75关SQL注入大挑战，等你来战！💪🔥

我们下一章见！👋
