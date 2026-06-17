---
day: 30
title: SQL注入原理与绕过逻辑
phase: 第一阶段
difficulty: ⭐⭐⭐ 中等
---

# Day 30：SQL注入原理与绕过逻辑

> **阶段**：第一阶段 · 初级蓝队夯实 | **难度**：⭐⭐⭐ 中等 | **课时**：2-3小时

## 📋 今日学习目标
1. 深入理解SQL注入的数字型/字符型/搜索型分类
2. 了解WAF绕过的7种常见手法
3. 掌握SQL注入的蓝队检测方法
4. 能从日志和流量中识别SQL注入攻击

## 📖 核心知识讲解
### 一、SQL注入三种基本类型

**数字型注入**：参数没有引号包裹。如 `id=1`，攻击者直接拼接 `1 OR 1=1`。
```sql
SELECT * FROM products WHERE id=1 OR 1=1  -- 返回所有数据
```

**字符型注入**：参数有引号包裹。如 `name='admin'`，攻击者需先闭合引号再注入。
```sql
SELECT * FROM users WHERE name='admin' OR '1'='1' -- 绕过认证
```

**搜索型注入**：LIKE查询中的注入。
```sql
SELECT * FROM articles WHERE title LIKE '%攻击%' OR 1=1 #%'
```

### 二、WAF绕过七大手法

1. **大小写混写**：UnIoN SeLeCt 替代 UNION SELECT
2. **双写绕过**：UNUNIONION SELECT（WAF过滤一次后变成正确的）
3. **注释插入**：UN/**/ION SE/**/LECT
4. **编码绕过**：URL编码%55NION、十六进制0x...
5. **等价替换**：sleep(5) 换成 benchmark(10000000,md5(1))
6. **内联注释**：MySQL特性 /*!UNION*/ /*!SELECT*/
7. **分块传输**：HTTP Chunked Transfer将payload分片

### 三、蓝队检测最佳实践

**Web日志检测命令：**
```bash
grep -iE "(union.*select|select.*from|or.*1=1|and.*1=2|sleep\(|benchmark\(|information_schema)" access.log
```

**流量检测特征：**
- 同一IP频繁请求同一URL但参数不断变化
- User-Agent为sqlmap/XSS扫描器等工具标识
- 请求中出现concat(0x...)十六进制注入字符串
- Content-Length异常大（包含大量SQL payload）

**判断注入是否成功：**
- 状态码200 + 响应内容异常大 = 可能在拖库
- 状态码500 = SQL语法错误（信息泄露）
- 状态码302 = 可能绕过了认证

## 🔧 实操任务
1. 在DVWA中完成Low/Medium/High三级SQL注入关卡
2. 用Wireshark抓取每关的攻击流量，记录差异
3. 用grep命令扫描Web日志，验证能否检出SQL注入

## ✅ 验收标准
- [ ] 能区分数字型/字符型/搜索型SQL注入
- [ ] 能说出至少5种WAF绕过手法
- [ ] 能用grep从日志中识别SQL注入
- [ ] 能在Wireshark中还原攻击流量

## 📝 今日小结
今天学习了SQL注入原理与绕过逻辑的核心内容。蓝队成长的关键在于持续积累，把每个知识点内化为自己的实战能力。记住：理论+实操+复盘=真正的成长。

## 📚 延伸阅读
- 将今天所学整理到个人笔记库
- 搜索相关关键词了解更多行业案例
