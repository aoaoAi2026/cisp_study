# Day 10：Burp Suite Decoder——编码解码神器

> **学习目标**：掌握Decoder模块，进行各种编码解码操作
>
> **学习时长**：2小时
>
> **难度等级**：⭐⭐

---

## 📚 今日内容概览

1. Decoder模块介绍
2. 常用编码格式
3. 解码操作
4. 编码操作
5. 实战练习
6. 今日总结

---

## 一、Decoder模块介绍

### 1.1 什么是Decoder

```
Decoder是什么：
  编码解码工具
  支持多种编码格式
  用于处理加密或编码的数据

常见编码格式：
  - URL编码
  - Base64编码
  - HTML编码
  - Hex编码
  - Unicode编码
  - MD5哈希（不可逆）
```

### 1.2 界面布局

```
Decoder界面：

┌─────────────────────────────────────────┐
│ Decoder                                  │
├─────────────────────────────────────────┤
│                                          │
│ [输入区域]                               │
│                                          │
├─────────────────────────────────────────┤
│ [编码选项]                               │
│  Decode as...  Encode as...  Hash       │
├─────────────────────────────────────────┤
│                                          │
│ [输出区域]                               │
│                                          │
└─────────────────────────────────────────┘
```

---

## 二、常用编码格式

### 2.1 URL编码

```
URL编码：
  也叫Percent编码
  用于URL中的特殊字符
  %XX格式（XX是十六进制）

示例：
  空格 → %20
  # → %23
  ? → %3F
  / → %2F
  : → %3A

在Decoder中操作：
  1. 输入：hello world
  2. 选择"URL"
  3. 点击"Decode as URL"
  4. 输出：hello%20world
```

### 2.2 Base64编码

```
Base64编码：
  将二进制转为文本
  只能编码3个字节
  结尾用=填充

示例：
  hello → aGVsbG8=
  admin → YWRtaW4=

在Decoder中操作：
  1. 输入：aGVsbG8=
  2. 选择"Base64"
  3. 点击"Decode as Base64"
  4. 输出：hello
```

### 2.3 HTML编码

```
HTML编码：
  用于防止XSS
  &开头 ;结尾

示例：
  < → &lt;
  > → &gt;
  " → &quot;
  ' → &#39;
  & → &amp;

在Decoder中操作：
  1. 输入：<script>alert(1)</script>
  2. 选择"HTML"
  3. 点击"Encode as HTML"
  4. 输出：&lt;script&gt;alert(1)&lt;/script&gt;
```

---

## 三、解码操作

### 3.1 智能解码

```
Smart decode（智能解码）：
  自动检测编码格式
  依次尝试解码

使用方法：
  1. 输入编码后的字符串
  2. 选择"Smart decode"
  3. 自动检测并解码
```

### 3.2 逐步解码

```
逐步解码：
  有些数据多层编码
  需要逐步手动解码

示例（URL+Base64）：
  1. 原始Flag：flag{test}
  2. Base64：ZmxhZ3t0ZXN0fQ==
  3. URL编码：ZmxhZ3t0ZXN0fQ%3D%3D
  
  解码步骤：
  1. URL解码：ZmxhZ3t0ZXN0fQ==
  2. Base64解码：flag{test}
```

---

## 四、编码操作

### 4.1 常用编码

```
URL编码：
  特殊字符必须编码
  
Base64编码：
  二进制转文本
  常用于传输数据

HTML编码：
  防止XSS输出
  实体编码
```

### 4.2 多次编码

```
场景：
  有时候需要多次编码
  比如加密后Base64再URL编码

示例：
  1. 原始：flag{secret}
  2. Base64：ZmxhZ3tzZWNyZXR9
  3. URL：ZmxhZ3tzZWNyZXR9
  
  在Decoder中：
  1. 输入ZmxhZ3tzZWNyZXR9
  2. 选择URL → Decode
  3. 选择Base64 → Decode
  4. 得到flag{secret}
```

---

## 五、实战练习

### 5.1 题目：解码获取Flag

```
题目描述：
  Flag经过多层编码
  需要解码才能看到

数据：
  ZmxhZyU3RGNoYWxsZW5nZXM%3D

解题步骤：
  1. 智能解码试试
  2. URL解码：ZmxhZyU3RGNoYWxsZW5nZXM=
  3. Base64解码：flag{challenges}
  
Flag：flag{challenges}
```

---

## 六、今日总结

### 6.1 关键记忆点

```
记住这个口诀：

Decoder是解码器，
URL Base64 HTML都要会；
Smart decode自动解，
层层嵌套要逐步解！

编码解码要分清，
编码是加密，
解码是还原；
多次编码要逐层解，
别忘最后看Flag！
```

### 6.2 今日作业

```
必做题：
  1. 掌握Decoder基本用法
  2. 练习URL、Base64、HTML编码解码
  3. 完成CTFHub编码相关题目
```

---

**恭喜你完成Day 10的学习！明天学习Burp Suite Intruder！** 🎉
