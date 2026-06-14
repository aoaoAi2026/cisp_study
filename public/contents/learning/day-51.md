# Day 51：SQL注入深入

> **所属周**：Week 8 — 应用安全 · **主题**：SQL注入进阶技术与防御

---

## 📑 目录

1. [SQL注入分类全景](#一sql注入分类全景)
2. [盲注技术深度解析](#二盲注技术深度解析)
3. [二次注入](#三二次注入)
4. [WAF绕过技术](#四waf绕过技术)
5. [NoSQL注入](#五nosql注入)
6. [SQL注入防御体系](#六sql注入防御体系)
7. [现实案例分析](#七现实案例分析)
8. [CISP考试速查](#cisp考试速查)
9. [自检清单](#自检清单)

---

## 一、SQL注入分类全景

```
SQL注入攻击分类：

                    ┌─────────────┐
                    │  SQL注入     │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼──────┐ ┌─────▼─────┐ ┌───────▼───────┐
    │  带内注入    │ │  盲注      │ │   带外注入    │
    │ (In-Band)   │ │ (Blind)   │ │ (Out-of-Band) │
    ├─────────────┤ ├───────────┤ ├───────────────┤
    │· Union注入  │ │· Boolean  │ │· DNS外带      │
    │· 错误注入   │ │· Time-based│ │· HTTP外带     │
    └─────────────┘ └───────────┘ └───────────────┘

Union注入：结果回显在页面 → 最直观
错误注入：错误信息回显 → 最方便
Boolean盲注：页面行为差异(真/假) → 需要推断
Time盲注：响应时间差异 → 最慢但最隐蔽
```

---

## 二、盲注技术深度解析

### 2.1 Boolean盲注

```
Boolean盲注原理：通过页面返回的差异逐位猜测数据

示例：判断用户名

  admin' AND 1=1 --  → 页面正常显示
  admin' AND 1=2 --  → 页面异常显示（无数据）

确认存在注入后，逐字符猜解：

  # 猜数据库名第一个字符
  admin' AND SUBSTRING((SELECT database()),1,1)='a' --
  admin' AND SUBSTRING((SELECT database()),1,1)='b' --
  ...遍历到 'm' → 页面正常！第一个字符是'm'
  
  # 猜表名
  admin' AND SUBSTRING((SELECT table_name FROM 
  information_schema.tables WHERE table_schema=database() 
  LIMIT 0,1),1,1)>'m' --

效率提升：二分查找
  ASCII(SUBSTRING((...),1,1)) > 77 → 缩小范围
  → 每个字符从256次降为log₂(256) = 8次
```

### 2.2 Time-based盲注

```
基于时间的盲注：利用数据库延迟函数判断条件

  MySQL: SLEEP(5), BENCHMARK(5000000,MD5('test'))
  PostgreSQL: pg_sleep(5)
  SQL Server: WAITFOR DELAY '0:0:5'
  Oracle: DBMS_LOCK.SLEEP(5)

攻击示例：
  admin' AND IF(SUBSTRING((SELECT database()),1,1)='m',
              SLEEP(5), 0) --
  
  如果数据库名首字符是'm' → 页面延迟5秒返回
  如果数据库名首字符不是'm' → 页面立即返回

逐字符猜解完整数据库名 → 表名 → 列名 → 数据
```

### 2.3 盲注自动化

```
手工盲注效率太低，使用工具：

SQLMap盲注模式：
  --technique=B  (Boolean盲注)
  --technique=T  (Time-based盲注)
  
  自动枚举：
  sqlmap -u "http://target/login.php" --data="user=admin&pass=123" 
         -p user --technique=BT --dbs

手工辅助技巧：
  · 使用if-then条件
  · 字符范围二分法
  · 批量读取长度优化
```

---

## 三、二次注入

### 3.1 攻击原理

```
二次注入 (Second-Order SQL Injection)：

第一次请求(注册/存储)：
  用户注册用户名: admin' -- 
  INSERT INTO users (username) VALUES ('admin'' -- ')
  → 经过转义，安全存储：admin' -- 

第二次请求(查询/使用)：
  UPDATE users SET password='xxx' WHERE username='admin' -- '
  → 从数据库取出username='admin' -- '
  → 拼接到SQL语句时，没有再次转义！
  → -- 注释掉了后面的条件
  → WHERE条件变为：username='admin'
  → 所有用户名为admin的用户密码都被修改！

核心问题：
  存储时转义了 → 取出时认为是"安全数据" → 不再转义就拼SQL
```

### 3.2 防御二次注入

```
✅ 统一参数化查询（所有SQL操作使用参数化）
✅ 输入验证+输出编码（不只依赖转义）
✅ 最小权限原则（应用账户降权）
✅ 存储过程传参（不要拼接SQL字符串）

错误做法：
  ❌ 只在输入时转义一次就认为安全
  ❌ 信任从数据库取出的"已转义"数据
```

---

## 四、WAF绕过技术

### 4.1 常见绕过技术

```
① 大小写混合：
   SeLeCt → 绕过简单关键字匹配

② 双写绕过：
   selselectect → WAF删除select → 剩下的形成select

③ 注释插入：
   SEL/**/ECT → 注释绕过关键字匹配
   UNION/**/SELECT → 内联注释

④ 编码绕过：
   URL编码: %53%45%4C%45%43%54
   双重URL编码: %25%35%33...
   Unicode编码: \u0053\u0045...
   Hex编码: 0x53454C454354

⑤ 等价函数替换：
   substring → mid / substr / left
   sleep → benchmark (MySQL)
   @@version → version()

⑥ 空白符替换：
   空格 → /**/ → %0a%0d → %0b → %a0 → +
   
⑦ HTTP参数污染(HPP)：
   ?id=1&id=2 UNION SELECT... 
   → WAF检查第一个id，应用使用第二个id

⑧ 分块传输编码：
   将恶意请求分片传输 → WAF可能不重组
```

### 4.2 WAF识别与测试

```
识别WAF：
  · 发送恶意请求观察响应差异
  · 使用wafw00f工具
  · 错误页面特征

测试WAF规则覆盖：
  · 基本测试：' OR '1'='1
  · 变化测试：改变大小写/编码/注释
  · 边界测试：超长注入串

绕过原则：
  理解WAF规则逻辑 → 寻找规则未覆盖的变体
  而不是盲目尝试所有绕过技巧
```

---

## 五、NoSQL注入

### 5.1 MongoDB注入

```
关系型SQL注入：                   NoSQL注入：
SELECT * FROM users              db.users.find({
WHERE username='$user'             username: $user,
AND password='$pass'               password: $pass
                                  })

注入示例：
  username[$ne]=x&password[$ne]=x
  
  解析为：
  db.users.find({
    username: {$ne: "x"},
    password: {$ne: "x"}
  })
  
  → $ne = 不等于 → 永远为真！→ 绕过认证

其他NoSQL操作符注入：
  $gt (大于), $lt (小于)
  $regex (正则匹配) → admin' || '1'=='1 在PHP中
  $where → JavaScript注入
```

### 5.2 NoSQL防御

```
✅ 使用ODM/ORM提供的数据验证（Mongoose, Morphia）
✅ 类型检查：确保$user是字符串而非对象
✅ mongo-sanitize: 过滤$前缀的键
✅ 输入净化：清理特殊操作符
✅ 永远不要直接传入用户输入的查询对象
```

---

## 六、SQL注入防御体系

### 6.1 防御层次

```
纵深防御（多层防线）：

Layer 1 — 代码层
  ✅ 参数化查询/预编译语句（PreparedStatement）
  ✅ ORM安全使用
  ✅ 存储过程（参数化调用）

Layer 2 — 输入层
  ✅ 输入验证：类型+长度+格式白名单
  ✅ 输入过滤：特殊字符

Layer 3 — 数据库层
  ✅ 最小权限原则（应用账户仅需SELECT/INSERT）
  ✅ 禁用危险功能（xp_cmdshell, LOAD_FILE等）
  ✅ 数据库账户不使用root/sa

Layer 4 — 架构层
  ✅ WAF第二道防线
  ✅ 数据库错误信息不返回给用户

关键原则：
  🎯 参数化查询是根本！WAF和输入过滤只是辅助
```

### 6.2 各语言最佳实践

```
// Java - PreparedStatement (正确)
String sql = "SELECT * FROM users WHERE username = ? AND password = ?";
PreparedStatement stmt = conn.prepareStatement(sql);
stmt.setString(1, username);
stmt.setString(2, password);
ResultSet rs = stmt.executeQuery();

# Python - psycopg2 (正确)
cursor.execute(
    "SELECT * FROM users WHERE username = %s AND password = %s",
    (username, password)
)

// Go - database/sql (正确)
row := db.QueryRow(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    username, password,
)

错误做法（绝对避免）：
  "SELECT * FROM users WHERE username = '" + username + "'"  // 拼接!
  f"SELECT * FROM users WHERE username = '{username}'"       // 格式化!
```

---

## 七、现实案例分析

| 时间 | 事件 | 注入类型 | 影响 |
|------|------|----------|------|
| 2008 | Heartland支付系统 | SQL注入 | 1.3亿信用卡号泄露 |
| 2011 | Sony PlayStation | SQL注入 | 7700万用户信息 |
| 2014 | 12306铁路购票 | SQL注入 | 13万+用户数据泄露 |
| 2015 | TalkTalk | SQL注入 | 15.7万用户数据+£400K罚款 |
| 2019 | 俄罗斯银行"Silent"攻击 | SQL注入C2投递 | 多家银行感染恶意软件 |
| 2023 | MOVEit文件传输 | SQL注入 | 2600+组织受影响 |

---

## 八、CISP考试速查

### 关键考点

| 考点 | 记忆要点 |
|------|---------|
| SQL注入根本原因 | "用户输入未经验证拼接到SQL" |
| 根本防御方法 | "参数化查询(PreparedStatement)" |
| Blind类型 | "Boolean(页面差异) + Time(延迟)" |
| 二次注入要点 | "存储时转义≠安全，取出再拼接仍危险" |
| WAF绕过核心 | "编码+注释+大小写+等价函数" |

### 常见陷阱

1. **"用了ORM就不会SQL注入"** → ORM也可能存在拼接（原生SQL查询）
2. **"WAF能100%防SQL注入"** → WAF可被绕过，是辅助而非根本
3. **"参数化查询会影响性能"** → 现代数据库预编译反而提升性能
4. **"存储过程天然防注入"** → 存储过程中拼接字符串同样不安全

---

## 九、自检清单

- [ ] 能区分Union注入、Boolean盲注和Time盲注吗？
- [ ] 二次注入的原理和为什么难以防御？
- [ ] 至少了解5种WAF绕过技术？
- [ ] NoSQL注入与传统SQL注入的本质区别？
- [ ] 参数化查询为什么是根本防御？
- [ ] 各语言中参数化查询怎么写？
- [ ] SQL注入防御的四层体系是什么？

---

> **下一步**：Day 52 深入学习XSS——DOM XSS、CSP绕过与mXSS进阶攻击。
