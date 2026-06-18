# Day 8：Burp Suite Proxy——抓包拦截基础

> **学习目标**：深入掌握Burp Suite Proxy模块，学会抓包、改包、放包
>
> **学习时长**：2-3小时
>
> **难度等级**：⭐⭐

---

## 📚 今日内容概览

1. Burp Suite简介与安装
2. Proxy模块界面详解
3. Intercept拦截功能
4. HTTP History历史记录
5. Options配置选项
6. 实战练习：抓包改包
7. 常见问题解决
8. 今日总结

---

## 一、Burp Suite简介与安装

### 1.1 什么是Burp Suite

```
Burp Suite是什么：
  Web安全测试工具
  用于抓包、改包、漏洞测试
  安全工程师必备工具

主要功能：
  1. Proxy（代理）
     拦截和修改HTTP请求
  
  2. Repeater（重放器）
     重新发送修改后的请求
  
  3. Intruder（入侵者）
     自动化攻击和爆破
  
  4. Decoder（解码器）
     编码和解码数据
  
  5. Comparer（比较器）
     比较两个请求或响应的差异

生活比喻：
  Burp Suite就像网络世界的"监控摄像头"
  可以看到所有的"对话"
  还可以"插话"修改内容
```

### 1.2 安装配置

```
安装Burp Suite：

1. 下载：
   - 官网：https://portswigger.net/burp
   - 有免费版和专业版
   - CTF学习用免费版即可

2. 安装Java环境：
   Burp Suite基于Java
   需要先安装JDK
   建议JDK 11或更高版本

3. 配置浏览器代理：
   - 打开Burp Suite
   - 记住默认代理端口：8080
   - 浏览器设置代理为127.0.0.1:8080

4. 安装证书（HTTPS）：
   - 下载Burp证书
   - 导入浏览器
   - 才能抓取HTTPS流量

代理配置示例：
  127.0.0.1:8080
  或
  localhost:8080
```

---

## 二、Proxy模块界面详解

### 2.1 Proxy界面布局

```
Proxy模块界面分四个部分：

1. Intercept（拦截）
   - 开启拦截时拦截请求
   - 关闭拦截时自动放行
   - 可以查看和修改请求内容

2. HTTP History（历史记录）
   - 记录所有通过代理的请求
   - 可以筛选、搜索
   - 可以右键发送到其他模块

3. WebSockets History（WebSocket历史）
   - 记录WebSocket通信

4. Options（选项）
   - 配置拦截规则
   - 配置代理选项
   - 导入/导出证书
```

### 2.2 Intercept拦截功能

```
Intercept（拦截）界面：

┌─────────────────────────────────────────┐
│ Intercept is [ON/OFF]                   │
├─────────────────────────────────────────┤
│ Forward（放行）  Drop（丢弃）           │
│ Action（更多操作）                       │
├─────────────────────────────────────────┤
│                                         │
│ Raw / Params / Headers / Hex            │
│                                         │
│ [请求内容显示区]                         │
│                                         │
└─────────────────────────────────────────┘

功能按钮：
  - Forward：放行当前请求
  - Drop：丢弃当前请求
  - Intercept is ON：开启拦截
  - Intercept is OFF：关闭拦截

显示标签：
  - Raw：以文本形式显示
  - Params：参数形式显示
  - Headers：头部形式显示
  - Hex：十六进制显示
```

### 2.3 HTTP History历史记录

```
HTTP History界面：

┌────────────────────────────────────────────────────┐
│ #  | Host       | Method | URL      | Params |... │
├────────────────────────────────────────────────────┤
│ 1  | example.com| GET    | /index   | 0      |... │
│ 2  | example.com| POST   | /login   | 2      |... │
│ 3  | example.com| GET    | /search  | 1      |... │
└────────────────────────────────────────────────────┘

列说明：
  - #：序号
  - Host：目标主机
  - Method：HTTP方法
  - URL：请求路径
  - Params：参数数量
  - Status：状态码
  - Length：响应长度
  - MIME type：响应类型

操作：
  - 点击行查看详情
  - 右键发送其他模块
  - 筛选器过滤结果
  - 搜索关键词
```

---

## 三、Intercept拦截功能

### 3.1 开启拦截

```
步骤1：打开Burp Suite
  双击Burp Suite图标

步骤2：切换到Proxy标签
  点击"Proxy"选项卡

步骤3：开启拦截
  点击"Intercept is OFF"
  变为"Intercept is ON"

步骤4：设置浏览器代理
  浏览器设置 → 高级 → 代理设置
  配置HTTP代理：127.0.0.1:8080

步骤5：访问网站
  在浏览器中访问任意网站
  请求会被Burp拦截

步骤6：放行请求
  查看请求内容
  点击"Forward"放行
  或点击"Drop"丢弃
```

### 3.2 修改请求

```
拦截后的修改操作：

1. 修改URL
   在Raw视图中直接修改URL

2. 修改请求头
   找到需要修改的头
   直接修改值

3. 修改参数
   切换到Params视图
   修改Key和Value

4. 修改请求体
   在Raw视图中修改请求体内容

示例：修改User-Agent
  原始：
  User-Agent: Mozilla/5.0...
  
  修改为：
  User-Agent: curl/7.88.1
```

### 3.3 拦截规则

```
拦截规则设置（Options标签）：

1. Intercept Client Requests
   拦截客户端请求的条件

2. Intercept Server Responses
   拦截服务器响应的条件

3. Intercept rules logic
   拦截规则的逻辑关系

规则条件类型：
  - Domain/Host
  - IP address
  - Protocol
  - HTTP method
  - URL and file extension
  - Request header name
  - Request header contains
  - Request body
  - Parameter name
  - Parameter value

示例规则：
  拦截所有包含"admin"的请求
  拦截所有POST请求
  拦截所有来自example.com的请求
```

---

## 四、HTTP History历史记录

### 4.1 查看历史记录

```
使用HTTP History：

1. 关闭拦截
  点击"Intercept is ON"变为"Intercept is OFF"
  所有请求会自动放行并记录

2. 查看记录
  切换到"HTTP History"标签
  可以看到所有请求

3. 筛选记录
  - 使用Filter过滤器
  - 按类型筛选（Ajax、静态文件等）
  - 按状态码筛选
  - 按MIME类型筛选

4. 搜索记录
  - 使用Ctrl+F搜索
  - 搜索关键词、URL、参数等

5. 排序记录
  点击列标题排序
  默认按时间顺序
```

### 4.2 发送请求到其他模块

```
右键操作菜单：

Send to Repeater（发送到重放器）
  发送当前请求到Repeater模块
  用于修改和重放请求

Send to Intruder（发送到入侵者）
  发送当前请求到Intruder模块
  用于暴力破解

Send to Decoder（发送到解码器）
  发送内容到Decoder模块
  用于编码解码

Send to Comparer（发送到比较器）
  发送内容到Comparer模块
  用于比较差异

Copy as cURL command（复制为curl命令）
  复制为curl命令
  可在命令行使用

Request in browser（浏览器中重放）
  在浏览器中重新发送请求
```

---

## 五、Options配置选项

### 5.1 代理选项

```
Proxy Options设置：

1. Proxy Listeners
   代理监听器配置
   - 默认监听端口：8080
   - 可以添加多个监听器
   - 可以绑定特定IP地址

2. Request interception rules
   请求拦截规则
   配置何时拦截请求

3. Response interception rules
   响应拦截规则
   配置何时拦截响应

4. SSL Pass Through
   SSL直连配置
   某些网站不经过Burp代理

5. Miscellaneous
   其他设置
   - 更新Burp Suite
   - 禁用历史记录
```

### 5.2 导入证书

```
导入Burp证书（HTTPS抓包）：

步骤1：下载证书
  访问 http://burpsuite
  或
  Proxy → Options → Import/export CA certificate

步骤2：导出证书
  选择证书位置保存

步骤3：导入浏览器
  Chrome：
  设置 → 隐私和安全 → 安全 → 管理证书 → 导入
  
  Firefox：
  选项 → 隐私与安全 → 证书 → 查看证书 → 导入

步骤4：验证
  访问HTTPS网站
  如果能正常显示，说明配置成功
```

---

## 六、实战练习：抓包改包

### 6.1 练习1：修改GET参数

```
练习目标：
  修改GET参数绕过验证

步骤：
  1. 开启Burp拦截
  2. 浏览器访问：
     http://challenge-xxx.ctfhub.com:10800/?id=1
  3. 请求被拦截
  4. 修改id=1为id=2
  5. 点击Forward放行
  6. 观察响应变化
```

### 6.2 练习2：修改POST数据

```
练习目标：
  修改POST数据登录后台

步骤：
  1. 开启Burp拦截
  2. 填写登录表单
  3. 点击登录
  4. 请求被拦截
  5. 查看POST数据
  6. 修改用户名和密码
  7. 点击Forward放行
  8. 观察登录结果
```

### 6.3 练习3：修改请求头

```
练习目标：
  修改User-Agent绕过限制

步骤：
  1. 开启Burp拦截
  2. 访问目标网站
  3. 请求被拦截
  4. 找到User-Agent行
  5. 修改为：
     Mozilla/5.0 (compatible; Googlebot/2.1)
  6. 点击Forward放行
  7. 观察响应变化
```

---

## 七、常见问题解决

### 7.1 问题1：抓不到包

```
现象：
  开启代理后抓不到包

解决方法：
  1. 检查代理设置
     浏览器代理是否为127.0.0.1:8080
  
  2. 检查Burp状态
     Intercept是否开启
     试试关闭拦截
  
  3. 检查端口占用
     netstat -ano | findstr 8080
     确保端口未被占用
  
  4. 重启Burp
     有时候需要重启Burp Suite
```

### 7.2 问题2：HTTPS抓不到

```
现象：
  HTTP网站正常，HTTPS抓不到

解决方法：
  1. 安装证书
     导入Burp证书到浏览器
     设置 → 隐私与安全 → 证书
  
  2. 验证证书
     访问HTTPS网站
     点击"Advanced" → "Proceed to xxx"
     如果能访问说明代理生效
  
  3. 检查SSL直连
     Proxy → Options → SSL Pass Through
     确保目标网站不在直连列表
```

---

## 八、今日总结

### 8.1 知识点回顾

```
✅ Burp Suite基础
  - 安装和配置
  - Proxy模块界面
  
✅ Intercept拦截
  - 开启/关闭拦截
  - 修改请求内容
  - 放行/丢弃请求
  
✅ HTTP History
  - 查看历史记录
  - 筛选和搜索
  - 发送其他模块
  
✅ Options配置
  - 代理选项
  - 拦截规则
  - 证书配置
```

### 8.2 关键记忆点

```
记住这个口诀：

Burp抓包三步走，
先开代理再拦截；
Forward放行Drop丢，
改完内容再放走！

Proxy模块三功能，
Intercept来拦截；
History记日志，
Options配参数！
```

### 8.3 今日作业

```
必做题：
  1. 安装配置Burp Suite
  2. 抓取一个网站的请求
  3. 修改请求参数并放行

选做题：
  1. 配置HTTPS证书
  2. 设置拦截规则
  3. 在CTFHub完成抓包题目
```

---

**恭喜你完成Day 8的学习！明天继续学习Burp Suite Repeater！** 🎉
