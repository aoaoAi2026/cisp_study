---
day: 33
title: BurpSuite基础使用（蓝队视角）
phase: 第一阶段
difficulty: ⭐⭐⭐ 中等
---

# Day 33：BurpSuite基础使用（蓝队视角）

> **阶段**：第一阶段 · 初级蓝队夯实 | **难度**：⭐⭐⭐ 中等 | **课时**：2-3小时

## 📋 今日学习目标
1. 安装并配置BurpSuite社区版
2. 掌握Proxy抓包和Repeater重放
3. 学会用BurpSuite分析攻击流量
4. 理解攻击者如何使用Intruder

## 📖 核心知识讲解
### 一、BurpSuite功能概览

- **Proxy（代理）**：拦截HTTP/HTTPS流量，查看和修改
- **Repeater（重放）**：手动修改并重发请求
- **Intruder（入侵者）**：自动化批量测试
- **Decoder（解码器）**：编解码工具
- **Comparer（对比器）**：对比两次响应的差异

### 二、蓝队三大使用场景

**场景1：分析攻击payload**：从Wireshark提取攻击请求→粘贴到Repeater→修改参数测试→确认漏洞

**场景2：验证漏洞报告**：白帽子提交漏洞→用BurpSuite复现→确认真实性

**场景3：理解攻击手法**：告警中的payload→用Decoder解码Base64/URL编码→理解攻击内容

### 三、安装配置
1. 下载BurpSuite社区版（portswigger.net）
2. 配置浏览器代理为127.0.0.1:8080
3. 安装Burp的CA证书（用于HTTPS抓包）

## 🔧 实操任务
1. 下载安装BurpSuite社区版
2. 配置浏览器代理完成第一次抓包
3. 用Repeater修改参数后重发，观察响应变化
4. 用Decoder解码一段Base64编码的payload

## ✅ 验收标准
- [ ] BurpSuite安装配置成功
- [ ] 能使用Proxy拦截HTTP请求
- [ ] 能使用Repeater修改重放请求
- [ ] 理解BurpSuite在蓝队中的3个实用场景

## 📝 今日小结
今天学习了BurpSuite基础使用（蓝队视角）的核心内容。蓝队成长的关键在于持续积累，把每个知识点内化为自己的实战能力。记住：理论+实操+复盘=真正的成长。

## 📚 延伸阅读
- 将今天所学整理到个人笔记库
- 搜索相关关键词了解更多行业案例
