# YARA 规则编写实战：恶意代码检测

> **📘 文档定位**：CISP 考试恶意代码分析技术 | 难度：⭐⭐⭐⭐ | 预计阅读：20 分钟
> YARA 是恶意代码检测与分类的瑞士军刀。本文从规则语法、编写实战到自动化集成，系统梳理 YARA 规则在威胁检测中的应用。

---

## 导航目录
- [一、YARA 是什么?](#一yara-是什么)

```
YARA = 描述恶意代码特征的"模式匹配语言"
  - 核心思想: 用一段规则描述恶意样本的"字节模式 / 字符串 / 函数特征"
  - 广泛用于: 恶意代码分类 / C2 通信识别 / Webshell 检测 / 敏感文件识别
  - 语法类似 C, 但专门做字符串/正则/十六进制匹配
```

## 二、YARA 基础语法速查

### 2.1 最简规则

```yara
rule SimpleExample
{
    meta:
        description = "示例规则"
        author = "Security Team"
        date = "2025-09-15"
        severity = "high"
        family = "Example"

    strings:
        $a = "malware_string" ascii
        $b = { 6A 40 68 00 30 00 00 6A 14 8D 91 }  // 十六进制字节序列
        $c = /Mozilla\/4\.0 \(compatible; MSIE \d\.\d+/  // 正则

    condition:
        $a or ($b and $c) or 2 of ($*)
}
```

### 2.2 字符串类型速查

```yara
// 1) 普通字符串 (ascii / wide / nocase / fullword)
$a = "This program cannot be run in DOS mode" ascii          // 默认 ascii
$b = "GetProcAddress" wide                                  // UTF-16 (Windows Unicode)
$c = "This program cannot" nocase                           // 忽略大小写
$d = "cmd.exe" fullword                                     // 整个单词 (前后非字母数字)
$e = "powershell -enc" ascii wide nocase                   // 可组合多个修饰符

// 2) 十六进制字节 (Hex Strings) - 最常用于 shellcode / 代码段签名
$x = { 6A 40 68 00 30 00 00 6A 14 }                        // 固定字节
$y = { 6A ?? 68 ?? ?? ?? ?? 6A ?? }                         // ?? = 任意字节 (通配)
$z = { 6A [0-5] 68 00 30 00 00 }                            // [0-5] = 0~5 个任意字节
$w = { (6A 40 | 6A 20) 68 00 30 00 00 }                    // 二选一: 6A40 或 6A20

// 3) 正则表达式 (PCRE 风格)
$r1 = /powershell.*[-\/]e(nc)?(ode)?\s+[a-z0-9\+\/=]+/i     // base64 encoded payload
$r2 = /Mozilla\/\d\.\d \(compatible; MSIE \d\.\d; Windows NT/m
$r3 = /HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run/ nocase
```

### 2.3 Condition (条件)

```yara
condition:
    $a                          // 存在 $a 即命中
    2 of ($*)                   // 任意 2 个字符串命中 ($* = 所有)
    all of them                // 所有字符串都命中
    ($a and $b) or ($c and $d) // 逻辑组合
    $a at 0x401000             // $a 出现在文件偏移 0x401000
    $a in (entrypoint..entrypoint + 0x1000) // $a 在入口点 0~0x1000 内
    filesize < 500KB and $a and $b         // 文件大小与字符串组合
    pe.characteristics & pe.EXECUTABLE_IMAGE and $a // 仅对 PE 可执行文件匹配
    pe.imports("kernel32.dll", "WriteProcessMemory") and pe.imports("kernel32.dll", "CreateRemoteThread")
    // 也支持对 PE 文件的导入表检查
```

## 三、实用示例

### 3.1 检测常见 WebShell

```yara
rule PHP_Webshell_EvalPost
{
    meta:
        description = "PHP WebShell 常见特征: eval($_POST / eval(gzinflate"
        severity = "high"

    strings:
        $s1 = "eval($_POST[" ascii
        $s2 = "eval($_GET[" ascii
        $s3 = "assert($_POST[" ascii
        $s4 = "eval(gzinflate" ascii
        $s5 = "eval(base64_decode(" ascii
        $s6 = "system($_POST[" ascii
        $s7 = "exec($_POST[" ascii
        $s8 = "shell_exec($_POST[" ascii
        $s9 = "preg_replace(\"/.*/e\"" ascii
        $s10 = "call_user_func_array(" ascii

    condition:
        any of them
}

rule JSP_WebShell_CmdExec
{
    meta:
        description = "JSP WebShell 执行命令特征"
        severity = "high"

    strings:
        $s1 = "Runtime.getRuntime().exec(" ascii
        $s2 = "new ProcessBuilder(" ascii
        $s3 = "ProcessBuilder" ascii
        $s4 = "getInputStream()" ascii
        $s5 = "/bin/sh" ascii
        $s6 = "cmd.exe /c" ascii

    condition:
        ($s1 or $s2 or $s3) and ($s4 or $s5 or $s6)
}

rule ASPX_WebShell_ProcessStart
{
    meta:
        description = "ASPX WebShell 调用 Process.Start"
        severity = "high"

    strings:
        $s1 = "System.Diagnostics.Process.Start" ascii wide
        $s2 = "Process.Start(" ascii wide
        $s3 = "Request[\"cmd\"]" ascii wide
        $s4 = "Request.Form[\"" ascii wide

    condition:
        ($s1 or $s2) and ($s3 or $s4)
}
```

### 3.2 检测常见恶意代码执行命令

```yara
rule Suspicious_PowerShell_Base64
{
    meta:
        description = "检测 PowerShell -enc / -EncodedCommand base64 payload"
        severity = "high"

    strings:
        $p1 = /powershell[.exe]*\s+[-\/](en|enc|EncodedCommand)\s+[A-Za-z0-9\+\/=]{50,}/i ascii
        $p2 = "FromBase64String" ascii wide
        $p3 = "System.Convert" ascii wide

    condition:
        $p1 or ($p2 and $p3)
}

rule Mimikatz_Signature
{
    meta:
        description = "Mimikatz 常见字符串特征"
        severity = "critical"

    strings:
        $s1 = "mimikatz" ascii nocase
        $s2 = "sekurlsa::logonpasswords" ascii nocase
        $s3 = "kerberos::golden" ascii nocase
        $s4 = "LSAISO" ascii
        $s5 = "wdigest" ascii nocase
        $s6 = "sekurlsa" ascii nocase

    condition:
        2 of them
}
```

### 3.3 检测勒索软件常见行为

```yara
rule Ransomware_Extensions
{
    meta:
        description = "检测勒索软件典型扩展名与字符串"
        severity = "high"

    strings:
        // 加密后的文件扩展名
        $e1 = ".locky" ascii wide
        $e2 = ".phobos" ascii wide
        $e3 = ".conti" ascii wide
        $e4 = ".lockbit" ascii wide
        $e5 = ".ryuk" ascii wide
        $e6 = ".clop" ascii wide

        // 勒索信文件名
        $r1 = "README.txt" wide
        $r2 = "DECRYPT_INSTRUCTIONS" wide
        $r3 = "HOW_TO_DECRYPT" wide
        $r4 = "-READ-ME-" wide
        $r5 = "RECOVER_INFORMATION" wide

        // 常见函数调用 (删除卷影副本)
        $v1 = "vssadmin delete shadows" ascii nocase
        $v2 = "wmic shadowcopy delete" ascii nocase
        $v3 = "bcdedit /set" ascii nocase

    condition:
        (any of ($e*) and any of ($r*)) or any of ($v*)
}
```

### 3.4 检测 APT 常见 Shellcode 启动模式

```yara
rule Shellcode_RunPE_Pattern
{
    meta:
        description = "常见 RunPE / Process Hollowing 字节模式"
        severity = "high"

    strings:
        // CreateRemoteThread + WriteProcessMemory 组合
        $x1 = { E8 ?? ?? ?? ?? E8 ?? ?? ?? ?? FF 15 ?? ?? ?? ?? }
        $x2 = "ZwUnmapViewOfSection" ascii
        $x3 = "WriteProcessMemory" ascii
        $x4 = "CreateRemoteThread" ascii
        $x5 = "NtUnmapViewOfSection" ascii
        $x6 = "QueueUserAPC" ascii

    condition:
        2 of ($x*)
}
```

## 四、进阶：PE 元数据规则

```yara
import "pe"

rule Suspicious_PE_NoDigitalSignature
{
    meta:
        description = "可执行文件无数字签名 + 常见可疑特征"
        severity = "medium"

    condition:
        pe.is_pe and
        not pe.signatures[0] and  // 无签名
        pe.number_of_exports == 0 and
        pe.number_of_signatures == 0 and
        pe.characteristics & pe.EXECUTABLE_IMAGE
}

rule PE_Imports_Mimikatz_Like
{
    meta:
        description = "导入 LSA 相关 API 组合"
        severity = "high"

    condition:
        pe.is_pe and
        (
            pe.imports("advapi32.dll", "LsaEnumerateLogonSessions") or
            pe.imports("secur32.dll", "LsaGetLogonSessionData") or
            pe.imports("advapi32.dll", "CryptUnprotectData")
        )
        and
        (
            pe.imports("kernel32.dll", "OpenProcess") or
            pe.imports("ntdll.dll", "NtReadVirtualMemory")
        )
}

rule PE_Section_Names_Suspicious
{
    meta:
        description = "PE 段名可疑 (.upx / .text1 / .rsrc1 等加壳或伪装)
        severity = "medium"

    strings:
        $n1 = ".upx" ascii
        $n2 = ".themida" ascii
        $n3 = ".vmp" ascii
        $n4 = ".enigma" ascii
        $n5 = ".shrinker" ascii

    condition:
        pe.is_pe and any of ($n*)
}
```

## 五、YARA 使用方法

```bash
# 1. 扫描单文件
yara myrules.yar suspicious.exe

# 2. 递归扫描目录
yara -r rules/ /var/www/html/

# 3. 将命中的文件记录到日志
yara -r rules.yar /tmp/suspect/ > yara_hit_log.txt 2>&1

# 4. 递归扫描 + 显示命中的字符串
yara -r -s rules/ /tmp/

# 5. 限定只扫描某些扩展
find /var/www -type f \( -name "*.php" -o -name "*.jsp" -o -name "*.aspx" \) -exec yara rules.yar {} \;

# 6. 用 YARA 扫描进程内存 (需 yara -M 或 yara 配合 Volatility)
yara -r myrules.yar <pid>

# 7. 结合 ClamAV / 其他 AV 使用
#    FreshClam / 自定义签名
```

## 六、YARA 规则集收集渠道

```
  官方 / 社区:
    1. YARA-Rules 官方      https://github.com/Yara-Rules/rules
    2. Florian Roth          https://github.com/Neo23x0/signature-base
    3. ReversingLabs         https://github.com/reversinglabs/reversinglabs-yara-rules
    4. Security-Onion        内置 YARA 规则集
    5. InQuest Labs           https://github.com/InQuest/yara-rules
    6. Mandiant / FireEye    https://github.com/mandiant/redcanaryco
    7. Arkbird-Solutions     https://github.com/Arkbird-Solutions/yara-forensics
    8. Elastic Security      https://github.com/elastic/protections-artifacts

  分类:
    • 恶意代码家族: Emotet / TrickBot / Cobalt Strike / Mirai / LockBit ...
    • Webshell (PHP / JSP / ASPX)
    • 敏感文件 (密钥 / 密码 / 私钥 / 令牌)
    • 可疑 PowerShell / cmd 命令行
    • 加壳识别 (UPX / Themida / VMProtect)
```

## 七、自定义企业内部 YARA 规则编写流程

```
  Step 1. 收集内部样本: WebShell 样本 / 被攻陷的样本 / 红队样本
  Step 2. 分析特征:
    - strings sample.exe | grep -iE "(password|http|cmd|shell|eval"
    - IDA Pro / Ghidra 分析关键函数
    - 识别独特字符串、API 组合、字节模式
  Step 3. 编写 YARA 规则 (每类样本一个规则文件)
  Step 4. 误报测试:
    - 在干净的 Windows / Linux 系统目录上扫描 → 应无命中
    - 在公司标准镜像上扫描 → 应无命中
  Step 5. 命中率测试:
    - 在样本集上扫描 → 命中率应 > 90%
  Step 6. 灰度发布:
    - 先在测试环境试运行
    - 再在少量机器试点
    - 最后全网 EDR 发布
  Step 7. 持续更新:
    - 每发现新样本 → 补充/更新 YARA 规则
    - 定期 review 误报, 删除过时规则
```

## 八、CheckList

- [ ] 部署 YARA + 核心规则集 (YARA-Rules / Neo23x0)
- [ ] 针对本行业常见攻击向量编写自定义规则 (WebShell / APT 木马 / 勒索)
- [ ] 定期更新规则 (每 1~2 周 review 一次)
- [ ] YARA 集成到 EDR / SIEM / SOAR 自动化响应
- [ ] 内部样本库积累, 训练自定义规则
- [ ] 定期"误报率 / 命中率"评估, 优化规则质量
- [ ] 建立规则审查流程, 防止 YARA 规则泄露给攻击者
- [ ] 关注主流安全厂商 APT 报告, 把公开的 YARA 规则引入本地
- [ ] 员工培训: 如何读 YARA 规则 / 如何写基础规则
- [ ] 与威胁情报结合: YARA 命中 → 自动查 VT / 本地 TIP → 自动响应

---

## 高分考点与知识巧记

> 🔑 **高分考点**：YARA 规则考点集中在三要素结构、字符串类型、条件表达式。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| 规则三要素 | ⭐⭐⭐⭐ | meta(元数据) + strings(特征串) + condition(条件) |
| 字符串类型 | ⭐⭐⭐ | 文本、十六进制、正则表达式 |

> 💡 **知识巧记**：YARA 三要素记"元特条"——meta 描述、strings 特征、condition 条件。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| YARA 定位 | 模式匹配引擎，非沙箱 | "YARA 是沙箱" ❌ |
| 性能优化 | 短特征串优先，避免复杂正则 | "规则越复杂越好" ❌ |

### 知识巧记口诀

> **YARA 口诀**：
> 三要素元特条，短特征优先后复杂。
> 条件组合 and or not，计数条件判匹配。
