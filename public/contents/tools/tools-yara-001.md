# YARA 恶意代码模式匹配完全指南

> 分类：工具指南 | 难度：进阶 | 阅读时间：约55分钟

## 概述

YARA 是安全分析师和恶意软件研究员的"指纹识别工具"。由 VirusTotal 的 Victor M. Alvarez 开发，通过编写类似于杀毒软件签名的 YARA 规则，对文件和内存进行模式匹配，识别和分类恶意软件。YARA 的规则语言简洁但表达力极强——一个短短几十行的规则可以识别整个恶意软件家族。

**核心能力**：
- 字符串（文本/十六进制）模式匹配
- 正则表达式支持
- PE（Windows可执行文件）和 ELF（Linux可执行文件）模块
- 数学条件表达式
- 高性能扫描（单/多线程）
- C/Python 库集成

## 核心知识点

- YARA 规则语法完整指南
- 字符串匹配类型（文本/hex/regex）
- 条件表达式与计数
- PE/ELF 模块使用
- 规则性能优化
- YARA 集成到 SIEM/EDR
- YARA 规则管理与共享

---

## 一、安装

### 1.1 Linux

```bash
# apt（所有 Debian/Ubuntu）
sudo apt install yara -y

# pip（跨平台）
pip install yara-python

# 从源码（获取最新版本/自定义编译）
git clone https://github.com/VirusTotal/yara.git
cd yara
./bootstrap.sh
./configure --enable-cuckoo --enable-magic --enable-dex
make
sudo make install

# 验证
yara --version

# Python 绑定
python -c "import yara; print(yara.YARA_VERSION)"
```

### 1.2 macOS

```bash
brew install yara
pip3 install yara-python
```

### 1.3 Windows

```powershell
# 下载预编译二进制
# https://github.com/VirusTotal/yara/releases

# 或 pip
pip install yara-python
# 注意：需要 Visual C++ Build Tools
```

---

## 二、YARA 规则语法

### 2.1 基础规则结构

```yara
rule RuleName {
    meta:
        description = "规则描述"
        author = "你的名字"
        date = "2024-01"
        severity = "high"
        hash = "d41d8cd98f00b204e9800998ecf8427e"
        
    strings:
        $string1 = "literal text"
        $string2 = { 4D 5A 90 00 }
        $string3 = /regex_pattern/i
        
    condition:
        $string1 and $string2
}
```

### 2.2 字符串类型详解

#### 文本字符串

```yara
strings:
    # 基本文本
    $s1 = "malware"                          # 区分大小写
    $s2 = "C2_Server" nocase                 # 不区分大小写
    $s3 = "powershell" wide                  # UTF-16 (Unicode)
    $s4 = "cmd.exe" ascii                    # ASCII（默认）
    $s5 = "backdoor" wide ascii              # 两者都查
    $s6 = "cmd" fullword                     # 仅匹配完整单词
    
    # XOR 字符串（自动尝试所有 1-byte XOR 密钥）
    $s7 = "This program cannot" xor
    
    # Base64 字符串
    $s8 = "cGFzc3dvcmQ=" base64
    $s9 = "cGFzc3dvcmQ=" base64wide          # Base64 + UTF-16
```

#### 十六进制字符串

```yara
strings:
    # 精确匹配
    $h1 = { 4D 5A }                          # MZ 头
    
    # 通配符（?? 匹配任意字节）
    $h2 = { E8 ?? ?? ?? ?? C3 }              # CALL xxxx; RET
    
    # 跳转/范围
    $h3 = { E8 [4-6] C3 }                    # CALL 后 4-6 字节 → RET
    $h4 = { FF 15 [4] 85 C0 }                # CALL [mem] 后四字节 → TEST EAX,EAX
    
    # 可选字节
    $h5 = { 55 8B EC 83 EC ( 08 | 10 | 20 ) } # 栈帧 + 可选值
    
    # 不定长
    $h6 = { B8 (00 00 00 00 | ?? ?? ?? ??) } # 两个分支
    
    # 无限跳转
    $h7 = { E8 [-] C3 }                       # CALL 后任意字节 → RET
```

#### 正则表达式

```yara
strings:
    $r1 = /md5:[a-fA-F0-9]{32}/              # MD5 哈希
    $r2 = /https?:\/\/[\w\.-]+\.(com|net|org)/ nocase
    $r3 = /CVE-\d{4}-\d{4,}/                  # CVE 编号
    $r4 = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{2,5}/  # IP:Port
```

---

### 2.3 条件表达式

```yara
condition:
    # 基础
    $a                                          # $a 至少出现一次
    $a and $b                                   # 两个都出现
    $a or $b                                    # 至少一个出现
    not $a                                      # $a 不存在
    
    # 计数
    #a > 5                                      # $a 出现超过5次
    #a >= 3 and #b <= 2                         # 组合计数
    3 of them                                   # 至少匹配3个字符串
    all of them                                 # 全部匹配
    any of them                                 # 至少1个匹配
    2 of ($a,$b,$c)                             # 3个中至少2个
    
    # 字符串偏移（@a = 字符串第一个匹配的偏移）
    $a at 0                                     # $a 在偏移0（文件头）
    $a in (0..1000)                             # $a 在前1000字节
    $b in (@a..@a+1000)                        # $b 在 $a 后1000字节内
    
    # 文件大小
    filesize < 500KB
    filesize > 10MB
    
    # 表达式
    for all i in (1..#a) : (@a[i] > 1000)      # 所有 $a 匹配都在偏移>1000
    for any of ($a,$b) : ( @ > 100 )           # 任何一个在偏移>100
```

---

## 三、PE 模块高级用法

### 3.1 PE 模块导入

```yara
import "pe"

rule PE_Analysis_Example {
    condition:
        pe.is_pe and
        
        # 节区信息
        pe.number_of_sections > 6 and
        pe.sections[0].name == ".text" and
        pe.sections[0].entropy > 6.5 and
        
        # 导入函数
        pe.imports("kernel32.dll", "VirtualAlloc") and
        pe.imports("kernel32.dll", "CreateRemoteThread") and
        
        # 导出函数
        "DllRegisterServer" in pe.exports and
        
        # 版本信息
        pe.version_info["CompanyName"] == "Microsoft Corporation" and
        
        # 资源
        pe.number_of_resources > 5 and
        for any i in (0..pe.number_of_resources - 1) : (
            pe.resources[i].type == 10  # RCDATA
        )
}
```

### 3.2 PE 模块常用检查

```yara
# 节区分析
pe.number_of_sections               # 节区数量
pe.sections[i].name                 # 节区名
pe.sections[i].raw_data_size        # 原始数据大小
pe.sections[i].virtual_size         # 虚拟大小
pe.sections[i].entropy              # 熵值（0-8，越高越可疑）
pe.sections[i].characteristics      # 节区属性

# 节区异常检测
for any section in pe.sections : (
    section.raw_data_size == 0 and 
    section.virtual_size > 0        # 可疑：文件无数据但内存有
)

for any section in pe.sections : (
    section.characteristics & 0xE0000020 == 0xE0000020
    # SECTION_MEM_EXECUTE | SECTION_MEM_WRITE | SECTION_MEM_READ
    # RWX 节区 = 高危
)

# 导入函数检测
pe.imports("kernel32.dll")                  # kernel32 导入列表
pe.imphash()                                # 导入表哈希
pe.is_dll()                                 # 是否 DLL
pe.is_32bit() / pe.is_64bit()

# 签名检测
pe.signatures                                # 数字签名列表
pe.number_of_signatures > 0                  # 是否有签名
```

---

## 四、ELF 模块

```yara
import "elf"

rule ELF_Malware {
    condition:
        elf.type == elf.ET_EXEC and
        elf.number_of_sections > 30 and
        for any i in (0..elf.number_of_sections - 1) : (
            elf.sections[i].type == elf.SHT_PROGBITS and
            elf.sections[i].flags == (elf.SHF_ALLOC | elf.SHF_WRITE | elf.SHF_EXECINSTR)
        )
}
```

---

## 五、规则管理

### 5.1 规则目录结构

```
rules/
├── malware/
│   ├── ransomware/      # 勒索软件
│   ├── trojan/          # 木马
│   └── worm/            # 蠕虫
├── apt/
│   ├── apt28/
│   └── apt29/
├── exploits/
│   └── cve_2024/
├── suspicious/
│   └── packed/          # 加壳检测
└── index.yar            # 索引文件（include 所有子目录）
```

### 5.2 规则组织策略

```yara
// index.yar - 入口文件
include "./malware/ransomware/*.yar"
include "./malware/trojan/*.yar"
include "./apt/**/*.yar"
include "./exploits/cve_2024/*.yar"

// 扫描时使用
yara -r rules/index.yar /path/to/scan
```

### 5.3 社区规则库

```bash
# YARA Rules 仓库（社区维护）
git clone https://github.com/Yara-Rules/rules.git
ls rules/

# InQuest 的 YARA 规则
git clone https://github.com/InQuest/yara-rules.git

# Florian Roth 的签名库
git clone https://github.com/Neo23x0/signature-base.git
ls signature-base/yara/
```

---

## 六、实战场景扩展

### 场景六：检测 Webshell

```yara
rule Webshell_PHP_Generic {
    meta:
        description = "Generic PHP Webshell Detection"
        severity = "critical"
    
    strings:
        $func1 = "eval(" nocase
        $func2 = "assert(" nocase
        $func3 = "system(" nocase
        $func4 = "exec(" nocase
        $func5 = "passthru(" nocase
        $func6 = "shell_exec(" nocase
        $func7 = "base64_decode(" nocase
        $func8 = "str_rot13(" nocase
        $submit1 = "<form" nocase
        $submit2 = "password" nocase
    
    condition:
        filesize < 10KB and
        (
            (2 of ($func*)) or
            ($submit1 and $submit2 and any of ($func*))
        )
}
```

### 场景七：检测混淆 PowerShell

```yara
rule Obfuscated_PowerShell {
    strings:
        $obf1 = "IEX(" nocase wide
        $obf2 = "Invoke-Expression" nocase wide
        $obf3 = "FromBase64String" nocase wide
        $obf4 = "[System.Text.Encoding]::Unicode.GetString" nocase wide
        $obf5 = /-[eE](ncod|c|C?o?m?m?a?n?d?)\s+[A-Za-z0-9+\/=]{50,}/
    
    condition:
        2 of them
}
```

### 场景八：检测 Cobalt Strike Beacon

```yara
rule CobaltStrike_Beacon {
    strings:
        $s1 = "%s as %s\\%s: %d" fullword
        $s2 = "ReflectiveLoader" nocase
        $s3 = "beacon" xor(1-255)
        $opcode1 = { 8B 45 08 8B 4D 14 50 6A 40 }
        $opcode2 = { E8 00 00 00 00 58 [4] 8B [2] 83 C0 0B }
    
    condition:
        (uint16(0) == 0x5A4D) and
        (2 of ($s*) or 1 of ($opcode*))
}
```

---

## 七、性能优化指南

### 7.1 慢规则诊断

```bash
# 计时扫描
time yara -r rules/ target/

# 查看每个规则的匹配时间
yara -r -g rules/ target/ > /dev/null
# -g: 打印每个规则的匹配标记

# 优化建议：
# 1. 优先使用短而独特的字符串
# 2. 避免过于宽泛的正则（如 .*）
# 3. 使用 at 限定偏移范围
# 4. filesize 检查放在条件最前面
# 5. 适当使用 nocase vs 区分大小写
```

### 7.2 优化示例

```yara
// ❌ 慢：无筛选条件
rule Slow_Example {
    strings:
        $s = /.*malware.*/
    condition:
        $s
}

// ✅ 快：有前置筛选
rule Fast_Example {
    strings:
        $magic = { 4D 5A }
        $s = "malware"
    condition:
        $magic at 0 and $s in (0..5000) and filesize < 5MB
}
```

---

## 八、集成与自动化

### 8.1 Python 集成

```python
import yara

# 编译规则
rules = yara.compile(filepath='rules/malware_index.yar')
# 或从多个文件
rules = yara.compile(filepaths={
    'namespace1': 'rules/malware.yar',
    'namespace2': 'rules/apt.yar'
})

# 扫描文件
matches = rules.match('/path/to/suspicious.exe')
for match in matches:
    print(f"Rule: {match.rule}")
    print(f"  Tags: {match.tags}")
    for string_match in match.strings:
        print(f"    {string_match.identifier}: {string_match.instances}")

# 扫描数据
matches = rules.match(data=b'\x4D\x5A\x90\x00...')
```

### 8.2 扫描内存

```python
import yara
import subprocess

# 使用 Volatility + YARA 扫描进程内存
# volatility -f memory.dump yarascan --yara-file rules.yar

# 或直接读取 /proc/<pid>/mem（Linux）
with open('/proc/1234/mem', 'rb') as f:
    memory_data = f.read()
matches = rules.match(data=memory_data)
```

---

## 九、速查卡

```
安装:                sudo apt install yara
规则编译:            yara rules.yar target
目录扫描:            yara -r rules/ /path
输出:                -s (匹配的字符串) -m (元数据)
递归:                -r
线程:                -t 8
排除:                --exclude /proc --exclude /sys
超时:                --timeout 60

字符串类型:
  text:     "string"
  nocase:   "string" nocase
  wide:     "string" wide
  fullword: "string" fullword
  hex:      { 4D 5A ?? ?? }
  regex:    /pattern/ nocase

条件:
  and/or/not
  3 of them / all of them
  #a > 5 / @a < 1000
  filesize < 500KB

PE 模块:
  pe.is_pe
  pe.imports("kernel32.dll","VirtualAlloc")
  pe.number_of_signatures
  pe.sections[i].entropy > 7.0

GitHub 社区:
  github.com/Yara-Rules/rules
  github.com/Neo23x0/signature-base
```

---

> 📖 本文为"网安百宝箱"课程配套读物。更新于 2026-06-18
