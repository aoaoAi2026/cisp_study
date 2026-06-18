# Day 11：Burp Suite Intruder——暴力破解神器

> **学习目标**：掌握Intruder模块，进行自动化攻击和暴力破解
>
> **学习时长**：3小时
>
> **难度等级**：⭐⭐⭐

---

## 📚 今日内容概览

1. Intruder模块介绍
2. 攻击类型详解
3. Payload配置
4. 攻击结果分析
5. 实战练习
6. 今日总结

---

## 一、Intruder模块介绍

### 1.1 什么是Intruder

```
Intruder是什么：
  自动化攻击工具
  用于暴力破解
  自动化测试

生活比喻：
  就像万能钥匙：
  - 尝试所有可能的钥匙
  - 直到找到能开锁的那一把
  - 自动化的试错过程

Intruder用途：
  1. 暴力破解密码
  2. 枚举用户名
  3. 测试参数边界
  4.  fuzzing测试
```

### 1.2 攻击类型

```
四种攻击类型：

1. Sniper（狙击手）
  - 使用一个Payload集合
  - 依次替换每个位置
  - 适合单一参数测试

2. Battering Ram（撞城锤）
  - 使用一个Payload集合
  - 同时替换所有位置
  - 适合需要相同值的测试

3. Pitchfork（干草叉）
  - 使用多个Payload集合
  - 每个位置对应一个集合
  - 依次取出组合
  - 适合用户名密码组合

4. Cluster Bomb（集束炸弹）
  - 使用多个Payload集合
  - 所有位置两两组合
  - 穷举所有可能
  - 适合多参数组合测试
```

---

## 二、Sniper攻击模式

### 2.1 原理

```
Sniper原理：
  一个Payload集合
  依次替换标记位置
  
示例：
  请求：username=§admin§&password=123456
  Payload：admin, root, test
  
  攻击次数：3次（Payload数量）
  
  第1次：admin
  第2次：root
  第3次：test
```

### 2.2 使用场景

```
使用场景：
  - 爆破单一参数
  - 测试单个用户名的密码
  - 测试参数的不同值

示例：
  GET /login?username=§test§&password=123456
  
  尝试不同的用户名
```

---

## 三、Battering Ram攻击模式

### 3.1 原理

```
Battering Ram原理：
  一个Payload集合
  同时替换所有标记位置
  
示例：
  请求：username=§admin§&password=§admin§
  Payload：admin, root, test
  
  攻击次数：3次
  
  第1次：admin,admin
  第2次：root,root
  第3次：test,test
```

### 3.2 使用场景

```
使用场景：
  - 用户名和密码相同
  - Cookie和Referer相同
  - 多处需要相同值的情况
```

---

## 四、Pitchfork攻击模式

### 4.1 原理

```
Pitchfork原理：
  多个Payload集合
  每个位置对应一个
  依次组合
  
示例：
  请求：username=§admin§&password=§123456§
  Payload1：admin, root, test
  Payload2：123456, password, admin123
  
  攻击次数：3次（最短Payload长度）
  
  第1次：admin, 123456
  第2次：root, password
  第3次：test, admin123
```

### 4.2 使用场景

```
使用场景：
  - 用户名密码爆破
  - 已知用户名，爆破密码
  - 对应关系的测试
```

---

## 五、Cluster Bomb攻击模式

### 5.1 原理

```
Cluster Bomb原理：
  多个Payload集合
  所有位置两两组合
  穷举所有可能
  
示例：
  请求：username=§admin§&password=§123456§
  Payload1：admin, root
  Payload2：123456, password
  
  攻击次数：4次（2×2）
  
  第1次：admin, 123456
  第2次：admin, password
  第3次：root, 123456
  第4次：root, password
```

### 5.2 使用场景

```
使用场景：
  - 不知道用户名和密码
  - 穷举所有组合
  - 多参数组合测试
```

---

## 六、Payload配置

### 6.1 Payload Sets

```
Payload Sets：
  定义Payload集合
  
Payload Type：
  - Simple list：简单列表
  - Runtime file：文件中的列表
  - Numbers：数字序列
  - Dates：日期
  - Brute forcer：字符集暴力生成
```

### 6.2 Payload Processing

```
Payload Processing：
  Payload处理规则
  
常用规则：
  - Add prefix：添加前缀
  - Add suffix：添加后缀
  - Match/replace：匹配替换
  - Encode：编码
  - Hash：哈希
```

---

## 七、实战练习

### 7.1 练习：暴力破解登录

```
目标：暴力破解登录密码

步骤：
  1. 抓取登录请求
  2. 发送到Intruder
  3. 设置攻击类型为Sniper
  4. 标记密码参数
  5. 设置Payload为密码字典
  6. 开始攻击
  7. 分析结果找成功响应
```

### 7.2 分析结果

```
结果分析：
  - Status：状态码
  - Length：响应长度
  - Time：响应时间
  
成功特征：
  - 状态码200
  - 响应长度不同
  - 包含"success"、"欢迎"等关键词
```

---

## 八、今日总结

### 8.1 关键记忆点

```
记住这个口诀：

Intruder是暴力破，
Sniper一个参数破；
Battering ram同时破，
Pitchfork对应破；
Cluster bomb穷举破，
根据情况选择破！

Payload要配置好，
字典选择很重要；
结果分析看响应，
成功响应要找到！
```

### 8.2 今日作业

```
必做题：
  1. 掌握Intruder四种攻击类型
  2. 练习配置Payload
  3. 完成CTFHub暴力破解题目
```

---

**恭喜你完成Day 11的学习！明天学习Burp Suite综合实战！** 🎉
