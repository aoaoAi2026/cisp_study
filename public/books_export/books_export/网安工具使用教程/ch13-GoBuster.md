# 第十三章：GoBuster - 高速目录爆破工具

## 13.1 GoBuster 简介

### 什么是 GoBuster？

GoBuster是一个用Go语言编写的高速目录爆破工具。

**GoBuster**的特点：
- 极快的速度
- 多种模式
- 支持扩展名
- 支持自定义状态码
- 支持HTTP/HTTPS

简单来说，GoBuster是**速度最快的目录爆破工具**。

---

## 13.2 Go语言环境安装

### Windows 安装Go

访问https://golang.org下载安装。

### Linux 安装Go

```bash
sudo apt install golang
```

### 验证安装

```bash
go version
```

---

## 13.3 安装教程

### 下载预编译版本

访问https://github.com/OJ/gobuster/releases下载。

### 从源码编译

```bash
go install github.com/OJ/gobuster/v3@latest
```

### 验证安装

```bash
gobuster version
```

---

## 13.4 目录模式详解

### 基本扫描

```bash
gobuster dir -u http://target.example.com -w wordlist.txt
```

### 常用参数

| 参数 | 说明 |
|------|------|
| -u | 目标URL |
| -w | 字典文件 |
| -x | 扩展名 |
| -t | 线程数 |
| -s | 状态码 |
| -b | 排除状态码 |
| -r | 跟随重定向 |
| --proxy | 代理 |
| -o | 输出文件 |

### 扩展名扫描

```bash
gobuster dir -u http://target.example.com -w wordlist.txt -x php,html,js
```

### 状态码过滤

```bash
gobuster dir -u http://target.example.com -w wordlist.txt -s "200,301,302"
```

---

## 13.5 DNS模式详解

### 什么是DNS模式？

DNS模式用于爆破子域名。

### 基本扫描

```bash
gobuster dns -d example.com -w subdomains.txt
```

### 示例

```bash
gobuster dns -d target.example.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt
```

---

## 13.6 虚拟主机模式详解

### 什么是虚拟主机？

同一IP可能托管多个网站（虚拟主机），通过Host头区分。

### 基本扫描

```bash
gobuster vhost -u http://target.example.com -w vhosts.txt
```

---

## 13.7 实战案例：目录爆破

### 场景说明

目标：`http://target.example.com`

### 执行扫描

```bash
gobuster dir -u http://target.example.com -w /usr/share/dirb/wordlists/common.txt -x php,html -t 50
```

### 结果分析

```
/index.php           (Status: 200) [Size: 1234]
/admin               (Status: 301) [Size: 178]
/login.php           (Status: 200) [Size: 567]
/backup              (Status: 403) [Size: 199]
```

---

## 总结

本章介绍了GoBuster的使用：

1. **安装配置**：Go环境、工具安装
2. **目录模式**：高速目录爆破
3. **DNS模式**：子域名爆破
4. **虚拟主机模式**：VHost爆破
5. **实战案例**：目录爆破

GoBuster是速度最快的目录爆破工具。

下一章我们将学习Nuclei——模板化漏洞扫描器！