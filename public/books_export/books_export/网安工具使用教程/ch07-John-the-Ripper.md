# 第七章：John the Ripper - 密码破解工具

## 7.1 John 简介

### 什么是 John the Ripper？

想象你有一把万能钥匙，能尝试打开各种锁。**John the Ripper**就是这样的工具——一个专业的密码破解工具。

John可以破解：
- Linux系统密码（/etc/shadow）
- Windows密码（SAM文件）
- 加密文件密码（ZIP、RAR、PDF）
- 各种哈希（MD5、SHA、NTLM）

简单来说，John是**最经典的密码破解工具**，安全审计必备。

---

## 7.2 Windows 系统安装教程

### 下载安装

1. 访问：https://www.openwall.com/john/
2. 下载Windows版本（john-win.zip）
3. 解压到固定目录

### 目录结构

```
john/
├── run/
│   ├── john.exe        # 主程序
│   ├── john.conf       # 配置文件
│   └── password.lst    # 密码字典
└── doc/                 # 文档
```

### 运行测试

```batch
cd john\run
john.exe --test
```

进行性能测试，显示破解速度。

---

## 7.3 Linux 系统安装教程

### Kali Linux（预装）

Kali Linux预装了John：
```bash
john --test
```

### Ubuntu/Debian 安装

```bash
sudo apt install john
```

### 源码安装（最新版）

```bash
# 安装依赖
sudo apt install build-essential libssl-dev

# 下载源码
git clone https://github.com/openwall/john.git
cd john/src

# 编译
./configure
make -s clean && make -sj4

# 安装
sudo make install
```

---

## 7.4 基础破解命令详解

### 基本使用

```bash
john hash.txt
```

John会自动：
1. 识别哈希类型
2. 使用字典攻击
3. 显示破解结果

### 命令输出

```
Loaded 2 password hashes with 2 different salts (md5crypt [MD5 32/64])
Remaining 1 password hash
Press 'q' or Ctrl-C to abort, almost any other key for status
admin            (user1)
```

### 常用参数

| 参数 | 说明 |
|------|------|
| --wordlist=FILE | 使用字典文件 |
| --rules | 使用字典规则 |
| --incremental | 增量破解（暴力） |
| --single | 单模式破解 |
| --show | 显示已破解密码 |
| --test | 性能测试 |
| --format=TYPE | 指定哈希格式 |

---

## 7.5 字典攻击详解

### 什么是字典攻击？

字典攻击使用预先准备好的密码列表，逐个尝试。

**通俗理解：**
像拿着一份常见密码清单，一个个尝试打开锁。

### 使用字典

```bash
john --wordlist=password.lst hash.txt
```

### 字典文件

John自带字典：`password.lst`

常用字典：
| 字典 | 说明 |
|------|------|
| password.lst | John自带字典 |
| rockyou.txt | 1400万密码（著名） |
| crackstation.txt | 超大字典 |

### 字典规则

```bash
john --wordlist=password.lst --rules hash.txt
```

规则会对字典中的密码进行变换：
- 大小写变化：admin → Admin, ADMIN
- 数字添加：admin → admin1, admin123
- 字符替换：admin → adm1n

---

## 7.6 模式攻击详解

### 增量破解（Incremental）

暴力破解所有可能组合：
```bash
john --incremental hash.txt
```

**参数控制：**
```bash
john --incremental:Lower hash.txt
john --incremental:Digits hash.txt
john --incremental:Alnum hash.txt
```

### 单模式破解（Single）

使用用户名等信息生成密码：
```bash
john --single hash.txt
```

会尝试：
- 用户名本身
- 用户名倒序
- 用户名+数字

---

## 7.7 常见密码格式破解

### MD5破解

**格式：**
```
$1$salt$hash
```

**破解：**
```bash
john --format=md5crypt hash.txt
```

### SHA-256破解

**格式：**
```
$5$rounds=5000$salt$hash
```

**破解：**
```bash
john --format=sha256crypt hash.txt
```

### NTLM破解

**格式：**
```
user::domain:LM:NTLM:::
```

**破解：**
```bash
john --format=NT hash.txt
```

### 查看所有支持的格式

```bash
john --list=formats
```

---

## 7.8 实战案例：Linux Shadow破解

### 获取Shadow文件

Shadow文件位于`/etc/shadow`，格式：
```
username:$hash$salt$encrypted:...
```

### 准备破解文件

复制shadow内容到文件：
```bash
cat /etc/shadow > hash.txt
```

或只提取特定用户：
```bash
grep "username" /etc/shadow > hash.txt
```

### 破解密码

```bash
john --wordlist=rockyou.txt hash.txt
```

### 查看结果

```bash
john --show hash.txt
```

---

## 7.9 实战案例：Windows SAM破解

### 获取SAM哈希

需要：
- SAM文件：`C:\Windows\System32\config\SAM`
- SYSTEM文件：`C:\Windows\System32\config\SYSTEM`

使用工具提取哈希（如samdump2）：
```bash
samdump2 SYSTEM SAM > hash.txt
```

或使用mimikatz直接提取。

### 破解密码

```bash
john --format=NT hash.txt
```

---

## 7.10 实战案例：ZIP文件破解

### 获取ZIP密码哈希

使用zip2john提取：
```bash
zip2john protected.zip > hash.txt
```

### 破解密码

```bash
john hash.txt
```

---

## 总结

本章介绍了John the Ripper的使用：

1. **安装配置**：Windows/Linux安装
2. **基本命令**：字典攻击、模式攻击
3. **哈希格式**：MD5、SHA、NTLM
4. **实战案例**：Linux、Windows、ZIP破解

John是密码破解的经典工具，掌握它能够进行有效的安全审计。

下一章我们将学习Hashcat——GPU密码破解神器！