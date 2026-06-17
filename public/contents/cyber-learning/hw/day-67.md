---
day: 67
title: Shiro/Weblogic/Fastjson反序列化漏洞
phase: 第二阶段
difficulty: ⭐⭐⭐ 中等
---

# Day 67：Shiro/Weblogic/Fastjson反序列化漏洞

> **阶段**：第二阶段 · 中级蓝队进阶 | **难度**：⭐⭐⭐ 中等 | **课时**：2-3小时

## 📋 今日学习目标
1. 理解反序列化原理
2. 检测三大框架漏洞

## 📖 核心知识讲解
### 反序列化原理

字节流转回对象时的安全问题。Shiro RememberMe硬编码密钥(kPH+bIxk5D2deZiIxcaaaA==)、Fastjson autoType

### 检测特征

Cookie含rememberMe=deleteMe且值很长、流量含反序列化payload特征

## 🔧 实操任务
搭建Shiro漏洞环境并分析流量特征

## ✅ 验收标准
- [ ] 理解反序列化原理
- [ ] 能识别Shiro攻击流量

## 📝 今日小结
今天学习了Shiro/Weblogic/Fastjson反序列化漏洞的核心内容。蓝队成长的关键在于持续积累，把每个知识点内化为自己的实战能力。记住：理论+实操+复盘=真正的成长。

## 📚 延伸阅读
- 将今天所学整理到个人笔记库
- 搜索相关关键词了解更多行业案例
