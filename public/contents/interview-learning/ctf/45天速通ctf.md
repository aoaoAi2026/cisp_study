40天CTF黄金入门计划 · 精修执行版（Web+Misc）

    总学时：80小时（工作日1.5h/天 + 周末4h/天）
    核心方法论：“3次击穿法”——每类漏洞必须经历“看教程抄Payload → 开环境打题 → 关笔记默写”三个循环，才算真正掌握。
    最终交付物：你自己的“CTF速查笔记本”（推荐Notion或本地Markdown），包含50+条Payload和20道典型错题复盘。

⚙️ 第0天（准备日）：环境装配（必做，不占40天名额）
工具	作用	安装/配置指令（Win/Mac通用）
Burp Suite Community	抓包改包	官网下载，安装后浏览器代理设为 127.0.0.1:8080
Python 3	写爆破脚本	官网下载，安装时勾选“Add to PATH”
010 Editor（或WinHex）	十六进制改文件头	下载试用版即可
Wireshark	分析流量包	安装时勾选“Npcap”组件
StegSolve	图片LSB隐写	下载jar包，双击运行（需Java环境）
常用浏览器	Chrome/Firefox	必须装SwitchyOmega插件，一键切换Burp代理

验收标准：Burp能抓到百度首页的HTTPS包（能看到乱码变明文），算环境通过。
📅 第一周：浏览器F12裸奔训练（Day 1-7）

    本周目标：禁用Burp，仅靠浏览器开发者工具解出CTFHub“HTTP协议”全模块。
    周末加练：周六日每天多花2小时，把F12所有面板（元素/网络/源代码/应用）点一遍。

    Day 1（1.5h）：F12网络面板（Network）深度拆解。

        动作：打开CTFHub「HTTP协议-请求方法」，F12→网络，勾选“保留日志”。刷新，点击第一个请求，看“标头”里的Request Method和Status Code。

        卡住急救：如果看不到请求，检查是否开了广告拦截插件（关掉）。

        输出：截图请求头，标注出Host、User-Agent、Referer三个字段。

    Day 2（1.5h）：GET与POST手搓战。

        动作：F12→网络→找到请求右键→“以Fetch方式重新发送”或“编辑并重新发送”，把GET改成POST，加body参数。完成CTFHub「POST请求」。

        输出：记录下curl -X POST -d "key=value" URL这条命令（以后常考）。

    Day 3（1.5h）：Cookie越权。

        动作：F12→应用（Application）→存储→Cookie，双击修改值。CTFHub「Cookie」题，把admin=0改成admin=1，刷新拿Flag。

        卡住急救：改完没反应？清空浏览器缓存（Ctrl+Shift+Del）再试。

    Day 4（1.5h）：状态码与跳转。

        动作：CTFHub「302跳转」，F12必须勾选“保留日志”，否则跳转后包就没了。在响应头里找Location字段拿Flag。

        输出：抄下常见状态码含义（200/302/403/404/500）。

    Day 5（1.5h）：UA伪装与Referer防盗链。

        动作：CTFHub「User-Agent」，把UA改成iPhone的（百度搜“iPhone UA字符串”）。「Referer」题，把来源改成www.google.com。

        输出：保存两个常用UA（PC和手机）到笔记。

    Day 6（周末·4h）：CTFHub HTTP协议模块清关。

        动作：重做该模块全部8道题，要求每题5分钟内完成。超时的题标记为“红牌”，晚上专门复盘。

        输出：整理“F12修改请求头的5种姿势”思维导图。

    Day 7（周末·4h）：休息+预习。

        动作：不敲代码，去B站搜“Burp Suite入门教程”，看前30分钟，了解Proxy和Repeater长什么样。

📅 第二周：Burp肌肉记忆（Day 8-14）

    本周目标：Burp操作达到“盲打”水平，闭着眼都能把包从Proxy送到Repeater。

    Day 8（1.5h）：Proxy抓包与CA证书。

        动作：配置SwitchyOmega代理。抓百度，若出现“证书无效”，按Burp内置CA证书导入流程（百度“Burp导入CA证书”照着做）。

        卡住急救：抓不到HTTPS？一定是证书没装好，这是本周唯一可能劝退的点，务必耐心搞定。

    Day 9（1.5h）：Repeater（重放器）核心操作。

        动作：随便抓一个GET包，右键→Send to Repeater。修改URL里的参数（如?id=1改成?id=2），点Go，看响应变化。

        输出：截一张Repeater界面的图，标注“请求区”和“响应区”。

    Day 10（1.5h）：Decoder（解码器）三板斧。

        动作：找一道“先Base64再URL编码”的题（CTFHub有）。把密文贴进Decoder，先点“Decode as URL”，再点“Decode as Base64”。

        输出：总结“看到%先URL解，看到末尾=先Base64解”的铁律。

    Day 11（1.5h）：Intruder（爆破器）初次爆破。

        动作：CTFHub「基础认证」。发送到Intruder，选Sniper模式，加载Burp自带的/usr/share/wordlists/directory-list-2.3-small.txt（没有就下载“SecLists”）。

        卡住急救：爆破完没找到正确密码？看响应包长度（Length）排序，长度异常的往往是正确答案。

    Day 12（1.5h）：Burp组合拳训练。

        动作：找一道需要“抓包→改Cookie→重放”的混合题，全程只用Burp，不切浏览器。

        输出：记录自己的操作路径（例如：Proxy→Intercept→Forward→History→Send to Repeater）。

    Day 13（周末·4h）：Burp专项闯关。

        动作：去Bugku CTF“Web”新手区，挑3道题，强制全程用Burp，禁止用F12。

        输出：整理Burp常用快捷键（Ctrl+I送Intruder，Ctrl+R送Repeater）。

    Day 14（周末·4h）：第一、二周总复盘。

        动作：白纸默写Burp四个核心模块（Proxy/Repeater/Decoder/Intruder）的图标颜色和用途。默不出，下周每天加练10分钟。

📅 第三周：SQL注入攻坚战（Day 15-22）

    本周目标：彻底吃透数字型、字符型、报错注入、布尔盲注。不碰sqlmap，纯手注。

    Day 15（1.5h）：数字型与闭合方式。

        动作：CTFHub「整数型注入」。输入?id=1'看报错。再输入?id=1 and 1=1和?id=1 and 1=2对比回显。

        核心指令：记住万能密码模板 admin' or 1=1#（注意#要URL编码为%23）。

        输出：笔记写下“数字型不需要引号，字符型需要单引号闭合”。

    Day 16（1.5h）：order by判列数。

        动作：输入?id=1 order by 1一直试到order by 5报错，说明列数是4。

        卡住急救：如果order by被过滤，试试group by。

        输出：抄写“判断列数的标准流程”到笔记。

    Day 17（1.5h）：union select联合查询。

        动作：构造?id=-1 union select 1,2,3,4（用负号让前面查询为空），看回显的2和3位置，这是你的“数据出口”。

        输出：截图标注回显位置。

    Day 18（1.5h）：information_schema实战。

        动作：查库名 union select 1,group_concat(schema_name),3,4 from information_schema.schemata。

        硬指标：今天必须拿到当前数据库名，否则Day19重来。

    Day 19（1.5h）：爆表名和字段名。

        动作：union select 1,group_concat(table_name),3,4 from information_schema.tables where table_schema='库名'。

        输出：把查表名和字段名的两条语句抄写5遍，形成肌肉记忆。

    Day 20（1.5h）：报错注入。

        动作：利用updatexml(1,concat(0x7e,(select database()),0x7e),1)报错出数据库名。

        卡住急救：updatexml长度有限制，记得用substr截断。

        输出：记录0x7e是~的十六进制，用来标记边界。

    Day 21（周末·4h）：盲注突破（布尔+时间）。

        动作：CTFHub「布尔盲注」看Length列判断真假；「时间盲注」用sleep(5)配合if。

        输出：整理“盲注三件套”——length()、substr()、ascii()。

    Day 22（周末·4h）：第三周复盘（闭卷默写）。

        动作：关掉所有笔记，在记事本里敲出完整的一条SQL注入链（查库→表→字段→数据）。敲不出来，下周继续练，不往后走。

📅 第四周：文件包含+命令执行+入门Misc（Day 23-30）

    本周目标：拿下LFI/RCE的5个高频Payload，同时Misc开始赚外快。

    Day 23（1.5h）：LFI本地包含。

        动作：CTFHub「文件包含」，输入?file=../../../../etc/passwd，拿到用户列表。

        核心指令：php://filter/convert.base64-encode/resource=index.php 读取源码（必背！）。

    Day 24（1.5h）：伪协议进阶。

        动作：data://text/plain,<?php system('ls');?> 执行系统命令。

        输出：笔记归档“文件包含5大伪协议”（file、php、data、zip、http）。

    Day 25（1.5h）：路径绕过与编码绕过。

        动作：遇到过滤../，试....//、..././，或URL编码%2e%2e%2f。

    Day 26（1.5h）：命令执行（RCE）入门。

        动作：CTFHub「命令注入」，输入127.0.0.1; ls 和 127.0.0.1; cat flag。

        卡住急救：分不清|和||？记口诀：“一个竖线只管传，两个竖线前面错才管”。

    Day 27（1.5h）：RCE空格与黑名单绕过。

        动作：空格用$IFS$9替换；黑名单用a=fl;b=ag; cat $a$b变量拼接。

        输出：整理“命令执行绕过8法”速查表。

    Day 28（1.5h）：Misc文件头修复。

        动作：下载一个PNG图片，用010 Editor打开，把前4字节改成89 50 4E 47。

        输出：记录常见文件头（JPEG=FF D8 FF，ZIP=50 4B 03 04）。

    Day 29（周末·4h）：流量包分析。

        动作：Wireshark打开pcap，右键“追踪流”→“TCP流”，在HEX+ASCII视图里搜flag。CTFHub「流量分析」完成2题。

    Day 30（周末·4h）：第四周总复盘。

        动作：把文件包含和命令执行的Payload做成实体小卡片（或手机备忘录），随身背。

📅 第五周：攻防世界闯关（Day 31-36）

    本周目标：从“练习模式”切换到“比赛模式”，练读题速度和心理素质。

    Day 31（1.5h）：攻防世界Web新手区1-3题。

        规则：每题限时20分钟，超时直接看官方WriteUp。

        输出：抄下WriteUp里的Payload，标注“我卡在了哪一步”。

    Day 32（1.5h）：攻防世界Web新手区4-6题。

        重点：练习用dirsearch扫隐藏目录（如/flag、/backup、/www.zip）。

    Day 33（1.5h）：攻防世界Misc新手区1-3题。

        重点：LSB隐写用StegSolve的“Data Extract”提取；音频隐写看频谱图（Audacity）。

    Day 34（1.5h）：CTFshow“入门题”随机抽3道。

        心态建设：这平台题目偏难，做不出很正常。核心任务是看懂答案，把预期解贴进笔记。

    Day 35（周末·4h）：攻防世界新手区全量通关。

        动作：把该区所有Web+Misc题再过一遍，确保每题都见过答案。

    Day 36（周末·4h）：第五周复盘。

        动作：统计攻防世界独立完成率。如果低于50%，Day37-39原地补课，不推进。

📅 第六周：模拟赛+毕业答辩（Day 37-40）

    本周目标：全真模拟，验收80小时成果。

    Day 37（1.5h）：BUUCTF随机3道Web简单题。

        规则：允许百度语法，不允许搜WriteUp。硬扛2小时。

    Day 38（1.5h）：BUUCTF随机3道Misc简单题。

        规则：同上，限时2小时。

    Day 39（周末·4h）：全真模拟赛（毕业考）。

        动作：打开攻防世界“新手练习场”，随机抽Web×4 + Misc×3。

        计时：4小时倒计时（模拟真实比赛）。开Burp，开百度，严禁看WriteUp。

        验收：能做对 ≥ 4题（60%），颁发给自己“黄金段位”结业证。

    Day 40（周末·4h）：终极复盘与出征。

        白纸默写：SQL查库语句、文件包含伪协议、命令执行空格绕过、LSB提取命令、Burp爆破配置。

        错题重做：选40天里标记“红牌”的5道错题，再做一遍。

        最后一步：登录“CTFshow”或“Bugku”，报名最近一场周赛。去真实战场打一次，这40天才算闭环。

🆘 全周期卡住急救总纲（打印贴墙）
卡住场景	立即执行
Burp抓不到包	检查代理端口（8080），检查SwitchyOmega是否切到代理模式
SQL注入无回显	试时间盲注sleep(5)，看浏览器转圈圈
文件包含读不到文件	试php://filter读源码，不要直接读.txt
命令执行没输出	试;ls /或||ls，确认是哪种管道符
Misc图片打不开	010 Editor看文件头，缺啥补啥
心态彻底爆炸	今天关机，去B站看“CTF比赛精彩集锦”，找回初心
📒 每日三行复盘（强制执行）

每天睡前，不管多晚，在笔记里写：

    今日战果：解出__道题，学会__新Payload。

    今日踩坑：______（例如：忘了URL编码#号）。

    明日攻坚：______（例如：必须搞懂布尔盲注的Length列）。