# 第6章 WebGoat与WebWolf搭建

## 6.1 WebGoat概述

WebGoat是由OWASP（Open Web Application Security Project）维护的一个故意设计存在安全漏洞的Web应用程序，专门用于Web安全教学和实践。WebGoat使用Java编写，运行在嵌入式Tomcat服务器上，包含了丰富的Web安全课程，涵盖了OWASP Top 10中的所有主要漏洞类型。

### 6.1.1 WebGoat的特点

- **课程化设计**：以课程形式组织，每个漏洞都有详细讲解
- **互动学习**：边学边练，理论与实践结合
- **难度递进**：从基础到高级，循序渐进
- **进度追踪**：记录学习进度，标记已完成的课程
- **Java生态**：基于Java技术栈，适合学习Java应用安全
- **OWASP官方**：由OWASP官方维护，质量有保障
- **开源免费**：完全开源，代码托管在GitHub

### 6.1.2 WebWolf概述

WebWolf是WebGoat的配套工具，模拟一个攻击者的Web服务器，主要用于：
- 接收和展示外带数据（Out-of-Band）
- 测试XXE、SSRF等需要外带的漏洞
- 模拟攻击者的邮箱服务器
- 测试CSRF等需要外部交互的漏洞
- 提供文件上传和托管服务

### 6.1.3 环境要求

| 组件 | 最低版本要求 |
|-----|-----------|
| 操作系统 | Windows/Linux/macOS |
| Java | JDK 11 及以上 |
| 内存 | 4GB以上（推荐8GB） |
| 磁盘空间 | 2GB以上 |
| 浏览器 | 任意现代浏览器 |

---

## 6.2 【Windows/Linux环境】Java环境配置

### 步骤1：检查Java环境

**操作位置**：终端 / 命令行

**执行命令**：

```bash
# 检查Java版本
java -version

# 检查javac编译器版本
javac -version
```

**预期输出**（Java 11或更高）：

```
openjdk version "11.0.x" 2024-01-01
OpenJDK Runtime Environment (Temurin-11.0.21+9)
OpenJDK 64-Bit Server VM (build 11.0.21+9, mixed mode)
```

如果显示版本低于11或显示"command not found"，需要安装Java。

---

### 步骤2：安装Java JDK（Windows）

**操作位置**：Windows浏览器下载 + 安装向导

**执行操作**：

1. 访问 Adoptium（推荐）或 Oracle 官网：
   - Adoptium: https://adoptium.net/temurin/releases/
   - Oracle: https://www.oracle.com/java/technologies/downloads/

2. 下载JDK 11或更高版本（如JDK 17、JDK 21）
3. 运行安装程序，按向导完成安装

**配置环境变量**（Windows）：

```powershell
# 打开系统属性 → 高级 → 环境变量
# 新建系统变量：
# 变量名：JAVA_HOME
# 变量值：C:\Program Files\Eclipse Adoptium\jdk-17.0.0.x

# 编辑Path变量，添加：
# %JAVA_HOME%\bin
```

**验证安装**：

```powershell
# 重新打开命令提示符，执行
java -version
javac -version
```

---

### 步骤3：安装Java JDK（Linux/Ubuntu）

**操作位置**：Linux终端

**执行命令**：

```bash
# 更新包列表
sudo apt update

# 安装OpenJDK 17
sudo apt install -y openjdk-17-jdk

# 验证安装
java -version
javac -version
```

**预期输出**：

```
openjdk version "17.0.x" 2024-01-01
OpenJDK Runtime Environment (build 17.0.x)
OpenJDK 64-Bit Server VM
```

---

### 步骤4：配置JAVA_HOME（Linux）

**操作位置**：Linux终端

**执行命令**：

```bash
# 查找Java安装路径
update-alternatives --list java

# 示例输出：/usr/lib/jvm/java-17-openjdk-amd64/bin/java

# 设置环境变量
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc

# 生效配置
source ~/.bashrc

# 验证
echo $JAVA_HOME
```

**预期输出**：

```
/usr/lib/jvm/java-17-openjdk-amd64
```

---

## 6.3 【通用】JAR方式安装WebGoat

### 步骤1：下载WebGoat

**操作位置**：浏览器 / 终端

**【浏览器下载】**：

1. 访问 WebGoat GitHub Releases 页面：
   https://github.com/WebGoat/WebGoat/releases

2. 下载最新版本的 `webgoat-server-xxxx.jar` 文件
   - 例如：`webgoat-server-2024.1.jar`

**【命令行下载】**：

```bash
# 创建目录
mkdir -p ~/webgoat
cd ~/webgoat

# 下载最新版本（请替换版本号）
wget https://github.com/WebGoat/WebGoat/releases/download/v2024.1/webgoat-server-2024.1.jar

# 或使用curl
curl -L -o webgoat-server-2024.1.jar https://github.com/WebGoat/WebGoat/releases/download/v2024.1/webgoat-server-2024.1.jar
```

**预期输出**：

```
Saving to: 'webgoat-server-2024.1.jar'
webgoat-server-2024.1.jar       100%[===================>]  XX.XX MB   XX.X MB/s    in XX.X s
2024-xx-xx xx:xx:xx (X.XX MB/s) - 'webgoat-server-2024.1.jar' saved [XXXXXXXXX/XXXXXXXXX]
```

---

### 步骤2：运行WebGoat

**操作位置**：终端

**执行命令**：

```bash
cd ~/webgoat

# 运行WebGoat（默认端口8080）
java -jar webgoat-server-2024.1.jar

# 或自定义端口
java -jar webgoat-server-2024.1.jar --server.port=8090 --server.address=0.0.0.0
```

**预期输出**：

```
Starting WebGoat...
Started WebGoat in [XX] seconds. 
Navigate to http://localhost:8080/WebGoat to start
```

> **注意**：首次启动会下载依赖，时间较长，请耐心等待。

---

### 步骤3：访问WebGoat

**操作位置**：Web浏览器

**执行操作**：

1. 打开浏览器访问：`http://localhost:8080/WebGoat`
2. 或（如果配置了自定义端口）：`http://localhost:8090/WebGoat`

**预期输出**：

```
WebGoat Landing Page
================================
[ Register new user ]  [ Login ]
```

---

### 步骤4：注册新用户

**操作位置**：Web浏览器

**执行操作**：

1. 点击"Register new user"链接
2. 填写注册信息：
   - Username：`testuser`
   - Password：`Test123456`
   - Email：`test@example.com`
3. 点击"Register"按钮

**预期输出**：

```
Registration successful!
Please login with your credentials.
```

---

### 步骤5：登录WebGoat

**操作位置**：Web浏览器

**执行操作**：

1. 使用刚注册的账号登录
2. 进入主界面后，可以看到左侧课程菜单

**预期输出**：

```
WebGoat Main Interface
================================
[A1] Injection
[A2] Broken Authentication
[A3] Sensitive Data Exposure
[A4] XXE
[A5] Broken Access Control
...
```

---

## 6.4 【Docker】WebGoat部署

### 步骤1：安装Docker环境

**操作位置**：终端 / PowerShell

**【Linux】执行命令**：

```bash
# 安装Docker
sudo apt update
sudo apt install -y docker.io docker-compose

# 启动Docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证
docker --version
```

**预期输出**：

```
Docker version 24.0.x, build xxxxx
```

---

### 步骤2：拉取WebGoat镜像

**操作位置**：终端

**执行命令**：

```bash
sudo docker pull webgoat/webgoat-2024.1
```

**预期输出**：

```
2024.1: Pulling from webgoat/webgoat-2024.1
...
Status: Downloaded newer image for webgoat/webgoat-2024.1:latest
```

---

### 步骤3：运行WebGoat容器

**操作位置**：终端

**执行命令**：

```bash
# 运行WebGoat（端口8080）
sudo docker run -d --name webgoat -p 8080:8080 webgoat/webgoat-2024.1

# 查看容器状态
sudo docker ps
```

**预期输出**：

```
CONTAINER ID   IMAGE                    COMMAND                  CREATED        STATUS        PORTS                    NAMES
xxxxxxxxxxxx   webgoat/webgoat-2024.1   "java -Dorg.gradle.…"   XX seconds ago Up XX seconds  0.0.0.0:8080->8080/tcp   webgoat
```

---

### 步骤4：等待启动并访问

**操作位置**：Web浏览器

**执行操作**：

1. 等待约1-2分钟让WebGoat完全启动
2. 访问：`http://localhost:8080/WebGoat`

**预期输出**：WebGoat登录/注册页面

---

### 步骤5：Docker Compose方式（推荐）

**操作位置**：终端

**创建docker-compose.yml**：

```bash
sudo nano /opt/webgoat/docker-compose.yml
```

**文件内容**：

```yaml
version: '3.8'

services:
  webgoat:
    image: webgoat/webgoat-2024.1
    container_name: webgoat
    ports:
      - "8080:8080"
    restart: unless-stopped
    environment:
      - JAVA_OPTS=-Xmx2048m
```

**启动服务**：

```bash
cd /opt/webgoat
sudo docker-compose up -d

# 查看日志
sudo docker-compose logs -f
```

---

## 6.5 【通用】WebWolf安装与配置

### 6.5.1 WebWolf简介

WebWolf是WebGoat的配套工具，主要功能：
- **Mail Server**：模拟邮件服务器，接收外带邮件
- **Landing Page**：接收HTTP请求（用于SSRF、XXE测试）
- **File Upload**：文件上传和托管服务
- **Requests**：查看所有接收到的请求

---

### 步骤1：下载WebWolf

**操作位置**：浏览器 / 终端

**【浏览器下载】**：

1. 访问 WebWolf GitHub Releases 页面：
   https://github.com/WebGoat/WebGoat/releases

2. 下载与WebGoat相同版本的 `webwolf-xxxx.jar`

**【命令行下载】**：

```bash
cd ~/webgoat
wget https://github.com/WebGoat/WebGoat/releases/download/v2024.1/webwolf-2024.1.jar
```

**预期输出**：下载成功，无错误

---

### 步骤2：运行WebWolf

**操作位置**：终端

**执行命令**：

```bash
# 运行WebWolf（默认端口9090）
java -jar webwolf-2024.1.jar

# 或自定义端口
java -jar webwolf-2024.1.jar --server.port=9090
```

**预期输出**：

```
Starting WebWolf...
Started WebWolf in [XX] seconds.
Navigate to http://localhost:9090/WebWolf to start
```

---

### 步骤3：访问WebWolf

**操作位置**：Web浏览器

**执行操作**：

1. 打开浏览器访问：`http://localhost:9090/WebWolf`

**预期输出**：

```
WebWolf Landing Page
================================
[Files] [Mail] [Landing] [Requests]
```

---

### 步骤4：Docker方式运行WebWolf

**执行命令**：

```bash
# 拉取镜像
sudo docker pull webgoat/webwolf-2024.1

# 运行容器
sudo docker run -d --name webwolf -p 9090:9090 webgoat/webwolf-2024.1

# 查看状态
sudo docker ps
```

**预期输出**：

```
CONTAINER ID   IMAGE                   COMMAND                  CREATED        STATUS        PORTS                    NAMES
xxxxxxxxxxxx   webgoat/webwolf-2024.1  "java -jar webwolf…"     XX seconds ago Up XX seconds  0.0.0.0:9090->9090/tcp   webwolf
```

---

### 步骤5：Docker Compose同时运行WebGoat和WebWolf

**操作位置**：终端

**创建docker-compose.yml**：

```bash
sudo nano /opt/webgoat-full/docker-compose.yml
```

**文件内容**：

```yaml
version: '3.8'

services:
  webgoat:
    image: webgoat/webgoat-2024.1
    container_name: webgoat
    ports:
      - "8080:8080"
    environment:
      - WEBWOLF_HOST=webwolf
      - WEBWOLF_PORT=9090
    depends_on:
      - webwolf
    restart: unless-stopped

  webwolf:
    image: webgoat/webwolf-2024.1
    container_name: webwolf
    ports:
      - "9090:9090"
      - "9091:9091"
    restart: unless-stopped
```

**启动服务**：

```bash
cd /opt/webgoat-full
sudo docker-compose up -d
```

---

## 6.6 【通用】WebGoat课程模块介绍

### 6.6.1 课程分类概览

WebGoat课程按照OWASP Top 10分类，每个分类下包含多个课程：

| 分类 | 课程数 | 主要内容 |
|------|--------|----------|
| A1-Injection | 15+ | SQL注入、命令注入、XXE |
| A2-Broken Authentication | 10+ | JWT、Session、MFA |
| A3-Sensitive Data Exposure | 5+ | 敏感数据、密码安全 |
| A4-XXE | 5+ | XML外部实体注入 |
| A5-Broken Access Control | 10+ | IDOR、水平/垂直越权 |
| A6-Security Misconfiguration | 5+ | 配置错误、SSRF、CSRF |
| A7-XSS | 10+ | 反射型、存储型、DOM型 |
| A8-Insecure Deserialization | 5+ | Java反序列化、JSON |
| A9-Vulnerable Components | 3+ | 已知漏洞组件 |
| A10-Insufficient Logging | 2+ | 日志与监控 |

---

### 6.6.2 A1-Injection（注入）

**SQL Injection (Intro)**：
- What is SQL?
- Try it: String SQLi
- What is injection?
- Querying the database
- Data Manipulation Language (DML)

**SQL Injection (Advanced)**：
- Pulling data from other tables
- SQL Inner Join
- Union-based SQL Injection
- Adding data with SQL
- Updating data with SQL
- Subqueries
- Blind SQL Injection

**SQL Injection (Mitigation)**：
- Using Prepared Statements
- Parameterized Queries
- Stored Procedures

**Command Injection**：
- Command Injection Introduction
- OS Command Injection

---

### 6.6.3 A2-Broken Authentication（认证失效）

**JWT Tokens**：
- JWT Token Structure
- Decoding JWT Tokens
- Using JWT Tokens
- None Algorithm Attack
- Weak Secret Key
- Exercises

**Password Reset**：
- Password Reset Basics
- Security Questions
- Token Leakage

**Session Management**：
- Session Hijating
- Session Fixation

**Multi-Factor Authentication**：
- MFA Bypass Techniques

---

### 6.6.4 A3-Sensitive Data Exposure（敏感数据泄露）

**Insecure Login**：
- Clear Text Transmission
- Network Sniffing

**Weak Password Storage**：
- Hash Functions
- Salting
- Modern Hashing (bcrypt, Argon2)

---

### 6.6.5 A4-XXE（XML外部实体注入）

**XXE Introduction**：
- What is XXE?
- XXE Attack Basics
- Reading Internal Files
- Denial of Service

**XXE Exploitation**：
- Blind XXE
- XXE with External Entity Injection
- XXE to SSRF

---

### 6.6.6 A5-Broken Access Control（访问控制失效）

**Insecure Direct Object References (IDOR)**：
- What is IDOR?
- Finding IDOR Vulnerabilities
- Exploiting IDOR
- Prevention

**Missing Function Level Access Control**：
- Horizontal Privilege Escalation
- Vertical Privilege Escalation
- Admin Bypass

---

### 6.6.7 A6-Security Misconfiguration（安全配置错误）

**Server-Side Request Forgery (SSRF)**：
- What is SSRF?
- SSRF Examples
- SSRF Filter Bypass

**Cross-Site Request Forgery (CSRF)**：
- CSRF Attack Basics
- CSRF Token Bypass
- Same-Origin Policy Bypass

---

### 6.6.8 A7-XSS（跨站脚本）

**Reflected XSS**：
- What is XSS?
- Finding Reflected XSS
- XSS Payloads

**Stored XSS**：
- Stored XSS Basics
- Stored XSS Exploitation
- Impact Assessment

**DOM-Based XSS**：
- DOM Manipulation
- DOM XSS Sources and Sinks
- Finding DOM XSS

**XSS Mitigation**：
- Input Validation
- Output Encoding
- Content Security Policy (CSP)

---

### 6.6.9 A8-Insecure Deserialization（不安全的反序列化）

**Introduction to Serialization**：
- What is Serialization?
- Java Serialization
- Python Pickle

**Exploiting Deserialization**：
- Common Gadget Chains
- Apache Commons Collections
- JSON Deserialization

---

## 6.7 【通用】WebGoat使用技巧

### 6.7.1 学习建议

1. **按课程顺序学习**：WebGoat课程设计有递进关系，建议按顺序进行
2. **仔细阅读说明**：每个课程都有详细的原理说明，先读懂再动手
3. **善用提示功能**：遇到困难时点击"Hint"查看提示
4. **查看解决方案**：完成后可查看"Solution"理解正确解法
5. **结合工具练习**：配合Burp Suite等工具进行实际测试

---

### 6.7.2 常用快捷操作

| 操作 | 快捷键 | 说明 |
|------|--------|------|
| 查看提示 | 点击"Hint" | 获取解题提示 |
| 查看源码 | 点击"Show Source" | 查看课程源码 |
| 查看解决方案 | 点击"Solution" | 查看标准解法 |
| 重置课程 | 点击"Reset" | 重置当前课程 |

---

## 6.8 【常见问题】WebGoat安装与使用问题

### 6.8.1 运行问题

---

**问题1：运行jar包报错"Unable to find Java"**

**可能原因**：
- Java未安装
- JAVA_HOME环境变量未设置
- PATH中不包含Java路径

**解决方法**：

```powershell
# Windows - 检查Java安装
where java
java -version

# 如果找不到，手动设置环境变量
# 系统属性 → 高级 → 环境变量 → 新建JAVA_HOME
```

```bash
# Linux - 检查Java安装
which java
echo $JAVA_HOME

# 如果没有，安装Java
sudo apt install openjdk-17-jdk
```

---

**问题2：端口8080被占用**

**可能原因**：
- 其他应用程序占用了8080端口
- 之前运行的WebGoat未正确关闭

**解决方法**：

```powershell
# Windows - 查找占用端口的进程
netstat -ano | findstr :8080

# 结束进程（假设PID是1234）
taskkill /PID 1234 /F
```

```bash
# Linux - 查找占用端口的进程
sudo lsof -i :8080
sudo netstat -tulpn | grep 8080

# 结束进程
sudo kill -9 <PID>
```

**使用其他端口启动**：

```bash
java -jar webgoat-server-2024.1.jar --server.port=8888
```

---

**问题3：启动后访问显示404 Not Found**

**可能原因**：
- URL错误（注意大小写）
- WebGoat未完全启动
- 端口映射错误

**解决方法**：

1. 确认URL正确：`http://localhost:8080/WebGoat`（W和G大写）
2. 等待30秒让WebGoat完全启动
3. 检查启动日志是否有错误

```bash
# 查看启动日志
tail -f webgoat.log
```

---

**问题4：启动缓慢或卡在"Starting WebGoat"**

**可能原因**：
- 首次启动需要下载依赖
- 内存不足
- 网络问题导致依赖下载慢

**解决方法**：

1. 耐心等待几分钟（首次启动可能需要5-10分钟）
2. 增加内存分配：

```bash
java -Xmx4g -jar webgoat-server-2024.1.jar
```

3. 检查网络连接

---

### 6.8.2 使用问题

---

**问题5：注册用户失败**

**可能原因**：
- 用户名已存在
- 密码强度不足
- WebGoat未正常初始化

**解决方法**：

1. 使用更复杂的用户名
2. 密码要求：至少8位，包含数字和字母
3. 重启WebGoat

```bash
# 停止WebGoat
# Ctrl+C 或
sudo docker stop webgoat

# 重新启动
sudo docker start webgoat
```

---

**问题6：课程内容加载不出来**

**可能原因**：
- 网络问题
- 浏览器缓存
- JavaScript被禁用

**解决方法**：

1. 强制刷新页面：`Ctrl+F5`
2. 清除浏览器缓存
3. 尝试其他浏览器
4. 检查浏览器控制台错误

---

**问题7：完成了课程但没有打勾标记**

**可能原因**：
- 未完全按照题目要求操作
- 请求未正确发送到服务器
- 会话问题

**解决方法**：

1. 仔细阅读题目要求
2. 确保操作步骤完整
3. 刷新页面重新进入课程
4. 退出重新登录

---

### 6.8.3 WebWolf问题

---

**问题8：WebWolf无法启动，端口9090被占用**

**解决方法**：

```bash
# 查找占用端口的进程
sudo lsof -i :9090

# 使用其他端口
java -jar webwolf-2024.1.jar --server.port=9092
```

---

**问题9：WebGoat中WebWolf功能无法使用**

**可能原因**：
- WebWolf未运行
- WebWolf地址配置错误
- 防火墙阻止连接

**解决方法**：

1. 确认WebWolf正在运行
2. 启动时指定WebWolf地址：

```bash
java -jar webgoat-server-2024.1.jar --webwolf.url=http://localhost:9090/WebWolf
```

3. Docker方式确保容器在同一个网络：

```yaml
# docker-compose.yml
services:
  webgoat:
    environment:
      - WEBWOLF_HOST=webwolf
      - WEBWOLF_PORT=9090
    depends_on:
      - webwolf
```

---

### 6.8.4 Docker问题

---

**问题10：Docker容器启动失败**

**解决方法**：

```bash
# 查看容器日志
sudo docker logs webgoat

# 检查Docker状态
sudo systemctl status docker

# 重启Docker服务
sudo systemctl restart docker

# 重新运行容器
sudo docker rm webgoat
sudo docker run -d --name webgoat -p 8080:8080 webgoat/webgoat-2024.1
```

---

**问题11：拉取镜像失败**

**可能原因**：
- 网络连接问题
- Docker Hub访问受限

**解决方法**：

1. 配置国内镜像加速器
2. 使用代理
3. 重试拉取

```bash
# 配置镜像加速（创建/etc/docker/daemon.json）
sudo nano /etc/docker/daemon.json
```

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```

```bash
sudo systemctl restart docker
sudo docker pull webgoat/webgoat-2024.1
```

---

## 6.9 本章小结

本章详细介绍了WebGoat和WebWolf的搭建和使用方法：

### 搭建方式对比

| 方式 | 优点 | 缺点 | 推荐场景 |
|------|------|------|----------|
| JAR直接运行 | 简单，无需Docker | 需要Java环境 | 快速测试 |
| Docker部署 | 环境隔离，易管理 | 需要Docker | 长期使用 |

### 主要内容

1. **Java环境配置**：JDK 11+安装与验证
2. **WebGoat安装**：JAR方式和Docker方式
3. **WebWolf安装**：独立运行和配合WebGoat
4. **课程模块**：OWASP Top 10分类的40+课程
5. **常见问题**：运行、使用、Docker问题汇总

### 学习建议

- 按课程顺序系统学习
- 先理解原理再动手实践
- 善用提示和解决方案
- 配合Burp Suite等工具
- 做好笔记，总结知识点

WebGoat是Web安全学习的优秀平台，建议读者认真学习每个课程，理解漏洞原理，掌握防御方法。
