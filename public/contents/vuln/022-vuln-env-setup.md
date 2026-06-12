# 漏洞复现环境搭建指南

> 📅 2026-06-12 | 🎯 入门 | ⏱ 15 min | 分类：漏洞库与EXP

## 📋 提纲

1. 漏洞靶场平台
2. Vulhub 一键部署
3. Docker 漏洞环境
4. 常见漏洞环境搭建

---

## 1. 主流漏洞靶场

| 平台 | 优势 | 适合 |
|------|------|------|
| **Vulhub** | Docker一键部署，200+漏洞环境 | 新手到专家 |
| **DVWA** | PHP经典，低中高三个难度 | Web安全入门 |
| **PentesterLab** | 在线+离线，循序渐进 | 系统学习 |
| **HackTheBox** | 真实靶机，社区活跃 | 实战提升 |
| **PortSwigger Labs** | 免费200+Web安全实验 | Web专项 |
| **Sqli-labs** | SQL注入专项65关 | SQL注入入门 |

---

## 2. Vulhub 一键部署

```bash
# 安装 Docker + Docker Compose
curl -fsSL https://get.docker.com | bash
sudo apt install docker-compose

# 克隆 Vulhub
git clone https://github.com/vulhub/vulhub.git
cd vulhub

# 示例1: ThinkPHP 5.0.23 RCE
cd thinkphp/5-rce
docker-compose up -d
# 访问 http://localhost:8080

# 示例2: Shiro 1.2.4 反序列化
cd shiro/CVE-2016-4437
docker-compose up -d
# 访问 http://localhost:8080

# 示例3: Log4j2 RCE
cd log4j/CVE-2021-44228
docker-compose up -d
# 访问 http://localhost:8983 (Solr) 或 http://localhost:8080 (Spring Boot)

# 示例4: Confluence OGNL
cd confluence/CVE-2022-26134
docker-compose up -d
# 访问 http://localhost:8090

# 停止环境
docker-compose down -v
```

---

## 3. 护网常用漏洞环境

```bash
# 护网Top 10漏洞环境一键部署
#!/bin/bash

VULHUB_DIR="/opt/vulhub"

deploy_env() {
    local name="$1"
    local path="$2"
    echo "📦 部署 $name..."
    cd "$VULHUB_DIR/$path"
    docker-compose up -d
}

# Top 10 护网漏洞环境
deploy_env "Log4j2"       "log4j/CVE-2021-44228"
deploy_env "Shiro"        "shiro/CVE-2016-4437"  
deploy_env "Spring4Shell" "spring/CVE-2022-22965"
deploy_env "ThinkPHP"     "thinkphp/5-rce"
deploy_env "Weblogic"     "weblogic/CVE-2020-14882"
deploy_env "Fastjson"     "fastjson/1.2.47-rce"
deploy_env "Struts2"      "struts2/s2-061"
deploy_env "Jenkins"      "jenkins/CVE-2018-1000861"
deploy_env "Confluence"   "confluence/CVE-2022-26134"
deploy_env "GitLab"       "gitlab/CVE-2021-22205"

echo "✅ 10个漏洞环境已部署"
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

---

## 4. 自建靶场

```python
#!/usr/bin/env python3
"""自建简单Web漏洞靶场"""

from flask import Flask, request, render_template_string
import sqlite3

app = Flask(__name__)

# 创建漏洞数据库
conn = sqlite3.connect('vuln.db')
conn.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)')
conn.execute("INSERT OR IGNORE INTO users VALUES (1,'admin','admin123')")
conn.close()

@app.route('/sqli')
def sqli_vulnerable():
    """SQL注入漏洞演示"""
    keyword = request.args.get('id', '1')
    conn = sqlite3.connect('vuln.db')

    # 漏洞代码：直接拼接SQL
    query = f"SELECT * FROM users WHERE id={keyword}"
    try:
        result = conn.execute(query).fetchall()
        return f"<pre>Query: {query}\nResult: {result}</pre>"
    except Exception as e:
        return f"<pre>Error: {e}\nQuery: {query}</pre>"

@app.route('/xss')
def xss_vulnerable():
    """XSS漏洞演示"""
    name = request.args.get('name', 'Guest')

    # 漏洞代码：直接渲染用户输入
    html = f"<h1>Welcome, {name}!</h1>"
    return render_template_string(html)

@app.route('/cmdi')
def command_injection():
    """命令注入漏洞演示"""
    import subprocess
    host = request.args.get('host', '127.0.0.1')

    # 漏洞代码：直接拼接命令
    result = subprocess.run(f"ping -c 1 {host}", shell=True,
                           capture_output=True, text=True)
    return f"<pre>{result.stdout}{result.stderr}</pre>"

@app.route('/ssrf')
def ssrf_vulnerable():
    """SSRF漏洞演示"""
    import requests as req
    url = request.args.get('url', '')

    if url:
        # 漏洞代码：无限制的内网请求
        resp = req.get(url, timeout=5, verify=False)
        return f"<pre>{resp.text[:500]}</pre>"
    return '<form><input name="url" placeholder="http://127.0.0.1:6379/"><button>Fetch</button></form>'

if __name__ == '__main__':
    print("🔬 漏洞靶场启动:")
    print("  SQL注入:    http://localhost:5000/sqli?id=1")
    print("  XSS:        http://localhost:5000/xss?name=<script>alert(1)</script>")
    print("  命令注入:    http://localhost:5000/cmdi?host=127.0.0.1;id")
    print("  SSRF:       http://localhost:5000/ssrf")
    app.run(host='0.0.0.0', port=5000, debug=True)
```

---

## ✅ 环境搭建 Checklist

- [ ] Docker + Docker Compose 安装
- [ ] Vulhub 克隆
- [ ] Top 10 漏洞环境 deploy
- [ ] 自建靶场（含SQL/XSS/CMDI/SSRF）
- [ ] 每个环境验证漏洞可复现

> 📚 延伸阅读：Vuln/001-漏洞概述 | Penetration/001-Web流程 | HW/013-安全基线
