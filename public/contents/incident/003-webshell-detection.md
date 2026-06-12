# WebShell 排查、清除与防护实战

---

## 一、什么是 WebShell

**WebShell** 是一段运行在 Web 服务器上的脚本 (PHP/JSP/ASPX/ASP/Python), 让攻击者可以远程控制服务器 (执行命令、读写文件、操作数据库、横向内网、做反向代理等)。

```
  攻击者 ─────► [Web 应用 (如上传点/注入)] ─────► 写入 shell.php / shell.jsp
                 │
                 ▼
            服务器端执行:
              system($_GET['cmd'])
              eval($_POST['code'])
              file_put_contents($_GET['path'], file_get_contents($_GET['url']))
```

## 二、WebShell 常见家族与特征

| 语言 | 代表脚本 | 典型一句话木马 |
|------|---------|--------------|
| **PHP** | b374k, WSO, WebAdmin, 大马 (如 99shell), 小马 (一句话) | `<?php eval($_POST['x']); ?>` / `<?php system($_GET['c']); ?>` / `<?php assert($_POST['x']); ?>` |
| **JSP/JSPX** | JspSpy, AntSword JSP 版, Godzilla JSP 版 | `Runtime.getRuntime().exec(request.getParameter("c"))` |
| **ASPX (C#)** | aspxspy, Reverse.aspx | `System.Diagnostics.Process.Start("cmd","/c "+Request["c"])` |
| **Classic ASP** | 老 IIS 站点 (VBScript) | `<% eval request("c") %>` / `<% Server.CreateObject("WScript.Shell").Exec(...) %>` |
| **Python** | Tornado/Flask/FastAPI 自定义 shell | `import os; os.system(request.args.get('c'))` |
| **Node.js** | Express 自定义路由 | `require('child_process').exec(req.query.c, ...)` |
| **Perl/CGI** | 老站 | `exec('id')` / `open(CMD,'-|',$cmd)` |
| **无文件 WebShell** | 写入内存 / 修改 .so / 修改 opcache / 插桩 fastcgi | 不落文件, 内存级 Webshell |

## 三、发现 WebShell 的常用方法

### 3.1 文件系统扫描

```bash
# 1) 关键词扫描 (grep + 常见敏感函数)
#    PHP
grep -rlnE "(eval|assert|system|exec|shell_exec|passthru|preg_replace\s*\(\s*['\"]?/.*/e|preg_replace_callback|\`|\\\$_(GET|POST|REQUEST|COOKIE)\s*\[|include\s*\(\s*\\\$_|allow_url_include|assert\s*\(\s*\\\$)" /var/www/ 2>/dev/null | head -50

#    JSP
grep -rlnE "(Runtime.getRuntime|ProcessBuilder|FileWriter|request\.getParameter\(.+\)|new File\(|jsp:include)" /var/lib/tomcat*/webapps/ 2>/dev/null

#    ASPX
grep -rlnE "(Process\.Start|System\.Diagnostics|File\.WriteAllText|Request\[|Request\.Form|Request\.QueryString)" /var/www/ 2>/dev/null

#    Node.js
grep -rlnE "(child_process|execFile|spawn|eval|new Function|vm\.runInContext)" /app/ 2>/dev/null

# 2) 扫描一句话特征: `eval($_POST` / `assert($_POST` / `system($_GET` / `cmd.php?cmd=`
#    快速定位新创建 / 修改的脚本:
find /var/www /usr/share/nginx/html -type f \( -name "*.php" -o -name "*.jsp" -o -name "*.aspx" -o -name "*.asp" \) \
    -mtime -14 -newer /etc/passwd 2>/dev/null | head -50

# 3) 最近修改的 .php / .jsp / .aspx / .ini / .conf (按天)
find /var/www -type f -newer /etc/passwd -mtime -30 2>/dev/null | head -80

# 4) 可疑文件名: shell, cmd, exec, backdoor, hack, login2, adm, config-backup
find /var/www -iname "*shell*" -o -iname "*cmd*" -o -iname "*backdoor*" -o -iname "*hack*" 2>/dev/null

# 5) 图片壳 (GIF89a + 图片后缀但实际是脚本)
file /var/www/html/upload/*.jpg /var/www/html/upload/*.png
# 若某 .jpg 被识别为 "PHP script", 即图片壳

# 6) 隐藏文件
ls -la /var/www/
find /var/www -name ".*" -type f 2>/dev/null | head -30  # .shell.php / .htaccess 注入后门

# 7) .htaccess 修改 (Apache 常见)
cat /var/www/html/.htaccess
# 关注: AddType application/x-httpd-php .jpg .png (图片当 PHP 执行)
# 关注: php_value auto_prepend_file /usr/local/lib/php.ini.php (每个请求执行某脚本)
# 关注: php_admin_flag engine on （在禁止执行的目录开启）

# 8) PHP include_path / auto_prepend_file / auto_append_file
php -i | grep -iE "auto_prepend|include_path|disable_functions|open_basedir"
# 关注: auto_prepend_file 指向某个可疑脚本 (内存 shell / 每次请求注入代码)
```

### 3.2 访问日志扫描

```bash
# 1) 扫描 POST 到可疑脚本的请求 (WebShell 主要通过 POST 传递参数)
grep -E '"POST [^ ]+\.(php|jsp|aspx|asmx)(\?| )' /var/log/nginx/access.log /var/log/httpd/access_log 2>/dev/null | tail -50

# 2) 直接 POST 的文件 (正常业务 POST 路径一般固定; 扫描随机名的 POST = 可疑)
awk '$6 == "\"POST" {print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -30

# 3) 扫描 WebShell 常用参数名: cmd=, exec=, shell=, command=, system=, eval=
grep -E "(cmd=|exec=|shell=|command=|pass=|pwd=|action=|phpinfo)" /var/log/nginx/access.log | tail -50

# 4) WebShell 常见 UA:
#    "curl/", "python-requests/", "sqlmap/", "masscan", "Go-http-client", "Jakarta Commons-HttpClient"
#    以及中国菜刀 (Chora knife) / 冰蝎 (Behinder) / 哥斯拉 (Godzilla) 的特定 UA
grep -iE "(chora|knife|behinder|godzilla|antSword|weevely|c99shell|r57|wso)" /var/log/nginx/access.log | head -20

# 5) 响应码 200 但文件大小异常 (如 shell.php 返回几 KB)
awk '$9 == 200 {print $10, $7}' /var/log/nginx/access.log | sort -rn | head -30

# 6) 上传接口 POST + 200
grep -E "(upload|uploadify|fileupload|import|attachment)" /var/log/nginx/access.log | tail -50

# 7) 攻击者访问 phpinfo / 敏感文件
grep -E "(phpinfo|/etc/passwd|/proc/self/environ|php://input|data://text/plain)" /var/log/nginx/access.log
```

### 3.3 进程与网络异常

```bash
# 1) Web 进程 (www-data / apache / nobody) 启动了不该启动的进程
#    典型: bash / sh / curl / wget / python / nc 等
ps -ef | grep -E "www-data|apache|nobody|nginx|tomcat" | grep -vE "grep|nginx:|httpd"

# 2) 反向 Shell 特征: nginx → sh → bash → python -c "socket..."
#    查看子进程树
pstree -p | grep -B2 -A2 "sh|bash" | head -40

# 3) Web 进程建立的外连
ss -antp | grep -E "(www-data|apache|nginx|tomcat)" | grep ESTAB

# 4) Web 进程监听的奇怪端口 (反向代理 / socks)
ss -antlp | grep -E "python|perl|nc|socat"
```

### 3.4 使用开源扫描工具

```bash
# 1) WebShell 专用扫描工具
#    - Shell-Detector  (https://github.com/emposha/PHP-Shell-Detector)
#    - Webshell-Sniper
#    - NeoPI (https://github.com/Neohapsis/NeoPI)
#    - PHP Malware Finder (PMF, php-malware-finder)
#    - Linux Webshell Scanner (LWS)

# 2) PMF (php-malware-finder)
php-malware-finder.phar /var/www/

# 3) 基于 YARA 规则
yara -r webshells.yar /var/www/

# 4) WAF / SIEM 规则
#    匹配: POST <anyfile>.php / 响应体含 "Current Dir:" / "Drives:" / "phpinfo()"
```

### 3.5 常见一句话变形 (绕过简单 grep)

```php
// 1) 简单变形
<?php $_UQ = str_rot13('nffreg'); $_UQ($_POST['x']); ?>   // assert
<?php $a = 'sys'.'tem'; $a($_GET['c']); ?>                  // system

// 2) 混淆 + base64
<?php $f = base64_decode(\"YXNzZXJ0\"); $f(base64_decode($_POST['x'])); ?>
// 3) 回调函数 (array_map / array_walk / filter_var / preg_replace / uasort)
<?php array_map("assert", (array)$_POST['x']); ?>
<?php preg_replace('/.*/e', $_POST['x'], ''); ?>            // PHP < 5.5 的 /e 修饰符

// 4) 变量函数
<?php ${'_PO'.'ST'}['x'](...); ?>                            // 构造 $_POST

// 5) 十六进制 / 字符码点
<?php $f = "\x61\x73\x73\x65\x72\x74"; $f($_POST['x']); ?>   // assert

// 6) 图片壳 (GIF89a 头部 + 真实 PHP)
//    文件头是 GIF89a, 中间有 <?php ...?>; 配合 AddType 可被解析

// 7) .htaccess + php_value auto_prepend_file (在每个 PHP 文件前注入)
#    .htaccess 写入:
#    php_value auto_prepend_file "/tmp/.htaccess_shell"

// 8) 无文件 shell (通过 opcache / APC / session)
```

## 四、典型 WebShell 家族特征速查

| 家族 | 特征 / 关键词 | 识别方式 |
|------|-------------|---------|
| **中国菜刀 (Cknife / Chora Knife)** | POST 到某文件, Content-Type: application/x-www-form-urlencoded; 参数 `z1 / z2` 等 | 抓包看 POST body 含 `eval/assert/system` |
| **冰蝎 (Behinder)** | AES 加密的 POST body, 请求体看起来是 base64 / 二进制; 响应体亦加密 | 流量特征明显 (大 POST + 对称加密响应), YARA 规则可捕获 |
| **哥斯拉 (Godzilla)** | AES + base64; 内存级 (可落地 / 不落地); 支持 Java Tomcat 注入 | 二进制 / 内存 shell, 需动态分析 (Agentless EDR) |
| **B374K / WSO (Web Shell by Orb)** | 经典 PHP 大马, 含 File Manager / MySQL Manager / Command / 端口扫描 | grep "b374k" / "WSO v3.2" / 页面响应有版权字符串 |
| **p0wny-shell** | 单文件 PHP, 大量 HTML 样式 + 终端交互 | grep "p0wny" / grep "function executeCommand" |
| **PHP File Manager** | 界面有 "File Manager" 字样, 含目录浏览 + 上传 | grep "File Manager" `php` 文件 |
| **JSP Reverse Shell** | `Runtime.getRuntime().exec()` + 回显 / `java.net.Socket` 反弹 | grep `getRuntime` + grep `.jsp` |
| **内存级 Webshell (Valves / Filter 注入)** | 不落地文件, 仅在 Tomcat/Resin/Jetty 内存注入 Filter/Valve | 需 `jmap -histo <pid>`, 查看可疑 Class, 或使用 arthas |

## 五、清除与恢复

```
Step 1. 隔离 (立即):
  - 将被入侵主机从负载均衡下线下线 (防止继续对外服务)
  - 断网 / 或防火墙阻断该主机对外流量 (保留取证)
  - 暂停该主机上相关 Web 服务

Step 2. 保留证据 (不要立刻 rm -rf):
  - cp 可疑文件到隔离目录, 保留 hash
  - tar czf /evidence/webshell_evidence.tgz <可疑目录> --remove-files=false
  - 计算 hash (sha256) 并上传到 VT

Step 3. 源码审计 (找所有 Webshell):
  - 用 grep / PMF / YARA 全量扫描 Web 目录 (不仅可疑目录)
  - 用 Git diff 比对与 Git 仓库差异 (Git 跟踪的项目最容易: git status / git diff)
  - 关注: upload/attachment/tmp/backup/cache/storage 目录
  - 关注: 图片目录 (.jpg/.png 实为脚本)
  - 关注: 解压包 / CMS 插件目录 (WordPress plugins, Discuz plugin, 织梦 include)
  - 关注: .htaccess / .user.ini / php.ini (被攻击者修改的地方)

Step 4. 清除:
  - 删除所有 Webshell 文件
  - 还原被篡改的配置文件 (.htaccess / nginx.conf / php.ini / .user.ini)
  - 清除数据库后门 (数据库里是否被写入 shell / 管理员账号)
  - 清除可疑 cron / 计划任务 (Linux: crontab; Windows: schtasks)
  - 检查 nginx rewrite 是否有隐藏 URL 指向后门

Step 5. 定位入口:
  - 搜索 access.log 中首次访问可疑 shell 的时间戳 (回推攻击者何时上传)
  - 反向 grep: 在那段时间前后的上传接口 POST 记录 (定位上传点)
  - 判断漏洞: 文件上传 / 文件包含 / 远程文件包含 (RFI) / SQL 读写 / CMS 已知漏洞
  - 修复漏洞: 补丁 / 代码修复 / 权限重配

Step 6. 凭据重置:
  - 数据库账号密码
  - CMS 后台账号密码
  - SSH 密钥 (如 ~/.ssh/authorized_keys 被追加)
  - Redis / Memcached / ES 凭据 (内网横向)
  - API Key / AccessKey (若被读取)

Step 7. 加固上线 (参见第七节)
```

## 六、实战命令模板

```bash
# 1. 扫描所有 PHP/JSP/ASPX 中的敏感函数 (快速筛选)
grep -rlnE "(eval|assert|system|exec|shell_exec|passthru|preg_replace|preg_replace_callback|include\s*\(\s*\\\$_|file_put_contents\s*\(\s*\\\$_(GET|POST|REQUEST|COOKIE)|file_get_contents\s*\(\s*\\\$_)" /var/www/ 2>/dev/null

# 2. 最近 7 天新增/修改的脚本
find /var/www -type f \( -name "*.php" -o -name "*.jsp" -o -name "*.aspx" \) -mtime -7 2>/dev/null | head -50

# 3. 图片目录里的脚本
file /var/www/html/upload/*.jpg /var/www/html/upload/*.png /var/www/html/upload/*.gif 2>/dev/null | grep -vE "image|JPEG|PNG|GIF"

# 4. 被篡改的 .htaccess
cat /var/www/html/.htaccess | grep -iE "auto_prepend|AddType|php_value|engine"

# 5. 搜索 POST 到 shell 的日志 (按访问量降序)
awk '$6 == "\"POST" {print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -20

# 6. 用 YARA 规则扫描
#    下载: https://github.com/Yara-Rules/rules/tree/master/WebShells
yara -r /path/to/webshells.yar /var/www/

# 7. 查看 Web 进程启动的子进程 (反向 shell 线索)
pstree -p $(pgrep -f "nginx: worker" | head -1)
pstree -p $(pgrep -f "httpd" | head -1)

# 8. 检查系统 /tmp /dev/shm (WebShell 常把工具放这些目录)
ls -lat /tmp/ /dev/shm/
find /tmp /dev/shm -type f -executable 2>/dev/null
```

## 七、预防与加固 (防护清单)

```
Web 层:
  1. 应用代码做严格的上传校验:
     - 仅允许白名单扩展名 (jpg/png/gif/pdf/docx/xlsx)
     - 不接受任何可执行后缀 (php/jsp/aspx/asp/js/exe/sh/py/pl)
     - 校验 MIME + 文件头 (exif_imagetype / getimagesize)
     - 重命名上传文件 (GUID), 不保留原文件名
     - 上传目录禁止脚本执行权限 (Nginx: location ~* \.php$ {deny all;})
     - 上传目录移出 DocumentRoot, 用独立域名 / CDN 访问
     - open_basedir 限制 PHP 可操作目录
     - disable_functions 禁用 eval, assert, system, exec, shell_exec, passthru, popen, proc_open, dl

  2. 防范文件包含:
     - PHP: allow_url_include = Off, allow_url_fopen = Off (如业务允许)
     - 被 include 的路径必须白名单, 不能由用户输入决定

  3. 前端 / WAF:
     - 部署 WAF (云 WAF / ModSecurity + OWASP CoreRuleSet)
     - 拦截含 eval/assert/system 关键字的 POST body
     - 拦截访问 shell 文件 (403)
     - 频率限制 (同 IP 1 分钟 > 10 次 POST 自动封禁)

系统层:
  4. Web 进程权限最小化 (www-data, apache, nginx 用户不可写 webroot)
  5. Web 目录权限: 目录 755, 文件 644, 上传目录 755 (www-data 仅在 upload 目录可写)
  6. 文件完整性监控 (AIDE / OSSEC / Wazuh), 文件变更告警
  7. 启用 PHP-FPM chroot / open_basedir / disabled_functions
  8. Rumpelstiltskin / inotifywait 监控 webroot 文件创建
  9. 定期 (每周) 跑 php-malware-finder / YARA
 10. 系统级 HIDS (OSSEC / Wazuh / Suricata) + 集中 SIEM

研发流程:
 11. 代码扫描 (Semgrep + 自定义规则 + CodeQL)
 12. 代码 Review 必须覆盖上传/下载/文件操作接口
 13. 上线前跑 DAST (Burp/OWASP ZAP)

蓝队监控:
 14. 对 "新建 .php 文件" 的行为做告警 (syscall level: inotifywait)
 15. 对 "POST 到非标准路径" 的行为做告警 (WAF + SIEM)
 16. 对 "Web 进程执行 exec/bash/cmd" 做告警 (RASP / EDR)
 17. 对 "Web 进程建立外连" 做告警 (东西向流量 + 外部流量)
 18. 对 "上传目录出现可执行脚本" 做告警 (inotifywait)
 19. 对 "数据库被写入可疑 URL / 脚本" 做告警 (数据库审计插件)

定期演练:
 20. 每半年一次: 红队在测试环境投放 WebShell, 考验蓝队识别速度
```

## 八、CheckList

- [ ] 全量扫描 Web 根目录 (grep 关键字 + php-malware-finder + YARA)
- [ ] 比对 Git/版本控制系统 diff, 确认非授权变更
- [ ] 检查图片/上传目录是否包含可执行脚本 (file 命令识别)
- [ ] 检查 .htaccess / .user.ini / nginx.conf / php.ini 是否被篡改
- [ ] 检查 Web 进程子进程 (反向 shell 线索)
- [ ] 检查访问日志, 定位 WebShell 首次上传时间 + 入口点
- [ ] 清除所有 Webshell 与后门
- [ ] 修复漏洞 / 升级版本 / 重写上传校验逻辑
- [ ] 重置所有相关凭据 (数据库 / SSH / API Key)
- [ ] 增加 WAF 规则 + HIDS 监控 + 文件完整性监控
- [ ] 增加频率限制 / 人机验证 到上传接口
- [ ] 每季度扫描 + 演练一次
