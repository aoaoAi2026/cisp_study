# 第十四章：Nuclei - 模板化漏洞扫描器

## 14.1 Nuclei 简介

### 什么是 Nuclei？

Nuclei是一个快速、可定制的漏洞扫描器，使用模板来检测漏洞。

**Nuclei**的特点：
- 基于模板
- 社区模板丰富
- 支持多种协议
- 高度可定制
- 快速扫描

简单来说，Nuclei是**最灵活的漏洞扫描工具**。

---

## 14.2 安装教程

### 下载预编译版本

访问https://github.com/projectdiscovery/nuclei/releases下载。

### 使用Go安装

```bash
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
```

### 验证安装

```bash
nuclei -version
```

### 更新模板

```bash
nuclei -update-templates
```

---

## 14.3 基础扫描命令详解

### 基本扫描

```bash
nuclei -u http://target.example.com
```

### 常用参数

| 参数 | 说明 |
|------|------|
| -u | 目标URL |
| -l | 目标文件列表 |
| -t | 模板目录/文件 |
| -tags | 标签筛选 |
| -severity | 严重级别 |
| -o | 输出文件 |
| -json | JSON输出 |
| -silent | 静默模式 |
| -rate-limit | 请求速率限制 |

### 使用特定模板

```bash
nuclei -u http://target.example.com -t cves/
```

### 按标签扫描

```bash
nuclei -u http://target.example.com -tags cve,rce
```

### 按严重级别扫描

```bash
nuclei -u http://target.example.com -severity critical,high
```

---

## 14.4 模板系统详解

### 什么是模板？

模板是YAML格式的文件，定义了检测漏洞的方法。

### 模板结构

```yaml
id: example-template
info:
  name: Example Vulnerability
  author: user
  severity: high
  description: Description of the vulnerability

http:
  - method: GET
    path:
      - "{{BaseURL}}/vulnerable/path"
    matchers:
      - type: status
        status:
          - 200
```

### 模板目录

Nuclei模板存放在`~/nuclei-templates/`目录：
- `cves/`：CVE漏洞模板
- `vulnerabilities/`：通用漏洞模板
- `exposures/`：信息泄露模板
- `technologies/`：技术识别模板

---

## 14.5 模板分类详解

### CVE模板

```bash
nuclei -u http://target.example.com -t cves/
```

扫描已知CVE漏洞。

### 漏洞模板

```bash
nuclei -u http://target.example.com -t vulnerabilities/
```

扫描通用漏洞。

### 信息泄露模板

```bash
nuclei -u http://target.example.com -t exposures/
```

检测敏感信息泄露。

### 技术识别模板

```bash
nuclei -u http://target.example.com -t technologies/
```

识别使用的技术栈。

---

## 14.6 自定义模板详解

### 创建模板

创建文件`my-template.yaml`：

```yaml
id: my-custom-scan
info:
  name: Custom Vulnerability Check
  author: me
  severity: medium
  description: Check for custom vulnerability

http:
  - method: GET
    path:
      - "{{BaseURL}}/admin"
    matchers:
      - type: word
        words:
          - "Admin Panel"
          - "Login"
        condition: or
```

### 使用自定义模板

```bash
nuclei -u http://target.example.com -t my-template.yaml
```

---

## 14.7 实战案例：CVE扫描

### 场景说明

扫描目标的已知CVE漏洞。

### 执行扫描

```bash
nuclei -u http://target.example.com -t cves/ -severity critical,high
```

### 结果分析

```
[CVE-2021-XXXX] [http] [high] http://target.example.com/vulnerable-path
```

---

## 14.8 实战案例：信息泄露检测

### 场景说明

检测目标的敏感信息泄露。

### 执行扫描

```bash
nuclei -u http://target.example.com -t exposures/
```

### 可能发现

- 配置文件泄露
- 敏感信息泄露
- 调试信息泄露

---

## 总结

本章介绍了Nuclei的使用：

1. **安装配置**：工具安装、模板更新
2. **基础扫描**：基本命令和参数
3. **模板系统**：模板结构和分类
4. **自定义模板**：创建自定义模板
5. **实战案例**：CVE扫描、信息泄露检测

Nuclei是最灵活的模板化漏洞扫描工具。

下一章我们将学习OWASP ZAP——Web应用安全扫描器！