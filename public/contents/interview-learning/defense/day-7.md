# Day 7：Web应用安全防护
> [Web安全面试核心] WAF工作原理/绕过技巧/RASP/Webshell检测
## 核心知识点
### Q: WAF的核心检测技术有哪些？如何绕过WAF？
WAF四代检测技术：①正则/黑名单(初代，易绕过) ②语义分析(语法树解析SQL/XSS) ③机器学习模型(历史行为建模) ④RASP(运行时应用自保护，嵌入应用内部)

常见绕过：编码混淆(HTML实体/URL/Unicode混用)、大小写变换(<sCrIpT>)、协议变换(jAvAsCrIpT:)、利用WAF白名单域名重定向、HTTP参数污染(HPP)、分块传输(chunked encoding乱序)、HTTP走私(前后端解析不一致)、用JSON替代Form提交

面试金句：WAF是纵深防御的一层，不是银弹。能从绕过角度分析说明你理解战斗的全貌
### Q: 什么是RASP(Runtime Application Self-Protection)？和传统WAF有什么不同？
RASP是嵌入应用内部的Agent(如Java Agent/JVM TI)，在运行时拦截每个API调用(I/O/网络/SQL/命令执行)，监控上下文而非流量。

WAF vs RASP：WAF看HTTP流量包，RASP看应用内部执行；WAF无法感知加密后的攻击，RASP在解密后拦截；WAF可能误报，RASP有应用上下文判断更精准；但RASP对性能有影响(每API调用都要检查)且如果Agent被卸载则防护全失
### Q: SQL注入的WAF绕过技巧有哪些？
经典绕过手法：①注释截断(`/**/`代替空格) ②大小写混用(`UnIoN SeLeCt`) ③双写(`UNIunionON`) ④内联注释(`/*!50000union*/`) ⑤等价函数替换(locate代替instr) ⑥宽字节注入(GBK编码中%df%27吃掉转义符) ⑦HTTP参数分割 ⑧分块传输+hex编码

面试强调：绕过不是目的，理解WAF的检测逻辑——基于正则的WAF容易绕过，基于语义的WAF需要构造逻辑正确的但形式异常的语句
### Q: 请描述Webshell检测的方法论
静态检测：特征码匹配(如常见webshell函数eval/assert/system)、文件哈希黑名单、文件创建时间异常、扩展名与内容不匹配(.jpg文件含<?php)
动态检测：进程行为(Web进程fork了bash/perl/python子进程)、网络连接(Web进程对外发起TCP连接→反弹shell信号)、文件完整性监控(tripwire/inotify监控Web目录变更)
日志检测：Web访问日志中POST请求比例异常、单一URI被反复访问、User-Agent异常(webshell客户端)
高级：基于ML的PHP/ASP/JSP AST语法树分析→区分正常代码和webshell的语义差异
## 面试陷阱
- 说WAF已经过时——RASP/WAAP(Web应用和API保护)是演进方向但WAF仍是基础层
- WAF绕过不是目的——面试官想看的是你理解WAF局限性的深度，列举绕过手法后要接上防御建议
- Webshell检测只依赖特征码——现代webshell(AntSword/冰蝎/哥斯拉)使用加密流量和内存执行，特征码基本无效

## 今日检测
1. 用ModSecurity配置自定义WAF规则→测试SQL注入/XSS防护
2. 尝试用分块传输绕过本地WAF
3. 用Burp的WAF Bypass插件测试绕过方法
