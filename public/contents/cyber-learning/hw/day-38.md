---
day: 38
title: DVWA靶场通关（蓝队视角）
phase: 第一阶段
difficulty: ⭐⭐⭐ 中等
---

# Day 38：DVWA靶场通关（蓝队视角）

> **阶段**：第一阶段 · 初级蓝队夯实 | **难度**：⭐⭐⭐ 中等 | **课时**：2-3小时

## 📋 今日学习目标
1. 搭建DVWA靶场
2. 通关全部漏洞关卡
3. 每关记录攻击流量和日志特征
4. 编写对应的IDS检测规则

## 📖 核心知识讲解
### DVWA漏洞关卡清单

1. Brute Force - 暴力破解
2. Command Injection - 命令注入
3. CSRF - 跨站请求伪造
4. File Inclusion - 文件包含
5. File Upload - 文件上传
6. SQL Injection - SQL注入
7. SQL Injection (Blind) - SQL盲注
8. XSS Reflected - 反射型XSS
9. XSS Stored - 存储型XSS
10. XSS DOM - DOM型XSS

### 蓝队通关方法论

每完成一关，记录：
1. 攻击在URL/请求体中留下了什么特征？
2. Wireshark抓到的流量长什么样？
3. Web访问日志中怎么记录的？
4. 如何写IDS规则来检测？

### Docker快速部署
```bash
docker run -d -p 80:80 --name dvwa vulnerables/web-dvwa
# 访问 http://localhost/setup.php 完成初始化
```

## 🔧 实操任务
1. 用Docker部署DVWA
2. 逐关从Low到High通关
3. 每关用Wireshark抓包并记录日志特征
4. 总结每个漏洞的检测方法

## ✅ 验收标准
- [ ] DVWA环境搭建成功
- [ ] 完成至少8个关卡
- [ ] 每关都有流量和日志分析记录

## 📝 今日小结
今天学习了DVWA靶场通关（蓝队视角）的核心内容。蓝队成长的关键在于持续积累，把每个知识点内化为自己的实战能力。记住：理论+实操+复盘=真正的成长。

## 📚 延伸阅读
- 将今天所学整理到个人笔记库
- 搜索相关关键词了解更多行业案例
