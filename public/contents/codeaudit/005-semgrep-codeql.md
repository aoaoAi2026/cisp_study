# 代码审计思路与工具：Semgrep / CodeQL

> **📘 文档定位**：CISP 考试代码审计工具链内容 | 难度：⭐⭐⭐ | 预计阅读：18 分钟
> 自动化代码审计是规模化安全左移的基础。本文从 Semgrep 规则编写、CodeQL 污点分析到 CI 流水线集成，系统讲解主流代码审计工具的使用与选型。

---

## 导航目录
- [一、为什么需要自动化代码审计](#一为什么需要自动化代码审计)
- [二、主流工具对比](#二主流工具对比)
- [三、Semgrep 快速上手](#三semgrep-快速上手)
- [四、CodeQL 快速上手](#四codeql-快速上手)
- [五、组合拳思路](#五组合拳思路)
- [六、编写自己的规则 (Semgrep 示例)](#六编写自己的规则-semgrep-示例)
- [七、代码审计工作流](#七代码审计工作流)
- [八、CheckList](#八checklist)
- [九、高分考点与知识巧记](#九高分考点与知识巧记)

---

## 一、为什么需要自动化代码审计

"人肉审计"在现代项目中存在明显短板:

| 问题 | 影响 |
|------|------|
| 代码量大 (10 万 ~ 100 万行) | 人工无法完整覆盖 |
| 新代码每天提交 | 审计赶不上开发节奏 |
| 多语言多框架 | 审计者需掌握所有语言/框架 |
| 逻辑漏洞难以模式匹配 | 自动化无法替代, 但可先筛选可疑点 |

**解决方案**: 自动化规则引擎 + 人工复核 = 规模化 + 精度

## 二、主流工具对比

| 工具 | 厂商 | 模式 | 语言支持 | 学习成本 | 优势 |
|------|------|------|---------|---------|------|
| **Semgrep** | r2c | 类 grep 规则 (类 AST) | Java, Go, PHP, Python, JS/TS, C#, C/C++, Ruby, 20+ | 低 | 规则易写, 社区规则库 (semgrep registry) 大 |
| **CodeQL** | GitHub | Query Language (Datalog) | Python, Java, Go, C#, C/C++, JS/TS, Ruby, Swift | 中高 | 数据/控制流分析, 可表达复杂"源-汇"关系 |
| **SonarQube** | SonarSource | 规则 + 数据流 | Java/JS/TS/PHP/Python/C#/Go/Ruby | 低 | 平台成熟, 有 UI, CI 集成好 |
| **Trivy** | Aqua | 依赖+配置扫描 | 多语言 | 低 | 快速扫描第三方库漏洞与 IaC |
| **grype / syft** | Anchore | SBOM + CVE 扫描 | 多生态 | 低 | 开源, 与 CI 友好 |

## 三、Semgrep 快速上手

### 3.1 基本命令

```bash
# 安装
pip install semgrep

# 跑官方规则 (OWASP Top 10)
semgrep --config p/owasp-top-ten ./src

# 跑 CI 推荐规则
semgrep ci --config p/ci ./src

# 跑某个语言的所有规则
semgrep --config r/java ./java-src
semgrep --config r/javascript ./js-src
```

### 3.2 规则语法速查 (YAML)

```yaml
rules:
  - id: python-subprocess-shell-true
    patterns:
      - pattern: subprocess.run($ARG, shell=True, ...)
      - pattern-not: subprocess.run("...", ...)
      - metavariable-pattern:
          metavariable: $ARG
          pattern: $FUNC(...)
    message: "subprocess.run with shell=True + user-controlled input"
    languages: [python]
    severity: ERROR
```

| 语法 | 含义 |
|------|------|
| `...` | 匹配任意参数 / 语句 (零或多) |
| `$X` / `$VAR` | 通配变量 (metavariable) |
| `pattern:` | 必须出现 |
| `pattern-not:` | 必须不出现 |
| `pattern-inside:` | 在指定结构内匹配 |
| `pattern-either:` | 任一命中 |
| `metavariable-pattern:` | 对 $VAR 再做 pattern |
| `mode: taint` | 污点追踪 source → sanitizer → sink |

### 3.3 Taint Mode (污点追踪)

```yaml
rules:
  - id: flask-tainted-subprocess
    mode: taint
    pattern-sources:
      - pattern: flask.request.args.get(...)
      - pattern: flask.request.form.get(...)
      - pattern: flask.request.data
    pattern-sinks:
      - pattern: subprocess.run($ARG, shell=True, ...)
      - pattern: os.system($ARG)
      - pattern: os.popen($ARG)
    pattern-sanitizers:
      - pattern: shlex.quote(...)
```

### 3.4 常用官方规则包

```
p/owasp-top-ten          OWASP Top 10
p/secrets                密钥/密码硬编码
p/command-injection      命令注入
p/sql-injection          SQL 注入
p/xss                    XSS
p/ssrf                   SSRF
p/jwt                    JWT 安全
p/python-flask           Flask 相关
p/javascript             JS 生态通用
p/cwe-top-25             CWE Top 25
```

## 四、CodeQL 快速上手

### 4.1 基本概念

CodeQL 把源代码当作"数据库", 通过 QL (类 Datalog 查询语言) 搜索代码中的模式。适合表达复杂的"源 → 中间处理 → 汇"跨函数路径。

### 4.2 查询示例 (Python)

```ql
// 查找所有 os.system 调用, 且参数来自某个函数调用
import python

from CallNode sysCall, Expr arg
where
  sysCall.getFunc().(Attribute).getName() = "system" and
  sysCall.getFunc().(Attribute).getObject().getName() = "os" and
  arg = sysCall.getArg(0) and
  arg instanceof CallNode
select sysCall, "os.system() called with $@.", arg, arg.toString()
```

### 4.3 污点传播 (Source-Sink)

```ql
// 查询 Java: Spring controller request param → Runtime.exec()
import java
import semmle.code.java.dataflow.DataFlow

class RequestParamSource extends DataFlow::SourceNode {
  RequestParamSource() {
    exists(Method m |
      m.getAnAnnotation().getType()
        .hasQualifiedName("org.springframework.web.bind.annotation", "RequestMapping") and
      this = m.getAParameter().getAnAccess()
    )
  }
}

class RuntimeExecSink extends DataFlow::SinkNode {
  RuntimeExecSink() {
    exists(MethodAccess ma |
      ma.getMethod().hasName("exec") and
      ma.getMethod().getDeclaringType().hasQualifiedName("java.lang", "Runtime") and
      this = ma.getAnArgument()
    )
  }
}

from RequestParamSource src, RuntimeExecSink sink
where DataFlow::localFlowStep+(src, sink)
select sink, src, "Request param $@ flows to Runtime.exec at $@.",
  src, src.toString(), sink, sink.toString()
```

### 4.4 本地使用

```bash
# 1. 下载 codeql CLI
#    https://github.com/github/codeql-cli-binaries/releases

# 2. 创建数据库
codeql database create ./codeql-db --language=python --source-root=./src

# 3. 运行官方安全查询
codeql database analyze ./codeql-db \
    codeql/python-queries:Security \
    --format=sarif-latest --output=results.sarif

# 4. 在 GitHub Security 标签页查看 (或 VS Code CodeQL 插件)
```

### 4.5 CodeQL 查询包

- `codeql/python-queries`
- `codeql/java-queries`
- `codeql/javascript-queries`
- `codeql/cpp-queries`
- `codeql/go-queries`
- `codeql/csharp-queries`

每个包都有 `Security/`, `Correctness/`, `Maintainability/`, `Performance/`, `Style/` 子目录。

## 五、组合拳思路

```
CI Pipeline:
  ├─ 1. 依赖扫描:        Trivy filesystem --severity CRITICAL,HIGH
  ├─ 2. 密钥扫描:        trufflehog filesystem . --no-update
  ├─ 3. 轻量规则:        semgrep --config p/ci --error
  ├─ 4. 深度规则:        codeql database analyze (夜间, 慢)
  ├─ 5. 自定义规则:      semgrep --config ./security-rules/
  └─ 6. 人工审计:        Code Review + 重点模块深度审计
```

## 六、编写自己的规则 (Semgrep 示例)

### 规则 1: 检测 Python Flask SECRET_KEY 硬编码

```yaml
rules:
  - id: python-flask-hardcoded-secret-key
    pattern-either:
      - pattern: app.config["SECRET_KEY"] = "..."
      - pattern: app.config["SECRET_KEY"] = '...'
      - pattern: SECRET_KEY = "..."
    message: "Flask SECRET_KEY should not be hardcoded; use env var or secret manager"
    languages: [python]
    severity: WARNING
```

### 规则 2: 检测 Java `Runtime.exec`

```yaml
rules:
  - id: java-runtime-exec
    pattern: Runtime.getRuntime().exec($CMD)
    message: "Runtime.exec() detected; audit $CMD source"
    languages: [java]
    severity: WARNING
```

### 规则 3: 检测 PHP 拼接 SQL

```yaml
rules:
  - id: php-sqli-concat
    pattern-either:
      - pattern: $DB->query("..." . $VAR . "...")
      - pattern: sprintf("SELECT ... %s ...", $VAR)
      - pattern: "$SQL ... $VAR ..."
    message: "SQL query constructed by string concat; may have SQL injection"
    languages: [php]
    severity: ERROR
```

## 七、代码审计工作流

```
Step 1. 资产梳理:
        列出代码仓库清单, 按语言/框架分组

Step 2. 依赖分析:
        npm audit / pip-audit / mvn dependency:tree / Trivy
        生成 SBOM → 对照 CVE/NVD

Step 3. 密钥扫描 (pre-commit + CI):
        trufflehog / gitleaks / semgrep p/secrets
        本地 pre-commit hook 阻断敏感数据入库

Step 4. 静态规则 (Semgrep):
        p/owasp-top-ten + p/secrets + 自定义规则
        输出 → 缺陷管理平台 (Jira/GitLab Issues)

Step 5. 深度分析 (CodeQL / SonarQube):
        定期 (每日/每周) 跑跨过程 taint analysis
        关注 Source: request param / form / cookie
                 Sink:   exec / SQL / eval / template

Step 6. 人工审计:
        重点模块: 登录 / 支付 / 文件上传 / 管理后台 / API Gateway
        结合 threat model 做针对性代码走查

Step 7. 闭环:
        修复 → 回归测试 → 新规则加入 (把修复模式固化为规则)
        形成"漏洞 → 规则 → 阻断"的持续安全左移
```

## 八、CheckList

- [ ] 代码库开启 pre-commit (gitleaks / secret-scan)
- [ ] CI 集成 `semgrep ci` 或等效工具, HIGH/ERROR 级别阻断合并
- [ ] CodeQL / SonarQube 定期扫描, 结果纳入安全缺陷看板
- [ ] 依赖扫描: pip-audit / npm audit / Trivy 等
- [ ] 自定义规则覆盖业务特有风险 (特定 API / 内部库)
- [ ] 审计报告记录: 漏洞名称/组件/风险等级/修复建议/责任人/DDL
- [ ] 修复率 ≥ 80% (HIGH/CRITICAL 必须在 7 天内修复)
- [ ] 新功能 MR 做安全 review (至少 1 次/month 做抽样 review)
- [ ] 团队培训: 至少每季度一次安全编码规范培训 + 案例复盘

---

## 九、高分考点与知识巧记

> 🔑 **高分考点**：代码审计工具考点集中在 Semgrep 与 CodeQL 的对比选型、规则语法理解、CI 集成流程。考试不要求写规则代码，但需理解工具定位与适用场景。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| Semgrep vs CodeQL | ⭐⭐⭐⭐ | Semgrep 类 grep 规则易写，CodeQL 数据流分析能力强 |
| Semgrep Taint Mode | ⭐⭐⭐⭐ | source → sanitizer → sink 污点追踪 |
| CodeQL QL 语言 | ⭐⭐⭐ | 类 Datalog 查询，适合跨函数路径分析 |
| CI 工具链组合 | ⭐⭐⭐ | Trivy(依赖) → gitleaks(密钥) → Semgrep(规则) → CodeQL(深度) |
| 审计工作流 | ⭐⭐⭐ | 资产梳理 → 依赖分析 → 密钥扫描 → 静态规则 → 深度分析 → 人工审计 |

> 💡 **知识巧记**：工具选型记"Semgrep 快而广，CodeQL 深而慢"——Semgrep 适合 CI 快速扫描，CodeQL 适合深度污点分析。CI 流水线四件套：Trivy 扫依赖、gitleaks 查密钥、Semgrep 跑规则、CodeQL 做深度。审计七步记"资依密静深人闭"——资产、依赖、密钥、静态、深度、人工、闭环。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| Semgrep 定位 | 模式匹配 + 轻量数据流，CI 友好 | "Semgrep 可替代 CodeQL" ❌ |
| CodeQL 定位 | 深度污点分析，适合复杂路径 | "CodeQL 只支持 Java" ❌ |
| Taint 分析 | source → sanitizer → sink 追踪 | "Semgrep 不支持污点分析" ❌ |
| pre-commit | gitleaks 阻断敏感数据入库 | "pre-commit 影响效率应取消" ❌ |
| 阻断策略 | HIGH/CRITICAL 阻断，LOW/MEDIUM 告警 | "所有级别都阻断合并" ❌ |

### 知识巧记口诀

> **代码审计工具口诀**：
> Semgrep 规则易写快扫描，CodeQL 深度污点路径清。
> CI 流水线四件套，依赖密钥规则深度层层行。
> Taint 模式源净汇，pre-commit 密钥不入库。
> 审计七步闭环成，漏洞规则阻断持续左移升。
