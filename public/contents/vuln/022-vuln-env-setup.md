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

---

## 高分考点与知识巧记

### 高分考点速查表

| 考点 | 考察维度 | 记忆要点 |
|------|----------|----------|
| 漏洞环境搭建原则 | 方法论 | 隔离环境(虚拟机/Docker)、安全防护(不暴露公网)、可复现性(版本精确)、文档化 |
| Docker靶场 | 工具实操 | Vulhub(一键部署漏洞环境)、VulApps(各类漏洞合集)、docker-compose管理 |
| 常见靶场平台 | 工具选型 | DVWA(入门)、Pikachu(综合)、Sqli-labs(SQL注入)、Upload-labs(文件上传)、Vulhub(全品类) |
| 漏洞复现流程 | 标准化 | 环境确认→版本验证→Payload测试→截图留证→报告撰写 |
| 安全注意事项 | 合规要求 | 靶场禁止暴露公网、使用NAT/仅主机网络、定期重置环境、不存储敏感数据 |
| 工具链集成 | 效率提升 | Docker+Vulhub+Burp Suite+sqlmap一体化环境；Kali Linux作为渗透测试工作站 |

### 知识巧记口诀

> **靶场搭建口诀**：
> Docker拉镜像，Vulhub一键起；
> DVWA学基础，Pikachu练综合；
> 漏洞版本要精确，复现结果可验证；
> 公网千万不能暴露，仅主机网络最安全。

> **Vulhub常用命令**：docker-compose up -d(启动)、docker-compose down(关闭)、docker ps(查看状态)。

### 考试陷阱提醒

| 陷阱 | 正确认知 |
|------|----------|
| ❌ 靶场搭在云服务器方便远程用 | ✅ 靶场含已知漏洞，暴露公网会被攻击者利用，必须使用本地或隔离网络环境 |
| ❌ 只要能复现漏洞就行 | ✅ 漏洞复现需精确匹配版本和环境，否则复现失败不等于漏洞不存在 |
| ❌ 一个DVWA就够了 | ✅ 不同靶场覆盖不同漏洞类型，需组合使用多种靶场进行全面训练 |

> 💡 **一句话总结**：漏洞环境搭建是安全研究和渗透测试的基础——Docker+Vulhub方案实现了快速部署和隔离安全，CISP考试考查安全测试环境的合规搭建要求。
