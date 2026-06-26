# 第三章 Suricata规则编写实战

> 第3章 | 55页

3.1 Suricata规则结构

一条完整的Suricata规则由以下几部分组成：
- 动作（Action）：pass、drop、reject、alert
- 协议（Protocol）：tcp、udp、icmp、http等
- 源/目的地址：IP地址、IP段、any
- 源/目的端口：端口号、端口范围、any
- 方向（Direction）：-> 单向、<> 双向
- 规则选项（Rule Options）：msg、sid、content、pcre等

3.2 基础规则选项

- msg：规则描述信息
- sid：规则唯一标识
- rev：规则版本号
- classtype：规则分类
- priority：优先级
- reference：参考链接

3.3 内容匹配选项

- content：内容匹配
- nocase：忽略大小写
- depth：匹配深度
- offset：匹配偏移
- distance：两次匹配间距
- within：匹配范围限制
- pcre：正则表达式匹配

3.4 高级规则选项

- flow：流状态匹配
- uricontent：URI内容匹配
- dsize：数据包大小匹配
- flags：TCP标志位匹配
- itype：ICMP类型匹配
- byte_test：字节测试
- byte_jump：字节跳转

3.5 实战：编写SQL注入检测规则

示例规则：
alert tcp any any -> any 80 (msg:"SQL Injection Attempt"; flow:to_server,established; uricontent:"SELECT"; nocase; uricontent:"FROM"; nocase; distance:0; classtype:web-application-attack; sid:1000001; rev:1;)
