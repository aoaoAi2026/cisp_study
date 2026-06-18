# hashcat GPU密码破解实战指南

> 分类：工具指南 | 难度：进阶→精通 | 阅读时间：约50分钟

## 概述

hashcat 是世界上最快的密码恢复工具，利用 GPU 进行大规模并行计算。它被安全研究人员、渗透测试员和数字取证专家广泛用于密码安全评估。hashcat 支持 300+ 哈希算法，包括 MD5、SHA-1、SHA-256、NTLM、WPA/WPA2、Kerberos、bcrypt、sha512crypt 等，并支持多种攻击模式（字典、组合、掩码、规则混合）。

**核心优势**：
- 纯 C 编写，OpenCL/CUDA/Metal 全平台 GPU 加速
- 单 GPU 可达数十亿次/秒的 MD5 计算
- 内置强大的规则引擎（Rule Engine）
- 支持分布式破解
- 跨平台（Linux/Windows/macOS）

## 核心知识点

- hashcat 的安装与 GPU 驱动配置
- 六种攻击模式详解
- 规则引擎与自定义规则编写
- 掩码攻击与字符集定制
- 哈希类型指定与识别
- 性能优化与硬件选择
- 与 John the Ripper 的对比与配合

---

## 一、安装与环境配置

### 1.1 GPU 驱动准备

```bash
# === NVIDIA GPU ===
# Ubuntu/Debian
sudo apt install nvidia-driver-535 nvidia-cuda-toolkit -y
nvidia-smi   # 验证

# === AMD GPU ===
# Ubuntu/Debian (ROCm)
# 参考：https://rocm.docs.amd.com

# === Intel GPU ===
# 使用 Intel Compute Runtime + oneAPI Level Zero
```

### 1.2 安装 hashcat

```bash
# Kali Linux（预装）
sudo apt install hashcat -y

# Ubuntu/Debian
sudo apt install hashcat hashcat-data -y

# macOS
brew install hashcat

# Windows
# 下载：https://hashcat.net/hashcat/
# 解压到 C:\hashcat\，将路径添加到系统 PATH

# 从源码编译
git clone https://github.com/hashcat/hashcat.git
cd hashcat
make
sudo make install

# 验证 GPU 识别
hashcat -I       # 列出所有 OpenCL/CUDA 设备
hashcat -b       # 基准测试（Benchmark）
```

### 1.3 查看支持的哈希类型

```bash
# 列出所有支持的哈希模式
hashcat --help | grep -A 3 "Hash modes"

# 查看特定类型的模式编号
hashcat --help | grep -i ntlm
hashcat --help | grep -i wpa
hashcat --help | grep -i bcrypt

# 常用模式编号速查
# 0     = MD5
# 100   = SHA1
# 1000  = NTLM
# 3000  = LM
# 5500  = NetNTLMv1
# 5600  = NetNTLMv2
# 13100 = Kerberos 5 TGS-REP etype 23
# 1400  = SHA2-256
# 1700  = SHA2-512
# 22000 = WPA-PBKDF2-PMKID+EAPOL
# 2500  = WPA-EAPOL-PBKDF2（旧版）
# 3200  = bcrypt $2*$ Blowfish
# 1800  = sha512crypt $6$
# 18200 = Kerberos 5 AS-REP etype 23
# 13400 = Keepass
# 11600 = 7-Zip
```

---

## 二、六种攻击模式

### 2.1 模式 0 — Straight（字典攻击）

```bash
# 基础字典攻击
hashcat -m 0 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt

# 带规则
hashcat -m 1000 -a 0 ntlm_hashes.txt /usr/share/wordlists/rockyou.txt -r rules/best64.rule

# 多字典文件
hashcat -m 0 -a 0 md5_hashes.txt dict1.txt dict2.txt dict3.txt
```

### 2.2 模式 1 — Combination（组合攻击）

```bash
# 两个字典的笛卡尔积（每个词组合）
hashcat -m 0 -a 1 hashes.txt dict1.txt dict2.txt

# 适用场景：
# - 名字 + 数字（John1985, Mary1990）
# - 单词 + 后缀（password123, admin!）
# - 前缀 + 后缀混合
```

### 2.3 模式 3 — Brute-force / Mask attack（掩码攻击）

```bash
# 掩码语法（？表示字符集）
# ?l = abcdefghijklmnopqrstuvwxyz（小写字母）
# ?u = ABCDEFGHIJKLMNOPQRSTUVWXYZ（大写字母）
# ?d = 0123456789（数字）
# ?s = 特殊字符（空格!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~）
# ?a = ?l?u?d?s（全字符集）
# ?b = 0x00 - 0xff（所有字节）
# ?h = 十六进制（0-9a-f）
# ?H = 十六进制大写（0-9A-F）

# 示例：8位纯数字密码
hashcat -m 0 -a 3 hashes.txt ?d?d?d?d?d?d?d?d

# 示例：字母开头 + 6位数字
hashcat -m 0 -a 3 hashes.txt ?l?d?d?d?d?d?d

# 示例：公司密码模式（大写+5小写+2数字+1特殊字符）
hashcat -m 0 -a 3 hashes.txt ?u?l?l?l?l?l?d?d?s

# 自定义字符集
# -1: 自定义字符集1
# -2: 自定义字符集2
# -3: 自定义字符集3
# -4: 自定义字符集4

hashcat -m 0 -a 3 hashes.txt -1 ?l?u ?1?1?1?1?d?d?d?d
# 4位字母 + 4位数字

hashcat -m 0 -a 3 hashes.txt -1 ?d?l?u -2 ?d?l?u?s ?1?1?1?1?2
# 前4位=字母数字混合，后1位=全字符
```

### 2.4 模式 6 — Hybrid Wordlist + Mask（字典+掩码）

```bash
# 字典词后追加掩码
hashcat -m 0 -a 6 hashes.txt dict.txt ?d?d?d
# 生成：password000, password001 ... password999

# 常见模式
hashcat -m 0 -a 6 hashes.txt dict.txt ?d?d?s    # 词+2数字+1特殊字符
hashcat -m 0 -a 6 hashes.txt dict.txt ?d?d?d?d  # 词+4位年份

# 两个字典 + 追加掩码
hashcat -m 0 -a 6 hashes.txt dict1.txt ?d?d dict2.txt ?d?d?d
```

### 2.5 模式 7 — Hybrid Mask + Wordlist（掩码+字典）

```bash
# 掩码作为前缀，追加字典词
hashcat -m 0 -a 7 hashes.txt ?d?d?d dict.txt
# 生成：000password, 001password ... 999password
```

### 2.6 模式 9 — Association attack（关联攻击）

```bash
# 单哈希对应单词典（一行一个用户名:哈希值对）
# hash.txt 格式：username:hash
# dict.txt 格式：username:password_candidate

hashcat -m 0 -a 9 hashes.txt dict.txt
```

---

## 三、规则引擎（Rule Engine）

### 3.1 内置规则

```bash
# 列出内置规则文件
ls /usr/share/hashcat/rules/

# 常用内置规则
hashcat -m 1000 -a 0 ntlm_hashes.txt /usr/share/wordlists/rockyou.txt -r rules/best64.rule
hashcat -m 0 -a 0 hashes.txt dict.txt -r rules/dive.rule
hashcat -m 0 -a 0 hashes.txt dict.txt -r rules/OneRuleToRuleThemAll.rule
hashcat -m 0 -a 0 hashes.txt dict.txt -r rules/T0XlC.rule
hashcat -m 0 -a 0 hashes.txt dict.txt -r rules/rockyou-30000.rule
```

### 3.2 规则语法

```
# 大小写变换
l   → 转小写        u   → 转大写
t   → 首字母大写      T   → 每个单词首字母大写
c   → 首字母大写其余小写

# 字符替换
sXY → 将X替换为Y      @X  → 删除所有X
s01 → 将0替换为1      sa@ → a→@  (@dmin)
se3 → e→3 (h3llo)    so0 → o→0 (passw0rd)
si1 → i→1 (adm1n)

# 追加
$X  → 末尾追加字符X    $1$2$3 → 末尾追加123
^X  → 行首插入字符X

# 数字追加
]   → 删除最后一个字符
[   → 删除第一个字符
Dn  → 删除位置n的字符

# 组合操作
$! so0                      → 末尾加!后o→0
c $1                        → 首字母大写+加1
u $! ]                      → 全大写+加!+删尾字符
```

### 3.3 自定义规则示例

```bash
# my_rule.rule
# 规则1：原词 + 常见年份
$1$9$8$0
$2$0$0$0
$2$0$2$0
$2$0$2$3
$2$0$2$4

# 规则2：常见后缀
$1$2$3
$!
$@
$#
$1$2$3$!
$!

# 规则3：大小写变换 + 数字追加
c $1 $2 $3
c $!
u $1 $2 $3

# 规则4：leet变换 + 年份
so0 se3 si1 $2$0$2$4
so0 se3 si1 $!
```

---

## 四、实战场景

### 场景一：NTLM 哈希破解（Windows 本地账户）

```bash
# hashcat 模式 1000 = NTLM
hashcat -m 1000 -a 0 ntlm.txt wordlist.txt -r rules/best64.rule -O

# -O: 优化模式（32字符内有效，速度提升）
# -w 3: workload profile (1=低功耗, 2=默认, 3=高性能, 4=极限)
hashcat -m 1000 -a 0 ntlm.txt wordlist.txt -r rules/best64.rule -O -w 3
```

### 场景二：WPA/WPA2 WiFi 密码破解

```bash
# 先抓取握手包
# airodump-ng wlan0mon → 等待握手 → 保存为 capture.cap

# 转换为 hashcat 格式（新版可自动识别）
# 旧版：hashcat-utils cap2hccapx
hcxpcapngtool capture.pcapng -o hash.hc22000

# 破解
hashcat -m 22000 -a 0 hash.hc22000 wordlist.txt
hashcat -m 22000 -a 3 hash.hc22000 ?d?d?d?d?d?d?d?d   # 8位数字
```

### 场景三：Kerberos 票据破解（内网渗透）

```bash
# Kerberos TGS-REP (krbtgt hash)
hashcat -m 13100 -a 0 kerb_tgs.txt wordlist.txt -r rules/best64.rule

# Kerberos AS-REP (AS-REP roasting)
hashcat -m 18200 -a 0 asrep_hash.txt wordlist.txt -r rules/best64.rule
```

### 场景四：压缩文件密码破解

```bash
# ZIP
hashcat -m 13600 -a 0 zip_hash.txt wordlist.txt

# 7-Zip
hashcat -m 11600 -a 0 7zip_hash.txt wordlist.txt

# RAR5
hashcat -m 13000 -a 0 rar_hash.txt wordlist.txt

# PDF
hashcat -m 10500 -a 0 pdf_hash.txt wordlist.txt

# Office 文档（需先用 office2john 提取哈希）
# python office2john.py document.docx > hash.txt
hashcat -m 9600 -a 0 hash.txt wordlist.txt
```

### 场景五：Linux /etc/shadow 破解

```bash
# 先用 unshadow 合并 passwd 和 shadow
unshadow /etc/passwd /etc/shadow > unshadowed.txt

# sha512crypt ($6$) → mode 1800
hashcat -m 1800 -a 0 unshadowed.txt wordlist.txt

# bcrypt ($2b$/$2y$/$2a$) → mode 3200
hashcat -m 3200 -a 0 bcrypt_hash.txt wordlist.txt -w 3
# bcrypt 极慢！GPU 仅数千次/秒
```

---

## 五、性能优化

### 5.1 Workload Profile

```bash
# -w 1: 功耗优化（桌面同时使用）
# -w 2: 默认
# -w 3: 高性能（推荐，不需交互）
# -w 4: 极限性能
hashcat -m 0 -a 0 hashes.txt dict.txt -w 3
```

### 5.2 优化内核

```bash
# -O: 优化内核（密码 ≤32字符，跳过一些罕见情况）
hashcat -m 1000 -a 0 hashes.txt dict.txt -O

# --force: 强制运行（忽略部分警告）
# --force 慎用！
```

### 5.3 分布式破解

```bash
# 主节点
hashcat -m 0 -a 0 hashes.txt dict.txt --status --status-timer=10

# 使用 Hashtopolis / Hashstack 等分布式框架
# 或手动分片：
# 节点1: hashcat -s 0 -l 5000000 ...
# 节点2: hashcat -s 5000001 ...
```

### 5.4 会话管理

```bash
# 保存会话（支持断点续破）
hashcat -m 1000 -a 0 hashes.txt dict.txt --session=ntlm_crack

# 恢复会话
hashcat --session=ntlm_crack --restore

# 查看进度
# 运行时按 [s] 键显示状态
# 按 [p] 暂停, [r] 恢复, [q] 退出并保存
```

---

## 六、hashcat-utils 辅助工具

```bash
# 安装
sudo apt install hashcat-utils

# 常用工具
# cap2hccapx: WPA pcap→hashcat格式（旧版）
# combinator: 两个字典的组合
combinator dict1.txt dict2.txt > combined.txt

# rli2: 规则过滤
# splitlen: 按键长分割字典
splitlen dict.txt 8 12  # 提取8-12位的条目
```

---

## 七、hashcat vs John the Ripper 对比

| 特性 | hashcat | John the Ripper |
|:---|:---|:---|
| GPU 加速 | 原生、极快 | 支持（OpenCL），较慢 |
| 哈希类型 | 300+ | 200+ |
| 规则引擎 | 极强 | 强 |
| 掩码攻击 | 专长 | 支持 |
| 学习曲线 | 中 | 中低 |
| 输出报告 | 纯文本 | 支持 pot 文件 |
| 许可证 | MIT | GPL |

**建议**：GPU 可用时首选 hashcat；CPU-only 环境用 John；复杂规则/自定义场景两者配合使用。

---

## 八、速查卡

```
NTLM：              -m 1000
WPA/WPA2：          -m 22000
Kerberos TGS：      -m 13100
sha512crypt ($6$)： -m 1800
bcrypt：            -m 3200
MD5：               -m 0
SHA1：              -m 100
NetNTLMv2：         -m 5600
ZIP：               -m 13600
7-Zip：             -m 11600
Office：            -m 9600
PDF：               -m 10500

字典:       -a 0
组合:       -a 1
掩码:       -a 3
字典+掩码:  -a 6
掩码+字典:  -a 7

规则:       -r rules/best64.rule
优化:       -O -w 3
会话恢复:   --session=NAME --restore
掩码字符:   ?l(小写) ?u(大写) ?d(数字) ?s(特殊) ?a(全部)
```

---

## 九、规则引擎深度解析

### 9.1 内置规则一览

```bash
# 查看所有内置规则
ls /usr/share/hashcat/rules/

# 常用规则说明
-r rules/best64.rule          # 64条最佳规则（性价比最高）
-r rules/d3ad0ne.rule         # 34000+条规则（综合性强）
-r rules/dive.rule            # 适合大字典的规则
-r rules/T0XlC.rule           # 4000+条规则
-r rules/rockyou-30000.rule   # 基于 rockyou 数据统计的规则
-r rules/OneRuleToRuleThemAll.rule  # 社区最强组合规则（52000+）
-r rules/InsidePro-HashManager.rule # 商业工具风格规则
-r rules/Incisive-leetspeak.rule    # leetspeak 专用规则
```

### 9.2 规则语法详解

hashcat 规则语法（规则文件每行一条规则）：

| 规则 | 功能 | 示例 |
|:---|:---|:---|
| `:` | 不做任何修改 | - |
| `l` | 转小写 | Password → password |
| `u` | 转大写 | password → PASSWORD |
| `c` | 首字母大写 | password → Password |
| `C` | 首字母小写 | Password → password |
| `t` | 反转大小写 | PassWord → pASSwORD |
| `T N` | 切换位置N的大小写 | T 3: pasSword |
| `r` | 反转字符串 | password → drowssap |
| `d` | 复制整个单词 | pass → passpass |
| `p N` | 复制第N个字符 | p 2: pass → paass |
| `f` | 反射/镜像 | pass → passssap |
| `{` | 左移 | password → asswordp |
| `}` | 右移 | password → dpasswor |
| `$X` | 追加字符X | $1: pass → pass1 |
| `^X` | 前插字符X | ^@: pass → @pass |
| `[` | 删除首字符 | password → assword |
| `]` | 删除末字符 | password → passwor |
| `D N` | 删除位置N字符 | D 2: password → pssword |
| `sXY` | 替换X为Y | s$! → pass!word |
| `@X` | 删除所有X字符 | @a → password → pssword |
| `iNX` | 在位置N插入X | i4!: pass → pass!word |
| `oNX` | 覆盖位置N为X | o0P: pass → Pass |
| `'N` | 截断到长度N | '4: password → pass |
| `kN` | 保留前N个字符 | k4: password → pass |
| `xNM` | 提取N到M范围的字符 | x12: password → a |

### 9.3 自定义规则编写

```bash
# 文件：my_rules.rule

# 规则1：首字母大写 + 追加年份
c $2 $0 $2 $6

# 规则2：全部大写 + 追加!
u $!

# 规则3：小写 + 追加@公司域名
l $@ $c $o $m $p $a $n $y $. $c $o $m

# 规则4：leet替换 a→4 e→3 i→1 o→0 s→5
sa4 se3 si1 so0

# 规则5：反转 + 追加123
r $1 $2 $3

# 使用
hashcat -m 0 -a 0 hashes.txt dict.txt -r my_rules.rule
```

---

## 十、实战场景扩展

### 场景五：AD域控 NTLM 哈希破解

```bash
# 从域控导出哈希（使用 secretsdump.py / Mimikatz）
# impacket-secretsdump domain/admin:password@dc01.corp.local
# 提取 NTLM 哈希部分保存为 ntlm_hashes.txt

# 破解 NTLM
hashcat -m 1000 ntlm_hashes.txt \
  /usr/share/wordlists/rockyou.txt \
  -r rules/best64.rule \
  -O -w 3

# 查看结果
hashcat -m 1000 ntlm_hashes.txt --show

# 统计破解率
hashcat -m 1000 ntlm_hashes.txt --show | wc -l
# 除以总哈希数 = 破解率
```

### 场景六：Office 文档密码恢复

```bash
# Office 2013+ 使用非常复杂的哈希 (m 9600)
# 成功率取决于密码复杂度

# 先用小字典试探
hashcat -m 9600 office_hash.txt \
  /usr/share/wordlists/rockyou.txt \
  -r rules/best64.rule

# 掩码攻击：假设密码是8位字母数字
hashcat -m 9600 office_hash.txt \
  -a 3 ?a?a?a?a?a?a?a?a \
  --increment --increment-min 6 \
  -O -w 3

# 组合攻击：词组+数字后缀
hashcat -m 9600 office_hash.txt \
  -a 6 /usr/share/wordlists/common_words.txt ?d?d?d?d
```

### 场景七：PDF 密码恢复

```bash
# 提取PDF哈希（使用 pdf2john.pl 或 john）
# pdf2john.pl document.pdf > pdf_hash.txt
# 提取哈希行 → 保存为纯哈希

hashcat -m 10500 pdf_hash.txt \
  -a 3 ?l?l?l?l?l?l?d?d \
  -O -w 3 \
  -o cracked_pdf.txt
```

### 场景八：批量破解多种哈希

```bash
# 准备混合哈希文件 mixed_hashes.txt：
# $1$salt$hash  (MD5crypt, mode 500)
# $6$salt$hash  (SHA512crypt, mode 1800)
# 直接 NTLM    (mode 1000)

# 方法1：分别破解每种类型
hashcat -m 500 mixed_hashes.txt dict.txt
hashcat -m 1800 mixed_hashes.txt dict.txt
hashcat -m 1000 mixed_hashes.txt dict.txt

# 方法2：用脚本自动识别类型
while read hash; do
  if [[ $hash == \$1\$* ]]; then
    echo "$hash" >> mode500.txt
  elif [[ $hash == \$6\$* ]]; then
    echo "$hash" >> mode1800.txt
  elif [[ $hash == [0-9a-fA-F]{32} ]]; then
    echo "$hash" >> mode1000.txt
  fi
done < mixed_hashes.txt
```

### 场景九：GPU 集群破解

```bash
# 多 GPU 环境
hashcat -m 1000 hashes.txt dict.txt -d 1,2,3 -O -w 3
# -d 1,2,3 指定 GPU 1,2,3

# Brain 分布式破解（多机联动）
# 主机1
hashcat -m 1000 hashes.txt dict.txt --brain-server --brain-password=secret

# 主机2,3...
hashcat -m 1000 hashes.txt dict.txt \
  --brain-client --brain-host=192.168.1.100 \
  --brain-password=secret
```

### 场景十：罕见哈希格式

```bash
# Kerberos 5 TGS-REP etype 23 (m 13100)
hashcat -m 13100 kerb_tgs.txt dict.txt -r rules/best64.rule

# NetNTLMv2 (m 5600) - 从 Responder 捕获
hashcat -m 5600 netntlm.txt dict.txt -r rules/best64.rule

# 7-Zip (m 11600)
hashcat -m 11600 archive.7z_hash.txt dict.txt -r rules/dive.rule

# RAR3 (m 12500) / RAR5 (m 13000)
hashcat -m 13000 rar5_hash.txt dict.txt -r rules/best64.rule

# VeraCrypt (m 13721)
hashcat -m 13721 veracrypt_hash.txt dict.txt -a 3 ?l?l?l?l?l?l?l?l

# Bitcoin/Litecoin wallet (m 11300)
hashcat -m 11300 wallet_hash.txt dict.txt -r rules/best64.rule
```

---

## 十一、性能基准测试与硬件选购

### 11.1 官方基准测试

```bash
# 内置 benchmark
hashcat -b                                # 全部算法基准
hashcat -b -m 1000                        # 仅 NTLM
hashcat -b --benchmark-all                # 包含慢算法

# 解释输出
# Speed.#1.........: 45000000 kH/s (NTLM on RTX 4090)
# 1 kH/s = 1000 hashes per second
# 45000000 kH/s = 45 GH/s (45 billion hashes/sec)
```

### 11.2 GPU 选购建议（2024参考）

| GPU | NTLM 速度 | 功耗 | 性价比 |
|:---|:---:|:---:|:---:|
| RTX 4090 | ~45 GH/s | 450W | 中高 |
| RTX 4080 | ~28 GH/s | 320W | 中 |
| RTX 4070 Ti | ~20 GH/s | 285W | 好 |
| RTX 4060 Ti | ~12 GH/s | 160W | 极好 |
| AMD 7900 XTX | ~25 GH/s | 355W | 中 |
| GTX 1660 Ti | ~6 GH/s | 120W | 入门 |

### 11.3 冷却与稳定性

```bash
# 监控 GPU 温度
nvidia-smi -l 1
# 保持 GPU 温度 < 80°C

# 设置功耗限制（延长硬件寿命）
nvidia-smi -pl 300        # RTX 4090 限制 300W
# 性能降低约 15%，功耗降低约 30%

# 长时运行建议
# - 使用专用机器或云 GPU 实例
# - 开启 -O 优化内核
# - 监控温度，避免连续运行超 48 小时
```

---

## 十二、常见问题与排错

| 问题 | 原因 | 解决方案 |
|:---|:---|:---|
| `No devices found` | 缺少 GPU/驱动 | `nvidia-smi` 检查、重装驱动 |
| `CL_OUT_OF_RESOURCES` | GPU 内存不足 | 减小字典、使用 -w 1/2 |
| `Token length exception` | 密码过长超模版限制 | 拆分规则、减少组合 |
| `All hashes already cracked` | 已全部破解 | `hashcat --show` 查看 |
| `Insanely slow` | 未启用优化 | 添加 -O -w 3 |
| `Incorrect hash format` | 哈希格式错误 | 确认 -m 参数正确 |
| `Hashfile line-length exception` | 哈希文件中有空行 | `sed -i '/^$/d' hashes.txt` |
| `Device overheated` | GPU 温度过高 | 降低功耗、改善散热 |
| `Watchdog timeout` | 内核运行太久无进度 | 增加 TDR 超时时间 |
| `Out of memory` | 字典/规则太大 | 使用 `--session` 分片处理 |

---

## 十三、安全与合规

1. **永远只破解自己有权测试的哈希**（内部审计/授权渗透测试）
2. **哈希文件妥善保管**，破解完成后及时删除原始文件
3. **GPU 资源使用受控**，避免影响生产系统
4. **学习目的使用弱口令靶场**，不要用于非法入侵
5. **密码恢复场景**需有书面授权证明文件所有权

---

---

## 十四、字典策略与生成

### 14.1 经典密码字典

```bash
# RockYou（最常用的密码字典，1400万条）
# Kali 默认位置
/usr/share/wordlists/rockyou.txt
# 其他系统下载
wget https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt

# SecLists（综合列表集合）
git clone https://github.com/danielmiessler/SecLists.git
ls SecLists/Passwords/
# Common-Credentials/    常用凭证
# Leaked-Databases/      泄露数据库
# Software/              软件默认密码
```

### 14.2 自定义字典生成

```bash
# crunch：经典字典生成器
crunch 8 12 abcdef123456 -o custom_dict.txt   # 8-12位，字符集a-f 1-6

# CeWL：从网站爬取生成字典
cewl https://target.com -d 3 -m 6 -w target_dict.txt
# -d 3: 爬取深度；-m 6: 最小单词长度

# rsync：自定义规则过滤
# 提取8-16位仅小写字母的条目
grep -E '^[a-z]{8,16}$' rockyou.txt > lowercase8-16.txt

# combinator：合并字典
hashcat --stdout -a 1 dict1.txt dict2.txt > combined_dict.txt
```

### 14.3 字典优化技巧

```bash
# 去重排序
sort -u dict.txt -o dict_unique.txt

# 排除太短/太长的
awk 'length >= 8 && length <= 16' dict.txt > filtered.txt

# 排除纯数字
grep -vE '^[0-9]+$' dict.txt > no_pure_numbers.txt

# 按长度分组（用于增量攻击）
for len in $(seq 6 16); do
  awk "length == $len" dict.txt > dict_len${len}.txt
done
```

---

## 十五、高级攻击模式补充

### 15.1 基于字典的 Hybrid 攻击

```bash
# 掩码+字典（模式6）：在字典右侧追加掩码字符
hashcat -m 0 -a 6 hashes.txt dict.txt ?d?d?d?d
# 输出示例：password1984, admin2024, welcome1234

# 字典+掩码（模式7）：在字典左侧追加掩码字符
hashcat -m 0 -a 7 hashes.txt ?s?d dict.txt
# 输出示例：#1password, !2admin

# 结合使用
hashcat -m 1000 hashes.txt \
  -a 6 dict.txt ?d?d?d?d \
  -a 7 ?d?d dict.txt \
  -r rules/best64.rule \
  -O -w 3
```

### 15.2 自定义掩码

```bash
# 自定义字符集
-1 ?l?d-._       # 字符集1：小写字母+数字+常见分隔符
-2 ?u?l?d         # 字符集2：大写+小写+数字
-3 ?s             # 字符集3：特殊字符

# 示例：8-10位，小写+数字，最后2位是特殊字符
hashcat -a 3 -m 0 hashes.txt -1 ?l?d ?1?1?1?1?1?1?1?l?s?s --increment

# 常用密码模式掩码
?l?l?l?l?l?l?l?l                  # 8位纯小写
?l?l?l?l?l?l?d?d                  # 6位小写+2位数字（极常见）
?u?l?l?l?l?l?l?l                  # 首字母大写+7位小写
?u?l?l?l?l?l?l?d?d                # 首字母大写+6位小写+2位数字
?l?l?l?l?l?l?l?l?s                # 8位小写+1位特殊字符
```

---

## 十六、练习与自测

1. 生成一个 MD5 哈希（`echo -n "Password2024!" | md5sum`），用不同模式破解它
2. 对同一哈希分别用字典模式、掩码模式、规则模式破解，对比速度
3. 从真实系统中提取 `/etc/shadow` 哈希，尝试破解弱密码
4. 为你的组织生成一份密码强度报告（模拟测试）
5. 编写自定义规则文件，实现 leetspeak 变种（a→@, e→3, i→!, o→0, s→$）
6. 对比 hashcat 和 John the Ripper 在同一哈希上的破解速度

---

> 📖 本文为"网安百宝箱"课程配套读物。
> 参考：hashcat 官方 Wiki https://hashcat.net/wiki/
> 更新于 2026-06-18
