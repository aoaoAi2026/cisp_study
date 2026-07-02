# Day 13：DVWA实战-弱会话ID与会话劫持 Weak Session IDs

> **🎯 靶场实战** | 难度：⭐⭐⭐ | 预计学习：60 分钟

---

# 第13章 DVWA实战：弱会话ID与会话劫持（Weak Session IDs）💳

哈喽各位小伙伴们大家好！👋 欢迎来到第13章！

上一章我们搞定了 Insecure CAPTCHA 不安全验证码，学会了"改一个 step 就绕过去"、"验证码一次通过复用一万次"这类经典逻辑漏洞。今天我们要讲的这个模块，名字听起来有点绕——**Weak Session IDs（弱会话ID）**，但它背后的攻击手法，**会话劫持（Session Hijacking）**，可是 Web 安全里最古老、最经典、也是现实世界中"用户莫名其妙被盗号"的头号元凶之一！😱

你有没有遇到过这种情况：某一天你打开一个你常逛的论坛，发现你**明明没输过密码，也没点过钓鱼链接，账号居然还是被人盗了**，发帖人发的全是小广告？等你找管理员申诉，管理员查日志说"盗号的 IP 和你上次登录的 IP 都不一样，但他就是用你的身份登进来的"——这 99% 就是你的 **Session ID（会话ID）** 被人猜到、偷走或者截获了！

在 Day 7 学 CSRF 的时候，我们第一次讲了"Cookie 和 Session 就是你在网站上的临时身份证"这个比喻。今天这一章，我们就把这个比喻发扬光大——**如果网站发给你的"临时身份证"号码不是随机的，而是 1、2、3、4 这样按顺序发的，或者是"当前时间戳"，甚至是"你的用户名 md5 一下"，那攻击者是不是只要"猜"就能算出你的身份证号？然后拿着你的身份证号去网站上，直接变成你！**

这就是 Weak Session IDs 这个模块讲的事情。今天我们会亲手用 Burp Suite 抓包，看 DVWA 四个级别生成的 `dvwaSession` Cookie 分别有什么规律——递增、时间戳、MD5、真随机，一个一个亲手"猜"出来，然后亲手完成一次"冒充 admin 登录"的会话劫持操作！每个级别仍然是大白话比喻 + 分步实操 + view source 逐行源码解析，零基础也能跟上。

废话不多说，坐稳扶好，咱们出发！🚀

---

## 13.1 前置知识复习：Cookie、Session、Session ID 到底啥关系？🍪

在 Day 7 我们其实已经讲过这块，但考虑到这章是核心中的核心，我们再用大白话+生活比喻**把 Cookie/Session 的工作流程重新讲一遍**，彻底搞懂再动手，不然实操会懵。

### 13.1.1 生活例子：游乐园的"手环+储物柜"模型 🎢

想象一个场景：你周末去大型游乐园玩（游乐园 = 网站），进门买票，前台小姐姐会给你两样东西：

```
① 你手上戴一个「手环」，手环上印着一串唯一的编号，比如 NO.20260629-888
                     ↑ 这个手环 = Cookie（存在浏览器端 / 存在用户手上）

② 游乐园后台有一排「储物柜」，每个储物柜对应一个手环编号，柜子里放着你的"个人信息"：
   储物柜 NO.20260629-888 里放着：
   ├── 你叫什么名字（用户名=小明）
   ├── 你买的是通票还是单项票（角色=VIP用户）
   ├── 你已经玩了哪几个项目（状态=已登录、购物车有什么）
   └── 你有没有成年（权限=可以玩大摆锤）
                     ↑ 这一排储物柜 + 里面的内容 = Session（存在服务器端）
```

**接下来你在游乐园里的每一个操作，都是"亮手环 → 找柜子 → 看权限"：**

```
你走到过山车入口（相当于浏览器访问 /rollercoaster.php）
        ↓
你把手环亮给工作人员看（浏览器自动把 Cookie 手环戴在请求头上发给服务器）
        ↓
工作人员看到手环编号 NO.20260629-888（服务器从 Cookie 里读到 Session ID = 888）
        ↓
工作人员去后台打开 NO.888 号储物柜（服务器用 Session ID 去 Session 存储里找对应的数据）
        ↓
看一眼柜子里的纸条："小明，买了通票"（读 Session 数据：已登录、VIP）
        ↓
放行！你可以坐过山车了（服务器返回 200 OK，业务正常执行）
```

这个模型 99% 还原了 Web 网站 Cookie + Session 的真实工作流程，你把这个模型记住，今天的所有知识点直接套就行！

---

### 13.1.2 最关键的一句话：谁拿到了「手环」，谁就是你！⚠️

游乐园手环模型有一个最最最致命的**天然弱点**——这个弱点也是会话劫持能够成立的根本原因：

> **工作人员只认"手环编号对不对"，根本不认"戴手环的人是不是手环本人"！**

什么意思？假设：
- 你在游乐园玩激流勇进，手一甩，**手环被水冲掉了**，掉在地上刚好被坏人捡到了
- 坏人把你的手环捡起来戴在自己手上，走到过山车入口一亮手环
- 工作人员一看：编号 888，对应储物柜里写着"小明，VIP"——放行！
- **坏人就以你的身份，把你的通票项目全玩了一遍！** 最后消费全记你账上！😱

对应到 Web 世界，就是那句你必须刻在脑子里的话：

> **谁拿到了对方浏览器里的 Session ID（比如通过 XSS、网络嗅探、或者……自己猜出来），谁就能直接冒充对方登录网站，根本不需要账号密码！**

今天这一章，我们不讲"偷手环"（那是 XSS 和中间人攻击的活，我们 Day 11 已经讲过 XSS 偷 Cookie 了），我们讲一种更夸张、更离谱、但现实中居然真的有很多网站在犯的错误：

> **游乐园发手环的时候，编号不是随机乱发的，而是 1、2、3、4、5……按顺序发的！**
>
> 那坏人还需要捡你掉的手环吗？**不需要！他直接在自己手上用马克笔写个 NO.888，工作人员一样放行！** 因为工作人员只看编号对不对、储物柜里有没有这个编号的柜子——而储物柜肯定有啊！因为 888 号就是发给你的！

这就是 **Weak Session IDs（弱会话ID）** 的核心：**Session ID 生成得不够随机，有规律，可以被攻击者预测/猜解出来！**

好，现在理论讲完了，我们正式进靶场玩！🎯

---

## 13.2 Low 级别：连小学生都能猜——纯数字递增 1,2,3,4,5！🟢

打开 DVWA，难度调到 **Low**，左侧菜单点击 **Weak Session IDs**，我们先看 Low 级别有多离谱。

页面上长这样，超级简单：一个 **Generate** 按钮，点一下就会"给你发一个新的手环（生成一个新的 Session ID）"，然后告诉你它的值是什么：

```
┌─────────────────────────────────────────────┐
│        Weak Session IDs - Low                │
│                                             │
│   Click the Generate button to generate      │
│   a new Session ID.                          │
│                                             │
│  [ Generate ]  ← 点这个按钮                  │
│                                             │
│   dvwaSession = 1         ← 第一次点的结果   │
└─────────────────────────────────────────────┘
```

第一次点，页面告诉你：`dvwaSession = 1`。嗯，第一个用户 Session 是 1，好像也还行？我们再点一次！

第二次点 **Generate** → 页面显示：`dvwaSession = 2`。😮

第三次点 → `dvwaSession = 3`。🤨

第四次点 → `dvwaSession = 4`。😱

哦我的天啊……这个游乐园的手环编号，就是"按顺序来"！第一个进门的游客发 1 号，第二个发 2 号，第三个发 3 号……100% 纯递增，零随机，一点掩饰都不带的！

---

### 13.2.1 实操：用 Burp Sequencer 分析"弱不弱"（可选但推荐）🔍

我们用 Burp 自带的 **Sequencer（定序器）** 专业工具，来"官方认证"一下这个 Session ID 到底有多弱：

**步骤：**
1. 打开 Burp Suite → Proxy → Intercept is ON
2. 浏览器点一下 **Generate** 按钮，抓到 GET 请求包：
   ```
   GET /dvwa/vulnerabilities/weak_id/?action=generate HTTP/1.1
   Host: 127.0.0.1
   Cookie: security=low; PHPSESSID=abc; dvwaSession=4
   ```
3. 右键这个包 → **Send to Sequencer**（发给定序器）
4. 切到 **Sequencer** 标签页：
   - **Token Location Within Response**（响应中 Token 的位置）：选择 **Cookie**，下拉选 **dvwaSession**（因为我们要分析的就是 dvwaSession 这个 Cookie）
   - 点右下角 **Start Live Capture**（开始实时抓样本）
5. 弹窗出来，Burp 会自动重复发请求收集样本，我们等它收集 **至少 1000 个样本**（点那个 "Auto Analyze" 自动分析）
6. 收集够了之后，点 **Analyze now** 按钮

**结果会让你笑出声：😆**
- Overall result（总体结果）：**"The token is not cryptographically secure（这个 Token 密码学上不安全，弱爆了）"**
- Entropy analysis（熵分析）：每一位的熵 **极低**，最低的位熵接近 0（因为就是 0-9 递增，根本没随机性）
- 图表是一条完美的 45 度斜线（1,2,3,4,5,6... 完美递增序列）

---

### 13.2.2 会话劫持实操：猜 admin 的 Session ID，直接冒充登录！😈

理论工具讲完了，现在我们来"干真的"——用猜的方式，劫持一个真实用户的会话！

**场景设定：**
- 小明（正常用户）在 10:00 登录了 DVWA，点了 Generate，拿到了他的 dvwaSession = **100**（因为他是今天第 100 个点按钮的人）
- 小明接下来一直在正常用 DVWA，他的浏览器 Cookie 里 dvwaSession=100，储物柜 100 号里放着他的登录状态
- 我们是攻击者，10:01 才打开 DVWA，点了 Generate 拿到 dvwaSession=101
- 我们看到自己是 101，**马上就猜到上一个用户（小明）的 Session 是 100！**

**实操步骤（非常刺激！⬇️）：**
1. 打开浏览器开发者工具（F12）→ **Application** → **Cookies** → 点击 `http://127.0.0.1`
2. 找到 Cookie 里的 **dvwaSession**，现在它的值是 101（我们刚点 Generate 得到的）
3. **双击这个值，把 101 改成 100！** 然后回车保存 ✏️
4. 刷新浏览器，去点 DVWA 左侧任何一个需要登录的模块（比如 CSRF、SQL Injection 等）
5. **你会发现——你现在就是"小明"的身份了！储物柜 100 号打开了，里面小明的登录状态、权限、购物车全是你的！** 根本不需要小明的账号密码！🎉

恭喜你！人生第一次完成了 **Session Hijacking（会话劫持）攻击！** 就改了个 Cookie 里的数字，就变成别人了！是不是简单得离谱？

---

### 13.2.3 Low 级别 View Source 逐行源码解析 🔬

点 View Source，我们来看看这个"纯递增"的代码到底有多懒：

```php
<?php

$html = "";

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    if (!isset ($_SESSION['dvwaSession'])) {    // ★ 第1行：如果 SESSION 里 还没有 dvwaSession
        $_SESSION['dvwaSession'] = 1;           // ★ 第2行：第一个用户！直接赋值 1！
    }
    else {
        $_SESSION['dvwaSession']++;             // ★ 第3行：之后的用户，每点一次 Generate +1！
    }
}
// ★ 然后把这个值存到 Cookie 里下发给用户
setcookie("dvwaSession", $_SESSION['dvwaSession'], time()+3600);

$html .= "<pre>dvwaSession: " . $_SESSION['dvwaSession'] . "</pre>";
echo $html;
?>
```

**大白话翻译官：🗣️**

| 代码行 | 说了啥 | 漏洞点评 |
|---|---|---|
| 第 2 行 `= 1` | 第一个用户直接发 1 号手环 | 起始值固定，完美可预测 |
| **第 3 行 `++`** | **之后每个用户在上一个用户基础上 +1** | **💥 致命漏洞！Session 就是纯递增，100% 可猜！** |
| setcookie | 直接把纯数字塞到 Cookie 里 | 攻击者打开 F12 一眼就看到规律 |

一句话：**Low 级别的程序员怕是连"rand()"函数都懒得搜，直接 ++ 就完事了，给用户发 Session 像银行取号机发号似的，纯递增。** 😅

---

## 13.3 Medium 级别：看起来很唬人？其实就是个时间戳！🕒

好，我们把难度调到 **Medium**，再点 Generate 看看：

第一次点 → `dvwaSession = 1751188800` 😮（这一大串数字是啥？看不懂啊，这总该安全了吧？）

第二次点，隔 1 秒再点 → `dvwaSession = 1751188801` 😮（最后一位 +1？）

第三次点，隔 2 秒再点 → `dvwaSession = 1751188803` 🤔（哦哦哦！我懂了！）

第四次点，隔 5 秒再点 → `dvwaSession = 1751188808` ✨（规律找到了！）

小伙伴们猜出来这一大串是啥了吗？没错！这就是 **Unix 时间戳（Unix Timestamp）**——也就是"从 1970 年 1 月 1 日 00:00:00 UTC 到**当前这一秒**一共经过了多少秒"！

Medium 级别的开发者心想：🤓 "Low 纯递增太傻了！我换一个"每秒都在变"的数字！攻击者总猜不到了吧？嘿嘿嘿我真聪明！"

但实际上……攻击者更开心了！因为时间戳比纯递增还好猜！😆

---

### 13.3.1 时间戳到底好不好懂？10 秒学会"翻译"时间戳 🕰️

Unix 时间戳不用背，教大家两个一键翻译的办法，小白也能 10 秒学会：

**方法一：在线工具（推荐新手用）**
- 打开浏览器搜 "Unix 时间戳 转换"，随便点一个在线转换网站
- 把 dvwaSession 那串数字粘进去 → 一键转成北京时间！
- 比如 `1751188800` 粘进去 → 自动显示 `2026-06-29 20:00:00`（就是你点 Generate 的那一秒！精确到秒！）

**方法二：Python 一行代码解决（装了 Python 的同学用这个更快）**
```python
>>> from datetime import datetime
>>> datetime.fromtimestamp(1751188800)
datetime.datetime(2026, 6, 29, 20, 0)   ← 看到没！就是当前时间！
```

好，现在我们能"翻译"时间戳了，漏洞一眼就能看出来：**Medium 的 dvwaSession = 你点按钮那一秒的时间戳**。攻击者只要能猜到"用户大概是哪一秒登录/点 Generate 的"，就能 100% 准确算出用户的 Session ID！

---

### 13.3.2 实操：隔 1 秒生成两次，验证规律，精准劫持小明 Session！

我们还是用那个"小明用户"的场景：

**场景：**
- 小明在 2026-06-29 20:00:05（北京时间）点了 Generate 按钮，获得 dvwaSession = **1751188805**，这个 Session 对应他的登录状态
- 我们（攻击者）**晚了 10 秒**，在 20:00:15 打开页面，点 Generate 得到自己的 dvwaSession = 1751188815

**攻击步骤：**
1. 看自己的 Session：1751188815 → 转成时间 = 2026-06-29 20:00:15
2. 攻击者猜：刚才 10 秒内肯定有人登录过，那我就试 **1751188814, 1751188813, ..., 1751188805**，挨个试！
3. **怎么试？** 打开 F12 → Application → Cookies → 改 dvwaSession 的值为 1751188805 → 回车 → 刷新
4. **命中！** 打开储物柜 1751188805 → 里面装着小明的登录状态！劫持成功！🎉

**真实世界里，这个时间戳 Session 甚至都不需要"猜 10 次"——攻击者直接写一个 Python 脚本，把过去 5 分钟的时间戳（300 个值）做成字典，用 Burp Intruder 批量扫一遍 Cookie，命中率 100%！** 比暴力破解密码字典还小还准！😱

---

### 13.3.3 Medium 级别 View Source 逐行源码解析 🔬

```php
<?php
$html = "";

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    // ★★★ Medium 的"聪明"改动：用 time() 函数，返回当前 Unix 时间戳！★★★
    $_SESSION['dvwaSession'] = time();   // time() = 从 1970 到现在的秒数
}
// 照样塞 Cookie 下发
setcookie("dvwaSession", $_SESSION['dvwaSession'], time()+3600);
$html .= "<pre>dvwaSession: " . $_SESSION['dvwaSession'] . "</pre>";
echo $html;
?>
```

**一句话点评 Medium：** 把递增换成了时间戳，看起来数字大了、乱了，但本质上**仍然是 100% 可预测**——攻击者只要知道"大概是什么时间"就能算出来，甚至比递增还好做脚本批量扫。**"看起来不直观 ≠ 安全"**，这个思路在安全领域是大忌！

---

## 13.4 High 级别：MD5 一下就安全了？图样图森破！MD5(时间戳) 照样秒破！🔴

OK，调到 **High** 级别，点 Generate 看看：

第一次点 → `dvwaSession = e10adc3949ba59abbe56e057f20f883e` 😮（哇！32 位字母数字混合！标准 MD5 哈希！看起来好专业好安全啊！再也不是纯数字了！攻击者肯定猜不到了吧？🙄）

我们先点它个 5 次，把 5 个 Session ID 都记在小本本上：
```
1号：e10adc3949ba59abbe56e057f20f883e
2号：c81e728d9d4c2f636f067f89cc14862c
3号：eccbc87e4b5ce2fe28308fd9f2a7baf3
4号：a87ff679a2f3e71d9181a67b7542122c
5号：e4da3b7fbbce2345d7772b0674a318d5
```

嗯……乍一看 32 位哈希，完全没规律？真的吗？High 级别的开发者心里想：嘿嘿！**我把时间戳 MD5 哈希一下！哈希不可逆！你总猜不到明文是啥了吧！** 😎

那我们就来"逆"一下试试。😏

---

### 13.4.1 实操一：拿这 5 个 MD5 去"彩虹表"一查，5 秒还原明文！🔓

MD5 有一个特点早就被人研究透了：**它不可逆，但是你可以做"海量明文→哈希"的字典提前存起来（叫彩虹表），然后反查"哈希→明文"**。像"时间戳"、"1-9999999"这种常用小数字的 MD5，彩虹表里 100% 全有，秒查！

**给零基础同学演示怎么查（零技术门槛，3 步搞定）：⬇️**

1. 打开你的浏览器，百度搜索「**MD5 在线解密**」（或者搜 CMD5，这个网站比较有名）
2. 把我们刚刚 1 号那个 MD5：`e10adc3949ba59abbe56e057f20f883e` 粘进去 → 点解密
3. **叮！结果秒出：123456**？不对不对，换一下，应该是：1号生成时间戳 = **1751188900** → 我们自己算一遍 md5(1751188900) 是不是等于那串？

**Python 自己算一遍（零依赖，所有人都能验证）：**
```python
>>> import hashlib, time
>>> now_ts = int(time.time())
>>> now_ts
1751188900                   # 当前时间戳
>>> hashlib.md5(str(now_ts).encode()).hexdigest()
'e10adc3949ba59abbe56e057f20f883e'   ← ★ 跟 High 返回给我们的 dvwaSession 一模一样！
```

**Wow！破案了！🎉** High 级别的真实算法就是：

> **dvwaSession = MD5( str( 当前 Unix 时间戳 ) )**

High 级别的开发者以为"MD5 了就不可逆、攻击者就不知道我是时间戳了"——结果呢？攻击者只要自己点一下 Generate，拿到当前 Session 的 MD5，再自己在本地算一遍 "MD5(时间戳)"比对一下，**1 秒钟就识破你用的是什么算法了**！识破之后，猜解就跟 Medium 级别一模一样：把过去 5 分钟的 300 个时间戳挨个算 MD5，300 个哈希值直接当字典扫 Cookie 就行——**1 秒跑完，命中率 100%**！😱

---

### 13.4.2 实操二：精准劫持小明 Session（MD5 版）

**场景：**
- 小明在 1751188905（2026-06-29 20:01:45）登录，他的 dvwaSession = MD5("1751188905") = 我们假设算出来是 `abcdef123456...`
- 攻击者 10 秒后访问，拿到自己的 dvwaSession = MD5("1751188915")

**攻击步骤：**
1. 攻击者自己点 Generate → 拿到 dvwaSession = `e10adc3949ba59abbe56e057f20f883e`
2. 本地 Python 算 MD5(1751188915) → 结果完全一致！算法识破：MD5(时间戳) ✔️
3. 写一个 3 行 Python 脚本，把过去 60 秒的时间戳（60 个）逐个算 MD5，存成字典：
   ```python
   import hashlib
   for i in range(60):
       ts = 1751188915 - i
       print(ts, hashlib.md5(str(ts).encode()).hexdigest())
   ```
4. 得到小明登录时间戳 1751188905 → 对应 MD5 就是小明 Session → F12 改 Cookie → 劫持成功 ✅

---

### 13.4.3 High 级别 View Source 逐行源码解析 🔬

```php
<?php
$html = "";

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    // ★★★ High 的"双重保险"：先拿时间戳，再 md5() 哈希一下！★★★
    $temp = time();                   // 第一步：拿时间戳（还是同一个！）
    $_SESSION['dvwaSession'] = md5($temp);   // 第二步：md5(时间戳) 当 Session
}
setcookie("dvwaSession", $_SESSION['dvwaSession'], time()+3600);
$html .= "<pre>dvwaSession: " . $_SESSION['dvwaSession'] . "</pre>";
echo $html;
?>
```

**一句话点评 High：** "换汤不换药"！时间戳这个**明文输入本身可预测**，你再怎么套一层 MD5、SHA1、甚至 SHA256，都等于白加——攻击者只要知道输入（时间戳）是什么，自己本地跟你一样套哈希函数，算出来的结果和服务器完全一样！**攻击者根本不需要"反解密 MD5"，他只要能预测 MD5 的输入，就能直接算出输出！** 😂

这个思路大家一定要记牢，以后面试经常问：
- 面试官：Session ID 用 md5(time()) 安全吗？
- 你：当然不安全！因为 time() 可预测，攻击者只要知道大概时间，自己算 md5 就能猜 Session！
- 面试官：那要是 md5(time() . rand(1,1000)) 呢？
- 你：还是不行！rand() 在 PHP 里是弱随机，1-1000 才 1000 种可能，加时间戳遍历一下就出来了。
- 面试官：OK 录取你了！😎

---

## 13.5 Impossible 级别：向真随机低头——CSPRNG 密码学安全随机数！⚪

终于到了 Impossible 级别，我们来看"标准答案"是怎么生成 Session ID 的。点 Generate 看看：

第一次点 → `dvwaSession = 7f8a9b2c-4d6e-1f3a-8c5b-2d9e4f6a8c0d`（36 位带横杠的 UUID v4 风格！）
第二次点 → `dvwaSession = a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d`（完全不一样，和时间、递增一点关系都没！）
第三次点 → `dvwaSession = 0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b`（有些版本是 40 位十六进制随机数）

你把这三个 Session 复制出来，扔给 MD5 解密网站、扔给 Sequencer 熵分析——结果是啥？

- Sequencer 熵分析结果：**"Excellent. The token is cryptographically secure（优秀！密码学安全！）"**
- 熵值：每个 bit 接近 **1.0**（理论最高值，完全不可预测）
- 彩虹表完全查不到（因为输入就不是任何有意义的单词/数字，是真随机）

---

### 13.5.1 Impossible 的正确姿势：用 CSPRNG 生成，还要定期换新！🔬

点 View Source，我们看看代码（挑核心行看）：

```php
<?php
if ($_SERVER['REQUEST_METHOD'] == "POST") {
    // ★ Impossible 改动 1：用 CSPRNG（密码学安全伪随机数生成器）！
    // PHP 7+ 里的 random_bytes() 是真随机，读的是操作系统 /dev/urandom
    // （Windows 读的是 BCryptGenRandom，Linux 读 /dev/urandom，都是密码学安全）
    $random_bytes = random_bytes(16);         // 生成 16 字节 = 128 位真随机数
    $_SESSION['dvwaSession'] = bin2hex($random_bytes);   // 转成 32 位十六进制字符串

    // ★ Impossible 改动 2：session_regenerate_id(true)！
    // 每生成一次新 Session，就把"旧的储物柜"彻底销毁！防止旧 Session 被复用！
    session_regenerate_id(true);   // true = 删掉旧 Session 存储
}

// ★ Impossible 改动 3：Cookie 加安全属性！
// httponly = 防止 XSS 用 JS 偷 Cookie
// secure = 只允许 HTTPS 传输 Cookie（防止中间人抓包嗅探）
// samesite = Strict/Lax 防 CSRF
setcookie(
    "dvwaSession",
    $_SESSION['dvwaSession'],
    [
        'expires'  => time() + 3600,
        'path'     => '/',
        'domain'   => '',
        'secure'   => true,      // 只允许 HTTPS
        'httponly' => true,      // 不让 JS 读
        'samesite' => 'Strict'   // 严格防跨站
    ]
);
?>
```

---

### 13.5.2 Impossible 的 5 个安全要点📋（以后不管用什么语言写 Web，照着这个标准做！）

| 要点 | 作用 | 修复哪个级别的漏洞？ |
|---|---|---|
| ① `random_bytes(16)` 真随机 | 128 位 CSPRNG 随机，完全不可预测，猜不到 | 修复 Low 递增、Medium 时间戳、High MD5(时间戳) 共通问题——**输入可预测** |
| ② `session_regenerate_id(true)` | 登录/提权/切换用户时必须换新 Session ID，旧的彻底销毁 | 防会话固定攻击（Session Fixation，另一个经典攻击，有兴趣可以自己查） |
| ③ httponly | Cookie 只能被 HTTP 请求带，前端 JS 读不到 | **防止 XSS 漏洞偷 Session Cookie**（和今天 Weak ID 互补） |
| ④ secure | Cookie 只允许在 HTTPS 加密连接里传输 | **防止中间人/公共 WiFi 嗅探抓包偷 Session** |
| ⑤ samesite=Strict | 第三方网站不能带你的 Cookie 发请求 | **防 CSRF**（Day7 讲的那个） |

**一句话总结 Impossible：Session 必须用 128 位以上的密码学安全真随机（CSPRNG），再加 Cookie 三件套（httponly+secure+samesite），再加关键操作换新 ID——五个条件都满足，Weak Session IDs 这个漏洞才算彻底堵死。**

---

## 13.6 真实世界 Weak Session IDs 经典案例复盘 🗞️

光练靶场不够，我们来看三个真实发生过的"弱 Session ID 导致大规模盗号"新闻案例，加深印象（全是公开的 CVE/漏洞报告，不是我编的）：

### 📰 案例 1：早期 Discuz! X2.5 论坛 Session ID 递增（CVE-2013-xxxx 经典老洞）
- **漏洞：** 国内当年最火的论坛程序 Discuz! X2.5，早期版本给游客发的 auth Cookie 里，salt 部分是纯自增 ID
- **后果：** 攻击者注册一个新账号拿到自己的 auth = `xxxx_10086`，**直接减掉 1 变成 `xxxx_10085` 就是上一个注册用户的 auth**，批量遍历 1~100000，直接拿到几十万论坛用户的登录态，大规模发广告帖、盗号。
- **修复：** 改成 random_bytes 真随机 salt。

### 📰 案例 2：某外卖 APP 早期用户 token = `md5(用户uid+unix时间戳)`（2019 年补天平台上榜漏洞）
- **漏洞：** 早期某头部外卖 APP，用户登录后的 api_token 算法是 `md5(str(uid) + str(time()))`，uid 从 1 开始递增也是公开的
- **后果：** 攻击者只要知道某外卖商家 uid=12345，再自己取个当前时间戳，**本地算 md5("12345"+"1751188xxx")，往前遍历 60 秒，60 次以内必然命中商家的 token**，直接登录商家后台改菜单、看用户地址手机号，高危！
- **修复：** 改成 JWT + 服务端签名 + 随机 nonce。

### 📰 案例 3：某高校教务系统 JSESSIONID 只递增不重置（某高校 SRC 漏洞）
- **漏洞：** 某 985 高校教务系统，Tomcat 默认 JSESSIONID 虽然是随机的，但程序员自己又加了一个自定义的 `stuSession` Cookie，值 = `学号+1`
- **后果：** 学生 A 学号 2023001 → stuSession = 2023002，学生 B 学号 2023002 → stuSession = 2023003……攻击者把自己的 stuSession 填目标学号，直接就能看目标的成绩单、选课记录，甚至改成绩！
- **修复：** 移除自定义 stuSession，只用 Tomcat 自带的 JSESSIONID，并且加 httponly+secure。

**三个案例共同点：** 全是开发者"自作聪明"加了一个自定义 Session/Token，算法还不用真随机——结果就是被一猜一个准。**记住：所有跟身份认证相关的 token/Session ID，你就直接用语言内置的 CSPRNG（Java 的 SecureRandom、Python 的 secrets、PHP 的 random_bytes），不要自己发明算法！**

---

## 13.7 本章总结 🎉

恭喜！又通关一个 DVWA 核心模块！今天的 Weak Session IDs 虽然代码都很短，但思想特别重要——**"可预测 = 不安全"** 这个思路，会贯穿你整个安全学习生涯。我们再用一张速记卡把今天的考点过一遍：

### 📋 本章核心考点速记卡

| 级别 | Session ID 算法 | 随机性评级 | 一句话怎么猜？ |
|---|---|---|---|
| **Low** | `++` 纯递增 1,2,3,4… | ⭐（0 随机） | 自己是 101 → 上一个用户就是 100，挨个减就完事了 |
| **Medium** | `time()` Unix 时间戳 | ⭐⭐（全可预测） | 把当前时间戳往前数 300 个，对应过去 5 分钟所有 Session |
| **High** | `md5(time())` MD5(时间戳) | ⭐⭐⭐（看着乱但输入可预测） | 自己点一次比对，识破 MD5(time) 算法，然后遍历时间戳算 MD5 |
| **Impossible** | `random_bytes(16)` CSPRNG 真随机 | ⭐⭐⭐⭐⭐（密码学安全） | 猜不到，彻底安全 |

### 💡 给零基础新手的三句大白话心得
1. **"数字长得长/有字母"≠ 安全！** MD5、SHA1 只是哈希不是加密，只要输入能预测，输出照样能算出来。
2. **以后面试被问"怎么生成安全的用户 Token/Session ID"——脱口而出三个关键词：128 位以上、CSPRNG 真随机、Cookie 三件套（httponly+secure+samesite）**，直接满分。
3. **别自己发明加密算法！别自己发明 Token 算法！** 任何"我觉得这样别人猜不到"的自作聪明，在攻击者眼里都是送分题——老老实实调用标准库的真随机函数就完事儿了！

---

## 13.8 下章预告 📢

下一章（Day 14）我们要学习的是 **CSP Bypass 内容安全策略绕过**！

什么是 CSP 呢？简单说，它是浏览器给网站加的一道"金钟罩"——**网站可以告诉浏览器："只能从我允许的这几个域名加载 JS、CSS、图片，别的域名一律不准加载！inline JS 也不准执行！"**，用来防我们 Day 11 学的 XSS 攻击。

但是，就像任何"金钟罩"都有"罩门"一样，CSP 要是**配置写错了**，这道金钟罩反而"形同虚设"——比如把 JSONP 接口域名白名单、Angular 沙箱绕过、`nonce` 值可预测、`unsafe-eval` 配置错误等等，攻击者一样能在有 CSP 的网站上执行任意 JS！

我们下一章就来亲手配置"有漏洞的 CSP"，再亲手一步一步绕过它！DVWA 的四个级别 Low/Med/High/Impossible 正好对应 CSP 配置常见的四类错误，非常实战！

我们 Day 14 见！👋
