# CyberChef 万能数据处理工具完全指南

> 分类：工具指南 | 难度：入门→进阶 | 阅读时间：约40分钟

## 概述

CyberChef 是英国 GCHQ（英国政府通信总部）开源的一款"网络瑞士军刀"——一个基于浏览器的多功能数据处理工具箱。它通过拖拽式操作将 300+ 种编码、解码、加密、解密、压缩、分析等操作组合成"配方（Recipes）"，能优雅地解决各种数据处理难题。无论是 Base64 解码、Hex 转换、AES 解密、JWT 解析、正则提取、XOR 爆破、图片隐写分析，CyberChef 都能一站式搞定。对安全从业者来说，它就像一个"数据魔术师"——输入乱码，输出答案。

**核心特性**：
- 完全在浏览器中运行（本地计算，不发送数据到服务器）
- 300+ 操作模块（Operations），可自由组合
- 拖拽式配方构建（Recipe），实时预览结果
- 支持大文件处理
- 内置 Magic 模式：自动识别编码/加密方式

## 核心知识点

- Magic 模式：自动化解码
- 常用编码/解码操作
- 加密/解密配方构建
- JWT 分析、XOR 爆破
- 正则表达式与数据提取
- 自定义配方与自动化

---

## 一、使用方式

### 1.1 在线版

```
https://gchq.github.io/CyberChef/
# 完全本地运行（离线后仍可用）
```

### 1.2 本地部署

```bash
# 下载最新 Release
# https://github.com/gchq/CyberChef/releases

# 下载 CyberChef_v10.x.x.zip
# 解压后直接用浏览器打开 CyberChef_v10.x.x.html

# 或 Docker 部署（在内部网络中提供）
docker run -d -p 8080:80 mpepping/cyberchef
```

---

## 二、Magic 模式——自动化解码

Magic 是 CyberChef 最神奇的功能：**输入乱码数据，自动检测并应用正确的解码序列**。

```
操作步骤：
1. 将乱码数据粘贴到 Input 区域
2. 点击 Magic 魔棒按钮（或 Operations → 搜索 "Magic"）
3. 设置参数：
   - Intensive mode: 开启（更深入但更慢）
   - Depth: 5-10（递归解码深度）
4. 点击执行 → 查看自动解码结果

适用场景：
- 收到的可疑 Base64 字符串
- CTF 题目中的多层编码
- 未知的加密/编码数据
```

### Magic 实战示例

```
输入：Vm0wd2QyUXlVWGxWV0d4WFlURndVRlpzWkZOal...（一段 Base64）
Magic 自动识别：Base64 → Auto decode → 可能递归解码直到明文

输入：68656c6c6f20776f726c64（Hex 字符串）
Magic 自动识别：From Hex → UTF-8 → "hello world"

输入：%3Cscript%3Ealert(1)%3C%2Fscript%3E
Magic 自动识别：URL Decode → "<script>alert(1)</script>"
```

---

## 三、常用操作分类

### 3.1 编码/解码（Encoding）

| 操作 | 说明 | 快捷键 |
|:---|:---|:---|
| To Base64 / From Base64 | Base64 编解码 | 支持多种变体 |
| To Hex / From Hex | 十六进制 | 可选分隔符 |
| URL Encode / URL Decode | URL 编码 | 全编码/仅特殊字符 |
| HTML Entity / Strip HTML | HTML 实体 | |
| To Morse Code / From Morse | 莫尔斯电码 | |
| To Binary / From Binary | 二进制 | 1和0 |
| To Octal / From Octal | 八进制 | |
| To Decimal / From Decimal | 十进制（码点）| |
| To Punycode / From Punycode | Punycode 域名 | |
| Encode NetBIOS / Decode | NetBIOS 名称 | |

### 3.2 加密/解密（Encryption / Encoding）

| 操作 | 说明 |
|:---|:---|
| AES Encrypt / AES Decrypt | AES（CBC/ECB/GCM, 128/192/256）|
| DES Encrypt / DES Decrypt | DES |
| Triple DES | 3DES |
| RC2 / RC4 | RC 流密码 |
| XOR Brute Force | XOR 自动破解（显示频率分析结果）|
| XOR | 指定密钥的 XOR 加密 |
| ROT13 / ROT47 | 经典移位密码 |
| Vigenère Encode / Decode | 维吉尼亚密码 |
| Blowfish | Blowfish 加密 |
| Derive PBKDF2 key | PBKDF2 密钥派生 |
| Generate TOTP | TOTP 令牌生成 |
| RSA Encrypt / Decrypt | RSA |

### 3.3 哈希/HMAC

| 操作 | 说明 |
|:---|:---|
| MD5 / SHA1 / SHA2 / SHA3 | 哈希计算 |
| Bcrypt / Scrypt | 密码哈希 |
| HMAC | 消息认证码 |
| CRC-32 | 校验和 |
| Fletcher 校验和 | |
| Adler-32 | |

### 3.4 数据格式转换

| 操作 | 说明 |
|:---|:---|
| Parse JSON | JSON 美化和提取 |
| CSV to JSON / JSON to CSV | JSON↔CSV 互转 |
| XML Beautify | XML 格式化 |
| Parse URI | URI 参数解析 |
| Parse User Agent | UA 解析 |
| Parse SSH Host Key | SSH 密钥解析 |
| Parse ASN.1 hex string | ASN.1 DER 解析 |
| JWT Decode / Verify / Sign | JWT 完整处理 |
| Parse X.509 certificate | X.509 证书解析 |
| Parse PGP | PGP 解析 |
| Extract Files | 文件提取（从固件等）|

### 3.5 提取与分析

| 操作 | 说明 |
|:---|:---|
| Extract email addresses | 提取邮箱地址 |
| Extract IP addresses | 提取 IP |
| Extract URLs | 提取 URL |
| Extract domains | 提取域名 |
| Regular expression | 正则表达式提取/替换 |
| Strings | 提取可打印字符串 |
| Find / Replace | 查找替换 |
| Diff | 文本差异对比 |
| Entropy | 熵值计算（检测加密数据）|
| Frequency distribution | 字符频率分布 |

### 3.6 压缩

| 操作 | 说明 |
|:---|:---|
| Gzip / Gunzip | Gzip |
| Zip / Unzip | ZIP |
| Tar / Untar | TAR |
| Bzip2 | Bzip2 |
| Raw Deflate / Inflate | Deflate |
| Zlib Deflate / Inflate | Zlib |

---

## 四、JWT 分析实战

```
配方（Recipe）：
1. JWT Decode
   - 自动解析 Header、Payload、Signature
   - 显示算法：HS256/RS256/none
   - 试图验证签名

2. 如需修改 JWT：
   - JWT Decode → 修改 Payload → JWT Sign（如已知密钥）

场景1：JWT None 算法攻击
- Payload 中修改认证字段，Algorithm 改为 none
- 重新签名时不提供密钥

场景2：JWT 弱密钥爆破
- 解码 JWT → 提取 Payload+Signature
- 用外部分析工具（hashcat/john）爆破 HS256 密钥
```

---

## 五、XOR 爆破实战

```
配方（Recipe）：
1. From Hex（如果输入是 Hex）
2. XOR Brute Force
   - Key length: 1（单字节 XOR）
   - 按频率分析自动识别最可能的密钥
   - 结果按熵值和 ASCII 可读性排列

场景：CTF 密码学题目
输入：1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736
→ 单字节 XOR → 自动解密为一段文本
```

---

## 六、正则提取与数据处理

```
配方（Recipe）：
1. Fork（分支，同时处理）
2. 分支A：Regular expression → 提取模式1
3. 分支B：Regular expression → 提取模式2

示例：从日志中提取所有IP地址
输入：access.log
配方：
  Regular expression:
    Regex: \b(?:\d{1,3}\.){3}\d{1,3}\b
    Output format: List matches
  → Sort
  → Count occurrences
```

---

## 七、高级配方组合示例

### 多层编码揭开

```
输入：Vm0wd2QyUXlVWGxWV0d4V1YwZDRWMVl3WkRSV01WbDNXa1JTV0ZKdGVEQmFSV1JUVkcxU1Z...

配方1 - 自动（首选）：
  Magic → Intensive mode

配方2 - 手动（调优）：
  From Base64("A-Za-z0-9+/=") → 
  From Base64("A-Za-z0-9+/=") →
  From Hex →
  Plaintext
```

### 文件上传中的图片/文档分析

```
配方：
1. 输入：Base64 编码的文件内容
2. From Base64
3. Detect File Type（识别文件类型）
4. Render Image 或 Extract EXIF（如果是图片）
```

---

## 八、配置管理与离线使用

```
保存配方：点击配方区域右上角"Save"
加载配方：Operations → 搜索 "Load recipe"
分享配方：复制 URL（配方会编码在URL中）

离线使用：下载完整 HTML 文件后断网仍可运行
导出结果：点击 Output 区域右上角"Save to file"
批量处理：使用 Folder 输入模式
```

---

## 九、速查卡

```
在线地址：     https://gchq.github.io/CyberChef/
Magic模式：    Operations → Magic（自动化解码）
Base64解码：   From Base64
Hex解码：      From Hex
URL解码：      URL Decode
AES解密：      AES Decrypt（CBC, Key=..., IV=...）
XOR爆破：      XOR Brute Force
JWT解析：      JWT Decode
正则提取：     Regular expression → Regex: "pattern"
SHA256哈希：   SHA2-256
文件提取：     Extract Files
数据排序：     Sort lines
去重：         Unique
熵值计算：     Entropy
字符频率：     Frequency distribution
Gzip解压：     Gunzip → 提取内容
多层解码：     Magic（Intensive mode, Depth=10）
```

---

## 实战场景扩展

### 场景六：CTF 隐写分析

```bash
# 操作链：
1. From Charcode → 如果输入是一串数字，转回字符
2. Magic (Intensive, Depth=10) → 自动识别多层编码
3. Extract EXIF → 提取图片元数据（GPS、相机型号等）
4. Strings → 提取文件中的字符串
5. Entropy → 计算熵值判断是否有压缩/加密数据

# 图片隐写标准流程
Input: PNG/JPEG 文件（拖入或文件上传）
Recipe: 
  1. Extract EXIF（查看元数据线索）
  2. Strings → Min length: 4（提取所有长度≥4的字符串）
  3. 搜索 flag / CTF / ctf 等关键词
```

### 场景七：恶意软件 IOC 提取

```bash
# 从威胁报告中提取 IP/Domain
Input: 威胁情报文章文本

Recipe:
  1. Regular expression → User defined: 
     \b(?:\d{1,3}\.){3}\d{1,3}\b  （提取 IP）
  2. Extract email addresses（提取邮箱）
  3. Extract URLs（提取 URL）
  4. Sort lines → Unique（去重排序）

# 提取文件哈希
Recipe:
  1. Regular expression: [a-fA-F0-9]{32}  （MD5）
  2. Regular expression: [a-fA-F0-9]{40}  （SHA1）
  3. Regular expression: [a-fA-F0-9]{64}  （SHA256）
```

### 场景八：JWT Token 分析

```bash
# 操作：
1. JWT Decode（解析 Header + Payload）
2. JWT Verify（验证签名，需要密钥）
3. JWT Sign（重新签名）

# 漏洞检测流程
Input: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0...

Recipe:
  1. JWT Decode → 查看算法是否为 "none" 或 "HS256"
  2. 修改 payload 中的 role/admin 等字段
  3. 尝试 "alg": "none" 绕过签名验证
```

### 场景九：XOR 爆破与密钥恢复

```bash
# XOR Brute Force
Input: XOR 加密的 hex 数据

Recipe:
  1. From Hex（如果输入是 hex 格式）
  2. XOR Brute Force → Key length: 1-8
     - 查看频率分析结果
     - ASCII printable 比例最高的密钥最有可能是正确答案

# 已知明文攻击
Input: 加密数据 + 已知部分明文

Recipe:
  1. XOR → Key: XOR(input_hex, known_plaintext_hex)
  2. 用提取的 Key 解密整个文件
```

### 场景十：编码/解码竞赛挑战

```bash
# 多层编码挑战（CTF 常见）
Input: VGhlIGZsYWcgaXMgQ1RGe04wd19Zb3Vfa25vd19CYXNlNjQhfQ==

Recipe:
  1. From Base64
  2. From Hex（如果输出是 hex）
  3. From Morse Code（如果输出是莫尔斯码）
  4. ROT13（如果需要旋转）
  5. From Base64
  # 重复直到出现 flag 格式

# 使用 Magic（推荐）
Magic (Intensive, Depth=10, Extensive)
```

---

## 高级功能

### 加载外部数据

```
操作：Fork / Register
- Fork：将 Output 复制到新的独立 Input
- Register：创建一个"变量"，在其他操作中引用

示例流程：
1. 将密钥存入 Register（Register('key_value')）
2. AES Decrypt → Key: Register('key_value')
```

### 大文件处理

```
Recipe:
  1. Chunked data → 勾选 "Treat as chunks"
  2. 每个 chunk 独立处理
  3. 结果在原地拼接
适用：处理 GB 级别的日志/数据文件
```

### 自定义 Recipe 保存与分享

```
1. 构建好 Recipe
2. 点击 Save → 复制 URL（含 recipe 参数）
3. 分享 URL 给他人，对方打开即加载 Recipe
4. 或 Save 为 .json 文件本地保存
```

---

## 速查补充

```
正则提取 IP:       \b(?:\d{1,3}\.){3}\d{1,3}\b
正则提取 Email:     Extract email addresses
正则提取 URL:       Extract URLs
文件类型检测:       Detect File Type
PDF 解析:           Parse PDF
EXIF 提取:          Extract EXIF
字符串提取:         Strings
熵值分析:           Entropy
频率统计:           Frequency Distribution
图像隐写:           Randomize Colour Palette → View Bit Plane
图片隐写:           LSB extraction
```

---

## 安全使用提示

1. **数据不出浏览器**：CyberChef 完全本地运行，适合处理敏感数据
2. **离线部署**：下载单 HTML 文件，无需网络
3. **大文件谨慎**：浏览器内存有限，超大文件可能崩溃
4. **配方分享**：URL 中的 recipe 参数明文，注意信息安全

---

> 📖 本文为"网安百宝箱"课程配套读物。更新于 2026-06-18
