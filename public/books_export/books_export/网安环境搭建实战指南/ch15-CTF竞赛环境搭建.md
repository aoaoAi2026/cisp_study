# 第十五章 CTF竞赛环境搭建

## 15.1 环境概述

CTF（Capture The Flag，夺旗赛）是网络安全领域的一种竞赛形式，参赛者需要通过解决各种安全技术题目来获取Flag（旗帜），并提交获得积分。搭建自己的CTF靶场环境，可以用于练习、培训和内部比赛。

本章将介绍CTF竞赛环境的搭建方法，包括CTF平台部署、题目管理、动态靶机配置等内容。

### 15.1.1 CTF竞赛模式

| 模式 | 说明 | 特点 |
|------|------|------|
| Jeopardy（解题模式） | 参赛队伍通过解题获取Flag，按积分排名 | 最常见的模式，适合入门 |
| Attack-Defense（攻防模式） | 每队有自己的靶机，既要攻击也要防守 | 更贴近实战，难度较高 |
| Mixed（混合模式） | 结合解题和攻防模式 | 综合性强 |
| King of the Hill（占山为王） | 争夺靶机权限，持续占领得分 | 考验后渗透能力 |

### 15.1.2 CTF题目分类

| 分类 | 说明 | 典型题型 |
|------|------|----------|
| Web | Web安全相关 | SQL注入、XSS、命令注入、文件上传、SSRF等 |
| Pwn | 二进制漏洞利用 | 栈溢出、堆溢出、格式化字符串、UAF等 |
| Reverse | 逆向工程 | 逆向分析、密码破解、脱壳、反调试等 |
| Crypto | 密码学 | 对称加密、非对称加密、哈希、古典密码等 |
| Misc | 杂项 | 隐写术、取证分析、流量分析、编码解码等 |
| Mobile | 移动安全 | Android逆向、iOS安全、APP漏洞等 |
| Blockchain | 区块链安全 | 智能合约漏洞、钱包安全等 |

### 15.1.3 系统要求

| 组件 | 最低配置 | 推荐配置 |
|------|----------|----------|
| CTF平台服务器 | 2核4GB | 4核8GB |
| 数据库服务器 | 2核4GB | 4核8GB |
| Web题目服务器 | 按需分配 | 按需分配 |
| Pwn题目服务器 | 按需分配 | 按需分配 |
| 动态靶机服务器 | 4核8GB | 8核16GB以上 |

---

## 15.2 CTFd 平台搭建

### 15.2.1 CTFd 介绍

CTFd是最流行的开源CTF平台之一，具有以下特点：

- 基于Python Flask开发
- 支持多种题目类型
- 美观的用户界面
- 插件扩展系统
- 动态分值系统
- 支持团队赛和个人赛
- 内置评分和排行榜
- RESTful API

官网：https://ctfd.io
GitHub：https://github.com/CTFd/CTFd

---

### 15.2.2 环境准备

#### 【Linux环境】安装系统依赖

**步骤1：系统更新**

> 操作位置：Linux终端（Ubuntu/Debian）

```bash
# 更新软件包列表
sudo apt update

# 升级已安装软件包
sudo apt upgrade -y
```

---

**步骤2：安装基础依赖**

> 操作位置：Linux终端

```bash
# 安装Python、Git和其他依赖
sudo apt install -y git python3 python3-pip python3-dev build-essential
sudo apt install -y libffi-dev libssl-dev libmysqlclient-dev
sudo apt install -y nginx redis-server
```

---

### 15.2.3 Docker方式安装（推荐）

#### 【Docker环境】快速部署

**步骤1：安装Docker和Docker Compose**

> 操作位置：Linux终端

```bash
# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装Docker Compose
sudo apt install -y docker-compose

# 将当前用户加入docker组
sudo usermod -aG docker $USER

# 验证安装
docker --version
docker-compose --version
```

**预期输出：**
```
Docker version 24.x.x, build xxxxxxx
docker-compose version x.x.x, build xxxxxxx
```

---

**步骤2：克隆CTFd仓库**

> 操作位置：Linux终端

```bash
# 克隆CTFd仓库
git clone https://github.com/CTFd/CTFd.git

# 进入CTFd目录
cd CTFd

# 查看目录内容
ls -la
```

---

**步骤3：配置环境变量**

> 操作位置：Linux终端，CTFd目录

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
nano .env
```

主要配置项：

```bash
# 数据库配置（使用SQLite，简单部署）
DATABASE_URL=mysql+pymysql://ctfd:ctfd_password@db/ctfd
# 或使用默认SQLite
# DATABASE_URL=sqlite:///ctfd.db

# Redis配置
REDIS_URL=redis://cache:6379/0

# 密钥配置（生产环境请修改为随机字符串）
SECRET_KEY=your-secret-key-here-change-in-production

# 管理员配置
ADMIN_USER=admin
ADMIN_PASSWORD=admin_password
ADMIN_EMAIL=admin@example.com
```

---

**步骤4：使用Docker Compose启动**

> 操作位置：Linux终端，CTFd目录

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

**预期输出：**
```
NAME                COMMAND                  SERVICE             STATUS              PORTS
ctfd_db_1          "docker-entrypoint.s…"   db                  running             3306/tcp
ctfd_cache_1       "docker-entrypoint.s…"   cache               running             6379/tcp
ctfd_ctfd_1        "/usr/local/bin/uwsg…"   ctfd                running             0.0.0.0:8000->8000/tcp
```

---

**步骤5：访问CTFd平台**

> 操作位置：浏览器

```
浏览器访问：http://服务器IP:8000
或 http://localhost:8000（本地访问）
```

---

**步骤6：初始化管理员账号**

> 操作位置：浏览器，CTFd首页

```
1. 首次访问会显示欢迎页面
2. 点击"Register"注册管理员账号
3. 填写用户名、密码、邮箱
4. 点击"Register"完成注册
5. 使用管理员账号登录
```

---

### 15.2.4 源码方式安装

#### 【Linux环境】Python源码安装

**步骤1：克隆仓库**

> 操作位置：Linux终端

```bash
git clone https://github.com/CTFd/CTFd.git
cd CTFd
```

---

**步骤2：安装Python依赖**

> 操作位置：Linux终端，CTFd目录

```bash
# 安装Python依赖
pip3 install -r requirements.txt

# 或使用pip安装
pip3 install CTFd
```

---

**步骤3：配置数据库**

> 操作位置：Linux终端

**使用SQLite（默认，无需配置）：**
```bash
# 默认使用SQLite，数据库文件为ctfd.db
# 无需额外配置
```

**使用MySQL：**
```bash
# 安装MySQL
sudo apt install -y mysql-server

# 创建数据库
mysql -u root -p
```

```sql
CREATE DATABASE ctfd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ctfd'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON ctfd.* TO 'ctfd'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# 设置环境变量
export DATABASE_URL=mysql+pymysql://ctfd:password@localhost/ctfd
```

---

**步骤4：启动服务**

> 操作位置：Linux终端，CTFd目录

```bash
# 开发模式
python3 serve.py

# 或使用gunicorn（生产模式）
pip3 install gunicorn
gunicorn --bind 0.0.0.0:8000 -w 4 'CTFd:create_app()'
```

---

### 15.2.5 Nginx反向代理配置

#### 【Linux环境】配置Nginx

**步骤1：安装Nginx**

> 操作位置：Linux终端

```bash
sudo apt install -y nginx
```

---

**步骤2：创建站点配置**

> 操作位置：Linux终端

```bash
# 创建配置文件
sudo nano /etc/nginx/sites-available/ctfd
```

配置内容：

```nginx
server {
    listen 80;
    server_name ctfd.example.com;

    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket支持（如果需要）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

**步骤3：启用站点**

> 操作位置：Linux终端

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/ctfd /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

---

### 15.2.6 常见问题

#### 【通用】部署常见问题

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| Docker容器启动失败 | 端口被占用 | 检查端口占用 `netstat -tlnp`，或修改docker-compose.yml端口映射 |
| 数据库连接失败 | 配置错误 | 检查DATABASE_URL环境变量，确认数据库服务运行 |
| 文件上传失败 | 权限问题 | 检查uploads目录权限 `chmod -R 777 CTFd/uploads` |
| 页面空白 | 缓存问题 | 清除浏览器缓存，或重启容器 `docker-compose restart` |

---

## 15.3 CTF题目发布

### 15.3.1 题目创建

#### 【通用】创建题目步骤

**步骤1：登录管理后台**

> 操作位置：浏览器，CTFd管理界面

```
1. 访问 http://服务器IP:8000/admin
2. 使用管理员账号登录
3. 点击左侧菜单"Challenges"
```

---

**步骤2：创建新题目**

> 操作位置：CTFd管理后台

```
1. 点击"Challenges"
2. 点击"New Challenge"
3. 填写题目信息：
```

| 字段 | 说明 | 示例 |
|------|------|------|
| Name | 题目名称 | SQL注入基础 |
| Category | 题目分类 | Web |
| Value | 题目分值 | 100 |
| Description | 题目描述 | 经典的SQL注入题目... |
| Hints | 提示（可选） | 提示1 |
| Flags | Flag | CTF{SQL_1nj3ct10n} |
| Files | 附件文件 | challenge.zip |

---

**步骤3：保存题目**

> 操作位置：CTFd管理后台

```
1. 确认所有信息填写正确
2. 点击"Create"按钮
3. 题目出现在列表中
```

---

### 15.3.2 题目类型

#### 【通用】标准题目类型

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| standard | 标准题目，提交Flag即可 | 大部分题目 |
| dynamic | 动态分值，解的人越多分值越低 | 增加区分度 |
| docker | Docker部署的题目 | Web/Pwn等需要环境的题目 |

---

### 15.3.3 动态分值配置

#### 【通用】动态分值设置

**步骤1：创建动态题目**

> 操作位置：CTFd管理后台

```
1. 创建新题目
2. 选择Type为"dynamic"
```

---

**步骤2：配置分值参数**

> 操作位置：CTFd题目编辑页面

```
配置项：
- Initial Value：初始分值（如500）
- Decay：衰减函数（线性/对数）
- Decay Limit：衰减阈值（达到此人数后不再衰减）
- Minimum Value：最低分值（如100）

分值计算公式：
dynamic_value = max(minimum, (initial - (minimum * sqrt(decay * solves))))
```

---

### 15.3.4 Web题目部署示例

#### 【Docker环境】示例：一个简单的SQL注入题目

**步骤1：创建题目目录**

> 操作位置：Linux终端

```bash
# 创建题目目录
mkdir -p /tmp/challenges/sql_injection
cd /tmp/challenges/sql_injection

# 创建源码目录
mkdir -p src
```

---

**步骤2：编写Dockerfile**

> 操作位置：Linux终端，/tmp/challenges/sql_injection目录

```dockerfile
cat > Dockerfile << 'EOF'
FROM php:7.4-apache

# 安装MySQL扩展
RUN docker-php-ext-install mysqli pdo pdo_mysql

# 复制源码
COPY src/ /var/www/html/

# 设置权限
RUN chown -R www-data:www-data /var/www/html/

# 暴露端口
EXPOSE 80
EOF
```

---

**步骤3：编写题目源码**

> 操作位置：Linux终端，src目录

```bash
nano src/index.php
```

```php
<?php
$servername = "localhost";
$username = "root";
$password = "password";
$dbname = "ctf";

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$id = $_GET['id'] ?? '1';
$sql = "SELECT * FROM users WHERE id = " . $id;
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    while($row = mysqli_fetch_assoc($result)) {
        echo "ID: " . $row["id"] . " - Username: " . $row["username"] . "<br>";
    }
} else {
    echo "No results";
}

mysqli_close($conn);
?>
```

---

**步骤4：在CTFd中配置Docker题目**

> 操作位置：CTFd管理后台

```
1. 创建新题目
2. 选择Type为"docker"
3. 填写题目信息
4. 在Docker Image中填写：ctfd/sql-injection:latest
5. 配置端口映射：8001:80
6. 点击Create
```

---

### 15.3.5 题目文件上传

#### 【通用】上传题目附件

**步骤1：准备题目文件**

> 操作位置：Linux终端

```bash
# 创建题目目录
mkdir -p /tmp/challenges/misc_steganography
cd /tmp/challenges/misc_steganography

# 创建附件
echo "这是一道隐写术题目" > description.txt
zip challenge.zip description.txt secret.jpg
```

---

**步骤2：上传文件**

> 操作位置：CTFd管理后台

```
1. 编辑或创建题目
2. 在Files部分点击"Upload"
3. 选择本地文件
4. 点击"Save"
```

---

## 15.4 动态靶机配置

### 15.4.1 动态靶机介绍

动态靶机是指每个参赛队伍都有独立的题目环境，避免互相干扰。

**实现方式：**
- Docker容器化部署
- 每个队伍独立实例
- 自动分配端口
- 定时重置功能

---

### 15.4.2 CTFd Docker插件

#### 【Docker环境】安装CTFd Docker插件

**步骤1：安装插件**

> 操作位置：Linux终端，CTFd目录

```bash
# 进入插件目录
cd CTFd/CTFd/plugins

# 克隆Docker Challenges插件
git clone https://github.com/CTFd/ctfd-docker-challenges.git docker_challenges

# 安装Python依赖
pip3 install docker

# 重启CTFd
cd /root/CTFd
docker-compose restart
```

---

**步骤2：配置Docker连接**

> 操作位置：CTFd管理后台

```
1. 进入Plugins → Docker Challenges
2. 配置Docker连接信息：
   - Docker URL: unix:///var/run/docker.sock
   - 或 tcp://docker-host:2375
3. 测试连接
```

---

### 15.4.3 部署动态题目

#### 【Docker环境】创建Docker题目

**步骤1：构建Docker镜像**

> 操作位置：Linux终端，题目目录

```bash
# 构建镜像
docker build -t ctf/web-calc:latest /tmp/challenges/web_calc/

# 推送镜像（如果使用远程Docker Registry）
docker push ctf/web-calc:latest
```

---

**步骤2：在CTFd中配置**

> 操作位置：CTFd管理后台

```
1. 创建新题目
2. 选择Type为"docker"
3. 填写Docker Image: ctf/web-calc:latest
4. 配置端口映射（如 8001->80）
5. 配置环境变量（可选）
6. 设置超时时间
7. 保存题目
```

---

### 15.4.4 常见问题

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| Docker连接失败 | socket权限问题 | 将用户加入docker组，或修改socket权限 |
| 容器启动失败 | 镜像不存在 | 确认镜像名称正确，已正确构建 |
| 端口冲突 | 多个容器使用同一端口 | 修改docker-compose.yml中的端口映射范围 |

---

## 15.5 Flag提交与验证

### 15.5.1 CTFd API使用

#### 【通用】API认证

**步骤1：获取API Token**

> 操作位置：浏览器，CTFd用户设置

```
1. 登录CTFd
2. 点击右上角用户名 → Settings
3. 点击"API Key"生成Token
4. 复制保存Token
```

---

**步骤2：使用API提交Flag**

> 操作位置：Linux终端

```bash
# 设置变量
CTFD_URL="http://localhost:8000"
API_TOKEN="your-api-token"

# 获取题目列表
curl -H "Authorization: Token $API_TOKEN" \
     $CTFD_URL/api/v1/challenges

# 提交Flag
curl -X POST \
     -H "Authorization: Token $API_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"challenge_id": 1, "submission": "CTF{test_flag}"}' \
     $CTFD_URL/api/v1/challenges/attempt
```

---

### 15.5.2 Flagbot示例

#### 【通用】自动化Flag提交Bot

**步骤1：创建Bot脚本**

> 操作位置：Linux终端

```bash
nano /tmp/flagbot.py
```

```python
import requests
import time
import json

class CTFdBot:
    def __init__(self, base_url, api_token):
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Token {api_token}",
            "Content-Type": "application/json"
        }
    
    def get_challenges(self):
        """获取所有题目"""
        url = f"{self.base_url}/api/v1/challenges"
        response = requests.get(url, headers=self.headers)
        return response.json().get("data", [])
    
    def submit_flag(self, challenge_id, flag):
        """提交Flag"""
        url = f"{self.base_url}/api/v1/challenges/attempt"
        data = {
            "challenge_id": challenge_id,
            "submission": flag
        }
        response = requests.post(url, json=data, headers=self.headers)
        return response.json()
    
    def get_solved(self):
        """获取已解答的题目"""
        url = f"{self.base_url}/api/v1/users/me/solves"
        response = requests.get(url, headers=self.headers)
        return response.json().get("data", [])

# 使用示例
if __name__ == "__main__":
    bot = CTFdBot("http://localhost:8000", "your-api-token")
    
    # 获取所有题目
    challenges = bot.get_challenges()
    print(f"发现 {len(challenges)} 道题目")
    
    # 批量提交Flag
    flags = {
        1: "CTF{flag1}",
        2: "CTF{flag2}",
    }
    
    for cid, flag in flags.items():
        result = bot.submit_flag(cid, flag)
        status = result.get("data", {}).get("status")
        print(f"题目 {cid}: {status}")
        time.sleep(1)
```

---

## 15.6 CTF工具集

### 15.6.1 Web安全工具

#### 【通用】常用Web安全工具

| 工具 | 说明 | 安装方式 |
|------|------|----------|
| Burp Suite | Web抓包代理 | 预装在Kali |
| sqlmap | SQL注入检测 | `apt install sqlmap` |
| dirbuster | 目录扫描 | 预装在Kali |
| gobuster | 目录/子域名扫描 | `apt install gobuster` |
| nikto | Web漏洞扫描 | `apt install nikto` |
| wpscan | WordPress扫描 | `gem install wpscan` |

---

**sqlmap使用示例：**

```bash
# 检测SQL注入
sqlmap -u "http://target.com/index.php?id=1" --batch

# 获取数据库
sqlmap -u "http://target.com/index.php?id=1" --dbs

# 获取表
sqlmap -u "http://target.com/index.php?id=1" -D dbname --tables

# 导出数据
sqlmap -u "http://target.com/index.php?id=1" -D dbname -T users --dump
```

---

### 15.6.2 Pwn/逆向工具

#### 【通用】常用逆向工程工具

| 工具 | 说明 | 安装方式 |
|------|------|----------|
| gdb | 调试器 | `apt install gdb` |
| pwntools | Python Pwn库 | `pip install pwntools` |
| ropgadget | ROP链构造 | `apt install rop-tools` |
| one_gadget | one_gadget查找 | `gem install one_gadget` |
| checksec | 二进制安全检查 | 预装在Kali |
| ROPgadget | ROP gadgets查找 | `pip install ropgadget` |

---

**pwntools使用示例：**

```python
from pwn import *

# 连接远程服务
p = remote('target.com', 12345)

# 发送数据
p.sendline(b'A' * 100)

# 接收响应
print(p.recvline())

# 关闭连接
p.close()
```

---

### 15.6.3 密码学工具

#### 【通用】常用密码学工具

| 工具 | 说明 | 使用方式 |
|------|------|----------|
| CyberChef | 在线编码解码 | https://gchq.github.io/CyberChef/ |
| hashcat | 哈希破解 | `hashcat -m 0 hash.txt wordlist.txt` |
| john | 密码破解 | `john --wordlist=wordlist.txt hash.txt` |
| sage | 数学计算 | `sage` |
| openssl | OpenSSL命令行 | `openssl enc -aes-256-cbc -d -in file.enc` |

---

### 15.6.4 取证分析工具

#### 【通用】常用取证分析工具

| 工具 | 说明 | 安装方式 |
|------|------|----------|
| binwalk | 固件分析 | `apt install binwalk` |
| foremost | 文件提取 | `apt install foremost` |
| steghide | 隐写术 | `apt install steghide` |
| wireshark | 流量分析 | `apt install wireshark` |
| volatility | 内存取证 | `pip install volatility3` |

---

**binwalk使用示例：**

```bash
# 分析文件
binwalk firmware.bin

# 提取文件
binwalk -e firmware.bin

# 递归提取
binwalk -eM firmware.bin
```

---

## 15.7 知名CTF平台介绍

### 15.7.1 XCTF攻防世界

**平台介绍：**
XCTF攻防世界是国内知名的CTF练习平台，提供大量高质量题目。

**官网：** https://adworld.xctf.org.cn

**特点：**
- 题目分类清晰，难度分级
- 包含新手区、进阶区、高手区
- 支持动态靶机
- 有详细的Writeup社区
- 定期举办比赛

---

### 15.7.2 Bugku CTF

**平台介绍：**
Bugku是国内另一个知名的CTF练习平台，题目丰富。

**官网：** https://ctf.bugku.com

**特点：**
- 题目数量多，覆盖面广
- 包含Web、逆向、Pwn、Crypto、Misc等
- 有在线工具集成
- 社区活跃
- 积分和排名系统

---

### 15.7.3 国际知名平台

| 平台名称 | 网址 | 特点 |
|----------|------|------|
| Hack The Box | https://www.hackthebox.com | 在线靶机，实战性强 |
| TryHackMe | https://tryhackme.com | 引导式学习，适合新手 |
| picoCTF | https://picoctf.org | 入门级，适合学生 |
| Hacker101 | https://ctf.hacker101.com | 由HackerOne运营 |
| Root Me | https://www.root-me.org | 法国平台，题目丰富 |
| OverTheWire | https://overthewire.org | 经典的Wargame平台 |
| Pwnable.kr | https://pwnable.kr | Pwn专项练习 |
| CryptoHack | https://cryptohack.org | 密码学专项练习 |

---

## 15.8 比赛环境配置

### 15.8.1 比赛前准备检查清单

#### 【通用】服务器检查

| 检查项 | 操作 | 预期结果 |
|--------|------|----------|
| 服务器性能 | `top` 或 `htop` | CPU、内存使用率正常 |
| 网络带宽 | `speedtest-cli` | 带宽满足需求 |
| 防火墙配置 | `sudo ufw status` | 按需开放端口 |
| 域名解析 | `ping 域名` | 正常解析 |
| SSL证书 | 浏览器访问HTTPS | 证书有效 |

---

#### 【通用】平台检查

| 检查项 | 操作 | 预期结果 |
|--------|------|----------|
| CTFd运行状态 | `docker-compose ps` | 所有服务running |
| 数据库连接 | 登录CTFd | 正常登录 |
| 注册功能 | 注册新账号 | 注册成功 |
| 题目显示 | 查看题目列表 | 题目正常显示 |
| Flag提交 | 提交测试Flag | 正确判断对错 |
| 排行榜 | 查看排行榜 | 正常排序更新 |

---

#### 【通用】题目检查

| 检查项 | 操作 | 预期结果 |
|--------|------|----------|
| 题目可访问 | 访问题目环境 | 正常响应 |
| Flag格式 | 检查Flag | 格式正确 |
| 附件下载 | 下载附件 | 下载正常 |
| 动态靶机 | 启动实例 | 容器正常启动 |
| 提示信息 | 查看提示 | 显示正常 |

---

### 15.8.2 比赛监控

#### 【通用】监控指标

| 指标 | 监控方法 | 告警阈值 |
|------|----------|----------|
| CPU使用率 | `top` | > 90% |
| 内存使用率 | `free -m` | > 90% |
| 磁盘使用率 | `df -h` | > 80% |
| 网络流量 | `iftop` | 异常流量 |
| 在线人数 | CTFd API | 突然下降 |
| 提交次数 | CTFd API | 突然下降 |

---

### 15.8.3 应急处理

#### 【通用】常见问题处理

| 问题 | 处理方法 |
|------|----------|
| 平台无法访问 | 检查服务状态，重启服务 `docker-compose restart` |
| 数据库连接失败 | 检查数据库服务，检查DATABASE_URL配置 |
| 题目环境挂了 | 重启容器 `docker restart container_name`，重置题目 |
| 大量恶意请求 | 封禁IP `iptables -I INPUT -s IP -j DROP`，启用限流 |
| Flag泄露 | 更换Flag `docker-compose exec ctfd flask reset`, 重置题目 |
| 队伍作弊 | 核实情况，取消成绩，保留日志证据 |

---

## 15.9 CTF学习路线

### 15.9.1 新手入门路线

#### 【通用】学习阶段规划

**第1阶段：基础入门（1-2个月）**

| 学习内容 | 推荐资源 |
|----------|----------|
| 计算机网络基础 | 《计算机网络》教材 |
| Linux基本操作 | 《鸟哥的Linux私房菜》 |
| Python编程 | 《Python编程：从入门到实践》 |
| CTF基本概念 | CTF Wiki (ctf-wiki.org) |
| 简单Misc和Crypto | XCTF攻防世界新手区 |

---

**第2阶段：Web方向（2-3个月）**

| 学习内容 | 推荐资源 |
|----------|----------|
| Web基础知识 | HTTP、HTML、JS、PHP |
| 常见Web漏洞 | DVWA、BWAPP |
| SQL注入 | sqlmap、手工注入 |
| XSS | Burp Suite、HackBar |
| CTF Web题 | Bugku、Web题目 |

---

**第3阶段：深入学习（持续）**

| 学习内容 | 推荐资源 |
|----------|----------|
| 选择主攻方向 | Web/Pwn/Reverse/Crypto |
| 深入学习相关知识 | 专业书籍、论文 |
| 参加线上比赛 | CTFTime.org |
| 看Writeup学习 | 先知社区、FreeBuf |

---

### 15.9.2 推荐学习资源

#### 【通用】书籍推荐

| 书籍 | 领域 | 说明 |
|------|------|------|
| 《Web安全深度剖析》 | Web | Web安全入门经典 |
| 《白帽子讲Web安全》 | Web | 吴翰清著作 |
| 《加密与解密》 | Reverse | 逆向工程入门 |
| 《0day安全：软件漏洞分析技术》 | Pwn | 漏洞分析经典 |
| 《CTF特训营》 | 综合 | CTF备赛指南 |

---

#### 【通用】网站推荐

| 网站 | 说明 |
|------|------|
| CTF Wiki | https://ctf-wiki.org |
| 先知社区 | https://xz.aliyun.com |
| FreeBuf | https://www.freebuf.com |
| 安全客 | https://www.anquanke.com |

---

## 15.10 安全与合规

### 15.10.1 比赛规则制定

#### 【通用】规则建议

```
1. 禁止攻击比赛平台本身
2. 禁止攻击其他参赛队伍
3. 禁止共享Flag和题解
4. 禁止使用扫描器大规模扫描
5. 违规队伍将被取消成绩
```

---

### 15.10.2 法律合规

#### 【通用】注意事项

- 确保题目环境完全隔离
- 不得用于真实攻击
- 遵守相关法律法规
- 保护参赛选手隐私

---

### 15.10.3 安全防护

#### 【通用】平台安全措施

| 措施 | 说明 |
|------|------|
| 平台WAF防护 | 防止SQL注入、XSS等攻击 |
| DDoS防护 | 防止流量攻击 |
| 输入验证过滤 | 验证所有用户输入 |
| 权限最小化 | 最小权限原则 |
| 定期安全审计 | 检查日志和配置 |

---

## 15.11 常见问题汇总

### 【通用】平台部署问题

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| Docker启动失败 | 端口占用或资源不足 | 检查端口 `netstat -tlnp`，增加内存 |
| 数据库连接错误 | 环境变量配置错误 | 检查DATABASE_URL是否正确 |
| 页面加载缓慢 | 资源不足或网络问题 | 升级服务器配置，检查网络 |
| 文件上传失败 | 权限或大小限制 | `chmod -R 777 uploads`，调整nginx限制 |

---

### 【通用】题目配置问题

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| Flag提交错误 | Flag格式错误 | 检查Flag前后空格和特殊字符 |
| 动态靶机启动失败 | Docker配置问题 | 检查docker.sock权限和镜像 |
| 题目分值异常 | 动态分值配置错误 | 检查Initial/Minimum/Decay参数 |
| 提示消耗积分 | 配置问题 | 检查题目配置中的Hint Cost |

---

### 【通用】比赛运营问题

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| 排行榜更新延迟 | 缓存问题 | 重启CTFd服务 |
| 参赛者无法注册 | 邮箱验证问题 | 关闭注册验证或配置邮箱 |
| Flag重复提交限制 | 平台限制 | 在配置中调整 |
| 题目意外关闭 | 超时设置 | 检查fronzo的配置 |

---

## 15.12 本章小结

本章介绍了CTF竞赛环境搭建，包括：

1. **CTFd平台部署**：Docker和源码两种安装方式
2. **题目管理**：创建题目、配置分值、上传附件
3. **动态靶机**：Docker容器化部署独立环境
4. **工具集**：Web、Pwn、Crypto、取证分析工具
5. **知名平台**：国内外CTF练习平台推荐
6. **比赛运营**：赛前检查、监控、应急处理

通过本章的学习，您将掌握搭建自己CTF靶场环境的方法，为组织比赛或进行练习提供支持。
