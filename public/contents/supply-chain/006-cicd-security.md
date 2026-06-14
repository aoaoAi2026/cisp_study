# CI/CD 管线安全最佳实践

> **📘 文档定位**：CISP 考试供应链安全实践内容 | 难度：⭐⭐⭐⭐ | 预计阅读：20 分钟
> CI/CD 管线是软件供应链的关键环节。本文从管线威胁模型、凭证管理到构建环境安全，系统梳理 CI/CD 安全最佳实践。

---

## 导航目录
- [一、CI/CD 安全威胁模型](#一cicd-安全威胁模型)

### 1.1 攻击面

```
┌──────────────────────────────────────────────────┐
│                  CI/CD 管线攻击面                  │
├──────────────────────────────────────────────────┤
│ 1. 源码仓库        代码注入 / PR投毒 / 凭据泄露   │
│ 2. 构建触发器      Webhook劫持 / 恶意PR触发      │
│ 3. 构建环境        依赖投毒 / 缓存污染 / 凭证窃取  │
│ 4. CI配置文件      流水线注入 / 提权执行          │
│ 5. 制品仓库        镜像投毒 / 制品篡改            │
│ 6. 部署环境        部署脚本注入 / 集群入侵         │
│ 7. 密钥管理        凭证泄露 / 权限过大            │
│ 8. 第三方集成      供应链攻击 / OAuth劫持         │
└──────────────────────────────────────────────────┘
```

### 1.2 典型攻击案例

```
流水线命令注入 (Pipeline Command Injection):
  build.sh: docker build --build-arg BRANCH=${GITHUB_REF} .
  攻击者创建分支: feature/$(whoami; cat /etc/passwd)
  → 变量未转义 → 命令执行

恶意Action/Plugin:
  GitHub Marketplace中的第三方Action可能窃取Secret
  → 限制使用范围，锁定版本哈希而非标签

依赖缓存投毒:
  CI缓存被污染 → 后续构建使用被篡改的依赖
  → 缓存Key包含构建环境唯一标识
```

---

## 二、平台安全加固

### 2.1 GitHub Actions

```yaml
# ❌ 不安全示例
name: Deploy
on:
  pull_request_target:  # 危险！PR可以访问Secrets
    types: [opened]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          ref: ${{ github.event.pull_request.head.ref }}  # 危险！
      - run: ./deploy.sh ${{ github.event.inputs.env }}   # 未验证的输入

# ✅ 安全示例
name: Deploy
on:
  workflow_dispatch:     # 仅手动触发
    inputs:
      env:
        required: true
        default: 'staging'
        type: choice
        options: ['staging', 'production']  # 限制输入

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read     # 最小权限
      id-token: write    # 仅需要OIDC时
    steps:
      - uses: actions/checkout@v4  # 使用v4
      - name: Validate inputs
        run: |
          # 验证所有外部输入
          echo "${{ github.event.inputs.env }}" | grep -qE '^(staging|production)$'
      - run: ./deploy.sh "${{ github.event.inputs.env }}"
```

### 2.2 GitLab CI

```yaml
# .gitlab-ci.yml 安全最佳实践
stages:
  - build
  - security-scan
  - deploy

variables:
  # 禁止调试输出（可能泄露Secret）
  CI_DEBUG_TRACE: "false"

build:
  stage: build
  tags:
    - secure-runner       # 专用/隔离Runner
  before_script:
    - set -e              # 遇错即停
    - set -o pipefail     # 管道错误传播
  script:
    - docker build --no-cache -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  # 不使用 when: manual 在关键流程中

security-scan:
  stage: security-scan
  script:
    - trivy image --severity CRITICAL --exit-code 1 $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - syft packages $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA -o cyclonedx-json > sbom.json

deploy:
  stage: deploy
  only:
    - main                 # 仅main分支可部署
  script:
    - kubectl set image deployment/app app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

### 2.3 Jenkins

```groovy
// Jenkinsfile 安全实践
pipeline {
    agent {
        kubernetes {
            yaml '''
            apiVersion: v1
            kind: Pod
            spec:
              serviceAccountName: jenkins-sa  # 专用SA
              containers:
              - name: builder
                image: builder:latest
                securityContext:
                  readOnlyRootFilesystem: true   # 只读文件系统
                  runAsNonRoot: true             # 非root用户
                  allowPrivilegeEscalation: false
            '''
        }
    }
    
    environment {
        // 使用Credential Binding，而非直接暴露
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
    }
    
    stages {
        stage('Build') {
            steps {
                script {
                    // 净化所有外部输入
                    def safeBranch = env.BRANCH_NAME.replaceAll('[^a-zA-Z0-9._/-]', '')
                    sh "docker build -t app:${safeBranch} ."
                }
            }
        }
    }
}
```

---

## 三、密钥管理

### 3.1 密钥生命周期管理

```
密钥管理原则：
1. 最小权限：每个密钥只有完成其任务所需的最小权限
2. 短期有效：避免使用长期永久令牌
3. 范围限制：密钥绑定特定仓库/分支/环境
4. 审计追踪：所有密钥使用记录可审计
5. 轮换机制：定期轮换+应急轮换

类型：
├── CI/CD Secret变量（GitHub Secrets / GitLab CI Variables / Jenkins Credentials）
├── OIDC令牌（推荐）：无需存储长期凭证
├── Cloud KMS / HashiCorp Vault：集中管控
└── 环境变量注入（仅运行时获取）
```

### 3.2 OIDC 代替长期凭证

```yaml
# GitHub Actions OIDC + AWS
name: Deploy to AWS
on:
  push:
    branches: [main]
permissions:
  id-token: write  # OIDC认证
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS credentials (OIDC)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/github-actions-role
          aws-region: us-east-1
          # 无需配置 access-key 和 secret-key！
      
      - name: Deploy
        run: aws s3 sync ./build s3://my-bucket/

# AWS IAM Role 信任策略
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::123456789:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:myorg/myrepo:*"
        }
      }
    }
  ]
}
```

### 3.3 密钥扫描

```bash
# GitGuardian (ggshield)
pip install ggshield
ggshield scan path /path/to/repo
ggshield scan ci  # CI集成

# truffleHog
pip install trufflehog3
trufflehog3 --regex --entropy=False /path/to/repo
trufflehog git https://github.com/org/repo --since-commit HEAD~100

# Gitleaks
docker run -v /path/to/repo:/repo zricethezav/gitleaks detect --source /repo
# .gitleaks.toml 配置白名单规则

# git-secrets (AWS开源)
git secrets --scan
git secrets --install  # 自动pre-commit hook
git secrets --register-aws  # AWS密钥格式

# Detect-secrets (Yelp)
pip install detect-secrets
detect-secrets scan > .secrets.baseline
detect-secrets audit .secrets.baseline
```

---

## 四、构建环境安全

### 4.1 构建隔离

```yaml
# 自托管Runner隔离
# GitHub Actions: 每个作业独立K8s Pod
# GitLab Runner: Docker/K8s executor

# 关键配置：
# 1. 每次构建使用干净的容器
# 2. 不缓存敏感文件
# 3. 构建后清理环境
# 4. 网络隔离（内网Runner禁止出公网）

# 示例：禁止在构建容器中持久化凭证
steps:
  - name: Build
    run: |
      docker run --rm \         # 自动清理
        --network none \        # 网络隔离
        --read-only \           # 只读
        --tmpfs /tmp:noexec \   # 临时文件禁止执行
        -v $PWD:/app:ro \       # 只读挂载
        builder:latest
```

### 4.2 流水线注入防御

```bash
# 危险模式：用户可控变量注入Shell命令
# ❌ 不安全
build.sh:
  docker build --build-arg VERSION=${TAG_NAME}

# 攻击者创建tag: v1.0.0; cat /etc/shadow
# → TAG_NAME未转义 → 命令执行

# ✅ 安全做法
build.sh:
  # 净化输入
  SAFE_TAG=$(echo "${TAG_NAME}" | tr -cd '[:alnum:]._-')
  docker build --build-arg VERSION="${SAFE_TAG}"

# 或者使用程序化参数传递
  docker build --build-arg VERSION="$(cat VERSION)"
```

### 4.3 缓存安全

```yaml
# 缓存投毒防御
# GitHub Actions: cache key 包含构建环境唯一标识

# ✅ 安全的缓存策略
- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    # hashFiles确保依赖变更后使用新缓存
    restore-keys: |
      ${{ runner.os }}-node-
  # 限制：不缓存到自托管Runner的持久化存储
```

---

## 五、制品安全扫描

```yaml
# CI/CD安全扫描Pipeline示例
name: Full Security Pipeline
on: [push, pull_request]

jobs:
  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0   # 全量历史（扫描历史提交）
      - name: Secret Scan
        uses: gitleaks/gitleaks-action@v2
        with:
          config-path: .gitleaks.toml

  sca-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trivy SCA Scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: fs
          scanners: vuln,secret,license
          severity: HIGH,CRITICAL
          exit-code: 1

  sast-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Semgrep SAST
        uses: semgrep/semgrep-action@v1
        with:
          config: p/default

  container-scan:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Trivy Image Scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ghcr.io/${{ github.repository }}:${{ github.sha }}
          format: sarif
          output: trivy-results.sarif
      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: trivy-results.sarif
```

---

## 六、安全基线 Checklist

- [ ] CI/CD配置文件（.github/workflows / .gitlab-ci.yml / Jenkinsfile）纳入Code Review
- [ ] 禁止 pull_request_target 事件触发敏感操作
- [ ] 限制 CI Token 权限（Repository → Settings → Actions → Permissions）
- [ ] OIDC代替长期密钥（AWS/GCP/Azure）
- [ ] 使用Gitleaks/GitGuardian扫描密钥泄露
- [ ] 集成SCA扫描（Trivy/Snyk/OSV-Scanner）
- [ ] 集成SAST扫描（Semgrep/CodeQL/SonarQube）
- [ ] 容器镜像安全扫描（Trivy/Grype）
- [ ] 制品签名验证（Cosign/Sigstore）
- [ ] SBOM自动生成（每个构建）
- [ ] 构建环境隔离（干净容器/只读/非root）
- [ ] 净化所有外部输入（分支名/Tag/PR标题等）
- [ ] 启用分支保护规则（PR Review + CI通过 + 签名提交）
- [ ] 内部Runner与外部Runner网络隔离
- [ ] CI/CD审计日志保留（≥90天）

---

## 高分考点与知识巧记

> 🔑 **高分考点**：CI/CD 安全考点集中在管线威胁模型、凭证管理、构建环境隔离。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| 管线威胁 | ⭐⭐⭐⭐ | 代码注入、凭证泄露、依赖投毒、构建环境污染 |
| 凭证管理 | ⭐⭐⭐⭐ | OIDC 短期凭证、Secrets Manager、禁止硬编码 |
| 构建隔离 | ⭐⭐⭐ | 一次构建一个环境，用完即毁(Ephemeral) |

> 💡 **知识巧记**：CI/CD 四威胁记"代凭依构"——代码注入、凭证泄露、依赖投毒、构建污染。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| OIDC 凭证 | 短期自动过期，无需手动管理 | "OIDC 和长期 Token 一样需要轮换" ❌ |
| 构建环境 | Ephemeral 一次性环境，防止持久化后门 | "构建环境可复用" ❌ |

### 知识巧记口诀

> **CI/CD 安全口诀**：
> 四威胁代凭依构，OIDC 短期免手动。
> 构建隔离用完即毁，凭证不硬编码 Secrets 管。
