# 第十七章：Masscan - 高速端口扫描器

## 17.1 Masscan 简介

### 什么是 Masscan？

Masscan是一个极快的端口扫描器，能在几秒内扫描整个互联网。

**Masscan**的特点：
- 极快的速度
- 异步扫描
- 可扫描全网
- 简单易用

简单来说，Masscan是**最快的端口扫描器**。

### Masscan vs Nmap

| 特点 | Masscan | Nmap |
|------|---------|------|
| 速度 | 极快 | 较慢 |
| 精度 | 较低 | 较高 |
| 功能 | 简单 | 丰富 |
| 适用 | 大范围扫描 | 详细扫描 |

---

## 17.2 安装教程

### Linux 安装

**Kali Linux：**
```bash
apt install masscan
```

**源码安装：**
```bash
git clone https://github.com/robertdavidgraham/masscan.git
cd masscan
make
sudo make install
```

### 验证安装

```bash
masscan --version
```

---

## 17.3 基础扫描命令详解

### 基本扫描

```bash
masscan -p 80 192.168.1.0/24
```

扫描192.168.1.x网段的80端口。

### 扫描多个端口

```bash
masscan -p 22,80,443 192.168.1.0/24
```

### 扫描端口范围

```bash
masscan -p 1-1000 192.168.1.0/24
```

### 常用参数

| 参数 | 说明 |
|------|------|
| -p | 端口号 |
| --rate | 扫描速率 |
| -oL | 输出为列表格式 |
| -oG | 输出为grepable格式 |
| -oJ | 输出为JSON格式 |
| -e | 指定网卡 |
| --banners | 获取Banner |
| --exclude | 排除IP |

---

## 17.4 扫描速率控制详解

### 设置速率

```bash
masscan -p 80 --rate 1000 192.168.1.0/24
```

每秒发送1000个包。

### 速率影响

- 太高：可能被防火墙阻止
- 太低：扫描时间长
- 推荐：1000-10000包/秒

### 安全速率

```bash
masscan -p 80 --rate 100 192.168.1.0/24
```

低调扫描，不易被发现。

---

## 17.5 输出格式详解

### 列表格式

```bash
masscan -p 80 -oL output.txt 192.168.1.0/24
```

输出内容：
```
# Masscan 1.0 scan
open 192.168.1.1 80
open 192.168.1.2 80
```

### Grepable格式

```bash
masscan -p 80 -oG output.txt 192.168.1.0/24
```

输出内容：
```
Host: 192.168.1.1 () Ports: 80
Host: 192.168.1.2 () Ports: 80
```

### JSON格式

```bash
masscan -p 80 -oJ output.json 192.168.1.0/24
```

---

## 17.6 Banner获取详解

### 什么是Banner？

Banner是服务返回的标识信息，包含服务类型和版本。

### 获取Banner

```bash
masscan -p 80 --banners 192.168.1.0/24
```

### Banner示例

```
Banner: HTTP/1.1 200 OK Server: Apache/2.4.41
Banner: SSH-2.0-OpenSSH_8.2
```

---

## 17.7 实战案例：快速端口发现

### 场景说明

快速发现大范围网络的开放端口。

### 执行扫描

```bash
masscan -p 22,80,443,3389 --rate 5000 -oG ports.txt 192.168.0.0/16
```

### 结果分析

使用Nmap详细扫描发现的端口：
```bash
nmap -p 22,80,443 -sV <discovered_ips>
```

---

## 总结

本章介绍了Masscan的使用：

1. **安装配置**：Linux安装
2. **基础扫描**：基本命令和参数
3. **速率控制**：调整扫描速度
4. **输出格式**：多种格式输出
5. **Banner获取**：服务信息获取
6. **实战案例**：快速端口发现

Masscan是大范围扫描的利器。

下一章我们将学习Cobalt Strike——渗透测试平台！