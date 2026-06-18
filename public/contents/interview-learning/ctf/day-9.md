# Day 9：Burp Suite Repeater——请求重放攻击

> **学习目标**：深入掌握Repeater模块，学会重放修改请求
>
> **学习时长**：2-3小时
>
> **难度等级**：⭐⭐⭐

---

## 📚 今日内容概览

1. Repeater模块介绍
2. 发送请求到Repeater
3. 修改和重放请求
4. 跟进重定向
5. 实战练习：Repeater高级用法
6. Repeater与漏洞测试
7. 今日总结

---

## 一、Repeater模块介绍

### 1.1 什么是Repeater

```
Repeater是什么：
  请求重放器
  重新发送修改后的请求
  多次测试同一个请求

生活比喻：
  就像复印机：
  - 先复印一份
  - 然后在复印件上修改
  - 再发送修改后的版本
  - 反复测试直到成功

Repeater用途：
  1. 修改请求参数测试漏洞
  2. 测试不同输入的效果
  3. 验证漏洞是否存在
  4. 多次尝试获取Flag
```

### 1.2 发送请求到Repeater

```
方法1：从Proxy发送
  1. Proxy → HTTP History
  2. 右键请求
  3. 选择"Send to Repeater"
  4. 或选中请求按Ctrl+R

方法2：从Proxy拦截发送
  1. Proxy → Intercept
  2. 拦截到请求
  3. 点击"Action"
  4. 选择"Send to Repeater"

方法3：手动创建
  1. 切换到Repeater标签
  2. 点击"New"
  3. 手动输入请求内容
```

---

## 二、Repeater界面详解

### 2.1 界面布局

```
Repeater界面：

┌──────────────────────────────────────────────────────────┐
│ Repeater                                                │
├────────────────────────┬─────────────────────────────────┤
│ Target                 │ Request                        │
│ [下拉选择目标]          │ [请求内容编辑区]                │
│                        │                                 │
│                        │ Raw Params Headers Hex          │
├────────────────────────┼─────────────────────────────────┤
│                        │                                 │
│                        │ Response                        │
│                        │ [响应内容显示区]                 │
│                        │                                 │
│                        │ Pretty Raw Headers Hex          │
└────────────────────────┴─────────────────────────────────┘

主要区域：
  1. Target：选择目标地址
  2. Request：编辑请求内容
  3. Response：查看响应内容
```

### 2.2 请求编辑

```
请求编辑功能：

Raw视图：
  以纯文本形式编辑请求
  可以直接修改任何内容

Params视图：
  以表格形式编辑参数
  方便修改GET/POST参数

Headers视图：
  以表格形式编辑请求头
  方便添加、修改、删除头

Hex视图：
  以十六进制编辑
  用于修改二进制数据

快捷操作：
  Ctrl+Z：撤销
  Ctrl+Y：重做
  Ctrl+C：复制
  Ctrl+V：粘贴
```

---

## 三、重放请求

### 3.1 基本重放

```
步骤1：发送请求到Repeater
  从Proxy右键发送

步骤2：修改请求
  在Request区域修改

步骤3：发送请求
  点击"Go"按钮
  或按Ctrl+Enter

步骤4：查看响应
  在Response区域查看结果

步骤5：重复测试
  修改参数 → 点击Go → 查看结果
  反复测试直到找到Flag
```

### 3.2 跟进重定向

```
Follow redirect选项：
  - Never：不跟随重定向
  - Always：自动跟随所有重定向
  - On-site only：只跟随同站点重定向

设置方法：
  点击Repeater顶部的"Follow redirects"下拉菜单

自动跟随：
  1. 设置为"Always"
  2. 发送请求
  3. Burp自动跟随所有重定向
  4. 显示最终响应

手动跟随：
  1. 设置为"Never"
  2. 发送请求
  3. 查看302响应
  4. 在Response中找Location头
  5. 手动构造新请求
```

---

## 四、实战练习

### 4.1 练习：SQL注入测试

```
目标：测试SQL注入漏洞

步骤：
  1. 找到注入点
     GET /search?id=1 HTTP/1.1
  
  2. 发送到Repeater
     右键 → Send to Repeater
  
  3. 测试注入
     修改为：GET /search?id=1' HTTP/1.1
     点击Go
  
  4. 观察响应
     如果有SQL错误，说明存在注入
  
  5. 进一步测试
     id=1' AND 1=1--
     id=1' AND 1=2--
     id=1' UNION SELECT...
```

### 4.2 练习：越权测试

```
目标：测试越权漏洞

步骤：
  1. 登录账号A
     获取Cookie
  
  2. 发送到Repeater
     GET /user/profile HTTP/1.1
     Cookie: session=xxx
  
  3. 修改Cookie
     尝试修改为账号B的session
     Cookie: session=yyy
  
  4. 发送请求
     点击Go
  
  5. 观察结果
     如果能查看账号B的信息，说明存在越权
```

---

## 五、今日总结

### 5.1 关键记忆点

```
记住这个口诀：

Repeater是重放器，
改完参数继续发；
Go按钮来发送，
Response里看结果！

Follow redirect要注意，
自动跟随还是手动；
Ctrl+R快速发送，
Repeater最好用！
```

### 5.2 今日作业

```
必做题：
  1. 掌握Repeater基本用法
  2. 练习修改请求参数
  3. 在CTFHub完成Repeater相关题目
```

---

**恭喜你完成Day 9的学习！明天继续学习Burp Suite Decoder！** 🎉
