# Day 5：User-Agent与Referer——绕过访问限制的利器

> **学习目标**：深入理解User-Agent和Referer的原理，掌握修改请求头的方法，学会利用它们绕过访问限制
>
> **学习时长**：2-3小时
>
> **难度等级**：⭐⭐

---

## 📚 今日内容概览

1. User-Agent是什么（用生活比喻彻底理解）
2. Referer是什么（来源追踪的原理）
3. 如何修改请求头（超级详细步骤）
4. User-Agent在CTF中的妙用
5. Referer在CTF中的妙用
6. 实战练习：CTFHub请求头题目
7. 综合实战：伪装正常访问
8. 常见问题解决
9. 今日总结与作业

---

## 一、User-Agent是什么——用生活比喻彻底理解

### 1.1 先理解什么是User-Agent

```
User-Agent是什么：
  用户代理（User-Agent）
  是浏览器访问网站时告诉服务器"我是谁"的身份标识
  就像我们去图书馆时出示的身份证一样

生活中理解：
  想象你去医院看病：
  - 你会出示医保卡或身份证
  - 护士会说"请出示您的证件"
  - 证件上写着你的身份信息（姓名、年龄、性别等）
  
  User-Agent就像是浏览器的"身份证"
  浏览器访问网站时会告诉服务器：
  "我是Chrome浏览器，版本是XX，操作系统是Windows"
  "我是Safari浏览器，版本是XX，操作系统是Mac"
  "我是微信内置浏览器，版本是XX"
  "我是百度爬虫"

服务器为什么要看User-Agent：
  1. 统计访问来源
     网站想知道用户用什么浏览器访问
     用于做统计分析
  
  2. 返回不同内容
     电脑访问返回完整页面
     手机访问返回手机版页面
     微信访问返回微信版页面
  
  3. 限制访问
     禁止爬虫访问
     禁止特定浏览器访问
     只允许特定浏览器访问
```

### 1.2 User-Agent的具体内容

```
常见浏览器的User-Agent：

Chrome浏览器：
  Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36

Firefox浏览器：
  Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0

Safari浏览器：
  Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15

Edge浏览器：
  Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0

微信内置浏览器：
  Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366 MicroMessenger/7.0.4(0x1700042c) NetType/WIFI Language/zh_CN

iPhone微信：
  Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366 MicroMessenger/7.0.4(0x1700042c) NetType/WIFI Language/zh_CN

百度爬虫：
  Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)

Google爬虫：
  Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)

CTF常用爬虫：
  curl默认：
  curl/7.88.1

  Python requests：
  python-requests/2.31.0

  wget：
  Wget/1.21.3
```

### 1.3 User-Agent的组成解析

```
以Chrome为例拆解User-Agent：

Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36

逐段解析：
  Mozilla/5.0：
    历史遗留标识
    最早是Netscape浏览器的标识
    后来所有浏览器都保留这个标识以便兼容
  
  Windows NT 10.0：
    操作系统是Windows 10
    其他常见值：
      - Windows NT 6.1 = Windows 7
      - Windows NT 6.3 = Windows 8.1
      - Windows NT 10.0 = Windows 10
      - Windows NT 10.0; Win64; x64 = Windows 10 64位
      - Macintosh = Mac电脑
      - Linux = Linux系统
  
  AppleWebKit/537.36：
    渲染引擎
    Chrome和Safari都使用这个引擎
    版本号537.36
  
  KHTML, like Gecko：
    兼容Gecko引擎
    Gecko是Firefox使用的引擎
  
  Chrome/120.0.0.0：
    真正的浏览器名称和版本
    Chrome 120版本
  
  Safari/537.36：
    Safari浏览器标识
    用于兼容旧网站
```

---

## 二、Referer是什么——来源追踪的原理

### 2.1 Referer的原理

```
Referer是什么：
  Referer（来源地址）
  是告诉服务器"你从哪里来的"
  就像超市门口的摄像头记录"你是从哪条街进来的"

生活中理解：
  想象你去一家餐厅：
  - 你从正门进来
  - 服务员会记录"这位顾客是从正门进来的"
  - 如果你是从后门进来的，服务员会记录"这位顾客是从后门进来的"
  
  Referer就像这个记录：
  - 你从百度搜索点进来的 → Referer: https://www.baidu.com
  - 你从朋友圈分享点进来的 → Referer: https://mp.weixin.qq.com
  - 你直接在地址栏输入访问的 → 没有Referer（直接访问）

为什么叫Referer而不是Referrer？
  这是HTTP协议历史上的一个拼写错误
  正确应该是"Referrer"（来源页）
  但为了保持兼容性，一直沿用Referer这个错误拼写
  面试时可能会被问到这个冷知识！
```

### 2.2 Referer的具体内容

```
常见的Referer值：

从百度搜索访问：
  Referer: https://www.baidu.com/s?wd=关键字

从Google搜索访问：
  Referer: https://www.google.com/search?q=关键字

从朋友圈访问：
  Referer: https://mp.weixin.qq.com/s/xxxxx

从知乎访问：
  Referer: https://www.zhihu.com/

从微博访问：
  Referer: https://weibo.com/

直接访问（没有Referer）：
  没有Referer头
  或者Referer为空

从HTTPS跳转到HTTP：
  Referer: （不会发送，防止泄露敏感信息）

从页面A访问页面B：
  页面A中有链接指向页面B
  点击链接访问时
  Referer就是页面A的URL
```

### 2.3 Referer的作用

```
服务器为什么需要Referer：

1. 统计分析
   网站想知道用户从哪里来的
   用于流量分析
   知道哪些渠道带来更多用户

2. 防盗链
   网站A引用了网站B的图片
   网站B可以通过Referer判断
   "这张图片被谁引用了"
   如果不是自家网站引用，就拒绝提供图片
   节省带宽资源

3. 访问控制
   网站要求"必须从某个页面跳转才能访问"
   例如：
     - 必须从首页点击才能访问后台
     - 必须从登录页跳转才能访问
     - 必须从特定页面访问才能获取数据

4. 防止CSRF攻击
   某些操作要求必须从本站点发起
   通过Referer验证请求来源
   防止跨站请求伪造
```

---

## 三、如何修改请求头——超级详细步骤

### 3.1 用Chrome开发者工具修改User-Agent

```
方法一：直接在Network面板查看

步骤1：打开开发者工具
  - 按F12
  - 或右键 → 检查

步骤2：切换到Network面板
  - 点击"Network"标签

步骤3：访问网站
  - 在地址栏输入URL
  - 刷新页面

步骤4：查看User-Agent
  - 点击任意一个请求
  - 查看Headers中的Request Headers
  - 找到User-Agent行

注意：
  这里只能看，不能改
  如果要改，用下面两种方法
```

### 3.2 用Burp Suite修改请求头

```
用Burp Suite拦截并修改请求头

步骤1：设置代理
  - 打开Burp Suite
  - 设置浏览器代理为127.0.0.1:8080

步骤2：开启拦截
  - 切换到Proxy标签
  - 点击"Intercept is on"

步骤3：访问目标网站
  - 浏览器访问网站
  - 请求被Burp拦截

步骤4：修改User-Agent
  在拦截的请求中找到：
  User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...
  改为：
  User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)

步骤5：修改Referer
  添加或修改：
  Referer: https://www.google.com/

步骤6：放行请求
  点击"Forward"按钮
  请求被发送到服务器
```

### 3.3 用Burp Suite的Repeater修改请求头

```
步骤1：抓包并发送到Repeater
  - 在Proxy的HTTP history中
  - 右键请求 → Send to Repeater
  - 或选中请求后按Ctrl+R

步骤2：切换到Repeater
  - 点击Repeater标签
  - 看到请求信息

步骤3：修改请求头
  在请求头区域：
  - 找到User-Agent行
  - 修改为需要的值
  
  示例：
  将：
  User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...
  改为：
  User-Agent: curl/7.88.1

步骤4：修改Referer
  添加或修改Referer行：
  Referer: https://www.google.com/

步骤5：发送请求
  点击"Go"按钮
  查看响应
```

### 3.4 用curl命令测试

```
curl是命令行工具，可以指定User-Agent和Referer

基本用法：
  curl http://example.com
  
指定User-Agent：
  curl -A "Mozilla/5.0 (compatible; Googlebot/2.1)" http://example.com
  或
  curl --user-agent "curl/7.88.1" http://example.com

指定Referer：
  curl -e "https://www.google.com/" http://example.com
  或
  curl --referer "https://www.baidu.com/" http://example.com

同时指定多个头：
  curl -H "User-Agent: curl/7.88.1" \
       -H "Referer: https://www.google.com/" \
       http://example.com

保存响应到文件：
  curl -o output.html http://example.com

显示响应头：
  curl -i http://example.com

显示完整通信过程（调试用）：
  curl -v http://example.com
```

### 3.5 用Python requests修改请求头

```
Python的requests库可以方便地修改请求头

安装：
  pip install requests

基本用法：
  import requests
  
  response = requests.get('http://example.com')
  print(response.text)

指定User-Agent：
  headers = {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  }
  response = requests.get('http://example.com', headers=headers)

指定Referer：
  headers = {
      'Referer': 'https://www.google.com/'
  }
  response = requests.get('http://example.com', headers=headers)

同时指定多个头：
  headers = {
      'User-Agent': 'curl/7.88.1',
      'Referer': 'https://www.google.com/',
      'Accept': 'text/html'
  }
  response = requests.get('http://example.com', headers=headers)

模拟常见浏览器：
  headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
  response = requests.get('http://example.com', headers=headers)
```

---

## 四、User-Agent在CTF中的妙用

### 4.1 绕过浏览器限制

```
场景1：禁止非浏览器访问

有些CTF题目会检查User-Agent：
  - 只有浏览器才能访问
  - 爬虫和curl被拒绝
  
解题方法：
  修改User-Agent为浏览器标识
  
示例：
  原始请求（被拒绝）：
  GET /admin HTTP/1.1
  User-Agent: curl/7.88.1
  
  修改后（成功）：
  GET /admin HTTP/1.1
  User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36
```

### 4.2 伪装成爬虫

```
场景2：需要伪装成爬虫

有些CTF题目要求伪装成爬虫访问：
  - 伪装成百度爬虫获取数据
  - 伪装成Google爬虫获取数据
  
解题方法：
  修改User-Agent为爬虫标识
  
示例（伪装成百度爬虫）：
  GET /secret HTTP/1.1
  User-Agent: Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)

示例（伪装成Google爬虫）：
  GET /secret HTTP/1.1
  User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)

常见爬虫User-Agent：
  百度爬虫：
  Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)
  
  Google爬虫：
  Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
  
  必应爬虫：
  Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)
  
  搜狗爬虫：
  Sogou web spider/4.0(+http://www.sogou.com/docs/help/webmasters.htm#07)
```

### 4.3 绕过微信限制

```
场景3：需要伪装成微信访问

有些CTF题目需要从微信访问：
  - 只有微信浏览器才能访问
  - 需要微信特有的User-Agent
  
解题方法：
  修改User-Agent为微信浏览器标识
  
示例：
  iPhone微信：
  Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366 MicroMessenger/7.0.4(0x1700042c) NetType/WIFI Language/zh_CN
  
  安卓微信：
  Mozilla/5.0 (Linux; Android 10; SM-G9600) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.147 Mobile Safari/537.36 MicroMessenger/7.0.4(0x1700042c) NetType/WIFI Language/zh_CN
```

### 4.4 绕过版本限制

```
场景4：需要特定浏览器版本

有些CTF题目检查浏览器版本：
  - 只有旧版本浏览器才能访问
  - 新版本浏览器被拒绝
  
解题方法：
  修改User-Agent为旧版本浏览器
  
示例（伪装成IE浏览器）：
  Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko

示例（伪装成旧版Chrome）：
  Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36
```

---

## 五、Referer在CTF中的妙用

### 5.1 绕过来源验证

```
场景1：需要从特定页面跳转

有些CTF题目检查Referer：
  - 必须从首页点击才能访问后台
  - 必须从登录页跳转才能访问
  
解题方法：
  添加正确的Referer
  
示例：
  原始请求（被拒绝）：
  GET /admin HTTP/1.1
  （没有Referer）
  
  修改后（成功）：
  GET /admin HTTP/1.1
  Referer: http://challenge.com/index.html
```

### 5.2 绕过防盗链

```
场景2：图片有防盗链

有些CTF题目使用防盗链：
  - 直接访问图片被拒绝
  - 需要从站内链接访问
  
解题方法：
  添加正确的Referer
  
示例：
  原始请求（被拒绝）：
  GET /secret.jpg HTTP/1.1
  
  修改后（成功）：
  GET /secret.jpg HTTP/1.1
  Referer: http://challenge.com/
```

### 5.3 绕过登录验证

```
场景3：登录后跳转验证

有些CTF题目检查登录跳转来源：
  - 必须从登录页提交表单才能访问
  - 直接访问被拒绝
  
解题方法：
  添加登录页作为Referer
  
示例：
  原始请求（被拒绝）：
  POST /api/getflag HTTP/1.1
  （没有Referer）
  
  修改后（成功）：
  POST /api/getflag HTTP/1.1
  Referer: http://challenge.com/login.html
```

### 5.4 利用Referer泄露信息

```
场景4：Referer中隐藏信息

有些CTF题目在Referer中隐藏Flag：
  - Flag藏在Referer验证过程中
  - 通过查看响应推断Flag
  
示例：
  请求1：
  GET /secret HTTP/1.1
  Referer: flag{part1_of_flag}
  
  响应：
  HTTP/1.1 200 OK
  Hint: 还需要part2_of_flag
  
解题方法：
  注意观察Referer的值
  可能藏着部分Flag
```

---

## 六、实战练习：CTFHub请求头题目

### 6.1 题目1：User-Agent伪装

```
题目描述：
  访问 http://challenge-xxx.ctfhub.com:10800/
  页面显示"Only Google Bot can see the flag"
  需要伪装成Google爬虫

解题步骤：
  步骤1：用Burp Suite抓包
    打开Burp Suite
    开启Proxy拦截
    浏览器设置代理
    访问目标网站
  
  步骤2：查看响应
    发现页面显示"Please use Google Bot"
    被拒绝了
  
  步骤3：修改User-Agent
    将User-Agent改为：
    Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
  
  步骤4：重新发送请求
    点击"Forward"
  
  步骤5：得到Flag
    页面显示：
    flag{user_agent_is_important}

解题关键：
  伪装成爬虫就能通过验证
```

### 6.2 题目2：Referer绕过

```
题目描述：
  访问 http://challenge-xxx.ctfhub.com:10800/source
  页面显示"Only from https://www.google.com/ can see the flag"
  需要设置正确的Referer

解题步骤：
  步骤1：用Burp Suite抓包
    开启Proxy拦截
    访问 /source 路径
  
  步骤2：查看响应
    发现页面显示"Please set Referer to https://www.google.com/"
    被拒绝了
  
  步骤3：修改Referer
    添加Referer头：
    Referer: https://www.google.com/
  
  步骤4：重新发送请求
    点击"Forward"
  
  步骤5：得到Flag
    页面显示：
    flag{referer_check_is_important}

解题关键：
  设置正确的Referer就能通过验证
```

### 6.3 题目3：综合请求头

```
题目描述：
  需要同时修改多个请求头才能获取Flag
  提示："Google from https://www.google.com/"

解题步骤：
  步骤1：用Burp抓包
    开启Proxy拦截
    访问目标网站
  
  步骤2：分析提示
    需要伪装成Google爬虫
    需要从Google搜索页面跳转
  
  步骤3：修改User-Agent
    Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
  
  步骤4：修改Referer
    Referer: https://www.google.com/search?q=ctfhub
  
  步骤5：发送请求
    点击"Forward"
  
  步骤6：得到Flag
    flag{multiple_headers_bypass}

解题关键：
  有时候需要同时满足多个条件
```

### 6.4 题目4：302跳转+请求头

```
题目描述：
  需要先访问首页，然后跳转到Flag页面
  同时需要设置正确的请求头

解题步骤：
  步骤1：访问首页
    GET / HTTP/1.1
    （正常访问）
  
  步骤2：看到302跳转
    Location: /flag
    
  步骤3：构造请求
    在Burp中手动构造：
    GET /flag HTTP/1.1
    User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
    Referer: http://challenge-xxx.ctfhub.com:10800/
  
  步骤4：发送请求
    点击"Go"
  
  步骤5：得到Flag
    flag{redirect_with_headers}

解题关键：
  跟随重定向时保持正确的请求头
```

---

## 七、综合实战：伪装正常访问

### 7.1 完整伪装方案

```
实战场景：
  需要伪装成从Google搜索访问的Google爬虫

步骤1：分析目标要求
  1. 检查User-Agent是否为Google爬虫
  2. 检查Referer是否为Google搜索地址
  3. 可能还有其他检查

步骤2：准备伪装参数
  User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
  Referer: https://www.google.com/search?q=目标关键词

步骤3：使用Burp Suite
  1. 设置代理
  2. 开启拦截
  3. 修改请求头
  4. 放行请求

步骤4：验证
  1. 查看响应状态码
  2. 查看响应内容
  3. 确认Flag
```

### 7.2 Python脚本批量测试

```
import requests

# 常见User-Agent列表
user_agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)',
    'curl/7.88.1',
]

# 常见Referer列表
referers = [
    'https://www.google.com/',
    'https://www.baidu.com/',
    'http://localhost/',
    '',
]

# 测试函数
def test_url(url):
    for ua in user_agents:
        for ref in referers:
            headers = {
                'User-Agent': ua,
                'Referer': ref
            }
            try:
                response = requests.get(url, headers=headers, timeout=5)
                if 'flag' in response.text.lower():
                    print(f"Found flag with UA={ua}, Ref={ref}")
                    print(response.text[:500])
                    return True
            except:
                pass
    return False

# 使用
url = 'http://challenge-xxx.ctfhub.com:10800/'
test_url(url)
```

---

## 八、常见问题解决

### 8.1 问题1：修改后还是被拒绝

```
现象：
  修改了User-Agent，但还是被拒绝

解决方法：
  1. 检查是否还有其他检查
     可能还需要Referer或其他头
  
  2. 检查大小写
     User-Agent必须完全匹配
     建议直接复制粘贴
  
  3. 检查空格和特殊字符
     确保没有多余的空格
     确保URL编码正确
  
  4. 查看响应内容
     可能有错误提示
     告诉你缺少什么
```

### 8.2 问题2：Referer不生效

```
现象：
  添加了Referer，但还是被拒绝

解决方法：
  1. 检查Referer格式
     必须是完整的URL
     例如：https://www.google.com/
     不能只写：google.com
  
  2. 检查HTTP/HTTPS
     必须是正确的协议
     从HTTPS跳转到HTTP不会有Referer
  
  3. 检查Referer拼写
     是Referer不是Referrer
```

### 8.3 问题3：不知道目标需要什么

```
现象：
  不知道需要什么User-Agent或Referer

解决方法：
  1. 查看页面提示
     页面可能有提示信息
     例如："Please use Google Bot"
  
  2. 查看页面源代码
     可能藏着提示
     例如：<!-- Google Bot only -->
  
  3. 尝试常见组合
     Google爬虫 + Google搜索页面
     百度爬虫 + 百度搜索页面
  
  4. 尝试空Referer
     有些情况需要空Referer
```

---

## 九、今日总结

### 9.1 知识点回顾

```
✅ User-Agent基础
  - 浏览器的身份证
  - 告诉服务器"我是谁"
  - 可以修改来伪装身份

✅ Referer基础
  - 来源地址
  - 告诉服务器"我从哪来"
  - 用于来源追踪和访问控制

✅ 修改请求头方法
  - Burp Suite拦截修改
  - curl命令指定
  - Python requests库

✅ CTF中的妙用
  - 伪装成爬虫绕过限制
  - 设置Referer绕过验证
  - 综合利用获取Flag
```

### 9.2 关键记忆点

```
记住这个口诀：

User-Agent是身份证，
告诉服务器我是谁；
Referer是来源地，
告诉服务器我从哪来；
两个都能随便改，
伪装身份把题解！

常用User-Agent：
  浏览器：Mozilla/5.0 Chrome/120.0.0.0
  Google爬虫：compatible; Googlebot/2.1
  百度爬虫：Baiduspider/2.0
  curl：curl/7.88.1
```

### 9.3 今日作业

```
必做题：
  1. 学会使用Burp修改User-Agent和Referer
  2. 在CTFHub完成请求头相关题目（至少3道）
  3. 练习使用curl命令测试请求头

选做题：
  1. 研究更多爬虫的User-Agent
  2. 编写Python脚本批量测试请求头
  3. 完成5道以上请求头题目

提交内容：
  - 题目截图
  - 解决思路
  - 使用的方法
```

### 9.4 明日预告

```
Day 6：HTTP明文传输与敏感信息——攻防实战

学习内容：
  - HTTP是明文传输的
  - 敏感信息如何泄露
  - 如何在CTF中利用明文传输
  - 敏感信息收集技巧
```

---

**恭喜你完成Day 5的学习！明天学习HTTP明文传输与敏感信息！** 🎉
