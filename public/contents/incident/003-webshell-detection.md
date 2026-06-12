# WebShell 排查、清除与防护实战

---

## 📋 目录

1. [WebShell 识别](#一webshell识别)
2. [手工排查](#二手工排查)
3. [工具扫描](#三工具扫描)
4. [日志溯源](#四日志溯源)
5. [清除与加固](#五清除加固)

---

## 一、WebShell 识别

```
常见 WebShell 家族:

PHP:
  ✦ 一句话木马: <?php @eval($_POST['cmd']);?>
  ✦ 冰蝎(Behinder): 动态密钥协商,加密流量
  ✦ 哥斯拉(Godzilla): 加密payload,过WAF
  ✦ 大马: 完整的Web管理界面(文件管理/数据库/命令)

JSP:
  ✦ 冰蝎/哥斯拉JSP版
  ✦ 自定义Filter/Listener型(内存马)

ASP/ASPX:
  ✦ 一句话: <%eval request("cmd")%>

WebShell 特征:
  ✦ 文件时间异常(最近创建/修改)
  ✦ 文件在非正常目录(图片目录下的.php)
  ✦ 文件名异常(随机名/模仿系统文件)
  ✦ 文件权限异常(可执行权限)
```

---

## 二、手工排查

```bash
# === 1. 时间排查 ===
# 最近24h创建/修改的脚本文件
find /var/www/ -name "*.php" -mtime -1 -ls
find /var/www/ -name "*.jsp" -mtime -1 -ls
find /var/www/ -name "*.asp*" -mtime -1 -ls

# === 2. 关键字搜索 ===
# eval / assert
grep -rn "eval(" /var/www/ --include="*.php" | grep -v vendor
grep -rn "assert(" /var/www/ --include="*.php"

# base64_decode (编码混淆)
grep -rn "base64_decode" /var/www/ --include="*.php"

# 命令执行
grep -rn "system(" /var/www/ --include="*.php"
grep -rn "exec(" /var/www/ --include="*.php"
grep -rn "shell_exec" /var/www/ --include="*.php"
grep -rn "passthru" /var/www/ --include="*.php"
grep -rn "popen(" /var/www/ --include="*.php"

# POST 接收
grep -rn '\$_POST\[' /var/www/ --include="*.php"
grep -rn '\$_GET\[' /var/www/ --include="*.php" | grep "eval\|system"

# 文件操作(可能含木马)
grep -rn "fopen(" /var/www/ --include="*.php"
grep -rn "file_put_contents" /var/www/ --include="*.php"

# 冰蝎/哥斯拉特征
grep -rn "AES\|RC4" /var/www/ --include="*.php" | grep "base64"
grep -rn "openssl_decrypt" /var/www/ --include="*.php"

# === 3. 异常文件位置 ===
# PHP文件出现在非代码目录
find /var/www/uploads/ -name "*.php"
find /var/www/images/ -name "*.php"
find /var/www/static/ -name "*.php"

# === 4. 文件内容分析 ===
# 文件内容行数极少 → 可能是一句话木马
find /var/www/ -name "*.php" -exec wc -l {} \; | awk '$1<3{print}' | head
```

---

## 三、工具扫描

```bash
# === D盾 (Windows) — ★最强PHP Webshell查杀 ===
# https://www.d99net.net/

# === 河马Webshell扫描器 ===
# https://www.shellpub.com/
wget https://dl.shellpub.com/hm-linux-amd64.tgz
tar xzf hm-linux-amd64.tgz && ./hm scan /var/www/

# === ScanWebShell (开源) ===
pip install scanwebshell
scanwebshell /var/www/

# === YARA 规则 ===
# 使用公开的WebShell YARA规则库
git clone https://github.com/tennc/webshell
yara -r webshell_rules.yar /var/www/

# === ClamAV ===
clamscan -r /var/www/
```

---

## 四、日志溯源

```bash
# === Nginx/Apache 访问日志 ===
# 查找可疑的POST请求
grep "POST" /var/log/nginx/access.log | awk '$9==200' | head -20

# 查找异常UA
grep -v "Mozilla\|Chrome\|Firefox\|Safari" /var/log/nginx/access.log | head

# 查找安全工具特征(蚁剑/冰蝎)
grep -iE "antsword|behinder|godzilla" /var/log/nginx/access.log

# 查找疑似WebShell访问
grep -E "eval|assert|base64" /var/log/nginx/access.log | head

# === 分析请求频率 ===
# 同一IP的POST请求数量(找上传/注入点)
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head

# === 时间分析 ===
# 攻击发生时间窗口
grep "15/Jun/2026" /var/log/nginx/access.log | grep "POST"
```

---

## 五、清除与加固

```bash
# === Step 1: 隔离 ===
# 将Web目录设为只读(防止新WebShell写入)
chattr +i /var/www/html/index.php  # 对核心文件

# === Step 2: 删除WebShell ===
# 确认后删除恶意文件
rm /var/www/html/uploads/shell.php
rm /var/www/html/images/logo.php

# === Step 3: 检查并修复文件权限 ===
find /var/www/ -type f -name "*.php" -exec chmod 644 {} \;
find /var/www/ -type d -exec chmod 755 {} \;

# === Step 4: 禁止上传目录执行 PHP ===
# Nginx:
# location /uploads/ {
#     location ~ \.php$ { deny all; return 403; }
# }

# === Step 5: 检查是否有后门账户 ===
# 数据库中查找新增管理员
# MySQL: SELECT * FROM users WHERE role='admin' ORDER BY created_at DESC LIMIT 5;

# === Step 6: 恢复被篡改的页面 ===
# 从备份中恢复 index.php 等被修改的文件
```

---

## ✅ WebShell排查清单

- [ ] 时间排查(最近修改的文件)
- [ ] 关键字搜索(eval/assert/base64)
- [ ] 异常位置(图片/上传目录的php)
- [ ] D盾/河马扫描
- [ ] 日志溯源(找入侵入口)
- [ ] 删除WebShell
- [ ] 修复文件权限
- [ ] 禁止上传目录执行脚本
- [ ] 检查数据库后门账户
