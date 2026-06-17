---
day: 34
title: SQLMap基础使用（蓝队视角：识别自动化注入攻击）
phase: 第一阶段
difficulty: ⭐⭐⭐ 中等
---

# Day 34：SQLMap基础使用（蓝队视角：识别自动化注入攻击）

> **阶段**：第一阶段 · 初级蓝队夯实 | **难度**：⭐⭐⭐ 中等 | **课时**：2-3小时

## 📋 今日学习目标
1. 了解SQLMap基本用法
2. 识别SQLMap攻击流量特征
3. 能从日志判断SQLMap攻击是否成功
4. 编写SQLMap检测规则

## 📖 核心知识讲解
### 一、攻击者怎么用SQLMap

```bash
sqlmap -u "http://target.com/page.php?id=1"         # 基础检测
sqlmap -u "http://target.com/page.php?id=1" --dbs   # 获取数据库列表
sqlmap -u "http://target.com/page.php?id=1" -D db --tables  # 获取表名
sqlmap -u "http://target.com/page.php?id=1" -D db -T users --dump  # 拖库
```

### 二、蓝队识别SQLMap的特征

| 维度 | 特征 |
|:---|:---|
| **User-Agent** | 默认含 sqlmap/1.x |
| **请求参数** | AND 8442=8442、SLEEP(5)、concat(0x...) |
| **请求频率** | 短时间内密集请求同一URL |
| **服务器临时文件** | /tmp目录出现sqlmap临时文件 |
| **错误探针** | 大量500错误（各种注入探测导致）|

### 三、日志检测命令
```bash
grep -i "sqlmap" access.log
grep -E "AND [0-9]{4}=[0-9]{4}" access.log
grep -iE "SLEEP\(|BENCHMARK\(|WAITFOR DELAY" access.log
```

**四种注入技术的流量特征**：
- 布尔盲注：AND 1=1 / AND 1=2 交替出现
- 时间盲注：SLEEP(5)、BENCHMARK() 函数
- 报错注入：extractvalue()、updatexml() 函数
- UNION注入：ORDER BY探测 + UNION SELECT语句

## 🔧 实操任务
1. 在Kali中对DVWA执行SQLMap扫描
2. 用Wireshark抓取流量，识别特征
3. 编写一条IDS规则来检测SQLMap攻击

## ✅ 验收标准
- [ ] 了解SQLMap四种注入技术
- [ ] 能说出至少5个SQLMap流量特征
- [ ] 能从Web日志中识别SQLMap扫描

## 📝 今日小结
今天学习了SQLMap基础使用（蓝队视角：识别自动化注入攻击）的核心内容。蓝队成长的关键在于持续积累，把每个知识点内化为自己的实战能力。记住：理论+实操+复盘=真正的成长。

## 📚 延伸阅读
- 将今天所学整理到个人笔记库
- 搜索相关关键词了解更多行业案例
