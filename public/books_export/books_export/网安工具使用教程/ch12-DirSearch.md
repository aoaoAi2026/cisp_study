# 第十二章：DirSearch - 现代目录扫描工具

## 12.1 DirSearch 简介

### 什么是 DirSearch？

DirSearch是一个用Python编写的目录扫描工具，比DirBuster更快、更现代。

**DirSearch**的特点：
- 多线程支持
- 支持多种扩展名
- 支持递归扫描
- 彩色输出
- 支持代理
- 支持HEAD/GET请求

简单来说，DirSearch是**现代化的目录扫描工具**。

---

## 12.2 Python 环境安装

DirSearch需要Python 3环境。

### Windows 安装Python

访问https://python.org下载安装。

### Linux 安装Python

```bash
sudo apt install python3 python3-pip
```

### 验证安装

```bash
python3 --version
```

---

## 12.3 安装教程

### 克隆项目

```bash
git clone https://github.com/maurosoria/dirsearch.git
cd dirsearch
```

### 安装依赖

```bash
pip3 install -r requirements.txt
```

### 运行

```bash
python3 dirsearch.py -u http://target.example.com
```

---

## 12.4 基础扫描命令详解

### 基本扫描

```bash
python3 dirsearch.py -u http://target.example.com
```

### 常用参数

| 参数 | 说明 |
|------|------|
| -u | 目标URL |
| -l | 目标文件列表 |
| -e | 扩展名 |
| -w | 字典文件 |
| -t | 线程数 |
| -x | 排除状态码 |
| -i | 包含状态码 |
| -r | 递归扫描 |
| -R | 递归深度 |
| --proxy | 代理 |
| --random-agent | 随机UA |

### 扫描示例

```bash
python3 dirsearch.py -u http://target.example.com -e php,html,js
```

---

## 12.5 字典配置详解

### 默认字典

DirSearch自带字典在`db/`目录。

### 使用自定义字典

```bash
python3 dirsearch.py -u http://target.example.com -w /path/to/wordlist.txt
```

### 字典推荐

| 字典 | 说明 |
|------|------|
| directory-list-2.3-medium.txt | 常用 |
| raft-medium-directories.txt | 全面 |
| common.txt | 基础 |

---

## 12.6 扩展名扫描详解

### 指定扩展名

```bash
python3 dirsearch.py -u http://target.example.com -e php,asp,aspx,jsp
```

### 常用扩展名

| 扩展名 | 说明 |
|------|------|
| php | PHP文件 |
| asp, aspx | ASP.NET文件 |
| jsp, do | Java文件 |
| html, htm | HTML文件 |
| js | JavaScript文件 |
| txt, log | 文本文件 |
| bak, old | 备份文件 |

---

## 12.7 递归扫描详解

### 启用递归

```bash
python3 dirsearch.py -u http://target.example.com -r
```

### 设置递归深度

```bash
python3 dirsearch.py -u http://target.example.com -r -R 3
```

递归深度为3层。

### 递归扫描的用途

当发现目录时，自动扫描目录下的内容：
```
/admin/
  → /admin/login.php
  → /admin/config.php
```

---

## 12.8 状态码过滤详解

### 排除状态码

```bash
python3 dirsearch.py -u http://target.example.com -x 404,403
```

### 包含状态码

```bash
python3 dirsearch.py -u http://target.example.com -i 200,301,302
```

### 状态码含义

| 状态码 | 说明 |
|------|------|
| 200 | 成功 |
| 301 | 永久重定向 |
| 302 | 临时重定向 |
| 403 | 禁止访问 |
| 404 | 不存在 |
| 500 | 服务器错误 |

---

## 12.9 实战案例：发现后台目录

### 场景说明

目标：`http://target.example.com`

### 执行扫描

```bash
python3 dirsearch.py -u http://target.example.com -e php,html,js -t 20
```

### 结果分析

```
200    1KB  http://target.example.com/admin/
200    2KB  http://target.example.com/login.php
301    0KB  http://target.example.com/backup/
403    1KB  http://target.example.com/config/
```

重点关注：
- 200状态码的目录和文件
- 403状态码（可能需要认证）
- backup目录

---

## 12.10 实战案例：敏感文件发现

### 场景说明

查找备份文件和配置文件。

### 执行扫描

```bash
python3 dirsearch.py -u http://target.example.com -e bak,old,zip,tar,gz,conf,ini
```

### 可能发现

```
200    5KB  http://target.example.com/backup.zip
200    1KB  http://target.example.com/config.ini.bak
200    2KB  http://target.example.com/database.sql
```

---

## 总结

本章介绍了DirSearch的使用：

1. **安装配置**：Python环境、工具安装
2. **基础扫描**：基本命令和参数
3. **字典配置**：默认字典、自定义字典
4. **扩展名扫描**：指定文件类型
5. **递归扫描**：深度扫描目录
6. **状态码过滤**：筛选结果

DirSearch是现代目录扫描的优秀工具。

下一章我们将学习GoBuster——高速目录爆破工具！