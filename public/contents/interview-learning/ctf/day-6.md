# Day 6：HTTP明文传输与敏感信息——攻防实战

> **学习目标**：深入理解HTTP明文传输的原理，学会在CTF中发现和利用敏感信息泄露
>
> **学习时长**：2-3小时
>
> **难度等级**：⭐⭐

---

## 📚 今日内容概览

1. HTTP明文传输原理（用生活比喻）
2. 什么是敏感信息
3. 敏感信息泄露场景
4. 如何发现敏感信息
5. 实战练习：敏感信息收集
6. CTF中的敏感信息利用
7. 防护措施
8. 常见问题解决
9. 今日总结与作业

---

## 一、HTTP明文传输原理——用生活比喻

### 1.1 什么是明文传输

```
明文传输是什么：
  HTTP协议传输的数据是"明文"的
  就像寄信时用的是透明信封
  任何人都能看见里面的内容

生活中理解：
  想象你寄一封挂号信：
  
  明文传输（HTTP）：
  - 你把信放进透明塑料袋
  - 邮递员、快递公司、收件人都能看到信的内容
  - 如果有人在中途截获，就能看到内容
  
  加密传输（HTTPS）：
  - 你把信放进密码箱
  - 只有知道密码的人才能打开
  - 邮递员、快递公司都看不到内容（除非有钥匙）

HTTP的明文问题：
  1. 任何人能截获你的请求
     - 在咖啡厅连WiFi，中间人能看到你的请求
     - 公司网络管理员能看到所有HTTP请求
     - 运营商能看到所有HTTP请求
  
  2. 任何人能修改你的请求
     - 中间人可以在你的请求中插入代码
     - 可以在你的请求中注入恶意内容
  
  3. 任何人能看到你的响应
     - 响应中的敏感信息也会被截获
     - 图片、视频、文件都能被截获
```

### 1.2 什么是HTTPS

```
HTTPS是什么：
  HTTP + SSL/TLS = HTTPS
  HTTP over SSL/TLS
  在HTTP外面加了一层加密

加密原理（简化版）：
  1. 客户端告诉服务器："我要建立安全连接"
  2. 服务器发送证书给客户端
  3. 客户端验证证书
  4. 客户端生成一个"对话密钥"
  5. 用服务器的公钥加密"对话密钥"，发送给服务器
  6. 服务器用私钥解密，得到"对话密钥"
  7. 双方用"对话密钥"加密通信

生活中理解：
  HTTPS就像：
  - 你去银行开户，获得一把钥匙
  - 你把钥匙放进密码箱寄给银行
  - 只有银行能打开密码箱
  - 之后你们用这个钥匙通信

HTTPS的优点：
  1. 数据加密，没人能看到
  2. 数据完整性验证，不能被篡改
  3. 身份验证，确认服务器是真的
```

### 1.3 HTTP/HTTPS区别

```
HTTP（端口80）：
  GET /index.html HTTP/1.1
  Host: example.com
  
  响应：
  HTTP/1.1 200 OK
  Content-Type: text/html
  
  <html>...</html>

HTTPS（端口443）：
  GET /index.html HTTP/1.1
  Host: example.com
  
  响应：
  HTTP/1.1 200 OK
  Content-Type: text/html
  
  <html>...</html>
  
  （数据被加密，截获的是乱码）

在Burp Suite中：
  - HTTP请求可以直接看原文
  - HTTPS请求需要安装证书才能解密
  - 证书配置：Proxy → Options → Import/export CA certificate
```

---

## 二、什么是敏感信息

### 2.1 敏感信息分类

```
敏感信息包括：

1. 认证信息
   - 用户名和密码
   - API密钥
   - Token
   - Session ID
   - Cookie
   
2. 个人隐私信息
   - 身份证号
   - 手机号
   - 邮箱地址
   - 家庭住址
   - 银行卡号
   
3. 业务敏感信息
   - 源代码
   - 数据库配置
   - 服务器配置
   - API文档
   - Flag
   
4. 错误信息
   - 堆栈跟踪
   - SQL语句
   - 文件路径
   - 服务器版本
```

### 2.2 CTF中常见的敏感信息

```
CTF中常见的敏感信息：

1. Flag
   - flag{xxx}
   - ctfhub{xxx}
   - 藏在各种地方
   
2. 配置文件
   - config.php
   - database.php
   - .git/config
   - .svn/entries
   - .DS_Store
   
3. 备份文件
   - index.php.bak
   - index.php~
   - index.php.old
   - www.zip
   - backup.sql
   
4. 源代码
   - /source
   - /src
   - /debug
   - 注释中的代码
   
5. 数据库信息
   - 数据库连接信息
   - 数据库内容
   - SQL语句
   
6. API接口
   - /api/*
   - /admin/*
   - /debug/*
```

### 2.3 敏感信息存放位置

```
敏感信息可能藏在：

1. URL中
   - GET参数
   - 路径
   
2. 请求头中
   - Cookie
   - Authorization
   - 自定义头
   
3. 请求体中
   - POST参数
   - JSON数据
   
4. 响应头中
   - Set-Cookie
   - 自定义头
   - Server版本
   
5. 响应体中
   - HTML内容
   - JavaScript代码
   - 注释
   - 图片（隐写）
   
6. 文件系统中
   - 备份文件
   - 日志文件
   - 配置文件
```

---

## 三、敏感信息泄露场景

### 3.1 错误信息泄露

```
场景1：详细错误信息

有些网站在出错时显示详细信息：
  HTTP/1.1 500 Internal Server Error
  Content-Type: text/html
  
  <html>
  <body>
  <h1>Database Error</h1>
  <p>Error: SELECT * FROM users WHERE id='1' LIMIT 1</p>
  <p>File: /var/www/html/index.php:123</p>
  <p>Stack trace:</p>
  <pre>
  #0 /var/www/html/index.php(123): mysqli_query(...)
  ...
  </pre>
  </body>
  </html>

CTF利用：
  - 从错误信息中获得SQL语句
  - 从堆栈跟踪中获得文件路径
  - 从路径中推断服务器结构
  
解题方法：
  1. 故意触发错误
  2. 查看错误信息
  3. 从错误信息中获得线索
```

### 3.2 注释泄露

```
场景2：源代码注释

有些开发者在代码中留下注释：
  <!-- TODO: 修复登录漏洞 -->
  <!-- 管理员账号: admin -->
  <!-- 密码: password123 -->
  
  <script>
  // TODO: 这里需要加密
  // Debug: var password = 'secret';
  </script>

CTF利用：
  - 从HTML注释中获得密码
  - 从JavaScript注释中获得密钥
  - 从注释中获得Flag
  
解题方法：
  1. 查看页面源代码
  2. 搜索"flag"或"password"
  3. 搜索"TODO"或"DEBUG"
```

### 3.3 备份文件泄露

```
场景3：备份文件

有些网站忘记删除备份文件：
  - index.php.bak
  - index.php~
  - index.php.old
  - database.sql.bak
  - www.zip
  - backup.tar.gz

CTF利用：
  - 下载备份文件
  - 获得源代码
  - 获得数据库内容
  - 获得配置文件
  
解题方法：
  1. 猜测备份文件名
  2. 尝试常见备份文件名
  3. 下载备份文件
```

### 3.4 Git/SVN泄露

```
场景4：版本控制系统泄露

有些网站忘记删除.git或.svn目录：
  - .git/config
  - .git/HEAD
  - .git/index
  - .svn/entries
  - .svn/wc.db

CTF利用：
  - 下载.git目录
  - 使用git dumper恢复代码
  - 获得所有历史版本
  - 获得Flag（可能在旧版本中）
  
解题方法：
  1. 访问 /.git/ 或 /.svn/
  2. 下载整个目录
  3. 使用工具恢复代码
```

### 3.5 目录遍历泄露

```
场景5：目录遍历

有些网站存在目录遍历漏洞：
  GET /file?path=../../../../etc/passwd
  
  响应：
  root:x:0:0:root:/root:/bin/bash
  daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
  ...

CTF利用：
  - 读取系统文件
  - 读取配置文件
  - 读取日志文件
  - 读取源代码
  
解题方法：
  1. 寻找文件读取功能
  2. 尝试路径穿越
  3. 读取敏感文件
```

---

## 四、如何发现敏感信息

### 4.1 查看页面源代码

```
步骤：
  1. 右键页面 → 查看网页源代码
  2. 或按 Ctrl+U
  
查找内容：
  1. 搜索 "flag"（不区分大小写）
  2. 搜索 "password"
  3. 搜索 "key"
  4. 搜索 "<!--"
  5. 搜索 "TODO"
  6. 搜索 "//"
  7. 搜索 "/*"
  
常见位置：
  1. HTML注释：<!-- xxx -->
  2. JavaScript注释：// xxx 或 /* xxx */
  3. 隐藏字段：<input type="hidden" value="xxx">
  4. CSS注释：/* xxx */
```

### 4.2 使用Burp Suite查找

```
方法1：HTTP History
  1. Proxy → HTTP History
  2. 查看所有请求和响应
  3. 使用Ctrl+F搜索关键词
  
方法2：Search功能
  1. Target → Site map
  2. 右键 → Engagement tools → Search
  3. 搜索关键词
  
方法3：Repeater修改请求
  1. 抓包发送到Repeater
  2. 修改请求触发不同响应
  3. 查看响应中的敏感信息
```

### 4.3 使用curl/wget

```
curl基本用法：
  curl http://example.com/
  
保存页面：
  curl -o page.html http://example.com/
  
显示响应头：
  curl -i http://example.com/
  
显示详细通信：
  curl -v http://example.com/

下载文件：
  curl -O http://example.com/file.zip
  wget http://example.com/file.zip

扫描备份文件：
  curl http://example.com/index.php.bak
  curl http://example.com/index.php~
  curl http://example.com/index.php.old
  curl http://example.com/backup.zip
```

### 4.4 使用Dirbuster/御剑扫描

```
Dirbuster：
  - OWASP的目录扫描工具
  - 扫描常见目录和文件
  
御剑：
  - 国内常用的扫描工具
  - 内置多种字典
  
使用方法：
  1. 设置目标URL
  2. 设置字典
  3. 开始扫描
  4. 查看结果
  5. 访问发现的路径

常见扫描路径：
  - /admin/
  - /backup/
  - /config/
  - /debug/
  - /robots.txt
  - /.git/
  - /.svn/
```

---

## 五、实战练习：敏感信息收集

### 5.1 题目1：查看页面源代码

```
题目描述：
  Flag藏在页面源代码中
  
解题步骤：
  步骤1：访问页面
    http://challenge-xxx.ctfhub.com:10800/
    页面显示 "Flag is hidden"
  
  步骤2：查看源代码
    右键 → 查看网页源代码
    或按 Ctrl+U
  
  步骤3：搜索Flag
    在源代码中搜索 "flag"
    发现：
    <!-- flag{view_source_code} -->
  
  步骤4：得到Flag
    flag{view_source_code}
```

### 5.2 题目2：备份文件

```
题目描述：
  Flag在备份文件中
  
解题步骤：
  步骤1：访问首页
    http://challenge-xxx.ctfhub.com:10800/
    页面正常显示
  
  步骤2：猜测备份文件名
    尝试：
      - index.php.bak
      - index.bak
      - backup.php
      - www.zip
      - www.tar.gz
  
  步骤3：下载备份文件
    curl http://challenge-xxx.ctfhub.com:10800/index.php.bak
    成功下载！
  
  步骤4：查看文件内容
    <?php
    // flag is: ctfhub{backup_file}
    ...
    ?>
  
  步骤5：得到Flag
    ctfhub{backup_file}
```

### 5.3 题目3：Git泄露

```
题目描述：
  Flag在Git历史中
  
解题步骤：
  步骤1：检查.git目录
    访问 http://challenge-xxx.ctfhub.com:10800/.git/
    返回目录列表
    说明.git目录存在且可访问！
  
  步骤2：使用GitHacker工具
    python GitHacker.py http://challenge-xxx.ctfhub.com:10800/.git/
    成功下载.git目录到本地
  
  步骤3：查看Git历史
    git log
    git diff HEAD~1
    git show HEAD:index.php
  
  步骤4：找到Flag
    在某个历史版本中发现：
    <?php
    // flag{git_leak}
    ?>
  
  步骤5：得到Flag
    flag{git_leak}
```

### 5.4 题目4：错误信息

```
题目描述：
  Flag在错误信息中
  
解题步骤：
  步骤1：寻找注入点
    访问 http://challenge-xxx.ctfhub.com:10800/?id=1
    正常显示
  
  步骤2：尝试触发错误
    访问 http://challenge-xxx.ctfhub.com:10800/?id=1'
    触发SQL错误！
  
  步骤3：查看错误信息
    错误信息显示：
    Warning: mysqli_query(): SELECT * FROM users WHERE id='1'' LIMIT 1
    File: /var/www/html/index.php on line 23
    Table: flag_tbl, Column: flag
  
  步骤4：构造查询
    ?id=1' UNION SELECT flag FROM flag_tbl--
  
  步骤5：得到Flag
    flag{sql_error_leak}
```

### 5.5 题目5：敏感文件

```
题目描述：
  Flag在系统文件中
  
解题步骤：
  步骤1：寻找文件读取功能
    发现 http://challenge-xxx.ctfhub.com:10800/file?path=xxx
    存在文件读取功能
  
  步骤2：尝试路径穿越
    ?path=../../../../etc/passwd
    成功读取！
  
  步骤3：尝试读取Flag文件
    ?path=/flag
    ?path=./flag.txt
    ?path=../flag
  
  步骤4：找到Flag
    /flag 文件内容：
    flag{file_read_vulnerability}
  
  步骤5：得到Flag
    flag{file_read_vulnerability}
```

---

## 六、CTF中的敏感信息利用

### 6.1 信息收集流程

```
CTF信息收集标准流程：

步骤1：查看页面内容
  - 访问首页，看页面显示
  - 查看页面源代码
  - 搜索"flag"等关键词

步骤2：查看HTTP请求
  - 用Burp Suite抓包
  - 查看请求头和响应头
  - 查看响应体

步骤3：扫描目录和文件
  - 使用Dirbuster/御剑扫描
  - 尝试常见备份文件名
  - 尝试访问.git/.svn目录

步骤4：查看robots.txt
  - 访问 /robots.txt
  - 可能藏着敏感路径

步骤5：尝试触发错误
  - SQL注入点
  - XSS
  - 其他错误

步骤6：暴力破解
  - 使用Burp Intruder
  - 尝试常见用户名密码
  - 尝试常见API密钥
```

### 6.2 常用工具

```
常用工具：

1. Burp Suite
   - 抓包、改包
   - 搜索敏感信息
   - Intruder暴力破解
   
2. Dirbuster/御剑
   - 目录扫描
   - 文件扫描
   
3. GitHacker
   - Git泄露利用
   - 下载Git仓库
   
4. SQLMap
   - SQL注入检测
   - 数据库信息获取
   
5. Nmap
   - 端口扫描
   - 服务探测
   
6. curl/wget
   - 命令行下载
   - 文件获取
```

### 6.3 常见关键词

```
搜索关键词：

英文关键词：
  - flag
  - password
  - secret
  - key
  - token
  - session
  - admin
  - root
  - credential
  - API
  - database
  - config
  
中文关键词：
  - 密码
  - 账号
  - 管理员
  - Flag
  - 密钥
  
注释关键词：
  - TODO
  - FIXME
  - DEBUG
  - HACK
  - NOTE
  - XXX
```

---

## 七、防护措施

### 7.1 代码层面

```
防护措施：

1. 关闭详细错误信息
   php.ini:
   display_errors = Off
   log_errors = On
   
   代码中：
   <?php
   error_reporting(0);
   ?>
   
2. 删除注释
   - 生产环境删除所有注释
   - 或使用注释工具预处理
   
3. 禁止备份文件
   - 使用版本控制系统
   - 不要在Web目录放备份
   
4. 禁止.git/.svn访问
   Apache:
   <DirectoryMatch /\.git/>
       Order deny,allow
       Deny from all
   </DirectoryMatch>
   
   Nginx:
   location ~ /\.git {
       deny all;
   }
```

### 7.2 服务器层面

```
服务器配置：

1. 使用HTTPS
   - 所有HTTP站点改为HTTPS
   - 强制跳转HTTP到HTTPS
   
2. 隐藏服务器版本
   Apache:
   ServerTokens Prod
   ServerSignature Off
   
   Nginx:
   server_tokens off;
   
3. 配置防火墙
   - 限制访问管理后台
   - 禁止外部访问敏感端口
   
4. 定期安全扫描
   - 使用自动化工具扫描
   - 及时修复发现的问题
```

---

## 八、常见问题解决

### 8.1 问题1：找不到敏感信息

```
现象：
  找了很久都没找到Flag

解决方法：
  1. 检查是否看完了所有页面
     有些CTF有多页内容
  
  2. 检查是否抓完了所有请求
     有些内容通过AJAX加载
  
  3. 检查是否看完了响应头
     Flag可能在响应头中
  
  4. 尝试其他关键词
     除了flag，试试flagbase64、secret等
  
  5. 暴力破解
     如果实在找不到，试试暴力破解
```

### 8.2 问题2：备份文件下载失败

```
现象：
  尝试下载备份文件失败

解决方法：
  1. 检查文件名
     可能不是常见的备份文件名
     试试其他变体
  
  2. 检查路径
     可能在子目录中
     试试 /backup/index.php.bak
  
  3. 检查服务器配置
     有些服务器禁止访问.php.bak
     试试改成.txt或.html
  
  4. 使用其他方法
     如果备份文件不存在，试试其他方法
```

### 8.3 问题3：Git泄露无法利用

```
现象：
  .git目录存在但无法下载

解决方法：
  1. 检查.git是否可以访问
     访问 /.git/config
     如果返回403，说明无法利用
  
  2. 使用GitHacker工具
     可能需要完整下载.git
  
  3. 手动下载
     使用wget递归下载
     wget -r http://example.com/.git/
```

---

## 九、今日总结

### 9.1 知识点回顾

```
✅ HTTP明文传输
  - HTTP是明文传输
  - HTTPS是加密传输
  - 中间人可以截获和修改

✅ 敏感信息类型
  - Flag
  - 配置文件
  - 备份文件
  - 源代码
  - 数据库信息

✅ 发现敏感信息
  - 查看源代码
  - 使用Burp Suite
  - 扫描目录
  - 触发错误

✅ 敏感信息利用
  - 下载备份文件
  - Git/SVN泄露
  - 错误信息
  - 文件读取
```

### 9.2 关键记忆点

```
记住这个口诀：

HTTP明文传输快，
敏感信息全在外；
查看源码找Flag，
备份文件别忘下；
Git泄露要利用，
错误信息藏玄机！

信息收集流程：
  页面 → 源码 → 请求 → 目录 → 错误 → 暴力破解
```

### 9.3 今日作业

```
必做题：
  1. 学会查看页面源代码
  2. 学会使用Burp Suite搜索
  3. 在CTFHub完成敏感信息相关题目（至少3道）

选做题：
  1. 学习使用GitHacker工具
  2. 学习使用Dirbuster扫描
  3. 完成5道以上敏感信息题目

提交内容：
  - 题目截图
  - 解决方法
  - 找到的Flag
```

### 9.4 明日预告

```
Day 7：PUT方法与RESTful API——接口攻防

学习内容：
  - HTTP请求方法详解
  - RESTful API原理
  - PUT方法上传文件
  - 接口安全测试
```

---

**恭喜你完成Day 6的学习！明天学习HTTP请求方法和RESTful API！** 🎉
