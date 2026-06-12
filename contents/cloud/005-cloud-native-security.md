# 云原生安全体系建设：DevSecOps 落地指南

---

## 一、DevSecOps 总体框架

DevSecOps 的核心思想是**安全左移（Shift-Left）**，将安全从"上线前最后一道门槛"变为"贯穿开发全生命周期的质量属性"。

```
  +----------+    +----------+    +---------+    +--------+    +--------+
  |   Plan   |───▶|   Code   |───▶|   Build |───▶|   Test |───▶| Operate|
  +----------+    +----------+    +---------+    +--------+    +--------+
       ▲             ▲               ▲             ▲              ▲
       │             │               │             │              │
     威胁建模    IDE插件+SAST     依赖扫描     DAST/IAST    运行时检测+响应
     (Threat)    (Snyk/CodeQL) (Trivy/OSV)   (OWASP ZAP)  (Falco/SIEM/SOAR)
```

## 二、流水线各阶段安全植入点

| 阶段 | 工具 | 检测目标 | 失败策略 |
|------|------|---------|---------|
| Code Review | SonarQube、Semgrep、CodeQL | 代码漏洞、坏味道 | 阻断 MR |
| Dependency | Snyk、Dependabot、OSV Scanner | 第三方依赖 CVE | 阻断合并（CRITICAL） |
| Container Build | Trivy、Tern、Dockle | 镜像 CVE + 敏感文件 | 阻断推送 |
| IaC | Checkov、tfsec、kics、OPA/Conftest | Terraform / K8s YAML 风险 | 阻断 apply |
| Dynamic Test | OWASP ZAP、Burp Enterprise、 nuclei | 运行时漏洞 | 阻断发布 |
| Runtime | Falco、Tracee、Cilium Tetragon | 异常行为、可疑命令 | 告警 + 自动隔离 |

## 三、CI/CD 流水线示例（GitHub Actions）

```yaml
# .github/workflows/devsecops.yml
name: DevSecOps Pipeline
on: [push, pull_request]

jobs:
  sast-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Semgrep SAST
        run: semgrep ci --config p/owasp-top-ten --config p/secrets
      - name: Snyk Code
        run: snyk code test --severity-threshold=high

  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: OSV Scanner
        run: osv-scanner -r .
      - name: Snyk Open Source
        run: snyk test --severity-threshold=high

  image-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build & Scan
        run: |
          docker build -t myapp:${{ github.sha }} .
          trivy image --severity CRITICAL,HIGH \
            --exit-code 1 myapp:${{ github.sha }}

  iac-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Checkov IaC
        run: checkov -d ./terraform --soft-fail-on LOW
```

## 四、SBOM 与供应链安全

SBOM（Software Bill of Materials）是现代软件供应链安全的基础：

```bash
# 为容器生成 SBOM（CycloneDX 格式）
trivy image --format cyclonedx --output myapp-sbom.json myregistry/myapp:v1

# 用 SBOM 做独立 CVE 扫描（无需重新拉镜像）
trivy sbom myapp-sbom.json

# 签名 + 上传到可审计仓库
cosign sign --key cosign.key myregistry/myapp:v1
```

**SLSA 框架**（Supply-chain Levels for Software Artifacts）共 4 级，企业推荐至少达到 SLSA L2：

| Level | 要求 | 实现方式 |
|-------|------|---------|
| L1 | 生成可审计的构建记录 | 在 CI 生成 provenance |
| L2 | 签名的构建记录 + 防篡改 | GitHub / GitLab OIDC + Sigstore |
| L3 | 不可伪造的来源 + 硬化 CI | Tekton Chains / SLSA Generator |
| L4 | 可复现构建 + 隔离 CI | Bazel + hermetic build |

## 五、运行时安全闭环

仅靠"左移"远远不够，运行时需要**检测 → 响应 → 修复 → 验证**闭环。

```yaml
# 推荐工具链
Detection:     Falco（行为规则）+  Cilium Tetragon（eBPF 内核级）
Enrichment:    接入 CMDB / K8s API / 资产信息
Alerting:      PagerDuty / 钉钉 / 飞书 / 邮件
Response:      Kubernetes 原生（kubectl cordon / label）
Automation:    SOAR：Phantom / Tines / 自研 Python Playbook
```

## 六、落地难点与建议

1. **开发者接受度**：工具过多会拖慢 MR，建议分层控制——LOW 级别只告警、HIGH/CRITICAL 才阻断
2. **假阳性**：Semgrep/CodeQL 规则需要长期调优；维护"例外清单（Suppressions）"
3. **遗留系统**：老项目从 Trivy 基础 CVE 扫描开始，逐步上 SAST/DAST
4. **KPI 度量**：告警响应时间、阻断 MR 比例、修复 MTTR、生产回滚次数

## 七、团队 CheckList

- [ ] 所有 Git 仓库默认 branch 开启分支保护 + Code Review
- [ ] CI 引入 Semgrep + Snyk（至少 HIGH 阻断）
- [ ] 镜像构建使用 Trivy 扫描；仓库启用 cosign 签名
- [ ] Terraform / K8s YAML 走 Checkov/tfsec 检查
- [ ] 生产集群部署 Falco / Tetragon 做运行时检测
- [ ] 建立 SBOM 清单，每季度回顾一次供应链曝光面
