# 第5章 DVWA实战：暴力破解（Brute Force）

哈喽小伙伴们，咱们又见面啦！前面几章咱们把DVWA环境搭好了，也对各种漏洞有了初步了解。今天咱们来聊一个最经典、最入门级的攻击方式——**暴力破解**！

说到暴力破解，大家可能在电影里见过：黑客对着电脑一顿操作，然后屏幕上显示"Password Cracked!"，感觉特别酷。其实暴力破解说穿了一点都不神秘，说白了就是——**一个一个试密码，试对为止**！

是不是感觉很简单？没错，暴力破解就是这么"朴实无华"。但你可别小看它，在实战中，暴力破解往往是黑客拿到权限的第一步。今天咱们就从最基础的开始，一步一步带你玩转DVWA里的暴力破解模块。坐稳扶好，咱们出发！🚀

---

## 5.1 什么是暴力破解？

### 5.1.1 大白话解释暴力破解

先问大家一个问题：你有没有过忘记密码的经历？比如手机锁屏密码忘了，银行卡密码忘了，或者某个网站的密码忘了。忘了怎么办？很多人会下意识地去试——生日？不对。手机号后六位？也不对。123456？哎，对了！

你看，你刚才做的事情，本质上就是**暴力破解**！

**暴力破解（Brute Force），大白话讲就是：用大量的用户名和密码组合，一个一个去试，直到试对为止。**

就像你忘了保险柜密码，你从000000开始试，000001、000002……一直试到999999，总有一个是对的。只要你有足够的时间，总能试出来。

当然，真正的暴力破解不会真的用手去敲，而是用程序自动试，一秒钟能试成千上万次，比人手快多了。

### 5.1.2 生活例子理解暴力破解

给大家举几个生活中的例子，一下子就懂了：

**例子1：猜手机锁屏密码 📱**

你拿了朋友的手机想玩，但是他设了4位数字密码。怎么办？从0000试到9999，一共10000种可能。如果你手速快，一秒试一个，不到3小时就能试完——这就是暴力破解。

**例子2：试保险柜密码 🔐**

电影里常见的情节：小偷想打开保险柜，但是不知道密码。怎么办？用个听诊器贴在上面，慢慢转密码盘——这也是暴力破解的一种（虽然更高级一点）。

**例子3：找钥匙开门 🔑**

你家有一串钥匙，共10把，你不知道哪把开大门。怎么办？一把一把试，总有一把能打开——这还是暴力破解。

所以你看，暴力破解一点都不神秘，生活中处处都是。它的核心思想就是：**穷举所有可能，直到找到正确的那个。**

### 5.1.3 暴力破解的前提条件

看到这儿，有小伙伴可能会问：那是不是所有网站都能被暴力破解呀？

当然不是！暴力破解能成功，是有前提条件的。就像你猜手机密码，如果手机输错5次就锁定1小时，那你还能暴力破解吗？肯定不行啊！

暴力破解要想成功，一般得满足以下几个条件：

1. **没有验证码** ✅ —— 验证码就是用来防暴力破解的，每次登录都要输验证码，程序就很难自动试了
2. **没有次数限制** ✅ —— 如果输错3次就锁定账号，那也没法暴力破解
3. **密码不够复杂** ✅ —— 如果密码是8位纯数字，那只有1亿种可能；但如果是大小写字母+数字+特殊符号的16位密码，那可能性就太多了，暴力破解基本不可能
4. **用户名已知** ✅ —— 如果你连用户名都不知道，那还要同时猜用户名和密码，难度就大多了

简单总结一下：**网站防护越差、密码越简单，暴力破解越容易成功。**

反过来讲，要防御暴力破解，就是从这几个方面入手：加验证码、限制次数、强制复杂密码、检测异常登录。这个咱们后面再详细讲。

### 📍 先看你该访问哪个 URL（三选一，对应你搭 DVWA 的环境）

**本章靶场模块：Brute Force**。左边栏点 Brute Force 就能进（先切难度 Low！）。三平台访问地址对照：

| 搭建方式 | 本章靶场页面地址 | 登录页 | 攻击机工具（Kali 自带就是香 🔥）|
|---|---|---|---|
| 🪟 Windows PHPStudy | `http://localhost/dvwa/vulnerabilities/brute/` | `http://localhost/dvwa/login.php` | Burp Suite |
| 🐧 **Kali Linux LAMP（你在用 ✅）** | `http://你的KaliIP/dvwa/vulnerabilities/brute/` 例 `http://192.168.42.135/dvwa/vulnerabilities/brute/` | `http://你的KaliIP/dvwa/login.php` | Hydra + Burp Suite Intruder + wfuzz |
| 🐳 Docker 版 | `http://你的KaliIP:4280/vulnerabilities/brute/`（**注意无 /dvwa 这层！**）| `http://你的KaliIP:4280/login.php` | Hydra + Burp Suite （⚠️ Docker pull 拉不动？直接换 ch04 §4.5 Kali LAMP 或 §4.7 XAMPP ✅）|

<svg viewBox="0 0 1100 430" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:980px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">
  <defs><linearGradient id="bf1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1f6feb"/><stop offset="100%" stop-color="#0b3b8a"/></linearGradient><linearGradient id="bf2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f85149"/><stop offset="100%" stop-color="#8d1515"/></linearGradient><marker id="bfr" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#f85149"/></marker><marker id="bfg" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#3fb950"/></marker></defs>
  <text x="550" y="34" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 5-1  Brute Force · 字典攻防线全景（Kali Hydra → DVWA Low）</text>
  <!-- Kali 攻击机 -->
  <rect x="20" y="64" width="320" height="340" rx="14" fill="url(#bf1)" stroke="#4490ff" stroke-width="1.4"/>
  <text x="180" y="98" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="17">🖥️  Kali 攻击机（你的操作端）</text>
  <g font-family="Arial" font-size="12.5" fill="#e6efff">
    <text x="38" y="135">① 字典准备（Kali 自带 📚）</text>
    <rect x="38" y="146" width="284" height="34" rx="6" fill="#000" opacity="0.35"/>
    <text x="50" y="168">用户名：admin / root / test / user / guest</text>
    <rect x="38" y="192" width="284" height="34" rx="6" fill="#000" opacity="0.35"/>
    <text x="50" y="214">密码：/usr/share/wordlists/rockyou.txt（1400w条）</text>
    <text x="38" y="260">② 攻击工具（三选一，Hydra 命令行最爽）</text>
    <g font-size="12">
      <rect x="38" y="270" width="85" height="66" rx="7" fill="#001c4a" stroke="#4490ff"/><text x="80" y="298" text-anchor="middle" fill="#fff" font-weight="bold">Hydra 🐉</text><text x="80" y="317" text-anchor="middle" font-size="11">http-form-get</text><text x="80" y="332" text-anchor="middle" font-size="11">-l -P -V</text>
      <rect x="135" y="270" width="85" height="66" rx="7" fill="#001c4a" stroke="#4490ff"/><text x="177" y="298" text-anchor="middle" fill="#fff" font-weight="bold">Burp 🔫</text><text x="177" y="317" text-anchor="middle" font-size="11">Intruder</text><text x="177" y="332" text-anchor="middle" font-size="11">Cluster bomb</text>
      <rect x="232" y="270" width="90" height="66" rx="7" fill="#001c4a" stroke="#4490ff"/><text x="277" y="298" text-anchor="middle" fill="#fff" font-weight="bold">wfuzz 🌾</text><text x="277" y="317" text-anchor="middle" font-size="11">-w 字典</text><text x="277" y="332" text-anchor="middle" font-size="11">--hh 过滤长度</text>
    </g>
  </g>
  <!-- 中间：攻击箭头 -->
  <g font-family="Arial" font-size="12" fill="#ffb4a9">
    <line x1="340" y1="205" x2="440" y2="205" stroke="#f85149" stroke-width="2.5" marker-end="url(#bfr)"/>
    <line x1="340" y1="225" x2="440" y2="225" stroke="#f85149" stroke-width="2.5" marker-end="url(#bfr)"/>
    <line x1="340" y1="245" x2="440" y2="245" stroke="#f85149" stroke-width="2.5" marker-end="url(#bfr)"/>
    <line x1="340" y1="265" x2="440" y2="265" stroke="#f85149" stroke-width="2.5" marker-end="url(#bfr)"/>
    <text x="390" y="188" text-anchor="middle">上千次/秒 · 组合爆破</text>
    <text x="390" y="292" text-anchor="middle">?u=^USER^&amp;p=^PASS^</text>
  </g>
  <!-- 右侧：DVWA 模块 -->
  <rect x="450" y="64" width="630" height="340" rx="14" fill="url(#bf2)" stroke="#ff6b6b" stroke-width="1.4"/>
  <text x="765" y="98" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="17">🎯  DVWA · Brute Force 模块（Apache + PHP + MySQL）</text>
  <g font-family="Arial" font-size="12.5" fill="#ffeaea">
    <text x="472" y="135">③ 服务端代码（Low 级别，无任何防护 🌱）</text>
    <rect x="472" y="146" width="586" height="44" rx="6" fill="#000" opacity="0.4"/>
    <text x="488" y="167">$query = "SELECT * FROM users WHERE user='$u' AND password=MD5('$p');";</text>
    <text x="488" y="186">if($row) echo "Welcome ".$row[0]."!!";   // ✅ 命中！返回差异巨大</text>
    <text x="472" y="225">④ 四档防护梯度（Low → Impossible 一步步锁死）</text>
    <g font-size="12">
      <rect x="472" y="236" width="135" height="150" rx="7" fill="#3bff9a20" stroke="#3bff9a"/><text x="539" y="260" text-anchor="middle" font-weight="bold" fill="#3bff9a">LOW 🌱</text><text x="484" y="282">• 无验证码 无次数</text><text x="484" y="300">• 无 sleep 延时</text><text x="484" y="318">• 响应长度一眼看穿</text><text x="484" y="336">• Hydra 直接秒出 ✅</text><text x="484" y="354">• Burp 看 Status 长度</text>
      <rect x="615" y="236" width="135" height="150" rx="7" fill="#ffe16b20" stroke="#ffe16b"/><text x="540" y="260" text-anchor="middle" opacity="0">1</text><text x="682" y="260" text-anchor="middle" font-weight="bold" fill="#ffe16b">MED 🌿</text><text x="627" y="282">• mysql_real_escape</text><text x="627" y="300">• sleep(2) 失败延时</text><text x="627" y="318">• 多线程 Hydra 可跑</text><text x="627" y="336">• wfuzz 过滤长度 ✅</text><text x="627" y="354">• Burp 线程数调 30</text>
      <rect x="758" y="236" width="135" height="150" rx="7" fill="#ffa36b20" stroke="#ffa36b"/><text x="825" y="260" text-anchor="middle" font-weight="bold" fill="#ffa36b">HIGH 🌳</text><text x="770" y="282">• 带 user_token</text><text x="770" y="300">• 每次请求必须带新</text><text x="770" y="318">Token，Grep-Extract</text><text x="770" y="336">• Pitchfork 模式 ✅</text><text x="770" y="354">• 单线程慢一点</text>
      <rect x="901" y="236" width="159" height="150" rx="7" fill="#ff6b8a20" stroke="#ff6b8a"/><text x="980" y="260" text-anchor="middle" font-weight="bold" fill="#ff6b8a">IMPOSSIBLE ⛔</text><text x="913" y="282">• 连错 3 次锁 15 分</text><text x="913" y="300">• 强 Token + Captcha</text><text x="913" y="318">• password_hash()</text><text x="913" y="336">• 真·无法爆破 💀</text><text x="913" y="354">• 防护参考范本</text>
    </g>
  </g>
  <!-- 成功命中线 -->
  <g font-family="Arial" font-size="13">
    <line x1="760" y1="418" x2="180" y2="418" stroke="#3fb950" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#bfg)"/>
    <rect x="790" y="400" width="180" height="30" rx="8" fill="#0e4a1c" stroke="#3fb950"/>
    <text x="880" y="420" text-anchor="middle" fill="#fff" font-weight="bold">✅ 命中 admin / password！</text>
  </g>
</svg>

> 🔥 **Kali 同学本章速查命令（直接复制改 IP 就能跑）：**
> ```bash
> # 解压 rockyou.txt（Kali 默认是 gz 压过的，只需执行一次）
> sudo gunzip -k /usr/share/wordlists/rockyou.txt.gz
>
> # Hydra 爆破 DVWA Brute Force Low（把 IP、PHPSESSID 替换成你自己抓包的值！）
> hydra -l admin -P /usr/share/wordlists/rockyou.txt 192.168.42.135 http-form-get \
>   "/dvwa/vulnerabilities/brute/:username=^USER^&password=^PASS^&Login=Login:H=Cookie\: PHPSESSID=替换; security=low:F=Username and/or password incorrect" -V -t 16
> ```

<svg viewBox="0 0 1200 500" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1060px;margin:18px auto;display:block;border:1px solid #2a2a3a;border-radius:14px;background:#0f1120;">
  <defs>
    <linearGradient id="hd1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#1f6feb"/><stop offset="100%" stop-color="#8957e5"/></linearGradient>
    <marker id="hdarr" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#f1b73a"/></marker>
  </defs>
  <text x="600" y="36" text-anchor="middle" fill="#fff" font-size="20" font-weight="bold" font-family="Arial">图 5-2  Burp 抓包 → 抠 5 个值填 Hydra → 秒出密码 · 一条龙流程</text>
  <text x="600" y="60" text-anchor="middle" fill="#8b949e" font-size="13" font-family="Arial">新手最容易卡壳：Hydra 命令里那一串怎么来？下面 5 个方框 = 从抓包内容里一个一个抄过去 👇</text>

  <!-- Step 1: Burp 抓包全景 -->
  <rect x="20" y="80" width="330" height="400" rx="12" fill="#161b2e" stroke="#4490ff" stroke-width="1.3"/>
  <text x="185" y="108" text-anchor="middle" fill="#fff" font-weight="bold" font-size="15">① Burp 抓到的原始请求</text>
  <g font-family="Consolas,'Courier New',monospace" font-size="11.2">
    <rect x="32" y="124" width="306" height="342" rx="6" fill="#0a0d1a" stroke="#2a3350"/>
    <text x="44" y="148" fill="#c9d1d9">GET /dvwa/vulnerabilities/brute/?username=admin&amp;password=test123&amp;Login=Login HTTP/1.1</text>
    <text x="44" y="168" fill="#ff7b72"><tspan font-weight="bold">Host:</tspan> <tspan fill="#a5d6ff" font-weight="bold">192.168.42.135</tspan></text>
    <text x="44" y="188" fill="#c9d1d9">User-Agent: Mozilla/5.0 (X11; Linux x86_64)...</text>
    <text x="44" y="208" fill="#c9d1d9">Accept: text/html,application/xhtml+xml...</text>
    <text x="44" y="228" fill="#c9d1d9">Referer: http://192.168.42.135/dvwa/...</text>
    <text x="44" y="248" fill="#c9d1d9">Connection: close</text>
    <text x="44" y="270" fill="#ff7b72"><tspan font-weight="bold">Cookie:</tspan> security=<tspan fill="#7ee787" font-weight="bold">low</tspan>; <tspan font-weight="bold">PHPSESSID=</tspan><tspan fill="#ffa657" font-weight="bold">abc123def456789...</tspan></text>
    <text x="44" y="290" fill="#c9d1d9">Upgrade-Insecure-Requests: 1</text>
    <rect x="32" y="318" width="306" height="1" fill="#444c67"/>
    <text x="44" y="344" fill="#8b949e">   ↓ 响应里失败提示长这样（F= 参数要抄这个）</text>
    <text x="44" y="370" fill="#ff7b72">  Username and/or password<tspan font-weight="bold"> incorrect</tspan>.</text>
    <text x="44" y="392" fill="#8b949e">   （密码对会变成 Welcome to ... admin）</text>
    <text x="44" y="432" fill="#c9d1d9">GET 路径 = <tspan fill="#79c0ff" font-weight="bold">/dvwa/vulnerabilities/brute/</tspan></text>
    <text x="44" y="452" fill="#c9d1d9">参数模板 = username=^USER^&amp;password=^PASS^&amp;Login=Login</text>
  </g>

  <!-- 中间 5 个值提取箭头 -->
  <g font-family="Arial" font-size="12.5">
    <line x1="350" y1="168" x2="430" y2="168" stroke="#f1b73a" stroke-width="2" marker-end="url(#hdarr)"/>
    <text x="390" y="158" text-anchor="middle" fill="#f1b73a" font-weight="bold">抄 Host 值</text>

    <line x1="350" y1="270" x2="430" y2="240" stroke="#f1b73a" stroke-width="2" marker-end="url(#hdarr)"/>
    <text x="390" y="230" text-anchor="middle" fill="#f1b73a" font-weight="bold">抄 PHPSESSID</text>

    <line x1="350" y1="270" x2="430" y2="312" stroke="#f1b73a" stroke-width="2" marker-end="url(#hdarr)"/>
    <text x="390" y="302" text-anchor="middle" fill="#f1b73a" font-weight="bold">抄 security</text>

    <line x1="350" y1="370" x2="430" y2="384" stroke="#f1b73a" stroke-width="2" marker-end="url(#hdarr)"/>
    <text x="390" y="400" text-anchor="middle" fill="#f1b73a" font-weight="bold">抄失败关键词</text>

    <line x1="350" y1="432" x2="430" y2="456" stroke="#f1b73a" stroke-width="2" marker-end="url(#hdarr)"/>
    <text x="390" y="472" text-anchor="middle" fill="#f1b73a" font-weight="bold">抄路径 + 参数</text>
  </g>

  <!-- Step 2: 填进 Hydra 命令 -->
  <rect x="440" y="80" width="740" height="400" rx="12" fill="url(#hd1)" opacity="0.95" stroke="#8957e5"/>
  <text x="810" y="108" text-anchor="middle" fill="#fff" font-weight="bold" font-size="15">② 把 5 个值按位置填进 Hydra 命令（颜色一一对应）</text>
  <g font-family="Consolas,'Courier New',monospace" font-size="12">
    <rect x="454" y="124" width="712" height="342" rx="8" fill="#060914" opacity="0.75" stroke="#2a3350"/>
    <text x="468" y="152" fill="#e6edf3">hydra <tspan fill="#a5d6ff">-l</tspan> <tspan fill="#7ee787">admin</tspan> <tspan fill="#a5d6ff">-P</tspan> /usr/share/wordlists/rockyou.txt \</text>
    <text x="480" y="176" fill="#a5d6ff" font-weight="bold">┌─ ① 抄 Host 里的 IP →</text>
    <text x="468" y="200" fill="#ff7b72">192.168.42.135</text>
    <text x="468" y="220" fill="#e6edf3">  http-form-get \</text>
    <text x="480" y="248" fill="#a5d6ff" font-weight="bold">┌─ ⑤ 抄路径 + 参数模板（注意分号分隔）→</text>
    <text x="468" y="272" fill="#79c0ff">  "/dvwa/vulnerabilities/brute/</text>
    <text x="476" y="292" fill="#ff7b72">:username=<tspan font-weight="bold">^USER^</tspan>&amp;password=<tspan font-weight="bold">^PASS^</tspan>&amp;Login=Login</text>
    <text x="480" y="316" fill="#a5d6ff" font-weight="bold">   ┌─ ②/③ Cookie 两个值从抓包的 Cookie 行抄 →</text>
    <text x="476" y="340" fill="#c9d1d9">:H=Cookie\: PHPSESSID=<tspan fill="#ffa657" font-weight="bold">abc123def456789</tspan>; security=<tspan fill="#7ee787" font-weight="bold">low</tspan></text>
    <text x="480" y="364" fill="#a5d6ff" font-weight="bold">   ┌─ ④ 抄响应里的失败关键词 →</text>
    <text x="476" y="388" fill="#ffe092" font-weight="bold">   :F=incorrect</text>
    <text x="476" y="408" fill="#79c0ff">  " </text>
    <text x="468" y="432" fill="#e6edf3">  <tspan fill="#a5d6ff">-V</tspan> <tspan fill="#a5d6ff">-t 16</tspan></text>
    <rect x="454" y="444" width="712" height="1" fill="#388bfd" opacity="0.4"/>
    <text x="468" y="464" fill="#8b949e" font-family="Arial" font-size="11.5"> 💡 -V=显示每次尝试   -t 16=开 16 线程跑（Low 无压力）   结果行出现【1 of 1 valid】= 密码出来了 🎉</text>
  </g>
</svg>

### 🎯 **手把手抠 Hydra 5 个参数（抄错一个就全失败，一步步来！）**

上面那张图里的 5 个值，我再用文字版带大家抠一遍。打开你的 Burp，随便在 Brute Force 页输入 `admin / test123` 点 Login，抓到请求后按下面 1~5 **抄**：

| 步骤 | 在抓包内容里找哪一行 | 抄什么出来 | 填到 Hydra 命令里的位置 |
|---|---|---|---|
| ① | `Host: 192.168.42.135` 这一行 | `Host:` **后面**的 IP/域名（不要端口，不要空格） | `hydra ... rockyou.txt ` **后面**那一段（IP 位置） |
| ② | `Cookie: security=low; PHPSESSID=abc123...` 这一行 | `PHPSESSID=` **后面直到下一个分号或行尾**的那一长串 | `H=Cookie\: PHPSESSID=` **= 后面** |
| ③ | 同一行 Cookie | `security=` 后面的值（**必须是 low！**不然你爆破的是别的级别） | `security=` **= 后面** |
| ④ | 切到 **Response** 标签页（响应），搜索失败提示 | `incorrect` 这个单词（或者整句 `Username and/or password incorrect`） | `:F=` **= 后面**（Hydra 只要在响应里发现这个词，就判定为"这个密码错了"） |
| ⑤ | 请求第一行：`GET /dvwa/vulnerabilities/brute/?username=admin&password=test123&Login=Login HTTP/1.1` | 问号 `?` **之前**的路径 + 问号之后的参数里，把 `admin` 换成 `^USER^`、`test123` 换成 `^PASS^` | 双引号里最开头的那一段 `/dvwa/vulnerabilities/brute/:username=^USER^&password=^PASS^&Login=Login` |

> ⚠️ **新手 90% 的 Hydra 失败原因 Top 3（先自查这三个！）**：
> 1. **PHPSESSID 是旧的！** 你在浏览器重新登录了 DVWA / 重启了 Apache → 会话 ID 会变！重新抓包抄一遍 PHPSESSID。
> 2. **security 不是 low！** 你把难度切到 Medium/High 了，但 Hydra 命令里 Cookie 还写着 security=low → 服务器按 High 级别返回，结果全判定成失败。
> 3. **F= 失败关键词写错！** 比如写成 `Incorrect`（首字母大写）但响应里实际是小写的 `incorrect` → 大小写敏感！直接复制响应里的原文最稳妥。

---

### 🆓 **Burp Suite 免费版（Community Edition）用户看这里！Intruder 限制 + 三种降级方案**

用免费版 Burp 的小伙伴举手 🙋‍♂️。先告诉大家免费版 Intruder 的硬限制（官方规定的，改不了）：

| 限制项 | 免费版 Community | 专业版 Pro（$400/年）| 对你爆破 DVWA 的影响 |
|---|---|---|---|
| **最大 payload 数/次攻击** | **最多 10 个！**（超过的直接跳过不跑） | 无限制 | 想跑 rockyou.txt 1400w 条？免费版直接别想 |
| **并发线程数** | 固定 **单线程 1 个**（一个接一个发） | 最高 512 可自定义 | Medium 级别 sleep(2) 秒 → 免费版 1 小时只能跑 1800 个 |
| **是否能自定义 Grep-Extract / Pitchfork** | ✅ 功能都有，但受 10 条 payload 限制 | 全功能无限制 | High 级别 Token 爆破流程可以走通，但只能测前 10 个密码 |
| **攻击结果保存 / 重放** | 可以看，但不能导出 | 全支持 | 学习阶段无所谓 |

**所以：免费版 Burp 适合"走通流程 + 理解原理"，真要跑大字典 → 换下面三个方案之一。**

#### 🟢 方案 A（推荐新手）：免费版 Burp 跑 10 条小字典 + 换 Hydra 跑大字典 ✅

**第一步：** 先用 Burp 免费版按 5.3.1 ~ 5.3.7 走一遍完整流程，字典就手动加下面这 10 个（刚好卡免费版上限）：
```
123456
password
admin
12345678
qwerty
123456789
12345
1234
111111
password
```
> 💡 **故意把 password 放第 10 行！** 这样你能看到前 9 个失败、第 10 个成功，Length 列差异一眼看穿。

**第二步：** 流程跑通了 → 直接开 Kali 终端用 Hydra 跑 rockyou.txt（前面抠的 5 个参数直接复用，**Hydra 完全免费、无任何限制！**）

#### 🟡 方案 B：用 wfuzz 替代 Burp（Kali 自带，命令行、无限制）

wfuzz 是 Kali 自带的 Web 模糊测试工具，爆破 Brute Force 也特别好用，**完全免费无限制、速度飞快**：
```bash
# 先确保 rockyou.txt 解压了（只做一次）
sudo gunzip -k /usr/share/wordlists/rockyou.txt.gz 2>/dev/null

# 爆破 DVWA Brute Force Low（把 IP、PHPSESSID 换成你自己的）
wfuzz -c -z file,/usr/share/wordlists/rockyou.txt \
  -b "PHPSESSID=替换成你的; security=low" \
  --hh 4500 \
  "http://192.168.42.135/dvwa/vulnerabilities/brute/?username=admin&password=FUZZ&Login=Login"
```
> 参数解释：
> - `-c`：彩色输出，好看
> - `-z file,xxx`：从文件加载字典，`FUZZ` 标记的位置会被字典替换
> - `-b`：带 Cookie 发送（PHPSESSID + security，和 Hydra 一样抄）
> - `--hh 4500`：隐藏响应字节数等于 4500 的（**这个 4500 你得先试一个错误密码，看 Length 是多少，填进去**！这样就只剩正确密码显示出来了）

#### 🔴 方案 C（实在不想敲命令）：Burp 免费版 + 分批跑

如果你非要用 Burp 图形界面跑多一点，就把大字典**手动拆成每 10 个一批**，一批一批地 Start attack。跑完 10 个 → 清空 payload → 加载下一批 → 再跑。1000 个密码 = 跑 100 次。方法能用，但非常耗时间，**不推荐，Hydra 它不香吗？😅**

---

## 5.2 字典是什么？

### 5.2.1 字典的概念

刚才说了，暴力破解就是一个一个试密码。那问题来了：试哪些密码呢？总不能真的从a试到zzzzzz吧？那得试到猴年马月去。

这时候就需要**字典**了！

**字典（Dictionary），就是一个包含了很多用户名或密码的文本文件，每一行是一个可能的密码。** 暴力破解工具就会按顺序读取字典里的每一个密码，去尝试登录。

你可以把字典想象成一本"可能的密码"大全，里面收集了人们最常用的密码、各种泄露的密码、常见的组合等等。

为什么要用字典呢？因为人们设置密码有很强的规律性——大多数人都喜欢用简单好记的密码，比如123456、password、自己的生日、手机号等等。所以黑客不需要穷举所有可能，只需要用一个包含了常见密码的字典，就有很大概率能猜中！

这就好比你去猜朋友的手机密码，你不会真的从0000试到9999，而是先试试他的生日、他的手机号后六位、1234、0000这些常见的——这其实就是在用你脑子里的"密码字典"。

### 5.2.2 常见的弱密码有哪些？

那人们最喜欢用的密码都有啥呢？根据每年公布的"最常用密码排行榜"，前十名基本都是这些：

| 排名 | 密码 | 说明 |
|------|------|------|
| 1 | 123456 | 永远的第一名，简单好记 |
| 2 | password | 英文"密码"，经典中的经典 |
| 3 | 12345678 | 多了两位，还是一样弱 |
| 4 | qwerty | 键盘第一排，顺着按就行 |
| 5 | 123456789 | 数字顺下来 |
| 6 | 12345 | 更短了 |
| 7 | 1234 | 四位数字，手机锁屏常见 |
| 8 | 111111 | 全是1，好记 |
| 9 | 123123 | 123重复一遍 |
| 10 | admin | 管理员常用密码 |

是不是很眼熟？说不定你自己的某个账号就在用这些密码呢！（如果是的话，赶紧去改了啊！⚠️）

除了这些，还有一些常见的密码规律：

- **生日类**：19900101、20000520、05201314……
- **手机号类**：138xxxx1234、手机号后六位……
- **姓名拼音类**：zhangsan、lisi123、wangwu@123……
- **键盘规律类**：123456、qwerty、asdfgh、zxcvbn……
- **特殊意义类**：5201314（我爱你一生一世）、666666（六六六）、888888（发发发）……

所以说，设置密码的时候，千万不要用这些常见的，一猜就中！

### 5.2.3 字典去哪找？

说了这么多，那字典从哪来呢？主要有两个途径：

**途径一：网上下载现成的 🌐**

网上有很多现成的字典可以下载，比如：

- **rockyou.txt**：最有名的字典之一，包含了1400多万个泄露的密码，非常经典
- **Top10000、Top100000**：最常用的1万/10万个密码
- **社工字典**：包含了中国人常用的密码、生日、手机号组合等
- **各种泄露的密码库**：比如某些网站被脱库后泄露的密码

当然，下载字典的时候要注意安全，别从乱七八糟的网站下载，小心里面藏着病毒。

**途径二：自己生成 🛠️**

如果现成的字典不够用，你还可以自己生成字典。比如你知道目标的生日、姓名、手机号等信息，就可以用工具生成包含这些信息的组合密码，这种叫**社工字典**，命中率特别高。

常见的字典生成工具有：

- **crunch**：Linux下的字典生成工具，可以指定密码长度、字符集等
- **Cupp**：社工字典生成工具，输入目标的个人信息，自动生成可能的密码
- **字典生成器**：各种国产的字典生成小工具

举个例子，如果你知道目标叫"张三"，生日是1995年6月1日，手机号是13812345678，那生成的社工字典可能包含：

```
zhangsan
zhangsan123
zhangsan@123
ZhangSan1995
zs19950601
13812345678
19950601
zs@19950601
……
```

这种针对性的字典，命中率比通用字典高多了！这也是为什么大家要保护好自己的个人信息——信息泄露越多，密码越容易被猜到。

---

## 5.3 Low级别通关实战

好了，理论讲得差不多了，咱们来实战！打开你的DVWA，咱们从最简单的Low级别开始。

### 5.3.1 先手工试一下，感受一下

首先，把DVWA的难度调到Low（左下角的DVWA Security里选Low，然后Submit）。然后点击左边菜单的 **Brute Force**，咱们就看到一个登录框，让输入用户名和密码。

我们先来试试手工猜密码，感受一下。用户名我们先假设是 `admin`（这是最常见的管理员用户名），密码呢？我们试试几个常见的：

- 输入 `admin` / `123456` —— 提示 `Username and/or password incorrect.` 不对
- 输入 `admin` / `password` —— 还是不对
- 输入 `admin` / `admin` —— 哎？还是不对？

哈哈，看来手工试有点费劲，而且我们也不知道密码到底是什么。这时候就该让工具出场了——**Burp Suite**！

### 5.3.2 用Burp Suite抓包

在开始之前，先确认一下你的Burp Suite已经打开了，浏览器的代理也设置好了。如果还没配置好的话，回头去看看第3章的内容，把Burp和浏览器配好再来。

好，现在我们在登录框里随便输入点什么，比如用户名 `admin`，密码 `test123`，然后点击Login。

这时候Burp应该会抓到这个请求。如果没抓到，检查一下代理是不是开着的，Intercept是不是On的状态。

抓到的请求大概长这样：

```http
GET /dvwa/vulnerabilities/brute/?username=admin&password=test123&Login=Login HTTP/1.1
Host: 127.0.0.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)……
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,……
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Referer: http://127.0.0.1/dvwa/vulnerabilities/brute/
Connection: close
Cookie: security=low; PHPSESSID=abc123def456……
Upgrade-Insecure-Requests: 1
```

看到了吗？用户名和密码都在URL的参数里：`username=admin&password=test123`。这是一个GET请求，参数都在地址栏里。

### 5.3.3 发送到Intruder模块

好，现在我们抓到包了，接下来就要用Burp的Intruder模块来进行暴力破解。

右键点击抓到的请求，选择 **Send to Intruder**（或者直接按 `Ctrl+I`）。

然后切换到 **Intruder** 标签页，你会看到刚才的请求已经在里面了。

### 5.3.4 设置payload位置（密码字段）

接下来我们要设置payload的位置——也就是告诉Burp，哪个地方是我们要替换的密码。

点击 **Positions** 标签，你会看到请求内容里有一些被 `§` 符号包裹的地方，这些是Burp自动识别的参数位置。

但是呢，Burp可能会把所有参数都标记上，我们只需要爆破密码，所以先把其他的清除掉。

点击右边的 **Clear §** 按钮，把所有标记都清掉。

然后找到 `password=test123` 这一行，选中 `test123`（也就是我们刚才输入的测试密码），然后点击 **Add §** 按钮，把这个位置标记上。

标记完应该是这样的：

```
username=admin&password=§test123§&Login=Login
```

这样Burp就知道了：用户名固定是admin，密码的位置用字典里的内容一个一个替换。

**小提示：** 如果你连用户名也不知道，想同时爆破用户名和密码，那就要把两个位置都标记上。不过今天我们先从简单的开始，假设用户名是admin。

### 5.3.5 加载密码字典

设置好位置后，点击 **Payloads** 标签，这里是设置字典的地方。

在 **Payload set** 里选择 `1`（因为我们只有一个payload位置）。

在 **Payload type** 里选择 `Simple list`（简单列表），这是最常用的，就是一个密码一行。

然后在下面的 **Payload Options** 里，我们可以手动添加密码，也可以加载现成的字典文件。

**手动添加：** 点击 **Add** 按钮，一个一个输入密码。这适合密码很少的情况。

**加载字典文件：** 点击 **Load...** 按钮，选择你准备好的字典文件（比如top1000.txt、rockyou.txt之类的）。

今天我们先手动加几个常见密码试试，大家也可以自己准备一个小字典。比如添加这些：

```
123456
password
admin
12345678
qwerty
123456789
12345
1234
111111
123123
password123
admin123
root
toor
passw0rd
```

把这些密码都加进去，我们的小字典就做好了。

### 5.3.6 开始攻击

字典加载好了，位置也设置好了，接下来就是见证奇迹的时刻！

点击右上角的 **Start attack** 按钮，Burp就会开始一个一个试密码了。

（如果你用的是免费版Burp，可能会有个提示说免费版有限制，没关系，点OK继续就行。免费版速度慢一点，但功能够用。）

点击之后，会弹出一个新窗口，里面显示着攻击的进度。你可以看到每一个请求的状态、长度、响应码等等。

### 5.3.7 怎么看结果（看响应长度不一样的那个）

攻击跑起来之后，我们怎么知道哪个密码是对的呢？

很简单——**看响应的长度（Length）！**

因为密码错误和密码正确，页面返回的内容肯定不一样，所以响应的长度也会不一样。大多数情况下，密码正确的那个响应，长度会和其他的不同。

你可以点击 **Length** 这一列的表头，按长度排序，那个长度与众不同的，大概率就是正确的密码！

比如，其他请求的响应长度都是4500左右，突然有一个是4600，那这个很可能就是正确的。

或者，你也可以看 **Status** 状态码，不过有时候不管密码对错都是200，所以还是看长度最靠谱。

### 5.3.8 验证一下密码对不对

找到那个长度不一样的请求后，我们来看看它的响应内容，确认一下是不是真的登录成功了。

双击那个请求，切换到 **Response** 标签，看看返回的内容。

如果密码正确，你应该能看到类似这样的提示：

```
Welcome to the password protected area admin
```

或者页面上显示"登录成功"、"Welcome"之类的字样。

如果看到了，恭喜你！暴力破解成功啦！🎉

那我们可以回到浏览器，用这个密码登录一下试试，确认没问题。

### 5.3.9 源代码分析

好了，Low级别我们通关了。但是为什么Low级别这么容易呢？咱们来看看它的源代码，心里也好有个数。

点击页面右下角的 **View Source** 按钮，就能看到这个级别的PHP源代码了。

代码大概是这样的：

```php
<?php

if( isset( $_GET[ 'Login' ] ) ) {
    // 获取用户名和密码
    $user = $_GET[ 'username' ];
    $pass = $_GET[ 'password' ];

    // 查询数据库
    $query  = "SELECT * FROM `users` WHERE user = '$user' AND password = '$pass';";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

    // 检查结果
    if( $result && mysqli_num_rows( $result ) == 1 ) {
        // 登录成功
        echo "<p>Welcome to the password protected area {$user}</p>";
    }
    else {
        // 登录失败
        echo "<pre><br />Username and/or password incorrect.</pre>";
    }

    ((is_null($___mysqli_res = mysqli_close($GLOBALS["___mysqli_ston"]))) ? false : $___mysqli_res);
}

?>
```

看完代码，是不是发现了什么？

没错！**这个代码什么防护都没有！** 😱

- 没有验证码
- 没有登录次数限制
- 没有延时
- 甚至连密码都没加密（直接明文比对）

而且你发现没有，这个代码还有SQL注入漏洞！因为它直接把用户输入拼到SQL语句里了，连过滤都没有。不过那是后面章节的内容，今天我们先聊暴力破解。

总之，Low级别就是完全没有防护的裸奔状态，暴力破解简直不要太简单。现实中如果有网站做成这样，那离被黑也不远了。

### ✅ 表 5-1 · Low 级别通关速查 & 失败对照表（照着这张表走，99% 能过）

| 步骤 | 在页面 / 工具里做什么 | 点哪里 / 输什么 | 看到什么算这步过了 ✅ | **失败了怎么办？（按下面对应报错抄作业）** ❌ |
|---|---|---|---|---|
| 1 | 切难度到 Low | 点左下角 `DVWA Security` → 下拉选 `low` → 点 `Submit` | 页面上 `Current security level is: **low**` 绿色字 | 【Submit 后还是 medium/high】Cookie 过期了 → 去 `http://你的IP/dvwa/login.php` 重新用 `admin / password` 登一遍 |
| 2 | 进 Brute Force 模块 | 点左边菜单 **Brute Force** | 看到两个输入框 + **Login 按钮** + 红色文字"Instructions" | 【点了跳 404 Not Found】路径错了，看看地址栏有没有少 `/dvwa` 这一层；Docker 版要带端口 `:4280` 且无 `/dvwa` |
| 3 | 手工输入一个错密码试一下 | Username 填 `admin`，Password 随便填 `123` → 点 **Login** | 页面下方出现红色 `Username and/or password **incorrect**.` | 【点了 Login 白屏/403】Apache 没跑 → Kali 执行 `sudo systemctl status apache2`，没起来就 `sudo systemctl start apache2` |
| 4 | Burp 抓这个请求（Intercept 要开 On） | 在浏览器继续点一次 Login | Burp 抓到 GET 请求，第一行带 `/dvwa/vulnerabilities/brute/?username=admin&password=...` | 【Burp 里啥都没抓到】检查三点：① 浏览器代理是不是 127.0.0.1:8080 ② Burp 的 Intercept 是不是 ON（亮红）③ 是不是访问了 localhost / 127.0.0.1（浏览器可能绕过代理，换成你 Kali 的真实 IP 如 192.168.x.x） |
| 5 | 发 Intruder，标记 password 位置 | 抓包页面右键 → Send to Intruder → Positions → **Clear §** → 选中 password=**后面的值** → **Add §** | 正确写法：`password=§123§`（密码被两个 § 包起来，其他参数没有 §） | 【怎么 Clear 之后还有一堆 §】Burp 默认会把所有 GET/POST 参数自动标上，**必须先点 Clear § 全清掉！** 不然会把用户名也一起爆破，结果根本看不懂 |
| 6 | 加载字典（专业版：rockyou；免费版：手加 10 个） | Payloads → Payload set=1，type=Simple list → 点 **Add** 一条一条加，或者 **Load** 选字典文件 | Payload Options 列表里至少有 10 条，其中包含 `password` | 【Load 后列表是空的 / 只有一条】你 Load 的字典文件编码不对，或者 rockyou 还是 gz 压缩包——先跑 `sudo gunzip -k /usr/share/wordlists/rockyou.txt.gz` 解压 |
| 7 | Start attack，看 Length 列差异 | 右上角 **Start attack** 按钮（免费版 OK 继续） | 结果表**第 N 行的 Length 跟其他所有行都不一样**（其他都是 4503 左右，它是 46xx） | 【所有 Length 都一模一样】**检查 security Cookie！** 你 Burp 抓的这个包 security=**medium 或 high**，说明你切完难度没重新抓包！→ 回浏览器刷新页面重新输一次，重抓 |
| 8 | 双击 Length 不同的那条，看 Response | 双击 → Response 标签 → 搜 `Welcome` | 里面有绿色字 `Welcome to the password protected area **admin**` | 【Length 与众不同，但 Response 里没有 Welcome】这是个假阳性！通常是页面多了个 PHP warning，翻下面看看是不是有 `allow_url_include` 红色警告——不影响，继续找 |
| 9 | 浏览器用爆破出来的密码实机验证 | 地址栏直接输 `...&username=admin&password=你的密码&Login=Login` 回车 | 页面显示绿色 Welcome + 不出现 incorrect | 【Hydra/Burp 都说对但浏览器不对】PHPSESSID 换了 → 你期间重启过浏览器 / DVWA，重新用浏览器真实登录的那个 Session 跑一次 |

> 💡 **Low 级别真正卡死的 99% 就是上面第 7 条：切了难度没重抓包！** 每次切完 DVWA Security，**一定要回到 Brute Force 页重新刷新 → 重新输 admin/123 → 重新抓包**，旧包里的 security Cookie 还是上一次的值，跑死都出不来。

---

## 5.4 Medium级别通关实战

好，Low级别太简单了，没啥挑战性。咱们把难度调到Medium，看看有什么变化。

### 5.4.1 看看Medium级别有啥变化

先把DVWA难度调到Medium，然后回到Brute Force页面。

哎？页面看起来和Low级别一模一样啊，还是那个登录框。那是不是还能用刚才的方法爆破？

我们先试试手工输入几个错误的密码，看看有没有什么变化。比如连续输错5次……哎？好像也没什么反应，还是提示用户名或密码错误。

那我们用Burp试试？还是刚才的流程，抓包、发Intruder、设置payload、加载字典、开始攻击。

哎？好像也能跑起来啊！那Medium级别到底改了啥？

### 5.4.2 是不是还是能用Burp爆破？

答案是：**能！但是慢了一点。**

如果你仔细观察，会发现Medium级别的响应速度比Low级别慢了一点。每输错一次密码，都会有一个短暂的延迟。

这就是Medium级别的防护措施——**加了延时**！

每次登录失败后，服务器会sleep几秒钟，这样暴力破解的速度就慢下来了。

但是呢，这个延时通常只有2秒、3秒，对于黑客来说，也就是多等一会儿的事儿，该破解还是能破解，只是慢一点而已。

所以Medium级别虽然比Low级别强一点，但还是不够，照样能被暴力破解。

### 5.4.3 源代码分析

咱们来看看Medium级别的源代码，证实一下我们的猜想。

点击 **View Source**：

```php
<?php

if( isset( $_GET[ 'Login' ] ) ) {
    // 获取用户名和密码，做了一点转义
    $user = $_GET[ 'username' ];
    $user = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $user ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    $pass = $_GET[ 'password' ];
    $pass = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $pass ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));

    // 查询数据库
    $query  = "SELECT * FROM `users` WHERE user = '$user' AND password = '$pass';";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

    // 检查结果
    if( $result && mysqli_num_rows( $result ) == 1 ) {
        // 登录成功
        echo "<p>Welcome to the password protected area {$user}</p>";
    }
    else {
        // 登录失败，睡2秒！
        sleep(2);
        echo "<pre><br />Username and/or password incorrect.</pre>";
    }

    ((is_null($___mysqli_res = mysqli_close($GLOBALS["___mysqli_ston"]))) ? false : $___mysqli_res);
}

?>
```

看到了吗？代码里多了一行 `sleep(2);`，就是登录失败后睡2秒。

另外，用户名和密码用 `mysqli_real_escape_string` 做了转义——这主要是防SQL注入的，对暴力破解没啥用。

所以Medium级别的防护就是：**加了2秒延时，防SQL注入，但对暴力破解效果有限。**

### 5.4.4 怎么绕过？

那怎么绕过这个延时呢？其实也简单：

**方法一：多线程爆破 🚀**

Burp的Intruder默认是单线程的，一个一个试，所以慢。但是如果我们开多线程，同时发很多请求，那速度不就上去了吗？

比如10个线程同时跑，每个线程等2秒，相当于一秒钟能试5个，也还能接受。

（不过Burp免费版可能有限制，专业版就没问题了。）

**方法二：用更快的工具 ⚡**

除了Burp，还有很多专门的暴力破解工具，速度比Burp快多了，比如：

- **Hydra**：经典的暴力破解工具，支持各种协议，速度飞快
- **Medusa**：也是很有名的爆破工具
- **Ncrack**：Nmap团队出的爆破工具

这些工具都是命令行的，速度比Burp快得多，对付这种延时小意思。

**方法三：耐心等 ⏳**

如果字典不大的话，慢点就慢点，等等就好了。比如字典有1000个密码，每个等2秒，也就2000秒，半个多小时就跑完了，喝杯咖啡的功夫。

总之，Medium级别的延时防护，只能减慢暴力破解的速度，并不能完全阻止。

### ✅ 表 5-2 · Medium 级别通关速查 & 失败对照表（唯一的坑：速度慢 + 不要用免费版 Burp 单线程硬扛）

| 步骤 | 在页面 / 工具里做什么 | 点哪里 / 输什么 | 看到什么算这步过了 ✅ | **失败了怎么办？（按下面对应报错抄作业）** ❌ |
|---|---|---|---|---|
| 1 | 切难度到 Medium | 左下角 DVWA Security → 选 `medium` → Submit | 页面上 `Current security level is: **medium**` | 【Submit 没反应 / 还是 low】点 Submit 之后看浏览器有没有转圈，没反应就是 Cookie 过期了，重新登录 DVWA |
| 2 | 确认 Medium 生效了（**必做！**） | Brute Force 页连输 3 次 admin/wrong，肉眼数一下每次点击 Login 到出现 incorrect 的时间 | 每次大概等 **2 秒**左右才出结果（Low 是秒出） | 【还是秒出 incorrect → 说明根本没切到 Medium！】回上一步，把浏览器缓存清掉（Ctrl+Shift+R）再看 Current security level 显示什么 |
| 3 | 选工具：Hydra 或 wfuzz（**别用免费版 Burp 硬扛！**） | Kali 终端直接敲 | | 【非要用免费版 Burp → 10 条字典 + 1 线程，每条等 2 秒，跑 10 条要 20 秒，仅够走通流程】想跑 1000 条以上的话，Hydra -t 32 或者 Burp 专业版把 Number of threads 拉到 30+ |
| 4-1 | 走 Hydra 路线 | 命令和 Low 几乎一样，只改 `security=medium` + `-t 32` 加线程：<br>```hydra -l admin -P rockyou.txt 你的IP http-form-get "/dvwa/vulnerabilities/brute/:username=^USER^&password=^PASS^&Login=Login:H=Cookie\: PHPSESSID=抄新的; security=medium:F=incorrect" -V -t 32``` | 命令跑起来后，**每 1 秒显示大约 15+ 个 ATTEMPT**（-t 32 抵消了 sleep 2 秒）| 【速度比蜗牛还慢，一条一条蹦出来】你 `-t` 参数写的太小，或者漏写了 `-t`，默认是 16 线程也 OK，**小于 10 线程就会被 sleep 拖死** |
| 4-2 | 走 wfuzz 路线（推荐） | `wfuzz -c -z file,rockyou.txt -b "PHPSESSID=xx; security=medium" --hh 4500 "http://你的IP/dvwa/vulnerabilities/brute/?username=admin&password=FUZZ&Login=Login"` | 结果里有一行 0 W / 0 Ch / ... 后面没被 `--hh 4500` 过滤掉的就是密码 | 【所有行都被 --hh 过滤光了 / 一行都不剩】你 4500 这个数字写错了！先跑一个 admin/123 确定失败响应的 Chars（字符数）是多少，换成那个值，比如有的版本是 4523 |
| 5 | 验证：浏览器手工登 | 地址栏带参数访问，password=爆破出来的那个 | 绿色 Welcome 出现，incorrect 消失 | 【Hydra 出了 3 个 password 都说 valid】都是假阳性！说明你 `-F`（停止条件）和 `-t` 同时开导致的，**把第一个 password（行号最小的）拿去浏览器试**，一定能中 |

> 💡 **Medium 级别真正卡死的就两件事：① 以为切了难度其实没切（参考步骤 2 肉眼数秒法）；② 免费版 Burp 单线程跑 sleep(2) 等一下午都跑不完**。这俩避开了 Medium 跟 Low 难度没有本质区别。

---

## 5.5 High级别通关实战

好，继续升级难度，调到High！看看High级别有什么新花样。

### 5.5.1 High级别有啥不一样？（加了Token！）

先把难度调到High，回到Brute Force页面。

哎？页面看起来还是一样的，还是那个登录框。那我们用刚才的方法试试？

抓包，发Intruder，设置密码位置，加载字典，开始攻击……

哎？不对啊！怎么所有请求的响应长度都一样？难道密码不对？不可能啊，我们连正确密码都试过了，怎么还是不对？

这是怎么回事？🤔

别慌，这是因为High级别加了一个新东西——**Token（令牌）**！

### 5.5.2 Token是什么？

Token是什么呢？大白话讲：**Token就是一个一次性的验证码，每次请求都不一样。**

就像你去银行取钱，每次进去都要取一个号，这个号只能用一次，办完业务就作废了。下次再来，得重新取号。

Token也是一样的道理：

1. 你打开登录页面的时候，服务器会生成一个随机的Token，放在页面的隐藏字段里
2. 你提交登录请求的时候，必须带上这个Token
3. 服务器验证Token对不对，如果不对或者已经用过了，就拒绝请求
4. 每次请求后，Token都会更新，旧的就失效了

这样的话，你用Burp抓一次包，里面的Token只能用一次。如果你重复用这个Token去发请求，服务器就会拒绝——因为Token已经过期了！

这就是为什么我们刚才的攻击失败了——所有请求用的都是同一个Token，只有第一个请求（如果密码对的话）可能成功，后面的都因为Token不对而失败了。

**那怎么办呢？** 难道High级别就没法暴力破解了吗？

当然不是！俗话说"魔高一尺道高一丈"，黑客们早就想好办法了。

### 5.5.3 怎么绕过Token？

绕过Token的思路是这样的：

**每次请求前，先去页面上获取新的Token，然后用这个Token去发起登录请求。**

也就是：
1. 先请求登录页面 → 拿到新Token
2. 用这个Token + 下一个密码 → 发起登录请求
3. 看结果对不对
4. 重复以上步骤

用Burp的话，怎么实现这个流程呢？

答案就是：**Intruder的Pitchfork模式 + 从响应中提取Token + 重定向请求！**

听起来有点复杂？没关系，我一步一步教你，保证学会！

### 5.5.4 详细步骤教怎么配置

好，现在我们来一步一步配置High级别的暴力破解。

**第一步：抓包，发送到Intruder**

老规矩，先在登录框里随便输入点什么，比如用户名 `admin`，密码 `test123`，点击Login，Burp抓到包。

然后右键 → **Send to Intruder**。

**第二步：设置Positions和Attack Type**

切换到Intruder的 **Positions** 标签。

首先，把 **Attack type** 改成 **Pitchfork**（干草叉模式）。这个模式是什么意思呢？简单说就是有多个payload位置，每个位置对应一个payload集，按顺序一一对应。比如第一个payload用字典第1行，第二个payload也用第1行；第一个用第2行，第二个也用第2行。

然后设置payload位置：
1. 先点击 **Clear §** 清空所有标记
2. 找到 `password=test123`，选中 `test123`，点 **Add §**
3. 找到 `user_token=xxxxxx`（这就是Token！），选中后面的值，点 **Add §**

标记完应该是这样的：

```
username=admin&password=§test123§&Login=Login&user_token=§abc123def456§
```

两个位置：一个是密码，一个是Token。

**第三步：设置第一个Payload（密码字典）**

切换到 **Payloads** 标签。

Payload set 选 `1`，Payload type 选 `Simple list`，然后加载你的密码字典（和之前一样）。

**第四步：设置第二个Payload（Recursive grep - 递归提取）**

Payload set 选 `2`，Payload type 选 **Recursive grep**（递归grep）。

这个类型是什么意思呢？就是从上一个响应中提取内容，作为下一个请求的payload。正好符合我们的需求——从登录页面的响应里提取Token，用于下一次登录请求。

选好类型后，在下面的 **Payload Options** 里，需要设置提取的规则。我们得告诉Burp，怎么从响应里提取Token。

那Token在页面里长什么样呢？我们可以先看一下登录页面的源代码，找到Token的位置。

一般是这样的：

```html
<input type='hidden' name='user_token' value='abc123def456'>
```

或者：

```html
<input type="hidden" name="user_token" value="abc123def456">
```

所以我们要提取的就是 `value='` 和 `'` 之间的内容，或者 `value="` 和 `"` 之间的内容。

在Recursive grep的设置里，我们需要填写 **Prefix（前缀）** 和 **Suffix（后缀）**：

- **Prefix**（前缀）填：`user_token' value='`
- **Suffix**（后缀）填：`'`

或者根据实际情况调整，你可以先看一下页面源码里Token那一行的准确格式，然后再填。

**第五步：设置请求选项（总是重定向）**

因为登录成功后，页面可能会跳转，而且我们每次都需要获取新的Token，所以需要设置一下请求选项。

切换到 **Options** 标签（注意是Intruder里的Options，不是Burp主界面的）。

找到 **Request Engine** 下面的 **Number of threads**，把线程数改成 **1**。因为我们需要等前一个请求的响应回来，提取Token后才能发下一个请求，所以必须单线程。

然后找到 **Redirections** 部分，把 **Follow redirections** 改成 **Always**（总是跟随重定向）。因为登录成功后可能会302跳转，我们需要跟着跳过去看结果。

**第六步：设置Grep - Extract（可选，方便看结果）**

还是在Options标签里，找到 **Grep - Extract** 部分，勾选 **Extract the following items from responses**。

然后点击 **Add**，添加一个提取规则。我们可以提取"Welcome"或者"incorrect"这样的关键词，方便后面看结果。

比如提取"Username and/or password incorrect."这句话，这样我们一眼就能看出哪个请求失败了。

**第七步：开始攻击！**

好了，所有设置都完成了。点击 **Start attack** 按钮，开始攻击！

这时候你会发现，攻击速度比之前慢了很多，因为是单线程的，而且每个请求都要先获取Token。

但是没关系，等它跑着，我们去喝杯水。回来之后，看看哪个请求的响应长度不一样，或者看看我们提取的关键词，就能找到正确的密码了！

怎么样？是不是感觉挺神奇的？虽然加了Token，但还是能被暴力破解，只是麻烦了一点。

### 5.5.5 源代码分析

最后，我们来看看High级别的源代码，看看Token是怎么实现的。

点击 **View Source**：

```php
<?php

if( isset( $_POST[ 'Login' ] ) && isset ($_POST['username']) && isset ($_POST['password']) ) {
    // 检查Token
    checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

    // 获取用户名和密码
    $user = $_POST[ 'username' ];
    $user = stripslashes( $user );
    $user = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $user ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    $pass = $_POST[ 'password' ];
    $pass = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $pass ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    $pass = md5( $pass );

    // 查询数据库
    $query  = "SELECT * FROM `users` WHERE user = '$user' AND password = '$pass';";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

    // 检查结果
    if( $result && mysqli_num_rows( $result ) == 1 ) {
        // 登录成功
        echo "<p>Welcome to the password protected area {$user}</p>";
    }
    else {
        // 登录失败
        sleep( rand( 0, 3 ) );
        echo "<pre><br />Username and/or password incorrect.</pre>";
    }

    ((is_null($___mysqli_res = mysqli_close($GLOBALS["___mysqli_ston"]))) ? false : $___mysqli_res);
}

// 生成Token
generateSessionToken();

?>
```

我们来分析一下这段代码：

1. **Token验证**：开头就调用了 `checkToken()` 函数，验证用户提交的Token和服务器Session里的Token是否一致。
2. **Token生成**：最后调用 `generateSessionToken()` 生成新的Token，每次页面加载都会生成新的。
3. **密码加密**：密码用 `md5()` 加密了（虽然MD5已经不安全了，但总比明文强）。
4. **随机延时**：登录失败后，用 `sleep(rand(0, 3))` 随机睡0到3秒，比固定延时稍微好一点。

但是呢，即使有了Token，还是能被暴力破解——因为只要我们每次都先获取新Token，就能绕过这个防护。Token主要是防CSRF的，对暴力破解的防御效果有限。

### ✅ 表 5-3 · High 级别通关速查 & 失败对照表（Token 配置 8 大踩坑点，一个错就全失败）

High 级别 = 普通爆破方法 100% 会全军覆没（所有 Length 一样），**必须用 Pitchfork + Recursive Grep 拿 Token**。下面这张表把新手 99% 的卡死点都列出来了，对着一步步查：

| 步骤 | 在页面 / Burp 里做什么 | 点哪里 / 输什么 | 看到什么算这步过了 ✅ | **失败了怎么办？（8 大踩坑点按顺序查）** ❌ |
|---|---|---|---|---|
| 1 | 切难度到 High + 重抓包（**切难度后必须重新抓一次包！**） | DVWA Security → high → Submit；**刷新 Brute Force 页面** → 输入 admin / test123 → Login 抓包 | 抓包的 GET 请求里**能看到 user_token=xxxxxx 这一段参数**，Cookie 行写着 `security=high` | 🚫 **踩坑 1（Top 1 失败原因）**：切完难度没刷新页面 + 没重抓包，抓的还是旧的 security=medium 的包！→ 所有请求 Length 都一样 → 回步骤 1 重来。<br>🚫 **踩坑 2**：抓包内容里根本没有 `user_token` 这个参数 → 说明你 DVWA 版本太旧，或者 High 级别没加载出来 → 去 setup.php 重新 Create/Reset DB 一次。 |
| 2 | Send to Intruder，Attack Type 选对 | 右键 → Send to Intruder → Positions 顶部的 **Attack type 下拉框，必须选 Pitchfork！**（默认是 Sniper，❌不能用） | 下拉框显示 **Pitchfork**（不是 Sniper / Battering ram / Cluster bomb） | 🚫 **踩坑 3**：Attack Type 还是默认的 Sniper → 两个 payload 位置会共用同一本字典循环，前几次就把 Token 用过期了 → 全 Length 一样 → 这里一定要改成 Pitchfork。 |
| 3 | Positions 标记两个 §（密码 + Token，顺序不能反！） | 1. 点 **Clear §** 清空；2. 找到 `password=test123` → 选中 test123 → Add §；3. 找到 `user_token=abc123` → 选中 abc123 → Add §。**注意顺序！password 是 Set 1，user_token 是 Set 2** | 请求内容里应该长这样：`...password=§test123§&Login=Login&user_token=§abc123§` | 🚫 **踩坑 4**：顺序反了！先标了 user_token 后标 password → Pitchfork 是按出现顺序排 Set 1 / Set 2 的，顺序反 = 字典里的密码当 Token 用，Token 当密码 → 100% 全错。检查办法：Clear 重来，先标 password（= 第一个出现的 §），再标 user_token（第二个）。<br>🚫 **踩坑 5**：把 `&Login=Login` 或者参数名如 `password=` 也标进 § 了 → 一定只能标参数**值**，不能把参数名和 & 也选进去。 |
| 4 | Payload Set 1（密码字典）| Payloads 标签 → Payload set = **1** → Type = **Simple list** → Load rockyou.txt 或者 Add 小字典 | Payload Options 下面有一堆密码行 | 🚫 **踩坑 6**：免费版 Burp + 字典超过 10 条 → 免费版 Intruder payload 数上限 10 → 超出全跳过！免费版就手动加下面这 10 条测流程：123456、password、admin、12345678、qwerty、123456789、12345、1234、111111、password。 |
| 5 | Payload Set 2（Recursive Grep 提取 Token，这一步是灵魂！）| Payloads 标签 → Payload set = **2** → Type = **Recursive grep**（不是 Simple list！）→ 下面的 Options 里：<br>① 先抓一次 Brute Force 页面的响应（**没登录的 GET 页面不是 Login 请求！**），在 Response 里搜 `user_token`，找到这一行：`<input type="hidden" name="user_token" value='abc123'>`<br>② 把 **value='** 后面之前的内容复制 → 填进 **Prefix（前缀）** 输入框；<br>③ 把 **' >**（或者 ">，看你实际是单引号还是双引号）这一段 → 填进 **Suffix（后缀）** 输入框 | Prefix 填 `user_token' value='` 或 `user_token" value="`<br>Suffix 填 `'` 或 `"`<br>（取决于你页面源码用单/双引号，**抄一模一样！**） | 🚫 **踩坑 7（Top 2 失败原因）**：Prefix / Suffix 填错 = Recursive Grep 抓不到 Token → 每次都拿空字符串当下一次的 Token → 服务器拒绝 → 全 Length 一样。<br>**自查办法**：把你填的 Prefix + Suffix 复制出来，在真实的页面 Response（右键 View Source）里 Ctrl+F 搜 Prefix，如果搜不到或者搜出来的位置不对 → 就按页面真实的 HTML 重新填！90% 失败是 DVWA 新版本把 input value 改成了双引号 `"` 而你 Prefix 还填的单引号 `'`！ |
| 6 | Options → Request Engine：必须单线程！（重要） | Intruder 的 **Options** 标签 → 找到 **Request Engine** → **Number of threads = 1**（默认专业版可能是 10，必须改成 1） | Number of threads 框里写 **1** | 🚫 **踩坑 8（Top 3 失败原因）**：开了多线程 → 并发请求 A 拿的 Token 被并发请求 B 先消费了 → 互相抢 Token → 95% 请求因 Token 过期失败 → 全 Length 一样！High 级别必须单线程，跑慢点但能中。 |
| 7 | Options → Redirections：Follow redirections = Always | Options 标签 → **Redirections** 组 → **Follow redirections** 下拉框选 **Always** → 勾选 **Process cookies in redirections** | Always + 勾选了 Process cookies | 不勾这个 → 部分 DVWA 版本登录成功后 302 跳首页 → Intruder 看不到 Welcome 字样 → Length 没差异，你以为失败了其实成功了。 |
| 8 | Start attack + 看结果 | 点 Start attack，让它慢慢跑（单线程 + 随机 sleep 0-3 秒，**10 条要跑 30 秒左右，耐心等**） | 结果表**某一行的 Length 明显和其他不一样**，其他 4600 左右，它是 47xx | 【还是全 Length 一样】先排除上面 8 个踩坑点，都对了还是不行？→ 直接换成脚本方案：写个 PHP/Python 每次 curl 拿 Token + 下一个密码去试，100% 成功（这个脚本实战里比 Burp 还稳）。 |
| 9 | 验证成功密码 | 浏览器地址栏直接填 password=命中的那个 → 回车（注意刷新一下浏览器才能拿到新 Token，别用 Burp 抓过的旧 URL 参数） | 页面出现 Welcome，没有 incorrect | 【脚本/Burp 对了浏览器不对】很正常，你浏览器里有个新 Token，它只认当前页面里的 Token，不认 URL 里带的旧 Token → 直接在页面的输入框里手工输入 admin / 密码 → 点 Login 验证即可。 |

> 🔥 **High 级别查错口诀：** 先查 security=high 在不在 Cookie 里 → 再查 Attack Type 是不是 Pitchfork → 再查线程是不是 1 → 最后查 Prefix/Suffix 在页面源码里 Ctrl+F 搜不搜得到。**80% 的 High 失败就是这四步里的一个。**

那有没有真正能防住暴力破解的方法呢？当然有！那就是——Impossible级别！

---

## 5.6 Impossible级别分析

好，最后我们来看看最高难度——Impossible级别。这个级别为什么叫"Impossible"（不可能）呢？我们一起来看看。

### 5.6.1 看看这个级别为啥叫Impossible

先把难度调到Impossible，回到Brute Force页面。

哎？页面好像还是一样的？那我们试试随便输几个密码，看看会发生什么。

输入 `admin` / `123456` → 错误
输入 `admin` / `password` → 错误
输入 `admin` / `admin` → 错误
输入 `admin` / `root` → 错误
输入 `admin` / `1234` → 哎？怎么提示账号被锁定了？

哈哈！看到了吧？这就是Impossible级别的厉害之处——**输错几次就锁定账号！**

连续输错几次密码后，账号会被锁定一段时间，这时候你就算输入正确密码也登不上，只能等锁定时间过了。

这样的话，暴力破解就基本不可能了——你才试了几个密码，账号就锁了，还怎么玩？

### 5.6.2 Impossible级别的防御措施

除了账号锁定，Impossible级别还有哪些防御措施呢？我们来看看源代码就知道了。

点击 **View Source**，来欣赏一下"安全的代码"长什么样：

```php
<?php

if( isset( $_POST[ 'Login' ] ) && isset ($_POST['username']) && isset ($_POST['password']) ) {
    // 检查Token
    checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

    // 获取用户名和密码
    $user = $_POST[ 'username' ];
    $user = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $user ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    $pass = $_POST[ 'password' ];
    $pass = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $pass ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    $pass = md5( $pass );

    // 数据库查询
    $query = "SELECT * FROM `users` WHERE user = '$user' AND password = '$pass';";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

    // 检查结果
    if( $result && mysqli_num_rows( $result ) == 1 ) {
        // 登录成功
        $user = mysqli_fetch_assoc( $result );

        // 检查是否被锁定
        if( $user[ 'failed_login' ] < 3 ) {
            // 没被锁定，登录成功
            echo "<p>Welcome to the password protected area {$user['user']}</p>";
        }
        else {
            // 被锁定了
            echo "<pre><br />Your account is locked. Please try again later.</pre>";
        }
    }
    else {
        // 登录失败
        sleep( rand( 2, 4 ) );
        
        // 更新失败次数
        $query = "UPDATE `users` SET `failed_login` = `failed_login` + 1 WHERE user = '$user';";
        $result = mysqli_query($GLOBALS["___mysqli_ston"], $query );
        
        echo "<pre><br />Username and/or password incorrect.</pre>";
    }

    ((is_null($___mysqli_res = mysqli_close($GLOBALS["___mysqli_ston"]))) ? false : $___mysqli_res);
}

// 生成Token
generateSessionToken();

?>
```

哇，这段代码就比前面的安全多了！我们来数数它用了哪些防御手段：

1. **Token验证** ✅ —— 和High级别一样，有Token防CSRF
2. **SQL注入防护** ✅ —— 用 `mysqli_real_escape_string` 转义用户输入
3. **密码加密** ✅ —— 用MD5加密（虽然MD5不算最强，但比明文强）
4. **随机延时** ✅ —— 登录失败随机睡2-4秒
5. **失败次数统计** ✅ —— 每次登录失败，数据库里的 `failed_login` 字段加1
6. **账号锁定** ✅ —— 失败次数达到3次就锁定账号

这么多重防护叠在一起，暴力破解基本就不可能了——你才试3次，账号就锁了，还怎么玩？

当然，严格来说，这个Impossible级别也不是完全没辙，比如：

- 你可以用很多IP地址一起爆破，每个IP试3次，凑起来也能试很多
- 你可以等锁定时间过了再试（比如锁定15分钟，你就每15分钟试3次）
- 如果你知道很多用户名，可以每个用户名试3次，说不定哪个就中了

但是呢，这些方法的成本都很高，而且成功率很低。对于绝大多数情况来说，这种防护已经足够了。

### 5.6.3 告诉新手：这才是正确的防御方式

小伙伴们，看完这四个级别，大家应该明白一个道理：

**没有绝对的安全，只有相对的安全。** 我们做安全防护，不是要做到100%不可能被攻破，而是要让攻击的成本高到攻击者觉得"不值得"。

比如Low级别，攻击者花5分钟就能破解，那肯定不安全；
Medium级别，花1小时，也还是不安全；
High级别，花几小时，一般小黑客可能就放弃了，但遇到有耐心的还是能破；
Impossible级别，攻击者要花几天甚至几周，还不一定能成，那绝大多数攻击者就会放弃了——毕竟有这功夫，还不如去找别的软柿子捏。

所以，大家以后开发网站的时候，一定要像Impossible级别学习，把该加的防护都加上：强密码、验证码、登录次数限制、账号锁定、异常检测……层层防护，才能让你的网站更安全。

---

## 5.7 暴力破解防御方法

好了，四个级别都讲完了。现在我们来系统地总结一下，防御暴力破解都有哪些方法。

### 5.7.1 强密码策略 🔐

这是最基础也是最重要的。如果用户的密码都设得很复杂，那暴力破解的难度会指数级上升。

强密码策略一般包括：

- **最小长度**：至少8位，最好12位以上
- **字符复杂度**：必须包含大小写字母、数字、特殊符号中的至少三种
- **禁止弱密码**：不允许使用常见弱密码，比如123456、password等
- **定期更换**：要求用户每隔一段时间更换密码
- **不能重复**：新密码不能和最近几次的旧密码一样

举个例子：
- `123456` —— 弱爆了，一秒破解
- `zhangsan123` —— 也很弱，社工字典分分钟搞定
- `Zs@19950601` —— 还可以，但如果知道生日的话还是可能被猜到
- `K9$xL2#pQ7!vR3` —— 这个就很强了，暴力破解基本不可能

### 5.7.2 验证码 🤖

验证码（CAPTCHA）是专门用来区分人和机器的，目的就是防止程序自动提交请求。

常见的验证码类型：

- **图片验证码**：最常见的，图片里有扭曲的文字，让用户识别
- **短信验证码**：给手机发验证码，需要输入收到的短信
- **滑块验证码**：拖动滑块到正确位置
- **点选验证码**：让用户点击图片中特定的文字或图案
- **行为验证码**：通过分析用户的鼠标轨迹、输入速度等判断是不是人

验证码的好处是，暴力破解工具很难自动识别（当然，现在也有打码平台，但至少增加了成本）。

不过要注意，验证码也不能太复杂，不然真用户都看不清，那就影响用户体验了。

### 5.7.3 限制登录次数 ⏱️

这是最有效的方法之一。同一个IP地址或同一个账号，在一段时间内只能尝试登录N次，超过了就不让再试了。

比如：
- 同一个账号，15分钟内最多输错5次密码
- 同一个IP，1小时内最多尝试100次登录

超过限制后，可以选择：
- 锁定一段时间（比如15分钟、1小时）
- 需要输入验证码才能继续尝试
- 需要通过邮箱/手机验证才能解锁

这样一来，暴力破解的速度就被大大限制了，基本上就不可行了。

### 5.7.4 账号锁定 🔒

如果某个账号连续多次登录失败，就直接把账号锁定，需要用户自己通过邮箱或手机验证才能解锁。

这比单纯的"限制次数"更严格，因为账号被锁了之后，就算黑客知道了正确密码也登不上，必须等用户解锁。

当然，这个功能也有副作用——黑客可以用这个来"锁别人的号"，故意输错密码把别人的账号锁了，让用户没法登录。这叫"拒绝服务攻击"。

所以实际应用中，一般是"IP限制 + 账号锁定"结合起来用，既能防暴力破解，又能减少被滥用的风险。

### 5.7.5 异常登录检测 🚨

除了上面这些被动防御，还可以做主动的异常检测，比如：

- **异地登录检测**：用户平时都在北京登录，突然从非洲登录了，这就很可疑
- **异常时间登录**：用户都是白天登录，突然凌晨3点登录，值得怀疑
- **异常设备登录**：用户一直用iPhone登录，突然换成了Android，可能有问题
- **登录频率异常**：短时间内大量登录尝试，明显是暴力破解
- **密码尝试规律**：尝试的密码都是字典里的常见密码，一看就是在爆破

检测到异常登录后，可以：
- 要求输入额外的验证码
- 给用户发提醒邮件/短信
- 直接拒绝登录，要求验证身份
- 暂时锁定账号

### 5.7.6 其他防御方法

除了上面这些，还有一些其他的防御手段：

- **双因素认证（2FA）**：除了密码，还要输入手机验证码、动态令牌等，就算密码泄露了也不怕
- **Web应用防火墙（WAF）**：WAF可以检测暴力破解行为，自动拦截可疑IP
- **失败延时**：登录失败后延时几秒再返回，减慢破解速度（聊胜于无）
- **隐藏登录接口**：不要用太明显的登录URL，比如不要叫/login、/admin等
- **IP白名单**：后台管理系统只允许特定IP访问，从源头杜绝攻击

总之，防御暴力破解是一个系统工程，需要多种手段结合起来，层层防护，才能达到最好的效果。

---

## 5.8 新手常见问题FAQ

很多新手刚开始玩暴力破解的时候，都会遇到各种各样的问题。这里我整理了一些最常见的问题，给大家解答一下。

### 5.8.1 Burp怎么抓不到包？

这是新手最常遇到的问题。Burp抓不到包，一般是这几个原因：

**问题1：浏览器代理没配对**
- 检查浏览器的代理地址是不是 `127.0.0.1`，端口是不是 `8080`
- 确保代理是开启状态，不是"系统代理"或"自动检测"

**问题2：Burp的监听没开**
- 打开Burp，进入 **Proxy** → **Options**
- 看看Proxy Listeners里有没有 `127.0.0.1:8080`，而且Running是打勾的
- 如果没有，点击Add添加一个

**问题3：Intercept是Off的**
- 进入 **Proxy** → **Intercept**
- 看看按钮上写的是"Intercept is on"还是"Intercept is off"
- 如果是off，点一下切换成on

**问题4：访问的是localhost或127.0.0.1**
- 有些浏览器默认不代理本地地址
- 试试用你电脑的真实IP地址访问，比如 `http://192.168.1.100/dvwa/`
- 或者在浏览器的代理设置里，把"不代理本地地址"的勾去掉

**问题5：HTTPS网站抓不到**
- 这是因为Burp的证书没安装
- 需要先把Burp的CA证书导入到浏览器里
- 具体方法可以去网上搜"Burp Suite HTTPS抓包"，教程很多

### 5.8.2 Intruder的Attack Type有几种模式？分别是什么意思？

Burp Intruder的Attack Type一共有4种，很多新手搞不清楚。我用大白话给大家解释一下：

假设我们有两个payload位置，payload1有[A, B, C]三个，payload2有[1, 2, 3]三个。

**1. Sniper（狙击手模式）🎯**
- 只有一个payload集，依次替换每个位置
- 比如位置1和位置2，每个位置都用payload集里的内容轮一遍
- 适合单参数爆破，或者多个参数但用同一个字典
- 总请求数：位置数 × payload数量 = 2 × 3 = 6次

**2. Battering ram（撞击 ram 模式）🐏**
- 一个payload集，所有位置同时替换成同一个值
- 比如位置1和位置2，同时变成A，再同时变成B，再同时变成C
- 适合多个参数需要填一样值的情况
- 总请求数：payload数量 = 3次

**3. Pitchfork（干草叉模式）🌾**
- 多个payload集，每个位置对应一个集，按顺序一一对应
- 比如第1次：位置1=A，位置2=1；第2次：位置1=B，位置2=2；第3次：位置1=C，位置2=3
- 适合多个有关联的参数，比如用户名和密码一一对应，或者Token和密码
- 总请求数：最少的那个payload集的数量 = 3次

**4. Cluster bomb（集束炸弹模式）💣**
- 多个payload集，所有组合都试一遍（笛卡尔积）
- 比如A+1, A+2, A+3, B+1, B+2, B+3, C+1, C+2, C+3
- 适合同时爆破用户名和密码，所有组合都试
- 总请求数：payload1数量 × payload2数量 = 3 × 3 = 9次

**怎么选？**
- 只爆破一个参数 → Sniper
- 同时爆破用户名和密码，所有组合 → Cluster bomb
- 用户名和密码是一一对应的（比如已知的账号密码对）→ Pitchfork
- 多个参数填一样的值 → Battering ram

### 5.8.3 字典在哪下载？有哪些推荐？

这个问题也经常有人问。这里给大家推荐几个常见的字典来源：

**1. rockyou.txt**
- 最经典的字典，没有之一
- 包含了1400多万个泄露的密码，来自RockYou网站泄露事件
- 做Web安全的，电脑里必备这个字典
- 网上一搜就能找到，注意找安全的下载源

**2. SecLists**
- 一个非常全的安全测试字典集合
- 包含密码字典、用户名字典、目录字典、子域名字典等等
- GitHub上搜SecLists就能找到，开源免费
- 强烈推荐，做安全的都应该有一份

**3. 各种Top N密码**
- top100、top1000、top10000、top100000……
- 就是最常用的N个密码，命中率很高
- 适合先拿小字典快速试一下，不行再用大字典

**4. 社工字典**
- 根据目标的个人信息生成的字典
- 命中率比通用字典高很多
- 可以用Cupp、社工字典生成器等工具自己生成

**5. 中文密码字典**
- 因为中国人设置密码有自己的习惯，英文字典不一定好用
- 网上有很多中国人常用密码字典，可以找来试试

**小提示：** 字典不是越大越好。太大的字典跑起来很慢，而且大部分都是没用的。建议从小到大，先用小字典快速试，不行再换大字典。比如先用top1000试试，不行再用top10000，还不行再用rockyou。

### 5.8.4 为什么我按照教程做了，但还是爆破不成功？

爆破不成功，可能的原因有很多，挨个排查：

**1. 用户名不对**
- 不要默认用户名就是admin，先确认一下用户名对不对
- 可以先试试SQL注入，或者看看有没有信息泄露的地方

**2. 字典里没有正确密码**
- 这是最常见的原因
- 如果密码足够复杂，字典里没有，那肯定爆破不出来
- 试试更大的字典，或者社工字典

**3. 防护措施没绕过**
- 是不是有验证码？有验证码的话Burp直接爆破肯定不行
- 是不是有Token？有Token的话要用Pitchfork模式
- 是不是有IP限制？换个IP或者用代理池

**4. Burp配置不对**
- 检查payload位置有没有标对
- 检查Attack Type选对了没有
- 检查字典加载成功了没有

**5. 响应长度都一样，不知道哪个对**
- 可以试试用Grep功能，搜索特定关键词，比如"Welcome"、"成功"、"incorrect"等
- 或者看看响应的具体内容，对比一下有什么不同

---

## 5.9 本章总结

好了，第5章到这儿就差不多了。咱们来总结一下今天都学了啥：

### 5.9.1 本章知识点回顾 📝

1. **什么是暴力破解**
   - 就是一个一个试密码，试对为止
   - 就像猜保险柜密码、找钥匙开门一样
   - 前提条件：没有验证码、没有次数限制、密码不够复杂

2. **字典是什么**
   - 字典就是用户名/密码的集合，暴力破解的弹药
   - 常见弱密码：123456、password、admin……
   - 字典可以网上下载，也可以自己生成

3. **Low级别**
   - 什么防护都没有，裸奔状态
   - Burp Intruder的Sniper模式直接爆破
   - 看响应长度找正确密码

4. **Medium级别**
   - 加了2秒延时，防SQL注入
   - 还是能爆破，就是慢点
   - 可以用多线程或更快的工具加速

5. **High级别**
   - 加了Token，每次请求都不一样
   - 用Pitchfork模式 + Recursive grep提取Token绕过
   - 单线程，速度慢一些，但还是能成功

6. **Impossible级别**
   - 账号锁定 + 失败次数统计 + Token + 延时
   - 暴力破解基本不可能，这才是正确的防御方式

7. **防御方法**
   - 强密码策略
   - 验证码
   - 限制登录次数
   - 账号锁定
   - 异常登录检测
   - 双因素认证……

### 5.9.2 给新手的一些建议 💡

学完这一章，有些新手可能会觉得："哇，暴力破解好厉害啊，以后我随便一个网站都能破解了！"

打住打住！🙅‍♂️ 我必须给大家泼点冷水：

**第一，现实中的网站，大部分都有防护的。**
你看DVWA的Low级别都是没防护的，但现实中这么傻的网站已经很少了。正经网站基本都有验证码、登录次数限制，哪有那么容易让你爆破。

**第二，暴力破解是违法的！**
重要的事情说三遍：**不要去爆破别人的网站！不要去爆破别人的网站！不要去爆破别人的网站！**

我们学习这些技术，是为了防护，不是为了攻击。你只能在自己搭的靶场里练习，或者在有授权的情况下做渗透测试。未经允许去爆破别人的网站，那是违法行为，是要坐牢的！⚠️

**第三，防御比攻击更重要。**
我们学习暴力破解，最终目的是知道怎么防御它。作为开发者，要知道怎么保护自己的网站；作为普通用户，要知道怎么设置一个安全的密码。

好了，鸡汤就灌到这儿。希望大家都能做一个白帽子，用技术保护别人，而不是伤害别人。

### 5.9.3 下章预告 📢

这一章我们学了暴力破解，是不是感觉很有意思？下一章我们要学习一个更经典、更有意思的漏洞——**SQL注入**！

SQL注入可是Web漏洞里的"老大哥"，常年位居OWASP Top 10榜首。它的威力巨大，一旦利用成功，就能获取整个数据库的数据，甚至控制整个服务器。

下一章我们会从SQL注入的基本原理讲起，然后用DVWA的SQL注入模块实战，从Low级别一路打到Impossible。准备好了吗？我们下章见！👋

---

**加油，小伙伴们！学习的路上虽然有点辛苦，但每学会一个新技能，你就离大神更近一步！💪**
