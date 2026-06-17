# -*- coding: utf-8 -*-
content = """---
day: 26
title: Webshell基础检测
phase: 第一阶段
difficulty: "\u2b50\u2b50\u2b50 \u4e2d\u7b49"
---

# Day 26：Webshell基础检测

> **阶段**：第一阶段 · 蓝队极速上岗 | **难度**：⭐⭐⭐ 中等 | **课时**：2-3小时

## 📋 今日学习目标

1. 理解Webshell的概念和危害
2. 掌握常见一句话木马的识别方法
3. 学会从文件特征和访问日志中检测Webshell
4. 了解Webshell检测工具的使用

## 📖 核心知识讲解

### 一、什么是Webshell

Webshell是一段恶意脚本，攻击者上传到Web服务器后，可以通过浏览器远程控制服务器。

核心危害：拿到Webshell = 拿到了服务器的操作权限。攻击者可以执行命令、查看文件、窃取数据、横向移动。

常见webshell类型：

| 语言 | 典型一句话木马 |
|:---|:---|
| PHP | `<?php @eval($_POST['cmd']);?>` |
| ASP | `<%eval request("cmd")%>` |
| JSP | `<%Runtime.getRuntime().exec(request.getParameter("cmd"));%>` |
| ASPX | `<%@ Page Language="Jscript"%><%eval(Request.Item["cmd"],"unsafe");%>` |

### 二、常见一句话木马识别

PHP一句话木马危险函数特征库：

```
eval()          - 执行PHP代码
assert()        - 断言执行
system()        - 执行系统命令
exec()          - 执行外部程序
shell_exec()    - 通过shell执行命令
passthru()      - 执行外部程序并输出
popen()         - 打开进程文件指针
proc_open()     - 执行命令打开文件指针
create_function() - 创建匿名函数执行
call_user_func()  - 回调函数执行
```

一句话木马的伪装手法：

```php
// 正常：直接的eval
<?php @eval($_POST['cmd']);?>

// 伪装1：变量拆分
<?php $a = 'e'.'v'.'a'.'l'; $a($_POST['cmd']);?>

// 伪装2：字符串反转
<?php $a = strrev('lave'); $a($_POST['cmd']);?>

// 伪装3：base64解码
<?php $a = base64_decode('ZXZhbA=='); $a($_POST['cmd']);?>

// 伪装4：藏在图片里（图片马）
// GIF89a<?php @eval($_POST['cmd']);?>
```

### 三、文件特征检测法

时间异常检测：

```bash
# 查找最近24小时内修改的.php文件
find /www -name "*.php" -mtime -1 -ls

# 查找与站点大部分文件时间不一致的孤立时间
find /www -name "*.php" -newer /www/index.php -ls
```

文件权限异常：

```bash
# webshell通常由www-data/nobody写入
find /www -name "*.php" -perm /o+w
```

文件名异常：

```
- index.php.bak        (伪装成备份)
- images.php           (藏在图片目录)
- user.php5            (利用解析绕过)
- config.inc.php       (伪装成配置文件)
```

### 四、日志检测法

Web访问日志关键特征：

```bash
# 查找对.php文件的POST请求
grep "POST.*\\.php" access.log | awk '{print $1, $7}' | sort | uniq -c | sort -rn

# 查找返回200但极少正常访问的可疑文件
grep "\\.php" access.log | awk '{print $7}' | sort | uniq -c | sort -n
# 访问次数为1-3次的.php文件需要重点关注
```

特征流量检测：

webshell通信通常有这些特征：
- POST请求body包含 eval、base64_decode、cmd=、exec
- User-Agent异常（非浏览器UA，如python-requests）
- 请求时间异常（凌晨3-5点）
- Referer为空（直接访问，非正常浏览路径）

```bash
# 查找凌晨时段的.php POST请求
grep "POST.*\\.php" access.log | awk '$4 ~ /0[3-5]:/ {print}'

# 查找User-Agent异常的请求
grep "POST.*\\.php" access.log | grep -v "Mozilla" | grep -v "Chrome"
```

### 五、实战检测流程

完整检测5步法：

```
第1步：文件搜索
- 查近N天新增/修改文件
- 查非正常目录下的脚本文件

第2步：内容扫描
- 搜索危险函数：eval|assert|system|exec|shell_exec|passthru
- 搜索编码特征：base64_decode|strrev|gzinflate|str_rot13

第3步：日志关联
- 找到可疑文件路径，查该文件的访问记录
- 关注POST请求、异常UA、异常时间

第4步：工具确认
- D盾、河马查杀、WebShellKiller
- 在线检测：Virustotal、微步在线

第5步：应急响应
- 确认后立即备份证据（文件+日志）
- 隔离文件（修改权限400禁止执行）
- 排查入侵路径（上传点、漏洞入口）
```

## 🔧 实操任务

1. 使用 find + grep 在测试环境中搜索可疑php文件
2. 手工分析一段access.log，找出webshell通信记录
3. 了解D盾或河马查杀等检测工具
4. 尝试手写一个简单的webshell扫描脚本（匹配eval/assert等关键词）
5. 在DVWA环境中模拟文件上传+webshell连接的完整攻击链，观察日志

## ✅ 验收标准

- [ ] 能识别至少5种PHP一句话木马写法
- [ ] 能用find+grep从文件系统发现可疑文件
- [ ] 能从access.log中识别webshell通信特征
- [ ] 了解至少2种webshell检测工具
- [ ] 能说出webshell应急响应的5个步骤

## 📝 今日小结

今天学习了Webshell基础检测，这是蓝队值守中最常见的应急场景之一。核心记住三点：文件特征（危险函数）+ 日志特征（异常POST）+ 工具辅助（查杀）。检测Webshell不是一次性工作，需要持续监控和定期扫描。

## 📚 延伸阅读

- 了解D盾、河马查杀的使用方法
- 搜索Webshell bypass了解高级对抗技术
- 将webshell特征库整理到个人笔记中
"""

with open('day-26.md', 'w', encoding='utf-8') as f:
    f.write(content)
print('day-26.md written successfully')
print(f'File size: {len(content)} bytes')
