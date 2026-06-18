# John the Ripper 离线密码审计工具深度指南

> 分类：工具指南 | 难度：进阶 | 阅读时间：约45分钟

## 概述

John the Ripper（简称 John）是最经典的开源密码安全审计工具，由 Solar Designer 于 1996 年创建，至今仍在活跃维护。它支持数百种密码哈希格式，内置强大的规则引擎和多种破解模式（单词表、单破解、增量模式、外部模式）。John 的强项在于其高度可定制性——可以精细控制规则、密码长度、字符集，是离线密码安全审计领域不可替代的工具。

**与 hashcat 互补**：
- hashcat：GPU 加速王者，适合大规模快速破解
- John：CPU 精细控制，规则更灵活，格式支持更广
- 两者配合使用是最佳实践

## 核心知识点

- John 的四种破解模式
- /etc/john/john.conf 配置与规则定制
- 哈希提取工具（unshadow、zip2john、rar2john 等）
- John the Ripper Jumbo 社区增强版
- 与 hashcat 的配合策略

---

## 一、安装

```bash
# Kali Linux（预装）
sudo apt install john -y

# Ubuntu/Debian
sudo apt install john -y

# macOS
brew install john-jumbo

# 从源码编译（Jumbo 社区增强版）
git clone https://github.com/openwall/john.git
cd john/src
./configure
make -s clean && make -sj4
sudo make install

# 验证
john --version
john --list=formats | head -20
john --test                          # 基准测试（CPU）
```

---

## 二、四种破解模式

### 2.1 Wordlist 模式（字典攻击）

```bash
# 基础字典
john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt

# 多字典
john --wordlist=dict1.txt hashes.txt
john --wordlist=dict2.txt hashes.txt

# 字典 + 规则
john --wordlist=/usr/share/wordlists/rockyou.txt --rules hashes.txt

# 指定规则集
john --wordlist=dict.txt --rules=Single hashes.txt
john --wordlist=dict.txt --rules=Wordlist hashes.txt
john --wordlist=dict.txt --rules=Jumbo hashes.txt
```

### 2.2 Single Crack 模式（最快，利用用户信息）

```bash
# 自动从 GECOS 字段提取并生成候选（基于用户名等）
john --single hashes.txt

# 适用于 /etc/shadow 格式（含用户名）
# 生成规则示例：
# 用户名 → 反转、大小写变换、加数字后缀
# admin → nimda, Admin, admin123, admin! 等
```

### 2.3 Incremental 模式（增强型暴力破解）

```bash
# 最强大的模式，自动使用 trigraph 频率统计
john --incremental hashes.txt

# 限制字符集
john --incremental=LowerNum hashes.txt     # 小写字母+数字
john --incremental=Alpha hashes.txt         # 字母
john --incremental=Digits hashes.txt        # 纯数字
john --incremental=LanMan hashes.txt        # LM 哈希专用

# 自定义字符集
john --incremental --mask='?l?l?l?l?d?d?d?d' hashes.txt

# 限制长度
john --incremental --min-length=8 --max-length=12 hashes.txt
```

### 2.4 自定义字符集 + 掩码攻击（Jumbo 版本）

```bash
# 掩码攻击（Jumbo 版本特性）
john --mask='?u?l?l?l?l?l?d?d' hashes.txt        # 大写+5小写+2数字
john --mask='?u?l?l?l?l?l?d?d' --min-length=8 --max-length=12 hashes.txt

# 掩码占位符：
# ?l 小写字母      ?u 大写字母
# ?d 数字          ?s 特殊字符
# ?a 全部          ?w 自定义占位符
# ?1..?9 自定义字符集（在 john.conf 中定义）
```

---

## 三、配置文件与规则定制

### 3.1 john.conf 位置

```
Linux:   /etc/john/john.conf 或 ~/.john/john.conf
Kali:    /etc/john/john.conf
macOS:   /usr/local/Cellar/john-jumbo/.../etc/john.conf
自定义:  ~/.john/john.conf
```

### 3.2 List.Rules:Wordlist 规则

```
# 编写自定义规则文件
cat > my_rules.conf << 'EOF'
[List.Rules:MyCustom]
# 原词 + 常见后缀
$1$2$3
$1$2$3$4$5$6
$!
$@
$#
$1$2$3$!
$2$0$2$4
# 首字母大写 + 后缀
c $1
c $1$2$3
c $!
# 全大写 + 后缀
u $1$2$3
u $!
# leet 替换
so0 se3 si1
so0 se3 si1 $1
# 反转 + 后缀
r $1$2$3
EOF

# 应用自定义规则
john --wordlist=dict.txt --rules=MyCustom hashes.txt
```

---

## 四、哈希提取工具（*2john 系列）

```bash
# 系统文件
unshadow /etc/passwd /etc/shadow > system_hashes.txt

# 压缩文件
zip2john archive.zip > zip_hash.txt
rar2john archive.rar > rar_hash.txt
7z2john archive.7z > 7z_hash.txt

# 文档
office2john document.docx > office_hash.txt
pdf2john document.pdf > pdf_hash.txt

# 加密磁盘
bitlocker2john -i image.dd > bitlocker_hash.txt
truecrypt2john volume.tc > tc_hash.txt
veracrypt2john volume.hc > vc_hash.txt

# 网络协议
# SSH 私钥（约翰破解私钥密码）
ssh2john id_rsa > ssh_hash.txt

# WPA/WPA2（需要 Jumbo 版本）
# 先用 hcxpcapngtool 转换

# 数据库
keepass2john database.kdbx > keepass_hash.txt

# 破解
john --wordlist=wordlist.txt zip_hash.txt
```

---

## 五、会话管理

```bash
# 保存会话
john --session=mycrack --wordlist=dict.txt hashes.txt
# Ctrl+C 中断（自动保存）

# 恢复会话
john --restore=mycrack

# 查看已破解的哈希
john --show hashes.txt
john --show --users=admin hashes.txt

# 查看破解进度
john --status=mycrack
```

---

## 六、输出与报告

```bash
# 查看已破解密码
john --show hashes.txt

# 导出所有已破解（明文格式，适合作为字典继续攻击）
john --show hashes.txt | awk -F: '{print $2}' > cracked_passwords.txt

# 导出破解后保留原哈希的
john --show --format=nt hashes.txt
```

---

## 七、与 hashcat 配合策略

```bash
# 策略1：John 快速生成字典 → hashcat GPU 破解
john --wordlist=base_dict.txt --rules=jumbo --stdout | \
    hashcat -m 1000 -a 0 ntlm_hashes.txt

# 策略2：John 做规则优化/Single crack → hashcat 做 brute-force
# 先用 John 快速尝试基于用户名的变体
john --single hashes.txt
# 失败的用 hashcat GPU 暴力
hashcat -m 0 -a 3 uncracked.txt ?a?a?a?a?a?a?a?a

# 策略3：hashcat 生成候选密码 → John 规则变形
hashcat --stdout -a 3 ?l?l?l?l?d?d?d?d | \
    john --stdin --rules=jumbo hashes.txt
```

---

## 八、实战场景

### 场景一：/etc/shadow 破解

```bash
unshadow /etc/passwd /etc/shadow > hashes.txt
john --wordlist=rockyou.txt hashes.txt
john --incremental hashes.txt    # 如果字典失败
```

### 场景二：Windows SAM/NTLM 哈希

```bash
# 提取注册表 SAM + SYSTEM 后
samdump2 SYSTEM SAM > sam_hashes.txt
john --format=nt --wordlist=rockyou.txt sam_hashes.txt
```

### 场景三：SSH 私钥密码破解

```bash
ssh2john id_rsa > ssh_hash.txt
john --wordlist=rockyou.txt ssh_hash.txt
john --incremental=LowerNum ssh_hash.txt
```

### 场景四：ZIP 压缩包密码

```bash
zip2john encrypted.zip > zip_hash.txt
john --wordlist=rockyou.txt zip_hash.txt
```

---

## 九、速查卡

```
基本语法：       john [options] hash_file
字典模式：       --wordlist=dict.txt
规则模式：       --rules[=RuleName]
Single模式：     --single
增量模式：       --incremental[=Mode]
掩码模式：       --mask='?u?l?l?l?l?d?d'
会话保存：       --session=NAME
会话恢复：       --restore=NAME
查看结果：       --show hash_file
格式指定：       --format=nt
导出密码字典：   --show | awk -F: '{print $2}'
```

---

## 实战场景扩展

### 场景五：Linux /etc/shadow 密码审计

```bash
# 1. 合并 passwd 和 shadow
unshadow /etc/passwd /etc/shadow > unshadowed.txt

# 2. 破解
john --wordlist=rockyou.txt unshadowed.txt
john --wordlist=rockyou.txt --rules=best64 unshadowed.txt

# 3. 查看结果
john --show unshadowed.txt

# 4. 仅破解特定用户
john --users=root,admin,user1 unshadowed.txt

# 5. 恢复中断的会话
john --restore
```

### 场景六：Windows NTLM 哈希批量审计

```bash
# 哈希格式：
# Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::

john --format=nt nt_hashes.txt
john --format=nt --wordlist=rockyou.txt --rules=best64 nt_hashes.txt

# 统计破解率
total=$(wc -l < nt_hashes.txt)
cracked=$(john --show --format=nt nt_hashes.txt | wc -l)
echo "破解率: $((cracked * 100 / total))%"
```

### 场景七：ZIP 文件密码恢复

```bash
# 提取 ZIP 哈希
zip2john encrypted.zip > zip_hash.txt

# 破解（纯字典）
john --wordlist=rockyou.txt zip_hash.txt

# 规则增强
john --wordlist=rockyou.txt --rules=best64 zip_hash.txt

# 掩码攻击：假设密码是6-8位纯数字
john --mask='?d?d?d?d?d?d' zip_hash.txt
john --mask='?d?d?d?d?d?d?d?d' zip_hash.txt --min-len=6 --max-len=8

# 增量模式（慢但全面）
john --incremental=Digits zip_hash.txt
```

### 场景八：RAR 文件密码恢复

```bash
rar2john encrypted.rar > rar_hash.txt
john --wordlist=rockyou.txt --rules=dive rar_hash.txt

# RAR5 格式
rar2john encrypted.rar5 > rar5_hash.txt
john --format=rar5 rar5_hash.txt
```

### 场景九：PDF 密码恢复

```bash
# 安装 pdf2john（John 自带）
pdf2john.pl document.pdf > pdf_hash.txt
john --wordlist=rockyou.txt pdf_hash.txt
```

### 场景十：使用社区增强字典

```bash
# 组合攻击：两个单词合并
john --wordlist=dict1.txt --rules=Wordlist --stdout | \
  john --pipe --wordlist=dict2.txt hashes.txt

# 使用 PRINCE 模式（智能组合）
john --prince=rockyou.txt hashes.txt

# 循环模式（Loopback）：用已破解的密码变种继续攻击
john --loopback hashes.txt
```

---

## 自定义规则深入

```bash
# $JOHN/john.conf 规则语法

[List.Rules:MyCustom]
# 首字母大写 + 追加年份和特殊字符
c $2 $0 $2 $4 $!

# 替换规则：l337 speak
s@a s3e s!i s0o s\$s

# 大小写变种
c [lc] u

# 数字后缀 0-99
$[0-9] $[0-9]

# 日期后缀
$[01] $[0-9] $[0-9] $[0-9]

# 使用自定义规则
john --wordlist=dict.txt --rules=MyCustom hashes.txt
```

---

## 性能优化

```bash
# 指定 CPU 核心数
john --wordlist=rockyou.txt --fork=4 hashes.txt

# OpenMP 并行（自动检测）
OMP_NUM_THREADS=8 john --wordlist=rockyou.txt hashes.txt

# 使用 GPU（OpenCL）
john --format=nt-opencl nt_hashes.txt
john --list=opencl-devices

# 限制内存使用（防止 OOM）
john --wordlist=rockyou.txt --rules=best64 --max-candidates=10000000 hashes.txt
```

---

> 📖 本文为"网安百宝箱"课程配套读物。更新于 2026-06-18
