# Day 31：攻防世界Web新手区实战（上）

> **学习目标**：在攻防世界平台完成Web新手区题目，掌握dirsearch目录扫描工具，培养限时解题能力
>
> **学习时长**：3-4小时
>
> **难度等级**：⭐⭐⭐

---

## 📚 今日内容概览

1. 攻防世界平台介绍与注册
2. Web新手区题目分类与特点
3. dirsearch工具安装与使用
4. 隐藏目录发现技巧
5. 实战题目详解（一）
6. 限时解题训练方法
7. WriteUp阅读与复盘

---

## 一、攻防世界平台介绍

### 1.1 什么是攻防世界？

```
【通俗易懂的解释】

攻防世界就像一个"网络安全健身房"：

  🏋️ 健身房：
    - 有各种器械（不同类型的题目）
    - 有新手区（简单题目）
    - 有进阶区（困难题目）
    - 有教练指导（WriteUp）

  🎯 攻防世界：
    - 有各种题目（Web、Pwn、Crypto、Reverse、Misc）
    - 有新手练习区（入门难度）
    - 有进阶挑战区（中等难度）
    - 有高手竞技区（困难难度）
    - 有官方WriteUp（解题思路）

为什么选择攻防世界？
  - 国内最大的CTF练习平台之一
  - 题目质量高，分类清晰
  - 新手友好，有详细提示
  - 可以看到自己的排名和进度
  - 有社区讨论区
```

### 1.2 平台注册与入门

```
【注册步骤】

第一步：访问平台
  网址：https://adworld.xctf.org.cn

第二步：注册账号
  1. 点击右上角"注册"
  2. 填写用户名、邮箱、密码
  3. 完成邮箱验证
  4. 登录账号

第三步：进入新手区
  1. 点击"练习场"
  2. 选择"新手练习"
  3. 选择"Web"方向
  4. 开始你的CTF之旅

第四步：了解界面
  题目列表：
    - 题目名称
    - 难度星级
    - 已解决人数
    - 分值

  题目详情：
    - 题目描述
    - 场景链接
    - 提交Flag入口
    - 讨论区
```

### 1.3 Web新手区题目概览

```
【Web新手区常见题型】

类型一：HTTP协议类
  特点：考察HTTP协议基础知识
  题目：
    - 修改请求方法
    - 修改请求头
    - Cookie伪造
    - 状态码理解

类型二：源码泄露类
  特点：需要找到隐藏的源码文件
  题目：
    - .git泄露
    - .svn泄露
    - 备份文件泄露
    - vim交换文件

类型三：信息搜集类
  特点：需要收集各种信息
  题目：
    - 目录扫描
    - 敏感文件发现
    - 注释信息查找
    - robots.txt

类型四：基础注入类
  特点：SQL注入入门题
  题目：
    - 数字型注入
    - 字符型注入
    - 简单绕过

类型五：文件包含类
  特点：考察文件包含漏洞
  题目：
    - 本地文件包含
    - 伪协议使用

类型六：命令执行类
  特点：考察命令执行漏洞
  题目：
    - 简单命令注入
    - 过滤绕过

类型七：编码解码类
  特点：需要各种编码转换
  题目：
    - Base64解码
    - URL解码
    - 多层编码
```

---

## 二、dirsearch工具详解

### 2.1 什么是目录扫描？

```
【通俗易懂的解释】

想象你来到一座神秘的城堡：

  🏰 城堡有很多门：
    - 正门（首页 index.html）
    - 后门（后台 admin.php）
    - 密道（隐藏目录 /secret）
    - 地下室（备份文件 /backup）

  🔍 目录扫描就像：
    - 挨个敲门，看哪些门能打开
    - 找到隐藏的房间
    - 发现秘密通道

在CTF中：
  - 网站有很多目录和文件
  - 有些是公开的（首页、关于我们）
  - 有些是隐藏的（后台、备份、配置）
  - 目录扫描工具帮你找到这些隐藏内容

常见隐藏内容：
  /admin —— 后台管理
  /backup —— 备份文件
  /flag —— flag文件
  /config —— 配置文件
  /test —— 测试页面
  /.git —— Git仓库
  /robots.txt —— 爬虫协议
  /www.zip —— 源码备份
```

### 2.2 dirsearch安装教程

```
【Windows安装步骤】

方法一：直接下载（推荐新手）
  1. 访问 https://github.com/maurosoria/dirsearch
  2. 点击"Code" → "Download ZIP"
  3. 解压到任意目录（如 D:\tools\dirsearch）
  4. 打开命令提示符（cmd）
  5. 进入目录：cd D:\tools\dirsearch
  6. 运行：python dirsearch.py -h

方法二：Git克隆（推荐进阶）
  1. 打开Git Bash
  2. 克隆仓库：
     git clone https://github.com/maurosoria/dirsearch.git
  3. 进入目录：
     cd dirsearch
  4. 安装依赖：
     pip install -r requirements.txt
  5. 运行测试：
     python dirsearch.py -h

【Linux/Kali安装步骤】
  1. 克隆仓库：
     git clone https://github.com/maurosoria/dirsearch.git
  2. 进入目录：
     cd dirsearch
  3. 安装依赖：
     pip3 install -r requirements.txt
  4. 运行测试：
     python3 dirsearch.py -h

【安装验证】
  运行命令：
    python dirsearch.py -h

  如果看到帮助信息，说明安装成功！
```

### 2.3 dirsearch基本使用

```
【基础命令格式】

python dirsearch.py -u <目标URL> -e <扩展名>

参数说明：
  -u, --url：目标网站地址
  -e, --extensions：要扫描的文件扩展名

【实战示例】

示例1：扫描PHP网站
  python dirsearch.py -u http://example.com -e php

  解释：
    - 扫描 http://example.com
    - 重点扫描 .php 文件

示例2：扫描多种扩展名
  python dirsearch.py -u http://example.com -e php,html,txt

  解释：
    - 扫描 .php、.html、.txt 三种文件

示例3：扫描常见备份文件
  python dirsearch.py -u http://example.com -e zip,tar,gz,bak

  解释：
    - 扫描压缩包和备份文件
    - 常用于找源码泄露

示例4：指定线程数（加速）
  python dirsearch.py -u http://example.com -e php -t 30

  解释：
    - 使用30个线程并发扫描
    - 速度更快，但可能触发WAF

示例5：排除特定状态码
  python dirsearch.py -u http://example.com -e php -x 404,403

  解释：
    - 不显示404和403状态码的结果
    - 让输出更干净
```

### 2.4 dirsearch高级用法

```
【高级参数详解】

1. 自定义字典
  python dirsearch.py -u http://example.com -e php -w wordlist.txt

  解释：
    - 使用自己的字典文件
    - 可以针对特定目标定制

2. 递归扫描
  python dirsearch.py -u http://example.com -e php -r

  解释：
    - 发现新目录后继续扫描
    - 更彻底，但耗时更长

3. 设置递归深度
  python dirsearch.py -u http://example.com -e php -r -R 3

  解释：
    - 最多递归3层
    - 避免无限扫描

4. 添加自定义Header
  python dirsearch.py -u http://example.com -e php --header "Cookie: admin=1"

  解释：
    - 添加Cookie绕过登录
    - 扫描需要认证的目录

5. 使用代理
  python dirsearch.py -u http://example.com -e php --proxy http://127.0.0.1:8080

  解释：
    - 通过代理扫描
    - 可以配合Burp使用

6. 保存结果
  python dirsearch.py -u http://example.com -e php -o result.txt

  解释：
    - 保存扫描结果到文件
    - 方便后续分析

7. 静默模式
  python dirsearch.py -u http://example.com -e php --silent

  解释：
    - 只显示找到的结果
    - 不显示进度信息

【常用组合命令】

组合1：快速扫描
  python dirsearch.py -u http://target.com -e php,html,txt -t 50 -x 404

组合2：深度扫描
  python dirsearch.py -u http://target.com -e php -r -R 2 -t 20

组合3：备份文件扫描
  python dirsearch.py -u http://target.com -e zip,tar,gz,bak,old -t 30
```

### 2.5 扫描结果解读

```
【状态码含义】

200 OK
  含义：请求成功，文件存在
  重要性：⭐⭐⭐⭐⭐
  说明：这是我们要找的目标！

301 Moved Permanently
  含义：永久重定向
  重要性：⭐⭐⭐⭐
  说明：可能是目录，需要进一步探索

302 Found
  含义：临时重定向
  重要性：⭐⭐⭐
  说明：可能是登录跳转或其他功能

403 Forbidden
  含义：禁止访问
  重要性：⭐⭐⭐⭐
  说明：文件存在但无权限访问，可能有突破口

404 Not Found
  含义：文件不存在
  重要性：⭐
  说明：可以忽略

500 Internal Server Error
  含义：服务器错误
  重要性：⭐⭐⭐
  说明：可能存在漏洞或配置问题

【扫描结果示例】

[14:32:15] Starting:
[14:32:16] 200 -   2KB - /index.php
[14:32:17] 301 -  178B  - /admin  ->  http://target.com/admin/
[14:32:18] 200 -   5KB - /robots.txt
[14:32:19] 403 -  199B  - /.git/
[14:32:20] 200 -  15KB - /backup.zip
[14:32:21] 200 -   1KB - /flag.txt

结果分析：
  /index.php —— 首页，正常
  /admin —— 后台目录，重要！
  /robots.txt —— 爬虫协议，可能泄露信息
  /.git —— Git泄露，可能有源码
  /backup.zip —— 备份文件，可能有源码
  /flag.txt —— flag文件，直接拿flag！

【重点关注】

优先级排序：
  1. 包含flag的文件（/flag、/flag.txt）
  2. 备份文件（.zip、.bak、.tar.gz）
  3. 源码泄露（.git、.svn）
  4. 后台目录（/admin、/manage）
  5. 配置文件（config.php、web.config）
  6. 敏感文件（robots.txt、phpinfo.php）
```

---

## 三、隐藏目录发现技巧

### 3.1 常见隐藏目录清单

```
【CTF常见隐藏目录/文件】

📁 敏感目录：
  /admin          —— 后台管理
  /administrator —— 后台管理
  /manage        —— 管理页面
  /backend       —— 后端接口
  /api           —— API接口
  /test          —— 测试页面
  /debug         —— 调试页面
  /backup        —— 备份目录
  /old           —— 旧版本
  /temp          —— 临时文件
  /upload        —— 上传目录
  /download      —— 下载目录
  /config        —— 配置目录
  /data          —— 数据目录
  /logs          —— 日志目录
  /secret        —— 秘密目录
  /flag          —— flag目录
  /hidden        —— 隐藏目录

📄 敏感文件：
  /robots.txt           —— 爬虫协议
  /.git/config          —— Git配置
  /.git/HEAD            —— Git头文件
  /.svn/entries        —— SVN条目
  /.DS_Store            —— Mac系统文件
  /www.zip              —— 源码备份
  /web.zip              —— 源码备份
  /backup.zip           —— 备份文件
  /backup.tar.gz        —— 备份文件
  /1.zip                —— 备份文件
  /admin.zip            —— 管理员备份
  /config.php           —— 配置文件
  /config.php.bak       —— 配置备份
  /config.php~          —— Vim备份
  /index.php.bak        —— 首页备份
  /index.php~           —— Vim备份
  /index.php.swp        —— Vim交换文件
  /index.phps           —— PHP源码
  /phpinfo.php          —— PHP信息
  /test.php             —— 测试文件
  /flag                 —— flag文件
  /flag.txt             —— flag文本
  /flag.php             —— flag PHP
  /f1ag                 —— 变形flag
  /fl4g                 —— 变形flag

🔍 源码泄露：
  /.git/                —— Git仓库
  /.svn/                —— SVN仓库
  /.hg/                 —— Mercurial仓库
  /.bzr/                —— Bazaar仓库
  /CVS/                 —— CVS仓库
  /WEB-INF/             —— Java Web配置
  /.env                 —— 环境变量
  /composer.json        —— PHP依赖
  /package.json         —— Node依赖
```

### 3.2 手动探测技巧

```
【手动探测方法】

方法1：查看源代码
  步骤：
    1. 右键网页 → 查看网页源代码
    2. 搜索关键词：
       - flag
       - admin
       - password
       - secret
       - hidden
       - TODO
       - FIXME
       - 注释 <!-- -->

  示例：
    <!-- TODO: remove /admin page before production -->
    <!-- flag is in /secret/flag.txt -->

方法2：查看robots.txt
  步骤：
    1. 访问 http://target.com/robots.txt
    2. 查看Disallow字段
    3. 访问被禁止的目录

  示例：
    User-agent: *
    Disallow: /admin/
    Disallow: /backup/
    Disallow: /flag/

方法3：查看响应头
  步骤：
    1. F12 → 网络 → 刷新页面
    2. 点击第一个请求
    3. 查看响应头

  关注字段：
    Server: Apache/2.4.7 (Ubuntu)
    X-Powered-By: PHP/5.6.0
    Set-Cookie: admin=0

方法4：查看Cookie
  步骤：
    1. F12 → 应用 → Cookie
    2. 查看所有Cookie值
    3. 尝试修改可疑Cookie

  示例：
    admin=0 → 改成 admin=1
    user=guest → 改成 user=admin
    role=member → 改成 role=admin

方法5：目录遍历
  步骤：
    1. 尝试访问常见目录
    2. 观察响应状态码
    3. 记录存在的目录

  示例：
    http://target.com/admin/
    http://target.com/backup/
    http://target.com/test/
    http://target.com/upload/
```

### 3.3 信息搜集综合技巧

```
【信息搜集流程】

第一步：被动信息搜集
  内容：
    - 查看页面源代码
    - 查看robots.txt
    - 查看HTTP响应头
    - 查看Cookie
    - 查看JavaScript文件
    - 查看CSS文件

第二步：主动信息搜集
  内容：
    - 使用dirsearch扫描目录
    - 扫描敏感文件
    - 扫描备份文件
    - 扫描源码泄露

第三步：深入分析
  内容：
    - 分析找到的文件内容
    - 查找更多线索
    - 尝试利用发现的漏洞

【常见信息泄露位置】

1. HTML注释
  <!-- flag{xxx} -->
  <!-- admin password: 123456 -->

2. JavaScript文件
  var flag = "flag{xxx}";
  var api = "/api/v1/secret";

3. CSS文件
  /* flag is in /hidden/flag.txt */

4. robots.txt
  Disallow: /admin/
  Disallow: /flag/

5. 源码备份
  www.zip、web.zip、backup.zip

6. Git泄露
  /.git/config、/.git/HEAD

7. 错误信息
  Fatal error in /var/www/html/config.php

8. 调试信息
  DEBUG=true、SQL query: SELECT...
```

---

## 四、实战题目详解（一）

### 4.1 题目类型：robots.txt

```
【题目特点】

题目描述：
  通常会提示"robots协议"或"爬虫协议"
  或者没有任何提示，需要自己发现

解题思路：
  1. 访问 /robots.txt
  2. 查看Disallow字段
  3. 访问被禁止的目录或文件
  4. 获取flag

【实战示例】

假设题目URL：http://123.45.67.89:8000/

步骤1：访问首页
  看到一个普通页面，没有明显信息

步骤2：查看源代码
  没有发现flag或提示

步骤3：访问robots.txt
  URL: http://123.45.67.89:8000/robots.txt

  内容：
    User-agent: *
    Disallow: /flag_is_here/

步骤4：访问隐藏目录
  URL: http://123.45.67.89:8000/flag_is_here/

  发现flag：flag{r0b0ts_1s_1mp0rt4nt}

【解题技巧】

技巧1：robots.txt是CTF必查项
  几乎每道信息搜集题都要先看robots.txt

技巧2：注意Disallow字段
  Disallow后面就是要隐藏的路径

技巧3：尝试访问Disallow路径
  有时直接就是flag，有时需要继续探索

技巧4：注意大小写
  有时 /Flag 和 /flag 是不同的
```

### 4.2 题目类型：备份文件下载

```
【题目特点】

题目描述：
  可能提示"备份"、"源码泄露"
  或者没有任何提示，需要自己发现

解题思路：
  1. 尝试常见备份文件名
  2. 下载备份文件
  3. 分析文件内容
  4. 找到flag或线索

【实战示例】

假设题目URL：http://123.45.67.89:8000/

步骤1：访问首页
  看到一个登录页面

步骤2：尝试常见备份文件
  http://123.45.67.89:8000/www.zip —— 404
  http://123.45.67.89:8000/web.zip —— 404
  http://123.45.67.89:8000/backup.zip —— 200！下载成功

步骤3：解压备份文件
  得到以下文件：
    index.php
    login.php
    config.php
    flag.php

步骤4：查看flag.php
  内容：
    <?php
    $flag = "flag{b4ckup_f1l3_1s_d4ng3r0us}";
    ?>

【常见备份文件名】

压缩包类：
  www.zip、www.tar.gz、www.rar
  web.zip、web.tar.gz
  backup.zip、backup.tar.gz
  1.zip、2.zip
  admin.zip

备份文件类：
  index.php.bak
  index.php~
  index.php.swp
  index.phps
  config.php.bak

【使用dirsearch扫描】

命令：
  python dirsearch.py -u http://target.com -e zip,tar.gz,bak,swp -t 30

解释：
  - 扫描压缩包和备份文件
  - 30线程加速
```

### 4.3 题目类型：Git泄露

```
【题目特点】

题目描述：
  可能提示"版本控制"、"git"
  或者扫描发现/.git/目录

解题思路：
  1. 扫描发现/.git/目录
  2. 下载Git相关文件
  3. 使用工具恢复源码
  4. 分析源码找flag

【Git泄露原理】

什么是Git？
  - 版本控制系统
  - 记录文件的修改历史
  - 开发者常用工具

为什么会泄露？
  - 开发者忘记删除.git目录
  - 或者配置错误
  - 导致源码可以被下载

.git目录结构：
  .git/
    ├── HEAD        —— 当前分支
    ├── config      —— 配置信息
    ├── objects/    —— 文件内容
    ├── refs/       —— 引用信息
    └── index       —— 暂存区

【实战示例】

假设题目URL：http://123.45.67.89:8000/

步骤1：扫描目录
  python dirsearch.py -u http://123.45.67.89:8000 -e php

  发现：
    [200] /.git/HEAD
    [200] /.git/config

步骤2：确认Git泄露
  访问 http://123.45.67.89:8000/.git/HEAD
  内容：ref: refs/heads/master

  确认存在Git泄露！

步骤3：使用githack工具
  安装：
    git clone https://github.com/lijiejie/GitHack.git
    cd GitHack

  运行：
    python GitHack.py http://123.45.67.89:8000/.git/

步骤4：查看恢复的源码
  在dist目录下找到恢复的文件：
    index.php
    flag.php

  查看flag.php：
    <?php
    $flag = "flag{g1t_l34k_1s_s3r10us}";
    ?>

【Git泄露工具】

工具1：GitHack
  地址：https://github.com/lijiejie/GitHack
  用法：python GitHack.py http://target.com/.git/

工具2：dvcs-ripper
  地址：https://github.com/kost/dvcs-ripper
  用法：rip-git.pl -v -u http://target.com/.git/

工具3：GitExtract
  地址：https://github.com/gabrielshjeff/GitExtract
  用法：python GitExtract.py http://target.com/.git/
```

### 4.4 题目类型：Cookie伪造

```
【题目特点】

题目描述：
  可能提示"身份验证"、"权限"
  或者登录后看到"你不是管理员"

解题思路：
  1. 登录或访问页面
  2. 查看Cookie
  3. 分析Cookie含义
  4. 修改Cookie为管理员
  5. 获取flag

【Cookie基础知识】

什么是Cookie？
  - 存储在浏览器的小数据
  - 用于记录用户状态
  - 比如登录状态、用户身份

Cookie常见字段：
  user=guest        —— 用户名
  admin=0           —— 是否管理员（0否1是）
  role=member       —— 角色
  logged_in=false    —— 是否登录
  PHPSESSID=xxx      —— PHP会话ID

【实战示例】

假设题目URL：http://123.45.67.89:8000/

步骤1：访问首页
  页面显示：
    "欢迎，guest用户"
    "你不是管理员，无法查看flag"

步骤2：查看Cookie
  F12 → 应用 → Cookie

  发现：
    user=guest
    admin=0

步骤3：分析Cookie
  user=guest —— 用户名是guest
  admin=0 —— 管理员标志是0（假）

步骤4：修改Cookie
  方法1：在浏览器中修改
    F12 → 应用 → Cookie
    双击admin，把0改成1
    刷新页面

  方法2：用Burp修改
    抓包 → 修改Cookie: admin=1 → 放行

步骤5：获取flag
  刷新后页面显示：
    "欢迎，admin用户"
    "flag{c00k13_f0rg3ry_1s_3z}"

【Cookie伪造技巧】

技巧1：注意编码
  有些Cookie是Base64编码的
  需要先解码，修改，再编码

技巧2：注意类型
  有些是数字（0/1）
  有些是字符串（guest/admin）
  有些是布尔值（true/false）

技巧3：注意序列化
  PHP序列化：
    a:1:{s:5:"admin";b:1;}
  需要理解序列化格式

技巧4：注意加密
  有些Cookie是加密的
  需要找到解密方法
```

---

## 五、限时解题训练方法

### 5.1 为什么要限时？

```
【限时训练的重要性】

真实比赛环境：
  - CTF比赛时间有限（通常24-48小时）
  - 题目数量多（通常20-30道）
  - 需要快速判断题型
  - 需要快速找到解法

限时训练的好处：
  1. 培养时间意识
     - 知道什么时候该放弃
     - 知道什么时候该看WriteUp

  2. 提高解题效率
     - 减少无效尝试
     - 快速定位问题

  3. 锻炼心理素质
     - 时间压力下保持冷静
     - 快速决策能力

  4. 发现知识盲区
     - 超时的题目就是薄弱点
     - 重点复习这些内容

【推荐时间限制】

简单题：5-10分钟
  - HTTP协议类
  - 简单编码类
  - Cookie伪造类

中等题：15-20分钟
  - 目录扫描类
  - 源码泄露类
  - 简单注入类

困难题：30分钟以上
  - 复杂注入类
  - 代码审计类
  - 组合漏洞类
```

### 5.2 限时训练流程

```
【20分钟解题流程】

第1-3分钟：信息搜集
  动作：
    1. 访问目标URL，查看页面
    2. 查看源代码（F12）
    3. 访问robots.txt
    4. 查看HTTP响应头
    5. 查看Cookie

  目标：
    - 发现任何可疑信息
    - 确定题目类型

第4-8分钟：目录扫描
  动作：
    1. 启动dirsearch扫描
    2. 观察扫描结果
    3. 访问发现的敏感目录

  命令：
    python dirsearch.py -u http://target.com -e php,html,txt,zip -t 30 -x 404

  目标：
    - 找到隐藏文件或目录
    - 找到备份文件

第9-15分钟：深入分析
  动作：
    1. 分析找到的文件
    2. 尝试各种攻击方式
    3. 修改请求参数
    4. 修改Cookie

  目标：
    - 找到漏洞入口
    - 构造Payload

第16-20分钟：最后冲刺
  动作：
    1. 如果有思路，继续尝试
    2. 如果完全没思路，准备看WriteUp
    3. 记录卡住的点

  目标：
    - 获取flag
    - 或者明确卡在哪里

【超时处理】

情况1：有思路但超时
  处理：
    - 继续尝试5-10分钟
    - 如果还是不行，看WriteUp
    - 记录自己的思路和WriteUp的差距

情况2：完全没思路
  处理：
    - 直接看WriteUp
    - 学习解题思路
    - 重新做一遍
    - 记录到错题本

情况3：卡在某个步骤
  处理：
    - 记录卡住的步骤
    - 看WriteUp对应部分
    - 理解后继续
    - 完成后重新做一遍
```

### 5.3 WriteUp阅读方法

```
【正确阅读WriteUp】

错误方法：
  ❌ 直接复制Payload拿flag
  ❌ 不理解原理
  ❌ 做完就忘

正确方法：
  ✅ 先自己尝试20分钟
  ✅ 卡住后看WriteUp
  ✅ 理解每一步的原理
  ✅ 关掉WriteUp重新做
  ✅ 记录关键知识点

【WriteUp阅读步骤】

步骤1：看解题思路
  - 作者发现了什么？
  - 用了什么方法？
  - 为什么想到这个方法？

步骤2：看关键步骤
  - 每一步做了什么？
  - 用了什么工具？
  - 构造了什么Payload？

步骤3：看关键代码
  - Payload是什么？
  - 为什么这样构造？
  - 有没有其他方法？

步骤4：自己重做
  - 关掉WriteUp
  - 自己重新做一遍
  - 验证是否真正理解

步骤5：记录总结
  - 记录到笔记
  - 记录到错题本
  - 总结解题套路

【WriteUp笔记模板】

┌─────────────────────────────────┐
│ 题目名称：XXX                    │
│ 题目类型：目录扫描/Git泄露/...   │
│ 难度：⭐⭐⭐                      │
├─────────────────────────────────┤
│ 我的思路：                       │
│   1. 访问首页                    │
│   2. 扫描目录                    │
│   3. 发现.git目录               │
│   4. 卡在：不知道怎么恢复源码    │
├─────────────────────────────────┤
│ WriteUp解法：                    │
│   1. 扫描发现.git目录           │
│   2. 使用GitHack工具恢复源码    │
│   3. 在flag.php中找到flag       │
├─────────────────────────────────┤
│ 关键知识点：                     │
│   - Git泄露检测方法             │
│   - GitHack工具使用             │
│   - 常见源码泄露位置             │
├─────────────────────────────────┤
│ 关键Payload：                    │
│   python GitHack.py             │
│   http://target.com/.git/       │
├─────────────────────────────────┤
│ 是否重做：✓                      │
│ 重做时间：XX分钟                │
└─────────────────────────────────┘
```

---

## 六、常见问题FAQ

### Q1: dirsearch扫描太慢怎么办？

```
回答：
  可以通过以下方法加速：

方法1：增加线程数
  python dirsearch.py -u http://target.com -e php -t 50
  默认是20线程，可以增加到50甚至100

方法2：减少扩展名
  python dirsearch.py -u http://target.com -e php
  只扫描php文件，不扫描html、txt等

方法3：排除404
  python dirsearch.py -u http://target.com -e php -x 404
  不显示404结果，减少输出

方法4：使用更小的字典
  python dirsearch.py -u http://target.com -e php -w small.txt
  使用精简字典

方法5：设置超时
  python dirsearch.py -u http://target.com -e php --timeout 5
  减少超时等待时间

注意：
  - 线程太多可能触发WAF
  - 建议先用默认设置，再逐步加速
```

### Q2: 扫描不到任何结果怎么办？

```
回答：
  可能的原因和解决方法：

原因1：目标网站有防护
  现象：扫描后全是403或404
  解决：
    - 降低扫描速度
    - 添加延时：--delay 1
    - 使用代理绕过

原因2：字典不合适
  现象：扫描结果很少
  解决：
    - 使用更大的字典
    - 添加常见目录名
    - 添加备份文件扩展名

原因3：目标不是Web应用
  现象：扫描无响应
  解决：
    - 确认URL是否正确
    - 确认端口是否开放
    - 尝试其他端口

原因4：网络问题
  现象：连接超时
  解决：
    - 检查网络连接
    - 尝试使用代理
    - 增加超时时间

排查步骤：
  1. 先用浏览器访问目标URL
  2. 确认能正常访问
  3. 再运行dirsearch
```

### Q3: GitHack恢复失败怎么办？

```
回答：
  可能的原因和解决方法：

原因1：.git目录不完整
  现象：恢复失败或文件不完整
  解决：
    - 手动下载.git目录
    - 使用其他工具尝试

原因2：网络问题
  现象：下载中断
  解决：
    - 检查网络连接
    - 使用代理

原因3：权限问题
  现象：403 Forbidden
  解决：
    - 尝试访问具体文件
    - 如 /.git/HEAD、/.git/config

手动恢复方法：
  1. 下载.git/objects目录
  2. 使用git命令恢复
     git clone http://target.com/.git/
  3. 或者使用dvcs-ripper工具

替代工具：
  - dvcs-ripper
  - GitExtract
  - git-dumper
```

### Q4: Cookie修改后没反应怎么办？

```
回答：
  可能的原因和解决方法：

原因1：Cookie有签名
  现象：修改后报错或无变化
  解决：
    - 查看是否有签名Cookie
    - 如signature、hash等
    - 需要找到签名算法

原因2：Cookie有加密
  现象：Cookie是乱码
  解决：
    - 尝试Base64解码
    - 尝试URL解码
    - 尝试其他编码

原因3：服务端验证
  现象：修改后跳转登录
  解决：
    - Cookie可能与Session绑定
    - 需要找到其他漏洞

原因4：修改位置不对
  现象：改了但没生效
  解决：
    - 确认Cookie名称正确
    - 确认修改后刷新页面
    - 清除浏览器缓存重试

调试方法：
  1. 用Burp抓包
  2. 查看完整的Cookie
  3. 分析Cookie结构
  4. 尝试不同修改方式
```

### Q5: 如何判断题目类型？

```
回答：
  可以通过以下特征判断：

HTTP协议类：
  - 页面提示请求方法
  - 提示修改请求头
  - 提示Cookie相关

目录扫描类：
  - 页面内容很少
  - 提示"找找看"、"隐藏"
  - 没有明显漏洞

源码泄露类：
  - 扫描发现.git目录
  - 扫描发现备份文件
  - 提示"版本控制"

编码解码类：
  - 页面有乱码或编码字符串
  - 提示"解码"、"加密"

注入类：
  - 有输入框
  - URL有参数
  - 提示"数据库"

文件包含类：
  - URL有file参数
  - 提示"文件"、"读取"

判断流程：
  1. 先看页面内容和提示
  2. 查看源代码
  3. 查看URL参数
  4. 扫描目录
  5. 尝试常见攻击
```

---

## 七、今日总结

### 7.1 知识点回顾

```
【今日核心知识点】

✅ 攻防世界平台
  - 平台介绍与注册
  - Web新手区题型分类
  - 题目特点和解题思路

✅ dirsearch工具
  - 安装与配置
  - 基本使用方法
  - 高级参数配置
  - 结果解读

✅ 隐藏目录发现
  - 常见敏感目录清单
  - 手动探测技巧
  - 信息搜集流程

✅ 实战题型
  - robots.txt题目
  - 备份文件下载
  - Git泄露利用
  - Cookie伪造

✅ 限时训练
  - 20分钟解题流程
  - 超时处理方法
  - WriteUp阅读技巧
```

### 7.2 今日作业

```
【必做作业】

1. 完成攻防世界Web新手区至少5道题
   要求：
   - 每题限时20分钟
   - 记录解题过程
   - 超时看WriteUp学习

2. 安装并使用dirsearch
   要求：
   - 成功安装dirsearch
   - 扫描至少3个目标
   - 记录扫描结果

3. 整理常见敏感目录清单
   要求：
   - 整理至少30个常见目录
   - 整理至少20个常见文件
   - 保存到笔记中

【选做作业】

1. 安装GitHack工具
   - 测试Git泄露恢复
   - 记录使用方法

2. 尝试更多Web新手区题目
   - 完成更多题目
   - 挑战中等难度题

3. 整理错题本
   - 记录今天卡住的题目
   - 分析卡住原因
   - 写下正确解法
```

### 7.3 明日预告

```
【Day 32：攻防世界Web新手区实战（下）】

学习内容：
  - 更多Web新手区题目实战
  - SQL注入类题目
  - 文件包含类题目
  - 命令执行类题目
  - 综合题目挑战

准备工作：
  - 复习SQL注入知识
  - 复习文件包含知识
  - 复习命令执行知识
  - 准备好知识卡片
```

---

## 八、笔记模板

```
Day 31 学习笔记
====================

日期：____年__月__日
学习时长：___小时

一、攻防世界平台
----------------
1. 平台地址：
   
2. 已完成题目：
   
3. 题目类型统计：
   

二、dirsearch工具
----------------
1. 安装路径：
   
2. 常用命令：
   
3. 扫描结果记录：
   

三、隐藏目录发现
----------------
1. 常见敏感目录：
   
2. 常见敏感文件：
   
3. 手动探测方法：
   

四、实战题目记录
----------------
题目1：
  名称：
  类型：
  解题思路：
  关键步骤：
  Flag：
  用时：

题目2：
  名称：
  类型：
  解题思路：
  关键步骤：
  Flag：
  用时：

题目3：
  名称：
  类型：
  解题思路：
  关键步骤：
  Flag：
  用时：


五、错题复盘
------------
题目：
  卡在哪里：
  正确解法：
  学到的知识：


六、工具使用记录
----------------
dirsearch：
  扫描目标：
  发现结果：
  
GitHack：
  使用场景：
  恢复结果：


七、自我评价
------------
理解程度：⭐⭐⭐⭐⭐
动手能力：⭐⭐⭐⭐⭐
完成情况：⭐⭐⭐⭐⭐

八、明日计划
------------
1. 
2. 
3. 
```

---

**恭喜你完成Day 31的学习！继续加油！** 🎉