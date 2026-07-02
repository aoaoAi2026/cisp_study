# Day 12：DVWA实战-不安全的验证码 Insecure CAPTCHA

> **🎯 靶场实战** | 难度：⭐⭐ | 预计学习：55 分钟

---

# 第12章 DVWA实战：不安全的验证码（Insecure CAPTCHA）🤖

哈喽各位小伙伴们大家好！👋 欢迎来到第12章！

不知不觉，咱们已经把 DVWA 里的七大经典漏洞都学完啦——暴力破解、命令注入、CSRF、文件包含、文件上传、SQL 注入、XSS，是不是感觉自己的"打靶功力"已经上了一个大台阶？😎 从这一章开始，我们来攻克 DVWA 剩下的几个"小而精"的模块，这些模块虽然不如前面几个"名气大"，但每一个都是真实 Web 安全里非常高频的考点和坑点，一个都不能放过！

今天我们的主角，就是大家每天上网都会遇到、但很少有人真正想明白它是怎么"防机器人"的——**验证码（CAPTCHA）**！

说到验证码，大家应该都不陌生吧？登录的时候让你"请在下图中找出所有包含红绿灯的图片"，注册的时候让你"拖动滑块完成拼图"，订票的时候让你"输入右侧歪歪扭扭的 4 个字母"…… 这些全都是验证码。它的存在，就像是小区门口的保安——**区分"你是真人还是机器人脚本"**。

但是！你有没有想过一个问题：**既然验证码是防机器人的，那是不是只要网站加了验证码，就一定安全了？**

答案是：**大错特错！❌** 就像小区里的保安，有的保安火眼金睛，一眼就能认出陌生人；有的保安呢？坐在岗亭里刷抖音，谁进小区都不管，甚至你拿昨天的门禁卡给他晃一下，他连头都不抬就让你进了——这种"形同虚设"的保安，我们就叫他 **Insecure CAPTCHA（不安全的验证码）**。

今天这一章，我们就来看看 DVWA 里这位"不负责任的保安"到底有多离谱——Low 级别下，你甚至不需要知道验证码是什么，改一个数字就能直接绕过去！Medium 和 High 级别呢？稍微装得像那么回事儿，但只要我们找对了逻辑漏洞，一样轻松绕过。最后我们再看 Impossible 级别，学习一下"真正负责任的保安"应该怎么当。

坐稳扶好，咱们出发！🚀

---

## 12.1 前置知识：验证码到底是个啥？CAPTCHA 和 reCAPTCHA 有啥区别？

### 12.1.1 大白话解释 CAPTCHA

先搞明白第一个问题：**CAPTCHA 到底是什么？为什么叫这么奇怪的名字？**

CAPTCHA 是个很长很长的英文缩写，全称是 **C**ompletely **A**utomated **P**ublic **T**uring test to tell **C**omputers and **H**umans **A**part，翻译过来是："全自动区分计算机和人类的公开图灵测试"。

名字是不是听着特别高大上？😆 但它的大白话意思特别简单：

> **验证码 = 网站出一道"只有人类能轻松做对、计算机很难做对"的小测验，用来判断"请求是真人发起的，还是机器人脚本批量发起的"。**

我们来举几个生活中的例子，一下子就懂了：

**生活例子 1：银行柜台签字 📝**

你去银行办卡，柜员让你在手写板上签个名。这就相当于一个"人工版验证码"——签名这个活儿，机器模仿起来很难（尤其是连笔字），但真人签起来一秒钟的事儿。柜员核对完签名，确认你是本人，就给你办业务了。

**生活例子 2：机场安检核对身份证+本人 ✈️**

坐飞机过安检，安检员会拿你的身份证和你本人脸对一下，看是不是同一个人。这也是一种"验证码"——机器认脸（早期）容易认错，但人眼认脸很准。安检员的作用，就是防止有人拿别人的身份证坐飞机。

**生活例子 3：网红餐厅叫号取号机🍜**

网红餐厅饭点人特别多，门口放个取号机。你取了号，叫到你才能进去。这个取号机如果没有"人机验证"，竞争对手就可以写个脚本，一秒钟取 1000 个号，把所有号全占满，让真正吃饭的顾客都拿不到号。验证码就是为了防这种"恶意刷号机器人"的。

所以你看，验证码的核心目的，就是防下面这些坏人：

| 验证码防的是什么？ | 真实场景 | 没有验证码会怎么样？ |
|---|---|---|
| 🤖 批量注册脚本 | 垃圾短信、羊毛党 | 一秒注册 100 万个垃圾账号 |
| 🔐 暴力破解密码 | Day5 学过的 Burp Intruder 爆破 | 账号密码被一个一个试出来 |
| 📢 刷屏发广告/垃圾评论 | 论坛、博客、微博 | 评论区全是卖假货的小广告 |
| 🎫 刷票、刷赞、刷排名 | 投票活动、电商评价 | 刷票机器人把票刷到第一 |
| 🛒 抢茅台、抢限量球鞋 | 电商秒杀 | 黄牛脚本秒空库存，真人抢不到 |

一句话总结：**如果网站没有验证码，坏人就可以用脚本"批量干坏事"，真人用户根本玩不过机器。**

---

### 12.1.2 reCAPTCHA 是什么？DVWA 用的是哪一种？

好，现在我们知道 CAPTCHA 是"人机验证"的统称了。那 **reCAPTCHA** 又是什么呢？

简单说：reCAPTCHA 是 Google（谷歌）公司做的一个**老牌、知名、免费的人机验证 SaaS 服务**。全世界有几百万个网站都在用它。它的发展经历了三代：

| reCAPTCHA 版本 | 验证方式 | 特点 |
|---|---|---|
| **v1（老版本）** | 输入两张歪歪扭扭的图片文字（难用，现在基本淘汰） | 真的要"识别文字"，对视力不好的用户不友好 |
| **v2（经典版本）** | 两种：① 勾选"我不是机器人"复选框（I'm not a robot）② 找红绿灯、公交车、自行车的图片 | 现在最常见的版本，DVWA 就是模拟的这个！ |
| **v3（无感知版本）** | 什么都不让用户点，后台悄悄分析用户行为打分（0.0~1.0） | 用户体验最好，但配置复杂 |

**划重点！⭐ 今天我们玩的 DVWA Insecure CAPTCHA 模块，就是模拟的 Google reCAPTCHA v2 那个"复选框+找图片"的流程。**

但是！有个小提醒要告诉大家：**DVWA 这个模块是"阉割版"的 reCAPTCHA**。为什么？因为真的 reCAPTCHA 需要你去 Google 官网申请一个"公钥（Site Key）"和"私钥（Secret Key）"，还得联网访问 Google 的服务器。而 DVWA 为了让大家"离线也能练"，就把真实 Google 校验的部分，换成了它自己用 PHP 代码模拟的"伪校验逻辑"——这也正是我们能"绕过"它的基础。

所以今天我们打的不是 Google 真的 reCAPTCHA（那个确实很安全），而是**"网站开发者在集成 reCAPTCHA 的过程中，因为代码写得烂导致的各种逻辑漏洞"**。这也是真实世界里 99% 的验证码绕过事故的根本原因——**不是验证码本身不行，是接验证码的程序员把它接错了！** 😅

---

### 12.1.3 先逛一下模块长啥样：改密码的功能，两步走流程

打开你的 DVWA，登录进去，把难度调到 **Low**，在左侧菜单栏点击 **Insecure CAPTCHA**，我们先看看这个模块的"表面功能"是什么：

```
┌──────────────────────────────────────────────────────────────────┐
│              Insecure CAPTCHA                                     │
│                                                                  │
│   Change your password:                                           │
│                                                                  │
│   Current password :       [ admin   ]                           │
│   New password     :       [ 123456  ]                           │
│   Confirm new pass :       [ 123456  ]                           │
│                                                                  │
│   ┌────────────────────────────────────────────────┐             │
│   │  🔘 I'm not a robot   (reCAPTCHA 勾选框)       │             │
│   │  Privacy - Terms                                     │             │
│   └────────────────────────────────────────────────┘             │
│                                                                  │
│   [ Change 按钮 ]                                                 │
└──────────────────────────────────────────────────────────────────┘
```

你没看错，这个模块的"正常功能"是——**登录用户修改自己的密码**。

正常用户改密码的流程是这样的（两步走，这个两步逻辑非常关键！⭐⭐⭐ 今天四个级别全是围绕这个"步骤"打转转）：

```
第一步（Step 1）：显示改密码表单 + 验证码
        ↓ 用户填好新密码、勾选完验证码，点击 Change
第二步（Step 2）：服务器校验验证码对不对
        ✅ 对了 → 改密码成功，显示 "Password Changed"
        ❌ 错了 → 显示 "Incorrect CAPTCHA" 改密码失败
```

攻击者的目标是什么呢？很简单：**在不知道（或者根本不填）验证码的情况下，仍然把密码改掉**。

就像你去银行改银行卡密码，正常流程是：取号 → 排队 → 看身份证 → 输旧密码 → 输新密码。攻击者想做的，就是跳过"看身份证+输旧密码"这几步，直接走到最后一步输新密码改成功。

好，概念讲完了。现在开始实战！先从最菜的 Low 级别开刀。🎯

---

## 12.2 Low 级别：连装都懒得装——改一个数字直接通关！🟢

### 12.2.1 先正常走一遍流程，感受一下"正常操作"

老规矩，先做个"乖宝宝"，按正常流程走一遍，知道正常的请求长啥样：

1. 打开 Burp Suite，**打开 Proxy → Intercept is ON**（抓包打开）
2. 浏览器配置好代理指向 Burp（Day3 工具安装讲过，忘了翻回去看哦）
3. 在 DVWA Insecure CAPTCHA 页面填好：
   - Current password：`admin`
   - New password：`password123`
   - Confirm new pass：`password123`
   - ✅ 勾上那个 **I'm not a robot** 复选框（DVWA 里是假的，勾了就认为你过了）
4. 点击 **Change** 按钮
5. 切回 Burp，看到抓到的包了，长这样：

```http
POST /dvwa/vulnerabilities/captcha/ HTTP/1.1
Host: 127.0.0.1
Cookie: security=low; PHPSESSID=abc123def456
Content-Type: application/x-www-form-urlencoded

step=1&
captcha_response=abcdefghijklmnop&           ← 验证码应答
pass_current=admin&
pass_new=password123&
pass_conf=password123&
change=Change
```

看到那个 **`step=1`** 了吗？这就是刚刚说的"第一步"。

现在 Forward 把这个包发出去。正常会收到服务器的响应，然后浏览器显示 **Password Changed**——改密码成功了，没啥好说的。

好，"乖宝宝流程"走完了。现在我们要做"坏孩子"了 😈。

---

### 12.2.2 漏洞在哪里？再抓一次包，不勾验证码，改 step=2 试试？

**Low 级别的漏洞核心：服务器只看 step 的值是多少，不看 step 1 的验证码到底过了没有！**

大白话比喻：银行改密码的流程本来是 **"①叫号（step1）+②核验身份（step2）"两步**。但是 Low 级别的柜员特别傻——你一进去，直接跟他说"我已经叫完号了，我要办第二步"，柜员连号票看都不看，直接就给你办改密码了！🤦‍♂️

**实操步骤，跟着做一遍，超简单：⬇️**

1. 打开 Burp 抓包，仍然 Intercept is ON
2. 回到浏览器，在 Insecure CAPTCHA 页面随便填新密码，比如改成 `hacked123`
3. **重点！这次那个 I'm not a robot 复选框，不要勾！不要勾！不要勾！** ⭐（就是故意不过验证码）
4. 点击 **Change** 按钮
5. Burp 抓到包，长这样：

```http
POST /dvwa/vulnerabilities/captcha/ HTTP/1.1
Host: 127.0.0.1
Cookie: security=low; PHPSESSID=abc123def456
Content-Type: application/x-www-form-urlencoded

step=1&
captcha_response=&                    ← 空的！我们没勾验证码！
pass_current=admin&
pass_new=hacked123&
pass_conf=hacked123&
change=Change
```

6. **就是现在！见证奇迹的时刻！✨ 在 Burp 里把 `step=1` 改成 `step=2`！**
   改完的 POST Body 是：

```
step=2&
captcha_response=&
pass_current=admin&
pass_new=hacked123&
pass_conf=hacked123&
change=Change
```

7. 点 **Forward** 把这个改过的包发出去！

---

### 12.2.3 见证奇迹：改密码成功！🎉

回到浏览器，你会看到什么？看到了页面顶部显示一行绿色的字：

> **Password Changed.** ✅

**What？！** 我们连验证码的框都没勾，仅仅把 `step=1` 改成了 `step=2`，密码就成功改成 `hacked123` 了？！没错！这就是 Low 级别的漏洞——**验证码只在第一步校验，第二步根本不校验你第一步到底过了没有，你直接说自己是第二步，服务器就信了！** 😱

为了确认改密码真的成功了，你可以点右上角 **Logout** 退出登录，然后用新密码 `admin / hacked123` 登录试试——保证能登录进去，说明真的改成功了！

这也太菜了吧？是不是跟你想的"验证码绕过"完全不一样？你以为要用什么 OCR 图片识别工具、什么打码平台、什么滑块轨迹模拟……结果呢？**改一个数字就完事儿了**！这就是典型的"程序员逻辑漏洞"，接验证码的时候只接了一半，漏了第二步的状态校验。

好，现在我们来"翻一翻 Low 级别的源代码"，看看这个傻柜员到底是怎么写代码的。

---

### 12.2.4 Low 级别 View Source 逐行源码解析 🔬

点击 DVWA 页面右下角的 **View Source** 按钮，我们来逐行看看 Low 级别的 PHP 代码：

```php
<?php

if( isset( $_POST[ 'change' ] ) ) {                    // ★ 第1行：判断用户点了 Change 按钮
    if( $_POST[ 'step' ] == '1' ) {                    // ★ 第2行：如果 step=1（第一步）
        // 第一步的逻辑：校验验证码
        $resp = recaptcha_check_answer (               // ★ 第3行：调用函数校验验证码
            $_DVWA[ 'recaptcha_private_key' ],         //     传私钥
            $_SERVER[ 'REMOTE_ADDR' ],                 //     传客户端IP
            $_POST[ 'recaptcha_challenge_field' ],     //     传验证码 challenge
            $_POST[ 'recaptcha_response_field' ] );    //     传验证码 response

        if( !$resp->is_valid ) {                       // ★ 第4行：如果验证码 不 正确
            // 验证码错误：显示报错，回显到前端
            echo "<pre>That CAPTCHA was incorrect.</pre>";
        }
        else {                                          // ★ 第5行：验证码 正确
            // 显示一个"第一步完成，请确认第二步"的隐藏表单
            // 里面把 step 预设为 2，新密码藏在 hidden input 里
            echo "
            <form action='#' method='POST'>
                <input type='hidden' name='step' value='2'>
                <input type='hidden' name='pass_new' value='" . $_POST['pass_new'] . "'>
                <input type='hidden' name='pass_conf' value='" . $_POST['pass_conf'] . "'>
                <input type='submit' name='change' value='Confirm'>
            </form>
            ";
        }
    }
    elseif( $_POST[ 'step' ] == '2' ) {                // ★ 第6行：else if step=2（第二步）
        // ★★★★★ 漏洞在这儿！★★★★★
        // 到了第二步，服务器 直接改密码！
        // 完全没有检查"你第一步的验证码是不是真的过了"！
        // 只要你 POST 的 step=2 我就信！
        $pass_new  = $_POST[ 'pass_new' ];              // ★ 第7行：取新密码
        $pass_conf = $_POST[ 'pass_conf' ];             // ★ 第8行：取确认密码
        define('SQLITE_DB', '../../hackable/users.db'); // ★ 第9行：SQLite 数据库路径
        $db = new PDO('sqlite:'.SQLITE_DB);             // ★ 第10行：连数据库
        $sql = "UPDATE users SET password = ? WHERE user = 'admin';"; // ★ 第11行：SQL
        $stmt = $db->prepare($sql);                    // ★ 第12行：预编译
        $stmt->bindParam(1, $pass_new);                // ★ 第13行：绑定新密码
        $stmt->execute();                               // ★ 第14行：执行 SQL 改密码！
        echo "<pre>Password Changed.</pre>";            // ★ 第15行：回显成功
    }
}
?>
```

**逐行点评（大白话翻译官上线）：🗣️**

| 代码位置 | 说了个啥？ | 漏洞点评 |
|---|---|---|
| 第 2 行 `step==1` | 判断是不是"第一步"，是就去校验验证码 | 这一步没问题，是对的 |
| 第 3~4 行 `recaptcha_check_answer` | 第一步里真的会调验证码校验函数，错了就报错 | Low 级别**只有这一行**是真正校验验证码的 |
| **第 6 行 `step==2`** | **判断是不是"第二步"** | ⚠️ 注意！判断完是第二步之后，代码就直接往下走去改密码了！**中间没有任何一行判断"你第一步的验证码是不是真的过了"！** |
| 第 11~14 行 SQL UPDATE | **直接改数据库密码** | 这也太相信 POST 的 step 了吧？😱 任何人只要伪造一个 step=2 的请求，验证码连看都不用看 |

**一句话总结 Low 级别的漏洞：跨步骤伪造。程序员把"改密码"和"校验验证码"拆成了两个独立的 step，但第二步完全没核对第一步的状态。**

---

## 12.3 Medium 级别：稍微"装"了一下，但装得不像——验证码可以复用一万次！🟡

好，我们把 DVWA 难度调到 **Medium**，继续玩。

Medium 级别的开发者看到 Low 的代码，心里想："哎呀太菜了！我得改进一下！用户过完验证码之后，我得把状态记下来！"

于是他加了一行：**验证码过了之后，把"已验证"的状态存在 Session 里**。听着是不是感觉靠谱多了？但真的如此吗？😏

### 12.3.1 漏洞在哪里？Session 不销毁，一次通过万次复用！

大白话比喻：Medium 级别的小区保安，检查你的门禁卡。卡是真的，刷卡时间也是今天，保安就让你进了。但是——**这张卡保安永远不会注销**！你今天刷了进去，明天刷还能进，后天刷还能进，刷一万次都好使！保安只检查"你这张卡是不是曾经有过效期"，不检查"是不是用过了"、"有没有过期"。😅

**Low 和 Medium 的区别总结：⬇️**
- Low：根本不查"有没有过第一步"，直接 step=2 就改
- Medium：会查一下 Session 里"验证码曾经通过过标记 = true"，但这个标记**永不失效、永不重置**，一次通过终身可用

---

### 12.3.2 实操步骤一：先"正经过一遍验证码"，拿到 Session 里的通过标记 🟢

Medium 直接改 step=2 已经不好使了（因为 Session 里没有标记），但我们可以"借尸还魂"——先老老实实过一次验证码，拿到那个"终身有效的通过标记"，然后接下来一万次都不用再过验证码了！

**步骤：**
1. DVWA 难度调到 Medium，进入 Insecure CAPTCHA 模块
2. Burp 仍然开着抓包
3. 这次我们先做个乖宝宝：勾上 **I'm not a robot** 复选框 ✅，把密码改成 `medium_test_1`
4. 点击 Change，第一个包 `step=1` Forward 出去，第二个 Confirm 包 `step=2` 也 Forward 出去
5. 浏览器显示 `Password Changed` ✅，完美。

**关键！** 这一步做完之后，服务器上属于你这个 PHPSESSID 的 Session 里，就被种下了一个"验证码已通过=true"的永久标记。现在我们来证明"这个标记永久可以复用"。

---

### 12.3.3 实操步骤二：不勾验证码，改密码试一次！见证"永久有效"的魔力 😈

1. 现在我们还是停留在 Medium 难度的 Insecure CAPTCHA 页面，**这次不要勾那个 I'm not a robot 复选框！** ❌
2. 新密码填个不一样的，比如填 `reused_captcha_999`，确认密码也填一样
3. Burp 打开抓包，点 Change 按钮
4. 抓到包，我们看到还是 `step=1`，`captcha_response=` 是空的（因为我们没勾）
5. **现在，像 Low 一样把 step=1 改成 step=2，然后 Forward！** 🚀

---

### 12.3.4 结果：又改成功了！验证码一次通过万次复用！🎉

回到浏览器，你又看到了那个熟悉的绿色字：
> **Password Changed.** ✅

哇塞！我们**这一次真的没勾验证码**，仅仅靠刚才"上一次过验证码留下来的 Session 标记"，就又成功改了一次密码！而且你可以反复做这个步骤——改 10 次、100 次、10000 次都能成功！Medium 级别把验证码变成了"一次认证，终身免票"的公交年卡 🚌。

这就是 Medium 的漏洞：**验证通过的 Session 状态没有"一次性销毁"，导致同一个会话可以反复跳过验证码执行敏感操作。**

真实世界里这种漏洞多吗？**特别多！** 很多网站的"重置密码短信验证码"、"手机注册短信验证码"，就犯这个错误：你用验证码 1234 成功重置了一次密码之后，同一个 Session 里再提交重置密码，**验证码居然可以重复用**，不用再收新的短信。攻击者只要拿到用户历史的一个验证码，就能反复改密码。

---

### 12.3.5 Medium 级别 View Source 逐行源码解析 🔬

点 View Source 看代码，对比 Low，就多了一个 Session 标记：

```php
<?php
if( isset( $_POST[ 'change' ] ) ) {
    if( $_POST[ 'step' ] == '1' ) {
        $resp = recaptcha_check_answer(
            $_DVWA[ 'recaptcha_private_key' ],
            $_SERVER[ 'REMOTE_ADDR' ],
            $_POST[ 'recaptcha_challenge_field' ],
            $_POST[ 'recaptcha_response_field' ]
        );
        if( !$resp->is_valid ) {
            echo "<pre>That CAPTCHA was incorrect.</pre>";
        }
        else {
            // ★★★ Medium 的"改进"：验证码过了，把通过状态存到 SESSION！★★★
            $_SESSION[ 'captcha_passed' ] = true;    // ← 新增的第1行
            // 然后还是返回 step=2 的确认表单
            echo "<form action='#' method='POST'>
                <input type='hidden' name='step' value='2'>
                <input type='hidden' name='pass_new' value='".$_POST['pass_new']."'>
                <input type='hidden' name='pass_conf' value='".$_POST['pass_conf']."'>
                <input type='submit' name='change' value='Confirm'>
            </form>";
        }
    }
    elseif( $_POST[ 'step' ] == '2' ) {
        // ★★★ Medium 的改进：第二步 先检查一下 SESSION 里 captcha_passed 是不是 true！★★★
        if( !isset( $_SESSION[ 'captcha_passed' ] ) || $_SESSION[ 'captcha_passed' ] !== true ) {
            echo "<pre>You haven't passed the CAPTCHA in step 1!</pre>";
            exit;   // 没过就 exit
        }
        // ★★★★★ 但是！★★★★★
        // 通过检查之后，就直接改密码了！
        // 用完之后根本 没有 unset($_SESSION['captcha_passed'])！
        // 所以 captcha_passed = true 这个标记 永远存在！
        $pass_new  = $_POST[ 'pass_new' ];
        $pass_conf = $_POST[ 'pass_conf' ];
        define('SQLITE_DB', '../../hackable/users.db');
        $db = new PDO('sqlite:'.SQLITE_DB);
        $sql = "UPDATE users SET password = ? WHERE user = 'admin';";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(1, $pass_new);
        $stmt->execute();
        echo "<pre>Password Changed.</pre>";

        // ★★★★★ 最大的漏洞在这儿：少写了 1 行！★★★★★
        // 正确的代码应该在这里加一句：
        //    unset($_SESSION['captcha_passed']);   ← 用完就销毁！一次性！
        // 但是 Medium 没写，所以这个标记永久有效！
    }
}
?>
```

**一句话点评 Medium：思路是对的（第一步过了存状态），但只写了一半（存了没销毁）。就像保安给你盖了个"今日有效"的章，但章其实是"终身有效"的。**

---

## 12.4 High 级别：更会"装模作样"了，但字段名判断太松——自己加个参数就绕过！🔴

OK，把难度调到 **High**。

High 级别的开发者看到 Low 和 Medium，摇摇头说："你们这些菜鸡！我重新设计！**把验证码校验和改密码逻辑合并到同一个 step 里**，不让你们再跨 step 伪造了！我看你们怎么绕！"

听着是不是感觉很厉害？合到同一步了，总没法跳过了吧？嘿嘿，我们一起来找它的缝。🕵️

---

### 12.4.1 漏洞在哪里？isset 判断"有没有这个参数"，而不是"参数对不对"！

大白话比喻：High 级别的保安学聪明了——**进门之前先搜身，看你身上有没有带"已通过验证"的章**。但是保安特别傻——只要你身上**有那么一个叫"章"的东西**，不管这个章是你自己画的、橡皮刻的、画在手背上的，保安都算你"有章"，直接让你进！🤦‍♂️

---

### 12.4.2 High 级别流程变化：Step 没有两步了，只剩一步！先看看请求长啥样

High 级别的 CAPTCHA 模块页面，你会发现 **没有 Confirm 那一步了**，就是一个表单，填好密码 + 勾验证码 + 点 Change，一步到位。正常的 POST 请求抓包长这样：

```http
POST /dvwa/vulnerabilities/captcha/ HTTP/1.1
Host: 127.0.0.1
Cookie: security=high; PHPSESSID=abc123
Content-Type: application/x-www-form-urlencoded

captcha_response=PASSED&              ← 验证码通过的应答字段
pass_current=admin&
pass_new=password_high&
pass_conf=password_high&
change=Change
```

（注意：High 里 step 参数没了，直接一步提交。）

正常情况下：如果你没勾验证码，`captcha_response=` 是空的 → 服务器说你验证码没通过，改密码失败。

**但是！我们 High 级别的漏洞来了！⭐** 服务器判断验证码通过没通过，用的是这句烂代码：

```php
if( isset( $_POST['captcha_response'] ) && $_POST['captcha_response'] == 'PASSED' ) {
```

等等，**我们是攻击者，我们可以在 Burp 里自己加字段啊！** 服务器只看"我 POST 的参数里有没有一个叫 captcha_response 的东西，并且它的值是不是等于字符串 PASSED"——那我自己加一个不就完了？！😱

---

### 12.4.3 实操：不加验证码，Burp 自己插一个 captcha_response=PASSED，成功通关！🎉

**跟着步骤一步步来：⬇️**

1. DVWA 难度 High，进入 Insecure CAPTCHA 模块
2. **不勾验证码！❌** 新密码填 `high_hacked`，确认密码一样
3. Burp 抓包开启，点 Change 按钮
4. 抓到的包，POST Body 里你会看到 `captcha_response=` 是 **空的**：
   ```
   captcha_response=&
   pass_current=admin&
   pass_new=high_hacked&
   pass_conf=high_hacked&
   change=Change
   ```
5. **手动改！把 `captcha_response=` 空值改成 `captcha_response=PASSED`** ✏️
   改完后：
   ```
   captcha_response=PASSED&
   pass_current=admin&
   pass_new=high_hacked&
   pass_conf=high_hacked&
   change=Change
   ```
6. Forward 发包！

---

### 12.4.4 结果：又双叒叕成功了！Password Changed！✅

我的天……又改成功了。High 级别就这？就这水平？😅 我们连验证码的边都没碰，只是在 POST 包里自己加了一个服务器期望的字段值 `PASSED`，服务器就傻呵呵地信了！

这个漏洞在真实世界叫 **"客户端信任"漏洞**——服务器把"验证码校验通过与否"的判断结果，**完全交给客户端 POST 的参数来决定**，而不是自己去 Google reCAPTCHA 服务器校验 response_token 是不是真的。这就相当于：**考试老师不自己判卷，而是让学生自己在卷子上写个"100分"，老师看到 100 分就给打 100 分**。🤣

---

### 12.4.5 High 级别 View Source 逐行源码解析 🔬

来，View Source 看 High 怎么写的：

```php
<?php
if( isset( $_POST[ 'change' ] ) ) {
    $resp = recaptcha_check_answer( /* ... 和前面一样的校验函数 ... */ );

    if( $resp->is_valid ) {
        // ★ 验证码真的通过了，POST 里加上 captcha_response=PASSED
        // （这一步其实是 DVWA 的模拟逻辑，真实 reCAPTCHA 不是这样干的）
        $_POST['captcha_response'] = 'PASSED';
    }
    else {
        $_POST['captcha_response'] = '';  // 没通过就置空
    }

    // ★★★★★ High 级别的 大 漏 洞 在 这 里 ★★★★★
    if( $_POST[ 'captcha_response' ] == 'PASSED' ) {
        // 只要 POST 里 captcha_response 等于 PASSED，就直接改密码！
        // 服务器根本没区分：这个 PASSED 是"验证码校验函数写进去的"，还是"攻击者自己在 POST 里加的"！
        $pass_new  = $_POST[ 'pass_new' ];
        $pass_conf = $_POST[ 'pass_conf' ];
        define('SQLITE_DB', '../../hackable/users.db');
        $db = new PDO('sqlite:'.SQLITE_DB);
        $sql = "UPDATE users SET password = ? WHERE user = 'admin';";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(1, $pass_new);
        $stmt->execute();
        echo "<pre>Password Changed.</pre>";
    }
    else {
        echo "<pre>CAPTCHA failed. Please try again.</pre>";
    }
}
?>
```

**一句话点评 High：逻辑写反了！** 应该是"先验证码过了 → 存一个服务器端的一次性 token → 改密码时核对 token"，而不是"校验函数往 POST 里写个 PASSED → 然后看 POST 里有没有 PASSED"——攻击者自己往 POST 里加个 PASSED 就绕过了！正确的写法应该用 **Session 存通过状态**，并且用完立刻销毁。

---

## 12.5 Impossible 级别：向"真正的保安"学习正确姿势！⚪

好，最后我们来看 Impossible 级别，这才是"标准答案"。虽然我们打不穿它，但我们一定要看懂它**为什么打不穿**，因为以后你写代码接验证码的时候，就要这么写！

点 View Source，我们挑关键的改动点看：

```php
<?php
// ★ Impossible 改动 1：Check Anti-CSRF token！
// 先检查 Anti-CSRF token，防止 CSRF 打这个接口
checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

if( isset( $_POST[ 'change' ] ) ) {
    // ★ Impossible 改动 2：服务器自己维护一个 CAPTCHA_TOKEN，一次性！
    // 而不是信客户端 POST 过来的 captcha_response
    if( !isset($_SESSION['captcha_token']) || empty($_SESSION['captcha_token']) ) {
        echo "<pre>Please complete CAPTCHA first.</pre>";
        exit;
    }

    // ★ Impossible 改动 3：真的校验 CAPTCHA_TOKEN 是不是和服务器存的 完全一致！
    if( !hash_equals($_SESSION['captcha_token'], $_POST['captcha_token']) ) {
        echo "<pre>Invalid CAPTCHA token.</pre>";
        exit;
    }

    // ★ Impossible 改动 4：真的调用 recaptcha_check_answer 去 Google 服务器验 response！
    // 并且对 challenge 和 response 都做了严格的 isset+非空校验
    $resp = recaptcha_check_answer(
        $_DVWA['recaptcha_private_key'],
        $_SERVER['REMOTE_ADDR'],
        $_POST['recaptcha_challenge_field'],
        $_POST['recaptcha_response_field']
    );
    if( !$resp->is_valid || $resp->error == 'invalid-or-already-seen-response-token' ) {
        // response_token 一次性！用过一次就失效，Google 服务器会告诉你重复了
        echo "<pre>CAPTCHA validation failed.</pre>";
        exit;
    }

    // ★ Impossible 改动 5：严格校验两次密码一致 + 密码强度
    if( $_POST['pass_new'] !== $_POST['pass_conf'] || strlen($_POST['pass_new']) < 8 ) {
        echo "<pre>Passwords don't match or too short.</pre>";
        exit;
    }

    // ★ Impossible 改动 6：密码哈希存储！（Low~High 都是明文存的，这也是大坑）
    $hashed_password = password_hash( $_POST['pass_new'], PASSWORD_BCRYPT );
    $sql  = "UPDATE users SET password = ? WHERE user = ?;";  // 用预编译 + 用户变量
    $stmt = $db->prepare( $sql );
    $stmt->bindParam( 1, $hashed_password );
    $stmt->bindParam( 2, $_SESSION['username'] );   // 改谁的密码？从 Session 取！不是写死 admin！
    $stmt->execute();

    // ★★★ Impossible 改动 7（最关键！）：用完 CAPTCHA_TOKEN，立刻 unset 销毁！一次性！★★★
    unset( $_SESSION['captcha_token'] );

    echo "<pre>Password Changed Successfully!</pre>";
}
// 页面加载前，服务器自己生成一个 随机 CAPTCHA_TOKEN，存在 Session，下发到前端 hidden input
generateSessionToken();
?>
```

---

### 12.5.1 Impossible 的 7 个安全要点总结（以后你接验证码必须照着做！）📋

| 要点 | 作用 | 修复的是 Low~High 哪个级别的漏洞？ |
|---|---|---|
| ① Anti-CSRF Token | 防 CSRF 伪造请求打改密码接口 | 额外加固 |
| ② 服务器端存 CAPTCHA_TOKEN | **不信客户端 POST 的 PASSED/step**，服务器自己说了算 | 修复 High 的客户端信任漏洞 |
| ③ CAPTCHA_TOKEN hash_equals 全等对比 | 防时序攻击猜测 token | 额外加固 |
| ④ 真调 recaptcha_check_answer 去 Google 验 | 真的去官方验 response_token，不是自己模拟 | 修复 High 自己加参数就绕过的漏洞 |
| ⑤ 密码强度 + 一致性校验 | 不能弱密码、两次必须一致 | 额外加固 |
| ⑥ password_hash 哈希存密码 + 从 Session 取用户名 | 不明文存，不写死改 admin 的密码（Low~High 全是写死改 admin） | 修复 4 个级别共有的 SQL 写死问题 |
| **⑦ 用完 unset 销毁 CAPTCHA_TOKEN** | **一次性！用过就废，防止复用** | 修复 Medium 的 Session 永久有效漏洞 |

一句话：Impossible 之所以打不穿，是因为它把"验证码校验"这件事，**从客户端拿结果 → 改成了服务器端自己存状态 + 真校验 + 一次性销毁**，每一步都把漏洞堵上了。

---

## 12.6 真实世界的验证码绕过思路总结（攻防地图）🗺️

学完 DVWA 的四个级别，你应该已经对"验证码到底怎么会不安全"有概念了。我们再给大家总结一下，真实渗透测试中，遇到验证码你可以按这个"从易到难"的顺序试：

```
第一层：逻辑层绕过（成本最低，优先试！）← 今天 DVWA 讲的全是这类
├─ ❏ 抓包改 step：直接跳过验证码步骤（Low）
├─ ❏ Session 验证码复用：一次通过反复用（Medium）
├─ ❏ 自己加参数字段（captcha_response=PASSED）（High）
├─ ❏ 验证码校验只做了前端，后端根本没接（最常见！）
└─ ❏ 抓包看 response：有的网站把"验证码答案"直接放在 HTTP 响应里了…

第二层：识别层绕过（需要工具，成本中等）
├─ ❏ 简单图片文字验证码 → 用 Python + tesseract OCR 识别（正确率 80%+）
├─ ❏ 4 位纯数字字母 → Burp Intruder + 打码平台（超级鹰、斐斐打码，几分钱一次）
├─ ❏ 数学计算验证码（2+3=?）→ 正则取表达式 eval 计算就行
└─ ❏ 极验滑块早期版本 → 开源的 geetest_crack 轨迹模拟脚本

第三层：行为层绕过（成本最高，实在没招了再试）
├─ ❏ Selenium / Playwright 真人自动化 + 手动输入一次验证码后复用 Cookie
├─ ❏ 真实手机群控 + 真人手动辅助过验证
└─ ❏ v3 无感知 reCAPTCHA → 模拟真实用户行为（鼠标轨迹、停留时间、滚动事件）提高分数
```

---

## 12.7 本章总结 🎉

恭喜你！又攻克了 DVWA 的一个全新模块！今天学的 Insecure CAPTCHA 虽然是个"小模块"，但逻辑漏洞的思路非常经典，也是面试高频题。我们再来复盘一下核心知识点：

### 📋 本章核心考点速记卡

| 级别 | 漏洞类型 | 一句话绕过姿势 | 根本原因 |
|---|---|---|---|
| **Low** | 跨步骤逻辑漏洞 | step=1 改成 step=2 直接跳过 | 第二步没核对第一步验证码状态 |
| **Medium** | Session 状态未销毁 | 先正经过一次验证码，以后反复用 step=2 | captcha_passed 存 Session 但永不 unset |
| **High** | 客户端信任漏洞 | 自己 POST 里加 captcha_response=PASSED | 服务器信了客户端的字段值，没存服务器端状态 |
| **Impossible** | ✅ 安全方案 | 打不穿 | 服务器端一次性 CAPTCHA_TOKEN + 真校验 + 用完销毁 + 密码哈希 |

### 💡 给零基础新手的三句大白话心得
1. **验证码不是"加了就万事大吉"——接错了还不如不加！** 99% 的验证码事故都是程序员集成时的逻辑漏洞，不是验证码本身的问题。
2. **遇到登录/改密码/发短信等敏感操作，先抓包改 step、加字段试试**，你会发现很多网站的验证码真的就是个摆设。
3. **以后自己写代码接验证码时：服务器端存一次性 token、用完立刻 unset、真的去官方接口校验、别信客户端 POST 的任何通过标记！** 照着 Impossible 的 7 个要点做就对了。

---

## 12.8 下章预告 📢

下一章（Day 13）我们要学的是 **Weak Session IDs 弱会话 ID**！

你还记得我们在 Day 7 学 CSRF 的时候，讲过"Session ID 就是用户在网站上的临时身份证号"吗？如果这个身份证号不是随机生成的，而是 `1, 2, 3, 4...` 这样递增的，或者是时间戳呢？攻击者是不是只要"猜"就能拿到别人的 Session ID，然后直接冒充别人登录？

**会话劫持（Session Hijacking）** 这个经典攻击手法，正是很多网站"用户明明没泄露密码，却莫名其妙被盗号"的罪魁祸首！更刺激的是，我们还要用 **Burp Suite** 亲手抓包、观察 DVWA 生成的 dvwaSession 值变化规律、算步长、替换 Cookie，一步步亲手完成一次"冒充别人登录"的劫持操作！

坐稳了，下一章更精彩！我们 Day 13 见！👋
