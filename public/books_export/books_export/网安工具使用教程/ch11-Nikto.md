# 第十一章：Nikto - Web漏洞扫描工具

## 11.1 Nikto 简介

### 什么是 Nikto？

想象你是一个建筑检查员，需要检查一座大楼的所有安全隐患。**Nikto**就是这样的工具——一个全面的Web服务器漏洞扫描器。

**Nikto**可以检测：
- 过时的服务器软件
- 危险的配置
- 已知漏洞
- 敏感文件泄露
- 默认文件和目录

简单来说，Nikto帮你**快速发现Web服务器的安全问题**。

### Nikto的特点

| 特点 | 说明 |
|------|------|
| 全面性 | 检测数千种漏洞 |
| 速度快 | 快速扫描 |
| 易使用 | 命令简单 |
| 开源免费 | 免费使用 |
| 更新频繁 | 漏洞库更新 |

---

## 11.2 Windows 系统安装教程

### 安装Perl环境

Nikto是Perl程序，需要Perl环境。

**安装ActivePerl：**
1. 访问：https://www.activestate.com/products/perl/
2. 下载安装ActivePerl

### 下载Nikto

1. 访问：https://github.com/sullo/nikto
2. 下载ZIP文件
3. 解压到固定目录

### 运行Nikto

```batch
cd nikto\program
perl nikto.pl -h http://target.example.com
```

---

## 11.3 Linux 系统安装教程

### Kali Linux（预装）

Kali预装Nikto：
```bash
nikto -h http://target.example.com
```

### Ubuntu/Debian 安装

```bash
sudo apt install nikto
```

### 源码安装

```bash
git clone https://github.com/sullo/nikto.git
cd nikto/program
./nikto.pl -h http://target.example.com
```

---

## 11.4 基础扫描命令详解

### 基本扫描

```bash
nikto -h http://target.example.com
```

参数说明：
- `-h`：指定目标URL

### 扫描结果解析

```
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          192.168.1.100
+ Target Hostname:    target.example.com
+ Target Port:        80
---------------------------------------------------------------------------
+ Start Time:         2024-01-01 10:00:00
---------------------------------------------------------------------------
+ Server: Apache/2.4.41 (Ubuntu)
+ The anti-clickjacking X-Frame-Options header is not present.
+ Cookie PHPSESSID created without the httponly flag.
+ Retrieved X-Powered-By header: PHP/7.4.3
+ OSVDB-0: /robots.txt: Contains 1 entry.
+ 7915 requests: 0 error(s) and 4 item(s) reported on remote host
+ End Time:           2024-01-01 10:05:00
```

### 常用参数

| 参数 | 说明 |
|------|------|
| -h | 目标URL或IP |
| -p | 端口号 |
| -ssl | 使用SSL |
| -output | 输出文件 |
| -Format | 输出格式 |
| -Tuning | 扫描类型 |
| -evasion | 绕过技术 |
| -vhost | 虚拟主机 |
| -id | 认证信息 |

---

## 11.5 扫描选项详解

### 端口指定

```bash
nikto -h target.example.com -p 8080
```

### SSL扫描

```bash
nikto -h https://target.example.com -ssl
```

或直接使用https：
```bash
nikto -h https://target.example.com
```

### 多端口扫描

```bash
nikto -h target.example.com -p 80,443,8080
```

### 输出文件

```bash
nikto -h http://target.example.com -output result.txt
```

### 输出格式

```bash
nikto -h http://target.example.com -Format html -output result.html
```

支持的格式：
- txt：纯文本
- html：HTML报告
- xml：XML格式
- csv：CSV格式

---

## 11.6 Tuning 扫描类型详解

### 什么是Tuning？

Tuning可以指定扫描的漏洞类型，提高扫描效率。

### Tuning选项

| 选项 | 说明 |
|------|------|
| 0 | 文件上传 |
| 1 | 日志文件 |
| 2 | Shell命令执行 |
| 3 | SQL注入 |
| 4 | 信息泄露 |
| 5 | 目录遍历 |
| 6 | 服务拒绝 |
| 7 | 认证绕过 |
| 8 | 默认文件 |
| 9 | 服务器配置 |

### 使用示例

**只扫描SQL注入：**
```bash
nikto -h http://target.example.com -Tuning 3
```

**扫描文件上传和目录遍历：**
```bash
nikto -h http://target.example.com -Tuning 05
```

**排除默认文件扫描：**
```bash
nikto -h http://target.example.com -Tuning -8
```

---

## 11.7 绕过IDS/IPS技术

### 什么是IDS/IPS？

IDS（入侵检测系统）和IPS（入侵防御系统）会检测并阻止扫描流量。

### 绕过技术

| 选项 | 说明 |
|------|------|
| 1 | 随机URI编码 |
| 2 | 目录自引用（/./） |
| 3 | 过早URL结束 |
| 4 | 长URL请求 |
| 5 | 伪造参数 |
| 6 | TAB作为分隔符 |
| 7 | 大写URL |
| 8 | Windows分隔符（\） |
| 9 | 会话变体 |
| A | Unix路径编码 |

### 使用示例

```bash
nikto -h http://target.example.com -evasion 123
```

使用随机编码、目录自引用和过早URL结束。

---

## 11.8 实战案例：基础扫描

### 场景说明

目标：`http://target.example.com`

### 执行扫描

```bash
nikto -h http://target.example.com
```

### 结果分析

关注点：
- 服务器版本信息
- 配置问题
- 敏感文件
- 已知漏洞

---

## 11.9 实战案例：详细扫描报告

### 场景说明

生成详细的HTML报告。

### 执行扫描

```bash
nikto -h http://target.example.com -Format html -output report.html -Tuning 12345
```

### 查看报告

打开`report.html`查看详细报告。

---

## 11.10 实战案例：批量扫描

### 场景说明

扫描多个目标。

### 目标文件

创建目标文件`targets.txt`：
```
http://target1.example.com
http://target2.example.com
http://target3.example.com
```

### 批量扫描

```bash
nikto -h targets.txt -output results/
```

---

## 总结

本章介绍了Nikto的使用：

1. **安装配置**：Windows/Linux安装
2. **基础扫描**：基本命令和参数
3. **扫描选项**：端口、SSL、输出格式
4. **Tuning选项**：扫描类型控制
5. **绕过技术**：IDS/IPS绕过
6. **实战案例**：基础扫描、详细报告、批量扫描

Nikto是Web服务器漏洞扫描的基础工具。

下一章我们将学习DirSearch——现代目录扫描工具！