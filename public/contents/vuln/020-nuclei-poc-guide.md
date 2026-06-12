# Nuclei YAML POC 编写指南

## 1. Nuclei 简介

Nuclei 是一款基于 YAML 模板的可配置化漏洞扫描引擎，通过声明式的 HTTP/DNS/TCP 请求与匹配规则实现快速漏洞检测。模板由社区维护，覆盖了 CVE、CNVD、默认口令、信息暴露、指纹识别等大量场景。

| 模块 | 说明 |
|------|------|
| `http` | HTTP/HTTPS 请求与响应匹配 |
| `dns` | DNS 解析、CNAME 记录探测 |
| `tcp` | TCP Banner / 协议探测 |
| `workflow` | 多模板组合条件触发 |
| `headless` | 浏览器级别页面渲染检测 |

## 2. YAML 模板结构

### 2.1 最小骨架

```yaml
id: CVE-2024-XXXX                  # 模板唯一 ID

info:
  name: Example Component RCE
  author: your_handle
  severity: critical               # critical | high | medium | low | info
  description: |
    模板描述
  reference:
    - https://example.com/advisory
  classification:
    cve-id: CVE-2024-XXXX
  tags: cve,rce,example

http:
  - method: GET
    path:
      - "{{BaseURL}}/path/to/exploit"
    matchers:
      - type: word
        words:
          - "root:"
          - "/bin/bash"
        condition: and
        part: body
```

### 2.2 请求字段速查

| 字段 | 用途 |
|------|------|
| `method` | HTTP 方法：GET / POST / PUT / DELETE / PATCH / HEAD |
| `path` | 请求路径，可使用变量 `{{BaseURL}}`、`{{Hostname}}` |
| `headers` | 自定义请求头 |
| `body` | 请求体（支持字符串 / 表单） |
| `raw` | 原始 HTTP 请求（支持多请求，更精细控制） |
| `redirects` | 是否跟随 301 / 302 跳转 |
| `max-redirects` | 最大重定向次数 |
| `matchers-condition` | 多 matcher 组合逻辑：and / or |

### 2.3 匹配器（Matchers）

常用匹配器类型：

```yaml
# 关键字匹配
matchers:
  - type: word
    words:
      - "uid=0(root)"
      - "root:x:0:0:"
    condition: or
    part: body

# 正则匹配
matchers:
  - type: regex
    regex:
      - "(?mi)^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$"
    part: body

# 状态码匹配
matchers:
  - type: status
    status:
      - 200
      - 301

# 二进制/原始字节匹配（以 \x 表示）
matchers:
  - type: binary
    binary:
      - "4a5649"   # JVI magic

# dsl 表达式匹配
matchers:
  - type: dsl
    dsl:
      - "len(body) > 5000 && contains(body, 'admin')"
```

### 2.4 提取器（Extractors）

```yaml
# 从响应中抽取版本号 / Token / ID 等信息
extractors:
  - type: regex
    name: version
    group: 1
    regex:
      - 'Version (\d+\.\d+\.\d+)'
    part: body

# 提取 header
extractors:
  - type: kval
    kval:
      - X-Powered-By
```

## 3. 实战模板示例

### 3.1 经典 SQL 注入检测

```yaml
id: generic-sqli-error-based

info:
  name: SQL Injection Error Message Detection
  author: your_handle
  severity: high
  tags: sqli,database

http:
  - method: GET
    path:
      - "{{BaseURL}}/?id=1'"
      - "{{BaseURL}}/search?q=test'"
    matchers:
      - type: word
        words:
          - "SQL syntax"
          - "You have an error in your SQL syntax"
          - "Microsoft OLE DB Provider for SQL Server"
          - "ORA-01756"
          - "PSQLException"
          - "Warning: mysql_"
          - "unclosed quotation mark"
        condition: or
        part: body
```

### 3.2 路径遍历检测

```yaml
id: path-traversal-detection

http:
  - method: GET
    path:
      - "{{BaseURL}}/download?file=../../../../etc/passwd"
      - "{{BaseURL}}/static/..%252f..%252fetc%252fpasswd"
    matchers:
      - type: regex
        regex:
          - "root:[x*]:0:0:"
          - "\\[(font|extension|file)s\\]"
        part: body
```

### 3.3 Nuclei 结合 raw 请求（复杂场景）

```yaml
id: shiro-deserialize-rce

info:
  name: Apache Shiro RememberMe Default Key Deserialization
  author: your_handle
  severity: critical
  tags: java,deserialization,rce,shiro

http:
  - raw:
      - |
        GET / HTTP/1.1
        Host: {{Hostname}}
        Cookie: rememberMe={{base64(sha256("payload"))}}
        Upgrade-Insecure-Requests: 1

    matchers-condition: and
    matchers:
      - type: status
        status:
          - 200
      - type: word
        part: header
        words:
          - "rememberMe=deleteMe"
```

## 4. 调试与运行

```bash
# 单模板单目标
nuclei -u https://target.com -t ./custom-poc.yaml -v

# 指定目录批量扫描
nuclei -u https://target.com -t ./my-templates/

# 从列表文件批量目标扫描
nuclei -l targets.txt -t ./cves/

# 输出 Markdown 报告
nuclei -u https://target.com -t ./my-templates/ -me report.md

# 调试模式，打印请求与响应
nuclei -u https://target.com -t ./custom-poc.yaml -debug
nuclei -u https://target.com -t ./custom-poc.yaml -proxy http://127.0.0.1:8080
```

## 5. 编写高质量 POC 的建议

1. **可靠复现**：先在本地靶场（Vulhub / docker）测试通过，再提交模板；
2. **误报控制**：`matchers-condition: and` + 状态码 + 关键字双重判定；
3. **请求最小化**：不要引入无意义的头 / Cookie；
4. **声明变量**：对目标路径、版本字段用 `extractors` 抽取，便于后续人工验证；
5. **分阶段 Workflow**：先识别指纹，再根据版本触发具体 PoC；
6. **规范字段**：info 中提供 name / author / severity / description / reference / classification 齐全字段。

## 6. 高级用法示例

### 6.1 多请求 / 流程化（需 CSRF Token 的场景）

```yaml
http:
  - raw:
      - |
        GET /login HTTP/1.1
        Host: {{Hostname}}

      - |
        POST /login HTTP/1.1
        Host: {{Hostname}}
        Content-Type: application/x-www-form-urlencoded

        username=admin&password=admin&csrf={{csrf}}

    extractors:
      - type: regex
        name: csrf
        internal: true
        regex:
          - 'name="csrf" value="([A-Za-z0-9]+)"'

    matchers:
      - type: word
        words:
          - "Dashboard"
          - "Welcome"
        part: body
```

### 6.2 DSL 表达式

```yaml
matchers:
  - type: dsl
    dsl:
      - "status_code == 200 && len(body) > 0 && contains(tolower(body), 'password')"
```

## 7. 实战使用建议

1. **模板库更新**：定期 `git pull` 更新 nuclei-templates 仓库；
2. **自定义私有库**：建立公司内部 PoC 模板库，集中管理不公开 PoC；
3. **与 Burp 集成**：利用 nuclei 的 `-proxy` 代理发送，在 Burp 日志中审计；
4. **结合指纹**：先通过 fofa / shodan / nuclei tech 识别目标技术栈，再针对性跑模板；
5. **误报处理**：将高误报 PoC 放到单独目录，只在渗透场景启用，日常扫描禁用。
